/**
 * Python Complete Course — Module 2: Collections & Iteration, lessons 4-6.
 *
 * Lesson 4: sets & frozenset — `{1, 2, 3}` vs `set()` (`{}` is a DICT), O(1)
 *           membership, `| & - ^`, dedup, set comprehensions, when to use.
 *           Broken: `{}` for an empty set, expecting order/indexing.
 * Lesson 5: comprehensions — list/dict/set/generator, the `if` filter, the
 *           `x if c else y` expression form, nesting, when a comprehension is
 *           too clever, generator expression for laziness. Broken: a
 *           comprehension run for its side effects; unreadable nesting.
 * Lesson 6: the iteration protocol & the built-ins — `iter()`/`next()`, what
 *           "iterable" means, `for` desugared, `sum`/`min`/`max`/`any`/`all`/
 *           `sorted`, `map`/`filter` vs comprehensions, unpacking in calls.
 *
 * NOTE for future editors: `examples` use `code` + `output` (Python). EVERY
 * backtick inside `simple`/`simpleHi`/`content`/`contentHi` must be `\`` —
 * including inline-code spans inside the ``` ascii blocks. Run every sample
 * with `python`. Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_2_PART2: CourseLesson[] = [
  {
    slug: 'py-sets-and-frozenset',
    title: 'Sets: {} Is Not an Empty Set, Membership Is O(1), and Set Algebra',
    titleHi: 'Sets: {} Ek Empty Set Nahi Hai, Membership O(1) Hai, Aur Set Algebra',
    description: 'Writing `seen = {}` to make an empty set and getting an empty dict instead, because `{}` has always meant "dict" and the empty-set literal does not exist — you have to write `set()`. And checking membership against a list with `if x in big_list` inside a loop, an O(n) scan each time, when converting to a set once makes every check O(1).',
    descriptionHi: 'Ek empty set banane ke liye `seen = {}` likhna aur iske bajaye ek empty dict paana, kyunki `{}` ka matlab hamesha "dict" raha hai aur empty-set literal maujood nahi — aapko `set()` likhna hoga. Aur ek loop ke andar ek list ke against `if x in big_list` se membership check karna, har baar ek O(n) scan, jab ek baar ek set mein convert karna har check ko O(1) banaata hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 4,

    analogy: {
      en: '**A guest list you only ever ask yes/no questions of, versus a numbered seating chart.** A set is the guest list: its whole job is to answer "is this person invited?" instantly, and to guarantee nobody is on it twice. It does not know or care what order names were added, and there is no "seat 3" — you cannot ask for "the third guest" because the list has no positions. In exchange for giving up order and indexing, it answers membership in constant time no matter how many names are on it, because it files each name by a computed fingerprint rather than scanning down a column. A list is the seating chart: it keeps order, it has numbered positions, it allows duplicates — and to check whether a name is on it, someone has to read down the whole chart. So if your only question is "have I seen this before" or "is this one of the allowed values", and you ask it many times, you want the set. There is also a locked version of the guest list, a frozenset, which cannot have names added or removed after it is made — useful when the list of allowed values itself needs to be a key in some other lookup.',
      hi: '**Ek guest list jisse aap sirf haan/na sawaal poochhte ho, versus ek numbered seating chart.** Ek set guest list hai: iska poora kaam "kya ye vyakti invited hai?" ka turant jawaab dena hai, aur guarantee karna ki koi ismein do baar nahi hai. Ye nahi jaanta ya parwaah karta ki naam kis kram mein add hue, aur koi "seat 3" nahi hai — aap "teesra guest" nahi poochh sakte kyunki list ki koi positions nahi. Order aur indexing chhodne ke badle, ye membership ka constant time mein jawaab deta hai chahe ismein kitne bhi naam hon, kyunki ye har naam ko ek computed fingerprint se file karta hai ek column neeche scan karne ke bajaye. Ek list seating chart hai: ye order rakhti hai, iski numbered positions hain, ye duplicates allow karti hai — aur ye check karne ke liye ki ek naam ispar hai, kisi ko poora chart neeche padhna hoga. Toh agar aapka ekmatra sawaal "kya maine ise pehle dekha" ya "kya ye allowed values mein se ek hai" hai, aur aap ise kayi baar poochhte ho, aap set chahte ho.',
    },

    simple: `**Start broken.** \`{}\` for an empty set; membership scans against a list:

\`\`\`python
seen = {}
seen.add("x")            # AttributeError: 'dict' object has no attribute 'add'
\`\`\`

\`{}\` is an **empty dict**, always. There is no empty-set literal — you must write \`set()\`.

\`\`\`python
allowed = ["admin", "editor", "viewer", ... ]   # a long list
for action in requests:
    if action.role in allowed:       # O(n) scan of the list, every iteration
        handle(action)
\`\`\`

Every \`in\` check walks the list. For 1,000 requests against a 100-item list, that is 100,000 comparisons.

**The fix: \`set()\` for empty; convert to a set for repeated membership**

\`\`\`python
seen = set()             # the empty set
seen.add("x")
seen.add("x")            # already there -- no effect, no error
print("x" in seen)       # True     -- O(1)
print(len(seen))         # 1

roles = {"admin", "editor", "viewer"}   # a set literal (non-empty)
for action in requests:
    if action.role in roles:            # O(1) hash lookup, every time
        handle(action)

# dedup a list, preserving nothing about order:
unique = set([1, 2, 2, 3, 3, 3])        # {1, 2, 3}
unique = list(set(items))               # back to a list (order not preserved)
\`\`\`

\`\`\`
CREATE   set()            {1, 2, 3}       set([1,2,2,3]) -> {1,2,3}       set("abc") -> {'a','b','c'}
EMPTY    set()            -- NOT {} (that is a dict)
ADD      s.add(x)         one item      s.update(iterable)   many
REMOVE   s.discard(x)     no error if absent
         s.remove(x)      KeyError if absent
         s.pop()          remove & return an ARBITRARY element
CHECK    x in s           O(1)          -- no indexing: s[0] is a TypeError
ALGEBRA  a | b   union            a & b   intersection
         a - b   difference       a ^ b   symmetric difference (in one, not both)
         a <= b  subset           a >= b  superset       a.isdisjoint(b)
FROZEN   frozenset({1,2})  -- immutable, hashable, can be a dict key / set element
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Ek empty set ke liye \`{}\`; membership ek list ke against scan karta hai:

\`\`\`python
seen = {}
seen.add("x")            # AttributeError: 'dict' object has no attribute 'add'
\`\`\`

\`{}\` ek **empty dict** hai, hamesha. Koi empty-set literal nahi — aapko \`set()\` likhna hoga.

\`\`\`python
allowed = ["admin", "editor", "viewer", ... ]   # ek lambi list
for action in requests:
    if action.role in allowed:       # har iteration list ka O(n) scan
        handle(action)
\`\`\`

Har \`in\` check list walk karta hai. 100-item list ke against 1,000 requests ke liye, wo 100,000 comparisons hai.

**Fix: empty ke liye \`set()\`; baar-baar membership ke liye ek set mein convert karo**

\`\`\`python
seen = set()             # empty set
seen.add("x")
seen.add("x")            # pehle se hai -- koi effect nahi, koi error nahi
print("x" in seen)       # True     -- O(1)
print(len(seen))         # 1

roles = {"admin", "editor", "viewer"}   # ek set literal (non-empty)
for action in requests:
    if action.role in roles:            # O(1) hash lookup, har baar
        handle(action)

# ek list dedup karo, order ke baare mein kuch preserve kiye bina:
unique = set([1, 2, 2, 3, 3, 3])        # {1, 2, 3}
unique = list(set(items))               # wapas ek list (order preserve nahi)
\`\`\`

\`\`\`
CREATE   set()            {1, 2, 3}       set([1,2,2,3]) -> {1,2,3}       set("abc") -> {'a','b','c'}
EMPTY    set()            -- {} NAHI (wo ek dict hai)
ADD      s.add(x)         ek item       s.update(iterable)   kayi
REMOVE   s.discard(x)     absent hone par koi error nahi
         s.remove(x)      absent hone par KeyError
         s.pop()          ek ARBITRARY element remove aur return
CHECK    x in s           O(1)          -- koi indexing nahi: s[0] ek TypeError hai
ALGEBRA  a | b   union            a & b   intersection
         a - b   difference       a ^ b   symmetric difference (ek mein, dono mein nahi)
         a <= b  subset           a >= b  superset       a.isdisjoint(b)
FROZEN   frozenset({1,2})  -- immutable, hashable, ek dict key / set element ho sakta hai
\`\`\``,

    content: `## When a set is the right structure

\`\`\`
Use a SET when:
  - you ask "is x in here?" repeatedly (membership is O(1) vs O(n) for a list)
  - you need to remove duplicates
  - you are doing set math: "items in A but not B", "items in both", "any overlap?"
  - order genuinely does not matter and you never index

Do NOT use a set when:
  - you need order (use a list, or dict.fromkeys(items) to dedup AND keep order)
  - you need duplicates
  - you need positional access (s[2])
  - elements are not hashable (a set of lists is impossible -> use a set of tuples)
\`\`\`

## Set algebra with real examples

\`\`\`python
current_perms = {"read", "write", "delete"}
requested     = {"read", "write", "admin"}

requested - current_perms         # {'admin'}   -- perms they want but don't have
current_perms & requested         # {'read', 'write'}   -- perms in common
current_perms | requested         # {'read', 'write', 'delete', 'admin'}   -- all
current_perms ^ requested         # {'delete', 'admin'}   -- in exactly one

requested <= current_perms        # False  -- requested is not a subset
{"read"} <= current_perms         # True
current_perms.isdisjoint({"x"})   # True   -- no overlap
\`\`\`

The method forms (\`a.union(b)\`, \`a.intersection(b)\`, \`a.difference(b)\`) accept any iterable, not just a set: \`perms.intersection(["read", "x"])\` works. The operators (\`|\`, \`&\`, \`-\`, \`^\`) require both sides to be sets.

## Dedup while keeping order

\`\`\`python
items = ["b", "a", "b", "c", "a"]

list(set(items))              # order LOST -- e.g. ['c', 'b', 'a']
list(dict.fromkeys(items))    # ['b', 'a', 'c']  -- dedup AND keep first-seen order
\`\`\`

\`dict.fromkeys\` builds a dict with those keys (values all \`None\`), and dicts keep insertion order, so \`list(...)\` of it is the deduplicated sequence in original order. This is the idiomatic ordered-dedup.

## \`frozenset\`: an immutable, hashable set

\`\`\`python
# a set of sets is impossible (sets are mutable, unhashable):
groups = {{1, 2}, {3, 4}}     # TypeError: unhashable type: 'set'

# a set of frozensets works:
groups = {frozenset({1, 2}), frozenset({3, 4})}

# frozenset as a dict key -- e.g. caching by a set of feature flags:
cache = {}
cache[frozenset({"beta", "dark_mode"})] = compute(...)
\`\`\`

## Set comprehensions

\`\`\`python
{x * x for x in range(10)}                 # {0, 1, 4, 9, 16, 25, 36, 49, 64, 81}
{word.lower() for word in text.split()}    # unique lowercased words
{len(line) for line in lines if line}      # distinct non-empty line lengths
\`\`\`

## The subtle gotchas

\`\`\`python
{1, 2, 3} == {3, 2, 1}       # True  -- order does not matter for equality
{1, True}                     # {1}   -- 1 == True and they hash the same!
{1.0, 1}                      # {1.0} -- same, 1.0 == 1
s = {1, 2, 3}
s[0]                          # TypeError: 'set' object is not subscriptable
next(iter(s))                 # get SOME element (iteration order is not defined)
\`\`\``,

    contentHi: `## Jab ek set sahi structure hai

\`\`\`
SET istemal karo jab:
  - aap "kya x yahaan hai?" baar-baar poochhte ho (membership O(1) vs list ke liye O(n))
  - aapko duplicates hataane hain
  - aap set math kar rahe ho: "A mein par B mein nahi items", "dono mein items", "koi overlap?"
  - order sachmuch maayne nahi rakhta aur aap kabhi index nahi karte

SET istemal MAT karo jab:
  - aapko order chahiye (ek list istemal karo, ya dedup AND order rakhne ko dict.fromkeys(items))
  - aapko duplicates chahiye
  - aapko positional access chahiye (s[2])
  - elements hashable nahi hain (lists ka ek set namumkin -> tuples ka ek set istemal karo)
\`\`\`

## Asli udaharanon ke saath set algebra

\`\`\`python
current_perms = {"read", "write", "delete"}
requested     = {"read", "write", "admin"}

requested - current_perms         # {'admin'}   -- perms jo wo chahte hain par nahi hain
current_perms & requested         # {'read', 'write'}   -- common perms
current_perms | requested         # {'read', 'write', 'delete', 'admin'}   -- sab
current_perms ^ requested         # {'delete', 'admin'}   -- bilkul ek mein

requested <= current_perms        # False  -- requested ek subset nahi hai
{"read"} <= current_perms         # True
current_perms.isdisjoint({"x"})   # True   -- koi overlap nahi
\`\`\`

Method forms (\`a.union(b)\`, \`a.intersection(b)\`, \`a.difference(b)\`) koi bhi iterable accept karte hain, sirf ek set nahi: \`perms.intersection(["read", "x"])\` kaam karta hai. Operators (\`|\`, \`&\`, \`-\`, \`^\`) ko dono sides sets chahiye.

## Order rakhte hue dedup

\`\`\`python
items = ["b", "a", "b", "c", "a"]

list(set(items))              # order KHOYA -- e.g. ['c', 'b', 'a']
list(dict.fromkeys(items))    # ['b', 'a', 'c']  -- dedup AND first-seen order rakho
\`\`\`

\`dict.fromkeys\` un keys ke saath ek dict banaata hai (values sab \`None\`), aur dicts insertion order rakhte hain, isliye iska \`list(...)\` original order mein deduplicated sequence hai. Ye idiomatic ordered-dedup hai.

## \`frozenset\`: ek immutable, hashable set

\`\`\`python
# sets ka ek set namumkin hai (sets mutable, unhashable):
groups = {{1, 2}, {3, 4}}     # TypeError: unhashable type: 'set'

# frozensets ka ek set kaam karta hai:
groups = {frozenset({1, 2}), frozenset({3, 4})}

# frozenset ek dict key ki tarah -- e.g. feature flags ke ek set se caching:
cache = {}
cache[frozenset({"beta", "dark_mode"})] = compute(...)
\`\`\`

## Set comprehensions

\`\`\`python
{x * x for x in range(10)}                 # {0, 1, 4, 9, 16, 25, 36, 49, 64, 81}
{word.lower() for word in text.split()}    # unique lowercased words
{len(line) for line in lines if line}      # distinct non-empty line lengths
\`\`\`

## Sookshm gotchas

\`\`\`python
{1, 2, 3} == {3, 2, 1}       # True  -- equality ke liye order maayne nahi rakhta
{1, True}                     # {1}   -- 1 == True aur wo same hash karte hain!
{1.0, 1}                      # {1.0} -- wahi, 1.0 == 1
s = {1, 2, 3}
s[0]                          # TypeError: 'set' object is not subscriptable
next(iter(s))                 # KOI ek element lo (iteration order defined nahi hai)
\`\`\``,

    examples: [
      {
        title: 'Broken: {} is a dict; list membership in a loop',
        titleHi: 'Toota: {} ek dict hai; ek loop mein list membership',
        code: `seen = {}
print(type(seen))

blocked = ["1.2.3.4", "5.6.7.8", "9.9.9.9"]
requests = ["1.1.1.1", "1.2.3.4", "8.8.8.8", "5.6.7.8"]

for ip in requests:
    if ip in blocked:            # scans the list each time
        print(f"blocked: {ip}")`,
        output: `<class 'dict'>
blocked: 1.2.3.4
blocked: 5.6.7.8`,
        explain: '`seen = {}` makes a dict, not a set — `seen.add(...)` would then raise `AttributeError`. The membership check works but `ip in blocked` is an O(n) scan of the list for every request. With a large blocklist and many requests this becomes a bottleneck.',
        explainHi: '`seen = {}` ek dict banaata hai, ek set nahi — `seen.add(...)` phir `AttributeError` deta. Membership check kaam karta hai par `ip in blocked` har request ke liye list ka ek O(n) scan hai. Ek bade blocklist aur kayi requests ke saath ye ek bottleneck ban jaata hai.',
      },
      {
        title: 'Fixed: set() for empty, set for membership, set algebra',
        titleHi: 'Theek: empty ke liye set(), membership ke liye set, set algebra',
        code: `seen = set()
seen.add("a")
seen.add("a")
print(seen, len(seen))

blocked = {"1.2.3.4", "5.6.7.8", "9.9.9.9"}
requests = ["1.1.1.1", "1.2.3.4", "8.8.8.8", "5.6.7.8"]
hits = [ip for ip in requests if ip in blocked]
print("blocked hits:", hits)

have = {"read", "write", "delete"}
want = {"read", "write", "admin"}
print("missing:", sorted(want - have))
print("common:", sorted(have & want))
print("either-only:", sorted(have ^ want))

items = ["b", "a", "b", "c", "a"]
print("dedup any order:", sorted(set(items)))
print("dedup keep order:", list(dict.fromkeys(items)))`,
        output: `{'a'} 1
blocked hits: ['1.2.3.4', '5.6.7.8']
missing: ['admin']
common: ['read', 'write']
either-only: ['admin', 'delete']
dedup any order: ['a', 'b', 'c']
dedup keep order: ['b', 'a', 'c']`,
        explain: '`set()` is the empty set; `.add` on a duplicate is a silent no-op. `ip in blocked` is now O(1). `want - have` gives permissions not yet granted; `have & want` the overlap; `have ^ want` the ones in exactly one side. The results are wrapped in `sorted()` here only for a stable printout — a set itself has no order. `dict.fromkeys` dedups while keeping first-seen order.',
        explainHi: '`set()` empty set hai; ek duplicate par `.add` ek silent no-op hai. `ip in blocked` ab O(1) hai. `want - have` abhi tak na di gayi permissions deta hai; `have & want` overlap; `have ^ want` bilkul ek side ki wali. `dict.fromkeys` first-seen order rakhte hue dedup karta hai.',
      },
      {
        title: 'frozenset as a key; the True/1 collision',
        titleHi: 'frozenset ek key ki tarah; True/1 collision',
        code: `# frozenset can be a dict key
config_cache = {}
flags = frozenset({"beta", "verbose"})
config_cache[flags] = {"level": "high"}
print(config_cache[frozenset({"verbose", "beta"})])   # order-independent lookup

# equal-and-same-hash values collapse in a set
print(len({1, True, 1.0}), list({1, True, 1.0}))   # 1 [1]
print(len({0, False}))                              # 1
print(sorted({"a", "a", "b"}))                      # ['a', 'b']

# a set of tuples (hashable) vs a set of lists (not)
coords = {(0, 0), (1, 2), (0, 0)}
print(sorted(coords))
try:
    bad = {[1, 2]}
except TypeError as e:
    print("error:", "unhashable" in str(e))`,
        output: `{'level': 'high'}
1 [1]
1
['a', 'b']
[(0, 0), (1, 2)]
error: True`,
        explain: 'A `frozenset` is hashable, so it works as a dict key and the lookup is order-independent. `1 == True == 1.0` and they hash identically, so `{1, True, 1.0}` collapses to one element (`len` is 1). Tuples are hashable so a set of coordinates works; lists are not, so `{[1, 2]}` raises `TypeError: unhashable type: \'list\'`.',
        explainHi: 'Ek `frozenset` hashable hai, isliye ye ek dict key ki tarah kaam karta hai aur lookup order-independent hai. `1 == True == 1.0` aur wo samaan hash karte hain, isliye `{1, True, 1.0}` ek element mein collapse hota hai. Tuples hashable hain isliye coordinates ka ek set kaam karta hai; lists nahi, isliye `{[1, 2]}` error deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `unique_tags = {}
for post in posts:
    unique_tags.add(post.tag)   # AttributeError: dict has no .add`,
        right: `unique_tags = set()
for post in posts:
    unique_tags.add(post.tag)
# or:  unique_tags = {post.tag for post in posts}`,
        why: '`{}` is the empty dict literal; there is no empty-set literal in Python. Write `set()` for an empty set, or use a set comprehension `{expr for ...}` which is unambiguous because it has content.',
        whyHi: '`{}` empty dict literal hai; Python mein koi empty-set literal nahi. Ek empty set ke liye `set()` likho, ya ek set comprehension `{expr for ...}` istemal karo jo ambiguous nahi hai kyunki iska content hai.',
      },
      {
        wrong: `ordered_unique = list(set(items))   # expecting original order preserved`,
        right: `ordered_unique = list(dict.fromkeys(items))`,
        why: 'A set has no order, so `list(set(items))` gives you the unique elements in an arbitrary (hash-dependent) order. If you need "unique, in first-seen order", use `dict.fromkeys(items)` — dicts preserve insertion order and drop duplicate keys.',
        whyHi: 'Ek set ka koi order nahi, isliye `list(set(items))` aapko unique elements ek arbitrary (hash-dependent) order mein deta hai. Agar aapko "unique, first-seen order mein" chahiye, `dict.fromkeys(items)` istemal karo — dicts insertion order preserve karte hain aur duplicate keys drop karte hain.',
      },
      {
        wrong: `first_three = my_set[:3]        # TypeError: 'set' object is not subscriptable`,
        right: `first_three = sorted(my_set)[:3]   # or list(my_set)[:3] if any 3 will do`,
        why: 'Sets have no positions — no indexing, no slicing, no `[0]`. If you need an ordered subset, sort the set into a list first (`sorted(s)`), or if any elements will do, materialise with `list(s)` and slice that. A set is for membership, not ordered access.',
        whyHi: 'Sets ki koi positions nahi — koi indexing, koi slicing, koi `[0]`. Agar aapko ek ordered subset chahiye, pehle set ko ek list mein sort karo (`sorted(s)`), ya agar koi bhi elements chalenge, `list(s)` se materialise karo aur use slice karo. Ek set membership ke liye hai, ordered access ke liye nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Permission and role checks in Django/DRF** are set operations — `required_perms - user.get_all_permissions()` gives the missing permissions, `set(request.data.keys()) - allowed_fields` flags unexpected input fields.',
        hi: '**Django/DRF mein permission aur role checks** set operations hain — `required_perms - user.get_all_permissions()` missing permissions deta hai, `set(request.data.keys()) - allowed_fields` anpekshit input fields flag karta hai.',
      },
      {
        en: '**Deduplicating IDs before a bulk query** — `Model.objects.filter(id__in=set(ids))` — avoids sending the same ID twice and lets the DB use the index efficiently. Building a set of "already processed" IDs is the standard idempotency guard in a task.',
        hi: '**Ek bulk query se pehle IDs deduplicate karna** — `Model.objects.filter(id__in=set(ids))` — wahi ID do baar bhejne se bachta hai aur DB ko index efficiently istemal karne deta hai. Ek task mein "already processed" IDs ka ek set banaana standard idempotency guard hai.',
      },
      {
        en: '**Diffing two states** — which files changed, which config keys were added/removed, which rows are new — is `set(new) - set(old)`, `set(old) - set(new)`, `set(new) & set(old)`. Django migrations and sync jobs are full of this.',
        hi: '**Do states diff karna** — kaunse files badle, kaunse config keys add/remove hue, kaunse rows naye hain — `set(new) - set(old)`, `set(old) - set(new)`, `set(new) & set(old)` hai. Django migrations aur sync jobs isse bhare hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is `x in a_set` faster than `x in a_list`, and what do you give up by using a set?',
        qHi: '`x in a_set` `x in a_list` se tez kyun hai, aur ek set istemal karke aap kya chhodte ho?',
        a: 'A list stores its elements in order, one after another, so the only way to check whether a value is present is to compare against each element until you find a match or reach the end. On average that is half the list, and in the worst case the whole list, so membership is linear in the list length. A set is a hash table. When you add an element, Python computes a hash of it — a fixed-size integer fingerprint — and uses that to decide which bucket to store it in. When you check membership, it hashes the query value, jumps straight to the corresponding bucket, and compares against only the handful of elements there, if any. The number of comparisons does not grow with the size of the set, so membership is constant time on average. This is why any code that asks "is this in the collection" repeatedly, especially inside a loop, should be checking against a set rather than a list — converting the list to a set once is cheap and every subsequent check goes from linear to constant. What you give up is threefold. First, order: a set does not remember insertion order and iterating it yields elements in an unspecified, hash-dependent sequence, so if you need order you use a list, or a dict with the keys if you also want deduplication. Second, indexing: there are no positions in a set, so you cannot ask for the first element or a slice; a set is a membership structure, not a sequence. Third, duplicates: a set silently collapses equal elements, which is exactly what you want for deduplication but wrong if counts matter. There is also a hashability requirement on the elements themselves — they must be immutable, so you can have a set of numbers, strings, or tuples, but not a set of lists or dictionaries.',
        aHi: 'Ek list apne elements ko order mein store karti hai, ek ke baad ek, isliye ye check karne ka ekmatra tarika ki ek value maujood hai har element ke against compare karna hai jab tak aap ek match na paayein ya end tak na pahunchein. Average par wo aadhi list hai, aur worst case mein poori list, isliye membership list length mein linear hai. Ek set ek hash table hai. Jab aap ek element add karte ho, Python iska ek hash compute karta hai — ek fixed-size integer fingerprint — aur ise istemal karke tay karta hai kaunse bucket mein store karna hai. Jab aap membership check karte ho, ye query value ko hash karta hai, seedhe corresponding bucket par jaata hai, aur sirf wahaan ke kuch elements ke against compare karta hai. Comparisons ki tadaad set ke size ke saath nahi badhti, isliye membership average par constant time hai. Aap jo chhodte ho wo teen guna hai. Pehle, order: ek set insertion order yaad nahi rakhta. Doosre, indexing: ek set mein koi positions nahi. Teesre, duplicates: ek set chupchaap barabar elements ko collapse karta hai.',
      },
      {
        q: 'You have `old = {a, b, c}` and `new = {b, c, d}`. How do you compute added, removed, and unchanged?',
        qHi: 'Aapke paas `old = {a, b, c}` aur `new = {b, c, d}` hai. Aap added, removed, aur unchanged kaise compute karte ho?',
        a: 'This is the classic diff, and set difference and intersection give you all three answers directly. The added items — present in the new state but not the old — are new minus old, which subtracts every element of old from new and leaves what is exclusive to new. In this example that is the single element d. The removed items — present in the old state but gone in the new — are the reverse subtraction, old minus new, which here is a. The unchanged items — present in both — are the intersection, old ampersand new, or equivalently new ampersand old since intersection is symmetric, which here is b and c. If you also want a single set of everything that differs in either direction, that is the symmetric difference, old caret new, which combines the added and removed and here is a and d. These operations are the backbone of any synchronisation logic: reconciling a local cache against a server response, figuring out which database rows to insert versus delete versus leave alone, diffing two configuration files, or determining which permissions to grant and revoke when a user\'s role changes. The pattern generalises: if the elements are richer than bare identifiers — say dictionaries with an id and other fields — you first build sets of just the ids to compute which ids were added and removed, then look up the full records for those ids, and for the ids present in both you compare the records field by field to detect updates. The set math tells you the shape of the change; you then act on each category.',
        aHi: 'Ye classic diff hai, aur set difference aur intersection aapko teenon jawaab seedhe dete hain. Added items — new state mein maujood par old mein nahi — new minus old hain, jo new se old ka har element ghataata hai aur wo chhodta hai jo new ke liye exclusive hai. Is udaharan mein wo akela element d hai. Removed items — old state mein maujood par new mein gaya — ulta subtraction hai, old minus new, jo yahaan a hai. Unchanged items — dono mein maujood — intersection hai, old ampersand new, jo yahaan b aur c hai. Agar aap kisi bhi disha mein alag sab kuch ka ek akela set bhi chahte ho, wo symmetric difference hai, old caret new. Ye operations kisi bhi synchronisation logic ki reedh ki haddi hain: ek local cache ko ek server response ke against reconcile karna, ye pata lagaana ki kaunse database rows insert versus delete versus akela chhodna hai. Pattern generalise hota hai: agar elements bare identifiers se richer hain, aap pehle sirf ids ke sets banate ho, phir un ids ke poore records dekhte ho, aur dono mein maujood ids ke liye aap records ko field dar field compare karte ho.',
      },
    ],

    exercises: [
      {
        task: 'In the REPL: `type({})`, `type(set())`, `type({1})`, `type({1: 2})`. Then build an empty set and add three items, adding one of them twice; print the set and its length.',
        taskHi: 'REPL mein: `type({})`, `type(set())`, `type({1})`, `type({1: 2})`. Phir ek empty set banao aur teen items add karo, unmein se ek do baar; set aur iski length print karo.',
        hint: '`type({})` is `dict`, `type(set())` is `set`, `type({1})` is `set`, `type({1: 2})` is `dict`. Adding a duplicate to a set is a no-op — length stays 3.',
        hintHi: '`type({})` `dict` hai, `type(set())` `set` hai, `type({1})` `set` hai, `type({1: 2})` `dict` hai. Ek set mein ek duplicate add karna ek no-op hai — length 3 rehti hai.',
      },
      {
        task: 'Write `diff_keys(old, new)` where `old` and `new` are dicts. Return a dict `{"added": [...], "removed": [...], "changed": [...]}` where `changed` is keys present in both with different values. Use set operations on the keys.',
        taskHi: '`diff_keys(old, new)` likho jahaan `old` aur `new` dicts hain. Ek dict `{"added": [...], "removed": [...], "changed": [...]}` return karo jahaan `changed` dono mein maujood keys hain alag values ke saath. Keys par set operations istemal karo.',
        hint: '`ok, nk = set(old), set(new)`. `added = nk - ok`, `removed = ok - nk`, `common = ok & nk`, then `changed = [k for k in common if old[k] != new[k]]`.',
        hintHi: '`ok, nk = set(old), set(new)`. `added = nk - ok`, `removed = ok - nk`, `common = ok & nk`, phir `changed = [k for k in common if old[k] != new[k]]`.',
      },
      {
        task: 'Given `emails = ["a@x.com", "B@X.com", "a@x.com", "c@y.com"]`, produce the list of unique emails, case-insensitively, keeping the first-seen casing. (`"a@x.com"` and `"B@X.com"` are distinct; `"a@x.com"` twice is one.) Use `dict.fromkeys` on the lowercased key with the original as the value.',
        taskHi: '`emails = ["a@x.com", "B@X.com", "a@x.com", "c@y.com"]` diya, unique emails ki list banao, case-insensitively, first-seen casing rakhte hue. Lowercased key par `dict.fromkeys` ya ek manual dict istemal karo original ko value ki tarah.',
        hint: '`seen = {}; for e in emails: seen.setdefault(e.lower(), e)` then `list(seen.values())` -> `["a@x.com", "B@X.com", "c@y.com"]`. The lowercase key dedups; `setdefault` keeps the first original casing.',
        hintHi: '`seen = {}; for e in emails: seen.setdefault(e.lower(), e)` phir `list(seen.values())` -> `["a@x.com", "B@X.com", "c@y.com"]`. Lowercase key dedup karta hai; `setdefault` pehli original casing rakhta hai.',
      },
    ],

    keyTakeaways: [
      '`{}` is an empty DICT. The empty set is `set()` — there is no empty-set literal. `{1, 2}` and `{expr for ...}` are sets (they have content).',
      'Set membership (`x in s`) is O(1); list membership is O(n). Convert a list to a set once when you check membership repeatedly, especially in a loop.',
      'Sets have NO order and NO indexing — `s[0]` is a TypeError. Iteration order is unspecified. For an ordered subset, `sorted(s)` first.',
      'Set algebra: `a | b` union, `a & b` intersection, `a - b` difference, `a ^ b` symmetric difference, `a <= b` subset, `a.isdisjoint(b)`.',
      'Dedup: `list(set(items))` loses order; `list(dict.fromkeys(items))` dedups AND keeps first-seen order — the idiomatic ordered dedup.',
      'Set elements must be hashable (immutable). A set of tuples works; a set of lists raises `TypeError: unhashable type`.',
      '`1 == True == 1.0` and they hash identically, so `{1, True, 1.0}` collapses to one element.',
      '`frozenset` is an immutable, hashable set — use it as a dict key or as an element of another set.',
    ],
    keyTakeawaysHi: [
      '`{}` ek empty DICT hai. Empty set `set()` hai — koi empty-set literal nahi. `{1, 2}` aur `{expr for ...}` sets hain (unka content hai).',
      'Set membership (`x in s`) O(1) hai; list membership O(n) hai. Ek list ko ek baar set mein convert karo jab aap membership baar-baar check karte ho, khaaskar ek loop mein.',
      'Sets ka koi order NAHI aur koi indexing NAHI — `s[0]` ek TypeError hai. Iteration order unspecified hai. Ek ordered subset ke liye, pehle `sorted(s)`.',
      'Set algebra: `a | b` union, `a & b` intersection, `a - b` difference, `a ^ b` symmetric difference, `a <= b` subset, `a.isdisjoint(b)`.',
      'Dedup: `list(set(items))` order khota hai; `list(dict.fromkeys(items))` dedup karta hai AND first-seen order rakhta hai — idiomatic ordered dedup.',
      'Set elements hashable (immutable) hone chahiye. Tuples ka ek set kaam karta hai; lists ka ek set `TypeError: unhashable type` deta hai.',
      '`1 == True == 1.0` aur wo samaan hash karte hain, isliye `{1, True, 1.0}` ek element mein collapse hota hai.',
      '`frozenset` ek immutable, hashable set hai — ise ek dict key ki tarah ya ek doosre set ke element ki tarah istemal karo.',
    ],
  },

  {
    slug: 'py-comprehensions',
    title: 'Comprehensions: Building Lists, Dicts, and Sets in One Expression',
    titleHi: 'Comprehensions: Ek Expression Mein Lists, Dicts, Aur Sets Banaana',
    description: 'Writing a `for` loop that starts with an empty list, appends inside the loop, and ends by returning it — three lines of boilerplate for something Python expresses in one. And then over-correcting: cramming a triple-nested comprehension with two `if` clauses and a conditional expression into a single line nobody can read, when a plain loop would have been clearer.',
    descriptionHi: 'Ek `for` loop likhna jo ek empty list se shuru hota hai, loop ke andar append karta hai, aur ise return karke khatam hota hai — kisi cheez ke liye teen lines ka boilerplate jo Python ek mein express karta hai. Aur phir over-correct karna: ek triple-nested comprehension do `if` clauses aur ek conditional expression ke saath ek single line mein thoosna jise koi nahi padh sakta, jab ek plain loop zyaada saaf hota.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A sentence versus a flowchart for the same instruction.** "Give me the square of every even number from one to twenty" is a single English sentence — a source (the numbers one to twenty), a filter (the even ones), and a transformation (square it). A list comprehension is that sentence written in Python, in that order: the transformation, then the source, then the filter. It reads left to right roughly as you would say it aloud. The equivalent as separate steps — declare an empty container, walk the source, test the filter, do the transformation, append the result — is a flowchart: correct, but you have to trace it to see what it produces, and the container name appears three times. The comprehension is the right tool exactly when the sentence stays short: one source, at most one filter, a simple transformation. The moment the sentence needs sub-clauses — nested loops, multiple conditions, an if-this-else-that in the transformation — it stops reading like a sentence and starts reading like legalese, and at that point the flowchart, the plain loop, is genuinely easier for the next person to follow.',
      hi: '**Ek vaakya versus usi nirdesh ke liye ek flowchart.** "Mujhe ek se bees tak har even number ka varg do" ek akela English vaakya hai — ek source (numbers ek se bees), ek filter (even wale), aur ek transformation (varg karo). Ek list comprehension wo vaakya Python mein us kram mein likha hai: transformation, phir source, phir filter. Ye left se right lagbhag waise padhta hai jaise aap ise zor se kehte. Alag steps ke roop mein samaan — ek empty container declare karo, source walk karo, filter test karo, transformation karo, result append karo — ek flowchart hai: sahi, par aapko ise trace karna hoga ye dekhne ko ki ye kya banaata hai, aur container ka naam teen baar dikhta hai. Comprehension sahi tool hai bilkul tab jab vaakya chhota rehta hai: ek source, zyaada se zyaada ek filter, ek simple transformation. Jis pal vaakya ko sub-clauses chahiye — nested loops, kayi conditions — ye ek vaakya ki tarah padhna band karta hai aur legalese ki tarah padhna shuru karta hai.',
    },

    simple: `**Start broken.** Loop boilerplate one way, an unreadable one-liner the other:

\`\`\`python
# too verbose: 4 lines, 'result' named 3 times
result = []
for n in range(20):
    if n % 2 == 0:
        result.append(n * n)
return result

# over-corrected: nobody can read this
return [x*y for x in grid for y in row if x > 0 if y < 10 else 0 for row in x]
\`\`\`

The loop version is fine but noisy for a simple map+filter. The one-liner packs nested loops, two \`if\`s, and (broken) conditional logic into one expression — that is *worse* than a loop.

**The fix: a comprehension when the sentence is short; a loop when it isn't**

\`\`\`python
# the map+filter, as one clear expression:
squares = [n * n for n in range(20) if n % 2 == 0]

# dict comprehension
lengths = {word: len(word) for word in ["hi", "hello", "hey"]}

# set comprehension
initials = {name[0] for name in ["Al", "Bo", "Cy", "Ann"]}

# generator expression -- lazy, no list built (parentheses, or bare in a call)
total = sum(n * n for n in range(1_000_000))

# conditional EXPRESSION inside the transformation (note: goes BEFORE 'for'):
signs = ["+" if n > 0 else "-" if n < 0 else "0" for n in nums]

# when there are two loops or two filters and it stops being readable -> plain loop:
pairs = []
for row in grid:
    for cell in row:
        if cell.active:
            pairs.append((row.id, cell.id))
\`\`\`

\`\`\`
LIST    [ f(x)      for x in it  if cond ]
DICT    { k: v      for x in it  if cond }
SET     { f(x)      for x in it  if cond }
GEN     ( f(x)      for x in it  if cond )   -- lazy; sum(...), any(...), etc.

filter goes AT THE END:        [x for x in it if x > 0]
transform-choice goes FIRST:   ["+" if x > 0 else "-" for x in it]
nested loop reads outer-first: [(a, b) for a in A for b in B]   # a is the outer loop
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Loop boilerplate ek tarike se, ek unreadable one-liner doosre:

\`\`\`python
# bahut verbose: 4 lines, 'result' 3 baar named
result = []
for n in range(20):
    if n % 2 == 0:
        result.append(n * n)
return result

# over-corrected: ise koi nahi padh sakta
return [x*y for x in grid for y in row if x > 0 if y < 10 else 0 for row in x]
\`\`\`

Loop version theek hai par ek simple map+filter ke liye shor-bhara. One-liner nested loops, do \`if\`s, aur (toota) conditional logic ko ek expression mein thoosta hai — wo ek loop se *bura* hai.

**Fix: ek comprehension jab vaakya chhota ho; ek loop jab na ho**

\`\`\`python
# map+filter, ek saaf expression ki tarah:
squares = [n * n for n in range(20) if n % 2 == 0]

# dict comprehension
lengths = {word: len(word) for word in ["hi", "hello", "hey"]}

# set comprehension
initials = {name[0] for name in ["Al", "Bo", "Cy", "Ann"]}

# generator expression -- lazy, koi list nahi bani (parentheses, ya ek call mein nanga)
total = sum(n * n for n in range(1_000_000))

# transformation ke andar conditional EXPRESSION (note: 'for' se PEHLE jaata hai):
signs = ["+" if n > 0 else "-" if n < 0 else "0" for n in nums]

# jab do loops ya do filters hain aur ye readable nahi rehta -> plain loop:
pairs = []
for row in grid:
    for cell in row:
        if cell.active:
            pairs.append((row.id, cell.id))
\`\`\`

\`\`\`
LIST    [ f(x)      for x in it  if cond ]
DICT    { k: v      for x in it  if cond }
SET     { f(x)      for x in it  if cond }
GEN     ( f(x)      for x in it  if cond )   -- lazy; sum(...), any(...), etc.

filter END mein jaata hai:        [x for x in it if x > 0]
transform-choice PEHLE jaata hai: ["+" if x > 0 else "-" for x in it]
nested loop outer-first padhta hai: [(a, b) for a in A for b in B]   # a outer loop
\`\`\``,

    content: `## The four comprehension types

\`\`\`python
nums = [1, -2, 3, -4, 5]

[n for n in nums if n > 0]           # [1, 3, 5]              list
{n for n in nums if n > 0}           # {1, 3, 5}              set (dedups)
{n: n*n for n in nums if n > 0}      # {1: 1, 3: 9, 5: 25}    dict
(n for n in nums if n > 0)           # <generator object>     lazy -- see below
\`\`\`

## Filter vs transform: two different positions

\`\`\`python
# FILTER -- an 'if' with no 'else', at the END, decides whether to include x:
[x for x in xs if x is not None]

# TRANSFORM CHOICE -- an 'if/else' EXPRESSION, at the START, decides what value:
[x if x is not None else 0 for x in xs]

# both together:
[x * 2 if x > 0 else 0 for x in xs if x is not None]
#  \\_____ transform ____/           \\___ filter ___/
\`\`\`

\`x if cond else y\` is the conditional expression — it always produces a value, so it lives in the transform slot. A trailing \`if cond\` (no \`else\`) is a filter — it decides membership.

## Nested loops: outer first

\`\`\`python
matrix = [[1, 2, 3], [4, 5, 6]]

flat = [cell for row in matrix for cell in row]      # [1, 2, 3, 4, 5, 6]
#              \\__ outer __/    \\__ inner __/
# read it as:
#   for row in matrix:
#       for cell in row:
#           yield cell

pairs = [(x, y) for x in "AB" for y in [1, 2]]       # [('A',1),('A',2),('B',1),('B',2)]

# a nested comprehension (list of lists) is different -- the inner [] builds each row:
transposed = [[row[i] for row in matrix] for i in range(3)]
# [[1, 4], [2, 5], [3, 6]]
\`\`\`

## Generator expressions: lazy, memory-flat

\`\`\`python
# a list comprehension BUILDS the whole list in memory:
squares = [n * n for n in range(10_000_000)]     # ~400 MB list

# a generator expression yields one at a time, holding almost nothing:
squares = (n * n for n in range(10_000_000))     # a generator; nothing computed yet
total = sum(squares)                              # computed lazily, constant memory

# when the generator IS the only argument, you can drop the extra parens:
sum(n * n for n in range(100))
any(user.is_admin for user in users)
max((len(line) for line in lines), default=0)
"\\n".join(str(x) for x in items)

# a generator is single-use -- once consumed, it is empty:
g = (x for x in range(3))
list(g)    # [0, 1, 2]
list(g)    # []   -- already exhausted
\`\`\`

Use a generator expression when you feed the result straight into \`sum\`, \`any\`, \`all\`, \`max\`, \`min\`, \`join\`, or a \`for\` loop and never need the list itself.

## When NOT to use a comprehension

\`\`\`python
# 1. you only want the side effect (printing, saving) -- use a loop:
[print(x) for x in items]        # BAD: builds a list of Nones for nothing
for x in items: print(x)         # GOOD

# 2. it needs try/except, or multiple statements per item -- use a loop.

# 3. it is nested more than ~2 deep or has 2+ filters -- a loop reads better.

# 4. you need to break early -- comprehensions cannot break; use a loop or next():
first_even = next((n for n in nums if n % 2 == 0), None)
\`\`\`

## \`map\` and \`filter\`: usually a comprehension is clearer

\`\`\`python
list(map(str.upper, words))              # vs  [w.upper() for w in words]
list(filter(None, items))                # vs  [x for x in items if x]
list(map(lambda x: x * 2, nums))         # vs  [x * 2 for x in nums]  <- clearer
map(f, a, b)                              # map CAN take multiple iterables -> f(a[i], b[i])
\`\`\`

\`map(f, xs)\` and \`filter(f, xs)\` return lazy iterators (like generators). They are fine when \`f\` is an existing named function; a comprehension is clearer when \`f\` would be a \`lambda\`.`,

    contentHi: `## Chaar comprehension types

\`\`\`python
nums = [1, -2, 3, -4, 5]

[n for n in nums if n > 0]           # [1, 3, 5]              list
{n for n in nums if n > 0}           # {1, 3, 5}              set (dedups)
{n: n*n for n in nums if n > 0}      # {1: 1, 3: 9, 5: 25}    dict
(n for n in nums if n > 0)           # <generator object>     lazy -- neeche dekho
\`\`\`

## Filter vs transform: do alag positions

\`\`\`python
# FILTER -- ek 'if' bina 'else' ke, END mein, tay karta hai x ko include karna hai ya nahi:
[x for x in xs if x is not None]

# TRANSFORM CHOICE -- ek 'if/else' EXPRESSION, START mein, tay karta hai kaunsi value:
[x if x is not None else 0 for x in xs]

# dono saath:
[x * 2 if x > 0 else 0 for x in xs if x is not None]
#  \\_____ transform ____/           \\___ filter ___/
\`\`\`

\`x if cond else y\` conditional expression hai — ye hamesha ek value banaata hai, isliye ye transform slot mein rehta hai. Ek trailing \`if cond\` (bina \`else\`) ek filter hai — ye membership tay karta hai.

## Nested loops: outer pehle

\`\`\`python
matrix = [[1, 2, 3], [4, 5, 6]]

flat = [cell for row in matrix for cell in row]      # [1, 2, 3, 4, 5, 6]
#              \\__ outer __/    \\__ inner __/
# ise padho:
#   for row in matrix:
#       for cell in row:
#           yield cell

pairs = [(x, y) for x in "AB" for y in [1, 2]]       # [('A',1),('A',2),('B',1),('B',2)]

# ek nested comprehension (list of lists) alag hai -- inner [] har row banaata hai:
transposed = [[row[i] for row in matrix] for i in range(3)]
# [[1, 4], [2, 5], [3, 6]]
\`\`\`

## Generator expressions: lazy, memory-flat

\`\`\`python
# ek list comprehension poori list memory mein BANAATA hai:
squares = [n * n for n in range(10_000_000)]     # ~400 MB list

# ek generator expression ek baar mein ek deta hai, lagbhag kuch nahi rakhte hue:
squares = (n * n for n in range(10_000_000))     # ek generator; kuch abhi compute nahi
total = sum(squares)                              # lazily compute, constant memory

# jab generator HI ekmatra argument hai, aap extra parens drop kar sakte ho:
sum(n * n for n in range(100))
any(user.is_admin for user in users)
max((len(line) for line in lines), default=0)
"\\n".join(str(x) for x in items)

# ek generator single-use hai -- ek baar consume hone par, wo empty hai:
g = (x for x in range(3))
list(g)    # [0, 1, 2]
list(g)    # []   -- pehle hi exhausted
\`\`\`

Ek generator expression tab istemal karo jab aap result ko seedhe \`sum\`, \`any\`, \`all\`, \`max\`, \`min\`, \`join\`, ya ek \`for\` loop mein feed karte ho aur kabhi list khud ki zaroorat nahi.

## Comprehension kab NAHI istemal karein

\`\`\`python
# 1. aap sirf side effect chahte ho (printing, saving) -- ek loop istemal karo:
[print(x) for x in items]        # KHARAB: kuch nahi ke liye Nones ki ek list banaata hai
for x in items: print(x)         # ACHHA

# 2. ise try/except, ya prati item kayi statements chahiye -- ek loop istemal karo.

# 3. ye ~2 se zyaada gehra nested hai ya 2+ filters hain -- ek loop behtar padhta hai.

# 4. aapko jaldi break karna hai -- comprehensions break nahi kar sakte; loop ya next() istemal:
first_even = next((n for n in nums if n % 2 == 0), None)
\`\`\`

## \`map\` aur \`filter\`: aam taur par ek comprehension saaf hai

\`\`\`python
list(map(str.upper, words))              # vs  [w.upper() for w in words]
list(filter(None, items))                # vs  [x for x in items if x]
list(map(lambda x: x * 2, nums))         # vs  [x * 2 for x in nums]  <- saaf
map(f, a, b)                              # map kayi iterables le SAKTA hai -> f(a[i], b[i])
\`\`\`

\`map(f, xs)\` aur \`filter(f, xs)\` lazy iterators lautaate hain (generators jaise). Wo theek hain jab \`f\` ek maujooda named function hai; ek comprehension saaf hai jab \`f\` ek \`lambda\` hota.`,

    examples: [
      {
        title: 'Broken: comprehension for side effects; unreadable nesting',
        titleHi: 'Toota: side effects ke liye comprehension; unreadable nesting',
        code: `items = ["a", "b", "c"]

# using a comprehension only to print -- builds [None, None, None]
_ = [print(f"item: {x}") for x in items]

# a nested one-liner that is hard to reason about:
grid = [[1, 0, 3], [0, 5, 0], [7, 0, 9]]
result = [v for row in grid for v in row if v != 0 if v % 2 == 1]
print(result)`,
        output: `item: a
item: b
item: c
[1, 3, 5, 7, 9]`,
        explain: 'The first comprehension does its job (printing) but also allocates a list of three `None`s that is immediately discarded — a plain `for x in items: print(...)` is clearer and wastes nothing. The second works but "for row ... for v ... if ... if ..." on one line takes real effort to parse.',
        explainHi: 'Pehla comprehension apna kaam karta hai (printing) par teen `None`s ki ek list bhi allocate karta hai jo turant discard hoti hai — ek plain `for x in items: print(...)` saaf hai aur kuch barbaad nahi karta. Doosra kaam karta hai par "for row ... for v ... if ... if ..." ek line par asli mehnat leta hai.',
      },
      {
        title: 'Fixed: the right comprehension, and a loop where it belongs',
        titleHi: 'Theek: sahi comprehension, aur ek loop jahaan ye hai',
        code: `nums = [3, -1, 4, -1, 5, -9, 2, -6]

positives = [n for n in nums if n > 0]
clamped = [n if n > 0 else 0 for n in nums]
by_sign = {n: ("+" if n > 0 else "-") for n in nums}

print(positives)
print(clamped)
print(by_sign)

# lazy: never builds the list
print("sum of squares:", sum(n * n for n in nums))
print("any negative?", any(n < 0 for n in nums))

# a case for a plain loop: side effect + early exit
first_big = None
for n in nums:
    if abs(n) > 5:
        first_big = n
        break
print("first |n|>5:", first_big)`,
        output: `[3, 4, 5, 2]
[3, 0, 4, 0, 5, 0, 2, 0]
{3: '+', -1: '-', 4: '+', 5: '+', -9: '-', 2: '+', -6: '-'}
sum of squares: 173
any negative? True
first |n|>5: -9`,
        explain: '`[n for n in nums if n > 0]` filters; `[n if n > 0 else 0 for n in nums]` transforms every element (the `if/else` is before the `for`). `sum(n*n for n in nums)` never materialises a list. The last block needs a loop: it has a side effect (assigning `first_big`) and a `break`, neither of which a comprehension can do.',
        explainHi: '`[n for n in nums if n > 0]` filter karta hai; `[n if n > 0 else 0 for n in nums]` har element transform karta hai (`if/else` `for` se pehle). `sum(n*n for n in nums)` kabhi list materialise nahi karta. Aakhri block ko ek loop chahiye: iska ek side effect hai (`first_big` assign karna) aur ek `break`, jinmein se koi comprehension nahi kar sakta.',
      },
      {
        title: 'Generator laziness and single-use',
        titleHi: 'Generator laziness aur single-use',
        code: `import sys

lst = [n * n for n in range(1000)]
gen = (n * n for n in range(1000))
print("generator far smaller:", sys.getsizeof(gen) < sys.getsizeof(lst) // 10)

# a generator is consumed once
g = (c.upper() for c in "abc")
print(list(g))
print(list(g))       # empty -- already exhausted

# feeding a generator straight into a consumer -- no intermediate list
lines = ["  hi  ", "", "  there  "]
cleaned = "\\n".join(line.strip() for line in lines if line.strip())
print(repr(cleaned))`,
        output: `generator far smaller: True
['A', 'B', 'C']
[]
'hi\\nthere'`,
        explain: 'A 1000-element list takes several kilobytes; the generator is a small fixed size regardless of the range, because it computes lazily and holds only its current state. A generator can only be iterated once — the second `list(g)` sees nothing. Passing `line.strip() for line in lines if line.strip()` straight to `.join` avoids building a throwaway list.',
        explainHi: 'Ek 1000-element list kai kilobytes leti hai; generator range chahe kuch bhi ho ek chhota fixed size hai, kyunki ye lazily compute karta hai aur sirf apni current state rakhta hai. Ek generator sirf ek baar iterate ho sakta hai — doosra `list(g)` kuch nahi dekhta. `line.strip() for line in lines if line.strip()` ko seedhe `.join` mein pass karna ek throwaway list banane se bachta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# filter with an if/else at the end -- SyntaxError
[x for x in xs if x > 0 else 0]`,
        right: `# transform choice goes BEFORE 'for'
[x if x > 0 else 0 for x in xs]
# a plain filter (no else) goes AFTER
[x for x in xs if x > 0]`,
        why: 'A trailing `if` in a comprehension is a filter and cannot have an `else` — `if cond else other` is a full conditional expression that produces a value, so it belongs in the transform position, before the `for`. Putting `if/else` at the end is a SyntaxError.',
        whyHi: 'Ek comprehension mein ek trailing `if` ek filter hai aur iska `else` nahi ho sakta — `if cond else other` ek poora conditional expression hai jo ek value banaata hai, isliye ye transform position mein rehta hai, `for` se pehle. `if/else` ko end mein rakhna ek SyntaxError hai.',
      },
      {
        wrong: `results = (process(x) for x in items)   # a generator
save_all(results)
report(len(results))                    # TypeError: generator has no len()
# and if save_all iterated it, results is now empty for report()`,
        right: `results = [process(x) for x in items]   # a list -- reusable, has len()`,
        why: 'A generator expression is lazy and single-use — you cannot take its `len`, index it, or iterate it twice. Use a list comprehension when you need the results more than once or need to know how many there are. Use a generator only for a single streaming pass into one consumer.',
        whyHi: 'Ek generator expression lazy aur single-use hai — aap iski `len` nahi le sakte, ise index nahi kar sakte, ya do baar iterate nahi kar sakte. Ek list comprehension istemal karo jab aapko results ek se zyaada baar chahiye ya jaanna hai kitne hain. Ek generator sirf ek single streaming pass ke liye.',
      },
      {
        wrong: `# leaking a loop variable -- the comprehension var does NOT leak,
# but in a plain loop it does:
for i in range(3):
    pass
print(i)      # 2  -- 'i' still exists after the loop`,
        right: `# comprehension variables are scoped to the comprehension:
[i for i in range(3)]
print(i)      # NameError -- 'i' never escaped
# if a plain loop's variable leaking matters, del it or use a function`,
        why: 'This is a subtle upside of comprehensions: their loop variable is local to the comprehension and does not leak into the surrounding scope, unlike a plain `for` loop where the variable persists with its last value. It rarely matters but can cause a "why is `i` still 2 here" surprise.',
        whyHi: 'Ye comprehensions ka ek sookshm faayda hai: unka loop variable comprehension ke local hai aur surrounding scope mein leak nahi karta, ek plain `for` loop ke ulte jahaan variable apni aakhri value ke saath bana rehta hai. Ye shaayad hi maayne rakhta hai par ek "yahaan `i` abhi bhi 2 kyun hai" surprise de sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**DRF serializers and Django views are full of comprehensions** — `[item.id for item in queryset]`, `{f.name: f.value for f in fields}`, `any(p.codename == "publish" for p in perms)`. The generator form (`sum(o.total for o in orders)`) avoids materialising a big list just to aggregate it.',
        hi: '**DRF serializers aur Django views comprehensions se bhare hain** — `[item.id for item in queryset]`, `{f.name: f.value for f in fields}`, `any(p.codename == "publish" for p in perms)`. Generator form (`sum(o.total for o in orders)`) ek badi list ko sirf aggregate karne ke liye materialise karne se bachta hai.',
      },
      {
        en: '**Building a `filter` kwargs dict conditionally** — `filters = {k: v for k, v in request.GET.items() if k in ALLOWED_FILTERS and v}` then `Model.objects.filter(**filters)` — is the standard pattern for a search endpoint.',
        hi: '**Ek `filter` kwargs dict conditionally banaana** — `filters = {k: v for k, v in request.GET.items() if k in ALLOWED_FILTERS and v}` phir `Model.objects.filter(**filters)` — ek search endpoint ke liye standard pattern hai.',
      },
      {
        en: '**`next((x for x in items if cond), default)`** is the idiomatic "find the first matching item or a default" — used to locate a record, a config entry, or a route without a full loop and a flag variable.',
        hi: '**`next((x for x in items if cond), default)`** idiomatic "pehla matching item ya ek default dhoondho" hai — ek record, ek config entry, ya ek route ko ek poore loop aur ek flag variable ke bina locate karne ko istemal.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a list comprehension and a generator expression, and when do you use each?',
        qHi: 'Ek list comprehension aur ek generator expression mein kya antar hai, aur aap har ek kab istemal karte ho?',
        a: 'Syntactically they are almost identical — the only visible difference is square brackets versus round parentheses. Semantically they are quite different. A list comprehension runs to completion immediately and builds a real list object holding every result in memory. A generator expression builds nothing up front; it creates a generator object that, each time you ask it for the next value, runs just enough of the loop to produce that one value and then pauses. So the list comprehension has a fixed cost proportional to the number of elements, in both time and memory, paid all at once. The generator expression has almost zero upfront cost and produces values lazily, one at a time, holding only the current state, so its memory footprint is constant regardless of how many values it will eventually yield. You use a list comprehension when you need the results as a collection: you will index into it, take its length, iterate it more than once, pass it somewhere that expects a sequence, or the source is small enough that eagerness does not matter. You use a generator expression when the results flow straight into a single consumer that reads them once — sum, any, all, min, max, a join, a for loop, or another generator in a pipeline — and especially when the source is large or infinite, because then you never pay to hold the whole thing. There are two traps. A generator is single-use: once something has iterated it to the end, it is exhausted and iterating again yields nothing. And a generator has no length and no indexing, so calling len on it or subscripting it fails. If you catch yourself needing either of those, you wanted a list. A convenient middle case is finding the first match: wrapping a generator in next with a default argument gives you the first element satisfying a condition, or the default, without building any list and without a manual loop-and-break.',
        aHi: 'Syntactically wo lagbhag samaan hain — ekmatra dikhne waala antar square brackets versus round parentheses hai. Semantically wo kaafi alag hain. Ek list comprehension turant poora chalta hai aur ek asli list object banaata hai jo har result memory mein rakhta hai. Ek generator expression aage se kuch nahi banaata; ye ek generator object banaata hai jo, har baar jab aap ise agli value maangte ho, loop ka utna hi chalaata hai jitna us ek value ko banaane ke liye kaafi ho aur phir ruk jaata hai. Toh list comprehension ki ek fixed cost hai elements ki tadaad ke anupaatik, samay aur memory dono mein, ek saath chukaayi gayi. Generator expression ki lagbhag zero upfront cost hai aur values lazily banaata hai, ek baar mein ek. Aap ek list comprehension tab istemal karte ho jab aapko results ek collection ki tarah chahiye. Aap ek generator expression tab istemal karte ho jab results seedhe ek akele consumer mein behte hain jo unhe ek baar padhta hai. Do jaal hain. Ek generator single-use hai. Aur ek generator ki koi length aur koi indexing nahi.',
      },
      {
        q: 'When does a comprehension stop being the right choice, and what do you use instead?',
        qHi: 'Ek comprehension kab sahi choice hona band karta hai, aur aap iske bajaye kya istemal karte ho?',
        a: 'A comprehension is at its best when it expresses a single sentence: take a source, optionally filter it, transform each item, collect the results. As soon as the logic outgrows that shape, a comprehension becomes harder to read than the plain loop it replaces, and you should switch. The specific signals are these. First, if you only want the side effect — printing each item, writing each to a file, calling a method for its effect — a comprehension is wrong because it also builds and discards a list of the return values, usually a list of Nones; a for loop does the same work with no waste and clearer intent. Second, if each iteration needs more than one statement, or needs a try except, a comprehension cannot express it; comprehensions are limited to a single expression per element. Third, if you need to stop early on some condition, a comprehension has no break; either use a for loop, or if you just want the first match, wrap a generator in next with a default. Fourth, nesting: one for clause and one if clause is readable, but two for clauses, or two if clauses, or a conditional expression in the transform on top of a filter, quickly becomes something you have to decode rather than read. The threshold is roughly: if you cannot say the comprehension out loud as one smooth sentence, unpack it into a loop. Fifth, if intermediate names would help — you want to compute something once and use it twice per item — a loop with a local variable is clearer than repeating the sub-expression or abusing the walrus operator. The plain for loop is not a failure mode; it is the correct tool for anything with real control flow, and reviewers generally prefer a readable six-line loop to a clever one-line comprehension that takes a minute to parse.',
        aHi: 'Ek comprehension apne behtareen par tab hai jab ye ek akela vaakya express karta hai: ek source lo, optionally filter karo, har item transform karo, results collect karo. Jaise hi logic us shape se bada hota hai, ek comprehension us plain loop se padhna mushkil ho jaata hai jise wo replace karta hai. Vishisht sanket ye hain. Pehle, agar aap sirf side effect chahte ho — har item print karna, har ek ko ek file mein likhna — ek comprehension galat hai kyunki ye return values ki ek list bhi banaata aur discard karta hai. Doosre, agar har iteration ko ek se zyaada statement chahiye, ya ek try except chahiye, ek comprehension ise express nahi kar sakta. Teesre, agar aapko kisi condition par jaldi rukna hai, ek comprehension mein koi break nahi. Chauthe, nesting: ek for clause aur ek if clause readable hai, par do for clauses jaldi kuch aisa ban jaata hai jise aapko decode karna padta hai. Plain for loop ek failure mode nahi hai; ye asli control flow waali kisi bhi cheez ke liye sahi tool hai.',
      },
    ],

    exercises: [
      {
        task: 'Rewrite each loop as a comprehension: (a) `out = []; for w in words: if len(w) > 3: out.append(w.upper())`, (b) `d = {}; for i, x in enumerate(xs): d[x] = i`, (c) `s = set(); for line in lines: s.add(line.strip())`.',
        taskHi: 'Har loop ko ek comprehension ki tarah dobara likho: (a) `out = []; for w in words: if len(w) > 3: out.append(w.upper())`, (b) `d = {}; for i, x in enumerate(xs): d[x] = i`, (c) `s = set(); for line in lines: s.add(line.strip())`.',
        hint: '(a) `[w.upper() for w in words if len(w) > 3]`. (b) `{x: i for i, x in enumerate(xs)}`. (c) `{line.strip() for line in lines}`.',
        hintHi: '(a) `[w.upper() for w in words if len(w) > 3]`. (b) `{x: i for i, x in enumerate(xs)}`. (c) `{line.strip() for line in lines}`.',
      },
      {
        task: 'Given `nums = [4, 0, -3, 7, 0, -1, 9]`, produce in one comprehension a list where each element is "pos", "neg", or "zero". Then in a generator expression, compute the count of non-zero elements with `sum(1 for n in nums if n != 0)`.',
        taskHi: '`nums = [4, 0, -3, 7, 0, -1, 9]` diya, ek comprehension mein ek list banao jahaan har element "pos", "neg", ya "zero" hai. Phir ek generator expression mein, `sum(1 for n in nums if n != 0)` se non-zero elements ki count compute karo.',
        hint: '`["pos" if n > 0 else "neg" if n < 0 else "zero" for n in nums]` — the chained conditional expression goes in the transform slot. `sum(1 for n in nums if n != 0)` is the idiomatic "count matching".',
        hintHi: '`["pos" if n > 0 else "neg" if n < 0 else "zero" for n in nums]` — chained conditional expression transform slot mein jaata hai. `sum(1 for n in nums if n != 0)` idiomatic "count matching" hai.',
      },
      {
        task: 'Write `find_first(items, predicate, default=None)` using `next(... , default)` over a generator expression — no explicit loop. Test: `find_first(range(100), lambda n: n > 50 and n % 7 == 0)` -> `56`.',
        taskHi: '`find_first(items, predicate, default=None)` likho `next(... , default)` istemal karke ek generator expression par — koi explicit loop nahi. Test: `find_first(range(100), lambda n: n > 50 and n % 7 == 0)` -> `56`.',
        hint: '`return next((x for x in items if predicate(x)), default)`. The generator yields matches lazily; `next` pulls the first one; the second argument is returned if the generator is empty.',
        hintHi: '`return next((x for x in items if predicate(x)), default)`. Generator matches lazily deta hai; `next` pehla kheenchta hai; doosra argument return hota hai agar generator empty hai.',
      },
    ],

    keyTakeaways: [
      'Four comprehensions: `[...]` list, `{...}` set, `{k: v ...}` dict, `(...)` generator. Shape: `expr for x in iterable if filter`.',
      'A trailing `if cond` (no `else`) is a FILTER and goes at the END. `x if cond else y` is a transform-choice EXPRESSION and goes at the START (before `for`). `if/else` at the end is a SyntaxError.',
      'Nested loops read outer-first: `[c for row in matrix for c in row]` = `for row: for c in row: yield c`.',
      'A generator expression `(expr for ...)` is LAZY and constant-memory — use it when feeding straight into `sum`/`any`/`all`/`max`/`min`/`join`/`for`. Drop the parens when it is the sole argument.',
      'A generator is SINGLE-USE (exhausted after one iteration), has no `len`, and no indexing. Need any of those? Use a list comprehension.',
      'Do NOT use a comprehension for side effects only (`[print(x) for x in xs]` builds a list of Nones) — use a `for` loop.',
      'Switch to a plain loop when: 2+ nested loops or filters, multiple statements per item, `try/except`, or an early `break` is needed.',
      '`next((x for x in items if cond), default)` is the idiomatic "first match or default". `sum(1 for x in xs if cond)` is "count matching".',
    ],
    keyTakeawaysHi: [
      'Chaar comprehensions: `[...]` list, `{...}` set, `{k: v ...}` dict, `(...)` generator. Shape: `expr for x in iterable if filter`.',
      'Ek trailing `if cond` (bina `else`) ek FILTER hai aur END mein jaata hai. `x if cond else y` ek transform-choice EXPRESSION hai aur START mein jaata hai (`for` se pehle). `if/else` end mein ek SyntaxError hai.',
      'Nested loops outer-first padhte hain: `[c for row in matrix for c in row]` = `for row: for c in row: yield c`.',
      'Ek generator expression `(expr for ...)` LAZY aur constant-memory hai — ise tab istemal karo jab seedhe `sum`/`any`/`all`/`max`/`min`/`join`/`for` mein feed karte ho. Parens drop karo jab ye ekmatra argument ho.',
      'Ek generator SINGLE-USE hai (ek iteration ke baad exhausted), koi `len` nahi, koi indexing nahi. Inmein se koi chahiye? Ek list comprehension istemal karo.',
      'Sirf side effects ke liye ek comprehension NAHI istemal karo (`[print(x) for x in xs]` Nones ki ek list banaata hai) — ek `for` loop istemal karo.',
      'Ek plain loop par switch karo jab: 2+ nested loops ya filters, prati item kayi statements, `try/except`, ya ek early `break` chahiye.',
      '`next((x for x in items if cond), default)` idiomatic "pehla match ya default" hai. `sum(1 for x in xs if cond)` "count matching" hai.',
    ],
  },

  {
    slug: 'py-iteration-protocol-and-builtins',
    title: 'The Iteration Protocol and the Iteration Built-ins',
    titleHi: 'Iteration Protocol Aur Iteration Built-ins',
    description: 'Treating a file object, a generator, or a `zip(...)` result like a list — calling `len()` on it, indexing it with `[0]`, or looping over it twice and finding it empty the second time. Most things you can write `for x in ...` over are iterators that produce values once and cannot be rewound, and knowing which is which prevents a class of "why is this empty" bugs.',
    descriptionHi: 'Ek file object, ek generator, ya ek `zip(...)` result ko ek list ki tarah maanna — ispar `len()` call karna, ise `[0]` se index karna, ya ispar do baar loop karna aur doosri baar ise empty paana. Adhikaansh cheezein jinpar aap `for x in ...` likh sakte ho iterators hain jo values ek baar banaate hain aur rewind nahi ho sakte, aur ye jaanna ki kaunsa kaunsa hai "ye empty kyun hai" bugs ki ek class rokta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 6,

    analogy: {
      en: '**A book on a shelf versus a ticket printed at a deli counter.** A list is the book: it sits there, you can flip to page 40, count the pages, read it again next week, hand it to someone else to read. A generator, a `zip` result, an open file being read, a `map` object — these are the deli ticket. The machine prints you the next number when you press the button, and once a number is printed it is gone; you cannot ask "what was the third number" or "how many numbers will there be", and if you walk away and come back the counter has moved on. Both a book and a ticket-dispenser answer the question "give me the next thing" — that shared ability is what `for` needs and what "iterable" means. But only the book answers "give me thing number 40", "how many things", "start over". The confusion comes from `for x in ...` working on both: because the loop only ever asks for "the next thing", it hides whether you are looping over a rewindable collection or a one-shot stream. When you need the collection powers — length, indexing, a second pass — you materialise the stream into a book first, by wrapping it in `list(...)`.',
      hi: '**Ek shelf par ek kitaab versus ek deli counter par chhapaa ek ticket.** Ek list kitaab hai: ye wahaan baithi hai, aap page 40 par jaa sakte ho, pages gin sakte ho, agle hafte phir padh sakte ho, kisi aur ko padhne ko de sakte ho. Ek generator, ek `zip` result, padhi jaa rahi ek open file, ek `map` object — ye deli ticket hain. Machine aapko agla number chhaapti hai jab aap button dabaate ho, aur ek baar ek number chhapne par wo gaya; aap "teesra number kya tha" ya "kitne numbers honge" nahi poochh sakte. Dono ek kitaab aur ek ticket-dispenser "mujhe agli cheez do" sawaal ka jawaab dete hain — wo saanjhi kshamata wo hai jo `for` ko chahiye aur "iterable" ka matlab hai. Par sirf kitaab "mujhe cheez number 40 do", "kitni cheezein", "phir se shuru karo" ka jawaab deti hai. Confusion `for x in ...` ke dono par kaam karne se aati hai. Jab aapko collection powers chahiye — length, indexing, ek doosra pass — aap pehle stream ko ek kitaab mein materialise karte ho, ise `list(...)` mein wrap karke.',
    },

    simple: `**Start broken.** Treating a one-shot iterator like a list:

\`\`\`python
pairs = zip([1, 2, 3], ["a", "b", "c"])
print(len(pairs))        # TypeError: object of type 'zip' has no len()

nums = (n for n in range(5))
print(nums[2])           # TypeError: 'generator' object is not subscriptable

lines = open("data.txt")
first_pass = [line for line in lines]
second_pass = [line for line in lines]   # [] -- the file is already at the end
\`\`\`

\`zip\`, generators, \`map\`, \`filter\`, and an open file are **iterators**: you can loop them once, that is all. No \`len\`, no indexing, no rewind.

**The fix: know what you have; materialise with \`list()\` when you need list powers**

\`\`\`python
pairs = list(zip([1, 2, 3], ["a", "b", "c"]))   # now a real list
print(len(pairs), pairs[0])                      # 3 (1, 'a')

nums = list(n for n in range(5))                 # [0, 1, 2, 3, 4]
print(nums[2])                                   # 2

# for a single pass, DON'T materialise -- just iterate directly:
with open("data.txt") as f:
    for line in f:            # streams one line at a time, constant memory
        process(line)

# what "iterable" means, mechanically:
it = iter([10, 20, 30])      # get an iterator from an iterable
next(it)                     # 10
next(it)                     # 20
next(it)                     # 30
next(it)                     # StopIteration  -- this is what ends a for loop
\`\`\`

\`\`\`
ITERABLE   anything you can \`for x in\` over: list, tuple, str, dict, set, range,
           file, generator, zip/map/filter, and your own classes with __iter__
ITERATOR   an iterable that also remembers its position; next(it) advances it;
           StopIteration means "done". Generators/zip/map/filter/files ARE iterators.
           list/tuple/str/dict are iterable but NOT iterators (iter() makes a fresh one).

REUSABLE (list, tuple, str, dict, set, range): loop many times, has len, index
ONE-SHOT (generator, zip, map, filter, open file): loop ONCE, no len, no index
         -> wrap in list(...) if you need it more than once
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Ek one-shot iterator ko ek list ki tarah maanna:

\`\`\`python
pairs = zip([1, 2, 3], ["a", "b", "c"])
print(len(pairs))        # TypeError: object of type 'zip' has no len()

nums = (n for n in range(5))
print(nums[2])           # TypeError: 'generator' object is not subscriptable

lines = open("data.txt")
first_pass = [line for line in lines]
second_pass = [line for line in lines]   # [] -- file pehle se end par hai
\`\`\`

\`zip\`, generators, \`map\`, \`filter\`, aur ek open file **iterators** hain: aap unhe ek baar loop kar sakte ho, bas. Koi \`len\`, koi indexing, koi rewind.

**Fix: jaano aapke paas kya hai; jab list powers chahiye to \`list()\` se materialise karo**

\`\`\`python
pairs = list(zip([1, 2, 3], ["a", "b", "c"]))   # ab ek asli list
print(len(pairs), pairs[0])                      # 3 (1, 'a')

nums = list(n for n in range(5))                 # [0, 1, 2, 3, 4]
print(nums[2])                                   # 2

# ek single pass ke liye, materialise MAT karo -- bas seedhe iterate karo:
with open("data.txt") as f:
    for line in f:            # ek line ek baar mein stream, constant memory
        process(line)

# "iterable" ka matlab, mechanically:
it = iter([10, 20, 30])      # ek iterable se ek iterator lo
next(it)                     # 10
next(it)                     # 20
next(it)                     # 30
next(it)                     # StopIteration  -- ye wo hai jo ek for loop khatam karta hai
\`\`\`

\`\`\`
ITERABLE   koi bhi cheez jispar aap \`for x in\` kar sakte ho: list, tuple, str, dict, set,
           range, file, generator, zip/map/filter, aur aapki __iter__ waali classes
ITERATOR   ek iterable jo apni position bhi yaad rakhta hai; next(it) ise aage badhaata hai;
           StopIteration matlab "done". Generators/zip/map/filter/files iterators HAIN.
           list/tuple/str/dict iterable hain par iterators NAHI (iter() ek naya banaata hai).

REUSABLE (list, tuple, str, dict, set, range): kayi baar loop, len hai, index
ONE-SHOT (generator, zip, map, filter, open file): EK baar loop, koi len nahi, koi index nahi
         -> list(...) mein wrap karo agar ek se zyaada baar chahiye
\`\`\``,

    content: `## The protocol, mechanically

\`\`\`python
# 'for x in obj' is roughly:
_it = iter(obj)              # calls obj.__iter__()
while True:
    try:
        x = next(_it)       # calls _it.__next__()
    except StopIteration:
        break
    ...                     # loop body

# a list is iterable (has __iter__) but is NOT its own iterator:
xs = [1, 2, 3]
iter(xs) is iter(xs)        # False -- each call makes a FRESH iterator
# a generator IS its own iterator:
g = (n for n in range(3))
iter(g) is g               # True -- iterating it consumes it
\`\`\`

This is why you can loop a list twice (each \`for\` gets a new iterator) but not a generator (the \`for\` uses the generator itself, and it stays exhausted).

## The aggregate built-ins (take any iterable)

\`\`\`python
sum(xs)                     # sum(xs, start) -- start defaults to 0
sum(x.total for x in orders)              # works on a generator -- no list built
min(xs)  max(xs)            # min(xs, key=..., default=...) for empty
min(people, key=lambda p: p.age)
sorted(xs, key=..., reverse=...)          # always returns a NEW list
any(xs)                     # True if ANY element is truthy (short-circuits)
all(xs)                     # True if ALL are truthy (short-circuits); all([]) is True
len(xs)                     # only for sized things -- NOT generators
list(it)  tuple(it)  set(it)  dict(pairs)  # materialise an iterator
"".join(str(x) for x in xs)               # iterable of strings -> one string
\`\`\`

\`any\` / \`all\` stop at the first decisive element, so \`any(expensive(x) for x in huge)\` only evaluates until the first truthy result.

## \`enumerate\`, \`zip\`, \`reversed\` — the loop helpers

\`\`\`python
for i, x in enumerate(xs): ...            # (0, x0), (1, x1), ...
for i, x in enumerate(xs, start=1): ...   # 1-based
for a, b in zip(list_a, list_b): ...      # stops at the SHORTER
for a, b in zip(list_a, list_b, strict=True): ...   # 3.10+: raise if lengths differ
from itertools import zip_longest
for a, b in zip_longest(list_a, list_b, fillvalue=None): ...   # pads the shorter
for x in reversed(xs): ...                # xs must be a sequence (has len + index)
\`\`\`

\`zip(*matrix)\` transposes: \`list(zip(*[[1,2,3],[4,5,6]]))\` is \`[(1,4),(2,5),(3,6)]\`.

## Unpacking in function calls (the mirror of \`*args\`)

\`\`\`python
def area(w, h): return w * h

dims = (3, 4)
area(*dims)                 # area(3, 4) -- spread a sequence into positional args

opts = {"w": 3, "h": 4}
area(**opts)                # area(w=3, h=4) -- spread a dict into keyword args

nums = [1, 2, 3]
print(*nums)                # print(1, 2, 3) -> "1 2 3"  (not "[1, 2, 3]")
print(*nums, sep=", ")      # "1, 2, 3"

combined = [*a, *b, extra]  # spread into a new list literal
merged = {**d1, **d2}       # spread into a new dict literal
first, *rest = seq          # collect (the other direction)
\`\`\`

## \`map\` / \`filter\` return iterators (lazy, one-shot)

\`\`\`python
m = map(str.strip, lines)   # nothing computed yet; m is an iterator
list(m)                     # forces it -> a list
list(m)                     # [] -- exhausted

# for readability, prefer a comprehension unless f is already a named function:
[line.strip() for line in lines]      # clearer than map(str.strip, lines) barely
list(filter(None, items))             # keep truthy -- filter(None, ...) is a real idiom
list(map(int, "1 2 3".split()))       # map(int, ...) reads well
\`\`\``,

    contentHi: `## Protocol, mechanically

\`\`\`python
# 'for x in obj' lagbhag hai:
_it = iter(obj)              # obj.__iter__() call karta hai
while True:
    try:
        x = next(_it)       # _it.__next__() call karta hai
    except StopIteration:
        break
    ...                     # loop body

# ek list iterable hai (__iter__ hai) par apna iterator NAHI hai:
xs = [1, 2, 3]
iter(xs) is iter(xs)        # False -- har call ek NAYA iterator banaata hai
# ek generator apna iterator HAI:
g = (n for n in range(3))
iter(g) is g               # True -- ise iterate karna ise consume karta hai
\`\`\`

Yahi wajah hai ki aap ek list ko do baar loop kar sakte ho (har \`for\` ko ek naya iterator milta hai) par ek generator ko nahi (\`for\` generator khud istemal karta hai, aur wo exhausted rehta hai).

## Aggregate built-ins (koi bhi iterable lete hain)

\`\`\`python
sum(xs)                     # sum(xs, start) -- start default 0
sum(x.total for x in orders)              # ek generator par kaam karta hai -- koi list nahi bani
min(xs)  max(xs)            # empty ke liye min(xs, key=..., default=...)
min(people, key=lambda p: p.age)
sorted(xs, key=..., reverse=...)          # hamesha ek NAYI list lautaata hai
any(xs)                     # True agar KOI element truthy hai (short-circuits)
all(xs)                     # True agar SAB truthy hain (short-circuits); all([]) True hai
len(xs)                     # sirf sized cheezon ke liye -- generators NAHI
list(it)  tuple(it)  set(it)  dict(pairs)  # ek iterator materialise karo
"".join(str(x) for x in xs)               # strings ka iterable -> ek string
\`\`\`

\`any\` / \`all\` pehle nirnaayak element par rukte hain, isliye \`any(expensive(x) for x in huge)\` sirf pehle truthy result tak evaluate karta hai.

## \`enumerate\`, \`zip\`, \`reversed\` — loop helpers

\`\`\`python
for i, x in enumerate(xs): ...            # (0, x0), (1, x1), ...
for i, x in enumerate(xs, start=1): ...   # 1-based
for a, b in zip(list_a, list_b): ...      # CHHOTE par rukta hai
for a, b in zip(list_a, list_b, strict=True): ...   # 3.10+: lengths alag to error
from itertools import zip_longest
for a, b in zip_longest(list_a, list_b, fillvalue=None): ...   # chhote ko pad karta hai
for x in reversed(xs): ...                # xs ek sequence hona chahiye (len + index hai)
\`\`\`

\`zip(*matrix)\` transpose karta hai: \`list(zip(*[[1,2,3],[4,5,6]]))\` \`[(1,4),(2,5),(3,6)]\` hai.

## Function calls mein unpacking (\`*args\` ka darpan)

\`\`\`python
def area(w, h): return w * h

dims = (3, 4)
area(*dims)                 # area(3, 4) -- ek sequence ko positional args mein failaao

opts = {"w": 3, "h": 4}
area(**opts)                # area(w=3, h=4) -- ek dict ko keyword args mein failaao

nums = [1, 2, 3]
print(*nums)                # print(1, 2, 3) -> "1 2 3"  ("[1, 2, 3]" nahi)
print(*nums, sep=", ")      # "1, 2, 3"

combined = [*a, *b, extra]  # ek naye list literal mein failaao
merged = {**d1, **d2}       # ek naye dict literal mein failaao
first, *rest = seq          # collect (doosri disha)
\`\`\`

## \`map\` / \`filter\` iterators lautaate hain (lazy, one-shot)

\`\`\`python
m = map(str.strip, lines)   # kuch abhi compute nahi; m ek iterator hai
list(m)                     # ise force karo -> ek list
list(m)                     # [] -- exhausted

# readability ke liye, ek comprehension prefer karo jab tak f pehle se ek named function na ho:
[line.strip() for line in lines]      # map(str.strip, lines) se thoda saaf
list(filter(None, items))             # truthy rakho -- filter(None, ...) ek asli idiom hai
list(map(int, "1 2 3".split()))       # map(int, ...) achha padhta hai
\`\`\``,

    examples: [
      {
        title: 'Broken: len/index/re-loop on a one-shot iterator',
        titleHi: 'Toota: ek one-shot iterator par len/index/re-loop',
        code: `data = zip("abc", [1, 2, 3])

count = len(list(data))            # consumes 'data' to build the list
print("count:", count)
print("next after consuming:", next(data, "EMPTY"))   # EMPTY -- data is exhausted

nums = map(int, ["10", "20", "30"])
evens = [n for n in nums if n % 2 == 0]
odds = [n for n in nums if n % 2 == 1]   # [] -- 'nums' already consumed by the line above
print("evens:", evens, "| odds:", odds)`,
        output: `count: 3
next after consuming: EMPTY
evens: [10, 20, 30] | odds: []`,
        explain: '`list(data)` walks the `zip` iterator to the end to build the list, so `data` is now exhausted — `next(data)` would raise `StopIteration` (here `next(data, "EMPTY")` returns the default instead). Same with `map`: the first comprehension consumes `nums` entirely, so the second comprehension iterates nothing and `odds` is empty. An iterator is a single pass.',
        explainHi: '`list(data)` `zip` iterator ko end tak walk karta hai list banane ko, isliye `data` ab exhausted hai — `next(data)` `StopIteration` deta (yahaan `next(data, "EMPTY")` iske bajaye default lautaata hai). `map` ke saath bhi: pehla comprehension `nums` ko poori tarah consume karta hai, isliye doosra comprehension kuch iterate nahi karta aur `odds` empty hai. Ek iterator ek single pass hai.',
      },
      {
        title: 'Fixed: materialise once, then use it as a list',
        titleHi: 'Theek: ek baar materialise karo, phir ise ek list ki tarah istemal karo',
        code: `data = list(zip("abc", [1, 2, 3]))
print("count:", len(data))
print("first:", data[0])
print("all:", data)

nums = list(map(int, ["10", "21", "30", "43"]))
evens = [n for n in nums if n % 2 == 0]
odds = [n for n in nums if n % 2 == 1]
print(evens, odds)

# but for a single streaming pass, keep it lazy:
big_sum = sum(n * n for n in range(1_000_000))   # no million-element list
print("sum:", big_sum)

people = [("Al", 30), ("Bo", 25), ("Cy", 35)]
oldest = max(people, key=lambda p: p[1])
print("oldest:", oldest)`,
        output: `count: 3
first: ('a', 1)
all: [('a', 1), ('b', 2), ('c', 3)]
[10, 30] [21, 43]
sum: 333332833333500000
oldest: ('Cy', 35)`,
        explain: 'Wrapping the `zip`/`map` in `list()` once gives a real list you can `len`, index, and loop repeatedly. But when you only make a single pass — feeding a generator straight into `sum` — do NOT materialise: `sum(n*n for n in range(1_000_000))` uses constant memory. `max(..., key=...)` finds the element with the largest key.',
        explainHi: '`zip`/`map` ko ek baar `list()` mein wrap karna ek asli list deta hai jise aap `len`, index, aur baar-baar loop kar sakte ho. Par jab aap sirf ek single pass karte ho — ek generator seedhe `sum` mein feed karna — materialise MAT karo: `sum(n*n for n in range(1_000_000))` constant memory istemal karta hai. `max(..., key=...)` sabse badi key waala element dhoondhta hai.',
      },
      {
        title: 'iter/next, and unpacking into calls',
        titleHi: 'iter/next, aur calls mein unpacking',
        code: `# the protocol by hand
it = iter(["x", "y", "z"])
print(next(it), next(it))
print(next(it, "DONE"))    # default avoids StopIteration
print(next(it, "DONE"))

# a fresh iterator each time for a list
xs = [1, 2, 3]
print(list(zip(xs, xs[1:])))   # adjacent pairs

# spreading into calls
def rgb(r, g, b): return f"#{r:02x}{g:02x}{b:02x}"
colour = [255, 128, 0]
print(rgb(*colour))

opts = {"r": 0, "g": 255, "b": 0}
print(rgb(**opts))

print(*range(5), sep="-")`,
        output: `x y
z
DONE
[(1, 2), (2, 3)]
#ff8000
#00ff00
0-1-2-3-4`,
        explain: '`iter()` gets an iterator; `next(it, default)` returns the default instead of raising `StopIteration` at the end. `rgb(*colour)` spreads the 3-element list into `r, g, b`; `rgb(**opts)` spreads the dict into keyword arguments. `print(*range(5), sep="-")` unpacks the range into separate print arguments.',
        explainHi: '`iter()` ek iterator deta hai; `next(it, default)` end par `StopIteration` dene ke bajaye default lautaata hai. `rgb(*colour)` 3-element list ko `r, g, b` mein failaata hai; `rgb(**opts)` dict ko keyword arguments mein failaata hai. `print(*range(5), sep="-")` range ko alag print arguments mein unpack karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `results = filter(is_valid, records)
if len(results) == 0:          # TypeError: filter has no len()
    return "nothing"
for r in results: save(r)`,
        right: `results = [r for r in records if is_valid(r)]
if not results:
    return "nothing"
for r in results: save(r)`,
        why: '`filter` (and `map`, `zip`, generators) return lazy iterators with no `len` and no ability to iterate twice. If you need to check emptiness and then iterate, materialise into a list first. If you truly only iterate once and never need the count, keep it lazy.',
        whyHi: '`filter` (aur `map`, `zip`, generators) lazy iterators lautaate hain bina `len` ke aur do baar iterate karne ki kshamata ke bina. Agar aapko emptiness check karke phir iterate karna hai, pehle ek list mein materialise karo. Agar aap sachmuch sirf ek baar iterate karte ho aur kabhi count ki zaroorat nahi, ise lazy rakho.',
      },
      {
        wrong: `total = sum([x.amount for x in huge_queryset])   # builds a big list first`,
        right: `total = sum(x.amount for x in huge_queryset)     # generator -- streams, constant memory`,
        why: 'When the result of a comprehension feeds straight into `sum`, `any`, `all`, `max`, `min`, or `join`, drop the square brackets and pass a generator expression instead. The list version allocates the whole intermediate list; the generator version processes one item at a time.',
        whyHi: 'Jab ek comprehension ka result seedhe `sum`, `any`, `all`, `max`, `min`, ya `join` mein feed hota hai, square brackets drop karo aur iske bajaye ek generator expression pass karo. List version poori intermediate list allocate karta hai; generator version ek baar mein ek item process karta hai.',
      },
      {
        wrong: `for a, b in zip(names, scores):
    ...
# names has 5 items, scores has 3 -> silently processes only 3, drops 2 names`,
        right: `for a, b in zip(names, scores, strict=True):   # 3.10+: raises on length mismatch
    ...
# or use itertools.zip_longest(names, scores, fillvalue=0)`,
        why: '`zip` stops at the shortest input without complaint, so a length mismatch silently drops the extra elements of the longer one. If the inputs should be the same length, `zip(..., strict=True)` (Python 3.10+) turns a mismatch into a `ValueError`; `zip_longest` pads the shorter one instead.',
        whyHi: '`zip` sabse chhote input par bina shikaayat ruk jaata hai, isliye ek length mismatch chupchaap lambe wale ke extra elements drop kar deta hai. Agar inputs same length hone chahiye, `zip(..., strict=True)` (Python 3.10+) ek mismatch ko ek `ValueError` mein badalta hai; `zip_longest` iske bajaye chhote ko pad karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Django querysets are lazy iterators** until you materialise them. `list(qs)`, `len(qs)`, and iterating `qs` twice each hit the database again (or cache). `sum(o.total for o in orders)` streams; `[o.total for o in orders]` then `sum(...)` builds a list you did not need.',
        hi: '**Django querysets lazy iterators hain** jab tak aap unhe materialise nahi karte. `list(qs)`, `len(qs)`, aur `qs` do baar iterate karna har ek database ko phir hit karta hai (ya cache). `sum(o.total for o in orders)` stream karta hai; `[o.total for o in orders]` phir `sum(...)` ek list banaata hai jiski aapko zaroorat nahi thi.',
      },
      {
        en: '**Reading a large upload or export line by line** — `for row in csv.reader(f)` — never loads the whole file. Wrapping it in `list()` to get a length defeats the purpose; if you need the count, count as you go.',
        hi: '**Ek bade upload ya export ko line by line padhna** — `for row in csv.reader(f)` — kabhi poori file load nahi karta. Length paane ke liye ise `list()` mein wrap karna maqsad haraa deta hai; agar aapko count chahiye, chalte-chalte gino.',
      },
      {
        en: '**`Model.objects.filter(**query_dict)` and `serializer(*args, **kwargs)`** are `*`/`**` unpacking in real code. Building `query_dict` conditionally and spreading it is how a flexible filter endpoint is written.',
        hi: '**`Model.objects.filter(**query_dict)` aur `serializer(*args, **kwargs)`** asli code mein `*`/`**` unpacking hain. `query_dict` ko conditionally banaana aur ise failaana aise ek flexible filter endpoint likha jaata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between an iterable and an iterator, and why can you loop a list twice but not a generator?',
        qHi: 'Ek iterable aur ek iterator mein kya antar hai, aur aap ek list do baar loop kyun kar sakte ho par ek generator nahi?',
        a: 'An iterable is any object you can loop over — formally, an object that has a double-underscore iter method, which when called returns an iterator. Lists, tuples, strings, dictionaries, sets, ranges, and files are all iterables. An iterator is a more specific thing: it is an object that has a double-underscore next method, which returns the next value each time it is called and raises StopIteration when there are no more. An iterator also has a double-underscore iter method, but it just returns itself. A for loop works by calling iter on the thing you gave it to get an iterator, then repeatedly calling next on that iterator, catching StopIteration to know when to stop. The key distinction is that an iterator carries state — its current position — while a plain iterable like a list does not; the list just holds the data, and each time you ask it for an iterator it hands back a brand new one positioned at the start. That is why you can loop a list as many times as you like: every for statement creates a fresh iterator over the same unchanged data. A generator, on the other hand, is its own iterator. When you write a generator expression or call a generator function, you get back an object that both is the iterator and holds the position. Calling iter on it returns the same object, not a new one. So the first for loop over a generator advances it to the end, and a second for loop calls iter, gets the same already-exhausted generator, immediately gets StopIteration, and the loop body never runs. The same applies to zip, map, filter, and an open file being read — they are all one-shot iterators. If you need to iterate the results more than once, or take a length, or index, you convert the iterator to a list once and work with that.',
        aHi: 'Ek iterable koi bhi object hai jispar aap loop kar sakte ho — formally, ek object jismein ek double-underscore iter method hai, jo call hone par ek iterator lautaata hai. Lists, tuples, strings, dictionaries, sets, ranges, aur files sab iterables hain. Ek iterator ek zyaada vishisht cheez hai: ye ek object hai jismein ek double-underscore next method hai, jo har baar call hone par agli value lautaata hai aur jab aur nahi hoti to StopIteration deta hai. Ek for loop aapke diye cheez par iter call karke ek iterator paake, phir us iterator par baar-baar next call karke, StopIteration pakadke kab rukna hai jaanke kaam karta hai. Mukhya antar ye hai ki ek iterator state rakhta hai — iski current position — jabki ek plain iterable jaise ek list nahi. Yahi wajah hai ki aap ek list ko jitni baar chaaho loop kar sakte ho. Ek generator, doosri taraf, apna iterator hai. Toh ek generator par pehla for loop ise end tak aage badhaata hai, aur ek doosra for loop iter call karta hai, wahi pehle se exhausted generator paata hai, turant StopIteration paata hai.',
      },
      {
        q: 'When should the result of a comprehension be a generator expression instead of a list, and what does `*`/`**` do in a function call?',
        qHi: 'Ek comprehension ka result ek list ke bajaye ek generator expression kab hona chahiye, aur ek function call mein `*`/`**` kya karta hai?',
        a: 'The rule is: if the comprehension result feeds straight into a consumer that reads it once and produces a single answer, use a generator expression — round parentheses instead of square brackets. The canonical consumers are sum, any, all, min, max, the string join method, and a for loop. Writing sum of a list comprehension first allocates the entire list, then sums it and throws the list away; writing sum of a generator expression processes one element at a time with constant memory, and for any and all it also short-circuits, stopping at the first decisive element. You reach for a list comprehension instead when you need the collection itself: to iterate it more than once, to take its length, to index into it, or to hand it to something expecting a real sequence. As for star and double-star in a call: they are the spreading operators, the mirror image of collecting with star-args and double-star-kwargs in a function definition. A single star before an iterable in a call unpacks that iterable into separate positional arguments, so calling a function with star followed by a three-element list passes three arguments, not one list. A double star before a mapping unpacks it into keyword arguments, so double-star followed by a dict with keys w and h passes w equals and h equals. This is how you forward arguments — a wrapper function that takes star-args and double-star-kwargs and calls the wrapped function with star-args and double-star-kwargs passes everything through unchanged. It also works in literals: star inside a list or tuple display splices in another iterable\'s elements, and double-star inside a dict display splices in another dict\'s entries, which is the merge idiom. And print of star some-list prints the elements space-separated rather than printing the list\'s repr.',
        aHi: 'Niyam ye hai: agar comprehension result seedhe ek consumer mein feed hota hai jo ise ek baar padhta hai aur ek akela jawaab banaata hai, ek generator expression istemal karo — square brackets ke bajaye round parentheses. Canonical consumers sum, any, all, min, max, string join method, aur ek for loop hain. Ek list comprehension ka sum likhna pehle poori list allocate karta hai, phir sum karta hai aur list phenk deta hai; ek generator expression ka sum likhna ek baar mein ek element process karta hai constant memory ke saath, aur any aur all ke liye ye short-circuit bhi karta hai. Aap ek list comprehension ke liye tab pahunchte ho jab aapko collection khud chahiye. Ek call mein star aur double-star: wo spreading operators hain, ek function definition mein star-args aur double-star-kwargs se collect karne ki darpan chhavi. Ek call mein ek iterable se pehle ek akela star us iterable ko alag positional arguments mein unpack karta hai. Ek mapping se pehle ek double star ise keyword arguments mein unpack karta hai. Aise aap arguments forward karte ho.',
      },
    ],

    exercises: [
      {
        task: 'In the REPL, create `g = (x for x in range(3))`. Call `list(g)`, then `list(g)` again. Now do the same with `xs = [x for x in range(3)]`. Explain why the generator is empty the second time but the list is not.',
        taskHi: 'REPL mein, `g = (x for x in range(3))` banao. `list(g)` call karo, phir `list(g)` phir. Ab `xs = [x for x in range(3)]` ke saath wahi karo. Samjhaao generator doosri baar empty kyun hai par list nahi.',
        hint: '`g` IS the iterator; `list(g)` consumes it to the end. `xs` is a list; each `list(xs)` (and each `for`) creates a fresh iterator over the same stored data.',
        hintHi: '`g` HI iterator hai; `list(g)` ise end tak consume karta hai. `xs` ek list hai; har `list(xs)` (aur har `for`) usi stored data par ek naya iterator banaata hai.',
      },
      {
        task: 'Write `chunk(iterable, n)` that yields lists of up to `n` items from any iterable (including a generator). Use `iter()` and `next()` internally so it works on one-shot iterators. Test: `list(chunk(range(7), 3))` -> `[[0,1,2],[3,4,5],[6]]`.',
        taskHi: '`chunk(iterable, n)` likho jo kisi bhi iterable (ek generator sameet) se `n` tak items ki lists deta hai. `iter()` aur `next()` andar istemal karo taaki ye one-shot iterators par kaam kare. Test: `list(chunk(range(7), 3))` -> `[[0,1,2],[3,4,5],[6]]`.',
        hint: '`it = iter(iterable)`; loop: `batch = list(itertools.islice(it, n))`; `if not batch: return`; `yield batch`. Or manual: pull `n` with `next(it, SENTINEL)` and stop when you hit the sentinel.',
        hintHi: '`it = iter(iterable)`; loop: `batch = list(itertools.islice(it, n))`; `if not batch: return`; `yield batch`. Ya manual: `next(it, SENTINEL)` se `n` kheencho aur sentinel milne par ruko.',
      },
      {
        task: 'Given `headers = ["name", "age", "city"]` and `row = ["Al", 30, "NY"]`, build a dict with a comprehension over `zip(headers, row)`. Then given `rows = [["Bo", 25, "LA"], ["Cy", 35, "SF"]]`, build a list of such dicts. Finally, transpose `[[1,2,3],[4,5,6]]` with `list(zip(*matrix))`.',
        taskHi: '`headers = ["name", "age", "city"]` aur `row = ["Al", 30, "NY"]` diye, `zip(headers, row)` par ek comprehension se ek dict banao. Phir `rows = [["Bo", 25, "LA"], ["Cy", 35, "SF"]]` diye, aise dicts ki ek list banao. Ant mein, `[[1,2,3],[4,5,6]]` ko `list(zip(*matrix))` se transpose karo.',
        hint: '`{h: v for h, v in zip(headers, row)}` -> `{"name": "Al", "age": 30, "city": "NY"}`. For many rows: `[{h: v for h, v in zip(headers, r)} for r in rows]`. `zip(*matrix)` spreads the rows as separate arguments to `zip`, pairing column-wise.',
        hintHi: '`{h: v for h, v in zip(headers, row)}` -> `{"name": "Al", "age": 30, "city": "NY"}`. Kayi rows ke liye: `[{h: v for h, v in zip(headers, r)} for r in rows]`. `zip(*matrix)` rows ko `zip` ke alag arguments ki tarah failaata hai, column-wise pair karte hue.',
      },
    ],

    keyTakeaways: [
      'An ITERABLE is anything you can `for x in` over. An ITERATOR is an iterable that also tracks position — `next(it)` advances it, `StopIteration` ends a `for`.',
      'REUSABLE (list, tuple, str, dict, set, range): loop many times, `len`, indexing. ONE-SHOT (generator, `zip`, `map`, `filter`, open file): loop ONCE, no `len`, no index.',
      'Wrap a one-shot iterator in `list(...)` when you need to iterate it twice, take its length, or index it. Otherwise keep it lazy.',
      '`for x in obj` = `it = iter(obj)` then `next(it)` until `StopIteration`. A list makes a FRESH iterator each `for`; a generator IS its iterator (so it stays exhausted).',
      'Feed a generator expression (not a list comprehension) straight into `sum`/`any`/`all`/`max`/`min`/`join` — constant memory, and `any`/`all` short-circuit.',
      '`zip` stops at the SHORTEST input silently. Use `zip(..., strict=True)` (3.10+) to catch a length mismatch, or `itertools.zip_longest(..., fillvalue=...)` to pad.',
      '`f(*seq)` spreads a sequence into positional args; `f(**dict)` spreads a dict into keyword args. `[*a, *b]` and `{**d1, **d2}` splice into new literals. `print(*xs)` prints elements, not the list.',
      '`next((x for x in it if cond), default)` finds the first match without a manual loop. `min`/`max` take `key=` and `default=`.',
    ],
    keyTakeawaysHi: [
      'Ek ITERABLE koi bhi cheez hai jispar aap `for x in` kar sakte ho. Ek ITERATOR ek iterable hai jo position bhi track karta hai — `next(it)` ise aage badhaata hai, `StopIteration` ek `for` khatam karta hai.',
      'REUSABLE (list, tuple, str, dict, set, range): kayi baar loop, `len`, indexing. ONE-SHOT (generator, `zip`, `map`, `filter`, open file): EK baar loop, koi `len` nahi, koi index nahi.',
      'Ek one-shot iterator ko `list(...)` mein wrap karo jab aapko ise do baar iterate karna hai, iski length leni hai, ya ise index karna hai. Warna ise lazy rakho.',
      '`for x in obj` = `it = iter(obj)` phir `next(it)` jab tak `StopIteration`. Ek list har `for` par ek NAYA iterator banaati hai; ek generator apna iterator HAI (isliye wo exhausted rehta hai).',
      'Ek generator expression (list comprehension nahi) seedhe `sum`/`any`/`all`/`max`/`min`/`join` mein feed karo — constant memory, aur `any`/`all` short-circuit karte hain.',
      '`zip` sabse CHHOTE input par chupchaap rukta hai. Ek length mismatch pakadne ko `zip(..., strict=True)` (3.10+) istemal karo, ya pad karne ko `itertools.zip_longest(..., fillvalue=...)`.',
      '`f(*seq)` ek sequence ko positional args mein failaata hai; `f(**dict)` ek dict ko keyword args mein failaata hai. `[*a, *b]` aur `{**d1, **d2}` naye literals mein splice karte hain. `print(*xs)` elements print karta hai, list nahi.',
      '`next((x for x in it if cond), default)` ek manual loop ke bina pehla match dhoondhta hai. `min`/`max` `key=` aur `default=` lete hain.',
    ],
  },
];
