/**
 * Python Complete Course — Module 4: Objects & Classes, lessons 1-3.
 *
 * Lesson 1: classes, `__init__`, `self`, and instance vs class attributes —
 *           `self` is just the first positional parameter; `__init__` runs on
 *           an already-created object; a mutable value at class-body level is
 *           shared by every instance.
 * Lesson 2: dunder methods — `__repr__` vs `__str__`, the `__eq__`/`__hash__`
 *           pair rule, ordering via `@total_ordering`, `__len__`/`__bool__`/
 *           `__contains__`/`__getitem__`.
 * Lesson 3: `@property`, the `_name` / `__name` conventions, validation in a
 *           setter, and when NOT to wrap an attribute in a property.
 *
 * NOTE for future editors: same rules as the rest of this course. Every
 * backtick inside simple/simpleHi/content/contentHi is `\`` (inline code inside
 * ``` blocks included). `examples` use `code` + `output`. Run every sample with
 * `python`. Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_4: CourseLesson[] = [
  {
    slug: 'py-classes-init-self-and-attributes',
    title: 'Classes, __init__, self, and Instance vs Class Attributes',
    titleHi: 'Classes, __init__, self, Aur Instance vs Class Attributes',
    description: 'Writing `class Cart: items = []` because it reads like "every cart starts with an empty item list", then discovering that adding to one cart\'s items shows up in every other cart — because there is exactly one list, defined on the class, shared by all instances. Where you put an assignment — in the class body or inside `__init__` — decides whether every instance shares one value or each gets its own.',
    descriptionHi: '`class Cart: items = []` likhna kyunki ye "har cart ek empty item list se shuru hota hai" jaisa padhta hai, phir paana ki ek cart ke items mein jodna har doosre cart mein dikhta hai — kyunki bilkul ek list hai, class par define, sab instances dwara shared. Aap ek assignment kahaan rakhte ho — class body mein ya `__init__` ke andar — ye tay karta hai ki har instance ek value share karta hai ya har ek ko apni milti hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A class is a rubber stamp; an instance is one stamped page.** The stamp design is cut once. Whatever is engraved into the stamp itself — a fixed logo, a company name — appears identically on every page you stamp, and if you could somehow re-carve the stamp mid-run, every future page changes. But the blank lines on the stamped form, the ones a person fills in afterward with a pen, are different on every page. In a Python class, anything you write directly in the class body is engraved into the stamp: one value, shared by every instance, living on the class. Anything you assign through `self` inside `__init__` is a blank line filled in per page: each instance gets its own. The trap is a value that looks like a per-page blank but is engraved — `items = []` in the class body is one list on the stamp, and every instance that appends to it is writing on the shared engraving, not its own line. `__init__` is not the thing that makes the page; Python has already made a blank instance and handed it to `__init__` as `self` so `__init__` can fill in that instance\'s own lines.',
      hi: '**Ek class ek rubber stamp hai; ek instance ek stamped page hai.** Stamp design ek baar kaata jaata hai. Jo bhi stamp mein khud engrave hai — ek fixed logo, ek company name — har page par ek jaisa dikhta hai jo aap stamp karte ho. Par stamped form par khaali lines, jo ek vyakti baad mein pen se bharta hai, har page par alag hain. Ek Python class mein, jo bhi aap seedhe class body mein likhte ho wo stamp mein engrave hai: ek value, har instance dwara shared, class par rehti hai. Jo bhi aap `__init__` ke andar `self` ke zariye assign karte ho wo prati page bhari khaali line hai: har instance ko apni milti hai. Jaal ek aisi value hai jo prati-page blank jaisi dikhti hai par engraved hai — class body mein `items = []` stamp par ek list hai, aur har instance jo ismein append karta hai wo shared engraving par likh raha hai. `__init__` wo cheez nahi hai jo page banaati hai; Python ne pehle hi ek blank instance banaya aur ise `self` ki tarah `__init__` ko diya.',
    },

    simple: `**Start broken.** A mutable class attribute shared by every instance:

\`\`\`python
class Cart:
    items = []                    # ONE list, on the class, shared by all carts

    def add(self, product):
        self.items.append(product)

a = Cart()
b = Cart()
a.add("book")
print(b.items)                    # ['book']   <-- b never added anything!
print(a.items is b.items)         # True       <-- same list object
\`\`\`

**The fix: create per-instance state in \`__init__\`**

\`\`\`python
class Cart:
    def __init__(self):
        self.items = []           # a NEW list for each instance

    def add(self, product):
        self.items.append(product)

a = Cart()
b = Cart()
a.add("book")
print(b.items)                    # []
print(a.items is b.items)         # False
\`\`\`

**\`self\` is not magic — it is just the first parameter**

\`\`\`python
class Greeter:
    def __init__(self, name):     # 'self' is the new instance; 'name' is the argument
        self.name = name

    def hello(self):              # every method takes 'self' first
        return f"hi {self.name}"

g = Greeter("Sam")
print(g.hello())                  # hi Sam
print(Greeter.hello(g))           # hi Sam   -- exactly the same call
\`\`\`

\`\`\`
CLASS BODY assignment      -> ONE value, on the class, shared by all instances
  class C:
      LIMIT = 100              (fine: immutable, a real shared constant)
      cache = {}               (TRAP: every instance mutates the same dict)

__init__ / self assignment -> a SEPARATE value per instance
  def __init__(self):
      self.data = {}           (correct: each instance gets its own)

self          = the instance the method was called on (just the 1st parameter)
__init__      = runs AFTER the instance exists, to set it up (not a constructor)
C()           = create a blank instance, then call C.__init__(instance, ...)
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Ek mutable class attribute har instance dwara shared:

\`\`\`python
class Cart:
    items = []                    # EK list, class par, sab carts dwara shared

    def add(self, product):
        self.items.append(product)

a = Cart()
b = Cart()
a.add("book")
print(b.items)                    # ['book']   <-- b ne kabhi kuch nahi joda!
print(a.items is b.items)         # True       <-- wahi list object
\`\`\`

**Fix: \`__init__\` mein per-instance state banao**

\`\`\`python
class Cart:
    def __init__(self):
        self.items = []           # har instance ke liye ek NAYI list

    def add(self, product):
        self.items.append(product)

a = Cart()
b = Cart()
a.add("book")
print(b.items)                    # []
print(a.items is b.items)         # False
\`\`\`

**\`self\` magic nahi hai — ye bas pehla parameter hai**

\`\`\`python
class Greeter:
    def __init__(self, name):     # 'self' naya instance hai; 'name' argument hai
        self.name = name

    def hello(self):              # har method 'self' pehle leta hai
        return f"hi {self.name}"

g = Greeter("Sam")
print(g.hello())                  # hi Sam
print(Greeter.hello(g))           # hi Sam   -- bilkul wahi call
\`\`\`

\`\`\`
CLASS BODY assignment      -> EK value, class par, sab instances dwara shared
  class C:
      LIMIT = 100              (theek: immutable, ek asli shared constant)
      cache = {}               (JAAL: har instance usi dict ko mutate karta hai)

__init__ / self assignment -> prati instance ek ALAG value
  def __init__(self):
      self.data = {}           (sahi: har instance ko apni milti hai)

self          = wo instance jispar method call hua (bas 1st parameter)
__init__      = instance ke maujood hone ke BAAD chalta hai, ise set karne ko (constructor nahi)
C()           = ek blank instance banao, phir C.__init__(instance, ...) call karo
\`\`\``,

    content: `## How \`C()\` actually works

\`\`\`python
class Point:
    def __init__(self, x, y):
        print("  __init__ runs on an already-existing", self)
        self.x = x
        self.y = y

p = Point(3, 4)
# roughly:
#   p = Point.__new__(Point)      <- creates the blank instance
#   Point.__init__(p, 3, 4)       <- fills it in ('self' is p)
\`\`\`

\`__init__\` does not create or return the object — \`__new__\` does that, and you almost never write \`__new__\`. \`__init__\` receives the fresh instance as \`self\` and sets attributes on it. Returning anything other than \`None\` from \`__init__\` is a \`TypeError\`.

## Attribute lookup: instance first, then class

\`\`\`python
class Config:
    debug = False                 # class attribute (a default)

c = Config()
print(c.debug)                    # False  -- not found on instance, found on class
c.debug = True                    # creates an INSTANCE attribute, shadows the class one
print(c.debug)                    # True
print(Config.debug)               # False  -- the class attribute is untouched

d = Config()
print(d.debug)                    # False  -- d still sees the class default
\`\`\`

Reading \`c.x\` checks the instance \`__dict__\`, then the class (and its bases). Writing \`c.x = ...\` always creates/updates an instance attribute. This is why a class attribute works as a default — until an instance overrides it — and why \`self.count += 1\` on a class-level \`count = 0\` reads the class value but writes an instance value.

## The mutable class attribute trap, precisely

\`\`\`python
class Team:
    members = []                  # shared
    def add(self, name):
        self.members.append(name) # self.members finds the CLASS list; .append mutates it

# vs a legitimate shared constant:
class Circle:
    PI = 3.14159                  # fine -- immutable, genuinely shared, never reassigned
    def area(self, r):
        return Circle.PI * r * r
\`\`\`

Rule: class-body assignment is for constants and immutable defaults. Anything mutable that belongs to an instance goes in \`__init__\`.

## Class attributes that are intentionally shared (counters, registries)

\`\`\`python
class Widget:
    _count = 0                    # deliberately shared

    def __init__(self):
        Widget._count += 1        # note: Widget._count, not self._count, to rebind
        self.id = Widget._count

    @classmethod
    def how_many(cls):
        return cls._count
\`\`\`

Writing \`self._count += 1\` here would read the class value \`0\` and create an *instance* attribute \`_count = 1\`, leaving the class counter at 0 forever. To mutate shared class state you must name the class.

## \`__dict__\`, and dynamic attributes

\`\`\`python
p = Point(1, 2)
p.__dict__                        # {'x': 1, 'y': 2}
p.z = 99                          # Python lets you add attributes any time
p.__dict__                        # {'x': 1, 'y': 2, 'z': 99}
\`\`\`

Instances store their attributes in a plain dict by default. This flexibility is convenient and occasionally a bug source (a typo'd attribute name silently creates a new attribute instead of raising). \`__slots__\` (later lesson) turns it off.`,

    contentHi: `## \`C()\` asal mein kaise kaam karta hai

\`\`\`python
class Point:
    def __init__(self, x, y):
        print("  __init__ ek pehle-se-maujood par chalta hai", self)
        self.x = x
        self.y = y

p = Point(3, 4)
# lagbhag:
#   p = Point.__new__(Point)      <- blank instance banaata hai
#   Point.__init__(p, 3, 4)       <- ise bharta hai ('self' p hai)
\`\`\`

\`__init__\` object banaata ya return nahi karta — \`__new__\` wo karta hai, aur aap lagbhag kabhi \`__new__\` nahi likhte. \`__init__\` fresh instance ko \`self\` ki tarah paata hai aur uspar attributes set karta hai. \`__init__\` se \`None\` ke alawa kuch return karna ek \`TypeError\` hai.

## Attribute lookup: pehle instance, phir class

\`\`\`python
class Config:
    debug = False                 # class attribute (ek default)

c = Config()
print(c.debug)                    # False  -- instance par nahi mila, class par mila
c.debug = True                    # ek INSTANCE attribute banaata hai, class wale ko shadow karta hai
print(c.debug)                    # True
print(Config.debug)               # False  -- class attribute achhoota hai

d = Config()
print(d.debug)                    # False  -- d abhi bhi class default dekhta hai
\`\`\`

\`c.x\` padhna instance \`__dict__\` check karta hai, phir class (aur iske bases). \`c.x = ...\` likhna hamesha ek instance attribute banaata/update karta hai. Yahi wajah hai ki ek class attribute ek default ki tarah kaam karta hai — jab tak ek instance ise override na kare.

## Mutable class attribute jaal, thik-thik

\`\`\`python
class Team:
    members = []                  # shared
    def add(self, name):
        self.members.append(name) # self.members CLASS list paata hai; .append ise mutate karta hai

# vs ek jaayaz shared constant:
class Circle:
    PI = 3.14159                  # theek -- immutable, sachmuch shared, kabhi reassign nahi
    def area(self, r):
        return Circle.PI * r * r
\`\`\`

Niyam: class-body assignment constants aur immutable defaults ke liye hai. Koi bhi mutable cheez jo ek instance ki hai \`__init__\` mein jaati hai.

## Class attributes jo jaan-boojhkar shared hain (counters, registries)

\`\`\`python
class Widget:
    _count = 0                    # jaan-boojhkar shared

    def __init__(self):
        Widget._count += 1        # note: Widget._count, self._count nahi, rebind karne ko
        self.id = Widget._count

    @classmethod
    def how_many(cls):
        return cls._count
\`\`\`

Yahaan \`self._count += 1\` likhna class value \`0\` padhega aur ek *instance* attribute \`_count = 1\` banaayega, class counter ko hamesha 0 par chhodte hue. Shared class state mutate karne ko aapko class naam dena hoga.

## \`__dict__\`, aur dynamic attributes

\`\`\`python
p = Point(1, 2)
p.__dict__                        # {'x': 1, 'y': 2}
p.z = 99                          # Python aapko kabhi bhi attributes jodne deta hai
p.__dict__                        # {'x': 1, 'y': 2, 'z': 99}
\`\`\`

Instances apne attributes ek plain dict mein store karte hain by default. Ye lachilaapan suvidhaajanak hai aur kabhi-kabhi ek bug source (ek typo'd attribute naam chupchaap ek naya attribute banaata hai raise karne ke bajaye). \`__slots__\` (baad ka lesson) ise band karta hai.`,

    examples: [
      {
        title: 'Broken: mutable class attribute leaks across instances',
        titleHi: 'Toota: mutable class attribute instances mein leak hota hai',
        code: `class Playlist:
    songs = []            # class attribute -- shared

    def add(self, song):
        self.songs.append(song)

rock = Playlist()
jazz = Playlist()
rock.add("Bohemian Rhapsody")
jazz.add("Take Five")

print("rock:", rock.songs)
print("jazz:", jazz.songs)
print("same list?", rock.songs is jazz.songs)
print("class list:", Playlist.songs)`,
        output: `rock: ['Bohemian Rhapsody', 'Take Five']
jazz: ['Bohemian Rhapsody', 'Take Five']
same list? True
class list: ['Bohemian Rhapsody', 'Take Five']`,
        explain: 'There is one `songs` list, attached to the `Playlist` class. `self.songs.append(...)` looks `songs` up (not on the instance, so on the class) and mutates that one shared list. Both playlists — and the class itself — see every song. `rock.songs is jazz.songs` confirms it is literally the same object.',
        explainHi: 'Ek `songs` list hai, `Playlist` class se juda. `self.songs.append(...)` `songs` lookup karta hai (instance par nahi, isliye class par) aur us ek shared list ko mutate karta hai. Dono playlists — aur class khud — har song dekhte hain. `rock.songs is jazz.songs` confirm karta hai ki ye sachmuch wahi object hai.',
      },
      {
        title: 'Fixed: per-instance state; class attribute as a real default',
        titleHi: 'Theek: per-instance state; ek asli default ki tarah class attribute',
        code: `class Playlist:
    max_size = 100               # a genuine shared default (immutable, read-only)

    def __init__(self, name):
        self.name = name
        self.songs = []          # a fresh list per instance

    def add(self, song):
        if len(self.songs) >= self.max_size:
            raise ValueError("playlist full")
        self.songs.append(song)

rock = Playlist("Rock")
jazz = Playlist("Jazz")
rock.add("Bohemian Rhapsody")
jazz.add("Take Five")

print("rock:", rock.songs)
print("jazz:", jazz.songs)
print("same list?", rock.songs is jazz.songs)

rock.max_size = 2               # instance attribute -- shadows the class default for rock only
print("rock max:", rock.max_size, " jazz max:", jazz.max_size, " class max:", Playlist.max_size)`,
        output: `rock: ['Bohemian Rhapsody']
jazz: ['Take Five']
same list? False
rock max: 2  jazz max: 100  class max: 100`,
        explain: '`self.songs = []` in `__init__` gives each playlist its own list. `max_size` stays on the class as a shared, read-only default — every instance sees `100` via lookup. Assigning `rock.max_size = 2` creates an instance attribute on `rock` that shadows the class value for `rock` only; `jazz` and the class are unaffected.',
        explainHi: '`__init__` mein `self.songs = []` har playlist ko apni list deta hai. `max_size` class par ek shared, read-only default ki tarah rehta hai — har instance lookup ke zariye `100` dekhta hai. `rock.max_size = 2` assign karna `rock` par ek instance attribute banaata hai jo sirf `rock` ke liye class value ko shadow karta hai; `jazz` aur class aprabhaavit hain.',
      },
      {
        title: 'self is the first parameter; a shared counter done right',
        titleHi: 'self pehla parameter hai; ek shared counter sahi kiya',
        code: `class BankAccount:
    _total_accounts = 0          # deliberately shared class state

    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        BankAccount._total_accounts += 1     # rebind on the CLASS
        self.number = BankAccount._total_accounts

    def deposit(self, amount):
        self.balance += amount               # rebind on the INSTANCE
        return self.balance

    @classmethod
    def total(cls):
        return cls._total_accounts

a = BankAccount("Ada", 100)
b = BankAccount("Bo")
print(a.deposit(50))
print(b.deposit(20))
print("a:", a.owner, a.number, a.balance)
print("b:", b.owner, b.number, b.balance)
print("total accounts:", BankAccount.total())

# calling a method two equivalent ways:
print(BankAccount.deposit(a, 10))    # explicit self
print(a.deposit(10))                 # bound method -- Python passes a as self`,
        output: `150
20
a: Ada 1 150
b: Bo 2 20
total accounts: 2
160
170`,
        explain: '`BankAccount._total_accounts += 1` mutates shared class state (you must name the class to rebind it). `self.balance += amount` correctly creates/updates a per-instance value. `BankAccount.deposit(a, 10)` and `a.deposit(10)` are the same call — `a.deposit` is just `BankAccount.deposit` with `a` bound as the first argument.',
        explainHi: '`BankAccount._total_accounts += 1` shared class state ko mutate karta hai (ise rebind karne ko aapko class naam dena hoga). `self.balance += amount` sahi tarike se ek per-instance value banaata/update karta hai. `BankAccount.deposit(a, 10)` aur `a.deposit(10)` wahi call hain — `a.deposit` bas `BankAccount.deposit` hai `a` ke saath pehle argument ki tarah bound.',
      },
    ],

    mistakes: [
      {
        wrong: `class Logger:
    history = []                  # shared across every Logger
    def log(self, msg):
        self.history.append(msg)`,
        right: `class Logger:
    def __init__(self):
        self.history = []        # one per instance`,
        why: 'Any list, dict, set, or other mutable object at class-body level is one object shared by every instance — the same trap as a mutable default argument. Every `Logger().log(...)` writes into the same `history`. Per-instance mutable state must be created in `__init__`.',
        whyHi: 'Class-body level par koi bhi list, dict, set, ya doosra mutable object ek object hai jo har instance dwara shared hai — mutable default argument jaisa hi jaal. Har `Logger().log(...)` usi `history` mein likhta hai. Per-instance mutable state `__init__` mein banaya jaana chahiye.',
      },
      {
        wrong: `class Counter:
    count = 0
    def bump(self):
        self.count += 1          # reads class 0, writes instance 1 -- class stays 0`,
        right: `class Counter:
    count = 0
    def bump(self):
        Counter.count += 1       # if 'count' is meant to be shared
# or, for per-instance:
    def __init__(self):
        self.count = 0`,
        why: '`self.count += 1` is `self.count = self.count + 1`: the read finds the class attribute (0), the write creates an instance attribute. The class value never changes and each instance silently starts its own count from 0. Decide: shared (name the class) or per-instance (init it).',
        whyHi: '`self.count += 1` `self.count = self.count + 1` hai: read class attribute (0) paata hai, write ek instance attribute banaata hai. Class value kabhi nahi badalti aur har instance chupchaap apni count 0 se shuru karta hai. Tay karo: shared (class naam do) ya per-instance (ise init karo).',
      },
      {
        wrong: `class User:
    def __init__(self, name):
        self.name = name
        return self              # TypeError: __init__() should return None`,
        right: `class User:
    def __init__(self, name):
        self.name = name         # no return`,
        why: '`__init__` initialises an instance that already exists; it must return `None` (implicitly). Returning a value raises `TypeError`. If you need a method that builds and returns an object, that is a `@classmethod` (an alternative constructor), not `__init__`.',
        whyHi: '`__init__` ek instance ko initialise karta hai jo pehle se maujood hai; ise `None` return karna chahiye (implicitly). Ek value return karna `TypeError` deta hai. Agar aapko ek method chahiye jo ek object banaaye aur return kare, wo ek `@classmethod` hai (ek alternative constructor), `__init__` nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Django models make this distinction constantly** — class-body `objects = Manager()`, `class Meta:`, field definitions (`name = models.CharField(...)`) are class-level and processed by a metaclass; per-row data lives on the instance. A mutable default on a model field uses `default=list` (the callable), never `default=[]`, for the same reason.',
        hi: '**Django models is antar ko lagaataar banaate hain** — class-body `objects = Manager()`, `class Meta:`, field definitions class-level hain aur ek metaclass dwara process hote hain; per-row data instance par rehta hai. Ek model field par ek mutable default `default=list` (callable) istemal karta hai, kabhi `default=[]` nahi.',
      },
      {
        en: '**The shared-mutable-class-attribute bug is a real production incident** — a DRF serializer or a service class with `errors = []` or `_cache = {}` at class level accumulates data across requests from different users, leaking one user\'s data into another\'s response.',
        hi: '**Shared-mutable-class-attribute bug ek asli production incident hai** — class level par `errors = []` ya `_cache = {}` waali ek DRF serializer ya ek service class alag users ki requests ke beech data jama karti hai, ek user ka data doosre ke response mein leak karti hai.',
      },
      {
        en: '**`self` being explicit** is why you can do `SomeClass.method(instance, ...)`, why decorators on methods work, and why `staticmethod`/`classmethod` exist — the method is a plain function and the instance is a normal argument. Coming from JS, there is no `this` binding confusion.',
        hi: '**`self` ke explicit hone** ki wajah se aap `SomeClass.method(instance, ...)` kar sakte ho, methods par decorators kaam karte hain, aur `staticmethod`/`classmethod` maujood hain — method ek plain function hai aur instance ek saamaanya argument hai. JS se aane par, koi `this` binding confusion nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a class attribute and an instance attribute, and what is the classic bug?',
        qHi: 'Ek class attribute aur ek instance attribute mein kya antar hai, aur classic bug kya hai?',
        a: 'A class attribute is defined directly in the class body and belongs to the class object itself. There is exactly one of it, and every instance sees it through attribute lookup unless that instance has its own attribute of the same name. An instance attribute is created by assigning through self, normally inside init, and each instance has its own independent copy. Attribute lookup on an instance checks the instance\'s own dictionary first, then the class, then base classes. Assignment through the instance always writes to the instance\'s dictionary — it never modifies the class attribute; it creates an instance attribute that shadows it. This is why a class attribute makes a good default value: instances read it until one of them overrides it by assignment. The classic bug is putting a mutable object — a list, a dict, a set — as a class attribute, intending it as per-instance state. Because there is only one object, every instance that mutates it through self is mutating the same shared object. So a class with items equals empty-list in the body, whose methods append to self dot items, ends up with every instance sharing one list; adding to one cart shows up in all of them. It is the same mechanism as the mutable default argument trap. The fix is to assign the mutable value in init, through self, so each instance gets a fresh one. A related subtlety: self dot count plus-equals one where count is a class attribute does not increment the class attribute. The read resolves to the class value, but the augmented assignment then writes an instance attribute, so the class value is untouched and each instance quietly starts its own counter. To mutate genuinely shared class state you have to name the class explicitly, as in ClassName dot count plus-equals one.',
        aHi: 'Ek class attribute seedhe class body mein define hota hai aur class object ka hi hai. Iska bilkul ek hota hai, aur har instance ise attribute lookup ke zariye dekhta hai jab tak us instance ke paas usi naam ka apna attribute na ho. Ek instance attribute self ke zariye assign karke banaya jaata hai, aam taur par init ke andar, aur har instance ki apni swतंत्र copy hoti hai. Ek instance par attribute lookup pehle instance ki apni dictionary check karta hai, phir class, phir base classes. Instance ke zariye assignment hamesha instance ki dictionary mein likhta hai — ye kabhi class attribute ko modify nahi karta. Yahi wajah hai ki ek class attribute ek achhi default value banaata hai. Classic bug ek mutable object — ek list, ek dict, ek set — ko ek class attribute ki tarah rakhna hai, ise per-instance state ki tarah soch kar. Kyunki sirf ek object hai, har instance jo ise self ke zariye mutate karta hai wo usi shared object ko mutate kar raha hai. Fix mutable value ko init mein, self ke zariye assign karna hai. Ek sambandhit sookshmata: self dot count plus-equals one jahaan count ek class attribute hai class attribute ko increment nahi karta.',
      },
      {
        q: 'Explain `self` and `__init__`. Is `__init__` a constructor?',
        qHi: '`self` aur `__init__` samjhaao. Kya `__init__` ek constructor hai?',
        a: 'self is the instance the method was called on, and it is nothing more special than the first positional parameter of the method. When you call instance dot method of args, Python looks method up on the class, and because functions accessed through an instance become bound methods, it automatically passes the instance as the first argument. So instance dot method of x and Class dot method of instance comma x are exactly the same call. The name self is pure convention; the parameter could be called anything, but every Python codebase uses self and you should too. There is no implicit this and no binding rules to worry about — the instance is just an ordinary argument, which is also why decorators on methods, and classmethod and staticmethod, work without special cases. As for init: it is an initialiser, not a constructor in the C++ or Java sense. By the time init runs, the instance already exists — it was created by new, which allocated a blank object. Python then calls init, passing that blank object as self, and init\'s job is to set attributes on it. init must not return anything other than None; returning a value raises a TypeError. So the sequence for Class of args is: new is called to produce the instance, then init is called on that instance to configure it, then the instance is handed back to you. You almost never override new — it matters only for things like immutable types, metaclasses, or instance caching. If you want a method that constructs and returns a fully built object by some alternative route, for example building a Date from a string, that is a classmethod acting as an alternative constructor, not init.',
        aHi: 'self wo instance hai jispar method call hua, aur ye method ke pehle positional parameter se zyaada khaas kuch nahi hai. Jab aap instance dot method of args call karte ho, Python method ko class par lookup karta hai, aur kyunki ek instance ke zariye access kiye functions bound methods ban jaate hain, ye apne aap instance ko pehle argument ki tarah pass karta hai. Toh instance dot method of x aur Class dot method of instance comma x bilkul wahi call hain. Naam self shuddh convention hai. Koi implicit this nahi aur chinta karne ke liye koi binding rules nahi. init ke baare mein: ye ek initialiser hai, C++ ya Java arth mein ek constructor nahi. Jab tak init chalta hai, instance pehle se maujood hai — ise new ne banaya, jisne ek blank object allocate kiya. Python phir init ko call karta hai, us blank object ko self ki tarah pass karke, aur init ka kaam uspar attributes set karna hai. init ko None ke alawa kuch return nahi karna chahiye. Agar aap ek method chahte ho jo kisi vaikalpik raaste se ek poora bana object banaaye aur return kare, wo ek classmethod hai ek alternative constructor ki tarah, init nahi.',
      },
    ],

    exercises: [
      {
        task: 'Write a buggy `Inventory` class with `stock = {}` at class level and an `add(self, item, qty)` method. Create two inventories, add to one, print the other\'s stock (shows the leak). Then fix it with `__init__`. Confirm `inv1.stock is inv2.stock` is `False` after the fix.',
        taskHi: 'Ek buggy `Inventory` class likho jismein class level par `stock = {}` aur ek `add(self, item, qty)` method ho. Do inventories banao, ek mein jodo, doosre ka stock print karo (leak dikhta hai). Phir ise `__init__` se theek karo. Fix ke baad `inv1.stock is inv2.stock` `False` confirm karo.',
        hint: 'Buggy: `self.stock[item] = self.stock.get(item, 0) + qty` mutates the shared class dict. Fixed: `def __init__(self): self.stock = {}`. The `is` check proves each instance now has a distinct dict.',
        hintHi: 'Buggy: `self.stock[item] = self.stock.get(item, 0) + qty` shared class dict ko mutate karta hai. Fixed: `def __init__(self): self.stock = {}`. `is` check saabit karta hai ki har instance ke paas ab ek alag dict hai.',
      },
      {
        task: 'Write `Employee` with a class attribute `company = "Acme"` (shared) and instance attributes `name`, `salary`. Add a `@classmethod set_company(cls, name)` that changes it for everyone. Create two employees, call `set_company`, and show both now report the new company. Then set `e1.company = "SoloCorp"` and show only `e1` changed.',
        taskHi: '`Employee` likho ek class attribute `company = "Acme"` (shared) aur instance attributes `name`, `salary` ke saath. Ek `@classmethod set_company(cls, name)` jodo jo ise sabke liye badalta hai. Do employees banao, `set_company` call karo, aur dikhao dono ab naya company report karte hain. Phir `e1.company = "SoloCorp"` set karo aur dikhao sirf `e1` badla.',
        hint: '`set_company` does `cls.company = name` (rebinds the class attribute). After that both instances see it via lookup. `e1.company = "SoloCorp"` creates an instance attribute that shadows the class value for `e1` only.',
        hintHi: '`set_company` `cls.company = name` karta hai (class attribute rebind). Uske baad dono instances ise lookup ke zariye dekhte hain. `e1.company = "SoloCorp"` ek instance attribute banaata hai jo sirf `e1` ke liye class value ko shadow karta hai.',
      },
      {
        task: 'Write `IdGenerator` where each instance gets a unique sequential `.id` starting at 1, using a shared class counter. Create 4 instances and print their ids (`1, 2, 3, 4`). Deliberately try `self._next += 1` instead of `IdGenerator._next += 1` and explain why all ids become 1.',
        taskHi: '`IdGenerator` likho jahaan har instance ko ek unique sequential `.id` milta hai jo 1 se shuru hota hai, ek shared class counter istemal karke. 4 instances banao aur unke ids print karo (`1, 2, 3, 4`). Jaan-boojhkar `IdGenerator._next += 1` ke bajaye `self._next += 1` try karo aur samjhaao saare ids 1 kyun ban jaate hain.',
        hint: 'Correct: `IdGenerator._next += 1; self.id = IdGenerator._next`. With `self._next += 1`, every instance reads the class `_next` (still 0), writes its own instance `_next = 1`, and the class counter never advances — so every `self.id` is 1.',
        hintHi: 'Sahi: `IdGenerator._next += 1; self.id = IdGenerator._next`. `self._next += 1` ke saath, har instance class `_next` (abhi bhi 0) padhta hai, apna instance `_next = 1` likhta hai, aur class counter kabhi aage nahi badhta — isliye har `self.id` 1 hai.',
      },
    ],

    keyTakeaways: [
      'A class-body assignment creates ONE value on the class, shared by all instances. An assignment through `self` (in `__init__`) creates a SEPARATE value per instance.',
      'Class attributes are for constants and immutable defaults. Any mutable per-instance state (`[]`, `{}`, `set()`) MUST be created in `__init__` — otherwise every instance mutates the same object.',
      'Attribute read: instance `__dict__` first, then the class (and bases). Attribute write (`self.x = ...`): always creates/updates an INSTANCE attribute, shadowing any class attribute of the same name.',
      '`self.count += 1` where `count` is a class attribute reads the class value but writes an instance attribute — the class value never changes. To mutate shared class state, name the class: `ClassName.count += 1`.',
      '`self` is just the first positional parameter — the instance the method was called on. `obj.method(x)` and `Class.method(obj, x)` are identical.',
      '`__init__` is an initialiser, not a constructor: the instance already exists (made by `__new__`) when `__init__` runs. `__init__` must return `None`.',
      'An alternative constructor that builds and returns an object is a `@classmethod`, not `__init__`.',
      'Instances store attributes in a plain `__dict__` and accept new attributes any time — a typo\'d attribute name silently creates a new attribute rather than erroring (`__slots__` disables this).',
    ],
    keyTakeawaysHi: [
      'Ek class-body assignment class par EK value banaata hai, sab instances dwara shared. `self` ke zariye ek assignment (`__init__` mein) prati instance ek ALAG value banaata hai.',
      'Class attributes constants aur immutable defaults ke liye hain. Koi bhi mutable per-instance state (`[]`, `{}`, `set()`) `__init__` mein banaya jaana CHAHIYE — warna har instance usi object ko mutate karta hai.',
      'Attribute read: pehle instance `__dict__`, phir class (aur bases). Attribute write (`self.x = ...`): hamesha ek INSTANCE attribute banaata/update karta hai, usi naam ke kisi class attribute ko shadow karke.',
      '`self.count += 1` jahaan `count` ek class attribute hai class value padhta hai par ek instance attribute likhta hai — class value kabhi nahi badalti. Shared class state mutate karne ko, class naam do: `ClassName.count += 1`.',
      '`self` bas pehla positional parameter hai — wo instance jispar method call hua. `obj.method(x)` aur `Class.method(obj, x)` samaan hain.',
      '`__init__` ek initialiser hai, ek constructor nahi: `__init__` chalne par instance pehle se maujood hai (`__new__` dwara bana). `__init__` ko `None` return karna chahiye.',
      'Ek alternative constructor jo ek object banaata aur return karta hai wo ek `@classmethod` hai, `__init__` nahi.',
      'Instances attributes ek plain `__dict__` mein store karte hain aur kabhi bhi naye attributes accept karte hain — ek galat-likha attribute naam chupchaap ek naya attribute banaata hai (`__slots__` ise disable karta hai).',
    ],
  },

  {
    slug: 'py-dunder-methods',
    title: 'Dunder Methods: Making a Class Behave Like a Real Object',
    titleHi: 'Dunder Methods: Ek Class Ko Ek Asli Object Jaisa Banaana',
    description: 'Printing your custom object and getting `<myapp.Money object at 0x7f3c...>`, comparing two objects that are obviously equal and getting `False`, putting them in a set and finding duplicates — all because a plain class has no idea how to represent, compare, or hash itself. The double-underscore methods (`__repr__`, `__eq__`, `__hash__`, `__len__`, ...) are the hooks Python calls for each of those operations.',
    descriptionHi: 'Apna custom object print karna aur `<myapp.Money object at 0x7f3c...>` paana, do objects compare karna jo spasht roop se barabar hain aur `False` paana, unhe ek set mein rakhna aur duplicates paana — sab kyunki ek plain class ko nahi pata ki khud ko kaise represent, compare, ya hash kare. Double-underscore methods (`__repr__`, `__eq__`, `__hash__`, `__len__`, ...) wo hooks hain jo Python un operations mein se har ek ke liye call karta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Teaching a new employee the standard office responses.** A person who just joined does not yet know what to say when someone asks "who are you?", or how to decide whether two folders count as "the same case", or how to file something so it can be found again. Until you teach them, they give a useless default answer — a badge number instead of a name. The dunder methods are exactly this training. `__repr__` teaches the object how to answer "describe yourself" (for a developer reading a log). `__eq__` teaches it how to decide "are you the same as this other one?". `__hash__` teaches it how to produce a filing code so a set or dict can store it. `__len__` teaches it to answer "how big are you?". Each one is a specific, named response to a specific question Python will ask on your behalf when someone writes `repr(obj)`, `obj == other`, `obj in some_set`, `len(obj)`. You are not overriding operators for cleverness; you are filling in the responses a well-behaved object is expected to have.',
      hi: '**Ek naye employee ko standard office responses sikhaana.** Ek vyakti jo abhi juda hai use abhi nahi pata ki kya kahe jab koi poochhe "aap kaun ho?", ya kaise tay kare ki do folders "wahi case" gine jaayein. Jab tak aap unhe sikhaate nahi, wo ek bekaar default jawaab dete hain — naam ke bajaye ek badge number. Dunder methods bilkul ye training hain. `__repr__` object ko sikhaata hai ki "khud ko describe karo" ka jawaab kaise de (ek log padhne waale developer ke liye). `__eq__` ise sikhaata hai ki kaise tay kare "kya aap is doosre ke samaan ho?". `__hash__` ise sikhaata hai ki ek filing code kaise banaaye taaki ek set ya dict ise store kar sake. `__len__` ise sikhaata hai "aap kitne bade ho?" ka jawaab dena. Har ek ek specific question ka ek specific, named response hai jo Python aapki taraf se poochhega jab koi `repr(obj)`, `obj == other`, `obj in some_set`, `len(obj)` likhta hai.',
    },

    simple: `**Start broken.** A plain class prints and compares uselessly:

\`\`\`python
class Money:
    def __init__(self, cents):
        self.cents = cents

a = Money(500)
b = Money(500)

print(a)                     # <__main__.Money object at 0x7f3c1a2b40>
print(a == b)                # False   -- different objects, no __eq__
print({a, b})                # {two items}   -- both stored, seen as distinct
\`\`\`

**The fix: implement the dunder methods for the behaviour you need**

\`\`\`python
class Money:
    def __init__(self, cents):
        self.cents = cents

    def __repr__(self):
        return f"Money({self.cents})"          # for developers / logs / the REPL

    def __str__(self):
        return f"\${self.cents / 100:.2f}"      # for end users / print()

    def __eq__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        return self.cents == other.cents

    def __hash__(self):
        return hash(self.cents)                # REQUIRED if you define __eq__ and want it hashable

a, b = Money(500), Money(500)
print(repr(a))               # Money(500)
print(str(a))                # $5.00
print(a == b)                # True
print(len({a, b}))           # 1   -- equal + same hash -> one entry
\`\`\`

\`\`\`
THE COMMON DUNDERS:

  __repr__(self)      repr(x), the REPL, containers   -> unambiguous, for developers
  __str__(self)       str(x), print(x), f"{x}"        -> readable, for users (falls back to __repr__)
  __eq__(self, other) x == y                          -> return NotImplemented for unknown types
  __hash__(self)      hash(x); needed for set/dict keys -> MUST match __eq__; define both or neither
  __lt__ / __le__ ... x < y, sorting                  -> or use @functools.total_ordering
  __len__(self)       len(x)                          -> also makes empty x falsy by default
  __bool__(self)      bool(x), if x:                  -> defaults to True (or to __len__ != 0)
  __contains__        x in y
  __getitem__         x[key]
  __iter__ / __next__ for x in y:    (Module 8)
  __call__(self)      x()
  __enter__/__exit__  with x:        (Module 6)
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Ek plain class bekaar print aur compare karti hai:

\`\`\`python
class Money:
    def __init__(self, cents):
        self.cents = cents

a = Money(500)
b = Money(500)

print(a)                     # <__main__.Money object at 0x7f3c1a2b40>
print(a == b)                # False   -- alag objects, koi __eq__ nahi
print({a, b})                # {do items}   -- dono store, alag dikhe
\`\`\`

**Fix: jo behaviour chahiye uske liye dunder methods implement karo**

\`\`\`python
class Money:
    def __init__(self, cents):
        self.cents = cents

    def __repr__(self):
        return f"Money({self.cents})"          # developers / logs / REPL ke liye

    def __str__(self):
        return f"\${self.cents / 100:.2f}"      # end users / print() ke liye

    def __eq__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        return self.cents == other.cents

    def __hash__(self):
        return hash(self.cents)                # ZAROORI agar aap __eq__ define karte ho aur ise hashable chahiye

a, b = Money(500), Money(500)
print(repr(a))               # Money(500)
print(str(a))                # $5.00
print(a == b)                # True
print(len({a, b}))           # 1   -- barabar + wahi hash -> ek entry
\`\`\`

\`\`\`
AAM DUNDERS:

  __repr__(self)      repr(x), REPL, containers      -> asandigdh, developers ke liye
  __str__(self)       str(x), print(x), f"{x}"        -> padhne yogya, users ke liye (__repr__ par fallback)
  __eq__(self, other) x == y                          -> anjaan types ke liye NotImplemented return karo
  __hash__(self)      hash(x); set/dict keys ke liye chahiye -> __eq__ se MATCH kare; dono define karo ya koi nahi
  __lt__ / __le__ ... x < y, sorting                  -> ya @functools.total_ordering istemal karo
  __len__(self)       len(x)                          -> khaali x ko by default falsy bhi banaata hai
  __bool__(self)      bool(x), if x:                  -> default True (ya __len__ != 0)
  __contains__        x in y
  __getitem__         x[key]
  __iter__ / __next__ for x in y:    (Module 8)
  __call__(self)      x()
  __enter__/__exit__  with x:        (Module 6)
\`\`\``,

    content: `## \`__repr__\` vs \`__str__\`

\`\`\`python
class Color:
    def __init__(self, r, g, b):
        self.r, self.g, self.b = r, g, b
    def __repr__(self):
        return f"Color(r={self.r}, g={self.g}, b={self.b})"   # could paste back into code
    def __str__(self):
        return f"#{self.r:02x}{self.g:02x}{self.b:02x}"        # what a user wants to see

c = Color(255, 128, 0)
print(c)            # #ff8000        -- print uses __str__
print(repr(c))      # Color(r=255, g=128, b=0)
[c]                 # [Color(r=255, g=128, b=0)]  -- containers use __repr__
f"{c}"             # '#ff8000'       -- f-string uses __str__
f"{c!r}"           # 'Color(...)'    -- !r forces __repr__
\`\`\`

- **Always define \`__repr__\`.** It is what you see in the debugger, in logs, in a list, in a traceback. Aim for something unambiguous — ideally valid Python that would recreate the object.
- **\`__str__\` is optional.** If absent, \`str(x)\` falls back to \`__repr__\`. Define it only when the user-facing form genuinely differs.

## \`__eq__\` and \`__hash__\` — the pair rule

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented          # let Python try other.__eq__ / fall back to identity
        return (self.x, self.y) == (other.x, other.y)
    def __hash__(self):
        return hash((self.x, self.y))      # hash of a tuple of the same fields __eq__ uses
\`\`\`

The contract: **if \`a == b\` then \`hash(a) == hash(b)\`.** Consequences:

- Define \`__eq__\` without \`__hash__\` and Python sets \`__hash__ = None\` — the object becomes **unhashable** (cannot go in a set or be a dict key). This is deliberate: a custom equality with the default identity hash would break sets.
- If the object is **mutable**, do not make it hashable — its hash would change while it sits in a set. Either keep it unhashable or hash only immutable identity fields.
- \`return NotImplemented\` (not \`False\`) for unknown types, so \`5 == my_point\` can still work via the other operand.

## Ordering: \`__lt__\` and \`@total_ordering\`

\`\`\`python
import functools

@functools.total_ordering
class Version:
    def __init__(self, major, minor):
        self.major, self.minor = major, minor
    def __eq__(self, other):
        return (self.major, self.minor) == (other.major, other.minor)
    def __lt__(self, other):
        return (self.major, self.minor) < (other.major, other.minor)
    def __hash__(self):
        return hash((self.major, self.minor))

sorted([Version(1, 2), Version(1, 0), Version(2, 1)])   # works
Version(1, 2) >= Version(1, 0)                          # True -- total_ordering fills in >=, >, <=
\`\`\`

Define \`__eq__\` + \`__lt__\`, add \`@functools.total_ordering\`, and it derives \`__le__\`, \`__gt__\`, \`__ge__\`. Sorting, \`min\`, \`max\`, and \`sorted\` all use \`__lt__\`.

## Container-like behaviour

\`\`\`python
class Deck:
    def __init__(self, cards):
        self._cards = list(cards)
    def __len__(self):
        return len(self._cards)              # len(deck)
    def __getitem__(self, i):
        return self._cards[i]                # deck[0], deck[-1], deck[1:3], and iteration!
    def __contains__(self, card):
        return card in self._cards          # card in deck
    def __bool__(self):
        return len(self._cards) > 0          # if deck:

d = Deck(["AS", "KH", "2C"])
len(d)              # 3
d[0]               # 'AS'
"KH" in d          # True
for card in d: ...  # __getitem__ with 0, 1, 2, ... makes it iterable even without __iter__
\`\`\`

Implementing \`__getitem__\` alone gives you indexing, slicing, and iteration. Add \`__len__\` and \`__contains__\` and the object feels built-in.

## \`__call__\` — make an instance callable

\`\`\`python
class Multiplier:
    def __init__(self, factor):
        self.factor = factor
    def __call__(self, x):
        return x * self.factor

double = Multiplier(2)
double(21)          # 42   -- the instance behaves like a function
\`\`\`

Useful for stateful "functions": a rate limiter, an accumulator, a configured transformer. This is also how class-based decorators work.`,

    contentHi: `## \`__repr__\` vs \`__str__\`

\`\`\`python
class Color:
    def __init__(self, r, g, b):
        self.r, self.g, self.b = r, g, b
    def __repr__(self):
        return f"Color(r={self.r}, g={self.g}, b={self.b})"   # code mein wapas paste ho sakta hai
    def __str__(self):
        return f"#{self.r:02x}{self.g:02x}{self.b:02x}"        # jo ek user dekhna chahta hai

c = Color(255, 128, 0)
print(c)            # #ff8000        -- print __str__ istemal karta hai
print(repr(c))      # Color(r=255, g=128, b=0)
[c]                 # [Color(r=255, g=128, b=0)]  -- containers __repr__ istemal karte hain
f"{c}"             # '#ff8000'       -- f-string __str__ istemal karta hai
f"{c!r}"           # 'Color(...)'    -- !r __repr__ ko majboor karta hai
\`\`\`

- **Hamesha \`__repr__\` define karo.** Ye wo hai jo aap debugger mein, logs mein, ek list mein, ek traceback mein dekhte ho. Kuch asandigdh ka lakshya rakho — aadarsh roop se valid Python jo object ko dobara banaaye.
- **\`__str__\` optional hai.** Agar nahi hai, \`str(x)\` \`__repr__\` par fallback karta hai. Ise sirf tab define karo jab user-facing roop sachmuch alag ho.

## \`__eq__\` aur \`__hash__\` — pair niyam

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)
    def __hash__(self):
        return hash((self.x, self.y))
\`\`\`

Contract: **agar \`a == b\` to \`hash(a) == hash(b)\`.** Parinaam:

- \`__eq__\` \`__hash__\` ke bina define karo aur Python \`__hash__ = None\` set karta hai — object **unhashable** ban jaata hai (ek set mein nahi ja sakta ya dict key nahi ho sakta). Ye jaan-boojhkar hai.
- Agar object **mutable** hai, ise hashable mat banao — iska hash badal jaayega jab ye ek set mein baitha ho. Ya ise unhashable rakho ya sirf immutable identity fields hash karo.
- Anjaan types ke liye \`return NotImplemented\` (\`False\` nahi), taaki \`5 == my_point\` abhi bhi doosre operand ke zariye kaam kar sake.

## Ordering: \`__lt__\` aur \`@total_ordering\`

\`\`\`python
import functools

@functools.total_ordering
class Version:
    def __init__(self, major, minor):
        self.major, self.minor = major, minor
    def __eq__(self, other):
        return (self.major, self.minor) == (other.major, other.minor)
    def __lt__(self, other):
        return (self.major, self.minor) < (other.major, other.minor)
    def __hash__(self):
        return hash((self.major, self.minor))

sorted([Version(1, 2), Version(1, 0), Version(2, 1)])   # kaam karta hai
Version(1, 2) >= Version(1, 0)                          # True -- total_ordering >= bhrta hai
\`\`\`

\`__eq__\` + \`__lt__\` define karo, \`@functools.total_ordering\` jodo, aur ye \`__le__\`, \`__gt__\`, \`__ge__\` derive karta hai. Sorting, \`min\`, \`max\`, aur \`sorted\` sab \`__lt__\` istemal karte hain.

## Container-jaisa behaviour

\`\`\`python
class Deck:
    def __init__(self, cards):
        self._cards = list(cards)
    def __len__(self):
        return len(self._cards)              # len(deck)
    def __getitem__(self, i):
        return self._cards[i]                # deck[0], deck[-1], deck[1:3], aur iteration!
    def __contains__(self, card):
        return card in self._cards          # card in deck
    def __bool__(self):
        return len(self._cards) > 0          # if deck:

d = Deck(["AS", "KH", "2C"])
len(d)              # 3
d[0]               # 'AS'
"KH" in d          # True
for card in d: ...  # 0, 1, 2, ... ke saath __getitem__ ise __iter__ ke bina bhi iterable banaata hai
\`\`\`

Akela \`__getitem__\` implement karna aapko indexing, slicing, aur iteration deta hai. \`__len__\` aur \`__contains__\` jodo aur object built-in jaisa lagta hai.

## \`__call__\` — ek instance ko callable banao

\`\`\`python
class Multiplier:
    def __init__(self, factor):
        self.factor = factor
    def __call__(self, x):
        return x * self.factor

double = Multiplier(2)
double(21)          # 42   -- instance ek function jaisa vyavhaar karta hai
\`\`\`

Stateful "functions" ke liye upyogi: ek rate limiter, ek accumulator, ek configured transformer. Aise class-based decorators bhi kaam karte hain.`,

    examples: [
      {
        title: 'repr, str, and where each one shows up',
        titleHi: 'repr, str, aur har ek kahaan dikhta hai',
        code: `class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius
    def __repr__(self):
        return f"Temperature({self.celsius})"
    def __str__(self):
        return f"{self.celsius} deg C"

t = Temperature(21)
print(t)                       # print -> __str__
print(repr(t))                 # repr  -> __repr__
print(f"it is {t}")            # f-string -> __str__
print(f"debug: {t!r}")         # f-string !r -> __repr__
print([t, t])                  # list repr -> __repr__ for each element
print(str(t), "|", repr(t))

class NoStr:
    def __init__(self, v):
        self.v = v
    def __repr__(self):
        return f"NoStr({self.v})"

n = NoStr(7)
print(n)                       # no __str__ -> falls back to __repr__`,
        output: `21 deg C
Temperature(21)
it is 21 deg C
debug: Temperature(21)
[Temperature(21), Temperature(21)]
21 deg C | Temperature(21)
NoStr(7)`,
        explain: '`print(t)` and `f"{t}"` call `__str__`; `repr(t)`, `f"{t!r}"`, and the list display call `__repr__`. When a class defines only `__repr__`, `str()` and `print()` fall back to it — which is why `__repr__` is the one you must always write and `__str__` is optional.',
        explainHi: '`print(t)` aur `f"{t}"` `__str__` call karte hain; `repr(t)`, `f"{t!r}"`, aur list display `__repr__` call karte hain. Jab ek class sirf `__repr__` define karti hai, `str()` aur `print()` ispar fallback karte hain — isliye `__repr__` wo hai jo aapko hamesha likhna hai aur `__str__` optional hai.',
      },
      {
        title: 'eq without hash makes the object unhashable',
        titleHi: 'hash ke bina eq object ko unhashable banaata hai',
        code: `class Tag:
    def __init__(self, name):
        self.name = name
    def __repr__(self):
        return f"Tag({self.name!r})"
    def __eq__(self, other):
        return isinstance(other, Tag) and self.name == other.name
    # NOTE: no __hash__

a, b = Tag("python"), Tag("python")
print(a == b)                  # True -- __eq__ works

try:
    {a, b}
except TypeError as e:
    print("set error:", "unhashable" in str(e))

try:
    {a: 1}
except TypeError as e:
    print("dict-key error:", "unhashable" in str(e))

# add __hash__ and it works:
class HTag(Tag):
    def __hash__(self):
        return hash(self.name)

x, y = HTag("python"), HTag("python")
print("dedup:", {x, y})`,
        output: `True
set error: True
dict-key error: True
dedup: {Tag('python')}`,
        explain: 'Defining `__eq__` without `__hash__` causes Python to set `__hash__` to `None`, making instances unhashable — they cannot be set members or dict keys. This prevents a subtle bug where two "equal" objects with different identity hashes both end up in a set. Adding a `__hash__` consistent with `__eq__` restores hashability, and the set deduplicates.',
        explainHi: '`__hash__` ke bina `__eq__` define karna Python ko `__hash__` `None` set karne par majboor karta hai, instances ko unhashable banaate hue — wo set members ya dict keys nahi ho sakte. Ye ek sookshm bug rokta hai jahaan alag identity hashes waale do "barabar" objects dono ek set mein aa jaate hain. `__eq__` ke saath sangat ek `__hash__` jodna hashability bahaal karta hai.',
      },
      {
        title: 'total_ordering and container dunders together',
        titleHi: 'total_ordering aur container dunders ek saath',
        code: `import functools

@functools.total_ordering
class Card:
    ORDER = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"]
    def __init__(self, rank):
        self.rank = rank
    def __repr__(self):
        return f"Card({self.rank!r})"
    def __eq__(self, other):
        return isinstance(other, Card) and self.rank == other.rank
    def __lt__(self, other):
        return self.ORDER.index(self.rank) < self.ORDER.index(other.rank)
    def __hash__(self):
        return hash(self.rank)

class Hand:
    def __init__(self, cards):
        self._cards = list(cards)
    def __len__(self):
        return len(self._cards)
    def __getitem__(self, i):
        return self._cards[i]
    def __contains__(self, rank):
        return any(c.rank == rank for c in self._cards)

hand = Hand([Card("K"), Card("2"), Card("A"), Card("7")])
print("len:", len(hand))
print("first:", hand[0])
print("slice:", hand[1:3])
print("has A?", "A" in hand)
print("sorted:", sorted(hand))
print("max:", max(hand))
print("K >= 7:", Card("K") >= Card("7"))`,
        output: `len: 4
first: Card('K')
slice: [Card('2'), Card('A')]
has A? True
sorted: [Card('2'), Card('7'), Card('K'), Card('A')]
max: Card('A')
K >= 7: True`,
        explain: '`@total_ordering` derives `>=`, `>`, `<=` from the `__eq__` + `__lt__` you wrote, so `Card("K") >= Card("7")` works and `sorted`/`max` (which use `__lt__`) order the hand by rank. `Hand` defines `__len__`, `__getitem__` (giving indexing AND slicing), and `__contains__`, so it behaves like a sequence without inheriting from anything.',
        explainHi: '`@total_ordering` aapke likhe `__eq__` + `__lt__` se `>=`, `>`, `<=` derive karta hai, isliye `Card("K") >= Card("7")` kaam karta hai aur `sorted`/`max` (jo `__lt__` istemal karte hain) hand ko rank se order karte hain. `Hand` `__len__`, `__getitem__` (indexing AUR slicing dete hue), aur `__contains__` define karta hai, isliye ye kisi se inherit kiye bina ek sequence jaisa vyavhaar karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `class User:
    def __init__(self, id):
        self.id = id
    def __eq__(self, other):
        return self.id == other.id
    # forgot __hash__`,
        right: `class User:
    def __init__(self, id):
        self.id = id
    def __eq__(self, other):
        if not isinstance(other, User):
            return NotImplemented
        return self.id == other.id
    def __hash__(self):
        return hash(self.id)`,
        why: 'Defining `__eq__` alone makes the class unhashable (`__hash__` becomes `None`), so `set(users)` or `{user: ...}` raises `TypeError`. Also, `other.id` without an `isinstance` check crashes when `other` is a different type; return `NotImplemented` instead so `user == "abc"` yields `False` rather than an `AttributeError`.',
        whyHi: 'Akela `__eq__` define karna class ko unhashable banaata hai (`__hash__` `None` ban jaata hai), isliye `set(users)` ya `{user: ...}` `TypeError` deta hai. Saath hi, ek `isinstance` check ke bina `other.id` crash hota hai jab `other` ek alag type hai; iske bajaye `NotImplemented` return karo.',
      },
      {
        wrong: `class Basket:
    def __init__(self):
        self.items = []
    def __eq__(self, other):
        return self.items == other.items
    def __hash__(self):
        return hash(tuple(self.items))    # hash changes when items change!`,
        right: `class Basket:
    def __init__(self, basket_id):
        self.basket_id = basket_id
        self.items = []
    def __eq__(self, other):
        return isinstance(other, Basket) and self.basket_id == other.basket_id
    def __hash__(self):
        return hash(self.basket_id)       # stable identity field only`,
        why: 'A mutable object should hash only on fields that never change (like an id), or not be hashable at all. Hashing on `self.items` means the hash changes after you add an item — if the object was already in a set, it is now in the wrong bucket and `x in set` returns `False` for an object that is in the set.',
        whyHi: 'Ek mutable object ko sirf un fields par hash karna chahiye jo kabhi nahi badalte (jaise ek id), ya bilkul hashable nahi hona chahiye. `self.items` par hash karna matlab ek item jodne ke baad hash badalta hai — agar object pehle se ek set mein tha, ye ab galat bucket mein hai.',
      },
      {
        wrong: `class Box:
    def __init__(self, w, h):
        self.w, self.h = w, h
    def __str__(self):                   # only __str__, no __repr__
        return f"{self.w}x{self.h}"`,
        right: `class Box:
    def __init__(self, w, h):
        self.w, self.h = w, h
    def __repr__(self):                  # __repr__ is the one to always define
        return f"Box({self.w}, {self.h})"`,
        why: 'Without `__repr__`, a `Box` in a list, a log line, a debugger, or a traceback shows `<Box object at 0x...>` — useless when debugging. `__str__` falls back to `__repr__` but not vice versa, so `__repr__` is the mandatory one and `__str__` is a nice-to-have for user-facing output.',
        whyHi: '`__repr__` ke bina, ek list, ek log line, ek debugger, ya ek traceback mein ek `Box` `<Box object at 0x...>` dikhaata hai — debugging mein bekaar. `__str__` `__repr__` par fallback karta hai par ulta nahi, isliye `__repr__` anivaarya hai aur `__str__` user-facing output ke liye ek nice-to-have.',
      },
    ],

    realWorld: [
      {
        en: '**Django model instances rely on these dunders** — the admin, shell, and `__repr__` in logs all want a good `__str__` (Django uses `__str__` for the display name); model `__eq__`/`__hash__` compare by primary key so `obj in queryset` and `set(queryset)` work. `@dataclass` (next lessons) generates `__repr__`/`__eq__` for you.',
        hi: '**Django model instances in dunders par nirbhar karte hain** — admin, shell, aur logs mein `__repr__` sab ek achha `__str__` chahte hain; model `__eq__`/`__hash__` primary key se compare karte hain taaki `obj in queryset` aur `set(queryset)` kaam karein.',
      },
      {
        en: '**The `__eq__`/`__hash__` pair rule causes real bugs** — a value object used as a dict key that defines `__eq__` but not `__hash__` fails at the first `{obj: ...}`; a mutable object made hashable "goes missing" from a set after mutation. Value objects should be immutable (`@dataclass(frozen=True)`) and hash on all fields.',
        hi: '**`__eq__`/`__hash__` pair niyam asli bugs deta hai** — ek dict key ki tarah istemal ek value object jo `__eq__` define karta hai par `__hash__` nahi pehle `{obj: ...}` par fail hota hai; ek mutable object jo hashable banaya gaya mutation ke baad ek set se "gaayab" ho jaata hai.',
      },
      {
        en: '**`__getitem__` and `__call__` power a lot of library APIs** — a query builder where `qs[0]` and `qs[:10]` slice, a settings object where `settings["KEY"]` works, a configured validator instance you call like `validate(value)`. DRF permission and throttle classes are callables / have `__call__`-like protocols.',
        hi: '**`__getitem__` aur `__call__` bahut library APIs ko chalate hain** — ek query builder jahaan `qs[0]` aur `qs[:10]` slice karte hain, ek settings object jahaan `settings["KEY"]` kaam karta hai, ek configured validator instance jise aap `validate(value)` ki tarah call karte ho.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the relationship between `__eq__` and `__hash__`? What happens if you define one but not the other?',
        qHi: '`__eq__` aur `__hash__` ke beech kya sambandh hai? agar aap ek define karte ho par doosra nahi to kya hota hai?',
        a: 'They are bound together by a contract that hash-based containers depend on: if two objects compare equal, they must have the same hash value. Sets and dictionaries first bucket an object by its hash, then within a bucket use equality to find an exact match. If two equal objects hashed differently, they could land in different buckets, and the container would fail to see them as the same key — you could have apparent duplicates in a set, or a dictionary lookup that misses. So Python enforces the pairing. If you define __eq__ and do not define __hash__, Python automatically sets __hash__ to None on that class, which makes instances unhashable: any attempt to put one in a set or use it as a dict key raises a TypeError. This is a deliberate safety measure — your custom __eq__ almost certainly does not agree with the default identity-based hash, so rather than let you create a broken container, Python disables hashing until you provide a consistent __hash__. The correct fix is to implement __hash__ by hashing a tuple of exactly the same fields your __eq__ compares. The reverse case — defining __hash__ but not __eq__ — is legal but unusual; you keep identity equality with a custom hash, which is rarely what you want. Two extra rules. First, if the object is mutable, making it hashable is dangerous, because if a field used in the hash changes while the object is in a set, the object is now in the wrong bucket and effectively lost; mutable objects should either stay unhashable or hash only on an immutable identifier like an id. Second, dataclasses automate this: a frozen dataclass gets a __hash__ based on its fields, and a non-frozen one with eq=True is unhashable by default, mirroring the manual rules.',
        aHi: 'Wo ek contract se bandhे hain jispar hash-based containers nirbhar karte hain: agar do objects barabar compare karte hain, unka hash value samaan hona chahiye. Sets aur dictionaries pehle ek object ko iske hash se bucket karte hain, phir ek bucket ke andar exact match dhoondhne ko equality istemal karte hain. Agar do barabar objects alag hash karte, wo alag buckets mein aa sakte hain, aur container unhe wahi key ki tarah dekhne mein fail hoga. Toh Python pairing enforce karta hai. Agar aap __eq__ define karte ho aur __hash__ define nahi karte, Python apne aap us class par __hash__ ko None set karta hai, jo instances ko unhashable banaata hai: ek ko ek set mein rakhne ya dict key ki tarah istemal karne ki koi bhi koshish ek TypeError deti hai. Ye ek jaan-boojhkar suraksha upaay hai. Sahi fix __hash__ ko bilkul un hi fields ke ek tuple ko hash karke implement karna hai jo aapka __eq__ compare karta hai. Do extra niyam: agar object mutable hai, ise hashable banaana khatarnaak hai; aur dataclasses ise automate karte hain — ek frozen dataclass ko iske fields par aadhaarit ek __hash__ milta hai.',
      },
      {
        q: 'When should you define `__repr__` vs `__str__`, and what is the difference?',
        qHi: 'Aapko `__repr__` vs `__str__` kab define karna chahiye, aur antar kya hai?',
        a: '__repr__ is for developers and __str__ is for end users, and the practical guidance follows from that. __repr__ is what you get from the repr built-in, what the interactive interpreter shows, and crucially what appears when the object is inside a container, in a log message, in a debugger variable pane, or in a traceback. Its goal is to be unambiguous: a reader should be able to tell exactly what the object is and what state it holds. The convention is to make it look like a valid constructor call that would recreate the object, for example Money open-paren five hundred close-paren, so that if it is even remotely possible, eval of the repr reconstructs it. You should define __repr__ on essentially every class you write, because the default — the class name and a hex memory address — tells you nothing when you are debugging. __str__ is what print and the str built-in and f-strings use, and it is meant to be a clean, readable, possibly lossy representation for people who are not looking at code: a formatted price, a colour hex code, a human-friendly date. It is optional. If you do not define __str__, str and print fall back to __repr__ automatically, so a good __repr__ alone is a workable baseline. You define __str__ only when the user-facing form genuinely differs from the developer form. The fallback is one-directional: __str__ falls back to __repr__, never the other way, which is another reason __repr__ is the one that is mandatory. One more detail: inside an f-string, the default conversion uses __str__, but writing the r conversion, brace-x-exclamation-r-brace, forces __repr__, which is handy in log lines.',
        aHi: '__repr__ developers ke liye hai aur __str__ end users ke liye, aur vyavhaarik maargdarshan usse aata hai. __repr__ wo hai jo aapko repr built-in se milta hai, jo interactive interpreter dikhaata hai, aur mahatvapurna roop se jo dikhta hai jab object ek container ke andar, ek log message mein, ek debugger variable pane mein, ya ek traceback mein hai. Iska lakshya asandigdh hona hai. Convention ise ek valid constructor call jaisa dikhaana hai jo object ko dobara banaaye. Aapko lagbhag har class par __repr__ define karna chahiye, kyunki default — class naam aur ek hex memory address — aapko kuch nahi bataata jab aap debug kar rahe ho. __str__ wo hai jo print aur str built-in aur f-strings istemal karte hain, aur iska matlab logon ke liye ek saaf, padhne yogya representation hona hai. Ye optional hai. Agar aap __str__ define nahi karte, str aur print apne aap __repr__ par fallback karte hain. Fallback ek-dishaayi hai: __str__ __repr__ par fallback karta hai, kabhi doosri tarah nahi.',
      },
    ],

    exercises: [
      {
        task: 'Write a `Fraction` class storing `num` and `den`. Add `__repr__` (`Fraction(3, 4)`), `__str__` (`3/4`), `__eq__` comparing cross-multiplied values (so `Fraction(1,2) == Fraction(2,4)`), and a matching `__hash__`. Verify `{Fraction(1,2), Fraction(2,4)}` has one element.',
        taskHi: 'Ek `Fraction` class likho jo `num` aur `den` store kare. `__repr__` (`Fraction(3, 4)`), `__str__` (`3/4`), cross-multiplied values compare karne waala `__eq__` (taaki `Fraction(1,2) == Fraction(2,4)`), aur ek matching `__hash__` jodo. Verify karo `{Fraction(1,2), Fraction(2,4)}` mein ek element hai.',
        hint: '`__eq__`: `self.num * other.den == other.num * self.den`. For a matching `__hash__`, reduce to lowest terms first (`g = math.gcd(num, den)`) and `hash((num // g, den // g))` so equal fractions hash the same.',
        hintHi: '`__eq__`: `self.num * other.den == other.num * self.den`. Ek matching `__hash__` ke liye, pehle lowest terms mein reduce karo (`g = math.gcd(num, den)`) aur `hash((num // g, den // g))` taaki barabar fractions same hash karein.',
      },
      {
        task: 'Write a `Playlist` class wrapping a list of song titles. Implement `__len__`, `__getitem__`, `__contains__`, `__iter__` (just `return iter(self._songs)`), and `__repr__`. Verify `len(p)`, `p[0]`, `"Yesterday" in p`, `list(p)`, and `for s in p:` all work.',
        taskHi: 'Ek `Playlist` class likho jo song titles ki ek list wrap kare. `__len__`, `__getitem__`, `__contains__`, `__iter__` (bas `return iter(self._songs)`), aur `__repr__` implement karo. Verify karo `len(p)`, `p[0]`, `"Yesterday" in p`, `list(p)`, aur `for s in p:` sab kaam karte hain.',
        hint: 'Each dunder just delegates to `self._songs`: `__len__` -> `len(self._songs)`, `__getitem__` -> `self._songs[i]`, `__contains__` -> `item in self._songs`, `__iter__` -> `iter(self._songs)`.',
        hintHi: 'Har dunder bas `self._songs` ko delegate karta hai: `__len__` -> `len(self._songs)`, `__getitem__` -> `self._songs[i]`, `__contains__` -> `item in self._songs`, `__iter__` -> `iter(self._songs)`.',
      },
      {
        task: 'Write a `RunningAverage` class that is callable: `avg = RunningAverage()`, then `avg(10)`, `avg(20)`, `avg(30)` each return the running mean (`10.0`, `15.0`, `20.0`). Implement `__call__` and `__repr__` showing the count and current average.',
        taskHi: 'Ek `RunningAverage` class likho jo callable hai: `avg = RunningAverage()`, phir `avg(10)`, `avg(20)`, `avg(30)` har ek running mean lautaaye (`10.0`, `15.0`, `20.0`). `__call__` aur `__repr__` implement karo jo count aur current average dikhaaye.',
        hint: 'In `__init__`: `self.total = 0; self.count = 0`. In `__call__(self, x)`: `self.total += x; self.count += 1; return self.total / self.count`. The instance now behaves like a stateful function.',
        hintHi: '`__init__` mein: `self.total = 0; self.count = 0`. `__call__(self, x)` mein: `self.total += x; self.count += 1; return self.total / self.count`. Instance ab ek stateful function jaisa vyavhaar karta hai.',
      },
    ],

    keyTakeaways: [
      '`__repr__` is for developers (logs, REPL, containers, tracebacks) — define it on EVERY class; aim for unambiguous, ideally a valid constructor call. `__str__` is for users (`print`, f-strings) and is optional — it falls back to `__repr__`.',
      '`__eq__` + `__hash__` are a pair: if `a == b` then `hash(a) == hash(b)` MUST hold. Define both or neither.',
      'Defining `__eq__` alone makes the class unhashable (`__hash__` set to `None`) — no set membership, no dict keys.',
      'Do not make a MUTABLE object hashable on fields that change — its hash would shift while in a set. Hash only stable identity fields, or leave it unhashable.',
      'Return `NotImplemented` (not `False`) from `__eq__`/`__lt__` for unrecognised types, so the other operand gets a chance.',
      '`@functools.total_ordering` + `__eq__` + `__lt__` gives you all six comparison operators. Sorting/`min`/`max` use `__lt__`.',
      '`__getitem__` alone provides indexing, slicing, AND iteration. Add `__len__`, `__contains__`, `__bool__` and the object feels built-in.',
      '`__call__` makes an instance callable like a function — useful for stateful/configured "functions" and class-based decorators.',
    ],
    keyTakeawaysHi: [
      '`__repr__` developers ke liye hai (logs, REPL, containers, tracebacks) — ise HAR class par define karo; asandigdh ka lakshya rakho, aadarsh roop se ek valid constructor call. `__str__` users ke liye hai (`print`, f-strings) aur optional hai — ye `__repr__` par fallback karta hai.',
      '`__eq__` + `__hash__` ek pair hain: agar `a == b` to `hash(a) == hash(b)` HONA CHAHIYE. Dono define karo ya koi nahi.',
      'Akela `__eq__` define karna class ko unhashable banaata hai (`__hash__` `None` set) — koi set membership nahi, koi dict keys nahi.',
      'Ek MUTABLE object ko un fields par hashable mat banao jo badalte hain — iska hash ek set mein rehte badal jaayega. Sirf stable identity fields hash karo, ya ise unhashable chhodo.',
      '`__eq__`/`__lt__` se anpehchaane types ke liye `NotImplemented` (`False` nahi) return karo, taaki doosre operand ko mauka mile.',
      '`@functools.total_ordering` + `__eq__` + `__lt__` aapko saare chhah comparison operators deta hai. Sorting/`min`/`max` `__lt__` istemal karte hain.',
      'Akela `__getitem__` indexing, slicing, AUR iteration deta hai. `__len__`, `__contains__`, `__bool__` jodo aur object built-in jaisa lagta hai.',
      '`__call__` ek instance ko ek function ki tarah callable banaata hai — stateful/configured "functions" aur class-based decorators ke liye upyogi.',
    ],
  },

  {
    slug: 'py-properties-and-encapsulation',
    title: 'Properties, Encapsulation, and the "No Private" Convention',
    titleHi: 'Properties, Encapsulation, Aur "Koi Private Nahi" Convention',
    description: 'Coming from a language with `private` and writing getters and setters for every field out of habit, then learning that Python has no access control and idiomatic code just uses public attributes — until a value needs validation or derivation, at which point `@property` lets you add that logic without changing how callers access it.',
    descriptionHi: 'Ek aisi bhaasha se aana jismein `private` hai aur aadat se har field ke liye getters aur setters likhna, phir seekhna ki Python mein koi access control nahi hai aur idiomatic code bas public attributes istemal karta hai — jab tak ek value ko validation ya derivation ki zaroorat na ho, jis bindu par `@property` aapko wo logic jodne deta hai bina ye badle ki callers kaise access karte hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A house with no locks, but rooms labelled "staff only".** In some buildings every door has a keycard reader that physically stops you. This building has none — anyone can walk into any room. What it has instead is signage: a plain door is "come in", a door marked with a single underscore is "staff only, enter at your own risk, we may move this room", and a door with a double underscore has had its room number scrambled in the directory so you are unlikely to wander in by accident. None of it is enforced; it is all convention and courtesy, and it works because people respect the signs. Now, `@property` is different: it is a doorway that looks exactly like a plain room from the hallway, but walking through it actually triggers a short procedure — a check, a calculation, a log entry — before you get what is inside. The value of this is that you can start with a plain room and later turn it into a procedural doorway without anyone in the hallway changing how they walk through it. So you do not pre-emptively build procedures on every door; you use plain public attributes until one genuinely needs a check or a derived value, and only then convert it.',
      hi: '**Ek ghar bina taalon ke, par kamre "sirf staff" labelled.** Kuch imaraton mein har darwaaze par ek keycard reader hai jo aapko sharirik roop se rokta hai. Is imaarat mein koi nahi — koi bhi kisi kamre mein chal kar ja sakta hai. Iske paas iske bajaye signage hai: ek plain darwaaza "andar aao" hai, ek single underscore se mark kiya darwaaza "sirf staff, apne jokhim par pravesh karo, hum is kamre ko hata sakte hain" hai, aur ek double underscore waale darwaaze ka kamra number directory mein scramble kiya gaya hai. Kuch bhi enforce nahi hai; ye sab convention aur shishtaachaar hai. Ab, `@property` alag hai: ye ek darwaaza hai jo hallway se bilkul ek plain kamre jaisa dikhta hai, par ismein se chalna asal mein ek chhoti procedure trigger karta hai — ek check, ek calculation, ek log entry — isse pehle ki aapko andar jo hai wo mile. Iski value ye hai ki aap ek plain kamre se shuru kar sakte ho aur baad mein ise ek procedural darwaaze mein badal sakte ho bina hallway mein kisi ke chalne ka tareeka badle.',
    },

    simple: `**Start with the Java habit — pointless in Python:**

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius
    def get_celsius(self):           # noise -- Python doesn't need this
        return self._celsius
    def set_celsius(self, value):
        self._celsius = value

t = Temperature(20)
t.set_celsius(25)                    # verbose
print(t.get_celsius())
\`\`\`

**Idiomatic Python: just use a public attribute**

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius       # public. done.

t = Temperature(20)
t.celsius = 25
print(t.celsius)
\`\`\`

**When you actually need logic: \`@property\` — same access, hidden behaviour**

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius       # goes through the setter below

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):            # derived, read-only -- no setter
        return self._celsius * 9 / 5 + 32

t = Temperature(20)
t.celsius = 25                       # calls the setter -> validated
print(t.fahrenheit)                  # 77.0   -- computed on access, looks like an attribute
t.celsius = -300                     # ValueError
\`\`\`

\`\`\`
NAMING CONVENTIONS (none are enforced):
  name        public. Use this by default.
  _name       "internal, don't rely on it" -- a hint to other developers only
  __name      name-mangled to _ClassName__name -- avoids ACCIDENTAL clashes in subclasses,
              NOT a security boundary
  __name__    dunder -- reserved for Python's own protocol methods; never invent your own

@property           method that is READ like an attribute: obj.x  (no parens)
@x.setter           lets obj.x = value run through a method
@x.deleter          lets del obj.x run through a method

USE @property WHEN: validation, a derived/computed value, lazy loading, logging,
                    or you need to add logic to an attribute that is already public.
DON'T bother WHEN:  the attribute is a plain value with no rules -- just leave it public.
\`\`\``,

    simpleHi: `**Java aadat se shuru — Python mein bekaar:**

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius
    def get_celsius(self):           # shor -- Python ko iski zaroorat nahi
        return self._celsius
    def set_celsius(self, value):
        self._celsius = value

t = Temperature(20)
t.set_celsius(25)                    # verbose
print(t.get_celsius())
\`\`\`

**Idiomatic Python: bas ek public attribute istemal karo**

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius       # public. ho gaya.

t = Temperature(20)
t.celsius = 25
print(t.celsius)
\`\`\`

**Jab aapko sachmuch logic chahiye: \`@property\` — wahi access, chhupa behaviour**

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius       # neeche setter se guzarta hai

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):            # derived, read-only -- koi setter nahi
        return self._celsius * 9 / 5 + 32

t = Temperature(20)
t.celsius = 25                       # setter call karta hai -> validated
print(t.fahrenheit)                  # 77.0   -- access par compute, ek attribute jaisa dikhta hai
t.celsius = -300                     # ValueError
\`\`\`

\`\`\`
NAMING CONVENTIONS (koi enforce nahi):
  name        public. Ise by default istemal karo.
  _name       "internal, ispar bharosa mat karo" -- sirf doosre developers ke liye ek sanket
  __name      name-mangled to _ClassName__name -- subclasses mein DURGHATNAAVASH clashes bachaata hai,
              ek security boundary NAHI
  __name__    dunder -- Python ke apne protocol methods ke liye reserved; kabhi apna mat banao

@property           method jo ek attribute ki tarah PADHA jaata hai: obj.x  (koi parens nahi)
@x.setter           obj.x = value ko ek method se guzarne deta hai
@x.deleter          del obj.x ko ek method se guzarne deta hai

@property ISTEMAL KARO JAB: validation, ek derived/computed value, lazy loading, logging,
                    ya aapko ek pehle se public attribute mein logic jodna hai.
MAT KARO JAB:  attribute ek plain value hai bina rules -- bas ise public chhodo.
\`\`\``,

    content: `## Why there is no \`private\`

Python's design principle is "we are all consenting adults". There is no keyword that blocks attribute access. Instead:

\`\`\`python
class Service:
    def __init__(self):
        self.url = "https://api.example.com"   # public API
        self._session = None                   # internal; may change without notice
        self.__token = "secret"                # name-mangled

s = Service()
s.url                     # fine
s._session                # works, but you were warned
s.__token                 # AttributeError!
s._Service__token         # 'secret' -- mangling is not encryption
\`\`\`

- \`_name\` is a **documentation convention**: "this is not part of the public interface; do not depend on it". Linters and \`from module import *\` respect it; the interpreter does not.
- \`__name\` (two leading underscores, at most one trailing) triggers **name mangling**: inside the class it is rewritten to \`_ClassName__name\`. Its only real purpose is preventing a subclass from *accidentally* overriding an attribute the base class relies on. It is not access control.

## \`@property\`: the getter

\`\`\`python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height       # computed every access

r = Rectangle(3, 4)
r.area           # 12   -- no parentheses; looks like a stored attribute
r.area = 20      # AttributeError: property 'area' has no setter  (read-only by default)
\`\`\`

A bare \`@property\` with no setter is a **read-only computed attribute** — exactly right for derived values (\`full_name\`, \`total_price\`, \`is_expired\`).

## Adding a setter and a deleter

\`\`\`python
class Account:
    def __init__(self, balance):
        self.balance = balance

    @property
    def balance(self):
        return self._balance

    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("balance cannot be negative")
        self._balance = value

    @balance.deleter
    def balance(self):
        raise AttributeError("cannot delete balance")
\`\`\`

Note the pattern: the public name is \`balance\` (the property), the private storage is \`_balance\`. \`__init__\` assigns \`self.balance = balance\`, which goes through the setter — so construction is validated too.

## \`functools.cached_property\` for expensive derived values

\`\`\`python
import functools

class Report:
    def __init__(self, rows):
        self.rows = rows

    @functools.cached_property
    def summary(self):
        print("  (computing summary once)")
        return expensive_aggregation(self.rows)

r = Report(data)
r.summary        # computes
r.summary        # returns the stored result, no recompute
\`\`\`

\`@property\` recomputes on every access; \`@functools.cached_property\` computes once per instance and caches the result as a normal instance attribute. Use \`cached_property\` when the value is stable for the life of the object and expensive to compute. (It requires the instance to have a \`__dict__\`, so it does not work with \`__slots__\`.)

## When NOT to use a property

\`\`\`python
# pointless -- no logic, just a pass-through:
@property
def name(self):
    return self._name
@name.setter
def name(self, value):
    self._name = value
# ^ this is a public attribute with extra steps. Just write self.name = name.
\`\`\`

Do not add a property "in case you need validation later". Adding one later is a non-breaking change — callers still write \`obj.name\`. Start with the plain attribute (YAGNI). Reach for \`@property\` when a real rule, computation, or side effect appears.`,

    contentHi: `## \`private\` kyun nahi hai

Python ka design siddhaant hai "hum sab consenting adults hain". Koi keyword nahi jo attribute access block kare. Iske bajaye:

\`\`\`python
class Service:
    def __init__(self):
        self.url = "https://api.example.com"   # public API
        self._session = None                   # internal; bina notice ke badal sakta hai
        self.__token = "secret"                # name-mangled

s = Service()
s.url                     # theek
s._session                # kaam karta hai, par aapko chetaavni di gayi thi
s.__token                 # AttributeError!
s._Service__token         # 'secret' -- mangling encryption nahi hai
\`\`\`

- \`_name\` ek **documentation convention** hai: "ye public interface ka hissa nahi hai; ispar nirbhar mat karo". Linters aur \`from module import *\` ise sammaan dete hain; interpreter nahi.
- \`__name\` (do leading underscores, zyaada se zyaada ek trailing) **name mangling** trigger karta hai: class ke andar ise \`_ClassName__name\` mein rewrite kiya jaata hai. Iska ekmatra asli maqsad ek subclass ko *durghatnaavash* ek attribute override karne se rokna hai jispar base class nirbhar karta hai.

## \`@property\`: getter

\`\`\`python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height       # har access compute

r = Rectangle(3, 4)
r.area           # 12   -- koi parentheses nahi; ek stored attribute jaisa dikhta hai
r.area = 20      # AttributeError: property 'area' has no setter  (by default read-only)
\`\`\`

Bina setter ke ek nanga \`@property\` ek **read-only computed attribute** hai — derived values ke liye bilkul sahi (\`full_name\`, \`total_price\`, \`is_expired\`).

## Ek setter aur ek deleter jodna

\`\`\`python
class Account:
    def __init__(self, balance):
        self.balance = balance

    @property
    def balance(self):
        return self._balance

    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("balance cannot be negative")
        self._balance = value

    @balance.deleter
    def balance(self):
        raise AttributeError("cannot delete balance")
\`\`\`

Pattern note karo: public naam \`balance\` hai (property), private storage \`_balance\` hai. \`__init__\` \`self.balance = balance\` assign karta hai, jo setter se guzarta hai — isliye construction bhi validated hai.

## Mehngi derived values ke liye \`functools.cached_property\`

\`\`\`python
import functools

class Report:
    def __init__(self, rows):
        self.rows = rows

    @functools.cached_property
    def summary(self):
        print("  (summary ek baar compute)")
        return expensive_aggregation(self.rows)

r = Report(data)
r.summary        # compute karta hai
r.summary        # stored result lautaata hai, koi recompute nahi
\`\`\`

\`@property\` har access recompute karta hai; \`@functools.cached_property\` prati instance ek baar compute karta hai aur result ko ek saamaanya instance attribute ki tarah cache karta hai. \`cached_property\` tab istemal karo jab value object ke jeevan bhar stable hai aur compute karne mein mehngi. (Ise instance ke paas ek \`__dict__\` hona chahiye, isliye ye \`__slots__\` ke saath kaam nahi karta.)

## Kab ek property istemal NA karein

\`\`\`python
# bekaar -- koi logic nahi, bas ek pass-through:
@property
def name(self):
    return self._name
@name.setter
def name(self, value):
    self._name = value
# ^ ye extra steps waala ek public attribute hai. Bas self.name = name likho.
\`\`\`

Ek property "agar baad mein validation chahiye to" mat jodo. Ek baad mein jodna ek non-breaking change hai — callers abhi bhi \`obj.name\` likhte hain. Plain attribute se shuru karo (YAGNI). Ek asli rule, computation, ya side effect dikhne par \`@property\` ke liye pahuncho.`,

    examples: [
      {
        title: 'The naming conventions and what name mangling actually does',
        titleHi: 'Naming conventions aur name mangling asal mein kya karta hai',
        code: `class Base:
    def __init__(self):
        self.public = 1
        self._internal = 2
        self.__mangled = 3          # becomes _Base__mangled

    def show(self):
        return self.__mangled        # inside Base, resolves to _Base__mangled

b = Base()
print(b.public)                      # 1
print(b._internal)                   # 2 -- "works", just discouraged
try:
    print(b.__mangled)
except AttributeError as e:
    print("no b.__mangled:", type(e).__name__)
print(b._Base__mangled)              # 3 -- mangling is mechanical, not secret
print(b.show())

class Child(Base):
    def __init__(self):
        super().__init__()
        self.__mangled = 99          # becomes _Child__mangled -- does NOT clash with Base's

c = Child()
print(c._Base__mangled, c._Child__mangled)   # 3 99 -- both exist, no collision`,
        output: `1
2
no b.__mangled: AttributeError
3
3
3 99`,
        explain: '`public` and `_internal` are both fully accessible — the underscore is only a signal. `__mangled` is rewritten to `_Base__mangled` by the compiler, so `b.__mangled` from outside fails but `b._Base__mangled` works. In `Child`, `self.__mangled` becomes `_Child__mangled`, a different attribute — this is the entire point of mangling: a subclass cannot accidentally clobber a base class\'s internal attribute.',
        explainHi: '`public` aur `_internal` dono poori tarah accessible hain — underscore sirf ek signal hai. `__mangled` compiler dwara `_Base__mangled` mein rewrite hota hai, isliye baahar se `b.__mangled` fail hota hai par `b._Base__mangled` kaam karta hai. `Child` mein, `self.__mangled` `_Child__mangled` ban jaata hai, ek alag attribute — yahi mangling ka poora bindu hai.',
      },
      {
        title: 'property with validation, and a read-only derived value',
        titleHi: 'validation ke saath property, aur ek read-only derived value',
        code: `class Person:
    def __init__(self, name, birth_year):
        self.name = name
        self.birth_year = birth_year      # through the setter

    @property
    def birth_year(self):
        return self._birth_year

    @birth_year.setter
    def birth_year(self, value):
        if not isinstance(value, int) or not (1900 <= value <= 2025):
            raise ValueError(f"implausible birth year: {value!r}")
        self._birth_year = value

    @property
    def age(self):
        return 2025 - self._birth_year    # derived, read-only

p = Person("Ada", 1990)
print(p.age)                              # 35
p.birth_year = 2000                       # re-validated
print(p.age)                              # 25

try:
    p.birth_year = 3000
except ValueError as e:
    print("rejected:", e)

try:
    p.age = 40
except AttributeError as e:
    print("age is read-only:", type(e).__name__)`,
        output: `35
25
rejected: implausible birth year: 3000
age is read-only: AttributeError`,
        explain: '`birth_year` is a property whose setter validates on both construction and later assignment — `p.birth_year = 3000` raises. `age` has only a getter, so it is a read-only computed attribute: `p.age = 40` fails with `AttributeError`. Callers still use plain attribute syntax (`p.age`, `p.birth_year = ...`); the validation is invisible at the call site.',
        explainHi: '`birth_year` ek property hai jiska setter construction aur baad ke assignment dono par validate karta hai — `p.birth_year = 3000` raise karta hai. `age` mein sirf ek getter hai, isliye ye ek read-only computed attribute hai: `p.age = 40` `AttributeError` se fail hota hai. Callers abhi bhi plain attribute syntax istemal karte hain; validation call site par invisible hai.',
      },
      {
        title: 'property vs cached_property: recompute vs compute-once',
        titleHi: 'property vs cached_property: recompute vs compute-once',
        code: `import functools

class Circle:
    def __init__(self, radius):
        self.radius = radius
        self._area_calls = 0

    @property
    def area(self):
        self._area_calls += 1
        return 3.14159 * self.radius ** 2

class Dataset:
    def __init__(self, values):
        self.values = values
        self._stat_calls = 0

    @functools.cached_property
    def mean(self):
        self._stat_calls += 1
        return sum(self.values) / len(self.values)

c = Circle(10)
print(c.area, c.area, c.area)
print("area computed", c._area_calls, "times")

d = Dataset([2, 4, 6, 8])
print(d.mean, d.mean, d.mean)
print("mean computed", d._stat_calls, "time(s)")

c.radius = 20
print("area after radius change:", c.area)      # property sees the new radius`,
        output: `314.159 314.159 314.159
area computed 3 times
5.0 5.0 5.0
mean computed 1 time(s)
area after radius change: 1256.636`,
        explain: '`@property area` runs its body on every access — three reads, three computations — so it always reflects the current `radius`. `@cached_property mean` runs once, stores the result on the instance, and every later access returns the stored value without recomputing. Use `property` for values that can change; `cached_property` for expensive values that are stable.',
        explainHi: '`@property area` har access apna body chalata hai — teen reads, teen computations — isliye ye hamesha current `radius` dikhaata hai. `@cached_property mean` ek baar chalta hai, result instance par store karta hai, aur har baad ka access bina recompute stored value lautaata hai. Badal sakne waali values ke liye `property`; stable mehngi values ke liye `cached_property`.',
      },
    ],

    mistakes: [
      {
        wrong: `class Config:
    def __init__(self, host):
        self._host = host
    def get_host(self):
        return self._host
    def set_host(self, value):
        self._host = value`,
        right: `class Config:
    def __init__(self, host):
        self.host = host        # public attribute; add @property later only if a rule appears`,
        why: 'Java-style getter/setter pairs with no logic are pure noise in Python. A public attribute is the idiom. If validation or derivation becomes necessary later, converting `host` to a `@property` is a non-breaking change — no caller code changes because they already write `config.host`.',
        whyHi: 'Bina logic ke Java-style getter/setter pairs Python mein shuddh shor hain. Ek public attribute idiom hai. Agar validation ya derivation baad mein zaroori ho jaata hai, `host` ko ek `@property` mein convert karna ek non-breaking change hai — koi caller code nahi badalta.',
      },
      {
        wrong: `class Vault:
    def __init__(self, secret):
        self.__secret = secret     # "private"

v = Vault("abc")
# ... developer assumes this is inaccessible and stores real credentials unencrypted`,
        right: `# name mangling is NOT security. If something must be protected,
# encrypt it or keep it out of the object entirely.
# __ is only for avoiding subclass attribute clashes.`,
        why: 'A double underscore only mangles the name to `_Vault__secret` — `v._Vault__secret` retrieves it instantly, and it shows in `vars(v)`, `pickle`, logs, and debuggers. Treating `__` as an access-control or security mechanism leads to secrets sitting in plain sight. Its real and only job is preventing accidental name collisions in inheritance.',
        whyHi: 'Ek double underscore sirf naam ko `_Vault__secret` mein mangle karta hai — `v._Vault__secret` ise turant nikaalta hai, aur ye `vars(v)`, `pickle`, logs, aur debuggers mein dikhta hai. `__` ko ek access-control ya security mechanism ki tarah maanna secrets ko saaf najar mein rakhta hai.',
      },
      {
        wrong: `class Order:
    @property
    def total(self):
        return self._total
    @total.setter
    def total(self, v):
        self._total = v            # no validation, no computation -- just a pass-through`,
        right: `class Order:
    def __init__(self):
        self.total = 0             # plain attribute -- the property added nothing`,
        why: 'A property whose getter and setter just read and write `_total` with no logic is a public attribute with three extra methods and an underscore. It adds indirection, a line count, and a slower access path for zero benefit. Only write a property when the getter computes something or the setter enforces something.',
        whyHi: 'Ek property jiska getter aur setter bas bina logic `_total` padhte aur likhte hain wo teen extra methods aur ek underscore waala ek public attribute hai. Ye indirection, ek line count, aur ek dheema access path zero faayde ke liye jodta hai. Ek property sirf tab likho jab getter kuch compute karta hai ya setter kuch enforce karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Django models use `@property` for derived fields that are not stored columns** — `full_name`, `is_published`, `discounted_price`. DRF `SerializerMethodField` is the serialization-layer version. `@cached_property` is heavily used in Django\'s own source for per-request computed values.',
        hi: '**Django models `@property` ka istemal derived fields ke liye karte hain jo stored columns nahi hain** — `full_name`, `is_published`, `discounted_price`. DRF `SerializerMethodField` serialization-layer version hai. `@cached_property` Django ke apne source mein per-request computed values ke liye bahut istemal hota hai.',
      },
      {
        en: '**The `_name` convention is how libraries mark their internals** — you will see `response._request`, `serializer._errors`, `queryset._result_cache` in Django source. Relying on a `_`-prefixed attribute of a third-party library is a known way to get broken by a minor version bump.',
        hi: '**`_name` convention aise libraries apne internals mark karti hain** — aap Django source mein `response._request`, `serializer._errors`, `queryset._result_cache` dekhoge. Ek third-party library ke `_`-prefixed attribute par nirbhar karna ek minor version bump se tootne ka ek jaana-maana tarika hai.',
      },
      {
        en: '**Adding a `@property` later is a routine non-breaking refactor** — a field starts as a plain attribute, then a business rule appears ("email must be lowercase", "price includes tax"), and you convert it to a property with a setter. No calling code changes. This is why you do not pre-build getters/setters.',
        hi: '**Baad mein ek `@property` jodna ek routine non-breaking refactor hai** — ek field ek plain attribute ki tarah shuru hota hai, phir ek business rule dikhta hai, aur aap ise ek setter waali property mein convert karte ho. Koi calling code nahi badalta. Isliye aap getters/setters pre-build nahi karte.',
      },
    ],

    interviewQA: [
      {
        q: 'Does Python have private attributes? Explain `_name`, `__name`, and name mangling.',
        qHi: 'Kya Python mein private attributes hain? `_name`, `__name`, aur name mangling samjhaao.',
        a: 'Python has no access control. There is no keyword that prevents code from reading or writing any attribute of any object; the design philosophy is that developers are trusted to respect conventions rather than being forced by the language. What exists instead is a naming convention with two levels. A single leading underscore, like _session, is purely a signal to other developers: it means this name is an implementation detail, not part of the public interface, and you should not depend on it because it may change or disappear without a deprecation. The interpreter does nothing to enforce this — you can read and write _session normally — but tools respect it: linters warn on external access, and from-module-import-star skips underscore names. A double leading underscore, like __token, with at most one trailing underscore, triggers name mangling. The compiler textually rewrites any such name inside a class body to have the class name prepended, so __token inside class Service becomes _Service__token. From outside the class, obj dot __token raises AttributeError, but obj dot _Service__token works fine, and the attribute is plainly visible in vars of the object, in pickling, in a debugger. So mangling is not privacy and definitely not security. Its actual and narrow purpose is to let a base class have internal attributes that a subclass will not accidentally override. If a base class uses self dot __cache and a subclass author, not knowing that, also uses self dot __cache, the two do not collide because they mangle to _Base__cache and _Subclass__cache respectively. The practical guidance: use plain public names by default; use a single underscore to mark internals; use double underscore rarely, only when you are writing a base class and specifically need mangling to protect an attribute from subclass clashes; and never treat any of it as a way to hide secrets.',
        aHi: 'Python mein koi access control nahi hai. Koi keyword nahi jo code ko kisi object ke kisi attribute ko padhne ya likhne se roke; design darshan ye hai ki developers par conventions ka sammaan karne ka bharosa kiya jaata hai. Iske bajaye jo maujood hai wo do levels waali ek naming convention hai. Ek single leading underscore, jaise _session, shuddh roop se doosre developers ke liye ek signal hai: iska matlab ye naam ek implementation detail hai, public interface ka hissa nahi, aur aapko ispar nirbhar nahi karna chahiye. Interpreter ise enforce karne ke liye kuch nahi karta. Ek double leading underscore, jaise __token, zyaada se zyaada ek trailing underscore ke saath, name mangling trigger karta hai. Compiler ek class body ke andar aise kisi bhi naam ko class naam prepend karne ke liye rewrite karta hai, isliye class Service ke andar __token _Service__token ban jaata hai. Class ke baahar se, obj dot __token AttributeError deta hai, par obj dot _Service__token theek kaam karta hai. Toh mangling privacy nahi hai aur nishchit roop se security nahi. Iska asli aur sankeern maqsad ek base class ko internal attributes rakhne dena hai jo ek subclass durghatnaavash override nahi karega.',
      },
      {
        q: 'When should you use `@property`, and when is it over-engineering?',
        qHi: 'Aapko `@property` kab istemal karna chahiye, aur kab ye over-engineering hai?',
        a: 'Use a property when accessing or assigning an attribute needs to do something beyond plain storage, but you want callers to keep using ordinary attribute syntax. The clear cases are: a derived value that should be computed on access rather than stored and kept in sync, like an area from width and height or a full name from first and last — you write a getter-only property and it becomes a read-only computed attribute. Validation on assignment, where a setter checks the incoming value and raises if it is out of range or the wrong type, and importantly this also validates values passed at construction if init assigns through the property. Lazy or cached computation, where the first access does expensive work and later accesses are cheap — though for that the specific tool is functools dot cached_property, which stores the result as a real instance attribute after the first call. And adding logging, change tracking, or a side effect to an attribute that is already part of a class\'s public interface, which a property lets you do without breaking any calling code. That last point is the key to the over-engineering question. Because converting a plain attribute to a property is a backward-compatible change — callers still write obj dot x and obj dot x equals y — there is no reason to add a property speculatively. Writing a getter and setter that only read and write a private backing field, with no validation and no computation, produces a public attribute with extra indirection, more lines, a slower access path, and nothing gained. That is the over-engineering. The right default is a plain public attribute, and you introduce a property at the moment a concrete rule, computation, or side effect actually appears — not before.',
        aHi: 'Ek property tab istemal karo jab ek attribute ko access ya assign karne ko plain storage se aage kuch karna hai, par aap chahte ho ki callers saamaanya attribute syntax istemal karte rahein. Spasht cases hain: ek derived value jo access par compute honi chahiye store aur sync mein rakhi jaane ke bajaye, jaise width aur height se ek area — aap ek getter-only property likhte ho aur ye ek read-only computed attribute ban jaati hai. Assignment par validation, jahaan ek setter aane waali value check karta hai aur raise karta hai agar ye range ke baahar hai, aur mahatvapurna roop se ye construction par pass ki gayi values ko bhi validate karta hai agar init property ke zariye assign karta hai. Lazy ya cached computation — haalaanki uske liye vishesh tool functools dot cached_property hai. Aur ek aise attribute mein logging ya ek side effect jodna jo pehle se ek class ke public interface ka hissa hai. Wo aakhri bindu over-engineering sawaal ki kunji hai. Kyunki ek plain attribute ko ek property mein convert karna ek backward-compatible change hai, ek property speculatively jodne ka koi kaaran nahi. Sahi default ek plain public attribute hai.',
      },
    ],

    exercises: [
      {
        task: 'Write a `Password` class. Store the value in `_hash` (just use `hash(value)` for the exercise). Expose a write-only-ish interface: a `value` setter that rejects passwords shorter than 8 chars, and a `matches(candidate)` method. There should be NO getter for the raw password. Test that `p.value = "short"` raises and `p.matches("correcthorse")` works.',
        taskHi: 'Ek `Password` class likho. Value ko `_hash` mein store karo (exercise ke liye bas `hash(value)` istemal karo). Ek write-only-ish interface expose karo: ek `value` setter jo 8 chars se chhote passwords reject kare, aur ek `matches(candidate)` method. Raw password ke liye KOI getter nahi hona chahiye. Test karo ki `p.value = "short"` raise karta hai aur `p.matches("correcthorse")` kaam karta hai.',
        hint: '`@property def value(self): raise AttributeError("write-only")` then `@value.setter` that checks `len` and stores `hash(v)` in `self._hash`. `matches` compares `hash(candidate) == self._hash`.',
        hintHi: '`@property def value(self): raise AttributeError("write-only")` phir `@value.setter` jo `len` check kare aur `self._hash` mein `hash(v)` store kare. `matches` `hash(candidate) == self._hash` compare karta hai.',
      },
      {
        task: 'Write a `Rectangle` with plain public `width` and `height`, and `@property` values `area` and `perimeter` (read-only, computed). Add a `@property` `is_square`. Verify changing `width` immediately changes all three derived values. Confirm `r.area = 10` raises `AttributeError`.',
        taskHi: 'Ek `Rectangle` likho plain public `width` aur `height`, aur `@property` values `area` aur `perimeter` (read-only, computed) ke saath. Ek `@property` `is_square` jodo. Verify karo `width` badalne se turant teenon derived values badalti hain. Confirm karo `r.area = 10` `AttributeError` deta hai.',
        hint: 'All three properties are getter-only: `return self.width * self.height`, `return 2 * (self.width + self.height)`, `return self.width == self.height`. Because they compute on access, they always reflect the current `width`/`height`.',
        hintHi: 'Teenon properties getter-only hain: `return self.width * self.height`, `return 2 * (self.width + self.height)`, `return self.width == self.height`. Kyunki wo access par compute karti hain, wo hamesha current `width`/`height` dikhaati hain.',
      },
      {
        task: 'Start with `class Email: def __init__(self, address): self.address = address` (plain attribute). Now a rule appears: addresses must contain "@" and are stored lowercased. Convert `address` to a `@property` with a validating, normalising setter — WITHOUT changing the `__init__` line or any calling code. Show `Email("Foo@BAR.com").address` is `"foo@bar.com"`.',
        taskHi: '`class Email: def __init__(self, address): self.address = address` (plain attribute) se shuru karo. Ab ek rule dikhta hai: addresses mein "@" hona chahiye aur lowercased store hote hain. `address` ko ek validating, normalising setter waali `@property` mein convert karo — `__init__` line ya koi calling code badle BINA. Dikhao `Email("Foo@BAR.com").address` `"foo@bar.com"` hai.',
        hint: 'The `__init__` line `self.address = address` now routes through the new setter. Setter: `if "@" not in value: raise ValueError(...)`; `self._address = value.lower()`. Getter: `return self._address`. This is the "add a property later, break nothing" pattern.',
        hintHi: '`__init__` line `self.address = address` ab naye setter se route hoti hai. Setter: `if "@" not in value: raise ValueError(...)`; `self._address = value.lower()`. Getter: `return self._address`. Ye "baad mein ek property jodo, kuch mat todo" pattern hai.',
      },
    ],

    keyTakeaways: [
      'Python has NO access control. `_name` is a "please treat as internal" convention (tools respect it, the interpreter does not). `__name` triggers name mangling to `_ClassName__name`.',
      'Name mangling is NOT privacy or security — `obj._ClassName__name` retrieves it, and it shows in `vars()`, pickle, and debuggers. Its only job is preventing accidental attribute clashes between a base class and subclasses.',
      'Idiomatic Python uses plain public attributes. Do NOT write Java-style getter/setter pairs with no logic.',
      '`@property` makes a method readable as an attribute (`obj.x`, no parens). A getter-only property is a read-only computed attribute — ideal for derived values.',
      'Add `@x.setter` for validated assignment; if `__init__` assigns `self.x = ...`, construction is validated too. `@x.deleter` handles `del`.',
      '`@property` recomputes on every access. `@functools.cached_property` computes once per instance and stores the result — use it for expensive, stable values (needs `__dict__`, so not with `__slots__`).',
      'Converting a plain attribute to a `@property` later is a NON-breaking change — callers still write `obj.x`. So start plain (YAGNI); add the property when a real rule/computation/side-effect appears.',
      'A property whose getter/setter just pass through to `_x` with no logic is pointless indirection — delete it and use a public attribute.',
    ],
    keyTakeawaysHi: [
      'Python mein KOI access control nahi. `_name` ek "kripya internal maano" convention hai (tools sammaan dete hain, interpreter nahi). `__name` `_ClassName__name` mein name mangling trigger karta hai.',
      'Name mangling privacy ya security NAHI hai — `obj._ClassName__name` ise nikaalta hai, aur ye `vars()`, pickle, aur debuggers mein dikhta hai. Iska ekmatra kaam ek base class aur subclasses ke beech durghatnaavash attribute clashes rokna hai.',
      'Idiomatic Python plain public attributes istemal karta hai. Bina logic ke Java-style getter/setter pairs MAT likho.',
      '`@property` ek method ko ek attribute ki tarah readable banaata hai (`obj.x`, koi parens nahi). Ek getter-only property ek read-only computed attribute hai — derived values ke liye aadarsh.',
      'Validated assignment ke liye `@x.setter` jodo; agar `__init__` `self.x = ...` assign karta hai, construction bhi validated hai. `@x.deleter` `del` handle karta hai.',
      '`@property` har access recompute karta hai. `@functools.cached_property` prati instance ek baar compute karta hai aur result store karta hai — mehngi, stable values ke liye istemal karo (`__dict__` chahiye, isliye `__slots__` ke saath nahi).',
      'Ek plain attribute ko baad mein ek `@property` mein convert karna ek NON-breaking change hai — callers abhi bhi `obj.x` likhte hain. Isliye plain shuru karo (YAGNI); rule/computation/side-effect dikhne par property jodo.',
      'Ek property jiske getter/setter bas bina logic `_x` par pass-through karte hain wo bekaar indirection hai — ise delete karo aur ek public attribute istemal karo.',
    ],
  },
];
