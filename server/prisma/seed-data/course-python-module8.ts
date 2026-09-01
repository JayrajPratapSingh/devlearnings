/**
 * Python Complete Course — Module 8: Iterators, Generators & Functional Tools,
 * lessons 1-3.
 *
 * Lesson 1: the iterator protocol — iterable vs iterator, `__iter__` /
 *           `__next__` / `StopIteration`, `iter()` / `next()`, what `for`
 *           really does, and why an iterator is single-use (exhaustion).
 * Lesson 2: generators — `yield`, generator functions vs generator
 *           expressions, suspended state, laziness / memory, `yield from`.
 * Lesson 3: `itertools` — `count`/`cycle`/`repeat`, `chain`/`islice`/
 *           `takewhile`/`dropwhile`, `groupby` (needs pre-sorted input!),
 *           `product`/`permutations`/`combinations`, `accumulate`, `pairwise`,
 *           `zip_longest`, `batched`.
 *
 * NOTE for future editors: same rules as the rest of this course. Every
 * backtick inside simple/simpleHi/content/contentHi is `\`` (inline code inside
 * ``` blocks included). Escape `$` before `{` inside template literals as `\${`.
 * Keep example OUTPUT ASCII-only. `examples` use `code` + `output`; run every
 * sample with `python` and paste the REAL output. Scan for Devanagari/Cyrillic.
 * `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_8: CourseLesson[] = [
  {
    slug: 'py-iterator-protocol',
    title: 'The Iterator Protocol: iter, next, and Single-Use Iterators',
    titleHi: 'Iterator Protocol: iter, next, Aur Single-Use Iterators',
    description: 'Looping over `zip(a, b)` once to build a dict and then again to build a list, and finding the second loop produces nothing — because `zip` returns an iterator that is consumed the first time through. Every `for` loop is built on two small methods, and understanding them explains why some things can be looped once and others many times.',
    descriptionHi: 'Ek dict banane ko `zip(a, b)` par ek baar loop karna aur phir ek list banane ko dobara, aur paana ki doosra loop kuch nahi banaता — kyunki `zip` ek iterator lautaता hai jo pehli baar mein consume ho jaता hai. Har `for` loop do chhoti methods par bana hai, aur unhe samajhna samjhaता hai ki kuch cheezein ek baar loop kyun ho sakti hain aur doosri kai baar.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A book versus a bookmark walking through it.** A list is a book: it holds all its pages, and any number of readers can each start at page one whenever they like. An iterator is a bookmark that a single reader is moving through the book — it has one position, it only goes forward, and when it reaches the last page it stops and refuses to move again. Asking the book "give me a fresh bookmark" (`iter(book)`) hands you a new one at page one. Asking the bookmark "give me a fresh bookmark" hands you back the *same* bookmark at its current position, because a bookmark is already the thing that tracks progress. `for page in book` quietly asks the book for a bookmark and then repeatedly asks that bookmark for the next page until it stops. This is why you can loop over a list twice — each loop gets its own new bookmark — but looping over `zip(...)` or a generator twice gives nothing the second time: those *are* bookmarks, already used up, with no book behind them to hand out a fresh one.',
      hi: '**Ek book versus ek bookmark uske through chalta hua.** Ek list ek book hai: ye apne saare pages rakhती hai, aur kitne bhi readers har ek jab chahें page ek se shuru kar sakte hain. Ek iterator ek bookmark hai jise ek akela reader book ke through move kar raha hai — iski ek position hai, ye sirf aage jaता hai, aur jab ye aakhri page tak pahunchता hai ye ruकता hai aur phir move karne se mana kar deता hai. Book ko "mujhe ek fresh bookmark do" (`iter(book)`) poochhना aapko page ek par ek naya deता hai. Bookmark ko "mujhe ek fresh bookmark do" poochhना aapko *wahi* bookmark iski current position par wapas deता hai. `for page in book` chupchaap book se ek bookmark maangता hai aur phir baar-baar us bookmark se agla page maangता hai jab tak ye ruके nahi. Isliye aap ek list par do baar loop kar sakte ho — par `zip(...)` par do baar loop karna doosri baar kuch nahi deता.',
    },

    simple: `**Iterable vs iterator**

\`\`\`python
nums = [1, 2, 3]                 # an ITERABLE -- can produce an iterator on demand

it = iter(nums)                  # get an ITERATOR from the iterable
next(it)                         # 1
next(it)                         # 2
next(it)                         # 3
next(it)                         # StopIteration  -- exhausted

iter(nums)                       # a BRAND-NEW iterator, back at the start
\`\`\`

**What \`for\` actually does**

\`\`\`python
for x in nums:
    print(x)

# is exactly:
_it = iter(nums)
while True:
    try:
        x = next(_it)
    except StopIteration:
        break
    print(x)
\`\`\`

**Iterators are single-use — this is the trap**

\`\`\`python
pairs = zip([1, 2, 3], ["a", "b", "c"])   # zip returns an ITERATOR

d = dict(pairs)                            # consumes it fully -> {1: 'a', 2: 'b', 3: 'c'}
lst = list(pairs)                          # []  -- nothing left!

# same for map, filter, generators, enumerate, reversed, csv.reader, file objects:
squares = map(lambda n: n*n, [1, 2, 3])
list(squares)                             # [1, 4, 9]
list(squares)                             # []  -- exhausted
\`\`\`

**Making your own iterable**

\`\`\`python
class Countdown:
    def __init__(self, n):
        self.n = n
    def __iter__(self):                   # return a FRESH iterator each call
        current = self.n
        while current > 0:
            yield current
            current -= 1

list(Countdown(3))                         # [3, 2, 1]
list(Countdown(3))                         # [3, 2, 1]  -- reusable, __iter__ makes a new one
\`\`\`

\`\`\`
ITERABLE   an object you can get an iterator from: has __iter__(). Examples:
           list, tuple, str, dict, set, range, a file, your own class with __iter__.
           Most iterables produce a FRESH iterator each time -> reusable in many loops.

ITERATOR   an object that produces values one at a time: has __next__() AND __iter__()
           (which returns self). next(it) -> the next value, or raises StopIteration.
           An iterator is SINGLE-USE. Once exhausted it stays exhausted.
           zip, map, filter, enumerate, reversed, generators, csv.reader, open() files.

for x in obj:   _it = iter(obj);  loop { x = next(_it) } until StopIteration
iter(obj)       calls obj.__iter__()
next(it)        calls it.__next__()
next(it, default)   returns default instead of raising StopIteration
iter(callable, sentinel)   call callable() until it returns sentinel

To make a class iterable: define __iter__ returning a fresh iterator (often a
generator method -- see next lesson). An iterator also defines __iter__ returning self.
\`\`\``,

    simpleHi: `**Iterable vs iterator**

\`\`\`python
nums = [1, 2, 3]                 # ek ITERABLE -- maang par ek iterator bana sakta hai

it = iter(nums)                  # iterable se ek ITERATOR lo
next(it)                         # 1
next(it)                         # 2
next(it)                         # 3
next(it)                         # StopIteration  -- khatam

iter(nums)                       # ek BILKUL-NAYA iterator, wapas shuruaat par
\`\`\`

**\`for\` asal mein kya karता hai**

\`\`\`python
for x in nums:
    print(x)

# bilkul ye hai:
_it = iter(nums)
while True:
    try:
        x = next(_it)
    except StopIteration:
        break
    print(x)
\`\`\`

**Iterators single-use hain — ye jaal hai**

\`\`\`python
pairs = zip([1, 2, 3], ["a", "b", "c"])   # zip ek ITERATOR lautaता hai

d = dict(pairs)                            # ise poori tarah consume -> {1: 'a', 2: 'b', 3: 'c'}
lst = list(pairs)                          # []  -- kuch nahi bacha!

squares = map(lambda n: n*n, [1, 2, 3])
list(squares)                             # [1, 4, 9]
list(squares)                             # []  -- khatam
\`\`\`

**Apna khud ka iterable banana**

\`\`\`python
class Countdown:
    def __init__(self, n):
        self.n = n
    def __iter__(self):                   # har call ek FRESH iterator
        current = self.n
        while current > 0:
            yield current
            current -= 1

list(Countdown(3))                         # [3, 2, 1]
list(Countdown(3))                         # [3, 2, 1]  -- reusable
\`\`\`

\`\`\`
ITERABLE   ek object jisse aap ek iterator le sakte ho: __iter__() hai. Udaharan:
           list, tuple, str, dict, set, range, ek file, __iter__ waali aapki class.
           Adhikaansh iterables har baar ek FRESH iterator banaते hain -> reusable.

ITERATOR   ek object jo values ek-ek karके banाता hai: __next__() AUR __iter__() hai
           (jo self lautaता hai). next(it) -> agli value, ya StopIteration raise.
           Ek iterator SINGLE-USE hai. Ek baar khatam to khatam.
           zip, map, filter, enumerate, reversed, generators, csv.reader, open() files.

for x in obj:   _it = iter(obj);  loop { x = next(_it) } until StopIteration
iter(obj)       obj.__iter__() call karता hai
next(it)        it.__next__() call karता hai
next(it, default)   StopIteration raise karne ke bجاय default lautaता hai
iter(callable, sentinel)   callable() ko call karो jab tak ye sentinel na lautae
\`\`\``,

    content: `## Iterable vs iterator, precisely

- An **iterable** is anything you can call \`iter()\` on to get an iterator. It implements \`__iter__()\` (or, for backward compatibility, \`__getitem__()\` with integer indices from 0).
- An **iterator** is an object with \`__next__()\` that returns successive values and raises \`StopIteration\` when done. By convention it also implements \`__iter__()\` returning \`self\`, so an iterator is itself an iterable — which is why \`for x in my_iterator\` works.

\`\`\`python
from collections.abc import Iterable, Iterator

isinstance([1, 2, 3], Iterable)      # True
isinstance([1, 2, 3], Iterator)      # False -- a list is not its own iterator
it = iter([1, 2, 3])
isinstance(it, Iterator)             # True
iter(it) is it                       # True -- iter() on an iterator returns itself
\`\`\`

## The consequence: reusable vs single-use

\`\`\`python
data = [1, 2, 3]
sum(data)      # 6
sum(data)      # 6   -- a list is reusable; each sum() gets a fresh iterator

gen = (x for x in [1, 2, 3])
sum(gen)       # 6
sum(gen)       # 0   -- the generator is an iterator; the first sum() exhausted it
\`\`\`

Anything from \`zip\`, \`map\`, \`filter\`, \`enumerate\`, \`reversed\`, a generator expression, a generator function, \`csv.reader\`, \`os.scandir\`, or an open file object is a **single-use iterator**. If you need to iterate it more than once, materialise it first: \`items = list(the_iterator)\`.

## Partial consumption

\`\`\`python
it = iter(range(10))
first_three = [next(it) for _ in range(3)]   # [0, 1, 2]
rest = list(it)                              # [3, 4, 5, 6, 7, 8, 9] -- continues from 3

# a header line, then the rest:
lines = iter(open("data.csv"))
header = next(lines)
for row in lines:                            # picks up after the header
    ...
\`\`\`

Because an iterator remembers its position, you can take some values one way and the remainder another. This is a common pattern for headers, first-N, and peeking.

## \`next(it, default)\` and \`iter(callable, sentinel)\`

\`\`\`python
it = iter([1])
next(it)            # 1
next(it, None)      # None instead of StopIteration
next(it, "end")     # 'end'

# read fixed-size chunks until EOF (b'' is the sentinel):
with open("big.bin", "rb") as f:
    for chunk in iter(lambda: f.read(8192), b""):
        process(chunk)
\`\`\`

## Making a class iterable — the idiomatic way

\`\`\`python
class Deck:
    def __init__(self, cards):
        self._cards = list(cards)
    def __iter__(self):
        return iter(self._cards)          # delegate to the list's iterator -- reusable

class Fibonacci:
    def __init__(self, limit):
        self.limit = limit
    def __iter__(self):                   # a generator method -> fresh iterator each call
        a, b = 0, 1
        while a < self.limit:
            yield a
            a, b = b, a + b

list(Fibonacci(20))     # [0, 1, 1, 2, 3, 5, 8, 13]
list(Fibonacci(20))     # [0, 1, 1, 2, 3, 5, 8, 13]  -- __iter__ runs again -> new generator
\`\`\`

Define \`__iter__\` to return a *fresh* iterator (delegating to a list, or a generator method). Only write an explicit \`__next__\` class when you genuinely need the iterator as a separate, stateful object.

## Common mistakes with iterators

\`\`\`python
len(map(str, [1, 2, 3]))       # TypeError: object of type 'map' has no len()
zip([1], [2])[0]               # TypeError: 'zip' object is not subscriptable

it = iter([1, 2, 3])
2 in it                        # True  -- but now it is positioned AFTER 2
list(it)                       # [3]   -- 1 and 2 are gone
\`\`\`

To use an iterator's result as a list, index it, or measure it, convert first: \`list(it)\`.`,

    contentHi: `## Iterable vs iterator, thik-thik

- Ek **iterable** kuch bhi hai jispar aap iterator paने ko \`iter()\` call kar sakte ho. Ye \`__iter__()\` implement karता hai.
- Ek **iterator** ek object hai \`__next__()\` ke saath jo lagataar values lautaता hai aur khatam hone par \`StopIteration\` raise karता hai. Convention se ye \`__iter__()\` bhi implement karता hai jo \`self\` lautaता hai.

\`\`\`python
from collections.abc import Iterable, Iterator

isinstance([1, 2, 3], Iterable)      # True
isinstance([1, 2, 3], Iterator)      # False -- ek list apna iterator nahi hai
it = iter([1, 2, 3])
isinstance(it, Iterator)             # True
iter(it) is it                       # True -- ek iterator par iter() khud ko lautaता hai
\`\`\`

## Parinaam: reusable vs single-use

\`\`\`python
data = [1, 2, 3]
sum(data)      # 6
sum(data)      # 6   -- ek list reusable hai

gen = (x for x in [1, 2, 3])
sum(gen)       # 6
sum(gen)       # 0   -- generator ek iterator hai; pehle sum() ne ise khatam kiya
\`\`\`

\`zip\`, \`map\`, \`filter\`, \`enumerate\`, \`reversed\`, ek generator expression, ek generator function, \`csv.reader\`, \`os.scandir\`, ya ek open file object se kuch bhi ek **single-use iterator** hai. Agar aapko ise ek se zyaada baar iterate karna hai, pehle materialise karो: \`items = list(the_iterator)\`.

## Aanshik consumption

\`\`\`python
it = iter(range(10))
first_three = [next(it) for _ in range(3)]   # [0, 1, 2]
rest = list(it)                              # [3, 4, 5, 6, 7, 8, 9] -- 3 se jaari
\`\`\`

## \`next(it, default)\` aur \`iter(callable, sentinel)\`

\`\`\`python
it = iter([1])
next(it)            # 1
next(it, None)      # None StopIteration ke bجاय

with open("big.bin", "rb") as f:
    for chunk in iter(lambda: f.read(8192), b""):
        process(chunk)
\`\`\`

## Ek class ko iterable banana — idiomatic tarika

\`\`\`python
class Deck:
    def __init__(self, cards):
        self._cards = list(cards)
    def __iter__(self):
        return iter(self._cards)          # list ke iterator ko delegate -- reusable

class Fibonacci:
    def __init__(self, limit):
        self.limit = limit
    def __iter__(self):                   # ek generator method -> har call fresh iterator
        a, b = 0, 1
        while a < self.limit:
            yield a
            a, b = b, a + b

list(Fibonacci(20))     # [0, 1, 1, 2, 3, 5, 8, 13]
list(Fibonacci(20))     # wahi -- __iter__ dobara chalता hai -> naya generator
\`\`\`

\`__iter__\` ko ek *fresh* iterator lautaने ke liye define karो. Ek explicit \`__next__\` class sirf tab likhो jab aapko iterator ek alag, stateful object ki tarah sachmuch chahiye.

## Iterators ke saath aam galtiyan

\`\`\`python
len(map(str, [1, 2, 3]))       # TypeError: object of type 'map' has no len()
zip([1], [2])[0]               # TypeError: 'zip' object is not subscriptable

it = iter([1, 2, 3])
2 in it                        # True  -- par ab ye 2 ke BAAD positioned hai
list(it)                       # [3]   -- 1 aur 2 gaye
\`\`\`

Ek iterator ke result ko list ki tarah istemal, index, ya maapने ko, pehle convert karो: \`list(it)\`.`,

    examples: [
      {
        title: 'iter/next, StopIteration, and what for does',
        titleHi: 'iter/next, StopIteration, aur for kya karता hai',
        code: `nums = [10, 20, 30]

it = iter(nums)
print(next(it), next(it), next(it))
try:
    next(it)
except StopIteration:
    print("exhausted")

it2 = iter(nums)
print([next(it2, "-") for _ in range(5)])   # 3 values then two defaults

def my_for(iterable, fn):
    it = iter(iterable)
    while True:
        try:
            x = next(it)
        except StopIteration:
            return
        fn(x)

my_for("abc", lambda c: print("char:", c))

print(iter(nums) is iter(nums))      # False -- two fresh iterators
i = iter(nums)
print(iter(i) is i)                  # True  -- an iterator is its own iterator`,
        output: `10 20 30
exhausted
[10, 20, 30, '-', '-']
char: a
char: b
char: c
False
True`,
        explain: '`iter(nums)` produces an iterator; `next(it)` advances it; a 4th `next` raises `StopIteration`. `next(it2, "-")` returns the default instead of raising, so the comprehension yields 3 real values then 2 dashes. `my_for` is the exact desugaring of a `for` loop. `iter(nums) is iter(nums)` is `False` (two independent iterators from the list), but `iter(i) is i` is `True` (an iterator returns itself).',
        explainHi: '`iter(nums)` ek iterator banaता hai; `next(it)` ise aage badhaता hai; ek 4th `next` `StopIteration` raise karता hai. `next(it2, "-")` raise karne ke bجaay default lautaता hai. `my_for` ek `for` loop ka exact desugaring hai. `iter(nums) is iter(nums)` `False` hai, par `iter(i) is i` `True` hai.',
      },
      {
        title: 'Single-use: the zip/map exhaustion trap',
        titleHi: 'Single-use: zip/map khatam hone ka jaal',
        code: `keys = ["a", "b", "c"]
vals = [1, 2, 3]

z = zip(keys, vals)
as_dict = dict(z)
as_list = list(z)
print("dict:", as_dict)
print("list (already consumed):", as_list)

pairs = list(zip(keys, vals))
print("from pairs -> dict:", dict(pairs))
print("from pairs -> list:", pairs)

squares = (n * n for n in range(5))
print("sum:", sum(squares))
print("sum again:", sum(squares))       # 0 -- exhausted

doubled = map(lambda n: n * 2, [1, 2, 3])
print("max:", max(doubled))
print("list after max:", list(doubled))  # [] -- max() consumed it`,
        output: `dict: {'a': 1, 'b': 2, 'c': 3}
list (already consumed): []
from pairs -> dict: {'a': 1, 'b': 2, 'c': 3}
from pairs -> list: [('a', 1), ('b', 2), ('c', 3)]
sum: 30
sum again: 0
max: 6
list after max: []`,
        explain: '`zip(keys, vals)` is an iterator. `dict(z)` walks it to the end; `list(z)` then finds nothing. The fix is `pairs = list(zip(...))` — a real list you can reuse. The same applies to a generator expression (`sum` twice: 30 then 0) and to `map` (`max` returns 6, then `list` finds `[]`). Rule: if you will iterate a lazy object more than once, convert it to a list first.',
        explainHi: '`zip(keys, vals)` ek iterator hai. `dict(z)` ise ant tak chalता hai; `list(z)` phir kuch nahi paता. Fix `pairs = list(zip(...))` hai. Wahi ek generator expression aur `map` par lागू hota hai.',
      },
      {
        title: 'A reusable iterable class via __iter__ (generator method)',
        titleHi: 'Ek reusable iterable class __iter__ ke zariye',
        code: `from collections.abc import Iterator

class DateRange:
    """Yields date strings from day start to day end (inclusive), reusable."""
    def __init__(self, start, end):
        self.start, self.end = start, end
    def __iter__(self):
        day = self.start
        while day <= self.end:
            yield f"2026-08-{day:02d}"
            day += 1

week = DateRange(1, 5)
print("first pass: ", list(week))
print("second pass:", list(week))
print("count:", sum(1 for _ in week))
print("has 03:", any(d.endswith("03") for d in week))
print("week is iterator:", isinstance(week, Iterator))
print("iter(week) is iterator:", isinstance(iter(week), Iterator))`,
        output: `first pass:  ['2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04', '2026-08-05']
second pass: ['2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04', '2026-08-05']
count: 5
has 03: True
week is iterator: False
iter(week) is iterator: True`,
        explain: '`DateRange.__iter__` is a generator method: every `iter(week)` call runs it afresh, producing a new independent generator. So `list(week)` works twice, and every iterable-consuming function (`sum`, `any`, `for`) gets its own pass. `DateRange` itself is an *iterable* (not an *iterator*) — `isinstance(week, Iterator)` is `False` — but `iter(week)` is an iterator.',
        explainHi: '`DateRange.__iter__` ek generator method hai: har `iter(week)` call ise naya chalाता hai. Isliye `list(week)` do baar kaam karता hai, aur har iterable-consuming function ko apna pass milता hai. `DateRange` khud ek *iterable* hai (*iterator* nahi).',
      },
    ],

    mistakes: [
      {
        wrong: `results = filter(is_valid, records)
print(f"found {len(results)} valid records")   # TypeError: filter has no len()`,
        right: `results = list(filter(is_valid, records))
print(f"found {len(results)} valid records")
for r in results: ...                          # works -- results is a real list`,
        why: '`filter`, `map`, `zip`, `enumerate`, and generators are lazy iterators with no length and no indexing. If you need `len()`, `[i]`, or to iterate more than once, wrap the call in `list(...)`. Leave it lazy only when you consume it exactly once (a single `for` or a single `sum`/`any`/`max`).',
        whyHi: '`filter`, `map`, `zip`, `enumerate`, aur generators lazy iterators hain bina length aur bina indexing. Agar aapko `len()`, `[i]`, ya ek se zyaada baar iterate karna hai, call ko `list(...)` mein wrap karो.',
      },
      {
        wrong: `data = (line.strip() for line in open("f.txt"))
if "" in data:                     # consumes part of the generator
    print("has blank lines")
for line in data:                  # starts AFTER wherever 'in' stopped
    process(line)`,
        right: `data = [line.strip() for line in open("f.txt")]   # a list -- reusable
if "" in data:
    print("has blank lines")
for line in data:
    process(line)`,
        why: 'Membership testing (`x in it`) on an iterator consumes items until it finds a match (or exhausts it). The subsequent `for` then starts from wherever `in` left off, silently skipping data. Either materialise to a list, or restructure so you only pass over the iterator once.',
        whyHi: 'Ek iterator par membership testing (`x in it`) items consume karता hai jab tak match na mile. Baad ka `for` phir wahaan se shuru hota hai jahaan `in` chhoda. Ya ek list mein materialise karो.',
      },
      {
        wrong: `class Bag:
    def __init__(self, items):
        self.items = items
        self._i = 0
    def __iter__(self):
        return self               # returns the SAME stateful object
    def __next__(self):
        if self._i >= len(self.items):
            raise StopIteration
        v = self.items[self._i]; self._i += 1
        return v
# looping over a Bag twice yields nothing the second time`,
        right: `class Bag:
    def __init__(self, items):
        self.items = items
    def __iter__(self):
        return iter(self.items)    # a FRESH iterator each call -> reusable`,
        why: 'If `__iter__` returns `self` and the object holds the position (`self._i`), the object *is* a one-shot iterator — the second `for` loop finds `_i` already at the end. Unless you specifically want single-use semantics, have `__iter__` return a new iterator (delegate to a list, or make `__iter__` a generator).',
        whyHi: 'Agar `__iter__` `self` lautaता hai aur object position rakhता hai, object *ek* one-shot iterator hai. Jab tak aap vishesh roop se single-use semantics nahi chahте, `__iter__` ko ek naya iterator lautaने do.',
      },
    ],

    realWorld: [
      {
        en: '**Django QuerySets are lazy and cache their results** — the first iteration hits the DB and stores the rows, so a second `for` reuses the cache (no second query). But `.iterator()` gives a true one-shot iterator that does NOT cache, for streaming huge result sets without loading them all into memory.',
        hi: '**Django QuerySets lazy hain aur apne results cache karते hain** — pehli iteration DB hit karती hai aur rows store karती hai. Par `.iterator()` ek asli one-shot iterator deता hai jo cache NAHI karता.',
      },
      {
        en: '**File objects, `csv.reader`, `json` streaming parsers, and `requests` `iter_lines()`/`iter_content()` are all single-use iterators** — reading a file to the end and then trying to iterate again gives nothing until you `seek(0)`. This is the source of many "my second loop is empty" bugs.',
        hi: '**File objects, `csv.reader`, aur `requests` `iter_lines()`/`iter_content()` sab single-use iterators hain** — ek file ko ant tak padhना aur phir dobara iterate karne ki koshish kuch nahi deती jab tak aap `seek(0)` na karें.',
      },
      {
        en: '**`iter(callable, sentinel)` is the clean way to read until a terminator** — `iter(lambda: f.read(4096), b"")` for chunked file reads, `iter(input, "quit")` for a REPL loop, `iter(queue.get, None)` for a worker that stops on a sentinel value.',
        hi: '**`iter(callable, sentinel)` ek terminator tak padhने ka saaf tarika hai** — chunked file reads ke liye `iter(lambda: f.read(4096), b"")`, ek REPL loop ke liye `iter(input, "quit")`.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between an iterable and an iterator, and what does a `for` loop do under the hood?',
        qHi: 'Ek iterable aur ek iterator mein kya antar hai, aur ek `for` loop andar kya karता hai?',
        a: 'An iterable is any object you can obtain an iterator from — it implements a dunder-iter method that returns an iterator, or, for older-style objects, a dunder-getitem method taking integer indices starting at zero. Lists, tuples, strings, dicts, sets, ranges, files, and any class you give a dunder-iter to are iterables. An iterator is the object that actually produces the values: it implements dunder-next, which returns the next value each time it is called and raises StopIteration when there are no more. By convention an iterator also implements dunder-iter, returning itself, which is why you can pass an iterator directly to a for loop. The crucial distinction is reusability. Most iterables — a list, say — produce a brand-new iterator every time you call iter on them, so you can loop over the same list any number of times, each loop getting its own fresh iterator starting at the beginning. An iterator, on the other hand, has a single internal position and only moves forward; once it has yielded its last value and raised StopIteration, it stays exhausted forever, and calling iter on it just gives you back the same object at its current position. A for loop desugars to exactly this: it calls iter on the object you gave it to get an iterator, then repeatedly calls next on that iterator inside an implicit try, assigning each result to the loop variable and running the body, and it stops cleanly when next raises StopIteration. The practical upshot is that things which are themselves iterators — the results of zip, map, filter, enumerate, reversed, generator expressions, generator functions, csv dot reader, open files — can only be looped once. If you need a second pass, you materialise them into a list first.',
        aHi: 'Ek iterable koi bhi object hai jisse aap ek iterator paa sakte ho — ye ek dunder-iter method implement karता hai jo ek iterator lautaता hai. Ek iterator wo object hai jo asal mein values banाता hai: ye dunder-next implement karता hai, jo har baar call hone par agli value lautaता hai aur jab aur nahi hoti to StopIteration raise karता hai. Convention se ek iterator dunder-iter bhi implement karता hai, khud ko lautाते hue. Mahatvapurna antar reusability hai. Adhikaansh iterables har baar jab aap unpar iter call karते ho ek bilkul-naya iterator banाते hain. Ek iterator ki ek akeli internal position hai aur sirf aage jाता hai; ek baar khatam to hamesha ke liye khatam. Ek for loop bilkul isi mein desugar hota hai. Vyavhaarik nateeja ye hai ki wo cheezein jo khud iterators hain sirf ek baar loop ho sakti hain.',
      },
      {
        q: 'You loop over `zip(a, b)` to build a dict and then again to build a list, but the list is empty. Why, and how do you fix it?',
        qHi: 'Aap ek dict banane ko `zip(a, b)` par loop karते ho aur phir ek list banane ko dobara, par list khaali hai. Kyun, aur aap ise kaise theek karते ho?',
        a: 'zip returns an iterator, not a list or any reusable collection. When you pass it to dict, dict walks that iterator all the way to the end, pulling every pair out to build the dictionary. At that point the iterator is exhausted — its internal position is past the last element and it will raise StopIteration on the next call to next. When you then pass the same zip object to list, list also tries to walk it, immediately gets StopIteration, and produces an empty list. The same thing happens with any of the lazy iterator-returning builtins and with generators: the first thing that consumes it — a for loop, sum, max, dict, list, join, set — drains it, and everything after sees nothing. The fix is to materialise the iterator once into a concrete list and then reuse that list: pairs equals list of zip of a and b, then build the dict from pairs and the list from pairs. A list is a proper iterable that hands out a fresh iterator on each iteration, so you can pass it to as many consumers as you like. The only time it is correct to leave a zip or map or generator lazy is when you consume it exactly once. If there is any chance of a second pass, or you need its length, or you need to index into it, convert it to a list up front. The cost is holding all the items in memory at once, which is usually fine and only matters for very large or infinite sequences, where you would instead restructure the code to make a single pass.',
        aHi: 'zip ek iterator lautaता hai, ek list ya koi reusable collection nahi. Jab aap ise dict ko pass karते ho, dict us iterator ko poori tarah ant tak chalता hai, har pair nikालते hue. Us bindu par iterator khatam hai. Jab aap phir usi zip object ko list ko pass karते ho, list bhi ise chalाने ki koshish karता hai, turant StopIteration paता hai, aur ek khaali list banाता hai. Wahi cheez kisi bhi lazy iterator-returning builtin aur generators ke saath hoती hai. Fix iterator ko ek baar ek concrete list mein materialise karna hai aur phir us list ko reuse karna. Ek zip ya map ya generator ko lazy chhodना sirf tab sahi hai jab aap ise bilkul ek baar consume karते ho.',
      },
    ],

    exercises: [
      {
        task: 'Write `take(n, iterable)` returning the first `n` items as a list, and `drop(n, iterable)` returning an iterator positioned after the first `n`. Use `iter()` and `next()` (not slicing). Test: from `it = iter(range(10))`, `take(3, it)` -> `[0,1,2]` and then `list(drop(0, it))` -> `[3,4,5,6,7,8,9]`.',
        taskHi: '`take(n, iterable)` likhо jo pehle `n` items ek list ki tarah lautае, aur `drop(n, iterable)` jo pehle `n` ke baad positioned ek iterator lautае. `iter()` aur `next()` istemal karो.',
        hint: '`take`: `it = iter(iterable); return [next(it) for _ in range(n)]`. `drop`: `it = iter(iterable); for _ in range(n): next(it, None); return it`. Because an iterator remembers position, `take` then `drop(0)` on the same `it` continues where `take` stopped.',
        hintHi: '`take`: `it = iter(iterable); return [next(it) for _ in range(n)]`. `drop`: `it = iter(iterable); for _ in range(n): next(it, None); return it`.',
      },
      {
        task: 'Write an iterable class `Grid(rows, cols)` whose `__iter__` yields `(r, c)` tuples for every cell, row-major. Confirm it is reusable: `g = Grid(2, 3); list(g)` twice gives the same 6 tuples, and `sum(1 for _ in g)` gives 6. Then confirm `isinstance(g, Iterator)` is `False` but `isinstance(iter(g), Iterator)` is `True`.',
        taskHi: 'Ek iterable class `Grid(rows, cols)` likhо jiska `__iter__` har cell ke liye `(r, c)` tuples yield kare, row-major. Confirm karो ye reusable hai.',
        hint: '`def __iter__(self): for r in range(self.rows): for c in range(self.cols): yield (r, c)`. Because `__iter__` is a generator method, each call produces a fresh generator, so the class is a reusable iterable but not itself an iterator.',
        hintHi: '`def __iter__(self): for r in range(self.rows): for c in range(self.cols): yield (r, c)`. Kyunki `__iter__` ek generator method hai, har call ek fresh generator banाता hai.',
      },
      {
        task: 'Demonstrate the exhaustion trap and its fix: given `a = [1,2,3,4]`, `b = [10,20,30,40]`, build BOTH `dict(zip(a, b))` and `[x + y for x, y in zip(a, b)]` from ONE `zip` object (show the second is broken), then from a materialised `pairs = list(zip(a, b))` (show both work).',
        taskHi: 'Exhaustion jaal aur iska fix dikhाओ: `a = [1,2,3,4]`, `b = [10,20,30,40]` diya, EK `zip` object se DONO banाओ (dikhाओ doosra toota hai), phir ek materialised `pairs` se (dikhाओ dono kaam karते hain).',
        hint: '`z = zip(a, b); d = dict(z); sums = [x+y for x,y in z]` -> `sums` is `[]`. `pairs = list(zip(a, b)); dict(pairs)` and `[x+y for x,y in pairs]` both work because `pairs` is a real list that yields a fresh iterator each time.',
        hintHi: '`z = zip(a, b); d = dict(z); sums = [x+y for x,y in z]` -> `sums` `[]` hai. `pairs = list(zip(a, b))` se dono kaam karते hain.',
      },
    ],

    keyTakeaways: [
      'An ITERABLE has `__iter__()` and produces a FRESH iterator each call (list, str, dict, range, your class with `__iter__`) — reusable in many loops.',
      'An ITERATOR has `__next__()` (returns next value / raises `StopIteration`) AND `__iter__()` returning `self`. It is SINGLE-USE — once exhausted, it stays exhausted.',
      '`zip`, `map`, `filter`, `enumerate`, `reversed`, generator expressions, generator functions, `csv.reader`, open files, `os.scandir` are all single-use iterators.',
      '`for x in obj` = `it = iter(obj); loop: x = next(it) until StopIteration`. That is the entire mechanism.',
      'The exhaustion trap: consuming a lazy iterator once (a `for`, `sum`, `max`, `dict`, `list`, `in`, `join`) drains it — a second pass yields nothing. Fix: `items = list(the_iterator)` once, then reuse.',
      'You cannot `len()`, index (`it[0]`), or slice an iterator. `x in it` consumes items up to the match. Convert to a list first for any of these.',
      'An iterator remembers its position, so you can `next(it)` a few times then `for`/`list(it)` the rest (headers, first-N, peeking).',
      'To make a class iterable, define `__iter__` returning a fresh iterator — usually by delegating (`return iter(self._items)`) or as a generator method (`yield ...`). Only write an explicit `__next__` class when you truly need a separate stateful iterator.',
    ],
    keyTakeawaysHi: [
      'Ek ITERABLE mein `__iter__()` hai aur har call ek FRESH iterator banाता hai (list, str, dict, range, `__iter__` waali aapki class) — kai loops mein reusable.',
      'Ek ITERATOR mein `__next__()` hai (agli value lautaता / `StopIteration` raise) AUR `__iter__()` jo `self` lautaता hai. Ye SINGLE-USE hai — ek baar khatam, hamesha khatam.',
      '`zip`, `map`, `filter`, `enumerate`, `reversed`, generator expressions, generator functions, `csv.reader`, open files sab single-use iterators hain.',
      '`for x in obj` = `it = iter(obj); loop: x = next(it) until StopIteration`. Ye poora tantr hai.',
      'Exhaustion jaal: ek lazy iterator ko ek baar consume karna (`for`, `sum`, `max`, `dict`, `list`, `in`, `join`) use drain karता hai — doosra pass kuch nahi deता. Fix: ek baar `items = list(the_iterator)`, phir reuse.',
      'Aap ek iterator ko `len()`, index (`it[0]`), ya slice nahi kar sakte. `x in it` match tak items consume karता hai. Inmein se kisi ke liye pehle list mein convert karो.',
      'Ek iterator apni position yaad rakhता hai, isliye aap `next(it)` kuch baar phir baaki ke liye `for`/`list(it)` kar sakte ho.',
      'Ek class ko iterable banane ko, `__iter__` define karो jo ek fresh iterator lautае — aam taur par delegate karके ya ek generator method ki tarah.',
    ],
  },

  {
    slug: 'py-generators',
    title: 'Generators: yield, Lazy Evaluation, and yield from',
    titleHi: 'Generators: yield, Lazy Evaluation, Aur yield from',
    description: 'Loading a two-gigabyte log file with `lines = open("log").readlines()` and watching memory spike, when you only needed to count the error lines. A generator produces values one at a time, on demand, keeping only the current item in memory — and the change is often just swapping `[` `]` for `(` `)` or `return list` for `yield`.',
    descriptionHi: 'Ek do-gigabyte log file ko `lines = open("log").readlines()` se load karna aur memory spike dekhna, jab aapko sirf error lines ginni thi. Ek generator values ek-ek karके banाता hai, maang par, sirf current item memory mein rakhते hue — aur badlaav aksar bस `[` `]` ko `(` `)` se ya `return list` ko `yield` se swap karna hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A vending machine versus a catered buffet.** A buffet (a list) prepares every dish up front and lays them all out — you can see everything, take any dish in any order, go back for seconds, but the kitchen had to cook the entire spread whether or not anyone eats it, and it all sits there taking up table space. A vending machine (a generator) makes nothing until you press a button; each press produces exactly one item, then the machine goes back to idle, remembering only which slot is next. If you only want three snacks, it makes three, not three hundred. It cannot show you everything at once, you cannot go backward, and once a slot is emptied it stays empty — but it uses almost no space and starts delivering immediately. A generator function is written like an ordinary function, except that instead of building a list and `return`ing it, it `yield`s each value; each `yield` hands one item to the caller and freezes the function exactly where it is, with all its local variables intact, until the caller presses the button again by asking for the next value.',
      hi: '**Ek vending machine versus ek catered buffet.** Ek buffet (ek list) har dish pehle se taiyaar karता hai aur sab bichhा deता hai — aap sab kuch dekh sakte ho, wapas ja sakte ho, par kitchen ko poora spread pakाना pada chahe koi khाए ya nahi. Ek vending machine (ek generator) kuch nahi banाता jab tak aap ek button nahi dabाते; har press bilkul ek item banाता hai, phir machine idle par wapas jाती hai. Agar aap sirf teen snacks chahते ho, ye teen banाती hai, teen sau nahi. Ek generator function ek saamaanya function ki tarah likha jाता hai, siwaay iske ki ek list banाne aur return karne ke bجaay, ye har value yield karता hai; har yield ek item caller ko deता hai aur function ko bilkul wahin freeze kar deता hai.',
    },

    simple: `**A generator function: \`yield\` instead of building a list**

\`\`\`python
def squares(n):
    for i in range(n):
        yield i * i             # hand one value out, then pause here

g = squares(4)                  # nothing runs yet -- g is a generator object
next(g)                         # 0   -- runs until the first yield
next(g)                         # 1
list(g)                         # [4, 9]  -- continues, then StopIteration ends it

for s in squares(4):            # the normal way to consume it
    print(s)
\`\`\`

**Generator expression: like a list comprehension with \`()\`**

\`\`\`python
lst = [x * 2 for x in range(1_000_000)]   # builds a million-item list NOW
gen = (x * 2 for x in range(1_000_000))   # builds nothing; yields on demand

sum(x * 2 for x in range(1_000_000))      # parens optional when it is the only argument
\`\`\`

**The memory win**

\`\`\`python
# BAD: loads the whole file into a list
lines = open("huge.log").readlines()
errors = [ln for ln in lines if "ERROR" in ln]

# GOOD: streams one line at a time, constant memory
with open("huge.log") as f:
    error_count = sum(1 for ln in f if "ERROR" in ln)
\`\`\`

**\`yield from\`: delegate to another iterable**

\`\`\`python
def flatten(nested):
    for group in nested:
        yield from group        # yield every item of 'group' -- no inner for loop

list(flatten([[1, 2], [3], [4, 5]]))      # [1, 2, 3, 4, 5]
\`\`\`

\`\`\`
GENERATOR FUNCTION   any 'def' containing 'yield'. Calling it returns a generator
                     object (an iterator); the body does NOT run until you iterate.
GENERATOR EXPRESSION  (expr for x in iterable if cond)  -- lazy sibling of [ ... ]

Each 'yield':
  - produces one value to the caller
  - SUSPENDS the function, keeping all local state
  - resumes right after the yield on the next next()/for step
When the function returns (or falls off the end): raises StopIteration.

A generator is a SINGLE-USE ITERATOR (see previous lesson). Iterate it once.

yield from <iterable>   yields every item of that iterable (flattening / delegation)

WHY generators:
  - constant memory: only the current item is held, not the whole sequence
  - work starts immediately (no "build the whole list first" delay)
  - can represent infinite sequences
  - compose into pipelines: gen -> filter gen -> transform gen -> consumer
NOT when: you need len(), random access, or to iterate more than once -> use a list.
\`\`\``,

    simpleHi: `**Ek generator function: list banane ke bجaay \`yield\`**

\`\`\`python
def squares(n):
    for i in range(n):
        yield i * i             # ek value deo, phir yahaan pause

g = squares(4)                  # abhi kuch nahi chalता -- g ek generator object hai
next(g)                         # 0   -- pehle yield tak chalता hai
next(g)                         # 1
list(g)                         # [4, 9]  -- jaari, phir StopIteration ise khatam

for s in squares(4):            # ise consume karne ka saamaanya tarika
    print(s)
\`\`\`

**Generator expression: \`()\` waali ek list comprehension jaisी**

\`\`\`python
lst = [x * 2 for x in range(1_000_000)]   # ABHI ek million-item list banाता hai
gen = (x * 2 for x in range(1_000_000))   # kuch nahi banाता; maang par yield

sum(x * 2 for x in range(1_000_000))      # parens vaikalpik jab ye ekmatra argument hai
\`\`\`

**Memory jeet**

\`\`\`python
# BURA: poori file ek list mein load
lines = open("huge.log").readlines()
errors = [ln for ln in lines if "ERROR" in ln]

# ACHHA: ek-ek line stream, constant memory
with open("huge.log") as f:
    error_count = sum(1 for ln in f if "ERROR" in ln)
\`\`\`

**\`yield from\`: ek doosre iterable ko delegate**

\`\`\`python
def flatten(nested):
    for group in nested:
        yield from group        # 'group' ka har item yield

list(flatten([[1, 2], [3], [4, 5]]))      # [1, 2, 3, 4, 5]
\`\`\`

\`\`\`
GENERATOR FUNCTION   koi 'def' jismein 'yield' hai. Ise call karna ek generator
                     object (ek iterator) lautaता hai; body iterate karne tak NAHI chalता.
GENERATOR EXPRESSION  (expr for x in iterable if cond)  -- [ ... ] ka lazy sibling

Har 'yield':
  - caller ko ek value deता hai
  - function ko SUSPEND karता hai, saara local state rakhते hue
  - agle next()/for step par yield ke turant baad resume karता hai
Jab function return karता hai: StopIteration raise karता hai.

Ek generator ek SINGLE-USE ITERATOR hai. Ise ek baar iterate karो.

yield from <iterable>   us iterable ka har item yield karता hai

generators KYUN:
  - constant memory: sirf current item rakhा jाता hai
  - kaam turant shuru hota hai
  - infinite sequences represent kar sakte hain
  - pipelines mein compose hote hain
NAHI jab: aapko len(), random access, ya ek se zyaada baar iterate chahiye -> list istemal karो.
\`\`\``,

    content: `## How suspension works

\`\`\`python
def demo():
    print("  start")
    x = yield 1
    print(f"  resumed, got {x!r}")
    y = yield 2
    print(f"  resumed again, got {y!r}")
    print("  done")

g = demo()
next(g)            # prints "  start", returns 1, pauses at 'yield 1'
next(g)            # prints "  resumed, got None", returns 2, pauses at 'yield 2'
next(g)            # prints "  resumed again, got None", "  done", raises StopIteration
\`\`\`

Each \`next()\` runs the body from where it paused up to the next \`yield\`, returns that value, and freezes. Local variables, the instruction pointer, and even a partially-executed expression are all preserved. \`next()\` sends \`None\` in; \`g.send(value)\` sends a real value that becomes the result of the paused \`yield\` (used for coroutines — rare in application code).

## Generator function vs generator expression

\`\`\`python
def evens(seq):
    for x in seq:
        if x % 2 == 0:
            yield x

evens_gen = (x for x in seq if x % 2 == 0)
\`\`\`

Use an **expression** for a single transform/filter you pass straight to a consumer. Use a **function** when there is real logic — multiple yields, setup/teardown, branching, \`try/finally\`, accumulating state.

## Laziness and infinite sequences

\`\`\`python
def integers():
    n = 0
    while True:
        yield n
        n += 1

import itertools
first_five = list(itertools.islice(integers(), 5))   # [0, 1, 2, 3, 4]
\`\`\`

A generator only computes what is asked for, so it can model an unbounded stream. You must bound the consumption yourself (\`islice\`, a \`break\`, \`takewhile\`, \`next\` a fixed number of times) — \`list(integers())\` would run forever.

## Pipelines: generators feeding generators

\`\`\`python
def read_lines(path):
    with open(path) as f:
        for line in f:
            yield line.rstrip("\\n")

def non_blank(lines):
    for line in lines:
        if line.strip():
            yield line

def parse(lines):
    for line in lines:
        key, _, value = line.partition("=")
        yield key.strip(), value.strip()

# nothing is read until the final consumer pulls:
config = dict(parse(non_blank(read_lines("app.conf"))))
\`\`\`

Each stage is lazy; data flows one item at a time from the file, through each generator, to \`dict\`. Peak memory is one line, regardless of file size.

## \`yield from\` — delegation and sub-generators

\`\`\`python
def chain(*iterables):
    for it in iterables:
        yield from it            # instead of: for x in it: yield x

list(chain([1, 2], (3, 4), "ab"))    # [1, 2, 3, 4, 'a', 'b']

def deep_flatten(x):
    if isinstance(x, (list, tuple)):
        for item in x:
            yield from deep_flatten(item)
    else:
        yield x

list(deep_flatten([1, [2, [3, 4], 5], [[6]]]))   # [1, 2, 3, 4, 5, 6]
\`\`\`

\`yield from iterable\` yields every item of \`iterable\` and (for a sub-generator) also forwards \`send\`/\`throw\` and captures its return value. In practice you use it to flatten one level or to delegate to another generator.

## \`return\` in a generator

\`\`\`python
def until_negative(items):
    for x in items:
        if x < 0:
            return               # ends the generator; the -ve value is NOT yielded
        yield x

list(until_negative([1, 2, 3, -1, 4]))   # [1, 2, 3]
\`\`\`

A bare \`return\` (or reaching the end) stops the generator. \`return value\` stores \`value\` as \`StopIteration.value\` — mostly relevant with \`yield from\`.

## Cleanup: \`try/finally\` around the yield

\`\`\`python
def managed(path):
    f = open(path)
    try:
        for line in f:
            yield line
    finally:
        f.close()                # runs when the generator is closed or garbage-collected
\`\`\`

If a \`for\` loop over the generator \`break\`s, or the generator object is discarded, Python calls \`.close()\`, which raises \`GeneratorExit\` at the paused \`yield\` — so a \`try/finally\` around the \`yield\` still runs your cleanup. This is the mechanism behind \`@contextlib.contextmanager\` (Module 6).`,

    contentHi: `## Suspension kaise kaam karता hai

\`\`\`python
def demo():
    print("  start")
    x = yield 1
    print(f"  resumed, got {x!r}")
    y = yield 2
    print(f"  resumed again, got {y!r}")
    print("  done")

g = demo()
next(g)            # "  start" print, 1 lautaता hai, 'yield 1' par pause
next(g)            # "  resumed, got None" print, 2 lautaता hai, 'yield 2' par pause
next(g)            # "  resumed again, got None", "  done", StopIteration raise
\`\`\`

Har \`next()\` body ko jahaan ye paused thi wahaan se agle \`yield\` tak chalाता hai, wo value lautaता hai, aur freeze karता hai. Local variables, instruction pointer, aur ek aanshik-executed expression bhi sanrakshit hain. \`next()\` \`None\` bhejता hai; \`g.send(value)\` ek asli value bhejता hai (coroutines ke liye — durlabh).

## Generator function vs generator expression

\`\`\`python
def evens(seq):
    for x in seq:
        if x % 2 == 0:
            yield x

evens_gen = (x for x in seq if x % 2 == 0)
\`\`\`

Ek **expression** istemal karो ek single transform/filter ke liye. Ek **function** istemal karो jab asli logic hai — kai yields, setup/teardown, branching, \`try/finally\`.

## Laziness aur infinite sequences

\`\`\`python
def integers():
    n = 0
    while True:
        yield n
        n += 1

import itertools
first_five = list(itertools.islice(integers(), 5))   # [0, 1, 2, 3, 4]
\`\`\`

Ek generator sirf wo compute karता hai jo maanga jाता hai. Aapko consumption khud bound karna hoga.

## Pipelines

\`\`\`python
def read_lines(path):
    with open(path) as f:
        for line in f:
            yield line.rstrip("\\n")

def non_blank(lines):
    for line in lines:
        if line.strip():
            yield line

def parse(lines):
    for line in lines:
        key, _, value = line.partition("=")
        yield key.strip(), value.strip()

config = dict(parse(non_blank(read_lines("app.conf"))))
\`\`\`

Har stage lazy hai; data ek-ek item file se, har generator ke zariye, \`dict\` tak bahता hai. Peak memory ek line hai.

## \`yield from\`

\`\`\`python
def chain(*iterables):
    for it in iterables:
        yield from it

list(chain([1, 2], (3, 4), "ab"))    # [1, 2, 3, 4, 'a', 'b']

def deep_flatten(x):
    if isinstance(x, (list, tuple)):
        for item in x:
            yield from deep_flatten(item)
    else:
        yield x

list(deep_flatten([1, [2, [3, 4], 5], [[6]]]))   # [1, 2, 3, 4, 5, 6]
\`\`\`

## Generator mein \`return\`

\`\`\`python
def until_negative(items):
    for x in items:
        if x < 0:
            return               # generator ko khatam; -ve value yield NAHI hoti
        yield x

list(until_negative([1, 2, 3, -1, 4]))   # [1, 2, 3]
\`\`\`

## Cleanup: yield ke aas-paas \`try/finally\`

\`\`\`python
def managed(path):
    f = open(path)
    try:
        for line in f:
            yield line
    finally:
        f.close()                # tab chalता hai jab generator close ya garbage-collect hota hai
\`\`\`

Agar generator par ek \`for\` loop \`break\` karता hai, Python \`.close()\` call karता hai, jo paused \`yield\` par \`GeneratorExit\` raise karता hai. Ye \`@contextlib.contextmanager\` (Module 6) ke peechhe ka tantr hai.`,

    examples: [
      {
        title: 'Lazy: a generator does no work until iterated',
        titleHi: 'Lazy: ek generator iterate hone tak koi kaam nahi karता',
        code: `def loud_range(n):
    print("  loud_range: starting")
    for i in range(n):
        print(f"  loud_range: about to yield {i}")
        yield i
    print("  loud_range: finished")

print("1. creating the generator")
g = loud_range(3)
print("2. nothing has printed from the body yet")

print("3. first next():")
print("   got", next(g))
print("4. second next():")
print("   got", next(g))

print("5. the rest via list():")
print("   got", list(g))`,
        output: `1. creating the generator
2. nothing has printed from the body yet
3. first next():
  loud_range: starting
  loud_range: about to yield 0
   got 0
4. second next():
  loud_range: about to yield 1
   got 1
5. the rest via list():
  loud_range: about to yield 2
  loud_range: finished
   got [2]`,
        explain: 'Calling `loud_range(3)` runs nothing — step 2 confirms the body has not started. The first `next(g)` runs from the top to the first `yield` (printing "starting" and "about to yield 0"), then freezes. Each subsequent `next` resumes just after the last `yield`. `list(g)` drains the rest: it yields 2, then the function falls off the end (printing "finished") and raises `StopIteration`, so `list` sees only `[2]`.',
        explainHi: '`loud_range(3)` call karna kuch nahi chalाता — step 2 confirm karता hai body shuru nahi hui. Pehla `next(g)` top se pehle `yield` tak chalता hai, phir freeze. Har agla `next` aakhri `yield` ke turant baad resume karता hai. `list(g)` baaki drain karता hai: ye 2 yield karता hai, phir function ant se gir jाता hai aur `StopIteration` raise karता hai.',
      },
      {
        title: 'Generator expression vs list comprehension: memory',
        titleHi: 'Generator expression vs list comprehension: memory',
        code: `import sys

n = 100_000

list_comp = [x * x for x in range(n)]
gen_expr = (x * x for x in range(n))

print("list comp is large:", sys.getsizeof(list_comp) > 100_000)
print("gen expr is tiny: ", sys.getsizeof(gen_expr) < 1000)
print("gen is far smaller:", sys.getsizeof(gen_expr) < sys.getsizeof(list_comp) // 100)

# both give the same sum, but the generator never holds all items at once:
print("sum via list:", sum(list_comp))
print("sum via gen: ", sum(x * x for x in range(n)))   # parens optional as sole arg

# the generator is single-use:
g = (x for x in range(4))
print("first  sum:", sum(g))   # 0+1+2+3
print("second sum:", sum(g))   # 0 -- exhausted`,
        output: `list comp is large: True
gen expr is tiny:  True
gen is far smaller: True
sum via list: 333328333350000
sum via gen:  333328333350000
first  sum: 6
second sum: 0`,
        explain: 'The list comprehension allocates hundreds of KB to hold 100,000 integers; the generator expression is a fixed couple-hundred bytes regardless of `n` because it holds only its iteration state. Both produce the same `sum`. The generator is single-use: the first `sum(g)` is 6, the second is 0 because `g` is exhausted. (`sys.getsizeof` numbers vary a little by build; the comparison is stable.)',
        explainHi: 'List comprehension 100,000 integers rakhने ko ~800 KB allocate karता hai; generator expression `n` chahe kuch bhi ho ek fixed ~200 bytes hai. Dono wahi `sum` banाते hain. Generator single-use hai (`range(4)` -> `sum` 6, phir 0).',
      },
      {
        title: 'A lazy pipeline of generators; yield from for flattening',
        titleHi: 'Generators ki ek lazy pipeline; flattening ke liye yield from',
        code: `import itertools

def numbers():                       # infinite
    n = 1
    while True:
        yield n
        n += 1

def squared(src):
    for x in src:
        yield x * x

def under(limit, src):
    for x in src:
        if x >= limit:
            return
        yield x

# pipeline: numbers -> squared -> under(200) -- all lazy, bounded by 'under'
pipe = under(200, squared(numbers()))
print("squares under 200:", list(pipe))

# islice bounds an infinite generator without a helper:
print("first 5 numbers:", list(itertools.islice(numbers(), 5)))

# yield from flattens one level:
def concat(*iterables):
    for it in iterables:
        yield from it

print("concat:", list(concat([1, 2], (3, 4), "xy")))

def deep_flatten(x):
    if isinstance(x, (list, tuple)):
        for item in x:
            yield from deep_flatten(item)
    else:
        yield x

print("deep:", list(deep_flatten([1, [2, [3, [4]], 5], [[6, 7]]])))`,
        output: `squares under 200: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196]
first 5 numbers: [1, 2, 3, 4, 5]
concat: [1, 2, 3, 4, 'x', 'y']
deep: [1, 2, 3, 4, 5, 6, 7]`,
        explain: 'The pipeline `under(200, squared(numbers()))` chains three generators: `numbers()` is infinite, `squared` transforms each value, and `under` yields until the first value >= 200 then `return`s (ending the whole pipeline). Nothing is computed until `list()` pulls — and only ~15 values ever exist at once. `islice(numbers(), 5)` bounds the infinite generator without a helper. `yield from` in `concat` flattens one level (a string yields its characters); `deep_flatten` uses `yield from` recursively to flatten arbitrary nesting.',
        explainHi: 'Pipeline `under(200, squared(numbers()))` teen generators chain karta hai: `numbers()` infinite hai, `squared` har value transform karta hai, aur `under` pehli value >= 200 tak yield karta hai phir `return` (poori pipeline khatam). Kuch compute nahi hota jab tak `list()` pull nahi karta. `islice(numbers(), 5)` infinite generator ko bound karta hai. `concat` mein `yield from` ek level flatten karta hai; `deep_flatten` `yield from` recursively istemal karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `def get_evens(nums):
    return [n for n in nums if n % 2 == 0]   # builds a full list even for a 10 GB input

evens = get_evens(read_huge_file())`,
        right: `def get_evens(nums):
    for n in nums:
        if n % 2 == 0:
            yield n                          # streams; constant memory

for n in get_evens(read_huge_file()):
    ...`,
        why: 'Returning a list materialises every result in memory before the caller sees the first one. For a large or streaming input, `yield` produces items one at a time, so peak memory is one item and the caller can start processing immediately. Switch to `yield` whenever the result is consumed by a `for`/`sum`/`any`/`max` and not needed as a reusable list.',
        whyHi: 'Ek list return karna caller ke pehla dekhne se pehle har result ko memory mein materialise karता hai. Ek bade ya streaming input ke liye, `yield` items ek-ek karके banाता hai. `yield` par switch karो jab bhi result ek `for`/`sum`/`any`/`max` dwara consume hota hai.',
      },
      {
        wrong: `@contextmanager
def timer():
    start = time.perf_counter()
    yield
    print(time.perf_counter() - start)   # SKIPPED if the with-body raises`,
        right: `@contextmanager
def timer():
    start = time.perf_counter()
    try:
        yield
    finally:
        print(time.perf_counter() - start)`,
        why: 'An exception raised inside the `with` block is thrown *into* the generator at the `yield` point. Without a `try/finally` (or `try/except`) around the `yield`, the code after it never runs, so the cleanup (or timing print) is skipped exactly when it matters. Always guard the `yield` in a generator that has teardown.',
        whyHi: '`with` block ke andar raise ek exception `yield` bindu par generator mein thrown hota hai. `yield` ke aas-paas ek `try/finally` ke bina, iske baad code kabhi nahi chalता, isliye cleanup skip hota hai. Hamesha teardown waale generator mein `yield` guard karो.',
      },
      {
        wrong: `nums = (x for x in range(10))
total = sum(nums)
average = total / len(nums)    # TypeError: 'generator' object has no len()`,
        right: `nums = list(range(10))         # materialise if you need len() or a second pass
total = sum(nums)
average = total / len(nums)
# or compute count in the same pass:
total = count = 0
for x in range(10):
    total += x; count += 1`,
        why: 'A generator has no `len()` and is consumed by the first pass, so you cannot both `sum` it and take its length. Either materialise it to a list (if it fits in memory), or track the count in the same single pass as the sum.',
        whyHi: 'Ek generator ka koi `len()` nahi hai aur ye pehle pass se consume hota hai. Ya ise ek list mein materialise karो, ya count ko sum ke usi single pass mein track karो.',
      },
    ],

    realWorld: [
      {
        en: '**`@contextlib.contextmanager` is a generator** — the code before `yield` is `__enter__`, the code after (in a `finally`) is `__exit__`. Django\'s `StreamingHttpResponse` takes a generator so a large export is sent row-by-row without buffering the whole file. DRF pagination iterators, and `Model.objects.iterator()`, are generators.',
        hi: '**`@contextlib.contextmanager` ek generator hai** — `yield` se pehle code `__enter__` hai, baad (ek `finally` mein) `__exit__`. Django ka `StreamingHttpResponse` ek generator leता hai. `Model.objects.iterator()` ek generator hai.',
      },
      {
        en: '**Generator pipelines are the idiomatic way to process large files/streams** — `parse(clean(read_lines(path)))` reads and transforms one line at a time. Log processors, ETL scripts, and data-cleaning tools are built this way to keep memory flat regardless of input size.',
        hi: '**Generator pipelines bade files/streams process karne ka idiomatic tarika hain** — `parse(clean(read_lines(path)))` ek-ek line padhता aur transform karता hai. Log processors, ETL scripts is tarah bante hain.',
      },
      {
        en: '**A generator expression passed directly to `sum`/`any`/`all`/`min`/`max`/`sorted`/`join` is the common lazy pattern** — `sum(item.price for item in cart)`, `any(u.is_admin for u in users)`, `", ".join(str(x) for x in ids)`. No intermediate list is built.',
        hi: '**`sum`/`any`/`all`/`min`/`max`/`join` ko seedhe pass kiya ek generator expression aam lazy pattern hai** — `sum(item.price for item in cart)`, `any(u.is_admin for u in users)`. Koi intermediate list nahi banti.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a generator, and what happens when you call a generator function?',
        qHi: 'Ek generator kya hai, aur jab aap ek generator function call karते ho tab kya hota hai?',
        a: 'A generator function is any function whose body contains the yield keyword. It looks like an ordinary function, but calling it does not run the body at all — instead it immediately returns a generator object, which is a kind of iterator. The body only starts executing when something asks the generator for its first value, by calling next on it or iterating it in a for loop. Execution then runs from the top of the function until it reaches a yield expression. At that point the yielded value is handed back to whoever called next, and the function is suspended in place: its local variables, the position in the code, even a half-evaluated expression, are all frozen. The next time next is called, execution resumes on the line right after that yield and continues to the next yield, and so on. When the function eventually returns or runs off the end, the generator raises StopIteration, which a for loop catches as its signal to stop. The two big consequences are memory and laziness. Because the generator only ever holds the state of one suspended function call, not a materialised list of results, it uses a small constant amount of memory no matter how many values it will ultimately produce. And because it computes each value only when asked, it does no work up front, can start delivering results immediately, and can even represent an infinite sequence, since only the portion you actually consume is ever computed. The generator expression is the lazy counterpart of a list comprehension: same syntax but with parentheses instead of square brackets, producing a generator object rather than a list. A generator is a single-use iterator — once it has been iterated to exhaustion, it yields nothing further, and you cannot restart it or take its length or index into it.',
        aHi: 'Ek generator function koi bhi function hai jiske body mein yield keyword hai. Ye ek saamaanya function ki tarah dikhता hai, par ise call karna body ko bilkul nahi chalाता — iske bजaay ye turant ek generator object lautaता hai, jo ek tarah ka iterator hai. Body sirf tab execute hona shuru karता hai jab kuch generator se iski pehli value maangता hai, ispar next call karके ya ek for loop mein iterate karके. Execution phir function ke top se chalता hai jab tak ye ek yield expression tak na pahunche. Us bindu par yielded value wapas di jाती hai, aur function jagah par suspend ho jाता hai: iske local variables, code mein position, sab freeze. Agli baar jab next call hota hai, execution us yield ke turant baad ki line par resume hota hai. Do bade parinaam memory aur laziness hain. Kyunki generator sirf ek suspended function call ka state rakhता hai, ye ek chhoti constant memory istemal karता hai. Aur kyunki ye har value sirf maange jaane par compute karता hai, ye upfront koi kaam nahi karता aur ek infinite sequence bhi represent kar sakta hai. Ek generator ek single-use iterator hai.',
      },
      {
        q: 'When should you use a generator instead of returning a list, and when is a list the better choice?',
        qHi: 'Aapko ek list return karne ke bجaay ek generator kab istemal karna chahiye, aur kab ek list behtar chunaav hai?',
        a: 'Use a generator when the caller is going to consume the results by iterating once — a for loop, or a single call to sum, any, all, min, max, sorted, join, dict, set, or similar — and does not need the results as a reusable collection. The benefits are that peak memory stays flat, since only one item exists at a time rather than the whole result set; the caller can start processing before all the results are computed, which matters for latency and for pipelines; and the source can be arbitrarily large or even infinite without a problem, because unconsumed items are never computed. Generator pipelines, where one generator reads and yields to another that filters and yields to another that transforms, are the standard way to process large files or streams with constant memory. Choose a list instead in several situations. If the caller needs the length, needs random access by index, or needs to slice, it must be a concrete sequence. If the results will be iterated more than once — passed to two different consumers, or looped and then re-looped — a generator would be exhausted after the first pass, so you either return a list or the caller has to materialise it anyway. If the result set is small and bounded, the memory savings of a generator are negligible and a list is simpler to reason about and debug, since you can print it and inspect it. And if producing the values has side effects or can raise, a list makes the timing predictable — everything happens when the function is called — whereas a generator defers the work and any exceptions to whenever the caller iterates, which can be surprising. A reasonable default is: return a generator for large or streaming data consumed once, return a list for small results or anything that needs length, indexing, or multiple passes.',
        aHi: 'Ek generator istemal karो jab caller results ko ek baar iterate karके consume karega — ek for loop, ya sum, any, all, min, max, sorted, join, dict, set ka ek akela call — aur unhe ek reusable collection ki tarah nahi chahiye. Faayde ye hain ki peak memory flat rehti hai; caller sab results compute hone se pehle process karna shuru kar sakta hai; aur source arbitrarily bada ya infinite ho sakta hai. Generator pipelines bade files ya streams process karne ka standard tarika hain. Iske bجaay ek list chunो kai sthitiyon mein. Agar caller ko length chahiye, index se random access chahiye, ya slice karna hai, ye ek concrete sequence honi chahiye. Agar results ko ek se zyaada baar iterate kiya jaayega, ek generator pehle pass ke baad khatam ho jाता. Agar result set chhota hai, generator ki memory savings nगण्य hain. Ek uchit default: bade ya streaming data ke liye jo ek baar consume hota hai ek generator return karो, chhote results ke liye ek list.',
      },
    ],

    exercises: [
      {
        task: 'Write `chunked(iterable, size)` as a generator that yields lists of up to `size` items. `list(chunked(range(10), 3))` -> `[[0,1,2],[3,4,5],[6,7,8],[9]]`. It must work on any iterable (not just sequences) and stream — do not build the whole input into a list first.',
        taskHi: '`chunked(iterable, size)` ek generator ki tarah likhо jo `size` tak items ki lists yield kare. `list(chunked(range(10), 3))` -> `[[0,1,2],[3,4,5],[6,7,8],[9]]`. Ye kisi bhi iterable par kaam kare aur stream kare.',
        hint: '`it = iter(iterable); while True: batch = list(itertools.islice(it, size)); if not batch: return; yield batch`. `islice` pulls at most `size` items from the shared iterator each round; an empty batch means the input is exhausted. (Python 3.12+ has `itertools.batched` built in.)',
        hintHi: '`it = iter(iterable); while True: batch = list(itertools.islice(it, size)); if not batch: return; yield batch`. (Python 3.12+ mein `itertools.batched` built-in hai.)',
      },
      {
        task: 'Write a generator pipeline for a "config file": `lines(text)` yields lines; `strip_comments(src)` drops lines starting with `#` and blank lines; `to_pairs(src)` yields `(key, value)` from `key = value`. Compose `dict(to_pairs(strip_comments(lines(text))))` on a sample string with comments and blanks. Confirm each stage is a generator (no list materialised until `dict`).',
        taskHi: 'Ek "config file" ke liye ek generator pipeline likhो: `lines(text)`, `strip_comments(src)` (`#` se shuru aur blank lines drop), `to_pairs(src)` (`key = value` se `(key, value)`). Ek sample string par compose karो.',
        hint: 'Each function is `def f(src): for x in src: ... yield ...`. `strip_comments`: `s = line.strip(); if s and not s.startswith("#"): yield line`. `to_pairs`: `k, _, v = line.partition("="); yield k.strip(), v.strip()`.',
        hintHi: 'Har function `def f(src): for x in src: ... yield ...` hai. `to_pairs`: `k, _, v = line.partition("="); yield k.strip(), v.strip()`.',
      },
      {
        task: 'Write `take_while_positive(nums)` using a generator with an early `return`: yield each number until the first non-positive one, then stop (do not yield it). Test `list(take_while_positive([3, 1, 4, 0, 5]))` -> `[3, 1, 4]`. Then show a `try/finally` in a generator: `logged(items)` prints `"cleanup"` in a `finally` and confirm it runs even when the consumer `break`s early.',
        taskHi: '`take_while_positive(nums)` likhо ek generator ke saath ek jaldi `return` ke saath. `list(take_while_positive([3, 1, 4, 0, 5]))` -> `[3, 1, 4]`. Phir ek generator mein `try/finally` dikhाओ jo consumer ke jaldi `break` karne par bhi chalे.',
        hint: '`for n in nums: if n <= 0: return; yield n`. For the cleanup: `def logged(items): try: yield from items finally: print("cleanup")`. Consuming it with `for x in logged([1,2,3]): break` still prints `cleanup` — Python calls `.close()` on the abandoned generator.',
        hintHi: '`for n in nums: if n <= 0: return; yield n`. Cleanup: `def logged(items): try: yield from items finally: print("cleanup")`. `for x in logged([1,2,3]): break` phir bhi `cleanup` print karता hai.',
      },
    ],

    keyTakeaways: [
      'A generator function is any `def` containing `yield`. Calling it runs NOTHING — it returns a generator object (an iterator). The body executes lazily, one `yield` at a time, as you iterate.',
      'Each `yield` produces one value AND suspends the function with all local state frozen; the next `next()`/`for` step resumes right after that `yield`. Returning (or reaching the end) raises `StopIteration`.',
      'Generator expression: `(expr for x in it if cond)` — the lazy sibling of a list comprehension. Parens are optional when it is a function\'s sole argument (`sum(x*x for x in nums)`).',
      'The memory win: a generator holds only its current item + iteration state (constant, ~200 bytes) vs a list holding every result. Use it for large/streaming inputs consumed once.',
      'A generator is a SINGLE-USE iterator — iterate it once. No `len()`, no indexing, no second pass.',
      '`yield from iterable` yields every item of that iterable — use it to flatten one level or delegate to a sub-generator (recursion, `chain`-like helpers).',
      'Wrap the `yield` in `try/finally` if the generator has cleanup — an exception from the consumer, or `.close()` (called on `break`/GC), raises `GeneratorExit` at the `yield`, and `finally` still runs. This is how `@contextmanager` works.',
      'Use a list instead of a generator when you need length, random access, multiple passes, or the data is small — or when deferring side effects/exceptions to iteration time would be surprising.',
    ],
    keyTakeawaysHi: [
      'Ek generator function koi bhi `def` hai jismein `yield` hai. Ise call karna KUCH NAHI chalाता — ye ek generator object (ek iterator) lautaता hai. Body lazily execute hota hai, ek `yield` ek baar.',
      'Har `yield` ek value banाता hai AUR function ko saara local state frozen ke saath suspend karता hai; agla `next()`/`for` step us `yield` ke turant baad resume karता hai. Return karna `StopIteration` raise karता hai.',
      'Generator expression: `(expr for x in it if cond)` — ek list comprehension ka lazy sibling. Parens vaikalpik jab ye ek function ka ekmatra argument hai.',
      'Memory jeet: ek generator sirf apna current item + iteration state rakhता hai (constant, ~200 bytes) vs har result rakhती ek list. Ise bade/streaming inputs ke liye istemal karो jo ek baar consume hote hain.',
      'Ek generator ek SINGLE-USE iterator hai — ise ek baar iterate karो. Koi `len()`, koi indexing, koi doosra pass nahi.',
      '`yield from iterable` us iterable ka har item yield karता hai — ise ek level flatten karne ya ek sub-generator ko delegate karne ko istemal karो.',
      'Agar generator mein cleanup hai to `yield` ko `try/finally` mein wrap karो — consumer se ek exception, ya `.close()` (`break`/GC par call), `yield` par `GeneratorExit` raise karता hai, aur `finally` phir bhi chalता hai. Aise `@contextmanager` kaam karता hai.',
      'Ek generator ke bجaay ek list istemal karो jab aapko length, random access, multiple passes chahiye, ya data chhota hai.',
    ],
  },

  {
    slug: 'py-itertools',
    title: 'itertools: Building Blocks for Iteration',
    titleHi: 'itertools: Iteration Ke Liye Building Blocks',
    description: 'Writing a nested loop to pair every item with every other item, or a manual counter-and-buffer to group consecutive equal rows, when `itertools` already has a fast, memory-light function for it. The catch that trips everyone: `itertools.groupby` only groups *consecutive* equal keys, so you almost always have to sort first.',
    descriptionHi: 'Har item ko har doosre item ke saath pair karne ko ek nested loop likhna, ya lagataar barabar rows group karne ko ek manual counter-and-buffer, jab `itertools` mein pehle se iske liye ek tez, memory-halka function hai. Wo jaal jo sabko phasaता hai: `itertools.groupby` sirf *lagataar* barabar keys group karता hai, isliye aapko lagbhag hamesha pehle sort karna hota hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**A drawer of specialised kitchen tools instead of doing everything with a chef\'s knife.** You *can* julienne carrots, zest a lemon, and core an apple all with one big knife, and beginners do — but a mandoline, a zester, and a corer each do their one job faster, more evenly, and with less mess. `itertools` is that drawer for loops: `chain` glues sequences end to end, `islice` takes a window without building the whole thing, `product` gives every combination of several lists, `combinations` gives every unordered pair, `accumulate` gives running totals, `pairwise` gives every adjacent pair. Each is a lazy iterator, so it works on huge or infinite inputs and holds almost no memory. The one tool with a sharp edge is `groupby`: it is a *deli slicer* that groups a continuous run, not a *sorting machine*. It walks the input once and starts a new group every time the key changes, so `[a, a, b, a]` becomes three groups, not two. If you want all the `a`s together, you must feed it pre-sorted input.',
      hi: '**Ek chef ke knife se sab kuch karne ke bجaay specialised kitchen tools ka ek drawer.** Aap *kar sakte ho* carrots julienne, lemon zest, apple core sab ek bade knife se, aur shuruaati karते hain — par ek mandoline, ek zester, aur ek corer har ek apna ek kaam tez, zyaada barabar karता hai. `itertools` loops ke liye wo drawer hai: `chain` sequences ko end to end jodता hai, `islice` poori cheez banाye bina ek window leता hai, `product` kai lists ka har combination deता hai, `combinations` har unordered pair, `accumulate` running totals, `pairwise` har adjacent pair. Har ek ek lazy iterator hai. Ek tez dhaar waala tool `groupby` hai: ye ek *deli slicer* hai jo ek continuous run group karता hai, ek *sorting machine* nahi. Agar aap saare `a` saath chahते ho, aapko ise pre-sorted input dena hoga.',
    },

    simple: `**The most-used functions**

\`\`\`python
import itertools as it

# --- combining ---
list(it.chain([1, 2], [3, 4], [5]))          # [1, 2, 3, 4, 5]
list(it.chain.from_iterable([[1, 2], [3]]))  # [1, 2, 3]  -- one arg that is a list of lists

# --- slicing / limiting a lazy iterator ---
list(it.islice(range(100), 5))               # [0, 1, 2, 3, 4]      -- first 5
list(it.islice(range(100), 5, 10))           # [5, 6, 7, 8, 9]      -- start, stop
list(it.islice(range(100), 0, 20, 5))        # [0, 5, 10, 15]       -- start, stop, step
list(it.takewhile(lambda x: x < 3, [1, 2, 3, 1]))   # [1, 2]  -- stop at first False
list(it.dropwhile(lambda x: x < 3, [1, 2, 3, 1]))   # [3, 1]  -- skip until first False

# --- infinite ---
next(it.count(10))                           # 10   -- count(start=0, step=1)
list(it.islice(it.cycle("AB"), 5))           # ['A', 'B', 'A', 'B', 'A']
list(it.repeat("x", 3))                      # ['x', 'x', 'x']

# --- combinatorics ---
list(it.product([1, 2], ["a", "b"]))         # [(1,'a'), (1,'b'), (2,'a'), (2,'b')]
list(it.permutations([1, 2, 3], 2))          # (1,2) (1,3) (2,1) (2,3) (3,1) (3,2)
list(it.combinations([1, 2, 3], 2))          # (1,2) (1,3) (2,3)   -- unordered
list(it.combinations_with_replacement([1, 2], 2))   # (1,1) (1,2) (2,2)

# --- running values / windows ---
list(it.accumulate([1, 2, 3, 4]))            # [1, 3, 6, 10]        -- running sum
list(it.accumulate([1, 2, 3, 4], max))       # [1, 2, 3, 4]         -- running max
list(it.pairwise([1, 2, 3, 4]))              # [(1,2), (2,3), (3,4)]  (3.10+)

# --- zipping unevenly ---
list(it.zip_longest([1, 2, 3], ["a"], fillvalue="?"))   # [(1,'a'), (2,'?'), (3,'?')]

# --- batching (3.12+) ---
list(it.batched(range(7), 3))                # [(0,1,2), (3,4,5), (6,)]
\`\`\`

**\`groupby\` — the one with a sharp edge**

\`\`\`python
data = ["apple", "avocado", "banana", "blueberry", "cherry"]

# WRONG if the data is not sorted by the key:
for key, group in it.groupby(data, key=lambda s: s[0]):
    print(key, list(group))
# a ['apple', 'avocado']
# b ['banana', 'blueberry']
# c ['cherry']
# ^ works here ONLY because the list happens to be sorted by first letter

unsorted = ["apple", "banana", "avocado"]
for key, group in it.groupby(unsorted, key=lambda s: s[0]):
    print(key, list(group))
# a ['apple']
# b ['banana']
# a ['avocado']    <-- TWO 'a' groups! groupby only groups CONSECUTIVE equal keys

# RIGHT: sort by the same key first
for key, group in it.groupby(sorted(unsorted, key=lambda s: s[0]), key=lambda s: s[0]):
    print(key, list(group))
# a ['apple', 'avocado']
# b ['banana']
\`\`\`

\`\`\`
itertools returns LAZY ITERATORS (single-use). Wrap in list()/tuple() to materialise.

COMBINE:   chain(*iters) | chain.from_iterable(iter_of_iters)
LIMIT:     islice(it, stop) / islice(it, start, stop[, step])  -- no negative indices
           takewhile(pred, it) | dropwhile(pred, it)
INFINITE:  count(start, step) | cycle(iterable) | repeat(value[, times])
COMBINATORICS:  product(*iters[, repeat=n]) | permutations(it[, r])
                combinations(it, r) | combinations_with_replacement(it, r)
RUNNING:   accumulate(it[, func]) | pairwise(it)
UNEVEN:    zip_longest(*iters, fillvalue=None)
BATCH:     batched(it, n)  (Python 3.12+)
GROUP:     groupby(it, key)  -> (key, group_iterator) pairs, grouping CONSECUTIVE
           equal keys only. SORT by the same key first, or you get split groups.
           Also: each group iterator is consumed as you advance -- materialise if needed.
\`\`\``,

    simpleHi: `**Sabse zyaada istemal hone waale functions**

\`\`\`python
import itertools as it

list(it.chain([1, 2], [3, 4], [5]))          # [1, 2, 3, 4, 5]
list(it.chain.from_iterable([[1, 2], [3]]))  # [1, 2, 3]

list(it.islice(range(100), 5))               # [0, 1, 2, 3, 4]      -- pehle 5
list(it.islice(range(100), 5, 10))           # [5, 6, 7, 8, 9]
list(it.takewhile(lambda x: x < 3, [1, 2, 3, 1]))   # [1, 2]
list(it.dropwhile(lambda x: x < 3, [1, 2, 3, 1]))   # [3, 1]

next(it.count(10))                           # 10
list(it.islice(it.cycle("AB"), 5))           # ['A', 'B', 'A', 'B', 'A']
list(it.repeat("x", 3))                      # ['x', 'x', 'x']

list(it.product([1, 2], ["a", "b"]))         # [(1,'a'), (1,'b'), (2,'a'), (2,'b')]
list(it.permutations([1, 2, 3], 2))          # (1,2) (1,3) (2,1) (2,3) (3,1) (3,2)
list(it.combinations([1, 2, 3], 2))          # (1,2) (1,3) (2,3)   -- unordered

list(it.accumulate([1, 2, 3, 4]))            # [1, 3, 6, 10]        -- running sum
list(it.pairwise([1, 2, 3, 4]))              # [(1,2), (2,3), (3,4)]  (3.10+)

list(it.zip_longest([1, 2, 3], ["a"], fillvalue="?"))   # [(1,'a'), (2,'?'), (3,'?')]
list(it.batched(range(7), 3))                # [(0,1,2), (3,4,5), (6,)]  (3.12+)
\`\`\`

**\`groupby\` — wo jismein ek tez dhaar hai**

\`\`\`python
unsorted = ["apple", "banana", "avocado"]
for key, group in it.groupby(unsorted, key=lambda s: s[0]):
    print(key, list(group))
# a ['apple']
# b ['banana']
# a ['avocado']    <-- DO 'a' groups! groupby sirf LAGATAAR barabar keys group karता hai

# SAHI: pehle usi key se sort karो
for key, group in it.groupby(sorted(unsorted, key=lambda s: s[0]), key=lambda s: s[0]):
    print(key, list(group))
# a ['apple', 'avocado']
# b ['banana']
\`\`\`

\`\`\`
itertools LAZY ITERATORS (single-use) lautaता hai. Materialise karne ko list()/tuple() mein wrap karो.

COMBINE:   chain(*iters) | chain.from_iterable(iter_of_iters)
LIMIT:     islice(it, stop) / islice(it, start, stop[, step])  -- koi negative indices nahi
           takewhile(pred, it) | dropwhile(pred, it)
INFINITE:  count(start, step) | cycle(iterable) | repeat(value[, times])
COMBINATORICS:  product(*iters[, repeat=n]) | permutations(it[, r])
                combinations(it, r) | combinations_with_replacement(it, r)
RUNNING:   accumulate(it[, func]) | pairwise(it)
UNEVEN:    zip_longest(*iters, fillvalue=None)
BATCH:     batched(it, n)  (Python 3.12+)
GROUP:     groupby(it, key)  -> (key, group_iterator) pairs, sirf LAGATAAR barabar
           keys group karता hai. Pehle usi key se SORT karो. Har group iterator
           aage badhते hi consume hota hai -- zaroorat par materialise karो.
\`\`\``,

    content: `## Everything is lazy — materialise deliberately

\`\`\`python
import itertools as it

evens = it.islice(it.count(0, 2), 5)     # a lazy iterator, no work done
list(evens)                              # [0, 2, 4, 6, 8]  -- now it runs
list(evens)                              # []  -- single-use, already consumed
\`\`\`

Every \`itertools\` result is a single-use iterator. Chain them freely (they compose without intermediate lists), but call \`list()\`/\`tuple()\` at the point you need a concrete, reusable, or measurable result.

## \`islice\` — slicing without \`[:]\`

\`\`\`python
it.islice(iterable, stop)
it.islice(iterable, start, stop)
it.islice(iterable, start, stop, step)
\`\`\`

Unlike \`seq[a:b:c]\`, \`islice\` works on any iterable (including generators and infinite ones) and does not support negative indices or a negative step (it cannot look backward). Use it to take the first N, skip the first N, or take every Nth from a stream.

## Combinatorics — sizes matter

\`\`\`python
it.product("AB", "12")            # 2*2 = 4 tuples: AA-pairs of one from each
it.product("AB", repeat=3)        # 2**3 = 8: ('A','A','A') ... ('B','B','B')
it.permutations("ABC")            # 3! = 6 orderings
it.permutations("ABC", 2)         # 3*2 = 6 ordered pairs
it.combinations("ABCD", 2)        # C(4,2) = 6 unordered pairs
it.combinations_with_replacement("AB", 2)   # (A,A) (A,B) (B,B)
\`\`\`

These grow fast: \`permutations\` of 10 items is 3.6 million, \`product\` of five 10-item lists is 100,000. They are lazy, so iterating is fine, but \`list()\` on a large one will blow memory.

## \`accumulate\` — running reductions

\`\`\`python
import operator
it.accumulate([1, 2, 3, 4])                    # [1, 3, 6, 10]  (running sum, default)
it.accumulate([1, 2, 3, 4], operator.mul)      # [1, 2, 6, 24]  (running product)
it.accumulate([3, 1, 4, 1, 5], max)            # [3, 3, 4, 4, 5]  (running max)
it.accumulate([1, 2, 3], initial=100)          # [100, 101, 103, 106]  (3.8+)
\`\`\`

The result has the same length as the input (plus one if \`initial\` is given). Contrast \`functools.reduce\`, which returns only the final value.

## \`groupby\` in depth — the two gotchas

**Gotcha 1: consecutive only.** \`groupby\` starts a new group whenever the key changes from the previous element. It does not sort. To group all matching items, \`sorted(data, key=k)\` first, with the *same* key function.

**Gotcha 2: the group iterator shares the underlying iterator.**

\`\`\`python
groups = list(it.groupby("aabbc"))     # [('a', <grouper>), ('b', <grouper>), ('c', <grouper>)]
[list(g) for _, g in groups]           # [[], [], ['c']]  -- earlier groups are already empty!
\`\`\`

Advancing to the next \`(key, group)\` pair consumes any unread items of the current group. You must fully consume (or copy) each group *before* moving to the next:

\`\`\`python
result = {key: list(group) for key, group in it.groupby(sorted(data), key=fn)}   # OK -- list() each group as you go
\`\`\`

## Recipes worth knowing

\`\`\`python
# unique, preserving order (like an ordered set):
def unique(iterable):
    seen = set()
    for x in iterable:
        if x not in seen:
            seen.add(x)
            yield x

# flatten one level:
list(it.chain.from_iterable([[1, 2], [3, 4]]))   # [1, 2, 3, 4]

# sliding window of size n (pre-3.12; 3.12 has more.itertools style helpers):
def window(seq, n):
    it_ = iter(seq)
    buf = tuple(it.islice(it_, n))
    if len(buf) == n:
        yield buf
    for x in it_:
        buf = buf[1:] + (x,)
        yield buf

list(window([1, 2, 3, 4, 5], 3))   # [(1,2,3), (2,3,4), (3,4,5)]

# n-at-a-time (or use it.batched on 3.12+):
list(it.batched("abcdefg", 3))     # [('a','b','c'), ('d','e','f'), ('g',)]
\`\`\``,

    contentHi: `## Sab kuch lazy hai — jaan-boojhkar materialise karो

\`\`\`python
import itertools as it

evens = it.islice(it.count(0, 2), 5)     # ek lazy iterator, koi kaam nahi hua
list(evens)                              # [0, 2, 4, 6, 8]  -- ab ye chalता hai
list(evens)                              # []  -- single-use
\`\`\`

Har \`itertools\` result ek single-use iterator hai. Unhe swतंत्r roop se chain karो, par jab aapko ek concrete, reusable, ya measurable result chahiye us bindu par \`list()\`/\`tuple()\` call karो.

## \`islice\`

\`\`\`python
it.islice(iterable, stop)
it.islice(iterable, start, stop)
it.islice(iterable, start, stop, step)
\`\`\`

\`seq[a:b:c]\` ke ulte, \`islice\` kisi bhi iterable par kaam karता hai (infinite sameत) aur negative indices ya negative step support nahi karता.

## Combinatorics — sizes maayne rakhती hain

\`\`\`python
it.product("AB", repeat=3)        # 2**3 = 8
it.permutations("ABC")            # 3! = 6
it.permutations("ABC", 2)         # 3*2 = 6
it.combinations("ABCD", 2)        # C(4,2) = 6
\`\`\`

Ye tezi se badhती hain: 10 items ki \`permutations\` 36 lakh hai. Wo lazy hain, isliye iterate karna theek hai, par ek badे par \`list()\` memory uda dega.

## \`accumulate\`

\`\`\`python
import operator
it.accumulate([1, 2, 3, 4])                    # [1, 3, 6, 10]  (running sum)
it.accumulate([1, 2, 3, 4], operator.mul)      # [1, 2, 6, 24]  (running product)
it.accumulate([3, 1, 4, 1, 5], max)            # [3, 3, 4, 4, 5]  (running max)
\`\`\`

Result ki input ke barabar length hai. \`functools.reduce\` ke ulte, jo sirf antim value lautaता hai.

## \`groupby\` gehraai mein — do gotchas

**Gotcha 1: sirf consecutive.** \`groupby\` ek naya group tab shuru karता hai jab key pichhle element se badalती hai. Ye sort nahi karता. Saare matching items group karne ko, pehle \`sorted(data, key=k)\`, *usi* key function ke saath.

**Gotcha 2: group iterator underlying iterator share karता hai.**

\`\`\`python
groups = list(it.groupby("aabbc"))     # [('a', <grouper>), ('b', <grouper>), ('c', <grouper>)]
[list(g) for _, g in groups]           # [[], [], ['c']]  -- pehle groups pehle se khaali!
\`\`\`

Agle \`(key, group)\` par aage badhna current group ke koi bhi unread items consume karता hai. Aapko har group ko agle par jane se *pehle* poori tarah consume (ya copy) karna hoga:

\`\`\`python
result = {key: list(group) for key, group in it.groupby(sorted(data), key=fn)}   # OK
\`\`\`

## Jaanne yogya recipes

\`\`\`python
def unique(iterable):
    seen = set()
    for x in iterable:
        if x not in seen:
            seen.add(x)
            yield x

list(it.chain.from_iterable([[1, 2], [3, 4]]))   # [1, 2, 3, 4]

list(it.batched("abcdefg", 3))     # [('a','b','c'), ('d','e','f'), ('g',)]  (3.12+)
\`\`\``,

    examples: [
      {
        title: 'chain, islice, takewhile/dropwhile, count/cycle',
        titleHi: 'chain, islice, takewhile/dropwhile, count/cycle',
        code: `import itertools as it

print("chain:      ", list(it.chain([1, 2], [3, 4], [5])))
print("from_iter:  ", list(it.chain.from_iterable([[1, 2], [3], [4, 5]])))

print("islice 5:   ", list(it.islice(range(100), 5)))
print("islice 5-10:", list(it.islice(range(100), 5, 10)))
print("islice step:", list(it.islice(range(20), 0, 20, 4)))

seq = [1, 2, 3, 10, 4, 5]
print("takewhile:  ", list(it.takewhile(lambda x: x < 5, seq)))
print("dropwhile:  ", list(it.dropwhile(lambda x: x < 5, seq)))

print("count:      ", list(it.islice(it.count(10, 5), 4)))
print("cycle:      ", list(it.islice(it.cycle("XY"), 5)))
print("repeat:     ", list(it.repeat(0, 3)))

# islice to bound an infinite generator:
def naturals():
    n = 1
    while True:
        yield n
        n += 1
print("first 6:    ", list(it.islice(naturals(), 6)))`,
        output: `chain:       [1, 2, 3, 4, 5]
from_iter:   [1, 2, 3, 4, 5]
islice 5:    [0, 1, 2, 3, 4]
islice 5-10: [5, 6, 7, 8, 9]
islice step: [0, 4, 8, 12, 16]
takewhile:   [1, 2, 3]
dropwhile:   [10, 4, 5]
count:       [10, 15, 20, 25]
cycle:       ['X', 'Y', 'X', 'Y', 'X']
repeat:      [0, 0, 0]
first 6:     [1, 2, 3, 4, 5, 6]`,
        explain: '`chain` concatenates iterables; `chain.from_iterable` takes one iterable-of-iterables (flatten one level). `islice(it, stop)` / `(start, stop)` / `(start, stop, step)` slices any iterable — no negatives. `takewhile` stops at the first element failing the predicate (so the `10` ends it even though `4, 5` follow); `dropwhile` skips until the first failure then yields everything. `count`/`cycle`/`repeat` are infinite — bound them with `islice`.',
        explainHi: '`chain` iterables jodता hai; `chain.from_iterable` ek iterable-of-iterables leता hai. `islice` kisi bhi iterable ko slice karता hai — koi negatives nahi. `takewhile` pehle failing element par ruकता hai (`10` ise khatam karता hai chahe `4, 5` aage hon); `dropwhile` pehle failure tak skip karता hai phir sab yield karता hai.',
      },
      {
        title: 'Combinatorics and accumulate/pairwise',
        titleHi: 'Combinatorics aur accumulate/pairwise',
        code: `import itertools as it
import operator

print("product:      ", list(it.product([1, 2], ["a", "b"])))
print("product rep=2: ", list(it.product("XY", repeat=2)))
print("permutations: ", list(it.permutations([1, 2, 3], 2)))
print("combinations: ", list(it.combinations([1, 2, 3, 4], 2)))
print("combos w/ rep:", list(it.combinations_with_replacement([1, 2], 2)))

print("running sum:  ", list(it.accumulate([1, 2, 3, 4, 5])))
print("running prod: ", list(it.accumulate([1, 2, 3, 4], operator.mul)))
print("running max:  ", list(it.accumulate([3, 1, 4, 1, 5, 9, 2], max)))
print("with initial: ", list(it.accumulate([1, 2, 3], initial=10)))

print("pairwise:     ", list(it.pairwise([1, 2, 3, 4, 5])))
print("zip_longest:  ", list(it.zip_longest([1, 2, 3], ["a"], fillvalue="_")))
print("batched:      ", list(it.batched(range(10), 3)))

# a practical use: all pairs of players for a round-robin schedule
players = ["Ann", "Bob", "Cy", "Dee"]
print("matches:      ", list(it.combinations(players, 2)))`,
        output: `product:       [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
product rep=2:  [('X', 'X'), ('X', 'Y'), ('Y', 'X'), ('Y', 'Y')]
permutations:  [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]
combinations:  [(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)]
combos w/ rep: [(1, 1), (1, 2), (2, 2)]
running sum:   [1, 3, 6, 10, 15]
running prod:  [1, 2, 6, 24]
running max:   [3, 3, 4, 4, 5, 9, 9]
with initial:  [10, 11, 13, 16]
pairwise:      [(1, 2), (2, 3), (3, 4), (4, 5)]
zip_longest:   [(1, 'a'), (2, '_'), (3, '_')]
batched:       [(0, 1, 2), (3, 4, 5), (6, 7, 8), (9,)]
matches:       [('Ann', 'Bob'), ('Ann', 'Cy'), ('Ann', 'Dee'), ('Bob', 'Cy'), ('Bob', 'Dee'), ('Cy', 'Dee')]`,
        explain: '`product` is the Cartesian product (every combination of one item from each input); `repeat=n` uses the same input n times. `permutations` is ordered (`(1,2)` and `(2,1)` both appear), `combinations` is unordered (`(1,2)` only), `combinations_with_replacement` allows repeats. `accumulate` produces running values the same length as the input — sum by default, or any binary function (`operator.mul`, `max`). `pairwise` gives consecutive `(a, b)` pairs; `batched` gives fixed-size tuples (last one short). `combinations(players, 2)` is a round-robin schedule.',
        explainHi: '`product` Cartesian product hai (har input se ek item ka har combination); `repeat=n` usi input ko n baar istemal karta hai. `permutations` ordered hai (`(1,2)` aur `(2,1)` dono), `combinations` unordered (`(1,2)` sirf). `accumulate` input ke barabar length ke running values banata hai. `pairwise` lagataar `(a, b)` pairs deta hai; `batched` fixed-size tuples. `combinations(players, 2)` ek round-robin schedule hai.',
      },
      {
        title: 'groupby: the consecutive-only trap and the sort-first fix',
        titleHi: 'groupby: consecutive-only jaal aur sort-first fix',
        code: `import itertools as it

orders = [
    {"customer": "Ada", "amount": 30},
    {"customer": "Bo", "amount": 10},
    {"customer": "Ada", "amount": 20},
    {"customer": "Cy", "amount": 5},
    {"customer": "Bo", "amount": 15},
]

key = lambda o: o["customer"]

# WRONG: unsorted -> split groups
print("unsorted groupby:")
for cust, group in it.groupby(orders, key=key):
    print(f"  {cust}: {[o['amount'] for o in group]}")

# RIGHT: sort by the same key first
print("sorted groupby:")
by_customer = {}
for cust, group in it.groupby(sorted(orders, key=key), key=key):
    by_customer[cust] = sum(o["amount"] for o in group)
print("  totals:", by_customer)

# gotcha 2: don't stash group iterators -- they share the source
print("materialising as you go (correct):")
grouped = {c: [o["amount"] for o in g]
           for c, g in it.groupby(sorted(orders, key=key), key=key)}
print("  ", grouped)`,
        output: `unsorted groupby:
  Ada: [30]
  Bo: [10]
  Ada: [20]
  Cy: [5]
  Bo: [15]
sorted groupby:
  totals: {'Ada': 50, 'Bo': 25, 'Cy': 5}
materialising as you go (correct):
   {'Ada': [30, 20], 'Bo': [10, 15], 'Cy': [5]}`,
        explain: 'On the unsorted list, `groupby` yields a new group every time `customer` changes, so `Ada` appears twice and `Bo` twice — five one-item groups. Sorting by the same `key` first puts all of one customer\'s orders together, so `groupby` produces one group per customer. The dict comprehension consumes each group (via the list comprehension) before advancing — necessary because the group iterators share the underlying sorted iterator.',
        explainHi: 'Unsorted list par, `groupby` har baar `customer` badalne par ek naya group yield karता hai, isliye `Ada` do baar dikhता hai. Pehle usi `key` se sort karna ek customer ke saare orders saath rakhता hai. Dict comprehension aage badhने se pehle har group consume karता hai — zaroori kyunki group iterators underlying sorted iterator share karते hain.',
      },
    ],

    mistakes: [
      {
        wrong: `from itertools import groupby
totals = {}
for country, group in groupby(rows, key=lambda r: r["country"]):
    totals[country] = sum(r["sales"] for r in group)
# 'rows' is not sorted by country -> countries appear multiple times, totals overwrite`,
        right: `rows.sort(key=lambda r: r["country"])           # or sorted(rows, key=...)
for country, group in groupby(rows, key=lambda r: r["country"]):
    totals[country] = sum(r["sales"] for r in group)`,
        why: '`itertools.groupby` groups only *consecutive* elements with equal keys — it never sorts. On unsorted input, a key that recurs produces a separate group each time, and (with a dict) later groups silently overwrite earlier ones. Always sort by the exact same key function first. (For a true group-by-and-aggregate over unsorted data, a plain `dict` accumulator loop is often clearer than `sorted` + `groupby`.)',
        whyHi: '`itertools.groupby` sirf *lagataar* barabar keys waale elements group karता hai — ye kabhi sort nahi karता. Unsorted input par, ek recurring key har baar ek alag group banाती hai. Hamesha pehle bilkul usi key function se sort karो.',
      },
      {
        wrong: `groups = list(groupby(sorted(data), key=fn))    # save all (key, group) pairs
for key, group in groups:
    process(key, list(group))                   # all groups after the first are EMPTY`,
        right: `for key, group in groupby(sorted(data), key=fn):
    process(key, list(group))                   # consume each group before advancing
# or up front: {k: list(g) for k, g in groupby(sorted(data), key=fn)}`,
        why: 'Each group iterator from `groupby` is a view over the *same* underlying iterator. Advancing to the next `(key, group)` pair skips past any unconsumed items of the current group. So `list(groupby(...))` captures the pairs but the group iterators are already stale. Consume (or `list()`) each group in the loop body, before the next iteration.',
        whyHi: '`groupby` se har group iterator *usi* underlying iterator par ek view hai. Agle `(key, group)` par aage badhna current group ke koi bhi unconsumed items skip karता hai. Loop body mein har group consume (ya `list()`) karो, agli iteration se pehle.',
      },
      {
        wrong: `first_ten = list(itertools.islice(huge_gen, -10))   # ValueError: negative indices not supported`,
        right: `# islice cannot go backward. For "last N" of an iterator, use a bounded buffer:
from collections import deque
last_ten = deque(huge_gen, maxlen=10)`,
        why: '`islice` works on any iterable, including one-directional generators, so it cannot support negative indices or a negative step — there is no way to look backward. To take the last N items of an iterator, feed it into a `collections.deque(maxlen=N)`, which keeps only the most recent N as it consumes.',
        whyHi: '`islice` kisi bhi iterable par kaam karता hai, one-directional generators sameत, isliye ye negative indices support nahi kar sakta. Ek iterator ke aakhri N items lene ko, ise ek `collections.deque(maxlen=N)` mein feed karो.',
      },
    ],

    realWorld: [
      {
        en: '**`itertools` is the backbone of memory-efficient data processing** — `islice` for pagination over a cursor, `chain` to concatenate query results, `groupby` (after `.order_by()`) for report aggregation, `batched`/a chunker for bulk-insert batches, `product` for generating test matrices or feature-flag combinations.',
        hi: '**`itertools` memory-efficient data processing ki reedh hai** — ek cursor par pagination ke liye `islice`, query results jodने ke liye `chain`, report aggregation ke liye `groupby` (`.order_by()` ke baad), bulk-insert batches ke liye `batched`.',
      },
      {
        en: '**The "sort then `groupby`" pattern mirrors SQL `GROUP BY`** — a database sorts (or hashes) before grouping; `itertools.groupby` makes you do the sort. For Django, `.values().order_by(key)` then `groupby` is a common in-Python aggregation when the ORM `annotate()` cannot express the grouping.',
        hi: '**"sort phir `groupby`" pattern SQL `GROUP BY` ko darshाता hai** — ek database grouping se pehle sort karता hai; `itertools.groupby` aapse sort karवाता hai. Django ke liye, `.values().order_by(key)` phir `groupby` ek aam in-Python aggregation hai.',
      },
      {
        en: '**`accumulate` computes running totals for time-series and finance** — cumulative revenue, running drawdown (`accumulate(returns, min)`), a running high-water mark, prefix sums for range queries. `pairwise` computes deltas between consecutive readings (speed from positions, day-over-day change).',
        hi: '**`accumulate` time-series aur finance ke liye running totals compute karता hai** — cumulative revenue, running drawdown, running high-water mark. `pairwise` lagataar readings ke beech deltas compute karता hai (positions se speed, din-dar-din badlaav).',
      },
    ],

    interviewQA: [
      {
        q: 'Why does `itertools.groupby` require sorted input, and how does it differ from SQL `GROUP BY` or a dict accumulator?',
        qHi: '`itertools.groupby` ko sorted input kyun chahiye, aur ye SQL `GROUP BY` ya ek dict accumulator se kaise alag hai?',
        a: 'itertools dot groupby makes a single forward pass over its input and starts a new group every time the key value differs from the previous element. It does not buffer, it does not sort, and it has no memory of keys it has already seen. So if the input is a, a, b, a, it produces three groups: a run of two a\'s, a run of one b, then a fresh run of one a. To get all elements with the same key into one group, you must arrange for them to be adjacent, which in practice means sorting the input by the exact same key function first. This is a deliberate design choice: because groupby only holds the current group, it works in constant memory on inputs of any size, including generators and streams, and it is very fast. The trade-off is that the caller is responsible for the sort. SQL GROUP BY, by contrast, is a complete aggregation: the database engine sorts or hash-partitions the rows internally and returns one row per distinct key regardless of input order, so you never think about ordering. A plain Python dict accumulator — iterate once, and for each item do result of key gets the running aggregate updated — is also order-independent and often the clearest choice when the data is not already sorted, because it avoids the sort entirely and reads as exactly what you mean. The rule of thumb: use groupby when the data is already sorted by the grouping key, or when you need the groups as iterables to process rather than a single aggregate per key; use a dict accumulator when you just need one number or list per key from unsorted data. A secondary gotcha with groupby is that each group it yields is an iterator sharing the underlying input, so you must fully consume or copy each group before advancing to the next pair, otherwise the earlier groups come back empty.',
        aHi: 'itertools dot groupby apne input par ek akela forward pass karता hai aur har baar ek naya group shuru karता hai jab key value pichhle element se alag hoती hai. Ye buffer nahi karता, ye sort nahi karता, aur iski un keys ki koi memory nahi jo isne pehle dekhi. Toh agar input a, a, b, a hai, ye teen groups banाता hai. Usi key waale saare elements ko ek group mein laने ko, aapko unhe adjacent banाना hoga, jiska vyavhaar mein matlab input ko bilkul usi key function se pehle sort karna hai. Ye ek jaan-boojhkar design chunaav hai: kyunki groupby sirf current group rakhता hai, ye kisi bhi size ke inputs par constant memory mein kaam karता hai. SQL GROUP BY, iske विpreet, ek poora aggregation hai. Ek plain Python dict accumulator bhi order-independent hai aur aksar sabse saaf chunaav jab data pehle se sorted nahi. Niyam: groupby istemal karो jab data pehle se grouping key se sorted hai; ek dict accumulator istemal karो jab aapko unsorted data se prati key sirf ek number ya list chahiye.',
      },
      {
        q: 'What does it mean that `itertools` functions are lazy, and what are the practical implications?',
        qHi: '`itertools` functions lazy hain iska kya matlab hai, aur vyavhaarik parinaam kya hain?',
        a: 'Every function in itertools returns an iterator that computes its values on demand rather than building a result list. Calling islice or chain or product or accumulate does almost no work and allocates almost no memory; the actual computation happens only as something pulls values out, one at a time, by iterating. This has several practical consequences. First, you can compose these functions freely without paying for intermediate lists: islice of takewhile of a predicate over chain of several sources is a single pipeline where each value flows through all the stages once, and total extra memory is a few iterator objects, not copies of the data at each step. Second, they work on infinite inputs. count produces integers forever, cycle repeats an iterable forever, and repeat can too; because nothing is materialised, you bound the consumption yourself with islice or takewhile or a break, and only the portion you consume is ever computed. Third, and this is the trap, every itertools result is single-use. Once you have iterated it to the end — with a for loop, list, sum, any, join, whatever — it is exhausted and yields nothing on a second pass. If you need the result more than once, or need its length, or need to index into it, you call list or tuple on it to get a concrete reusable sequence, and you do that at the specific point where you need the concrete form, not earlier. Fourth, laziness defers work and any exceptions to iteration time. If a stage in the pipeline can raise, it raises when the consumer reaches that item, which can be far from where the pipeline was constructed, so error handling has to wrap the consumption, not the construction. The overall model is: build the pipeline cheaply and lazily, then materialise deliberately at the boundary where a concrete value is actually required.',
        aHi: 'itertools mein har function ek iterator lautaता hai jo apni values maang par compute karता hai ek result list banाne ke bजaay. islice ya chain ya product ya accumulate call karna lagbhag koi kaam nahi karता aur lagbhag koi memory allocate nahi karता. Iske kai vyavhaarik parinaam hain. Pehla, aap in functions ko intermediate lists ke liye bhugtaan kiye bina swतंत्r roop se compose kar sakte ho. Doosra, wo infinite inputs par kaam karते hain. count hamesha integers banाता hai; kyunki kuch materialise nahi hota, aap consumption khud bound karते ho. Teesra, aur ye jaal hai, har itertools result single-use hai. Ek baar aapne ise ant tak iterate kiya, ye khatam hai. Agar aapko result ek se zyaada baar chahiye, aap ispar list ya tuple call karते ho. Chautha, laziness kaam aur kisi bhi exceptions ko iteration time tak defer karता hai. Overall model: pipeline ko saste aur lazily banाओ, phir us boundary par jaan-boojhkar materialise karो jahaan ek concrete value asal mein chahiye.',
      },
    ],

    exercises: [
      {
        task: 'Write `page(iterable, page_size, page_num)` (1-indexed pages) that returns one page as a list, using `itertools.islice`. `page(range(100), 10, 3)` -> `[20, 21, ..., 29]`. It must work on a generator (do not index or `len` the input).',
        taskHi: '`page(iterable, page_size, page_num)` likhо (1-indexed pages) jo ek page ek list ki tarah lautае, `itertools.islice` istemal karके. `page(range(100), 10, 3)` -> `[20, ..., 29]`.',
        hint: '`start = (page_num - 1) * page_size`; `return list(itertools.islice(iterable, start, start + page_size))`. `islice` skips the first `start` items lazily, then takes `page_size`.',
        hintHi: '`start = (page_num - 1) * page_size`; `return list(itertools.islice(iterable, start, start + page_size))`.',
      },
      {
        task: 'Given `sales = [("2026-01", 100), ("2026-01", 50), ("2026-02", 200), ("2026-01", 25), ("2026-02", 30)]`, compute the total per month TWO ways: (a) `sorted` + `itertools.groupby`, (b) a plain `dict` accumulator loop. Both should give `{"2026-01": 175, "2026-02": 230}`. Note which is clearer for unsorted data.',
        taskHi: '`sales` diya, prati mahine total DO tarikon se compute karो: (a) `sorted` + `itertools.groupby`, (b) ek plain `dict` accumulator loop. Dono `{"2026-01": 175, "2026-02": 230}` dें.',
        hint: '(a) `for m, g in groupby(sorted(sales, key=lambda t: t[0]), key=lambda t: t[0]): totals[m] = sum(v for _, v in g)`. (b) `for m, v in sales: totals[m] = totals.get(m, 0) + v`. The dict loop needs no sort and reads more directly.',
        hintHi: '(a) `for m, g in groupby(sorted(sales, key=lambda t: t[0]), key=lambda t: t[0]): totals[m] = sum(v for _, v in g)`. (b) `for m, v in sales: totals[m] = totals.get(m, 0) + v`.',
      },
      {
        task: 'Write `running_stats(nums)` that yields `(value, running_sum, running_max)` for each value, using `itertools.accumulate` twice (once with default `+`, once with `max`) and `zip`. `list(running_stats([3, 1, 4, 1, 5]))` -> `[(3,3,3), (1,4,3), (4,8,4), (1,9,4), (5,14,5)]`.',
        taskHi: '`running_stats(nums)` likhо jo har value ke liye `(value, running_sum, running_max)` yield kare, `itertools.accumulate` do baar aur `zip` istemal karके. `list(running_stats([3, 1, 4, 1, 5]))` -> `[(3,3,3), (1,4,3), (4,8,4), (1,9,4), (5,14,5)]`.',
        hint: '`nums = list(nums)` (needed twice); `sums = accumulate(nums)`; `maxes = accumulate(nums, max)`; `yield from zip(nums, sums, maxes)`. All three iterators are the same length so `zip` lines them up.',
        hintHi: '`nums = list(nums)`; `sums = accumulate(nums)`; `maxes = accumulate(nums, max)`; `yield from zip(nums, sums, maxes)`.',
      },
    ],

    keyTakeaways: [
      'Every `itertools` function returns a LAZY, SINGLE-USE iterator. Compose them freely (no intermediate lists); call `list()`/`tuple()` only where you need a concrete result.',
      'Combine: `chain(*iters)`, `chain.from_iterable(iter_of_iters)`. Limit: `islice(it, [start,] stop [,step])` (any iterable, NO negatives), `takewhile(pred, it)`, `dropwhile(pred, it)`.',
      'Infinite: `count(start, step)`, `cycle(iterable)`, `repeat(value[, n])` — bound them with `islice` / `takewhile` / a `break`.',
      'Combinatorics: `product(*iters[, repeat=n])`, `permutations(it[, r])` (ordered), `combinations(it, r)` (unordered), `combinations_with_replacement`. They grow factorially — lazy is fine, `list()` on a big one is not.',
      'Running values: `accumulate(it[, func][, initial=])` (running sum/product/max; same length as input) vs `functools.reduce` (final value only). `pairwise(it)` -> consecutive `(a, b)` pairs (3.10+).',
      '`zip_longest(*iters, fillvalue=...)` for uneven inputs. `batched(it, n)` for fixed-size chunks (3.12+).',
      '`groupby(it, key)` groups only CONSECUTIVE equal keys — it does NOT sort. Almost always `sorted(data, key=k)` first with the SAME key function.',
      '`groupby` gotcha 2: each group iterator shares the source. Fully consume (or `list()`) each group in the loop body BEFORE advancing — `list(groupby(...))` leaves the group iterators stale.',
    ],
    keyTakeawaysHi: [
      'Har `itertools` function ek LAZY, SINGLE-USE iterator lautaता hai. Unhe swतंत्r roop se compose karो; `list()`/`tuple()` sirf wahaan call karो jahaan aapko ek concrete result chahiye.',
      'Combine: `chain(*iters)`, `chain.from_iterable(iter_of_iters)`. Limit: `islice(it, [start,] stop [,step])` (koi bhi iterable, KOI negatives nahi), `takewhile`, `dropwhile`.',
      'Infinite: `count(start, step)`, `cycle(iterable)`, `repeat(value[, n])` — unhe `islice` / `takewhile` / ek `break` se bound karो.',
      'Combinatorics: `product(*iters[, repeat=n])`, `permutations(it[, r])` (ordered), `combinations(it, r)` (unordered). Ye factorially badhते hain — lazy theek hai, badे par `list()` nahi.',
      'Running values: `accumulate(it[, func][, initial=])` (running sum/product/max; input ke barabar length) vs `functools.reduce` (sirf antim value). `pairwise(it)` -> lagataar `(a, b)` pairs (3.10+).',
      '`zip_longest(*iters, fillvalue=...)` uneven inputs ke liye. `batched(it, n)` fixed-size chunks ke liye (3.12+).',
      '`groupby(it, key)` sirf LAGATAAR barabar keys group karता hai — ye sort NAHI karता. Lagbhag hamesha pehle usi key function se `sorted(data, key=k)`.',
      '`groupby` gotcha 2: har group iterator source share karता hai. Aage badhने se PEHLE loop body mein har group poori tarah consume (ya `list()`) karो.',
    ],
  },
];
