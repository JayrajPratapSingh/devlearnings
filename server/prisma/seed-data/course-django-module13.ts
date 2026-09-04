/**
 * Django Complete Course — Module 13: Advanced ORM Expressions & Generic Relations, lessons 1-2.
 *
 * Lesson 1: conditional & window expressions — Case/When/Value, Coalesce/Greatest/Least
 *           (and the SQLite vs PostgreSQL NULL difference), conditional aggregation with
 *           Count/Sum(filter=Q(...)) in one pass, and Window functions (RowNumber, Rank,
 *           Lag/Lead, running totals) with partition_by / order_by / frames.
 * Lesson 2: Subquery, OuterRef & Exists — correlated subqueries, Exists() for
 *           "has any related row", Subquery() for "one scalar from a related set",
 *           in annotate / filter / update, and subquery-vs-join tradeoffs.
 *
 * Verified against Django 6.1 on SQLite 3.50 (orm_probe.py / orm_probe2.py). Where
 * SQLite and PostgreSQL differ (Greatest/Least with NULL), the lesson says so.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_13: CourseLesson[] = [
  {
    slug: 'dj-orm-conditional-and-window-expressions',
    title: 'Conditional & Window Expressions: `Case`, `Coalesce`, `Window`',
    titleHi: 'Conditional Aur Window Expressions: `Case`, `Coalesce`, `Window`',
    description: 'Instead of pulling rows into Python to bucket them, compute a `CASE WHEN` label, a `COALESCE` fallback, or a running total *in the database* and get it back as an annotation. Window functions let a row see its neighbours — rank within a group, the previous value, a cumulative sum — in one query.',
    descriptionHi: 'Rows ko Python mein kheenchकर bucket karne ke bजाy, ek `CASE WHEN` label, ek `COALESCE` fallback, ya ek running total *database mein* compute karो aur ise ek annotation ke roop mein wapas pाओ. Window functions ek row ko iske padoसियों ko dekhने dete hain — ek group ke andar rank, pichhli value, ek cumulative sum — ek query mein.',
    difficulty: 'HARD',
    duration: 26,
    order: 1,

    analogy: {
      en: '**A spreadsheet with formula columns versus exporting to a calculator.** The slow way to label every order "small / mid / big", fill blank discounts with zero, or add a running-total column is to export the whole sheet, run it through a script, and re-import. The spreadsheet way is to add a **formula column**: `IF(total>=250,"big",...)` is `Case/When`; `IF(discount="", 0, discount)` is `Coalesce`; `MAX(a,b)` is `Greatest`. The formula is evaluated by the sheet, per row, and you just read the answer. **Window formulas** go further — they let a cell refer to *other rows in a range*: "rank of this row among rows with the same customer", "value from the row above", "sum of every row from the top down to here". `RANK() OVER (PARTITION BY customer ORDER BY total DESC)` is exactly that. The database is the spreadsheet engine; annotations are the formula columns; you stopped shipping the data to a separate calculator.',
      hi: '**Formula columns waali ek spreadsheet bनाम ek calculator ko export karna.** Har order ko "small / mid / big" label karne, blank discounts ko zero se bharने, ya ek running-total column joडने ka slow tareeka poori sheet export karna, ise ek script se chalाना, aur re-import karna hai. Spreadsheet tareeka ek **formula column** joडना hai: `IF(total>=250,"big",...)` `Case/When` hai; `IF(discount="", 0, discount)` `Coalesce` hai; `MAX(a,b)` `Greatest` hai. Formula sheet dwara evaluate hoता hai, prati row, aur aap bस jawab padhते ho. **Window formulas** aur aage jaते hain — wo ek cell ko *ek range mein doosri rows* ko refer karne dete hain: "wahi customer waali rows ke beech is row ka rank", "upar waali row se value", "top se yahaan tak har row ka sum". `RANK() OVER (PARTITION BY customer ORDER BY total DESC)` theek wahi hai. Database spreadsheet engine hai; annotations formula columns hain; aapne data ko ek alag calculator ko bhejना band kar diya.',
    },

    simple: `**\`Case\` / \`When\` — SQL \`CASE WHEN\` as an annotation**

\`\`\`python
from django.db.models import Case, When, Value, F

orders = Order.objects.annotate(
    tier=Case(
        When(total__gte=250, then=Value("big")),
        When(total__gte=100, then=Value("mid")),
        default=Value("small"),
    )
)
# each row now has .tier -- computed in SQL, no Python loop
\`\`\`

**\`Coalesce\` — first non-NULL value (a DB-side \`or\`)**

\`\`\`python
from django.db.models.functions import Coalesce

Order.objects.annotate(effective_discount=Coalesce("discount", Value(0)))
# discount is NULL -> 0.  Use Coalesce before arithmetic: NULL + anything = NULL
Order.objects.annotate(net=F("total") - Coalesce("discount", Value(0)))
\`\`\`

**\`Greatest\` / \`Least\` — row-wise max/min across columns**

\`\`\`python
from django.db.models.functions import Greatest, Least

Invoice.objects.annotate(due=Greatest("computed_due", "manual_due"))
# WARNING: on PostgreSQL, Greatest/Least IGNORE NULLs.
#          on SQLite/MySQL, if ANY argument is NULL the result is NULL.
#          -> wrap each arg in Coalesce for portable behaviour:
Invoice.objects.annotate(due=Greatest(Coalesce("computed_due", Value(0)),
                                      Coalesce("manual_due", Value(0))))
\`\`\`

**Conditional aggregation — many counts in ONE pass**

\`\`\`python
from django.db.models import Count, Sum, Q

Order.objects.aggregate(
    paid=Count("id", filter=Q(status="paid")),
    pending=Count("id", filter=Q(status="pending")),
    revenue=Sum("total", filter=Q(status="paid")),
)
# one SELECT, not three. -> {"paid": 42, "pending": 7, "revenue": Decimal("18400")}
\`\`\`

**\`Window\` — a row sees its neighbours**

\`\`\`python
from django.db.models import Window, F, Sum
from django.db.models.functions import RowNumber, Rank, Lag, Lead

Order.objects.annotate(
    running_total=Window(Sum("total"),
        partition_by=[F("customer_id")], order_by=F("created").asc()),
    rank_in_customer=Window(Rank(),
        partition_by=[F("customer_id")], order_by=F("total").desc()),
    prev_order_total=Window(Lag("total"),
        partition_by=[F("customer_id")], order_by=F("created").asc()),
)
\`\`\`

\`\`\`
Window(expr, partition_by=[...], order_by=...)   ==   expr OVER (PARTITION BY ... ORDER BY ...)
  partition_by  -> restart the calculation per group   (like GROUP BY, but rows are kept)
  order_by      -> the order within the partition       (defines "previous", "running")
  frame=        -> RowRange / ValueRange for a sliding window (default: start..current row)
you CANNOT filter on a Window annotation directly -- wrap the queryset or use a subquery.
\`\`\``,

    simpleHi: `**\`Case\` / \`When\` — SQL \`CASE WHEN\` ek annotation ke roop mein**

\`\`\`python
from django.db.models import Case, When, Value, F

orders = Order.objects.annotate(
    tier=Case(
        When(total__gte=250, then=Value("big")),
        When(total__gte=100, then=Value("mid")),
        default=Value("small"),
    )
)
# har row ke paas ab .tier hai -- SQL mein computed, koi Python loop nahi
\`\`\`

**\`Coalesce\` — pehli non-NULL value (ek DB-side \`or\`)**

\`\`\`python
from django.db.models.functions import Coalesce

Order.objects.annotate(effective_discount=Coalesce("discount", Value(0)))
# discount NULL hai -> 0.  Arithmetic se pehle Coalesce istemal karो: NULL + kuch bhi = NULL
Order.objects.annotate(net=F("total") - Coalesce("discount", Value(0)))
\`\`\`

**\`Greatest\` / \`Least\` — columns ke paar row-wise max/min**

\`\`\`python
from django.db.models.functions import Greatest, Least

Invoice.objects.annotate(due=Greatest("computed_due", "manual_due"))
# CHETAVNI: PostgreSQL par, Greatest/Least NULLs ko IGNORE karते hain.
#           SQLite/MySQL par, agar KOI bhi argument NULL hai to result NULL hai.
#           -> portable behaviour ke liye har arg ko Coalesce mein wrap karो:
Invoice.objects.annotate(due=Greatest(Coalesce("computed_due", Value(0)),
                                      Coalesce("manual_due", Value(0))))
\`\`\`

**Conditional aggregation — EK pass mein kई counts**

\`\`\`python
from django.db.models import Count, Sum, Q

Order.objects.aggregate(
    paid=Count("id", filter=Q(status="paid")),
    pending=Count("id", filter=Q(status="pending")),
    revenue=Sum("total", filter=Q(status="paid")),
)
# ek SELECT, teen nahi. -> {"paid": 42, "pending": 7, "revenue": Decimal("18400")}
\`\`\`

**\`Window\` — ek row apne padoसियों ko dekhता hai**

\`\`\`python
from django.db.models import Window, F, Sum
from django.db.models.functions import RowNumber, Rank, Lag, Lead

Order.objects.annotate(
    running_total=Window(Sum("total"),
        partition_by=[F("customer_id")], order_by=F("created").asc()),
    rank_in_customer=Window(Rank(),
        partition_by=[F("customer_id")], order_by=F("total").desc()),
    prev_order_total=Window(Lag("total"),
        partition_by=[F("customer_id")], order_by=F("created").asc()),
)
\`\`\`

\`\`\`
Window(expr, partition_by=[...], order_by=...)   ==   expr OVER (PARTITION BY ... ORDER BY ...)
  partition_by  -> prati group calculation restart karो   (GROUP BY jaisा, par rows rakhी jaती hain)
  order_by      -> partition ke andar order                 ("previous", "running" define karता hai)
  frame=        -> ek sliding window ke liye RowRange / ValueRange
aap ek Window annotation par SEEDHE filter NAHI kar sakte -- queryset wrap karो ya ek subquery istemal karो.
\`\`\``,

    content: `## Push the logic into SQL

Every time you write \`for o in orders: o.tier = "big" if o.total >= 250 else ...\`, you have pulled every row into Python to compute something the database could have computed while fetching. **Expressions** — \`Case\`, \`Coalesce\`, \`F\`, \`Window\`, arithmetic — are Django's way to describe a SQL computation and attach the result to each row as an **annotation**. The row arrives already labelled, ranked, or summed.

## \`Case\` / \`When\`

\`Case\` builds a SQL \`CASE\` expression:

\`\`\`python
Order.objects.annotate(tier=Case(
    When(total__gte=250, then=Value("big")),      # WHEN total >= 250 THEN 'big'
    When(total__gte=100, then=Value("mid")),      # WHEN total >= 100 THEN 'mid'
    default=Value("small"),                        # ELSE 'small'
))
\`\`\`

- **Conditions** are the same lookups you use in \`filter()\` — \`__gte\`, \`__in\`, \`__isnull\`, spanning relations (\`author__country="IN"\`). Combine with \`Q\`.
- **\`then=\`** and **\`default=\`** are expressions: \`Value("x")\` for a literal, \`F("other_field")\` for a column, or another \`Case\`.
- \`output_field=\` is sometimes required when Django cannot infer the type (mixing types across branches).
- The first matching \`When\` wins; order them from most specific to least.

Common uses: derived labels, a sort key that is not a column (\`order_by(Case(When(status="urgent", then=0), default=1))\`), conditional \`update()\` (\`.update(bonus=Case(When(tenure__gte=5, then=F("bonus") + 100), default=F("bonus")))\`).

## \`Coalesce\` and NULL arithmetic

In SQL, **any arithmetic or comparison with \`NULL\` yields \`NULL\`** — \`100 - NULL\` is \`NULL\`, not \`100\`. So a nullable \`discount\` column silently poisons \`total - discount\`. \`Coalesce(a, b, c)\` returns the first non-NULL argument:

\`\`\`python
Order.objects.annotate(net=F("total") - Coalesce("discount", Value(0)))
# discount NULL -> net = total - 0.  Without Coalesce, net would be NULL.
\`\`\`

\`Coalesce\` is also how you supply a default for an aggregate over an empty set (\`Coalesce(Sum("amount"), Value(0))\` — \`Sum\` of nothing is \`NULL\`).

## \`Greatest\` / \`Least\` — and a portability trap

\`Greatest("a", "b")\` is the row-wise maximum of two columns (not \`Max\`, which aggregates down a column). **The NULL behaviour differs by backend:**

| backend | \`Greatest(5, NULL)\` |
|---|---|
| PostgreSQL, Oracle | \`5\` (NULLs ignored) |
| **SQLite, MySQL** | **\`NULL\`** (any NULL arg → NULL result) |

If you develop on SQLite and deploy on Postgres (or vice versa) this is a real bug source. The portable fix is to \`Coalesce\` each argument to a sentinel first:

\`\`\`python
Greatest(Coalesce("computed_due", Value(0)), Coalesce("manual_due", Value(0)))
\`\`\`

## Conditional aggregation

To get "paid count, pending count, refunded count" you do **not** run three queries or three \`filter().count()\` calls. Pass \`filter=Q(...)\` to the aggregate:

\`\`\`python
Order.objects.aggregate(
    paid=Count("id", filter=Q(status="paid")),
    pending=Count("id", filter=Q(status="pending")),
    revenue=Sum("total", filter=Q(status="paid")),
    aov=Avg("total", filter=Q(status="paid")),
)
\`\`\`

This is **one \`SELECT\`** with \`COUNT(...) FILTER (WHERE ...)\` (or \`SUM(CASE WHEN ... THEN 1 END)\` on backends without \`FILTER\`). It also works with \`.annotate()\` to get per-group conditional counts: \`Author.objects.annotate(published=Count("books", filter=Q(books__is_published=True)))\`.

## Window functions

A **window function** computes a value for each row using a *window* of related rows, **without collapsing the rows** the way \`GROUP BY\` does. \`Window(expression, partition_by=, order_by=, frame=)\` maps to \`expression OVER (PARTITION BY ... ORDER BY ...)\`:

\`\`\`python
Order.objects.annotate(
    running_total=Window(Sum("total"),
        partition_by=[F("customer_id")], order_by=F("created").asc()),
)
\`\`\`

- **\`partition_by\`** — a list of expressions; the window restarts for each distinct value. Omit it and the window is the whole result set.
- **\`order_by\`** — defines the sequence inside the partition. Required for \`Rank\`, \`RowNumber\`, \`Lag\`, \`Lead\`, and for a *running* aggregate (with \`order_by\`, \`Sum\` is cumulative; without it, \`Sum\` is the partition total on every row).
- **Functions:** \`RowNumber()\` (1,2,3…), \`Rank()\` (1,1,3 on ties), \`DenseRank()\` (1,1,2), \`Lag("col", offset=1)\` / \`Lead(...)\` (value from N rows back/forward), \`Ntile(4)\` (quartile bucket), \`FirstValue\`/\`LastValue\`, plus any aggregate (\`Sum\`, \`Avg\`, \`Count\`).
- **\`frame\`** — \`RowRange(start=-2, end=0)\` for a 3-row trailing average, \`ValueRange\` for range-based frames. Default frame is "start of partition to current row".

**You cannot \`filter()\` on a window annotation.** SQL forbids \`WHERE row_number = 1\`. Options: wrap the queryset (\`Order.objects.annotate(rn=Window(...)).filter(...)\` fails; instead build the annotated queryset as a subquery and filter the outer), or in raw terms use a CTE. Django 4.2+ lets you \`.filter()\` after \`.annotate()\` with a window by generating a subquery in some cases, but the reliable pattern is an explicit subquery (Lesson 2) or \`QuerySet\` slicing after ordering.

## When to reach for this

- **Dashboards and reports** — counts by status, revenue by month, top-N per category — belong in one annotated/aggregated query, not a Python loop over thousands of rows.
- **Rankings, "previous value", running balances, moving averages** — window functions, computed in the DB, one pass.
- **Derived display values used in \`filter\`/\`order_by\`** — \`Case\` so the database does the bucketing and sorting.
- If the logic needs data the DB does not have (an external call, a complex Python rule), then compute in Python — but fetch only the rows you need first.`,

    contentHi: `## Logic ko SQL mein dhakelो

Har baar jab aap \`for o in orders: o.tier = "big" if o.total >= 250 else ...\` likhते ho, aapne har row ko Python mein kheench liya kuch compute karne ke liye jо database fetch karते samay compute kar sakta tha. **Expressions** — \`Case\`, \`Coalesce\`, \`F\`, \`Window\`, arithmetic — ek SQL computation ka varnन karne aur result ko har row se ek **annotation** ke roop mein attach karne ka Django ka tareeka hain.

## \`Case\` / \`When\`

\`Case\` ek SQL \`CASE\` expression banाता hai:

- **Conditions** wahi lookups hain jо aap \`filter()\` mein istemal karते ho — \`__gte\`, \`__in\`, \`__isnull\`, relations ko span karते hue. \`Q\` ke saath combine karो.
- **\`then=\`** aur **\`default=\`** expressions hain: ek literal ke liye \`Value("x")\`, ek column ke liye \`F("other_field")\`, ya ek doosra \`Case\`.
- Pehla matching \`When\` jeetता hai; unhe sabse specific se least tak order karो.

Aam uses: derived labels, ek sort key jо ek column nahi hai, conditional \`update()\`.

## \`Coalesce\` aur NULL arithmetic

SQL mein, **\`NULL\` ke saath koi bhi arithmetic ya comparison \`NULL\` deता hai** — \`100 - NULL\` \`NULL\` hai, \`100\` nahi. To ek nullable \`discount\` column chupchaap \`total - discount\` ko poison karता hai. \`Coalesce(a, b, c)\` pehla non-NULL argument return karता hai:

\`\`\`python
Order.objects.annotate(net=F("total") - Coalesce("discount", Value(0)))
\`\`\`

\`Coalesce\` bhi wahi hai jaise aap ek khali set par ek aggregate ke liye ek default dete ho (\`Coalesce(Sum("amount"), Value(0))\`).

## \`Greatest\` / \`Least\` — aur ek portability trap

\`Greatest("a", "b")\` do columns ka row-wise maximum hai (\`Max\` nahi, jо ek column ke neeche aggregate karता hai). **NULL behaviour backend se alag hai:**

| backend | \`Greatest(5, NULL)\` |
|---|---|
| PostgreSQL, Oracle | \`5\` (NULLs ignored) |
| **SQLite, MySQL** | **\`NULL\`** (koi bhi NULL arg -> NULL result) |

Agar aap SQLite par develop karते ho aur Postgres par deploy karते ho ye ek asli bug source hai. Portable fix pehle har argument ko ek sentinel par \`Coalesce\` karना hai.

## Conditional aggregation

"paid count, pending count, refunded count" pाने ke liye aap teen queries **nahi** chalाते. Aggregate ko \`filter=Q(...)\` pass karो:

\`\`\`python
Order.objects.aggregate(
    paid=Count("id", filter=Q(status="paid")),
    pending=Count("id", filter=Q(status="pending")),
    revenue=Sum("total", filter=Q(status="paid")),
)
\`\`\`

Ye **ek \`SELECT\`** hai \`COUNT(...) FILTER (WHERE ...)\` ke saath. Ye per-group conditional counts pाने ke liye \`.annotate()\` ke saath bhi kaam karता hai.

## Window functions

Ek **window function** har row ke liye ek value compute karता hai *related rows* ke ek *window* ka istemal karके, **rows ko collapse kiye bina** jaise \`GROUP BY\` karता hai. \`Window(expression, partition_by=, order_by=, frame=)\` \`expression OVER (PARTITION BY ... ORDER BY ...)\` par map hota hai:

- **\`partition_by\`** — expressions ki ek list; window har distinct value ke liye restart hoता hai.
- **\`order_by\`** — partition ke andar sequence define karता hai. \`Rank\`, \`RowNumber\`, \`Lag\`, \`Lead\` ke liye, aur ek *running* aggregate ke liye zaroori.
- **Functions:** \`RowNumber()\`, \`Rank()\` (ties par 1,1,3), \`DenseRank()\` (1,1,2), \`Lag("col", offset=1)\` / \`Lead(...)\`, \`Ntile(4)\`, \`FirstValue\`/\`LastValue\`, plus koi aggregate.
- **\`frame\`** — ek 3-row trailing average ke liye \`RowRange(start=-2, end=0)\`.

**Aap ek window annotation par \`filter()\` NAHI kar sakte.** SQL \`WHERE row_number = 1\` ko forbid karता hai. Vishwsaneey pattern ek explicit subquery (Lesson 2) hai.

## Ispar kab pahunचें

- **Dashboards aur reports** — status se counts, month se revenue, prati category top-N — ek annotated/aggregated query mein rehते hain.
- **Rankings, "previous value", running balances, moving averages** — window functions, DB mein computed, ek pass.
- **\`filter\`/\`order_by\` mein istemal derived display values** — \`Case\`.
- Agar logic ko wo data chahिए jо DB ke paas nahi hai, to Python mein compute karो — par pehle sirf wo rows fetch karो jinki aapको zaroorat hai.`,

    examples: [
      {
        title: 'Case/When for a derived tier, computed in SQL',
        titleHi: 'Ek derived tier ke liye Case/When, SQL mein computed',
        code: `import os, django
from django.conf import settings
os.path.exists("e1.sqlite3") and os.remove("e1.sqlite3")
settings.configure(DEBUG=True, SECRET_KEY="x"*50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "e1.sqlite3"}})
django.setup()
from django.db import models, connection
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

class Order(models.Model):
    customer = models.CharField(max_length=20)
    total = models.IntegerField()
    class Meta: app_label = "contenttypes"
with connection.schema_editor() as se:
    se.create_model(Order)

for c, t in [("alice", 100), ("alice", 250), ("bob", 80), ("bob", 300), ("carol", 50)]:
    Order.objects.create(customer=c, total=t)

from django.db.models import Case, When, Value
qs = Order.objects.annotate(tier=Case(
    When(total__gte=250, then=Value("big")),
    When(total__gte=100, then=Value("mid")),
    default=Value("small"),
)).order_by("id").values_list("customer", "total", "tier")

for row in qs:
    print(row)`,
        output: `('alice', 100, 'mid')
('alice', 250, 'big')
('bob', 80, 'small')
('bob', 300, 'big')
('carol', 50, 'small')`,
        explain: '`Case` compiles to a SQL `CASE WHEN` that the database evaluates during the same scan it does to fetch the rows. The first matching `When` wins, so the 250 order gets `big` (not `mid`), and everything under 100 falls through to the `default`. `.tier` arrives on each row like any other field -- no Python loop, and you could also `filter(tier="big")` or `order_by("tier")`.',
        explainHi: '`Case` ek SQL `CASE WHEN` mein compile hota hai jise database usi scan ke dauran evaluate karता hai jо wo rows fetch karne ke liye karता hai. Pehla matching `When` jeetता hai, to 250 order ko `big` milता hai (`mid` nahi), aur 100 se neeche sab kuch `default` par gir jaता hai. `.tier` har row par kisi doosre field ki tarah aata hai.',
      },
      {
        title: 'Coalesce fixes NULL arithmetic; Greatest is NULL on SQLite without it',
        titleHi: 'Coalesce NULL arithmetic theek karta hai; iske bina SQLite par Greatest NULL hai',
        code: `import os, django
from django.conf import settings
os.path.exists("e2.sqlite3") and os.remove("e2.sqlite3")
settings.configure(DEBUG=True, SECRET_KEY="x"*50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "e2.sqlite3"}})
django.setup()
from django.db import models, connection
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

class Order(models.Model):
    total = models.IntegerField()
    discount = models.IntegerField(null=True)
    class Meta: app_label = "contenttypes"
with connection.schema_editor() as se:
    se.create_model(Order)

Order.objects.create(total=100, discount=None)
Order.objects.create(total=250, discount=25)

from django.db.models import F, Value
from django.db.models.functions import Coalesce, Greatest

qs = Order.objects.annotate(
    naive_net=F("total") - F("discount"),                         # NULL when discount is NULL
    safe_net=F("total") - Coalesce("discount", Value(0)),         # correct
    g_naive=Greatest("total", "discount"),                        # NULL on SQLite/MySQL
    g_safe=Greatest("total", Coalesce("discount", Value(0))),     # portable
).order_by("id").values_list("total", "discount", "naive_net", "safe_net", "g_naive", "g_safe")

for row in qs:
    print(row)`,
        output: `(100, None, None, 100, None, 100)
(250, 25, 225, 225, 250, 250)`,
        explain: '`total - discount` is `NULL` for the first row because SQL propagates NULL through arithmetic -- `100 - NULL` is `NULL`, not `100`. `Coalesce("discount", Value(0))` substitutes 0 first, giving the correct `100`. `Greatest` shows the portability trap: on SQLite (and MySQL) any NULL argument makes the whole result NULL, so `g_naive` is `None`; PostgreSQL would return `100`. Wrapping each argument in `Coalesce` makes `g_safe` correct everywhere.',
        explainHi: 'Pehli row ke liye `total - discount` `NULL` hai kyunki SQL arithmetic ke through NULL propagate karता hai -- `100 - NULL` `NULL` hai, `100` nahi. `Coalesce("discount", Value(0))` pehle 0 substitute karता hai, sahi `100` deकर. `Greatest` portability trap dikhाता hai: SQLite (aur MySQL) par koi NULL argument poore result ko NULL banाता hai, to `g_naive` `None` hai; PostgreSQL `100` return karता. Har argument ko `Coalesce` mein wrap karna `g_safe` ko har jagah sahi banाता hai.',
      },
      {
        title: 'Conditional aggregation: three counts and a sum in one query',
        titleHi: 'Conditional aggregation: ek query mein teen counts aur ek sum',
        code: `import os, django
from django.conf import settings
os.path.exists("e3.sqlite3") and os.remove("e3.sqlite3")
settings.configure(DEBUG=True, SECRET_KEY="x"*50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "e3.sqlite3"}})
django.setup()
from django.db import models, connection, reset_queries
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

class Order(models.Model):
    total = models.IntegerField()
    status = models.CharField(max_length=10)
    class Meta: app_label = "contenttypes"
with connection.schema_editor() as se:
    se.create_model(Order)

for t, s in [(100,"paid"),(250,"paid"),(80,"pending"),(300,"paid"),(50,"refunded")]:
    Order.objects.create(total=t, status=s)

from django.db.models import Count, Sum, Q
from django.test.utils import CaptureQueriesContext

with CaptureQueriesContext(connection) as cap:
    stats = Order.objects.aggregate(
        paid=Count("id", filter=Q(status="paid")),
        pending=Count("id", filter=Q(status="pending")),
        refunded=Count("id", filter=Q(status="refunded")),
        revenue=Sum("total", filter=Q(status="paid")),
    )
print(stats)
print("queries:", len(cap.captured_queries))`,
        output: `{'paid': 3, 'pending': 1, 'refunded': 1, 'revenue': 650}
queries: 1`,
        explain: 'Each `Count`/`Sum` carries its own `filter=Q(...)`, so Django emits one `SELECT` with `COUNT(...) FILTER (WHERE ...)` (or a `CASE` sum on backends without `FILTER`) for all four metrics at once. `CaptureQueriesContext` confirms it is a single query -- versus four separate `.filter().count()` / `.aggregate()` calls, each with its own scan and its own point-in-time view of the data.',
        explainHi: 'Har `Count`/`Sum` apna `filter=Q(...)` le jाता hai, to Django ek `SELECT` emit karता hai `COUNT(...) FILTER (WHERE ...)` ke saath chaaron metrics ek saath. `CaptureQueriesContext` confirm karता hai ye ek single query hai -- chaar alag `.filter().count()` calls ke bजाy, har ek apne scan aur data ke apne point-in-time view ke saath.',
      },
      {
        title: 'Window functions: running total, rank, and previous value per customer',
        titleHi: 'Window functions: prati customer running total, rank, aur previous value',
        code: `import os, django, datetime as dt
from django.conf import settings
os.path.exists("e4.sqlite3") and os.remove("e4.sqlite3")
settings.configure(DEBUG=True, SECRET_KEY="x"*50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "e4.sqlite3"}})
django.setup()
from django.db import models, connection
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

class Order(models.Model):
    customer = models.CharField(max_length=20)
    total = models.IntegerField()
    created = models.DateField()
    class Meta: app_label = "contenttypes"
with connection.schema_editor() as se:
    se.create_model(Order)

for c, t, d in [("alice",100,dt.date(2026,1,5)), ("alice",250,dt.date(2026,1,20)),
                ("bob",80,dt.date(2026,1,10)), ("bob",300,dt.date(2026,2,1))]:
    Order.objects.create(customer=c, total=t, created=d)

from django.db.models import Window, F, Sum
from django.db.models.functions import RowNumber, Lag

qs = Order.objects.annotate(
    running=Window(Sum("total"), partition_by=[F("customer")], order_by=F("created").asc()),
    rn=Window(RowNumber(), partition_by=[F("customer")], order_by=F("total").desc()),
    prev=Window(Lag("total"), partition_by=[F("customer")], order_by=F("created").asc()),
).order_by("customer", "created").values_list("customer", "total", "running", "rn", "prev")

for row in qs:
    print(row)`,
        output: `('alice', 100, 100, 2, None)
('alice', 250, 350, 1, 100)
('bob', 80, 80, 2, None)
('bob', 300, 380, 1, 80)`,
        explain: 'Each `Window` is `<expr> OVER (PARTITION BY customer ORDER BY ...)` -- the rows are kept, not collapsed. `running` is a cumulative `Sum` because of the `order_by` (100 then 100+250=350 for alice). `rn` is `RowNumber` over `total` descending, so alice\'s 250 order is rank 1. `prev` is `Lag("total")` -- the previous row\'s total in date order, `None` for each customer\'s first order.',
        explainHi: 'Har `Window` `<expr> OVER (PARTITION BY customer ORDER BY ...)` hai -- rows rakhी jaती hain, collapse nahi. `running` ek cumulative `Sum` hai `order_by` ki wajah se (alice ke liye 100 phir 100+250=350). `rn` `total` descending par `RowNumber` hai, to alice ka 250 order rank 1 hai. `prev` `Lag("total")` hai -- date order mein pichhli row ka total, har customer ke pehle order ke liye `None`.',
      },
    ],

    mistakes: [
      {
        wrong: `orders = Order.objects.all()
tiers = {}
for o in orders:                       # every row into Python
    if o.total >= 250:   tiers[o.id] = "big"
    elif o.total >= 100: tiers[o.id] = "mid"
    else:                tiers[o.id] = "small"
# then a second loop, or a dict lookup everywhere you need the tier`,
        right: `orders = Order.objects.annotate(tier=Case(
    When(total__gte=250, then=Value("big")),
    When(total__gte=100, then=Value("mid")),
    default=Value("small"),
))
for o in orders:
    print(o.tier)          # computed in SQL, arrives on the row`,
        why: 'Bucketing rows in a Python loop means fetching every column of every row, materialising model instances, and running the logic row by row in the interpreter — then usually keeping a side dict and joining it back manually. Case/When expresses the same rule as a SQL CASE that the database evaluates during the scan it was already doing, and the result comes back as a normal annotation you can also filter and order by. The Python loop is only justified when the decision needs data or logic SQL cannot express; a numeric threshold is not that.',
        whyHi: 'Ek Python loop mein rows bucket karne ka matlab har row ka har column fetch karna, model instances materialise karna, aur logic ko interpreter mein row by row chalाना — phir aam taur par ek side dict rakhना. Case/When usi rule ko ek SQL CASE ke roop mein express karता hai jise database us scan ke dauran evaluate karता hai jо wo pehle se kar raha tha. Python loop sirf tab justified hai jab decision ko wo data chahिए jise SQL express nahi kar sakta.',
      },
      {
        wrong: `# nightly report, developed and tested on SQLite, deployed on PostgreSQL
Invoice.objects.annotate(effective_due=Greatest("system_due", "override_due"))
# in dev (SQLite): rows with a NULL override_due -> effective_due is NULL -> "looks broken"
# in prod (Postgres): same rows -> effective_due = system_due -> "works"
# ...or the reverse, and the report silently drops rows in one environment`,
        right: `from django.db.models.functions import Coalesce
Invoice.objects.annotate(effective_due=Greatest(
    Coalesce("system_due", Value(0)),
    Coalesce("override_due", Value(0)),
))
# identical result on SQLite, MySQL, and PostgreSQL`,
        why: 'Greatest and Least handle NULL arguments differently across databases: PostgreSQL and Oracle ignore NULLs and return the largest non-NULL value, while SQLite and MySQL propagate NULL so any NULL argument makes the whole result NULL. Code that works in your test environment can therefore produce different numbers — or silently exclude rows — in production. Django does not paper over this. Wrap every argument in Coalesce with an explicit sentinel so the expression is deterministic regardless of backend, and choose the sentinel (0, a max date, negative infinity) to match the semantics you want.',
        whyHi: 'Greatest aur Least NULL arguments ko databases ke paar alag handle karते hain: PostgreSQL aur Oracle NULLs ignore karते hain, jabki SQLite aur MySQL NULL propagate karते hain to koi bhi NULL argument poore result ko NULL banाता hai. Code jо aapke test environment mein kaam karता hai isliye production mein alag numbers produce kar sakta hai. Har argument ko ek explicit sentinel ke saath Coalesce mein wrap karो.',
      },
      {
        wrong: `top_order_per_customer = Order.objects.annotate(
    rn=Window(RowNumber(), partition_by=[F("customer_id")], order_by=F("total").desc())
).filter(rn=1)
# -> django.db.utils.NotSupportedError / OperationalError:
#    window functions are not allowed in WHERE`,
        right: `# option A: wrap the annotated queryset as a subquery
ranked = Order.objects.annotate(
    rn=Window(RowNumber(), partition_by=[F("customer_id")], order_by=F("total").desc())
)
top = Order.objects.filter(id__in=Subquery(ranked.filter(rn=1).values("id")))

# option B (simple cases): a correlated Subquery for "the top order" (Lesson 2)
# option C: order + distinct on the partition key where the backend supports it`,
        why: 'SQL evaluates WHERE before window functions, so you cannot reference a window result in a WHERE clause — the database rejects filter(rn=1) directly on the window annotation. The standard workaround is to compute the window in an inner query and filter it from an outer query (a subquery or CTE), which is exactly what filtering "the top row per group" requires. Django can sometimes generate this wrapping automatically, but the explicit subquery is predictable across versions and backends. For the specific "one row per group" need, a correlated Subquery selecting the extreme value is often simpler than a window at all.',
        whyHi: 'SQL WHERE ko window functions se pehle evaluate karता hai, to aap ek WHERE clause mein ek window result ko reference nahi kar sakte — database window annotation par seedhे filter(rn=1) reject karता hai. Standard workaround window ko ek inner query mein compute karके ise ek outer query se filter karna hai. Django kabhi ye wrapping automatically generate kar sakta hai, par explicit subquery versions aur backends ke paar predictable hai.',
      },
    ],

    realWorld: [
      {
        en: '**An ops dashboard endpoint that returns one `aggregate()` with a dozen `Count`/`Sum(filter=Q(...))` pairs** — orders today, revenue this week, refund rate, signups by plan — replacing what used to be fourteen separate `.count()` calls, so the page is one DB round-trip.',
        hi: '**Ek ops dashboard endpoint jо ek `aggregate()` ek dozen `Count`/`Sum(filter=Q(...))` pairs ke saath return karता hai** — jо pehle chaudah alag `.count()` calls tha use replace karके.',
      },
      {
        en: '**A "your rank on the leaderboard" feature via `Window(Rank(), order_by=F("score").desc())`** wrapped in a subquery so the app can `filter(rank__lte=100)` for the top 100 and also show one user their exact position in a single query.',
        hi: '**`Window(Rank(), order_by=F("score").desc())` ke through ek "leaderboard par aapka rank" feature** ek subquery mein wrapped taaki app top 100 ke liye `filter(rank__lte=100)` kar sake.',
      },
      {
        en: '**`Lag("balance")` over a partitioned, date-ordered ledger** to compute each transaction\'s delta from the previous balance in the DB, so the statement view never loads the whole account history into Python to diff it.',
        hi: '**Ek partitioned, date-ordered ledger par `Lag("balance")`** har transaction ka pichhle balance se delta DB mein compute karne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'What is conditional aggregation and why is `Count(filter=Q(...))` better than several `.filter().count()` calls?',
        qHi: 'Conditional aggregation kya hai aur `Count(filter=Q(...))` kई `.filter().count()` calls se behtar kyun hai?',
        a: 'Conditional aggregation is passing a filter argument, a Q object, to an aggregate function so that it only counts or sums the rows matching that condition. You put several of them in one aggregate call — paid equals Count of id filtered to status paid, pending equals Count of id filtered to status pending, revenue equals Sum of total filtered to status paid — and Django emits a single SELECT that computes all of them in one scan, using COUNT with a FILTER clause on PostgreSQL or a SUM of a CASE expression on backends without FILTER. The alternative, calling filter then count once per status, runs one query per metric, each doing its own full scan or index lookup, and the numbers can even be inconsistent if rows change between calls. One combined query is fewer round trips, one pass over the data, and a consistent snapshot. The same technique works with annotate instead of aggregate to get per-group conditional counts, like each author annotated with the number of their books that are published.',
        aHi: 'Conditional aggregation ek aggregate function ko ek filter argument, ek Q object, pass karna hai taaki ye sirf us condition se match karne waali rows ko count ya sum kare. Aap kई unhe ek aggregate call mein daalते ho — paid = status paid par filtered id ka Count, pending = status pending par filtered Count, revenue = status paid par filtered total ka Sum — aur Django ek single SELECT emit karता hai jо un sabko ek scan mein compute karता hai, PostgreSQL par ek FILTER clause ke saath COUNT ya FILTER ke bina backends par ek CASE expression ka SUM istemal karके. Vikalp, prati status ek baar filter phir count call karna, prati metric ek query chalाता hai. Ek combined query kam round trips, data par ek pass, aur ek consistent snapshot hai.',
      },
      {
        q: 'What does a window function give you that `GROUP BY` does not, and why can\'t you `filter()` on one?',
        qHi: 'Ek window function aapको kya deता hai jо `GROUP BY` nahi, aur aap ek par `filter()` kyun nahi kar sakte?',
        a: 'GROUP BY collapses each group into a single output row, so once you aggregate you lose the individual rows. A window function computes an aggregate-like value for each row while keeping every row — you get the running total on every order, not one total per customer. You express it with Window, giving an expression, an optional partition_by that restarts the calculation per group, and an order_by that defines the sequence within the partition, which maps to the SQL OVER clause. That lets you do things GROUP BY cannot: rank within a group with Rank or RowNumber, look at the previous or next row with Lag and Lead, a cumulative sum, or a moving average over a frame of nearby rows. You cannot put a window result in a WHERE clause because SQL evaluates WHERE before it evaluates window functions — the row_number simply does not exist yet at filtering time. So to filter on one, for example to get the top row per group, you compute the window in an inner query and filter it from an outer query, via a subquery or a CTE. Django will sometimes build that wrapper for you, but writing the explicit subquery is the portable, predictable pattern.',
        aHi: 'GROUP BY har group ko ek single output row mein collapse karता hai, to ek baar aap aggregate karते ho aap individual rows kho dete ho. Ek window function har row ke liye ek aggregate-jaisी value compute karता hai jabki har row rakhता hai — aapको har order par running total milता hai, prati customer ek total nahi. Aap ise Window se express karते ho, ek expression, ek optional partition_by jо prati group calculation restart karता hai, aur ek order_by jо partition ke andar sequence define karता hai, deकर. Wo aapको wo cheezein karne deता hai jо GROUP BY nahi kar sakta: ek group ke andar rank, Lag aur Lead se pichhli ya agli row dekhना, ek cumulative sum. Aap ek window result ko ek WHERE clause mein nahi daal sakte kyunki SQL WHERE ko window functions se pehle evaluate karता hai. To ek par filter karne ke liye, aap window ko ek inner query mein compute karके ise ek outer query se filter karते ho.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django on SQLite. Model `Ticket(priority=IntegerField, resolved=BooleanField)`. Insert 5 rows of mixed priority/resolved. In ONE `aggregate()` call compute: `open_count` = `Count("id", filter=Q(resolved=False))`, `high_open` = `Count("id", filter=Q(resolved=False, priority__gte=3))`, `avg_priority` = `Avg("priority")`. Wrap it in `CaptureQueriesContext` and assert exactly 1 query ran.',
        taskHi: 'Standalone Django SQLite par. Model `Ticket(priority, resolved)`. 5 rows insert karo. EK `aggregate()` call mein `open_count`, `high_open`, `avg_priority` compute karo. `CaptureQueriesContext` mein wrap karके assert theek 1 query chali.',
        hint: 'Model with `class Meta: app_label = "contenttypes"`, create the table with `connection.schema_editor().create_model(Ticket)` after `call_command("migrate", run_syncdb=True)`. `from django.db.models import Count, Avg, Q`.',
        hintHi: '`class Meta: app_label = "contenttypes"`, table `connection.schema_editor().create_model(Ticket)` se banao. `from django.db.models import Count, Avg, Q`.',
      },
      {
        task: 'Show the `Greatest` NULL trap. Model `Row(a=IntegerField, b=IntegerField(null=True))`. Insert `(10, None)` and `(10, 20)`. Annotate `g_naive=Greatest("a", "b")` and `g_safe=Greatest("a", Coalesce("b", Value(0)))`. Assert row 1 has `g_naive=None` (SQLite) and `g_safe=10`, and row 2 has both `=20`. Add a comment noting PostgreSQL would give `g_naive=10` for row 1.',
        taskHi: '`Greatest` NULL trap dikhाओ. Model `Row(a, b nullable)`. `(10, None)` aur `(10, 20)` insert karo. `g_naive` aur `g_safe` annotate karo. Assert. Comment: PostgreSQL row 1 ke liye `g_naive=10` deता.',
        hint: '`from django.db.models.functions import Greatest, Coalesce`; `from django.db.models import Value`. On SQLite any NULL arg to `Greatest` -> NULL result.',
        hintHi: '`from django.db.models.functions import Greatest, Coalesce`. SQLite par `Greatest` ka koi NULL arg -> NULL result.',
      },
      {
        task: 'Window practice. Model `Score(player=CharField, game=IntegerField, points=IntegerField)`. Insert players "x" (games 1,2,3 = 10,30,20) and "y" (games 1,2 = 50,40). Annotate `best_so_far=Window(Max("points"), partition_by=[F("player")], order_by=F("game").asc())` and `game_rank=Window(RowNumber(), partition_by=[F("player")], order_by=F("points").desc())`. Order by player, game. Assert x\'s `best_so_far` is `[10, 30, 30]` and x\'s `game_rank` values (in game order) are `[3, 1, 2]`.',
        taskHi: 'Window practice. Model `Score(player, game, points)`. Players "x" aur "y" insert karo. `best_so_far` aur `game_rank` annotate karo. Assert x ka `best_so_far` `[10, 30, 30]` hai.',
        hint: '`from django.db.models import Window, F, Max`; `from django.db.models.functions import RowNumber`. `best_so_far` is a running max because of `order_by`.',
        hintHi: '`from django.db.models import Window, F, Max`. `best_so_far` `order_by` ki wajah se ek running max hai.',
      },
    ],

    keyTakeaways: [
      'EXPRESSIONS push computation into SQL and hand it back as an annotation: `Case`/`When`, `Coalesce`, `F`, arithmetic, `Window`. If you find yourself looping in Python to label/bucket/rank rows, that logic usually belongs in the query.',
      '`Case(When(cond, then=Value(x)), When(...), default=Value(y))` = SQL `CASE WHEN`. Conditions are `filter()` lookups (+ `Q`); `then`/`default` are expressions (`Value`, `F`, nested `Case`). First matching `When` wins. Uses: derived labels, non-column sort keys, conditional `update()`.',
      'NULL arithmetic in SQL yields NULL (`100 - NULL` = `NULL`). `Coalesce(a, b, ...)` = first non-NULL. Wrap nullable columns BEFORE arithmetic (`F("total") - Coalesce("discount", Value(0))`) and use it for aggregate defaults (`Coalesce(Sum(...), Value(0))` — `Sum` of nothing is NULL).',
      '`Greatest`/`Least` = row-wise max/min ACROSS columns (not `Max`, which is down a column). NULL behaviour DIFFERS: PostgreSQL/Oracle ignore NULLs; SQLite/MySQL -> any NULL arg makes the result NULL. Portable fix: `Coalesce` every argument to a sentinel first. This is a real dev-SQLite/prod-Postgres bug.',
      'CONDITIONAL AGGREGATION: `.aggregate(paid=Count("id", filter=Q(status="paid")), revenue=Sum("total", filter=Q(status="paid")), ...)` = ONE `SELECT` (`COUNT(...) FILTER (WHERE ...)`), not N `.filter().count()` calls. Also works with `.annotate()` for per-group conditional counts.',
      '`Window(expr, partition_by=[F(...)], order_by=F(...).asc(), frame=...)` = `expr OVER (PARTITION BY ... ORDER BY ...)`. Keeps every row (unlike `GROUP BY`). `partition_by` restarts per group; `order_by` defines "previous"/"running" (with it, `Sum` is cumulative; without, it\'s the partition total).',
      'Window functions: `RowNumber()`, `Rank()` (1,1,3 on ties), `DenseRank()` (1,1,2), `Lag("c", offset=1)`/`Lead(...)`, `Ntile(4)`, `FirstValue`/`LastValue`, + any aggregate. `frame=RowRange(start=-2, end=0)` for a 3-row trailing window.',
      'You CANNOT `filter()` on a window annotation (SQL evaluates `WHERE` before window functions). For "top row per group": compute the window in an inner queryset, then `filter(id__in=Subquery(inner.filter(rn=1).values("id")))` — or use a correlated `Subquery` (Lesson 2).',
    ],
    keyTakeawaysHi: [
      'EXPRESSIONS computation ko SQL mein dhakelते hain aur ise ek annotation ke roop mein wapas dete hain: `Case`/`When`, `Coalesce`, `F`, `Window`. Agar aap rows ko label/bucket/rank karne ke liye Python mein loop kar rahe ho, wo logic aam taur par query mein rehता hai.',
      '`Case(When(cond, then=Value(x)), ..., default=Value(y))` = SQL `CASE WHEN`. Conditions `filter()` lookups hain (+ `Q`); `then`/`default` expressions hain. Pehla matching `When` jeetता hai. Uses: derived labels, non-column sort keys, conditional `update()`.',
      'SQL mein NULL arithmetic NULL deता hai (`100 - NULL` = `NULL`). `Coalesce(a, b, ...)` = pehla non-NULL. Nullable columns ko arithmetic se PEHLE wrap karो aur aggregate defaults ke liye istemal karो.',
      '`Greatest`/`Least` = columns ke PAAR row-wise max/min. NULL behaviour ALAG hai: PostgreSQL/Oracle NULLs ignore karते hain; SQLite/MySQL -> koi NULL arg result ko NULL banाता hai. Portable fix: har argument ko pehle ek sentinel par `Coalesce` karो.',
      'CONDITIONAL AGGREGATION: `.aggregate(paid=Count("id", filter=Q(status="paid")), ...)` = EK `SELECT`, N `.filter().count()` calls nahi. `.annotate()` ke saath bhi kaam karता hai.',
      '`Window(expr, partition_by=[F(...)], order_by=F(...).asc())` = `expr OVER (PARTITION BY ... ORDER BY ...)`. Har row rakhता hai (`GROUP BY` ke vipreet). `order_by` "previous"/"running" define karता hai.',
      'Window functions: `RowNumber()`, `Rank()` (ties par 1,1,3), `DenseRank()` (1,1,2), `Lag`/`Lead`, `Ntile(4)`, + koi aggregate. `frame=RowRange(start=-2, end=0)` ek 3-row trailing window ke liye.',
      'Aap ek window annotation par `filter()` NAHI kar sakte. "prati group top row" ke liye: window ko ek inner queryset mein compute karो, phir `filter(id__in=Subquery(inner.filter(rn=1).values("id")))`.',
    ],
  },

  {
    slug: 'dj-orm-subquery-outerref-and-exists',
    title: 'Correlated Subqueries: `Subquery`, `OuterRef`, `Exists`',
    titleHi: 'Correlated Subqueries: `Subquery`, `OuterRef`, `Exists`',
    description: 'Sometimes each row needs one value from a *related* set — the newest comment\'s date, whether any unpaid invoice exists, the price of this product in the default currency. `OuterRef` lets an inner query point back at the outer row; `Subquery` and `Exists` wrap it into an annotation or a filter.',
    descriptionHi: 'Kabhi har row ko ek *related* set se ek value chahिए — newest comment ki date, kya koi unpaid invoice hai, default currency mein is product ki price. `OuterRef` ek inner query ko outer row par wapas point karne deता hai; `Subquery` aur `Exists` ise ek annotation ya ek filter mein wrap karते hain.',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A clerk filling in one cell of a form by looking something up in another ledger — once per row.** You are going down a list of customers, and for each one you need "date of their most recent order". A **join** would spread every customer across all their orders and then you collapse it back — messy when you only want one field. A **correlated subquery** is the clerk\'s actual method: for *this* customer, flip to the orders ledger, find the rows where `orders.customer_id` matches *this row\'s* id (`OuterRef("pk")`), sort by date, take the top one, write that date in the cell, move to the next customer. `Exists` is the same motion but the clerk only needs a yes/no — "is there *any* matching row?" — and can stop at the first hit instead of reading them all. `OuterRef` is the phrase "this row\'s" — the pointer from the inner lookup back to the outer row being filled in.',
      hi: '**Ek clerk ek form ke ek cell ko ek doosre ledger mein kuch lookup karके bharta hai — prati row ek baar.** Aap customers ki ek list neeche ja rahe ho, aur har ek ke liye aapको "unke sabse recent order ki date" chahिए. Ek **join** har customer ko unke sabhi orders ke paar failा deता aur phir aap ise wapas collapse karते ho — messy jab aap sirf ek field chahते ho. Ek **correlated subquery** clerk ka asli method hai: *is* customer ke liye, orders ledger palto, wo rows dhoondhो jahaan `orders.customer_id` *is row ki* id se match karता hai (`OuterRef("pk")`), date se sort karो, top ek lo, wo date cell mein likho, agle customer par jaao. `Exists` wahi motion hai par clerk ko sirf ek haan/naa chahिए — "kya koi matching row hai?" — aur pehle hit par ruk sakta hai. `OuterRef` "is row ki" vाkyांsh hai.',
    },

    simple: `**\`Exists\` — "does any related row exist?"**

\`\`\`python
from django.db.models import Exists, OuterRef

unpaid = Invoice.objects.filter(customer=OuterRef("pk"), status="unpaid")

Customer.objects.annotate(has_debt=Exists(unpaid))      # -> each customer gets .has_debt (bool)
Customer.objects.filter(Exists(unpaid))                  # -> only customers with an unpaid invoice
Customer.objects.filter(~Exists(unpaid))                 # -> only customers with none
\`\`\`

**\`Subquery\` — "one scalar from a related set"**

\`\`\`python
from django.db.models import Subquery, OuterRef

newest = (Comment.objects
          .filter(article=OuterRef("pk"))
          .order_by("-created")
          .values("created")[:1])                        # MUST be .values(one field) and sliced [:1]

Article.objects.annotate(last_comment_at=Subquery(newest))
\`\`\`

**\`OuterRef\` — the pointer to the outer row**

\`\`\`
OuterRef("pk")             the outer row's primary key
OuterRef("customer_id")    a column on the outer row
OuterRef("author__name")   spanning a relation from the outer row
OuterRef is a lazy reference -- it only resolves when the subquery is embedded in an outer query
\`\`\`

**Correlated aggregate (a value computed over the related set)**

\`\`\`python
from django.db.models import Sum

order_total = (OrderLine.objects
    .filter(order=OuterRef("pk"))
    .values("order")                      # group by the correlation key
    .annotate(t=Sum("amount"))
    .values("t")[:1])

Order.objects.annotate(computed_total=Subquery(order_total))
\`\`\`

**In \`filter()\` and \`update()\`, not just \`annotate()\`**

\`\`\`python
Product.objects.filter(price__gt=Subquery(
    Product.objects.filter(category=OuterRef("category")).values("category")
        .annotate(avg=Avg("price")).values("avg")[:1]
))
# products priced above their own category's average

Order.objects.update(latest_ship=Subquery(
    Shipment.objects.filter(order=OuterRef("pk")).order_by("-sent").values("sent")[:1]
))
\`\`\`

\`\`\`
Exists   -> stops at the first matching row; use for yes/no. Cheaper than Count > 0.
Subquery -> one row, one column ([:1] + .values('field')); NULL if the subquery finds nothing.
vs join/prefetch: use a subquery for ONE derived scalar; use prefetch_related to load the whole set.
\`\`\``,

    simpleHi: `**\`Exists\` — "kya koi related row hai?"**

\`\`\`python
from django.db.models import Exists, OuterRef

unpaid = Invoice.objects.filter(customer=OuterRef("pk"), status="unpaid")

Customer.objects.annotate(has_debt=Exists(unpaid))      # -> har customer ko .has_debt (bool) milता hai
Customer.objects.filter(Exists(unpaid))                  # -> sirf ek unpaid invoice waale customers
Customer.objects.filter(~Exists(unpaid))                 # -> sirf koi nahi waale customers
\`\`\`

**\`Subquery\` — "ek related set se ek scalar"**

\`\`\`python
from django.db.models import Subquery, OuterRef

newest = (Comment.objects
          .filter(article=OuterRef("pk"))
          .order_by("-created")
          .values("created")[:1])                        # .values(ek field) aur sliced [:1] ZAROORI

Article.objects.annotate(last_comment_at=Subquery(newest))
\`\`\`

**\`OuterRef\` — outer row ka pointer**

\`\`\`
OuterRef("pk")             outer row ki primary key
OuterRef("customer_id")    outer row par ek column
OuterRef("author__name")   outer row se ek relation span karते hue
OuterRef ek lazy reference hai -- ye sirf tab resolve hoता hai jab subquery ek outer query mein embed hoता hai
\`\`\`

**Correlated aggregate (related set par computed ek value)**

\`\`\`python
from django.db.models import Sum

order_total = (OrderLine.objects
    .filter(order=OuterRef("pk"))
    .values("order")                      # correlation key se group karो
    .annotate(t=Sum("amount"))
    .values("t")[:1])

Order.objects.annotate(computed_total=Subquery(order_total))
\`\`\`

**\`filter()\` aur \`update()\` mein, sirf \`annotate()\` nahi**

\`\`\`python
Product.objects.filter(price__gt=Subquery(
    Product.objects.filter(category=OuterRef("category")).values("category")
        .annotate(avg=Avg("price")).values("avg")[:1]
))
# apni category ki average se upar priced products
\`\`\`

\`\`\`
Exists   -> pehle matching row par rukता hai; haan/naa ke liye istemal karो. Count > 0 se sasta.
Subquery -> ek row, ek column ([:1] + .values('field')); subquery kuch nahi paता to NULL.
vs join/prefetch: EK derived scalar ke liye ek subquery; poora set load karne ke liye prefetch_related.
\`\`\``,

    content: `## The problem

You have a list of \`Article\`s and you want, per article, the timestamp of its newest comment. Or a list of \`Customer\`s and you want to keep only those with an unpaid invoice. The related data lives in another table, and:

- A **join** (\`select_related\` / a \`.filter(comments__...)\`) multiplies the outer rows by their matches and needs a \`DISTINCT\` or a \`GROUP BY\` to get back to one row per article — awkward when you want *one derived value*, not the related objects.
- **\`prefetch_related\`** loads the whole related set into Python — right when you need *all* the comments, wasteful when you need *one field of one of them*.

A **correlated subquery** is the precise tool: an inner query that runs *once per outer row*, referring back to that outer row via **\`OuterRef\`**.

## \`OuterRef\`

\`OuterRef("field")\` is a placeholder for a column on the **outer** query's row. It does nothing on its own — it only resolves when the queryset containing it is wrapped in \`Subquery\` or \`Exists\` and embedded in an outer query.

\`\`\`python
OuterRef("pk")                # outer row's PK
OuterRef("category_id")       # an FK column on the outer row
OuterRef("author__country")   # follow a relation from the outer row
\`\`\`

## \`Exists\`

\`Exists(queryset)\` becomes SQL \`EXISTS (SELECT 1 FROM ... WHERE ...)\` — **true if the inner query would return at least one row**, and the database can stop at the first match:

\`\`\`python
recent_login = LoginEvent.objects.filter(user=OuterRef("pk"), created__gte=cutoff)

User.objects.annotate(active_recently=Exists(recent_login))   # bool annotation
User.objects.filter(Exists(recent_login))                     # filter directly (Django 3.1+)
User.objects.filter(~Exists(recent_login))                    # negate for "has none"
\`\`\`

Prefer \`Exists\` over \`annotate(n=Count("logins")).filter(n__gt=0)\`: \`Count\` scans and counts every matching row, \`Exists\` short-circuits at the first, and \`Count\` with a join can also inflate other aggregates in the same query.

## \`Subquery\`

\`Subquery(queryset)\` embeds the inner query as a **scalar** — it must resolve to **one row and one column**:

\`\`\`python
newest_comment = (Comment.objects
    .filter(article=OuterRef("pk"))
    .order_by("-created")
    .values("created")[:1])            # .values("<one field>")  AND  [:1]

Article.objects.annotate(last_comment_at=Subquery(newest_comment))
\`\`\`

Two rules the ORM enforces loosely and SQL enforces strictly:

1. **\`.values("one_field")\`** — select exactly one column. \`.values("a", "b")\` in a \`Subquery\` is an error.
2. **\`[:1]\`** — slice to one row. Without it the DB raises "more than one row returned by a subquery".

If the subquery matches nothing, the annotation is **\`NULL\`** — wrap in \`Coalesce\` for a default. Set \`output_field=\` when Django cannot infer the type (e.g. \`Subquery(..., output_field=DateTimeField())\`).

## Correlated aggregates

To annotate each \`Order\` with the sum of its line amounts *via a subquery* (instead of \`annotate(Sum("lines__amount"))\`, which joins), group the inner query by the correlation key:

\`\`\`python
line_total = (OrderLine.objects
    .filter(order=OuterRef("pk"))
    .values("order")                   # GROUP BY order_id
    .annotate(total=Sum("amount"))
    .values("total")[:1])

Order.objects.annotate(lines_total=Subquery(line_total))
\`\`\`

**Why bother when \`annotate(Sum("lines__amount"))\` exists?** Because the join version breaks when you need *two* independent aggregates (summing across two different reverse relations in one query double-counts — the "multiple aggregation" bug). Subqueries stay independent: each is its own isolated \`SELECT\`.

## In \`filter()\` and \`update()\`

Subqueries are expressions, so they work anywhere an expression does:

\`\`\`python
# products priced above their category average
Product.objects.filter(price__gt=Subquery(
    Product.objects.filter(category=OuterRef("category"))
        .values("category").annotate(a=Avg("price")).values("a")[:1]
))

# backfill a denormalised column
Order.objects.update(last_shipment=Subquery(
    Shipment.objects.filter(order=OuterRef("pk")).order_by("-sent").values("sent")[:1]
))
\`\`\`

## Subquery vs join vs prefetch — choosing

| you need | use |
|---|---|
| "does any related row exist" / filter by it | **\`Exists\`** |
| one scalar derived from the related set (latest date, top price, a count) | **\`Subquery\`** (or \`annotate(Count/Sum)\` if it's the only aggregate) |
| the related objects themselves, to display or iterate | **\`prefetch_related\`** |
| fields from a to-one relation on every row | **\`select_related\`** |
| two+ independent aggregates over different relations in one query | **\`Subquery\`** per aggregate (avoids the join double-count) |

Subqueries are not free — each is a nested \`SELECT\` the planner executes per outer row (though good planners rewrite many into joins). For a handful of derived columns on a page-sized result they are ideal; for pulling a whole related collection, \`prefetch_related\` is the right call.`,

    contentHi: `## Samasya

Aapke paas \`Article\`s ki ek list hai aur aap chahते ho, prati article, iske newest comment ka timestamp. Ya \`Customer\`s ki ek list aur aap sirf un ko rakhना chahते ho jinke paas ek unpaid invoice hai. Related data ek doosre table mein rehта hai, aur:

- Ek **join** outer rows ko unke matches se multiply karता hai aur ek row prati article wapas pाने ke liye ek \`DISTINCT\` ya ek \`GROUP BY\` chahिए — awkward jab aap *ek derived value* chahते ho.
- **\`prefetch_related\`** poore related set ko Python mein load karता hai — sahi jab aapको *sabhi* comments chahिए, wasteful jab aapको *ek ka ek field* chahिए.

Ek **correlated subquery** sटीक tool hai: ek inner query jо *prati outer row ek baar* chalता hai, us outer row ko **\`OuterRef\`** ke through refer karके.

## \`OuterRef\`

\`OuterRef("field")\` **outer** query ki row par ek column ke liye ek placeholder hai. Ye apne aap kuch nahi karता — ye sirf tab resolve hoता hai jab ise rakhने waala queryset \`Subquery\` ya \`Exists\` mein wrap hoता hai aur ek outer query mein embed hoता hai.

## \`Exists\`

\`Exists(queryset)\` SQL \`EXISTS (SELECT 1 FROM ... WHERE ...)\` ban jaता hai — **true agar inner query kam se kam ek row return karता**, aur database pehle match par ruk sakta hai:

\`Count("logins") > 0\` par \`Exists\` prefer karो: \`Count\` har matching row ko scan aur count karता hai, \`Exists\` pehle par short-circuit karता hai, aur ek join ke saath \`Count\` usi query mein doosre aggregates ko bhi inflate kar sakta hai.

## \`Subquery\`

\`Subquery(queryset)\` inner query ko ek **scalar** ke roop mein embed karता hai — ise **ek row aur ek column** mein resolve hona chahिए:

\`\`\`python
newest_comment = (Comment.objects
    .filter(article=OuterRef("pk"))
    .order_by("-created")
    .values("created")[:1])            # .values("<ek field>")  AUR  [:1]
\`\`\`

Do niyam: **\`.values("one_field")\`** (theek ek column) aur **\`[:1]\`** (ek row par slice). Agar subquery kuch match nahi karता, annotation **\`NULL\`** hai — ek default ke liye \`Coalesce\` mein wrap karो. Jab Django type infer nahi kar sakta \`output_field=\` set karो.

## Correlated aggregates

Har \`Order\` ko iske line amounts ke sum se *ek subquery ke through* annotate karne ke liye, inner query ko correlation key se group karो:

\`\`\`python
line_total = (OrderLine.objects
    .filter(order=OuterRef("pk"))
    .values("order").annotate(total=Sum("amount")).values("total")[:1])
\`\`\`

**Kyun jab \`annotate(Sum("lines__amount"))\` maujood hai?** Kyunki join version tootता hai jab aapको *do* independent aggregates chahिए (ek query mein do alag reverse relations ke paar summing double-count karता hai). Subqueries independent rehते hain.

## \`filter()\` aur \`update()\` mein

Subqueries expressions hain, to wo kahin bhi kaam karते hain jahaan ek expression karता hai.

## Subquery vs join vs prefetch — chunna

| aapको chahिए | istemal |
|---|---|
| "kya koi related row hai" / ispar filter | **\`Exists\`** |
| related set se ek derived scalar | **\`Subquery\`** |
| related objects khud, dikhाने ya iterate karne ke liye | **\`prefetch_related\`** |
| har row par ek to-one relation se fields | **\`select_related\`** |
| ek query mein alag relations par 2+ independent aggregates | prati aggregate **\`Subquery\`** |

Subqueries muft nahi hain — har ek ek nested \`SELECT\` hai. Ek page-sized result par kuch derived columns ke liye wo ideal hain; ek poora related collection kheenchने ke liye, \`prefetch_related\` sahi call hai.`,

    examples: [
      {
        title: 'Exists: annotate and filter by "has at least one book"',
        titleHi: 'Exists: "kam se kam ek book hai" se annotate aur filter',
        code: `import os, django
from django.conf import settings
os.path.exists("s1.sqlite3") and os.remove("s1.sqlite3")
settings.configure(DEBUG=True, SECRET_KEY="x"*50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "s1.sqlite3"}})
django.setup()
from django.db import models, connection
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

class Author(models.Model):
    name = models.CharField(max_length=20)
    class Meta: app_label = "contenttypes"
class Book(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    title = models.CharField(max_length=40)
    class Meta: app_label = "contenttypes"
with connection.schema_editor() as se:
    se.create_model(Author); se.create_model(Book)

ann = Author.objects.create(name="Ann")
Author.objects.create(name="Cat")                 # no books
Book.objects.create(author=ann, title="A-one")

from django.db.models import Exists, OuterRef
has_books = Book.objects.filter(author=OuterRef("pk"))

for row in Author.objects.annotate(writes=Exists(has_books)).order_by("name").values_list("name", "writes"):
    print(row)
print("with books:", list(Author.objects.filter(Exists(has_books)).values_list("name", flat=True)))
print("without:   ", list(Author.objects.filter(~Exists(has_books)).values_list("name", flat=True)))`,
        output: `('Ann', True)
('Cat', False)
with books: ['Ann']
without:    ['Cat']`,
        explain: '`Exists(has_books)` compiles to SQL `EXISTS (SELECT 1 FROM book WHERE book.author_id = author.id)` -- the `OuterRef("pk")` points at the outer author row. As an annotation it is a boolean per author; passed straight to `.filter()` it keeps only matching authors, and `~Exists(...)` keeps the complement. The database can stop at the first matching book rather than counting them all.',
        explainHi: '`Exists(has_books)` SQL `EXISTS (SELECT 1 FROM book WHERE book.author_id = author.id)` mein compile hota hai -- `OuterRef("pk")` outer author row par point karता hai. Ek annotation ke roop mein ye prati author ek boolean hai; seedhे `.filter()` ko pass karने par ye sirf matching authors rakhता hai, aur `~Exists(...)` complement rakhता hai. Database pehle matching book par ruk sakta hai unhe sab count karne ke bजाy.',
      },
      {
        title: 'Subquery: the newest related row\'s field, NULL when there is none',
        titleHi: 'Subquery: newest related row ka field, koi nahi to NULL',
        code: `import os, django
from django.conf import settings
os.path.exists("s2.sqlite3") and os.remove("s2.sqlite3")
settings.configure(DEBUG=True, SECRET_KEY="x"*50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "s2.sqlite3"}})
django.setup()
from django.db import models, connection
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

class Article(models.Model):
    title = models.CharField(max_length=40)
    class Meta: app_label = "contenttypes"
class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    body = models.CharField(max_length=40)
    class Meta: app_label = "contenttypes"
with connection.schema_editor() as se:
    se.create_model(Article); se.create_model(Comment)

a1 = Article.objects.create(title="First")
a2 = Article.objects.create(title="Second")           # no comments
Comment.objects.create(article=a1, body="early")
Comment.objects.create(article=a1, body="latest")

from django.db.models import Subquery, OuterRef, Value
from django.db.models.functions import Coalesce

newest = Comment.objects.filter(article=OuterRef("pk")).order_by("-id").values("body")[:1]

qs = Article.objects.annotate(
    last_comment=Subquery(newest),
    last_comment_or=Coalesce(Subquery(newest), Value("(none)")),
).order_by("title").values_list("title", "last_comment", "last_comment_or")
for row in qs:
    print(row)`,
        output: `('First', 'latest', 'latest')
('Second', None, '(none)')`,
        explain: 'The subquery filters comments to the outer article, orders newest-first, selects the single `body` column, and slices `[:1]` -- exactly the one-row, one-column shape `Subquery` requires. `First` gets `\'latest\'`. `Second` has no comments, so the subquery matches nothing and the annotation is `NULL`; wrapping it in `Coalesce(..., Value("(none)"))` supplies the default.',
        explainHi: 'Subquery comments ko outer article tak filter karता hai, newest-first order karता hai, single `body` column select karता hai, aur `[:1]` slice karता hai -- theek wo one-row, one-column shape jо `Subquery` ko chahिए. `First` ko `\'latest\'` milता hai. `Second` ke koi comments nahi, to subquery kuch match nahi karता aur annotation `NULL` hai; ise `Coalesce(..., Value("(none)"))` mein wrap karna default deता hai.',
      },
      {
        title: 'Correlated aggregate via Subquery + filter by it',
        titleHi: 'Subquery ke through correlated aggregate + ispar filter',
        code: `import os, django
from django.conf import settings
os.path.exists("s3.sqlite3") and os.remove("s3.sqlite3")
settings.configure(DEBUG=True, SECRET_KEY="x"*50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "s3.sqlite3"}})
django.setup()
from django.db import models, connection
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

class Author(models.Model):
    name = models.CharField(max_length=20)
    class Meta: app_label = "contenttypes"
class Book(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    sold = models.IntegerField()
    class Meta: app_label = "contenttypes"
with connection.schema_editor() as se:
    se.create_model(Author); se.create_model(Book)

ann = Author.objects.create(name="Ann")
ben = Author.objects.create(name="Ben")
Author.objects.create(name="Cat")
for n in (100, 5): Book.objects.create(author=ann, sold=n)
Book.objects.create(author=ben, sold=50)

from django.db.models import Subquery, OuterRef, Sum

sold_sum = (Book.objects.filter(author=OuterRef("pk"))
            .values("author").annotate(s=Sum("sold")).values("s")[:1])

qs = Author.objects.annotate(total_sold=Subquery(sold_sum)).order_by("name")
for a in qs.values_list("name", "total_sold"):
    print(a)

print("selling >= 100:", list(
    Author.objects.annotate(total_sold=Subquery(sold_sum))
    .filter(total_sold__gte=100).values_list("name", flat=True)))`,
        output: `('Ann', 105)
('Ben', 50)
('Cat', None)
selling >= 100: ['Ann']`,
        explain: 'The inner query groups books by author (`.values("author")`) and sums `sold`, then `.values("s")[:1]` reduces it to one scalar per outer author. `Cat` has no books so the sum is `NULL`. Because the whole thing is an expression, the same `Subquery` also works inside `.filter(total_sold__gte=100)` to keep only authors selling 100+.',
        explainHi: 'Inner query books ko author se group karता hai (`.values("author")`) aur `sold` sum karता hai, phir `.values("s")[:1]` ise prati outer author ek scalar mein reduce karता hai. `Cat` ke koi books nahi to sum `NULL` hai. Kyunki poori cheez ek expression hai, wahi `Subquery` `.filter(total_sold__gte=100)` ke andar bhi kaam karता hai sirf 100+ bechने waale authors rakhने ke liye.',
      },
    ],

    mistakes: [
      {
        wrong: `active = User.objects.annotate(
    login_count=Count("loginevent", filter=Q(loginevent__created__gte=cutoff))
).filter(login_count__gt=0)
# scans and counts every recent login per user just to check "> 0";
# and if you add another Count() over a different relation, they multiply`,
        right: `from django.db.models import Exists, OuterRef
recent = LoginEvent.objects.filter(user=OuterRef("pk"), created__gte=cutoff)
active = User.objects.filter(Exists(recent))
# EXISTS stops at the first matching row; independent of any other aggregate`,
        why: 'Using Count to answer a yes/no question makes the database enumerate and tally every matching related row when it only needs to find one. Exists compiles to SQL EXISTS, which the planner can satisfy by finding a single row and stopping. The second problem is subtler: when you have Count over one reverse relation and Sum or Count over another in the same query, the joins multiply and every aggregate is inflated by the other relation\'s row count — the classic "my totals doubled after I added a second annotate" bug. Exists sidesteps both because it is a self-contained subquery that does not join into the outer FROM.',
        whyHi: 'Ek haan/naa sawaal ka jawab dेने ke liye Count istemal karna database ko har matching related row ko enumerate aur tally karvाता hai jab use sirf ek dhoondhना hai. Exists SQL EXISTS mein compile hoता hai, jise planner ek single row dhoondhकर aur rukकर santusht kar sakta hai. Doosri samasya: jab aapke paas ek reverse relation par Count aur doosre par Sum usi query mein hai, joins multiply karते hain aur har aggregate doosre relation ke row count se inflate hoता hai.',
      },
      {
        wrong: `newest = Comment.objects.filter(article=OuterRef("pk")).order_by("-created")
Article.objects.annotate(last_at=Subquery(newest.values("created")))
# no [:1] -> "sub-select returns more than one row"  (or silently wrong on some DBs)

Article.objects.annotate(last=Subquery(newest.values("created", "body")[:1]))
# two columns in a scalar Subquery -> error`,
        right: `newest = (Comment.objects
    .filter(article=OuterRef("pk"))
    .order_by("-created")
    .values("created")[:1])          # exactly one column, exactly one row
Article.objects.annotate(last_at=Subquery(newest))`,
        why: 'A Subquery is embedded as a scalar in the SELECT list, and SQL requires a scalar subquery to yield at most one row and exactly one column. If you forget the [:1] slice, the inner query can return many rows and the database raises an error (or, on some engines and older SQLite, silently picks one). If your .values() names more than one field, you have a multi-column subquery where a scalar is expected. The fix is mechanical: order the inner queryset, call .values() with a single field name, and slice [:1]. When the subquery might match nothing, the result is NULL, so wrap it in Coalesce if the column needs a default.',
        whyHi: 'Ek Subquery SELECT list mein ek scalar ke roop mein embed hoता hai, aur SQL ke liye ek scalar subquery ko zyada se zyada ek row aur theek ek column dेना zaroori hai. Agar aap [:1] slice bhool jaते ho, inner query kई rows return kar sakta hai aur database ek error raise karता hai. Agar aapki .values() ek se zyada field name karती hai, aapke paas ek multi-column subquery hai jahaan ek scalar expected hai. Fix mechanical hai: inner queryset order karो, ek single field name ke saath .values() call karो, aur [:1] slice karो.',
      },
      {
        wrong: `# "give me each order with its line total" -- reaching for a subquery reflexively
line_total = (OrderLine.objects.filter(order=OuterRef("pk"))
    .values("order").annotate(t=Sum("amount")).values("t")[:1])
orders = Order.objects.annotate(total=Subquery(line_total))
# ...when this single aggregate has no join-multiplication problem:
orders = Order.objects.annotate(total=Sum("lines__amount"))   # simpler, one JOIN + GROUP BY`,
        right: `# subquery EARNS its place when there are TWO independent aggregates:
orders = Order.objects.annotate(
    line_total=Subquery(OrderLine.objects.filter(order=OuterRef("pk"))
        .values("order").annotate(t=Sum("amount")).values("t")[:1]),
    refund_total=Subquery(Refund.objects.filter(order=OuterRef("pk"))
        .values("order").annotate(t=Sum("amount")).values("t")[:1]),
)
# annotate(Sum("lines__amount"), Sum("refunds__amount")) would double-count both`,
        why: 'For a single aggregate over one relation, annotate with Sum or Count and a join plus GROUP BY is the simplest correct tool and usually the fastest. The subquery form is more code and often no faster. Where the subquery genuinely wins is multiple independent aggregates in one query: two Sums over two different reverse relations via joins produce a cartesian product of the two related sets, so each sum is multiplied by the other set\'s row count. Isolated subqueries do not share a FROM clause, so each computes correctly. Rule of thumb: one aggregate, use annotate with the join; two or more over different relations, use a subquery each (or split into separate queries).',
        whyHi: 'Ek relation par ek single aggregate ke liye, Sum ya Count ke saath annotate aur ek join plus GROUP BY sabse saral sahi tool hai aur aam taur par sabse tez. Subquery form zyada code hai aur aksar zyada tez nahi. Jahaan subquery asal mein jeetता hai wo ek query mein multiple independent aggregates hai: joins ke through do alag reverse relations par do Sums do related sets ka ek cartesian product produce karते hain. Angoothे ka niyam: ek aggregate, join ke saath annotate istemal karो; alag relations par do ya zyada, prati ek subquery istemal karो.',
      },
    ],

    realWorld: [
      {
        en: '**A user list annotated with `has_active_subscription=Exists(...)` and `last_seen=Subquery(...)`** — two derived columns the admin changelist and the API both use, computed in the list query instead of a per-row property that would N+1.',
        hi: '**`has_active_subscription=Exists(...)` aur `last_seen=Subquery(...)` se annotated ek user list** — do derived columns jо admin changelist aur API dono istemal karते hain.',
      },
      {
        en: '**`Product.objects.annotate(price=Subquery(Price.objects.filter(product=OuterRef("pk"), currency=user_currency).values("amount")[:1]))`** — one price per product in the viewer\'s currency, without joining the whole price table or looping.',
        hi: '**`annotate(price=Subquery(...))` viewer ki currency mein prati product ek price** — poore price table ko join kiye ya loop kiye bina.',
      },
      {
        en: '**A data-fix migration using `Order.objects.update(customer_email=Subquery(Customer.objects.filter(pk=OuterRef("customer_id")).values("email")[:1]))`** — backfilling a denormalised column for millions of rows in one statement instead of a Python loop.',
        hi: '**`Order.objects.update(customer_email=Subquery(...))` istemal karता ek data-fix migration** — ek Python loop ke bजाy ek statement mein millions of rows ke liye ek denormalised column backfill karना.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain `OuterRef`, `Subquery`, and `Exists`. What are the rules for a valid `Subquery`?',
        qHi: '`OuterRef`, `Subquery`, aur `Exists` samjhाओ. Ek valid `Subquery` ke niyam kya hain?',
        a: 'These three build correlated subqueries — an inner query that runs per outer row and refers back to it. OuterRef is the reference to a column on the outer query\'s current row; it is inert until the queryset holding it is wrapped in Subquery or Exists and placed in an outer query, at which point it resolves to, say, the outer row\'s primary key or a foreign key column. Exists wraps a queryset into a SQL EXISTS test: it is true when the inner query would return at least one row, and it is used both as a boolean annotation and directly in filter, including negated with a tilde for "has none". It is the right tool for yes/no questions because the database can stop at the first matching row, unlike Count greater than zero which enumerates all of them. Subquery embeds the inner query as a scalar value in the SELECT or WHERE, so it must produce exactly one column and at most one row: in practice you order the inner queryset, call values with a single field name to pick the one column, and slice with [:1] to guarantee one row. If it matches nothing the value is NULL, so you wrap it in Coalesce when you need a default, and you pass output_field when Django cannot infer the type. Subquery also does correlated aggregates — group the inner query by the correlation key and annotate a Sum or Count — which is how you get several independent aggregates in one query without the join multiplication that plain annotate would cause.',
        aHi: 'Ye teen correlated subqueries banाते hain — ek inner query jо prati outer row chalता hai aur ispar wapas refer karता hai. OuterRef outer query ki current row par ek column ka reference hai; ye tab tak inert hai jab tak ise rakhने waala queryset Subquery ya Exists mein wrap nahi hota aur ek outer query mein rakha nahi jaता. Exists ek queryset ko ek SQL EXISTS test mein wrap karता hai: ye true hai jab inner query kam se kam ek row return karता, aur ise ek boolean annotation aur seedhे filter mein dono istemal kiya jaता hai. Ye haan/naa sawaalon ke liye sahi tool hai kyunki database pehle matching row par ruk sakta hai. Subquery inner query ko ek scalar value ke roop mein embed karता hai, to ise theek ek column aur zyada se zyada ek row produce karना chahिए: practice mein aap inner queryset order karते ho, ek single field name ke saath values call karते ho, aur [:1] se slice karते ho. Agar ye kuch match nahi karता value NULL hai.',
      },
      {
        q: 'When would you use a `Subquery` instead of `annotate(Sum(...))` or `prefetch_related`?',
        qHi: 'Aap `annotate(Sum(...))` ya `prefetch_related` ke bजाy ek `Subquery` kab istemal karोge?',
        a: 'For a single aggregate over one relation, annotate with Sum or Count is simpler and usually faster — it is one join and a GROUP BY, and a Subquery there is just extra code. You reach for Subquery in three situations. First, when you need two or more independent aggregates over different relations in one query: doing that with joins produces a cartesian product of the related sets and each aggregate gets multiplied by the other\'s row count, the classic doubled-totals bug; isolated subqueries each compute correctly because they do not share the outer FROM. Second, when you need one specific scalar from a related set rather than an aggregate — the newest comment\'s date, the top-ranked row\'s id, this product\'s price in one currency — where ordering the inner query and taking the first row is exactly right and a join would need DISTINCT gymnastics. Third, in filter and update, where you want to compare a column to a per-row computed value or backfill a column from another table in a single statement. prefetch_related is a different purpose entirely: it is for when you actually want the related objects in Python — to render them, iterate them, serialize the collection. Subquery is for when you want one derived value and never touch the related rows themselves.',
        aHi: 'Ek relation par ek single aggregate ke liye, Sum ya Count ke saath annotate saral aur aam taur par tez hai. Aap teen situations mein Subquery ke liye pahunchते ho. Pehla, jab aapको ek query mein alag relations par do ya zyada independent aggregates chahिए: ise joins ke saath karna related sets ka ek cartesian product produce karता hai aur har aggregate doosre ke row count se multiply hoता hai; isolated subqueries har ek sahi compute karते hain. Doosra, jab aapको ek aggregate ke bजाy ek related set se ek specific scalar chahिए — newest comment ki date, top-ranked row ki id. Teesra, filter aur update mein, jahaan aap ek column ko ek per-row computed value se compare karna chahते ho. prefetch_related bilkul ek alag maqsad hai: ye tab hai jab aap asal mein Python mein related objects chahते ho.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django on SQLite. Models `Team(name)` and `Player(team=FK, active=BooleanField)`. Create three teams; give team A two players (one active), team B one inactive player, team C none. Using `Exists(Player.objects.filter(team=OuterRef("pk"), active=True))`, list each team with a `has_active` bool, then `filter(...)` to the teams that have an active player. Assert only team A qualifies.',
        taskHi: 'Standalone Django SQLite par. Models `Team(name)` aur `Player(team=FK, active)`. Teen teams banao. `Exists(...)` se har team ko `has_active` bool ke saath list karo, phir active player waali teams par `filter`. Assert sirf team A.',
        hint: '`from django.db.models import Exists, OuterRef`. `Team.objects.filter(Exists(subq))` works directly. `~Exists(subq)` for the complement.',
        hintHi: '`from django.db.models import Exists, OuterRef`. `Team.objects.filter(Exists(subq))` seedhे kaam karता hai.',
      },
      {
        task: 'Models `Product(name)` and `PriceChange(product=FK, price=IntegerField, effective=DateField)`. Give one product three price changes on different dates, another product none. Annotate each product with `current_price = Subquery(PriceChange.objects.filter(product=OuterRef("pk")).order_by("-effective").values("price")[:1])` and `current_or_zero = Coalesce(that_subquery, Value(0))`. Assert the first product shows its latest price and the second shows `None` / `0`.',
        taskHi: 'Models `Product(name)` aur `PriceChange(product=FK, price, effective)`. Ek product ko teen price changes do, doosre ko koi nahi. `current_price` aur `current_or_zero` annotate karo. Assert.',
        hint: 'Build the subquery once as a variable and reuse it in both `Subquery(sq)` and `Coalesce(Subquery(sq), Value(0))`. The `[:1]` and single-field `.values()` are mandatory.',
        hintHi: 'Subquery ko ek variable ke roop mein ek baar banao aur dono mein reuse karo. `[:1]` aur single-field `.values()` anivarya hain.',
      },
      {
        task: 'Demonstrate the double-count trap. Models `Order(name)`, `Line(order=FK, amount=IntegerField)`, `Refund(order=FK, amount=IntegerField)`. One order with 2 lines (10, 20) and 2 refunds (5, 5). Compare: `Order.objects.annotate(l=Sum("line__amount"), r=Sum("refund__amount"))` (assert `l` and `r` are INFLATED — not 30 and 10) versus two `Subquery` correlated aggregates (assert `l=30`, `r=10`). Comment on why the join version is wrong.',
        taskHi: 'Double-count trap dikhाओ. Models `Order`, `Line(order=FK, amount)`, `Refund(order=FK, amount)`. 2 lines (10, 20) aur 2 refunds (5, 5) waala ek order. `annotate(Sum, Sum)` (assert INFLATED) vs do `Subquery` aggregates (assert `l=30`, `r=10`).',
        hint: 'The join version multiplies: 2 lines x 2 refunds = 4 rows, so `Sum("line__amount")` = (10+20)*2 = 60 and `Sum("refund__amount")` = (5+5)*2 = 20. Subqueries stay isolated.',
        hintHi: 'Join version multiply karता hai: 2 lines x 2 refunds = 4 rows. Subqueries isolated rehते hain.',
      },
    ],

    keyTakeaways: [
      'A CORRELATED SUBQUERY runs the inner query once per outer row, referring back via `OuterRef("field")` (the outer row\'s pk / an FK column / `OuterRef("rel__field")`). `OuterRef` is inert until wrapped in `Subquery`/`Exists` and embedded in an outer query.',
      '`Exists(qs)` = SQL `EXISTS (SELECT 1 ...)` -> `True` if the inner query has ≥1 row; the DB stops at the first. Use as a bool annotation OR directly in `.filter(Exists(qs))` / `.filter(~Exists(qs))`. PREFER over `Count(...) > 0` (which enumerates every row AND inflates other aggregates via the join).',
      '`Subquery(qs)` embeds the inner query as a SCALAR -> qs MUST be `.values("<one field>")` AND sliced `[:1]`. Two columns = error; no `[:1]` = "more than one row" error. Matches nothing -> annotation is `NULL` (wrap in `Coalesce` for a default). `output_field=` when the type can\'t be inferred.',
      'CORRELATED AGGREGATE via subquery: `Model.objects.filter(fk=OuterRef("pk")).values("fk").annotate(t=Sum("x")).values("t")[:1]` — group the inner query by the correlation key.',
      'Subqueries work in `annotate()`, `filter()` (`price__gt=Subquery(...)`), AND `update()` (backfill a denormalised column in one statement).',
      'ONE aggregate over ONE relation -> `annotate(Sum("rel__field"))` is simpler and usually faster. TWO+ independent aggregates over DIFFERENT relations in one query -> `Subquery` each: joins produce a cartesian product and every aggregate gets multiplied by the other relation\'s row count (the "doubled totals" bug). Subqueries stay isolated.',
      'CHOOSING: "does any related row exist / filter by it" -> `Exists`. "one derived scalar from the related set" -> `Subquery`. "the related objects themselves (display/iterate)" -> `prefetch_related`. "to-one fields on every row" -> `select_related`.',
      'Subqueries are not free — each is a nested `SELECT` per outer row (good planners rewrite many to joins). Fine for a few derived columns on a page of results; wrong for loading a whole related collection.',
    ],
    keyTakeawaysHi: [
      'Ek CORRELATED SUBQUERY inner query ko prati outer row ek baar chalाता hai, `OuterRef("field")` ke through wapas refer karके. `OuterRef` tab tak inert hai jab tak `Subquery`/`Exists` mein wrap aur ek outer query mein embed na ho.',
      '`Exists(qs)` = SQL `EXISTS (SELECT 1 ...)` -> `True` agar inner query ke ≥1 row; DB pehle par rukता hai. Ek bool annotation YA seedhे `.filter(Exists(qs))` mein istemal karो. `Count(...) > 0` par PREFER karो.',
      '`Subquery(qs)` inner query ko ek SCALAR ke roop mein embed karता hai -> qs `.values("<ek field>")` AUR sliced `[:1]` hona CHAHIYE. Do columns = error; koi `[:1]` nahi = "more than one row" error. Kuch match nahi -> `NULL` (`Coalesce` mein wrap karो).',
      'Subquery ke through CORRELATED AGGREGATE: `Model.objects.filter(fk=OuterRef("pk")).values("fk").annotate(t=Sum("x")).values("t")[:1]`.',
      'Subqueries `annotate()`, `filter()`, AUR `update()` mein kaam karते hain.',
      'EK relation par EK aggregate -> `annotate(Sum("rel__field"))` saral aur aam taur par tez. DO+ independent aggregates alag relations par -> prati ek `Subquery`: joins ek cartesian product produce karते hain aur har aggregate doosre relation ke row count se multiply hoता hai. Subqueries isolated rehते hain.',
      'CHUNNA: "kya koi related row hai" -> `Exists`. "related set se ek derived scalar" -> `Subquery`. "related objects khud" -> `prefetch_related`. "har row par to-one fields" -> `select_related`.',
      'Subqueries muft nahi — har ek prati outer row ek nested `SELECT`. Page of results par kuch derived columns ke liye theek; ek poora related collection load karne ke liye galat.',
    ],
  },
];
