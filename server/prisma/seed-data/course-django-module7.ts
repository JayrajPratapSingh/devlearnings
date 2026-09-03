/**
 * Django Complete Course — Module 7: Caching & Performance at Scale, lessons 1-3.
 *
 * Lesson 1: the cache framework — CACHES, backends, the low-level API
 *           (set/get/add/get_or_set/get_many/set_many/incr/delete/touch), TIMEOUT,
 *           KEY_PREFIX / VERSION / make_key, what is safe to cache, pickling.
 * Lesson 2: per-view, fragment & per-site caching — @cache_page, cache_page in urls,
 *           @vary_on_headers / @vary_on_cookie, the Vary header, the per-site middleware
 *           pair, template {% cache %}, the "don't cache authenticated pages" trap.
 * Lesson 3: cache invalidation & stampede — short TTL vs key-versioning vs explicit
 *           delete (signals / service layer), cache-aside vs write-through,
 *           the thundering herd + get_or_set + a lock, cached_property.
 *
 * NOTE for future editors: same conventions as course-django-module6.ts.
 *  - Every backtick inside simple/simpleHi/content/contentHi is `\``; `\${` for `$`+`{`.
 *  - `examples` use `code` + `output`, ASCII-only output, run with the auto-detected python.
 *  - A DRF example with APIClient needs "django.contrib.auth" in INSTALLED_APPS.
 *  - Cache examples: CACHES={"default":{"BACKEND":"django.core.cache.backends.locmem.LocMemCache"}}.
 *  - Scan for Devanagari/Cyrillic in en/code. `npx tsc --noEmit -p .` from server/.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_7: CourseLesson[] = [
  {
    slug: 'dj-cache-framework',
    title: 'The Cache Framework: `CACHES`, Backends, the Low-Level API',
    titleHi: 'Cache Framework: `CACHES`, Backends, Low-Level API',
    description: 'Django gives you one cache API (`from django.core.cache import cache`) over a swappable backend configured in `CACHES`. In production that backend is Redis or Memcached — a shared, fast key-value store. The low-level API (`get`, `set`, `add`, `get_or_set`, `incr`, `delete`) is what you reach for when per-view caching is too blunt.',
    descriptionHi: 'Django aapको ek cache API (`from django.core.cache import cache`) deता hai ek swappable backend ke upar jо `CACHES` mein configure hoता hai. Production mein wo backend Redis ya Memcached hai — ek shared, tez key-value store. Low-level API (`get`, `set`, `add`, `get_or_set`, `incr`, `delete`) wo hai jiske liye aap pahुँchते ho jab per-view caching bahut blunt hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A shared whiteboard by the office door where anyone can jot down an answer they just worked out, with a "wipe by" time next to each note.** Someone spends ten minutes computing the quarterly totals; instead of everyone else redoing that, they write it on the board with "wipe by 3pm". The next person who needs it reads the board (`cache.get`) — instant. If it is not there, or the wipe-time has passed, they do the work and post it themselves (`cache.set`). The board is shared across the whole floor (Redis: every server instance sees the same notes), unlike a sticky note on your own monitor (per-process memory: only you see it, and it is gone when you reboot). A few refinements: `add` only writes if that spot is blank (so two people do not both claim it); `get_or_set` is "read it, or if blank, compute-and-post in one motion"; `incr` bumps a tally without erasing and rewriting. The board holds *derived* answers you could always recompute — never the only copy of something.',
      hi: '**Office darvaze ke paas ek shared whiteboard jahaan koi bhi ek answer likh sakta hai jо unhone abhi nikaala, har note ke bagal mein ek "wipe by" time ke saath.** Koi das minute quarterly totals compute karता hai; baaki sab ke dobara karने ke bजाy, wo ise board par "wipe by 3pm" ke saath likhता hai. Agli vyakti jise iski zaroorat hai board padhता hai (`cache.get`) — instant. Agar wo wahaan nahi, ya wipe-time guzar gaya, wo kaam karता hai aur ise khud post karता hai (`cache.set`). Board poore floor mein shared hai (Redis: har server instance wahi notes dekhता hai), aapke apne monitor par ek sticky note ke vipरीt (per-process memory: sirf aap dekhते ho, aur reboot par chala jाता hai). Kuch refinements: `add` sirf tab likhता hai agar wo jagah khali hai; `get_or_set` "padhо, ya khali ho toh ek motion mein compute-and-post" hai; `incr` ek tally bump karता hai bina mitाye. Board *derived* answers rakhता hai jinhe aap hamesha recompute kar sakte ho.',
    },

    simple: `**\`CACHES\` — the backend**

\`\`\`python
# settings.py
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",   # Django 4+ built-in Redis
        "LOCATION": "redis://127.0.0.1:6379/1",
        "TIMEOUT": 300,                       # default TTL in seconds (None = forever, 0 = don't cache)
        "KEY_PREFIX": "myapp",                # every key becomes "myapp:1:<key>"
        "VERSION": 1,                         # bump to invalidate ALL keys at once
    },
    # a second alias for a different concern:
    "sessions": {"BACKEND": "django.core.cache.backends.redis.RedisCache",
                 "LOCATION": "redis://127.0.0.1:6379/2"},
}
\`\`\`

\`\`\`
LocMemCache        per-process dict. Dev only -- NOT shared across gunicorn workers, wiped on restart.
RedisCache         production default. Shared, fast, supports TTL, incr, pipelines. (django-redis adds more)
PyMemcacheCache    production alt. Shared, fast, simple. No delete_pattern, values > 1MB rejected.
DatabaseCache      a table. Slow-ish but no extra service. createcachetable first.
FileBasedCache     files on disk. Small single-server setups.
DummyCache         no-op. Use in tests to disable caching without code changes.
\`\`\`

**The low-level API**

\`\`\`python
from django.core.cache import cache

cache.set("stats:q3", data, timeout=600)         # write, 10-min TTL
cache.get("stats:q3")                            # value or None
cache.get("stats:q3", default=[])                # value or []
cache.add("lock:job42", "1", timeout=30)         # write ONLY if absent -> returns True/False
value = cache.get_or_set("expensive", compute_fn, timeout=300)   # get, or call compute_fn + set

cache.get_many(["a", "b", "c"])                  # {"a": ..., "b": ...}  (one round trip)
cache.set_many({"a": 1, "b": 2}, timeout=60)
cache.delete("stats:q3")
cache.delete_many(["a", "b"])
cache.touch("stats:q3", timeout=120)             # extend the TTL without re-writing the value

cache.incr("hits:2026-09-02")                    # atomic +1 (must be set first); incr(key, 5)
cache.decr("credits:7", 10)

# a non-default cache:
from django.core.cache import caches
caches["sessions"].get("...")
\`\`\`

**Cache the right things**

\`\`\`
CACHE:  derived / expensive-to-compute / rarely-changing / read-heavy
        - an aggregation query, a rendered template fragment, an external API response,
          a computed permission set, a config blob, a leaderboard
DON'T:  the source of truth, per-request-unique data, anything you cannot safely recompute,
        secrets (Redis is not encrypted at rest by default), huge blobs (Memcached caps at 1MB)
KEY:    stable + namespaced + includes every input that changes the value
        f"user:{user_id}:dashboard:v3"   NOT   "dashboard"
\`\`\`

\`\`\`
values are PICKLED (Redis/Memcached) -> must be picklable ; a QuerySet is cached as its evaluated list
timeout:  seconds ; None = never expire ; 0 (or negative) = expire immediately (effectively don't cache)
cache.set overwrites ; cache.add is set-if-absent ; get_or_set is the read-through pattern
KEY_PREFIX + VERSION + the key are combined by make_key -> "<prefix>:<version>:<key>"
LocMemCache is per-process: fine for @cached_property-style memoization, useless for shared state
\`\`\``,

    simpleHi: `**\`CACHES\` — backend**

\`\`\`python
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "TIMEOUT": 300,                       # default TTL seconds (None = forever, 0 = cache mat karो)
        "KEY_PREFIX": "myapp",                # har key "myapp:1:<key>" ban jाती hai
        "VERSION": 1,                         # SAARI keys ek saath invalidate karने ke liye bump karो
    },
}
\`\`\`

\`\`\`
LocMemCache        per-process dict. Sirf dev -- workers ke paar shared NAHI, restart par wipe.
RedisCache         production default. Shared, tez, TTL, incr, pipelines.
PyMemcacheCache    production alt. Shared, tez, saral. Koi delete_pattern nahi, values > 1MB reject.
DatabaseCache      ek table. Thoड़ा dheema par koi extra service nahi.
DummyCache         no-op. Tests mein caching disable karने ke liye.
\`\`\`

**Low-level API**

\`\`\`python
from django.core.cache import cache

cache.set("stats:q3", data, timeout=600)         # write, 10-min TTL
cache.get("stats:q3")                            # value ya None
cache.add("lock:job42", "1", timeout=30)         # SIRF tab write agar absent -> True/False
value = cache.get_or_set("expensive", compute_fn, timeout=300)   # get, ya compute_fn call + set

cache.get_many(["a", "b", "c"])                  # {"a": ..., "b": ...}  (ek round trip)
cache.set_many({"a": 1, "b": 2}, timeout=60)
cache.delete("stats:q3")
cache.touch("stats:q3", timeout=120)             # TTL extend, value re-write kiye bina

cache.incr("hits:2026-09-02")                    # atomic +1 (pehle set hona chahिए); incr(key, 5)

from django.core.cache import caches
caches["sessions"].get("...")
\`\`\`

**Sahi cheezein cache karो**

\`\`\`
CACHE:  derived / expensive / kam badalने waali / read-heavy
        - ek aggregation query, ek rendered template fragment, ek external API response,
          ek computed permission set, ek config blob, ek leaderboard
NAHI:   source of truth, per-request-unique data, jо aap safely recompute nahi kar sakte,
        secrets (Redis default se encrypted nahi), huge blobs (Memcached 1MB par cap)
KEY:    stable + namespaced + har input sहित jо value badalता hai
        f"user:{user_id}:dashboard:v3"   NAHI   "dashboard"
\`\`\`

\`\`\`
values PICKLED hote hain (Redis/Memcached) -> picklable hona chahिए ; ek QuerySet iski evaluated list ke roop mein cache
timeout:  seconds ; None = kabhi expire nahi ; 0 = turant expire (effectively cache mat karो)
cache.set overwrite karта hai ; cache.add set-if-absent hai ; get_or_set read-through pattern hai
KEY_PREFIX + VERSION + key ko make_key combine karता hai -> "<prefix>:<version>:<key>"
LocMemCache per-process hai: @cached_property-style memoization ke liye theek, shared state ke liye bekaar
\`\`\``,

    content: `## One API, a swappable backend

\`from django.core.cache import cache\` is a proxy to \`CACHES["default"]\`. \`caches["name"]\` gets a non-default alias. The API is identical across backends — you develop against \`LocMemCache\` and deploy against \`RedisCache\` with no code change.

### Backends

- **\`LocMemCache\`** (Django default if you configure nothing): an in-process dict per worker. It is **not shared** — with \`gunicorn -w 4\` you have 4 independent caches, and a restart wipes them. Fine for local dev and for genuinely per-process memoization; wrong for anything that needs to be consistent across requests handled by different workers (which is most things, including throttling — Module 6).
- **\`RedisCache\`** (\`django.core.cache.backends.redis.RedisCache\`, built in since Django 4.0): the standard production choice. Shared, sub-millisecond, native TTL, atomic \`incr\`, and — via the \`django-redis\` package — extras like \`cache.keys("pattern:*")\`, \`cache.delete_pattern\`, per-key client selection, and connection pooling.
- **\`PyMemcacheCache\` / \`PyLibMCCache\`**: Memcached. Also shared and fast, simpler than Redis, but no pattern deletion, no persistence, and a hard **1 MB** value limit.
- **\`DatabaseCache\`**: a real table (\`python manage.py createcachetable\`). No extra infrastructure, but every cache hit is a DB query — only worth it when the cached thing is much more expensive than a single indexed \`SELECT\`.
- **\`FileBasedCache\`**, **\`DummyCache\`** (no-op, for tests).

### Config keys

- **\`TIMEOUT\`** — the default TTL in seconds for \`set\` calls that do not pass one. \`None\` = never expire. \`0\` (or omitting and setting the backend default to 0) = do not cache.
- **\`KEY_PREFIX\`** — prepended to every key. Use it to namespace multiple apps sharing one Redis instance.
- **\`VERSION\`** — an integer folded into every key. Bumping it (a deploy-time change) instantly invalidates the entire cache without a flush — the old keys just become unreachable and expire on their own.
- **\`OPTIONS\`** — backend-specific (connection pool size, socket timeout, serializer, compressor).

Keys are built by \`make_key(key, version)\` → \`"{KEY_PREFIX}:{version}:{key}"\`. You can override \`KEY_FUNCTION\` for a custom scheme.

## The low-level API

| Call | Does |
|---|---|
| \`cache.set(key, value, timeout=)\` | write / overwrite |
| \`cache.get(key, default=None)\` | read; returns \`default\` on miss |
| \`cache.add(key, value, timeout=)\` | write **only if the key is absent**; returns \`True\`/\`False\` — a cheap lock primitive |
| \`cache.get_or_set(key, default, timeout=)\` | read; on miss, call \`default\` (a value or a callable), \`set\` it, return it |
| \`cache.get_many([k1, k2])\` / \`set_many({...})\` / \`delete_many([...])\` | batched, one round trip |
| \`cache.incr(key, delta=1)\` / \`decr\` | **atomic** integer arithmetic; the key must already be set (raises \`ValueError\` otherwise) |
| \`cache.touch(key, timeout=)\` | reset the TTL without re-serialising the value |
| \`cache.delete(key)\` / \`cache.clear()\` | remove one / remove everything (\`clear\` also drops other apps' keys if they share the prefix — be careful) |

### Serialization

Redis and Memcached store **pickled** bytes, so a cached value must be picklable. A model instance is picklable (it stores the field values, not a live DB connection). A \`QuerySet\` is cached as its **evaluated result list** — caching \`Article.objects.filter(...)\` freezes the rows at cache time; it does not re-run when you read it back. Prefer caching plain data (dicts, lists, serializer output) over ORM objects to avoid stale-relation surprises.

## What to cache

Cache things that are **expensive to produce**, **read far more than written**, and **safe to serve slightly stale**:

- aggregation / reporting queries (\`Order.objects.aggregate(...)\` over millions of rows),
- rendered template fragments (a sidebar, a nav menu built from the DB),
- responses from a slow third-party API,
- a computed permission matrix or feature-flag blob,
- a leaderboard, a "trending" list, a homepage.

Do **not** cache:

- the source of truth (the cache is a copy; the DB is authoritative),
- data unique to one request (there is no reuse),
- anything you cannot regenerate on a miss,
- large blobs on Memcached (1 MB cap) or secrets (Redis is plaintext at rest unless you configure otherwise).

## Key design

A cache key must include **every input that changes the value**. A dashboard that differs per user and per date needs \`f"dash:{user_id}:{date}"\`, not \`"dash"\`. Namespace with a prefix (\`"report:"\`), and put a version segment in the key (\`":v3"\`) so you can invalidate a class of keys by bumping the version in code rather than deleting individually (lesson 3).`,

    contentHi: `## Ek API, ek swappable backend

\`from django.core.cache import cache\` \`CACHES["default"]\` ka ek proxy hai. \`caches["name"]\` ek non-default alias deता hai. API sab backends ke paar identical hai — aap \`LocMemCache\` ke khilaf develop karते ho aur \`RedisCache\` ke khilaf deploy karते ho bina code change ke.

### Backends

- **\`LocMemCache\`**: prati worker ek in-process dict. Ye **shared nahi** — \`gunicorn -w 4\` ke saath aapke paas 4 independent caches hain, aur ek restart unhe wipe karता hai. Local dev ke liye theek; kisi bhi cheez ke liye galat jise different workers ke paar consistent hona chahिए (jaise throttling — Module 6).
- **\`RedisCache\`** (Django 4.0+ built-in): standard production chunaव. Shared, sub-millisecond, native TTL, atomic \`incr\`, aur \`django-redis\` ke zariye extras jaise \`cache.delete_pattern\`.
- **\`PyMemcacheCache\`**: Memcached. Shared aur tez, saral, par koi pattern deletion nahi, koi persistence nahi, aur ek hard **1 MB** value limit.
- **\`DatabaseCache\`**: ek asli table. Koi extra infrastructure nahi, par har cache hit ek DB query hai.
- **\`DummyCache\`** (no-op, tests ke liye).

### Config keys

- **\`TIMEOUT\`** — default TTL seconds mein. \`None\` = kabhi expire nahi. \`0\` = cache mat karो.
- **\`KEY_PREFIX\`** — har key ke aage. Ek Redis instance share karने waale kai apps ko namespace karने ko.
- **\`VERSION\`** — har key mein folded ek integer. Ise bump karna (ek deploy-time change) poore cache ko turant invalidate karता hai bina flush ke.

Keys \`make_key(key, version)\` dwara bante hain → \`"{KEY_PREFIX}:{version}:{key}"\`.

## Low-level API

- \`cache.set(key, value, timeout=)\` — write / overwrite.
- \`cache.get(key, default=None)\` — read; miss par \`default\`.
- \`cache.add(key, value, timeout=)\` — **sirf tab write agar key absent hai**; \`True\`/\`False\` — ek sasta lock primitive.
- \`cache.get_or_set(key, default, timeout=)\` — read; miss par \`default\` call karो, \`set\` karो, return karो.
- \`cache.get_many\` / \`set_many\` / \`delete_many\` — batched.
- \`cache.incr(key, delta=1)\` / \`decr\` — **atomic** integer arithmetic; key pehle se set hona chahिए.
- \`cache.touch(key, timeout=)\` — TTL reset, value re-serialise kiye bina.
- \`cache.delete(key)\` / \`cache.clear()\`.

### Serialization

Redis aur Memcached **pickled** bytes store karते hain. Ek model instance picklable hai. Ek \`QuerySet\` iski **evaluated result list** ke roop mein cache hoता hai — \`Article.objects.filter(...)\` cache karna rows ko cache time par freeze karता hai. Plain data (dicts, lists, serializer output) cache karना prefer karो.

## Kya cache karें

Wo cheezein cache karो jо **produce karna mehenga**, **write se kahीं zyada read**, aur **thoड़ा stale serve karna surakshit** hain: aggregation queries, rendered template fragments, ek slow third-party API se responses, ek computed permission matrix, ek leaderboard.

Cache **mat** karो: source of truth, ek request ke liye unique data, jо aap miss par regenerate nahi kar sakte, Memcached par bade blobs ya secrets.

## Key design

Ek cache key mein **har input jо value badalता hai** shामil hona chahिए. Ek dashboard jо prati user aur prati date alag hai use \`f"dash:{user_id}:{date}"\` chahिए, \`"dash"\` nahi. Ek prefix se namespace karो, aur key mein ek version segment daalो (\`":v3"\`) taaki aap version bump karके keys ka ek class invalidate kar sako (lesson 3).`,

    examples: [
      {
        title: 'The low-level API: set / get / add / get_or_set / incr / touch',
        titleHi: 'Low-level API: set / get / add / get_or_set / incr / touch',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=[], USE_TZ=True,
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}})
django.setup()

from django.core.cache import cache
import time

# set + get + default
cache.set("stats:q3", {"revenue": 42000}, timeout=60)
print("get hit:", cache.get("stats:q3"))
print("get miss:", cache.get("stats:q4"), "| with default:", cache.get("stats:q4", default={}))

# add: write only if absent
print("add to a free key:", cache.add("lock:job", "1", timeout=30))
print("add to a taken key:", cache.add("lock:job", "2", timeout=30))
print("value unchanged:", cache.get("lock:job"))

# get_or_set: the read-through pattern
COMPUTED = []
def expensive():
    COMPUTED.append(1)
    return sum(range(1000))
print("first call computes:", cache.get_or_set("agg", expensive, timeout=60))
print("second call is cached:", cache.get_or_set("agg", expensive, timeout=60))
print("expensive() ran:", len(COMPUTED), "time(s)")

# incr: atomic, key must exist
cache.set("hits", 0)
cache.incr("hits")
cache.incr("hits", 10)
print("hits:", cache.get("hits"))
try:
    cache.incr("never_set")
except ValueError as e:
    print("incr on missing key:", type(e).__name__)

# touch: extend TTL without re-writing
cache.set("short", "x", timeout=1)
cache.touch("short", timeout=60)
time.sleep(1.2)
print("still alive after original TTL passed:", cache.get("short"))

# batched
cache.set_many({"a": 1, "b": 2, "c": 3}, timeout=60)
print("get_many:", cache.get_many(["a", "b", "z"]))`,
        output: `get hit: {'revenue': 42000}
get miss: None | with default: {}
add to a free key: True
add to a taken key: False
value unchanged: 1
first call computes: 499500
second call is cached: 499500
expensive() ran: 1 time(s)
hits: 11
incr on missing key: ValueError
still alive after original TTL passed: x
get_many: {'a': 1, 'b': 2}
`,
        explain: 'One cache object, one API, over a swappable backend. set stores a picklable value with a TTL; get returns None (or your default) on a miss. add writes only if the key is absent -- the second add returns False and the value is untouched, which is the basis of a lock. get_or_set(key, callable) is the read-through pattern: compute-and-store on a miss, and the callable runs exactly once. incr is atomic but the key must already exist (a missing key raises ValueError, here shown as the incr-on-missing line) -- it is for counters you seeded with set(key, 0). touch extends a TTL without rewriting the value. set_many / get_many batch round trips; get_many silently omits missing keys.',
        explainHi: 'Ek cache object, ek API, ek swappable backend ke upar. set ek picklable value ek TTL ke saath store karta hai; get ek miss par None lautata hai. add sirf tab likhta hai jab key absent hai -- doosra add False lautata hai, jo ek lock ka aadhaar hai. get_or_set(key, callable) read-through pattern hai: ek miss par compute-and-store, aur callable theek ek baar chalta hai. incr atomic hai par key pehle se honi chahiye (ek missing key ValueError raise karta hai) -- ye un counters ke liye hai jinhe aapne set(key, 0) se seed kiya. touch ek TTL extend karta hai bina value rewrite kiye. set_many / get_many round trips batch karte hain.',
      },
      {
        title: 'KEY_PREFIX + VERSION: how keys are built, and version-bump invalidation',
        titleHi: 'KEY_PREFIX + VERSION: keys kaise bante hain, aur version-bump invalidation',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, INSTALLED_APPS=[], USE_TZ=True,
    CACHES={"default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "KEY_PREFIX": "myapp",
        "VERSION": 1,
    }})
django.setup()

from django.core.cache import cache

cache.set("dashboard", {"widgets": 3}, timeout=300)
print("stored under logical key 'dashboard'")

# what the backend actually keys it as:
print("make_key ->", cache.make_key("dashboard"))          # "<prefix>:<version>:<key>"

# reading with the current version -> hit
print("get (version 1):", cache.get("dashboard"))

# reading with a different explicit version -> miss (different physical key)
print("get (version 2):", cache.get("dashboard", version=2))

# writing an explicit version, then bumping the whole cache's VERSION would strand v1 keys:
cache.set("dashboard", {"widgets": 99}, timeout=300, version=2)
print("v1 still:", cache.get("dashboard", version=1))
print("v2 new:", cache.get("dashboard", version=2))

# incr_version / decr_version move a single key between versions
cache.set("counter", 5, version=1)
cache.incr_version("counter")            # counter now lives at version 2
print("counter at v1:", cache.get("counter", version=1), "| at v2:", cache.get("counter", version=2))`,
        output: `stored under logical key 'dashboard'
make_key -> myapp:1:dashboard
get (version 1): {'widgets': 3}
get (version 2): None
v1 still: {'widgets': 3}
v2 new: {'widgets': 99}
counter at v1: None | at v2: 5
`,
        explain: "Every logical key you pass is transformed before it reaches the backend: make_key joins KEY_PREFIX, VERSION, and your key into 'myapp:1:dashboard'. Two consequences. First, two Django projects (or a test run and a dev run) can share one Redis safely if they use different KEY_PREFIX values. Second, VERSION is a namespace: reading 'dashboard' at version=2 is a different physical key, so it misses even though version 1 holds a value. incr_version moves a single key to the next version (so the old physical key is orphaned); bumping the CACHES VERSION setting orphans every key at once -- the mass-invalidation trick from lesson 3.",
        explainHi: "Har logical key jo aap pass karte ho backend tak pahunchne se pehle transform hota hai: make_key KEY_PREFIX, VERSION, aur aapki key ko 'myapp:1:dashboard' mein jodta hai. Do parinam. Pehla, do Django projects ek Redis surakshit share kar sakte hain agar wo alag KEY_PREFIX istemal karein. Doosra, VERSION ek namespace hai: 'dashboard' ko version=2 par padhna ek alag physical key hai, toh ye miss hota hai. incr_version ek single key ko agle version par le jata hai; CACHES VERSION setting bump karna har key ko ek saath orphan karta hai.",
      },
      {
        title: 'Caching an expensive aggregation, keyed by its inputs',
        titleHi: 'Ek expensive aggregation cache karna, iske inputs se keyed',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}})
django.setup()

from django.db import models, connection
from django.db.models import Sum, Count
from django.test.utils import CaptureQueriesContext
from django.core.cache import cache

class Sale(models.Model):
    region = models.CharField(max_length=20)
    amount = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Sale)
Sale.objects.bulk_create([Sale(region=r, amount=a)
    for r in ("north", "south") for a in range(1, 51)])

def region_report(region):
    key = f"report:sales:{region}:v1"
    cached = cache.get(key)
    if cached is not None:
        return cached, "HIT"
    data = Sale.objects.filter(region=region).aggregate(total=Sum("amount"), n=Count("id"))
    cache.set(key, data, timeout=300)
    return data, "MISS"

with CaptureQueriesContext(connection) as ctx:
    r1, s1 = region_report("north")
    r2, s2 = region_report("north")            # served from cache -> no query
    r3, s3 = region_report("south")            # different key -> one query
print("north 1:", r1, s1)
print("north 2:", r2, s2)
print("south  :", r3, s3)
print("total DB queries for 3 report calls:", len(ctx.captured_queries), "(2 misses, 1 hit)")`,
        output: `north 1: {'total': 1275, 'n': 50} MISS
north 2: {'total': 1275, 'n': 50} HIT
south  : {'total': 1275, 'n': 50} MISS
total DB queries for 3 report calls: 2 (2 misses, 1 hit)
`,
        explain: "Cache-aside at the function level: build a key from the inputs that determine the result ('report:sales:north:v1'), check the cache, and on a miss run the aggregation and store it. The second call for 'north' is a HIT and issues zero queries; 'south' is a different key so it misses once. Three calls, two queries. The version segment ('v1') in the key is deliberate -- when the report logic or the Sale schema changes you bump it in code and every stale report is instantly bypassed without touching the cache store.",
        explainHi: "Function level par cache-aside: un inputs se ek key banao jo result decide karte hain ('report:sales:north:v1'), cache check karo, aur ek miss par aggregation chalao aur store karo. 'north' ke liye doosra call ek HIT hai aur zero queries issue karta hai; 'south' ek alag key hai toh ye ek baar miss hota hai. Teen calls, do queries. Key mein version segment ('v1') jaan-boojhkar hai -- jab report logic badalta hai aap ise code mein bump karte ho aur har stale report turant bypass ho jati hai.",
      },
    ],

    mistakes: [
      {
        wrong: `# settings.py -- production, running gunicorn -w 4
CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}
# every worker has its own cache: hit rate is ~1/4 of what you expect, and it resets on each deploy`,
        right: `CACHES = {"default": {
    "BACKEND": "django.core.cache.backends.redis.RedisCache",
    "LOCATION": "redis://cache:6379/1",
}}
# one shared cache across all workers, survives restarts`,
        why: '`LocMemCache` is a per-process Python dict. Under any multi-worker server (gunicorn, uWSGI) each worker caches independently, so a value set while handling one request is invisible to the next request if it lands on a different worker — the effective hit rate collapses and the cache is inconsistent. It also vanishes on every restart. Production caching (and throttling, and session cache) needs a shared backend: Redis or Memcached.',
        whyHi: '`LocMemCache` ek per-process Python dict hai. Kisi bhi multi-worker server ke tahat har worker independently cache karता hai, toh ek request handle karते waqt set ki value agli request ko invisible hai agar wo ek different worker par land karती hai — effective hit rate girता hai aur cache inconsistent hai. Production caching ko ek shared backend chahिए: Redis ya Memcached.',
      },
      {
        wrong: `def get_user_orders(user):
    cached = cache.get("user_orders")           # key does not include the user!
    if cached:
        return cached
    orders = list(Order.objects.filter(customer=user))
    cache.set("user_orders", orders, 300)
    return orders
# user A's orders are served to user B for the next 5 minutes`,
        right: `def get_user_orders(user):
    key = f"user_orders:{user.id}:v1"            # every input that changes the value
    return cache.get_or_set(key, lambda: list(Order.objects.filter(customer=user)), 300)`,
        why: 'A cache key must encode every input that affects the value — the user id here. A shared key like `"user_orders"` means whoever populates it first wins, and everyone else gets that user\'s data until the TTL expires. This is a data-leak bug, not just a correctness bug. Build keys from all the relevant inputs (user, tenant, filters, date, locale) plus a version segment.',
        whyHi: 'Ek cache key mein har input encode hona chahिए jо value ko affect karता hai — yahaan user id. `"user_orders"` jaisा ek shared key ka matlab jо ise pehle populate karता hai jeetता hai, aur baaki sab ko us user ka data milता hai jab tak TTL expire nahi hoता. Ye ek data-leak bug hai. Keys ko sab relevant inputs se banाओ.',
      },
      {
        wrong: `cache.set("published_articles", Article.objects.filter(status="published"), 600)
later = cache.get("published_articles")
# 'later' is NOT a live queryset -- it is the list of rows frozen at set() time.
# A new article published 2 minutes ago is missing until the TTL expires.`,
        right: `cache.set("published_articles",
          list(Article.objects.filter(status="published").values("id", "title", "slug")),
          600)
# cache plain data explicitly, and choose a TTL / invalidation you can live with (lesson 3)`,
        why: 'Caching a `QuerySet` stores its *evaluated* result — Django pickles the rows, not the query. Reading it back does not re-hit the database, so the cached list is exactly as stale as its age. That is often the point of caching, but be explicit: cache `list(qs.values(...))` (small, obviously frozen) rather than a `QuerySet` (looks live, is not), and pick an invalidation strategy for when "up to 10 minutes stale" is not acceptable.',
        whyHi: 'Ek `QuerySet` cache karna iski *evaluated* result store karता hai — Django rows pickle karता hai, query nahi. Ise wapas padhna database ko dobara hit nahi karता, toh cached list bilkul utni hi stale hai jitni iski age. Explicit raho: `list(qs.values(...))` cache karo (chhota, spashtly frozen) ek `QuerySet` ke bजाy (live dikhता hai, nahi hai).',
      },
    ],

    realWorld: [
      {
        en: '**One Redis, several logical concerns via `KEY_PREFIX` or DB numbers** — `CACHES["default"]` for app data, a separate alias for `django-rq`/Celery results, another for the throttle cache, sessions in `SESSION_ENGINE = "django.contrib.sessions.backends.cache"`. `KEY_PREFIX = env("APP_NAME")` so staging and prod on the same box do not collide.',
        hi: '**Ek Redis, `KEY_PREFIX` ya DB numbers ke zariye kai logical concerns** — app data ke liye `CACHES["default"]`, Celery results ke liye ek alag alias, throttle cache ke liye ek aur. `KEY_PREFIX = env("APP_NAME")`.',
      },
      {
        en: '**`get_or_set` around every slow third-party call** — `cache.get_or_set(f"fx:{base}:{quote}", lambda: fetch_rate(base, quote), 3600)` so an exchange-rate API outage or slowness only hits the first request per hour per pair. The TTL is the acceptable staleness.',
        hi: '**Har slow third-party call ke aas-paas `get_or_set`** — `cache.get_or_set(f"fx:{base}:{quote}", lambda: fetch_rate(...), 3600)` taaki ek exchange-rate API outage sirf prati ghante prati pair pehli request ko hit kare.',
      },
      {
        en: '**A version segment in every key (`":v7"`), bumped in a constant on deploy when the shape changes** — no flush, no `delete_pattern` scan; the old keys become unreachable and expire on their own TTL. `KEY = f"report:{org}:{month}:{settings.REPORT_CACHE_VERSION}"`.',
        hi: '**Har key mein ek version segment (`":v7"`), deploy par ek constant mein bump jab shape badalता hai** — koi flush nahi; purani keys unreachable ho jाती hain aur apni TTL par expire hoती hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is `LocMemCache` unsuitable for production, and what do you use instead?',
        qHi: '`LocMemCache` production ke liye unsuitable kyun hai, aur aap iske bजाy kya istemal karते ho?',
        a: 'LocMemCache stores cached values in an ordinary Python dictionary that lives inside a single process. In production you almost always run several worker processes — gunicorn with a handful of workers, or multiple containers — and each of those has its own independent LocMemCache. So a value written while serving one request is only visible to subsequent requests that happen to be routed to the same worker; a request handled by a sibling worker sees a miss and recomputes. Your effective cache hit rate is roughly one over the number of workers, and the caches drift out of sync with each other. On top of that, the dict is process memory, so every deploy or restart wipes it completely, and it competes with your application for RAM within each worker. It is genuinely fine for local development, for tests, and for the narrow case of per-process memoization where you actually want each worker to have its own copy. For real caching you use a shared, out-of-process store: Redis is the usual choice, built into Django since 4.0, giving sub-millisecond reads, native TTLs, atomic increment, and pipelining; Memcached is the simpler alternative with a one-megabyte value cap and no persistence. The same shared store is also what throttling and cache-backed sessions require for the same reason.',
        aHi: 'LocMemCache cached values ko ek saadharan Python dictionary mein store karता hai jо ek single process ke andar rehती hai. Production mein aap lगbhag hamesha kai worker processes chalाते ho — gunicorn kuch workers ke saath, ya kai containers — aur unmें se har ek ka apna independent LocMemCache hai. Toh ek request serve karते waqt likhी value sirf agli requests ko visible hai jо usi worker par route hoती hain; ek sibling worker dwara handle ki request ek miss dekhती hai aur recompute karती hai. Aapka effective cache hit rate lगbhag ek batा workers ki sankhya hai, aur caches ek doosre se drift kar jाते hain. Iske upar, dict process memory hai, toh har deploy ise poori tarah wipe karता hai. Ye local development, tests, aur per-process memoization ke narrow case ke liye theek hai. Asli caching ke liye aap ek shared, out-of-process store istemal karते ho: Redis usual chunaव hai.',
      },
      {
        q: 'How does `cache.get_or_set` help, and when would `cache.add` be the better primitive?',
        qHi: '`cache.get_or_set` kaise madad karता hai, aur `cache.add` kab behtar primitive hoगा?',
        a: 'get_or_set implements the cache-aside read-through pattern in one call: it does a get, and if that misses it calls the default — which can be a plain value or a callable — stores the result with the given timeout, and returns it. Without it you write the same three-line dance everywhere: get, check for None, compute, set, return. get_or_set collapses that and makes the intent obvious. Its default is not distributed-lock safe, though — under a cache stampede several requests can miss simultaneously, all run the callable, and all set; get_or_set does not prevent that, it just avoids the boilerplate. add is a different primitive. It writes the key only if the key does not already exist, and returns a boolean telling you whether the write happened. That makes it a cheap, non-blocking lock: the first caller to run cache.add of lock-key, some-value, with a short timeout gets True and proceeds to do the expensive work; concurrent callers get False and can either wait and retry the read, or serve slightly stale data, or skip the work. You reach for add when you specifically need to ensure only one worker does something — regenerate a cache entry, run a scheduled job, send a notification — and the check-then-set has to be atomic. Redis and Memcached both implement add atomically on the server, so it is race-free across workers, which is exactly what a plain get-then-set is not.',
        aHi: 'get_or_set cache-aside read-through pattern ko ek call mein implement karता hai: ye ek get karता hai, aur agar wo miss hoता hai ye default call karता hai — jо ek plain value ya ek callable ho sakta hai — result ko diye timeout ke saath store karता hai, aur ise return karता hai. Iske bina aap har jagah wahi teen-line dance likhते ho: get, None check, compute, set, return. get_or_set ise collapse karता hai. Iska default distributed-lock safe nahi hai — ek cache stampede ke tahat kai requests ek saath miss kar sakti hain, sab callable chalाती hain. add ek alag primitive hai. Ye key ko sirf tab likhता hai agar key pehle se maujूd nahi, aur ek boolean lautाता hai. Ye ise ek sasta, non-blocking lock banаता hai: pehla caller jо cache.add chalाता hai True paता hai aur expensive work karता hai; concurrent callers False paते hain. Aap add ke liye pahुँchते ho jab aapको specifically ensure karna hai ki sirf ek worker kuch kare.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django with `CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}`. Exercise the low-level API: `set` a dict with `timeout=60`, `get` it back; `get` a missing key with and without `default`; `add` to a free key (`True`) then a taken key (`False`) and show the value is unchanged; `get_or_set` with a callable that appends to a list — call it twice and assert the callable ran once; `set("n", 0)` then `incr("n", 3)` and assert `get("n") == 3`; `incr` a never-set key and catch `ValueError`.',
        taskHi: 'Standalone Django `LocMemCache` ke saath. Low-level API exercise karो: `set`/`get`, missing key `default` ke saath, `add` free (`True`) phir taken (`False`), `get_or_set` ek callable ke saath (do baar call, ek baar chala), `incr`, missing key par `incr` -> `ValueError`.',
        hint: '`from django.core.cache import cache`. `cache.get_or_set("k", lambda: expensive(), 60)`. `incr` requires the key to exist -> `cache.incr("missing")` raises `ValueError`.',
        hintHi: '`from django.core.cache import cache`. `cache.get_or_set("k", lambda: expensive(), 60)`. `incr` ko key maujūd chahिए.',
      },
      {
        task: 'With `KEY_PREFIX = "shop"` and `VERSION = 2`, `set("cart:7", {"items": 3})`. Print `cache.make_key("cart:7")` and assert it is `"shop:2:cart:7"`. `get("cart:7")` -> hit. `get("cart:7", version=1)` -> `None` (miss). `set("cart:7", {"items": 9}, version=3)` then show `get(..., version=2)` and `get(..., version=3)` return the two different values. Use `cache.incr_version("cart:7")` to move the v2 key to v3 and show the v2 read is now a miss.',
        taskHi: '`KEY_PREFIX = "shop"`, `VERSION = 2` ke saath, `set("cart:7", {...})`. `cache.make_key("cart:7")` `"shop:2:cart:7"` hai assert karो. `version=1` -> miss. `version=3` par alag value. `incr_version` se v2 key ko v3 par move karो.',
        hint: '`CACHES["default"]["KEY_PREFIX"]` and `["VERSION"]`. `cache.make_key(key)` shows the physical key. `version=` on get/set targets a specific physical version. `cache.incr_version(key)` relocates one key.',
        hintHi: '`CACHES["default"]["KEY_PREFIX"]` aur `["VERSION"]`. `cache.make_key(key)` physical key dikhाता hai.',
      },
      {
        task: 'Model `Event` (`kind`, `weight` int). Insert 60 events across 3 kinds. Write `kind_stats(kind)` that returns `Event.objects.filter(kind=kind).aggregate(total=Sum("weight"), n=Count("id"))` cached under `f"stats:{kind}:v1"` for 300s, returning `(data, "HIT"|"MISS")`. Using `CaptureQueriesContext`, call `kind_stats("a")` twice and `kind_stats("b")` once, and assert exactly 2 DB queries ran (2 misses, 1 hit).',
        taskHi: '`Event` (`kind`, `weight`) model karो. 60 events insert karो. `kind_stats(kind)` likhो jо aggregate ko `f"stats:{kind}:v1"` ke tahat 300s cache kare. `CaptureQueriesContext` se `"a"` do baar, `"b"` ek baar call karके 2 queries assert karो.',
        hint: '`from django.db.models import Sum, Count`. `from django.test.utils import CaptureQueriesContext`. `cache.get(key)` returns `None` on miss -> compute + `cache.set`. Wrap all three calls in one `with CaptureQueriesContext(connection) as ctx:` and check `len(ctx.captured_queries)`.',
        hintHi: '`from django.db.models import Sum, Count`. `cache.get(key)` miss par `None`. Teenों calls ek `CaptureQueriesContext` mein wrap karके `len(ctx.captured_queries)` check karो.',
      },
    ],

    keyTakeaways: [
      '`from django.core.cache import cache` is one API over a backend set in `CACHES["default"]`. `caches["alias"]` for a non-default. Same code for `LocMemCache` in dev and `RedisCache` in prod.',
      '`LocMemCache` = per-process dict — NOT shared across workers, wiped on restart. Dev/tests/per-process-memoization only. Production needs `RedisCache` (built-in since 4.0; `django-redis` adds `delete_pattern` etc.) or Memcached (simpler, 1 MB value cap, no patterns).',
      '`CACHES` keys: `TIMEOUT` (default TTL secs; `None` = forever, `0` = don\'t cache), `KEY_PREFIX` (namespace), `VERSION` (bump to invalidate ALL keys at once). Physical key = `make_key` = `"{prefix}:{version}:{key}"`.',
      'Low-level API: `set`/`get(default=)`/`add` (write-if-absent -> a lock primitive)/`get_or_set` (cache-aside read-through)/`get_many`/`set_many`/`delete_many` (batched)/`incr`/`decr` (atomic, key must exist)/`touch` (extend TTL only)/`delete`/`clear`.',
      'Redis/Memcached store PICKLED bytes -> values must be picklable. A cached `QuerySet` is its EVALUATED list frozen at `set()` time — it does NOT re-query. Prefer caching plain data (`list(qs.values(...))`, dicts, serializer output).',
      'CACHE: derived / expensive / read-heavy / safe-to-serve-stale (aggregations, template fragments, third-party responses, permission blobs, leaderboards).',
      'DON\'T CACHE: the source of truth, per-request-unique data, anything unrecoverable on a miss, secrets (Redis is plaintext at rest by default), >1 MB blobs on Memcached.',
      'A cache key MUST include every input that changes the value (`f"dash:{user_id}:{date}:v3"`, never `"dash"`) — a shared key across users is a data-LEAK bug, not just staleness. Add a `:vN` segment so you can invalidate a class of keys by bumping a constant (lesson 3).',
    ],
    keyTakeawaysHi: [
      '`from django.core.cache import cache` ek API hai ek backend ke upar jо `CACHES["default"]` mein set hai. `caches["alias"]` non-default ke liye. Dev mein `LocMemCache` aur prod mein `RedisCache` ke liye wahi code.',
      '`LocMemCache` = per-process dict — workers ke paar shared NAHI, restart par wipe. Sirf dev/tests. Production ko `RedisCache` (4.0+ built-in) ya Memcached (saral, 1 MB cap) chahिए.',
      '`CACHES` keys: `TIMEOUT` (default TTL; `None` = forever, `0` = cache mat karो), `KEY_PREFIX` (namespace), `VERSION` (SAARI keys ek saath invalidate karने ko bump). Physical key = `"{prefix}:{version}:{key}"`.',
      'Low-level API: `set`/`get(default=)`/`add` (write-if-absent -> lock primitive)/`get_or_set` (cache-aside)/`get_many`/`set_many`/`incr`/`decr` (atomic, key maujūd chahिए)/`touch` (sirf TTL extend)/`delete`.',
      'Redis/Memcached PICKLED bytes store karते hain -> values picklable honi chahिए. Ek cached `QuerySet` iski EVALUATED list hai jо `set()` time par frozen hai — ye dobara query NAHI karता. Plain data cache karो.',
      'CACHE: derived / expensive / read-heavy / stale-serve-safe (aggregations, template fragments, third-party responses, leaderboards).',
      'CACHE MAT KARO: source of truth, per-request-unique data, miss par unrecoverable kuch bhi, secrets, Memcached par >1 MB blobs.',
      'Ek cache key mein har input jо value badalता hai SHAMIL hona chahिए (`f"dash:{user_id}:{date}:v3"`) — users ke paar ek shared key ek data-LEAK bug hai. Ek `:vN` segment daalो.',
    ],
  },

  {
    slug: 'dj-per-view-fragment-site-caching',
    title: 'Per-View, Fragment & Per-Site Caching',
    titleHi: 'Per-View, Fragment & Per-Site Caching',
    description: '`@cache_page(ttl)` stores a whole view\'s response, keyed by the full URL. `{% cache %}` caches a slice of a template. The per-site middleware pair caches every anonymous GET. All three are powerful and all three have the same trap: they cache per URL and know nothing about the logged-in user unless you tell them to `Vary`.',
    descriptionHi: '`@cache_page(ttl)` ek poore view ke response ko store karता hai, full URL se keyed. `{% cache %}` ek template ke ek slice ko cache karता hai. Per-site middleware jodी har anonymous GET ko cache karती hai. Teenों powerful hain aur teenों ka wahi trap hai: wo prati URL cache karте hain aur logged-in user ke baare mein kuch nahi jaanते jab tak aap unhe `Vary` karने ko na kaho.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A print shop that photocopies finished pages.** Per-view caching (`@cache_page`) is "photocopy this whole page and hand out the copy for the next N minutes" — fast, but the copy is identical for everyone who asks, so it only works for a page that *is* the same for everyone (a public article, a marketing page). Fragment caching (`{% cache %}`) is "the page changes per visitor, but this sidebar block is the same for everyone — photocopy just the sidebar and paste it in". Per-site caching is "photocopy every page automatically, but only for walk-in customers with no account" — anonymous traffic gets copies, logged-in members always get a freshly printed page. The trap in all three: the photocopier files copies by the *page number you asked for* (the URL). If page 5 secretly looks different depending on who is holding a membership card, and you photocopy it, the first member\'s page 5 gets handed to every subsequent member. The fix is to also file by "membership card or not" — that is the `Vary: Cookie` header.',
      hi: '**Ek print shop jо finished pages ki photocopy karता hai.** Per-view caching (`@cache_page`) "is poore page ki photocopy karो aur agle N minute copy baaँto" hai — tez, par copy har poochने waale ke liye identical hai, toh ye sirf ek page ke liye kaam karта hai jо sabke liye same *hai* (ek public article, ek marketing page). Fragment caching (`{% cache %}`) "page prati visitor badalता hai, par ye sidebar block sabke liye same hai — sirf sidebar ki photocopy karके paste karो" hai. Per-site caching "har page ki automatically photocopy karो, par sirf bina account ke walk-in customers ke liye" hai. Teenों mein trap: photocopier copies ko *aapne jо page number poochा* (URL) se file karता hai. Agar page 5 chupके se alag dikhता hai membership card ke hisab se, aur aap iski photocopy karते ho, pehle member ka page 5 har agle member ko diya jाता hai. Fix "membership card ya nahi" se bhi file karna hai — wo `Vary: Cookie` header hai.',
    },

    simple: `**Per-view: \`@cache_page\`**

\`\`\`python
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)                        # 15 minutes
def article_list(request):
    return render(request, "articles.html", {"articles": Article.objects.published()})

# or in urls.py (works with CBVs / includes):
from django.views.decorators.cache import cache_page
path("articles/", cache_page(60 * 15)(ArticleListView.as_view())),

# cache key includes: the full path + query string + the request headers named in the Vary header
# GET /articles/?page=2  and  GET /articles/?page=3  are cached separately
# GET vs HEAD are cached separately ; POST/PUT/etc are never cached
\`\`\`

**Make it per-user (or don't cache authenticated requests at all)**

\`\`\`python
from django.views.decorators.vary import vary_on_cookie, vary_on_headers

@cache_page(300)
@vary_on_cookie                            # -> Vary: Cookie -> cached separately per session cookie
def dashboard(request): ...

@cache_page(300)
@vary_on_headers("Accept-Language")        # cached separately per language
def homepage(request): ...

# common pattern: only cache for anonymous users
def maybe_cache(view):
    cached = cache_page(300)(view)
    def wrapper(request, *a, **kw):
        return (view if request.user.is_authenticated else cached)(request, *a, **kw)
    return wrapper
\`\`\`

**Fragment: \`{% cache %}\`**

\`\`\`django
{% load cache %}
{% cache 600 sidebar %}                     {# 600s, fragment name "sidebar" #}
    {# expensive: builds the category tree from the DB #}
    {% for cat in categories %}...{% endfor %}
{% endcache %}

{% cache 600 article_body article.id article.updated_at %}   {# key varies by these args #}
    {{ article.body|markdown }}
{% endcache %}

{% cache 600 nav request.user.id %}         {# per-user fragment #}
    ...
{% endcache %}
\`\`\`

**Per-site: the middleware pair**

\`\`\`python
MIDDLEWARE = [
    "django.middleware.cache.UpdateCacheMiddleware",     # FIRST -- stores the response on the way out
    "django.middleware.common.CommonMiddleware",
    # ... your middleware ...
    "django.middleware.cache.FetchFromCacheMiddleware",  # LAST -- serves from cache on the way in
]
CACHE_MIDDLEWARE_SECONDS = 600
CACHE_MIDDLEWARE_KEY_PREFIX = "site"
# only caches: GET/HEAD, status 200, no request cookies OR the response allows it,
#              response has no "Cache-Control: private / no-cache", request.user is anonymous
\`\`\`

\`\`\`
@cache_page(ttl)          key = method + full path + querystring + Vary headers ; stores the WHOLE response
                         never caches non-GET/HEAD, never a response with Cache-Control: private
@vary_on_cookie          adds "Vary: Cookie" -> a separate cache entry per distinct Cookie header
@vary_on_headers(*names) adds those to Vary -> separate entry per distinct value
{% cache ttl name arg1 arg2 %}  fragment cache ; physical key includes name + all args ; needs {% load cache %}
                         {% cache ttl name using="redis" %} to pick a non-default cache
per-site middleware      UpdateCacheMiddleware first + FetchFromCacheMiddleware last ; anonymous GET only
never_cache / @never_cache  -> Cache-Control: no-cache, no-store -> opt a view OUT of all of the above
\`\`\``,

    simpleHi: `**Per-view: \`@cache_page\`**

\`\`\`python
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)                        # 15 minute
def article_list(request):
    return render(request, "articles.html", {"articles": Article.objects.published()})

# ya urls.py mein:
path("articles/", cache_page(60 * 15)(ArticleListView.as_view())),

# cache key mein: full path + query string + Vary header mein named request headers
# GET /articles/?page=2  aur  GET /articles/?page=3  alag cache hote hain
# POST/PUT/etc kabhi cache nahi hote
\`\`\`

**Ise per-user banाओ (ya authenticated requests bilkul cache mat karो)**

\`\`\`python
from django.views.decorators.vary import vary_on_cookie, vary_on_headers

@cache_page(300)
@vary_on_cookie                            # -> Vary: Cookie -> prati session cookie alag cache
def dashboard(request): ...

@cache_page(300)
@vary_on_headers("Accept-Language")        # prati language alag cache
def homepage(request): ...

# aam pattern: sirf anonymous users ke liye cache
def maybe_cache(view):
    cached = cache_page(300)(view)
    def wrapper(request, *a, **kw):
        return (view if request.user.is_authenticated else cached)(request, *a, **kw)
    return wrapper
\`\`\`

**Fragment: \`{% cache %}\`**

\`\`\`django
{% load cache %}
{% cache 600 sidebar %}                     {# 600s, fragment name "sidebar" #}
    {% for cat in categories %}...{% endfor %}
{% endcache %}

{% cache 600 article_body article.id article.updated_at %}   {# key in args se vary #}
    {{ article.body|markdown }}
{% endcache %}
\`\`\`

**Per-site: middleware jodी**

\`\`\`python
MIDDLEWARE = [
    "django.middleware.cache.UpdateCacheMiddleware",     # PEHLE
    "django.middleware.common.CommonMiddleware",
    "django.middleware.cache.FetchFromCacheMiddleware",  # AAKHIRI
]
CACHE_MIDDLEWARE_SECONDS = 600
CACHE_MIDDLEWARE_KEY_PREFIX = "site"
# sirf cache: GET/HEAD, status 200, no private Cache-Control, request.user anonymous
\`\`\`

\`\`\`
@cache_page(ttl)          key = method + full path + querystring + Vary headers ; POORA response store
@vary_on_cookie          "Vary: Cookie" add -> prati distinct Cookie header alag cache entry
@vary_on_headers(*names) unhe Vary mein add -> prati distinct value alag entry
{% cache ttl name arg1 %}  fragment cache ; physical key mein name + saare args ; {% load cache %} chahिए
per-site middleware      UpdateCacheMiddleware pehle + FetchFromCacheMiddleware aakhiri ; sirf anonymous GET
never_cache / @never_cache  -> Cache-Control: no-cache -> ek view ko sab se OUT karो
\`\`\``,

    content: `## Per-view: \`@cache_page\`

\`@cache_page(ttl)\` wraps a view so the first request runs it and stores the full \`HttpResponse\`; subsequent requests within \`ttl\` get the stored response without running the view. The cache key is built from:

- the request **method** (\`GET\` and \`HEAD\` cached separately),
- the **full path including the query string** (\`?page=2\` and \`?page=3\` are different entries),
- the values of every header named in the response's **\`Vary\`** header.

\`@cache_page\` **never** caches a non-\`GET\`/\`HEAD\` request, a non-\`200\` response, or a response carrying \`Cache-Control: private\` / \`no-cache\` (so \`@never_cache\` and the CSRF machinery opt out automatically). It uses \`CACHES["default"]\` unless you pass \`cache="alias"\`.

Apply it as a decorator, or in the URLconf (\`cache_page(600)(MyView.as_view())\`) which is the usual way for class-based views.

## The trap: it caches per URL, not per user

\`@cache_page\` on a view whose output depends on \`request.user\` will serve the **first user's** rendering to every subsequent visitor of that URL until the TTL expires. This is a data-leak. Options, from safest:

1. **Don't cache authenticated requests.** Wrap the view so \`request.user.is_authenticated\` short-circuits past the cached version. This is the common choice.
2. **\`@vary_on_cookie\`** — adds \`Vary: Cookie\`, so a distinct session cookie gets a distinct cache entry. Correct, but the hit rate drops (one entry per session) and it caches per-cookie even for anonymous users with tracking cookies.
3. **Cache a user-independent version and layer per-user data client-side** — the page shell is cached, an XHR fetches the personalised bits.

Similarly, use \`@vary_on_headers("Accept-Language")\` for i18n, \`@vary_on_headers("Accept")\` if the view content-negotiates.

## Fragment: \`{% cache %}\`

\`{% load cache %}\` then \`{% cache ttl fragment_name [arg ...] %} … {% endcache %}\` caches the rendered output of just that block. The physical key is derived from the fragment name plus every extra argument, so:

\`\`\`django
{% cache 600 article_body article.id article.updated_at %}
\`\`\`

gives a separate cache entry per \`(article.id, article.updated_at)\` — and because \`updated_at\` changes on every edit, editing an article naturally invalidates its cached body (a form of key-versioning). Add \`request.user.id\` (or a role) as an argument for a per-user fragment. \`{% cache 600 name using="redis" %}\` selects a non-default cache.

Fragment caching is the right tool when **the page is dynamic but a piece of it is not** — a category tree, a "popular posts" list, a footer built from the CMS. You keep the per-request logic uncached and cache only the expensive, shared slice.

## Per-site: the middleware pair

\`UpdateCacheMiddleware\` + \`FetchFromCacheMiddleware\` cache **every** qualifying page:

\`\`\`python
MIDDLEWARE = [
    "django.middleware.cache.UpdateCacheMiddleware",     # must be FIRST (outermost)
    "django.middleware.common.CommonMiddleware",
    # ...
    "django.middleware.cache.FetchFromCacheMiddleware",  # must be LAST (innermost)
]
CACHE_MIDDLEWARE_SECONDS = 600
CACHE_MIDDLEWARE_KEY_PREFIX = "site"
CACHE_MIDDLEWARE_ALIAS = "default"
\`\`\`

\`FetchFromCacheMiddleware\` (on the way in) serves from cache; \`UpdateCacheMiddleware\` (on the way out) stores. It only caches when: the method is \`GET\`/\`HEAD\`, the status is \`200\`, the response has no \`Cache-Control: private\`, and — crucially — **the request has no cookies that were accessed** / the user is effectively anonymous. Any view that reads \`request.session\` or \`request.user\` typically ends up with a \`Vary: Cookie\` that fragments the cache per session.

Per-site caching suits a **mostly-anonymous, mostly-read** site (a blog, docs, marketing). For an app where most traffic is authenticated it does very little — use per-view and fragment caching on the specific expensive pieces instead.

## Opting out: \`@never_cache\`

\`@never_cache\` (or \`django.utils.cache.add_never_cache_headers\`) sets \`Cache-Control: no-cache, no-store, must-revalidate\` so a view is skipped by \`@cache_page\`, the per-site middleware, and downstream proxies/CDNs. Put it on anything user-specific and sensitive — a checkout page, an account page, an admin view — that must never be served from any cache.`,

    contentHi: `## Per-view: \`@cache_page\`

\`@cache_page(ttl)\` ek view ko wrap karता hai taaki pehli request ise chalाe aur poora \`HttpResponse\` store kare; \`ttl\` ke andar agli requests stored response paती hain bina view chalाye. Cache key banता hai:

- request **method** se (\`GET\` aur \`HEAD\` alag cache),
- **full path query string sहित** se (\`?page=2\` aur \`?page=3\` alag entries),
- response ke **\`Vary\`** header mein named har header ki values se.

\`@cache_page\` **kabhi** non-\`GET\`/\`HEAD\`, non-\`200\`, ya \`Cache-Control: private\` waala response cache nahi karता.

Ise ek decorator ke roop mein lागू karो, ya URLconf mein (\`cache_page(600)(MyView.as_view())\`).

## Trap: ye prati URL cache karता hai, prati user nahi

Ek view par \`@cache_page\` jiska output \`request.user\` par nirbhar karता hai **pehle user ka** rendering har agle visitor ko serve karega jab tak TTL expire nahi hoता. Ye ek data-leak hai. Vikalp, safest se:

1. **Authenticated requests cache mat karो.** View ko wrap karो taaki \`request.user.is_authenticated\` cached version ko short-circuit kare. Ye aam chunaव hai.
2. **\`@vary_on_cookie\`** — \`Vary: Cookie\` add karता hai. Sahi, par hit rate girता hai.
3. **Ek user-independent version cache karो aur per-user data client-side layer karो.**

## Fragment: \`{% cache %}\`

\`{% load cache %}\` phir \`{% cache ttl fragment_name [arg ...] %} … {% endcache %}\` sirf us block ka rendered output cache karता hai. Physical key fragment name plus har extra argument se banता hai:

\`\`\`django
{% cache 600 article_body article.id article.updated_at %}
\`\`\`

prati \`(article.id, article.updated_at)\` ek alag cache entry deता hai — aur kyunki \`updated_at\` har edit par badalता hai, ek article edit karna svabhavikроप se iski cached body invalidate karता hai.

Fragment caching sahi tool hai jab **page dynamic hai par iska ek tुkda nahi** — ek category tree, ek "popular posts" list.

## Per-site: middleware jodी

\`UpdateCacheMiddleware\` (PEHLE) + \`FetchFromCacheMiddleware\` (AAKHIRI) **har** qualifying page cache karती hain. Ye sirf tab cache karती hai jab: method \`GET\`/\`HEAD\`, status \`200\`, koi \`Cache-Control: private\` nahi, aur **request ke paas accessed cookies nahi** / user effectively anonymous hai.

Per-site caching ek **mostly-anonymous, mostly-read** site ke liye theek hai (ek blog, docs, marketing). Ek app ke liye jahaan zyादातr traffic authenticated hai ye bahut kam karता hai.

## Opt out: \`@never_cache\`

\`@never_cache\` \`Cache-Control: no-cache, no-store, must-revalidate\` set karता hai taaki ek view \`@cache_page\`, per-site middleware, aur downstream proxies/CDNs dwara skip ho. Kisi bhi user-specific aur sensitive cheez par daalो — ek checkout page, ek account page.`,

    examples: [
      {
        title: '@cache_page: the view runs once; the second request is served from cache',
        titleHi: '@cache_page: view ek baar chalता hai; doosri request cache se serve',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], USE_TZ=True, MIDDLEWARE=[],
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}})
django.setup()

from django.http import JsonResponse
from django.urls import path
from django.views.decorators.cache import cache_page
from django.test import Client
import itertools

counter = itertools.count(1)

@cache_page(60)
def report(request):
    return JsonResponse({"generation": next(counter), "q": request.GET.get("q", "")})

urlpatterns = [path("report/", report)]
c = Client()

print("1st GET /report/       :", c.get("/report/").json())
print("2nd GET /report/       :", c.get("/report/").json(), "<- same generation, view did not run")
print("GET /report/?q=x       :", c.get("/report/?q=x").json(), "<- different URL -> cache miss -> ran")
print("GET /report/?q=x again :", c.get("/report/?q=x").json())
print("HEAD /report/          :", c.head("/report/").status_code, "(HEAD keyed separately from GET)")
r = c.get("/report/")
print("response has Expires/Cache-Control:", bool(r.get("Expires")), bool(r.get("Cache-Control")))`,
        output: `1st GET /report/       : {'generation': 1, 'q': ''}
2nd GET /report/       : {'generation': 1, 'q': ''} <- same generation, view did not run
GET /report/?q=x       : {'generation': 2, 'q': 'x'} <- different URL -> cache miss -> ran
GET /report/?q=x again : {'generation': 2, 'q': 'x'}
HEAD /report/          : 200 (HEAD keyed separately from GET)
response has Expires/Cache-Control: True True
`,
        explain: '@cache_page(60) stores the whole rendered response keyed by method + full URL (including the query string) + the Vary headers. The 2nd GET /report/ returns generation 1 -- the view function never ran. /report/?q=x is a different URL so it is a separate cache entry and the view runs once for it. HEAD is keyed separately from GET. The decorator also attaches Expires and Cache-Control: max-age=60 so browsers and any downstream proxy cache it too. What it does NOT key on is the user -- which is the trap in the next example.',
        explainHi: '@cache_page(60) poore rendered response ko method + full URL (query string sahit) + Vary headers se keyed store karta hai. 2nd GET /report/ generation 1 lautata hai -- view function kabhi nahi chala. /report/?q=x ek alag URL hai toh ye ek alag cache entry hai. HEAD GET se alag keyed hai. Decorator Expires aur Cache-Control: max-age=60 bhi attach karta hai. Ye jis par key NAHI karta wo user hai -- jo agle example ka trap hai.',
      },
      {
        title: 'The trap: @cache_page leaks user A\'s page to user B unless you Vary on Cookie',
        titleHi: 'Trap: @cache_page user A ka page user B ko leak karता hai jab tak Cookie par Vary na karो',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth",
                    "django.contrib.sessions"], USE_TZ=True,
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField",
    MIDDLEWARE=["django.contrib.sessions.middleware.SessionMiddleware",
               "django.contrib.auth.middleware.AuthenticationMiddleware"],
    SESSION_ENGINE="django.contrib.sessions.backends.signed_cookies",
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}})
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.contrib.auth.models import User
from django.http import JsonResponse
from django.urls import path
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django.test import Client

@cache_page(60)
def leaky(request):
    return JsonResponse({"you_are": request.user.username or "anon"})

@cache_page(60)
@vary_on_cookie
def safe(request):
    return JsonResponse({"you_are": request.user.username or "anon"})

urlpatterns = [path("leaky/", leaky), path("safe/", safe)]

ada = User.objects.create_user("ada"); bo = User.objects.create_user("bo")
c_ada, c_bo = Client(), Client()
c_ada.force_login(ada); c_bo.force_login(bo)

print("LEAKY: ada first  ->", c_ada.get("/leaky/").json())
print("LEAKY: bo  next   ->", c_bo.get("/leaky/").json(), "<-- bo sees ADA (cached per-URL)")
print("SAFE:  ada first  ->", c_ada.get("/safe/").json())
print("SAFE:  bo  next   ->", c_bo.get("/safe/").json(), "<-- correct (Vary: Cookie)")
print("SAFE response Vary header:", c_ada.get("/safe/")["Vary"])`,
        output: `LEAKY: ada first  -> {'you_are': 'ada'}
LEAKY: bo  next   -> {'you_are': 'ada'} <-- bo sees ADA (cached per-URL)
SAFE:  ada first  -> {'you_are': 'ada'}
SAFE:  bo  next   -> {'you_are': 'bo'} <-- correct (Vary: Cookie)
SAFE response Vary header: Cookie
`,
        explain: '@cache_page keys on the URL, not the user. Both ada and bo request /leaky/ -- the same URL -- so bo is served the response cached for ada and sees you_are: ada. That is a cross-user data leak. /safe/ adds @vary_on_cookie, which puts Cookie in the Vary header; the cache now stores a separate entry per distinct cookie value, so ada and bo get their own. The lesson: per-user pages must either not use @cache_page at all, or must Vary on Cookie (and even then the hit rate is poor because every session cookie is distinct).',
        explainHi: '@cache_page URL par key karta hai, user par nahi. ada aur bo dono /leaky/ request karte hain -- wahi URL -- toh bo ko ada ke liye cached response serve hota hai aur wo you_are: ada dekhta hai. Ye ek cross-user data leak hai. /safe/ @vary_on_cookie add karta hai, jo Cookie ko Vary header mein daalta hai; cache ab prati distinct cookie ek alag entry store karta hai. Sabak: per-user pages ya @cache_page bilkul na istemal karein, ya Cookie par Vary karein.',
      },
      {
        title: 'Template fragment caching: cache the expensive block, keyed by its inputs',
        titleHi: 'Template fragment caching: expensive block cache karो, iske inputs se keyed',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes"],
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}},
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates",
                "DIRS": [], "APP_DIRS": False, "OPTIONS": {"loaders": [
        ("django.template.loaders.locmem.Loader", {
            "page.html": (
                "{% load cache %}"
                "user={{ user }} time={{ now }} "
                "{% cache 300 sidebar %}[sidebar built {{ build_id }}]{% endcache %} "
                "{% cache 300 body article_id article_rev %}[body {{ article_id }} rev {{ article_rev }}]{% endcache %}"
            )})]}}])
django.setup()

from django.template.loader import render_to_string
import itertools

build = itertools.count(1)

def page(user, article_id, article_rev):
    return render_to_string("page.html", {
        "user": user, "now": "T", "build_id": next(build),
        "article_id": article_id, "article_rev": article_rev,
    })

print("ada, art 7 rev 1:", page("ada", 7, 1))
print("bo,  art 7 rev 1:", page("bo", 7, 1), "<- sidebar + body reused (build_id frozen)")
print("bo,  art 7 rev 2:", page("bo", 7, 2), "<- body re-rendered (rev changed), sidebar still cached")
print("bo,  art 9 rev 1:", page("bo", 9, 1), "<- body for a different article -> its own entry")`,
        output: `ada, art 7 rev 1: user=ada time=T [sidebar built 1] [body 7 rev 1]
bo,  art 7 rev 1: user=bo time=T [sidebar built 1] [body 7 rev 1] <- sidebar + body reused (build_id frozen)
bo,  art 7 rev 2: user=bo time=T [sidebar built 1] [body 7 rev 2] <- body re-rendered (rev changed), sidebar still cached
bo,  art 9 rev 1: user=bo time=T [sidebar built 1] [body 9 rev 1] <- body for a different article -> its own entry
`,
        explain: "{% cache TTL name key1 key2 %} caches just the block between the tags, keyed by the fragment name plus the extra arguments. The sidebar has no varying key, so build_id is frozen at 1 forever -- the first render's output is reused for every user (that is why it must not contain per-user content). The body fragment is keyed by article_id and article_rev: bo art 7 rev 1 reuses ada's cached body, rev 2 forces a re-render, and article 9 gets its own entry. The bits outside the tags (user=, time=) render fresh every call. This is how you cache the 90% of a page that is shared while keeping the per-user shell live.",
        explainHi: '{% cache TTL name key1 key2 %} sirf tags ke beech ke block ko cache karta hai, fragment name plus extra arguments se keyed. Sidebar ki koi varying key nahi, toh build_id hamesha ke liye 1 par frozen hai -- pehle render ka output har user ke liye reused (isiliye ismein per-user content nahi hona chahiye). Body fragment article_id aur article_rev se keyed hai: bo art 7 rev 1 ada ka cached body reuse karta hai, rev 2 re-render force karta hai. Tags ke bahar ke bits har call fresh render hote hain.',
      },
    ],

    mistakes: [
      {
        wrong: `@cache_page(300)
def account_summary(request):
    return render(request, "account.html", {"user": request.user, "balance": request.user.balance})
# the first logged-in user's balance is now shown to every visitor of /account/ for 5 minutes`,
        right: `@never_cache
def account_summary(request):
    ...
# or, if you must cache something expensive on the page, cache a user-independent fragment
# and fetch the personalised bits via XHR, or wrap with @vary_on_cookie (lower hit rate)`,
        why: '`@cache_page` keys only on method + URL + `Vary` headers. A view that renders `request.user`\'s data has none of that in the key, so the cached response — the first user\'s — is served to everyone hitting that URL. For anything user-specific and sensitive, `@never_cache` is the safe default. If a page has both a heavy shared part and a light personal part, cache only the shared fragment.',
        whyHi: '`@cache_page` sirf method + URL + `Vary` headers par key karता hai. Ek view jо `request.user` ka data render karता hai iske paas key mein wo kuch nahi, toh cached response — pehle user ka — har us URL ko hit karने waale ko serve hoता hai. Kisi bhi user-specific cheez ke liye `@never_cache` safe default hai.',
      },
      {
        wrong: `MIDDLEWARE = [
    "django.middleware.common.CommonMiddleware",
    "django.middleware.cache.FetchFromCacheMiddleware",
    "django.middleware.cache.UpdateCacheMiddleware",     # wrong position + wrong order
]
# UpdateCacheMiddleware must be the OUTERMOST (first) and FetchFromCache the INNERMOST (last)`,
        right: `MIDDLEWARE = [
    "django.middleware.cache.UpdateCacheMiddleware",     # first
    "django.middleware.common.CommonMiddleware",
    # ... everything else ...
    "django.middleware.cache.FetchFromCacheMiddleware",  # last
]`,
        why: 'Middleware wraps like an onion: the first entry is the outermost layer (sees the request first, the response last), the last entry is innermost. `UpdateCacheMiddleware` must be outermost so it captures the *final* response after all other middleware has run; `FetchFromCacheMiddleware` must be innermost so a cache hit short-circuits before your view (and the other inner middleware) runs. Swapping them means the cache stores a half-processed response and never serves a hit correctly.',
        whyHi: 'Middleware ek onion ki tarah wrap karता hai: pehla entry sabse bahari layer hai, aakhiri entry innermost. `UpdateCacheMiddleware` outermost hona chahिए taaki ye *final* response capture kare; `FetchFromCacheMiddleware` innermost hona chahिए taaki ek cache hit aapke view se pehle short-circuit kare. Unhe swap karna matlab cache ek half-processed response store karता hai.',
      },
      {
        wrong: `{% cache 600 article_body %}
    {{ article.body|expensive_render }}
{% endcache %}
# EVERY article renders the SAME cached fragment -- the key is just "article_body"`,
        right: `{% cache 600 article_body article.id article.updated_at %}
    {{ article.body|expensive_render }}
{% endcache %}
# key now varies per article and re-keys automatically when the article is edited`,
        why: 'A `{% cache %}` tag with only a fragment name uses one key for every render of that template. If the block\'s content depends on a loop variable or a context object, you must pass those as extra arguments so the physical key includes them. Passing a timestamp like `updated_at` is a bonus: the key changes whenever the object is edited, so edits invalidate the fragment for free.',
        whyHi: 'Sirf ek fragment name waala ek `{% cache %}` tag us template ke har render ke liye ek key istemal karता hai. Agar block ka content ek loop variable ya ek context object par nirbhar karता hai, aapको unhe extra arguments ke roop mein pass karna chahिए. `updated_at` jaisा ek timestamp pass karna bonus hai: key badalती hai jab bhi object edit hoता hai.',
      },
    ],

    realWorld: [
      {
        en: '**`@cache_page` on public marketing/blog/docs routes only, wrapped so authenticated users bypass it** — `path("blog/<slug>/", anon_only_cache(60*30)(post_detail))`. The 99% anonymous traffic is served from Redis; the handful of logged-in editors always see fresh content.',
        hi: '**Sirf public marketing/blog/docs routes par `@cache_page`, wrapped taaki authenticated users bypass karें** — 99% anonymous traffic Redis se serve, kuch logged-in editors hamesha fresh content dekhते hain.',
      },
      {
        en: '**Fragment caching the parts of a logged-in dashboard that are NOT per-user** — the global "system status" banner, the "trending across all teams" widget, the nav built from a rarely-changing config. Keyed with a version constant; the per-user panels render live.',
        hi: '**Ek logged-in dashboard ke un hisso ko fragment cache karna jо per-user NAHI hain** — global "system status" banner, "trending across all teams" widget. Ek version constant se keyed; per-user panels live render hote hain.',
      },
      {
        en: '**Per-site middleware on a Wagtail/CMS marketing site** — `CACHE_MIDDLEWARE_SECONDS = 3600`, a CDN in front honouring the `Cache-Control` headers Django emits, and a post-publish signal that calls `cache.clear()` (small key space) or purges the CDN. Editors see a "purge cache" button.',
        hi: '**Ek Wagtail/CMS marketing site par per-site middleware** — `CACHE_MIDDLEWARE_SECONDS = 3600`, aage ek CDN jо Django ke `Cache-Control` headers honour karता hai, aur ek post-publish signal jо `cache.clear()` call karता hai ya CDN purge karता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the cache key for `@cache_page`, and why is caching a per-user view with it a bug?',
        qHi: '`@cache_page` ke liye cache key kya hai, aur iske saath ek per-user view cache karna ek bug kyun hai?',
        a: 'cache_page builds its key from three things: the HTTP method, so GET and HEAD are separate entries; the full request path including the query string, so the same view at question mark page equals two and page equals three caches independently; and the values of whatever request headers are named in the response Vary header. It does not look at the session, the user, or any cookie unless a Vary Cookie header is present. It also refuses to cache anything that is not a GET or HEAD, anything that is not a two hundred, and any response marked Cache-Control private or no-cache. The bug with a per-user view is that request dot user is not part of the key. The first request to a given URL runs the view, renders that user\'s data, and the whole response is stored. Every subsequent request to the same URL within the TTL — from any user, or none — gets that stored response back without the view ever running. So the first logged-in visitor\'s account page, dashboard, or personalised feed is served to everyone else. That is a data-leak, not just a staleness problem. The fixes, in order of safety: mark the view never_cache if it is sensitive; or cache only for anonymous users by wrapping the view so an authenticated request skips the cached path; or add vary_on_cookie so each distinct Cookie header gets its own entry, which is correct but drops the hit rate to roughly one entry per session and still caches per tracking-cookie for anonymous users; or restructure so the cached response is user-independent and the personalised parts load via a separate request.',
        aHi: 'cache_page apni key teen cheezों se banाता hai: HTTP method, toh GET aur HEAD alag entries hain; full request path query string sहित, toh question mark page equals two aur page equals three alag cache hote hain; aur response Vary header mein named jо bhi request headers ki values. Ye session, user, ya kisi cookie ko nahi dekhता jab tak ek Vary Cookie header maujūd na ho. Ye GET ya HEAD ke alावा kuch bhi, 200 ke alावा kuch bhi, aur Cache-Control private waala koi response cache karने se mana karता hai. Ek per-user view ke saath bug ye hai ki request dot user key ka hissा nahi hai. Ek diye gaye URL ki pehli request view chalाती hai, us user ka data render karती hai, aur poora response store hoता hai. TTL ke andar usi URL ki har agli request — kisi bhi user se — wo stored response wapas paती hai. Toh pehle logged-in visitor ka account page sabko serve hoता hai. Ye ek data-leak hai. Fixes: sensitive ho toh never_cache; ya sirf anonymous users ke liye cache; ya vary_on_cookie add karो.',
      },
      {
        q: 'When would you use fragment caching instead of per-view caching, and how does passing arguments to `{% cache %}` help?',
        qHi: 'Aap per-view caching ke bजाy fragment caching kab istemal karोge, aur `{% cache %}` ko arguments pass karna kaise madad karता hai?',
        a: 'Per-view caching is all-or-nothing: it stores the entire response for a URL. That only works when the whole page is identical for everyone who requests that URL. Fragment caching is for the common case where the page as a whole is dynamic — it shows the logged-in user\'s name, a per-request timestamp, personalised recommendations — but some block within it is not: a navigation menu built from a rarely-changing config, a category tree from the database, a "most popular this week" list, a footer from the CMS. You wrap just that block in cache ttl fragment-name and endcache, and the surrounding template keeps rendering live on every request while the expensive shared block is served from cache. The arguments after the fragment name are folded into the physical cache key. Without them, a fragment name alone means one cache entry for every render of that template, which is wrong the moment the block\'s content depends on a loop variable or a context object — every article would show the same cached body. Passing article dot id makes the key vary per article. Passing something like article dot updated_at on top is a trick: the key changes automatically whenever the article is edited, so an edit invalidates that fragment without any explicit cache deletion — a form of key-versioning built into the template. You can also pass request dot user dot id for a per-user fragment, or a role string for a per-role one.',
        aHi: 'Per-view caching all-or-nothing hai: ye ek URL ke liye poora response store karता hai. Ye sirf tab kaam karता hai jab poora page har us URL ki request karने waale ke liye identical hai. Fragment caching us aam case ke liye hai jahaan page ek poore ke roop mein dynamic hai — ye logged-in user ka naam dikhाता hai, ek per-request timestamp — par iske andar koi block nahi hai: ek navigation menu, ek category tree, ek "most popular this week" list. Aap sirf us block ko cache ttl fragment-name aur endcache mein wrap karते ho. Fragment name ke baad ke arguments physical cache key mein folded hote hain. Unke bina, ek fragment name akelा matlab us template ke har render ke liye ek cache entry, jо galat hai jab block ka content ek loop variable par nirbhar karता hai. article dot id pass karna key ko prati article vary karवाता hai. Uske upar article dot updated_at pass karna ek trick hai: key badalती hai jab bhi article edit hoता hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django, `LocMemCache`, `MIDDLEWARE=[]`. A `@cache_page(60)` view `report(request)` that returns `JsonResponse({"gen": next(counter), "q": request.GET.get("q", "")})` where `counter = itertools.count(1)`. With `django.test.Client`: `GET /report/` twice -> same `gen` (view ran once); `GET /report/?q=x` -> a new `gen` (different URL key); `GET /report/?q=x` again -> cached. Confirm the response carries an `Expires` and a `Cache-Control` header.',
        taskHi: 'Standalone Django, `LocMemCache`, `MIDDLEWARE=[]`. Ek `@cache_page(60)` view `report(request)`. `Client` se: `GET /report/` do baar -> same `gen`; `?q=x` -> naya `gen`; phir cached. `Expires`/`Cache-Control` headers confirm karो.',
        hint: '`from django.views.decorators.cache import cache_page`. `import itertools; counter = itertools.count(1)`. `resp.get("Expires")`, `resp.get("Cache-Control")`. The key is method + full path incl. `?q=x`.',
        hintHi: '`from django.views.decorators.cache import cache_page`. `import itertools; counter = itertools.count(1)`. Key method + full path (`?q=x` sहित) hai.',
      },
      {
        task: 'Reproduce and fix the per-user leak. `django.contrib.sessions` + `signed_cookies`, session + auth middleware. Two views: `leaky` (`@cache_page(60)`) and `safe` (`@cache_page(60)` + `@vary_on_cookie`), each returning `{"you_are": request.user.username or "anon"}`. Two `force_login`ed clients (ada, bo). Assert: on `/leaky/`, ada requests first then bo -> bo sees `"ada"` (the leak); on `/safe/`, bo sees `"bo"`; the `/safe/` response has `Vary: Cookie`.',
        taskHi: 'Per-user leak reproduce aur fix karो. `leaky` (`@cache_page(60)`) aur `safe` (`@cache_page(60)` + `@vary_on_cookie`). Do `force_login`ed clients. Assert karो: `/leaky/` par bo `"ada"` dekhता hai; `/safe/` par bo `"bo"` dekhता hai; `Vary: Cookie`.',
        hint: '`from django.views.decorators.vary import vary_on_cookie`. `SESSION_ENGINE="django.contrib.sessions.backends.signed_cookies"`, `call_command("migrate", run_syncdb=True, verbosity=0)`. `Client().force_login(user)`. Decorator order: `@cache_page` outermost, `@vary_on_cookie` under it.',
        hintHi: '`from django.views.decorators.vary import vary_on_cookie`. `SESSION_ENGINE="...signed_cookies"`. `Client().force_login(user)`. `@cache_page` outermost.',
      },
      {
        task: 'Fragment caching. An inline `locmem` template: `{% load cache %}u={{ user }} {% cache 300 side %}[side {{ build }}]{% endcache %} {% cache 300 body art rev %}[body {{ art }}/{{ rev }}]{% endcache %}` where `build = next(count)`. Render via `render_to_string` for: `(user=ada, art=7, rev=1)`, `(user=bo, art=7, rev=1)`, `(user=bo, art=7, rev=2)`, `(user=bo, art=9, rev=1)`. Assert: `u=` reflects the current user every time; `[side N]` shows the SAME `N` in all four (cached, no args); `[body ...]` is reused for `(7,1)` twice but re-rendered for `(7,2)` and `(9,1)`.',
        taskHi: 'Fragment caching. Ek inline `locmem` template `{% cache 300 side %}` aur `{% cache 300 body art rev %}` ke saath. `render_to_string` se 4 combos render karो. Assert karो: `u=` hamesha current user; `[side N]` chारों mein same; `[body]` `(7,1)` ke liye reused par `(7,2)`/`(9,1)` ke liye re-rendered.',
        hint: '`TEMPLATES` with `OPTIONS.loaders = [("django.template.loaders.locmem.Loader", {"page.html": "..."})]`. `from django.template.loader import render_to_string`. `{% load cache %}` must be in the template string. The `side` fragment has no args -> one entry.',
        hintHi: '`TEMPLATES` `OPTIONS.loaders` ke saath. `render_to_string`. Template string mein `{% load cache %}`. `side` fragment ke koi args nahi -> ek entry.',
      },
    ],

    keyTakeaways: [
      '`@cache_page(ttl)` stores a view\'s WHOLE response. Cache key = HTTP method + full path INCLUDING query string + the values of every header named in the response `Vary`. Never caches non-GET/HEAD, non-200, or `Cache-Control: private`.',
      'THE TRAP: `@cache_page` knows NOTHING about `request.user` — a per-user view serves the FIRST user\'s render to everyone hitting that URL until the TTL. Data leak. Fixes (safest first): `@never_cache`; cache anonymous-only (wrap so authed requests skip); `@vary_on_cookie` (correct but low hit rate); cache a user-independent shell + XHR the personal bits.',
      '`@vary_on_cookie` -> `Vary: Cookie` (per-session entry). `@vary_on_headers("Accept-Language")` -> per-language. `@vary_on_headers("Accept")` if the view content-negotiates.',
      'Fragment caching: `{% load cache %}` then `{% cache ttl name arg1 arg2 %}...{% endcache %}` — caches just that block. Physical key = name + ALL args. Pass `obj.id` (per-object) and `obj.updated_at` (auto-invalidates on edit). `using="alias"` for a non-default cache. Use it when the page is dynamic but a slice is shared.',
      'Per-site: `UpdateCacheMiddleware` FIRST (outermost, stores) + `FetchFromCacheMiddleware` LAST (innermost, serves) + `CACHE_MIDDLEWARE_SECONDS`. Only caches anonymous GET/HEAD 200s with no `private` Cache-Control. Suits a mostly-anonymous read-heavy site; near-useless for an authenticated app.',
      'Middleware is an onion: first entry = outermost (request first, response last). Swapping the cache middleware order breaks it — `Update` must see the final response, `Fetch` must short-circuit before the view.',
      '`@never_cache` sets `Cache-Control: no-cache, no-store, must-revalidate` -> opts a view OUT of `@cache_page`, per-site middleware, AND downstream proxies/CDNs. Put it on checkout / account / admin / anything sensitive and user-specific.',
      'All three tools cache by URL (+ Vary), not by identity. The mental model: "would this exact response be correct for the next person who requests this URL?" If no, don\'t per-view cache it — fragment-cache the shared parts instead.',
    ],
    keyTakeawaysHi: [
      '`@cache_page(ttl)` ek view ka POORA response store karता hai. Cache key = HTTP method + full path query string SAHIT + response `Vary` mein named har header ki values. Kabhi non-GET/HEAD, non-200, ya `Cache-Control: private` cache nahi karता.',
      'TRAP: `@cache_page` ko `request.user` ke baare mein KUCH NAHI pata — ek per-user view PEHLE user ka render har us URL ko hit karने waale ko serve karता hai. Data leak. Fixes: `@never_cache`; anonymous-only cache; `@vary_on_cookie` (sahi par low hit rate); user-independent shell + XHR.',
      '`@vary_on_cookie` -> `Vary: Cookie`. `@vary_on_headers("Accept-Language")` -> per-language.',
      'Fragment caching: `{% load cache %}` phir `{% cache ttl name arg1 arg2 %}...{% endcache %}`. Physical key = name + SAARE args. `obj.id` (per-object) aur `obj.updated_at` (edit par auto-invalidate) pass karो. Page dynamic par ek slice shared ho toh istemal karो.',
      'Per-site: `UpdateCacheMiddleware` PEHLE (outermost, stores) + `FetchFromCacheMiddleware` AAKHIRI (innermost, serves) + `CACHE_MIDDLEWARE_SECONDS`. Sirf anonymous GET/HEAD 200s. Ek mostly-anonymous read-heavy site ke liye; ek authenticated app ke liye lगbhag bekaar.',
      'Middleware ek onion hai: pehla entry = outermost. Cache middleware order swap karna ise toड़ता hai.',
      '`@never_cache` `Cache-Control: no-cache, no-store, must-revalidate` set karता hai -> ek view ko `@cache_page`, per-site middleware, AUR downstream proxies/CDNs se OUT karता hai. Checkout / account / admin par daalो.',
      'Teenों tools URL (+ Vary) se cache karते hain, identity se nahi. Mental model: "kya ye exact response agle vyakti ke liye sahi hoगा jо is URL ko request karता hai?" Agar nahi, per-view cache mat karो.',
    ],
  },

  {
    slug: 'dj-cache-invalidation-and-stampede',
    title: 'Cache Invalidation & the Stampede',
    titleHi: 'Cache Invalidation & Stampede',
    description: '"There are only two hard things in computer science: cache invalidation and naming things." The three workable strategies are: a short TTL (accept staleness), key versioning (change the key so the old value is unreachable), and explicit deletion on write (signals or the service layer). And when a hot key expires, guard against every request recomputing it at once — the stampede.',
    descriptionHi: '"Computer science mein sirf do mushkil cheezein hain: cache invalidation aur naming things." Teen workable strategies: ek short TTL (staleness accept karो), key versioning (key badलो taaki purani value unreachable ho), aur write par explicit deletion (signals ya service layer). Aur jab ek hot key expire hoती hai, har request ke ise ek saath recompute karने se guard karो — stampede.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: '**Keeping a printed price list current in a shop.** You have three ways to stop customers seeing an old price. One: reprint the whole list every morning and just accept that a price changed at noon is wrong for a few hours (a **short TTL**). Two: put a big "LIST #47" on the cover, and when anything changes, print "LIST #48" — the old list is still lying around but nobody reads it because the sign by the till says "current: #48" (**key versioning** — you bump a number and every stale entry becomes unreachable at once). Three: the moment a price changes, walk over and cross it out on the posted list immediately (**explicit invalidation on write** — a signal or service-layer call that deletes exactly the affected keys). And the stampede: if the list is missing and forty customers ask the price of the same item in the same minute, you do not want forty staff all phoning the supplier simultaneously — one person makes the call, writes it down, and the others wait two seconds and read it (a **lock** around the recompute, or `get_or_set` with a short "someone is working on it" placeholder).',
      hi: '**Ek shop mein ek printed price list current rakhna.** Aapke paas customers ko purani price dekhने se rokने ke teen tarike hain. Ek: har subah poori list reprint karो aur bस accept karो ki dopahar mein badli price kuch ghante ke liye galat hai (ek **short TTL**). Do: cover par ek badा "LIST #47" daalो, aur jab kuch badalता hai, "LIST #48" print karो — purani list abhi bhi padी hai par koi nahi padhता kyunki till ke paas sign "current: #48" kehта hai (**key versioning** — aap ek number bump karते ho aur har stale entry ek saath unreachable ho jाती hai). Teen: jis pal ek price badalती hai, chalकर turant posted list par ise cross out karो (**write par explicit invalidation** — ek signal ya service-layer call jо bilkul affected keys delete karता hai). Aur stampede: agar list missing hai aur chालीs customers ek minute mein usi item ki price poochते hain, aap nahi chahते chालीs staff sab ek saath supplier ko phone karें — ek vyakti call karता hai, likhता hai, aur baaki do second ruकते hain aur padhते hain (recompute ke aas-paas ek **lock**).',
    },

    simple: `**Strategy 1 — short TTL (do nothing, accept staleness)**

\`\`\`python
cache.set(key, value, timeout=60)          # everyone tolerates up to 60s of staleness
# simplest. Right when: the data is not critical AND regenerating it is cheap enough at 1/min.
\`\`\`

**Strategy 2 — key versioning (the old value becomes unreachable)**

\`\`\`python
# per-object: fold a mutable attribute into the key
key = f"article:{a.id}:body:{a.updated_at.timestamp()}"    # editing the article re-keys it
cache.set(key, rendered, timeout=86400)

# per-class: a version counter you bump on any relevant write
def articles_key():
    v = cache.get_or_set("articles:version", 1, None)
    return f"articles:list:v{v}"
def bump_articles_version():
    cache.incr("articles:version")          # every "articles:list:v<old>" key is now orphaned
\`\`\`

**Strategy 3 — explicit delete on write (signals or the service layer)**

\`\`\`python
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

@receiver([post_save, post_delete], sender=Article)
def drop_article_caches(sender, instance, **kwargs):
    cache.delete(f"article:{instance.id}:detail")
    cache.delete("articles:list")           # or bump_articles_version()

# OR (often cleaner) -- do it where the write happens, not in a signal:
def publish_article(article):
    article.status = "published"; article.save(update_fields=["status"])
    cache.delete_many([f"article:{article.id}:detail", "articles:list", "homepage"])
\`\`\`

**The stampede (thundering herd)**

\`\`\`python
# BAD: hot key expires -> 500 concurrent requests all miss -> all run the 2s query -> DB melts
def get_leaderboard():
    data = cache.get("leaderboard")
    if data is None:
        data = compute_leaderboard()       # 500 of these at once
        cache.set("leaderboard", data, 300)
    return data

# BETTER: one worker recomputes, others serve slightly-stale or wait
def get_leaderboard():
    data = cache.get("leaderboard")
    if data is not None:
        return data
    if cache.add("leaderboard:lock", "1", timeout=30):     # I won the lock
        try:
            data = compute_leaderboard()
            cache.set("leaderboard", data, 300)
        finally:
            cache.delete("leaderboard:lock")
        return data
    # someone else is computing -> return the last known value, or a cheap fallback
    return cache.get("leaderboard:stale") or compute_cheap_fallback()
\`\`\`

**\`cached_property\` — memoize for the life of ONE instance**

\`\`\`python
from django.utils.functional import cached_property

class Invoice(models.Model):
    @cached_property
    def total(self):                       # computed once per instance, then stored on self.__dict__
        return sum(line.amount for line in self.lines.all())
# NOT a shared cache -- it lives only as long as this Python object (one request, usually)
\`\`\`

\`\`\`
short TTL       zero code, bounded staleness ; wrong for "must be instant" + expensive-to-recompute
key versioning old entries orphaned (expire on their own TTL) ; bump a counter OR embed updated_at
explicit del   precise ; signals (automatic, can miss bulk_update/QuerySet.update) OR service layer (explicit)
stampede fix   cache.add(lock) around the recompute ; OR probabilistic early expiry ; OR a warm background job
cached_property per-instance, per-process, per-request -- memoization, NOT a distributed cache
QuerySet.update / bulk_create / bulk_update DO NOT fire signals -> invalidate manually there
\`\`\``,

    simpleHi: `**Strategy 1 — short TTL (kuch mat karो, staleness accept karो)**

\`\`\`python
cache.set(key, value, timeout=60)          # sab 60s tak staleness tolerate karते hain
# sabse saral. Sahi jab: data critical nahi AUR ise regenerate karna 1/min par kaafi sasta hai.
\`\`\`

**Strategy 2 — key versioning (purani value unreachable ho jाती hai)**

\`\`\`python
# per-object: ek mutable attribute ko key mein fold karो
key = f"article:{a.id}:body:{a.updated_at.timestamp()}"    # article edit karna ise re-key karता hai
cache.set(key, rendered, timeout=86400)

# per-class: ek version counter jise aap kisi bhi relevant write par bump karो
def articles_key():
    v = cache.get_or_set("articles:version", 1, None)
    return f"articles:list:v{v}"
def bump_articles_version():
    cache.incr("articles:version")          # har "articles:list:v<old>" key ab orphaned hai
\`\`\`

**Strategy 3 — write par explicit delete (signals ya service layer)**

\`\`\`python
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

@receiver([post_save, post_delete], sender=Article)
def drop_article_caches(sender, instance, **kwargs):
    cache.delete(f"article:{instance.id}:detail")
    cache.delete("articles:list")

# YA (aksar cleaner) -- wahaan karो jahaan write hoता hai, ek signal mein nahi:
def publish_article(article):
    article.status = "published"; article.save(update_fields=["status"])
    cache.delete_many([f"article:{article.id}:detail", "articles:list", "homepage"])
\`\`\`

**Stampede (thundering herd)**

\`\`\`python
# BAD: hot key expire -> 500 concurrent requests sab miss -> sab 2s query chalाते hain -> DB melt
def get_leaderboard():
    data = cache.get("leaderboard")
    if data is None:
        data = compute_leaderboard()       # ek saath inmें se 500
        cache.set("leaderboard", data, 300)
    return data

# BETTER: ek worker recompute karता hai, baaki slightly-stale serve karते hain ya wait karते hain
def get_leaderboard():
    data = cache.get("leaderboard")
    if data is not None:
        return data
    if cache.add("leaderboard:lock", "1", timeout=30):     # maine lock jeetा
        try:
            data = compute_leaderboard()
            cache.set("leaderboard", data, 300)
        finally:
            cache.delete("leaderboard:lock")
        return data
    return cache.get("leaderboard:stale") or compute_cheap_fallback()
\`\`\`

**\`cached_property\` — EK instance ke jeevan bhar ke liye memoize**

\`\`\`python
from django.utils.functional import cached_property

class Invoice(models.Model):
    @cached_property
    def total(self):                       # prati instance ek baar computed, phir self.__dict__ par store
        return sum(line.amount for line in self.lines.all())
# ek shared cache NAHI -- ye sirf tab tak jeeता hai jab tak ye Python object (ek request)
\`\`\`

\`\`\`
short TTL       zero code, bounded staleness ; "instant hona chahिए" + expensive ke liye galat
key versioning purani entries orphaned ; ek counter bump karो YA updated_at embed karो
explicit del   precise ; signals (automatic, bulk_update/QuerySet.update miss kar sakte) YA service layer
stampede fix   recompute ke aas-paas cache.add(lock) ; YA probabilistic early expiry ; YA warm background job
cached_property per-instance, per-process, per-request -- memoization, NOT a distributed cache
QuerySet.update / bulk_create / bulk_update signals FIRE NAHI karते -> wahaan manually invalidate karो
\`\`\``,

    content: `## The three strategies

### 1. Short TTL — accept the staleness

Set a timeout you can live with and do nothing else. \`cache.set(key, value, 60)\` means "at most 60 seconds out of date". This is the right default when the data is not safety-critical and recomputing it once a minute is affordable. It has zero invalidation code and no bugs of omission. The downside is a fixed staleness floor: a change is invisible for up to the TTL.

### 2. Key versioning — orphan the old value

Instead of deleting the stale entry, change the key so nothing reads it any more. Two forms:

- **Embed a mutable attribute.** \`f"article:{a.id}:body:{a.updated_at.timestamp()}"\` — editing the article changes \`updated_at\`, so the next read computes a fresh key and misses; the old key is never requested again and expires on its own TTL. Zero explicit invalidation.
- **A version counter.** Keep \`cache.get("articles:version")\` and build list keys as \`f"articles:list:v{version}"\`. On any write that affects the list, \`cache.incr("articles:version")\`. Every \`v{old}\` key is now unreachable. One \`incr\` invalidates an entire family of keys — useful when you cannot enumerate them (paginated lists, per-filter variants).

Versioning avoids the "did I delete every key?" problem. The cost is that orphaned entries occupy memory until they expire (Redis will evict them under pressure).

### 3. Explicit deletion on write

Delete exactly the affected keys when the underlying data changes. Two places to do it:

- **Signals** (\`post_save\`, \`post_delete\`): automatic — any \`.save()\` fires them. But **\`QuerySet.update()\`, \`bulk_create()\`, \`bulk_update()\`, and raw SQL do not fire signals** (Module 3), so a bulk operation silently leaves stale cache. Signals also run inside the transaction — pair with \`transaction.on_commit\` so you do not invalidate before the write is durable.
- **The service layer** — call \`cache.delete_many([...])\` in the function that performs the write (\`publish_article\`, \`update_pricing\`). More code, but explicit, greppable, and it naturally covers bulk operations because you wrote them.

A hybrid is common: signals for the routine single-object case, plus explicit invalidation in the few bulk paths.

### Cache-aside vs write-through

- **Cache-aside** (what all of the above is): the app reads the cache, falls back to the DB on a miss, and populates the cache. Writes go to the DB and invalidate the cache. Simple, and a cache outage just means slower reads.
- **Write-through**: writes go through the cache, which forwards to the DB and keeps itself populated. Reads are always warm, but the write path is coupled to the cache and more complex. Rare in Django apps; cache-aside is the norm.

## The stampede (thundering herd / dog-piling)

When a popular key expires, every concurrent request misses at the same instant and all of them run the expensive recompute — hammering the DB or the upstream API exactly when the cache should be protecting it. Mitigations:

1. **A lock around the recompute.** The first miss does \`cache.add("key:lock", "1", timeout=30)\` (atomic on Redis/Memcached); it gets \`True\` and recomputes. Concurrent misses get \`False\` and either return a stale copy (keep a longer-lived \`"key:stale"\`), wait-and-retry, or serve a cheap fallback.
2. **Probabilistic early expiration.** Store the value with metadata (computed-at, cost). On read, with a probability that rises as the TTL approaches, one request voluntarily recomputes *before* expiry, so the key is refreshed while still serving the old value. Libraries implement this ("XFetch").
3. **Never let it expire; refresh in the background.** A Celery beat task recomputes the leaderboard every 4 minutes and \`cache.set\`s it with a 10-minute TTL. Requests only ever read. The cache is a materialised view maintained out-of-band.
4. **Soft TTL + hard TTL.** Serve past the soft TTL (stale-while-revalidate) and kick off one async refresh.

For a genuinely hot key (a homepage, a global leaderboard), option 3 is the most robust — the request path never computes.

## \`cached_property\`

\`@cached_property\` computes a method once and stores the result on the instance's \`__dict__\`, so later accesses are free. It is **not** the cache framework — it is per-instance memoization that lives exactly as long as that Python object, which in a web request is one request. Use it for a value derived from an instance that is accessed several times in a template or serializer (\`invoice.total\`, \`user.permission_set\`). It does nothing across requests and nothing across processes.

Related: \`functools.cache\` / \`lru_cache\` on a module-level function is per-process memoization that *persists* for the worker's lifetime — fine for pure functions of small inputs (parsing a config, a lookup table), dangerous for anything that can change or that keys on large/unbounded inputs (a memory leak).`,

    contentHi: `## Teen strategies

### 1. Short TTL — staleness accept karो

Ek timeout set karो jiske saath aap reh sako aur kuch mat karो. \`cache.set(key, value, 60)\` matlab "zyada se zyada 60 seconds purana". Ye sahi default hai jab data safety-critical nahi aur ise ek minute mein ek baar recompute karna affordable hai. Iske paas zero invalidation code hai. Nuksaan ek fixed staleness floor hai.

### 2. Key versioning — purani value ko orphan karो

Stale entry delete karने ke bजाy, key badलो taaki koi ise ab na padhe. Do roop:

- **Ek mutable attribute embed karो.** \`f"article:{a.id}:body:{a.updated_at.timestamp()}"\` — article edit karna \`updated_at\` badalता hai, toh agli read ek fresh key compute karती hai aur miss karती hai. Zero explicit invalidation.
- **Ek version counter.** \`cache.get("articles:version")\` rakhо aur list keys \`f"articles:list:v{version}"\` banाओ. Kisi bhi write par jо list ko affect karता hai, \`cache.incr("articles:version")\`. Har \`v{old}\` key ab unreachable hai.

Versioning "kya maine har key delete ki?" problem ko avoid karता hai. Cost ye hai ki orphaned entries memory occupy karती hain jab tak wo expire nahi hoती.

### 3. Write par explicit deletion

Jab underlying data badalता hai bilkul affected keys delete karो. Do jagah:

- **Signals** (\`post_save\`, \`post_delete\`): automatic. Par **\`QuerySet.update()\`, \`bulk_create()\`, \`bulk_update()\`, aur raw SQL signals FIRE NAHI karते** (Module 3), toh ek bulk operation chupchaap stale cache chhoड़ deता hai. Signals transaction ke andar bhi chalते hain — \`transaction.on_commit\` ke saath pair karो.
- **Service layer** — write karने waale function mein \`cache.delete_many([...])\` call karो. Zyada code, par explicit, greppable.

Ek hybrid aam hai: routine single-object case ke liye signals, plus kuch bulk paths mein explicit invalidation.

### Cache-aside vs write-through

- **Cache-aside** ( upar sab yahi hai): app cache padhता hai, miss par DB par fall back karता hai, cache populate karता hai. Writes DB ko jाते hain aur cache invalidate karते hain. Saral.
- **Write-through**: writes cache ke zariye jाते hain. Reads hamesha warm. Django apps mein rare; cache-aside norm hai.

## Stampede (thundering herd)

Jab ek popular key expire hoती hai, har concurrent request usi pal miss karती hai aur unmें se sab expensive recompute chalाती hain — DB ya upstream API ko bilkul tab hammer karते hue jab cache ise protect karना chahिए. Mitigations:

1. **Recompute ke aas-paas ek lock.** Pehla miss \`cache.add("key:lock", "1", timeout=30)\` karता hai; ise \`True\` milता hai aur recompute karता hai. Concurrent misses \`False\` paते hain aur ya ek stale copy return karते hain, wait-and-retry, ya ek cheap fallback.
2. **Probabilistic early expiration.** Value ko metadata ke saath store karो. Read par, ek probability ke saath jо TTL approach karते badhती hai, ek request svेच्छा se expiry se *pehle* recompute karता hai.
3. **Kabhi expire mat hone do; background mein refresh karो.** Ek Celery beat task har 4 minute mein leaderboard recompute karता hai. Requests sirf padhती hain.
4. **Soft TTL + hard TTL.** Soft TTL ke baad serve karो aur ek async refresh kick off karो.

Ek genuinely hot key ke liye, option 3 sabse robust hai.

## \`cached_property\`

\`@cached_property\` ek method ko ek baar compute karता hai aur result ko instance ke \`__dict__\` par store karता hai. Ye cache framework **nahi** hai — ye per-instance memoization hai jо bilkul tab tak jeeта hai jab tak wo Python object, jо ek web request mein ek request hai. Ise ek instance se derived value ke liye istemal karो jо ek template ya serializer mein kai baar access hoती hai.

Related: ek module-level function par \`functools.cache\` / \`lru_cache\` per-process memoization hai jо worker ke jeevan bhar *persist* karता hai — pure functions ke liye theek, kuch bhi jо badल sakta hai ya bade inputs par key karता hai uske liye khatarनाk (ek memory leak).`,

    examples: [
      {
        title: 'Key versioning: one incr orphans an entire family of cache keys',
        titleHi: 'Key versioning: ek incr keys ke poore family ko orphan karता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, INSTALLED_APPS=[], USE_TZ=True,
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}})
django.setup()

from django.core.cache import cache

def articles_version():
    return cache.get_or_set("articles:version", 1, None)   # never expires

def list_key(page):
    return f"articles:list:p{page}:v{articles_version()}"

def get_page(page):
    key = list_key(page)
    hit = cache.get(key)
    if hit is not None:
        return hit, "HIT"
    value = [f"article-{page}-{i}" for i in range(3)]       # pretend: an expensive query
    cache.set(key, value, timeout=3600)
    return value, "MISS"

print("page 1:", get_page(1))
print("page 2:", get_page(2))
print("page 1 again:", get_page(1))

# a write happens somewhere -> bump the version -> ALL list pages are invalidated at once
cache.incr("articles:version")
print("--- version bumped ---")
print("current version:", articles_version())
print("page 1 after bump:", get_page(1), "(recomputed under v2)")
print("page 2 after bump:", get_page(2), "(recomputed under v2)")

# the old v1 keys still physically exist but nothing constructs them any more
print("orphaned v1 key still in cache:", cache.get("articles:list:p1:v1") is not None)`,
        output: `page 1: (['article-1-0', 'article-1-1', 'article-1-2'], 'MISS')
page 2: (['article-2-0', 'article-2-1', 'article-2-2'], 'MISS')
page 1 again: (['article-1-0', 'article-1-1', 'article-1-2'], 'HIT')
--- version bumped ---
current version: 2
page 1 after bump: (['article-1-0', 'article-1-1', 'article-1-2'], 'MISS') (recomputed under v2)
page 2 after bump: (['article-2-0', 'article-2-1', 'article-2-2'], 'MISS') (recomputed under v2)
orphaned v1 key still in cache: True
`,
        explain: "The list keys embed a version number that lives in the cache itself ('articles:version'). Every page's key is 'articles:list:p{n}:v{version}'. A single cache.incr('articles:version') changes the version for all pages at once, so the next request for any page constructs a v2 key, misses, and recomputes -- you invalidated a whole family with one atomic operation and no key enumeration. The old v1 keys are still physically present (the last line proves it) but nothing builds those key strings any more, so they just sit until their TTL expires. This is the go-to pattern when a write affects an unknown set of cached keys.",
        explainHi: "List keys ek version number embed karti hain jo cache mein hi rehta hai ('articles:version'). Har page ki key 'articles:list:p{n}:v{version}' hai. Ek single cache.incr('articles:version') sab pages ke liye version ek saath badalta hai, toh kisi bhi page ke liye agli request ek v2 key banati hai, miss karti hai, aur recompute karti hai -- aapne ek poore family ko ek atomic operation se invalidate kiya bina key enumeration ke. Purani v1 keys abhi bhi physically maujood hain par unhe koi build nahi karta.",
      },
      {
        title: 'Signals invalidate on .save() but MISS QuerySet.update()',
        titleHi: 'Signals `.save()` par invalidate karते hain par `QuerySet.update()` MISS karते hain',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}})
django.setup()

from django.db import models, connection
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.cache import cache

class Product(models.Model):
    name = models.CharField(max_length=50)
    price = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Product)

@receiver(post_save, sender=Product)
def drop_cache(sender, instance, **kwargs):
    cache.delete(f"product:{instance.id}:price")
    print(f"  [signal] cleared product:{instance.id}:price")

def cached_price(pid):
    key = f"product:{pid}:price"
    v = cache.get(key)
    if v is None:
        v = Product.objects.get(pk=pid).price
        cache.set(key, v, 3600)
    return v

p = Product.objects.create(name="Widget", price=100)
print("initial cached price:", cached_price(p.id))

# .save() fires post_save -> cache cleared -> next read is fresh
p.price = 150
p.save()
print("after .save(): ", cached_price(p.id))

# QuerySet.update() does NOT fire signals -> cache is stale
Product.objects.filter(pk=p.id).update(price=999)
print("DB now:", Product.objects.get(pk=p.id).price)
print("cache still says:", cached_price(p.id), "<-- STALE, no signal fired")

# must invalidate manually alongside the bulk write
Product.objects.filter(pk=p.id).update(price=42)
cache.delete(f"product:{p.id}:price")
print("after manual delete:", cached_price(p.id))`,
        output: `  [signal] cleared product:1:price
initial cached price: 100
  [signal] cleared product:1:price
after .save():  150
DB now: 999
cache still says: 150 <-- STALE, no signal fired
after manual delete: 42
`,
        explain: 'A post_save receiver on Product deletes the cache key -- so p.save() clears it (and, incidentally, so does the initial create()), and the next cached_price() reads fresh from the DB. But Product.objects.filter(...).update(price=999) does NOT emit post_save (nor do bulk_create, bulk_update, or a raw queryset update), so the receiver never fires and cached_price() keeps returning the stale 150 while the DB says 999. The fix is to invalidate explicitly next to every bulk write, as the last two lines do. Signal-based invalidation is convenient but has this exact blind spot.',
        explainHi: 'Product par ek post_save receiver cache key delete karta hai -- toh p.save() ise clear karta hai, aur agla cached_price() DB se fresh padhta hai. Par Product.objects.filter(...).update(price=999) post_save emit NAHI karta (na hi bulk_create, bulk_update), toh receiver kabhi fire nahi hota aur cached_price() stale 150 lautata rehta hai jabki DB 999 kehta hai. Fix ye hai ki har bulk write ke bagal mein explicitly invalidate karo. Signal-based invalidation suvidhajanak hai par iska yahi blind spot hai.',
      },
      {
        title: 'The stampede: a lock so only one worker recomputes a hot key',
        titleHi: 'Stampede: ek lock taaki sirf ek worker ek hot key recompute kare',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, INSTALLED_APPS=[], USE_TZ=True,
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}})
django.setup()

from django.core.cache import cache
from concurrent.futures import ThreadPoolExecutor
import threading

compute_calls = []
lock_for_count = threading.Lock()

def compute_leaderboard():
    with lock_for_count:
        compute_calls.append(1)
    # pretend this is a 200ms aggregation over millions of rows
    import time; time.sleep(0.2)
    return ["alice", "bob", "carol"]

def naive_get():
    data = cache.get("lb")
    if data is None:
        data = compute_leaderboard()
        cache.set("lb", data, 300)
    return data

def guarded_get():
    data = cache.get("lb2")
    if data is not None:
        return data
    if cache.add("lb2:lock", "1", timeout=30):        # atomic on Redis; only one winner
        try:
            data = compute_leaderboard()
            cache.set("lb2", data, 300)
            cache.set("lb2:stale", data, 3600)        # keep a fallback
        finally:
            cache.delete("lb2:lock")
        return data
    return cache.get("lb2:stale") or ["(warming up)"]  # losers serve stale / fallback

# 20 concurrent requests hit a cold key
compute_calls.clear()
with ThreadPoolExecutor(max_workers=20) as ex:
    list(ex.map(lambda _: naive_get(), range(20)))
print("NAIVE   -> compute_leaderboard ran", len(compute_calls), "times (stampede)")

compute_calls.clear()
with ThreadPoolExecutor(max_workers=20) as ex:
    list(ex.map(lambda _: guarded_get(), range(20)))
print("GUARDED -> compute_leaderboard ran", len(compute_calls), "time(s)")`,
        output: `NAIVE   -> compute_leaderboard ran 20 times (stampede)
GUARDED -> compute_leaderboard ran 1 time(s)
`,
        explain: "When a hot key expires, every concurrent request misses at the same instant and they all recompute it -- 20 threads run the 200ms aggregation 20 times (the stampede / thundering herd / dogpile). The guarded version uses cache.add('lb2:lock', ...) which is atomic: exactly one thread wins the lock and does the recompute, the losers immediately serve a kept-around stale copy (or a placeholder). compute_leaderboard runs once. In production you also give the lock a sane timeout so a crashed worker cannot wedge the key forever, and often refresh slightly before expiry so there is always a warm value.",
        explainHi: "Jab ek hot key expire hoti hai, har concurrent request ek hi pal mein miss karti hai aur sab ise recompute karti hain -- 20 threads 200ms aggregation 20 baar chalate hain (stampede / thundering herd). Guarded version cache.add('lb2:lock', ...) istemal karta hai jo atomic hai: theek ek thread lock jeetta hai aur recompute karta hai, losers turant ek rakhi hui stale copy serve karte hain. compute_leaderboard ek baar chalta hai. Production mein aap lock ko ek sane timeout bhi dete ho taaki ek crashed worker key ko hamesha ke liye wedge na kare.",
      },
    ],

    mistakes: [
      {
        wrong: `@receiver(post_save, sender=Order)
def invalidate(sender, instance, **kwargs):
    cache.delete(f"customer:{instance.customer_id}:orders")
# then a nightly job:  Order.objects.filter(status="pending", ...).update(status="expired")
# -> hundreds of customers' order caches are now stale; the signal never fired`,
        right: `def expire_stale_orders():
    qs = Order.objects.filter(status="pending", created__lt=cutoff)
    affected = list(qs.values_list("customer_id", flat=True).distinct())
    qs.update(status="expired")
    cache.delete_many([f"customer:{cid}:orders" for cid in affected])`,
        why: '`post_save` / `post_delete` fire on `Model.save()` and `Model.delete()` only. `QuerySet.update()`, `bulk_create()`, `bulk_update()`, `delete()` on a queryset, and raw SQL bypass them entirely (Module 2). Any bulk write path must invalidate the cache itself. Signals are fine for the interactive single-object case, but you cannot rely on them alone — audit every bulk operation.',
        whyHi: '`post_save` / `post_delete` sirf `Model.save()` aur `Model.delete()` par fire hote hain. `QuerySet.update()`, `bulk_create()`, `bulk_update()` unhe poori tarah bypass karते hain (Module 2). Koi bhi bulk write path ko cache khud invalidate karna chahिए. Signals interactive single-object case ke liye theek hain par unpar akelе bharosा nahi kar sakte.',
      },
      {
        wrong: `@receiver(post_save, sender=Article)
def clear(sender, instance, **kwargs):
    cache.delete(f"article:{instance.id}")
# fires DURING the transaction -- if the outer transaction then rolls back,
# the cache is cleared but the DB still has the old row -> next read re-caches the OLD value`,
        right: `from django.db import transaction

@receiver(post_save, sender=Article)
def clear(sender, instance, **kwargs):
    transaction.on_commit(lambda: cache.delete(f"article:{instance.id}"))
# the delete runs only after the write is durably committed`,
        why: 'Signals fire inside the transaction that triggered the save. If that transaction later rolls back (an error further down, `ATOMIC_REQUESTS`), you have already deleted the cache entry for a change that did not happen — and the next reader repopulates it from the DB, which still holds the old value, so you are back to stale *and* you paid for the recompute. Wrap cache invalidation in `transaction.on_commit` so it only runs when the write actually lands.',
        whyHi: 'Signals us transaction ke andar fire hote hain jisne save trigger kiya. Agar wo transaction baad mein roll back hoता hai, aapne ek change ke liye cache entry pehle hi delete kar di jо hua nahi — aur agla reader ise DB se repopulate karता hai, jismें abhi bhi purani value hai. Cache invalidation ko `transaction.on_commit` mein wrap karो.',
      },
      {
        wrong: `class Report:
    @cached_property
    def summary(self):
        return heavy_computation()

report = Report()
cache.set("report_summary", report.summary, 3600)   # fine
# ... but elsewhere someone does:
GLOBAL_REPORT = Report()                             # module-level, lives forever
GLOBAL_REPORT.summary                                # cached_property now frozen for the process lifetime`,
        right: `# cached_property is for a short-lived instance (one request). Don't stash the instance globally.
# for process-lifetime memoization of a pure function, use functools.cache explicitly and deliberately:
from functools import cache as fn_cache

@fn_cache
def config_table():                                  # pure, tiny, never changes at runtime
    return parse_config()`,
        why: '`@cached_property` stores the result on the instance and never recomputes for the life of that object. On a request-scoped instance that is exactly right. On an instance you keep in a module global (or a long-lived service object), the value is frozen for the entire process — a stale-data bug that only shows up after a deploy or a data change, and only on some workers. Keep `cached_property` on ephemeral objects; use `functools.cache` explicitly when you actually want process-lifetime memoization of a pure function.',
        whyHi: '`@cached_property` result ko instance par store karता hai aur us object ke jeevan bhar kabhi recompute nahi karता. Ek request-scoped instance par ye bilkul sahi hai. Ek instance par jise aap ek module global mein rakhते ho, value poore process ke liye frozen hai — ek stale-data bug jо sirf ek deploy ke baad dikhता hai. `cached_property` ephemeral objects par rakhो.',
      },
    ],

    realWorld: [
      {
        en: '**Short TTL as the default, versioning for list/search keys, explicit delete for the detail key** — `article:{id}:detail` deleted by an `on_commit` signal on save; `articles:list:*` and `search:*` invalidated by bumping `articles:version`; everything else just has a 60-300s TTL and nobody worries about it.',
        hi: '**Short TTL default ke roop mein, list/search keys ke liye versioning, detail key ke liye explicit delete** — `article:{id}:detail` ek `on_commit` signal se delete; `articles:list:*` `articles:version` bump karके invalidate; baaki sab bस ek 60-300s TTL rakhता hai.',
      },
      {
        en: '**A Celery beat task warming the homepage / leaderboard every few minutes**, so the request path never computes it — `cache.set("homepage:blocks", render_blocks(), 900)` on a 5-minute schedule with a 15-minute TTL as a safety margin. The stampede is impossible because requests only read.',
        hi: '**Ek Celery beat task jо homepage / leaderboard ko har kuch minute warm karता hai**, taaki request path ise kabhi compute na kare — 5-minute schedule par `cache.set(...)` 15-minute TTL ke saath. Stampede asंbhav hai kyunki requests sirf padhती hain.',
      },
      {
        en: '**`cache.add(lock)` around any recompute of a genuinely hot key**, with a `":stale"` copy at 10x the TTL as the fallback for the losers. Combined with per-key metrics so you can see which keys are hot enough to move to a background-warm strategy.',
        hi: '**Ek genuinely hot key ke kisi bhi recompute ke aas-paas `cache.add(lock)`**, losers ke liye fallback ke roop mein 10x TTL par ek `":stale"` copy. Per-key metrics ke saath combined taaki aap dekh sako kaunसी keys hot hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the practical cache-invalidation strategies, and what is the trade-off of each?',
        qHi: 'Vyavhaarik cache-invalidation strategies kya hain, aur har ek ka trade-off kya hai?',
        a: 'Three that actually work. First, a short time-to-live and nothing else: you set a timeout you can tolerate and accept that a change is invisible until it expires. Zero code, no bugs of omission, and a cache outage just means slower reads. The trade-off is a fixed staleness floor, so it is wrong when data must appear instantly and is also expensive to recompute. Second, key versioning: instead of deleting a stale entry you change the key so nothing reads it any more. You can embed a mutable attribute like updated_at directly in the key, so editing the object naturally produces a fresh key and the old one is simply never requested again; or you keep a version counter and build a whole family of keys with that version in them, and on a relevant write you increment the counter, which orphans every key in that family at once. Versioning solves the "did I remember to delete every variant?" problem, which matters for paginated lists and per-filter caches you cannot enumerate. The cost is that orphaned entries sit in memory until they expire, though Redis evicts them under pressure. Third, explicit deletion on write: you delete exactly the affected keys when the data changes. Signals like post_save make this automatic for single-object saves, but they do not fire for QuerySet.update, bulk_create, bulk_update, or raw SQL, so bulk paths silently leave stale cache; and signals run inside the transaction, so you should wrap the delete in transaction.on_commit or a rollback leaves you with a cleared cache and an unchanged database. The alternative is to invalidate in the service function that performs the write, which is more code but explicit and naturally covers the bulk cases. In practice you combine them: short TTL as the baseline, versioning for list and search keys, explicit on-commit invalidation for the hot detail keys.',
        aHi: 'Teen jо asal mein kaam karती hain. Pehli, ek short time-to-live aur kuch nahi: aap ek timeout set karते ho jise aap tolerate kar sako aur accept karते ho ki ek change expire hone tak invisible hai. Zero code. Trade-off ek fixed staleness floor hai. Doosri, key versioning: ek stale entry delete karने ke bजाy aap key badलते ho taaki koi ise ab na padhe. Aap ek mutable attribute jaise updated_at ko seedhे key mein embed kar sakte ho; ya aap ek version counter rakhते ho aur us version ke saath keys ka ek poora family banаते ho, aur ek relevant write par aap counter increment karते ho, jо us family ki har key ko ek saath orphan karता hai. Teesri, write par explicit deletion: aap data badalने par bilkul affected keys delete karते ho. post_save jaisे signals ise single-object saves ke liye automatic banाते hain, par wo QuerySet.update, bulk_create, bulk_update ke liye fire nahi hote; aur signals transaction ke andar chalते hain, toh aapको delete ko transaction.on_commit mein wrap karna chahिए. Vyavhaar mein aap unhe combine karते ho.',
      },
      {
        q: 'What is a cache stampede and how do you prevent it?',
        qHi: 'Ek cache stampede kya hai aur aap ise kaise rokते ho?',
        a: 'A cache stampede, also called the thundering herd or dog-piling, happens when a popular cached key expires and, in that same instant, every concurrent request for it misses. Each of those requests then independently runs the expensive computation the cache was protecting — a heavy aggregation, a slow upstream API call — so instead of one recompute you get hundreds, all hitting the database or the third party at once, exactly when load is highest. The cache stops protecting anything precisely when you need it most. There are several fixes. The simplest is a lock around the recompute: the first request to miss does an atomic cache-add on a lock key with a short timeout; add succeeds for exactly one caller across all workers because Redis and Memcached implement it atomically on the server. That caller recomputes and repopulates; the others, which got a false from add, either return a slightly stale value from a longer-lived backup key, wait briefly and retry the read, or serve a cheap fallback. A second approach is probabilistic early expiration: you store the value with its computation cost and timestamp, and on each read there is a small chance, rising as the expiry approaches, that a request voluntarily recomputes before the key actually expires, so the refresh happens while the old value is still being served. A third, and the most robust for a genuinely hot key like a homepage or a global leaderboard, is to never let the key expire from the request path at all: a background job — Celery beat — recomputes it on a schedule and writes it with a TTL longer than the schedule interval as a safety margin, and requests only ever read. The cache becomes a materialised view maintained out of band, and a stampede is structurally impossible.',
        aHi: 'Ek cache stampede, jise thundering herd bhi kehते hain, tab hoता hai jab ek popular cached key expire hoती hai aur, usi pal, iske liye har concurrent request miss karती hai. Un requests mें se har ek phir svतंtrata se wo expensive computation chalाती hai jise cache protect kar raha tha — ek heavy aggregation, ek slow upstream API call — toh ek recompute ke bजाy aapको saikड़ों milते hain, sab ek saath database ko hit karते hue. Kई fixes hain. Sabse saral recompute ke aas-paas ek lock hai: pehli request jо miss karती hai ek lock key par ek atomic cache-add karती hai; add bilkul ek caller ke liye safal hoता hai sab workers ke paar. Wo caller recompute karता hai; baaki, jinhe add se false mila, ya ek slightly stale value return karते hain, ya briefly wait karके retry karते hain. Ek doosra approach probabilistic early expiration hai. Ek teesra, aur ek genuinely hot key ke liye sabse robust, key ko request path se kabhi expire hone hi na dena hai: ek background job ise ek schedule par recompute karता hai, aur requests sirf padhती hain.',
      },
    ],

    exercises: [
      {
        task: 'Key versioning. `articles_version()` = `cache.get_or_set("articles:version", 1, None)`. `list_key(page)` = `f"articles:list:p{page}:v{articles_version()}"`. `get_page(page)` returns `(value, "HIT"|"MISS")`, caching a computed list for 3600s. Call `get_page(1)`, `get_page(2)`, `get_page(1)` -> MISS/MISS/HIT. Then `cache.incr("articles:version")` and call `get_page(1)`, `get_page(2)` -> both MISS (new version). Assert the old `articles:list:p1:v1` key still physically exists (`cache.get(...) is not None`).',
        taskHi: 'Key versioning. `articles_version()`, `list_key(page)`, `get_page(page)`. `get_page(1)`, `(2)`, `(1)` -> MISS/MISS/HIT. Phir `cache.incr("articles:version")` aur `get_page(1)`, `(2)` -> dono MISS. Purani `...v1` key abhi bhi maujūd assert karो.',
        hint: '`cache.get_or_set("articles:version", 1, None)` — `None` timeout = never expire. `cache.incr` needs the key to already exist (it does, via `get_or_set`). Physical key check: `cache.get("articles:list:p1:v1")`.',
        hintHi: '`cache.get_or_set("articles:version", 1, None)`. `cache.incr` ko key maujūd chahिए. Physical key: `cache.get("articles:list:p1:v1")`.',
      },
      {
        task: 'Signals vs bulk. Model `Item` (`name`, `qty` int). A `post_save` receiver that `cache.delete(f"item:{instance.id}:qty")` and prints a marker. `cached_qty(id)` reads through the cache. Create an item, read it (caches 5). `item.qty = 10; item.save()` -> receiver fires, next read is `10`. Then `Item.objects.filter(pk=id).update(qty=99)` -> assert `cached_qty(id)` STILL returns `10` (stale, no signal). Then `.update(qty=7)` + explicit `cache.delete(...)` -> read returns `7`.',
        taskHi: 'Signals vs bulk. `Item` (`name`, `qty`) model karो. `post_save` receiver jо cache delete kare. `cached_qty(id)`. `.save()` -> receiver fire. `QuerySet.update()` -> cache STALE (no signal). Manual delete -> fresh.',
        hint: '`from django.db.models.signals import post_save; from django.dispatch import receiver`. `@receiver(post_save, sender=Item)`. `QuerySet.update()` bypasses `save()` entirely -> no `post_save` -> stale cache is the point.',
        hintHi: '`@receiver(post_save, sender=Item)`. `QuerySet.update()` `save()` ko bypass karता hai -> koi `post_save` nahi -> stale cache.',
      },
      {
        task: 'Stampede. `compute()` sleeps 0.15s, appends to a shared list (guard with a `threading.Lock`), returns a value. `naive_get()`: `cache.get` -> on miss `compute()` + `cache.set`. `guarded_get()`: `cache.get` -> return if hit; else `cache.add("k:lock", "1", 30)` -> if won, `compute()` + `set` + `set("k:stale", ...)` + delete lock; if lost, return `cache.get("k:stale") or "warming"`. Fire 15 threads at each (cold cache) via `ThreadPoolExecutor`. Assert `naive` ran `compute()` ~15 times and `guarded` ran it exactly once.',
        taskHi: 'Stampede. `compute()` 0.15s sleep. `naive_get()` vs `guarded_get()` (`cache.add` lock ke saath). `ThreadPoolExecutor` se 15 threads. `naive` ~15 baar `compute()` chalाता hai, `guarded` bilkul ek baar.',
        hint: '`from concurrent.futures import ThreadPoolExecutor`. `with ThreadPoolExecutor(max_workers=15) as ex: list(ex.map(lambda _: fn(), range(15)))`. `cache.add` is atomic-ish even on LocMemCache within one process. Clear the shared counter list between the two runs.',
        hintHi: '`from concurrent.futures import ThreadPoolExecutor`. `ex.map(lambda _: fn(), range(15))`. `cache.add` ek process ke andar atomic-ish hai. Do runs ke beech counter clear karो.',
      },
    ],

    keyTakeaways: [
      'Three invalidation strategies: (1) SHORT TTL — accept bounded staleness, zero code, right when data isn\'t critical + recompute is cheap; (2) KEY VERSIONING — change the key so the old value is unreachable; (3) EXPLICIT DELETE on write.',
      'Key versioning: embed a mutable attr (`f"...:{obj.updated_at.timestamp()}"` — edits auto-re-key) OR a version counter (`f"...:v{version}"` + `cache.incr("...:version")` orphans the WHOLE family at once — for keys you can\'t enumerate like paginated/filtered lists). Orphans occupy memory until TTL/eviction.',
      'Explicit delete via SIGNALS (`post_save`/`post_delete`) is automatic for `.save()`/`.delete()` — but `QuerySet.update()`, `bulk_create()`, `bulk_update()`, raw SQL DO NOT fire signals (Module 2/3) -> bulk paths must invalidate manually.',
      'Signals fire INSIDE the transaction — wrap cache invalidation in `transaction.on_commit(...)` so a rollback doesn\'t leave you with a cleared cache + unchanged DB (which then re-caches the OLD value).',
      'Or invalidate in the SERVICE LAYER (the function doing the write) — more code, but explicit, greppable, and naturally covers bulk operations you wrote.',
      'Cache-aside (app reads cache, falls back to DB on miss, writes invalidate) is the Django norm. Write-through (writes go through the cache) is rare and more coupled.',
      'THE STAMPEDE: a hot key expires -> every concurrent request misses -> all recompute at once -> DB/upstream melts. Fixes: (1) `cache.add(lock)` around the recompute (one winner, losers serve `":stale"` or a fallback); (2) probabilistic early expiry ("XFetch"); (3) BEST for a truly hot key — a background job (Celery beat) warms it on a schedule so the request path NEVER computes.',
      '`@cached_property` = per-INSTANCE memoization, lives as long as the Python object (= one request). NOT the cache framework, nothing across requests/processes. `functools.cache`/`lru_cache` on a module function = per-PROCESS, persists for the worker\'s life — only for pure functions of small, unchanging inputs.',
    ],
    keyTakeawaysHi: [
      'Teen invalidation strategies: (1) SHORT TTL — bounded staleness accept karो, zero code; (2) KEY VERSIONING — key badलो taaki purani value unreachable ho; (3) write par EXPLICIT DELETE.',
      'Key versioning: ek mutable attr embed karो (`f"...:{obj.updated_at.timestamp()}"` — edits auto-re-key) YA ek version counter (`f"...:v{version}"` + `cache.incr(...)` POORE family ko ek saath orphan karता hai — un keys ke liye jinhe aap enumerate nahi kar sakte). Orphans TTL/eviction tak memory occupy karते hain.',
      'SIGNALS (`post_save`/`post_delete`) se explicit delete `.save()`/`.delete()` ke liye automatic hai — par `QuerySet.update()`, `bulk_create()`, `bulk_update()`, raw SQL signals FIRE NAHI karते -> bulk paths ko manually invalidate karna hoगा.',
      'Signals transaction ke ANDAR fire hote hain — cache invalidation ko `transaction.on_commit(...)` mein wrap karो taaki ek rollback aapko ek cleared cache + unchanged DB na de.',
      'Ya SERVICE LAYER mein invalidate karो (write karने waala function) — zyada code, par explicit, greppable.',
      'Cache-aside (app cache padhता hai, miss par DB, writes invalidate) Django norm hai. Write-through rare hai.',
      'STAMPEDE: ek hot key expire -> har concurrent request miss -> sab ek saath recompute -> DB melt. Fixes: (1) recompute ke aas-paas `cache.add(lock)`; (2) probabilistic early expiry; (3) ek truly hot key ke liye BEST — ek background job (Celery beat) ise ek schedule par warm karता hai taaki request path KABHI compute na kare.',
      '`@cached_property` = per-INSTANCE memoization, Python object ke jitna jeeता hai (= ek request). Cache framework NAHI. `functools.cache`/`lru_cache` ek module function par = per-PROCESS — sirf pure functions ke liye.',
    ],
  },
];
