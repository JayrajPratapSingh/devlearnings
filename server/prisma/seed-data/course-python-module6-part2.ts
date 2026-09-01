/**
 * Python Complete Course — Module 6: Errors & Exceptions, lessons 4-6.
 *
 * Lesson 4: context managers — the `with` statement, why guaranteed cleanup
 *           beats `try/finally`, writing a class with `__enter__`/`__exit__`,
 *           `@contextlib.contextmanager`, `suppress`, `ExitStack`.
 * Lesson 5: exception chaining and tracebacks — implicit chaining ("During
 *           handling..."), `raise X from e` (explicit cause), `raise X from
 *           None` (suppress), reading a traceback, `logging.exception`.
 * Lesson 6: cleanup patterns and modern features — `try/except/else` for a
 *           narrow try, `ExceptionGroup` + `except*` (3.11+), retry/fallback,
 *           resource-leak patterns, framing for Django transactions/DRF.
 *
 * NOTE for future editors: same rules as the rest of this course. Every
 * backtick inside simple/simpleHi/content/contentHi is `\`` (inline code inside
 * ``` blocks included). Escape `$` before `{` inside template literals as `\${`.
 * Keep example OUTPUT ASCII-only. `examples` use `code` + `output`; run every
 * sample with `python`. Traceback examples use a canonical `example.py` path
 * placeholder (the real temp path differs per machine). Scan for Devanagari/
 * Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_6_PART2: CourseLesson[] = [
  {
    slug: 'py-context-managers',
    title: 'Context Managers: with, __enter__/__exit__, @contextmanager',
    titleHi: 'Context Managers: with, __enter__/__exit__, @contextmanager',
    description: 'Opening a file, a lock, or a database connection and having to remember to close it on every return path and every exception — and eventually forgetting one, leaking a handle in production. The `with` statement attaches setup and guaranteed teardown to a block: whatever happens inside, the cleanup runs. Writing your own is a two-method class or a one-decorator generator.',
    descriptionHi: 'Ek file, ek lock, ya ek database connection kholna aur har return path aur har exception par ise band karna yaad rakhna — aur aakhirkar ek bhoolना, production mein ek handle leak karna. `with` statement setup aur guaranteed teardown ko ek block se attach karता hai: andar jo bhi ho, cleanup chalता hai. Apna khud likhna ek do-method class ya ek one-decorator generator hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A checkout desk that will not let you leave the archive room without returning the file.** In a badly run archive, you sign a book out, take it to your desk, and are trusted to bring it back — and on a busy day, with three interruptions and a fire drill, you walk out with it still under your arm. In a well run one, the door itself is the mechanism: you cannot pass back through it without the file passing through the return slot, no matter how you leave — finished normally, called away, or carried out on a stretcher. The `with` statement is that door. `with open(path) as f:` runs the "sign out" step (`__enter__`), gives you the file as `f`, and registers the "return it" step (`__exit__`) to run on every way out of the block: the last line, an early `return`, a `break`, or an exception tearing through. You physically cannot forget it, because forgetting is not one of the exits the door allows. Writing your own context manager is just defining those two steps — what happens on the way in, what happens on the way out — either as a class with `__enter__` and `__exit__`, or as a generator where the single `yield` marks the boundary between "in" and "out".',
      hi: '**Ek checkout desk jo aapko file wapas kiye bina archive room chhodne nahi dega.** Ek bura chalta archive mein, aap ek book sign out karते ho, ise apne desk par le jाते ho, aur ispar bharosा kiya jाता hai ki aap ise wapas laाओge — aur ek vyast din, teen interruptions aur ek fire drill ke saath, aap ise abhi bhi apni baanh ke neeche lेकर chal jाते ho. Ek achhे chalते mein, darwaaza khud tantr hai: aap iske through wapas nahi ja sakte bina file return slot se guzre. `with` statement wo darwaaza hai. `with open(path) as f:` "sign out" step (`__enter__`) chalाता hai, aapko file `f` ki tarah deta hai, aur "ise wapas karो" step (`__exit__`) ko block se har raaste par chalne ko register karता hai. Apna khud ka context manager likhna bas un do steps ko define karna hai — andar jaते waqt kya hota hai, baahar jाते waqt kya hota hai.',
    },

    simple: `**The problem: cleanup on every path**

\`\`\`python
f = open("data.txt")
try:
    process(f.read())
    if some_condition:
        return                  # easy to forget f.close() here
finally:
    f.close()                   # the ONLY reliable place
\`\`\`

**The \`with\` statement does this for you**

\`\`\`python
with open("data.txt") as f:
    process(f.read())
    if some_condition:
        return                  # f is still closed
# f.close() has already run, on every exit path

# multiple context managers in one statement:
with open("in.txt") as src, open("out.txt", "w") as dst:
    dst.write(src.read())
\`\`\`

**Write your own — class form**

\`\`\`python
class timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self                         # value bound to 'as'
    def __exit__(self, exc_type, exc, tb):
        self.elapsed = time.perf_counter() - self.start
        print(f"took {self.elapsed:.4f}s")
        return False                        # False -> do NOT suppress an exception

with timer():
    do_work()
\`\`\`

**Write your own — generator form (simpler)**

\`\`\`python
from contextlib import contextmanager

@contextmanager
def timer():
    start = time.perf_counter()
    try:
        yield                               # everything before yield = __enter__
    finally:                                # everything after = __exit__ (runs even on error)
        print(f"took {time.perf_counter() - start:.4f}s")

with timer():
    do_work()
\`\`\`

\`\`\`
with EXPR as NAME:        NAME = EXPR.__enter__()
    body                  ... run the body ...
                          EXPR.__exit__(exc_type, exc_value, traceback)
                          -> called on EVERY exit: end of block, return, break, exception
                          -> if it returns a truthy value, a raised exception is SUPPRESSED
                             (almost always you return False / nothing)

class form:      def __enter__(self): ...        def __exit__(self, et, ev, tb): ...
generator form:  @contextmanager + a generator with exactly one 'yield' inside a try/finally

contextlib helpers:
  suppress(Error)      with suppress(FileNotFoundError): os.remove(p)   # ignore that error
  ExitStack()          dynamically manage a variable number of context managers
  nullcontext(x)       a no-op CM (useful as a default: cm = open(p) if p else nullcontext())
\`\`\``,

    simpleHi: `**Samasya: har path par cleanup**

\`\`\`python
f = open("data.txt")
try:
    process(f.read())
    if some_condition:
        return                  # yahaan f.close() bhoolना aasaan
finally:
    f.close()                   # ekmatra bharosemand jagah
\`\`\`

**\`with\` statement ye aapke liye karता hai**

\`\`\`python
with open("data.txt") as f:
    process(f.read())
    if some_condition:
        return                  # f phir bhi band hai
# f.close() pehle se chal chuka, har exit path par

# ek statement mein kai context managers:
with open("in.txt") as src, open("out.txt", "w") as dst:
    dst.write(src.read())
\`\`\`

**Apna khud likhो — class roop**

\`\`\`python
class timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self                         # 'as' se bandhi value
    def __exit__(self, exc_type, exc, tb):
        self.elapsed = time.perf_counter() - self.start
        print(f"took {self.elapsed:.4f}s")
        return False                        # False -> ek exception ko suppress NAHI karो
\`\`\`

**Apna khud likhो — generator roop (saral)**

\`\`\`python
from contextlib import contextmanager

@contextmanager
def timer():
    start = time.perf_counter()
    try:
        yield                               # yield se pehle sab kuch = __enter__
    finally:                                # baad mein sab kuch = __exit__ (error par bhi chalता hai)
        print(f"took {time.perf_counter() - start:.4f}s")

with timer():
    do_work()
\`\`\`

\`\`\`
with EXPR as NAME:        NAME = EXPR.__enter__()
    body                  ... body chalाओ ...
                          EXPR.__exit__(exc_type, exc_value, traceback)
                          -> HAR exit par call: block ka ant, return, break, exception
                          -> agar ye ek truthy value lautaता hai, ek raised exception SUPPRESS hota hai
                             (lagbhag hamesha aap False / kuch nahi lautaते ho)

class roop:      def __enter__(self): ...        def __exit__(self, et, ev, tb): ...
generator roop:  @contextmanager + ek generator ek try/finally ke andar bilkul ek 'yield' ke saath

contextlib helpers:
  suppress(Error)      with suppress(FileNotFoundError): os.remove(p)   # us error ko ignore karो
  ExitStack()          ek variable number ke context managers dynamically manage karो
  nullcontext(x)       ek no-op CM
\`\`\``,

    content: `## \`__exit__\`'s arguments and return value

\`\`\`python
def __exit__(self, exc_type, exc_value, traceback):
    # if the block finished normally: all three are None
    # if the block raised: exc_type is the class, exc_value the instance, traceback the tb
    if exc_type is not None:
        log.error("block failed with %s", exc_value)
    self.close()
    return False        # False/None -> the exception (if any) continues to propagate
                        # True -> the exception is SWALLOWED (rare; be very deliberate)
\`\`\`

\`__exit__\` always runs. It receives information about whether the block raised, so it can log or roll back differently on failure. Its return value decides whether a raised exception is suppressed — return \`False\` (or nothing) unless you specifically want to swallow the error, which is unusual.

## The generator form in detail

\`\`\`python
from contextlib import contextmanager

@contextmanager
def transaction(conn):
    conn.begin()
    try:
        yield conn                    # the value here is bound to 'as'
    except Exception:
        conn.rollback()               # runs if the block raised
        raise                         # re-raise so the caller still sees it
    else:
        conn.commit()                 # runs if the block succeeded
    finally:
        conn.release()                # always
\`\`\`

The single \`yield\` splits the function: code before it is \`__enter__\`, code after it (in the \`finally\`/\`except\`/\`else\`) is \`__exit__\`. The \`try\` around the \`yield\` is what lets you react to an exception from the \`with\` body. Exactly one \`yield\` — zero or two is an error.

## \`contextlib.suppress\`

\`\`\`python
from contextlib import suppress

# instead of:
try:
    os.remove(path)
except FileNotFoundError:
    pass

# write:
with suppress(FileNotFoundError):
    os.remove(path)
\`\`\`

\`suppress\` is a readable way to say "if this specific error happens, ignore it". Still specific — never \`suppress(Exception)\`.

## \`contextlib.ExitStack\` — a dynamic number of managers

\`\`\`python
from contextlib import ExitStack

with ExitStack() as stack:
    files = [stack.enter_context(open(p)) for p in paths]   # N files, all closed at block end
    # ... use files ...
# every file opened via enter_context is closed here, in reverse order
\`\`\`

Use \`ExitStack\` when the number of context managers is not known at write time, or when you want to conditionally add one.

## \`try/finally\` vs \`with\`

\`\`\`python
# these are equivalent:
lock.acquire()
try:
    critical_section()
finally:
    lock.release()

with lock:                # threading.Lock is a context manager
    critical_section()
\`\`\`

Prefer \`with\` when the resource has (or you can give it) a context-manager interface — it is shorter and impossible to get wrong. Use bare \`try/finally\` only for cleanup that does not correspond to a resource object (restoring a changed setting, say).

## What can be a context manager

Files, \`threading.Lock\`/\`RLock\`/\`Semaphore\`, \`socket\`, DB connections and cursors, \`subprocess.Popen\`, \`tempfile.TemporaryDirectory\`, \`decimal.localcontext\`, \`unittest.mock.patch\`, \`open()\`\'d anything, \`pytest.raises\`, Django\'s \`transaction.atomic\`, \`requests.Session\`. If a library gives you something to "open"/"start"/"acquire", check whether it supports \`with\`.`,

    contentHi: `## \`__exit__\` ke arguments aur return value

\`\`\`python
def __exit__(self, exc_type, exc_value, traceback):
    # agar block normal khatam hua: teenों None hain
    # agar block ne raise kiya: exc_type class hai, exc_value instance, traceback tb
    if exc_type is not None:
        log.error("block failed with %s", exc_value)
    self.close()
    return False        # False/None -> exception (agar koi) propagate karta rahता hai
                        # True -> exception NIGAL liya jाता hai (durlabh; bahut jaan-boojhkar)
\`\`\`

\`__exit__\` hamesha chalता hai. Ise jaankaari milती hai ki block ne raise kiya ya nahi, isliye ye failure par alag tarike se log ya roll back kar sakta hai. Iska return value tay karता hai ki ek raised exception suppress hota hai — \`False\` (ya kuch nahi) lautाओ jab tak aap vishesh roop se error nigalना na chahें.

## Generator roop vistar mein

\`\`\`python
from contextlib import contextmanager

@contextmanager
def transaction(conn):
    conn.begin()
    try:
        yield conn                    # yahaan value 'as' se bandhi hai
    except Exception:
        conn.rollback()               # chalता hai agar block ne raise kiya
        raise                         # re-raise taaki caller phir bhi dekhे
    else:
        conn.commit()                 # chalता hai agar block safal hua
    finally:
        conn.release()                # hamesha
\`\`\`

Akela \`yield\` function ko baantता hai: isse pehle code \`__enter__\` hai, iske baad code \`__exit__\` hai. \`yield\` ke aas-paas \`try\` wo hai jo aapko \`with\` body se ek exception par react karne deta hai. Bilkul ek \`yield\` — shoonya ya do ek error hai.

## \`contextlib.suppress\`

\`\`\`python
from contextlib import suppress

# iske bजाय:
try:
    os.remove(path)
except FileNotFoundError:
    pass

# likhो:
with suppress(FileNotFoundError):
    os.remove(path)
\`\`\`

\`suppress\` "agar ye specific error ho, ise ignore karो" kehne ka ek readable tarika hai. Phir bhi specific — kabhi \`suppress(Exception)\` nahi.

## \`contextlib.ExitStack\` — managers ki ek dynamic sankhya

\`\`\`python
from contextlib import ExitStack

with ExitStack() as stack:
    files = [stack.enter_context(open(p)) for p in paths]   # N files, sab block ant par band
    # ... files istemal karो ...
# har file jo enter_context ke zariye kholi gayi yahaan band hoती hai, ulte kram mein
\`\`\`

\`ExitStack\` istemal karो jab context managers ki sankhya write time par pata nahi, ya jab aap conditionally ek jodना chahते ho.

## \`try/finally\` vs \`with\`

\`\`\`python
# ye samaan hain:
lock.acquire()
try:
    critical_section()
finally:
    lock.release()

with lock:                # threading.Lock ek context manager hai
    critical_section()
\`\`\`

\`with\` prefer karो jab resource mein ek context-manager interface hai — ye chhota aur galat karna asambhav hai. Nange \`try/finally\` ko sirf us cleanup ke liye istemal karो jo ek resource object se mel nahi khाता.

## Kya ek context manager ho sakta hai

Files, \`threading.Lock\`, \`socket\`, DB connections aur cursors, \`subprocess.Popen\`, \`tempfile.TemporaryDirectory\`, \`unittest.mock.patch\`, \`pytest.raises\`, Django ka \`transaction.atomic\`, \`requests.Session\`. Agar ek library aapko kuch "open"/"start"/"acquire" karne ko deती hai, check karो ki ye \`with\` support karता hai.`,

    examples: [
      {
        title: 'with guarantees cleanup on return and on exception',
        titleHi: 'with return aur exception par cleanup guarantee karता hai',
        code: `class Resource:
    def __init__(self, name):
        self.name = name
    def __enter__(self):
        print(f"  open {self.name}")
        return self
    def __exit__(self, et, ev, tb):
        print(f"  close {self.name} (exception: {et.__name__ if et else None})")
        return False        # do not suppress

def use_and_return():
    with Resource("A") as r:
        print("  working")
        return "done"

def use_and_raise():
    with Resource("B") as r:
        print("  working")
        raise ValueError("boom")

print("-- normal + early return --")
print(use_and_return())
print("-- exception in block --")
try:
    use_and_raise()
except ValueError as e:
    print("  caught:", e)`,
        output: `-- normal + early return --
  open A
  working
  close A (exception: None)
done
-- exception in block --
  open B
  working
  close B (exception: ValueError)
  caught: boom`,
        explain: '`Resource.__exit__` runs on both paths: after the early `return "done"` (with `exc_type` = `None`) and when `ValueError` is raised (with `exc_type` = `ValueError`). Because `__exit__` returns `False`, the `ValueError` is not suppressed and still reaches the caller\'s `except`. The cleanup print always happens — that is the guarantee `with` provides.',
        explainHi: '`Resource.__exit__` dono paths par chalता hai: jaldi `return "done"` ke baad (`exc_type` = `None` ke saath) aur jab `ValueError` raise hota hai (`exc_type` = `ValueError` ke saath). Kyunki `__exit__` `False` lautaता hai, `ValueError` suppress nahi hota aur phir bhi caller ke `except` tak pahunchता hai. Cleanup print hamesha hota hai.',
      },
      {
        title: '@contextmanager: before yield = setup, after = teardown',
        titleHi: '@contextmanager: yield se pehle = setup, baad = teardown',
        code: `from contextlib import contextmanager

log = []

@contextmanager
def section(name):
    log.append(f"enter {name}")
    try:
        yield name.upper()
    except Exception as e:
        log.append(f"error in {name}: {e}")
        raise
    else:
        log.append(f"ok {name}")
    finally:
        log.append(f"exit {name}")

with section("build") as label:
    log.append(f"  doing work as {label}")

try:
    with section("deploy") as label:
        raise RuntimeError("no creds")
except RuntimeError:
    log.append("caught at top")

print("\\n".join(log))`,
        output: `enter build
  doing work as BUILD
ok build
exit build
enter deploy
error in deploy: no creds
exit deploy
caught at top`,
        explain: 'For `"build"`: code before `yield` runs (`enter build`), the body runs, then the `else` (`ok build`) and `finally` (`exit build`) run because the body succeeded. For `"deploy"`: the body raises, so the `except` branch runs (`error in deploy`), re-raises, and `finally` still runs (`exit deploy`); the re-raised `RuntimeError` reaches the outer `try`. The `yield` value (`name.upper()`) is what `as label` receives.',
        explainHi: '`"build"` ke liye: `yield` se pehle code chalता hai (`enter build`), body chalती hai, phir `else` (`ok build`) aur `finally` (`exit build`) chalते hain kyunki body safal hui. `"deploy"` ke liye: body raise karती hai, isliye `except` branch chalती hai (`error in deploy`), re-raise karती hai, aur `finally` phir bhi chalता hai; re-raised `RuntimeError` bahari `try` tak pahunchता hai.',
      },
      {
        title: 'suppress and ExitStack',
        titleHi: 'suppress aur ExitStack',
        code: `import os, tempfile
from contextlib import suppress, ExitStack

d = tempfile.mkdtemp()

# suppress: ignore one specific error, no try/except noise
with suppress(FileNotFoundError):
    os.remove(os.path.join(d, "never-existed.txt"))
print("suppress: removing a missing file did not raise")

# ExitStack: N context managers decided at runtime
paths = []
for i in range(3):
    p = os.path.join(d, f"f{i}.txt")
    open(p, "w").write(f"content {i}")
    paths.append(p)

with ExitStack() as stack:
    handles = [stack.enter_context(open(p)) for p in paths]
    print("opened", len(handles), "files")
    print("first bytes:", [h.read(9) for h in handles])
# all three closed here
print("all closed:", all(h.closed for h in handles))`,
        output: `suppress: removing a missing file did not raise
opened 3 files
first bytes: ['content 0', 'content 1', 'content 2']
all closed: True`,
        explain: '`with suppress(FileNotFoundError):` swallows exactly that error — cleaner than a `try/except: pass` for a one-liner. `ExitStack` lets you open a list of files whose length is only known at runtime and guarantees every one is closed when the block exits, in reverse order of opening. `all(h.closed ...)` confirms it.',
        explainHi: '`with suppress(FileNotFoundError):` bilkul us error ko nigal leta hai — ek one-liner ke liye `try/except: pass` se saaf. `ExitStack` aapko files ki ek list kholne deta hai jiski lambaई sirf runtime par pata hai aur guarantee karता hai ki har ek band ho jab block exit karta hai. `all(h.closed ...)` ise confirm karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `f = open("data.txt")
data = f.read()
# ... 30 lines ...
f.close()          # skipped entirely if anything above raises`,
        right: `with open("data.txt") as f:
    data = f.read()
    # ... 30 lines ...
# closed automatically, even if a line in the block raises`,
        why: 'Calling `.close()` at the end of a function is not reliable — an exception, an early `return`, or a `break` between `open` and `close` skips it, leaking the file handle. `with` binds the close to every exit path from the block. This applies to locks, connections, cursors, and anything else with acquire/release semantics.',
        whyHi: 'Ek function ke ant mein `.close()` call karna bharosemand nahi — `open` aur `close` ke beech ek exception, ek jaldi `return`, ya ek `break` ise skip karता hai, file handle leak karta hai. `with` close ko block se har exit path se bandhता hai.',
      },
      {
        wrong: `@contextmanager
def cm():
    setup()
    yield
    teardown()        # SKIPPED if the with-body raises`,
        right: `@contextmanager
def cm():
    setup()
    try:
        yield
    finally:
        teardown()    # runs even if the with-body raises`,
        why: 'Without a `try/finally` around the `yield`, an exception raised inside the `with` block propagates straight out of the generator at the `yield` point, and the code after `yield` never runs — so the cleanup is skipped exactly when it matters most. Always wrap the `yield` in `try/finally` (or `try/except/finally` if you need to react to the exception).',
        whyHi: '`yield` ke aas-paas `try/finally` ke bina, `with` block ke andar raise ek exception `yield` bindu par generator se seedhe baahar propagate hota hai, aur `yield` ke baad code kabhi nahi chalता — isliye cleanup bilkul tab skip hota hai jab ye sabse zyaada maayne rakhता hai. Hamesha `yield` ko `try/finally` mein wrap karो.',
      },
      {
        wrong: `class Quiet:
    def __enter__(self): return self
    def __exit__(self, et, ev, tb):
        return True           # swallows EVERY exception from the block`,
        right: `class Quiet:
    def __enter__(self): return self
    def __exit__(self, et, ev, tb):
        if et is not None:
            log.warning("suppressed %s", ev)
        return et is SpecificError   # suppress only the one you mean to`,
        why: 'A `__exit__` that returns `True` unconditionally makes the `with` block swallow all exceptions, including bugs — the same silent-swallow antipattern as `except Exception: pass`, hidden inside a context manager. Return `False`/`None` normally; only return `True` for the specific exception type you deliberately want to suppress.',
        whyHi: 'Ek `__exit__` jo bina shart `True` lautaता hai `with` block ko sab exceptions nigalने par majboor karता hai, bugs sameth — `except Exception: pass` jaisा hi silent-swallow antipattern, ek context manager ke andar chhupa. Saamaanya roop se `False`/`None` lautाओ; sirf us specific exception type ke liye `True` lautाओ jise aap jaan-boojhkar suppress karna chahते ho.',
      },
    ],

    realWorld: [
      {
        en: '**`with transaction.atomic():` is the Django idiom for "commit if the block succeeds, roll back if it raises"** — implemented as a context manager whose `__exit__` checks whether an exception occurred. Nesting them creates savepoints. `with connection.cursor() as c:` closes the cursor the same way.',
        hi: '**`with transaction.atomic():` "block safal ho to commit, raise ho to roll back" ke liye Django idiom hai** — ek context manager ki tarah implement jiska `__exit__` check karता hai ki ek exception hua ya nahi. Unhe nest karna savepoints banाता hai. `with connection.cursor() as c:` cursor ko usi tarah band karता hai.',
      },
      {
        en: '**`with pytest.raises(ValueError):` and `with mock.patch("mod.func") as m:`** are context managers central to testing — the `raises` block asserts an exception happened inside it; `patch` swaps an object on `__enter__` and restores it on `__exit__` no matter how the test ends.',
        hi: '**`with pytest.raises(ValueError):` aur `with mock.patch("mod.func") as m:`** testing ke kendra mein context managers hain — `raises` block assert karता hai ki iske andar ek exception hua; `patch` `__enter__` par ek object swap karता hai aur `__exit__` par restore karता hai chahe test kaise bhi khatam ho.',
      },
      {
        en: '**`@contextmanager` is how you write a reusable "setup + guaranteed teardown" helper** — a temp-config override, a timed block, a DB savepoint, a "change directory then change back". The generator form is the common choice because it reads top-to-bottom like the code it wraps.',
        hi: '**`@contextmanager` aise aap ek reusable "setup + guaranteed teardown" helper likhते ho** — ek temp-config override, ek timed block, ek DB savepoint. Generator roop aam chunaav hai kyunki ye us code ki tarah top-to-bottom padhता hai jise ye wrap karता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does the `with` statement do, and what is the contract of a context manager?',
        qHi: '`with` statement kya karता hai, aur ek context manager ka contract kya hai?',
        a: 'The with statement runs a block of code with a guaranteed setup step before it and a guaranteed teardown step after it, regardless of how the block exits. When you write with expression as name colon, Python evaluates the expression to get a context manager object, calls its dunder-enter method, and binds whatever that returns to name. Then it runs the body. When the body finishes — whether by reaching the end, by a return or break or continue, or by an exception being raised — Python calls the context manager\'s dunder-exit method. That call is the guarantee: the teardown happens on every exit path, which is exactly what makes with better than remembering to call close at the end of a function, because there is no path that skips it. The context manager contract is those two methods. dunder-enter takes no arguments beyond self and returns the value to bind with as, which is often the manager itself but can be anything, for example a file object or a database connection. dunder-exit takes three arguments describing any exception that is propagating out of the block: the exception type, the exception value, and the traceback. If the block exited normally, all three are None. dunder-exit can inspect them to behave differently on failure — a transaction manager commits when they are None and rolls back when they are not. Its return value matters: if dunder-exit returns a truthy value, Python treats the exception as handled and suppresses it, so it does not propagate; if it returns a falsy value, which includes returning nothing, any exception continues to propagate normally. You almost always want the falsy behaviour — swallowing exceptions from dunder-exit is the same silent-swallow antipattern as a broad except that passes. You can implement a context manager as a class with those two methods, or more concisely with the contextlib.contextmanager decorator on a generator that has exactly one yield inside a try-finally: everything before the yield is the enter logic, the yield value is what as receives, and the finally block is the exit logic.',
        aHi: 'with statement ek code block ko iske pehle ek guaranteed setup step aur iske baad ek guaranteed teardown step ke saath chalाता hai, chahe block kaise bhi exit kare. Jab aap with expression as name colon likhते ho, Python expression ko evaluate karके ek context manager object paata hai, iski dunder-enter method call karता hai, aur jo bhi wo lautaता hai use name se bind karता hai. Phir ye body chalाता hai. Jab body khatam hoती hai — chahe ant tak pahunchकर, ek return ya break se, ya ek exception raise hone se — Python context manager ki dunder-exit method call karता hai. Wo call guarantee hai. Context manager contract wo do methods hain. dunder-enter self ke alawa koi arguments nahi leti aur with as se bind karne ki value lautaती hai. dunder-exit teen arguments leti hai jo block se propagate ho rahे kisi exception ko describe karते hain. Agar block normal exit hua, teenों None hain. Iski return value maayne rakhती hai: agar dunder-exit ek truthy value lautaती hai, Python exception ko handled maanता hai aur ise suppress karता hai. Aap lagbhag hamesha falsy behaviour chahते ho.',
      },
      {
        q: 'How do you write a context manager with `@contextmanager`, and what is the one common bug?',
        qHi: 'Aap `@contextmanager` se ek context manager kaise likhते ho, aur ek aam bug kya hai?',
        a: 'You write a generator function — one that uses yield — and decorate it with contextlib.contextmanager. The generator must yield exactly once. Everything before the yield is the setup: it runs when the with block is entered, as if it were dunder-enter. The value you yield is what gets bound by the as clause. Then execution pauses at the yield while the with block body runs. When the body finishes, execution resumes right after the yield, and everything from there to the end of the generator is the teardown, as if it were dunder-exit. The critical detail, and the common bug, is how exceptions from the with body are delivered. If the body raises, that exception is thrown back into the generator at the point of the yield. So if you simply write setup, then yield, then teardown, with no protection, an exception from the body propagates out of the generator at the yield and the teardown code below it never executes. Your cleanup is skipped precisely in the failure case where it matters most — the file stays open, the lock stays held, the transaction is neither committed nor rolled back. The fix is to wrap the yield in a try with at least a finally: put the teardown in the finally so it runs whether the body succeeded or raised. If you also need to react to the exception — roll back on failure but commit on success — you use a full try-except-else-finally around the yield: except catches the exception thrown in, typically to do failure cleanup and then re-raise so the caller still sees it; else runs the success path; finally runs the unconditional cleanup. The other, smaller mistakes are yielding more than once, which raises a RuntimeError, and forgetting to re-raise in the except branch, which silently suppresses the exception.',
        aHi: 'Aap ek generator function likhते ho — ek jo yield istemal karता hai — aur ise contextlib.contextmanager se decorate karते ho. Generator ko bilkul ek baar yield karna chahiye. yield se pehle sab kuch setup hai: ye tab chalता hai jab with block mein pravesh kiya jाता hai. Jo value aap yield karते ho wo as clause dwara bind hoती hai. Phir execution yield par ruकता hai jabki with block body chalती hai. Jab body khatam hoती hai, execution yield ke turant baad phir shuru hota hai, aur wahaan se generator ke ant tak sab kuch teardown hai. Mahatvapurna vivaran, aur aam bug, ye hai ki with body se exceptions kaise deliver hote hain. Agar body raise karती hai, wo exception yield ke bindu par generator mein wapas thrown hota hai. Toh agar aap bस setup, phir yield, phir teardown likhते ho, bina suraksha, body se ek exception yield par generator se propagate hota hai aur iske neeche teardown code kabhi execute nahi hota. Fix yield ko ek try mein kam se kam ek finally ke saath wrap karna hai.',
      },
    ],

    exercises: [
      {
        task: 'Write a class-based context manager `changed_dir(path)` that `os.chdir`s into `path` on `__enter__` (saving the old cwd) and `os.chdir`s back on `__exit__`. `__exit__` must restore the directory even if the block raises (test with a block that raises, caught outside). Confirm `os.getcwd()` is back to the original afterward.',
        taskHi: 'Ek class-based context manager `changed_dir(path)` likhो jo `__enter__` par `path` mein `os.chdir` kare (purana cwd save karके) aur `__exit__` par wapas `os.chdir` kare. `__exit__` ko directory restore karni chahiye chahe block raise kare (ek block ke saath test karो jo raise kare, baahar caught). Confirm karो `os.getcwd()` baad mein original par wapas hai.',
        hint: '`__enter__`: `self.old = os.getcwd(); os.chdir(path); return self`. `__exit__`: `os.chdir(self.old); return False`. Because `__exit__` runs on the exception path too and returns `False`, the cwd is restored AND the exception still propagates.',
        hintHi: '`__enter__`: `self.old = os.getcwd(); os.chdir(path); return self`. `__exit__`: `os.chdir(self.old); return False`. Kyunki `__exit__` exception path par bhi chalता hai aur `False` lautaता hai, cwd restore hota hai AUR exception phir bhi propagate hota hai.',
      },
      {
        task: 'Write the same `changed_dir` as a `@contextmanager` generator. Put the `os.chdir` back in a `finally` so it runs on error. Verify: after `with changed_dir(tmp): raise ValueError()` (caught), `os.getcwd()` equals the original. Then break it (move the restore out of `finally`) and show the cwd is NOT restored on the error path.',
        taskHi: 'Wahi `changed_dir` ek `@contextmanager` generator ki tarah likhो. `os.chdir` back ko ek `finally` mein rakho taaki ye error par chalे. Verify karो: `with changed_dir(tmp): raise ValueError()` (caught) ke baad, `os.getcwd()` original ke barabar hai. Phir ise todो aur dikhाओ cwd error path par restore NAHI hota.',
        hint: '`old = os.getcwd(); os.chdir(path); try: yield finally: os.chdir(old)`. Without the `try/finally`, `raise ValueError()` in the body propagates out of the generator at `yield` and `os.chdir(old)` never runs.',
        hintHi: '`old = os.getcwd(); os.chdir(path); try: yield finally: os.chdir(old)`. `try/finally` ke bina, body mein `raise ValueError()` `yield` par generator se propagate hota hai aur `os.chdir(old)` kabhi nahi chalता.',
      },
      {
        task: 'Write `@contextmanager def open_all(paths)` that opens every path, `yield`s the list of file objects, and closes all of them in `finally` (even if one open fails midway — close the ones already opened). Use it to read the first character of three temp files. Then pass a non-existent path in the middle and show the already-opened files still get closed.',
        taskHi: '`@contextmanager def open_all(paths)` likhो jo har path kholे, file objects ki list `yield` kare, aur unhe `finally` mein band kare (agar ek open beech mein fail ho to bhi — pehle se kholе gaye band karो). Ise teen temp files ka pehla character padhने ko istemal karो. Phir beech mein ek non-existent path pass karो aur dikhाओ pehle se kholी gayi files phir bhi band hoती hain.',
        hint: '`opened = []; try: for p in paths: opened.append(open(p)); yield opened; finally: for f in opened: f.close()`. If `open(p)` raises, the `finally` still closes everything appended so far. (Or use `ExitStack` inside.)',
        hintHi: '`opened = []; try: for p in paths: opened.append(open(p)); yield opened; finally: for f in opened: f.close()`. Agar `open(p)` raise kare, `finally` phir bhi ab tak appended sab kuch band karता hai.',
      },
    ],

    keyTakeaways: [
      '`with EXPR as NAME:` runs `EXPR.__enter__()` (binding its result to `NAME`), runs the body, then ALWAYS runs `EXPR.__exit__(...)` — on normal exit, `return`/`break`, or exception.',
      '`with` replaces `try/finally` for resources: it is shorter and there is no exit path that can skip the cleanup. Use it for files, locks, connections, cursors, transactions, `mock.patch`, `pytest.raises`.',
      'Class form: `__enter__(self)` returns the `as` value; `__exit__(self, exc_type, exc_value, tb)` runs the teardown. `exc_type` is `None` on success. Return `False`/nothing to let exceptions propagate; `True` suppresses (rare).',
      'Generator form: `@contextmanager` + a generator with exactly ONE `yield` inside a `try`. Before `yield` = setup; `try/finally` around `yield` = teardown that runs even on error.',
      'THE `@contextmanager` BUG: no `try/finally` around `yield` means an exception from the `with` body skips all teardown code after `yield`. Always wrap `yield`.',
      '`contextlib.suppress(SpecificError)` is a clean `try/except SpecificError: pass`. Never `suppress(Exception)`.',
      '`contextlib.ExitStack` manages a runtime-variable number of context managers; `stack.enter_context(cm)` registers each for cleanup at block exit (reverse order).',
      'A `__exit__` (or generator teardown) that swallows all exceptions is the silent-swallow antipattern hidden in a context manager — suppress only the specific type you mean to.',
    ],
    keyTakeawaysHi: [
      '`with EXPR as NAME:` `EXPR.__enter__()` chalाता hai (iska result `NAME` se bind karके), body chalाता hai, phir HAMESHA `EXPR.__exit__(...)` chalाता hai — normal exit par, `return`/`break`, ya exception.',
      '`with` resources ke liye `try/finally` ki jagah leta hai: ye chhota hai aur koi exit path nahi jo cleanup skip kar sake. Ise files, locks, connections, cursors, transactions, `mock.patch`, `pytest.raises` ke liye istemal karो.',
      'Class roop: `__enter__(self)` `as` value lautaता hai; `__exit__(self, exc_type, exc_value, tb)` teardown chalाता hai. Success par `exc_type` `None` hai. Exceptions ko propagate hone dene ko `False`/kuch nahi lautाओ; `True` suppress karता hai (durlabh).',
      'Generator roop: `@contextmanager` + ek generator ek `try` ke andar bilkul EK `yield` ke saath. `yield` se pehle = setup; `yield` ke aas-paas `try/finally` = teardown jo error par bhi chalता hai.',
      '`@contextmanager` BUG: `yield` ke aas-paas `try/finally` nahi matlab `with` body se ek exception `yield` ke baad saara teardown code skip karता hai. Hamesha `yield` wrap karो.',
      '`contextlib.suppress(SpecificError)` ek saaf `try/except SpecificError: pass` hai. Kabhi `suppress(Exception)` nahi.',
      '`contextlib.ExitStack` context managers ki ek runtime-variable sankhya manage karता hai; `stack.enter_context(cm)` har ek ko block exit par cleanup ke liye register karता hai (ulta kram).',
      'Ek `__exit__` jo sab exceptions nigal leta hai ek context manager mein chhupa silent-swallow antipattern hai — sirf us specific type ko suppress karो jise aap chahते ho.',
    ],
  },

  {
    slug: 'py-exception-chaining-and-tracebacks',
    title: 'Exception Chaining and Reading Tracebacks',
    titleHi: 'Exception Chaining Aur Tracebacks Padhna',
    description: 'Catching a low-level `KeyError` and raising a friendly `ConfigError` instead — and losing all trace of where the `KeyError` actually happened, so the friendly error is now useless for debugging. Python links exceptions together: when you raise inside an `except`, the original is attached as the cause. `raise X from e` makes that link explicit; `from None` hides it; the traceback shows the whole chain.',
    descriptionHi: 'Ek low-level `KeyError` pakadna aur iske bजाय ek friendly `ConfigError` raise karna — aur us baat ka saara trace khona ki `KeyError` asal mein kahaan hua, isliye friendly error ab debugging ke liye bekaar hai. Python exceptions ko ek saath link karता hai: jab aap ek `except` ke andar raise karते ho, original cause ki tarah attach hota hai. `raise X from e` us link ko explicit banाता hai; `from None` ise chhupata hai; traceback poori chain dikhाता hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 5,

    analogy: {
      en: '**An incident report that either keeps or discards the original 911 call.** A dispatcher takes a panicked, technical call — "the transformer on pole 47 arced" — and needs to file a report a manager can act on: "power outage, sector 3". If the report simply replaces the call, the manager gets a clean summary but the crew sent to fix it has lost the one detail that tells them which pole and what failed. A good report attaches the original: "power outage, sector 3 — caused by: transformer arc, pole 47", so the summary is readable at the top and the specifics are one line down. Python does this automatically: raising a new exception while handling another attaches the original as context, and the traceback prints both, joined by a line explaining the relationship. `raise NewError(...) from original` states the link deliberately — "this was directly caused by that". `raise NewError(...) from None` is the rare case where the original truly is noise — an expected lookup miss you are translating into a domain error — and you suppress it to keep the report clean. Reading a traceback is reading this report bottom-up: the last line is what was raised, the lines above it are the call path that led there, and a `caused by` / `during handling` separator means there is a second report stacked underneath.',
      hi: '**Ek incident report jo ya to original 911 call rakhती hai ya phenk deti hai.** Ek dispatcher ek ghabraya, technical call leता hai — "pole 47 par transformer arc hua" — aur ek report file karni hai jispar ek manager act kar sake: "power outage, sector 3". Agar report bस call ko replace karती hai, manager ko ek saaf summary milता hai par ise theek karne bheji gayi crew ne wo ek detail kho di jo unhe bataता hai kaunsा pole. Ek achhी report original attach karती hai: "power outage, sector 3 — caused by: transformer arc, pole 47". Python ye apne aap karता hai: ek doosre ko handle karते waqt ek naya exception raise karna original ko context ki tarah attach karता hai. `raise NewError(...) from original` link ko jaan-boojhkar batाता hai. `raise NewError(...) from None` wo durlabh case hai jahaan original sachmuch shor hai. Ek traceback padhna is report ko bottom-up padhna hai.',
    },

    simple: `**Implicit chaining: raise inside except**

\`\`\`python
def load(cfg):
    try:
        return cfg["timeout"]
    except KeyError:
        raise ConfigError("config is missing 'timeout'")   # no 'from'

# traceback shows BOTH, joined by:
#   During handling of the above exception, another exception occurred:
\`\`\`

Python automatically remembers the \`KeyError\` and prints it above the \`ConfigError\`.

**Explicit chaining: \`raise X from e\`**

\`\`\`python
def load(cfg):
    try:
        return cfg["timeout"]
    except KeyError as e:
        raise ConfigError("config is missing 'timeout'") from e

# traceback joins them with:
#   The above exception was the direct cause of the following exception:
\`\`\`

\`from e\` says "I am deliberately translating this specific error" — clearer intent than the implicit form.

**Suppress the context: \`raise X from None\`**

\`\`\`python
def get_user(uid):
    try:
        return _cache[uid]
    except KeyError:
        raise UserNotFound(uid) from None    # the KeyError is an implementation detail

# traceback shows only UserNotFound -- no KeyError noise
\`\`\`

**Reading a traceback (bottom to top)**

\`\`\`
Traceback (most recent call last):
  File "app.py", line 20, in <module>       <- where it started
    main()
  File "app.py", line 14, in main
    result = process(data)                  <- the call chain
  File "app.py", line 8, in process
    return data["score"] / count
ZeroDivisionError: division by zero         <- WHAT was raised (read this first)
\`\`\`

\`\`\`
- read the LAST line first: exception type and message
- then read the frames bottom-to-top: the deepest call is just above the error,
  your entry point is at the top
- "During handling of the above exception..."  -> implicit chain (raised in an except)
- "The above exception was the direct cause..." -> explicit chain (raise X from e)
- inside 'except', a bare 'raise' re-raises with the ORIGINAL traceback intact
- logging.exception(msg) / log.error(msg, exc_info=True) logs the full traceback
- traceback.format_exc() gives the traceback as a string
\`\`\``,

    simpleHi: `**Implicit chaining: except ke andar raise**

\`\`\`python
def load(cfg):
    try:
        return cfg["timeout"]
    except KeyError:
        raise ConfigError("config is missing 'timeout'")   # koi 'from' nahi

# traceback DONO dikhाता hai, isse joda:
#   During handling of the above exception, another exception occurred:
\`\`\`

Python apne aap \`KeyError\` yaad rakhता hai aur ise \`ConfigError\` ke upar print karता hai.

**Explicit chaining: \`raise X from e\`**

\`\`\`python
def load(cfg):
    try:
        return cfg["timeout"]
    except KeyError as e:
        raise ConfigError("config is missing 'timeout'") from e

# traceback unhe isse jodता hai:
#   The above exception was the direct cause of the following exception:
\`\`\`

\`from e\` kehta hai "main jaan-boojhkar is specific error ko translate kar raha hoon".

**Context suppress karो: \`raise X from None\`**

\`\`\`python
def get_user(uid):
    try:
        return _cache[uid]
    except KeyError:
        raise UserNotFound(uid) from None    # KeyError ek implementation detail hai

# traceback sirf UserNotFound dikhाता hai -- koi KeyError shor nahi
\`\`\`

**Ek traceback padhna (bottom se top)**

\`\`\`
Traceback (most recent call last):
  File "app.py", line 20, in <module>       <- kahaan shuru hua
    main()
  File "app.py", line 14, in main
    result = process(data)                  <- call chain
  File "app.py", line 8, in process
    return data["score"] / count
ZeroDivisionError: division by zero         <- KYA raise hua (ise pehle padhो)
\`\`\`

\`\`\`
- AAKHRI line pehle padhो: exception type aur message
- phir frames bottom-to-top padhो: sabse gehri call error ke bilkul upar,
  aapka entry point top par
- "During handling of the above exception..."  -> implicit chain (ek except mein raise)
- "The above exception was the direct cause..." -> explicit chain (raise X from e)
- 'except' ke andar, ek nanga 'raise' ORIGINAL traceback bरकrar rakhकर re-raise karता hai
- logging.exception(msg) / log.error(msg, exc_info=True) poora traceback log karता hai
- traceback.format_exc() traceback ko ek string ki tarah deता hai
\`\`\``,

    content: `## \`__cause__\` and \`__context__\`

Every exception object carries links to related exceptions:

\`\`\`python
try:
    try:
        1 / 0
    except ZeroDivisionError as e:
        raise ValueError("wrapped") from e
except ValueError as v:
    v.__cause__          # the ZeroDivisionError -- set by 'from e'
    v.__context__       # also the ZeroDivisionError -- set automatically
    v.__suppress_context__   # True if 'from None' was used
\`\`\`

- \`__context__\` is set automatically whenever you raise while handling another exception (implicit chaining).
- \`__cause__\` is set only by \`raise X from Y\`, and it also sets \`__suppress_context__ = True\` so the traceback shows the \`from\` relationship, not the implicit one.
- \`raise X from None\` sets \`__cause__ = None\` and \`__suppress_context__ = True\`, hiding the chain entirely.

## When to chain, wrap, or re-raise

\`\`\`python
# 1. re-raise unchanged -- you only wanted to log or clean up
try:
    charge(card)
except PaymentError:
    metrics.increment("payment.failed")
    raise                          # same exception, original traceback

# 2. wrap with 'from e' -- translate a low-level error to your domain
try:
    row = db.execute(sql).fetchone()
except sqlite3.OperationalError as e:
    raise RepositoryError("could not read user") from e

# 3. wrap with 'from None' -- the low-level error is a pure implementation detail
try:
    return self._index[key]
except KeyError:
    raise LookupMiss(key) from None
\`\`\`

Wrapping (case 2) is the common one at layer boundaries: callers of your repository should not need to know it uses SQLite, but a developer debugging still wants the \`OperationalError\` in the traceback, so keep the cause.

## Reading a real traceback

\`\`\`
Traceback (most recent call last):
  File "example.py", line 4, in <module>
    load_config("missing.json")
  File "example.py", line 2, in load_config
    return json.load(open(path))
FileNotFoundError: [Errno 2] No such file or directory: 'missing.json'

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "example.py", line 9, in <module>
    start()
  File "example.py", line 7, in start
    raise StartupError("config load failed")
StartupError: config load failed
\`\`\`

Read the **bottom** traceback's last line first: \`StartupError: config load failed\` is what propagated out. The separator \`During handling...\` tells you it was raised while handling the \`FileNotFoundError\` shown above — so the *root* cause is the missing file, in \`load_config\`. Two blocks, two "last lines", linked by the separator.

## \`raise\` vs \`raise e\` inside \`except\`

\`\`\`python
except ValueError as e:
    raise           # re-raises e with its full original traceback
except ValueError as e:
    raise e         # also works, but historically could truncate the traceback;
                    # 'raise' with no argument is the idiom for a plain re-raise
\`\`\`

## Logging exceptions

\`\`\`python
try:
    risky()
except Exception:
    logger.exception("risky() failed")          # ERROR level + full traceback
    # equivalent: logger.error("risky() failed", exc_info=True)
    raise                                        # if the caller still needs to handle it

import traceback
traceback.print_exc()                            # print the current traceback to stderr
s = traceback.format_exc()                       # ... or capture it as a string
\`\`\`

\`logger.exception(...)\` must be called from inside an \`except\` block — it reads the current exception. It records the message *and* the traceback, which is what you want in production logs.`,

    contentHi: `## \`__cause__\` aur \`__context__\`

Har exception object sambandhit exceptions ke links le jाता hai:

\`\`\`python
try:
    try:
        1 / 0
    except ZeroDivisionError as e:
        raise ValueError("wrapped") from e
except ValueError as v:
    v.__cause__          # ZeroDivisionError -- 'from e' dwara set
    v.__context__       # bhi ZeroDivisionError -- apne aap set
    v.__suppress_context__   # True agar 'from None' istemal hua
\`\`\`

- \`__context__\` apne aap set hota hai jab bhi aap ek doosre exception ko handle karते waqt raise karते ho (implicit chaining).
- \`__cause__\` sirf \`raise X from Y\` dwara set hota hai, aur ye \`__suppress_context__ = True\` bhi set karता hai taaki traceback \`from\` sambandh dikhाए.
- \`raise X from None\` \`__cause__ = None\` aur \`__suppress_context__ = True\` set karता hai, chain ko poori tarah chhupata hai.

## Kab chain, wrap, ya re-raise karें

\`\`\`python
# 1. abदला re-raise -- aap sirf log ya cleanup karna chahते the
try:
    charge(card)
except PaymentError:
    metrics.increment("payment.failed")
    raise                          # wahi exception, original traceback

# 2. 'from e' se wrap -- ek low-level error ko apne domain mein translate karो
try:
    row = db.execute(sql).fetchone()
except sqlite3.OperationalError as e:
    raise RepositoryError("could not read user") from e

# 3. 'from None' se wrap -- low-level error ek shuddh implementation detail hai
try:
    return self._index[key]
except KeyError:
    raise LookupMiss(key) from None
\`\`\`

Wrapping (case 2) layer boundaries par aam hai: aapke repository ke callers ko jaanne ki zaroorat nahi ki ye SQLite istemal karता hai, par ek developer debug karते waqt phir bhi traceback mein \`OperationalError\` chahता hai, isliye cause rakho.

## Ek asli traceback padhna

\`\`\`
Traceback (most recent call last):
  File "example.py", line 4, in <module>
    load_config("missing.json")
  File "example.py", line 2, in load_config
    return json.load(open(path))
FileNotFoundError: [Errno 2] No such file or directory: 'missing.json'

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "example.py", line 9, in <module>
    start()
  File "example.py", line 7, in start
    raise StartupError("config load failed")
StartupError: config load failed
\`\`\`

**Bottom** traceback ki aakhri line pehle padhो: \`StartupError: config load failed\` wo hai jo baahar propagate hua. Separator \`During handling...\` aapko batाता hai ki ye upar dikhाए \`FileNotFoundError\` ko handle karते waqt raise hua — isliye *root* cause missing file hai, \`load_config\` mein.

## \`except\` ke andar \`raise\` vs \`raise e\`

\`\`\`python
except ValueError as e:
    raise           # e ko iske poore original traceback ke saath re-raise karता hai
except ValueError as e:
    raise e         # bhi kaam karता hai, par 'raise' bina argument plain re-raise ke liye idiom hai
\`\`\`

## Exceptions log karna

\`\`\`python
try:
    risky()
except Exception:
    logger.exception("risky() failed")          # ERROR level + poora traceback
    # samaan: logger.error("risky() failed", exc_info=True)
    raise                                        # agar caller ko phir bhi handle karna hai

import traceback
traceback.print_exc()                            # current traceback stderr par print karो
s = traceback.format_exc()                       # ... ya ise ek string ki tarah capture karो
\`\`\`

\`logger.exception(...)\` ko ek \`except\` block ke andar se call karna chahiye — ye current exception padhता hai. Ye message *aur* traceback record karता hai.`,

    examples: [
      {
        title: 'Implicit vs explicit vs suppressed chaining',
        titleHi: 'Implicit vs explicit vs suppressed chaining',
        code: `class ConfigError(Exception):
    pass

def implicit(cfg):
    try:
        return cfg["key"]
    except KeyError:
        raise ConfigError("missing key")            # implicit: __context__ set

def explicit(cfg):
    try:
        return cfg["key"]
    except KeyError as e:
        raise ConfigError("missing key") from e     # explicit: __cause__ set

def suppressed(cfg):
    try:
        return cfg["key"]
    except KeyError:
        raise ConfigError("missing key") from None  # __suppress_context__

for fn in (implicit, explicit, suppressed):
    try:
        fn({})
    except ConfigError as ce:
        print(f"{fn.__name__}:")
        print(f"  __context__ is KeyError: {isinstance(ce.__context__, KeyError)}")
        print(f"  __cause__ is KeyError:   {isinstance(ce.__cause__, KeyError)}")
        print(f"  __suppress_context__:    {ce.__suppress_context__}")`,
        output: `implicit:
  __context__ is KeyError: True
  __cause__ is KeyError:   False
  __suppress_context__:    False
explicit:
  __context__ is KeyError: True
  __cause__ is KeyError:   True
  __suppress_context__:    True
suppressed:
  __context__ is KeyError: True
  __cause__ is KeyError:   False
  __suppress_context__:    True
`,
        explain: 'Raising inside `except` always sets `__context__` to the original (`KeyError`) — that never goes away. `from e` additionally sets `__cause__` and flips `__suppress_context__` so the traceback prints "direct cause of". `from None` sets `__suppress_context__` without a cause, so the traceback shows only the `ConfigError`. The `KeyError` is still on `__context__` for programmatic inspection.',
        explainHi: '`except` ke andar raise karna hamesha `__context__` ko original (`KeyError`) set karता hai — wo kabhi nahi jाता. `from e` atirikt roop se `__cause__` set karता hai aur `__suppress_context__` palat deta hai taaki traceback "direct cause of" print kare. `from None` bina cause ke `__suppress_context__` set karता hai. `KeyError` phir bhi programmatic inspection ke liye `__context__` par hai.',
      },
      {
        title: 'Reading a chained traceback',
        titleHi: 'Ek chained traceback padhna',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
script = os.path.join(d, "example.py")
open(script, "w").write(textwrap.dedent("""
    class StartupError(Exception):
        pass
    def load_config(path):
        return open(path).read()
    def start():
        try:
            load_config("missing.json")
        except FileNotFoundError:
            raise StartupError("config load failed")
    start()
""").lstrip())

r = subprocess.run([sys.executable, script], cwd=d, capture_output=True, text=True)
# strip machine-specific bits (absolute dir, caret marker lines) to show the shape:
tb = r.stderr.replace(d + os.sep, "").replace(d, "")
tb = "\\n".join(l for l in tb.splitlines() if l.strip()[:1] not in ("~", "^"))
print(tb)`,
                output: `Traceback (most recent call last):
  File "example.py", line 7, in start
    load_config("missing.json")
  File "example.py", line 4, in load_config
    return open(path).read()
FileNotFoundError: [Errno 2] No such file or directory: 'missing.json'

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "example.py", line 10, in <module>
    start()
  File "example.py", line 9, in start
    raise StartupError("config load failed")
StartupError: config load failed
`,
        explain: 'Two traceback blocks. Read the bottom one first: `StartupError: config load failed` is what escaped. The `During handling...` separator says it was raised while handling the exception in the top block — `FileNotFoundError` for `missing.json`, thrown in `load_config`. So the real fix is the missing file; the `StartupError` is just the wrapper. (This example runs a fixed script named `example.py` in a subprocess and strips the machine-specific absolute path and the `~~~^^^` caret lines so the shape is stable; a raw traceback in your terminal shows the full path and carets.)',
        explainHi: 'Do traceback blocks. Bottom wala pehle padhो: `StartupError: config load failed` wo hai jo bacha, `start` line 12 par raise. `During handling...` separator kehta hai ye top block mein exception ko handle karते waqt raise hua — `missing.json` ke liye `FileNotFoundError`, `load_config` mein gehra thrown. Toh asli fix missing file hai.',
      },
      {
        title: 'Re-raise to log without swallowing; logging.exception',
        titleHi: 'Nigale bina log karne ko re-raise; logging.exception',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
script = os.path.join(d, "example.py")
open(script, "w").write(textwrap.dedent("""
    import logging, sys
    logging.basicConfig(level=logging.ERROR,
                        format="%(levelname)s:%(name)s:%(message)s", stream=sys.stdout)
    log = logging.getLogger("svc")
    def db_write(record):
        raise ConnectionError("db unreachable")
    def save(record):
        try:
            db_write(record)
        except ConnectionError:
            log.exception("save(%r) failed", record)   # logs message + full traceback
            raise                                      # caller still sees the failure
    try:
        save({"id": 1})
    except ConnectionError as e:
        print("caller handled:", e)
""").lstrip())

r = subprocess.run([sys.executable, script], cwd=d, capture_output=True, text=True)
out = r.stdout.replace(d + os.sep, "").replace(d, "")
out = "\\n".join(l for l in out.splitlines() if l.strip()[:1] not in ("~", "^"))
print(out, end="")`,
                output: `ERROR:svc:save({'id': 1}) failed
Traceback (most recent call last):
  File "example.py", line 9, in save
    db_write(record)
  File "example.py", line 6, in db_write
    raise ConnectionError("db unreachable")
ConnectionError: db unreachable
caller handled: db unreachable
`,
        explain: '`log.exception(...)` (called inside the `except`) records both the message and the full traceback at ERROR level — exactly what you want in production logs. The bare `raise` afterward re-raises the same `ConnectionError` with its original traceback, so the caller still gets to handle it. Catch-log-reraise: you get the log AND the exception keeps propagating.',
        explainHi: '`log.exception(...)` (`except` ke andar call kiya) message aur poora traceback dono ERROR level par record karता hai — bilkul jo aap production logs mein chahते ho. Baad mein nanga `raise` wahi `ConnectionError` iske original traceback ke saath re-raise karता hai, isliye caller phir bhi ise handle karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `try:
    value = registry[name]
except KeyError:
    raise PluginError(f"no plugin named {name}")   # implicit chain, but noisy`,
        right: `try:
    value = registry[name]
except KeyError:
    raise PluginError(f"no plugin named {name}") from None
# the KeyError is an internal lookup detail -- 'from None' keeps the traceback clean`,
        why: 'When the caught exception is a pure implementation detail (a dict lookup that missed), the implicit "During handling of the above exception" chain adds a confusing `KeyError` block to every traceback. `from None` suppresses it, showing only the meaningful `PluginError`. Use `from None` for lookup-miss translations; use `from e` when the original error is genuinely informative.',
        whyHi: 'Jab pakda gaya exception ek shuddh implementation detail hai (ek dict lookup jo miss hua), implicit "During handling of the above exception" chain har traceback mein ek uljhaने waala `KeyError` block jodता hai. `from None` ise suppress karता hai. Lookup-miss translations ke liye `from None` istemal karो; jab original error sachmuch jaankaari deता hai to `from e`.',
      },
      {
        wrong: `try:
    parse(data)
except ValueError as e:
    raise ParseError(str(e))              # loses the original traceback and cause`,
        right: `try:
    parse(data)
except ValueError as e:
    raise ParseError("could not parse input") from e   # keeps the cause + traceback`,
        why: 'Building a new exception from `str(e)` and raising it plain discards where the `ValueError` came from — the new traceback starts at your `raise` line, not at the real failure. `raise ParseError(...) from e` links the original so the traceback shows both the wrapper and the root cause with its full stack.',
        whyHi: '`str(e)` se ek naya exception banana aur ise plain raise karna is baat ko phenk deta hai ki `ValueError` kahaan se aaya — naya traceback aapki `raise` line par shuru hota hai, asli failure par nahi. `raise ParseError(...) from e` original ko link karता hai taaki traceback wrapper aur root cause dono dikhाए.',
      },
      {
        wrong: `try:
    do_thing()
except Exception as e:
    logging.error("failed: " + str(e))   # message only -- no traceback, no line numbers`,
        right: `try:
    do_thing()
except Exception:
    logging.exception("do_thing failed")  # message + full traceback
    raise                                 # if the caller must know`,
        why: '`logging.error("failed: " + str(e))` logs one line with no traceback, so you know *what* but not *where*. `logging.exception(msg)` (only valid inside an `except`) attaches the full traceback. And catching to log without re-raising silently swallows the error unless you deliberately meant to recover.',
        whyHi: '`logging.error("failed: " + str(e))` bina traceback ke ek line log karता hai, isliye aap *kya* jaanते ho par *kahaan* nahi. `logging.exception(msg)` (sirf ek `except` ke andar valid) poora traceback attach karता hai. Aur re-raise kiye bina log karne ko pakadna chupchaap error nigal leta hai.',
      },
    ],

    realWorld: [
      {
        en: '**`raise X from e` at layer boundaries is standard in Django/DRF** — an ORM `IntegrityError` wrapped as a domain `DuplicateEmail`, a `requests` error wrapped as a service-specific `UpstreamError`. Sentry and other error trackers display the full chain, so the wrapper is readable and the root cause is still one click away.',
        hi: '**Layer boundaries par `raise X from e` Django/DRF mein standard hai** — ek ORM `IntegrityError` ek domain `DuplicateEmail` ki tarah wrapped, ek `requests` error ek service-specific `UpstreamError` ki tarah. Sentry poori chain dikhाता hai.',
      },
      {
        en: '**`logging.exception(...)` in every `except` block that logs** is the production pattern — it captures the traceback into your log aggregator (CloudWatch, Datadog, ELK) so an on-call engineer can see exactly where it failed without reproducing it. `logging.error(str(e))` is a common mistake that loses that.',
        hi: '**Har `except` block mein jo log karता hai `logging.exception(...)`** production pattern hai — ye traceback ko aapke log aggregator mein capture karता hai taaki ek on-call engineer bilkul dekh sake kahaan fail hua. `logging.error(str(e))` ek aam galti hai jo use kho deti hai.',
      },
      {
        en: '**Reading a chained traceback bottom-up, following the `During handling` / `direct cause` separators, is the core debugging skill** — the actual bug is almost always in the *first* (topmost) traceback block\'s last line, and the lower blocks are the wrappers your own code added.',
        hi: '**Ek chained traceback ko bottom-up padhna, `During handling` / `direct cause` separators follow karके, core debugging kaushal hai** — asli bug lagbhag hamesha *pehle* (sabse upar) traceback block ki aakhri line mein hai, aur neeche ke blocks aapke apne code ke jode wrappers hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is exception chaining? Explain `__context__`, `__cause__`, and `raise X from e` vs `from None`.',
        qHi: 'Exception chaining kya hai? `__context__`, `__cause__`, aur `raise X from e` vs `from None` samjhaao.',
        a: 'Exception chaining is Python linking a newly raised exception to the exception that was being handled when it was raised, so a traceback can show the full story rather than just the last error. Every exception object has two relevant attributes. Double-underscore context is set automatically: whenever you raise an exception inside an except block, Python records the exception you were handling as the new one\'s context. This is implicit chaining, and in the traceback it appears with the separator line "During handling of the above exception, another exception occurred". Double-underscore cause is set only when you explicitly write raise NewError from original. Setting a cause also sets a third attribute, double-underscore suppress-context, to True, which changes the traceback separator to "The above exception was the direct cause of the following exception" — a stronger statement that you are deliberately translating one error into another. The practical difference between the implicit form and raise from e is mostly intent and traceback wording; both keep the original reachable. The important third option is raise NewError from None. This sets cause to None and suppress-context to True, which tells Python to print no chain at all — only the new exception. You use it when the caught exception is a pure implementation detail that would only add noise: the classic case is catching a KeyError from an internal dictionary lookup and raising a domain-level NotFound; the KeyError tells a caller nothing useful, so you suppress it. The rule of thumb: re-raise unchanged with a bare raise if you only wanted to log or clean up; wrap with from e at a layer boundary when the lower-level error is still informative for whoever debugs it; wrap with from None when the lower-level error is noise. Note that the original is still on double-underscore context even after from None, so it remains available for programmatic inspection even though it is hidden from the printed traceback.',
        aHi: 'Exception chaining Python ka ek naye raise kiye exception ko us exception se link karna hai jo raise hone par handle ho raha tha, taaki ek traceback poori kahani dikhा sake. Har exception object mein do sambandhit attributes hain. Double-underscore context apne aap set hota hai: jab bhi aap ek except block ke andar ek exception raise karते ho, Python us exception ko record karता hai jise aap handle kar rahे the. Ye implicit chaining hai, aur traceback mein "During handling of the above exception" separator ke saath dikhता hai. Double-underscore cause sirf tab set hota hai jab aap spasht roop se raise NewError from original likhते ho. Teesra vikalp raise NewError from None hai. Ye koi chain print na karne ko kehta hai. Aap ise tab istemal karते ho jab pakda gaya exception ek shuddh implementation detail hai. Niyam: bare raise se abदला re-raise karो agar aap sirf log karna chahते the; ek layer boundary par from e se wrap karो jab lower-level error phir bhi jaankaari deता hai; from None se wrap karो jab lower-level error shor hai.',
      },
      {
        q: 'How do you read a traceback, especially a chained one?',
        qHi: 'Aap ek traceback kaise padhते ho, khaskar ek chained?',
        a: 'A single traceback is printed with the header "Traceback (most recent call last)", then a series of frames, then a final line. The final line is the most important: it names the exception type and its message, and it is what you read first to know what actually went wrong. The frames above it are the call stack at the moment of the error, printed oldest first, deepest last. So the top frame is your entry point — the line that started the chain of calls — and the frame just above the final error line is where the exception was actually raised. Each frame shows the file, line number, and function name, plus the source line, and recent Python versions add caret markers underneath pointing at the exact sub-expression. You read the frames bottom-up when debugging: start at the deepest frame, which is closest to the error, and work upward only as far as you need to understand how execution got there. For a chained traceback there are two or more of these blocks separated by one of two sentences. "During handling of the above exception, another exception occurred" means the lower exception was raised implicitly while an except block was handling the upper one. "The above exception was the direct cause of the following exception" means someone wrote raise from, deliberately translating the upper exception into the lower one. In both cases the reading order is the same: the block printed last, at the bottom, is the exception that actually propagated out of the program. The block or blocks above it are the causes or contexts. The real bug is very often in the topmost block\'s final line — that is the original failure — and the lower blocks are wrappers that your own code added at layer boundaries. So for a chained traceback: find the bottommost final line to see what escaped, then scan up through the separators to the topmost final line to see what originally failed, then use that block\'s frames to locate the code.',
        aHi: 'Ek akela traceback "Traceback (most recent call last)" header ke saath print hota hai, phir frames ki ek series, phir ek antim line. Antim line sabse mahatvapurna hai: ye exception type aur iska message naam deती hai, aur ise aap pehle padhते ho. Iske upar frames error ke pal call stack hain, sabse purana pehle, sabse gehra aakhri. Toh top frame aapka entry point hai, aur antim error line ke bilkul upar frame wo hai jahaan exception asal mein raise hua. Debug karते waqt aap frames bottom-up padhते ho. Ek chained traceback ke liye do ya zyaada aise blocks hain jo do vakyों mein se ek se alag hote hain. "During handling of the above exception" matlab lower exception implicitly raise hua. "The above exception was the direct cause" matlab kisi ne raise from likha. Dono cases mein padhने ka kram wahi hai: neeche print kiya block wo exception hai jo asal mein program se propagate hua. Asli bug aksar sabse upar wale block ki antim line mein hai.',
      },
    ],

    exercises: [
      {
        task: 'Write `parse_port(s)` that does `int(s)` and raises `ConfigError(f"invalid port: {s!r}")`. Do it three ways: (a) plain `raise` (implicit chain), (b) `from e`, (c) `from None`. For each, catch the `ConfigError` and print `type(ce.__context__).__name__`, `type(ce.__cause__).__name__`, and `ce.__suppress_context__`.',
        taskHi: '`parse_port(s)` likhो jo `int(s)` kare aur `ConfigError(f"invalid port: {s!r}")` raise kare. Ise teen tarikon se karो: (a) plain `raise` (implicit chain), (b) `from e`, (c) `from None`. Har ek ke liye, `ConfigError` pakdो aur `type(ce.__context__).__name__`, `type(ce.__cause__).__name__`, aur `ce.__suppress_context__` print karो.',
        hint: 'All three set `__context__` to `ValueError`. Only `from e` sets `__cause__` to `ValueError`. Both `from e` and `from None` set `__suppress_context__` to `True`; plain `raise` leaves it `False`.',
        hintHi: 'Teenों `__context__` ko `ValueError` set karते hain. Sirf `from e` `__cause__` ko `ValueError` set karता hai. `from e` aur `from None` dono `__suppress_context__` ko `True` set karते hain; plain `raise` ise `False` chhodता hai.',
      },
      {
        task: 'Write a 3-level call: `main()` calls `step()` calls `inner()`, and `inner()` does `[][5]` (IndexError). In `step()`, catch it and `raise PipelineError("step failed") from e`. In `main()`, catch `PipelineError` and use `traceback.format_exception(e)` (or print `e.__cause__`) to show the original `IndexError` and the line it happened on.',
        taskHi: 'Ek 3-level call likhो: `main()` `step()` call karता hai `inner()` call karता hai, aur `inner()` `[][5]` kare (IndexError). `step()` mein, ise pakdो aur `raise PipelineError("step failed") from e`. `main()` mein, `PipelineError` pakdो aur original `IndexError` dikhाने ko `e.__cause__` print karो.',
        hint: '`e.__cause__` is the `IndexError`. `"".join(traceback.format_exception(type(e), e, e.__traceback__))` gives the full chained traceback as a string, showing both the `PipelineError` and the `IndexError` with its frame in `inner`.',
        hintHi: '`e.__cause__` `IndexError` hai. `"".join(traceback.format_exception(type(e), e, e.__traceback__))` poora chained traceback ek string ki tarah deता hai.',
      },
      {
        task: 'Write `save_all(records, writer)` that calls `writer(r)` for each record. When `writer` raises, log it with `logging.exception(f"failed to save {r}")` (configure logging to a `StringIO` or just to stderr), then `raise` to stop the batch. Test with a `writer` that raises on the 2nd record — show the first is saved, the log has a traceback, and the exception propagates.',
        taskHi: '`save_all(records, writer)` likhो jo har record ke liye `writer(r)` call kare. Jab `writer` raise kare, ise `logging.exception(f"failed to save {r}")` se log karो, phir batch rokने ko `raise`. Test karो ek `writer` ke saath jo 2nd record par raise kare — dikhाओ pehla save hua, log mein ek traceback hai, aur exception propagate hota hai.',
        hint: '`for r in records: try: writer(r); saved.append(r) except Exception: logging.exception("failed to save %r", r); raise`. The bare `raise` re-raises with the original traceback; `logging.exception` (inside the except) captures it.',
        hintHi: '`for r in records: try: writer(r); saved.append(r) except Exception: logging.exception("failed to save %r", r); raise`. Nanga `raise` original traceback ke saath re-raise karता hai; `logging.exception` ise capture karता hai.',
      },
    ],

    keyTakeaways: [
      'Raising inside an `except` block automatically chains: the original is stored on `__context__` and the traceback prints it above, joined by "During handling of the above exception, another exception occurred".',
      '`raise X from e` sets `__cause__` and prints "The above exception was the direct cause of the following exception" — use it at layer boundaries where the low-level error is still informative for debugging.',
      '`raise X from None` suppresses the chain in the traceback (`__suppress_context__ = True`) — use it when the caught exception is a pure implementation detail (an internal lookup miss). The original is still on `__context__`.',
      'Read a traceback: LAST line first (exception type + message), then frames bottom-to-top (deepest call just above the error, entry point at the top).',
      'Chained traceback: multiple blocks separated by "During handling..." or "direct cause...". The bug is usually in the TOPMOST block\'s last line; lower blocks are your wrappers.',
      'Inside `except`, a bare `raise` re-raises the current exception with its original traceback intact. Prefer it over `raise e` for a plain re-raise.',
      '`logging.exception(msg)` (only valid inside an `except`) logs the message AND the full traceback. `logging.error(str(e))` loses the traceback — do not use it for exceptions.',
      'Catch-log-continue without re-raising silently swallows the error. If the caller needs to know, end with `raise` or `raise Wrapped(...) from e`.',
    ],
    keyTakeawaysHi: [
      'Ek `except` block ke andar raise karna apne aap chain karता hai: original `__context__` par store hota hai aur traceback ise upar print karता hai, "During handling of the above exception, another exception occurred" se joda.',
      '`raise X from e` `__cause__` set karता hai aur "The above exception was the direct cause of the following exception" print karता hai — ise layer boundaries par istemal karो jahaan low-level error phir bhi debugging ke liye jaankaari deता hai.',
      '`raise X from None` traceback mein chain suppress karता hai (`__suppress_context__ = True`) — ise tab istemal karो jab pakda gaya exception ek shuddh implementation detail hai. Original phir bhi `__context__` par hai.',
      'Ek traceback padhो: AAKHRI line pehle (exception type + message), phir frames bottom-to-top (sabse gehri call error ke bilkul upar, entry point top par).',
      'Chained traceback: kai blocks "During handling..." ya "direct cause..." se alag. Bug aam taur par SABSE UPAR block ki aakhri line mein hai; neeche ke blocks aapke wrappers hain.',
      '`except` ke andar, ek nanga `raise` current exception ko iske original traceback ke saath re-raise karता hai. Plain re-raise ke liye ise `raise e` par prefer karो.',
      '`logging.exception(msg)` (sirf ek `except` ke andar valid) message AUR poora traceback log karता hai. `logging.error(str(e))` traceback kho deta hai — exceptions ke liye ise istemal mat karो.',
      'Re-raise kiye bina catch-log-continue chupchaap error nigal leta hai. Agar caller ko jaanna hai, `raise` ya `raise Wrapped(...) from e` se khatam karो.',
    ],
  },

  {
    slug: 'py-cleanup-patterns-and-exception-groups',
    title: 'Cleanup Patterns, Retries, and ExceptionGroup',
    titleHi: 'Cleanup Patterns, Retries, Aur ExceptionGroup',
    description: 'The remaining exception patterns you meet in real code: keeping the `try` block down to the one line that can fail so `else` carries the rest, retrying a flaky operation without catching bugs, falling back through alternatives, and — new in Python 3.11 — handling several exceptions raised together (from concurrent tasks) with `ExceptionGroup` and `except*`.',
    descriptionHi: 'Asli code mein aapko milne waale baaki exception patterns: `try` block ko us ek line tak rakhna jo fail ho sakti hai taaki `else` baaki le jाए, ek flaky operation retry karna bina bugs pakde, vikalpon ke zariye fallback karna, aur — Python 3.11 mein naya — ek saath raise kiye kai exceptions (concurrent tasks se) ko `ExceptionGroup` aur `except*` se handle karna.',
    difficulty: 'HARD',
    duration: 22,
    order: 6,

    analogy: {
      en: '**A pit crew with three refinements over "just fix the car".** First: the mechanic touching the wheel gun is doing exactly one job — everything else (jack down, driver signal, tyre inspection) is handed off to others, because if the wheel gun sticks you know instantly that the gun is the problem, not the jack. That is the narrow-`try`-with-`else` habit: one fallible operation in `try`, the follow-up in `else`. Second: a bolt that does not catch on the first pull gets two more attempts before the crew chief is told the bolt is stripped — but a *cross-threaded* bolt (the wrong kind of wrong) is reported immediately, not retried, because retrying a real defect just wastes the pit stop. Third: when four tyres are changed at once and two of them have problems, the report to the crew chief is not "a problem occurred" — it is "front-left: valve leak; rear-right: bead not seated", both, in one structured message, so both get addressed in this stop rather than one now and one next lap. That combined report is an `ExceptionGroup`, and `except*` is the crew chief reading it: "give me every valve-leak issue" and "give me every seating issue" as separate handled piles, even though they arrived together.',
      hi: '**Ek pit crew "bस car theek karो" par teen refinements ke saath.** Pehla: wheel gun chhoone waala mechanic bilkul ek kaam kar raha hai — baaki sab kuch doosron ko handoff, kyunki agar wheel gun atak jाए to aap turant jaanते ho ki gun samasya hai. Ye narrow-`try`-with-`else` aadat hai: `try` mein ek fallible operation, follow-up `else` mein. Doosra: ek bolt jo pehli pull par nahi catch karता use crew chief ko batाने se pehle do aur attempts milते hain — par ek *cross-threaded* bolt turant report hota hai, retry nahi, kyunki ek asli defect retry karna bस pit stop barbaad karता hai. Teesra: jab chaar tyres ek saath badle jाते hain aur do mein samasya hai, crew chief ko report "ek samasya hui" nahi hai — ye "front-left: valve leak; rear-right: bead not seated", dono, ek structured message mein. Wo combined report ek `ExceptionGroup` hai, aur `except*` crew chief ise padhता hai.',
    },

    simple: `**1. Narrow \`try\`, follow-up in \`else\`**

\`\`\`python
# the try block should be the ONE operation that can raise:
try:
    resp = client.get(url)          # only this raises the errors we handle
except (TimeoutError, ConnectionError):
    return cached_value
else:
    return resp.json()["data"]      # a KeyError here is a bug, NOT caught above
\`\`\`

**2. Retry a flaky operation (but never a bug)**

\`\`\`python
import time

def with_retry(fn, *, retries=3, delay=0.5, on=(ConnectionError, TimeoutError)):
    for attempt in range(1, retries + 1):
        try:
            return fn()
        except on as e:                     # only the "transient" types
            if attempt == retries:
                raise
            time.sleep(delay * attempt)     # back off
    # a ValueError from fn() is NOT in 'on' -> propagates immediately, no retry
\`\`\`

**3. Fallback through alternatives**

\`\`\`python
def load_config():
    for loader in (load_from_env, load_from_file, load_defaults):
        try:
            return loader()
        except ConfigNotFound:
            continue                        # try the next source
    raise ConfigError("no config source available")
\`\`\`

**4. Several exceptions at once: \`ExceptionGroup\` + \`except*\` (Python 3.11+)**

\`\`\`python
try:
    async with asyncio.TaskGroup() as tg:   # if 2 tasks fail, you get BOTH
        tg.create_task(fetch("a"))
        tg.create_task(fetch("b"))
        tg.create_task(fetch("c"))
except* ConnectionError as eg:
    print("connection failures:", len(eg.exceptions))
except* ValueError as eg:
    print("value errors:", len(eg.exceptions))
\`\`\`

\`\`\`
narrow try:   one fallible line in 'try', the rest in 'else'
              -> an error in the follow-up is a real bug, not swallowed

retry:        loop; catch ONLY the transient exception types; re-raise on the last
              attempt; back off between tries; never put a broad 'except' here

fallback:     try each alternative; on its specific "not available" exception, move on;
              raise your own error only after all alternatives fail

ExceptionGroup (3.11+):  a container holding multiple exceptions raised together
except* Type:            handles the matching sub-exceptions; can match several 'except*'
                         clauses for one group; the leftover re-raises as a smaller group
raise ExceptionGroup("msg", [e1, e2])   to raise one yourself
\`\`\``,

    simpleHi: `**1. Narrow \`try\`, follow-up \`else\` mein**

\`\`\`python
# try block wo EK operation hona chahiye jo raise kar sakti hai:
try:
    resp = client.get(url)          # sirf ye wo errors raise karता hai jo hum handle karते hain
except (TimeoutError, ConnectionError):
    return cached_value
else:
    return resp.json()["data"]      # yahaan ek KeyError ek bug hai, upar NAHI pakda
\`\`\`

**2. Ek flaky operation retry karो (par kabhi ek bug nahi)**

\`\`\`python
import time

def with_retry(fn, *, retries=3, delay=0.5, on=(ConnectionError, TimeoutError)):
    for attempt in range(1, retries + 1):
        try:
            return fn()
        except on as e:                     # sirf "transient" types
            if attempt == retries:
                raise
            time.sleep(delay * attempt)     # back off
    # fn() se ek ValueError 'on' mein NAHI hai -> turant propagate, koi retry nahi
\`\`\`

**3. Vikalpon ke zariye fallback**

\`\`\`python
def load_config():
    for loader in (load_from_env, load_from_file, load_defaults):
        try:
            return loader()
        except ConfigNotFound:
            continue                        # agla source try karो
    raise ConfigError("no config source available")
\`\`\`

**4. Ek saath kai exceptions: \`ExceptionGroup\` + \`except*\` (Python 3.11+)**

\`\`\`python
try:
    async with asyncio.TaskGroup() as tg:   # agar 2 tasks fail hon, aapko DONO milते hain
        tg.create_task(fetch("a"))
        tg.create_task(fetch("b"))
        tg.create_task(fetch("c"))
except* ConnectionError as eg:
    print("connection failures:", len(eg.exceptions))
except* ValueError as eg:
    print("value errors:", len(eg.exceptions))
\`\`\`

\`\`\`
narrow try:   'try' mein ek fallible line, baaki 'else' mein
              -> follow-up mein ek error ek asli bug hai, nigala nahi

retry:        loop; SIRF transient exception types pakdो; aakhri attempt par re-raise;
              tries ke beech back off; yahaan ek chauda 'except' kabhi mat rakho

fallback:     har vikalp try karो; iske specific "not available" exception par, aage badhо;
              apna error sirf tab raise karो jab sab vikalp fail hon

ExceptionGroup (3.11+):  ek container jo ek saath raise kiye kai exceptions rakhता hai
except* Type:            matching sub-exceptions handle karता hai; ek group ke liye kai
                         'except*' clauses match kar sakti hain
raise ExceptionGroup("msg", [e1, e2])   khud ek raise karne ko
\`\`\``,

    content: `## The narrow-\`try\` + \`else\` pattern in full

\`\`\`python
def get_price(product_id):
    try:
        raw = api.fetch(f"/products/{product_id}")     # network -- can time out / 404
    except NotFound:
        return None
    except TimeoutError:
        raise PriceServiceUnavailable() from None

    # everything from here runs only on a successful fetch, and is NOT protected
    # by the handlers above -- a bug here surfaces as a bug:
    data = raw.json()
    return Decimal(data["price"]) * (1 - data["discount"])
\`\`\`

Without \`else\` (or the "code after the try" style shown here), you would either widen the \`try\` — risking a \`KeyError\` from \`data["price"]\` being mistaken for a \`NotFound\` — or nest another \`try\`. Keeping the fallible call alone in \`try\` and the processing after it is the cleanest form.

## Retry: the rules

\`\`\`python
def retry(fn, *, attempts=3, base_delay=0.2, retry_on=(ConnectionError,), max_delay=5):
    last = None
    for i in range(attempts):
        try:
            return fn()
        except retry_on as e:
            last = e
            if i == attempts - 1:
                raise                                   # exhausted -> propagate the last
            time.sleep(min(base_delay * 2 ** i, max_delay))   # exponential backoff
    raise last          # unreachable, but keeps type-checkers happy
\`\`\`

- **Catch only transient types** in \`retry_on\` — network errors, \`429\`/\`503\` responses. A \`ValueError\` or \`KeyError\` is a bug; retrying it wastes time and hides it.
- **Re-raise on the final attempt** — do not return \`None\` or a default; the caller must know it failed.
- **Back off** between attempts (exponential is standard) so you do not hammer a struggling service.
- **Cap the delay** and the attempt count.

## Fallback / graceful degradation

\`\`\`python
def get_avatar(user):
    try:
        return cdn.fetch(user.avatar_key)
    except CDNError:
        pass
    try:
        return generate_identicon(user.id)
    except Exception:
        return DEFAULT_AVATAR_BYTES        # last-resort default, always works
\`\`\`

Each level catches its *own* failure mode and moves to the next. The final level must not be able to fail. Do not collapse this into one \`except Exception\` — you want each stage's error handled where it happens.

## \`ExceptionGroup\` and \`except*\` (Python 3.11+)

When multiple operations run and more than one can fail — concurrent tasks, a batch validated all at once — a single exception cannot represent "these three things went wrong". \`ExceptionGroup\` is a container:

\`\`\`python
errors = []
for item in batch:
    try:
        validate(item)
    except ValidationError as e:
        errors.append(e)
if errors:
    raise ExceptionGroup("batch validation failed", errors)
\`\`\`

\`except*\` handles subgroups by type:

\`\`\`python
try:
    run_batch()
except* ValidationError as eg:
    # eg is an ExceptionGroup containing ONLY the ValidationErrors
    report_invalid([e.field for e in eg.exceptions])
except* PermissionError as eg:
    # a separate handler for the permission failures in the same group
    alert_security(eg.exceptions)
\`\`\`

Unlike normal \`except\`, **multiple \`except*\` clauses can all run** for one group — each peels off the exceptions matching its type. Anything unmatched re-raises as a smaller \`ExceptionGroup\`. You cannot mix \`except\` and \`except*\` in the same \`try\`.

\`asyncio.TaskGroup\` (3.11+) raises an \`ExceptionGroup\` if several of its tasks fail — that is the main place you meet this in application code.

## Resource-leak checklist

\`\`\`
- opened a file / socket / connection / cursor?      -> 'with', or try/finally
- acquired a lock / semaphore?                       -> 'with', or try/finally
- started a subprocess / thread / task?              -> ensure it is joined/terminated
- changed global state (settings, cwd, signal)?      -> restore in finally / a context manager
- registered a callback / signal handler?            -> unregister in finally
\`\`\``,

    contentHi: `## Narrow-\`try\` + \`else\` pattern poora

\`\`\`python
def get_price(product_id):
    try:
        raw = api.fetch(f"/products/{product_id}")     # network -- time out / 404 ho sakta hai
    except NotFound:
        return None
    except TimeoutError:
        raise PriceServiceUnavailable() from None

    # yahaan se sab kuch sirf ek safal fetch par chalता hai, aur upar ke handlers dwara
    # SURAKSHIT NAHI hai -- yahaan ek bug ek bug ki tarah dikhता hai:
    data = raw.json()
    return Decimal(data["price"]) * (1 - data["discount"])
\`\`\`

\`else\` ke bina, aap ya to \`try\` chauda karते — \`data["price"]\` se ek \`KeyError\` ko \`NotFound\` samajhne ka jokhim — ya ek aur \`try\` nest karते. Fallible call ko akela \`try\` mein aur processing iske baad rakhna sabse saaf roop hai.

## Retry: niyam

\`\`\`python
def retry(fn, *, attempts=3, base_delay=0.2, retry_on=(ConnectionError,), max_delay=5):
    last = None
    for i in range(attempts):
        try:
            return fn()
        except retry_on as e:
            last = e
            if i == attempts - 1:
                raise                                   # khatam -> aakhri propagate karो
            time.sleep(min(base_delay * 2 ** i, max_delay))   # exponential backoff
    raise last
\`\`\`

- **\`retry_on\` mein sirf transient types pakdो** — network errors, \`429\`/\`503\` responses. Ek \`ValueError\` ya \`KeyError\` ek bug hai; ise retry karna samay barbaad karता hai aur ise chhupata hai.
- **Antim attempt par re-raise karो** — \`None\` ya ek default mat lautाओ; caller ko jaanna hai ki ye fail hua.
- **Attempts ke beech back off karो** (exponential standard hai).
- **Delay aur attempt count cap karो.**

## Fallback / graceful degradation

\`\`\`python
def get_avatar(user):
    try:
        return cdn.fetch(user.avatar_key)
    except CDNError:
        pass
    try:
        return generate_identicon(user.id)
    except Exception:
        return DEFAULT_AVATAR_BYTES        # last-resort default, hamesha kaam karता hai
\`\`\`

Har level apna failure mode pakadता hai aur agle par jाता hai. Antim level fail nahi ho sakta. Ise ek \`except Exception\` mein mat samेtो.

## \`ExceptionGroup\` aur \`except*\` (Python 3.11+)

Jab kai operations chalते hain aur ek se zyaada fail ho sakte hain — concurrent tasks, ek batch ek saath validated — ek akela exception "ye teen cheezein galat hui" represent nahi kar sakta. \`ExceptionGroup\` ek container hai:

\`\`\`python
errors = []
for item in batch:
    try:
        validate(item)
    except ValidationError as e:
        errors.append(e)
if errors:
    raise ExceptionGroup("batch validation failed", errors)
\`\`\`

\`except*\` subgroups ko type se handle karता hai:

\`\`\`python
try:
    run_batch()
except* ValidationError as eg:
    # eg ek ExceptionGroup hai jismein SIRF ValidationErrors hain
    report_invalid([e.field for e in eg.exceptions])
except* PermissionError as eg:
    alert_security(eg.exceptions)
\`\`\`

Saamaanya \`except\` ke ulte, **ek group ke liye kai \`except*\` clauses sab chal sakti hain** — har ek apne type se matching exceptions nikalती hai. Koi bhi unmatched ek chhote \`ExceptionGroup\` ki tarah re-raise hota hai. Aap usi \`try\` mein \`except\` aur \`except*\` mix nahi kar sakte.

\`asyncio.TaskGroup\` (3.11+) ek \`ExceptionGroup\` raise karता hai agar iske kai tasks fail hon — wo mukhya jagah hai jahaan aap ise application code mein milते ho.

## Resource-leak checklist

\`\`\`
- ek file / socket / connection / cursor kholी?      -> 'with', ya try/finally
- ek lock / semaphore acquire kiya?                  -> 'with', ya try/finally
- ek subprocess / thread / task shuru kiya?          -> sunishchit karो ye joined/terminated hai
- global state badla (settings, cwd, signal)?        -> finally / ek context manager mein restore karो
- ek callback / signal handler register kiya?        -> finally mein unregister karो
\`\`\``,

    examples: [
      {
        title: 'Retry only transient errors; a bug propagates immediately',
        titleHi: 'Sirf transient errors retry karो; ek bug turant propagate hota hai',
        code: `import time

def retry(fn, *, attempts=3, retry_on=(ConnectionError,)):
    for i in range(attempts):
        try:
            return fn()
        except retry_on as e:
            print(f"  attempt {i+1} failed ({type(e).__name__}); retrying" if i < attempts-1
                  else f"  attempt {i+1} failed; giving up")
            if i == attempts - 1:
                raise
            time.sleep(0.01)

# a transient failure that recovers on the 3rd try:
calls = {"n": 0}
def flaky():
    calls["n"] += 1
    if calls["n"] < 3:
        raise ConnectionError("temporary")
    return "ok"

print("flaky ->", retry(flaky))
print("calls made:", calls["n"])

# a real bug: NOT in retry_on, so no retries, propagates on the first call
def buggy():
    return {"a": 1}["b"]        # KeyError

try:
    retry(buggy)
except KeyError as e:
    print("buggy -> KeyError", e, "(propagated immediately, 0 retries)")`,
        output: `  attempt 1 failed (ConnectionError); retrying
  attempt 2 failed (ConnectionError); retrying
flaky -> ok
calls made: 3
buggy -> KeyError 'b' (propagated immediately, 0 retries)`,
        explain: '`flaky` raises `ConnectionError` — which IS in `retry_on` — so it is retried, and succeeds on the third attempt. `buggy` raises `KeyError`, which is NOT in `retry_on`, so the `except retry_on` clause does not match and the `KeyError` propagates out of `retry` on the very first call. Retrying a bug would just waste attempts and delay the crash.',
        explainHi: '`flaky` `ConnectionError` raise karता hai — jo `retry_on` mein HAI — isliye ise retry kiya jाता hai, aur teesre attempt par safal hota hai. `buggy` `KeyError` raise karता hai, jo `retry_on` mein NAHI hai, isliye `except retry_on` clause match nahi karता aur `KeyError` pehli hi call par `retry` se propagate hota hai.',
      },
      {
        title: 'Fallback chain: each stage handles its own failure',
        titleHi: 'Fallback chain: har stage apna failure handle karता hai',
        code: `class SourceUnavailable(Exception):
    pass

def from_cache(key, cache):
    if key not in cache:
        raise SourceUnavailable("cache miss")
    return f"cache:{cache[key]}"

def from_db(key, db):
    if key not in db:
        raise SourceUnavailable("not in db")
    return f"db:{db[key]}"

def from_default(key):
    return f"default:{key}"

def lookup(key, cache, db):
    for source in (
        lambda: from_cache(key, cache),
        lambda: from_db(key, db),
        lambda: from_default(key),
    ):
        try:
            return source()
        except SourceUnavailable:
            continue
    raise RuntimeError("unreachable")   # from_default never raises

cache = {"a": 1}
db = {"a": 10, "b": 20}
for k in ["a", "b", "c"]:
    print(f"{k} -> {lookup(k, cache, db)}")`,
        output: `a -> cache:1
b -> db:20
c -> default:c`,
        explain: '`"a"` is in the cache -> first source wins. `"b"` is not cached but is in the db -> the `SourceUnavailable` from `from_cache` is caught, the loop continues, `from_db` succeeds. `"c"` is in neither -> both raise `SourceUnavailable`, the loop reaches `from_default`, which cannot fail. Each stage catches only its own "not available" signal.',
        explainHi: '`"a"` cache mein hai -> pehla source jeetता hai. `"b"` cached nahi par db mein hai -> `from_cache` se `SourceUnavailable` pakda jाता hai, loop continue karता hai, `from_db` safal hota hai. `"c"` kisi mein nahi -> dono `SourceUnavailable` raise karते hain, loop `from_default` tak pahunchता hai, jo fail nahi ho sakta.',
      },
      {
        title: 'ExceptionGroup and except* handle several failures together',
        titleHi: 'ExceptionGroup aur except* kai failures ek saath handle karते hain',
        code: `def validate_all(items):
    errors = []
    for i, item in enumerate(items):
        try:
            if not isinstance(item, dict):
                raise TypeError(f"item {i} is not a dict")
            if "id" not in item:
                raise ValueError(f"item {i} missing 'id'")
        except (TypeError, ValueError) as e:
            errors.append(e)
    if errors:
        raise ExceptionGroup("validation failed", errors)
    return "all valid"

batch = [{"id": 1}, "oops", {"name": "x"}, {"id": 2}, 42]

try:
    validate_all(batch)
except* ValueError as eg:
    print("value errors:", [str(e) for e in eg.exceptions])
except* TypeError as eg:
    print("type errors: ", [str(e) for e in eg.exceptions])`,
        output: `value errors: ["item 2 missing 'id'"]
type errors:  ['item 1 is not a dict', 'item 4 is not a dict']
`,
        explain: '`validate_all` collects every failure into a list and raises them together as one `ExceptionGroup` — the caller sees all three problems, not just the first. `except* ValueError` and `except* TypeError` BOTH run: each pulls the matching exceptions out of the group. Contrast a plain `except` where only the first matching clause runs. This is how `asyncio.TaskGroup` surfaces multiple failed tasks.',
        explainHi: '`validate_all` har failure ko ek list mein collect karता hai aur unhe ek saath ek `ExceptionGroup` ki tarah raise karता hai — caller teenों samasyaayein dekhता hai, sirf pehli nahi. `except* ValueError` aur `except* TypeError` DONO chalते hain: har ek group se matching exceptions nikalता hai. Ek plain `except` ke विpreet jahaan sirf pehli matching clause chalती hai.',
      },
    ],

    mistakes: [
      {
        wrong: `for attempt in range(3):
    try:
        return risky_call()
    except Exception:              # catches bugs too
        time.sleep(1)             # and silently retries them 3 times`,
        right: `for attempt in range(3):
    try:
        return risky_call()
    except (ConnectionError, TimeoutError) as e:   # transient only
        if attempt == 2:
            raise
        time.sleep(2 ** attempt)`,
        why: 'A retry loop that catches `Exception` will retry a `KeyError`, an `AttributeError`, a `TypeError` — all bugs — three times, adding delay and three identical tracebacks in the logs before finally failing. Retry only the specific transient exceptions; let everything else fail on the first attempt.',
        whyHi: 'Ek retry loop jo `Exception` pakadता hai ek `KeyError`, ek `AttributeError` — sab bugs — teen baar retry karega, delay jodकर aur logs mein teen samaan tracebacks. Sirf specific transient exceptions retry karो; baaki sab ko pehle attempt par fail hone do.',
      },
      {
        wrong: `def with_retry(fn):
    for _ in range(3):
        try:
            return fn()
        except ConnectionError:
            continue
    return None            # caller cannot tell "3 failures" from "returned None"`,
        right: `def with_retry(fn):
    for i in range(3):
        try:
            return fn()
        except ConnectionError:
            if i == 2:
                raise      # exhausted -> the caller MUST know
            time.sleep(1)`,
        why: 'Returning `None` (or a default) after exhausting retries silently converts a total failure into a normal-looking result. The caller proceeds as if it got data. Re-raise the last exception so the failure is visible and the caller can decide what to do.',
        whyHi: 'Retries khatam karne ke baad `None` (ya ek default) lautाना chupchaap ek total failure ko ek normal-dikhने waale result mein badalता hai. Caller aage badhता hai jaise use data mila. Aakhri exception re-raise karो.',
      },
      {
        wrong: `try:
    async with asyncio.TaskGroup() as tg:
        ...
except ConnectionError:       # a TaskGroup raises ExceptionGroup, not ConnectionError
    handle()                  # this never matches`,
        right: `try:
    async with asyncio.TaskGroup() as tg:
        ...
except* ConnectionError as eg:
    for e in eg.exceptions:
        handle(e)`,
        why: '`asyncio.TaskGroup` collects failures from its tasks and raises them as an `ExceptionGroup`. A plain `except ConnectionError` does not match an `ExceptionGroup` (even one containing only `ConnectionError`s). Use `except*` to match and unwrap the group. You cannot mix `except` and `except*` in the same `try`.',
        whyHi: '`asyncio.TaskGroup` apne tasks se failures collect karता hai aur unhe ek `ExceptionGroup` ki tarah raise karता hai. Ek plain `except ConnectionError` ek `ExceptionGroup` se match nahi karता. Group ko match aur unwrap karne ko `except*` istemal karो.',
      },
    ],

    realWorld: [
      {
        en: '**Retry with exponential backoff is standard for every external call** — HTTP requests (retry on `429`, `500`, `502`, `503`, `504` and connection errors), DB connection acquisition, message-queue publishes. Libraries like `tenacity` and `urllib3.Retry` implement exactly the pattern in this lesson: transient-only, backoff, cap, re-raise.',
        hi: '**Exponential backoff ke saath retry har external call ke liye standard hai** — HTTP requests, DB connection acquisition, message-queue publishes. `tenacity` aur `urllib3.Retry` jaisi libraries bilkul is lesson ka pattern implement karti hain.',
      },
      {
        en: '**`asyncio.TaskGroup` + `except*` is the modern way to run concurrent I/O in Python 3.11+** — fan out N requests, and if several fail you handle them by type in one place. DRF and Django are still mostly sync, but async views and `httpx`-based clients use this.',
        hi: '**`asyncio.TaskGroup` + `except*` Python 3.11+ mein concurrent I/O chalane ka modern tarika hai** — N requests fan out karो, aur agar kai fail hon aap unhe ek jagah type se handle karते ho.',
      },
      {
        en: '**Django form/serializer validation is a fallback-and-collect pattern** — it does not stop at the first invalid field; it validates every field, collects all `ValidationError`s, and returns them together (as a dict), so the user sees every problem at once. `ExceptionGroup` is the language-level version of the same idea.',
        hi: '**Django form/serializer validation ek fallback-and-collect pattern hai** — ye pehle invalid field par nahi rukता; ye har field validate karता hai, sab `ValidationError`s collect karता hai, aur unhe ek saath lautaता hai. `ExceptionGroup` usi vichaar ka language-level version hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you write a correct retry helper? What must it NOT do?',
        qHi: 'Aap ek sahi retry helper kaise likhते ho? ise kya NAHI karna chahiye?',
        a: 'A retry helper loops a bounded number of times, calling the operation, and on failure decides whether to try again or give up. The critical design points are all about being narrow and honest. First, it must catch only the specific transient exception types — connection errors, timeouts, rate-limit or service-unavailable responses — passed in as a parameter or hard-coded to a known set. It must never catch Exception broadly, because that means a KeyError, an AttributeError, a TypeError, or any other bug in the operation gets retried too. Retrying a bug is pure waste: it cannot succeed, it adds latency equal to all the backoff delays, and it produces several identical tracebacks in the logs before the eventual failure, making diagnosis harder. Second, on the final attempt it must re-raise the exception, not return None or a default. If it swallows the failure and returns a normal-looking value, the caller proceeds believing it got real data, and the total outage becomes silent data loss or wrong results. The caller has to be told the operation failed so it can decide what to do. Third, it should back off between attempts, normally exponentially — the delay doubling each time, often with a small random jitter — so that a struggling downstream service is not hammered by every client retrying in lockstep. Fourth, both the number of attempts and the maximum delay should be capped, so a persistent failure fails in bounded time rather than retrying forever. Optionally it can distinguish retryable HTTP status codes, respect a Retry-After header, and log each attempt. What it must not do: catch broadly, retry non-transient errors, swallow the final failure, retry without backoff, or retry an unbounded number of times. Libraries like tenacity package all of this, but the shape is simple enough to write inline when you need it.',
        aHi: 'Ek retry helper ek bounded sankhya mein loop karता hai, operation call karता hai, aur failure par tay karता hai ki phir try karें ya haar maanें. Mahatvapurna design bindu sab narrow aur imaandaar hone ke baare mein hain. Pehla, ise sirf specific transient exception types pakadने chahiye — connection errors, timeouts. Ise kabhi Exception chaude roop se nahi pakadना chahiye, kyunki iska matlab operation mein ek KeyError, ek AttributeError, ya koi aur bug bhi retry hota hai. Ek bug retry karna shuddh barbaadi hai. Doosra, antim attempt par ise exception re-raise karna chahiye, None ya ek default nahi lautाना. Agar ye failure nigal leता hai aur ek normal-dikhने wali value lautaता hai, caller aage badhता hai ye maankar ki use asli data mila. Teesra, ise attempts ke beech back off karna chahiye, aam taur par exponentially. Chautha, attempts ki sankhya aur maximum delay dono cap hone chahiye. Jo ise nahi karna: chaude roop se pakadना, non-transient errors retry karna, antim failure nigalना, bina backoff retry karna.',
      },
      {
        q: 'What is `ExceptionGroup` and `except*`, and when do you need them?',
        qHi: '`ExceptionGroup` aur `except*` kya hain, aur aapko unki zaroorat kab hai?',
        a: 'ExceptionGroup, added in Python 3.11, is an exception that contains a list of other exceptions. It exists for situations where more than one independent thing can fail and you want to report all the failures rather than just the first. The motivating case is concurrency: if you run several tasks together and three of them raise, a single exception object cannot represent three separate errors — the second and third would be lost. asyncio.TaskGroup solves this by collecting every task failure and raising them wrapped in an ExceptionGroup. You also see the pattern in batch validation, where you want to tell the user about every invalid field at once, not make them fix and resubmit one at a time. except* is the syntax for handling exception groups. Instead of the normal except, which matches one exception, except* Type inspects the group, extracts every contained exception that matches Type into a sub-group, and runs the handler with that sub-group bound. The differences from normal except are important. Multiple except* clauses in the same try can all run for a single group — one might handle the ValueErrors, another the PermissionErrors, and both execute, each getting its own subset. Any exceptions in the group that no except* clause matched are re-raised as a new, smaller ExceptionGroup after the handlers finish, so nothing is silently dropped. And you cannot mix except and except* in the same try statement; it is one or the other. In application code, the place you actually encounter this is almost always asyncio.TaskGroup — when you fan out concurrent I/O and need to handle the possibility that several of the operations fail. For purely sequential code you rarely raise an ExceptionGroup yourself, though the batch-validation pattern is a reasonable use.',
        aHi: 'ExceptionGroup, Python 3.11 mein joda gaya, ek exception hai jo doosre exceptions ki ek list rakhता hai. Ye un sthitiyon ke liye maujood hai jahaan ek se zyaada swतंत्र cheez fail ho sakti hai aur aap sab failures report karna chahते ho, sirf pehli nahi. Prेरक case concurrency hai: agar aap kai tasks ek saath chalाते ho aur teen raise karें, ek akela exception object teen alag errors represent nahi kar sakta. asyncio.TaskGroup ise har task failure collect karके aur unhe ek ExceptionGroup mein wrapped raise karके hal karता hai. except* exception groups handle karne ka syntax hai. Saamaanya except ke bजाय, except* Type group ko inspect karता hai, har contained exception jo Type se match karता hai use ek sub-group mein nikalता hai. Ek hi try mein kai except* clauses ek akele group ke liye sab chal sakti hain. Koi bhi exceptions jinhe koi except* clause match nahi karता ek naye, chhote ExceptionGroup ki tarah re-raise hote hain.',
      },
    ],

    exercises: [
      {
        task: 'Write `fetch_price(pid, fetcher)` using the narrow-try + code-after pattern: `try` only `fetcher(pid)`; `except NotFound: return None`; `except Timeout: raise ServiceDown() from None`. AFTER the try (only reached on success), do `data["amount"] * data["rate"]`. Show that a `KeyError` from a bad `data` shape propagates as a bug, not as `NotFound`.',
        taskHi: '`fetch_price(pid, fetcher)` likhो narrow-try + code-after pattern istemal karके: `try` mein sirf `fetcher(pid)`; `except NotFound: return None`; `except Timeout: raise ServiceDown() from None`. try ke BAAD (sirf success par pahuncha), `data["amount"] * data["rate"]` karो. Dikhाओ ki ek kharaab `data` shape se ek `KeyError` ek bug ki tarah propagate hota hai.',
        hint: 'Keep only `data = fetcher(pid)` inside `try`. The `data["amount"]` line is outside, so a `KeyError` there is not caught by `except NotFound` — it propagates, which is correct because a malformed response IS a bug.',
        hintHi: 'Sirf `data = fetcher(pid)` `try` ke andar rakho. `data["amount"]` line baahar hai, isliye wahaan ek `KeyError` `except NotFound` dwara nahi pakda jाता — ye propagate hota hai.',
      },
      {
        task: 'Write `retry(fn, retry_on, attempts=4)` with exponential backoff (`0.01 * 2**i`, but for the test use tiny sleeps or none). It must: retry only exceptions in `retry_on`; re-raise on the last attempt; let non-matching exceptions propagate immediately. Test with (a) a fn that fails `ConnectionError` 3x then succeeds, (b) a fn that always raises `ValueError` (0 retries), (c) a fn that always raises `ConnectionError` (raises after `attempts`).',
        taskHi: '`retry(fn, retry_on, attempts=4)` likhो exponential backoff ke saath. Ise: sirf `retry_on` mein exceptions retry karne chahiye; aakhri attempt par re-raise; non-matching exceptions turant propagate hone dो. Test karो (a) ek fn jo `ConnectionError` 3x fail karता hai phir safal, (b) ek fn jo hamesha `ValueError` raise karता hai, (c) ek fn jo hamesha `ConnectionError` raise karता hai.',
        hint: 'Case (b): `ValueError not in retry_on` -> the `except retry_on` clause does not match -> propagates on call 1. Case (c): retried `attempts` times, then the `if i == attempts - 1: raise` fires.',
        hintHi: 'Case (b): `ValueError retry_on mein nahi` -> `except retry_on` clause match nahi karता -> call 1 par propagate. Case (c): `attempts` baar retry, phir `if i == attempts - 1: raise` chalता hai.',
      },
      {
        task: 'Write `validate_batch(items)` that checks each item is a dict with an int `"qty" >= 0`, collecting `ValueError`/`TypeError` per bad item, and raises `ExceptionGroup("batch invalid", errors)` if any. Then a caller with `except* ValueError` and `except* TypeError` that prints how many of each. Test with a mixed batch and confirm BOTH handlers run.',
        taskHi: '`validate_batch(items)` likhो jo check kare har item ek dict hai ek int `"qty" >= 0` ke saath, prati kharaab item `ValueError`/`TypeError` collect karके, aur koi hone par `ExceptionGroup("batch invalid", errors)` raise kare. Phir ek caller `except* ValueError` aur `except* TypeError` ke saath jo har ek kitne print kare. Ek mixed batch se test karो aur confirm karो DONO handlers chalते hain.',
        hint: 'Non-dict -> `TypeError`; dict with missing/negative/non-int `qty` -> `ValueError`. `except* ValueError as eg:` and `except* TypeError as eg:` both execute; `len(eg.exceptions)` gives each count.',
        hintHi: 'Non-dict -> `TypeError`; missing/negative/non-int `qty` waala dict -> `ValueError`. `except* ValueError as eg:` aur `except* TypeError as eg:` dono execute hote hain; `len(eg.exceptions)` har count deta hai.',
      },
    ],

    keyTakeaways: [
      'Keep the `try` block to the ONE operation that can raise; put the follow-up in `else` (or after the statement) so a bug there is not caught by the handlers.',
      'Retry helper rules: catch ONLY specific transient types (network, timeout, 429/503) — never `Exception`; re-raise on the final attempt (never return `None`); exponential backoff between tries; cap attempts and delay.',
      'Retrying a bug (`KeyError`, `TypeError`) wastes time, adds delay, and floods logs with identical tracebacks — let non-transient exceptions propagate on the first attempt.',
      'Fallback chain: try each alternative, catch its specific "not available" exception, move to the next; the final fallback must not be able to fail. Do not collapse into one `except Exception`.',
      '`ExceptionGroup` (3.11+) is a container holding multiple exceptions raised together — for concurrent tasks (`asyncio.TaskGroup`) or batch validation where you want ALL failures, not just the first.',
      '`except* Type` matches and extracts the sub-exceptions of that type from a group. MULTIPLE `except*` clauses can all run for one group; unmatched exceptions re-raise as a smaller group.',
      'You cannot mix `except` and `except*` in the same `try`. A plain `except ConnectionError` does NOT match an `ExceptionGroup` containing `ConnectionError`s.',
      'Resource-leak checklist: files/sockets/connections/locks -> `with` or `try/finally`; subprocesses/threads -> ensure joined; changed global state -> restore in `finally`.',
    ],
    keyTakeawaysHi: [
      '`try` block ko us EK operation tak rakho jo raise kar sakti hai; follow-up ko `else` mein (ya statement ke baad) rakho taaki wahaan ek bug handlers dwara na pakda jाए.',
      'Retry helper niyam: SIRF specific transient types pakdो (network, timeout, 429/503) — kabhi `Exception` nahi; antim attempt par re-raise (kabhi `None` mat lautाओ); tries ke beech exponential backoff; attempts aur delay cap karो.',
      'Ek bug retry karna (`KeyError`, `TypeError`) samay barbaad karता hai, delay jodता hai, aur logs ko samaan tracebacks se bhar deta hai — non-transient exceptions ko pehle attempt par propagate hone do.',
      'Fallback chain: har vikalp try karो, iske specific "not available" exception pakdो, agle par jाओ; antim fallback fail nahi ho sakta. Ek `except Exception` mein mat samेtो.',
      '`ExceptionGroup` (3.11+) ek container hai jo ek saath raise kiye kai exceptions rakhता hai — concurrent tasks (`asyncio.TaskGroup`) ya batch validation ke liye jahaan aap SAB failures chahते ho.',
      '`except* Type` ek group se us type ke sub-exceptions match aur nikalता hai. KAI `except*` clauses ek group ke liye sab chal sakti hain; unmatched exceptions ek chhote group ki tarah re-raise hote hain.',
      'Aap usi `try` mein `except` aur `except*` mix nahi kar sakte. Ek plain `except ConnectionError` `ConnectionError`s waale ek `ExceptionGroup` se match NAHI karता.',
      'Resource-leak checklist: files/sockets/connections/locks -> `with` ya `try/finally`; subprocesses/threads -> sunishchit karो joined; badla global state -> `finally` mein restore karो.',
    ],
  },
];
