import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Trie (prefix tree) — new category, gap-fill batch. A gap-audit of the DSA
 * bank found zero Trie coverage despite it being a core interview pattern
 * for prefix/dictionary problems. Covers the trie itself, wildcard search,
 * prefix-based dictionary queries, prefix-sum aggregation, and the classic
 * hard grid+trie combination (Word Search II).
 */
export const dsaExtraTrie: SeedProblem[] = [
  {
    slug: 'implement-trie',
    title: 'Implement Trie (Prefix Tree)',
    category: 'Trie',
    difficulty: 'EASY',
    description:
      'Implement a trie supporting `insert(word)`, `search(word)` (exact match), and `startsWith(prefix)` (any word begins with this prefix).\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `OP arg` where `OP` is `insert`, `search`, or `startsWith`\n\n**Output**\nFor each `search`/`startsWith` op, `true` or `false` on its own line (nothing printed for `insert`).',
    descriptionHi:
      'Ek trie implement karo jo `insert(word)`, `search(word)` (exact match), aur `startsWith(prefix)` (koi word is prefix se shuru hota hai) support kare.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `OP arg` jahan `OP` `insert`, `search`, ya `startsWith` hai\n\n**Output**\nHar `search`/`startsWith` op ke liye, `true` ya `false` apni line par (`insert` ke liye kuch print nahi hota).',
    examples: [
      { input: '5\ninsert apple\nsearch apple\nsearch app\nstartsWith app\ninsert app', output: 'true\nfalse\ntrue' },
    ],
    constraints: ['1 <= n <= 3*10^4', '1 <= word/prefix length <= 20', 'lowercase English letters only'],
    hints: [
      'Each trie node holds a map/array of up to 26 children (one per letter) plus a flag marking "a word ends exactly here".',
      'insert walks the tree letter by letter, creating a new child node whenever the next letter is missing, then marks the final node as a word-end.',
      'search and startsWith share almost all their logic (walk letter by letter, fail if a child is missing) — they differ only in the final check: search additionally requires the end node\'s word-end flag to be true, startsWith does not.',
    ],
    approach:
      "Each node is an object with a `children` map (letter -> node) and an `isWord` boolean. insert(word): walk from the root, creating a child for each letter not yet present, then set `isWord = true` on the final node. search(word): walk letter by letter, returning false immediately if any child is missing; if the walk completes, return the final node's `isWord`. startsWith(prefix): identical walk, but return true as soon as the walk completes regardless of `isWord`.",
    approachHi:
      "Har node ek object hai jismein ek `children` map (letter -> node) aur ek `isWord` boolean hai. insert(word): root se walk karo, har letter ke liye jo abhi present nahi hai ek child banate hue, phir final node par `isWord = true` set karo. search(word): letter by letter walk karo, agar koi child missing mile turant false return karo; agar walk complete ho jaaye, final node ka `isWord` return karo. startsWith(prefix): bilkul wahi walk, lekin walk complete hote hi true return karo, `isWord` ki parwah kiye bina.",
    timeComplexity: 'O(word length) per operation',
    spaceComplexity: 'O(total characters inserted)',
    solutionExplanation:
      "A trie exploits the fact that many words SHARE prefixes: rather than storing each word as an independent string (which would make prefix queries require scanning every word), it stores one shared path per common prefix, branching only where words actually diverge. This is what makes both search and startsWith run in time proportional only to the QUERY's own length, completely independent of how many words are stored — the two operations are nearly identical walks, differing only in whether the final node needs to represent a complete word (`isWord`) or merely needs to exist at all (any node reached at all proves the prefix is real).",
    solutionExplanationHi:
      "Ek trie is fact ka फायदा uthata hai ki bahut saare words prefixes SHARE karte hain: har word ko ek independent string ki tarah store karne ke bajaye (jisse prefix queries ko har word scan karna padta), ye har common prefix ke liye ek shared path store karta hai, sirf wahan branch karta hai jahan words genuinely diverge karte hain. Yahi wajah hai ki search aur startsWith dono sirf QUERY ki apni length ke proportional time mein chalte hain, kitne words store hain us se bilkul independent — dono operations lagbhag identical walks hain, sirf is baat mein alag ki final node ko ek complete word represent karna zaroori hai (`isWord`) ya bas exist karna hi kaafi hai (koi bhi node tak pahunch jaana hi prove karta hai ki prefix real hai).",
    starter: starter(
      `const n = num(0);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(1 + i));

class Trie {
  constructor() {
    // set up the root
  }
  insert(word) {
    // insert a word
  }
  search(word) {
    // return true if the exact word was inserted
    return false;
  }
  startsWith(prefix) {
    // return true if any inserted word starts with prefix
    return false;
  }
}

const trie = new Trie();
const output = [];
for (const [op, arg] of ops) {
  if (op === 'insert') trie.insert(arg);
  else if (op === 'search') output.push(trie.search(arg));
  else output.push(trie.startsWith(arg));
}
console.log(output.join('\\n'));`,
      `n = num(0)
ops = [words(1 + i) for i in range(n)]

class Trie:
    def __init__(self):
        # set up the root
        pass

    def insert(self, word):
        # insert a word
        pass

    def search(self, word):
        # return True if the exact word was inserted
        return False

    def starts_with(self, prefix):
        # return True if any inserted word starts with prefix
        return False

trie = Trie()
output = []
for op, arg in ops:
    if op == "insert":
        trie.insert(arg)
    elif op == "search":
        output.append(trie.search(arg))
    else:
        output.append(trie.starts_with(arg))
print("\\n".join("true" if v else "false" for v in output))`,
    ),
    solution: solution(
      `const n = num(0);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(1 + i));
class Trie {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
  insert(word) {
    let node = this;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new Trie());
      node = node.children.get(ch);
    }
    node.isWord = true;
  }
  walk(str) {
    let node = this;
    for (const ch of str) {
      if (!node.children.has(ch)) return null;
      node = node.children.get(ch);
    }
    return node;
  }
  search(word) {
    const node = this.walk(word);
    return node !== null && node.isWord;
  }
  startsWith(prefix) {
    return this.walk(prefix) !== null;
  }
}
const trie = new Trie();
const output = [];
for (const [op, arg] of ops) {
  if (op === 'insert') trie.insert(arg);
  else if (op === 'search') output.push(trie.search(arg));
  else output.push(trie.startsWith(arg));
}
console.log(output.join('\\n'));`,
      `n = num(0)
ops = [words(1 + i) for i in range(n)]

class Trie:
    def __init__(self):
        self.children = {}
        self.is_word = False

    def insert(self, word):
        node = self
        for ch in word:
            if ch not in node.children:
                node.children[ch] = Trie()
            node = node.children[ch]
        node.is_word = True

    def _walk(self, s):
        node = self
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_word

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

trie = Trie()
output = []
for op, arg in ops:
    if op == "insert":
        trie.insert(arg)
    elif op == "search":
        output.append(trie.search(arg))
    else:
        output.append(trie.starts_with(arg))
print("\\n".join("true" if v else "false" for v in output))`,
    ),
    testCases: [
      sample('5\ninsert apple\nsearch apple\nsearch app\nstartsWith app\ninsert app', 'true\nfalse\ntrue'),
      hidden('3\ninsert a\nsearch a\nstartsWith a', 'true\ntrue'),
      hidden('2\nsearch nothing\nstartsWith no', 'false\nfalse'),
      hidden('4\ninsert cat\ninsert car\nsearch ca\nstartsWith ca', 'false\ntrue'),
      hidden('3\ninsert dog\nsearch dog\nsearch do', 'true\nfalse'),
    ],
  },

  {
    slug: 'add-and-search-word',
    title: 'Add and Search Word - Data Structure Design',
    category: 'Trie',
    difficulty: 'MEDIUM',
    description:
      'Design a data structure supporting `addWord(word)` and `search(word)`, where `search` may contain `.` wildcards matching any single letter.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `OP arg` where `OP` is `addWord` or `search`\n\n**Output**\nFor each `search` op, `true` or `false` on its own line.',
    descriptionHi:
      'Ek data structure design karo jo `addWord(word)` aur `search(word)` support kare, jahan `search` mein `.` wildcards ho sakte hain jo kisi bhi single letter se match karte hain.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `OP arg` jahan `OP` `addWord` ya `search` hai\n\n**Output**\nHar `search` op ke liye, `true` ya `false` apni line par.',
    examples: [
      { input: '5\naddWord bad\naddWord dad\naddWord mad\nsearch pad\nsearch .ad', output: 'false\ntrue' },
      { input: '2\naddWord a\nsearch .', output: 'true' },
    ],
    constraints: ['1 <= n <= 5*10^4', '1 <= word length <= 25', 'lowercase letters and "." only in search'],
    hints: [
      'addWord is identical to a plain trie insert — the wildcard complexity is entirely in search.',
      'When search hits a `.`, it must try EVERY child at that position (since `.` matches any letter), not just one — this makes search a small DFS/backtracking traversal instead of a simple linear walk.',
      'A regular letter at a search position still narrows to exactly one child, same as plain trie search — only `.` branches into multiple possibilities.',
    ],
    approach:
      "Same trie structure as Implement Trie. addWord behaves exactly like insert. search becomes a recursive DFS: at each position, if the current character is a letter, follow that one child (failing if absent, same as plain search); if it is `.`, recursively try EVERY child at this node and return true if any of those recursive calls succeeds. The base case (end of the query string) checks the current node's `isWord` flag, exactly as in plain search.",
    approachHi:
      "Implement Trie jaisa hi trie structure. addWord bilkul insert jaisa behave karta hai. search ek recursive DFS ban jaata hai: har position par, agar current character ek letter hai, us ek child ko follow karo (agar absent hai to fail, plain search jaisa hi); agar `.` hai, is node ke HAR child ko recursively try karo aur true return karo agar unmein se koi bhi recursive call succeed ho. Base case (query string ka end) current node ka `isWord` flag check karta hai, bilkul plain search jaisa.",
    timeComplexity: 'O(26^(number of dots) * remaining length) worst case per search, O(word length) for addWord',
    spaceComplexity: 'O(total characters inserted)',
    solutionExplanation:
      "A `.` genuinely represents an unresolved choice at that position — the algorithm cannot know in advance which letter it should have matched, so it must explore every possibility that exists in the trie at that point. This is a direct instance of the standard 'unknown choice -> branch and recurse' backtracking pattern applied to a trie walk: a plain trie search is already a degenerate DFS with a branching factor of exactly 1 at every step (no wildcard), and wildcard search generalizes it by letting the branching factor jump to however many actual children exist whenever a `.` is encountered, while remaining a normal single-child follow everywhere else — the two behaviors coexist naturally in one recursive function because they're really the same operation with different branching factors.",
    solutionExplanationHi:
      "Ek `.` us position par ek genuinely unresolved choice represent karta hai — algorithm ko pehle se pata nahi hota ki wahan kaunsa letter match hona chahiye tha, isliye use trie mein us point par exist karne wali har possibility explore karni padti hai. Ye standard 'unknown choice -> branch aur recurse' backtracking pattern ka ek direct instance hai jo trie walk par apply hota hai: ek plain trie search already ek degenerate DFS hai jiska branching factor har step par exactly 1 hota hai (koi wildcard nahi), aur wildcard search ise generalize karta hai branching factor ko utna hone dekar jitne actual children exist karte hain jab bhi ek `.` milta hai, jabki baaki har jagah ek normal single-child follow rehta hai — dono behaviors ek recursive function mein naturally coexist karte hain kyunki wo asal mein alag branching factors wala same operation hain.",
    starter: starter(
      `const n = num(0);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(1 + i));

class WordDictionary {
  constructor() {
    // set up the root
  }
  addWord(word) {
    // insert a word
  }
  search(word) {
    // return true if word matches something inserted ('.' = any letter)
    return false;
  }
}

const dict = new WordDictionary();
const output = [];
for (const [op, arg] of ops) {
  if (op === 'addWord') dict.addWord(arg);
  else output.push(dict.search(arg));
}
console.log(output.join('\\n'));`,
      `n = num(0)
ops = [words(1 + i) for i in range(n)]

class WordDictionary:
    def __init__(self):
        # set up the root
        pass

    def add_word(self, word):
        # insert a word
        pass

    def search(self, word):
        # return True if word matches something inserted ('.' = any letter)
        return False

d = WordDictionary()
output = []
for op, arg in ops:
    if op == "addWord":
        d.add_word(arg)
    else:
        output.append(d.search(arg))
print("\\n".join("true" if v else "false" for v in output))`,
    ),
    solution: solution(
      `const n = num(0);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(1 + i));
class WordDictionary {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
  addWord(word) {
    let node = this;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new WordDictionary());
      node = node.children.get(ch);
    }
    node.isWord = true;
  }
  search(word) {
    return this._match(word, 0);
  }
  _match(word, i) {
    if (i === word.length) return this.isWord;
    const ch = word[i];
    if (ch === '.') {
      for (const child of this.children.values()) {
        if (child._match(word, i + 1)) return true;
      }
      return false;
    }
    const child = this.children.get(ch);
    return child ? child._match(word, i + 1) : false;
  }
}
const dict = new WordDictionary();
const output = [];
for (const [op, arg] of ops) {
  if (op === 'addWord') dict.addWord(arg);
  else output.push(dict.search(arg));
}
console.log(output.join('\\n'));`,
      `n = num(0)
ops = [words(1 + i) for i in range(n)]

class WordDictionary:
    def __init__(self):
        self.children = {}
        self.is_word = False

    def add_word(self, word):
        node = self
        for ch in word:
            if ch not in node.children:
                node.children[ch] = WordDictionary()
            node = node.children[ch]
        node.is_word = True

    def search(self, word):
        return self._match(word, 0)

    def _match(self, word, i):
        if i == len(word):
            return self.is_word
        ch = word[i]
        if ch == '.':
            for child in self.children.values():
                if child._match(word, i + 1):
                    return True
            return False
        child = self.children.get(ch)
        return child._match(word, i + 1) if child else False

d = WordDictionary()
output = []
for op, arg in ops:
    if op == "addWord":
        d.add_word(arg)
    else:
        output.append(d.search(arg))
print("\\n".join("true" if v else "false" for v in output))`,
    ),
    testCases: [
      sample('5\naddWord bad\naddWord dad\naddWord mad\nsearch pad\nsearch .ad', 'false\ntrue'),
      sample('2\naddWord a\nsearch .', 'true'),
      hidden('2\naddWord a\nsearch a', 'true'),
      hidden('1\nsearch .', 'false'),
      hidden('3\naddWord ab\nsearch a\nsearch a.', 'false\ntrue'),
      hidden('3\naddWord abc\nsearch ...\nsearch ....', 'true\nfalse'),
    ],
  },

  {
    slug: 'replace-words',
    title: 'Replace Words',
    category: 'Trie',
    difficulty: 'MEDIUM',
    description:
      'Given a dictionary of "root" words and a sentence, replace every word in the sentence with its SHORTEST matching root from the dictionary, if one exists (a word with no matching root is left unchanged).\n\n**Input**\n- Line 1: `count`\n- Line 2: `count` space-separated roots\n- Line 3: the sentence\n\n**Output**\nThe sentence after replacement.',
    descriptionHi:
      '"root" words ki ek dictionary aur ek sentence diya hai. Sentence ke har word ko dictionary ke uske SHORTEST matching root se replace karo, agar koi exist karta hai (jis word ka koi matching root nahi hai wo unchanged rehta hai).\n\n**Input**\n- Line 1: `count`\n- Line 2: `count` space-separated roots\n- Line 3: sentence\n\n**Output**\nReplacement ke baad sentence.',
    examples: [
      { input: '3\ncat bat rat\nthe cattle was rattled by the battery', output: 'the cat was rat by the bat' },
      { input: '2\na b\na aa aaa', output: 'a a a' },
    ],
    constraints: ['1 <= count <= 1000', '1 <= root/word length <= 100'],
    hints: [
      'Build a trie of all the root words first — this lets the shortest-prefix check for any given word run in time proportional only to that word\'s length.',
      'For each word in the sentence, walk the trie letter by letter; the moment a node with `isWord = true` is reached, STOP — that is the shortest matching root by construction (a shorter prefix of the trie is discovered before any longer one on the same path).',
      'If the walk falls off the trie (a needed child is missing) before ever hitting a word-end, or the word is exhausted without finding one, the original word is kept unchanged.',
    ],
    approach:
      "Insert every root into a trie (same insert as Implement Trie). For each word in the sentence, walk the trie letter by letter, checking `isWord` at every node visited along the way — stop and use that prefix the INSTANT `isWord` is true, since walking a trie top-down naturally visits shorter prefixes before longer ones. If the walk exhausts the word or falls off the trie without ever finding a word-end, keep the original word.",
    approachHi:
      "Har root ko ek trie mein insert karo (Implement Trie jaisa hi insert). Sentence ke har word ke liye, trie ko letter by letter walk karo, raaste mein visit hue har node par `isWord` check karte hue — jis INSTANT `isWord` true mile, ruk jao aur wo prefix use karo, kyunki trie ko top-down walk karna naturally chhote prefixes ko lambe se pehle visit karta hai. Agar walk word khatam kar de ya trie se gir jaaye bina kabhi word-end mile, original word rakho.",
    timeComplexity: 'O(total root characters) to build + O(sentence length) to replace',
    spaceComplexity: 'O(total root characters)',
    solutionExplanation:
      "The 'shortest matching root' requirement is answered automatically by how a trie is structured, with no extra comparison logic needed: because a trie walk visits nodes in strictly increasing prefix-length order along a single path (there is only one path per word, since each letter picks exactly one child), the FIRST word-end node encountered while walking is necessarily the shortest one — any longer root sharing that same prefix path would only be reached later in the same walk, so stopping immediately at the first match is provably correct, not just a convenient shortcut.",
    solutionExplanationHi:
      "'Shortest matching root' ki requirement trie ki structure se hi automatically answer ho jaati hai, koi extra comparison logic ki zaroorat nahi: kyunki trie walk ek single path ke along strictly increasing prefix-length order mein nodes visit karta hai (har word ke liye sirf ek path hota hai, kyunki har letter exactly ek child choose karta hai), walk karte waqt mila PEHLA word-end node zaroori taur par sabse chhota hai — same prefix path share karne wala koi bhi lamba root usi walk mein baad mein hi milega, isliye pehle match par turant rukna provably correct hai, sirf ek convenient shortcut nahi.",
    starter: starter(
      `const count = num(0);
const roots = words(1);
const sentence = words(2);

function replaceWords(roots, sentence) {
  // return the sentence array after replacement
  return sentence;
}

console.log(replaceWords(roots, sentence).join(' '));`,
      `count = num(0)
roots = words(1)
sentence = words(2)

def replace_words(roots, sentence):
    # return the sentence list after replacement
    return sentence

print(" ".join(replace_words(roots, sentence)))`,
    ),
    solution: solution(
      `const count = num(0);
const roots = words(1);
const sentence = words(2);
function replaceWords(roots, sentence) {
  const root = { children: new Map(), isWord: false };
  for (const word of roots) {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), isWord: false });
      node = node.children.get(ch);
    }
    node.isWord = true;
  }
  return sentence.map((word) => {
    let node = root;
    let prefix = '';
    for (const ch of word) {
      if (!node.children.has(ch)) return word;
      node = node.children.get(ch);
      prefix += ch;
      if (node.isWord) return prefix;
    }
    return word;
  });
}
console.log(replaceWords(roots, sentence).join(' '));`,
      `count = num(0)
roots = words(1)
sentence = words(2)

def replace_words(roots, sentence):
    root = {"children": {}, "is_word": False}
    for word in roots:
        node = root
        for ch in word:
            node = node["children"].setdefault(ch, {"children": {}, "is_word": False})
        node["is_word"] = True

    def shortest(word):
        node = root
        prefix = ""
        for ch in word:
            if ch not in node["children"]:
                return word
            node = node["children"][ch]
            prefix += ch
            if node["is_word"]:
                return prefix
        return word

    return [shortest(w) for w in sentence]

print(" ".join(replace_words(roots, sentence)))`,
    ),
    testCases: [
      sample('3\ncat bat rat\nthe cattle was rattled by the battery', 'the cat was rat by the bat'),
      sample('2\na b\na aa aaa', 'a a a'),
      hidden('1\ncat\ncattle catalog cat', 'cat cat cat'),
      hidden('1\nxyz\napple banana', 'apple banana'),
      hidden('2\nca cat\ncattle', 'ca'),
    ],
  },

  {
    slug: 'map-sum-pairs',
    title: 'Map Sum Pairs',
    category: 'Trie',
    difficulty: 'MEDIUM',
    description:
      'Design a structure supporting `insert(key, val)` (overwrites any previous value for the same key) and `sum(prefix)` (the sum of values of every inserted key that starts with `prefix`).\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `insert key val` or `sum prefix`\n\n**Output**\nFor each `sum` op, the resulting sum on its own line.',
    descriptionHi:
      'Ek structure design karo jo `insert(key, val)` (same key ki previous value overwrite karta hai) aur `sum(prefix)` (un saare inserted keys ki values ka sum jo `prefix` se shuru hote hain) support kare.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `insert key val` ya `sum prefix`\n\n**Output**\nHar `sum` op ke liye, resulting sum apni line par.',
    examples: [
      { input: '4\ninsert apple 3\nsum ap\ninsert app 2\nsum ap', output: '3\n5' },
    ],
    constraints: ['1 <= n <= 50', '1 <= key/prefix length <= 50', '0 <= val <= 1000'],
    hints: [
      'Store each key\'s current value in a plain map keyed by the full string, purely to handle overwrites correctly — inserting the same key twice must REPLACE, not add to, its contribution.',
      'Also build a trie of the keys, but instead of only marking word-ends, store the running sum of all values in the subtree rooted at each node as keys are inserted.',
      'On overwrite, first compute the DELTA (newVal - oldVal) and add that delta (not the raw new value) along every node on the key\'s trie path, so previously-summed contributions stay correct.',
    ],
    approach:
      "Maintain a plain Map from full key -> its current value (for correctly detecting and handling overwrites), plus a trie where every node stores `sum` = the total of all inserted keys' values that pass through it. On insert(key, val): look up the key's previous value (0 if new), compute `delta = val - previous`, update the plain map to `val`, then walk the trie along key's characters (creating nodes as needed) adding `delta` to every node's `sum` along that path, including the root. On sum(prefix): walk the trie along prefix's characters and return the final node's `sum` (or 0 if the walk falls off the trie).",
    approachHi:
      "Full key -> uski current value ka ek plain Map maintain karo (overwrites ko sahi se detect aur handle karne ke liye), plus ek trie jahan har node `sum` store karta hai = un saare inserted keys ki values ka total jo usse hokar guzarte hain. insert(key, val) par: key ki previous value dhoondo (naya hai to 0), `delta = val - previous` compute karo, plain map ko `val` se update karo, phir trie ko key ke characters ke along walk karo (zaroorat par nodes banate hue) har node ke `sum` mein `delta` add karte hue us path par, root sameत. sum(prefix) par: trie ko prefix ke characters ke along walk karo aur final node ka `sum` return karo (ya 0 agar walk trie se gir jaaye).",
    timeComplexity: 'O(key length) per insert, O(prefix length) per sum',
    spaceComplexity: 'O(total characters inserted)',
    solutionExplanation:
      "Storing a running sum AT EACH TRIE NODE (rather than only at word-ends) is what makes sum(prefix) O(prefix length) instead of requiring a subtree scan: every node's `sum` already represents 'total value of every key passing through here', precomputed incrementally as keys are inserted, so answering a prefix query is just one trie walk followed by reading a single stored number. The overwrite handling is the subtle part: naively adding `val` again on a repeated insert would double-count that key's old contribution in every ancestor's sum, so the fix is to always add the DELTA against the key's previous value (tracked separately in a plain map, since the trie itself has no simple way to look up 'what value did THIS exact key contribute last time') — this keeps every node's running sum an accurate reflection of the current state, not an accumulation of every insert call ever made.",
    solutionExplanationHi:
      "Har TRIE NODE par ek running sum store karna (sirf word-ends par nahi) hi sum(prefix) ko O(prefix length) banata hai, subtree scan ki zaroorat ke bina: har node ka `sum` already 'yahan se guzarne wale har key ki total value' represent karta hai, jo keys insert hote waqt incrementally precompute hota hai, isliye prefix query ka answer bas ek trie walk hai jiske baad ek single stored number padhna hai. Overwrite handling subtle part hai: repeated insert par naively `val` dobara add karna us key ki purani contribution ko har ancestor ke sum mein double-count kar dega, isliye fix ye hai ki hamesha key ki previous value ke against DELTA add karo (jo alag se ek plain map mein track hota hai, kyunki trie ke paas khud 'iss exact key ne pichli baar kya value contribute ki thi' dhoondhne ka koi simple tarika nahi hai) — ye har node ke running sum ko current state ka accurate reflection banaye rakhta hai, har insert call ka accumulation nahi.",
    starter: starter(
      `const n = num(0);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(1 + i));

class MapSum {
  constructor() {
    // set up storage
  }
  insert(key, val) {
    // insert or overwrite key with val
  }
  sum(prefix) {
    // return the sum of all values whose key starts with prefix
    return 0;
  }
}

const ms = new MapSum();
const output = [];
for (const parts of ops) {
  if (parts[0] === 'insert') ms.insert(parts[1], Number(parts[2]));
  else output.push(ms.sum(parts[1]));
}
console.log(output.join('\\n'));`,
      `n = num(0)
ops = [words(1 + i) for i in range(n)]

class MapSum:
    def __init__(self):
        # set up storage
        pass

    def insert(self, key, val):
        # insert or overwrite key with val
        pass

    def sum(self, prefix):
        # return the sum of all values whose key starts with prefix
        return 0

ms = MapSum()
output = []
for parts in ops:
    if parts[0] == "insert":
        ms.insert(parts[1], int(parts[2]))
    else:
        output.append(ms.sum(parts[1]))
print("\\n".join(str(v) for v in output))`,
    ),
    solution: solution(
      `const n = num(0);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(1 + i));
class MapSum {
  constructor() {
    this.values = new Map();
    this.root = { children: new Map(), sum: 0 };
  }
  insert(key, val) {
    const previous = this.values.get(key) || 0;
    const delta = val - previous;
    this.values.set(key, val);
    let node = this.root;
    node.sum += delta;
    for (const ch of key) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), sum: 0 });
      node = node.children.get(ch);
      node.sum += delta;
    }
  }
  sum(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) return 0;
      node = node.children.get(ch);
    }
    return node.sum;
  }
}
const ms = new MapSum();
const output = [];
for (const parts of ops) {
  if (parts[0] === 'insert') ms.insert(parts[1], Number(parts[2]));
  else output.push(ms.sum(parts[1]));
}
console.log(output.join('\\n'));`,
      `n = num(0)
ops = [words(1 + i) for i in range(n)]

class MapSum:
    def __init__(self):
        self.values = {}
        self.root = {"children": {}, "sum": 0}

    def insert(self, key, val):
        previous = self.values.get(key, 0)
        delta = val - previous
        self.values[key] = val
        node = self.root
        node["sum"] += delta
        for ch in key:
            node = node["children"].setdefault(ch, {"children": {}, "sum": 0})
            node["sum"] += delta

    def sum(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node["children"]:
                return 0
            node = node["children"][ch]
        return node["sum"]

ms = MapSum()
output = []
for parts in ops:
    if parts[0] == "insert":
        ms.insert(parts[1], int(parts[2]))
    else:
        output.append(ms.sum(parts[1]))
print("\\n".join(str(v) for v in output))`,
    ),
    testCases: [
      sample('4\ninsert apple 3\nsum ap\ninsert app 2\nsum ap', '3\n5'),
      hidden('2\ninsert a 5\nsum a', '5'),
      hidden('1\nsum xyz', '0'),
      hidden('3\ninsert a 3\ninsert a 7\nsum a', '7'),
      hidden('3\ninsert cat 2\ninsert car 4\nsum ca', '6'),
    ],
  },

  {
    slug: 'longest-word-in-dictionary',
    title: 'Longest Word in Dictionary',
    category: 'Trie',
    difficulty: 'MEDIUM',
    description:
      'Given a list of words, find the longest word that can be built one character at a time by other words in the list (every prefix of the word, from length 1 up to its full length, must also be in the list). If there is a tie in length, return the lexicographically smallest. If none exists, return an empty string.\n\n**Input**\n- Line 1: `count`\n- Line 2: `count` space-separated words\n\n**Output**\nThe answer word, or an empty line.',
    descriptionHi:
      'Words ki ek list di hai, wo longest word dhoondo jo list ke doosre words se ek character at a time build ho sake (word ka har prefix, length 1 se poori length tak, list mein hona chahiye). Agar length mein tie ho, lexicographically sabse chhota return karo. Agar koi exist nahi karta, empty string return karo.\n\n**Input**\n- Line 1: `count`\n- Line 2: `count` space-separated words\n\n**Output**\nAnswer word, ya ek khaali line.',
    examples: [
      { input: '6\nw wo wor worl world', output: 'world' },
      { input: '5\na banana app appl ap', output: 'appl' },
    ],
    constraints: ['1 <= count <= 1000', '1 <= word length <= 30'],
    hints: [
      'Insert every word into a trie, and mark each word-end node (as usual) — this alone does not yet capture the "every prefix must also exist" requirement.',
      'A word qualifies only if EVERY node along its path (except the root) is itself a word-end — not just the final node. Check this while inserting or with a follow-up walk per word.',
      'Compare qualifying words by (length descending, then lexicographic ascending) to directly get the tie-breaking rule the problem asks for.',
    ],
    approach:
      "Insert every word into a trie, marking word-end nodes. A word is 'buildable' if and only if every node along its path from the root (excluding the root itself) is a word-end — verify this per word with a simple walk that fails fast the moment a non-word-end intermediate node is found. Among all buildable words, track the best by comparing (length, then lexicographic order) so a longer word always wins, and a tie in length is broken by picking the alphabetically smaller one.",
    approachHi:
      "Har word ko trie mein insert karo, word-end nodes mark karte hue. Ek word 'buildable' tabhi hai jab uske root se path ke har node (root khud ko chhodkar) word-end ho — har word ke liye ek simple walk se ye verify karo jo turant fail ho jaaye jaise hi koi non-word-end intermediate node mile. Saare buildable words mein se, (length, phir lexicographic order) compare karke best track karo taaki lamba word hamesha jeete, aur length mein tie chhote alphabetical word se broken ho.",
    timeComplexity: 'O(total characters) to build + O(total characters) to check every word',
    spaceComplexity: 'O(total characters)',
    solutionExplanation:
      "The 'buildable one character at a time' requirement translates exactly to 'every prefix along the trie path is itself a complete stored word' — which is a stronger condition than merely existing as a trie path (any string reachable in the trie exists as a path by definition, but that doesn't mean each of its own prefixes was independently inserted as a full word). Checking every intermediate node's `isWord` flag along a word's own path directly verifies this chain of dependencies: if even one link in that chain is missing (some prefix was never itself inserted), the word cannot actually be assembled step by step from the dictionary, no matter how long its full spelling happens to exist as a trie path.",
    solutionExplanationHi:
      "'Ek character at a time buildable' requirement exactly 'trie path ke saath har prefix khud ek complete stored word ho' mein translate hoti hai — jo sirf trie path ki tarah exist karne se stronger condition hai (trie mein reachable koi bhi string definition se ek path ki tarah exist karti hai, lekin iska matlab nahi ki uska har apna prefix independently ek full word ki tarah insert hua tha). Ek word ke apne path ke saath har intermediate node ka `isWord` flag check karna is dependency chain ko directly verify karta hai: agar us chain mein ek bhi link missing hai (koi prefix khud kabhi insert nahi hua), word ko dictionary se step by step actually assemble nahi kiya ja sakta, chahe uski poori spelling trie path ki tarah kitni bhi der se exist karti ho.",
    starter: starter(
      `const count = num(0);
const wordList = words(1);

function longestWord(words) {
  // return the longest buildable word (lexicographically smallest on ties)
  return '';
}

console.log(longestWord(wordList));`,
      `count = num(0)
word_list = words(1)

def longest_word(word_list):
    # return the longest buildable word (lexicographically smallest on ties)
    return ""

print(longest_word(word_list))`,
    ),
    solution: solution(
      `const count = num(0);
const wordList = words(1);
function longestWord(words) {
  const root = { children: new Map(), isWord: false };
  for (const word of words) {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), isWord: false });
      node = node.children.get(ch);
    }
    node.isWord = true;
  }
  let best = '';
  for (const word of words) {
    let node = root;
    let ok = true;
    for (const ch of word) {
      node = node.children.get(ch);
      if (!node.isWord) { ok = false; break; }
    }
    if (ok) {
      if (word.length > best.length || (word.length === best.length && word < best)) best = word;
    }
  }
  return best;
}
console.log(longestWord(wordList));`,
      `count = num(0)
word_list = words(1)

def longest_word(word_list):
    root = {"children": {}, "is_word": False}
    for word in word_list:
        node = root
        for ch in word:
            node = node["children"].setdefault(ch, {"children": {}, "is_word": False})
        node["is_word"] = True

    best = ""
    for word in word_list:
        node = root
        ok = True
        for ch in word:
            node = node["children"][ch]
            if not node["is_word"]:
                ok = False
                break
        if ok:
            if len(word) > len(best) or (len(word) == len(best) and word < best):
                best = word
    return best

print(longest_word(word_list))`,
    ),
    testCases: [
      sample('6\nw wo wor worl world', 'world'),
      sample('5\na banana app appl ap', 'appl'),
      hidden('1\na', 'a'),
      hidden('2\nabc xyz', ''),
      hidden('4\na ab abc ac', 'abc'),
    ],
  },

  {
    slug: 'word-search-ii',
    title: 'Word Search II',
    category: 'Trie',
    difficulty: 'HARD',
    description:
      'Given an `rows x cols` grid of letters and a list of words, find every word from the list that can be formed by a path of adjacent (4-directional, no cell reused within one word) cells in the grid.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: a string of letters\n- Line `rows+2`: `count`\n- Line `rows+3`: `count` space-separated words\n\n**Output**\nEvery found word, one per line, sorted alphabetically.',
    descriptionHi:
      'Letters ka ek `rows x cols` grid aur words ki ek list di hai, list ka har wo word dhoondo jo grid mein adjacent (4-directional, ek word ke andar koi cell reuse nahi) cells ke ek path se ban sakta hai.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: letters ki ek string\n- Line `rows+2`: `count`\n- Line `rows+3`: `count` space-separated words\n\n**Output**\nHar mila hua word, ek per line, alphabetically sorted.',
    examples: [
      { input: '4 4\noaan\netae\nihkr\nihfd\n3\noath pea eat rain', output: 'eat\noath' },
      { input: '2 2\nab\ncd\n1\nabcb', output: '' },
    ],
    constraints: ['1 <= rows, cols <= 12', '1 <= count <= 1000', '1 <= word length <= 10'],
    hints: [
      'Running a separate DFS-from-every-cell for EACH word independently (like plain Word Search) is wasteful when many words share prefixes — that shared prefix work would be repeated once per word.',
      'Build one trie from ALL the words first, then run a SINGLE combined DFS from every grid cell, walking the grid and the trie together in lockstep — a grid path is only worth continuing if it still matches some trie path.',
      'When the DFS reaches a trie node with `isWord = true`, record that word — but keep exploring deeper from there anyway, since a found word can be a prefix of a longer word also in the list (e.g. "eat" and "eats").',
    ],
    approach:
      "Build one trie containing all target words (storing the actual word string at each word-end node, for direct reporting). Then, for every starting cell in the grid, run a combined DFS that advances through the GRID and the TRIE simultaneously: at each grid cell, only continue to a trie child matching the current cell's letter (pruning branches immediately if no such trie child exists); mark the cell visited for this path, recurse into all 4 neighbors, then unmark it (backtrack) before returning. Whenever a trie node with a stored word is reached, add that word to the result set and continue deeper (do not stop, since longer words may extend it).",
    approachHi:
      "Saare target words wala ek trie banao (har word-end node par actual word string store karte hue, direct reporting ke liye). Phir, grid ke har starting cell ke liye, ek combined DFS chalao jo GRID aur TRIE dono mein ek saath aage badhe: har grid cell par, sirf us trie child tak continue karo jo current cell ke letter se match kare (agar aisa koi trie child nahi hai to turant prune karo); is path ke liye cell ko visited mark karo, saare 4 neighbors mein recurse karo, phir return karne se pehle use unmark karo (backtrack). Jab bhi ek stored word wale trie node tak pahuncho, us word ko result set mein add karo aur aage deeper explore karte raho (ruko mat, kyunki lambe words ise extend kar sakte hain).",
    timeComplexity: 'O(rows * cols * 4^maxWordLength) worst case, heavily pruned in practice by the trie',
    spaceComplexity: 'O(total word characters) for the trie',
    solutionExplanation:
      "This combines two techniques this course has covered separately: the grid-DFS-with-backtracking of plain Word Search, and the shared-prefix efficiency of a trie. Walking the trie and the grid in lockstep means every grid path is abandoned the INSTANT it stops matching any word's prefix, so cells that share no common prefix with the remaining dictionary are never explored deeply — this is a direct efficiency gain over running plain Word Search once per target word, since work spent walking a shared prefix (e.g. the 'ea' in both 'eat' and 'ease') is done exactly once for all words sharing it, rather than being redundantly repeated by separate DFS calls per word. Continuing past a found word-end (rather than stopping) is necessary because a complete word can itself be a valid prefix of a longer word still being searched for.",
    solutionExplanationHi:
      "Ye do techniques combine karta hai jo ye course pehle alag alag cover kar chuka hai: plain Word Search ka grid-DFS-with-backtracking, aur trie ki shared-prefix efficiency. Trie aur grid ko lockstep mein walk karne ka matlab hai har grid path us INSTANT abandon ho jaata hai jab wo kisi bhi word ke prefix se match karna band kar de, isliye jo cells baaki dictionary ke saath koi common prefix share nahi karte unhe kabhi deeply explore nahi kiya jaata — ye plain Word Search ko har target word ke liye alag se chalane ke upar ek direct efficiency gain hai, kyunki ek shared prefix walk karne mein laga kaam (jaise 'eat' aur 'ease' dono mein 'ea') saare us prefix ko share karne wale words ke liye exactly ek baar hota hai, har word ke liye alag DFS calls se redundantly repeat hone ke bajaye. Mile hue word-end ke aage bhi (rukne ke bajaye) continue karna zaroori hai kyunki ek complete word khud ek lambe, abhi bhi search ho rahe word ka valid prefix ho sakta hai.",
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(line(1 + i).split(''));
const count = num(1 + rows);
const wordList = words(2 + rows);

function findWords(board, words) {
  // return every found word (any order; will be sorted before printing)
  return [];
}

console.log(findWords(grid, wordList).slice().sort().join('\\n'));`,
      `rows, cols = nums(0)
grid = [list(line(1 + i)) for i in range(rows)]
count = num(1 + rows)
word_list = words(2 + rows)

def find_words(board, words):
    # return every found word (any order; will be sorted before printing)
    return []

print("\\n".join(sorted(find_words(grid, word_list))))`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(line(1 + i).split(''));
const count = num(1 + rows);
const wordList = words(2 + rows);
function findWords(board, words) {
  const root = { children: new Map(), word: null };
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), word: null });
      node = node.children.get(ch);
    }
    node.word = w;
  }
  const rows = board.length, cols = board[0].length;
  const found = new Set();
  function dfs(r, c, node) {
    const ch = board[r][c];
    const next = node.children.get(ch);
    if (!next) return;
    if (next.word) found.add(next.word);
    board[r][c] = '#';
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] !== '#') dfs(nr, nc, next);
    }
    board[r][c] = ch;
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) dfs(r, c, root);
  return [...found];
}
console.log(findWords(grid, wordList).slice().sort().join('\\n'));`,
      `rows, cols = nums(0)
grid = [list(line(1 + i)) for i in range(rows)]
count = num(1 + rows)
word_list = words(2 + rows)

def find_words(board, words):
    root = {"children": {}, "word": None}
    for w in words:
        node = root
        for ch in w:
            node = node["children"].setdefault(ch, {"children": {}, "word": None})
        node["word"] = w

    rows, cols = len(board), len(board[0])
    found = set()

    def dfs(r, c, node):
        ch = board[r][c]
        nxt = node["children"].get(ch)
        if not nxt:
            return
        if nxt["word"]:
            found.add(nxt["word"])
        board[r][c] = "#"
        for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != "#":
                dfs(nr, nc, nxt)
        board[r][c] = ch

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, root)
    return list(found)

print("\\n".join(sorted(find_words(grid, word_list))))`,
    ),
    testCases: [
      sample('4 4\noaan\netae\nihkr\nihfd\n3\noath pea eat rain', 'eat\noath'),
      sample('2 2\nab\ncd\n1\nabcb', ''),
      hidden('1 1\na\n1\na', 'a'),
      hidden('1 1\na\n1\nb', ''),
      hidden('2 2\nab\nba\n2\naba abab', 'aba\nabab'),
    ],
  },
];
