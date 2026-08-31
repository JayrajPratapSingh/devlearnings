/**
 * DSA Complete Course — Module 4: Linked Lists, lesson 6.
 *
 * Designing a data structure by COMBINING two structures so that every required
 * operation is O(1) — the LRU cache (hash map + doubly linked list) as the
 * canonical example, plus min-stack and insert/delete/getRandom. Builds directly
 * on this module's lesson 2 (a doubly linked list, where a node knows its own
 * prev and can therefore unlink itself in O(1)) and this course's Module 3 (a
 * hash map answers "where is this key" in O(1)). Broken example: an LRU cache
 * built on an array of entries in recency order — correct, but every get must
 * scan the array to find the key, and every touch must splice the entry out of
 * the middle and push it to the front, so both are O(n). A Map-only version is
 * no better: lookup becomes O(1) but eviction still scans every entry for the
 * oldest timestamp. Fixed by keeping BOTH: the map gives O(1) "where is this
 * key's node", and the doubly linked list gives O(1) "unlink this node and move
 * it to the front", because the node already holds its own prev and next.
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

export const DSA_MODULE_4_PART6: CourseLesson[] = [
  {
    slug: 'design-lru-cache-combining-structures',
    title: 'Designing a Structure: LRU Cache (Hash Map + Doubly Linked List)',
    titleHi: 'Ek Structure Design Karna: LRU Cache (Hash Map + Doubly Linked List)',
    description: 'Building a fixed-capacity cache that evicts the least-recently-used entry, using an array kept in recency order. It is correct and easy to picture, but every lookup scans the array for the key, and every hit has to splice that entry out of the middle and move it to the front — so both get and put are O(n) on a cache that exists precisely to be fast.',
    descriptionHi: 'Ek fixed-capacity cache banaana jo least-recently-used entry evict karta hai, recency order mein rakhe ek array se. Ye sahi hai aur kalpna karne mein aasaan, par har lookup key ke liye array scan karta hai, aur har hit ko us entry ko beech se splice karke saamne le jaana padta hai — isliye ek aise cache par get aur put dono O(n) hain jo bilkul tez hone ke liye maujood hai.',
    difficulty: 'HARD',
    duration: 28,
    order: 6,

    analogy: {
      en: '**A busy pharmacy that keeps its most-requested medicines nearest the counter.** The stock is arranged on one long shelf in order of how recently each box was handed to a customer: most recent at the near end, least recent at the far end. When someone asks for a medicine, two things must happen fast — find the box, and move it to the near end so it stays close. A pharmacist who only has the shelf has to walk it looking for the box (slow), then physically shuffle every box between there and the near end to close the gap (also slow). Two fixes together make it instant. First, a card index at the counter maps each medicine name straight to a shelf position, so finding is one lookup instead of a walk. Second, the shelf is replaced by a chain where each box is clipped to the box before it and the box after it: to move a box, you unclip it from its two neighbours, clip those two to each other, and clip the box in at the near end. Nothing else on the shelf moves. Neither fix works alone — the index alone still leaves you shuffling boxes, and the chain alone still leaves you searching for which link to unclip. Together, both operations are a fixed handful of steps no matter how large the stock.',
      hi: '**Ek vyast pharmacy jo apni sabse zyaada maangi gayi dawaayein counter ke sabse paas rakhti hai.** Stock ek lambi shelf par is order mein rakha hai ki har box kitne haal mein ek customer ko diya gaya: sabse haaliya paas waale chhor par, sabse kam haaliya door waale chhor par. Jab koi ek dawaa maangta hai, do cheezein tezi se honi chahiye — box dhoondho, aur ise paas waale chhor par le jao taaki ye kareeb rahe. Ek pharmacist jiske paas sirf shelf hai use box dhoondhte hue chalna padta hai (slow), phir wahaan aur paas waale chhor ke beech har box ko physically shuffle karna padta hai gap band karne ke liye (bhi slow). Do fixes saath ise turant banaate hain. Pehla, counter par ek card index har dawaa ke naam ko seedhe ek shelf position par map karta hai, isliye dhoondhna ek walk ke bajaye ek lookup hai. Doosra, shelf ko ek chain se badla jaata hai jahaan har box apne pehle ke box aur baad ke box se clipped hai: ek box move karne ke liye, aap ise iske do neighbours se unclip karte ho, un dono ko ek doosre se clip karte ho, aur box ko paas waale chhor par clip karte ho. Shelf par kuch aur nahi hilta. Koi bhi fix akela kaam nahi karta — akela index abhi bhi aapko boxes shuffle karta chhodta hai, aur akeli chain abhi bhi aapko dhoondhta chhodti hai ki kaunsa link unclip karna hai. Saath, dono operations steps ki ek fixed mutthi hain chahe stock kitna bhi bada ho.',
    },

    simple: `**Start broken.** An LRU cache backed by an array in recency order:

\`\`\`js
class LRUCacheArray {
  constructor(capacity) { this.cap = capacity; this.items = []; }  // items[0] = most recent

  get(key) {
    const i = this.items.findIndex(e => e.key === key);   // O(n) SCAN
    if (i === -1) return -1;
    const [entry] = this.items.splice(i, 1);              // O(n) SHIFT of everything after i
    this.items.unshift(entry);                            // O(n) SHIFT of everything
    return entry.value;
  }

  put(key, value) {
    const i = this.items.findIndex(e => e.key === key);   // O(n) again
    if (i !== -1) this.items.splice(i, 1);
    this.items.unshift({ key, value });                   // O(n)
    if (this.items.length > this.cap) this.items.pop();   // evict the least recent: O(1)
  }
}
\`\`\`

Every operation scans and then shifts. This course's Module 1 lesson 5 established that inserting at the front of an array moves every existing element, and Module 4 lesson 1 made the same point about \`unshift\`. A cache whose whole purpose is fast access is O(n) per access.

Switching to a \`Map\` alone fixes lookup but not eviction:

\`\`\`js
class LRUCacheMapOnly {
  constructor(capacity) { this.cap = capacity; this.m = new Map(); this.clock = 0; }
  get(key) {
    if (!this.m.has(key)) return -1;
    const e = this.m.get(key);
    e.usedAt = this.clock++;                              // O(1) lookup — good
    return e.value;
  }
  put(key, value) {
    this.m.set(key, { value, usedAt: this.clock++ });
    if (this.m.size > this.cap) {
      let oldestKey = null, oldest = Infinity;
      for (const [k, e] of this.m) {                      // O(n) SCAN to find the victim
        if (e.usedAt < oldest) { oldest = e.usedAt; oldestKey = k; }
      }
      this.m.delete(oldestKey);
    }
  }
}
\`\`\`

The map gives O(1) lookup, but nothing records *order*, so eviction has to hunt for the minimum timestamp across every entry.

**The fix: a hash map for "where", a doubly linked list for "order"**

\`\`\`js
class Node {
  constructor(key, value) {
    this.key = key; this.value = value;
    this.prev = null; this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();                 // key -> the Node holding it
    // two sentinel nodes remove every null check from the link surgery
    this.head = new Node(null, null);     // head.next = MOST recently used
    this.tail = new Node(null, null);     // tail.prev = LEAST recently used
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _unlink(node) {                          // O(1): the node knows both neighbours
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _pushFront(node) {                       // O(1): splice in just after head
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    const node = this.map.get(key);        // O(1) — Module 3
    if (node === undefined) return -1;
    this._unlink(node);                    // O(1) — Module 4 lesson 2
    this._pushFront(node);                 // O(1)
    return node.value;
  }

  put(key, value) {
    const existing = this.map.get(key);
    if (existing !== undefined) {
      existing.value = value;
      this._unlink(existing);
      this._pushFront(existing);
      return;
    }
    const node = new Node(key, value);
    this.map.set(key, node);
    this._pushFront(node);

    if (this.map.size > this.cap) {
      const lru = this.tail.prev;          // O(1): the victim is always tail.prev
      this._unlink(lru);
      this.map.delete(lru.key);            // the node stores its key FOR THIS LINE
    }
  }
}
\`\`\`

Each structure supplies exactly what the other lacks. The map answers "which node holds this key" in O(1) but knows nothing about order. The doubly linked list maintains recency order and — because this module's lesson 2 gave every node a \`prev\` — lets any node unlink itself in O(1) without a traversal. Neither alone is enough; together every operation is O(1).`,

    simpleHi: `**Toote hue se shuru.** Recency order mein ek array par bana ek LRU cache:

\`\`\`js
class LRUCacheArray {
  constructor(capacity) { this.cap = capacity; this.items = []; }  // items[0] = sabse haaliya

  get(key) {
    const i = this.items.findIndex(e => e.key === key);   // O(n) SCAN
    if (i === -1) return -1;
    const [entry] = this.items.splice(i, 1);              // i ke baad sab ka O(n) SHIFT
    this.items.unshift(entry);                            // sab ka O(n) SHIFT
    return entry.value;
  }

  put(key, value) {
    const i = this.items.findIndex(e => e.key === key);   // phir O(n)
    if (i !== -1) this.items.splice(i, 1);
    this.items.unshift({ key, value });                   // O(n)
    if (this.items.length > this.cap) this.items.pop();   // sabse kam haaliya evict: O(1)
  }
}
\`\`\`

Har operation scan karta hai aur phir shift. Is course ke Module 1 lesson 5 ne sthaapit kiya ki ek array ke saamne insert karna har maujooda element ko move karta hai, aur Module 4 lesson 1 ne \`unshift\` ke baare mein wahi baat kahi. Ek cache jiska poora uddeshya tez access hai wo prati access O(n) hai.

Akele ek \`Map\` par switch karna lookup theek karta hai par eviction nahi:

\`\`\`js
class LRUCacheMapOnly {
  constructor(capacity) { this.cap = capacity; this.m = new Map(); this.clock = 0; }
  get(key) {
    if (!this.m.has(key)) return -1;
    const e = this.m.get(key);
    e.usedAt = this.clock++;                              // O(1) lookup — achha
    return e.value;
  }
  put(key, value) {
    this.m.set(key, { value, usedAt: this.clock++ });
    if (this.m.size > this.cap) {
      let oldestKey = null, oldest = Infinity;
      for (const [k, e] of this.m) {                      // victim dhoondhne ko O(n) SCAN
        if (e.usedAt < oldest) { oldest = e.usedAt; oldestKey = k; }
      }
      this.m.delete(oldestKey);
    }
  }
}
\`\`\`

Map O(1) lookup deta hai, par kuch bhi *order* record nahi karta, isliye eviction ko har entry par minimum timestamp dhoondhna padta hai.

**Fix: "kahaan" ke liye ek hash map, "order" ke liye ek doubly linked list**

\`\`\`js
class Node {
  constructor(key, value) {
    this.key = key; this.value = value;
    this.prev = null; this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();                 // key -> ise rakhne wala Node
    // do sentinel nodes link surgery se har null check hataate hain
    this.head = new Node(null, null);     // head.next = SABSE haaliya istemal
    this.tail = new Node(null, null);     // tail.prev = SABSE KAM haaliya istemal
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _unlink(node) {                          // O(1): node dono neighbours jaanta hai
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _pushFront(node) {                       // O(1): head ke theek baad splice karo
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    const node = this.map.get(key);        // O(1) — Module 3
    if (node === undefined) return -1;
    this._unlink(node);                    // O(1) — Module 4 lesson 2
    this._pushFront(node);                 // O(1)
    return node.value;
  }

  put(key, value) {
    const existing = this.map.get(key);
    if (existing !== undefined) {
      existing.value = value;
      this._unlink(existing);
      this._pushFront(existing);
      return;
    }
    const node = new Node(key, value);
    this.map.set(key, node);
    this._pushFront(node);

    if (this.map.size > this.cap) {
      const lru = this.tail.prev;          // O(1): victim hamesha tail.prev hai
      this._unlink(lru);
      this.map.delete(lru.key);            // node apni key IS LINE KE LIYE store karta hai
    }
  }
}
\`\`\`

Har structure bilkul wo deta hai jo doosre mein nahi hai. Map "kaunsa node ye key rakhta hai" O(1) mein jawaab deta hai par order ke baare mein kuch nahi jaanta. Doubly linked list recency order maintain karti hai aur — kyunki is module ke lesson 2 ne har node ko ek \`prev\` diya — kisi bhi node ko bina traversal ke O(1) mein khud ko unlink karne deti hai. Koi bhi akela kaafi nahi; saath har operation O(1) hai.`,

    content: `## Why the node must store its own key

\`\`\`js
if (this.map.size > this.cap) {
  const lru = this.tail.prev;
  this._unlink(lru);
  this.map.delete(lru.key);      // <- without node.key, you cannot do this line
}
\`\`\`

Eviction starts from the *list* side: the victim is whatever node sits at \`tail.prev\`. But the map is keyed by the cache key, so to delete the entry you need the key, and the only thing you have in hand is the node. Storing the key inside the node closes that loop. Forgetting it forces you to scan the map for the entry whose value is this node — an O(n) step that silently undoes the whole design. Whenever two structures point at each other, check that you can navigate the link in *both* directions.

## Why the two sentinel nodes are worth it

\`\`\`
Without sentinels, _unlink and _pushFront need branches:
  - is node the head?  then head = node.next  (and node.next may be null)
  - is node the tail?  then tail = node.prev  (and node.prev may be null)
  - is the list empty? then head = tail = node
Four cases, each a chance to leave a dangling pointer.

With a permanent head and tail sentinel:
  - every real node ALWAYS has a non-null prev and a non-null next
  - _unlink is exactly two assignments, no branches
  - the most recent is head.next, the least recent is tail.prev, always
  - the empty list is just head <-> tail, which needs no special case
\`\`\`

The sentinels are never returned to the caller and hold no data. They exist purely so that the link surgery has no edge cases — a small, standard trick that removes most of the bugs from hand-written linked-list code.

## The design method, generalised

\`\`\`
1. List every operation the structure must support and its required complexity.
       LRU: get O(1), put O(1), evict-least-recent O(1)
2. For EACH operation, name the structure that already does it in that time.
       "find by key in O(1)"        -> hash map        (Module 3)
       "reorder / remove in O(1)"   -> doubly linked list (Module 4 lesson 2)
       "min / max in O(log n)"      -> heap            (Module 8)
       "index-random in O(1)"       -> array           (Module 1 lesson 5)
3. If no single structure covers everything, keep several and make them point
   at each other. The map's VALUE is usually a handle into the other structure.
4. Check both navigation directions: given a key can you reach the node, AND
   given a node can you reach its key? (That is why Node stores key.)
5. Every mutation must update EVERY structure, or they drift out of sync.
\`\`\`

## Two more applications of the same method

\`\`\`js
// MIN-STACK: push, pop, top, and getMin, all O(1).
// One stack cannot do getMin in O(1) — so carry a second stack of running minima.
class MinStack {
  constructor() { this.stack = []; this.mins = []; }
  push(x) {
    this.stack.push(x);
    const currentMin = this.mins.length === 0 ? x : Math.min(x, this.mins[this.mins.length - 1]);
    this.mins.push(currentMin);           // mins[i] = the minimum of stack[0..i]
  }
  pop() { this.mins.pop(); return this.stack.pop(); }   // pop BOTH, always
  top() { return this.stack[this.stack.length - 1]; }
  getMin() { return this.mins[this.mins.length - 1]; }  // O(1)
}
\`\`\`

\`\`\`js
// INSERT / DELETE / GET-RANDOM, all O(1).
// Array gives O(1) random pick; map gives O(1) "where is this value".
// The trick for O(1) delete: swap the victim with the LAST element, then pop.
class RandomisedSet {
  constructor() { this.items = []; this.pos = new Map(); }   // value -> index in items
  insert(v) {
    if (this.pos.has(v)) return false;
    this.pos.set(v, this.items.length);
    this.items.push(v);
    return true;
  }
  remove(v) {
    if (!this.pos.has(v)) return false;
    const i = this.pos.get(v);
    const last = this.items[this.items.length - 1];
    this.items[i] = last;                 // move the last element into the hole
    this.pos.set(last, i);                // and FIX ITS RECORDED INDEX
    this.items.pop();
    this.pos.delete(v);
    return true;
  }
  getRandom() { return this.items[Math.floor(Math.random() * this.items.length)]; }
}
\`\`\`

Both are the same idea as the LRU cache: no single structure meets every requirement, so you keep two and maintain an invariant linking them. In \`RandomisedSet\` the invariant is "\`pos.get(v)\` is always the current index of \`v\` in \`items\`", and the easy bug is forgetting the \`pos.set(last, i)\` line after moving the last element — the map then points at a stale index.

## Complexity and the LinkedHashMap shortcut

\`\`\`
LRU cache with map + doubly linked list:
  get  O(1)      put  O(1)      evict  O(1)      space  O(capacity)

Note: JavaScript's Map preserves insertion order, so a compact LRU is possible
by delete-then-set to move a key to the end, and map.keys().next().value to find
the oldest. That is idiomatic and fine in an interview IF you say why it works.
Java's LinkedHashMap with accessOrder=true is the same shortcut. Interviewers
usually still want the map + list version, because it is the one that shows you
understand WHY each half is needed.
\`\`\``,

    contentHi: `## Node ko apni key kyun store karni chahiye

\`\`\`js
if (this.map.size > this.cap) {
  const lru = this.tail.prev;
  this._unlink(lru);
  this.map.delete(lru.key);      // <- node.key ke bina, aap ye line nahi kar sakte
}
\`\`\`

Eviction *list* side se shuru hoti hai: victim wo node hai jo \`tail.prev\` par baitha hai. Par map cache key se keyed hai, isliye entry delete karne ke liye aapko key chahiye, aur aapke haath mein sirf node hai. Node ke andar key store karna wo loop band karta hai. Ise bhoolna aapko map ko us entry ke liye scan karne par majboor karta hai jiski value ye node hai — ek O(n) step jo chupchaap poori design ko undo karta hai. Jab bhi do structures ek doosre ki taraf point karte hain, check karo ki aap link ko *dono* directions mein navigate kar sakte ho.

## Do sentinel nodes kyun laayak hain

\`\`\`
Sentinels ke bina, _unlink aur _pushFront ko branches chahiye:
  - kya node head hai?  toh head = node.next  (aur node.next null ho sakta hai)
  - kya node tail hai?  toh tail = node.prev  (aur node.prev null ho sakta hai)
  - kya list khaali hai? toh head = tail = node
Chaar cases, har ek ek dangling pointer chhodne ka mauka.

Ek sthaayi head aur tail sentinel ke saath:
  - har asli node ka HAMESHA ek non-null prev aur ek non-null next hota hai
  - _unlink bilkul do assignments hai, koi branches nahi
  - sabse haaliya head.next hai, sabse kam haaliya tail.prev, hamesha
  - khaali list bas head <-> tail hai, jise koi special case nahi chahiye
\`\`\`

Sentinels kabhi caller ko return nahi hote aur koi data nahi rakhte. Wo shuddh roop se isliye maujood hain taaki link surgery ke koi edge cases na hon — ek chhota, standard trick jo haath-se-likhe linked-list code se adhikaansh bugs hataata hai.

## Design method, generalised

\`\`\`
1. Har operation list karo jo structure ko support karna hai aur iski zaroori complexity.
       LRU: get O(1), put O(1), evict-least-recent O(1)
2. HAR operation ke liye, us structure ka naam do jo ise pehle se us time mein karta hai.
       "key se dhoondho O(1) mein"        -> hash map        (Module 3)
       "reorder / remove O(1) mein"       -> doubly linked list (Module 4 lesson 2)
       "min / max O(log n) mein"          -> heap            (Module 8)
       "index-random O(1) mein"           -> array           (Module 1 lesson 5)
3. Agar koi akela structure sab kuch cover nahi karta, kai rakho aur unhe ek doosre
   ki taraf point karvao. Map ki VALUE aksar doosre structure mein ek handle hoti hai.
4. Dono navigation directions check karo: ek key diye gaye kya aap node tak pahunch
   sakte ho, AUR ek node diye gaye kya aap iski key tak pahunch sakte ho? (Isliye Node key store karta hai.)
5. Har mutation ko HAR structure update karna chahiye, warna wo sync se bahar drift karte hain.
\`\`\`

## Usi method ke do aur applications

\`\`\`js
// MIN-STACK: push, pop, top, aur getMin, sab O(1).
// Ek stack getMin O(1) mein nahi kar sakta — toh running minima ka ek doosra stack le jao.
class MinStack {
  constructor() { this.stack = []; this.mins = []; }
  push(x) {
    this.stack.push(x);
    const currentMin = this.mins.length === 0 ? x : Math.min(x, this.mins[this.mins.length - 1]);
    this.mins.push(currentMin);           // mins[i] = stack[0..i] ka minimum
  }
  pop() { this.mins.pop(); return this.stack.pop(); }   // hamesha DONO pop karo
  top() { return this.stack[this.stack.length - 1]; }
  getMin() { return this.mins[this.mins.length - 1]; }  // O(1)
}
\`\`\`

\`\`\`js
// INSERT / DELETE / GET-RANDOM, sab O(1).
// Array O(1) random pick deta hai; map O(1) "ye value kahaan hai" deta hai.
// O(1) delete ka trick: victim ko AAKHRI element se swap karo, phir pop karo.
class RandomisedSet {
  constructor() { this.items = []; this.pos = new Map(); }   // value -> items mein index
  insert(v) {
    if (this.pos.has(v)) return false;
    this.pos.set(v, this.items.length);
    this.items.push(v);
    return true;
  }
  remove(v) {
    if (!this.pos.has(v)) return false;
    const i = this.pos.get(v);
    const last = this.items[this.items.length - 1];
    this.items[i] = last;                 // aakhri element ko hole mein move karo
    this.pos.set(last, i);                // aur ISKA RECORDED INDEX THEEK KARO
    this.items.pop();
    this.pos.delete(v);
    return true;
  }
  getRandom() { return this.items[Math.floor(Math.random() * this.items.length)]; }
}
\`\`\`

Dono LRU cache jaise hi idea hain: koi akela structure har requirement poori nahi karta, isliye aap do rakhte ho aur unhe jodne wala ek invariant maintain karte ho. \`RandomisedSet\` mein invariant hai "\`pos.get(v)\` hamesha \`items\` mein \`v\` ka current index hai", aur aasaan bug aakhri element move karne ke baad \`pos.set(last, i)\` line bhoolna hai — map phir ek stale index par point karta hai.

## Complexity aur LinkedHashMap shortcut

\`\`\`
map + doubly linked list ke saath LRU cache:
  get  O(1)      put  O(1)      evict  O(1)      space  O(capacity)

Note: JavaScript ka Map insertion order preserve karta hai, isliye ek compact LRU
mumkin hai delete-phir-set se ek key ko end par le jaakar, aur sabse purani dhoondhne
ko map.keys().next().value se. Wo idiomatic aur ek interview mein theek hai AGAR aap
batate ho ye kyun kaam karta hai. Java ka LinkedHashMap accessOrder=true ke saath
wahi shortcut hai. Interviewers aksar phir bhi map + list version chahte hain,
kyunki wahi dikhaata hai ki aap samajhte ho har aadha KYUN chahiye.
\`\`\``,

    examples: [
      {
        title: 'Broken: array-backed LRU is O(n) per operation',
        titleHi: 'Toota: array-backed LRU prati operation O(n) hai',
        code: `const i = this.items.findIndex(e => e.key === key);   // O(n) scan
this.items.splice(i, 1);                              // O(n) shift
this.items.unshift(entry);                            // O(n) shift`,
        codeJs: `class LRUCacheArray {
  constructor(cap) { this.cap = cap; this.items = []; }
  get(key) {
    const i = this.items.findIndex(e => e.key === key);
    if (i === -1) return -1;
    const [entry] = this.items.splice(i, 1);
    this.items.unshift(entry);
    return entry.value;
  }
}
// correct results, but a 10,000-entry cache does ~10,000 steps per get`,
        codeTs: `class LRUCacheArray {
  private items: { key: number; value: number }[] = [];
  constructor(private cap: number) {}
  get(key: number): number {
    const i = this.items.findIndex(e => e.key === key);
    if (i === -1) return -1;
    const [entry] = this.items.splice(i, 1);
    this.items.unshift(entry!);
    return entry!.value;
  }
}`,
        output: `// correct, but O(n) per get and per put`,
        explain: 'findIndex scans, splice shifts everything after the removed slot, and unshift shifts everything again. Three linear passes on a structure whose entire purpose is constant-time access.',
        explainHi: 'findIndex scan karta hai, splice hataye slot ke baad sab shift karta hai, aur unshift phir sab shift karta hai. Ek aisi structure par teen linear passes jiska poora uddeshya constant-time access hai.',
      },
      {
        title: 'Fixed: map for lookup, doubly linked list for order',
        titleHi: 'Theek: lookup ke liye map, order ke liye doubly linked list',
        code: `const node = this.map.get(key);   // O(1) "where"
this._unlink(node);               // O(1) — node knows prev AND next
this._pushFront(node);            // O(1) "now most recent"`,
        codeJs: `get(key) {
  const node = this.map.get(key);
  if (node === undefined) return -1;
  this._unlink(node);
  this._pushFront(node);
  return node.value;
}
_unlink(node) {
  node.prev.next = node.next;     // two assignments, no branches (sentinels)
  node.next.prev = node.prev;
}
// cache of capacity 2:
// put(1,1) put(2,2) get(1)->1  put(3,3) evicts key 2  get(2)->-1`,
        codeTs: `get(key: number): number {
  const node = this.map.get(key);
  if (node === undefined) return -1;
  this.unlink(node);
  this.pushFront(node);
  return node.value;
}`,
        outputJs: `1
-1`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The map removes the search; the doubly linked list removes the shifting. Because each node stores its own prev (Module 4 lesson 2), unlinking is two pointer writes with no traversal.',
        explainHi: 'Map search hataata hai; doubly linked list shifting hataati hai. Kyunki har node apna prev store karta hai (Module 4 lesson 2), unlink karna bina traversal ke do pointer writes hai.',
      },
      {
        title: 'Min-stack: a parallel stack of running minima',
        titleHi: 'Min-stack: running minima ka ek parallel stack',
        code: `this.mins.push(Math.min(x, this.mins[this.mins.length - 1] ?? x));
// mins[i] is the minimum of everything at or below depth i`,
        codeJs: `class MinStack {
  constructor() { this.stack = []; this.mins = []; }
  push(x) {
    this.stack.push(x);
    this.mins.push(this.mins.length === 0 ? x : Math.min(x, this.mins[this.mins.length - 1]));
  }
  pop() { this.mins.pop(); return this.stack.pop(); }
  getMin() { return this.mins[this.mins.length - 1]; }
}
const s = new MinStack();
s.push(5); s.push(2); s.push(7);
console.log(s.getMin()); // 2
s.pop(); s.pop();
console.log(s.getMin()); // 5`,
        codeTs: `class MinStack {
  private stack: number[] = [];
  private mins: number[] = [];
  push(x: number): void {
    this.stack.push(x);
    this.mins.push(this.mins.length === 0 ? x : Math.min(x, this.mins[this.mins.length - 1]!));
  }
  pop(): number | undefined { this.mins.pop(); return this.stack.pop(); }
  getMin(): number | undefined { return this.mins[this.mins.length - 1]; }
}`,
        outputJs: `2
5`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'A single stack cannot report its minimum in O(1). Pushing a parallel "minimum so far at this depth" value makes getMin a peek, and popping both stacks together keeps them aligned.',
        explainHi: 'Ek akela stack apna minimum O(1) mein report nahi kar sakta. Ek parallel "is depth par ab tak minimum" value push karna getMin ko ek peek banaata hai, aur dono stacks saath pop karna unhe aligned rakhta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// Node stores only the value, not the key
class Node { constructor(value) { this.value = value; this.prev = this.next = null; } }
// eviction: you have the victim node but cannot delete it from the map`,
        right: `class Node { constructor(key, value) { this.key = key; this.value = value; ... } }
const lru = this.tail.prev;
this.map.delete(lru.key);      // now possible in O(1)`,
        why: 'Eviction is discovered from the list side (tail.prev) but must remove the entry from the map, which is keyed by the cache key. Without the key on the node you would have to scan the map to find it — O(n).',
        whyHi: 'Eviction list side (tail.prev) se pata chalti hai par entry ko map se hataana chahiye, jo cache key se keyed hai. Node par key ke bina aapko ise dhoondhne ko map scan karna padta — O(n).',
      },
      {
        wrong: `// updating one structure and forgetting the other
put(key, value) {
  this._pushFront(new Node(key, value));   // added to the list
  // forgot: this.map.set(key, node)  -> get() will never find it`,
        right: `const node = new Node(key, value);
this.map.set(key, node);       // BOTH structures, always
this._pushFront(node);`,
        why: 'When a design keeps two structures in sync, every mutation must touch both. Updating only one leaves them describing different contents, and the bug surfaces later as a phantom miss or a leaked entry.',
        whyHi: 'Jab ek design do structures ko sync mein rakhta hai, har mutation ko dono chhoona chahiye. Sirf ek update karna unhe alag contents describe karta chhodta hai, aur bug baad mein ek phantom miss ya ek leaked entry ki tarah saamne aata hai.',
      },
      {
        wrong: `// RandomisedSet remove: moving the last element but not fixing its index
this.items[i] = last;
this.items.pop();
this.pos.delete(v);            // pos still says 'last' is at the OLD index`,
        right: `this.items[i] = last;
this.pos.set(last, i);         // repair the moved element's recorded index
this.items.pop();
this.pos.delete(v);`,
        why: 'The invariant is "pos.get(x) is x\'s current index in items". Moving an element without updating its recorded index breaks that invariant, and the next remove of that element will overwrite the wrong slot.',
        whyHi: 'Invariant hai "pos.get(x) items mein x ka current index hai". Ek element ko iska recorded index update kiye bina move karna wo invariant todta hai, aur us element ka agla remove galat slot overwrite karega.',
      },
    ],

    realWorld: [
      {
        en: '**Every CPU cache, database buffer pool, and CDN edge node runs an LRU (or an LRU approximation)** to decide what to keep in fast memory and what to drop.',
        hi: '**Har CPU cache, database buffer pool, aur CDN edge node ek LRU (ya ek LRU approximation) chalata hai** ye tay karne ke liye ki fast memory mein kya rakhna hai aur kya chhodna hai.',
      },
      {
        en: '**Browser back/forward history and editor undo stacks** are doubly linked lists for exactly this reason: you move around and remove from the middle without shifting anything.',
        hi: '**Browser back/forward history aur editor undo stacks** bilkul isi wajah se doubly linked lists hain: aap around move karte ho aur beech se hataate ho bina kuch shift kiye.',
      },
      {
        en: '**"Design X" is a whole interview category** — LRU cache, rate limiter, tweet timeline, autocomplete — and the answer is nearly always "combine two structures so each covers the other\'s slow operation".',
        hi: '**"Design X" ek poori interview category hai** — LRU cache, rate limiter, tweet timeline, autocomplete — aur jawaab lagbhag hamesha "do structures combine karo taaki har ek doosre ka slow operation cover kare" hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Design an LRU cache with O(1) get and put. Explain why one structure is not enough.',
        qHi: 'O(1) get aur put ke saath ek LRU cache design karo. Samjhaao ek structure kyun kaafi nahi.',
        a: 'The cache must support three things in constant time: find a value by its key, mark an entry as most recently used, and evict the least recently used entry when over capacity. No single common structure does all three. A hash map finds by key in constant time, but a hash map has no notion of ordering, so to find the least recently used entry you would have to examine every entry and compare timestamps, which is linear. An array or list kept in recency order makes eviction trivial, since the victim is at one end, but finding a key requires a linear scan, and moving a found entry to the front of an array shifts every element between, which is also linear. So I keep both and let each cover the other\'s weakness. The hash map maps each key to a node, and those nodes are the elements of a doubly linked list ordered from most recently used at the front to least recently used at the back. A get looks the key up in the map, which is constant, then unlinks that node from its current position and splices it in at the front. The unlink is constant precisely because the list is doubly linked: the node already holds pointers to both of its neighbours, so removing it is two pointer assignments and needs no traversal to find the predecessor. A put either updates an existing node and moves it to the front, or creates a new node, records it in the map, and pushes it to the front; if the size then exceeds capacity, the victim is the node at the back, which is reached in constant time from the tail. One detail matters: each node stores its own key as well as its value, because eviction identifies the victim from the list side but must then delete it from the map, and the map is keyed by the cache key. I would also use two permanent sentinel nodes for the head and tail so that every real node always has non-null neighbours and the link surgery has no special cases.',
        aHi: 'Cache ko constant time mein teen cheezein support karni chahiye: ek value ko iski key se dhoondho, ek entry ko sabse haaliya istemal mark karo, aur capacity se zyaada hone par sabse kam haaliya istemal entry evict karo. Koi akela aam structure teeno nahi karta. Ek hash map key se constant time mein dhoondhta hai, par ek hash map mein ordering ki koi dhaarna nahi, isliye sabse kam haaliya istemal entry dhoondhne ke liye aapko har entry examine karke timestamps compare karne padte, jo linear hai. Recency order mein rakha ek array ya list eviction trivial banaata hai, kyunki victim ek chhor par hai, par ek key dhoondhna ek linear scan chahta hai, aur ek mili entry ko array ke saamne move karna beech ka har element shift karta hai, jo bhi linear hai. Toh main dono rakhta hoon aur har ek ko doosre ki kamzori cover karne deta hoon. Hash map har key ko ek node par map karta hai, aur wo nodes ek doubly linked list ke elements hain jo saamne sabse haaliya istemal se peechhe sabse kam haaliya istemal tak ordered hai. Ek get key ko map mein dekhta hai, jo constant hai, phir us node ko iski current position se unlink karta hai aur ise saamne splice karta hai. Unlink constant hai bilkul isliye kyunki list doubly linked hai: node pehle se apne dono neighbours ke pointers rakhta hai, isliye ise hataana do pointer assignments hai. Ek put ya toh ek maujooda node update karta hai aur ise saamne le jaata hai, ya ek naya node banaata hai, ise map mein record karta hai, aur ise saamne push karta hai; agar size phir capacity se zyaada hai, victim peechhe ka node hai. Ek detail maayne rakhti hai: har node apni key bhi store karta hai, kyunki eviction victim ko list side se pehchaanti hai par phir use map se delete karna chahiye.',
      },
      {
        q: 'What is the general method for "design a data structure with these operations in this complexity" questions?',
        qHi: '"In operations ke saath is complexity mein ek data structure design karo" sawaalon ke liye general method kya hai?',
        a: 'I work from the required operations backwards to the structures. The first step is to write down every operation the problem asks for together with the complexity it demands, because that list is the entire specification and it is common for one requirement to be the whole difficulty. The second step is to go through the list one operation at a time and name the structure that already provides that operation at that cost: lookup by key in constant time is a hash map, ordered insertion and removal from anywhere in constant time is a doubly linked list, repeated minimum or maximum in logarithmic time is a heap, random access by index in constant time is an array, prefix or range aggregates are prefix sums or a Fenwick tree, and prefix matching is a trie. Usually no single structure covers the whole list, and that is the signal that the answer is a combination. The third step is to decide how the structures reference each other. Almost always the hash map is the entry point and its value is a handle into the second structure, a node pointer or an array index. The fourth step, which is where most implementations go wrong, is to check that you can navigate the connection in both directions: given a key you must reach the element, and given an element you must reach its key, because some operations are discovered from the second structure and then have to update the map. That is why the LRU node stores its key and why the randomised set stores an index in its map. The final step is a discipline rather than a design choice: every mutation must update every structure, in the same operation, or they drift apart and the bug appears much later as a phantom hit or a leak. I usually write the invariant down explicitly, something like "the map holds exactly the keys in the list, and each maps to the node containing it", and then check each method preserves it.',
        aHi: 'Main zaroori operations se peechhe structures tak kaam karta hoon. Pehla step har operation likhna hai jo problem maangti hai us complexity ke saath jo ye demand karti hai, kyunki wo list poori specification hai aur ye aam hai ki ek requirement poori mushkil ho. Doosra step list ke through ek baar mein ek operation jaana aur us structure ka naam dena hai jo pehle se wo operation us cost par deta hai: constant time mein key se lookup ek hash map hai, constant time mein kahin se bhi ordered insertion aur removal ek doubly linked list hai, logarithmic time mein baar-baar minimum ya maximum ek heap hai, constant time mein index se random access ek array hai, prefix ya range aggregates prefix sums ya ek Fenwick tree hain, aur prefix matching ek trie hai. Aksar koi akela structure poori list cover nahi karta, aur wo signal hai ki jawaab ek combination hai. Teesra step tay karna hai ki structures ek doosre ko kaise reference karte hain. Lagbhag hamesha hash map entry point hai aur iski value doosre structure mein ek handle hai, ek node pointer ya ek array index. Chautha step, jahaan adhikaansh implementations galat jaate hain, ye check karna hai ki aap connection ko dono directions mein navigate kar sakte ho: ek key diye gaye aapko element tak pahunchna chahiye, aur ek element diye gaye aapko iski key tak. Antim step ek design choice ke bajaye ek discipline hai: har mutation ko har structure update karna chahiye, usi operation mein, warna wo alag ho jaate hain aur bug kaafi baad mein ek phantom hit ya ek leak ki tarah dikhta hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement the full LRUCache (map + doubly linked list with head/tail sentinels). Test the standard sequence: capacity 2, put(1,1), put(2,2), get(1)->1, put(3,3) (evicts 2), get(2)->-1, put(4,4) (evicts 1), get(1)->-1, get(3)->3, get(4)->4.',
        taskHi: 'Poora LRUCache implement karo (head/tail sentinels ke saath map + doubly linked list). Standard sequence test karo: capacity 2, put(1,1), put(2,2), get(1)->1, put(3,3) (2 evict), get(2)->-1, put(4,4) (1 evict), get(1)->-1, get(3)->3, get(4)->4.',
        hint: 'Add a debug method that walks head.next to tail printing keys — after get(1) the order should be 1, 2 (most recent first). Watching that order is how you catch a broken _pushFront.',
        hintHi: 'Ek debug method jodo jo head.next se tail tak keys print karte hue chale — get(1) ke baad order 1, 2 hona chahiye (sabse haaliya pehle). Us order ko dekhna hi ek toote _pushFront ko pakadne ka tarika hai.',
      },
      {
        task: 'Deliberately remove the key from the Node class and try to implement eviction. Note exactly which line becomes impossible in O(1), then restore it. Separately, remove the sentinels and count how many null checks _unlink and _pushFront now need.',
        taskHi: 'Jaan-boojhkar Node class se key hatao aur eviction implement karne ki koshish karo. Note karo bilkul kaunsi line O(1) mein asambhav ho jaati hai, phir ise restore karo. Alag se, sentinels hatao aur gino _unlink aur _pushFront ko ab kitne null checks chahiye.',
        hint: 'Without node.key you must scan map entries comparing values to the node — O(n). Without sentinels you need to handle node-is-head, node-is-tail, and list-becomes-empty in both helpers.',
        hintHi: 'node.key ke bina aapko map entries scan karke values ko node se compare karna hoga — O(n). Sentinels ke bina aapko dono helpers mein node-is-head, node-is-tail, aur list-khaali-ho-jaati handle karni hogi.',
      },
      {
        task: 'Implement MinStack and RandomisedSet. For RandomisedSet, write a test that inserts 1..5, removes 3, and then calls getRandom 10,000 times, confirming the distribution covers exactly the four remaining values.',
        taskHi: 'MinStack aur RandomisedSet implement karo. RandomisedSet ke liye, ek test likho jo 1..5 insert kare, 3 remove kare, aur phir getRandom 10,000 baar call kare, confirm karte hue ki distribution bilkul chaar bache values cover karta hai.',
        hint: 'If you forget pos.set(last, i) in remove, a later remove of that moved element will corrupt items. The 10,000-sample test surfaces it as a value that should be gone still appearing.',
        hintHi: 'Agar aap remove mein pos.set(last, i) bhool jaate ho, us move hue element ka ek baad ka remove items ko corrupt karega. 10,000-sample test ise ek aisi value ki tarah saamne laata hai jo jaani chahiye thi par abhi bhi dikh rahi hai.',
      },
    ],

    keyTakeaways: [
      'When no single structure meets every required complexity, COMBINE two so each covers the other\'s slow operation — that is the whole "design a data structure" category.',
      'LRU cache = hash map (key -> node, O(1) "where") + doubly linked list (recency order, O(1) "move to front" and "evict from back"). Neither half is sufficient alone.',
      'The doubly linked list is what makes unlinking O(1): a node already holds its own prev, so removing it is two pointer writes with no traversal (Module 4 lesson 2).',
      'Each node must store its KEY as well as its value — eviction finds the victim from the list side but must delete it from the map, which is keyed by the key.',
      'Use two permanent head/tail sentinel nodes: every real node then has non-null neighbours, so unlink and push-front are branch-free and the empty list needs no special case.',
      'The method: list the operations and required costs, name a structure per operation, connect them (usually map value = handle into the other), verify BOTH navigation directions, and update EVERY structure on EVERY mutation.',
    ],
    keyTakeawaysHi: [
      'Jab koi akela structure har zaroori complexity poori nahi karta, DO COMBINE karo taaki har ek doosre ka slow operation cover kare — wo poori "ek data structure design karo" category hai.',
      'LRU cache = hash map (key -> node, O(1) "kahaan") + doubly linked list (recency order, O(1) "saamne le jao" aur "peechhe se evict karo"). Koi bhi aadha akela kaafi nahi.',
      'Doubly linked list wo hai jo unlink ko O(1) banaati hai: ek node pehle se apna prev rakhta hai, isliye ise hataana bina traversal ke do pointer writes hai (Module 4 lesson 2).',
      'Har node ko apni KEY bhi store karni chahiye value ke saath — eviction victim ko list side se dhoondhti hai par use map se delete karna chahiye, jo key se keyed hai.',
      'Do sthaayi head/tail sentinel nodes istemal karo: phir har asli node ke non-null neighbours hain, isliye unlink aur push-front branch-free hain aur khaali list ko koi special case nahi chahiye.',
      'Method: operations aur zaroori costs list karo, prati operation ek structure ka naam do, unhe connect karo (aksar map value = doosre mein ek handle), DONO navigation directions verify karo, aur HAR mutation par HAR structure update karo.',
    ],
  },
];
