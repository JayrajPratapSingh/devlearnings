/**
 * Django Complete Course — Module 9: Admin, Dashboards & Observability, lessons 4-6.
 *
 * Lesson 4: metrics dashboards — aggregation with .values().annotate(), time series with
 *           Trunc* + a date spine, Count(filter=Q(...)) conditional counts, a custom admin
 *           index / AdminSite, caching the dashboard, "don't rebuild Grafana in Django".
 * Lesson 5: logging — the LOGGING dictConfig, loggers vs handlers vs formatters,
 *           propagation, level filtering, the django.* loggers (request / server / db.backends
 *           / security), structured / JSON logs, a request-id middleware, what never to log.
 * Lesson 6: Sentry, health checks & metrics — sentry_sdk.init + DjangoIntegration,
 *           before_send scrubbing / send_default_pii, environment / release, traces_sample_rate,
 *           capture_exception / capture_message; liveness vs readiness endpoints; a
 *           Prometheus /metrics view (Counter / Histogram) and the four golden signals.
 *
 * Conventions: see course-django-module9.ts header. Admin/dashboard examples need the FULL
 * stack + call_command("migrate", run_syncdb=True). Logging examples use a capturing Handler
 * subclass + logging.config.dictConfig with the formatter/handler passed as CLASS OBJECTS
 * (a "__main__.X" dotted path does not resolve). Sentry examples use a custom Transport that
 * captures envelopes offline (no network). prometheus_client + sentry_sdk are installed.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_9_PART2: CourseLesson[] = [
  {
    slug: 'dj-metrics-dashboards',
    title: 'Internal Metrics Dashboards with the ORM',
    titleHi: 'ORM Ke Saath Internal Metrics Dashboards',
    description: 'A "signups this week", "revenue by plan", "tickets by status" dashboard is just aggregation queries — `.values().annotate()` for group-bys, `Trunc*` for time series, `Count(filter=Q(...))` for conditional counts. You can render it in a template or bolt it onto the admin index. What you should not do is rebuild Grafana.',
    descriptionHi: 'Ek "is hafte signups", "revenue by plan", "tickets by status" dashboard sirf aggregation queries hai — group-bys ke liye `.values().annotate()`, time series ke liye `Trunc*`, conditional counts ke liye `Count(filter=Q(...))`. Aap ise ek template mein render kar sakte ho ya ise admin index par bolt kar sakte ho. Jo aapko nahi karna chahiye wo Grafana dobara banana hai.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 4,

    analogy: {
      en: '**A shop\'s end-of-day summary sheet, filled in from the till roll.** The till roll (your tables) has every individual transaction; the summary sheet has "units sold by category", "takings by hour", "refunds vs sales". You produce it by *grouping* the roll — tally marks per category (`values("category").annotate(Count("id"))`), buckets per hour (`TruncHour`), a separate column for the refunds (`Count(filter=Q(kind="refund"))`). It is a handful of aggregate queries, not a data warehouse. Pinning that sheet inside the manager\'s office is the admin dashboard: convenient, right where they already are. But when the questions get deep — "cohort retention by acquisition channel over 18 months, sliced three ways" — that is not a summary sheet any more, that is analytics, and you send it to the tool built for it (a warehouse, a BI product) rather than growing a second one inside your app.',
      hi: '**Ek shop ki end-of-day summary sheet, till roll se bhari gayi.** Till roll (aapki tables) mein har individual transaction hai; summary sheet mein "units sold by category", "takings by hour", "refunds vs sales" hai. Aap ise roll ko *group* karke produce karte ho — prati category tally marks (`values("category").annotate(Count("id"))`), prati hour buckets (`TruncHour`), refunds ke liye ek alag column (`Count(filter=Q(kind="refund"))`). Ye kuch aggregate queries hai, ek data warehouse nahi. Us sheet ko manager ke office ke andar pin karna admin dashboard hai: suvidhajanak, theek wahaan jahaan wo pehle se hain. Par jab sawaal gehre ho jaate hain — "18 mahine mein acquisition channel se cohort retention, teen tarah sliced" — wo ab ek summary sheet nahi, wo analytics hai, aur aap ise uske liye bane tool ko bhejte ho.',
    },

    simple: `**Group-by = \`.values(...).annotate(...)\`**

\`\`\`python
from django.db.models import Count, Sum, Avg, Q

# tickets by status: [{"status": "open", "n": 42}, {"status": "closed", "n": 310}, ...]
Ticket.objects.values("status").annotate(n=Count("id")).order_by("status")

# revenue by plan
Subscription.objects.values("plan__name").annotate(mrr=Sum("amount")).order_by("-mrr")
\`\`\`

**Conditional counts in one query — \`Count(filter=Q(...))\`**

\`\`\`python
Order.objects.aggregate(
    total     = Count("id"),
    paid      = Count("id", filter=Q(status="paid")),
    refunded  = Count("id", filter=Q(status="refunded")),
    revenue   = Sum("total", filter=Q(status="paid")),
)
# -> {"total": 1200, "paid": 1040, "refunded": 33, "revenue": 91820}   (ONE SELECT)
\`\`\`

**Time series — \`Trunc*\` + group-by the bucket**

\`\`\`python
from django.db.models.functions import TruncDate, TruncWeek, TruncMonth

(User.objects
 .filter(date_joined__gte=start)
 .annotate(day=TruncDate("date_joined"))
 .values("day")
 .annotate(signups=Count("id"))
 .order_by("day"))
# [{"day": date(2026, 9, 1), "signups": 12}, {"day": date(2026, 9, 2), "signups": 9}, ...]
\`\`\`

\`\`\`
gap-filling: the query only returns days that HAD signups. Build a full date range in Python
             and left-join the dict, so a zero-signup day shows 0, not a missing point.
\`\`\`

**Where the dashboard lives**

\`\`\`python
# option A: a plain staff-only view + template + a chart lib on the frontend
@staff_member_required
def dashboard(request):
    data = cache.get_or_set("dash:v3", build_dashboard, 300)   # cache it -- these scans are not free
    return render(request, "dashboard.html", {"data": data})

# option B: override the admin index
class MyAdminSite(admin.AdminSite):
    def index(self, request, extra_context=None):
        extra_context = {**(extra_context or {}), "metrics": cache.get_or_set("dash", build, 300)}
        return super().index(request, extra_context)
\`\`\`

\`\`\`
DO:   a handful of aggregate queries, cached, on a staff-only page or the admin index
DO:   run heavy dashboard scans off a read replica (Module 8 lesson 5)
DON'T: per-user real-time charts, 30-panel dashboards, ad-hoc slicing, 2-year cohort analysis
       -> that is a BI tool / warehouse job, not a Django view
\`\`\``,

    simpleHi: `**Group-by = \`.values(...).annotate(...)\`**

\`\`\`python
from django.db.models import Count, Sum, Avg, Q

# tickets by status: [{"status": "open", "n": 42}, {"status": "closed", "n": 310}, ...]
Ticket.objects.values("status").annotate(n=Count("id")).order_by("status")

# revenue by plan
Subscription.objects.values("plan__name").annotate(mrr=Sum("amount")).order_by("-mrr")
\`\`\`

**Ek query mein conditional counts — \`Count(filter=Q(...))\`**

\`\`\`python
Order.objects.aggregate(
    total     = Count("id"),
    paid      = Count("id", filter=Q(status="paid")),
    refunded  = Count("id", filter=Q(status="refunded")),
    revenue   = Sum("total", filter=Q(status="paid")),
)
# -> {"total": 1200, "paid": 1040, "refunded": 33, "revenue": 91820}   (EK SELECT)
\`\`\`

**Time series — \`Trunc*\` + bucket group-by**

\`\`\`python
from django.db.models.functions import TruncDate, TruncWeek, TruncMonth

(User.objects
 .filter(date_joined__gte=start)
 .annotate(day=TruncDate("date_joined"))
 .values("day")
 .annotate(signups=Count("id"))
 .order_by("day"))
# [{"day": date(2026, 9, 1), "signups": 12}, {"day": date(2026, 9, 2), "signups": 9}, ...]
\`\`\`

\`\`\`
gap-filling: query sirf un dinon ko return karta hai jinME signups THE. Python mein ek poora
             date range banao aur dict ko left-join karo, taaki ek zero-signup din 0 dikhaye.
\`\`\`

**Dashboard kahaan rehta hai**

\`\`\`python
# option A: ek plain staff-only view + template + frontend par ek chart lib
@staff_member_required
def dashboard(request):
    data = cache.get_or_set("dash:v3", build_dashboard, 300)   # cache karo -- ye scans muft nahi
    return render(request, "dashboard.html", {"data": data})

# option B: admin index override karo
class MyAdminSite(admin.AdminSite):
    def index(self, request, extra_context=None):
        extra_context = {**(extra_context or {}), "metrics": cache.get_or_set("dash", build, 300)}
        return super().index(request, extra_context)
\`\`\`

\`\`\`
KARO:   kuch aggregate queries, cached, ek staff-only page ya admin index par
KARO:   bhaari dashboard scans ek read replica se chalao (Module 8 lesson 5)
NAHI:   per-user real-time charts, 30-panel dashboards, ad-hoc slicing, 2-saal cohort analysis
        -> wo ek BI tool / warehouse job hai, ek Django view nahi
\`\`\``,

    content: `## The dashboard is aggregation queries

Every "internal metrics" screen decomposes into three query shapes, all from Module 3:

### 1. Group-by counts / sums

\`\`\`python
Ticket.objects.values("status").annotate(n=Count("id"))
\`\`\`

\`.values("status")\` becomes the SQL \`GROUP BY status\`; \`.annotate(n=Count("id"))\` is the aggregate per group. Add \`.order_by()\` explicitly — a model \`Meta.ordering\` sneaks into the \`GROUP BY\` and breaks the grouping (Module 3 lesson 4).

### 2. Conditional aggregates in one pass

Instead of five separate \`.filter().count()\` queries for "how many open / closed / urgent / overdue / mine", use \`Count(filter=Q(...))\` in a single \`aggregate()\`:

\`\`\`python
Ticket.objects.aggregate(
    open_n     = Count("id", filter=Q(status="open")),
    urgent_n   = Count("id", filter=Q(priority="urgent")),
    overdue_n  = Count("id", filter=Q(due__lt=today, status="open")),
)
\`\`\`

One \`SELECT\` with \`COUNT(CASE WHEN ...)\` columns. This is the single biggest win for a dashboard that currently fires 20 count queries.

### 3. Time series

\`\`\`python
from django.db.models.functions import TruncDate, TruncMonth

(Order.objects
 .filter(created__gte=since)
 .annotate(bucket=TruncDate("created"))     # or TruncWeek / TruncMonth / TruncHour
 .values("bucket")
 .annotate(count=Count("id"), revenue=Sum("total"))
 .order_by("bucket"))
\`\`\`

\`Trunc*\` collapses a timestamp to the start of its day/week/month; grouping by it gives one row per bucket. **The gap-filling problem:** the query only returns buckets that had rows. If Tuesday had zero signups, there is no Tuesday row, and a naive chart draws a line straight from Monday to Wednesday. Fix it in Python: generate the full list of dates in the range, and merge:

\`\`\`python
rows = {r["bucket"]: r["count"] for r in qs}
series = [(d, rows.get(d, 0)) for d in daterange(start, end)]
\`\`\`

## Where it lives

- **A staff-only view.** \`@staff_member_required\` (or \`@user_passes_test(lambda u: u.is_staff)\`), a template, and a small chart library (Chart.js, or server-rendered SVG). Full control over layout.
- **The admin index.** Subclass \`AdminSite\`, override \`index()\` to add your metrics to \`extra_context\`, and use a custom \`index_template\`. The dashboard shows up on the admin home page where staff already land. Less layout freedom, zero extra auth to wire.
- **A read-only \`ModelAdmin\` on an unmanaged "view" model** backed by a database view — for metrics that map cleanly to rows.

## Cache it

Dashboard queries scan and aggregate — they are not free, and a dashboard that 10 staff refresh every minute is 10 heavy scans a minute against your primary. Wrap the whole \`build_dashboard()\` in \`cache.get_or_set("dash:v{N}", build, timeout=300)\` (Module 7). Bump the version when the shape changes. For truly heavy ones, compute them in a Celery Beat task every 5 minutes and have the view just read the cached result — the dashboard is never slow and never competes with request traffic.

## Run it off a replica

A dashboard doing full-table aggregates is exactly the workload to route to a read replica (Module 8 lesson 5): \`Order.objects.using("analytics").values(...)...\`. A slow \`GROUP BY\` over 10M rows then never touches the connection pool serving checkout.

## Know when to stop

The ORM dashboard is right for: a fixed set of operational numbers, refreshed every few minutes, that the team glances at. It is **wrong** for: ad-hoc "let me slice this by five dimensions", real-time streaming panels, 2-year retention cohorts, anything a product/data team wants to explore interactively. That is a BI tool (Metabase, Looker, Superset) pointed at a replica or a warehouse. Building a query builder inside your Django app is a project that never ends; a read replica plus Metabase is an afternoon.`,

    contentHi: `## Dashboard aggregation queries hai

Har "internal metrics" screen teen query shapes mein toot ta hai, sab Module 3 se:

### 1. Group-by counts / sums

\`.values("status")\` SQL \`GROUP BY status\` ban jaata hai; \`.annotate(n=Count("id"))\` prati group aggregate hai. \`.order_by()\` explicitly add karo — ek model \`Meta.ordering\` \`GROUP BY\` mein ghus jaata hai aur grouping todta hai (Module 3 lesson 4).

### 2. Ek pass mein conditional aggregates

"kitne open / closed / urgent" ke liye paanch alag \`.filter().count()\` queries ke badle, ek single \`aggregate()\` mein \`Count(filter=Q(...))\` istemal karo. Ek \`SELECT\` \`COUNT(CASE WHEN ...)\` columns ke saath. Ye ek dashboard ke liye sabse bada win hai jo abhi 20 count queries fire karta hai.

### 3. Time series

\`Trunc*\` ek timestamp ko iske din/hafte/mahine ki shuruat mein collapse karta hai; isse group karna prati bucket ek row deta hai. **Gap-filling problem:** query sirf un buckets ko return karta hai jinme rows thi. Agar Tuesday mein zero signups the, koi Tuesday row nahi. Ise Python mein fix karo: range mein dates ki poori list generate karo, aur merge karo.

## Ye kahaan rehta hai

- **Ek staff-only view.** \`@staff_member_required\`, ek template, aur ek chhoti chart library.
- **Admin index.** \`AdminSite\` subclass karo, \`index()\` override karo apne metrics ko \`extra_context\` mein add karne ko.
- **Ek unmanaged "view" model par ek read-only \`ModelAdmin\`** ek database view se backed.

## Ise cache karo

Dashboard queries scan aur aggregate karti hain — wo muft nahi hain. Poore \`build_dashboard()\` ko \`cache.get_or_set("dash:v{N}", build, timeout=300)\` mein wrap karo (Module 7). Sach mein bhaari ke liye, unhe ek Celery Beat task mein har 5 minute compute karo.

## Ise ek replica se chalao

Full-table aggregates karta ek dashboard theek wo workload hai jise ek read replica par route karo (Module 8 lesson 5).

## Jaano kab rukna hai

ORM dashboard iske liye sahi hai: operational numbers ka ek fixed set, har kuch minute refreshed, jise team dekhta hai. Ye iske liye **galat** hai: ad-hoc "isse paanch dimensions se slice karne do", real-time streaming panels, 2-saal retention cohorts. Wo ek BI tool (Metabase, Superset) hai ek replica ya warehouse par pointed. Apne Django app ke andar ek query builder banana ek project hai jo kabhi khatam nahi hota; ek read replica plus Metabase ek dopahar hai.`,

    examples: [
      {
        title: 'Group-by and conditional counts: one aggregate() instead of many .count()s',
        titleHi: 'Group-by aur conditional counts: kई .count()s ke badle ek aggregate()',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField")
django.setup()

from django.db import models, connection
from django.db.models import Count, Sum, Q
from django.test.utils import CaptureQueriesContext

class Order(models.Model):
    status = models.CharField(max_length=10)
    total = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Order)
Order.objects.bulk_create([
    Order(status=s, total=t)
    for s, t in [("paid", 100), ("paid", 250), ("paid", 90),
                 ("refunded", 100), ("pending", 40), ("pending", 60)]
])

# group-by: count + revenue per status
by_status = list(Order.objects.values("status").annotate(n=Count("id"), rev=Sum("total")).order_by("status"))
print("by status:", by_status)

# conditional aggregates -- ONE query for the whole summary card
with CaptureQueriesContext(connection) as ctx:
    summary = Order.objects.aggregate(
        total_orders = Count("id"),
        paid         = Count("id", filter=Q(status="paid")),
        refunded     = Count("id", filter=Q(status="refunded")),
        gross_paid   = Sum("total", filter=Q(status="paid")),
    )
print("summary card:", summary)
print("queries for the summary card:", len(ctx.captured_queries), "(not 4)")`,
        output: `by status: [{'status': 'paid', 'n': 3, 'rev': 440}, {'status': 'pending', 'n': 2, 'rev': 100}, {'status': 'refunded', 'n': 1, 'rev': 100}]
summary card: {'total_orders': 6, 'paid': 3, 'refunded': 1, 'gross_paid': 440}
queries for the summary card: 1 (not 4)`,
        explain: 'values("status").annotate(n=Count("id"), rev=Sum("total")) compiles to GROUP BY status with a count and a sum per group -- one query for the whole per-status breakdown. The summary card uses a different shape: Count("id", filter=Q(status="paid")) and friends inside a single aggregate() call become COUNT(CASE WHEN ...) columns in one SELECT, so all four numbers -- total, paid, refunded, gross_paid -- come back in exactly 1 query instead of 4 separate .filter().count() round trips. That is the single biggest win for a dashboard with many count tiles.',
        explainHi: 'values("status").annotate(n=Count("id"), rev=Sum("total")) GROUP BY status mein compile hota hai prati group ek count aur ek sum ke saath -- poore per-status breakdown ke liye ek query. Summary card ek alag shape istemal karta hai: ek single aggregate() call ke andar Count("id", filter=Q(status="paid")) aur iske jaise ek SELECT mein COUNT(CASE WHEN ...) columns ban jaate hain, toh chaaron numbers theek 1 query mein wapas aate hain 4 alag .filter().count() round trips ke bजाy. Wo kई count tiles waale ek dashboard ke liye sabse bada win hai.',
      },
      {
        title: 'A daily time series with Trunc, then gap-filled in Python',
        titleHi: 'Trunc ke saath ek daily time series, phir Python mein gap-filled',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField")
django.setup()

from datetime import date, datetime, timedelta, timezone
from django.db import models, connection
from django.db.models import Count
from django.db.models.functions import TruncDate

class Signup(models.Model):
    created = models.DateTimeField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Signup)

base = datetime(2026, 9, 1, 12, 0, tzinfo=timezone.utc)
# signups on Sep 1 (x3), Sep 2 (x1), Sep 4 (x2) -- NOTHING on Sep 3
for day, n in [(0, 3), (1, 1), (3, 2)]:
    Signup.objects.bulk_create([Signup(created=base + timedelta(days=day)) for _ in range(n)])

qs = (Signup.objects
      .annotate(d=TruncDate("created"))
      .values("d")
      .annotate(n=Count("id"))
      .order_by("d"))
raw = {r["d"]: r["n"] for r in qs}
print("raw query rows (only days with signups):", [(str(k), v) for k, v in raw.items()])

# gap-fill: build the full spine Sep 1..Sep 4 and left-join
start, end = date(2026, 9, 1), date(2026, 9, 4)
spine = [start + timedelta(days=i) for i in range((end - start).days + 1)]
series = [(str(d), raw.get(d, 0)) for d in spine]
print("gap-filled series:", series)`,
        output: `raw query rows (only days with signups): [('2026-09-01', 3), ('2026-09-02', 1), ('2026-09-04', 2)]
gap-filled series: [('2026-09-01', 3), ('2026-09-02', 1), ('2026-09-03', 0), ('2026-09-04', 2)]`,
        explain: 'TruncDate("created") collapses each timestamp to its date; grouping by it gives one row per date that had signups. Sep 3 had none, so the raw query returns only three rows -- a chart drawn straight from that would jump from Sep 2 to Sep 4 as if Sep 3 did not exist. The fix is pure Python: build the complete list of dates in the window (the "spine"), turn the query result into a dict keyed by date, and map every spine date to raw.get(d, 0). Now Sep 3 is an explicit zero and the series has one entry per day.',
        explainHi: 'TruncDate("created") har timestamp ko iski date mein collapse karta hai; isse group karna prati us date ek row deta hai jismein signups the. Sep 3 mein koi nahi tha, toh raw query sirf teen rows return karta hai -- usse seedhe banaya ek chart Sep 2 se Sep 4 kood jaata jaise Sep 3 exist hi nahi karta. Fix pure Python hai: window mein dates ki poori list banao ("spine"), query result ko date se keyed ek dict mein badlo, aur har spine date ko raw.get(d, 0) map karo. Ab Sep 3 ek explicit zero hai.',
      },
      {
        title: 'A cached dashboard builder: the view reads cache, not the DB, on a hit',
        titleHi: 'Ek cached dashboard builder: view hit par cache padhta hai, DB nahi',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField")
django.setup()

from django.db import models, connection
from django.db.models import Count, Sum, Q
from django.core.cache import cache
from django.test.utils import CaptureQueriesContext

class Ticket(models.Model):
    status = models.CharField(max_length=10)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Ticket)
Ticket.objects.bulk_create([Ticket(status=s) for s in ["open", "open", "open", "closed", "closed"]])

DASH_VERSION = 3

def build_dashboard():
    return {
        "by_status": list(Ticket.objects.values("status").annotate(n=Count("id")).order_by("status")),
        "counts": Ticket.objects.aggregate(total=Count("id"), open=Count("id", filter=Q(status="open"))),
    }

def dashboard_data():
    return cache.get_or_set(f"dash:v{DASH_VERSION}", build_dashboard, timeout=300)

with CaptureQueriesContext(connection) as c1:
    d1 = dashboard_data()          # MISS -> builds -> 2 queries
with CaptureQueriesContext(connection) as c2:
    d2 = dashboard_data()          # HIT  -> 0 queries
with CaptureQueriesContext(connection) as c3:
    d3 = dashboard_data()          # HIT  -> 0 queries

print("first call queries: ", len(c1.captured_queries))
print("cached call queries:", len(c2.captured_queries), "/", len(c3.captured_queries))
print("data identical:", d1 == d2 == d3)
print("open tickets:", d1["counts"]["open"])`,
        output: `first call queries:  2
cached call queries: 0 / 0
data identical: True
open tickets: 3`,
        explain: "build_dashboard runs two aggregate queries. dashboard_data wraps it in cache.get_or_set with the key dash:v3, so the first call is a MISS that builds and caches the result (2 queries), and the next two calls are HITs that return the cached dict with zero queries. The version segment in the key (v3) is what you bump when the dashboard's shape changes -- old cached blobs under v2 are then simply never read again. In production this is what stops ten staff refreshing the page every minute from becoming ten heavy scans a minute.",
        explainHi: 'build_dashboard do aggregate queries chalata hai. dashboard_data ise cache.get_or_set mein key dash:v3 ke saath wrap karta hai, toh pehla call ek MISS hai jo result build aur cache karta hai (2 queries), aur agle do calls HITs hain jo zero queries ke saath cached dict return karte hain. Key mein version segment (v3) wo hai jo aap dashboard ki shape badalne par bump karte ho -- v2 ke tahat purane cached blobs phir kabhi nahi padhe jaate. Production mein yahi das staff ko har minute page refresh karne ko das bhaari scans banne se rokta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `def dashboard(request):
    ctx = {
        "open":     Ticket.objects.filter(status="open").count(),
        "closed":   Ticket.objects.filter(status="closed").count(),
        "urgent":   Ticket.objects.filter(priority="urgent").count(),
        "overdue":  Ticket.objects.filter(due__lt=today, status="open").count(),
        "mine":     Ticket.objects.filter(assignee=request.user).count(),
        # ... 15 more ...
    }
    return render(request, "dashboard.html", ctx)
# 20 COUNT queries per page load, uncached, on the primary`,
        right: `def dashboard(request):
    ctx = Ticket.objects.aggregate(
        open=Count("id", filter=Q(status="open")),
        closed=Count("id", filter=Q(status="closed")),
        urgent=Count("id", filter=Q(priority="urgent")),
        overdue=Count("id", filter=Q(due__lt=today, status="open")),
        mine=Count("id", filter=Q(assignee=request.user)),
    )
    return render(request, "dashboard.html", cache.get_or_set(f"dash:{request.user.id}", lambda: ctx, 120))`,
        why: 'Each `.filter(...).count()` is its own round trip to the database. A dashboard with 20 tiles is 20 queries, every time anyone opens it. `Count("id", filter=Q(...))` inside one `aggregate()` compiles to a single `SELECT` with `COUNT(CASE WHEN ... END)` columns — one round trip for the whole card. Cache the result on top (short TTL, keyed per-user if any tile is user-specific) so a page refresh does not re-run even that one query. This is the single highest-leverage fix for a slow internal dashboard.',
        whyHi: 'Har `.filter(...).count()` database ka apna round trip hai. 20 tiles waala ek dashboard 20 queries hai, har baar koi ise kholta hai. Ek `aggregate()` ke andar `Count("id", filter=Q(...))` ek single `SELECT` mein compile hota hai `COUNT(CASE WHEN ... END)` columns ke saath — poore card ke liye ek round trip. Upar se result cache karo. Ye ek dheeme internal dashboard ke liye sabse zyada leverage waala fix hai.',
      },
      {
        wrong: `series = (Signup.objects
          .annotate(d=TruncDate("created"))
          .values("d").annotate(n=Count("id")).order_by("d"))
# frontend charts this directly -> a day with zero signups is just MISSING from the array,
# so the line jumps from Monday straight to Wednesday as if Tuesday didn't exist`,
        right: `raw = {r["d"]: r["n"] for r in series}
spine = [start + timedelta(days=i) for i in range((end - start).days + 1)]
filled = [{"d": d.isoformat(), "n": raw.get(d, 0)} for d in spine]
# every day in the range is present, zero days show 0`,
        why: 'A `GROUP BY date` query returns one row per date *that had matching rows*. Dates with no activity simply do not appear. A chart drawn from that array either compresses the x-axis (dropping the gap) or interpolates across it — both misrepresent the data. The fix is to generate the complete date spine for the range in Python and left-join the query result onto it, so a zero-activity day is an explicit `0`. (Some databases can do this with a recursive CTE or a generate_series, but doing it in Python is portable and simple.)',
        whyHi: 'Ek `GROUP BY date` query prati us date ek row return karta hai *jismें matching rows thi*. Bina activity waali dates bस dikhती hi nahi. Us array se banaya ek chart ya to x-axis compress karta hai ya iske paar interpolate karta hai — dono data ko galat dikhaate hain. Fix range ke liye poora date spine Python mein generate karke query result ko uspe left-join karna hai, taaki ek zero-activity din ek explicit `0` ho.',
      },
      {
        wrong: `# "the team wants to explore signups by plan, by channel, by country, by month, interactively"
def flexible_dashboard(request):
    group_by = request.GET.getlist("group_by")     # arbitrary user-chosen dimensions
    metric = request.GET.get("metric")
    qs = Model.objects.values(*group_by).annotate(v=AGGREGATES[metric]("..."))
    # ... plus a filter builder, a pivot, CSV export, saved views ...
# you are now maintaining a BI product inside a Django view`,
        right: `# point Metabase / Superset / Looker at a read replica (Module 8 lesson 5).
# keep the Django dashboard to a FIXED set of operational numbers the team glances at.
DATABASE_ROUTERS = ["myapp.routers.PrimaryReplicaRouter"]
# analytics tool connects to the "replica" credentials directly, read-only`,
        why: 'The moment a dashboard needs user-chosen dimensions, a filter builder, pivots, saved views, and export, you are building business intelligence tooling — and that is a genuinely large, never-finished project. Mature BI tools (Metabase, Superset, Looker, Redash) already do all of it, and they connect straight to a database. Point one at a read replica and the analytics workload is completely isolated from your app, with zero code. Reserve the in-app dashboard for the handful of fixed numbers ops needs at a glance; send exploratory analytics to the tool built for it.',
        whyHi: 'Jis pal ek dashboard ko user-chosen dimensions, ek filter builder, pivots, saved views, aur export chahiye, aap business intelligence tooling bana rahe ho — aur wo ek sach mein bada, kabhi-na-khatam project hai. Paripakva BI tools (Metabase, Superset) pehle se ye sab karte hain, aur wo seedhe ek database se connect karte hain. Ek ko ek read replica par point karo aur analytics workload aapke app se poori tarah isolated hai, zero code ke saath.',
      },
    ],

    realWorld: [
      {
        en: '**A cached "ops home" dashboard on the admin index** — a custom `AdminSite.index()` adds `cache.get_or_set("ops:dash:v5", build, 300)` to the context: today\'s signups/orders/revenue via one `aggregate()` with `Count(filter=)`, a 30-day sparkline via `TruncDate` gap-filled, and top error rate from the last hour.',
        hi: '**Admin index par ek cached "ops home" dashboard** — ek custom `AdminSite.index()` context mein `cache.get_or_set("ops:dash:v5", build, 300)` add karta hai: ek `aggregate()` ke zariye aaj ke signups/orders/revenue, `TruncDate` gap-filled ke zariye ek 30-day sparkline.',
      },
      {
        en: '**A Celery Beat task that precomputes the dashboard every 5 minutes** into `cache.set("dash", ..., 600)` — the staff view just reads the cache and is always instant, and the heavy `GROUP BY` scans run on the schedule (off a replica) instead of on request.',
        hi: '**Ek Celery Beat task jo dashboard ko har 5 minute** `cache.set("dash", ..., 600)` mein precompute karta hai — staff view bस cache padhta hai aur hamesha instant hai, aur bhaari `GROUP BY` scans schedule par (ek replica se) chalte hain.',
      },
      {
        en: '**Metabase pointed at the read replica** for everything the ORM dashboard is not: cohort retention, funnel analysis, revenue breakdowns by any dimension, self-serve exploration for the product team — connected with a read-only DB user, zero Django code, and no load on the primary.',
        hi: '**Read replica par pointed Metabase** har us cheez ke liye jo ORM dashboard nahi hai: cohort retention, funnel analysis, kisi bhi dimension se revenue breakdowns — ek read-only DB user se connected, zero Django code.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you build a "tickets by status, plus a today vs yesterday summary, plus a 30-day trend" dashboard efficiently with the ORM?',
        qHi: 'Aap ORM ke saath ek "tickets by status, plus today vs yesterday summary, plus 30-day trend" dashboard efficiently kaise banate ho?',
        a: 'Three query shapes. Tickets by status is a group-by: values of status becomes GROUP BY status, and annotate with Count of id gives the count per group; add an explicit order_by so a model Meta ordering does not leak into the grouping. The summary card — counts of open, closed, urgent, overdue, plus revenue — should not be one filter-count query per number, because that is many round trips. Instead put them all in a single aggregate call using Count of id with a filter equal to a Q object per condition, and Sum with a filter for the money. That compiles to one SELECT with COUNT CASE WHEN columns. The 30-day trend is a time series: annotate a bucket with TruncDate of the created field, values of that bucket, annotate Count, order by the bucket. The catch is that the query only returns dates that had tickets, so a day with zero is missing entirely and a chart drawn from it is wrong. You fix that in Python: build the full list of dates in the window, turn the query result into a dict keyed by date, and produce a list where every date maps to its count or zero. Then wrap the whole builder in cache.get_or_set with a version in the key and a timeout of a few minutes, because these scans are not free and staff refresh the page. If the scans are heavy, move the build into a Celery Beat task that runs every few minutes and writes the cache, so the view only ever reads. And route the queryset to a read replica if you have one, so a slow GROUP BY does not compete with request traffic on the primary.',
        aHi: 'Teen query shapes. Tickets by status ek group-by hai: status ke values GROUP BY status ban jaata hai, aur Count of id se annotate prati group count deta hai; ek explicit order_by add karo. Summary card — open, closed, urgent, overdue ke counts, plus revenue — prati number ek filter-count query nahi honi chahiye. Badle unhe sab ek single aggregate call mein daalo Count of id ka istemal karke ek filter equal to prati condition ek Q object ke saath. Wo ek SELECT mein COUNT CASE WHEN columns ke saath compile hota hai. 30-day trend ek time series hai: created field ke TruncDate se ek bucket annotate karo, us bucket ke values, Count annotate karo, bucket se order karo. Catch ye hai ki query sirf un dates ko return karta hai jinme tickets the. Aap ise Python mein fix karte ho: window mein dates ki poori list banao, query result ko date se keyed ek dict mein badlo. Phir poore builder ko cache.get_or_set mein wrap karo key mein ek version aur kuch minute ke timeout ke saath.',
      },
      {
        q: 'When should a dashboard NOT be built in Django, and what do you use instead?',
        qHi: 'Ek dashboard Django mein KAB nahi banana chahiye, aur aap iske badle kya istemal karte ho?',
        a: 'The Django ORM dashboard is the right tool for a fixed, small set of operational numbers — signups today, orders by status, revenue this week, error rate — that the team glances at and that refresh every few minutes. It stops being the right tool the moment the requirements include any of: user-chosen grouping dimensions, an interactive filter builder, pivot tables, drill-down, saved views, ad-hoc exploration, CSV export of arbitrary slices, real-time streaming panels, or multi-month cohort and funnel analysis. Each of those is a feature of a business intelligence product, and building them inside a Django view means writing and maintaining a BI product as a side project — it is genuinely large and it never reaches done. The alternative is a purpose-built BI tool: Metabase, Superset, Redash, Looker. They already have the query builder, the charting, the pivots, the sharing, the scheduling, and the access control, and they connect directly to a SQL database. The clean architecture is to stand up a read replica, give the BI tool a read-only database user against that replica, and let the product and data teams self-serve there. The analytics workload is then completely isolated from the application — it cannot slow down requests, it needs no Django code, and heavy queries hit the replica, not the primary. You keep the in-app dashboard deliberately minimal: the handful of numbers ops needs without leaving the admin.',
        aHi: 'Django ORM dashboard operational numbers ke ek fixed, chhote set ke liye sahi tool hai — aaj ke signups, status se orders, is hafte revenue — jise team dekhta hai aur jo har kuch minute refresh hote hain. Ye sahi tool hona band kar deta hai jis pal requirements me se koi shamil hai: user-chosen grouping dimensions, ek interactive filter builder, pivot tables, drill-down, saved views, ad-hoc exploration, arbitrary slices ka CSV export, real-time streaming panels, ya multi-month cohort analysis. Unme se har ek ek business intelligence product ki feature hai. Vikalp ek purpose-built BI tool hai: Metabase, Superset, Redash, Looker. Unke paas pehle se query builder, charting, pivots, sharing, scheduling, aur access control hai, aur wo seedhe ek SQL database se connect karte hain. Saaf architecture ek read replica khada karna hai, BI tool ko us replica ke against ek read-only database user dena hai. Analytics workload phir application se poori tarah isolated hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django (SQLite). Model `Order(status, total)`, seed 6 rows: paid/100, paid/250, paid/90, refunded/100, pending/40, pending/60. (a) `Order.objects.values("status").annotate(n=Count("id"), rev=Sum("total")).order_by("status")` -> assert the paid group is `n=3, rev=440`. (b) Inside a `CaptureQueriesContext`, run one `Order.objects.aggregate(total=Count("id"), paid=Count("id", filter=Q(status="paid")), refunded=Count("id", filter=Q(status="refunded")), gross=Sum("total", filter=Q(status="paid")))` and assert the result is `{total:6, paid:3, refunded:1, gross:440}` and it took exactly **1** query.',
        taskHi: 'Standalone Django (SQLite). `Order(status, total)` model, 6 rows seed. (a) `.values("status").annotate(n=Count("id"), rev=Sum("total"))` -> paid group `n=3, rev=440`. (b) `CaptureQueriesContext` mein ek `Order.objects.aggregate(total=..., paid=Count("id", filter=Q(status="paid")), ...)` -> `{total:6, paid:3, refunded:1, gross:440}` aur theek **1** query.',
        hint: '`from django.db.models import Count, Sum, Q`. `Count("id", filter=Q(...))` inside one `aggregate()` becomes `COUNT(CASE WHEN ...)` — one `SELECT` for all four numbers, versus one query per `.filter().count()`.',
        hintHi: '`from django.db.models import Count, Sum, Q`. Ek `aggregate()` ke andar `Count("id", filter=Q(...))` `COUNT(CASE WHEN ...)` ban jaata hai — chaaron numbers ke liye ek `SELECT`.',
      },
      {
        task: 'Model `Signup(created DateTimeField)`. Seed signups on 2026-09-01 (x3), 09-02 (x1), 09-04 (x2), and NONE on 09-03. Run `Signup.objects.annotate(d=TruncDate("created")).values("d").annotate(n=Count("id")).order_by("d")` and build `raw = {r["d"]: r["n"] for r in qs}`. Assert `raw` has only 3 keys (09-03 missing). Then build the date spine `[date(2026,9,1) .. date(2026,9,4)]` and `series = [(d.isoformat(), raw.get(d, 0)) for d in spine]`. Assert `series` has 4 entries and the 09-03 entry is `("2026-09-03", 0)`.',
        taskHi: '`Signup(created)` model. 09-01 (x3), 09-02 (x1), 09-04 (x2) par signups seed karo, 09-03 par KOI NAHI. `annotate(d=TruncDate("created")).values("d").annotate(n=Count("id"))` chalao, `raw` dict banao. Assert `raw` mein sirf 3 keys. Phir date spine banao aur `series = [(d.isoformat(), raw.get(d, 0)) for d in spine]`. Assert 4 entries, 09-03 entry `("2026-09-03", 0)`.',
        hint: '`from django.db.models.functions import TruncDate`. `TruncDate` returns a `date`; the query GROUP BYs it and skips empty days. The gap-fill is pure Python: iterate every date in the range, `.get(d, 0)`.',
        hintHi: '`from django.db.models.functions import TruncDate`. `TruncDate` ek `date` return karta hai; query ise GROUP BY karta hai aur khali dinon ko skip karta hai. Gap-fill pure Python hai.',
      },
      {
        task: 'Standalone Django + `LocMemCache`. Model `Ticket(status)`, seed 3 open + 2 closed. `DASH_VERSION = 3`. `build_dashboard()` returns a dict with `by_status` (`.values("status").annotate(n=Count("id"))` as a list) and `counts` (`.aggregate(total=Count("id"), open=Count("id", filter=Q(status="open")))`). `dashboard_data()` = `cache.get_or_set(f"dash:v{DASH_VERSION}", build_dashboard, 300)`. Call `dashboard_data()` three times, each inside its own `CaptureQueriesContext`. Assert the first call ran 2 queries, calls 2 and 3 ran 0, and all three returned equal data with `counts["open"] == 3`.',
        taskHi: 'Standalone Django + `LocMemCache`. `Ticket(status)` model, 3 open + 2 closed seed. `build_dashboard()` ek dict return kare. `dashboard_data()` = `cache.get_or_set(f"dash:v{DASH_VERSION}", build_dashboard, 300)`. `dashboard_data()` teen baar call karo, har ek apne `CaptureQueriesContext` mein. Assert pehla call 2 queries, calls 2/3 0 queries, teenon equal data `counts["open"] == 3` ke saath.',
        hint: '`cache.get_or_set(key, callable, timeout)` runs `callable` only on a miss. The version in the key (`dash:v3`) is what you bump when the dashboard shape changes — old cached blobs are then simply never read.',
        hintHi: '`cache.get_or_set(key, callable, timeout)` `callable` ko sirf ek miss par chalata hai. Key mein version (`dash:v3`) wo hai jo aap dashboard shape badalne par bump karte ho.',
      },
    ],

    keyTakeaways: [
      'An internal dashboard is 3 query shapes (all Module 3): GROUP BY (`values("f").annotate(Count("id"))` — add explicit `.order_by()` so `Meta.ordering` doesn\'t leak in), conditional aggregates (`Count("id", filter=Q(...))` in ONE `aggregate()`), time series (`Trunc*` + group by the bucket).',
      '`Count("id", filter=Q(...))` inside one `aggregate()` compiles to `COUNT(CASE WHEN ...)` columns — ONE `SELECT` for a whole summary card. This is the #1 fix for a dashboard firing 20 separate `.filter().count()` queries.',
      'TIME SERIES GAP-FILLING: a `GROUP BY date` query only returns dates that HAD rows. A zero-activity day is missing -> the chart draws a wrong line. Fix in Python: generate the full date spine for the range, `raw.get(d, 0)` per day.',
      'Where it lives: a `@staff_member_required` view + template + chart lib (full control), OR override `AdminSite.index()` to inject metrics into `extra_context` (shows on the admin home, no extra auth).',
      'CACHE the whole `build_dashboard()` — `cache.get_or_set("dash:v{N}", build, 300)`, version in the key. 10 staff refreshing every minute = 10 heavy scans/min otherwise. For heavy ones: a Celery Beat task precomputes into the cache; the view only reads.',
      'Run heavy dashboard aggregates off a READ REPLICA (Module 8 lesson 5) — `.using("analytics")` — so a slow `GROUP BY` over millions of rows never competes with checkout traffic on the primary.',
      'The ORM dashboard is RIGHT for: a fixed small set of operational numbers, refreshed every few minutes, glanced at. WRONG for: user-chosen dimensions, filter builders, pivots, drill-down, saved views, real-time panels, cohort/funnel analysis.',
      'For anything exploratory: point a BI tool (Metabase / Superset / Redash / Looker) at a read replica with a read-only DB user. Zero Django code, fully isolated from the app. Building a query builder inside Django is a project that never ends.',
    ],
    keyTakeawaysHi: [
      'Ek internal dashboard 3 query shapes hai (sab Module 3): GROUP BY (`values("f").annotate(Count("id"))` — explicit `.order_by()` add karo), conditional aggregates (EK `aggregate()` mein `Count("id", filter=Q(...))`), time series (`Trunc*` + bucket se group by).',
      'Ek `aggregate()` ke andar `Count("id", filter=Q(...))` `COUNT(CASE WHEN ...)` columns mein compile hota hai — poore summary card ke liye EK `SELECT`. Ye 20 alag `.filter().count()` queries fire karte dashboard ke liye #1 fix hai.',
      'TIME SERIES GAP-FILLING: ek `GROUP BY date` query sirf un dates ko return karta hai jinME rows THI. Ek zero-activity din missing hai -> chart ek galat line kheenchta hai. Python mein fix: range ke liye poora date spine generate karo, prati din `raw.get(d, 0)`.',
      'Ye kahaan rehta hai: ek `@staff_member_required` view + template + chart lib (full control), YA `AdminSite.index()` override karke metrics ko `extra_context` mein inject karo (admin home par dikhta hai).',
      'Poore `build_dashboard()` ko CACHE karo — `cache.get_or_set("dash:v{N}", build, 300)`, key mein version. Bhaari ke liye: ek Celery Beat task cache mein precompute karta hai; view sirf padhta hai.',
      'Bhaari dashboard aggregates ek READ REPLICA se chalao (Module 8 lesson 5) — `.using("analytics")` — taaki millions of rows par ek dheema `GROUP BY` kabhi primary par checkout traffic se compete na kare.',
      'ORM dashboard iske liye SAHI hai: operational numbers ka ek fixed chhota set, har kuch minute refreshed, dekha gaya. GALAT: user-chosen dimensions, filter builders, pivots, drill-down, saved views, real-time panels, cohort/funnel analysis.',
      'Kisi bhi exploratory ke liye: ek BI tool (Metabase / Superset) ko ek read replica par ek read-only DB user ke saath point karo. Zero Django code. Django ke andar ek query builder banana ek project hai jo kabhi khatam nahi hota.',
    ],
  },

  {
    slug: 'dj-logging',
    title: 'Logging: `LOGGING`, Loggers, Handlers & Structured Logs',
    titleHi: 'Logging: `LOGGING`, Loggers, Handlers & Structured Logs',
    description: 'Django uses Python\'s `logging` module, configured through the `LOGGING` dict in settings. The three moving parts — loggers (where a message enters), handlers (where it goes), formatters (how it looks) — plus propagation and level filtering. Get this right and production problems are debuggable; get it wrong and you have either silence or noise.',
    descriptionHi: 'Django Python ke `logging` module ka istemal karta hai, settings mein `LOGGING` dict ke zariye configured. Teen moving parts — loggers (jahaan ek message enter hota hai), handlers (jahaan ye jaata hai), formatters (ye kaisa dikhta hai) — plus propagation aur level filtering. Ise sahi karo aur production problems debuggable hain; galat karo aur aapke paas ya to silence hai ya noise.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 5,

    analogy: {
      en: '**A building\'s intercom system.** A **logger** is a call button — there is one on every floor and in every room, named by location (`myapp`, `myapp.payments`, `myapp.payments.stripe`), and pressing a child button also rings the parent\'s bell unless you switch that off (**propagation**). A **handler** is where a call actually goes: the front desk speaker, a printout in the log room, a pager to security, an email to the manager — one logger can ring several. A **formatter** is the script the receptionist reads: just the message, or "3:04pm, floor 2, west stairwell, message" — plain text for a human, JSON for a machine. **Levels** are the urgency dial: set the front desk to only pick up "urgent and above" and the routine "someone opened a door" calls never reach it. The two ways to get it wrong: dial everything to "whisper" and miss the fire (too quiet), or wire every door sensor to the pager and nobody can hear the real alarm (too loud).',
      hi: '**Ek building ka intercom system.** Ek **logger** ek call button hai — har floor par aur har room mein ek hai, location se named (`myapp`, `myapp.payments`, `myapp.payments.stripe`), aur ek child button dabाना parent ki ghanti bhi bajाता hai jab tak aap use band na karo (**propagation**). Ek **handler** wo hai jahaan ek call asal mein jaati hai: front desk speaker, log room mein ek printout, security ko ek pager, manager ko ek email — ek logger kई baja sakta hai. Ek **formatter** wo script hai jo receptionist padhta hai: sirf message, ya "3:04pm, floor 2, west stairwell, message" — ek insaan ke liye plain text, ek machine ke liye JSON. **Levels** urgency dial hain: front desk ko sirf "urgent aur upar" pick karne ko set karo aur routine "kisi ne ek darwaza khola" calls kabhi ise nahi pahunchती. Galat karne ke do tareeke: sab kuch "whisper" par dial karo aur aag miss karo, ya har door sensor ko pager se wire karo aur koi asli alarm nahi sun sakta.',
    },

    simple: `**The \`LOGGING\` dict (settings.py)**

\`\`\`python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {"format": "{levelname} {asctime} {name} {module}:{lineno} {message}", "style": "{"},
        "json": {"()": "myapp.logging.JSONFormatter"},        # "()" = a custom callable
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "verbose"},
        "json_console": {"class": "logging.StreamHandler", "formatter": "json"},
    },
    "root": {"handlers": ["console"], "level": "WARNING"},     # the fallback for everything
    "loggers": {
        "django":         {"handlers": ["console"], "level": "INFO",  "propagate": False},
        "django.request": {"handlers": ["console"], "level": "ERROR", "propagate": False},
        "django.db.backends": {"level": "WARNING"},            # set to DEBUG to see every SQL query
        "myapp":          {"handlers": ["json_console"], "level": "INFO", "propagate": False},
    },
}
\`\`\`

**Using it**

\`\`\`python
import logging
logger = logging.getLogger(__name__)      # e.g. "myapp.payments" -> matches the "myapp" logger config

logger.debug("cache miss for key %s", key)                    # %s lazy-formatting, NOT an f-string
logger.info("order placed", extra={"order_id": o.id, "user_id": u.id})   # structured fields
logger.warning("retrying webhook", extra={"attempt": n})
logger.error("payment failed", exc_info=True)                 # attaches the traceback
logger.exception("unhandled in task")                         # = error(..., exc_info=True), inside except
\`\`\`

\`\`\`
LOGGER      you get one with logging.getLogger(__name__); named hierarchically by dots
HANDLER     StreamHandler (stdout), RotatingFileHandler, SysLogHandler, a Sentry handler, ...
FORMATTER   text for humans, JSON for log aggregators (structured logging)
LEVEL       DEBUG < INFO < WARNING < ERROR < CRITICAL; a record must pass the logger's level
            AND the handler's level to be emitted
PROPAGATION a record bubbles up to parent loggers' handlers; propagate=False stops it
            (set it on your app logger or every message logs twice -- once via your handler,
             once via root)
\`\`\`

**Key django loggers**

\`\`\`
django.request        4xx -> WARNING, 5xx -> ERROR (with the traceback). Wire this to Sentry.
django.server         the dev server's request log (runserver only)
django.db.backends    every SQL query at DEBUG -- turn on locally, NEVER in production
django.security.*     SuspiciousOperation, DisallowedHost, CSRF failures
\`\`\`

**Never log**

\`\`\`
passwords, tokens, API keys, session ids, full card numbers, OTPs, reset links,
raw request bodies of auth/payment endpoints, anything you'd redact in a screenshot
\`\`\``,

    simpleHi: `**\`LOGGING\` dict (settings.py)**

\`\`\`python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {"format": "{levelname} {asctime} {name} {module}:{lineno} {message}", "style": "{"},
        "json": {"()": "myapp.logging.JSONFormatter"},        # "()" = ek custom callable
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "verbose"},
        "json_console": {"class": "logging.StreamHandler", "formatter": "json"},
    },
    "root": {"handlers": ["console"], "level": "WARNING"},     # sab ke liye fallback
    "loggers": {
        "django":         {"handlers": ["console"], "level": "INFO",  "propagate": False},
        "django.request": {"handlers": ["console"], "level": "ERROR", "propagate": False},
        "django.db.backends": {"level": "WARNING"},            # har SQL query dekhne ko DEBUG set karo
        "myapp":          {"handlers": ["json_console"], "level": "INFO", "propagate": False},
    },
}
\`\`\`

**Ise istemal karna**

\`\`\`python
import logging
logger = logging.getLogger(__name__)      # jaise "myapp.payments" -> "myapp" logger config se match

logger.debug("cache miss for key %s", key)                    # %s lazy-formatting, ek f-string NAHI
logger.info("order placed", extra={"order_id": o.id, "user_id": u.id})   # structured fields
logger.warning("retrying webhook", extra={"attempt": n})
logger.error("payment failed", exc_info=True)                 # traceback attach karta hai
logger.exception("unhandled in task")                         # = error(..., exc_info=True), except ke andar
\`\`\`

\`\`\`
LOGGER      logging.getLogger(__name__) se ek milta hai; dots se hierarchically named
HANDLER     StreamHandler (stdout), RotatingFileHandler, SysLogHandler, ek Sentry handler, ...
FORMATTER   insaano ke liye text, log aggregators ke liye JSON (structured logging)
LEVEL       DEBUG < INFO < WARNING < ERROR < CRITICAL; ek record ko logger ka level
            AUR handler ka level pass karna chahiye emit hone ko
PROPAGATION ek record parent loggers ke handlers tak bubble hota hai; propagate=False ise rokta hai
            (ise apne app logger par set karo warna har message do baar log hota hai)
\`\`\`

**Mukhya django loggers**

\`\`\`
django.request        4xx -> WARNING, 5xx -> ERROR (traceback ke saath). Ise Sentry se wire karo.
django.server         dev server ka request log (sirf runserver)
django.db.backends    DEBUG par har SQL query -- locally on karo, production mein KABHI nahi
django.security.*     SuspiciousOperation, DisallowedHost, CSRF failures
\`\`\`

**Kabhi log mat karo**

\`\`\`
passwords, tokens, API keys, session ids, poore card numbers, OTPs, reset links,
auth/payment endpoints ke raw request bodies, kuch bhi jo aap ek screenshot mein redact karoge
\`\`\``,

    content: `## Loggers, handlers, formatters

Python \`logging\` — which Django configures via the \`LOGGING\` setting (a \`dictConfig\`) — has three objects:

- **Logger** — the object your code calls. \`logging.getLogger("myapp.payments")\`. Loggers are **hierarchical by dotted name**: \`myapp.payments.stripe\` is a child of \`myapp.payments\`, which is a child of \`myapp\`, which is a child of the **root** logger. You configure a few named loggers; everything else inherits.
- **Handler** — where a record is sent. \`StreamHandler\` (stdout/stderr), \`RotatingFileHandler\`, \`TimedRotatingFileHandler\`, \`SysLogHandler\`, \`SMTPHandler\`, a Sentry/Datadog handler. One logger can have several handlers.
- **Formatter** — how a record is rendered to text. A \`format\` string with \`%\`- or \`{\`-style placeholders, or a custom class via \`"()": "path.to.Formatter"\` for JSON.

## Levels

\`DEBUG (10) < INFO (20) < WARNING (30) < ERROR (40) < CRITICAL (50)\`.

A record is emitted only if it passes **two** gates: its level ≥ the **logger's** effective level, **and** its level ≥ the **handler's** level. A common mistake is setting the logger to \`DEBUG\` and wondering why nothing appears — the handler is still at \`WARNING\`. Both must be low enough.

A logger with no explicit level inherits its parent's (**effective level**). Setting \`django.db.backends\` to \`DEBUG\` makes Django log every SQL statement it runs — invaluable locally, catastrophic in production (volume, and queries may contain data).

## Propagation

When a logger handles a record, it also passes the record **up to its parent's handlers**, and so on to root — unless a logger sets \`"propagate": False\`.

This is why a fresh Django project that adds \`{"myapp": {"handlers": ["console"], "level": "INFO"}}\` **without \`propagate: False\`** logs every \`myapp\` message *twice*: once through the \`console\` handler you attached, once through root's handler as it propagates up. Set \`"propagate": False\` on the loggers where you attach handlers, and let the leaf loggers (\`myapp.payments\`, \`myapp.tasks\`) propagate up to \`myapp\`.

## Structured / JSON logging

In production, logs go to an aggregator (CloudWatch, Loki, ELK, Datadog). Plain-text lines are hard to query; **JSON lines are not**. A JSON formatter emits one object per record: \`{"ts": ..., "level": "ERROR", "logger": "myapp.payments", "msg": "charge failed", "order_id": 4012, "request_id": "abc-123"}\`. You attach the extra fields at the call site:

\`\`\`python
logger.info("charge failed", extra={"order_id": order.id, "amount": amount})
\`\`\`

\`extra\` keys become attributes on the \`LogRecord\`; your formatter reads them. (Avoid overwriting reserved names like \`message\`, \`levelname\`, \`args\`.)

## Message style

\`\`\`python
logger.info("user %s did %s", user_id, action)     # GOOD: args passed separately
logger.info(f"user {user_id} did {action}")        # BAD: string built even if INFO is disabled
\`\`\`

Passing the format string and args separately lets \`logging\` skip the string interpolation entirely when the record would be filtered out. With an f-string, the work is always done.

\`exc_info=True\` attaches the current exception's traceback. \`logger.exception("...")\` is exactly \`logger.error("...", exc_info=True)\` and is meant to be called **inside an \`except\` block**.

## A request-id middleware

To correlate all the log lines from one request, generate an id at the start of the request, stash it (a \`contextvars.ContextVar\`, or \`threading.local\`), and have the formatter (or a \`logging.Filter\`) inject it into every record:

\`\`\`python
import uuid, contextvars
request_id = contextvars.ContextVar("request_id", default="-")

class RequestIDMiddleware:
    def __init__(self, get_response): self.get_response = get_response
    def __call__(self, request):
        token = request_id.set(request.headers.get("X-Request-ID") or uuid.uuid4().hex)
        try:
            resp = self.get_response(request)
            resp["X-Request-ID"] = request_id.get()
            return resp
        finally:
            request_id.reset(token)

class RequestIDFilter(logging.Filter):
    def filter(self, record):
        record.request_id = request_id.get()
        return True
\`\`\`

Now every log line — from views, tasks triggered in-request, the ORM — carries the same \`request_id\`, and one grep pulls the whole story of a failing request.

## What never to log

Logs are widely readable (aggregators, screenshots, support tickets, backups) and long-lived. Never log: passwords, tokens, API keys, session identifiers, full card numbers / CVV, OTPs, password-reset links, the raw body of auth or payment requests, or personal data beyond what you actually need. Scrub at the boundary: a \`logging.Filter\` that redacts known-sensitive keys, and \`before_send\` in Sentry (lesson 6). "We'll be careful at call sites" is not a strategy.`,

    contentHi: `## Loggers, handlers, formatters

Python \`logging\` — jise Django \`LOGGING\` setting ke zariye configure karta hai — ke teen objects hain:

- **Logger** — wo object jise aapka code call karta hai. Loggers **dotted name se hierarchical** hain: \`myapp.payments.stripe\` \`myapp.payments\` ka child hai, jo \`myapp\` ka child hai, jo **root** logger ka child hai. Aap kuch named loggers configure karte ho; baaki sab inherit karta hai.
- **Handler** — jahaan ek record bheja jaata hai. \`StreamHandler\`, \`RotatingFileHandler\`, \`SysLogHandler\`, ek Sentry handler. Ek logger ke kई handlers ho sakte hain.
- **Formatter** — ek record kaise text mein render hota hai. Ek \`format\` string, ya JSON ke liye \`"()": "path.to.Formatter"\` ke zariye ek custom class.

## Levels

\`DEBUG < INFO < WARNING < ERROR < CRITICAL\`. Ek record tabhi emit hota hai jab ye **do** gates pass karta hai: iska level ≥ **logger** ka effective level, **aur** iska level ≥ **handler** ka level. Ek aam galti logger ko \`DEBUG\` set karna aur sochна ki kuch kyun nahi dikhta — handler abhi bhi \`WARNING\` par hai.

\`django.db.backends\` ko \`DEBUG\` set karna Django ko har SQL statement log karwaata hai — locally amoolya, production mein vinaashkaari.

## Propagation

Jab ek logger ek record handle karta hai, ye record ko **apne parent ke handlers tak** bhi pass karta hai — jab tak ek logger \`"propagate": False\` set na kare.

Isiliye ek fresh Django project jo \`{"myapp": {"handlers": ["console"], "level": "INFO"}}\` **\`propagate: False\` ke bina** add karta hai har \`myapp\` message ko *do baar* log karta hai. Jin loggers par aap handlers attach karte ho unpar \`"propagate": False\` set karo.

## Structured / JSON logging

Production mein, logs ek aggregator mein jaate hain. Plain-text lines query karna mushkil hai; **JSON lines nahi**. Ek JSON formatter prati record ek object emit karta hai. Aap extra fields ko call site par attach karte ho:

\`\`\`python
logger.info("charge failed", extra={"order_id": order.id, "amount": amount})
\`\`\`

\`extra\` keys \`LogRecord\` par attributes ban jaati hain; aapka formatter unhe padhta hai.

## Message style

\`\`\`python
logger.info("user %s did %s", user_id, action)     # GOOD: args alag pass kiye
logger.info(f"user {user_id} did {action}")        # BAD: string bana even if INFO disabled
\`\`\`

Format string aur args ko alag pass karna \`logging\` ko string interpolation poori tarah skip karne deta hai jab record filter ho jaata.

\`logger.exception("...")\` theek \`logger.error("...", exc_info=True)\` hai aur ise ek \`except\` block ke **andar** call karna hai.

## Ek request-id middleware

Ek request ki saari log lines ko correlate karne ke liye, request ki shuruat mein ek id generate karo, ise stash karo (ek \`contextvars.ContextVar\`), aur formatter (ya ek \`logging.Filter\`) ko ise har record mein inject karwao. Ab har log line — views, in-request triggered tasks, ORM se — wahi \`request_id\` carry karti hai, aur ek grep ek failing request ki poori kahani kheenchता hai.

## Kabhi log mat karo

Logs widely readable (aggregators, screenshots, support tickets, backups) aur long-lived hain. Kabhi log mat karo: passwords, tokens, API keys, session identifiers, poore card numbers / CVV, OTPs, password-reset links, auth ya payment requests ka raw body. Boundary par scrub karo: ek \`logging.Filter\` jo known-sensitive keys redact karta hai, aur Sentry mein \`before_send\` (lesson 6).`,

    examples: [
      {
        title: 'Levels: a record must pass BOTH the logger and the handler level',
        titleHi: 'Levels: ek record ko logger AUR handler dono level pass karne chahiye',
        code: `import logging

records = []
class ListHandler(logging.Handler):
    def emit(self, record):
        records.append((record.name, record.levelname, record.getMessage()))

root = logging.getLogger("demo")
root.handlers.clear()
root.setLevel(logging.INFO)                 # logger gate: INFO and above

h = ListHandler()
h.setLevel(logging.WARNING)                 # handler gate: WARNING and above
root.addHandler(h)
root.propagate = False

log = logging.getLogger("demo")
log.debug("debug msg")                      # blocked by the LOGGER (below INFO)
log.info("info msg")                        # passes logger, blocked by the HANDLER (below WARNING)
log.warning("warning msg")                  # passes both -> emitted
log.error("error msg")                      # passes both -> emitted

print("emitted:", records)

# lower the handler and info gets through
h.setLevel(logging.DEBUG)
log.info("info msg 2")
print("after lowering handler:", records[-1])`,
        output: `emitted: [('demo', 'WARNING', 'warning msg'), ('demo', 'ERROR', 'error msg')]
after lowering handler: ('demo', 'INFO', 'info msg 2')`,
        explain: 'A record is emitted only if it clears two independent gates: its level must be at least the logger\'s effective level, AND at least the handler\'s level. The logger is at INFO and the handler at WARNING. debug is blocked by the logger. info passes the logger but is blocked by the handler (INFO is below WARNING) -- this is the classic "I set the logger to DEBUG and still see nothing" trap. warning and error clear both. Lowering the handler to DEBUG lets the next info through.',
        explainHi: 'Ek record tabhi emit hota hai jab ye do swतंtra gates clear karta hai: iska level kam se kam logger ka effective level, AUR kam se kam handler ka level hona chahiye. Logger INFO par aur handler WARNING par hai. debug logger dwara blocked hai. info logger pass karta hai par handler dwara blocked hai (INFO WARNING se neeche hai) -- ye classic "maine logger DEBUG set kiya aur phir bhi kuch nahi dekhta" trap hai. warning aur error dono clear karte hain. Handler ko DEBUG par lower karna agle info ko guzarne deta hai.',
      },
      {
        title: 'Propagation: a child with no handlers uses the parent\'s; propagate=False stops the double-log',
        titleHi: 'Propagation: bina handlers ka ek child parent ka istemal karta hai; propagate=False double-log rokta hai',
        code: `import logging

hits = {"parent": [], "root_ish": []}

class Tag(logging.Handler):
    def __init__(self, bucket):
        super().__init__()
        self.bucket = bucket
    def emit(self, record):
        hits[self.bucket].append(record.getMessage())

# a two-level hierarchy: "app" (has a handler) and "app.sub" (no handler)
app = logging.getLogger("app")
app.handlers.clear(); app.setLevel(logging.INFO)
app.addHandler(Tag("parent"))
app.propagate = False                       # don't bubble to the real root

sub = logging.getLogger("app.sub")
sub.handlers.clear()
print("app.sub handlers:", sub.handlers, "| propagate:", sub.propagate)

sub.info("from the child")                  # no handler here -> propagates to "app"'s handler
app.info("from the parent")

print("parent handler saw:", hits["parent"])

# now give the child its OWN handler but leave propagate=True (the default) -> DOUBLE
sub.addHandler(Tag("parent"))               # same bucket for visibility
hits["parent"].clear()
sub.info("double logged?")
print("with child handler + propagate=True:", hits["parent"], "(logged twice)")

sub.propagate = False
hits["parent"].clear()
sub.info("once now")
print("with propagate=False:", hits["parent"])`,
        output: `app.sub handlers: [] | propagate: True
parent handler saw: ['from the child', 'from the parent']
with child handler + propagate=True: ['double logged?', 'double logged?'] (logged twice)
with propagate=False: ['once now']`,
        explain: 'A logger with no handlers of its own still "handles" a record by passing it up to its parent\'s handlers -- that is why app.sub with an empty .handlers list still reaches app\'s handler for both the child\'s own message and the parent\'s. The double-log happens when app.sub gets its own handler while propagate stays True (the default): the record is emitted once by the child\'s handler and once more when it propagates to the parent, so "double logged?" appears twice. Setting app.sub.propagate = False stops the bubble, and the record is emitted exactly once.',
        explainHi: 'Bina apne handlers ke ek logger abhi bhi ek record ko apne parent ke handlers tak pass karke "handle" karta hai -- isiliye khali .handlers list waala app.sub abhi bhi app ke handler tak pahunchta hai child ke apne message aur parent ke message dono ke liye. Double-log tab hota hai jab app.sub ko apna handler milta hai jabki propagate True (default) rehta hai: record ek baar child ke handler se aur ek baar jab ye parent tak propagate hota hai emit hota hai. app.sub.propagate = False set karna bubble rokta hai, aur record theek ek baar emit hota hai.',
      },
      {
        title: 'dictConfig + a JSON formatter + extra fields + a request-id filter',
        titleHi: 'dictConfig + ek JSON formatter + extra fields + ek request-id filter',
        code: `import logging, logging.config, json, contextvars

request_id = contextvars.ContextVar("request_id", default="-")

class RequestIDFilter(logging.Filter):
    def filter(self, record):
        record.request_id = request_id.get()
        return True

class JSONFormatter(logging.Formatter):
    def format(self, record):
        base = {"level": record.levelname, "logger": record.name,
                "msg": record.getMessage(), "request_id": getattr(record, "request_id", "-")}
        for k, v in record.__dict__.items():
            if k in ("order_id", "user_id", "attempt"):
                base[k] = v
        if record.exc_info:
            base["exc"] = record.exc_info[0].__name__
        return json.dumps(base)

CAPTURED = []
class ListHandler(logging.Handler):
    def emit(self, record):
        CAPTURED.append(self.format(record))

logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": True,
    "filters": {"reqid": {"()": RequestIDFilter}},
    "formatters": {"json": {"()": JSONFormatter}},
    "handlers": {"cap": {"class": ListHandler, "formatter": "json", "filters": ["reqid"]}},
    "loggers": {"myapp": {"handlers": ["cap"], "level": "INFO", "propagate": False}},
})

log = logging.getLogger("myapp.payments")

request_id.set("req-abc123")
log.info("charge started", extra={"order_id": 4012, "user_id": 77})
try:
    raise ValueError("gateway declined")
except ValueError:
    log.error("charge failed", extra={"order_id": 4012, "attempt": 2}, exc_info=True)

for line in CAPTURED:
    print(line)`,
        output: `{"level": "INFO", "logger": "myapp.payments", "msg": "charge started", "request_id": "req-abc123", "order_id": 4012, "user_id": 77}
{"level": "ERROR", "logger": "myapp.payments", "msg": "charge failed", "request_id": "req-abc123", "order_id": 4012, "attempt": 2, "exc": "ValueError"}`,
        explain: 'dictConfig wires a RequestIDFilter (reads a contextvars ContextVar and sets record.request_id), a JSONFormatter (emits one JSON object per record with the level, logger, message, request_id, any of the known extra fields, and an exc type if there was one), and a capturing handler. Because the filter is on the handler, every record picks up the current request id -- req-abc123 here -- so both the info and the error line carry it, and one grep on that id would pull the whole story of the request. extra= keys land in record.__dict__ and the formatter reads them; exc_info=True attaches the exception so exc becomes "ValueError".',
        explainHi: 'dictConfig ek RequestIDFilter (ek contextvars ContextVar padhta hai aur record.request_id set karta hai), ek JSONFormatter (prati record ek JSON object emit karta hai level, logger, message, request_id, known extra fields, aur ek exc type ke saath), aur ek capturing handler wire karta hai. Kyunki filter handler par hai, har record current request id uthata hai -- yahaan req-abc123 -- toh info aur error line dono ise carry karte hain, aur us id par ek grep poori request ki kahani kheench leta. extra= keys record.__dict__ mein aati hain; exc_info=True exception attach karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `LOGGING = {
    "version": 1,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "WARNING"},
    "loggers": {
        "myapp": {"handlers": ["console"], "level": "INFO"},   # no propagate: False
    },
}
# every myapp.* log line appears TWICE in the console`,
        right: `    "loggers": {
        "myapp": {"handlers": ["console"], "level": "INFO", "propagate": False},
    },`,
        why: 'When a logger has its own handler and `propagate` is left at its default of `True`, each record is emitted by that handler *and then passed up* to every ancestor logger\'s handlers, ending at root. Since root also has the `console` handler, every `myapp` message prints once via the `myapp` logger and once via root — duplicate lines, doubled log volume, confusing greps. Set `"propagate": False` on any logger where you attach handlers. Leaf loggers like `myapp.payments` (no handlers of their own) should keep `propagate: True` so they reach `myapp`\'s handler.',
        whyHi: 'Jab ek logger ka apna handler hai aur `propagate` apne default `True` par chhoda gaya hai, har record us handler dwara emit hota hai *aur phir upar pass hota hai* har ancestor logger ke handlers tak, root par khatam. Kyunki root ke paas bhi `console` handler hai, har `myapp` message ek baar `myapp` logger ke zariye aur ek baar root ke zariye print hota hai. Jin loggers par aap handlers attach karte ho unpar `"propagate": False` set karo.',
      },
      {
        wrong: `logger.info(f"processing order {order.id} for {order.customer.email} "
            f"with items {[i.sku for i in order.items.all()]}")
# an f-string: the whole message (and the .items.all() query!) is built even if INFO is off`,
        right: `logger.info("processing order %s for user %s (%d items)",
            order.id, order.customer_id, order.items.count())
# args passed separately -> logging skips formatting entirely when the record is filtered out`,
        why: 'An f-string is evaluated *before* `logger.info` is even called, so all the string building — and here a database query to fetch `order.items` — happens regardless of whether the `INFO` level is enabled. Passing the `%s` format string and the arguments separately lets the `logging` module check the level first and only interpolate if the record will actually be emitted. It also keeps structured data as real values (an aggregator can index `order_id=4012`) instead of baking it into a string. Never build log messages with f-strings.',
        whyHi: 'Ek f-string `logger.info` ke call hone se *pehle* evaluate hota hai, toh saara string building — aur yahaan `order.items` fetch karne ko ek database query — hota hai chahe `INFO` level enabled ho ya na ho. `%s` format string aur arguments ko alag pass karna `logging` module ko pehle level check karne deta hai aur sirf interpolate karne deta hai agar record asal mein emit hoga. Log messages ko kabhi f-strings se mat banao.',
      },
      {
        wrong: `logger.info("login attempt", extra={
    "email": email, "password": password,          # <-- the password, in the logs, forever
    "body": request.body.decode(),                 # <-- the raw POST body of a login
})`,
        right: `logger.info("login attempt", extra={"email": email, "ok": success})
# add a redacting filter for defence in depth:
class RedactFilter(logging.Filter):
    SENSITIVE = {"password", "token", "authorization", "secret", "card_number", "cvv"}
    def filter(self, record):
        for k in list(vars(record)):
            if k.lower() in self.SENSITIVE:
                setattr(record, k, "[REDACTED]")
        return True`,
        why: 'Logs are read by many people (on-call engineers, support, anyone with aggregator access), copied into tickets and chat, and retained for months in backups. A password, token, or raw auth-request body written to a log is a credential leak that persists long after the request. Never pass secrets to the logger — not in the message, not in `extra`. And because "be careful at the call site" fails eventually, add a `logging.Filter` that redacts known-sensitive keys on every record as a backstop, and scrub again in Sentry\'s `before_send`.',
        whyHi: 'Logs kई logon dwara padhe jaate hain (on-call engineers, support, aggregator access waala koi bhi), tickets aur chat mein copy hote hain, aur backups mein mahinon retain hote hain. Ek password, token, ya raw auth-request body jo ek log mein likha gaya ek credential leak hai jo request ke baad tak persist karta hai. Kabhi secrets logger ko mat pass karo. Aur kyunki "call site par careful raho" ant mein fail hota hai, ek `logging.Filter` add karo jo har record par known-sensitive keys redact karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**JSON to stdout, aggregator-native** — a single `JSONFormatter` on one `StreamHandler`, `myapp` at `INFO` with `propagate: False`, `django.request` and `django.security` at `WARNING`+ wired to the same handler (and to Sentry), `django.db.backends` at `WARNING`. The container platform ships stdout to Loki/CloudWatch; no file handlers.',
        hi: '**stdout ko JSON, aggregator-native** — ek `StreamHandler` par ek single `JSONFormatter`, `myapp` `INFO` par `propagate: False` ke saath, `django.request` aur `django.security` `WARNING`+ par usi handler se wired, `django.db.backends` `WARNING` par. Container platform stdout ko Loki/CloudWatch bhejta hai; koi file handlers nahi.',
      },
      {
        en: '**A request-id (and user-id) filter threaded through everything** — `RequestIDMiddleware` sets a `ContextVar`, a `logging.Filter` injects `request_id` + `user_id` into every record, and the response carries `X-Request-ID` back — so a customer support ticket with that header lets you pull every log line for the exact failing request.',
        hi: '**Sab kuch mein threaded ek request-id (aur user-id) filter** — `RequestIDMiddleware` ek `ContextVar` set karta hai, ek `logging.Filter` har record mein `request_id` + `user_id` inject karta hai, aur response `X-Request-ID` wapas carry karta hai.',
      },
      {
        en: '**A `RedactFilter` on every handler plus `LOGGING` reviewed in code review** — the filter redacts a fixed set of sensitive keys, and any new `logger.*` call touching auth/payment code gets a second look. `django.db.backends=DEBUG` is a local-settings-only override, never in the base or prod settings.',
        hi: '**Har handler par ek `RedactFilter` plus code review mein reviewed `LOGGING`** — filter sensitive keys ka ek fixed set redact karta hai, aur auth/payment code ko chhoone waala koi bhi naya `logger.*` call ek doosri nazar paata hai. `django.db.backends=DEBUG` ek local-settings-only override hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain loggers, handlers, formatters, levels, and propagation, and the classic "everything logs twice" bug.',
        qHi: 'Loggers, handlers, formatters, levels, aur propagation samjhाओ, aur classic "sab kuch do baar log hota hai" bug.',
        a: 'A logger is the object your code calls, obtained with logging dot getLogger and a name. Names are hierarchical by dots, so myapp dot payments is a child of myapp, which is a child of the root logger. A handler is a destination — a stream to stdout, a rotating file, syslog, an email, a Sentry sink. A formatter turns a log record into text, either a percent- or brace-style template or a custom class for JSON. Levels are DEBUG, INFO, WARNING, ERROR, CRITICAL in increasing order, and a record is only emitted if it clears two gates: it must be at least the logger\'s effective level and at least the handler\'s level. Forgetting the second gate is why people set a logger to DEBUG and still see nothing — the handler is still at WARNING. Propagation is the part that surprises people. When a logger handles a record it also passes that record up to its parent logger\'s handlers, and up again, all the way to root, unless a logger sets propagate to False. The classic bug: you add a logger for your app with its own console handler, and you leave propagate at its default of True. Root also has a console handler. So every message from your app is emitted once by your logger\'s handler and once more when it propagates to root\'s handler — every line appears twice, and log volume doubles. The fix is to set propagate to False on any logger where you attach handlers. Leaf loggers that have no handlers of their own should keep propagate True so their records reach an ancestor that does.',
        aHi: 'Ek logger wo object hai jise aapka code call karta hai, logging dot getLogger aur ek name se obtained. Names dots se hierarchical hain, toh myapp dot payments myapp ka child hai. Ek handler ek destination hai — stdout ko ek stream, ek rotating file, syslog, ek email, ek Sentry sink. Ek formatter ek log record ko text mein badalta hai. Levels DEBUG, INFO, WARNING, ERROR, CRITICAL hain, aur ek record tabhi emit hota hai jab ye do gates clear karta hai: ye kam se kam logger ka effective level aur kam se kam handler ka level hona chahiye. Doosra gate bhoolना wo hai jisse log logger ko DEBUG set karte hain aur phir bhi kuch nahi dekhte — handler abhi bhi WARNING par hai. Propagation wo hissa hai jo logon ko surprise karta hai. Jab ek logger ek record handle karta hai ye us record ko apne parent logger ke handlers tak bhi pass karta hai, root tak, jab tak ek logger propagate ko False set na kare. Classic bug: aap apne app ke liye ek logger add karte ho apne console handler ke saath, aur propagate ko default True par chhodte ho. Root ke paas bhi ek console handler hai. Toh har message do baar emit hota hai. Fix jin loggers par aap handlers attach karte ho unpar propagate ko False set karna hai.',
      },
      {
        q: 'Why use `logger.info("x %s", y)` instead of `logger.info(f"x {y}")`, and how do you get structured logs and a request id into every line?',
        qHi: '`logger.info(f"x {y}")` ke badle `logger.info("x %s", y)` kyun, aur aap structured logs aur ek request id har line mein kaise laate ho?',
        a: 'The percent form passes the template and the arguments separately, so the logging module can check whether the record will actually be emitted before doing any string work. If INFO is disabled, or the record is filtered out, the interpolation never happens. With an f-string, the whole message is built before logger dot info is even called, so you pay that cost unconditionally — and if the f-string dereferences a relationship or calls a queryset method, you have just run a database query to build a log line that gets thrown away. So percent-style is both faster on the disabled path and keeps the values as values. For structured logs you pass extra as a dict at the call site: logger dot info of the message, extra equals a dict of order_id, user_id, whatever. Those keys become attributes on the LogRecord, and a JSON formatter reads them and emits one JSON object per line with the message plus those fields, which an aggregator can index and filter on. For the request id you generate one at the start of each request in a middleware — from an incoming X-Request-ID header or a fresh uuid — and store it in a contextvars ContextVar so it is available anywhere in that request, including background code called synchronously. Then a logging Filter reads the ContextVar and sets record dot request_id on every record, and the formatter includes it. Now every log line from views, the ORM, and in-request task calls carries the same request id, and you echo it back in the response header, so a support ticket that includes the header lets you retrieve the complete log trail for that one request.',
        aHi: 'Percent form template aur arguments ko alag pass karta hai, toh logging module check kar sakta hai ki record asal mein emit hoga ya nahi koi string work karne se pehle. Agar INFO disabled hai, interpolation kabhi nahi hota. Ek f-string ke saath, poora message logger dot info ke call hone se pehle bana hai, toh aap wo cost unconditionally dete ho — aur agar f-string ek relationship dereference karta hai, aapne abhi ek database query chalayi ek log line banane ko jo phenk di jaati hai. Structured logs ke liye aap call site par extra ek dict ke roop mein pass karte ho: logger dot info of message, extra equals ek dict of order_id, user_id. Wo keys LogRecord par attributes ban jaati hain, aur ek JSON formatter unhe padhta hai aur prati line ek JSON object emit karta hai. Request id ke liye aap har request ki shuruat mein ek middleware mein ek generate karte ho aur ise ek contextvars ContextVar mein store karte ho. Phir ek logging Filter ContextVar padhta hai aur har record par record dot request_id set karta hai. Ab har log line wahi request id carry karti hai.',
      },
    ],

    exercises: [
      {
        task: 'Pure Python `logging` (no Django). A `ListHandler(logging.Handler)` that appends `(name, levelname, message)` to a module list. Get logger `"demo"`, `clear()` its handlers, `setLevel(logging.INFO)`, add the handler with `handler.setLevel(logging.WARNING)`, set `propagate = False`. Log `debug`, `info`, `warning`, `error`. Assert only the `warning` and `error` records were captured (debug blocked by the logger, info blocked by the handler). Then `handler.setLevel(logging.DEBUG)`, log another `info`, and assert it now appears.',
        taskHi: 'Pure Python `logging`. Ek `ListHandler` jo `(name, levelname, message)` ek list mein append kare. Logger `"demo"`, handlers `clear()`, `setLevel(INFO)`, handler `setLevel(WARNING)` ke saath add karo, `propagate = False`. `debug`/`info`/`warning`/`error` log karo. Assert sirf `warning`+`error` capture hue. Phir `handler.setLevel(DEBUG)`, ek aur `info`, assert ab dikhta hai.',
        hint: 'Two independent gates: `record.levelno >= logger.getEffectiveLevel()` AND `record.levelno >= handler.level`. `info` (20) passes the INFO logger but fails the WARNING (30) handler.',
        hintHi: 'Do swतंtra gates: `record.levelno >= logger.getEffectiveLevel()` AUR `record.levelno >= handler.level`. `info` (20) INFO logger pass karta hai par WARNING (30) handler fail karta hai.',
      },
      {
        task: 'Pure Python `logging`. Build a two-level hierarchy: logger `"app"` with a tagging handler and `propagate = False`; logger `"app.sub"` with NO handler. Assert `app.sub`\'s `.handlers` is empty and `.propagate` is `True` (default). Log via `app.sub` and via `app`; assert the parent handler saw BOTH messages (the child propagated up). Then add a handler to `app.sub` while leaving `propagate = True`, log once, and assert it was recorded TWICE. Set `app.sub.propagate = False`, log again, assert exactly ONE new record.',
        taskHi: 'Pure Python `logging`. Do-level hierarchy: `"app"` ek tagging handler + `propagate = False` ke saath; `"app.sub"` bina handler ke. Assert `app.sub.handlers` khali, `.propagate` `True`. `app.sub` aur `app` se log karo; assert parent handler ne DONO dekhe. Phir `app.sub` ko ek handler do `propagate = True` chhodkar, ek baar log, assert DO baar recorded. `app.sub.propagate = False`, phir log, assert theek EK naya record.',
        hint: 'A logger with no handlers still "handles" a record by propagating it to ancestors. Once it has its own handler AND `propagate=True`, the record is emitted by both the child\'s handler and (via propagation) the parent\'s.',
        hintHi: 'Bina handlers ka ek logger abhi bhi ek record ko ancestors tak propagate karke "handle" karta hai. Ek baar iska apna handler AUR `propagate=True` hai, record dono se emit hota hai.',
      },
      {
        task: 'Pure Python `logging.config.dictConfig`. Define (as class objects, not dotted strings): `RequestIDFilter` (sets `record.request_id` from a module `contextvars.ContextVar`), `JSONFormatter` (emits `{"level", "logger", "msg", "request_id"}` plus any of `order_id`/`user_id`/`attempt` present on the record, plus `"exc": <ExcType name>` if `record.exc_info`), and a `ListHandler` that appends `self.format(record)`. Wire them: `filters: {reqid: {"()": RequestIDFilter}}`, `formatters: {json: {"()": JSONFormatter}}`, `handlers: {cap: {class: ListHandler, formatter: "json", filters: ["reqid"]}}`, `loggers: {myapp: {handlers: ["cap"], level: "INFO", propagate: False}}`. Set the ContextVar to `"req-abc123"`, `log.info("charge started", extra={"order_id": 4012, "user_id": 77})`, then in an `except ValueError` do `log.error("charge failed", extra={"order_id": 4012, "attempt": 2}, exc_info=True)`. Assert both captured lines are valid JSON, both carry `request_id == "req-abc123"`, and the second has `"exc": "ValueError"`.',
        taskHi: 'Pure Python `logging.config.dictConfig`. Class objects ke roop mein define karo: `RequestIDFilter`, `JSONFormatter`, `ListHandler`. Unhe wire karo. ContextVar `"req-abc123"` set karo, `log.info(..., extra={"order_id": 4012, "user_id": 77})`, phir `except ValueError` mein `log.error(..., extra={"order_id": 4012, "attempt": 2}, exc_info=True)`. Assert dono lines valid JSON, dono `request_id == "req-abc123"`, doosre mein `"exc": "ValueError"`.',
        hint: 'In `dictConfig`, `"()": SomeClass` (a class object) is the modern way to reference a custom filter/formatter — a `"module.Class"` string fails to resolve when the module is `__main__`. `extra=` keys land in `record.__dict__`.',
        hintHi: '`dictConfig` mein, `"()": SomeClass` (ek class object) ek custom filter/formatter reference karne ka modern tarika hai — ek `"module.Class"` string `__main__` module ke saath resolve nahi hoti. `extra=` keys `record.__dict__` mein aati hain.',
      },
    ],

    keyTakeaways: [
      'Django configures Python `logging` via the `LOGGING` dict (`dictConfig`). Three parts: LOGGER (where a message enters — `logging.getLogger(__name__)`, hierarchical by dots), HANDLER (where it goes — `StreamHandler`, file, syslog, Sentry), FORMATTER (how it looks — text for humans, JSON for aggregators).',
      'A record is emitted only if it passes BOTH gates: `level >= logger`\'s effective level AND `level >= handler`\'s level. Setting the logger to `DEBUG` but leaving the handler at `WARNING` = nothing appears.',
      'PROPAGATION: a handled record bubbles up to every ancestor logger\'s handlers (ending at root). Attach a handler to `myapp` WITHOUT `"propagate": False` and every line logs TWICE (once via your handler, once via root). Set `propagate: False` on loggers where you attach handlers.',
      'Message style: `logger.info("x %s", y)` NOT `logger.info(f"x {y}")` — the f-string (and any query inside it) is always built; the `%s` form skips interpolation when the record is filtered out AND keeps values as values for the aggregator.',
      '`logger.exception("msg")` == `logger.error("msg", exc_info=True)` — call it INSIDE an `except` block; it attaches the traceback.',
      'Key django loggers: `django.request` (4xx=WARNING, 5xx=ERROR+traceback — wire to Sentry), `django.security.*` (SuspiciousOperation, DisallowedHost, CSRF), `django.db.backends` (every SQL at DEBUG — local ONLY, never prod).',
      'STRUCTURED LOGGING: `logger.info("msg", extra={"order_id": ..., "user_id": ...})` — `extra` keys become `LogRecord` attributes; a JSON formatter emits one queryable object per line. REQUEST ID: middleware sets a `contextvars.ContextVar`, a `logging.Filter` injects it into every record -> one grep = the whole failing request.',
      'NEVER LOG: passwords, tokens, API keys, session ids, full card numbers/CVV, OTPs, reset links, raw auth/payment request bodies. Add a `logging.Filter` that redacts known-sensitive keys as a backstop + scrub in Sentry `before_send` (lesson 6). "Be careful at call sites" is not a strategy.',
    ],
    keyTakeawaysHi: [
      'Django Python `logging` ko `LOGGING` dict (`dictConfig`) ke zariye configure karta hai. Teen parts: LOGGER (`logging.getLogger(__name__)`, dots se hierarchical), HANDLER (`StreamHandler`, file, syslog, Sentry), FORMATTER (insaano ke liye text, aggregators ke liye JSON).',
      'Ek record tabhi emit hota hai jab ye DONO gates pass karta hai: `level >= logger` ka effective level AUR `level >= handler` ka level. Logger `DEBUG` par par handler `WARNING` par = kuch nahi dikhta.',
      'PROPAGATION: ek handled record har ancestor logger ke handlers tak bubble hota hai (root par khatam). `myapp` ko ek handler `"propagate": False` KE BINA attach karo aur har line DO baar log hoti hai. Jin loggers par aap handlers attach karte ho unpar `propagate: False` set karo.',
      'Message style: `logger.info("x %s", y)` NAHI `logger.info(f"x {y}")` — f-string hamesha bana hai; `%s` form interpolation skip karta hai jab record filter hota hai.',
      '`logger.exception("msg")` == `logger.error("msg", exc_info=True)` — ise ek `except` block ke ANDAR call karo; ye traceback attach karta hai.',
      'Mukhya django loggers: `django.request` (4xx=WARNING, 5xx=ERROR+traceback — Sentry se wire karo), `django.security.*`, `django.db.backends` (DEBUG par har SQL — sirf local, kabhi prod nahi).',
      'STRUCTURED LOGGING: `logger.info("msg", extra={"order_id": ...})` — `extra` keys `LogRecord` attributes ban jaati hain; ek JSON formatter prati line ek queryable object emit karta hai. REQUEST ID: middleware ek `contextvars.ContextVar` set karta hai, ek `logging.Filter` ise har record mein inject karta hai.',
      'KABHI LOG MAT KARO: passwords, tokens, API keys, session ids, poore card numbers/CVV, OTPs, reset links, raw auth/payment request bodies. Ek `logging.Filter` add karo jo known-sensitive keys redact kare + Sentry `before_send` mein scrub karo (lesson 6).',
    ],
  },

  {
    slug: 'dj-observability-sentry-health-metrics',
    title: 'Sentry, Health Checks & Prometheus Metrics',
    titleHi: 'Sentry, Health Checks & Prometheus Metrics',
    description: 'Three complementary things. **Sentry** catches unhandled exceptions with full context so you fix bugs you would never have seen. **Health checks** let your orchestrator know if an instance is alive and ready. **Metrics** give you the aggregate view — request rate, error rate, latency — that logs and error tracking do not.',
    descriptionHi: 'Teen poorak cheezein. **Sentry** unhandled exceptions ko poore context ke saath pakadta hai taaki aap wo bugs fix karो jo aapne kabhi dekhe nahi hote. **Health checks** aapke orchestrator ko bataते hain ki ek instance zinda aur ready hai ya nahi. **Metrics** aapko aggregate view deती hain — request rate, error rate, latency — jo logs aur error tracking nahi dete.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 6,

    analogy: {
      en: '**A hospital ward has three monitoring systems, and you need all three.** Sentry is the incident report a nurse files when something goes wrong with a specific patient: what happened, the full chart, the meds, the timeline, what they were doing — detailed, per-event, actionable. Health checks are the "is this bed occupied by a living, stable patient?" clipboard at the door: a quick yes/no the ward manager (your orchestrator) uses to decide whether to send new patients to this bed or wheel it out for repair — liveness ("breathing?") and readiness ("stable enough to take a patient?") are two different questions. Metrics are the ward\'s vital-signs board: aggregate heart rate, occupancy, average wait time, trends over the shift — no single patient\'s story, but the only way to see "admissions are spiking" or "wait times crept up after 2pm" before it becomes an incident. An incident report cannot tell you the ward is filling up; the vitals board cannot tell you why patient 7 crashed. You run all three.',
      hi: '**Ek hospital ward ke teen monitoring systems hain, aur aapko teenon chahiye.** Sentry wo incident report hai jo ek nurse file karti hai jab ek vishisht patient ke saath kuch galat hota hai: kya hua, poora chart, meds, timeline — detailed, per-event, actionable. Health checks darvaze par "kya ye bed ek zinda, stable patient se occupied hai?" clipboard hain: ek quick yes/no jise ward manager (aapka orchestrator) naye patients ko is bed par bhejne ya ise repair ke liye nikaalne ka faisla karne ko istemal karta hai — liveness ("saans le raha hai?") aur readiness ("ek patient lene ke liye stable?") do alag sawaal hain. Metrics ward ka vital-signs board hain: aggregate heart rate, occupancy, average wait time, shift par trends — kisi ek patient ki kahani nahi, par "admissions spike kar rahe hain" ise ek incident banne se pehle dekhne ka ekmatra tarika. Aap teenon chalाते ho.',
    },

    simple: `**Sentry**

\`\`\`python
# settings.py
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn=env("SENTRY_DSN"),
    integrations=[DjangoIntegration()],
    environment=env("ENVIRONMENT", "production"),
    release=env("GIT_SHA"),                 # tie errors to a deploy -> "regression in v1.4.2"
    traces_sample_rate=0.05,               # 5% of requests get performance tracing
    send_default_pii=False,                # do NOT attach user email / IP / cookies by default
    before_send=scrub,                     # last chance to redact before it leaves your server
)

def scrub(event, hint):
    event.get("request", {}).pop("cookies", None)
    if "Authorization" in event.get("request", {}).get("headers", {}):
        event["request"]["headers"]["Authorization"] = "[redacted]"
    return event                           # return None to DROP the event entirely
\`\`\`

\`\`\`
unhandled exception in a view / task -> Sentry event with the traceback, request, release,
                                        environment, and breadcrumbs (recent log lines / queries)
sentry_sdk.capture_exception(exc)     -- report a caught exception you still want to know about
sentry_sdk.capture_message("...", level="warning")
sentry_sdk.set_user({"id": ...})      -- but mind PII; send_default_pii=False is the safe default
sentry_sdk.set_tag / set_context      -- extra searchable dimensions
\`\`\`

**Health checks — liveness vs readiness**

\`\`\`python
def livez(request):                        # "is the process alive?" -- NO dependency checks
    return JsonResponse({"status": "ok"})

def readyz(request):                        # "can it serve traffic?" -- check dependencies
    checks = {}
    try:
        connections["default"].cursor().execute("SELECT 1"); checks["db"] = True
    except Exception:
        checks["db"] = False
    checks["cache"] = cache.get_or_set("healthz", "1", 5) == "1"
    ok = all(checks.values())
    return JsonResponse({"status": "ok" if ok else "degraded", "checks": checks},
                        status=200 if ok else 503)
\`\`\`

\`\`\`
liveness  fails -> orchestrator RESTARTS the container   -> keep it trivial (no DB!), or a crash
                                                            loop takes the whole service down
readiness fails -> orchestrator STOPS routing traffic here (but doesn't kill it) -> check deps
both should be fast, unauthenticated, and excluded from request logging / Sentry
\`\`\`

**Prometheus metrics**

\`\`\`python
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST

REQUESTS = Counter("http_requests_total", "requests", ["method", "status"])
LATENCY  = Histogram("http_request_duration_seconds", "latency", ["path"])

class MetricsMiddleware:
    def __init__(self, get_response): self.get_response = get_response
    def __call__(self, request):
        with LATENCY.labels(path=request.resolver_match.route if request.resolver_match else "?").time():
            resp = self.get_response(request)
        REQUESTS.labels(method=request.method, status=resp.status_code).inc()
        return resp

def metrics(request):
    return HttpResponse(generate_latest(), content_type=CONTENT_TYPE_LATEST)
\`\`\`

\`\`\`
Counter    monotonic count (requests, errors, tasks) -- you graph rate() of it
Gauge      a value that goes up and down (queue depth, active connections)
Histogram  bucketed observations -> p50/p95/p99 latency, request sizes
the four golden signals: latency, traffic, errors, saturation
label CARDINALITY matters: never label by user id / raw path / request id -> series explosion
\`\`\``,

    simpleHi: `**Sentry**

\`\`\`python
# settings.py
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn=env("SENTRY_DSN"),
    integrations=[DjangoIntegration()],
    environment=env("ENVIRONMENT", "production"),
    release=env("GIT_SHA"),                 # errors ko ek deploy se tie karo
    traces_sample_rate=0.05,               # 5% requests ko performance tracing
    send_default_pii=False,                # default se user email / IP / cookies attach mat karo
    before_send=scrub,                     # aapke server se nikalne se pehle redact ka aakhri mauka
)

def scrub(event, hint):
    event.get("request", {}).pop("cookies", None)
    if "Authorization" in event.get("request", {}).get("headers", {}):
        event["request"]["headers"]["Authorization"] = "[redacted]"
    return event                           # event ko poori tarah DROP karne ko None return karo
\`\`\`

\`\`\`
ek view / task mein unhandled exception -> traceback, request, release, environment, aur
                                           breadcrumbs (recent log lines / queries) ke saath Sentry event
sentry_sdk.capture_exception(exc)     -- ek caught exception report karo jise aap abhi bhi jaanna chahte ho
sentry_sdk.capture_message("...", level="warning")
sentry_sdk.set_user({"id": ...})      -- par PII ka dhyaan; send_default_pii=False safe default hai
sentry_sdk.set_tag / set_context      -- extra searchable dimensions
\`\`\`

**Health checks — liveness vs readiness**

\`\`\`python
def livez(request):                        # "kya process zinda hai?" -- KOI dependency checks NAHI
    return JsonResponse({"status": "ok"})

def readyz(request):                        # "kya ye traffic serve kar sakta hai?" -- dependencies check
    checks = {}
    try:
        connections["default"].cursor().execute("SELECT 1"); checks["db"] = True
    except Exception:
        checks["db"] = False
    checks["cache"] = cache.get_or_set("healthz", "1", 5) == "1"
    ok = all(checks.values())
    return JsonResponse({"status": "ok" if ok else "degraded", "checks": checks},
                        status=200 if ok else 503)
\`\`\`

\`\`\`
liveness  fail -> orchestrator container RESTART karta hai   -> ise trivial rakho (koi DB nahi!)
readiness fail -> orchestrator yahaan traffic ROUTE karna BAND karta hai (par kill nahi) -> deps check
dono fast, unauthenticated, aur request logging / Sentry se excluded hone chahiye
\`\`\`

**Prometheus metrics**

\`\`\`python
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST

REQUESTS = Counter("http_requests_total", "requests", ["method", "status"])
LATENCY  = Histogram("http_request_duration_seconds", "latency", ["path"])
# ... MetricsMiddleware jo REQUESTS.labels(...).inc() aur LATENCY.labels(...).time() kare ...

def metrics(request):
    return HttpResponse(generate_latest(), content_type=CONTENT_TYPE_LATEST)
\`\`\`

\`\`\`
Counter    monotonic count (requests, errors, tasks) -- aap iska rate() graph karte ho
Gauge      ek value jo upar-neeche jaati hai (queue depth, active connections)
Histogram  bucketed observations -> p50/p95/p99 latency, request sizes
four golden signals: latency, traffic, errors, saturation
label CARDINALITY maayne rakhta hai: kabhi user id / raw path / request id se label mat karo
\`\`\``,

    content: `## Sentry — error tracking

An unhandled exception in a Django view normally becomes a \`500\` and a line in \`django.request\`'s log. Sentry turns it into a rich, deduplicated **event**: the full traceback with local variables, the request (method, URL, headers, params — scrubbed), the release and environment, the user (if you opt in), and **breadcrumbs** — the recent log lines, SQL queries, and HTTP calls that led up to it. Identical errors are grouped into one **issue** with a count and a trend, so you see "this started 40 minutes ago, 1,200 times, only in production, only since release \`abc123\`".

\`\`\`python
sentry_sdk.init(
    dsn=SENTRY_DSN,
    integrations=[DjangoIntegration()],           # auto-captures unhandled view/middleware exceptions
    environment="production",
    release=GIT_SHA,
    traces_sample_rate=0.05,                      # perf tracing on 5% of transactions
    profiles_sample_rate=0.05,
    send_default_pii=False,
    before_send=scrub_event,
)
\`\`\`

Key settings:

- **\`release\`** — set it to the git SHA or version. Sentry then attributes each issue to the deploy that introduced it and marks it resolved-in-next-release. This is how you catch "the deploy 10 minutes ago broke checkout".
- **\`environment\`** — \`production\` / \`staging\` / \`dev\`, so you filter noise.
- **\`traces_sample_rate\`** — fraction of requests that get full performance tracing (spans for each query, template render, HTTP call). \`1.0\` in dev, a small fraction in prod (it has overhead and cost).
- **\`send_default_pii=False\`** (the default) — do **not** attach the user's IP, cookies, or email automatically. Turn it on only deliberately, and even then scrub.
- **\`before_send(event, hint)\`** — runs on your server before the event is sent. Redact headers, drop request bodies, filter out known-noise exceptions (\`return None\` to drop the event). Your last line of defence against leaking data to a third party.

For **caught** exceptions you still want visibility on: \`sentry_sdk.capture_exception(exc)\`. For a non-exception signal: \`sentry_sdk.capture_message("cache stampede detected", level="warning")\`. Add dimensions with \`set_tag("tenant", t)\` and \`set_context("order", {...})\`.

Celery tasks: add \`CeleryIntegration()\` and task exceptions are captured too.

## Health checks — two different questions

Orchestrators (Kubernetes, ECS, a load balancer) probe HTTP endpoints to decide what to do with an instance. There are **two distinct checks**:

- **Liveness (\`/livez\`, \`/healthz\`)** — "is this process alive and not wedged?" A failure means the orchestrator **kills and restarts the container**. It must be **trivial**: return \`200\` if the process can respond at all. **Do not check the database here.** If the DB is briefly down and your liveness check queries it, every instance fails liveness, every instance gets restarted, and you have turned a database blip into a full outage / crash loop.
- **Readiness (\`/readyz\`)** — "can this instance serve real traffic right now?" A failure means the orchestrator **stops routing new requests to it** but leaves it running. This is where you **check dependencies**: a \`SELECT 1\`, a cache round-trip, maybe broker connectivity. On startup, readiness is false until migrations/warmup finish; if the DB goes away, instances go un-ready and traffic drains, but nothing is killed, so recovery is automatic when the DB returns.

Both endpoints: fast, **unauthenticated** (the probe has no credentials), and **excluded** from request logging, metrics, and Sentry (they fire every few seconds and would drown everything). Django packages: \`django-health-check\` gives ready-made checks; a hand-rolled view is often enough.

## Metrics — the aggregate view

Logs tell you about individual events; Sentry tells you about individual errors. Neither tells you "requests/sec doubled" or "p99 latency went from 200ms to 2s at 14:05". That is **metrics** — numeric time series, scraped by Prometheus (or pushed to StatsD/Datadog) and graphed in Grafana.

\`prometheus_client\` gives you the instruments:

- **\`Counter\`** — only goes up (total requests, total errors, tasks processed). You graph \`rate(http_requests_total[5m])\`.
- **\`Gauge\`** — goes up and down (in-flight requests, queue depth, DB pool connections in use).
- **\`Histogram\`** — records observations into buckets, so Prometheus can compute quantiles: \`histogram_quantile(0.99, http_request_duration_seconds_bucket)\`.

A middleware increments the counter and times the histogram per request; a \`/metrics\` view returns \`generate_latest()\` in the Prometheus text format. \`django-prometheus\` wires all of this (per-view latency, DB query counts, cache hits) with a few settings.

The **four golden signals** to always have: **latency** (histogram), **traffic** (request-rate counter), **errors** (error-rate counter, or 5xx/total), **saturation** (gauges — CPU, memory, pool usage, queue depth).

### Cardinality is the trap

Every distinct combination of label values is a separate time series stored forever. \`http_requests_total{method, status}\` is ~20 series — fine. \`http_requests_total{method, status, user_id}\` is one series *per user* — millions — and it will take down your metrics backend. **Never label by user id, raw URL path (use the route pattern \`/orders/{id}/\`), request id, or any unbounded value.**

## The three together

- A \`500\` spike shows on the **metrics** error-rate graph (you get paged).
- **Sentry** tells you *which* exception, *where*, *since which release*, with the traceback.
- The **logs** (filtered by the \`request_id\` from lesson 5) give you the exact sequence for one failing request.
- **Health checks** kept the bad instances out of rotation while you worked.

You need all four layers; none replaces another.`,

    contentHi: `## Sentry — error tracking

Ek Django view mein ek unhandled exception normally ek \`500\` aur \`django.request\` ke log mein ek line ban jaata hai. Sentry ise ek rich, deduplicated **event** mein badalta hai: local variables ke saath poora traceback, request (scrubbed), release aur environment, user (agar aap opt in karो), aur **breadcrumbs** — recent log lines, SQL queries, aur HTTP calls jo iski taraf le gaye. Identical errors ek **issue** mein grouped hote hain ek count aur trend ke saath.

Mukhya settings:

- **\`release\`** — ise git SHA par set karo. Sentry phir har issue ko us deploy ko attribute karta hai jisne ise introduce kiya. Isi tarah aap "10 minute pehle wale deploy ne checkout toda" pakadte ho.
- **\`environment\`** — \`production\` / \`staging\` / \`dev\`.
- **\`traces_sample_rate\`** — requests ka fraction jinhe full performance tracing milti hai. Dev mein \`1.0\`, prod mein ek chhota fraction.
- **\`send_default_pii=False\`** (default) — user ka IP, cookies, ya email automatically attach **mat** karo.
- **\`before_send(event, hint)\`** — event bhejne se pehle aapke server par chalta hai. Headers redact karo, request bodies drop karo, known-noise exceptions filter karo (\`return None\` event drop karne ko). Ek third party ko data leak karne ke khilaf aapki aakhri line of defence.

**Caught** exceptions ke liye jinpar aap abhi bhi visibility chahte ho: \`sentry_sdk.capture_exception(exc)\`. Ek non-exception signal ke liye: \`sentry_sdk.capture_message(...)\`.

## Health checks — do alag sawaal

- **Liveness (\`/livez\`)** — "kya ye process zinda hai aur wedged nahi?" Ek failure matlab orchestrator **container ko kill aur restart karta hai**. Ye **trivial** hona chahiye. **Yahaan database check MAT karo.** Agar DB thodी der down hai aur aapka liveness check ise query karta hai, har instance liveness fail karta hai, har instance restart hota hai, aur aapne ek database blip ko ek full outage / crash loop mein badal diya.
- **Readiness (\`/readyz\`)** — "kya ye instance abhi real traffic serve kar sakta hai?" Ek failure matlab orchestrator **iske paas naye requests route karna band karta hai** par ise chalta chhodta hai. Yahaan aap **dependencies check** karte ho: ek \`SELECT 1\`, ek cache round-trip. Agar DB chala jaata hai, instances un-ready ho jaate hain aur traffic drain hota hai, par kuch kill nahi hota.

Dono endpoints: fast, **unauthenticated**, aur request logging, metrics, aur Sentry se **excluded**.

## Metrics — aggregate view

Logs individual events ke baare mein bataते hain; Sentry individual errors ke baare mein. Na koi "requests/sec double ho gaya" batata hai. Wo **metrics** hai — numeric time series, Prometheus dwara scraped aur Grafana mein graphed.

- **\`Counter\`** — sirf upar jaata hai. Aap \`rate(...)\` graph karte ho.
- **\`Gauge\`** — upar-neeche jaata hai (in-flight requests, queue depth).
- **\`Histogram\`** — observations ko buckets mein record karta hai, taaki Prometheus quantiles compute kar sake.

**Four golden signals**: **latency** (histogram), **traffic** (request-rate counter), **errors** (error-rate counter), **saturation** (gauges).

### Cardinality trap hai

Label values ka har distinct combination ek alag time series hai jo hamesha stored hai. \`http_requests_total{method, status}\` ~20 series hai — theek. \`http_requests_total{method, status, user_id}\` prati user ek series hai — millions — aur ye aapke metrics backend ko down kar dega. **Kabhi user id, raw URL path, request id, ya kisi unbounded value se label mat karo.**

## Teenon saath

- Ek \`500\` spike **metrics** error-rate graph par dikhta hai (aapko page kiya jaata hai).
- **Sentry** batata hai *kaunsा* exception, *kahaan*, *kis release se*, traceback ke saath.
- **Logs** (lesson 5 ke \`request_id\` se filtered) ek failing request ka theek sequence dete hain.
- **Health checks** ne bad instances ko rotation se bahar rakha jab aap kaam kar rahe the.

Aapको saari chaar layers chahiए; koi doosre ko replace nahi karti.`,

    examples: [
      {
        title: 'Sentry: capture an exception offline, and before_send scrubs it',
        titleHi: 'Sentry: ek exception offline capture karo, aur before_send ise scrub karta hai',
        code: `import sentry_sdk
from sentry_sdk.transport import Transport

captured = []

class MemoryTransport(Transport):
    def __init__(self, options=None):
        pass
    def capture_envelope(self, envelope):
        for item in envelope.items:
            if item.type == "event":
                captured.append(item.payload.json)
    def flush(self, *a, **k):
        pass
    def kill(self):
        pass

def before_send(event, hint):
    # with DjangoIntegration + a real request this is event["request"]; here we set it as a
    # context, so scrub event["contexts"]["request"]. Same idea: redact before it leaves.
    req = event.get("contexts", {}).get("request", {})
    req.pop("cookies", None)
    headers = req.get("headers", {})
    if "Authorization" in headers:
        headers["Authorization"] = "[redacted]"
    if event.get("tags", {}).get("drop") == "yes":
        return None                          # returning None drops the event entirely
    return event

sentry_sdk.init(
    dsn="https://public@example.com/1",
    transport=MemoryTransport,
    before_send=before_send,
    environment="staging",
    release="myapp@2.1.0",
    send_default_pii=False,
    traces_sample_rate=0.0,
)

# simulate a request context with sensitive headers + cookies
with sentry_sdk.new_scope() as scope:
    scope.set_context("request", {"headers": {"Authorization": "Bearer secret-token"},
                                  "cookies": "sessionid=abc123"})
    scope.set_tag("feature", "checkout")
    try:
        raise RuntimeError("payment gateway timeout")
    except RuntimeError:
        sentry_sdk.capture_exception()

sentry_sdk.flush()
ev = captured[-1]
print("exception type:", ev["exception"]["values"][0]["type"])
print("release:", ev["release"], "| environment:", ev["environment"])
print("tag feature:", ev["tags"]["feature"])
print("Authorization header:", ev["contexts"]["request"]["headers"]["Authorization"])
print("cookies present:", "cookies" in ev["contexts"]["request"])`,
        output: `exception type: RuntimeError
release: myapp@2.1.0 | environment: staging
tag feature: checkout
Authorization header: [redacted]
cookies present: False`,
        explain: 'The MemoryTransport captures the event envelope offline instead of sending it over the network, so you can assert on exactly what would leave your server. The event carries the release (myapp@2.1.0) and environment (staging) from init -- release is what lets Sentry attribute an issue to a specific deploy -- plus the exception type and the tag set inside the scope. before_send runs on your server just before send: it redacts the Authorization header to [redacted] and pops cookies out of the request context, so neither reaches Sentry. Returning None from before_send would drop the event entirely.',
        explainHi: 'MemoryTransport event envelope ko network par bhejne ke bजाy offline capture karta hai, toh aap theek us par assert kar sakte ho jo aapke server se nikalta. Event init se release (myapp@2.1.0) aur environment (staging) carry karta hai -- release wo hai jo Sentry ko ek issue ko ek vishisht deploy ko attribute karne deta hai -- plus exception type aur scope ke andar set tag. before_send aapke server par send se theek pehle chalta hai: ye Authorization header ko [redacted] karta hai aur cookies ko request context se pop karta hai. before_send se None return karna event ko poori tarah drop kar deta.',
      },
      {
        title: 'Liveness stays trivial; readiness checks the DB and returns 503 when it is down',
        titleHi: 'Liveness trivial rehta hai; readiness DB check karta hai aur down hone par 503 lautata hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes"], USE_TZ=True, MIDDLEWARE=[],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}})
django.setup()

from django.db import connections
from django.core.cache import cache
from django.http import JsonResponse
from django.urls import path
from django.test import Client

DB_UP = {"ok": True}

def livez(request):
    return JsonResponse({"status": "ok"})          # NEVER touches a dependency

def readyz(request):
    checks = {}
    try:
        if not DB_UP["ok"]:
            raise RuntimeError("simulated outage")
        connections["default"].cursor().execute("SELECT 1")
        checks["db"] = True
    except Exception:
        checks["db"] = False
    checks["cache"] = cache.get_or_set("healthz", "1", 5) == "1"
    ok = all(checks.values())
    return JsonResponse({"status": "ok" if ok else "degraded", "checks": checks},
                        status=200 if ok else 503)

urlpatterns = [path("livez", livez), path("readyz", readyz)]
c = Client()

print("livez:  ", c.get("/livez").status_code, c.get("/livez").json())
print("readyz (healthy):", c.get("/readyz").status_code, c.get("/readyz").json())

DB_UP["ok"] = False
r = c.get("/readyz")
print("readyz (db down): ", r.status_code, r.json())
print("livez still ok while db is down:", c.get("/livez").status_code,
      "  <- so the orchestrator does NOT restart the container")`,
        output: `livez:   200 {'status': 'ok'}
readyz (healthy): 200 {'status': 'ok', 'checks': {'db': True, 'cache': True}}
readyz (db down):  503 {'status': 'degraded', 'checks': {'db': False, 'cache': True}}
livez still ok while db is down: 200   <- so the orchestrator does NOT restart the container
`,
        explain: 'livez never imports connections or cache -- it just returns 200 if the process can respond. readyz checks the dependencies: a SELECT 1 and a cache round-trip, returning 503 when any fails. When the (simulated) database goes down, readyz flips to 503 with checks["db"] == False, so the orchestrator drains traffic away from this instance -- reversible, no restart. But livez stays 200, so the orchestrator does NOT kill the container. That separation is exactly what stops a brief database blip from restarting every instance at once and turning into a crash loop.',
        explainHi: 'livez kabhi connections ya cache import nahi karta -- ye bस 200 return karta hai agar process respond kar sakta hai. readyz dependencies check karta hai: ek SELECT 1 aur ek cache round-trip, kisi ke fail hone par 503 return karta hai. Jab (simulated) database down hota hai, readyz checks["db"] == False ke saath 503 par flip hota hai, toh orchestrator is instance se traffic drain karta hai -- reversible, koi restart nahi. Par livez 200 rehta hai, toh orchestrator container ko KILL NAHI karta. Wahi separation ek chhote database blip ko har instance ko ek saath restart karne se rokta hai.',
      },
      {
        title: 'Prometheus: a Counter + Histogram, the /metrics text format, and label cardinality',
        titleHi: 'Prometheus: ek Counter + Histogram, /metrics text format, aur label cardinality',
        code: `from prometheus_client import Counter, Histogram, generate_latest, CollectorRegistry

reg = CollectorRegistry()
REQUESTS = Counter("http_requests_total", "HTTP requests", ["method", "status"], registry=reg)
LATENCY = Histogram("http_request_duration_seconds", "latency",
                    buckets=[0.05, 0.1, 0.5, 1, 2.5], registry=reg)

# simulate some traffic
for _ in range(5):
    REQUESTS.labels("GET", "200").inc()
for _ in range(2):
    REQUESTS.labels("POST", "201").inc()
REQUESTS.labels("GET", "500").inc()
for d in (0.03, 0.07, 0.2, 0.2, 1.8):
    LATENCY.observe(d)

text = generate_latest(reg).decode()

print("--- counter series (method x status -> a handful) ---")
for line in sorted(l for l in text.splitlines() if l.startswith("http_requests_total{")):
    print(line)

print("--- histogram: bucket counts + sum + count ---")
for line in text.splitlines():
    if line.startswith("http_request_duration_seconds_bucket") or \\
       line.startswith("http_request_duration_seconds_count") or \\
       line.startswith("http_request_duration_seconds_sum"):
        print(line)

# CARDINALITY: labelling by an unbounded value would create one series per value
print("--- why you never label by user_id ---")
print("http_requests_total{method,status} ->", 3, "series here (bounded)")
print("http_requests_total{...,user_id} -> ONE SERIES PER USER -> unbounded -> kills Prometheus")`,
        output: `--- counter series (method x status -> a handful) ---
http_requests_total{method="GET",status="200"} 5.0
http_requests_total{method="GET",status="500"} 1.0
http_requests_total{method="POST",status="201"} 2.0
--- histogram: bucket counts + sum + count ---
http_request_duration_seconds_bucket{le="0.05"} 1.0
http_request_duration_seconds_bucket{le="0.1"} 2.0
http_request_duration_seconds_bucket{le="0.5"} 4.0
http_request_duration_seconds_bucket{le="1.0"} 4.0
http_request_duration_seconds_bucket{le="2.5"} 5.0
http_request_duration_seconds_bucket{le="+Inf"} 5.0
http_request_duration_seconds_count 5.0
http_request_duration_seconds_sum 2.3
--- why you never label by user_id ---
http_requests_total{method,status} -> 3 series here (bounded)
http_requests_total{...,user_id} -> ONE SERIES PER USER -> unbounded -> kills Prometheus
`,
        explain: 'Counter series are stored one per distinct label-value combination: method x status here is just 3 series, which is fine. generate_latest renders the Prometheus text format -- each counter line, and for the histogram the cumulative _bucket lines (le="0.1" counts everything <= 0.1, so 2), plus _sum and _count. The point of the last block: labelling by an unbounded value like user_id would create one time series per user, forever, and that unbounded cardinality is what takes down a Prometheus server. Label by method, route pattern, and status class -- all bounded.',
        explainHi: 'Counter series prati distinct label-value combination ek store hoti hain: yahaan method x status bस 3 series hai, jo theek hai. generate_latest Prometheus text format render karta hai -- har counter line, aur histogram ke liye cumulative _bucket lines (le="0.1" sab kuch <= 0.1 count karta hai, toh 2), plus _sum aur _count. Aakhri block ka point: user_id jaise ek unbounded value se label karna prati user ek time series banata, hamesha ke liye, aur wo unbounded cardinality ek Prometheus server ko down karti hai. method, route pattern, aur status class se label karo -- sab bounded.',
      },
    ],

    mistakes: [
      {
        wrong: `def healthz(request):                       # used as the LIVENESS probe
    connections["default"].cursor().execute("SELECT 1")
    cache.get("x")
    requests.get(PARTNER_API + "/ping", timeout=2)
    return JsonResponse({"ok": True})
# the DB has a 30-second blip -> every pod fails liveness -> every pod is killed -> full outage`,
        right: `def livez(request):                         # liveness: process alive, nothing else
    return JsonResponse({"status": "ok"})

def readyz(request):                        # readiness: dependency checks live HERE
    try:
        connections["default"].cursor().execute("SELECT 1")
        return JsonResponse({"status": "ok"})
    except Exception:
        return JsonResponse({"status": "degraded"}, status=503)`,
        why: 'A liveness probe failure causes the orchestrator to kill and restart the container. If the liveness check depends on the database (or cache, or a third party), then a brief outage of that dependency makes every instance fail liveness simultaneously — so every instance is restarted, none can start up cleanly while the dependency is still down, and you have amplified a recoverable blip into a crash loop and a total outage. Liveness must only answer "is this process responsive". Dependency health belongs in the readiness probe, whose failure merely drains traffic (reversible, automatic recovery) rather than killing anything.',
        whyHi: 'Ek liveness probe failure orchestrator ko container kill aur restart karwaata hai. Agar liveness check database (ya cache, ya ek third party) par nirbhar karta hai, toh us dependency ka ek chhota outage har instance ko ek saath liveness fail karwaata hai — toh har instance restart hota hai, koi cleanly start nahi ho sakta jab tak dependency down hai, aur aapne ek recoverable blip ko ek crash loop mein amplify kar diya. Liveness ko sirf "kya ye process responsive hai" answer karna chahiye. Dependency health readiness probe mein hai.',
      },
      {
        wrong: `LATENCY = Histogram("http_request_duration_seconds", "latency", ["path"])
# ...
LATENCY.labels(path=request.path).observe(elapsed)
# request.path is "/orders/5001/", "/orders/5002/", ... -> a new time series for EVERY order id`,
        right: `LATENCY = Histogram("http_request_duration_seconds", "latency", ["route", "method"])
# ...
route = request.resolver_match.route if request.resolver_match else "unmatched"
LATENCY.labels(route=route, method=request.method).observe(elapsed)   # route = "orders/<int:pk>/"`,
        why: 'Prometheus stores one time series per unique combination of label values, forever (well, for the retention period). Labelling by `request.path` means every distinct URL — every order id, every user profile, every search query string — becomes its own series. That is unbounded cardinality: memory and index growth that eventually crashes the Prometheus server. Label by the **route pattern** (`orders/<int:pk>/`, available as `request.resolver_match.route`), the HTTP method, the status class — all bounded sets. The same rule kills any attempt to label by user id, tenant id (if you have thousands), or request id.',
        whyHi: 'Prometheus label values ke har unique combination ke liye ek time series store karta hai, hamesha ke liye. `request.path` se label karna matlab har distinct URL — har order id, har user profile — apni series ban jaata hai. Wo unbounded cardinality hai: memory aur index growth jo ant mein Prometheus server ko crash karta hai. **Route pattern** se label karo (`orders/<int:pk>/`, `request.resolver_match.route` ke roop mein available), HTTP method, status class — sab bounded sets.',
      },
      {
        wrong: `sentry_sdk.init(dsn=SENTRY_DSN, send_default_pii=True)      # attaches user email, IP, cookies
# no before_send, no environment, no release
# -> every event carries PII to a third party; you can't tell prod errors from staging;
#    you can't attribute a regression to a deploy`,
        right: `sentry_sdk.init(
    dsn=SENTRY_DSN,
    integrations=[DjangoIntegration(), CeleryIntegration()],
    environment=ENVIRONMENT,
    release=GIT_SHA,
    send_default_pii=False,
    traces_sample_rate=0.05,
    before_send=scrub_headers_and_bodies,
)`,
        why: 'Three problems with the naive init. `send_default_pii=True` ships the user\'s email, IP address, and cookies to Sentry on every event — a data-protection issue and often a compliance one; leave it `False` and add only the minimal identifiers you need, deliberately. No `environment` means staging and production errors land in the same stream and you cannot filter. No `release` means Sentry cannot tell you an issue started with a specific deploy, which is the single most useful signal during an incident. And no `before_send` means whatever is in the request headers and body — auth tokens, card data — goes to a third party verbatim.',
        whyHi: 'Naive init ke teen problems. `send_default_pii=True` har event par user ka email, IP, aur cookies Sentry ko bhejता hai — ek data-protection issue. Ise `False` chhodo. Koi `environment` nahi matlab staging aur production errors ek hi stream mein aate hain. Koi `release` nahi matlab Sentry aapko nahi bata sakta ki ek issue ek vishisht deploy se shuru hua — ek incident ke dauran sabse useful signal. Aur koi `before_send` nahi matlab request headers aur body mein jo bhi hai — auth tokens, card data — ek third party ko verbatim jaता hai.',
      },
    ],

    realWorld: [
      {
        en: '**Sentry with `release=$GIT_SHA`, `environment`, `DjangoIntegration` + `CeleryIntegration`, `traces_sample_rate=0.05`, `send_default_pii=False`, and a `before_send` that redacts `Authorization`/`Cookie` headers and drops request bodies for auth routes** — plus a Sentry "regression" alert wired to the deploy pipeline.',
        hi: '**Sentry `release=$GIT_SHA`, `environment`, `DjangoIntegration` + `CeleryIntegration`, `traces_sample_rate=0.05`, `send_default_pii=False`, aur ek `before_send` ke saath jo `Authorization`/`Cookie` headers redact karta hai** — plus deploy pipeline se wired ek Sentry "regression" alert.',
      },
      {
        en: '**`/livez` returning a bare `200`, `/readyz` checking DB + cache + (on startup) "migrations applied"** — Kubernetes `livenessProbe` on `/livez` with a generous failure threshold, `readinessProbe` on `/readyz`, both excluded from access logs, metrics, and Sentry via a path check in the middleware.',
        hi: '**`/livez` ek bare `200` lautata hua, `/readyz` DB + cache + (startup par) "migrations applied" check karta hua** — Kubernetes `livenessProbe` `/livez` par ek udaar failure threshold ke saath, `readinessProbe` `/readyz` par, dono access logs, metrics, aur Sentry se excluded.',
      },
      {
        en: '**`django-prometheus` for the app metrics + a `/metrics` endpoint scraped by Prometheus, Grafana dashboards for the four golden signals, and alerts on `rate(5xx) / rate(total) > 2%` for 5 minutes** — labels limited to `method`, `route pattern`, `status class`; never user/tenant/path.',
        hi: '**App metrics ke liye `django-prometheus` + Prometheus dwara scraped ek `/metrics` endpoint, four golden signals ke liye Grafana dashboards, aur `rate(5xx) / rate(total) > 2%` par 5 minute ke liye alerts** — labels `method`, `route pattern`, `status class` tak limited.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a liveness and a readiness probe, and why must liveness not check the database?',
        qHi: 'Ek liveness aur ek readiness probe mein kya antar hai, aur liveness ko database check kyun nahi karna chahiye?',
        a: 'They answer two different questions and the orchestrator reacts differently to each. Liveness asks "is this process alive and not permanently stuck?" If the liveness probe fails, the orchestrator concludes the container is broken and kills it, then starts a fresh one. Readiness asks "can this instance serve real traffic right now?" If the readiness probe fails, the orchestrator stops sending it new requests but leaves it running, and resumes routing once it passes again. Because liveness failure is destructive — it restarts the container — it must depend on nothing except the process itself being able to respond. The classic mistake is checking the database in the liveness probe. If the database has even a brief outage, every instance liveness check fails at the same moment, so the orchestrator restarts every instance simultaneously; none of them can come up healthy while the database is still down, so they enter a crash loop, and a recoverable 30-second database blip becomes a total, prolonged outage. Dependency checks belong in readiness, where a failure is harmless and self-correcting: the instances go un-ready, traffic drains away from them, nothing is killed, and when the database recovers the readiness checks pass and traffic returns automatically. So liveness is a trivial "return 200 if I can respond", and readiness is where you put the SELECT 1, the cache round-trip, and any startup gating like "migrations have run".',
        aHi: 'Wo do alag sawaal answer karte hain aur orchestrator har ek par alag react karta hai. Liveness poochta hai "kya ye process zinda aur permanently stuck nahi hai?" Agar liveness probe fail hota hai, orchestrator nishkarsh nikaalta hai ki container toota hai aur ise kill karta hai, phir ek fresh shuru karta hai. Readiness poochta hai "kya ye instance abhi real traffic serve kar sakta hai?" Agar readiness probe fail hota hai, orchestrator ise naye requests bhejna band karta hai par ise chalta chhodta hai. Kyunki liveness failure destructive hai, ise process ke khud respond kar sakne ke alawa kisi cheez par nirbhar nahi hona chahiye. Classic galti liveness probe mein database check karna hai. Agar database ka ek chhota outage bhi hai, har instance ka liveness check ek hi pal fail hota hai, toh orchestrator har instance ko ek saath restart karta hai; koi bhi healthy nahi aa sakta jab tak database down hai, toh wo ek crash loop mein enter karte hain. Dependency checks readiness mein hain.',
      },
      {
        q: 'Sentry, logs, and metrics all exist. What does each give you that the others do not, and how do they work together during an incident?',
        qHi: 'Sentry, logs, aur metrics sab maujood hain. Har ek aapko kya deta hai jo doosre nahi dete, aur ek incident ke dauran wo saath kaise kaam karte hain?',
        a: 'Metrics are numeric time series — request rate, error rate, latency percentiles, saturation gauges — aggregated across all traffic. They are the only layer that shows you a trend: requests doubled, p99 latency jumped from 200 milliseconds to 2 seconds at 14:05, the 5xx rate crossed 2 percent. Metrics are what page you, and what you watch to know whether a fix worked. They tell you nothing about why. Sentry is per-error: it takes an unhandled exception and gives you the full traceback with local variables, the request that triggered it, the release and environment, breadcrumbs of the recent activity, and it groups identical errors into one issue with a count and a first-seen. Sentry tells you which exception, in which function, starting with which deploy. It does not show you aggregate system behaviour and it only sees things that raised. Logs are the linear narrative of individual events. Filtered by the request id that a middleware attaches to every line, they give you the exact ordered sequence of what happened in one specific failing request — the cache miss, the external call, the retry, the fallback — including things that did not raise an exception. During an incident the flow is: the metrics error-rate or latency graph alerts you and tells you when it started and how bad it is; you open Sentry to see which exception spiked and that it began with the release from 12 minutes ago; you grab a request id from a Sentry event or a customer report and pull that request full log trail to understand the precise failure path; and meanwhile the readiness health checks have been keeping the worst instances out of the load balancer. Four layers, no overlap.',
        aHi: 'Metrics numeric time series hain — request rate, error rate, latency percentiles — saare traffic ke paar aggregated. Wo ekmatra layer hain jo aapko ek trend dikhाti hain: requests double ho gaye, p99 latency 14:05 par 200 milliseconds se 2 seconds kood gaya. Metrics wo hain jo aapko page karti hain. Wo aapko kyun ke baare mein kuch nahi bataती. Sentry per-error hai: ye ek unhandled exception leta hai aur aapko local variables ke saath poora traceback, ise trigger karne wali request, release aur environment deta hai, aur identical errors ko ek issue mein group karta hai. Sentry bataता hai kaunsा exception, kis function mein, kis deploy se shuru. Logs individual events ka linear narrative hain. Har line par ek middleware jo request id attach karta hai usse filtered, wo aapको ek vishisht failing request mein kya hua ka theek ordered sequence dete hain. Ek incident ke dauran flow hai: metrics graph aapको alert karta hai; aap Sentry kholte ho ki kaunsा exception spike hua; aap ek request id lete ho aur us request ka full log trail kheenchte ho.',
      },
    ],

    exercises: [
      {
        task: 'Use `sentry_sdk` offline: a `MemoryTransport(sentry_sdk.transport.Transport)` whose `capture_envelope` appends each `item.payload.json` (for `item.type == "event"`) to a list. A `before_send(event, hint)` that reads `req = event.get("contexts", {}).get("request", {})`, pops `req["cookies"]`, redacts `req["headers"]["Authorization"]` to `"[redacted]"`, and `return None` if `event.get("tags", {}).get("drop") == "yes"`. `sentry_sdk.init(dsn="https://public@example.com/1", transport=MemoryTransport, before_send=..., environment="staging", release="myapp@2.1.0", send_default_pii=False, traces_sample_rate=0.0)`. In a `new_scope()`, `set_context("request", {"headers": {"Authorization": "Bearer x"}, "cookies": "s=1"})`, `set_tag("feature", "checkout")`, raise `RuntimeError` + `capture_exception()`. `flush()`. Assert the captured event has `release == "myapp@2.1.0"`, `environment == "staging"`, `tags["feature"] == "checkout"`, `exception.values[0].type == "RuntimeError"`, `contexts.request.headers.Authorization == "[redacted]"`, and `"cookies" not in contexts.request`.',
        taskHi: '`sentry_sdk` offline istemal karo: ek `MemoryTransport` jiska `capture_envelope` har event `item.payload.json` ek list mein append kare. Ek `before_send` jo `event["contexts"]["request"]` se `cookies` pop kare, `Authorization` ko `"[redacted]"` kare, aur `event.get("tags", {}).get("drop") == "yes"` par `None` return kare. `sentry_sdk.init(...)`. Ek `new_scope()` mein `set_context("request", ...)` + `set_tag("feature", "checkout")`, `RuntimeError` raise + `capture_exception()`. `flush()`. Assert release / environment / tag / exception type / redacted header / no cookies.',
        hint: '`from sentry_sdk.transport import Transport`. Override `__init__(self, options=None)`, `capture_envelope`, `flush`, `kill`. `scope.set_context("request", d)` lands in `event["contexts"]["request"]` (NOT `event["request"]` — that is only populated by DjangoIntegration from a real request). `sentry_sdk.new_scope()` is a context manager.',
        hintHi: '`from sentry_sdk.transport import Transport`. `scope.set_context("request", d)` `event["contexts"]["request"]` mein aata hai (`event["request"]` mein NAHI — wo sirf DjangoIntegration ek real request se populate karta hai). `sentry_sdk.new_scope()` ek context manager hai.',
      },
      {
        task: 'Standalone Django, `MIDDLEWARE=[]`, sqlite + `LocMemCache`. A `DB_UP = {"ok": True}` module dict. `livez(request)` -> `JsonResponse({"status": "ok"})` and NOTHING else. `readyz(request)` -> if `DB_UP["ok"]` run `connections["default"].cursor().execute("SELECT 1")` else raise; check `cache.get_or_set("healthz","1",5) == "1"`; return `{"status", "checks"}` with HTTP `200` if all pass else `503`. With `Client`: assert `/livez` is `200`; `/readyz` is `200` with both checks `True`; then set `DB_UP["ok"] = False` and assert `/readyz` is `503` with `checks["db"] is False` but `/livez` is STILL `200`.',
        taskHi: 'Standalone Django, `MIDDLEWARE=[]`, sqlite + `LocMemCache`. `DB_UP = {"ok": True}`. `livez` -> `{"status": "ok"}` sirf. `readyz` -> DB + cache check, sab pass par `200` warna `503`. `Client` se: `/livez` `200`; `/readyz` `200`; phir `DB_UP["ok"] = False`, assert `/readyz` `503` (`checks["db"] is False`) par `/livez` ABHI BHI `200`.',
        hint: 'The whole point: `livez` never imports or touches `connections`/`cache`. When the DB is "down", readiness goes 503 (traffic drains) but liveness stays 200 (no restart) — that separation is what prevents a DB blip becoming a crash loop.',
        hintHi: 'Poora point: `livez` kabhi `connections`/`cache` ko import ya touch nahi karta. Jab DB "down" hai, readiness 503 jaata hai par liveness 200 rehta hai.',
      },
      {
        task: 'Use `prometheus_client` with an explicit `CollectorRegistry`. `REQUESTS = Counter("http_requests_total", "...", ["method", "status"], registry=reg)` and `LATENCY = Histogram("http_request_duration_seconds", "...", buckets=[0.05,0.1,0.5,1,2.5], registry=reg)`. Do `REQUESTS.labels("GET","200").inc()` 5x, `REQUESTS.labels("POST","201").inc()` 2x, `REQUESTS.labels("GET","500").inc()` 1x; `LATENCY.observe(d)` for `d in (0.03,0.07,0.2,0.2,1.8)`. Call `generate_latest(reg).decode()`. Assert: exactly 3 lines start with `http_requests_total{` (bounded cardinality — 3 method/status combos), the `GET/200` line ends in ` 5.0`, `http_request_duration_seconds_count` is ` 5.0`, and the `le="0.1"` bucket line is ` 2.0` (0.03 and 0.07 are ≤ 0.1). Print one sentence on why labelling by `user_id` would be a bug.',
        taskHi: '`prometheus_client` ek explicit `CollectorRegistry` ke saath. `Counter` + `Histogram` banao. Traffic simulate karo. `generate_latest(reg).decode()`. Assert: theek 3 `http_requests_total{` lines, `GET/200` line ` 5.0` par khatam, `..._count` ` 5.0`, `le="0.1"` bucket ` 2.0`. `user_id` se label karna bug kyun hoga ek vakya likho.',
        hint: '`from prometheus_client import Counter, Histogram, generate_latest, CollectorRegistry`. Histogram buckets are cumulative (`le` = "less than or equal"): the `le="0.1"` count includes everything `<= 0.1`. Each distinct label tuple = one stored series forever, so an unbounded label = unbounded series.',
        hintHi: '`from prometheus_client import Counter, Histogram, generate_latest, CollectorRegistry`. Histogram buckets cumulative hain (`le` = "less than or equal"). Har distinct label tuple = ek stored series hamesha ke liye.',
      },
    ],

    keyTakeaways: [
      'THREE complementary layers, none replaces another: SENTRY (per-error: full traceback + request + release + breadcrumbs, grouped into issues), HEALTH CHECKS (is this instance alive / ready), METRICS (aggregate trends: rate, error rate, latency percentiles, saturation).',
      'Sentry `init`: `release=$GIT_SHA` (attribute an issue to the deploy that introduced it — the #1 incident signal), `environment`, `integrations=[DjangoIntegration(), CeleryIntegration()]`, `traces_sample_rate` small in prod, `send_default_pii=False` (default — don\'t ship email/IP/cookies), `before_send` (redact headers/bodies, `return None` to drop).',
      '`sentry_sdk.capture_exception(exc)` for caught exceptions you still want to see; `capture_message(..., level=)` for non-exception signals; `set_tag`/`set_context` for searchable dimensions.',
      'LIVENESS vs READINESS are DIFFERENT: liveness fail -> orchestrator KILLS + restarts the container (keep it TRIVIAL — a bare `200`, NO dependency checks); readiness fail -> orchestrator STOPS routing traffic there but leaves it running (check DB/cache/broker HERE).',
      'A DB check in the LIVENESS probe is the classic outage amplifier: a brief DB blip -> every instance fails liveness -> every instance restarts -> crash loop -> total outage. Dependency health goes in readiness (reversible, auto-recovers).',
      'Both health endpoints: fast, UNAUTHENTICATED, and EXCLUDED from request logging / metrics / Sentry (they fire every few seconds).',
      'Prometheus instruments: `Counter` (monotonic — graph `rate()`), `Gauge` (up/down — queue depth, pool usage), `Histogram` (bucketed -> `histogram_quantile()` for p50/p95/p99). The FOUR GOLDEN SIGNALS: latency, traffic, errors, saturation.',
      'LABEL CARDINALITY is the trap: one time series per distinct label-value combination, stored forever. NEVER label by `user_id`, raw URL path (use the route pattern `orders/<int:pk>/`), `request_id`, or any unbounded value — it will take down the metrics backend.',
    ],
    keyTakeawaysHi: [
      'TEEN poorak layers, koi doosre ko replace nahi karti: SENTRY (per-error: poora traceback + request + release + breadcrumbs), HEALTH CHECKS (kya ye instance alive / ready hai), METRICS (aggregate trends: rate, error rate, latency percentiles, saturation).',
      'Sentry `init`: `release=$GIT_SHA` (#1 incident signal), `environment`, `integrations=[DjangoIntegration(), CeleryIntegration()]`, prod mein `traces_sample_rate` chhota, `send_default_pii=False` (default), `before_send` (headers/bodies redact karo, drop karne ko `return None`).',
      '`sentry_sdk.capture_exception(exc)` caught exceptions ke liye; `capture_message(..., level=)` non-exception signals ke liye; `set_tag`/`set_context` searchable dimensions ke liye.',
      'LIVENESS vs READINESS ALAG hain: liveness fail -> orchestrator container KILL + restart karta hai (ise TRIVIAL rakho — ek bare `200`, KOI dependency checks NAHI); readiness fail -> orchestrator wahaan traffic ROUTE karna BAND karta hai par chalta chhodta hai (DB/cache/broker YAHAN check karo).',
      'LIVENESS probe mein ek DB check classic outage amplifier hai: ek chhota DB blip -> har instance liveness fail -> har instance restart -> crash loop -> total outage. Dependency health readiness mein jaता hai.',
      'Dono health endpoints: fast, UNAUTHENTICATED, aur request logging / metrics / Sentry se EXCLUDED.',
      'Prometheus instruments: `Counter` (monotonic — `rate()` graph), `Gauge` (up/down), `Histogram` (bucketed -> p50/p95/p99). CHAAR GOLDEN SIGNALS: latency, traffic, errors, saturation.',
      'LABEL CARDINALITY trap hai: prati distinct label-value combination ek time series, hamesha stored. KABHI `user_id`, raw URL path (route pattern `orders/<int:pk>/` istemal karo), `request_id`, ya kisi unbounded value se label mat karo.',
    ],
  },
];
