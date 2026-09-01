/**
 * Python Complete Course — Module 5: Modules, Packages, Imports & Environments,
 * lessons 4-6.
 *
 * Lesson 4: absolute vs relative imports, and circular imports — why a cycle
 *           half-initialises a module, the `ImportError: cannot import name`
 *           / `AttributeError` you get, and the three standard fixes.
 * Lesson 5: virtual environments, pip, and dependency files — why per-project
 *           isolation, `python -m venv`, activation, `pip install`,
 *           `requirements.txt` vs `pyproject.toml`, pinning and lockfiles.
 * Lesson 6: project layout and running code — flat vs `src/` layout, editable
 *           installs (`pip install -e .`), console-script entry points,
 *           `PYTHONPATH`, and how this maps to a Django project.
 *
 * NOTE for future editors: same rules as the rest of this course. Every
 * backtick inside simple/simpleHi/content/contentHi is `\`` (inline code inside
 * ``` blocks included). Escape `$` before `{` inside template literals as `\${`.
 * Keep example OUTPUT ASCII-only. Lessons 4 examples use `subprocess` + temp
 * files; lessons 5-6 examples are mostly shell transcripts shown as `code` with
 * the observed `output` — a few use `subprocess` to run pip/venv where feasible,
 * otherwise the `output` is a representative transcript and the example is
 * marked so the verifier treats it as illustrative (still ASCII, still real).
 * Run every runnable sample with `python`. Scan for Devanagari/Cyrillic. tsc.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_5_PART2: CourseLesson[] = [
  {
    slug: 'py-circular-imports',
    title: 'Absolute vs Relative Imports, and Circular Imports',
    titleHi: 'Absolute vs Relative Imports, Aur Circular Imports',
    description: 'Two modules that each need something from the other — `models.py` imports a helper from `services.py`, and `services.py` imports a class from `models.py` — and one of them fails with `ImportError: cannot import name X (most likely due to a circular import)`. The cycle means one module is still half-executed when the other tries to read from it. There are three reliable fixes.',
    descriptionHi: 'Do modules jinhe har ek ko doosre se kuch chahiye — `models.py` `services.py` se ek helper import karta hai, aur `services.py` `models.py` se ek class import karta hai — aur unmein se ek `ImportError: cannot import name X (most likely due to a circular import)` se fail hota hai. Cycle ka matlab ek module abhi bhi aadha-execute hai jab doosra usse padhne ki koshish karta hai. Teen bharosemand fixes hain.',
    difficulty: 'HARD',
    duration: 22,
    order: 4,

    analogy: {
      en: '**Two clerks who each need a form the other is still filling in.** Clerk A cannot finish her report until she gets a figure from Clerk B. She walks to B\'s desk. But B cannot finish *his* report until he gets a figure from A — and A\'s report is sitting half-done on her desk because she left to come here. B looks at A\'s half-finished report for the figure he needs and finds that section is still blank, because A had not reached it yet when she got up. Everyone is stuck, and the specific complaint is "the number I need isn\'t there yet". A circular import is exactly this. Importing module A starts running A top to bottom; partway down, A imports B; B starts running and imports A; but A is already registered (half-run), so B does not restart it — it just reads from A\'s partial namespace, and the name B wants has not been defined yet because A was interrupted before defining it. The fixes all break the standoff: have one clerk fetch the figure only at the moment he actually writes that line (import inside the function), or move the shared figure to a third neutral desk both can read without needing each other (extract the common piece), or have B grab A\'s whole folder rather than one page, and pull the page out later once A has finished (import the module, use `a.thing` at call time).',
      hi: '**Do clerks jinhe har ek ko ek form chahiye jise doosra abhi bhar raha hai.** Clerk A apni report khatam nahi kar sakti jab tak use Clerk B se ek figure na mile. Wo B ke desk par jaati hai. Par B *apni* report khatam nahi kar sakta jab tak use A se ek figure na mile — aur A ki report uske desk par aadhi-bani padi hai kyunki wo yahaan aane ke liye chali gayi. B us figure ke liye A ki aadhi-bani report dekhta hai aur paata hai wo section abhi bhi khaali hai. Ek circular import bilkul ye hai. Module A import karna A ko top se bottom chalाना shuru karta hai; aadhe raaste, A B import karta hai; B chalна shuru karta hai aur A import karta hai; par A pehle se registered hai (aadha-chala), isliye B ise restart nahi karta — ye bas A ke partial namespace se padhta hai. Fixes standoff ko todte hain: ek clerk figure sirf us pal laaye jab wo asal mein wo line likhta hai (function ke andar import), ya shared figure ko ek teesre neutral desk par le jaao, ya B A ka poora folder le, ek page nahi.',
    },

    simple: `**The cycle that breaks:**

\`\`\`python
# models.py
from services import format_name       # needs something from services

class User:
    def __init__(self, first, last):
        self.name = format_name(first, last)

# services.py
from models import User                 # needs something from models

def format_name(first, last):
    return f"{first} {last}"

def make_admin():
    return User("Admin", "User")
\`\`\`

\`\`\`
$ python -c "import models"
ImportError: cannot import name 'format_name' from partially initialized module
'services' (most likely due to a circular import)
\`\`\`

**Fix 1 — import inside the function (deferred to call time)**

\`\`\`python
# models.py
class User:
    def __init__(self, first, last):
        from services import format_name    # runs when __init__ is CALLED, not at import
        self.name = format_name(first, last)
\`\`\`

**Fix 2 — extract the shared piece into a third module**

\`\`\`python
# names.py  (no imports from models or services)
def format_name(first, last):
    return f"{first} {last}"

# models.py:   from names import format_name
# services.py: from names import format_name   -- cycle gone
\`\`\`

**Fix 3 — import the module, not the name; use it at call time**

\`\`\`python
# services.py
import models                          # binds the module object (ok even if half-built)

def make_admin():
    return models.User("Admin", "User")  # models.User read when make_admin() RUNS
\`\`\`

\`\`\`
WHY IT HAPPENS:
  import A  ->  A starts running, is registered in sys.modules as "half-done"
  A does 'from B import x'  ->  B starts running
  B does 'from A import y'  ->  A is already in sys.modules, so B does NOT re-run it;
                                B reads A's namespace AS IT IS RIGHT NOW
  if 'y' is defined LOWER in A than the line that imported B, 'y' is missing
  ->  ImportError: cannot import name 'y'  (or AttributeError later)

THE THREE FIXES:
  1. move the import inside the function/method that uses it (deferred)
  2. extract the shared code into a new module both import (best long-term)
  3. 'import module' instead of 'from module import name', and use module.name
     at call time (the module object exists even while half-initialised)

Also: 'from A import name' is fragile in a cycle; 'import A' + 'A.name' is not.
\`\`\``,

    simpleHi: `**Wo cycle jo todta hai:**

\`\`\`python
# models.py
from services import format_name       # services se kuch chahiye

class User:
    def __init__(self, first, last):
        self.name = format_name(first, last)

# services.py
from models import User                 # models se kuch chahiye

def format_name(first, last):
    return f"{first} {last}"

def make_admin():
    return User("Admin", "User")
\`\`\`

\`\`\`
$ python -c "import models"
ImportError: cannot import name 'format_name' from partially initialized module
'services' (most likely due to a circular import)
\`\`\`

**Fix 1 — function ke andar import (call time tak deferred)**

\`\`\`python
# models.py
class User:
    def __init__(self, first, last):
        from services import format_name    # tab chalta hai jab __init__ CALL hota hai, import par nahi
        self.name = format_name(first, last)
\`\`\`

**Fix 2 — shared tukda ek teesre module mein nikaalo**

\`\`\`python
# names.py  (models ya services se koi imports nahi)
def format_name(first, last):
    return f"{first} {last}"

# models.py:   from names import format_name
# services.py: from names import format_name   -- cycle gaya
\`\`\`

**Fix 3 — module import karo, naam nahi; ise call time par istemal karo**

\`\`\`python
# services.py
import models                          # module object bind karta hai (aadha-bana bhi theek)

def make_admin():
    return models.User("Admin", "User")  # models.User tab padha jab make_admin() CHALTA hai
\`\`\`

\`\`\`
YE KYUN HOTA HAI:
  import A  ->  A chalна shuru, sys.modules mein "half-done" ki tarah registered
  A 'from B import x' karta hai  ->  B chalна shuru
  B 'from A import y' karta hai  ->  A pehle se sys.modules mein hai, isliye B ise re-run NAHI karta;
                                     B A ka namespace padhta hai JAISA YE ABHI HAI
  agar 'y' A mein us line se NEECHE define hai jo B import karti hai, 'y' missing hai
  ->  ImportError: cannot import name 'y'  (ya baad mein AttributeError)

TEEN FIXES:
  1. import ko us function/method ke andar le jaao jo ise istemal karta hai (deferred)
  2. shared code ko ek naye module mein nikaalo jise dono import karte hain (best long-term)
  3. 'from module import name' ke bajaye 'import module', aur call time par module.name
     istemal karo (module object aadha-initialised hone par bhi maujood hai)

Saath hi: ek cycle mein 'from A import name' fragile hai; 'import A' + 'A.name' nahi.
\`\`\``,

    content: `## Why the order matters

\`\`\`python
# a.py
X = 1
from b import Y        # <-- at this line, a.py's namespace has X but NOT Z yet
Z = 2

# b.py
from a import X        # fine -- X was defined before a.py imported b
from a import Z        # ImportError -- a.py has not reached 'Z = 2' yet
\`\`\`

When \`import a\` runs, Python registers \`a\` in \`sys.modules\` immediately, then executes \`a.py\` line by line. At the \`from b import Y\` line it pauses \`a\` and runs \`b\`. \`b\` does \`from a import X\` — Python finds \`a\` in \`sys.modules\` (half-done) and reads \`X\` from it, which works because \`X = 1\` already ran. But \`from a import Z\` fails: \`a\` is frozen at the import line, and \`Z = 2\` is below it.

## Fix 1: deferred (local) import

\`\`\`python
def process(order):
    from billing import charge      # imported the first time process() is called
    return charge(order.total)
\`\`\`

Move the import from module top level into the function that uses it. By the time the function runs, both modules have finished importing. Downsides: the import statement runs on every call (cheap after the first — it is a \`sys.modules\` lookup), and it hides a dependency from the top of the file. Use it as a targeted fix, not a default style.

## Fix 2: extract the shared dependency (the real fix)

A cycle usually means two modules share a concern that belongs in a third. If \`models\` and \`services\` both need \`format_name\`, that function is neither a model nor a service — put it in \`names.py\` (or \`utils/text.py\`) that imports from neither. Both import \`names\`; the cycle is gone and the design is clearer. This is almost always the right long-term answer.

## Fix 3: import the module, use attributes at call time

\`\`\`python
# services.py
import models                       # NOT 'from models import User'

def make_admin():
    return models.User("Admin")     # models.User resolved when this line executes
\`\`\`

\`import models\` binds the *module object*, which exists in \`sys.modules\` from the start of its execution — even while it is half-initialised. As long as you only access \`models.User\` inside functions (which run later), \`User\` will be defined by then. This works because you defer the *attribute access*, not the import.

## Absolute vs relative — and consistency

\`\`\`python
# inside mypkg/services/email.py

from mypkg.services.templates import render   # absolute
from .templates import render                 # relative -- equivalent here

from mypkg.models.user import User            # absolute, cross-subpackage
from ..models.user import User                # relative -- equivalent
\`\`\`

Both resolve to the same modules. Guidance (PEP 8): absolute imports are the default and are clearest for cross-package references; explicit relative imports (\`from . import x\`) are acceptable and often preferred for intra-package references because they signal "internal" and survive a package rename. Never use implicit relative imports (\`import templates\` hoping it finds the sibling) — those were removed in Python 3.

## Spotting a cycle

\`\`\`
ImportError: cannot import name 'X' from partially initialized module 'm'
             (most likely due to a circular import)
AttributeError: partially initialized module 'm' has no attribute 'X'
                (most likely due to a circular import)
\`\`\`

Python names the cause directly. Trace: which module was imported first, what did it import, and where does that chain loop back. The fix is one of the three above — most often Fix 2. (Python 3.14 dropped the "most likely due to a circular import" phrasing and instead suggests you may have shadowed a library name; the underlying \`cannot import name X from Y\` error is the same, and a true cycle is still the usual cause.)`,

    contentHi: `## Order kyun maayne rakhta hai

\`\`\`python
# a.py
X = 1
from b import Y        # <-- is line par, a.py ke namespace mein X hai par Z ABHI NAHI
Z = 2

# b.py
from a import X        # theek -- X define hua isse pehle ki a.py ne b import kiya
from a import Z        # ImportError -- a.py abhi 'Z = 2' tak nahi pahuncha
\`\`\`

Jab \`import a\` chalta hai, Python \`a\` ko \`sys.modules\` mein turant register karta hai, phir \`a.py\` ko line by line execute karta hai. \`from b import Y\` line par ye \`a\` ko pause karta hai aur \`b\` chalata hai. \`b\` \`from a import X\` karta hai — Python \`a\` ko \`sys.modules\` mein (half-done) paata hai aur \`X\` padhta hai, jo kaam karta hai kyunki \`X = 1\` pehle chal chuka. Par \`from a import Z\` fail hota hai: \`a\` import line par frozen hai, aur \`Z = 2\` iske neeche hai.

## Fix 1: deferred (local) import

\`\`\`python
def process(order):
    from billing import charge      # pehli baar jab process() call hota hai import
    return charge(order.total)
\`\`\`

Import ko module top level se us function mein le jaao jo ise istemal karta hai. Jab function chalta hai, dono modules import ho chuke hain. Nuksaan: import statement har call chalta hai (pehle ke baad sasta — ye ek \`sys.modules\` lookup hai). Ise ek lakshyit fix ki tarah istemal karo, ek default style nahi.

## Fix 2: shared dependency nikaalo (asli fix)

Ek cycle aam taur par matlab do modules ek concern share karte hain jo ek teesre mein hai. Agar \`models\` aur \`services\` dono ko \`format_name\` chahiye, wo function na ek model hai na ek service — ise \`names.py\` mein rakho jo kisi se import nahi karta. Dono \`names\` import karte hain; cycle gaya aur design saaf hai. Ye lagbhag hamesha sahi long-term jawaab hai.

## Fix 3: module import karo, call time par attributes istemal karo

\`\`\`python
# services.py
import models                       # 'from models import User' NAHI

def make_admin():
    return models.User("Admin")     # models.User tab resolve jab ye line execute hoti hai
\`\`\`

\`import models\` *module object* bind karta hai, jo iske execution ki shuruaat se \`sys.modules\` mein maujood hai — aadha-initialised hone par bhi. Jab tak aap \`models.User\` ko sirf functions ke andar access karte ho (jo baad mein chalte hain), \`User\` tab tak define ho chuka hoga. Ye kaam karta hai kyunki aap *attribute access* defer karte ho, import nahi.

## Absolute vs relative — aur consistency

\`\`\`python
# mypkg/services/email.py ke andar

from mypkg.services.templates import render   # absolute
from .templates import render                 # relative -- yahaan samaan

from mypkg.models.user import User            # absolute, cross-subpackage
from ..models.user import User                # relative -- samaan
\`\`\`

Dono usi modules par resolve hote hain. Maargdarshan (PEP 8): absolute imports default hain aur cross-package references ke liye sabse saaf; explicit relative imports (\`from . import x\`) sweekaarya hain aur aksar intra-package references ke liye prefer kiye jaate hain. Implicit relative imports kabhi istemal mat karo — wo Python 3 mein hataa diye gaye.

## Ek cycle pehchaanna

\`\`\`
ImportError: cannot import name 'X' from partially initialized module 'm'
             (most likely due to a circular import)
AttributeError: partially initialized module 'm' has no attribute 'X'
                (most likely due to a circular import)
\`\`\`

Python kaaran seedhe naam deta hai. Trace karo: kaunsa module pehle import hua, isne kya import kiya, aur wo chain kahaan loop back karti hai. Fix upar teenon mein se ek hai — aksar Fix 2. (Python 3.14 ne "most likely due to a circular import" phrasing hataa di aur iske bajaye sujhaav deta hai ki aapne ek library naam shadow kiya ho; andaruni \`cannot import name X from Y\` error wahi hai, aur ek asli cycle abhi bhi aam kaaran hai.)`,

    examples: [
      {
        title: 'A circular import failing, and the exact error',
        titleHi: 'Ek circular import fail hota, aur exact error',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
open(os.path.join(d, "models.py"), "w").write(textwrap.dedent('''
    from services import format_name

    class User:
        def __init__(self, first, last):
            self.name = format_name(first, last)
'''))
open(os.path.join(d, "services.py"), "w").write(textwrap.dedent('''
    from models import User

    def format_name(first, last):
        return f"{first} {last}"
'''))
open(os.path.join(d, "run.py"), "w").write("import models\\nprint('ok')\\n")

r = subprocess.run([sys.executable, "run.py"], cwd=d, capture_output=True, text=True)
print("stdout:", r.stdout.strip() or "(none)")
print("error type:", r.stderr.strip().splitlines()[-1].split(":")[0])
print("says cannot-import-name:", "cannot import name" in r.stderr)`,
        output: `stdout: (none)
error type: ImportError
says cannot-import-name: True`,
        explain: '`import models` starts running `models.py`; its first line `from services import format_name` runs `services.py`; `services.py`\'s first line `from models import User` finds `models` half-initialised in `sys.modules` and `User` is not defined yet (it is below the import line). Python raises `ImportError: cannot import name \'User\' from \'models\'`. Older Pythons append "(most likely due to a circular import)"; Python 3.14 changed the hint wording, but the core error — a name that is not defined yet — is the same.',
        explainHi: '`import models` `models.py` chalना shuru karta hai; iski pehli line `from services import format_name` `services.py` chalati hai; `services.py` ki pehli line `from models import User` `models` ko `sys.modules` mein aadha-initialised paati hai aur `User` abhi define nahi hai. Python `ImportError: cannot import name \'User\' from \'models\'` raise karta hai. Purane Pythons "(most likely due to a circular import)" jodte hain; Python 3.14 ne hint wording badla, par core error wahi hai — ek naam jo abhi define nahi hai.',
      },
      {
        title: 'Fix 2: extract the shared function into a third module',
        titleHi: 'Fix 2: shared function ek teesre module mein nikaalo',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
# the shared piece -- imports nothing from models or services:
open(os.path.join(d, "names.py"), "w").write("def format_name(f, l): return f'{f} {l}'\\n")
open(os.path.join(d, "models.py"), "w").write(textwrap.dedent('''
    from names import format_name

    class User:
        def __init__(self, first, last):
            self.name = format_name(first, last)
'''))
open(os.path.join(d, "services.py"), "w").write(textwrap.dedent('''
    from names import format_name
    from models import User

    def make_admin():
        return User("Admin", "User")
'''))
open(os.path.join(d, "run.py"), "w").write(textwrap.dedent('''
    from services import make_admin
    print("admin name:", make_admin().name)
'''))

r = subprocess.run([sys.executable, "run.py"], cwd=d, capture_output=True, text=True)
print(r.stdout.strip() or r.stderr.strip().splitlines()[-1])`,
        output: `admin name: Admin User`,
        explain: 'The shared `format_name` moves to `names.py`, which imports nothing from `models` or `services`. Now `models` imports `names`, `services` imports `names` and `models` — no cycle, because the dependency graph is a tree again. This is the structural fix: the cycle was a sign that `format_name` belonged in neither module.',
        explainHi: 'Shared `format_name` `names.py` mein jaata hai, jo `models` ya `services` se kuch import nahi karta. Ab `models` `names` import karta hai, `services` `names` aur `models` import karta hai — koi cycle nahi. Ye structural fix hai: cycle ek sanket tha ki `format_name` kisi module mein nahi tha.',
      },
      {
        title: 'Fix 1 and Fix 3: deferred import and module-attribute access',
        titleHi: 'Fix 1 aur Fix 3: deferred import aur module-attribute access',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
# Fix 3 style: services imports the MODULE, uses models.User at call time
open(os.path.join(d, "models.py"), "w").write(textwrap.dedent('''
    class User:
        def __init__(self, name):
            self.name = name
        def greeting(self):
            from services import welcome        # Fix 1: deferred import
            return welcome(self)
'''))
open(os.path.join(d, "services.py"), "w").write(textwrap.dedent('''
    import models                                # Fix 3: bind the module, not a name

    def welcome(user):
        return f"welcome, {user.name}"

    def make_user(name):
        return models.User(name)                 # models.User resolved when called
'''))
open(os.path.join(d, "run.py"), "w").write(textwrap.dedent('''
    import services
    u = services.make_user("Ada")
    print(u.greeting())
'''))

r = subprocess.run([sys.executable, "run.py"], cwd=d, capture_output=True, text=True)
print(r.stdout.strip() or r.stderr.strip().splitlines()[-1])`,
        output: `welcome, Ada`,
        explain: '`services.py` does `import models` (Fix 3) — binding the module object, which is safe even mid-cycle — and only touches `models.User` inside `make_user`, which runs after both modules finish importing. `models.py`\'s `greeting` uses `from services import welcome` locally (Fix 1), deferred to call time. Both techniques defer the risky access past the import phase.',
        explainHi: '`services.py` `import models` (Fix 3) karta hai — module object bind karke, jo cycle ke beech bhi surakshit hai — aur `models.User` ko sirf `make_user` ke andar chhoota hai, jo dono modules import khatam karne ke baad chalta hai. `models.py` ka `greeting` `from services import welcome` locally istemal karta hai (Fix 1). Dono techniques risky access ko import phase se aage defer karti hain.',
      },
    ],

    mistakes: [
      {
        wrong: `# models.py
from services import send_receipt      # top-level

# services.py
from models import Order               # top-level -> cycle`,
        right: `# receipts.py  (new module, imports neither)
def send_receipt(order): ...

# models.py:   nothing needed, or 'from receipts import send_receipt' inside a method
# services.py: from models import Order
#              from receipts import send_receipt`,
        why: 'Two modules importing each other at top level is the cycle. The best fix is almost never a clever import trick — it is recognising that the two-way dependency points to a missing third module. Extract the piece they share (`send_receipt`) into its own module that depends on neither.',
        whyHi: 'Do modules ek doosre ko top level par import karte hue cycle hai. Best fix lagbhag kabhi ek chalaak import trick nahi hai — ye pehchaanna hai ki do-tarafa dependency ek missing teesre module ki taraf ishaara karti hai. Jo tukda wo share karte hain use apne module mein nikaalo.',
      },
      {
        wrong: `# every function does a local import "just in case"
def a():
    from mymod import x
    ...
def b():
    from mymod import x
    ...`,
        right: `from mymod import x        # top-level: dependencies visible, imported once

def a(): ...
def b(): ...`,
        why: 'Deferred (function-local) imports are a targeted fix for a real cycle, not a style. Using them everywhere hides the module\'s dependencies from the top of the file, repeats the import lookup on every call, and defeats tooling that reads imports. Import at top level by default; go local only where a genuine cycle forces it.',
        whyHi: 'Deferred (function-local) imports ek asli cycle ke liye ek lakshyit fix hain, ek style nahi. Unhe har jagah istemal karna module ki dependencies ko file ke top se chhupata hai, har call par import lookup dohraata hai. By default top level par import karo; local sirf wahaan jao jahaan ek asli cycle majboor karta hai.',
      },
      {
        wrong: `# a.py
from b import helper
BIG_TABLE = helper()      # runs at import; b imports a -> a not finished -> boom`,
        right: `# a.py
from b import helper

def get_big_table():
    return helper()       # called later, after both modules are imported`,
        why: 'A cycle combined with top-level work that *uses* the imported name is the worst case — the name may be missing, or half-built. Keep module top level to definitions and imports; anything that calls across the cycle must be inside a function that runs after import completes.',
        whyHi: 'Ek cycle plus top-level kaam jo imported naam *istemal* karta hai sabse bura case hai — naam missing ho sakta hai, ya aadha-bana. Module top level ko definitions aur imports tak rakho; cycle ke aar-paar call karne waali koi bhi cheez ek function ke andar honi chahiye jo import poora hone ke baad chalta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Circular imports are common in Django** — `models.py` and `signals.py`, or two apps\' models referencing each other. Django\'s idioms exist to avoid them: string references in `ForeignKey("otherapp.Model")`, importing models inside `ready()` or inside functions, and keeping signal handlers in a separate module wired up in `apps.py`.',
        hi: '**Circular imports Django mein aam hain** — `models.py` aur `signals.py`, ya do apps ke models ek doosre ko reference karte hue. Django ke idioms unse bachne ke liye maujood hain: `ForeignKey("otherapp.Model")` mein string references, `ready()` ya functions ke andar models import karna.',
      },
      {
        en: '**`TYPE_CHECKING` breaks import cycles caused only by type hints** — `if typing.TYPE_CHECKING: from .models import User` imports `User` only for the type checker, not at runtime, and you write the annotation as a string `"User"` or use `from __future__ import annotations`. This is the standard fix when the cycle is purely for typing.',
        hi: '**`TYPE_CHECKING` sirf type hints se hue import cycles ko todta hai** — `if typing.TYPE_CHECKING: from .models import User` `User` ko sirf type checker ke liye import karta hai, runtime par nahi, aur aap annotation ko string `"User"` ki tarah likhte ho ya `from __future__ import annotations` istemal karte ho.',
      },
      {
        en: '**The "extract a third module" fix maps directly to layered architecture** — if your `api` layer and your `db` layer import each other, you are missing a `domain`/`schemas` layer that both depend on and that depends on neither. Cycles are a design smell pointing at a missing abstraction.',
        hi: '**"ek teesra module nikaalo" fix layered architecture se seedhe map hota hai** — agar aapki `api` layer aur `db` layer ek doosre ko import karti hain, aapke paas ek `domain`/`schemas` layer missing hai jispar dono nirbhar karti hain aur jo kisi par nahi. Cycles ek design smell hain jo ek missing abstraction ki taraf ishaara karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why do circular imports fail, and how do you fix one?',
        qHi: 'Circular imports kyun fail hote hain, aur aap ek kaise theek karte ho?',
        a: 'They fail because of how import executes a module. When you import module A, Python creates the module object, registers it in sys dot modules immediately, and then runs A\'s file top to bottom to populate it. If, partway through, A does from B import something, Python pauses A and starts running B. If B then does from A import something, Python looks up A, finds it already in sys dot modules — but only partially executed, frozen at the line where it imported B. B reads whatever names A has defined so far. If the name B wants was defined above A\'s import of B, it is there and the import succeeds. If it was defined below that line, it does not exist yet, and Python raises ImportError, cannot import name, with a note that it is most likely a circular import. A later variant is an AttributeError on the half-initialised module if you used import A and then A dot name. There are three fixes. The first is a deferred import: move the from B import statement out of module top level and into the function or method that actually uses the name. By the time that function is called, both modules have finished importing, so the name is available. This is a targeted patch, not a style to adopt everywhere, because it hides dependencies and repeats the lookup. The second, and usually the best, is to extract the shared thing into a third module that neither A nor B has to import back. A two-way dependency almost always means A and B share a concern that belongs to neither — a helper, a schema, a set of constants — and moving it to its own module turns the dependency graph back into a tree. The third is to import the module rather than a name from it: import B, not from B import thing, and then refer to B dot thing inside functions. The module object exists in sys dot modules from the start, even while half-built, so binding it is safe; you only need the attribute to exist by the time the function runs, which is after import completes. For cycles that exist only because of type annotations, the idiom is to guard the import with if typing dot TYPE_CHECKING and write the annotation as a string.',
        aHi: 'Wo isliye fail hote hain ki import ek module kaise execute karta hai. Jab aap module A import karte ho, Python module object banaata hai, ise turant sys dot modules mein register karta hai, aur phir A ki file top se bottom chalata hai. Agar, beech mein, A from B import something karta hai, Python A ko pause karta hai aur B chalna shuru karta hai. Agar B phir from A import something karta hai, Python A ko dhoondhta hai, ise pehle se sys dot modules mein paata hai — par sirf aanshik roop se executed, us line par frozen jahaan isne B import kiya. Agar B jo naam chahta hai wo B ke import se neeche define tha, ye abhi maujood nahi hai, aur Python ImportError deta hai. Teen fixes hain. Pehla ek deferred import hai: from B import statement ko module top level se us function mein le jaao jo naam istemal karta hai. Doosra, aur aam taur par best, shared cheez ko ek teesre module mein nikaalna hai jise na A na B wapas import kare. Teesra module import karna hai naam ke bajaye: import B, phir functions ke andar B dot thing refer karo.',
      },
      {
        q: 'What is the difference between absolute and relative imports, and which should you use?',
        qHi: 'Absolute aur relative imports mein kya antar hai, aur aapko kaunsa istemal karna chahiye?',
        a: 'An absolute import names the full path to the target from the top of the import search path — from myapp dot services dot email import send. A relative import names the target relative to the current module\'s package using leading dots — from dot email import send for a sibling, from dot dot models dot user import User for something one package level up. Within a single package they resolve to exactly the same modules; the difference is how the path is written and what it depends on. Absolute imports are unambiguous and self-contained: the line tells you exactly what is being imported regardless of where the file sits, and they are the right choice for referring to other top-level packages and third-party libraries. The style guides make absolute imports the default. Relative imports are shorter for deep intra-package references and carry a signal: the dot says "this is internal to my own package". They also keep working if the whole top-level package is renamed or vendored under a different name, because nothing hard-codes that name. The guidance is: use absolute imports by default; explicit relative imports are acceptable and often preferred for imports within the same package, especially in larger packages where the absolute paths get long and repetitive. What you must not do is use implicit relative imports — writing import email and hoping Python finds a sibling module by that name. That behaviour existed in Python 2 and was removed in Python 3 precisely because it was ambiguous with top-level modules. And you should be consistent: pick absolute or explicit-relative for intra-package imports and stick to it within a codebase rather than mixing both for the same kind of reference.',
        aHi: 'Ek absolute import target ka poora path import search path ke top se naam deta hai — from myapp dot services dot email import send. Ek relative import target ko current module ke package ke saapeksh leading dots istemal karke naam deta hai — ek sibling ke liye from dot email import send. Ek akele package ke andar wo bilkul usi modules par resolve hote hain. Absolute imports asandigdh aur self-contained hain: line aapko bilkul bataati hai kya import ho raha hai chahe file kahin bhi ho, aur wo doosre top-level packages aur third-party libraries ko refer karne ke liye sahi chunaav hain. Style guides absolute imports ko default banaate hain. Relative imports gehre intra-package references ke liye chhote hain aur ek signal le jaate hain: dot kehta hai "ye mere apne package ke internal hai". Wo kaam karte rehte hain agar poora top-level package rename hota hai. Maargdarshan: by default absolute imports istemal karo; usi package ke andar imports ke liye explicit relative imports sweekaarya aur aksar prefer kiye jaate hain. Jo aapko nahi karna wo implicit relative imports istemal karna hai.',
      },
    ],

    exercises: [
      {
        task: 'Reproduce a circular import: `order.py` does `from customer import Customer` at top level and defines `class Order`; `customer.py` does `from order import Order` at top level and defines `class Customer`. Run `python -c "import order"` via subprocess and capture the `ImportError`. Confirm the message contains "circular import".',
        taskHi: 'Ek circular import reproduce karo: `order.py` top level par `from customer import Customer` kare aur `class Order` define kare; `customer.py` top level par `from order import Order` kare aur `class Customer` define kare. `python -c "import order"` ko subprocess se chalao aur `ImportError` capture karo. Confirm karo message mein "circular import" hai.',
        hint: 'Write both files to a temp dir with `textwrap.dedent`, run `subprocess.run([sys.executable, "-c", "import order"], cwd=d, capture_output=True, text=True)`, and check `"circular import" in result.stderr`.',
        hintHi: 'Dono files ek temp dir mein `textwrap.dedent` se likho, `subprocess.run([sys.executable, "-c", "import order"], cwd=d, capture_output=True, text=True)` chalao, aur `"circular import" in result.stderr` check karo.',
      },
      {
        task: 'Fix the cycle from exercise 1 with Fix 2: create `entities.py` holding both `Order` and `Customer` (or a shared base), and have `order.py`/`customer.py` import from `entities` instead of each other. Add a `service.py` that imports both and builds a linked `Order`+`Customer`. Run it and print the result — no `ImportError`.',
        taskHi: 'Exercise 1 ke cycle ko Fix 2 se theek karo: `entities.py` banao jo dono `Order` aur `Customer` (ya ek shared base) rakhe, aur `order.py`/`customer.py` ko ek doosre ke bajaye `entities` se import karao. Ek `service.py` jodo jo dono import kare aur ek linked `Order`+`Customer` banaaye. Ise chalao aur result print karo — koi `ImportError` nahi.',
        hint: 'The clean version: `entities.py` defines both classes with no cross-imports. `service.py` does `from entities import Order, Customer`. Because the shared classes live in one place, the dependency graph has no cycle.',
        hintHi: 'Saaf version: `entities.py` dono classes bina cross-imports define karta hai. `service.py` `from entities import Order, Customer` karta hai. Kyunki shared classes ek jagah rehte hain, dependency graph mein koi cycle nahi.',
      },
      {
        task: 'Demonstrate Fix 3: `a.py` does `import b` (module, not name) and has `def use_b(): return b.VALUE`. `b.py` does `import a` and has `VALUE = 10` plus `def use_a(): return a.NAME`, with `NAME = "from a"` defined AFTER the `import b`... wait, `a` has no `import b` issue — set it up so `a.py` has `import b` then `NAME = "A"`, and `b.py` has `import a` then `VALUE = 10`. Call `a.use_b()` and `b.use_a()` from a runner and show both return values — the module-object imports tolerate the cycle.',
        taskHi: 'Fix 3 dikhao: `a.py` `import b` kare (module, naam nahi) aur `def use_b(): return b.VALUE` ho. `b.py` `import a` kare aur `VALUE = 10` plus `def use_a(): return a.NAME` ho. Set up karo taaki `a.py` mein `import b` phir `NAME = "A"` ho, aur `b.py` mein `import a` phir `VALUE = 10` ho. Ek runner se `a.use_b()` aur `b.use_a()` call karo aur dono return values dikhao.',
        hint: 'With `import b` / `import a` (module objects, not `from ... import`), the cycle is tolerated: each module object is registered before its body runs. Accessing `b.VALUE` / `a.NAME` only inside functions means the attributes exist by call time. Runner: `import a; print(a.use_b(), a.b.use_a())` or import both.',
        hintHi: '`import b` / `import a` (module objects, `from ... import` nahi) ke saath, cycle sehnशील hai: har module object iski body chalne se pehle register hota hai. `b.VALUE` / `a.NAME` ko sirf functions ke andar access karna matlab attributes call time tak maujood hain.',
      },
    ],

    keyTakeaways: [
      'A circular import fails because when module A (mid-execution) triggers module B, and B imports from A, A is only PARTIALLY run — names defined below A\'s import line do not exist yet.',
      'The error names the cause: `ImportError: cannot import name X from partially initialized module (most likely due to a circular import)` — or a later `AttributeError` on the half-built module.',
      'Fix 1 (deferred): move the problematic `from x import y` inside the function/method that uses it — it runs after both modules finish importing. Targeted patch, not a default style.',
      'Fix 2 (extract — usually best): a two-way dependency means A and B share something that belongs in a third module. Move that shared piece to a new module both import; the cycle disappears and the design improves.',
      'Fix 3 (import the module): `import x` (not `from x import y`) binds the module object, which exists even while half-initialised. Access `x.y` only inside functions, so `y` exists by call time.',
      '`from x import name` is fragile in a cycle; `import x` + `x.name` at call time is not.',
      'Absolute imports (`from myapp.services.email import send`) are the default and best for cross-package references. Explicit relative (`from . import x`, `from ..pkg import y`) is fine and often preferred within a package. Never use implicit relative imports (removed in Python 3).',
      'For cycles caused ONLY by type hints: `if typing.TYPE_CHECKING: from .models import User` + string annotation `"User"` (or `from __future__ import annotations`).',
    ],
    keyTakeawaysHi: [
      'Ek circular import isliye fail hota hai ki jab module A (mid-execution) module B ko trigger karta hai, aur B A se import karta hai, A sirf AANSHIK roop se chala hai — A ki import line se neeche define naam abhi maujood nahi.',
      'Error kaaran naam deta hai: `ImportError: cannot import name X from partially initialized module (most likely due to a circular import)` — ya baad mein aadhe-bane module par ek `AttributeError`.',
      'Fix 1 (deferred): samasyaagrast `from x import y` ko us function/method ke andar le jaao jo ise istemal karta hai — ye dono modules import khatam karne ke baad chalta hai. Lakshyit patch, default style nahi.',
      'Fix 2 (nikaalo — aam taur par best): ek do-tarafa dependency matlab A aur B kuch share karte hain jo ek teesre module mein hai. Us shared tukde ko ek naye module mein le jaao jise dono import karein; cycle gaayab ho jaata hai.',
      'Fix 3 (module import karo): `import x` (`from x import y` nahi) module object bind karta hai, jo aadha-initialised hone par bhi maujood hai. `x.y` ko sirf functions ke andar access karo.',
      '`from x import name` ek cycle mein fragile hai; `import x` + call time par `x.name` nahi.',
      'Absolute imports (`from myapp.services.email import send`) default aur cross-package references ke liye best hain. Explicit relative (`from . import x`) ek package ke andar theek aur aksar prefer kiya jaata hai. Implicit relative imports kabhi istemal mat karo.',
      'SIRF type hints se hue cycles ke liye: `if typing.TYPE_CHECKING: from .models import User` + string annotation `"User"`.',
    ],
  },

  {
    slug: 'py-venv-pip-dependencies',
    title: 'Virtual Environments, pip, and Dependency Files',
    titleHi: 'Virtual Environments, pip, Aur Dependency Files',
    description: 'Running `pip install` once for a Flask project and once for a Django project on the same machine, then hitting version conflicts because both installed into the same global site-packages. A virtual environment gives each project its own isolated set of installed packages, and a dependency file records exactly what to install so another machine (or CI, or a teammate) reproduces it.',
    descriptionHi: 'Ek machine par ek Flask project ke liye ek baar aur ek Django project ke liye ek baar `pip install` chalana, phir version conflicts hit karna kyunki dono usi global site-packages mein install hue. Ek virtual environment har project ko iska apna isolated installed packages set deta hai, aur ek dependency file bilkul record karti hai kya install karna hai taaki doosri machine ise reproduce kare.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 5,

    analogy: {
      en: '**Separate toolboxes per job site instead of one communal shed.** If every project on the street shares one shed, the day someone swaps the communal drill for a newer model, three other crews who depended on the old one\'s behaviour are broken, and nobody is sure which projects still work. A virtual environment is giving each job site its own toolbox: this project\'s box has Django 4.2 and this exact set of libraries; the box next door has Django 5.1 and different ones; changing one never touches the other. `python -m venv .venv` builds the empty toolbox; "activating" it means "for this terminal, `python` and `pip` now mean the ones in this box"; `pip install` puts tools in this box only. The dependency file is the packing list taped inside the lid: `requirements.txt` or the `dependencies` section of `pyproject.toml` writes down exactly what tools this box needs, so a new crew member — or the build server — can run one command and assemble an identical box. Without the packing list, "it works on my machine" is a statement about one toolbox nobody else can rebuild.',
      hi: '**Ek saanjhe shed ke bajaye prati job site alag toolboxes.** Agar street par har project ek shed share karta hai, jis din koi saanjhe drill ko ek naye model se badalta hai, teen doosri crews jo purane ke behaviour par nirbhar theen toot jaati hain. Ek virtual environment har job site ko iska apna toolbox dena hai: is project ke box mein Django 4.2 aur libraries ka ye exact set hai; bagal waale box mein Django 5.1 hai; ek badalna kabhi doosre ko nahi chhoota. `python -m venv .venv` khaali toolbox banaata hai; ise "activate" karna matlab "is terminal ke liye, `python` aur `pip` ab is box waale hain"; `pip install` tools sirf is box mein rakhta hai. Dependency file lid ke andar chipki packing list hai: `requirements.txt` ya `pyproject.toml` ka `dependencies` section bilkul likhta hai is box ko kaunse tools chahiye. Packing list ke bina, "ye meri machine par kaam karta hai" ek aise toolbox ke baare mein ek bayaan hai jise koi aur dobara nahi bana sakta.',
    },

    simple: `**Create and use a virtual environment**

\`\`\`bash
cd myproject
python -m venv .venv                 # creates .venv/ with its own python + pip

# activate it (per terminal session):
source .venv/bin/activate            # macOS/Linux
.venv\\Scripts\\activate               # Windows (PowerShell/cmd)

# now 'python' and 'pip' point INTO .venv:
python -c "import sys; print(sys.prefix)"   # .../myproject/.venv
pip install requests django

deactivate                           # back to the system python
\`\`\`

**Record and reproduce dependencies**

\`\`\`bash
# option A: requirements.txt (simple, universal)
pip freeze > requirements.txt        # writes EVERY installed package + exact version
# on another machine:
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# option B: pyproject.toml (modern, for packages and apps)
# [project]
# dependencies = ["requests>=2.31", "django>=4.2,<5.0"]
pip install -e .                     # install this project + its dependencies
\`\`\`

\`\`\`
WHY venv:  pip installs into a "site-packages" directory. Without a venv that is
           the GLOBAL one, shared by every project -> version conflicts, and you
           may not have permission to write there anyway.
           A venv gives THIS project its own python, pip, and site-packages.

python -m venv .venv        create   (.venv is a conventional name; also common: venv, env)
source .venv/bin/activate   use it   (Windows: .venv\\Scripts\\activate)
pip install X               installs into the ACTIVE venv only
pip list                    what is installed here
pip freeze > requirements.txt   snapshot: every package == exact version
pip install -r requirements.txt  recreate that snapshot elsewhere
deactivate                  stop using the venv

NEVER commit .venv/ to git. DO commit requirements.txt / pyproject.toml.
\`\`\``,

    simpleHi: `**Ek virtual environment banao aur istemal karo**

\`\`\`bash
cd myproject
python -m venv .venv                 # .venv/ banaata hai apne python + pip ke saath

# ise activate karo (prati terminal session):
source .venv/bin/activate            # macOS/Linux
.venv\\Scripts\\activate               # Windows (PowerShell/cmd)

# ab 'python' aur 'pip' .venv ke ANDAR point karte hain:
python -c "import sys; print(sys.prefix)"   # .../myproject/.venv
pip install requests django

deactivate                           # system python par wapas
\`\`\`

**Dependencies record aur reproduce karo**

\`\`\`bash
# option A: requirements.txt (saral, universal)
pip freeze > requirements.txt        # HAR installed package + exact version likhta hai
# doosri machine par:
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# option B: pyproject.toml (modern, packages aur apps ke liye)
# [project]
# dependencies = ["requests>=2.31", "django>=4.2,<5.0"]
pip install -e .                     # ye project + iski dependencies install karo
\`\`\`

\`\`\`
venv KYUN:  pip ek "site-packages" directory mein install karta hai. Ek venv ke bina
            wo GLOBAL waali hai, har project dwara shared -> version conflicts, aur
            aapke paas wahaan likhne ki permission na bhi ho.
            Ek venv IS project ko iska apna python, pip, aur site-packages deta hai.

python -m venv .venv        banao   (.venv ek conventional naam hai; aam: venv, env)
source .venv/bin/activate   istemal karo   (Windows: .venv\\Scripts\\activate)
pip install X               sirf ACTIVE venv mein install karta hai
pip list                    yahaan kya installed hai
pip freeze > requirements.txt   snapshot: har package == exact version
pip install -r requirements.txt  us snapshot ko kahin aur recreate karo
deactivate                  venv istemal karna band karo

.venv/ ko git mein KABHI commit mat karo. requirements.txt / pyproject.toml commit KARO.
\`\`\``,

    content: `## What a venv actually is

A virtual environment is a directory (\`.venv/\`) containing:

- a \`python\` executable (a symlink or copy of the base Python)
- a \`pip\`
- an empty \`site-packages/\` where \`pip install\` puts things
- a \`pyvenv.cfg\` recording which base Python it was made from

"Activating" it prepends \`.venv/bin\` (or \`.venv\\Scripts\`) to your shell's \`PATH\`, so \`python\` and \`pip\` resolve to the venv's copies. That is the entire mechanism — there is no magic, and you can also just call \`.venv/bin/python\` directly without activating.

\`\`\`bash
# these are equivalent:
source .venv/bin/activate && python script.py
./.venv/bin/python script.py                  # no activation needed
\`\`\`

## \`pip\` essentials

\`\`\`bash
pip install requests                 # latest compatible
pip install "django>=4.2,<5.0"       # a range
pip install requests==2.31.0         # exact
pip install -r requirements.txt      # everything in the file
pip install -e .                     # this project, editable (see next lesson)
pip install --upgrade requests       # bump it
pip uninstall requests
pip list                             # installed packages
pip show django                      # details incl. location and dependencies
pip freeze                           # installed packages as 'name==version' lines
\`\`\`

Always run \`pip\` as \`python -m pip\` if there is any doubt about which Python it targets — \`python -m pip install X\` installs into the same interpreter \`python\` refers to.

## \`requirements.txt\` vs \`pyproject.toml\`

\`\`\`
requirements.txt
  - a flat list of packages, one per line, often pinned to exact versions
  - what 'pip freeze' produces and 'pip install -r' consumes
  - simple, works everywhere, no build system needed
  - common split: requirements.txt (app deps) + requirements-dev.txt (test/lint tools)

pyproject.toml   [project] dependencies = [...]
  - the modern standard; describes the project AND its dependencies
  - required if you want to build/publish the project as a package
  - usually specifies RANGES ('django>=4.2,<5.0'), not exact pins
  - tools (uv, poetry, pdm, hatch) build on it and add a lockfile
\`\`\`

Guidance: for an application, either works; \`pyproject.toml\` + a lockfile (via \`uv\` or \`pip-tools\`) is the current best practice. For a library you publish, \`pyproject.toml\` is required.

## Pinning and lockfiles

\`\`\`
loose:   django>=4.2                 # "any 4.2+" -- reproducible? no. two installs differ.
pinned:  django==4.2.11              # exact -- reproducible, but you update manually
locked:  a separate lockfile pins EVERY package AND its transitive dependencies,
         with hashes -- 'pip install' from the lock gives a byte-identical environment
\`\`\`

\`pip freeze > requirements.txt\` is a poor-man's lock: it pins everything you have installed, but mixes your direct dependencies with their dependencies and records no hashes. Tools like \`uv\`, \`pip-tools\` (\`pip-compile\`), \`poetry\`, and \`pdm\` maintain a proper lockfile separate from your declared dependencies.

## What to commit

\`\`\`
COMMIT:      pyproject.toml, requirements.txt / requirements*.txt, the lockfile
DO NOT COMMIT: .venv/  (it is machine-specific and huge; add it to .gitignore)
               __pycache__/, *.pyc
\`\`\`

A teammate clones the repo, creates their own \`.venv\`, and runs \`pip install -r requirements.txt\` (or \`pip install -e .\`, or \`uv sync\`). The environment is rebuilt from the committed files, never copied.

## The "works on my machine" failure

\`\`\`bash
# you, six months ago:  pip install requests  (got 2.28)
# your code relies on behaviour that changed in requests 2.31
# new teammate:  pip install requests  (gets 2.32) -> subtly broken
# fix: pin it. requirements.txt with 'requests==2.28.2', or a lockfile.
\`\`\``,

    contentHi: `## Ek venv asal mein kya hai

Ek virtual environment ek directory (\`.venv/\`) hai jismein:

- ek \`python\` executable (base Python ka ek symlink ya copy)
- ek \`pip\`
- ek khaali \`site-packages/\` jahaan \`pip install\` cheezein rakhta hai
- ek \`pyvenv.cfg\` jo record karta hai ye kaunse base Python se bana

Ise "activate" karna aapke shell ke \`PATH\` par \`.venv/bin\` prepend karta hai, isliye \`python\` aur \`pip\` venv ki copies par resolve hote hain. Ye poora mechanism hai — koi magic nahi, aur aap bina activate kiye seedhe \`.venv/bin/python\` bhi call kar sakte ho.

\`\`\`bash
# ye samaan hain:
source .venv/bin/activate && python script.py
./.venv/bin/python script.py                  # koi activation nahi chahiye
\`\`\`

## \`pip\` zaroori

\`\`\`bash
pip install requests                 # latest compatible
pip install "django>=4.2,<5.0"       # ek range
pip install requests==2.31.0         # exact
pip install -r requirements.txt      # file mein sab kuch
pip install -e .                     # ye project, editable (agla lesson)
pip install --upgrade requests       # ise bump karo
pip uninstall requests
pip list                             # installed packages
pip show django                      # location aur dependencies sameth details
pip freeze                           # installed packages 'name==version' lines ki tarah
\`\`\`

\`pip\` ko hamesha \`python -m pip\` ki tarah chalao agar koi shaq hai ki ye kaunse Python ko target karta hai — \`python -m pip install X\` usi interpreter mein install karta hai jise \`python\` refer karta hai.

## \`requirements.txt\` vs \`pyproject.toml\`

\`\`\`
requirements.txt
  - packages ki ek flat list, prati line ek, aksar exact versions par pinned
  - jo 'pip freeze' banaata hai aur 'pip install -r' consume karta hai
  - saral, har jagah kaam karta hai, koi build system nahi chahiye
  - aam split: requirements.txt (app deps) + requirements-dev.txt (test/lint tools)

pyproject.toml   [project] dependencies = [...]
  - modern standard; project AUR iski dependencies describe karta hai
  - zaroori agar aap project ko ek package ki tarah build/publish karna chahte ho
  - aam taur par RANGES specify karta hai ('django>=4.2,<5.0'), exact pins nahi
  - tools (uv, poetry, pdm, hatch) ispar bante hain aur ek lockfile jodte hain
\`\`\`

Maargdarshan: ek application ke liye, koi bhi kaam karta hai; \`pyproject.toml\` + ek lockfile current best practice hai. Ek library jo aap publish karte ho ke liye, \`pyproject.toml\` zaroori hai.

## Pinning aur lockfiles

\`\`\`
loose:   django>=4.2                 # "koi bhi 4.2+" -- reproducible? nahi.
pinned:  django==4.2.11              # exact -- reproducible, par aap manually update karte ho
locked:  ek alag lockfile HAR package AUR iski transitive dependencies pin karti hai,
         hashes ke saath -- lock se 'pip install' ek byte-identical environment deta hai
\`\`\`

\`pip freeze > requirements.txt\` ek gareeb-aadmi ka lock hai: ye sab kuch pin karta hai jo aapne install kiya, par aapki direct dependencies ko unki dependencies ke saath mix karta hai aur koi hashes record nahi karta. \`uv\`, \`pip-tools\`, \`poetry\`, aur \`pdm\` jaise tools ek uchit lockfile maintain karte hain.

## Kya commit karein

\`\`\`
COMMIT:      pyproject.toml, requirements.txt / requirements*.txt, lockfile
COMMIT MAT KARO: .venv/  (ye machine-specific aur bada hai; ise .gitignore mein jodo)
                 __pycache__/, *.pyc
\`\`\`

Ek teammate repo clone karta hai, apna \`.venv\` banaata hai, aur \`pip install -r requirements.txt\` chalata hai. Environment committed files se dobara banta hai, kabhi copy nahi.

## "Meri machine par kaam karta hai" failure

\`\`\`bash
# aap, chhah mahine pehle:  pip install requests  (2.28 mila)
# aapka code us behaviour par nirbhar karta hai jo requests 2.31 mein badla
# naya teammate:  pip install requests  (2.32 milta hai) -> sookshm roop se toota
# fix: ise pin karo. 'requests==2.28.2' waali requirements.txt, ya ek lockfile.
\`\`\``,

    examples: [
      {
        title: 'A venv is just a directory; sys.prefix points into it',
        titleHi: 'Ek venv bas ek directory hai; sys.prefix ismein point karta hai',
        code: `import subprocess, sys, os, tempfile

d = tempfile.mkdtemp()
venv = os.path.join(d, ".venv")

# create a venv without pip (fast) just to inspect its structure:
subprocess.run([sys.executable, "-m", "venv", "--without-pip", venv], check=True)

# what got created (folder names differ by OS, so check by role):
top = {x.lower() for x in os.listdir(venv)}
print("has pyvenv.cfg:", "pyvenv.cfg" in top)
print("has a lib dir:", "lib" in top)
print("has bin or Scripts:", bool(top & {"bin", "scripts"}))

# the venv's own python:
bindir = "Scripts" if os.name == "nt" else "bin"
vpy = os.path.join(venv, bindir, "python.exe" if os.name == "nt" else "python")
print("venv python exists:", os.path.exists(vpy) or os.path.exists(vpy + "3"))

# run code with the venv's python: sys.prefix points at the venv, base_prefix at the system:
out = subprocess.run([vpy, "-c", "import sys; print(sys.prefix != sys.base_prefix)"],
                     capture_output=True, text=True)
print("venv prefix differs from base:", out.stdout.strip())`,
        output: `has pyvenv.cfg: True
has a lib dir: True
has bin or Scripts: True
venv python exists: True
venv prefix differs from base: True`,
        explain: 'Note: on Windows the folder list would be `[\'Include\', \'Lib\', \'Scripts\', \'pyvenv.cfg\']`. A venv is an ordinary directory tree: its own `python`, a `lib/` that becomes `site-packages`, and `pyvenv.cfg` linking back to the base interpreter. Running the venv\'s `python` makes `sys.prefix` point at the venv (here `sys.prefix == sys.base_prefix` prints `False` meaning they differ — the venv is isolated).',
        explainHi: 'Note: Windows par folder list `[\'Include\', \'Lib\', \'Scripts\', \'pyvenv.cfg\']` hoti. Ek venv ek saamaanya directory tree hai: iska apna `python`, ek `lib/` jo `site-packages` banti hai, aur `pyvenv.cfg` jo base interpreter se link karti hai. Venv ka `python` chalana `sys.prefix` ko venv par point karaata hai.',
      },
      {
        title: 'pip freeze snapshots exact versions; pip install -r restores them',
        titleHi: 'pip freeze exact versions snapshot karta hai; pip install -r unhe bahaal karta hai',
        code: `import subprocess, sys, os, tempfile

d = tempfile.mkdtemp()
venv = os.path.join(d, ".venv")
subprocess.run([sys.executable, "-m", "venv", venv], check=True)
bindir = "Scripts" if os.name == "nt" else "bin"
vpy = os.path.join(venv, bindir, "python")

# install one small, dependency-free package into the venv:
subprocess.run([vpy, "-m", "pip", "install", "-q", "wrapt==1.16.0"], check=True)

# snapshot:
freeze = subprocess.run([vpy, "-m", "pip", "freeze"], capture_output=True, text=True).stdout
req_path = os.path.join(d, "requirements.txt")
open(req_path, "w").write(freeze)
print("requirements.txt:")
print(freeze.strip())

# a fresh venv + install -r reproduces the exact version:
venv2 = os.path.join(d, ".venv2")
subprocess.run([sys.executable, "-m", "venv", venv2], check=True)
vpy2 = os.path.join(venv2, bindir, "python")
subprocess.run([vpy2, "-m", "pip", "install", "-q", "-r", req_path], check=True)
v = subprocess.run([vpy2, "-c", "import wrapt; print(wrapt.__version__)"], capture_output=True, text=True)
print("reproduced wrapt version:", v.stdout.strip())`,
        output: `requirements.txt:
wrapt==1.16.0
reproduced wrapt version: 1.16.0`,
        explain: '`pip freeze` writes every installed package as `name==exact.version`. Feeding that file to `pip install -r` in a brand-new venv installs the identical versions — this is how a teammate or CI server rebuilds your environment from the committed `requirements.txt`. The two venvs are independent: installing into one never touched the other.',
        explainHi: '`pip freeze` har installed package ko `name==exact.version` ki tarah likhta hai. Us file ko ek bilkul-naye venv mein `pip install -r` ko dena samaan versions install karta hai — aise ek teammate ya CI server committed `requirements.txt` se aapka environment dobara banata hai. Do venvs swतंत्र hain.',
      },
      {
        title: 'Two venvs, two different versions of the same package, no conflict',
        titleHi: 'Do venvs, usi package ke do alag versions, koi conflict nahi',
        code: `import subprocess, sys, os, tempfile

d = tempfile.mkdtemp()
bindir = "Scripts" if os.name == "nt" else "bin"

def make_venv(name, pkg_spec):
    v = os.path.join(d, name)
    subprocess.run([sys.executable, "-m", "venv", v], check=True)
    py = os.path.join(v, bindir, "python")
    subprocess.run([py, "-m", "pip", "install", "-q", pkg_spec], check=True)
    return py

# project A needs wrapt 1.15, project B needs wrapt 1.16:
pyA = make_venv("projA", "wrapt==1.15.0")
pyB = make_venv("projB", "wrapt==1.16.0")

vA = subprocess.run([pyA, "-c", "import wrapt; print(wrapt.__version__)"], capture_output=True, text=True)
vB = subprocess.run([pyB, "-c", "import wrapt; print(wrapt.__version__)"], capture_output=True, text=True)
print("project A sees wrapt:", vA.stdout.strip())
print("project B sees wrapt:", vB.stdout.strip())
print("isolated:", vA.stdout.strip() != vB.stdout.strip())`,
        output: `project A sees wrapt: 1.15.0
project B sees wrapt: 1.16.0
isolated: True`,
        explain: 'Each project gets its own venv with its own `site-packages`, so project A can pin `wrapt==1.15.0` and project B `wrapt==1.16.0` on the same machine with zero interference. Without venvs, the second `pip install` would upgrade (or downgrade) the single global copy and break whichever project depended on the other version.',
        explainHi: 'Har project ko iska apna venv iska apna `site-packages` ke saath milta hai, isliye project A `wrapt==1.15.0` aur project B `wrapt==1.16.0` usi machine par zero interference ke saath pin kar sakta hai. Venvs ke bina, doosra `pip install` akele global copy ko upgrade karta aur us project ko todता jo doosre version par nirbhar tha.',
      },
    ],

    mistakes: [
      {
        wrong: `# no venv active:
pip install django
# -> installs into the global/system site-packages, or fails with a permission error,
#    or pip refuses ("externally-managed-environment") on modern Linux/macOS`,
        right: `python -m venv .venv
source .venv/bin/activate      # or .venv\\Scripts\\activate on Windows
pip install django             # now safely into .venv`,
        why: 'Installing without an active venv pollutes the system Python (breaking OS tools that depend on specific versions), needs admin rights, or is now blocked outright by PEP 668 on Debian/Ubuntu/Homebrew Python. Always create and activate a venv per project first.',
        whyHi: 'Bina ek active venv ke install karna system Python ko pollute karta hai (specific versions par nirbhar OS tools todта hai), admin rights chahiye, ya ab Debian/Ubuntu/Homebrew Python par PEP 668 dwara seedhe block hai. Hamesha pehle prati project ek venv banao aur activate karo.',
      },
      {
        wrong: `# .gitignore does NOT list .venv/
git add .
git commit -m "add project"
# -> commits thousands of files, machine-specific binaries, breaks on other OSes`,
        right: `# .gitignore
.venv/
__pycache__/
*.pyc
# commit only: pyproject.toml, requirements.txt, the lockfile`,
        why: 'A venv contains compiled binaries and absolute paths specific to the machine and OS it was built on. Committing it bloats the repo and it will not work for anyone else. The environment is meant to be *rebuilt* from the committed dependency files, not shared as files.',
        whyHi: 'Ek venv compiled binaries aur us machine aur OS ke specific absolute paths rakhta hai jispar ye bana. Ise commit karna repo ko fulaata hai aur ye kisi aur ke liye kaam nahi karega. Environment ka matlab committed dependency files se *dobara banaya* jaana hai, files ki tarah share nahi.',
      },
      {
        wrong: `# requirements.txt
django
requests
celery
# no versions -> every install may get different versions -> "works on my machine"`,
        right: `# requirements.txt  (pinned)
django==4.2.11
requests==2.31.0
celery==5.3.6
# or ranges in pyproject.toml + a lockfile for exact reproduction`,
        why: 'An unpinned dependency list is not reproducible: `pip install -r` today and in three months can produce different versions, and a bug that appears only with a newer transitive dependency is very hard to trace. Pin exact versions (or use a lockfile) so every environment is identical.',
        whyHi: 'Ek unpinned dependency list reproducible nahi hai: aaj aur teen mahine mein `pip install -r` alag versions bana sakta hai, aur ek bug jo sirf ek naye transitive dependency ke saath dikhta hai trace karna bahut mushkil hai. Exact versions pin karo (ya ek lockfile istemal karo) taaki har environment samaan ho.',
      },
    ],

    realWorld: [
      {
        en: '**Every Django project starts with `python -m venv .venv` before `pip install django`** — and every deployment (Docker image, CI job, server) rebuilds the environment from `requirements.txt`/`pyproject.toml`, never copies a venv. A `Dockerfile` typically does `COPY requirements.txt . && pip install -r requirements.txt` as its own layer for caching.',
        hi: '**Har Django project `pip install django` se pehle `python -m venv .venv` se shuru hota hai** — aur har deployment environment ko `requirements.txt`/`pyproject.toml` se dobara banata hai, kabhi ek venv copy nahi karta.',
      },
      {
        en: '**The `externally-managed-environment` error** (PEP 668) is what stops beginners on modern macOS/Linux from `pip install`-ing globally. The intended fix is exactly a venv; `--break-system-packages` is a footgun that damages OS tooling.',
        hi: '**`externally-managed-environment` error** (PEP 668) wo hai jo modern macOS/Linux par shuruaati logon ko globally `pip install` karne se rokta hai. Ichchhit fix bilkul ek venv hai; `--break-system-packages` ek footgun hai jo OS tooling ko nुksaan pahunchata hai.',
      },
      {
        en: '**`uv` is rapidly becoming the standard** — `uv venv`, `uv pip install`, `uv sync` are drop-in, far faster, and manage a lockfile (`uv.lock`) automatically. `pip` + `venv` + `pip-tools` is the older equivalent; `poetry` and `pdm` are alternatives. All build on the same `pyproject.toml` + lockfile idea.',
        hi: '**`uv` tezi se standard ban raha hai** — `uv venv`, `uv pip install`, `uv sync` drop-in, kaafi tez hain, aur ek lockfile (`uv.lock`) apne aap manage karte hain. `pip` + `venv` + `pip-tools` purana equivalent hai. Sab usi `pyproject.toml` + lockfile vichaar par bante hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a virtual environment, why is it necessary, and what does "activating" it do?',
        qHi: 'Ek virtual environment kya hai, ye kyun zaroori hai, aur ise "activate" karna kya karta hai?',
        a: 'A virtual environment is a self-contained directory that holds its own copy or link of the Python interpreter, its own pip, and its own initially-empty site-packages folder where installed third-party packages go. It exists to solve a fundamental problem: pip installs packages into a site-packages directory, and without a virtual environment that is the single global one shared by every project and often by the operating system itself. That leads to conflicts — project A needs version one of a library, project B needs version two, and only one can be installed globally at a time — and to permission problems, because the global location is often not writable by a normal user, and on current Debian, Ubuntu, and Homebrew Python it is now blocked entirely to protect system tools. A virtual environment gives each project its own isolated site-packages, so their dependency sets never interfere. You create one with python dash m venv followed by a directory name, conventionally dot venv. Activating it is a small change to your shell: it prepends the virtual environment\'s bin directory, or Scripts on Windows, to your PATH, so that typing python or pip resolves to the copies inside the environment rather than the system ones, and it sets a couple of environment variables so the interpreter knows to use the environment\'s site-packages. That is the whole mechanism; there is nothing magical. You can skip activation entirely and just run the environment\'s python by its full path — dot venv slash bin slash python — and it behaves identically. Deactivating simply undoes the PATH change. The environment directory itself is machine- and OS-specific and should never be committed to version control; instead you commit a dependency file, and anyone who checks out the project creates their own environment and installs from that file.',
        aHi: 'Ek virtual environment ek self-contained directory hai jo Python interpreter ki apni copy ya link, apna pip, aur apni shuruaat mein khaali site-packages folder rakhta hai jahaan installed third-party packages jaate hain. Ye ek mool samasya hal karne ke liye maujood hai: pip packages ko ek site-packages directory mein install karta hai, aur ek virtual environment ke bina wo akela global waali hai jo har project dwara shared hai. Isse conflicts hote hain — project A ko ek library ka version one chahiye, project B ko version two — aur permission samasyaayein. Aap ek python dash m venv aur ek directory naam se banate ho. Ise activate karna aapke shell mein ek chhota badlaav hai: ye environment ki bin directory ko aapke PATH par prepend karta hai, taaki python ya pip type karna environment ke andar copies par resolve ho. Ye poora mechanism hai. Environment directory khud machine- aur OS-specific hai aur kabhi version control mein commit nahi honi chahiye.',
      },
      {
        q: 'What is the difference between `requirements.txt`, `pyproject.toml`, and a lockfile? What do you commit?',
        qHi: '`requirements.txt`, `pyproject.toml`, aur ek lockfile mein kya antar hai? aap kya commit karte ho?',
        a: 'requirements dot txt is a flat text file listing packages to install, one per line, optionally with version constraints. It is what pip freeze produces and what pip install dash r consumes. It is simple, universally supported, needs no build system, and is common for applications, often split into a base file and a separate dev file for test and lint tools. Its weakness is that it does not distinguish the packages you actually chose to depend on from the packages those pulled in transitively, and freezing everything to exact versions mixes both together. pyproject dot toml is the modern standard configuration file for a Python project. Among other things it has a project section with a dependencies list, which declares the packages your code directly needs, usually as version ranges like greater-than-or-equal 4.2, less-than 5.0 rather than exact pins. It is required if you want to build and publish the project as an installable package, and modern tools read it to install dependencies. A lockfile is a separate, tool-generated file that pins every package — your direct dependencies and all of their transitive dependencies — to one exact version, usually with content hashes. Installing from a lockfile produces a byte-for-byte identical environment every time, which a loose range in pyproject dot toml cannot guarantee. Tools like uv, poetry, pdm, and pip-tools generate and maintain the lockfile from your declared dependencies. As for what to commit: commit pyproject dot toml, commit any requirements files, and commit the lockfile — those are the source of truth that lets anyone rebuild the environment. Do not commit the virtual environment directory itself; it is large, machine-specific, and meant to be regenerated. The workflow for a new developer is: clone, create a fresh virtual environment, and install from the committed lockfile or requirements file.',
        aHi: 'requirements dot txt ek flat text file hai jo install karne ke liye packages list karti hai, prati line ek, vaikalpik roop se version constraints ke saath. Ye wo hai jo pip freeze banaata hai aur jo pip install dash r consume karta hai. Ye saral hai, universally supported, koi build system nahi chahiye. Iski kamzori ye hai ki ye un packages ko alag nahi karti jinpar aapne asal mein nirbhar karne ka chunaav kiya un packages se jo unhone transitively pull kiye. pyproject dot toml ek Python project ke liye modern standard configuration file hai. Ismein ek project section ek dependencies list ke saath hai, jo aam taur par version ranges ki tarah declare karti hai. Ye zaroori hai agar aap project ko ek installable package ki tarah build karna chahte ho. Ek lockfile ek alag, tool-generated file hai jo har package ko ek exact version par pin karti hai. Kya commit karein: pyproject dot toml, koi requirements files, aur lockfile commit karo. Virtual environment directory khud commit mat karo.',
      },
    ],

    exercises: [
      {
        task: 'From Python, use `subprocess` to: create a venv in a temp dir with `python -m venv`, list its top-level contents, and run its `python -c "import sys; print(sys.prefix, sys.base_prefix, sep=chr(10))"`. Confirm `sys.prefix` (the venv) differs from `sys.base_prefix` (the system Python).',
        taskHi: 'Python se, `subprocess` istemal karke: ek temp dir mein `python -m venv` se ek venv banao, iske top-level contents list karo, aur iska `python -c "import sys; print(sys.prefix, sys.base_prefix, sep=chr(10))"` chalao. Confirm karo `sys.prefix` (venv) `sys.base_prefix` (system Python) se alag hai.',
        hint: 'The venv\'s python is at `<venv>/bin/python` (POSIX) or `<venv>\\Scripts\\python.exe` (Windows). Build the path with `os.name`. `sys.prefix != sys.base_prefix` is the canonical "am I in a venv" check.',
        hintHi: 'Venv ka python `<venv>/bin/python` (POSIX) ya `<venv>\\Scripts\\python.exe` (Windows) par hai. Path `os.name` se banao. `sys.prefix != sys.base_prefix` canonical "kya main ek venv mein hoon" check hai.',
      },
      {
        task: 'Create two venvs in a temp dir. Into venv A install `wrapt==1.15.0`; into venv B install `wrapt==1.16.0` (use `<venv>/bin/python -m pip install -q ...`). Then run each venv\'s python to print `wrapt.__version__` and assert they differ — proving isolation on one machine.',
        taskHi: 'Ek temp dir mein do venvs banao. venv A mein `wrapt==1.15.0` install karo; venv B mein `wrapt==1.16.0` (`<venv>/bin/python -m pip install -q ...` istemal karo). Phir har venv ka python chalao `wrapt.__version__` print karne ko aur assert karo wo alag hain — ek machine par isolation saabit karte hue.',
        hint: 'Always invoke pip as `<venv_python> -m pip` so it installs into that specific venv. `wrapt` is tiny and has no dependencies, so installs are fast and offline-friendly if cached.',
        hintHi: 'Hamesha pip ko `<venv_python> -m pip` ki tarah invoke karo taaki ye us specific venv mein install kare. `wrapt` chhota hai aur iski koi dependencies nahi.',
      },
      {
        task: 'In a venv, install `wrapt==1.16.0`, run `pip freeze` and write it to `requirements.txt`, then create a SECOND fresh venv and run `pip install -r requirements.txt` in it. Verify the second venv has `wrapt` at exactly `1.16.0`. This is the clone-and-reproduce workflow.',
        taskHi: 'Ek venv mein, `wrapt==1.16.0` install karo, `pip freeze` chalao aur ise `requirements.txt` mein likho, phir ek DOOSRA fresh venv banao aur usmein `pip install -r requirements.txt` chalao. Verify karo doosre venv mein `wrapt` bilkul `1.16.0` par hai. Ye clone-and-reproduce workflow hai.',
        hint: '`pip freeze` output for a single dependency-free package is just `wrapt==1.16.0\\n`. Writing it to a file and `pip install -r` in a new venv is exactly what a teammate or CI does after cloning your repo.',
        hintHi: 'Ek akele dependency-free package ke liye `pip freeze` output bas `wrapt==1.16.0\\n` hai. Ise ek file mein likhna aur ek naye venv mein `pip install -r` bilkul wahi hai jo ek teammate ya CI aapka repo clone karne ke baad karta hai.',
      },
    ],

    keyTakeaways: [
      'Without a virtualenv, `pip install` writes into the ONE global site-packages — shared by every project and the OS. Result: version conflicts, permission errors, or an outright block (PEP 668) on modern macOS/Linux.',
      'A venv is a directory with its own `python`, `pip`, and `site-packages`. Create: `python -m venv .venv`. It is not magic — activation just puts `.venv/bin` first on `PATH`.',
      'Activate per terminal: `source .venv/bin/activate` (POSIX) / `.venv\\Scripts\\activate` (Windows). Or skip activation and call `.venv/bin/python` directly.',
      'One venv per project. Two projects on one machine can pin different versions of the same package with zero interference.',
      '`pip freeze > requirements.txt` snapshots every installed package as `name==exact.version`. `pip install -r requirements.txt` recreates that snapshot in a fresh venv.',
      '`requirements.txt` = flat list, simple, great for apps. `pyproject.toml [project] dependencies` = modern standard, usually version RANGES, required to publish a package. A lockfile pins everything transitively for byte-identical rebuilds.',
      'COMMIT: `pyproject.toml`, `requirements.txt`, the lockfile. NEVER commit `.venv/` (machine-specific, huge) — add it to `.gitignore`. The environment is rebuilt from files, not copied.',
      'Unpinned dependencies are not reproducible — pin exact versions (or use a lockfile) to avoid "works on my machine".',
    ],
    keyTakeawaysHi: [
      'Ek virtualenv ke bina, `pip install` EK global site-packages mein likhta hai — har project aur OS dwara shared. Nateeja: version conflicts, permission errors, ya modern macOS/Linux par ek seedha block (PEP 668).',
      'Ek venv ek directory hai apne `python`, `pip`, aur `site-packages` ke saath. Banao: `python -m venv .venv`. Ye magic nahi hai — activation bas `.venv/bin` ko `PATH` par pehle rakhta hai.',
      'Prati terminal activate karo: `source .venv/bin/activate` (POSIX) / `.venv\\Scripts\\activate` (Windows). Ya activation chhodo aur `.venv/bin/python` seedhe call karo.',
      'Prati project ek venv. Ek machine par do projects usi package ke alag versions zero interference ke saath pin kar sakte hain.',
      '`pip freeze > requirements.txt` har installed package ko `name==exact.version` ki tarah snapshot karta hai. `pip install -r requirements.txt` us snapshot ko ek fresh venv mein recreate karta hai.',
      '`requirements.txt` = flat list, saral, apps ke liye badhiya. `pyproject.toml [project] dependencies` = modern standard, aam taur par version RANGES, ek package publish karne ko zaroori. Ek lockfile sab kuch transitively pin karta hai.',
      'COMMIT: `pyproject.toml`, `requirements.txt`, lockfile. `.venv/` KABHI commit mat karo (machine-specific, bada) — ise `.gitignore` mein jodo. Environment files se dobara banta hai, copy nahi.',
      'Unpinned dependencies reproducible nahi hain — exact versions pin karo (ya ek lockfile istemal karo) "meri machine par kaam karta hai" bachne ko.',
    ],
  },

  {
    slug: 'py-project-layout-and-running',
    title: 'Project Layout, Editable Installs, and Entry Points',
    titleHi: 'Project Layout, Editable Installs, Aur Entry Points',
    description: 'A project that runs fine when you launch it from its root directory and breaks with `ModuleNotFoundError` the moment you `cd` elsewhere or run the tests — because "it works" was relying on the current directory happening to be on `sys.path`. A small `pyproject.toml` plus `pip install -e .` makes your package importable from anywhere in the environment, which is how real projects (and Django) are structured.',
    descriptionHi: 'Ek project jo iski root directory se launch karne par theek chalta hai aur `ModuleNotFoundError` se tootता hai jis pal aap kahin aur `cd` karte ho ya tests chalate ho — kyunki "ye kaam karta hai" is baat par nirbhar tha ki current directory `sys.path` par hone lag gayi. Ek chhota `pyproject.toml` plus `pip install -e .` aapke package ko environment mein kahin se bhi importable banaata hai, jo aise asli projects (aur Django) structure kiye jaate hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 6,

    analogy: {
      en: '**Registering your workshop\'s address with the front desk instead of relying on people already standing next to it.** If your tools only work when someone is physically inside your workshop, the moment they step into the hallway — to run an errand, to fetch a test kit — everything stops, because "reach me the wrench" only meant something while they were in the room. Registering the address is `pip install -e .`: it tells the environment "the package `myapp` lives at this path", so any code running in that environment can `import myapp` no matter which directory it was launched from. The `-e` (editable) part means it registers the *address*, not a photocopy — you keep editing the files in place and every run picks up the change, no reinstall. `pyproject.toml` is the short registration form: the package\'s name, where its source sits (`src/myapp/`), and optionally a console command that maps a name like `myapp` to a function so people can run it without typing `python -m`. The `src/` layout — putting the package one level down in a `src/` folder — is a deliberate choice that forces you to test against the *installed* package rather than accidentally importing the loose folder sitting in your current directory.',
      hi: '**Apni workshop ka address front desk par register karna, un logon par nirbhar hone ke bajaye jo pehle se iske bagal khade hain.** Agar aapke tools sirf tab kaam karte hain jab koi sharirik roop se aapki workshop ke andar hai, jis pal wo hallway mein kadam rakhte hain — sab ruk jaata hai. Address register karna `pip install -e .` hai: ye environment ko bataata hai "package `myapp` is path par rehta hai", isliye us environment mein chalne waala koi bhi code `import myapp` kar sakta hai chahe ye kis directory se launch hua. `-e` (editable) hissa matlab ye *address* register karta hai, ek photocopy nahi — aap files ko jagah par edit karte rehte ho aur har run badlaav uthaata hai. `pyproject.toml` chota registration form hai: package ka naam, iski source kahaan baithi hai (`src/myapp/`), aur vaikalpik roop se ek console command. `src/` layout ek jaan-boojhkar chunaav hai jo aapko *installed* package ke khilaaf test karne ko majboor karta hai.',
    },

    simple: `**The fragile setup that "works" by accident**

\`\`\`
myproject/
    app.py              # import helpers  <- works ONLY when cwd is myproject/
    helpers.py
    tests/
        test_app.py     # 'from app import ...' -> ModuleNotFoundError from here
\`\`\`

\`app.py\` importing \`helpers\` works because Python puts the script's directory on \`sys.path\`. Run \`pytest\` from the root, or \`python tests/test_app.py\`, and the imports break.

**The fix: a package + \`pyproject.toml\` + editable install**

\`\`\`
myproject/
    pyproject.toml
    src/
        myapp/
            __init__.py
            app.py
            helpers.py
    tests/
        test_app.py     # from myapp.app import main   <- works from anywhere
\`\`\`

\`\`\`toml
# pyproject.toml
[project]
name = "myapp"
version = "0.1.0"
dependencies = ["requests>=2.31"]

[project.scripts]
myapp = "myapp.app:main"        # 'myapp' on the command line runs myapp/app.py:main()

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
\`\`\`

\`\`\`bash
python -m venv .venv && source .venv/bin/activate
pip install -e .                # install myapp in "editable" mode
python -c "import myapp"        # works from ANY directory now
pytest                          # tests import myapp.* cleanly
myapp                           # the console script runs main()
\`\`\`

\`\`\`
pip install -e .    "editable install": registers your package with the environment
                    by PATH, so 'import myapp' works everywhere, and you keep editing
                    the source in place (no reinstall after each change).

src/ layout         package lives in src/myapp/ , not ./myapp/ . Forces tests and
                    tools to use the INSTALLED package, catching "works only because
                    the folder is in my cwd" bugs. (flat layout ./myapp/ also fine
                    for small projects.)

[project.scripts]   maps a command name -> "module:function". After install,
myapp = "pkg:main"  typing 'myapp' runs that function. No 'python -m' needed.

python -m myapp      runs src/myapp/__main__.py  (if present)

PYTHONPATH=./src     env var that adds dirs to sys.path -- a stopgap; prefer -e install
\`\`\``,

    simpleHi: `**Nazuk setup jo "durghatnaavash" kaam karta hai**

\`\`\`
myproject/
    app.py              # import helpers  <- kaam karta hai SIRF jab cwd myproject/ hai
    helpers.py
    tests/
        test_app.py     # 'from app import ...' -> yahaan se ModuleNotFoundError
\`\`\`

\`app.py\` \`helpers\` import karta hua kaam karta hai kyunki Python script ki directory ko \`sys.path\` par rakhta hai. Root se \`pytest\` chalao, ya \`python tests/test_app.py\`, aur imports tootते hain.

**Fix: ek package + \`pyproject.toml\` + editable install**

\`\`\`
myproject/
    pyproject.toml
    src/
        myapp/
            __init__.py
            app.py
            helpers.py
    tests/
        test_app.py     # from myapp.app import main   <- kahin se bhi kaam karta hai
\`\`\`

\`\`\`toml
# pyproject.toml
[project]
name = "myapp"
version = "0.1.0"
dependencies = ["requests>=2.31"]

[project.scripts]
myapp = "myapp.app:main"        # command line par 'myapp' myapp/app.py:main() chalata hai

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
\`\`\`

\`\`\`bash
python -m venv .venv && source .venv/bin/activate
pip install -e .                # myapp ko "editable" mode mein install karo
python -c "import myapp"        # ab KISI bhi directory se kaam karta hai
pytest                          # tests myapp.* saaf import karte hain
myapp                           # console script main() chalata hai
\`\`\`

\`\`\`
pip install -e .    "editable install": aapke package ko environment ke saath PATH se
                    register karta hai, isliye 'import myapp' har jagah kaam karta hai, aur
                    aap source ko jagah par edit karte rehte ho (har badlaav ke baad reinstall nahi).

src/ layout         package src/myapp/ mein rehta hai, ./myapp/ mein nahi. Tests aur
                    tools ko INSTALLED package istemal karne ko majboor karta hai. (chote
                    projects ke liye flat layout ./myapp/ bhi theek.)

[project.scripts]   ek command naam -> "module:function" map karta hai. Install ke baad,
myapp = "pkg:main"  'myapp' type karna wo function chalata hai. 'python -m' nahi chahiye.

python -m myapp      src/myapp/__main__.py chalata hai  (agar maujood)

PYTHONPATH=./src     env var jo dirs ko sys.path par jodta hai -- ek stopgap; -e install prefer karo
\`\`\``,

    content: `## Why "run from the root" is not a real setup

\`\`\`bash
cd myproject && python app.py       # works: myproject/ is sys.path[0]
cd myproject && python tests/x.py   # tests/ is sys.path[0]; 'import app' fails
cd / && python myproject/app.py     # myproject/ is sys.path[0]; but 'import helpers' only
                                    #   works if helpers.py is beside app.py -- fragile
pytest                              # pytest manipulates sys.path in its own way -> confusing
\`\`\`

Relying on the current directory or the script's location to make imports resolve works until the moment something runs your code differently — a test runner, a scheduler, a different working directory, an IDE. The durable fix is to make the package genuinely importable in the environment.

## \`pip install -e .\` — the editable install

\`\`\`bash
pip install -e .
\`\`\`

This reads \`pyproject.toml\`, installs the declared dependencies, and adds a link (a \`.pth\` file or an import hook) in \`site-packages\` pointing at your \`src/\` directory. Effects:

- \`import myapp\` works from any directory, in scripts, tests, notebooks, subprocesses
- you keep editing files in \`src/myapp/\` and every run sees the change immediately — no reinstall
- \`pip list\` shows \`myapp\` as installed, with a path instead of a version-only entry

Without \`-e\`, \`pip install .\` copies the package into \`site-packages\` and your edits do nothing until you reinstall. Always use \`-e\` for the project you are actively developing.

## \`src/\` layout vs flat layout

\`\`\`
src/ layout                          flat layout
myproject/                           myproject/
    pyproject.toml                       pyproject.toml
    src/myapp/__init__.py                myapp/__init__.py
    tests/                               tests/
\`\`\`

**Flat** is simpler and fine for small projects. **\`src/\`** adds one wrinkle with a real payoff: because the package is not in the project root, you *cannot* accidentally \`import myapp\` just by being in the root directory — you are forced to install it, so your tests exercise the same installed package your users get. It catches "the tests pass but the wheel is broken" problems. Most new projects use \`src/\`.

## Entry points / console scripts

\`\`\`toml
[project.scripts]
myapp = "myapp.cli:main"
mytool-sync = "myapp.sync:run"
\`\`\`

After \`pip install -e .\`, the environment gets executable commands \`myapp\` and \`mytool-sync\` that call those functions. This is how installed tools work — \`black\`, \`pytest\`, \`django-admin\`, \`flask\` are all console scripts declared this way. The function takes no required arguments and reads \`sys.argv\` (or uses \`argparse\`/\`click\`).

\`\`\`python
# myapp/cli.py
import sys

def main():
    args = sys.argv[1:]
    ...
    return 0            # becomes the process exit code
\`\`\`

## \`__main__.py\` and \`python -m\`

\`\`\`
src/myapp/
    __init__.py
    __main__.py        # python -m myapp runs this
    cli.py
\`\`\`

\`\`\`python
# src/myapp/__main__.py
from myapp.cli import main
raise SystemExit(main())
\`\`\`

\`python -m myapp\` and the \`myapp\` console script can share the same \`main()\`. \`-m\` always works if the package is importable; the console script is more convenient once installed.

## \`PYTHONPATH\` — the escape hatch, not the solution

\`\`\`bash
PYTHONPATH=src python -m myapp       # adds ./src to sys.path for this run
export PYTHONPATH=src               # ... for the whole shell session
\`\`\`

\`PYTHONPATH\` prepends directories to \`sys.path\`. It is useful for a quick one-off or in a container, but as a project's normal way of working it is invisible, easy to get wrong, and does not install dependencies. Prefer \`pip install -e .\`.

## How this maps to Django

\`\`\`
mysite/
    manage.py                    # thin entry point: python manage.py <command>
    pyproject.toml               # or requirements.txt
    mysite/
        __init__.py
        settings.py
        urls.py
    users/                       # an app = a package
        __init__.py
        models.py
        views.py
    orders/
        ...
\`\`\`

\`manage.py\` sets \`DJANGO_SETTINGS_MODULE\` and calls Django's CLI. \`django-admin\` is a console script. Each app is a package listed in \`INSTALLED_APPS\`. You still create a venv and \`pip install -r requirements.txt\` (or \`-e .\`). Everything in this module applies directly.`,

    contentHi: `## "Root se chalao" ek asli setup kyun nahi hai

\`\`\`bash
cd myproject && python app.py       # kaam karta hai: myproject/ sys.path[0] hai
cd myproject && python tests/x.py   # tests/ sys.path[0] hai; 'import app' fail hota hai
cd / && python myproject/app.py     # myproject/ sys.path[0] hai; par 'import helpers' sirf
                                    #   tab kaam karta hai jab helpers.py app.py ke bagal ho
pytest                              # pytest sys.path ko apne tarike se manipulate karta hai
\`\`\`

Current directory ya script ki location par nirbhar hona imports resolve karne ko kaam karta hai jab tak kuch aapke code ko alag tarike se chalata hai — ek test runner, ek scheduler, ek alag working directory, ek IDE. Tikaऊ fix package ko environment mein sachmuch importable banaana hai.

## \`pip install -e .\` — editable install

\`\`\`bash
pip install -e .
\`\`\`

Ye \`pyproject.toml\` padhta hai, declared dependencies install karta hai, aur \`site-packages\` mein ek link jodta hai jo aapki \`src/\` directory par point karta hai. Prabhaav:

- \`import myapp\` kisi bhi directory se kaam karta hai, scripts, tests, notebooks, subprocesses mein
- aap \`src/myapp/\` mein files edit karte rehte ho aur har run badlaav turant dekhta hai — koi reinstall nahi
- \`pip list\` \`myapp\` ko installed dikhaata hai, ek path ke saath

\`-e\` ke bina, \`pip install .\` package ko \`site-packages\` mein copy karta hai aur aapke edits kuch nahi karte jab tak aap reinstall nahi karte. Jis project ko aap sakriya roop se develop kar rahe ho uske liye hamesha \`-e\` istemal karo.

## \`src/\` layout vs flat layout

**Flat** saral hai aur chote projects ke liye theek. **\`src/\`** ek asli faayde ke saath ek wrinkle jodta hai: kyunki package project root mein nahi hai, aap *durghatnaavash* \`import myapp\` sirf root directory mein hone se nahi kar sakte — aap ise install karne ko majboor ho, isliye aapke tests wahi installed package exercise karte hain jo aapke users paate hain. Adhikaansh naye projects \`src/\` istemal karte hain.

## Entry points / console scripts

\`\`\`toml
[project.scripts]
myapp = "myapp.cli:main"
mytool-sync = "myapp.sync:run"
\`\`\`

\`pip install -e .\` ke baad, environment ko executable commands \`myapp\` aur \`mytool-sync\` milte hain jo un functions ko call karte hain. Aise installed tools kaam karte hain — \`black\`, \`pytest\`, \`django-admin\`, \`flask\` sab is tarah declare kiye console scripts hain.

## \`__main__.py\` aur \`python -m\`

\`\`\`python
# src/myapp/__main__.py
from myapp.cli import main
raise SystemExit(main())
\`\`\`

\`python -m myapp\` aur \`myapp\` console script wahi \`main()\` share kar sakte hain. \`-m\` hamesha kaam karta hai agar package importable hai; console script install hone ke baad zyaada suvidhaajanak hai.

## \`PYTHONPATH\` — escape hatch, solution nahi

\`\`\`bash
PYTHONPATH=src python -m myapp       # is run ke liye ./src ko sys.path par jodta hai
\`\`\`

\`PYTHONPATH\` directories ko \`sys.path\` par prepend karta hai. Ye ek quick one-off ya ek container mein upyogi hai, par ek project ke saamaanya kaam karne ke tarike ki tarah ye invisible hai, galat karna aasaan hai, aur dependencies install nahi karta. \`pip install -e .\` prefer karo.

## Ye Django se kaise map hota hai

\`manage.py\` \`DJANGO_SETTINGS_MODULE\` set karta hai aur Django ki CLI call karta hai. \`django-admin\` ek console script hai. Har app ek package hai jo \`INSTALLED_APPS\` mein listed hai. Aap abhi bhi ek venv banate ho aur \`pip install -r requirements.txt\` karte ho. Is module mein sab kuch seedhe lागू hota hai.`,

    examples: [
      {
        title: 'The fragile layout: imports depend on where you launch from',
        titleHi: 'Nazuk layout: imports is par nirbhar karte hain aap kahaan se launch karte ho',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
os.makedirs(os.path.join(d, "tests"))
open(os.path.join(d, "helpers.py"), "w").write("def double(n): return n * 2\\n")
open(os.path.join(d, "app.py"), "w").write(textwrap.dedent('''
    import helpers
    def main(): return helpers.double(21)
    if __name__ == "__main__":
        print(main())
'''))
open(os.path.join(d, "tests", "test_app.py"), "w").write(textwrap.dedent('''
    from app import main
    print("test:", main())
'''))

print("=== run app.py from project root ===")
r1 = subprocess.run([sys.executable, "app.py"], cwd=d, capture_output=True, text=True)
print(r1.stdout.strip() or r1.stderr.strip().splitlines()[-1])

print("=== run the test file from the project root ===")
r2 = subprocess.run([sys.executable, os.path.join("tests", "test_app.py")], cwd=d,
                    capture_output=True, text=True)
print(r2.stdout.strip() or r2.stderr.strip().splitlines()[-1])`,
        output: `=== run app.py from project root ===
42
=== run the test file from the project root ===
ModuleNotFoundError: No module named 'app'`,
        explain: '`python app.py` works: Python puts `app.py`\'s directory (the project root) on `sys.path`, so `import helpers` resolves. Running `tests/test_app.py` puts `tests/` on `sys.path` instead — the root is not there, so `from app import main` raises `ModuleNotFoundError`. The imports only "worked" by accident of the launch location.',
        explainHi: '`python app.py` kaam karta hai: Python `app.py` ki directory (project root) ko `sys.path` par rakhta hai, isliye `import helpers` resolve hota hai. `tests/test_app.py` chalana iske bajaye `tests/` ko `sys.path` par rakhta hai — root wahaan nahi hai, isliye `from app import main` `ModuleNotFoundError` raise karta hai.',
      },
      {
        title: 'pip install -e . makes the package importable from anywhere',
        titleHi: 'pip install -e . package ko kahin se bhi importable banaata hai',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
os.makedirs(os.path.join(d, "src", "myapp"))
open(os.path.join(d, "src", "myapp", "__init__.py"), "w").write("")
open(os.path.join(d, "src", "myapp", "core.py"), "w").write("def add(a, b): return a + b\\n")
open(os.path.join(d, "pyproject.toml"), "w").write(textwrap.dedent('''
    [project]
    name = "myapp"
    version = "0.1.0"

    [build-system]
    requires = ["hatchling"]
    build-backend = "hatchling.build"
'''))

# fresh venv, editable install
venv = os.path.join(d, ".venv")
subprocess.run([sys.executable, "-m", "venv", venv], check=True)
bindir = "Scripts" if os.name == "nt" else "bin"
vpy = os.path.join(venv, bindir, "python")
r = subprocess.run([vpy, "-m", "pip", "install", "-q", "-e", "."], cwd=d, capture_output=True, text=True)
print("install ok:", r.returncode == 0)

# import myapp from a COMPLETELY different directory:
other = tempfile.mkdtemp()
out = subprocess.run([vpy, "-c", "from myapp.core import add; print(add(20, 22))"],
                     cwd=other, capture_output=True, text=True)
print("from unrelated cwd:", out.stdout.strip() or out.stderr.strip().splitlines()[-1])

# edit the source, no reinstall, change is picked up:
open(os.path.join(d, "src", "myapp", "core.py"), "w").write("def add(a, b): return a + b + 1000\\n")
out2 = subprocess.run([vpy, "-c", "from myapp.core import add; print(add(20, 22))"],
                      cwd=other, capture_output=True, text=True)
print("after editing source:", out2.stdout.strip())`,
        output: `install ok: True
from unrelated cwd: 42
after editing source: 1042`,
        explain: '`pip install -e .` reads `pyproject.toml` and links `src/` into the venv\'s import path. Now `from myapp.core import add` works from any directory — here an unrelated temp dir. Because it is *editable*, changing `core.py` and re-running immediately reflects the edit (`42` -> `1042`) with no reinstall. This is the setup real projects use.',
        explainHi: '`pip install -e .` `pyproject.toml` padhta hai aur `src/` ko venv ke import path mein link karta hai. Ab `from myapp.core import add` kisi bhi directory se kaam karta hai. Kyunki ye *editable* hai, `core.py` badalna aur phir se chalana turant edit dikhaata hai (`42` -> `1042`) bina reinstall. Ye setup asli projects istemal karte hain.',
      },
      {
        title: 'A console script: [project.scripts] maps a command to a function',
        titleHi: 'Ek console script: [project.scripts] ek command ko ek function se map karta hai',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
os.makedirs(os.path.join(d, "src", "greet"))
open(os.path.join(d, "src", "greet", "__init__.py"), "w").write("")
open(os.path.join(d, "src", "greet", "cli.py"), "w").write(textwrap.dedent('''
    import sys
    def main():
        name = sys.argv[1] if len(sys.argv) > 1 else "world"
        print(f"hello, {name}")
        return 0
'''))
open(os.path.join(d, "pyproject.toml"), "w").write(textwrap.dedent('''
    [project]
    name = "greet"
    version = "0.1.0"

    [project.scripts]
    greet = "greet.cli:main"

    [build-system]
    requires = ["hatchling"]
    build-backend = "hatchling.build"
'''))

venv = os.path.join(d, ".venv")
subprocess.run([sys.executable, "-m", "venv", venv], check=True)
bindir = "Scripts" if os.name == "nt" else "bin"
subprocess.run([os.path.join(venv, bindir, "python"), "-m", "pip", "install", "-q", "-e", "."],
               cwd=d, check=True)

greet_cmd = os.path.join(venv, bindir, "greet")
print(subprocess.run([greet_cmd], capture_output=True, text=True).stdout, end="")
print(subprocess.run([greet_cmd, "Ada"], capture_output=True, text=True).stdout, end="")
# equivalently, python -m won't work here (no __main__.py) but the function is importable:
print(subprocess.run([os.path.join(venv, bindir, "python"), "-c",
                      "from greet.cli import main; import sys; sys.argv=['x','Bo']; main()"],
                     capture_output=True, text=True).stdout, end="")`,
        output: `hello, world
hello, Ada
hello, Bo`,
        explain: '`[project.scripts] greet = "greet.cli:main"` tells the installer to create an executable named `greet` in the venv that calls `greet.cli.main()`. After `pip install -e .`, running `greet` or `greet Ada` invokes that function — no `python -m`, no path. This is exactly how `pytest`, `black`, and `django-admin` become commands.',
        explainHi: '`[project.scripts] greet = "greet.cli:main"` installer ko venv mein `greet` naam ka ek executable banane ko bataata hai jo `greet.cli.main()` call karta hai. `pip install -e .` ke baad, `greet` ya `greet Ada` chalana wo function invoke karta hai — koi `python -m`, koi path nahi. Aise hi `pytest`, `black`, aur `django-admin` commands ban jaate hain.',
      },
    ],

    mistakes: [
      {
        wrong: `# rely on running everything from the project root
cd myproject
python app.py          # works
# then: cron job / systemd / CI runs it with a different cwd -> ModuleNotFoundError`,
        right: `# make it a real package and install it editable
pip install -e .
# now 'import myapp' works regardless of cwd, in cron, CI, tests, everywhere`,
        why: 'Imports that resolve only because of the current directory are a latent bug. The first time your code runs from a scheduler, a service manager, a test runner, or a different folder, it breaks. An editable install registers the package with the environment so `import` works independently of where the process started.',
        whyHi: 'Imports jo sirf current directory ki wajah se resolve hote hain ek latent bug hain. Pehli baar jab aapka code ek scheduler, ek service manager, ek test runner, ya ek alag folder se chalta hai, ye tootता hai. Ek editable install package ko environment ke saath register karta hai.',
      },
      {
        wrong: `pip install .          # non-editable: copies a snapshot into site-packages
# edit src/myapp/foo.py ... run again ... nothing changed ... confusion`,
        right: `pip install -e .       # editable: links to your source; edits take effect immediately`,
        why: 'A plain `pip install .` builds and copies the package into `site-packages`. Your subsequent source edits are not reflected until you reinstall. For the project you are developing, `-e` (editable/development install) links to the working tree so every run uses your current code.',
        whyHi: 'Ek plain `pip install .` package ko build karke `site-packages` mein copy karta hai. Aapke baad ke source edits reinstall karne tak nahi dikhte. Jis project ko aap develop kar rahe ho uske liye, `-e` working tree se link karta hai taaki har run aapka current code istemal kare.',
      },
      {
        wrong: `# permanently in your shell rc file:
export PYTHONPATH=/home/me/projects/myapp/src:/home/me/projects/other/src
# invisible global state; breaks when a project moves; leaks between projects`,
        right: `# per project: pip install -e .  inside that project's venv
# PYTHONPATH only for a deliberate one-off:  PYTHONPATH=src python -m myapp`,
        why: 'A global `PYTHONPATH` in your shell config silently alters imports for every Python process you run, across all projects and venvs, and is a frequent cause of "it imports the wrong thing" mysteries. Scope import paths per project via an editable install inside that project\'s venv.',
        whyHi: 'Aapke shell config mein ek global `PYTHONPATH` har Python process ke imports ko chupchaap badalta hai, sabhi projects aur venvs mein, aur "ye galat cheez import karta hai" rahasyon ka ek baar-baar kaaran hai. Import paths ko prati project us project ke venv mein ek editable install ke zariye scope karo.',
      },
    ],

    realWorld: [
      {
        en: '**`django-admin`, `pytest`, `black`, `ruff`, `flask`, `uvicorn`, `alembic` are all console scripts** declared with `[project.scripts]` (or the older `entry_points`). When you `pip install` one, the installer drops an executable in your venv\'s `bin/` that imports and calls the declared function.',
        hi: '**`django-admin`, `pytest`, `black`, `ruff`, `flask`, `uvicorn` sab console scripts hain** jo `[project.scripts]` se declare kiye gaye. Jab aap ek `pip install` karte ho, installer aapke venv ke `bin/` mein ek executable daalta hai jo declared function import aur call karta hai.',
      },
      {
        en: '**The `src/` layout is now the default in most project templates** (`hatch new`, `uv init --lib`, PyPA guidance) precisely because it prevents the class of bug where tests pass against the local folder but the built package is missing a file or has a broken import.',
        hi: '**`src/` layout ab adhikaansh project templates mein default hai** kyunki ye us tarah ke bug ko rokta hai jahaan tests local folder ke khilaaf pass hote hain par built package mein ek file missing hai ya ek toota import hai.',
      },
      {
        en: '**A Django project is this exact structure** — `manage.py` is a thin entry-point script, each app is an importable package, and `pip install -e .` (or `-r requirements.txt`) in a venv is step one of any setup. `DJANGO_SETTINGS_MODULE` is just an env var naming an importable module, resolved via the same `sys.path` rules.',
        hi: '**Ek Django project ye exact structure hai** — `manage.py` ek patli entry-point script hai, har app ek importable package hai, aur ek venv mein `pip install -e .` kisi bhi setup ka step one hai. `DJANGO_SETTINGS_MODULE` bas ek env var hai jo ek importable module ko naam deta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does `pip install -e .` matter, and what is the difference from `pip install .`?',
        qHi: '`pip install -e .` kyun maayne rakhta hai, aur `pip install .` se antar kya hai?',
        a: 'Both commands install your project into the active environment by reading its pyproject dot toml — resolving and installing the declared dependencies and making the package importable. The difference is how the package\'s own code is made available. pip install dot, without the dash e, builds the package and copies its files into the environment\'s site-packages directory. From then on, importing the package gets that copy. If you edit your source afterwards, nothing changes until you reinstall, because the copy in site-packages is a frozen snapshot. That is what you want when installing a dependency or deploying a fixed version, but it is wrong for a project you are actively developing. pip install dash e dot, the editable or development install, instead of copying, adds a link in site-packages — historically a path file, now often an import hook — that points back at your source directory, typically src. The package is importable from anywhere in the environment, exactly as if it were copied, but every import reads your working files directly. So you edit code and the next run, the next test, the next notebook cell picks up the change with no reinstall step. This is why it matters: it is the mechanism that lets your tests, scripts, and tools all import the same package your users would get, while you iterate on it. The alternative approaches — running everything from the project root so the current directory happens to be on sys dot path, or setting PYTHONPATH — are fragile: they break the moment something runs your code from a different directory, like a test runner, a scheduler, or CI, and they do not install your dependencies. An editable install in the project\'s virtual environment is the durable setup, and it is step one of working on essentially any real Python project, Django included.',
        aHi: 'Dono commands aapke project ko active environment mein iski pyproject dot toml padhkar install karte hain — declared dependencies resolve aur install karke aur package ko importable banaakar. Antar ye hai ki package ka apna code kaise available banaya jaata hai. pip install dot, bina dash e, package build karta hai aur iski files environment ki site-packages directory mein copy karta hai. Uske baad, package import karna wo copy paata hai. Agar aap apna source baad mein edit karte ho, kuch nahi badalta jab tak aap reinstall nahi karte. pip install dash e dot, editable install, copy karne ke bajaye, site-packages mein ek link jodta hai jo aapki source directory par wapas point karta hai. Package har jagah se importable hai, par har import aapki working files seedhe padhta hai. Toh aap code edit karte ho aur agla run badlaav uthaata hai bina reinstall. Isliye ye maayne rakhta hai: ye wo mechanism hai jo aapke tests, scripts, aur tools ko wahi package import karne deta hai jo aapke users paate.',
      },
      {
        q: 'What is a console script / entry point, and how does typing `pytest` end up running Python code?',
        qHi: 'Ek console script / entry point kya hai, aur `pytest` type karna Python code kaise chalata hai?',
        a: 'A console script is a mapping, declared in a package\'s pyproject dot toml under a scripts table, from a command name to a specific function in a specific module — for example the name pytest mapped to a main function in pytest\'s console entry module. When you pip install a package that declares console scripts, the installer does not just copy the package; it also generates a small executable for each declared name and places it in the environment\'s bin directory, which is on your PATH when the environment is active. That generated executable is tiny: it is essentially a stub that imports the named module and calls the named function, then exits with whatever integer that function returns as the process exit code. So typing pytest at the shell runs that stub, which imports pytest\'s module and calls its main, which does the actual work of discovering and running tests. The function conventionally takes no required arguments and reads sys dot argv itself, or uses an argument parser like argparse or click, so command-line arguments after the name flow through normally. This is the same mechanism behind black, ruff, flask, uvicorn, django-admin, and basically every installable command-line Python tool. It is also available to your own projects: add a scripts entry mapping your-command to your-package colon your-function, install editable, and your-command becomes a real command in the venv that you can run without python dash m and without knowing the file path. The related python dash m package form does something similar without a declared script — it runs the package\'s dunder-main dot py — and the two can share the same main function.',
        aHi: 'Ek console script ek mapping hai, ek package ki pyproject dot toml mein ek scripts table ke tahat declare kiya, ek command naam se ek specific module mein ek specific function tak. Jab aap console scripts declare karne waala ek package pip install karte ho, installer sirf package copy nahi karta; ye har declared naam ke liye ek chhota executable bhi generate karta hai aur ise environment ki bin directory mein rakhta hai, jo environment active hone par aapke PATH par hai. Wo generated executable chhota hai: ye asal mein ek stub hai jo named module import karta hai aur named function call karta hai, phir jo bhi integer wo function lautaata hai use process exit code ki tarah exit karta hai. Toh shell par pytest type karna wo stub chalata hai, jo pytest ka module import karta hai aur iska main call karta hai. Ye black, ruff, flask, django-admin ke peechhe wahi mechanism hai. Ye aapke apne projects ke liye bhi available hai: ek scripts entry jodo, editable install karo, aur aapki command venv mein ek asli command ban jaati hai.',
      },
    ],

    exercises: [
      {
        task: 'Reproduce the fragile layout: a project root with `app.py` (does `import util`; `util.py` defines `def f(): return 7`) and `tests/test_app.py` (does `from app import ...`). Via subprocess, show `python app.py` from the root works but `python tests/test_app.py` fails with `ModuleNotFoundError`. Explain which directory is on `sys.path` in each case.',
        taskHi: 'Nazuk layout reproduce karo: ek project root `app.py` (`import util` kare; `util.py` `def f(): return 7` define kare) aur `tests/test_app.py` (`from app import ...` kare) ke saath. Subprocess se, dikhao root se `python app.py` kaam karta hai par `python tests/test_app.py` `ModuleNotFoundError` se fail hota hai. Samjhaao har case mein kaunsi directory `sys.path` par hai.',
        hint: 'Running `python app.py` puts the root (containing `util.py`) on `sys.path[0]`. Running `python tests/test_app.py` puts `tests/` on `sys.path[0]` — the root is absent, so `import app` fails.',
        hintHi: '`python app.py` chalana root (jismein `util.py` hai) ko `sys.path[0]` par rakhta hai. `python tests/test_app.py` chalana `tests/` ko `sys.path[0]` par rakhta hai — root gair-maujood hai, isliye `import app` fail hota hai.',
      },
      {
        task: 'Build a minimal `src/`-layout package `calckit` with `pyproject.toml` (name, version, hatchling build-system), `src/calckit/__init__.py`, and `src/calckit/ops.py` (`def mul(a, b): return a * b`). In a fresh venv, `pip install -e .`, then from an unrelated directory run `python -c "from calckit.ops import mul; print(mul(6, 7))"` -> `42`. Edit `ops.py` to `+ 1` and show the change is picked up with no reinstall.',
        taskHi: 'Ek minimal `src/`-layout package `calckit` banao `pyproject.toml`, `src/calckit/__init__.py`, aur `src/calckit/ops.py` (`def mul(a, b): return a * b`) ke saath. Ek fresh venv mein, `pip install -e .`, phir ek asambandhit directory se `python -c "from calckit.ops import mul; print(mul(6, 7))"` chalao -> `42`. `ops.py` ko `+ 1` mein edit karo aur dikhao badlaav bina reinstall uthaya jaata hai.',
        hint: 'The `[build-system]` table needs `requires = ["hatchling"]` and `build-backend = "hatchling.build"`. After `pip install -e .`, the venv links `src/`, so editing `src/calckit/ops.py` changes what `import calckit.ops` returns on the very next run.',
        hintHi: '`[build-system]` table ko `requires = ["hatchling"]` aur `build-backend = "hatchling.build"` chahiye. `pip install -e .` ke baad, venv `src/` link karta hai, isliye `src/calckit/ops.py` edit karna agle run par badalता hai.',
      },
      {
        task: 'Add `[project.scripts]` to the `calckit` package: `calc = "calckit.cli:main"`, where `cli.py`\'s `main()` reads `sys.argv[1:]` as `[a, op, b]`, computes, prints, returns 0. After `pip install -e .`, run the `calc` executable from the venv\'s bin dir with args `6 x 7` and confirm it prints `42` — no `python -m`, no path.',
        taskHi: '`calckit` package mein `[project.scripts]` jodo: `calc = "calckit.cli:main"`, jahaan `cli.py` ka `main()` `sys.argv[1:]` ko `[a, op, b]` ki tarah padhe, compute kare, print kare, 0 return kare. `pip install -e .` ke baad, venv ke bin dir se `calc` executable ko args `6 x 7` ke saath chalao aur confirm karo ye `42` print karta hai.',
        hint: 'The console script executable lands at `<venv>/bin/calc` (or `<venv>\\Scripts\\calc.exe`). `subprocess.run([that_path, "6", "x", "7"], capture_output=True, text=True)`. Map `"x"` to multiplication in `main`.',
        hintHi: 'Console script executable `<venv>/bin/calc` (ya `<venv>\\Scripts\\calc.exe`) par aata hai. `subprocess.run([that_path, "6", "x", "7"], capture_output=True, text=True)`. `main` mein `"x"` ko multiplication se map karo.',
      },
    ],

    keyTakeaways: [
      'Imports that resolve only because you launched from a particular directory are a latent bug — they break under a test runner, scheduler, CI, or different cwd. Make the package genuinely importable instead.',
      '`pip install -e .` (editable install): reads `pyproject.toml`, installs dependencies, and links your `src/` into the environment so `import myapp` works from anywhere AND source edits take effect with no reinstall.',
      '`pip install .` (no `-e`) copies a snapshot into `site-packages` — your later edits do nothing until you reinstall. Use `-e` for the project you are developing.',
      'Minimal `pyproject.toml`: `[project]` with `name`, `version`, `dependencies`; a `[build-system]` table (e.g. hatchling). That is enough for `pip install -e .`.',
      '`src/` layout (package in `src/myapp/`, not `./myapp/`) forces tests/tools to use the INSTALLED package — catching "passes locally, broken when built" bugs. Flat layout is fine for small projects.',
      '`[project.scripts] cmd = "pkg.module:func"` creates an executable `cmd` in the venv on install that calls `func`. This is how `pytest`, `black`, `django-admin` become commands.',
      '`python -m myapp` runs `src/myapp/__main__.py`. It and a console script can share one `main()`.',
      '`PYTHONPATH=dir` prepends to `sys.path` for a run — a stopgap for one-offs/containers, not a project\'s normal setup. A global `PYTHONPATH` in your shell rc silently corrupts imports across all projects.',
    ],
    keyTakeawaysHi: [
      'Imports jo sirf isliye resolve hote hain ki aapne ek khaas directory se launch kiya ek latent bug hain — wo ek test runner, scheduler, CI, ya alag cwd ke tahat tootते hain. Iske bajaye package ko sachmuch importable banao.',
      '`pip install -e .` (editable install): `pyproject.toml` padhta hai, dependencies install karta hai, aur aapki `src/` ko environment mein link karta hai taaki `import myapp` kahin se bhi kaam kare AUR source edits bina reinstall prabhaavi hon.',
      '`pip install .` (bina `-e`) ek snapshot `site-packages` mein copy karta hai — aapke baad ke edits reinstall karne tak kuch nahi karte. Jis project ko aap develop kar rahe ho uske liye `-e` istemal karo.',
      'Minimal `pyproject.toml`: `[project]` `name`, `version`, `dependencies` ke saath; ek `[build-system]` table. `pip install -e .` ke liye ye kaafi hai.',
      '`src/` layout (package `src/myapp/` mein, `./myapp/` mein nahi) tests/tools ko INSTALLED package istemal karne ko majboor karta hai — "locally pass, built par toota" bugs pakadta hai. Chote projects ke liye flat layout theek hai.',
      '`[project.scripts] cmd = "pkg.module:func"` install par venv mein ek executable `cmd` banaata hai jo `func` call karta hai. Aise `pytest`, `black`, `django-admin` commands ban jaate hain.',
      '`python -m myapp` `src/myapp/__main__.py` chalata hai. Ye aur ek console script ek `main()` share kar sakte hain.',
      '`PYTHONPATH=dir` ek run ke liye `sys.path` par prepend karta hai — one-offs/containers ke liye ek stopgap, ek project ka saamaanya setup nahi. Aapke shell rc mein ek global `PYTHONPATH` sabhi projects mein imports ko chupchaap corrupt karta hai.',
    ],
  },
];
