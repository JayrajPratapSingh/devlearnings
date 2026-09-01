/**
 * Python Complete Course — Module 8: Iterators, Generators & Functional Tools,
 * lessons 4-6.
 *
 * Lesson 4: `functools` — `reduce`, `partial`, `lru_cache` / `cache`,
 *           `cached_property`, `wraps`, `total_ordering`, `singledispatch`
 *           (brief); `reduce` vs a plain loop.
 * Lesson 5: `map` / `filter` / `zip` / `enumerate` and comprehension patterns —
 *           they are lazy iterators (Py3), `zip` stops at the shortest /
 *           `strict=True`, `enumerate(start=)`, `zip(*matrix)` transpose,
 *           comprehension vs `map`/`filter`, dict/set comprehensions.
 * Lesson 6: generator pipelines and when to use them — chaining generators,
 *           streaming large files, `sum`/`any`/`all`/`max` over generators,
 *           and when NOT to (need `len`, two passes, small data); framing for
 *           Django QuerySet laziness / `.iterator()`.
 *
 * NOTE for future editors: same rules as the rest of this course. Every
 * backtick inside simple/simpleHi/content/contentHi is `\`` (inline code inside
 * ``` blocks included). Escape `$` before `{` inside template literals as `\${`.
 * Keep example OUTPUT ASCII-only. `examples` use `code` + `output`; run every
 * sample with `python` and paste the REAL output. Scan for Devanagari/Cyrillic.
 * `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_8_PART2: CourseLesson[] = [
  {
    slug: 'py-functools',
    title: 'functools: partial, reduce, lru_cache, and Friends',
    titleHi: 'functools: partial, reduce, lru_cache, Aur Dost',
    description: 'Writing the same three arguments into a function call in twenty places, then re-computing an expensive pure function every time it is called with the same inputs, then hand-writing a `for` loop to fold a list into one value. `functools` has a small, sharp tool for each: `partial` pre-fills arguments, `lru_cache` memoises, `reduce` folds.',
    descriptionHi: 'Bees jagah ek function call mein wahi teen arguments likhna, phir ek mehnge pure function ko har baar dobara compute karna jab ye usi inputs ke saath call hota hai, phir ek list ko ek value mein fold karne ko ek `for` loop haath se likhna. `functools` mein har ek ke liye ek chhota, tez tool hai: `partial` arguments pre-fill karta hai, `lru_cache` memoise karta hai, `reduce` fold karta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A workshop drawer of jigs and fixtures.** `partial` is a jig: you have a saw that takes a blade angle, a depth, and a workpiece; if you keep cutting the same 45-degree bevel, you clamp a jig that holds the angle and depth, and now you just feed workpieces — a new, simpler tool made by locking some settings of an old one. `lru_cache` is a labelled bin of finished parts: before you machine a part, you check the bin; if you already made that exact part, you take the copy instead of cutting a new one, and the bin keeps the most recently made parts and discards the oldest when it fills. `reduce` is the act of folding a long strip of metal over and over onto itself until it is a single block: start with the first two pieces, combine them, combine the result with the third, and so on, ending with one thing. Each tool replaces a specific repetitive gesture — re-supplying the same arguments, re-doing the same computation, hand-rolling the same accumulation loop — with a named operation.',
      hi: '**Jigs aur fixtures ka ek workshop drawer.** `partial` ek jig hai: aapke paas ek saw hai jo ek blade angle, ek depth, aur ek workpiece leता hai; agar aap wahi 45-degree bevel kaatते rehte ho, aap ek jig clamp karते ho jo angle aur depth rakhता hai — ek purane ke kuch settings lock karके banaya ek naya, saral tool. `lru_cache` finished parts ka ek labelled bin hai: ek part machine karne se pehle, aap bin check karते ho; agar aapne wo exact part pehle banaya, aap copy leते ho ek naya kaatne ke bجaay, aur bin sabse recently bane parts rakhता hai. `reduce` ek lambi metal ki strip ko baar-baar khud par fold karne ka act hai jab tak ye ek single block na ban jaाye. Har tool ek specific repetitive gesture ki jagah leता hai.',
    },

    simple: `**\`partial\` — pre-fill some arguments, get a new function**

\`\`\`python
from functools import partial

def connect(host, port, timeout, retries):
    ...

# instead of passing the same host/port everywhere:
local_connect = partial(connect, "localhost", 5432)
local_connect(timeout=30, retries=3)         # -> connect("localhost", 5432, timeout=30, retries=3)

int2 = partial(int, base=2)
int2("1010")                                 # 10   -- parse binary
sorted(words, key=partial(sorted, key=str.lower))   # nested use
\`\`\`

**\`reduce\` — fold a sequence into one value**

\`\`\`python
from functools import reduce
import operator

reduce(operator.add, [1, 2, 3, 4])            # 10   -- ((1+2)+3)+4
reduce(operator.mul, [1, 2, 3, 4], 1)         # 24   -- with an initial value
reduce(lambda acc, d: {**acc, **d}, list_of_dicts, {})   # merge many dicts

# but prefer the builtin when one exists:
sum([1, 2, 3, 4])                             # not reduce(operator.add, ...)
max(items, key=len)                           # not reduce(...)
\`\`\`

**\`lru_cache\` / \`cache\` — memoise a pure function**

\`\`\`python
from functools import lru_cache, cache

@lru_cache(maxsize=128)                       # keep the 128 most recent distinct calls
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

fib(50)                                       # fast: ~50 real calls, not 2^50
fib.cache_info()                              # CacheInfo(hits=..., misses=..., ...)
fib.cache_clear()

@cache                                        # == lru_cache(maxsize=None), unbounded
def load_config(path):
    ...
\`\`\`

**\`cached_property\` — compute once per instance**

\`\`\`python
from functools import cached_property

class Dataset:
    @cached_property
    def stats(self):                          # runs once, then it is a plain attribute
        return expensive_analysis(self.rows)
\`\`\`

**\`wraps\` and \`total_ordering\` (covered in Module 3 / 4)**

\`\`\`python
from functools import wraps, total_ordering

def deco(fn):
    @wraps(fn)                                # keep fn's __name__, __doc__, signature
    def inner(*a, **kw): ...
    return inner

@total_ordering
class V:
    def __eq__(self, o): ...
    def __lt__(self, o): ...                  # -> __le__, __gt__, __ge__ derived
\`\`\`

\`\`\`
partial(fn, *args, **kwargs)   -> a new callable with those args pre-bound (leftmost
                                 positionals, any keywords). Great for callbacks, keys.

reduce(fn, iterable[, initial]) -> fold left: fn(fn(fn(init, a), b), c) ...
                                  Use ONLY when no builtin fits (sum/max/min/any/all/
                                  "".join/math.prod all beat reduce for readability).

lru_cache(maxsize=128) / cache  -> memoise. Args must be HASHABLE. PURE functions only.
                                  NOT on methods (keeps every self alive -> leak).
                                  .cache_info() / .cache_clear()
cached_property                 -> a @property computed once per instance, then stored.
                                  Needs the instance to have __dict__ (not __slots__).

wraps(fn)          -> copy metadata onto a wrapper (every decorator needs this)
total_ordering     -> fill in the other 3 comparison ops from __eq__ + __lt__
singledispatch     -> function overloading by the type of the FIRST argument
\`\`\``,

    simpleHi: `**\`partial\` — kuch arguments pre-fill karo, ek naya function pao**

\`\`\`python
from functools import partial

def connect(host, port, timeout, retries):
    ...

local_connect = partial(connect, "localhost", 5432)
local_connect(timeout=30, retries=3)         # -> connect("localhost", 5432, timeout=30, retries=3)

int2 = partial(int, base=2)
int2("1010")                                 # 10   -- binary parse
\`\`\`

**\`reduce\` — ek sequence ko ek value mein fold karo**

\`\`\`python
from functools import reduce
import operator

reduce(operator.add, [1, 2, 3, 4])            # 10   -- ((1+2)+3)+4
reduce(operator.mul, [1, 2, 3, 4], 1)         # 24   -- ek initial value ke saath

# par jab ek builtin ho tab ise prefer karo:
sum([1, 2, 3, 4])                             # reduce(operator.add, ...) nahi
\`\`\`

**\`lru_cache\` / \`cache\` — ek pure function memoise karo**

\`\`\`python
from functools import lru_cache, cache

@lru_cache(maxsize=128)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

fib(50)                                       # tez: ~50 asli calls, 2^50 nahi
fib.cache_info()
fib.cache_clear()

@cache                                        # == lru_cache(maxsize=None), unbounded
def load_config(path):
    ...
\`\`\`

**\`cached_property\` — prati instance ek baar compute**

\`\`\`python
from functools import cached_property

class Dataset:
    @cached_property
    def stats(self):                          # ek baar chalta hai, phir ek plain attribute
        return expensive_analysis(self.rows)
\`\`\`

\`\`\`
partial(fn, *args, **kwargs)   -> un args ke saath ek naya callable (leftmost
                                 positionals, koi bhi keywords). Callbacks, keys ke liye.

reduce(fn, iterable[, initial]) -> fold left: fn(fn(fn(init, a), b), c) ...
                                  SIRF tab istemal karo jab koi builtin fit nahi (sum/max/
                                  min/any/all/"".join/math.prod sab reduce se behtar).

lru_cache(maxsize=128) / cache  -> memoise. Args HASHABLE hone chahiye. Sirf PURE functions.
                                  Methods par NAHI (har self ko zinda rakhta -> leak).
                                  .cache_info() / .cache_clear()
cached_property                 -> ek @property prati instance ek baar compute, phir stored.
                                  Instance ke paas __dict__ hona chahiye (__slots__ nahi).

wraps(fn)          -> ek wrapper par metadata copy karo (har decorator ko chahiye)
total_ordering     -> __eq__ + __lt__ se baaki 3 comparison ops bharo
singledispatch     -> PEHLE argument ke type se function overloading
\`\`\``,

    content: `## \`partial\` — the details

\`\`\`python
from functools import partial

# leftmost positional args are pre-filled; the rest come from the call:
add = lambda a, b, c: a + b + c
add_10 = partial(add, 10)
add_10(2, 3)                     # 15  -> add(10, 2, 3)

# keyword args are pre-filled and can still be overridden:
p = partial(sorted, reverse=True)
p([3, 1, 2])                     # [3, 2, 1]
p([3, 1, 2], reverse=False)     # [1, 2, 3]  -- the call wins

# introspection:
p.func, p.args, p.keywords      # (sorted, (), {'reverse': True})
\`\`\`

\`partial\` is most useful for: adapting a function to a callback signature (\`button.on_click(partial(save, doc_id))\`), building a family of specialised functions, and supplying a \`key=\` or \`default_factory\` that needs an argument.

## \`reduce\` — and why builtins usually win

\`\`\`python
from functools import reduce
import operator, math

reduce(operator.add, nums)          # -> sum(nums)
reduce(operator.mul, nums, 1)       # -> math.prod(nums)
reduce(lambda a, b: a if a > b else b, nums)   # -> max(nums)
reduce(operator.or_, sets)          # -> set().union(*sets)
reduce(operator.iconcat, lists, []) # -> list(chain.from_iterable(lists))
\`\`\`

\`reduce\` is right when the fold operation is genuinely custom and there is no builtin — merging config dicts with precedence, composing a list of functions, walking a nested structure by a path. Otherwise a builtin or an explicit loop reads better; \`reduce\` was even removed from builtins in Python 3 for that reason.

## \`lru_cache\` — the rules (recap + depth)

\`\`\`python
@lru_cache(maxsize=None)             # unbounded == @cache
def parse_rule(text): ...

@lru_cache(maxsize=1000)             # bounded LRU: evicts the least-recently-used
def geocode(address): ...
\`\`\`

- **Arguments must be hashable.** \`lru_cache\` keys on \`args\` + sorted \`kwargs\`. A list/dict/set argument raises \`TypeError\`. Pass a tuple or \`frozenset\`.
- **Pure functions only.** If the result can change over time (reads a file, hits a DB, depends on the clock), caching serves stale data.
- **Never on a method.** The cache keys on \`self\`, holding a strong reference to every instance forever — a slow memory leak — and shares one cache across instances. Use \`cached_property\` (no args) or an instance-level dict.
- **Introspect:** \`.cache_info()\` returns hits/misses/maxsize/currsize; \`.cache_clear()\` empties it (useful in tests).
- **Thread-safe** for the cache bookkeeping, but the wrapped function may still run twice concurrently on a cold key.

## \`singledispatch\` — overload by first-argument type

\`\`\`python
from functools import singledispatch

@singledispatch
def describe(x):
    return f"unknown: {x!r}"

@describe.register
def _(x: int):
    return f"int {x} ({'even' if x % 2 == 0 else 'odd'})"

@describe.register
def _(x: list):
    return f"list of {len(x)}"

describe(4)          # 'int 4 (even)'
describe([1, 2])     # 'list of 2'
describe("hi")       # "unknown: 'hi'"
\`\`\`

A clean alternative to a chain of \`isinstance\` checks when behaviour genuinely varies by type. \`singledispatchmethod\` is the method version.

## \`reduce\` composition example

\`\`\`python
from functools import reduce

def compose(*funcs):
    # compose(f, g, h)(x) == f(g(h(x)))
    return reduce(lambda outer, inner: lambda x: outer(inner(x)), funcs)

pipeline = compose(str.strip, str.lower, lambda s: s.replace(" ", "-"))
pipeline("  Hello World  ")     # 'hello-world'
\`\`\``,

    contentHi: `## \`partial\` — vivaran

\`\`\`python
from functools import partial

add = lambda a, b, c: a + b + c
add_10 = partial(add, 10)
add_10(2, 3)                     # 15  -> add(10, 2, 3)

# keyword args pre-fill hote hain aur abhi bhi override ho sakte hain:
p = partial(sorted, reverse=True)
p([3, 1, 2])                     # [3, 2, 1]
p([3, 1, 2], reverse=False)     # [1, 2, 3]  -- call jeetta hai

p.func, p.args, p.keywords      # (sorted, (), {'reverse': True})
\`\`\`

\`partial\` sabse upyogi hai: ek function ko ek callback signature ke liye adapt karne, specialised functions ka ek family banane, aur ek \`key=\` supply karne ke liye jise ek argument chahiye.

## \`reduce\` — aur builtins aksar kyun jeette hain

\`\`\`python
from functools import reduce
import operator, math

reduce(operator.add, nums)          # -> sum(nums)
reduce(operator.mul, nums, 1)       # -> math.prod(nums)
reduce(operator.or_, sets)          # -> set().union(*sets)
\`\`\`

\`reduce\` tab sahi hai jab fold operation sachmuch custom hai aur koi builtin nahi. Warna ek builtin ya ek explicit loop behtar padhta hai; is kaaran \`reduce\` Python 3 mein builtins se hataa diya gaya.

## \`lru_cache\` — niyam

\`\`\`python
@lru_cache(maxsize=None)             # unbounded == @cache
def parse_rule(text): ...

@lru_cache(maxsize=1000)             # bounded LRU
def geocode(address): ...
\`\`\`

- **Arguments hashable hone chahiye.** Ek list/dict/set argument \`TypeError\` deta hai. Ek tuple ya \`frozenset\` pass karo.
- **Sirf pure functions.** Agar result samay ke saath badal sakta hai, caching stale data serve karta hai.
- **Kabhi ek method par nahi.** Cache \`self\` par key karta hai, har instance ka ek strong reference hamesha rakhte hue — ek dheema memory leak. \`cached_property\` (koi args nahi) ya ek instance-level dict istemal karo.
- **Introspect:** \`.cache_info()\` hits/misses/maxsize/currsize lautata hai; \`.cache_clear()\` ise khaali karta hai.

## \`singledispatch\` — pehle-argument type se overload

\`\`\`python
from functools import singledispatch

@singledispatch
def describe(x):
    return f"unknown: {x!r}"

@describe.register
def _(x: int):
    return f"int {x} ({'even' if x % 2 == 0 else 'odd'})"

@describe.register
def _(x: list):
    return f"list of {len(x)}"

describe(4)          # 'int 4 (even)'
describe([1, 2])     # 'list of 2'
\`\`\`

\`isinstance\` checks ki ek chain ka ek saaf vikalp jab behaviour sachmuch type se badalta hai.

## \`reduce\` composition udaharan

\`\`\`python
from functools import reduce

def compose(*funcs):
    return reduce(lambda outer, inner: lambda x: outer(inner(x)), funcs)

pipeline = compose(str.strip, str.lower, lambda s: s.replace(" ", "-"))
pipeline("  Hello World  ")     # 'hello-world'
\`\`\``,

    examples: [
      {
        title: 'partial: pre-binding arguments; introspection',
        titleHi: 'partial: arguments pre-bind; introspection',
        code: `from functools import partial

def render(template, *, indent, upper, prefix):
    text = template.replace(" ", "_" * indent)
    if upper:
        text = text.upper()
    return prefix + text

# a specialised renderer with 3 options fixed:
log_render = partial(render, indent=2, upper=True, prefix="[LOG] ")
print(log_render("hello world"))
print(log_render("hello world", prefix="[ERR] "))   # override a pre-bound kwarg

# pre-bind a leftmost positional:
def power(base, exp):
    return base ** exp
square = partial(power, exp=2)   # wait -- exp is keyword here
cube = partial(power, exp=3)
print(square(5), cube(5))

from_base2 = partial(int, base=2)
from_base16 = partial(int, base=16)
print(from_base2("1101"), from_base16("ff"))

# introspection:
p = partial(sorted, key=len, reverse=True)
print("func:", p.func.__name__, "| keywords:", p.keywords)
print(p(["ccc", "a", "bb"]))`,
        output: `[LOG] HELLO__WORLD
[ERR] HELLO__WORLD
25 125
13 255
func: sorted | keywords: {'key': <built-in function len>, 'reverse': True}
['ccc', 'bb', 'a']`,
        explain: '`partial(render, indent=2, upper=True, prefix="[LOG] ")` builds a new callable with those keyword arguments pre-bound; the call still supplies `template` and can override `prefix`. `partial(int, base=2)` makes a binary parser. `p.func`, `p.args`, and `p.keywords` let you inspect what was bound. `partial` is ideal for callbacks and `key=` functions that need configuration.',
        explainHi: '`partial(render, indent=2, upper=True, prefix="[LOG] ")` un keyword arguments ke saath ek naya callable banata hai; call abhi bhi `template` deta hai aur `prefix` override kar sakta hai. `partial(int, base=2)` ek binary parser banata hai. `p.func`, `p.args`, aur `p.keywords` inspect karne dete hain kya bound tha.',
      },
      {
        title: 'reduce vs builtins; a legitimate reduce (function composition)',
        titleHi: 'reduce vs builtins; ek jaayaz reduce (function composition)',
        code: `from functools import reduce
import operator, math

nums = [2, 3, 4, 5]

# these reduces all have a clearer builtin equivalent:
print("reduce add:", reduce(operator.add, nums), "==", sum(nums))
print("reduce mul:", reduce(operator.mul, nums, 1), "==", math.prod(nums))
print("reduce max:", reduce(lambda a, b: a if a > b else b, nums), "==", max(nums))

# a legitimate use: merge dicts with left-to-right precedence
configs = [{"a": 1, "b": 2}, {"b": 3, "c": 4}, {"c": 5, "d": 6}]
merged = reduce(lambda acc, d: {**acc, **d}, configs, {})
print("merged:", merged)

# another: compose a pipeline of single-arg functions
def compose(*funcs):
    return reduce(lambda f, g: lambda x: f(g(x)), funcs)

clean = compose(str.strip, str.lower, lambda s: s.replace("  ", " "))
print("clean:", repr(clean("  Hello   World  ")))

# fold with an accumulator that is not the same type as the elements:
words = ["the", "quick", "brown", "fox"]
index = reduce(lambda acc, w: acc + [(len(acc), w)], words, [])
print("index:", index)`,
        output: `reduce add: 14 == 14
reduce mul: 120 == 120
reduce max: 5 == 5
merged: {'a': 1, 'b': 3, 'c': 5, 'd': 6}
clean: 'hello  world'
index: [(0, 'the'), (1, 'quick'), (2, 'brown'), (3, 'fox')]`,
        explain: 'The first three `reduce` calls each have a clearer builtin (`sum`, `math.prod`, `max`) — prefer those. `reduce` earns its place for genuinely custom folds: `merged` combines dicts with later keys winning; `compose` folds a list of functions into one (note `replace("  ", " ")` is a single non-overlapping pass, so `"   "` collapses to `"  "`, not `" "`); `index` builds a list whose accumulator type differs from the element type. When you can name the operation as a builtin, use the builtin.',
        explainHi: 'Pehle teen `reduce` calls mein har ek ka ek saaf builtin hai (`sum`, `math.prod`, `max`) — unhe prefer karo. `reduce` sachmuch custom folds ke liye apni jagah kamata hai: `merged` dicts combine karta hai; `compose` functions ki ek list ko ek mein fold karta hai. Jab aap operation ko ek builtin ki tarah naam de sakte ho, builtin istemal karo.',
      },
      {
        title: 'lru_cache: hits/misses, hashable-args rule, cache_clear',
        titleHi: 'lru_cache: hits/misses, hashable-args niyam, cache_clear',
        code: `from functools import lru_cache

calls = {"n": 0}

@lru_cache(maxsize=None)
def slow_fib(n):
    calls["n"] += 1
    return n if n < 2 else slow_fib(n - 1) + slow_fib(n - 2)

print("fib(30):", slow_fib(30))
print("real calls:", calls["n"])          # ~31, not millions
print(slow_fib.cache_info())

# a second call is a pure cache hit:
before = slow_fib.cache_info().hits
slow_fib(30)
print("extra hits:", slow_fib.cache_info().hits - before)

# unhashable argument -> TypeError
@lru_cache
def total(items):
    return sum(items)

try:
    total([1, 2, 3])
except TypeError as e:
    print("list arg:", "unhashable" in str(e))
print("tuple arg:", total((1, 2, 3)))

# clearing the cache (common in tests):
slow_fib.cache_clear()
calls["n"] = 0
slow_fib(10)
print("after clear, real calls for fib(10):", calls["n"])`,
        output: `fib(30): 832040
real calls: 31
CacheInfo(hits=28, misses=31, maxsize=None, currsize=31)
extra hits: 1
list arg: True
tuple arg: 6
after clear, real calls for fib(10): 11`,
        explain: '`@lru_cache` turns exponential `fib` into linear: `slow_fib(30)` runs its body only 31 times (once per distinct `n`), with 28 cache hits during the recursion. A repeat call is a pure hit. `total([1,2,3])` raises `TypeError` because a list is unhashable and `lru_cache` must hash the arguments to key the cache; `(1,2,3)` works. `cache_clear()` empties the cache so `fib(10)` recomputes from scratch (11 calls).',
        explainHi: '`@lru_cache` exponential `fib` ko linear banata hai: `slow_fib(30)` apna body sirf 31 baar chalata hai, recursion ke dauraan 28 cache hits ke saath. `total([1,2,3])` `TypeError` deta hai kyunki ek list unhashable hai aur `lru_cache` ko cache key karne ko arguments hash karne chahiye; `(1,2,3)` kaam karta hai. `cache_clear()` cache khaali karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `class UserService:
    @lru_cache(maxsize=None)
    def get_user(self, user_id):        # cache keys on (self, user_id)
        return self.db.fetch(user_id)`,
        right: `class UserService:
    def __init__(self):
        self._user_cache = {}
    def get_user(self, user_id):
        if user_id not in self._user_cache:
            self._user_cache[user_id] = self.db.fetch(user_id)
        return self._user_cache[user_id]
# or @functools.cached_property for a no-argument computed value`,
        why: '`lru_cache` on a method keys on `self` along with the other arguments, so the cache holds a strong reference to every `UserService` instance it has seen — those objects can never be garbage-collected, a leak that grows with usage. It also shares one cache across all instances. Use an instance dict, or `cached_property` for the argument-free case.',
        whyHi: 'Ek method par `lru_cache` `self` par doosre arguments ke saath key karta hai, isliye cache har `UserService` instance ka ek strong reference rakhta hai — wo objects kabhi garbage-collect nahi ho sakte, ek leak jo istemal ke saath badhti hai. Ek instance dict, ya argument-free case ke liye `cached_property` istemal karo.',
      },
      {
        wrong: `total = reduce(lambda a, b: a + b, prices)
biggest = reduce(lambda a, b: a if a > b else b, prices)
joined = reduce(lambda a, b: a + ", " + b, names)`,
        right: `total = sum(prices)
biggest = max(prices)
joined = ", ".join(names)`,
        why: 'Every one of these `reduce` calls re-implements a builtin, less readably and (for the string case) with O(n^2) concatenation. `reduce` is worth using only when the fold is genuinely custom and no builtin fits. Reach for `sum`, `max`, `min`, `any`, `all`, `math.prod`, `"".join`, `set().union(*...)` first.',
        whyHi: 'Inmein se har `reduce` call ek builtin ko dobara implement karta hai, kam readably aur (string case ke liye) O(n^2) concatenation ke saath. `reduce` sirf tab istemal karne yogya hai jab fold sachmuch custom hai. Pehle `sum`, `max`, `min`, `any`, `all`, `math.prod`, `"".join` ke liye pahuncho.',
      },
      {
        wrong: `@lru_cache
def current_price(symbol):
    return fetch_live_price(symbol)     # the price changes every second!`,
        right: `# do not cache a function whose result changes over time.
# if you need a short-lived cache, use a TTL cache (cachetools) or cache with a
# time bucket as an extra argument:
@lru_cache(maxsize=256)
def price_at(symbol, minute_bucket):
    return fetch_live_price(symbol)`,
        why: '`lru_cache` assumes the function is pure — same arguments always give the same result. Caching a function that reads live data, the filesystem, a database, or the clock means callers silently get stale values, sometimes for the life of the process. Only memoise deterministic pure computations.',
        whyHi: '`lru_cache` maanta hai function pure hai — same arguments hamesha same result dete hain. Ek function cache karna jo live data padhta hai matlab callers chupchaap stale values paate hain. Sirf deterministic pure computations memoise karo.',
      },
    ],

    realWorld: [
      {
        en: '**`functools.partial` is everywhere in callback-based and event-driven code** — `signal.connect(partial(handler, extra_arg))`, `Thread(target=partial(work, config))`, Django `path("...", partial(view, mode="edit"))`, `sorted(data, key=partial(get_field, "created"))`.',
        hi: '**`functools.partial` callback-based aur event-driven code mein har jagah hai** — `signal.connect(partial(handler, extra_arg))`, `Thread(target=partial(work, config))`, `sorted(data, key=partial(get_field, "created"))`.',
      },
      {
        en: '**`@lru_cache` / `@cache` on pure config/lookup functions is standard** — parsing a settings file, compiling a regex, building a permission matrix, resolving a template path. `@cached_property` is all over Django models and DRF serializers for derived values.',
        hi: '**Pure config/lookup functions par `@lru_cache` / `@cache` standard hai** — ek settings file parse karna, ek regex compile karna, ek permission matrix banana. `@cached_property` Django models aur DRF serializers par har jagah hai.',
      },
      {
        en: '**`reduce` shows up mostly in framework/library internals** — merging middleware, composing validators, folding a query filter tree. Application code overwhelmingly uses `sum`/`max`/`any`/`"".join` or an explicit accumulator loop, which is why `reduce` lives in `functools` and not the builtins.',
        hi: '**`reduce` zyaadatar framework/library internals mein dikhta hai** — middleware merge karna, validators compose karna. Application code bhaari roop se `sum`/`max`/`any`/`"".join` ya ek explicit accumulator loop istemal karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does `functools.partial` do, and when would you use it over a lambda?',
        qHi: '`functools.partial` kya karta hai, aur aap ise ek lambda par kab istemal karoge?',
        a: 'partial takes a callable plus some arguments and returns a new callable that, when invoked, calls the original with those arguments already supplied plus whatever else is passed at call time. Positional arguments given to partial are bound leftmost, so they fill the first parameters and the caller supplies the rest; keyword arguments given to partial are bound by name and can be overridden by the caller. The result is a lightweight object, not a full function, and it exposes the original function, the bound positional args, and the bound keywords as attributes for introspection. You use it whenever you need to adapt a function that takes several arguments to a context that will call it with fewer. The classic cases are callbacks and hooks: an event system that will call your handler with just the event needs a handler that also knows some context, so you pass partial of handler with the context pre-bound. Similarly for a key function that needs a parameter, a thread or process target that needs configuration, or building a family of specialised functions from one general one, like binary and hex parsers from int with base pre-bound. Compared to a lambda, partial has a few advantages. It evaluates its bound arguments once, at the time partial is called, whereas a lambda closes over variables and re-reads them each call, which matters if those variables change or if you are creating partials in a loop. It is introspectable — you can see what was bound. It is marginally faster since there is no Python-level function call wrapper. And it reads as intent: partial of send with doc_id says "send, specialised to this document" more clearly than lambda dot dot dot. The lambda wins when you need to reorder or transform arguments, not just pre-fill them, or when the bound expression is more than a value.',
        aHi: 'partial ek callable plus kuch arguments leta hai aur ek naya callable lautata hai jo, jab invoke hota hai, original ko un arguments ke saath pehle se diye plus call time par jo bhi aur pass hua ke saath call karta hai. partial ko diye positional arguments leftmost bound hote hain; keyword arguments naam se bound hote hain aur caller dwara override ho sakte hain. Nateeja ek lightweight object hai, aur ye original function, bound positional args, aur bound keywords ko attributes ki tarah introspection ke liye expose karta hai. Aap ise tab istemal karte ho jab aapko kai arguments lene wale ek function ko ek context ke liye adapt karna hai jo ise kam ke saath call karega. Classic cases callbacks aur hooks hain. Ek lambda ke muqable, partial ke kuch faayde hain. Ye apne bound arguments ek baar evaluate karta hai, jabki ek lambda variables par close karta hai. Ye introspectable hai. Lambda tab jeetta hai jab aapko arguments reorder ya transform karne hain, sirf pre-fill nahi.',
      },
      {
        q: 'What are the correctness rules for `functools.lru_cache`, and why should you not put it on a method?',
        qHi: '`functools.lru_cache` ke correctness niyam kya hain, aur aapko ise ek method par kyun nahi rakhna chahiye?',
        a: 'lru_cache stores a mapping from the function\'s arguments to its return value, so repeated calls with the same arguments skip the body. Three rules govern correct use. First, the arguments must be hashable, because the cache is keyed on a tuple of the positional args plus the sorted keyword items, and that key must be hashable. Passing a list, dict, or set raises TypeError; you convert to a tuple or frozenset at the boundary. Second, the function must be pure — its output must depend only on its arguments, with no dependence on external mutable state, the filesystem, a database, the network, or the current time. Caching an impure function silently serves stale results, potentially for the entire lifetime of the process. Third, the cache lives for the life of the process and, with the default maxsize of 128, evicts the least recently used entry when full; use maxsize equals None, or the cache decorator, for an unbounded cache, and set an explicit bound when the key space is large. Putting lru_cache on a method is a specific mistake because the method\'s first argument is self, so the cache key includes the instance. That means the cache holds a strong reference to every instance the method has ever been called on, and those instances can never be garbage collected while the cache — which is attached to the function, a class-level object — is alive, which is for the life of the process. On a long-running service with many short-lived instances, this is a steadily growing memory leak. It also means the cache is shared across all instances rather than being per-instance, so two objects with the same argument get the same cached result even if their internal state differs. The fixes are: for a computed value with no arguments, use cached_property, which stores the result on the instance itself so it is collected with the instance; for a method that takes arguments, use an explicit dictionary created in the constructor.',
        aHi: 'lru_cache function ke arguments se iski return value ka ek mapping store karta hai. Teen niyam sahi istemal ko control karte hain. Pehla, arguments hashable hone chahiye, kyunki cache positional args plus sorted keyword items ke ek tuple par keyed hai. Ek list, dict, ya set pass karna TypeError deta hai. Doosra, function pure hona chahiye — iska output sirf iske arguments par nirbhar karna chahiye. Ek impure function cache karna chupchaap stale results serve karta hai. Teesra, cache process ke jeevan bhar rehta hai. lru_cache ko ek method par rakhna ek specific galti hai kyunki method ka pehla argument self hai, isliye cache key mein instance shaamil hai. Iska matlab cache har instance ka ek strong reference rakhta hai, aur wo instances kabhi garbage collect nahi ho sakte. Ek long-running service par, ye ek lagataar badhta memory leak hai. Fixes: bina arguments waali ek computed value ke liye, cached_property istemal karo; arguments lene wale ek method ke liye, constructor mein banaya ek explicit dictionary.',
      },
    ],

    exercises: [
      {
        task: 'Write `make_logger(level, prefix)` that returns a `partial` of a `log(level, prefix, message)` function with `level` and `prefix` pre-bound. Create `info = make_logger("INFO", "[app] ")` and `err = make_logger("ERROR", "[app] ")`, call each with just a message, and confirm the pre-bound values are used. Also show `info(msg, prefix="[db] ")` overrides the prefix.',
        taskHi: '`make_logger(level, prefix)` likho jo ek `log(level, prefix, message)` function ka ek `partial` lautae `level` aur `prefix` pre-bound ke saath. `info` aur `err` banao, har ek ko sirf ek message ke saath call karo.',
        hint: '`from functools import partial`; `def make_logger(level, prefix): return partial(log, level, prefix)`. Then `info("started")` calls `log("INFO", "[app] ", "started")`. A pre-bound *positional* cannot be overridden, but if you bind `prefix` as a keyword (`partial(log, level, prefix=prefix)`) the call can override it.',
        hintHi: '`from functools import partial`; `def make_logger(level, prefix): return partial(log, level, prefix)`. `prefix` ko keyword ki tarah bind karo (`partial(log, level, prefix=prefix)`) taaki call ise override kar sake.',
      },
      {
        task: 'Write `word_frequencies(text)` that returns a `{word: count}` dict, implemented with `functools.reduce` over the words (accumulator is the dict). Then write the same thing with a plain `for` loop and `dict.get`. State which you would ship and why.',
        taskHi: '`word_frequencies(text)` likho jo ek `{word: count}` dict lautae, `functools.reduce` se words par implement kiya. Phir wahi cheez ek plain `for` loop aur `dict.get` se. Batao aap kaunsa ship karoge.',
        hint: '`reduce(lambda acc, w: {**acc, w: acc.get(w, 0) + 1}, text.split(), {})` — but this rebuilds the dict every word (O(n^2)). The loop `for w in text.split(): counts[w] = counts.get(w, 0) + 1` is O(n) and clearer. Ship the loop (or `collections.Counter`).',
        hintHi: '`reduce(lambda acc, w: {**acc, w: acc.get(w, 0) + 1}, text.split(), {})` — par ye har word dict dobara banata hai (O(n^2)). Loop O(n) aur saaf hai. Loop ship karo (ya `collections.Counter`).',
      },
      {
        task: 'Write `@lru_cache`d `edit_distance(a, b)` (Levenshtein) recursively. Add a `calls` counter. Compute `edit_distance("kitten", "sitting")` (should be 3) and print the real call count with and without the cache. Then call it with a list argument and catch the `TypeError`. Finally `cache_clear()` and show the count resets.',
        taskHi: 'Recursively `@lru_cache`d `edit_distance(a, b)` (Levenshtein) likho. Ek `calls` counter jodo. `edit_distance("kitten", "sitting")` compute karo (3 hona chahiye) aur cache ke saath aur bina real call count print karo.',
        hint: 'Base cases: empty `a` -> `len(b)`, empty `b` -> `len(a)`. Recurse on `a[1:]`/`b[1:]` with a +1 for insert/delete/substitute (0 if `a[0] == b[0]`). Pass `a` and `b` as strings (hashable). A list argument raises `TypeError: unhashable type` for a list.',
        hintHi: 'Base cases: empty `a` -> `len(b)`, empty `b` -> `len(a)`. `a[1:]`/`b[1:]` par recurse karo insert/delete/substitute ke liye +1 ke saath. `a` aur `b` strings ki tarah pass karo. Ek list argument `TypeError` deta hai.',
      },
    ],

    keyTakeaways: [
      '`partial(fn, *args, **kwargs)` returns a new callable with those arguments pre-bound (positionals leftmost, keywords overridable by the call). Ideal for callbacks, `key=` functions, thread targets. It evaluates bound args once and is introspectable (`.func`, `.args`, `.keywords`).',
      '`reduce(fn, iterable[, initial])` folds left. Use it ONLY when no builtin fits — `sum`, `max`, `min`, `any`, `all`, `math.prod`, `"".join`, `set().union(*...)` are clearer and often faster. `reduce` was moved out of builtins in Python 3 for this reason.',
      '`@lru_cache(maxsize=N)` / `@cache` memoise a function. Arguments MUST be hashable (no list/dict/set). Only for PURE functions — impure ones serve stale data. `.cache_info()` / `.cache_clear()`.',
      'NEVER put `lru_cache` on a method — it keys on `self`, holding every instance alive forever (memory leak) and sharing one cache across instances. Use `cached_property` (no args) or an instance dict.',
      '`@cached_property` computes a `@property` once per instance and stores it as a normal attribute. Needs the instance to have `__dict__` (fails with `__slots__`).',
      '`@functools.wraps(fn)` on a decorator\'s wrapper copies `__name__`/`__doc__`/signature — every decorator needs it.',
      '`@functools.total_ordering` fills in the other 3 comparison operators from `__eq__` + `__lt__`.',
      '`@functools.singledispatch` overloads a function by the type of its first argument — a clean alternative to an `isinstance` chain.',
    ],
    keyTakeawaysHi: [
      '`partial(fn, *args, **kwargs)` un arguments ke saath ek naya callable lautata hai (positionals leftmost, keywords call dwara overridable). Callbacks, `key=` functions, thread targets ke liye aadarsh. Ye bound args ek baar evaluate karta hai aur introspectable hai.',
      '`reduce(fn, iterable[, initial])` left fold karta hai. Ise SIRF tab istemal karo jab koi builtin fit nahi — `sum`, `max`, `min`, `any`, `all`, `math.prod`, `"".join` saaf aur aksar tez hain.',
      '`@lru_cache(maxsize=N)` / `@cache` ek function memoise karte hain. Arguments HASHABLE hone CHAHIYE (koi list/dict/set nahi). Sirf PURE functions ke liye. `.cache_info()` / `.cache_clear()`.',
      'KABHI `lru_cache` ek method par mat rakho — ye `self` par key karta hai, har instance ko hamesha zinda rakhte hue (memory leak). `cached_property` (koi args nahi) ya ek instance dict istemal karo.',
      '`@cached_property` ek `@property` ko prati instance ek baar compute karta hai aur ise ek normal attribute ki tarah store karta hai. Instance ke paas `__dict__` hona chahiye (`__slots__` ke saath fail).',
      '`@functools.wraps(fn)` ek decorator ke wrapper par `__name__`/`__doc__`/signature copy karta hai — har decorator ko chahiye.',
      '`@functools.total_ordering` `__eq__` + `__lt__` se baaki 3 comparison operators bharta hai.',
      '`@functools.singledispatch` ek function ko iske pehle argument ke type se overload karta hai — ek `isinstance` chain ka ek saaf vikalp.',
    ],
  },

  {
    slug: 'py-map-filter-zip-enumerate',
    title: 'map, filter, zip, enumerate, and Comprehension Patterns',
    titleHi: 'map, filter, zip, enumerate, Aur Comprehension Patterns',
    description: 'Zipping a list of 5 names with a list of 3 scores and silently losing two names, or writing `for i in range(len(items))` when `enumerate` exists. These four builtins are lazy iterators with sharp edges — `zip` truncates to the shortest, `map`/`filter` are one-shot — and a comprehension is usually clearer than `map`/`filter` + `lambda`.',
    descriptionHi: '5 names ki ek list ko 3 scores ki ek list ke saath zip karna aur chupchaap do names khona, ya `for i in range(len(items))` likhna jab `enumerate` maujood hai. Ye chaar builtins tez dhaar waale lazy iterators hain — `zip` sabse chhote tak truncate karta hai, `map`/`filter` one-shot hain — aur ek comprehension aksar `map`/`filter` + `lambda` se saaf hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 5,

    analogy: {
      en: '**Four assembly-line stations, each with a specific job and a specific hazard.** `map` is a station that applies one operation to every part rolling past — paint each one, drill each one. `filter` is an inspector that lets some parts through and pushes the rest off the belt. `zip` is a station that pairs up parts from two belts running alongside each other, one from each — but the moment either belt runs empty, `zip` stops, so if belt A has 5 parts and belt B has 3, you get 3 pairs and belts A\'s last 2 parts are silently dropped off the end. `enumerate` is a station that stamps a sequence number on each part as it passes, so you always know you are on part 0, part 1, part 2, without a separate counter. All four are conveyor stations, not warehouses: parts flow through once. If you want to run the belt again, or count what came off it, you have to collect the output into a bin (`list(...)`) first. And most of the time, `map` + a small custom operation is more clearly written as a comprehension, which reads in the order things happen: take this, from that, where this.',
      hi: '**Chaar assembly-line stations, har ek ek specific kaam aur ek specific khatra ke saath.** `map` ek station hai jo har guzarte part par ek operation lagata hai. `filter` ek inspector hai jo kuch parts ko jaane deta hai aur baaki ko belt se dhakel deta hai. `zip` ek station hai jo do belts se parts pair karta hai — par jis pal koi bhi belt khaali ho jaati hai, `zip` ruk jaata hai, isliye agar belt A mein 5 parts aur belt B mein 3, aapko 3 pairs milte hain aur belt A ke aakhri 2 parts chupchaap chhod diye jaate hain. `enumerate` ek station hai jo har part par ek sequence number stamp karta hai. Chaaron conveyor stations hain, warehouses nahi: parts ek baar bahte hain.',
    },

    simple: `**They are all lazy iterators (Python 3)**

\`\`\`python
map(str, [1, 2, 3])                    # <map object>   -- nothing computed yet
list(map(str, [1, 2, 3]))              # ['1', '2', '3']
list(map(str, [1, 2, 3]))              # []  -- single-use, exhausted

filter(None, [0, 1, "", "x", None])   # keeps truthy values
list(filter(None, [0, 1, "", "x", None]))   # [1, 'x']
\`\`\`

**\`zip\` stops at the shortest — silently**

\`\`\`python
names = ["Ann", "Bob", "Cy", "Dee", "Eve"]
scores = [90, 85, 80]

list(zip(names, scores))              # [('Ann', 90), ('Bob', 85), ('Cy', 80)] -- Dee, Eve lost!

list(zip(names, scores, strict=True)) # ValueError: zip() argument 2 is shorter (3.10+)

from itertools import zip_longest
list(zip_longest(names, scores, fillvalue=0))  # pads the short one with 0
\`\`\`

**\`enumerate\` instead of a manual counter**

\`\`\`python
for i, item in enumerate(items):              # i starts at 0
    print(i, item)

for lineno, line in enumerate(lines, start=1): # start at 1
    print(lineno, line)

# NOT: for i in range(len(items)): item = items[i]
\`\`\`

**\`zip(*rows)\` transposes**

\`\`\`python
rows = [(1, 2, 3), (4, 5, 6)]
list(zip(*rows))                      # [(1, 4), (2, 5), (3, 6)]   -- columns

# unzip a list of pairs:
pairs = [("a", 1), ("b", 2), ("c", 3)]
keys, vals = zip(*pairs)              # ('a','b','c'), (1,2,3)
\`\`\`

**Comprehension usually beats \`map\`/\`filter\` + \`lambda\`**

\`\`\`python
list(map(lambda x: x * 2, nums))      vs   [x * 2 for x in nums]
list(filter(lambda x: x > 0, nums))   vs   [x for x in nums if x > 0]
list(map(str.upper, words))           # map with a NAMED function -- fine, concise

{k: v for k, v in pairs}              # dict comprehension
{x % 3 for x in nums}                 # set comprehension
(x * 2 for x in nums)                 # generator expression (lazy)
\`\`\`

\`\`\`
map(fn, *iterables)      lazy; applies fn to each item (n args if n iterables). One-shot.
filter(pred, iterable)   lazy; keeps items where pred(item) is truthy.
                         filter(None, it) keeps truthy items.
zip(*iterables)          lazy; tuples of one item from each; STOPS at the SHORTEST.
                         zip(*iters, strict=True) raises if lengths differ (3.10+).
zip(*rows)               transpose a matrix / unzip a list of tuples.
enumerate(it, start=0)   lazy; yields (index, item). Use instead of range(len(...)).

All four are SINGLE-USE iterators -> list() them if you need len, indexing, or re-iteration.

Comprehensions: [expr for x in it if cond]  |  {k: v for ...}  |  {expr for ...}  |
                (expr for ...)  <- generator, lazy
Prefer a comprehension over map/filter + lambda. Use map(named_fn, it) when you
already have the function (map(int, row), map(str.strip, lines)).
\`\`\``,

    simpleHi: `**Ye sab lazy iterators hain (Python 3)**

\`\`\`python
map(str, [1, 2, 3])                    # <map object>   -- abhi kuch compute nahi
list(map(str, [1, 2, 3]))              # ['1', '2', '3']
list(map(str, [1, 2, 3]))              # []  -- single-use, khatam

filter(None, [0, 1, "", "x", None])   # truthy values rakhta hai
list(filter(None, [0, 1, "", "x", None]))   # [1, 'x']
\`\`\`

**\`zip\` sabse chhote par rukta hai — chupchaap**

\`\`\`python
names = ["Ann", "Bob", "Cy", "Dee", "Eve"]
scores = [90, 85, 80]

list(zip(names, scores))              # [('Ann', 90), ('Bob', 85), ('Cy', 80)] -- Dee, Eve khoye!

list(zip(names, scores, strict=True)) # ValueError: zip() argument 2 is shorter (3.10+)

from itertools import zip_longest
list(zip_longest(names, scores, fillvalue=0))  # chhote ko 0 se pad karta hai
\`\`\`

**Ek manual counter ke bجaay \`enumerate\`**

\`\`\`python
for i, item in enumerate(items):              # i 0 se shuru
    print(i, item)

for lineno, line in enumerate(lines, start=1): # 1 se shuru
    print(lineno, line)

# NAHI: for i in range(len(items)): item = items[i]
\`\`\`

**\`zip(*rows)\` transpose karta hai**

\`\`\`python
rows = [(1, 2, 3), (4, 5, 6)]
list(zip(*rows))                      # [(1, 4), (2, 5), (3, 6)]   -- columns

pairs = [("a", 1), ("b", 2), ("c", 3)]
keys, vals = zip(*pairs)              # ('a','b','c'), (1,2,3)
\`\`\`

**Comprehension aksar \`map\`/\`filter\` + \`lambda\` se behtar**

\`\`\`python
list(map(lambda x: x * 2, nums))      vs   [x * 2 for x in nums]
list(filter(lambda x: x > 0, nums))   vs   [x for x in nums if x > 0]
list(map(str.upper, words))           # ek NAMED function ke saath map -- theek

{k: v for k, v in pairs}              # dict comprehension
{x % 3 for x in nums}                 # set comprehension
(x * 2 for x in nums)                 # generator expression (lazy)
\`\`\`

\`\`\`
map(fn, *iterables)      lazy; har item par fn lagata hai. One-shot.
filter(pred, iterable)   lazy; items rakhta hai jahaan pred(item) truthy hai.
                         filter(None, it) truthy items rakhta hai.
zip(*iterables)          lazy; har ek se ek item ke tuples; SABSE CHHOTE par RUKTA hai.
                         zip(*iters, strict=True) raise karta hai agar lengths alag hain (3.10+).
zip(*rows)               ek matrix transpose / tuples ki ek list unzip.
enumerate(it, start=0)   lazy; (index, item) yield karta hai. range(len(...)) ke bجaay istemal karo.

Chaaron SINGLE-USE iterators hain -> list() karo agar len, indexing, ya re-iteration chahiye.

Comprehensions: [expr for x in it if cond]  |  {k: v for ...}  |  {expr for ...}  |
                (expr for ...)  <- generator, lazy
map/filter + lambda par ek comprehension prefer karo. map(named_fn, it) tab istemal karo
jab aapke paas pehle se function hai (map(int, row), map(str.strip, lines)).
\`\`\``,

    content: `## Laziness recap

\`map\`, \`filter\`, \`zip\`, and \`enumerate\` all return single-use iterators in Python 3. Passing one straight to \`for\`, \`sum\`, \`sorted\`, \`join\`, \`dict\`, \`set\`, or \`min\`/\`max\` is fine (one pass). If you need \`len\`, indexing, slicing, or a second pass, wrap it: \`list(zip(a, b))\`.

## \`zip\` — the truncation trap

\`\`\`python
zip([1, 2, 3], [10, 20])            # -> (1, 10), (2, 20)   -- the 3 is dropped
\`\`\`

\`zip\` stops as soon as the *shortest* input is exhausted. This is by design (it lets you zip an infinite iterator with a finite one), but it silently discards data when you expected equal lengths. Options:

\`\`\`python
zip(a, b, strict=True)             # ValueError if lengths differ (Python 3.10+) -- use this
                                   # when equal lengths are an invariant
itertools.zip_longest(a, b, fillvalue=None)   # pad the short ones
assert len(a) == len(b); zip(a, b)            # explicit pre-check
\`\`\`

## \`zip(*iterable)\` — transpose and unzip

\`\`\`python
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
list(zip(*matrix))                 # [(1, 4, 7), (2, 5, 8), (3, 6, 9)] -- columns as rows

records = [("Ada", 36), ("Bob", 42), ("Cy", 28)]
names, ages = zip(*records)        # ('Ada', 'Bob', 'Cy'), (36, 42, 28)
\`\`\`

\`zip(*rows)\` unpacks \`rows\` into separate arguments to \`zip\`, which then pairs the first element of each, the second of each, and so on — a transpose. The same idiom "unzips" a list of pairs into two tuples. (An empty \`rows\` gives an empty result; \`zip(*[])\` is \`[]\`.)

## \`enumerate\` — index and item together

\`\`\`python
for i, item in enumerate(seq):            # i: 0, 1, 2, ...
for i, item in enumerate(seq, start=1):   # i: 1, 2, 3, ...

# pair the index into a dict:
index = {name: i for i, name in enumerate(names)}

# NOT: for i in range(len(seq)): item = seq[i]   -- verbose, and breaks on non-sequences
\`\`\`

\`enumerate\` works on any iterable (including generators and files), unlike \`range(len(...))\` which needs a sized sequence. It is also the idiomatic way to number lines, rows, or steps.

## \`map\` with multiple iterables

\`\`\`python
list(map(operator.add, [1, 2, 3], [10, 20, 30]))   # [11, 22, 33]
list(map(lambda x, y: x * y, xs, ys))              # element-wise product
# map with n iterables calls fn with n arguments; stops at the shortest (like zip)
\`\`\`

## Comprehension vs \`map\`/\`filter\`

\`\`\`python
# a comprehension reads in evaluation order and needs no lambda:
[transform(x) for x in items if keep(x)]

# map/filter + lambda is denser and reads inside-out:
list(map(transform, filter(keep, items)))

# map is clean when you already have a named unary function:
list(map(int, string_numbers))
list(map(str.strip, lines))
list(map(len, words))

# filter(None, ...) drops falsy values -- a real idiom:
list(filter(None, [0, "", "a", [], "b", None]))     # ['a', 'b']
\`\`\`

Guidance: use a **comprehension** for custom transforms/filters; use **\`map(named_fn, it)\`** when the function already exists; reserve \`map\`/\`filter\` + \`lambda\` for the rare case where the pipeline reads better that way (and even then a generator expression is usually clearer).

## Dict, set, and nested comprehensions

\`\`\`python
{k: len(v) for k, v in data.items()}           # dict comprehension
{x.strip().lower() for x in tags}              # set comprehension (dedups)
[y for row in matrix for y in row]             # nested: flatten (outer loop first)
[[cell for cell in row if cell] for row in matrix]   # comprehension per row
\`\`\`

The loop order in a nested comprehension is the same as writing nested \`for\` statements: leftmost \`for\` is outermost.

## The walrus in a comprehension

\`\`\`python
[y for x in data if (y := expensive(x)) > 0]   # compute once, filter and use
\`\`\`

\`:=\` (Python 3.8+) lets you bind a value in the \`if\` and reuse it in the output expression without computing it twice.`,

    contentHi: `## Laziness recap

\`map\`, \`filter\`, \`zip\`, aur \`enumerate\` sab Python 3 mein single-use iterators lautate hain. Ek ko seedhe \`for\`, \`sum\`, \`sorted\`, \`join\`, \`dict\`, \`set\` ko pass karna theek hai (ek pass). Agar aapko \`len\`, indexing, slicing, ya doosra pass chahiye, ise wrap karo: \`list(zip(a, b))\`.

## \`zip\` — truncation jaal

\`\`\`python
zip([1, 2, 3], [10, 20])            # -> (1, 10), (2, 20)   -- 3 gira
\`\`\`

\`zip\` ruk jaata hai jaise hi *sabse chhota* input khatam hota hai. Ye design se hai, par ye chupchaap data discard karta hai jab aapne barabar lengths ki ummeed ki. Vikalp:

\`\`\`python
zip(a, b, strict=True)             # ValueError agar lengths alag (Python 3.10+) -- ise istemal karo
itertools.zip_longest(a, b, fillvalue=None)   # chhote ko pad karo
assert len(a) == len(b); zip(a, b)            # explicit pre-check
\`\`\`

## \`zip(*iterable)\` — transpose aur unzip

\`\`\`python
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
list(zip(*matrix))                 # [(1, 4, 7), (2, 5, 8), (3, 6, 9)] -- columns rows ki tarah

records = [("Ada", 36), ("Bob", 42), ("Cy", 28)]
names, ages = zip(*records)        # ('Ada', 'Bob', 'Cy'), (36, 42, 28)
\`\`\`

\`zip(*rows)\` \`rows\` ko \`zip\` ke alag arguments mein unpack karta hai, jo phir har ek ka pehla element pair karta hai — ek transpose.

## \`enumerate\` — index aur item saath

\`\`\`python
for i, item in enumerate(seq):            # i: 0, 1, 2, ...
for i, item in enumerate(seq, start=1):   # i: 1, 2, 3, ...

index = {name: i for i, name in enumerate(names)}

# NAHI: for i in range(len(seq)): item = seq[i]
\`\`\`

\`enumerate\` kisi bhi iterable par kaam karta hai, \`range(len(...))\` ke ulte jise ek sized sequence chahiye.

## \`map\` kai iterables ke saath

\`\`\`python
list(map(operator.add, [1, 2, 3], [10, 20, 30]))   # [11, 22, 33]
# n iterables ke saath map fn ko n arguments ke saath call karta hai; sabse chhote par rukta hai
\`\`\`

## Comprehension vs \`map\`/\`filter\`

\`\`\`python
[transform(x) for x in items if keep(x)]              # evaluation order, koi lambda nahi
list(map(transform, filter(keep, items)))             # ghana, andar-baahar padhta hai

list(map(int, string_numbers))                        # map saaf jab named function hai
list(map(str.strip, lines))
list(filter(None, [0, "", "a", [], "b", None]))       # ['a', 'b'] -- ek asli idiom
\`\`\`

Maargdarshan: custom transforms/filters ke liye ek **comprehension**; jab function pehle se maujood hai to **\`map(named_fn, it)\`**.

## Dict, set, aur nested comprehensions

\`\`\`python
{k: len(v) for k, v in data.items()}           # dict comprehension
{x.strip().lower() for x in tags}              # set comprehension (dedups)
[y for row in matrix for y in row]             # nested: flatten (outer loop pehle)
\`\`\`

Ek nested comprehension mein loop order nested \`for\` statements likhne jaisा hi hai: leftmost \`for\` outermost.

## Comprehension mein walrus

\`\`\`python
[y for x in data if (y := expensive(x)) > 0]   # ek baar compute, filter aur use
\`\`\`

\`:=\` (Python 3.8+) aapko \`if\` mein ek value bind karne aur ise output expression mein reuse karne deta hai bina dobara compute kiye.`,

    examples: [
      {
        title: 'zip truncation, strict=True, zip_longest, and transpose',
        titleHi: 'zip truncation, strict=True, zip_longest, aur transpose',
        code: `names = ["Ann", "Bob", "Cy", "Dee"]
scores = [90, 85, 80]

print("silent truncation:", list(zip(names, scores)))   # Dee is dropped

try:
    list(zip(names, scores, strict=True))
except ValueError as e:
    print("strict:", e)

from itertools import zip_longest
print("zip_longest: ", list(zip_longest(names, scores, fillvalue=None)))

# transpose a matrix:
matrix = [[1, 2, 3], [4, 5, 6]]
print("transpose:   ", list(zip(*matrix)))

# unzip a list of records:
records = [("Ada", 36), ("Bob", 42), ("Cy", 28)]
who, age = zip(*records)
print("names:", who)
print("ages: ", age)

# map over two iterables (also stops at shortest):
import operator
print("pairwise add:", list(map(operator.add, [1, 2, 3], [10, 20, 30, 40])))`,
        output: `silent truncation: [('Ann', 90), ('Bob', 85), ('Cy', 80)]
strict: zip() argument 2 is shorter than argument 1
zip_longest:  [('Ann', 90), ('Bob', 85), ('Cy', 80), ('Dee', None)]
transpose:    [(1, 4), (2, 5), (3, 6)]
names: ('Ada', 'Bob', 'Cy')
ages:  (36, 42, 28)
pairwise add: [11, 22, 33]`,
        explain: '`zip(names, scores)` stops at `scores` (length 3), silently dropping `"Dee"`. `strict=True` raises a `ValueError` naming which argument was shorter — use it when equal lengths are an invariant. `zip_longest` pads instead. `zip(*matrix)` transposes (rows become columns); `zip(*records)` unzips a list of pairs into two tuples. `map` with two iterables also truncates to the shortest.',
        explainHi: '`zip(names, scores)` `scores` (length 3) par rukta hai, chupchaap `"Dee"` girate hue. `strict=True` ek `ValueError` deta hai jo batata hai kaunsa argument chhota tha. `zip_longest` iske bجaay pad karta hai. `zip(*matrix)` transpose karta hai; `zip(*records)` ek list of pairs ko do tuples mein unzip karta hai.',
      },
      {
        title: 'enumerate vs range(len()); map/filter one-shot',
        titleHi: 'enumerate vs range(len()); map/filter one-shot',
        code: `items = ["a", "b", "c"]

# the idiomatic way:
for i, item in enumerate(items):
    print(f"{i}: {item}")

# with a start value (line numbers):
for lineno, line in enumerate(["first", "second"], start=1):
    print(f"line {lineno}: {line}")

# enumerate works on a generator; range(len()) does not:
gen = (x * x for x in range(5))
print("enum gen:", list(enumerate(gen)))

# map/filter are single-use:
squared = map(lambda n: n * n, [1, 2, 3, 4])
print("first list: ", list(squared))
print("second list:", list(squared))     # [] -- exhausted

# filter(None, ...) drops falsy values:
mixed = [0, 1, "", "x", [], "y", None, "z"]
print("truthy only:", list(filter(None, mixed)))

# comprehension vs map+lambda -- same result:
nums = [1, 2, 3, 4, 5]
print("comp:", [n * n for n in nums if n % 2])
print("map: ", list(map(lambda n: n * n, filter(lambda n: n % 2, nums))))`,
        output: `0: a
1: b
2: c
line 1: first
line 2: second
enum gen: [(0, 0), (1, 1), (2, 4), (3, 9), (4, 16)]
first list:  [1, 4, 9, 16]
second list: []
truthy only: [1, 'x', 'y', 'z']
comp: [1, 9, 25]
map:  [1, 9, 25]`,
        explain: '`enumerate(items)` yields `(index, item)` — cleaner than `range(len(items))` and it works on the generator `gen` where `range(len(...))` would fail. `map` is single-use: the second `list(squared)` is `[]`. `filter(None, mixed)` keeps only truthy values. The comprehension `[n*n for n in nums if n % 2]` and the `map(lambda...) + filter(lambda...)` give the same result, but the comprehension reads in order and needs no lambdas.',
        explainHi: '`enumerate(items)` `(index, item)` yield karta hai — `range(len(items))` se saaf aur ye generator `gen` par kaam karta hai. `map` single-use hai: doosra `list(squared)` `[]` hai. `filter(None, mixed)` sirf truthy values rakhta hai. Comprehension aur `map + filter` same result dete hain, par comprehension kram mein padhta hai aur koi lambdas nahi chahiye.',
      },
      {
        title: 'Dict/set comprehensions, nested flatten, and the walrus',
        titleHi: 'Dict/set comprehensions, nested flatten, aur walrus',
        code: `words = ["apple", "banana", "cherry", "date", "apple", "fig"]

# dict comprehension: word -> length
print("lengths:", {w: len(w) for w in words})

# set comprehension: unique first letters
print("initials:", sorted({w[0] for w in words}))

# nested: flatten a matrix (outer loop is written first)
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print("flat:", [cell for row in matrix for cell in row])

# comprehension per row (keep only even cells)
print("evens:", [[c for c in row if c % 2 == 0] for row in matrix])

# walrus: compute once, filter and reuse
def score(w):
    return len(w) * 2

print("scored:", [(w, s) for w in words if (s := score(w)) >= 10])

# invert a dict (value -> key), assuming unique values:
d = {"a": 1, "b": 2, "c": 3}
print("inverted:", {v: k for k, v in d.items()})`,
        output: `lengths: {'apple': 5, 'banana': 6, 'cherry': 6, 'date': 4, 'fig': 3}
initials: ['a', 'b', 'c', 'd', 'f']
flat: [1, 2, 3, 4, 5, 6, 7, 8, 9]
evens: [[2], [4, 6], [8]]
scored: [('apple', 10), ('banana', 12), ('cherry', 12), ('apple', 10)]
inverted: {1: 'a', 2: 'b', 3: 'c'}`,
        explain: 'A dict comprehension `{w: len(w) for w in words}` keeps the last value per key (so `"apple"` appears once). A set comprehension `{w[0] for w in words}` dedups. The nested comprehension `[cell for row in matrix for cell in row]` flattens — the loop order is the same as nested `for` statements (outer `for row` first). `[[c for c in row ...] for row in matrix]` is a comprehension per row. The walrus `(s := score(w))` computes `score(w)` once and uses it in both the filter and the output tuple. `{v: k for k, v in d.items()}` inverts a dict.',
        explainHi: 'Ek dict comprehension `{w: len(w) for w in words}` prati key aakhri value rakhta hai. Ek set comprehension `{w[0] for w in words}` dedups. Nested comprehension `[cell for row in matrix for cell in row]` flatten karta hai — loop order nested `for` statements jaisा (outer `for row` pehle). Walrus `(s := score(w))` `score(w)` ek baar compute karta hai aur ise filter aur output tuple dono mein istemal karta hai. `{v: k for k, v in d.items()}` ek dict invert karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `for name, score in zip(names, scores):   # names has 50, scores has 48 (a bug upstream)
    save(name, score)
# 2 names silently never saved -- no error, no warning`,
        right: `for name, score in zip(names, scores, strict=True):   # ValueError if lengths differ
    save(name, score)
# or assert len(names) == len(scores) first`,
        why: '`zip` truncating to the shortest input is deliberate, but it hides length-mismatch bugs: if an upstream step drops a row, `zip` just processes fewer pairs and nothing complains. When the two sequences are *supposed* to be the same length, pass `strict=True` (3.10+) so a mismatch raises instead of silently losing data.',
        whyHi: '`zip` ka sabse chhote input tak truncate karna jaan-boojhkar hai, par ye length-mismatch bugs chhupata hai: agar ek upstream step ek row girata hai, `zip` bस kam pairs process karta hai. Jab do sequences *maani jati hain* same length, `strict=True` (3.10+) pass karo.',
      },
      {
        wrong: `results = map(process, records)
print(f"processing {len(results)} records")   # TypeError: map has no len()
for r in results: ...                          # would also be empty after len()`,
        right: `results = list(map(process, records))
print(f"processing {len(results)} records")
for r in results: ...`,
        why: '`map`, `filter`, `zip`, and `enumerate` are lazy iterators — no `len()`, no indexing, and consumed by the first pass. If you need the length, an index, or to iterate more than once, materialise with `list()`. Leave them lazy only for a single pass (one `for`, or one `sum`/`sorted`/`join`).',
        whyHi: '`map`, `filter`, `zip`, aur `enumerate` lazy iterators hain — koi `len()`, koi indexing, aur pehle pass se consume. Agar aapko length, ek index, ya ek se zyaada baar iterate chahiye, `list()` se materialise karo.',
      },
      {
        wrong: `# looping with an index the C way:
for i in range(len(items)):
    print(i, items[i])

# and losing the index when you actually need it:
for item in items:
    ...  # what position is this?`,
        right: `for i, item in enumerate(items):
    print(i, item)

for i, item in enumerate(items, start=1):
    ...`,
        why: '`range(len(items))` then `items[i]` is verbose, breaks on any non-indexable iterable (a generator, a set, a file), and is easy to get wrong with the bounds. `enumerate(items)` gives the index and the item together, works on anything iterable, and takes a `start=` for 1-based numbering.',
        whyHi: '`range(len(items))` phir `items[i]` verbose hai, kisi bhi non-indexable iterable par tootta hai, aur bounds ke saath galat karna aasaan hai. `enumerate(items)` index aur item saath deta hai, kisi bhi iterable par kaam karta hai, aur 1-based numbering ke liye ek `start=` leta hai.',
      },
    ],

    realWorld: [
      {
        en: '**`zip(*rows)` is the standard transpose** — flipping CSV columns to rows, building a column-oriented view, unzipping `(x, y)` point lists into `xs, ys` for plotting. `zip(headers, row)` pairs a header list with each data row to build dicts.',
        hi: '**`zip(*rows)` standard transpose hai** — CSV columns ko rows mein flip karna, plotting ke liye `(x, y)` point lists ko `xs, ys` mein unzip karna. `zip(headers, row)` ek header list ko har data row ke saath pair karta hai.',
      },
      {
        en: '**`enumerate(..., start=1)` numbers report rows, log lines, test cases, and menu options** — and `{item: i for i, item in enumerate(ordering)}` builds a lookup from a value to its rank/position, common for sorting one list by another\'s order.',
        hi: '**`enumerate(..., start=1)` report rows, log lines, test cases number karta hai** — aur `{item: i for i, item in enumerate(ordering)}` ek value se iske rank/position tak ek lookup banata hai.',
      },
      {
        en: '**`filter(None, iterable)` to drop empty/falsy values, and `map(str.strip, lines)` / `map(int, fields)` for parsing** are everywhere in data-loading code. DRF and Django use comprehensions and generator expressions pervasively; `map`/`filter` + `lambda` is rare in idiomatic Python.',
        hi: '**Khaali/falsy values girane ko `filter(None, iterable)`, aur parsing ke liye `map(str.strip, lines)` / `map(int, fields)`** data-loading code mein har jagah hain. Idiomatic Python mein `map`/`filter` + `lambda` durlabh hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the behaviour of `zip` when the inputs have different lengths, and how do you handle it?',
        qHi: 'Jab inputs ki alag lengths hon to `zip` ka behaviour kya hai, aur aap ise kaise handle karte ho?',
        a: 'zip pairs up the first element of each input, the second of each, and so on, and it stops as soon as any one of the inputs is exhausted. So zipping a three-element list with a two-element list yields two pairs and the third element of the longer list is simply not included — no error, no warning. This truncation is a deliberate design decision. It is what lets you zip a finite sequence against an infinite iterator like itertools dot count and have it terminate, and it is convenient when you genuinely want "as many pairs as the shorter input allows". But it is a hazard when the two inputs are supposed to be the same length, because a length mismatch caused by a bug upstream just results in silently processing fewer items. There are three ways to handle it depending on intent. If equal length is an invariant that a mismatch should flag, pass strict equals True, added in Python 3.10: zip then raises a ValueError identifying which argument was shorter, turning a silent data loss into a loud failure. If you want to keep going and fill in the gaps, use itertools dot zip_longest, which pads the shorter inputs with a fillvalue, defaulting to None, until the longest is exhausted. And if you simply want to be explicit, assert that the lengths are equal before zipping. The default truncating behaviour is fine when you deliberately want to stop at the shortest; you just should not rely on it as an implicit length check.',
        aHi: 'zip har input ke pehle element, har ek ke doosre, aur aage ko pair karta hai, aur ye ruk jata hai jaise hi koi ek input khatam hota hai. Toh ek teen-element list ko ek do-element list ke saath zip karna do pairs deta hai aur lambi list ka teesra element bस shaamil nahi hota — koi error nahi, koi warning nahi. Ye truncation ek jaan-boojhkar design nirnay hai. Ye wo hai jo aapko ek finite sequence ko itertools dot count jaise ek infinite iterator ke khilaaf zip karne aur ise terminate hone deta hai. Par ye ek khatra hai jab do inputs same length maani jati hain. Intent ke hisaab se ise handle karne ke teen tarike hain. Agar barabar length ek invariant hai, strict equals True pass karo, Python 3.10 mein joda gaya: zip phir ek ValueError deta hai. Agar aap aage badhna chahte ho, itertools dot zip_longest istemal karo, jo chhote inputs ko ek fillvalue se pad karta hai. Aur agar aap sirf explicit hona chahte ho, zip karne se pehle assert karo ki lengths barabar hain.',
      },
      {
        q: 'When should you use a comprehension versus `map` / `filter`, and why does `range(len(x))` count as an anti-pattern?',
        qHi: 'Aapko ek comprehension versus `map` / `filter` kab istemal karna chahiye, aur `range(len(x))` ek anti-pattern kyun ginta hai?',
        a: 'A comprehension and a map-plus-filter chain can express the same transformation, but the comprehension is usually more readable. It reads in the order that things happen — the output expression, then what you iterate, then the condition — and it does not require a lambda, which is dense and reads inside-out. So for a custom transform or filter, prefer a list, set, dict, or generator comprehension. map earns its place when you already have a named unary function that does exactly what you want: map of int over a list of strings, map of str dot strip over lines, map of len over words. There is no lambda, it is concise, and it reads clearly. filter of None over an iterable to drop falsy values is also a genuine idiom worth knowing. What you should almost never write is map or filter with a lambda, because a comprehension or generator expression says the same thing better; and you should not nest them, because map of transform over filter of keep over items forces the reader to unwrap from the inside. As for range of len of x: it is an anti-pattern because it is a C-style index loop imported into Python where it is not needed. It is verbose — you write range, len, and then index back into the sequence with the loop variable. It only works on sized, indexable sequences, so it breaks the moment x is a generator, a set, a file, or any other iterable. And off-by-one errors in the bounds are easy. enumerate solves all of this: it yields the index and the item together as a pair, it works on any iterable, and it takes a start parameter for one-based numbering. If you need the index, use enumerate; if you do not, just iterate the items directly.',
        aHi: 'Ek comprehension aur ek map-plus-filter chain same transformation express kar sakte hain, par comprehension aam taur par zyaada readable hai. Ye us kram mein padhta hai jismein cheezein hoti hain — output expression, phir aap kya iterate karte ho, phir condition — aur ise ek lambda ki zaroorat nahi. Toh ek custom transform ya filter ke liye, ek comprehension prefer karo. map apni jagah tab kamata hai jab aapke paas pehle se ek named unary function hai jo bilkul wahi karta hai jo aap chahte ho: strings ki ek list par map of int. filter of None bhi ek asli idiom hai. Jo aapko lagbhag kabhi nahi likhna wo map ya filter ek lambda ke saath hai. range of len of x ke baare mein: ye ek anti-pattern hai kyunki ye ek C-style index loop hai jahaan iski zaroorat nahi. Ye verbose hai. Ye sirf sized, indexable sequences par kaam karta hai. enumerate ye sab hal karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Write `safe_zip(a, b)` that returns `list(zip(a, b))` but raises `ValueError(f"length mismatch: {len(a)} vs {len(b)}")` if the lengths differ. Test on equal-length lists (works), and on `[1,2,3]` vs `[10,20]` (raises with the counts). Then show `itertools.zip_longest` as the alternative that pads instead.',
        taskHi: '`safe_zip(a, b)` likho jo `list(zip(a, b))` lautae par lengths alag hone par `ValueError` raise kare. Barabar-length lists par test karo, aur `[1,2,3]` vs `[10,20]` par. Phir `itertools.zip_longest` alternative dikhao.',
        hint: '`if len(a) != len(b): raise ValueError(...)`; `return list(zip(a, b))`. Or just `return list(zip(a, b, strict=True))` and catch/re-wrap the built-in `ValueError`. `list(zip_longest([1,2,3], [10,20], fillvalue=0))` -> `[(1,10),(2,20),(3,0)]`.',
        hintHi: '`if len(a) != len(b): raise ValueError(...)`; `return list(zip(a, b))`. Ya `list(zip(a, b, strict=True))` aur built-in `ValueError` catch karo. `list(zip_longest([1,2,3], [10,20], fillvalue=0))` -> `[(1,10),(2,20),(3,0)]`.',
      },
      {
        task: 'Write `transpose(matrix)` using `zip(*matrix)` that turns rows into columns, returning a list of lists. Test on `[[1,2,3],[4,5,6]]` -> `[[1,4],[2,5],[3,6]]`. Then write `to_records(headers, rows)` that uses `zip` to pair each header with each row value, returning a list of dicts.',
        taskHi: '`transpose(matrix)` likho `zip(*matrix)` istemal karke jo rows ko columns mein badle. `[[1,2,3],[4,5,6]]` -> `[[1,4],[2,5],[3,6]]` par test karo. Phir `to_records(headers, rows)` likho jo `zip` istemal kare.',
        hint: '`transpose`: `return [list(col) for col in zip(*matrix)]`. `to_records`: `return [dict(zip(headers, row)) for row in rows]` — `dict(zip(...))` builds one record per row.',
        hintHi: '`transpose`: `return [list(col) for col in zip(*matrix)]`. `to_records`: `return [dict(zip(headers, row)) for row in rows]`.',
      },
      {
        task: 'Rewrite each of these with a comprehension (no `map`/`filter`/`lambda`): (a) `list(map(str.upper, filter(lambda s: len(s) > 3, words)))`; (b) `dict(map(lambda kv: (kv[0], kv[1] * 2), d.items()))`; (c) `list(filter(None, [line.strip() for line in lines]))`. Confirm the outputs match.',
        taskHi: 'Inmein se har ek ko ek comprehension se rewrite karo (koi `map`/`filter`/`lambda` nahi): (a), (b), (c). Confirm karo outputs match karte hain.',
        hint: '(a) `[s.upper() for s in words if len(s) > 3]`. (b) `{k: v * 2 for k, v in d.items()}`. (c) `[s for line in lines if (s := line.strip())]` (walrus) or `[s for s in (line.strip() for line in lines) if s]`.',
        hintHi: '(a) `[s.upper() for s in words if len(s) > 3]`. (b) `{k: v * 2 for k, v in d.items()}`. (c) `[s for line in lines if (s := line.strip())]`.',
      },
    ],

    keyTakeaways: [
      '`map`, `filter`, `zip`, `enumerate` are all LAZY, SINGLE-USE iterators in Python 3. Pass them straight to `for`/`sum`/`sorted`/`join`/`dict` (one pass); `list(...)` them if you need `len`, indexing, or a second pass.',
      '`zip` STOPS at the shortest input — silently dropping the rest. Use `zip(a, b, strict=True)` (3.10+) when equal lengths are an invariant, or `itertools.zip_longest(..., fillvalue=...)` to pad.',
      '`zip(*rows)` transposes a matrix (rows <-> columns) and unzips a list of tuples (`names, ages = zip(*records)`).',
      '`enumerate(it, start=0)` yields `(index, item)` — use it instead of `for i in range(len(x)): item = x[i]`. It works on ANY iterable (generators, files, sets); `range(len(x))` needs a sized sequence.',
      '`map(fn, a, b, ...)` calls `fn` with one item from each iterable (and also stops at the shortest). `filter(None, it)` keeps only truthy items.',
      'Prefer a COMPREHENSION over `map`/`filter` + `lambda` — it reads in evaluation order and needs no lambda. Use `map(named_fn, it)` when the function already exists (`map(int, row)`, `map(str.strip, lines)`).',
      'Dict comprehension `{k: v for ...}`, set comprehension `{expr for ...}` (dedups), generator expression `(expr for ...)` (lazy). Nested comprehension loop order = nested `for` order (leftmost outermost).',
      'The walrus `:=` in a comprehension\'s `if` lets you compute a value once and use it in both the filter and the output.',
    ],
    keyTakeawaysHi: [
      '`map`, `filter`, `zip`, `enumerate` sab Python 3 mein LAZY, SINGLE-USE iterators hain. Unhe seedhe `for`/`sum`/`sorted`/`join`/`dict` ko pass karo; `list(...)` karo agar `len`, indexing, ya doosra pass chahiye.',
      '`zip` sabse chhote input par RUKTA hai — chupchaap baaki girate hue. `zip(a, b, strict=True)` (3.10+) istemal karo jab barabar lengths ek invariant hain, ya pad karne ko `itertools.zip_longest(..., fillvalue=...)`.',
      '`zip(*rows)` ek matrix transpose karta hai aur tuples ki ek list unzip karta hai (`names, ages = zip(*records)`).',
      '`enumerate(it, start=0)` `(index, item)` yield karta hai — `for i in range(len(x)): item = x[i]` ke bجaay ise istemal karo. Ye KISI bhi iterable par kaam karta hai; `range(len(x))` ko ek sized sequence chahiye.',
      '`map(fn, a, b, ...)` `fn` ko har iterable se ek item ke saath call karta hai (aur sabse chhote par bhi rukta hai). `filter(None, it)` sirf truthy items rakhta hai.',
      '`map`/`filter` + `lambda` par ek COMPREHENSION prefer karo — ye evaluation order mein padhta hai. `map(named_fn, it)` istemal karo jab function pehle se maujood hai.',
      'Dict comprehension `{k: v for ...}`, set comprehension `{expr for ...}` (dedups), generator expression `(expr for ...)` (lazy). Nested comprehension loop order = nested `for` order.',
      'Ek comprehension ke `if` mein walrus `:=` aapko ek value ek baar compute karne aur ise filter aur output dono mein istemal karne deta hai.',
    ],
  },

  {
    slug: 'py-generator-pipelines',
    title: 'Generator Pipelines and When (Not) to Use Them',
    titleHi: 'Generator Pipelines Aur Kab (Nahi) Istemal Karें',
    description: 'Chaining `read → clean → parse → filter` as four generators so a 50 GB file processes in constant memory — and then reaching for the same pattern on a 200-item list where a plain list comprehension would be simpler and you need to iterate it twice anyway. The pipeline pattern is powerful and specific; knowing when it earns its keep is the skill.',
    descriptionHi: '`read → clean → parse → filter` ko chaar generators ki tarah chain karna taaki ek 50 GB file constant memory mein process ho — aur phir usi pattern ke liye ek 200-item list par pahunchna jahaan ek plain list comprehension saral hoti aur aapko ise waise bhi do baar iterate karna hai. Pipeline pattern shaktishaali aur specific hai; kab ye apni jagah kamata hai jaanna kaushal hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 6,

    analogy: {
      en: '**An assembly line versus a workbench.** An assembly line (a generator pipeline) is the right choice when the volume is huge and each unit passes through the same fixed sequence of operations exactly once: raw material enters, each station does one thing and hands off, a finished unit exits, and the line never holds more than a few units in transit no matter how many millions pass through. It is efficient precisely because nothing piles up. But an assembly line is overkill for a small batch of custom pieces you need to inspect from every angle, rearrange, count, and come back to. For that you use a workbench: lay all the pieces out (a list), and you can see them, sort them, measure them, walk away and return. Generator pipelines are the assembly line — reach for them when data is large or streaming and you make a single pass. A materialised list is the workbench — use it when the data is small, or you need its length, or you need to go over it more than once, or you want to be able to print it while debugging.',
      hi: '**Ek assembly line versus ek workbench.** Ek assembly line (ek generator pipeline) sahi chunaav hai jab volume bahut bada hai aur har unit usi fixed sequence of operations se bilkul ek baar guzarta hai: raw material aata hai, har station ek cheez karta hai aur handoff karta hai, ek finished unit nikalta hai, aur line kabhi transit mein kuch se zyaada units nahi rakhti chahe kitne bhi laakhon guzrें. Par ek assembly line ek chhote batch of custom pieces ke liye overkill hai jinhe aapko har angle se inspect, rearrange, count, aur wapas aana hai. Uske liye aap ek workbench istemal karte ho: saare pieces bichha do (ek list). Generator pipelines assembly line hain — unke liye pahuncho jab data bada ya streaming hai aur aap ek single pass karte ho. Ek materialised list workbench hai.',
    },

    simple: `**A pipeline: each stage is a generator that takes and yields an iterable**

\`\`\`python
def read_lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line.rstrip("\\n")

def non_empty(lines):
    for line in lines:
        if line.strip():
            yield line

def parse_int(lines):
    for line in lines:
        try:
            yield int(line)
        except ValueError:
            continue

def positives(nums):
    for n in nums:
        if n > 0:
            yield n

# compose -- nothing runs until the final consumer pulls:
total = sum(positives(parse_int(non_empty(read_lines("data.txt")))))
\`\`\`

**Why: constant memory, one item at a time**

\`\`\`
file (50 GB) --> read_lines --> non_empty --> parse_int --> positives --> sum
   on disk         1 line         1 line       1 int        1 int      running total

peak memory = one line + one int, no matter the file size.
\`\`\`

**Consumers that pair well with a generator (single pass)**

\`\`\`python
sum(x.amount for x in transactions)
any(u.is_admin for u in users)
all(v > 0 for v in readings)
max(items, key=lambda x: x.score)
", ".join(str(x) for x in ids)
next((x for x in items if x.ready), None)      # first match or None
dict((k, compute(k)) for k in keys)
\`\`\`

**When a list is the right call instead**

\`\`\`python
items = [transform(x) for x in source]   # list, because:
len(items)                               #  - you need the length
items[0], items[-1]                      #  - you need indexing/slicing
for x in items: ...                      #  - you iterate it more than once
sorted(items)                            #  - (sorted needs all of it anyway)
print(items)                             #  - you want to inspect it while debugging
\`\`\`

\`\`\`
GENERATOR PIPELINE  gen1 -> gen2 -> gen3 -> consumer
  - each stage: def stage(src): for x in src: ... yield ...
  - LAZY: no stage runs until the consumer pulls; data flows one item at a time
  - CONSTANT memory: peak is one item per stage, not the whole dataset
  - SINGLE PASS: the whole pipeline is consumed once

USE a pipeline when:  data is large or streaming (files, network, DB cursors, logs)
                      AND you consume it exactly once (for / sum / any / join / ...)
USE a list when:      data is small; OR you need len / indexing / slicing;
                      OR you iterate more than once; OR you want to debug-print it;
                      OR a later step needs the whole thing anyway (sorted, reversed,
                      random.shuffle, statistics)

Django: a QuerySet is lazy and caches on first iteration (a second 'for' is free).
        .iterator() gives an uncached one-shot generator for streaming huge results.
\`\`\``,

    simpleHi: `**Ek pipeline: har stage ek generator jo ek iterable leta aur yield karta hai**

\`\`\`python
def read_lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line.rstrip("\\n")

def non_empty(lines):
    for line in lines:
        if line.strip():
            yield line

def parse_int(lines):
    for line in lines:
        try:
            yield int(line)
        except ValueError:
            continue

def positives(nums):
    for n in nums:
        if n > 0:
            yield n

# compose -- kuch nahi chalta jab tak antim consumer pull nahi karta:
total = sum(positives(parse_int(non_empty(read_lines("data.txt")))))
\`\`\`

**Kyun: constant memory, ek item ek baar**

\`\`\`
file (50 GB) --> read_lines --> non_empty --> parse_int --> positives --> sum
   disk par        1 line         1 line       1 int        1 int      running total

peak memory = ek line + ek int, file size chahe kuch bhi ho.
\`\`\`

**Consumers jo ek generator ke saath achhe milte hain (single pass)**

\`\`\`python
sum(x.amount for x in transactions)
any(u.is_admin for u in users)
all(v > 0 for v in readings)
max(items, key=lambda x: x.score)
", ".join(str(x) for x in ids)
next((x for x in items if x.ready), None)      # pehla match ya None
\`\`\`

**Jab ek list sahi chunaav hai**

\`\`\`python
items = [transform(x) for x in source]   # list, kyunki:
len(items)                               #  - aapko length chahiye
items[0], items[-1]                      #  - aapko indexing/slicing chahiye
for x in items: ...                      #  - aap ise ek se zyaada baar iterate karte ho
sorted(items)                            #  - (sorted ko waise bhi sab chahiye)
print(items)                             #  - aap debugging mein ise inspect karna chahte ho
\`\`\`

\`\`\`
GENERATOR PIPELINE  gen1 -> gen2 -> gen3 -> consumer
  - har stage: def stage(src): for x in src: ... yield ...
  - LAZY: koi stage nahi chalta jab tak consumer pull nahi karta; data ek item ek baar bahta hai
  - CONSTANT memory: peak prati stage ek item hai, poora dataset nahi
  - SINGLE PASS: poori pipeline ek baar consume hoti hai

pipeline ISTEMAL KARO jab:  data bada ya streaming hai (files, network, DB cursors, logs)
                            AUR aap ise bilkul ek baar consume karte ho
list ISTEMAL KARO jab:      data chhota hai; YA aapko len / indexing / slicing chahiye;
                            YA aap ek se zyaada baar iterate karte ho; YA aap debug-print
                            karna chahte ho; YA ek baad ka step waise bhi poora chahta hai

Django: ek QuerySet lazy hai aur pehli iteration par cache karta hai (doosra 'for' free).
        .iterator() ek uncached one-shot generator deta hai bade results stream karne ko.
\`\`\``,

    content: `## Building a pipeline

Each stage has the shape \`def stage(source): for item in source: ... yield transformed\`. The stages are independent and composable; you assemble them by nesting the calls (innermost = source, outermost = last transform), and a consumer at the end drives the whole thing.

\`\`\`python
def numbers_from(path):
    with open(path) as f:
        for line in f:
            yield line

def to_floats(lines):
    for line in lines:
        line = line.strip()
        if line:
            try:
                yield float(line)
            except ValueError:
                pass

def running_average(values):
    total = count = 0
    for v in values:
        total += v
        count += 1
        yield total / count

for avg in running_average(to_floats(numbers_from("readings.txt"))):
    print(f"{avg:.2f}")
\`\`\`

Nothing is read from the file until the \`for\` loop asks for the first average. Then one line flows all the way through: read, stripped, parsed, folded into the running average, printed. Peak memory is one line plus two counters.

## The memory and latency win, concretely

\`\`\`python
# list approach: builds every intermediate list
lines = open("huge.log").readlines()          # whole file in memory
parsed = [parse(l) for l in lines]            # another full list
errors = [p for p in parsed if p.level == "ERROR"]   # a third
count = len(errors)

# pipeline: constant memory, starts immediately
with open("huge.log") as f:
    count = sum(1 for p in (parse(l) for l in f) if p.level == "ERROR")
\`\`\`

The list version allocates three lists the size of the file; the pipeline holds one line and one parsed object at a time. It also produces its first result without reading the whole file — important when a consumer might stop early (\`any\`, \`next\`, a \`break\`).

## Early termination flows backward

\`\`\`python
first_error = next(
    (p for p in (parse(l) for l in open("huge.log")) if p.level == "ERROR"),
    None,
)
\`\`\`

\`next\` pulls one item, which pulls one line through the pipeline; as soon as an \`ERROR\` is found, iteration stops and the file is not read further. A generator pipeline that feeds \`any\`, \`all\`, \`next\`, or a loop with \`break\` can stop after the first relevant item.

## When NOT to use a pipeline

- **Small, bounded data.** A 100-element list: the memory savings are nil and a list comprehension is simpler to read and debug.
- **You need the length, an index, or a slice.** A generator has none of those.
- **You iterate more than once.** The pipeline is exhausted after the first pass; you would have to rebuild it or materialise it.
- **A stage needs the whole input.** \`sorted\`, \`reversed\`, \`random.shuffle\`, \`statistics.median\`, \`collections.Counter\` all consume everything — putting a generator in front of them just adds indirection.
- **Debugging.** You cannot \`print\` a generator to see its contents (it would consume it). A list you can inspect at every step.

## \`itertools\` in pipelines

\`\`\`python
import itertools as it

# take the first 1000 matching records without materialising the source:
sample = list(it.islice(
    (r for r in stream if r.valid),
    1000,
))

# process in batches:
for batch in it.batched(stream, 500):   # 3.12+
    bulk_insert(batch)
\`\`\`

\`islice\`, \`takewhile\`, \`chain\`, \`batched\` slot into pipelines without breaking laziness.

## Django QuerySet parallels

\`\`\`python
qs = Order.objects.filter(status="paid")   # lazy -- no query yet

total = sum(o.amount for o in qs)          # query runs here, rows cached
count = len(qs)                            # no new query -- uses the cache

# for a huge table, avoid caching all rows:
for o in Order.objects.filter(...).iterator(chunk_size=2000):
    process(o)                             # streams, constant memory
\`\`\`

A QuerySet is a lazy iterable that caches its rows on the first iteration, so a second \`for\` is free — the opposite of a bare generator. \`.iterator()\` opts out of the cache for streaming.`,

    contentHi: `## Ek pipeline banana

Har stage ka aakaar \`def stage(source): for item in source: ... yield transformed\` hai. Stages swतंत्r aur composable hain; aap unhe calls nest karके assemble karte ho (innermost = source, outermost = last transform), aur ant mein ek consumer poori cheez ko drive karta hai.

\`\`\`python
def numbers_from(path):
    with open(path) as f:
        for line in f:
            yield line

def to_floats(lines):
    for line in lines:
        line = line.strip()
        if line:
            try:
                yield float(line)
            except ValueError:
                pass

def running_average(values):
    total = count = 0
    for v in values:
        total += v
        count += 1
        yield total / count

for avg in running_average(to_floats(numbers_from("readings.txt"))):
    print(f"{avg:.2f}")
\`\`\`

File se kuch nahi padha jata jab tak \`for\` loop pehla average nahi maangta. Peak memory ek line plus do counters hai.

## Memory aur latency jeet, thos roop se

\`\`\`python
# list approach: har intermediate list banata hai
lines = open("huge.log").readlines()          # poori file memory mein
parsed = [parse(l) for l in lines]            # ek aur poori list
errors = [p for p in parsed if p.level == "ERROR"]   # ek teesri

# pipeline: constant memory, turant shuru
with open("huge.log") as f:
    count = sum(1 for p in (parse(l) for l in f) if p.level == "ERROR")
\`\`\`

List version file ke size ki teen lists allocate karta hai; pipeline ek line aur ek parsed object ek baar rakhta hai. Ye apna pehla result poori file padhe bina banata hai.

## Early termination peechhe ki taraf bahta hai

\`\`\`python
first_error = next(
    (p for p in (parse(l) for l in open("huge.log")) if p.level == "ERROR"),
    None,
)
\`\`\`

\`next\` ek item pull karta hai, jo ek line pipeline ke zariye pull karta hai; jaise hi ek \`ERROR\` mil jata hai, iteration ruk jata hai. \`any\`, \`all\`, \`next\`, ya \`break\` waale loop ko feed karti ek generator pipeline pehle relevant item ke baad ruk sakti hai.

## Pipeline kab NAHI istemal karें

- **Chhota, bounded data.** Ek 100-element list: memory savings shoonya hai aur ek list comprehension padhne aur debug karne mein saral hai.
- **Aapko length, ek index, ya ek slice chahiye.** Ek generator ke paas koi nahi.
- **Aap ek se zyaada baar iterate karte ho.** Pipeline pehle pass ke baad khatam hai.
- **Ek stage ko poora input chahiye.** \`sorted\`, \`reversed\`, \`random.shuffle\`, \`statistics.median\`, \`collections.Counter\` sab sab kuch consume karte hain.
- **Debugging.** Aap ek generator \`print\` nahi kar sakte iski contents dekhne ko.

## Pipelines mein \`itertools\`

\`\`\`python
import itertools as it

sample = list(it.islice(
    (r for r in stream if r.valid),
    1000,
))

for batch in it.batched(stream, 500):   # 3.12+
    bulk_insert(batch)
\`\`\`

\`islice\`, \`takewhile\`, \`chain\`, \`batched\` laziness tode bina pipelines mein slot hote hain.

## Django QuerySet parallels

\`\`\`python
qs = Order.objects.filter(status="paid")   # lazy -- abhi koi query nahi

total = sum(o.amount for o in qs)          # query yahaan chalti hai, rows cached
count = len(qs)                            # koi nayi query nahi -- cache istemal karta hai

for o in Order.objects.filter(...).iterator(chunk_size=2000):
    process(o)                             # streams, constant memory
\`\`\`

Ek QuerySet ek lazy iterable hai jo apni rows pehli iteration par cache karta hai, isliye doosra \`for\` free hai — ek nange generator ka ulta. \`.iterator()\` streaming ke liye cache se opt out karta hai.`,

    examples: [
      {
        title: 'A lazy pipeline: data flows one item at a time',
        titleHi: 'Ek lazy pipeline: data ek item ek baar bahta hai',
        code: `def source():
    for i in range(1, 8):
        print(f"  source -> {i}")
        yield i

def doubled(src):
    for x in src:
        print(f"  doubled: {x} -> {x*2}")
        yield x * 2

def under_ten(src):
    for x in src:
        if x >= 10:
            print(f"  under_ten: {x} stops the pipeline")
            return
        print(f"  under_ten: passing {x}")
        yield x

print("building the pipeline (nothing runs):")
pipe = under_ten(doubled(source()))

print("consuming with a for loop:")
for value in pipe:
    print(f"got {value}")

print("done -- note source stopped at 5 (5*2=10), items 6 and 7 never produced")`,
        output: `building the pipeline (nothing runs):
consuming with a for loop:
  source -> 1
  doubled: 1 -> 2
  under_ten: passing 2
got 2
  source -> 2
  doubled: 2 -> 4
  under_ten: passing 4
got 4
  source -> 3
  doubled: 3 -> 6
  under_ten: passing 6
got 6
  source -> 4
  doubled: 4 -> 8
  under_ten: passing 8
got 8
  source -> 5
  doubled: 5 -> 10
  under_ten: 10 stops the pipeline
done -- note source stopped at 5 (5*2=10), items 6 and 7 never produced`,
        explain: 'Building `pipe` runs nothing. Each `for` iteration pulls one value: `source` yields 1, `doubled` turns it into 2, `under_ten` passes it, the loop prints `got 2` — then the next iteration pulls again. When `source` yields 5, `doubled` makes 10, and `under_ten` hits `>= 10` and `return`s, ending the pipeline. `source` never produces 6 or 7 — early termination flows all the way back.',
        explainHi: '`pipe` banane se kuch nahi chalta. Har `for` iteration ek value pull karti hai: `source` 1 yield karta hai, `doubled` ise 2 banata hai, `under_ten` ise pass karta hai. Jab `source` 5 yield karta hai, `doubled` 10 banata hai, aur `under_ten` `>= 10` hit karke `return` karta hai. `source` kabhi 6 ya 7 nahi banata — early termination poori tarah peechhe bahti hai.',
      },
      {
        title: 'Pipeline vs list: memory and single-vs-multi-pass',
        titleHi: 'Pipeline vs list: memory aur single-vs-multi-pass',
        code: `import sys

def gen_pipeline(n):
    nums = range(n)
    squared = (x * x for x in nums)
    evens = (x for x in squared if x % 2 == 0)
    return evens

def list_pipeline(n):
    nums = list(range(n))
    squared = [x * x for x in nums]
    evens = [x for x in squared if x % 2 == 0]
    return evens

n = 50_000

g = gen_pipeline(n)
print("generator pipeline is tiny:", sys.getsizeof(g) < 1000)
print("sum via generator:", sum(g))
print("sum again (exhausted):", sum(g))     # 0

lst = list_pipeline(n)
print("list result length:", len(lst))       # generators have no len()
print("sum via list:", sum(lst))
print("sum again (reusable):", sum(lst))      # same -- a list can be re-iterated
print("first / last:", lst[0], lst[-1])       # generators cannot index`,
        output: `generator pipeline is tiny: True
sum via generator: 20832083350000
sum again (exhausted): 0
list result length: 25000
sum via list: 20832083350000
sum again (reusable): 20832083350000
first / last: 0 2499800004`,
        explain: 'The generator pipeline is a fixed couple-hundred-byte object regardless of `n`; the list pipeline allocates three lists totalling hundreds of KB. But the generator is single-use — the second `sum(g)` is 0 — and has no `len()`, no indexing. The list can be summed twice, has a length, and supports `lst[0]`/`lst[-1]`. Choose the generator for a large single pass; choose the list when you need length, indexing, or repeated iteration.',
        explainHi: 'Generator pipeline `n` chahe kuch bhi ho ek fixed couple-hundred-byte object hai; list pipeline sैkdon KB ki teen lists allocate karta hai. Par generator single-use hai — doosra `sum(g)` 0 hai — aur iska koi `len()`, koi indexing nahi. List ko do baar sum kiya ja sakta hai, iski ek length hai. Bade single pass ke liye generator chuno; length, indexing, ya repeated iteration chahiye to list.',
      },
      {
        title: 'Practical: streaming a "log file" with early stop and batching',
        titleHi: 'Vyavhaarik: ek "log file" stream karna early stop aur batching ke saath',
        code: `import itertools as it

# simulate a large log without writing a file:
def log_lines():
    levels = ["INFO", "INFO", "WARN", "INFO", "ERROR", "INFO", "ERROR", "WARN", "INFO"]
    for i, lvl in enumerate(it.islice(it.cycle(levels), 30)):
        yield f"2026-08-31 line{i:02d} {lvl} message"

def parse(lines):
    for line in lines:
        parts = line.split(maxsplit=3)
        yield {"n": parts[1], "level": parts[2], "msg": parts[3]}

def only(level, records):
    for r in records:
        if r["level"] == level:
            yield r

# 1. count errors in a single streaming pass:
error_count = sum(1 for _ in only("ERROR", parse(log_lines())))
print("error count:", error_count)

# 2. first WARN, stopping as soon as it is found:
first_warn = next(only("WARN", parse(log_lines())), None)
print("first warn:", first_warn["n"] if first_warn else None)

# 3. process errors in batches of 2:
for batch in it.batched(only("ERROR", parse(log_lines())), 2):
    print("batch:", [r["n"] for r in batch])`,
        output: `error count: 6
first warn: line02
batch: ['line04', 'line06']
batch: ['line13', 'line15']
batch: ['line22', 'line24']`,
        explain: 'Each of the three consumers builds the same lazy pipeline (`log_lines -> parse -> only`) and drives it once. Counting errors is a single pass with constant memory. `next(only("WARN", ...), None)` pulls just enough lines to find the first WARN, then stops — the rest of the "file" is never parsed. `it.batched` groups the filtered errors into tuples of 2 for something like a bulk insert (6 errors -> 3 full batches).',
        explainHi: 'Teen consumers mein se har ek wahi lazy pipeline banata hai aur ise ek baar drive karta hai. Errors ginna constant memory ke saath ek single pass hai. `next(only("WARN", ...), None)` pehla WARN dhoondhne ko bस kaafi lines pull karta hai, phir ruk jata hai. `it.batched` filtered errors ko 2 ke tuples mein group karta hai (6 errors -> 3 batches).',
      },
    ],

    mistakes: [
      {
        wrong: `def get_report_rows():
    for r in Model.objects.all():
        yield transform(r)          # a generator

rows = get_report_rows()
context = {"rows": rows, "count": len(rows)}   # TypeError: no len()
# and the template iterating 'rows' twice gets nothing the second time`,
        right: `rows = [transform(r) for r in Model.objects.all()]   # a list
context = {"rows": rows, "count": len(rows)}
# template can iterate 'rows' as many times as it likes`,
        why: 'A template (or any consumer) that needs the count AND iterates the data, possibly more than once, needs a real list. A generator has no length and is exhausted after the first pass. Reserve generators for a single streaming pass; materialise to a list when length, indexing, or re-iteration is required.',
        whyHi: 'Ek template jise count CHAHIYE AUR data iterate karta hai, shaayad ek se zyaada baar, ek asli list chahiye. Ek generator ka koi length nahi hai aur ye pehle pass ke baad khatam hai. Generators ko ek single streaming pass ke liye rakho.',
      },
      {
        wrong: `# a "pipeline" over a 50-item config list:
result = list(
    normalize(
        validate(
            parse(config_lines)
        )
    )
)
# four generator functions, four extra indirections, for 50 items`,
        right: `result = [normalize_one(validate_one(parse_one(line))) for line in config_lines]
# or a small explicit loop -- both are clearer for small, bounded data`,
        why: 'Generator pipelines pay off for large or streaming data where constant memory matters. For a small bounded list, they add layers of indirection, make debugging harder (you cannot print an intermediate stage), and save nothing. A list comprehension or a plain loop is clearer.',
        whyHi: 'Generator pipelines bade ya streaming data ke liye faayda karti hain jahaan constant memory maayne rakhti hai. Ek chhoti bounded list ke liye, wo indirection ki layers jodti hain, debugging mushkil banati hain, aur kuch nahi bachati. Ek list comprehension ya ek plain loop saaf hai.',
      },
      {
        wrong: `def clean(lines):
    for line in lines:
        yield line.strip()

data = clean(open("f.txt"))
sorted_data = sorted(data)        # sorted consumes the whole generator anyway
top_5 = data[:5]                  # TypeError: generator is not subscriptable (and exhausted)`,
        right: `with open("f.txt") as f:
    data = sorted(line.strip() for line in f)   # a list; the generator inside is fine
top_5 = data[:5]`,
        why: 'Putting a generator in front of `sorted` (or `reversed`, `min`/`max` with no key shortcut, `statistics.*`, `random.shuffle`) is pointless — those functions must consume the entire input to produce a result, so there is no memory or latency benefit, and afterward you have an exhausted generator. Let the generator expression be the *argument* to `sorted`, which returns a reusable list.',
        whyHi: '`sorted` (ya `reversed`, `statistics.*`, `random.shuffle`) ke aage ek generator rakhna bekaar hai — un functions ko ek result banane ko poora input consume karna hoga. Generator expression ko `sorted` ka *argument* hone do, jo ek reusable list lautata hai.',
      },
    ],

    realWorld: [
      {
        en: '**ETL and log-processing scripts are built as generator pipelines** — `write_output(dedupe(enrich(parse(read_gz(path)))))` processes a compressed multi-GB file in constant memory, and `next`/`islice` at the consumer end give you a quick sample without a full run.',
        hi: '**ETL aur log-processing scripts generator pipelines ki tarah bante hain** — `write_output(dedupe(enrich(parse(read_gz(path)))))` ek compressed multi-GB file ko constant memory mein process karta hai.',
      },
      {
        en: '**Django `QuerySet.iterator(chunk_size=...)` is the streaming escape hatch** — for a management command that walks millions of rows, the default caching would load them all; `.iterator()` fetches in chunks and yields, keeping memory flat. `StreamingHttpResponse` takes a generator so a large CSV export streams to the client row by row.',
        hi: '**Django `QuerySet.iterator(chunk_size=...)` streaming escape hatch hai** — laakhon rows walk karne wale ek management command ke liye. `StreamingHttpResponse` ek generator leta hai taaki ek bada CSV export client ko row by row stream ho.',
      },
      {
        en: '**The "materialise for length/reuse, stream for single-pass volume" decision is a recurring design choice** — a serializer that reports `count` and renders items needs a list; a webhook fan-out that sends N requests and moves on can stream. Getting it wrong shows up as either a memory spike or a "the second loop is empty" bug.',
        hi: '**"length/reuse ke liye materialise, single-pass volume ke liye stream" nirnay ek baar-baar aane wala design chunaav hai** — ek serializer jo `count` report karta hai aur items render karta hai use ek list chahiye; ek webhook fan-out jo N requests bhejta hai stream kar sakta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How does a generator pipeline work, and why does it use constant memory?',
        qHi: 'Ek generator pipeline kaise kaam karti hai, aur ye constant memory kyun istemal karti hai?',
        a: 'A generator pipeline is a chain of generator functions, each taking an iterable as its argument and yielding transformed items. You compose them by nesting the calls — the innermost is the data source, each layer out is another transformation, and at the very end a consumer, like a for loop or sum or any, drives the whole thing. The key property is that nothing executes when you build the pipeline; it only runs when the consumer asks for a value. At that point the consumer calls next on the outermost generator, which calls next on the one it wraps to get an input item, which calls next on the one below it, and so on down to the source. The source produces one item, and that single item flows all the way back up through every stage — transformed, filtered, folded — until it reaches the consumer. Then the consumer asks for the next value and the whole thing repeats for one more item. Because only one item is in flight at any moment, and each stage holds just that item plus whatever small state it needs like a running counter, the peak memory of the entire pipeline is a constant that does not depend on how many items pass through. A 50-gigabyte file processed this way uses the same memory as a 50-line file. Contrast the list approach, where each stage builds a complete list before the next stage starts, so you hold several full copies of the data at once. There is also a latency benefit: the pipeline produces its first result after processing just one item, so a consumer that stops early — any, next, a loop with break — causes iteration to halt immediately and the source stops producing, which for a file means it stops reading. The trade-off is that the pipeline is a single-use iterator: once consumed it is exhausted, it has no length, and you cannot index into it, so it is the wrong tool when you need any of those.',
        aHi: 'Ek generator pipeline generator functions ki ek chain hai, har ek ek iterable ko apne argument ki tarah leti aur transformed items yield karti hai. Aap unhe calls nest karके compose karte ho — innermost data source hai, aur ekdum ant mein ek consumer poori cheez ko drive karta hai. Mukhya property ye hai ki jab aap pipeline banate ho kuch execute nahi hota; ye sirf tab chalta hai jab consumer ek value maangta hai. Us bindu par consumer outermost generator par next call karta hai, jo jise ye wrap karta hai uspar next call karta hai, aur aage source tak. Source ek item banata hai, aur wo ek item har stage ke zariye poori tarah wapas upar bahta hai. Kyunki kisi bhi pal sirf ek item transit mein hai, poori pipeline ka peak memory ek constant hai. Is tarah process ki gayi ek 50-gigabyte file ek 50-line file jitni memory istemal karti hai. Ek latency faayda bhi hai: pipeline apna pehla result sirf ek item process karके banati hai.',
      },
      {
        q: 'Give three situations where you should NOT use a generator pipeline and should materialise a list instead.',
        qHi: 'Teen sthitiyan do jahaan aapko ek generator pipeline NAHI istemal karni chahiye aur iske bجaay ek list materialise karni chahiye.',
        a: 'First, when you need the length, or to index into the result, or to slice it. A generator has no len, is not subscriptable, and cannot be sliced. If a consumer needs to report a count and also iterate the items — a serializer, a template, a report header — you need a concrete list. Second, when you iterate the result more than once. A generator pipeline is a single-use iterator; the first pass exhausts it and the second sees nothing. If two different consumers both need the data, or you loop over it and then loop again, either return a list or the caller has to materialise it, so you may as well return the list. Third, when a downstream operation has to consume the entire input anyway to produce its result — sorted, reversed, statistics functions like mean and median, collections dot Counter, random dot shuffle. Feeding a generator into sorted saves no memory, because sorted must pull every item into a list internally before it can sort; the generator just adds a layer of indirection and leaves you with an exhausted object. In that case make the generator expression the argument to sorted, which gives you back a reusable list. There is a fourth practical case: small, bounded data. For a hundred-element config list, the constant-memory advantage of a pipeline is zero, and a list comprehension or a plain loop is easier to read and to debug, since you can print intermediate results — you cannot print a generator without consuming it. The rule of thumb: stream with a generator pipeline for large or unbounded data consumed in a single pass; materialise a list for small data, or whenever you need length, indexing, repeated iteration, or a whole-input operation.',
        aHi: 'Pehla, jab aapko length chahiye, ya result mein index karna hai, ya ise slice karna hai. Ek generator ka koi len nahi, ye subscriptable nahi, aur slice nahi ho sakta. Agar ek consumer ko ek count report karna hai aur items bhi iterate karne hain, aapko ek concrete list chahiye. Doosra, jab aap result ko ek se zyaada baar iterate karte ho. Ek generator pipeline ek single-use iterator hai; pehla pass ise khatam karta hai. Teesra, jab ek downstream operation ko waise bhi poora input consume karna hai apna result banane ko — sorted, reversed, statistics functions, collections dot Counter. Ek generator ko sorted mein feed karna koi memory nahi bachata. Us case mein generator expression ko sorted ka argument banao. Ek chautha vyavhaarik case: chhota, bounded data. Ek sau-element config list ke liye, ek pipeline ka constant-memory faayda shoonya hai.',
      },
    ],

    exercises: [
      {
        task: 'Build a 4-stage pipeline over `["10", "", "-3", "abc", "20", "0", "7"]`: `strip_blank` (drop empty/whitespace strings), `to_int` (parse, skip un-parseable), `positives` (keep > 0), and consume with `sum`. Result should be `37`. Add a `print` to each stage and confirm items flow one at a time (interleaved output), not stage by stage.',
        taskHi: '`["10", "", "-3", "abc", "20", "0", "7"]` par ek 4-stage pipeline banao: `strip_blank`, `to_int`, `positives`, aur `sum` se consume karo. Result `37` hona chahiye. Har stage mein ek `print` jodo aur confirm karo items ek-ek karke bahte hain.',
        hint: 'Each stage: `def stage(src): for x in src: print(...); ... yield ...`. `to_int`: `try: yield int(x) except ValueError: continue`. Compose: `sum(positives(to_int(strip_blank(data))))`. The prints will interleave (strip, int, pos, strip, int, ...) not group.',
        hintHi: 'Har stage: `def stage(src): for x in src: print(...); ... yield ...`. `to_int`: `try: yield int(x) except ValueError: continue`. Compose: `sum(positives(to_int(strip_blank(data))))`.',
      },
      {
        task: 'Write `first_matching(predicate, source)` that returns the first item where `predicate(item)` is true, or `None`, built as `next((x for x in source if predicate(x)), None)`. Wrap `source` in a generator that prints each item it yields, and show that searching `range(1000)` for the first multiple of 7 only pulls 8 items (0..7), not 1000.',
        taskHi: '`first_matching(predicate, source)` likho jo pehla item lautae jahaan `predicate(item)` true hai, ya `None`. `source` ko ek generator mein wrap karo jo har item print kare, aur dikhao ki `range(1000)` mein pehle 7 ke multiple ke liye search sirf 8 items pull karta hai.',
        hint: '`return next((x for x in source if predicate(x)), None)`. Wrap: `def loud(it): for x in it: print("pulled", x); yield x`. `first_matching(lambda n: n % 7 == 0, loud(range(1000)))` prints `pulled 0` through `pulled 7` then returns 7.',
        hintHi: '`return next((x for x in source if predicate(x)), None)`. Wrap: `def loud(it): for x in it: print("pulled", x); yield x`.',
      },
      {
        task: 'Contrast two implementations of `report(data)` that must return `{"count": N, "total": T, "items": [...]}`: (a) a generator pipeline that you then try to use three ways (fails on `len` / second pass), (b) a single list comprehension that works. Write both, run (a) to see the failure, then (b). State the rule.',
        taskHi: '`report(data)` ke do implementations ka विपरीत karo jo `{"count": N, "total": T, "items": [...]}` lautana chahiye: (a) ek generator pipeline (fail hota hai), (b) ek single list comprehension (kaam karta hai). Dono likho, chalao, niyam batao.',
        hint: '(a) `g = (transform(x) for x in data if keep(x)); return {"count": len(g), ...}` -> `TypeError` on `len(g)`, and even if you `sum` first, `items` would be `[]`. (b) `items = [transform(x) for x in data if keep(x)]; return {"count": len(items), "total": sum(items), "items": items}`. Rule: if you need it more than once (or its length), materialise.',
        hintHi: '(a) `g = (...); return {"count": len(g), ...}` -> `TypeError`. (b) `items = [...]; return {"count": len(items), "total": sum(items), "items": items}`. Niyam: agar aapko ise ek se zyaada baar (ya iski length) chahiye, materialise karo.',
      },
    ],

    keyTakeaways: [
      'A generator pipeline is `gen1 -> gen2 -> gen3 -> consumer`, each stage `def stage(src): for x in src: ... yield ...`. Composed by nesting; nothing runs until the consumer pulls.',
      'It uses CONSTANT memory — only one item is in flight per stage — regardless of total data size. A 50 GB stream uses the same memory as a 50-line one.',
      'It produces its first result immediately, so a consumer that stops early (`any`, `next`, `break`) halts the whole pipeline and the source stops producing — early termination flows backward.',
      'Consumers that pair well with a lazy pipeline: `for`, `sum`, `any`, `all`, `min`/`max`, `", ".join(...)`, `next(gen, default)`, `dict(...)` — anything that makes a single pass.',
      'Use a pipeline when data is LARGE or STREAMING (files, network, DB cursors, logs) AND consumed exactly once.',
      'Use a LIST instead when: data is small; you need `len`/indexing/slicing; you iterate more than once; you want to debug-print it; or a later step (`sorted`, `reversed`, `Counter`, `statistics`, `random.shuffle`) consumes the whole input anyway.',
      'Putting a generator in front of `sorted`/`reversed`/`statistics.*` is pointless — make the generator expression the ARGUMENT to those, which return a reusable list.',
      'Django QuerySets are lazy and CACHE on first iteration (a second `for` is free) — the opposite of a bare generator. `.iterator(chunk_size=...)` opts out of the cache for streaming millions of rows.',
    ],
    keyTakeawaysHi: [
      'Ek generator pipeline `gen1 -> gen2 -> gen3 -> consumer` hai, har stage `def stage(src): for x in src: ... yield ...`. Nesting se composed; kuch nahi chalta jab tak consumer pull nahi karta.',
      'Ye CONSTANT memory istemal karti hai — prati stage sirf ek item transit mein — total data size chahe kuch bhi ho. Ek 50 GB stream ek 50-line jitni memory istemal karti hai.',
      'Ye apna pehla result turant banati hai, isliye ek consumer jo jaldi rukta hai (`any`, `next`, `break`) poori pipeline rok deta hai aur source produce karna band kar deta hai — early termination peechhe bahti hai.',
      'Consumers jo ek lazy pipeline ke saath achhe milte hain: `for`, `sum`, `any`, `all`, `min`/`max`, `", ".join(...)`, `next(gen, default)`, `dict(...)` — kuch bhi jo ek single pass karta hai.',
      'Ek pipeline istemal karo jab data BADA ya STREAMING hai (files, network, DB cursors, logs) AUR bilkul ek baar consume hota hai.',
      'Ek LIST istemal karo jab: data chhota hai; aapko `len`/indexing/slicing chahiye; aap ek se zyaada baar iterate karte ho; aap debug-print karna chahte ho; ya ek baad ka step (`sorted`, `reversed`, `Counter`, `statistics`) waise bhi poora input consume karta hai.',
      '`sorted`/`reversed`/`statistics.*` ke aage ek generator rakhna bekaar hai — generator expression ko un ka ARGUMENT banao, jo ek reusable list lautate hain.',
      'Django QuerySets lazy hain aur pehli iteration par CACHE karti hain (doosra `for` free) — ek nange generator ka ulta. `.iterator(chunk_size=...)` laakhon rows stream karne ko cache se opt out karta hai.',
    ],
  },
];
