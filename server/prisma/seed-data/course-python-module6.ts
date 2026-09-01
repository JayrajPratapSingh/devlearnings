/**
 * Python Complete Course — Module 6: Errors & Exceptions, lessons 1-3.
 *
 * Lesson 1: raise / try / except / else / finally — what an exception is, the
 *           full statement shape, `else` (no-exception path) vs `finally`
 *           (always), catching specific types, `except (A, B)`, `as e`.
 * Lesson 2: the exception hierarchy and custom exceptions — BaseException vs
 *           Exception, the common built-ins, catching a base catches its
 *           subclasses, writing `class MyError(Exception)`, `.args`.
 * Lesson 3: EAFP vs LBYL and what NOT to catch — try/except over pre-checks,
 *           the bare-`except` / `except Exception: pass` antipatterns,
 *           narrow try blocks, re-raising.
 *
 * NOTE for future editors: same rules as the rest of this course. Every
 * backtick inside simple/simpleHi/content/contentHi is `\`` (inline code inside
 * ``` blocks included). Escape `$` before `{` inside template literals as `\${`.
 * Keep example OUTPUT ASCII-only. `examples` use `code` + `output`; run every
 * sample with `python`. Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_6: CourseLesson[] = [
  {
    slug: 'py-raise-try-except-else-finally',
    title: 'raise, try / except / else / finally',
    titleHi: 'raise, try / except / else / finally',
    description: 'Wrapping a whole block in `try: ... except: ...` to "handle errors", and ending up hiding the bug you were trying to catch — a typo three lines in gets swallowed as if it were the expected failure. The `try` statement has four parts, each with a precise job: the guarded code, the handlers for specific exception types, an `else` that runs only when nothing was raised, and a `finally` that runs no matter what.',
    descriptionHi: 'Ek poore block ko `try: ... except: ...` mein wrap karna "errors handle" karne ko, aur us bug ko chhupa dena jise aap pakadne ki koshish kar rahe the — teen line andar ek typo ise nigal liya jaata hai jaise ye ummeed ki gayi failure ho. `try` statement ke chaar hisse hain, har ek ka ek thik kaam: guarded code, specific exception types ke liye handlers, ek `else` jo sirf tab chalta hai jab kuch raise nahi hua, aur ek `finally` jo chahe kuch bhi ho chalta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A lab procedure card with four labelled sections.** Section one is the experiment itself — the steps you are actually trying to run. Section two is a set of "if this specific thing goes wrong, do this" instructions: if the sample is contaminated, discard and log; if the reading is out of range, recalibrate. Each is tied to one named failure, not "anything at all". Section three is headed "only if the experiment succeeded" — the follow-up steps that make no sense unless everything above worked, like recording the result as valid. Section four is headed "always, before leaving the bench" — put the reagents back in the fridge, switch off the burner, wash your hands — and it runs whether the experiment succeeded, failed in a way you handled, or failed in a way you did not. The mistake beginners make is writing section two as "if anything goes wrong, shrug and move on", which means a dropped beaker, a power cut, and a genuine contaminated sample all get the same non-response, and you never find out which happened. Name the failures you actually know how to handle; let the rest propagate so someone sees them.',
      hi: '**Ek lab procedure card chaar labelled sections ke saath.** Section ek experiment khud hai — wo steps jo aap asal mein chalane ki koshish kar rahe ho. Section do "agar ye specific cheez galat ho, ye karo" instructions ka ek set hai: agar sample contaminated hai, phenko aur log karo; agar reading out of range hai, recalibrate karo. Har ek ek named failure se bandha hai, "kuch bhi" se nahi. Section teen "sirf agar experiment safal hua" headed hai — follow-up steps jo koi matlab nahi rakhte jab tak upar sab kaam na kare. Section chaar "hamesha, bench chhodne se pehle" headed hai — reagents wapas fridge mein, burner band, haath dho — aur ye chalता hai chahe experiment safal hua, ek tarike se fail hua jo aapne handle kiya, ya ek tarike se fail hua jo aapne nahi. Galti jo shuruaati log karte hain wo section do ko "agar kuch bhi galat ho, kandhe uchkao aur aage badho" likhna hai. Un failures ko naam do jinhe aap asal mein handle karna jaante ho; baaki ko propagate hone do.',
    },

    simple: `**Start broken.** A too-wide \`try\` that hides a real bug:

\`\`\`python
def load_score(raw):
    try:
        data = json.loads(raw)
        return data["score"] * data["wieght"]     # typo: "wieght"
    except Exception:
        return 0                                   # every error -> 0, silently

load_score('{"score": 10, "weight": 5}')          # returns 0 -- but WHY?
\`\`\`

The \`KeyError\` from the typo is caught by \`except Exception\` and turned into \`0\`, exactly like a genuine bad-JSON input would be. You cannot tell a real failure from a bug.

**The fix: catch the specific expected errors, in a narrow block**

\`\`\`python
def load_score(raw):
    try:
        data = json.loads(raw)                     # only THIS line can raise JSONDecodeError
    except json.JSONDecodeError:
        return 0                                   # a genuine "bad input" case
    return data["score"] * data["weight"]          # a KeyError here is a BUG -> let it raise
\`\`\`

**The full statement**

\`\`\`python
try:
    result = risky()
except ValueError as e:
    print("bad value:", e)          # runs if risky() raised ValueError
except (KeyError, IndexError):
    print("missing data")           # one handler for two types
else:
    print("ok:", result)            # runs ONLY if try finished with no exception
finally:
    cleanup()                       # runs ALWAYS -- success, handled error, or unhandled
\`\`\`

\`\`\`
try:      the code that might raise
except X: run this if X (or a subclass of X) was raised; the exception is "handled"
except (X, Y) as e:   catch either; bind the exception object to e
else:     run this if the try block finished with NO exception
          (put the "and then..." code here, not inside try, to keep try narrow)
finally:  run this no matter what -- normal exit, handled exception, unhandled
          exception, even a return/break inside try. For cleanup that MUST happen.

- catch SPECIFIC exception types, not bare 'except:' or 'except Exception:'
- keep the try block as small as possible -- ideally the one line that can raise
- an unhandled exception propagates up the call stack; if it reaches the top,
  the program prints a traceback and exits
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Ek bahut-chauda \`try\` jo ek asli bug chhupata hai:

\`\`\`python
def load_score(raw):
    try:
        data = json.loads(raw)
        return data["score"] * data["wieght"]     # typo: "wieght"
    except Exception:
        return 0                                   # har error -> 0, chupchaap

load_score('{"score": 10, "weight": 5}')          # 0 lautaata hai -- par KYUN?
\`\`\`

Typo se \`KeyError\` \`except Exception\` dwara pakda jaata hai aur \`0\` mein badla jaata hai, bilkul jaise ek asli kharaab-JSON input hota. Aap ek asli failure ko ek bug se nahi bata sakte.

**Fix: specific ummeed ki gayi errors pakdo, ek narrow block mein**

\`\`\`python
def load_score(raw):
    try:
        data = json.loads(raw)                     # sirf YE line JSONDecodeError raise kar sakti hai
    except json.JSONDecodeError:
        return 0                                   # ek asli "bad input" case
    return data["score"] * data["weight"]          # yahaan ek KeyError ek BUG hai -> ise raise hone do
\`\`\`

**Poora statement**

\`\`\`python
try:
    result = risky()
except ValueError as e:
    print("bad value:", e)          # chalता hai agar risky() ne ValueError raise kiya
except (KeyError, IndexError):
    print("missing data")           # do types ke liye ek handler
else:
    print("ok:", result)            # SIRF tab chalta hai jab try bina exception khatam hua
finally:
    cleanup()                       # HAMESHA chalता hai -- success, handled error, ya unhandled
\`\`\`

\`\`\`
try:      wo code jo raise kar sakta hai
except X: ise chalao agar X (ya X ka subclass) raise hua; exception "handled" hai
except (X, Y) as e:   dono pakdo; exception object ko e se bind karo
else:     ise chalao agar try block bina KISI exception ke khatam hua
          ("aur phir..." code yahaan rakho, try ke andar nahi, try ko narrow rakhne ko)
finally:  chahe kuch bhi ho chalao -- normal exit, handled exception, unhandled
          exception, try ke andar ek return/break bhi. Us cleanup ke liye jo HONA CHAHIYE.

- SPECIFIC exception types pakdo, nanga 'except:' ya 'except Exception:' nahi
- try block ko jitna ho sake chhota rakho -- aadarsh roop se wo ek line jo raise kar sakti hai
- ek unhandled exception call stack upar propagate karta hai; agar ye top tak pahunchता hai,
  program ek traceback print karta hai aur exit karta hai
\`\`\``,

    content: `## What an exception is

An exception is an object (an instance of some class deriving from \`Exception\`) that Python creates and "raises" when something goes wrong. Raising unwinds the current call — the function stops immediately — and Python looks for a matching \`except\` in the enclosing \`try\`, then in the caller's \`try\`, and so on up the stack. If none matches, the exception reaches the top level and Python prints a traceback and exits with a non-zero code.

\`\`\`python
raise ValueError("age must be positive")     # create and raise
raise ValueError                             # shorthand: raises ValueError()
raise                                        # re-raise the exception currently being handled
\`\`\`

## \`else\` — the "no exception" path

\`\`\`python
try:
    f = open(path)
except FileNotFoundError:
    print("no such file")
else:
    # runs only if open() succeeded; f is guaranteed to exist here
    data = f.read()
    f.close()
\`\`\`

Code in \`else\` runs only when the \`try\` block completed without raising. The value of \`else\` is that it keeps the \`try\` block minimal: only the operation that can fail goes in \`try\`; the follow-up goes in \`else\`, where an exception from it will *not* be caught by the handlers above (which would be a bug).

## \`finally\` — always

\`\`\`python
conn = connect()
try:
    conn.execute(sql)
    return conn.fetchall()
finally:
    conn.close()             # runs even though there is a 'return' in the try
\`\`\`

\`finally\` runs on every exit path from the \`try\`: normal completion, a \`return\`/\`break\`/\`continue\`, a handled exception, or an unhandled one on its way up. Use it for cleanup that must happen regardless — closing files, releasing locks, restoring state. (A \`with\` statement, next lessons, is usually cleaner than a bare \`try/finally\`.)

## Order and matching

\`\`\`python
try:
    risky()
except FileNotFoundError:       # more specific first
    ...
except OSError:                 # FileNotFoundError is a subclass of OSError
    ...
except Exception:               # broadest last (and rarely what you want)
    ...
\`\`\`

Handlers are checked top to bottom; the first whose type matches (by \`isinstance\`) wins. Put specific types before their base classes — a broad handler placed first would shadow the specific ones.

## Catching multiple types; binding the exception

\`\`\`python
try:
    parse(x)
except (ValueError, TypeError) as e:
    log.warning("parse failed: %s: %s", type(e).__name__, e)
    # e.args is the tuple passed to the exception; str(e) is usually args[0]
\`\`\`

## The narrow-\`try\` habit

\`\`\`python
# BAD: five things in the try; which one were you guarding against?
try:
    raw = fetch(url)
    data = json.loads(raw)
    user = data["user"]
    save(user)
    notify(user)
except Exception:
    ...

# GOOD: guard exactly the fallible operation
try:
    raw = fetch(url)
except TimeoutError:
    return None
data = json.loads(raw)     # if this raises, that is a real problem -- do not hide it
...
\`\`\``,

    contentHi: `## Ek exception kya hai

Ek exception ek object hai (\`Exception\` se derive karti kisi class ka ek instance) jise Python banata aur "raise" karta hai jab kuch galat hota hai. Raise karna current call ko unwind karta hai — function turant rukता hai — aur Python enclosing \`try\` mein ek matching \`except\` dhoondhता hai, phir caller ke \`try\` mein, aur aise stack upar. Agar koi match nahi karता, exception top level tak pahunchता hai aur Python ek traceback print karता hai aur ek non-zero code se exit karता hai.

\`\`\`python
raise ValueError("age must be positive")     # banao aur raise karo
raise ValueError                             # shorthand: ValueError() raise karता hai
raise                                        # abhi handle ho rahe exception ko dobara raise karo
\`\`\`

## \`else\` — "koi exception nahi" path

\`\`\`python
try:
    f = open(path)
except FileNotFoundError:
    print("no such file")
else:
    # sirf tab chalता hai agar open() safal hua; f yahaan guaranteed maujood hai
    data = f.read()
    f.close()
\`\`\`

\`else\` mein code sirf tab chalता hai jab \`try\` block bina raise kiye poora hua. \`else\` ki value ye hai ki ye \`try\` block ko minimal rakhता hai: sirf wo operation jo fail ho sakta hai \`try\` mein jाता hai; follow-up \`else\` mein jाता hai, jahaan isse ek exception upar ke handlers dwara *nahi* pakda jaayega.

## \`finally\` — hamesha

\`\`\`python
conn = connect()
try:
    conn.execute(sql)
    return conn.fetchall()
finally:
    conn.close()             # chalता hai haalaanki try mein ek 'return' hai
\`\`\`

\`finally\` \`try\` se har exit path par chalता hai: normal completion, ek \`return\`/\`break\`/\`continue\`, ek handled exception, ya ek unhandled apne raaste par upar. Ise us cleanup ke liye istemal karo jo chahe kuch bhi ho hona chahiye. (Ek \`with\` statement, agle lessons, aam taur par ek nange \`try/finally\` se saaf hai.)

## Order aur matching

\`\`\`python
try:
    risky()
except FileNotFoundError:       # zyaada specific pehle
    ...
except OSError:                 # FileNotFoundError OSError ka subclass hai
    ...
except Exception:               # sabse chauda aakhri (aur shaayad hi jo aap chahte ho)
    ...
\`\`\`

Handlers top se bottom check hote hain; pehla jiska type match karता hai (\`isinstance\` se) jeetता hai. Specific types ko unke base classes se pehle rakho — pehle rakha ek chauda handler specific waalo ko shadow karega.

## Kai types pakadna; exception bind karna

\`\`\`python
try:
    parse(x)
except (ValueError, TypeError) as e:
    log.warning("parse failed: %s: %s", type(e).__name__, e)
    # e.args exception ko pass kiya tuple hai; str(e) aam taur par args[0] hai
\`\`\`

## Narrow-\`try\` aadat

\`\`\`python
# BURA: try mein paanch cheezein; aap kis ke khilaaf guard kar rahe the?
try:
    raw = fetch(url)
    data = json.loads(raw)
    user = data["user"]
    save(user)
    notify(user)
except Exception:
    ...

# ACHHA: bilkul fallible operation guard karo
try:
    raw = fetch(url)
except TimeoutError:
    return None
data = json.loads(raw)     # agar ye raise karता hai, wo ek asli samasya hai -- ise chhupao mat
...
\`\`\``,

    examples: [
      {
        title: 'else and finally: which runs when',
        titleHi: 'else aur finally: kaunsa kab chalता hai',
        code: `def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("  except: division by zero")
        return None
    else:
        print("  else: no exception, result =", result)
        return result
    finally:
        print("  finally: always runs")

print("-- divide(10, 2) --")
divide(10, 2)
print("-- divide(10, 0) --")
divide(10, 0)`,
        output: `-- divide(10, 2) --
  else: no exception, result = 5.0
  finally: always runs
-- divide(10, 0) --
  except: division by zero
  finally: always runs`,
        explain: 'For `divide(10, 2)`: the `try` succeeds, so `except` is skipped, `else` runs, then `finally` runs — even though `else` has a `return`, `finally` still executes before the function actually returns. For `divide(10, 0)`: `except` handles the `ZeroDivisionError`, `else` is skipped, and `finally` still runs. `finally` runs on every path.',
        explainHi: '`divide(10, 2)` ke liye: `try` safal hota hai, isliye `except` chhod diya jaata hai, `else` chalता hai, phir `finally` chalता hai — haalaanki `else` mein ek `return` hai, `finally` phir bhi function ke asal mein return karne se pehle execute hota hai. `divide(10, 0)` ke liye: `except` `ZeroDivisionError` handle karता hai, `else` chhod diya jaता hai, aur `finally` phir bhi chalता hai.',
      },
      {
        title: 'A wide try hides a bug; a narrow try surfaces it',
        titleHi: 'Ek chauda try ek bug chhupata hai; ek narrow try ise saamne laata hai',
        code: `import json

def wide(raw):
    try:
        d = json.loads(raw)
        return d["score"] * d["multipler"]      # typo
    except Exception:
        return -1

def narrow(raw):
    try:
        d = json.loads(raw)
    except json.JSONDecodeError:
        return -1
    return d["score"] * d["multipler"]          # typo still here, but NOT hidden

good = '{"score": 10, "multiplier": 3}'
print("wide, good input:", wide(good))          # -1 -- looks like bad input!
print("wide, bad JSON:  ", wide("{oops"))       # -1 -- same result, no way to tell

print("narrow, good input:", end=" ")
try:
    narrow(good)
except KeyError as e:
    print("KeyError", e, "(the bug is visible)")
print("narrow, bad JSON:  ", narrow("{oops"))`,
        output: `wide, good input: -1
wide, bad JSON:   -1
narrow, good input: KeyError 'multipler' (the bug is visible)
narrow, bad JSON:   -1`,
        explain: '`wide` catches `Exception`, so the `KeyError` from the `"multipler"` typo becomes `-1` — identical to the response for genuinely malformed JSON. You cannot distinguish a bug from expected bad input. `narrow` only catches `JSONDecodeError` around the one line that produces it; the `KeyError` from the `"multipler"` typo propagates as a real error you can see and fix.',
        explainHi: '`wide` `Exception` pakadता hai, isliye `"multipler"` typo se `KeyError` `-1` ban jाता hai — sachmuch malformed JSON ke jawaab ke samaan. `narrow` sirf `JSONDecodeError` pakadता hai us ek line ke aas-paas jo ise banati hai; `"multipler"` typo se `KeyError` ek asli error ki tarah propagate hota hai jise aap dekh aur theek kar sakte ho.',
      },
      {
        title: 'finally runs even with return/break; propagation up the stack',
        titleHi: 'finally return/break ke saath bhi chalता hai; stack upar propagation',
        code: `def with_cleanup(items):
    acquired = "LOCK"
    print("  acquired", acquired)
    try:
        for x in items:
            if x < 0:
                raise ValueError(f"negative: {x}")
            if x == 0:
                return "hit zero"
        return "all positive"
    finally:
        print("  released", acquired)

print(with_cleanup([1, 2, 3]))
print("---")
print(with_cleanup([1, 0, 3]))
print("---")
try:
    with_cleanup([1, -5, 3])
except ValueError as e:
    print("caught at top:", e)`,
        output: `  acquired LOCK
  released LOCK
all positive
---
  acquired LOCK
  released LOCK
hit zero
---
  acquired LOCK
  released LOCK
caught at top: negative: -5`,
        explain: 'In all three cases "released LOCK" prints: on normal completion (`return "all positive"`), on an early `return "hit zero"`, and when a `ValueError` propagates out. The `finally` block is Python\'s guarantee that cleanup happens on every exit path. The unhandled `ValueError` from the third call travels up until the caller\'s `try` catches it.',
        explainHi: 'Teenon cases mein "released LOCK" print hota hai: normal completion par, ek jaldi `return "hit zero"` par, aur jab ek `ValueError` propagate hota hai. `finally` block Python ki guarantee hai ki cleanup har exit path par hota hai. Teesri call se unhandled `ValueError` upar jाता hai jab tak caller ka `try` ise pakad na le.',
      },
    ],

    mistakes: [
      {
        wrong: `try:
    value = config[key]
    connection = pool.get()
    result = connection.run(value)
    log_metrics(result)
except Exception:
    result = None`,
        right: `try:
    value = config[key]
except KeyError:
    raise ConfigError(f"missing key: {key}")

connection = pool.get()
result = connection.run(value)      # errors here are real -- let them raise
log_metrics(result)`,
        why: 'Four operations in one `try` with a catch-all handler means any failure — a missing config key, a dead connection, a bug in `run`, a broken `log_metrics` — produces the same `result = None`. You lose all information about what actually went wrong. Guard only the operation you have a specific recovery for.',
        whyHi: 'Ek catch-all handler ke saath ek `try` mein chaar operations matlab koi bhi failure — ek missing config key, ek dead connection, `run` mein ek bug — wahi `result = None` banati hai. Aap iske baare mein saari jaankaari kho dete ho ki asal mein kya galat hua. Sirf us operation ko guard karo jiske liye aapke paas ek specific recovery hai.',
      },
      {
        wrong: `try:
    data = fetch()
    process(data)          # if this raises ValueError, it is caught below by mistake
except ValueError:
    data = []              # meant to handle fetch() failing, not process()`,
        right: `try:
    data = fetch()
except ValueError:
    data = []
else:
    process(data)          # a ValueError here is NOT swallowed by the handler above`,
        why: 'Putting the follow-up call inside the `try` means an exception from `process(data)` is caught by a handler that was written for `fetch()`. Move code that should run only on success into `else`, where exceptions from it are not intercepted by the `try`\'s handlers.',
        whyHi: 'Follow-up call ko `try` ke andar rakhna matlab `process(data)` se ek exception ek handler dwara pakda jाता hai jo `fetch()` ke liye likha tha. Wo code jo sirf success par chalna chahiye use `else` mein le jाओ, jahaan isse exceptions `try` ke handlers dwara intercept nahi hote.',
      },
      {
        wrong: `f = open(path)
try:
    data = f.read()
except Exception:
    pass
# f is never closed if read() succeeds without a finally / with`,
        right: `with open(path) as f:      # guaranteed close, exception or not
    data = f.read()
# or, if you must:
f = open(path)
try:
    data = f.read()
finally:
    f.close()`,
        why: 'Cleanup that must always happen belongs in `finally` (or a `with` statement), not after the `try`. Code placed after the `try` is skipped if an exception propagates out. Without `finally`/`with`, the file handle leaks on any error path.',
        whyHi: 'Cleanup jo hamesha hona chahiye wo `finally` (ya ek `with` statement) mein hai, `try` ke baad nahi. `try` ke baad rakha code chhod diya jाता hai agar ek exception propagate hota hai. `finally`/`with` ke bina, file handle kisi bhi error path par leak hota hai.',
      },
    ],

    realWorld: [
      {
        en: '**DRF and Django rely on exception propagation** — a view that raises `Http404`, `PermissionDenied`, or a DRF `ValidationError` does not catch it; the framework\'s exception handler catches it higher up and turns it into the right HTTP response. Wrapping view logic in `try/except Exception` breaks that and hides real errors from your monitoring.',
        hi: '**DRF aur Django exception propagation par nirbhar karte hain** — ek view jo `Http404`, `PermissionDenied`, ya ek DRF `ValidationError` raise karता hai use pakadता nahi; framework ka exception handler ise upar pakadता hai aur ise sahi HTTP response mein badalता hai. View logic ko `try/except Exception` mein wrap karna use todता hai.',
      },
      {
        en: '**`try/finally` (or `with`) around a database transaction** — `finally: conn.rollback()` unless you committed. Django\'s `transaction.atomic()` is a context manager built on exactly this: commit on clean exit, roll back if an exception propagates out of the block.',
        hi: '**Ek database transaction ke aas-paas `try/finally` (ya `with`)** — `finally: conn.rollback()` jab tak aapne commit nahi kiya. Django ka `transaction.atomic()` bilkul isi par bana ek context manager hai: saaf exit par commit, agar ek exception block se propagate hota hai to roll back.',
      },
      {
        en: '**The "wide try swallows the bug" mistake causes silent data corruption in production** — a batch job with `try: process_row(r) except Exception: skip()` around the whole row will skip rows that fail due to a code bug exactly like rows with genuinely bad data, and you discover months of dropped records later.',
        hi: '**"chauda try bug nigal leta hai" galti production mein chupchaap data corruption ka kaaran banti hai** — ek batch job poore row ke aas-paas `try: process_row(r) except Exception: skip()` ke saath un rows ko skip karega jo ek code bug ke kaaran fail hote hain bilkul sachmuch kharaab data waale rows ki tarah.',
      },
    ],

    interviewQA: [
      {
        q: 'What do `else` and `finally` do in a `try` statement, and how do they differ?',
        qHi: 'Ek `try` statement mein `else` aur `finally` kya karte hain, aur wo kaise alag hain?',
        a: 'A try statement can have up to four kinds of clause. The try block holds the code that might raise. Zero or more except blocks each handle a specific exception type or tuple of types. Then optionally an else block, and optionally a finally block. The else block runs only if the try block completed without raising any exception — it is the success path. Its purpose is to let you keep the try block as small as possible: you put just the fallible operation in try, and the code that should run afterward, but only when that succeeded, goes in else. This matters because code in else is outside the protection of the except handlers, so if the follow-up code raises, that exception is not accidentally caught by a handler that was written for the fallible operation. Without else you would either put the follow-up inside try, risking that miscatch, or after the whole try statement, where it would run even after a handled exception. The finally block runs on every exit path from the try statement, without exception: normal completion, a handled exception, an unhandled exception propagating outward, and even a return, break, or continue inside the try or else. It is for cleanup that must happen no matter what — closing a file or connection, releasing a lock, restoring some global state. A subtle point is that if the try block has a return and the finally block also has a return, the finally\'s return wins and the try\'s value is discarded, which is a good reason not to return from finally. In practice, for resource cleanup a with statement and a context manager are usually cleaner than a raw try-finally, but finally is still the right tool when there is no context manager for what you need to clean up. The short version: else is "only on success and outside the handlers", finally is "always, on the way out".',
        aHi: 'Ek try statement mein chaar tarah ke clause ho sakte hain. try block wo code rakhता hai jo raise kar sakta hai. Shoonya ya zyaada except blocks har ek ek specific exception type handle karta hai. Phir vaikalpik roop se ek else block, aur vaikalpik roop se ek finally block. else block sirf tab chalता hai agar try block bina koi exception raise kiye poora hua — ye success path hai. Iska maqsad aapko try block ko jitna ho sake chhota rakhne dena hai: aap sirf fallible operation try mein rakhते ho, aur wo code jo baad mein chalna chahiye, par sirf jab wo safal hua, else mein jाता hai. Ye maayne rakhता hai kyunki else mein code except handlers ki suraksha ke baahar hai. finally block try statement se har exit path par chalता hai, bina apवाद: normal completion, ek handled exception, ek unhandled exception baahar propagate hota, aur ek return, break, ya continue bhi. Ye us cleanup ke liye hai jo chahe kuch bhi ho hona chahiye. Chhota: else "sirf success par aur handlers ke baahar", finally "hamesha, baahar jaate waqt".',
      },
      {
        q: 'Why is `except Exception:` (or bare `except:`) around a large block considered bad practice?',
        qHi: 'Ek bade block ke aas-paas `except Exception:` (ya nanga `except:`) bura practice kyun maana jाता hai?',
        a: 'Two reasons, one about correctness and one about diagnosis. On correctness: a broad handler catches every exception type, which means it catches exceptions you never anticipated and have no sensible recovery for. If the block does five things and any of them can fail in five different ways, one catch-all handler gives all twenty-five failure modes the same response. A genuine expected failure, like a network timeout you want to retry, gets handled the same as a KeyError from a typo in your own code, an AttributeError from a None you did not expect, or an ImportError from a missing dependency. The bug is silently converted into whatever the handler does — return None, skip the row, use a default — and the program carries on in a state you did not design for, often corrupting data or producing wrong results far from the actual cause. On diagnosis: because the handler swallowed the exception, there is no traceback, no log entry unless you added one, and no signal to your monitoring. You find out weeks later when someone notices the output is wrong. The correct approach is to catch the narrowest exception type that corresponds to a situation you actually know how to handle, around the smallest block that can raise it — ideally the single line. Everything else propagates, which is what you want: an unexpected exception should crash loudly, produce a traceback, alert your error tracking, and get fixed. There are a few legitimate uses of a broad catch: a top-level handler in a long-running server or worker that logs the full exception and then continues to the next request or task, and re-raising after logging or cleanup. But even those log the exception rather than discarding it, and the bare except form that also catches KeyboardInterrupt and SystemExit is almost never what you want — use except Exception at minimum.',
        aHi: 'Do kaaran, ek correctness ke baare mein aur ek diagnosis ke baare mein. Correctness par: ek chauda handler har exception type pakadता hai, jiska matlab ye un exceptions ko pakadता hai jinki aapne kabhi ummeed nahi ki aur jinke liye koi samझदार recovery nahi hai. Agar block paanch cheezein karта hai aur unmein se koi paanch alag tarikon se fail ho sakti hai, ek catch-all handler sabhi pachchees failure modes ko wahi jawaab deta hai. Ek asli ummeed ki gayi failure, jaise ek network timeout jise aap retry karna chahte ho, wahi handle hota hai jaise aapke apne code mein ek typo se KeyError. Bug chupchaap us mein badla jाता hai jo handler karता hai. Diagnosis par: kyunki handler ne exception nigal liya, koi traceback nahi, koi log entry nahi jab tak aapne ek nahi joda. Sahi tarika sabse narrow exception type pakadna hai jo ek sthiti se mel khaता hai jise aap asal mein handle karna jaante ho. Kuch jaayaz istemal hain: ek long-running server mein ek top-level handler jo poore exception ko log karता hai aur phir continue karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Write `safe_int(s, default=0)` that returns `int(s)` but returns `default` on `ValueError` (e.g. `"abc"`) or `TypeError` (e.g. `None`). Use one `except (ValueError, TypeError)`. Test `safe_int("42")`, `safe_int("x")`, `safe_int(None)`, `safe_int("3.5")` (also a ValueError).',
        taskHi: '`safe_int(s, default=0)` likho jo `int(s)` lautaaye par `ValueError` (jaise `"abc"`) ya `TypeError` (jaise `None`) par `default` lautaaye. Ek `except (ValueError, TypeError)` istemal karo. `safe_int("42")`, `safe_int("x")`, `safe_int(None)`, `safe_int("3.5")` test karo.',
        hint: '`try: return int(s) except (ValueError, TypeError): return default`. `int("3.5")` raises `ValueError` (not `"3"`), `int(None)` raises `TypeError`.',
        hintHi: '`try: return int(s) except (ValueError, TypeError): return default`. `int("3.5")` `ValueError` raise karता hai, `int(None)` `TypeError`.',
      },
      {
        task: 'Write `read_config(path)` using `try/except/else/finally`: `try` opens the file; `except FileNotFoundError` returns `{}`; `else` parses JSON and returns it; `finally` prints `"read_config done"`. Add a `print` in each branch. Run it for an existing temp file and a missing path, showing which branches fire in each case.',
        taskHi: '`read_config(path)` likho `try/except/else/finally` istemal karke: `try` file kholta hai; `except FileNotFoundError` `{}` lautaaता hai; `else` JSON parse karता hai aur ise lautaaता hai; `finally` `"read_config done"` print karता hai. Har branch mein ek `print` jodo. Ise ek maujood temp file aur ek missing path ke liye chalao.',
        hint: 'Missing path: `except` and `finally` fire, not `else`. Existing file: `else` and `finally` fire, not `except`. Keep only `open()` in the `try` so a JSON error in `else` is not caught by `except FileNotFoundError`.',
        hintHi: 'Missing path: `except` aur `finally` chalते hain, `else` nahi. Maujood file: `else` aur `finally` chalते hain, `except` nahi. Sirf `open()` `try` mein rakho.',
      },
      {
        task: 'Write `process_all(rows)` that loops over rows calling a `transform(row)` that raises `ValueError` for bad rows. Collect successful results; on `ValueError`, append `None` and continue; on ANY other exception, let it propagate (do not catch it). Test with rows where one raises `ValueError` and one raises `KeyError` — show the `KeyError` stops the whole thing while `ValueError` rows become `None`.',
        taskHi: '`process_all(rows)` likho jo rows par loop kare ek `transform(row)` call karके jo kharaab rows ke liye `ValueError` raise karता hai. Safal results collect karo; `ValueError` par, `None` append karो aur continue; KISI aur exception par, ise propagate hone do. Test karो jahaan ek `ValueError` raise karता hai aur ek `KeyError`.',
        hint: 'Inside the loop: `try: results.append(transform(row)) except ValueError: results.append(None)`. Do NOT add `except Exception` — the `KeyError` should propagate out of `process_all` and be visible.',
        hintHi: 'Loop ke andar: `try: results.append(transform(row)) except ValueError: results.append(None)`. `except Exception` mat jodo — `KeyError` ko `process_all` se propagate hona chahiye.',
      },
    ],

    keyTakeaways: [
      'A `try` statement has four parts: `try` (guarded code), `except` (handlers for specific types), `else` (runs only if no exception), `finally` (runs always).',
      '`else` runs when the `try` block finished with no exception. Put "and then..." code here — an exception from it is NOT caught by the `except` handlers above.',
      '`finally` runs on every exit: normal, handled exception, unhandled exception, or a `return`/`break`/`continue` inside `try`. Use it for cleanup that must happen.',
      'Catch SPECIFIC exception types. Bare `except:` and `except Exception:` around a large block hide bugs — a typo\'s `KeyError` looks identical to your expected failure.',
      'Keep the `try` block as small as possible — ideally the one operation that can raise. Move follow-up code to `else` or after the statement.',
      'Handlers are matched top-to-bottom by `isinstance`. Put specific types before their base classes, or the base handler shadows the specific ones.',
      '`except (A, B) as e:` catches either type and binds the exception object. `raise` with no argument re-raises the current exception.',
      'An unhandled exception propagates up the call stack; if it reaches the top, Python prints a traceback and exits non-zero.',
    ],
    keyTakeawaysHi: [
      'Ek `try` statement ke chaar hisse hain: `try` (guarded code), `except` (specific types ke handlers), `else` (sirf tab chalता hai agar koi exception nahi), `finally` (hamesha chalता hai).',
      '`else` tab chalता hai jab `try` block bina exception khatam hua. "Aur phir..." code yahaan rakho — isse ek exception upar ke `except` handlers dwara NAHI pakda jाता.',
      '`finally` har exit par chalता hai: normal, handled exception, unhandled exception, ya `try` ke andar ek `return`/`break`/`continue`. Ise us cleanup ke liye istemal karo jo hona chahiye.',
      'SPECIFIC exception types pakdo. Ek bade block ke aas-paas nanga `except:` aur `except Exception:` bugs chhupate hain — ek typo ka `KeyError` aapki ummeed ki gayi failure ke samaan dikhta hai.',
      '`try` block ko jitna ho sake chhota rakho — aadarsh roop se wo ek operation jo raise kar sakta hai. Follow-up code ko `else` mein ya statement ke baad le jाओ.',
      'Handlers `isinstance` se top-to-bottom match hote hain. Specific types ko unke base classes se pehle rakho.',
      '`except (A, B) as e:` dono type pakadता hai aur exception object bind karता hai. Bina argument `raise` current exception dobara raise karता hai.',
      'Ek unhandled exception call stack upar propagate karता hai; agar ye top tak pahunchता hai, Python ek traceback print karता hai aur non-zero exit karता hai.',
    ],
  },

  {
    slug: 'py-exception-hierarchy-and-custom',
    title: 'The Exception Hierarchy and Custom Exceptions',
    titleHi: 'Exception Hierarchy Aur Custom Exceptions',
    description: 'Catching `Exception` to be safe and accidentally swallowing `KeyboardInterrupt` so Ctrl-C stops working, or catching `OSError` and being surprised it also caught `FileNotFoundError` and `PermissionError`. Exceptions form an inheritance tree, and `except SomeClass` matches that class and every subclass — which is exactly why you define your own exception classes for your own error conditions.',
    descriptionHi: '`Exception` pakadna surakshit rehne ko aur galti se `KeyboardInterrupt` nigal lena taaki Ctrl-C kaam karna band kar de, ya `OSError` pakadna aur chaunk jaana ki isne `FileNotFoundError` aur `PermissionError` bhi pakde. Exceptions ek inheritance tree banate hain, aur `except SomeClass` us class aur har subclass ko match karता hai — jo bilkul wajah hai ki aap apni error conditions ke liye apni exception classes define karते ho.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A hospital triage system organised as a family tree of conditions.** At the top is "medical event". Below it, "injury" and "illness". Below "injury", "fracture", "burn", "laceration". A doctor who says "I handle injuries" will be sent every fracture, burn, and laceration, because those are kinds of injury — matching a category matches everything beneath it. A doctor who says "I handle medical events" gets literally everything, including a fire alarm and a billing dispute, which is why nobody says that. And crucially, there is a separate branch, "not a patient problem" — the building evacuation order, the shift-change signal — that must never be routed to a medical doctor at all, because handling it as if it were an illness stops the real response. Python\'s exceptions are this tree. `Exception` is "patient problem" and covers the errors your code should consider handling. `BaseException` is the root and also covers `KeyboardInterrupt` and `SystemExit` — the "stop the program now" signals — which sit outside `Exception` on purpose so that a normal `except Exception` does not trap them. When you have an error condition specific to your system — "this order cannot ship", "this token expired" — you add a branch to the tree by writing your own class, so callers can catch exactly your condition and nothing else.',
      hi: '**Ek hospital triage system jo conditions ke ek family tree ki tarah sangathit hai.** Top par "medical event" hai. Iske neeche, "injury" aur "illness". "Injury" ke neeche, "fracture", "burn", "laceration". Ek doctor jo kehta hai "main injuries handle karता hoon" ko har fracture, burn, aur laceration bheja jaayega, kyunki wo injury ke prakaar hain — ek category match karna iske neeche sab kuch match karता hai. Ek doctor jo kehta hai "main medical events handle karता hoon" ko sachmuch sab kuch milता hai. Aur mahatvapurna roop se, ek alag branch hai, "patient samasya nahi" — building evacuation order — jise kabhi ek medical doctor ko route nahi karna chahiye. Python ke exceptions ye tree hain. `Exception` "patient samasya" hai. `BaseException` root hai aur `KeyboardInterrupt` aur `SystemExit` ko bhi cover karता hai — "program abhi roko" signals — jo jaan-boojhkar `Exception` ke baahar baithte hain. Jab aapke paas apne system ke specific ek error condition hai, aap apni class likhkar tree mein ek branch jodते ho.',
    },

    simple: `**The tree (top of it):**

\`\`\`
BaseException                    <- the true root; do NOT catch this
 +-- SystemExit                  <- raised by sys.exit(); let it through
 +-- KeyboardInterrupt           <- raised by Ctrl-C; let it through
 +-- Exception                   <- catch THIS or below, never above
      +-- ValueError             <- right type, wrong value: int("abc")
      +-- TypeError              <- wrong type: len(5)
      +-- KeyError               <- missing dict key: d["nope"]
      +-- IndexError             <- list index out of range: lst[99]
      +-- AttributeError         <- obj.missing_attr
      +-- FileNotFoundError  --+
      +-- PermissionError    --+-- all subclasses of OSError
      +-- ...                --+
      +-- RuntimeError
      +-- StopIteration
\`\`\`

**Catching a base catches every subclass**

\`\`\`python
try:
    open("/no/such/file")
except OSError as e:            # FileNotFoundError IS an OSError
    print(type(e).__name__)     # FileNotFoundError
\`\`\`

**Defining your own**

\`\`\`python
class AppError(Exception):
    """Base for everything this app raises on purpose."""

class OrderError(AppError):
    pass

class OrderNotShippable(OrderError):
    def __init__(self, order_id, reason):
        super().__init__(f"order {order_id} cannot ship: {reason}")
        self.order_id = order_id
        self.reason = reason

raise OrderNotShippable(42, "out of stock")
# callers can catch OrderNotShippable, or OrderError, or AppError, or Exception
\`\`\`

\`\`\`
BaseException   root. Its non-Exception children are SystemExit, KeyboardInterrupt,
                GeneratorExit -- "control flow" signals, NOT errors. Never catch
                BaseException or use bare 'except:' -- both trap Ctrl-C and sys.exit().

Exception       the base for all normal errors. 'except Exception' catches everything
                below it (still usually too broad -- prefer specific types).

except X        matches X and ANY subclass of X (isinstance semantics).

Custom exceptions:
  - subclass Exception (or a more specific built-in if it truly fits)
  - give your app ONE base class (class AppError(Exception)) so callers can catch
    "any error from this library" without catching unrelated bugs
  - store structured data as attributes (self.order_id), not just a string
  - name them for the CONDITION (OrderNotShippable), not the location
\`\`\``,

    simpleHi: `**Tree (iska top):**

\`\`\`
BaseException                    <- asli root; ise pakadो MAT
 +-- SystemExit                  <- sys.exit() dwara raise; ise jaane do
 +-- KeyboardInterrupt           <- Ctrl-C dwara raise; ise jaane do
 +-- Exception                   <- YE ya neeche pakdो, kabhi upar nahi
      +-- ValueError             <- sahi type, galat value: int("abc")
      +-- TypeError              <- galat type: len(5)
      +-- KeyError               <- missing dict key: d["nope"]
      +-- IndexError             <- list index out of range: lst[99]
      +-- AttributeError         <- obj.missing_attr
      +-- FileNotFoundError  --+
      +-- PermissionError    --+-- sab OSError ke subclasses
      +-- ...                --+
      +-- RuntimeError
      +-- StopIteration
\`\`\`

**Ek base pakadna har subclass pakadता hai**

\`\`\`python
try:
    open("/no/such/file")
except OSError as e:            # FileNotFoundError EK OSError HAI
    print(type(e).__name__)     # FileNotFoundError
\`\`\`

**Apna khud define karna**

\`\`\`python
class AppError(Exception):
    """Sab kuch ke liye base jo ye app jaan-boojhkar raise karता hai."""

class OrderError(AppError):
    pass

class OrderNotShippable(OrderError):
    def __init__(self, order_id, reason):
        super().__init__(f"order {order_id} cannot ship: {reason}")
        self.order_id = order_id
        self.reason = reason

raise OrderNotShippable(42, "out of stock")
# callers OrderNotShippable, ya OrderError, ya AppError, ya Exception pakad sakte hain
\`\`\`

\`\`\`
BaseException   root. Iske non-Exception children SystemExit, KeyboardInterrupt,
                GeneratorExit hain -- "control flow" signals, errors NAHI. Kabhi
                BaseException pakadो mat ya nanga 'except:' istemal mat karo.

Exception       sab normal errors ke liye base. 'except Exception' iske neeche
                sab kuch pakadता hai (abhi bhi aam taur par bahut chauda).

except X        X aur X ke KISI bhi subclass ko match karता hai (isinstance semantics).

Custom exceptions:
  - Exception subclass karo (ya ek zyaada specific built-in agar ye sachmuch fit hai)
  - apne app ko EK base class do (class AppError(Exception)) taaki callers "is library
    se koi bhi error" pakad sakein bina asambandhit bugs pakde
  - structured data ko attributes ki tarah store karo (self.order_id), sirf ek string nahi
  - unhe CONDITION ke liye naam do (OrderNotShippable), location ke liye nahi
\`\`\``,

    content: `## The built-ins you will actually catch

\`\`\`
ValueError        a function got an argument of the right type but an invalid value
                  int("x"), math.sqrt(-1), datetime(2024, 13, 1)
TypeError         an operation applied to an object of the wrong type
                  "a" + 1, len(5), None.strip()
KeyError          a dict key that is not present -- d["missing"]
IndexError        a sequence index out of range -- lst[100]
AttributeError    accessing a missing attribute -- often "NoneType has no attribute X"
FileNotFoundError / PermissionError / IsADirectoryError / ...   all subclasses of OSError
StopIteration     an iterator is exhausted (normally handled for you by 'for')
RuntimeError      a generic "something went wrong" when nothing more specific fits
NotImplementedError   a method that a subclass is required to override
\`\`\`

## \`BaseException\` vs \`Exception\` — the important line

\`\`\`python
# WRONG -- traps Ctrl-C and sys.exit():
try:
    long_running_loop()
except BaseException:
    pass

# WRONG for the same reason:
try:
    long_running_loop()
except:                          # bare except == except BaseException
    pass

# acceptable at a top level, if you log and re-raise or continue deliberately:
try:
    handle_one_request()
except Exception:
    logger.exception("request failed")   # logs the full traceback
\`\`\`

\`KeyboardInterrupt\`, \`SystemExit\`, and \`GeneratorExit\` derive from \`BaseException\` but *not* from \`Exception\`, specifically so that ordinary error handling does not accidentally block the user from killing the program or a clean \`sys.exit()\`.

## Defining a custom exception properly

\`\`\`python
class PaymentError(Exception):
    """Base class for all payment failures raised by this module."""

class CardDeclined(PaymentError):
    def __init__(self, code, message):
        super().__init__(f"card declined ({code}): {message}")
        self.code = code
        self.message = message

class InsufficientFunds(CardDeclined):
    pass
\`\`\`

- **Always subclass \`Exception\`** (or a specific built-in only if your error genuinely *is* that kind — e.g. a custom validation error can subclass \`ValueError\`).
- **Give the module/app one base** (\`PaymentError\`) so a caller can \`except PaymentError\` to mean "any expected failure from this component" without also catching a \`TypeError\` bug.
- **Call \`super().__init__(message)\`** so \`str(e)\` works and the message shows in tracebacks.
- **Attach structured fields** (\`self.code\`) so handlers can branch on data, not parse a string.

## Catching your hierarchy

\`\`\`python
try:
    charge(card, amount)
except InsufficientFunds:
    prompt_top_up()
except CardDeclined as e:
    show_decline(e.code)
except PaymentError:
    show_generic_payment_error()
# a KeyError or AttributeError here is a bug and correctly propagates
\`\`\`

Because the classes form a tree, a caller chooses the granularity: catch the leaf for a precise response, catch a middle node for a category, catch the base for "anything this module raises on purpose".

## \`.args\` and the exception message

\`\`\`python
e = ValueError("bad", 42)
e.args            # ('bad', 42)
str(e)            # "('bad', 42)"   -- with 2+ args, str is the tuple repr
e2 = ValueError("bad")
e2.args           # ('bad',)
str(e2)           # 'bad'           -- with 1 arg, str is that arg
\`\`\`

Pass a single readable string to the base \`__init__\` for a clean \`str(e)\`; keep extra data in named attributes.`,

    contentHi: `## Wo built-ins jo aap asal mein pakdोge

\`\`\`
ValueError        ek function ko sahi type ka argument mila par ek invalid value
                  int("x"), math.sqrt(-1)
TypeError         galat type ke ek object par lagaaya ek operation
                  "a" + 1, len(5), None.strip()
KeyError          ek dict key jo maujood nahi -- d["missing"]
IndexError        ek sequence index out of range -- lst[100]
AttributeError    ek missing attribute access karna -- aksar "NoneType has no attribute X"
FileNotFoundError / PermissionError / ...   sab OSError ke subclasses
StopIteration     ek iterator khatam ho gaya (aam taur par 'for' aapke liye handle karता hai)
RuntimeError      ek generic "kuch galat hua" jab kuch zyaada specific fit nahi hota
NotImplementedError   ek method jise ek subclass ko override karna zaroori hai
\`\`\`

## \`BaseException\` vs \`Exception\` — mahatvapurna line

\`\`\`python
# GALAT -- Ctrl-C aur sys.exit() phasata hai:
try:
    long_running_loop()
except BaseException:
    pass

# usi kaaran GALAT:
try:
    long_running_loop()
except:                          # nanga except == except BaseException
    pass

# ek top level par sweekaarya, agar aap log karें aur re-raise ya jaan-boojhkar continue karें:
try:
    handle_one_request()
except Exception:
    logger.exception("request failed")   # poora traceback log karता hai
\`\`\`

\`KeyboardInterrupt\`, \`SystemExit\`, aur \`GeneratorExit\` \`BaseException\` se derive karte hain par \`Exception\` se *nahi*, vishesh roop se taaki saamaanya error handling galti se user ko program maarne se ya ek saaf \`sys.exit()\` se block na kare.

## Ek custom exception thik se define karna

\`\`\`python
class PaymentError(Exception):
    """Is module dwara raise ki gayi sab payment failures ke liye base class."""

class CardDeclined(PaymentError):
    def __init__(self, code, message):
        super().__init__(f"card declined ({code}): {message}")
        self.code = code
        self.message = message

class InsufficientFunds(CardDeclined):
    pass
\`\`\`

- **Hamesha \`Exception\` subclass karo** (ya ek specific built-in sirf agar aapka error sachmuch us tarah ka *hai*).
- **Module/app ko ek base do** (\`PaymentError\`) taaki ek caller \`except PaymentError\` kar sake matlab "is component se koi bhi ummeed ki gayi failure" bina ek \`TypeError\` bug bhi pakde.
- **\`super().__init__(message)\` call karo** taaki \`str(e)\` kaam kare aur message tracebacks mein dikhe.
- **Structured fields attach karo** (\`self.code\`) taaki handlers data par branch karें, ek string parse na karें.

## Apni hierarchy pakadna

\`\`\`python
try:
    charge(card, amount)
except InsufficientFunds:
    prompt_top_up()
except CardDeclined as e:
    show_decline(e.code)
except PaymentError:
    show_generic_payment_error()
# yahaan ek KeyError ya AttributeError ek bug hai aur sahi tarike se propagate hota hai
\`\`\`

Kyunki classes ek tree banate hain, ek caller granularity chunता hai: ek precise response ke liye leaf pakdो, ek category ke liye ek middle node, "jo bhi ye module jaan-boojhkar raise karता hai" ke liye base.

## \`.args\` aur exception message

\`\`\`python
e = ValueError("bad", 42)
e.args            # ('bad', 42)
str(e)            # "('bad', 42)"   -- 2+ args ke saath, str tuple repr hai
e2 = ValueError("bad")
e2.args           # ('bad',)
str(e2)           # 'bad'           -- 1 arg ke saath, str wo arg hai
\`\`\`

Ek saaf \`str(e)\` ke liye base \`__init__\` ko ek akela readable string pass karो; extra data named attributes mein rakho.`,

    examples: [
      {
        title: 'Catching a base class catches all its subclasses',
        titleHi: 'Ek base class pakadna iske sab subclasses pakadता hai',
        code: `# a base class catches every subclass -- KeyError and IndexError both subclass LookupError:
for make, label in [(lambda: {}["x"], "dict"), (lambda: [][0], "list")]:
    try:
        make()
    except LookupError as e:
        print(f"{label:5} raised {type(e).__name__}, caught as LookupError")

# FileNotFoundError is an OSError:
try:
    open("/no/such/path/anywhere/at/all")
except OSError as e:
    print("missing file -> caught as OSError:", type(e).__name__)

# the tree, via issubclass:
print("FileNotFoundError < OSError:", issubclass(FileNotFoundError, OSError))
print("OSError < Exception:", issubclass(OSError, Exception))
print("KeyError, IndexError < LookupError:",
      issubclass(KeyError, LookupError), issubclass(IndexError, LookupError))
print("KeyboardInterrupt < Exception:", issubclass(KeyboardInterrupt, Exception))
print("KeyboardInterrupt < BaseException:", issubclass(KeyboardInterrupt, BaseException))`,
        output: `dict  raised KeyError, caught as LookupError
list  raised IndexError, caught as LookupError
missing file -> caught as OSError: FileNotFoundError
FileNotFoundError < OSError: True
OSError < Exception: True
KeyError, IndexError < LookupError: True True
KeyboardInterrupt < Exception: False
KeyboardInterrupt < BaseException: True`,
        explain: '`{}["x"]` raises `KeyError` and `[][0]` raises `IndexError`; both subclass `LookupError`, so one `except LookupError` catches either. `open()` on a missing path raises `FileNotFoundError`, caught by `except OSError` because it is a subclass. `issubclass` confirms the tree: `FileNotFoundError < OSError < Exception < BaseException`, but `KeyboardInterrupt` is under `BaseException` and NOT under `Exception` — which is why `except Exception` leaves Ctrl-C working.',
        explainHi: '`{}["x"]` `KeyError` raise karता hai aur `[][0]` `IndexError`; dono `LookupError` subclass karते hain, isliye ek `except LookupError` koi bhi pakadता hai. Ek missing path par `open()` `FileNotFoundError` raise karता hai, `except OSError` dwara pakda kyunki ye ek subclass hai. `issubclass` tree confirm karता hai, par `KeyboardInterrupt` `BaseException` ke neeche hai aur `Exception` ke neeche NAHI.',
      },
      {
        title: 'A custom exception hierarchy with structured data',
        titleHi: 'Structured data ke saath ek custom exception hierarchy',
        code: `class ShopError(Exception):
    """Base for all deliberate errors from the shop module."""

class ProductError(ShopError):
    pass

class OutOfStock(ProductError):
    def __init__(self, sku, requested, available):
        super().__init__(f"{sku}: wanted {requested}, only {available} in stock")
        self.sku = sku
        self.requested = requested
        self.available = available

def reserve(sku, qty, stock):
    if sku not in stock:
        raise ProductError(f"unknown SKU: {sku}")
    if stock[sku] < qty:
        raise OutOfStock(sku, qty, stock[sku])
    stock[sku] -= qty
    return f"reserved {qty} x {sku}"

stock = {"A1": 5, "B2": 0}
for sku, qty in [("A1", 2), ("A1", 99), ("B2", 1), ("Z9", 1)]:
    try:
        print(reserve(sku, qty, stock))
    except OutOfStock as e:
        print(f"  OutOfStock: short by {e.requested - e.available} ({e.sku})")
    except ShopError as e:
        print(f"  ShopError: {e}")`,
        output: `reserved 2 x A1
  OutOfStock: short by 96 (A1)
  OutOfStock: short by 1 (B2)
  ShopError: unknown SKU: Z9`,
        explain: 'The handler catches `OutOfStock` specifically and uses its structured fields (`e.requested`, `e.available`, `e.sku`) to compute a precise message — no string parsing. `ProductError("unknown SKU")` is caught by the broader `except ShopError`. Any unexpected bug (say a `TypeError`) would not match either handler and would propagate as a real error.',
        explainHi: 'Handler `OutOfStock` ko vishesh roop se pakadता hai aur iske structured fields (`e.requested`, `e.available`, `e.sku`) istemal karके ek precise message compute karता hai — koi string parsing nahi. `ProductError("unknown SKU")` chaude `except ShopError` dwara pakda jाता hai. Koi bhi anhonahi bug (maano ek `TypeError`) kisi handler se match nahi karega.',
      },
      {
        title: 'Subclassing a built-in when it genuinely fits',
        titleHi: 'Ek built-in subclass karna jab ye sachmuch fit hai',
        code: `class RangeValueError(ValueError):
    """A value outside an allowed numeric range -- IS-A ValueError."""
    def __init__(self, name, value, lo, hi):
        super().__init__(f"{name}={value} not in [{lo}, {hi}]")
        self.name, self.value, self.lo, self.hi = name, value, lo, hi

def set_volume(v):
    if not (0 <= v <= 100):
        raise RangeValueError("volume", v, 0, 100)
    return v

# a caller that only knows about ValueError still handles it correctly:
for v in [50, 150]:
    try:
        print("volume set to", set_volume(v))
    except ValueError as e:            # catches RangeValueError too
        print("rejected:", e)

# a caller that wants the details can catch the specific type:
try:
    set_volume(-3)
except RangeValueError as e:
    print(f"detail: {e.name} was {e.value}, allowed {e.lo}..{e.hi}")`,
        output: `volume set to 50
rejected: volume=150 not in [0, 100]
detail: volume was -3, allowed 0..100`,
        explain: '`RangeValueError` subclasses `ValueError` because a range violation genuinely *is* a kind of invalid value. Existing code that catches `ValueError` (common for input validation) handles it with no changes. Code that wants the structured detail catches `RangeValueError` directly. Only subclass a built-in when the "is-a" relationship is real — otherwise subclass `Exception`.',
        explainHi: '`RangeValueError` `ValueError` subclass karता hai kyunki ek range violation sachmuch ek tarah ki invalid value *hai*. Maujood code jo `ValueError` pakadता hai ise bina badlaav handle karता hai. Code jo structured detail chahता hai `RangeValueError` seedhe pakadता hai. Ek built-in ko sirf tab subclass karो jab "is-a" sambandh asli hai.',
      },
    ],

    mistakes: [
      {
        wrong: `while True:
    try:
        item = queue.get()
        handle(item)
    except:              # bare except
        continue`,
        right: `while True:
    try:
        item = queue.get()
        handle(item)
    except Exception:
        logger.exception("handler failed")   # KeyboardInterrupt now still works
        continue`,
        why: 'A bare `except:` is equivalent to `except BaseException:` — it catches `KeyboardInterrupt` (so Ctrl-C is ignored and you cannot stop the loop) and `SystemExit` (so `sys.exit()` inside `handle` does nothing). Use `except Exception` at minimum, and log rather than silently `continue`.',
        whyHi: 'Ek nanga `except:` `except BaseException:` ke barabar hai — ye `KeyboardInterrupt` pakadता hai (isliye Ctrl-C ignore hota hai aur aap loop rok nahi sakte) aur `SystemExit` (isliye `handle` ke andar `sys.exit()` kuch nahi karता). Kam se kam `except Exception` istemal karो, aur chupchaap `continue` ke bजाय log karो.',
      },
      {
        wrong: `class UserNotFound(Exception):
    pass

raise UserNotFound(user_id)          # str(e) is just the bare id, no context`,
        right: `class UserNotFound(Exception):
    def __init__(self, user_id):
        super().__init__(f"no user with id {user_id}")
        self.user_id = user_id`,
        why: 'Raising with a bare value gives an unhelpful `str(e)` and forces every handler to reconstruct the message. Define `__init__` to build a readable message via `super().__init__(...)` and store the raw value as an attribute for handlers that need it.',
        whyHi: 'Ek bare value ke saath raise karna ek bekaar `str(e)` deta hai aur har handler ko message dobara banane par majboor karता hai. `__init__` define karो ek readable message banane ko `super().__init__(...)` ke zariye aur raw value ko ek attribute ki tarah store karो.',
      },
      {
        wrong: `# a "utility" module with one exception per function:
class ParseUserFailed(Exception): pass
class ParseOrderFailed(Exception): pass
class ParseItemFailed(Exception): pass
# no common base -> a caller must list all three to catch "any parse failure"`,
        right: `class ParseError(Exception): pass
class ParseUserError(ParseError): pass
class ParseOrderError(ParseError): pass
# caller: except ParseError  -> catches all of them`,
        why: 'Flat, unrelated exception classes force callers to enumerate every one to handle a category. Give related exceptions a shared base class so a caller can catch the base for "any error of this kind" and the leaves for precise handling.',
        whyHi: 'Flat, asambandhit exception classes callers ko ek category handle karne ko har ek ginne par majboor karti hain. Sambandhit exceptions ko ek shared base class do taaki ek caller "is tarah ka koi bhi error" ke liye base pakad sake.',
      },
    ],

    realWorld: [
      {
        en: '**Every well-designed library has one base exception** — `requests.RequestException`, `sqlalchemy.exc.SQLAlchemyError`, `redis.RedisError`, DRF `APIException`. You catch the base to mean "any failure from this library" and specific subclasses (`requests.Timeout`, `requests.ConnectionError`) for targeted handling.',
        hi: '**Har achhe-design ki library mein ek base exception hai** — `requests.RequestException`, `sqlalchemy.exc.SQLAlchemyError`, DRF `APIException`. Aap base pakadते ho matlab "is library se koi bhi failure" aur specific subclasses (`requests.Timeout`) targeted handling ke liye.',
      },
      {
        en: '**DRF\'s `APIException` subclasses carry `status_code` and `default_detail`** — `NotFound` (404), `PermissionDenied` (403), `ValidationError` (400) are all `APIException` subclasses, and DRF\'s exception handler reads those attributes to build the HTTP response. Your custom API errors subclass `APIException` and set those class attributes.',
        hi: '**DRF ki `APIException` subclasses `status_code` aur `default_detail` le jाती hain** — `NotFound` (404), `PermissionDenied` (403), `ValidationError` (400) sab `APIException` subclasses hain, aur DRF ka exception handler un attributes ko padhता hai HTTP response banane ko.',
      },
      {
        en: '**Catching `Exception` (not `BaseException`) in a Celery task or a request handler is the standard top-level pattern** — log the full traceback with `logger.exception(...)`, mark the job failed, and move on, while still letting `KeyboardInterrupt`/`SystemExit` shut the worker down cleanly.',
        hi: '**Ek Celery task ya ek request handler mein `Exception` (`BaseException` nahi) pakadna standard top-level pattern hai** — `logger.exception(...)` se poora traceback log karो, job failed mark karो, aur aage badhो, jabki abhi bhi `KeyboardInterrupt`/`SystemExit` ko worker saaf band karne dो.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the difference between `BaseException` and `Exception`. Why does it matter for `except` clauses?',
        qHi: '`BaseException` aur `Exception` mein antar samjhaao. `except` clauses ke liye ye kyun maayne rakhता hai?',
        a: 'BaseException is the root of the entire exception class hierarchy — every raisable object is an instance of a class that ultimately derives from it. Exception is a direct child of BaseException and is the base class for essentially all normal error conditions: ValueError, TypeError, KeyError, OSError and its file-system subclasses, RuntimeError, and so on. The key design decision is that three specific classes derive from BaseException but deliberately not from Exception: KeyboardInterrupt, which is raised when the user presses Ctrl-C; SystemExit, which is raised by sys.exit to unwind the stack and end the program; and GeneratorExit, used internally when a generator is closed. These are not errors in the normal sense — they are control-flow signals that something outside your code wants the program, or a generator, to stop. By placing them outside Exception, Python ensures that the common, correct pattern of writing except Exception to handle errors does not accidentally trap them. If you catch KeyboardInterrupt, Ctrl-C stops working and the user cannot interrupt a runaway loop. If you catch SystemExit, a sys.exit call somewhere inside the try becomes a no-op and the program keeps running when it was told to stop. This is why two forms are considered wrong: except BaseException, which explicitly catches everything, and a bare except with no type, which is exactly equivalent to except BaseException. The guidance is to never catch above Exception. Catch the specific type you can handle; if you genuinely need a broad catch — a top-level handler in a server loop or a task runner — use except Exception, and log the exception or re-raise rather than silently swallowing it, so that KeyboardInterrupt and SystemExit still propagate and shut things down cleanly.',
        aHi: 'BaseException poori exception class hierarchy ka root hai — har raisable object ek class ka instance hai jo aakhirkar isse derive karता hai. Exception BaseException ka ek seedha child hai aur lagbhag sab normal error conditions ke liye base class hai: ValueError, TypeError, KeyError, OSError, aur aage. Mukhya design nirnay ye hai ki teen specific classes BaseException se derive karti hain par jaan-boojhkar Exception se nahi: KeyboardInterrupt, jo tab raise hota hai jab user Ctrl-C dabaता hai; SystemExit, jo sys.exit dwara raise hota hai; aur GeneratorExit. Ye saamaanya arth mein errors nahi hain — ye control-flow signals hain. Unhe Exception ke baahar rakhkar, Python sunishchit karता hai ki errors handle karne ka aam pattern except Exception galti se unhe phasaता nahi. Agar aap KeyboardInterrupt pakadते ho, Ctrl-C kaam karna band kar deta hai. Isliye do roop galat maane jाते hain: except BaseException, aur ek nanga except. Maargdarshan Exception se upar kabhi na pakadna hai.',
      },
      {
        q: 'How should you design custom exceptions for a module or application?',
        qHi: 'Ek module ya application ke liye aapko custom exceptions kaise design karne chahiye?',
        a: 'Start with a single base class for your module or component, subclassing Exception, named something like PaymentError or ShopError. Its only job is to be a common ancestor, so that a caller can write except PaymentError to mean "any error this component raises on purpose" without also catching unrelated bugs like a TypeError or an AttributeError from a coding mistake. Then define more specific subclasses under that base for the distinct error conditions your code actually has — CardDeclined, InsufficientFunds, GatewayTimeout — and you can nest further where there is a genuine is-a relationship, for example InsufficientFunds as a subclass of CardDeclined. Name each class for the condition it represents, not for where it is raised — OutOfStock, not ReserveMethodError. Give each one an init that calls super().init with a single, readable, fully-formed message string, so that str of the exception and the traceback are informative without any handler needing to reconstruct anything. Alongside that, store the structured data as named attributes — self.sku, self.requested, self.available — so that a handler can branch on real values and build its own message, rather than parsing the string. Decide whether to subclass Exception directly or a built-in: only subclass a built-in like ValueError or KeyError when your error genuinely is a more specific case of it, such that existing code catching the built-in should also catch yours; a range-check failure subclassing ValueError is reasonable, but a domain error like OrderNotShippable should subclass your own base, not a built-in. Keep the hierarchy shallow — two or three levels is usually enough. The payoff is that callers choose their granularity: the leaf class for a precise recovery, a middle class for a category, the base class for "anything from this module".',
        aHi: 'Apne module ke liye ek akele base class se shuru karो, Exception subclass karके, PaymentError ya ShopError jaisा naam. Iska ekmatra kaam ek common ancestor hona hai, taaki ek caller except PaymentError likh sake matlab "koi bhi error jo ye component jaan-boojhkar raise karता hai" bina ek TypeError jaise asambandhit bugs bhi pakde. Phir us base ke neeche zyaada specific subclasses define karो un alag error conditions ke liye jo aapke code ke paas asal mein hain — CardDeclined, InsufficientFunds. Har class ko us condition ke liye naam do jise ye represent karता hai, iske raise hone ki jagah ke liye nahi. Har ek ko ek init do jo super().init ko ek akele, readable message string ke saath call kare. Iske saath, structured data ko named attributes ki tarah store karो. Tay karो ki Exception seedhe subclass karें ya ek built-in: ek built-in ko sirf tab subclass karो jab aapka error sachmuch iska ek zyaada specific case hai. Hierarchy shallow rakho.',
      },
    ],

    exercises: [
      {
        task: 'Print a small slice of the exception tree: use `issubclass` to verify `FileNotFoundError < OSError < Exception < BaseException`, and that `KeyError < LookupError` and `IndexError < LookupError`. Then show `except LookupError` catches BOTH a `KeyError` (from `{}["x"]`) and an `IndexError` (from `[][0]`).',
        taskHi: 'Exception tree ka ek chhota slice print karो: `issubclass` istemal karके verify karो `FileNotFoundError < OSError < Exception < BaseException`, aur ki `KeyError < LookupError` aur `IndexError < LookupError`. Phir dikhाओ `except LookupError` DONO ek `KeyError` aur ek `IndexError` pakadता hai.',
        hint: '`LookupError` is the shared base of `KeyError` and `IndexError`. `try: {}["x"] except LookupError as e: print(type(e).__name__)` prints `KeyError`; the same handler catches `[][0]` as `IndexError`.',
        hintHi: '`LookupError` `KeyError` aur `IndexError` ka shared base hai. `try: {}["x"] except LookupError as e: print(type(e).__name__)` `KeyError` print karता hai.',
      },
      {
        task: 'Build a `ValidationError(Exception)` base with subclasses `RequiredФieldError` and `RangeError` — sorry, `RequiredFieldError` and `RangeError`. Each stores `field` and a message. Write `validate(data)` that raises the right one for missing/out-of-range fields. Show a caller catching `ValidationError` (the base) collecting all errors, and another catching `RangeError` specifically.',
        taskHi: 'Ek `ValidationError(Exception)` base banाओ subclasses `RequiredFieldError` aur `RangeError` ke saath. Har ek `field` aur ek message store karता hai. `validate(data)` likhो jo missing/out-of-range fields ke liye sahi wala raise kare. Ek caller dikhाओ jo `ValidationError` (base) pakadता hai, aur doosra jo `RangeError` vishesh roop se.',
        hint: 'Base: `class ValidationError(Exception): def __init__(self, field, msg): super().__init__(f"{field}: {msg}"); self.field = field`. Subclasses just `pass` (or override for extra data). `except ValidationError` catches both subclasses.',
        hintHi: 'Base: `class ValidationError(Exception): def __init__(self, field, msg): super().__init__(f"{field}: {msg}"); self.field = field`. Subclasses bas `pass`. `except ValidationError` dono subclasses pakadता hai.',
      },
      {
        task: 'Write a `retry(fn, on, times=3)` helper: call `fn()`; if it raises an exception that is an instance of `on` (a single class or tuple), retry up to `times`; if it raises anything else, let it propagate immediately. Test with a function that raises `ConnectionError` twice then succeeds (retried), and one that raises `ValueError` (propagates on the first try).',
        taskHi: 'Ek `retry(fn, on, times=3)` helper likhो: `fn()` call karो; agar ye ek exception raise karता hai jo `on` ka ek instance hai, `times` tak retry karो; agar ye kuch aur raise karता hai, ise turant propagate hone do. Test karो ek function ke saath jo `ConnectionError` do baar raise karता hai phir safal hota hai, aur ek jo `ValueError` raise karता hai.',
        hint: '`for attempt in range(times): try: return fn() except on: if attempt == times - 1: raise`. A `ValueError` when `on=ConnectionError` does not match the `except on` and propagates out of the loop immediately.',
        hintHi: '`for attempt in range(times): try: return fn() except on: if attempt == times - 1: raise`. Jab `on=ConnectionError` ho to ek `ValueError` `except on` se match nahi karता aur turant loop se propagate hota hai.',
      },
    ],

    keyTakeaways: [
      'Exceptions form an inheritance tree. `except X` matches `X` and EVERY subclass of `X` (`isinstance` semantics). Put specific handlers before broader ones.',
      '`BaseException` is the root. `KeyboardInterrupt`, `SystemExit`, `GeneratorExit` derive from it but NOT from `Exception` — they are control-flow signals, not errors.',
      'NEVER catch `BaseException` or use bare `except:` — both trap Ctrl-C and `sys.exit()`. Use `except Exception` at most, and only at a top level where you log or re-raise.',
      'Common built-ins: `ValueError` (right type, bad value), `TypeError` (wrong type), `KeyError`/`IndexError` (missing key/index, both `LookupError`), `AttributeError`, `OSError` family (`FileNotFoundError`, `PermissionError`).',
      'For custom exceptions: subclass `Exception`, give your module ONE base class (`class AppError(Exception)`) so callers can catch "any deliberate error from this component".',
      'Define `__init__` calling `super().__init__(readable_message)` so `str(e)` and tracebacks are useful; store structured data as named attributes (`self.order_id`).',
      'Name exceptions for the CONDITION (`OutOfStock`), not the code location. Keep the hierarchy shallow (2-3 levels).',
      'Only subclass a built-in (e.g. `ValueError`) when your error genuinely IS-A that kind, so existing handlers for the built-in also catch yours.',
    ],
    keyTakeawaysHi: [
      'Exceptions ek inheritance tree banate hain. `except X` `X` aur `X` ke HAR subclass ko match karता hai. Specific handlers ko chaude waalo se pehle rakho.',
      '`BaseException` root hai. `KeyboardInterrupt`, `SystemExit`, `GeneratorExit` isse derive karte hain par `Exception` se NAHI — ye control-flow signals hain, errors nahi.',
      'KABHI `BaseException` pakadो mat ya nanga `except:` istemal mat karो — dono Ctrl-C aur `sys.exit()` phasate hain. Zyaada se zyaada `except Exception`, aur sirf ek top level par jahaan aap log ya re-raise karते ho.',
      'Aam built-ins: `ValueError` (sahi type, kharaab value), `TypeError` (galat type), `KeyError`/`IndexError` (missing key/index, dono `LookupError`), `AttributeError`, `OSError` family.',
      'Custom exceptions ke liye: `Exception` subclass karो, apne module ko EK base class do (`class AppError(Exception)`) taaki callers "is component se koi bhi jaan-boojhkar error" pakad sakein.',
      '`__init__` define karो jo `super().__init__(readable_message)` call kare taaki `str(e)` aur tracebacks upyogi hon; structured data ko named attributes ki tarah store karो.',
      'Exceptions ko CONDITION ke liye naam do (`OutOfStock`), code location ke liye nahi. Hierarchy shallow rakho (2-3 levels).',
      'Ek built-in ko (jaise `ValueError`) sirf tab subclass karो jab aapka error sachmuch us tarah ka HAI, taaki built-in ke maujood handlers aapka bhi pakdें.',
    ],
  },

  {
    slug: 'py-eafp-vs-lbyl',
    title: 'EAFP vs LBYL, and What Not to Catch',
    titleHi: 'EAFP vs LBYL, Aur Kya Nahi Pakadna',
    description: 'Checking `if key in d` before `d[key]`, then `if os.path.exists(path)` before `open(path)`, then `if hasattr(obj, "x")` before `obj.x` — building a wall of pre-checks that are verbose, race-prone, and still miss cases. Python\'s idiom is the opposite: attempt the operation and handle the specific exception if it fails. Knowing when each style fits, and which exceptions you must never swallow, is the difference between robust code and code that hides its own bugs.',
    descriptionHi: '`d[key]` se pehle `if key in d` check karna, phir `open(path)` se pehle `if os.path.exists(path)`, phir `obj.x` se pehle `if hasattr(obj, "x")` — pre-checks ki ek deewaar banana jo verbose, race-prone hain, aur phir bhi cases miss karti hain. Python ka idiom ulta hai: operation ki koshish karो aur agar ye fail ho to specific exception handle karो. Har style kab fit hai jaanna, aur kaunse exceptions aapko kabhi nigalne nahi chahiye, robust code aur apne bugs chhupane waale code ke beech antar hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**Trying the door versus inspecting the lock first.** "Look before you leap" is walking up to a door and, before touching the handle, checking the hinges, reading the sign, testing whether the handle is the kind that turns, confirming the room beyond is the one you want — and then finally opening it. "Easier to ask forgiveness than permission" is just trying the handle: if it opens, walk through; if it is locked, you get a clear "locked" response and deal with that one specific case. The forgiveness approach is usually better in Python for two reasons. First, the inspection is never complete — you checked the hinges but not that someone removed the floor behind the door — so you end up handling the failure anyway, now in two places. Second, between your inspection and your action, someone else can change the lock; the check told you about a world that no longer exists by the time you act. But inspection wins in a few cases: when the "try" has a side effect you cannot undo if a later step fails, when a quick check avoids expensive work that would just be thrown away, or when failure is the normal expected path rather than the exception. And a rule that overrides both: whichever you choose, never respond to *every* possible problem with the same shrug — a locked door and the building being on fire are not the same event.',
      hi: '**Darwaaza try karna versus pehle lock inspect karna.** "Kudne se pehle dekho" ek darwaaze tak jaकर, handle chhoone se pehle, hinges check karna, sign padhna, test karna ki handle wo tarah ka hai jo ghुमता hai — aur phir aakhirkar ise kholna. "Anumati se aasaan maafi maangna" bas handle try karna hai: agar khुलता hai, chalो; agar locked hai, aapko ek saaf "locked" jawaab milता hai. Maafi approach Python mein aam taur par do kaaran se behtar hai. Pehla, inspection kabhi poora nahi hota. Doosra, aapki inspection aur aapke action ke beech, koi aur lock badal sakta hai. Par inspection kuch cases mein jeetता hai: jab "try" ka ek side effect hai jise aap undo nahi kar sakte, jab ek quick check mehنge kaam se bachता hai, ya jab failure normal ummeed ki gayi path hai. Aur ek niyam jo dono ko override karता hai: jo bhi aap chunो, *har* sambhav samasya ka wahi jawaab kabhi mat dो.',
    },

    simple: `**LBYL (Look Before You Leap) — the pre-check style**

\`\`\`python
if key in data:
    value = data[key]
else:
    value = default

if os.path.exists(path):
    with open(path) as f:
        content = f.read()
else:
    content = ""
\`\`\`

**EAFP (Easier to Ask Forgiveness than Permission) — the Python idiom**

\`\`\`python
try:
    value = data[key]
except KeyError:
    value = default
# or just: value = data.get(key, default)

try:
    with open(path) as f:
        content = f.read()
except FileNotFoundError:
    content = ""
\`\`\`

**Why EAFP is usually preferred**

\`\`\`python
# LBYL has a race condition (TOCTOU: time-of-check to time-of-use):
if os.path.exists(path):        # true now...
    open(path)                  # ...but the file was deleted in between -> crash anyway

# LBYL duplicates the logic the operation already does:
if isinstance(x, int) and x != 0 and 100 % x == 0:   # re-implementing division rules
    ...
# EAFP just does it:
try:
    result = 100 / x
except (TypeError, ZeroDivisionError):
    ...
\`\`\`

\`\`\`
EAFP: attempt the operation; catch the SPECIFIC exception if it fails.
      - matches how Python is designed (dict.get, getattr with default, etc.)
      - no race condition between check and use
      - does not re-implement the checks the operation already performs
      - fast path (success) has zero overhead

LBYL: check preconditions first, then act. Prefer it when:
      - the action has a side effect you cannot roll back if a LATER line fails
      - a cheap check avoids expensive work (don't download then validate; validate first)
      - failure is the COMMON case, not the exception (exceptions are cheap to raise
        but not free; a check can read clearer for an expected branch)

NEVER, either way:
  - bare 'except:' or 'except BaseException:'  (traps Ctrl-C / sys.exit)
  - 'except Exception: pass'  with no logging  (silent bug graveyard)
  - catching an exception you cannot actually handle -- let it propagate
\`\`\``,

    simpleHi: `**LBYL (Kudne Se Pehle Dekho) — pre-check style**

\`\`\`python
if key in data:
    value = data[key]
else:
    value = default

if os.path.exists(path):
    with open(path) as f:
        content = f.read()
else:
    content = ""
\`\`\`

**EAFP (Anumati Se Aasaan Maafi Maangna) — Python idiom**

\`\`\`python
try:
    value = data[key]
except KeyError:
    value = default
# ya bas: value = data.get(key, default)

try:
    with open(path) as f:
        content = f.read()
except FileNotFoundError:
    content = ""
\`\`\`

**EAFP aam taur par kyun prefer kiya jाता hai**

\`\`\`python
# LBYL mein ek race condition hai (TOCTOU: time-of-check to time-of-use):
if os.path.exists(path):        # abhi true...
    open(path)                  # ...par file beech mein delete ho gayi -> phir bhi crash

# LBYL us logic ko duplicate karता hai jo operation pehle se karता hai:
if isinstance(x, int) and x != 0 and 100 % x == 0:   # division rules dobara implement
    ...
# EAFP bas karता hai:
try:
    result = 100 / x
except (TypeError, ZeroDivisionError):
    ...
\`\`\`

\`\`\`
EAFP: operation ki koshish karो; agar fail ho to SPECIFIC exception pakdो.
      - Python kaise design kiya gaya usse mel khाता hai (dict.get, getattr with default)
      - check aur use ke beech koi race condition nahi
      - un checks ko dobara implement nahi karता jo operation pehle se karता hai
      - fast path (success) mein zero overhead

LBYL: pehle preconditions check karो, phir act karो. Ise prefer karो jab:
      - action ka ek side effect hai jise aap roll back nahi kar sakte agar ek BAAD ki line fail ho
      - ek sasta check mehنge kaam se bचता hai (download phir validate mat karो; pehle validate)
      - failure AAM case hai, exception nahi

KABHI, kisi bhi tarah:
  - nanga 'except:' ya 'except BaseException:'  (Ctrl-C / sys.exit phasata hai)
  - 'except Exception: pass'  bina logging  (silent bug kabristan)
  - ek exception pakadna jise aap asal mein handle nahi kar sakte -- ise propagate hone do
\`\`\``,

    content: `## The built-in EAFP helpers

Python's API is built for EAFP — many operations have a "with default" form so you rarely need an explicit \`try\`:

\`\`\`python
data.get(key)                    # None if missing, no KeyError
data.get(key, default)
data.setdefault(key, [])         # get-or-insert
getattr(obj, "name", fallback)   # no AttributeError
next(iterator, sentinel)         # no StopIteration
dict.pop(key, default)
os.environ.get("VAR", "")
\`\`\`

Reach for an explicit \`try/except\` when there is no "with default" form, when the recovery is more than "use a default", or when several lines share one failure mode.

## When LBYL is the right call

**1. The action is not safely repeatable / has an irreversible side effect partway:**

\`\`\`python
# EAFP is dangerous here: if step 2 fails, step 1 already happened
def transfer(a, b, amount):
    if a.balance < amount:            # check FIRST
        raise InsufficientFunds(a.id)
    a.balance -= amount               # now both steps are safe to run
    b.balance += amount
\`\`\`

**2. A cheap check avoids expensive work:**

\`\`\`python
# don't: fetch 2GB then discover it is the wrong format
if not url.endswith(".parquet"):
    raise ValueError("expected a .parquet URL")
data = download(url)                  # only after the cheap check passes
\`\`\`

**3. The "failure" is a normal, frequent branch:**

\`\`\`python
# if half your inputs legitimately lack the key, a check reads better
# than raising and catching KeyError on every other call
if "discount" in order:
    apply_discount(order["discount"])
\`\`\`
(Raising exceptions is cheap but not free; more importantly, an expected branch often reads more clearly as an \`if\`.)

## What you must never do

\`\`\`python
# 1. bare except -- catches KeyboardInterrupt, SystemExit
try: ...
except: ...

# 2. silent swallow -- the bug is gone forever, no log, no trace
try:
    result = compute()
except Exception:
    result = None            # was it a real failure or a bug in compute()? nobody knows

# 3. catching what you cannot handle
try:
    config = json.load(f)
except Exception:
    config = {}              # a JSONDecodeError -> {} is defensible;
                             # a MemoryError -> {} is absurd. Catch JSONDecodeError only.

# 4. catch-log-continue without re-raising, when the caller needed to know
def save(record):
    try:
        db.write(record)
    except DBError:
        logger.error("write failed")   # returns normally! caller thinks it saved
\`\`\`

## Re-raising correctly

\`\`\`python
try:
    risky()
except SomeError:
    logger.exception("risky failed")   # log with traceback
    raise                              # re-raise the SAME exception, preserving traceback

try:
    parse(x)
except ValueError as e:
    raise ConfigError("bad config file") from e   # wrap, keeping the cause (next lesson)
\`\`\`

If you catch only to log or clean up, end with a bare \`raise\` so the exception continues. Swallowing it changes the program's behaviour and hides the problem.

## A decision checklist

\`\`\`
Is there a "with default" builtin (dict.get, getattr, next)?   -> use it
Is the recovery just "use a default value"?                    -> try/except or the builtin
Does a failed attempt leave things half-done?                  -> LBYL (check first)
Would the attempt do expensive work before failing?            -> LBYL (cheap check first)
Is "failure" actually a common, expected branch?               -> LBYL (if/else reads clearer)
Otherwise                                                       -> EAFP, catch the SPECIFIC type
Can you actually recover here?                                 -> if no, don't catch it
\`\`\``,

    contentHi: `## Built-in EAFP helpers

Python ka API EAFP ke liye bana hai — kai operations mein ek "with default" roop hai taaki aapko shaayad hi ek explicit \`try\` chahiye:

\`\`\`python
data.get(key)                    # missing to None, koi KeyError nahi
data.get(key, default)
data.setdefault(key, [])         # get-or-insert
getattr(obj, "name", fallback)   # koi AttributeError nahi
next(iterator, sentinel)         # koi StopIteration nahi
dict.pop(key, default)
os.environ.get("VAR", "")
\`\`\`

Ek explicit \`try/except\` ke liye pahunchо jab koi "with default" roop nahi hai, jab recovery "ek default istemal karो" se zyaada hai, ya jab kai lines ek failure mode share karti hain.

## Jab LBYL sahi chunaav hai

**1. Action surakshit roop se repeatable nahi hai / beech mein ek irreversible side effect hai:**

\`\`\`python
# EAFP yahaan khatarnak hai: agar step 2 fail ho, step 1 pehle ho chuka
def transfer(a, b, amount):
    if a.balance < amount:            # pehle check karो
        raise InsufficientFunds(a.id)
    a.balance -= amount               # ab dono steps chalane ko surakshit hain
    b.balance += amount
\`\`\`

**2. Ek sasta check mehنge kaam se bचता hai:**

\`\`\`python
# mat karो: 2GB fetch karो phir pata karो ye galat format hai
if not url.endswith(".parquet"):
    raise ValueError("expected a .parquet URL")
data = download(url)                  # sirf sasta check pass hone ke baad
\`\`\`

**3. "Failure" ek normal, baar-baar branch hai:**

\`\`\`python
# agar aadhे inputs jaayaz roop se key nahi rakhte, ek check har doosri call par
# KeyError raise aur catch karne se behtar padhता hai
if "discount" in order:
    apply_discount(order["discount"])
\`\`\`

## Jo aapko kabhi nahi karna chahiye

\`\`\`python
# 1. nanga except -- KeyboardInterrupt, SystemExit pakadता hai
try: ...
except: ...

# 2. silent swallow -- bug hamesha ke liye gaya, koi log nahi, koi trace nahi
try:
    result = compute()
except Exception:
    result = None            # kya ye asli failure thi ya compute() mein ek bug? koi nahi jaanता

# 3. jo aap handle nahi kar sakte use pakadna
try:
    config = json.load(f)
except Exception:
    config = {}              # ek JSONDecodeError -> {} bचाv yogya hai;
                             # ek MemoryError -> {} bेतुका hai. Sirf JSONDecodeError pakdो.

# 4. re-raise kiye bina catch-log-continue, jab caller ko jaanne ki zaroorat thi
def save(record):
    try:
        db.write(record)
    except DBError:
        logger.error("write failed")   # normal return karता hai! caller sochता hai save hua
\`\`\`

## Sahi tarike se re-raising

\`\`\`python
try:
    risky()
except SomeError:
    logger.exception("risky failed")   # traceback ke saath log karो
    raise                              # WAHI exception re-raise karो, traceback bachакर

try:
    parse(x)
except ValueError as e:
    raise ConfigError("bad config file") from e   # wrap karो, cause bachакर (agla lesson)
\`\`\`

Agar aap sirf log ya cleanup karne ko pakadте ho, ek nange \`raise\` se khatam karो taaki exception jaari rahे. Ise nigalna program ka behaviour badalता hai aur samasya chhupata hai.

## Ek decision checklist

\`\`\`
Kya ek "with default" builtin hai (dict.get, getattr, next)?   -> ise istemal karो
Kya recovery bas "ek default value istemal karो" hai?          -> try/except ya builtin
Kya ek failed attempt cheezein aadhी-hui chhod deta hai?        -> LBYL (pehle check)
Kya attempt fail hone se pehle mehنga kaam karega?              -> LBYL (pehle sasta check)
Kya "failure" asal mein ek aam, ummeed ki gayi branch hai?      -> LBYL (if/else saaf padhता hai)
Warna                                                            -> EAFP, SPECIFIC type pakdो
Kya aap yahaan asal mein recover kar sakte ho?                  -> agar nahi, ise pakdो mat
\`\`\``,

    examples: [
      {
        title: 'EAFP with a built-in default vs an explicit try',
        titleHi: 'Ek built-in default ke saath EAFP vs ek explicit try',
        code: `config = {"host": "db.local", "retries": 3}

# EAFP via built-in -- no try needed:
print("port:", config.get("port", 5432))
print("host:", config.get("host", "localhost"))

# EAFP with a real try -- recovery is more than a default:
def parse_retries(cfg):
    try:
        n = int(cfg["retries"])
    except (KeyError, ValueError, TypeError):
        return 1
    return max(1, min(n, 10))       # clamp

print("retries:", parse_retries(config))
print("retries (bad):", parse_retries({"retries": "lots"}))
print("retries (missing):", parse_retries({}))

# LBYL equivalent is longer and re-checks what int() already validates:
def parse_retries_lbyl(cfg):
    if "retries" not in cfg:
        return 1
    raw = cfg["retries"]
    if not isinstance(raw, (int, str)):
        return 1
    if isinstance(raw, str) and not raw.strip().lstrip("-").isdigit():
        return 1
    return max(1, min(int(raw), 10))

print("lbyl bad:", parse_retries_lbyl({"retries": "lots"}))`,
        output: `port: 5432
host: db.local
retries: 3
retries (bad): 1
retries (missing): 1
lbyl bad: 1`,
        explain: '`config.get("port", 5432)` is EAFP built into the API — no `try` needed for a simple default. `parse_retries` uses an explicit `try` because the recovery (clamp to 1..10) is more than "use a default". The LBYL version re-implements the validation that `int()` already does — checking for digits, signs, whitespace — and is longer and easier to get wrong.',
        explainHi: '`config.get("port", 5432)` API mein bana EAFP hai — ek saral default ke liye koi `try` nahi chahiye. `parse_retries` ek explicit `try` istemal karता hai kyunki recovery (1..10 tak clamp) "ek default istemal karो" se zyaada hai. LBYL version us validation ko dobara implement karता hai jo `int()` pehle se karता hai — digits, signs, whitespace check karna — aur lamba aur galat karna aasaan hai.',
      },
      {
        title: 'The TOCTOU race: LBYL check does not guarantee the operation',
        titleHi: 'TOCTOU race: LBYL check operation guarantee nahi karता',
        code: `import os, tempfile

d = tempfile.mkdtemp()
path = os.path.join(d, "data.txt")
open(path, "w").write("hello")

# LBYL: check then use -- correct ONLY if nothing changes in between
def read_lbyl(p):
    if os.path.exists(p):
        # imagine another process/thread deletes p right here
        os.remove(p)                       # simulate the race
        with open(p) as f:                 # FileNotFoundError despite the check!
            return f.read()
    return "<missing>"

try:
    read_lbyl(path)
except FileNotFoundError:
    print("LBYL still crashed: the check was stale by the time we opened")

# EAFP: just try the operation; the exception is the single source of truth
open(path, "w").write("hello again")
def read_eafp(p):
    try:
        with open(p) as f:
            return f.read()
    except FileNotFoundError:
        return "<missing>"

print("EAFP ok:", read_eafp(path))
os.remove(path)
print("EAFP missing:", read_eafp(path))`,
        output: `LBYL still crashed: the check was stale by the time we opened
EAFP ok: hello again
EAFP missing: <missing>`,
        explain: 'The LBYL version checks `os.path.exists` and then opens — but anything can happen between those two lines (another process, another thread). The check result is already stale. So you must handle `FileNotFoundError` anyway, making the pre-check redundant. EAFP handles the one authoritative signal: the exception from the actual operation.',
        explainHi: 'LBYL version `os.path.exists` check karता hai aur phir kholता hai — par un do lines ke beech kuch bhi ho sakta hai. Check result pehle se stale hai. Toh aapko `FileNotFoundError` phir bhi handle karna hoga, pre-check ko redundant banाकर. EAFP ek authoritative signal handle karता hai: asal operation se exception.',
      },
      {
        title: 'Silent swallow vs catch-log-reraise',
        titleHi: 'Silent swallow vs catch-log-reraise',
        code: `import logging, sys
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s", stream=sys.stdout)
log = logging.getLogger("demo")

def compute(x):
    return 10 // x        # ZeroDivisionError if x == 0; but also a bug source

# BAD: silent swallow -- caller cannot tell success from failure
def run_silent(x):
    try:
        return compute(x)
    except Exception:
        return None

# GOOD: handle the ONE expected error; log; let anything else propagate
def run_careful(x):
    try:
        return compute(x)
    except ZeroDivisionError:
        log.warning("compute(%r): divisor was zero, using 0", x)
        return 0

print("silent:", run_silent(0), "| but was that a real error? unknown")
print("careful:", run_careful(0))

# an unexpected failure (wrong type) must NOT be hidden:
try:
    run_careful("nope")
except TypeError as e:
    print("careful re-surfaced the bug:", e)
print("silent hid it:", run_silent("nope"))`,
        output: `silent: None | but was that a real error? unknown
WARNING compute(0): divisor was zero, using 0
careful: 0
careful re-surfaced the bug: unsupported operand type(s) for //: 'int' and 'str'
silent hid it: None`,
        explain: '`run_silent` catches `Exception` and returns `None` for everything — a `ZeroDivisionError` and a `TypeError` bug produce the identical result, and there is no log. `run_careful` catches only `ZeroDivisionError` (the one case it can handle), logs it, and lets the `TypeError` from `compute("nope")` propagate so the bug is visible. Catch the specific thing; surface the rest.',
        explainHi: '`run_silent` `Exception` pakadता hai aur sab kuch ke liye `None` lautaता hai — ek `ZeroDivisionError` aur ek `TypeError` bug samaan nateeja banate hain, aur koi log nahi. `run_careful` sirf `ZeroDivisionError` pakadता hai (ek case jise ye handle kar sakta hai), ise log karता hai, aur `compute("nope")` se `TypeError` ko propagate hone deta hai taaki bug dikhे.',
      },
    ],

    mistakes: [
      {
        wrong: `if hasattr(user, "email") and user.email is not None:
    send(user.email)`,
        right: `try:
    send(user.email)
except AttributeError:
    pass
# or better, if 'email' is always an attribute that may be None:
if user.email is not None:
    send(user.email)`,
        why: 'Chained `hasattr`/`is not None` pre-checks are verbose and still miss cases (what if `email` is an empty string?). If the attribute genuinely might not exist, EAFP with `AttributeError` is cleaner. If it always exists but may be falsy, a direct truthiness check is enough — the `hasattr` was never needed.',
        whyHi: 'Chained `hasattr`/`is not None` pre-checks verbose hain aur phir bhi cases miss karti hain. Agar attribute sachmuch maujood na ho, `AttributeError` ke saath EAFP saaf hai. Agar ye hamesha maujood hai par falsy ho sakta hai, ek seedha truthiness check kaafi hai.',
      },
      {
        wrong: `try:
    user = User.objects.get(id=uid)
    order = user.orders.latest()
    total = order.compute_total()
    charge(user.card, total)
except Exception:
    return {"error": "something went wrong"}`,
        right: `try:
    user = User.objects.get(id=uid)
except User.DoesNotExist:
    return {"error": "user not found"}

order = user.orders.latest()      # let a real bug here propagate to your error tracker
total = order.compute_total()
charge(user.card, total)          # a PaymentError here should be caught specifically`,
        why: 'Four operations, one catch-all, one generic message. A missing user, a bug in `compute_total`, and a declined card all become "something went wrong" — useless to the user and invisible to you. Catch each specific, recoverable failure where it happens; let genuine bugs propagate.',
        whyHi: 'Chaar operations, ek catch-all, ek generic message. Ek missing user, `compute_total` mein ek bug, aur ek declined card sab "something went wrong" ban jाते hain — user ke liye bekaar aur aapke liye invisible. Har specific, recoverable failure ko jahaan ye hoता hai pakdो; asli bugs ko propagate hone do.',
      },
      {
        wrong: `def get_setting(name):
    try:
        return settings[name]
    except Exception:
        return None            # KeyError -> None is fine, but MemoryError -> None?`,
        right: `def get_setting(name):
    return settings.get(name)   # KeyError handled by the builtin; nothing else caught
# or, if you need a real try:
    try:
        return settings[name]
    except KeyError:
        return None`,
        why: 'Catching `Exception` when you only mean to handle a missing key means an out-of-memory error, a keyboard interrupt during evaluation, or a bug in `settings.__getitem__` also silently returns `None`. Catch `KeyError` specifically, or just use `settings.get(name)`.',
        whyHi: '`Exception` pakadna jab aapka matlab sirf ek missing key handle karna hai matlab ek out-of-memory error, evaluation ke dauraan ek keyboard interrupt, ya `settings.__getitem__` mein ek bug bhi chupchaap `None` lautaता hai. `KeyError` vishesh roop se pakdो, ya bas `settings.get(name)` istemal karो.',
      },
    ],

    realWorld: [
      {
        en: '**Django ORM is EAFP-first** — `Model.objects.get()` raises `DoesNotExist` and you catch it; `get_object_or_404` wraps that pattern. `filter().first()` is the "with default" (returns `None`) form. Checking `if Model.objects.filter(...).exists()` then calling `.get()` is LBYL with a race and an extra query.',
        hi: '**Django ORM EAFP-first hai** — `Model.objects.get()` `DoesNotExist` raise karता hai aur aap ise pakadते ho; `get_object_or_404` us pattern ko wrap karता hai. `filter().first()` "with default" (`None` lautaता hai) roop hai. `if Model.objects.filter(...).exists()` check karके phir `.get()` call karna ek race aur ek extra query ke saath LBYL hai.',
      },
      {
        en: '**The "silent except Exception: pass" is a top finding in code review and security audits** — it hides `KeyError` from renamed fields, `AttributeError` from `None`, and real security exceptions. `ruff`/`flake8` flag it (`S110`, `BLE001`); the fix is always to narrow the catch or at least log.',
        hi: '**"silent except Exception: pass" code review aur security audits mein ek top finding hai** — ye renamed fields se `KeyError`, `None` se `AttributeError`, aur asli security exceptions chhupata hai. `ruff`/`flake8` ise flag karte hain; fix hamesha catch narrow karna ya kam se kam log karna hai.',
      },
      {
        en: '**LBYL for money and irreversible actions** — a payment or transfer checks balance/limits BEFORE moving anything, because catching an exception after a partial transfer leaves accounts inconsistent. Django `transaction.atomic()` is the safety net, but the precondition check still comes first.',
        hi: '**Paise aur irreversible actions ke liye LBYL** — ek payment ya transfer kuch bhi move karne se PEHLE balance/limits check karता hai, kyunki ek partial transfer ke baad ek exception pakadna accounts ko asangat chhod deta hai. Django `transaction.atomic()` safety net hai, par precondition check phir bhi pehle aाता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What are EAFP and LBYL, and why does Python generally prefer EAFP?',
        qHi: 'EAFP aur LBYL kya hain, aur Python aam taur par EAFP kyun prefer karता hai?',
        a: 'LBYL, look before you leap, means checking all the preconditions of an operation before performing it — testing that a key is in a dictionary before subscripting it, that a file exists before opening it, that an attribute is present before accessing it. EAFP, easier to ask forgiveness than permission, means just performing the operation and catching the specific exception if it fails. Python leans toward EAFP for several concrete reasons. First, the language and standard library are designed around it: dictionaries raise KeyError and also offer get with a default, attribute access raises AttributeError and getattr takes a default, iterators raise StopIteration and next takes a sentinel. The idiomatic tools are exception-based with convenience defaults layered on top. Second, LBYL has a time-of-check-to-time-of-use problem: between the moment you check that a file exists and the moment you open it, another process or thread can delete it, so you have to handle the failure anyway and the check was wasted. For anything involving the filesystem, a network, or shared state, the check is a snapshot of a world that may have changed by the time you act. Third, LBYL tends to re-implement the validation the operation already performs — checking whether a string looks like an integer duplicates what int itself does, and it is easy to get the edge cases wrong. Fourth, EAFP puts zero overhead on the success path: there is no pre-check to run when everything is fine, and the cost of setting up a try block is negligible. The cases where LBYL is genuinely better are specific: when a failed attempt would leave a multi-step operation half-completed with no easy rollback, so you check preconditions first; when the operation would do expensive work before discovering it cannot succeed, so a cheap check up front saves that; and when failure is not exceptional at all but a common, expected branch, where an if-else simply reads more clearly than raising and catching on every other call.',
        aHi: 'LBYL, kudne se pehle dekho, matlab ek operation ke sab preconditions ko ise karne se pehle check karna. EAFP, anumati se aasaan maafi maangna, matlab bas operation karna aur agar fail ho to specific exception pakadna. Python EAFP ki taraf jhukता hai kai thos kaaran se. Pehla, bhasha aur standard library iske aas-paas design ki gayi hai: dictionaries KeyError raise karte hain aur ek default ke saath get bhi dete hain. Doosra, LBYL mein ek time-of-check-to-time-of-use samasya hai: aap check karें ki ek file maujood hai aur ise kholें, un pal ke beech ek doosra process ise delete kar sakta hai. Teesra, LBYL us validation ko dobara implement karता hai jo operation pehle se karता hai. Chautha, EAFP success path par zero overhead rakhता hai. Wo cases jahaan LBYL sachmuch behtar hai vishesh hain: jab ek failed attempt ek multi-step operation ko aadhा-poora chhod deta; jab operation mehنga kaam karता fail hone se pehle; aur jab failure ek aam, ummeed ki gayi branch hai.',
      },
      {
        q: 'When is catching an exception the wrong thing to do?',
        qHi: 'Ek exception pakadna kab galat cheez hai?',
        a: 'Catching is wrong whenever you cannot actually do something sensible about the failure at that point. The clearest case is the silent swallow: a try around some code with an except that sets a default or passes, and no logging. Now a genuine expected failure and a bug in your own code produce the identical outcome, there is no traceback, nothing reaches your error tracking, and you discover the problem weeks later from wrong output. Closely related is catching too broadly — except Exception, or worse a bare except — around a block that does several things. You meant to handle one specific failure but you have caught everything, including exceptions you never anticipated and cannot recover from, like an out-of-memory error or an AttributeError from an unexpected None. A bare except is worse still because it also catches KeyboardInterrupt and SystemExit, so Ctrl-C stops working and sys.exit becomes a no-op. Another wrong case is catch-log-continue when the caller needed to know about the failure: a save function that catches a database error, logs it, and then returns normally has lied to its caller, which now believes the record was saved. If you catch only to log or to run cleanup, you should end with a bare raise so the exception continues to propagate, or wrap it in a more meaningful exception with raise from. The correct default is to catch the narrowest exception type that corresponds to a situation you have a real, local recovery for, around the smallest block that can raise it. Everything else should propagate: an unexpected exception is supposed to crash loudly, produce a traceback, alert someone, and get fixed. The only legitimate broad catches are a top-level handler in a long-running server or worker that logs the full exception and continues to the next unit of work, and re-raising after logging or cleanup — and even those never discard the exception silently.',
        aHi: 'Pakadna galat hai jab bhi aap us bindu par failure ke baare mein asal mein kuch samझदार nahi kar sakte. Sabse saaf case silent swallow hai: kuch code ke aas-paas ek try ek except ke saath jo ek default set karता hai ya pass karता hai, aur koi logging nahi. Ab ek asli ummeed ki gayi failure aur aapke apne code mein ek bug samaan nateeja banate hain, koi traceback nahi. Iske kareeb bahut chaude pakadna hai — except Exception, ya bura ek nanga except — ek block ke aas-paas jo kai cheezein karता hai. Ek nanga except aur bura hai kyunki ye KeyboardInterrupt aur SystemExit bhi pakadता hai. Ek aur galat case catch-log-continue hai jab caller ko failure ke baare mein jaanne ki zaroorat thi. Agar aap sirf log ya cleanup karne ko pakadते ho, aapko ek nange raise se khatam karna chahiye. Sahi default sabse narrow exception type pakadna hai jiske liye aapke paas ek asli, local recovery hai. Baaki sab ko propagate hona chahiye.',
      },
    ],

    exercises: [
      {
        task: 'Write two versions of `first_line(path)` that returns the first line of a file or `"<empty>"` if missing: one LBYL (`os.path.exists` then open) and one EAFP (`try/except FileNotFoundError`). Then in the LBYL one, delete the file between the check and the open (simulating a race) and show it still raises `FileNotFoundError` — the check did not protect it.',
        taskHi: '`first_line(path)` ke do versions likhो jo ek file ki pehli line ya missing hone par `"<empty>"` lautाtे hain: ek LBYL (`os.path.exists` phir open) aur ek EAFP (`try/except FileNotFoundError`). Phir LBYL waale mein, check aur open ke beech file delete karो aur dikhाओ ye phir bhi `FileNotFoundError` raise karता hai.',
        hint: 'The LBYL race: `if os.path.exists(p): os.remove(p); open(p)` — the `open` still fails. This proves you must handle the exception regardless, making the pre-check redundant for correctness.',
        hintHi: 'LBYL race: `if os.path.exists(p): os.remove(p); open(p)` — `open` phir bhi fail hota hai. Ye saabit karता hai ki aapko exception phir bhi handle karna hoga.',
      },
      {
        task: 'Write `deep_get(d, *keys, default=None)` that walks nested dicts (`deep_get(data, "a", "b", "c")`). Implement it EAFP: `try` the chain of subscripts, `except (KeyError, TypeError)` return `default`. Test on `{"a": {"b": {"c": 1}}}` (returns 1), a missing path (returns default), and `{"a": 5}` with keys `"a", "b"` (TypeError -> default).',
        taskHi: '`deep_get(d, *keys, default=None)` likhो jo nested dicts par chalे. Ise EAFP implement karो: subscripts ki chain `try` karो, `except (KeyError, TypeError)` `default` lautाओ. `{"a": {"b": {"c": 1}}}` (1 lautaता hai), ek missing path, aur `{"a": 5}` keys `"a", "b"` ke saath (TypeError -> default) par test karो.',
        hint: '`cur = d; for k in keys: cur = cur[k]; return cur` inside a `try`. `{"a": 5}["a"]["b"]` raises `TypeError` (int is not subscriptable) — catching both `KeyError` and `TypeError` handles missing keys and wrong-type intermediates.',
        hintHi: '`cur = d; for k in keys: cur = cur[k]; return cur` ek `try` ke andar. `{"a": 5}["a"]["b"]` `TypeError` raise karता hai — `KeyError` aur `TypeError` dono pakadna missing keys aur galat-type intermediates handle karता hai.',
      },
      {
        task: 'Write `process_batch(items, handler)` that calls `handler(item)` for each item. On a `ValueError` (bad item), log it and record `None`. On ANY other exception, re-raise after logging which item failed (`raise` with no arg preserves the traceback). Test with a handler that raises `ValueError` for one item and `RuntimeError` for another — show the batch stops at the `RuntimeError` but the `ValueError` item becomes `None`.',
        taskHi: '`process_batch(items, handler)` likhो jo har item ke liye `handler(item)` call kare. Ek `ValueError` par, ise log karो aur `None` record karो. KISI aur exception par, kaunsा item fail hua log karके re-raise karो. Test karो ek handler ke saath jo ek item ke liye `ValueError` aur doosre ke liye `RuntimeError` raise karता hai.',
        hint: '`try: results.append(handler(item)) except ValueError: log(...); results.append(None) except Exception: log(f"item {item} failed"); raise`. The bare `raise` in the second handler re-raises the `RuntimeError` with its original traceback.',
        hintHi: '`try: results.append(handler(item)) except ValueError: log(...); results.append(None) except Exception: log(f"item {item} failed"); raise`. Doosre handler mein nanga `raise` `RuntimeError` ko iske original traceback ke saath re-raise karता hai.',
      },
    ],

    keyTakeaways: [
      'EAFP ("easier to ask forgiveness") = attempt the operation, catch the SPECIFIC exception if it fails. It is the Python idiom and matches the API design (`dict.get`, `getattr` default, `next` sentinel).',
      'EAFP avoids the TOCTOU race (a `os.path.exists` check can be stale by the time you `open`), does not re-implement the operation\'s own checks, and adds zero overhead to the success path.',
      'LBYL ("look before you leap") = check preconditions first. Prefer it when: a failed attempt leaves things half-done (money, multi-step writes), a cheap check avoids expensive work, or "failure" is a common expected branch (reads clearer as `if`).',
      'Use the built-in "with default" forms first: `dict.get(k, d)`, `dict.setdefault`, `getattr(o, n, d)`, `next(it, sentinel)`, `os.environ.get`.',
      'NEVER use bare `except:` or `except BaseException:` — they trap `KeyboardInterrupt` and `SystemExit`.',
      'NEVER silently swallow: `except Exception: result = None` with no log makes a bug indistinguishable from an expected failure and invisible to monitoring.',
      'Catch only what you can actually handle locally. If you catch just to log or clean up, end with a bare `raise` so the exception keeps propagating.',
      'Catch-log-return-normally is a lie to the caller — if the caller needed to know the operation failed, re-raise (or raise a wrapped exception).',
    ],
    keyTakeawaysHi: [
      'EAFP ("maafi maangna aasaan") = operation ki koshish karो, agar fail ho to SPECIFIC exception pakdो. Ye Python idiom hai aur API design se mel khाता hai (`dict.get`, `getattr` default, `next` sentinel).',
      'EAFP TOCTOU race se bचता hai (ek `os.path.exists` check `open` karne tak stale ho sakta hai), operation ke apne checks dobara implement nahi karता, aur success path par zero overhead jodता hai.',
      'LBYL ("kudne se pehle dekho") = pehle preconditions check karो. Ise prefer karो jab: ek failed attempt cheezein aadhी-hui chhod deta hai (paise, multi-step writes), ek sasta check mehنge kaam se bचता hai, ya "failure" ek aam ummeed ki gayi branch hai.',
      'Pehle built-in "with default" roop istemal karो: `dict.get(k, d)`, `dict.setdefault`, `getattr(o, n, d)`, `next(it, sentinel)`, `os.environ.get`.',
      'KABHI nanga `except:` ya `except BaseException:` istemal mat karो — wo `KeyboardInterrupt` aur `SystemExit` phasate hain.',
      'KABHI chupchaap mat nigalо: bina log ke `except Exception: result = None` ek bug ko ek ummeed ki gayi failure se andistinguishable aur monitoring ko invisible banाता hai.',
      'Sirf wo pakdो jise aap asal mein locally handle kar sakte ho. Agar aap sirf log ya cleanup karne ko pakadते ho, ek nange `raise` se khatam karो.',
      'Catch-log-return-normally caller se ek jhooth hai — agar caller ko jaanne ki zaroorat thi ki operation fail hua, re-raise karो (ya ek wrapped exception raise karो).',
    ],
  },
];
