/**
 * Django Complete Course — Module 3: QuerySets, Query Optimization & the N+1 Problem, lessons 1-3.
 *
 * Lesson 1: QuerySet laziness & result caching — no SQL until evaluation, what
 *           triggers it, _result_cache, exists()/count() vs len(list()), iterator().
 * Lesson 2: filtering with field lookups, Q, and F — lookups & relation spanning,
 *           Q for OR/NOT, F for column refs + atomic updates, .filter().filter()
 *           vs one .filter() for multi-valued relations.
 * Lesson 3: select_related & prefetch_related — the N+1 problem, JOIN vs 2nd
 *           query, Prefetch(queryset=), nesting, to_attr.
 *
 * NOTE for future editors: same conventions as course-django-module2.ts.
 *  - Every backtick inside simple/simpleHi/content/contentHi is `\``.
 *  - `$` before `{` in template literals -> `\${`.
 *  - `examples` use `code` + `output`, ASCII-only output, run with `python`.
 *  - Boot standalone Django; models get `class Meta: app_label = "__main__"`;
 *    tables via `connection.schema_editor()`. Count queries with
 *    `from django.test.utils import CaptureQueriesContext` +
 *    `with CaptureQueriesContext(connection) as ctx: ...; len(ctx.captured_queries)`.
 *  - Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_3: CourseLesson[] = [
  {
    slug: 'dj-queryset-laziness-and-caching',
    title: 'QuerySet Laziness & Result Caching',
    titleHi: 'QuerySet Laziness Aur Result Caching',
    description: 'A QuerySet is a description of a query, not the rows. It runs no SQL until you force it to — by iterating, calling `list()`, `len()`, `bool()`, or slicing. Once evaluated it caches its rows on itself. Knowing exactly what triggers the query is how you stop firing the same SELECT three times per request.',
    descriptionHi: 'Ek QuerySet ek query ka description hai, rows nahi. Ye koi SQL nahi chalाता jab tak aap ise majboor na karो — iterate karके, `list()`, `len()`, `bool()` call karके, ya slice karके. Ek baar evaluate hone par ye apni rows khud par cache karता hai. Bilkul kya query trigger karता hai jaanna aise aap wahi SELECT prati request teen baar chalाना band karते ho.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A build-your-own-order slip at a deli counter, not the sandwich.** When you write `Article.objects.filter(status="published").order_by("-date")` you are ticking boxes on an order slip: "published only", "newest first". Nothing has been made. You can keep adding conditions to the same slip (`.filter(author=me)`) and it is still just paper. The kitchen only fires when you actually *ask for the food*: you take a bite (iterate in a `for` loop), you ask "how many?" (`len()`), you ask "is there any?" (`bool()` / an `if`), or you say "give me the whole tray" (`list()`). At that moment the slip goes to the kitchen once, and the finished sandwiches are set on *your* tray — so a second bite from the same tray costs nothing. But if you tear off a fresh slip that copies the old one and adds a pickle (`.filter(...)` again), that is a new order and the kitchen fires again. And `.count()` and `.exists()` are asking the kitchen a question through the hatch ("how many published?", "any published?") without ever plating the food — cheaper than getting the tray just to measure it.',
      hi: '**Ek deli counter par build-your-own-order slip, sandwich nahi.** Jab aap `Article.objects.filter(status="published").order_by("-date")` likhते ho aap ek order slip par boxes tick kar rahe ho: "sirf published", "newest first". Kuch banा nahi. Aap usi slip mein conditions jodते rah sakte ho aur ye abhi bhi bस kaagaz hai. Kitchen tabhi fire hoती hai jab aap asal mein *khaana maangते ho*: aap ek bite lete ho (`for` loop mein iterate), aap poochते ho "kितne?" (`len()`), aap poochते ho "koi hai?" (`bool()` / ek `if`), ya aap kehते ho "poori tray do" (`list()`). Us pal slip kitchen ko ek baar jाता hai, aur finished sandwiches *aapki* tray par rakhे jाते hain — toh usi tray se ek doosra bite kuch nahi cost karता. Par agar aap ek fresh slip phadते ho jо purane ko copy karता hai (`.filter(...)` phir se), wo ek naya order hai. Aur `.count()` aur `.exists()` kitchen se hatch ke through ek sawaal poochna hai bina food plate kiye.',
    },

    simple: `**A QuerySet does nothing until you evaluate it**

\`\`\`python
qs = Article.objects.filter(status="published")   # NO SQL yet
qs = qs.order_by("-published_at")                  # NO SQL -- returns a new QuerySet
qs = qs.exclude(author__is_banned=True)            # NO SQL

# SQL runs on the FIRST of these:
for a in qs: ...          # iteration
list(qs)                  # list()
len(qs)                   # len()  (loads all rows, then counts them in Python)
bool(qs) / if qs:         # bool()
qs[5]                     # indexing
qs[2:5]                   # slicing WITHOUT a step  (adds LIMIT/OFFSET, still lazy until eval)
qs[::2]                   # slicing WITH a step  -> evaluates immediately
repr(qs)                  # the shell printing it
pickle.dumps(qs)          # pickling
\`\`\`

**Evaluation caches the rows ON the QuerySet object**

\`\`\`python
qs = Article.objects.filter(status="published")

list(qs)          # query #1 -- rows cached on qs._result_cache
list(qs)          # NO query -- served from the cache
for a in qs: ...  # NO query -- same cache
qs.count()        # FRESH qs -> its own COUNT(*) query.  After list(qs), count() uses the cache.

qs2 = qs.filter(featured=True)   # a NEW QuerySet -- empty cache -- will run its own query
\`\`\`

**Ask the database the right question**

\`\`\`python
# "are there any?"
if Article.objects.filter(status="draft").exists():   # SELECT 1 ... LIMIT 1   -- cheap
if len(Article.objects.filter(status="draft")):        # SELECT * ...  loads every row -- wasteful
if Article.objects.filter(status="draft"):             # SELECT * ...  same waste (unless cache exists)

# "how many?"
Article.objects.filter(status="published").count()     # SELECT COUNT(*)   -- cheap
len(list(Article.objects.filter(status="published")))  # loads all rows into Python   -- wasteful

# BUT if you are going to iterate the rows anyway, DON'T also call count()/exists():
articles = list(qs)          # one query
count = len(articles)        # free -- already in memory
has_any = bool(articles)     # free
\`\`\`

**Streaming huge result sets: \`.iterator()\`**

\`\`\`python
for row in Article.objects.all().iterator(chunk_size=2000):
    process(row)     # rows streamed from the DB in chunks; NOT cached on the queryset
                     # -> constant memory, but re-iterating runs the query again
\`\`\`

\`\`\`
LAZY (no SQL, returns a new QuerySet):  filter exclude order_by annotate select_related
                                         prefetch_related values values_list only defer reverse
                                         distinct none all  + slicing without a step
EAGER (runs SQL now):  iteration, list(), len(), bool()/if, indexing qs[i], slice-with-step,
                        repr(), pickle, .get() .first() .last() .earliest() .latest()
                        .count() .exists() .aggregate() .exists() .in_bulk() .create()
                        .update() .delete() .bulk_create()

CACHE:  full evaluation stores rows on  qs._result_cache ; re-use is free.
        .count()/.exists() are their OWN queries and don't populate/use that cache.
        a new QuerySet from  qs.filter(...)  has an EMPTY cache.
        .iterator()  bypasses the cache (streams, constant memory, re-runs on re-iterate).
\`\`\``,

    simpleHi: `**Ek QuerySet kuch nahi karता jab tak aap ise evaluate na karो**

\`\`\`python
qs = Article.objects.filter(status="published")   # abhi KOI SQL nahi
qs = qs.order_by("-published_at")                  # KOI SQL nahi -- ek naya QuerySet lautाता hai
qs = qs.exclude(author__is_banned=True)            # KOI SQL nahi

# SQL inmें se PEHLE par chalता hai:
for a in qs: ...          # iteration
list(qs)                  # list()
len(qs)                   # len()  (saari rows load, phir Python mein count)
bool(qs) / if qs:         # bool()
qs[5]                     # indexing
qs[2:5]                   # slicing BINA step ke
qs[::2]                   # slicing STEP ke saath  -> turant evaluate
repr(qs)                  # shell ise print karता
\`\`\`

**Evaluation rows ko QuerySet object PAR cache karता hai**

\`\`\`python
qs = Article.objects.filter(status="published")

list(qs)          # query #1 -- rows qs._result_cache par cached
list(qs)          # KOI query nahi -- cache se
for a in qs: ...  # KOI query nahi -- wahi cache
qs.count()        # FRESH qs -> apni COUNT(*) query.  list(qs) ke baad, count() cache istemal karता hai.

qs2 = qs.filter(featured=True)   # ek NAYA QuerySet -- empty cache -- apni query chalाega
\`\`\`

**Database se sahi sawaal poochो**

\`\`\`python
# "koi hai?"
if Article.objects.filter(status="draft").exists():   # SELECT 1 ... LIMIT 1   -- sasta
if len(Article.objects.filter(status="draft")):        # SELECT * ...  har row load -- barbaad

# "kितne?"
Article.objects.filter(status="published").count()     # SELECT COUNT(*)   -- sasta
len(list(Article.objects.filter(status="published")))  # saari rows Python mein -- barbaad

# PAR agar aap rows waise bhi iterate karोge, count()/exists() BHI mat call karो:
articles = list(qs)          # ek query
count = len(articles)        # muft -- pehle se memory mein
has_any = bool(articles)     # muft
\`\`\`

**Bade result sets stream karna: \`.iterator()\`**

\`\`\`python
for row in Article.objects.all().iterator(chunk_size=2000):
    process(row)     # rows DB se chunks mein streamed; queryset par cached NAHI
\`\`\`

\`\`\`
LAZY (koi SQL nahi, ek naya QuerySet):  filter exclude order_by annotate select_related
                                         prefetch_related values values_list only defer
                                         distinct none all  + step-rahit slicing
EAGER (ab SQL chalाता hai):  iteration, list(), len(), bool()/if, indexing qs[i], step-slice,
                              repr(), pickle, .get() .first() .last()
                              .count() .exists() .aggregate() .in_bulk() .create() .update() .delete()

CACHE:  poora evaluation rows ko  qs._result_cache  par store karता hai; re-use muft.
        .count()/.exists() apni queries hain aur us cache ko populate/use nahi karते.
        qs.filter(...)  se ek naya QuerySet ka cache KHALI hai.
        .iterator()  cache bypass karта hai (streams, constant memory).
\`\`\``,

    content: `## What a QuerySet is

\`Article.objects.filter(...)\` returns a \`QuerySet\` — an object that holds the *description* of a query (the model, the filters, the ordering, the fields, the related-object strategy). It carries **no rows**. Every method that returns a QuerySet (\`filter\`, \`exclude\`, \`order_by\`, \`annotate\`, \`select_related\`, \`values\`, ...) returns a **new** QuerySet with the extra clause added; the original is unchanged. This is why you can build a query up in stages, pass a base queryset around, and add per-caller filters.

## Evaluation — when the SQL actually runs

A QuerySet executes its SQL the first time you do something that needs the rows:

- **Iteration**: \`for obj in qs\`, a comprehension over it, \`*qs\`.
- **\`list(qs)\`** — materialise all rows.
- **\`len(qs)\`** — loads all rows, then counts the Python list. (Use \`.count()\` if you do not need the rows.)
- **\`bool(qs)\`** / \`if qs:\` / \`or\`/\`and\` — loads at least one row. (Use \`.exists()\`.)
- **Indexing** \`qs[3]\` and **step-slicing** \`qs[::2]\` — run immediately. **Plain slicing** \`qs[2:5]\` returns a new lazy QuerySet with \`LIMIT\`/\`OFFSET\` applied.
- **\`repr(qs)\`** — the shell/print evaluates a slice for display.
- **\`pickle.dumps(qs)\`** — pickling forces full evaluation.
- Terminal methods that return a value, not a QuerySet: \`.get()\`, \`.first()\`, \`.last()\`, \`.earliest()\`, \`.latest()\`, \`.count()\`, \`.exists()\`, \`.aggregate()\`, \`.in_bulk()\`, \`.exists()\`, and the write methods \`.create()\`, \`.update()\`, \`.delete()\`, \`.bulk_create()\`.

## Result caching

When a QuerySet is **fully evaluated** (iterated or \`list()\`-ed), it stores the resulting model instances on \`qs._result_cache\`. After that:

\`\`\`python
qs = Article.objects.all()
list(qs)          # 1 query, rows cached
for a in qs:      # 0 queries -- from cache
    ...
[a.title for a in qs]   # 0 queries
\`\`\`

The cache belongs to that **exact QuerySet object**. These do **not** share it:

- A new QuerySet from a method call: \`qs.filter(x=1)\` — different object, empty cache.
- \`qs.count()\` — issues \`SELECT COUNT(*)\`; it neither reads nor fills \`_result_cache\`. So \`list(qs); qs.count()\` is **two** queries.
- \`qs.exists()\` — issues \`SELECT 1 ... LIMIT 1\`; also independent — *unless* \`_result_cache\` is already populated, in which case \`exists()\` and \`count()\` use it.

The practical rule: **decide once whether you need the rows.**

- Need the rows and the count/existence -> evaluate once (\`rows = list(qs)\`), then \`len(rows)\` / \`bool(rows)\` are free.
- Need only "how many" -> \`.count()\`.
- Need only "any?" -> \`.exists()\`.
- Never \`len(list(qs))\` for a count, never \`if list(qs):\` for existence.

## Re-use vs re-query

\`\`\`python
def get_base_qs():
    return Article.objects.filter(published=True)

# each call builds a fresh QuerySet -> each will run its own SQL when evaluated
list(get_base_qs())          # query
list(get_base_qs())          # another query

# to reuse results, evaluate ONCE and keep the list:
articles = list(get_base_qs())
\`\`\`

Templates are a classic trap: \`{% if articles %}...{% for a in articles %}\` — if \`articles\` is a QuerySet, the \`{% if %}\` triggers a \`bool()\` evaluation and the \`{% for %}\` triggers full evaluation, but Django's template engine is smart enough to reuse the cache here. However \`{{ articles.count }}\` in the same template issues a separate \`COUNT(*)\`. Pass a \`list\` to the template if you need count + iteration.

## \`.iterator()\` — for result sets too big to hold

\`\`\`python
for article in Article.objects.all().iterator(chunk_size=2000):
    export(article)
\`\`\`

\`.iterator()\` streams rows from the database in server-side batches (\`chunk_size\`) and **does not populate \`_result_cache\`**. Memory stays flat regardless of row count — essential for a report over millions of rows or a data migration. The trade-off: iterating the same queryset again re-runs the query, and \`prefetch_related\` needs \`chunk_size\` tuning (it works with \`.iterator()\` from Django 4.1+). Module 8 covers large-data patterns in full.

## \`none()\` and \`.all()\`

\`Model.objects.none()\` is an always-empty QuerySet (an \`EmptyQuerySet\`) that still has the right type and methods — useful as a default return (e.g. in a DRF \`get_queryset\` for an anonymous user). \`qs.all()\` returns a **copy** of the queryset with a cleared cache — occasionally used to force a re-query.`,

    contentHi: `## Ek QuerySet kya hai

\`Article.objects.filter(...)\` ek \`QuerySet\` lautाता hai — ek object jо query ka *description* rakhता hai. Ismें **koi rows nahi**. Har method jо ek QuerySet lautाता hai ek **naya** QuerySet lautाता hai extra clause ke saath; original nahi badalता.

## Evaluation — SQL asal mein kab chalता hai

Ek QuerySet apna SQL pehli baar chalाता hai jab aap kuch aisा karते ho jise rows chahिए:

- **Iteration**: \`for obj in qs\`, ek comprehension, \`*qs\`.
- **\`list(qs)\`** — saari rows materialise.
- **\`len(qs)\`** — saari rows load, phir Python list count. (\`.count()\` istemal karो agar rows nahi chahिए.)
- **\`bool(qs)\`** / \`if qs:\` — kam se kam ek row load. (\`.exists()\` istemal karो.)
- **Indexing** \`qs[3]\` aur **step-slicing** \`qs[::2]\` — turant chalते hain. **Plain slicing** \`qs[2:5]\` ek naya lazy QuerySet lautाता hai.
- **\`repr(qs)\`**, **\`pickle.dumps(qs)\`**.
- Terminal methods: \`.get()\`, \`.first()\`, \`.count()\`, \`.exists()\`, \`.aggregate()\`, aur write methods.

## Result caching

Jab ek QuerySet **poori tarah evaluate** hoता hai, ye resulting model instances ko \`qs._result_cache\` par store karता hai. Uske baad iteration se 0 queries.

Cache us **exact QuerySet object** ka hai. Ye ise share **nahi** karते:

- \`qs.filter(x=1)\` — alag object, empty cache.
- \`qs.count()\` — \`SELECT COUNT(*)\` issue karता hai; ye \`_result_cache\` na padhता na bharता. Toh \`list(qs); qs.count()\` **do** queries hai.
- \`qs.exists()\` — \`SELECT 1 ... LIMIT 1\`; bhi swतंत्r — *jab tak* \`_result_cache\` pehle se populated na ho.

Vyavhaarik niyam: **ek baar tay karो kya aapko rows chahिए.**

- Rows + count/existence chahिए -> ek baar evaluate karो (\`rows = list(qs)\`), phir \`len(rows)\` / \`bool(rows)\` muft.
- Sirf "kितne" -> \`.count()\`.
- Sirf "koi?" -> \`.exists()\`.
- Count ke liye kabhi \`len(list(qs))\` nahi, existence ke liye kabhi \`if list(qs):\` nahi.

## Re-use vs re-query

\`\`\`python
def get_base_qs():
    return Article.objects.filter(published=True)

list(get_base_qs())          # query
list(get_base_qs())          # doosri query

articles = list(get_base_qs())   # results reuse karने ke liye EK BAAR evaluate karो
\`\`\`

## \`.iterator()\` — bade result sets ke liye

\`\`\`python
for article in Article.objects.all().iterator(chunk_size=2000):
    export(article)
\`\`\`

\`.iterator()\` rows ko DB se server-side batches mein stream karता hai aur \`_result_cache\` **populate nahi karता**. Memory flat rehती hai. Module 8 bade-data patterns cover karता hai.

## \`none()\` aur \`.all()\`

\`Model.objects.none()\` ek hamesha-khali QuerySet hai — ek default return ki tarah useful. \`qs.all()\` ek cleared cache ke saath queryset ki ek **copy** lautाता hai.`,

    examples: [
      {
        title: 'Building a query runs no SQL; evaluating it does, once',
        titleHi: 'Ek query banाना koi SQL nahi chalाता; ise evaluate karna chalाता hai, ek baar',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection, reset_queries
from django.test.utils import CaptureQueriesContext

class Article(models.Model):
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=20, default="draft")
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Article)
Article.objects.bulk_create([
    Article(title=f"A{i}", status="published" if i % 2 else "draft") for i in range(10)
])

with CaptureQueriesContext(connection) as ctx:
    qs = Article.objects.filter(status="published")   # no SQL
    qs = qs.order_by("-title")                         # no SQL
    qs = qs.exclude(title="A9")                        # no SQL
print("queries after building the QuerySet:", len(ctx.captured_queries))

with CaptureQueriesContext(connection) as ctx:
    rows = list(qs)             # <-- SQL runs here
    again = list(qs)            # <-- served from cache, no SQL
    for a in qs: pass           # <-- cache, no SQL
    titles = [a.title for a in qs]   # <-- cache, no SQL
print("queries after evaluating + re-iterating:", len(ctx.captured_queries))
print("rows:", [a.title for a in rows])`,
        output: `queries after building the QuerySet: 0
queries after evaluating + re-iterating: 1
rows: ['A7', 'A5', 'A3', 'A1']
`,
        explain: 'Chaining `.filter()`, `.order_by()`, `.exclude()` builds up a `QuerySet` object and issues **zero** SQL — each call returns a new lazy QuerySet. The database is not touched until `list(qs)` forces evaluation, which runs exactly **one** `SELECT`. After that, the rows are cached on `qs`, so the second `list(qs)`, the `for` loop, and the comprehension all reuse the cache and issue no further queries. `CaptureQueriesContext` records every SQL statement Django runs — the standard tool for verifying query counts.',
        explainHi: '`.filter()`, `.order_by()`, `.exclude()` chain karna ek `QuerySet` object banाता hai aur **zero** SQL issue karта hai — har call ek naya lazy QuerySet lautाता hai. Database tab tak nahi chhua jaता jab tak `list(qs)` evaluation majboor na kare, jо bilkul **ek** `SELECT` chalाता hai. Uske baad, rows `qs` par cached hain, toh doosra `list(qs)`, `for` loop, aur comprehension sab cache reuse karते hain.',
      },
      {
        title: 'exists() and count() vs len(list()) -- ask the DB the cheap question',
        titleHi: 'exists() aur count() vs len(list()) -- DB se sasta sawaal poochो',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.test.utils import CaptureQueriesContext

class Order(models.Model):
    status = models.CharField(max_length=20)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Order)
Order.objects.bulk_create([Order(status="paid") for _ in range(500)] +
                          [Order(status="refunded") for _ in range(3)])

def sql_of(fn):
    with CaptureQueriesContext(connection) as ctx:
        fn()
    return ctx.captured_queries[-1]["sql"]

# "any refunds?"
print("exists():", sql_of(lambda: Order.objects.filter(status="refunded").exists())[:55])
print("bool(qs):", sql_of(lambda: bool(Order.objects.filter(status="refunded")))[:55])

# "how many paid?"
print("count():  ", sql_of(lambda: Order.objects.filter(status="paid").count())[:55])

# the wasteful version -- loads all 500 rows into Python just to count them
with CaptureQueriesContext(connection) as ctx:
    n = len(list(Order.objects.filter(status="paid")))
print(f"len(list()) loaded {n} rows; sql:", ctx.captured_queries[-1]["sql"][:55])

# if you need the rows AND the count, evaluate ONCE:
with CaptureQueriesContext(connection) as ctx:
    rows = list(Order.objects.filter(status="paid"))
    total = len(rows)        # free
    has_any = bool(rows)     # free
print("rows+count+exists in", len(ctx.captured_queries), "query; total =", total)`,
        output: `exists(): SELECT 1 AS "a" FROM "__main___order" WHERE "__main___o
bool(qs): SELECT "__main___order"."id", "__main___order"."status"
count():   SELECT COUNT(*) AS "__count" FROM "__main___order" WHER
len(list()) loaded 500 rows; sql: SELECT "__main___order"."id", "__main___order"."status"
rows+count+exists in 1 query; total = 500
`,
        explain: '`.exists()` compiles to `SELECT (1) ... LIMIT 1` — the database stops at the first matching row. `bool(qs)` and `len(list(qs))` instead run `SELECT <all columns> ...` and pull every matching row into Python — 500 objects built just to check a length. `.count()` compiles to `SELECT COUNT(*)`, computed in the database. The rule: use `.exists()` for "any?", `.count()` for "how many?", and if you are going to iterate the rows anyway, evaluate once into a list and get the count/existence from that list for free.',
        explainHi: '`.exists()` `SELECT (1) ... LIMIT 1` mein compile hoता hai — database pehli matching row par ruk jाता hai. `bool(qs)` aur `len(list(qs))` iske bजाय `SELECT <saare columns> ...` chalाते hain aur har matching row Python mein khींchते hain — 500 objects bस length check karने ko banे. `.count()` `SELECT COUNT(*)` mein compile hoता hai. Niyam: "koi?" ke liye `.exists()`, "kितne?" ke liye `.count()`.',
      },
      {
        title: 'count()/exists() on a FRESH queryset run their own query; on an evaluated one they use the cache',
        titleHi: 'FRESH queryset par count()/exists() apni query chalाते hain; evaluated par cache istemal karते hain',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.test.utils import CaptureQueriesContext

class Task(models.Model):
    title = models.CharField(max_length=100)
    done = models.BooleanField(default=False)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Task)
Task.objects.bulk_create([Task(title=f"T{i}", done=(i % 3 == 0)) for i in range(30)])

# A. a FRESH (un-evaluated) queryset: count() and exists() each issue their own query
with CaptureQueriesContext(connection) as ctx:
    Task.objects.filter(done=False).count()      # SELECT COUNT(*)
    Task.objects.filter(done=False).exists()     # SELECT 1 ... LIMIT 1
print("A. fresh count() + exists():", len(ctx.captured_queries), "queries")

# B. an ALREADY-EVALUATED queryset: count()/exists() use the cached rows -> 0 extra
qs = Task.objects.filter(done=False)
with CaptureQueriesContext(connection) as ctx:
    list(qs)            # query 1: rows cached on qs
    list(qs)            # cache -> 0
    for t in qs: pass   # cache -> 0
    qs.count()          # cache -> 0  (qs is already evaluated)
    qs.exists()         # cache -> 0
print("B. list()x2 + loop + count() + exists() on ONE evaluated qs:",
      len(ctx.captured_queries), "query")

# C. a re-filtered queryset is a NEW object with an empty cache
with CaptureQueriesContext(connection) as ctx:
    done_qs = qs.filter(done=True)   # a NEW QuerySet -- qs's cache does not carry over
    list(done_qs)                    # its own query
print("C. re-filtered queryset list():", len(ctx.captured_queries), "query")

# the safe habit: if you need rows + count, evaluate ONCE
with CaptureQueriesContext(connection) as ctx:
    rows = list(Task.objects.filter(done=False))
    print("   pending count (free from the list):", len(rows))
print("D. evaluate-once:", len(ctx.captured_queries), "query")`,
        output: `A. fresh count() + exists(): 2 queries
B. list()x2 + loop + count() + exists() on ONE evaluated qs: 1 query
C. re-filtered queryset list(): 1 query
   pending count (free from the list): 20
D. evaluate-once: 1 query
`,
        explain: 'On a FRESH queryset, `.count()` issues `SELECT COUNT(*)` and `.exists()` issues `SELECT 1 ... LIMIT 1` — two separate queries (A). But once a queryset has been FULLY evaluated (via `list()` or iteration), its rows are cached, and `.count()`/`.exists()` on that same object use the cached list — zero extra queries (B). A re-filtered queryset (`qs.filter(...)`) is a brand-new object with an empty cache, so it runs its own query (C). The reliable habit: if you need the rows *and* a count/existence check, `list()` once and derive both from that list (D) — you never have to reason about whether the cache is warm.',
        explainHi: 'Ek FRESH queryset par, `.count()` `SELECT COUNT(*)` issue karता hai aur `.exists()` `SELECT 1 ... LIMIT 1` — do alag queries (A). Par ek baar ek queryset POORI TARAH evaluate ho gaya (`list()` ya iteration se), iski rows cached hain, aur us hi object par `.count()`/`.exists()` cached list istemal karते hain — zero extra queries (B). Ek re-filtered queryset (`qs.filter(...)`) ek bilkul naya object hai empty cache ke saath (C). Vishwasniya aadat: agar aapko rows *aur* ek count/existence check chahिए, ek baar `list()` karो aur dono us list se derive karो (D).',
      },
    ],

    mistakes: [
      {
        wrong: `articles = Article.objects.filter(status="published")
if len(articles) > 0:                 # loads every published article
    print(f"showing {len(articles)} articles")   # ... a SECOND full load if not cached
for a in articles:                    # cached now, but you already paid twice
    render(a)`,
        right: `articles = list(Article.objects.filter(status="published"))   # one query, one load
if articles:
    print(f"showing {len(articles)} articles")   # free -- in memory
for a in articles:
    render(a)`,
        why: 'Each `len(qs)` on an un-evaluated QuerySet loads all matching rows to count the Python list. Calling it before iterating means the rows are fetched (and, before Django caches, potentially twice). Decide upfront: if you need the rows, `list()` once and use `len()`/`bool()`/iteration on that list — all free. `.count()`/`.exists()` are only cheaper when you do *not* also need the rows.',
        whyHi: 'Ek un-evaluated QuerySet par har `len(qs)` saari matching rows load karта hai Python list count karने ko. Ise iterate karने se pehle call karna matlab rows fetch hoती hain. Pehle tay karो: agar rows chahिए, ek baar `list()` karो aur us list par `len()`/`bool()`/iteration istemal karो — sab muft.',
      },
      {
        wrong: `def dashboard(request):
    orders = Order.objects.filter(user=request.user)
    context = {
        "orders": orders,
        "order_count": orders.count(),          # query A
        "has_orders": orders.exists(),          # query B
        "total": sum(o.total for o in orders),  # query C (full load)
    }
    # 3 queries for data you could get from ONE`,
        right: `def dashboard(request):
    orders = list(Order.objects.filter(user=request.user))   # 1 query
    context = {
        "orders": orders,
        "order_count": len(orders),
        "has_orders": bool(orders),
        "total": sum(o.total for o in orders),
    }`,
        why: 'When a view needs the rows *and* aggregate facts about them, `.count()` and `.exists()` on the same queryset are extra round trips for information already implied by the rows. Materialise once and compute `len`, `bool`, `sum` in Python. (If you needed the total but *not* the row objects, an `.aggregate(Sum("total"))` would be the single-query choice — Module 3 lesson 4.)',
        whyHi: 'Jab ek view ko rows *aur* unke baare mein aggregate facts chahिए, usi queryset par `.count()` aur `.exists()` extra round trips hain jानकारी ke liye jо rows se pehle se implied hai. Ek baar materialise karो aur Python mein `len`, `bool`, `sum` compute karो.',
      },
      {
        wrong: `# a report over 5 million rows
rows = Article.objects.all()
for a in rows:            # loads ALL 5M into memory -> the process OOMs
    write_csv_row(a)`,
        right: `rows = Article.objects.all().iterator(chunk_size=5000)
for a in rows:            # streamed from the DB in chunks -> flat memory
    write_csv_row(a)
# (Module 8: also consider .values() to skip model instantiation, and keyset pagination)`,
        why: 'A plain `for a in Article.objects.all()` fully evaluates the queryset, building a Python model instance for every row and holding them all in \`_result_cache\`. For a few thousand rows that is fine; for millions it exhausts memory. `.iterator()` streams rows from the database in server-side chunks and does not cache them, keeping memory constant — the right tool for exports, backfills, and any full-table scan.',
        whyHi: 'Ek plain `for a in Article.objects.all()` queryset ko poori tarah evaluate karта hai, har row ke liye ek Python model instance banाता hai aur unhe sab `_result_cache` mein rakhता hai. Millions ke liye ye memory khatam karता hai. `.iterator()` rows ko DB se server-side chunks mein stream karта hai aur cache nahi karता.',
      },
    ],

    realWorld: [
      {
        en: '**`assertNumQueries(n)` in tests pins query counts** — a test wraps the view/serializer call in `with self.assertNumQueries(3):` so an accidental N+1 introduced later fails CI. `django-debug-toolbar` in dev shows the count and the duplicate queries per page; `nplusone` raises on unoptimised access.',
        hi: '**Tests mein `assertNumQueries(n)` query counts pin karता hai** — ek test view call ko `with self.assertNumQueries(3):` mein wrap karता hai taaki baad mein daala ek accidental N+1 CI fail kare. Dev mein `django-debug-toolbar` count aur duplicate queries dikhाता hai.',
      },
      {
        en: '**DRF `get_queryset` returns a lazy QuerySet the framework paginates** — you never call `list()`; the pagination class slices it (`qs[offset:offset+limit]`, still lazy) and the serializer iterates the slice, so only one page of rows is fetched. Calling `.count()` for the pagination header is a second, deliberate query.',
        hi: '**DRF `get_queryset` ek lazy QuerySet lautाता hai jise framework paginate karता hai** — aap kabhi `list()` call nahi karते; pagination class ise slice karта hai aur serializer slice iterate karता hai, toh sirf ek page rows fetch hoती hain.',
      },
      {
        en: '**`.exists()` guards and `.count()` badges are everywhere** — "you have unread messages" (`exists()`), "3 items in cart" (`count()`), permission checks (`user.groups.filter(name="admin").exists()`). Using the row-loading form of these in a loop is one of the most common performance regressions found in review.',
        hi: '**`.exists()` guards aur `.count()` badges har jagah hain** — "aapke unread messages hain" (`exists()`), "cart mein 3 items" (`count()`), permission checks. Inके row-loading form ko ek loop mein istemal karna review mein mila ek aam performance regression hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does it mean that Django QuerySets are lazy, and what triggers evaluation?',
        qHi: 'Iska kya matlab hai ki Django QuerySets lazy hain, aur kya evaluation trigger karता hai?',
        a: 'A QuerySet is an object that describes a database query — which model, which filters, which ordering, which fields, how to fetch related objects — but it does not contain any rows and it does not run any SQL when you create it. Every method that returns a QuerySet, like filter, exclude, order_by, annotate, select_related, values, returns a new QuerySet with the additional clause, leaving the original untouched. This laziness lets you compose a query in pieces: a service returns a base queryset, a view adds a filter, a permission layer adds another, and still nothing has hit the database. The SQL runs the first time you do something that actually needs the rows. The triggers are: iterating over it in a for loop or comprehension; calling list on it; calling len on it, which loads all the rows and then counts the Python list; testing it for truthiness with bool or an if, which loads at least one row; indexing it like qs of three, or slicing with a step; calling repr, which the shell does to display it; pickling it; and the terminal methods that return a value rather than a queryset — get, first, last, earliest, latest, count, exists, aggregate, in_bulk — and the write methods create, update, delete, bulk_create. Plain slicing without a step, like qs of two to five, is special: it returns a new lazy queryset with LIMIT and OFFSET applied, so it does not evaluate until you then iterate it. Once a queryset is fully evaluated by iteration or list, it caches the resulting model instances on itself, so iterating the same queryset object again is free. That cache is per queryset object, so a new queryset from a filter call starts empty. count and exists run their own query when called on a fresh, un-evaluated queryset, but if the queryset has already been fully evaluated they use its cached rows and issue no query.',
        aHi: 'Ek QuerySet ek object hai jо ek database query describe karता hai — kaunsा model, kaunse filters, kaunsी ordering — par ismें koi rows nahi aur ye koi SQL nahi chalाता jab aap ise banाते ho. Har method jо ek QuerySet lautाता hai, jaise filter, exclude, order_by, ek naya QuerySet lautाता hai extra clause ke saath, original ko chhue bina. Ye laziness aapko ek query tukdon mein compose karने deती hai. SQL pehli baar chalता hai jab aap kuch aisा karते ho jise asal mein rows chahिए. Triggers hain: ek for loop mein iterate karna; ispar list call karna; ispar len call karna, jо saari rows load karта hai; ise bool se truthiness ke liye test karna; ise index karna, ya step ke saath slice karna; repr call karna; pickle karna; aur terminal methods — get, first, count, exists, aggregate — aur write methods. Step ke bina plain slicing vishesh hai: ye ek naya lazy queryset lautाता hai LIMIT aur OFFSET ke saath. Ek baar poori tarah evaluate hone par, ye resulting instances khud par cache karता hai.',
      },
      {
        q: 'A colleague writes `if len(qs) > 0:` and later `for x in qs:`. What is wrong and how would you fix it?',
        qHi: 'Ek colleague `if len(qs) > 0:` likhता hai aur baad mein `for x in qs:`. Kya galat hai aur aap kaise theek karोge?',
        a: 'The problem is that len on a QuerySet is not a lightweight count — it forces the QuerySet to fully evaluate, which runs a SELECT for all matching columns and rows, materialises a model instance for each, and then returns the length of that Python list. So the len call is doing the expensive part of the work: fetching every row. If the QuerySet has not been evaluated when len is called, and Django has not yet cached the result on that exact object, you can end up fetching the rows for the len check and then, depending on how the code is structured, fetching them again for the loop. Even in the best case where Django reuses the cache, you have loaded potentially thousands of rows into memory just to check whether the count is greater than zero, which only needed to know if at least one row exists. The fix depends on what the code actually needs downstream. If it needs the rows anyway — which the subsequent for loop says it does — then the right move is to evaluate the QuerySet exactly once into a list at the top, and then use that list everywhere: if the_list checks existence for free, len of the_list gives the count for free, and iterating the_list is free because it is already in memory. If the code only needed to know whether any rows exist and did not actually need to iterate, then it should call exists on the QuerySet, which compiles to SELECT 1 with a LIMIT 1 and stops at the first match. And if it only needed the count and not the rows, it should call count, which compiles to SELECT COUNT star computed in the database. The general principle is to decide once whether you need the row objects: if yes, materialise once and derive everything from the list; if no, ask the database the narrow question with exists or count.',
        aHi: 'Samasya ye hai ki ek QuerySet par len ek halka count nahi hai — ye QuerySet ko poori tarah evaluate karने ko majboor karता hai, jо saare matching columns aur rows ke liye ek SELECT chalाता hai, har ek ke liye ek model instance banाता hai, aur phir us Python list ki length lautाता hai. Toh len call kaam ka mehnga hissa kar raha hai: har row fetch karna. Agar QuerySet evaluate nahi hua jab len call hoता hai, aap len check ke liye rows fetch kar sakte ho aur phir loop ke liye phir se. Best case mein bhi jahaan Django cache reuse karता hai, aapne hazaaron rows memory mein load kiye bस ye check karने ko ki count zero se bada hai. Fix is baat par nirbhar karता hai ki code ko downstream kya chahिए. Agar ise rows waise bhi chahिए — jо agला for loop kehta hai — toh sahi kaदम QuerySet ko bilkul ek baar ek list mein evaluate karna hai, aur phir wo list har jagah istemal karna. Agar code ko sirf ye jaanna tha ki koi rows hain, ise exists call karna chahिए. Agar sirf count chahिए, count call karना chahिए.',
      },
    ],

    exercises: [
      {
        task: 'Model `Post` with `title` and `published` (bool). Insert 20 posts, 12 published. Use `CaptureQueriesContext`: (a) build `qs = Post.objects.filter(published=True).order_by("title")` and assert 0 queries ran; (b) in a new context, `list(qs)` twice and iterate it once, and assert exactly 1 query ran total (caching).',
        taskHi: '`Post` model karो `title` aur `published` (bool) ke saath. 20 posts insert karो, 12 published. `CaptureQueriesContext` istemal karो: (a) `qs` banाओ aur assert karो 0 queries; (b) ek naye context mein, `list(qs)` do baar aur ek baar iterate, assert karो kul bilkul 1 query.',
        hint: '`from django.test.utils import CaptureQueriesContext`. `with CaptureQueriesContext(connection) as ctx: ...; assert len(ctx.captured_queries) == N`. Building the queryset (filter/order_by) is 0; the first `list(qs)` is 1; everything after is cache.',
        hintHi: '`from django.test.utils import CaptureQueriesContext`. `with CaptureQueriesContext(connection) as ctx: ...; assert len(ctx.captured_queries) == N`. Queryset banाना 0 hai; pehला `list(qs)` 1 hai.',
      },
      {
        task: 'Model `Ticket` with `status`. Insert 400 `open` + 2 `closed`. Compare query strategies for "are there closed tickets?" and "how many open?": capture the last SQL for `.exists()`, `bool(qs)`, `.count()`, and `len(list(qs))`, and print the first 60 chars of each. Confirm `.exists()` contains `LIMIT` and `.count()` contains `COUNT(*)`, while `bool` and `len(list())` select full rows.',
        taskHi: '`Ticket` model karो `status` ke saath. 400 `open` + 2 `closed` insert karो. "closed tickets hain?" aur "kितne open?" ke liye query strategies compare karो: `.exists()`, `bool(qs)`, `.count()`, `len(list(qs))` ke liye aakhri SQL capture karो.',
        hint: '`ctx.captured_queries[-1]["sql"]` is the last statement. `.exists()` -> `SELECT (1) ... LIMIT 1`; `.count()` -> `SELECT COUNT(*)`; `bool` / `len(list())` -> `SELECT <all columns> ...`.',
        hintHi: '`ctx.captured_queries[-1]["sql"]` aakhri statement hai. `.exists()` -> `... LIMIT 1`; `.count()` -> `SELECT COUNT(*)`.',
      },
      {
        task: 'Model `Row` with an integer `n`. Insert 5000 rows. Iterate `Row.objects.all()` normally and separately with `.iterator(chunk_size=1000)`, summing `n` both ways. Confirm the sums match. Then use `CaptureQueriesContext` to show that iterating the plain queryset twice runs 1 query (cache) but iterating the `.iterator()` result twice runs 2 queries (no cache).',
        taskHi: '`Row` model karो ek integer `n` ke saath. 5000 rows insert karो. `Row.objects.all()` normally aur `.iterator(chunk_size=1000)` se iterate karके `n` sum karो. Sums match confirm karो. Phir dikhाओ ki plain queryset do baar iterate karna 1 query hai par `.iterator()` do baar 2 queries.',
        hint: '`qs = Row.objects.all(); sum(r.n for r in qs); sum(r.n for r in qs)` -> 1 query (cache). `it = Row.objects.all().iterator()` can only be consumed once; call `.iterator()` again for a second pass -> another query. `.iterator()` never populates `_result_cache`.',
        hintHi: '`qs = Row.objects.all(); sum(r.n for r in qs); sum(r.n for r in qs)` -> 1 query (cache). `.iterator()` sirf ek baar consume ho sakta hai.',
      },
    ],

    keyTakeaways: [
      'A QuerySet describes a query, holds NO rows, runs NO SQL until evaluated. `filter`/`exclude`/`order_by`/`annotate`/`values`/`select_related`/... each return a NEW lazy QuerySet; the original is unchanged.',
      'Evaluation triggers: iteration, `list()`, `len()` (loads all rows!), `bool()`/`if qs:` (loads a row), `qs[i]`, step-slice `qs[::2]`, `repr()`, `pickle`, and terminal methods (`get`/`first`/`count`/`exists`/`aggregate`/`create`/`update`/`delete`). Plain slice `qs[2:5]` stays lazy (adds `LIMIT`/`OFFSET`).',
      'Full evaluation caches rows on `qs._result_cache` — re-iterating the SAME QuerySet object is free. A new QuerySet from `qs.filter(...)` has an EMPTY cache.',
      '`qs.count()`/`qs.exists()` on a FRESH queryset run their own query (`SELECT COUNT(*)` / `SELECT 1 ... LIMIT 1`). On an ALREADY-EVALUATED queryset they use the cached rows -> 0 extra queries. A re-filtered `qs.filter(...)` is fresh again.',
      'Ask the database the narrow question: `.exists()` for "any?", `.count()` for "how many?". NEVER `len(list(qs))` for a count or `if list(qs):` for existence — those load every row.',
      'If you need the rows AND count/existence: `rows = list(qs)` once, then `len(rows)` / `bool(rows)` / `sum(...)` are free (in memory).',
      'Each call to a function that builds a QuerySet returns a fresh object — evaluating it re-queries. Store `list(...)` if you will use the results more than once.',
      '`.iterator(chunk_size=n)` streams rows from the DB in server-side batches and does NOT populate `_result_cache` — flat memory for huge result sets (exports, backfills), but re-iterating re-runs the query. (Module 8.)',
    ],
    keyTakeawaysHi: [
      'Ek QuerySet ek query describe karता hai, KOI rows nahi, KOI SQL nahi jab tak evaluate na ho. `filter`/`exclude`/`order_by`/... har ek ek NAYA lazy QuerySet lautाता hai; original nahi badalता.',
      'Evaluation triggers: iteration, `list()`, `len()` (saari rows load!), `bool()`/`if qs:`, `qs[i]`, step-slice `qs[::2]`, `repr()`, `pickle`, aur terminal methods (`get`/`first`/`count`/`exists`/`aggregate`/write). Plain slice `qs[2:5]` lazy rehता hai.',
      'Poora evaluation rows ko `qs._result_cache` par cache karता hai — WAHI QuerySet object phir iterate karna muft. `qs.filter(...)` se ek naya QuerySet ka cache KHALI hai.',
      '`qs.count()`/`qs.exists()` ek FRESH queryset par apni query chalाते hain. Ek ALREADY-EVALUATED queryset par wo cached rows istemal karते hain -> 0 extra queries. Ek re-filtered `qs.filter(...)` phir fresh hai.',
      'Database se sankuचित sawaal poochो: "koi?" ke liye `.exists()`, "kितne?" ke liye `.count()`. Count ke liye KABHI `len(list(qs))` nahi ya existence ke liye `if list(qs):` nahi.',
      'Agar aapko rows AUR count/existence chahिए: ek baar `rows = list(qs)`, phir `len(rows)` / `bool(rows)` / `sum(...)` muft hain.',
      'Ek function jо QuerySet banाता hai iske har call ek fresh object lautाता hai — ise evaluate karna re-query karता hai. `list(...)` store karो agar aap results ek baar se zyada istemal karोge.',
      '`.iterator(chunk_size=n)` rows ko DB se server-side batches mein stream karता hai aur `_result_cache` populate NAHI karता — bade result sets ke liye flat memory. (Module 8.)',
    ],
  },

  {
    slug: 'dj-filtering-q-and-f',
    title: 'Filtering: Field Lookups, Q Objects, and F Expressions',
    titleHi: 'Filtering: Field Lookups, Q Objects, Aur F Expressions',
    description: 'Field lookups (`__gte`, `__icontains`, `__in`, spanning `author__team__name`) express most filters. `Q` objects add OR, NOT, and grouping. `F` expressions let you compare two columns and update a column atomically in the database. Together they keep logic in SQL instead of pulling rows into Python.',
    descriptionHi: 'Field lookups (`__gte`, `__icontains`, `__in`, spanning `author__team__name`) adhikaansh filters express karते hain. `Q` objects OR, NOT, aur grouping add karते hain. `F` expressions aapko do columns compare karने aur ek column ko database mein atomically update karने dete hain. Saath, wo logic ko SQL mein rakhते hain rows ko Python mein khींchने ke bजाय.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A very literal research assistant with a filing system.** Field lookups are the standard request forms: "records where the amount is at least 100" (`amount__gte=100`), "where the title contains \'django\' ignoring case" (`title__icontains="django"`), "where the status is any of these three" (`status__in=[...]`), "where the author\'s team\'s region is EU" (`author__team__region="EU"` — the assistant walks the cross-references for you). But the standard form only does AND: every condition must hold. When you need "amount over 1000 **OR** flagged as VIP", you hand over a `Q` object — a little logic circuit you can wire with `|` for OR, `&` for AND, and `~` for NOT, and nest in parentheses. And an `F` expression is when you say "find records where the *shipped* date is after the *ordered* date" — you are comparing two columns of the same record, not a column to a fixed value — or "add 1 to the view count of this record" and the assistant does the arithmetic *in the ledger itself* without first reading the number out to you, so two assistants doing it at once cannot lose an increment.',
      hi: '**Ek bahut literal research assistant ek filing system ke saath.** Field lookups standard request forms hain: "records jahaan amount kam se kam 100 hai" (`amount__gte=100`), "jahaan title mein \'django\' hai case ignore karके" (`title__icontains="django"`), "jahaan status in teenon mein se koi hai" (`status__in=[...]`), "jahaan author ke team ka region EU hai" (`author__team__region="EU"` — assistant aapke liye cross-references chalता hai). Par standard form sirf AND karता hai. Jab aapko "amount 1000 se upar **YA** VIP flagged" chahिए, aap ek `Q` object dete ho — ek chhota logic circuit jise aap `|` OR ke liye, `&` AND ke liye, aur `~` NOT ke liye wire kar sakte ho. Aur ek `F` expression tab hai jab aap kehते ho "records dhoondhो jahaan *shipped* date *ordered* date ke baad hai" — aap ek record ke do columns compare kar rahe ho — ya "is record ka view count 1 badhाओ" aur assistant arithmetic *ledger mein hi* karता hai bina pehle number aapko padhे.',
    },

    simple: `**Field lookups: \`field__lookup=value\`**

\`\`\`python
Book.objects.filter(price__gte=500)                 # >=      also: gt lt lte
Book.objects.filter(title__icontains="django")      # ILIKE '%django%'   (contains = case-sensitive)
Book.objects.filter(title__istartswith="the ")      # also: startswith endswith iendswith
Book.objects.filter(status__in=["active", "draft"]) # IN (...)
Book.objects.filter(published_at__isnull=True)      # IS NULL
Book.objects.filter(published_at__year=2024)        # also: __month __day __week_day __date __hour
Book.objects.filter(price__range=(100, 500))        # BETWEEN 100 AND 500
Book.objects.filter(tags__name__iexact="Python")    # spans the M2M -> a JOIN
Book.objects.filter(author__team__region="EU")      # spans two FKs -> two JOINs
Book.objects.exclude(status="archived")             # NOT
\`\`\`

**\`Q\` objects: OR, NOT, and grouping**

\`\`\`python
from django.db.models import Q

Book.objects.filter(Q(price__lt=200) | Q(is_free=True))          # OR
Book.objects.filter(~Q(status="archived"))                        # NOT
Book.objects.filter(Q(featured=True) & (Q(price__lt=200) | Q(is_free=True)))   # grouped

# Q args come BEFORE keyword args; keyword args are ANDed on:
Book.objects.filter(Q(a=1) | Q(b=2), status="active")            # (a=1 OR b=2) AND status='active'
\`\`\`

**\`F\` expressions: reference a column, update atomically**

\`\`\`python
from django.db.models import F

# compare two columns of the same row:
Order.objects.filter(shipped_at__gt=F("ordered_at"))
Product.objects.filter(sold__gte=F("stock"))

# atomic in-DB update -- no read-modify-write race:
Article.objects.filter(pk=1).update(views=F("views") + 1)         # UPDATE ... SET views = views + 1
Account.objects.filter(pk=1).update(balance=F("balance") - amount)

# arithmetic in annotations:
Order.objects.annotate(net=F("gross") - F("discount"))
\`\`\`

**Chained \`.filter()\` vs one \`.filter()\` — different for multi-valued relations**

\`\`\`python
# ONE filter: the SAME related row must match BOTH conditions
Blog.objects.filter(entry__headline__contains="Django", entry__pub_year=2024)
#   -> blogs with an entry that is BOTH about Django AND from 2024

# CHAINED filters: DIFFERENT related rows may match each condition
Blog.objects.filter(entry__headline__contains="Django").filter(entry__pub_year=2024)
#   -> blogs with SOME entry about Django AND (possibly another) entry from 2024
\`\`\`

\`\`\`
LOOKUPS:  exact iexact contains icontains in gt gte lt lte startswith endswith
          range date year month day week_day time hour isnull regex iregex
          (JSONField:  __contains __contained_by __has_key __has_keys  + key path  data__address__city)
Q:  | (OR)   & (AND)   ~ (NOT)   -- combine, then pass positionally to filter()/exclude()/Q()
F:  F("col") in filter (compare columns), in update (atomic write), in annotate (arithmetic)
    F also for  order_by(F("x").asc(nulls_last=True))  and  .update(counter=F("counter")+1)

.filter(a=1, b=2)          -> WHERE a=1 AND b=2  (single JOIN for a relation)
.filter(a=1).filter(b=2)   -> for a MULTI-VALUED relation, a SEPARATE JOIN each -> different rows OK
\`\`\``,

    simpleHi: `**Field lookups: \`field__lookup=value\`**

\`\`\`python
Book.objects.filter(price__gte=500)                 # >=      bhi: gt lt lte
Book.objects.filter(title__icontains="django")      # ILIKE '%django%'
Book.objects.filter(status__in=["active", "draft"]) # IN (...)
Book.objects.filter(published_at__isnull=True)      # IS NULL
Book.objects.filter(published_at__year=2024)        # bhi: __month __day __date
Book.objects.filter(price__range=(100, 500))        # BETWEEN 100 AND 500
Book.objects.filter(author__team__region="EU")      # do FKs span -> do JOINs
Book.objects.exclude(status="archived")             # NOT
\`\`\`

**\`Q\` objects: OR, NOT, aur grouping**

\`\`\`python
from django.db.models import Q

Book.objects.filter(Q(price__lt=200) | Q(is_free=True))          # OR
Book.objects.filter(~Q(status="archived"))                        # NOT
Book.objects.filter(Q(featured=True) & (Q(price__lt=200) | Q(is_free=True)))   # grouped

# Q args keyword args se PEHLE aate hain; keyword args AND hote hain:
Book.objects.filter(Q(a=1) | Q(b=2), status="active")            # (a=1 OR b=2) AND status='active'
\`\`\`

**\`F\` expressions: ek column reference karो, atomically update karो**

\`\`\`python
from django.db.models import F

# ek hi row ke do columns compare karो:
Order.objects.filter(shipped_at__gt=F("ordered_at"))

# atomic in-DB update -- koi read-modify-write race nahi:
Article.objects.filter(pk=1).update(views=F("views") + 1)         # UPDATE ... SET views = views + 1
Account.objects.filter(pk=1).update(balance=F("balance") - amount)

Order.objects.annotate(net=F("gross") - F("discount"))
\`\`\`

**Chained \`.filter()\` vs ek \`.filter()\` — multi-valued relations ke liye alag**

\`\`\`python
# EK filter: WAHI related row DONO conditions match kare
Blog.objects.filter(entry__headline__contains="Django", entry__pub_year=2024)

# CHAINED filters: ALAG related rows har condition match kar sakte hain
Blog.objects.filter(entry__headline__contains="Django").filter(entry__pub_year=2024)
\`\`\`

\`\`\`
LOOKUPS:  exact iexact contains icontains in gt gte lt lte startswith endswith
          range date year month day time hour isnull regex iregex
          (JSONField:  __contains __has_key  + key path  data__address__city)
Q:  | (OR)   & (AND)   ~ (NOT)   -- combine, phir positionally filter()/exclude() ko pass
F:  F("col") filter mein (columns compare), update mein (atomic write), annotate mein (arithmetic)

.filter(a=1, b=2)          -> WHERE a=1 AND b=2
.filter(a=1).filter(b=2)   -> ek MULTI-VALUED relation ke liye, har ek alag JOIN -> alag rows OK
\`\`\``,

    content: `## Field lookups

A lookup is \`field__name=value\` in \`filter()\` / \`exclude()\` / \`get()\`. \`__exact\` is the default (\`filter(status="x")\` == \`filter(status__exact="x")\`). The common set:

- **Comparison**: \`gt\`, \`gte\`, \`lt\`, \`lte\`, \`range=(lo, hi)\`.
- **Membership**: \`in=[...]\` (a list, a tuple, or **a QuerySet** — becomes a subquery).
- **Null**: \`isnull=True/False\` (do not use \`field=None\` — it works but \`isnull\` is explicit).
- **Text**: \`exact\`/\`iexact\`, \`contains\`/\`icontains\`, \`startswith\`/\`istartswith\`, \`endswith\`/\`iendswith\`, \`regex\`/\`iregex\`. The \`i\` prefix is case-insensitive (\`ILIKE\` on Postgres).
- **Dates**: \`date\`, \`year\`, \`month\`, \`day\`, \`week\`, \`week_day\`, \`quarter\`, \`time\`, \`hour\`, \`minute\`, \`second\` — extract a part of a \`DateField\`/\`DateTimeField\`. \`created__date=today\`, \`created__year__gte=2020\`.
- **JSONField**: \`data__contains={...}\`, \`data__has_key="k"\`, \`data__has_keys=[...]\`, and key-path traversal \`data__address__city="Berlin"\`, \`data__items__0__price__gt=10\`.
- **Relation spanning**: \`author__name\`, \`author__team__region\` — each \`__\` across a relation adds a SQL JOIN. Works forward (FK/O2O) and backward (\`blog__entry__...\` via \`related_name\` or the default).

## \`Q\` objects — anything beyond AND

Keyword arguments in one \`filter()\` are always ANDed. For OR, NOT, or explicit grouping, use \`Q\`:

\`\`\`python
from django.db.models import Q

# OR
Product.objects.filter(Q(category="books") | Q(category="ebooks"))

# NOT (equivalent to exclude, but composable)
Product.objects.filter(~Q(status="archived"))

# grouped: (featured AND (cheap OR free))
Product.objects.filter(Q(featured=True) & (Q(price__lt=1000) | Q(is_free=True)))

# Q objects must come BEFORE keyword args in filter(); kwargs are ANDed to the whole thing:
Product.objects.filter(Q(a=1) | Q(b=2), in_stock=True)   # (a=1 OR b=2) AND in_stock=True
\`\`\`

You can build \`Q\` dynamically:

\`\`\`python
q = Q()
if search:
    q &= Q(title__icontains=search) | Q(description__icontains=search)
if min_price is not None:
    q &= Q(price__gte=min_price)
Product.objects.filter(q)
\`\`\`

\`Q\` also supports \`XOR\` (\`^\`) on databases that have it.

## \`F\` expressions — refer to a column, compute in the database

An \`F("field")\` is a reference to a model field's value **in SQL**, resolved per row. Three uses:

**1. Compare two fields of the same row:**

\`\`\`python
Employee.objects.filter(salary__lt=F("manager__salary"))   # salary less than their manager's
Order.objects.filter(delivered_at__lt=F("shipped_at"))     # data-integrity check
\`\`\`

**2. Atomic in-database updates (no read-modify-write race):**

\`\`\`python
# WRONG -- race: two requests both read views=10, both save 11
article = Article.objects.get(pk=1)
article.views += 1
article.save()

# RIGHT -- the DB does the increment; concurrent calls both count
Article.objects.filter(pk=1).update(views=F("views") + 1)
\`\`\`

This is the standard way to bump counters, adjust balances, and decrement stock safely. After such an \`update()\`, the in-memory instance is stale — \`refresh_from_db()\` if you need the new value.

**3. Arithmetic in \`annotate\` / \`order_by\`:**

\`\`\`python
Order.objects.annotate(margin=F("revenue") - F("cost")).filter(margin__gt=0)
Article.objects.order_by(F("published_at").desc(nulls_last=True))
\`\`\`

Wrap \`F\` arithmetic that mixes types in \`ExpressionWrapper(..., output_field=...)\` when Django cannot infer the result type.

## Chained vs combined filters on multi-valued relations

For a **single-valued** relation (FK/O2O) it makes no difference. For a **multi-valued** relation (reverse FK, M2M), it does:

- \`.filter(book__author="A", book__year=2024)\` — one JOIN; requires **the same** \`Book\` row to satisfy both.
- \`.filter(book__author="A").filter(book__year=2024)\` — two JOINs; a blog qualifies if it has *some* book by A **and** *some* (possibly different) book from 2024.

Pick deliberately. The chained form is right for "has at least one X and at least one Y"; the combined form is right for "has one row that is both X and Y". Getting this wrong silently returns the wrong set.

## \`annotate\` + \`filter\` ordering

\`.filter()\` before \`.annotate()\` filters the rows that go into the aggregate; \`.filter()\` after \`.annotate()\` filters on the annotation's value (becomes a \`HAVING\`). Order matters — Module 3 lesson 4.`,

    contentHi: `## Field lookups

Ek lookup \`field__name=value\` hai \`filter()\` / \`exclude()\` / \`get()\` mein. \`__exact\` default hai. Aam set:

- **Comparison**: \`gt\`, \`gte\`, \`lt\`, \`lte\`, \`range=(lo, hi)\`.
- **Membership**: \`in=[...]\` (ek list, ya **ek QuerySet** — ek subquery ban jाता hai).
- **Null**: \`isnull=True/False\`.
- **Text**: \`exact\`/\`iexact\`, \`contains\`/\`icontains\`, \`startswith\`, \`regex\`. \`i\` prefix case-insensitive hai.
- **Dates**: \`date\`, \`year\`, \`month\`, \`day\`, \`week_day\`, \`time\`, \`hour\` — ek \`DateField\` ka ek hissa extract karो.
- **JSONField**: \`data__has_key="k"\`, key-path \`data__address__city="Berlin"\`.
- **Relation spanning**: \`author__team__region\` — har \`__\` ek relation ke paar ek SQL JOIN add karता hai.

## \`Q\` objects — AND se aage kuch bhi

Ek \`filter()\` mein keyword arguments hamesha AND hote hain. OR, NOT, ya explicit grouping ke liye, \`Q\` istemal karो:

\`\`\`python
from django.db.models import Q

Product.objects.filter(Q(category="books") | Q(category="ebooks"))    # OR
Product.objects.filter(~Q(status="archived"))                          # NOT
Product.objects.filter(Q(featured=True) & (Q(price__lt=1000) | Q(is_free=True)))   # grouped

Product.objects.filter(Q(a=1) | Q(b=2), in_stock=True)   # (a=1 OR b=2) AND in_stock=True
\`\`\`

Aap \`Q\` dynamically bana sakte ho:

\`\`\`python
q = Q()
if search:
    q &= Q(title__icontains=search) | Q(description__icontains=search)
Product.objects.filter(q)
\`\`\`

## \`F\` expressions — ek column reference karो, database mein compute karो

Ek \`F("field")\` ek model field ki value ka reference hai **SQL mein**, prati row resolved. Teen uses:

**1. Ek hi row ke do fields compare karो:**

\`\`\`python
Employee.objects.filter(salary__lt=F("manager__salary"))
Order.objects.filter(delivered_at__lt=F("shipped_at"))
\`\`\`

**2. Atomic in-database updates (koi read-modify-write race nahi):**

\`\`\`python
# GALAT -- race: do requests dono views=10 padhते hain, dono 11 save karते hain
article = Article.objects.get(pk=1); article.views += 1; article.save()

# SAHI -- DB increment karता hai
Article.objects.filter(pk=1).update(views=F("views") + 1)
\`\`\`

Aise \`update()\` ke baad, in-memory instance stale hai — \`refresh_from_db()\` agar aapko nayi value chahिए.

**3. \`annotate\` / \`order_by\` mein arithmetic:**

\`\`\`python
Order.objects.annotate(margin=F("revenue") - F("cost")).filter(margin__gt=0)
\`\`\`

## Chained vs combined filters multi-valued relations par

Ek **single-valued** relation (FK/O2O) ke liye koi antar nahi. Ek **multi-valued** relation (reverse FK, M2M) ke liye:

- \`.filter(book__author="A", book__year=2024)\` — ek JOIN; **wahi** \`Book\` row dono satisfy kare.
- \`.filter(book__author="A").filter(book__year=2024)\` — do JOINs; *koi* book by A **aur** *koi* (shायad alag) book from 2024.

Jaan-boojhकर chunो. Ise galat karna chupchaap galat set lautाता hai.`,

    examples: [
      {
        title: 'Lookups, relation spanning, and Q for OR/NOT',
        titleHi: 'Lookups, relation spanning, aur OR/NOT ke liye Q',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import Q

class Team(models.Model):
    name = models.CharField(max_length=50)
    region = models.CharField(max_length=10)
    class Meta:
        app_label = "__main__"

class Book(models.Model):
    title = models.CharField(max_length=100)
    price_cents = models.PositiveIntegerField()
    is_free = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default="active")
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="books")
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Team); se.create_model(Book)

eu = Team.objects.create(name="EU Press", region="EU")
us = Team.objects.create(name="US Press", region="US")
Book.objects.bulk_create([
    Book(title="Django Deep Dive", price_cents=3900, team=eu),
    Book(title="Free SQL Primer", price_cents=0, is_free=True, team=eu),
    Book(title="Archived Notes", price_cents=100, status="archived", team=us),
    Book(title="Cheap Reads", price_cents=150, team=us),
])

print("icontains 'django':",
      list(Book.objects.filter(title__icontains="django").values_list("title", flat=True)))
print("price__lte 200, not archived:",
      list(Book.objects.filter(price_cents__lte=200).exclude(status="archived")
           .values_list("title", flat=True)))
print("spans FK -- EU team books:",
      list(Book.objects.filter(team__region="EU").values_list("title", flat=True)))
print("Q: cheap OR free:",
      sorted(Book.objects.filter(Q(price_cents__lt=200) | Q(is_free=True))
             .values_list("title", flat=True)))
print("Q: (EU) AND (free OR expensive):",
      sorted(Book.objects.filter(Q(team__region="EU") & (Q(is_free=True) | Q(price_cents__gte=3000)))
             .values_list("title", flat=True)))
print("~Q archived == exclude:",
      Book.objects.filter(~Q(status="archived")).count())`,
        output: `icontains 'django': ['Django Deep Dive']
price__lte 200, not archived: ['Free SQL Primer', 'Cheap Reads']
spans FK -- EU team books: ['Django Deep Dive', 'Free SQL Primer']
Q: cheap OR free: ['Archived Notes', 'Cheap Reads', 'Free SQL Primer']
Q: (EU) AND (free OR expensive): ['Django Deep Dive', 'Free SQL Primer']
~Q archived == exclude: 3
`,
        explain: '`title__icontains` is a case-insensitive `LIKE`. `.filter().exclude()` chains AND-then-NOT. `team__region="EU"` spans the FK with a JOIN — no need to fetch `Team` objects. `Q(...) | Q(...)` is OR; `Q(...) & (Q(...) | Q(...))` groups with normal Python operator precedence and parentheses. `~Q(status="archived")` is NOT, equivalent to `.exclude(status="archived")` but usable inside a larger `Q` expression.',
        explainHi: '`title__icontains` ek case-insensitive `LIKE` hai. `.filter().exclude()` AND-phir-NOT chain karता hai. `team__region="EU"` FK ko ek JOIN se span karता hai — `Team` objects fetch karne ki zaroorat nahi. `Q(...) | Q(...)` OR hai; `Q(...) & (Q(...) | Q(...))` normal Python operator precedence se group karता hai. `~Q(status="archived")` NOT hai.',
      },
      {
        title: 'F expressions: compare columns, and atomic increments beat a race',
        titleHi: 'F expressions: columns compare karो, aur atomic increments ek race harाते hain',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import F

class Product(models.Model):
    name = models.CharField(max_length=50)
    stock = models.IntegerField()
    sold = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Product)
Product.objects.bulk_create([
    Product(name="A", stock=10, sold=3),
    Product(name="B", stock=5, sold=5),      # sold out
    Product(name="C", stock=8, sold=9),      # oversold -- a bug to find
])

# compare two columns of the same row
print("sold out or oversold (sold >= stock):",
      list(Product.objects.filter(sold__gte=F("stock")).values_list("name", flat=True)))
print("oversold (sold > stock):",
      list(Product.objects.filter(sold__gt=F("stock")).values_list("name", flat=True)))

# atomic increment: simulate two concurrent "view" hits on product A
p = Product.objects.get(name="A")

# the racy way (read-modify-write in Python): both see views=0, both write 1
a1 = Product.objects.get(pk=p.pk); a2 = Product.objects.get(pk=p.pk)
a1.views += 1; a1.save(update_fields=["views"])
a2.views += 1; a2.save(update_fields=["views"])
print("racy result (lost an increment):", Product.objects.get(pk=p.pk).views)

# the atomic way: the DB does  SET views = views + 1  each time
Product.objects.filter(pk=p.pk).update(views=0)     # reset
Product.objects.filter(pk=p.pk).update(views=F("views") + 1)
Product.objects.filter(pk=p.pk).update(views=F("views") + 1)
print("atomic result (both counted):", Product.objects.get(pk=p.pk).views)`,
        output: `sold out or oversold (sold >= stock): ['B', 'C']
oversold (sold > stock): ['C']
racy result (lost an increment): 1
atomic result (both counted): 2
`,
        explain: '`filter(sold__gte=F("stock"))` compiles to `WHERE sold >= stock` — comparing two columns of the same row, which a plain value cannot do. For the counter: the read-modify-write pattern (`a.views += 1; a.save()`) loses updates when two actors both read the old value — the "racy result" is 1, not 2. `update(views=F("views") + 1)` emits `UPDATE ... SET views = views + 1`, so the database performs the increment and concurrent calls each add one. This is how you bump view counts, adjust balances, and decrement stock safely.',
        explainHi: '`filter(sold__gte=F("stock"))` `WHERE sold >= stock` mein compile hoता hai — ek hi row ke do columns compare karta hai. Counter ke liye: read-modify-write pattern updates khोता hai jab do actors dono purani value padhते hain — "racy result" 1 hai, 2 nahi. `update(views=F("views") + 1)` `UPDATE ... SET views = views + 1` emit karता hai, toh database increment karта hai aur concurrent calls har ek ek jodते hain.',
      },
      {
        title: 'Chained .filter() vs one .filter() on a reverse relation',
        titleHi: 'Ek reverse relation par chained .filter() vs ek .filter()',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection

class Blog(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Entry(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name="entries")
    headline = models.CharField(max_length=100)
    year = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Blog); se.create_model(Entry)

b1 = Blog.objects.create(name="B1")   # has ONE entry that is Django AND 2024
b2 = Blog.objects.create(name="B2")   # has a Django entry (2023) and a different 2024 entry
b3 = Blog.objects.create(name="B3")   # Django entry only, no 2024
Entry.objects.create(blog=b1, headline="Django tips", year=2024)
Entry.objects.create(blog=b2, headline="Django tricks", year=2023)
Entry.objects.create(blog=b2, headline="Rust notes", year=2024)
Entry.objects.create(blog=b3, headline="Django intro", year=2022)

# ONE filter: the SAME entry must match both conditions
one = Blog.objects.filter(entries__headline__contains="Django", entries__year=2024).distinct()
print("one .filter() (same entry Django+2024):", sorted(one.values_list("name", flat=True)))

# CHAINED: a Django entry (any year) AND a 2024 entry (any headline) -- can be different entries
chained = (Blog.objects.filter(entries__headline__contains="Django")
           .filter(entries__year=2024).distinct())
print("chained .filter() (some Django entry + some 2024 entry):",
      sorted(chained.values_list("name", flat=True)))`,
        output: `one .filter() (same entry Django+2024): ['B1']
chained .filter() (some Django entry + some 2024 entry): ['B1', 'B2']
`,
        explain: 'For the reverse relation `entries` (one blog -> many entries), the two forms mean different things. `filter(entries__headline__contains="Django", entries__year=2024)` uses a single JOIN and requires **one entry** that is both about Django and from 2024 — only `B1`. `filter(entries__headline__contains="Django").filter(entries__year=2024)` uses two JOINs, so a blog qualifies if it has *some* Django entry and *some* 2024 entry, even if they are different rows — `B1` and `B2`. Choosing the wrong form silently returns the wrong blogs. (`.distinct()` dedupes rows multiplied by the JOINs.)',
        explainHi: 'Reverse relation `entries` (ek blog -> kai entries) ke liye, do forms alag matlab rakhते hain. `filter(entries__headline__contains="Django", entries__year=2024)` ek single JOIN istemal karता hai aur **ek entry** chahिए jо Django aur 2024 dono ho — sirf `B1`. `filter(...).filter(...)` do JOINs istemal karता hai, toh ek blog qualify karता hai agar iske paas *koi* Django entry aur *koi* 2024 entry ho, chahe wo alag rows hon — `B1` aur `B2`. Galat form chunna chupchaap galat blogs lautाता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# increment a counter with read-modify-write
def record_view(article_id):
    a = Article.objects.get(pk=article_id)
    a.view_count += 1
    a.save(update_fields=["view_count"])
# under concurrency, two requests both read N and both write N+1 -> one view lost`,
        right: `def record_view(article_id):
    Article.objects.filter(pk=article_id).update(view_count=F("view_count") + 1)
# the database computes  view_count = view_count + 1  -> every concurrent call counts`,
        why: 'Reading a value into Python, changing it, and writing it back is a read-modify-write race: between the read and the write, another process can do the same, and one of the two increments is lost. `F("view_count") + 1` in an `update()` sends the arithmetic to the database as `SET view_count = view_count + 1`, which the DB applies atomically per row. Use this for all counters, balances, and stock adjustments.',
        whyHi: 'Ek value Python mein padhna, badalna, aur wapas likhna ek read-modify-write race hai: read aur write ke beech, ek doosra process wahi kar sakta hai, aur do increments mein se ek kho jाता hai. `F("view_count") + 1` ek `update()` mein arithmetic ko database ko `SET view_count = view_count + 1` ki tarah bhejता hai, jise DB atomically apply karता hai.',
      },
      {
        wrong: `# want: products that are books OR ebooks
Product.objects.filter(category="books", category="ebooks")   # can't -- same kwarg twice
Product.objects.filter(category="books").filter(category="ebooks")   # AND -> always empty`,
        right: `from django.db.models import Q
Product.objects.filter(Q(category="books") | Q(category="ebooks"))
# or, simpler for a single field:
Product.objects.filter(category__in=["books", "ebooks"])`,
        why: 'Keyword arguments in `filter()` are always ANDed, and you cannot pass the same keyword twice. Chaining `.filter()` also ANDs. There is no way to express OR with plain kwargs — you need `Q` objects combined with `|`, or for the common "field is one of these values" case, the `__in` lookup.',
        whyHi: '`filter()` mein keyword arguments hamesha AND hote hain, aur aap wahi keyword do baar pass nahi kar sakte. `.filter()` chain karna bhi AND karता hai. Plain kwargs se OR express karने ka koi tarika nahi — aapko `Q` objects `|` ke saath chahिए, ya "field in inmें se ek" case ke liye `__in` lookup.',
      },
      {
        wrong: `# "blogs that have a comment from Ada AND a comment marked spam"
Blog.objects.filter(comments__author="Ada", comments__is_spam=True)
# means: one comment that is BOTH by Ada AND spam -> probably not what you meant`,
        right: `# if you mean two possibly-different comments:
Blog.objects.filter(comments__author="Ada").filter(comments__is_spam=True).distinct()
# if you truly mean one comment that is both, the single filter is correct`,
        why: 'On a multi-valued relation (reverse FK / M2M), a single `filter()` with two conditions requires the *same* related row to satisfy both. If you actually want "has some comment by Ada" and "has some comment marked spam" as independent facts, you must chain two `.filter()` calls so each gets its own JOIN. This distinction is invisible in the code but changes the result set — decide which you mean and add a comment.',
        whyHi: 'Ek multi-valued relation par, do conditions waala ek single `filter()` chahिए ki *wahi* related row dono satisfy kare. Agar aap sachmuch "koi comment by Ada" aur "koi comment spam marked" swतंत्r facts ki tarah chahते ho, aapko do `.filter()` calls chain karnी hongi taaki har ek ko apna JOIN mile.',
      },
    ],

    realWorld: [
      {
        en: '**Search/filter endpoints build a `Q` incrementally from query params** — `q &= Q(name__icontains=term)` for a search box, `q &= Q(price__gte=min_p)` when a min-price param is present, `q &= Q(category__in=cats)` for a multi-select. `django-filter` (Module 5) generates this from a `FilterSet` declaration for DRF.',
        hi: '**Search/filter endpoints query params se ek `Q` incrementally banaते hain** — search box ke liye `q &= Q(name__icontains=term)`, min-price param hone par `q &= Q(price__gte=min_p)`. `django-filter` (Module 5) ise DRF ke liye ek `FilterSet` se generate karता hai.',
      },
      {
        en: '**`F("...") + 1` / `- amount` is the only safe way to change counters and balances** — view counts, like counts, inventory decrements, wallet debits, retry counters. Paired with `select_for_update` (Module 7) when a check-then-act needs to be serialised, or a `CheckConstraint` (Module 2) to forbid a negative result.',
        hi: '**`F("...") + 1` / `- amount` counters aur balances badalने ka ekmatr surakshit tarika hai** — view counts, inventory decrements, wallet debits. `select_for_update` (Module 7) ke saath jab check-then-act serialise hona chahिए.',
      },
      {
        en: '**`F` comparisons power data-integrity queries and reports** — `Order.objects.filter(paid_amount__lt=F("total"))` (underpaid), `Shipment.objects.filter(delivered_at__lt=F("shipped_at"))` (impossible dates), `Subscription.objects.filter(used__gt=F("quota"))` (over quota). Run as a nightly check or surfaced on an admin dashboard (Module 9).',
        hi: '**`F` comparisons data-integrity queries aur reports ko power dete hain** — `Order.objects.filter(paid_amount__lt=F("total"))` (underpaid), `Shipment.objects.filter(delivered_at__lt=F("shipped_at"))` (impossible dates). Ek nightly check ya admin dashboard par (Module 9).',
      },
    ],

    interviewQA: [
      {
        q: 'When do you need a `Q` object instead of keyword arguments in `filter()`?',
        qHi: 'Aapko `filter()` mein keyword arguments ke bजाय ek `Q` object kab chahिए?',
        a: 'Keyword arguments passed to filter are always combined with AND, and chaining filter calls also combines with AND. So plain keyword arguments can only express a conjunction of conditions. You reach for Q objects whenever you need something other than a pure AND. The first case is OR: to find rows matching either of two conditions you write filter of Q of first condition pipe Q of second condition, where pipe is the OR operator. The second is negation as part of a larger expression: tilde Q of a condition is NOT that condition, and while a single negation could be done with exclude, tilde Q composes inside a bigger boolean expression where exclude cannot. The third is explicit grouping: when you need something like A AND, open paren, B OR C, close paren, you build that with Q objects and parentheses, because keyword arguments give you no way to control precedence. The fourth is building filters dynamically: you start with an empty Q, and conditionally combine more conditions into it with the and-equals and or-equals operators based on which search parameters were provided, then pass the accumulated Q to filter once. There is also a syntactic rule: when you mix Q objects and keyword arguments in the same filter call, the Q objects must come first, positionally, and the keyword arguments are then ANDed onto the whole thing. And Q supports XOR on databases that have it. For the very common special case of a single field needing to match one of several values, you do not need Q at all — the double-underscore in lookup, like status in a list, is simpler and clearer than an OR of equality checks.',
        aHi: 'filter ko pass kiye keyword arguments hamesha AND se combine hote hain, aur filter calls chain karna bhi AND se combine hoता hai. Toh plain keyword arguments sirf conditions ka ek conjunction express kar sakte hain. Aap Q objects ke liye pahुँchते ho jab bhi aapko pure AND ke alावा kuch chahिए. Pehला case OR hai: do conditions mein se kisi ek se match karती rows dhoondhने ke liye aap filter of Q pipe Q likhते ho. Doosra ek bade expression ke hisse ki tarah negation hai: tilde Q of a condition NOT hai. Teesra explicit grouping hai: jab aapko A AND open-paren B OR C close-paren chahिए. Chautha filters dynamically banाना hai: aap ek empty Q se shuru karते ho aur conditionally aur conditions ise mein combine karते ho. Ek syntactic niyam bhi hai: jab aap Q objects aur keyword arguments ek hi filter call mein mix karते ho, Q objects pehle aane chahिए. Ek single field ko kai values mein se ek match karने ke aam case ke liye, aapko Q bilkul nahi chahिए — in lookup saral hai.',
      },
      {
        q: 'What is an `F` expression and why is `F("count") + 1` in an `update()` better than incrementing in Python?',
        qHi: 'Ek `F` expression kya hai aur ek `update()` mein `F("count") + 1` Python mein increment karने se behtar kyun hai?',
        a: 'An F expression is a reference to the value of a model field evaluated inside the database query, on a per-row basis, rather than a value pulled into Python. It lets the SQL refer to a column. This enables three things. You can compare two columns of the same row in a filter, like salary less than F of manager salary, which you cannot do with a literal because the comparison target is itself a column. You can do arithmetic in an annotation, like annotating a margin as F of revenue minus F of cost. And you can express an update in terms of the current column value, like setting count to F of count plus one. That last use is the important one for correctness. If you increment in Python — fetch the object, add one to its count attribute, save it — you have a read-modify-write sequence. Between your read and your write, another request or worker can execute the same sequence. Both read the same starting value, both compute the same incremented value, and both write it, so instead of the count going up by two it goes up by one. One increment is silently lost. This is a classic race condition and it shows up as undercounted views, likes, or inventory. Writing the update as filter then update with count equals F of count plus one sends the statement SET count equals count plus one to the database, which applies it atomically to the row as part of a single statement. Concurrent executions of that statement each add one, because the database serialises the row update. So F in an update is the correct tool for any counter, balance, or quantity adjustment. One caveat: after such an update, the in-memory Python instance still holds the old value, because the increment happened in the database, not on the object — you call refresh_from_db if you need the new value locally.',
        aHi: 'Ek F expression ek model field ki value ka reference hai jо database query ke andar evaluate hoती hai, prati-row aadhaar par, bजाย ek value Python mein khींchne ke. Ye SQL ko ek column refer karने deता hai. Ye teen cheezein enable karता hai. Aap ek filter mein ek hi row ke do columns compare kar sakte ho. Aap ek annotation mein arithmetic kar sakte ho. Aur aap ek update ko current column value ke terms mein express kar sakte ho. Wo aakhri use correctness ke liye mahatvapoorn hai. Agar aap Python mein increment karте ho — object fetch karो, iske count attribute mein ek jodो, ise save karो — aapke paas ek read-modify-write sequence hai. Aapke read aur write ke beech, ek doosra request wahi sequence execute kar sakta hai. Dono wahi starting value padhते hain, dono wahi incremented value compute karते hain, aur dono ise likhते hain, toh count do se badhने ke bजाय ek se badhता hai. Ek increment chupchaap kho jाता hai. Ise filter phir update with count equals F of count plus one likhna database ko SET count equals count plus one statement bhejता hai, jise wo atomically apply karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Model `User` (`name`, `country` CharField, `is_verified` bool, `signup_year` int). Insert ~8 users across countries/years/verification. Write filters and print the results (names) for: (a) verified users from `"IN"` or `"US"` (use `country__in`); (b) `Q`: users who are `is_verified` OR signed up before 2020; (c) `~Q(country="IN")` count; (d) users whose name starts with "A" (case-insensitive, `__istartswith`).',
        taskHi: '`User` model karो (`name`, `country`, `is_verified`, `signup_year`). ~8 users insert karो. Filters likhो: (a) `"IN"` ya `"US"` se verified users; (b) `Q`: `is_verified` YA 2020 se pehle signup; (c) `~Q(country="IN")` count; (d) "A" se shuru name (`__istartswith`).',
        hint: '`from django.db.models import Q`. `country__in=["IN", "US"]`. `Q(is_verified=True) | Q(signup_year__lt=2020)`. `.filter(~Q(country="IN")).count()`. `name__istartswith="a"`.',
        hintHi: '`country__in=["IN", "US"]`. `Q(is_verified=True) | Q(signup_year__lt=2020)`. `.filter(~Q(country="IN")).count()`. `name__istartswith="a"`.',
      },
      {
        task: 'Model `Wallet` (`owner`, `balance_cents` IntegerField). Create one wallet with `balance_cents=1000`. Simulate a race: fetch it twice into `w1`, `w2`; do `w1.balance_cents += 100; w1.save(update_fields=["balance_cents"])` then `w2.balance_cents += 100; w2.save(...)`; print the balance (1100 — a deposit lost). Reset to 1000, then do two `Wallet.objects.filter(pk=w.pk).update(balance_cents=F("balance_cents") + 100)` calls; print the balance (1200).',
        taskHi: '`Wallet` model karो (`owner`, `balance_cents`). Ek wallet `balance_cents=1000` ke saath. Ek race simulate karो: ise `w1`, `w2` mein do baar fetch karो; `w1.balance_cents += 100; w1.save(...)` phir `w2` par wahi; balance print karो (1100). Reset karके, do `update(balance_cents=F("balance_cents") + 100)` calls.',
        hint: '`from django.db.models import F`. The Python read-modify-write on two stale copies loses one +100. `.update(balance_cents=F("balance_cents") + 100)` twice gives 1200 because each is `SET balance = balance + 100` in the DB.',
        hintHi: '`from django.db.models import F`. Do stale copies par Python read-modify-write ek +100 khोता hai. `.update(balance_cents=F("balance_cents") + 100)` do baar 1200 deता hai.',
      },
      {
        task: 'Model `Library` and `Loan` (FK to `Library`, `related_name="loans"`, `borrower` CharField, `overdue` bool). Create 3 libraries: L1 has one loan by "Ada" that is overdue; L2 has a loan by "Ada" (not overdue) and a separate overdue loan by "Bo"; L3 has a non-overdue loan by "Ada". Show that `Library.objects.filter(loans__borrower="Ada", loans__overdue=True).distinct()` returns only L1, while `.filter(loans__borrower="Ada").filter(loans__overdue=True).distinct()` returns L1 and L2.',
        taskHi: '`Library` aur `Loan` (FK, `related_name="loans"`, `borrower`, `overdue`) model karो. 3 libraries banाओ jaisा describe kiya. Dikhाओ ki single-filter form sirf L1 lautाता hai, chained form L1 aur L2.',
        hint: 'Single `filter(loans__borrower="Ada", loans__overdue=True)` needs ONE loan that is both. Chained `.filter(loans__borrower="Ada").filter(loans__overdue=True)` needs some Ada loan AND some overdue loan, possibly different. `.distinct()` because JOINs can duplicate rows.',
        hintHi: 'Single `filter(loans__borrower="Ada", loans__overdue=True)` ko EK loan chahिए jо dono ho. Chained form ko koi Ada loan AUR koi overdue loan chahिए, shायद alag.',
      },
    ],

    keyTakeaways: [
      'Lookups: `field__gte/lt/in/icontains/istartswith/isnull/range/year/date/regex=...`. `__in` accepts a list OR a QuerySet (subquery). Spanning a relation with `__` (`author__team__region`) adds a SQL JOIN — works forward (FK/O2O) and backward (reverse FK/M2M).',
      'Keyword args in one `filter()` (and chained `.filter()`) are always ANDed. For OR / NOT / grouping, use `Q`: `Q(a) | Q(b)`, `~Q(a)`, `Q(a) & (Q(b) | Q(c))`. `Q` args must come BEFORE kwargs in `filter()`; build `Q` dynamically with `q &= Q(...)`.',
      '`F("field")` references a column IN SQL, per row. Use it to: (1) compare two columns of the same row (`filter(sold__gte=F("stock"))`), (2) do atomic in-DB updates (`update(views=F("views") + 1)`), (3) arithmetic in `annotate`/`order_by`.',
      '`update(counter=F("counter") + 1)` is the ONLY safe way to change counters/balances/stock — `obj.counter += 1; obj.save()` is a read-modify-write race that loses concurrent increments. After an `F` update the in-memory instance is stale (`refresh_from_db()`).',
      'For a SINGLE-valued relation (FK/O2O), chained vs combined `.filter()` are identical. For a MULTI-valued relation (reverse FK, M2M) they differ: one `.filter(rel__a=, rel__b=)` requires the SAME related row to match both; `.filter(rel__a=).filter(rel__b=)` allows DIFFERENT related rows. Choose deliberately — the wrong one silently returns the wrong set.',
      'JOINs from relation spanning can multiply rows — add `.distinct()` when filtering across a multi-valued relation and you want each parent once.',
      'JSONField lookups: `data__has_key`, `data__contains`, and key-path `data__address__city="X"`, `data__items__0__price__gt=10`.',
      '`.filter()` before `.annotate()` = filter rows into the aggregate; `.filter()` after `.annotate()` = filter on the annotation (`HAVING`). (Module 3 lesson 4.)',
    ],
    keyTakeawaysHi: [
      'Lookups: `field__gte/lt/in/icontains/istartswith/isnull/range/year/date/regex=...`. `__in` ek list YA ek QuerySet (subquery) accept karता hai. `__` se ek relation span karna ek SQL JOIN add karता hai — forward (FK/O2O) aur backward (reverse FK/M2M).',
      'Ek `filter()` mein keyword args (aur chained `.filter()`) hamesha AND hote hain. OR / NOT / grouping ke liye, `Q` istemal karो: `Q(a) | Q(b)`, `~Q(a)`. `Q` args `filter()` mein kwargs se PEHLE aane chahिए; `Q` dynamically `q &= Q(...)` se banाओ.',
      '`F("field")` SQL mein ek column reference karता hai, prati row. Istemal karो: (1) ek hi row ke do columns compare (`filter(sold__gte=F("stock"))`), (2) atomic in-DB updates (`update(views=F("views") + 1)`), (3) `annotate`/`order_by` mein arithmetic.',
      '`update(counter=F("counter") + 1)` counters/balances/stock badalने ka EKMATR surakshit tarika hai — `obj.counter += 1; obj.save()` ek read-modify-write race hai jо concurrent increments khोता hai. Ek `F` update ke baad in-memory instance stale hai.',
      'Ek SINGLE-valued relation ke liye, chained vs combined `.filter()` ek jaise hain. Ek MULTI-valued relation ke liye wo alag hain: ek `.filter(rel__a=, rel__b=)` ko WAHI related row chahिए jо dono match kare; `.filter(rel__a=).filter(rel__b=)` ALAG related rows allow karता hai. Jaan-boojhकर chunो.',
      'Relation spanning se JOINs rows multiply kar sakte hain — ek multi-valued relation ke paar filter karте waqt `.distinct()` add karो.',
      'JSONField lookups: `data__has_key`, `data__contains`, aur key-path `data__address__city="X"`.',
      '`.filter()` `.annotate()` se pehle = rows ko aggregate mein filter; `.filter()` `.annotate()` ke baad = annotation par filter (`HAVING`). (Module 3 lesson 4.)',
    ],
  },

  {
    slug: 'dj-select-related-and-prefetch-related',
    title: 'select_related & prefetch_related: Killing the N+1',
    titleHi: 'select_related & prefetch_related: N+1 Ko Maarna',
    description: 'Iterating 100 books and reading `book.author.name` on each runs 101 queries — the N+1 problem. `select_related` folds forward FK/O2O lookups into one JOIN; `prefetch_related` fetches M2M and reverse relations in one extra query and joins in Python. Every list endpoint needs one or both.',
    descriptionHi: '100 books iterate karна aur har ek par `book.author.name` padhna 101 queries chalाता hai — N+1 problem. `select_related` forward FK/O2O lookups ko ek JOIN mein fold karता hai; `prefetch_related` M2M aur reverse relations ko ek extra query mein fetch karता hai aur Python mein join karता hai. Har list endpoint ko ek ya dono chahिए.',
    difficulty: 'HARD',
    duration: 26,
    order: 3,

    analogy: {
      en: '**Two ways to bring a class outside: hold hands in a chain, or send a bus.** You have a list of 100 students and you need each student\'s locker number, which lives in a separate registry. The N+1 way is to walk each student to the registry desk one at a time — 1 trip to get the student list, then 100 more trips, one per student. `select_related` is the hand-holding chain: because a student links to exactly one locker record (a to-one relationship), you ask the registry to hand you the student list *with the locker column already attached* — one trip, one combined sheet (a SQL JOIN). `prefetch_related` is the bus: when each student has *many* things — all the clubs they belong to (a to-many relationship) — you cannot flatten that into one sheet without duplicating every student per club. Instead you make exactly two trips: one for the students, one that grabs *all the club memberships for those 100 students at once*, and then you match them up back at the classroom (in Python). Either way you have replaced 101 trips with 1 or 2. The rule of thumb: `select_related` for the things a row points *to* (forward FK, one-to-one), `prefetch_related` for the things that point *at* it or that it has many of.',
      hi: '**Ek class ko bahar laने ke do tarike: ek chain mein haath pakadो, ya ek bus bhejो.** Aapke paas 100 students ki list hai aur aapko har student ka locker number chahिए, jо ek alag registry mein hai. N+1 tarika har student ko ek-ek karके registry desk tak chalाना hai — 1 trip student list ke liye, phir 100 aur trips. `select_related` haath-pakadने waali chain hai: kyunki ek student bilkul ek locker record se link karता hai (ek to-one relationship), aap registry se student list *locker column pehle se attached ke saath* maangते ho — ek trip, ek combined sheet (ek SQL JOIN). `prefetch_related` bus hai: jab har student ke paas *kai* cheezein hon — sab clubs jinmें wo hain (ek to-many relationship) — aap ise ek sheet mein flatten nahi kar sakte bina har student ko prati club duplicate kiye. Iske bजाय aap bilkul do trips karते ho: ek students ke liye, ek jо *un 100 students ke saare club memberships ek saath* pakadता hai, aur phir aap unhe classroom mein wapas match karते ho (Python mein).',
    },

    simple: `**The N+1 problem**

\`\`\`python
for book in Book.objects.all():          # 1 query: SELECT * FROM book
    print(book.author.name)              # +1 query PER BOOK: SELECT * FROM author WHERE id=?
# 100 books -> 101 queries
\`\`\`

**\`select_related\` — forward FK / OneToOne -> one SQL JOIN**

\`\`\`python
for book in Book.objects.select_related("author"):    # 1 query: book JOIN author
    print(book.author.name)                            # 0 extra queries

# chain across FKs:
Book.objects.select_related("author", "publisher__country")   # multiple JOINs in one query
\`\`\`

**\`prefetch_related\` — M2M / reverse FK -> one extra query, joined in Python**

\`\`\`python
for author in Author.objects.prefetch_related("books"):   # 2 queries:
    for book in author.books.all():                        #   1) SELECT * FROM author
        print(book.title)                                  #   2) SELECT * FROM book WHERE author_id IN (...)
# 0 extra queries no matter how many authors

Article.objects.prefetch_related("tags")                   # M2M
Author.objects.prefetch_related("books__reviews")          # nested
\`\`\`

**Which to use**

\`\`\`
select_related     forward ForeignKey, OneToOneField         -> adds a JOIN, 1 query
                   (the related object is "to-one")           null FK -> LEFT JOIN automatically
prefetch_related   ManyToManyField, reverse ForeignKey,       -> 1 extra query per relation,
                   reverse OneToOne, GenericRelation             matched in Python
                   (the related set is "to-many", OR you
                    want to filter/slice the related set)
\`\`\`

**\`Prefetch\` object — filter / order / slice the prefetched set**

\`\`\`python
from django.db.models import Prefetch

Author.objects.prefetch_related(
    Prefetch("books",
             queryset=Book.objects.filter(published=True).order_by("-year"),
             to_attr="published_books")          # -> author.published_books  (a list, not a manager)
)
\`\`\`

**Mixing them**

\`\`\`python
# authors, each with their books, and each book's publisher in the SAME prefetch query:
Author.objects.prefetch_related(
    Prefetch("books", queryset=Book.objects.select_related("publisher"))
)
\`\`\`

\`\`\`
DETECT N+1:  wrap the view in  with self.assertNumQueries(N):  in a test
             django-debug-toolbar (dev) shows count + duplicate SQL
             CaptureQueriesContext(connection) to count in a script
             nplusone / django-silk raise/log on unoptimised access

select_related(*fields)   forward to-one; JOINs; deepen with  a__b__c
prefetch_related(*lookups) to-many or reverse; 1 query each; accepts Prefetch(...)
Prefetch(lookup, queryset=, to_attr=)   customise the inner query / land it on a list attr
.only()/.defer() combine with these to trim columns (lesson 5)
\`\`\``,

    simpleHi: `**N+1 problem**

\`\`\`python
for book in Book.objects.all():          # 1 query: SELECT * FROM book
    print(book.author.name)              # +1 query PRATI BOOK: SELECT * FROM author WHERE id=?
# 100 books -> 101 queries
\`\`\`

**\`select_related\` — forward FK / OneToOne -> ek SQL JOIN**

\`\`\`python
for book in Book.objects.select_related("author"):    # 1 query: book JOIN author
    print(book.author.name)                            # 0 extra queries

Book.objects.select_related("author", "publisher__country")   # ek query mein kai JOINs
\`\`\`

**\`prefetch_related\` — M2M / reverse FK -> ek extra query, Python mein joined**

\`\`\`python
for author in Author.objects.prefetch_related("books"):   # 2 queries:
    for book in author.books.all():                        #   1) SELECT * FROM author
        print(book.title)                                  #   2) SELECT * FROM book WHERE author_id IN (...)

Article.objects.prefetch_related("tags")                   # M2M
Author.objects.prefetch_related("books__reviews")          # nested
\`\`\`

**Kaunsा istemal karें**

\`\`\`
select_related     forward ForeignKey, OneToOneField         -> ek JOIN add, 1 query
                   (related object "to-one")                  null FK -> LEFT JOIN apne aap
prefetch_related   ManyToManyField, reverse ForeignKey,       -> prati relation 1 extra query,
                   reverse OneToOne, GenericRelation             Python mein matched
                   (related set "to-many", YA aap related
                    set filter/slice karना chahते ho)
\`\`\`

**\`Prefetch\` object — prefetched set filter / order / slice karो**

\`\`\`python
from django.db.models import Prefetch

Author.objects.prefetch_related(
    Prefetch("books",
             queryset=Book.objects.filter(published=True).order_by("-year"),
             to_attr="published_books")          # -> author.published_books  (ek list, ek manager nahi)
)
\`\`\`

**Unhe mix karna**

\`\`\`python
Author.objects.prefetch_related(
    Prefetch("books", queryset=Book.objects.select_related("publisher"))
)
\`\`\`

\`\`\`
N+1 DETECT KARो:  view ko ek test mein  with self.assertNumQueries(N):  mein wrap karो
                  django-debug-toolbar (dev) count + duplicate SQL dikhाता hai
                  ek script mein count karने ke liye CaptureQueriesContext(connection)

select_related(*fields)   forward to-one; JOINs; a__b__c se deepen
prefetch_related(*lookups) to-many ya reverse; har ek 1 query; Prefetch(...) accept karता hai
Prefetch(lookup, queryset=, to_attr=)   inner query customise / ek list attr par land karो
\`\`\``,

    content: `## The N+1 problem

You fetch N rows in one query, then for each row you access a related object that was not loaded, triggering one more query per row: 1 + N. It is the single most common Django performance bug, and it hides well — the code reads naturally (\`book.author.name\`), the page is fast in dev with 5 rows, and it falls over in production with 5000.

\`\`\`python
# 1 + N
for order in Order.objects.all():                 # 1
    total = sum(i.price for i in order.items.all())  # N (reverse FK)
    print(order.customer.email)                       # N (forward FK)
# -> 1 + 2N queries
\`\`\`

## \`select_related\` — to-one relations, via JOIN

For **forward \`ForeignKey\`** and **\`OneToOneField\`** (and reverse \`OneToOneField\`), \`select_related\` adds a SQL \`JOIN\` so the related row's columns come back in the *same* query and are used to populate the related object with no extra hit:

\`\`\`python
Order.objects.select_related("customer")                  # order JOIN customer
Order.objects.select_related("customer", "shipping_address")   # two JOINs
Order.objects.select_related("customer__company__region")      # a chain of JOINs
\`\`\`

- A **nullable** FK becomes a \`LEFT OUTER JOIN\` automatically, so \`None\` is handled.
- Each JOIN widens the result rows; joining many large tables or going very deep can make the single query slow — measure. Two or three JOINs is normal; ten is a smell.
- \`select_related()\` with no arguments follows *all* non-null FKs (rarely what you want — be explicit).

## \`prefetch_related\` — to-many relations, via a second query

For **\`ManyToManyField\`**, **reverse \`ForeignKey\`** (\`author.books\`), reverse M2M, and \`GenericRelation\`, a JOIN would multiply the parent rows (one parent row per child). Instead \`prefetch_related\` runs a **second query** that fetches all the related objects for the parents already loaded, using \`WHERE fk_id IN (<parent ids>)\`, and Django stitches them onto the parents in Python:

\`\`\`python
authors = Author.objects.prefetch_related("books")     # query 1: authors
for a in authors:                                       # query 2: books WHERE author_id IN (...)
    for b in a.books.all():                              # 0 queries -- from the prefetch cache
        ...
\`\`\`

- The prefetch cache lives on \`a._prefetched_objects_cache\`; \`a.books.all()\` serves from it. But \`a.books.filter(...)\` or \`a.books.count()\` **bypass the cache** and re-query — filter/annotate inside a \`Prefetch\` queryset instead.
- Works with \`.iterator()\` since Django 4.1 (with a \`chunk_size\`).
- Nested: \`prefetch_related("books__reviews")\` prefetches books, then reviews for those books (3 queries total).

## \`Prefetch\` — customising the inner query

\`\`\`python
from django.db.models import Prefetch

Author.objects.prefetch_related(
    Prefetch(
        "books",
        queryset=Book.objects.filter(published=True)
                             .order_by("-published_at")
                             .select_related("publisher"),   # select_related INSIDE a prefetch
        to_attr="recent_books",                              # -> author.recent_books, a plain list
    )
)
\`\`\`

- **\`queryset=\`** filters, orders, annotates, or \`select_related\`s the prefetched set. This is how you get "each author with only their published books" in a bounded number of queries.
- **\`to_attr=\`** lands the results on a new list attribute instead of the default manager cache — clearer, and it lets you prefetch the *same* relation twice with different filters (\`published_books\`, \`draft_books\`).
- You cannot **slice** a prefetch queryset directly (no \`[:5]\`) before Django 4.2's \`Prefetch\` with sliced querysets on some backends — the common pattern is to prefetch all and slice in Python, or use a window function / lateral join for a true "top 5 per group".

## Combining

- \`select_related\` and \`prefetch_related\` compose: \`Order.objects.select_related("customer").prefetch_related("items")\`.
- \`select_related\` **inside** a \`Prefetch\` queryset pulls the child's own FKs in the prefetch query.
- \`prefetch_related\` **inside**... you nest with the double-underscore lookup: \`prefetch_related("orders__items")\`.

## Finding N+1

1. **Tests**: \`with self.assertNumQueries(4): self.client.get(url)\` — pins the count; a regression fails CI.
2. **Dev**: \`django-debug-toolbar\` shows total queries and highlights duplicated SQL per request. \`django-silk\` profiles and records. \`nplusone\` raises/logs the moment unoptimised related access happens.
3. **Ad hoc**: \`CaptureQueriesContext(connection)\` in a script or shell; \`connection.queries\` with \`DEBUG=True\`.
4. **The query itself**: \`print(qs.query)\` shows the SQL; \`qs.explain()\` shows the database plan (Module 3 lesson 6 covers indexes).

The workflow: measure -> find the relation being accessed per-row -> add \`select_related\` (to-one) or \`prefetch_related\` (to-many) -> re-measure. For a DRF list endpoint, this lives in \`get_queryset\` (Module 5).`,

    contentHi: `## N+1 problem

Aap N rows ek query mein fetch karते ho, phir har row ke liye ek related object access karते ho jо load nahi hua tha, prati row ek aur query trigger karके: 1 + N. Ye sabse aam Django performance bug hai, aur ye achhे se chhupता hai — code natural padhता hai (\`book.author.name\`), dev mein 5 rows ke saath page tez hai, aur production mein 5000 ke saath girता hai.

## \`select_related\` — to-one relations, JOIN ke zariये

**Forward \`ForeignKey\`** aur **\`OneToOneField\`** ke liye, \`select_related\` ek SQL \`JOIN\` add karта hai taaki related row ke columns *usi* query mein wapas aayें:

\`\`\`python
Order.objects.select_related("customer")                  # order JOIN customer
Order.objects.select_related("customer__company__region")      # JOINs ki ek chain
\`\`\`

- Ek **nullable** FK apne aap ek \`LEFT OUTER JOIN\` ban jाता hai.
- Har JOIN result rows chaudा karता hai; kai bade tables join karna single query ko dhीmा kar sakta hai — measure karो. Do-teen JOINs normal hai; das ek smell hai.

## \`prefetch_related\` — to-many relations, ek doosri query ke zariये

**\`ManyToManyField\`**, **reverse \`ForeignKey\`** (\`author.books\`), reverse M2M ke liye, ek JOIN parent rows multiply karता (prati child ek parent row). Iske bजाय \`prefetch_related\` ek **doosri query** chalाता hai jо pehle se loaded parents ke saare related objects fetch karता hai, \`WHERE fk_id IN (<parent ids>)\` istemal karके:

\`\`\`python
authors = Author.objects.prefetch_related("books")     # query 1: authors
for a in authors:                                       # query 2: books WHERE author_id IN (...)
    for b in a.books.all():                              # 0 queries -- prefetch cache se
        ...
\`\`\`

- \`a.books.all()\` cache se serve hoता hai. Par \`a.books.filter(...)\` ya \`a.books.count()\` **cache bypass** karते hain aur re-query — iske bजाय ek \`Prefetch\` queryset ke andar filter/annotate karो.
- Nested: \`prefetch_related("books__reviews")\`.

## \`Prefetch\` — inner query customise karna

\`\`\`python
from django.db.models import Prefetch

Author.objects.prefetch_related(
    Prefetch(
        "books",
        queryset=Book.objects.filter(published=True).order_by("-published_at")
                             .select_related("publisher"),   # ek prefetch ke ANDAR select_related
        to_attr="recent_books",                              # -> author.recent_books, ek plain list
    )
)
\`\`\`

- **\`queryset=\`** prefetched set ko filter/order/annotate/select_related karता hai.
- **\`to_attr=\`** results ko ek naye list attribute par land karता hai — saaf, aur ye aapko *wahi* relation do baar alag filters ke saath prefetch karने deта hai.

## Combining

- \`select_related\` aur \`prefetch_related\` compose hote hain.
- Ek \`Prefetch\` queryset ke **andar** \`select_related\` child ke apne FKs prefetch query mein khींchता hai.

## N+1 dhoondhna

1. **Tests**: \`with self.assertNumQueries(4): self.client.get(url)\`.
2. **Dev**: \`django-debug-toolbar\` total queries aur duplicated SQL dikhाता hai. \`nplusone\` unoptimised access par raise/log karता hai.
3. **Ad hoc**: \`CaptureQueriesContext(connection)\`.
4. **Query khud**: \`print(qs.query)\`; \`qs.explain()\`.

Workflow: measure -> per-row access hone waali relation dhoondhो -> \`select_related\` (to-one) ya \`prefetch_related\` (to-many) add karो -> phir se measure karो.`,

    examples: [
      {
        title: 'The N+1 problem and select_related fixing it',
        titleHi: 'N+1 problem aur select_related ise theek karता',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.test.utils import CaptureQueriesContext

class Publisher(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Author(models.Model):
    name = models.CharField(max_length=50)
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE)
    class Meta:
        app_label = "__main__"

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    for m in (Publisher, Author, Book): se.create_model(m)
pub = Publisher.objects.create(name="Acme")
authors = [Author.objects.create(name=f"Auth{i}", publisher=pub) for i in range(10)]
Book.objects.bulk_create([Book(title=f"B{i}", author=authors[i % 10]) for i in range(40)])

# N+1: 1 for books, then 1 per book for author, then 1 per author for publisher
with CaptureQueriesContext(connection) as ctx:
    for b in Book.objects.all():
        _ = b.author.name
        _ = b.author.publisher.name
print("naive:", len(ctx.captured_queries), "queries for 40 books")

# select_related: one JOIN query, zero extra
with CaptureQueriesContext(connection) as ctx:
    for b in Book.objects.select_related("author__publisher"):
        _ = b.author.name
        _ = b.author.publisher.name
print("select_related('author__publisher'):", len(ctx.captured_queries), "query")

# .author_id needs NO query at all -- the column is on the book row
with CaptureQueriesContext(connection) as ctx:
    ids = [b.author_id for b in Book.objects.all()]
print("just reading .author_id:", len(ctx.captured_queries), "query")`,
        output: `naive: 81 queries for 40 books
select_related('author__publisher'): 1 query
just reading .author_id: 1 query
`,
        explain: 'The naive loop runs 1 query for the books, then for each of the 40 books one query for its `author` (each `book` is its own instance, so nothing is shared across the loop) and one for that author\'s `publisher`: 1 + 40 + 40 = 81. `select_related("author__publisher")` adds two JOINs so every book row comes back with its author and publisher columns attached — **one** query, zero extra. And if you only need `author_id`, that column is already on the book row: no query for the relation at all.',
        explainHi: 'Naive loop books ke liye 1 query chalाता hai, phir 40 books mein se har ek ke liye iske `author` ke liye ek query aur us author ke `publisher` ke liye ek (har `book` ek alag instance hai, toh kuch share nahi hoता): 1 + 40 + 40 = 81. `select_related("author__publisher")` do JOINs add karता hai taaki har book row apne author aur publisher columns ke saath wapas aaye — **ek** query. Aur agar aapko sirf `author_id` chahिए, wo column pehle se book row par hai.',
      },
      {
        title: 'prefetch_related for a reverse FK, and .filter() bypassing the cache',
        titleHi: 'Ek reverse FK ke liye prefetch_related, aur .filter() cache bypass karता',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import Prefetch
from django.test.utils import CaptureQueriesContext

class Author(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Book(models.Model):
    title = models.CharField(max_length=100)
    published = models.BooleanField(default=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Author); se.create_model(Book)
authors = [Author.objects.create(name=f"A{i}") for i in range(8)]
Book.objects.bulk_create([
    Book(title=f"B{i}", author=authors[i % 8], published=(i % 3 != 0)) for i in range(40)
])

# naive: 1 + 8 (one books query per author)
with CaptureQueriesContext(connection) as ctx:
    for a in Author.objects.all():
        _ = list(a.books.all())
print("naive reverse FK:", len(ctx.captured_queries), "queries")

# prefetch_related: exactly 2 queries
with CaptureQueriesContext(connection) as ctx:
    for a in Author.objects.prefetch_related("books"):
        _ = list(a.books.all())          # served from the prefetch cache
print("prefetch_related('books'):", len(ctx.captured_queries), "queries")

# TRAP: .filter() / .count() on the prefetched relation bypass the cache -> N+1 again
with CaptureQueriesContext(connection) as ctx:
    for a in Author.objects.prefetch_related("books"):
        _ = list(a.books.filter(published=True))   # NOT cached -> a query per author
print("prefetch + .filter() (cache bypassed):", len(ctx.captured_queries), "queries")

# FIX: filter inside a Prefetch queryset, land it on to_attr
with CaptureQueriesContext(connection) as ctx:
    qs = Author.objects.prefetch_related(
        Prefetch("books", queryset=Book.objects.filter(published=True), to_attr="pub_books"))
    for a in qs:
        _ = a.pub_books                  # a plain list, from the prefetch
print("Prefetch(queryset=..., to_attr=...):", len(ctx.captured_queries), "queries")`,
        output: `naive reverse FK: 9 queries
prefetch_related('books'): 2 queries
prefetch + .filter() (cache bypassed): 10 queries
Prefetch(queryset=..., to_attr=...): 2 queries
`,
        explain: '`prefetch_related("books")` runs 2 queries — authors, then all their books via `WHERE author_id IN (...)` — and `a.books.all()` reads from the cache. But `a.books.filter(published=True)` and `a.books.count()` **do not** use the prefetch cache; they issue a fresh query per author, recreating the N+1. The fix is to push the filter into a `Prefetch(queryset=Book.objects.filter(published=True), to_attr="pub_books")`: the filtered set is fetched once and lands on `a.pub_books` as a plain list, back to 2 queries.',
        explainHi: '`prefetch_related("books")` 2 queries chalाता hai — authors, phir unki saari books `WHERE author_id IN (...)` ke zariये — aur `a.books.all()` cache se padhता hai. Par `a.books.filter(published=True)` aur `a.books.count()` prefetch cache **istemal nahi** karते; wo prati author ek fresh query issue karते hain, N+1 phir se banाते hain. Fix filter ko ek `Prefetch(queryset=..., to_attr="pub_books")` mein push karna hai.',
      },
      {
        title: 'Combining: select_related inside a Prefetch, and nested prefetch',
        titleHi: 'Combining: ek Prefetch ke andar select_related, aur nested prefetch',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import Prefetch
from django.test.utils import CaptureQueriesContext

class Category(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Store(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Product(models.Model):
    name = models.CharField(max_length=50)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="products")
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    class Meta:
        app_label = "__main__"

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    stars = models.PositiveSmallIntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    for m in (Category, Store, Product, Review): se.create_model(m)
cats = [Category.objects.create(name=f"C{i}") for i in range(3)]
stores = [Store.objects.create(name=f"S{i}") for i in range(4)]
prods = [Product.objects.create(name=f"P{i}", store=stores[i % 4], category=cats[i % 3])
         for i in range(20)]
Review.objects.bulk_create([Review(product=prods[i % 20], stars=(i % 5) + 1) for i in range(60)])

# stores -> their products (with each product's category) -> each product's reviews
with CaptureQueriesContext(connection) as ctx:
    qs = Store.objects.prefetch_related(
        Prefetch("products",
                 queryset=Product.objects.select_related("category").prefetch_related("reviews"))
    )
    for store in qs:
        for p in store.products.all():
            _ = p.category.name                       # from select_related in the prefetch qs
            _ = [r.stars for r in p.reviews.all()]     # from the nested prefetch
print("stores + products + categories + reviews:", len(ctx.captured_queries), "queries")
print("  (1 stores, 1 products, 1 categories via JOIN folded in, 1 reviews)")`,
        output: `stores + products + categories + reviews: 3 queries
  (1 stores, 1 products, 1 categories via JOIN folded in, 1 reviews)
`,
        explain: 'One query for stores. One query for all their products — and because that inner queryset has `select_related("category")`, the category columns are JOINed into *that same* products query (no separate categories query). One more query for all the reviews of those products (`prefetch_related("reviews")` nested inside). Total: 3 queries to render stores, their products, each product\'s category, and every review — regardless of how many stores, products, or reviews there are. This is the shape of an optimised list endpoint.',
        explainHi: 'Stores ke liye ek query. Unke saare products ke liye ek query — aur kyunki us inner queryset mein `select_related("category")` hai, category columns *usi* products query mein JOIN hote hain. Un products ke saare reviews ke liye ek aur query (`prefetch_related("reviews")` nested). Total: 3 queries stores, unke products, har product ki category, aur har review render karने ke liye — chahe kितne stores, products, ya reviews hon. Ye ek optimised list endpoint ka shape hai.',
      },
    ],

    mistakes: [
      {
        wrong: `class OrderListView(ListView):
    def get_queryset(self):
        return Order.objects.all()
# template: {% for o in orders %}{{ o.customer.name }} - {{ o.items.count }}{% endfor %}
# -> 1 + N (customer) + N (items.count) queries`,
        right: `def get_queryset(self):
    return (Order.objects
            .select_related("customer")           # forward FK -> JOIN
            .prefetch_related("items")             # reverse FK -> 1 extra query
            .annotate(item_count=Count("items")))  # count in SQL, not per-row
# template uses {{ o.customer.name }} and {{ o.item_count }} -> 3 queries flat`,
        why: 'A list view that touches a forward relation and a reverse relation per row is a double N+1. `select_related` folds the forward FK into the main query\'s JOIN; `prefetch_related` fetches the reverse set in one extra query; and `.annotate(Count(...))` computes the count in the database instead of a query per row. The three together make the endpoint O(1) in query count regardless of page size.',
        whyHi: 'Ek list view jо prati row ek forward relation aur ek reverse relation chhoota hai ek double N+1 hai. `select_related` forward FK ko main query ke JOIN mein fold karता hai; `prefetch_related` reverse set ko ek extra query mein fetch karता hai; aur `.annotate(Count(...))` count ko database mein compute karта hai. Teeno saath endpoint ko query count mein O(1) banाते hain.',
      },
      {
        wrong: `authors = Author.objects.prefetch_related("books")
for a in authors:
    recent = a.books.filter(year__gte=2020).order_by("-year")[:3]   # bypasses the prefetch cache
    # -> a fresh query per author, N+1 restored`,
        right: `from django.db.models import Prefetch
authors = Author.objects.prefetch_related(
    Prefetch("books",
             queryset=Book.objects.filter(year__gte=2020).order_by("-year"),
             to_attr="recent_books"))
for a in authors:
    recent = a.recent_books[:3]        # slice in Python -- from the single prefetch query`,
        why: 'The prefetch cache only backs `a.books.all()`. Any `.filter()`, `.exclude()`, `.order_by()`, `.count()`, or `.annotate()` on the related manager issues a new query — so filtering the prefetched relation in the loop recreates the N+1 you were trying to fix. Move the filter/order into a `Prefetch(queryset=...)`, land it on `to_attr`, and slice the resulting list in Python.',
        whyHi: 'Prefetch cache sirf `a.books.all()` ko back karता hai. Related manager par koi `.filter()`, `.order_by()`, `.count()` ek nayi query issue karता hai — toh loop mein prefetched relation filter karna wo N+1 phir banाता hai jise aap theek karने ki koshish kar rahe the. Filter/order ko ek `Prefetch(queryset=...)` mein move karो, `to_attr` par land karो, aur resulting list Python mein slice karो.',
      },
      {
        wrong: `# using select_related for a to-many relation
Author.objects.select_related("books")     # FieldError: 'books' is not a forward FK / O2O
# or worse, using it for an M2M and being surprised it doesn't work`,
        right: `Author.objects.prefetch_related("books")    # reverse FK -> prefetch
Article.objects.prefetch_related("tags")    # M2M -> prefetch
Order.objects.select_related("customer")    # forward FK -> select_related`,
        why: '`select_related` only works for relations where the parent row points at exactly one related row: a forward `ForeignKey` or a `OneToOneField` (and reverse `OneToOne`). A to-many relation (reverse FK, M2M) cannot be a JOIN without multiplying the parent rows, so `select_related` rejects it. Use `prefetch_related` for anything to-many. The mnemonic: `select_related` for what a row points *to*, `prefetch_related` for what points *at* it or that it has many of.',
        whyHi: '`select_related` sirf un relations ke liye kaam karता hai jahaan parent row bilkul ek related row par point karता hai: ek forward `ForeignKey` ya ek `OneToOneField`. Ek to-many relation ek JOIN nahi ho sakti bina parent rows multiply kiye, toh `select_related` ise reject karता hai. To-many kisi bhi cheez ke liye `prefetch_related` istemal karो.',
      },
    ],

    realWorld: [
      {
        en: '**Every DRF list endpoint\'s `get_queryset` ends with `.select_related(...).prefetch_related(...)`** sized to exactly what the serializer touches. A serializer field change that adds a nested relation must come with the matching prefetch, or the endpoint\'s query count jumps with page size. `assertNumQueries` in the endpoint test locks it.',
        hi: '**Har DRF list endpoint ka `get_queryset` `.select_related(...).prefetch_related(...)` par khatam hoता hai** bilkul jitna serializer chhoota hai. Ek serializer field change jо ek nested relation add karता hai iske saath matching prefetch aana chahिए.',
      },
      {
        en: '**`Prefetch(queryset=...)` is how you show "the 5 most recent comments per post" without N+1** — filter and order inside the Prefetch, land on `to_attr`, slice in Python (or a window function for a true per-group limit). Also used to prefetch only the columns you need (`.only(...)` inside the Prefetch queryset).',
        hi: '**`Prefetch(queryset=...)` aise aap "prati post 5 sabse recent comments" bina N+1 dikhाते ho** — Prefetch ke andar filter aur order, `to_attr` par land, Python mein slice.',
      },
      {
        en: '**`django-debug-toolbar` (dev) + `assertNumQueries` (CI) + occasionally `nplusone` or `django-silk`** is the standard N+1 defence. In production, APM (Sentry Performance, Datadog) flags endpoints whose query count or DB time scales with input — the signature of a missed prefetch (Module 9).',
        hi: '**`django-debug-toolbar` (dev) + `assertNumQueries` (CI) + kabhi `nplusone` ya `django-silk`** standard N+1 raksha hai. Production mein, APM un endpoints ko flag karता hai jinka query count input ke saath scale karता hai — ek missed prefetch ka signature (Module 9).',
      },
    ],

    interviewQA: [
      {
        q: 'What is the N+1 query problem, and how do `select_related` and `prefetch_related` each solve it?',
        qHi: 'N+1 query problem kya hai, aur `select_related` aur `prefetch_related` har ek ise kaise hal karते hain?',
        a: 'The N+1 problem is when you fetch a list of N rows in one query, and then in a loop you access a related object on each row that was not loaded in that first query, so each access triggers its own query. You end up with one query plus N more, and it scales linearly with the data. It is easy to introduce because the code looks innocent — iterating orders and reading order dot customer dot name — and it is invisible with a handful of test rows but crippling in production. The two fixes correspond to the two shapes of relationship. select_related is for to-one relationships: a forward foreign key or a one-to-one field, where each parent row points at exactly one related row. It works by adding a SQL JOIN to the original query, so the related row\'s columns come back in the same result set and Django populates the related object with no extra query. You can chain it across several foreign keys with the double-underscore syntax to JOIN a whole path. A nullable foreign key becomes a LEFT JOIN automatically. The cost is that each JOIN widens the rows and too many or too deep can make the one query slow, so you measure. prefetch_related is for to-many relationships: a many-to-many field, a reverse foreign key, a reverse one-to-one set, a generic relation. A JOIN there would multiply the parent rows, one per child, so instead Django runs a second query that selects all the related rows for the parents already fetched, using WHERE foreign-key-id IN the list of parent ids, and then matches them onto the parents in Python. It is a constant two queries regardless of how many parents. The catch is that the prefetch cache only serves the plain all call on the related manager; calling filter or count or order_by on it bypasses the cache and re-queries, so if you need a filtered or ordered subset you pass a Prefetch object with a custom queryset, optionally landing the result on a to_attr list. The two compose: you can select_related inside a Prefetch queryset, and you can nest prefetches with the double-underscore lookup.',
        aHi: 'N+1 problem tab hai jab aap N rows ki ek list ek query mein fetch karते ho, aur phir ek loop mein har row par ek related object access karते ho jо us pehli query mein load nahi hua, toh har access apni query trigger karता hai. Aapke paas ek query plus N aur ho jाते hain, aur ye data ke saath linearly scale karता hai. Ise introduce karna aasaan hai kyunki code masoom dikhता hai. Do fixes relationship ke do shapes se mel khाते hain. select_related to-one relationships ke liye hai: ek forward foreign key ya ek one-to-one field. Ye original query mein ek SQL JOIN add karके kaam karता hai, toh related row ke columns usi result set mein wapas aaते hain. Ek nullable foreign key apne aap ek LEFT JOIN ban jाता hai. prefetch_related to-many relationships ke liye hai: ek many-to-many field, ek reverse foreign key. Wahaan ek JOIN parent rows multiply karता, toh iske bजाy Django ek doosri query chalाता hai jо pehle se fetched parents ke saare related rows select karता hai, WHERE fk-id IN parent ids istemal karके, aur phir unhe Python mein parents par match karता hai. Catch ye hai ki prefetch cache sirf plain all call serve karता hai; ispar filter ya count call karna cache bypass karता hai.',
      },
      {
        q: 'You added `prefetch_related("comments")` but the endpoint still runs a query per row. Why?',
        qHi: 'Aapne `prefetch_related("comments")` add kiya par endpoint abhi bhi prati row ek query chalाता hai. Kyun?',
        a: 'Almost certainly because the code is not accessing the related set as a plain all call — it is calling filter, exclude, order_by, count, exists, or annotate on the related manager inside the loop. The prefetch works by running one extra query that loads all the comments for the fetched parents and caching that list on each parent under a private attribute. That cache is what backs parent dot comments dot all — calling all returns the cached list without a query. But the moment you call parent dot comments dot filter of something, or parent dot comments dot count, or parent dot comments dot order_by, the ORM cannot serve that from the cached full list; it builds and executes a fresh query against the database for that specific parent, and doing that in the loop is exactly the N+1 you were trying to remove. So common culprits are: a template or serializer that does comments dot filter is_public true, or comments dot count for a badge, or comments dot latest, or comments dot all but then the serializer re-orders or slices via a method. The fixes: if you need the count, use annotate with Count on the outer queryset so it comes back as a column, not a related-manager call. If you need a filtered or ordered subset of the related rows, pass a Prefetch object — prefetch_related of Prefetch of comments, with queryset equal to Comment dot objects filtered and ordered as you want, and to_attr set to a name like public_comments. Then access parent dot public_comments, which is a plain Python list produced by the single prefetch query, and slice it in Python if you need only the first few. Also check you are not accidentally re-fetching the base queryset — for instance calling the get_queryset function twice, or paginating a queryset that was prefetched before slicing, which can drop the prefetch. The debug toolbar or assertNumQueries around the view will show you exactly which query is repeating and its SQL, which points straight at the offending access.',
        aHi: 'Lगbhag nishchit roop se kyunki code related set ko ek plain all call ki tarah access nahi kar raha — ye loop ke andar related manager par filter, order_by, count, exists, ya annotate call kar raha hai. Prefetch ek extra query chalाकर kaam karता hai jо fetched parents ke saare comments load karता hai aur us list ko har parent par cache karता hai. Wo cache parent dot comments dot all ko back karता hai. Par jis pal aap parent dot comments dot filter, ya parent dot comments dot count, ya parent dot comments dot order_by call karते ho, ORM ise cached list se serve nahi kar sakta; ye us specific parent ke liye ek fresh query banाता aur execute karता hai, aur ise loop mein karna bilkul wo N+1 hai. Fixes: agar aapko count chahिए, outer queryset par Count ke saath annotate istemal karो. Agar aapko related rows ka ek filtered subset chahिए, ek Prefetch object pass karो — queryset aur to_attr ke saath. Phir parent dot us to_attr access karो, jо ek plain Python list hai.',
      },
    ],

    exercises: [
      {
        task: 'Model `Company`, `Employee` (FK to `Company`), `Department` (FK to `Company`). Create 5 companies, 4 employees each. Use `CaptureQueriesContext` to show: (a) `for e in Employee.objects.all(): e.company.name` runs 6 queries (1 + 5 companies, cached per instance); (b) `Employee.objects.select_related("company")` runs 1; (c) reading only `e.company_id` runs 1.',
        taskHi: '`Company`, `Employee` (FK), `Department` (FK) model karो. 5 companies, har ek 4 employees. `CaptureQueriesContext` se dikhाओ: (a) naive loop 6 queries; (b) `select_related("company")` 1; (c) sirf `e.company_id` 1.',
        hint: 'The naive count is 1 (employees) + one per distinct company on first access (Django caches `e.company` per instance, but different employees are different instances). `select_related("company")` = one `JOIN`. `e.company_id` is a column on the employee row.',
        hintHi: 'Naive count 1 (employees) + har distinct company par ek. `select_related("company")` = ek `JOIN`. `e.company_id` employee row par ek column hai.',
      },
      {
        task: 'Model `Course` and `Enrollment` (FK to `Course`, `related_name="enrollments"`, `passed` bool). 6 courses, 10 enrollments each (mixed `passed`). Show: (a) `for c in Course.objects.all(): list(c.enrollments.all())` = 7 queries; (b) `.prefetch_related("enrollments")` = 2; (c) `.prefetch_related("enrollments")` then `c.enrollments.filter(passed=True)` in the loop = 8 (cache bypassed); (d) `Prefetch("enrollments", queryset=Enrollment.objects.filter(passed=True), to_attr="passed_list")` = 2.',
        taskHi: '`Course` aur `Enrollment` (FK, `related_name="enrollments"`, `passed`) model karो. 6 courses, har ek 10 enrollments. Dikhाओ: (a) naive = 7; (b) `prefetch_related` = 2; (c) prefetch + `.filter()` loop mein = 8; (d) `Prefetch(queryset=, to_attr=)` = 2.',
        hint: '`from django.db.models import Prefetch`. `.all()` on the prefetched manager uses the cache; `.filter()` does not. `to_attr` gives you `c.passed_list` as a plain list from the single prefetch query.',
        hintHi: '`from django.db.models import Prefetch`. Prefetched manager par `.all()` cache istemal karता hai; `.filter()` nahi. `to_attr` `c.passed_list` deता hai.',
      },
      {
        task: 'Model `Region`, `Warehouse` (FK to `Region`), `Item` (FK to `Warehouse`, `related_name="items"`), `Item.supplier` (FK to a `Supplier`). Build one queryset that loads regions, their warehouses, each warehouse\'s items, and each item\'s supplier in **3 queries total** using `prefetch_related` with a nested `Prefetch` whose queryset does `select_related("supplier")`. Verify with `CaptureQueriesContext`.',
        taskHi: '`Region`, `Warehouse` (FK), `Item` (FK, `related_name="items"`), `Item.supplier` (FK) model karो. Ek queryset banाओ jо regions, unke warehouses, har warehouse ke items, aur har item ka supplier **kul 3 queries** mein load kare, ek nested `Prefetch` istemal karके jiska queryset `select_related("supplier")` kare.',
        hint: '`Region.objects.prefetch_related(Prefetch("warehouses", queryset=Warehouse.objects.prefetch_related(Prefetch("items", queryset=Item.objects.select_related("supplier")))))`. Queries: regions, warehouses, items+suppliers (JOIN folded in).',
        hintHi: '`Region.objects.prefetch_related(Prefetch("warehouses", queryset=Warehouse.objects.prefetch_related(Prefetch("items", queryset=Item.objects.select_related("supplier")))))`.',
      },
    ],

    keyTakeaways: [
      'N+1: fetch N rows, then access an unloaded related object per row -> 1 + N queries. The most common Django perf bug; invisible with few rows, fatal at scale. Every list endpoint needs `select_related` and/or `prefetch_related`.',
      '`select_related(*fields)` — forward `ForeignKey` / `OneToOneField` (to-one). Adds a SQL JOIN so related columns come back in the SAME query, 0 extra hits. Chain a path: `select_related("a__b__c")`. Nullable FK -> automatic `LEFT JOIN`. Too many/deep JOINs can slow the one query — measure.',
      '`prefetch_related(*lookups)` — `ManyToManyField`, reverse `ForeignKey` (`author.books`), reverse M2M, `GenericRelation` (to-many). Runs ONE extra query (`WHERE fk_id IN (...)`) and joins in Python. Constant 2 queries regardless of parent count. Nest with `prefetch_related("books__reviews")`.',
      'The prefetch cache ONLY backs `rel.all()`. `rel.filter()`/`.count()`/`.order_by()`/`.exists()` on the related manager BYPASS the cache and re-query per parent — recreating the N+1.',
      '`Prefetch("rel", queryset=..., to_attr="name")` customises the inner query: filter/order/annotate/`select_related` the prefetched set, and land it on a plain list attribute (`obj.name`) instead of the manager cache. Slice that list in Python.',
      '`select_related` and `prefetch_related` compose. `select_related` INSIDE a `Prefetch` queryset folds the child\'s FKs into the prefetch query. Use `.annotate(Count("rel"))` for a related COUNT instead of `rel.count()` per row.',
      'Rule of thumb: `select_related` for what a row points TO (forward FK, O2O); `prefetch_related` for what points AT it / that it has many of.',
      'Detect: `with self.assertNumQueries(n):` in tests (CI gate), `django-debug-toolbar` (dev, shows duplicates), `CaptureQueriesContext` (scripts), `nplusone`/`django-silk`. `print(qs.query)` for the SQL, `qs.explain()` for the plan.',
    ],
    keyTakeawaysHi: [
      'N+1: N rows fetch karो, phir prati row ek unloaded related object access karो -> 1 + N queries. Sabse aam Django perf bug; kam rows ke saath invisible, scale par fatal. Har list endpoint ko `select_related` aur/ya `prefetch_related` chahिए.',
      '`select_related(*fields)` — forward `ForeignKey` / `OneToOneField` (to-one). Ek SQL JOIN add karता hai taaki related columns USI query mein wapas aayें, 0 extra hits. Ek path chain karो: `select_related("a__b__c")`. Nullable FK -> apne aap `LEFT JOIN`.',
      '`prefetch_related(*lookups)` — `ManyToManyField`, reverse `ForeignKey`, reverse M2M (to-many). EK extra query (`WHERE fk_id IN (...)`) chalाता hai aur Python mein join karता hai. Parent count chahे jо ho constant 2 queries. `prefetch_related("books__reviews")` se nest karो.',
      'Prefetch cache SIRF `rel.all()` ko back karता hai. Related manager par `rel.filter()`/`.count()`/`.order_by()` cache BYPASS karते hain aur prati parent re-query — N+1 phir banाते hue.',
      '`Prefetch("rel", queryset=..., to_attr="name")` inner query customise karता hai: prefetched set ko filter/order/annotate/`select_related` karो, aur ise ek plain list attribute (`obj.name`) par land karो. Us list ko Python mein slice karो.',
      '`select_related` aur `prefetch_related` compose hote hain. Ek `Prefetch` queryset ke ANDAR `select_related` child ke FKs prefetch query mein fold karता hai. Ek related COUNT ke liye `rel.count()` prati row ke bजाय `.annotate(Count("rel"))` istemal karो.',
      'Rule of thumb: `select_related` us cheez ke liye jispar ek row point karता hai (forward FK, O2O); `prefetch_related` us cheez ke liye jо ispar point karता hai / jiske ye kai rakhता hai.',
      'Detect: tests mein `with self.assertNumQueries(n):` (CI gate), `django-debug-toolbar` (dev), `CaptureQueriesContext` (scripts), `nplusone`/`django-silk`. `print(qs.query)` SQL ke liye, `qs.explain()` plan ke liye.',
    ],
  },
];
