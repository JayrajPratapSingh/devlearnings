/**
 * Python Complete Course — Module 3: Functions & Scope, lessons 4-6.
 *
 * Lesson 4: first-class functions and lambdas — functions as values you can
 *           pass, return, and store; `lambda` (one expression only); `key=` in
 *           `sorted`/`min`/`max`; when a lambda helps and when a `def` is clearer.
 * Lesson 5: decorators — `@deco` above a `def` IS `f = deco(f)`; the
 *           `*args, **kwargs` wrapper; `functools.wraps`; decorators that take
 *           arguments (a factory returning a decorator); stacking.
 * Lesson 6: practical decorator patterns — timing, caching (`lru_cache`),
 *           retry, `@property`/`@classmethod`/`@staticmethod`, and when NOT to
 *           reach for a decorator.
 *
 * NOTE for future editors: same rules as the rest of this course. Every
 * backtick inside simple/simpleHi/content/contentHi is `\`` (inline code inside
 * ``` blocks included). `examples` use `code` + `output`. Run every sample with
 * `python`. Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_3_PART2: CourseLesson[] = [
  {
    slug: 'py-first-class-functions-and-lambdas',
    title: 'First-Class Functions and Lambdas',
    titleHi: 'First-Class Functions Aur Lambdas',
    description: 'Wanting to sort a list of records by one field, and writing a whole nested loop or a `cmp`-style helper — when the language already lets you hand `sorted` a small function that says "here is the value to sort by". In Python a function is an ordinary value: you can put it in a variable, pass it as an argument, return it, store it in a list or dict. `lambda` is a way to write a tiny throwaway one right where you need it.',
    descriptionHi: 'Ek list of records ko ek field se sort karna chahna, aur ek poora nested loop ya ek `cmp`-style helper likhna — jab bhaasha pehle se aapko `sorted` ko ek chhota function dene deti hai jo kehta hai "yahaan sort karne ki value hai". Python mein ek function ek saamaanya value hai: aap ise ek variable mein rakh sakte ho, ek argument ki tarah pass kar sakte ho, return kar sakte ho, ek list ya dict mein store kar sakte ho. `lambda` ek tiny throwaway ise wahin likhne ka tarika hai jahaan aapko chahiye.',
    difficulty: 'EASY',
    duration: 18,
    order: 4,

    analogy: {
      en: '**Handing a sorting clerk a single index card that says "judge each folder by its due date".** The clerk already knows how to sort a stack; what the clerk needs from you is one instruction: given a folder, what is the thing to compare? You could write that instruction as a formal one-page procedure and staple it to the request, or you could scribble it on a sticky note in the moment — "due date", "last name", "file size". A `lambda` is the sticky note: a function small enough to write inline, with no name, used once and forgotten. A `def` is the formal procedure: it has a name, it can be reused, it can hold several steps and comments. Both are functions and both are values you can hand to the clerk — Python does not care whether the thing you pass came from a `def` or a `lambda`. The only real limits on the sticky note are that it holds exactly one expression (no statements, no multiple lines) and that if you find yourself writing the same sticky note in three places, it wanted to be a `def` all along.',
      hi: '**Ek sorting clerk ko ek akela index card dena jo kehta hai "har folder ko iski due date se aankho".** Clerk pehle se ek stack sort karna jaanta hai; clerk ko aapse jo chahiye wo ek instruction hai: ek folder diya, compare karne ki cheez kya hai? Aap us instruction ko ek formal one-page procedure ki tarah likh sakte ho aur request se staple kar sakte ho, ya aap ise us pal ek sticky note par likh sakte ho — "due date", "last name", "file size". Ek `lambda` sticky note hai: ek function itna chhota ki inline likha jaaye, bina naam, ek baar istemal aur bhula diya. Ek `def` formal procedure hai: iska ek naam hai, ise reuse kiya ja sakta hai, ye kai steps aur comments rakh sakta hai. Dono functions hain aur dono values hain jo aap clerk ko de sakte ho — Python parwaah nahi karta ki aap jo pass karte ho wo ek `def` se aaya ya ek `lambda` se. Sticky note par ekmatra asli seemayein ye hain ki ye bilkul ek expression rakhta hai (koi statements nahi, koi multiple lines nahi) aur agar aap khud ko wahi sticky note teen jagah likhte paate ho, wo shuru se ek `def` banna chahta tha.',
    },

    simple: `**Start with the awkward way.** Sorting records without a key function:

\`\`\`python
users = [
    {"name": "Cara", "age": 31},
    {"name": "Ali",  "age": 25},
    {"name": "Bo",   "age": 42},
]

# awkward: decorate-sort-undecorate by hand
pairs = [(u["age"], u) for u in users]
pairs.sort()
by_age = [u for _, u in pairs]
\`\`\`

**The Python way: pass a function that says what to sort by**

\`\`\`python
by_age  = sorted(users, key=lambda u: u["age"])
by_name = sorted(users, key=lambda u: u["name"])
oldest  = max(users, key=lambda u: u["age"])
names   = list(map(lambda u: u["name"], users))
adults  = list(filter(lambda u: u["age"] >= 18, users))

print([u["name"] for u in by_age])   # ['Ali', 'Cara', 'Bo']
print(oldest["name"])                # Bo
\`\`\`

**Functions are values — store, pass, return them**

\`\`\`python
def shout(s):  return s.upper() + "!"
def whisper(s): return "(" + s.lower() + ")"

styles = {"shout": shout, "whisper": whisper}   # functions in a dict
print(styles["shout"]("hello"))                 # HELLO!

def apply_twice(fn, x):        # a function taking a function
    return fn(fn(x))
print(apply_twice(shout, "hi"))                 # HI!!
\`\`\`

\`\`\`
A FUNCTION IS A VALUE. You can:
    f = some_function          assign it (no parentheses -> the function itself)
    some_function()            call it  (parentheses -> run it)
    [f1, f2], {"k": f1}        store it in a list/dict
    higher(f1)                 pass it as an argument
    return inner               return it from another function

lambda args: expression   ->  a function with NO name and exactly ONE expression
    lambda: 0                     (no args)
    lambda x: x * 2               (one arg)
    lambda x, y=1: x + y          (default arg)
    -- NO statements, NO 'return', NO multiple lines. If you need those, use def.
\`\`\``,

    simpleHi: `**Ajeeb tarike se shuru.** Bina ek key function ke records sort karna:

\`\`\`python
users = [
    {"name": "Cara", "age": 31},
    {"name": "Ali",  "age": 25},
    {"name": "Bo",   "age": 42},
]

# ajeeb: haath se decorate-sort-undecorate
pairs = [(u["age"], u) for u in users]
pairs.sort()
by_age = [u for _, u in pairs]
\`\`\`

**Python tarika: ek function pass karo jo bataaye kis se sort karna hai**

\`\`\`python
by_age  = sorted(users, key=lambda u: u["age"])
by_name = sorted(users, key=lambda u: u["name"])
oldest  = max(users, key=lambda u: u["age"])
names   = list(map(lambda u: u["name"], users))
adults  = list(filter(lambda u: u["age"] >= 18, users))

print([u["name"] for u in by_age])   # ['Ali', 'Cara', 'Bo']
print(oldest["name"])                # Bo
\`\`\`

**Functions values hain — store, pass, return karo**

\`\`\`python
def shout(s):  return s.upper() + "!"
def whisper(s): return "(" + s.lower() + ")"

styles = {"shout": shout, "whisper": whisper}   # ek dict mein functions
print(styles["shout"]("hello"))                 # HELLO!

def apply_twice(fn, x):        # ek function jo ek function leta hai
    return fn(fn(x))
print(apply_twice(shout, "hi"))                 # HI!!
\`\`\`

\`\`\`
EK FUNCTION EK VALUE HAI. Aap kar sakte ho:
    f = some_function          ise assign (bina parentheses -> function khud)
    some_function()            ise call  (parentheses -> ise chalao)
    [f1, f2], {"k": f1}        ise ek list/dict mein store
    higher(f1)                 ise ek argument ki tarah pass
    return inner               ise ek doosre function se return

lambda args: expression   ->  BINA naam aur bilkul EK expression waala ek function
    lambda: 0                     (koi args nahi)
    lambda x: x * 2               (ek arg)
    lambda x, y=1: x + y          (default arg)
    -- KOI statements nahi, KOI 'return' nahi, KOI multiple lines nahi. Chahiye to def.
\`\`\``,

    content: `## Calling vs referring

\`\`\`python
len            # <built-in function len>   -- the function object itself
len("abc")     # 3                          -- calling it

# the classic bug: calling when you meant to refer
handlers = {
    "save": save_file(),      # WRONG -- calls save_file NOW, stores its return value
    "load": load_file,        # right -- stores the function, to be called later
}
\`\`\`

A bare name is the function; a name followed by \`()\` runs it. When registering callbacks, keys in a dispatch dict, or a \`key=\` argument, you want the bare name (or a \`lambda\`), not a call.

## \`sorted\` / \`min\` / \`max\` with \`key=\`

\`\`\`python
words = ["banana", "kiwi", "apple", "fig"]

sorted(words, key=len)                       # ['fig', 'kiwi', 'apple', 'banana']
sorted(words, key=str.lower)                 # case-insensitive
sorted(words, key=lambda w: (len(w), w))     # by length, then alphabetically
sorted(users, key=lambda u: -u["age"])       # descending by age
sorted(users, key=lambda u: u["age"], reverse=True)   # same, clearer

max(words, key=len)                          # 'banana'
min(users, key=lambda u: u["age"])           # youngest
\`\`\`

The \`operator\` module gives named, faster alternatives to the most common lambdas:

\`\`\`python
from operator import itemgetter, attrgetter

sorted(users, key=itemgetter("age"))         # same as lambda u: u["age"]
sorted(points, key=attrgetter("x"))          # same as lambda p: p.x
sorted(records, key=itemgetter("last", "first"))   # multi-key
\`\`\`

## \`map\` / \`filter\` vs comprehensions

\`\`\`python
# these are equivalent; the comprehension is usually preferred in Python:
list(map(lambda x: x**2, nums))        vs    [x**2 for x in nums]
list(filter(lambda x: x > 0, nums))    vs    [x for x in nums if x > 0]

# map/filter shine when you already HAVE a named function:
list(map(str.strip, lines))
list(map(int, row))
list(filter(None, values))             # drops falsy values
\`\`\`

## \`lambda\` limits, and when to use \`def\` instead

\`\`\`python
# a lambda holds ONE expression. these are impossible in a lambda:
lambda x: x = 1                 # SyntaxError -- no assignment
lambda x:                       # SyntaxError -- no statements
lambda x: (log(x); return x)    # SyntaxError -- no ';', no 'return', no block

# use def when you need a name, multiple steps, a docstring, or reuse:
def clean(s):
    """Strip, lowercase, collapse internal whitespace."""
    return " ".join(s.lower().split())
\`\`\`

Style rule (PEP 8): **never assign a lambda to a name.** \`f = lambda x: x+1\` should be \`def f(x): return x + 1\` — same length, gets a real \`__name__\`, shows up properly in tracebacks. A lambda is for passing inline, unnamed.

## Returning functions (a first look at closures + decorators)

\`\`\`python
def power_of(exp):
    def raise_it(base):
        return base ** exp        # 'exp' captured from the enclosing scope
    return raise_it

square = power_of(2)
cube   = power_of(3)
square(5)    # 25
cube(5)      # 125
\`\`\`

\`power_of\` is a *function factory*: it builds and returns a new function each call. This is the shape of every decorator — a function that takes a function (or config) and returns a function.`,

    contentHi: `## Call karna vs refer karna

\`\`\`python
len            # <built-in function len>   -- function object khud
len("abc")     # 3                          -- ise call karna

# classic bug: call karna jab aapka matlab refer karna tha
handlers = {
    "save": save_file(),      # GALAT -- save_file ABHI call karta hai, iski return value store karta hai
    "load": load_file,        # sahi -- function store karta hai, baad mein call hone ko
}
\`\`\`

Ek nanga naam function hai; ek naam \`()\` ke saath ise chalata hai. Callbacks register karte waqt, ek dispatch dict mein keys, ya ek \`key=\` argument, aap nanga naam (ya ek \`lambda\`) chahte ho, ek call nahi.

## \`sorted\` / \`min\` / \`max\` \`key=\` ke saath

\`\`\`python
words = ["banana", "kiwi", "apple", "fig"]

sorted(words, key=len)                       # ['fig', 'kiwi', 'apple', 'banana']
sorted(words, key=str.lower)                 # case-insensitive
sorted(words, key=lambda w: (len(w), w))     # length se, phir alphabetically
sorted(users, key=lambda u: -u["age"])       # age se descending
sorted(users, key=lambda u: u["age"], reverse=True)   # wahi, saaf

max(words, key=len)                          # 'banana'
min(users, key=lambda u: u["age"])           # sabse chhota
\`\`\`

\`operator\` module sabse aam lambdas ke named, tez vikalp deta hai:

\`\`\`python
from operator import itemgetter, attrgetter

sorted(users, key=itemgetter("age"))         # lambda u: u["age"] jaisa
sorted(points, key=attrgetter("x"))          # lambda p: p.x jaisa
sorted(records, key=itemgetter("last", "first"))   # multi-key
\`\`\`

## \`map\` / \`filter\` vs comprehensions

\`\`\`python
# ye samaan hain; comprehension aam taur par Python mein prefer kiya jaata hai:
list(map(lambda x: x**2, nums))        vs    [x**2 for x in nums]
list(filter(lambda x: x > 0, nums))    vs    [x for x in nums if x > 0]

# map/filter tab chamakte hain jab aapke paas pehle se ek named function HAI:
list(map(str.strip, lines))
list(map(int, row))
list(filter(None, values))             # falsy values girata hai
\`\`\`

## \`lambda\` seemayein, aur kab \`def\` istemal karein

\`\`\`python
# ek lambda EK expression rakhta hai. ye ek lambda mein asambhav hain:
lambda x: x = 1                 # SyntaxError -- koi assignment nahi
lambda x:                       # SyntaxError -- koi statements nahi
lambda x: (log(x); return x)    # SyntaxError -- koi ';', koi 'return', koi block nahi

# def istemal karo jab aapko ek naam, multiple steps, ek docstring, ya reuse chahiye:
def clean(s):
    """Strip, lowercase, collapse internal whitespace."""
    return " ".join(s.lower().split())
\`\`\`

Style niyam (PEP 8): **kabhi ek lambda ko ek naam assign mat karo.** \`f = lambda x: x+1\` \`def f(x): return x + 1\` hona chahiye — samaan lambaai, ek asli \`__name__\` paata hai, tracebacks mein sahi dikhta hai. Ek lambda inline pass karne ke liye hai, unnamed.

## Functions return karna (closures + decorators ki ek pehli jhalak)

\`\`\`python
def power_of(exp):
    def raise_it(base):
        return base ** exp        # 'exp' enclosing scope se capture
    return raise_it

square = power_of(2)
cube   = power_of(3)
square(5)    # 25
cube(5)      # 125
\`\`\`

\`power_of\` ek *function factory* hai: ye har call ek naya function banaata aur return karta hai. Ye har decorator ka aakaar hai — ek function jo ek function (ya config) leta hai aur ek function return karta hai.`,

    examples: [
      {
        title: 'Functions as dict values: a dispatch table',
        titleHi: 'Dict values ki tarah functions: ek dispatch table',
        code: `def add(a, b): return a + b
def sub(a, b): return a - b
def mul(a, b): return a * b

ops = {"+": add, "-": sub, "*": mul}

def calc(a, op, b):
    return ops[op](a, b)

print(calc(6, "+", 4))
print(calc(6, "-", 4))
print(calc(6, "*", 4))

# the same, but the bug: calling instead of referring
broken = {"+": add(0, 0)}          # stored 0, not the function
print(type(broken["+"]))`,
        output: `10
2
24
<class 'int'>`,
        explain: '`ops` maps a string to a function *object* (bare name, no parens). `ops[op](a, b)` looks the function up, then calls it. A dispatch table like this replaces a long `if/elif` chain. `broken` shows the classic slip: `add(0, 0)` runs `add` immediately and stores the result `0`.',
        explainHi: '`ops` ek string ko ek function *object* se map karta hai (nanga naam, koi parens nahi). `ops[op](a, b)` function lookup karta hai, phir ise call karta hai. Aisa ek dispatch table ek lambe `if/elif` chain ki jagah leta hai. `broken` classic galti dikhaata hai: `add(0, 0)` `add` ko turant chalata hai aur result `0` store karta hai.',
      },
      {
        title: 'key= for sorting, and operator.itemgetter',
        titleHi: 'sorting ke liye key=, aur operator.itemgetter',
        code: `from operator import itemgetter

people = [
    {"first": "Ada", "last": "Byron", "age": 36},
    {"first": "Guido", "last": "van Rossum", "age": 68},
    {"first": "Grace", "last": "Hopper", "age": 85},
    {"first": "Alan", "last": "Turing", "age": 41},
]

by_age = sorted(people, key=lambda p: p["age"])
print([p["first"] for p in by_age])

by_last = sorted(people, key=itemgetter("last"))
print([p["last"] for p in by_last])

by_age_desc = sorted(people, key=itemgetter("age"), reverse=True)
print([p["first"] for p in by_age_desc])

oldest = max(people, key=itemgetter("age"))
print(oldest["first"], oldest["age"])

total_age = sum(map(itemgetter("age"), people))
print("total:", total_age)`,
        output: `['Ada', 'Alan', 'Guido', 'Grace']
['Byron', 'Hopper', 'Turing', 'van Rossum']
['Grace', 'Guido', 'Alan', 'Ada']
Grace 85
total: 230`,
        explain: '`key=` takes a function applied to each element to produce the value to compare. `lambda p: p["age"]` and `itemgetter("age")` do the same job; `itemgetter` is a touch faster and reads well. `reverse=True` is clearer than `key=lambda p: -p["age"]` and also works for non-numeric keys.',
        explainHi: '`key=` ek function leta hai jo har element par lagaaya jaata hai compare karne ki value banaane ko. `lambda p: p["age"]` aur `itemgetter("age")` wahi kaam karte hain; `itemgetter` thoda tez hai aur achha padhta hai. `reverse=True` `key=lambda p: -p["age"]` se saaf hai aur non-numeric keys ke liye bhi kaam karta hai.',
      },
      {
        title: 'A function factory returning a configured function',
        titleHi: 'Ek function factory jo ek configured function return karta hai',
        code: `def between(lo, hi):
    def check(x):
        return lo <= x <= hi
    return check

in_percent = between(0, 100)
is_byte    = between(0, 255)

print(in_percent(50), in_percent(150))
print(is_byte(200), is_byte(300))

# use the factory output as a filter predicate:
values = [-5, 0, 42, 100, 101, 255, 256]
print(list(filter(is_byte, values)))

# store several configured checks in a dict:
validators = {
    "percent": between(0, 100),
    "port":    between(1, 65535),
    "age":     between(0, 130),
}
print(validators["port"](8080))
print(validators["age"](200))`,
        output: `True False
True False
[0, 42, 100, 101, 255]
True
False`,
        explain: '`between(lo, hi)` returns a fresh `check` function that has captured `lo` and `hi` in a closure. Each call to `between` produces an independent predicate. Those predicates are values — usable directly with `filter`, or stored in a dict of validators. This factory shape is exactly what a decorator-with-arguments uses.',
        explainHi: '`between(lo, hi)` ek fresh `check` function return karta hai jisne `lo` aur `hi` ko ek closure mein capture kiya. `between` ki har call ek independent predicate banaati hai. Wo predicates values hain — `filter` ke saath seedhe istemal, ya validators ke ek dict mein store. Ye factory aakaar bilkul wahi hai jo ek decorator-with-arguments istemal karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `f = lambda x: x.strip().lower()      # PEP 8 says no
callbacks = {"ready": lambda: print("ready")}   # unnamed, hard to debug`,
        right: `def f(x):
    return x.strip().lower()`,
        why: 'Assigning a lambda to a name gives you all the downsides of a `def` (it has a name now) with none of the upsides: the `__name__` is `"<lambda>"`, tracebacks are unhelpful, you cannot add a docstring. If it deserves a name, it deserves `def`. Lambdas are for passing inline as an argument.',
        whyHi: 'Ek lambda ko ek naam assign karna aapko ek `def` ke saare nuksaan deta hai (ab iska ek naam hai) bina koi faayda: `__name__` `"<lambda>"` hai, tracebacks bekaar hain, aap ek docstring nahi jod sakte. Agar ise ek naam chahiye, ise `def` chahiye. Lambdas ek argument ki tarah inline pass karne ke liye hain.',
      },
      {
        wrong: `signals = {
    "start": on_start(),      # called immediately -- stores the return value
    "stop":  on_stop(),
}`,
        right: `signals = {
    "start": on_start,        # the function object, called later
    "stop":  on_stop,
}`,
        why: 'A dispatch table, a `key=` argument, an event registration, or a `default_factory` all want the function *object* — the bare name with no `()`. Adding `()` calls it right now and stores whatever it returned (often `None`). This is one of the most common Python slips.',
        whyHi: 'Ek dispatch table, ek `key=` argument, ek event registration, ya ek `default_factory` sab function *object* chahte hain — nanga naam bina `()`. `()` jodna ise abhi call karta hai aur jo bhi ye lautaata hai (aksar `None`) store karta hai. Ye sabse aam Python galtiyon mein se ek hai.',
      },
      {
        wrong: `# reaching for map/filter/lambda where a comprehension is clearer:
result = list(filter(lambda x: x is not None, map(lambda r: r.get("id"), rows)))`,
        right: `result = [r["id"] for r in rows if "id" in r]`,
        why: 'Nested `map`/`filter` with lambdas is dense and reads inside-out. A comprehension states the same thing in reading order: what you collect, what you iterate, what you keep. Reserve `map`/`filter` for when you already have a named function (`map(int, row)`, `filter(None, xs)`).',
        whyHi: 'Lambdas ke saath nested `map`/`filter` ghana hai aur andar-baahar padhta hai. Ek comprehension wahi cheez reading order mein batata hai: aap kya collect karte ho, kya iterate karte ho, kya rakhte ho. `map`/`filter` ko tab ke liye rakho jab aapke paas pehle se ek named function hai.',
      },
    ],

    realWorld: [
      {
        en: '**`sorted(queryset, key=...)`, `max(items, key=...)`, `Model.objects.order_by()` overrides in Python** all lean on key functions — a DRF view sorting serialized results by a computed field uses `sorted(data, key=lambda d: d["score"], reverse=True)`.',
        hi: '**`sorted(queryset, key=...)`, `max(items, key=...)`, Python mein `Model.objects.order_by()` overrides** sab key functions par nirbhar karte hain — ek DRF view jo serialized results ko ek computed field se sort karta hai `sorted(data, key=lambda d: d["score"], reverse=True)` istemal karta hai.',
      },
      {
        en: '**Dispatch dicts replace `if/elif` ladders** in real code — a webhook handler `{"payment.succeeded": handle_success, "payment.failed": handle_failure}[event_type](payload)`, a serializer picking a method by resource type. Django\'s URL resolver and DRF\'s `get_serializer_class` are variations of this.',
        hi: '**Dispatch dicts `if/elif` seedhiyon ki jagah lete hain** asli code mein — ek webhook handler, ek serializer jo resource type se ek method chunta hai. Django ka URL resolver aur DRF ka `get_serializer_class` iske roop hain.',
      },
      {
        en: '**`django.utils.functional.lazy`, `functools.partial` in `path()` calls, signal receivers, and `default=` callables in model fields** are all "a function passed as a value". Passing `now()` instead of `now` is the same call-vs-refer bug as a dispatch dict.',
        hi: '**`django.utils.functional.lazy`, `path()` calls mein `functools.partial`, signal receivers, aur model fields mein `default=` callables** sab "ek value ki tarah pass kiya function" hain. `now` ke bajaye `now()` pass karna wahi call-vs-refer bug hai jo ek dispatch dict mein.',
      },
    ],

    interviewQA: [
      {
        q: 'What does "functions are first-class objects" mean in Python, and what can you do because of it?',
        qHi: '"Functions first-class objects hain" ka Python mein kya matlab hai, aur iski wajah se aap kya kar sakte ho?',
        a: 'It means a function is an ordinary value, the same kind of thing as an integer or a string or a list, and everything you can do with those values you can also do with a function. You can bind it to a variable — writing the function\'s name without parentheses gives you the function object itself, not a call to it. You can put functions in a list or as the values of a dictionary, which is how you build a dispatch table that replaces a chain of if-elif branches: look the operation up by key and call whatever function you got back. You can pass a function as an argument to another function, which is what sorted and min and max and map and filter all rely on through their key or function parameter — you hand them a small function that, given an element, returns the thing to compare or transform. And you can return a function from a function, which combined with closures lets you write factories that produce configured functions, and is the mechanism behind decorators. The practical consequence is that a lot of behaviour that other languages express with special syntax or single-method interfaces, Python expresses by just passing a function. The one thing to stay alert to is the difference between referring to a function and calling it: a bare name is the function, a name followed by parentheses runs it and evaluates to its return value. When you are registering a callback or supplying a key function or filling a dispatch dict, you want the bare name; accidentally adding parentheses calls the function immediately and stores its result, usually None, which is a very common bug.',
        aHi: 'Iska matlab ek function ek saamaanya value hai, wahi tarah ki cheez jaise ek integer ya ek string ya ek list, aur jo kuch aap un values ke saath kar sakte ho wo aap ek function ke saath bhi kar sakte ho. Aap ise ek variable se bind kar sakte ho — function ka naam bina parentheses likhna aapko function object khud deta hai, ise ek call nahi. Aap functions ko ek list mein ya ek dictionary ki values ki tarah rakh sakte ho, jo aise aap ek dispatch table banaate ho jo if-elif branches ki ek chain ki jagah leta hai. Aap ek function ko ek doosre function ke argument ki tarah pass kar sakte ho, jo sorted aur min aur max aur map aur filter sab apne key ya function parameter ke zariye nirbhar karte hain. Aur aap ek function se ek function return kar sakte ho, jo closures ke saath milkar aapko factories likhne deta hai jo configured functions banaati hain, aur decorators ke peechhe ka tantra hai. Ek cheez jiske prati satark rehna hai wo ek function ko refer karne aur ise call karne ke beech ka antar hai: ek nanga naam function hai, ek naam parentheses ke saath ise chalata hai.',
      },
      {
        q: 'When should you use a `lambda`, and when should you use a `def` instead?',
        qHi: 'Aapko kab ek `lambda` istemal karna chahiye, aur kab iske bajaye ek `def`?',
        a: 'A lambda is an anonymous function limited to a single expression — no statements, no assignments, no return keyword, no multiple lines. Use it when you need a small function right at the point where you pass it as an argument, and it is not worth a name: the key function for a sort or a min or a max, a quick predicate for filter, a small transform for map, a default factory. The value of writing it inline is that the reader sees exactly what it does at the call site without jumping to a definition elsewhere. Use a def in essentially every other situation. If the function needs a name because you call it from more than one place, use def. If it needs more than one expression — a couple of steps, a local variable, a guard clause — you have no choice, because a lambda cannot express those. If it deserves a docstring or a type annotation, use def. And critically, do not assign a lambda to a variable: writing f equals lambda x colon something gives you a named function whose name attribute is the unhelpful string lambda in angle brackets, which makes tracebacks and debugging worse, for no saving over def f of x colon return something, which is the same number of characters. The style guides call this out explicitly. There is also a readability threshold: even as an inline argument, if the lambda is long or has nested calls or a conditional expression, a named def just above the call is usually clearer than cramming it into the argument list. So the rule of thumb is: lambda only as an unnamed inline argument that is short; def for everything with a name, everything with more than one expression, and anything you would want to test or document.',
        aHi: 'Ek lambda ek anonymous function hai jo ek akele expression tak seemit hai — koi statements nahi, koi assignments nahi, koi return keyword nahi, koi multiple lines nahi. Ise tab istemal karo jab aapko us bindu par ek chhota function chahiye jahaan aap ise ek argument ki tarah pass karte ho, aur ye ek naam ke laayak nahi: ek sort ya ek min ya ek max ke liye key function, filter ke liye ek quick predicate, map ke liye ek chhota transform. Ise inline likhne ki value ye hai ki reader call site par bilkul dekhta hai ki ye kya karta hai. Lagbhag har doosri sthiti mein ek def istemal karo. Agar function ko ek naam chahiye kyunki aap ise ek se zyaada jagah se call karte ho, def istemal karo. Agar ise ek se zyaada expression chahiye, aapke paas koi vikalp nahi. Aur mahatvapurna, ek lambda ko ek variable assign mat karo: f equals lambda x colon kuch likhna aapko ek named function deta hai jiska name attribute bekaar string lambda angle brackets mein hai.',
      },
    ],

    exercises: [
      {
        task: 'Given `files = [("a.txt", 300), ("b.log", 50), ("c.csv", 1200), ("d.md", 50)]`, produce: sorted by size ascending; sorted by size then name; the largest file; total size (use `sum` + `map` or a generator). Use `key=` and/or `operator.itemgetter`.',
        taskHi: '`files = [("a.txt", 300), ("b.log", 50), ("c.csv", 1200), ("d.md", 50)]` diya, banao: size se ascending sorted; size phir name se sorted; sabse bada file; total size (`sum` + `map` ya ek generator istemal karo). `key=` aur/ya `operator.itemgetter` istemal karo.',
        hint: '`sorted(files, key=lambda f: f[1])`; `sorted(files, key=lambda f: (f[1], f[0]))`; `max(files, key=lambda f: f[1])`; `sum(size for _, size in files)`. `itemgetter(1)` replaces `lambda f: f[1]`.',
        hintHi: '`sorted(files, key=lambda f: f[1])`; `sorted(files, key=lambda f: (f[1], f[0]))`; `max(files, key=lambda f: f[1])`; `sum(size for _, size in files)`. `itemgetter(1)` `lambda f: f[1]` ki jagah leta hai.',
      },
      {
        task: 'Build a dispatch dict `ops` mapping `"upper"`, `"lower"`, `"reverse"`, `"strip"` to functions (use `str.upper`, `str.lower`, a lambda for reverse, `str.strip`). Write `transform(text, *names)` that applies each named op in order. Test `transform("  Hello  ", "strip", "upper", "reverse")` -> `"OLLEH"`.',
        taskHi: 'Ek dispatch dict `ops` banao jo `"upper"`, `"lower"`, `"reverse"`, `"strip"` ko functions se map kare. `transform(text, *names)` likho jo har named op ko kram mein lagaaye. Test `transform("  Hello  ", "strip", "upper", "reverse")` -> `"OLLEH"`.',
        hint: '`ops = {"upper": str.upper, "lower": str.lower, "reverse": lambda s: s[::-1], "strip": str.strip}`. In `transform`: `for n in names: text = ops[n](text)`; `return text`. `str.upper` as a bare value works because `str.upper(x)` == `x.upper()`.',
        hintHi: '`ops = {"upper": str.upper, "lower": str.lower, "reverse": lambda s: s[::-1], "strip": str.strip}`. `transform` mein: `for n in names: text = ops[n](text)`; `return text`. `str.upper` ek nangi value ki tarah kaam karta hai kyunki `str.upper(x)` == `x.upper()`.',
      },
      {
        task: 'Write `make_validator(*rules)` where each rule is a `(predicate, message)` pair. It returns a function `validate(value)` that returns the first failing message, or `None` if all pass. Test with rules for "non-empty" and "max length 10" against `""`, `"ok"`, and `"waytoolongvalue"`.',
        taskHi: '`make_validator(*rules)` likho jahaan har rule ek `(predicate, message)` pair hai. Ye ek function `validate(value)` lautaata hai jo pehla failing message lautaata hai, ya `None` agar sab pass. "non-empty" aur "max length 10" ke rules ke saath `""`, `"ok"`, aur `"waytoolongvalue"` ke khilaaf test karo.',
        hint: '`def validate(value): for pred, msg in rules: if not pred(value): return msg; return None`. Call it like `make_validator((lambda v: len(v) > 0, "empty"), (lambda v: len(v) <= 10, "too long"))`.',
        hintHi: '`def validate(value): for pred, msg in rules: if not pred(value): return msg; return None`. Ise `make_validator((lambda v: len(v) > 0, "empty"), (lambda v: len(v) <= 10, "too long"))` ki tarah call karo.',
      },
    ],

    keyTakeaways: [
      'A function is a value: assign it (`f = fn`), store it in a list/dict, pass it as an argument, return it. A bare name is the function; `name()` calls it.',
      'The call-vs-refer bug: in a dispatch dict, `key=` argument, or callback registration, use the bare function name — adding `()` calls it immediately and stores the result.',
      '`lambda args: expression` is an anonymous function of exactly ONE expression — no statements, no `return`, no multiple lines. Use it inline as an argument.',
      'Never assign a lambda to a name (PEP 8). `f = lambda x: ...` should be `def f(x): return ...` — same length, real `__name__`, better tracebacks.',
      '`sorted`/`min`/`max` take `key=` — a function mapping each element to the value to compare. `key=lambda u: (a, b)` sorts by multiple fields; `reverse=True` beats `key=lambda u: -u.x`.',
      '`operator.itemgetter("k")` and `operator.attrgetter("x")` are named, faster replacements for `lambda o: o["k"]` / `lambda o: o.x`.',
      'Prefer a comprehension over `map`/`filter` + `lambda`. Use `map`/`filter` when you already have a named function (`map(int, row)`, `filter(None, xs)`).',
      'A function that returns a function (a factory) is the shape of every decorator and of `functools.partial`.',
    ],
    keyTakeawaysHi: [
      'Ek function ek value hai: ise assign karo (`f = fn`), ek list/dict mein store karo, ek argument ki tarah pass karo, return karo. Ek nanga naam function hai; `name()` ise call karta hai.',
      'Call-vs-refer bug: ek dispatch dict, `key=` argument, ya callback registration mein, nanga function naam istemal karo — `()` jodna ise turant call karta hai aur result store karta hai.',
      '`lambda args: expression` bilkul EK expression ka ek anonymous function hai — koi statements nahi, koi `return` nahi, koi multiple lines nahi. Ise ek argument ki tarah inline istemal karo.',
      'Kabhi ek lambda ko ek naam assign mat karo (PEP 8). `f = lambda x: ...` `def f(x): return ...` hona chahiye — samaan lambaai, asli `__name__`, behtar tracebacks.',
      '`sorted`/`min`/`max` `key=` lete hain — ek function jo har element ko compare karne ki value se map karta hai. `key=lambda u: (a, b)` kai fields se sort karta hai; `reverse=True` `key=lambda u: -u.x` se behtar hai.',
      '`operator.itemgetter("k")` aur `operator.attrgetter("x")` `lambda o: o["k"]` / `lambda o: o.x` ke named, tez vikalp hain.',
      '`map`/`filter` + `lambda` par ek comprehension prefer karo. `map`/`filter` tab istemal karo jab aapke paas pehle se ek named function hai (`map(int, row)`, `filter(None, xs)`).',
      'Ek function jo ek function lautaata hai (ek factory) har decorator aur `functools.partial` ka aakaar hai.',
    ],
  },

  {
    slug: 'py-decorators-from-scratch',
    title: 'Decorators: @deco Is Just f = deco(f)',
    titleHi: 'Decorators: @deco Bas f = deco(f) Hai',
    description: 'Seeing `@login_required`, `@lru_cache`, `@property`, `@action(detail=True)` all over a Django codebase and treating them as magic keywords, when every one of them is an ordinary function that takes your function and returns a replacement. The `@` line above a `def` is exact shorthand for `name = decorator(name)` right after the `def`.',
    descriptionHi: 'Ek Django codebase mein har jagah `@login_required`, `@lru_cache`, `@property`, `@action(detail=True)` dekhna aur unhe magic keywords ki tarah maanna, jab unmein se har ek ek saamaanya function hai jo aapka function leta hai aur ek replacement lautaata hai. Ek `def` ke upar `@` line bilkul `name = decorator(name)` ke liye shorthand hai jo `def` ke turant baad aati hai.',
    difficulty: 'HARD',
    duration: 26,
    order: 5,

    analogy: {
      en: '**A gift-wrapping station at a shop.** You bring an item to the counter; the station takes it, puts it in a box, wraps the box, ties a bow, and hands back something you use exactly like the original item — but now every time it is opened, there is wrapping around it. A decorator is the wrapping station for a function. You hand it your function; it builds a new function that, when called, does something before and after and in the middle calls your original — then it hands that new function back under the same name. The `@wrap` line written above your `def` is literally the instruction "run this through the wrapping station and keep the result under this name". If the station itself needs a setting — what paper, what ribbon — you first tell the station your choice and it hands you back a wrapping station configured that way, which then wraps your item. That extra layer is a decorator that takes arguments: a function that returns a decorator that returns the wrapped function. Three layers deep, but each layer is just a function returning a function, and the `@` is only ever shorthand for "replace the name with the wrapped version".',
      hi: '**Ek shop par ek gift-wrapping station.** Aap counter par ek item laate ho; station ise leta hai, ek box mein rakhta hai, box ko wrap karta hai, ek bow baandhta hai, aur kuch wapas deta hai jise aap bilkul original item ki tarah istemal karte ho — par ab har baar jab ise khola jaata hai, iske aas-paas wrapping hai. Ek decorator ek function ke liye wrapping station hai. Aap ise apna function dete ho; ye ek naya function banaata hai jo, jab call hota hai, pehle aur baad mein kuch karta hai aur beech mein aapka original call karta hai — phir wo naya function usi naam ke tahat wapas deta hai. Aapke `def` ke upar likhi `@wrap` line sachmuch instruction hai "ise wrapping station se chalao aur nateeja is naam ke tahat rakho". Agar station ko khud ek setting chahiye — kaunsa paper, kaunsa ribbon — aap pehle station ko apni pasand batao aur ye aapko us tarah configured ek wrapping station wapas deta hai. Wo extra layer ek decorator hai jo arguments leta hai: ek function jo ek decorator lautaata hai jo wrapped function lautaata hai.',
    },

    simple: `**The whole idea, no magic:**

\`\`\`python
def announce(func):                 # a decorator: takes a function, returns a function
    def wrapper():
        print("before")
        result = func()             # call the original
        print("after")
        return result
    return wrapper

def greet():
    print("hello")

greet = announce(greet)             # <-- THIS is what @announce does
greet()
# before
# hello
# after
\`\`\`

The \`@\` syntax is exact shorthand:

\`\`\`python
@announce
def greet():
    print("hello")

# is IDENTICAL to:

def greet():
    print("hello")
greet = announce(greet)
\`\`\`

**A useful one — but the wrapper must accept any arguments**

\`\`\`python
import functools, time

def timed(func):
    @functools.wraps(func)               # keep func's name/docstring
    def wrapper(*args, **kwargs):        # accept ANY signature
        start = time.perf_counter()
        result = func(*args, **kwargs)   # forward everything
        elapsed = time.perf_counter() - start
        print(f"{func.__name__}: {elapsed:.6f}s")
        return result
    return wrapper

@timed
def slow_add(a, b):
    time.sleep(0.01)
    return a + b

print(slow_add(2, 3))
\`\`\`

\`\`\`
THE DECORATOR SKELETON -- memorise this:

    import functools

    def my_decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # ... before ...
            result = func(*args, **kwargs)
            # ... after ...
            return result
        return wrapper

@my_decorator          ==   greet = my_decorator(greet)
def greet(): ...

STACKED:
    @a
    @b
    def f(): ...       ==   f = a(b(f))     (bottom-up: b wraps f, then a wraps that)
\`\`\``,

    simpleHi: `**Poora vichaar, koi magic nahi:**

\`\`\`python
def announce(func):                 # ek decorator: ek function leta hai, ek function lautaata hai
    def wrapper():
        print("before")
        result = func()             # original call karo
        print("after")
        return result
    return wrapper

def greet():
    print("hello")

greet = announce(greet)             # <-- YE hai jo @announce karta hai
greet()
# before
# hello
# after
\`\`\`

\`@\` syntax bilkul shorthand hai:

\`\`\`python
@announce
def greet():
    print("hello")

# ISKE SAMAAN hai:

def greet():
    print("hello")
greet = announce(greet)
\`\`\`

**Ek upyogi — par wrapper ko koi bhi arguments accept karne chahiye**

\`\`\`python
import functools, time

def timed(func):
    @functools.wraps(func)               # func ka naam/docstring rakho
    def wrapper(*args, **kwargs):        # KOI bhi signature accept karo
        start = time.perf_counter()
        result = func(*args, **kwargs)   # sab kuch forward karo
        elapsed = time.perf_counter() - start
        print(f"{func.__name__}: {elapsed:.6f}s")
        return result
    return wrapper

@timed
def slow_add(a, b):
    time.sleep(0.01)
    return a + b

print(slow_add(2, 3))
\`\`\`

\`\`\`
DECORATOR SKELETON -- ise yaad karo:

    import functools

    def my_decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # ... before ...
            result = func(*args, **kwargs)
            # ... after ...
            return result
        return wrapper

@my_decorator          ==   greet = my_decorator(greet)
def greet(): ...

STACKED:
    @a
    @b
    def f(): ...       ==   f = a(b(f))     (neeche-se-upar: b f ko wrap karta hai, phir a use)
\`\`\``,

    content: `## Why \`*args, **kwargs\` and \`functools.wraps\` are non-negotiable

\`\`\`python
# WITHOUT *args/**kwargs -- breaks on any function that takes arguments:
def bad(func):
    def wrapper():
        return func()          # TypeError if the real func needs args
    return wrapper

# WITHOUT functools.wraps -- the decorated function loses its identity:
def bad2(func):
    def wrapper(*a, **k):
        return func(*a, **k)
    return wrapper

@bad2
def compute(x):
    "Compute something important."
    return x

compute.__name__     # 'wrapper'      <-- wrong
compute.__doc__      # None           <-- lost
\`\`\`

\`functools.wraps(func)\` copies \`__name__\`, \`__doc__\`, \`__module__\`, \`__qualname__\`, \`__annotations__\`, and sets \`__wrapped__\` so tools can still find the original. Every framework that introspects functions (Django's URL naming, DRF's schema generation, pytest's test discovery, Sphinx) depends on this.

## Decorators that take arguments — one more layer

\`\`\`python
import functools

def retry(times):                       # <-- takes the argument
    def decorator(func):                # <-- the actual decorator
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == times:
                        raise
                    print(f"attempt {attempt} failed: {e}; retrying")
        return wrapper
    return decorator

@retry(times=3)
def flaky():
    ...
\`\`\`

The rule: \`@retry(3)\` is evaluated as \`retry(3)\` first, which must *return a decorator*, which is then applied to \`flaky\`. So a parametrised decorator is a function returning a function returning a function:

\`\`\`
@retry(3)              retry(3)         -> returns 'decorator'
def flaky(): ...       decorator(flaky) -> returns 'wrapper'
                       flaky = wrapper
\`\`\`

## An optional-argument decorator (usable both ways)

\`\`\`python
def logged(func=None, *, level="INFO"):
    if func is None:                          # called as @logged(level="DEBUG")
        return functools.partial(logged, level=level)

    @functools.wraps(func)                    # called as @logged
    def wrapper(*args, **kwargs):
        print(f"[{level}] calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@logged
def a(): ...

@logged(level="DEBUG")
def b(): ...
\`\`\`

## Stacking, and the order

\`\`\`python
@timed
@retry(3)
@logged
def fetch(): ...

# equivalent to:
fetch = timed(retry(3)(logged(fetch)))
\`\`\`

Decorators apply bottom-up (closest to \`def\` first) but *execute* top-down at call time — \`timed\`'s wrapper runs first, calls \`retry\`'s wrapper, which calls \`logged\`'s wrapper, which calls \`fetch\`.

## Class-based decorators and decorating classes

\`\`\`python
# a decorator can be any callable -- a class with __call__ works:
class CountCalls:
    def __init__(self, func):
        functools.update_wrapper(self, func)
        self.func = func
        self.count = 0
    def __call__(self, *args, **kwargs):
        self.count += 1
        return self.func(*args, **kwargs)

@CountCalls
def ping(): ...
ping(); ping()
ping.count      # 2

# and a decorator can take a class instead of a function:
def register(cls):
    REGISTRY[cls.__name__] = cls
    return cls

@register
class Handler: ...
\`\`\``,

    contentHi: `## \`*args, **kwargs\` aur \`functools.wraps\` non-negotiable kyun hain

\`\`\`python
# *args/**kwargs KE BINA -- kisi bhi function par tootta hai jo arguments leta hai:
def bad(func):
    def wrapper():
        return func()          # TypeError agar asli func ko args chahiye
    return wrapper

# functools.wraps KE BINA -- decorated function apni identity khota hai:
def bad2(func):
    def wrapper(*a, **k):
        return func(*a, **k)
    return wrapper

@bad2
def compute(x):
    "Compute something important."
    return x

compute.__name__     # 'wrapper'      <-- galat
compute.__doc__      # None           <-- khoya
\`\`\`

\`functools.wraps(func)\` \`__name__\`, \`__doc__\`, \`__module__\`, \`__qualname__\`, \`__annotations__\` copy karta hai, aur \`__wrapped__\` set karta hai taaki tools abhi bhi original dhoondh sakein. Har framework jo functions ko introspect karta hai (Django ka URL naming, DRF ka schema generation, pytest ka test discovery, Sphinx) ispar nirbhar karta hai.

## Arguments lene waale decorators — ek aur layer

\`\`\`python
import functools

def retry(times):                       # <-- argument leta hai
    def decorator(func):                # <-- asal decorator
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == times:
                        raise
                    print(f"attempt {attempt} failed: {e}; retrying")
        return wrapper
    return decorator

@retry(times=3)
def flaky():
    ...
\`\`\`

Niyam: \`@retry(3)\` pehle \`retry(3)\` ki tarah evaluate hota hai, jise *ek decorator return karna* chahiye, jo phir \`flaky\` par lagaaya jaata hai. Toh ek parametrised decorator ek function hai jo ek function lautaata hai jo ek function lautaata hai:

\`\`\`
@retry(3)              retry(3)         -> 'decorator' lautaata hai
def flaky(): ...       decorator(flaky) -> 'wrapper' lautaata hai
                       flaky = wrapper
\`\`\`

## Ek optional-argument decorator (dono tarah istemal ho sakta)

\`\`\`python
def logged(func=None, *, level="INFO"):
    if func is None:                          # @logged(level="DEBUG") ki tarah call
        return functools.partial(logged, level=level)

    @functools.wraps(func)                    # @logged ki tarah call
    def wrapper(*args, **kwargs):
        print(f"[{level}] calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@logged
def a(): ...

@logged(level="DEBUG")
def b(): ...
\`\`\`

## Stacking, aur order

\`\`\`python
@timed
@retry(3)
@logged
def fetch(): ...

# iske samaan:
fetch = timed(retry(3)(logged(fetch)))
\`\`\`

Decorators neeche-se-upar lagte hain (\`def\` ke sabse kareeb pehle) par call time par upar-se-neeche *execute* hote hain — \`timed\` ka wrapper pehle chalta hai, \`retry\` ka wrapper call karta hai, jo \`logged\` ka wrapper call karta hai, jo \`fetch\` call karta hai.

## Class-based decorators aur classes ko decorate karna

\`\`\`python
# ek decorator koi bhi callable ho sakta hai -- ek class __call__ ke saath kaam karti hai:
class CountCalls:
    def __init__(self, func):
        functools.update_wrapper(self, func)
        self.func = func
        self.count = 0
    def __call__(self, *args, **kwargs):
        self.count += 1
        return self.func(*args, **kwargs)

@CountCalls
def ping(): ...
ping(); ping()
ping.count      # 2

# aur ek decorator ek function ke bajaye ek class le sakta hai:
def register(cls):
    REGISTRY[cls.__name__] = cls
    return cls

@register
class Handler: ...
\`\`\``,

    examples: [
      {
        title: 'Proving @deco is f = deco(f)',
        titleHi: 'Saabit karna @deco f = deco(f) hai',
        code: `def loud(func):
    def wrapper(*args, **kwargs):
        print(f"--> {func.__name__}{args}")
        r = func(*args, **kwargs)
        print(f"<-- {r}")
        return r
    return wrapper

# manual form:
def add(a, b):
    return a + b
add = loud(add)
add(2, 3)

print("---")

# @ form -- identical:
@loud
def mul(a, b):
    return a * b
mul(4, 5)

print("---")
print(type(add), type(mul))
print(add.__name__)   # 'wrapper' -- no functools.wraps here`,
        output: `--> add(2, 3)
<-- 5
---
--> mul(4, 5)
<-- 20
---
<class 'function'> <class 'function'>
wrapper`,
        explain: 'The manual `add = loud(add)` and the `@loud` on `mul` produce the same thing: the name now points at `wrapper`, which prints, calls the original, prints, and returns the result. `add.__name__` is `"wrapper"` because this example deliberately omits `functools.wraps` — the next example adds it.',
        explainHi: 'Manual `add = loud(add)` aur `mul` par `@loud` wahi cheez banaate hain: naam ab `wrapper` par point karta hai, jo print karta hai, original call karta hai, print karta hai, aur result return karta hai. `add.__name__` `"wrapper"` hai kyunki ye example jaan-boojhkar `functools.wraps` chhodta hai.',
      },
      {
        title: 'A caching decorator with functools.wraps',
        titleHi: 'functools.wraps ke saath ek caching decorator',
        code: `import functools

def memoize(func):
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return wrapper.calls_missed  # placeholder line replaced below
    return wrapper

# cleaner version:
def memoize(func):
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    wrapper.cache = cache
    return wrapper

@memoize
def fib(n):
    "nth Fibonacci number"
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(30))
print(len(fib.cache), "entries cached")
print(fib.__name__, "-", fib.__doc__)`,
        output: `832040
31 entries cached
fib - nth Fibonacci number`,
        explain: '`cache` lives in the closure, one dict per decorated function. `fib(30)` without memoization makes ~2.7M calls; with it, 31. `@functools.wraps(func)` keeps `fib.__name__` and `fib.__doc__` intact. Attaching `wrapper.cache = cache` exposes the cache for inspection — a common touch. (The real tool is `@functools.lru_cache`, next lesson.)',
        explainHi: '`cache` closure mein rehta hai, prati decorated function ek dict. Bina memoization `fib(30)` ~2.7M calls karta hai; iske saath, 31. `@functools.wraps(func)` `fib.__name__` aur `fib.__doc__` bachaaye rakhta hai. `wrapper.cache = cache` attach karna cache ko inspection ke liye expose karta hai.',
      },
      {
        title: 'A parametrised decorator and stacking',
        titleHi: 'Ek parametrised decorator aur stacking',
        code: `import functools

def repeat(n):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(n):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

def trace(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"  call {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@repeat(3)
@trace
def hello(name):
    print(f"  hi {name}")
    return name

print("calling hello('Sam'):")
out = hello("Sam")
print("returned:", out)

# what the stack means:
print("hello is:", hello.__name__)`,
        output: `calling hello('Sam'):
  call hello
  hi Sam
  call hello
  hi Sam
  call hello
  hi Sam
returned: Sam
hello is: hello`,
        explain: '`@repeat(3)` evaluates `repeat(3)` -> `decorator`, then `decorator(traced_hello)` -> `wrapper`. The stack is `hello = repeat(3)(trace(hello))`: `trace` wraps `hello` first (innermost), then `repeat(3)` wraps that. At call time `repeat`\'s loop runs the traced hello three times. `functools.wraps` on both keeps `hello.__name__` correct.',
        explainHi: '`@repeat(3)` `repeat(3)` -> `decorator` evaluate karta hai, phir `decorator(traced_hello)` -> `wrapper`. Stack `hello = repeat(3)(trace(hello))` hai: `trace` pehle `hello` ko wrap karta hai (innermost), phir `repeat(3)` use wrap karta hai. Call time par `repeat` ka loop traced hello ko teen baar chalata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `def timed(func):
    def wrapper():                    # no *args/**kwargs
        return func()
    return wrapper

@timed
def process(data, verbose=False):     # takes arguments -> breaks
    ...`,
        right: `def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper`,
        why: 'A wrapper with a fixed signature only works for functions with that exact signature. A general-purpose decorator must use `def wrapper(*args, **kwargs)` and forward with `func(*args, **kwargs)` so it works on any function, including methods (where `self` is the first positional arg).',
        whyHi: 'Ek fixed signature waala wrapper sirf us exact signature waale functions ke liye kaam karta hai. Ek general-purpose decorator ko `def wrapper(*args, **kwargs)` istemal karna hoga aur `func(*args, **kwargs)` se forward karna hoga taaki ye kisi bhi function par kaam kare, methods sameth.',
      },
      {
        wrong: `def cache(func):
    def wrapper(*args, **kwargs):
        ...
    return wrapper                    # no @functools.wraps(func)`,
        right: `def cache(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        ...
    return wrapper`,
        why: 'Without `@functools.wraps(func)`, the decorated function reports `__name__ == "wrapper"`, has no docstring, and its signature is `(*args, **kwargs)`. Django URL names, DRF OpenAPI schemas, pytest discovery, `help()`, and Sphinx docs all read this metadata and break or produce garbage.',
        whyHi: '`@functools.wraps(func)` ke bina, decorated function `__name__ == "wrapper"` bataata hai, koi docstring nahi, aur iska signature `(*args, **kwargs)` hai. Django URL names, DRF OpenAPI schemas, pytest discovery, `help()`, aur Sphinx docs sab ye metadata padhte hain aur tootte hain.',
      },
      {
        wrong: `@retry              # forgot the parentheses on a parametrised decorator
def flaky():
    ...
# TypeError later: 'function' object is not callable, or flaky becomes the inner decorator`,
        right: `@retry()            # or @retry(3) -- a parametrised decorator MUST be called
def flaky():
    ...`,
        why: 'If `retry` is written to take arguments (it returns a decorator), then `@retry` passes `flaky` as the `times` argument and `flaky` becomes whatever `retry` returns — usually the inner `decorator` function, not a usable `flaky`. A parametrised decorator always needs `@retry(...)` with the call parentheses, even if empty.',
        whyHi: 'Agar `retry` arguments lene ko likha hai (ye ek decorator lautaata hai), toh `@retry` `flaky` ko `times` argument ki tarah pass karta hai aur `flaky` jo bhi `retry` lautaata hai wo ban jaata hai. Ek parametrised decorator ko hamesha `@retry(...)` chahiye call parentheses ke saath, chahe khaali ho.',
      },
    ],

    realWorld: [
      {
        en: '**Django and DRF are built on decorators** — `@login_required`, `@permission_classes([IsAuthenticated])`, `@api_view(["GET", "POST"])`, `@action(detail=True, methods=["post"])`, `@cache_page(60 * 15)`, `@transaction.atomic`, `@receiver(post_save, sender=User)`. Every one is `view = decorator(view)`.',
        hi: '**Django aur DRF decorators par bane hain** — `@login_required`, `@permission_classes([IsAuthenticated])`, `@api_view(["GET", "POST"])`, `@action(detail=True, methods=["post"])`, `@cache_page(60 * 15)`, `@transaction.atomic`, `@receiver(post_save, sender=User)`. Har ek `view = decorator(view)` hai.',
      },
      {
        en: '**`@functools.lru_cache` / `@functools.cache`** is the memoize pattern from this lesson, production-grade — used on expensive pure functions like config parsing, permission lookups, or template compilation. `@functools.wraps` is what keeps the cached function introspectable.',
        hi: '**`@functools.lru_cache` / `@functools.cache`** is lesson ka memoize pattern hai, production-grade — mehnge pure functions par istemal jaise config parsing, permission lookups. `@functools.wraps` wahi hai jo cached function ko introspectable rakhta hai.',
      },
      {
        en: '**`@property`, `@classmethod`, `@staticmethod`** (next module) are decorators you use daily on model and serializer classes — `@property def full_name(self): return f"{self.first} {self.last}"` turns a method into an attribute-style access.',
        hi: '**`@property`, `@classmethod`, `@staticmethod`** (agla module) decorators hain jo aap model aur serializer classes par roz istemal karte ho — `@property def full_name(self): ...` ek method ko ek attribute-style access mein badalta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain what a decorator is and what `@my_decorator` above a function definition actually does.',
        qHi: 'Ek decorator kya hai aur ek function definition ke upar `@my_decorator` asal mein kya karta hai, samjhaao.',
        a: 'A decorator is just a function — or more generally any callable — that takes a function as its argument and returns a function to be used in its place. There is no special decorator type; it is a plain function that happens to be used in a particular way. The at-sign syntax written on the line above a def is pure shorthand. Writing at-my-decorator above def greet is exactly equivalent to defining greet normally and then, immediately after, reassigning greet to the result of calling my_decorator with greet. So after the definition runs, the name greet no longer refers to the function you wrote; it refers to whatever my_decorator returned, and every call through that name goes through the returned object. The standard pattern is that my_decorator defines an inner function, conventionally called wrapper, that takes star-args and double-star-kwargs so it can accept any arguments, does whatever extra work is wanted before and after — timing, logging, caching, access checks, retries — calls the original function with those same star-args and double-star-kwargs somewhere in the middle, and returns its result. my_decorator returns this wrapper. The inner wrapper is a closure over the original func, which is how it still has a reference to call it. Two details matter for correctness. The wrapper must take star-args and double-star-kwargs and forward them, otherwise the decorator only works on functions with one particular signature. And the wrapper should be decorated with functools dot wraps of func, which copies the original\'s name, docstring, module, and annotations onto the wrapper, so that introspection, documentation tools, and frameworks that dispatch on function metadata continue to see the original function rather than a thing called wrapper with no docstring.',
        aHi: 'Ek decorator bas ek function hai — ya aam taur par koi bhi callable — jo ek function ko apne argument ki tarah leta hai aur iski jagah istemal hone ke liye ek function lautaata hai. Koi special decorator type nahi hai; ye ek plain function hai jo ek khaas tarike se istemal hota hai. Ek def ke upar ki line par likha at-sign syntax shuddh shorthand hai. def greet ke upar at-my-decorator likhna bilkul greet ko saamaanya roop se define karne aur phir, turant baad, greet ko my_decorator ko greet ke saath call karne ke nateeje se reassign karne ke samaan hai. Toh definition chalne ke baad, naam greet ab aapke likhe function ko refer nahi karta; ye jo bhi my_decorator ne lautaaya use refer karta hai. Standard pattern ye hai ki my_decorator ek inner function define karta hai, convention se wrapper, jo star-args aur double-star-kwargs leta hai, before aur after jo bhi extra kaam chahiye karta hai, beech mein original function ko un hi args se call karta hai, aur iska result lautaata hai. Do vivaran maayne rakhte hain: wrapper ko star-args aur double-star-kwargs lene aur forward karne chahiye; aur wrapper ko functools dot wraps of func se decorate karna chahiye.',
      },
      {
        q: 'How does a decorator that takes arguments, like `@retry(times=3)`, work? Why is there an extra layer?',
        qHi: '`@retry(times=3)` jaisa ek decorator jo arguments leta hai kaise kaam karta hai? ek extra layer kyun hai?',
        a: 'The extra layer exists because of how the at-sign syntax evaluates. When you write at-retry followed by an argument list, and then a def, Python first evaluates the expression after the at-sign — that is, it actually calls retry with those arguments — and whatever that call returns is then used as the decorator and applied to the function below. So retry of times equals three is called first, at definition time, and its return value must itself be a decorator: a function that takes the target function and returns a replacement. That means a decorator that takes arguments is a function that returns a function that returns a function. The outermost function, retry, takes the configuration arguments like times, and returns the middle function, conventionally called decorator, which takes func. decorator returns the innermost function, wrapper, which takes star-args and double-star-kwargs, does the retry loop calling func until it succeeds or the attempts run out, and returns the result. Each layer closes over the names it needs: wrapper can see both func from decorator and times from retry. Contrast this with a no-argument decorator, where at-retry with no parentheses would pass the function directly to retry. The practical consequence is that a parametrised decorator must always be called, with parentheses, even when you want the defaults — at-retry with empty parentheses, not bare at-retry. Writing bare at-retry on a decorator that expects arguments passes your function as the first config argument and binds your function\'s name to the middle decorator function, which then breaks in a confusing way at the next call. If you want a decorator that works both with and without arguments, you write it to detect whether its first parameter is a function or not, and in the no-function case return a partial of itself with the options bound.',
        aHi: 'Extra layer at-sign syntax ke evaluate hone ke tareeke ki wajah se hai. Jab aap at-retry ek argument list ke saath likhte ho, aur phir ek def, Python pehle at-sign ke baad ki expression evaluate karta hai — yaani, ye asal mein retry ko un arguments se call karta hai — aur jo bhi wo call lautaata hai wo phir decorator ki tarah istemal hota hai aur neeche function par lagaaya jaata hai. Toh retry of times equals three pehle call hota hai, definition time par, aur iski return value khud ek decorator honi chahiye. Iska matlab arguments lene waala ek decorator ek function hai jo ek function lautaata hai jo ek function lautaata hai. Sabse bahari function, retry, config arguments jaise times leta hai, aur beech ka function lautaata hai, convention se decorator, jo func leta hai. decorator sabse andar ka function lautaata hai, wrapper. Vyavhaarik nateeja ye hai ki ek parametrised decorator ko hamesha call karna chahiye, parentheses ke saath, tab bhi jab aap defaults chahte ho — at-retry khaali parentheses ke saath, nanga at-retry nahi.',
      },
    ],

    exercises: [
      {
        task: 'Write `debug(func)` from scratch: it prints `f"CALL {func.__name__}({signature})"` where signature is the args and kwargs formatted, calls `func`, prints `f"RET  {func.__name__} -> {result!r}"`, returns the result. Use `@functools.wraps`. Verify `__name__` survives and test on `def div(a, b): return a / b`.',
        taskHi: '`debug(func)` shuru se likho: ye `f"CALL {func.__name__}({signature})"` print karta hai, `func` call karta hai, `f"RET  {func.__name__} -> {result!r}"` print karta hai, result return karta hai. `@functools.wraps` istemal karo. Verify karo `__name__` bacha hai aur `def div(a, b): return a / b` par test karo.',
        hint: 'signature: `", ".join([repr(a) for a in args] + [f"{k}={v!r}" for k, v in kwargs.items()])`. The wrapper is the standard `def wrapper(*args, **kwargs):` skeleton with two prints around `func(*args, **kwargs)`.',
        hintHi: 'signature: `", ".join([repr(a) for a in args] + [f"{k}={v!r}" for k, v in kwargs.items()])`. Wrapper standard `def wrapper(*args, **kwargs):` skeleton hai `func(*args, **kwargs)` ke aas-paas do prints ke saath.',
      },
      {
        task: 'Write a parametrised decorator `default_on_error(fallback)` that returns `fallback` if the wrapped function raises any exception, otherwise its result. Test: `@default_on_error(0) def parse(s): return int(s)` — `parse("42")` -> `42`, `parse("nope")` -> `0`.',
        taskHi: 'Ek parametrised decorator `default_on_error(fallback)` likho jo `fallback` lautaata hai agar wrapped function koi exception deta hai, warna iska result. Test: `@default_on_error(0) def parse(s): return int(s)` — `parse("42")` -> `42`, `parse("nope")` -> `0`.',
        hint: 'Three layers: `def default_on_error(fallback): def decorator(func): @functools.wraps(func) def wrapper(*a, **k): try: return func(*a, **k) except Exception: return fallback; return wrapper; return decorator`.',
        hintHi: 'Teen layers: `def default_on_error(fallback): def decorator(func): @functools.wraps(func) def wrapper(*a, **k): try: return func(*a, **k) except Exception: return fallback; return wrapper; return decorator`.',
      },
      {
        task: 'Write `call_count(func)` that adds a `.calls` attribute to the wrapped function, incremented on every call, starting at 0. Stack it with `debug` from exercise 1 on one function and confirm both work: the count increments and the debug lines print. Explain the stacking order you chose.',
        taskHi: '`call_count(func)` likho jo wrapped function mein ek `.calls` attribute jodta hai, har call par badhaaya, 0 se shuru. Ise exercise 1 ke `debug` ke saath ek function par stack karo aur confirm karo dono kaam karte hain. Jo stacking order aapne chuna use samjhaao.',
        hint: '`def call_count(func): @functools.wraps(func) def wrapper(*a, **k): wrapper.calls += 1; return func(*a, **k); wrapper.calls = 0; return wrapper`. Put `@call_count` outermost (top) so it counts every call including retried/debugged ones; `@debug` closest to `def`.',
        hintHi: '`def call_count(func): @functools.wraps(func) def wrapper(*a, **k): wrapper.calls += 1; return func(*a, **k); wrapper.calls = 0; return wrapper`. `@call_count` sabse bahar (upar) rakho taaki ye har call gine; `@debug` `def` ke sabse kareeb.',
      },
    ],

    keyTakeaways: [
      '`@deco` above `def f` is EXACT shorthand for `f = deco(f)` immediately after the def. A decorator is an ordinary function that takes a function and returns a function.',
      'The skeleton: `def deco(func): @functools.wraps(func) \\n def wrapper(*args, **kwargs): ...; result = func(*args, **kwargs); ...; return result \\n return wrapper`.',
      'The wrapper MUST take `*args, **kwargs` and forward them — otherwise the decorator only works on one specific signature.',
      'ALWAYS use `@functools.wraps(func)` on the wrapper. Without it the decorated function loses its `__name__`, `__doc__`, and signature, breaking introspection, docs, and frameworks.',
      'A decorator that takes arguments is a function returning a decorator returning a wrapper — three layers. `@retry(3)` = `retry(3)` returns a decorator, then that is applied to the function.',
      'A parametrised decorator MUST be called with `()` — `@retry(3)` or `@retry()`, never bare `@retry`.',
      'Stacking: `@a` over `@b` over `def f` means `f = a(b(f))` — applied bottom-up, executed top-down.',
      'A decorator can be any callable (a class with `__call__`), and it can decorate a class instead of a function (e.g. registration decorators).',
    ],
    keyTakeawaysHi: [
      '`@deco` `def f` ke upar `f = deco(f)` ke liye BILKUL shorthand hai jo def ke turant baad. Ek decorator ek saamaanya function hai jo ek function leta hai aur ek function lautaata hai.',
      'Skeleton: `def deco(func): @functools.wraps(func) \\n def wrapper(*args, **kwargs): ...; result = func(*args, **kwargs); ...; return result \\n return wrapper`.',
      'Wrapper ko `*args, **kwargs` lene aur forward karne CHAHIYE — warna decorator sirf ek specific signature par kaam karta hai.',
      'HAMESHA wrapper par `@functools.wraps(func)` istemal karo. Iske bina decorated function apna `__name__`, `__doc__`, aur signature khota hai, introspection, docs, aur frameworks todta hai.',
      'Arguments lene waala ek decorator ek function hai jo ek decorator lautaata hai jo ek wrapper lautaata hai — teen layers. `@retry(3)` = `retry(3)` ek decorator lautaata hai, phir wo function par lagta hai.',
      'Ek parametrised decorator ko `()` ke saath call karna CHAHIYE — `@retry(3)` ya `@retry()`, kabhi nanga `@retry` nahi.',
      'Stacking: `@a` `@b` ke upar `def f` ke upar matlab `f = a(b(f))` — neeche-se-upar lagta, upar-se-neeche execute.',
      'Ek decorator koi bhi callable ho sakta hai (`__call__` waali ek class), aur ye ek function ke bajaye ek class ko decorate kar sakta hai.',
    ],
  },

  {
    slug: 'py-practical-decorator-patterns',
    title: 'Practical Decorator Patterns and When Not to Use One',
    titleHi: 'Vyavhaarik Decorator Patterns Aur Kab Istemal Na Karein',
    description: 'Having learned how decorators work, reaching for one everywhere — wrapping every function in timing, logging, validation layers — until a stack trace is ten frames of `wrapper` deep and nobody can tell what the code does. This lesson covers the decorators you will actually use (`lru_cache`, `property`, `classmethod`, `staticmethod`, a retry, a timer) and the cases where a plain function call, a context manager, or middleware is the better tool.',
    descriptionHi: 'Decorators kaise kaam karte hain seekhne ke baad, har jagah ek ke liye pahunchna — har function ko timing, logging, validation layers mein wrap karna — jab tak ek stack trace `wrapper` ke das frames gehra na ho aur koi na bata sake code kya karta hai. Ye lesson un decorators ko cover karta hai jo aap asal mein istemal karoge (`lru_cache`, `property`, `classmethod`, `staticmethod`, ek retry, ek timer) aur wo cases jahaan ek plain function call, ek context manager, ya middleware behtar tool hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**Power tools versus a Swiss Army knife.** A decorator is a power tool: when the job is exactly what the tool does — the same repetitive attachment applied to many functions in the same way — it is fast, clean, and obviously correct. `@lru_cache` on a pure function, `@property` to expose a computed value, `@login_required` on a view: these are jobs the tool was built for, and reaching for anything else would be silly. But a power tool is a bad choice for a one-off cut, for a job that needs to be adjusted each time, or for work that happens around a block of code rather than around a whole function. If a piece of behaviour only wraps one function once, an inline call is clearer. If it needs to happen around a `with` block or a section of a function, that is a context manager. If it applies to every request regardless of which function handles it, that is middleware. The skill is not writing decorators; it is recognising the shape of the problem — "same wrapping, many functions, whole-function scope" — and only then reaching for the tool.',
      hi: '**Power tools versus ek Swiss Army knife.** Ek decorator ek power tool hai: jab kaam bilkul wahi hai jo tool karta hai — wahi repetitive attachment kai functions par usi tarah lagaaya — ye tez, saaf, aur spasht roop se sahi hai. Ek pure function par `@lru_cache`, ek computed value expose karne ko `@property`, ek view par `@login_required`: ye kaam hain jinke liye tool banaya gaya. Par ek power tool ek one-off cut ke liye, ek aise kaam ke liye jise har baar adjust karna hai, ya ek block of code ke aas-paas hone waale kaam ke liye ek bura chunaav hai. Agar ek behaviour ka tukda sirf ek function ko ek baar wrap karta hai, ek inline call saaf hai. Agar ise ek `with` block ke aas-paas hona hai, wo ek context manager hai. Agar ye har request par lagta hai chahe kaunsa function handle kare, wo middleware hai. Kaushal decorators likhna nahi hai; ye samasya ka aakaar pehchaanna hai.',
    },

    simple: `**The decorators you will actually use, day to day:**

\`\`\`python
import functools, time

# 1. CACHING a pure function -- the real memoize
@functools.lru_cache(maxsize=None)      # or @functools.cache (3.9+)
def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)

factorial(20)
factorial.cache_info()                  # CacheInfo(hits=..., misses=..., ...)
factorial.cache_clear()

# 2. @property -- a method that reads like an attribute
class Circle:
    def __init__(self, r):
        self.r = r
    @property
    def area(self):
        return 3.14159 * self.r ** 2

c = Circle(10)
c.area                                  # 314.159   -- no parentheses

# 3. @staticmethod / @classmethod -- methods that don't need 'self'
class User:
    count = 0
    def __init__(self):
        User.count += 1
    @classmethod
    def total(cls):
        return cls.count
    @staticmethod
    def is_valid_email(s):
        return "@" in s
\`\`\`

**A retry and a timer you can drop into any project:**

\`\`\`python
def retry(times=3, delay=0.0, exceptions=(Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions:
                    if attempt == times:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            print(f"{func.__name__}: {time.perf_counter() - t0:.4f}s")
    return wrapper
\`\`\`

\`\`\`
USE A DECORATOR when:
    - the same wrapping applies to MANY functions
    - it wraps the WHOLE function call
    - the behaviour is orthogonal (logging, caching, auth, retry, timing)

DON'T use a decorator when:
    - it wraps ONE function ONCE          -> just call it inline
    - it wraps a BLOCK, not a function    -> context manager (with ...)
    - it applies to EVERY request         -> middleware
    - it needs heavy per-call config      -> pass an argument
    - stacking would exceed ~2-3 deep     -> rethink; tracebacks become unreadable
\`\`\``,

    simpleHi: `**Wo decorators jo aap asal mein istemal karoge, roz:**

\`\`\`python
import functools, time

# 1. Ek pure function CACHE karna -- asli memoize
@functools.lru_cache(maxsize=None)      # ya @functools.cache (3.9+)
def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)

factorial(20)
factorial.cache_info()                  # CacheInfo(hits=..., misses=..., ...)
factorial.cache_clear()

# 2. @property -- ek method jo ek attribute ki tarah padhta hai
class Circle:
    def __init__(self, r):
        self.r = r
    @property
    def area(self):
        return 3.14159 * self.r ** 2

c = Circle(10)
c.area                                  # 314.159   -- koi parentheses nahi

# 3. @staticmethod / @classmethod -- methods jinhe 'self' nahi chahiye
class User:
    count = 0
    def __init__(self):
        User.count += 1
    @classmethod
    def total(cls):
        return cls.count
    @staticmethod
    def is_valid_email(s):
        return "@" in s
\`\`\`

**Ek retry aur ek timer jo aap kisi bhi project mein daal sakte ho:**

\`\`\`python
def retry(times=3, delay=0.0, exceptions=(Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions:
                    if attempt == times:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            print(f"{func.__name__}: {time.perf_counter() - t0:.4f}s")
    return wrapper
\`\`\`

\`\`\`
DECORATOR ISTEMAL KARO jab:
    - wahi wrapping KAI functions par lagti hai
    - ye POORE function call ko wrap karta hai
    - behaviour orthogonal hai (logging, caching, auth, retry, timing)

DECORATOR ISTEMAL MAT KARO jab:
    - ye EK function ko EK baar wrap karta hai       -> bas ise inline call karo
    - ye ek BLOCK ko wrap karta hai, ek function nahi -> context manager (with ...)
    - ye HAR request par lagta hai                    -> middleware
    - ise heavy per-call config chahiye               -> ek argument pass karo
    - stacking ~2-3 gehra se zyaada ho jaaye           -> phir socho; tracebacks unreadable
\`\`\``,

    content: `## \`lru_cache\` — the details that matter

\`\`\`python
@functools.lru_cache(maxsize=128)       # keeps the 128 most-recent distinct calls
def fetch_config(env):
    ...

@functools.cache                        # unbounded; == lru_cache(maxsize=None)
def parse_schema(path):
    ...
\`\`\`

- **Arguments must be hashable** — \`lru_cache\` keys on the args. A list or dict arg raises \`TypeError\`. Pass a tuple, or a frozenset.
- **Only for pure functions** — if \`fetch_config("prod")\` can return different things over time, caching it is a bug.
- **The cache is process-global and lives forever** (or until \`maxsize\` evicts). On a method, it keeps every \`self\` alive — a memory leak. Use \`@functools.cached_property\` for per-instance caching instead.
- **Introspect it**: \`.cache_info()\`, \`.cache_clear()\`.

## \`@property\` and friends

\`\`\`python
class Account:
    def __init__(self, cents):
        self._cents = cents

    @property
    def dollars(self):                  # read: account.dollars
        return self._cents / 100

    @dollars.setter
    def dollars(self, value):           # write: account.dollars = 5
        self._cents = round(value * 100)

    @dollars.deleter
    def dollars(self):                  # del account.dollars
        self._cents = 0
\`\`\`

\`@property\` turns a method into a computed attribute — use it when a value is derived and cheap. If it is expensive and stable, \`@functools.cached_property\` computes once per instance and stores the result on the instance.

\`\`\`python
class Dataset:
    @functools.cached_property
    def stats(self):                    # runs once, then it's a plain attribute
        return expensive_analysis(self.rows)
\`\`\`

## \`@classmethod\` vs \`@staticmethod\`

\`\`\`python
class Date:
    def __init__(self, y, m, d): ...

    @classmethod
    def today(cls):                     # gets the class -> works with subclasses
        t = time.localtime()
        return cls(t.tm_year, t.tm_mon, t.tm_mday)

    @staticmethod
    def is_leap(year):                  # gets nothing -> just a namespaced function
        return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
\`\`\`

\`classmethod\` receives the class as \`cls\` — use it for alternative constructors and anything that should respect subclassing. \`staticmethod\` receives nothing — it is a plain function that lives in the class namespace for organisation.

## When a decorator is the wrong tool

\`\`\`python
# WRONG: a decorator wrapping one function, once, with call-site-specific logic
@with_timeout(30)
def run_this_one_report(): ...
# -> just write the timeout at the call site; the decorator hides it

# RIGHT: the thing wraps a BLOCK -> context manager
with timeout(30):
    run_report()
    save_results()

# WRONG: a decorator on every view for something request-wide
@add_cors_headers
@log_request
@attach_request_id
def my_view(request): ...
# -> that is middleware; put it in the framework's middleware chain once

# WRONG: "configurable" decorator that's really just branching logic
@process(mode="strict", validate=True, transform=False, retries=0)
def handle(x): ...
# -> the config outweighs the function; pass it as arguments or use a class
\`\`\`

## The traceback cost

Every decorator adds a \`wrapper\` frame to every traceback through that function. Two or three is fine. A stack of six turns a \`KeyError\` on line 40 into forty lines of \`in wrapper / return func(*args, **kwargs)\` before you reach real code. Keep stacks shallow, and always \`@functools.wraps\` so at least the names are right.`,

    contentHi: `## \`lru_cache\` — jo details maayne rakhte hain

\`\`\`python
@functools.lru_cache(maxsize=128)       # 128 sabse recent distinct calls rakhta hai
def fetch_config(env):
    ...

@functools.cache                        # unbounded; == lru_cache(maxsize=None)
def parse_schema(path):
    ...
\`\`\`

- **Arguments hashable hone chahiye** — \`lru_cache\` args par key karta hai. Ek list ya dict arg \`TypeError\` deta hai. Ek tuple, ya ek frozenset pass karo.
- **Sirf pure functions ke liye** — agar \`fetch_config("prod")\` samay ke saath alag cheezein laut sakta hai, ise cache karna ek bug hai.
- **Cache process-global hai aur hamesha rehta hai** (ya jab tak \`maxsize\` evict na kare). Ek method par, ye har \`self\` ko zinda rakhta hai — ek memory leak. Iske bajaye per-instance caching ke liye \`@functools.cached_property\` istemal karo.
- **Ise introspect karo**: \`.cache_info()\`, \`.cache_clear()\`.

## \`@property\` aur dost

\`\`\`python
class Account:
    def __init__(self, cents):
        self._cents = cents

    @property
    def dollars(self):                  # read: account.dollars
        return self._cents / 100

    @dollars.setter
    def dollars(self, value):           # write: account.dollars = 5
        self._cents = round(value * 100)

    @dollars.deleter
    def dollars(self):                  # del account.dollars
        self._cents = 0
\`\`\`

\`@property\` ek method ko ek computed attribute mein badalta hai — ise tab istemal karo jab ek value derived aur sasti hai. Agar ye mehngi aur stable hai, \`@functools.cached_property\` prati instance ek baar compute karta hai aur result instance par store karta hai.

\`\`\`python
class Dataset:
    @functools.cached_property
    def stats(self):                    # ek baar chalta hai, phir ye ek plain attribute hai
        return expensive_analysis(self.rows)
\`\`\`

## \`@classmethod\` vs \`@staticmethod\`

\`\`\`python
class Date:
    def __init__(self, y, m, d): ...

    @classmethod
    def today(cls):                     # class paata hai -> subclasses ke saath kaam karta hai
        t = time.localtime()
        return cls(t.tm_year, t.tm_mon, t.tm_mday)

    @staticmethod
    def is_leap(year):                  # kuch nahi paata -> bas ek namespaced function
        return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
\`\`\`

\`classmethod\` class ko \`cls\` ki tarah paata hai — ise alternative constructors aur kisi bhi cheez ke liye istemal karo jo subclassing ka sammaan kare. \`staticmethod\` kuch nahi paata — ye ek plain function hai jo sangathan ke liye class namespace mein rehta hai.

## Jab ek decorator galat tool hai

\`\`\`python
# GALAT: ek decorator ek function ko, ek baar, call-site-specific logic ke saath wrap karta
@with_timeout(30)
def run_this_one_report(): ...
# -> bas call site par timeout likho; decorator ise chhupaata hai

# SAHI: cheez ek BLOCK ko wrap karti hai -> context manager
with timeout(30):
    run_report()
    save_results()

# GALAT: har view par kuch request-wide ke liye ek decorator
@add_cors_headers
@log_request
@attach_request_id
def my_view(request): ...
# -> wo middleware hai; ise framework ki middleware chain mein ek baar rakho

# GALAT: "configurable" decorator jo asal mein bas branching logic hai
@process(mode="strict", validate=True, transform=False, retries=0)
def handle(x): ...
# -> config function se zyaada hai; ise arguments ki tarah pass karo ya ek class istemal karo
\`\`\`

## Traceback ki keemat

Har decorator us function ke har traceback mein ek \`wrapper\` frame jodta hai. Do ya teen theek hai. Chhah ka ek stack line 40 par ek \`KeyError\` ko \`in wrapper / return func(*args, **kwargs)\` ki chaalees lines mein badal deta hai isse pehle ki aap asli code tak pahuncho. Stacks shallow rakho, aur hamesha \`@functools.wraps\` taaki kam se kam naam sahi hon.`,

    examples: [
      {
        title: 'lru_cache: hits, misses, and the hashable-args rule',
        titleHi: 'lru_cache: hits, misses, aur hashable-args niyam',
        code: `import functools

calls = 0

@functools.lru_cache(maxsize=None)
def slow_square(n):
    global calls
    calls += 1
    return n * n

print(slow_square(4))
print(slow_square(4))
print(slow_square(5))
print(slow_square(4))
print("actual computations:", calls)
print(slow_square.cache_info())

# unhashable argument -> TypeError
@functools.lru_cache
def total(items):
    return sum(items)

try:
    total([1, 2, 3])
except TypeError as e:
    print("error:", "unhashable" in str(e))

print(total((1, 2, 3)))   # a tuple IS hashable`,
        output: `16
16
25
16
actual computations: 2
CacheInfo(hits=2, misses=2, maxsize=None, currsize=2)
error: True
25`,
        explain: '`slow_square` runs its body only twice — for `4` and `5`; the other two calls are cache hits, shown in `cache_info()` as `hits=2, misses=2`. `total([1,2,3])` raises `TypeError` because a list is unhashable and `lru_cache` needs to hash the arguments to key the cache; the tuple `(1,2,3)` works.',
        explainHi: '`slow_square` apna body sirf do baar chalata hai — `4` aur `5` ke liye; doosri do calls cache hits hain, `cache_info()` mein `hits=2, misses=2` dikhaaye. `total([1,2,3])` `TypeError` deta hai kyunki ek list unhashable hai aur `lru_cache` ko cache key karne ko arguments hash karne chahiye; tuple `(1,2,3)` kaam karta hai.',
      },
      {
        title: 'property, cached_property, classmethod, staticmethod together',
        titleHi: 'property, cached_property, classmethod, staticmethod ek saath',
        code: `import functools

class Rectangle:
    _created = 0

    def __init__(self, w, h):
        self.w = w
        self.h = h
        Rectangle._created += 1

    @property
    def area(self):
        return self.w * self.h

    @functools.cached_property
    def description(self):
        print("  (computing description)")
        return f"{self.w}x{self.h} rectangle, area {self.area}"

    @classmethod
    def square(cls, side):
        return cls(side, side)

    @staticmethod
    def is_valid_dim(x):
        return isinstance(x, (int, float)) and x > 0

r = Rectangle(3, 4)
print("area:", r.area)
print(r.description)
print(r.description)          # cached -- no "(computing...)" second time

sq = Rectangle.square(5)
print("square area:", sq.area)
print("valid dim 5?", Rectangle.is_valid_dim(5))
print("valid dim -1?", Rectangle.is_valid_dim(-1))
print("total created:", Rectangle._created)`,
        output: `area: 12
  (computing description)
3x4 rectangle, area 12
3x4 rectangle, area 12
square area: 25
valid dim 5? True
valid dim -1? False
total created: 2`,
        explain: '`r.area` is accessed with no parentheses — `@property` makes it look like an attribute. `@cached_property` runs `description`\'s body once (the print fires once) then stores the string on the instance. `Rectangle.square(5)` is an alternative constructor using `cls`. `is_valid_dim` needs no instance or class, so it is a `@staticmethod`.',
        explainHi: '`r.area` bina parentheses access hota hai — `@property` ise ek attribute jaisa banaata hai. `@cached_property` `description` ka body ek baar chalata hai (print ek baar) phir string ko instance par store karta hai. `Rectangle.square(5)` `cls` istemal karne waala ek alternative constructor hai. `is_valid_dim` ko koi instance ya class nahi chahiye, isliye ye ek `@staticmethod` hai.',
      },
      {
        title: 'A production-ready retry, and choosing a context manager instead',
        titleHi: 'Ek production-ready retry, aur iske bajaye ek context manager chunna',
        code: `import functools, time

def retry(times=3, delay=0.0, exceptions=(Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last = None
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last = e
                    print(f"  attempt {attempt}/{times} failed: {e}")
                    if attempt < times:
                        time.sleep(delay)
            raise last
        return wrapper
    return decorator

_fail_count = 0

@retry(times=3, delay=0.0, exceptions=(ConnectionError,))
def flaky_fetch():
    global _fail_count
    _fail_count += 1
    if _fail_count < 3:
        raise ConnectionError("temporary")
    return "data"

print(flaky_fetch())

# a block, not a function -> context manager is the right shape:
from contextlib import contextmanager

@contextmanager
def timed_block(label):
    t0 = time.perf_counter()
    try:
        yield
    finally:
        elapsed = time.perf_counter() - t0
        print(f"{label} done; elapsed >= 0: {elapsed >= 0}")

with timed_block("setup + work"):
    total = sum(range(100000)) + sum(range(100000))
print("total:", total)`,
        output: `  attempt 1/3 failed: temporary
  attempt 2/3 failed: temporary
data
setup + work done; elapsed >= 0: True
total: 9999900000`,
        explain: 'The `retry` decorator is parametrised (times, delay, which exceptions) and re-raises the last error if every attempt fails — `flaky_fetch` succeeds on the third try. The timing need that spans two statements is not a whole function, so `@contextmanager` + `with timed_block(...)` fits where a decorator would not.',
        explainHi: '`retry` decorator parametrised hai (times, delay, kaunse exceptions) aur aakhri error re-raise karta hai agar har attempt fail ho — `flaky_fetch` teesri koshish par safal hota hai. Do statements par phaila timing zaroorat ek poora function nahi hai, isliye `@contextmanager` + `with timed_block(...)` wahaan fit hota hai jahaan ek decorator nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `class Session:
    @functools.lru_cache(maxsize=None)      # on a method
    def get_user(self, user_id):
        return db.query(User, user_id)`,
        right: `class Session:
    def __init__(self):
        self._user_cache = {}
    def get_user(self, user_id):
        if user_id not in self._user_cache:
            self._user_cache[user_id] = db.query(User, user_id)
        return self._user_cache[user_id]
# or @functools.cached_property for a no-arg computed value`,
        why: '`lru_cache` on a method keys on `(self, user_id)` and holds a reference to every `self` it has seen — those `Session` objects can never be garbage-collected, a slow memory leak. It also shares one cache across all instances. Use an instance-level dict, or `cached_property` for the no-argument case.',
        whyHi: 'Ek method par `lru_cache` `(self, user_id)` par key karta hai aur har `self` ka reference rakhta hai jo isne dekha — wo `Session` objects kabhi garbage-collect nahi ho sakte, ek dheema memory leak. Ye sabhi instances mein ek cache bhi share karta hai. Ek instance-level dict istemal karo, ya no-argument case ke liye `cached_property`.',
      },
      {
        wrong: `@functools.lru_cache
def get_settings(environment, overrides):     # overrides is a dict
    ...
get_settings("prod", {"debug": False})        # TypeError: unhashable type: 'dict'`,
        right: `@functools.lru_cache
def get_settings(environment, overrides_items):   # a tuple of pairs
    overrides = dict(overrides_items)
    ...
get_settings("prod", tuple({"debug": False}.items()))`,
        why: '`lru_cache` must hash every argument to build the cache key, and dicts/lists/sets are unhashable. Convert to a hashable form at the boundary — a tuple of items, a frozenset — or do not cache a function that legitimately needs a mutable argument.',
        whyHi: '`lru_cache` ko cache key banaane ko har argument hash karna hoga, aur dicts/lists/sets unhashable hain. Boundary par ek hashable form mein convert karo — items ka ek tuple, ek frozenset — ya ek aisa function cache mat karo jise jaayaz roop se ek mutable argument chahiye.',
      },
      {
        wrong: `@log_call
@validate_input
@check_permissions
@rate_limit
@cache_result
@retry(3)
def get_dashboard(request):               # 6 decorators -> 6 wrapper frames in every trace
    ...`,
        right: `# move cross-cutting request concerns to middleware:
#   MIDDLEWARE = [LogMiddleware, RateLimitMiddleware, PermissionMiddleware, ...]
# keep at most 1-2 function-specific decorators:
@cache_result
def get_dashboard(request):
    ...`,
        why: 'Six stacked decorators make every traceback start with six `wrapper` frames, make the real signature invisible, and make the order load-bearing and fragile. Anything that applies to many/all views (logging, rate limiting, permissions, request IDs) belongs in middleware, configured once.',
        whyHi: 'Chhah stacked decorators har traceback ko chhah `wrapper` frames se shuru karaate hain, asli signature ko invisible banaate hain, aur order ko load-bearing aur fragile. Jo kuch kai/sabhi views par lagta hai (logging, rate limiting, permissions) wo middleware mein hai, ek baar configure kiya.',
      },
    ],

    realWorld: [
      {
        en: '**`@functools.lru_cache` / `@cache` on pure config and lookup functions** is standard in Django projects — parsing a settings file, building a permission matrix, compiling a regex table. `@cached_property` is all over model and serializer classes for derived values.',
        hi: '**Pure config aur lookup functions par `@functools.lru_cache` / `@cache`** Django projects mein standard hai — ek settings file parse karna, ek permission matrix banaana. `@cached_property` derived values ke liye model aur serializer classes par har jagah hai.',
      },
      {
        en: '**`@property` and `@cached_property` define the public surface of Django models** — `full_name`, `is_expired`, `display_price` are properties, not stored columns. DRF `SerializerMethodField` is the serializer equivalent.',
        hi: '**`@property` aur `@cached_property` Django models ki public surface define karte hain** — `full_name`, `is_expired`, `display_price` properties hain, stored columns nahi. DRF `SerializerMethodField` serializer equivalent hai.',
      },
      {
        en: '**The decorator-vs-middleware-vs-context-manager choice is a real design decision in every Django app.** Per-view auth: decorator (`@permission_classes`). Per-request logging/CORS: middleware. Per-block transaction or timing: context manager (`with transaction.atomic():`).',
        hi: '**decorator-vs-middleware-vs-context-manager chunaav har Django app mein ek asli design nirnay hai.** Per-view auth: decorator. Per-request logging/CORS: middleware. Per-block transaction ya timing: context manager (`with transaction.atomic():`).',
      },
    ],

    interviewQA: [
      {
        q: 'What are the gotchas with `functools.lru_cache`? When is it the wrong choice?',
        qHi: '`functools.lru_cache` ke saath kya gotchas hain? ye kab galat chunaav hai?',
        a: 'lru_cache memoizes a function by storing a mapping from its arguments to its return value, so repeat calls with the same arguments skip the body. The first gotcha is that it builds the cache key by hashing the arguments, so every argument must be hashable. Passing a list, a dict, or a set raises a TypeError. If you need to cache over what is logically a collection, you convert it to a tuple or a frozenset at the boundary. The second is that it is only correct for pure functions — functions whose output depends solely on their arguments and which have no side effects that matter. If the function reads a file, hits a database, depends on the current time, or is expected to reflect changing external state, caching it silently serves stale results. The third, and the one that bites in web apps, is putting it on a method. The cache then keys on self along with the other arguments, which means the cache holds a strong reference to every instance the method was ever called on, and those instances can never be garbage collected for the life of the process. That is a memory leak that grows with traffic. It also means the cache is shared across all instances of the class rather than being per-instance, which is usually not what you want. For a no-argument computed value on an instance, functools dot cached_property is the right tool — it computes once and stores the result on the instance itself, so it is collected with the instance. For a method that takes arguments, use an explicit dictionary created in init. The fourth is that the default maxsize of 128 silently evicts, so a function called with many distinct argument sets gets a low hit rate and you might not notice. And the cache lives for the whole process with no time-based expiry, so lru_cache is not a substitute for a real cache with a TTL when freshness matters. It is introspectable and clearable through cache_info and cache_clear, which is worth using in tests.',
        aHi: 'lru_cache ek function ko memoize karta hai iske arguments se iski return value ka ek mapping store karke, isliye same arguments ke saath repeat calls body chhod deti hain. Pehla gotcha ye hai ki ye arguments ko hash karke cache key banaata hai, isliye har argument hashable hona chahiye. Ek list, ek dict, ya ek set pass karna ek TypeError deta hai. Doosra ye hai ki ye sirf pure functions ke liye sahi hai — functions jinka output sirf unke arguments par nirbhar karta hai. Agar function ek file padhta hai, ek database hit karta hai, current time par nirbhar karta hai, caching ise chupchaap stale results serve karaati hai. Teesra, aur jo web apps mein kaatta hai, ise ek method par rakhna. Cache phir self par doosre arguments ke saath key karta hai, jiska matlab cache har instance ka ek strong reference rakhta hai jispar method kabhi call hua, aur wo instances process ke jeevan bhar kabhi garbage collect nahi ho sakte. Ek instance par ek no-argument computed value ke liye, functools dot cached_property sahi tool hai. Ek method ke liye jo arguments leta hai, init mein banaaya ek explicit dictionary istemal karo.',
      },
      {
        q: 'How do you decide between a decorator, a context manager, and middleware for a piece of cross-cutting behaviour?',
        qHi: 'Ek cross-cutting behaviour ke tukde ke liye aap ek decorator, ek context manager, aur middleware ke beech kaise tay karte ho?',
        a: 'The deciding question is what scope the behaviour wraps. A decorator wraps a whole function call: everything from the moment the function is entered to the moment it returns. It is the right tool when the same behaviour applies to many functions in the same way, it is orthogonal to what those functions actually do — timing, logging, caching, retry, an access check — and it makes sense at the granularity of one function. The classic examples are lru_cache, login_required, and a retry wrapper. A context manager wraps a block of code rather than a function. When the thing you want to bracket is a few statements inside a function, or a section that does not correspond to a function boundary, you use a with statement. Database transactions are the canonical case: you want the commit-or-rollback to bracket exactly the statements in the with block, not a whole function. Timing a specific region, temporarily changing a setting, acquiring and releasing a lock, opening and closing a file — all block-scoped, all context managers. Middleware wraps every request in a web application, regardless of which view handles it. When the behaviour should apply uniformly across all or nearly all endpoints — request logging, adding CORS headers, attaching a correlation ID, authentication that is not endpoint-specific, rate limiting — it belongs in the middleware chain, configured once, rather than being a decorator repeated on every view where it is easy to forget one. A rough decision procedure: if it applies to every request, middleware; if it wraps a whole function and recurs across many functions, a decorator; if it brackets a block of statements, a context manager. And if a decorator would need heavy per-call configuration, that is a sign the logic should be an explicit argument or a small class instead.',
        aHi: 'Nirnay ka sawaal ye hai ki behaviour kis scope ko wrap karta hai. Ek decorator ek poore function call ko wrap karta hai: us pal se jab function mein pravesh kiya jaata hai us pal tak jab ye return karta hai. Ye sahi tool hai jab wahi behaviour kai functions par usi tarah lagta hai, ye orthogonal hai — timing, logging, caching, retry, ek access check. Ek context manager ek function ke bajaye code ke ek block ko wrap karta hai. Jab jise aap bracket karna chahte ho wo ek function ke andar kuch statements hain, aap ek with statement istemal karte ho. Database transactions canonical case hain. Middleware ek web application mein har request ko wrap karta hai, chahe kaunsa view handle kare. Jab behaviour sabhi endpoints par ek jaisa lagna chahiye — request logging, CORS headers, ek correlation ID — ye middleware chain mein hai. Ek rough nirnay: agar ye har request par lagta hai, middleware; agar ye ek poore function ko wrap karta hai aur kai functions mein aata hai, ek decorator; agar ye statements ke ek block ko bracket karta hai, ek context manager.',
      },
    ],

    exercises: [
      {
        task: 'Write `fib(n)` naive-recursive, time `fib(32)` with your `timer` decorator. Add `@functools.lru_cache(maxsize=None)` and time it again. Print `fib.cache_info()`. Then call `fib([1])` and confirm the `TypeError` about hashability.',
        taskHi: '`fib(n)` naive-recursive likho, apne `timer` decorator se `fib(32)` time karo. `@functools.lru_cache(maxsize=None)` jodo aur ise phir time karo. `fib.cache_info()` print karo. Phir `fib([1])` call karo aur hashability ke baare mein `TypeError` confirm karo.',
        hint: 'Stack `@timer` on top of `@lru_cache` so you time the cached version. The cached `fib(32)` runs its body ~33 times vs ~7 million. `fib([1])` fails because `lru_cache` cannot hash a list to key the cache.',
        hintHi: '`@timer` ko `@lru_cache` ke upar stack karo taaki aap cached version time karo. Cached `fib(32)` apna body ~33 baar chalata hai vs ~70 lakh. `fib([1])` fail hota hai kyunki `lru_cache` cache key karne ko ek list hash nahi kar sakta.',
      },
      {
        task: 'Build a `Temperature` class storing `_celsius`. Expose `celsius` and `fahrenheit` as `@property` with setters (setting either updates `_celsius`). Add `@classmethod from_fahrenheit(cls, f)`. Test round-tripping: `t = Temperature.from_fahrenheit(212); t.celsius` -> `100.0`; `t.fahrenheit = 32; t.celsius` -> `0.0`.',
        taskHi: 'Ek `Temperature` class banao jo `_celsius` store kare. `celsius` aur `fahrenheit` ko setters ke saath `@property` ki tarah expose karo. `@classmethod from_fahrenheit(cls, f)` jodo. Round-tripping test karo: `t = Temperature.from_fahrenheit(212); t.celsius` -> `100.0`; `t.fahrenheit = 32; t.celsius` -> `0.0`.',
        hint: '`fahrenheit` getter: `return self._celsius * 9/5 + 32`. `fahrenheit` setter: `self._celsius = (value - 32) * 5/9`. `from_fahrenheit`: compute celsius, `return cls(that)`.',
        hintHi: '`fahrenheit` getter: `return self._celsius * 9/5 + 32`. `fahrenheit` setter: `self._celsius = (value - 32) * 5/9`. `from_fahrenheit`: celsius compute karo, `return cls(that)`.',
      },
      {
        task: 'You have `@log`, `@validate`, `@authorize`, `@rate_limit`, `@cache` all applied to one view. Categorise each as "keep as decorator", "move to middleware", or "make a context manager", with one sentence of reasoning each. Then write the trimmed view with only the decorators that should stay.',
        taskHi: 'Aapke paas `@log`, `@validate`, `@authorize`, `@rate_limit`, `@cache` sab ek view par lage hain. Har ek ko "decorator ki tarah rakho", "middleware mein le jaao", ya "ek context manager banao" categorise karo, har ek ke liye ek vaakya reasoning ke saath. Phir sirf un decorators ke saath trimmed view likho jo rehne chahiye.',
        hint: '`log` and `rate_limit` and `authorize` (if not endpoint-specific) are cross-request -> middleware. `cache` is function-specific and orthogonal -> keep as decorator. `validate` is often better as an explicit call or a serializer, but a per-view decorator is defensible. Aim for 1-2 decorators left.',
        hintHi: '`log` aur `rate_limit` aur `authorize` (agar endpoint-specific nahi) cross-request hain -> middleware. `cache` function-specific aur orthogonal hai -> decorator ki tarah rakho. `validate` aksar ek explicit call ya ek serializer ki tarah behtar hai. 1-2 decorators bache ka lakshya rakho.',
      },
    ],

    keyTakeaways: [
      '`@functools.lru_cache(maxsize=...)` / `@functools.cache` is the real memoize — but only for PURE functions, and every argument must be HASHABLE (no list/dict/set args).',
      'Never put `lru_cache` on a method — it keys on `self` and holds every instance alive forever (memory leak) and shares one cache across instances. Use an instance dict or `@functools.cached_property`.',
      '`@property` turns a method into an attribute-style read; add `@x.setter` / `@x.deleter` for writes. `@functools.cached_property` computes once per instance for expensive stable values.',
      '`@classmethod` receives `cls` (use for alternative constructors, subclass-aware code); `@staticmethod` receives nothing (a plain function namespaced in the class).',
      'Use a decorator when the SAME wrapping applies to MANY functions and wraps the WHOLE call (logging, caching, auth, retry, timing).',
      'Do NOT use a decorator for: one function wrapped once (call inline); a block not a function (context manager); every request (middleware); heavy per-call config (pass arguments).',
      'Every decorator adds a `wrapper` frame to every traceback. Keep stacks to ~2-3; always `@functools.wraps` so names stay right.',
      'A retry/timeout that spans several statements is a context manager (`with ...`), not a decorator — decorators wrap whole functions only.',
    ],
    keyTakeawaysHi: [
      '`@functools.lru_cache(maxsize=...)` / `@functools.cache` asli memoize hai — par sirf PURE functions ke liye, aur har argument HASHABLE hona chahiye (koi list/dict/set args nahi).',
      'Kabhi ek method par `lru_cache` mat rakho — ye `self` par key karta hai aur har instance ko hamesha zinda rakhta hai (memory leak) aur instances mein ek cache share karta hai. Ek instance dict ya `@functools.cached_property` istemal karo.',
      '`@property` ek method ko ek attribute-style read mein badalta hai; writes ke liye `@x.setter` / `@x.deleter` jodo. `@functools.cached_property` mehngi stable values ke liye prati instance ek baar compute karta hai.',
      '`@classmethod` `cls` paata hai (alternative constructors, subclass-aware code ke liye istemal); `@staticmethod` kuch nahi paata (class mein namespaced ek plain function).',
      'Ek decorator tab istemal karo jab WAHI wrapping KAI functions par lagti hai aur POORE call ko wrap karti hai (logging, caching, auth, retry, timing).',
      'Ek decorator ISKE liye istemal MAT karo: ek function ek baar wrapped (inline call); ek block ek function nahi (context manager); har request (middleware); heavy per-call config (arguments pass karo).',
      'Har decorator har traceback mein ek `wrapper` frame jodta hai. Stacks ~2-3 tak rakho; hamesha `@functools.wraps` taaki naam sahi rahein.',
      'Ek retry/timeout jo kai statements par phaila hai wo ek context manager hai (`with ...`), ek decorator nahi — decorators sirf poore functions wrap karte hain.',
    ],
  },
];
