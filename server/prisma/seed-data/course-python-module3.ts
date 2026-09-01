/**
 * Python Complete Course — Module 3: Functions & Scope, lessons 1-3.
 *
 * Lesson 1: default arguments — evaluated ONCE at def time; the mutable-default
 *           trap in depth; the `None` sentinel fix; keyword-only args (`*` in
 *           the signature) and positional-only (`/`).
 * Lesson 2: `*args` and `**kwargs` — collecting extra positional/keyword
 *           arguments, the signature order, and forwarding arguments through a
 *           wrapper (`def w(*a, **kw): return f(*a, **kw)`).
 * Lesson 3: scope — LEGB lookup, "assignment makes a name local" and the
 *           `UnboundLocalError`, `global` and `nonlocal`, closures, and the
 *           classic late-binding loop-variable bug.
 *
 * NOTE for future editors: `examples` use `code` + `output` (Python). EVERY
 * backtick inside `simple`/`simpleHi`/`content`/`contentHi` must be `\`` —
 * including inline-code spans inside the ``` ascii blocks. Run every sample
 * with `python`. Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_3: CourseLesson[] = [
  {
    slug: 'py-default-arguments-and-the-mutable-default-trap',
    title: 'Default Arguments: Evaluated Once, and the Mutable-Default Trap',
    titleHi: 'Default Arguments: Ek Baar Evaluate, Aur Mutable-Default Jaal',
    description: 'Giving a function a default of `[]` or `{}` so a caller can leave it out — `def add_tag(tag, tags=[])` — and finding that the list is shared across every call that relied on the default, so tags pile up from one call into the next. The default expression runs a single time, when the `def` line is first executed, and that one object is reused forever.',
    descriptionHi: 'Ek function ko `[]` ya `{}` ka default dena taaki ek caller ise chhod sake — `def add_tag(tag, tags=[])` — aur ye paana ki list har us call ke beech share hoti hai jisne default par bharosa kiya, isliye tags ek call se agli mein jama hote hain. Default expression ek akela baar chalti hai, jab `def` line pehli baar execute hoti hai, aur wo ek object hamesha ke liye reuse hota hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A form with a "notes" box that the printer forgot to leave blank between copies.** You order a stack of intake forms, each meant to arrive with an empty notes box for the next person to fill in. But the print shop made one master form, wrote on it, and photocopied *that* — so every "fresh" form already carries the previous person\'s scribbles, and each new person adds theirs on top. The notes box was supposed to be created new for each form; instead there is one box, shared. In Python, the code after the `=` in a parameter default is run exactly once, at the moment the `def` statement executes — which is usually when the file is first imported — and the resulting object is stapled to the function and handed out on every call that does not supply its own. If that object is an empty list or dict, and the function body adds to it, the additions stay for the next call. The fix is to default to a value that cannot be mutated — `None` — and, inside the function, create the real empty container fresh each time the default was used. Now every call that omits the argument gets its own blank box.',
      hi: '**Ek form jismein ek "notes" box hai jise printer copies ke beech blank chhodna bhool gaya.** Aap intake forms ka ek stack order karte ho, har ek ka matlab agle vyakti ke bharne ke liye ek empty notes box ke saath aana. Par print shop ne ek master form banaya, uspar likha, aur *use* photocopy kiya — isliye har "fresh" form pehle se pichhle vyakti ki likhaawat rakhta hai, aur har naya vyakti apni uske upar jodta hai. Notes box ka matlab har form ke liye naya banaya jaana tha; iske bajaye ek box hai, shared. Python mein, ek parameter default mein `=` ke baad ka code bilkul ek baar chalta hai, us pal jab `def` statement execute hota hai — jo aam taur par tab hai jab file pehli baar import hoti hai — aur nateeja object function se staple hota hai aur har us call par diya jaata hai jo apna nahi deti. Fix ek aisi value ko default karna hai jo mutate nahi ho sakti — `None` — aur, function ke andar, asli empty container har baar naya banao jab default istemal hua.',
    },

    simple: `**Start broken.** A mutable default that accumulates across calls:

\`\`\`python
def add_tag(tag, tags=[]):        # the [] is created ONCE, at def time
    tags.append(tag)
    return tags

print(add_tag("python"))          # ['python']
print(add_tag("django"))          # ['python', 'django']   <-- the SAME list!
print(add_tag("sql"))             # ['python', 'django', 'sql']
\`\`\`

The \`[]\` is not "a new empty list every call". It is one list object, built when \`def add_tag\` ran, reused on every call that does not pass \`tags\`. Every \`.append\` mutates that shared list.

**The fix: default to \`None\`, build the container inside**

\`\`\`python
def add_tag(tag, tags=None):
    if tags is None:              # the default was used -> make a FRESH list
        tags = []
    tags.append(tag)
    return tags

print(add_tag("python"))          # ['python']
print(add_tag("django"))          # ['django']     <-- fresh each time
print(add_tag("sql", ["a"]))      # ['a', 'sql']   <-- an explicit list still works
\`\`\`

\`\`\`
Default values are evaluated ONCE, when the \`def\` line runs (import time),
not on each call.

SAFE defaults (immutable):   None   True/False   numbers   strings   tuples
UNSAFE defaults (mutable):   []   {}   set()   any object you will mutate
                             also: datetime.now()  (frozen at import, not "now")

The fix is always:
    def f(x, arg=None):
        if arg is None:
            arg = []          # or {}, or the real default value
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Ek mutable default jo calls ke beech jama hota hai:

\`\`\`python
def add_tag(tag, tags=[]):        # [] EK BAAR banti hai, def time par
    tags.append(tag)
    return tags

print(add_tag("python"))          # ['python']
print(add_tag("django"))          # ['python', 'django']   <-- WAHI list!
print(add_tag("sql"))             # ['python', 'django', 'sql']
\`\`\`

\`[]\` "har call ek nayi empty list" nahi hai. Ye ek list object hai, tab bani jab \`def add_tag\` chala, har us call par reuse jo \`tags\` pass nahi karti. Har \`.append\` us shared list ko mutate karta hai.

**Fix: \`None\` ko default karo, container andar banao**

\`\`\`python
def add_tag(tag, tags=None):
    if tags is None:              # default istemal hua -> ek FRESH list banao
        tags = []
    tags.append(tag)
    return tags

print(add_tag("python"))          # ['python']
print(add_tag("django"))          # ['django']     <-- har baar fresh
print(add_tag("sql", ["a"]))      # ['a', 'sql']   <-- ek explicit list abhi bhi kaam karta hai
\`\`\`

\`\`\`
Default values EK BAAR evaluate hote hain, jab \`def\` line chalti hai (import time),
har call par nahi.

SURAKSHIT defaults (immutable):   None   True/False   numbers   strings   tuples
ASURAKSHIT defaults (mutable):    []   {}   set()   koi bhi object jo aap mutate karoge
                                  aur: datetime.now()  (import par frozen, "now" nahi)

Fix hamesha:
    def f(x, arg=None):
        if arg is None:
            arg = []          # ya {}, ya asli default value
\`\`\``,

    content: `## Why the default is created once, precisely

\`\`\`python
import time

def stamp(label, at=time.time()):    # time.time() runs ONCE, when 'def stamp' executes
    print(label, at)

stamp("a")     # a 1712000000.0
time.sleep(2)
stamp("b")     # b 1712000000.0   -- SAME timestamp; 'at' was frozen at def time
\`\`\`

A \`def\` statement is itself executed — it builds a function object, and part of building it is evaluating every default expression right then and attaching the results. Those attached objects live on the function (\`add_tag.__defaults__\`) and are reused for the life of the process. This is fine for immutable defaults (you cannot change \`None\` or \`5\`) and a bug for anything you mutate or anything time-sensitive.

## The correct patterns

\`\`\`python
# mutable container default:
def build(items=None):
    items = items if items is not None else []
    ...

# a "compute the default now" default:
def log(msg, when=None):
    when = when or datetime.now()      # 'or' is fine here since datetime is truthy

# a default that depends on another argument -> compute in the body:
def slice_page(data, size=10, page=1, end=None):
    end = end if end is not None else page * size
    ...
\`\`\`

## Keyword-only arguments: \`*\` in the signature

\`\`\`python
def connect(host, *, port=5432, timeout=30):
    ...                                # everything after * MUST be passed by keyword

connect("db", port=8080)               # OK
connect("db", 8080)                    # TypeError: takes 1 positional argument but 2 given
\`\`\`

A bare \`*\` in the parameter list means "no more positional arguments past here". Use it to force callers to name the options — \`connect("db", 8080, 5)\` is unreadable, \`connect("db", port=8080, timeout=5)\` is not. Django and DRF use this heavily for API clarity.

## Positional-only arguments: \`/\` in the signature

\`\`\`python
def divide(a, b, /):                   # a and b CANNOT be passed by keyword
    return a / b

divide(10, 2)                          # OK
divide(a=10, b=2)                      # TypeError

def replace(text, old, new, /, count=-1):   # first three positional-only, count either way
    ...
\`\`\`

\`/\` marks the end of positional-only parameters. It is mostly for library authors who want to keep parameter names free to rename. You will read it more than write it.

## The full parameter order

\`\`\`python
def f(pos_only, /, normal, *args, kw_only, **kwargs):
      \\_________/     \\____/  \\___/  \\____/   \\_____/
      before /       flexible  extra  after *  extra
                     positional        positional-blocking  keyword
\`\`\`

You rarely need all five, but the order is fixed: positional-only, then normal, then \`*args\` (or a bare \`*\`), then keyword-only, then \`**kwargs\`.`,

    contentHi: `## Default ek baar kyun banta hai, thik-thik

\`\`\`python
import time

def stamp(label, at=time.time()):    # time.time() EK BAAR chalta hai, jab 'def stamp' execute hota hai
    print(label, at)

stamp("a")     # a 1712000000.0
time.sleep(2)
stamp("b")     # b 1712000000.0   -- WAHI timestamp; 'at' def time par frozen tha
\`\`\`

Ek \`def\` statement khud execute hota hai — ye ek function object banaata hai, aur ise banane ka ek hissa har default expression ko tabhi evaluate karna aur nateeje attach karna hai. Wo attached objects function par rehte hain (\`add_tag.__defaults__\`) aur process ke jeevan bhar reuse hote hain. Ye immutable defaults ke liye theek hai (aap \`None\` ya \`5\` nahi badal sakte) aur kisi bhi cheez ke liye ek bug jo aap mutate karte ho ya kuch time-sensitive.

## Sahi patterns

\`\`\`python
# mutable container default:
def build(items=None):
    items = items if items is not None else []
    ...

# ek "default abhi compute karo" default:
def log(msg, when=None):
    when = when or datetime.now()      # 'or' yahaan theek hai kyunki datetime truthy hai

# ek default jo ek doosre argument par nirbhar karta hai -> body mein compute karo:
def slice_page(data, size=10, page=1, end=None):
    end = end if end is not None else page * size
    ...
\`\`\`

## Keyword-only arguments: signature mein \`*\`

\`\`\`python
def connect(host, *, port=5432, timeout=30):
    ...                                # * ke baad sab kuch KEYWORD se pass HONA CHAHIYE

connect("db", port=8080)               # OK
connect("db", 8080)                    # TypeError: takes 1 positional argument but 2 given
\`\`\`

Parameter list mein ek nanga \`*\` matlab "yahaan ke baad koi aur positional arguments nahi". Ise callers ko options naam dene ko majboor karne ko istemal karo — \`connect("db", 8080, 5)\` unreadable hai, \`connect("db", port=8080, timeout=5)\` nahi. Django aur DRF ise API clarity ke liye bahut istemal karte hain.

## Positional-only arguments: signature mein \`/\`

\`\`\`python
def divide(a, b, /):                   # a aur b KEYWORD se pass NAHI ho sakte
    return a / b

divide(10, 2)                          # OK
divide(a=10, b=2)                      # TypeError

def replace(text, old, new, /, count=-1):   # pehle teen positional-only, count kisi bhi tarah
    ...
\`\`\`

\`/\` positional-only parameters ka end mark karta hai. Ye zyaadatar library authors ke liye hai jo parameter names ko rename karne ke liye free rakhna chahte hain. Aap ise likhne se zyaada padhoge.

## Poora parameter order

\`\`\`python
def f(pos_only, /, normal, *args, kw_only, **kwargs):
      \\_________/     \\____/  \\___/  \\____/   \\_____/
      / se pehle      flexible  extra  * ke baad  extra
                     positional        positional-blocking  keyword
\`\`\`

Aapko shaayad hi sab paanch chahiye, par order fixed hai: positional-only, phir normal, phir \`*args\` (ya ek nanga \`*\`), phir keyword-only, phir \`**kwargs\`.`,

    examples: [
      {
        title: 'Broken: shared mutable default across calls',
        titleHi: 'Toota: calls ke beech shared mutable default',
        code: `def collect(item, into={}):
    into[item] = into.get(item, 0) + 1
    return into

print(collect("a"))
print(collect("b"))
print(collect("a"))
print(collect.__defaults__)`,
        output: `{'a': 1}
{'a': 1, 'b': 1}
{'a': 2, 'b': 1}
({'a': 2, 'b': 1},)`,
        explain: 'The `{}` default is one dict, built when `def collect` ran. Every call that omits `into` mutates that same dict, so counts accumulate across unrelated calls. `collect.__defaults__` literally shows the shared dict carrying state between calls.',
        explainHi: '`{}` default ek dict hai, tab bana jab `def collect` chala. Har call jo `into` chhodti hai us hi dict ko mutate karti hai, isliye counts asambandhit calls ke beech jama hote hain. `collect.__defaults__` sachmuch shared dict ko calls ke beech state le jaate dikhaata hai.',
      },
      {
        title: 'Fixed: None sentinel; keyword-only options',
        titleHi: 'Theek: None sentinel; keyword-only options',
        code: `def collect(item, into=None):
    if into is None:
        into = {}
    into[item] = into.get(item, 0) + 1
    return into

print(collect("a"))
print(collect("b"))
print(collect("a"))

def make_client(host, *, port=443, verify=True, timeout=30):
    return f"{host}:{port} verify={verify} timeout={timeout}"

print(make_client("api.example.com"))
print(make_client("api.example.com", port=8080, timeout=5))

try:
    make_client("api.example.com", 8080)          # port passed positionally
except TypeError as e:
    print("positional port rejected:", "positional argument" in str(e))`,
        output: `{'a': 1}
{'b': 1}
{'a': 1}
api.example.com:443 verify=True timeout=30
api.example.com:8080 verify=True timeout=5
positional port rejected: True`,
        explain: 'With `into=None` and a fresh `{}` inside, every default-using call starts empty. `make_client(host, *, ...)` forces `port`, `verify`, `timeout` to be named — `make_client("api", 8080)` is a `TypeError`, which stops a caller from silently passing a number to the wrong slot.',
        explainHi: '`into=None` aur andar ek fresh `{}` ke saath, har default-using call empty shuru hoti hai. `make_client(host, *, ...)` `port`, `verify`, `timeout` ko named hone ko majboor karta hai — `make_client("api", 8080)` ek `TypeError` hai, jo ek caller ko chupchaap galat slot mein ek number pass karne se rokta hai.',
      },
      {
        title: 'A time default that freezes, and the fix',
        titleHi: 'Ek time default jo freeze hota hai, aur fix',
        code: `import time

def event_broken(name, at=time.time()):
    return f"{name} @ {at:.0f}"

def event_fixed(name, at=None):
    if at is None:
        at = time.time()
    return f"{name} @ {at:.0f}"

t0 = event_broken("start")
time.sleep(1)
t1 = event_broken("stop")
print(t0 == t1.replace("stop", "start"))   # True -- same frozen timestamp

f0 = event_fixed("start")
time.sleep(1)
f1 = event_fixed("stop")
print(f0.split("@")[1] != f1.split("@")[1])  # True -- different timestamps`,
        output: `True
True`,
        explain: '`at=time.time()` evaluates `time.time()` exactly once, when the `def` runs, so every call uses that one frozen value. `at=None` plus `at = time.time()` in the body evaluates it per call. The same trap applies to `datetime.now()`, `uuid.uuid4()`, and any default that should be "computed fresh".',
        explainHi: '`at=time.time()` `time.time()` ko bilkul ek baar evaluate karta hai, jab `def` chalta hai, isliye har call us ek frozen value ko istemal karti hai. `at=None` plus body mein `at = time.time()` ise prati call evaluate karta hai. Wahi jaal `datetime.now()`, `uuid.uuid4()`, aur kisi bhi default par lagta hai jo "fresh compute" hona chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `def render(template, context={}):
    context["timestamp"] = now()
    return fill(template, context)`,
        right: `def render(template, context=None):
    context = dict(context) if context else {}
    context["timestamp"] = now()
    return fill(template, context)`,
        why: 'The `{}` default is shared, so `context["timestamp"] = ...` pollutes it for the next default-using call, and worse, if a caller DID pass a dict, you are mutating their dict. `dict(context)` (or `{**context}`) makes a private copy; `None` handles the omitted case.',
        whyHi: '`{}` default shared hai, isliye `context["timestamp"] = ...` ise agli default-using call ke liye pollute karta hai, aur bura, agar ek caller ne ek dict pass kiya, aap unka dict mutate kar rahe ho. `dict(context)` (ya `{**context}`) ek private copy banaata hai; `None` chhoodi gayi case handle karta hai.',
      },
      {
        wrong: `def paginate(qs, limit=None, offset=0):
    if not limit:                    # treats limit=0 as "no limit"
        limit = 100
    return qs[offset:offset + limit]`,
        right: `def paginate(qs, limit=None, offset=0):
    if limit is None:
        limit = 100
    return qs[offset:offset + limit]`,
        why: 'Using `if not limit:` means a legitimate `limit=0` (return nothing) is overridden to 100. Test `is None` when 0, "", or [] are valid values a caller might pass deliberately. `if not x:` is only right when every falsy value should trigger the default.',
        whyHi: '`if not limit:` istemal karna matlab ek jaayaz `limit=0` (kuch nahi lautao) 100 se override hota hai. `is None` test karo jab 0, "", ya [] valid values hain jo ek caller jaan-boojhkar pass kar sakta hai. `if not x:` sirf tab sahi hai jab har falsy value default trigger kare.',
      },
      {
        wrong: `# a decorator or class collecting into a class-level list
class Registry:
    handlers = []                    # ONE list shared by ALL instances
    def add(self, h):
        self.handlers.append(h)`,
        right: `class Registry:
    def __init__(self):
        self.handlers = []           # a fresh list per instance`,
        why: 'A mutable value assigned at class body level (not in `__init__`) is shared by every instance of the class — the same trap as a mutable default, one level up. Two `Registry()` objects would share one `handlers` list. Instance state belongs in `__init__`.',
        whyHi: 'Class body level par assign ki gayi ek mutable value (`__init__` mein nahi) class ke har instance dwara share hoti hai — mutable default jaisa hi jaal, ek level upar. Do `Registry()` objects ek `handlers` list share karenge. Instance state `__init__` mein hai.',
      },
    ],

    realWorld: [
      {
        en: '**The mutable-default bug is `ruff`/`flake8` rule B006** and it shows up in real Django code: a DRF serializer field with `default=[]`, a view helper `def get_context(self, extra={})`, a form `__init__(self, fields=[])`. Each accumulates state across requests from different users.',
        hi: '**Mutable-default bug `ruff`/`flake8` rule B006 hai** aur ye asli Django code mein dikhta hai: `default=[]` waala ek DRF serializer field, ek view helper `def get_context(self, extra={})`, ek form `__init__(self, fields=[])`. Har ek alag users ki requests ke beech state jama karta hai.',
      },
      {
        en: '**Keyword-only arguments (`*` in the signature)** are all over DRF — `Response(data, *, status=None, headers=None)`, `serializer.save(**kwargs)` conventions — because a call like `Response(data, 400)` is ambiguous and `Response(data, status=400)` is not.',
        hi: '**Keyword-only arguments (signature mein `*`)** DRF mein har jagah hain — `Response(data, *, status=None, headers=None)` — kyunki `Response(data, 400)` jaisa ek call ambiguous hai aur `Response(data, status=400)` nahi.',
      },
      {
        en: '**`datetime.now()` as a default** silently freezes to import time — a Django model `default=datetime.now()` (called) sets the same timestamp on every row, whereas `default=datetime.now` (the function, no parens) or `default=timezone.now` is evaluated per row.',
        hi: '**`datetime.now()` ek default ki tarah** chupchaap import time par freeze hota hai — ek Django model `default=datetime.now()` (called) har row par wahi timestamp set karta hai, jabki `default=datetime.now` (function, bina parens) ya `default=timezone.now` prati row evaluate hota hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the mutable default argument trap. Why does it happen and how do you avoid it?',
        qHi: 'Mutable default argument trap samjhaao. Ye kyun hota hai aur aap ise kaise bachte ho?',
        a: 'When Python executes a def statement, it constructs a function object, and part of that construction is evaluating every default-value expression right then and storing the resulting objects on the function. That evaluation happens exactly once, at the time the def line runs, which is normally when the module is first imported. It does not happen again on each call. For an immutable default like None, a number, or a string, this is invisible, because there is nothing you can do to change the shared object. But if the default is a mutable object such as an empty list or an empty dictionary, every call that does not supply that argument receives the same object, and if the function body mutates it — appends to the list, sets a key in the dict — that mutation persists and is visible to the next call. So a function like def add underscore item, item, bucket equals empty-list, that appends item and returns bucket, returns a one-element list the first time, a two-element list the second time, and so on, because it is the same list growing. In a web application this is worse than a toy example, because a serializer or a view instantiated with a mutable default will carry state between requests from different users. The idiomatic fix is to make the default None, then at the top of the function check whether the parameter is None and, if so, create a fresh container. There is a subtlety on top: if the parameter might also be a dict a caller passed in, and you are going to mutate it, you should copy it rather than mutate the caller\'s object — so context equals dict of context if context else empty-dict. The same reasoning applies to a default that should be computed at call time, like datetime dot now: writing it as the default freezes it to import time, so you default to None and compute it in the body. Linters flag the bare mutable default automatically, and it is worth enabling that rule.',
        aHi: 'Jab Python ek def statement execute karta hai, ye ek function object banaata hai, aur us nirmaan ka ek hissa har default-value expression ko tabhi evaluate karna aur nateeje objects function par store karna hai. Wo evaluation bilkul ek baar hota hai, us samay jab def line chalti hai, jo saamaanya roop se tab hai jab module pehli baar import hota hai. Ye har call par phir nahi hota. None, ek number, ya ek string jaise ek immutable default ke liye ye anadekha hai, kyunki share kiye object ko badalne ke liye aap kuch nahi kar sakte. Par agar default ek mutable object hai jaise ek empty list ya ek empty dictionary, har call jo wo argument nahi deti wahi object paati hai, aur agar function body ise mutate karta hai, wo mutation bana rehta hai aur agli call ko dikhta hai. Ek web application mein ye ek toy udaharan se bura hai, kyunki ek mutable default se instantiate kiya ek serializer ya ek view alag users ki requests ke beech state le jaayega. Idiomatic fix default None banaana hai, phir function ke top par check karna ki parameter None hai ya nahi aur, agar haan, ek fresh container banaana.',
      },
      {
        q: 'What do a bare `*` and a `/` do in a function signature, and why would you use them?',
        qHi: 'Ek function signature mein ek nanga `*` aur ek `/` kya karte hain, aur aap unhe kyun istemal karoge?',
        a: 'Both are markers that split the parameter list into sections with different calling rules. A bare star, written on its own between parameters, means that every parameter after it is keyword-only: a caller must pass it by name, never positionally. So if you write def connect, host, star, port equals five-four-three-two, timeout equals thirty, then connect of quote db quote comma port equals eight-oh-eight-oh works, but connect of quote db quote comma eight-oh-eight-oh raises a TypeError because the eight-oh-eight-oh cannot fill a positional slot. You use this to stop callers from passing a sequence of bare values whose meaning is not obvious at the call site. connect of quote db quote comma eight-oh-eight-oh comma five is unreadable — is five a timeout, a retry count, a pool size? Forcing keywords makes every call self-documenting, and it also lets you reorder or insert options later without breaking existing calls, since they name their arguments. The slash is the mirror image: every parameter before it is positional-only and cannot be passed by name. def divide, a, b, slash means divide of ten comma two works but divide of a equals ten comma b equals two is a TypeError. This is mostly a tool for library authors. If a parameter is positional-only, its name is not part of the public interface, so you are free to rename it in a later version without breaking anyone who was passing it by keyword. Several built-in functions use it — the string methods, for instance, take their arguments positionally only. In application code you will read the slash far more than you write it, but the bare star for keyword-only options is something you should use routinely on any function with more than one or two optional parameters.',
        aHi: 'Dono markers hain jo parameter list ko alag calling rules waale sections mein baantte hain. Ek nanga star, parameters ke beech apne aap likha, matlab iske baad har parameter keyword-only hai: ek caller ise naam se pass karna chahiye, kabhi positionally nahi. Toh agar aap def connect, host, star, port equals five-four-three-two, timeout equals thirty likhte ho, toh connect of quote db quote comma port equals eight-oh-eight-oh kaam karta hai, par connect of quote db quote comma eight-oh-eight-oh ek TypeError deta hai. Aap ise callers ko bare values ka ek sequence pass karne se rokne ko istemal karte ho jinka matlab call site par spasht nahi. Keywords ko majboor karna har call ko self-documenting banaata hai. Slash ulti chhavi hai: iske pehle har parameter positional-only hai aur naam se pass nahi ho sakta. Ye zyaadatar library authors ke liye ek tool hai. Agar ek parameter positional-only hai, iska naam public interface ka hissa nahi hai, isliye aap ek baad ke version mein ise rename karne ke liye free ho.',
      },
    ],

    exercises: [
      {
        task: 'Write `append_to(item, target=None)` correctly (None sentinel), then write the buggy `target=[]` version. Call each three times with no `target`. Print `append_to.__defaults__` for the buggy one and explain what you see.',
        taskHi: '`append_to(item, target=None)` sahi likho (None sentinel), phir buggy `target=[]` version likho. Har ek ko teen baar bina `target` ke call karo. Buggy wale ke liye `append_to.__defaults__` print karo aur samjhaao aap kya dekhte ho.',
        hint: 'The buggy version returns `["a"]`, `["a", "b"]`, `["a", "b", "c"]`. `__defaults__` will be `(["a", "b", "c"],)` — the one shared list, visibly holding the accumulated state.',
        hintHi: 'Buggy version `["a"]`, `["a", "b"]`, `["a", "b", "c"]` lautaata hai. `__defaults__` `(["a", "b", "c"],)` hoga — wo ek shared list, jama state ko dikhaate hue.',
      },
      {
        task: 'Write `make_range(start, stop=None, step=1)` that mimics `range`: if only one arg is given, it means `stop` and `start` becomes 0. Return `list(range(...))`. Test `make_range(5)` -> `[0,1,2,3,4]` and `make_range(2, 8, 2)` -> `[2, 4, 6]`.',
        taskHi: '`make_range(start, stop=None, step=1)` likho jo `range` ki nakal kare: agar sirf ek arg diya hai, iska matlab `stop` hai aur `start` 0 ban jaata hai. `list(range(...))` return karo. Test `make_range(5)` -> `[0,1,2,3,4]` aur `make_range(2, 8, 2)` -> `[2, 4, 6]`.',
        hint: '`if stop is None: start, stop = 0, start`. Then `return list(range(start, stop, step))`. This is exactly how the real `range` overloads a single argument to mean `stop`.',
        hintHi: '`if stop is None: start, stop = 0, start`. Phir `return list(range(start, stop, step))`. Asli `range` bilkul aise ek akele argument ko `stop` matlab ke liye overload karta hai.',
      },
      {
        task: 'Write `create_user(name, /, *, role="member", active=True)`. Verify `create_user("Al")` works, `create_user("Al", role="admin")` works, `create_user(name="Al")` raises (positional-only), and `create_user("Al", "admin")` raises (keyword-only).',
        taskHi: '`create_user(name, /, *, role="member", active=True)` likho. Verify karo `create_user("Al")` kaam karta hai, `create_user("Al", role="admin")` kaam karta hai, `create_user(name="Al")` error deta hai (positional-only), aur `create_user("Al", "admin")` error deta hai (keyword-only).',
        hint: '`/` after `name` makes `name` positional-only; `*` before `role` makes `role`/`active` keyword-only. So the only valid forms are `create_user("Al")` and `create_user("Al", role=..., active=...)`.',
        hintHi: '`name` ke baad `/` `name` ko positional-only banaata hai; `role` se pehle `*` `role`/`active` ko keyword-only banaata hai. Toh ekmatra valid forms `create_user("Al")` aur `create_user("Al", role=..., active=...)` hain.',
      },
    ],

    keyTakeaways: [
      'Default values are evaluated ONCE, when the `def` line runs (import time), not on each call. The object is attached to the function and reused.',
      'NEVER use a mutable default (`[]`, `{}`, `set()`) or a "compute now" default (`datetime.now()`, `uuid4()`). Default to `None` and build/compute inside the function.',
      'The fix pattern: `def f(x, arg=None): if arg is None: arg = []`. If a caller may pass a container you will mutate, copy it (`dict(arg)` / `list(arg)` / `{**arg}`).',
      'Use `if arg is None:` not `if not arg:` — the latter wrongly overrides a legitimate `0`, `""`, or `[]`.',
      'A bare `*` in the signature makes every following parameter keyword-only — use it for any function with 2+ optional args so calls are self-documenting.',
      '`/` in the signature makes preceding parameters positional-only (they cannot be passed by name) — mostly a library-author tool; you read it more than write it.',
      'Parameter order is fixed: `pos_only, /, normal, *args, kw_only, **kwargs`.',
      'The class-body equivalent: a mutable value assigned at class level (not in `__init__`) is shared by every instance — put instance state in `__init__`.',
    ],
    keyTakeawaysHi: [
      'Default values EK BAAR evaluate hote hain, jab `def` line chalti hai (import time), har call par nahi. Object function se attach hota hai aur reuse hota hai.',
      'KABHI ek mutable default (`[]`, `{}`, `set()`) ya ek "compute now" default (`datetime.now()`, `uuid4()`) istemal mat karo. `None` ko default karo aur function ke andar build/compute karo.',
      'Fix pattern: `def f(x, arg=None): if arg is None: arg = []`. Agar ek caller ek container pass kar sakta hai jise aap mutate karoge, ise copy karo (`dict(arg)` / `list(arg)` / `{**arg}`).',
      '`if arg is None:` istemal karo `if not arg:` nahi — baad wala ek jaayaz `0`, `""`, ya `[]` ko galat tarike se override karta hai.',
      'Signature mein ek nanga `*` har agle parameter ko keyword-only banaata hai — 2+ optional args waale kisi bhi function ke liye ise istemal karo taaki calls self-documenting hon.',
      'Signature mein `/` pehle wale parameters ko positional-only banaata hai (wo naam se pass nahi ho sakte) — zyaadatar ek library-author tool; aap ise likhne se zyaada padhte ho.',
      'Parameter order fixed hai: `pos_only, /, normal, *args, kw_only, **kwargs`.',
      'Class-body equivalent: class level par assign ki gayi ek mutable value (`__init__` mein nahi) har instance dwara share hoti hai — instance state `__init__` mein rakho.',
    ],
  },

  {
    slug: 'py-args-kwargs-and-forwarding',
    title: '*args and **kwargs: Collecting and Forwarding Arguments',
    titleHi: '*args Aur **kwargs: Arguments Collect Aur Forward Karna',
    description: 'Writing a wrapper function that needs to accept "whatever arguments the wrapped function takes" and pass them straight through, then hard-coding two or three parameters and watching it break the moment the wrapped function is called with a fourth. `*args` and `**kwargs` in the signature collect every extra positional and keyword argument into a tuple and a dict; the same `*` and `**` in the call spread them back out.',
    descriptionHi: 'Ek wrapper function likhna jise "jo bhi arguments wrapped function leta hai" accept karke seedhe pass karna hai, phir do ya teen parameters hard-code karna aur ise tootte dekhna jis pal wrapped function ek chauthe ke saath call hota hai. Signature mein `*args` aur `**kwargs` har extra positional aur keyword argument ko ek tuple aur ek dict mein collect karte hain; call mein wahi `*` aur `**` unhe wapas failaate hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A relay runner who must carry whatever the previous runner hands over, no matter how many things.** If the relay rule said "you may only carry a baton", the moment someone hands over a baton plus a flag plus a water bottle, the runner has to drop two of them. `*args` and `**kwargs` are the rule "carry everything, however much there is". In a function definition, `*args` means "gather every extra unnamed thing passed to me into one bundle" and `**kwargs` means "gather every extra named thing into one labelled bundle". Then, when this runner hands off to the next, writing `*args` and `**kwargs` in the handoff means "un-bundle everything and pass it on exactly as I received it". A wrapper that takes `*args, **kwargs` and calls the inner function with `*args, **kwargs` is transparent: it works no matter what the inner function\'s signature is, today or after someone adds a parameter. The star does the bundling on the way in and the un-bundling on the way out; it is the same operator doing opposite jobs depending on which side of the function boundary it is on.',
      hi: '**Ek relay runner jise jo bhi pichhla runner deta hai use le jaana hai, chahe kitni bhi cheezein hon.** Agar relay niyam kehta "aap sirf ek baton le jaa sakte ho", jis pal koi ek baton plus ek flag plus ek water bottle deta hai, runner ko do phenkne padte hain. `*args` aur `**kwargs` niyam hain "sab kuch le jaao, jitna bhi ho". Ek function definition mein, `*args` matlab "mujhe pass ki gayi har extra unnamed cheez ko ek bundle mein ikattha karo" aur `**kwargs` matlab "har extra named cheez ko ek labelled bundle mein ikattha karo". Phir, jab ye runner agle ko handoff karta hai, handoff mein `*args` aur `**kwargs` likhna matlab "sab kuch un-bundle karo aur bilkul waise pass karo jaise maine liya". Ek wrapper jo `*args, **kwargs` leta hai aur inner function ko `*args, **kwargs` se call karta hai transparent hai. Star jaate waqt bundling karta hai aur aate waqt un-bundling; ye ek hi operator hai jo function boundary ke jis side par hai uske hisaab se ulte kaam karta hai.',
    },

    simple: `**Start broken.** A wrapper that hard-codes the arguments it forwards:

\`\`\`python
def timed(func):
    def wrapper(a, b):                 # assumes func takes exactly (a, b)
        start = time.time()
        result = func(a, b)
        print(f"{func.__name__} took {time.time() - start:.3f}s")
        return result
    return wrapper

@timed
def add(x, y):
    return x + y

@timed
def greet(name, greeting="hi", punct="!"):
    return f"{greeting} {name}{punct}"

add(2, 3)                              # OK
greet("Sam", punct="?")               # TypeError: wrapper() got an unexpected keyword argument 'punct'
\`\`\`

The wrapper only knows how to forward two positional arguments. Any function with a different signature — more args, keyword args, defaults — breaks it.

**The fix: \`*args, **kwargs\` in the signature and the call**

\`\`\`python
import time, functools

def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):      # collect ANYTHING
        start = time.time()
        result = func(*args, **kwargs) # spread it straight through
        print(f"{func.__name__} took {time.time() - start:.6f}s")
        return result
    return wrapper

@timed
def add(x, y):
    return x + y

@timed
def greet(name, greeting="hi", punct="!"):
    return f"{greeting} {name}{punct}"

print(add(2, 3))                       # 5
print(greet("Sam", punct="?"))        # hi Sam?
print(greet("Al", greeting="hey"))    # hey Al!
\`\`\`

\`\`\`
IN A DEFINITION (collecting):
    def f(*args, **kwargs):
        args    -> a TUPLE of the extra positional arguments   (empty tuple if none)
        kwargs  -> a DICT of the extra keyword arguments        (empty dict if none)

IN A CALL (spreading):
    f(*some_list)        -> pass each element as a separate positional argument
    f(**some_dict)       -> pass each key=value as a keyword argument
    f(*a, **b)           -> both at once

The names 'args' and 'kwargs' are convention, not syntax -- *x and **y also work.
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Ek wrapper jo forward kiye arguments hard-code karta hai:

\`\`\`python
def timed(func):
    def wrapper(a, b):                 # maanta hai func bilkul (a, b) leta hai
        start = time.time()
        result = func(a, b)
        print(f"{func.__name__} took {time.time() - start:.3f}s")
        return result
    return wrapper

@timed
def add(x, y):
    return x + y

@timed
def greet(name, greeting="hi", punct="!"):
    return f"{greeting} {name}{punct}"

add(2, 3)                              # OK
greet("Sam", punct="?")               # TypeError: wrapper() got an unexpected keyword argument 'punct'
\`\`\`

Wrapper sirf do positional arguments forward karna jaanta hai. Ek alag signature waala koi bhi function — zyaada args, keyword args, defaults — ise todta hai.

**Fix: signature aur call mein \`*args, **kwargs\`**

\`\`\`python
import time, functools

def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):      # KUCH BHI collect karo
        start = time.time()
        result = func(*args, **kwargs) # ise seedhe failaao
        print(f"{func.__name__} took {time.time() - start:.6f}s")
        return result
    return wrapper

@timed
def add(x, y):
    return x + y

@timed
def greet(name, greeting="hi", punct="!"):
    return f"{greeting} {name}{punct}"

print(add(2, 3))                       # 5
print(greet("Sam", punct="?"))        # hi Sam?
print(greet("Al", greeting="hey"))    # hey Al!
\`\`\`

\`\`\`
EK DEFINITION MEIN (collecting):
    def f(*args, **kwargs):
        args    -> extra positional arguments ka ek TUPLE   (koi nahi to empty tuple)
        kwargs  -> extra keyword arguments ka ek DICT        (koi nahi to empty dict)

EK CALL MEIN (spreading):
    f(*some_list)        -> har element ko ek alag positional argument ki tarah pass karo
    f(**some_dict)       -> har key=value ko ek keyword argument ki tarah pass karo
    f(*a, **b)           -> dono ek saath

'args' aur 'kwargs' naam convention hain, syntax nahi -- *x aur **y bhi kaam karte hain.
\`\`\``,

    content: `## Collecting: what \`args\` and \`kwargs\` actually contain

\`\`\`python
def show(*args, **kwargs):
    print("args:  ", args)         # always a tuple
    print("kwargs:", kwargs)       # always a dict

show(1, 2, 3, x=10, y=20)
# args:   (1, 2, 3)
# kwargs: {'x': 10, 'y': 20}

show()
# args:   ()
# kwargs: {}
\`\`\`

You can mix fixed parameters with \`*args\`/\`**kwargs\`:

\`\`\`python
def route(method, path, *middleware, name=None, **options):
    #        \\____/  \\__/  \\________/    \\_____/    \\_______/
    #        required     extra positional  kw-only   extra keyword

route("GET", "/users", auth, cache, name="user_list", cors=True)
# method="GET", path="/users", middleware=(auth, cache),
# name="user_list", options={"cors": True}
\`\`\`

Anything after \`*args\` (or a bare \`*\`) is keyword-only.

## Spreading: the mirror operation

\`\`\`python
def area(w, h): return w * h

dims = (3, 4)
area(*dims)                # area(3, 4)

box = {"w": 3, "h": 4}
area(**box)                # area(w=3, h=4)

# spread INTO a wider call:
base_opts = {"timeout": 30}
make_client("host", **base_opts, verify=True)   # timeout=30, verify=True

# spread in list/dict LITERALS (Module 2):
merged = [*list_a, *list_b]
combined = {**defaults, **overrides}
\`\`\`

## The transparent wrapper — the core forwarding pattern

\`\`\`python
def wrapper(*args, **kwargs):
    # ... do something before ...
    result = func(*args, **kwargs)     # forward EVERYTHING, unchanged
    # ... do something after ...
    return result
\`\`\`

This is the skeleton of every decorator (next lesson), every \`super().__init__(*args, **kwargs)\`, every proxy or adapter. It works no matter what \`func\`'s real signature is.

## Adding or overriding an argument while forwarding

\`\`\`python
def with_retry(func):
    def wrapper(*args, **kwargs):
        kwargs.setdefault("retries", 3)      # add a default if the caller didn't
        return func(*args, **kwargs)
    return wrapper

def force_json(func):
    def wrapper(*args, **kwargs):
        kwargs["format"] = "json"            # override whatever was passed
        return func(*args, **kwargs)
    return wrapper
\`\`\`

## Inspecting what was passed

\`\`\`python
def log_call(func):
    def wrapper(*args, **kwargs):
        arg_str = ", ".join(
            [repr(a) for a in args] +
            [f"{k}={v!r}" for k, v in kwargs.items()]
        )
        print(f"calling {func.__name__}({arg_str})")
        return func(*args, **kwargs)
    return wrapper
\`\`\`

## \`functools.wraps\` — do not lose the wrapped function's identity

\`\`\`python
def bare(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@bare
def compute(): "the docstring"

compute.__name__     # 'wrapper'   <-- wrong! and __doc__ is None
\`\`\`

Without \`@functools.wraps(func)\` on the inner \`wrapper\`, the decorated function reports itself as \`wrapper\` with no docstring — which breaks introspection, docs tools, and some frameworks. Always add \`@functools.wraps(func)\`. Full treatment in the decorators lesson.`,

    contentHi: `## Collecting: \`args\` aur \`kwargs\` mein asal mein kya hai

\`\`\`python
def show(*args, **kwargs):
    print("args:  ", args)         # hamesha ek tuple
    print("kwargs:", kwargs)       # hamesha ek dict

show(1, 2, 3, x=10, y=20)
# args:   (1, 2, 3)
# kwargs: {'x': 10, 'y': 20}

show()
# args:   ()
# kwargs: {}
\`\`\`

Aap fixed parameters ko \`*args\`/\`**kwargs\` ke saath mix kar sakte ho:

\`\`\`python
def route(method, path, *middleware, name=None, **options):
    #        \\____/  \\__/  \\________/    \\_____/    \\_______/
    #        required     extra positional  kw-only   extra keyword

route("GET", "/users", auth, cache, name="user_list", cors=True)
# method="GET", path="/users", middleware=(auth, cache),
# name="user_list", options={"cors": True}
\`\`\`

\`*args\` (ya ek nange \`*\`) ke baad kuch bhi keyword-only hai.

## Spreading: darpan operation

\`\`\`python
def area(w, h): return w * h

dims = (3, 4)
area(*dims)                # area(3, 4)

box = {"w": 3, "h": 4}
area(**box)                # area(w=3, h=4)

# ek chaude call MEIN spread karo:
base_opts = {"timeout": 30}
make_client("host", **base_opts, verify=True)   # timeout=30, verify=True

# list/dict LITERALS mein spread (Module 2):
merged = [*list_a, *list_b]
combined = {**defaults, **overrides}
\`\`\`

## Transparent wrapper — core forwarding pattern

\`\`\`python
def wrapper(*args, **kwargs):
    # ... pehle kuch karo ...
    result = func(*args, **kwargs)     # SAB KUCH forward karo, abadalte
    # ... baad mein kuch karo ...
    return result
\`\`\`

Ye har decorator (agla lesson), har \`super().__init__(*args, **kwargs)\`, har proxy ya adapter ka skeleton hai. Ye kaam karta hai chahe \`func\` ka asli signature kuch bhi ho.

## Forward karte waqt ek argument jodna ya override karna

\`\`\`python
def with_retry(func):
    def wrapper(*args, **kwargs):
        kwargs.setdefault("retries", 3)      # ek default jodo agar caller ne nahi kiya
        return func(*args, **kwargs)
    return wrapper

def force_json(func):
    def wrapper(*args, **kwargs):
        kwargs["format"] = "json"            # jo bhi pass hua use override karo
        return func(*args, **kwargs)
    return wrapper
\`\`\`

## Jo pass hua use inspect karna

\`\`\`python
def log_call(func):
    def wrapper(*args, **kwargs):
        arg_str = ", ".join(
            [repr(a) for a in args] +
            [f"{k}={v!r}" for k, v in kwargs.items()]
        )
        print(f"calling {func.__name__}({arg_str})")
        return func(*args, **kwargs)
    return wrapper
\`\`\`

## \`functools.wraps\` — wrapped function ki identity mat khoo

\`\`\`python
def bare(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@bare
def compute(): "the docstring"

compute.__name__     # 'wrapper'   <-- galat! aur __doc__ None hai
\`\`\`

Inner \`wrapper\` par \`@functools.wraps(func)\` ke bina, decorated function khud ko \`wrapper\` bataata hai bina docstring — jo introspection, docs tools, aur kuch frameworks ko todta hai. Hamesha \`@functools.wraps(func)\` jodo. Poora treatment decorators lesson mein.`,

    examples: [
      {
        title: 'Broken: fixed-arity wrapper breaks on a different signature',
        titleHi: 'Toota: fixed-arity wrapper ek alag signature par tootta hai',
        code: `def logged(func):
    def wrapper(x):
        print(f"-> {func.__name__}({x})")
        return func(x)
    return wrapper

@logged
def double(n):
    return n * 2

@logged
def clamp(n, lo, hi):
    return max(lo, min(n, hi))

print(double(5))
print(clamp(15, 0, 10))`,
        output: `-> double(5)
10
Traceback (most recent call last):
  File "example.py", line 16, in <module>
    print(clamp(15, 0, 10))
          ~~~~~^^^^^^^^^^^
TypeError: logged.<locals>.wrapper() takes 1 positional argument but 3 were given`,
        explain: '`wrapper(x)` can only accept one argument, so it works for `double(5)` but `clamp(15, 0, 10)` passes three and raises `TypeError`. A wrapper meant to work on any function must not assume the arity.',
        explainHi: '`wrapper(x)` sirf ek argument accept kar sakta hai, isliye `double(5)` ke liye kaam karta hai par `clamp(15, 0, 10)` teen pass karta hai aur `TypeError` deta hai. Kisi bhi function par kaam karne ke liye ek wrapper arity nahi maan sakta.',
      },
      {
        title: 'Fixed: *args/**kwargs collect and forward everything',
        titleHi: 'Theek: *args/**kwargs sab kuch collect aur forward karte hain',
        code: `import functools

def logged(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        shown = ", ".join([str(a) for a in args] + [f"{k}={v}" for k, v in kwargs.items()])
        print(f"-> {func.__name__}({shown})")
        return func(*args, **kwargs)
    return wrapper

@logged
def double(n):
    return n * 2

@logged
def clamp(n, lo, hi):
    return max(lo, min(n, hi))

@logged
def greet(name, greeting="hi"):
    return f"{greeting} {name}"

print(double(5))
print(clamp(15, 0, 10))
print(greet("Sam", greeting="hey"))
print(double.__name__)`,
        output: `-> double(5)
10
-> clamp(15, 0, 10)
10
-> greet(Sam, greeting=hey)
hey Sam
double`,
        explain: '`wrapper(*args, **kwargs)` accepts any combination; `func(*args, **kwargs)` forwards it unchanged. The same wrapper now handles a 1-arg function, a 3-arg function, and a function with a keyword default. `@functools.wraps(func)` keeps `double.__name__` as `"double"` instead of `"wrapper"`.',
        explainHi: '`wrapper(*args, **kwargs)` koi bhi combination accept karta hai; `func(*args, **kwargs)` ise abadalte forward karta hai. Wahi wrapper ab ek 1-arg function, ek 3-arg function, aur ek keyword default waale function ko handle karta hai. `@functools.wraps(func)` `double.__name__` ko `"wrapper"` ke bajaye `"double"` rakhta hai.',
      },
      {
        title: 'Collecting into named params, and spreading into calls',
        titleHi: 'Named params mein collect, aur calls mein spread',
        code: `def register(name, *aliases, category="misc", **meta):
    print(f"name={name}")
    print(f"aliases={aliases}")
    print(f"category={category}")
    print(f"meta={meta}")

register("delete", "rm", "del", category="fs", danger=True, undo=False)

print("---")

def connect(host, port, user, password):
    return f"{user}@{host}:{port}"

cfg = {"host": "db", "port": 5432, "user": "admin", "password": "x"}
print(connect(**cfg))

parts = ["db", 5432]
creds = {"user": "admin", "password": "x"}
print(connect(*parts, **creds))`,
        output: `name=delete
aliases=('rm', 'del')
category=fs
meta={'danger': True, 'undo': False}
---
admin@db:5432
admin@db:5432`,
        explain: 'In `register`, `name` is fixed, `*aliases` collects extra positionals into a tuple, `category` is keyword-only (it is after `*aliases`), and `**meta` collects extra keywords into a dict. In `connect`, `**cfg` spreads a dict into keyword arguments; `*parts, **creds` mixes a positional spread with a keyword spread.',
        explainHi: '`register` mein, `name` fixed hai, `*aliases` extra positionals ko ek tuple mein collect karta hai, `category` keyword-only hai (ye `*aliases` ke baad hai), aur `**meta` extra keywords ko ek dict mein collect karta hai. `connect` mein, `**cfg` ek dict ko keyword arguments mein spread karta hai; `*parts, **creds` ek positional spread ko ek keyword spread ke saath mix karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `def wrapper(args, kwargs):        # no stars -- these are just two normal params
    return func(args, kwargs)`,
        right: `def wrapper(*args, **kwargs):     # the stars make them collect
    return func(*args, **kwargs)`,
        why: 'Without the `*` and `**`, `args` and `kwargs` are ordinary parameters — the function now takes exactly two arguments, both positional. The stars are what turn them into "collect the rest". You need the stars in BOTH the definition (to collect) and the forwarding call (to spread).',
        whyHi: '`*` aur `**` ke bina, `args` aur `kwargs` saamaanya parameters hain — function ab bilkul do arguments leta hai, dono positional. Stars unhe "baaki collect karo" mein badalte hain. Aapko stars DONO definition mein chahiye (collect karne ko) aur forwarding call mein (spread karne ko).',
      },
      {
        wrong: `func(args, kwargs)               # passes the tuple and dict as TWO arguments
func(*args, kwargs)              # spreads args, but passes kwargs as a positional dict`,
        right: `func(*args, **kwargs)            # spreads both correctly`,
        why: 'Forwarding requires `*args` (spread the tuple into positionals) AND `**kwargs` (spread the dict into keywords). `func(args, kwargs)` passes the container objects themselves; `func(*args, kwargs)` forgets the second star and passes the dict as one more positional argument.',
        whyHi: 'Forwarding ko `*args` (tuple ko positionals mein spread) AUR `**kwargs` (dict ko keywords mein spread) chahiye. `func(args, kwargs)` container objects khud pass karta hai; `func(*args, kwargs)` doosra star bhoolta hai aur dict ko ek aur positional argument ki tarah pass karta hai.',
      },
      {
        wrong: `def f(**kwargs, *args):          # SyntaxError -- wrong order`,
        right: `def f(*args, **kwargs):          # *args before **kwargs, always`,
        why: 'The parameter order is fixed: positional-only, normal, `*args`, keyword-only, `**kwargs`. `**kwargs` must be last. Putting it before `*args` is a `SyntaxError`. If you only need one, `*args` alone or `**kwargs` alone is fine.',
        whyHi: 'Parameter order fixed hai: positional-only, normal, `*args`, keyword-only, `**kwargs`. `**kwargs` aakhri hona chahiye. Ise `*args` se pehle rakhna ek `SyntaxError` hai. Agar aapko sirf ek chahiye, akela `*args` ya akela `**kwargs` theek hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every Django/DRF class method that overrides a base one** forwards with `super().method(*args, **kwargs)` — `def get_queryset(self, *args, **kwargs): qs = super().get_queryset(*args, **kwargs); return qs.filter(...)`. Hard-coding the base method\'s parameters breaks when Django changes its signature.',
        hi: '**Har Django/DRF class method jo ek base ko override karta hai** `super().method(*args, **kwargs)` se forward karta hai. Base method ke parameters hard-code karna tootta hai jab Django apna signature badalta hai.',
      },
      {
        en: '**`Model.objects.filter(**query_dict)`** builds a queryset from a dict assembled at runtime — a search endpoint collects allowed query params into `filters` and spreads them: `qs.filter(**filters)`. Same with `Model.objects.create(**validated_data)` in a serializer.',
        hi: '**`Model.objects.filter(**query_dict)`** runtime par assemble kiye ek dict se ek queryset banaata hai — ek search endpoint allowed query params ko `filters` mein collect karta hai aur unhe spread karta hai: `qs.filter(**filters)`.',
      },
      {
        en: '**Every decorator you write or read** — `@login_required`, `@cache_page(60)`, `@action(detail=True)`, `@lru_cache` — has an inner `def wrapper(*args, **kwargs): ... return func(*args, **kwargs)`. Understanding this pattern is understanding decorators.',
        hi: '**Har decorator jo aap likhte ya padhte ho** — `@login_required`, `@cache_page(60)`, `@action(detail=True)`, `@lru_cache` — mein ek inner `def wrapper(*args, **kwargs): ... return func(*args, **kwargs)` hai. Is pattern ko samajhna decorators ko samajhna hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What do `*args` and `**kwargs` mean in a function definition versus in a function call?',
        qHi: 'Ek function definition mein versus ek function call mein `*args` aur `**kwargs` ka kya matlab hai?',
        a: 'The star and double-star do opposite things depending on which side of the function boundary they appear on. In a function definition, a parameter written with a single star, conventionally named args, collects every positional argument that was not captured by an earlier named parameter into a tuple. If none are left over, it is an empty tuple. A parameter written with a double star, conventionally kwargs, collects every keyword argument that did not match a named parameter into a dictionary, again possibly empty. Together they let a function accept an arbitrary number of positional and keyword arguments. The names are just convention; a single star followed by any name and a double star followed by any name work identically. In a function call, the same operators do the reverse: they unpack. A single star before an iterable in a call spreads that iterable\'s elements into separate positional arguments, so calling a two-parameter function with a star before a two-element list passes the two elements as the two arguments. A double star before a mapping spreads its key-value pairs into keyword arguments. This symmetry is what makes transparent forwarding possible. A wrapper function is defined to take star-args and double-star-kwargs, so it accepts anything, and inside it calls the wrapped function with star-args and double-star-kwargs, so it passes everything straight through unchanged. The wrapper does not need to know or care what the wrapped function\'s real signature is, and it keeps working if that signature changes. This is the core mechanism behind every decorator, every override that calls super, and every proxy or adapter. Two rules to remember: in a definition, star-args must come before double-star-kwargs, and anything after star-args is keyword-only; and forwarding requires the stars on both ends — collecting into args and kwargs, then spreading with star and double-star in the inner call.',
        aHi: 'Star aur double-star ulte kaam karte hain is hisaab se ki wo function boundary ke kis side par dikhte hain. Ek function definition mein, ek single star se likha parameter, convention se args naam ka, har positional argument jo ek pehle named parameter dwara capture nahi hua use ek tuple mein collect karta hai. Agar koi nahi bacha, ye ek empty tuple hai. Ek double star se likha parameter, convention se kwargs, har keyword argument jo ek named parameter se match nahi hua use ek dictionary mein collect karta hai. Milkar wo ek function ko positional aur keyword arguments ki ek mann-maani tadaad accept karne dete hain. Ek function call mein, wahi operators ulta karte hain: wo unpack karte hain. Ek call mein ek iterable se pehle ek single star us iterable ke elements ko alag positional arguments mein spread karta hai. Ek mapping se pehle ek double star iske key-value pairs ko keyword arguments mein spread karta hai. Ye symmetry transparent forwarding ko mumkin banaati hai. Ek wrapper function star-args aur double-star-kwargs lene ko define kiya jaata hai, isliye ye kuch bhi accept karta hai, aur andar ye wrapped function ko star-args aur double-star-kwargs se call karta hai.',
      },
      {
        q: 'Why does `functools.wraps` matter when writing a wrapper, and what breaks without it?',
        qHi: 'Ek wrapper likhte waqt `functools.wraps` kyun maayne rakhta hai, aur iske bina kya tootta hai?',
        a: 'When you write a decorator, you replace the original function with your inner wrapper function. From that point on, the name the caller uses refers to the wrapper, not the original. The problem is that the wrapper carries the wrapper\'s own metadata: its double-underscore name attribute is the string wrapper, its double-underscore doc is whatever docstring the wrapper has which is usually none, its double-underscore module and qualified name point at the decorator\'s location, and its signature as reported by the inspect module is star-args double-star-kwargs rather than the original\'s real parameters. Anything that introspects the function then sees the wrong thing. Documentation generators produce a page for a function called wrapper with no description. A framework that dispatches based on the function name, or that reads type annotations, or that builds an OpenAPI schema from the signature, gets nonsense. Debuggers and tracebacks show wrapper instead of the real name. Test frameworks that identify tests by name get confused. functools dot wraps is a decorator you apply to your inner wrapper, passing it the original function, and it copies the relevant metadata attributes from the original onto the wrapper, and also sets a wrapped attribute pointing back at the original so tools can unwrap if they need to. With it, the decorated function looks and introspects exactly like the original while still running your wrapper logic. The rule is simple: every time you write def wrapper inside a decorator, put at-functools-dot-wraps of func on the line above it. It is easy to forget because everything appears to work in casual use — the breakage only shows up when something inspects the function, which can be much later and in a confusing place.',
        aHi: 'Jab aap ek decorator likhte ho, aap original function ko apne inner wrapper function se badalte ho. Us bindu se, jo naam caller istemal karta hai wo wrapper ko refer karta hai, original ko nahi. Samasya ye hai ki wrapper wrapper ka apna metadata rakhta hai: iska double-underscore name attribute string wrapper hai, iska double-underscore doc jo bhi docstring wrapper ke paas hai jo aam taur par none hai, aur inspect module dwara report kiya iska signature original ke asli parameters ke bajaye star-args double-star-kwargs hai. Jo bhi function ko introspect karta hai wo phir galat cheez dekhta hai. Documentation generators wrapper naam ke ek function ke liye ek page banate hain bina description. Ek framework jo function name par dispatch karta hai, ya jo type annotations padhta hai, ya jo signature se ek OpenAPI schema banaata hai, use bakwaas milta hai. functools dot wraps ek decorator hai jise aap apne inner wrapper par lagaate ho, ise original function pass karte hue, aur ye relevant metadata attributes original se wrapper par copy karta hai. Niyam saral hai: har baar jab aap ek decorator ke andar def wrapper likhte ho, uske upar ki line par at-functools-dot-wraps of func rakho.',
      },
    ],

    exercises: [
      {
        task: 'Write `trace(func)` — a decorator whose wrapper takes `*args, **kwargs`, prints `f"{func.__name__} <- {args} {kwargs}"`, calls `func`, prints `f"{func.__name__} -> {result}"`, and returns the result. Apply it to a 1-arg and a 3-arg function and confirm both work. Add `@functools.wraps` and check `__name__`.',
        taskHi: '`trace(func)` likho — ek decorator jiska wrapper `*args, **kwargs` leta hai, `f"{func.__name__} <- {args} {kwargs}"` print karta hai, `func` call karta hai, `f"{func.__name__} -> {result}"` print karta hai, aur result return karta hai. Ise ek 1-arg aur ek 3-arg function par lagao aur confirm karo dono kaam karte hain. `@functools.wraps` jodo aur `__name__` check karo.',
        hint: 'The wrapper is `def wrapper(*args, **kwargs): print(...); r = func(*args, **kwargs); print(...); return r`. Without `@functools.wraps(func)`, the decorated function\'s `__name__` is `"wrapper"`.',
        hintHi: 'Wrapper `def wrapper(*args, **kwargs): print(...); r = func(*args, **kwargs); print(...); return r` hai. `@functools.wraps(func)` ke bina, decorated function ka `__name__` `"wrapper"` hai.',
      },
      {
        task: 'Write `call_with(func, config)` where `config` is a dict like `{"args": [1, 2], "kwargs": {"verbose": True}}`. Call `func` with those args/kwargs spread. Test with `def f(a, b, verbose=False): return (a + b, verbose)` and `config = {"args": [3, 4], "kwargs": {"verbose": True}}` -> `(7, True)`.',
        taskHi: '`call_with(func, config)` likho jahaan `config` `{"args": [1, 2], "kwargs": {"verbose": True}}` jaisa ek dict hai. `func` ko un args/kwargs ke saath spread karke call karo. `def f(a, b, verbose=False): return (a + b, verbose)` aur `config = {"args": [3, 4], "kwargs": {"verbose": True}}` -> `(7, True)` ke saath test karo.',
        hint: '`return func(*config.get("args", []), **config.get("kwargs", {}))`. The `*` spreads the args list into positionals; the `**` spreads the kwargs dict into keyword arguments.',
        hintHi: '`return func(*config.get("args", []), **config.get("kwargs", {}))`. `*` args list ko positionals mein spread karta hai; `**` kwargs dict ko keyword arguments mein spread karta hai.',
      },
      {
        task: 'Write `partial_kwargs(func, **preset)` that returns a new function which calls `func` with `preset` merged into whatever kwargs the caller passes (caller\'s kwargs win). Test: `greet2 = partial_kwargs(greet, greeting="hey")`, then `greet2("Al")` uses "hey" and `greet2("Bo", greeting="yo")` uses "yo".',
        taskHi: '`partial_kwargs(func, **preset)` likho jo ek naya function lautaata hai jo `func` ko `preset` ke saath call karta hai jo bhi kwargs caller pass karta hai usmein merge karke (caller ke kwargs jeetate hain). Test: `greet2 = partial_kwargs(greet, greeting="hey")`, phir `greet2("Al")` "hey" istemal karta hai aur `greet2("Bo", greeting="yo")` "yo".',
        hint: '`def inner(*args, **kwargs): return func(*args, **{**preset, **kwargs})`. Because `kwargs` comes after `preset` in the merge, the caller\'s values override the presets. This is a hand-rolled `functools.partial` for keywords.',
        hintHi: '`def inner(*args, **kwargs): return func(*args, **{**preset, **kwargs})`. Kyunki merge mein `kwargs` `preset` ke baad aata hai, caller ki values presets ko override karti hain. Ye keywords ke liye ek haath-se-bana `functools.partial` hai.',
      },
    ],

    keyTakeaways: [
      'In a DEFINITION: `*args` collects extra positional arguments into a TUPLE; `**kwargs` collects extra keyword arguments into a DICT. Both are empty if nothing extra is passed.',
      'In a CALL: `f(*seq)` spreads a sequence into positional arguments; `f(**dict)` spreads a dict into keyword arguments. Same operators, opposite direction.',
      'The transparent-forwarding pattern: `def wrapper(*args, **kwargs): return func(*args, **kwargs)` — works for ANY function signature, now and after it changes.',
      'You need the stars in BOTH places: `def wrapper(*args, **kwargs)` (to collect) AND `func(*args, **kwargs)` (to spread). Missing a star passes the container object itself.',
      'Parameter order is fixed: `pos_only, /, normal, *args, kw_only, **kwargs`. `**kwargs` is always last; anything after `*args` is keyword-only.',
      'Modify while forwarding: `kwargs.setdefault(k, v)` adds a default the caller omitted; `kwargs[k] = v` overrides whatever was passed.',
      'Always put `@functools.wraps(func)` on the inner wrapper — without it the decorated function reports its `__name__` as `"wrapper"`, loses its docstring, and breaks introspection.',
      '`args`/`kwargs` are convention, not keywords — `*x`/`**y` work identically.',
    ],
    keyTakeawaysHi: [
      'Ek DEFINITION mein: `*args` extra positional arguments ko ek TUPLE mein collect karta hai; `**kwargs` extra keyword arguments ko ek DICT mein. Dono empty hain agar kuch extra pass nahi hua.',
      'Ek CALL mein: `f(*seq)` ek sequence ko positional arguments mein spread karta hai; `f(**dict)` ek dict ko keyword arguments mein. Wahi operators, ulti disha.',
      'Transparent-forwarding pattern: `def wrapper(*args, **kwargs): return func(*args, **kwargs)` — KISI bhi function signature ke liye kaam karta hai, ab aur badalne ke baad.',
      'Aapko stars DONO jagah chahiye: `def wrapper(*args, **kwargs)` (collect karne ko) AUR `func(*args, **kwargs)` (spread karne ko). Ek star chhoodna container object khud pass karta hai.',
      'Parameter order fixed hai: `pos_only, /, normal, *args, kw_only, **kwargs`. `**kwargs` hamesha aakhri; `*args` ke baad kuch bhi keyword-only.',
      'Forward karte waqt modify karo: `kwargs.setdefault(k, v)` ek default jodta hai jo caller ne chhoda; `kwargs[k] = v` jo pass hua use override karta hai.',
      'Hamesha inner wrapper par `@functools.wraps(func)` rakho — iske bina decorated function apna `__name__` `"wrapper"` bataata hai, apna docstring khota hai, aur introspection todta hai.',
      '`args`/`kwargs` convention hain, keywords nahi — `*x`/`**y` samaan kaam karte hain.',
    ],
  },

  {
    slug: 'py-scope-legb-global-nonlocal-closures',
    title: 'Scope: LEGB, UnboundLocalError, global, nonlocal, and Closures',
    titleHi: 'Scope: LEGB, UnboundLocalError, global, nonlocal, Aur Closures',
    description: 'Writing `count += 1` inside a function where `count` is defined outside it, and getting `UnboundLocalError: cannot access local variable "count"` — not the "undefined variable" error you would expect, but a claim that a name you can plainly see is somehow local. The moment a function assigns to a name anywhere in its body, Python treats that name as local for the whole function, so the read on the right of `+=` finds nothing.',
    descriptionHi: 'Ek function ke andar `count += 1` likhna jahaan `count` iske baahar define hai, aur `UnboundLocalError: cannot access local variable "count"` paana — wo "undefined variable" error nahi jiski aap ummeed karenge, balki ek daawa ki ek naam jise aap saaf dekh sakte ho kisi tarah local hai. Jis pal ek function apne body mein kahin ek naam ko assign karta hai, Python us naam ko poore function ke liye local maanta hai, isliye `+=` ke right par read kuch nahi paata.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**A shared office noticeboard and a personal desk, and a rule about what "writing your name down" commits you to.** There is a company noticeboard everyone can read. There is your own desk. The rule for looking something up: check your desk first, then the shelf just outside your office, then the company noticeboard, then the building directory. That four-level search — desk, nearby shelf, company board, directory — is how Python resolves a name: Local, Enclosing, Global, Built-in. Reading works fine at any level. The twist is about writing. Python decides, before your function runs, whether each name is a desk item or something you are only reading from further out — and it decides "desk item" for any name your function assigns to *anywhere* in its body. So if your function has a line that writes to `count`, Python has already classified `count` as a desk item for the whole function, and an earlier line that tries to read `count` before you have put anything on your desk fails — not because `count` does not exist on the company board, but because Python is no longer looking there for this name. To say "no, I mean the one on the company board, and I want to change *that*", you declare `global count`. To mean "the one on the shelf just outside, in the enclosing function", you declare `nonlocal count`.',
      hi: '**Ek shared office noticeboard aur ek personal desk, aur ek niyam ki "apna naam likhna" aapko kis cheez ke liye pratibaddh karta hai.** Ek company noticeboard hai jise sab padh sakte hain. Aapka apna desk hai. Kuch dhoondhne ka niyam: pehle apna desk check karo, phir apne office ke bilkul baahar shelf, phir company noticeboard, phir building directory. Wo chaar-level search — desk, nazdeeki shelf, company board, directory — aise Python ek naam resolve karta hai: Local, Enclosing, Global, Built-in. Reading kisi bhi level par theek kaam karti hai. Twist writing ke baare mein hai. Python tay karta hai, aapke function ke chalne se pehle, ki har naam ek desk item hai ya kuch jise aap sirf aage se padh rahe ho — aur ye "desk item" tay karta hai kisi bhi naam ke liye jise aapka function apne body mein *kahin* assign karta hai. Toh agar aapke function mein ek line hai jo `count` ko likhti hai, Python ne pehle hi `count` ko poore function ke liye ek desk item classify kiya hai, aur ek pehle ki line jo `count` padhne ki koshish karti hai isse pehle ki aapne desk par kuch rakha fail hoti hai. "Nahi, main company board wale ka matlab rakhta hoon, aur main *use* badalna chahta hoon" kehne ko, aap `global count` declare karte ho. "Bilkul baahar shelf wale, enclosing function mein" matlab ke liye, aap `nonlocal count` declare karte ho.',
    },

    simple: `**Start broken.** Modifying an outer variable without declaring the intent:

\`\`\`python
count = 0

def increment():
    count += 1          # UnboundLocalError: cannot access local variable 'count'
    return count

increment()
\`\`\`

Python sees \`count += 1\` (which is \`count = count + 1\`), decides \`count\` is a local variable for the whole function, then tries to evaluate \`count + 1\` — and the local \`count\` has no value yet.

\`\`\`python
total = 0

def add_all(nums):
    for n in nums:
        total += n     # same error -- assignment anywhere makes 'total' local
    return total
\`\`\`

**The fix: declare \`global\` / \`nonlocal\`, or (better) return a value**

\`\`\`python
# option A: declare the intent
count = 0
def increment():
    global count
    count += 1
    return count

# option B (usually better): don't mutate outer state -- take it in, return it out
def increment(count):
    return count + 1

# nonlocal: modify a variable in the ENCLOSING function (not global)
def make_counter():
    count = 0
    def tick():
        nonlocal count
        count += 1
        return count
    return tick

c = make_counter()
print(c(), c(), c())      # 1 2 3   -- 'count' lives in the closure
\`\`\`

\`\`\`
LEGB -- the name lookup order (for READING a name):
    Local       names assigned in this function
    Enclosing   names in an outer function that wraps this one
    Global      names at module top level
    Built-in    print, len, range, ... (the 'builtins' module)

THE RULE: if a function assigns to a name ANYWHERE in its body, that name is
LOCAL for the entire function -- reads of it before the assignment fail with
UnboundLocalError.

    global x     -> "x refers to the module-level x; I may rebind it"
    nonlocal x   -> "x refers to the nearest enclosing function's x; I may rebind it"
    (no declaration) -> reads look outward via LEGB; the first ASSIGNMENT makes it local
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Intent declare kiye bina ek outer variable modify karna:

\`\`\`python
count = 0

def increment():
    count += 1          # UnboundLocalError: cannot access local variable 'count'
    return count

increment()
\`\`\`

Python \`count += 1\` dekhta hai (jo \`count = count + 1\` hai), tay karta hai \`count\` poore function ke liye ek local variable hai, phir \`count + 1\` evaluate karne ki koshish karta hai — aur local \`count\` ki abhi koi value nahi.

\`\`\`python
total = 0

def add_all(nums):
    for n in nums:
        total += n     # wahi error -- kahin bhi assignment 'total' ko local banaata hai
    return total
\`\`\`

**Fix: \`global\` / \`nonlocal\` declare karo, ya (behtar) ek value return karo**

\`\`\`python
# option A: intent declare karo
count = 0
def increment():
    global count
    count += 1
    return count

# option B (aam taur par behtar): outer state mutate mat karo -- ise andar lo, baahar return karo
def increment(count):
    return count + 1

# nonlocal: ENCLOSING function mein ek variable modify karo (global nahi)
def make_counter():
    count = 0
    def tick():
        nonlocal count
        count += 1
        return count
    return tick

c = make_counter()
print(c(), c(), c())      # 1 2 3   -- 'count' closure mein rehta hai
\`\`\`

\`\`\`
LEGB -- naam lookup order (ek naam PADHNE ke liye):
    Local       is function mein assign kiye naam
    Enclosing   ek outer function mein naam jo ise wrap karta hai
    Global      module top level par naam
    Built-in    print, len, range, ... ('builtins' module)

NIYAM: agar ek function apne body mein KAHIN ek naam assign karta hai, wo naam
poore function ke liye LOCAL hai -- assignment se pehle iske reads
UnboundLocalError se fail hote hain.

    global x     -> "x module-level x ko refer karta hai; main ise rebind kar sakta hoon"
    nonlocal x   -> "x nazdeek enclosing function ke x ko refer karta hai; main ise rebind kar sakta hoon"
    (koi declaration nahi) -> reads LEGB se baahar dekhte hain; pehla ASSIGNMENT ise local banaata hai
\`\`\``,

    content: `## The rule, made concrete

\`\`\`python
x = "global"

def f():
    print(x)        # UnboundLocalError -- because of the line BELOW
    x = "local"     # this assignment makes x local for the WHOLE function

def g():
    print(x)        # "global" -- g never assigns x, so x is looked up outward
\`\`\`

Python compiles the function body first and notes every name that is assigned. Those become local slots. A read of a local slot before it has been written is the \`UnboundLocalError\`. This is why the error mentions "local variable" for a name you defined globally — Python is telling you it classified the name as local.

## \`global\` and \`nonlocal\`

\`\`\`python
counter = 0

def bump():
    global counter        # "I mean the module-level 'counter', and I will rebind it"
    counter += 1

def outer():
    total = 0
    def inner():
        nonlocal total    # "I mean 'total' in the enclosing 'outer', not a new local"
        total += 1
    inner(); inner()
    return total          # 2
\`\`\`

You only need \`global\`/\`nonlocal\` to **rebind** (assign to) an outer name. Reading it, or mutating an object it points at (\`shared_list.append(x)\`, \`shared_dict[k] = v\`), needs no declaration — those are not assignments to the name.

\`\`\`python
config = {}

def setup():
    config["ready"] = True    # NO 'global' needed -- mutating the dict, not rebinding 'config'
\`\`\`

## Closures: a function that remembers its enclosing scope

\`\`\`python
def multiplier(factor):
    def multiply(n):
        return n * factor     # 'factor' is captured from the enclosing scope
    return multiply

double = multiplier(2)
triple = multiplier(3)
double(10)     # 20
triple(10)     # 30

# each returned function keeps its own 'factor':
double.__closure__[0].cell_contents    # 2
\`\`\`

The inner function keeps a live reference to the variables it uses from the enclosing function, even after that function has returned. This is a closure, and it is how decorators, \`functools.partial\`, and callback factories work.

## The classic late-binding bug

\`\`\`python
# WRONG -- all three functions print 3
funcs = []
for i in range(3):
    funcs.append(lambda: i)     # each lambda closes over the VARIABLE i, not its value
print([f() for f in funcs])     # [2, 2, 2]   -- i is 2 when they finally run

# FIX 1 -- bind i as a default argument (evaluated at def time):
funcs = [lambda i=i: i for i in range(3)]
print([f() for f in funcs])     # [0, 1, 2]

# FIX 2 -- a factory that takes i by value:
def make(i):
    return lambda: i
funcs = [make(i) for i in range(3)]
print([f() for f in funcs])     # [0, 1, 2]
\`\`\`

A closure captures the *variable*, not a snapshot of its value. By the time the deferred functions run, the loop has finished and \`i\` holds its last value. The fix is to bind the current value into each function's own scope — a default argument or a factory call.

## Scope facts a Python dev should know

\`\`\`
- Functions create scope. \`if\`, \`for\`, \`while\`, \`with\`, \`try\` do NOT --
  a name assigned inside a loop is visible after the loop.
- Comprehensions DO create their own scope -- \`[i for i in range(3)]\` does not
  leak \`i\` (unlike a plain for loop).
- There is no block scope and no \`let\`. \`del x\` removes a name from its scope.
- Class bodies are a scope, but methods do NOT see class-body names directly --
  they must use \`self.x\` or \`ClassName.x\`.
\`\`\``,

    contentHi: `## Niyam, thos banaaya

\`\`\`python
x = "global"

def f():
    print(x)        # UnboundLocalError -- NEECHE ki line ki wajah se
    x = "local"     # ye assignment x ko POORE function ke liye local banaata hai

def g():
    print(x)        # "global" -- g kabhi x assign nahi karta, isliye x baahar lookup hota hai
\`\`\`

Python function body ko pehle compile karta hai aur har assign kiye naam ko note karta hai. Wo local slots ban jaate hain. Ek local slot ka read isse pehle ki wo likha gaya \`UnboundLocalError\` hai. Yahi wajah hai ki error ek aise naam ke liye "local variable" ka zikr karta hai jo aapne globally define kiya — Python aapko bata raha hai ki usne naam ko local classify kiya.

## \`global\` aur \`nonlocal\`

\`\`\`python
counter = 0

def bump():
    global counter        # "main module-level 'counter' ka matlab rakhta hoon, aur ise rebind karoonga"
    counter += 1

def outer():
    total = 0
    def inner():
        nonlocal total    # "main enclosing 'outer' mein 'total' ka matlab rakhta hoon, ek naya local nahi"
        total += 1
    inner(); inner()
    return total          # 2
\`\`\`

Aapko \`global\`/\`nonlocal\` sirf ek outer naam ko **rebind** (assign) karne ko chahiye. Ise padhna, ya jis object par ye point karta hai use mutate karna (\`shared_list.append(x)\`, \`shared_dict[k] = v\`), koi declaration nahi chahiye — wo naam ke assignments nahi hain.

\`\`\`python
config = {}

def setup():
    config["ready"] = True    # KOI 'global' nahi chahiye -- dict mutate kar rahe, 'config' rebind nahi
\`\`\`

## Closures: ek function jo apna enclosing scope yaad rakhta hai

\`\`\`python
def multiplier(factor):
    def multiply(n):
        return n * factor     # 'factor' enclosing scope se capture hota hai
    return multiply

double = multiplier(2)
triple = multiplier(3)
double(10)     # 20
triple(10)     # 30

# har returned function apna 'factor' rakhta hai:
double.__closure__[0].cell_contents    # 2
\`\`\`

Inner function un variables ka ek live reference rakhta hai jo ye enclosing function se istemal karta hai, us function ke return hone ke baad bhi. Ye ek closure hai, aur aise decorators, \`functools.partial\`, aur callback factories kaam karte hain.

## Classic late-binding bug

\`\`\`python
# GALAT -- teenon functions 3 print karte hain... asal mein 2
funcs = []
for i in range(3):
    funcs.append(lambda: i)     # har lambda VARIABLE i par close karta hai, iski value par nahi
print([f() for f in funcs])     # [2, 2, 2]   -- jab wo aakhirkaar chalte hain i 2 hai

# FIX 1 -- i ko ek default argument ki tarah bind karo (def time par evaluate):
funcs = [lambda i=i: i for i in range(3)]
print([f() for f in funcs])     # [0, 1, 2]

# FIX 2 -- ek factory jo i ko value se leta hai:
def make(i):
    return lambda: i
funcs = [make(i) for i in range(3)]
print([f() for f in funcs])     # [0, 1, 2]
\`\`\`

Ek closure *variable* capture karta hai, iski value ka snapshot nahi. Jab tak deferred functions chalte hain, loop khatam ho chuka hai aur \`i\` apni aakhri value rakhta hai. Fix current value ko har function ke apne scope mein bind karna hai — ek default argument ya ek factory call.

## Scope tathya jo ek Python dev ko jaanne chahiye

\`\`\`
- Functions scope banaate hain. \`if\`, \`for\`, \`while\`, \`with\`, \`try\` NAHI --
  ek loop ke andar assign kiya naam loop ke baad dikhta hai.
- Comprehensions apna scope banaate HAIN -- \`[i for i in range(3)]\` \`i\` leak
  nahi karta (ek plain for loop ke ulte).
- Koi block scope nahi aur koi \`let\` nahi. \`del x\` ek naam ko iske scope se hataata hai.
- Class bodies ek scope hain, par methods class-body naam SEEDHE nahi dekhte --
  unhe \`self.x\` ya \`ClassName.x\` istemal karna hoga.
\`\`\``,

    examples: [
      {
        title: 'Broken: += on an outer name; the surprising error',
        titleHi: 'Toota: ek outer naam par +=; chaukaane waala error',
        code: `hits = 0

def record_hit():
    hits += 1
    return hits

try:
    record_hit()
except UnboundLocalError as e:
    print("error:", e)

# and a read-before-assign inside the same function:
name = "global"
def show():
    print(name)
    name = "local"

try:
    show()
except UnboundLocalError as e:
    print("error:", e)`,
        output: `error: cannot access local variable 'hits' where it is not associated with a value
error: cannot access local variable 'name' where it is not associated with a value`,
        explain: '`hits += 1` is an assignment, so Python marks `hits` local for all of `record_hit` — then `hits + 1` reads a local that was never set. In `show`, the `name = "local"` line (even though it is *after* the print) makes `name` local for the whole function, so `print(name)` fails.',
        explainHi: '`hits += 1` ek assignment hai, isliye Python `hits` ko poore `record_hit` ke liye local mark karta hai — phir `hits + 1` ek local padhta hai jo kabhi set nahi hua. `show` mein, `name = "local"` line (haalaanki ye print ke *baad* hai) `name` ko poore function ke liye local banaati hai, isliye `print(name)` fail hota hai.',
      },
      {
        title: 'Fixed: global, nonlocal, and a closure counter',
        titleHi: 'Theek: global, nonlocal, aur ek closure counter',
        code: `hits = 0
def record_hit():
    global hits
    hits += 1
    return hits

print(record_hit(), record_hit(), record_hit())
print("module hits:", hits)

def make_counter(start=0):
    count = start
    def tick():
        nonlocal count
        count += 1
        return count
    def reset():
        nonlocal count
        count = start
    tick.reset = reset
    return tick

c = make_counter(10)
print(c(), c(), c())
c.reset()
print(c())

# reading/mutating an outer object needs NO declaration:
log = []
def note(msg):
    log.append(msg)         # mutating the list, not rebinding 'log'
note("started"); note("done")
print(log)`,
        output: `1 2 3
module hits: 3
11 12 13
11
['started', 'done']`,
        explain: '`global hits` lets `record_hit` rebind the module-level `hits`. `make_counter` returns `tick`, a closure over `count`; `nonlocal count` lets `tick` and `reset` rebind the enclosing `count`. `note` appends to `log` with no `global` — appending mutates the existing list object, it does not rebind the name.',
        explainHi: '`global hits` `record_hit` ko module-level `hits` rebind karne deta hai. `make_counter` `tick` lautaata hai, `count` par ek closure; `nonlocal count` `tick` aur `reset` ko enclosing `count` rebind karne deta hai. `note` bina `global` ke `log` mein append karta hai — appending maujooda list object ko mutate karta hai, ye naam rebind nahi karta.',
      },
      {
        title: 'The late-binding loop bug and two fixes',
        titleHi: 'Late-binding loop bug aur do fixes',
        code: `# BUG: every function closes over the same 'i'
buggy = []
for i in range(4):
    buggy.append(lambda: i * 10)
print("buggy:", [f() for f in buggy])

# FIX 1: default argument binds the current value
fixed1 = []
for i in range(4):
    fixed1.append(lambda i=i: i * 10)
print("fix1: ", [f() for f in fixed1])

# FIX 2: factory captures by value
def make(i):
    return lambda: i * 10
fixed2 = [make(i) for i in range(4)]
print("fix2: ", [f() for f in fixed2])`,
        output: `buggy: [30, 30, 30, 30]
fix1:  [0, 10, 20, 30]
fix2:  [0, 10, 20, 30]
`,
        explain: 'All four `buggy` lambdas capture the variable `i`, which is 3 after the loop ends, so every call returns 30. `lambda i=i:` evaluates the default `i` at definition time, freezing the current value into the function\'s own parameter. The factory `make(i)` does the same by passing `i` as an argument into a new scope.',
        explainHi: 'Chaaron `buggy` lambdas variable `i` capture karte hain, jo loop khatam hone ke baad 3 hai, isliye har call 30 lautaata hai. `lambda i=i:` default `i` ko definition time par evaluate karta hai, current value ko function ke apne parameter mein freeze karke. Factory `make(i)` wahi karta hai `i` ko ek naye scope mein ek argument ki tarah pass karke.',
      },
    ],

    mistakes: [
      {
        wrong: `TOTAL = 0
def process(items):
    for x in items:
        TOTAL += x           # UnboundLocalError
    return TOTAL`,
        right: `def process(items):
    return sum(items)        # don't mutate module state -- compute and return
# if you truly need a module accumulator:
#   def process(items):
#       global TOTAL
#       TOTAL += sum(items)`,
        why: 'Mutating module-level state from inside a function is both an `UnboundLocalError` waiting to happen (any `+=` triggers it) and a design smell — the function\'s result now depends on hidden state and call order. Prefer taking inputs as arguments and returning outputs. Use `global` only for genuine module-level counters/caches, deliberately.',
        whyHi: 'Ek function ke andar se module-level state mutate karna ek `UnboundLocalError` hone waala hai (koi bhi `+=` ise trigger karta hai) aur ek design smell — function ka result ab hidden state aur call order par nirbhar karta hai. Inputs ko arguments ki tarah lena aur outputs return karna prefer karo. `global` sirf asli module-level counters/caches ke liye, jaan-boojhkar.',
      },
      {
        wrong: `def make_handlers():
    handlers = []
    for event in ["click", "hover", "scroll"]:
        handlers.append(lambda: f"handling {event}")
    return handlers
# all three return "handling scroll"`,
        right: `def make_handlers():
    handlers = []
    for event in ["click", "hover", "scroll"]:
        handlers.append(lambda event=event: f"handling {event}")
    return handlers`,
        why: 'The lambdas capture the loop variable `event`, which is `"scroll"` after the loop. Binding `event=event` as a default parameter freezes each iteration\'s value into that lambda. This bug is common in loops that build callbacks, routes, or partial functions.',
        whyHi: 'Lambdas loop variable `event` capture karte hain, jo loop ke baad `"scroll"` hai. `event=event` ko ek default parameter ki tarah bind karna har iteration ki value ko us lambda mein freeze karta hai. Ye bug loops mein aam hai jo callbacks, routes, ya partial functions banaate hain.',
      },
      {
        wrong: `def outer():
    cache = {}
    def inner(key):
        cache = {}          # creates a NEW local 'cache', shadowing the outer one
        cache[key] = compute(key)
        return cache[key]
    return inner`,
        right: `def outer():
    cache = {}
    def inner(key):
        if key not in cache:
            cache[key] = compute(key)   # mutate the enclosing cache -- no nonlocal needed
        return cache[key]
    return inner`,
        why: 'Assigning `cache = {}` inside `inner` creates a fresh local dict every call, defeating the cache. To *use* the enclosing `cache` you only read and mutate it (`cache[key] = ...`) — that needs no `nonlocal`. You would only need `nonlocal` to rebind `cache` itself.',
        whyHi: '`inner` ke andar `cache = {}` assign karna har call ek fresh local dict banaata hai, cache ko haraate hue. Enclosing `cache` *istemal* karne ko aap sirf ise padhte aur mutate karte ho (`cache[key] = ...`) — ise koi `nonlocal` nahi chahiye. Aapko `nonlocal` sirf `cache` khud ko rebind karne ko chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**Django settings modules and module-level caches** are the legitimate use of `global` — a module keeps a `_connection` or `_registry` and a function `global _connection`s it on first use. Most other module-state mutation is a bug that manifests as `UnboundLocalError` or as flaky tests.',
        hi: '**Django settings modules aur module-level caches** `global` ka jaayaz istemal hain — ek module ek `_connection` ya `_registry` rakhta hai aur ek function pehle istemal par ise `global _connection` karta hai. Adhikaansh doosri module-state mutation ek bug hai jo `UnboundLocalError` ya flaky tests ki tarah dikhta hai.',
      },
      {
        en: '**Closures are the mechanism behind decorators** — `def timed(func): def wrapper(*a, **kw): ...` — where `wrapper` closes over `func`. `functools.partial`, DRF permission classes, and Django `path("...", view)` all rely on a function keeping a reference to values from where it was created.',
        hi: '**Closures decorators ke peechhe ka tantra hain** — `def timed(func): def wrapper(*a, **kw): ...` — jahaan `wrapper` `func` par close karta hai. `functools.partial`, DRF permission classes, aur Django `path("...", view)` sab ek function ke us jagah se values ka reference rakhne par nirbhar karte hain jahaan wo banaya gaya.',
      },
      {
        en: '**The late-binding loop bug bites when registering handlers or building URL patterns in a loop** — `for name in models: urlpatterns.append(path(f"{name}/", lambda r: view(name)))` gives every route the last `name`. Bind it: `lambda r, name=name: view(name)`.',
        hi: '**Late-binding loop bug tab kaatta hai jab ek loop mein handlers register ya URL patterns banaate ho** — `for name in models: urlpatterns.append(path(f"{name}/", lambda r: view(name)))` har route ko aakhri `name` deta hai. Ise bind karo: `lambda r, name=name: view(name)`.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain `UnboundLocalError`. Why does `x += 1` inside a function fail when `x` is defined at module level?',
        qHi: '`UnboundLocalError` samjhaao. `x += 1` ek function ke andar kyun fail hota hai jab `x` module level par define hai?',
        a: 'Python decides the scope of every name in a function before the function runs, at compile time, by scanning the whole function body. The rule it applies is simple: if a name is assigned anywhere in the body — with an equals sign, an augmented assignment like plus-equals, a for loop target, a with-as target, and so on — then that name is local to the function for its entire duration. It does not matter where in the body the assignment appears; a name assigned on the last line is local from the first line. Now consider x plus-equals one inside a function where x also exists at module level. That statement is shorthand for x equals x plus one, so it contains an assignment to x, which means Python has already classified x as a local variable for this function. When execution reaches the statement, it first needs to evaluate the right-hand side, x plus one, which requires reading the local x — but nothing has assigned the local x yet, so it has no value, and Python raises UnboundLocalError. The error message specifically says local variable, which confuses people because they can see a global x right there; Python is telling you that it is looking in the local scope for this name and finding it uninitialised, not that no x exists anywhere. The same thing happens with a plain read: if a function prints x on one line and assigns x on a later line, the print fails, because the later assignment made x local for the whole function. The fixes are: declare global x if you genuinely intend to rebind the module-level variable; declare nonlocal x if x lives in an enclosing function; or, best in most cases, restructure so the function takes x as a parameter and returns the new value, avoiding shared mutable state entirely. Note that reading an outer name without assigning it works fine, and mutating an object an outer name points at — appending to a list, setting a dict key — is not an assignment to the name and needs no declaration.',
        aHi: 'Python ek function ke chalne se pehle, compile time par, poore function body ko scan karke har naam ka scope tay karta hai. Jo niyam ye lagaata hai wo saral hai: agar ek naam body mein kahin assign hota hai — ek equals sign se, ek augmented assignment jaise plus-equals se, ek for loop target, aur aage — toh wo naam poore function ke liye local hai. Kahaan assignment dikhta hai isse farak nahi padta; aakhri line par assign kiya ek naam pehli line se local hai. Ab x plus-equals one par vichaar karo ek function ke andar jahaan x module level par bhi maujood hai. Wo statement x equals x plus one ka shorthand hai, isliye ismein x ka ek assignment hai, jiska matlab Python ne pehle hi x ko is function ke liye ek local variable classify kiya hai. Jab execution statement tak pahunchta hai, ise pehle right-hand side evaluate karna hai, x plus one, jise local x padhna chahiye — par local x ko abhi kuch assign nahi hua, isliye iski koi value nahi, aur Python UnboundLocalError deta hai. Fixes hain: global x declare karo agar aap sachmuch module-level variable rebind karna chahte ho; nonlocal x declare karo agar x ek enclosing function mein rehta hai; ya, adhikaansh cases mein sabse achha, restructure karo taaki function x ko ek parameter ki tarah le aur nayi value return kare.',
      },
      {
        q: 'What is a closure, and why do all the lambdas in `[lambda: i for i in range(3)]` return the same value?',
        qHi: 'Ek closure kya hai, aur `[lambda: i for i in range(3)]` mein saare lambdas wahi value kyun lautaate hain?',
        a: 'A closure is a function together with a live link to the variables it uses from the scope where it was defined, kept alive even after that enclosing scope has finished executing. When an inner function references a name that is not local to it and not global, Python captures that name from the enclosing function, and the inner function carries a reference to it. That is what lets a decorator\'s wrapper still reach the func it decorates, or a multiplier factory return a function that remembers its factor. The critical detail is that the closure captures the variable, not the variable\'s value at the moment the inner function was created. It holds a reference to the same storage cell, and it reads whatever is in that cell at the time the inner function actually runs. Now the loop example. Writing a list of lambdas, each just returning i, in a loop over range of three, creates three function objects, and all three close over the same single variable i — there is one i, reused each iteration, not a new one per iteration. The lambdas are not called during the loop; they are just collected. By the time you call them, the loop has run to completion and left i holding its final value, two. So every lambda reads that same i and returns two. The fix is to give each function its own copy of the current value. The idiomatic way is a default argument: lambda i equals i colon i. Default arguments are evaluated when the function is defined, not when it is called, so each lambda\'s default parameter i is frozen to the loop value at that iteration, and calling the lambda with no argument uses that frozen default. Alternatively, a factory function that takes i as a parameter and returns a lambda gives each lambda a fresh enclosing scope with its own i. Both work because they bind the value into a new scope at definition time rather than deferring the read.',
        aHi: 'Ek closure ek function hai us scope se un variables ke ek live link ke saath jahaan ye define kiya gaya, us enclosing scope ke execute hone ke baad bhi zinda rakha gaya. Jab ek inner function ek naam reference karta hai jo iske local nahi aur global nahi, Python us naam ko enclosing function se capture karta hai, aur inner function iska ek reference rakhta hai. Mahatvapurna vivaran ye hai ki closure variable capture karta hai, us pal variable ki value nahi jab inner function banaya gaya. Ye usi storage cell ka ek reference rakhta hai, aur us cell mein jo bhi hai wo padhta hai jab inner function asal mein chalta hai. Loop udaharan: range of teen par ek loop mein lambdas ki ek list, har ek bas i lautaate hue, teen function objects banaati hai, aur teenon usi ek variable i par close karte hain — ek i hai, har iteration reuse, prati iteration ek naya nahi. Lambdas loop ke dauraan call nahi hote. Jab tak aap unhe call karte ho, loop poora ho chuka hai aur i ko iski antim value chhod gaya, do. Fix har function ko current value ki apni copy dena hai. Idiomatic tarika ek default argument hai: lambda i equals i colon i.',
      },
    ],

    exercises: [
      {
        task: 'Write a broken `counter()` function that does `count += 1` on a module-level `count`, run it, and record the exact error message. Then fix it two ways: (a) `global count`, (b) return `count + 1` and have the caller reassign. Note which one you would ship.',
        taskHi: 'Ek toota `counter()` function likho jo module-level `count` par `count += 1` kare, ise chalao, aur exact error message record karo. Phir ise do tarikon se theek karo: (a) `global count`, (b) `count + 1` return karo aur caller ko reassign karne do. Note karo aap kaunsa ship karoge.',
        hint: 'The error is `UnboundLocalError: cannot access local variable \'count\' where it is not associated with a value`. Option (b) — pure function, no hidden state — is almost always the better ship.',
        hintHi: 'Error `UnboundLocalError: cannot access local variable \'count\' where it is not associated with a value` hai. Option (b) — pure function, koi hidden state nahi — lagbhag hamesha behtar ship hai.',
      },
      {
        task: 'Write `make_accumulator(start=0)` returning a function `add(n)` that adds `n` to a running total (held in a closure via `nonlocal`) and returns the new total. Test: `acc = make_accumulator(); acc(10); acc(5)` -> `15`. Then make two independent accumulators and confirm they don\'t share state.',
        taskHi: '`make_accumulator(start=0)` likho jo ek function `add(n)` lautaata hai jo `n` ko ek running total mein jodta hai (ek closure mein `nonlocal` ke zariye rakha) aur naya total lautaata hai. Test: `acc = make_accumulator(); acc(10); acc(5)` -> `15`. Phir do independent accumulators banao aur confirm karo wo state share nahi karte.',
        hint: '`total = start` in the outer function; `def add(n): nonlocal total; total += n; return total`. Each call to `make_accumulator()` creates a new `total` cell, so two accumulators are independent.',
        hintHi: 'Outer function mein `total = start`; `def add(n): nonlocal total; total += n; return total`. `make_accumulator()` ki har call ek naya `total` cell banaati hai, isliye do accumulators independent hain.',
      },
      {
        task: 'Build a list of 5 functions in a loop, each meant to return its index times 100. Show the buggy `lambda: i * 100` version returns `[400, 400, 400, 400, 400]`, then fix it with `lambda i=i:` and confirm `[0, 100, 200, 300, 400]`.',
        taskHi: 'Ek loop mein 5 functions ki ek list banao, har ek ka matlab apna index guna 100 lautaana. Buggy `lambda: i * 100` version `[400, 400, 400, 400, 400]` lautaata hai dikhao, phir ise `lambda i=i:` se theek karo aur `[0, 100, 200, 300, 400]` confirm karo.',
        hint: 'The buggy list: `[lambda: i * 100 for i in range(5)]` — all capture the variable `i`, which is 4 after the comprehension. `[lambda i=i: i * 100 for i in range(5)]` freezes each `i` as a default.',
        hintHi: 'Buggy list: `[lambda: i * 100 for i in range(5)]` — sab variable `i` capture karte hain, jo comprehension ke baad 4 hai. `[lambda i=i: i * 100 for i in range(5)]` har `i` ko ek default ki tarah freeze karta hai.',
      },
    ],

    keyTakeaways: [
      'Name lookup for READING is LEGB: Local, Enclosing, Global, Built-in — checked in that order.',
      'THE RULE: if a function ASSIGNS to a name anywhere in its body, that name is local for the ENTIRE function. Reading it before the assignment is `UnboundLocalError` — even for a name defined at module level.',
      '`x += 1` counts as an assignment. So does a `for x in ...` target, `with ... as x`, and `x, y = ...`.',
      '`global x` — "x is the module-level x; I may rebind it". `nonlocal x` — "x is in the nearest enclosing function; I may rebind it". Needed only to REBIND, not to read or to mutate the object x points at.',
      'Mutating an outer object (`outer_list.append(...)`, `outer_dict[k] = v`) needs NO declaration — it is not an assignment to the name.',
      'A closure captures the VARIABLE, not a snapshot of its value. It reads the variable\'s current value when the inner function actually runs.',
      'The late-binding loop bug: `[lambda: i for i in range(n)]` — all lambdas see `i`\'s final value. Fix with `lambda i=i:` (default binds at def time) or a factory function.',
      'Functions create scope; `if`/`for`/`while`/`with`/`try` do NOT (names leak out). Comprehensions DO create their own scope. There is no block scope, no `let`.',
    ],
    keyTakeawaysHi: [
      'PADHNE ke liye naam lookup LEGB hai: Local, Enclosing, Global, Built-in — us kram mein check.',
      'NIYAM: agar ek function apne body mein kahin ek naam ASSIGN karta hai, wo naam POORE function ke liye local hai. Assignment se pehle ise padhna `UnboundLocalError` hai — module level par define kiye naam ke liye bhi.',
      '`x += 1` ek assignment ginta hai. `for x in ...` target, `with ... as x`, aur `x, y = ...` bhi.',
      '`global x` — "x module-level x hai; main ise rebind kar sakta hoon". `nonlocal x` — "x nazdeek enclosing function mein hai; main ise rebind kar sakta hoon". Sirf REBIND karne ko chahiye, padhne ya jis object par x point karta hai use mutate karne ko nahi.',
      'Ek outer object mutate karna (`outer_list.append(...)`, `outer_dict[k] = v`) KOI declaration nahi chahiye — ye naam ka assignment nahi hai.',
      'Ek closure VARIABLE capture karta hai, iski value ka snapshot nahi. Ye variable ki current value padhta hai jab inner function asal mein chalta hai.',
      'Late-binding loop bug: `[lambda: i for i in range(n)]` — saare lambdas `i` ki antim value dekhte hain. `lambda i=i:` (default def time par bind) ya ek factory function se theek karo.',
      'Functions scope banaate hain; `if`/`for`/`while`/`with`/`try` NAHI (naam leak hote hain). Comprehensions apna scope banaate HAIN. Koi block scope nahi, koi `let` nahi.',
    ],
  },
];
