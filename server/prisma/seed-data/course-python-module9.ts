/**
 * Python Complete Course — Module 9: Typing, Testing & Tooling, lessons 1-3.
 *
 * Lesson 1: type hints basics — `x: int`, `-> str`, `list[int]` / `dict[str, X]`
 *           / `tuple[int, ...]`, `X | None` (was `Optional[X]`), `Any`; hints
 *           are NOT enforced at runtime; string / deferred annotations;
 *           `__annotations__` and `typing.get_type_hints`.
 * Lesson 2: advanced typing — `Callable[[int], str]`, `TypedDict`, `Protocol`
 *           (structural), `Literal`, `Union`, generics (`TypeVar` / `Generic`),
 *           `Self` (3.11), `type X = ...` alias (3.12), `cast`, `TYPE_CHECKING`.
 * Lesson 3: `mypy` / `pyright` and gradual typing — running a checker,
 *           `--strict`, adding types incrementally, the common errors
 *           (`None` access, wrong return, incompatible assignment),
 *           `reveal_type`, and why type-check at all.
 *
 * NOTE for future editors: same rules as the rest of this course. Every
 * backtick inside simple/simpleHi/content/contentHi is `\`` (inline code inside
 * ``` blocks included). Escape `$` before `{` inside template literals as `\${`.
 * Keep example OUTPUT ASCII-only. `examples` use `code` + `output`; run every
 * sample with `python`. The mypy examples write a fixed `snippet.py` to a temp
 * dir and run `python -m mypy --no-color-output --no-error-summary` via
 * subprocess (deterministic: fixed filename + fixed line numbers). Scan for
 * Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_9: CourseLesson[] = [
  {
    slug: 'py-type-hints-basics',
    title: 'Type Hints: Syntax, Semantics, and "Not Enforced at Runtime"',
    titleHi: 'Type Hints: Syntax, Semantics, Aur "Runtime Par Enforce Nahi"',
    description: 'Adding `def total(items: list[int]) -> int:` and then passing it a list of strings — and the function runs anyway, because Python does not check type hints at all. Hints are annotations: read by type checkers, IDEs, and documentation tools, ignored by the interpreter. Knowing exactly what they do and do not do is the foundation.',
    descriptionHi: '`def total(items: list[int]) -> int:` jodना aur phir ise strings ki ek list pass karna — aur function phir bhi chalता hai, kyunki Python type hints bilkul check nahi karता. Hints annotations hain: type checkers, IDEs, aur documentation tools dwara padhi jaती hain, interpreter dwara ignore. Ye thik-thik jaanna ki wo kya karती hain aur kya nahi buniyaad hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Labels on the outside of shipping boxes.** A box labelled "FRAGILE — GLASS" tells the humans handling it, and the automated sorting system, what is inside and how to treat it. But the label is not a force field: nothing physically stops someone from putting a brick in a box marked "GLASS", and the box will still ship. The value of the label is that everyone who reads it — the loading crew, the customer, the returns desk — now shares an understanding, and a good sorting system will *flag* a box whose contents scanner disagrees with its label before it goes out. Python type hints are exactly these labels. `name: str` and `-> int` describe what a variable or function is supposed to hold or return. The interpreter never checks them — it will run `total(["a", "b"])` against `def total(items: list[int])` without complaint. Their power comes from the tools that *do* read them: a type checker like mypy that scans your whole codebase and reports every mismatch, an editor that autocompletes and warns as you type, and the next developer who reads the signature instead of the whole body to understand what to pass.',
      hi: '**Shipping boxes ke bahar par labels.** Ek box "FRAGILE — GLASS" labelled use handle kar rahe insaanon ko, aur automated sorting system ko, bataता hai ki andar kya hai. Par label ek force field nahi hai: koi cheez sharirik roop se kisi ko "GLASS" marked box mein ek brick daalne se nahi rokती, aur box phir bhi ship hoga. Label ki value ye hai ki jo bhi ise padhता hai ab ek samajh share karता hai, aur ek achha sorting system ek box ko *flag* karega jiski contents label se असहमत hain. Python type hints bilkul ye labels hain. `name: str` aur `-> int` bataते hain ki ek variable ya function ko kya rakhना ya return karna chahiye. Interpreter unhe kabhi check nahi karता. Unki shakti un tools se aati hai jo unhe *padhते* hain: mypy jaisा ek type checker, ek editor jo autocomplete aur warn karता hai, aur agla developer jo signature padhता hai.',
    },

    simple: `**The syntax**

\`\`\`python
name: str = "Ada"                 # variable annotation
age: int                          # annotation only (no value assigned)

def greet(name: str, times: int = 1) -> str:      # params and return
    return f"hi {name} " * times

x: list[int] = [1, 2, 3]
y: dict[str, float] = {"pi": 3.14}
z: tuple[int, str, bool] = (1, "a", True)         # fixed-length tuple
w: tuple[int, ...] = (1, 2, 3, 4)                 # variable-length tuple
\`\`\`

**Hints are NOT enforced — the interpreter ignores them**

\`\`\`python
def double(n: int) -> int:
    return n * 2

double("ab")        # 'abab'  -- runs fine! the hint said int, Python does not care
double([1, 2])      # [1, 2, 1, 2]

# a type checker (mypy/pyright) would flag both calls. Python at runtime does not.
\`\`\`

**\`None\`, optional, and unions**

\`\`\`python
def find(key: str) -> str | None:        # returns a str OR None
    ...

def parse(x: int | str) -> float:        # accepts int OR str
    ...

from typing import Optional
Optional[str]                            # exactly the same as  str | None  (older style)
\`\`\`

**\`Any\` — opt out of checking**

\`\`\`python
from typing import Any

def handle(payload: Any) -> Any:         # "I am not typing this"
    return payload["whatever"].do_thing()   # a checker will not complain
\`\`\`

**Where the annotations live at runtime**

\`\`\`python
def f(a: int, b: str = "x") -> bool: ...

f.__annotations__          # {'a': <class 'int'>, 'b': <class 'str'>, 'return': <class 'bool'>}

class C:
    x: int
    y: str = "y"
C.__annotations__          # {'x': <class 'int'>, 'y': <class 'str'>}
\`\`\`

\`\`\`
VARIABLE:   name: Type            name: Type = value
FUNCTION:   def f(p: Type, q: Type = default) -> ReturnType:
BUILT-IN GENERICS (3.9+):  list[int]  dict[str, int]  tuple[int, ...]  set[str]
                           tuple[int, str]  (fixed)   |   type[MyClass]
OPTIONAL:   X | None   (3.10+ preferred)   ==   typing.Optional[X]
UNION:      X | Y | Z   (3.10+)            ==   typing.Union[X, Y, Z]
ESCAPE:     Any  -> disables checking for that value

RUNTIME:  hints are stored in __annotations__ but NEVER checked by the interpreter.
          double("ab") runs even though the hint says int.
          Enforcement is the job of an external checker (mypy, pyright) or an
          IDE, run as a separate step -- not the Python runtime.

DEFERRED: from __future__ import annotations  -> all annotations become strings
          (avoids forward-reference issues, cheaper import). typing.get_type_hints(obj)
          resolves them back to real objects.
\`\`\``,

    simpleHi: `**Syntax**

\`\`\`python
name: str = "Ada"                 # variable annotation
age: int                          # sirf annotation (koi value nahi)

def greet(name: str, times: int = 1) -> str:      # params aur return
    return f"hi {name} " * times

x: list[int] = [1, 2, 3]
y: dict[str, float] = {"pi": 3.14}
z: tuple[int, str, bool] = (1, "a", True)         # fixed-length tuple
w: tuple[int, ...] = (1, 2, 3, 4)                 # variable-length tuple
\`\`\`

**Hints ENFORCE NAHI hote — interpreter unhe ignore karता hai**

\`\`\`python
def double(n: int) -> int:
    return n * 2

double("ab")        # 'abab'  -- theek chalता hai! hint ne int kaha, Python parwaah nahi karता
double([1, 2])      # [1, 2, 1, 2]

# ek type checker (mypy/pyright) dono calls flag karता. Python runtime par nahi.
\`\`\`

**\`None\`, optional, aur unions**

\`\`\`python
def find(key: str) -> str | None:        # ek str YA None lautaता hai
    ...

def parse(x: int | str) -> float:        # int YA str accept karता hai
    ...

from typing import Optional
Optional[str]                            # bilkul  str | None  jaisा (purana style)
\`\`\`

**\`Any\` — checking se opt out**

\`\`\`python
from typing import Any

def handle(payload: Any) -> Any:         # "main ise type nahi kar raha"
    return payload["whatever"].do_thing()   # ek checker shikaayat nahi karega
\`\`\`

**Runtime par annotations kahaan rehte hain**

\`\`\`python
def f(a: int, b: str = "x") -> bool: ...

f.__annotations__          # {'a': <class 'int'>, 'b': <class 'str'>, 'return': <class 'bool'>}
\`\`\`

\`\`\`
VARIABLE:   name: Type            name: Type = value
FUNCTION:   def f(p: Type, q: Type = default) -> ReturnType:
BUILT-IN GENERICS (3.9+):  list[int]  dict[str, int]  tuple[int, ...]  set[str]
OPTIONAL:   X | None   (3.10+ preferred)   ==   typing.Optional[X]
UNION:      X | Y | Z   (3.10+)            ==   typing.Union[X, Y, Z]
ESCAPE:     Any  -> us value ke liye checking disable karता hai

RUNTIME:  hints __annotations__ mein store hote hain par interpreter dwara KABHI check nahi.
          double("ab") chalता hai chahe hint int kahe.
          Enforcement ek external checker (mypy, pyright) ya ek IDE ka kaam hai.

DEFERRED: from __future__ import annotations  -> saare annotations strings ban jaते hain.
          typing.get_type_hints(obj) unhe wapas asli objects mein resolve karता hai.
\`\`\``,

    content: `## Built-in generic syntax (Python 3.9+)

\`\`\`python
list[int]            dict[str, int]           set[frozenset[str]]
tuple[int, str]      # a 2-tuple: first int, second str
tuple[int, ...]      # any number of ints
type[User]           # the class User itself (not an instance)
list[dict[str, list[int]]]   # arbitrarily nested
\`\`\`

Before 3.9 you needed \`from typing import List, Dict, Tuple\` and wrote \`List[int]\`. Since 3.9 the built-in names are subscriptable directly. Use the lowercase built-ins; \`typing.List\` etc. are deprecated aliases.

## \`X | None\` vs \`Optional[X]\`

\`\`\`python
def get(key: str) -> str | None: ...        # 3.10+ syntax, preferred
def get(key: str) -> Optional[str]: ...     # identical meaning, older style
\`\`\`

\`Optional[X]\` does **not** mean "this argument can be omitted" — it means "the value can be \`X\` or \`None\`". A parameter is optional when it has a default:

\`\`\`python
def f(a: int, b: str | None = None): ...    # b is optional AND can be None
def g(a: int, b: str = ""): ...             # b is optional, cannot be None
\`\`\`

## Hints are annotations, not checks

\`\`\`python
def add(a: int, b: int) -> int:
    return a + b

add("x", "y")        # 'xy' -- Python runs it; the hints are metadata
\`\`\`

The interpreter stores annotations in \`__annotations__\` and otherwise treats the function exactly as if there were no hints. Type *checking* is a separate program you run — \`mypy\`, \`pyright\`, or your IDE's checker — that reads the annotations and reports mismatches. Nothing about the runtime changes.

There are libraries (\`pydantic\`, \`typeguard\`, \`beartype\`, dataclass validation) that *do* enforce hints at runtime, but that is their added behaviour, not Python's.

## Forward references and deferred evaluation

\`\`\`python
class Node:
    def __init__(self, value: int, next: "Node | None" = None):   # "Node" as a string
        ...                                                        # -- Node is not defined yet

# or make ALL annotations lazy strings:
from __future__ import annotations

class Tree:
    def children(self) -> list[Tree]:      # no quotes needed; evaluated lazily
        ...
\`\`\`

An annotation that references a name not yet defined (a class referring to itself, a mutual reference) must be a string, or you add \`from __future__ import annotations\` at the top of the file, which turns every annotation into a string automatically. \`typing.get_type_hints(obj)\` evaluates the strings back into real type objects when a tool needs them.

## Inspecting annotations

\`\`\`python
import typing

def f(a: int, b: "list[str]") -> bool: ...

f.__annotations__               # {'a': int, 'b': 'list[str]', 'return': bool}  -- b is a string
typing.get_type_hints(f)        # {'a': int, 'b': list[str], 'return': bool}    -- resolved
\`\`\`

## When to add hints

- **Public function signatures** — the highest value: callers see what to pass without reading the body.
- **Anything returned from a boundary** — API handlers, parsers, config loaders.
- **Complex data structures** — a \`dict[str, list[tuple[int, str]]]\` annotation is documentation.
- **Not** every local variable — a type checker infers most locals from the right-hand side; annotate a local only when inference is wrong or unclear (e.g. an empty container: \`items: list[User] = []\`).`,

    contentHi: `## Built-in generic syntax (Python 3.9+)

\`\`\`python
list[int]            dict[str, int]           set[frozenset[str]]
tuple[int, str]      # ek 2-tuple: pehla int, doosra str
tuple[int, ...]      # koi bhi sankhya mein ints
type[User]           # class User khud (ek instance nahi)
\`\`\`

3.9 se pehle aapko \`from typing import List, Dict\` chahiye tha. 3.9 se built-in names seedhe subscriptable hain. Lowercase built-ins istemal karो; \`typing.List\` deprecated aliases hain.

## \`X | None\` vs \`Optional[X]\`

\`\`\`python
def get(key: str) -> str | None: ...        # 3.10+ syntax, preferred
def get(key: str) -> Optional[str]: ...     # samaan matlab, purana style
\`\`\`

\`Optional[X]\` ka matlab "ye argument chhoda ja sakta hai" **nahi** hai — iska matlab "value \`X\` ya \`None\` ho sakti hai". Ek parameter tab optional hai jab iska ek default hai:

\`\`\`python
def f(a: int, b: str | None = None): ...    # b optional HAI AUR None ho sakta hai
def g(a: int, b: str = ""): ...             # b optional hai, None nahi ho sakta
\`\`\`

## Hints annotations hain, checks nahi

\`\`\`python
def add(a: int, b: int) -> int:
    return a + b

add("x", "y")        # 'xy' -- Python ise chalाता hai; hints metadata hain
\`\`\`

Interpreter annotations ko \`__annotations__\` mein store karता hai aur warna function ko bilkul aise treat karता hai jaise koi hints na hon. Type *checking* ek alag program hai jise aap chalाते ho.

Libraries hain (\`pydantic\`, \`typeguard\`, \`beartype\`) jo runtime par hints *enforce* karti hain, par wo unka joda behaviour hai, Python ka nahi.

## Forward references aur deferred evaluation

\`\`\`python
class Node:
    def __init__(self, value: int, next: "Node | None" = None):   # "Node" ek string ki tarah
        ...

# ya SAARE annotations ko lazy strings banao:
from __future__ import annotations

class Tree:
    def children(self) -> list[Tree]:      # koi quotes nahi chahiye; lazily evaluate
        ...
\`\`\`

Ek annotation jo ek naam reference karता hai jo abhi define nahi hai use ek string honi chahiye, ya aap file ke top par \`from __future__ import annotations\` jodते ho. \`typing.get_type_hints(obj)\` strings ko wapas asli type objects mein evaluate karता hai.

## Annotations inspect karna

\`\`\`python
import typing

def f(a: int, b: "list[str]") -> bool: ...

f.__annotations__               # {'a': int, 'b': 'list[str]', 'return': bool}  -- b ek string
typing.get_type_hints(f)        # {'a': int, 'b': list[str], 'return': bool}    -- resolved
\`\`\`

## Hints kab jodें

- **Public function signatures** — sabse zyaada value.
- **Ek boundary se lautाई gayi koi bhi cheez** — API handlers, parsers, config loaders.
- **Complex data structures** — ek \`dict[str, list[tuple[int, str]]]\` annotation documentation hai.
- **Har local variable NAHI** — ek type checker adhikaansh locals infer karता hai; ek local ko sirf tab annotate karो jab inference galat ya unclear ho (jaise ek empty container: \`items: list[User] = []\`).`,

    examples: [
      {
        title: 'Hints do not run; annotations are stored, not checked',
        titleHi: 'Hints chalते nahi; annotations store hote hain, check nahi',
        code: `def double(n: int) -> int:
    return n * 2

# the hint says int, but Python runs anything that supports *:
print("double(21):   ", double(21))
print("double('ab'): ", double("ab"))
print("double([1,2]):", double([1, 2]))

# annotations are just metadata on the function object:
print("annotations: ", double.__annotations__)

def f(a: int, b: str = "x", *args: float) -> bool:
    return True
print("f annotations:", f.__annotations__)

class Config:
    host: str
    port: int = 5432
    tags: list[str]
print("class annotations:", Config.__annotations__)

# a bare annotation does NOT create the attribute:
print("has 'host'?", hasattr(Config, "host"))     # False -- only 'port' has a value`,
        output: `double(21):    42
double('ab'):  abab
double([1,2]): [1, 2, 1, 2]
annotations:  {'n': <class 'int'>, 'return': <class 'int'>}
f annotations: {'a': <class 'int'>, 'b': <class 'str'>, 'args': <class 'float'>, 'return': <class 'bool'>}
class annotations: {'host': <class 'str'>, 'port': <class 'int'>, 'tags': list[str]}
has 'host'? False`,
        explain: '`double` runs on a string and a list even though its hint says `int` — Python does not check. The annotations are stored in `double.__annotations__` and `Config.__annotations__` as metadata. Note `*args: float` records the type of each element as `float`. A bare class annotation like `host: str` (no `=`) adds an entry to `__annotations__` but does NOT create the class attribute — only `port` (which has a value) exists on the class.',
        explainHi: '`double` ek string aur ek list par chalता hai chahe iska hint `int` kahe. Annotations `double.__annotations__` aur `Config.__annotations__` mein metadata ki tarah store hote hain. Ek nangi class annotation jaise `host: str` (bina `=`) `__annotations__` mein ek entry jodती hai par class attribute NAHI banाती — sirf `port` class par maujood hai.',
      },
      {
        title: 'X | None vs Optional; string annotations and get_type_hints',
        titleHi: 'X | None vs Optional; string annotations aur get_type_hints',
        code: `from typing import Optional, get_type_hints

def a(x: int | None) -> str | None: ...
def b(x: Optional[int]) -> Optional[str]: ...

print("a:", a.__annotations__)
print("b:", b.__annotations__)
print("same?", a.__annotations__ == b.__annotations__)   # int | None == Optional[int]

# forward reference via a string:
class Node:
    def __init__(self, value: int, nxt: "Node | None" = None):
        self.value = value
        self.nxt = nxt

print("raw:", Node.__init__.__annotations__)
print("resolved:", get_type_hints(Node.__init__))

# a chain:
n = Node(1, Node(2, Node(3)))
vals = []
cur = n
while cur:
    vals.append(cur.value)
    cur = cur.nxt
print("chain:", vals)`,
        output: `a: {'x': int | None, 'return': str | None}
b: {'x': int | None, 'return': str | None}
same? True
raw: {'value': <class 'int'>, 'nxt': 'Node | None'}
resolved: {'value': <class 'int'>, 'nxt': __main__.Node | None}
chain: [1, 2, 3]`,
        explain: '`int | None` and `Optional[int]` are the SAME type — `Optional[X]` IS `Union[X, None]` IS `X | None` — and on modern Python even the `repr` is identical, so `a` and `b` have equal annotations. The `"Node | None"` annotation is stored as the literal string `\'Node | None\'` because `Node` is not yet defined when `__init__` is compiled; `get_type_hints` evaluates it into the real union type (`__main__.Node | None`). `__init__` has no return annotation, so no `return` key appears. The linked-list traversal itself has nothing to do with the hints — they are pure metadata.',
        explainHi: '`int | None` aur `Optional[int]` EK HI type hain — `Optional[X]` IS `Union[X, None]` IS `X | None` — aur modern Python par `repr` bhi ek jaisा hai, isliye `a` aur `b` ke annotations barabar hain. `"Node | None"` annotation literal string `\'Node | None\'` ki tarah store hoती hai kyunki `Node` abhi define nahi jab `__init__` compile hoता hai; `get_type_hints` ise asli union type mein evaluate karता hai (`__main__.Node | None`). `__init__` ka koi return annotation nahi, isliye koi `return` key nahi.',
      },
      {
        title: 'from __future__ import annotations makes all hints lazy strings',
        titleHi: 'from __future__ import annotations saare hints ko lazy strings banाता hai',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()

# WITHOUT the future import: a self-reference needs quotes or it is a NameError
open(os.path.join(d, "eager.py"), "w").write(textwrap.dedent('''
    class Tree:
        def kids(self) -> list["Tree"]:      # quotes required here
            return []
    import typing
    print("eager annotations:", Tree.kids.__annotations__)
    print("resolved:", typing.get_type_hints(Tree.kids))
'''))

# WITH it: every annotation is automatically a string, no quotes needed
open(os.path.join(d, "lazy.py"), "w").write(textwrap.dedent('''
    from __future__ import annotations
    class Tree:
        def kids(self) -> list[Tree]:        # no quotes -- stored as a string anyway
            return []
    import typing
    print("lazy annotations:", Tree.kids.__annotations__)
    print("resolved:", typing.get_type_hints(Tree.kids))
'''))

for name in ["eager.py", "lazy.py"]:
    print(f"=== {name} ===")
    print(subprocess.run([sys.executable, name], cwd=d, capture_output=True, text=True).stdout, end="")`,
        output: `=== eager.py ===
eager annotations: {'return': list['Tree']}
resolved: {'return': list[__main__.Tree]}
=== lazy.py ===
lazy annotations: {'return': 'list[Tree]'}
resolved: {'return': list[__main__.Tree]}
`,
        explain: 'Without `from __future__ import annotations`, a hint that names the enclosing class must quote it (`list["Tree"]`) — otherwise `Tree` is not yet defined and evaluating the annotation raises `NameError`. The annotation is still evaluated eagerly, so it is stored as `list[\'Tree\']` (a `list` of a forward reference). With the future import, the WHOLE annotation is kept as one lazy string `\'list[Tree]\'` and `list[Tree]` works unquoted. Either way, `typing.get_type_hints` resolves it back to the real type (`list[__main__.Tree]`) when a tool needs it.',
        explainHi: '`from __future__ import annotations` ke bina, ek hint jo enclosing class ko naam deta hai use quote karna hoga (`list["Tree"]`) — warna `Tree` abhi define nahi aur annotation evaluate karna `NameError` deta hai. Annotation phir bhi eagerly evaluate hoता hai, isliye ye `list[\'Tree\']` ki tarah store hoता hai. Future import ke saath, POORA annotation ek lazy string `\'list[Tree]\'` ki tarah rakha jaता hai. Kisi bhi tarah, `typing.get_type_hints` ise wapas asli type mein resolve karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `def process(items: list[int]) -> int:
    return sum(items)

process(["a", "b", "c"])     # runs, returns... TypeError deep inside sum, not at the call`,
        right: `# the hint is correct; run a type checker to catch the bad call BEFORE runtime:
#   $ mypy myfile.py
#   error: List item 0 has incompatible type "str"; expected "int"
# and/or validate at the boundary if the input is untrusted:
def process(items: list[int]) -> int:
    if not all(isinstance(x, int) for x in items):
        raise TypeError("items must be ints")
    return sum(items)`,
        why: 'A type hint does not make Python check anything — `process(["a"])` runs and fails later, deeper in the stack, with a confusing error. Hints catch this only when you run a type checker (mypy/pyright) as a separate step, or in your IDE. For untrusted external input, add an explicit runtime check or use a validation library.',
        whyHi: 'Ek type hint Python ko kuch check nahi karवाता — `process(["a"])` chalता hai aur baad mein fail hoता hai. Hints ise sirf tab pakadते hain jab aap ek type checker chalाते ho. Untrusted external input ke liye, ek explicit runtime check jodो.',
      },
      {
        wrong: `def save(user, path: str = None):    # path: str  but the default is None
    ...`,
        right: `def save(user, path: str | None = None):
    ...
# the hint must include None when the default (or a possible value) is None`,
        why: 'Annotating a parameter `str` while defaulting it to `None` is a contradiction a type checker will flag: the declared type is `str` but `None` is not a `str`. Widen the hint to `str | None` (or `Optional[str]`). This is one of the most common typing mistakes.',
        whyHi: 'Ek parameter ko `str` annotate karna jabki iska default `None` hai ek contradiction hai jise ek type checker flag karega. Hint ko `str | None` (ya `Optional[str]`) tak chauda karो. Ye sabse aam typing galtiyon mein se ek hai.',
      },
      {
        wrong: `class Account:
    def transfer(self, other: Account) -> Account:   # NameError: Account not defined yet
        ...`,
        right: `class Account:
    def transfer(self, other: "Account") -> "Account":   # string forward reference
        ...
# or, at the top of the file:
from __future__ import annotations`,
        why: 'When a class method annotates the class it is being defined in, the class name does not exist yet at the moment the `def` line is compiled, so an unquoted reference raises `NameError`. Wrap it in quotes (`"Account"`), use `typing.Self` (3.11+), or add `from __future__ import annotations` to defer all annotations to strings.',
        whyHi: 'Jab ek class method us class ko annotate karता hai jismein ye define ho raha hai, class naam abhi maujood nahi jab `def` line compile hoती hai, isliye ek unquoted reference `NameError` deta hai. Ise quotes mein wrap karो (`"Account"`), `typing.Self` (3.11+) istemal karो, ya `from __future__ import annotations` jodो.',
      },
    ],

    realWorld: [
      {
        en: '**DRF serializers, Django model fields, and Pydantic models look typed but enforce at runtime by their own code** — a `serializers.IntegerField()` validates on `.is_valid()`, a Pydantic `age: int` coerces and validates in `__init__`. Plain function/variable hints elsewhere in the codebase are checked only by mypy/pyright in CI or your editor.',
        hi: '**DRF serializers, Django model fields, aur Pydantic models typed dikhте hain par apne code se runtime par enforce karते hain** — ek Pydantic `age: int` `__init__` mein coerce aur validate karता hai. Codebase mein baaki jagah plain function/variable hints sirf CI mein mypy/pyright ya aapke editor dwara check hote hain.',
      },
      {
        en: '**`X | None` (or `Optional[X]`) on every function that can return "not found"** is the standard — `get_user(id) -> User | None`, `cache.get(key) -> bytes | None`. The type checker then forces every caller to handle the `None` case (`if user is None: ...`) before using the value.',
        hi: '**Har function par `X | None` jo "not found" lauta sakta hai** standard hai — `get_user(id) -> User | None`. Type checker phir har caller ko value istemal karne se pehle `None` case handle karne par majboor karता hai.',
      },
      {
        en: '**`from __future__ import annotations` is (or was) recommended at the top of most modules** — it makes forward references "just work", speeds import (annotations are not evaluated), and matches where Python is heading. Django and FastAPI codebases use it widely; some runtime-introspection libraries need `get_type_hints` because of it.',
        hi: '**`from __future__ import annotations` adhikaansh modules ke top par recommended hai (ya tha)** — ye forward references ko "bस kaam" karवाता hai, import tez karता hai. Django aur FastAPI codebases ise vyापक roop se istemal karते hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Are Python type hints enforced at runtime? What actually happens when you call a function with an argument of the wrong type?',
        qHi: 'Kya Python type hints runtime par enforce hote hain? Jab aap ek function ko galat type ke argument ke saath call karते ho to asal mein kya hota hai?',
        a: 'No, they are not enforced at runtime. A type hint is an annotation: the interpreter parses it, stores it in the double-underscore annotations dictionary on the function or class or module, and then completely ignores it for the purpose of execution. If you declare a parameter as int and pass a string, the function body runs exactly as it would with no annotation at all. Whatever the body does with that value is what happens — if the operations happen to work on a string, you get a result; if they do not, you get a normal runtime error like a TypeError, but it surfaces wherever the incompatible operation is, often several frames deep, not at the call site, which makes it harder to diagnose. So hints do not change program behaviour by themselves. Their value comes entirely from tools that read the annotations as a separate step. A static type checker like mypy or pyright analyses the whole codebase without running it, follows the types through every call and assignment, and reports every place where the declared and inferred types disagree — before you run anything, typically in CI or in your editor as you type. IDEs use the same information for autocomplete, refactoring, and inline warnings. And the next person to read a function signature learns what to pass and what they get back without reading the implementation. There is a category of libraries — pydantic, typeguard, beartype, and dataclass validation frameworks — that do enforce hints at runtime, raising or coercing when a value does not match. But that enforcement is behaviour those libraries add on top of the annotation mechanism; it is not something the language does. If you need runtime guarantees on untrusted external input, you either use one of those libraries or write explicit isinstance checks; the hint alone guarantees nothing at runtime.',
        aHi: 'Nahi, wo runtime par enforce nahi hote. Ek type hint ek annotation hai: interpreter ise parse karता hai, function ya class ya module par double-underscore annotations dictionary mein store karता hai, aur phir execution ke liye ise poori tarah ignore karता hai. Agar aap ek parameter ko int declare karते ho aur ek string pass karते ho, function body bilkul aise chalती hai jaise koi annotation na ho. Jo bhi body us value ke saath karती hai wahi hoता hai. Hints khud program behaviour nahi badalते. Unki value poori tarah un tools se aati hai jo annotations ko ek alag step ki tarah padhते hain. mypy ya pyright jaisा ek static type checker poori codebase ko bina chalाye analyse karता hai aur har jagah report karता hai jahaan declared aur inferred types असहमत hain. Libraries ki ek category hai — pydantic, typeguard — jo runtime par hints enforce karती hain, par wo enforcement wo libraries jodती hain; ye bhaasha nahi karती.',
      },
      {
        q: 'What is the difference between `Optional[X]` and a parameter with a default value, and why do people confuse them?',
        qHi: '`Optional[X]` aur ek default value waale parameter mein kya antar hai, aur log unhe kyun confuse karते hain?',
        a: 'They control two independent things and the word "optional" makes them sound like one. Optional of X, which is spelled X or None in modern syntax, is purely about the value: it declares that the thing can be an X or it can be None. It says nothing about whether the argument must be supplied. A parameter is optional in the sense of "can be omitted at the call site" only when it has a default value in the signature. These combine in all four ways. A parameter can be required and non-nullable — just name colon int with no default. It can be required but nullable — name colon int or None with no default, meaning the caller must pass something but that something is allowed to be None. It can be optional and non-nullable — name colon str equals empty-string, meaning the caller may omit it and if present it is always a str. Or it can be optional and nullable — name colon str or None equals None, the most common pattern, where the caller may omit it and the effective value when omitted is None. The confusion comes from two directions. First, the name Optional strongly suggests "this argument is optional", when it actually means "this value may be None". Second, the very common idiom of writing a nullable parameter with a None default — b colon str or None equals None — ties the two concepts together in the code people see most often, so they start to think one implies the other. The concrete mistake this produces is annotating a parameter as str while giving it a default of None: the type checker flags it because None is not a str, and the fix is to widen the annotation to str or None. The rule to remember: the annotation describes what values are allowed; the presence or absence of a default describes whether the argument can be left out; decide each independently.',
        aHi: 'Wo do swतंत्r cheezein control karते hain aur shabd "optional" unhe ek jaisा lagता hai. Optional of X, jo modern syntax mein X or None likha jाता hai, shuddh roop se value ke baare mein hai: ye bataता hai ki cheez ek X ya None ho sakti hai. Ye kuch nahi bataता ki argument dena zaroori hai ya nahi. Ek parameter "call site par chhoda ja sakta hai" arth mein sirf tab optional hai jab signature mein iski ek default value hai. Ye chaaron tarikon se combine hote hain. Ek parameter required aur non-nullable ho sakta hai. Ye required par nullable ho sakta hai. Ye optional aur non-nullable ho sakta hai. Ya ye optional aur nullable ho sakta hai — name colon str or None equals None, sabse aam pattern. Confusion do dishaon se aati hai. Pehla, naam Optional strongly sujhaता hai "ye argument optional hai". Doosra, ek nullable parameter ko None default ke saath likhne ka bahut aam idiom dono concepts ko jodता hai. Niyam: annotation bataता hai kaunsi values allowed hain; ek default ki maujoodgi bataती hai ki argument chhoda ja sakta hai; har ek swतंत्r roop se tay karो.',
      },
    ],

    exercises: [
      {
        task: 'Write `def stats(nums: list[float]) -> dict[str, float]:` returning `{"min": ..., "max": ..., "mean": ...}`. Then call `stats(["a", "b"])` and observe it raises a `TypeError` DEEP in the code (in `min`/`sum`), NOT at the call. Print `stats.__annotations__`. State what would have caught the bad call earlier.',
        taskHi: '`def stats(nums: list[float]) -> dict[str, float]:` likhо jo `{"min": ..., "max": ..., "mean": ...}` lautाe. Phir `stats(["a", "b"])` call karो aur dekho ye code mein GEHRA `TypeError` deta hai, call par NAHI. `stats.__annotations__` print karो.',
        hint: '`stats(["a","b"])` fails inside `sum(nums)/len(nums)` (or `min`) with `TypeError: unsupported operand` — the hint `list[float]` did nothing at runtime. Running `mypy` on the file would report the bad argument type before you ever execute it.',
        hintHi: '`stats(["a","b"])` `sum(nums)/len(nums)` ke andar fail hoता hai — hint `list[float]` ne runtime par kuch nahi kiya. File par `mypy` chalाना execute karne se pehle bad argument type report karता.',
      },
      {
        task: 'Write a `LinkedList` class where `Node.__init__(self, value: int, nxt: ??? = None)` self-references `Node`. Do it TWO ways: (a) with a string annotation `"Node | None"`, (b) with `from __future__ import annotations` and an unquoted `Node | None`. For each, print `Node.__init__.__annotations__` (raw) and `typing.get_type_hints(Node.__init__)` (resolved). Confirm both resolve to the same type.',
        taskHi: 'Ek `LinkedList` class likhо jahaan `Node.__init__(self, value: int, nxt: ??? = None)` `Node` ko self-reference kare. DO tarikon se: (a) string annotation `"Node | None"`, (b) `from __future__ import annotations` aur unquoted `Node | None`. Har ek ke liye raw aur resolved annotations print karो.',
        hint: 'Both store the annotation as the string `\'Node | None\'` in `__annotations__`; `get_type_hints` resolves both to `Node | None` (the real union). The `__future__` import just removes the need for quotes on every annotation in the file.',
        hintHi: 'Dono annotation ko string `\'Node | None\'` ki tarah `__annotations__` mein store karते hain; `get_type_hints` dono ko `Node | None` mein resolve karता hai. `__future__` import bस file ki har annotation par quotes ki zaroorat hataता hai.',
      },
      {
        task: 'Given `def f(a: int, b: str = "x", *nums: float, key: bool = False, **opts: str) -> None: ...`, print `f.__annotations__` and identify which entry is which parameter. Then write a function `describe_signature(fn)` that prints each parameter name with its annotation from `fn.__annotations__`, and the return type.',
        taskHi: '`def f(a: int, b: str = "x", *nums: float, key: bool = False, **opts: str) -> None: ...` diya, `f.__annotations__` print karो. Phir ek function `describe_signature(fn)` likhо jo har parameter naam iske annotation ke saath print kare.',
        hint: '`f.__annotations__` is `{\'a\': int, \'b\': str, \'nums\': float, \'key\': bool, \'opts\': str, \'return\': None}` — `*nums`/`**opts` record the element/value type. `for name, typ in fn.__annotations__.items(): print(name, "->", typ)` handles it; special-case `return`.',
        hintHi: '`f.__annotations__` `{\'a\': int, \'b\': str, \'nums\': float, \'key\': bool, \'opts\': str, \'return\': None}` hai. `for name, typ in fn.__annotations__.items(): print(name, "->", typ)`.',
      },
    ],

    keyTakeaways: [
      'Type hints are ANNOTATIONS, not checks. Python stores them in `__annotations__` and ignores them at runtime — `double("ab")` runs even though the hint says `int`.',
      'Enforcement is a separate program: `mypy` / `pyright` / your IDE read the annotations and report mismatches. Nothing about the Python runtime changes. (`pydantic`/`typeguard` add runtime checking as their own behaviour.)',
      'Syntax: `x: Type`, `x: Type = value`, `def f(p: Type, q: Type = default) -> ReturnType:`. Built-in generics since 3.9: `list[int]`, `dict[str, int]`, `tuple[int, str]` (fixed), `tuple[int, ...]` (variable).',
      '`X | None` (3.10+) is preferred over `typing.Optional[X]` — identical meaning. `X | Y` over `typing.Union[X, Y]`.',
      '`Optional[X]` means "the value can be `X` or `None`", NOT "this argument can be omitted". A parameter is omittable only when it has a DEFAULT. Annotating `str` with a `None` default is a bug — use `str | None`.',
      'A self-referencing or forward annotation must be a STRING (`"Node"`), or add `from __future__ import annotations` to make ALL annotations lazy strings. `typing.get_type_hints(obj)` resolves them to real types.',
      'A bare class annotation (`host: str`, no `=`) adds to `__annotations__` but does NOT create the attribute.',
      'Annotate: public function signatures, boundary return types, complex data shapes, and empty containers (`items: list[User] = []`). Do NOT annotate every local — checkers infer most from the right-hand side.',
    ],
    keyTakeawaysHi: [
      'Type hints ANNOTATIONS hain, checks nahi. Python unhe `__annotations__` mein store karता hai aur runtime par ignore karता hai — `double("ab")` chalता hai chahe hint `int` kahe.',
      'Enforcement ek alag program hai: `mypy` / `pyright` / aapka IDE annotations padhते hain aur mismatches report karते hain. Python runtime ke baare mein kuch nahi badalता.',
      'Syntax: `x: Type`, `x: Type = value`, `def f(p: Type, q: Type = default) -> ReturnType:`. 3.9 se built-in generics: `list[int]`, `dict[str, int]`, `tuple[int, str]` (fixed), `tuple[int, ...]` (variable).',
      '`X | None` (3.10+) `typing.Optional[X]` par preferred hai — samaan matlab. `X | Y` `typing.Union[X, Y]` par.',
      '`Optional[X]` ka matlab "value `X` ya `None` ho sakti hai", "ye argument chhoda ja sakta hai" NAHI. Ek parameter tab omittable hai jab iska DEFAULT hai. `str` ko `None` default ke saath annotate karna ek bug hai — `str | None` istemal karो.',
      'Ek self-referencing ya forward annotation ek STRING (`"Node"`) honi chahiye, ya `from __future__ import annotations` jodो. `typing.get_type_hints(obj)` unhe asli types mein resolve karता hai.',
      'Ek nangi class annotation (`host: str`, bina `=`) `__annotations__` mein jodती hai par attribute NAHI banाती.',
      'Annotate karो: public function signatures, boundary return types, complex data shapes, aur empty containers. Har local NAHI — checkers adhikaansh right-hand side se infer karते hain.',
    ],
  },

  {
    slug: 'py-advanced-typing',
    title: 'Advanced Typing: Callable, TypedDict, Protocol, Generics, Literal',
    titleHi: 'Advanced Typing: Callable, TypedDict, Protocol, Generics, Literal',
    description: 'Annotating a callback parameter as `callback: function` (there is no such type), or typing a config dict as `dict[str, Any]` and losing every autocomplete and check on its keys. The typing module has precise tools for callables, dict shapes, "must have these methods", "one of these exact values", and reusable generic containers.',
    descriptionHi: 'Ek callback parameter ko `callback: function` annotate karna (aisा koi type nahi hai), ya ek config dict ko `dict[str, Any]` type karna aur iski keys par har autocomplete aur check khona. typing module mein callables, dict shapes, "in methods ke saath", "in exact values mein se ek", aur reusable generic containers ke liye precise tools hain.',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Different kinds of job descriptions.** `Callable[[int, str], bool]` is a job spec by *task*: "must accept an int and a string, must return a boolean" — any function that does this qualifies, regardless of its name. `Protocol` is a job spec by *capabilities*: "must be able to `.read()` and `.close()`" — any object with those methods qualifies, even one written years ago by someone who never heard of your protocol (structural typing — it is about shape, not lineage). `TypedDict` is a filled-in form: "this dict must have a `name` key holding a string and an `age` key holding an int" — it turns a shapeless `dict[str, Any]` into a checked structure without making it a class. `Literal["red", "green", "blue"]` is a job spec with a fixed list of acceptable answers: not "a string" but "one of exactly these three strings". And a *generic* — `Stack[T]` — is a job description template with a blank you fill in per use: a `Stack[int]` and a `Stack[User]` are the same code with the element type slotted in, so the checker knows `stack.pop()` gives you back an `int` or a `User` respectively.',
      hi: '**Alag tarah ke job descriptions.** `Callable[[int, str], bool]` *task* se ek job spec hai: "ek int aur ek string accept karे, ek boolean return karे" — koi bhi function jo ye karता hai योग्य hai. `Protocol` *capabilities* se ek job spec hai: "`.read()` aur `.close()` kar sakे" — un methods waala koi bhi object योग्य hai, ek bhi jo saalon pehle kisi ne likha (structural typing — ye aakaar ke baare mein hai, vanshavali ke nahi). `TypedDict` ek bhara hua form hai: "is dict mein ek string rakhने waali `name` key aur ek int rakhने waali `age` key honi chahiye". `Literal["red", "green", "blue"]` ek fixed list of acceptable answers waala ek job spec hai: "ek string" nahi balki "bilkul in teen strings mein se ek". Aur ek *generic* — `Stack[T]` — ek job description template hai prati istemal ek blank aap bharते ho.',
    },

    simple: `**\`Callable\` — the type of a function**

\`\`\`python
from collections.abc import Callable      # (or typing.Callable)

def apply(fn: Callable[[int, int], int], a: int, b: int) -> int:
    return fn(a, b)

on_click: Callable[[], None]              # takes nothing, returns None
key_fn: Callable[[str], int]             # takes a str, returns an int
handler: Callable[..., str]              # any arguments, returns str
\`\`\`

**\`TypedDict\` — a dict with a fixed set of typed keys**

\`\`\`python
from typing import TypedDict

class Movie(TypedDict):
    title: str
    year: int
    rating: float

m: Movie = {"title": "Dune", "year": 2021, "rating": 8.0}
m["yaer"]                                 # checker error: no key 'yaer'
m["year"] + "x"                           # checker error: int + str

class PartialMovie(TypedDict, total=False):   # all keys optional
    title: str
    year: int
\`\`\`

**\`Protocol\` — "any object with these methods" (structural)**

\`\`\`python
from typing import Protocol

class Readable(Protocol):
    def read(self, n: int = -1) -> bytes: ...

def load(src: Readable) -> bytes:         # ANY object with a matching read() works
    return src.read()

# no 'class MyFile(Readable)' needed -- files, BytesIO, your class all match by shape
\`\`\`

**\`Literal\` — one of a fixed set of values**

\`\`\`python
from typing import Literal

def set_mode(mode: Literal["r", "w", "a"]) -> None: ...

set_mode("r")        # ok
set_mode("x")        # checker error: not one of "r", "w", "a"

Color = Literal["red", "green", "blue"]
\`\`\`

**Generics — reusable, type-parameterised code**

\`\`\`python
# Python 3.12+ syntax:
def first[T](items: list[T]) -> T | None:
    return items[0] if items else None

class Box[T]:
    def __init__(self, value: T) -> None:
        self.value = value
    def get(self) -> T:
        return self.value

Box(5).get()         # checker knows this is an int
Box("x").get()       # checker knows this is a str

# pre-3.12 style:
from typing import TypeVar
T = TypeVar("T")
def first(items: list[T]) -> T | None: ...
\`\`\`

\`\`\`
Callable[[ArgTypes], ReturnType]   the type of a function/method/lambda
  Callable[[], None]   Callable[[int], str]   Callable[..., bool]

TypedDict            a dict whose keys and value-types are fixed and checked
  class M(TypedDict): a: int; b: str        total=False -> all keys optional
  Required[...] / NotRequired[...]  per-key (3.11+)

Protocol             structural: "matches if it has these methods/attributes",
  class P(Protocol): def m(self) -> int: ...     NO inheritance required
  @runtime_checkable -> allows isinstance(obj, P) (checks method NAMES only)

Literal["a", "b"]    the value must be exactly one of the listed literals
Union / X | Y        the value is one of several types
TypeAlias:  type Vector = list[float]   (3.12)   |   Vector: TypeAlias = list[float]

GENERICS (3.12 syntax):  def f[T](x: T) -> T     class C[T]: ...
  pre-3.12:  T = TypeVar("T");  def f(x: T) -> T;  class C(Generic[T]): ...
  bounds:  T = TypeVar("T", bound=Comparable)     constraints:  TypeVar("T", int, str)

Self  (3.11)         return type of a method that returns its own instance (fluent APIs)
cast(T, value)       tell the checker "trust me, this is a T" (no runtime effect)
TYPE_CHECKING         if typing.TYPE_CHECKING:  import-only-for-the-checker (break cycles)
# type: ignore[code]  suppress one specific error on that line
\`\`\``,

    simpleHi: `**\`Callable\` — ek function ka type**

\`\`\`python
from collections.abc import Callable

def apply(fn: Callable[[int, int], int], a: int, b: int) -> int:
    return fn(a, b)

on_click: Callable[[], None]              # kuch nahi leta, None lautaता hai
key_fn: Callable[[str], int]             # ek str leta hai, ek int lautaता hai
handler: Callable[..., str]              # koi bhi arguments, str lautaता hai
\`\`\`

**\`TypedDict\` — fixed typed keys waala ek dict**

\`\`\`python
from typing import TypedDict

class Movie(TypedDict):
    title: str
    year: int
    rating: float

m: Movie = {"title": "Dune", "year": 2021, "rating": 8.0}
m["yaer"]                                 # checker error: koi key 'yaer' nahi
m["year"] + "x"                           # checker error: int + str

class PartialMovie(TypedDict, total=False):   # saari keys optional
    title: str
    year: int
\`\`\`

**\`Protocol\` — "in methods waala koi bhi object" (structural)**

\`\`\`python
from typing import Protocol

class Readable(Protocol):
    def read(self, n: int = -1) -> bytes: ...

def load(src: Readable) -> bytes:         # matching read() waala KOI bhi object kaam karता hai
    return src.read()

# koi 'class MyFile(Readable)' nahi chahiye -- files, BytesIO, aapki class sab aakaar se match
\`\`\`

**\`Literal\` — values ke ek fixed set mein se ek**

\`\`\`python
from typing import Literal

def set_mode(mode: Literal["r", "w", "a"]) -> None: ...

set_mode("r")        # ok
set_mode("x")        # checker error: "r", "w", "a" mein se ek nahi
\`\`\`

**Generics — reusable, type-parameterised code**

\`\`\`python
# Python 3.12+ syntax:
def first[T](items: list[T]) -> T | None:
    return items[0] if items else None

class Box[T]:
    def __init__(self, value: T) -> None:
        self.value = value
    def get(self) -> T:
        return self.value

Box(5).get()         # checker jaanता hai ye ek int hai
Box("x").get()       # checker jaanता hai ye ek str hai
\`\`\`

\`\`\`
Callable[[ArgTypes], ReturnType]   ek function/method/lambda ka type
TypedDict            ek dict jiski keys aur value-types fixed aur checked hain
  class M(TypedDict): a: int; b: str        total=False -> saari keys optional
Protocol             structural: "match agar ismein ye methods/attributes hain"
  @runtime_checkable -> isinstance(obj, P) allow karता hai (sirf method NAMES check)
Literal["a", "b"]    value bilkul listed literals mein se ek honi chahiye
Union / X | Y        value kai types mein se ek hai
TypeAlias:  type Vector = list[float]   (3.12)

GENERICS (3.12 syntax):  def f[T](x: T) -> T     class C[T]: ...
  pre-3.12:  T = TypeVar("T");  def f(x: T) -> T;  class C(Generic[T]): ...

Self  (3.11)         ek method ka return type jo apna instance lautaता hai (fluent APIs)
cast(T, value)       checker ko bataओ "bharosa karो, ye ek T hai" (koi runtime effect nahi)
TYPE_CHECKING         if typing.TYPE_CHECKING:  sirf-checker-ke-liye import (cycles todो)
# type: ignore[code]  us line par ek specific error suppress karो
\`\`\``,

    content: `## \`Callable\`

\`\`\`python
from collections.abc import Callable

Callable[[int, str], bool]      # (int, str) -> bool
Callable[[], None]              # () -> None
Callable[..., int]             # any signature, returns int   (the ... is literal)
\`\`\`

You cannot express keyword-only params or default values in \`Callable[...]\` — for a complex signature, use a \`Protocol\` with a \`__call__\` method:

\`\`\`python
class Renderer(Protocol):
    def __call__(self, template: str, *, indent: int = 0) -> str: ...
\`\`\`

## \`TypedDict\` — checked dict shapes

\`\`\`python
class User(TypedDict):
    id: int
    name: str
    email: str

class UserWithOptional(TypedDict):
    id: int
    name: str
    nickname: NotRequired[str]      # 3.11+  -- this one key may be absent

def make_user(name: str) -> User:
    return {"id": next_id(), "name": name, "email": ""}   # checker verifies the shape
\`\`\`

A \`TypedDict\` is a normal \`dict\` at runtime (no class, no methods, no overhead) — the type is purely for the checker. Use it for JSON-shaped data, config dicts, and function \`**kwargs\` shapes, where you want key/value checking without turning the data into a class.

## \`Protocol\` — structural (duck) typing, checked

\`\`\`python
from typing import Protocol, runtime_checkable

class SupportsClose(Protocol):
    def close(self) -> None: ...

def use_then_close(resource: SupportsClose) -> None:
    ...
    resource.close()

# a file, a socket, a DB connection, your own class -- all match without inheriting
\`\`\`

\`Protocol\` is how you type "anything file-like" or "anything with a \`.get()\`" without forcing third-party classes to inherit from your ABC. Contrast with an \`abc.ABC\` (Module 4): an ABC uses *nominal* typing (you must subclass it) and can hold shared code; a \`Protocol\` uses *structural* typing (match by shape) and is check-only unless you add \`@runtime_checkable\` (which then only checks method *names*, not signatures).

## \`Literal\` and \`Enum\`

\`\`\`python
from typing import Literal

Direction = Literal["N", "S", "E", "W"]
def move(d: Direction, steps: int) -> None: ...

# Literal narrows: after 'if mode == "r":' the checker knows mode is Literal["r"] there
\`\`\`

\`Literal\` is lighter than an \`Enum\` for a small closed set of string/int/bool constants that stay in the type system. Use an \`Enum\` when you also want runtime members, iteration, or names.

## Generics — parameterised types

\`\`\`python
# 3.12+ native syntax:
def first[T](xs: list[T]) -> T | None: ...
def pairs[K, V](d: dict[K, V]) -> list[tuple[K, V]]: ...

class Cache[K, V]:
    def __init__(self) -> None:
        self._data: dict[K, V] = {}
    def get(self, key: K) -> V | None:
        return self._data.get(key)
    def set(self, key: K, value: V) -> None:
        self._data[key] = value

c: Cache[str, int] = Cache()
c.set("a", 1)
reveal_type(c.get("a"))     # int | None
\`\`\`

\`\`\`python
# pre-3.12:
from typing import TypeVar, Generic
T = TypeVar("T")
def first(xs: list[T]) -> T | None: ...

class Cache(Generic[K, V]): ...     # with K = TypeVar("K"), V = TypeVar("V")
\`\`\`

**Bounds and constraints:**

\`\`\`python
from typing import TypeVar
Num = TypeVar("Num", int, float)          # constrained: exactly int OR float
T = TypeVar("T", bound="SupportsLessThan")  # bounded: T or any subtype
\`\`\`

## \`Self\` — fluent APIs and copy methods

\`\`\`python
from typing import Self

class QueryBuilder:
    def where(self, cond: str) -> Self:
        self._conds.append(cond)
        return self                       # a subclass's .where() returns the subclass type

qb = QueryBuilder().where("a = 1").where("b = 2")   # checker keeps the chain typed
\`\`\`

## \`cast\`, \`# type: ignore\`, and \`TYPE_CHECKING\`

\`\`\`python
from typing import cast, TYPE_CHECKING

x = cast(int, some_any_value)             # "I know this is an int" -- no runtime check

result = risky()  # type: ignore[return-value]   # suppress ONE specific error, with the code

if TYPE_CHECKING:
    from .models import User              # imported only by the checker, not at runtime
                                          # -- breaks import cycles caused purely by hints
def get(id: int) -> "User": ...
\`\`\`

Use \`cast\` sparingly (it silences the checker without proof), \`# type: ignore[code]\` with the specific error code (never a bare \`# type: ignore\`), and \`TYPE_CHECKING\` to import names that are only needed in annotations.`,

    contentHi: `## \`Callable\`

\`\`\`python
from collections.abc import Callable

Callable[[int, str], bool]      # (int, str) -> bool
Callable[[], None]              # () -> None
Callable[..., int]             # koi bhi signature, int lautaता hai
\`\`\`

Aap \`Callable[...]\` mein keyword-only params ya default values express nahi kar sakte — ek complex signature ke liye, ek \`__call__\` method waala \`Protocol\` istemal karो.

## \`TypedDict\` — checked dict shapes

\`\`\`python
class User(TypedDict):
    id: int
    name: str
    email: str

class UserWithOptional(TypedDict):
    id: int
    name: str
    nickname: NotRequired[str]      # 3.11+  -- ye ek key absent ho sakti hai
\`\`\`

Ek \`TypedDict\` runtime par ek normal \`dict\` hai (koi class, koi methods, koi overhead) — type shuddh roop se checker ke liye hai. Ise JSON-shaped data, config dicts ke liye istemal karो.

## \`Protocol\` — structural (duck) typing, checked

\`\`\`python
from typing import Protocol, runtime_checkable

class SupportsClose(Protocol):
    def close(self) -> None: ...

def use_then_close(resource: SupportsClose) -> None:
    resource.close()
\`\`\`

\`Protocol\` aise aap "kuch bhi file-jaisा" type karते ho bina third-party classes ko aapki ABC se inherit karne par majboor kiye. Ek \`abc.ABC\` ke विpreet: ek ABC *nominal* typing istemal karती hai; ek \`Protocol\` *structural* typing (aakaar se match) aur check-only jab tak aap \`@runtime_checkable\` na jodें.

## \`Literal\` aur \`Enum\`

\`\`\`python
from typing import Literal

Direction = Literal["N", "S", "E", "W"]
def move(d: Direction, steps: int) -> None: ...
\`\`\`

\`Literal\` string/int/bool constants ke ek chhote closed set ke liye ek \`Enum\` se halka hai. Ek \`Enum\` istemal karो jab aap runtime members, iteration, ya names bhi chahते ho.

## Generics — parameterised types

\`\`\`python
# 3.12+ native syntax:
def first[T](xs: list[T]) -> T | None: ...

class Cache[K, V]:
    def __init__(self) -> None:
        self._data: dict[K, V] = {}
    def get(self, key: K) -> V | None:
        return self._data.get(key)

c: Cache[str, int] = Cache()
c.set("a", 1)
reveal_type(c.get("a"))     # int | None
\`\`\`

**Bounds aur constraints:**

\`\`\`python
Num = TypeVar("Num", int, float)          # constrained: bilkul int YA float
T = TypeVar("T", bound="SupportsLessThan")  # bounded: T ya koi subtype
\`\`\`

## \`Self\` — fluent APIs

\`\`\`python
from typing import Self

class QueryBuilder:
    def where(self, cond: str) -> Self:
        self._conds.append(cond)
        return self
\`\`\`

## \`cast\`, \`# type: ignore\`, aur \`TYPE_CHECKING\`

\`\`\`python
from typing import cast, TYPE_CHECKING

x = cast(int, some_any_value)             # "main jaanता hoon ye ek int hai"
result = risky()  # type: ignore[return-value]   # ek specific error suppress, code ke saath

if TYPE_CHECKING:
    from .models import User              # sirf checker dwara import, runtime par nahi
def get(id: int) -> "User": ...
\`\`\`

\`cast\` ko kamdी se istemal karो, \`# type: ignore[code]\` specific error code ke saath, aur \`TYPE_CHECKING\` un names ko import karne ko jo sirf annotations mein chahiye.`,

    examples: [
      {
        title: 'TypedDict and Protocol at runtime: just dicts and duck typing',
        titleHi: 'TypedDict aur Protocol runtime par: bस dicts aur duck typing',
        code: `from typing import TypedDict, Protocol, runtime_checkable

class Point(TypedDict):
    x: int
    y: int

# at runtime a TypedDict instance IS a plain dict:
p: Point = {"x": 1, "y": 2}
print("type:", type(p).__name__)
print("is dict:", isinstance(p, dict))
print("access:", p["x"], p["y"])
# nothing stops a wrong shape at runtime -- only the checker would:
bad: Point = {"x": 1}          # missing 'y' -- runs fine, checker flags it
print("bad:", bad)

@runtime_checkable
class Sized(Protocol):
    def __len__(self) -> int: ...

# structural: anything with __len__ satisfies Sized -- no inheritance
for obj in [[1, 2, 3], "abcd", {"a": 1}, (1,)]:
    print(f"{obj!r:12} is Sized: {isinstance(obj, Sized)}  len={len(obj)}")

class NoLen:
    pass
print("NoLen() is Sized:", isinstance(NoLen(), Sized))`,
        output: `type: dict
is dict: True
access: 1 2
bad: {'x': 1}
[1, 2, 3]    is Sized: True  len=3
'abcd'       is Sized: True  len=4
{'a': 1}     is Sized: True  len=1
(1,)         is Sized: True  len=1
NoLen() is Sized: False`,
        explain: 'A `TypedDict` value is a plain `dict` at runtime — `type(p)` is `dict`, and `{"x": 1}` (missing `y`) runs without error; only a type checker would flag the missing key. A `@runtime_checkable` `Protocol` lets `isinstance` check structurally: any object with `__len__` is a `Sized`, regardless of its class, and `NoLen()` (no `__len__`) is not. Without `@runtime_checkable`, `isinstance` against a Protocol raises.',
        explainHi: 'Ek `TypedDict` value runtime par ek plain `dict` hai — `type(p)` `dict` hai, aur `{"x": 1}` (missing `y`) bina error chalता hai; sirf ek type checker missing key flag karता. Ek `@runtime_checkable` `Protocol` `isinstance` ko structurally check karne deta hai: `__len__` waala koi bhi object ek `Sized` hai. `@runtime_checkable` ke bina, ek Protocol ke khilaaf `isinstance` raise karता hai.',
      },
      {
        title: 'Generics: a type-parameterised Stack (3.12 syntax)',
        titleHi: 'Generics: ek type-parameterised Stack (3.12 syntax)',
        code: `class Stack[T]:
    def __init__(self) -> None:
        self._items: list[T] = []
    def push(self, item: T) -> None:
        self._items.append(item)
    def pop(self) -> T:
        return self._items.pop()
    def peek(self) -> T | None:
        return self._items[-1] if self._items else None
    def __len__(self) -> int:
        return len(self._items)

# int stack:
nums: Stack[int] = Stack()
nums.push(1); nums.push(2); nums.push(3)
print("popped:", nums.pop(), "| peek:", nums.peek(), "| len:", len(nums))

# str stack -- same class, different element type:
words: Stack[str] = Stack()
words.push("a"); words.push("b")
print("popped:", words.pop(), "| peek:", words.peek())

# a generic function:
def first_or[T](items: list[T], default: T) -> T:
    return items[0] if items else default

print(first_or([10, 20], 0))
print(first_or([], "none"))
print(first_or(["x", "y"], "z"))`,
        output: `popped: 3 | peek: 2 | len: 2
popped: b | peek: a
10
none
x`,
        explain: '`Stack[T]` is one class definition that works for any element type; `Stack[int]` and `Stack[str]` are the same code with `T` bound to `int` or `str`. A type checker uses that binding to know `nums.pop()` returns `int` and `words.pop()` returns `str`. The `def first_or[T](...)` function is generic too — the checker infers `T` from the arguments and checks that `default` matches the list element type. At runtime, the `[T]` is erased and it is a normal class/function.',
        explainHi: '`Stack[T]` ek class definition hai jo kisi bhi element type ke liye kaam karती hai; `Stack[int]` aur `Stack[str]` wahi code hai `T` ke `int` ya `str` bound ke saath. Ek type checker us binding ko `nums.pop()` `int` lautaता hai jaanने ko istemal karता hai. Runtime par, `[T]` erase ho jaता hai.',
      },
      {
        title: 'Callable, Literal, and Self',
        titleHi: 'Callable, Literal, aur Self',
        code: `from collections.abc import Callable
from typing import Literal, Self

# Callable as a parameter type:
def transform(data: list[int], fn: Callable[[int], int]) -> list[int]:
    return [fn(x) for x in data]

print(transform([1, 2, 3], lambda x: x * 10))
print(transform([1, 2, 3], abs))

# Literal restricts to exact values:
def align(text: str, side: Literal["left", "right", "center"], width: int) -> str:
    if side == "left":
        return text.ljust(width)
    if side == "right":
        return text.rjust(width)
    return text.center(width)

print(repr(align("hi", "left", 6)))
print(repr(align("hi", "right", 6)))
print(repr(align("hi", "center", 6)))

# Self keeps a fluent chain typed:
class Query:
    def __init__(self) -> None:
        self.parts: list[str] = []
    def select(self, *cols: str) -> Self:
        self.parts.append("SELECT " + ", ".join(cols))
        return self
    def where(self, cond: str) -> Self:
        self.parts.append("WHERE " + cond)
        return self
    def build(self) -> str:
        return " ".join(self.parts)

sql = Query().select("id", "name").where("age > 18").build()
print(sql)`,
        output: `[10, 20, 30]
[1, 2, 3]
'hi    '
'    hi'
'  hi  '
SELECT id, name WHERE age > 18`,
        explain: '`Callable[[int], int]` types `fn` as "a function taking one int, returning an int" — both the lambda and `abs` match. `Literal["left", "right", "center"]` means `side` must be exactly one of those three strings; a checker rejects any other value and narrows `side` inside each `if`. `Self` as the return type of `select`/`where` lets the checker follow the fluent chain and know each step still returns a `Query` (or a subclass, correctly).',
        explainHi: '`Callable[[int], int]` `fn` ko "ek int lene waala, ek int lautaने waala function" type karता hai. `Literal["left", "right", "center"]` matlab `side` bilkul un teen strings mein se ek honi chahiye. `select`/`where` ke return type ki tarah `Self` checker ko fluent chain follow karne aur har step abhi bhi ek `Query` lautaता hai jaanने deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `def run(callback: function) -> None:    # NameError: 'function' is not defined
    callback()`,
        right: `from collections.abc import Callable
def run(callback: Callable[[], None]) -> None:
    callback()`,
        why: 'There is no built-in type named `function` you can use in an annotation. To type a callable parameter, use `Callable[[ArgТypes], ReturnType]` from `collections.abc` (or `typing`). For a signature too complex for `Callable` (keyword-only args, defaults, overloads), define a `Protocol` with a `__call__` method.',
        whyHi: 'Annotation mein istemal karne ke liye `function` naam ka koi built-in type nahi hai. Ek callable parameter type karne ko, `collections.abc` (ya `typing`) se `Callable[[ArgTypes], ReturnType]` istemal karो. `Callable` ke liye bahut complex signature ke liye, ek `__call__` method waala `Protocol` define karो.',
      },
      {
        wrong: `def create(data: dict[str, Any]) -> None:   # no key checking, no autocomplete
    name = data["naem"]                     # typo not caught
    age = data["age"] + "1"                 # type error not caught`,
        right: `class CreateData(TypedDict):
    name: str
    age: int

def create(data: CreateData) -> None:
    name = data["naem"]     # checker: no key 'naem'
    age = data["age"] + "1" # checker: int + str`,
        why: '`dict[str, Any]` tells the checker nothing about the keys or value types, so typos in key names and type mismatches on values pass silently. A `TypedDict` declares the exact shape — the checker then verifies every key access and value use. It is a plain dict at runtime, so there is no cost.',
        whyHi: '`dict[str, Any]` checker ko keys ya value types ke baare mein kuch nahi bataता, isliye key names mein typos aur values par type mismatches chupchaap pass hote hain. Ek `TypedDict` exact aakaar declare karता hai. Ye runtime par ek plain dict hai, isliye koi keemat nahi.',
      },
      {
        wrong: `from typing import Protocol
class Comparable(Protocol):
    def __lt__(self, other) -> bool: ...

def smallest(items: list[Comparable]):
    return min(items)

isinstance(x, Comparable)     # TypeError: Protocols cannot be used with isinstance()`,
        right: `from typing import Protocol, runtime_checkable

@runtime_checkable
class Comparable(Protocol):
    def __lt__(self, other: object) -> bool: ...

isinstance(x, Comparable)     # works -- but checks METHOD NAMES only, not signatures`,
        why: 'A `Protocol` is a static-checking construct by default; using it with `isinstance` raises `TypeError` unless you decorate it with `@runtime_checkable`. Even then, the runtime check only verifies that the required method *names* exist — it does not check argument counts, types, or return types. For real runtime validation, check the specific methods yourself or use an ABC.',
        whyHi: 'Ek `Protocol` default se ek static-checking construct hai; ise `isinstance` ke saath istemal karna `TypeError` deta hai jab tak aap ise `@runtime_checkable` se decorate na karें. Tab bhi, runtime check sirf verify karता hai ki zaroori method *names* maujood hain — ye argument counts, types check nahi karता.',
      },
    ],

    realWorld: [
      {
        en: '**`TypedDict` types the shape of JSON payloads, `**kwargs`, and config dicts across Django/DRF and FastAPI code** — a request body, a webhook payload, a settings block. `NotRequired` (3.11) marks optional keys. It gives you key/value checking without a class or serializer for internal, trusted data.',
        hi: '**`TypedDict` JSON payloads, `**kwargs`, aur config dicts ke aakaar ko type karता hai** — ek request body, ek webhook payload. `NotRequired` (3.11) optional keys mark karता hai. Ye aapko internal, trusted data ke liye ek class ya serializer ke bina key/value checking deता hai.',
      },
      {
        en: '**`Protocol` is how modern typed Python expresses "file-like", "supports `.get()`", "any DB connection"** without an inheritance requirement. `typing.Protocol` underlies `SupportsInt`, `SupportsRead`, etc. in the stdlib. DRF renderers/parsers/permissions are effectively protocols enforced by convention.',
        hi: '**`Protocol` aise modern typed Python "file-like", "`.get()` support karता", "koi bhi DB connection" express karता hai** bina ek inheritance requirement. `typing.Protocol` stdlib mein `SupportsInt`, `SupportsRead` ke neeche hai.',
      },
      {
        en: '**Generics show up in typed collection helpers and repositories** — `Repository[User]`, `Cache[str, bytes]`, `Result[T, E]`. `Self` types every fluent builder (Django `QuerySet` chaining, DRF, SQLAlchemy). `Literal` types `mode="r"`, HTTP methods, log levels, feature-flag names.',
        hi: '**Generics typed collection helpers aur repositories mein dikhते hain** — `Repository[User]`, `Cache[str, bytes]`. `Self` har fluent builder type karता hai (Django `QuerySet` chaining). `Literal` `mode="r"`, HTTP methods, log levels type karता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a `Protocol` and an abstract base class (`abc.ABC`)?',
        qHi: 'Ek `Protocol` aur ek abstract base class (`abc.ABC`) mein kya antar hai?',
        a: 'Both express "a type must provide these methods", but they use opposite typing disciplines. An abstract base class uses nominal typing: a class only counts as a subtype if it explicitly inherits from the ABC, or is registered with it. The ABC can mark methods abstract, and Python refuses to instantiate the ABC or any subclass that has not implemented all of them, so the check happens at object-creation time and is enforced by the runtime. An ABC can also contain concrete methods that all subclasses inherit, which is a major reason to use one — shared implementation plus an enforced interface. A Protocol uses structural typing: any class that happens to have methods with matching names and signatures satisfies the Protocol, whether or not it has ever heard of it, and whether or not it inherits anything. There is no runtime enforcement by default — a static type checker verifies conformance by comparing shapes. This is duck typing made checkable. You use an ABC when you own the hierarchy, want to share concrete code, and want a hard failure at instantiation if a method is missing — a family of storage backends you maintain, an internal plugin system. You use a Protocol when you want to describe the shape a function needs without forcing callers to inherit from your class, particularly when some of those callers are third-party types you cannot modify, or when inheritance would be an artificial relationship — a function that accepts "anything with a read method" should annotate a Protocol, not require a subclass. A Protocol is check-only unless you add the runtime_checkable decorator, which then lets isinstance work but only verifies that the method names exist, not their signatures. The two compose: you can have a Protocol for the external contract and an ABC for your own base implementation of it.',
        aHi: 'Dono "ek type ko ye methods dene chahiye" express karते hain, par wo ulti typing disciplines istemal karते hain. Ek abstract base class nominal typing istemal karता hai: ek class sirf tab ek subtype ginti hai agar ye spasht roop se ABC se inherit karती hai. ABC methods abstract mark kar sakti hai, aur Python ABC ya kisi bhi subclass ko jisne sabko implement nahi kiya instantiate karne se mana karता hai. Ek ABC mein concrete methods bhi ho sakte hain jo saare subclasses inherit karते hain. Ek Protocol structural typing istemal karता hai: matching names aur signatures waale methods rakhने waali koi bhi class Protocol ko satisfy karती hai. Default se koi runtime enforcement nahi — ek static type checker aakaaron ki tulना karके conformance verify karता hai. Aap ek ABC tab istemal karते ho jab aap hierarchy ke maalik ho. Aap ek Protocol tab istemal karते ho jab aap wo aakaar describe karna chahте ho jo ek function ko chahiye bina callers ko inherit karne par majboor kiye.',
      },
      {
        q: 'What is `TypedDict` for, and when would you use it over a dataclass or a Pydantic model?',
        qHi: '`TypedDict` kis liye hai, aur aap ise ek dataclass ya ek Pydantic model par kab istemal karoge?',
        a: 'TypedDict declares the shape of a dictionary: the exact set of string keys it should have and the type of each value. It exists so that a type checker can verify key accesses and value uses on a dict that stays a dict — a misspelled key, a wrong-typed value, a missing required key are all reported statically. At runtime a TypedDict is nothing: instances are plain dicts, there is no class, no methods, no validation, no overhead. The type information lives only in the checker. You reach for it when you have dictionary-shaped data that you want checked but do not want to convert into an object. The clearest cases are JSON payloads and API request or response bodies that you handle as dicts, the shape of a function\'s star-star-kwargs, and internal configuration dictionaries. It is the right choice when the data is trusted — you or your own code produced it — so you need static checking for correctness during development but not runtime validation. Contrast a dataclass, which is a real class with attribute access, a generated init, repr, and eq, methods you can add, and instances that are distinct objects; you use it when the structure has an identity as a concept, needs behaviour, or benefits from attribute rather than key access. Contrast Pydantic\'s BaseModel, which is a dataclass-like structure plus runtime validation and coercion — it checks that incoming values match the declared types and converts where sensible, raising structured errors otherwise. You use Pydantic, or a framework built on the same idea like a DRF serializer, at trust boundaries: parsing an external API request, loading a config file a user can edit, validating anything you did not produce. The rough decision: TypedDict for trusted dict-shaped data checked statically; dataclass for a structured object with identity or behaviour; Pydantic for untrusted input that needs runtime validation.',
        aHi: 'TypedDict ek dictionary ka aakaar declare karता hai: string keys ka exact set jo iske paas hona chahiye aur har value ka type. Ye isliye maujood hai taaki ek type checker ek dict par key accesses aur value uses verify kar sake jo ek dict rehta hai. Runtime par ek TypedDict kuch nahi hai: instances plain dicts hain, koi class nahi, koi validation nahi, koi overhead nahi. Aap iske liye tab pahunchते ho jab aapke paas dictionary-shaped data hai jise aap checked chahते ho par ek object mein convert nahi karna chahте. Sabse spasht cases JSON payloads aur API request ya response bodies hain. Ye sahi chunaav hai jab data trusted hai. Ek dataclass ke विpreet, jo attribute access ke saath ek asli class hai. Pydantic ke BaseModel ke विpreet, jo ek dataclass-jaisा structure plus runtime validation aur coercion hai. Aap Pydantic ko trust boundaries par istemal karते ho.',
      },
    ],

    exercises: [
      {
        task: 'Define `Handler = Callable[[str], str]` and `MIDDLEWARE: list[Handler]`. Write `pipeline(handlers: list[Handler], text: str) -> str` that applies each handler in order. Test with `[str.upper, lambda s: s + "!", str.strip.__call__]`-style handlers. Confirm at runtime the `Callable` annotation does nothing (a non-matching function would still run).',
        taskHi: '`Handler = Callable[[str], str]` aur `MIDDLEWARE: list[Handler]` define karो. `pipeline(handlers, text)` likhо jo har handler ko kram mein lagaाe. Confirm karो runtime par `Callable` annotation kuch nahi karता.',
        hint: '`from collections.abc import Callable`; `Handler = Callable[[str], str]`. `pipeline`: `for h in handlers: text = h(text); return text`. A handler returning an int would still run at runtime — only mypy would flag it.',
        hintHi: '`from collections.abc import Callable`; `Handler = Callable[[str], str]`. `pipeline`: `for h in handlers: text = h(text); return text`.',
      },
      {
        task: 'Define `class Address(TypedDict): street: str; city: str; zip: str` and `class Person(TypedDict): name: str; age: int; address: Address` (nested). Build a valid `Person` dict and access `p["address"]["city"]`. Then build one with a missing key and a wrong-typed value — confirm both RUN without error (only a checker catches them). Print `Person.__required_keys__`.',
        taskHi: 'Nested `TypedDict`s `Address` aur `Person` define karो. Ek valid `Person` dict banाओ aur `p["address"]["city"]` access karो. Phir ek missing key aur ek wrong-typed value ke saath ek banाओ — confirm karो dono bina error CHALTे hain.',
        hint: '`Person.__required_keys__` is `frozenset({\'name\', \'age\', \'address\'})`. A `Person` dict missing `age`, or with `age="30"`, runs fine — TypedDict has zero runtime behaviour. `total=False` or `NotRequired[...]` would make keys optional in the type system.',
        hintHi: '`Person.__required_keys__` `frozenset({\'name\', \'age\', \'address\'})` hai. `age` missing waala ya `age="30"` waala ek `Person` dict theek chalता hai — TypedDict ka zero runtime behaviour hai.',
      },
      {
        task: 'Write a generic `class Pair[A, B]` with `first: A`, `second: B`, a `swap(self) -> "Pair[B, A]"` method, and `__repr__`. Create `Pair(1, "x")`, call `.swap()`, and print both. Then write `def zip_pairs[A, B](xs: list[A], ys: list[B]) -> list[Pair[A, B]]`. Confirm it works for `zip_pairs([1,2], ["a","b"])`.',
        taskHi: 'Ek generic `class Pair[A, B]` likhо `first: A`, `second: B`, ek `swap(self) -> "Pair[B, A]"` method, aur `__repr__` ke saath. `Pair(1, "x")` banाओ, `.swap()` call karो. Phir `def zip_pairs[A, B](...)` likhо.',
        hint: '`class Pair[A, B]: def __init__(self, first: A, second: B): ...; def swap(self) -> "Pair[B, A]": return Pair(self.second, self.first)`. `zip_pairs`: `return [Pair(a, b) for a, b in zip(xs, ys)]`. The `[A, B]` is erased at runtime.',
        hintHi: '`class Pair[A, B]: def __init__(self, first: A, second: B): ...; def swap(self) -> "Pair[B, A]": return Pair(self.second, self.first)`. `zip_pairs`: `return [Pair(a, b) for a, b in zip(xs, ys)]`.',
      },
    ],

    keyTakeaways: [
      '`Callable[[ArgТypes], ReturnType]` types a function parameter — `Callable[[], None]`, `Callable[[int], str]`, `Callable[..., bool]`. For a complex signature (kwargs, defaults), use a `Protocol` with `__call__`.',
      '`TypedDict` declares a dict\'s exact keys and value types — checked statically, a plain `dict` at runtime (no class, no cost). Use for JSON payloads, `**kwargs`, config. `total=False` / `NotRequired[...]` for optional keys.',
      '`Protocol` is structural typing: any object with matching methods/attributes satisfies it — no inheritance. Contrast `abc.ABC` (nominal — must subclass, can hold code, enforced at instantiation).',
      'A `Protocol` is check-only unless decorated `@runtime_checkable`, which then lets `isinstance` work but checks method NAMES only, not signatures.',
      '`Literal["a", "b", "c"]` restricts a value to exactly those literals — lighter than an `Enum` for a small closed set that stays in the type system.',
      'Generics (3.12 syntax): `def f[T](x: T) -> T`, `class Box[T]: ...`. Pre-3.12: `T = TypeVar("T")` + `Generic[T]`. Bounds `TypeVar("T", bound=X)`; constraints `TypeVar("T", int, str)`. The `[T]` is erased at runtime.',
      '`Self` (3.11) is the return type for fluent methods and copy constructors — a subclass\'s method correctly returns the subclass type.',
      '`cast(T, x)` silences the checker without proof (use sparingly). `# type: ignore[code]` suppresses ONE error with its code. `if TYPE_CHECKING:` imports names only for the checker (breaks hint-only import cycles).',
    ],
    keyTakeawaysHi: [
      '`Callable[[ArgTypes], ReturnType]` ek function parameter type karता hai — `Callable[[], None]`, `Callable[[int], str]`, `Callable[..., bool]`. Ek complex signature ke liye, ek `__call__` waala `Protocol` istemal karो.',
      '`TypedDict` ek dict ki exact keys aur value types declare karता hai — statically checked, runtime par ek plain `dict` (koi class, koi keemat). JSON payloads, `**kwargs`, config ke liye. Optional keys ke liye `total=False` / `NotRequired[...]`.',
      '`Protocol` structural typing hai: matching methods/attributes waala koi bhi object ise satisfy karता hai — koi inheritance nahi. `abc.ABC` ke विpreet (nominal — subclass karna hoga, code rakh sakti hai).',
      'Ek `Protocol` check-only hai jab tak `@runtime_checkable` se decorate na kiya jaaye, jo phir `isinstance` ko kaam karne deta hai par sirf method NAMES check karता hai.',
      '`Literal["a", "b", "c"]` ek value ko bilkul un literals tak seemit karता hai — ek chhote closed set ke liye ek `Enum` se halka.',
      'Generics (3.12 syntax): `def f[T](x: T) -> T`, `class Box[T]: ...`. Pre-3.12: `T = TypeVar("T")` + `Generic[T]`. `[T]` runtime par erase ho jाता hai.',
      '`Self` (3.11) fluent methods aur copy constructors ke liye return type hai.',
      '`cast(T, x)` checker ko bina proof chup karता hai (kamdी se istemal karो). `# type: ignore[code]` ek error ko iske code ke saath suppress karता hai. `if TYPE_CHECKING:` names sirf checker ke liye import karता hai.',
    ],
  },

  {
    slug: 'py-mypy-gradual-typing',
    title: 'mypy, pyright, and Gradual Typing',
    titleHi: 'mypy, pyright, Aur Gradual Typing',
    description: 'Adding hints to a 30,000-line untyped codebase and being told there is no point unless you type all of it at once — which is false. Type checking is gradual: you add annotations file by file, run the checker as a separate step (in CI and your editor), and tighten the rules over time. This lesson is how to actually run it and read what it tells you.',
    descriptionHi: 'Ek 30,000-line untyped codebase mein hints jodना aur bataya jaana ki koi matlab nahi jab tak aap ek baar mein sab type na karें — jo galat hai. Type checking gradual hai: aap file-dar-file annotations jodते ho, checker ko ek alag step ki tarah chalाते ho (CI aur aapke editor mein), aur samay ke saath rules kaste ho. Ye lesson hai ise asal mein kaise chalाना aur jo ye bataता hai use kaise padhना.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A spell-checker you switch on for one document at a time.** You do not have to spell-check your entire filing cabinet before the tool is useful — you run it on the letter you are writing today, fix what it flags, and move on. Tomorrow you run it on another document. Over months, more and more of your files have been checked, and you can raise the standard: start with "flag obvious errors only", later switch on "flag questionable grammar too". A type checker works the same way. It is a separate program — not the Python interpreter — that reads your annotations and reports inconsistencies without running the code. You point it at a file or a package; it tells you every place where a declared type and an actual type disagree, where a function can return `None` but a caller uses the result without checking, where an assignment changes a variable\'s type. Code with no annotations is simply not checked deeply (that is "gradual" — untyped is allowed, just unverified), so you can adopt it incrementally: annotate the modules that change most or break most often first, wire the checker into CI so new code stays clean, and turn on stricter flags as coverage grows.',
      hi: '**Ek spell-checker jise aap ek document ke liye ek baar chalू karते ho.** Aapko tool ke upyogi hone se pehle apni poori filing cabinet spell-check karne ki zaroorat nahi — aap ise aaj likh rahe letter par chalाते ho, jo ye flag karता hai theek karते ho. Kal aap ek doosre document par chalाते ho. Mahinon mein, aur aur files check ho chuki hain, aur aap standard uठा sakte ho. Ek type checker isi tarah kaam karता hai. Ye ek alag program hai — Python interpreter nahi — jo aapke annotations padhता hai aur inconsistencies report karता hai bina code chalाye. Bina annotations waala code bस gehraai se check nahi hoता (wo "gradual" hai), isliye aap ise dheere-dheere apnा sakte ho: pehle un modules ko annotate karो jo sabse zyaada badalते ya sabse zyaada tootते hain, checker ko CI mein wire karो, aur coverage badhने par stricter flags chalू karो.',
    },

    simple: `**Running the checker**

\`\`\`bash
pip install mypy                     # or: pip install pyright  (or use pyright in your editor)

mypy myfile.py                       # check one file
mypy mypackage/                      # check a package
mypy .                               # check everything importable from here

mypy --strict myfile.py              # all optional checks on
mypy --disallow-untyped-defs src/    # require every function to be annotated
\`\`\`

**What an error looks like**

\`\`\`
myfile.py:12: error: Argument 1 to "greet" has incompatible type "int"; expected "str"  [arg-type]
myfile.py:20: error: Item "None" of "str | None" has no attribute "upper"  [union-attr]
myfile.py:25: error: Incompatible return value type (got "None", expected "int")  [return-value]
myfile.py:30: error: Incompatible types in assignment (expression has type "str", variable has type "int")  [assignment]
\`\`\`

Every line is \`file:line: error: message  [error-code]\`. The \`[code]\` is what you put in \`# type: ignore[code]\` to suppress that one.

**The three most common errors**

\`\`\`python
# 1. using an Optional without checking for None:
def name_upper(user: User | None) -> str:
    return user.name.upper()          # error: user could be None
    # fix:
    if user is None:
        return ""
    return user.name.upper()          # here the checker knows user is a User

# 2. a function that says it returns X but sometimes returns None:
def find(k: str) -> int:
    if k in data:
        return data[k]
    # falls off the end -> implicitly returns None -> error: expected int
    # fix: return a default, or annotate -> int | None

# 3. reassigning a variable to a different type:
count: int = 0
count = "many"                        # error: str is not int
\`\`\`

**\`reveal_type\` — ask the checker what it thinks**

\`\`\`python
x = some_function()
reveal_type(x)          # mypy prints: note: Revealed type is "builtins.list[builtins.int]"
                        # (reveal_type is only understood by the checker; remove it after)
\`\`\`

**Gradual: untyped code is allowed, just unchecked**

\`\`\`python
def typed(a: int) -> int:
    return a * 2

def untyped(a):                       # no annotations -> mypy treats a and the return as Any
    return a * 2                      # not checked, not an error (unless --disallow-untyped-defs)
\`\`\`

\`\`\`
mypy / pyright   a SEPARATE program (not the interpreter) that reads annotations
                 and reports type inconsistencies WITHOUT running your code.
                 Run it: in CI (fail the build on errors), and live in your editor.

mypy file.py | package/ | .          check that scope
--strict                             turn on every optional check
--disallow-untyped-defs              every function must be annotated
--ignore-missing-imports             don't error on untyped 3rd-party libs (or install stubs)
--check-untyped-defs                 also check the bodies of unannotated functions

ERROR FORMAT:  file:line: error: <message>  [error-code]
SUPPRESS:      x = risky()  # type: ignore[assignment]   (always with the specific code)
ASK:           reveal_type(x)   -> the checker prints its inferred type (dev-only)

GRADUAL ADOPTION:
  1. add mypy to CI with a lax config; fix what it finds
  2. annotate high-churn / bug-prone modules first
  3. per-module strictness in pyproject.toml (tighten module by module)
  4. eventually --strict for the whole project

WHY:  catches None-bugs, wrong arguments, bad returns, and refactor breakage
      BEFORE runtime; makes signatures self-documenting; makes large refactors safe.
\`\`\``,

    simpleHi: `**Checker chalाना**

\`\`\`bash
pip install mypy

mypy myfile.py                       # ek file check karो
mypy mypackage/                      # ek package check karो
mypy .                               # yahaan se importable sab kuch check karो

mypy --strict myfile.py              # saare optional checks on
mypy --disallow-untyped-defs src/    # har function ko annotated hona chahiye
\`\`\`

**Ek error kaisा dikhता hai**

\`\`\`
myfile.py:12: error: Argument 1 to "greet" has incompatible type "int"; expected "str"  [arg-type]
myfile.py:20: error: Item "None" of "str | None" has no attribute "upper"  [union-attr]
myfile.py:25: error: Incompatible return value type (got "None", expected "int")  [return-value]
\`\`\`

Har line \`file:line: error: message  [error-code]\` hai. \`[code]\` wo hai jo aap us ek ko suppress karne ko \`# type: ignore[code]\` mein daalते ho.

**Teen sabse aam errors**

\`\`\`python
# 1. ek Optional ko None check kiye bina istemal karna:
def name_upper(user: User | None) -> str:
    return user.name.upper()          # error: user None ho sakta hai
    # fix:
    if user is None:
        return ""
    return user.name.upper()          # yahaan checker jaanता hai user ek User hai

# 2. ek function jo kehta hai X lautaता hai par kabhi None lautaता hai:
def find(k: str) -> int:
    if k in data:
        return data[k]
    # ant se gir jाता hai -> implicitly None lautaता hai -> error

# 3. ek variable ko ek alag type mein reassign karna:
count: int = 0
count = "many"                        # error: str int nahi hai
\`\`\`

**\`reveal_type\` — checker se poochho ye kya sochता hai**

\`\`\`python
x = some_function()
reveal_type(x)          # mypy prints: note: Revealed type is "builtins.list[builtins.int]"
\`\`\`

**Gradual: untyped code allowed hai, bस unchecked**

\`\`\`python
def typed(a: int) -> int:
    return a * 2

def untyped(a):                       # koi annotations nahi -> mypy a aur return ko Any maanता hai
    return a * 2                      # checked nahi, ek error nahi
\`\`\`

\`\`\`
mypy / pyright   ek ALAG program (interpreter nahi) jo annotations padhता hai
                 aur type inconsistencies report karता hai BINA aapka code chalाye.
                 Ise chalाओ: CI mein, aur aapke editor mein live.

mypy file.py | package/ | .          us scope ko check karो
--strict                             har optional check on
--disallow-untyped-defs              har function annotated hona chahiye
--ignore-missing-imports             untyped 3rd-party libs par error mat karो

ERROR FORMAT:  file:line: error: <message>  [error-code]
SUPPRESS:      x = risky()  # type: ignore[assignment]   (hamesha specific code ke saath)
ASK:           reveal_type(x)   -> checker apna inferred type print karता hai (dev-only)

GRADUAL ADOPTION:
  1. ek lax config ke saath mypy ko CI mein jodो
  2. pehle high-churn / bug-prone modules annotate karो
  3. pyproject.toml mein per-module strictness
  4. aakhirkar poore project ke liye --strict

KYUN:  None-bugs, galat arguments, kharaab returns, aur refactor breakage
       RUNTIME SE PEHLE pakadता hai; signatures ko self-documenting banाता hai.
\`\`\``,

    content: `## What the checker does (and does not)

A type checker parses your code (it does not run it), builds a model of every type flowing through every function and assignment, and reports every place the model is inconsistent — a wrong argument, an unhandled \`None\`, a return that does not match the annotation, an attribute that a type does not have. It runs as a separate command and, in most editors, continuously in the background.

It does **not** run your tests, catch logic errors, or verify anything about runtime data. A function that is fully type-correct can still be wrong.

## Configuration in \`pyproject.toml\`

\`\`\`toml
[tool.mypy]
python_version = "3.12"
strict = true                      # the modern default for new code
warn_unused_ignores = true
warn_return_any = true

# per-module overrides -- loosen where you are not ready:
[[tool.mypy.overrides]]
module = ["legacy.*", "vendor.*"]
disable_error_code = ["arg-type", "assignment"]
ignore_errors = true               # or: check but do not fail

[[tool.mypy.overrides]]
module = "thirdparty_lib.*"
ignore_missing_imports = true      # library has no type stubs
\`\`\`

The \`overrides\` mechanism is what makes gradual adoption practical: turn on \`strict\` globally, then exempt the modules you have not typed yet, and shrink the exemption list over time.

## The narrowing that makes \`Optional\` bearable

\`\`\`python
def process(x: int | None) -> int:
    if x is None:
        return 0
    return x + 1          # checker: x is int here (None branch already returned)

def label(user: User | None) -> str:
    if not user:
        return "anon"
    return user.name     # checker: user is User here

y: str | None = get()
assert y is not None     # narrows y to str for the rest of the function
print(y.upper())
\`\`\`

After an \`if x is None: return\`, an \`assert x is not None\`, an \`isinstance\` check, or a truthiness check, the checker *narrows* the type in the branch where the check passed. This is why the fix for a "could be None" error is almost always a guard, not a \`cast\`.

## Handling untyped third-party libraries

\`\`\`bash
mypy --install-types                 # fetch stub packages for libs that have them
pip install types-requests types-PyYAML   # or install specific stub packages
\`\`\`

\`\`\`toml
[[tool.mypy.overrides]]
module = "some_untyped_lib.*"
ignore_missing_imports = true        # last resort: treat it as Any
\`\`\`

Many popular libraries ship types or have a \`types-*\` stub package. For one that does not, \`ignore_missing_imports\` makes it \`Any\` (unchecked) rather than an error.

## \`reveal_type\` and \`reveal_locals\`

\`\`\`python
x = [1, 2, 3]
reveal_type(x)                       # note: Revealed type is "builtins.list[builtins.int]"

def f(a, b):
    reveal_locals()                  # prints the inferred type of every local
\`\`\`

These are checker-only pseudo-functions — mypy/pyright understand them, but they are \`NameError\` if you actually run the file. Use them while debugging a type issue, then delete them.

## Suppressing errors — correctly

\`\`\`python
result = legacy_call()  # type: ignore[no-any-return]   # specific code, with a reason nearby

# NOT:
result = legacy_call()  # type: ignore                  # bare -- hides future unrelated errors
\`\`\`

Always use \`# type: ignore[specific-code]\`. A bare \`# type: ignore\` suppresses *every* error on that line forever, including new ones introduced by later edits. \`warn_unused_ignores = true\` then tells you when an ignore is no longer needed.

## The adoption path

1. **Add the checker to CI** with a permissive config. Fix the errors it finds in already-annotated code.
2. **Annotate the modules that hurt** — the ones with the most bugs, the most churn, or the trickiest data.
3. **Per-module strict** in \`overrides\` — set \`strict = true\` globally and exempt the rest; remove exemptions as you type each module.
4. **Full \`--strict\`** once coverage is high. New code is born typed.

The payoff is real: \`None\`-handling bugs and wrong-argument bugs are caught before the code runs, large refactors become safe (the checker finds every call site that needs updating), and signatures become trustworthy documentation.`,

    contentHi: `## Checker kya karता hai (aur nahi)

Ek type checker aapke code ko parse karता hai (ise chalाता nahi), har function aur assignment ke zariye bahति har type ka ek model banाता hai, aur har jagah report karता hai jahaan model asangat hai. Ye ek alag command ki tarah chalता hai aur, adhikaansh editors mein, background mein lagataar.

Ye aapke tests **nahi** chalाता, logic errors nahi pakadता, ya runtime data ke baare mein kuch verify nahi karता.

## \`pyproject.toml\` mein configuration

\`\`\`toml
[tool.mypy]
python_version = "3.12"
strict = true
warn_unused_ignores = true

[[tool.mypy.overrides]]
module = ["legacy.*", "vendor.*"]
ignore_errors = true

[[tool.mypy.overrides]]
module = "thirdparty_lib.*"
ignore_missing_imports = true
\`\`\`

\`overrides\` mechanism wo hai jo gradual adoption ko vyavhaarik banाता hai: \`strict\` globally on karो, phir un modules ko exempt karो jo aapne abhi type nahi kiye.

## Narrowing jo \`Optional\` ko sehne yogya banाता hai

\`\`\`python
def process(x: int | None) -> int:
    if x is None:
        return 0
    return x + 1          # checker: x yahaan int hai

y: str | None = get()
assert y is not None     # y ko baaki function ke liye str tak narrow karता hai
print(y.upper())
\`\`\`

Ek \`if x is None: return\`, ek \`assert x is not None\`, ek \`isinstance\` check, ya ek truthiness check ke baad, checker us branch mein type *narrow* karता hai jahaan check pass hua. Isliye "could be None" error ka fix lagbhag hamesha ek guard hai, ek \`cast\` nahi.

## Untyped third-party libraries handle karna

\`\`\`bash
mypy --install-types
pip install types-requests types-PyYAML
\`\`\`

\`\`\`toml
[[tool.mypy.overrides]]
module = "some_untyped_lib.*"
ignore_missing_imports = true
\`\`\`

Kai lokpriya libraries types ship karती hain ya ek \`types-*\` stub package rakhती hain.

## \`reveal_type\` aur \`reveal_locals\`

\`\`\`python
x = [1, 2, 3]
reveal_type(x)                       # note: Revealed type is "builtins.list[builtins.int]"
\`\`\`

Ye checker-only pseudo-functions hain — mypy/pyright unhe samajhते hain, par agar aap file chalाते ho to wo \`NameError\` hain.

## Errors suppress karna — sahi tarike se

\`\`\`python
result = legacy_call()  # type: ignore[no-any-return]   # specific code, ek reason paas

# NAHI:
result = legacy_call()  # type: ignore                  # nanga -- future unrelated errors chhupata hai
\`\`\`

Hamesha \`# type: ignore[specific-code]\` istemal karो. Ek nanga \`# type: ignore\` us line par *har* error hamesha ke liye suppress karता hai.

## Adoption path

1. **Checker ko CI mein jodो** ek permissive config ke saath.
2. **Un modules ko annotate karो jo dukh dete hain** — sabse zyaada bugs, churn waale.
3. **Per-module strict** \`overrides\` mein.
4. **Full \`--strict\`** jab coverage high hai.

Faayda asli hai: \`None\`-handling bugs aur wrong-argument bugs code chalne se pehle pakadে jाते hain, bade refactors surakshit ho jाते hain.`,

    examples: [
      {
        title: 'mypy catches wrong arguments and bad returns',
        titleHi: 'mypy galat arguments aur kharaab returns pakadता hai',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
open(os.path.join(d, "snippet.py"), "w").write(textwrap.dedent('''
    def greet(name: str, times: int = 1) -> str:
        return ("hi " + name + " ") * times

    a = greet("Ada")            # ok
    b = greet(42)               # error: int is not str
    c = greet("Bo", "twice")    # error: str is not int
    d: int = greet("Cy")        # error: assigning str to int

    def total(nums: list[int]) -> int:
        if nums:
            return sum(nums)
        # falls off the end -> returns None -> error
'''))

r = subprocess.run(
    [sys.executable, "-m", "mypy", "--no-color-output", "--no-error-summary", "snippet.py"],
    cwd=d, capture_output=True, text=True,
)
print(r.stdout, end="")
print("exit code:", r.returncode)`,
        output: `snippet.py:6: error: Argument 1 to "greet" has incompatible type "int"; expected "str"  [arg-type]
snippet.py:7: error: Argument 2 to "greet" has incompatible type "str"; expected "int"  [arg-type]
snippet.py:8: error: Incompatible types in assignment (expression has type "str", variable has type "int")  [assignment]
snippet.py:10: error: Missing return statement  [return]
exit code: 1`,
        explain: 'mypy reads the annotations and, without running the file, reports four problems: `greet(42)` passes an `int` where `str` is expected, `greet("Bo", "twice")` passes a `str` for the `int` param, `d: int = greet(...)` assigns a `str` to an `int` variable, and `total` can fall off the end (returning `None`) when its annotation promises `int`. Each error names the file, line, message, and a `[code]`. The exit code is 1, which fails a CI build.',
        explainHi: 'mypy annotations padhता hai aur, file chalाye bina, chaar samasyaayein report karता hai: `greet(42)` `str` jahaan chahiye `int` pass karता hai, `greet("Bo", "twice")` `int` param ke liye `str` pass karता hai, `d: int = greet(...)` ek `str` ek `int` variable ko assign karता hai, aur `total` ant se gir sakta hai jab iski annotation `int` promise karती hai. Exit code 1 hai, jो ek CI build fail karता hai.',
      },
      {
        title: 'Optional narrowing: the fix is a guard, not a cast',
        titleHi: 'Optional narrowing: fix ek guard hai, ek cast nahi',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
open(os.path.join(d, "snippet.py"), "w").write(textwrap.dedent('''
    def name_len_bad(name: str | None) -> int:
        return len(name)                 # error: name could be None

    def name_len_good(name: str | None) -> int:
        if name is None:
            return 0
        return len(name)                 # OK: narrowed to str here

    def first_word(text: str | None) -> str:
        assert text is not None          # narrows for the rest of the function
        return text.split()[0]

    def greet(user: dict | None) -> str:
        if not user:                     # truthiness guard also narrows
            return "hi stranger"
        return "hi " + user["name"]
'''))

r = subprocess.run(
    [sys.executable, "-m", "mypy", "--no-color-output", "--no-error-summary", "snippet.py"],
    cwd=d, capture_output=True, text=True,
)
print(r.stdout or "(no errors)", end="")
print("\\nexit code:", r.returncode)`,
        output: `snippet.py:3: error: Argument 1 to "len" has incompatible type "str | None"; expected "Sized"  [arg-type]

exit code: 1`,
        explain: 'Only `name_len_bad` errors — it passes `str | None` straight to `len`, which cannot accept `None`. The other three functions all *narrow* the type first: `if name is None: return` leaves `name` as `str` afterward, `assert text is not None` narrows for the rest of the function, and `if not user: return` narrows `user` to a non-None `dict`. The checker follows control flow, so after any of these guards the union is reduced and the code is safe.',
        explainHi: 'Sirf `name_len_bad` error deta hai — ye `str | None` seedhe `len` ko pass karता hai, jo `None` accept nahi kar sakta. Baaki teen functions pehle type *narrow* karते hain: `if name is None: return` `name` ko baad mein `str` chhodता hai, `assert text is not None` baaki function ke liye narrow karता hai. Checker control flow follow karता hai.',
      },
      {
        title: 'reveal_type and gradual: untyped code is not checked',
        titleHi: 'reveal_type aur gradual: untyped code check nahi hoता',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
open(os.path.join(d, "snippet.py"), "w").write(textwrap.dedent('''
    def typed(items: list[int]) -> int:
        total = sum(items)
        reveal_type(total)               # mypy note: int
        reveal_type(items)               # mypy note: list[int]
        return total

    def untyped(items):                  # no annotations
        return items.frobnicate() + "x"  # NOT checked -- items is treated as Any

    x = untyped([1, 2, 3])
    reveal_type(x)                        # Any
'''))

r = subprocess.run(
    [sys.executable, "-m", "mypy", "--no-color-output", "--no-error-summary", "snippet.py"],
    cwd=d, capture_output=True, text=True,
)
print(r.stdout, end="")
print("exit code:", r.returncode, "(0 = no errors -- untyped code passed silently)")`,
        output: `snippet.py:4: note: Revealed type is "int"
snippet.py:5: note: Revealed type is "list[int]"
snippet.py:12: note: Revealed type is "Any"
exit code: 0 (0 = no errors -- untyped code passed silently)`,
        explain: '`reveal_type(total)` makes mypy print `int` (it inferred the type from `sum(list[int])`); `reveal_type(items)` prints `list[int]`. The `untyped` function has no annotations, so mypy treats its parameter and return as `Any` and does NOT check the body — `items.frobnicate() + "x"` is nonsense but passes silently. Exit code 0. That is "gradual": unannotated code is permitted and unverified. `--disallow-untyped-defs` or `--check-untyped-defs` changes this.',
        explainHi: '`reveal_type(total)` mypy ko `int` print karवाता hai; `reveal_type(items)` `list[int]` print karता hai. `untyped` function mein koi annotations nahi, isliye mypy iske parameter aur return ko `Any` maanता hai aur body check NAHI karता — `items.frobnicate() + "x"` bakwaas hai par chupchaap pass hoता hai. Exit code 0. Wo "gradual" hai.',
      },
    ],

    mistakes: [
      {
        wrong: `result = external_api()  # type: ignore     # bare -- silences this line forever
process(result)`,
        right: `result = external_api()  # type: ignore[no-untyped-call]   # specific code + reason
process(result)`,
        why: 'A bare `# type: ignore` suppresses every current AND future error on that line. If a later edit introduces a real bug on the same line, you will never hear about it. Always name the specific error code (`# type: ignore[code]`), and enable `warn_unused_ignores` so the checker tells you when an ignore has become unnecessary.',
        whyHi: 'Ek nanga `# type: ignore` us line par har current AUR future error suppress karता hai. Agar ek baad ka edit usi line par ek asli bug daalता hai, aapko kabhi nahi pata chalega. Hamesha specific error code naam karो, aur `warn_unused_ignores` enable karो.',
      },
      {
        wrong: `def get_config() -> dict:
    return {"debug": True}

cfg = get_config()
port = cast(int, cfg["port"])       # KeyError at runtime -- cast does not check anything`,
        right: `class Config(TypedDict):
    debug: bool
    port: int

def get_config() -> Config:
    return {"debug": True, "port": 8000}

cfg = get_config()
port = cfg["port"]     # checked, and actually present`,
        why: '`cast` tells the checker to believe you — it has zero runtime effect and does not verify the value exists or has the right type. Using `cast` to paper over a missing key or a wrong type just moves the failure to runtime. Fix the actual type (here, a `TypedDict`); reserve `cast` for cases where you genuinely know more than the checker (e.g. after a runtime check it cannot follow).',
        whyHi: '`cast` checker ko aap par bharosa karने ko kehta hai — iska zero runtime effect hai aur ye verify nahi karता ki value maujood hai. `cast` ko ek missing key par lipने ke liye istemal karna bस failure ko runtime par le jाता hai. Asli type theek karो.',
      },
      {
        wrong: `# "there is no point adding types unless we type the whole codebase"
# -> so nothing gets typed, ever`,
        right: `# add mypy to CI with a lax config today; annotate module by module.
# [tool.mypy] strict = true
# [[tool.mypy.overrides]] module = ["legacy.*"] ignore_errors = true
# then shrink the overrides list over months.`,
        why: 'Type checking is explicitly designed to be gradual — untyped code is allowed and simply not deep-checked. You get value from the first annotated module: the checker verifies it and every typed call into it. Waiting for 100% coverage means never starting. Add the checker now, type the high-value modules first, and tighten over time.',
        whyHi: 'Type checking spasht roop se gradual hone ko design kiya gaya hai — untyped code allowed hai aur bस gehraai se check nahi hoता. Aapko pehle annotated module se value milती hai. 100% coverage ka intezaar matlab kabhi shuru na karna. Checker abhi jodो.',
      },
    ],

    realWorld: [
      {
        en: '**`mypy` or `pyright` in CI (fail the build on type errors) is standard on well-run Python teams** — it catches `None`-handling bugs, wrong arguments after a signature change, and dead branches before code ships. `pyright` (via the Pylance VS Code extension) is what most editors run live as you type.',
        hi: '**CI mein `mypy` ya `pyright` (type errors par build fail) achhे-chalते Python teams par standard hai** — ye `None`-handling bugs, ek signature change ke baad galat arguments pakadता hai. `pyright` (Pylance VS Code extension ke zariye) wo hai jo adhikaansh editors live chalाते hain.',
      },
      {
        en: '**`django-stubs` and `djangorestframework-stubs` add types to Django/DRF** so mypy understands `QuerySet[User]`, `request.user`, serializer fields. Without stubs, a lot of Django code is `Any` and the checker cannot help. `pydantic` is fully typed and mypy-aware out of the box.',
        hi: '**`django-stubs` aur `djangorestframework-stubs` Django/DRF mein types jodते hain** taaki mypy `QuerySet[User]`, `request.user` samjhe. Stubs ke bina, bahut Django code `Any` hai.',
      },
      {
        en: '**The per-module `overrides` in `pyproject.toml` is how real codebases adopt strict typing gradually** — turn on `strict`, list the not-yet-typed packages under `ignore_errors`, and delete entries from that list in every PR that types a module. The list shrinking to empty is the migration being done.',
        hi: '**`pyproject.toml` mein per-module `overrides` aise asli codebases strict typing dheere apnाते hain** — `strict` on karो, abhi-tak-untyped packages ko `ignore_errors` ke tahat list karो, aur har PR mein us list se entries delete karो jo ek module type karता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a type checker, how does it relate to the Python interpreter, and what does "gradual typing" mean?',
        qHi: 'Ek type checker kya hai, ye Python interpreter se kaise sambandhit hai, aur "gradual typing" ka kya matlab hai?',
        a: 'A type checker like mypy or pyright is a separate program from the Python interpreter. It reads your source code and its type annotations, builds a static model of what type every expression, variable, parameter, and return value has, and reports every place where that model is inconsistent — a call passing the wrong argument type, a variable reassigned to an incompatible type, a value that could be None used without a None check, a function whose return does not match its annotation, an attribute access on a type that lacks it. Crucially, it does this without executing the code. It runs as its own command, typically wired into continuous integration so that a type error fails the build, and it also runs continuously in the background of most editors so you see errors as you type. The interpreter, by contrast, ignores annotations entirely at runtime; the two are completely decoupled. Gradual typing is the design principle that lets you adopt this incrementally. Code with no annotations is not an error — the checker treats unannotated parameters and returns as the special type Any, which is compatible with everything and suppresses checking through it. So an untyped function is allowed to exist; it is just not deeply verified. This means you get value from the very first module you annotate: the checker fully verifies that module and every typed call site that reaches into it, while the rest of the codebase continues to work. You do not have to type everything before typing anything. The practical adoption path is to add the checker to CI with a permissive configuration, fix what it finds in already-annotated code, then annotate modules in priority order — the ones with the most bugs or the most change first — and use per-module configuration to enable strict checking globally while temporarily exempting the modules not yet done, shrinking that exemption list over time until the whole project is strictly checked.',
        aHi: 'mypy ya pyright jaisा ek type checker Python interpreter se ek alag program hai. Ye aapka source code aur iske type annotations padhता hai, ek static model banाता hai ki har expression, variable, parameter, aur return value ka kya type hai, aur har jagah report karता hai jahaan wo model asangat hai. Mahatvapurna roop se, ye bina code execute kiye karता hai. Ye apni command ki tarah chalता hai, aam taur par CI mein wire kiya. Interpreter, iske विpreet, runtime par annotations poori tarah ignore karता hai. Gradual typing wo design siddhaant hai jo aapko ise dheere-dheere apnाne deta hai. Bina annotations waala code ek error nahi hai — checker unannotated parameters aur returns ko special type Any maanता hai. Toh ek untyped function maujood rehne diya jाता hai; ye bस gehraai se verify nahi hota. Iska matlab aapko pehle module se value milती hai jise aap annotate karते ho.',
      },
      {
        q: 'You get "error: Item None of X | None has no attribute Y". What causes it and how do you fix it properly?',
        qHi: 'Aapko "error: Item None of X | None has no attribute Y" milता hai. Iska kaaran kya hai aur aap ise thik se kaise theek karते ho?',
        a: 'The error means you have a value whose declared type is a union that includes None — most often X or None, the modern spelling of Optional of X — and you are accessing an attribute or calling a method on it without first ruling out the None case. If the value is None at runtime, that access raises AttributeError, so the checker refuses it. The wrong fixes are: casting the value to X, which tells the checker to trust you but does nothing at runtime, so if the value really is None you have just moved the crash to production; and adding a bare type ignore, which hides this error and every future one on that line. The right fix is to narrow the type with a runtime guard that the checker can follow. The most direct is an early return or raise: if value is None, return some default or raise an error; after that statement, on every code path that continues, the checker knows the value is X, not X or None, and the attribute access is fine. Alternatives that narrow the same way are an assert value is not None, which is appropriate when None genuinely should be impossible at that point and you want a loud failure if the invariant is violated; an isinstance check; and a truthiness check like if not value: handle the empty case, which narrows in the else branch, though be careful because a truthy check also excludes other falsy values like zero or an empty string, not just None. The general principle is that type checkers do control-flow analysis: after a check that can only pass for non-None values, they reduce the union in the branch where the check succeeded. So the fix for an Optional error is almost always to add the guard that a correct program needs anyway, which is why the checker is useful — it is pointing at a real missing None-handling path, not just complaining about types.',
        aHi: 'Error ka matlab aapke paas ek value hai jiska declared type ek union hai jismein None shaamil hai — aksar X or None — aur aap ispar ek attribute access ya ek method call kar rahe ho bina pehle None case ko khaarij kiye. Agar value runtime par None hai, wo access AttributeError deta hai. Galat fixes: value ko X mein cast karna, aur ek nanga type ignore jodना. Sahi fix ek runtime guard se type narrow karna hai jise checker follow kar sake. Sabse seedha ek early return ya raise hai: if value is None, return ya raise; us statement ke baad, har continuing code path par, checker jaanता hai value X hai. Vikalp jo usi tarah narrow karते hain: ek assert value is not None; ek isinstance check; aur ek truthiness check. Saamaanya siddhaant ye hai ki type checkers control-flow analysis karते hain.',
      },
    ],

    exercises: [
      {
        task: 'Write a snippet with three deliberate type errors: (a) passing an `int` to a `str` parameter, (b) a function annotated `-> int` that has a code path returning `None`, (c) reassigning a `list[int]` variable to a `str`. Run `python -m mypy --no-color-output` on it via subprocess and print the errors. Confirm the exit code is 1.',
        taskHi: 'Teen jaan-boojhkar type errors waali ek snippet likhо: (a), (b), (c). Ispar subprocess se `python -m mypy --no-color-output` chalाओ aur errors print karो. Confirm karो exit code 1 hai.',
        hint: 'Write `snippet.py` to a temp dir. Errors: `[arg-type]`, `[return]` (or `[return-value]`), `[assignment]`. `subprocess.run([sys.executable, "-m", "mypy", "--no-color-output", "--no-error-summary", "snippet.py"], cwd=d, ...)`. `r.returncode` is 1.',
        hintHi: '`snippet.py` ek temp dir mein likhо. Errors: `[arg-type]`, `[return]`, `[assignment]`. `r.returncode` 1 hai.',
      },
      {
        task: 'Write a function `parse_port(raw: str | None) -> int` two ways: (a) `return int(raw)` (mypy errors: `raw` could be `None`), (b) with a guard `if raw is None: return 8000` then `return int(raw)` (mypy clean). Run mypy on both in the same file and show only version (a) produces an error, with its line number.',
        taskHi: '`parse_port(raw: str | None) -> int` do tarikon se likhо: (a) `return int(raw)` (mypy error), (b) ek guard ke saath (mypy clean). Dono par mypy chalाओ aur dikhाओ sirf version (a) ek error banाता hai.',
        hint: 'Version (a) triggers `Argument 1 to "int" has incompatible type "str | None"; expected ...  [arg-type]`. Version (b): after `if raw is None: return 8000`, mypy narrows `raw` to `str`, so `int(raw)` is fine. Put both functions in one file; only one line errors.',
        hintHi: 'Version (a) `Argument 1 to "int" has incompatible type "str | None"  [arg-type]` trigger karता hai. Version (b): `if raw is None: return 8000` ke baad, mypy `raw` ko `str` tak narrow karता hai.',
      },
      {
        task: 'Demonstrate gradual typing: in one file, write a fully-typed function that mypy checks (put a `reveal_type` in it to see an inferred type in the output), and an un-annotated function with an obvious bug in its body (`x.nonexistent_method()`). Run mypy and show the typed function is verified (the `reveal_type` note appears) while the untyped function\'s bug passes silently (exit code 0).',
        taskHi: 'Gradual typing dikhाओ: ek file mein, ek poori-typed function likhо jise mypy check karta hai (ismein ek `reveal_type` daalो), aur ek un-annotated function ek spasht bug ke saath. mypy chalाओ aur dikhाओ typed function verified hai jabki untyped function ka bug chupchaap pass hoता hai (exit code 0).',
        hint: 'Typed: `def f(xs: list[int]) -> int: t = sum(xs); reveal_type(t); return t` -> mypy note `builtins.int`. Untyped: `def g(x): return x.nope() + 1` -> mypy treats `x` as `Any`, does not check the body. Exit code 0 because the only "error" is the note.',
        hintHi: 'Typed: `def f(xs: list[int]) -> int: t = sum(xs); reveal_type(t); return t` -> mypy note `builtins.int`. Untyped: `def g(x): return x.nope() + 1` -> mypy `x` ko `Any` maanता hai, body check nahi karता. Exit code 0.',
      },
    ],

    keyTakeaways: [
      'A type checker (`mypy`, `pyright`) is a SEPARATE program from the interpreter. It reads annotations and reports inconsistencies WITHOUT running your code — run it in CI (fail on errors) and live in your editor.',
      'Error format: `file:line: error: <message>  [error-code]`. The `[code]` goes in `# type: ignore[code]` to suppress that one error.',
      'The three most common errors: using an `X | None` value without a `None` guard; a function annotated `-> X` that has a path returning `None` (`[return]`); reassigning a variable to an incompatible type (`[assignment]`).',
      'Fix a "could be None" error with a GUARD the checker can follow (`if x is None: return`, `assert x is not None`, `isinstance`, truthiness) — NOT with `cast` (which has no runtime effect and hides the real missing case).',
      '`reveal_type(x)` / `reveal_locals()` make the checker print its inferred type(s) — checker-only, `NameError` if you actually run the file. Delete after debugging.',
      'GRADUAL: unannotated code is treated as `Any` and not deep-checked — it is allowed, just unverified. You get value from the first typed module. `--disallow-untyped-defs` / `--check-untyped-defs` tighten this.',
      'Adoption: add the checker to CI with a lax config; annotate high-churn/bug-prone modules first; use per-module `[[tool.mypy.overrides]]` to set `strict` globally while exempting the rest; shrink the exemption list over time.',
      'Always `# type: ignore[specific-code]`, never a bare `# type: ignore` (which hides every future error on that line). Enable `warn_unused_ignores`. Install `types-*` stub packages for untyped third-party libs.',
    ],
    keyTakeawaysHi: [
      'Ek type checker (`mypy`, `pyright`) interpreter se ek ALAG program hai. Ye annotations padhता hai aur inconsistencies report karता hai BINA aapka code chalाye — ise CI mein aur aapke editor mein live chalाओ.',
      'Error format: `file:line: error: <message>  [error-code]`. `[code]` us ek error ko suppress karne ko `# type: ignore[code]` mein jाता hai.',
      'Teen sabse aam errors: ek `X | None` value ko `None` guard ke bina istemal karna; ek function jo `-> X` annotated hai par ek path `None` lautaता hai (`[return]`); ek variable ko ek incompatible type mein reassign karna (`[assignment]`).',
      '"could be None" error ko ek GUARD se theek karो jise checker follow kar sake (`if x is None: return`, `assert x is not None`, `isinstance`) — `cast` se NAHI.',
      '`reveal_type(x)` / `reveal_locals()` checker ko apne inferred type(s) print karवाते hain — checker-only, agar aap file chalाते ho to `NameError`.',
      'GRADUAL: unannotated code ko `Any` maanा jाता hai aur gehraai se check nahi hoता — ye allowed hai, bस unverified. Aapko pehle typed module se value milती hai.',
      'Adoption: checker ko CI mein ek lax config ke saath jodो; pehle high-churn/bug-prone modules annotate karो; `strict` globally set karne ko per-module `[[tool.mypy.overrides]]` istemal karो jabki baaki ko exempt karो.',
      'Hamesha `# type: ignore[specific-code]`, kabhi nanga `# type: ignore` nahi. `warn_unused_ignores` enable karो. Untyped third-party libs ke liye `types-*` stub packages install karो.',
    ],
  },
];
