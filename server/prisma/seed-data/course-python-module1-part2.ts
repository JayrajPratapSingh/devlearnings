/**
 * Python Complete Course — Module 1: Python Foundations, lessons 4-6.
 *
 * Lesson 4: booleans, None, truthiness. `True`/`False` capitalised; `and`/`or`/
 *           `not` (not `&&`); `and`/`or` return an OPERAND not a bool; the
 *           truthiness of `[]`/`{}`/`0`/`""`/`None`; `is None` vs `== None`.
 *           Broken: `if x == None`, `if len(items) > 0`, `x = a || b`.
 * Lesson 5: control flow — `elif`, the `x if c else y` expression (no `?:`),
 *           `for x in iterable` (no C-style for), `range`, `enumerate`, the
 *           loop `else`, `break`/`continue`/`pass`, `match`. Broken: `for
 *           (i=0; i<n; i++)`, `switch`.
 * Lesson 6: functions you need now + `if __name__ == "__main__"`. `def`,
 *           implicit `return None`, positional vs keyword args, docstrings,
 *           the import-time side-effect trap the main guard prevents.
 *
 * NOTE for future editors: `examples` use `code` + `output` (Python). Escape
 * inline backticks in template-literal fields. Run every sample with `python`.
 * Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .` from `server/`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_1_PART2: CourseLesson[] = [
  {
    slug: 'py-booleans-none-and-truthiness',
    title: 'Booleans, None, and Truthiness: is None, not == None',
    titleHi: 'Booleans, None, Aur Truthiness: is None, == None Nahi',
    description: 'Checking whether a value is missing by writing `if value == None`, and checking whether a list has items by writing `if len(items) > 0`. Both work, but neither is how Python is written: `None` is a unique singleton object you compare with `is`, and every container is already truthy when non-empty and falsy when empty, so `if items` is the whole check.',
    descriptionHi: 'Ye check karna ki ek value missing hai `if value == None` likhkar, aur ye check karna ki ek list mein items hain `if len(items) > 0` likhkar. Dono kaam karte hain, par koi bhi wo tarika nahi jaise Python likha jaata hai: `None` ek anokha singleton object hai jise aap `is` se compare karte ho, aur har container non-empty hone par pehle se truthy aur empty hone par falsy hai, isliye `if items` poora check hai.',
    difficulty: 'EASY',
    duration: 18,
    order: 4,

    analogy: {
      en: '**A hotel with exactly one "no guest" placeholder card, versus asking whether two cards have matching text.** Every room has a card in its slot. Occupied rooms have a guest card. Empty rooms all share one single physical card that says "vacant" — there is literally one such card in the whole building, and it is moved from slot to slot as rooms empty out. So to check if a room is empty you do not read the card and compare its text to the word "vacant"; you check whether the card in the slot IS that one specific vacant card — same physical object. That identity check is `is None`. Comparing text (`== None`) usually gives the same answer, but a mischievous guest could print their own card that also reads "vacant", and a text comparison would be fooled while the identity check would not. Separately, the front desk has a shortcut for "does this room have anyone or anything worth noting": an empty room, a room with an empty minibar list, a room with a zero balance — all of these register as "nothing to see". A room with a guest, a non-empty list, a non-zero balance — "something there". You rarely need to count; you just ask "is there anything", and the desk answers yes or no directly.',
      hi: '**Ek hotel mein bilkul ek "koi guest nahi" placeholder card, versus poochhna ki kya do cards ka text match karta hai.** Har room ke slot mein ek card hai. Occupied rooms mein ek guest card hai. Empty rooms sab ek akela bhautik card share karte hain jo "vacant" kehta hai — poore building mein sachmuch ek aisa card hai, aur ise slot se slot le jaaya jaata hai jaise rooms khaali hote hain. Toh ye check karne ke liye ki ek room empty hai aap card padhkar iske text ko "vacant" shabd se compare nahi karte; aap check karte ho ki slot mein card WO ek khaas vacant card HAI — wahi bhautik object. Wo identity check `is None` hai. Text compare karna (`== None`) aksar wahi jawaab deta hai, par ek shararati guest apna khud ka card print kar sakta hai jo bhi "vacant" padhta hai, aur ek text comparison dhokha khaa jaata jabki identity check nahi. Alag se, front desk ke paas "kya is room mein koi ya kuch dhyaan dene yogya hai" ke liye ek shortcut hai: ek empty room, ek empty minibar list waala room, ek zero balance waala room — ye sab "dekhne ko kuch nahi" register hote hain.',
    },

    simple: `**Start broken.** JS habits: \`== None\`, \`len() > 0\`, \`||\` for defaults, lowercase \`true\`:

\`\`\`python
def get_config(overrides):
    if overrides == None:              # works, but not idiomatic
        overrides = {}
    if len(overrides.keys()) > 0:      # verbose
        print("has overrides")

    debug = overrides.get("debug") || False   # SyntaxError: no || in Python
    ready = true                              # NameError: 'true' is not defined
\`\`\`

\`||\` and \`&&\` do not exist. \`true\`/\`false\`/\`null\` do not exist — it is \`True\`/\`False\`/\`None\` with capitals. And \`== None\` / \`len(x) > 0\` are technically fine but every Python codebase, including Django's, uses \`is None\` and bare truthiness.

**The fix: \`is None\`, bare truthiness, \`or\` for defaults, \`and\`/\`or\`/\`not\`**

\`\`\`python
def get_config(overrides):
    if overrides is None:              # identity check against the singleton
        overrides = {}
    if overrides:                      # truthy = non-empty dict
        print("has overrides")

    debug = overrides.get("debug") or False   # 'or' returns the first truthy operand
    ready = True
    return overrides
\`\`\`

\`\`\`
FALSY values (everything else is truthy):
    None      False     0     0.0     0j     ""     []     {}     ()     set()
    plus any object whose __bool__ or __len__ says so

\`if x:\`               -> runs when x is truthy      (use for "has something")
\`if not x:\`           -> runs when x is falsy       (use for "is empty/missing")
\`if x is None:\`       -> runs ONLY when x is literally None (not 0, not "", not [])

and / or return an OPERAND, not a bool:
    "a" or "b"    -> "a"     (first truthy)
    "" or "b"     -> "b"
    "a" and "b"   -> "b"     (last, if all truthy; else first falsy)
    0 and crash() -> 0       (short-circuits; crash() never runs)
\`\`\``,

    simpleHi: `**Toote hue se shuru.** JS aadatein: \`== None\`, \`len() > 0\`, defaults ke liye \`||\`, lowercase \`true\`:

\`\`\`python
def get_config(overrides):
    if overrides == None:              # kaam karta hai, par idiomatic nahi
        overrides = {}
    if len(overrides.keys()) > 0:      # verbose
        print("has overrides")

    debug = overrides.get("debug") || False   # SyntaxError: Python mein koi || nahi
    ready = true                              # NameError: 'true' defined nahi hai
\`\`\`

\`||\` aur \`&&\` maujood nahi hain. \`true\`/\`false\`/\`null\` maujood nahi hain — ye capitals ke saath \`True\`/\`False\`/\`None\` hai. Aur \`== None\` / \`len(x) > 0\` takneeki roop se theek hain par har Python codebase, Django ke sameet, \`is None\` aur nangi truthiness istemal karta hai.

**Fix: \`is None\`, nangi truthiness, defaults ke liye \`or\`, \`and\`/\`or\`/\`not\`**

\`\`\`python
def get_config(overrides):
    if overrides is None:              # singleton ke against identity check
        overrides = {}
    if overrides:                      # truthy = non-empty dict
        print("has overrides")

    debug = overrides.get("debug") or False   # 'or' pehla truthy operand lautaata hai
    ready = True
    return overrides
\`\`\`

\`\`\`
FALSY values (baaki sab truthy hai):
    None      False     0     0.0     0j     ""     []     {}     ()     set()
    plus koi bhi object jiska __bool__ ya __len__ aisa kahe

\`if x:\`               -> chalta hai jab x truthy ho      ("kuch hai" ke liye istemal)
\`if not x:\`           -> chalta hai jab x falsy ho       ("empty/missing hai" ke liye)
\`if x is None:\`       -> SIRF tab chalta hai jab x sachmuch None ho (0 nahi, "" nahi, [] nahi)

and / or ek OPERAND lautaate hain, ek bool nahi:
    "a" or "b"    -> "a"     (pehla truthy)
    "" or "b"     -> "b"
    "a" and "b"   -> "b"     (aakhri, agar sab truthy; warna pehla falsy)
    0 and crash() -> 0       (short-circuits; crash() kabhi nahi chalta)
\`\`\``,

    content: `## \`is\` vs \`==\`, and why \`is None\` is the rule

\`\`\`python
x = None
x is None       # True   -- there is exactly ONE None object; this checks identity
x == None       # True   -- usually, BUT a class can override __eq__ to lie

# a real example of == None going wrong:
import numpy as np           # (if numpy is installed)
arr = np.array([1, 2, 3])
arr == None                  # array([False, False, False])  -- NOT a bool!
if arr == None:              # ValueError: truth value of an array is ambiguous
\`\`\`

\`None\` is a singleton — the interpreter makes one and only one. \`is\` compares object identity (are these the same object?), which for \`None\` is exactly what you want and cannot be faked. \`==\` calls \`__eq__\`, which any class can define however it likes. **Always \`is None\` / \`is not None\`.** Same for \`True\`/\`False\` when you truly mean the singleton, though usually you want bare truthiness instead.

## Truthiness, precisely

\`\`\`
bool(x) is False for:   None  False  0  0.0  0j  Decimal(0)  Fraction(0,1)
                        ""  b""  []  ()  {}  set()  range(0)
                        and any object where __bool__() returns False,
                        or (if no __bool__) __len__() returns 0

bool(x) is True for:    everything else -- including "0" (non-empty string!),
                        " " (a space), [0] (list with one falsy item),
                        -1, 0.0001, any function, any class, any non-empty container
\`\`\`

\`\`\`python
if items:            # "items is a non-empty list/dict/set/str"
if not items:        # "items is empty (or None, or 0...)"
if count:            # "count is non-zero"    -- careful: 0 is falsy, so is None
if value is None:    # "value is specifically None"  -- use when 0/"" are valid values
\`\`\`

The trap: \`if count:\` treats both \`0\` and \`None\` as "no count". If \`0\` is a legitimate value you must distinguish, use \`if count is None:\` or \`if count is not None:\`.

## \`and\` / \`or\` return operands (short-circuit evaluation)

\`\`\`python
name = user_input or "anonymous"       # if user_input is falsy, use the default
config = explicit_config or load_default_config()   # only calls load if needed

# 'and' returns the first falsy operand, or the last operand if all truthy:
user and user.is_active and user.email # -> user.email, or the first falsy thing
# safe navigation: 'and' stops before user.is_active if user is None/falsy

# CAUTION: \`x or default\` treats 0, "", [], False as "missing":
page = request.GET.get("page") or 1    # "page=0" in the URL -> page becomes 1 (bug?)
page = int(request.GET.get("page", 1)) # better: only defaults when the key is absent
\`\`\`

## Comparison chaining (Python has it, JS does not)

\`\`\`python
if 0 <= i < len(items):        # reads as maths; means (0 <= i) and (i < len(items))
if a == b == c:                # all three equal
if x < y <= z != w:            # chains any comparisons
\`\`\`

## The boolean operators, side by side with JS

\`\`\`
JavaScript      Python        note
&&              and           returns an operand, short-circuits
||              or            returns an operand, short-circuits
!               not           always returns a real bool
=== / !==       == / !=       value-and-type aware already
(no equiv)      is / is not   identity -- use for None/True/False only
? :             a if c else b the "conditional expression"
??              or  (roughly) but \`or\` also catches 0/""/[]; there is no true ??
\`\`\``,

    contentHi: `## \`is\` vs \`==\`, aur \`is None\` niyam kyun hai

\`\`\`python
x = None
x is None       # True   -- bilkul EK None object hai; ye identity check karta hai
x == None       # True   -- aksar, PAR ek class __eq__ override karke jhooth bol sakti hai

# == None ke galat jaane ka ek asli udaharan:
import numpy as np           # (agar numpy installed hai)
arr = np.array([1, 2, 3])
arr == None                  # array([False, False, False])  -- ek bool NAHI!
if arr == None:              # ValueError: array ka truth value ambiguous hai
\`\`\`

\`None\` ek singleton hai — interpreter ek aur sirf ek banaata hai. \`is\` object identity compare karta hai (kya ye wahi object hain?), jo \`None\` ke liye bilkul wahi hai jo aap chahte ho aur fake nahi ho sakta. \`==\` \`__eq__\` call karta hai, jo koi bhi class jaise chaahe define kar sakti hai. **Hamesha \`is None\` / \`is not None\`.** \`True\`/\`False\` ke liye bhi jab aap sachmuch singleton ka matlab rakhte ho, haalaanki aksar aap nangi truthiness chahte ho.

## Truthiness, thik-thik

\`\`\`
bool(x) False hai in ke liye:   None  False  0  0.0  0j  Decimal(0)
                                ""  b""  []  ()  {}  set()  range(0)
                                aur koi bhi object jahaan __bool__() False lautaaye,
                                ya (agar koi __bool__ nahi) __len__() 0 lautaaye

bool(x) True hai in ke liye:    baaki sab -- "0" (non-empty string!) sameet,
                                " " (ek space), [0] (ek falsy item waali list),
                                -1, 0.0001, koi bhi function, koi bhi class, koi non-empty container
\`\`\`

\`\`\`python
if items:            # "items ek non-empty list/dict/set/str hai"
if not items:        # "items empty hai (ya None, ya 0...)"
if count:            # "count non-zero hai"    -- saavdhaan: 0 falsy hai, None bhi
if value is None:    # "value khaas roop se None hai"  -- jab 0/"" valid values hain
\`\`\`

Jaal: \`if count:\` dono \`0\` aur \`None\` ko "no count" maanta hai. Agar \`0\` ek jaayaz value hai jise aapko alag karna hai, \`if count is None:\` ya \`if count is not None:\` istemal karo.

## \`and\` / \`or\` operands lautaate hain (short-circuit evaluation)

\`\`\`python
name = user_input or "anonymous"       # agar user_input falsy hai, default istemal karo
config = explicit_config or load_default_config()   # sirf zaroorat par load call karta hai

# 'and' pehla falsy operand lautaata hai, ya aakhri operand agar sab truthy:
user and user.is_active and user.email # -> user.email, ya pehli falsy cheez
# safe navigation: 'and' user.is_active se pehle rukta hai agar user None/falsy hai

# SAAVDHAAN: \`x or default\` 0, "", [], False ko "missing" maanta hai:
page = request.GET.get("page") or 1    # URL mein "page=0" -> page 1 ban jaata hai (bug?)
page = int(request.GET.get("page", 1)) # behtar: sirf tab default jab key absent ho
\`\`\`

## Comparison chaining (Python mein hai, JS mein nahi)

\`\`\`python
if 0 <= i < len(items):        # maths ki tarah padhta hai; matlab (0 <= i) and (i < len(items))
if a == b == c:                # teenon barabar
if x < y <= z != w:            # koi bhi comparisons chain karta hai
\`\`\`

## Boolean operators, JS ke saath saath

\`\`\`
JavaScript      Python        note
&&              and           ek operand lautaata hai, short-circuits
||              or            ek operand lautaata hai, short-circuits
!               not           hamesha ek asli bool lautaata hai
=== / !==       == / !=       pehle se value-and-type aware
(koi equiv nahi) is / is not  identity -- sirf None/True/False ke liye istemal
? :             a if c else b "conditional expression"
??              or  (lagbhag) par \`or\` 0/""/[] bhi pakadta hai; koi asli ?? nahi
\`\`\``,

    examples: [
      {
        title: 'Broken: == None, len() > 0, || , lowercase true',
        titleHi: 'Toota: == None, len() > 0, || , lowercase true',
        code: `def summary(tags):
    if tags == None:
        return "no tags"
    if len(tags) > 0:
        return "tags: " + ", ".join(tags)
    return "empty" if tags == [] else "?"

print(summary(None))
print(summary([]))
print(summary(["a", "b"]))`,
        output: `no tags
empty
tags: a, b`,
        explain: 'This happens to work, but it is not idiomatic: `tags is None` is the correct None check, `if tags:` replaces `len(tags) > 0`, and `if not tags:` replaces `tags == []`. The verbose version also silently treats a passed `0` or `""` oddly if the type ever changes.',
        explainHi: 'Ye samyog se kaam karta hai, par idiomatic nahi: `tags is None` sahi None check hai, `if tags:` `len(tags) > 0` ki jagah leta hai, aur `if not tags:` `tags == []` ki jagah. Verbose version agar type kabhi badle toh ek passed `0` ya `""` ko bhi ajeeb tarike se maanta hai.',
      },
      {
        title: 'Fixed: is None, bare truthiness, or-defaults',
        titleHi: 'Theek: is None, nangi truthiness, or-defaults',
        code: `def summary(tags):
    if tags is None:
        return "no tags"
    if not tags:
        return "empty"
    return f"tags: {', '.join(tags)}"

print(summary(None))
print(summary([]))
print(summary(["a", "b"]))

# and/or return operands:
print("" or "default")            # default
print("given" or "default")       # given
print(0 or None or "last")        # last
print(["x"] and "has items")      # has items
print([] and "has items")         # []`,
        output: `no tags
empty
tags: a, b
default
given
last
has items
[]`,
        explain: '`is None` catches only real None; `not tags` catches the empty list. `or` returns the first truthy operand (or the last if all falsy); `and` returns the first falsy operand (or the last if all truthy). Note `[] and ...` returns `[]` itself, not `False`.',
        explainHi: '`is None` sirf asli None pakadta hai; `not tags` empty list pakadta hai. `or` pehla truthy operand lautaata hai (ya aakhri agar sab falsy); `and` pehla falsy operand lautaata hai (ya aakhri agar sab truthy). Note `[] and ...` `[]` khud lautaata hai, `False` nahi.',
      },
      {
        title: 'The 0-vs-None trap, and comparison chaining',
        titleHi: '0-vs-None jaal, aur comparison chaining',
        code: `def apply_discount(price, discount):
    # BUG version: 'if discount:' also skips a legitimate 0% discount
    #   here is the correct version:
    if discount is None:
        discount = 10          # default only when truly not provided
    return price * (1 - discount / 100)

print(apply_discount(100, None))   # 90.0  -- default applied
print(apply_discount(100, 0))      # 100.0 -- 0% respected (would be 90.0 with 'if discount:')
print(apply_discount(100, 25))     # 75.0

# comparison chaining
i, n = 3, 10
print(0 <= i < n)                  # True
print(1 < 2 < 3 < 2)               # False`,
        output: `90.0
100.0
75.0
True
False`,
        explain: 'Using `if discount is None:` distinguishes "not passed" (default to 10) from "explicitly 0" (a real 0% discount). `if discount:` would wrongly treat 0 as missing. `0 <= i < n` chains two comparisons — Python evaluates `i` once and checks both bounds.',
        explainHi: '`if discount is None:` istemal karna "not passed" (10 default) ko "explicitly 0" (ek asli 0% discount) se alag karta hai. `if discount:` 0 ko galat tarike se missing maanta. `0 <= i < n` do comparisons chain karta hai — Python `i` ko ek baar evaluate karta hai aur dono bounds check karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `if user.middle_name == None:
    ...`,
        right: `if user.middle_name is None:
    ...`,
        why: 'Use `is` for None. `==` calls `__eq__`, which some types (numpy arrays, pandas, ORM query expressions, custom classes) override to return something that is not a plain bool — leading to a ValueError or a silently wrong branch. `is None` checks identity and always returns a real bool.',
        whyHi: 'None ke liye `is` istemal karo. `==` `__eq__` call karta hai, jise kuch types (numpy arrays, pandas, ORM query expressions, custom classes) override karke kuch aisa lautaate hain jo plain bool nahi hai — ek ValueError ya ek chupchaap galat branch tak le jaate hue. `is None` identity check karta hai aur hamesha ek asli bool lautaata hai.',
      },
      {
        wrong: `limit = request.GET.get("limit") or 20`,
        right: `raw = request.GET.get("limit")
limit = int(raw) if raw is not None else 20`,
        why: '`or` treats "0" as falsy after conversion, and even the string "0" is truthy but `int("0")` is 0 which is falsy downstream. More importantly `x or default` fires the default for any falsy value, not just a missing one. Use `.get(key, default)` for a missing-key default, and check `is not None` when 0 is valid.',
        whyHi: '`or` conversion ke baad "0" ko falsy maanta hai, aur string "0" bhi truthy hai par `int("0")` 0 hai jo downstream falsy hai. Zyaada mahatvapurna `x or default` kisi bhi falsy value ke liye default chalaata hai, sirf ek missing ke liye nahi. Missing-key default ke liye `.get(key, default)` istemal karo, aur jab 0 valid hai toh `is not None` check karo.',
      },
      {
        wrong: `while (running == True):
    ...`,
        right: `while running:
    ...`,
        why: 'Comparing a boolean to `True` is redundant and fragile — `if x == True` fails for a truthy non-bool like `1` or `"yes"` where `if x` succeeds. Just use the value directly: `while running`, `if is_valid`, `if not done`.',
        whyHi: 'Ek boolean ko `True` se compare karna fizool aur kamzor hai — `if x == True` ek truthy non-bool jaise `1` ya `"yes"` ke liye fail hota hai jahaan `if x` safal hota hai. Bas value seedhe istemal karo: `while running`, `if is_valid`, `if not done`.',
      },
    ],

    realWorld: [
      {
        en: '**Django model fields** are often nullable — `middle_name = models.CharField(null=True)` — and you check `if obj.middle_name is None` to distinguish "not set" from an empty string `""`, which are two different states in the database.',
        hi: '**Django model fields** aksar nullable hote hain — `middle_name = models.CharField(null=True)` — aur aap `if obj.middle_name is None` check karte ho "not set" ko ek empty string `""` se alag karne ko, jo database mein do alag states hain.',
      },
      {
        en: '**DRF serializer validation** relies on truthiness constantly: `if not attrs.get("email"):` raises a validation error for a missing or empty email, and `data or {}` provides a safe default for an optional nested object.',
        hi: '**DRF serializer validation** truthiness par lagataar nirbhar karta hai: `if not attrs.get("email"):` ek missing ya empty email ke liye ek validation error deta hai, aur `data or {}` ek optional nested object ke liye ek surakshit default deta hai.',
      },
      {
        en: '**The `x or default` idiom** is everywhere in real code — `self.name = name or self.__class__.__name__`, `timeout = timeout or settings.DEFAULT_TIMEOUT` — but it is also a recurring bug source when `0`, `""`, or `False` are valid values a caller might pass on purpose.',
        hi: '**`x or default` idiom** asli code mein har jagah hai — `self.name = name or self.__class__.__name__`, `timeout = timeout or settings.DEFAULT_TIMEOUT` — par ye ek dohraane waala bug source bhi hai jab `0`, `""`, ya `False` valid values hain jo ek caller jaan-boojhkar pass kar sakta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why should you write `if x is None` rather than `if x == None`?',
        qHi: 'Aapko `if x == None` ke bajaye `if x is None` kyun likhna chahiye?',
        a: 'None is a singleton — the Python runtime creates exactly one None object and every reference to None points at that same object. So the question "is this value None" is really a question about object identity, and the is operator answers exactly that: it checks whether two names refer to the same object in memory, and nothing can override or fake it. The equality operator is different. When you write x equals-equals None, Python calls the double-underscore eq method on x, and that method is defined by x\'s type. For a plain value it will return True or False as you expect, but many important types override eq to do something else. A numpy array compared to None returns an array of booleans, not a single boolean, and putting that in an if statement raises a ValueError about an ambiguous truth value. A pandas DataFrame does similar. Django ORM query expressions, SQLAlchemy columns, and various custom classes override eq to build query objects or comparison nodes rather than evaluate to a bool. In all those cases x equals-equals None either crashes or silently produces a wrong branch, while x is None quietly does the right thing. Because you often cannot be certain what type x will be at every call site, especially in library code or a large codebase, the safe and idiomatic rule is always is None and is not None. The same reasoning applies to comparing against True and False with is when you specifically mean the singleton, though in practice for booleans you usually want bare truthiness — if x rather than if x is True — because that also handles truthy non-bool values sensibly.',
        aHi: 'None ek singleton hai — Python runtime bilkul ek None object banaata hai aur None ka har reference us hi object par point karta hai. Toh sawaal "kya ye value None hai" asal mein object identity ke baare mein ek sawaal hai, aur is operator bilkul wahi jawaab deta hai: ye check karta hai ki kya do naam memory mein wahi object refer karte hain, aur kuch ise override ya fake nahi kar sakta. Equality operator alag hai. Jab aap x equals-equals None likhte ho, Python x par double-underscore eq method call karta hai, aur wo method x ke type se define hota hai. Ek plain value ke liye ye True ya False lautaayega jaisa aap ummeed karte ho, par kayi mahatvapurna types eq override karke kuch aur karte hain. None se compare kiya ek numpy array booleans ka ek array lautaata hai, ek akela boolean nahi, aur use ek if statement mein rakhna ek ambiguous truth value ke baare mein ek ValueError deta hai. Django ORM query expressions, SQLAlchemy columns, aur alag custom classes eq override karke query objects banaate hain. Un sab cases mein x equals-equals None ya toh crash karta hai ya chupchaap ek galat branch banaata hai, jabki x is None chupchaap sahi karta hai. Surakshit aur idiomatic niyam hamesha is None aur is not None hai.',
      },
      {
        q: 'Explain how `and` and `or` evaluate in Python and how `x or default` differs from a null-coalescing operator.',
        qHi: 'Python mein `and` aur `or` kaise evaluate hote hain aur `x or default` ek null-coalescing operator se kaise alag hai samjhaao.',
        a: 'In Python and and or do not necessarily return a boolean; they return one of their operands, and they short-circuit. For or, Python evaluates the left operand, and if it is truthy it returns that operand immediately without touching the right one; only if the left is falsy does it evaluate and return the right operand. So the value of a or b is a if a is truthy, otherwise b, and if b is also falsy you get b. For and it is the mirror image: Python returns the left operand if it is falsy, otherwise it evaluates and returns the right operand. So a and b is a if a is falsy, otherwise b. Short-circuiting means the right side is never evaluated when the left already determines the answer, which is what makes patterns like obj and obj dot method safe when obj might be None, and or default cheap when the default is expensive to compute. Now the difference from a null-coalescing operator, which some languages write as double question mark. A null-coalescing operator provides the fallback only when the left side is specifically null or undefined; a real zero, an empty string, an empty list, or false pass through unchanged. Python\'s or is broader: it falls back for any falsy value. So page equals request dot get of page or one will substitute one not just when page is missing but also when the caller explicitly passed zero, which is often a bug because zero was a deliberate choice. Python has no true null-coalescing operator. The correct patterns are: use the dictionary get method with a default argument when you want "only if the key is absent", and use an explicit is None check when zero, empty string, or false are legitimate values you must not override.',
        aHi: 'Python mein and aur or zaroori nahi ki ek boolean lautaayein; wo apne operands mein se ek lautaate hain, aur wo short-circuit karte hain. or ke liye, Python left operand evaluate karta hai, aur agar wo truthy hai to ise turant lautaata hai right ko chhoo bhi nahi; sirf agar left falsy hai to wo right operand evaluate aur lautaata hai. Toh a or b ki value a hai agar a truthy hai, warna b. and ke liye ye ulti chhavi hai: Python left operand lautaata hai agar wo falsy hai, warna wo right operand evaluate aur lautaata hai. Short-circuiting ka matlab hai right side kabhi evaluate nahi hota jab left pehle hi jawaab tay kar deta hai, jo obj and obj dot method jaise patterns ko surakshit banaata hai jab obj None ho sakta hai. Ab null-coalescing operator se antar, jise kuch languages double question mark likhti hain. Ek null-coalescing operator fallback sirf tab deta hai jab left side khaas roop se null ya undefined ho; ek asli zero, ek empty string, ek empty list, ya false bina badle guzarte hain. Python ka or vyaapak hai: ye kisi bhi falsy value ke liye fallback karta hai. Python mein koi asli null-coalescing operator nahi.',
      },
    ],

    exercises: [
      {
        task: 'Write `first_truthy(*values)` that returns the first truthy argument, or `None` if all are falsy — using only `or` in a loop (or `reduce`). Test: `first_truthy(0, "", [], "found", 5)` -> `"found"`, `first_truthy(0, "", [])` -> `None`.',
        taskHi: '`first_truthy(*values)` likho jo pehla truthy argument lautaata hai, ya `None` agar sab falsy hain — sirf `or` istemal karke ek loop mein (ya `reduce`). Test: `first_truthy(0, "", [], "found", 5)` -> `"found"`, `first_truthy(0, "", [])` -> `None`.',
        hint: '`result = None; for v in values: result = result or v; return result`. Because `or` returns the first truthy operand, once `result` is set it stays; if nothing is truthy it stays `None`.',
        hintHi: '`result = None; for v in values: result = result or v; return result`. Kyunki `or` pehla truthy operand lautaata hai, ek baar `result` set hone par wo rehta hai; agar kuch truthy nahi hai to wo `None` rehta hai.',
      },
      {
        task: 'In the REPL, evaluate `bool(x)` for each: `0`, `0.0`, `""`, `" "`, `"0"`, `"False"`, `[]`, `[0]`, `{}`, `{0: 0}`, `None`, `-1`, `0.0001`. Write down which ones surprised you.',
        taskHi: 'REPL mein, har ek ke liye `bool(x)` evaluate karo: `0`, `0.0`, `""`, `" "`, `"0"`, `"False"`, `[]`, `[0]`, `{}`, `{0: 0}`, `None`, `-1`, `0.0001`. Likho kaunse ne aapko chaunkaaya.',
        hint: '`" "` (a space) is truthy, `"0"` and `"False"` are truthy (non-empty strings), `[0]` and `{0: 0}` are truthy (non-empty containers). Only genuinely empty containers and numeric zeros and None are falsy.',
        hintHi: '`" "` (ek space) truthy hai, `"0"` aur `"False"` truthy hain (non-empty strings), `[0]` aur `{0: 0}` truthy hain (non-empty containers). Sirf sachmuch empty containers aur numeric zeros aur None falsy hain.',
      },
      {
        task: 'Write `apply_default(value, default)` that returns `default` when `value` is None but returns `value` unchanged when it is `0`, `""`, or `False`. Test it distinguishes `apply_default(None, 10) == 10` from `apply_default(0, 10) == 0`.',
        taskHi: '`apply_default(value, default)` likho jo `default` lautaata hai jab `value` None ho par `value` ko abadalte lautaata hai jab wo `0`, `""`, ya `False` ho. Test karo ki ye `apply_default(None, 10) == 10` ko `apply_default(0, 10) == 0` se alag karta hai.',
        hint: '`return default if value is None else value`. Using `value or default` would wrongly return `default` for `0`, `""`, and `False`.',
        hintHi: '`return default if value is None else value`. `value or default` istemal karna `0`, `""`, aur `False` ke liye galat tarike se `default` lautaayega.',
      },
    ],

    keyTakeaways: [
      'It is `True` / `False` / `None` — capitalised, and `None` is one thing (not JS\'s null + undefined). No `true`/`false`/`null`.',
      'Always `x is None` / `x is not None`, never `== None`. `is` checks identity (unfakeable, always a real bool); `==` calls `__eq__` which numpy/pandas/ORM types override.',
      'Falsy: `None`, `False`, `0`, `0.0`, `""`, `[]`, `{}`, `()`, `set()`. Everything else is truthy — including `"0"`, `" "`, `[0]`.',
      'Use bare truthiness: `if items:` (non-empty), `if not items:` (empty/missing). Reserve `if x is None:` for when `0`/`""` are valid values you must distinguish.',
      '`and`/`or` return an OPERAND, not a bool, and short-circuit. `a or b` = first truthy (or last). `a and b` = first falsy (or last).',
      '`x or default` fires for ANY falsy value, not just None — there is no true `??`. Use `dict.get(key, default)` for missing-key defaults; `is not None` when 0 is valid.',
      'Python chains comparisons: `0 <= i < len(x)` means `(0 <= i) and (i < len(x))` with `i` evaluated once.',
      'Never `if x == True` — just `if x`. Comparing to the boolean literal is redundant and breaks for truthy non-bools.',
    ],
    keyTakeawaysHi: [
      'Ye `True` / `False` / `None` hai — capitalised, aur `None` ek cheez hai (JS ka null + undefined nahi). Koi `true`/`false`/`null` nahi.',
      'Hamesha `x is None` / `x is not None`, kabhi `== None` nahi. `is` identity check karta hai (fake nahi ho sakta, hamesha asli bool); `==` `__eq__` call karta hai jise numpy/pandas/ORM types override karte hain.',
      'Falsy: `None`, `False`, `0`, `0.0`, `""`, `[]`, `{}`, `()`, `set()`. Baaki sab truthy — `"0"`, `" "`, `[0]` sameet.',
      'Nangi truthiness istemal karo: `if items:` (non-empty), `if not items:` (empty/missing). `if x is None:` ko tab ke liye rakho jab `0`/`""` valid values hain jinhe alag karna hai.',
      '`and`/`or` ek OPERAND lautaate hain, ek bool nahi, aur short-circuit karte hain. `a or b` = pehla truthy (ya aakhri). `a and b` = pehla falsy (ya aakhri).',
      '`x or default` KISI bhi falsy value ke liye chalta hai, sirf None ke liye nahi — koi asli `??` nahi. Missing-key defaults ke liye `dict.get(key, default)`; jab 0 valid hai toh `is not None`.',
      'Python comparisons chain karta hai: `0 <= i < len(x)` matlab `(0 <= i) and (i < len(x))` jahaan `i` ek baar evaluate hota hai.',
      'Kabhi `if x == True` nahi — bas `if x`. Boolean literal se compare karna fizool hai aur truthy non-bools ke liye tootta hai.',
    ],
  },

  {
    slug: 'py-control-flow-if-for-while-match',
    title: 'Control Flow: elif, for-in, range, the Loop else, and match',
    titleHi: 'Control Flow: elif, for-in, range, Loop else, Aur match',
    description: 'Writing a counting loop the C way — `for (i = 0; i < len(items); i++)` — which is not valid Python syntax at all, and reaching for a `switch` statement that does not exist. Python\'s `for` always iterates directly over the items of something, you use `range` or `enumerate` when you genuinely need an index, and multi-way branching is `elif` or the newer `match`.',
    descriptionHi: 'Ek counting loop C tarike se likhna — `for (i = 0; i < len(items); i++)` — jo Python syntax hai hi nahi, aur ek `switch` statement ki taraf pahunchna jo maujood nahi. Python ka `for` hamesha kisi cheez ke items par seedhe iterate karta hai, aap `range` ya `enumerate` tab istemal karte ho jab aapko sachmuch ek index chahiye, aur multi-way branching `elif` ya naya `match` hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 5,

    analogy: {
      en: '**Handing out worksheets to a class, versus tracking a seat number and looking up who sits there.** The awkward way: keep a counter starting at zero, each round ask "is the counter still below the class size?", use the counter to look up the student in that seat, hand them a sheet, add one to the counter, repeat. Three moving parts you can get wrong — off-by-one at the start, off-by-one at the end, forgetting to increment. The natural way: just walk down the row handing a sheet to each student as you pass them. You never touch a number; the row itself tells you who is next and when you have reached the end. That walk is Python\'s `for student in class`. If you also need to write "student 3" on each sheet, you pair the walk with a running number — but the walk still drives it, the number just rides along (`enumerate`). And when you don\'t have a row of people at all, only a count — "do this 10 times" — you conjure a throwaway row of the numbers 0 through 9 and walk that (`range`). Multi-way choice ("if it is a circle do this, a square that, a triangle the other") is a ladder of `elif` rungs, or a `match` block that reads like a menu.',
      hi: '**Ek class ko worksheets baantna, versus ek seat number track karna aur dekhna kaun wahaan baithta hai.** Ajeeb tarika: ek counter zero se shuru rakho, har round poochho "kya counter abhi bhi class size se neeche hai?", counter ka istemal karke us seat mein student dhoondho, unhe ek sheet do, counter mein ek jodo, dohraao. Teen moving parts jinhe aap galat kar sakte ho — shuru mein off-by-one, ant mein off-by-one, increment bhoolna. Swabhaavik tarika: bas row ke neeche chalo har student ko ek sheet dete hue jaise aap unke paas se guzarte ho. Aap kabhi ek number ko nahi chhoote; row khud aapko batati hai kaun agla hai aur kab aap end tak pahunche. Wo walk Python ka `for student in class` hai. Agar aapko har sheet par "student 3" bhi likhna hai, aap walk ko ek running number ke saath pair karte ho — par walk abhi bhi ise chalaata hai, number bas saath aata hai (`enumerate`). Aur jab aapke paas logon ki ek row hai hi nahi, sirf ek count — "ye 10 baar karo" — aap 0 se 9 ke numbers ki ek phenkne-yogya row conjure karte ho aur use walk karte ho (`range`).',
    },

    simple: `**Start broken.** C-style \`for\`, \`switch\`, and \`i++\`:

\`\`\`python
items = ["a", "b", "c"]

for (i = 0; i < len(items); i++):     # SyntaxError -- not Python at all
    print(items[i])

x++                                    # SyntaxError -- no ++ or -- in Python

switch fruit:                          # SyntaxError -- no 'switch' keyword
    case "apple": ...
\`\`\`

None of that is Python syntax. There is no C-style \`for\`, no \`++\`/\`--\`, and (until 3.10) no \`switch\` at all.

**The fix: iterate the items directly; \`range\`/\`enumerate\` for indices; \`elif\` or \`match\`**

\`\`\`python
items = ["a", "b", "c"]

for item in items:                     # the normal loop: walk the items
    print(item)

for i, item in enumerate(items):       # when you need the index too
    print(i, item)

for i in range(3):                     # "do this 3 times" / 0, 1, 2
    print("tick", i)

# multi-way branch:
def describe(n):
    if n < 0:
        return "negative"
    elif n == 0:
        return "zero"
    elif n < 10:
        return "small"
    else:
        return "large"

# or, Python 3.10+:
def kind(shape):
    match shape:
        case "circle" | "ellipse":
            return "round"
        case "square" | "rectangle":
            return "boxy"
        case _:
            return "other"
\`\`\`

\`\`\`
for x in iterable:     iterate items directly -- lists, strings, dicts, files, ranges...
range(stop)            0, 1, ..., stop-1
range(start, stop)     start ... stop-1
range(start, stop, k)  step by k  (range(10, 0, -1) counts down)
enumerate(it)          yields (index, item) pairs -- enumerate(it, start=1) to start at 1
zip(a, b)              yields (a[i], b[i]) pairs -- stops at the shorter one
if / elif / elif / else   the multi-way ladder (no 'else if', it is one word 'elif')
x if cond else y       the conditional EXPRESSION (Python has no ?: operator)
\`\`\``,

    simpleHi: `**Toote hue se shuru.** C-style \`for\`, \`switch\`, aur \`i++\`:

\`\`\`python
items = ["a", "b", "c"]

for (i = 0; i < len(items); i++):     # SyntaxError -- Python hai hi nahi
    print(items[i])

x++                                    # SyntaxError -- Python mein koi ++ ya -- nahi

switch fruit:                          # SyntaxError -- koi 'switch' keyword nahi
    case "apple": ...
\`\`\`

Ye kuch bhi Python syntax nahi. Koi C-style \`for\` nahi, koi \`++\`/\`--\` nahi, aur (3.10 tak) koi \`switch\` bilkul nahi.

**Fix: items par seedhe iterate karo; indices ke liye \`range\`/\`enumerate\`; \`elif\` ya \`match\`**

\`\`\`python
items = ["a", "b", "c"]

for item in items:                     # normal loop: items walk karo
    print(item)

for i, item in enumerate(items):       # jab aapko index bhi chahiye
    print(i, item)

for i in range(3):                     # "ye 3 baar karo" / 0, 1, 2
    print("tick", i)

# multi-way branch:
def describe(n):
    if n < 0:
        return "negative"
    elif n == 0:
        return "zero"
    elif n < 10:
        return "small"
    else:
        return "large"

# ya, Python 3.10+:
def kind(shape):
    match shape:
        case "circle" | "ellipse":
            return "round"
        case "square" | "rectangle":
            return "boxy"
        case _:
            return "other"
\`\`\`

\`\`\`
for x in iterable:     items par seedhe iterate -- lists, strings, dicts, files, ranges...
range(stop)            0, 1, ..., stop-1
range(start, stop)     start ... stop-1
range(start, stop, k)  k se step  (range(10, 0, -1) neeche ginta hai)
enumerate(it)          (index, item) jodiyaan deta hai -- enumerate(it, start=1) 1 se shuru
zip(a, b)              (a[i], b[i]) jodiyaan deta hai -- chhote par rukta hai
if / elif / elif / else   multi-way ladder (koi 'else if' nahi, ek shabd 'elif')
x if cond else y       conditional EXPRESSION (Python mein koi ?: operator nahi)
\`\`\``,

    content: `## Iterating: the whole point is you rarely need an index

\`\`\`python
# iterate a list
for name in names: ...

# iterate a string -> characters
for ch in "hello": ...

# iterate a dict -> KEYS by default
for key in my_dict: ...
for key, value in my_dict.items(): ...      # keys and values
for value in my_dict.values(): ...

# iterate two lists together
for a, b in zip(list_a, list_b): ...

# iterate with a counter
for i, item in enumerate(items): ...
for i, item in enumerate(items, start=1): ...   # 1-based

# iterate backwards
for item in reversed(items): ...

# iterate a sorted view without changing the original
for item in sorted(items): ...
for item in sorted(items, key=len, reverse=True): ...
\`\`\`

If you catch yourself writing \`for i in range(len(x)):\` and then only using \`x[i]\`, switch to \`for item in x:\`. If you need both, use \`enumerate\`.

## \`range\` is lazy

\`\`\`python
range(1_000_000_000)     # instant -- it does NOT build a billion-element list
list(range(5))           # [0, 1, 2, 3, 4]  -- materialise it if you actually need the list
5 in range(0, 100, 5)    # True  -- range supports membership tests and indexing
range(10)[3]             # 3
len(range(2, 20, 3))     # 6
\`\`\`

## \`while\`, \`break\`, \`continue\`, and the loop \`else\`

\`\`\`python
# while: repeat until a condition goes false
while queue:
    task = queue.pop()
    process(task)

# break exits the loop; continue skips to the next iteration
for line in lines:
    if not line.strip():
        continue            # skip blank lines
    if line == "STOP":
        break               # end the loop entirely
    handle(line)

# the loop 'else' runs ONLY if the loop finished WITHOUT hitting break:
for item in haystack:
    if item == needle:
        print("found")
        break
else:
    print("not found")      # runs when the loop exhausted without break
\`\`\`

The loop \`else\` is unusual and often confusing — read it as "no break". It is genuinely useful for search loops.

## \`match\` (Python 3.10+): structural pattern matching, not just \`switch\`

\`\`\`python
def handle(command):
    match command.split():
        case ["go", direction]:
            return f"moving {direction}"
        case ["take", *items]:
            return f"taking {items}"
        case ["quit" | "exit"]:
            return "bye"
        case []:
            return "say something"
        case _:
            return "unknown command"

# match on shape/structure, with guards:
match point:
    case (0, 0):
        ...
    case (x, 0):
        ...
    case (x, y) if x == y:
        ...
    case {"type": "circle", "r": radius}:
        ...
\`\`\`

\`match\` destructures the value and binds names from the pattern. \`case _:\` is the catch-all. For a simple value switch, an \`if/elif\` chain or a dict lookup (\`{"a": handler_a, "b": handler_b}.get(key)\`) is often clearer.

## \`pass\`, and the conditional expression

\`\`\`python
def not_done_yet():
    pass                     # a required-but-empty block

status = "on" if enabled else "off"          # the ternary -- value, not statement
labels = [("+" if x > 0 else "-") for x in nums]
\`\`\``,

    contentHi: `## Iterating: poora point ye hai ki aapko shaayad hi ek index chahiye

\`\`\`python
# ek list iterate karo
for name in names: ...

# ek string iterate karo -> characters
for ch in "hello": ...

# ek dict iterate karo -> default mein KEYS
for key in my_dict: ...
for key, value in my_dict.items(): ...      # keys aur values
for value in my_dict.values(): ...

# do lists saath iterate karo
for a, b in zip(list_a, list_b): ...

# ek counter ke saath iterate karo
for i, item in enumerate(items): ...
for i, item in enumerate(items, start=1): ...   # 1-based

# peechhe iterate karo
for item in reversed(items): ...

# original badle bina ek sorted view iterate karo
for item in sorted(items): ...
for item in sorted(items, key=len, reverse=True): ...
\`\`\`

Agar aap khud ko \`for i in range(len(x)):\` likhte pakadte ho aur phir sirf \`x[i]\` istemal karte ho, \`for item in x:\` par switch karo. Agar aapko dono chahiye, \`enumerate\` istemal karo.

## \`range\` lazy hai

\`\`\`python
range(1_000_000_000)     # turant -- ye ek arab-element list NAHI banaata
list(range(5))           # [0, 1, 2, 3, 4]  -- agar sachmuch list chahiye to materialise karo
5 in range(0, 100, 5)    # True  -- range membership tests aur indexing support karta hai
range(10)[3]             # 3
len(range(2, 20, 3))     # 6
\`\`\`

## \`while\`, \`break\`, \`continue\`, aur loop \`else\`

\`\`\`python
# while: ek condition false hone tak dohraao
while queue:
    task = queue.pop()
    process(task)

# break loop se nikalta hai; continue agli iteration par skip karta hai
for line in lines:
    if not line.strip():
        continue            # blank lines skip karo
    if line == "STOP":
        break               # loop poori tarah khatam
    handle(line)

# loop 'else' SIRF tab chalta hai jab loop break MAARE BINA khatam ho:
for item in haystack:
    if item == needle:
        print("found")
        break
else:
    print("not found")      # tab chalta hai jab loop bina break ke khatam ho
\`\`\`

Loop \`else\` asaamaanya hai aur aksar confusing — ise "no break" ki tarah padho. Ye search loops ke liye sachmuch upyogi hai.

## \`match\` (Python 3.10+): structural pattern matching, sirf \`switch\` nahi

\`\`\`python
def handle(command):
    match command.split():
        case ["go", direction]:
            return f"moving {direction}"
        case ["take", *items]:
            return f"taking {items}"
        case ["quit" | "exit"]:
            return "bye"
        case []:
            return "say something"
        case _:
            return "unknown command"

# shape/structure par match, guards ke saath:
match point:
    case (0, 0):
        ...
    case (x, 0):
        ...
    case (x, y) if x == y:
        ...
    case {"type": "circle", "r": radius}:
        ...
\`\`\`

\`match\` value ko destructure karta hai aur pattern se naam bind karta hai. \`case _:\` catch-all hai. Ek simple value switch ke liye, ek \`if/elif\` chain ya ek dict lookup (\`{"a": handler_a, "b": handler_b}.get(key)\`) aksar zyaada saaf hai.

## \`pass\`, aur conditional expression

\`\`\`python
def not_done_yet():
    pass                     # ek zaroori-par-empty block

status = "on" if enabled else "off"          # ternary -- value, statement nahi
labels = [("+" if x > 0 else "-") for x in nums]
\`\`\``,

    examples: [
      {
        title: 'Broken: for i in range(len(x)) then only x[i]',
        titleHi: 'Toota: for i in range(len(x)) phir sirf x[i]',
        code: `words = ["red", "green", "blue"]

for i in range(len(words)):
    print(words[i].upper())

# and building a paired list the awkward way:
result = []
for i in range(len(words)):
    result.append(str(i) + ": " + words[i])
print(result)`,
        output: `RED
GREEN
BLUE
['0: red', '1: green', '2: blue']`,
        explain: 'This works but is not idiomatic. The first loop only ever uses `words[i]`, so it should be `for word in words:`. The second needs the index, so it should be `for i, word in enumerate(words):` — clearer and no `len`/index juggling.',
        explainHi: 'Ye kaam karta hai par idiomatic nahi. Pehla loop sirf `words[i]` istemal karta hai, isliye ye `for word in words:` hona chahiye. Doosre ko index chahiye, isliye ye `for i, word in enumerate(words):` hona chahiye — zyaada saaf aur koi `len`/index juggling nahi.',
      },
      {
        title: 'Fixed: for-in, enumerate, zip, the loop else',
        titleHi: 'Theek: for-in, enumerate, zip, loop else',
        code: `words = ["red", "green", "blue"]
codes = ["#f00", "#0f0", "#00f"]

for word in words:
    print(word.upper())

for i, word in enumerate(words, start=1):
    print(f"{i}. {word}")

for word, code in zip(words, codes):
    print(f"{word} -> {code}")

# search with the loop else
target = "green"
for word in words:
    if word == target:
        print(f"{target} is present")
        break
else:
    print(f"{target} not found")`,
        output: `RED
GREEN
BLUE
1. red
2. green
3. blue
red -> #f00
green -> #0f0
blue -> #00f
green is present`,
        explain: '`enumerate(words, start=1)` gives 1-based numbering directly. `zip` pairs two lists element-wise. The `for/else` prints "not found" only if the loop completes without `break` — here it breaks on "green", so the `else` is skipped.',
        explainHi: '`enumerate(words, start=1)` seedhe 1-based numbering deta hai. `zip` do lists ko element-wise pair karta hai. `for/else` "not found" sirf tab print karta hai jab loop bina `break` ke poora ho — yahaan ye "green" par break karta hai, isliye `else` skip hota hai.',
      },
      {
        title: 'match on structure, and a dict dispatch alternative',
        titleHi: 'structure par match, aur ek dict dispatch vikalp',
        code: `def run(cmd):
    match cmd.split():
        case ["move", ("north" | "south" | "east" | "west") as d]:
            return f"moving {d}"
        case ["move", *rest]:
            return f"cannot move: {' '.join(rest)}"
        case ["stop"]:
            return "stopped"
        case []:
            return "no command"
        case _:
            return "?"

print(run("move north"))
print(run("move up left"))
print(run("stop"))
print(run(""))

# a simple value switch is often just a dict:
HANDLERS = {"add": lambda a, b: a + b, "mul": lambda a, b: a * b}
op = HANDLERS.get("add", lambda a, b: None)
print(op(3, 4))`,
        output: `moving north
cannot move: up left
stopped
no command
7`,
        explain: 'The `match` destructures the split command list: `["move", d]` binds `d`, the `("north" | ...) as d` sub-pattern restricts and names it, `*rest` captures the remainder. For a plain string-to-function switch, `HANDLERS.get(key, default)` is shorter than a `match` or an `if/elif` chain.',
        explainHi: '`match` split command list ko destructure karta hai: `["move", d]` `d` bind karta hai, `("north" | ...) as d` sub-pattern ise restrict aur name karta hai, `*rest` baaki capture karta hai. Ek plain string-to-function switch ke liye, `HANDLERS.get(key, default)` ek `match` ya `if/elif` chain se chhota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `for i in range(1, len(items)):
    compare(items[i-1], items[i])
# ...forgot that range(1, len) is fine, but range(len) then items[i+1] is not`,
        right: `for a, b in zip(items, items[1:]):
    compare(a, b)`,
        why: 'Iterating adjacent pairs by index is off-by-one prone. `zip(items, items[1:])` pairs each item with the next one cleanly, stopping automatically at the end. `enumerate` and `zip` eliminate most manual index arithmetic.',
        whyHi: 'Adjacent pairs ko index se iterate karna off-by-one prone hai. `zip(items, items[1:])` har item ko agle ke saath saaf pair karta hai, ant par apne aap rukte hue. `enumerate` aur `zip` adhikaansh manual index arithmetic hataate hain.',
      },
      {
        wrong: `for x in items:
    if x == bad:
        items.remove(x)     # mutating the list you are iterating`,
        right: `items = [x for x in items if x != bad]
# or iterate a copy:  for x in items[:]:`,
        why: 'Modifying a list while iterating it skips elements or raises — the internal index gets out of sync with the shrinking list. Build a new list with a comprehension, or iterate over a copy (`items[:]`) and mutate the original.',
        whyHi: 'Ek list ko iterate karte hue modify karna elements skip karta hai ya error deta hai — internal index sikudti list ke saath out of sync ho jaata hai. Ek comprehension se ek nayi list banao, ya ek copy (`items[:]`) par iterate karo aur original mutate karo.',
      },
      {
        wrong: `count = 0
while count < 10:
    print(count)
    # forgot count += 1  -> infinite loop`,
        right: `for count in range(10):
    print(count)`,
        why: 'A `while` loop with a manual counter is the classic infinite-loop bug — forget the increment and it never ends. If you are counting a fixed number of times, `for count in range(n)` cannot forget to advance. Reserve `while` for "until some condition changes".',
        whyHi: 'Ek manual counter waala `while` loop classic infinite-loop bug hai — increment bhoolo aur ye kabhi khatam nahi hota. Agar aap ek fixed number of times gin rahe ho, `for count in range(n)` advance karna nahi bhool sakta. `while` ko "jab tak koi condition badle" ke liye rakho.',
      },
    ],

    realWorld: [
      {
        en: '**Django views iterate querysets directly**: `for order in Order.objects.filter(...)` — never `for i in range(len(...))`. `enumerate(queryset, start=1)` numbers rows in a report; `zip(headers, row)` pairs column names with values.',
        hi: '**Django views querysets par seedhe iterate karte hain**: `for order in Order.objects.filter(...)` — kabhi `for i in range(len(...))` nahi. `enumerate(queryset, start=1)` ek report mein rows number karta hai; `zip(headers, row)` column names ko values ke saath pair karta hai.',
      },
      {
        en: '**DRF and Django use dict dispatch heavily** — a router maps a method name to a handler, a serializer maps a field type to a converter. `{"GET": self.list, "POST": self.create}[request.method]()` is cleaner than a `match` for a small fixed set.',
        hi: '**DRF aur Django dict dispatch bahut istemal karte hain** — ek router ek method name ko ek handler se map karta hai, ek serializer ek field type ko ek converter se. `{"GET": self.list, "POST": self.create}[request.method]()` ek chhote fixed set ke liye ek `match` se saaf hai.',
      },
      {
        en: '**The `for/else` search pattern** appears in validation and lookup code: loop over allowed values, `break` on a match, and the `else` raises "not a valid choice" — the loop-completed-without-finding case.',
        hi: '**`for/else` search pattern** validation aur lookup code mein dikhta hai: allowed values par loop, ek match par `break`, aur `else` "not a valid choice" deta hai — loop-completed-without-finding case.',
      },
    ],

    interviewQA: [
      {
        q: 'How does Python\'s `for` loop differ from a C-style `for`, and what do `range`, `enumerate`, and `zip` give you?',
        qHi: 'Python ka `for` loop ek C-style `for` se kaise alag hai, aur `range`, `enumerate`, aur `zip` aapko kya dete hain?',
        a: 'A C-style for loop has three explicit parts: an initialiser, a condition, and an update, and the body typically uses an index to reach into an array. Python has nothing like that. Python\'s for loop is a for-each: it takes any iterable — a list, a string, a dictionary, a file, a generator, a range — and binds a name to each item in turn, running the body once per item. There is no counter unless you create one, and there is no bounds condition because the iterable itself signals when it is exhausted. This eliminates the two classic off-by-one errors, starting at one instead of zero and stopping at length instead of length minus one, because you never write those bounds. When you genuinely need the integers themselves, range gives them to you as a lazy sequence: range of n yields zero up to n minus one without building a list, range of start and stop yields that half-open interval, and a third argument is the step, so range of ten, zero, minus one counts down. When you need both the item and its position, enumerate wraps the iterable and yields index-item pairs, and it takes a start argument so you can get one-based numbering directly. When you need to walk two or more sequences in lockstep, zip yields tuples of corresponding elements and stops at the shortest input. The guideline that falls out of this is: if you find yourself writing for i in range of len of x and then only ever using x at i, you should be writing for item in x; if you also use i, you should be using enumerate; and if you are indexing into a second list with the same i, you should be using zip. Manual index arithmetic in a Python loop is almost always a sign that a built-in would be clearer and less error-prone.',
        aHi: 'Ek C-style for loop ke teen explicit hisse hain: ek initialiser, ek condition, aur ek update, aur body aam taur par ek array mein pahunchne ke liye ek index istemal karta hai. Python mein aisa kuch nahi. Python ka for loop ek for-each hai: ye koi bhi iterable leta hai — ek list, ek string, ek dictionary, ek file, ek generator, ek range — aur baari-baari har item se ek naam bind karta hai, prati item body ek baar chalate hue. Koi counter nahi jab tak aap ek na banao, aur koi bounds condition nahi kyunki iterable khud batata hai kab wo khatam hai. Ye do classic off-by-one errors hataata hai. Jab aapko sachmuch integers khud chahiye, range unhe ek lazy sequence ki tarah deta hai. Jab aapko item aur iski position dono chahiye, enumerate iterable ko wrap karta hai aur index-item jodiyaan deta hai, aur ye ek start argument leta hai. Jab aapko do ya zyaada sequences ko lockstep mein walk karna hai, zip corresponding elements ke tuples deta hai aur sabse chhote input par rukta hai.',
      },
      {
        q: 'What does the `else` clause on a `for` or `while` loop do, and when is it useful?',
        qHi: 'Ek `for` ya `while` loop par `else` clause kya karta hai, aur ye kab upyogi hai?',
        a: 'A loop in Python can have an else block attached to it, and the rule is that the else runs if and only if the loop finished normally — meaning it ran to completion without a break statement ever firing. If the loop body executes a break, the else is skipped entirely. If the loop never executes at all because the iterable was empty or the while condition was false from the start, that still counts as finishing normally, so the else runs. The name is misleading; a better mental model is to read it as no break. Where this is genuinely useful is a search loop. You loop over a collection looking for something, and if you find it you break out, possibly after doing something with it. The question afterwards is how to tell whether the search succeeded or the collection was exhausted without a match. Without the loop else you need a flag variable: set found to false before the loop, set it to true right before the break, and check the flag after. The loop else removes the flag: you put the not-found handling in the else, and it runs exactly when no break happened, which is exactly when the search failed. It is also occasionally used for retry loops — try an operation up to n times with break on success, and the else raises the final failure. The reason many style guides are lukewarm on it is that the semantics surprise people who have not seen it, so a comment or a small helper function is often clearer for a team. But it is real Python, it appears in the standard library, and you should recognise it.',
        aHi: 'Python mein ek loop ke saath ek else block juda ho sakta hai, aur niyam ye hai ki else tabhi chalta hai jab loop normally khatam ho — matlab ye ek break statement kabhi chale bina poora chala. Agar loop body ek break execute karta hai, else poori tarah skip hota hai. Agar loop bilkul nahi chalta kyunki iterable empty tha ya while condition shuru se false thi, wo phir bhi normally khatam hona ginta hai, isliye else chalta hai. Naam bhramit karne waala hai; ek behtar mental model ise "no break" ki tarah padhna hai. Ye jahaan sachmuch upyogi hai wo ek search loop hai. Aap ek collection par loop karte ho kuch dhoondhte hue, aur agar aap ise paate ho to aap nikal jaate ho. Uske baad sawaal ye hai ki kaise bataayein ki search safal hua ya collection bina match ke khatam ho gaya. Loop else ke bina aapko ek flag variable chahiye. Loop else flag hataata hai: aap not-found handling else mein rakhte ho, aur wo bilkul tab chalta hai jab koi break nahi hua.',
      },
    ],

    exercises: [
      {
        task: 'Write `first_index(items, target)` that returns the index of `target` in `items`, or `-1` if absent — using `for i, item in enumerate(items)` and the loop `else` (not `.index()`). Test with a present and an absent target.',
        taskHi: '`first_index(items, target)` likho jo `items` mein `target` ka index lautaata hai, ya `-1` agar absent — `for i, item in enumerate(items)` aur loop `else` istemal karke (`.index()` nahi). Ek present aur ek absent target ke saath test karo.',
        hint: '`for i, item in enumerate(items): if item == target: return i` then `else: return -1` aligned with the `for`. The `else` runs only when the loop completes without `return`/`break`.',
        hintHi: '`for i, item in enumerate(items): if item == target: return i` phir `for` ke saath aligned `else: return -1`. `else` sirf tab chalta hai jab loop bina `return`/`break` ke poora ho.',
      },
      {
        task: 'Write `pairwise_diffs(nums)` returning a list of `nums[i+1] - nums[i]` for each adjacent pair, using `zip(nums, nums[1:])`. Test: `pairwise_diffs([1, 4, 9, 16])` -> `[3, 5, 7]`.',
        taskHi: '`pairwise_diffs(nums)` likho jo har adjacent pair ke liye `nums[i+1] - nums[i]` ki ek list lautaata hai, `zip(nums, nums[1:])` istemal karke. Test: `pairwise_diffs([1, 4, 9, 16])` -> `[3, 5, 7]`.',
        hint: '`[b - a for a, b in zip(nums, nums[1:])]`. `nums[1:]` is the list shifted left by one; zipping pairs each element with its successor and stops at the end.',
        hintHi: '`[b - a for a, b in zip(nums, nums[1:])]`. `nums[1:]` ek se baayen shift ki gayi list hai; zipping har element ko iske successor ke saath pair karta hai aur ant par rukta hai.',
      },
      {
        task: 'Write `classify(n)` using `match` (3.10+) that returns "fizzbuzz" if n divisible by 15, "fizz" if by 3, "buzz" if by 5, else str(n). Use `match (n % 3, n % 5):` with cases `(0, 0)`, `(0, _)`, `(_, 0)`, `_`. Test on 15, 9, 10, 7.',
        taskHi: '`classify(n)` likho `match` (3.10+) istemal karke jo "fizzbuzz" lautaata hai agar n 15 se divisible, "fizz" agar 3 se, "buzz" agar 5 se, warna str(n). `match (n % 3, n % 5):` cases `(0, 0)`, `(0, _)`, `(_, 0)`, `_` ke saath istemal karo. 15, 9, 10, 7 par test karo.',
        hint: 'Matching on the tuple `(n % 3, n % 5)`: `(0, 0)` means divisible by both (i.e. by 15), `(0, _)` means divisible by 3 only, `(_, 0)` by 5 only, `_` neither.',
        hintHi: 'Tuple `(n % 3, n % 5)` par match: `(0, 0)` matlab dono se divisible (yaani 15 se), `(0, _)` matlab sirf 3 se, `(_, 0)` sirf 5 se, `_` koi nahi.',
      },
    ],

    keyTakeaways: [
      'There is no C-style `for`, no `++`/`--`. Python `for` iterates the ITEMS of an iterable directly: `for item in items:`.',
      '`range(stop)` / `range(start, stop, step)` gives a lazy integer sequence for "do this n times". `list(range(...))` to materialise it.',
      '`enumerate(it, start=0)` yields `(index, item)` pairs — use when you need the position. `zip(a, b)` yields `(a[i], b[i])` and stops at the shorter.',
      'If you write `for i in range(len(x))` and only use `x[i]`, switch to `for item in x`. Need the index too? `enumerate`. Indexing a parallel list? `zip`.',
      'Multi-way branch is `if / elif / elif / else` — one word `elif`, not `else if`. The ternary is a conditional EXPRESSION: `a if cond else b` (no `?:`).',
      'The loop `else` runs only if the loop finished WITHOUT `break` — read it as "no break". Useful for search loops (found via break vs exhausted).',
      '`match`/`case` (3.10+) does structural pattern matching — destructures and binds names, `case _:` is the catch-all. For a plain value switch, `if/elif` or a dict lookup is often clearer.',
      'Never mutate a list while iterating it. Build a new list with a comprehension, or iterate a copy (`items[:]`).',
    ],
    keyTakeawaysHi: [
      'Koi C-style `for` nahi, koi `++`/`--` nahi. Python `for` ek iterable ke ITEMS par seedhe iterate karta hai: `for item in items:`.',
      '`range(stop)` / `range(start, stop, step)` "ye n baar karo" ke liye ek lazy integer sequence deta hai. Ise materialise karne ko `list(range(...))`.',
      '`enumerate(it, start=0)` `(index, item)` jodiyaan deta hai — jab aapko position chahiye tab istemal. `zip(a, b)` `(a[i], b[i])` deta hai aur chhote par rukta hai.',
      'Agar aap `for i in range(len(x))` likhte ho aur sirf `x[i]` istemal karte ho, `for item in x` par switch karo. Index bhi chahiye? `enumerate`. Ek parallel list index karna? `zip`.',
      'Multi-way branch `if / elif / elif / else` hai — ek shabd `elif`, `else if` nahi. Ternary ek conditional EXPRESSION hai: `a if cond else b` (koi `?:` nahi).',
      'Loop `else` sirf tab chalta hai jab loop `break` MAARE BINA khatam ho — ise "no break" ki tarah padho. Search loops ke liye upyogi.',
      '`match`/`case` (3.10+) structural pattern matching karta hai — destructure aur naam bind karta hai, `case _:` catch-all hai. Ek plain value switch ke liye, `if/elif` ya ek dict lookup aksar saaf hai.',
      'Kabhi ek list ko iterate karte hue mutate mat karo. Ek comprehension se ek nayi list banao, ya ek copy (`items[:]`) iterate karo.',
    ],
  },

  {
    slug: 'py-functions-basics-and-main-guard',
    title: 'Functions and the __main__ Guard: return None, Keyword Args, and Import Safety',
    titleHi: 'Functions Aur __main__ Guard: return None, Keyword Args, Aur Import Safety',
    description: 'Writing a script that does its work at the top level of the file — reading a file, calling an API, printing a report — with no `if __name__ == "__main__":` around it. It runs fine when you execute it directly. But the moment another file does `import your_script` to reuse one function from it, all of that top-level work runs again as a side effect of the import.',
    descriptionHi: 'Ek script likhna jo apna kaam file ke top level par karti hai — ek file padhna, ek API call karna, ek report print karna — iske aas-paas koi `if __name__ == "__main__":` nahi. Jab aap ise seedhe execute karte ho ye theek chalti hai. Par jis pal ek doosri file `import your_script` karti hai ismein se ek function reuse karne ko, wo saara top-level kaam import ke ek side effect ki tarah phir chalta hai.',
    difficulty: 'EASY',
    duration: 18,
    order: 6,

    analogy: {
      en: '**A recipe card that also has "and now cook it and serve dinner for six" printed at the bottom.** If you are the one cooking tonight, great — you read the card top to bottom and dinner happens. But a friend just wants to borrow your sauce technique for their own meal. They pick up your card to read that one paragraph — and because the card ends with "cook it and serve dinner for six", the act of reading it drags them into cooking a whole dinner they did not want. A well-made recipe card keeps the reusable parts — the sauce method, the dough method — as clearly labelled sections that do nothing on their own, and puts the "and here is how I make tonight\'s specific dinner" in a section clearly marked "only if you are the host tonight". In Python, importing a file runs every line at its top level, exactly like reading the card runs whatever is printed on it. The `if __name__ == "__main__":` block is the "only if you are the host tonight" label: the lines inside it run when the file is executed directly, and are skipped when the file is merely imported for its functions.',
      hi: '**Ek recipe card jismein neeche "aur ab ise pakao aur chhah ke liye dinner serve karo" bhi chhapa hai.** Agar aap aaj raat pakaane waale ho, badhiya — aap card upar se neeche padhte ho aur dinner ho jaata hai. Par ek dost bas aapki sauce technique apne khaane ke liye udhaar lena chahta hai. Wo aapka card uthaate hain wo ek paragraph padhne ko — aur kyunki card "ise pakao aur chhah ke liye dinner serve karo" se khatam hota hai, use padhne ki kriya unhe ek poore dinner mein ghaseet leti hai jo wo nahi chahte the. Ek achhi tarah banaaya recipe card reusable hisse — sauce method, dough method — ko saaf label kiye sections ki tarah rakhta hai jo apne aap kuch nahi karte, aur "aur yahaan main aaj raat ka khaas dinner kaise banaata hoon" ko ek section mein rakhta hai jo saaf "sirf agar aap aaj raat host ho" mark hai. Python mein, ek file import karna iske top level par har line chalaata hai, bilkul jaise card padhna jo bhi ispar chhapa hai chalaata hai. `if __name__ == "__main__":` block "sirf agar aap aaj raat host ho" label hai.',
    },

    simple: `**Start broken.** A script that does its work at module level:

\`\`\`python
# report.py

def load(path):
    with open(path) as f:
        return [line.strip() for line in f]

def summarise(rows):
    return f"{len(rows)} rows"

rows = load("data.txt")          # runs at import time!
print(summarise(rows))           # prints at import time!
print("report complete")
\`\`\`

Run it directly: fine. But now another file wants \`summarise\`:

\`\`\`python
# other.py
from report import summarise    # <-- this ALSO runs load("data.txt") and both prints
\`\`\`

Importing \`report\` executes every top-level line: it opens \`data.txt\` (crashes if that file is not there), and prints two lines you did not ask for. Tests that import the module get the side effects too.

**The fix: put the "run it" code behind \`if __name__ == "__main__":\`**

\`\`\`python
# report.py

def load(path):
    with open(path) as f:
        return [line.strip() for line in f]

def summarise(rows):
    return f"{len(rows)} rows"

def main():
    rows = load("data.txt")
    print(summarise(rows))
    print("report complete")

if __name__ == "__main__":       # True only when run directly, not on import
    main()
\`\`\`

\`\`\`
When Python runs a file DIRECTLY:      __name__ == "__main__"   -> the block runs
When Python IMPORTS a file:            __name__ == "report"     -> the block is skipped

So: definitions (def, class, constants) at the top level are fine — they just
create names. Anything that DOES something (I/O, prints, API calls, running a
pipeline) goes inside main() and is called from the __name__ guard.
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Ek script jo apna kaam module level par karti hai:

\`\`\`python
# report.py

def load(path):
    with open(path) as f:
        return [line.strip() for line in f]

def summarise(rows):
    return f"{len(rows)} rows"

rows = load("data.txt")          # import time par chalta hai!
print(summarise(rows))           # import time par print karta hai!
print("report complete")
\`\`\`

Ise seedhe chalao: theek. Par ab ek doosri file \`summarise\` chahti hai:

\`\`\`python
# other.py
from report import summarise    # <-- ye load("data.txt") aur dono prints BHI chalaata hai
\`\`\`

\`report\` import karna har top-level line execute karta hai: ye \`data.txt\` kholta hai (agar wo file nahi hai to crash), aur do lines print karta hai jo aapne nahi maangi. Tests jo module import karte hain unhe bhi side effects milte hain.

**Fix: "run it" code ko \`if __name__ == "__main__":\` ke peechhe rakho**

\`\`\`python
# report.py

def load(path):
    with open(path) as f:
        return [line.strip() for line in f]

def summarise(rows):
    return f"{len(rows)} rows"

def main():
    rows = load("data.txt")
    print(summarise(rows))
    print("report complete")

if __name__ == "__main__":       # sirf tab True jab seedhe chale, import par nahi
    main()
\`\`\`

\`\`\`
Jab Python ek file SEEDHE chalaata hai:   __name__ == "__main__"   -> block chalta hai
Jab Python ek file IMPORT karta hai:      __name__ == "report"     -> block skip hota hai

Toh: top level par definitions (def, class, constants) theek hain — wo bas naam
banaate hain. Jo bhi kuch KARTA hai (I/O, prints, API calls, ek pipeline chalana)
main() ke andar jaata hai aur __name__ guard se call hota hai.
\`\`\``,

    content: `## Defining and calling

\`\`\`python
def area(width, height):
    """Return the rectangle's area."""     # docstring: help(area) shows this
    return width * height

area(3, 4)              # 12  -- positional
area(width=3, height=4) # 12  -- keyword (order-independent)
area(3, height=4)       # 12  -- positional then keyword
area(height=4, 3)       # SyntaxError -- positional cannot follow keyword
\`\`\`

A function with no \`return\`, or a bare \`return\`, returns \`None\`. \`x = print("hi")\` sets \`x\` to \`None\` — \`print\` returns nothing.

## Default arguments (and the one trap)

\`\`\`python
def connect(host, port=5432, timeout=30):
    ...

connect("db.example.com")               # port=5432, timeout=30
connect("db.example.com", timeout=5)    # port=5432, timeout=5   (skip via keyword)

# THE TRAP: a mutable default is created ONCE, at def time, and shared:
def add_item(item, basket=[]):          # BUG
    basket.append(item)
    return basket

add_item("a")     # ['a']
add_item("b")     # ['a', 'b']   <-- the SAME list! not a fresh one

# the fix:
def add_item(item, basket=None):
    if basket is None:
        basket = []
    basket.append(item)
    return basket
\`\`\`

This mutable-default trap is covered in depth in Module 3; for now: **never use \`[]\`, \`{}\`, or \`set()\` as a default value — use \`None\` and create it inside.**

## Multiple return values are just a tuple

\`\`\`python
def divmod_(a, b):
    return a // b, a % b        # returns a tuple (q, r)

q, r = divmod_(17, 5)          # unpacking: q=3, r=2
result = divmod_(17, 5)       # result = (3, 2)
\`\`\`

There is no "out parameter". Return a tuple, and the caller unpacks it (or a small object / dataclass if there are many values).

## \`return\` early, and the implicit \`None\`

\`\`\`python
def find_user(users, user_id):
    for user in users:
        if user.id == user_id:
            return user        # found -> return immediately
    return None                # explicit is clearer than falling off the end

# falling off the end also returns None, but say so:
def validate(data):
    if not data:
        return                 # bare return == return None
    ...
\`\`\`

## \`__name__\`: what it actually is

\`\`\`python
# in any module, __name__ is a string:
#   "__main__"   if this file is the one you ran:  python report.py
#   "report"     if this file was imported:        import report
#   "pkg.report" if imported from a package

print(f"running as {__name__}")

if __name__ == "__main__":
    # CLI entry point, quick self-test, or a demo
    main()
\`\`\`

Django's \`manage.py\` is exactly this pattern — it is a script with a \`__main__\` guard that dispatches to Django's command machinery. Your own management commands and one-off scripts follow the same shape.

## Type hints (a preview — full treatment in Module 9)

\`\`\`python
def area(width: float, height: float) -> float:
    return width * height

def greet(name: str, times: int = 1) -> None:
    for _ in range(times):
        print(f"hi {name}")
\`\`\`

Hints are optional, not enforced at runtime, but Django/DRF codebases increasingly use them and tools like \`mypy\` check them. Add them as you learn; they document intent.`,

    contentHi: `## Define aur call karna

\`\`\`python
def area(width, height):
    """Rectangle ka area lautaao."""       # docstring: help(area) ise dikhaata hai
    return width * height

area(3, 4)              # 12  -- positional
area(width=3, height=4) # 12  -- keyword (order-independent)
area(3, height=4)       # 12  -- positional phir keyword
area(height=4, 3)       # SyntaxError -- positional keyword ke baad nahi aa sakta
\`\`\`

Bina \`return\` ke, ya ek nange \`return\` ke, ek function \`None\` lautaata hai. \`x = print("hi")\` \`x\` ko \`None\` set karta hai — \`print\` kuch nahi lautaata.

## Default arguments (aur wo ek jaal)

\`\`\`python
def connect(host, port=5432, timeout=30):
    ...

connect("db.example.com")               # port=5432, timeout=30
connect("db.example.com", timeout=5)    # port=5432, timeout=5   (keyword se skip)

# JAAL: ek mutable default EK BAAR banta hai, def time par, aur share hota hai:
def add_item(item, basket=[]):          # BUG
    basket.append(item)
    return basket

add_item("a")     # ['a']
add_item("b")     # ['a', 'b']   <-- WAHI list! ek naya nahi

# fix:
def add_item(item, basket=None):
    if basket is None:
        basket = []
    basket.append(item)
    return basket
\`\`\`

Ye mutable-default jaal Module 3 mein gehraai se cover hota hai; abhi ke liye: **kabhi \`[]\`, \`{}\`, ya \`set()\` ko ek default value ki tarah istemal mat karo — \`None\` istemal karo aur ise andar banao.**

## Multiple return values bas ek tuple hain

\`\`\`python
def divmod_(a, b):
    return a // b, a % b        # ek tuple (q, r) lautaata hai

q, r = divmod_(17, 5)          # unpacking: q=3, r=2
result = divmod_(17, 5)       # result = (3, 2)
\`\`\`

Koi "out parameter" nahi. Ek tuple lautaao, aur caller ise unpack karta hai (ya ek chhota object / dataclass agar kayi values hain).

## Jaldi \`return\`, aur implicit \`None\`

\`\`\`python
def find_user(users, user_id):
    for user in users:
        if user.id == user_id:
            return user        # mila -> turant return
    return None                # explicit end se girne se saaf hai

# end se girna bhi None lautaata hai, par kaho:
def validate(data):
    if not data:
        return                 # nanga return == return None
    ...
\`\`\`

## \`__name__\`: ye asal mein kya hai

\`\`\`python
# kisi bhi module mein, __name__ ek string hai:
#   "__main__"   agar ye file wo hai jo aapne chalaayi:  python report.py
#   "report"     agar ye file import hui thi:            import report
#   "pkg.report" agar ek package se import hui

print(f"running as {__name__}")

if __name__ == "__main__":
    # CLI entry point, quick self-test, ya ek demo
    main()
\`\`\`

Django ka \`manage.py\` bilkul yahi pattern hai — ye ek \`__main__\` guard waali script hai jo Django ki command machinery ko dispatch karti hai. Aapke apne management commands aur one-off scripts wahi shape follow karte hain.

## Type hints (ek preview — poora treatment Module 9 mein)

\`\`\`python
def area(width: float, height: float) -> float:
    return width * height

def greet(name: str, times: int = 1) -> None:
    for _ in range(times):
        print(f"hi {name}")
\`\`\`

Hints optional hain, runtime par laagu nahi, par Django/DRF codebases inhe zyaada istemal kar rahe hain aur \`mypy\` jaise tools inhe check karte hain. Inhe jodo jaise aap seekhte ho; wo intent document karte hain.`,

    examples: [
      {
        title: 'Broken: work at module level runs on import',
        titleHi: 'Toota: module level par kaam import par chalta hai',
        code: `# greetings.py
def greet(name):
    return f"Hello, {name}!"

print("Starting up...")
print(greet("World"))
print("Done.")

# --- another file that just wants greet() ---
# from greetings import greet
# ^ this prints "Starting up...", "Hello, World!", "Done." as a side effect`,
        output: `Starting up...
Hello, World!
Done.`,
        explain: 'Every line at the top level of `greetings.py` runs the moment the module is loaded — whether you ran it directly or imported it for `greet`. A test file, a script, or another module that imports `greet` gets these three prints (and any file I/O or API calls) unexpectedly.',
        explainHi: '`greetings.py` ke top level par har line module load hote hi chalti hai — chahe aapne ise seedhe chalaaya ya `greet` ke liye import kiya. Ek test file, ek script, ya ek doosra module jo `greet` import karta hai unhe ye teen prints (aur koi file I/O ya API calls) anpekshit roop se milte hain.',
      },
      {
        title: 'Fixed: main() behind the __name__ guard',
        titleHi: 'Theek: __name__ guard ke peechhe main()',
        code: `# greetings.py
def greet(name):
    return f"Hello, {name}!"

def main():
    print("Starting up...")
    print(greet("World"))
    print("Done.")

print(f"[module loaded as {__name__}]")

if __name__ == "__main__":
    main()`,
        output: `[module loaded as __main__]
Starting up...
Hello, World!
Done.`,
        explain: 'Run directly, `__name__` is `"__main__"`, so `main()` is called and you see the full output. If another file did `from greetings import greet`, `__name__` would be `"greetings"`, the guard would be False, and only the `def`s (and the `[module loaded as greetings]` line) would run — no side effects.',
        explainHi: 'Seedhe chalao, `__name__` `"__main__"` hai, isliye `main()` call hota hai aur aap poora output dekhte ho. Agar ek doosri file `from greetings import greet` karti, `__name__` `"greetings"` hota, guard False hota, aur sirf `def`s (aur `[module loaded as greetings]` line) chalte — koi side effects nahi.',
      },
      {
        title: 'Keyword args, defaults, and returning a tuple',
        titleHi: 'Keyword args, defaults, aur ek tuple lautaana',
        code: `def paginate(items, page=1, per_page=10):
    start = (page - 1) * per_page
    end = start + per_page
    window = items[start:end]
    has_next = end < len(items)
    return window, has_next

data = list(range(1, 26))            # 1..25

page1, more1 = paginate(data)
print(page1, more1)

page3, more3 = paginate(data, page=3)
print(page3, more3)

# per_page overridden by keyword, page left at default:
big, more = paginate(data, per_page=20)
print(big, more)`,
        output: `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10] True
[21, 22, 23, 24, 25] False
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] True`,
        explain: 'Defaults let callers omit `page` and `per_page`. Keyword arguments let a caller set `per_page` without also passing `page`. `return window, has_next` builds a tuple; `page1, more1 = paginate(...)` unpacks it. This is the shape of nearly every list endpoint.',
        explainHi: 'Defaults callers ko `page` aur `per_page` chhodne dete hain. Keyword arguments ek caller ko `per_page` set karne dete hain bina `page` bhi pass kiye. `return window, has_next` ek tuple banaata hai; `page1, more1 = paginate(...)` ise unpack karta hai. Ye lagbhag har list endpoint ka shape hai.',
      },
    ],

    mistakes: [
      {
        wrong: `def build_url(base, params={}):
    params["v"] = "2"
    return base + "?" + urlencode(params)`,
        right: `def build_url(base, params=None):
    params = dict(params or {})
    params["v"] = "2"
    return base + "?" + urlencode(params)`,
        why: 'A `{}` (or `[]`) default is evaluated once when the function is defined and reused across every call — so mutations leak between calls and callers who passed nothing get a dict that other calls have modified. Use `None` as the default and build a fresh container inside the function.',
        whyHi: 'Ek `{}` (ya `[]`) default function define hone par ek baar evaluate hota hai aur har call par reuse hota hai — isliye mutations calls ke beech leak karte hain aur jinhone kuch pass nahi kiya unhe ek dict milta hai jise doosre calls ne modify kiya. Default ki tarah `None` istemal karo aur function ke andar ek naya container banao.',
      },
      {
        wrong: `result = my_list.sort()
# result is None -- sort() mutates in place and returns None`,
        right: `my_list.sort()          # in-place, use my_list
# or
result = sorted(my_list)  # returns a new sorted list`,
        why: 'Many Python methods that mutate a container return `None` by design (`list.sort`, `list.append`, `dict.update`, `set.add`). Assigning their result gives you `None`. `sorted()` and `reversed()` are the return-a-new-thing versions; `.sort()` and `.reverse()` are the mutate-in-place versions.',
        whyHi: 'Kayi Python methods jo ek container mutate karte hain design se `None` lautaate hain (`list.sort`, `list.append`, `dict.update`, `set.add`). Unka result assign karna aapko `None` deta hai. `sorted()` aur `reversed()` return-a-new-thing versions hain; `.sort()` aur `.reverse()` mutate-in-place versions hain.',
      },
      {
        wrong: `# in a module imported by tests and by manage.py
DB = connect_to_database()      # runs on every import
run_migrations()`,
        right: `def get_db():
    return connect_to_database()

if __name__ == "__main__":
    run_migrations()`,
        why: 'Top-level code with side effects (opening connections, running migrations, hitting an API) executes every time the module is imported — including by your test suite and by tools. Wrap it in a function and, if it is an entry point, guard it with `if __name__ == "__main__":`.',
        whyHi: 'Side effects waala top-level code (connections kholna, migrations chalana, ek API hit karna) har baar module import hone par execute hota hai — aapke test suite aur tools dwara sameet. Ise ek function mein lapeto aur, agar ye ek entry point hai, ise `if __name__ == "__main__":` se guard karo.',
      },
    ],

    realWorld: [
      {
        en: '**`manage.py` in every Django project** is the `__main__` guard pattern — a thin script whose `if __name__ == "__main__":` block sets up settings and hands off to Django. Your custom scripts (`scripts/backfill.py`, data migrations) follow the same shape so they can also be imported for their functions.',
        hi: '**Har Django project mein `manage.py`** `__main__` guard pattern hai — ek patli script jiska `if __name__ == "__main__":` block settings set up karta hai aur Django ko handoff karta hai. Aapke custom scripts (`scripts/backfill.py`, data migrations) wahi shape follow karte hain taaki wo apne functions ke liye bhi import ho sakein.',
      },
      {
        en: '**DRF views and serializers are almost all functions and methods with keyword arguments and defaults** — `get_queryset(self)`, `create(self, validated_data)`, `paginate_queryset(self, queryset)`. Returning a tuple `(data, created)` from a `get_or_create`-style helper is a standard pattern.',
        hi: '**DRF views aur serializers lagbhag sab functions aur methods hain keyword arguments aur defaults ke saath** — `get_queryset(self)`, `create(self, validated_data)`, `paginate_queryset(self, queryset)`. Ek `get_or_create`-style helper se ek tuple `(data, created)` lautaana ek standard pattern hai.',
      },
      {
        en: '**The mutable-default bug is a real recurring Django issue** — a serializer field or a view with `def __init__(self, fields=[])` accumulates state across requests because the list is shared. Every Python linter flags it (`ruff` rule B006).',
        hi: '**Mutable-default bug ek asli dohraane waala Django issue hai** — ek serializer field ya ek view `def __init__(self, fields=[])` ke saath requests ke beech state jama karta hai kyunki list share hoti hai. Har Python linter ise flag karta hai (`ruff` rule B006).',
      },
    ],

    interviewQA: [
      {
        q: 'What does `if __name__ == "__main__":` do, and why is it important for a file that will be imported?',
        qHi: '`if __name__ == "__main__":` kya karta hai, aur ek aisi file ke liye kyun mahatvapurna hai jo import hogi?',
        a: 'Every Python module has a special variable called dunder name, and its value is a string. When you run a file directly, for example python report dot py, Python sets that file\'s dunder name to the literal string dunder main. When that same file is instead loaded by an import statement in another file, Python sets its dunder name to the module\'s own name, like report, or its dotted path if it is inside a package. So the expression dunder name equals-equals dunder main is a way for a file to ask at runtime, am I the program that was launched, or am I a library being imported by someone else. Why this matters is that importing a module executes every statement at its top level, in order, top to bottom. Function and class definitions at the top level are harmless — they just create names in the module\'s namespace. But any statement that actually does something — opening a file, connecting to a database, making an HTTP request, printing a report, running a pipeline — will execute as a side effect of the import. If your report file does its real work at the top level and another file imports it just to reuse one function, that other file, and your test suite, and any tool that imports the module, all trigger that work unexpectedly, often crashing because the environment is not set up for it. The convention is to put every top-level side effect inside a function, usually called main, and then at the very bottom of the file write if dunder name equals dunder main, colon, main, open-paren, close-paren. Now running the file directly calls main and does the work, while importing the file defines the functions and skips the guarded block entirely. Django\'s manage dot py is exactly this pattern.',
        aHi: 'Har Python module mein ek khaas variable hai jise dunder name kehte hain, aur iski value ek string hai. Jab aap ek file seedhe chalate ho, udaharan python report dot py, Python us file ke dunder name ko literal string dunder main set karta hai. Jab wahi file iske bajaye ek doosri file mein ek import statement se load hoti hai, Python iske dunder name ko module ke apne naam par set karta hai, jaise report. Toh expression dunder name equals-equals dunder main ek file ke liye runtime par poochhne ka tarika hai, kya main wo program hoon jo launch hua, ya main ek library hoon jise koi aur import kar raha hai. Ye kyun maayne rakhta hai ki ek module import karna iske top level par har statement execute karta hai, kram mein, upar se neeche. Top level par function aur class definitions harmless hain — wo bas naam banaate hain. Par koi bhi statement jo asal mein kuch karta hai — ek file kholna, ek database se connect karna, ek HTTP request karna, ek report print karna — import ke ek side effect ki tarah execute hoga. Convention har top-level side effect ko ek function ke andar rakhna hai, aam taur par main, aur phir file ke bilkul neeche if dunder name equals dunder main likhna.',
      },
      {
        q: 'What is the mutable default argument trap and how do you avoid it?',
        qHi: 'Mutable default argument trap kya hai aur aap ise kaise bachte ho?',
        a: 'When you write a function with a default value for a parameter, that default expression is evaluated exactly once, at the moment the def statement runs — which is when the module is first loaded — and the resulting object is stored on the function and reused for every call that does not supply that argument. If the default is an immutable value like a number, a string, or None, this is fine, because there is nothing you can do to change the shared object. But if the default is a mutable object like an empty list or an empty dictionary, every call that relies on the default gets the same object, and if the function body mutates it — appends to the list, assigns a key in the dict — that mutation persists into the next call. So a function like def add underscore item, item, basket equals empty-list, that appends item to basket and returns it, will return a one-element list the first time, a two-element list the second time, and so on, because it is the same list growing. Callers experience this as state mysteriously leaking between unrelated calls. In a web framework it is worse: a serializer or a view instantiated with a mutable default accumulates data across requests from different users. The fix is a standard idiom: make the default None, and inside the function check if the parameter is None and, if so, create a fresh container. So def add underscore item, item, basket equals None, then if basket is None, basket equals empty-list, then append and return. Now every call that omits the argument gets its own new list. Linters flag the mutable default automatically — the ruff and flake8 rule is B006 — and it is worth enabling that check on any Python project.',
        aHi: 'Jab aap ek parameter ke liye ek default value waala function likhte ho, wo default expression bilkul ek baar evaluate hota hai, us pal jab def statement chalta hai — jo tab hai jab module pehli baar load hota hai — aur nateeja object function par store hota hai aur har call ke liye reuse hota hai jo wo argument nahi deta. Agar default ek immutable value hai jaise ek number, ek string, ya None, ye theek hai, kyunki share kiye object ko badalne ke liye aap kuch nahi kar sakte. Par agar default ek mutable object hai jaise ek empty list ya ek empty dictionary, default par nirbhar har call ko wahi object milta hai, aur agar function body ise mutate karta hai — list mein append, dict mein ek key assign — wo mutation agli call mein bana rehta hai. Toh ek function jaise def add item, item, basket equals empty-list, jo item ko basket mein append karta hai aur ise lautaata hai, pehli baar ek one-element list lautaayega, doosri baar ek two-element list, aur aage. Fix ek standard idiom hai: default None banao, aur function ke andar check karo agar parameter None hai aur, agar haan, ek naya container banao.',
      },
    ],

    exercises: [
      {
        task: 'Create `mathutils.py` with `add(a, b)` and `multiply(a, b)`, plus a `main()` that prints a small demo, guarded by `if __name__ == "__main__":`. Run it directly (see the demo), then from a REPL do `import mathutils; mathutils.add(2, 3)` and confirm the demo does NOT print.',
        taskHi: '`mathutils.py` banao `add(a, b)` aur `multiply(a, b)` ke saath, plus ek `main()` jo ek chhota demo print kare, `if __name__ == "__main__":` se guarded. Ise seedhe chalao (demo dekho), phir ek REPL se `import mathutils; mathutils.add(2, 3)` karo aur confirm karo ki demo print NAHI hota.',
        hint: 'The `main()` body only runs when `__name__ == "__main__"`, which is true for `python mathutils.py` but false for `import mathutils`. Add `print(__name__)` at the top level to see the difference.',
        hintHi: '`main()` body sirf tab chalta hai jab `__name__ == "__main__"`, jo `python mathutils.py` ke liye true hai par `import mathutils` ke liye false. Antar dekhne ko top level par `print(__name__)` jodo.',
      },
      {
        task: 'Write `append_to(item, target=None)` that appends `item` to `target` (creating a new list if `target is None`) and returns it. Call it three times with no `target` and confirm each returns a fresh single-element list. Then write the buggy `target=[]` version and show it accumulates.',
        taskHi: '`append_to(item, target=None)` likho jo `item` ko `target` mein append kare (`target is None` hone par ek nayi list banaakar) aur ise lautaaye. Ise teen baar bina `target` ke call karo aur confirm karo ki har ek ek naya single-element list lautaata hai. Phir buggy `target=[]` version likho aur dikhao ki ye jama karta hai.',
        hint: 'Correct: `if target is None: target = []`. Buggy: `def append_to(item, target=[])` — the `[]` is created once at def time; the first call returns `["a"]`, the second `["a", "b"]`, etc.',
        hintHi: 'Sahi: `if target is None: target = []`. Buggy: `def append_to(item, target=[])` — `[]` def time par ek baar banta hai; pehla call `["a"]` lautaata hai, doosra `["a", "b"]`, etc.',
      },
      {
        task: 'Write `min_max(nums)` that returns both the minimum and maximum as a tuple in ONE pass (no calling `min()` and `max()` separately). Unpack the result: `lo, hi = min_max([3, 1, 4, 1, 5, 9, 2, 6])`. Handle the empty list by returning `(None, None)`.',
        taskHi: '`min_max(nums)` likho jo minimum aur maximum dono ko ek tuple ki tarah EK pass mein lautaata hai (`min()` aur `max()` alag call nahi karna). Result unpack karo: `lo, hi = min_max([3, 1, 4, 1, 5, 9, 2, 6])`. Empty list ko `(None, None)` lautaakar handle karo.',
        hint: '`if not nums: return None, None`. Then `lo = hi = nums[0]`, loop `for n in nums[1:]:` updating `lo` and `hi`. Return `lo, hi`. The caller writes `lo, hi = min_max(...)` to unpack.',
        hintHi: '`if not nums: return None, None`. Phir `lo = hi = nums[0]`, `for n in nums[1:]:` loop `lo` aur `hi` update karte hue. `lo, hi` return karo. Caller `lo, hi = min_max(...)` likhta hai unpack karne ko.',
      },
    ],

    keyTakeaways: [
      'A function with no `return` (or a bare `return`) returns `None`. `x = list.sort()` sets `x` to `None` — mutating methods return `None` by design; use `sorted()` for a new list.',
      'Positional args, then keyword args (`f(1, key=2)`). A keyword arg lets you skip earlier defaults: `connect(host, timeout=5)`.',
      'NEVER use a mutable default (`[]`, `{}`, `set()`) — it is created once at `def` time and shared across calls. Use `None` and create the container inside the function.',
      'Return multiple values as a tuple; the caller unpacks: `q, r = divmod_(a, b)`. There are no out-parameters.',
      'Importing a module runs EVERY top-level statement. `def`/`class`/constants are safe (they just make names); anything with side effects (I/O, prints, API calls) must go in a function.',
      '`__name__` is `"__main__"` when the file is run directly, and the module name when imported. `if __name__ == "__main__": main()` runs the entry point only on direct execution.',
      'Django\'s `manage.py`, your scripts, and one-off tools all use the `__main__` guard so they can double as importable modules.',
      'Type hints (`def f(x: int) -> str:`) are optional and not enforced at runtime, but modern Django/DRF code uses them and `mypy` checks them.',
    ],
    keyTakeawaysHi: [
      'Bina `return` (ya nange `return`) ke ek function `None` lautaata hai. `x = list.sort()` `x` ko `None` set karta hai — mutating methods design se `None` lautaate hain; ek nayi list ke liye `sorted()`.',
      'Positional args, phir keyword args (`f(1, key=2)`). Ek keyword arg aapko pehle ke defaults skip karne deta hai: `connect(host, timeout=5)`.',
      'KABHI ek mutable default (`[]`, `{}`, `set()`) istemal mat karo — ye `def` time par ek baar banta hai aur calls ke beech share hota hai. `None` istemal karo aur container function ke andar banao.',
      'Multiple values ek tuple ki tarah return karo; caller unpack karta hai: `q, r = divmod_(a, b)`. Koi out-parameters nahi.',
      'Ek module import karna HAR top-level statement chalaata hai. `def`/`class`/constants surakshit hain (wo bas naam banaate hain); side effects (I/O, prints, API calls) waala kuch bhi ek function mein jaana chahiye.',
      '`__name__` `"__main__"` hai jab file seedhe chale, aur import hone par module name. `if __name__ == "__main__": main()` entry point ko sirf direct execution par chalaata hai.',
      'Django ka `manage.py`, aapke scripts, aur one-off tools sab `__main__` guard istemal karte hain taaki wo importable modules ke roop mein bhi kaam kar sakein.',
      'Type hints (`def f(x: int) -> str:`) optional hain aur runtime par laagu nahi, par modern Django/DRF code inhe istemal karta hai aur `mypy` inhe check karta hai.',
    ],
  },
];
