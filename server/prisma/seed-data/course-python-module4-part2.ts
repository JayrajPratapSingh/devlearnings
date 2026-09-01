/**
 * Python Complete Course — Module 4: Objects & Classes, lessons 4-6.
 *
 * Lesson 4: inheritance, MRO, and `super()` — single inheritance and override,
 *           `super().__init__(...)`, multiple inheritance + the C3 MRO,
 *           cooperative `super()`, mixins, and "prefer composition".
 * Lesson 5: `@dataclass` — generated `__init__`/`__repr__`/`__eq__`,
 *           `field(default_factory=list)` (the mutable-default trap solved),
 *           `frozen=True`, `__post_init__`, `slots=True`; vs NamedTuple / dict.
 * Lesson 6: class design in practice — `@classmethod` alternative
 *           constructors, `__slots__`, class vs function vs module, ABCs and
 *           `typing.Protocol`, framing for Django models.
 *
 * NOTE for future editors: same rules as the rest of this course. Every
 * backtick inside simple/simpleHi/content/contentHi is `\`` (inline code inside
 * ``` blocks included). Escape `$` before `{` inside template literals as `\${`.
 * `examples` use `code` + `output`. Run every sample with `python`. Scan for
 * Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_4_PART2: CourseLesson[] = [
  {
    slug: 'py-inheritance-mro-and-super',
    title: 'Inheritance, MRO, and super()',
    titleHi: 'Inheritance, MRO, Aur super()',
    description: 'Subclassing a base class, adding your own `__init__`, and finding the base class\'s setup never ran — `self.name` does not exist — because defining `__init__` in the subclass completely replaces the parent\'s unless you explicitly call `super().__init__(...)`. And with multiple base classes, working out which method actually runs means understanding the method resolution order.',
    descriptionHi: 'Ek base class ko subclass karna, apna `__init__` jodna, aur paana ki base class ka setup kabhi nahi chala — `self.name` maujood nahi — kyunki subclass mein `__init__` define karna parent wale ko poori tarah badal deta hai jab tak aap spasht roop se `super().__init__(...)` call na karo. Aur kai base classes ke saath, ye pata karna ki kaunsa method asal mein chalta hai iska matlab method resolution order samajhna hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**Inheriting a family recipe and rewriting one step.** Your grandmother\'s bread recipe has ten steps. You want the same bread but with rosemary. If you write out "my recipe" as just the single line "add rosemary", you have not made bread — you have a bowl of rosemary, because your version *replaced* the recipe rather than extending it. What you actually mean is: do everything grandmother\'s recipe says, and also add rosemary. `super().__init__(...)` is the phrase "now do the parent\'s version of this step". You call it explicitly because Python will not assume you wanted the parent\'s setup — maybe you deliberately want to skip it. Now imagine the recipe was assembled from several source cookbooks, each contributing some steps, and two of them describe the "prove the dough" step differently. Someone has to decide the order in which the cookbooks are consulted, so that "prove the dough" resolves to exactly one method and every cookbook\'s step runs once. That fixed, computed ordering is the method resolution order, and `super()` walks it — it does not simply mean "my parent", it means "whoever is next in the resolution order from here".',
      hi: '**Ek family recipe inherit karna aur ek step rewrite karna.** Aapki daadi ki bread recipe mein das steps hain. Aap wahi bread chahte ho par rosemary ke saath. Agar aap "meri recipe" ko bas ek line "rosemary daalo" likhte ho, aapne bread nahi banaayi — aapke paas rosemary ka ek bowl hai, kyunki aapke version ne recipe ko extend karne ke bajaye *replace* kiya. Aapka asal matlab hai: jo daadi ki recipe kehti hai wo sab karo, aur rosemary bhi daalo. `super().__init__(...)` wo vaakya hai "ab is step ka parent ka version karo". Aap ise spasht roop se call karte ho kyunki Python ye nahi maanega ki aapko parent ka setup chahiye tha. Ab kalpana karo recipe kai source cookbooks se assemble ki gayi thi, aur do "dough prove karo" step ko alag tarike se bataate hain. Kisi ko wo order tay karna hai jismein cookbooks consult ki jaati hain. Wo fixed, computed ordering method resolution order hai, aur `super()` ise chalta hai — iska matlab bas "mera parent" nahi, balki "yahaan se resolution order mein jo bhi agla hai".',
    },

    simple: `**Start broken.** A subclass \`__init__\` that forgets the parent:

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name
        self.energy = 100

class Dog(Animal):
    def __init__(self, name, breed):
        self.breed = breed          # forgot to call Animal.__init__

d = Dog("Rex", "Lab")
print(d.breed)                      # Lab
print(d.name)                       # AttributeError: 'Dog' object has no attribute 'name'
\`\`\`

Defining \`__init__\` in \`Dog\` **replaces** \`Animal.__init__\` entirely. The parent's setup only runs if you call it.

**The fix: \`super().__init__(...)\`**

\`\`\`python
class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)      # run Animal.__init__ first
        self.breed = breed

d = Dog("Rex", "Lab")
print(d.name, d.energy, d.breed)   # Rex 100 Lab
\`\`\`

**Overriding a method but still using the parent's version**

\`\`\`python
class Animal:
    def describe(self):
        return f"{self.name}, energy {self.energy}"

class Dog(Animal):
    def describe(self):
        base = super().describe()   # call the parent's method
        return f"{base}, breed {self.breed}"
\`\`\`

\`\`\`
super() means "the next class in the MRO after the current one" -- NOT literally
"my parent". With single inheritance those are the same; with multiple they are not.

MRO = Method Resolution Order: the fixed, linear list of classes Python searches
      for an attribute/method. See it with  ClassName.__mro__  or  ClassName.mro().

RULES:
  - defining a method/__init__ in a subclass REPLACES the parent's;
    call super().<name>(...) to also run the parent's
  - super().__init__(...) with the arguments the PARENT expects
  - every cooperative __init__ in a multiple-inheritance chain should call super().__init__
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Ek subclass \`__init__\` jo parent bhool jaata hai:

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name
        self.energy = 100

class Dog(Animal):
    def __init__(self, name, breed):
        self.breed = breed          # Animal.__init__ call karna bhool gaye

d = Dog("Rex", "Lab")
print(d.breed)                      # Lab
print(d.name)                       # AttributeError: 'Dog' object has no attribute 'name'
\`\`\`

\`Dog\` mein \`__init__\` define karna \`Animal.__init__\` ko poori tarah **replace** karta hai. Parent ka setup sirf tab chalta hai jab aap ise call karte ho.

**Fix: \`super().__init__(...)\`**

\`\`\`python
class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)      # pehle Animal.__init__ chalao
        self.breed = breed

d = Dog("Rex", "Lab")
print(d.name, d.energy, d.breed)   # Rex 100 Lab
\`\`\`

**Ek method override karna par abhi bhi parent ka version istemal karna**

\`\`\`python
class Animal:
    def describe(self):
        return f"{self.name}, energy {self.energy}"

class Dog(Animal):
    def describe(self):
        base = super().describe()   # parent ka method call karo
        return f"{base}, breed {self.breed}"
\`\`\`

\`\`\`
super() ka matlab "current ke baad MRO mein agli class" -- literally "mera parent" NAHI.
Single inheritance ke saath wo samaan hain; multiple ke saath nahi.

MRO = Method Resolution Order: classes ki fixed, linear list jise Python ek
      attribute/method ke liye search karta hai. Ise dekho  ClassName.__mro__  se.

NIYAM:
  - ek subclass mein ek method/__init__ define karna parent wale ko REPLACE karta hai;
    parent wale ko bhi chalane ko super().<name>(...) call karo
  - super().__init__(...) un arguments ke saath jo PARENT chahta hai
  - ek multiple-inheritance chain mein har cooperative __init__ ko super().__init__ call karna chahiye
\`\`\``,

    content: `## \`super()\` and single inheritance

\`\`\`python
class Base:
    def __init__(self, a):
        self.a = a
    def greet(self):
        return f"Base({self.a})"

class Middle(Base):
    def __init__(self, a, b):
        super().__init__(a)          # -> Base.__init__
        self.b = b
    def greet(self):
        return super().greet() + f" + Middle({self.b})"

class Leaf(Middle):
    def __init__(self, a, b, c):
        super().__init__(a, b)       # -> Middle.__init__ -> Base.__init__
        self.c = c

Leaf(1, 2, 3).greet()   # 'Base(1) + Middle(2)'
Leaf.__mro__            # (Leaf, Middle, Base, object)
\`\`\`

Each \`super().__init__(...)\` passes the arguments the *next* class expects. The chain runs top-down as each level calls up.

## The MRO and multiple inheritance

\`\`\`python
class A:
    def who(self): return "A"
class B(A):
    def who(self): return "B"
class C(A):
    def who(self): return "C"
class D(B, C):
    pass

D().who()        # 'B'
D.__mro__        # (D, B, C, A, object)
\`\`\`

Python computes a single linear order (the **C3 linearization**) from the class graph. Rules it guarantees: a class comes before its parents; the order of base classes in the \`class D(B, C)\` declaration is respected; a class appears exactly once. \`D().who()\` finds \`who\` on \`B\` (first in the MRO after \`D\`). \`A\` is visited last, before \`object\` — this is the "diamond" case, and C3 ensures \`A\` runs once, not twice.

## Cooperative \`super()\` — every class calls up

\`\`\`python
class Loader:
    def __init__(self, **kw):
        super().__init__(**kw)       # pass leftover kwargs along the MRO
        self.loaded = True

class Validator:
    def __init__(self, *, strict=False, **kw):
        super().__init__(**kw)
        self.strict = strict

class Pipeline(Loader, Validator):
    def __init__(self, *, name, **kw):
        super().__init__(**kw)
        self.name = name

p = Pipeline(name="p1", strict=True)
# Pipeline.__init__ -> Loader.__init__ -> Validator.__init__ -> object.__init__
p.name, p.strict, p.loaded          # ('p1', True, True)
\`\`\`

For multiple inheritance to work, **every** \`__init__\` in the chain must call \`super().__init__\` and accept/forward \`**kwargs\`. If one class calls \`Base.__init__(self)\` directly instead of \`super()\`, it breaks the chain and some classes' \`__init__\` never runs.

## Mixins

\`\`\`python
class TimestampMixin:
    def touch(self):
        self.updated_at = now()

class SerializeMixin:
    def to_dict(self):
        return {k: v for k, v in vars(self).items() if not k.startswith("_")}

class Document(TimestampMixin, SerializeMixin):
    def __init__(self, title):
        self.title = title
\`\`\`

A mixin is a small class that adds one capability and is not useful on its own. It has no \`__init__\` (or a cooperative one), no state of its own, and is combined with a "real" base class. This is the idiomatic use of multiple inheritance in Python — Django's class-based views are built from mixins.

## Prefer composition when it is not an "is-a"

\`\`\`python
# inheritance: a Dog IS AN Animal -- fine
class Dog(Animal): ...

# composition: a Car HAS AN Engine -- do NOT write class Car(Engine)
class Car:
    def __init__(self):
        self.engine = Engine()
    def start(self):
        return self.engine.ignite()
\`\`\`

Inheritance couples the subclass to the base class's entire interface and internals. If the relationship is "uses a" or "has a" rather than "is a", hold the other object as an attribute and delegate. Deep inheritance trees are a common source of fragile code.`,

    contentHi: `## \`super()\` aur single inheritance

\`\`\`python
class Base:
    def __init__(self, a):
        self.a = a
    def greet(self):
        return f"Base({self.a})"

class Middle(Base):
    def __init__(self, a, b):
        super().__init__(a)          # -> Base.__init__
        self.b = b
    def greet(self):
        return super().greet() + f" + Middle({self.b})"

class Leaf(Middle):
    def __init__(self, a, b, c):
        super().__init__(a, b)       # -> Middle.__init__ -> Base.__init__
        self.c = c

Leaf(1, 2, 3).greet()   # 'Base(1) + Middle(2)'
Leaf.__mro__            # (Leaf, Middle, Base, object)
\`\`\`

Har \`super().__init__(...)\` un arguments ko pass karta hai jo *agli* class chahti hai. Chain top-down chalta hai jaise har level upar call karta hai.

## MRO aur multiple inheritance

\`\`\`python
class A:
    def who(self): return "A"
class B(A):
    def who(self): return "B"
class C(A):
    def who(self): return "C"
class D(B, C):
    pass

D().who()        # 'B'
D.__mro__        # (D, B, C, A, object)
\`\`\`

Python class graph se ek single linear order (**C3 linearization**) compute karta hai. Niyam jo ye guarantee karta hai: ek class apne parents se pehle aati hai; \`class D(B, C)\` declaration mein base classes ka order sammaan hota hai; ek class bilkul ek baar dikhti hai. \`D().who()\` \`who\` ko \`B\` par paata hai (\`D\` ke baad MRO mein pehla). \`A\` aakhri visit hota hai, \`object\` se pehle — ye "diamond" case hai, aur C3 sunishchit karta hai ki \`A\` ek baar chale, do baar nahi.

## Cooperative \`super()\` — har class upar call karti hai

\`\`\`python
class Loader:
    def __init__(self, **kw):
        super().__init__(**kw)       # bache hue kwargs MRO ke saath pass karo
        self.loaded = True

class Validator:
    def __init__(self, *, strict=False, **kw):
        super().__init__(**kw)
        self.strict = strict

class Pipeline(Loader, Validator):
    def __init__(self, *, name, **kw):
        super().__init__(**kw)
        self.name = name

p = Pipeline(name="p1", strict=True)
# Pipeline.__init__ -> Loader.__init__ -> Validator.__init__ -> object.__init__
p.name, p.strict, p.loaded          # ('p1', True, True)
\`\`\`

Multiple inheritance kaam karne ke liye, chain mein **har** \`__init__\` ko \`super().__init__\` call karna chahiye aur \`**kwargs\` accept/forward karna chahiye. Agar ek class \`super()\` ke bajaye seedhe \`Base.__init__(self)\` call karti hai, ye chain todti hai aur kuch classes ka \`__init__\` kabhi nahi chalta.

## Mixins

\`\`\`python
class TimestampMixin:
    def touch(self):
        self.updated_at = now()

class SerializeMixin:
    def to_dict(self):
        return {k: v for k, v in vars(self).items() if not k.startswith("_")}

class Document(TimestampMixin, SerializeMixin):
    def __init__(self, title):
        self.title = title
\`\`\`

Ek mixin ek chhoti class hai jo ek capability jodti hai aur apne aap mein upyogi nahi. Iska koi \`__init__\` nahi (ya ek cooperative), apna koi state nahi, aur ek "asli" base class ke saath combine hoti hai. Ye Python mein multiple inheritance ka idiomatic istemal hai — Django ke class-based views mixins se bane hain.

## "is-a" na ho to composition prefer karo

\`\`\`python
# inheritance: ek Dog EK Animal HAI -- theek
class Dog(Animal): ...

# composition: ek Car ke paas EK Engine HAI -- class Car(Engine) MAT likho
class Car:
    def __init__(self):
        self.engine = Engine()
    def start(self):
        return self.engine.ignite()
\`\`\`

Inheritance subclass ko base class ke poore interface aur internals se couple karta hai. Agar sambandh "uses a" ya "has a" hai "is a" ke bajaye, doosre object ko ek attribute ki tarah rakho aur delegate karo. Gehre inheritance trees fragile code ka ek aam source hain.`,

    examples: [
      {
        title: 'Broken vs fixed: subclass __init__ and super()',
        titleHi: 'Toota vs theek: subclass __init__ aur super()',
        code: `class Account:
    def __init__(self, owner):
        self.owner = owner
        self.balance = 0
        self.transactions = []

class SavingsAccount(Account):
    def __init__(self, owner, rate):
        # BROKEN version first:
        self.rate = rate

class CheckingAccount(Account):
    def __init__(self, owner, overdraft):
        super().__init__(owner)      # FIXED: run Account.__init__
        self.overdraft = overdraft

s = SavingsAccount("Ada", 0.05)
try:
    print(s.balance)
except AttributeError as e:
    print("broken:", e)

c = CheckingAccount("Bo", 500)
print("fixed:", c.owner, c.balance, c.overdraft, c.transactions)`,
        output: `broken: 'SavingsAccount' object has no attribute 'balance'
fixed: Bo 0 500 []`,
        explain: '`SavingsAccount.__init__` never calls `super().__init__`, so `Account.__init__` does not run and `balance`/`transactions` are never created — `s.balance` raises. `CheckingAccount.__init__` calls `super().__init__(owner)` first, so the account is fully set up before it adds its own `overdraft`.',
        explainHi: '`SavingsAccount.__init__` kabhi `super().__init__` call nahi karta, isliye `Account.__init__` nahi chalta aur `balance`/`transactions` kabhi nahi bante — `s.balance` raise karta hai. `CheckingAccount.__init__` pehle `super().__init__(owner)` call karta hai, isliye account poori tarah set up hai isse pehle ki ye apna `overdraft` jode.',
      },
      {
        title: 'The MRO in a diamond, and super() walking it',
        titleHi: 'Ek diamond mein MRO, aur super() ise chalna',
        code: `class Base:
    def __init__(self):
        print("  Base.__init__")
    def process(self):
        return "base"

class Left(Base):
    def __init__(self):
        print("  Left.__init__")
        super().__init__()
    def process(self):
        return "left -> " + super().process()

class Right(Base):
    def __init__(self):
        print("  Right.__init__")
        super().__init__()
    def process(self):
        return "right -> " + super().process()

class Combined(Left, Right):
    def __init__(self):
        print("  Combined.__init__")
        super().__init__()

print("MRO:", [c.__name__ for c in Combined.__mro__])
print("--- constructing ---")
c = Combined()
print("--- process ---")
print(c.process())`,
        output: `MRO: ['Combined', 'Left', 'Right', 'Base', 'object']
--- constructing ---
  Combined.__init__
  Left.__init__
  Right.__init__
  Base.__init__
--- process ---
left -> right -> base`,
        explain: 'The MRO is `Combined -> Left -> Right -> Base -> object`. Each `super()` call goes to the *next* class in that list, not to a literal parent — so `Left`\'s `super().__init__()` calls `Right.__init__`, not `Base.__init__`. Because every class cooperates (calls `super()`), `Base.__init__` runs exactly once even though it is reachable through two paths. `process()` chains the same way: `left -> right -> base`.',
        explainHi: 'MRO `Combined -> Left -> Right -> Base -> object` hai. Har `super()` call us list mein *agli* class par jaati hai, ek literal parent par nahi — isliye `Left` ka `super().__init__()` `Right.__init__` call karta hai, `Base.__init__` nahi. Kyunki har class cooperate karti hai (`super()` call karti hai), `Base.__init__` bilkul ek baar chalta hai haalaanki ye do raaston se reachable hai. `process()` usi tarah chain karta hai.',
      },
      {
        title: 'Mixins add capability without state; composition for "has-a"',
        titleHi: 'Mixins bina state ke capability jodte hain; "has-a" ke liye composition',
        code: `class ReprMixin:
    def __repr__(self):
        fields = ", ".join(f"{k}={v!r}" for k, v in vars(self).items())
        return f"{type(self).__name__}({fields})"

class CompareMixin:
    def __eq__(self, other):
        return type(self) == type(other) and vars(self) == vars(other)

class Point(ReprMixin, CompareMixin):
    def __init__(self, x, y):
        self.x, self.y = x, y

p1 = Point(1, 2)
p2 = Point(1, 2)
print(p1)                       # ReprMixin.__repr__
print(p1 == p2)                 # CompareMixin.__eq__

# composition -- a Logger HAS a list sink, it is not a list:
class ListSink:
    def __init__(self):
        self.lines = []
    def write(self, msg):
        self.lines.append(msg)

class Logger:
    def __init__(self, sink):
        self._sink = sink       # delegate, don't inherit
    def info(self, msg):
        self._sink.write(f"INFO: {msg}")

sink = ListSink()
log = Logger(sink)
log.info("started")
log.info("ready")
print(sink.lines)`,
        output: `Point(x=1, y=2)
True
['INFO: started', 'INFO: ready']`,
        explain: '`ReprMixin` and `CompareMixin` each add one method, hold no state, and have no `__init__` — `Point` mixes them in and gets `__repr__` and `__eq__` for free. `Logger` does not inherit from a sink; it holds one as `self._sink` and delegates `write` calls. "Is-a" -> inherit (or mix in); "has-a"/"uses-a" -> compose.',
        explainHi: '`ReprMixin` aur `CompareMixin` har ek ek method jodte hain, koi state nahi rakhte, aur koi `__init__` nahi — `Point` unhe mix karta hai aur `__repr__` aur `__eq__` muft paata hai. `Logger` ek sink se inherit nahi karta; ise `self._sink` ki tarah rakhta hai aur `write` calls delegate karta hai. "Is-a" -> inherit; "has-a"/"uses-a" -> compose.',
      },
    ],

    mistakes: [
      {
        wrong: `class Manager(Employee):
    def __init__(self, name, reports):
        self.name = name             # duplicates Employee's setup, misses the rest
        self.reports = reports`,
        right: `class Manager(Employee):
    def __init__(self, name, reports):
        super().__init__(name)       # run Employee.__init__
        self.reports = reports`,
        why: 'Re-implementing the parent\'s `__init__` body by hand duplicates logic and silently drops anything the parent does that you did not copy (other attributes, validation, side effects). Call `super().__init__(...)` with the arguments the parent expects, then add subclass-specific setup.',
        whyHi: 'Parent ke `__init__` body ko haath se dobara implement karna logic duplicate karta hai aur chupchaap wo sab chhodta hai jo parent karta hai jo aapne copy nahi kiya. `super().__init__(...)` un arguments ke saath call karo jo parent chahta hai, phir subclass-specific setup jodo.',
      },
      {
        wrong: `class C(A, B):
    def __init__(self):
        A.__init__(self)             # names A directly
        B.__init__(self)             # names B directly -- breaks in a diamond`,
        right: `class C(A, B):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)   # let the MRO chain both, once each`,
        why: 'Calling base `__init__`s by explicit name works for a simple case but breaks cooperative multiple inheritance: in a diamond, a shared grandparent gets initialised twice, and if `A` and `B` also use `super()` internally the ordering goes wrong. Use `super()` consistently in every class in the hierarchy.',
        whyHi: 'Base `__init__`s ko spasht naam se call karna ek saral case ke liye kaam karta hai par cooperative multiple inheritance todta hai: ek diamond mein, ek shared grandparent do baar initialise hota hai, aur agar `A` aur `B` bhi andar `super()` istemal karte hain to ordering galat ho jaati hai. Hierarchy mein har class mein `super()` lagaataar istemal karo.',
      },
      {
        wrong: `class JsonModel(dict):          # inheriting from dict to "get" dict behaviour
    def save(self): ...
# now every dict method is exposed, .update() bypasses your logic, etc.`,
        right: `class JsonModel:
    def __init__(self, data):
        self._data = dict(data)     # compose: hold a dict, expose only what you mean to
    def __getitem__(self, k):
        return self._data[k]
    def save(self): ...`,
        why: 'Subclassing built-in containers (`dict`, `list`) exposes their entire mutable interface, and many of their methods do not call `__setitem__`/`__getitem__`, so your overrides are silently bypassed. Compose instead: hold the container privately and expose a deliberate interface. (If you must subclass, use `collections.UserDict`/`UserList`.)',
        whyHi: 'Built-in containers (`dict`, `list`) ko subclass karna unka poora mutable interface expose karta hai, aur unke kai methods `__setitem__`/`__getitem__` call nahi karte, isliye aapke overrides chupchaap bypass hote hain. Iske bajaye compose karo: container ko private rakho aur ek jaan-boojhkar interface expose karo.',
      },
    ],

    realWorld: [
      {
        en: '**Django class-based views are pure MRO and mixins** — `class UserListView(LoginRequiredMixin, ListView)` works only because each mixin cooperatively calls `super()`. Getting the mixin order wrong (base view before the auth mixin) silently disables the auth check. `ClassName.__mro__` is a real debugging tool here.',
        hi: '**Django class-based views shuddh MRO aur mixins hain** — `class UserListView(LoginRequiredMixin, ListView)` sirf isliye kaam karta hai kyunki har mixin cooperatively `super()` call karta hai. Mixin order galat karna (auth mixin se pehle base view) chupchaap auth check disable karta hai.',
      },
      {
        en: '**`super().__init__(*args, **kwargs)` is in almost every custom Django model, form, serializer, and manager** — you override `__init__` or `save()` to add behaviour, and you must call `super()` or the framework\'s own setup does not run. Forgetting it is a classic "my field isn\'t saving" bug.',
        hi: '**`super().__init__(*args, **kwargs)` lagbhag har custom Django model, form, serializer, aur manager mein hai** — aap behaviour jodne ko `__init__` ya `save()` override karte ho, aur aapko `super()` call karna hoga warna framework ka apna setup nahi chalta. Ise bhoolna ek classic "mera field save nahi ho raha" bug hai.',
      },
      {
        en: '**"Prefer composition over inheritance" is the reason DRF uses `ViewSet` + `Serializer` + `Permission` as separate collaborating objects** rather than one deep class tree. When you find yourself with a 4-level inheritance chain, that is usually the signal to refactor to composition.',
        hi: '**"Inheritance par composition prefer karo" wajah hai ki DRF `ViewSet` + `Serializer` + `Permission` ko alag collaborating objects ki tarah istemal karta hai** ek gehre class tree ke bajaye. Jab aap khud ko ek 4-level inheritance chain ke saath paate ho, wo aam taur par composition mein refactor karne ka signal hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does `super()` actually do, and why is "call the parent class" an incomplete description?',
        qHi: '`super()` asal mein kya karta hai, aur "parent class call karo" ek adhoora vivaran kyun hai?',
        a: 'super gives you a proxy that dispatches method calls to the next class in the method resolution order, starting after the class where the super call textually appears, using the MRO of the actual object\'s type. With single inheritance the next class in the MRO is just the parent, so "call the parent" happens to be right, and that is where the mental shortcut comes from. But with multiple inheritance it is wrong. Consider a diamond: a class D inheriting from B and C, both of which inherit from A. The MRO of D is D, then B, then C, then A, then object. Inside B\'s method, super does not refer to A, which is B\'s declared base; it refers to whatever comes after B in D\'s MRO, which is C. So when you construct a D and B\'s init calls super dot init, it runs C\'s init, not A\'s. This is the whole point of the C3 linearization: it produces one ordering in which every class appears exactly once, subclasses come before their bases, and the left-to-right order of bases in each class statement is preserved. If every class in the hierarchy cooperatively calls super, each class\'s method runs exactly once, in MRO order, even the shared grandparent that is reachable by two paths. If instead a class hard-codes a call to a specific base by name, it bypasses the chain — the grandparent can run twice, or some sibling\'s method never runs at all. So the accurate description is: super means "the next thing in the resolution order from here", and the resolution order is a property of the object\'s class, computed once, not a simple parent pointer. Practically this means: use super consistently everywhere, never mix super with explicit base-class calls in the same hierarchy, and when init signatures differ across a multiple-inheritance chain, accept and forward keyword arguments so each class can pull out what it needs and pass the rest along.',
        aHi: 'super aapko ek proxy deta hai jo method calls ko method resolution order mein agli class par dispatch karta hai, us class ke baad se shuru karke jahaan super call likha hai, asal object ke type ke MRO ka istemal karke. Single inheritance ke saath MRO mein agli class bas parent hai, isliye "parent call karo" sahi hota hai. Par multiple inheritance ke saath ye galat hai. Ek diamond par vichaar karo: ek class D jo B aur C se inherit karti hai, dono A se inherit karti hain. D ka MRO D, phir B, phir C, phir A, phir object hai. B ke method ke andar, super A ko refer nahi karta, jo B ka declared base hai; ye us cheez ko refer karta hai jo D ke MRO mein B ke baad aati hai, jo C hai. Ye C3 linearization ka poora bindu hai. Agar hierarchy mein har class cooperatively super call karti hai, har class ka method bilkul ek baar chalta hai, MRO order mein. Agar iske bajaye ek class naam se ek specific base ka call hard-code karti hai, ye chain bypass karti hai. Toh sahi vivaran hai: super ka matlab "yahaan se resolution order mein agli cheez".',
      },
      {
        q: 'When is inheritance the right tool, and when should you prefer composition? What are mixins?',
        qHi: 'Inheritance kab sahi tool hai, aur aapko kab composition prefer karna chahiye? Mixins kya hain?',
        a: 'Inheritance models an "is-a" relationship and is appropriate when the subclass genuinely is a specialised kind of the base class and should be substitutable for it — a SavingsAccount is an Account, a StaffUser is a User. It gives you the base class\'s interface and implementation for free and lets you override selectively. The cost is tight coupling: the subclass depends on the base class\'s internals, and changes to the base ripple down. It also gets fragile fast when nested — a four- or five-level inheritance tree is hard to reason about because behaviour is scattered across levels and the MRO determines what actually runs. Composition models "has-a" or "uses-a": the object holds another object as an attribute and delegates to it. A Car has an Engine; you write self dot engine equals Engine and forward the calls you want to expose, rather than class Car inheriting Engine. Composition keeps the interface deliberate — you expose only the methods you choose — and lets you swap the collaborator, including for a fake in tests. The guidance "prefer composition over inheritance" means: default to composition, and reach for inheritance only when the is-a relationship is real and the hierarchy stays shallow. A mixin is a specific, disciplined use of multiple inheritance. It is a small class that provides one capability — a to_dict method, a timestamp helper, a repr — holds no instance state of its own, is not meant to be instantiated alone, and either has no init or a cooperative one. You combine one or more mixins with a real base class to compose behaviour: class Document, TimestampMixin, SerializeMixin. This is how Django\'s class-based views are built, and it works precisely because mixins are stateless and cooperative, so the MRO can thread them together cleanly.',
        aHi: 'Inheritance ek "is-a" sambandh model karta hai aur tab uchit hai jab subclass sachmuch base class ka ek visheshikृत prakaar hai aur iske liye substitutable hona chahiye — ek SavingsAccount ek Account hai. Ye aapko base class ka interface aur implementation muft deta hai aur aapko selectively override karne deta hai. Keemat tight coupling hai: subclass base class ke internals par nirbhar karta hai. Ye nested hone par jaldi fragile ho jaata hai. Composition "has-a" ya "uses-a" model karta hai: object ek doosre object ko ek attribute ki tarah rakhta hai aur ise delegate karta hai. Ek Car ke paas ek Engine hai; aap self dot engine equals Engine likhte ho. Composition interface ko jaan-boojhkar rakhta hai aur aapko collaborator swap karne deta hai, tests mein ek fake ke liye bhi. Ek mixin multiple inheritance ka ek vishesh, anushaasit istemal hai. Ye ek chhoti class hai jo ek capability deti hai, apna koi instance state nahi rakhti, akele instantiate karne ke liye nahi hai. Aap ek ya zyaada mixins ko ek asli base class ke saath combine karte ho.',
      },
    ],

    exercises: [
      {
        task: 'Write `Shape` with `__init__(self, name)` setting `self.name`, and a `describe()` returning `f"{self.name}"`. Write `Circle(Shape)` with `__init__(self, radius)` that calls `super().__init__("circle")` and stores `radius`, and overrides `describe()` to return `super().describe() + f", r={self.radius}"`. Verify both `name` and `radius` exist and `describe()` chains.',
        taskHi: '`Shape` likho `__init__(self, name)` ke saath jo `self.name` set kare, aur ek `describe()` jo `f"{self.name}"` return kare. `Circle(Shape)` likho `__init__(self, radius)` ke saath jo `super().__init__("circle")` call kare aur `radius` store kare, aur `describe()` override kare `super().describe() + f", r={self.radius}"` return karne ko. Verify karo `name` aur `radius` dono maujood hain aur `describe()` chain karta hai.',
        hint: 'Forgetting `super().__init__("circle")` means `self.name` never gets set and `super().describe()` raises `AttributeError`. The override pattern is `base = super().describe(); return base + extra`.',
        hintHi: '`super().__init__("circle")` bhoolna matlab `self.name` kabhi set nahi hota aur `super().describe()` `AttributeError` raise karta hai. Override pattern `base = super().describe(); return base + extra` hai.',
      },
      {
        task: 'Build a diamond: `A` with `def __init__(self): self.log = ["A"]`, `B(A)` and `C(A)` that each `super().__init__()` then `self.log.append("B"/"C")`, and `D(B, C)` that `super().__init__()` then appends `"D"`. Print `D().log` and `D.__mro__`. Explain the order.',
        taskHi: 'Ek diamond banao: `A` `def __init__(self): self.log = ["A"]` ke saath, `B(A)` aur `C(A)` jo har ek `super().__init__()` phir `self.log.append("B"/"C")` karein, aur `D(B, C)` jo `super().__init__()` phir `"D"` append kare. `D().log` aur `D.__mro__` print karo. Order samjhaao.',
        hint: 'MRO is `[D, B, C, A, object]`. `super().__init__()` calls run "up" the MRO, so `A` runs first (initialising `log`), then unwinds: the result is `["A", "C", "B", "D"]`. Every class\'s `__init__` runs exactly once.',
        hintHi: 'MRO `[D, B, C, A, object]` hai. `super().__init__()` calls MRO ke "upar" chalti hain, isliye `A` pehle chalta hai (`log` initialise karke), phir unwind: nateeja `["A", "C", "B", "D"]` hai. Har class ka `__init__` bilkul ek baar chalta hai.',
      },
      {
        task: 'Write a `JsonMixin` with a `to_json()` method (use `json.dumps(vars(self))`) and a `DictMixin` with `keys()` and `__getitem__`. Compose `class Config(JsonMixin, DictMixin)` with `__init__(self, **settings)` storing each in `self.__dict__`. Verify `to_json()`, `config["key"]`, and `list(config.keys())` all work — mixins added capability, no state.',
        taskHi: 'Ek `JsonMixin` likho ek `to_json()` method ke saath (`json.dumps(vars(self))` istemal karo) aur ek `DictMixin` `keys()` aur `__getitem__` ke saath. `class Config(JsonMixin, DictMixin)` compose karo `__init__(self, **settings)` ke saath jo har ek ko `self.__dict__` mein store kare. Verify karo `to_json()`, `config["key"]`, aur `list(config.keys())` sab kaam karte hain.',
        hint: '`__init__`: `self.__dict__.update(settings)`. `DictMixin.keys()`: `return vars(self).keys()`. `DictMixin.__getitem__`: `return vars(self)[k]`. Neither mixin has `__init__` or state — they just add methods `Config` picks up via the MRO.',
        hintHi: '`__init__`: `self.__dict__.update(settings)`. `DictMixin.keys()`: `return vars(self).keys()`. `DictMixin.__getitem__`: `return vars(self)[k]`. Kisi mixin mein `__init__` ya state nahi — wo bas methods jodte hain jo `Config` MRO ke zariye uthaata hai.',
      },
    ],

    keyTakeaways: [
      'Defining `__init__` (or any method) in a subclass REPLACES the parent\'s. To also run the parent\'s, call `super().__init__(...)` / `super().method(...)` explicitly.',
      'Call `super().__init__(...)` with the arguments the PARENT expects, then do subclass-specific setup after.',
      '`super()` means "the next class in the MRO after this one" — NOT literally "my parent". With single inheritance they coincide; with multiple inheritance they do not.',
      'The MRO (`ClassName.__mro__`) is a single linear order computed by C3 linearization: subclasses before bases, declared base order preserved, each class exactly once.',
      'For multiple inheritance / diamonds to work, EVERY `__init__` in the chain must call `super().__init__` and forward `**kwargs`. Mixing `super()` with explicit `Base.__init__(self)` calls breaks the chain.',
      'A mixin is a small, stateless class that adds one capability, has no (or a cooperative) `__init__`, and is combined with a real base class — the idiomatic use of multiple inheritance.',
      'Use inheritance for "is-a" and keep hierarchies shallow. For "has-a"/"uses-a", use composition: hold the other object as an attribute and delegate.',
      'Do not subclass built-in `dict`/`list` — their methods bypass your overrides. Compose, or use `collections.UserDict`/`UserList`.',
    ],
    keyTakeawaysHi: [
      'Ek subclass mein `__init__` (ya koi method) define karna parent wale ko REPLACE karta hai. Parent wale ko bhi chalane ko, `super().__init__(...)` / `super().method(...)` spasht roop se call karo.',
      '`super().__init__(...)` un arguments ke saath call karo jo PARENT chahta hai, phir subclass-specific setup baad mein karo.',
      '`super()` ka matlab "is ke baad MRO mein agli class" — literally "mera parent" NAHI. Single inheritance ke saath wo milte hain; multiple ke saath nahi.',
      'MRO (`ClassName.__mro__`) C3 linearization dwara computed ek single linear order hai: bases se pehle subclasses, declared base order sanrakshit, har class bilkul ek baar.',
      'Multiple inheritance / diamonds kaam karne ke liye, chain mein HAR `__init__` ko `super().__init__` call karna aur `**kwargs` forward karna chahiye. `super()` ko spasht `Base.__init__(self)` calls ke saath mix karna chain todta hai.',
      'Ek mixin ek chhoti, stateless class hai jo ek capability jodti hai, koi (ya ek cooperative) `__init__` nahi rakhti, aur ek asli base class ke saath combine hoti hai — multiple inheritance ka idiomatic istemal.',
      '"is-a" ke liye inheritance istemal karo aur hierarchies shallow rakho. "has-a"/"uses-a" ke liye, composition istemal karo: doosre object ko ek attribute ki tarah rakho aur delegate karo.',
      'Built-in `dict`/`list` ko subclass mat karo — unke methods aapke overrides bypass karte hain. Compose karo, ya `collections.UserDict`/`UserList` istemal karo.',
    ],
  },

  {
    slug: 'py-dataclasses',
    title: '@dataclass: Classes That Are Mostly Data',
    titleHi: '@dataclass: Classes Jo Zyaadatar Data Hain',
    description: 'Writing the same fifteen lines every time you make a small "bag of fields" class — an `__init__` that assigns `self.x = x` five times, a `__repr__` that lists them all, an `__eq__` that compares them all — and keeping those three in sync by hand as fields change. `@dataclass` generates all of it from the field declarations, and `field(default_factory=list)` finally makes a per-instance mutable default correct.',
    descriptionHi: 'Har baar jab aap ek chhoti "bag of fields" class banaate ho wahi pandrah lines likhna — ek `__init__` jo `self.x = x` paanch baar assign kare, ek `__repr__` jo sabko list kare, ek `__eq__` jo sabko compare kare — aur fields badalne par un teenon ko haath se sync mein rakhna. `@dataclass` field declarations se ye sab generate karta hai, aur `field(default_factory=list)` aakhirkaar ek per-instance mutable default ko sahi banaata hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A form template that fills in its own boilerplate.** Every time you design a new paper form — a shipping label, an intake sheet — you find yourself hand-writing the same supporting parts: a line that restates all the fields for a receipt, a rule for deciding when two filled-in forms count as identical, a way to bundle the values for filing. It is mechanical work, and worse, every time you add a field you have to remember to update all three supporting parts or they drift out of sync. `@dataclass` is a template system where you declare only the fields and their types, and it generates the receipt line, the sameness rule, and the bundling automatically, always consistent with the current field list. You can still override any generated part when you need custom behaviour, and you can mark the whole form "read-only once filled" so nobody can alter a submitted copy. The one piece it handles specially is a field whose default is a fresh empty container — you cannot write "default: empty list" directly, because that would be one shared list again; you write "default: make a new list each time", and the template does the right thing per form.',
      hi: '**Ek form template jo apna boilerplate khud bhar leta hai.** Har baar jab aap ek naya paper form design karte ho, aap khud ko wahi supporting parts haath se likhte paate ho: ek line jo ek receipt ke liye saare fields restate kare, ek niyam ye tay karne ka ki do bhare hue forms kab samaan gine jaayein, ek tarika values ko filing ke liye bundle karne ka. Ye mechanical kaam hai, aur bura, har baar jab aap ek field jodte ho aapko teenon supporting parts update karna yaad rakhna hota hai warna wo sync se bahar ho jaate hain. `@dataclass` ek template system hai jahaan aap sirf fields aur unke types declare karte ho, aur ye receipt line, sameness rule, aur bundling apne aap generate karta hai. Aap abhi bhi kisi generated part ko override kar sakte ho, aur poore form ko "bhare jaane ke baad read-only" mark kar sakte ho. Ek tukda jo ye vishesh roop se handle karta hai wo ek field hai jiska default ek fresh empty container hai — aap "default: empty list" seedhe nahi likh sakte; aap "default: har baar ek nayi list banao" likhte ho.',
    },

    simple: `**The boilerplate \`@dataclass\` removes:**

\`\`\`python
# by hand:
class Point:
    def __init__(self, x, y, label="origin"):
        self.x = x
        self.y = y
        self.label = label
    def __repr__(self):
        return f"Point(x={self.x!r}, y={self.y!r}, label={self.label!r})"
    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y, self.label) == (other.x, other.y, other.label)

# with @dataclass -- identical behaviour:
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float
    label: str = "origin"
\`\`\`

\`\`\`python
p = Point(1, 2)
print(p)                       # Point(x=1, y=2, label='origin')   <- generated __repr__
print(p == Point(1, 2))        # True                              <- generated __eq__
print(Point(1, 2, "A"))        # Point(x=1, y=2, label='A')
\`\`\`

**The mutable-default trap, finally solved cleanly**

\`\`\`python
from dataclasses import dataclass, field

@dataclass
class Cart:
    owner: str
    items: list = field(default_factory=list)   # a NEW list per instance
    meta: dict = field(default_factory=dict)

a = Cart("Ada")
b = Cart("Bo")
a.items.append("book")
print(a.items, b.items)        # ['book'] []   <- not shared
\`\`\`

\`\`\`
@dataclass generates, from the field declarations:
    __init__     (fields become parameters, in order; defaults supported)
    __repr__     Point(x=1, y=2, label='origin')
    __eq__       tuple-of-fields comparison

FIELD RULES:
    x: int                       required positional
    x: int = 0                   default (must come after all non-default fields)
    x: list = field(default_factory=list)   fresh mutable default per instance
    x: int = field(default=5, repr=False)   exclude from __repr__
    x: ClassVar[int] = 0         NOT a field -- a real class attribute

OPTIONS:  @dataclass(frozen=True)   immutable + hashable
          @dataclass(order=True)    also generates __lt__/__le__/__gt__/__ge__
          @dataclass(slots=True)    adds __slots__ (less memory, no new attrs)
          @dataclass(kw_only=True)  all fields keyword-only
\`\`\``,

    simpleHi: `**Boilerplate jo \`@dataclass\` hataata hai:**

\`\`\`python
# haath se:
class Point:
    def __init__(self, x, y, label="origin"):
        self.x = x
        self.y = y
        self.label = label
    def __repr__(self):
        return f"Point(x={self.x!r}, y={self.y!r}, label={self.label!r})"
    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y, self.label) == (other.x, other.y, other.label)

# @dataclass ke saath -- samaan behaviour:
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float
    label: str = "origin"
\`\`\`

\`\`\`python
p = Point(1, 2)
print(p)                       # Point(x=1, y=2, label='origin')   <- generated __repr__
print(p == Point(1, 2))        # True                              <- generated __eq__
print(Point(1, 2, "A"))        # Point(x=1, y=2, label='A')
\`\`\`

**Mutable-default jaal, aakhirkaar saaf tarike se hal**

\`\`\`python
from dataclasses import dataclass, field

@dataclass
class Cart:
    owner: str
    items: list = field(default_factory=list)   # prati instance ek NAYI list
    meta: dict = field(default_factory=dict)

a = Cart("Ada")
b = Cart("Bo")
a.items.append("book")
print(a.items, b.items)        # ['book'] []   <- shared nahi
\`\`\`

\`\`\`
@dataclass field declarations se generate karta hai:
    __init__     (fields parameters ban jaate hain, kram mein; defaults supported)
    __repr__     Point(x=1, y=2, label='origin')
    __eq__       tuple-of-fields comparison

FIELD NIYAM:
    x: int                       required positional
    x: int = 0                   default (saare non-default fields ke baad aana chahiye)
    x: list = field(default_factory=list)   prati instance fresh mutable default
    x: int = field(default=5, repr=False)   __repr__ se exclude
    x: ClassVar[int] = 0         ek field NAHI -- ek asli class attribute

OPTIONS:  @dataclass(frozen=True)   immutable + hashable
          @dataclass(order=True)    __lt__/__le__/__gt__/__ge__ bhi generate karta hai
          @dataclass(slots=True)    __slots__ jodta hai (kam memory, koi naye attrs nahi)
          @dataclass(kw_only=True)  saare fields keyword-only
\`\`\``,

    content: `## What gets generated, and how to customise

\`\`\`python
from dataclasses import dataclass, field

@dataclass
class Product:
    name: str
    price_cents: int
    tags: list[str] = field(default_factory=list)
    _cache: dict = field(default_factory=dict, repr=False, compare=False)

# generated __init__ signature:
#   Product(name, price_cents, tags=<new list>, _cache=<new dict>)
# __repr__ excludes _cache (repr=False)
# __eq__ ignores _cache (compare=False)
\`\`\`

Per-field \`field(...)\` options: \`default\`, \`default_factory\`, \`repr=False\` (hide from repr), \`compare=False\` (exclude from \`__eq__\`/ordering), \`kw_only=True\`, \`init=False\` (not a constructor parameter — set it in \`__post_init__\`).

## \`__post_init__\` for validation and derived fields

\`\`\`python
@dataclass
class Rectangle:
    width: float
    height: float
    area: float = field(init=False)      # computed, not passed in

    def __post_init__(self):
        if self.width <= 0 or self.height <= 0:
            raise ValueError("dimensions must be positive")
        self.area = self.width * self.height

Rectangle(3, 4).area     # 12
Rectangle(-1, 4)         # ValueError
\`\`\`

\`__post_init__\` runs at the end of the generated \`__init__\`. Use it for cross-field validation and for fields marked \`init=False\`.

## \`frozen=True\` — immutable value objects

\`\`\`python
@dataclass(frozen=True)
class Coordinate:
    lat: float
    lon: float

c = Coordinate(51.5, -0.1)
c.lat = 52          # dataclasses.FrozenInstanceError
hash(c)             # works -- frozen dataclasses are hashable (hash of the field tuple)
{c, Coordinate(51.5, -0.1)}   # one element -- value equality + hashable
\`\`\`

A frozen dataclass gets a \`__hash__\` (based on the fields) and blocks attribute assignment. This is the right shape for a value object used as a dict key or set member. A non-frozen dataclass with \`eq=True\` (the default) is **unhashable** — same rule as manual \`__eq__\` without \`__hash__\`.

## \`slots=True\` — smaller, stricter instances

\`\`\`python
@dataclass(slots=True)
class Node:
    value: int
    next: "Node | None" = None

n = Node(1)
n.nxt = None        # AttributeError: 'Node' object has no attribute 'nxt'  -- typo caught!
\`\`\`

\`slots=True\` (Python 3.10+) generates \`__slots__\`, which stores attributes in a fixed array instead of a per-instance dict: less memory, faster access, and typos raise instead of silently creating a new attribute. Trade-off: no \`__dict__\`, so no \`cached_property\` and no dynamic attributes.

## \`@dataclass\` vs the alternatives

\`\`\`
plain dict {"x": 1}       no type hints, no methods, no autocomplete, typos silent
NamedTuple                immutable, iterable/indexable, lightweight -- but IS a tuple
                          (x == (1, 2) is True; can be unintentionally compared to tuples)
@dataclass                mutable or frozen, methods, defaults, __post_init__, clearest intent
@dataclass(frozen=True)   the NamedTuple use case without being a tuple
TypedDict                 a dict with a typed shape -- for JSON-shaped data, no runtime class
pydantic BaseModel        dataclass + runtime validation + parsing/coercion (external dep)
\`\`\`

Default to \`@dataclass\` for internal "structured record" types. Reach for \`pydantic\` when the data crosses a boundary (API request/response, config file) and needs validation and coercion — which is exactly what DRF serializers and FastAPI models do.`,

    contentHi: `## Kya generate hota hai, aur kaise customise karein

\`\`\`python
from dataclasses import dataclass, field

@dataclass
class Product:
    name: str
    price_cents: int
    tags: list[str] = field(default_factory=list)
    _cache: dict = field(default_factory=dict, repr=False, compare=False)

# generated __init__ signature:
#   Product(name, price_cents, tags=<new list>, _cache=<new dict>)
# __repr__ _cache ko exclude karta hai (repr=False)
# __eq__ _cache ko ignore karta hai (compare=False)
\`\`\`

Per-field \`field(...)\` options: \`default\`, \`default_factory\`, \`repr=False\` (repr se chhupaao), \`compare=False\` (\`__eq__\`/ordering se exclude), \`kw_only=True\`, \`init=False\` (ek constructor parameter nahi — ise \`__post_init__\` mein set karo).

## Validation aur derived fields ke liye \`__post_init__\`

\`\`\`python
@dataclass
class Rectangle:
    width: float
    height: float
    area: float = field(init=False)      # computed, pass nahi hota

    def __post_init__(self):
        if self.width <= 0 or self.height <= 0:
            raise ValueError("dimensions must be positive")
        self.area = self.width * self.height

Rectangle(3, 4).area     # 12
Rectangle(-1, 4)         # ValueError
\`\`\`

\`__post_init__\` generated \`__init__\` ke ant mein chalta hai. Ise cross-field validation aur \`init=False\` marked fields ke liye istemal karo.

## \`frozen=True\` — immutable value objects

\`\`\`python
@dataclass(frozen=True)
class Coordinate:
    lat: float
    lon: float

c = Coordinate(51.5, -0.1)
c.lat = 52          # dataclasses.FrozenInstanceError
hash(c)             # kaam karta hai -- frozen dataclasses hashable hain (field tuple ka hash)
{c, Coordinate(51.5, -0.1)}   # ek element -- value equality + hashable
\`\`\`

Ek frozen dataclass ko ek \`__hash__\` milta hai (fields par aadhaarit) aur attribute assignment block karta hai. Ye ek value object ke liye sahi aakaar hai jo ek dict key ya set member ki tarah istemal hota hai. \`eq=True\` (default) waala ek non-frozen dataclass **unhashable** hai — wahi niyam jaisa \`__hash__\` ke bina manual \`__eq__\`.

## \`slots=True\` — chhote, strict instances

\`\`\`python
@dataclass(slots=True)
class Node:
    value: int
    next: "Node | None" = None

n = Node(1)
n.nxt = None        # AttributeError: 'Node' object has no attribute 'nxt'  -- typo pakda gaya!
\`\`\`

\`slots=True\` (Python 3.10+) \`__slots__\` generate karta hai, jo attributes ko ek per-instance dict ke bajaye ek fixed array mein store karta hai: kam memory, tez access, aur typos chupchaap ek naya attribute banaane ke bajaye raise karte hain. Trade-off: koi \`__dict__\` nahi, isliye koi \`cached_property\` nahi aur koi dynamic attributes nahi.

## \`@dataclass\` vs vikalp

\`\`\`
plain dict {"x": 1}       koi type hints nahi, koi methods nahi, typos silent
NamedTuple                immutable, iterable/indexable, lightweight -- par ek tuple HAI
                          (x == (1, 2) True hai; anjaane mein tuples se compare ho sakta hai)
@dataclass                mutable ya frozen, methods, defaults, __post_init__, sabse saaf intent
@dataclass(frozen=True)   NamedTuple use case bina ek tuple hue
TypedDict                 ek typed shape waala dict -- JSON-shaped data ke liye, koi runtime class nahi
pydantic BaseModel        dataclass + runtime validation + parsing/coercion (external dep)
\`\`\`

Internal "structured record" types ke liye \`@dataclass\` ko default karo. \`pydantic\` ke liye pahuncho jab data ek boundary paar karta hai (API request/response, config file) aur validation aur coercion chahiye — jo bilkul wahi hai jo DRF serializers aur FastAPI models karte hain.`,

    examples: [
      {
        title: 'Generated __init__, __repr__, __eq__ from field declarations',
        titleHi: 'Field declarations se generated __init__, __repr__, __eq__',
        code: `from dataclasses import dataclass

@dataclass
class Book:
    title: str
    author: str
    year: int
    in_stock: bool = True

b1 = Book("Dune", "Herbert", 1965)
b2 = Book("Dune", "Herbert", 1965)
b3 = Book("Dune", "Herbert", 1965, in_stock=False)

print(b1)                       # generated __repr__
print(b1 == b2)                 # generated __eq__ -- field-by-field
print(b1 == b3)                 # differs in in_stock
print(b1.year, b1.in_stock)

# it is a normal class -- add methods freely:
@dataclass
class Money:
    cents: int
    def __str__(self):
        return f"USD {self.cents / 100:.2f}"
    def add(self, other):
        return Money(self.cents + other.cents)

print(Money(500).add(Money(250)))
print(str(Money(1099)))`,
        output: `Book(title='Dune', author='Herbert', year=1965, in_stock=True)
True
False
1965 True
USD 7.50
USD 10.99`,
        explain: '`@dataclass` reads the annotated class-body names as fields and generates `__init__(self, title, author, year, in_stock=True)`, a `__repr__` listing all fields, and an `__eq__` comparing the field tuple. `b1 == b2` is `True` (all fields equal) and `b1 == b3` is `False`. It is still an ordinary class — `Money` adds `__str__` and `add()` normally.',
        explainHi: '`@dataclass` annotated class-body names ko fields ki tarah padhta hai aur `__init__(self, title, author, year, in_stock=True)`, saare fields list karta ek `__repr__`, aur field tuple compare karta ek `__eq__` generate karta hai. `b1 == b2` `True` hai aur `b1 == b3` `False`. Ye abhi bhi ek saamaanya class hai — `Money` `__str__` aur `add()` saamaanya roop se jodta hai.',
      },
      {
        title: 'default_factory, frozen, and hashability',
        titleHi: 'default_factory, frozen, aur hashability',
        code: `from dataclasses import dataclass, field

@dataclass
class Team:
    name: str
    members: list = field(default_factory=list)

t1 = Team("A")
t2 = Team("B")
t1.members.append("Ada")
print("t1:", t1.members, " t2:", t2.members)   # not shared

# non-frozen dataclass with __eq__ -> unhashable
try:
    {t1}
except TypeError as e:
    print("mutable dataclass in set:", "unhashable" in str(e))

@dataclass(frozen=True)
class Version:
    major: int
    minor: int

v1 = Version(1, 2)
v2 = Version(1, 2)
print("equal:", v1 == v2)
print("hashable:", hash(v1) == hash(v2))
print("dedup:", len({v1, v2}))
try:
    v1.major = 9
except Exception as e:
    print("frozen blocks write:", type(e).__name__)`,
        output: `t1: ['Ada']  t2: []
mutable dataclass in set: True
equal: True
hashable: True
dedup: 1
frozen blocks write: FrozenInstanceError`,
        explain: '`field(default_factory=list)` gives each `Team` its own `members` list — the mutable-default trap solved. A normal `@dataclass` generates `__eq__` but no `__hash__`, so it is unhashable (same rule as a hand-written `__eq__`). `@dataclass(frozen=True)` blocks writes AND generates a field-based `__hash__`, making `Version` a proper value object for sets and dict keys.',
        explainHi: '`field(default_factory=list)` har `Team` ko apni `members` list deta hai — mutable-default jaal hal. Ek saamaanya `@dataclass` `__eq__` generate karta hai par koi `__hash__` nahi, isliye ye unhashable hai. `@dataclass(frozen=True)` writes block karta hai AUR ek field-based `__hash__` generate karta hai, `Version` ko sets aur dict keys ke liye ek uchit value object banaate hue.',
      },
      {
        title: '__post_init__, init=False, and order=True',
        titleHi: '__post_init__, init=False, aur order=True',
        code: `from dataclasses import dataclass, field

@dataclass(order=True)
class Employee:
    sort_key: float = field(init=False, repr=False)
    name: str
    salary: int
    department: str = "general"

    def __post_init__(self):
        if self.salary < 0:
            raise ValueError("salary cannot be negative")
        self.sort_key = self.salary

e1 = Employee("Ada", 90000, "eng")
e2 = Employee("Bo", 75000)
e3 = Employee("Cal", 90000, "sales")

print(e1)
print("e2 < e1:", e2 < e1)                 # by sort_key (salary)
print("sorted:", [e.name for e in sorted([e1, e2, e3])])

try:
    Employee("Dee", -5)
except ValueError as ex:
    print("rejected:", ex)`,
        output: `Employee(name='Ada', salary=90000, department='eng')
e2 < e1: True
sorted: ['Bo', 'Ada', 'Cal']
rejected: salary cannot be negative`,
        explain: '`sort_key` has `init=False` so it is not a constructor argument; `__post_init__` computes it (and validates `salary`). `order=True` generates comparison operators that compare the field tuple in declaration order — `sort_key` is declared first, so ordering is effectively by salary. `sorted` puts Bo (75000) before Ada and Cal (both 90000).',
        explainHi: '`sort_key` mein `init=False` hai isliye ye ek constructor argument nahi; `__post_init__` ise compute karta hai (aur `salary` validate karta hai). `order=True` comparison operators generate karta hai jo field tuple ko declaration order mein compare karte hain — `sort_key` pehle declare hai, isliye ordering asal mein salary se hai. `sorted` Bo (75000) ko Ada aur Cal (dono 90000) se pehle rakhta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `@dataclass
class Config:
    hosts: list = []            # ValueError at class definition time`,
        right: `@dataclass
class Config:
    hosts: list = field(default_factory=list)`,
        why: 'Since Python 3.11 a mutable default literal in a dataclass field raises `ValueError` at class-definition time (earlier versions had the silent-shared-list bug). Use `field(default_factory=list)` (or `dict`, `set`, or any zero-arg callable) so each instance gets a fresh container.',
        whyHi: 'Python 3.11 se ek dataclass field mein ek mutable default literal class-definition time par `ValueError` raise karta hai (pehle ke versions mein silent-shared-list bug tha). `field(default_factory=list)` istemal karo taaki har instance ko ek fresh container mile.',
      },
      {
        wrong: `@dataclass
class Point:
    label: str = "origin"
    x: int                      # TypeError: non-default argument 'x' follows default argument`,
        right: `@dataclass
class Point:
    x: int
    y: int
    label: str = "origin"       # all defaults come last
# or force keyword-only:
@dataclass(kw_only=True)
class Point:
    label: str = "origin"
    x: int`,
        why: 'The generated `__init__` is a normal function signature, so fields with defaults must come after fields without — just like regular parameters. Reorder so required fields are first, or use `@dataclass(kw_only=True)` (or `field(kw_only=True)` per field) to lift the ordering restriction.',
        whyHi: 'Generated `__init__` ek saamaanya function signature hai, isliye defaults waale fields bina defaults waale fields ke baad aane chahiye — regular parameters ki tarah. Reorder karo taaki required fields pehle hon, ya `@dataclass(kw_only=True)` istemal karo.',
      },
      {
        wrong: `@dataclass
class CacheEntry:
    key: str
    value: object
# then used as a dict key: {entry: timestamp}  -> TypeError: unhashable`,
        right: `@dataclass(frozen=True)
class CacheEntry:
    key: str
    value: object
# frozen -> hashable; now usable as a dict key / set member`,
        why: 'A plain `@dataclass` generates `__eq__`, which makes instances unhashable (Python sets `__hash__ = None`). To use a dataclass as a dict key or in a set, make it `frozen=True` — that generates a consistent `__hash__` and also prevents the fields from mutating out from under the hash.',
        whyHi: 'Ek plain `@dataclass` `__eq__` generate karta hai, jo instances ko unhashable banaata hai. Ek dataclass ko ek dict key ya ek set mein istemal karne ko, ise `frozen=True` banao — wo ek sangat `__hash__` generate karta hai aur fields ko hash ke neeche se mutate hone se rokta hai.',
      },
    ],

    realWorld: [
      {
        en: '**`@dataclass` is the default for internal structured types** — a parsed config, a row from an external API before it becomes a model, a DTO passed between service functions, the return type of a function that would otherwise return a 4-tuple. `frozen=True` for anything used as a cache key or event payload.',
        hi: '**`@dataclass` internal structured types ke liye default hai** — ek parsed config, ek external API se ek row jo ek model banne se pehle, service functions ke beech pass kiya ek DTO. `frozen=True` kisi bhi cheez ke liye jo ek cache key ya event payload ki tarah istemal hoti hai.',
      },
      {
        en: '**DRF serializers and Django forms are "dataclass + validation + coercion"** — they take raw input (usually a dict from JSON), validate field types and rules, and produce clean typed data. `pydantic` (and FastAPI) make that pattern explicit. Understanding `@dataclass` + `__post_init__` makes those libraries click.',
        hi: '**DRF serializers aur Django forms "dataclass + validation + coercion" hain** — wo raw input lete hain, field types aur rules validate karte hain, aur saaf typed data banaate hain. `pydantic` (aur FastAPI) us pattern ko spasht banaate hain. `@dataclass` + `__post_init__` samajhna un libraries ko samajhne mein madad karta hai.',
      },
      {
        en: '**`slots=True` matters when you create millions of small objects** — graph nodes, parsed tokens, simulation particles. It cuts per-instance memory substantially and turns attribute typos into errors. Django model instances do not use it (they need `__dict__` for the ORM), but your own value types can.',
        hi: '**`slots=True` maayne rakhta hai jab aap laakhon chhote objects banaate ho** — graph nodes, parsed tokens, simulation particles. Ye per-instance memory kaafi kaatta hai aur attribute typos ko errors mein badalta hai. Django model instances ise istemal nahi karte, par aapke apne value types kar sakte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What does `@dataclass` generate, and what problem does `field(default_factory=...)` solve?',
        qHi: '`@dataclass` kya generate karta hai, aur `field(default_factory=...)` kaunsi samasya hal karta hai?',
        a: 'The dataclass decorator inspects the class body for names with type annotations and treats each as a field, in the order written. From those fields it generates, by default, three methods. First, an init that takes the fields as parameters in declaration order, with any field defaults becoming parameter defaults, and assigns each to self. Second, a repr that renders the class name and every field as name equals value, which is what you want in logs and debuggers. Third, an eq that compares two instances by building a tuple of their fields and comparing those tuples, so two instances with equal fields are equal. There are options: order equals True additionally generates the four ordering methods, comparing the field tuple; frozen equals True makes instances immutable by blocking attribute assignment and also generates a hash based on the fields; slots equals True generates slots for lower memory and typo-catching; kw_only equals True makes all fields keyword-only in the generated init. You can still write your own methods, and you can override any generated one. field of default_factory solves the mutable default problem. You cannot write a field as items colon list equals empty-list, because that single list object would be created once, at class definition, and shared by every instance that used the default — the same trap as a mutable default argument to a function. In fact modern Python raises a ValueError if you try. Instead you write items colon list equals field of default_factory equals list, passing the list type itself, or any zero-argument callable. The generated init then calls that factory once per instance, producing a fresh empty list every time. default_factory is also how you get any computed or non-literal default: a new dict, a new instance of some class, a timestamp, a generated id.',
        aHi: 'dataclass decorator class body ko type annotations waale names ke liye inspect karta hai aur har ek ko ek field ki tarah maanta hai, likhe gaye kram mein. Un fields se ye, by default, teen methods generate karta hai. Pehla, ek init jo fields ko declaration order mein parameters ki tarah leta hai, kisi bhi field default ke parameter default bante hue, aur har ek ko self ko assign karta hai. Doosra, ek repr jo class naam aur har field ko name equals value ki tarah render karta hai. Teesra, ek eq jo do instances ko unke fields ka ek tuple banaakar aur un tuples ko compare karke compare karta hai. Options hain: order equals True chaar ordering methods generate karta hai; frozen equals True instances ko immutable banaata hai aur fields par aadhaarit ek hash generate karta hai; slots equals True slots generate karta hai. field of default_factory mutable default samasya hal karta hai. Aap ek field ko items colon list equals empty-list nahi likh sakte, kyunki wo single list object ek baar banega, class definition par, aur har instance dwara share hoga. Iske bajaye aap items colon list equals field of default_factory equals list likhte ho. Generated init phir us factory ko prati instance ek baar call karta hai.',
      },
      {
        q: 'When would you use a `@dataclass` vs a `NamedTuple` vs a plain dict vs pydantic?',
        qHi: 'Aap ek `@dataclass` vs ek `NamedTuple` vs ek plain dict vs pydantic kab istemal karoge?',
        a: 'A plain dict is fine for truly ad-hoc, short-lived data that does not leave a small scope, but it has no declared shape: no type hints, no attribute access, no autocomplete, and a misspelled key is a silent bug rather than an error. As soon as a structure is passed around or has an identity as a concept, it deserves a class. A NamedTuple gives you an immutable, lightweight record with named fields that is also a real tuple — indexable, iterable, unpackable. That tuple-ness is occasionally useful and occasionally a trap: a NamedTuple compares equal to a plain tuple with the same values, so it can be accidentally conflated with unrelated tuples, and every instance is iterable whether that makes sense or not. Use it for small fixed records where the tuple behaviour is genuinely wanted, such as coordinates or a function returning multiple values. A dataclass is the general default for a structured record. It can be mutable or frozen, it supports field defaults and default factories, post-init validation, per-field control over repr and comparison, slots, and keyword-only fields, and it is clearly a distinct type rather than a tuple. A frozen dataclass covers the NamedTuple use case — immutable, hashable, value equality — without being a tuple. pydantic\'s BaseModel is a dataclass-like structure plus runtime validation and type coercion: it checks that incoming values match the declared types, converts where sensible, for example a string to an int or an ISO string to a datetime, and raises structured errors otherwise. You reach for it, or for the frameworks built on the same idea like DRF serializers, precisely at boundaries — parsing an API request body, loading a config file, validating external input — where you cannot trust that the data already has the right shape. Inside your own code, where you constructed the object yourself, a dataclass is enough.',
        aHi: 'Ek plain dict sachmuch ad-hoc, alp-jeevi data ke liye theek hai jo ek chhote scope se nahi nikalta, par iska koi declared shape nahi hai: koi type hints nahi, koi attribute access nahi, aur ek galat spelled key ek silent bug hai. Jaise hi ek structure paas kiya jaata hai, ise ek class chahiye. Ek NamedTuple aapko ek immutable, lightweight record deta hai named fields ke saath jo ek asli tuple bhi hai — indexable, iterable. Wo tuple-pan kabhi-kabhi upyogi aur kabhi-kabhi ek jaal hai: ek NamedTuple samaan values waale ek plain tuple se barabar compare karta hai. Ise chhote fixed records ke liye istemal karo jahaan tuple behaviour sachmuch chahiye. Ek dataclass ek structured record ke liye saamaanya default hai. Ye mutable ya frozen ho sakta hai, field defaults aur default factories, post-init validation support karta hai. Ek frozen dataclass NamedTuple use case cover karta hai bina ek tuple hue. pydantic ka BaseModel ek dataclass-jaisa structure plus runtime validation aur type coercion hai. Aap iske liye boundaries par pahunchte ho — ek API request body parse karna, ek config file load karna.',
      },
    ],

    exercises: [
      {
        task: 'Convert this by-hand class to a `@dataclass`: a `User` with `id: int`, `name: str`, `email: str`, `roles: list[str]` (default empty), `active: bool = True`. Verify the generated `__init__`, `__repr__`, and `__eq__` behave, and that two `User`s with separate `roles` lists do not share.',
        taskHi: 'Is haath-se-bani class ko ek `@dataclass` mein convert karo: ek `User` `id: int`, `name: str`, `email: str`, `roles: list[str]` (default empty), `active: bool = True` ke saath. Verify karo generated `__init__`, `__repr__`, aur `__eq__` sahi vyavhaar karte hain, aur alag `roles` lists waale do `User` share nahi karte.',
        hint: '`roles: list[str] = field(default_factory=list)`. `active` must come after `roles` (both have defaults, `id`/`name`/`email` do not). Append to one user\'s `roles` and check the other\'s is still `[]`.',
        hintHi: '`roles: list[str] = field(default_factory=list)`. `active` `roles` ke baad aana chahiye. Ek user ke `roles` mein append karo aur check karo doosre ka abhi bhi `[]` hai.',
      },
      {
        task: 'Write a `frozen=True` dataclass `RGB` with `r`, `g`, `b` ints. Add a `__post_init__` that raises `ValueError` if any channel is outside 0-255. Add a `hex` property returning `#rrggbb`. Verify `RGB(255, 0, 128)` works, `RGB(300, 0, 0)` raises, `{RGB(1,2,3), RGB(1,2,3)}` has one element.',
        taskHi: 'Ek `frozen=True` dataclass `RGB` likho `r`, `g`, `b` ints ke saath. Ek `__post_init__` jodo jo `ValueError` raise kare agar koi channel 0-255 ke baahar hai. Ek `hex` property jodo jo `#rrggbb` return kare. Verify karo `RGB(255, 0, 128)` kaam karta hai, `RGB(300, 0, 0)` raise karta hai, `{RGB(1,2,3), RGB(1,2,3)}` mein ek element hai.',
        hint: 'On a frozen dataclass `__post_init__` cannot do `self.x = ...` normally, but validation-only (raising) is fine since it does not assign. `hex`: `f"#{self.r:02x}{self.g:02x}{self.b:02x}"`. Frozen makes it hashable, so the set dedupes.',
        hintHi: 'Ek frozen dataclass par `__post_init__` saamaanya roop se `self.x = ...` nahi kar sakta, par sirf-validation (raising) theek hai kyunki ye assign nahi karta. `hex`: `f"#{self.r:02x}{self.g:02x}{self.b:02x}"`. Frozen ise hashable banaata hai.',
      },
      {
        task: 'Write a `@dataclass(order=True)` `Task` with `priority: int`, `name: str = field(compare=False)`, `done: bool = field(default=False, compare=False)`. Create several tasks and `sorted()` them — confirm they order by `priority` only and that `name`/`done` are excluded from `__eq__` and `__repr__`-less where set.',
        taskHi: 'Ek `@dataclass(order=True)` `Task` likho `priority: int`, `name: str = field(compare=False)`, `done: bool = field(default=False, compare=False)` ke saath. Kai tasks banao aur unhe `sorted()` karo — confirm karo wo sirf `priority` se order karte hain aur `name`/`done` `__eq__` se excluded hain.',
        hint: 'With `compare=False` on `name` and `done`, `__eq__` and the ordering methods only look at `priority` — so `Task(1, "a") == Task(1, "b")` is `True` and sorting is purely by `priority`.',
        hintHi: '`name` aur `done` par `compare=False` ke saath, `__eq__` aur ordering methods sirf `priority` dekhte hain — isliye `Task(1, "a") == Task(1, "b")` `True` hai aur sorting shuddh roop se `priority` se hai.',
      },
    ],

    keyTakeaways: [
      '`@dataclass` generates `__init__`, `__repr__`, and `__eq__` from annotated class-body fields — no more hand-writing and hand-syncing that boilerplate.',
      'Fields with defaults must come after fields without (it is a real function signature) — or use `@dataclass(kw_only=True)`.',
      'NEVER `x: list = []` in a dataclass (raises `ValueError` in modern Python). Use `x: list = field(default_factory=list)` — a fresh container per instance.',
      '`field(...)` per-field options: `default_factory`, `repr=False`, `compare=False`, `kw_only=True`, `init=False` (set it in `__post_init__` instead).',
      '`__post_init__` runs at the end of the generated `__init__` — use it for cross-field validation and `init=False` computed fields.',
      '`@dataclass(frozen=True)` -> immutable + a generated field-based `__hash__` (usable as dict key / set member). A plain `@dataclass` is unhashable (it has `__eq__` but no `__hash__`).',
      '`@dataclass(order=True)` generates comparison operators from the field tuple (declaration order). `@dataclass(slots=True)` adds `__slots__`: less memory, typo-catching, but no `__dict__`/`cached_property`.',
      'Default to `@dataclass` for internal records; `frozen=True` for value objects; `pydantic`/DRF serializers at input boundaries where runtime validation and coercion are needed.',
    ],
    keyTakeawaysHi: [
      '`@dataclass` annotated class-body fields se `__init__`, `__repr__`, aur `__eq__` generate karta hai — us boilerplate ko haath se likhna aur sync karna khatam.',
      'Defaults waale fields bina defaults waale fields ke baad aane chahiye (ye ek asli function signature hai) — ya `@dataclass(kw_only=True)` istemal karo.',
      'KABHI ek dataclass mein `x: list = []` nahi (modern Python mein `ValueError` raise karta hai). `x: list = field(default_factory=list)` istemal karo — prati instance ek fresh container.',
      '`field(...)` per-field options: `default_factory`, `repr=False`, `compare=False`, `kw_only=True`, `init=False` (iske bajaye `__post_init__` mein set karo).',
      '`__post_init__` generated `__init__` ke ant mein chalta hai — ise cross-field validation aur `init=False` computed fields ke liye istemal karo.',
      '`@dataclass(frozen=True)` -> immutable + ek generated field-based `__hash__` (dict key / set member ki tarah istemal ho sakta). Ek plain `@dataclass` unhashable hai (ismein `__eq__` hai par `__hash__` nahi).',
      '`@dataclass(order=True)` field tuple se comparison operators generate karta hai (declaration order). `@dataclass(slots=True)` `__slots__` jodta hai: kam memory, typo-catching, par koi `__dict__`/`cached_property` nahi.',
      'Internal records ke liye `@dataclass` ko default karo; value objects ke liye `frozen=True`; input boundaries par `pydantic`/DRF serializers jahaan runtime validation aur coercion chahiye.',
    ],
  },

  {
    slug: 'py-class-design-in-practice',
    title: 'Class Design in Practice: classmethod, __slots__, ABCs, Protocols',
    titleHi: 'Vyavhaar Mein Class Design: classmethod, __slots__, ABCs, Protocols',
    description: 'Knowing how to write a class but not when to — turning a module of three related functions into a class with no state "for organisation", or writing an interface base class when duck typing was enough. This lesson covers `@classmethod` alternative constructors, `__slots__`, abstract base classes vs `typing.Protocol`, and the decision of class vs function vs module.',
    descriptionHi: 'Ek class likhna jaanna par kab nahi — teen sambandhit functions ke ek module ko bina state ke ek class mein badalna "organisation ke liye", ya ek interface base class likhna jab duck typing kaafi tha. Ye lesson `@classmethod` alternative constructors, `__slots__`, abstract base classes vs `typing.Protocol`, aur class vs function vs module ke nirnay ko cover karta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**Choosing between a labelled drawer, a single tool, and a workbench.** If you have one job that takes inputs and produces an output with nothing to remember between uses, that is a single tool — a function. If you have several related jobs that share no equipment, just a common theme, that is a labelled drawer holding those tools together — a module. You only build a workbench — a class — when the jobs share equipment that has to be set up once and kept in a particular state between uses: that persistent, configured state is what a class is *for*. Within workbench-building there are refinements. A `@classmethod` is an alternative way to assemble the workbench — "build me one already configured for metalwork" — versus the default assembly. `__slots__` is bolting the tool positions down: the workbench becomes lighter and you can no longer leave random tools lying anywhere, which catches the mistake of reaching for a tool that was never installed. An abstract base class or a Protocol is a spec sheet saying "any workbench used here must have a vice and a power outlet" — the difference being whether you hand every builder the same partly-built frame (ABC) or just publish the spec and trust builders to meet it (Protocol).',
      hi: '**Ek labelled drawer, ek single tool, aur ek workbench ke beech chunna.** Agar aapke paas ek kaam hai jo inputs leta hai aur ek output banaata hai bina istemal ke beech kuch yaad rakhne ke, wo ek single tool hai — ek function. Agar aapke paas kai sambandhit kaam hain jo koi equipment share nahi karte, bas ek common theme, wo un tools ko saath rakhne waala ek labelled drawer hai — ek module. Aap ek workbench — ek class — sirf tab banaate ho jab kaam aisा equipment share karte hain jise ek baar set up karke istemal ke beech ek khaas state mein rakhna hai: wo persistent, configured state hi hai jiske *liye* ek class hai. Ek `@classmethod` workbench assemble karne ka ek vaikalpik tarika hai. `__slots__` tool positions ko bolt karna hai. Ek abstract base class ya ek Protocol ek spec sheet hai — antar ye hai ki aap har builder ko wahi aadha-bana frame dete ho (ABC) ya bas spec publish karte ho (Protocol).',
    },

    simple: `**\`@classmethod\` — alternative constructors**

\`\`\`python
from datetime import date

class Event:
    def __init__(self, name, year, month, day):
        self.name = name
        self.date = date(year, month, day)

    @classmethod
    def from_iso(cls, name, iso_string):        # "2026-03-15"
        y, m, d = map(int, iso_string.split("-"))
        return cls(name, y, m, d)               # cls, not Event -> subclass-friendly

    @classmethod
    def today(cls, name):
        t = date.today()
        return cls(name, t.year, t.month, t.day)

e1 = Event("launch", 2026, 3, 15)
e2 = Event.from_iso("launch", "2026-03-15")     # same object, built differently
e3 = Event.today("standup")
\`\`\`

**When to use a class at all**

\`\`\`python
# NO class -- one job, no state to keep:
def slugify(text):
    return "-".join(text.lower().split())

# NO class -- related functions with no shared state -> a module (a .py file)
#   text_utils.py:  slugify(), truncate(), word_count()

# YES class -- state that is set up once and used across calls:
class RateLimiter:
    def __init__(self, max_per_minute):
        self.max = max_per_minute
        self._timestamps = []
    def allow(self):
        now = time.time()
        self._timestamps = [t for t in self._timestamps if now - t < 60]
        if len(self._timestamps) >= self.max:
            return False
        self._timestamps.append(now)
        return True
\`\`\`

\`\`\`
FUNCTION   one operation, output depends only on inputs, nothing to remember
MODULE     several related functions, no shared mutable state -- just a .py file
CLASS      state configured once and reused across method calls, OR
           several implementations of the same interface (polymorphism)

@classmethod    alternative constructor: takes cls, returns cls(...)
@staticmethod   a plain function namespaced in the class (no self, no cls)
__slots__       fix the attribute set: less memory, typos raise, no __dict__
ABC             base class with @abstractmethod -- subclass MUST implement, explicit
Protocol        structural typing -- "has these methods" -- no inheritance needed
\`\`\``,

    simpleHi: `**\`@classmethod\` — alternative constructors**

\`\`\`python
from datetime import date

class Event:
    def __init__(self, name, year, month, day):
        self.name = name
        self.date = date(year, month, day)

    @classmethod
    def from_iso(cls, name, iso_string):        # "2026-03-15"
        y, m, d = map(int, iso_string.split("-"))
        return cls(name, y, m, d)               # cls, Event nahi -> subclass-friendly

    @classmethod
    def today(cls, name):
        t = date.today()
        return cls(name, t.year, t.month, t.day)

e1 = Event("launch", 2026, 3, 15)
e2 = Event.from_iso("launch", "2026-03-15")     # wahi object, alag tarike se bana
e3 = Event.today("standup")
\`\`\`

**Ek class bilkul kab istemal karein**

\`\`\`python
# KOI class nahi -- ek kaam, koi state rakhne ko nahi:
def slugify(text):
    return "-".join(text.lower().split())

# KOI class nahi -- bina shared state ke sambandhit functions -> ek module (ek .py file)
#   text_utils.py:  slugify(), truncate(), word_count()

# HAAN class -- state jo ek baar set up aur calls ke beech istemal hoti hai:
class RateLimiter:
    def __init__(self, max_per_minute):
        self.max = max_per_minute
        self._timestamps = []
    def allow(self):
        now = time.time()
        self._timestamps = [t for t in self._timestamps if now - t < 60]
        if len(self._timestamps) >= self.max:
            return False
        self._timestamps.append(now)
        return True
\`\`\`

\`\`\`
FUNCTION   ek operation, output sirf inputs par nirbhar, kuch yaad rakhne ko nahi
MODULE     kai sambandhit functions, koi shared mutable state nahi -- bas ek .py file
CLASS      state ek baar configured aur method calls ke beech reused, YA
           usi interface ke kai implementations (polymorphism)

@classmethod    alternative constructor: cls leta hai, cls(...) return karta hai
@staticmethod   class mein namespaced ek plain function (koi self, koi cls nahi)
__slots__       attribute set fix karo: kam memory, typos raise, koi __dict__ nahi
ABC             @abstractmethod waali base class -- subclass ko IMPLEMENT karna HOGA, explicit
Protocol        structural typing -- "in methods ke saath" -- koi inheritance nahi chahiye
\`\`\``,

    content: `## \`@classmethod\` vs \`@staticmethod\`

\`\`\`python
class Temperature:
    def __init__(self, kelvin):
        self.kelvin = kelvin

    @classmethod
    def from_celsius(cls, c):
        return cls(c + 273.15)          # uses cls -> Temperature OR a subclass

    @classmethod
    def from_fahrenheit(cls, f):
        return cls((f - 32) * 5/9 + 273.15)

    @staticmethod
    def is_valid_kelvin(k):
        return k >= 0                   # no cls, no self -- just a related helper
\`\`\`

\`@classmethod\` receives the class as \`cls\` — use it for **alternative constructors** (\`from_x\`, \`parse\`, \`default\`) and anything that must respect subclassing. \`@staticmethod\` receives nothing — it is a plain function you have chosen to namespace inside the class because it is conceptually related. If a static method never touches the class at all, a module-level function is often clearer.

## \`__slots__\` — fix the attribute set

\`\`\`python
class Point:
    __slots__ = ("x", "y")             # these are the ONLY allowed attributes

    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(1, 2)
p.z = 3            # AttributeError: 'Point' object has no attribute 'z'
p.__dict__        # AttributeError -- there is no instance dict
\`\`\`

Benefits: significantly less memory per instance (no dict), faster attribute access, and typos raise instead of silently creating attributes. Costs: no dynamic attributes, no \`__dict__\`, no \`@cached_property\` (it needs a dict), and subclasses need their own \`__slots__\` to keep the benefit. Use it for classes instantiated in large numbers; skip it for the average class where flexibility matters more than bytes. \`@dataclass(slots=True)\` generates it.

## Abstract base classes

\`\`\`python
from abc import ABC, abstractmethod

class Storage(ABC):
    @abstractmethod
    def read(self, key): ...

    @abstractmethod
    def write(self, key, value): ...

    def read_or_default(self, key, default):    # concrete method, shared by all subclasses
        try:
            return self.read(key)
        except KeyError:
            return default

class MemoryStorage(Storage):
    def __init__(self):
        self._data = {}
    def read(self, key):
        return self._data[key]
    def write(self, key, value):
        self._data[key] = value

Storage()          # TypeError: Can't instantiate abstract class Storage
MemoryStorage()    # fine -- both abstract methods implemented
\`\`\`

An ABC cannot be instantiated, and a subclass that does not implement every \`@abstractmethod\` also cannot. Use it when you want to **enforce** an interface across a family of classes and share concrete helper methods.

## \`typing.Protocol\` — structural typing, no inheritance

\`\`\`python
from typing import Protocol

class Readable(Protocol):
    def read(self, key: str) -> str: ...

def load_config(source: Readable) -> dict:
    return parse(source.read("config"))

# ANY object with a matching read() method satisfies Readable --
# it does not need to inherit from anything.
class S3Source:
    def read(self, key): return fetch_from_s3(key)

load_config(S3Source())        # type-checks; no 'S3Source(Readable)' needed
\`\`\`

A \`Protocol\` describes a shape ("has a \`read(str) -> str\`"). Any class that structurally matches satisfies it — this is duck typing made checkable by type checkers. Prefer \`Protocol\` when you do not control the classes that need to fit the interface, or when inheritance would be artificial. Prefer ABC when you own the hierarchy and want shared code + hard enforcement at instantiation.

## Class vs function vs module — the decision

\`\`\`
Use a FUNCTION when:
  - it is one operation
  - the result depends only on the arguments (or clearly documented globals)
  - there is no state to carry between calls

Use a MODULE (just a .py file of functions) when:
  - you have several related functions
  - they share no mutable state -- grouping is for namespacing, not state

Use a CLASS when:
  - there is state set up once (config, a connection, a buffer) and used by several methods
  - OR you need several interchangeable implementations of one interface (polymorphism)
  - OR the object has identity and lifecycle (created, mutated, compared, destroyed)

A class with only @staticmethods and no state is a module wearing a costume -- use a module.
\`\`\``,

    contentHi: `## \`@classmethod\` vs \`@staticmethod\`

\`\`\`python
class Temperature:
    def __init__(self, kelvin):
        self.kelvin = kelvin

    @classmethod
    def from_celsius(cls, c):
        return cls(c + 273.15)          # cls istemal karta hai -> Temperature YA ek subclass

    @classmethod
    def from_fahrenheit(cls, f):
        return cls((f - 32) * 5/9 + 273.15)

    @staticmethod
    def is_valid_kelvin(k):
        return k >= 0                   # koi cls, koi self nahi -- bas ek sambandhit helper
\`\`\`

\`@classmethod\` class ko \`cls\` ki tarah paata hai — ise **alternative constructors** (\`from_x\`, \`parse\`, \`default\`) aur kisi bhi cheez ke liye istemal karo jo subclassing ka sammaan kare. \`@staticmethod\` kuch nahi paata — ye ek plain function hai jise aapne class ke andar namespace karne ka chunaav kiya. Agar ek static method class ko bilkul chhoota nahi, ek module-level function aksar saaf hota hai.

## \`__slots__\` — attribute set fix karo

\`\`\`python
class Point:
    __slots__ = ("x", "y")             # ye HI ekmatra allowed attributes hain

    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(1, 2)
p.z = 3            # AttributeError: 'Point' object has no attribute 'z'
p.__dict__        # AttributeError -- koi instance dict nahi
\`\`\`

Faayde: prati instance kaafi kam memory (koi dict nahi), tez attribute access, aur typos chupchaap attributes banaane ke bajaye raise karte hain. Keemat: koi dynamic attributes nahi, koi \`__dict__\` nahi, koi \`@cached_property\` nahi, aur subclasses ko faayda rakhne ko apna \`__slots__\` chahiye. Ise bade number mein instantiate ki gayi classes ke liye istemal karo. \`@dataclass(slots=True)\` ise generate karta hai.

## Abstract base classes

\`\`\`python
from abc import ABC, abstractmethod

class Storage(ABC):
    @abstractmethod
    def read(self, key): ...

    @abstractmethod
    def write(self, key, value): ...

    def read_or_default(self, key, default):    # concrete method, saare subclasses dwara shared
        try:
            return self.read(key)
        except KeyError:
            return default

class MemoryStorage(Storage):
    def __init__(self):
        self._data = {}
    def read(self, key):
        return self._data[key]
    def write(self, key, value):
        self._data[key] = value

Storage()          # TypeError: Can't instantiate abstract class Storage
MemoryStorage()    # theek -- dono abstract methods implemented
\`\`\`

Ek ABC instantiate nahi ho sakti, aur ek subclass jo har \`@abstractmethod\` implement nahi karti wo bhi nahi. Ise tab istemal karo jab aap ek family of classes mein ek interface **enforce** karna chahte ho aur concrete helper methods share karna chahte ho.

## \`typing.Protocol\` — structural typing, koi inheritance nahi

\`\`\`python
from typing import Protocol

class Readable(Protocol):
    def read(self, key: str) -> str: ...

def load_config(source: Readable) -> dict:
    return parse(source.read("config"))

# matching read() method waala KOI bhi object Readable satisfy karta hai --
# ise kisi se inherit karne ki zaroorat nahi.
class S3Source:
    def read(self, key): return fetch_from_s3(key)

load_config(S3Source())        # type-checks; koi 'S3Source(Readable)' nahi chahiye
\`\`\`

Ek \`Protocol\` ek shape describe karta hai ("ek \`read(str) -> str\` ke saath"). Koi bhi class jo structurally match karti hai ise satisfy karti hai — ye duck typing hai jise type checkers dwara checkable banaaya gaya. \`Protocol\` prefer karo jab aap un classes ko control nahi karte jinhe interface mein fit hona hai. ABC prefer karo jab aap hierarchy ke maalik ho aur shared code + instantiation par hard enforcement chahte ho.

## Class vs function vs module — nirnay

\`\`\`
FUNCTION istemal karo jab:
  - ye ek operation hai
  - result sirf arguments par nirbhar karta hai
  - calls ke beech le jaane ko koi state nahi

MODULE (bas functions ki ek .py file) istemal karo jab:
  - aapke paas kai sambandhit functions hain
  - wo koi mutable state share nahi karte -- grouping namespacing ke liye hai, state ke liye nahi

CLASS istemal karo jab:
  - state ek baar set up (config, ek connection, ek buffer) aur kai methods dwara istemal
  - YA aapko ek interface ke kai interchangeable implementations chahiye (polymorphism)
  - YA object ki identity aur lifecycle hai (banaya, mutate, compare, destroy)

sirf @staticmethods aur koi state waali ek class ek costume pehne module hai -- ek module istemal karo.
\`\`\``,

    examples: [
      {
        title: 'classmethod alternative constructors with cls (subclass-safe)',
        titleHi: 'cls ke saath classmethod alternative constructors (subclass-safe)',
        code: `class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __repr__(self):
        return f"{type(self).__name__}({self.x}, {self.y})"

    @classmethod
    def zero(cls):
        return cls(0, 0)

    @classmethod
    def from_tuple(cls, t):
        return cls(*t)

    @staticmethod
    def dot(a, b):
        return a.x * b.x + a.y * b.y

class Vector3ish(Vector):
    pass

print(Vector.zero())
print(Vector.from_tuple((3, 4)))
print(Vector3ish.zero())               # cls is Vector3ish -> correct subclass type
print(Vector3ish.from_tuple((1, 1)))
print(Vector.dot(Vector(1, 2), Vector(3, 4)))`,
        output: `Vector(0, 0)
Vector(3, 4)
Vector3ish(0, 0)
Vector3ish(1, 1)
11`,
        explain: '`zero` and `from_tuple` use `cls(...)` rather than `Vector(...)`, so when called as `Vector3ish.zero()` the `cls` is `Vector3ish` and you get the right subclass instance. Hard-coding `Vector(...)` would return the wrong type for subclasses. `dot` is a `@staticmethod` — it relates to vectors but needs neither instance nor class.',
        explainHi: '`zero` aur `from_tuple` `Vector(...)` ke bajaye `cls(...)` istemal karte hain, isliye jab `Vector3ish.zero()` ki tarah call hota hai `cls` `Vector3ish` hai aur aapko sahi subclass instance milta hai. `Vector(...)` hard-code karna subclasses ke liye galat type return karta. `dot` ek `@staticmethod` hai — ye vectors se sambandhit hai par ise na instance na class chahiye.',
      },
      {
        title: '__slots__: memory and typo-catching vs flexibility',
        titleHi: '__slots__: memory aur typo-catching vs flexibility',
        code: `class Loose:
    def __init__(self, x, y):
        self.x, self.y = x, y

class Tight:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x, self.y = x, y

a = Loose(1, 2)
b = Tight(1, 2)

print("Loose has __dict__:", hasattr(a, "__dict__"))
print("Tight has __dict__:", hasattr(b, "__dict__"))

a.typo = 99                    # silently accepted
print("Loose.typo:", a.typo)

try:
    b.typo = 99
except AttributeError as e:
    print("Tight rejects typo:", str(e).split("'")[-2] if "'" in str(e) else e)

print("Loose[0] carries a per-instance __dict__")
print("Tight[0] has no __dict__; x and y live in a fixed slot array")`,
        output: `Loose has __dict__: True
Tight has __dict__: False
Loose.typo: 99
Tight rejects typo: typo
Loose[0] carries a per-instance __dict__
Tight[0] has no __dict__; x and y live in a fixed slot array`,
        explain: '`Loose` stores attributes in a per-instance `__dict__`, so `a.typo = 99` silently works — a common source of bugs. `Tight` with `__slots__` has no `__dict__`; only `x` and `y` are allowed, and `b.typo = 99` raises `AttributeError`. Across many instances the missing dict is a real memory saving. The cost is losing dynamic attributes and `__dict__`-based features.',
        explainHi: '`Loose` attributes ko ek per-instance `__dict__` mein store karta hai, isliye `a.typo = 99` chupchaap kaam karta hai — bugs ka ek aam source. `__slots__` waala `Tight` mein koi `__dict__` nahi; sirf `x` aur `y` allowed hain, aur `b.typo = 99` `AttributeError` raise karta hai. Kai instances mein missing dict ek asli memory saving hai.',
      },
      {
        title: 'ABC (enforced) vs Protocol (structural)',
        titleHi: 'ABC (enforced) vs Protocol (structural)',
        code: `from abc import ABC, abstractmethod
from typing import Protocol

# --- ABC: must inherit and implement ---
class Notifier(ABC):
    @abstractmethod
    def send(self, msg): ...
    def send_all(self, msgs):           # shared concrete helper
        for m in msgs:
            self.send(m)

class EmailNotifier(Notifier):
    def send(self, msg):
        print(f"  email: {msg}")

try:
    Notifier()
except TypeError as e:
    print("ABC not instantiable:", "abstract" in str(e))

EmailNotifier().send_all(["hi", "bye"])

# --- Protocol: just match the shape, no inheritance ---
class Sink(Protocol):
    def write(self, text: str) -> None: ...

def dump(sink: Sink, lines):
    for ln in lines:
        sink.write(ln)

class ConsoleSink:               # does NOT inherit Sink
    def write(self, text):
        print(f"  console: {text}")

dump(ConsoleSink(), ["a", "b"])   # works -- structurally matches Sink`,
        output: `ABC not instantiable: True
  email: hi
  email: bye
  console: a
  console: b`,
        explain: '`Notifier` is an ABC: it cannot be instantiated, subclasses must implement `send`, and all subclasses inherit the concrete `send_all`. `Sink` is a `Protocol`: `ConsoleSink` satisfies it just by having a matching `write` method — no inheritance, no registration. Use ABC to own a hierarchy with shared code and enforcement; use Protocol to type-check duck-typed code you do not control.',
        explainHi: '`Notifier` ek ABC hai: ye instantiate nahi ho sakti, subclasses ko `send` implement karna hoga, aur saare subclasses concrete `send_all` inherit karte hain. `Sink` ek `Protocol` hai: `ConsoleSink` ise sirf ek matching `write` method rakhkar satisfy karta hai — koi inheritance nahi. ABC ka istemal shared code aur enforcement waali hierarchy ke maalik hone ke liye; Protocol ka istemal duck-typed code type-check karne ke liye jo aap control nahi karte.',
      },
    ],

    mistakes: [
      {
        wrong: `class StringUtils:
    @staticmethod
    def slugify(s): ...
    @staticmethod
    def truncate(s, n): ...
    @staticmethod
    def word_count(s): ...
# no state, no instances ever created`,
        right: `# string_utils.py
def slugify(s): ...
def truncate(s, n): ...
def word_count(s): ...
# import string_utils; string_utils.slugify(x)`,
        why: 'A class that only holds static methods and is never instantiated adds nothing over a module — you get the same namespacing from a `.py` file, without the misleading implication that there is an object with state. Reserve classes for things with state or polymorphism. This "utility class" habit comes from languages where everything must be in a class.',
        whyHi: 'Ek class jo sirf static methods rakhti hai aur kabhi instantiate nahi hoti ek module ke upar kuch nahi jodti — aapko wahi namespacing ek `.py` file se milta hai, bina is galat implication ke ki state waala ek object hai. Classes ko state ya polymorphism waali cheezon ke liye rakho.',
      },
      {
        wrong: `class Repo:
    @classmethod
    def create(cls, name):
        return Repo(name)          # hard-codes Repo -- wrong for subclasses`,
        right: `class Repo:
    @classmethod
    def create(cls, name):
        return cls(name)           # respects the actual class`,
        why: 'An alternative constructor should build `cls(...)`, not the hard-coded class name. If `GitRepo(Repo)` calls `GitRepo.create("x")`, `cls` is `GitRepo` and you want a `GitRepo` back — `return Repo(name)` would give a plain `Repo`, silently wrong.',
        whyHi: 'Ek alternative constructor ko `cls(...)` banaana chahiye, hard-coded class naam nahi. Agar `GitRepo(Repo)` `GitRepo.create("x")` call karta hai, `cls` `GitRepo` hai aur aap ek `GitRepo` wapas chahte ho — `return Repo(name)` ek plain `Repo` dega, chupchaap galat.',
      },
      {
        wrong: `class Animal(ABC):
    @abstractmethod
    def speak(self): ...

# used only for one concrete class, no shared code, no other implementations planned`,
        right: `class Dog:
    def speak(self):
        return "woof"
# no ABC needed -- there is one implementation and Python is duck-typed`,
        why: 'An ABC earns its keep when there are multiple implementations to keep consistent and/or shared concrete methods to inherit. For a single class, or when you just want "anything with a `speak()` method", the ABC is ceremony — duck typing (or a `Protocol` for type checking) is enough.',
        whyHi: 'Ek ABC apni jagah tab kamaati hai jab consistent rakhne ko kai implementations hain aur/ya inherit karne ko shared concrete methods hain. Ek akeli class ke liye, ya jab aap bas "ek `speak()` method waali koi bhi cheez" chahte ho, ABC ceremony hai — duck typing (ya type checking ke liye ek `Protocol`) kaafi hai.',
      },
    ],

    realWorld: [
      {
        en: '**`@classmethod` alternative constructors are everywhere in Django/DRF** — `User.objects.create_user(...)`, `Model.from_db(...)`, serializer `.to_internal_value()`, `datetime.fromisoformat()`, `Path.cwd()`. The `cls` (not the hard-coded class) is what makes them work with `CustomUser` subclasses.',
        hi: '**`@classmethod` alternative constructors Django/DRF mein har jagah hain** — `User.objects.create_user(...)`, `Model.from_db(...)`, `datetime.fromisoformat()`. `cls` (hard-coded class nahi) wo hai jo unhe `CustomUser` subclasses ke saath kaam karaata hai.',
      },
      {
        en: '**`typing.Protocol` is how modern Python types "any file-like object", "any object with a `.get()`"** without forcing third-party classes to inherit from your ABC. Django is gradually adding Protocol-based typing; DRF\'s renderer/parser/permission "interfaces" are effectively protocols enforced by convention.',
        hi: '**`typing.Protocol` aise modern Python "koi bhi file-like object", "ek `.get()` waala koi bhi object" type karta hai** bina third-party classes ko aapki ABC se inherit karne par majboor kiye. DRF ke renderer/parser/permission "interfaces" asal mein convention dwara enforce kiye protocols hain.',
      },
      {
        en: '**The "utility class" anti-pattern is common in codebases written by Java/C# developers moving to Python** — a `Helpers` or `Utils` class full of `@staticmethod`s. Reviewers flag it: move the functions to a module. Django\'s own utilities (`django.utils.text`, `django.utils.timezone`) are modules of functions, not classes.',
        hi: '**"utility class" anti-pattern Java/C# developers dwara likhe codebases mein aam hai** — `@staticmethod`s se bhari ek `Helpers` ya `Utils` class. Reviewers ise flag karte hain: functions ko ek module mein le jaao. Django ki apni utilities modules of functions hain, classes nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'When should something be a class, a function, or a module? What is wrong with a class of only static methods?',
        qHi: 'Kuch ek class, ek function, ya ek module kab hona chahiye? Sirf static methods waali ek class mein kya galat hai?',
        a: 'Use a function when you have a single operation whose result depends only on its inputs and there is nothing to remember between calls — a pure transformation, a calculation, a formatter. Most code is functions. Use a module, which is just a .py file containing several functions, when you have a group of related operations that share a topic but not any mutable state; the file gives you a namespace to import from, and that is all you need. Use a class in two situations. The first is when there is state that is configured once and then used across multiple method calls — a connection, a buffer, a configuration, an accumulator, a cache. The object bundles that state with the operations that act on it, and each instance carries its own. The second is polymorphism: you need several interchangeable implementations of the same interface, so callers can work against the interface and not care which concrete type they got. A class also makes sense when an object has a genuine lifecycle and identity — it is created, mutated, compared, passed around, destroyed. The anti-pattern is a class that contains only static methods and is never instantiated. It has no state, so the class body is doing nothing that a module would not do; you have taken a namespace and dressed it up as an object, which misleads readers into thinking there is instance state to reason about, and it adds a layer of indirection — Utils dot slugify instead of just slugify — for no benefit. This pattern almost always comes from languages like Java or C-sharp where every function must live inside a class. In Python the honest form is a module: put the functions at the top level of a .py file and import them. Reserve classes for state and polymorphism.',
        aHi: 'Ek function tab istemal karo jab aapke paas ek akela operation hai jiska result sirf iske inputs par nirbhar karta hai aur calls ke beech yaad rakhne ko kuch nahi. Adhikaansh code functions hai. Ek module istemal karo, jo bas kai functions waali ek .py file hai, jab aapke paas sambandhit operations ka ek samooh hai jo ek topic share karte hain par koi mutable state nahi. Ek class do sthitiyon mein istemal karo. Pehli jab state hai jo ek baar configured aur phir kai method calls mein istemal hoti hai — ek connection, ek buffer, ek cache. Doosri polymorphism hai: aapko usi interface ke kai interchangeable implementations chahiye. Anti-pattern ek class hai jismein sirf static methods hain aur jo kabhi instantiate nahi hoti. Iska koi state nahi, isliye class body kuch nahi kar rahi jo ek module nahi karega. Ye pattern lagbhag hamesha Java ya C-sharp jaisi bhaashaon se aata hai. Python mein imaandaar roop ek module hai.',
      },
      {
        q: 'What is the difference between an abstract base class and a `typing.Protocol`? When would you use each?',
        qHi: 'Ek abstract base class aur ek `typing.Protocol` mein kya antar hai? aap har ek kab istemal karoge?',
        a: 'Both express "this type must provide these methods", but they enforce it differently and suit different situations. An abstract base class, built with the abc module, uses nominal typing: a class only counts as a Storage if it explicitly inherits from Storage (or is registered with it). The ABC can declare abstract methods, and Python refuses to instantiate the ABC itself or any subclass that has not implemented all of them, so the check happens at object-creation time and is hard to bypass. An ABC can also contain concrete methods that all subclasses inherit, which is a major reason to use one — you get shared implementation plus enforced interface in one place. A Protocol, from the typing module, uses structural typing: any class that has methods with matching names and signatures satisfies the Protocol, whether or not it has ever heard of it. There is no inheritance and no runtime enforcement by default — the checking is done statically by a type checker like mypy or pyright. This is duck typing, made visible and checkable. You use an ABC when you own the class hierarchy, you want to share concrete helper code, and you want a hard failure at instantiation if someone forgets a method — internal plugin systems, a family of storage backends you maintain. You use a Protocol when you want to describe the shape a function needs without forcing callers to inherit from your class, especially when some of those callers are third-party types you cannot modify, or when inheritance would be an artificial relationship. A function that accepts "anything with a read method" should annotate a Protocol; a framework that defines "every backend must subclass BaseBackend and implement connect and disconnect" should use an ABC. They are also composable — you can have a Protocol for the external contract and an ABC for your own base implementation of it.',
        aHi: 'Dono "is type ko ye methods dene chahiye" express karte hain, par wo ise alag tarike se enforce karte hain. Ek abstract base class, abc module se, nominal typing istemal karta hai: ek class sirf tab ek Storage ginti hai agar ye spasht roop se Storage se inherit karti hai. ABC abstract methods declare kar sakti hai, aur Python ABC khud ko ya kisi bhi subclass ko jisne sabko implement nahi kiya instantiate karne se mana karta hai. Ek ABC mein concrete methods bhi ho sakte hain jo saare subclasses inherit karte hain. Ek Protocol, typing module se, structural typing istemal karta hai: matching names aur signatures waale methods rakhne waali koi bhi class Protocol ko satisfy karti hai. Koi inheritance nahi aur by default koi runtime enforcement nahi — checking statically ki jaati hai. Aap ek ABC tab istemal karte ho jab aap class hierarchy ke maalik ho, aap concrete helper code share karna chahte ho, aur aap instantiation par ek hard failure chahte ho. Aap ek Protocol tab istemal karte ho jab aap wo shape describe karna chahte ho jo ek function ko chahiye bina callers ko aapki class se inherit karne par majboor kiye.',
      },
    ],

    exercises: [
      {
        task: 'Write a `Duration` class storing `seconds`. Add `@classmethod` constructors `from_minutes(cls, m)`, `from_hours(cls, h)`, and `from_string(cls, "1h30m")`. All must use `cls(...)`. Subclass it as `PreciseDuration` and confirm `PreciseDuration.from_hours(2)` returns a `PreciseDuration`, not a `Duration`.',
        taskHi: 'Ek `Duration` class likho jo `seconds` store kare. `@classmethod` constructors `from_minutes(cls, m)`, `from_hours(cls, h)`, aur `from_string(cls, "1h30m")` jodo. Sabko `cls(...)` istemal karna hoga. Ise `PreciseDuration` ki tarah subclass karo aur confirm karo `PreciseDuration.from_hours(2)` ek `PreciseDuration` return karta hai, ek `Duration` nahi.',
        hint: 'Each classmethod computes total seconds and does `return cls(total)`. `type(PreciseDuration.from_hours(2))` should be `PreciseDuration`. If you wrote `return Duration(total)` it would be `Duration` — the bug this exercise demonstrates.',
        hintHi: 'Har classmethod total seconds compute karta hai aur `return cls(total)` karta hai. `type(PreciseDuration.from_hours(2))` `PreciseDuration` hona chahiye. Agar aapne `return Duration(total)` likha to ye `Duration` hoga.',
      },
      {
        task: 'Take a `Point3D` class with `x, y, z`. Make one version with `__slots__ = ("x", "y", "z")` and one without. Show: the slotted one raises on `p.w = 1`, has no `__dict__`, and (create 100k of each) uses less memory. State one feature you lose with `__slots__`.',
        taskHi: 'Ek `Point3D` class lo `x, y, z` ke saath. Ek version `__slots__ = ("x", "y", "z")` ke saath aur ek bina banao. Dikhao: slotted wala `p.w = 1` par raise karta hai, koi `__dict__` nahi, aur (har ek ke 100k banao) kam memory istemal karta hai. `__slots__` ke saath aap ek feature jo khote ho batao.',
        hint: 'Lost features: dynamic attributes, `__dict__`, `@functools.cached_property`, and easy multiple inheritance (each class in the MRO needs its own `__slots__`). Memory: compare `sys.getsizeof` or use `tracemalloc` on the two lists.',
        hintHi: 'Khoye features: dynamic attributes, `__dict__`, `@functools.cached_property`, aur aasaan multiple inheritance. Memory: `sys.getsizeof` compare karo ya do lists par `tracemalloc` istemal karo.',
      },
      {
        task: 'Define a `Serializer` ABC with `@abstractmethod serialize(self, obj)` and a concrete `serialize_many(self, objs)` that maps over `serialize`. Implement `JsonSerializer`. Separately, define a `Renderable` Protocol with `render(self) -> str` and a function `page(items: list[Renderable])`. Show a class that satisfies `Renderable` without inheriting it.',
        taskHi: 'Ek `Serializer` ABC define karo `@abstractmethod serialize(self, obj)` aur ek concrete `serialize_many(self, objs)` ke saath jo `serialize` par map kare. `JsonSerializer` implement karo. Alag se, ek `Renderable` Protocol `render(self) -> str` ke saath aur ek function `page(items: list[Renderable])` define karo. Ek class dikhao jo `Renderable` satisfy karti hai bina ise inherit kiye.',
        hint: 'ABC: `Serializer()` must raise; `JsonSerializer(Serializer)` implementing `serialize` can be instantiated and inherits `serialize_many`. Protocol: `class Button: def render(self): return "<button>"` matches `Renderable` structurally — `page([Button()])` type-checks with no inheritance.',
        hintHi: 'ABC: `Serializer()` raise karna chahiye; `serialize` implement karta `JsonSerializer(Serializer)` instantiate ho sakta hai aur `serialize_many` inherit karta hai. Protocol: `class Button: def render(self): return "<button>"` `Renderable` ko structurally match karta hai.',
      },
    ],

    keyTakeaways: [
      'FUNCTION: one operation, output depends only on inputs, no state to carry. MODULE (a `.py` of functions): related functions with no shared mutable state. CLASS: state configured once and reused across methods, OR polymorphism, OR objects with identity/lifecycle.',
      'A class with only `@staticmethod`s and no instances is a module in disguise — use a module. This "utility class" habit comes from Java/C#.',
      '`@classmethod` receives `cls` — use it for alternative constructors (`from_x`, `parse`, `today`). Always `return cls(...)`, never the hard-coded class name, so subclasses get the right type.',
      '`@staticmethod` receives neither `self` nor `cls` — a plain function namespaced in the class. If it never touches the class, a module function is clearer.',
      '`__slots__ = (...)` fixes the allowed attributes: less memory, faster access, typos raise. Costs: no `__dict__`, no dynamic attributes, no `cached_property`, subclasses need their own `__slots__`. Use for classes made in large numbers.',
      'An ABC (`abc.ABC` + `@abstractmethod`) uses nominal typing: subclasses must explicitly inherit and implement all abstract methods or they cannot be instantiated. It can also hold shared concrete methods.',
      '`typing.Protocol` uses structural typing: any class with matching methods satisfies it, no inheritance. Checked statically by type checkers — duck typing made checkable.',
      'Use an ABC when you own the hierarchy and want shared code + enforced instantiation. Use a Protocol when you do not control the implementing classes or inheritance would be artificial.',
    ],
    keyTakeawaysHi: [
      'FUNCTION: ek operation, output sirf inputs par nirbhar, koi state nahi. MODULE (functions ki ek `.py`): bina shared mutable state ke sambandhit functions. CLASS: state ek baar configured aur methods mein reused, YA polymorphism, YA identity/lifecycle waale objects.',
      'Sirf `@staticmethod`s aur koi instances nahi waali ek class bhes mein ek module hai — ek module istemal karo. Ye "utility class" aadat Java/C# se aati hai.',
      '`@classmethod` `cls` paata hai — ise alternative constructors (`from_x`, `parse`, `today`) ke liye istemal karo. Hamesha `return cls(...)`, kabhi hard-coded class naam nahi, taaki subclasses ko sahi type mile.',
      '`@staticmethod` na `self` na `cls` paata hai — class mein namespaced ek plain function. Agar ye class ko kabhi nahi chhoota, ek module function saaf hai.',
      '`__slots__ = (...)` allowed attributes fix karta hai: kam memory, tez access, typos raise. Keemat: koi `__dict__` nahi, koi dynamic attributes nahi, koi `cached_property` nahi, subclasses ko apna `__slots__` chahiye. Bade number mein bani classes ke liye istemal karo.',
      'Ek ABC (`abc.ABC` + `@abstractmethod`) nominal typing istemal karti hai: subclasses ko spasht roop se inherit aur saare abstract methods implement karne honge warna wo instantiate nahi ho sakte. Ye shared concrete methods bhi rakh sakti hai.',
      '`typing.Protocol` structural typing istemal karta hai: matching methods waali koi bhi class ise satisfy karti hai, koi inheritance nahi. Type checkers dwara statically checked — duck typing jise checkable banaaya gaya.',
      'Ek ABC tab istemal karo jab aap hierarchy ke maalik ho aur shared code + enforced instantiation chahte ho. Ek Protocol tab jab aap implementing classes ko control nahi karte ya inheritance artificial hoga.',
    ],
  },
];
