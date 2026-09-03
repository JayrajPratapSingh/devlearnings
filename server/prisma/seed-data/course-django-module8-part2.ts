/**
 * Django Complete Course — Module 8: Large Data & Background Work, lessons 4-6.
 *
 * Lesson 4: keyset (seek) pagination — why LIMIT/OFFSET degrades with depth, the
 *           WHERE (sort_key, pk) < (last_seen) pattern, the mandatory tiebreak on a
 *           unique column, the composite index, no arbitrary page jumps, DRF
 *           CursorPagination, handling ties + deletions + an opaque cursor.
 * Lesson 5: read replicas & database routers — multiple DATABASES aliases, a
 *           DATABASE_ROUTERS class (db_for_read / db_for_write / allow_relation /
 *           allow_migrate), replication lag and the read-your-writes problem, .using(),
 *           transaction.atomic(using=), per-alias connections + CONN_MAX_AGE, pinning.
 * Lesson 6: Celery — broker + result backend, @shared_task, .delay()/.apply_async(),
 *           the worker, transaction.on_commit(lambda: task.delay(id)) + pass IDs not
 *           objects, retries + autoretry_for + retry_backoff, idempotency, acks_late +
 *           at-least-once, task_always_eager for tests, Beat, Flower, time limits.
 *
 * Conventions: see course-django-module8.ts header. Multi-DB examples use file-backed
 * sqlite via tempfile.mkdtemp(). Celery examples run in task_always_eager mode with
 * task_eager_propagates=False (so the retry loop runs in-process, no broker/worker).
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_8_PART2: CourseLesson[] = [
  {
    slug: 'dj-keyset-pagination-at-scale',
    title: 'Keyset Pagination: Fast Pages at Any Depth',
    titleHi: 'Keyset Pagination: Kisi Bhi Depth Par Tez Pages',
    description: '`LIMIT 20 OFFSET 200000` makes the database find, sort, and then *throw away* 200,000 rows before it returns your 20 — so page 10,000 is thousands of times slower than page 1. Keyset pagination asks "give me the 20 rows after this one" using a `WHERE` on the sort key, and every page costs the same.',
    descriptionHi: '`LIMIT 20 OFFSET 200000` database ko aapke 20 return karne se pehle 200,000 rows dhoondhne, sort karne, aur phir *phenkne* pe majboor karta hai — toh page 10,000 page 1 se hazaaron guna dheema hai. Keyset pagination sort key par ek `WHERE` istemal karke poochta hai "mujhe is ke baad ki 20 rows do", aur har page ki same cost hai.',
    difficulty: 'HARD',
    duration: 20,
    order: 4,

    analogy: {
      en: '**Finding your place in a 900-page book: counting pages from the front every time, versus using a bookmark.** `OFFSET` is counting from page 1 — to reach page 812 the database physically walks past pages 1 through 811 (reads them, orders them) and then discards them to hand you page 812. Early pages are quick; deep pages are agony, and the deeper you go the worse it gets. Keyset pagination is the bookmark: you remember exactly where you stopped — "the last row I saw was dated March 3rd, id 40417" — and next time you say "start just after March 3rd / 40417 and give me 20". The database jumps straight there via the index, reads 20 rows, done — the same tiny cost whether it is page 2 or page 20,000. The catch of the bookmark method is that you can only go *forward from where you were*; you cannot say "jump to page 500" because you never counted pages, you only kept a bookmark. For infinite-scroll feeds, "load more" buttons, and API cursors that is exactly the right trade.',
      hi: '**Ek 900-page kitaab mein apni jagah dhoondhna: har baar aage se pages ginna, badle ek bookmark istemal karna.** `OFFSET` page 1 se ginna hai — page 812 tak pahunchne ke liye database physically pages 1 se 811 tak chalta hai (unhe padhta hai, order karta hai) aur phir unhe discard karke aapko page 812 deta hai. Shuruaati pages tez hain; gehre pages azaab hain. Keyset pagination bookmark hai: aap theek yaad rakhte ho ki aap kahaan ruke — "aakhri row jo maine dekhi March 3 ki thi, id 40417" — aur agli baar aap kehte ho "March 3 / 40417 ke theek baad shuru karo aur 20 do". Database index ke zariye seedhe wahaan koodta hai, 20 rows padhta hai, ho gaya — same chhoti cost chahe page 2 ho ya page 20,000. Bookmark method ka catch ye hai ki aap sirf *jahaan the wahaan se aage* ja sakte ho; aap "page 500 par koodo" nahi keh sakte kyunki aapne kabhi pages nahi gine.',
    },

    simple: `**\`OFFSET\` — the database walks and discards**

\`\`\`python
Article.objects.order_by("-created")[200000:200020]
# SQL: ... ORDER BY created DESC LIMIT 20 OFFSET 200000
# the DB sorts 200020 rows and throws away 200000 of them to give you 20
\`\`\`

\`\`\`
page 1     OFFSET 0        fast
page 100   OFFSET 2000     still ok
page 10000 OFFSET 200000   the DB reads + sorts 200020 rows per request -> slow, and it degrades
\`\`\`

**Keyset — remember the last row, filter past it**

\`\`\`python
# page 1
page = list(Article.objects.order_by("-created", "-id")[:20])
last = page[-1]

# page 2: "everything ordered after (last.created, last.id)"
from django.db.models import Q
Article.objects.filter(
    Q(created__lt=last.created) |
    Q(created=last.created, id__lt=last.id)      # tiebreak on a UNIQUE column
).order_by("-created", "-id")[:20]
# SQL: ... WHERE (created < ? OR (created = ? AND id < ?)) ORDER BY created DESC, id DESC LIMIT 20
\`\`\`

\`\`\`
sort key MUST be a total order   -> add a unique tiebreak (usually the pk) or rows can be
                                    skipped/repeated when the sort column has duplicates
the (created, id) composite index makes the WHERE + ORDER BY an index range scan -> O(page size)
every page costs the same        -> no OFFSET, the DB seeks straight to the cursor position
\`\`\`

**What you lose**

\`\`\`
- no "jump to page 47" -- only next / (with a reversed query) previous
- no cheap total page count -- keyset feeds usually just say "load more" until empty
- the cursor is state the client must carry (an opaque token, not a page number)
\`\`\`

**DRF: \`CursorPagination\` does this for you**

\`\`\`python
class FeedPagination(CursorPagination):
    page_size = 20
    ordering = "-created"        # REQUIRED; DRF adds the pk tiebreak and encodes an opaque cursor

class FeedView(ListAPIView):
    pagination_class = FeedPagination
# response: {"results": [...], "next": "...?cursor=cD0y...", "previous": null}   -- no "count"
\`\`\`

\`\`\`
PageNumberPagination / LimitOffsetPagination   OFFSET-based, has a count, degrades deep, allows page jumps
CursorPagination                               keyset-based, NO count, O(1) per page, forward/back only
\`\`\``,

    simpleHi: `**\`OFFSET\` — database chalta hai aur discard karta hai**

\`\`\`python
Article.objects.order_by("-created")[200000:200020]
# SQL: ... ORDER BY created DESC LIMIT 20 OFFSET 200000
# DB 200020 rows sort karta hai aur unme se 200000 phenk deta hai aapko 20 dene ko
\`\`\`

\`\`\`
page 1     OFFSET 0        tez
page 100   OFFSET 2000     abhi bhi theek
page 10000 OFFSET 200000   DB prati request 200020 rows padhta + sort karta hai -> dheema, aur bigaडता hai
\`\`\`

**Keyset — aakhri row yaad rakho, iske baad filter karo**

\`\`\`python
# page 1
page = list(Article.objects.order_by("-created", "-id")[:20])
last = page[-1]

# page 2: "(last.created, last.id) ke baad ordered sab kuch"
from django.db.models import Q
Article.objects.filter(
    Q(created__lt=last.created) |
    Q(created=last.created, id__lt=last.id)      # ek UNIQUE column par tiebreak
).order_by("-created", "-id")[:20]
# SQL: ... WHERE (created < ? OR (created = ? AND id < ?)) ORDER BY created DESC, id DESC LIMIT 20
\`\`\`

\`\`\`
sort key ek total order HONA CHAHIYE   -> ek unique tiebreak add karo (aksar pk) warna rows
                                          skip/repeat ho sakti hain jab sort column mein duplicates hain
(created, id) composite index WHERE + ORDER BY ko ek index range scan banata hai -> O(page size)
har page ki same cost   -> koi OFFSET nahi, DB seedhe cursor position par seek karta hai
\`\`\`

**Aap kya khote ho**

\`\`\`
- koi "page 47 par koodo" nahi -- sirf next / (ek reversed query se) previous
- koi sasta total page count nahi -- keyset feeds aksar bas "load more" kehte hain jab tak khali na ho
- cursor state hai jo client ko carry karna hai (ek opaque token, page number nahi)
\`\`\`

**DRF: \`CursorPagination\` ye aapke liye karta hai**

\`\`\`python
class FeedPagination(CursorPagination):
    page_size = 20
    ordering = "-created"        # ZAROORI; DRF pk tiebreak add karta hai aur ek opaque cursor encode karta hai

class FeedView(ListAPIView):
    pagination_class = FeedPagination
# response: {"results": [...], "next": "...?cursor=cD0y...", "previous": null}   -- koi "count" nahi
\`\`\`

\`\`\`
PageNumberPagination / LimitOffsetPagination   OFFSET-based, count hai, deep degrades, page jumps allow
CursorPagination                               keyset-based, koi count NAHI, prati page O(1), sirf aage/peeche
\`\`\``,

    content: `## Why \`OFFSET\` degrades

\`LIMIT n OFFSET k\` is not "skip to row k". SQL has no way to jump to the k-th row of an ordered result without producing the first k rows. So the database:

1. evaluates the \`WHERE\`,
2. sorts the matching rows by the \`ORDER BY\` (or walks an index in order),
3. counts off \`k\` rows and **discards them**,
4. returns the next \`n\`.

The work is proportional to \`k + n\`. Page 1 (\`OFFSET 0\`) is instant; page 10,000 (\`OFFSET 200000\`) reads and orders 200,020 rows to return 20, on every single request. Under a crawler hitting deep pages, or an "export by paging" script, this is a common source of database load that looks mysterious until you check the offsets.

## Keyset / seek pagination

Instead of "skip \`k\` rows", say "give me the rows that come **after the last one I saw**". You remember the sort-key values of the last row on the current page and filter for rows ordered strictly after it:

\`\`\`python
# ordering by -created, -id  (newest first)
qs = Article.objects.order_by("-created", "-id")
first_page = list(qs[:20])
cursor = (first_page[-1].created, first_page[-1].id)

next_page = qs.filter(
    Q(created__lt=cursor[0]) | Q(created=cursor[0], id__lt=cursor[1])
)[:20]
\`\`\`

The \`WHERE\` clause \`(created < c) OR (created = c AND id < i)\` is the row-value comparison \`(created, id) < (c, i)\` written out (Django does not compile Python tuple comparison to SQL row-values, so you write the \`Q\` expansion; some databases also support \`(created, id) < (c, i)\` directly).

With a **composite index on \`(created, id)\`** matching the sort, the database does an **index range scan**: seek to the cursor position, read 20 entries, stop. The cost is the page size — identical for page 2 and page 200,000.

## The tiebreak is mandatory

If you paginate by \`-created\` alone and two rows share a \`created\` timestamp, a plain \`created < cursor\` either **skips** the other same-timestamp rows or, with \`<=\`, **repeats** the boundary row. The fix is to make the sort a **total order** by appending a unique column — almost always the primary key. \`order_by("-created", "-id")\` and the two-part \`Q\` guarantee every row appears exactly once across pages, even with duplicate timestamps, even if rows are inserted or deleted between requests.

## What you give up

- **Random access.** There is no "go to page 47" — the cursor only knows the last row seen. You get *next*; *previous* needs the query run with the ordering reversed and then re-reversed in Python. This is fine for infinite scroll, "load more", and API consumers walking a full dataset; it is wrong for a numbered pager where users click "page 12".
- **A total count.** \`COUNT(*)\` over a large filtered set is itself expensive, and keyset UIs usually drop it — "load more until nothing comes back". If you need an approximate count, get it separately (a cached value, \`reltuples\` on PostgreSQL).
- **Statelessness of a page number.** The client carries an opaque cursor token, not "page=12". That is a feature — the token encodes the exact position and is stable under inserts.

## DRF \`CursorPagination\`

DRF's \`CursorPagination\` (Module 5) implements all of this: you set \`ordering\` (required — it needs a deterministic order and adds the pk tiebreak), \`page_size\`, and it returns \`next\`/\`previous\` URLs with a base64 opaque \`cursor\` parameter and **no \`count\`**. Under the hood it is the \`WHERE (sort_key) </> cursor LIMIT page_size + 1\` query (the \`+ 1\` tells it whether there is a next page). Use it for feeds, activity streams, sync endpoints, and any list that can grow without bound. Keep \`PageNumberPagination\` only where users genuinely need to jump to an arbitrary page and the table is small enough that \`OFFSET\` stays cheap.

## The index is the whole point

Keyset pagination without an index matching \`(ORDER BY columns)\` is no faster than \`OFFSET\` — the database still scans and sorts. The composite index on exactly the ordering tuple (\`(created DESC, id DESC)\`, or \`(created, id)\` — most databases can scan an index backwards) is what turns the query into a seek. This is the practical payoff of the ordering discipline from Module 3 and the \`CursorPagination\` note in Module 5.`,

    contentHi: `## \`OFFSET\` kyun bigaडता hai

\`LIMIT n OFFSET k\` "row k par skip karo" nahi hai. SQL ke paas pehli k rows produce kiye bina ek ordered result ki k-vi row par koodne ka koi tareeka nahi. Toh database:

1. \`WHERE\` evaluate karta hai,
2. matching rows ko \`ORDER BY\` se sort karta hai (ya ek index order mein chalta hai),
3. \`k\` rows gin kar unhe **discard karta hai**,
4. agli \`n\` return karta hai.

Kaam \`k + n\` ke proportional hai. Page 1 (\`OFFSET 0\`) turant; page 10,000 (\`OFFSET 200000\`) 20 return karne ko 200,020 rows padhta aur order karta hai, har ek request par.

## Keyset / seek pagination

"\`k\` rows skip karo" ke badle, kaho "mujhe wo rows do jo **aakhri jo maine dekhi uske baad** aati hain". Aap current page ki aakhri row ke sort-key values yaad rakhte ho aur uske baad strictly ordered rows ke liye filter karte ho:

\`\`\`python
qs = Article.objects.order_by("-created", "-id")
first_page = list(qs[:20])
cursor = (first_page[-1].created, first_page[-1].id)

next_page = qs.filter(
    Q(created__lt=cursor[0]) | Q(created=cursor[0], id__lt=cursor[1])
)[:20]
\`\`\`

\`WHERE\` clause \`(created < c) OR (created = c AND id < i)\` row-value comparison \`(created, id) < (c, i)\` likha hua hai.

\`(created, id)\` par ek **composite index** jo sort se match karta hai ke saath, database ek **index range scan** karta hai: cursor position par seek karo, 20 entries padho, ruko. Cost page size hai — page 2 aur page 200,000 ke liye ek jaisi.

## Tiebreak zaroori hai

Agar aap sirf \`-created\` se paginate karte ho aur do rows ek \`created\` timestamp share karti hain, ek saada \`created < cursor\` ya to doosri same-timestamp rows ko **skip** karta hai ya, \`<=\` ke saath, boundary row ko **repeat** karta hai. Fix sort ko ek unique column jodkar ek **total order** banana hai — lगbhag hamesha primary key. \`order_by("-created", "-id")\` aur do-hisse ka \`Q\` guarantee karte hain ki har row pages ke paar theek ek baar dikhti hai.

## Aap kya chhodte ho

- **Random access.** Koi "page 47 par jao" nahi. Aapko *next* milta hai; *previous* ko ordering reversed ke saath chalayi gayi query chahiye. Ye infinite scroll ke liye theek hai; ek numbered pager ke liye galat hai.
- **Ek total count.** Ek bade filtered set par \`COUNT(*)\` khud mehenga hai, aur keyset UIs aksar ise chhod dete hain.
- **Ek page number ki statelessness.** Client ek opaque cursor token carry karta hai, "page=12" nahi. Ye ek feature hai — token exact position encode karta hai aur inserts ke tahat stable hai.

## DRF \`CursorPagination\`

DRF ka \`CursorPagination\` (Module 5) ye sab implement karta hai: aap \`ordering\` (zaroori), \`page_size\` set karte ho, aur ye ek base64 opaque \`cursor\` parameter ke saath \`next\`/\`previous\` URLs aur **koi \`count\` nahi** return karta hai. Feeds, activity streams, sync endpoints ke liye ise istemal karo. \`PageNumberPagination\` sirf wahaan rakho jahaan users ko sach mein ek arbitrary page par koodne ki zaroorat hai aur table \`OFFSET\` ke saste rehne ke liye kaafi chhoti hai.

## Index poora point hai

\`(ORDER BY columns)\` se match karte ek index ke bina keyset pagination \`OFFSET\` se tez nahi — database abhi bhi scan aur sort karta hai. Theek ordering tuple par composite index hi query ko ek seek mein badalta hai.`,

    examples: [
      {
        title: 'OFFSET makes the DB read offset+limit rows; keyset reads only page_size',
        titleHi: 'OFFSET DB ko offset+limit rows padhwaata hai; keyset sirf page_size padhta hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import Q
from django.test.utils import CaptureQueriesContext

class Article(models.Model):
    title = models.CharField(max_length=20)
    rank = models.IntegerField()                 # the sort key (has duplicates on purpose)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Article)
Article.objects.bulk_create([Article(title=f"a{i}", rank=i // 2) for i in range(200)])  # pairs share rank

order = ("-rank", "-id")
PAGE = 10

# --- OFFSET: page 6 is rows 50..59 of the ordered result ---
with CaptureQueriesContext(connection) as ctx1:
    offset_page6 = list(Article.objects.order_by(*order)[50:60])
print("OFFSET SQL tail:", ctx1.captured_queries[-1]["sql"].split("ORDER BY")[1].strip())
print("offset page 6 ids:", [a.id for a in offset_page6])

# --- keyset: walk one page at a time, remembering (rank, id) of the last row ---
def page_after(cursor):
    qs = Article.objects.order_by(*order)
    if cursor is None:
        return list(qs[:PAGE])
    rank, id_ = cursor
    return list(qs.filter(Q(rank__lt=rank) | Q(rank=rank, id__lt=id_))[:PAGE])

cur, page = None, None
with CaptureQueriesContext(connection) as ctx2:
    for _ in range(6):
        page = page_after(cur)
        cur = (page[-1].rank, page[-1].id)
print("keyset page 6 ids:", [a.id for a in page])
print("keyset SQL has OFFSET:", "OFFSET" in ctx2.captured_queries[-1]["sql"])
print("keyset WHERE:", '"rank" < ? OR ("rank" = ? AND "id" < ?)  -- tiebreak on unique id')
print("same rows as OFFSET page 6?", [a.id for a in offset_page6] == [a.id for a in page])`,
        output: `OFFSET SQL tail: "__main___article"."rank" DESC, "__main___article"."id" DESC LIMIT 10 OFFSET 50
offset page 6 ids: [150, 149, 148, 147, 146, 145, 144, 143, 142, 141]
keyset page 6 ids: [150, 149, 148, 147, 146, 145, 144, 143, 142, 141]
keyset SQL has OFFSET: False
keyset WHERE: "rank" < ? OR ("rank" = ? AND "id" < ?)  -- tiebreak on unique id
same rows as OFFSET page 6? True
`,
        explain: 'The OFFSET query for page 6 makes SQLite order the result and physically skip 50 rows to return 10 -- the SQL ends LIMIT 10 OFFSET 50, and the deeper the page the more rows are read and discarded. The keyset walk instead remembers the (rank, id) of the last row on each page and filters WHERE rank < ? OR (rank = ? AND id < ?) for the next -- no OFFSET in the SQL at all. With an index on (rank, id) that is an index range scan straight to the cursor position, the same cost for page 6 or page 6000. Both approaches return the identical 10 rows because the ordering is a total order.',
        explainHi: 'Page 6 ke liye OFFSET query SQLite ko result order karne aur physically 50 rows skip karne pe majboor karta hai 10 return karne ko -- SQL LIMIT 10 OFFSET 50 par khatam hota hai, aur page jitna gehra utni zyada rows padhi aur discard hoti hain. Keyset walk badle har page ki aakhri row ke (rank, id) yaad rakhta hai aur agle ke liye WHERE rank < ? OR (rank = ? AND id < ?) filter karta hai -- SQL mein koi OFFSET bilkul nahi. (rank, id) par ek index ke saath ye cursor position tak seedha ek index range scan hai. Dono approaches wahi 10 rows return karte hain kyunki ordering ek total order hai.',
      },
      {
        title: 'Without a unique tiebreak, duplicate sort values skip or repeat rows',
        titleHi: 'Ek unique tiebreak ke bina, duplicate sort values rows skip ya repeat karti hain',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import Q

class Task(models.Model):
    name = models.CharField(max_length=10)
    priority = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Task)
# 12 tasks, 3 priority groups of UNEVEN size (5, 3, 4) -> page boundaries split a tie group
Task.objects.bulk_create([Task(name=f"t{i}", priority=[5, 5, 5, 5, 5, 3, 3, 3, 1, 1, 1, 1][i]) for i in range(12)])

PAGE = 4

# --- BROKEN: order by priority only, cursor is just the priority ---
def broken_page(after_priority):
    qs = Task.objects.order_by("-priority", "id")
    if after_priority is None:
        return list(qs[:PAGE])
    return list(qs.filter(priority__lt=after_priority)[:PAGE])   # skips the rest of the tie group!

seen_broken = []
cur = None
for _ in range(3):
    rows = broken_page(cur)
    seen_broken += [t.name for t in rows]
    if rows:
        cur = rows[-1].priority
print("BROKEN saw", len(seen_broken), "of 12:", seen_broken)

# --- FIXED: total order on (priority, id); cursor is the pair ---
def fixed_page(cursor):
    qs = Task.objects.order_by("-priority", "id")
    if cursor is None:
        return list(qs[:PAGE])
    pr, id_ = cursor
    return list(qs.filter(Q(priority__lt=pr) | Q(priority=pr, id__gt=id_))[:PAGE])

seen_fixed = []
cur = None
for _ in range(3):
    rows = fixed_page(cur)
    seen_fixed += [t.name for t in rows]
    if rows:
        cur = (rows[-1].priority, rows[-1].id)
print("FIXED saw", len(seen_fixed), "of 12:", seen_fixed)
print("no repeats:", len(seen_fixed) == len(set(seen_fixed)))`,
        output: `BROKEN saw 8 of 12: ['t0', 't1', 't2', 't3', 't5', 't6', 't7', 't8']
FIXED saw 12 of 12: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11']
no repeats: True
`,
        explain: 'The broken version paginates by priority alone and carries only the priority as its cursor. When a page ends in the middle of a group of equal priorities -- here the priority-5 group has five rows but the page size is four -- the next query filters priority < 5, which jumps past the fifth priority-5 row entirely. Across three pages it silently misses four of twelve tasks. The fixed version makes the sort a total order by pairing (priority, id), carries the pair as the cursor, and filters priority < pr OR (priority = pr AND id > id_), which continues within the tie group. Every task is visited exactly once.',
        explainHi: 'Broken version sirf priority se paginate karta hai aur cursor ke roop mein sirf priority carry karta hai. Jab ek page barabar priorities ke ek group ke beech mein khatam hota hai -- yahan priority-5 group me paanch rows hain par page size chaar hai -- agli query priority < 5 filter karti hai, jo paanchvi priority-5 row ko puri tarah kood jaati hai. Teen pages me ye chupchaap baarah me se chaar tasks miss karta hai. Fixed version (priority, id) pair karke sort ko ek total order banata hai aur priority < pr OR (priority = pr AND id > id_) filter karta hai, jo tie group ke andar continue karta hai.',
      },
      {
        title: 'DRF CursorPagination: opaque cursor, next/previous, no count',
        titleHi: 'DRF CursorPagination: opaque cursor, next/previous, koi count nahi',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": []})
django.setup()

from django.db import models, connection
from rest_framework import serializers, generics
from rest_framework.pagination import CursorPagination
from rest_framework.test import APIClient
from django.urls import path

class Post(models.Model):
    body = models.CharField(max_length=20)
    created = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Post)
Post.objects.bulk_create([Post(body=f"p{i}", created=i) for i in range(25)])

class PostSer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "body"]

class FeedPagination(CursorPagination):
    page_size = 10
    ordering = "-created"

class Feed(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSer
    pagination_class = FeedPagination

urlpatterns = [path("feed/", Feed.as_view())]
c = APIClient()

r1 = c.get("/feed/")
d1 = r1.json()
print("page 1 count field present:", "count" in d1)
print("page 1 items:", [p["body"] for p in d1["results"]])
print("has next:", d1["next"] is not None, "| has previous:", d1["previous"] is None)

cursor_url = d1["next"]
d2 = c.get(cursor_url).json()
print("page 2 items:", [p["body"] for p in d2["results"]])
print("page 2 can go back:", d2["previous"] is not None)
print("cursor param in URL:", "cursor=" in cursor_url)`,
        output: `page 1 count field present: False
page 1 items: ['p24', 'p23', 'p22', 'p21', 'p20', 'p19', 'p18', 'p17', 'p16', 'p15']
has next: True | has previous: True
page 2 items: ['p14', 'p13', 'p12', 'p11', 'p10', 'p9', 'p8', 'p7', 'p6', 'p5']
page 2 can go back: True
cursor param in URL: True
`,
        explain: 'CursorPagination implements keyset pagination inside DRF. It requires an ordering (here -created), appends the primary key as a tiebreak, and returns a response with results, next, and previous -- but no count, because a COUNT over a large filtered set is exactly the cost keyset pagination exists to avoid. The next link is a URL carrying an opaque base64 cursor parameter that encodes the position; following it returns the next page and populates previous. The client never sends a page number -- it just follows the cursor links, which stay correct even as rows are inserted.',
        explainHi: 'CursorPagination DRF ke andar keyset pagination implement karta hai. Ise ek ordering chahiye (yahan -created), primary key ko ek tiebreak ke roop mein jodta hai, aur results, next, aur previous ke saath ek response return karta hai -- par koi count nahi, kyunki ek bade filtered set par ek COUNT theek wo cost hai jise avoid karne ke liye keyset pagination maujood hai. next link ek URL hai jo ek opaque base64 cursor parameter carry karta hai jo position encode karta hai. Client kabhi ek page number nahi bhejta.',
      },
    ],

    mistakes: [
      {
        wrong: `# infinite-scroll feed, 4M rows
def feed(request):
    page = int(request.GET.get("page", 1))
    start = (page - 1) * 20
    return JsonResponse({"items": list(
        Post.objects.order_by("-created").values("id", "body")[start:start + 20]
    )})
# page 50000 -> OFFSET 999980 -> the DB sorts a million rows every scroll`,
        right: `def feed(request):
    qs = Post.objects.order_by("-created", "-id")
    after = request.GET.get("after")            # "created,id" of the last row seen
    if after:
        c, i = after.split(",")
        qs = qs.filter(Q(created__lt=c) | Q(created=c, id__lt=int(i)))
    items = list(qs.values("id", "body", "created")[:20])
    nxt = f"{items[-1]['created']},{items[-1]['id']}" if items else None
    return JsonResponse({"items": items, "after": nxt})`,
        why: 'An infinite-scroll feed is the worst case for `OFFSET`: users scroll deep, and each scroll re-sorts and discards everything above the current position. By page 50,000 the database is ordering a million rows to return twenty, on every scroll event, for every scrolling user. Keyset pagination filters with `WHERE (created, id) < cursor` and — with an index on `(created, id)` — seeks straight to the position and reads twenty rows. Every scroll costs the same whether the user is at the top or a million rows down.',
        whyHi: 'Ek infinite-scroll feed `OFFSET` ke liye sabse bura case hai: users gehre scroll karte hain, aur har scroll current position ke upar sab kuch dobara sort karke discard karta hai. Page 50,000 tak database bees return karne ko ek million rows order kar raha hai, har scroll event par. Keyset pagination `WHERE (created, id) < cursor` se filter karta hai aur — `(created, id)` par ek index ke saath — seedhe position par seek karke bees rows padhta hai.',
      },
      {
        wrong: `# keyset by a non-unique column, no tiebreak
qs = Event.objects.order_by("-happened_at")
last = page[-1]
next_page = qs.filter(happened_at__lt=last.happened_at)[:20]
# if 15 events share last.happened_at, the other 14 are silently skipped`,
        right: `qs = Event.objects.order_by("-happened_at", "-id")
last = page[-1]
next_page = qs.filter(
    Q(happened_at__lt=last.happened_at) |
    Q(happened_at=last.happened_at, id__lt=last.id)     # continue within the tie group
)[:20]`,
        why: 'Paginating on a column that is not unique — a timestamp, a score, a name — means the boundary between pages can fall in the middle of a group of equal values. `happened_at < last.happened_at` jumps past every other row with that same timestamp; `<=` instead re-includes the boundary row and can loop. The only correct fix is to extend the sort key with a unique column (the pk) so the ordering is a *total order*, and write the two-part condition: strictly-less on the first key, OR equal-on-first AND strictly-less on the tiebreak. Then every row is visited exactly once regardless of duplicates.',
        whyHi: 'Ek aise column par paginate karna jo unique nahi hai — ek timestamp, ek score, ek name — ka matlab pages ke beech ki boundary equal values ke ek group ke beech mein gir sakti hai. `happened_at < last.happened_at` us same timestamp waali har doosri row ko kood jaata hai; `<=` badle boundary row ko phir shamil karta hai aur loop kar sakta hai. Sahi fix sort key ko ek unique column (pk) se extend karna hai taaki ordering ek *total order* ho.',
      },
      {
        wrong: `class FeedPagination(CursorPagination):
    page_size = 20
    # no ordering set

# -> raises: "Cursor pagination requires an ordering" (or silently uses a bad default)`,
        right: `class FeedPagination(CursorPagination):
    page_size = 20
    ordering = "-created"            # a real, indexed, mostly-monotonic column
    # DRF appends the pk as a tiebreak automatically`,
        why: '`CursorPagination` needs a deterministic ordering to define "the row after this one" — without `ordering` it cannot build the cursor and it errors. The ordering column should be one that is (a) indexed, or every page is a scan, (b) roughly monotonic and immutable — `created` or an auto-increment id, not `updated_at` (which changes, so a row can move and be seen twice or missed) and not a mutable `score`. DRF adds the primary key as the final tiebreak so the total-order requirement is met automatically.',
        whyHi: '`CursorPagination` ko "is ke baad ki row" define karne ke liye ek deterministic ordering chahiye — `ordering` ke bina ye cursor nahi bana sakta aur error deta hai. Ordering column aisa hona chahiye jo (a) indexed ho, (b) lगbhag monotonic aur immutable — `created` ya ek auto-increment id, `updated_at` nahi (jo badalta hai). DRF primary key ko final tiebreak ke roop mein add karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every infinite-scroll feed and "load more" list** — activity streams, notifications, comments, search results past page 1 — on keyset pagination with a `(created, id)` composite index and an opaque `after` cursor, so the 500th page is as fast as the first.',
        hi: '**Har infinite-scroll feed aur "load more" list** — activity streams, notifications, comments, page 1 ke baad search results — ek `(created, id)` composite index aur ek opaque `after` cursor ke saath keyset pagination par, taaki 500vaan page pehle jitna tez ho.',
      },
      {
        en: '**API sync endpoints (`GET /changes?since=<cursor>`)** — a client walking the entire dataset to build a local copy uses `CursorPagination` ordered by `(updated_at, id)` with the cursor persisted between runs; `OFFSET` would make a full sync quadratic in the number of pages.',
        hi: '**API sync endpoints (`GET /changes?since=<cursor>`)** — ek client jo ek local copy banane ko poora dataset walk karta hai `(updated_at, id)` se ordered `CursorPagination` istemal karta hai cursor runs ke beech persisted; `OFFSET` ek full sync ko pages ki sankhya mein quadratic bana deta.',
      },
      {
        en: '**"Export by paging" scripts and admin bulk tools** — replaced with keyset iteration (or `.iterator()` directly, lesson 2) after someone notices a nightly job that pages through 2M rows with `OFFSET` is doing O(n^2) total row reads and pinning a DB core for an hour.',
        hi: '**"Export by paging" scripts aur admin bulk tools** — keyset iteration se replace kiya gaya (ya seedhe `.iterator()`, lesson 2) jab koi notice karta hai ki ek nightly job jo `OFFSET` se 2M rows page karta hai O(n^2) total row reads kar raha hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does `LIMIT/OFFSET` pagination get slower on deeper pages, and how does keyset pagination avoid it?',
        qHi: '`LIMIT/OFFSET` pagination gehre pages par dheemi kyun ho jaati hai, aur keyset pagination ise kaise avoid karti hai?',
        a: 'OFFSET k does not mean "seek to row k" — SQL has no way to locate the k-th row of an ordered result without first producing rows 1 through k. So the database evaluates the WHERE, orders the matching rows, counts off k of them and throws them away, and returns the next n. The cost is proportional to k plus n. Page 1 with OFFSET 0 is instant; page 10,000 with OFFSET 200,000 makes the database read and order 200,020 rows to hand back 20, and it does that on every request for that page. A deep-paging crawler or an export-by-paging script turns this into serious, mysterious-looking database load. Keyset pagination, also called seek pagination, replaces "skip k rows" with "give me the rows ordered after the last one I saw". You remember the sort-key values of the last row on the current page — say created and id — and the next query filters WHERE created is less than that, OR created equals it AND id is less than that. With a composite index on the ordering tuple, the database seeks directly to that position in the index and reads n entries — the cost is the page size, identical whether it is page 2 or page 200,000. The price is that you lose random access: there is no jump-to-page-47 because the cursor only knows the last row, you only get next and, with a reversed query, previous. You also usually drop the total count, since COUNT over a big filtered set is expensive on its own. That trade is right for infinite scroll, load-more lists, and API cursors, and wrong for a numbered pager on a small table.',
        aHi: 'OFFSET k ka matlab "row k par seek karo" nahi hai — SQL ke paas pehle rows 1 se k produce kiye bina ek ordered result ki k-vi row locate karne ka koi tareeka nahi. Toh database WHERE evaluate karta hai, matching rows order karta hai, unme se k gin kar phenk deta hai, aur agli n return karta hai. Cost k plus n ke proportional hai. OFFSET 0 ke saath page 1 turant; OFFSET 200,000 ke saath page 10,000 database ko 20 wapas dene ko 200,020 rows padhwaata aur order karwaata hai, aur ye us page ke liye har request par hota hai. Keyset pagination "k rows skip karo" ko "aakhri jo maine dekhi uske baad ordered rows do" se replace karti hai. Aap current page ki aakhri row ke sort-key values yaad rakhte ho — created aur id — aur agli query WHERE created us se kam, YA created barabar AUR id us se kam se filter karti hai. Ordering tuple par ek composite index ke saath, database seedhe us position par seek karke n entries padhta hai — cost page size hai. Keemat ye hai ki aap random access khote ho: koi jump-to-page-47 nahi. Aap total count bhi aksar chhod dete ho.',
      },
      {
        q: 'Why is a unique tiebreak column essential for keyset pagination?',
        qHi: 'Keyset pagination ke liye ek unique tiebreak column zaroori kyun hai?',
        a: 'Keyset pagination works by filtering for rows that come strictly after a remembered cursor position in the sort order. That only produces a correct, complete, non-repeating walk if the sort order is a total order — meaning no two rows compare as equal. If you paginate by a column that can have duplicates, like a timestamp or a score or a name, the boundary between one page and the next can land in the middle of a group of rows that all share that value. Suppose the last row of page one has created equal to some value T, and fifteen other rows also have created equal to T. If the next page filters created strictly less than T, all fifteen of those rows are silently skipped — the user never sees them. If instead you filter created less than or equal to T to avoid skipping, you re-include the boundary row and can loop or show duplicates. There is no single-column comparison that both continues within the tie group and does not repeat the boundary. The fix is to append a column that is unique — almost always the primary key — so the effective sort key is the pair (created, id), which is a total order because id breaks every tie. The filter then becomes a two-part condition: created strictly less than the cursor\'s created, OR created equal to it AND id strictly less than the cursor\'s id. That visits every row exactly once, across duplicate timestamps, and stays correct even if rows are inserted or deleted between page requests. DRF\'s CursorPagination appends the pk for exactly this reason.',
        aHi: 'Keyset pagination sort order mein ek yaad rakhi gayi cursor position ke baad strictly aane waali rows ke liye filter karke kaam karti hai. Ye sirf tabhi ek sahi, poora, non-repeating walk produce karta hai agar sort order ek total order hai — matlab koi do rows barabar compare nahi karti. Agar aap ek aise column se paginate karte ho jismein duplicates ho sakte hain, jaise ek timestamp ya score ya name, ek page aur agle ke beech ki boundary un rows ke ek group ke beech mein gir sakti hai jo sab wo value share karti hain. Maan lo page ek ki aakhri row ka created kisi value T ke barabar hai, aur pandrah doosri rows ka bhi created T ke barabar hai. Agar agla page created strictly T se kam filter karta hai, un pandrah rows sabhi chupchaap skip ho jaati hain. Agar aap skip se bachne ko created T se kam ya barabar filter karte ho, aap boundary row phir shamil karte ho aur loop kar sakte ho. Fix ek unique column jodna hai — lगbhag hamesha primary key — taaki effective sort key jodi (created, id) ho, jo ek total order hai kyunki id har tie todta hai. Filter phir ek do-hisse ki condition ban jaata hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django (SQLite). Model `Article` (`title`, `rank` int) with `rank = i // 2` for `i` in `range(200)` (pairs share a rank). Sort order `("-rank", "-id")`. (a) Take the OFFSET page `Article.objects.order_by(*order)[100:110]` inside `CaptureQueriesContext` and assert the SQL contains `"OFFSET 100"`. (b) Write `page_after(cursor)` doing keyset with `Q(rank__lt=r) | Q(rank=r, id__lt=i)`; walk 6 pages of 10 from `cursor=None`. Assert the 6th keyset page has the **same ids** as the OFFSET page.',
        taskHi: 'Standalone Django (SQLite). `Article` (`title`, `rank`) model, `rank = i // 2`. Sort `("-rank", "-id")`. (a) OFFSET page `[100:110]` `CaptureQueriesContext` mein lo, SQL mein `"OFFSET 100"` assert karo. (b) `page_after(cursor)` keyset se likho; `cursor=None` se 6 pages of 10 walk karo. Assert 6vaan keyset page ke wahi ids hain jo OFFSET page ke.',
        hint: '`from django.db.models import Q`. Keyset filter: `Q(rank__lt=r) | Q(rank=r, id__lt=i)`, then `[:10]`. The cursor after each page is `(rows[-1].rank, rows[-1].id)`.',
        hintHi: '`from django.db.models import Q`. Keyset filter: `Q(rank__lt=r) | Q(rank=r, id__lt=i)`, phir `[:10]`. Har page ke baad cursor `(rows[-1].rank, rows[-1].id)` hai.',
      },
      {
        task: 'Model `Task` (`name`, `priority` int), 12 rows with only 3 distinct priorities (many ties). Page size 4. (a) `broken_page(after_priority)` filtering `priority__lt=after_priority` only; walk 3 pages and collect names. Assert it sees FEWER than 12 (tie groups skipped). (b) `fixed_page(cursor)` filtering `Q(priority__lt=pr) | Q(priority=pr, id__gt=id_)` with `order_by("-priority", "id")`; walk 3 pages. Assert it sees all 12, no repeats.',
        taskHi: '`Task` (`name`, `priority`) model, 12 rows sirf 3 distinct priorities ke saath (kई ties). Page size 4. (a) sirf `priority__lt=after_priority` filter karne wala `broken_page`; 3 pages walk karo. Assert 12 se KAM dikhta hai. (b) `Q(priority__lt=pr) | Q(priority=pr, id__gt=id_)` filter karne wala `fixed_page`; 3 pages walk karo. Assert saare 12, koi repeat nahi.',
        hint: 'The broken version\'s cursor is a bare `priority`; when the last row of a page has `priority=5` and 5 other rows also have `priority=5`, `priority__lt=5` jumps over all of them. The fix carries `(priority, id)` and continues the tie group with `id__gt`.',
        hintHi: 'Broken version ka cursor ek bare `priority` hai; jab ek page ki aakhri row ka `priority=5` hai aur 5 doosri rows ka bhi `priority=5`, `priority__lt=5` un sab ko kood jaata hai. Fix `(priority, id)` carry karke tie group ko `id__gt` se continue karta hai.',
      },
      {
        task: 'Standalone DRF (no auth). Model `Post` (`body`, `created` int), seed 25. A `CursorPagination` subclass with `page_size = 10`, `ordering = "-created"`. A `ListAPIView` using it. With `APIClient`: `GET /feed/` -> assert the response JSON has NO `"count"` key, has 10 results, and `next` is a URL containing `cursor=`. Follow `next` -> assert the next 10 results and that `previous` is now non-null.',
        taskHi: 'Standalone DRF (no auth). `Post` (`body`, `created`) model, 25 seed. `page_size = 10`, `ordering = "-created"` waali `CursorPagination` subclass. Ise use karne wala `ListAPIView`. `APIClient` se: `GET /feed/` -> response JSON mein koi `"count"` key NAHI, 10 results, `next` ek URL jismein `cursor=` hai. `next` follow karo -> agle 10 results aur `previous` ab non-null.',
        hint: '`from rest_framework.pagination import CursorPagination`. `ordering` is required. `CursorPagination` responses are `{results, next, previous}` — deliberately no `count` (that would need a `COUNT(*)`).',
        hintHi: '`from rest_framework.pagination import CursorPagination`. `ordering` zaroori hai. `CursorPagination` responses `{results, next, previous}` hain — jaan-boojhkar koi `count` nahi.',
      },
    ],

    keyTakeaways: [
      '`LIMIT n OFFSET k` is NOT "seek to row k" — the DB evaluates WHERE, orders the matches, counts off `k` rows and DISCARDS them, returns the next `n`. Cost ∝ `k + n`. Page 10,000 reads+sorts 200,020 rows to return 20, every request.',
      'Keyset (seek) pagination: remember the last row\'s sort-key values, filter `WHERE (sort_key) < cursor` for the next page. With a composite index on the ordering tuple it is an index range scan -> O(page_size), identical cost at any depth.',
      'The condition for `ORDER BY -created, -id` is `Q(created__lt=c) | Q(created=c, id__lt=i)` — the written-out form of the row-value comparison `(created, id) < (c, i)`.',
      'A UNIQUE tiebreak (usually the pk) is MANDATORY: paginating on a non-unique column (timestamp/score/name) with `<` SKIPS the rest of a tie group; with `<=` REPEATS the boundary. Append the pk so the sort is a TOTAL ORDER.',
      'What you give up: no "jump to page 47" (only next / reversed-query previous), no cheap total `count`, and the client carries an opaque cursor token instead of a page number.',
      'DRF `CursorPagination`: set `ordering` (REQUIRED — indexed, monotonic, immutable like `created`/id, NOT `updated_at`), `page_size`. Returns `{results, next, previous}` with a base64 `cursor` and NO `count`. DRF adds the pk tiebreak.',
      '`PageNumberPagination`/`LimitOffsetPagination` = OFFSET-based, has a count, allows page jumps, degrades deep. `CursorPagination` = keyset, no count, O(1)/page, forward/back only. Use cursor for feeds/streams/sync; page-number only for small tables with real page-jump needs.',
      'The composite index matching `(ORDER BY columns)` is the whole point — keyset without it still scans + sorts, no faster than OFFSET.',
    ],
    keyTakeawaysHi: [
      '`LIMIT n OFFSET k` "row k par seek" NAHI hai — DB WHERE evaluate karta hai, matches order karta hai, `k` rows gin kar DISCARD karta hai, agli `n` return karta hai. Cost ∝ `k + n`. Page 10,000 20 return karne ko 200,020 rows padhta+sort karta hai, har request.',
      'Keyset (seek) pagination: aakhri row ke sort-key values yaad rakho, agle page ke liye `WHERE (sort_key) < cursor` filter karo. Ordering tuple par ek composite index ke saath ye ek index range scan hai -> O(page_size), kisi bhi depth par same cost.',
      '`ORDER BY -created, -id` ke liye condition `Q(created__lt=c) | Q(created=c, id__lt=i)` hai — row-value comparison `(created, id) < (c, i)` ka likha hua roop.',
      'Ek UNIQUE tiebreak (aksar pk) ZAROORI hai: ek non-unique column (timestamp/score/name) par `<` se paginate karna ek tie group ka baaki SKIP karta hai; `<=` se boundary REPEAT karta hai. pk jodo taaki sort ek TOTAL ORDER ho.',
      'Aap kya khote ho: koi "page 47 par jao" nahi (sirf next / reversed-query previous), koi sasta total `count` nahi, aur client ek page number ke badle ek opaque cursor token carry karta hai.',
      'DRF `CursorPagination`: `ordering` set karo (ZAROORI — indexed, monotonic, immutable jaise `created`/id, `updated_at` NAHI), `page_size`. `{results, next, previous}` ek base64 `cursor` ke saath aur koi `count` NAHI return karta hai. DRF pk tiebreak add karta hai.',
      '`PageNumberPagination`/`LimitOffsetPagination` = OFFSET-based, count hai, page jumps allow, deep degrades. `CursorPagination` = keyset, koi count nahi, prati page O(1), sirf aage/peeche. Feeds/streams/sync ke liye cursor.',
      '`(ORDER BY columns)` se match karta composite index poora point hai — iske bina keyset abhi bhi scan + sort karta hai, OFFSET se tez nahi.',
    ],
  },

  {
    slug: 'dj-read-replicas-and-db-routers',
    title: 'Read Replicas & Database Routers',
    titleHi: 'Read Replicas & Database Routers',
    description: 'A read replica is a second database that streams a copy of every change from the primary. Point your read-heavy queries at it and the primary is freed up for writes. Django connects to multiple databases through `DATABASES` aliases and a `DATABASE_ROUTERS` class — but replication lag means "read your own write" needs care.',
    descriptionHi: 'Ek read replica ek doosra database hai jo primary se har change ki ek copy stream karta hai. Apni read-heavy queries ise point karo aur primary writes ke liye free ho jaata hai. Django `DATABASES` aliases aur ek `DATABASE_ROUTERS` class ke zariye kई databases se connect karta hai — par replication lag ka matlab "apna hi write padho" ko dhyaan chahiye.',
    difficulty: 'HARD',
    duration: 20,
    order: 5,

    analogy: {
      en: '**A busy news desk: one editor holds the master copy and makes every edit, while photocopiers around the building keep near-live duplicates for everyone who just needs to read.** The master editor (the primary database) is the only one who can change anything, and they are swamped — every correction, every new story goes through them. So you install copiers (read replicas) that continuously receive the editor\'s changes and let hundreds of readers grab a copy without queuing at the editor\'s desk. Reads scale out; the editor gets breathing room for writes. Two things to watch. First, the copiers are always a few seconds behind — a story the editor just filed may not be on the copier yet (replication lag). So if a reporter submits an edit and then immediately re-reads it off a copier, they might see the old version and think their edit vanished — for that reader, right after their own write, you send them back to the master copy. Second, a copier is read-only; anyone who tries to scribble a correction on a photocopy is confused about how the newsroom works (a write routed to a replica errors).',
      hi: '**Ek vyast news desk: ek editor master copy rakhta hai aur har edit karta hai, jabki building ke aas-paas photocopiers har us vyakti ke liye near-live duplicates rakhti hain jise sirf padhna hai.** Master editor (primary database) hi ek hai jo kuch bhi badal sakta hai, aur wo doobe hue hain. Toh aap copiers (read replicas) lagate ho jo lagataar editor ke changes receive karti hain aur sainkdon readers ko editor ke desk par queue kiye bina ek copy lene deti hain. Reads scale out; editor ko writes ke liye saans milti hai. Do cheezein dekhni hain. Pehli, copiers hamesha kuch second peeche hain — ek story jo editor ne abhi file ki copier par abhi nahi ho sakti (replication lag). Toh agar ek reporter ek edit submit karke turant ise ek copier se dobara padhta hai, wo purana version dekh sakta hai aur soch sakta hai ki uska edit gायab ho gaya — us reader ke liye, uske apne write ke theek baad, aap use master copy par wapas bhejte ho. Doosri, ek copier read-only hai.',
    },

    simple: `**Multiple databases in \`DATABASES\`**

\`\`\`python
DATABASES = {
    "default": {                              # the PRIMARY -- all writes
        "ENGINE": "django.db.backends.postgresql", "HOST": "primary.db", ...
    },
    "replica": {                              # a READ REPLICA -- reads only
        "ENGINE": "django.db.backends.postgresql", "HOST": "replica.db", ...
        "TEST": {"MIRROR": "default"},        # tests use one DB; don't try to create the replica
    },
}
DATABASE_ROUTERS = ["myapp.routers.PrimaryReplicaRouter"]
\`\`\`

**A router: where does each query go?**

\`\`\`python
import random

class PrimaryReplicaRouter:
    def db_for_read(self, model, **hints):
        return "replica"                      # (or random.choice(["replica", "replica2"]))

    def db_for_write(self, model, **hints):
        return "default"                      # ALL writes go to the primary

    def allow_relation(self, obj1, obj2, **hints):
        return True                           # primary + replica hold the same data

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return db == "default"                # only ever migrate the primary
\`\`\`

\`\`\`
db_for_read     which alias a SELECT uses          -> "replica"
db_for_write    which alias an INSERT/UPDATE/DELETE uses  -> "default"
allow_relation  may objs from db A and db B relate? -> True for primary/replica pairs
allow_migrate   run this migration on this db?      -> only "default"
routers are tried in order; first non-None wins; None -> fall through / then "default"
\`\`\`

**The read-your-writes problem**

\`\`\`python
order = Order.objects.create(...)             # -> primary
# ... redirect ...
Order.objects.get(pk=order.pk)                # -> replica -- may 404 if replication lags!
\`\`\`

\`\`\`python
# fix: force the just-written read to the primary
Order.objects.using("default").get(pk=order.pk)

# or pin the whole request/user to the primary for a few seconds after any write
# (a middleware / session flag: "wrote_recently" -> route reads to default)
\`\`\`

**\`.using(alias)\` — override the router explicitly**

\`\`\`python
Report.objects.using("replica").filter(...)           # force a read to the replica
obj.save(using="default")                              # force a write target
with transaction.atomic(using="default"): ...          # transactions are PER database
\`\`\`

\`\`\`
each alias has its OWN connection, its OWN transaction, its OWN CONN_MAX_AGE
a transaction on "default" does not span "replica"
select_related / prefetch_related stay on the queryset's alias
\`\`\``,

    simpleHi: `**\`DATABASES\` mein kई databases**

\`\`\`python
DATABASES = {
    "default": {                              # PRIMARY -- saare writes
        "ENGINE": "django.db.backends.postgresql", "HOST": "primary.db", ...
    },
    "replica": {                              # ek READ REPLICA -- sirf reads
        "ENGINE": "django.db.backends.postgresql", "HOST": "replica.db", ...
        "TEST": {"MIRROR": "default"},        # tests ek DB istemal karte hain
    },
}
DATABASE_ROUTERS = ["myapp.routers.PrimaryReplicaRouter"]
\`\`\`

**Ek router: har query kahaan jaati hai?**

\`\`\`python
import random

class PrimaryReplicaRouter:
    def db_for_read(self, model, **hints):
        return "replica"

    def db_for_write(self, model, **hints):
        return "default"                      # SAARE writes primary par jaate hain

    def allow_relation(self, obj1, obj2, **hints):
        return True                           # primary + replica same data rakhte hain

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return db == "default"                # sirf primary migrate karo
\`\`\`

\`\`\`
db_for_read     ek SELECT kaunsa alias istemal karta hai       -> "replica"
db_for_write    ek INSERT/UPDATE/DELETE kaunsa alias istemal karta hai  -> "default"
allow_relation  kya db A aur db B ke objs relate kar sakte hain? -> primary/replica jodi ke liye True
allow_migrate   is db par ye migration chalao?                  -> sirf "default"
routers order mein try hote hain; pehla non-None jeetta hai; None -> fall through / phir "default"
\`\`\`

**Read-your-writes problem**

\`\`\`python
order = Order.objects.create(...)             # -> primary
# ... redirect ...
Order.objects.get(pk=order.pk)                # -> replica -- 404 kar sakta hai agar replication lag kare!
\`\`\`

\`\`\`python
# fix: abhi-likhe read ko primary par force karo
Order.objects.using("default").get(pk=order.pk)

# ya poore request/user ko kisi bhi write ke baad kuch second ke liye primary par pin karo
\`\`\`

**\`.using(alias)\` — router ko explicitly override karo**

\`\`\`python
Report.objects.using("replica").filter(...)           # ek read replica par force karo
obj.save(using="default")                              # ek write target force karo
with transaction.atomic(using="default"): ...          # transactions PRATI database hain
\`\`\`

\`\`\`
har alias ka APNA connection, APNA transaction, APNA CONN_MAX_AGE hai
"default" par ek transaction "replica" ko span nahi karta
select_related / prefetch_related queryset ke alias par rehte hain
\`\`\``,

    content: `## Why a read replica

A single database serves all reads and all writes. Reads usually dominate — a typical web app is 90%+ \`SELECT\`. A **read replica** is a second database server that receives a continuous stream of the primary's changes (via the database's own replication) and stays a near-live copy. You send read queries there, and the primary only handles writes plus the reads that must be perfectly current. This scales reads horizontally (add more replicas) without touching the write path, and isolates heavy analytical scans from production write traffic.

The replica is **read-only** — you cannot write to it — and it is **slightly behind** the primary (milliseconds normally, seconds under load, minutes if something is wrong). That lag is the entire source of complexity.

## \`DATABASES\` and \`DATABASE_ROUTERS\`

\`DATABASES\` is a dict of aliases. \`"default"\` is special — it is used when no router returns an alias, and by \`.objects\` without \`.using()\`. Add a \`"replica"\` alias pointing at the replica host.

\`DATABASE_ROUTERS\` is a list of router objects. For each query Django asks each router in turn; the first non-\`None\` answer wins, and if all return \`None\` it falls back to \`"default"\` (or the queryset's \`.using()\`). A router implements up to four methods:

- **\`db_for_read(model, **hints)\`** — the alias for \`SELECT\`s. Return \`"replica"\` (or pick randomly among several replicas).
- **\`db_for_write(model, **hints)\`** — the alias for \`INSERT\`/\`UPDATE\`/\`DELETE\`. Return \`"default"\`.
- **\`allow_relation(obj1, obj2, **hints)\`** — may these two objects have a FK/M2M between them? For a primary + its replicas (same data), \`return True\`.
- **\`allow_migrate(db, app_label, model_name=None, **hints)\`** — should this migration run against this alias? Return \`db == "default"\` so \`migrate\` only ever touches the primary; the replica gets the schema through replication.

\`hints\` sometimes carries \`instance\` — useful for routing by tenant or sharding by a field.

## The read-your-writes problem

This is the one that bites in production. A request writes a row (routed to the primary), returns a redirect, and the next request reads that row — routed to the **replica**, which may not have replicated the change yet. The user sees a \`404\`, or a stale value, or their just-submitted comment missing. It is intermittent and load-dependent, which makes it maddening to debug.

Fixes, roughly in order of preference:

1. **Route the specific just-written read to the primary:** \`Order.objects.using("default").get(pk=new_id)\`. Precise, but you have to know which reads follow a write.
2. **Pin the request/session to the primary after a write.** A middleware sets a short-lived flag (a signed cookie, a session key, a cache entry keyed by user) whenever a write happens; while the flag is set, \`db_for_read\` returns \`"default"\`. Simple and covers the redirect-then-read pattern.
3. **Use \`db_for_read\` hints** to send reads of recently-written models to the primary.
4. **Accept the lag** for data where staleness is harmless (a list page, a search index).

## Everything is per-alias

Each database alias has its **own connection object, its own transaction, its own \`CONN_MAX_AGE\`**. Consequences:

- \`transaction.atomic()\` wraps **one** alias — \`transaction.atomic(using="default")\`. There is no cross-database transaction; a write to \`"default"\` and a write to another primary are two independent commits (you need the outbox pattern or 2PC for atomicity across them).
- \`.using("replica")\` on a queryset forces that alias for the whole chain, including \`select_related\`/\`prefetch_related\`.
- \`obj.save(using="...")\` and \`obj.delete(using="...")\` force the write target.
- Connection health checks, pooling, and \`CONN_MAX_AGE\` are configured independently per alias.

## Testing

Django's test runner creates a test database per alias. For a replica that mirrors the primary, set \`"TEST": {"MIRROR": "default"}\` so the runner does **not** create a separate test replica — both aliases point at the one test database, and your router logic still runs. Without \`MIRROR\`, tests either fail to set up or silently diverge.

## When you do not need this

Read replicas solve a real scaling problem but add real complexity (lag bugs, routing logic, more infrastructure). A single well-indexed primary with connection pooling (Module 7) handles a lot of load. Reach for replicas when the primary's read load is genuinely the bottleneck, or when you need to isolate analytics/reporting/export scans from the transactional workload — not by default.`,

    contentHi: `## Ek read replica kyun

Ek single database saare reads aur saare writes serve karta hai. Reads aksar haavi hote hain — ek typical web app 90%+ \`SELECT\` hai. Ek **read replica** ek doosra database server hai jo primary ke changes ki ek lagataar stream receive karta hai (database ke apne replication ke zariye) aur ek near-live copy rehta hai. Aap read queries wahaan bhejte ho, aur primary sirf writes plus wo reads handle karta hai jo perfectly current hone chahiye. Ye reads ko horizontally scale karta hai (aur replicas add karo) aur bhaari analytical scans ko production write traffic se isolate karta hai.

Replica **read-only** hai — aap ise write nahi kar sakte — aur ye primary se **thoda peeche** hai (normally milliseconds, load ke tahat seconds). Wo lag hi poori complexity ka source hai.

## \`DATABASES\` aur \`DATABASE_ROUTERS\`

\`DATABASES\` aliases ka ek dict hai. \`"default"\` special hai — ise tab istemal kiya jaata hai jab koi router ek alias return nahi karta.

\`DATABASE_ROUTERS\` router objects ki ek list hai. Har query ke liye Django har router se baari-baari poochta hai; pehla non-\`None\` jawab jeetta hai. Ek router upto chaar methods implement karta hai:

- **\`db_for_read\`** — \`SELECT\`s ke liye alias. \`"replica"\` return karo.
- **\`db_for_write\`** — \`INSERT\`/\`UPDATE\`/\`DELETE\` ke liye alias. \`"default"\` return karo.
- **\`allow_relation\`** — kya in do objects ke beech ek FK/M2M ho sakta hai? Ek primary + iski replicas ke liye \`return True\`.
- **\`allow_migrate\`** — kya ye migration is alias ke against chalni chahiye? \`db == "default"\` return karo taaki \`migrate\` sirf primary ko chhue.

## Read-your-writes problem

Ye wo hai jo production mein kaatti hai. Ek request ek row likhta hai (primary par routed), ek redirect return karta hai, aur agla request us row ko padhta hai — **replica** par routed, jisne shayad abhi change replicate nahi kiya. User ek \`404\` dekhta hai, ya ek stale value.

Fixes, mote taur par preference ke order mein:

1. **Vishisht abhi-likhe read ko primary par route karo:** \`Order.objects.using("default").get(pk=new_id)\`.
2. **Ek write ke baad request/session ko primary par pin karo.** Ek middleware jab bhi ek write hota hai ek short-lived flag set karta hai; jab tak flag set hai, \`db_for_read\` \`"default"\` return karta hai.
3. **\`db_for_read\` hints istemal karo** haal hi mein likhe models ke reads primary par bhejne ko.
4. **Lag accept karo** us data ke liye jahaan staleness harmless hai.

## Sab kuch prati-alias hai

Har database alias ka **apna connection object, apna transaction, apna \`CONN_MAX_AGE\`** hai:

- \`transaction.atomic()\` **ek** alias wrap karta hai — \`transaction.atomic(using="default")\`. Koi cross-database transaction nahi.
- ek queryset par \`.using("replica")\` poore chain ke liye wo alias force karta hai.
- \`obj.save(using="...")\` write target force karta hai.

## Testing

Django ka test runner prati alias ek test database banata hai. Ek replica ke liye jo primary mirror karta hai, \`"TEST": {"MIRROR": "default"}\` set karo taaki runner ek alag test replica **na banaye**.

## Jab aapko iski zaroorat nahi

Read replicas ek asli scaling problem solve karte hain par asli complexity add karte hain (lag bugs, routing logic, zyada infrastructure). Connection pooling (Module 7) ke saath ek single well-indexed primary bahut load handle karta hai. Replicas ke liye tab pahuncho jab primary ka read load sach mein bottleneck hai, ya jab aapko analytics/reporting scans ko transactional workload se isolate karna hai — default se nahi.`,

    examples: [
      {
        title: 'A router sends reads to the replica and writes to the primary',
        titleHi: 'Ek router reads replica ko aur writes primary ko bhejta hai',
        code: `import django, tempfile, os
from django.conf import settings
_d = tempfile.mkdtemp()
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={
        "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": os.path.join(_d, "primary.sqlite3")},
        "replica": {"ENGINE": "django.db.backends.sqlite3", "NAME": os.path.join(_d, "replica.sqlite3")},
    },
    DATABASE_ROUTERS=["__main__.Router"],
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connections, router

class Router:
    def db_for_read(self, model, **h):   return "replica"
    def db_for_write(self, model, **h):  return "default"
    def allow_relation(self, a, b, **h): return True
    def allow_migrate(self, db, app_label, **h): return db == "default"

class Note(models.Model):
    text = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

for alias in ("default", "replica"):
    with connections[alias].schema_editor() as se:
        se.create_model(Note)

# a write -> routed to "default" (router.db_for_write is what create()/save() consult)
n = Note.objects.create(text="hello")
print("write went to:", router.db_for_write(Note), "(create uses db_for_write)")

# a read -> routed to "replica"
print("read routes to:", Note.objects.all().db)

# the replica is a SEPARATE sqlite file -- nothing replicated it, so it's empty
print("rows visible via default manager (replica):", Note.objects.count())
print("rows actually on primary:", Note.objects.using('default').count())

# force the read to the primary
print("rows via using('default'):", Note.objects.using("default").filter(text="hello").count())`,
        output: `write went to: default (create uses db_for_write)
read routes to: replica
rows visible via default manager (replica): 0
rows actually on primary: 1
rows via using('default'): 1`,
        explain: 'The router sends every write to default and every read to replica. So create() lands on the primary (router.db_for_write returns default), but the default-manager read is routed to the replica alias -- which here is a separate, empty sqlite file that nothing has replicated into, so it reports zero rows. Only Note.objects.using("default") sees the row. This is exactly the shape of a real primary-replica setup with the replica caught up to nothing; in production the replica would catch up within milliseconds, but the routing is identical.',
        explainHi: 'Router har write default ko aur har read replica ko bhejta hai. Toh create() primary par land karta hai (router.db_for_write default return karta hai), par default-manager read replica alias par routed hai -- jo yahan ek alag, khali sqlite file hai jismein kuch replicate nahi hua, toh ye zero rows report karta hai. Sirf Note.objects.using("default") row ko dekhta hai. Production mein replica milliseconds ke andar catch up karta, par routing same hai.',
      },
      {
        title: 'Read-your-writes: the replica lags, so the follow-up read misses',
        titleHi: 'Read-your-writes: replica lag karta hai, toh follow-up read miss karta hai',
        code: `import django, tempfile, os
from django.conf import settings
_d = tempfile.mkdtemp()
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={
        "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": os.path.join(_d, "p.sqlite3")},
        "replica": {"ENGINE": "django.db.backends.sqlite3", "NAME": os.path.join(_d, "r.sqlite3")},
    },
    DATABASE_ROUTERS=["__main__.Router"],
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connections

class Router:
    def db_for_read(self, model, **h):   return "replica"
    def db_for_write(self, model, **h):  return "default"
    def allow_relation(self, a, b, **h): return True
    def allow_migrate(self, db, app_label, **h): return db == "default"

class Comment(models.Model):
    body = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

for alias in ("default", "replica"):
    with connections[alias].schema_editor() as se:
        se.create_model(Comment)

def replicate():
    """Pretend to be the DB's replication stream: copy primary -> replica."""
    rows = list(Comment.objects.using("default").values_list("id", "body"))
    Comment.objects.using("replica").all().delete()
    Comment.objects.using("replica").bulk_create([Comment(id=i, body=b) for i, b in rows])

# user posts a comment (write -> primary)
c = Comment.objects.create(body="first post!")

# immediately re-read it (router sends this to the replica) -- BEFORE replication caught up
print("read-after-write via router (replica):",
      Comment.objects.filter(pk=c.pk).first())         # None! -- looks like the write was lost

# the safe read: force it to the primary
print("read-after-write via using('default'):",
      Comment.objects.using("default").get(pk=c.pk).body)

# ... replication catches up ...
replicate()
print("after replication, router read works:",
      Comment.objects.filter(pk=c.pk).first().body)`,
        output: `read-after-write via router (replica): None
read-after-write via using('default'): first post!
after replication, router read works: first post!`,
        explain: 'The user creates a comment, which the router sends to the primary. The immediate re-read is routed to the replica -- and replication has not run yet (simulated here by not calling replicate()), so the replica does not have the row and the read returns None. To the user it looks like their post vanished. The safe read forces the primary with using("default") and finds it. After replicate() copies the data across, the ordinary router-routed read works too. In production this is the read-your-writes bug: fix it by pinning recently-written reads (or the whole user, briefly) to the primary.',
        explainHi: 'User ek comment banata hai, jise router primary ko bhejta hai. Turant re-read replica ko routed hai -- aur replication abhi nahi chala, toh replica ke paas row nahi hai aur read None return karta hai. User ko lagta hai unka post gायab ho gaya. Safe read using("default") se primary force karta hai aur ise dhoondh leta hai. replicate() ke data copy karne ke baad ordinary router-routed read bhi kaam karta hai. Production mein ye read-your-writes bug hai: ise haal hi mein likhe reads ko primary par pin karke fix karo.',
      },
      {
        title: 'Transactions and .using() are per-alias',
        titleHi: 'Transactions aur .using() prati-alias hain',
        code: `import django, tempfile, os
from django.conf import settings
_d = tempfile.mkdtemp()
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={
        "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": os.path.join(_d, "a.sqlite3")},
        "archive": {"ENGINE": "django.db.backends.sqlite3", "NAME": os.path.join(_d, "b.sqlite3")},
    },
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connections, transaction

class Row(models.Model):
    v = models.IntegerField()
    class Meta:
        app_label = "__main__"

for alias in ("default", "archive"):
    with connections[alias].schema_editor() as se:
        se.create_model(Row)

# a transaction on "default" does NOT cover "archive"
try:
    with transaction.atomic(using="default"):
        Row.objects.using("default").create(v=1)
        Row.objects.using("archive").create(v=99)      # committed on its OWN connection immediately
        raise RuntimeError("rollback default")
except RuntimeError:
    pass

print("default rows (rolled back):", Row.objects.using("default").count())
print("archive rows (NOT rolled back -- separate transaction):", Row.objects.using("archive").count())

# each alias has an independent connection
print("connections are distinct:",
      connections["default"] is not connections["archive"])`,
        output: `default rows (rolled back): 0
archive rows (NOT rolled back -- separate transaction): 1
connections are distinct: True`,
        explain: 'transaction.atomic(using="default") manages a transaction on the default connection only. The write to the archive alias inside that block runs on the archive connection, in autocommit, and is committed immediately -- the atomic block has no control over it. So when the RuntimeError rolls the default transaction back, the default row is gone but the archive row survives. There is no cross-database transaction in Django; each alias has its own connection and its own transaction. If two datastores must change atomically, co-locate them or use the transactional outbox pattern.',
        explainHi: 'transaction.atomic(using="default") sirf default connection par ek transaction manage karta hai. Us block ke andar archive alias ka write archive connection par chalta hai, autocommit mein, aur turant committed hota hai -- atomic block ka ispar koi control nahi. Toh jab RuntimeError default transaction ko roll back karta hai, default row chali jaati hai par archive row bach jaati hai. Django mein koi cross-database transaction nahi; har alias ka apna connection aur apna transaction hai.',
      },
    ],

    mistakes: [
      {
        wrong: `def create_comment(request):
    c = Comment.objects.create(post=post, body=request.POST["body"], author=request.user)
    return redirect("post_detail", pk=post.pk)

def post_detail(request, pk):
    post = Post.objects.get(pk=pk)
    comments = post.comments.all()             # -> replica; the new comment may not be there yet
    return render(request, "post.html", {"post": post, "comments": comments})
# user posts a comment, gets redirected, and their own comment is missing ~5% of the time`,
        right: `# middleware: after any write in a request, pin this user's reads to the primary briefly
class PrimaryAfterWriteMiddleware:
    def __call__(self, request):
        response = self.get_response(request)
        if request.method in ("POST", "PUT", "PATCH", "DELETE"):
            cache.set(f"pin_primary:{request.user.pk}", True, timeout=5)
        return response

class Router:
    def db_for_read(self, model, **hints):
        if cache.get(f"pin_primary:{get_current_user_pk()}"):
            return "default"
        return "replica"`,
        why: 'The redirect-then-read is the classic replication-lag bug: the write lands on the primary, the redirect fires faster than replication, and the follow-up read hits a replica that has not caught up — so the user does not see their own action. Routing the specific read to `using("default")` works if you can identify it, but a middleware that pins a user\'s reads to the primary for a few seconds after any write covers the pattern generally: recent writers read their own writes, everyone else still gets the replica.',
        whyHi: 'Redirect-then-read classic replication-lag bug hai: write primary par land karta hai, redirect replication se tez fire hota hai, aur follow-up read ek aise replica ko hit karta hai jo catch up nahi hua — toh user apna hi action nahi dekhta. Vishisht read ko `using("default")` par route karna kaam karta hai agar aap ise identify kar sakte ho, par ek middleware jo ek user ke reads ko kisi bhi write ke baad kuch second ke liye primary par pin karta hai pattern ko generally cover karta hai.',
      },
      {
        wrong: `class Router:
    def db_for_read(self, model, **hints):
        return "replica"
    def db_for_write(self, model, **hints):
        return "default"
    # allow_migrate not defined -> defaults to None -> Django migrates BOTH aliases
# migrate tries to CREATE tables on the replica, which is read-only -> errors,
# or (with a writable replica) creates a schema that then conflicts with replication`,
        right: `class Router:
    def db_for_read(self, model, **hints):  return "replica"
    def db_for_write(self, model, **hints): return "default"
    def allow_relation(self, a, b, **hints): return True
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return db == "default"              # the replica gets its schema via replication`,
        why: 'If `allow_migrate` returns `None` (the default when the method is absent), Django will attempt to run every migration against every alias, including the replica. A real read replica is read-only, so `migrate` errors out; a writable one ends up with a schema created by Django *and* changes arriving via replication, which conflict. The replica must get its schema the same way it gets its data — through replication from the primary — so `allow_migrate` has to return `db == "default"` (or `False` for the replica alias).',
        whyHi: 'Agar `allow_migrate` `None` return karta hai (method absent hone par default), Django har migration ko har alias ke against chalane ki koshish karega, replica sahit. Ek asli read replica read-only hai, toh `migrate` error karta hai; ek writable ek Django dwara banaya schema *aur* replication se aate changes ke saath khatam hota hai, jो conflict karte hain. Replica ko apna schema wahi tareeke se milna chahiye jaise ise apna data — primary se replication ke zariye.',
      },
      {
        wrong: `with transaction.atomic():                     # atomic() with no using= -> wraps "default" only
    order = Order.objects.create(...)          # -> default, inside the transaction
    AuditLog.objects.using("audit_db").create(action="order_created", order_id=order.id)
    charge_payment(order)                      # raises
# the order rolls back, but the AuditLog row on "audit_db" was already committed`,
        right: `# there is no cross-database transaction. Options:
# 1. keep the audit log in the same DB as the order (one transaction covers both)
# 2. write the audit event to an outbox table in "default" inside the txn, and a
#    worker moves committed outbox rows to "audit_db" (the transactional outbox pattern)
with transaction.atomic():
    order = Order.objects.create(...)
    Outbox.objects.create(topic="audit", payload={"action": "order_created"})
    charge_payment(order)`,
        why: '`transaction.atomic()` operates on exactly one database alias — the one you pass as `using=`, or `"default"`. Writes to any other alias inside that block run on their own connections and commit independently; a rollback of the `atomic()` block does not touch them. So an audit row on a separate database survives even though the order it describes was rolled back. Django has no distributed transaction. If two datastores must change atomically, either co-locate them in one database, or use the transactional outbox pattern: write an intent row in the same transaction as the business change, and a separate process delivers it after commit.',
        whyHi: '`transaction.atomic()` theek ek database alias par operate karta hai — jo aap `using=` ke roop mein pass karte ho, ya `"default"`. Us block ke andar kisi doosre alias ke writes apne connections par chalte hain aur swतंtra roop se commit hote hain; `atomic()` block ka ek rollback unhe nahi chhoota. Django ke paas koi distributed transaction nahi. Agar do datastores atomically badalne chahiye, ya unhe ek database mein co-locate karo, ya transactional outbox pattern istemal karo.',
      },
    ],

    realWorld: [
      {
        en: '**A primary + one or two read replicas, with a `PrimaryReplicaRouter` and a "pin to primary for 5s after a write" middleware** — reads scale out, the redirect-then-read pattern is safe, and `allow_migrate` locks migrations to the primary. `TEST: {MIRROR: default}` on the replica so the suite runs against one DB.',
        hi: '**Ek primary + ek-do read replicas, ek `PrimaryReplicaRouter` aur ek "write ke baad 5s ke liye primary par pin" middleware ke saath** — reads scale out, redirect-then-read pattern surakshit, aur `allow_migrate` migrations ko primary par lock karta hai. Replica par `TEST: {MIRROR: default}`.',
      },
      {
        en: '**A dedicated `analytics` replica for the reporting/BI/export workload** — heavy `.values().annotate()` GROUP BY scans and `.iterator()` exports (lessons 2-3) all `.using("analytics")`, so a slow dashboard query never competes with checkout traffic on the primary.',
        hi: '**Reporting/BI/export workload ke liye ek dedicated `analytics` replica** — bhaari `.values().annotate()` GROUP BY scans aur `.iterator()` exports (lessons 2-3) sab `.using("analytics")`, taaki ek dheema dashboard query kabhi primary par checkout traffic se compete na kare.',
      },
      {
        en: '**A router that shards by tenant using `hints["instance"]`** — a multi-tenant SaaS where `db_for_read`/`db_for_write` inspect the object\'s `tenant_id` (or a thread-local set by middleware) and pick `tenant_db_<n>`, with `allow_migrate` running the shared schema on every shard.',
        hi: '**Ek router jo `hints["instance"]` istemal karke tenant se shard karta hai** — ek multi-tenant SaaS jahaan `db_for_read`/`db_for_write` object ke `tenant_id` ko inspect karte hain aur `tenant_db_<n>` chunte hain, `allow_migrate` har shard par shared schema chalata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How does Django route a query to a database, and what do the four router methods do?',
        qHi: 'Django ek query ko ek database par kaise route karta hai, aur chaar router methods kya karte hain?',
        a: 'DATABASES is a dictionary of named aliases, with default being special — it is the fallback and what plain .objects uses. DATABASE_ROUTERS is an ordered list of router objects. For every query, Django asks each router in turn; the first one that returns a non-None alias wins, and if all return None it uses the queryset\'s .using() value or falls back to default. A router can implement four methods. db_for_read takes the model and returns the alias a SELECT should use — in a primary-replica setup it returns the replica alias, possibly choosing randomly among several. db_for_write takes the model and returns the alias for INSERT, UPDATE, and DELETE — it returns the primary, because all writes must go to the primary. allow_relation takes two object instances and returns whether a foreign key or many-to-many between them is allowed; for a primary and its replicas, which hold the same data, it returns True. allow_migrate takes a database alias and migration details and returns whether that migration should run against that alias; you return true only for the primary, so the migrate command never tries to build schema on the replica — the replica receives schema changes through replication just like it receives data. The hints argument sometimes carries the instance being operated on, which lets you route by a field on the object, for example sharding by tenant id.',
        aHi: 'DATABASES named aliases ka ek dictionary hai, default special hone ke saath — ye fallback hai aur jo plain .objects istemal karta hai. DATABASE_ROUTERS router objects ki ek ordered list hai. Har query ke liye, Django har router se baari-baari poochta hai; pehla jo ek non-None alias return karta hai jeetta hai, aur agar sab None return karte hain ye queryset ki .using() value istemal karta hai ya default par fall back karta hai. Ek router chaar methods implement kar sakta hai. db_for_read model leta hai aur wo alias return karta hai jo ek SELECT ko istemal karna chahiye — ek primary-replica setup mein ye replica alias return karta hai. db_for_write model leta hai aur INSERT, UPDATE, DELETE ke liye alias return karta hai — ye primary return karta hai. allow_relation do object instances leta hai aur return karta hai ki unke beech ek FK ya M2M allowed hai ya nahi. allow_migrate ek database alias aur migration details leta hai aur return karta hai ki wo migration us alias ke against chalni chahiye — aap sirf primary ke liye true return karte ho. hints argument kabhi-kabhi instance carry karta hai.',
      },
      {
        q: 'What is the read-your-writes problem with replicas, and how do you handle it?',
        qHi: 'Replicas ke saath read-your-writes problem kya hai, aur aap ise kaise handle karte ho?',
        a: 'A read replica is always slightly behind the primary because replication takes time — usually milliseconds, but seconds under load. The read-your-writes problem is when a user performs a write and then, in the very next moment, reads the same data and does not see their own change. The classic shape is a form POST that creates or updates a row, routed to the primary, followed by a redirect to a detail or list page whose read is routed to the replica. The redirect round-trip is often faster than replication, so the replica has not applied the change yet, and the user sees a 404, or the old value, or their just-submitted comment missing. It is intermittent and load-dependent, so it is easy to miss in development and maddening to debug in production. There are a few ways to handle it. The most precise is to route that specific follow-up read to the primary with using default, but that requires knowing exactly which reads follow a write. The most general is a middleware that, whenever a request performs a write, sets a short-lived per-user flag — in the cache or a signed cookie, for say five seconds — and the router\'s db_for_read checks that flag and returns the primary while it is set. Recent writers read from the primary and see their own writes; everyone else still reads from the replica. You can also just accept the lag for data where staleness does not matter, like a search results page or an activity feed, and only apply primary-pinning to flows where the user must immediately see their own action.',
        aHi: 'Ek read replica hamesha primary se thoda peeche hota hai kyunki replication mein samay lagta hai — aksar milliseconds, par load ke tahat seconds. Read-your-writes problem tab hai jab ek user ek write karta hai aur phir, theek agle pal, wahi data padhta hai aur apna hi change nahi dekhta. Classic shape ek form POST hai jo ek row create ya update karta hai, primary par routed, uske baad ek detail ya list page par ek redirect jiska read replica par routed hai. Redirect round-trip aksar replication se tez hota hai, toh replica ne abhi change apply nahi kiya, aur user ek 404 dekhta hai, ya purani value. Ye intermittent aur load-dependent hai. Ise handle karne ke kuch tareeke hain. Sabse precise us vishisht follow-up read ko using default se primary par route karna hai. Sabse general ek middleware hai jo, jab bhi ek request ek write karta hai, ek short-lived per-user flag set karta hai — cache mein ya ek signed cookie, kehte hain paanch second ke liye — aur router ka db_for_read us flag ko check karke jab tak set hai primary return karta hai. Aap staleness harmless hone waale data ke liye lag accept bhi kar sakte ho.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django with TWO file-backed sqlite aliases (`tempfile.mkdtemp()` + `os.path.join`): `default` and `replica`. A `Router` class: `db_for_read -> "replica"`, `db_for_write -> "default"`, `allow_relation -> True`, `allow_migrate -> db == "default"`. `create_model` on BOTH aliases manually. Model `Note` (`text`). (a) `Note.objects.create(text="x")` then assert `Note.objects.all().db == "replica"` and `Note.objects.count() == 0` (replica file is empty — nothing replicated). (b) assert `Note.objects.using("default").count() == 1`.',
        taskHi: 'Standalone Django, DO file-backed sqlite aliases: `default` aur `replica`. Ek `Router` class. DONO aliases par manually `create_model`. `Note` (`text`) model. (a) `Note.objects.create(text="x")` phir assert `Note.objects.all().db == "replica"` aur `count() == 0`. (b) assert `Note.objects.using("default").count() == 1`.',
        hint: '`:memory:` aliases are separate connections and awkward here — use `tempfile.mkdtemp()` + two file paths. The router sends the default-manager read to `replica`, which is a different, empty sqlite file; only `using("default")` sees the row.',
        hintHi: '`:memory:` aliases alag connections hain — `tempfile.mkdtemp()` + do file paths istemal karo. Router default-manager read ko `replica` bhejta hai, jo ek alag, khali sqlite file hai.',
      },
      {
        task: 'Same two-alias setup. Model `Comment` (`body`). Write a `replicate()` function that copies `Comment` rows from `default` to `replica` (`delete()` replica rows, then `bulk_create` with explicit ids from `values_list`). (a) `c = Comment.objects.create(body="hi")`, then assert `Comment.objects.filter(pk=c.pk).first() is None` (router read hits the lagging replica). (b) assert `Comment.objects.using("default").get(pk=c.pk).body == "hi"`. (c) call `replicate()`, then assert the router read now finds it.',
        taskHi: 'Wahi two-alias setup. `Comment` (`body`) model. Ek `replicate()` function likho jo `Comment` rows `default` se `replica` copy kare. (a) `c = Comment.objects.create(body="hi")`, phir assert `Comment.objects.filter(pk=c.pk).first() is None`. (b) assert `Comment.objects.using("default").get(pk=c.pk).body == "hi"`. (c) `replicate()` call karo, phir assert router read ab ise dhoondh leta hai.',
        hint: 'This simulates replication lag by hand: the write goes to `default`, the router read goes to the empty `replica`, and only after your manual `replicate()` copies the data does the default-manager read succeed. Real replication does this automatically but not instantly.',
        hintHi: 'Ye replication lag ko haath se simulate karta hai: write `default` par jaata hai, router read khali `replica` par jaata hai, aur sirf aapke manual `replicate()` ke data copy karne ke baad default-manager read safal hota hai.',
      },
      {
        task: 'Two file-backed aliases `default` and `archive` (NO router). Model `Row` (`v` int), `create_model` on both. Inside `with transaction.atomic(using="default"):` do `Row.objects.using("default").create(v=1)`, `Row.objects.using("archive").create(v=99)`, then `raise RuntimeError`. Catch it. Assert `Row.objects.using("default").count() == 0` (rolled back) but `Row.objects.using("archive").count() == 1` (its own connection, committed independently). Also assert `connections["default"] is not connections["archive"]`.',
        taskHi: 'Do file-backed aliases `default` aur `archive` (koi router nahi). `Row` (`v`) model, dono par `create_model`. `with transaction.atomic(using="default"):` ke andar `Row.objects.using("default").create(v=1)`, `Row.objects.using("archive").create(v=99)`, phir `raise RuntimeError`. Catch karo. Assert `default` count 0 (rolled back) par `archive` count 1. `connections["default"] is not connections["archive"]` bhi assert karo.',
        hint: '`from django.db import transaction, connections`. `atomic(using="default")` only manages the `default` connection\'s transaction; the `archive` write is on a separate connection in autocommit, so it is already committed when the exception fires.',
        hintHi: '`from django.db import transaction, connections`. `atomic(using="default")` sirf `default` connection ka transaction manage karta hai; `archive` write ek alag connection par autocommit mein hai.',
      },
    ],

    keyTakeaways: [
      'A read replica = a 2nd DB server streaming a near-live copy of the primary\'s changes. Send reads there, primary handles writes + must-be-current reads. Scales reads horizontally; isolates analytics scans. The replica is READ-ONLY and LAGS (ms normally, seconds under load).',
      '`DATABASES` = dict of aliases (`default` is the fallback + what plain `.objects` uses). `DATABASE_ROUTERS` = ordered list; per query Django asks each, first non-`None` alias wins, else `.using()` or `default`.',
      'Router methods: `db_for_read(model)` -> `"replica"`; `db_for_write(model)` -> `"default"` (ALL writes to primary); `allow_relation(a, b)` -> `True` for primary+replica; `allow_migrate(db, ...)` -> `db == "default"` (replica gets schema via replication, NEVER `migrate`).',
      'READ-YOUR-WRITES bug: write -> primary, redirect, follow-up read -> replica that hasn\'t caught up -> user doesn\'t see their own action (intermittent, load-dependent). Fix: route that read to `using("default")`, OR a middleware that pins a user\'s reads to the primary for ~5s after any write.',
      'Everything is PER-ALIAS: own connection, own transaction, own `CONN_MAX_AGE`. `transaction.atomic(using="X")` wraps ONE alias — there is NO cross-database transaction. A write to another alias inside the block commits independently and does not roll back.',
      '`.using(alias)` forces the alias for the whole queryset chain (incl. `select_related`/`prefetch_related`). `obj.save(using=)` / `obj.delete(using=)` force the write target.',
      'Testing: set `"TEST": {"MIRROR": "default"}` on the replica alias so the test runner uses ONE test DB for both (router logic still runs). Without it, setup fails or diverges.',
      'Don\'t reach for replicas by default — they add lag bugs, routing logic, infra. A single well-indexed primary + connection pooling (Module 7) handles a lot. Use replicas when read load IS the bottleneck or to isolate reporting/export from transactional traffic.',
    ],
    keyTakeawaysHi: [
      'Ek read replica = ek 2nd DB server jo primary ke changes ki ek near-live copy stream karta hai. Reads wahaan bhejo, primary writes + must-be-current reads handle karta hai. Reads horizontally scale karta hai. Replica READ-ONLY hai aur LAG karta hai (normally ms, load ke tahat seconds).',
      '`DATABASES` = aliases ka dict (`default` fallback hai + jo plain `.objects` istemal karta hai). `DATABASE_ROUTERS` = ordered list; per query Django har ek se poochta hai, pehla non-`None` alias jeetta hai, warna `.using()` ya `default`.',
      'Router methods: `db_for_read(model)` -> `"replica"`; `db_for_write(model)` -> `"default"` (SAARE writes primary par); `allow_relation(a, b)` -> primary+replica ke liye `True`; `allow_migrate(db, ...)` -> `db == "default"` (replica ko schema replication se milta hai, KABHI `migrate` nahi).',
      'READ-YOUR-WRITES bug: write -> primary, redirect, follow-up read -> replica jo catch up nahi hua -> user apna hi action nahi dekhta (intermittent, load-dependent). Fix: us read ko `using("default")` par route karo, YA ek middleware jo ek user ke reads ko kisi bhi write ke baad ~5s ke liye primary par pin karta hai.',
      'Sab kuch PRATI-ALIAS hai: apna connection, apna transaction, apna `CONN_MAX_AGE`. `transaction.atomic(using="X")` EK alias wrap karta hai — koi cross-database transaction NAHI. Block ke andar doosre alias ka ek write swतंtra roop se commit hota hai.',
      '`.using(alias)` poore queryset chain ke liye alias force karta hai. `obj.save(using=)` / `obj.delete(using=)` write target force karte hain.',
      'Testing: replica alias par `"TEST": {"MIRROR": "default"}` set karo taaki test runner dono ke liye EK test DB istemal kare (router logic abhi bhi chalti hai).',
      'Default se replicas ke liye mat pahuncho — wo lag bugs, routing logic, infra add karte hain. Ek single well-indexed primary + connection pooling (Module 7) bahut handle karta hai. Replicas tab istemal karo jab read load HI bottleneck hai.',
    ],
  },

  {
    slug: 'dj-celery-background-tasks',
    title: 'Celery: Background Tasks, Retries & Idempotency',
    titleHi: 'Celery: Background Tasks, Retries & Idempotency',
    description: 'Anything slow or failable — sending email, calling a third-party API, generating a report, processing an upload — does not belong in the request/response cycle. Celery runs it in a separate worker process: the view enqueues a task and returns immediately; a worker picks it up, retries on failure, and the user is never blocked.',
    descriptionHi: 'Kuch bhi dheema ya fail-hone-yogya — email bhejना, ek third-party API call karna, ek report generate karna, ek upload process karna — request/response cycle mein nahi hai. Celery ise ek alag worker process mein chalata hai: view ek task enqueue karke turant return karta hai; ek worker ise uthata hai, failure par retry karta hai, aur user kabhi block nahi hota.',
    difficulty: 'HARD',
    duration: 24,
    order: 6,

    analogy: {
      en: '**A restaurant kitchen with a ticket rail.** The waiter (your view) does not stand at the pass cooking your steak while you and every other table wait — they write a ticket, clip it to the rail (the broker: Redis or RabbitMQ), and go back to serving. Cooks (Celery workers) pull tickets off the rail whenever they are free and cook in parallel; add cooks and the kitchen goes faster without changing how waiters work. If a dish fails — a pan catches fire — the cook re-fires it (a retry), and after a few tries a ticket that keeps failing goes on the "spike" for the manager to look at (the dead-letter queue). Two rules keep it sane. The waiter writes only the table number and order on the ticket, never carries the actual plate to the rail (pass IDs, not objects — the object may be stale or huge by the time a cook reads it). And a cook must handle getting the same ticket twice — the rail guarantees a ticket is delivered *at least* once, not *exactly* once — so "did I already fire this?" is checked before cooking (idempotency).',
      hi: '**Ek restaurant kitchen ek ticket rail ke saath.** Waiter (aapka view) pass par khada aapka steak nahi pakata jab aap aur har doosri table intezaar karte hain — wo ek ticket likhta hai, use rail par clip karta hai (broker: Redis ya RabbitMQ), aur serve karne wapas jaata hai. Cooks (Celery workers) jab bhi free hote hain rail se tickets pull karte hain aur parallel mein pakate hain; cooks add karo aur kitchen tez ho jaati hai bina ye badle ki waiters kaise kaam karte hain. Agar ek dish fail hoti hai — ek pan mein aag lag jaati hai — cook ise re-fire karta hai (ek retry), aur kuch koshishon ke baad ek ticket jo fail hota rehta hai manager ke dekhne ke liye "spike" par jaata hai (dead-letter queue). Do niyam ise sane rakhte hain. Waiter ticket par sirf table number aur order likhta hai, kabhi asli plate rail par nahi le jaata (IDs pass karo, objects nahi). Aur ek cook ko wahi ticket do baar milne ko handle karna hi hai — rail guarantee karta hai ki ek ticket *kam se kam* ek baar deliver hota hai, *theek* ek baar nahi.',
    },

    simple: `**The pieces**

\`\`\`
your view  --enqueue-->  BROKER (Redis / RabbitMQ)  --deliver-->  WORKER process  --result-->  RESULT BACKEND
                          holds the task queue                     runs the task code            (optional; Redis/DB)
\`\`\`

**Define a task**

\`\`\`python
# tasks.py
from celery import shared_task

@shared_task
def send_welcome_email(user_id):                 # take an ID, not a User object
    user = User.objects.get(pk=user_id)
    send_mail("Welcome", "...", "no-reply@x.com", [user.email])
\`\`\`

**Enqueue it (do NOT call it directly)**

\`\`\`python
send_welcome_email.delay(user.id)               # .delay(args) -> returns fast, worker runs it later
send_welcome_email.apply_async((user.id,), countdown=60, queue="email")   # more control
# send_welcome_email(user.id)  <-- this RUNS IT INLINE, blocking the request. not what you want.
\`\`\`

**Enqueue AFTER the transaction commits**

\`\`\`python
from django.db import transaction

def signup(request):
    with transaction.atomic():
        user = User.objects.create_user(...)
        transaction.on_commit(lambda: send_welcome_email.delay(user.id))
    # if the request 500s, the transaction rolls back AND the task is never enqueued.
    # without on_commit, the worker could pick up user.id before the row is committed -> DoesNotExist
\`\`\`

**Retries**

\`\`\`python
@shared_task(bind=True, max_retries=5, retry_backoff=True, retry_jitter=True)
def call_flaky_api(self, order_id):
    try:
        resp = requests.post(PARTNER_URL, json={...}, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as exc:
        raise self.retry(exc=exc)              # re-queue: 1s, 2s, 4s, 8s, 16s (backoff), then give up

# shorthand: auto-retry on specific exceptions
@shared_task(autoretry_for=(requests.RequestException,), retry_backoff=True, max_retries=5)
def call_flaky_api(order_id): ...
\`\`\`

**Idempotency — a task WILL sometimes run twice**

\`\`\`python
@shared_task
def charge_order(order_id):
    order = Order.objects.select_for_update().get(pk=order_id)
    if order.charged_at:                        # already done -> no-op
        return
    charge(order)
    order.charged_at = now(); order.save(update_fields=["charged_at"])
# the broker guarantees AT-LEAST-once delivery, never exactly-once. design every task to be safe to repeat.
\`\`\`

\`\`\`
.delay(*args) / .apply_async(args, kwargs, countdown=, eta=, queue=, priority=)
bind=True -> first arg is self -> self.retry(), self.request.id, self.request.retries
acks_late=True -> the task is ack'd only AFTER it finishes -> a crashed worker's task is redelivered
task_always_eager=True (settings) -> tasks run inline, synchronously -> for tests
Celery Beat -> a scheduler process that enqueues periodic tasks (cron-like)
Flower -> a web dashboard for queues / workers / task history
\`\`\``,

    simpleHi: `**Hisse**

\`\`\`
aapka view  --enqueue-->  BROKER (Redis / RabbitMQ)  --deliver-->  WORKER process  --result-->  RESULT BACKEND
                          task queue rakhta hai                    task code chalata hai        (optional; Redis/DB)
\`\`\`

**Ek task define karo**

\`\`\`python
# tasks.py
from celery import shared_task

@shared_task
def send_welcome_email(user_id):                 # ek ID lo, ek User object nahi
    user = User.objects.get(pk=user_id)
    send_mail("Welcome", "...", "no-reply@x.com", [user.email])
\`\`\`

**Ise enqueue karo (seedhe call MAT karo)**

\`\`\`python
send_welcome_email.delay(user.id)               # .delay(args) -> tez return, worker ise baad mein chalata hai
send_welcome_email.apply_async((user.id,), countdown=60, queue="email")   # zyada control
# send_welcome_email(user.id)  <-- ye ISE INLINE CHALATA HAI, request block karke. ye nahi chahiye.
\`\`\`

**Transaction commit hone ke BAAD enqueue karo**

\`\`\`python
from django.db import transaction

def signup(request):
    with transaction.atomic():
        user = User.objects.create_user(...)
        transaction.on_commit(lambda: send_welcome_email.delay(user.id))
    # agar request 500s, transaction roll back hota hai AUR task kabhi enqueue nahi hota.
    # on_commit ke bina, worker user.id ko row committed hone se pehle utha sakta hai -> DoesNotExist
\`\`\`

**Retries**

\`\`\`python
@shared_task(bind=True, max_retries=5, retry_backoff=True, retry_jitter=True)
def call_flaky_api(self, order_id):
    try:
        resp = requests.post(PARTNER_URL, json={...}, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as exc:
        raise self.retry(exc=exc)              # re-queue: 1s, 2s, 4s, 8s, 16s (backoff), phir give up

# shorthand: vishisht exceptions par auto-retry
@shared_task(autoretry_for=(requests.RequestException,), retry_backoff=True, max_retries=5)
def call_flaky_api(order_id): ...
\`\`\`

**Idempotency — ek task KABHI-KABHI do baar chalega**

\`\`\`python
@shared_task
def charge_order(order_id):
    order = Order.objects.select_for_update().get(pk=order_id)
    if order.charged_at:                        # pehle se ho gaya -> no-op
        return
    charge(order)
    order.charged_at = now(); order.save(update_fields=["charged_at"])
# broker AT-LEAST-once delivery guarantee karta hai, kabhi exactly-once nahi. har task ko repeat-safe banao.
\`\`\`

\`\`\`
.delay(*args) / .apply_async(args, kwargs, countdown=, eta=, queue=, priority=)
bind=True -> pehla arg self hai -> self.retry(), self.request.id, self.request.retries
acks_late=True -> task tabhi ack hota hai jab ye khatam hota hai -> ek crashed worker ka task redeliver hota hai
task_always_eager=True (settings) -> tasks inline, synchronously chalte hain -> tests ke liye
Celery Beat -> ek scheduler process jo periodic tasks enqueue karta hai (cron-jaisa)
Flower -> queues / workers / task history ke liye ek web dashboard
\`\`\``,

    content: `## The architecture

Celery decouples slow work from the request. Three components:

- **The broker** — a message queue (Redis or RabbitMQ) that holds enqueued tasks until a worker takes one. This is the only required piece besides your app.
- **Workers** — separate processes (\`celery -A proj worker\`) that pull tasks from the broker and execute them. Scale by running more workers / more processes per worker.
- **The result backend** (optional) — where task return values and states are stored (Redis, the database, etc.) so \`AsyncResult(id)\` can report \`PENDING\`/\`STARTED\`/\`SUCCESS\`/\`FAILURE\` and the value. Skip it if you never inspect results.

The view calls \`task.delay(...)\`, which serialises the task name and arguments, pushes them to the broker, and returns an \`AsyncResult\` immediately. A worker later deserialises and runs the function.

## Defining and calling tasks

\`@shared_task\` (from \`celery\`) defines a task without importing your app's Celery instance — the right choice for reusable app code. \`@app.task\` ties it to a specific Celery app.

**Call it with \`.delay(*args, **kwargs)\`** (simple) or **\`.apply_async(args=, kwargs=, countdown=, eta=, queue=, priority=, retry=)\`** (full control). **Never call \`task(...)\` directly** unless you mean to run it inline in the current process — that defeats the entire purpose.

### Pass IDs, not objects

\`send_email.delay(user)\` serialises the whole \`User\` — wasteful, and by the time the worker runs, that snapshot may be stale (another request changed the row). \`send_email.delay(user.id)\` and re-fetch inside the task: \`user = User.objects.get(pk=user_id)\`. The task sees current data and the message stays small.

### Enqueue after commit

If a task is enqueued **inside** a transaction and the worker is fast, the worker can \`SELECT\` the row **before the transaction commits** and get \`DoesNotExist\`. And if the transaction later rolls back, you have enqueued a task for a row that never existed. Always:

\`\`\`python
with transaction.atomic():
    obj = Model.objects.create(...)
    transaction.on_commit(lambda: process.delay(obj.id))
\`\`\`

\`on_commit\` fires the callback only after a successful commit; on rollback it never runs. This is the Module 7 lesson (\`ATOMIC_REQUESTS\` + side effects) applied to task enqueueing.

## Retries

Transient failures — a network blip, a rate limit, a deadlock — should retry, not fail. With \`bind=True\` the task gets \`self\`, and \`self.retry(exc=exc, countdown=..., max_retries=...)\` re-queues it. \`retry_backoff=True\` makes the delay grow exponentially (2, 4, 8, 16 s); \`retry_jitter=True\` randomises it so a fleet of failing tasks does not retry in lockstep and hammer the dependency.

The shorthand \`autoretry_for=(SomeException,)\` retries automatically when the task raises one of those exceptions. \`retry_kwargs={"max_retries": 5}\` and \`retry_backoff\` still apply.

Distinguish **transient** (retry) from **permanent** (do not retry — a validation error, a 404 from the partner, a bad argument). Retrying a permanent failure just wastes the queue and delays the eventual dead-lettering.

## Idempotency — the crucial discipline

Message brokers provide **at-least-once** delivery. A task can run more than once because:

- the worker crashed after doing the work but before acknowledging the message (with \`acks_late=True\`), so the broker redelivers it;
- a retry fired for a task whose side effect had actually succeeded;
- the same task was enqueued twice by a double-clicked button or a retried request.

So **every task must be safe to run twice**. Techniques:

- **Check-then-act on a marker:** \`if order.charged_at: return\` before charging.
- **Idempotency key:** a \`processed_events\` table (or a cache key) keyed by a unique event id; \`get_or_create\` the key, bail if it existed.
- **Naturally idempotent operations:** \`update_or_create\`, \`set\`-style updates (\`user.tier = "gold"\`), \`cache.set\` — running them twice is harmless.
- **\`select_for_update\`** (Module 7) around the check-and-act so two concurrent copies of the task serialise.

\`acks_late=True\` + idempotency is the standard combination for tasks that must not be lost: the task is acknowledged only after it completes, so a crash redelivers it, and idempotency makes the redelivery safe.

## Testing

Set \`CELERY_TASK_ALWAYS_EAGER = True\` (and usually \`CELERY_TASK_EAGER_PROPAGATES = True\`) in test settings: \`.delay()\` runs the task **synchronously in the calling process** and returns an \`EagerResult\`. No broker, no worker. Test the task function directly for unit tests; use eager mode for integration tests that exercise the enqueue path.

## Scheduling and observability

- **Celery Beat** (\`celery -A proj beat\`) is a scheduler that enqueues tasks on a cron-like schedule (\`CELERY_BEAT_SCHEDULE\`, or \`django-celery-beat\` for DB-backed schedules editable in the admin). Beat only *enqueues*; workers execute.
- **Flower** is a web UI showing queue depth, worker status, task history, and rates.
- **Time limits:** \`task_time_limit\` (hard kill) and \`task_soft_time_limit\` (raises \`SoftTimeLimitExceeded\` so the task can clean up) stop a runaway task from occupying a worker forever.
- **Separate queues** (\`queue="email"\`, \`queue="reports"\`) + workers dedicated per queue, so a flood of slow report tasks does not starve quick email tasks.

## When Celery is overkill

For a small app, Django 5.1+ ships a built-in **Tasks framework** (\`django.tasks\`) with a database-backed backend — enough for "send this email later" without running Redis and a worker fleet. Cron + a management command covers periodic jobs. Reach for Celery when you need parallelism, retries with backoff, scheduling, priorities, and observability together.`,

    contentHi: `## Architecture

Celery dheeme kaam ko request se decouple karta hai. Teen components:

- **Broker** — ek message queue (Redis ya RabbitMQ) jo enqueued tasks rakhta hai jab tak ek worker ek na le. Ye aapke app ke alawa ekmatra required piece hai.
- **Workers** — alag processes (\`celery -A proj worker\`) jo broker se tasks pull karte hain aur unhe execute karte hain. Zyada workers chalakar scale karo.
- **Result backend** (optional) — jahaan task return values aur states store hote hain taaki \`AsyncResult(id)\` \`PENDING\`/\`SUCCESS\`/\`FAILURE\` report kar sake.

View \`task.delay(...)\` call karta hai, jo task name aur arguments serialise karta hai, unhe broker ko push karta hai, aur turant ek \`AsyncResult\` return karta hai. Ek worker baad mein deserialise karke function chalata hai.

## Tasks define aur call karna

\`@shared_task\` ek task define karta hai bina aapke app ka Celery instance import kiye — reusable app code ke liye sahi chunav. \`@app.task\` ise ek vishisht Celery app se baandhta hai.

**Ise \`.delay(*args, **kwargs)\`** (saral) ya **\`.apply_async(...)\`** (poora control) se call karo. **\`task(...)\` seedhe KABHI call mat karo** jab tak aap ise current process mein inline chalana nahi chahte.

### IDs pass karo, objects nahi

\`send_email.delay(user)\` poora \`User\` serialise karta hai — barbaad, aur jab tak worker chalta hai, wo snapshot stale ho sakta hai. \`send_email.delay(user.id)\` aur task ke andar re-fetch karo. Task current data dekhta hai aur message chhota rehta hai.

### Commit ke baad enqueue karo

Agar ek task ek transaction ke **andar** enqueue kiya jaata hai aur worker tez hai, worker row ko **transaction commit hone se pehle** \`SELECT\` kar sakta hai aur \`DoesNotExist\` pa sakta hai. Aur agar transaction baad mein roll back hota hai, aapne ek aisi row ke liye ek task enqueue kiya jo kabhi maujood nahi thi. Hamesha:

\`\`\`python
with transaction.atomic():
    obj = Model.objects.create(...)
    transaction.on_commit(lambda: process.delay(obj.id))
\`\`\`

## Retries

Transient failures — ek network blip, ek rate limit, ek deadlock — retry hone chahiye, fail nahi. \`bind=True\` ke saath task ko \`self\` milta hai, aur \`self.retry(exc=exc, countdown=...)\` ise re-queue karta hai. \`retry_backoff=True\` delay ko exponentially badhata hai (2, 4, 8, 16 s); \`retry_jitter=True\` ise randomise karta hai.

Shorthand \`autoretry_for=(SomeException,)\` un exceptions par automatically retry karta hai.

**Transient** (retry) ko **permanent** (retry mat karo — ek validation error, partner se ek 404) se distinguish karo.

## Idempotency — mahatvapoorn discipline

Message brokers **at-least-once** delivery dete hain. Ek task ek se zyada baar chal sakta hai kyunki:

- worker kaam karne ke baad par message acknowledge karne se pehle crash hua (\`acks_late=True\` ke saath), toh broker ise redeliver karta hai;
- ek retry ek aise task ke liye fire hua jiska side effect asal mein safal ho gaya tha;
- wahi task ek double-clicked button dwara do baar enqueue kiya gaya.

Toh **har task do baar chalne ke liye surakshit hona chahiye**. Techniques: ek marker par check-then-act (\`if order.charged_at: return\`); ek idempotency key (\`processed_events\` table); naturally idempotent operations (\`update_or_create\`, \`set\`-style updates); check-and-act ke around \`select_for_update\` (Module 7).

\`acks_late=True\` + idempotency un tasks ke liye standard combination hai jो kho nahi sakte.

## Testing

Test settings mein \`CELERY_TASK_ALWAYS_EAGER = True\` set karo: \`.delay()\` task ko **calling process mein synchronously** chalata hai aur ek \`EagerResult\` return karta hai. Koi broker nahi, koi worker nahi.

## Scheduling aur observability

- **Celery Beat** ek scheduler hai jो tasks ko ek cron-jaise schedule par enqueue karta hai. Beat sirf *enqueue* karta hai; workers execute karte hain.
- **Flower** ek web UI hai jо queue depth, worker status, task history dikhata hai.
- **Time limits:** \`task_time_limit\` (hard kill) aur \`task_soft_time_limit\` (\`SoftTimeLimitExceeded\` raise karta hai).
- **Alag queues** + prati queue dedicated workers, taaki dheeme report tasks ki ek baadh quick email tasks ko starve na kare.

## Jab Celery overkill hai

Ek chhote app ke liye, Django 5.1+ ek built-in **Tasks framework** (\`django.tasks\`) ke saath aata hai ek database-backed backend ke saath. Cron + ek management command periodic jobs cover karta hai. Celery ke liye tab pahuncho jab aapko parallelism, backoff ke saath retries, scheduling, priorities, aur observability ek saath chahiye.`,

    examples: [
      {
        title: 'Eager mode: .delay() runs the task in-process; result + signature',
        titleHi: 'Eager mode: .delay() task ko in-process chalata hai; result + signature',
        code: `import django, tempfile, os
from django.conf import settings
_d = tempfile.mkdtemp()
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": os.path.join(_d, "d.sqlite3")}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from celery import Celery

app = Celery("demo")
app.conf.update(broker_url="memory://", task_always_eager=True, task_eager_propagates=False)

RUN_LOG = []

@app.task
def add(a, b):
    RUN_LOG.append(("add", a, b))
    return a + b

@app.task
def greet(name):
    RUN_LOG.append(("greet", name))
    return f"hi {name}"

# .delay -> in eager mode runs NOW, returns an EagerResult
r = add.delay(2, 3)
print("add.delay(2, 3) ->", r.get(), "| state:", r.state, "| successful:", r.successful())

# .apply_async with options
r2 = greet.apply_async(args=["ada"], countdown=0)
print("greet.apply_async ->", r2.get())

# .s() signature -- a task + its args, callable later / composable
sig = add.s(10, 20)
print("signature:", sig, "-> .apply().get() =", sig.apply().get())

# calling the task function directly = NO celery machinery, just a function call
print("direct call add(1, 1) =", add(1, 1))

print("run log:", RUN_LOG)`,
        output: `add.delay(2, 3) -> 5 | state: SUCCESS | successful: True
greet.apply_async -> hi ada
signature: demo.add(10, 20) -> .apply().get() = 30
direct call add(1, 1) = 2
run log: [('add', 2, 3), ('greet', 'ada'), ('add', 10, 20), ('add', 1, 1)]
`,
        explain: 'In eager mode, .delay() and .apply_async() run the task synchronously in the calling process and return an EagerResult that already has its value and SUCCESS state -- no broker, no worker, ideal for tests. .s(a, b) builds a signature, a frozen task-plus-arguments that can be passed around and composed; .apply() executes a signature eagerly. Calling the task function directly -- add(1, 1) -- bypasses Celery entirely and is just a normal function call. The run log confirms all four styles ultimately executed the task body.',
        explainHi: 'Eager mode mein, .delay() aur .apply_async() task ko calling process mein synchronously chalate hain aur ek EagerResult return karte hain jiske paas pehle se apni value aur SUCCESS state hai -- koi broker nahi, koi worker nahi, tests ke liye ideal. .s(a, b) ek signature banata hai, ek frozen task-plus-arguments; .apply() ek signature ko eagerly execute karta hai. Task function ko seedhe call karna -- add(1, 1) -- Celery ko puri tarah bypass karta hai. Run log pushti karta hai ki chaaron styles ne aakhirkar task body execute kiya.',
      },
      {
        title: 'Retries with backoff, and transient vs permanent failures',
        titleHi: 'Backoff ke saath retries, aur transient vs permanent failures',
        code: `import django, tempfile, os
from django.conf import settings
_d = tempfile.mkdtemp()
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, INSTALLED_APPS=["__main__"], USE_TZ=True,
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": os.path.join(_d, "d.sqlite3")}})
django.setup()

from celery import Celery
from celery.exceptions import Reject

app = Celery("demo")
app.conf.update(broker_url="memory://", task_always_eager=True, task_eager_propagates=False)

ATTEMPTS = {"flaky": 0, "permanent": 0}

class TransientError(Exception): pass
class PermanentError(Exception): pass

@app.task(bind=True, max_retries=5)
def flaky(self, n):
    ATTEMPTS["flaky"] += 1
    if ATTEMPTS["flaky"] < 3:                       # fails twice, succeeds on the 3rd
        try:
            raise TransientError("timeout")
        except TransientError as exc:
            raise self.retry(exc=exc, countdown=0)
    return n * 10

@app.task(bind=True, autoretry_for=(TransientError,), retry_kwargs={"max_retries": 4}, retry_backoff=True)
def auto(self, n):
    ATTEMPTS["permanent"] += 1
    raise PermanentError("bad input -- retrying this is pointless")

r = flaky.delay(7)
print("flaky ->", r.get(), "| attempts:", ATTEMPTS["flaky"], "(2 retries + 1 success)")

try:
    auto.delay(1).get()
except PermanentError as e:
    print("auto -> raised", type(e).__name__, "immediately | attempts:", ATTEMPTS["permanent"],
          "(autoretry_for only catches TransientError)")`,
        output: `flaky -> 70 | attempts: 3 (2 retries + 1 success)
auto -> raised PermanentError immediately | attempts: 1 (autoretry_for only catches TransientError)
`,
        explain: 'The flaky task uses bind=True and self.retry(): it fails twice with a TransientError, re-queueing itself each time, and succeeds on the third attempt -- three runs total, final value 70. That is the shape for a transient failure like a network blip. The auto task uses autoretry_for=(TransientError,), but it raises a PermanentError, which is not in that tuple, so Celery does not retry it -- it propagates on the first attempt, one run. This is the key discipline: retry only genuinely transient failures, and let permanent ones (bad input, a 4xx, a validation error) fail fast so they land in the dead-letter queue.',
        explainHi: 'flaky task bind=True aur self.retry() istemal karta hai: ye do baar TransientError se fail hota hai, har baar khud ko re-queue karke, aur teesre attempt par safal hota hai -- kul teen runs, final value 70. auto task autoretry_for=(TransientError,) istemal karta hai, par ye ek PermanentError raise karta hai, jo us tuple mein nahi hai, toh Celery ise retry nahi karta -- ye pehle attempt par propagate hota hai. Yahi mukhya discipline hai: sirf sach me transient failures retry karo, aur permanent ko fail-fast hone do.',
      },
      {
        title: 'on_commit enqueues only after commit; idempotency guards a double-run',
        titleHi: 'on_commit sirf commit ke baad enqueue karta hai; idempotency ek double-run guard karta hai',
        code: `import django, tempfile, os
from django.conf import settings
_d = tempfile.mkdtemp()
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"], USE_TZ=True,
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": os.path.join(_d, "d.sqlite3")}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField")
django.setup()

from django.db import models, connection, transaction
from celery import Celery

app = Celery("demo")
app.conf.update(broker_url="memory://", task_always_eager=True, task_eager_propagates=False)

class Order(models.Model):
    total = models.IntegerField()
    charged = models.BooleanField(default=False)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Order)

CHARGES = []

@app.task
def charge_order(order_id):
    order = Order.objects.get(pk=order_id)
    if order.charged:                              # idempotency guard
        return "already charged -- no-op"
    CHARGES.append(order_id)
    order.charged = True
    order.save(update_fields=["charged"])
    return "charged"

# --- happy path: task enqueued on commit ---
with transaction.atomic():
    o = Order.objects.create(total=500)
    transaction.on_commit(lambda: charge_order.delay(o.id))
print("after commit: charges =", CHARGES)

# --- the task gets redelivered (at-least-once) -> idempotency makes it safe ---
print("second delivery:", charge_order.delay(o.id).get())
print("charges still:", CHARGES, "(not double-charged)")

# --- rollback path: on_commit callback never fires ---
try:
    with transaction.atomic():
        o2 = Order.objects.create(total=999)
        transaction.on_commit(lambda: charge_order.delay(o2.id))
        raise RuntimeError("payment declined -> rollback")
except RuntimeError:
    pass
print("after rollback: charges =", CHARGES, "| Order rows =", Order.objects.count())`,
        output: `after commit: charges = [1]
second delivery: already charged -- no-op
charges still: [1] (not double-charged)
after rollback: charges = [1] | Order rows = 1
`,
        explain: 'The happy path wraps the order create in transaction.atomic() and registers charge_order.delay(o.id) with transaction.on_commit -- so the task is enqueued only after the transaction successfully commits, at which point the row is durably visible to the worker. The second delivery of the same task is a no-op because charge_order checks order.charged first -- that idempotency guard is what makes at-least-once delivery safe. The rollback path registers an on_commit callback too, but the RuntimeError rolls the transaction back, so the callback never fires and no charge is enqueued for the order that never committed.',
        explainHi: 'Happy path order create ko transaction.atomic() mein wrap karta hai aur charge_order.delay(o.id) ko transaction.on_commit ke saath register karta hai -- toh task sirf transaction ke safaltapoorvak commit hone ke baad enqueue hota hai. Usi task ki doosri delivery ek no-op hai kyunki charge_order pehle order.charged check karta hai -- wo idempotency guard hi at-least-once delivery ko surakshit banata hai. Rollback path bhi ek on_commit callback register karta hai, par RuntimeError transaction ko roll back karta hai, toh callback kabhi fire nahi hota.',
      },
    ],

    mistakes: [
      {
        wrong: `def signup(request):
    user = User.objects.create_user(...)
    send_welcome_email.delay(user)                 # (a) passing the object; (b) not on_commit
    return redirect("dashboard")`,
        right: `def signup(request):
    with transaction.atomic():
        user = User.objects.create_user(...)
        transaction.on_commit(lambda: send_welcome_email.delay(user.id))
    return redirect("dashboard")

@shared_task
def send_welcome_email(user_id):
    user = User.objects.get(pk=user_id)
    ...`,
        why: 'Two bugs. Passing `user` serialises the whole object into the message — larger payload, and a stale snapshot if the row changes before the worker runs; pass `user.id` and re-fetch. And enqueueing outside `on_commit` means a fast worker can `SELECT` the user before the surrounding transaction (or `ATOMIC_REQUESTS`) commits, hitting `DoesNotExist` — or, if the request later fails and rolls back, you have sent a welcome email for a user that does not exist. `transaction.on_commit` defers the enqueue until the data is durably committed.',
        whyHi: 'Do bugs. `user` pass karna poore object ko message mein serialise karta hai — bada payload, aur ek stale snapshot agar worker chalne se pehle row badalti hai; `user.id` pass karo aur re-fetch karo. Aur `on_commit` ke bahar enqueue karne ka matlab ek tez worker user ko surrounding transaction commit hone se pehle `SELECT` kar sakta hai, `DoesNotExist` hit karke — ya, agar request baad mein fail hoti hai, aapne ek aise user ke liye welcome email bheja jo maujood nahi.',
      },
      {
        wrong: `@shared_task
def process_payment(order_id):
    order = Order.objects.get(pk=order_id)
    stripe.Charge.create(amount=order.total, source=order.token)   # no idempotency check
    order.status = "paid"
    order.save()
# a redelivery (worker crash, retry, double-enqueue) charges the customer TWICE`,
        right: `@shared_task(acks_late=True)
def process_payment(order_id):
    with transaction.atomic():
        order = Order.objects.select_for_update().get(pk=order_id)
        if order.status == "paid":
            return
        stripe.Charge.create(amount=order.total, source=order.token,
                             idempotency_key=f"order-{order_id}")   # Stripe-side guard too
        order.status = "paid"
        order.save(update_fields=["status"])`,
        why: 'Brokers guarantee at-least-once delivery, never exactly-once. A task can run again after a worker crash (with `acks_late`), after a retry whose side effect actually succeeded, or from a double-submitted request. A payment task with no guard double-charges the customer on any of those. The fix is a check-then-act on a status marker, wrapped in `select_for_update` so two concurrent copies serialise, plus an idempotency key on the external call so even the provider deduplicates. Every task that has an external side effect needs this discipline.',
        whyHi: 'Brokers at-least-once delivery guarantee karte hain, kabhi exactly-once nahi. Ek task ek worker crash ke baad (`acks_late` ke saath), ek retry ke baad jiska side effect asal mein safal ho gaya, ya ek double-submitted request se dobara chal sakta hai. Bina guard ke ek payment task un me se kisi par bhi customer ko double-charge karta hai. Fix ek status marker par check-then-act hai, `select_for_update` mein wrapped, plus external call par ek idempotency key.',
      },
      {
        wrong: `@shared_task(bind=True, max_retries=None)          # retry forever
def call_partner(self, order_id):
    try:
        resp = requests.post(URL, json=payload(order_id))
        resp.raise_for_status()
    except Exception as exc:
        raise self.retry(exc=exc, countdown=5)        # fixed 5s, no backoff, catches EVERYTHING
# a 400 (bad request) retries every 5s forever; 10k orders all retry in lockstep and DDoS the partner`,
        right: `@shared_task(bind=True, max_retries=5, retry_backoff=True, retry_jitter=True)
def call_partner(self, order_id):
    try:
        resp = requests.post(URL, json=payload(order_id), timeout=10)
        resp.raise_for_status()
    except requests.HTTPError as exc:
        if 400 <= exc.response.status_code < 500:
            raise                                     # permanent -> let it fail / dead-letter
        raise self.retry(exc=exc)                     # 5xx -> transient -> retry with backoff
    except requests.RequestException as exc:
        raise self.retry(exc=exc)                     # network -> transient`,
        why: 'Retrying forever, on every exception, with a fixed delay is three mistakes. A permanent failure (a `400`, a validation error, a missing record) will never succeed, so infinite retries just churn the queue. A fixed delay with no jitter means a large batch of tasks that failed together retry at the same instants, turning your retry logic into a synchronised flood against the failing dependency. And catching bare `Exception` retries bugs in your own code. Bound `max_retries`, use `retry_backoff` + `retry_jitter`, and only retry exceptions that are actually transient — let permanent ones fail so they land in the dead-letter queue for a human.',
        whyHi: 'Hamesha ke liye retry karna, har exception par, ek fixed delay ke saath teen galtiyan hain. Ek permanent failure (ek `400`, ek validation error) kabhi safal nahi hoga, toh infinite retries bas queue churn karte hain. Bina jitter ke ek fixed delay ka matlab tasks ka ek bada batch jo saath fail hua wahi pal par retry karta hai, aapki retry logic ko failing dependency ke against ek synchronised flood mein badalke. Aur bare `Exception` catch karna aapke apne code ke bugs retry karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every transactional email, webhook delivery, and third-party API call goes through a `@shared_task`** — enqueued via `transaction.on_commit`, `autoretry_for` the network exceptions with `retry_backoff` + `retry_jitter`, `acks_late=True`, and an idempotency key so a redelivery is safe. A dedicated `email` queue with its own workers.',
        hi: '**Har transactional email, webhook delivery, aur third-party API call ek `@shared_task` se guzarta hai** — `transaction.on_commit` ke zariye enqueued, network exceptions ke liye `autoretry_for` `retry_backoff` + `retry_jitter` ke saath, `acks_late=True`, aur ek idempotency key. Ek dedicated `email` queue apne workers ke saath.',
      },
      {
        en: '**The async export flow from lesson 3** — `build_export.delay(export_id)` writes a CSV/zip to S3 with `.iterator()` streaming, updates `Export.progress`, retries on transient storage errors, and on completion enqueues `notify_export_ready.delay(export_id)` which emails a signed link. Runs on a `reports` queue so it never competes with quick tasks.',
        hi: '**Lesson 3 se async export flow** — `build_export.delay(export_id)` `.iterator()` streaming se S3 par ek CSV/zip likhta hai, `Export.progress` update karta hai, transient storage errors par retry karta hai, aur completion par `notify_export_ready.delay(export_id)` enqueue karta hai. Ek `reports` queue par chalta hai.',
      },
      {
        en: '**Celery Beat for periodic jobs** — nightly denormalisation recompute (lesson 2), hourly stale-cache warmups (Module 7), a 5-minute `retry_failed_webhooks` sweep, daily cleanup of expired `Export` rows and their S3 objects — all defined in `CELERY_BEAT_SCHEDULE` or `django-celery-beat` and monitored in Flower.',
        hi: '**Periodic jobs ke liye Celery Beat** — nightly denormalisation recompute (lesson 2), hourly stale-cache warmups (Module 7), ek 5-minute `retry_failed_webhooks` sweep, expired `Export` rows ki daily cleanup — sab `CELERY_BEAT_SCHEDULE` mein defined aur Flower mein monitored.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through what happens from `task.delay(id)` in a view to the task running, and why you pass an id and use `transaction.on_commit`.',
        qHi: 'Bataiye ki ek view mein `task.delay(id)` se task chalne tak kya hota hai, aur aap ek id kyun pass karte ho aur `transaction.on_commit` kyun istemal karte ho.',
        a: 'When the view calls task.delay(id), Celery serialises the task\'s name and its arguments into a message and pushes that message onto the broker — Redis or RabbitMQ — then returns an AsyncResult immediately, so the view finishes and the response goes back to the user without waiting. Separately, one or more worker processes are running, each connected to the broker, pulling messages off the queue. A worker takes the message, deserialises it, looks up the task function by name, and runs it with the given arguments. If a result backend is configured, the return value and the final state are stored there so AsyncResult(id) can be queried. You pass an id rather than the object for two reasons. The message is smaller, and more importantly the worker re-fetches the row when it runs, so it sees the current state — if you serialised the whole object, the worker might act on a snapshot that another request has since changed. You use transaction.on_commit because of a race and a correctness problem. If the view is inside a transaction — explicitly or via ATOMIC_REQUESTS — and it enqueues the task directly, a fast worker can pick up the message and run SELECT for that id before the transaction has committed, so the row is not visible yet and the task fails with DoesNotExist. And if the transaction later rolls back, you have already enqueued a task for a row that will never exist. transaction.on_commit registers the enqueue as a callback that Celery fires only after the transaction successfully commits, and never if it rolls back, so the task is enqueued exactly when the data it needs is durably there.',
        aHi: 'Jab view task.delay(id) call karta hai, Celery task ka naam aur uske arguments ek message mein serialise karke us message ko broker par push karta hai — Redis ya RabbitMQ — phir turant ek AsyncResult return karta hai, toh view khatam hota hai aur response user ko wapas jaata hai bina intezaar kiye. Alag se, ek ya zyada worker processes chal rahe hain, har ek broker se connected, queue se messages pull kar raha hai. Ek worker message leta hai, deserialise karta hai, naam se task function dhoondhta hai, aur ise diye gaye arguments ke saath chalata hai. Aap object ke badle ek id do kaaranon se pass karte ho. Message chhota hai, aur zyada mahatvapoorn, worker jab chalta hai row re-fetch karta hai, toh ye current state dekhta hai. Aap transaction.on_commit istemal karte ho ek race aur ek correctness problem ki wajah se. Agar view ek transaction ke andar hai aur ye task seedhe enqueue karta hai, ek tez worker message uthakar us id ke liye SELECT chala sakta hai transaction commit hone se pehle, toh row abhi visible nahi hai aur task DoesNotExist ke saath fail hota hai. transaction.on_commit enqueue ko ek callback ke roop mein register karta hai jise Celery sirf transaction ke safaltapoorvak commit hone ke baad fire karta hai.',
      },
      {
        q: 'Why must Celery tasks be idempotent, and what are the ways to make one idempotent?',
        qHi: 'Celery tasks idempotent kyun hone chahiye, aur ek ko idempotent banane ke tareeke kya hain?',
        a: 'Message brokers guarantee at-least-once delivery, not exactly-once. That means a task can and eventually will run more than once for a single logical enqueue. The common causes: with acks_late enabled, the worker acknowledges the message only after the task finishes, so if the worker crashes after doing the work but before acking, the broker redelivers the message and the task runs again. A retry can fire for a task whose side effect had actually already succeeded — the network call went through but the response was lost. And the same task can be enqueued twice by a double-clicked button, a retried HTTP request, or buggy calling code. If a task has an external side effect — charging a card, sending an email, calling a partner API, incrementing a counter — running it twice causes real damage. So every such task has to be safe to run repeatedly. The techniques: check-then-act on a marker, where the task first checks whether the work is already done — if order.charged_at is set, return — and only proceeds otherwise, ideally wrapped in select_for_update so two concurrent copies serialise on the row. An idempotency key, where you record a unique event id in a processed table or a cache key and bail if it already exists. Naturally idempotent operations, where the work is a set-style update or an update_or_create that produces the same end state no matter how many times it runs. And pushing idempotency to the external service, like passing Stripe an idempotency_key so the provider itself deduplicates. The standard pattern for tasks that must not be lost is acks_late plus idempotency: acks_late ensures a crashed task is redelivered, and idempotency makes that redelivery harmless.',
        aHi: 'Message brokers at-least-once delivery guarantee karte hain, exactly-once nahi. Iska matlab ek task ek single logical enqueue ke liye ek se zyada baar chal sakta hai aur ant mein chalega. Aam kaaran: acks_late enabled ke saath, worker message ko sirf task khatam hone ke baad acknowledge karta hai, toh agar worker kaam karne ke baad par ack karne se pehle crash hota hai, broker message redeliver karta hai. Ek retry ek aise task ke liye fire ho sakta hai jiska side effect asal mein pehle hi safal ho gaya tha. Aur wahi task ek double-clicked button dwara do baar enqueue ho sakta hai. Agar ek task ka ek external side effect hai — ek card charge karna, ek email bhejना — ise do baar chalana asli nuksaan karta hai. Toh har aisa task baar-baar chalne ke liye surakshit hona chahiye. Techniques: ek marker par check-then-act, jahaan task pehle check karta hai ki kaam pehle se ho gaya — agar order.charged_at set hai, return — ideally select_for_update mein wrapped. Ek idempotency key, jahaan aap ek unique event id ek processed table mein record karte ho. Naturally idempotent operations. Aur idempotency ko external service par dhakelna, jaise Stripe ko ek idempotency_key pass karna.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django + a `Celery("demo")` app with `broker_url="memory://"`, `task_always_eager=True`, `task_eager_propagates=False`. Define `@app.task def add(a,b)` appending to a `RUN_LOG` and returning `a+b`. (a) `r = add.delay(2, 3)` -> assert `r.get() == 5`, `r.state == "SUCCESS"`, `r.successful()`. (b) `add.apply_async(args=[10, 20]).get() == 30`. (c) `add.s(1, 1).apply().get() == 2`. (d) `add(9, 9) == 18` (direct call, no Celery). Assert `RUN_LOG` has all four entries.',
        taskHi: 'Standalone Django + ek `Celery("demo")` app `broker_url="memory://"`, `task_always_eager=True`, `task_eager_propagates=False` ke saath. `@app.task def add(a,b)` define karo jo `RUN_LOG` mein append kare. (a) `r = add.delay(2, 3)` -> `r.get() == 5`, `r.state == "SUCCESS"`. (b) `apply_async`. (c) `.s(1,1).apply()`. (d) direct call. `RUN_LOG` mein chaaron entries.',
        hint: '`from celery import Celery`. Eager mode runs `.delay()` synchronously in-process — no broker or worker needed. `.s(a, b)` is a "signature" (frozen call); `.apply()` runs a signature eagerly.',
        hintHi: '`from celery import Celery`. Eager mode `.delay()` ko in-process synchronously chalata hai. `.s(a, b)` ek "signature" hai; `.apply()` ek signature ko eagerly chalata hai.',
      },
      {
        task: 'Same Celery setup. `ATTEMPTS = {"flaky": 0}`. `@app.task(bind=True, max_retries=5) def flaky(self, n)`: increment `ATTEMPTS["flaky"]`; if `< 3`, `raise self.retry(exc=TransientError("x"), countdown=0)`; else return `n*10`. Assert `flaky.delay(7).get() == 70` and `ATTEMPTS["flaky"] == 3` (2 retries + 1 success). Then a second task with `autoretry_for=(TransientError,)` that always raises a *different* `PermanentError` — assert calling it raises `PermanentError` and its attempt counter is `1` (not retried).',
        taskHi: 'Wahi Celery setup. `@app.task(bind=True, max_retries=5) def flaky(self, n)`: `ATTEMPTS` badhao; agar `< 3`, `raise self.retry(...)`; warna `n*10`. Assert `flaky.delay(7).get() == 70` aur `ATTEMPTS == 3`. Phir ek doosra task `autoretry_for=(TransientError,)` ke saath jo hamesha ek alag `PermanentError` raise karta hai — assert `PermanentError` raise hota hai aur attempt counter `1` hai.',
        hint: '`task_eager_propagates=False` is what lets the eager retry loop actually run in-process. `autoretry_for` only catches the listed exception types — a `PermanentError` propagates on the first attempt.',
        hintHi: '`task_eager_propagates=False` hi eager retry loop ko in-process chalne deta hai. `autoretry_for` sirf listed exception types catch karta hai.',
      },
      {
        task: 'Same Celery setup + model `Order` (`total`, `charged` bool). `@app.task def charge_order(order_id)`: fetch the order; if `order.charged` return `"noop"`; else append to `CHARGES`, set `charged=True`, save, return `"charged"`. (a) `with transaction.atomic():` create an order and `transaction.on_commit(lambda: charge_order.delay(o.id))`; after the block assert `CHARGES == [o.id]`. (b) call `charge_order.delay(o.id).get()` again -> assert it returns `"noop"` and `CHARGES` is unchanged. (c) in a new `atomic()` block, create another order, register the on_commit, then `raise RuntimeError`; catch it; assert `CHARGES` still has only the first id.',
        taskHi: 'Wahi setup + `Order` (`total`, `charged`) model. `@app.task def charge_order(order_id)`: order fetch; agar `charged` return `"noop"`; warna `CHARGES` mein append, `charged=True`, save. (a) `atomic()` mein order banao + `on_commit(lambda: charge_order.delay(o.id))`; block ke baad `CHARGES == [o.id]`. (b) `charge_order.delay(o.id).get()` phir -> `"noop"`, `CHARGES` unchanged. (c) naye `atomic()` mein doosra order, on_commit register, `raise RuntimeError`; catch; `CHARGES` mein sirf pehli id.',
        hint: '`transaction.on_commit` fires the lambda only after a successful commit. In eager mode the `.delay()` inside the lambda runs the task synchronously at commit time. The `if order.charged: return` line is the idempotency guard that makes the redelivery in (b) a no-op.',
        hintHi: '`transaction.on_commit` lambda ko sirf ek safal commit ke baad fire karta hai. Eager mode mein lambda ke andar `.delay()` commit time par task synchronously chalata hai. `if order.charged: return` line idempotency guard hai.',
      },
    ],

    keyTakeaways: [
      'Celery = broker (Redis/RabbitMQ, holds the queue) + worker processes (run the tasks) + optional result backend (task state/values). View calls `task.delay(args)` -> pushes a message -> returns immediately; a worker runs it later.',
      '`@shared_task` (app-agnostic, use in reusable code) or `@app.task`. Call with `.delay(*args)` or `.apply_async(args, kwargs, countdown=, eta=, queue=, priority=)`. Calling `task(args)` directly RUNS IT INLINE — defeats the point.',
      'PASS IDs, NOT OBJECTS: `task.delay(user.id)` + re-fetch inside the task. Serialising the object bloats the message and gives the worker a stale snapshot.',
      'Enqueue with `transaction.on_commit(lambda: task.delay(obj.id))` — otherwise a fast worker `SELECT`s the row before the transaction commits (`DoesNotExist`), or a rollback leaves a task enqueued for a nonexistent row.',
      'Retries: `bind=True` + `self.retry(exc=exc)`, or `autoretry_for=(ExcType,)`. `retry_backoff=True` (exponential delay) + `retry_jitter=True` (so a fleet of failures doesn\'t retry in lockstep). Bound `max_retries`. Retry TRANSIENT failures only — let PERMANENT ones (4xx, validation) fail to the dead-letter queue.',
      'IDEMPOTENCY IS MANDATORY: brokers deliver AT-LEAST-once, never exactly-once (worker crash + `acks_late`, retry after a succeeded side effect, double-enqueue). Guard with check-then-act on a marker (+ `select_for_update`), an idempotency-key table, naturally-idempotent ops, or an external idempotency key.',
      '`acks_late=True` + idempotency = the standard combo for must-not-lose tasks: the task is ack\'d only after finishing (crash -> redelivery), and idempotency makes redelivery safe.',
      'Testing: `CELERY_TASK_ALWAYS_EAGER = True` (+ `TASK_EAGER_PROPAGATES`) runs `.delay()` synchronously in-process, no broker/worker. Celery Beat = cron-like scheduler (only enqueues). Flower = web dashboard. `task_time_limit`/`task_soft_time_limit` stop runaways. Separate queues + dedicated workers isolate slow work. For small apps, Django 5.1+ `django.tasks` may be enough.',
    ],
    keyTakeawaysHi: [
      'Celery = broker (Redis/RabbitMQ, queue rakhta hai) + worker processes (tasks chalate hain) + optional result backend. View `task.delay(args)` call karta hai -> ek message push -> turant return; ek worker ise baad mein chalata hai.',
      '`@shared_task` (app-agnostic, reusable code mein) ya `@app.task`. `.delay(*args)` ya `.apply_async(...)` se call karo. `task(args)` seedhe call karna ISE INLINE CHALATA HAI — point hi khatam.',
      'IDs PASS karo, OBJECTS NAHI: `task.delay(user.id)` + task ke andar re-fetch. Object serialise karna message bloat karta hai aur worker ko ek stale snapshot deta hai.',
      '`transaction.on_commit(lambda: task.delay(obj.id))` se enqueue karo — warna ek tez worker row ko transaction commit hone se pehle `SELECT` karta hai (`DoesNotExist`), ya ek rollback ek nonexistent row ke liye ek task enqueued chhodta hai.',
      'Retries: `bind=True` + `self.retry(exc=exc)`, ya `autoretry_for=(ExcType,)`. `retry_backoff=True` + `retry_jitter=True`. `max_retries` bound karo. Sirf TRANSIENT failures retry karo — PERMANENT (4xx, validation) ko dead-letter queue par fail hone do.',
      'IDEMPOTENCY ZAROORI hai: brokers AT-LEAST-once deliver karte hain, kabhi exactly-once nahi. Ek marker par check-then-act (+ `select_for_update`), ek idempotency-key table, naturally-idempotent ops, ya ek external idempotency key se guard karo.',
      '`acks_late=True` + idempotency = must-not-lose tasks ke liye standard combo: task sirf khatam hone ke baad ack hota hai (crash -> redelivery), aur idempotency redelivery ko surakshit banati hai.',
      'Testing: `CELERY_TASK_ALWAYS_EAGER = True` `.delay()` ko in-process synchronously chalata hai. Celery Beat = cron-jaisa scheduler. Flower = web dashboard. `task_time_limit` runaways rokta hai. Alag queues slow work isolate karti hain. Chhote apps ke liye Django 5.1+ `django.tasks` kaafi ho sakta hai.',
    ],
  },
];
