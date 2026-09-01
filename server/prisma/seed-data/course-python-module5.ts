/**
 * Python Complete Course — Module 5: Modules, Packages, Imports & Environments,
 * lessons 1-3.
 *
 * Lesson 1: `import` mechanics — a module is an object; `import` runs the file
 *           once, binds a name, and caches it in `sys.modules`; `import x` vs
 *           `from x import y` vs `import x as y`; how `sys.path` finds modules.
 * Lesson 2: `__name__ == "__main__"` — `__name__` is `"__main__"` when the file
 *           is run directly and the module's dotted name when imported; the
 *           `main()` guard; `python file.py` vs `python -m pkg.mod`.
 * Lesson 3: packages and `__init__.py` — a package is a directory; what
 *           `__init__.py` is for; curated exports and `__all__`; sub-packages.
 *
 * NOTE for future editors: same rules as the rest of this course. Every
 * backtick inside simple/simpleHi/content/contentHi is `\`` (inline code inside
 * ``` blocks included). Escape `$` before `{` inside template literals as `\${`.
 * Keep example OUTPUT ASCII-only (Windows console mangles non-ASCII on capture).
 * `examples` use `code` + `output`; each writes small .py files to a temp dir
 * and runs them via `subprocess` so they are self-contained and deterministic.
 * Run every sample with `python`. Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_5: CourseLesson[] = [
  {
    slug: 'py-import-mechanics',
    title: 'import Mechanics: A Module Is an Object That Runs Once',
    titleHi: 'import Mechanics: Ek Module Ek Object Hai Jo Ek Baar Chalta Hai',
    description: 'Adding a `print("loading")` at the top of a helper file, importing it from three other files, and seeing "loading" appear only once — then being surprised that editing the file and re-importing in the same session changes nothing. `import` executes a module top to bottom exactly once, stores the resulting module object in a cache, and every later `import` of the same name just hands back the cached object.',
    descriptionHi: 'Ek helper file ke top par ek `print("loading")` jodna, ise teen doosri files se import karna, aur "loading" ko sirf ek baar dikhte dekhna — phir chaunk jaana ki file edit karke usi session mein re-import karna kuch nahi badalta. `import` ek module ko top se bottom bilkul ek baar execute karta hai, nateeja module object ek cache mein store karta hai, aur usi naam ka har baad ka `import` bas cached object wapas deta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A library that catalogues a book the first time anyone requests it, then hands everyone the same catalogued copy.** The first person to ask for "the plumbing manual" triggers real work: a librarian fetches it, reads it cover to cover to build the index, and files that indexed copy on a special shelf. Every subsequent request — from anyone, that day — skips all of that; the librarian just points at the shelf. The book is only processed once no matter how many departments need it. In Python, the first `import requests` anywhere in your program finds the file, runs it from top to bottom (which defines its functions and classes and executes any top-level code), wraps the result in a module object, and stores that object in a registry called `sys.modules`. Every other `import requests`, in any file, is a dictionary lookup in that registry — it does not re-run the file. This is why a slow or side-effecting import only costs you once, why a circular import can deadlock (the file is half-run and already in the registry), and why re-importing after editing a file in a running session shows the old version: the registry still has the copy from before your edit.',
      hi: '**Ek library jo ek book ko pehli baar catalogue karti hai jab koi ise request karta hai, phir sabko wahi catalogued copy deti hai.** "Plumbing manual" maangne waala pehla vyakti asli kaam trigger karta hai: ek librarian ise laata hai, index banaane ke liye poora padhta hai, aur us indexed copy ko ek vishesh shelf par file karta hai. Har baad ki request — kisi se bhi, us din — ye sab chhod deti hai; librarian bas shelf ki taraf ishaara karta hai. Book sirf ek baar process hoti hai chahe kitne bhi departments ko chahiye. Python mein, aapke program mein kahin bhi pehla `import requests` file dhoondhta hai, ise top se bottom chalata hai, nateeja ek module object mein wrap karta hai, aur us object ko `sys.modules` naam ki registry mein store karta hai. Har doosra `import requests`, kisi bhi file mein, us registry mein ek dictionary lookup hai — ye file ko re-run nahi karta.',
    },

    simple: `**What \`import\` actually does — three steps, once:**

\`\`\`python
# say you have  config.py:
#     print("config.py is running")
#     DEBUG = True
#     def get_url(): return "https://api.example.com"

import config          # 1. find config.py  2. run it top-to-bottom  3. bind name 'config'
# prints "config.py is running"

import config          # nothing prints -- already in sys.modules, just rebinds the name
print(config.DEBUG)    # True   -- 'config' is a module OBJECT; DEBUG is an attribute on it
print(config.get_url())
\`\`\`

**The forms of import**

\`\`\`python
import config                     # config.DEBUG, config.get_url()
import config as cfg              # cfg.DEBUG              (alias)
from config import DEBUG, get_url # DEBUG, get_url()       (names copied into THIS module)
from config import get_url as gu  # gu()
from config import *              # everything public -- avoid; unclear what you got
\`\`\`

\`from config import DEBUG\` copies the *current value* of \`config.DEBUG\` into your module's namespace. If \`config\` later rebinds \`DEBUG\`, your copy does not change.

\`\`\`
import x                runs x.py once (if not already run), binds the name 'x'
                        to the module object. Access members as x.thing.

from x import a, b      runs x.py once, then binds a and b in YOUR namespace to
                        whatever x.a and x.b are RIGHT NOW (a snapshot of the value).

sys.modules            the cache: {'x': <module object>, ...}. Second import of 'x'
                       is just a dict lookup -- the file does NOT run again.

sys.path               the list of directories Python searches for 'x', in order:
                       [script dir or '', then PYTHONPATH entries, then stdlib,
                        then site-packages]. import fails with ModuleNotFoundError
                       if 'x' is in none of them.

A module is an object: it has __name__, __file__, __dict__ (its globals), and
every top-level name it defined becomes an attribute.
\`\`\``,

    simpleHi: `**\`import\` asal mein kya karta hai — teen steps, ek baar:**

\`\`\`python
# maano aapke paas  config.py hai:
#     print("config.py is running")
#     DEBUG = True
#     def get_url(): return "https://api.example.com"

import config          # 1. config.py dhoondho  2. top-to-bottom chalao  3. naam 'config' bind karo
# "config.py is running" print karta hai

import config          # kuch print nahi -- pehle se sys.modules mein, bas naam rebind
print(config.DEBUG)    # True   -- 'config' ek module OBJECT hai; DEBUG uspar ek attribute hai
print(config.get_url())
\`\`\`

**import ke roop**

\`\`\`python
import config                     # config.DEBUG, config.get_url()
import config as cfg              # cfg.DEBUG              (alias)
from config import DEBUG, get_url # DEBUG, get_url()       (naam IS module mein copy)
from config import get_url as gu  # gu()
from config import *              # sab kuch public -- bachо; spasht nahi kya mila
\`\`\`

\`from config import DEBUG\` \`config.DEBUG\` ki *current value* aapke module ke namespace mein copy karta hai. Agar \`config\` baad mein \`DEBUG\` rebind karta hai, aapki copy nahi badalti.

\`\`\`
import x                x.py ek baar chalata hai (agar pehle nahi), naam 'x' ko
                        module object se bind karta hai. Members ko x.thing se access karo.

from x import a, b      x.py ek baar chalata hai, phir a aur b ko AAPKE namespace mein
                        bind karta hai jo bhi x.a aur x.b ABHI hain (value ka snapshot).

sys.modules            cache: {'x': <module object>, ...}. 'x' ka doosra import
                       bas ek dict lookup hai -- file phir NAHI chalti.

sys.path               directories ki list jise Python 'x' ke liye search karta hai, kram mein:
                       [script dir ya '', phir PYTHONPATH entries, phir stdlib,
                        phir site-packages]. import ModuleNotFoundError se fail hota hai
                       agar 'x' kisi mein nahi.

Ek module ek object hai: iske __name__, __file__, __dict__ (iske globals) hain, aur
har top-level naam jo isne define kiya ek attribute ban jaata hai.
\`\`\``,

    content: `## The \`sys.modules\` cache

\`\`\`python
import sys
import json

"json" in sys.modules          # True
sys.modules["json"] is json    # True -- the same object your name points at

# forcing a re-run (rarely needed, mostly in REPLs/notebooks):
import importlib
importlib.reload(json)         # re-executes json's module file
\`\`\`

The first \`import json\` runs the file and puts the module object in \`sys.modules["json"]\`. Every later \`import json\` — in any file, anywhere in the process — finds it already there and skips execution. This is a feature: expensive setup at module top level happens once.

## How Python finds a module: \`sys.path\`

\`\`\`python
import sys
for p in sys.path:
    print(p)
# '' (or the script's directory)     <- checked first
# .../python313.zip
# .../lib/python3.13
# .../lib/python3.13/site-packages    <- where pip installs things
\`\`\`

\`import foo\` searches these directories in order for \`foo.py\`, a package \`foo/\`, or a compiled/builtin module. First match wins. \`ModuleNotFoundError\` means \`foo\` was in none of them. Two common causes: you are running from the wrong directory (so the script dir on \`sys.path\` is not where \`foo\` lives), or the package is not installed in the environment you are running.

**Never** shadow a stdlib or installed module with your own file — a local \`random.py\`, \`json.py\`, \`email.py\`, or \`test.py\` will be imported instead of the real one and cause baffling errors.

## \`import x\` vs \`from x import y\` — the practical difference

\`\`\`python
import datetime
datetime.datetime.now()            # namespaced -- always clear where 'datetime' came from

from datetime import datetime
datetime.now()                     # shorter, but 'datetime' now shadows the module name

from os.path import join, exists    # fine for a few well-known names
from os.path import *               # bad: unknown what names you just added, may clash
\`\`\`

Guidance: \`import module\` (optionally \`as\` a short alias) keeps call sites self-documenting and avoids name clashes. \`from module import name\` is fine for a handful of frequently used, unambiguous names. \`from module import *\` is for interactive use only.

## A module is an object

\`\`\`python
import json
type(json)              # <class 'module'>
json.__name__           # 'json'
json.__file__           # '.../lib/python3.13/json/__init__.py'
dir(json)               # every public name it defines
json.__dict__["loads"]  # <function loads ...> -- same as json.loads
\`\`\`

You can pass a module around, store it in a dict, inspect it. \`import\` is really "run this file, then give me a reference to the resulting namespace object".

## Import time vs run time

\`\`\`python
# BAD: expensive / side-effecting work at module top level runs on import
data = requests.get("https://slow.example.com/dump").json()   # every importer pays this

# GOOD: define it, call it when needed
def load_data():
    return requests.get("https://slow.example.com/dump").json()
\`\`\`

Everything at a module's top level runs the moment it is first imported. Keep top level to definitions, cheap constants, and imports. Put work in functions.`,

    contentHi: `## \`sys.modules\` cache

\`\`\`python
import sys
import json

"json" in sys.modules          # True
sys.modules["json"] is json    # True -- wahi object jispar aapka naam point karta hai

# re-run majboor karna (shaayad hi zaroori, zyaadatar REPLs/notebooks mein):
import importlib
importlib.reload(json)         # json ki module file re-execute karta hai
\`\`\`

Pehla \`import json\` file chalata hai aur module object ko \`sys.modules["json"]\` mein rakhta hai. Har baad ka \`import json\` — kisi bhi file mein, process mein kahin bhi — ise pehle se wahaan paata hai aur execution chhod deta hai. Ye ek feature hai: module top level par mehnga setup ek baar hota hai.

## Python ek module kaise dhoondhta hai: \`sys.path\`

\`\`\`python
import sys
for p in sys.path:
    print(p)
# '' (ya script ki directory)        <- pehle check hota hai
# .../python313.zip
# .../lib/python3.13
# .../lib/python3.13/site-packages    <- jahaan pip cheezein install karta hai
\`\`\`

\`import foo\` in directories ko kram mein \`foo.py\`, ek package \`foo/\`, ya ek compiled/builtin module ke liye search karta hai. Pehla match jeetta hai. \`ModuleNotFoundError\` matlab \`foo\` kisi mein nahi tha. Do aam kaaran: aap galat directory se chala rahe ho, ya package us environment mein install nahi hai jise aap chala rahe ho.

**Kabhi** ek stdlib ya installed module ko apni file se shadow mat karo — ek local \`random.py\`, \`json.py\`, \`email.py\`, ya \`test.py\` asli ke bajaye import hoga aur uljhaane waale errors dega.

## \`import x\` vs \`from x import y\` — vyavhaarik antar

\`\`\`python
import datetime
datetime.datetime.now()            # namespaced -- hamesha saaf kahaan se 'datetime' aaya

from datetime import datetime
datetime.now()                     # chhota, par 'datetime' ab module naam ko shadow karta hai

from os.path import join, exists    # kuch jaane-maane naam ke liye theek
from os.path import *               # bura: pata nahi kaunse naam abhi jode, clash ho sakte
\`\`\`

Maargdarshan: \`import module\` (vaikalpik roop se \`as\` ek chhota alias) call sites ko self-documenting rakhta hai aur name clashes bachaata hai. \`from module import name\` mутhee bhar aksar istemal, asandigdh naam ke liye theek hai. \`from module import *\` sirf interactive istemal ke liye.

## Ek module ek object hai

\`\`\`python
import json
type(json)              # <class 'module'>
json.__name__           # 'json'
json.__file__           # '.../lib/python3.13/json/__init__.py'
dir(json)               # har public naam jo ye define karta hai
json.__dict__["loads"]  # <function loads ...> -- json.loads jaisa hi
\`\`\`

Aap ek module ko paas kar sakte ho, ek dict mein store kar sakte ho, inspect kar sakte ho. \`import\` asal mein "is file ko chalao, phir mujhe nateeja namespace object ka reference do" hai.

## Import time vs run time

\`\`\`python
# BURA: module top level par mehnga / side-effecting kaam import par chalta hai
data = requests.get("https://slow.example.com/dump").json()   # har importer ise bharta hai

# ACHHA: ise define karo, zaroorat par call karo
def load_data():
    return requests.get("https://slow.example.com/dump").json()
\`\`\`

Ek module ke top level par sab kuch us pal chalta hai jab ye pehli baar import hota hai. Top level ko definitions, saste constants, aur imports tak rakho. Kaam functions mein rakho.`,

    examples: [
      {
        title: 'import runs a file once; sys.modules caches it',
        titleHi: 'import ek file ek baar chalata hai; sys.modules ise cache karta hai',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
open(os.path.join(d, "helper.py"), "w").write(textwrap.dedent('''
    print("helper.py body is executing")
    VALUE = 42
    def greet(): return "hi from helper"
'''))
open(os.path.join(d, "main.py"), "w").write(textwrap.dedent('''
    import sys
    import helper
    import helper          # second import: no re-run
    from helper import greet
    print("VALUE:", helper.VALUE)
    print("greet():", greet())
    print("cached:", "helper" in sys.modules)
    print("same object:", sys.modules["helper"] is helper)
'''))

out = subprocess.run([sys.executable, "main.py"], cwd=d, capture_output=True, text=True)
print(out.stdout, end="")`,
        output: `helper.py body is executing
VALUE: 42
greet(): hi from helper
cached: True
same object: True`,
        explain: '"helper.py body is executing" prints exactly once even though `main.py` imports `helper` three times (twice as `import helper`, once as `from helper import greet`). After the first import, `helper` is in `sys.modules`, and every later import is a cache lookup. `sys.modules["helper"] is helper` confirms the name and the cache entry point at the same module object.',
        explainHi: '"helper.py body is executing" bilkul ek baar print hota hai haalaanki `main.py` `helper` ko teen baar import karta hai. Pehle import ke baad, `helper` `sys.modules` mein hai, aur har baad ka import ek cache lookup hai. `sys.modules["helper"] is helper` confirm karta hai ki naam aur cache entry wahi module object par point karte hain.',
      },
      {
        title: 'from-import copies a value; it does not stay linked',
        titleHi: 'from-import ek value copy karta hai; ye linked nahi rehta',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
open(os.path.join(d, "state.py"), "w").write(textwrap.dedent('''
    counter = 0
    def bump():
        global counter
        counter += 1
'''))
open(os.path.join(d, "app.py"), "w").write(textwrap.dedent('''
    import state
    from state import counter        # copies the current value (0) into THIS namespace

    state.bump(); state.bump()

    print("state.counter (live):", state.counter)   # 2
    print("imported counter (snapshot):", counter)  # still 0
'''))

out = subprocess.run([sys.executable, "app.py"], cwd=d, capture_output=True, text=True)
print(out.stdout, end="")`,
        output: `state.counter (live): 2
imported counter (snapshot): 0`,
        explain: '`from state import counter` binds `counter` in `app.py` to the *value* `state.counter` had at import time — `0`. When `bump()` later rebinds `state.counter` to `2`, the local `counter` in `app.py` is unaffected because it was a separate name holding a copy. `import state` + `state.counter` always reads the live attribute. This is why mutable shared state should be accessed as `module.name`, not `from module import name`.',
        explainHi: '`from state import counter` `app.py` mein `counter` ko us *value* se bind karta hai jo `state.counter` ke paas import time par thi — `0`. Jab `bump()` baad mein `state.counter` ko `2` se rebind karta hai, `app.py` mein local `counter` aprabhaavit hai kyunki ye ek alag naam tha jo ek copy rakhta tha. `import state` + `state.counter` hamesha live attribute padhta hai.',
      },
      {
        title: 'sys.path decides what gets imported (and shadowing danger)',
        titleHi: 'sys.path tay karta hai kya import hota hai (aur shadowing khatra)',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
# a local file named 'secrets.py' shadows the stdlib 'secrets' module:
open(os.path.join(d, "secrets.py"), "w").write("TOKEN = 'local-not-stdlib'\\n")
open(os.path.join(d, "run.py"), "w").write(textwrap.dedent('''
    import sys, os
    here = os.path.dirname(os.path.abspath(__file__))
    print("script dir is first on sys.path:", os.path.abspath(sys.path[0]) == here)
    import secrets
    print("secrets is:", secrets.__file__.split("/")[-1].split(chr(92))[-1])
    print("secrets.TOKEN:", getattr(secrets, "TOKEN", "<no TOKEN - real stdlib>"))
'''))

out = subprocess.run([sys.executable, "run.py"], cwd=d, capture_output=True, text=True)
print(out.stdout, end="")
print("---")
# run from a different cwd: the local secrets.py is no longer on sys.path[0]
out2 = subprocess.run([sys.executable, os.path.join(d, "run.py")], cwd=tempfile.mkdtemp(),
                      capture_output=True, text=True)
print(out2.stdout, end="")`,
        output: `script dir is first on sys.path: True
secrets is: secrets.py
secrets.TOKEN: local-not-stdlib
---
script dir is first on sys.path: True
secrets is: secrets.py
secrets.TOKEN: local-not-stdlib`,
        explain: 'Python puts the script\'s own directory first on `sys.path`, so a local `secrets.py` is found before the standard library\'s `secrets` module — `import secrets` gets the wrong file, and any code expecting `secrets.token_hex()` breaks with a confusing `AttributeError`. Because `sys.path[0]` is the *script\'s* directory (not the current working directory) when you pass a path, running from elsewhere does not help. The fix is to never name a file after a stdlib/installed module.',
        explainHi: 'Python script ki apni directory ko `sys.path` par pehle rakhta hai, isliye ek local `secrets.py` standard library ke `secrets` module se pehle mil jaati hai — `import secrets` galat file paata hai, aur `secrets.token_hex()` ki ummeed karne waala koi bhi code ek uljhaane waale `AttributeError` se tootta hai. Fix ek file ko kabhi ek stdlib/installed module ke naam par na rakhna hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# email.py in your project folder
import email          # you get YOUR file, not the stdlib email package
# ... later, some library does 'import email.mime' and everything explodes`,
        right: `# name it something specific: mail_helpers.py, notifications.py
import mail_helpers`,
        why: 'A file whose name matches a standard-library or installed module (`email`, `json`, `random`, `string`, `test`, `queue`, `token`, `code`, ...) will be imported in place of the real one because your project directory is first on `sys.path`. This breaks the real module and anything that depends on it, often far from the actual cause.',
        whyHi: 'Ek file jiska naam ek standard-library ya installed module (`email`, `json`, `random`, `string`, `test`, ...) se match karta hai wo asli ke bajaye import hoga kyunki aapki project directory `sys.path` par pehle hai. Ye asli module aur uspar nirbhar kisi bhi cheez ko todta hai, aksar asli kaaran se door.',
      },
      {
        wrong: `# config.py
from settings import DATABASE_URL      # copies the string now

# settings.py later does: DATABASE_URL = load_from_vault()
# config still has the old value`,
        right: `# config.py
import settings
def get_db_url():
    return settings.DATABASE_URL       # reads the live attribute each call`,
        why: '`from settings import DATABASE_URL` binds a name in `config` to the value that existed at import time. If `settings` reassigns `DATABASE_URL` afterwards (lazy loading, test overrides, reconfiguration), `config`\'s copy is stale. Access module-level state that can change through the module object.',
        whyHi: '`from settings import DATABASE_URL` `config` mein ek naam ko us value se bind karta hai jo import time par thi. Agar `settings` baad mein `DATABASE_URL` reassign karta hai, `config` ki copy purani hai. Badal sakne waali module-level state ko module object ke zariye access karo.',
      },
      {
        wrong: `# module top level:
CLIENT = SomeSDK(api_key=os.environ["API_KEY"])   # runs on import
RESULTS = CLIENT.fetch_all()                       # network call on import!`,
        right: `_client = None
def get_client():
    global _client
    if _client is None:
        _client = SomeSDK(api_key=os.environ["API_KEY"])
    return _client`,
        why: 'Top-level code runs the instant the module is first imported — before `main()`, before tests configure anything, sometimes during tool import for autocompletion. A network call, a missing env var, or heavy computation at import time makes the module fragile and slow to import. Defer it into a function.',
        whyHi: 'Top-level code us pal chalta hai jab module pehli baar import hota hai — `main()` se pehle, tests ke kuch configure karne se pehle. Import time par ek network call, ek missing env var, ya bhaari computation module ko fragile aur import karne mein dheema banaata hai. Ise ek function mein defer karo.',
      },
    ],

    realWorld: [
      {
        en: '**Django\'s `settings.py` is imported once and cached** — `from django.conf import settings` everywhere gives you the same settings object. The lazy `settings` object exists precisely so that importing a module that references settings does not force settings to load at import time.',
        hi: '**Django ki `settings.py` ek baar import aur cache hoti hai** — har jagah `from django.conf import settings` aapko wahi settings object deta hai. Lazy `settings` object isliye maujood hai taaki settings ko reference karne waala ek module import karna settings ko import time par load karne par majboor na kare.',
      },
      {
        en: '**`ModuleNotFoundError` in a Django/DRF project is almost always one of two things** — you did not activate the virtualenv (so the package is not on `sys.path`), or you are running `python somefile.py` from a subdirectory instead of `python manage.py ...` / `python -m` from the project root, so the app package is not importable.',
        hi: '**Django/DRF project mein `ModuleNotFoundError` lagbhag hamesha do cheezon mein se ek hai** — aapne virtualenv activate nahi kiya, ya aap project root se `python manage.py ...` ke bajaye ek subdirectory se `python somefile.py` chala rahe ho.',
      },
      {
        en: '**Naming a test file `test.py` or a script `types.py` / `logging.py` / `email.py`** breaks pytest collection or the app itself in ways that look unrelated. Every Python team has hit this at least once. Linters like `ruff` have a rule (`A005`) for module names shadowing stdlib.',
        hi: '**Ek test file ko `test.py` ya ek script ko `types.py` / `logging.py` / `email.py` naam dena** pytest collection ya app ko aise todta hai jo asambandhit lagta hai. Har Python team ne ye kam se kam ek baar hit kiya hai. `ruff` jaise linters mein stdlib ko shadow karne waale module names ke liye ek rule (`A005`) hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What happens, step by step, the first time `import foo` runs, and what happens on subsequent imports?',
        qHi: 'Pehli baar `import foo` chalne par step-by-step kya hota hai, aur baad ke imports par kya hota hai?',
        a: 'On the first import of foo in a process, Python does roughly four things. It checks sys dot modules, a dictionary that acts as the module cache, and does not find foo there. It then searches for the module: it walks sys dot path, a list of directories, in order, looking for a file foo dot py, a package directory foo containing an init file, or a built-in or compiled module of that name; the first match wins, and if nothing matches it raises ModuleNotFoundError. Having found the source, it creates a new empty module object, inserts it into sys dot modules under the key foo immediately — before executing the body, which is what allows circular imports to partially work — and then executes the file top to bottom in that module\'s namespace. Every top-level statement runs: def and class statements create functions and classes, assignments create module-level variables, and any other code, including prints, network calls, or computation, actually executes. When the body finishes, the module object\'s namespace contains all those names as attributes. Finally, Python binds the name foo in the importing scope to that module object. On every subsequent import foo, anywhere in the same process, Python finds foo already in sys dot modules and skips all of the search-and-execute work; it just binds the local name to the cached object. So the file runs exactly once per process no matter how many times or from how many files it is imported. This is why import-time side effects only happen once, why a slow import is a one-time cost, and why editing a module file and re-importing in the same interactive session shows the old code — you have to restart the process or use importlib dot reload. from foo import bar does the same load-and-cache for foo, then additionally binds bar in your namespace to the current value of foo dot bar.',
        aHi: 'Ek process mein foo ke pehle import par, Python lagbhag chaar cheezein karta hai. Ye sys dot modules check karta hai, ek dictionary jo module cache ki tarah kaam karta hai, aur foo ko wahaan nahi paata. Phir ye module dhoondhta hai: ye sys dot path par chalta hai, directories ki ek list, kram mein, ek file foo dot py, ek package directory foo, ya us naam ka ek built-in module dhoondhte hue; pehla match jeetta hai, aur agar kuch match nahi karta ye ModuleNotFoundError deta hai. Source paakar, ye ek naya khaali module object banaata hai, ise turant sys dot modules mein foo key ke tahat daalta hai — body execute karne se pehle, jo circular imports ko aanshik roop se kaam karne deta hai — aur phir file ko us module ke namespace mein top se bottom execute karta hai. Har top-level statement chalta hai. Jab body khatam hoti hai, module object ke namespace mein wo saare naam attributes ki tarah hote hain. Ant mein, Python importing scope mein naam foo ko us module object se bind karta hai. Har baad ke import foo par, usi process mein kahin bhi, Python foo ko pehle se sys dot modules mein paata hai aur saara search-and-execute kaam chhod deta hai. Isliye file bilkul ek baar prati process chalti hai.',
      },
      {
        q: 'What is the difference between `import module` and `from module import name`, beyond syntax?',
        qHi: 'Syntax se aage, `import module` aur `from module import name` mein kya antar hai?',
        a: 'Both trigger the same thing for the module itself: the module is located, executed once if it is not already cached, and stored in sys dot modules. The difference is what name ends up in your namespace and what it is bound to. import module binds one name, module, to the module object. You then reach everything through it as module dot attribute, and that access is a live lookup — it reads whatever the module\'s attribute currently is, every time. from module import name still loads the whole module, but it binds name in your namespace directly to the object that module dot name refers to at that moment. It is a second, independent binding to the same object. For a function or a class this rarely matters, because you are not reassigning those. But for a module-level variable that can be rebound — a configuration value that gets set lazily, a counter, something a test monkey-patches — it matters a lot: your imported name is a snapshot. If the module later does name equals something-else, it rebinds its own attribute, and your name still points at the old object. Reading module dot name would have shown the new value; your copied name does not. There are also practical and stylistic consequences. import module keeps call sites self-documenting, since datetime dot datetime dot now makes the origin obvious, and it avoids name collisions between modules that export the same identifier. from module import name is more concise and is fine for a small number of well-known names, but from module import star pulls in an unknown set of names, can silently shadow your own or another import\'s names, and should be limited to interactive sessions. The rule of thumb is: import the module and use qualified access by default; use from-import for a handful of frequently used, unambiguous names; access anything mutable through the module object rather than importing it by name.',
        aHi: 'Dono module ke liye wahi cheez trigger karte hain: module dhoondha jaata hai, ek baar execute hota hai agar pehle se cached nahi, aur sys dot modules mein store hota hai. Antar ye hai ki aapke namespace mein kaunsa naam aata hai aur ye kis se bound hai. import module ek naam, module, ko module object se bind karta hai. Aap phir sab kuch iske zariye module dot attribute ki tarah pahunchte ho, aur wo access ek live lookup hai. from module import name abhi bhi poora module load karta hai, par ye aapke namespace mein name ko seedhe us object se bind karta hai jise module dot name us pal refer karta hai. Ek function ya class ke liye ye shaayad hi maayne rakhta hai. Par ek module-level variable ke liye jo rebind ho sakta hai — ek config value jo lazily set hoti hai, ek counter — ye bahut maayne rakhta hai: aapka imported naam ek snapshot hai. Niyam ye hai: by default module import karo aur qualified access istemal karo; mутhee bhar aksar istemal, asandigdh naam ke liye from-import istemal karo.',
      },
    ],

    exercises: [
      {
        task: 'Create `lib.py` that prints `"lib loaded"` at the top and defines `X = 1`. Create `driver.py` that imports `lib` twice and does `from lib import X`. Run `driver.py` with `subprocess` and confirm `"lib loaded"` appears exactly once. Then in `lib.py` add a function `set_x(n)` that rebinds `X`; call it from `driver.py` and print both `lib.X` and the imported `X` — show they differ.',
        taskHi: '`lib.py` banao jo top par `"lib loaded"` print kare aur `X = 1` define kare. `driver.py` banao jo `lib` ko do baar import kare aur `from lib import X` kare. `driver.py` ko `subprocess` se chalao aur confirm karo `"lib loaded"` bilkul ek baar dikhta hai. Phir `lib.py` mein ek function `set_x(n)` jodo jo `X` rebind kare; ise `driver.py` se call karo aur `lib.X` aur imported `X` dono print karo — dikhao wo alag hain.',
        hint: 'Use `tempfile.mkdtemp()` + `textwrap.dedent` to write the files, then `subprocess.run([sys.executable, "driver.py"], cwd=d, capture_output=True, text=True)`. After `lib.set_x(99)`: `lib.X` is `99`, the `from`-imported `X` is still `1`.',
        hintHi: 'Files likhne ko `tempfile.mkdtemp()` + `textwrap.dedent` istemal karo, phir `subprocess.run([sys.executable, "driver.py"], cwd=d, capture_output=True, text=True)`. `lib.set_x(99)` ke baad: `lib.X` `99` hai, `from`-imported `X` abhi bhi `1` hai.',
      },
      {
        task: 'Write a script that prints `sys.path` one entry per line, then imports `json` and prints `json.__file__` and `type(json)`. Then create a local `json.py` with `MARKER = "shadowed"` in the same directory, run the script again, and observe `import json` now picks up your file (`json.__file__` ends in your path, `json.MARKER` exists, `json.loads` does not).',
        taskHi: 'Ek script likho jo `sys.path` ek entry prati line print kare, phir `json` import kare aur `json.__file__` aur `type(json)` print kare. Phir usi directory mein `MARKER = "shadowed"` waali ek local `json.py` banao, script phir chalao, aur dekho `import json` ab aapki file uthaata hai (`json.__file__` aapke path mein khatam hota hai, `json.MARKER` maujood hai, `json.loads` nahi).',
        hint: 'Run both versions with `subprocess` from the temp dir. The first run: `json.__file__` is in the stdlib and `hasattr(json, "loads")` is `True`. After adding `json.py`: `json.__file__` is your file and `hasattr(json, "loads")` is `False`.',
        hintHi: 'Dono versions ko temp dir se `subprocess` se chalao. Pehla run: `json.__file__` stdlib mein hai aur `hasattr(json, "loads")` `True` hai. `json.py` jodne ke baad: `json.__file__` aapki file hai aur `hasattr(json, "loads")` `False` hai.',
      },
      {
        task: 'Create `slow.py` whose top level prints `"expensive setup ran"` and sets `DATA = list(range(5))`. Create `a.py` and `b.py` that each `import slow` and print `slow.DATA`. Create `runner.py` that imports both `a` and `b`. Run `runner.py` and confirm `"expensive setup ran"` prints once, not twice — the import cache means `slow`\'s body runs a single time even though two modules import it.',
        taskHi: '`slow.py` banao jiska top level `"expensive setup ran"` print kare aur `DATA = list(range(5))` set kare. `a.py` aur `b.py` banao jo har ek `import slow` karein aur `slow.DATA` print karein. `runner.py` banao jo dono `a` aur `b` import kare. `runner.py` chalao aur confirm karo `"expensive setup ran"` ek baar print hota hai, do baar nahi.',
        hint: 'The output order is: `slow`\'s print (triggered by `a`\'s import), then `a`\'s print, then `b`\'s print (no second `slow` print). `sys.modules` holds `slow` after the first import.',
        hintHi: 'Output kram: `slow` ka print (`a` ke import se trigger), phir `a` ka print, phir `b` ka print (koi doosra `slow` print nahi). Pehle import ke baad `sys.modules` `slow` rakhta hai.',
      },
    ],

    keyTakeaways: [
      '`import x` does three things once: find `x` on `sys.path`, execute `x.py` top-to-bottom, bind the name `x` to the resulting module object. Members are attributes: `x.thing`.',
      '`sys.modules` is the cache. The second (and every later) `import x` anywhere in the process is just a dict lookup — the file does NOT run again.',
      'Everything at a module\'s top level runs on first import. Keep top level to imports, definitions, and cheap constants; put work (network, computation, I/O) inside functions.',
      '`from x import name` copies the CURRENT value of `x.name` into your namespace. If `x` later rebinds `name`, your copy is stale — access mutable module state as `x.name`, not by importing the name.',
      '`sys.path` order: script directory first, then `PYTHONPATH`, then stdlib, then site-packages. First match wins. `ModuleNotFoundError` = not found in any of them (wrong directory or wrong/inactive environment).',
      'NEVER name a file after a stdlib or installed module (`json.py`, `email.py`, `random.py`, `test.py`, `types.py`) — yours shadows the real one and breaks it and its dependents.',
      'Prefer `import module` (self-documenting call sites, no clashes). `from module import name` is fine for a few well-known names. `from module import *` is interactive-only.',
      'A module is an object: `type(m)` is `module`; it has `__name__`, `__file__`, `__dict__`; you can pass it around and inspect it.',
    ],
    keyTakeawaysHi: [
      '`import x` teen cheezein ek baar karta hai: `x` ko `sys.path` par dhoondho, `x.py` top-to-bottom execute karo, naam `x` ko nateeja module object se bind karo. Members attributes hain: `x.thing`.',
      '`sys.modules` cache hai. Process mein kahin bhi doosra (aur har baad ka) `import x` bas ek dict lookup hai — file phir NAHI chalti.',
      'Ek module ke top level par sab kuch pehle import par chalta hai. Top level ko imports, definitions, aur saste constants tak rakho; kaam (network, computation, I/O) functions ke andar rakho.',
      '`from x import name` `x.name` ki CURRENT value aapke namespace mein copy karta hai. Agar `x` baad mein `name` rebind karta hai, aapki copy purani hai — badal sakne waali module state ko `x.name` se access karo.',
      '`sys.path` kram: pehle script directory, phir `PYTHONPATH`, phir stdlib, phir site-packages. Pehla match jeetta hai. `ModuleNotFoundError` = kisi mein nahi mila (galat directory ya galat/inactive environment).',
      'KABHI ek file ko ek stdlib ya installed module ke naam par mat rakho (`json.py`, `email.py`, `random.py`, `test.py`) — aapki asli ko shadow karti hai aur ise aur iske dependents ko todti hai.',
      '`import module` prefer karo (self-documenting call sites, koi clashes nahi). `from module import name` kuch jaane-maane naam ke liye theek. `from module import *` sirf interactive.',
      'Ek module ek object hai: `type(m)` `module` hai; iske `__name__`, `__file__`, `__dict__` hain; aap ise paas kar sakte ho aur inspect kar sakte ho.',
    ],
  },

  {
    slug: 'py-name-main-guard',
    title: 'if __name__ == "__main__": the Script/Module Switch',
    titleHi: 'if __name__ == "__main__": Script/Module Switch',
    description: 'Writing a utility file that does its job when you run it directly, then importing one helper function from it into another file and watching the whole utility execute as a side effect of the import. Every module has a `__name__`; Python sets it to `"__main__"` only for the file you launched, and to the module\'s import name for everything you import — so `if __name__ == "__main__":` is the line that separates "run me" code from "import me" code.',
    descriptionHi: 'Ek utility file likhna jo seedhe chalane par apna kaam karti hai, phir ek helper function ise doosri file mein import karna aur poori utility ko import ke side effect ki tarah execute hote dekhna. Har module ka ek `__name__` hai; Python ise sirf us file ke liye `"__main__"` set karta hai jise aapne launch kiya, aur baaki sabke liye module ke import naam par — isliye `if __name__ == "__main__":` wo line hai jo "mujhe chalao" code ko "mujhe import karo" code se alag karti hai.',
    difficulty: 'EASY',
    duration: 16,
    order: 2,

    analogy: {
      en: '**A recipe card with a note that says "if you are cooking this now, also preheat the oven".** The recipe itself — the list of ingredients, the method — is useful to anyone: someone cooking it tonight, or an author quoting one step of it in a bigger cookbook. But "preheat the oven now" only makes sense for the person actually cooking it as the main dish right now. It would be wrong to preheat just because a cookbook author flipped past this card to copy the sauce instructions. So the card marks that instruction: "only if this is the dish you are making". Python gives every file a label, `__name__`, that answers "is this the file the cook launched?". For the launched file the label reads `"__main__"`; for a file that was merely imported, the label is its own module name. The `if __name__ == "__main__":` block is the "preheat the oven now" note — the code that should run only when this file is the one being executed, not when it is imported for one of its functions.',
      hi: '**Ek recipe card ek note ke saath jo kehta hai "agar aap ise abhi bana rahe ho, oven bhi preheat karo".** Recipe khud — ingredients ki list, method — kisi ke liye bhi upyogi hai: koi jo ise aaj raat bana raha hai, ya ek author jo ek bade cookbook mein iske ek step ko quote kar raha hai. Par "oven abhi preheat karo" sirf us vyakti ke liye samajh mein aata hai jo ise abhi main dish ki tarah bana raha hai. Ye galat hoga preheat karna sirf isliye ki ek cookbook author ne sauce instructions copy karne ko is card ko palat diya. Toh card us instruction ko mark karta hai: "sirf agar ye wo dish hai jo aap bana rahe ho". Python har file ko ek label, `__name__`, deta hai, jo jawaab deta hai "kya ye wo file hai jise cook ne launch kiya?". Launch ki gayi file ke liye label `"__main__"` padhta hai; sirf import ki gayi file ke liye, label iska apna module naam hai.',
    },

    simple: `**The problem: import runs everything at top level**

\`\`\`python
# tool.py
def clean(text):
    return text.strip().lower()

print(clean("  HELLO  "))          # this runs on import too!
print("running some analysis...")  # and this
\`\`\`

\`\`\`python
# other.py
from tool import clean             # prints "hello" and "running some analysis..." -- unwanted
\`\`\`

**The fix: guard the "run me" code**

\`\`\`python
# tool.py
def clean(text):
    return text.strip().lower()

def main():
    print(clean("  HELLO  "))
    print("running some analysis...")

if __name__ == "__main__":         # True only when tool.py is the launched file
    main()
\`\`\`

Now \`python tool.py\` runs \`main()\`; \`from tool import clean\` gets just the function, no output.

\`\`\`
Every module has __name__:
  - when you run  python tool.py     -> tool's __name__ is "__main__"
  - when another file imports tool   -> tool's __name__ is "tool"
  - when you run  python -m pkg.tool -> tool's __name__ is "__main__" (still the entry)

if __name__ == "__main__":
    main()

  ^ code here runs ONLY when this file is the one you launched.
    On import, __name__ != "__main__", so it is skipped.

Put in the guard: arg parsing, calling main(), demo/test prints, a REPL.
Keep OUT of the guard: imports, function/class defs, constants -- those are for importers too.
\`\`\``,

    simpleHi: `**Samasya: import top level par sab kuch chalata hai**

\`\`\`python
# tool.py
def clean(text):
    return text.strip().lower()

print(clean("  HELLO  "))          # ye import par bhi chalta hai!
print("running some analysis...")  # aur ye
\`\`\`

\`\`\`python
# other.py
from tool import clean             # "hello" aur "running some analysis..." print karta hai -- anchaaha
\`\`\`

**Fix: "mujhe chalao" code ko guard karo**

\`\`\`python
# tool.py
def clean(text):
    return text.strip().lower()

def main():
    print(clean("  HELLO  "))
    print("running some analysis...")

if __name__ == "__main__":         # True sirf jab tool.py launch ki gayi file hai
    main()
\`\`\`

Ab \`python tool.py\` \`main()\` chalata hai; \`from tool import clean\` bas function paata hai, koi output nahi.

\`\`\`
Har module ka __name__ hai:
  - jab aap chalate ho  python tool.py     -> tool ka __name__ "__main__" hai
  - jab doosri file tool import karti hai   -> tool ka __name__ "tool" hai
  - jab aap chalate ho  python -m pkg.tool -> tool ka __name__ "__main__" (abhi bhi entry)

if __name__ == "__main__":
    main()

  ^ yahaan code SIRF tab chalta hai jab ye file wo hai jise aapne launch kiya.
    Import par, __name__ != "__main__", isliye ye chhod diya jaata hai.

Guard mein rakho: arg parsing, main() call, demo/test prints, ek REPL.
Guard se BAHAR rakho: imports, function/class defs, constants -- wo importers ke liye bhi hain.
\`\`\``,

    content: `## Why \`__name__\` exists

When Python executes a file, it sets a module-level variable \`__name__\` in that file's namespace:

\`\`\`python
# anywhere in any file:
print(__name__)
# "__main__"   if this file was launched (python thisfile.py, or python -m thispkg.thisfile)
# "thisfile"   if this file was imported by another
# "mypkg.sub.thisfile"  if imported as part of a package
\`\`\`

There is exactly one \`"__main__"\` module per process — the entry point. Everything else carries its dotted import name. The idiom \`if __name__ == "__main__":\` reads as "only when I am the program being run, not when I am a piece someone imported".

## The \`main()\` pattern

\`\`\`python
import sys

def run(paths):
    for p in paths:
        ...

def main(argv=None):
    argv = argv or sys.argv[1:]
    if not argv:
        print("usage: tool.py FILE...", file=sys.stderr)
        return 1
    run(argv)
    return 0

if __name__ == "__main__":
    sys.exit(main())
\`\`\`

Putting the logic in a \`main(argv=None)\` function (rather than directly under the \`if\`) means: it is testable (call \`main(["a", "b"])\` from a test), it can be reused (imported and called by another script), and \`sys.exit(main())\` propagates the exit code.

## \`python file.py\` vs \`python -m package.module\`

\`\`\`
python tool.py
  - sys.path[0] is the DIRECTORY containing tool.py
  - tool.py's __name__ is "__main__"
  - relative imports in tool.py FAIL (it is not treated as part of a package)

python -m mypkg.tool
  - sys.path[0] is the current directory
  - mypkg/tool.py runs with __name__ == "__main__"
  - BUT __package__ is "mypkg", so relative imports (from . import x) WORK
  - this is how you run a module that lives inside a package
\`\`\`

Use \`python -m\` to run a module that is part of a package (so its \`from . import helpers\` works), and to run installed tools (\`python -m pytest\`, \`python -m http.server\`, \`python -m venv\`).

## \`__main__.py\` — making a package runnable

\`\`\`
mypkg/
    __init__.py
    __main__.py        <- python -m mypkg runs THIS
    core.py
\`\`\`

\`\`\`python
# mypkg/__main__.py
from mypkg.core import main
if __name__ == "__main__":
    main()
\`\`\`

Then \`python -m mypkg\` (or the zipped/installed form) runs the package as an application. This is how \`python -m http.server\` and \`python -m json.tool\` work.

## Common misuse

\`\`\`python
# DON'T: real logic directly under the guard, nothing reusable
if __name__ == "__main__":
    data = load()
    result = [transform(x) for x in data]   # 40 lines of logic here
    save(result)                            # can't test or reuse any of it

# DO: a thin guard calling named functions
def process():
    data = load()
    return [transform(x) for x in data]

if __name__ == "__main__":
    save(process())
\`\`\``,

    contentHi: `## \`__name__\` kyun maujood hai

Jab Python ek file execute karta hai, ye us file ke namespace mein ek module-level variable \`__name__\` set karta hai:

\`\`\`python
# kisi bhi file mein kahin bhi:
print(__name__)
# "__main__"   agar ye file launch ki gayi thi (python thisfile.py, ya python -m thispkg.thisfile)
# "thisfile"   agar ye file doosre dwara import ki gayi
# "mypkg.sub.thisfile"  agar ek package ke hisse ki tarah import ki gayi
\`\`\`

Prati process bilkul ek \`"__main__"\` module hai — entry point. Baaki sab apna dotted import naam rakhte hain. Idiom \`if __name__ == "__main__":\` "sirf jab main chalaya ja raha program hoon, jab main ek tukda hoon jo kisi ne import kiya tab nahi" ki tarah padhta hai.

## \`main()\` pattern

\`\`\`python
import sys

def run(paths):
    for p in paths:
        ...

def main(argv=None):
    argv = argv or sys.argv[1:]
    if not argv:
        print("usage: tool.py FILE...", file=sys.stderr)
        return 1
    run(argv)
    return 0

if __name__ == "__main__":
    sys.exit(main())
\`\`\`

Logic ko ek \`main(argv=None)\` function mein rakhna (seedhe \`if\` ke neeche nahi) matlab: ye testable hai (ek test se \`main(["a", "b"])\` call karo), ise reuse kiya ja sakta hai, aur \`sys.exit(main())\` exit code propagate karta hai.

## \`python file.py\` vs \`python -m package.module\`

\`\`\`
python tool.py
  - sys.path[0] tool.py waali DIRECTORY hai
  - tool.py ka __name__ "__main__" hai
  - tool.py mein relative imports FAIL hote hain (ise ek package ka hissa nahi maana jaata)

python -m mypkg.tool
  - sys.path[0] current directory hai
  - mypkg/tool.py __name__ == "__main__" ke saath chalta hai
  - PAR __package__ "mypkg" hai, isliye relative imports (from . import x) KAAM karte hain
  - aise aap ek module chalate ho jo ek package ke andar rehta hai
\`\`\`

\`python -m\` istemal karo ek module chalane ko jo ek package ka hissa hai, aur installed tools chalane ko (\`python -m pytest\`, \`python -m http.server\`, \`python -m venv\`).

## \`__main__.py\` — ek package ko runnable banaana

\`\`\`
mypkg/
    __init__.py
    __main__.py        <- python -m mypkg ISE chalata hai
    core.py
\`\`\`

\`\`\`python
# mypkg/__main__.py
from mypkg.core import main
if __name__ == "__main__":
    main()
\`\`\`

Phir \`python -m mypkg\` package ko ek application ki tarah chalata hai. Aise \`python -m http.server\` aur \`python -m json.tool\` kaam karte hain.

## Aam galat istemal

\`\`\`python
# MAT KARO: asli logic seedhe guard ke neeche, kuch reusable nahi
if __name__ == "__main__":
    data = load()
    result = [transform(x) for x in data]   # yahaan 40 lines logic
    save(result)                            # ismein se kuch bhi test ya reuse nahi kar sakte

# KARO: ek patla guard jo named functions call kare
def process():
    data = load()
    return [transform(x) for x in data]

if __name__ == "__main__":
    save(process())
\`\`\``,

    examples: [
      {
        title: '__name__ is "__main__" when launched, the module name when imported',
        titleHi: 'launch par __name__ "__main__" hai, import par module naam',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
open(os.path.join(d, "greeter.py"), "w").write(textwrap.dedent('''
    def hello(name):
        return f"hello {name}"

    print("greeter.py __name__ is:", __name__)

    if __name__ == "__main__":
        print("greeter running as a script:", hello("world"))
'''))
open(os.path.join(d, "consumer.py"), "w").write(textwrap.dedent('''
    import greeter
    print("consumer using greeter.hello:", greeter.hello("Sam"))
'''))

print("=== python greeter.py ===")
print(subprocess.run([sys.executable, "greeter.py"], cwd=d, capture_output=True, text=True).stdout, end="")
print("=== python consumer.py ===")
print(subprocess.run([sys.executable, "consumer.py"], cwd=d, capture_output=True, text=True).stdout, end="")`,
        output: `=== python greeter.py ===
greeter.py __name__ is: __main__
greeter running as a script: hello world
=== python consumer.py ===
greeter.py __name__ is: greeter
consumer using greeter.hello: hello Sam`,
        explain: 'Run directly, `greeter.py` has `__name__ == "__main__"`, so the guarded block runs. Imported by `consumer.py`, `greeter.py`\'s `__name__` is `"greeter"`, so the guard is skipped — but the top-level `print` (outside the guard) still runs on import, which is why "greeter.py __name__ is: greeter" appears. Keep only the run-me code inside the guard.',
        explainHi: 'Seedhe chalane par, `greeter.py` ka `__name__ == "__main__"` hai, isliye guarded block chalta hai. `consumer.py` dwara import karne par, `greeter.py` ka `__name__` `"greeter"` hai, isliye guard chhod diya jaata hai — par top-level `print` (guard ke baahar) abhi bhi import par chalta hai. Sirf run-me code guard ke andar rakho.',
      },
      {
        title: 'A testable main(argv) with an exit code',
        titleHi: 'Ek testable main(argv) ek exit code ke saath',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
open(os.path.join(d, "wordcount.py"), "w").write(textwrap.dedent('''
    import sys

    def count_words(text):
        return len(text.split())

    def main(argv=None):
        argv = sys.argv[1:] if argv is None else argv
        if not argv:
            print("usage: wordcount.py TEXT", file=sys.stderr)
            return 2
        print(count_words(" ".join(argv)))
        return 0

    if __name__ == "__main__":
        sys.exit(main())
'''))
open(os.path.join(d, "test_wordcount.py"), "w").write(textwrap.dedent('''
    from wordcount import count_words, main
    assert count_words("a b c") == 3
    assert main(["one", "two"]) == 0        # call main directly in a test
    assert main([]) == 2                    # no args -> exit code 2
    print("all assertions passed")
'''))

print(subprocess.run([sys.executable, "wordcount.py", "the", "quick", "brown", "fox"],
                     cwd=d, capture_output=True, text=True).stdout, end="")
r = subprocess.run([sys.executable, "wordcount.py"], cwd=d, capture_output=True, text=True)
print("no-args exit code:", r.returncode)
print(subprocess.run([sys.executable, "test_wordcount.py"], cwd=d, capture_output=True, text=True).stdout, end="")`,
        output: `4
no-args exit code: 2
2
all assertions passed`,
        explain: 'The logic lives in `count_words` and `main(argv=None)`, not directly under the guard. `python wordcount.py the quick brown fox` prints `4` and exits 0; with no args it prints usage to stderr and exits 2 (visible via `returncode`). The test file imports `count_words` and `main` and calls `main(["one", "two"])` directly (which prints the count `2` and returns exit code `0`) — impossible if the logic were inline under `if __name__ == "__main__":`.',
        explainHi: 'Logic `count_words` aur `main(argv=None)` mein rehta hai, seedhe guard ke neeche nahi. `python wordcount.py the quick brown fox` `4` print karta hai aur 0 exit karta hai; bina args ke ye usage stderr par print karta hai aur 2 exit karta hai. Test file `count_words` aur `main` import karti hai aur `main(["one", "two"])` seedhe call karti hai (jo count `2` print karta hai aur exit code `0` lautaata hai) — asambhav agar logic inline `if __name__ == "__main__":` ke neeche hota.',
      },
      {
        title: 'python -m pkg.mod: relative imports work, plain run fails',
        titleHi: 'python -m pkg.mod: relative imports kaam karte hain, plain run fail hota hai',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
os.makedirs(os.path.join(d, "mypkg"))
open(os.path.join(d, "mypkg", "__init__.py"), "w").write("")
open(os.path.join(d, "mypkg", "helpers.py"), "w").write("def shout(s): return s.upper()\\n")
open(os.path.join(d, "mypkg", "cli.py"), "w").write(textwrap.dedent('''
    from . import helpers          # explicit relative import

    def main():
        print("cli says:", helpers.shout("done"))

    if __name__ == "__main__":
        main()
'''))

print("=== python -m mypkg.cli ===")
r1 = subprocess.run([sys.executable, "-m", "mypkg.cli"], cwd=d, capture_output=True, text=True)
print(r1.stdout, end="")
print("=== python mypkg/cli.py ===")
r2 = subprocess.run([sys.executable, os.path.join("mypkg", "cli.py")], cwd=d, capture_output=True, text=True)
print("stdout:", r2.stdout.strip() or "(none)")
print("stderr last line:", r2.stderr.strip().splitlines()[-1])`,
        output: `=== python -m mypkg.cli ===
cli says: DONE
=== python mypkg/cli.py ===
stdout: (none)
stderr last line: ImportError: attempted relative import with no known parent package`,
        explain: '`python -m mypkg.cli` runs `cli.py` with `__name__ == "__main__"` AND `__package__ == "mypkg"`, so `from . import helpers` resolves. Running the file directly as `python mypkg/cli.py` gives it no package context, so the relative import raises `ImportError`. Modules inside packages should be run with `python -m`.',
        explainHi: '`python -m mypkg.cli` `cli.py` ko `__name__ == "__main__"` AUR `__package__ == "mypkg"` ke saath chalata hai, isliye `from . import helpers` resolve hota hai. File ko seedhe `python mypkg/cli.py` ki tarah chalana ise koi package context nahi deta, isliye relative import `ImportError` raise karta hai. Packages ke andar modules `python -m` se chalaaye jaane chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `# report.py
import pandas as pd
df = pd.read_csv("data.csv")          # runs on every import
summary = df.describe()
print(summary)

# elsewhere:  from report import something   -> reads the CSV, prints, every time`,
        right: `# report.py
import pandas as pd

def build_summary(path="data.csv"):
    return pd.read_csv(path).describe()

if __name__ == "__main__":
    print(build_summary())`,
        why: 'Top-level file I/O and printing run as a side effect of importing the module — so importing one function from `report.py` also reads the CSV and prints a table. Wrap the executable behaviour in a function and call it under the `__main__` guard.',
        whyHi: 'Top-level file I/O aur printing module import karne ke side effect ki tarah chalte hain — isliye `report.py` se ek function import karna bhi CSV padhta hai aur ek table print karta hai. Executable behaviour ko ek function mein wrap karo aur ise `__main__` guard ke neeche call karo.',
      },
      {
        wrong: `if __name__ == "__main__":
    # 60 lines of argument parsing, file walking, transformation, and output
    ...`,
        right: `def main(argv=None):
    # the same 60 lines, but callable and testable
    ...

if __name__ == "__main__":
    raise SystemExit(main())`,
        why: 'Code directly under the guard cannot be imported, called from a test, or reused by another script. Move it into `main(argv=None)` and keep the guard to one line. `raise SystemExit(main())` (or `sys.exit(main())`) forwards the return value as the process exit code.',
        whyHi: 'Seedhe guard ke neeche code import, ek test se call, ya doosri script dwara reuse nahi ho sakta. Ise `main(argv=None)` mein le jaao aur guard ko ek line tak rakho. `raise SystemExit(main())` return value ko process exit code ki tarah forward karta hai.',
      },
      {
        wrong: `# running a package module directly:
python mypkg/cli.py
# ImportError: attempted relative import with no known parent package`,
        right: `python -m mypkg.cli
# runs cli.py with __name__ == "__main__" AND package context for 'from . import ...'`,
        why: 'A file run as `python path/to/file.py` is treated as a standalone script with no package, so any `from . import x` or `from ..pkg import y` in it fails. Run modules that live inside a package with `python -m package.module` so relative imports resolve.',
        whyHi: '`python path/to/file.py` ki tarah chalayi gayi file ek standalone script maani jaati hai bina package, isliye ismein koi bhi `from . import x` fail hota hai. Package ke andar rehne waale modules ko `python -m package.module` se chalao taaki relative imports resolve hon.',
      },
    ],

    realWorld: [
      {
        en: '**`manage.py` in every Django project is exactly this pattern** — a thin file whose `if __name__ == "__main__": main()` calls `execute_from_command_line(sys.argv)`. You never `import manage`; it exists only to be run.',
        hi: '**Har Django project mein `manage.py` bilkul ye pattern hai** — ek patli file jiska `if __name__ == "__main__": main()` `execute_from_command_line(sys.argv)` call karta hai. Aap kabhi `import manage` nahi karte; ye sirf chalaaye jaane ke liye maujood hai.',
      },
      {
        en: '**`python -m` is how you run tools without a shim script** — `python -m pytest`, `python -m http.server 8000`, `python -m json.tool file.json`, `python -m venv .venv`, `python -m pip install ...`. Each of those packages has a `__main__.py`. Using `-m` also guarantees you run the tool from the interpreter you meant.',
        hi: '**`python -m` aise aap bina ek shim script ke tools chalate ho** — `python -m pytest`, `python -m http.server 8000`, `python -m json.tool file.json`, `python -m venv .venv`. Un packages mein se har ek mein ek `__main__.py` hai. `-m` istemal karna ye bhi guarantee karta hai ki aap tool ko us interpreter se chalate ho jo aapka matlab tha.',
      },
      {
        en: '**Test discovery depends on the guard** — pytest imports every `test_*.py` file to collect its tests. If a test file (or a module it imports) does real work at top level instead of under a guard, that work runs during collection, slowing the suite and sometimes hitting the network or a database before any test starts.',
        hi: '**Test discovery guard par nirbhar karta hai** — pytest har `test_*.py` file ko iske tests collect karne ko import karta hai. Agar ek test file (ya ek module jo ye import karti hai) ek guard ke neeche ke bajaye top level par asli kaam karti hai, wo kaam collection ke dauraan chalta hai, suite ko dheema karte hue.',
      },
    ],

    interviewQA: [
      {
        q: 'What is `if __name__ == "__main__":` and why is it needed?',
        qHi: '`if __name__ == "__main__":` kya hai aur ise kyun chahiye?',
        a: 'Every Python module has a module-level string variable called dunder-name that Python sets when it loads the file. If the file is the one you launched — with python file dot py, or with python dash m package dot module — Python sets its dunder-name to the literal string "__main__". If the file was loaded because some other module imported it, Python sets its dunder-name to the module\'s own import name, like "utils" or "myapp.services.email". So checking whether dunder-name equals "__main__" is asking "am I the program the user started, or am I a library that got imported?". The reason you need it is that importing a module executes the entire file from top to bottom. Function and class definitions are fine — they just create objects. But any other top-level statement also runs: prints, argument parsing, calling a main function, doing file or network I/O. If you write a utility script that both defines a useful function and, at the bottom, calls that function and prints the result, then the moment another file does from utility import the_function, it also triggers the call and the print as a side effect of the import. Wrapping the "run me" part in if dunder-name equals "__main__" makes it run only when the file is executed directly and skips it on import, so the same file can serve as both an importable library and a runnable script. The idiomatic form is to put the actual logic in a function, conventionally main, often taking an argv parameter defaulting to None, and make the guarded block just call it, usually as sys dot exit of main so the return value becomes the process exit code. That keeps the logic testable and reusable — a test can import main and call it with a list of arguments — rather than trapped under the guard.',
        aHi: 'Har Python module mein ek module-level string variable hai jise dunder-name kehte hain jise Python file load karte samay set karta hai. Agar file wo hai jise aapne launch kiya — python file dot py se, ya python dash m package dot module se — Python iska dunder-name literal string "__main__" set karta hai. Agar file isliye load hui ki kisi doosre module ne ise import kiya, Python iska dunder-name module ke apne import naam par set karta hai. Toh ye check karna ki dunder-name "__main__" ke barabar hai ya nahi ye poochhna hai "kya main wo program hoon jo user ne shuru kiya, ya main ek library hoon jo import hui?". Ise chahiye kyunki ek module import karna poori file top se bottom execute karta hai. Function aur class definitions theek hain. Par koi bhi doosra top-level statement bhi chalta hai: prints, argument parsing, ek main function call karna, file ya network I/O. "Run me" hisse ko if dunder-name equals "__main__" mein wrap karna ise sirf tab chalaata hai jab file seedhe execute hoti hai. Idiomatic roop asli logic ko ek function mein rakhna hai, convention se main.',
      },
      {
        q: 'What is the difference between `python script.py` and `python -m package.module`?',
        qHi: '`python script.py` aur `python -m package.module` mein kya antar hai?',
        a: 'Both run a file with its dunder-name set to "__main__", but they set up the import environment differently, and the difference matters when the file is part of a package. When you run python script dot py, Python takes the directory that contains script dot py and puts it first on sys dot path, then runs the file as a top-level module with no package. Its dunder-package is empty. That means any explicit relative import inside it — from dot import helpers, or from dot dot subpackage import thing — fails with an error about no known parent package, because there is no package context to resolve the dots against. When you run python dash m package dot module, Python instead puts the current working directory first on sys dot path, imports the package, and then runs the named submodule as the main module, but with its dunder-package correctly set to the containing package. So relative imports resolve normally. The dash m form is therefore the correct way to run a module that lives inside a package and uses relative imports, and it is also how you invoke installed command-line tools that ship a dunder-main file, like python dash m pytest or python dash m http dot server. A secondary benefit of dash m is that it always uses the interpreter you named, which avoids the common confusion of a bare pytest or pip on the PATH belonging to a different Python than the one you intend. The practical rule: use python dash m for anything inside a package and for running tools, and reserve python script dot py for genuinely standalone single-file scripts.',
        aHi: 'Dono ek file ko iske dunder-name "__main__" set karke chalate hain, par wo import environment ko alag tarike se set karte hain, aur antar tab maayne rakhta hai jab file ek package ka hissa hai. Jab aap python script dot py chalate ho, Python script dot py waali directory ko sys dot path par pehle rakhta hai, phir file ko ek top-level module ki tarah chalata hai bina package. Iska dunder-package khaali hai. Iska matlab ismein koi bhi explicit relative import fail hota hai. Jab aap python dash m package dot module chalate ho, Python current working directory ko sys dot path par pehle rakhta hai, package import karta hai, aur phir named submodule ko main module ki tarah chalata hai, par iske dunder-package sahi roop se containing package par set ke saath. Toh relative imports saamaanya roop se resolve hote hain. Dash m roop isliye ek package ke andar rehne waale module ko chalane ka sahi tarika hai, aur ye installed command-line tools invoke karne ka bhi tarika hai. Vyavhaarik niyam: package ke andar kisi bhi cheez aur tools chalane ke liye python dash m istemal karo.',
      },
    ],

    exercises: [
      {
        task: 'Write `calc.py` defining `add(a, b)` and `sub(a, b)`, plus a `main(argv=None)` that reads `argv` as `[op, x, y]`, does the op, prints the result, returns 0 (or 2 on bad input). Guard with `if __name__ == "__main__": sys.exit(main())`. Then write `use_calc.py` that imports `add` and confirms importing produces NO output.',
        taskHi: '`calc.py` likho jo `add(a, b)` aur `sub(a, b)` define kare, plus ek `main(argv=None)` jo `argv` ko `[op, x, y]` ki tarah padhe, op kare, result print kare, 0 return kare (ya bad input par 2). `if __name__ == "__main__": sys.exit(main())` se guard karo. Phir `use_calc.py` likho jo `add` import kare aur confirm kare import karne se KOI output nahi hota.',
        hint: 'Run `calc.py add 2 3` -> prints `5`, exit 0. Run `use_calc.py` via subprocess and assert `stdout == ""`. If you see output on import, some executable code is outside the guard.',
        hintHi: '`calc.py add 2 3` chalao -> `5` print karta hai, exit 0. `use_calc.py` ko subprocess se chalao aur assert karo `stdout == ""`. Agar aap import par output dekhte ho, kuch executable code guard ke baahar hai.',
      },
      {
        task: 'Create a package `tools/` with `__init__.py`, `fmt.py` (defines `title(s)` -> `s.title()`), and `cli.py` that does `from . import fmt` and has a `main()` printing `fmt.title("hello world")` under a guard. Show `python -m tools.cli` prints `Hello World` and `python tools/cli.py` fails with an `ImportError` about relative imports.',
        taskHi: 'Ek package `tools/` banao `__init__.py`, `fmt.py` (`title(s)` -> `s.title()` define kare), aur `cli.py` ke saath jo `from . import fmt` kare aur ek guard ke neeche `fmt.title("hello world")` print karta ek `main()` ho. Dikhao `python -m tools.cli` `Hello World` print karta hai aur `python tools/cli.py` relative imports ke baare mein ek `ImportError` se fail hota hai.',
        hint: 'Both runs via `subprocess.run(..., cwd=<dir containing tools/>)`. The `-m` run succeeds; the direct-path run has empty stdout and `stderr` ending in `attempted relative import with no known parent package`.',
        hintHi: 'Dono runs `subprocess.run(..., cwd=<tools/ waali dir>)` se. `-m` run safal hota hai; direct-path run ka stdout khaali hai aur `stderr` `attempted relative import with no known parent package` mein khatam hota hai.',
      },
      {
        task: 'Write `pipeline.py` with `load()` returning `[1,2,3]`, `transform(xs)` returning `[x*10 for x in xs]`, and `run()` returning `transform(load())`. Under the guard, just `print(run())`. Write `test_pipeline.py` that imports `run` and asserts `run() == [10,20,30]` — proving the logic is reusable because it is not trapped under the guard.',
        taskHi: '`pipeline.py` likho `load()` jo `[1,2,3]` lautaaye, `transform(xs)` jo `[x*10 for x in xs]` lautaaye, aur `run()` jo `transform(load())` lautaaye ke saath. Guard ke neeche, bas `print(run())`. `test_pipeline.py` likho jo `run` import kare aur assert kare `run() == [10,20,30]` — saabit karte hue ki logic reusable hai kyunki ye guard ke neeche trapped nahi hai.',
        hint: '`python pipeline.py` prints `[10, 20, 30]`. `test_pipeline.py` does `from pipeline import run` then `assert run() == [10, 20, 30]; print("ok")`. Both run via subprocess.',
        hintHi: '`python pipeline.py` `[10, 20, 30]` print karta hai. `test_pipeline.py` `from pipeline import run` phir `assert run() == [10, 20, 30]; print("ok")` karta hai. Dono subprocess se chalte hain.',
      },
    ],

    keyTakeaways: [
      'Every module has `__name__`. Python sets it to `"__main__"` for the file you launched (`python file.py` or `python -m pkg.mod`), and to the module\'s import name for anything imported.',
      '`if __name__ == "__main__":` guards code that should run ONLY when the file is executed directly — not when it is imported. Importing a module runs its whole top level.',
      'Put in the guard: `main()` call, arg parsing entry, demo prints. Keep OUT: imports, `def`/`class`, constants — those serve importers too.',
      'Put logic in a `main(argv=None)` function and make the guard a one-liner (`sys.exit(main())` / `raise SystemExit(main())`). Then it is testable and reusable; the exit code propagates.',
      '`python file.py`: script\'s directory goes on `sys.path`, `__name__` is `"__main__"`, but relative imports FAIL (no package context).',
      '`python -m pkg.mod`: runs `mod` with `__name__ == "__main__"` AND `__package__ == "pkg"`, so `from . import x` works. Use it for modules inside packages and for tools (`python -m pytest`, `python -m http.server`).',
      'A package with a `__main__.py` is runnable as `python -m package` — this is how `python -m json.tool` and Django\'s `manage.py`-style entry points work.',
      'Real work (I/O, network, heavy compute) directly at module top level runs on every import — a common cause of slow imports and side effects during test collection.',
    ],
    keyTakeawaysHi: [
      'Har module ka `__name__` hai. Python ise us file ke liye `"__main__"` set karta hai jise aapne launch kiya (`python file.py` ya `python -m pkg.mod`), aur import ki gayi kisi bhi cheez ke liye module ke import naam par.',
      '`if __name__ == "__main__":` us code ko guard karta hai jo SIRF tab chale jab file seedhe execute hoti hai — jab ise import kiya jaata hai tab nahi. Ek module import karna iska poora top level chalata hai.',
      'Guard mein rakho: `main()` call, arg parsing entry, demo prints. BAHAR rakho: imports, `def`/`class`, constants — wo importers ke liye bhi hain.',
      'Logic ko ek `main(argv=None)` function mein rakho aur guard ko ek line banao (`sys.exit(main())`). Phir ye testable aur reusable hai; exit code propagate hota hai.',
      '`python file.py`: script ki directory `sys.path` par jaati hai, `__name__` `"__main__"` hai, par relative imports FAIL hote hain (koi package context nahi).',
      '`python -m pkg.mod`: `mod` ko `__name__ == "__main__"` AUR `__package__ == "pkg"` ke saath chalata hai, isliye `from . import x` kaam karta hai. Ise packages ke andar modules aur tools ke liye istemal karo.',
      'Ek package `__main__.py` ke saath `python -m package` ki tarah runnable hai — aise `python -m json.tool` aur Django ke `manage.py`-style entry points kaam karte hain.',
      'Module top level par seedhe asli kaam (I/O, network, bhaari compute) har import par chalta hai — dheeme imports aur test collection ke dauraan side effects ka ek aam kaaran.',
    ],
  },

  {
    slug: 'py-packages-and-init',
    title: 'Packages and __init__.py',
    titleHi: 'Packages Aur __init__.py',
    description: 'Splitting a growing module into a folder of files and finding that `import myapp.services` fails until you add an `__init__.py`, then wondering what that file is supposed to contain and why some are empty while others re-export half the package. A package is a directory Python treats as a module; `__init__.py` is the code that runs when the package itself is imported.',
    descriptionHi: 'Ek badhte module ko files ke ek folder mein baantna aur paana ki `import myapp.services` fail hota hai jab tak aap ek `__init__.py` na jodo, phir sochna ki us file mein kya hona chahiye aur kuch khaali kyun hain jabki doosri aadha package re-export karti hain. Ek package ek directory hai jise Python ek module ki tarah maanta hai; `__init__.py` wo code hai jo tab chalta hai jab package khud import hota hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A department in an office building versus a single desk.** A single desk is a module — one file, one person, everything they do is right there. A department is a package — a whole room with several desks (sub-modules), and on the door there is a card that says what the department is and, optionally, a short directory of "for X, see desk 3; for Y, see desk 5". That door card is `__init__.py`. It always exists (an empty card still marks the room as a real department rather than a storage closet), and Python runs whatever is on it the first time anyone enters the department. You can leave it blank and make visitors walk to the specific desk they need — `from myapp.services.email import send`. Or you can write a helpful directory on it that forwards the common requests — so `from myapp.services import send` works because the door card itself pulled `send` up from desk 3. A department can contain smaller departments (sub-packages), each with its own door card. The card is also where you put anything that must be true for the whole department before any desk is used.',
      hi: '**Ek office building mein ek department versus ek akela desk.** Ek akela desk ek module hai — ek file, ek vyakti. Ek department ek package hai — kai desks (sub-modules) waala ek poora room, aur darwaaze par ek card hai jo bataata hai department kya hai aur, vaikalpik roop se, "X ke liye, desk 3 dekho; Y ke liye, desk 5" ki ek chhoti directory. Wo door card `__init__.py` hai. Ye hamesha maujood hai (ek khaali card abhi bhi room ko ek asli department ki tarah mark karta hai), aur Python ispar jo bhi hai wo pehli baar chalata hai jab koi department mein pravesh karta hai. Aap ise khaali chhod sakte ho aur visitors ko us specific desk tak chalne de sakte ho jise unhe chahiye — `from myapp.services.email import send`. Ya aap ispar ek madadgaar directory likh sakte ho jo aam requests ko forward kare. Ek department chhote departments (sub-packages) rakh sakta hai, har ek apne door card ke saath.',
    },

    simple: `**A package is a directory; \`__init__.py\` makes it importable**

\`\`\`
myapp/
    __init__.py         <- runs when you 'import myapp'
    config.py
    services/
        __init__.py     <- runs when you 'import myapp.services'
        email.py
        sms.py
    models/
        __init__.py
        user.py
\`\`\`

\`\`\`python
import myapp                              # runs myapp/__init__.py
import myapp.services.email               # runs myapp/__init__.py, then services/__init__.py, then email.py
from myapp.services.email import send     # same, then binds 'send'
from myapp.models.user import User
\`\`\`

**\`__init__.py\` can be empty, or it can curate the public API**

\`\`\`python
# myapp/services/__init__.py  -- empty is fine:
#     (nothing)
# callers write:  from myapp.services.email import send

# OR curate -- re-export the common names:
from myapp.services.email import send_email
from myapp.services.sms import send_sms

__all__ = ["send_email", "send_sms"]      # what 'from myapp.services import *' exposes
# now callers can write:  from myapp.services import send_email
\`\`\`

\`\`\`
PACKAGE           a directory with an __init__.py (Python <3.3 required it;
                  now a dir without one is a "namespace package" -- usually you
                  still want the file)

__init__.py       runs ONCE when the package is first imported (before any submodule).
                  empty  -> package is just a container; import submodules directly
                  curated -> re-export a clean public API; hide internal file layout

importing myapp.services.email runs, in order:
    myapp/__init__.py  ->  myapp/services/__init__.py  ->  myapp/services/email.py
each cached in sys.modules as 'myapp', 'myapp.services', 'myapp.services.email'

__all__ = [...]   controls  from package import *  AND documents the public API
\`\`\``,

    simpleHi: `**Ek package ek directory hai; \`__init__.py\` ise importable banaata hai**

\`\`\`
myapp/
    __init__.py         <- tab chalta hai jab aap 'import myapp' karte ho
    config.py
    services/
        __init__.py     <- tab chalta hai jab aap 'import myapp.services' karte ho
        email.py
        sms.py
    models/
        __init__.py
        user.py
\`\`\`

\`\`\`python
import myapp                              # myapp/__init__.py chalata hai
import myapp.services.email               # myapp/__init__.py, phir services/__init__.py, phir email.py
from myapp.services.email import send     # wahi, phir 'send' bind karta hai
from myapp.models.user import User
\`\`\`

**\`__init__.py\` khaali ho sakta hai, ya ye public API curate kar sakta hai**

\`\`\`python
# myapp/services/__init__.py  -- khaali theek hai:
#     (kuch nahi)
# callers likhte hain:  from myapp.services.email import send

# YA curate karo -- aam naam re-export karo:
from myapp.services.email import send_email
from myapp.services.sms import send_sms

__all__ = ["send_email", "send_sms"]      # 'from myapp.services import *' kya expose karta hai
# ab callers likh sakte hain:  from myapp.services import send_email
\`\`\`

\`\`\`
PACKAGE           ek __init__.py waali directory (Python <3.3 ise chahiye tha;
                  ab ise bina ek dir ek "namespace package" hai -- aam taur par aap
                  abhi bhi file chahte ho)

__init__.py       package ke pehli baar import hone par EK BAAR chalta hai (kisi submodule se pehle).
                  khaali  -> package bas ek container hai; submodules seedhe import karo
                  curated -> ek saaf public API re-export karo; internal file layout chhupao

myapp.services.email import karna chalata hai, kram mein:
    myapp/__init__.py  ->  myapp/services/__init__.py  ->  myapp/services/email.py
har ek sys.modules mein cache 'myapp', 'myapp.services', 'myapp.services.email'

__all__ = [...]   from package import *  ko control karta hai AUR public API document karta hai
\`\`\``,

    content: `## What runs, and in what order

\`\`\`python
from myapp.services.email import send
\`\`\`

Python imports and caches, top-down:

1. \`myapp\` — runs \`myapp/__init__.py\`, caches as \`sys.modules["myapp"]\`
2. \`myapp.services\` — runs \`myapp/services/__init__.py\`, caches as \`sys.modules["myapp.services"]\`
3. \`myapp.services.email\` — runs \`email.py\`, caches as \`sys.modules["myapp.services.email"]\`
4. binds \`send\` in your namespace to \`email.send\`

Each \`__init__.py\` in the chain runs once. If \`myapp/__init__.py\` is slow or has side effects, every import of anything under \`myapp\` pays that cost.

## Empty vs curated \`__init__.py\`

**Empty** — the package is a namespace, callers reach into submodules:

\`\`\`python
# myapp/services/__init__.py is empty
from myapp.services.email import send_email
from myapp.services.sms import send_sms
\`\`\`

**Curated** — the package presents a flat public API and hides its internal file layout:

\`\`\`python
# myapp/services/__init__.py
from .email import send_email
from .sms import send_sms
from .push import send_push

__all__ = ["send_email", "send_sms", "send_push"]
\`\`\`

\`\`\`python
# callers:
from myapp.services import send_email       # don't need to know it lives in email.py
\`\`\`

The curated form lets you move \`send_email\` from \`email.py\` to \`notifications.py\` later without breaking callers — you only update the \`__init__.py\`. Cost: a bit of indirection, and \`__init__.py\` now imports its submodules eagerly (so \`import myapp.services\` loads \`email\`, \`sms\`, and \`push\` even if you only need one).

## \`__all__\`

\`\`\`python
# myapp/services/__init__.py
__all__ = ["send_email", "send_sms"]
\`\`\`

\`__all__\` is a list of strings naming the public attributes. It does two things:

- \`from myapp.services import *\` imports exactly those names (without \`__all__\`, \`*\` imports every name not starting with \`_\`).
- It documents intent: "these are the supported names; anything else is internal".

It does **not** prevent \`from myapp.services import _internal\` — it is a convention and a \`*\` filter, not access control.

## Relative imports inside a package

\`\`\`python
# myapp/services/email.py
from . import config_helpers          # sibling module in myapp/services/
from .templates import render         # myapp/services/templates.py
from ..config import SETTINGS         # up one level: myapp/config.py
from ..models.user import User        # myapp/models/user.py
\`\`\`

One dot = "this package"; two dots = "parent package". Relative imports make it clear a name is internal to your package and keep working if the top-level package is renamed. They only work inside a package imported as a package (not in a file run as \`python file.py\` — see the previous lesson).

## Namespace packages (no \`__init__.py\`)

Since Python 3.3, a directory without \`__init__.py\` can still be imported as a "namespace package". This exists mainly to let a single logical package be split across multiple directories (e.g. plugins). For an ordinary application package, **include the \`__init__.py\`** — it is explicit, it is where package-level setup goes, and some tools still expect it.

## A real layout

\`\`\`
myproject/
    pyproject.toml
    src/
        myapp/
            __init__.py          # version, maybe a curated API
            __main__.py          # python -m myapp
            config.py
            cli.py
            services/
                __init__.py
                email.py
                sms.py
            models/
                __init__.py
                user.py
                order.py
    tests/
        test_services.py
\`\`\``,

    contentHi: `## Kya chalta hai, aur kis kram mein

\`\`\`python
from myapp.services.email import send
\`\`\`

Python import aur cache karta hai, top-down:

1. \`myapp\` — \`myapp/__init__.py\` chalata hai, \`sys.modules["myapp"]\` ki tarah cache
2. \`myapp.services\` — \`myapp/services/__init__.py\` chalata hai, cache
3. \`myapp.services.email\` — \`email.py\` chalata hai, cache
4. aapke namespace mein \`send\` ko \`email.send\` se bind karta hai

Chain mein har \`__init__.py\` ek baar chalta hai. Agar \`myapp/__init__.py\` dheema hai ya iske side effects hain, \`myapp\` ke tahat kisi bhi cheez ka har import wo keemat bharta hai.

## Khaali vs curated \`__init__.py\`

**Khaali** — package ek namespace hai, callers submodules mein pahunchte hain:

\`\`\`python
# myapp/services/__init__.py khaali hai
from myapp.services.email import send_email
from myapp.services.sms import send_sms
\`\`\`

**Curated** — package ek flat public API pesh karta hai aur apna internal file layout chhupata hai:

\`\`\`python
# myapp/services/__init__.py
from .email import send_email
from .sms import send_sms
from .push import send_push

__all__ = ["send_email", "send_sms", "send_push"]
\`\`\`

\`\`\`python
# callers:
from myapp.services import send_email       # jaanne ki zaroorat nahi ki ye email.py mein rehta hai
\`\`\`

Curated roop aapko baad mein \`send_email\` ko \`email.py\` se \`notifications.py\` mein le jaane deta hai bina callers ko tode — aap sirf \`__init__.py\` update karte ho. Keemat: thoda indirection, aur \`__init__.py\` ab apne submodules ko eagerly import karta hai.

## \`__all__\`

\`\`\`python
# myapp/services/__init__.py
__all__ = ["send_email", "send_sms"]
\`\`\`

\`__all__\` public attributes ko naam dene waali strings ki ek list hai. Ye do cheezein karta hai:

- \`from myapp.services import *\` bilkul un naam ko import karta hai (\`__all__\` ke bina, \`*\` har naam import karta hai jo \`_\` se shuru nahi hota).
- Ye intent document karta hai: "ye supported naam hain; baaki sab internal".

Ye \`from myapp.services import _internal\` ko **nahi** rokta — ye ek convention aur ek \`*\` filter hai, access control nahi.

## Ek package ke andar relative imports

\`\`\`python
# myapp/services/email.py
from . import config_helpers          # myapp/services/ mein sibling module
from .templates import render         # myapp/services/templates.py
from ..config import SETTINGS         # ek level upar: myapp/config.py
from ..models.user import User        # myapp/models/user.py
\`\`\`

Ek dot = "ye package"; do dots = "parent package". Relative imports saaf karte hain ki ek naam aapke package ke internal hai aur top-level package rename hone par kaam karte rehte hain. Wo sirf ek package ke andar kaam karte hain jo ek package ki tarah import hua (ek file mein nahi jo \`python file.py\` ki tarah chalayi gayi).

## Namespace packages (koi \`__init__.py\` nahi)

Python 3.3 se, bina \`__init__.py\` ke ek directory abhi bhi ek "namespace package" ki tarah import ho sakti hai. Ye mukhya roop se ek akele logical package ko kai directories mein baantne ke liye maujood hai. Ek saamaanya application package ke liye, **\`__init__.py\` shaamil karo** — ye explicit hai, ye jahaan package-level setup jaata hai, aur kuch tools abhi bhi ise expect karte hain.

## Ek asli layout

\`\`\`
myproject/
    pyproject.toml
    src/
        myapp/
            __init__.py          # version, shaayad ek curated API
            __main__.py          # python -m myapp
            config.py
            cli.py
            services/
                __init__.py
                email.py
                sms.py
            models/
                __init__.py
                user.py
                order.py
    tests/
        test_services.py
\`\`\``,

    examples: [
      {
        title: 'Building a package and watching each __init__.py run once',
        titleHi: 'Ek package banaana aur har __init__.py ko ek baar chalte dekhna',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
os.makedirs(os.path.join(d, "shop", "services"))
open(os.path.join(d, "shop", "__init__.py"), "w").write('print("shop/__init__.py ran")\\n')
open(os.path.join(d, "shop", "services", "__init__.py"), "w").write('print("shop/services/__init__.py ran")\\n')
open(os.path.join(d, "shop", "services", "email.py"), "w").write(textwrap.dedent('''
    print("shop/services/email.py ran")
    def send(to): return f"sent to {to}"
'''))
open(os.path.join(d, "run.py"), "w").write(textwrap.dedent('''
    print("-- import 1 --")
    from shop.services.email import send
    print("-- import 2 --")
    import shop.services.email          # already cached: nothing re-runs
    print(send("a@b.com"))
    import sys
    print(sorted(k for k in sys.modules if k.startswith("shop")))
'''))

print(subprocess.run([sys.executable, "run.py"], cwd=d, capture_output=True, text=True).stdout, end="")`,
        output: `-- import 1 --
shop/__init__.py ran
shop/services/__init__.py ran
shop/services/email.py ran
-- import 2 --
sent to a@b.com
['shop', 'shop.services', 'shop.services.email']
`,
        explain: '`from shop.services.email import send` triggers three imports in order — the two `__init__.py` files then `email.py` — each printing once. The second import (`import shop.services.email`) prints nothing: all three are already in `sys.modules`, cached under their full dotted names.',
        explainHi: '`from shop.services.email import send` teen imports kram mein trigger karta hai — do `__init__.py` files phir `email.py` — har ek ek baar print karta hai. Doosra import kuch print nahi karta: teenon pehle se `sys.modules` mein hain, apne poore dotted names ke tahat cached.',
      },
      {
        title: 'Empty __init__.py vs a curated one that re-exports',
        titleHi: 'Khaali __init__.py vs ek curated jo re-export kare',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
os.makedirs(os.path.join(d, "notify"))
open(os.path.join(d, "notify", "email_backend.py"), "w").write("def send_email(to): return f'email->{to}'\\n")
open(os.path.join(d, "notify", "sms_backend.py"), "w").write("def send_sms(to): return f'sms->{to}'\\n")
# curated __init__.py: flat public API, hides file names
open(os.path.join(d, "notify", "__init__.py"), "w").write(textwrap.dedent('''
    from .email_backend import send_email
    from .sms_backend import send_sms
    __all__ = ["send_email", "send_sms"]
'''))
open(os.path.join(d, "app.py"), "w").write(textwrap.dedent('''
    # callers use the package's flat API, not the internal file layout:
    from notify import send_email, send_sms
    print(send_email("a@b.com"))
    print(send_sms("+100"))

    import notify
    print("public API:", notify.__all__)
'''))

print(subprocess.run([sys.executable, "app.py"], cwd=d, capture_output=True, text=True).stdout, end="")`,
        output: `email->a@b.com
sms->+100
public API: ['send_email', 'send_sms']`,
        explain: 'The curated `notify/__init__.py` re-exports `send_email` and `send_sms` from their backend files, so callers write `from notify import send_email` and never mention `email_backend.py`. If you later rename `email_backend.py`, you fix one line in `__init__.py` and every caller keeps working. `__all__` documents the two supported names.',
        explainHi: 'Curated `notify/__init__.py` `send_email` aur `send_sms` ko unke backend files se re-export karta hai, isliye callers `from notify import send_email` likhte hain aur kabhi `email_backend.py` ka zikr nahi karte. Agar aap baad mein `email_backend.py` rename karte ho, aap `__init__.py` mein ek line theek karte ho aur har caller kaam karta rehta hai.',
      },
      {
        title: 'Relative imports inside a package (. and ..)',
        titleHi: 'Ek package ke andar relative imports (. aur ..)',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
os.makedirs(os.path.join(d, "store", "services"))
open(os.path.join(d, "store", "__init__.py"), "w").write("")
open(os.path.join(d, "store", "config.py"), "w").write('TAX_RATE = 0.2\\n')
open(os.path.join(d, "store", "services", "__init__.py"), "w").write("")
open(os.path.join(d, "store", "services", "pricing.py"), "w").write("def base(): return 100\\n")
open(os.path.join(d, "store", "services", "checkout.py"), "w").write(textwrap.dedent('''
    from . import pricing            # sibling: store/services/pricing.py
    from ..config import TAX_RATE    # parent package: store/config.py

    def total():
        net = pricing.base()
        return net * (1 + TAX_RATE)
'''))
open(os.path.join(d, "main.py"), "w").write(textwrap.dedent('''
    from store.services.checkout import total
    print("total:", total())
'''))

print(subprocess.run([sys.executable, "main.py"], cwd=d, capture_output=True, text=True).stdout, end="")
# and the same module run directly -> relative import fails:
r = subprocess.run([sys.executable, os.path.join("store", "services", "checkout.py")],
                   cwd=d, capture_output=True, text=True)
print("direct run stderr:", r.stderr.strip().splitlines()[-1])`,
        output: `total: 120.0
direct run stderr: ImportError: attempted relative import with no known parent package`,
        explain: '`checkout.py` uses `from . import pricing` (a sibling in `store/services/`) and `from ..config import TAX_RATE` (up in `store/`). One dot is the current package, two dots the parent. Imported via `store.services.checkout` it all resolves; run directly as a file it has no package context and the relative import fails.',
        explainHi: '`checkout.py` `from . import pricing` (`store/services/` mein ek sibling) aur `from ..config import TAX_RATE` (`store/` mein upar) istemal karta hai. Ek dot current package hai, do dots parent. `store.services.checkout` ke zariye import karne par sab resolve hota hai; ek file ki tarah seedhe chalane par iska koi package context nahi aur relative import fail hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `myapp/
    services/           # no __init__.py
        email.py
# import myapp.services.email  -> sometimes works (namespace pkg), sometimes not,
#                                 tooling gets confused, tests miscollect`,
        right: `myapp/
    __init__.py
    services/
        __init__.py     # include it -- explicit, predictable
        email.py`,
        why: 'While Python 3.3+ allows importing a directory without `__init__.py` as a namespace package, the behaviour is subtle and depends on `sys.path`. For a normal application package, add the empty `__init__.py`: it makes the package explicit, gives you a place for package-level setup, and avoids tools (pytest, mypy, build backends) treating the directory inconsistently.',
        whyHi: 'Haalaanki Python 3.3+ bina `__init__.py` ke ek directory ko ek namespace package ki tarah import karne deta hai, behaviour sookshm hai aur `sys.path` par nirbhar karta hai. Ek saamaanya application package ke liye, khaali `__init__.py` jodo: ye package ko explicit banaata hai aur tools ko directory ko asangat tarike se maanne se bachaata hai.',
      },
      {
        wrong: `# myapp/__init__.py
from myapp.database import connect
CONNECTION = connect()               # opens a DB connection on 'import myapp'`,
        right: `# myapp/__init__.py -- keep it cheap
__version__ = "1.2.0"
# provide a function; let callers decide when to connect
from myapp.database import connect`,
        why: 'Code in `__init__.py` runs on the FIRST import of anything in the package — including when a test collector, a linter, or an IDE imports it for inspection. A DB connection, a network call, or heavy work there makes the whole package slow and fragile to import. Keep `__init__.py` to version info, cheap constants, and re-exports.',
        whyHi: '`__init__.py` mein code package mein kisi bhi cheez ke PEHLE import par chalta hai — jab ek test collector, ek linter, ya ek IDE ise inspection ke liye import karta hai tab bhi. Wahaan ek DB connection ya bhaari kaam poore package ko import karne mein dheema banaata hai. `__init__.py` ko version info, saste constants, aur re-exports tak rakho.',
      },
      {
        wrong: `# deep inside myapp/services/email/templates.py
from myapp.services.email.renderer import render     # long, brittle absolute path`,
        right: `from .renderer import render                          # relative: clear it is internal
# absolute imports are fine too; the point is: be consistent and prefer
# relative for intra-package references`,
        why: 'For imports *within* the same package, an explicit relative import (`from .renderer import render`) signals "this is an internal detail" and survives the top-level package being renamed or vendored. Reserve absolute imports (`from myapp...`) for cross-package references and third-party libraries. Do not mix both styles for the same relationship.',
        whyHi: 'Usi package ke *andar* imports ke liye, ek explicit relative import (`from .renderer import render`) sanket deta hai "ye ek internal detail hai" aur top-level package rename hone par bacha rehta hai. Absolute imports (`from myapp...`) ko cross-package references ke liye rakho. Usi sambandh ke liye dono styles mix mat karo.',
      },
    ],

    realWorld: [
      {
        en: '**A Django "app" is a package** — `users/`, `orders/`, each with `__init__.py`, `models.py`, `views.py`, `apps.py`, `migrations/`. `INSTALLED_APPS` lists the package paths. Django imports each app package, so a slow `users/__init__.py` slows every `manage.py` command.',
        hi: '**Ek Django "app" ek package hai** — `users/`, `orders/`, har ek `__init__.py`, `models.py`, `views.py`, `apps.py`, `migrations/` ke saath. `INSTALLED_APPS` package paths list karta hai. Django har app package import karta hai, isliye ek dheema `users/__init__.py` har `manage.py` command dheema karta hai.',
      },
      {
        en: '**Curated `__init__.py` re-exports are how libraries present a clean surface** — `import requests; requests.get(...)` works because `requests/__init__.py` re-exports `get`, `post`, `Session` etc. from internal modules. You import `from django.db import models` without knowing `models` is assembled from a dozen files.',
        hi: '**Curated `__init__.py` re-exports aise libraries ek saaf surface pesh karti hain** — `import requests; requests.get(...)` isliye kaam karta hai kyunki `requests/__init__.py` `get`, `post`, `Session` ko internal modules se re-export karta hai. Aap `from django.db import models` import karte ho bina jaane ki `models` ek dozen files se assemble hota hai.',
      },
      {
        en: '**`__all__` matters for `from module import *` in package `__init__` files and for documentation tools** — Sphinx autodoc and IDEs use it to decide what is public. DRF and Django set `__all__` in many `__init__.py` files so `from rest_framework import serializers` gives you a curated set.',
        hi: '**`__all__` package `__init__` files mein `from module import *` ke liye aur documentation tools ke liye maayne rakhta hai** — Sphinx autodoc aur IDEs ise ye tay karne ko istemal karte hain ki kya public hai. DRF aur Django kai `__init__.py` files mein `__all__` set karte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a package, what is `__init__.py` for, and when should it be empty vs contain code?',
        qHi: 'Ek package kya hai, `__init__.py` kis liye hai, aur ye kab khaali vs code waala hona chahiye?',
        a: 'A package is a directory that Python treats as a module — a way to group related sub-modules under one dotted namespace, like myapp dot services dot email. The file that makes a directory a package, and that controls what happens when the package itself is imported, is init dot py. When you import anything from a package, Python runs the init dot py of every package level on the way down, once each, and caches each level in sys dot modules under its full dotted name. So importing myapp dot services dot email runs myapp\'s init, then services\' init, then email dot py. Since Python 3.3 a directory without an init dot py can still be imported as a namespace package, but that mechanism is mainly for splitting one logical package across multiple locations; for an ordinary application package you should include the file, because it is explicit, it is where package-level setup belongs, and some tooling still expects it. As for contents: an empty init dot py is the right default. It marks the directory as a package and does nothing else, and callers import the specific submodule they need — from myapp dot services dot email import send. You put code in init dot py when you want the package to present a curated public interface rather than exposing its file layout. Then init dot py imports the key names from the submodules and re-exports them, optionally listing them in dunder-all, so callers can write from myapp dot services import send without knowing or caring which file send lives in. The benefit is that you can reorganise the internal files later and only update init dot py. The cost is a little indirection and eager loading — importing the package now runs all the submodules that init dot py pulls from. The one thing to avoid in init dot py is expensive or side-effecting work: a database connection, a network call, heavy computation. That code runs on the first import of anything in the package, including when a test runner or IDE imports it for inspection, so it makes the whole package slow and fragile. Keep init dot py to a version string, cheap constants, and re-exports.',
        aHi: 'Ek package ek directory hai jise Python ek module ki tarah maanta hai — sambandhit sub-modules ko ek dotted namespace ke tahat group karne ka tarika. Jo file ek directory ko ek package banaati hai, aur jo control karti hai ki jab package khud import hota hai to kya hota hai, wo init dot py hai. Jab aap ek package se kuch import karte ho, Python neeche jaate raaste par har package level ka init dot py chalata hai, har ek ek baar, aur har level ko sys dot modules mein cache karta hai. Python 3.3 se bina init dot py ke ek directory abhi bhi ek namespace package ki tarah import ho sakti hai, par wo mainly ek logical package ko kai jagah baantne ke liye hai; ek saamaanya application package ke liye aapko file shaamil karni chahiye. Contents: ek khaali init dot py sahi default hai. Aap init dot py mein code tab rakhte ho jab aap chahte ho ki package ek curated public interface pesh kare. Jis cheez se bachna hai wo init dot py mein mehnga ya side-effecting kaam hai.',
      },
      {
        q: 'Explain relative imports (`from . import x`, `from ..pkg import y`). When do they work and when do they fail?',
        qHi: 'Relative imports (`from . import x`, `from ..pkg import y`) samjhaao. Wo kab kaam karte hain aur kab fail hote hain?',
        a: 'A relative import uses leading dots to refer to a location relative to the current module\'s package rather than to an absolute path from the top of sys dot path. One dot means "the package this module is in", so from dot import helpers imports a sibling module, and from dot something import name imports a name from a sibling. Two dots means "the parent package", so from dot dot config import SETTINGS goes up one level and into a config module there; you can chain more dots to go further up. The purpose is to make intra-package references explicit as internal — a reader sees the dot and knows the target is part of the same package — and to keep those imports working if the top-level package is renamed or vendored under a different name, since nothing hard-codes the top package name. They resolve against the module\'s dunder-package attribute, which Python sets based on how the module was imported. This is exactly why they fail in one common situation: running a file directly with python path to file dot py. In that case Python treats the file as a standalone top-level script, its dunder-package is empty, there is no package context, and any relative import raises ImportError with a message about no known parent package. The same file imported as part of its package, or run with python dash m package dot module, has dunder-package set correctly and the relative imports resolve. So relative imports work when the module is loaded as part of a package and fail when it is executed as a lone script. The practical consequences: use python dash m to run modules that live inside packages, put executable entry points either at the top level or behind a console-script entry point rather than deep in the package, and if you need a module to be both importable and directly runnable, use absolute imports in it or guard the direct-run path carefully.',
        aHi: 'Ek relative import current module ke package ke saapेksh ek sthaan ko refer karne ke liye leading dots istemal karta hai, sys dot path ke top se ek absolute path ke bajaye. Ek dot matlab "wo package jismein ye module hai", toh from dot import helpers ek sibling module import karta hai. Do dots matlab "parent package", toh from dot dot config import SETTINGS ek level upar jaata hai. Maqsad intra-package references ko internal ki tarah explicit banaana hai, aur un imports ko kaam karte rakhna hai agar top-level package rename hota hai. Wo module ke dunder-package attribute ke saapeksh resolve hote hain, jise Python is aadhaar par set karta hai ki module kaise import hua. Yahi wajah hai ki wo ek aam sthiti mein fail hote hain: ek file ko seedhe python path to file dot py se chalana. Us case mein Python file ko ek standalone top-level script maanta hai, iska dunder-package khaali hai. Wahi file iske package ke hisse ki tarah import ki gayi, ya python dash m se chalayi gayi, ka dunder-package sahi set hai. Vyavhaarik: packages ke andar modules chalane ko python dash m istemal karo.',
      },
    ],

    exercises: [
      {
        task: 'Build a package `blog/` with `__init__.py`, `posts.py` (`def latest(): return ["a", "b"]`), and a sub-package `blog/render/` with its own `__init__.py` and `html.py` (`def to_html(items): return "<ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>"`). From a `main.py`, import `blog.posts.latest` and `blog.render.html.to_html` and combine them. Add a `print` to each `__init__.py` and confirm the run shows each printing once, in order.',
        taskHi: 'Ek package `blog/` banao `__init__.py`, `posts.py` (`def latest(): return ["a", "b"]`), aur ek sub-package `blog/render/` apne `__init__.py` aur `html.py` ke saath. Ek `main.py` se, `blog.posts.latest` aur `blog.render.html.to_html` import karo aur unhe combine karo. Har `__init__.py` mein ek `print` jodo aur confirm karo run har ek ko ek baar, kram mein, printing dikhaata hai.',
        hint: 'Import order for `from blog.render.html import to_html`: `blog/__init__.py`, then `blog/render/__init__.py`, then `blog/render/html.py`. `blog/posts.py` runs when you touch `blog.posts`.',
        hintHi: '`from blog.render.html import to_html` ke liye import kram: `blog/__init__.py`, phir `blog/render/__init__.py`, phir `blog/render/html.py`. `blog/posts.py` tab chalta hai jab aap `blog.posts` ko chhoote ho.',
      },
      {
        task: 'Make a package `pay/` with `stripe_backend.py` (`def charge(n): return f"stripe:{n}"`) and `paypal_backend.py` (`def charge(n): return f"paypal:{n}"`). Write a curated `pay/__init__.py` that re-exports both as `stripe_charge` and `paypal_charge` and sets `__all__`. From `app.py`, use `from pay import stripe_charge`. Then rename `stripe_backend.py` to `card_backend.py`, update only `__init__.py`, and confirm `app.py` still works unchanged.',
        taskHi: 'Ek package `pay/` banao `stripe_backend.py` (`def charge(n): return f"stripe:{n}"`) aur `paypal_backend.py` ke saath. Ek curated `pay/__init__.py` likho jo dono ko `stripe_charge` aur `paypal_charge` ki tarah re-export kare aur `__all__` set kare. `app.py` se, `from pay import stripe_charge` istemal karo. Phir `stripe_backend.py` ko `card_backend.py` rename karo, sirf `__init__.py` update karo, aur confirm karo `app.py` abhi bhi abadle kaam karta hai.',
        hint: 'This demonstrates the value of a curated `__init__.py`: the backend file name is an internal detail. `app.py` only ever references `pay.stripe_charge`, so moving the implementation is a one-line change in `__init__.py`.',
        hintHi: 'Ye ek curated `__init__.py` ki value dikhaata hai: backend file naam ek internal detail hai. `app.py` sirf `pay.stripe_charge` reference karta hai, isliye implementation move karna `__init__.py` mein ek-line change hai.',
      },
      {
        task: 'Create `lib/` with `config.py` (`VERSION = "1.0"`), a sub-package `lib/core/` with `engine.py` that does `from ..config import VERSION` and `def info(): return f"engine v{VERSION}"`. Run it two ways via subprocess: `python -m` from the parent dir (works) and `python lib/core/engine.py` directly (fails). Capture and print both results, showing the relative-import `ImportError` on the direct run.',
        taskHi: '`lib/` banao `config.py` (`VERSION = "1.0"`), ek sub-package `lib/core/` `engine.py` ke saath jo `from ..config import VERSION` aur `def info(): return f"engine v{VERSION}"` kare. Ise subprocess se do tarikon se chalao: parent dir se `python -m` (kaam karta hai) aur seedhe `python lib/core/engine.py` (fail hota hai). Dono results capture aur print karo.',
        hint: 'Add a guard to `engine.py`: `if __name__ == "__main__": print(info())`. `python -m lib.core.engine` prints `engine v1.0`. `python lib/core/engine.py` fails at `from ..config import VERSION` with `attempted relative import with no known parent package`.',
        hintHi: '`engine.py` mein ek guard jodo: `if __name__ == "__main__": print(info())`. `python -m lib.core.engine` `engine v1.0` print karta hai. `python lib/core/engine.py` `from ..config import VERSION` par fail hota hai.',
      },
    ],

    keyTakeaways: [
      'A package is a directory Python treats as a module. `__init__.py` marks it and runs ONCE when the package is first imported (before any submodule).',
      'Importing `a.b.c` runs `a/__init__.py`, then `a/b/__init__.py`, then `a/b/c.py` — each cached in `sys.modules` under its full dotted name.',
      'Empty `__init__.py` (the default): the package is just a namespace; callers import submodules directly (`from myapp.services.email import send`).',
      'Curated `__init__.py`: re-export key names (`from .email import send`) so callers use a flat API (`from myapp.services import send`) and the internal file layout can change without breaking them. Cost: indirection + eager submodule loading.',
      '`__all__ = [...]` controls `from package import *` and documents the public API. It is NOT access control — `_private` names are still importable explicitly.',
      'Keep `__init__.py` cheap: version string, constants, re-exports. NO DB connections, network calls, or heavy work — it runs on the first import of anything in the package.',
      'Relative imports: one dot = current package (`from . import sibling`), two dots = parent (`from ..config import X`). They make intra-package references explicit and survive a package rename.',
      'Relative imports only work when the module is loaded as part of a package. They fail in a file run directly as `python file.py` — use `python -m package.module`.',
    ],
    keyTakeawaysHi: [
      'Ek package ek directory hai jise Python ek module ki tarah maanta hai. `__init__.py` ise mark karta hai aur package ke pehli baar import hone par EK BAAR chalta hai (kisi submodule se pehle).',
      '`a.b.c` import karna `a/__init__.py`, phir `a/b/__init__.py`, phir `a/b/c.py` chalata hai — har ek `sys.modules` mein apne poore dotted naam ke tahat cached.',
      'Khaali `__init__.py` (default): package bas ek namespace hai; callers submodules seedhe import karte hain.',
      'Curated `__init__.py`: key naam re-export karo (`from .email import send`) taaki callers ek flat API istemal karein aur internal file layout unhe tode bina badal sake. Keemat: indirection + eager submodule loading.',
      '`__all__ = [...]` `from package import *` ko control karta hai aur public API document karta hai. Ye access control NAHI hai — `_private` naam abhi bhi spasht roop se importable hain.',
      '`__init__.py` ko sasta rakho: version string, constants, re-exports. KOI DB connections, network calls, ya bhaari kaam nahi — ye package mein kisi bhi cheez ke pehle import par chalta hai.',
      'Relative imports: ek dot = current package (`from . import sibling`), do dots = parent (`from ..config import X`). Wo intra-package references ko explicit banaate hain aur ek package rename se bache rehte hain.',
      'Relative imports sirf tab kaam karte hain jab module ek package ke hisse ki tarah load hota hai. Wo `python file.py` ki tarah seedhe chalayi gayi file mein fail hote hain — `python -m package.module` istemal karo.',
    ],
  },
];
