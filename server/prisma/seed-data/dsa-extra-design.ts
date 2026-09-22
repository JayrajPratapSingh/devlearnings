import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Design — new category, gap-fill batch. A gap-audit of the DSA bank found
 * zero "design a data structure with specific O(1)/O(log n) operations"
 * coverage, despite LRU Cache being one of the single most commonly asked
 * interview questions of all. Covers O(1) random-access removal, a sorted
 * time-series lookup structure, an undo/redo-style navigation stack, a
 * heap-merge social-feed structure, and the two classic cache-eviction
 * designs (LRU via hashmap+doubly-linked-list, LFU via frequency buckets).
 */
export const dsaExtraDesign: SeedProblem[] = [
  {
    slug: 'insert-delete-getrandom-o1',
    title: 'Insert Delete GetRandom O(1)',
    category: 'Design',
    difficulty: 'MEDIUM',
    description:
      'Design a structure supporting `insert(val)`, `remove(val)`, and `getRandom()` (returns an existing element, uniformly at random), each in average O(1) time.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `insert val`, `remove val`, or `getRandom seed` (seed selects a deterministic index into the current elements, `seed mod size`)\n\n**Output**\nFor `insert`/`remove`, `true` if it changed the structure (val was newly added / actually present to remove), `false` otherwise. For `getRandom`, the selected element.',
    descriptionHi:
      'Ek structure design karo jo `insert(val)`, `remove(val)`, aur `getRandom()` (ek existing element, uniformly at random, return karta hai) support kare, har ek average O(1) time mein.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `insert val`, `remove val`, ya `getRandom seed` (seed current elements mein se ek deterministic index select karta hai, `seed mod size`)\n\n**Output**\n`insert`/`remove` ke liye, `true` agar structure change hua (val naya add hua / actually present tha remove karne ke liye), warna `false`. `getRandom` ke liye, selected element.',
    examples: [
      { input: '6\ninsert 1\nremove 2\ninsert 2\ngetRandom 0\nremove 1\ngetRandom 0', output: 'true\nfalse\ntrue\n1\ntrue\n2' },
    ],
    constraints: ['1 <= n <= 2*10^5', '-2^31 <= val <= 2^31 - 1', 'getRandom is only called when the structure is non-empty'],
    hints: [
      'A plain array gives O(1) getRandom (pick a random valid index) but O(n) removal (finding the value first, then shifting elements). A plain hash set gives O(1) insert/remove but no O(1) way to pick a uniformly random element (no indexing into a set).',
      'Combine both: an array holding the actual values, PLUS a hash map from value to its current index in the array — this gives O(1) lookup of "where is this value" while keeping the array\'s O(1) random-index access.',
      'The key trick for O(1) removal: instead of shifting elements after removing from the middle of the array (O(n)), SWAP the element to remove with the LAST element, update the swapped element\'s index in the map, then pop the last element off (O(1)).',
    ],
    approach:
      "Maintain an array `items` (the actual values, in no particular order) and a Map `indexOf` (value -> its current position in `items`). insert(val): if already present, return false; otherwise push to the end of `items` and record its index in `indexOf`, return true. remove(val): if absent, return false; otherwise look up its index, swap the LAST element of `items` into that index (updating `indexOf` for the swapped element), pop the array's last slot, delete val from `indexOf`, return true. getRandom(): pick items[randomIndex] uniformly (here, a deterministic `seed mod items.length` in place of true randomness, so results are checkable).",
    approachHi:
      "Ek array `items` (actual values, koi particular order nahi) aur ek Map `indexOf` (value -> `items` mein uska current position) maintain karo. insert(val): agar already present hai, false return karo; warna `items` ke end mein push karo aur `indexOf` mein uska index record karo, true return karo. remove(val): agar absent hai, false return karo; warna uska index dhoondo, `items` ke LAST element ko us index mein swap karo (swap hue element ke liye `indexOf` update karte hue), array ka last slot pop karo, `indexOf` se val delete karo, true return karo. getRandom(): items[randomIndex] uniformly pick karo (yahan, true randomness ki jagah ek deterministic `seed mod items.length`, taaki results checkable hon).",
    timeComplexity: 'O(1) average per operation',
    spaceComplexity: 'O(number of elements)',
    solutionExplanation:
      "Neither underlying structure alone provides all three guarantees: an array gives O(1) indexed access (needed for getRandom) but shifting after a middle-removal is O(n); a hash map gives O(1) existence lookup but has no notion of 'index' to support random selection. The combination works because the two structures are kept in sync via a shared invariant — `indexOf[v]` always equals v's actual position in `items` — and the swap-with-last trick is what preserves that invariant cheaply during removal: rather than shifting every element after the removed one (which would require updating O(n) index entries), only ONE other element (the one previously last) actually changes position, so only its single index entry needs updating, and the array's length can then simply shrink by one with a cheap pop.",
    solutionExplanationHi:
      "Koi bhi ek underlying structure akele teenon guarantees nahi deta: ek array O(1) indexed access deta hai (getRandom ke liye chahiye) lekin middle-removal ke baad shift karna O(n) hai; ek hash map O(1) existence lookup deta hai lekin uske paas random selection support karne ke liye 'index' ka koi concept nahi hai. Combination isliye kaam karta hai kyunki dono structures ek shared invariant ke through sync mein rakhe jaate hain — `indexOf[v]` hamesha v ki `items` mein actual position ke barabar hota hai — aur swap-with-last trick hi removal ke dauraan us invariant ko cheaply preserve karta hai: removed element ke baad har element ko shift karne ke bajaye (jisme O(n) index entries update karni padtin), sirf EK aur element (jo pehle last tha) actually position badalta hai, isliye sirf uski single index entry update karni padti hai, aur array ki length phir bas ek cheap pop se ek se shrink ho sakti hai.",
    starter: starter(
      `const n = num(0);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(1 + i));

class RandomizedSet {
  constructor() {
    // set up storage
  }
  insert(val) {
    // return true if val was newly added
    return false;
  }
  remove(val) {
    // return true if val was present and removed
    return false;
  }
  getRandom(seed) {
    // return a deterministic pick: the element at index (seed mod size)
    return 0;
  }
}

const rs = new RandomizedSet();
const output = [];
for (const parts of ops) {
  if (parts[0] === 'insert') output.push(rs.insert(Number(parts[1])));
  else if (parts[0] === 'remove') output.push(rs.remove(Number(parts[1])));
  else output.push(rs.getRandom(Number(parts[1])));
}
console.log(output.map((v) => typeof v === 'boolean' ? v : String(v)).join('\\n'));`,
      `n = num(0)
ops = [words(1 + i) for i in range(n)]

class RandomizedSet:
    def __init__(self):
        # set up storage
        pass

    def insert(self, val):
        # return True if val was newly added
        return False

    def remove(self, val):
        # return True if val was present and removed
        return False

    def get_random(self, seed):
        # return a deterministic pick: the element at index (seed mod size)
        return 0

rs = RandomizedSet()
output = []
for parts in ops:
    if parts[0] == "insert":
        output.append(rs.insert(int(parts[1])))
    elif parts[0] == "remove":
        output.append(rs.remove(int(parts[1])))
    else:
        output.append(rs.get_random(int(parts[1])))
lines = []
for v in output:
    if isinstance(v, bool):
        lines.append("true" if v else "false")
    else:
        lines.append(str(v))
print("\\n".join(lines))`,
    ),
    solution: solution(
      `const n = num(0);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(1 + i));
class RandomizedSet {
  constructor() {
    this.items = [];
    this.indexOf = new Map();
  }
  insert(val) {
    if (this.indexOf.has(val)) return false;
    this.indexOf.set(val, this.items.length);
    this.items.push(val);
    return true;
  }
  remove(val) {
    if (!this.indexOf.has(val)) return false;
    const idx = this.indexOf.get(val);
    const last = this.items[this.items.length - 1];
    this.items[idx] = last;
    this.indexOf.set(last, idx);
    this.items.pop();
    this.indexOf.delete(val);
    return true;
  }
  getRandom(seed) {
    return this.items[seed % this.items.length];
  }
}
const rs = new RandomizedSet();
const output = [];
for (const parts of ops) {
  if (parts[0] === 'insert') output.push(rs.insert(Number(parts[1])));
  else if (parts[0] === 'remove') output.push(rs.remove(Number(parts[1])));
  else output.push(rs.getRandom(Number(parts[1])));
}
console.log(output.map((v) => typeof v === 'boolean' ? v : String(v)).join('\\n'));`,
      `n = num(0)
ops = [words(1 + i) for i in range(n)]

class RandomizedSet:
    def __init__(self):
        self.items = []
        self.index_of = {}

    def insert(self, val):
        if val in self.index_of:
            return False
        self.index_of[val] = len(self.items)
        self.items.append(val)
        return True

    def remove(self, val):
        if val not in self.index_of:
            return False
        idx = self.index_of[val]
        last = self.items[-1]
        self.items[idx] = last
        self.index_of[last] = idx
        self.items.pop()
        del self.index_of[val]
        return True

    def get_random(self, seed):
        return self.items[seed % len(self.items)]

rs = RandomizedSet()
output = []
for parts in ops:
    if parts[0] == "insert":
        output.append(rs.insert(int(parts[1])))
    elif parts[0] == "remove":
        output.append(rs.remove(int(parts[1])))
    else:
        output.append(rs.get_random(int(parts[1])))
lines = []
for v in output:
    if isinstance(v, bool):
        lines.append("true" if v else "false")
    else:
        lines.append(str(v))
print("\\n".join(lines))`,
    ),
    testCases: [
      sample('6\ninsert 1\nremove 2\ninsert 2\ngetRandom 0\nremove 1\ngetRandom 0', 'true\nfalse\ntrue\n1\ntrue\n2'),
      hidden('2\ninsert 5\ngetRandom 0', 'true\n5'),
      hidden('2\ninsert 5\ninsert 5', 'true\nfalse'),
      hidden('3\ninsert 5\nremove 5\nremove 5', 'true\ntrue\nfalse'),
      hidden('4\ninsert 1\ninsert 2\nremove 1\ngetRandom 0', 'true\ntrue\ntrue\n2'),
    ],
  },

  {
    slug: 'time-based-key-value-store',
    title: 'Time Based Key-Value Store',
    category: 'Design',
    difficulty: 'MEDIUM',
    description:
      'Design a store supporting `set(key, value, timestamp)` (timestamps are strictly increasing per key) and `get(key, timestamp)` (returns the value set for `key` at the LARGEST recorded timestamp <= the given timestamp, or an empty string if none exists).\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `set key value timestamp` or `get key timestamp`\n\n**Output**\nFor each `get`, the result on its own line.',
    descriptionHi:
      'Ek store design karo jo `set(key, value, timestamp)` (har key ke liye timestamps strictly increasing hote hain) aur `get(key, timestamp)` (`key` ke liye us LARGEST recorded timestamp par set value return karta hai jo di gayi timestamp <= ho, ya empty string agar koi exist nahi karta) support kare.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `set key value timestamp` ya `get key timestamp`\n\n**Output**\nHar `get` ke liye, result apni line par.',
    examples: [
      { input: '4\nset foo bar 1\nget foo 1\nget foo 3\nset foo bar2 4', output: 'bar\nbar' },
      { input: '2\nset foo bar 1\nget foo 0', output: '' },
    ],
    constraints: ['1 <= n <= 2*10^5', 'timestamps for the same key are strictly increasing across set calls'],
    hints: [
      "Store each key's history as a list of (timestamp, value) pairs, in a hash map from key to that list.",
      'Because `set` timestamps for a given key are guaranteed strictly increasing, each key\'s list is automatically sorted by timestamp as it is built — no separate sort step ever needed.',
      'Since the list is sorted, `get` can binary-search for the largest timestamp <= the query timestamp instead of scanning linearly.',
    ],
    approach:
      'Maintain a Map from key to an array of `[timestamp, value]` pairs. set(key, value, timestamp): append to that key\'s array (it stays sorted automatically, since input timestamps are strictly increasing per key). get(key, timestamp): binary search that key\'s array for the rightmost entry with timestamp <= the query timestamp; return its value, or an empty string if the key doesn\'t exist or every recorded timestamp is greater than the query.',
    approachHi:
      'Ek Map maintain karo key se `[timestamp, value]` pairs ke ek array tak. set(key, value, timestamp): us key ke array mein append karo (wo automatically sorted rehta hai, kyunki input timestamps har key ke liye strictly increasing hote hain). get(key, timestamp): us key ke array mein binary search karo us rightmost entry ke liye jiska timestamp query timestamp se <= ho; uski value return karo, ya empty string agar key exist nahi karta ya har recorded timestamp query se zyada hai.',
    timeComplexity: 'O(1) amortized for set, O(log n) for get (n = number of set calls for that key)',
    spaceComplexity: 'O(total set calls)',
    solutionExplanation:
      "Binary search is applicable here only BECAUSE the input guarantee (strictly increasing timestamps per key) means each key's history list is already sorted the moment it's built, with zero extra work — a weaker guarantee (arbitrary-order timestamps) would force either an explicit sort before each query or a different data structure (like a balanced BST) to maintain order incrementally. Given that sorted structure, 'find the largest timestamp <= target' is exactly the standard binary-search-for-insertion-point pattern: narrowing the search range by half each comparison finds the answer in O(log n) instead of the O(n) a linear scan through that key's full history would need.",
    solutionExplanationHi:
      "Binary search yahan sirf isliye applicable hai kyunki input guarantee (har key ke liye strictly increasing timestamps) ka matlab hai har key ki history list ban te hi already sorted hoti hai, bina kisi extra kaam ke — ek kamzor guarantee (arbitrary-order timestamps) ya to har query se pehle ek explicit sort force karta ya order ko incrementally maintain karne ke liye ek alag data structure (jaise balanced BST) chahiye hota. Us sorted structure ko dekhte hue, 'largest timestamp <= target dhoondo' exactly standard binary-search-for-insertion-point pattern hai: har comparison par search range ko aadha karte hue answer O(log n) mein milta hai, us O(n) ke bajaye jo us key ki poori history ke through ek linear scan chahiye hota.",
    starter: starter(
      `const n = num(0);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(1 + i));

class TimeMap {
  constructor() {
    // set up storage
  }
  set(key, value, timestamp) {
    // record value for key at timestamp
  }
  get(key, timestamp) {
    // return the value at the largest recorded timestamp <= timestamp, or ''
    return '';
  }
}

const tm = new TimeMap();
const output = [];
for (const parts of ops) {
  if (parts[0] === 'set') tm.set(parts[1], parts[2], Number(parts[3]));
  else output.push(tm.get(parts[1], Number(parts[2])));
}
console.log(output.join('\\n'));`,
      `n = num(0)
ops = [words(1 + i) for i in range(n)]

class TimeMap:
    def __init__(self):
        # set up storage
        pass

    def set(self, key, value, timestamp):
        # record value for key at timestamp
        pass

    def get(self, key, timestamp):
        # return the value at the largest recorded timestamp <= timestamp, or ''
        return ""

tm = TimeMap()
output = []
for parts in ops:
    if parts[0] == "set":
        tm.set(parts[1], parts[2], int(parts[3]))
    else:
        output.append(tm.get(parts[1], int(parts[2])))
print("\\n".join(output))`,
    ),
    solution: solution(
      `const n = num(0);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(1 + i));
class TimeMap {
  constructor() {
    this.store = new Map();
  }
  set(key, value, timestamp) {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key).push([timestamp, value]);
  }
  get(key, timestamp) {
    const list = this.store.get(key);
    if (!list) return '';
    let lo = 0, hi = list.length - 1, result = '';
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (list[mid][0] <= timestamp) { result = list[mid][1]; lo = mid + 1; }
      else hi = mid - 1;
    }
    return result;
  }
}
const tm = new TimeMap();
const output = [];
for (const parts of ops) {
  if (parts[0] === 'set') tm.set(parts[1], parts[2], Number(parts[3]));
  else output.push(tm.get(parts[1], Number(parts[2])));
}
console.log(output.join('\\n'));`,
      `n = num(0)
ops = [words(1 + i) for i in range(n)]

class TimeMap:
    def __init__(self):
        self.store = {}

    def set(self, key, value, timestamp):
        self.store.setdefault(key, []).append((timestamp, value))

    def get(self, key, timestamp):
        lst = self.store.get(key)
        if not lst:
            return ""
        lo, hi, result = 0, len(lst) - 1, ""
        while lo <= hi:
            mid = (lo + hi) // 2
            if lst[mid][0] <= timestamp:
                result = lst[mid][1]
                lo = mid + 1
            else:
                hi = mid - 1
        return result

tm = TimeMap()
output = []
for parts in ops:
    if parts[0] == "set":
        tm.set(parts[1], parts[2], int(parts[3]))
    else:
        output.append(tm.get(parts[1], int(parts[2])))
print("\\n".join(output))`,
    ),
    testCases: [
      sample('4\nset foo bar 1\nget foo 1\nget foo 3\nset foo bar2 4', 'bar\nbar'),
      sample('2\nset foo bar 1\nget foo 0', ''),
      hidden('1\nget missing 5', ''),
      hidden('3\nset a x 1\nset a y 2\nget a 2', 'y'),
      hidden('4\nset a x 1\nset a y 5\nget a 3\nget a 10', 'x\ny'),
    ],
  },

  {
    slug: 'design-browser-history',
    title: 'Design Browser History',
    category: 'Design',
    difficulty: 'MEDIUM',
    description:
      'Design a browser history supporting `visit(url)` (visiting a new page clears all forward history), `back(steps)`, and `forward(steps)` (each clamped to the available history, never erroring).\n\n**Input**\n- Line 1: `homepage`\n- Line 2: `n`\n- Next `n` lines: `visit url`, `back steps`, or `forward steps`\n\n**Output**\nFor `back`/`forward`, the resulting current URL on its own line.',
    descriptionHi:
      'Ek browser history design karo jo `visit(url)` (nayi page visit karna saara forward history clear kar deta hai), `back(steps)`, aur `forward(steps)` (har ek available history tak clamp hota hai, kabhi error nahi) support kare.\n\n**Input**\n- Line 1: `homepage`\n- Line 2: `n`\n- Agli `n` lines: `visit url`, `back steps`, ya `forward steps`\n\n**Output**\n`back`/`forward` ke liye, resulting current URL apni line par.',
    examples: [
      { input: 'leetcode.com\n7\nvisit google.com\nvisit facebook.com\nvisit youtube.com\nback 1\nback 1\nforward 1\nvisit linkedin.com', output: 'facebook.com\ngoogle.com\nfacebook.com' },
    ],
    constraints: ['1 <= n <= 5000', '1 <= steps <= 100'],
    hints: [
      'Store the full history as an array with a `current` index pointer — visiting is not the only operation that changes the array, since a fresh visit after going back must DISCARD the abandoned forward history.',
      'visit(url): truncate the array to everything up to and including `current` (dropping any old forward history), then append the new url and advance `current` to it.',
      'back/forward: just move `current` by `steps`, clamped with Math.max/Math.min to stay within [0, array.length - 1] — no array mutation needed for these two.',
    ],
    approach:
      "Maintain an array `history` and an integer `current` (index of the active page). visit(url): slice `history` down to `history[0..current]` inclusive (discarding any stale forward entries from a previous back()), push `url`, and set `current` to the new last index. back(steps): `current = Math.max(0, current - steps)`. forward(steps): `current = Math.min(history.length - 1, current + steps)`. Both return `history[current]`.",
    approachHi:
      "Ek array `history` aur ek integer `current` (active page ka index) maintain karo. visit(url): `history` ko `history[0..current]` (inclusive) tak slice karo (pichle back() se koi stale forward entries discard karte hue), `url` push karo, aur `current` ko naye last index par set karo. back(steps): `current = Math.max(0, current - steps)`. forward(steps): `current = Math.min(history.length - 1, current + steps)`. Dono `history[current]` return karte hain.",
    timeComplexity: 'O(1) amortized for back/forward, O(k) for visit (k = discarded forward entries)',
    spaceComplexity: 'O(total pages visited)',
    solutionExplanation:
      "The defining subtlety of browser history is that visiting a new page after going back must genuinely DESTROY the old forward path, not merely stop pointing at it — a later forward() must never resurrect pages that were abandoned by an intervening visit. Truncating the array down to `current` before appending a new URL enforces exactly this: any entries past `current` (the old forward history) are physically removed from the array, so there is nothing left for a subsequent forward() to reach even in principle, correctly modeling that visiting is not just 'add a page' but 'commit to a new future, abandoning the old one.'",
    solutionExplanationHi:
      "Browser history ki defining subtlety ye hai ki back jaane ke baad ek nayi page visit karna genuinely purane forward path ko DESTROY karna chahiye, sirf usko point karna band karna nahi — baad mein ek forward() ko kabhi un pages ko resurrect nahi karna chahiye jo beech mein hue ek visit se abandon ho gayi thin. Naya URL append karne se pehle array ko `current` tak truncate karna exactly yahi enforce karta hai: `current` ke aage wali koi bhi entries (purani forward history) array se physically hata di jaati hain, isliye baad wale forward() ke pahunchne ke liye principle mein bhi kuch bacha nahi rehta, correctly ye model karte hue ki visit karna sirf 'ek page add karo' nahi balki 'ek naye future ko commit karo, purane ko abandon karte hue' hai.",
    starter: starter(
      `const homepage = line(0);
const n = num(1);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(2 + i));

class BrowserHistory {
  constructor(homepage) {
    // set up with homepage as the only entry
  }
  visit(url) {
    // visit a new page, discarding forward history
  }
  back(steps) {
    // move back, clamped; return the current url
    return '';
  }
  forward(steps) {
    // move forward, clamped; return the current url
    return '';
  }
}

const bh = new BrowserHistory(homepage);
const output = [];
for (const parts of ops) {
  if (parts[0] === 'visit') bh.visit(parts[1]);
  else if (parts[0] === 'back') output.push(bh.back(Number(parts[1])));
  else output.push(bh.forward(Number(parts[1])));
}
console.log(output.join('\\n'));`,
      `homepage = line(0)
n = num(1)
ops = [words(2 + i) for i in range(n)]

class BrowserHistory:
    def __init__(self, homepage):
        # set up with homepage as the only entry
        pass

    def visit(self, url):
        # visit a new page, discarding forward history
        pass

    def back(self, steps):
        # move back, clamped; return the current url
        return ""

    def forward(self, steps):
        # move forward, clamped; return the current url
        return ""

bh = BrowserHistory(homepage)
output = []
for parts in ops:
    if parts[0] == "visit":
        bh.visit(parts[1])
    elif parts[0] == "back":
        output.append(bh.back(int(parts[1])))
    else:
        output.append(bh.forward(int(parts[1])))
print("\\n".join(output))`,
    ),
    solution: solution(
      `const homepage = line(0);
const n = num(1);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(2 + i));
class BrowserHistory {
  constructor(homepage) {
    this.history = [homepage];
    this.current = 0;
  }
  visit(url) {
    this.history = this.history.slice(0, this.current + 1);
    this.history.push(url);
    this.current = this.history.length - 1;
  }
  back(steps) {
    this.current = Math.max(0, this.current - steps);
    return this.history[this.current];
  }
  forward(steps) {
    this.current = Math.min(this.history.length - 1, this.current + steps);
    return this.history[this.current];
  }
}
const bh = new BrowserHistory(homepage);
const output = [];
for (const parts of ops) {
  if (parts[0] === 'visit') bh.visit(parts[1]);
  else if (parts[0] === 'back') output.push(bh.back(Number(parts[1])));
  else output.push(bh.forward(Number(parts[1])));
}
console.log(output.join('\\n'));`,
      `homepage = line(0)
n = num(1)
ops = [words(2 + i) for i in range(n)]

class BrowserHistory:
    def __init__(self, homepage):
        self.history = [homepage]
        self.current = 0

    def visit(self, url):
        self.history = self.history[: self.current + 1]
        self.history.append(url)
        self.current = len(self.history) - 1

    def back(self, steps):
        self.current = max(0, self.current - steps)
        return self.history[self.current]

    def forward(self, steps):
        self.current = min(len(self.history) - 1, self.current + steps)
        return self.history[self.current]

bh = BrowserHistory(homepage)
output = []
for parts in ops:
    if parts[0] == "visit":
        bh.visit(parts[1])
    elif parts[0] == "back":
        output.append(bh.back(int(parts[1])))
    else:
        output.append(bh.forward(int(parts[1])))
print("\\n".join(output))`,
    ),
    testCases: [
      sample(
        'leetcode.com\n7\nvisit google.com\nvisit facebook.com\nvisit youtube.com\nback 1\nback 1\nforward 1\nvisit linkedin.com',
        'facebook.com\ngoogle.com\nfacebook.com',
      ),
      hidden('a.com\n1\nback 5', 'a.com'),
      hidden('a.com\n2\nvisit b.com\nforward 5', 'b.com'),
      hidden('a.com\n4\nvisit b.com\nback 1\nvisit c.com\nforward 5', 'a.com\nc.com'),
    ],
  },

  {
    slug: 'design-twitter',
    title: 'Design Twitter',
    category: 'Design',
    difficulty: 'MEDIUM',
    description:
      'Design a simplified Twitter supporting `postTweet(userId, tweetId)`, `follow(followerId, followeeId)`, `unfollow(followerId, followeeId)`, and `getNewsFeed(userId)` (the 10 most recent tweet IDs from the user and everyone they follow, most recent first).\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `postTweet u t` / `follow a b` / `unfollow a b` / `getNewsFeed u`\n\n**Output**\nFor each `getNewsFeed`, the resulting tweet IDs (space-separated, most recent first, or an empty line if none) on its own line.',
    descriptionHi:
      'Ek simplified Twitter design karo jo `postTweet(userId, tweetId)`, `follow(followerId, followeeId)`, `unfollow(followerId, followeeId)`, aur `getNewsFeed(userId)` (user aur wo jinhe wo follow karta hai, un sab ke 10 sabse recent tweet IDs, sabse recent pehle) support kare.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `postTweet u t` / `follow a b` / `unfollow a b` / `getNewsFeed u`\n\n**Output**\nHar `getNewsFeed` ke liye, resulting tweet IDs (space-separated, sabse recent pehle, ya khaali line agar koi nahi) apni line par.',
    examples: [
      { input: '5\npostTweet 1 5\ngetNewsFeed 1\nfollow 1 2\npostTweet 2 6\ngetNewsFeed 1', output: '5\n6 5' },
    ],
    constraints: ['1 <= n <= 3*10^4', 'follow/unfollow/postTweet userIds and tweetIds are integers'],
    hints: [
      "Track a global increasing 'time' counter, stamping every posted tweet with the time it was posted — this is what lets tweets from DIFFERENT users be merged into one chronologically correct feed later.",
      "Store each user's own tweets as a list of (time, tweetId) pairs, and each user's followee set as a hash set.",
      "getNewsFeed is a k-way merge: gather the most recent tweets from the user themself and each followee (each individual list is already time-ordered), then take the top 10 by time across all of them — a small max-heap over just the 'most recent unconsumed tweet from each relevant list' does this efficiently.",
    ],
    approach:
      "Maintain a global `time` counter (incremented on every postTweet), a Map from userId to their own tweets as a list of `[time, tweetId]` (newest appended last), and a Map from userId to a Set of followee IDs. postTweet: append `[time++, tweetId]` to the poster's list. follow/unfollow: add/remove from the follower's followee set. getNewsFeed(userId): collect the tail (most recent tweets) from the user's own list and every followee's list, merge them all, sort by time descending, and take the first 10 tweetIds.",
    approachHi:
      "Ek global `time` counter maintain karo (har postTweet par increment hota hai), userId se unke apne tweets ki list (`[time, tweetId]`, newest last mein appended) tak ek Map, aur userId se followee IDs ke Set tak ek Map. postTweet: poster ki list mein `[time++, tweetId]` append karo. follow/unfollow: follower ke followee set mein add/remove karo. getNewsFeed(userId): user ki apni list aur har followee ki list se tail (sabse recent tweets) collect karo, sabko merge karo, time ke descending order mein sort karo, aur pehle 10 tweetIds lo.",
    timeComplexity: 'O(F log F) per getNewsFeed where F = tweets considered across followees (bounded by 10 per followee), O(1) for post/follow/unfollow',
    spaceComplexity: 'O(total tweets + total follow relationships)',
    solutionExplanation:
      "The core difficulty is that tweets from different users each have their own independently time-ordered list, but the feed needs ONE globally time-ordered view across all of them — this is structurally identical to merging multiple sorted lists (the classic k-way merge pattern), just applied to tweets instead of arbitrary sorted arrays. Since only the top 10 tweets are ever needed, it's wasteful to fully merge-sort every tweet from every followee; pulling only each list's most recent handful (at most 10 per source, since no source can contribute more than 10 to a top-10 result) before merging bounds the total work by the number of followees times a small constant, rather than by the total historical tweet count.",
    solutionExplanationHi:
      "Core difficulty ye hai ki alag alag users ke tweets ki apni apni independently time-ordered list hoti hai, lekin feed ko un sab ke across EK globally time-ordered view chahiye — ye structurally exactly multiple sorted lists ko merge karne jaisa hai (classic k-way merge pattern), bas arbitrary sorted arrays ke bajaye tweets par apply hota hai. Kyunki sirf top 10 tweets hi kabhi chahiye hote hain, har followee ke har tweet ko fully merge-sort karna wasteful hai; merge karne se pehle har list se sirf sabse recent thodi si (per source at most 10, kyunki koi bhi source top-10 result mein 10 se zyada contribute nahi kar sakta) nikaalna total kaam ko followees ki sankhya times ek chhote constant se bound kar deta hai, total historical tweet count se nahi.",
    starter: starter(
      `const n = num(0);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(1 + i));

class Twitter {
  constructor() {
    // set up storage
  }
  postTweet(userId, tweetId) {
    // record a new tweet for userId
  }
  follow(followerId, followeeId) {
    // followerId now follows followeeId
  }
  unfollow(followerId, followeeId) {
    // followerId no longer follows followeeId
  }
  getNewsFeed(userId) {
    // return up to 10 most recent tweetIds (own + followees), newest first
    return [];
  }
}

const tw = new Twitter();
const output = [];
for (const parts of ops) {
  if (parts[0] === 'postTweet') tw.postTweet(Number(parts[1]), Number(parts[2]));
  else if (parts[0] === 'follow') tw.follow(Number(parts[1]), Number(parts[2]));
  else if (parts[0] === 'unfollow') tw.unfollow(Number(parts[1]), Number(parts[2]));
  else output.push(tw.getNewsFeed(Number(parts[1])).join(' '));
}
console.log(output.join('\\n'));`,
      `n = num(0)
ops = [words(1 + i) for i in range(n)]

class Twitter:
    def __init__(self):
        # set up storage
        pass

    def post_tweet(self, user_id, tweet_id):
        # record a new tweet for user_id
        pass

    def follow(self, follower_id, followee_id):
        # follower_id now follows followee_id
        pass

    def unfollow(self, follower_id, followee_id):
        # follower_id no longer follows followee_id
        pass

    def get_news_feed(self, user_id):
        # return up to 10 most recent tweetIds (own + followees), newest first
        return []

tw = Twitter()
output = []
for parts in ops:
    if parts[0] == "postTweet":
        tw.post_tweet(int(parts[1]), int(parts[2]))
    elif parts[0] == "follow":
        tw.follow(int(parts[1]), int(parts[2]))
    elif parts[0] == "unfollow":
        tw.unfollow(int(parts[1]), int(parts[2]))
    else:
        output.append(" ".join(map(str, tw.get_news_feed(int(parts[1])))))
print("\\n".join(output))`,
    ),
    solution: solution(
      `const n = num(0);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(1 + i));
class Twitter {
  constructor() {
    this.time = 0;
    this.tweets = new Map();
    this.following = new Map();
  }
  postTweet(userId, tweetId) {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId).push([this.time++, tweetId]);
  }
  follow(followerId, followeeId) {
    if (!this.following.has(followerId)) this.following.set(followerId, new Set());
    this.following.get(followerId).add(followeeId);
  }
  unfollow(followerId, followeeId) {
    if (this.following.has(followerId)) this.following.get(followerId).delete(followeeId);
  }
  getNewsFeed(userId) {
    const sources = new Set([userId, ...(this.following.get(userId) || [])]);
    const merged = [];
    for (const uid of sources) {
      const list = this.tweets.get(uid);
      if (list) merged.push(...list.slice(-10));
    }
    merged.sort((a, b) => b[0] - a[0]);
    return merged.slice(0, 10).map((t) => t[1]);
  }
}
const tw = new Twitter();
const output = [];
for (const parts of ops) {
  if (parts[0] === 'postTweet') tw.postTweet(Number(parts[1]), Number(parts[2]));
  else if (parts[0] === 'follow') tw.follow(Number(parts[1]), Number(parts[2]));
  else if (parts[0] === 'unfollow') tw.unfollow(Number(parts[1]), Number(parts[2]));
  else output.push(tw.getNewsFeed(Number(parts[1])).join(' '));
}
console.log(output.join('\\n'));`,
      `n = num(0)
ops = [words(1 + i) for i in range(n)]

class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets = {}
        self.following = {}

    def post_tweet(self, user_id, tweet_id):
        self.tweets.setdefault(user_id, []).append((self.time, tweet_id))
        self.time += 1

    def follow(self, follower_id, followee_id):
        self.following.setdefault(follower_id, set()).add(followee_id)

    def unfollow(self, follower_id, followee_id):
        if follower_id in self.following:
            self.following[follower_id].discard(followee_id)

    def get_news_feed(self, user_id):
        sources = {user_id} | self.following.get(user_id, set())
        merged = []
        for uid in sources:
            lst = self.tweets.get(uid)
            if lst:
                merged.extend(lst[-10:])
        merged.sort(key=lambda t: -t[0])
        return [t[1] for t in merged[:10]]

tw = Twitter()
output = []
for parts in ops:
    if parts[0] == "postTweet":
        tw.post_tweet(int(parts[1]), int(parts[2]))
    elif parts[0] == "follow":
        tw.follow(int(parts[1]), int(parts[2]))
    elif parts[0] == "unfollow":
        tw.unfollow(int(parts[1]), int(parts[2]))
    else:
        output.append(" ".join(map(str, tw.get_news_feed(int(parts[1])))))
print("\\n".join(output))`,
    ),
    testCases: [
      sample('5\npostTweet 1 5\ngetNewsFeed 1\nfollow 1 2\npostTweet 2 6\ngetNewsFeed 1', '5\n6 5'),
      hidden('1\ngetNewsFeed 1', ''),
      hidden('6\npostTweet 1 1\nfollow 1 2\npostTweet 2 2\nunfollow 1 2\ngetNewsFeed 1\ngetNewsFeed 2', '1\n2'),
      hidden('4\npostTweet 1 10\npostTweet 1 20\npostTweet 1 30\ngetNewsFeed 1', '30 20 10'),
    ],
  },

  {
    slug: 'lru-cache',
    title: 'LRU Cache',
    category: 'Design',
    difficulty: 'MEDIUM',
    description:
      'Design a fixed-capacity cache supporting `get(key)` (returns the value, or -1 if absent, and marks the key as most recently used) and `put(key, value)` (inserts or updates, marking most recently used; if inserting over capacity, evicts the LEAST recently used key first) — both in O(1).\n\n**Input**\n- Line 1: `capacity`\n- Line 2: `n`\n- Next `n` lines: `get key` or `put key value`\n\n**Output**\nFor each `get`, the result on its own line.',
    descriptionHi:
      'Ek fixed-capacity cache design karo jo `get(key)` (value return karta hai, ya -1 agar absent hai, aur key ko most recently used mark karta hai) aur `put(key, value)` (insert ya update karta hai, most recently used mark karte hue; agar capacity se upar insert ho raha hai, to pehle LEAST recently used key evict karta hai) support kare — dono O(1) mein.\n\n**Input**\n- Line 1: `capacity`\n- Line 2: `n`\n- Agli `n` lines: `get key` ya `put key value`\n\n**Output**\nHar `get` ke liye, result apni line par.',
    examples: [
      { input: '2\n9\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4', output: '1\n-1\n-1\n3\n4' },
    ],
    constraints: ['1 <= capacity <= 3000', '0 <= key, value <= 10^4'],
    hints: [
      'O(1) key lookup alone is easy (a hash map), but tracking "least recently used" AND being able to remove that specific entry in O(1) is the hard part — a plain array or list would need O(n) to find/move/remove an arbitrary entry.',
      'A doubly linked list lets you remove or move any node in O(1) once you already have a reference to it — no scanning needed, since each node knows its own neighbors.',
      "Combine a hash map (key -> its doubly-linked-list node) with a doubly linked list kept in recency order (most-recently-used at one end, least-recently-used at the other) — every operation becomes: look up the node in O(1) via the map, then unlink+relink it in O(1) via the list.",
    ],
    approach:
      "Maintain a hash map (key -> node) and a doubly linked list with permanent dummy head/tail sentinels, ordered from most-recently-used (right after head) to least-recently-used (right before tail). A helper `moveToFront(node)` unlinks a node from wherever it is and relinks it right after head — used by both get and put whenever a key is touched. get(key): if present, moveToFront and return its value; else return -1. put(key, value): if key exists, update its value and moveToFront; otherwise create a new node, insert it right after head, and if size now exceeds capacity, remove the node right before tail (the true least-recently-used) and delete it from the map too.",
    approachHi:
      "Ek hash map (key -> node) aur ek doubly linked list maintain karo jismein permanent dummy head/tail sentinels hon, most-recently-used (head ke turant baad) se least-recently-used (tail ke turant pehle) tak ordered. Ek helper `moveToFront(node)` node ko jahan bhi hai wahan se unlink karke head ke turant baad relink karta hai — get aur put dono use karte hain jab bhi koi key touch hoti hai. get(key): agar present hai, moveToFront karo aur uski value return karo; warna -1 return karo. put(key, value): agar key exist karta hai, uski value update karo aur moveToFront karo; warna ek naya node banao, use head ke turant baad insert karo, aur agar size ab capacity se zyada ho gaya hai, tail ke turant pehle wala node (asli least-recently-used) remove karo aur use map se bhi delete karo.",
    timeComplexity: 'O(1) per get/put',
    spaceComplexity: 'O(capacity)',
    solutionExplanation:
      "The reason neither structure alone suffices mirrors Insert Delete GetRandom O(1): a hash map gives O(1) key lookup but has no notion of usage ORDER, while a plain array/list can maintain order but costs O(n) to relocate or remove an arbitrary element by key. A doubly linked list resolves that cost specifically because each node holds direct pointers to its own neighbors — given a node reference (which the hash map supplies in O(1)), unlinking it (updating its neighbors' pointers to skip it) and relinking it elsewhere are both pure O(1) pointer rewrites, with no scanning required at any point. Dummy head/tail sentinels remove the need to special-case 'is this the first/last real node' during every insert/remove, since every real node always has a real (possibly dummy) neighbor on both sides.",
    solutionExplanationHi:
      "Koi bhi ek structure akela kaafi kyun nahi hai iska reason Insert Delete GetRandom O(1) jaisa hi hai: ek hash map O(1) key lookup deta hai lekin usage ORDER ka koi concept nahi rakhta, jabki ek plain array/list order maintain kar sakta hai lekin key se kisi arbitrary element ko relocate ya remove karna O(n) lagta hai. Ek doubly linked list us cost ko specifically isliye resolve karta hai kyunki har node apne khud ke neighbors ke direct pointers rakhta hai — ek node reference diye jaane par (jo hash map O(1) mein deta hai), use unlink karna (uske neighbors ke pointers ko update karke use skip karna) aur kahin aur relink karna dono pure O(1) pointer rewrites hain, kisi bhi point par scanning ki zaroorat nahi. Dummy head/tail sentinels har insert/remove ke dauraan 'kya ye pehla/aakhri real node hai' special-case karne ki zaroorat hata dete hain, kyunki har real node ke dono taraf hamesha ek real (possibly dummy) neighbor hota hai.",
    starter: starter(
      `const capacity = num(0);
const n = num(1);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(2 + i));

class LRUCache {
  constructor(capacity) {
    // set up storage with the given capacity
  }
  get(key) {
    // return the value, or -1 if absent; mark as most recently used
    return -1;
  }
  put(key, value) {
    // insert/update, marking most recently used; evict LRU if over capacity
  }
}

const cache = new LRUCache(capacity);
const output = [];
for (const parts of ops) {
  if (parts[0] === 'get') output.push(cache.get(Number(parts[1])));
  else cache.put(Number(parts[1]), Number(parts[2]));
}
console.log(output.join('\\n'));`,
      `capacity = num(0)
n = num(1)
ops = [words(2 + i) for i in range(n)]

class LRUCache:
    def __init__(self, capacity):
        # set up storage with the given capacity
        pass

    def get(self, key):
        # return the value, or -1 if absent; mark as most recently used
        return -1

    def put(self, key, value):
        # insert/update, marking most recently used; evict LRU if over capacity
        pass

cache = LRUCache(capacity)
output = []
for parts in ops:
    if parts[0] == "get":
        output.append(cache.get(int(parts[1])))
    else:
        cache.put(int(parts[1]), int(parts[2]))
print("\\n".join(map(str, output)))`,
    ),
    solution: solution(
      `const capacity = num(0);
const n = num(1);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(2 + i));
class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new Node(-1, -1);
    this.tail = new Node(-1, -1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  _insertFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._insertFront(node);
    return node.value;
  }
  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this._remove(node);
      this._insertFront(node);
      return;
    }
    const node = new Node(key, value);
    this.map.set(key, node);
    this._insertFront(node);
    if (this.map.size > this.capacity) {
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
    }
  }
}
const cache = new LRUCache(capacity);
const output = [];
for (const parts of ops) {
  if (parts[0] === 'get') output.push(cache.get(Number(parts[1])));
  else cache.put(Number(parts[1]), Number(parts[2]));
}
console.log(output.join('\\n'));`,
      `capacity = num(0)
n = num(1)
ops = [words(2 + i) for i in range(n)]

class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.map = {}
        self.head = Node(-1, -1)
        self.tail = Node(-1, -1)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert_front(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key):
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node)
        self._insert_front(node)
        return node.value

    def put(self, key, value):
        if key in self.map:
            node = self.map[key]
            node.value = value
            self._remove(node)
            self._insert_front(node)
            return
        node = Node(key, value)
        self.map[key] = node
        self._insert_front(node)
        if len(self.map) > self.capacity:
            lru = self.tail.prev
            self._remove(lru)
            del self.map[lru.key]

cache = LRUCache(capacity)
output = []
for parts in ops:
    if parts[0] == "get":
        output.append(cache.get(int(parts[1])))
    else:
        cache.put(int(parts[1]), int(parts[2]))
print("\\n".join(map(str, output)))`,
    ),
    testCases: [
      sample(
        '2\n9\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4',
        '1\n-1\n-1\n3\n4',
      ),
      hidden('1\n3\nput 1 1\nput 2 2\nget 1', '-1'),
      hidden('2\n4\nput 1 1\nput 2 2\nput 1 10\nget 1', '10'),
      hidden('2\n2\nget 1\nput 1 5', '-1'),
    ],
  },

  {
    slug: 'lfu-cache',
    title: 'LFU Cache',
    category: 'Design',
    difficulty: 'HARD',
    description:
      'Design a fixed-capacity cache supporting `get(key)` (returns the value, or -1 if absent, and increments its use frequency) and `put(key, value)` (inserts or updates, incrementing frequency; if inserting over capacity, evicts the LEAST FREQUENTLY used key, breaking ties by LEAST recently used among those).\n\n**Input**\n- Line 1: `capacity`\n- Line 2: `n`\n- Next `n` lines: `get key` or `put key value`\n\n**Output**\nFor each `get`, the result on its own line.',
    descriptionHi:
      'Ek fixed-capacity cache design karo jo `get(key)` (value return karta hai, ya -1 agar absent hai, aur uski use frequency increment karta hai) aur `put(key, value)` (insert ya update karta hai, frequency increment karte hue; agar capacity se upar insert ho raha hai, LEAST FREQUENTLY used key evict karta hai, unmein tie ko LEAST recently used se break karte hue) support kare.\n\n**Input**\n- Line 1: `capacity`\n- Line 2: `n`\n- Agli `n` lines: `get key` ya `put key value`\n\n**Output**\nHar `get` ke liye, result apni line par.',
    examples: [
      { input: '2\n11\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nget 3\nput 4 4\nget 1\nget 3\nget 4\nget 2', output: '1\n-1\n3\n-1\n3\n4\n-1' },
    ],
    constraints: ['0 <= capacity <= 10^4', '0 <= key, value <= 10^9'],
    hints: [
      "Track each key's frequency count in a hash map, AND for each frequency value, keep the set of keys currently at that frequency in RECENCY ORDER (a small doubly linked list per frequency, or an ordered structure like JS's Map/Python's OrderedDict, which preserve insertion order) — this handles the LRU tie-break within a frequency tier.",
      'Also track `minFreq`, the smallest frequency currently present anywhere in the cache — this is exactly which frequency tier to evict from when the cache is full.',
      "Whenever a key's frequency increases (on get, or on put for an existing key), remove it from its old frequency tier's list and append it to the new (freq+1) tier's list, as the most-recently-used entry in that new tier — this is genuinely the same node-relocation idea as LRU Cache, just across TWO levels: frequency, and then recency within a frequency.",
    ],
    approach:
      "Maintain: a hash map `values` (key -> value), a hash map `freq` (key -> its current use count), a hash map `freqGroups` (frequency -> a Map, acting as an ordered set of keys currently at that frequency, oldest-touched first), and an integer `minFreq`. `touch(key)`: remove key from `freqGroups[freq[key]]`, increment `freq[key]`, insert key into `freqGroups[freq[key]]` (append = now most-recently-used in its new tier); if the OLD tier is now empty and was `minFreq`, increment `minFreq`. get(key): if absent, -1; else touch(key) and return `values[key]`. put(key, value): if key exists, update `values[key]` and touch(key); otherwise, if at capacity, evict the oldest key from `freqGroups[minFreq]` (removing it from all maps), then insert the new key with `values[key]=value`, `freq[key]=1`, append to `freqGroups[1]`, and set `minFreq = 1`.",
    approachHi:
      "Maintain karo: ek hash map `values` (key -> value), ek hash map `freq` (key -> uska current use count), ek hash map `freqGroups` (frequency -> ek Map, jo us frequency par abhi maujood keys ka ordered set ki tarah act karta hai, oldest-touched pehle), aur ek integer `minFreq`. `touch(key)`: key ko `freqGroups[freq[key]]` se remove karo, `freq[key]` increment karo, key ko `freqGroups[freq[key]]` mein insert karo (append = ab uski nayi tier mein most-recently-used); agar OLD tier ab empty hai aur wo `minFreq` thi, `minFreq` increment karo. get(key): agar absent hai, -1; warna touch(key) karo aur `values[key]` return karo. put(key, value): agar key exist karti hai, `values[key]` update karo aur touch(key) karo; warna, agar capacity par ho, `freqGroups[minFreq]` se sabse purani key evict karo (use saare maps se remove karte hue), phir nayi key insert karo `values[key]=value`, `freq[key]=1` ke saath, `freqGroups[1]` mein append karo, aur `minFreq = 1` set karo.",
    timeComplexity: 'O(1) per get/put',
    spaceComplexity: 'O(capacity)',
    solutionExplanation:
      "LFU is genuinely a two-level generalization of LRU Cache's core trick: LRU only needed ONE ordering axis (recency) and one doubly-linked list to track it in O(1); LFU needs TWO axes simultaneously — primarily frequency (evict the least-used tier first), and recency ONLY as a tie-break within that tier — so the structure becomes a hash map of small ordered groups, one group per frequency value, each internally maintaining recency order exactly the way LRU Cache's single list did. Maintaining `minFreq` incrementally (rather than scanning for the minimum frequency on every eviction) is what keeps the whole operation O(1): a key's frequency only ever increases by exactly 1 per touch, so the only way `minFreq`'s tier can become empty is via the key that was JUST touched leaving it — checking that one specific tier after each touch is sufficient to keep `minFreq` correct, with no need to ever re-scan every frequency tier.",
    solutionExplanationHi:
      "LFU genuinely LRU Cache ke core trick ka ek two-level generalization hai: LRU ko sirf EK ordering axis (recency) chahiye tha aur ek doubly-linked list use O(1) mein track karne ke liye; LFU ko do axes ek saath chahiye — primarily frequency (sabse kam-used tier pehle evict karo), aur recency SIRF us tier ke andar tie-break ke liye — isliye structure ek hash map ban jaata hai chhote ordered groups ka, har frequency value ke liye ek group, har ek internally recency order maintain karta hai exactly waise jaise LRU Cache ki single list karti thi. `minFreq` ko incrementally maintain karna (har eviction par minimum frequency scan karne ke bajaye) hi poore operation ko O(1) rakhta hai: ek key ki frequency har touch par exactly 1 se hi badhti hai, isliye `minFreq` ki tier ke empty hone ka sirf ek tarika hai ki wahi key jo ABHI touch hui thi use chhod de — har touch ke baad us ek specific tier ko check karna `minFreq` ko sahi rakhne ke liye kaafi hai, kabhi bhi har frequency tier ko dobara scan karne ki zaroorat nahi.",
    starter: starter(
      `const capacity = num(0);
const n = num(1);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(2 + i));

class LFUCache {
  constructor(capacity) {
    // set up storage with the given capacity
  }
  get(key) {
    // return the value, or -1 if absent; bump its frequency
    return -1;
  }
  put(key, value) {
    // insert/update, bumping frequency; evict least-frequent (LRU tie-break) if over capacity
  }
}

const cache = new LFUCache(capacity);
const output = [];
for (const parts of ops) {
  if (parts[0] === 'get') output.push(cache.get(Number(parts[1])));
  else cache.put(Number(parts[1]), Number(parts[2]));
}
console.log(output.join('\\n'));`,
      `capacity = num(0)
n = num(1)
ops = [words(2 + i) for i in range(n)]

class LFUCache:
    def __init__(self, capacity):
        # set up storage with the given capacity
        pass

    def get(self, key):
        # return the value, or -1 if absent; bump its frequency
        return -1

    def put(self, key, value):
        # insert/update, bumping frequency; evict least-frequent (LRU tie-break) if over capacity
        pass

cache = LFUCache(capacity)
output = []
for parts in ops:
    if parts[0] == "get":
        output.append(cache.get(int(parts[1])))
    else:
        cache.put(int(parts[1]), int(parts[2]))
print("\\n".join(map(str, output)))`,
    ),
    solution: solution(
      `const capacity = num(0);
const n = num(1);
const ops = [];
for (let i = 0; i < n; i++) ops.push(words(2 + i));
class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.values = new Map();
    this.freq = new Map();
    this.freqGroups = new Map();
    this.minFreq = 0;
  }
  _touch(key) {
    const f = this.freq.get(key);
    const group = this.freqGroups.get(f);
    group.delete(key);
    if (group.size === 0) {
      this.freqGroups.delete(f);
      if (this.minFreq === f) this.minFreq = f + 1;
    }
    this.freq.set(key, f + 1);
    if (!this.freqGroups.has(f + 1)) this.freqGroups.set(f + 1, new Map());
    this.freqGroups.get(f + 1).set(key, true);
  }
  get(key) {
    if (!this.values.has(key)) return -1;
    this._touch(key);
    return this.values.get(key);
  }
  put(key, value) {
    if (this.capacity === 0) return;
    if (this.values.has(key)) {
      this.values.set(key, value);
      this._touch(key);
      return;
    }
    if (this.values.size >= this.capacity) {
      const group = this.freqGroups.get(this.minFreq);
      const oldestKey = group.keys().next().value;
      group.delete(oldestKey);
      if (group.size === 0) this.freqGroups.delete(this.minFreq);
      this.values.delete(oldestKey);
      this.freq.delete(oldestKey);
    }
    this.values.set(key, value);
    this.freq.set(key, 1);
    if (!this.freqGroups.has(1)) this.freqGroups.set(1, new Map());
    this.freqGroups.get(1).set(key, true);
    this.minFreq = 1;
  }
}
const cache = new LFUCache(capacity);
const output = [];
for (const parts of ops) {
  if (parts[0] === 'get') output.push(cache.get(Number(parts[1])));
  else cache.put(Number(parts[1]), Number(parts[2]));
}
console.log(output.join('\\n'));`,
      `from collections import OrderedDict

capacity = num(0)
n = num(1)
ops = [words(2 + i) for i in range(n)]

class LFUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.values = {}
        self.freq = {}
        self.freq_groups = {}
        self.min_freq = 0

    def _touch(self, key):
        f = self.freq[key]
        group = self.freq_groups[f]
        del group[key]
        if not group:
            del self.freq_groups[f]
            if self.min_freq == f:
                self.min_freq = f + 1
        self.freq[key] = f + 1
        self.freq_groups.setdefault(f + 1, OrderedDict())[key] = True

    def get(self, key):
        if key not in self.values:
            return -1
        self._touch(key)
        return self.values[key]

    def put(self, key, value):
        if self.capacity == 0:
            return
        if key in self.values:
            self.values[key] = value
            self._touch(key)
            return
        if len(self.values) >= self.capacity:
            group = self.freq_groups[self.min_freq]
            oldest_key = next(iter(group))
            del group[oldest_key]
            if not group:
                del self.freq_groups[self.min_freq]
            del self.values[oldest_key]
            del self.freq[oldest_key]
        self.values[key] = value
        self.freq[key] = 1
        self.freq_groups.setdefault(1, OrderedDict())[key] = True
        self.min_freq = 1

cache = LFUCache(capacity)
output = []
for parts in ops:
    if parts[0] == "get":
        output.append(cache.get(int(parts[1])))
    else:
        cache.put(int(parts[1]), int(parts[2]))
print("\\n".join(map(str, output)))`,
    ),
    testCases: [
      sample(
        '2\n11\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nget 3\nput 4 4\nget 1\nget 3\nget 4\nget 2',
        '1\n-1\n3\n-1\n3\n4\n-1',
      ),
      hidden('0\n2\nput 1 1\nget 1', '-1'),
      hidden('1\n4\nput 1 1\nput 2 2\nget 1\nget 2', '-1\n2'),
      hidden('2\n6\nput 1 1\nput 2 2\nget 1\nget 1\nput 3 3\nget 2', '1\n1\n-1'),
    ],
  },
];
