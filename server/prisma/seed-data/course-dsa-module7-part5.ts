/**
 * DSA Complete Course — Module 7: Trees, lesson 5 (final lesson).
 *
 * Tries (prefix trees). Directly contrasts with this course's Module 3
 * hashing lessons: a hash map answers "is this exact string present?"
 * in O(1) average, but cannot answer "which stored strings start with
 * this prefix?" without scanning every stored key — a trie answers
 * prefix queries in time proportional only to the prefix's length,
 * regardless of how many strings are stored. Also builds on this
 * module's lesson 1 node-shape lineage: a linked-list node has one
 * link, a binary tree node has two (left/right), and a trie node
 * generalizes this further to one link PER POSSIBLE CHARACTER (26 for
 * lowercase English letters), branching by character position instead
 * of by comparison result. Broken example: using a hash map (or a
 * plain array of stored strings) to answer "list every stored word
 * starting with this prefix," forcing an O(n) scan of every stored
 * string. Fixed by building a trie, where following the prefix's
 * characters one link at a time arrives directly at the exact subtree
 * containing precisely the matching words, in O(prefix length).
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

export const DSA_MODULE_7_PART5: CourseLesson[] = [
  {
    slug: 'tries-prefix-trees',
    title: 'Tries: Trees Built for Prefix Search',
    titleHi: 'Tries: Prefix Search Ke Liye Banaayi Gayi Trees',
    description: 'This course\'s Module 3 established that a hash map answers "is this exact string stored?" in O(1) average, but has no efficient way to answer "which stored strings start with this prefix?" A trie is a tree where each node has one link per possible character (not just left/right, as this module\'s earlier lessons used) — built specifically to answer prefix queries fast.',
    descriptionHi: 'Is course ke Module 3 ne sthaapit kiya ki ek hash map "kya ye exact string store ki gayi hai?" ka jawaab \`O(1)\` average mein deta hai, par "kaun si stored strings is prefix se shuru hoti hain?" ka jawaab dene ka koi kushal tarika nahi rakhta. Ek trie ek tree hai jahaan har node ke paas prati sambhaavit character ek link hai (sirf left/right nahi, jaisa is module ke pehle ke lessons istemal karte the) — khaas taur par prefix queries ko tez jawaab dene ke liye banaayi gayi.',
    difficulty: 'HARD',
    duration: 25,
    order: 5,

    analogy: {
      en: '**A hotel directory board listing every guest\'s full name alphabetically, versus a hotel where each floor is dedicated to a specific first letter, and within that floor, each wing to a specific second letter, and so on.** This course\'s Module 3 hash map is the directory board: given a guest\'s exact, complete name, it answers "are they staying here?" almost instantly. But asked "list every guest whose name starts with Sh," the directory board offers no shortcut at all — reading down the alphabetical list, every single entry must be checked to see whether it happens to start with those two letters, since the board\'s organization (by full name) does not group names by prefix. The floor-by-letter hotel is built completely differently: to find everyone whose name starts with "Sh," a visitor takes the elevator to the "S" floor, walks to the "h" wing, and finds every single matching guest right there, grouped together — because the hotel\'s entire structure was organized around prefixes from the very first letter onward, rather than around complete names. A trie is built exactly like this floor-by-letter hotel: each node represents having matched one additional character of some prefix, and following characters one at a time, link by link, leads directly to the exact subtree holding every stored word sharing that prefix — with no need to check anything outside that subtree at all.',
      hi: '**Ek hotel directory board jo har guest ka poora naam alphabetically list karta hai, versus ek hotel jahaan har floor ek khaas pehle akshar ke liye samarpit hai, aur us floor ke andar, har wing ek khaas doosre akshar ke liye, aur aise hi aage.** Is course ka Module 3 hash map directory board hai: ek guest ka exact, poora naam diye jaane par, ye lagbhag turant jawaab deta hai "kya wo yahaan reh rahe hain?" Par poochha jaaye "har guest list karo jinka naam Sh se shuru hota hai," directory board koi shortcut bilkul offer nahi karta — alphabetical list neeche padhte hue, har akeli entry check ki jaani chahiye ye dekhne ke liye ki kya ye un do letters se shuru hoti hai, kyunki board ki organization (poore naam se) naamon ko prefix se group nahi karti. Floor-by-letter hotel poori tarah alag banaaya gaya hai: har us vyakti ko dhoondhne ke liye jinka naam "Sh" se shuru hota hai, ek visitor elevator "S" floor tak leta hai, "h" wing tak chalta hai, aur wahaan bilkul har matching guest paata hai, ek saath grouped — kyunki hotel ki poori structure prefixes ke aas-paas organize ki gayi thi bilkul pehle akshar se aage, poore naamon ke aas-paas ke bajaye. Ek trie is floor-by-letter hotel ki tarah bilkul banaayi jaati hai: har node ek prefix ke ek atirikt character ke match hone ko darsata hai, aur characters ko ek-ek karke follow karna, link by link, seedhe us khaas subtree tak le jaata hai jo har stored word rakhta hai jo us prefix ko share karta hai — us subtree ke baahar kuch bhi check karne ki bilkul zaroorat nahi.',
    },

    simple: `**The node shape, contrasted with this module's earlier lessons:**

\`\`\`js
// This module's binary tree node (lesson 1): exactly two links
{ value: 5, left: someNode, right: someOtherNode }

// A trie node: one link PER POSSIBLE CHARACTER, plus an end-of-word flag
{ children: { a: someNode, b: null, ..., z: someNode }, isEndOfWord: false }
\`\`\`

**Start broken.** Storing words in a hash map (or a plain array), then trying to answer "list every word starting with a given prefix":

\`\`\`js
const words = new Set(['cat', 'car', 'card', 'care', 'dog']);

function wordsWithPrefix(words, prefix) {
  const result = [];
  for (const word of words) {          // must check EVERY stored word
    if (word.startsWith(prefix)) result.push(word);
  }
  return result;
}
console.log(wordsWithPrefix(words, 'car')); // ['car', 'card', 'care']
\`\`\`

This works, but this course's Module 3 lessons already established exactly why: a hash map (or a Set, built on the same hashing idea) is organized around exact-match lookup — it can tell you instantly whether \`'car'\` itself is stored, but it has no internal structure that groups together words sharing a prefix. Finding every word starting with \`'car'\` therefore requires checking every single stored word, one at a time — \`O(n)\` in the number of stored words, no matter how short the prefix is.

**The fix: a trie, organized around shared prefixes from the very first character**

\`\`\`js
class TrieNode {
  constructor() {
    this.children = {};      // one link per possible next character
    this.isEndOfWord = false;
  }
}

function insert(root, word) {
  let node = root;
  for (const ch of word) {
    if (!node.children[ch]) node.children[ch] = new TrieNode();
    node = node.children[ch]; // follow (or create) the link for this character
  }
  node.isEndOfWord = true;
}
\`\`\`

\`\`\`ts
class TrieNode {
  children: Record<string, TrieNode> = {};
  isEndOfWord = false;
}

function insert(root: TrieNode, word: string): void {
  let node = root;
  for (const ch of word) {
    if (!node.children[ch]) node.children[ch] = new TrieNode();
    node = node.children[ch];
  }
  node.isEndOfWord = true;
}
\`\`\`

After inserting \`'car'\`, \`'card'\`, \`'care'\`, and \`'cat'\`, walking \`c → a → r\` from the root lands EXACTLY on the node representing the prefix \`'car'\` — and every word sharing that prefix (\`'car'\` itself, \`'card'\`, \`'care'\`) lives somewhere in that node's own subtree, reached purely by following further character links, without ever touching \`'dog'\` or any other word that diverges before reaching \`'car'\` at all.`,

    simpleHi: `**Node ka shape, is module ke pehle ke lessons se contrast kiya gaya:**

\`\`\`js
// Is module ka binary tree node (lesson 1): bilkul do links
{ value: 5, left: someNode, right: someOtherNode }

// Ek trie node: PRATI SAMBHAAVIT CHARACTER ek link, plus ek end-of-word flag
{ children: { a: someNode, b: null, ..., z: someNode }, isEndOfWord: false }
\`\`\`

**Toote hue se shuru.** Words ko ek hash map (ya ek saadhaaran array) mein store karna, phir "ek diye gaye prefix se shuru hone waale har word ko list karo" ka jawaab dene ki koshish:

\`\`\`js
const words = new Set(['cat', 'car', 'card', 'care', 'dog']);

function wordsWithPrefix(words, prefix) {
  const result = [];
  for (const word of words) {          // har stored word check karna zaruri hai
    if (word.startsWith(prefix)) result.push(word);
  }
  return result;
}
console.log(wordsWithPrefix(words, 'car')); // ['car', 'card', 'care']
\`\`\`

Ye kaam karta hai, par is course ke Module 3 lessons ne pehle hi bilkul kyun sthaapit kiya: ek hash map (ya ek Set, usi hashing idea par banaayi gayi) exact-match lookup ke aas-paas organize ki gayi hai — ye aapko turant bata sakti hai ki kya \`'car'\` khud store hai, par iske paas koi internal structure nahi hai jo words ko jo ek prefix share karte hain saath group karta hai. \`'car'\` se shuru hone waale har word ko dhoondhna isliye har akele stored word ko check karna chahta hai, ek baar mein ek — \`O(n)\` stored words ki tadaad mein, chahe prefix kitna bhi chhota ho.

**Fix: ek trie, bilkul pehle character se shared prefixes ke aas-paas organize ki gayi**

\`\`\`js
class TrieNode {
  constructor() {
    this.children = {};      // prati sambhaavit agle character ek link
    this.isEndOfWord = false;
  }
}

function insert(root, word) {
  let node = root;
  for (const ch of word) {
    if (!node.children[ch]) node.children[ch] = new TrieNode();
    node = node.children[ch]; // is character ke liye link follow karo (ya banaao)
  }
  node.isEndOfWord = true;
}
\`\`\`

\`\`\`ts
class TrieNode {
  children: Record<string, TrieNode> = {};
  isEndOfWord = false;
}

function insert(root: TrieNode, word: string): void {
  let node = root;
  for (const ch of word) {
    if (!node.children[ch]) node.children[ch] = new TrieNode();
    node = node.children[ch];
  }
  node.isEndOfWord = true;
}
\`\`\`

\`'car'\`, \`'card'\`, \`'care'\`, aur \`'cat'\` insert karne ke baad, root se \`c → a → r\` chalna BILKUL us node par utarta hai jo prefix \`'car'\` ko darsata hai — aur har word jo us prefix ko share karta hai (\`'car'\` khud, \`'card'\`, \`'care'\`) us node ke apne subtree mein kahin rehta hai, sirf aur character links follow karke pahunchi jaati hai, \`'dog'\` ya kisi bhi doosre word ko kabhi chhue bina jo \`'car'\` tak pahunchne se pehle hi alag ho jaata hai.`,

    content: `## Search and prefix-listing, both walking one character at a time

\`\`\`js
function search(root, word) {
  let node = root;
  for (const ch of word) {
    if (!node.children[ch]) return false; // this exact character path doesn't exist
    node = node.children[ch];
  }
  return node.isEndOfWord; // reached the node, but is it marked as a complete word?
}

function startsWith(root, prefix) {
  let node = root;
  for (const ch of prefix) {
    if (!node.children[ch]) return null; // no stored word has this prefix at all
    node = node.children[ch];
  }
  return node; // the exact node representing this prefix
}
\`\`\`

\`search\` and \`startsWith\` share almost identical logic — walk one character at a time, following each link, failing immediately if a needed link does not exist. The one genuine difference: \`search\` additionally checks \`node.isEndOfWord\` at the end, because reaching the node for \`'car'\` does not by itself mean \`'car'\` was ever inserted as a complete word — it might only exist because \`'card'\` or \`'care'\` was inserted, passing through the \`'car'\` node on the way to their own, longer endings. \`startsWith\` has no such requirement — merely reaching the prefix's node at all is sufficient, since every word beneath it in the trie, by construction, shares that exact prefix.

## Collecting every word under a prefix, once its node is found

\`\`\`js
function collectWords(node, prefix, result = []) {
  if (node.isEndOfWord) result.push(prefix);
  for (const ch in node.children) {
    collectWords(node.children[ch], prefix + ch, result); // this module's own recursion pattern
  }
  return result;
}

function wordsWithPrefix(root, prefix) {
  const node = startsWith(root, prefix);
  if (node === null) return [];
  return collectWords(node, prefix);
}
\`\`\`

\`collectWords\` is a direct application of this course's Module 6 recursion lesson and this module's own tree-traversal lessons: walk into every child link, recursively, and record the accumulated prefix whenever a node marked \`isEndOfWord\` is reached — this is genuinely the same "visit and recurse into every child" shape this module's binary-tree traversal lessons used, generalized from exactly two children to however many character-links a given node happens to have. Cost-wise, this only ever explores nodes that are genuinely part of the answer (nodes beneath the prefix's own node) — it never touches \`'dog'\` or any other word that diverged before reaching the prefix, exactly the improvement this lesson's broken example lacked.

## Why trie operations cost O(word length), not O(number of stored words)

\`\`\`
Hash map / Set:  exact match is O(1) average, but prefix search is
                 O(n) — must check every stored string individually

Trie:            search, insert, AND startsWith are all O(L), where L
                 is the length of the word or prefix — completely
                 independent of how many words are stored overall
\`\`\`

Every operation in this lesson walks exactly one link per character of the word or prefix involved, and nothing more — the number of steps depends only on how long that specific string is, never on how many OTHER words happen to be stored in the trie alongside it. This is the concrete payoff of organizing a data structure around prefixes rather than around exact-match hashing, as this course's Module 3 lessons did: a trie trades away some of a hash map's raw simplicity and space efficiency in exchange for making prefix-shaped queries — autocomplete, spell-check suggestion, routing-table longest-prefix lookups — genuinely fast regardless of how large the overall stored vocabulary grows.`,

    contentHi: `## Search aur prefix-listing, dono ek baar mein ek character chalte hue

\`\`\`js
function search(root, word) {
  let node = root;
  for (const ch of word) {
    if (!node.children[ch]) return false; // ye exact character path maujood nahi hai
    node = node.children[ch];
  }
  return node.isEndOfWord; // node tak pahunche, par kya ye ek poore word ki tarah marked hai?
}

function startsWith(root, prefix) {
  let node = root;
  for (const ch of prefix) {
    if (!node.children[ch]) return null; // koi bhi stored word bilkul ye prefix nahi rakhta
    node = node.children[ch];
  }
  return node; // is prefix ko darsata bilkul node
}
\`\`\`

\`search\` aur \`startsWith\` lagbhag identical logic share karte hain — ek baar mein ek character chalo, har link follow karte hue, turant fail hote hue agar zaruri link maujood nahi hai. Ek asli antar: \`search\` atirikt roop se ant mein \`node.isEndOfWord\` check karta hai, kyunki \`'car'\` ke node tak pahunchna apne aap mein matlab nahi hai ki \`'car'\` kabhi ek poore word ki tarah insert kiya gaya — ye sirf isliye maujood ho sakta hai kyunki \`'card'\` ya \`'care'\` insert kiya gaya tha, \`'car'\` node se guzarte hue apne khud ke, lambe endings ki taraf. \`startsWith\` ki koi aisi zaroorat nahi hai — sirf prefix ke node tak pahunchna hi kaafi hai, kyunki trie mein iske neeche har word, construction ke hisaab se, bilkul wahi prefix share karta hai.

## Ek prefix ke neeche har word collect karna, ek baar iska node mil jaaye

\`\`\`js
function collectWords(node, prefix, result = []) {
  if (node.isEndOfWord) result.push(prefix);
  for (const ch in node.children) {
    collectWords(node.children[ch], prefix + ch, result); // is module ka apna recursion pattern
  }
  return result;
}

function wordsWithPrefix(root, prefix) {
  const node = startsWith(root, prefix);
  if (node === null) return [];
  return collectWords(node, prefix);
}
\`\`\`

\`collectWords\` is course ke Module 6 recursion lesson aur is module ke apne tree-traversal lessons ka ek seedha application hai: har child link mein chalo, recursively, aur accumulated prefix ko record karo jab bhi ek node jo \`isEndOfWord\` marked hai pahunchi jaati hai — ye sach mein wahi "dekho aur har child mein recurse karo" shape hai jo is module ke binary-tree traversal lessons istemal karte the, bilkul do bachchon se generalize kiya gaya jitne bhi character-links ek diye gaye node ke paas hon. Cost ke hisaab se, ye sirf un nodes ko explore karta hai jo sach mein jawaab ka hissa hain (prefix ke apne node ke neeche ke nodes) — ye kabhi \`'dog'\` ya kisi bhi doosre word ko nahi chhoota jo prefix tak pahunchne se pehle hi alag ho gaya, bilkul wo sudhaar jo is lesson ka toota example nahi rakhta tha.

## Trie operations O(word length) kyun kharch karte hain, O(stored words ki tadaad) nahi

\`\`\`
Hash map / Set:  exact match O(1) average hai, par prefix search
                 O(n) hai — har stored string ko alag se check karna zaruri hai

Trie:            search, insert, AUR startsWith sab O(L) hain, jahaan
                 L word ya prefix ki length hai — poori tarah
                 azaad ki kitne words overall store kiye gaye hain
\`\`\`

Is lesson mein har operation bilkul word ya prefix mein shaamil har character ke liye ek link chalta hai, aur kuch nahi — steps ki tadaad sirf is baat par nirbhar karti hai ki wo khaas string kitni lambi hai, kabhi is baat par nahi ki kitne AUR words trie mein iske saath store kiye gaye hain. Ye ek data structure ko exact-match hashing ke aas-paas ke bajaye prefixes ke aas-paas organize karne ka thos faayda hai, jaisa is course ke Module 3 lessons ne kiya: ek trie ek hash map ki kuch raw simplicity aur space efficiency ke badle prefix-shaped queries — autocomplete, spell-check suggestion, routing-table longest-prefix lookups — ko sach mein tez banaata hai chahe overall stored vocabulary kitni bhi badi ho.`,

    examples: [
      {
        title: 'Broken: scanning every stored word to find those matching a prefix',
        titleHi: 'Toota: ek prefix se mel khaate words dhoondhne ke liye har stored word scan karna',
        code: `for (const word of words) {
  if (word.startsWith(prefix)) result.push(word);
}`,
        codeJs: `const words = new Set(['cat', 'car', 'card', 'care', 'dog']);
function wordsWithPrefix(words, prefix) {
  const result = [];
  for (const word of words) {
    if (word.startsWith(prefix)) result.push(word);
  }
  return result;
}
console.log(wordsWithPrefix(words, 'car')); // ['car', 'card', 'care']`,
        codeTs: `function wordsWithPrefix(words: Set<string>, prefix: string): string[] {
  const result: string[] = [];
  for (const word of words) {
    if (word.startsWith(prefix)) result.push(word);
  }
  return result;
}`,
        output: `['car', 'card', 'care'] — correct, but every single stored word
had to be individually checked, O(n) regardless of prefix length.`,
        explain: 'A Set (built on hashing, as this course\'s Module 3 established) has no internal grouping by prefix, so finding prefix matches requires checking every stored entry individually.',
        explainHi: 'Ek Set (hashing par banaayi gayi, jaisa is course ke Module 3 ne sthaapit kiya) ke paas prefix se koi internal grouping nahi hai, isliye prefix matches dhoondhne ke liye har stored entry ko alag se check karna zaruri hai.',
      },
      {
        title: 'Fixed: building a trie, then walking directly to the prefix\'s node',
        titleHi: 'Theek: ek trie banaana, phir seedhe prefix ke node tak chalna',
        code: `for (const ch of word) {
  if (!node.children[ch]) node.children[ch] = new TrieNode();
  node = node.children[ch];
}
node.isEndOfWord = true;`,
        codeJs: `class TrieNode {
  constructor() { this.children = {}; this.isEndOfWord = false; }
}
function insert(root, word) {
  let node = root;
  for (const ch of word) {
    if (!node.children[ch]) node.children[ch] = new TrieNode();
    node = node.children[ch];
  }
  node.isEndOfWord = true;
}
const trieRoot = new TrieNode();
for (const w of ['cat', 'car', 'card', 'care', 'dog']) insert(trieRoot, w);`,
        codeTs: `class TrieNode {
  children: Record<string, TrieNode> = {};
  isEndOfWord = false;
}
function insert(root: TrieNode, word: string): void {
  let node = root;
  for (const ch of word) {
    if (!node.children[ch]) node.children[ch] = new TrieNode();
    node = node.children[ch];
  }
  node.isEndOfWord = true;
}`,
        outputJs: `A trie where walking c -> a -> r from the root lands exactly on
the node whose subtree holds car, card, and care — never dog.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Each character insertion follows or creates exactly one link, building a structure organized around shared prefixes from the very first character onward.',
        explainHi: 'Har character insertion bilkul ek link follow ya banaata hai, ek structure banaate hue jo bilkul pehle character se aage shared prefixes ke aas-paas organize ki gayi hai.',
      },
      {
        title: 'Answering the prefix query in O(prefix length), not O(number of words)',
        titleHi: 'Prefix query ka jawaab O(prefix length) mein, O(words ki tadaad) mein nahi',
        code: `const node = startsWith(root, prefix);
return collectWords(node, prefix);`,
        codeJs: `function startsWith(root, prefix) {
  let node = root;
  for (const ch of prefix) {
    if (!node.children[ch]) return null;
    node = node.children[ch];
  }
  return node;
}
function collectWords(node, prefix, result = []) {
  if (node.isEndOfWord) result.push(prefix);
  for (const ch in node.children) collectWords(node.children[ch], prefix + ch, result);
  return result;
}
function wordsWithPrefix(root, prefix) {
  const node = startsWith(root, prefix);
  return node === null ? [] : collectWords(node, prefix);
}
console.log(wordsWithPrefix(trieRoot, 'car')); // ['car', 'card', 'care']`,
        codeTs: `function wordsWithPrefix(root: TrieNode, prefix: string): string[] {
  let node = root;
  for (const ch of prefix) {
    if (!node.children[ch]) return [];
    node = node.children[ch];
  }
  const result: string[] = [];
  const collect = (n: TrieNode, acc: string) => {
    if (n.isEndOfWord) result.push(acc);
    for (const ch in n.children) collect(n.children[ch], acc + ch);
  };
  collect(node, prefix);
  return result;
}`,
        outputJs: `['car', 'card', 'care'] — reached by walking exactly 3 links
(c, a, r) then exploring only the subtree beneath them, never
touching 'dog' or any other diverging word at all.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Walking to the prefix\'s node costs exactly one step per character in the prefix; collecting results only ever visits nodes that are genuinely part of the answer.',
        explainHi: 'Prefix ke node tak chalna bilkul prefix mein har character ke liye ek step kharch karta hai; nateeje collect karna sirf un nodes ko visit karta hai jo sach mein jawaab ka hissa hain.',
      },
    ],

    mistakes: [
      {
        wrong: `for (const word of allWords) {
  if (word.startsWith(prefix)) result.push(word); // O(n) every time
}`,
        right: `const node = startsWith(trieRoot, prefix);
return node === null ? [] : collectWords(node, prefix); // O(prefix length) to locate`,
        why: 'A hash map or plain array has no structure grouping words by shared prefix, so prefix queries against it always cost O(n); a trie is organized specifically to avoid this.',
        whyHi: 'Ek hash map ya saadhaaran array ke paas words ko shared prefix se group karne waali koi structure nahi hai, isliye ispar prefix queries hamesha \`O(n)\` kharch karti hain; ek trie khaas taur par ise avoid karne ke liye organize ki gayi hai.',
      },
      {
        wrong: `function search(root, word) {
  let node = root;
  for (const ch of word) {
    if (!node.children[ch]) return false;
    node = node.children[ch];
  }
  return true; // WRONG — reaching the node doesn't mean this exact word was inserted
}`,
        right: `function search(root, word) {
  ...
  return node.isEndOfWord; // required — the node might exist only because a LONGER word passes through it
}`,
        why: 'Reaching a node by following a word\'s characters only confirms that path exists — it does not confirm this exact word was ever inserted, since a longer stored word could pass through the same node.',
        whyHi: 'Ek word ke characters follow karke ek node tak pahunchna sirf confirm karta hai ki wo path maujood hai — ye confirm nahi karta ki bilkul ye word kabhi insert kiya gaya, kyunki ek lamba stored word usi node se guzar sakta hai.',
      },
      {
        wrong: `class TrieNode {
  constructor() { this.children = {}; } // forgot isEndOfWord entirely
}`,
        right: `class TrieNode {
  constructor() { this.children = {}; this.isEndOfWord = false; } // required to distinguish "a word ends here" from "just a path"`,
        why: 'Without isEndOfWord, a trie cannot distinguish a node that marks a genuinely inserted word from one that is merely an intermediate step on the way to a longer word.',
        whyHi: '\`isEndOfWord\` ke bina, ek trie ek aise node ko alag nahi kar sakti jo ek sach mein insert kiya gaya word darsata hai us se jo sirf ek lambe word ki taraf ek beech ka step hai.',
      },
    ],

    realWorld: [
      {
        en: '**Real autocomplete and search-suggestion features (in search engines, IDEs, and phone keyboards) are built directly on tries, specifically because they need "every completion of what has been typed so far" fast, as characters are typed one at a time.**',
        hi: '**Asli autocomplete aur search-suggestion features (search engines, IDEs, aur phone keyboards mein) seedhe tries par banaaye jaate hain, khaas taur par kyunki unhe "ab tak type kiya gaya har completion" tez chahiye, jaise characters ek-ek karke type kiye jaate hain.**',
      },
      {
        en: '**Real network routers use a trie-like structure (a "longest prefix match" trie) to decide where to forward internet traffic, matching a destination address against the longest stored network-address prefix.**',
        hi: '**Asli network routers ek trie-jaisi structure ("longest prefix match" trie) istemal karte hain internet traffic ko kahaan forward karna hai decide karne ke liye, ek destination address ko sabse lambe stored network-address prefix se match karte hue.**',
      },
      {
        en: '**Real spell-checkers use tries both to check whether a word is valid (search) and to suggest completions or corrections (prefix listing), leaning on exactly the two operations this lesson covered.**',
        hi: '**Asli spell-checkers tries istemal karte hain dono ye check karne ke liye ki kya ek word valid hai (search) aur completions ya corrections suggest karne ke liye (prefix listing), bilkul un do operations par nirbhar karte hue jo is lesson ne cover kiye.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why can a hash map answer exact-match queries in O(1) average but not prefix queries efficiently, while a trie answers both search and prefix queries in time proportional only to the string\'s length?',
        qHi: 'Ek hash map exact-match queries ka \`O(1)\` average mein jawaab kyun de sakta hai par prefix queries ka kushal roop se nahi, jabki ek trie search aur prefix queries dono ka jawaab string ki length ke anupaat mein hi samay mein deta hai?',
        a: 'This course\'s Module 3 established that a hash map works by feeding an entire key through a hash function, which produces a number used directly as (or to derive) a storage location — critically, this hash function is designed so that two DIFFERENT strings, even ones sharing every character except the very last one, typically produce completely unrelated hash values and therefore land in completely unrelated storage locations. This is precisely what makes exact-match lookup so fast: given the exact key, one hash computation goes directly to the right spot. But it is also precisely why prefix queries cannot be answered efficiently: there is no relationship between the storage locations of "car" and "card" and "care" that a hash map\'s structure exposes, since hashing intentionally scatters similar strings apart rather than grouping them — answering "which stored strings start with car" therefore requires checking each stored string individually, since nothing about the hash map\'s internal organization identifies which subset shares that prefix. A trie is organized by the exact opposite principle: rather than hashing an entire string at once, it walks the string one character at a time, and — crucially — every string sharing the same first k characters is GUARANTEED to walk through the exact same sequence of k nodes before their paths can possibly diverge. This means all strings sharing a given prefix are always found together, in the single subtree reachable by walking that prefix\'s characters, with no exceptions and no scattering. Both search and prefix-listing exploit this same structural guarantee: walking to a specific node (whether for an exact word or just a prefix) costs one step per character walked, entirely independent of how many total strings happen to be stored in the trie, which is why both operations cost O(word length) or O(prefix length) rather than O(n).',
        aHi: 'Is course ke Module 3 ne sthaapit kiya ki ek hash map poori key ko ek hash function ke zariye pass karke kaam karta hai, jo ek number banaata hai jo seedhe (ya nikaalne ke liye) ek storage location ki tarah istemal hota hai — mahatvapoorn baat, ye hash function is tarah design ki gayi hai ki do ALAG strings, chahe wo har character share karti hon sirf bilkul aakhri ke alaava, typically poori tarah asambandhit hash values banaati hain aur isliye poori tarah asambandhit storage locations mein utarti hain. Ye bilkul wo hai jo exact-match lookup ko itna tez banaata hai: exact key diye jaane par, ek hash computation seedhe sahi jagah jaata hai. Par ye bhi bilkul kyun hai prefix queries ka kushal roop se jawaab nahi diya jaa sakta: "car" aur "card" aur "care" ki storage locations ke beech koi relationship nahi hai jo ek hash map ki structure expose karti hai, kyunki hashing jaan-boojhkar samaan strings ko alag bikhereti hai unhe group karne ke bajaye — "kaun si stored strings car se shuru hoti hain" ka jawaab dena isliye har stored string ko alag se check karna chahta hai, kyunki hash map ki internal organization ke baare mein kuch bhi ye pehchaanta nahi ki kaun sa subset us prefix ko share karta hai. Ek trie bilkul ulte principle se organize ki jaati hai: poori string ko ek saath hash karne ke bajaye, ye string ko ek baar mein ek character chalti hai, aur — mahatvapoorn baat — wahi pehle k characters share karne waali har string GUARANTEED hai bilkul usi k nodes ki sequence se chalne ke liye unke paths poori tarah alag hone se pehle. Iska matlab hai ek diye gaye prefix ko share karne waali sab strings hamesha ek saath milti hain, ek akele subtree mein jo us prefix ke characters chalke pahunchi jaati hai, koi exceptions aur koi bikhraav nahi. Search aur prefix-listing dono isi structural guarantee ka istemal karte hain: ek khaas node tak chalna (chahe ek exact word ke liye ho ya sirf ek prefix ke liye) chale gaye har character ke liye ek step kharch karta hai, poori tarah azaad ki trie mein kitni total strings store ki gayi hain, jo bilkul kyun hai dono operations \`O(word length)\` ya \`O(prefix length)\` kharch karte hain \`O(n)\` ke bajaye.',
      },
      {
        q: 'Why is the isEndOfWord flag necessary on every trie node, and specifically what would go wrong if search simply returned true whenever it successfully reached the final node while walking a word\'s characters?',
        qHi: '\`isEndOfWord\` flag har trie node par kyun zaruri hai, aur khaas taur par kya galat hoga agar \`search\` bas true return kare jab bhi ye ek word ke characters chalte hue safaltapoorvak aakhri node tak pahunchta hai?',
        a: 'A trie\'s nodes represent PATHS through characters, not necessarily complete, inserted words — a specific node can genuinely exist in the trie purely as an intermediate step on the way to some longer word, without the shorter string ending at that node ever having been inserted itself. Concretely, inserting only the single word "card" (without ever separately inserting "car") still creates individual nodes for c, then ca, then car, then card, purely as a side effect of walking through those characters to reach card\'s own final node — the node reached after walking just "car" genuinely exists in the trie\'s structure, but "car" itself was never inserted as its own complete word. If search simply returned true whenever it successfully walked all of a target word\'s characters without hitting a missing link, searching for "car" after only inserting "card" would incorrectly return true, since the path for "car" does exist (it just happens to also continue on to "card") — this would be a genuine false positive, incorrectly reporting a word as stored when it was never actually inserted as a complete word in its own right. The isEndOfWord flag exists specifically to distinguish these two genuinely different situations using the same underlying node structure: a node is marked isEndOfWord = true only at the exact moment some insert call\'s walk finishes on it, meaning that flag being true is a direct, reliable record that this specific character sequence was itself deliberately inserted as a complete word, rather than merely being a waypoint on the way to something longer.',
        aHi: 'Ek trie ke nodes characters ke zariye PATHS darsate hain, zaroori nahi ki poore, insert kiye gaye words — ek khaas node sach mein trie mein sirf ek beech ka step ki tarah maujood ho sakta hai kisi lambe word ki taraf, chhoti string us node par khatam hone ke bina khud kabhi insert kiye gaye. Thos roop se, sirf akela word "card" insert karna (kabhi alag se "car" insert kiye bina) abhi bhi c, phir ca, phir car, phir card ke liye individual nodes banaata hai, sirf un characters se guzarte hue card ke apne aakhri node tak pahunchne ke side effect ki tarah — sirf "car" chalne ke baad pahunchi gayi node sach mein trie ki structure mein maujood hai, par "car" khud kabhi apna poora word ki tarah insert nahi kiya gaya. Agar \`search\` bas true return karti jab bhi ye safaltapoorvak target word ke sab characters chal chuki bina koi missing link takraaye, "card" sirf insert karne ke baad "car" search karna galat tarike se true return karta, kyunki "car" ka path maujood hai (ye bas samyog se "card" tak bhi jaari rehta hai) — ye ek asli false positive hoga, galat tarike se ek word ko stored report karte hue jab ye asal mein kabhi apne khud ke poore word ki tarah insert nahi kiya gaya. \`isEndOfWord\` flag khaas taur par isi underlying node structure ka istemal karte hue in do sach mein alag situations ko alag karne ke liye maujood hai: ek node \`isEndOfWord = true\` marked hai sirf bilkul us pal jab kisi insert call ki chaal ispar khatam hoti hai, matlab wo flag true hona ek seedha, reliable record hai ki ye khaas character sequence khud jaan-boojhkar ek poore word ki tarah insert ki gayi thi, sirf kisi lambe cheez ki taraf ek waypoint hone ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build the trie from this lesson by inserting cat, car, card, care, and dog. Trace, by hand, the exact sequence of nodes created for each word, noting which words share nodes with each other.',
        taskHi: 'Is lesson ki trie banao \`cat\`, \`car\`, \`card\`, \`care\`, aur \`dog\` insert karke. Haath se, har word ke liye banaaye gaye nodes ki bilkul sequence trace karo, note karte hue kaun se words ek doosre ke saath nodes share karte hain.',
        hint: 'cat, car, card, and care all share the same first two nodes (c, then ca) before diverging.',
        hintHi: '\`cat\`, \`car\`, \`card\`, aur \`care\` sab wahi pehle do nodes share karte hain (c, phir ca) alag hone se pehle.',
      },
      {
        task: 'Implement search and confirm that searching for "car" after inserting only "card" (never "car" itself) correctly returns false, while searching for "card" returns true.',
        taskHi: '\`search\` implement karo aur confirm karo ki sirf "card" insert karne ke baad (kabhi "car" khud nahi) "car" search karna sahi tarike se false return karta hai, jabki "card" search karna true return karta hai.',
        hint: 'The node for "car" exists in this trie (as a step toward "card"), but its isEndOfWord flag should remain false.',
        hintHi: '"car" ke liye node is trie mein maujood hai ("card" ki taraf ek step ki tarah), par iska \`isEndOfWord\` flag false rehna chahiye.',
      },
      {
        task: 'Implement wordsWithPrefix and confirm it returns [\'car\', \'card\', \'care\'] for the prefix "car", and an empty array for a prefix like "z" that no stored word starts with.',
        taskHi: '\`wordsWithPrefix\` implement karo aur confirm karo ye prefix "car" ke liye \`[\'car\', \'card\', \'care\']\` return karta hai, aur ek khaali array ek prefix jaise "z" ke liye jisse koi stored word shuru nahi hota.',
        hint: 'The empty-array case should be handled by startsWith returning null the moment a needed character link is missing.',
        hintHi: 'Khaali-array case ko handle kiya jaana chahiye \`startsWith\` dwara null return karke bilkul us pal jab ek zaruri character link maujood nahi hai.',
      },
    ],

    keyTakeaways: [
      'A trie node has one link per possible character (not two, as this module\'s binary tree nodes had) — a direct generalization of this module\'s node-shape lineage from linked list to binary tree to trie.',
      'This course\'s Module 3 hash map answers "is this exact string stored?" in O(1) average but cannot efficiently answer prefix queries, since hashing intentionally scatters similar strings apart.',
      'A trie groups every stored string sharing a prefix into the same subtree, because strings sharing the same first k characters are guaranteed to walk through the same k nodes before diverging.',
      'search must check isEndOfWord in addition to successfully walking every character, because reaching a node only confirms a path exists, not that this exact word was itself inserted.',
      'Both search and prefix-listing cost O(string length), completely independent of how many total words are stored in the trie — the concrete payoff of organizing around prefixes rather than exact-match hashing.',
      'Collecting every word beneath a prefix\'s node reuses this course\'s Module 6 recursion pattern and this module\'s own tree-traversal shape, generalized from two children to however many character-links a node has.',
    ],
    keyTakeawaysHi: [
      'Ek trie node ke paas prati sambhaavit character ek link hai (do nahi, jaisa is module ke binary tree nodes ke paas thi) — is module ke node-shape lineage ka linked list se binary tree se trie tak ek seedha generalization.',
      'Is course ka Module 3 hash map "kya ye exact string stored hai?" ka jawaab \`O(1)\` average mein deta hai par prefix queries ka kushal roop se jawaab nahi de sakta, kyunki hashing jaan-boojhkar samaan strings ko alag bikhereti hai.',
      'Ek trie har stored string ko jo ek prefix share karti hai usi subtree mein group karti hai, kyunki wahi pehle k characters share karne waali strings guaranteed hain wahi k nodes se chalne ke liye alag hone se pehle.',
      '\`search\` ko \`isEndOfWord\` check karna chahiye har character safaltapoorvak chalne ke atirikt, kyunki ek node tak pahunchna sirf confirm karta hai ki ek path maujood hai, ye nahi ki bilkul ye word khud insert kiya gaya.',
      'Dono \`search\` aur prefix-listing \`O(string length)\` kharch karte hain, poori tarah azaad ki trie mein kitne total words store kiye gaye hain — prefixes ke aas-paas organize karne ka thos faayda exact-match hashing ke bajaye.',
      'Ek prefix ke node ke neeche har word collect karna is course ke Module 6 recursion pattern aur is module ke apne tree-traversal shape ko dobara istemal karta hai, do bachchon se generalize kiya gaya jitne bhi character-links ek node ke paas hon.',
    ],
  },
];
