/**
 * Django Complete Course — Module 3: QuerySets, Query Optimization & the N+1 Problem, lessons 4-6.
 *
 * Lesson 4: annotations & aggregation — aggregate() vs annotate(), Count/Sum/Avg,
 *           distinct, the JOIN-inflates-counts trap, conditional Case/When,
 *           values().annotate() = GROUP BY, filter-before vs filter-after.
 * Lesson 5: only/defer/values/values_list & bulk ops — trimming columns,
 *           dicts vs instances, bulk_create/bulk_update, in_bulk.
 * Lesson 6: finding & fixing N+1 — measuring (assertNumQueries,
 *           CaptureQueriesContext, debug toolbar), explain(), indexes, workflow.
 *
 * NOTE for future editors: same conventions as course-django-module3.ts.
 *  - Every backtick inside simple/simpleHi/content/contentHi is `\``.
 *  - `$` before `{` in template literals -> `\${`.
 *  - `examples` use `code` + `output`, ASCII-only output, run with `python`.
 *  - Boot standalone Django; models get `class Meta: app_label = "__main__"`.
 *  - Count queries with `from django.test.utils import CaptureQueriesContext`.
 *  - explain() output is backend/version-specific -- assert on shape, not text.
 *  - Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_3_PART2: CourseLesson[] = [
  {
    slug: 'dj-annotations-and-aggregation',
    title: 'Annotations & Aggregation: annotate(), aggregate(), and GROUP BY',
    titleHi: 'Annotations Aur Aggregation: annotate(), aggregate(), Aur GROUP BY',
    description: '`aggregate()` collapses a whole queryset to one dictionary of numbers; `annotate()` attaches a computed value to every row. Get the difference, learn the JOIN-inflates-your-counts trap, and you can push counts, sums, and conditional tallies into one SQL statement instead of looping in Python.',
    descriptionHi: '`aggregate()` ek poore queryset ko numbers ki ek dictionary mein collapse karता hai; `annotate()` har row par ek computed value attach karता hai. Antar samjhो, JOIN-aapke-counts-inflate-karता trap seekhо, aur aap counts, sums, aur conditional tallies ko ek SQL statement mein push kar sakte ho Python mein loop karने ke bजाय.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A spreadsheet: one summary cell at the bottom, versus a new column beside every row.** `aggregate()` is the cell at the bottom of a column that says `=SUM(B2:B999)` — it takes the whole selection and gives you back a single number (or a few: sum, average, max). You lose the rows; you keep the totals. `annotate()` is inserting a new column C where each cell is a formula *about that row* — `=COUNTIF(orders, A2)` giving each customer their order count, right next to their name, rows intact. The trap is what happens when your "spreadsheet" is actually two sheets stitched together by a JOIN: if you count a customer\'s orders *and* their support tickets in the same annotate, the JOIN produces one row per (order, ticket) pair, so a customer with 3 orders and 4 tickets shows up 12 times and every count is multiplied. The fix is either `Count("orders", distinct=True)` (dedupe within the count) or a subquery so each tally is computed on its own. And `values("country").annotate(total=Sum("revenue"))` is the pivot-table move: it collapses to one row per country with the revenue summed — that is a SQL `GROUP BY`.',
      hi: '**Ek spreadsheet: neeche ek summary cell, versus har row ke bagal mein ek naya column.** `aggregate()` ek column ke neeche wo cell hai jо `=SUM(B2:B999)` kehta hai — ye poori selection leta hai aur ek single number wapas deta hai. Aap rows khो dete ho; totals rakhte ho. `annotate()` ek naya column C daalna hai jahaan har cell *us row ke baare mein* ek formula hai — har customer ko unka order count, unke naam ke bagal, rows intact. Trap wo hai jо hoता hai jab aapki "spreadsheet" asal mein ek JOIN se sile do sheets hain: agar aap ek customer ke orders *aur* unke support tickets ek hi annotate mein count karते ho, JOIN prati (order, ticket) pair ek row produce karता hai, toh 3 orders aur 4 tickets waala customer 12 baar dikhता hai. Fix ya toh `Count("orders", distinct=True)` hai ya ek subquery. Aur `values("country").annotate(total=Sum("revenue"))` pivot-table move hai — wo ek SQL `GROUP BY` hai.',
    },

    simple: `**\`aggregate()\` -> a dict of numbers for the WHOLE queryset**

\`\`\`python
from django.db.models import Count, Sum, Avg, Max, Min

Order.objects.aggregate(Sum("total_cents"))
# -> {"total_cents__sum": 154900}

Order.objects.filter(status="paid").aggregate(
    revenue=Sum("total_cents"),
    order_count=Count("id"),
    biggest=Max("total_cents"),
    avg=Avg("total_cents"),
)
# -> {"revenue": ..., "order_count": ..., "biggest": ..., "avg": ...}   (one dict, no rows)
\`\`\`

**\`annotate()\` -> a computed attribute on EVERY row**

\`\`\`python
authors = Author.objects.annotate(book_count=Count("books"))
for a in authors:
    print(a.name, a.book_count)          # book_count is a real attribute, computed in SQL

Author.objects.annotate(book_count=Count("books")).filter(book_count__gte=3)   # HAVING
Author.objects.annotate(book_count=Count("books")).order_by("-book_count")
\`\`\`

**The JOIN-inflates-counts trap**

\`\`\`python
# WRONG: two Count()s over different relations -> the JOINs multiply
Author.objects.annotate(
    n_books=Count("books"),        # if an author has 3 books and 2 awards,
    n_awards=Count("awards"),      # the JOIN yields 6 rows -> n_books=6, n_awards=6
)

# RIGHT: distinct=True, or separate the aggregates  (alias must not match a field name)
Author.objects.annotate(
    n_books=Count("books", distinct=True),
    n_awards=Count("awards", distinct=True),
)
\`\`\`

**Conditional aggregation: \`Case\` / \`When\` / filtered \`Count\`**

\`\`\`python
from django.db.models import Count, Q, Case, When, IntegerField

Author.objects.annotate(
    published=Count("books", filter=Q(books__status="published")),   # count only some
    drafts=Count("books", filter=Q(books__status="draft")),
)

Order.objects.aggregate(
    paid_total=Sum(Case(When(status="paid", then="total_cents"), default=0)),
)
\`\`\`

**\`values(...).annotate(...)\` == SQL \`GROUP BY\`**

\`\`\`python
Order.objects.values("customer__country").annotate(revenue=Sum("total_cents")).order_by("-revenue")
# -> [{"customer__country": "IN", "revenue": 90000}, {"customer__country": "US", ...}, ...]
#    one row PER country, revenue summed within each  (a GROUP BY customer.country)
\`\`\`

**filter before vs after annotate**

\`\`\`python
Author.objects.filter(books__year=2024).annotate(n=Count("books"))   # n = books IN 2024 only
Author.objects.annotate(n=Count("books")).filter(n__gte=5)           # n = ALL books, then HAVING n>=5
\`\`\`

\`\`\`
aggregate(**exprs)   terminal; returns  {alias: value}  for the whole queryset
annotate(**exprs)    lazy; adds  <alias>  to each row; you can then filter/order_by/values on it
  Count Sum Avg Max Min StdDev Variance   + Count(..., distinct=True)  + Count(..., filter=Q(...))
  Case(When(cond, then=val), ..., default=)   for per-row conditionals
  Coalesce(expr, fallback)   turn NULL sums into 0
  Subquery(inner) / OuterRef("field")   correlated subquery when a JOIN would inflate

values("a").annotate(agg)   -> GROUP BY a   (one row per distinct "a")
filter() BEFORE annotate()  -> restrict rows entering the aggregate  (WHERE)
filter() AFTER  annotate()  -> restrict on the aggregate value       (HAVING)
\`\`\``,

    simpleHi: `**\`aggregate()\` -> POORE queryset ke liye numbers ki ek dict**

\`\`\`python
from django.db.models import Count, Sum, Avg, Max, Min

Order.objects.aggregate(Sum("total_cents"))
# -> {"total_cents__sum": 154900}

Order.objects.filter(status="paid").aggregate(
    revenue=Sum("total_cents"),
    order_count=Count("id"),
    avg=Avg("total_cents"),
)
# -> ek dict, koi rows nahi
\`\`\`

**\`annotate()\` -> HAR row par ek computed attribute**

\`\`\`python
authors = Author.objects.annotate(book_count=Count("books"))
for a in authors:
    print(a.name, a.book_count)          # book_count ek asli attribute hai, SQL mein computed

Author.objects.annotate(book_count=Count("books")).filter(book_count__gte=3)   # HAVING
Author.objects.annotate(book_count=Count("books")).order_by("-book_count")
\`\`\`

**JOIN-inflates-counts trap**

\`\`\`python
# GALAT: alag relations par do Count()s -> JOINs multiply karते hain
Author.objects.annotate(
    n_books=Count("books"),        # agar ek author ke 3 books aur 2 awards,
    n_awards=Count("awards"),      # JOIN 6 rows deता hai -> n_books=6, n_awards=6
)

# SAHI: distinct=True  (alias field naam se match nahi hona chahिए)
Author.objects.annotate(
    n_books=Count("books", distinct=True),
    n_awards=Count("awards", distinct=True),
)
\`\`\`

**Conditional aggregation: \`Case\` / \`When\` / filtered \`Count\`**

\`\`\`python
from django.db.models import Count, Q, Case, When

Author.objects.annotate(
    published=Count("books", filter=Q(books__status="published")),
    drafts=Count("books", filter=Q(books__status="draft")),
)

Order.objects.aggregate(
    paid_total=Sum(Case(When(status="paid", then="total_cents"), default=0)),
)
\`\`\`

**\`values(...).annotate(...)\` == SQL \`GROUP BY\`**

\`\`\`python
Order.objects.values("customer__country").annotate(revenue=Sum("total_cents")).order_by("-revenue")
# -> prati country ek row, har mein revenue summed  (ek GROUP BY customer.country)
\`\`\`

**filter annotate se pehle vs baad**

\`\`\`python
Author.objects.filter(books__year=2024).annotate(n=Count("books"))   # n = sirf 2024 ki books
Author.objects.annotate(n=Count("books")).filter(n__gte=5)           # n = SAARI books, phir HAVING
\`\`\`

\`\`\`
aggregate(**exprs)   terminal; poore queryset ke liye  {alias: value}  lautाता hai
annotate(**exprs)    lazy; har row par  <alias>  add karता hai; phir filter/order_by/values kar sakte ho
  Count Sum Avg Max Min   + Count(..., distinct=True)  + Count(..., filter=Q(...))
  Case(When(cond, then=val), ..., default=)   per-row conditionals ke liye
  Coalesce(expr, fallback)   NULL sums ko 0 banाओ
  Subquery(inner) / OuterRef("field")   correlated subquery jab ek JOIN inflate karता

values("a").annotate(agg)   -> GROUP BY a
filter() annotate se PEHLE  -> aggregate mein aane waali rows restrict  (WHERE)
filter() annotate ke BAAD   -> aggregate value par restrict            (HAVING)
\`\`\``,

    content: `## \`aggregate()\` — a summary for the whole queryset

\`aggregate(**kwargs)\` is a **terminal** method (it runs SQL and returns a plain \`dict\`, not a QuerySet). Each keyword is an alias mapped to an aggregate expression over the *entire* filtered queryset:

\`\`\`python
stats = Order.objects.filter(created__year=2024).aggregate(
    count=Count("id"),
    revenue=Sum("total_cents"),
    avg_order=Avg("total_cents"),
    biggest=Max("total_cents"),
)
# stats == {"count": 1240, "revenue": 5_600_000, "avg_order": 4516.1, "biggest": 90_000}
\`\`\`

Without an alias, Django names the key \`<field>__<func>\` (\`Sum("total_cents")\` -> \`total_cents__sum\`). If the queryset is empty, \`Sum\`/\`Avg\`/\`Max\`/\`Min\` return \`None\` — wrap in \`Coalesce(Sum(...), 0)\` if you need a number.

## \`annotate()\` — a computed value per row

\`annotate(**kwargs)\` is **lazy** and returns a QuerySet where every result object has the new attribute, computed in SQL:

\`\`\`python
authors = (Author.objects
           .annotate(book_count=Count("books"),
                     latest_book=Max("books__published_at"))
           .filter(book_count__gt=0)
           .order_by("-book_count"))

for a in authors:
    print(a.name, a.book_count, a.latest_book)   # attributes, no extra queries
\`\`\`

Because the annotation is a real column in the query, you can \`.filter()\` on it (SQL \`HAVING\`), \`.order_by()\` it, use it in a further \`.annotate()\`, or select it with \`.values()\`.

## The counting-across-JOINs trap

When you aggregate over a to-many relation, Django adds a \`JOIN\`, and rows multiply. One \`Count\` is fine (Django is smart). **Two aggregates over different to-many relations in the same \`annotate\` multiply each other:**

\`\`\`python
# an author with 3 books and 2 awards:
# the JOIN of books x awards produces 6 rows
Author.objects.annotate(books=Count("books"), awards=Count("awards"))
# -> books == 6, awards == 6      (WRONG)
\`\`\`

Fixes, in order of preference:

1. **\`distinct=True\`**: \`Count("books", distinct=True)\` counts distinct book ids even across the inflated rows. Simple, works for \`Count\`.
2. **Subquery**: compute each tally in its own correlated subquery so there is no shared JOIN:
   \`\`\`python
   from django.db.models import OuterRef, Subquery, Count
   book_count = (Book.objects.filter(author=OuterRef("pk"))
                 .values("author").annotate(c=Count("id")).values("c"))
   Author.objects.annotate(books=Subquery(book_count))
   \`\`\`
3. **Separate queries**: two \`annotate\` calls on two querysets, combined in Python.

\`Sum\` across an inflated JOIN is worse — there is no \`distinct\` that helps; use subqueries or separate the aggregates.

## Conditional aggregation

Count or sum only the rows meeting a condition:

\`\`\`python
from django.db.models import Count, Sum, Q, Case, When, IntegerField

# filtered aggregate (the clean modern form):
Author.objects.annotate(
    published=Count("books", filter=Q(books__status="published")),
    drafts=Count("books", filter=Q(books__status="draft")),
)

# Case/When for sums and non-count conditionals:
Order.objects.aggregate(
    paid=Sum(Case(When(status="paid", then="total_cents"), default=0)),
    refunded=Sum(Case(When(status="refunded", then="total_cents"), default=0)),
)

# Case/When as a per-row label:
Order.objects.annotate(
    tier=Case(
        When(total_cents__gte=10000, then=Value("gold")),
        When(total_cents__gte=1000, then=Value("silver")),
        default=Value("bronze"),
    )
)
\`\`\`

## \`values().annotate()\` — \`GROUP BY\`

\`values(*fields).annotate(agg)\` groups by those fields and produces one row per group:

\`\`\`python
# revenue per country:
Order.objects.values("customer__country").annotate(total=Sum("total_cents")).order_by("-total")

# orders per day:
Order.objects.values("created__date").annotate(n=Count("id")).order_by("created__date")

# two-level grouping:
Order.objects.values("customer__country", "status").annotate(n=Count("id"))
\`\`\`

Watch the interaction with \`Meta.ordering\`: a model with default ordering adds the ordering column to the \`GROUP BY\`, splitting your groups. Add an explicit \`.order_by()\` (even \`.order_by()\` with no args) to clear it.

## \`filter()\` position

- **\`filter()\` before \`annotate()\`**: restricts which rows *feed* the aggregate — a \`WHERE\`. \`Author.objects.filter(books__year=2024).annotate(n=Count("books"))\` — \`n\` counts only 2024 books.
- **\`filter()\` after \`annotate()\`**: restricts on the aggregate result — a \`HAVING\`. \`Author.objects.annotate(n=Count("books")).filter(n__gte=5)\` — \`n\` counts all books, then keeps authors with ≥ 5.
- Both: \`filter(status="active").annotate(n=Count("books")).filter(n__gte=5)\`.

## \`Coalesce\`, \`Subquery\`, \`OuterRef\`

\`Coalesce(Sum("x"), 0)\` turns an empty-set \`NULL\` into \`0\`. \`Subquery\` + \`OuterRef\` compute a correlated value per row without a JOIN — the tool for "the latest order date per customer", "the count of X per Y" when a JOIN would inflate, or pulling one field from a related row. Django's \`Exists()\` subquery is the efficient form of \`.filter(rel__isnull=False)\` for "has any".`,

    contentHi: `## \`aggregate()\` — poore queryset ke liye ek summary

\`aggregate(**kwargs)\` ek **terminal** method hai (ye SQL chalाता hai aur ek plain \`dict\` lautाता hai, ek QuerySet nahi). Har keyword ek alias hai jо *poore* filtered queryset par ek aggregate expression par mapped hai.

Ek alias ke bina, Django key ko \`<field>__<func>\` naam deता hai. Agar queryset khali hai, \`Sum\`/\`Avg\`/\`Max\`/\`Min\` \`None\` lautाते hain — \`Coalesce(Sum(...), 0)\` mein wrap karो agar aapko ek number chahिए.

## \`annotate()\` — prati row ek computed value

\`annotate(**kwargs)\` **lazy** hai aur ek QuerySet lautाता hai jahaan har result object ke paas naya attribute hai, SQL mein computed:

\`\`\`python
authors = (Author.objects
           .annotate(book_count=Count("books"))
           .filter(book_count__gt=0)
           .order_by("-book_count"))
\`\`\`

Kyunki annotation query mein ek asli column hai, aap ispar \`.filter()\` kar sakte ho (SQL \`HAVING\`), \`.order_by()\`, ise ek aur \`.annotate()\` mein istemal, ya \`.values()\` se select.

## Counting-across-JOINs trap

Jab aap ek to-many relation par aggregate karते ho, Django ek \`JOIN\` add karता hai, aur rows multiply hoती hain. Ek \`Count\` theek hai. **Ek hi \`annotate\` mein alag to-many relations par do aggregates ek doosre ko multiply karते hain:**

\`\`\`python
# 3 books aur 2 awards waala author:
Author.objects.annotate(n_books=Count("books"), n_awards=Count("awards"))
# -> n_books == 6, n_awards == 6      (GALAT)
\`\`\`

Fixes:

1. **\`distinct=True\`**: \`Count("books", distinct=True)\`.
2. **Subquery**: har tally apne correlated subquery mein.
3. **Alag queries**: do querysets, Python mein combine.

## Conditional aggregation

\`\`\`python
Author.objects.annotate(
    published=Count("books", filter=Q(books__status="published")),
    drafts=Count("books", filter=Q(books__status="draft")),
)

Order.objects.aggregate(
    paid=Sum(Case(When(status="paid", then="total_cents"), default=0)),
)
\`\`\`

## \`values().annotate()\` — \`GROUP BY\`

\`\`\`python
Order.objects.values("customer__country").annotate(total=Sum("total_cents")).order_by("-total")
Order.objects.values("created__date").annotate(n=Count("id")).order_by("created__date")
\`\`\`

Ek model default ordering ke saath ordering column ko \`GROUP BY\` mein add karता hai, aapke groups ko split karके. Ek explicit \`.order_by()\` add karो.

## \`filter()\` position

- **\`filter()\` \`annotate()\` se pehle**: kaunsी rows aggregate ko *feed* karती hain — ek \`WHERE\`.
- **\`filter()\` \`annotate()\` ke baad**: aggregate result par — ek \`HAVING\`.

## \`Coalesce\`, \`Subquery\`, \`OuterRef\`

\`Coalesce(Sum("x"), 0)\` ek empty-set \`NULL\` ko \`0\` banाता hai. \`Subquery\` + \`OuterRef\` prati row ek correlated value compute karते hain bina ek JOIN ke.`,

    examples: [
      {
        title: 'aggregate() collapses; annotate() adds a per-row column',
        titleHi: 'aggregate() collapse karता hai; annotate() ek per-row column add karता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import Count, Sum, Avg, Max

class Author(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Book(models.Model):
    title = models.CharField(max_length=100)
    price_cents = models.PositiveIntegerField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Author); se.create_model(Book)
a1 = Author.objects.create(name="Ada")
a2 = Author.objects.create(name="Bo")
a3 = Author.objects.create(name="Cy")   # no books
Book.objects.bulk_create([
    Book(title="A1", price_cents=1000, author=a1), Book(title="A2", price_cents=3000, author=a1),
    Book(title="A3", price_cents=2000, author=a1), Book(title="B1", price_cents=500, author=a2),
])

# aggregate: ONE dict for the whole queryset
print("aggregate:", Book.objects.aggregate(
    n=Count("id"), revenue=Sum("price_cents"), avg=Avg("price_cents"), top=Max("price_cents")))

# annotate: a column on every Author row
rows = (Author.objects.annotate(book_count=Count("books"), catalog_value=Sum("books__price_cents"))
        .order_by("-book_count"))
for a in rows:
    print(f"  {a.name}: {a.book_count} books, value={a.catalog_value}")

# filter AFTER annotate -> HAVING
print("authors with >= 2 books:",
      list(Author.objects.annotate(n=Count("books")).filter(n__gte=2).values_list("name", flat=True)))

# empty-set Sum is None -> Coalesce it
from django.db.models.functions import Coalesce
print("Cy's catalog value, coalesced:",
      Author.objects.filter(name="Cy").aggregate(v=Coalesce(Sum("books__price_cents"), 0))["v"])`,
        output: `aggregate: {'n': 4, 'revenue': 6500, 'avg': 1625.0, 'top': 3000}
  Ada: 3 books, value=6000
  Bo: 1 books, value=500
  Cy: 0 books, value=None
authors with >= 2 books: ['Ada']
Cy's catalog value, coalesced: 0
`,
        explain: '`Book.objects.aggregate(...)` runs one query and returns a single dict of numbers for all books — the rows are gone. `Author.objects.annotate(book_count=Count("books"), ...)` returns Authors, each with `book_count` and `catalog_value` computed by SQL (`Cy` gets `0` and `None` — no books, so `Sum` is `NULL`). `.filter(n__gte=2)` after `.annotate` becomes a `HAVING` clause. `Coalesce(Sum(...), 0)` converts the empty-set `NULL` to `0` when you need a numeric result.',
        explainHi: '`Book.objects.aggregate(...)` ek query chalाता hai aur saari books ke liye numbers ki ek single dict lautाता hai — rows chale gaye. `Author.objects.annotate(book_count=Count("books"), ...)` Authors lautाता hai, har ek `book_count` ke saath SQL dwara computed (`Cy` ko `0` aur `None` milता hai). `.annotate` ke baad `.filter(n__gte=2)` ek `HAVING` clause ban jाता hai. `Coalesce(Sum(...), 0)` empty-set `NULL` ko `0` mein badalता hai.',
      },
      {
        title: 'The JOIN-inflates-counts trap and the distinct=True fix',
        titleHi: 'JOIN-inflates-counts trap aur distinct=True fix',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import Count, OuterRef, Subquery, IntegerField

class Author(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Book(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    class Meta:
        app_label = "__main__"

class Award(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="awards")
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    for m in (Author, Book, Award): se.create_model(m)
ada = Author.objects.create(name="Ada")
Book.objects.bulk_create([Book(author=ada) for _ in range(3)])
Award.objects.bulk_create([Award(author=ada) for _ in range(2)])

# WRONG: two Count()s over different to-many relations -> the books x awards JOIN = 6 rows
# (annotation aliases must NOT match a field/related_name, so use n_books / n_awards)
wrong = Author.objects.annotate(n_books=Count("books"), n_awards=Count("awards")).get(name="Ada")
print("naive:  books =", wrong.n_books, " awards =", wrong.n_awards, " (should be 3 and 2)")

# FIX 1: distinct=True counts distinct related ids across the inflated rows
fixed = Author.objects.annotate(
    n_books=Count("books", distinct=True),
    n_awards=Count("awards", distinct=True),
).get(name="Ada")
print("distinct: books =", fixed.n_books, " awards =", fixed.n_awards)

# FIX 2: subqueries -- each tally computed independently, no shared JOIN
book_sq = (Book.objects.filter(author=OuterRef("pk"))
           .values("author").annotate(c=Count("id")).values("c"))
award_sq = (Award.objects.filter(author=OuterRef("pk"))
            .values("author").annotate(c=Count("id")).values("c"))
sub = Author.objects.annotate(
    n_books=Subquery(book_sq, output_field=IntegerField()),
    n_awards=Subquery(award_sq, output_field=IntegerField()),
).get(name="Ada")
print("subquery: books =", sub.n_books, " awards =", sub.n_awards)`,
        output: `naive:  books = 6  awards = 6  (should be 3 and 2)
distinct: books = 3  awards = 2
subquery: books = 3  awards = 2
`,
        explain: 'Annotating `Count("books")` and `Count("awards")` together forces Django to JOIN both to-many relations; the 3 books and 2 awards combine into 3 x 2 = 6 rows, and each `Count` sees 6. `Count("books", distinct=True)` counts distinct book ids even in the inflated result, recovering 3 and 2. Subqueries are the more general fix — each count is a separate correlated query with `OuterRef("pk")`, so there is no shared JOIN and `Sum` (which `distinct` cannot rescue) works too.',
        explainHi: '`Count("books")` aur `Count("awards")` ko saath annotate karna Django ko dono to-many relations JOIN karने ko majboor karता hai; 3 books aur 2 awards 3 x 2 = 6 rows mein combine hote hain, aur har `Count` 6 dekhता hai. `Count("books", distinct=True)` inflated result mein bhi distinct book ids count karता hai. Subqueries zyada general fix hain — har count `OuterRef("pk")` ke saath ek alag correlated query hai.',
      },
      {
        title: 'values().annotate() is GROUP BY; conditional aggregation with filter=Q',
        titleHi: 'values().annotate() GROUP BY hai; filter=Q ke saath conditional aggregation',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import Count, Sum, Q

class Order(models.Model):
    country = models.CharField(max_length=2)
    status = models.CharField(max_length=10)
    total_cents = models.PositiveIntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Order)
rows = [
    ("IN", "paid", 1000), ("IN", "paid", 3000), ("IN", "refunded", 500),
    ("US", "paid", 5000), ("US", "pending", 2000), ("US", "paid", 1000),
    ("DE", "paid", 4000),
]
Order.objects.bulk_create([Order(country=c, status=s, total_cents=t) for c, s, t in rows])

# GROUP BY country: one row per country
by_country = (Order.objects.values("country")
              .annotate(orders=Count("id"), revenue=Sum("total_cents"))
              .order_by("-revenue"))
for r in by_country:
    print(f"  {r['country']}: {r['orders']} orders, revenue={r['revenue']}")

# conditional aggregation: paid vs refunded revenue per country, in one query
split = (Order.objects.values("country")
         .annotate(
             paid=Sum("total_cents", filter=Q(status="paid")),
             refunded=Sum("total_cents", filter=Q(status="refunded")),
             paid_count=Count("id", filter=Q(status="paid")),
         ).order_by("country"))
for r in split:
    print(f"  {r['country']}: paid={r['paid']} refunded={r['refunded']} paid_orders={r['paid_count']}")`,
        output: `  US: 3 orders, revenue=8000
  IN: 3 orders, revenue=4500
  DE: 1 orders, revenue=4000
  DE: paid=4000 refunded=None paid_orders=1
  IN: paid=4000 refunded=500 paid_orders=2
  US: paid=6000 refunded=None paid_orders=2
`,
        explain: '`values("country").annotate(...)` emits `GROUP BY country` — one output row per distinct country with the aggregates computed within each group. `Sum("total_cents", filter=Q(status="paid"))` is conditional aggregation: it sums only the rows in the group where `status="paid"`, so a single query gives you paid revenue, refunded revenue, and paid order count per country — no Python looping, no multiple round trips. (`refunded` is `None` for groups with no refunds; `Coalesce(..., 0)` if you want zeros.)',
        explainHi: '`values("country").annotate(...)` `GROUP BY country` emit karता hai — prati distinct country ek output row aggregates ke saath. `Sum("total_cents", filter=Q(status="paid"))` conditional aggregation hai: ye group mein sirf un rows ko sum karता hai jahaan `status="paid"`, toh ek single query aapko prati country paid revenue, refunded revenue, aur paid order count deता hai — koi Python looping nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `# count related objects per row with a Python loop
authors = Author.objects.all()
for a in authors:
    a.n_books = a.books.count()      # a query PER author -> N+1
context = {"authors": authors}`,
        right: `authors = Author.objects.annotate(n_books=Count("books"))
# one query; a.n_books is a column`,
        why: 'Calling `.count()` (or `len(list(...))`) on a related manager inside a loop is an N+1 — one query per parent. `annotate(n_books=Count("books"))` computes the count for every row in the *same* query as a SQL aggregate. Same for sums, averages, and "latest date" — push them into `annotate` rather than iterating.',
        whyHi: 'Ek loop ke andar ek related manager par `.count()` call karna ek N+1 hai — prati parent ek query. `annotate(n_books=Count("books"))` har row ke liye count ko *usi* query mein ek SQL aggregate ki tarah compute karता hai. Sums, averages ke liye bhi wahi — unhe `annotate` mein push karो.',
      },
      {
        wrong: `stats = Author.objects.annotate(
    published=Count("books", filter=Q(books__status="published")),
    reviews=Count("reviews"),            # different to-many relation
)
# published and reviews are both inflated by the books x reviews JOIN`,
        right: `stats = Author.objects.annotate(
    published=Count("books", filter=Q(books__status="published"), distinct=True),
    reviews=Count("reviews", distinct=True),
)
# or use Subquery for each, or split into two querysets`,
        why: 'Any time an `annotate` aggregates over two or more different to-many relations, Django JOINs them and the rows multiply — every count and sum in that annotate is wrong (multiplied by the size of the other relation). `distinct=True` fixes `Count`; `Sum` needs subqueries or a separate query. If you see suspiciously large or equal counts, this is why.',
        whyHi: 'Jab bhi ek `annotate` do ya zyada alag to-many relations par aggregate karता hai, Django unhe JOIN karता hai aur rows multiply hoती hain — us annotate mein har count aur sum galat hai. `distinct=True` `Count` theek karता hai; `Sum` ko subqueries chahिए. Agar aap sandehjानak roop se bade ya barabar counts dekhते ho, yahi wajah hai.',
      },
      {
        wrong: `# model has Meta.ordering = ["name"]
Order.objects.values("country").annotate(n=Count("id"))
# -> GROUP BY country, name  -- the ordering column sneaks into GROUP BY, splitting groups`,
        right: `Order.objects.values("country").annotate(n=Count("id")).order_by()
# .order_by() with no args clears Meta.ordering -> GROUP BY country only`,
        why: 'When a model defines `Meta.ordering`, Django appends that column to every query\'s `ORDER BY` — and for a `values().annotate()` GROUP BY, an `ORDER BY` column that is not in the `GROUP BY` must itself be grouped, so Django adds it to the `GROUP BY`. Your "one row per country" becomes "one row per (country, name)". Always add an explicit `.order_by(...)` (or bare `.order_by()`) to a `values().annotate()` aggregation.',
        whyHi: 'Jab ek model `Meta.ordering` define karता hai, Django us column ko har query ke `ORDER BY` mein append karता hai — aur ek `values().annotate()` GROUP BY ke liye, ek `ORDER BY` column jо `GROUP BY` mein nahi khud grouped hona chahिए, toh Django ise `GROUP BY` mein add karता hai. Aapka "prati country ek row" "prati (country, name) ek row" ban jाता hai. Hamesha ek explicit `.order_by()` add karो.',
      },
    ],

    realWorld: [
      {
        en: '**Dashboards and reports are `values().annotate()` GROUP BYs** — revenue per month, signups per plan, error count per service per hour, tickets per agent per status. Computed in one SQL statement, often cached (Module 7) or written to a summary table by a nightly job (Module 9). The alternative — pulling rows and tallying in Python — does not scale.',
        hi: '**Dashboards aur reports `values().annotate()` GROUP BYs hain** — prati mahine revenue, prati plan signups, prati service prati ghanta error count. Ek SQL statement mein computed, aksar cached (Module 7) ya ek nightly job dwara ek summary table mein likha (Module 9).',
      },
      {
        en: '**Filtered `Count`/`Sum` (`filter=Q(...)`) computes multiple tallies in one pass** — "orders: 40 total, 32 paid, 5 refunded, 3 pending" as one query per row group. Replaced dozens of separate `.filter(...).count()` calls in older codebases.',
        hi: '**Filtered `Count`/`Sum` (`filter=Q(...)`) ek pass mein kai tallies compute karता hai** — "orders: 40 total, 32 paid, 5 refunded" ek query mein. Purane codebases mein dozens alag `.filter(...).count()` calls ki jagah.',
      },
      {
        en: '**`Subquery`/`OuterRef` handles "one value from a related row per parent"** — the latest order date per customer, the top-priced item per category, whether a user has an active subscription (`Exists`). It avoids both the N+1 of per-row access and the count-inflation of multi-JOIN annotates.',
        hi: '**`Subquery`/`OuterRef` "prati parent ek related row se ek value" handle karता hai** — prati customer latest order date, prati category top-priced item, kya ek user ke paas active subscription hai (`Exists`). Ye per-row access ke N+1 aur multi-JOIN annotates ke count-inflation dono se bachता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `aggregate()` and `annotate()`?',
        qHi: '`aggregate()` aur `annotate()` mein kya antar hai?',
        a: 'aggregate is a terminal operation that summarises the entire queryset into a single dictionary of values. You call it with keyword arguments mapping an alias to an aggregate expression like Sum, Count, Avg, Max, over the whole filtered set, and it immediately runs SQL and returns a plain Python dict — the individual rows are gone, you get totals. It is what you use for a headline number: total revenue this month, number of active users, average order value. annotate is a lazy queryset operation that adds a computed value to every row. You call it with an alias mapped to an expression, and you get back a queryset where each result object has that alias as an attribute, computed by the database. Because the annotation becomes a real column in the SQL, you can then filter on it, which compiles to a HAVING clause, order by it, use it in another annotation, or select it with values. It is what you use for per-entity computed data: each author with their book count, each product with its average rating, each customer with their lifetime spend. A useful way to remember it: aggregate is the sum cell at the bottom of a spreadsheet column, annotate is a new formula column beside every row. There is also a combined pattern, values of some fields then annotate, which produces a GROUP BY: one output row per distinct combination of the values fields, with the aggregate computed within each group — that is how you build revenue-per-country or signups-per-day reports in one query. One subtlety with both: an empty set makes Sum, Avg, Max, Min return None rather than zero, so you wrap them in Coalesce when you need a number, and aggregating over multiple to-many relations at once causes JOIN inflation that multiplies your counts, which you fix with distinct or subqueries.',
        aHi: 'aggregate ek terminal operation hai jо poore queryset ko values ki ek single dictionary mein summarise karता hai. Aap ise keyword arguments ke saath call karते ho jо ek alias ko ek aggregate expression jaise Sum, Count, Avg par map karते hain, poore filtered set par, aur ye turant SQL chalाता hai aur ek plain Python dict lautाता hai — individual rows chale gaye, aapko totals milते hain. Ye ek headline number ke liye hai. annotate ek lazy queryset operation hai jо har row par ek computed value add karता hai. Aapko ek queryset wapas milता hai jahaan har result object ke paas wo alias ek attribute ki tarah hai, database dwara computed. Kyunki annotation SQL mein ek asli column ban jाता hai, aap phir ispar filter kar sakte ho, jо ek HAVING clause mein compile hoता hai, ispar order by, ya values se select. Yaad rakhने ka ek tarika: aggregate spreadsheet column ke neeche sum cell hai, annotate har row ke bagal ek naya formula column hai. Ek combined pattern bhi hai, values phir annotate, jо ek GROUP BY produce karता hai. Ek sookshमता: ek empty set Sum ko None lautाता hai, zero nahi.',
      },
      {
        q: 'Why can annotating two counts over different relations give wrong numbers, and how do you fix it?',
        qHi: 'Alag relations par do counts annotate karna galat numbers kyun de sakta hai, aur aap ise kaise theek karते ho?',
        a: 'When you annotate an aggregate over a to-many relation — a reverse foreign key or a many-to-many — Django has to JOIN that relation into the query so the aggregate function has rows to work on. With a single such aggregate, Django is careful and the count is right. But when a single annotate call aggregates over two different to-many relations, Django JOINs both, and the result is a Cartesian product: for a parent with three rows in relation A and two rows in relation B, the joined result has six rows, one for each combination. Now every aggregate in that annotate is computed over those six rows. A Count of relation A sees six instead of three, a Count of relation B sees six instead of two, and a Sum is inflated by the same factor. The counts often come out equal to each other and larger than expected, which is the tell. The fixes, in order of preference: first, add distinct equals True to each Count, which makes it count distinct primary keys of the related rows even within the inflated result, recovering the true counts — this works for Count but not for Sum. Second, and more general, compute each aggregate as its own correlated subquery using OuterRef to reference the parent primary key, so each tally runs against its own relation with no shared JOIN; this works for Sum and any aggregate. Third, split into separate querysets, annotate each independently, and combine the results in Python, which is simplest when the subquery gets awkward. The underlying lesson is that mixing multiple to-many aggregations in one query is a known footgun; when you need several, reach for subqueries or filtered aggregates rather than stacking annotate arguments.',
        aHi: 'Jab aap ek to-many relation par ek aggregate annotate karते ho — ek reverse foreign key ya ek many-to-many — Django ko us relation ko query mein JOIN karna padता hai taaki aggregate function ke paas kaam karने ko rows hon. Ek aise aggregate ke saath, Django saावdhaन hai aur count sahi hai. Par jab ek single annotate call do alag to-many relations par aggregate karता hai, Django dono JOIN karता hai, aur parinaम ek Cartesian product hai: relation A mein teen rows aur relation B mein do rows waale ek parent ke liye, joined result mein chhah rows hain. Ab us annotate mein har aggregate un chhah rows par computed hai. Relation A ka ek Count teen ke bजाy chhah dekhता hai. Fixes: pehला, har Count mein distinct equals True add karो, jо ise inflated result mein bhi related rows ke distinct primary keys count karवाता hai — ye Count ke liye kaam karता hai par Sum ke liye nahi. Doosra, zyada general, har aggregate ko OuterRef ke saath apne correlated subquery ki tarah compute karो. Teesra, alag querysets mein split karो.',
      },
    ],

    exercises: [
      {
        task: 'Model `Store` and `Sale` (FK to `Store`, `related_name="sales"`, `amount_cents` int, `channel` CharField `"web"`/`"pos"`). Create 3 stores with several sales each. Print: (a) `Sale.objects.aggregate(total=Sum("amount_cents"), n=Count("id"))`; (b) per-store `annotate(sale_count=Count("sales"), revenue=Sum("sales__amount_cents"))` sorted by `-revenue`; (c) stores with `revenue` over some threshold via `.filter(revenue__gt=...)` after annotate.',
        taskHi: '`Store` aur `Sale` (FK, `related_name="sales"`, `amount_cents`, `channel`) model karो. 3 stores banाओ. Print karो: (a) `aggregate(total=Sum, n=Count)`; (b) per-store `annotate(sale_count=Count, revenue=Sum)` `-revenue` se sorted; (c) `.filter(revenue__gt=...)` annotate ke baad.',
        hint: '`from django.db.models import Count, Sum`. `.annotate(revenue=Sum("sales__amount_cents")).filter(revenue__gt=X)` — the `filter` after `annotate` is a `HAVING`. A store with no sales gets `revenue=None`.',
        hintHi: '`.annotate(revenue=Sum("sales__amount_cents")).filter(revenue__gt=X)` — `annotate` ke baad `filter` ek `HAVING` hai. Bina sales waale store ko `revenue=None` milता hai.',
      },
      {
        task: 'Reproduce the JOIN-inflation trap. Model `Team`, `Player` (FK to `Team`, `related_name="players"`), `Trophy` (FK to `Team`, `related_name="trophies"`). Create one team with 4 players and 3 trophies. Print `Team.objects.annotate(p=Count("players"), t=Count("trophies")).get()` — show `p` and `t` are both 12 (4x3). Then print the same with `distinct=True` on both — show 4 and 3.',
        taskHi: 'JOIN-inflation trap reproduce karो. `Team`, `Player` (FK, `related_name="players"`), `Trophy` (FK, `related_name="trophies"`) model karो. Ek team 4 players aur 3 trophies ke saath. `annotate(p=Count("players"), t=Count("trophies"))` print karो — dono 12 dikhाओ. Phir `distinct=True` ke saath — 4 aur 3.',
        hint: 'The `players x trophies` JOIN yields 4x3 = 12 rows; each `Count` sees 12. `Count("players", distinct=True)` counts distinct player ids -> 4. `Count("trophies", distinct=True)` -> 3.',
        hintHi: '`players x trophies` JOIN 4x3 = 12 rows deता hai. `Count("players", distinct=True)` -> 4.',
      },
      {
        task: 'Model `Ticket` (`team` CharField, `status` CharField `"open"`/`"closed"`, `priority` int). Insert ~12 tickets. Use `values("team").annotate(...)` to produce one row per team with: `total=Count("id")`, `open_count=Count("id", filter=Q(status="open"))`, `high_prio_open=Count("id", filter=Q(status="open", priority__gte=3))`. Add `.order_by("team")`. Print each row dict.',
        taskHi: '`Ticket` (`team`, `status`, `priority`) model karो. ~12 tickets insert karो. `values("team").annotate(...)` istemal karके prati team ek row banाओ: `total`, `open_count` (`filter=Q(status="open")`), `high_prio_open`. `.order_by("team")` add karो.',
        hint: '`from django.db.models import Count, Q`. `Count("id", filter=Q(status="open", priority__gte=3))` counts only rows matching both conditions within each `team` group. Always add an explicit `.order_by()` to a `values().annotate()`.',
        hintHi: '`Count("id", filter=Q(status="open", priority__gte=3))` har `team` group mein sirf dono conditions match karती rows count karता hai. Hamesha ek explicit `.order_by()` add karो.',
      },
    ],

    keyTakeaways: [
      '`aggregate(**exprs)` is TERMINAL: runs SQL, returns a `{alias: value}` dict for the WHOLE queryset (rows discarded). `annotate(**exprs)` is LAZY: adds `<alias>` as a computed attribute to EVERY row; you can then `.filter()` (-> `HAVING`), `.order_by()`, or `.values()` it.',
      'Aggregate functions: `Count`, `Sum`, `Avg`, `Max`, `Min`, `StdDev`, `Variance`. Empty set -> `Sum`/`Avg`/`Max`/`Min` return `None` — wrap in `Coalesce(Sum(...), 0)` for a number.',
      'JOIN-INFLATION TRAP: aggregating over TWO+ different to-many relations in one `annotate` JOINs them -> rows multiply -> every count/sum is wrong (multiplied). Fix: `Count(..., distinct=True)` (Count only), `Subquery`+`OuterRef` (any aggregate), or separate querysets.',
      'Conditional aggregation: `Count("x", filter=Q(...))` / `Sum("x", filter=Q(...))` tallies only matching rows — multiple tallies in ONE query. `Case(When(cond, then=val), default=val)` for per-row conditionals and non-count sums.',
      '`values(*fields).annotate(agg)` = SQL `GROUP BY` — one output row per distinct combination of `fields`, aggregate computed per group. The basis of every dashboard/report query.',
      'A model with `Meta.ordering` sneaks its ordering column into the `GROUP BY` of a `values().annotate()`, splitting groups. ALWAYS add an explicit `.order_by(...)` (or bare `.order_by()`).',
      '`filter()` BEFORE `annotate()` = `WHERE` (restrict rows feeding the aggregate). `filter()` AFTER `annotate()` = `HAVING` (restrict on the aggregate value). Both can be used.',
      'NEVER `for x in qs: x.n = x.rel.count()` in a loop (N+1). Use `annotate(n=Count("rel"))`. `Subquery`/`OuterRef`/`Exists` for "one related value / does related exist" per row without a JOIN.',
    ],
    keyTakeawaysHi: [
      '`aggregate(**exprs)` TERMINAL hai: SQL chalाता hai, POORE queryset ke liye ek `{alias: value}` dict lautाता hai (rows discard). `annotate(**exprs)` LAZY hai: HAR row par `<alias>` ek computed attribute ki tarah add karता hai; phir `.filter()` (-> `HAVING`), `.order_by()`, ya `.values()` kar sakte ho.',
      'Aggregate functions: `Count`, `Sum`, `Avg`, `Max`, `Min`. Empty set -> `Sum`/`Avg`/`Max`/`Min` `None` lautाते hain — ek number ke liye `Coalesce(Sum(...), 0)` mein wrap karो.',
      'JOIN-INFLATION TRAP: ek `annotate` mein DO+ alag to-many relations par aggregate karna unhe JOIN karता hai -> rows multiply -> har count/sum galat. Fix: `Count(..., distinct=True)` (sirf Count), `Subquery`+`OuterRef` (koi bhi aggregate), ya alag querysets.',
      'Conditional aggregation: `Count("x", filter=Q(...))` / `Sum("x", filter=Q(...))` sirf matching rows tally karता hai — EK query mein kai tallies. `Case(When(cond, then=val), default=val)` per-row conditionals ke liye.',
      '`values(*fields).annotate(agg)` = SQL `GROUP BY` — prati distinct combination ek output row. Har dashboard/report query ka aadhaar.',
      '`Meta.ordering` waala ek model apni ordering column ko `values().annotate()` ke `GROUP BY` mein ghusाता hai, groups split karके. HAMESHA ek explicit `.order_by(...)` add karो.',
      '`filter()` `annotate()` se PEHLE = `WHERE`. `filter()` `annotate()` ke BAAD = `HAVING`. Dono istemal ho sakte hain.',
      'KABHI ek loop mein `for x in qs: x.n = x.rel.count()` nahi (N+1). `annotate(n=Count("rel"))` istemal karो. `Subquery`/`OuterRef`/`Exists` "prati row ek related value / kya related maujूd hai" ke liye bina ek JOIN.',
    ],
  },

  {
    slug: 'dj-only-defer-values-and-bulk',
    title: 'only(), defer(), values(), and Bulk Operations',
    titleHi: 'only(), defer(), values(), Aur Bulk Operations',
    description: '`only()` and `defer()` trim the columns a query loads; `values()` and `values_list()` skip model instantiation entirely and hand you dicts or tuples. `bulk_create` and `bulk_update` turn thousands of INSERT/UPDATE statements into one. Each is a lever for a specific bottleneck.',
    descriptionHi: '`only()` aur `defer()` ek query jо columns load karता hai unhe trim karते hain; `values()` aur `values_list()` model instantiation poori tarah skip karते hain aur aapko dicts ya tuples dete hain. `bulk_create` aur `bulk_update` hazaaron INSERT/UPDATE statements ko ek mein badalते hain. Har ek ek specific bottleneck ke liye ek lever hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**Ordering from a warehouse: full crates, a short packing list, or just a tally sheet.** A normal queryset is "send me the full crate for each item" — every column, wrapped as a model object with all its methods. `only("name", "price")` is "just the name and price slips from each crate, leave the rest" — you still get a crate (a model instance) but reaching for an un-slipped field triggers a follow-up delivery. `defer("description")` is the same idea from the other end: "everything except the bulky manual". `values("name", "price")` is "skip the crates entirely, just give me a list of name/price pairs on paper" — dicts, no model objects, no methods, much lighter when you are only going to serialize or aggregate. And `bulk_create` / `bulk_update` is the difference between the warehouse processing your 5000-item order as 5000 separate shipments versus one pallet: same goods, a hundredth of the paperwork and round trips.',
      hi: '**Ek warehouse se order karna: poore crates, ek chhoti packing list, ya bस ek tally sheet.** Ek normal queryset "har item ke liye poora crate bhejो" hai — har column, saari methods ke saath ek model object mein wrapped. `only("name", "price")` "har crate se bस name aur price slips, baaki chhodो" hai — aapko abhi bhi ek crate (ek model instance) milता hai par ek un-slipped field ke liye pahुँchna ek follow-up delivery trigger karता hai. `defer("description")` doosre chhor se wahi vichaar hai. `values("name", "price")` "crates poori tarah skip karो, bस kaagaz par name/price pairs ki ek list do" hai — dicts, koi model objects nahi. Aur `bulk_create` / `bulk_update` warehouse ke aapke 5000-item order ko 5000 alag shipments versus ek pallet ki tarah process karने ka antar hai.',
    },

    simple: `**\`only()\` / \`defer()\` — load fewer columns, still model instances**

\`\`\`python
Book.objects.only("title", "price_cents")     # SELECT id, title, price_cents  (id always included)
Book.objects.defer("description", "toc")       # SELECT everything EXCEPT description, toc

b = Book.objects.only("title").first()
b.title            # already loaded -> 0 queries
b.price_cents      # NOT loaded -> triggers  SELECT price_cents WHERE id=?   (a per-object query!)
\`\`\`

**\`values()\` / \`values_list()\` — dicts / tuples, NO model instances**

\`\`\`python
Book.objects.values("id", "title")            # -> <QuerySet [{"id": 1, "title": "X"}, ...]>
Book.objects.values_list("id", "title")       # -> <QuerySet [(1, "X"), (2, "Y"), ...]>
Book.objects.values_list("id", flat=True)     # -> <QuerySet [1, 2, 3, ...]>   (single field only)
Book.objects.values_list("id", "title", named=True)   # -> namedtuples

# spans relations, works with annotate (GROUP BY):
Book.objects.values("author__name").annotate(n=Count("id"))
\`\`\`

**When to use which**

\`\`\`
full queryset     you need model instances + their methods + FK descriptors
only()/defer()    you need instances but a few columns are huge (TextField, JSONField) and unused
values()          you only serialize/aggregate; no model behaviour needed; feeds .annotate() GROUP BY
values_list(flat) you need a flat list of one column (ids for a filter, choices, an export column)
\`\`\`

**Bulk writes**

\`\`\`python
# INSERT many rows in one (batched) statement -- NO save(), NO signals, NO auto_now_add
Book.objects.bulk_create(
    [Book(title=f"B{i}", author=a) for i in range(10_000)],
    batch_size=1000,
)

# UPDATE many existing rows -- NO save(), NO signals, NO auto_now
for b in books:
    b.price_cents = int(b.price_cents * 1.1)
Book.objects.bulk_update(books, ["price_cents"], batch_size=1000)

# upsert-ish:
Book.objects.bulk_create(rows, update_conflicts=True,
                         unique_fields=["isbn"], update_fields=["price_cents", "title"])

# fetch many by pk into a dict:
Book.objects.in_bulk([1, 2, 3])               # -> {1: <Book>, 2: <Book>, 3: <Book>}
Book.objects.in_bulk(["978-...", ...], field_name="isbn")
\`\`\`

**\`update()\` / \`delete()\` on a queryset**

\`\`\`python
Book.objects.filter(author=a).update(archived=True)   # one UPDATE, NO save()/signals/auto_now
Book.objects.filter(created__lt=cutoff).delete()      # bulk delete (cascades + delete signals DO fire)
\`\`\`

\`\`\`
only(*fields)    SELECT id + listed; OTHER fields load lazily per-object (a hidden N+1 risk)
defer(*fields)   SELECT all EXCEPT listed; same lazy-load caveat
values(*f)       QuerySet of dicts; keys are field paths ("author__name" allowed)
values_list(*f)  QuerySet of tuples; flat=True for one field; named=True for namedtuples

bulk_create(objs, batch_size=, ignore_conflicts=, update_conflicts=, unique_fields=, update_fields=)
bulk_update(objs, fields, batch_size=)      -- objs must already have pks
in_bulk(id_list=None, *, field_name="pk")   -- {key: instance}
QuerySet.update(**kw) / .delete()           -- set-based; update skips save/signals/auto_now
\`\`\``,

    simpleHi: `**\`only()\` / \`defer()\` — kam columns load, abhi bhi model instances**

\`\`\`python
Book.objects.only("title", "price_cents")     # SELECT id, title, price_cents
Book.objects.defer("description", "toc")       # description, toc CHHODकर sab

b = Book.objects.only("title").first()
b.title            # pehle se loaded -> 0 queries
b.price_cents      # load NAHI hua -> SELECT price_cents WHERE id=?  trigger  (ek per-object query!)
\`\`\`

**\`values()\` / \`values_list()\` — dicts / tuples, KOI model instances nahi**

\`\`\`python
Book.objects.values("id", "title")            # -> [{"id": 1, "title": "X"}, ...]
Book.objects.values_list("id", "title")       # -> [(1, "X"), (2, "Y"), ...]
Book.objects.values_list("id", flat=True)     # -> [1, 2, 3, ...]   (sirf single field)

Book.objects.values("author__name").annotate(n=Count("id"))    # relations span, annotate ke saath
\`\`\`

**Kab kaunsा istemal karें**

\`\`\`
full queryset     model instances + methods + FK descriptors chahिए
only()/defer()    instances chahिए par kuch columns bade hain (TextField, JSONField) aur unused
values()          sirf serialize/aggregate; koi model behaviour nahi; .annotate() GROUP BY feed karता
values_list(flat) ek column ki flat list chahिए (filter ke liye ids, export column)
\`\`\`

**Bulk writes**

\`\`\`python
# ek (batched) statement mein kai rows INSERT -- KOI save(), signals, auto_now_add nahi
Book.objects.bulk_create([Book(title=f"B{i}", author=a) for i in range(10_000)], batch_size=1000)

# kai maujूd rows UPDATE -- KOI save(), signals, auto_now nahi
Book.objects.bulk_update(books, ["price_cents"], batch_size=1000)

# upsert-ish:
Book.objects.bulk_create(rows, update_conflicts=True,
                         unique_fields=["isbn"], update_fields=["price_cents", "title"])

Book.objects.in_bulk([1, 2, 3])               # -> {1: <Book>, 2: <Book>, 3: <Book>}
\`\`\`

**\`update()\` / \`delete()\` ek queryset par**

\`\`\`python
Book.objects.filter(author=a).update(archived=True)   # ek UPDATE, KOI save()/signals/auto_now nahi
Book.objects.filter(created__lt=cutoff).delete()      # bulk delete (cascades + delete signals FIRE hote hain)
\`\`\`

\`\`\`
only(*fields)    SELECT id + listed; DOOSRE fields prati-object lazily load (ek chhupा N+1 risk)
defer(*fields)   listed CHHODकर sab SELECT; wahi lazy-load caveat
values(*f)       dicts ka QuerySet; keys field paths hain ("author__name" allowed)
values_list(*f)  tuples ka QuerySet; ek field ke liye flat=True; namedtuples ke liye named=True

bulk_create(objs, batch_size=, ignore_conflicts=, update_conflicts=, unique_fields=, update_fields=)
bulk_update(objs, fields, batch_size=)      -- objs ke paas pehle se pks hone chahिए
in_bulk(id_list=None, *, field_name="pk")   -- {key: instance}
QuerySet.update(**kw) / .delete()           -- set-based; update save/signals/auto_now skip karता
\`\`\``,

    content: `## \`only()\` and \`defer()\` — column projection with instances

By default a queryset selects every concrete field. If a model has a large \`TextField\`, a \`JSONField\`, or a \`BinaryField\` you rarely read on list pages, you can exclude it:

- **\`only(*fields)\`** — select only \`id\` (always) plus the named fields.
- **\`defer(*fields)\`** — select every field *except* the named ones.

You still get model **instances**, with methods and FK descriptors. The catch: accessing a field that was **not** loaded triggers a fresh \`SELECT\` for that field on **that one object** — so \`.only("title")\` then \`for b in books: b.price_cents\` is an N+1 in disguise. Use \`only\`/\`defer\` only for fields you are confident you will not touch in that code path. \`only\` combined with \`select_related\` needs the related fields named too: \`.only("title", "author__name").select_related("author")\`.

## \`values()\` and \`values_list()\` — skip the model layer

When you do not need model behaviour — you are going to serialize to JSON, feed an aggregate, or export a column — \`values()\` / \`values_list()\` return the raw rows without building model instances:

\`\`\`python
Book.objects.values("id", "title", "author__name")
# -> <QuerySet [{"id": 1, "title": "X", "author__name": "Ada"}, ...]>

Book.objects.values_list("id", flat=True)
# -> <QuerySet [1, 2, 3, ...]>   -- flat=True only with ONE field

Book.objects.values_list("id", "title", named=True)
# -> <QuerySet [Row(id=1, title="X"), ...]>   -- lightweight namedtuples
\`\`\`

This is significantly faster and lighter for large result sets because it skips the per-row \`Model.__init__\` and descriptor setup. It also spans relations (\`author__name\`) and is the input to a \`GROUP BY\` (\`values(...).annotate(...)\`). Downside: no methods, no \`get_absolute_url\`, no \`Fk\` object — just data.

Common uses:
- \`list(qs.values_list("id", flat=True))\` -> a list of ids for a \`__in\` filter or a bulk operation.
- \`qs.values("category").annotate(n=Count("id"))\` -> a report.
- A fast serializer for a read-heavy list endpoint (or DRF's \`Serializer\` over \`.values()\`).

## \`bulk_create\` — one INSERT for many rows

\`\`\`python
Book.objects.bulk_create(
    [Book(title=t, author_id=aid) for t, aid in rows],
    batch_size=1000,               # rows per INSERT statement (tune for your DB's param limit)
    ignore_conflicts=True,          # skip rows that violate a unique constraint
    # OR: upsert
    update_conflicts=True, unique_fields=["isbn"], update_fields=["price_cents"],
)
\`\`\`

Constraints and caveats:
- **No \`save()\`**, so no \`save()\` override logic, no \`pre_save\`/\`post_save\` signals (\`m2m_changed\` never applies).
- **\`auto_now_add\` is NOT applied** — set the timestamp explicitly on each object.
- On databases that support \`RETURNING\` (Postgres, SQLite 3.35+), the created objects get their \`pk\` back; on others they do not.
- M2M relations cannot be set in \`bulk_create\` — create the objects, then bulk-create the through rows.

## \`bulk_update\` — one UPDATE for many rows

\`\`\`python
for b in books:
    b.status = compute_status(b)
Book.objects.bulk_update(books, ["status", "updated_at"], batch_size=1000)
\`\`\`

- The objects must already have \`pk\`s (they are matched by pk).
- You list which fields to write; others are untouched.
- **No \`save()\`, no signals, no \`auto_now\`** — include \`updated_at\` in the field list and set it yourself.
- Django emits \`UPDATE ... SET field = CASE WHEN id=1 THEN ... END, ...\` per batch.

## \`QuerySet.update()\` and \`.delete()\`

\`update(**kwargs)\` is a single set-based \`UPDATE\` over the filtered rows — the fastest way to change a column for many rows, and race-safe with \`F()\` expressions. It runs **no \`save()\`, no signals, no \`auto_now\`**; pass \`updated_at=timezone.now()\` yourself.

\`delete()\` on a queryset does a bulk delete but **does** collect and cascade dependent objects and **does** fire \`pre_delete\`/\`post_delete\` (it instantiates the objects to do so — for millions of rows, delete in batches or use raw SQL with a DB-level \`ON DELETE CASCADE\`).

## \`in_bulk()\`

\`\`\`python
by_id = Book.objects.in_bulk([1, 2, 3])              # {1: <Book>, 2: <Book>, 3: <Book>}
by_isbn = Book.objects.in_bulk(isbns, field_name="isbn")
\`\`\`

One query, returns a dict keyed by pk (or a unique field). The efficient way to hydrate a known set of ids without a loop of \`.get()\` calls.

## Choosing

| Need | Use |
|---|---|
| model instances + methods | plain queryset (+ \`select_related\`/\`prefetch_related\`) |
| instances, but skip a huge unused column | \`defer("big_col")\` or \`only(...)\` — carefully |
| just data for JSON / aggregation | \`values()\` / \`values_list()\` |
| a flat list of one column | \`values_list("f", flat=True)\` |
| insert thousands of rows | \`bulk_create(batch_size=...)\` |
| update a computed field on thousands | \`bulk_update(objs, [fields])\` |
| set one column for a filtered set | \`QuerySet.update()\` |
| hydrate a known id set | \`in_bulk(ids)\` |`,

    contentHi: `## \`only()\` aur \`defer()\` — instances ke saath column projection

Default roop se ek queryset har concrete field select karта hai. Agar ek model ke paas ek bada \`TextField\`, ek \`JSONField\` hai jise aap list pages par shायad hi padhते ho, aap ise exclude kar sakte ho:

- **\`only(*fields)\`** — sirf \`id\` (hamesha) plus named fields select karो.
- **\`defer(*fields)\`** — named ones ke *alावा* har field select karो.

Aapko abhi bhi model **instances** milते hain. Catch: ek field access karna jо load **nahi** hua us **ek object** par us field ke liye ek fresh \`SELECT\` trigger karता hai — toh \`.only("title")\` phir \`for b in books: b.price_cents\` bhes badle mein ek N+1 hai.

## \`values()\` aur \`values_list()\` — model layer skip karो

Jab aapko model behaviour nahi chahिए, \`values()\` / \`values_list()\` raw rows lautाते hain bina model instances banाye:

\`\`\`python
Book.objects.values("id", "title", "author__name")   # dicts
Book.objects.values_list("id", flat=True)             # [1, 2, 3, ...]  -- flat=True sirf EK field ke saath
Book.objects.values_list("id", "title", named=True)   # namedtuples
\`\`\`

Ye bade result sets ke liye kaafi tez aur halka hai kyunki ye per-row \`Model.__init__\` skip karता hai. Ye relations bhi span karता hai aur ek \`GROUP BY\` ka input hai.

## \`bulk_create\` — kai rows ke liye ek INSERT

\`\`\`python
Book.objects.bulk_create(
    [Book(title=t, author_id=aid) for t, aid in rows],
    batch_size=1000, ignore_conflicts=True,
)
\`\`\`

Constraints:
- **Koi \`save()\` nahi**, toh koi \`save()\` override, koi \`pre_save\`/\`post_save\` signals nahi.
- **\`auto_now_add\` lागू NAHI hoता** — timestamp explicitly set karो.
- \`RETURNING\` support waale databases par (Postgres, SQLite 3.35+), created objects ko \`pk\` wapas milता hai.
- M2M relations \`bulk_create\` mein set nahi ho sakti.

## \`bulk_update\` — kai rows ke liye ek UPDATE

\`\`\`python
Book.objects.bulk_update(books, ["status", "updated_at"], batch_size=1000)
\`\`\`

- Objects ke paas pehle se \`pk\`s hone chahिए.
- **Koi \`save()\`, koi signals, koi \`auto_now\` nahi** — \`updated_at\` field list mein shaamil karो aur khud set karो.

## \`QuerySet.update()\` aur \`.delete()\`

\`update(**kwargs)\` ek single set-based \`UPDATE\` hai — kai rows ke liye ek column badalने ka sabse tez tarika, aur \`F()\` expressions ke saath race-safe. **Koi \`save()\`, koi signals, koi \`auto_now\` nahi**.

\`delete()\` ek bulk delete karता hai par dependent objects collect aur cascade **karता hai** aur \`pre_delete\`/\`post_delete\` **fire karता hai**.

## \`in_bulk()\`

\`\`\`python
by_id = Book.objects.in_bulk([1, 2, 3])              # {1: <Book>, ...}
\`\`\`

Ek query, ek dict lautाता hai pk (ya ek unique field) se keyed.`,

    examples: [
      {
        title: 'only() loads fewer columns -- but touching a deferred field re-queries',
        titleHi: 'only() kam columns load karta hai -- par ek deferred field chhoona re-query karता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.test.utils import CaptureQueriesContext

class Article(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()          # large -- rarely needed on a list page
    views = models.IntegerField(default=0)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Article)
Article.objects.bulk_create([Article(title=f"T{i}", body="x" * 5000, views=i) for i in range(20)])

# only("title", "views"): the SELECT lists just id, title, views
with CaptureQueriesContext(connection) as ctx:
    lst = list(Article.objects.only("title", "views"))
    for a in lst:
        _ = a.title, a.views          # loaded -> 0 extra queries
sql = ctx.captured_queries[0]["sql"]
print("only() selected body?:", "body" in sql, "| queries:", len(ctx.captured_queries))

# touching the deferred 'body' -> a query PER object
with CaptureQueriesContext(connection) as ctx:
    for a in Article.objects.only("title"):
        _ = a.body                    # NOT loaded -> SELECT body WHERE id=?
print("only('title') then read .body on 20 rows:", len(ctx.captured_queries), "queries")

# values(): dicts, no instances, spans a relation, very light
with CaptureQueriesContext(connection) as ctx:
    data = list(Article.objects.values("id", "title")[:3])
print("values():", data, "| queries:", len(ctx.captured_queries))
print("values_list flat:", list(Article.objects.values_list("id", flat=True))[:5])`,
        output: `only() selected body?: False | queries: 1
only('title') then read .body on 20 rows: 21 queries
values(): [{'id': 1, 'title': 'T0'}, {'id': 2, 'title': 'T1'}, {'id': 3, 'title': 'T2'}] | queries: 1
values_list flat: [1, 2, 3, 4, 5]
`,
        explain: '`only("title", "views")` builds a `SELECT` that omits `body` — confirmed by `"body" not in sql` — so a list page that never renders the article body avoids transferring 5 KB per row. But `.only("title")` followed by `a.body` in a loop triggers one `SELECT body WHERE id=?` per object: 1 + 20 = 21 queries, a hidden N+1. `values("id", "title")` returns plain dicts in one query with no model instantiation — the lightest option when you only need data; `values_list("id", flat=True)` gives a flat list of one column.',
        explainHi: '`only("title", "views")` ek `SELECT` banाता hai jо `body` chhodता hai — toh ek list page jо article body kabhi render nahi karता prati row 5 KB transfer karने se bachता hai. Par `.only("title")` ke baad ek loop mein `a.body` prati object ek `SELECT body WHERE id=?` trigger karता hai: 1 + 20 = 21 queries, ek chhupा N+1. `values("id", "title")` ek query mein plain dicts lautाता hai bina model instantiation ke.',
      },
      {
        title: 'bulk_create and bulk_update: thousands of rows, a handful of statements',
        titleHi: 'bulk_create aur bulk_update: hazaaron rows, muट्ठीभर statements',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.test.utils import CaptureQueriesContext

class Product(models.Model):
    sku = models.CharField(max_length=20, unique=True)
    price_cents = models.PositiveIntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Product)

# insert 5000 rows -- one query per batch, not per row
with CaptureQueriesContext(connection) as ctx:
    Product.objects.bulk_create(
        [Product(sku=f"SKU-{i:05d}", price_cents=(i + 1) * 10) for i in range(5000)],
        batch_size=1000,
    )
print("bulk_create 5000 rows:", len(ctx.captured_queries), "queries; total rows:",
      Product.objects.count())

# update all prices +10% -- one query per batch
products = list(Product.objects.all())
for p in products:
    p.price_cents = int(p.price_cents * 1.1)
with CaptureQueriesContext(connection) as ctx:
    Product.objects.bulk_update(products, ["price_cents"], batch_size=1000)
print("bulk_update 5000 rows:", len(ctx.captured_queries), "queries")
print("row 1 price after +10%:", Product.objects.get(sku="SKU-00000").price_cents)

# ignore_conflicts: re-inserting existing SKUs is skipped, not an error
with CaptureQueriesContext(connection) as ctx:
    Product.objects.bulk_create(
        [Product(sku="SKU-00000", price_cents=1), Product(sku="SKU-99999", price_cents=1)],
        ignore_conflicts=True,
    )
print("after ignore_conflicts insert, total rows:", Product.objects.count(), "(one new)")

# in_bulk: hydrate a known set in one query
by_sku = Product.objects.in_bulk(["SKU-00001", "SKU-00002"], field_name="sku")
print("in_bulk keys:", sorted(by_sku.keys()))`,
        output: `bulk_create 5000 rows: 7 queries; total rows: 5000
bulk_update 5000 rows: 7 queries
row 1 price after +10%: 11
after ignore_conflicts insert, total rows: 5001 (one new)
in_bulk keys: ['SKU-00001', 'SKU-00002']
`,
        explain: '`bulk_create([...], batch_size=1000)` issues a handful of `INSERT` statements instead of 5000 — here 7, because Django caps each batch to the database\'s bind-parameter limit and does not blindly honour `batch_size=1000` when rows are wide. Either way it is the difference between a fast script and one that hammers the database for minutes. `bulk_update` similarly batches into `UPDATE ... CASE` statements. `ignore_conflicts=True` makes a re-insert of an existing `sku` a silent skip rather than an `IntegrityError`, so only the genuinely new `SKU-99999` lands. `in_bulk` fetches a known set keyed by a unique field in one query.',
        explainHi: '`bulk_create([...], batch_size=1000)` 5000 ke bजाय muट्ठीभर `INSERT` statements issue karता hai — yahaan 7, kyunki Django har batch ko database ki bind-parameter limit tak cap karता hai aur rows chaudी hone par `batch_size=1000` ko aankh moondkar nahi maanता. Kisi bhi tarah ye ek tez script aur ek jо database ko minutes ke liye hammer karता hai ke beech ka antar. `bulk_update` isi tarah `UPDATE ... CASE` statements mein batch karता hai. `ignore_conflicts=True` ek maujूd `sku` ke re-insert ko ek silent skip banाता hai.',
      },
      {
        title: 'QuerySet.update() vs bulk_update() vs a save() loop',
        titleHi: 'QuerySet.update() vs bulk_update() vs ek save() loop',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import F
from django.test.utils import CaptureQueriesContext

class Job(models.Model):
    status = models.CharField(max_length=20, default="queued")
    attempts = models.IntegerField(default=0)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Job)
Job.objects.bulk_create([Job() for _ in range(1000)])

# 1. save() loop -- 1000 UPDATE statements
jobs = list(Job.objects.all()[:1000])
with CaptureQueriesContext(connection) as ctx:
    for j in jobs:
        j.status = "running"
        j.save(update_fields=["status"])
print("save() loop:", len(ctx.captured_queries), "queries")

# 2. bulk_update -- a few CASE statements
Job.objects.update(status="queued")  # reset
jobs = list(Job.objects.all()[:1000])
for j in jobs:
    j.status = "running"
with CaptureQueriesContext(connection) as ctx:
    Job.objects.bulk_update(jobs, ["status"], batch_size=500)
print("bulk_update:", len(ctx.captured_queries), "queries")

# 3. QuerySet.update() -- ONE statement (when the new value is uniform / an F expr)
with CaptureQueriesContext(connection) as ctx:
    Job.objects.filter(status="running").update(status="done", attempts=F("attempts") + 1)
print("QuerySet.update():", len(ctx.captured_queries), "query")
print("all done, attempts bumped:", Job.objects.filter(status="done", attempts=1).count())`,
        output: `save() loop: 1000 queries
bulk_update: 4 queries
QuerySet.update(): 1 query
all done, attempts bumped: 1000
`,
        explain: 'Three ways to update 1000 rows. A `save()` loop is 1000 `UPDATE`s — correct but slow, and the only option if you need `save()` overrides or signals per row. `bulk_update(jobs, ["status"])` batches into a few `UPDATE ... CASE` statements — the tool when the new value is computed per row in Python. `QuerySet.update(status="done", attempts=F("attempts") + 1)` is a **single** `UPDATE` — the fastest, race-safe with `F()`, and the right choice when the new value is uniform or expressible as an `F` expression. None of `bulk_update`/`update()` run `save()`, signals, or `auto_now`.',
        explainHi: '1000 rows update karने ke teen tarike. Ek `save()` loop 1000 `UPDATE`s hai — sahi par dhीmा, aur ekmatr option agar aapko prati row `save()` overrides ya signals chahिए. `bulk_update(jobs, ["status"])` 2 `UPDATE ... CASE` statements mein batch karता hai. `QuerySet.update(status="done", attempts=F("attempts") + 1)` ek **single** `UPDATE` hai — sabse tez, `F()` ke saath race-safe. `bulk_update`/`update()` mein se koi `save()`, signals, ya `auto_now` nahi chalाता.',
      },
    ],

    mistakes: [
      {
        wrong: `books = Book.objects.only("title")
for b in books:
    line = f"{b.title} by {b.author.name} -- {b.description[:100]}"
    # .author -> N+1;  .description -> N+1 (deferred);  double hit per row`,
        right: `books = (Book.objects
         .only("title", "description", "author__name")
         .select_related("author"))
for b in books:
    line = f"{b.title} by {b.author.name} -- {b.description[:100]}"
    # everything is in the one query`,
        why: '`only()` restricts the columns loaded; touching any field *not* listed triggers a per-object query. Combined with a related access that was not `select_related`ed, one line of string formatting can fire two queries per row. If you use `only`, list every field the code path actually reads (including \`related__field\` with a matching \`select_related\`), or do not use it.',
        whyHi: '`only()` load kiye columns restrict karता hai; koi field chhoona jо listed *nahi* ek per-object query trigger karता hai. Ek related access ke saath jо `select_related`ed nahi tha, string formatting ki ek line prati row do queries fire kar sakti hai. Agar `only` istemal karते ho, har field list karो jise code path padhता hai.',
      },
      {
        wrong: `# bulk_create then expect timestamps / signals / M2M
Article.objects.bulk_create([Article(title=t) for t in titles])
# -> created_at is NULL (auto_now_add skipped)
# -> post_save never fired -> search index / cache not updated
# -> article.tags.set(...) never ran`,
        right: `now = timezone.now()
articles = Article.objects.bulk_create(
    [Article(title=t, created_at=now, updated_at=now) for t in titles]   # set timestamps explicitly
)
# then handle side effects yourself:
reindex_search(articles)
for art, tag_ids in zip(articles, tag_id_lists):
    art.tags.set(tag_ids)`,
        why: '`bulk_create` (and `bulk_update`, `QuerySet.update()`) go straight to SQL and skip the entire `save()` path: no `auto_now_add`/`auto_now`, no `pre_save`/`post_save` signals, no `save()` override logic, and M2M cannot be assigned. That is the point — it is fast because it does less — but any behaviour you rely on from `save()` must be done explicitly after the bulk call.',
        whyHi: '`bulk_create` (aur `bulk_update`, `QuerySet.update()`) seedhे SQL par jाते hain aur poora `save()` path skip karते hain: koi `auto_now_add`/`auto_now` nahi, koi signals nahi, koi `save()` override logic nahi, aur M2M assign nahi ho sakti. Yahi point hai — ye tez hai kyunki ye kam karता hai — par jо behaviour aap `save()` se rely karते ho use bulk call ke baad explicitly karna hoga.',
      },
      {
        wrong: `ids = []
for row in SomeModel.objects.filter(active=True):
    ids.append(row.id)                          # loads every full row to collect ids
OtherModel.objects.filter(some_id__in=ids)`,
        right: `ids = SomeModel.objects.filter(active=True).values_list("id", flat=True)
OtherModel.objects.filter(some_id__in=ids)      # Django can even inline this as a subquery
# or pass the queryset directly:
OtherModel.objects.filter(some_id__in=SomeModel.objects.filter(active=True).values("id"))`,
        why: 'Iterating a full queryset just to collect primary keys builds a model instance for every row — all columns loaded, descriptors set up — to throw all of it away except `id`. `values_list("id", flat=True)` selects only the `id` column and yields a flat list. Better still, pass the `.values("id")` queryset straight into `__in` and let the database do it as a subquery with no data round-tripping to Python at all.',
        whyHi: 'Ek full queryset iterate karna bस primary keys collect karने ko har row ke liye ek model instance banाता hai — saare columns loaded — bस `id` ke alावा sab phenkने ko. `values_list("id", flat=True)` sirf `id` column select karता hai. Aur behtar, `.values("id")` queryset ko seedhे `__in` mein pass karो aur database ko ise ek subquery ki tarah karने do.',
      },
    ],

    realWorld: [
      {
        en: '**`values_list("id", flat=True)` and passing `.values("id")` querysets into `__in`** is everywhere — building the id set for a bulk update, a permissions check, a "these are the ones to email" filter. Django inlines the subquery when you pass the queryset directly, avoiding a Python round trip.',
        hi: '**`values_list("id", flat=True)` aur `.values("id")` querysets ko `__in` mein pass karna** har jagah hai — ek bulk update ke liye id set banाना, ek permissions check. Django subquery inline karता hai jab aap queryset seedhे pass karते ho.',
      },
      {
        en: '**Importers and sync jobs are `bulk_create(..., update_conflicts=True, unique_fields=[...], update_fields=[...])`** — an upsert of thousands of rows from a CSV or an external API in a few statements, with timestamps set explicitly and side effects (search reindex, cache bust) handled after the call. `batch_size` tuned to the database\'s parameter limit.',
        hi: '**Importers aur sync jobs `bulk_create(..., update_conflicts=True, ...)` hain** — ek CSV ya external API se hazaaron rows ka ek upsert kuch statements mein, timestamps explicitly set aur side effects call ke baad handled.',
      },
      {
        en: '**`defer("large_json_column")` / `.only(...)` on hot list endpoints** where a model carries a big \`raw_payload\` JSONField or a \`content\` TextField that the list view never renders — cuts the bytes transferred per row. Paired with a detail view that loads the full object.',
        hi: '**Hot list endpoints par `defer("large_json_column")` / `.only(...)`** jahaan ek model ek bada `raw_payload` JSONField le jाता hai jise list view kabhi render nahi karता — prati row transfer kiye bytes kaम karता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `only()`/`defer()` and `values()`/`values_list()`?',
        qHi: '`only()`/`defer()` aur `values()`/`values_list()` mein kya antar hai?',
        a: 'Both reduce what a query loads, but at different levels. only and defer control which columns the SELECT includes, while still returning full model instances. only takes a list of fields and selects just those plus the primary key; defer takes a list and selects everything except those. You still get model objects with all their methods, properties, and foreign-key descriptors — you have just told Django not to fetch certain columns up front. The important caveat is that accessing a field that was deferred triggers a fresh SELECT for that one field on that one object, so if you defer a column and then read it in a loop over the queryset, you have created an N-plus-one. So only and defer are for columns you are confident that code path will not touch — typically a large TextField or JSONField that a list view never renders. values and values_list go further: they skip model instantiation entirely. values returns a queryset of dictionaries, one per row, with the requested field names as keys; values_list returns a queryset of tuples, or with flat equals True and a single field, a queryset of bare values, or with named equals True, lightweight namedtuples. There are no model instances, no methods, no descriptors — just the raw data. This is meaningfully faster and lighter for large result sets because it bypasses the per-row model constructor and attribute setup. Both values and values_list can span relations with the double-underscore path, and values is the input to a GROUP BY when followed by annotate. You use values or values_list when you only need the data — to serialize to JSON, to feed an aggregate, to build a list of ids for an in filter, to export a column — and the plain queryset with only or defer when you need model behaviour but want to trim a few heavy columns.',
        aHi: 'Dono kam karते hain ki ek query kya load karता hai, par alag levels par. only aur defer control karте hain ki SELECT kaunse columns shaamil karता hai, jabki abhi bhi full model instances lautाते hain. only fields ki ek list leता hai aur bस unhe plus primary key select karता hai; defer ek list leता hai aur un ke alावा sab select karता hai. Aapko abhi bhi model objects milते hain saari methods ke saath. Mahatvapoorn caveat ye hai ki ek deferred field access karna us ek object par us ek field ke liye ek fresh SELECT trigger karता hai, toh agar aap ek column defer karके phir ek loop mein ise padhते ho, aapne ek N-plus-one banाya. values aur values_list aage jाते hain: wo model instantiation poori tarah skip karते hain. values dictionaries ka ek queryset lautाता hai; values_list tuples ka, ya flat equals True ke saath bare values ka. Koi model instances nahi, koi methods nahi — bस raw data. Ye bade result sets ke liye kaafi tez hai. Aap values istemal karते ho jab aapko sirf data chahिए.',
      },
      {
        q: 'When do you use `bulk_create`/`bulk_update`/`QuerySet.update()` and what do they skip?',
        qHi: 'Aap `bulk_create`/`bulk_update`/`QuerySet.update()` kab istemal karते ho aur wo kya skip karते hain?',
        a: 'All three are for changing many rows without a Python loop of per-object saves. bulk_create takes a list of unsaved model instances and inserts them in a small number of INSERT statements, batched by a batch_size you tune to the database\'s parameter limit. It has options: ignore_conflicts to skip rows that would violate a unique constraint, and update_conflicts with unique_fields and update_fields to do an upsert. bulk_update takes a list of instances that already have primary keys, a list of field names to write, and issues batched UPDATE statements using CASE expressions to set different values per row — you use it when the new value is computed per row in Python. QuerySet dot update takes keyword arguments and issues a single UPDATE over the filtered rows — the fastest option, and the right one when the new value is uniform across the rows or expressible as an F expression, which also makes it race-safe for things like incrementing a counter. What they skip is the entire save path. None of them call Model dot save, so any logic in a save override does not run. None of them send pre_save or post_save signals, so anything wired to those — cache invalidation, search reindexing, audit logging — does not happen. None of them apply auto_now or auto_now_add, so if your model stamps created_at or updated_at automatically, you must set those fields explicitly: pass them on each instance for bulk_create, include updated_at in the field list and set it for bulk_update, pass updated_at equals now for QuerySet dot update. bulk_create also cannot set many-to-many relations. delete on a queryset is a partial exception: it does collect and cascade dependent objects and does fire the delete signals, because it instantiates the objects to do so, which means for very large deletes you batch or drop to raw SQL. The rule is: these are fast because they do less, so any behaviour you depend on from save must be done explicitly around the bulk call.',
        aHi: 'Teeno kai rows badalने ke liye hain bina per-object saves ke ek Python loop ke. bulk_create unsaved model instances ki ek list leता hai aur unhe kuch INSERT statements mein insert karता hai, ek batch_size se batched. Iske options hain: ignore_conflicts, aur update_conflicts unique_fields aur update_fields ke saath ek upsert karने ko. bulk_update instances ki ek list leता hai jinke pehle se primary keys hain, likhने ke liye field names ki ek list, aur batched UPDATE statements issue karता hai CASE expressions ke saath. QuerySet dot update keyword arguments leता hai aur filtered rows par ek single UPDATE issue karта hai — sabse tez option. Wo jо skip karте hain wo poora save path hai. Unmें se koi Model dot save call nahi karता. Koi pre_save ya post_save signals nahi bhejता. Koi auto_now ya auto_now_add apply nahi karता, toh aapko wo fields explicitly set karne honge. bulk_create many-to-many relations bhi set nahi kar sakta. Niyam: ye tez hain kyunki wo kam karте hain.',
      },
    ],

    exercises: [
      {
        task: 'Model `Doc` with `title` (CharField) and `body` (TextField). Insert 15 docs with a long `body`. Use `CaptureQueriesContext` to show: (a) `Doc.objects.only("title")` runs 1 query and its SQL does not contain `"body"`; (b) iterating `Doc.objects.only("title")` and reading `d.body` on each runs 16 queries; (c) `Doc.objects.values("id", "title")` runs 1 query and returns dicts; (d) `Doc.objects.values_list("id", flat=True)` returns a flat list of ints.',
        taskHi: '`Doc` model karो `title` aur `body` (TextField) ke saath. 15 docs insert karो. Dikhाओ: (a) `only("title")` 1 query, SQL mein `"body"` nahi; (b) `only("title")` iterate karके `d.body` padhna 16 queries; (c) `values("id", "title")` 1 query, dicts; (d) `values_list("id", flat=True)` ints ki flat list.',
        hint: '`ctx.captured_queries[0]["sql"]` for the SELECT text. Reading a deferred field = one query per object. `values()` -> `[{...}, ...]`; `values_list(..., flat=True)` -> `[1, 2, ...]` (only valid with ONE field).',
        hintHi: '`ctx.captured_queries[0]["sql"]` SELECT text ke liye. Ek deferred field padhna = prati object ek query. `values_list(..., flat=True)` sirf EK field ke saath valid.',
      },
      {
        task: 'Model `Row` with `key` (CharField, unique) and `val` (int). `bulk_create` 3000 rows with `batch_size=1000`; capture and print the query count (should be 3). Load them, multiply every `val` by 2 in Python, `bulk_update(rows, ["val"], batch_size=1000)`; print that query count. Then `Row.objects.filter(val__gt=1000).update(val=0)` and print that count (1).',
        taskHi: '`Row` model karो `key` (unique) aur `val` (int) ke saath. `bulk_create` 3000 rows `batch_size=1000` ke saath; query count print karो (3). Unhe load karके har `val` ko 2 se multiply karके `bulk_update`; count print karो. Phir `.filter(val__gt=1000).update(val=0)`; count print karो (1).',
        hint: '3000 / 1000 = 3 INSERT statements. `bulk_update` batches into a few `UPDATE ... CASE`. `QuerySet.update()` is always 1 statement. All three skip `save()`/signals/`auto_now`.',
        hintHi: '3000 / 1000 = 3 INSERT statements. `bulk_update` kuch `UPDATE ... CASE` mein batch. `QuerySet.update()` hamesha 1 statement.',
      },
      {
        task: 'Model `Person` with `email` (unique) and `name`. `bulk_create` 5 people. Then `bulk_create` a list containing 2 existing emails and 3 new ones with `ignore_conflicts=True`; print the total count (8). Separately, `bulk_create` with `update_conflicts=True, unique_fields=["email"], update_fields=["name"]` to change the name of an existing email; confirm the name changed and the count did not grow.',
        taskHi: '`Person` model karो `email` (unique) aur `name` ke saath. 5 people `bulk_create` karो. Phir ek list `bulk_create` karो jismें 2 maujूd emails aur 3 naye hain `ignore_conflicts=True` ke saath; total count print karो (8). Alag se, `update_conflicts=True, unique_fields=["email"], update_fields=["name"]` se ek maujूd email ka name badalो.',
        hint: '`ignore_conflicts=True` silently skips rows violating a unique constraint. `update_conflicts=True` with `unique_fields`/`update_fields` turns a conflict into an `UPDATE` of the listed fields (an upsert) — SQLite 3.24+ / Postgres.',
        hintHi: '`ignore_conflicts=True` unique constraint violate karती rows chupchaap skip karता hai. `update_conflicts=True` ek conflict ko listed fields ke `UPDATE` mein badalता hai (ek upsert).',
      },
    ],

    keyTakeaways: [
      '`only(*fields)` / `defer(*fields)` trim the columns a `SELECT` loads while STILL returning model instances. Accessing a field NOT loaded triggers a per-object `SELECT` for it — a hidden N+1. Use only for columns you are sure that code path never touches (big `TextField`/`JSONField`).',
      '`values(*fields)` -> QuerySet of dicts; `values_list(*fields)` -> QuerySet of tuples; `values_list("f", flat=True)` -> flat list (ONE field only); `named=True` -> namedtuples. NO model instances/methods — much lighter for large sets, spans relations, feeds `values().annotate()` GROUP BY.',
      'Pass `.values("id")` (or `values_list("id", flat=True)`) into `__in` for an id filter — Django can inline it as a subquery with no Python round trip. Never iterate a full queryset just to collect pks.',
      '`bulk_create(objs, batch_size=)` — one INSERT per batch. Options: `ignore_conflicts=True` (skip unique violations), `update_conflicts=True` + `unique_fields=` + `update_fields=` (upsert). No `save()`, no signals, no `auto_now_add` (set timestamps explicitly), no M2M.',
      '`bulk_update(objs, fields, batch_size=)` — objs must have pks; batched `UPDATE ... CASE`. No `save()`, no signals, no `auto_now` — include `updated_at` in `fields` and set it yourself.',
      '`QuerySet.update(**kwargs)` — a SINGLE set-based `UPDATE` over the filtered rows. Fastest; race-safe with `F()`. No `save()`/signals/`auto_now`. Use when the new value is uniform or an `F` expression.',
      '`QuerySet.delete()` IS different — it collects/cascades dependents and DOES fire `pre_delete`/`post_delete` (instantiates objects). For millions of rows, batch or use DB-level cascade.',
      '`in_bulk(id_list, field_name="pk")` -> `{key: instance}` in one query — the efficient way to hydrate a known id/unique-field set without a loop of `.get()`.',
    ],
    keyTakeawaysHi: [
      '`only(*fields)` / `defer(*fields)` ek `SELECT` jо columns load karta hai unhe trim karते hain jabki ABHI BHI model instances lautाते hain. Ek field access karna jо load NAHI hua uske liye ek per-object `SELECT` trigger karता hai — ek chhupा N+1.',
      '`values(*fields)` -> dicts ka QuerySet; `values_list(*fields)` -> tuples ka QuerySet; `values_list("f", flat=True)` -> flat list (sirf EK field); `named=True` -> namedtuples. KOI model instances/methods nahi — bade sets ke liye kaafi halka.',
      'Ek id filter ke liye `.values("id")` ko `__in` mein pass karो — Django ise ek subquery ki tarah inline kar sakta hai bina Python round trip. Kabhi ek full queryset iterate mat karो bस pks collect karने ko.',
      '`bulk_create(objs, batch_size=)` — prati batch ek INSERT. Options: `ignore_conflicts=True`, `update_conflicts=True` + `unique_fields=` + `update_fields=` (upsert). Koi `save()`, signals, `auto_now_add` nahi, koi M2M nahi.',
      '`bulk_update(objs, fields, batch_size=)` — objs ke paas pks hone chahिए; batched `UPDATE ... CASE`. Koi `save()`, signals, `auto_now` nahi — `updated_at` `fields` mein shaamil karो aur khud set karो.',
      '`QuerySet.update(**kwargs)` — filtered rows par ek SINGLE set-based `UPDATE`. Sabse tez; `F()` ke saath race-safe. Koi `save()`/signals/`auto_now` nahi.',
      '`QuerySet.delete()` ALAG hai — ye dependents collect/cascade karता hai aur `pre_delete`/`post_delete` FIRE karता hai. Millions rows ke liye batch karो ya DB-level cascade istemal karो.',
      '`in_bulk(id_list, field_name="pk")` -> ek query mein `{key: instance}` — ek known id set hydrate karने ka efficient tarika bina `.get()` ke loop ke.',
    ],
  },

  {
    slug: 'dj-finding-and-fixing-n-plus-1',
    title: 'Finding & Fixing N+1: Measuring, explain(), and Indexes',
    titleHi: 'N+1 Dhoondhna Aur Theek Karna: Measuring, explain(), Aur Indexes',
    description: 'You cannot optimise what you do not measure. `assertNumQueries` pins counts in tests, `django-debug-toolbar` shows duplicates in dev, `CaptureQueriesContext` and `explain()` work anywhere. The workflow is always the same: measure, find the hot query, add a prefetch or an index, re-measure.',
    descriptionHi: 'Aap wo optimise nahi kar sakte jо aap measure nahi karते. `assertNumQueries` tests mein counts pin karता hai, `django-debug-toolbar` dev mein duplicates dikhाता hai, `CaptureQueriesContext` aur `explain()` kahin bhi kaam karते hain. Workflow hamesha wahi hai: measure karो, hot query dhoondhो, ek prefetch ya ek index add karो, phir se measure karो.',
    difficulty: 'HARD',
    duration: 24,
    order: 6,

    analogy: {
      en: '**Fixing a slow checkout line: count the customers, watch the register, then decide.** You do not speed up a queue by guessing. First you *count*: how many transactions per customer (query count per request), how long each takes (query time). `assertNumQueries` is the store policy that says "checkout must be exactly 3 scans per customer" and sounds an alarm if a change makes it 300. `django-debug-toolbar` is the manager standing behind the register watching every scan scroll past, circling the ones that repeat. `explain()` is asking the register itself "why did that lookup take so long?" — and the answer is usually "I had to flip through every page of the catalogue because there is no index tab for that field". Adding an index is putting a tab on the catalogue at that field: the lookup goes from reading all 100,000 pages to jumping straight to the right one. But every tab you add slows down *restocking* (writes), so you index the fields you actually look things up by, not every field.',
      hi: '**Ek dhीmी checkout line theek karna: customers gino, register dekhो, phir tay karो.** Aap ek queue ko anumaan lगाकर tez nahi karते. Pehle aap *gino*: prati customer kितne transactions (prati request query count), har ek kितna samay leता hai (query time). `assertNumQueries` wo store policy hai jо kehti hai "checkout prati customer bilkul 3 scans hona chahिए" aur alarm bajाती hai agar ek change ise 300 banाता hai. `django-debug-toolbar` register ke peeche khadा manager hai jо har scan dekhता hai, repeat hone waale circle karता hai. `explain()` register se poochna hai "wo lookup itna samay kyun laga?" — aur jawaab aksar "mujhe catalogue ke har page palatna pada kyunki us field ke liye koi index tab nahi hai" hai. Ek index add karna catalogue par us field par ek tab lगाना hai. Par har tab jо aap add karते ho *restocking* (writes) dhीmा karता hai.',
    },

    simple: `**Measure query counts**

\`\`\`python
# in a test -- pins the count, a regression fails CI
class OrderListTest(TestCase):
    def test_query_count(self):
        with self.assertNumQueries(3):
            self.client.get("/orders/")

# anywhere -- a script, the shell, a management command
from django.test.utils import CaptureQueriesContext
from django.db import connection
with CaptureQueriesContext(connection) as ctx:
    render_orders()
print(len(ctx.captured_queries), "queries")
for q in ctx.captured_queries:
    print(q["sql"][:120], "  --", q["time"])

# with DEBUG=True, the last queries are on the connection:
from django.db import connection, reset_queries
reset_queries()
do_work()
print(connection.queries)
\`\`\`

**See the SQL and the plan**

\`\`\`python
print(qs.query)                 # the SQL Django will run
print(qs.explain())             # the database's EXPLAIN (add verbose=True / analyze=True on Postgres)
print(qs.explain(analyze=True)) # actually runs it and shows real timings + rows (Postgres)
\`\`\`

**Dev / prod tooling**

\`\`\`
django-debug-toolbar   dev: a panel per request -- SQL list, count, duplicate/similar queries, time
django-silk            dev/staging: records requests + query profiles, has a UI
nplusone               raises or logs the instant an un-prefetched related access happens
sentry / datadog APM   prod: flags endpoints whose query count or DB time grows with input
\`\`\`

**Indexes**

\`\`\`python
class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)   # FK -> indexed by default
    status = models.CharField(max_length=20, db_index=True)             # single-column index
    created_at = models.DateTimeField()

    class Meta:
        indexes = [
            models.Index(fields=["status", "-created_at"]),             # composite, order matters
            models.Index(fields=["customer", "status"],
                         condition=models.Q(status="open"),
                         name="open_orders_by_customer"),                # partial index
        ]
\`\`\`

**The workflow**

\`\`\`
1. MEASURE            assertNumQueries / debug-toolbar / CaptureQueriesContext
2. FIND the hot one   which query repeats? which is slow in explain()?
3. FIX
   - N+1 (many identical queries)  -> select_related / prefetch_related / annotate
   - one slow query (seq scan)     -> add an index on the filtered/ordered/joined columns
   - too much data                 -> only()/values(), pagination, .iterator()
   - chatty writes                 -> bulk_create/bulk_update/update()
4. RE-MEASURE         confirm the count/time dropped and nothing else regressed
\`\`\``,

    simpleHi: `**Query counts measure karो**

\`\`\`python
# ek test mein -- count pin karता hai, ek regression CI fail karता hai
class OrderListTest(TestCase):
    def test_query_count(self):
        with self.assertNumQueries(3):
            self.client.get("/orders/")

# kahin bhi -- ek script, shell, ek management command
from django.test.utils import CaptureQueriesContext
from django.db import connection
with CaptureQueriesContext(connection) as ctx:
    render_orders()
print(len(ctx.captured_queries), "queries")
for q in ctx.captured_queries:
    print(q["sql"][:120], "  --", q["time"])
\`\`\`

**SQL aur plan dekhо**

\`\`\`python
print(qs.query)                 # SQL jо Django chalाega
print(qs.explain())             # database ka EXPLAIN
print(qs.explain(analyze=True)) # asal mein chalाता hai, real timings + rows (Postgres)
\`\`\`

**Dev / prod tooling**

\`\`\`
django-debug-toolbar   dev: prati request ek panel -- SQL list, count, duplicate queries, time
django-silk            dev/staging: requests + query profiles record karता hai
nplusone               ek un-prefetched related access hote hi raise ya log karता hai
sentry / datadog APM   prod: un endpoints ko flag karता hai jinka query count input ke saath badhता
\`\`\`

**Indexes**

\`\`\`python
class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)   # FK -> default indexed
    status = models.CharField(max_length=20, db_index=True)             # single-column index

    class Meta:
        indexes = [
            models.Index(fields=["status", "-created_at"]),             # composite, kram maayne rakhता
            models.Index(fields=["customer", "status"],
                         condition=models.Q(status="open"),
                         name="open_orders_by_customer"),                # partial index
        ]
\`\`\`

**Workflow**

\`\`\`
1. MEASURE            assertNumQueries / debug-toolbar / CaptureQueriesContext
2. FIND hot wala      kaunsी query repeat hoती hai? kaunsी explain() mein dhीmी hai?
3. FIX
   - N+1 (kai identical queries)   -> select_related / prefetch_related / annotate
   - ek dhीmी query (seq scan)     -> filtered/ordered/joined columns par ek index add karो
   - bahut zyada data              -> only()/values(), pagination, .iterator()
   - chatty writes                 -> bulk_create/bulk_update/update()
4. RE-MEASURE         confirm count/time gira aur kuch aur regress nahi hua
\`\`\``,

    content: `## Measuring — you must, before you change anything

**In tests** — \`assertNumQueries(n)\` is a context manager (and the standard place to lock query counts):

\`\`\`python
class OrderApiTest(APITestCase):
    def test_list_is_constant_query_count(self):
        OrderFactory.create_batch(50)                 # 50 rows
        with self.assertNumQueries(4):                # NOT 50+ -- a prefetch is in place
            resp = self.client.get("/api/orders/")
        self.assertEqual(resp.status_code, 200)
\`\`\`

Seed *more than one* row (a dozen), or an N+1 with 1 row still passes at "2 queries". This test is the guardrail: someone adds a serializer field that walks a relation, the count jumps, CI goes red.

**Anywhere** — \`CaptureQueriesContext(connection)\`:

\`\`\`python
from django.test.utils import CaptureQueriesContext
from django.db import connection

with CaptureQueriesContext(connection) as ctx:
    build_the_page()

print(len(ctx.captured_queries))
for q in ctx.captured_queries:
    print(f'{q["time"]}s  {q["sql"][:150]}')
\`\`\`

Each entry has \`sql\` and \`time\`. Duplicated or near-duplicated \`sql\` (same statement, different id) is the N+1 fingerprint.

**With \`DEBUG=True\`** — Django records every query on \`connection.queries\`. \`reset_queries()\` clears it. (This list grows unbounded — one reason \`DEBUG=True\` leaks memory in production.)

## Reading the query and the plan

- **\`print(qs.query)\`** — the SQL Django will send. Check the \`JOIN\`s, the \`WHERE\`, whether \`DISTINCT\` snuck in, whether \`ORDER BY\` is what you expect.
- **\`qs.explain()\`** — runs the database's \`EXPLAIN\` and returns the plan as text. On Postgres, \`qs.explain(analyze=True, verbose=True)\` actually executes the query and shows real row counts and timings — look for **\`Seq Scan\`** on a large table (missing index), a **nested loop** over many rows, a **sort** that spills to disk, or a row-estimate wildly off from actual (stale statistics).
- **\`connection.queries[-1]["sql"]\`** in a shell for the last statement.

## Indexes — the fix for a single slow query

An index is a sorted secondary structure the database can binary-search instead of scanning the whole table. Add one on a column (or set of columns) you frequently **filter**, **order by**, or **join on**:

\`\`\`python
class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)   # FK: Django indexes it automatically
    type = models.CharField(max_length=30)
    created_at = models.DateTimeField()

    class Meta:
        indexes = [
            models.Index(fields=["user", "type", "-created_at"]),   # composite
            models.Index(fields=["type"], condition=models.Q(type="error"),
                         name="error_events"),                       # partial (Postgres/SQLite)
        ]
\`\`\`

Rules:

- **A composite index \`(a, b, c)\` serves queries filtering on a leading prefix**: \`a\`, \`a+b\`, \`a+b+c\` — not \`b\` alone or \`c\` alone. Put the most selective / most-filtered column first, and match your common \`ORDER BY\` in the trailing columns (including direction).
- **Every index slows writes** (each \`INSERT\`/\`UPDATE\`/\`DELETE\` must maintain it) and uses disk. Index deliberately; do not index every column.
- **Foreign keys are indexed by default** in Django. Low-cardinality boolean columns rarely benefit from a plain index (a partial index on the rare value can).
- **Partial index** (\`condition=Q(...)\`) indexes only the rows matching a predicate — small and fast for "the open ones", "the errors", "the unprocessed".
- **Functional / expression index** for \`filter(Lower("email")=...)\` etc.: \`models.Index(Lower("email"), name="lower_email_idx")\`.
- Adding an index on a huge table locks it during the build unless you use \`CREATE INDEX CONCURRENTLY\` (via a migration with \`atomic = False\` and \`AddIndexConcurrently\` from \`django.contrib.postgres\`) — Module 8.

Verify the index is used: re-run \`qs.explain()\` and confirm the \`Seq Scan\` became an \`Index Scan\`.

## The workflow, applied

1. **Measure.** A test with \`assertNumQueries\`, or the debug toolbar on the page, or \`CaptureQueriesContext\` around the call. Note the count and the total DB time.
2. **Classify the problem:**
   - **Many identical queries** (N+1) -> the relation being accessed per row needs \`select_related\` (to-one) or \`prefetch_related\` (to-many), or replace \`rel.count()\`/\`rel.exists()\` in a loop with \`annotate(Count(...))\` / \`Exists()\`.
   - **One query, slow in \`explain()\`** -> add an index on the filtered/ordered/joined columns; or rewrite (a correlated subquery instead of a huge JOIN, a partial index for a rare predicate).
   - **Too many bytes** -> \`only()\`/\`defer()\`/\`values()\`, paginate, \`.iterator()\` for exports.
   - **A write loop** -> \`bulk_create\`/\`bulk_update\`/\`QuerySet.update()\`.
3. **Fix the top one.** In a DRF list endpoint, the fix lives in \`get_queryset\` (Module 5).
4. **Re-measure.** Confirm the count/time dropped and that you did not push the cost elsewhere (a JOIN that is now the slow part, a prefetch that loads too much).
5. **Lock it.** Add or update the \`assertNumQueries\` so the regression cannot come back silently.

## What not to do

- Do not add \`select_related\`/\`prefetch_related\` for relations the code does not access — each is extra work.
- Do not \`select_related\` ten levels deep — the single query gets huge; past two or three, measure or switch to \`prefetch_related\`.
- Do not add indexes speculatively — measure that the query is actually slow and that the index is actually used.
- Do not optimise a query that runs once at startup or in a rarely-hit admin action; spend the effort on the hot path.`,

    contentHi: `## Measuring — aapko karna hi hai, kuch badalने se pehle

**Tests mein** — \`assertNumQueries(n)\` ek context manager hai (aur query counts lock karने ki standard jagah):

\`\`\`python
class OrderApiTest(APITestCase):
    def test_list_is_constant_query_count(self):
        OrderFactory.create_batch(50)                 # 50 rows
        with self.assertNumQueries(4):                # NOT 50+ -- ek prefetch maujूd hai
            resp = self.client.get("/api/orders/")
\`\`\`

*Ek se zyada* row seed karो (ek dozen), warna 1 row ke saath ek N+1 abhi bhi "2 queries" par pass hoगा.

**Kahin bhi** — \`CaptureQueriesContext(connection)\`:

\`\`\`python
with CaptureQueriesContext(connection) as ctx:
    build_the_page()
print(len(ctx.captured_queries))
for q in ctx.captured_queries:
    print(f'{q["time"]}s  {q["sql"][:150]}')
\`\`\`

Duplicated ya near-duplicated \`sql\` (wahi statement, alag id) N+1 fingerprint hai.

**\`DEBUG=True\` ke saath** — Django har query \`connection.queries\` par record karता hai. \`reset_queries()\` ise clear karता hai.

## Query aur plan padhna

- **\`print(qs.query)\`** — SQL jо Django bhejega.
- **\`qs.explain()\`** — database ka \`EXPLAIN\` chalाता hai. Postgres par \`qs.explain(analyze=True, verbose=True)\` query execute karता hai aur real row counts aur timings dikhाता hai — ek bade table par **\`Seq Scan\`** dhoondhо (missing index).

## Indexes — ek single slow query ka fix

Ek index ek sorted secondary structure hai jise database binary-search kar sakta hai poore table ko scan karने ke bजाय. Ek column par ek add karो jise aap aksar **filter**, **order by**, ya **join** karते ho:

\`\`\`python
class Meta:
    indexes = [
        models.Index(fields=["user", "type", "-created_at"]),   # composite
        models.Index(fields=["type"], condition=models.Q(type="error"), name="error_events"),  # partial
    ]
\`\`\`

Niyam:

- **Ek composite index \`(a, b, c)\` ek leading prefix par filter karती queries serve karता hai**: \`a\`, \`a+b\`, \`a+b+c\` — akela \`b\` ya \`c\` nahi. Sabse selective column pehle rakhो.
- **Har index writes dhीmा karता hai** aur disk istemal karता hai. Jaan-boojhकर index karो.
- **Foreign keys default roop se indexed hain** Django mein.
- **Partial index** (\`condition=Q(...)\`) sirf predicate match karती rows index karता hai.
- Ek bade table par ek index add karna build ke dauraan ise lock karता hai jab tak aap \`CREATE INDEX CONCURRENTLY\` istemal na karो — Module 8.

Verify karो: \`qs.explain()\` phir se chalाओ aur confirm karो \`Seq Scan\` ek \`Index Scan\` ban gaya.

## Workflow, applied

1. **Measure.** \`assertNumQueries\` waala ek test, ya page par debug toolbar, ya \`CaptureQueriesContext\`.
2. **Samasya classify karो:**
   - **Kai identical queries** (N+1) -> \`select_related\` / \`prefetch_related\` / \`annotate(Count(...))\`.
   - **Ek query, \`explain()\` mein dhीmी** -> filtered/ordered/joined columns par ek index.
   - **Bahut zyada bytes** -> \`only()\`/\`values()\`, paginate, \`.iterator()\`.
   - **Ek write loop** -> \`bulk_create\`/\`bulk_update\`/\`update()\`.
3. **Top wala fix karो.** Ek DRF list endpoint mein, fix \`get_queryset\` mein rehता hai.
4. **Re-measure.**
5. **Lock karो.** \`assertNumQueries\` add ya update karो.

## Kya nahi karna

- Un relations ke liye \`select_related\`/\`prefetch_related\` mat add karो jinhe code access nahi karता.
- Das levels deep \`select_related\` mat karो.
- Speculatively indexes mat add karो — measure karो ki query asal mein dhीmी hai.
- Ek query jо startup par ek baar chalती hai use optimise mat karो.`,

    examples: [
      {
        title: 'CaptureQueriesContext: spotting the N+1 fingerprint',
        titleHi: 'CaptureQueriesContext: N+1 fingerprint spot karna',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import Count
from django.test.utils import CaptureQueriesContext

class Team(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Member(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="members")
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Team); se.create_model(Member)
teams = [Team.objects.create(name=f"T{i}") for i in range(6)]
Member.objects.bulk_create([Member(team=teams[i % 6], name=f"M{i}") for i in range(30)])

# BAD: per-team member count in a loop
with CaptureQueriesContext(connection) as ctx:
    report = [(t.name, t.members.count()) for t in Team.objects.all()]
counts = {}
for q in ctx.captured_queries:
    key = q["sql"].split("WHERE")[0].strip()[:40]
    counts[key] = counts.get(key, 0) + 1
print("naive:", len(ctx.captured_queries), "queries")
print("  repeated statement seen", max(counts.values()), "times  <- the N+1 fingerprint")

# GOOD: one annotated query
with CaptureQueriesContext(connection) as ctx:
    report = list(Team.objects.annotate(n=Count("members")).values_list("name", "n"))
print("annotate(Count):", len(ctx.captured_queries), "query")
print("  report:", report[:3])`,
        output: `naive: 7 queries
  repeated statement seen 6 times  <- the N+1 fingerprint
annotate(Count): 1 query
  report: [('T0', 5), ('T1', 5), ('T2', 5)]
`,
        explain: 'The naive loop runs 1 query for the teams and then `t.members.count()` once per team — 6 identical `SELECT COUNT(*) FROM member WHERE team_id = ?` statements, differing only in the id. That repetition — the same SQL shape many times in one request — is the signature of an N+1. Grouping the captured queries by their pre-`WHERE` shape and seeing a count of 6 confirms it. `annotate(n=Count("members"))` computes every team\'s member count in the *one* query that fetches the teams.',
        explainHi: 'Naive loop teams ke liye 1 query chalाता hai aur phir `t.members.count()` prati team ek baar — 6 identical `SELECT COUNT(*) FROM member WHERE team_id = ?` statements, sirf id mein alag. Wo repetition — ek request mein wahi SQL shape kai baar — ek N+1 ka signature hai. `annotate(n=Count("members"))` har team ka member count us *ek* query mein compute karता hai jо teams fetch karता hai.',
      },
      {
        title: 'qs.query and qs.explain(): seeing the plan, adding an index',
        titleHi: 'qs.query aur qs.explain(): plan dekhna, ek index add karna',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection

class LogLine(models.Model):
    service = models.CharField(max_length=30)
    level = models.CharField(max_length=10)
    message = models.TextField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(LogLine)
import random
random.seed(0)
services = ["api", "worker", "web", "cron"]
levels = ["info", "warn", "error"]
LogLine.objects.bulk_create(
    [LogLine(service=random.choice(services), level=random.choice(levels), message="x")
     for _ in range(5000)], batch_size=1000)

qs = LogLine.objects.filter(service="api", level="error")

# the SQL Django will run:
print("SQL:", qs.query.__str__()[:90], "...")

# the plan BEFORE an index -- sqlite reports a full SCAN
plan_before = qs.explain()
print("plan before index:", "SCAN" in plan_before.upper(), "(full table scan)")

# add a composite index (what Meta.indexes + a migration would do)
with connection.schema_editor() as se:
    se.add_index(LogLine, models.Index(fields=["service", "level"], name="svc_level_idx"))

plan_after = qs.explain()
print("plan after index:", "svc_level_idx" in plan_after or "USING INDEX" in plan_after.upper())
print("results still correct:", qs.count() == LogLine.objects.filter(service="api", level="error").count())`,
        output: `SQL: SELECT "__main___logline"."id", "__main___logline"."service", "__main___logline"."level",  ...
plan before index: True (full table scan)
plan after index: True
results still correct: True
`,
        explain: '`qs.query` shows the exact SQL. `qs.explain()` runs the database\'s `EXPLAIN`: before the index, SQLite reports a full `SCAN` of `__main___logline` — it reads all 5000 rows to find the matching ones. After adding `Index(fields=["service", "level"])`, the plan uses `svc_level_idx` and the database jumps straight to the matching rows. In a real project the index goes in `Meta.indexes` and ships as a migration; here `schema_editor.add_index` does it directly. Always confirm with a fresh `explain()` that the index is actually used.',
        explainHi: '`qs.query` exact SQL dikhाता hai. `qs.explain()` database ka `EXPLAIN` chalाता hai: index se pehle, SQLite `__main___logline` ka ek full `SCAN` report karता hai — ye saari 5000 rows padhता hai matching dhoondhने ko. `Index(fields=["service", "level"])` add karने ke baad, plan `svc_level_idx` istemal karता hai. Ek asli project mein index `Meta.indexes` mein jाता hai aur ek migration ki tarah ship hoता hai. Hamesha ek fresh `explain()` se confirm karो ki index asal mein istemal hoता hai.',
      },
      {
        title: 'The full workflow: measure -> classify -> fix -> re-measure',
        titleHi: 'Poora workflow: measure -> classify -> fix -> re-measure',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import Count, Prefetch
from django.test.utils import CaptureQueriesContext

class Customer(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=20)
    class Meta:
        app_label = "__main__"

class Line(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="lines")
    qty = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    for m in (Customer, Order, Line): se.create_model(m)
custs = [Customer.objects.create(name=f"C{i}") for i in range(10)]
orders = [Order.objects.create(customer=custs[i % 10], status="paid") for i in range(40)]
Line.objects.bulk_create([Line(order=orders[i % 40], qty=(i % 3) + 1) for i in range(120)])

def render(qs):
    out = []
    for o in qs:
        out.append((o.customer.name, o.status, sum(l.qty for l in o.lines.all())))
    return out

# 1. MEASURE the naive version
with CaptureQueriesContext(connection) as ctx:
    render(Order.objects.all())
print("1. naive:", len(ctx.captured_queries), "queries for 40 orders")

# 2. CLASSIFY: customer is a forward FK (-> select_related), lines is a reverse FK (-> prefetch_related)
# 3. FIX
with CaptureQueriesContext(connection) as ctx:
    render(Order.objects.select_related("customer").prefetch_related("lines"))
print("3. select_related + prefetch_related:", len(ctx.captured_queries), "queries")

# even better: push the sum into the DB with annotate, drop the prefetch
with CaptureQueriesContext(connection) as ctx:
    qs = Order.objects.select_related("customer").annotate(total_qty=models.Sum("lines__qty"))
    _ = [(o.customer.name, o.status, o.total_qty) for o in qs]
print("3b. select_related + annotate(Sum):", len(ctx.captured_queries), "query")

# 4. RE-MEASURE confirms: 40 orders -> constant query count regardless of size`,
        output: `1. naive: 81 queries for 40 orders
3. select_related + prefetch_related: 2 queries
3b. select_related + annotate(Sum): 1 query
`,
        explain: 'Step 1: the naive render is 1 (orders) + 40 (`o.customer`, mostly cached to ~10) + 40 (`o.lines.all()`) ≈ 81. Step 2: `customer` is a forward FK so it wants `select_related` (a JOIN); `lines` is a reverse FK so it wants `prefetch_related` (one extra query). Step 3: those two together drop it to 2 queries — constant regardless of order count. Step 3b: since the code only needs the *sum* of line quantities, `annotate(Sum("lines__qty"))` computes it in the DB and removes the prefetch entirely — 1 query. Step 4 would be an `assertNumQueries(1)` test to lock it.',
        explainHi: 'Step 1: naive render 1 (orders) + 40 (`o.customer`, zyादातर ~10 tak cached) + 40 (`o.lines.all()`) ≈ 81 hai. Step 2: `customer` ek forward FK hai toh ise `select_related` chahिए; `lines` ek reverse FK hai toh ise `prefetch_related` chahिए. Step 3: wo dono saath ise 2 queries par le aate hain. Step 3b: kyunki code ko sirf line quantities ka *sum* chahिए, `annotate(Sum("lines__qty"))` ise DB mein compute karता hai aur prefetch poori tarah hataता hai — 1 query. Step 4 ise lock karने ke liye ek `assertNumQueries(1)` test hoगा.',
      },
    ],

    mistakes: [
      {
        wrong: `class OrderListTest(TestCase):
    def test_queries(self):
        OrderFactory()                       # ONE order
        with self.assertNumQueries(2):
            self.client.get("/orders/")
# passes -- but with 1 row an N+1 is 1 + 1 = 2. The test proves nothing.`,
        right: `def test_queries(self):
    OrderFactory.create_batch(15)             # MANY rows
    with self.assertNumQueries(3):            # 3 no matter how many rows -> prefetch works
        self.client.get("/orders/")`,
        why: 'An `assertNumQueries` test with a single seed row cannot detect an N+1: 1 base query + 1 per-row query = 2, which looks fine. The test only has teeth if the row count is high enough that an N+1 would blow the number well past the target — a dozen rows, and a target that stays constant as you add more.',
        whyHi: 'Ek single seed row waala `assertNumQueries` test ek N+1 detect nahi kar sakta: 1 base query + 1 per-row query = 2, jо theek dikhता hai. Test ke tabhi daant hain jab row count itna high ho ki ek N+1 number ko target se kaafi aage le jाए — ek dozen rows, aur ek target jо aur rows add karने par constant rehта hai.',
      },
      {
        wrong: `# "the list is slow, add prefetch for everything"
Order.objects.select_related("customer", "shipping", "billing",
                             "customer__company", "customer__company__region",
                             "warehouse", "warehouse__manager") \\
             .prefetch_related("lines", "lines__product", "lines__product__supplier",
                               "notes", "attachments", "history")
# the serializer only uses customer.name and line totals`,
        right: `Order.objects.select_related("customer") \\
             .prefetch_related("lines")
# add ONLY what the serializer/template actually reads; measure after`,
        why: 'Every `select_related` adds a JOIN (wider rows, a bigger single query) and every `prefetch_related` adds a query and loads a whole related set into memory. Prefetching relations the response never touches is pure overhead — sometimes making the endpoint *slower* than the N+1 it replaced. Add exactly what the code path reads, confirmed by measuring, and no more.',
        whyHi: 'Har `select_related` ek JOIN add karता hai aur har `prefetch_related` ek query add karता hai aur ek poora related set memory mein load karता hai. Un relations ko prefetch karna jinhe response kabhi chhoota nahi pure overhead hai — kabhi endpoint ko us N+1 se *dhीmा* banाता hai jise usne replace kiya. Bilkul wo add karो jо code path padhता hai.',
      },
      {
        wrong: `class Product(models.Model):
    name = models.CharField(max_length=100, db_index=True)
    sku = models.CharField(max_length=32, db_index=True)
    description = models.TextField(db_index=True)      # indexing a big text field
    is_active = models.BooleanField(db_index=True)     # index on a 2-value column
    created = models.DateTimeField(db_index=True)
    updated = models.DateTimeField(db_index=True)
    # 6 indexes -- every write maintains all 6, and half are never used`,
        right: `class Product(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=32, unique=True)   # unique implies an index
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    created = models.DateTimeField()

    class Meta:
        indexes = [
            models.Index(fields=["is_active", "-created"]),   # the query you actually run
        ]
# index measured queries, not every column`,
        why: 'Indexes are not free: each one is maintained on every `INSERT`, `UPDATE`, and `DELETE`, and consumes disk. A `db_index` on a `TextField`, on a low-cardinality boolean (a plain index barely helps — the DB still scans half the table), or on columns you never filter/sort by is cost with no benefit. Index the columns your slow queries actually use — verified with `explain()` — and drop the rest.',
        whyHi: 'Indexes muft nahi hain: har ek har `INSERT`, `UPDATE`, aur `DELETE` par maintain hoता hai, aur disk consume karता hai. Ek `TextField` par, ek low-cardinality boolean par, ya un columns par jinpar aap kabhi filter/sort nahi karते ek `db_index` bina faayde ki cost hai. Un columns ko index karो jinhe aapki slow queries asal mein istemal karती hain — `explain()` se verified.',
      },
    ],

    realWorld: [
      {
        en: '**`assertNumQueries` around every list/detail endpoint test is standard** — seed ~15 rows, assert the count is small and constant. This is the single most effective guard against N+1 regressions, because a new nested serializer field that walks a relation makes the number jump and CI catches it before merge.',
        hi: '**Har list/detail endpoint test ke aas-paas `assertNumQueries` standard hai** — ~15 rows seed karो, assert karो count chhota aur constant hai. Ye N+1 regressions ke khilaaf sabse effective guard hai.',
      },
      {
        en: '**`django-debug-toolbar` in dev + APM (Sentry Performance / Datadog) in prod** is the standard pair. The toolbar\'s SQL panel highlights duplicated queries per page; APM flags production endpoints whose DB time or query count scales with input size — the signature of a missed prefetch or a missing index (Module 9).',
        hi: '**Dev mein `django-debug-toolbar` + prod mein APM** standard jodी hai. Toolbar ka SQL panel prati page duplicated queries highlight karता hai; APM production endpoints ko flag karता hai jinka DB time input size ke saath scale karता hai.',
      },
      {
        en: '**Composite and partial indexes match the app\'s actual query patterns** — `Index(["tenant", "status", "-created_at"])` for a multi-tenant list filtered by status and sorted by date, a partial `Index(["assignee"], condition=Q(status="open"))` for "my open tickets". Added via `Meta.indexes` and shipped as migrations, with `CREATE INDEX CONCURRENTLY` on big tables (Module 8).',
        hi: '**Composite aur partial indexes app ke asli query patterns se mel khाते hain** — status se filtered aur date se sorted ek multi-tenant list ke liye `Index(["tenant", "status", "-created_at"])`, "mere open tickets" ke liye ek partial `Index(["assignee"], condition=Q(status="open"))`.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you find an N+1 query problem, and how do you prevent it from coming back?',
        qHi: 'Aap ek N+1 query problem kaise dhoondhते ho, aur ise wapas aane se kaise rokते ho?',
        a: 'You find it by measuring query counts, never by reading code alone, because the offending line usually looks innocent. In development the fastest tool is the debug toolbar: it shows, per request, the total number of queries and highlights ones that are identical or nearly identical — the same SQL statement repeated with a different id is the fingerprint of an N+1. In a script or the shell you wrap the code in a CaptureQueriesContext and inspect the captured list: count the entries, and group them by the part of the SQL before the WHERE clause to see which shape repeats. In tests you use assertNumQueries as a context manager around the client call. There are also libraries like nplusone that raise or log the instant an un-prefetched related attribute is accessed in a loop, and APM tools in production that flag endpoints whose query count or database time grows with the input size. Once found, the fix depends on the relation: a forward foreign key or one-to-one gets select_related, which folds it into a JOIN; a many-to-many or reverse foreign key gets prefetch_related, which runs one extra query; and a per-row count or exists call in a loop gets replaced with an annotate of Count or an Exists subquery so the aggregate is computed in the main query. To prevent regressions, you lock the query count with an assertNumQueries test around the endpoint, seeded with more than a handful of rows — a dozen or more — so that if someone later adds a serializer field or template access that walks a relation, the count jumps past the asserted number and continuous integration fails before the change merges. The test is the guardrail; the toolbar and CaptureQueriesContext are how you diagnose when the guardrail trips.',
        aHi: 'Aap ise query counts measure karके dhoondhते ho, kabhi akele code padhकर nahi, kyunki galat line aksar masoom dikhती hai. Development mein sabse tez tool debug toolbar hai: ye prati request queries ki total sankhya dikhाता hai aur identical ya lगbhag identical ones highlight karता hai — wahi SQL statement ek alag id ke saath repeat ek N+1 ka fingerprint hai. Ek script mein aap code ko ek CaptureQueriesContext mein wrap karके captured list inspect karते ho. Tests mein aap assertNumQueries istemal karते ho. nplusone jaisी libraries bhi hain jо ek un-prefetched related attribute access hote hi raise ya log karती hain. Mil jaने par, fix relation par nirbhar karता hai: ek forward foreign key ko select_related, ek many-to-many ko prefetch_related, aur ek loop mein per-row count ko annotate of Count se replace. Regressions rokने ke liye, aap endpoint ke aas-paas ek assertNumQueries test se query count lock karते ho, ek dozen se zyada rows se seeded.',
      },
      {
        q: 'When should you add a database index, and what are the costs and rules?',
        qHi: 'Aapko ek database index kab add karna chahिए, aur costs aur niyam kya hain?',
        a: 'You add an index when you have measured that a specific query is slow and the plan shows the database scanning the whole table — a sequential scan on a large table in the EXPLAIN output — for a column you filter on, order by, or join on. An index is a sorted secondary structure the database can binary-search instead of reading every row, so it turns a lookup over millions of rows into a jump to the matching ones. The rules: for a composite index on columns a, b, c, the database can use it for queries that filter on a leading prefix — a alone, a and b, or all three — but not for a query that only filters on b or only on c. So you order the columns with the most selective or most frequently filtered one first, and you make the trailing columns match your common ORDER BY, including the sort direction, so one index serves both the filter and the sort. Foreign keys are indexed automatically by Django. A plain index on a low-cardinality column like a boolean is usually not worth it because the database still has to scan a large fraction of the table; a partial index that covers only the rare value — the open ones, the errors — is small and effective instead. There are also expression indexes for when you filter on a function of a column, like the lowercased email. The costs are real: every index must be updated on every insert, update, and delete that touches its columns, so write-heavy tables pay a throughput penalty per index, and each index consumes disk. So you index deliberately — the columns your slow queries actually use, verified by re-running EXPLAIN after adding the index to confirm the scan became an index scan — and you do not index every column speculatively. On a large table, building the index locks it unless you create it concurrently, which on Postgres is a non-atomic migration using the concurrent index operation.',
        aHi: 'Aap ek index tab add karते ho jab aapne maapा hai ki ek specific query dhीmी hai aur plan dikhाता hai ki database poore table ko scan kar raha hai — EXPLAIN output mein ek bade table par ek sequential scan — ek column ke liye jispar aap filter, order by, ya join karते ho. Ek index ek sorted secondary structure hai jise database binary-search kar sakta hai. Niyam: columns a, b, c par ek composite index ke liye, database ise un queries ke liye istemal kar sakta hai jо ek leading prefix par filter karती hain — akela a, a aur b, ya teenon — par sirf b par filter karती query ke liye nahi. Toh aap columns ko sabse selective ya sabse frequently filtered ke saath pehle order karते ho, aur trailing columns ko apne common ORDER BY se match karवाते ho. Foreign keys apne aap indexed hain. Ek low-cardinality column par ek plain index aksar worth nahi; ek partial index jо sirf rare value cover karता hai chhota aur effective hai. Costs asli hain: har index har insert, update, aur delete par update hona chahिए.',
      },
    ],

    exercises: [
      {
        task: 'Model `Author` and `Book` (FK, `related_name="books"`). Create 8 authors, 32 books. Write a `render()` that loops authors and, per author, does `author.books.count()` and reads `author.name`. Use `CaptureQueriesContext` to show it runs 9 queries. Rewrite with `Author.objects.annotate(n=Count("books"))` and show it runs 1. Group the captured SQL of the naive version by pre-`WHERE` shape and print the max repetition (should be 8).',
        taskHi: '`Author` aur `Book` (FK, `related_name="books"`) model karो. 8 authors, 32 books. Ek `render()` likhо jо authors loop kare aur prati author `author.books.count()` kare. `CaptureQueriesContext` se dikhाओ 9 queries. `annotate(n=Count("books"))` se rewrite karके 1 dikhाओ.',
        hint: '`counts = {}` keyed by `q["sql"].split("WHERE")[0]`; the count-per-author statement repeats 8 times. `annotate` computes all counts in the one authors query.',
        hintHi: '`q["sql"].split("WHERE")[0]` se keyed `counts = {}`; count-per-author statement 8 baar repeat hoता hai.',
      },
      {
        task: 'Model `Event` with `kind` (CharField) and `ts` (DateTimeField). `bulk_create` 4000 events with random `kind` from 5 choices. Take `qs = Event.objects.filter(kind="signup").order_by("-ts")`. Print `qs.explain()` and check for `"SCAN"` (full scan). Then `schema_editor.add_index(Event, Index(fields=["kind", "-ts"], name="kind_ts"))`, print `qs.explain()` again, and check the index name appears. Confirm `qs.count()` is unchanged.',
        taskHi: '`Event` model karो `kind` aur `ts` ke saath. 4000 events `bulk_create` karो. `qs = Event.objects.filter(kind="signup").order_by("-ts")`. `qs.explain()` print karके `"SCAN"` check karो. Phir `add_index(Event, Index(fields=["kind", "-ts"], name="kind_ts"))`, phir se `explain()`.',
        hint: '`with connection.schema_editor() as se: se.add_index(Event, models.Index(fields=["kind", "-ts"], name="kind_ts"))`. On SQLite, the pre-index plan says `SCAN`; the post-index plan references `kind_ts` (or `USING INDEX`).',
        hintHi: '`with connection.schema_editor() as se: se.add_index(Event, models.Index(fields=["kind", "-ts"], name="kind_ts"))`. Pre-index plan `SCAN` kehta hai; post-index `kind_ts` reference karता hai.',
      },
      {
        task: 'Full workflow. Model `Course`, `Section` (FK to `Course`, `related_name="sections"`), `Lesson` (FK to `Section`, `related_name="lessons"`, `minutes` int). Build a `render(qs)` producing `(course.title, total_minutes)` where `total_minutes` sums all lessons across all sections. Measure the naive version (`Course.objects.all()`). Then optimise to a SINGLE query using `annotate(total=Sum("sections__lessons__minutes"))` and measure again. Print both counts.',
        taskHi: 'Poora workflow. `Course`, `Section` (FK, `related_name="sections"`), `Lesson` (FK, `related_name="lessons"`, `minutes`) model karो. Ek `render(qs)` banाओ jо `(course.title, total_minutes)` produce kare. Naive version measure karो. Phir `annotate(total=Sum("sections__lessons__minutes"))` se ek SINGLE query mein optimise karके phir measure karो.',
        hint: '`from django.db.models import Sum`. `Course.objects.annotate(total=Sum("sections__lessons__minutes"))` spans two relations in one aggregate — one query. The naive version is 1 + N (sections) + N*M (lessons).',
        hintHi: '`Course.objects.annotate(total=Sum("sections__lessons__minutes"))` ek aggregate mein do relations span karता hai — ek query.',
      },
    ],

    keyTakeaways: [
      'MEASURE before changing anything. Tests: `with self.assertNumQueries(n):` around the call, seeded with a DOZEN+ rows (1 row hides an N+1). Anywhere: `with CaptureQueriesContext(connection) as ctx:` then `len(ctx.captured_queries)` and inspect `q["sql"]`/`q["time"]`.',
      'The N+1 fingerprint: the SAME SQL statement shape repeated many times in one request (differing only in an id). `django-debug-toolbar` (dev) highlights these; `nplusone` raises on the access; APM flags it in prod.',
      '`print(qs.query)` = the SQL. `qs.explain()` = the DB plan; `qs.explain(analyze=True, verbose=True)` on Postgres runs it and shows real rows/timings. Look for `Seq Scan`/`SCAN` on a big table, a spilled sort, or estimates far off from actual.',
      'Classify: many identical queries -> N+1 -> `select_related`(to-one) / `prefetch_related`(to-many) / `annotate(Count/Sum)` / `Exists`. One slow query -> add an index. Too many bytes -> `only()`/`values()`/pagination/`.iterator()`. A write loop -> `bulk_create`/`bulk_update`/`update()`.',
      'An index is a sorted structure the DB binary-searches instead of scanning. Add one on columns you FILTER / ORDER BY / JOIN on, verified slow via `explain()`. A composite `Index(["a","b","c"])` serves leading-prefix filters (`a`, `a+b`, `a+b+c`) — NOT `b` or `c` alone. Match trailing columns to your `ORDER BY` (with direction).',
      'Every index is maintained on every INSERT/UPDATE/DELETE and costs disk. Do NOT index low-cardinality booleans (use a partial `Index(..., condition=Q(...))`), big `TextField`s, or columns you never query. FKs are auto-indexed.',
      'After adding an index, re-run `qs.explain()` to CONFIRM the scan became an index scan — do not assume.',
      'Fix the top item, re-measure (did the cost move elsewhere?), then LOCK it with `assertNumQueries`. Do not speculatively add prefetches or indexes the code/queries do not need.',
    ],
    keyTakeawaysHi: [
      'Kuch badalने se pehle MEASURE karो. Tests: call ke aas-paas `with self.assertNumQueries(n):`, ek DOZEN+ rows se seeded (1 row ek N+1 chhupाता hai). Kahin bhi: `with CaptureQueriesContext(connection) as ctx:` phir `len(ctx.captured_queries)`.',
      'N+1 fingerprint: ek request mein WAHI SQL statement shape kai baar repeat (sirf ek id mein alag). `django-debug-toolbar` (dev) inhe highlight karता hai; `nplusone` access par raise karता hai; APM prod mein flag karता hai.',
      '`print(qs.query)` = SQL. `qs.explain()` = DB plan; Postgres par `qs.explain(analyze=True, verbose=True)` ise chalाता hai. Ek bade table par `Seq Scan`/`SCAN` dhoondhо.',
      'Classify: kai identical queries -> N+1 -> `select_related`(to-one) / `prefetch_related`(to-many) / `annotate(Count/Sum)` / `Exists`. Ek dhीmी query -> ek index add karो. Bahut zyada bytes -> `only()`/`values()`/pagination/`.iterator()`. Ek write loop -> `bulk_create`/`bulk_update`/`update()`.',
      'Ek index ek sorted structure hai jise DB binary-search karता hai scan karने ke bजाय. Un columns par ek add karो jinpar aap FILTER / ORDER BY / JOIN karते ho. Ek composite `Index(["a","b","c"])` leading-prefix filters serve karता hai (`a`, `a+b`, `a+b+c`) — akela `b` ya `c` NAHI.',
      'Har index har INSERT/UPDATE/DELETE par maintain hoता hai aur disk cost karता hai. Low-cardinality booleans (ek partial `Index(..., condition=Q(...))` istemal karो), bade `TextField`s index MAT karो. FKs auto-indexed hain.',
      'Ek index add karने ke baad, `qs.explain()` phir se chalाओ CONFIRM karने ko ki scan ek index scan ban gaya.',
      'Top item fix karो, phir se measure karो (cost kahin aur gaya?), phir `assertNumQueries` se LOCK karो. Speculatively prefetches ya indexes MAT add karो jinhe code/queries ko nahi chahिए.',
    ],
  },
];
