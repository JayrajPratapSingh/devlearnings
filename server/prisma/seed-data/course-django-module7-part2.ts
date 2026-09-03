/**
 * Django Complete Course — Module 7: Caching & Performance at Scale, lessons 4-6.
 *
 * Lesson 4: HTTP caching — ETag / Last-Modified, conditional requests -> 304,
 *           @condition, ConditionalGetMiddleware, Cache-Control directives,
 *           @cache_control / @never_cache, CDN / reverse-proxy caching, Vary.
 * Lesson 5: DB connections & locking — CONN_MAX_AGE / CONN_HEALTH_CHECKS,
 *           pgbouncer pooling modes and what breaks, ATOMIC_REQUESTS,
 *           select_for_update (+ nowait / skip_locked, must be in atomic), profiling.
 * Lesson 6: caching in DRF — low-level cache keyed by (resource, version, user-scope),
 *           drf-extensions @cache_response, ETags for APIs, cached_property on
 *           serializers, a separate cache alias per concern.
 *
 * Conventions: see course-django-module7.ts header.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_7_PART2: CourseLesson[] = [
  {
    slug: 'dj-http-caching-etags-cache-control',
    title: 'HTTP Caching: ETags, `Last-Modified`, `Cache-Control`',
    titleHi: 'HTTP Caching: ETags, `Last-Modified`, `Cache-Control`',
    description: 'HTTP caching pushes the cache *out of your server* — into the browser and any CDN or reverse proxy in front of it. `Cache-Control` tells them how long they may reuse a response; an `ETag` or `Last-Modified` lets a client ask "has it changed?" and get a tiny `304 Not Modified` instead of the full body.',
    descriptionHi: 'HTTP caching cache ko *aapke server ke bahar* dhakelता hai — browser aur uske aage kisi CDN ya reverse proxy mein. `Cache-Control` unhe batाता hai ki wo ek response kितni der reuse kar sakte hain; ek `ETag` ya `Last-Modified` ek client ko poochने deता hai "kya ye badla?" aur full body ke bजाy ek chhota `304 Not Modified` paता hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 4,

    analogy: {
      en: '**A newspaper archive that stamps every article with an edition number and lets you phone ahead.** `Cache-Control: max-age=3600` is the archivist saying "this clipping is good for an hour — don\'t call me back before then, just use your copy". After the hour, or for anything marked `no-cache`, you *do* call back — but you don\'t ask them to read the whole article down the phone. You say "I have edition 47 of the Tuesday piece" and they check: if it\'s still edition 47 they just say "yep, unchanged" (a `304` — a few bytes) and you keep reading your copy; only if it\'s edition 48 do they courier the new text (`200` with the full body). The edition number is the `ETag` (a hash or version of the content); "when was it last revised" is `Last-Modified`. And a CDN is a regional branch of the archive: it holds copies close to readers, honours the same `Cache-Control` and `ETag` rules, and only phones head office when its own copy is stale — so most readers never reach your server at all.',
      hi: '**Ek newspaper archive jо har article ko ek edition number se stamp karता hai aur aapko phone ahead karने deता hai.** `Cache-Control: max-age=3600` archivist keh raha hai "ye clipping ek ghante ke liye achhी hai — tab tak wapas mat call karो, bस apni copy istemal karो". Ghante ke baad, ya `no-cache` waali kisi cheez ke liye, aap *call karते ho* — par aap unse poora article phone par padhने ko nahi kehते. Aap kehते ho "mere paas Tuesday piece ka edition 47 hai" aur wo check karते hain: agar ye abhi bhi edition 47 hai wo bस "haan, unchanged" kehते hain (ek `304` — kuch bytes) aur aap apni copy padhते raho; sirf agar ye edition 48 hai wo naya text courier karते hain (`200` full body ke saath). Edition number `ETag` hai; "aakhिrी baar kab revise hua" `Last-Modified` hai. Aur ek CDN archive ki ek regional branch hai: ye readers ke paas copies rakhता hai, wahi rules honour karता hai, aur sirf tab head office phone karता hai jab iski apni copy stale hai — toh zyादातr readers kabhi aapke server tak nahi pahुँchते.',
    },

    simple: `**\`Cache-Control\` — how long may this be reused, and by whom**

\`\`\`python
from django.views.decorators.cache import cache_control, never_cache

@cache_control(max_age=3600, public=True)          # any cache (browser + CDN) for 1 hour
def press_release(request): ...

@cache_control(max_age=60, private=True)           # the browser only (not a shared CDN), 60s
def my_feed(request): ...

@cache_control(no_cache=True)                      # must revalidate every time (ETag still helps)
def stock_price(request): ...

@never_cache                                       # no-cache, no-store, must-revalidate -> never reused
def account(request): ...
\`\`\`

\`\`\`
Cache-Control directives:
  max-age=N        reuse for N seconds without asking
  s-maxage=N       ^ but for SHARED caches (CDN) only -- overrides max-age there
  public           any cache may store it
  private          only the end-user's browser (never a CDN) -- use for per-user responses
  no-cache         may store, but MUST revalidate (send a conditional request) before reuse
  no-store         do not store at all -- for truly sensitive responses
  must-revalidate  once stale, a cache MUST revalidate, never serve stale on error
  stale-while-revalidate=N   serve stale for N s while refreshing in the background
\`\`\`

**Conditional requests: \`ETag\` / \`Last-Modified\` -> \`304\`**

\`\`\`python
from django.views.decorators.http import condition

def article_etag(request, pk):
    return Article.objects.values_list("version", flat=True).get(pk=pk)   # any stable content id

def article_mtime(request, pk):
    return Article.objects.values_list("updated_at", flat=True).get(pk=pk)

@condition(etag_func=article_etag, last_modified_func=article_mtime)
def article_detail(request, pk):
    # this body only runs on a MISS -- if the client's ETag/date still matches, DRF returns 304
    return render(request, "article.html", {"article": Article.objects.get(pk=pk)})
\`\`\`

\`\`\`
1st request:  GET /articles/7/            -> 200 + ETag: "v12"  + Last-Modified: <date>
2nd request:  GET /articles/7/  If-None-Match: "v12"  -> 304 Not Modified (empty body)
after edit:   GET /articles/7/  If-None-Match: "v12"  -> 200 + ETag: "v13"  (full body)
\`\`\`

**\`ConditionalGetMiddleware\` — cheap 304s for free**

\`\`\`python
MIDDLEWARE = [..., "django.middleware.http.ConditionalGetMiddleware", ...]
# if a response already has an ETag/Last-Modified and the request's If-None-Match / If-Modified-Since
# matches, the middleware strips the body and returns 304 -- you still computed the response, but you
# save the bandwidth. Pair with GZipMiddleware / a CDN.
\`\`\`

**\`Vary\` — "this response depends on these request headers"**

\`\`\`python
from django.views.decorators.vary import vary_on_headers, vary_on_cookie

@vary_on_headers("Accept-Encoding", "Accept-Language")   # cache separately per encoding + language
@vary_on_cookie                                          # ... and per cookie (per-user)
def page(request): ...
# Vary tells every cache (browser, CDN, Django's cache_page) which requests are "the same"
\`\`\`

\`\`\`
in-server cache (lessons 1-3)   stores the response in Redis ; your server still handles the request
HTTP cache (this lesson)        the browser / CDN reuses the response ; your server is not hit at all
conditional request             client HAS a stale copy -> asks "changed?" -> 304 (bytes) or 200 (full)
ETag         opaque content id (hash / version) -> If-None-Match -> exact-match revalidation
Last-Modified a timestamp      -> If-Modified-Since -> "newer than this?" revalidation (1s resolution)
CDN                             honours Cache-Control + ETag + Vary ; s-maxage targets it specifically
\`\`\``,

    simpleHi: `**\`Cache-Control\` — ye kितni der reuse ho sakta hai, aur kiske dwara**

\`\`\`python
from django.views.decorators.cache import cache_control, never_cache

@cache_control(max_age=3600, public=True)          # koi bhi cache (browser + CDN) 1 ghante ke liye
def press_release(request): ...

@cache_control(max_age=60, private=True)           # sirf browser (shared CDN nahi), 60s
def my_feed(request): ...

@cache_control(no_cache=True)                      # har baar revalidate karna chahिए
def stock_price(request): ...

@never_cache                                       # no-cache, no-store, must-revalidate -> kabhi reused nahi
def account(request): ...
\`\`\`

\`\`\`
Cache-Control directives:
  max-age=N        N seconds ke liye bina poochे reuse
  s-maxage=N       ^ par sirf SHARED caches (CDN) ke liye
  public           koi bhi cache store kar sakta hai
  private          sirf end-user ka browser (kabhi CDN nahi) -- per-user responses ke liye
  no-cache         store kar sakta hai, par reuse se pehle revalidate KARNA CHAHIYE
  no-store         bilkul store mat karो -- truly sensitive responses ke liye
  must-revalidate  stale hone par revalidate karna CHAHIYE
  stale-while-revalidate=N   background mein refresh karते hue N s ke liye stale serve karो
\`\`\`

**Conditional requests: \`ETag\` / \`Last-Modified\` -> \`304\`**

\`\`\`python
from django.views.decorators.http import condition

def article_etag(request, pk):
    return Article.objects.values_list("version", flat=True).get(pk=pk)

def article_mtime(request, pk):
    return Article.objects.values_list("updated_at", flat=True).get(pk=pk)

@condition(etag_func=article_etag, last_modified_func=article_mtime)
def article_detail(request, pk):
    # ye body sirf ek MISS par chalता hai -- agar client ka ETag/date abhi bhi match karता hai, 304
    return render(request, "article.html", {"article": Article.objects.get(pk=pk)})
\`\`\`

\`\`\`
1st request:  GET /articles/7/            -> 200 + ETag: "v12"  + Last-Modified: <date>
2nd request:  GET /articles/7/  If-None-Match: "v12"  -> 304 Not Modified (empty body)
edit ke baad: GET /articles/7/  If-None-Match: "v12"  -> 200 + ETag: "v13"  (full body)
\`\`\`

**\`ConditionalGetMiddleware\` — muft cheap 304s**

\`\`\`python
MIDDLEWARE = [..., "django.middleware.http.ConditionalGetMiddleware", ...]
# agar ek response ke paas pehle se ek ETag/Last-Modified hai aur request ka If-None-Match match karта hai,
# middleware body strip karके 304 lautाता hai -- aapne abhi bhi response compute kiya, par bandwidth bachी.
\`\`\`

**\`Vary\` — "ye response in request headers par nirbhar karता hai"**

\`\`\`python
from django.views.decorators.vary import vary_on_headers, vary_on_cookie

@vary_on_headers("Accept-Encoding", "Accept-Language")
@vary_on_cookie
def page(request): ...
# Vary har cache ko batाता hai kaunसी requests "same" hain
\`\`\`

\`\`\`
in-server cache (lessons 1-3)   response Redis mein store ; aapka server abhi bhi request handle karता hai
HTTP cache (ye lesson)          browser / CDN response reuse karता hai ; aapka server hit hi nahi hoता
conditional request             client ke paas stale copy HAI -> "changed?" -> 304 (bytes) ya 200 (full)
ETag         opaque content id -> If-None-Match -> exact-match revalidation
Last-Modified ek timestamp      -> If-Modified-Since -> "isse newer?" revalidation (1s resolution)
CDN                             Cache-Control + ETag + Vary honour karता hai ; s-maxage ise target karता hai
\`\`\``,

    content: `## Two kinds of caching

Lessons 1-3 are **server-side** caching: the response lives in Redis, and your Django process still receives the request, checks the cache, and returns the stored bytes. **HTTP caching** moves the responsibility outward — to the browser and to any shared cache (CDN, reverse proxy) between the browser and your server. When it works, your server is **never contacted** for a repeat request. That is the biggest possible win, and it costs only response headers.

## \`Cache-Control\`

The response header that tells every downstream cache what it may do:

- **\`max-age=N\`** — a cache may reuse this response for \`N\` seconds without contacting the origin.
- **\`s-maxage=N\`** — same, but only for *shared* caches (a CDN); it overrides \`max-age\` there. Lets you say "browsers keep it 60s, the CDN keeps it 10 minutes".
- **\`public\`** — any cache may store it (needed to let a CDN cache a response that has an \`Authorization\` header or cookies).
- **\`private\`** — only the end user's browser may store it; a shared CDN must not. **Use this for any per-user response** so a CDN cannot serve user A's data to user B.
- **\`no-cache\`** — a cache may store the response but **must revalidate** (send a conditional request) before serving it. Combine with an \`ETag\` so the revalidation is a cheap \`304\`.
- **\`no-store\`** — do not store at all. For truly sensitive responses.
- **\`must-revalidate\`** — once stale, a cache must not serve the stale copy (even if the origin is down).
- **\`stale-while-revalidate=N\`** — serve the stale response for up to \`N\` seconds while fetching a fresh one in the background (great for perceived latency; CDN/browser support varies).

\`@cache_control(**directives)\` sets them; \`@never_cache\` sets \`no-cache, no-store, max-age=0, must-revalidate\` (and \`private\`).

## Conditional requests → \`304 Not Modified\`

When a client already holds a copy (because \`max-age\` allowed it to store one, or \`no-cache\` requires revalidation), it re-requests with a **validator**:

- **\`If-None-Match: "<etag>"\`** — "only send the body if the ETag is different".
- **\`If-Modified-Since: <http-date>\`** — "only send the body if it changed after this date".

The server compares against the current \`ETag\` / \`Last-Modified\`. If they match, it returns **\`304 Not Modified\` with an empty body** — a few dozen bytes instead of the full response. The client reuses its stored copy.

### \`@condition\`

\`\`\`python
from django.views.decorators.http import condition

def latest_etag(request, pk):
    row = Article.objects.filter(pk=pk).values("version").first()
    return f'"{row["version"]}"' if row else None      # any string that changes with the content

def latest_mtime(request, pk):
    row = Article.objects.filter(pk=pk).values("updated_at").first()
    return row["updated_at"] if row else None

@condition(etag_func=latest_etag, last_modified_func=latest_mtime)
def article_detail(request, pk):
    ...
\`\`\`

Django calls your \`etag_func\` / \`last_modified_func\` **before running the view**. If the client's validator matches, Django returns \`304\` and **the view body never runs** — the win is that a cheap \`SELECT version\` replaces the full render + all its queries. On a mismatch, the view runs and Django attaches the fresh \`ETag\`/\`Last-Modified\` to the response.

You can use just one (\`etag_func=\` or \`last_modified_func=\`). ETags are exact (a hash or version); \`Last-Modified\` has 1-second resolution and can be wrong if two edits land in the same second.

### \`ConditionalGetMiddleware\`

If a response *already* carries an \`ETag\` or \`Last-Modified\` (from \`@condition\`, from \`cache_page\`, from a static-file server) and the incoming request's \`If-None-Match\`/\`If-Modified-Since\` matches, this middleware **strips the body and returns \`304\`**. Unlike \`@condition\`, the view has *already run* — you save bandwidth, not computation. It is cheap to enable globally and pairs with \`GZipMiddleware\`.

## CDN / reverse-proxy caching

A CDN (CloudFront, Fastly, Cloudflare) or a reverse proxy (Varnish, nginx) sits in front of your app and caches responses regionally. It obeys the same rules: \`Cache-Control\` (especially \`s-maxage\` and \`public\`/\`private\`), \`ETag\`, \`Vary\`. Configure your responses correctly and:

- static, anonymous pages are served entirely from the edge — your server sees ~0 traffic for them;
- \`Vary: Cookie\` on authenticated pages tells the CDN "do not cache these" (or cache per-cookie, usually undesirable);
- a cache purge / soft-purge on publish keeps content fresh without waiting for TTL.

The rule: **\`private\` (or \`no-store\`) on anything user-specific**, \`public, max-age=…\` (or \`s-maxage\`) on anything shared, and an \`ETag\` on everything so revalidation is a \`304\`.

## \`Vary\`

\`Vary: Accept-Encoding, Cookie\` on a response means "this response depends on the request's \`Accept-Encoding\` and \`Cookie\` headers — cache a separate copy per distinct combination". Every cache (the browser, the CDN, Django's own \`cache_page\`) honours it. \`@vary_on_headers(*names)\` and \`@vary_on_cookie\` add entries. \`GZipMiddleware\` adds \`Accept-Encoding\` automatically. Getting \`Vary\` wrong is how a compressed response gets served to a client that cannot decompress it, or a per-user page gets shared.`,

    contentHi: `## Do tarah ki caching

Lessons 1-3 **server-side** caching hai: response Redis mein rehता hai, aur aapka Django process abhi bhi request receive karता hai, cache check karता hai, aur stored bytes return karता hai. **HTTP caching** zimmedari ko bahar dhakelता hai — browser aur browser aur aapke server ke beech kisi shared cache (CDN, reverse proxy) ko. Jab ye kaam karता hai, aapka server ek repeat request ke liye **kabhi contact nahi hoता**. Ye sabse badा possible win hai, aur ise sirf response headers ki cost hai.

## \`Cache-Control\`

- **\`max-age=N\`** — ek cache is response ko \`N\` seconds ke liye origin se contact kiye bina reuse kar sakta hai.
- **\`s-maxage=N\`** — same, par sirf *shared* caches (ek CDN) ke liye.
- **\`public\`** — koi bhi cache store kar sakta hai.
- **\`private\`** — sirf end user ka browser store kar sakta hai; ek shared CDN nahi. **Kisi bhi per-user response ke liye ise istemal karो.**
- **\`no-cache\`** — ek cache response store kar sakta hai par serve karने se pehle **revalidate KARNA CHAHIYE**.
- **\`no-store\`** — bilkul store mat karो.
- **\`must-revalidate\`** — stale hone par ek cache stale copy serve nahi kar sakta.
- **\`stale-while-revalidate=N\`** — background mein ek fresh fetch karते hue \`N\` seconds ke liye stale serve karो.

\`@cache_control(**directives)\` unhe set karता hai; \`@never_cache\` \`no-cache, no-store, max-age=0, must-revalidate\` set karता hai.

## Conditional requests → \`304 Not Modified\`

Jab ek client ke paas pehle se ek copy hai, ye ek **validator** ke saath re-request karता hai:

- **\`If-None-Match: "<etag>"\`** — "body sirf tab bhejो agar ETag alag hai".
- **\`If-Modified-Since: <http-date>\`** — "body sirf tab bhejो agar ye is date ke baad badla".

Server current \`ETag\` / \`Last-Modified\` ke khilaf compare karता hai. Agar match, ye **\`304 Not Modified\` khali body ke saath** lautाता hai — full response ke bजाy kuch dozen bytes.

### \`@condition\`

Django aapke \`etag_func\` / \`last_modified_func\` ko **view chalने se pehle** call karता hai. Agar client ka validator match karता hai, Django \`304\` lautाता hai aur **view body kabhi nahi chalता** — win ye hai ki ek cheap \`SELECT version\` full render + iski saari queries ko replace karता hai.

ETags exact hain (ek hash ya version); \`Last-Modified\` ki 1-second resolution hai.

### \`ConditionalGetMiddleware\`

Agar ek response ke paas *pehle se* ek \`ETag\` ya \`Last-Modified\` hai aur incoming request ka \`If-None-Match\` match karता hai, ye middleware **body strip karके \`304\` lautाता hai**. \`@condition\` ke vipरीt, view *pehle hi chalा* — aap bandwidth bachाते ho, computation nahi.

## CDN / reverse-proxy caching

Ek CDN ya ek reverse proxy aapke app ke aage baithता hai aur responses regionally cache karता hai. Ye wahi rules maanता hai: \`Cache-Control\` (khaskार \`s-maxage\` aur \`public\`/\`private\`), \`ETag\`, \`Vary\`.

Niyam: **kisi bhi user-specific cheez par \`private\` (ya \`no-store\`)**, kisi bhi shared cheez par \`public, max-age=…\`, aur har cheez par ek \`ETag\`.

## \`Vary\`

Ek response par \`Vary: Accept-Encoding, Cookie\` matlab "ye response request ke \`Accept-Encoding\` aur \`Cookie\` headers par nirbhar karता hai — prati distinct combination ek alag copy cache karो". Har cache ise honour karता hai. \`Vary\` galat karna wo tarika hai jisse ek compressed response ek client ko serve hoता hai jо decompress nahi kar sakta.`,

    examples: [
      {
        title: '@condition: a matching ETag returns 304 and the view body never runs',
        titleHi: '@condition: ek matching ETag 304 lautाता hai aur view body kabhi nahi chalता',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True, MIDDLEWARE=[])
django.setup()

from django.db import models, connection
from django.http import HttpResponse
from django.urls import path
from django.views.decorators.http import condition
from django.test import Client

class Article(models.Model):
    title = models.CharField(max_length=100)
    version = models.IntegerField(default=1)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Article)
a = Article.objects.create(title="Hello", version=1)

VIEW_RUNS = []

def art_etag(request, pk):
    v = Article.objects.filter(pk=pk).values_list("version", flat=True).first()
    return f'"{v}"' if v is not None else None

@condition(etag_func=art_etag)
def article_view(request, pk):
    VIEW_RUNS.append(1)
    art = Article.objects.get(pk=pk)
    return HttpResponse(f"<h1>{art.title}</h1> (rendered)")

urlpatterns = [path("a/<int:pk>/", article_view)]
c = Client()

r1 = c.get("/a/1/")
print("1st GET:", r1.status_code, "| ETag:", r1["ETag"], "| body:", r1.content.decode())

r2 = c.get("/a/1/", HTTP_IF_NONE_MATCH=r1["ETag"])
print("2nd GET (If-None-Match):", r2.status_code, "| body:", repr(r2.content.decode()))

Article.objects.filter(pk=1).update(version=2)          # content changed
r3 = c.get("/a/1/", HTTP_IF_NONE_MATCH=r1["ETag"])
print("after edit (stale ETag):", r3.status_code, "| new ETag:", r3["ETag"])

print("view body ran", len(VIEW_RUNS), "times (not on the 304)")`,
        output: `1st GET: 200 | ETag: "1" | body: <h1>Hello</h1> (rendered)
2nd GET (If-None-Match): 304 | body: ''
after edit (stale ETag): 200 | new ETag: "2"
view body ran 2 times (not on the 304)
`,
        explain: '@condition(etag_func=...) runs the function BEFORE the view. It returns \'"1"\' from a one-column SELECT. On the 2nd request the client sends If-None-Match: "1", it matches, and Django returns 304 with an empty body -- the view function never executes, so its render and every query it would run are skipped entirely. After the version bumps to 2 the client\'s stored "1" no longer matches, so the view runs and the fresh response carries ETag: "2". VIEW_RUNS proves the body ran only twice across three requests. This is the cheapest possible cache: a validator query instead of the whole view.',
        explainHi: '@condition(etag_func=...) function ko view se PEHLE chalata hai. Ye ek one-column SELECT se \'"1"\' lautata hai. 2nd request par client If-None-Match: "1" bhejta hai, ye match karta hai, aur Django ek khali body ke saath 304 lautata hai -- view function kabhi execute nahi hota, toh iska render aur har query poori tarah skip. Version 2 par badalne ke baad client ki stored "1" match nahi karti, toh view chalta hai aur fresh response ETag: "2" le jata hai. VIEW_RUNS sabit karta hai ki body teen requests mein sirf do baar chala.',
      },
      {
        title: 'Cache-Control: public/max-age vs private vs never_cache',
        titleHi: 'Cache-Control: public/max-age vs private vs never_cache',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], USE_TZ=True, MIDDLEWARE=[])
django.setup()

from django.http import JsonResponse
from django.urls import path
from django.views.decorators.cache import cache_control, never_cache
from django.test import Client

@cache_control(max_age=3600, public=True)
def press(request):
    return JsonResponse({"headline": "..."})

@cache_control(max_age=60, private=True)
def my_feed(request):
    return JsonResponse({"items": []})

@cache_control(no_cache=True)
def price(request):
    return JsonResponse({"usd": 42})

@never_cache
def account(request):
    return JsonResponse({"balance": 100})

urlpatterns = [path("press/", press), path("feed/", my_feed),
               path("price/", price), path("account/", account)]
c = Client()

for name, url in [("press (public 1h)", "/press/"), ("feed (private 60s)", "/feed/"),
                  ("price (no-cache)", "/price/"), ("account (never_cache)", "/account/")]:
    print(f"{name:26}: {c.get(url)['Cache-Control']}")`,
        output: `press (public 1h)         : max-age=3600, public
feed (private 60s)        : max-age=60, private
price (no-cache)          : no-cache
account (never_cache)     : max-age=0, no-cache, no-store, must-revalidate, private
`,
        explain: "@cache_control writes the directives verbatim: press_release is public, max-age=3600 so any cache including a CDN may reuse it for an hour; my_feed is private, max-age=60 so only the end user's browser caches it (a shared CDN must not) -- the right choice for anything per-user. no_cache=True means a cache may store the response but must revalidate before every reuse. @never_cache is the shorthand for the strictest set -- no-cache, no-store, must-revalidate, private, max-age=0 -- put it on account, checkout, and anything sensitive so nothing anywhere holds a copy.",
        explainHi: '@cache_control directives ko verbatim likhta hai: press_release public, max-age=3600 hai toh CDN sahit koi bhi cache ise ek ghante reuse kar sakta hai; my_feed private, max-age=60 hai toh sirf end user ka browser ise cache karta hai -- kisi bhi per-user cheez ke liye sahi chunav. no_cache=True matlab ek cache response store kar sakta hai par har reuse se pehle revalidate karna chahiye. @never_cache sabse strict set ke liye shorthand hai -- ise account, checkout par daalo.',
      },
      {
        title: 'ConditionalGetMiddleware: strips the body to 304 when the client is up to date',
        titleHi: 'ConditionalGetMiddleware: client up to date hone par body ko 304 mein strip karта hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], USE_TZ=True,
    MIDDLEWARE=["django.middleware.http.ConditionalGetMiddleware"])
django.setup()

from django.http import HttpResponse
from django.urls import path
from django.test import Client

VIEW_RUNS = []

def feed(request):
    VIEW_RUNS.append(1)
    resp = HttpResponse("<rss>...200 bytes of feed...</rss>")
    resp["ETag"] = '"feed-abc123"'                  # the view itself sets a validator
    return resp

urlpatterns = [path("feed.xml", feed)]
c = Client()

r1 = c.get("/feed.xml")
print("1st:", r1.status_code, "| bytes:", len(r1.content), "| ETag:", r1["ETag"])

r2 = c.get("/feed.xml", HTTP_IF_NONE_MATCH='"feed-abc123"')
print("2nd (matching If-None-Match):", r2.status_code, "| bytes:", len(r2.content))

r3 = c.get("/feed.xml", HTTP_IF_NONE_MATCH='"stale-etag"')
print("3rd (stale If-None-Match):", r3.status_code, "| bytes:", len(r3.content))

# note: the view STILL RAN for the 304 -- ConditionalGetMiddleware only saves bandwidth,
# not computation. Use @condition to skip the view entirely.
print("view ran", len(VIEW_RUNS), "times (including the 304)")`,
        output: `1st: 200 | bytes: 34 | ETag: "feed-abc123"
2nd (matching If-None-Match): 304 | bytes: 0
3rd (stale If-None-Match): 200 | bytes: 34
view ran 3 times (including the 304)
`,
        explain: 'ConditionalGetMiddleware works on a response that already carries an ETag or Last-Modified -- here the view sets ETag: "feed-abc123" itself. When the request\'s If-None-Match matches, the middleware strips the body and returns 304 (bytes: 0). But note VIEW_RUNS: the view ran on all three requests, including the 304 -- the middleware runs AFTER the view, so you save the bandwidth of sending the body but not the cost of building it. That is the key difference from @condition, which runs before the view and skips it. Enable this middleware globally as a cheap bandwidth win; use @condition when the computation itself is expensive.',
        explainHi: 'ConditionalGetMiddleware ek aise response par kaam karta hai jiske paas pehle se ek ETag ya Last-Modified hai -- yahan view khud ETag: "feed-abc123" set karta hai. Jab request ka If-None-Match match karta hai, middleware body strip karke 304 lautata hai (bytes: 0). Par VIEW_RUNS note karo: view teenon requests par chala, 304 sahit -- middleware view ke BAAD chalta hai, toh aap body bhejne ki bandwidth bachate ho par ise banane ki cost nahi. Yahi @condition se mukhya antar hai.',
      },
    ],

    mistakes: [
      {
        wrong: `@cache_control(max_age=300, public=True)
def my_notifications(request):
    return render(request, "notifications.html", {"items": request.user.notifications.all()})
# a CDN caches this and serves user A's notifications to user B for 5 minutes`,
        right: `@cache_control(max_age=30, private=True)      # browser only, never a shared cache
def my_notifications(request):
    ...
# or @never_cache if it must always be live; the key point: NOT "public" on per-user data`,
        why: '`public` tells shared caches (CDNs, reverse proxies) they may store and reuse the response for *any* user. On a response that depends on `request.user`, that means the first user to hit the URL populates the CDN edge, and every subsequent user gets that person\'s data. Per-user responses must be `private` (browser-only) or `no-store`. `public` is only for content that is genuinely identical for everyone.',
        whyHi: '`public` shared caches (CDNs) ko batाता hai ki wo response ko *kisi bhi* user ke liye store aur reuse kar sakte hain. Ek response par jо `request.user` par nirbhar karता hai, iska matlab pehla user jо URL ko hit karता hai CDN edge populate karता hai, aur har agla user us vyakti ka data paता hai. Per-user responses `private` ya `no-store` hone chahिए.',
      },
      {
        wrong: `@condition(last_modified_func=lambda request, pk: Article.objects.get(pk=pk).updated_at)
def article(request, pk): ...
# Article.objects.get() inside the validator: a full row fetch on every request, plus it 500s on a bad pk`,
        right: `def article_mtime(request, pk):
    return (Article.objects.filter(pk=pk)
            .values_list("updated_at", flat=True).first())   # one column, no 404 crash
@condition(last_modified_func=article_mtime)
def article(request, pk): ...`,
        why: 'The whole point of `@condition` is that the validator function is *cheaper than rendering the view*. If it does a full `.get()` (all columns, raises on a missing pk), you have not saved much and you have added a crash path. Fetch only the column you need with `.values_list(..., flat=True).first()` — it returns `None` cleanly for a missing row, which `@condition` handles as "no validator, run the view".',
        whyHi: '`@condition` ka poora point ye hai ki validator function *view render karने se sasta* hai. Agar ye ek full `.get()` karता hai (saare columns, missing pk par raise), aapne zyada nahi bachाya aur ek crash path add kiya. Sirf zaroori column `.values_list(..., flat=True).first()` se fetch karो.',
      },
      {
        wrong: `# GZipMiddleware is enabled but the CDN caches without seeing Vary
response = HttpResponse(big_html)
# no Vary: Accept-Encoding -> the CDN caches the gzipped copy and serves it to a client
# that sent no Accept-Encoding: gzip -> the client gets bytes it cannot decode`,
        right: `# GZipMiddleware adds "Vary: Accept-Encoding" itself -- keep it enabled and don't strip Vary.
# if you set Vary manually, include every header the response content depends on:
from django.utils.cache import patch_vary_headers
patch_vary_headers(response, ["Accept-Encoding", "Accept-Language"])`,
        why: '`Vary` is how a cache knows two requests for the same URL are actually *different* — different `Accept-Encoding` (gzip vs not), `Accept-Language`, `Cookie`. If a response varies on a header but does not say so, a shared cache will serve one variant to a client expecting another: a gzipped body to a client that did not ask for gzip, an English page to a French speaker, user A\'s page to user B. `GZipMiddleware` and `@vary_on_*` set `Vary` correctly; do not overwrite it.',
        whyHi: '`Vary` wo hai jisse ek cache jaanता hai ki ek hi URL ki do requests asal mein *alag* hain — alag `Accept-Encoding`, `Accept-Language`, `Cookie`. Agar ek response ek header par vary karता hai par aisा nahi kehта, ek shared cache ek variant ko ek client ko serve karega jо doosra expect kar raha hai. `GZipMiddleware` aur `@vary_on_*` `Vary` sahi set karते hain.',
      },
    ],

    realWorld: [
      {
        en: '**A CDN in front of everything, with `Cache-Control` driving it** — `public, s-maxage=3600` on marketing/blog/docs, `private, max-age=0` (or `no-store`) on every authenticated route, an `ETag` on API responses. Origin traffic drops by 80-95% for a content site; the app only sees cache misses and writes.',
        hi: '**Sab kuch ke aage ek CDN, `Cache-Control` iske dwara driven** — marketing/blog/docs par `public, s-maxage=3600`, har authenticated route par `private, max-age=0`, API responses par ek `ETag`. Ek content site ke liye origin traffic 80-95% girता hai.',
      },
      {
        en: '**`@condition` on a large read endpoint that clients poll** — a mobile app checks `/api/config/` on every launch; the `etag_func` is a cheap `SELECT config_version`, so an unchanged config is a ~100-byte `304` instead of a multi-KB JSON blob and its assembly queries.',
        hi: '**Ek bade read endpoint par `@condition` jise clients poll karते hain** — ek mobile app har launch par `/api/config/` check karता hai; `etag_func` ek cheap `SELECT config_version` hai, toh ek unchanged config ek ~100-byte `304` hai.',
      },
      {
        en: '**`ConditionalGetMiddleware` + `GZipMiddleware` enabled globally** — cheap wins for any response that already has an ETag (static files, `cache_page` output, `@condition` views). Combined with `SECURE_*` and the cache middleware into the standard project middleware stack.',
        hi: '**`ConditionalGetMiddleware` + `GZipMiddleware` globally enabled** — kisi bhi response ke liye cheap wins jiske paas pehle se ek ETag hai. Standard project middleware stack mein combined.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between server-side caching and HTTP caching, and what does a `304` save?',
        qHi: 'Server-side caching aur HTTP caching mein kya antar hai, aur ek `304` kya bachाता hai?',
        a: 'Server-side caching — the cache framework, cache_page, fragment caching — keeps the response in a store like Redis that your Django process reads. A repeat request still reaches your server, still goes through middleware, still hits the cache lookup, and your process returns the stored bytes; you save the view computation and the database queries but not the request round trip or your server\'s involvement. HTTP caching moves the cache outward, to the browser and to any shared cache — a CDN or reverse proxy — sitting between the browser and your server. You do this purely with response headers: Cache-Control tells those caches how long they may reuse the response and whether a shared cache is allowed to store it at all. When it works, a repeat request is served entirely by the browser or the CDN and your server is never contacted, which is a far bigger win than server-side caching because you save everything, including all your infrastructure. A 304 Not Modified is the middle ground, for when a cache holds a copy but has to check whether it is still current — either because max-age expired or because Cache-Control said no-cache. The client re-requests with a validator: If-None-Match carrying the ETag it has, or If-Modified-Since carrying the date. The server compares against the current ETag or Last-Modified and, if they match, returns a 304 with an empty body — a few dozen bytes of headers instead of the full response. The client then reuses its stored copy. What the 304 saves depends on how you generate it: with the condition decorator, Django checks the validator before running the view, so a 304 skips the entire view body and all its queries; with ConditionalGetMiddleware, the view has already run and you only save the bandwidth of sending the body.',
        aHi: 'Server-side caching response ko Redis jaisे ek store mein rakhता hai jise aapka Django process padhता hai. Ek repeat request abhi bhi aapke server tak pahुँchती hai, abhi bhi middleware se guzarती hai, aur aapka process stored bytes return karता hai; aap view computation aur database queries bachाते ho par request round trip nahi. HTTP caching cache ko bahar dhakelता hai, browser aur browser aur aapke server ke beech kisi shared cache — ek CDN — ko. Aap ye purely response headers se karते ho: Cache-Control un caches ko batाता hai ki wo response ko kितni der reuse kar sakte hain. Jab ye kaam karता hai, ek repeat request poori tarah browser ya CDN dwara serve hoती hai aur aapka server kabhi contact nahi hoता. Ek 304 middle ground hai, jab ek cache ke paas ek copy hai par check karna hoगा ki ye abhi bhi current hai. Client ek validator ke saath re-request karता hai: If-None-Match ETag ke saath. Server compare karता hai aur, agar match, ek khali body ke saath 304 lautाता hai. 304 kya bachाता hai ye ispar nirbhar karता hai ki aap ise kaise generate karते ho: condition decorator ke saath, Django view chalने se pehle validator check karता hai, toh ek 304 poore view body ko skip karता hai.',
      },
      {
        q: 'When would you use `Cache-Control: private` vs `public`, and why does `Vary` matter?',
        qHi: 'Aap `Cache-Control: private` vs `public` kab istemal karोge, aur `Vary` kyun maayne rakhता hai?',
        a: 'public and private control whether shared caches — CDNs, reverse proxies, corporate proxies — are allowed to store a response. public means any cache may store and reuse it for any user; private means only the end user\'s own browser may store it, and a shared cache must not. The rule follows directly from whether the response content depends on who is asking. A marketing page, a published blog post, a public API endpoint that returns the same bytes to everyone: public, with a max-age or s-maxage, so the CDN serves it from the edge and your origin barely sees the traffic. Anything that renders request dot user\'s data — a dashboard, a notifications list, an account page, a personalised feed: private, or for truly sensitive things no-store, because if a CDN caches a per-user response, the first user to hit that URL populates the edge and every subsequent user gets that person\'s data. That is a data-leak, and it is a common one because public feels like the performance-friendly choice. Vary matters because a cache identifies a cached response by the URL, and Vary tells it which request headers also make two requests different. If a response is gzipped only when the client sent Accept-Encoding gzip, the response must carry Vary Accept-Encoding, or a shared cache will hand the gzipped bytes to a client that cannot decode them. If a page differs by language via Accept-Language, or by user via Cookie, those go in Vary too. GZipMiddleware and the vary_on decorators set Vary correctly; the danger is stripping or overwriting it, which makes the cache serve the wrong variant.',
        aHi: 'public aur private control karते hain ki shared caches — CDNs, reverse proxies — ko ek response store karने ki anumati hai ya nahi. public matlab koi bhi cache ise kisi bhi user ke liye store aur reuse kar sakta hai; private matlab sirf end user ka apna browser ise store kar sakta hai. Niyam seedhे isse follow karता hai ki response content is par nirbhar karता hai ya nahi ki kaun pooch raha hai. Ek marketing page, ek published blog post: public, ek max-age ya s-maxage ke saath. Kuch bhi jо request dot user ka data render karता hai — ek dashboard, ek account page: private, ya truly sensitive cheezों ke liye no-store, kyunki agar ek CDN ek per-user response cache karता hai, pehla user jо us URL ko hit karता hai edge populate karता hai aur har agla user us vyakti ka data paता hai. Vary maayne rakhता hai kyunki ek cache ek cached response ko URL se identify karता hai, aur Vary batाता hai ki kaunse request headers bhi do requests ko alag banаते hain.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django, `MIDDLEWARE=[]`. Model `Doc` (`title`, `rev` int). `doc_etag(request, pk)` returns `f\'"{rev}"\'` via `.values_list("rev", flat=True).first()`. `@condition(etag_func=doc_etag)` on `doc_view` which appends to a `VIEW_RUNS` list and returns the title. With `django.test.Client`: `GET /d/1/` -> `200` + `ETag: "1"`; `GET` again with `HTTP_IF_NONE_MATCH=\'"1"\'` -> `304`, empty body; `Doc.objects.filter(pk=1).update(rev=2)` then `GET` with the old ETag -> `200` + `ETag: "2"`. Assert `VIEW_RUNS` ran twice (not on the 304).',
        taskHi: 'Standalone Django, `MIDDLEWARE=[]`. `Doc` (`title`, `rev`) model karो. `doc_etag`, `@condition(etag_func=doc_etag)`. `Client` se: `GET` -> `200` + `ETag`; `If-None-Match` match -> `304`; edit + old ETag -> `200`. `VIEW_RUNS` do baar.',
        hint: '`from django.views.decorators.http import condition`. `c.get("/d/1/", HTTP_IF_NONE_MATCH=\'"1"\')`. The etag func must return `None` for a missing row (use `.first()`), and a *quoted* string for a match.',
        hintHi: '`from django.views.decorators.http import condition`. `c.get("/d/1/", HTTP_IF_NONE_MATCH=\'"1"\')`. etag func missing row ke liye `None` return kare.',
      },
      {
        task: 'Four views with different cache policies, `MIDDLEWARE=[]`: `@cache_control(max_age=3600, public=True)`, `@cache_control(max_age=60, private=True)`, `@cache_control(no_cache=True)`, `@never_cache`. Each returns a small `JsonResponse`. With `Client`, `GET` each and print `response["Cache-Control"]`. Assert the `public` one contains `public` and `max-age=3600`, the `private` one contains `private`, and the `never_cache` one contains `no-store`.',
        taskHi: 'Alag cache policies waale 4 views, `MIDDLEWARE=[]`. Har ek ek chhota `JsonResponse` lautае. `Client` se `GET` karके `response["Cache-Control"]` print karो. Assert karो.',
        hint: '`from django.views.decorators.cache import cache_control, never_cache`. `@cache_control(max_age=3600, public=True)`. Check with `"public" in resp["Cache-Control"]` etc.',
        hintHi: '`from django.views.decorators.cache import cache_control, never_cache`. `"public" in resp["Cache-Control"]`.',
      },
      {
        task: 'Enable `ConditionalGetMiddleware` (only). A `feed` view that appends to `VIEW_RUNS`, returns `HttpResponse("<rss>...</rss>")`, and sets `resp["ETag"] = \'"v1"\'`. With `Client`: `GET /feed/` -> `200`, non-zero body; `GET` with `HTTP_IF_NONE_MATCH=\'"v1"\'` -> `304`, zero-length body; `GET` with `HTTP_IF_NONE_MATCH=\'"old"\'` -> `200`, full body. Assert `VIEW_RUNS` ran on ALL THREE (the middleware strips the body but does not skip the view — contrast with `@condition`).',
        taskHi: 'Sirf `ConditionalGetMiddleware` enable karो. Ek `feed` view jо `VIEW_RUNS` mein append kare, `HttpResponse` lautае, aur `resp["ETag"]` set kare. `Client` se: `GET` -> `200`; `If-None-Match` match -> `304` zero body; stale -> `200`. `VIEW_RUNS` TEENON par (view skip nahi hoता — `@condition` se contrast).',
        hint: '`MIDDLEWARE=["django.middleware.http.ConditionalGetMiddleware"]`. The view sets `resp["ETag"]` itself. The middleware runs *after* the view, so `VIEW_RUNS` grows on the 304 too — the whole point of the exercise.',
        hintHi: '`MIDDLEWARE=["django.middleware.http.ConditionalGetMiddleware"]`. View khud `resp["ETag"]` set karता hai. Middleware view ke *baad* chalता hai.',
      },
    ],

    keyTakeaways: [
      'Server-side cache (lessons 1-3): response in Redis, YOUR server still handles the request. HTTP cache (this lesson): the BROWSER / CDN reuses the response — your server is NOT contacted at all. Biggest possible win; costs only response headers.',
      '`Cache-Control`: `max-age=N` (reuse N s, no ask), `s-maxage=N` (shared caches only), `public` (any cache), `private` (browser only — USE for per-user responses), `no-cache` (store but MUST revalidate), `no-store` (don\'t store), `must-revalidate`, `stale-while-revalidate=N`.',
      '`@cache_control(**directives)` sets them. `@never_cache` = `no-cache, no-store, max-age=0, must-revalidate, private` -> put on account / checkout / anything user-specific + sensitive.',
      '`public` on a `request.user`-dependent response is a DATA LEAK — a CDN serves the first user\'s response to everyone. Per-user = `private` or `no-store`.',
      'Conditional request: client HAS a copy -> re-requests with `If-None-Match: "<etag>"` or `If-Modified-Since: <date>`. Match -> `304 Not Modified`, empty body (dozens of bytes vs the full response).',
      '`@condition(etag_func=, last_modified_func=)`: Django calls the func BEFORE the view; a match returns `304` and THE VIEW NEVER RUNS (a cheap `SELECT version` replaces the full render). The func must be cheap — `.values_list("col", flat=True).first()`, returns `None` for a missing row.',
      '`ConditionalGetMiddleware`: if a response ALREADY has an ETag/Last-Modified and the request matches, it strips the body -> `304`. But the view ALREADY RAN — saves bandwidth, not computation. Cheap to enable globally + `GZipMiddleware`.',
      '`Vary: <headers>` tells every cache which request headers make two same-URL requests DIFFERENT (`Accept-Encoding`, `Accept-Language`, `Cookie`). Wrong `Vary` -> a gzipped body to a client that can\'t decode it, or user A\'s page to user B. `GZipMiddleware` / `@vary_on_*` set it — don\'t strip it.',
    ],
    keyTakeawaysHi: [
      'Server-side cache (lessons 1-3): response Redis mein, AAPKA server abhi bhi request handle karता hai. HTTP cache (ye lesson): BROWSER / CDN response reuse karता hai — aapka server contact hi nahi hoता. Sabse badा win; sirf response headers ki cost.',
      '`Cache-Control`: `max-age=N`, `s-maxage=N` (sirf shared caches), `public` (koi bhi cache), `private` (sirf browser — per-user responses ke liye USE karो), `no-cache` (store par revalidate KARNA CHAHIYE), `no-store`, `must-revalidate`, `stale-while-revalidate=N`.',
      '`@cache_control(**directives)` unhe set karता hai. `@never_cache` = `no-cache, no-store, max-age=0, must-revalidate, private` -> account / checkout par daalो.',
      'Ek `request.user`-dependent response par `public` ek DATA LEAK hai — ek CDN pehle user ka response sabko serve karता hai. Per-user = `private` ya `no-store`.',
      'Conditional request: client ke paas ek copy HAI -> `If-None-Match: "<etag>"` ya `If-Modified-Since: <date>` ke saath re-request. Match -> `304 Not Modified`, khali body.',
      '`@condition(etag_func=, last_modified_func=)`: Django func ko view se PEHLE call karता hai; ek match `304` lautाता hai aur VIEW KABHI NAHI CHALTA. Func sasta hona chahिए — `.values_list("col", flat=True).first()`.',
      '`ConditionalGetMiddleware`: agar ek response ke paas PEHLE SE ek ETag hai aur request match karती hai, ye body strip karता hai -> `304`. Par view PEHLE HI CHALA — bandwidth bachाता hai, computation nahi.',
      '`Vary: <headers>` har cache ko batाता hai kaunse request headers do same-URL requests ko ALAG banаते hain (`Accept-Encoding`, `Accept-Language`, `Cookie`). Galat `Vary` -> ek gzipped body ek client ko jо decode nahi kar sakta. `GZipMiddleware` / `@vary_on_*` ise set karते hain — strip mat karो.',
    ],
  },

  {
    slug: 'dj-db-connections-and-locking',
    title: 'DB Connections, Pooling & Row Locking',
    titleHi: 'DB Connections, Pooling & Row Locking',
    description: 'Every request opens a database connection — unless you keep them alive with `CONN_MAX_AGE`, or put a pooler like pgbouncer in front. And when two requests race to update the same row, `select_for_update` takes a lock so one waits for the other. Both are about the database layer under everything you have built.',
    descriptionHi: 'Har request ek database connection kholती hai — jab tak aap unhe `CONN_MAX_AGE` se alive na rakhो, ya pgbouncer jaisा ek pooler aage na daalо. Aur jab do requests usi row ko update karने ke liye race karती hain, `select_for_update` ek lock leता hai taaki ek doosre ka intezार kare. Dono database layer ke baare mein hain jo aapne banाya hai uske neeche.',
    difficulty: 'HARD',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A workshop with a shared bench of tools and a single sign-out clipboard for the expensive lathe.** Opening a DB connection is walking to the tool crib, showing your badge, and being issued a toolbox — it takes a few seconds every time. `CONN_MAX_AGE` is "keep your toolbox at your station between jobs instead of returning it after every task" — fewer trips to the crib, at the cost of a toolbox sitting idle. A pooler (pgbouncer) is a tool librarian who keeps a rack of pre-issued toolboxes and hands you one instantly, taking it back the moment you set it down — dozens of workers share a handful of toolboxes. But the librarian has rules: with the fast "hand it back per task" mode, you cannot leave a chalk mark on a toolbox for later (a session variable, a prepared statement, an advisory lock) because the next person gets that same box. Row locking is the lathe clipboard: before you re-machine a part you write your name on the line for that part; anyone else who wants the same part sees your name and waits (or, with `skip_locked`, moves on to the next part in the queue). You only need the clipboard when two people might grab the same part at the same time — a balance transfer, decrementing stock, claiming a job from a queue.',
      hi: '**Ek workshop ek shared bench of tools ke saath aur mehenge lathe ke liye ek single sign-out clipboard.** Ek DB connection kholना tool crib tak jाना, apna badge dikhाना, aur ek toolbox issue hona hai — har baar kuch seconds. `CONN_MAX_AGE` "har task ke baad wapas karने ke bजाy jobs ke beech apna toolbox apne station par rakhो" hai — crib ke kam trips, ek idle toolbox ki cost par. Ek pooler (pgbouncer) ek tool librarian hai jо pre-issued toolboxes ka ek rack rakhता hai aur aapको ek instantly deता hai. Par librarian ke rules hain: fast "har task par wapas do" mode ke saath, aap ek toolbox par baad ke liye ek chalk mark nahi chhoड़ sakte (ek session variable, ek prepared statement, ek advisory lock). Row locking lathe clipboard hai: ek part ko re-machine karने se pehle aap us part ki line par apna naam likhते ho; koi aur jо wahi part chahता hai aapka naam dekhता hai aur intezार karता hai (ya, `skip_locked` ke saath, queue mein agle part par jाता hai).',
    },

    simple: `**\`CONN_MAX_AGE\` — persistent connections**

\`\`\`python
# settings.py
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        # ...
        "CONN_MAX_AGE": 60,           # keep a connection open for up to 60s across requests
                                     # 0 (default) = open + close on EVERY request
                                     # None = keep forever (only with a pooler / low worker count)
        "CONN_HEALTH_CHECKS": True,   # ping a reused connection before use (Django 4.1+); avoids
                                     # "server closed the connection" on a stale socket
    }
}
# Django opens a connection per (worker, request), reuses it for CONN_MAX_AGE, then closes it
# at request end if it is older. Total DB connections =~ workers x processes.
\`\`\`

**\`pgbouncer\` — a connection pooler**

\`\`\`
your app (200 workers)  ->  pgbouncer (maintains ~20 real PG connections)  ->  PostgreSQL
\`\`\`

\`\`\`
transaction pooling  (most common)  a PG connection is assigned to a client only FOR ONE TRANSACTION,
                                    then returned. Max reuse. BUT breaks: session-level SET, prepared
                                    statements, advisory locks held across transactions, LISTEN/NOTIFY,
                                    server-side cursors that outlive a transaction.
session pooling                     a connection is held for the whole client session. Safe for
                                    everything, but far less reuse (closer to CONN_MAX_AGE).
# with transaction pooling: set CONN_MAX_AGE = 0 (pgbouncer does the pooling; Django should not),
#   and disable server-side cursors:  DATABASES["default"]["DISABLE_SERVER_SIDE_CURSORS"] = True
\`\`\`

**\`ATOMIC_REQUESTS\` — wrap every request in a transaction**

\`\`\`python
DATABASES["default"]["ATOMIC_REQUESTS"] = True
# every view runs inside transaction.atomic(): a 5xx rolls back all its writes.
# simple + safe, but: a long view holds a transaction (and a connection) the whole time,
# and post-commit work (emails, tasks) must use transaction.on_commit.
# Alternative: ATOMIC_REQUESTS = False + explicit @transaction.atomic on the views that need it.
\`\`\`

**\`select_for_update\` — row locks**

\`\`\`python
from django.db import transaction

def transfer(from_id, to_id, amount):
    with transaction.atomic():                          # REQUIRED -- lock is held until commit
        accounts = (Account.objects
                    .select_for_update()               # SELECT ... FOR UPDATE -> locks the rows
                    .filter(id__in=[from_id, to_id]))
        acc = {a.id: a for a in accounts}
        acc[from_id].balance -= amount
        acc[to_id].balance   += amount
        acc[from_id].save(); acc[to_id].save()
    # a concurrent transfer touching the same accounts BLOCKS at select_for_update until this commits

# variants:
Job.objects.select_for_update(skip_locked=True).filter(status="pending")[:1]   # claim-a-job pattern
Account.objects.select_for_update(nowait=True).get(pk=x)   # raise immediately if locked (don't wait)
Account.objects.select_for_update(of=("self",)).select_related("owner")        # lock only this table
\`\`\`

\`\`\`
CONN_MAX_AGE     0 = connect/disconnect per request ; N = reuse for N s ; None = forever (needs a pooler)
CONN_HEALTH_CHECKS  ping before reuse -- turn on with CONN_MAX_AGE > 0
pgbouncer transaction mode  set CONN_MAX_AGE=0 + DISABLE_SERVER_SIDE_CURSORS ; no session SET / advisory locks
ATOMIC_REQUESTS  every request = one transaction ; on_commit for side effects ; long views hold the txn
select_for_update  MUST be inside transaction.atomic() ; NOT supported on sqlite (silently no-ops)
  skip_locked=True   skip already-locked rows (work queues)   nowait=True   error instead of waiting
profiling:  django-debug-toolbar (dev) ; django-silk / APM (staging+prod) ; assertNumQueries (tests)
\`\`\``,

    simpleHi: `**\`CONN_MAX_AGE\` — persistent connections**

\`\`\`python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "CONN_MAX_AGE": 60,           # ek connection ko requests ke paar 60s tak khula rakhो
                                     # 0 (default) = HAR request par open + close
                                     # None = hamesha rakhो (sirf ek pooler ke saath)
        "CONN_HEALTH_CHECKS": True,   # reused connection ko use se pehle ping karो (Django 4.1+)
    }
}
# Django prati (worker, request) ek connection kholता hai, CONN_MAX_AGE ke liye reuse karता hai,
# phir request end par band karता hai agar ye purana hai.
\`\`\`

**\`pgbouncer\` — ek connection pooler**

\`\`\`
aapka app (200 workers)  ->  pgbouncer (~20 real PG connections)  ->  PostgreSQL
\`\`\`

\`\`\`
transaction pooling  (sabse aam)  ek PG connection ek client ko sirf EK TRANSACTION ke liye assign,
                                  phir wapas. Max reuse. PAR toड़ता hai: session-level SET, prepared
                                  statements, transactions ke paar advisory locks, LISTEN/NOTIFY,
                                  server-side cursors jо ek transaction se aage jeeते hain.
session pooling                   ek connection poore client session ke liye. Sab ke liye safe,
                                  par kaafi kam reuse.
# transaction pooling ke saath: CONN_MAX_AGE = 0 set karो, aur server-side cursors disable karो:
#   DATABASES["default"]["DISABLE_SERVER_SIDE_CURSORS"] = True
\`\`\`

**\`ATOMIC_REQUESTS\` — har request ko ek transaction mein wrap karो**

\`\`\`python
DATABASES["default"]["ATOMIC_REQUESTS"] = True
# har view transaction.atomic() ke andar chalता hai: ek 5xx iski saari writes roll back karता hai.
# saral + safe, par: ek lambा view poore samay ek transaction (aur ek connection) rakhता hai,
# aur post-commit work (emails, tasks) transaction.on_commit istemal karna chahिए.
\`\`\`

**\`select_for_update\` — row locks**

\`\`\`python
from django.db import transaction

def transfer(from_id, to_id, amount):
    with transaction.atomic():                          # ZAROORI -- lock commit tak held
        accounts = (Account.objects
                    .select_for_update()               # SELECT ... FOR UPDATE -> rows lock karта hai
                    .filter(id__in=[from_id, to_id]))
        acc = {a.id: a for a in accounts}
        acc[from_id].balance -= amount
        acc[to_id].balance   += amount
        acc[from_id].save(); acc[to_id].save()
    # usi accounts ko chhoone waala ek concurrent transfer select_for_update par BLOCK hoता hai

# variants:
Job.objects.select_for_update(skip_locked=True).filter(status="pending")[:1]   # claim-a-job pattern
Account.objects.select_for_update(nowait=True).get(pk=x)   # locked ho toh turant raise
\`\`\`

\`\`\`
CONN_MAX_AGE     0 = prati request connect/disconnect ; N = N s reuse ; None = forever (pooler chahिए)
CONN_HEALTH_CHECKS  reuse se pehle ping -- CONN_MAX_AGE > 0 ke saath on karो
pgbouncer transaction mode  CONN_MAX_AGE=0 + DISABLE_SERVER_SIDE_CURSORS set karो ; no session SET
ATOMIC_REQUESTS  har request = ek transaction ; side effects ke liye on_commit ; lambे views txn rakhते hain
select_for_update  transaction.atomic() ke ANDAR HONA CHAHIYE ; sqlite par NAHI (silently no-op)
  skip_locked=True   already-locked rows skip (work queues)   nowait=True   wait ke bजाy error
profiling:  django-debug-toolbar (dev) ; django-silk / APM (prod) ; assertNumQueries (tests)
\`\`\``,

    content: `## Connections cost time

By default (\`CONN_MAX_AGE = 0\`) Django opens a fresh database connection at the start of every request and closes it at the end. For PostgreSQL a connection involves a TCP handshake, TLS, and authentication — a few milliseconds each, which adds up under load and creates a burst of connect/disconnect churn the database has to service.

### \`CONN_MAX_AGE\`

Set it to a number of seconds and Django keeps the connection open **between requests handled by the same worker**, reusing it until it is older than \`CONN_MAX_AGE\`, then closing it at the end of the request. \`None\` means "never close it". This removes the per-request connection overhead.

The catch: **total connections ≈ workers × processes**. With \`gunicorn -w 8\` on 4 machines you can hold 32 idle-but-open connections; PostgreSQL's default \`max_connections\` is 100, and each connection costs ~10 MB of server RAM. \`CONN_MAX_AGE\` without a pooler works for a modest deployment; a large one needs pgbouncer.

Always pair \`CONN_MAX_AGE > 0\` with **\`CONN_HEALTH_CHECKS = True\`** (Django 4.1+): a reused connection may have been closed by the server (idle timeout, a restart, a failover), and without a health check the next query fails with "server closed the connection unexpectedly". The health check is a cheap ping before reuse.

## pgbouncer

A lightweight proxy that maintains a small pool of real PostgreSQL connections and multiplexes many client connections onto them. Your app opens connections to pgbouncer (cheap, local); pgbouncer reuses a handful of PG connections for hundreds of app workers.

### Pooling modes

- **Session pooling** — a real PG connection is assigned to an app connection for its whole life. Safe for everything Django does, but the reuse ratio is low (it behaves like \`CONN_MAX_AGE\` with a shared ceiling).
- **Transaction pooling** — a PG connection is lent to a client **only for the duration of one transaction**, then returned to the pool. This is where the big reuse win is: a connection between transactions serves someone else. **But** anything that relies on connection-level state across transactions breaks:
  - session \`SET\` (\`SET TIME ZONE\`, \`SET statement_timeout\`) — the next transaction is on a different connection;
  - server-side (named) cursors — Django's \`.iterator()\` uses them by default;
  - session-level advisory locks;
  - \`LISTEN\`/\`NOTIFY\`;
  - prepared statements (unless pgbouncer 1.21+ with prepared-statement support).

To run Django behind transaction-pooled pgbouncer: set **\`CONN_MAX_AGE = 0\`** (let pgbouncer pool; Django must not hold a connection), and **\`DISABLE_SERVER_SIDE_CURSORS = True\`** (so \`.iterator()\` uses client-side chunking). Then it just works.

## \`ATOMIC_REQUESTS\`

\`DATABASES["default"]["ATOMIC_REQUESTS"] = True\` wraps **every request** in \`transaction.atomic()\`: if the view returns a 5xx or raises, all its database writes roll back. Simple and safe against half-completed operations.

Trade-offs:

- A slow view holds an open transaction (and, with a pooler, a checked-out connection) for its entire duration — long transactions block \`VACUUM\`, hold locks, and can exhaust the pool.
- **Side effects must move to \`transaction.on_commit\`.** Sending an email or enqueueing a Celery task inside the view means it fires *before* the transaction commits — and if the request then 500s, you have sent an email for an order that was rolled back.

Alternative: \`ATOMIC_REQUESTS = False\` (the default) and put \`@transaction.atomic\` explicitly on the views that perform multi-statement writes. More thought per view, shorter transactions.

## \`select_for_update\` — pessimistic row locking

When two requests read the same row, both modify it in Python, and both save, the second save silently overwrites the first — a lost update. \`select_for_update()\` issues \`SELECT … FOR UPDATE\`, which **locks the selected rows** until the surrounding transaction commits or rolls back. A concurrent transaction that tries to \`select_for_update\` the same rows **blocks** until the first one finishes.

Rules:

- **Must be inside \`transaction.atomic()\`** — a lock without a transaction has no meaning; Django raises \`TransactionManagementError\`.
- **Evaluate the queryset inside the block** — the lock is taken when the SQL runs, which is when you iterate it.
- **Not supported on SQLite** — Django's SQLite backend accepts the call but does not actually lock (SQLite serialises writes anyway). PostgreSQL, MySQL/InnoDB, and Oracle do lock.

Variants:

- **\`select_for_update(nowait=True)\`** — raise \`DatabaseError\` immediately instead of waiting if a row is already locked. For "if I cannot get the lock right now, give up".
- **\`select_for_update(skip_locked=True)\`** — silently omit rows that are locked. The **work-queue pattern**: \`Job.objects.select_for_update(skip_locked=True).filter(status="pending").first()\` lets N workers each claim a different pending job with no contention.
- **\`select_for_update(of=("self",))\`** — with a \`select_related\`, lock only the specified tables instead of every joined table.

Alternative to a pessimistic lock: **optimistic concurrency** — a \`version\` column, \`UPDATE … WHERE id = ? AND version = ?\`, and retry if \`0\` rows matched. Better when conflicts are rare; \`select_for_update\` is better when they are common or the critical section is short.

## Profiling

- **\`django-debug-toolbar\`** (dev only) — a panel showing every query on a page, with timings, duplicates, and the stack that triggered each. The fastest way to find an N+1 or a slow query in development.
- **\`django-silk\`** — records requests and queries in a database for later inspection; usable in staging and (carefully) production.
- **An APM** (Datadog, New Relic, Sentry Performance) — production-grade distributed tracing: p50/p95/p99 per endpoint, slow-query attribution, deployment markers.
- **\`assertNumQueries(n)\`** in tests — locks the query count for a view so a regression (a new N+1) fails CI (Module 3).`,

    contentHi: `## Connections samay lete hain

Default se (\`CONN_MAX_AGE = 0\`) Django har request ki shuruat mein ek fresh database connection kholता hai aur ant mein band karता hai. PostgreSQL ke liye ek connection mein ek TCP handshake, TLS, aur authentication shамil hai — har ek kuch milliseconds, jо load ke tahat jamा hoता hai.

### \`CONN_MAX_AGE\`

Ise seconds ki ek sankhya par set karो aur Django connection ko **usi worker dwara handle ki requests ke beech** khula rakhता hai, ise \`CONN_MAX_AGE\` se purana hone tak reuse karता hai. \`None\` matlab "ise kabhi band mat karो".

Catch: **total connections ≈ workers × processes**. \`gunicorn -w 8\` 4 machines par 32 idle-but-open connections rakh sakta hai; PostgreSQL ka default \`max_connections\` 100 hai.

\`CONN_MAX_AGE > 0\` ko hamesha **\`CONN_HEALTH_CHECKS = True\`** (Django 4.1+) ke saath pair karो: ek reused connection server dwara band ki gayi ho sakti hai, aur ek health check ke bina agli query "server closed the connection" se fail hoती hai.

## pgbouncer

Ek lightweight proxy jо real PostgreSQL connections ka ek chhota pool maintain karता hai aur kई client connections ko unpar multiplex karता hai.

### Pooling modes

- **Session pooling** — ek real PG connection ek app connection ko iske poore jeevan ke liye assigned. Sab ke liye safe, par reuse ratio kam.
- **Transaction pooling** — ek PG connection ek client ko **sirf ek transaction ki avधि ke liye** udhार di jाती hai. Bada reuse win. **Par** kuch bhi jо transactions ke paar connection-level state par nirbhar karता hai toड़ता hai: session \`SET\`, server-side cursors (Django ka \`.iterator()\` default se), session-level advisory locks, \`LISTEN\`/\`NOTIFY\`, prepared statements.

Django ko transaction-pooled pgbouncer ke peeche chalाने ke liye: **\`CONN_MAX_AGE = 0\`** set karो aur **\`DISABLE_SERVER_SIDE_CURSORS = True\`**.

## \`ATOMIC_REQUESTS\`

\`DATABASES["default"]["ATOMIC_REQUESTS"] = True\` **har request** ko \`transaction.atomic()\` mein wrap karता hai: agar view ek 5xx lautाता hai ya raise karता hai, iski saari database writes roll back hoती hain.

Trade-offs:
- Ek dheема view apni poori avधi ke liye ek open transaction rakhता hai — lambे transactions \`VACUUM\` block karते hain.
- **Side effects ko \`transaction.on_commit\` par move karna chahिए.** View ke andar ek email bhejना matlab ye transaction commit hone se *pehle* fire hoता hai.

Vikalp: \`ATOMIC_REQUESTS = False\` aur multi-statement writes karने waale views par explicitly \`@transaction.atomic\`.

## \`select_for_update\` — pessimistic row locking

Jab do requests usi row ko padhती hain, dono ise Python mein modify karती hain, aur dono save karती hain, doosra save chupchaap pehle ko overwrite karता hai — ek lost update. \`select_for_update()\` \`SELECT … FOR UPDATE\` issue karता hai, jо **selected rows ko lock karता hai** jab tak surrounding transaction commit ya roll back nahi hoता.

Rules:
- **\`transaction.atomic()\` ke ANDAR hona chahिए** — warna Django \`TransactionManagementError\` raise karता hai.
- **Queryset ko block ke andar evaluate karो.**
- **SQLite par supported nahi** — Django ka SQLite backend call accept karता hai par asal mein lock nahi karता.

Variants:
- **\`select_for_update(nowait=True)\`** — wait karने ke bजाy turant \`DatabaseError\` raise.
- **\`select_for_update(skip_locked=True)\`** — locked rows ko chupchaap chhoड़ो. **Work-queue pattern**: N workers har ek ek alag pending job claim karते hain bina contention ke.
- **\`select_for_update(of=("self",))\`** — sirf specified tables lock karो.

Vikalp: **optimistic concurrency** — ek \`version\` column, \`UPDATE … WHERE id = ? AND version = ?\`, aur retry agar \`0\` rows matched. Conflicts rare hone par behtar.

## Profiling

- **\`django-debug-toolbar\`** (sirf dev) — ek panel jо ek page par har query dikhाता hai.
- **\`django-silk\`** — requests aur queries record karता hai.
- **Ek APM** (Datadog, Sentry Performance) — production-grade tracing.
- **\`assertNumQueries(n)\`** tests mein — ek view ke liye query count lock karता hai (Module 3).`,

    examples: [
      {
        title: 'select_for_update: backend support, the atomic() requirement, the transfer pattern',
        titleHi: 'select_for_update: backend support, atomic() requirement, transfer pattern',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection, transaction
from django.test.utils import CaptureQueriesContext

class Account(models.Model):
    balance = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Account)
a1 = Account.objects.create(balance=1000)
a2 = Account.objects.create(balance=0)

# does THIS backend actually lock? (Postgres/MySQL/Oracle: yes. SQLite: no -- silent no-op)
print("vendor:", connection.vendor)
print("has_select_for_update:", connection.features.has_select_for_update)
print("has_select_for_update_skip_locked:", connection.features.has_select_for_update_skip_locked)

# the queryset is still accepted on every backend -- it just won't emit FOR UPDATE on SQLite
with transaction.atomic():
    with CaptureQueriesContext(connection) as ctx:
        rows = list(Account.objects.select_for_update().filter(id__in=[a1.id, a2.id]))
print("ran the SELECT:", ctx.captured_queries[-1]["sql"].startswith("SELECT"))
print("FOR UPDATE in SQL (Postgres would be True):", "FOR UPDATE" in ctx.captured_queries[-1]["sql"])

# the transfer pattern -- correct on any backend that locks; on SQLite writes are serialised anyway
def transfer(src, dst, amount):
    with transaction.atomic():                       # REQUIRED: the lock is held until commit
        accts = {a.id: a for a in Account.objects.select_for_update().filter(id__in=[src, dst])}
        accts[src].balance -= amount
        accts[dst].balance += amount
        accts[src].save(update_fields=["balance"])
        accts[dst].save(update_fields=["balance"])

transfer(a1.id, a2.id, 250)
print("after transfer:", Account.objects.get(pk=a1.id).balance, Account.objects.get(pk=a2.id).balance)

# nowait / skip_locked are accepted as kwargs (they shape the SQL on a backend that supports them)
qs = Account.objects.select_for_update(skip_locked=True).filter(balance__gt=0)
print("skip_locked queryset builds:", qs.query.select_for_update_skip_locked)`,
        output: `vendor: sqlite
has_select_for_update: False
has_select_for_update_skip_locked: False
ran the SELECT: True
FOR UPDATE in SQL (Postgres would be True): False
after transfer: 750 250
skip_locked queryset builds: True
`,
        explain: 'Whether select_for_update actually takes a database lock depends on the backend: PostgreSQL, MySQL/InnoDB and Oracle do; SQLite does not -- connection.features.has_select_for_update is False, so Django accepts .select_for_update() but emits a plain SELECT with no FOR UPDATE clause and raises no error. On a locking backend, calling it outside transaction.atomic() raises TransactionManagementError, and the SQL carries FOR UPDATE (and SKIP LOCKED / NOWAIT for those kwargs). The transfer pattern -- read both rows under the lock inside atomic(), adjust, save -- is the correct shape everywhere; it just only enforces serialization on a backend that honours the lock.',
        explainHi: 'select_for_update sach mein ek database lock leta hai ya nahi ye backend par nirbhar karta hai: PostgreSQL, MySQL/InnoDB aur Oracle lete hain; SQLite nahi -- connection.features.has_select_for_update False hai, toh Django .select_for_update() accept karta hai par bina FOR UPDATE clause ke ek plain SELECT emit karta hai aur koi error nahi. Ek locking backend par, ise transaction.atomic() ke bahar call karna TransactionManagementError raise karta hai, aur SQL FOR UPDATE le jata hai. transfer pattern har jagah sahi shape hai; ye sirf ek honouring backend par serialization enforce karta hai.',
      },
      {
        title: 'The lost update select_for_update prevents (simulated with two "transactions")',
        titleHi: 'Lost update jise select_for_update rokта hai (do "transactions" se simulate)',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import F

class Counter(models.Model):
    value = models.IntegerField(default=0)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Counter)
Counter.objects.create(value=0)

# --- BAD: read-modify-write in Python (the lost update) ---
def bad_increment():
    c = Counter.objects.get(pk=1)      # both readers see the same value
    c.value = c.value + 1              # ...compute the same +1...
    c.save(update_fields=["value"])    # ...and the second save clobbers the first

Counter.objects.filter(pk=1).update(value=0)
# simulate two interleaved requests that both read 0:
c_a = Counter.objects.get(pk=1)
c_b = Counter.objects.get(pk=1)
c_a.value += 1; c_a.save(update_fields=["value"])
c_b.value += 1; c_b.save(update_fields=["value"])          # overwrites: expected 2, got 1
print("two interleaved read-modify-write:", Counter.objects.get(pk=1).value, "(expected 2 -- LOST UPDATE)")

# --- GOOD 1: F() expression -> the DB does the arithmetic atomically ---
Counter.objects.filter(pk=1).update(value=0)
Counter.objects.filter(pk=1).update(value=F("value") + 1)
Counter.objects.filter(pk=1).update(value=F("value") + 1)
print("two F() updates:", Counter.objects.get(pk=1).value, "(correct -- no read-modify-write)")

# --- GOOD 2: select_for_update serialises the critical section ---
from django.db import transaction
Counter.objects.filter(pk=1).update(value=0)
def safe_increment():
    with transaction.atomic():
        c = Counter.objects.select_for_update().get(pk=1)   # concurrent callers block here
        c.value += 1
        c.save(update_fields=["value"])
safe_increment(); safe_increment()
print("two locked increments:", Counter.objects.get(pk=1).value, "(correct -- lock held to commit)")`,
        output: `two interleaved read-modify-write: 1 (expected 2 -- LOST UPDATE)
two F() updates: 2 (correct -- no read-modify-write)
two locked increments: 2 (correct -- lock held to commit)
`,
        explain: "The lost update: two objects read value 0 into Python, both compute 0 + 1, both save 1 -- the second write silently overwrites the first and the counter ends at 1 instead of 2. Fix one: F('value') + 1 compiles to SET value = value + 1, so the database does the arithmetic atomically in one statement with no read-modify-write in Python -- two of them correctly land at 2. Fix two: select_for_update().get() inside transaction.atomic() locks the row so a concurrent caller blocks until the first commits; the second reader then sees the committed value. Use F for pure arithmetic; use select_for_update when there is decision logic between the read and the write.",
        explainHi: "Lost update: do objects value 0 ko Python mein padhte hain, dono 0 + 1 compute karte hain, dono 1 save karte hain -- doosra write chupchaap pehle ko overwrite karta hai aur counter 2 ke bajaye 1 par khatam hota hai. Fix ek: F('value') + 1 SET value = value + 1 mein compile hota hai, toh database arithmetic atomically karta hai. Fix do: transaction.atomic() ke andar select_for_update().get() row lock karta hai taaki ek concurrent caller pehle ke commit tak block ho. Pure arithmetic ke liye F; read aur write ke beech decision logic ho toh select_for_update.",
      },
      {
        title: 'ATOMIC_REQUESTS: a 5xx rolls back the view\'s writes; on_commit for side effects',
        titleHi: 'ATOMIC_REQUESTS: ek 5xx view ki writes roll back karता hai; side effects ke liye on_commit',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=False, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:",
                           "ATOMIC_REQUESTS": True}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True, MIDDLEWARE=[])
django.setup()

from django.db import models, connection, transaction
from django.http import JsonResponse
from django.urls import path
from django.test import Client

class Order(models.Model):
    total = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Order)

EMAILS = []

def create_order(request):
    Order.objects.create(total=100)
    transaction.on_commit(lambda: EMAILS.append("order-confirmation"))  # fires only if the txn commits
    if request.GET.get("boom"):
        raise RuntimeError("payment gateway exploded")                  # -> 500 -> rollback
    return JsonResponse({"created": True})

urlpatterns = [path("order/", create_order)]
c = Client(raise_request_exception=False)

r_ok = c.get("/order/")
print("happy path:", r_ok.status_code, "| orders:", Order.objects.count(), "| emails:", EMAILS)

r_boom = c.get("/order/?boom=1")
print("500 path:  ", r_boom.status_code, "| orders:", Order.objects.count(),
      "(the failed order was rolled back)", "| emails:", EMAILS, "(no email for the rolled-back order)")`,
        output: `happy path: 200 | orders: 1 | emails: ['order-confirmation']
500 path:   500 | orders: 1 (the failed order was rolled back) | emails: ['order-confirmation'] (no email for the rolled-back order)
`,
        explain: 'ATOMIC_REQUESTS=True wraps the whole view in transaction.atomic(). The happy path returns 200, the transaction commits, and the on_commit callback fires -- one order, one email. The ?boom=1 path raises after Order.objects.create(...), so the transaction rolls back: the order count stays at 1 (the second create is gone) and the on_commit email for that request never fires, because on_commit callbacks only run after a successful commit. That is exactly why side effects -- emails, webhooks, Celery tasks -- must go through transaction.on_commit under ATOMIC_REQUESTS: anything you call inline would fire before the commit and leak on a rollback.',
        explainHi: 'ATOMIC_REQUESTS=True poore view ko transaction.atomic() mein wrap karta hai. Happy path 200 lautata hai, transaction commit hota hai, aur on_commit callback fire hota hai -- ek order, ek email. ?boom=1 path Order.objects.create(...) ke baad raise karta hai, toh transaction roll back hota hai: order count 1 par rehta hai aur us request ka on_commit email kabhi fire nahi hota, kyunki on_commit callbacks sirf ek safal commit ke baad chalte hain. Isiliye side effects ko ATOMIC_REQUESTS ke tahat transaction.on_commit se guzarna chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `# behind pgbouncer in transaction pooling mode
DATABASES = {"default": {
    "ENGINE": "django.db.backends.postgresql",
    "CONN_MAX_AGE": 600,           # Django tries to hold a connection...
    # ...and .iterator() will use a server-side cursor
}}
# random "cursor does not exist" errors, and session settings that vanish between queries`,
        right: `DATABASES = {"default": {
    "ENGINE": "django.db.backends.postgresql",
    "CONN_MAX_AGE": 0,            # let pgbouncer do the pooling; Django must not hold a connection
    "DISABLE_SERVER_SIDE_CURSORS": True,   # .iterator() uses client-side chunking instead
}}`,
        why: 'Transaction-pooling pgbouncer returns the real PG connection to the pool after every transaction, so nothing connection-scoped survives between transactions: a server-side cursor opened in one transaction is gone in the next (`cursor "..." does not exist`), and a `SET` does not persist. Django must be configured to not assume connection continuity: `CONN_MAX_AGE = 0` (pgbouncer pools, not Django) and `DISABLE_SERVER_SIDE_CURSORS = True` (so `.iterator()` fetches in client-side batches).',
        whyHi: 'Transaction-pooling pgbouncer har transaction ke baad real PG connection ko pool mein wapas karता hai, toh transactions ke beech kuch bhi connection-scoped nahi bachता: ek transaction mein khula ek server-side cursor agle mein gायab hai, aur ek `SET` persist nahi karता. Django ko configure karna chahिए ki wo connection continuity assume na kare: `CONN_MAX_AGE = 0` aur `DISABLE_SERVER_SIDE_CURSORS = True`.',
      },
      {
        wrong: `def claim_and_process():
    job = Job.objects.filter(status="pending").first()   # no lock
    job.status = "processing"; job.save()
    process(job)
# two workers both read the same "pending" job -> both process it`,
        right: `def claim_and_process():
    with transaction.atomic():
        job = (Job.objects
               .select_for_update(skip_locked=True)
               .filter(status="pending")
               .first())
        if job is None:
            return
        job.status = "processing"; job.save(update_fields=["status"])
    process(job)                    # do the slow work OUTSIDE the lock`,
        why: 'Reading a "pending" row without a lock and then updating it is a race: between the read and the write, another worker reads the same row. `select_for_update(skip_locked=True)` inside a transaction locks the row so no other worker sees it as claimable, and `skip_locked` means workers do not queue up behind each other — each grabs a different job. Flip the status inside the (short) transaction, then release the lock and do the actual processing outside it, so you are not holding a row lock for the duration of the work.',
        whyHi: 'Bina lock ke ek "pending" row padhna aur phir ise update karna ek race hai: read aur write ke beech, ek doosra worker usi row ko padhता hai. `select_for_update(skip_locked=True)` ek transaction ke andar row lock karता hai taaki koi doosra worker ise claimable na dekhe. Status ko (chhote) transaction ke andar flip karो, phir lock release karके actual processing bahar karो.',
      },
      {
        wrong: `# ATOMIC_REQUESTS = True
def checkout(request):
    order = Order.objects.create(...)
    send_confirmation_email(order)          # fires NOW, inside the transaction
    charge_card(order)                      # if THIS raises, the order rolls back...
    return JsonResponse({"ok": True})       # ...but the email already went out`,
        right: `def checkout(request):
    order = Order.objects.create(...)
    charge_card(order)                      # do the fallible work first
    transaction.on_commit(lambda: send_confirmation_email(order))
    return JsonResponse({"ok": True})       # email fires only after a successful commit`,
        why: 'With `ATOMIC_REQUESTS`, the whole view is one transaction that commits when the view returns 2xx and rolls back on an exception. Any side effect that leaves the database — an email, a webhook, a Celery task, a payment capture — that you trigger *inside* the view happens before the commit. If the request then fails, the DB rows vanish but the side effect already happened: an email for a non-existent order, a task processing a row that was rolled back. Wrap every external side effect in `transaction.on_commit(callable)` so it runs only after the transaction durably commits.',
        whyHi: '`ATOMIC_REQUESTS` ke saath, poora view ek transaction hai jо view ke 2xx lautाne par commit hoता hai aur ek exception par roll back. Koi bhi side effect jо database chhoड़ता hai — ek email, ek webhook, ek Celery task — jise aap view ke *andar* trigger karते ho commit se pehle hoता hai. Agar request phir fail hoती hai, DB rows gायab ho jाती hain par side effect pehle hi hua. Har external side effect ko `transaction.on_commit(callable)` mein wrap karो.',
      },
    ],

    realWorld: [
      {
        en: '**`CONN_MAX_AGE = 60` + `CONN_HEALTH_CHECKS = True` for a mid-size deployment, or `CONN_MAX_AGE = 0` + pgbouncer (transaction pooling) + `DISABLE_SERVER_SIDE_CURSORS` for a large one** — the choice is driven by `workers × replicas` vs the database\'s `max_connections`.',
        hi: '**Ek mid-size deployment ke liye `CONN_MAX_AGE = 60` + `CONN_HEALTH_CHECKS = True`, ya ek bade ke liye `CONN_MAX_AGE = 0` + pgbouncer + `DISABLE_SERVER_SIDE_CURSORS`** — chunaव `workers × replicas` vs database ke `max_connections` se driven hai.',
      },
      {
        en: '**`select_for_update(skip_locked=True)` as a lightweight job queue** before reaching for Celery — a `Task` table, N workers each doing `select_for_update(skip_locked=True).filter(status="queued").first()` in a loop, processing outside the lock. Good enough for modest throughput without a broker.',
        hi: '**Celery ke liye pahुँchने se pehle ek lightweight job queue ke roop mein `select_for_update(skip_locked=True)`** — ek `Task` table, N workers har ek ek loop mein `select_for_update(skip_locked=True).filter(status="queued").first()` karते hue.',
      },
      {
        en: '**`ATOMIC_REQUESTS = True` as the project default + a strict "no side effects without `on_commit`" review rule** — every email, webhook, cache write, and Celery `.delay()` goes through `transaction.on_commit`, so a rolled-back request never leaks an effect.',
        hi: '**Project default ke roop mein `ATOMIC_REQUESTS = True` + ek strict "`on_commit` ke bina koi side effects nahi" review rule** — har email, webhook, cache write, aur Celery `.delay()` `transaction.on_commit` se guzarта hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does `CONN_MAX_AGE` do, and how does running behind a transaction-pooling pgbouncer change your Django settings?',
        qHi: '`CONN_MAX_AGE` kya karता hai, aur ek transaction-pooling pgbouncer ke peeche chalna aapki Django settings kaise badalता hai?',
        a: 'By default Django opens a database connection at the start of each request and closes it at the end, so every request pays the cost of a TCP handshake, TLS, and authentication. CONN_MAX_AGE set to a number of seconds tells Django to keep the connection open between requests handled by the same worker process, reusing it until it is older than that value and then closing it. None means keep it forever. This removes the per-request connection overhead, but the number of persistent connections is roughly workers times processes times replicas, and each PostgreSQL connection costs memory and counts against max_connections, so a large deployment can exhaust the database just with idle-but-open connections. You should also enable CONN_HEALTH_CHECKS, which pings a reused connection before using it, because the server may have closed it during the idle period and otherwise the next query fails. A pooler like pgbouncer solves the connection-count problem: it maintains a small pool of real PostgreSQL connections and multiplexes many app connections onto them. In transaction pooling mode — the mode with the biggest reuse win — a real connection is lent to a client only for the duration of one transaction and then returned to the pool, so between transactions someone else uses it. That means nothing connection-scoped survives across transactions: server-side cursors, session-level SET statements, session advisory locks, LISTEN and NOTIFY, and un-prepared prepared statements all break. To run Django safely behind it you set CONN_MAX_AGE to zero, because pgbouncer is doing the pooling and Django must not try to hold a connection, and you set DISABLE_SERVER_SIDE_CURSORS to True so that QuerySet.iterator uses client-side chunked fetching instead of a named cursor that would not survive the transaction boundary.',
        aHi: 'Default se Django har request ki shuruat mein ek database connection kholता hai aur ant mein band karता hai, toh har request ek TCP handshake, TLS, aur authentication ki cost deती hai. CONN_MAX_AGE seconds ki ek sankhya par set Django ko batाता hai ki connection ko usi worker process dwara handle ki requests ke beech khula rakhे. None matlab hamesha rakhо. Ye per-request connection overhead hataता hai, par persistent connections ki sankhya lगbhag workers guna processes guna replicas hai, aur har PostgreSQL connection memory cost karता hai. Aapको CONN_HEALTH_CHECKS bhi enable karna chahिए. pgbouncer jaisा ek pooler connection-count problem solve karता hai. transaction pooling mode mein ek real connection ek client ko sirf ek transaction ki avधि ke liye udhार di jाती hai. Iska matlab transactions ke paar kuch bhi connection-scoped nahi bachता: server-side cursors, session-level SET, session advisory locks, LISTEN aur NOTIFY sab toड़ते hain. Ise surakshit chalाने ke liye aap CONN_MAX_AGE ko zero set karो aur DISABLE_SERVER_SIDE_CURSORS ko True.',
      },
      {
        q: 'Explain the lost-update problem and the two ways Django lets you avoid it.',
        qHi: 'Lost-update problem samjhाओ aur do tarike jо Django aapको ise avoid karने deता hai.',
        a: 'A lost update happens when two requests both read the same row, both modify it in application code, and both write it back. The classic case is incrementing a counter: request A reads value 10, request B reads value 10, A computes 11 and saves, B computes 11 and saves — the final value is 11 when it should be 12, and A\'s increment is silently gone. It is a race between the read and the write. Django gives you two defences. The first is F expressions, which push the arithmetic into the database: instead of reading the value into Python, you write update value equals F of value plus one, which compiles to SQL that says set value equals value plus one, and the database applies that atomically as a single statement. Two concurrent F updates both land, giving 12. This is the right tool when the update is a simple arithmetic or relative change and you do not need to see the intermediate value. The second is select_for_update, which is pessimistic row locking. You wrap the read and write in transaction.atomic and call select_for_update on the queryset, which issues SELECT FOR UPDATE and locks the selected rows until the transaction commits. A concurrent transaction that tries to select_for_update the same rows blocks until the first one finishes, so the critical section is serialised — the second reader sees the value the first one committed. This is the right tool when the logic between read and write is more than arithmetic — a balance transfer that checks sufficient funds, claiming a job from a queue, any read-decide-write sequence. It must be inside a transaction, and it is not supported on SQLite. There is also a third option outside Django\'s direct helpers: optimistic concurrency with a version column and a conditional update that retries on a zero-row match, which is better when conflicts are rare and you want to avoid holding locks.',
        aHi: 'Ek lost update tab hoता hai jab do requests dono usi row ko padhती hain, dono ise application code mein modify karती hain, aur dono ise wapas likhती hain. Classic case ek counter increment karna hai: request A value 10 padhता hai, request B value 10 padhता hai, A 11 compute karके save karता hai, B 11 compute karके save karता hai — final value 11 hai jab 12 honi chahिए thi. Ye read aur write ke beech ek race hai. Django do bachaव deता hai. Pehla F expressions hai, jо arithmetic ko database mein dhakelта hai: value ko Python mein padhने ke bजाy, aap update value equals F of value plus one likhते ho, jо SQL mein compile hoता hai jо kehта hai set value equals value plus one, aur database ise atomically ek single statement ke roop mein apply karता hai. Doosra select_for_update hai, jо pessimistic row locking hai. Aap read aur write ko transaction.atomic mein wrap karके queryset par select_for_update call karते ho. Ek concurrent transaction jо usi rows ko select_for_update karने ki koshish karता hai block hoता hai. Ye tab sahi tool hai jab read aur write ke beech logic arithmetic se zyada hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django (SQLite). Model `Account` (`balance` int). (a) Print `connection.vendor`, `connection.features.has_select_for_update`, and `has_select_for_update_skip_locked` — on SQLite all three show it does NOT lock (`False`). (b) Inside `with transaction.atomic():`, run `list(Account.objects.select_for_update().filter(...))` and, via `CaptureQueriesContext`, assert the query ran (`SELECT ...`) but `"FOR UPDATE"` is NOT in the SQL on SQLite (it WOULD be on Postgres). (c) Write `transfer(src, dst, amount)` that wraps the read+write in `transaction.atomic()`, moves the balance, and saves; run it and check the two balances. (d) Show `Account.objects.select_for_update(skip_locked=True).filter(...).query.select_for_update_skip_locked` is `True` (the kwarg is recorded even where the backend ignores it).',
        taskHi: 'Standalone Django (SQLite). `Account` (`balance`) model karो. (a) `connection.vendor` + `features.has_select_for_update` (+skip_locked) print karो — SQLite par teenों `False`. (b) atomic() ke andar `select_for_update().filter(...)` chalाओ; SQL `SELECT` se shuru, par SQLite par `"FOR UPDATE"` NAHI (Postgres par hoता). (c) `transfer(src, dst, amount)` `atomic()` ke saath likhो. (d) `...query.select_for_update_skip_locked` `True`.',
        hint: '`from django.db import connection, transaction`. `from django.test.utils import CaptureQueriesContext`. SQLite\'s `has_select_for_update` is `False`, so Django accepts `.select_for_update()` but emits a plain `SELECT` (no lock, no error) — the lesson\'s locking behaviour only shows on Postgres/MySQL/Oracle.',
        hintHi: '`from django.db import connection, transaction`. SQLite ka `has_select_for_update` `False` hai — Django `.select_for_update()` accept karता hai par plain `SELECT` emit karता hai.',
      },
      {
        task: 'Model `Counter` (`value` int, one row). Demonstrate the lost update and two fixes. (a) `Counter.objects.filter(pk=1).update(value=0)`; read the row into `c_a` and `c_b` separately; `c_a.value += 1; c_a.save()`; `c_b.value += 1; c_b.save()` -> assert the final `value` is `1`, not `2` (lost update). (b) reset, run `.update(value=F("value") + 1)` twice -> assert `value == 2`. (c) reset, write `safe_increment()` that does `select_for_update().get(pk=1)` inside `atomic()`, `+= 1`, save; run twice -> assert `value == 2`.',
        taskHi: '`Counter` (`value`) model karो. Lost update aur do fixes dikhाओ. (a) do alag reads -> final `value` `1` (`2` nahi). (b) `.update(value=F("value") + 1)` do baar -> `2`. (c) `select_for_update` + `atomic()` -> `2`.',
        hint: '`from django.db.models import F`. The lost update: two Python objects read the same value, both compute `+1`, the second `save` overwrites. `F("value") + 1` compiles to `SET value = value + 1` — no read-modify-write in Python.',
        hintHi: '`from django.db.models import F`. Lost update: do Python objects same value padhते hain. `F("value") + 1` -> `SET value = value + 1`.',
      },
      {
        task: 'Set `DATABASES["default"]["ATOMIC_REQUESTS"] = True`, `DEBUG=False`, `MIDDLEWARE=[]`. Model `Order` (`total` int). A `create_order` view that: `Order.objects.create(total=100)`, `transaction.on_commit(lambda: EMAILS.append("confirm"))`, then if `request.GET.get("boom")` `raise RuntimeError(...)`, else return `JsonResponse`. With `Client(raise_request_exception=False)`: `GET /order/` -> `200`, `Order.objects.count() == 1`, `EMAILS == ["confirm"]`; `GET /order/?boom=1` -> `500`, `Order.objects.count()` STILL `1` (the second create rolled back), `EMAILS` still just `["confirm"]` (no email for the rolled-back order).',
        taskHi: '`ATOMIC_REQUESTS = True`, `DEBUG=False`, `MIDDLEWARE=[]`. `Order` (`total`) model karो. `create_order` view: create + `on_commit` + optional `raise`. `Client(raise_request_exception=False)` se: happy -> `200`, 1 order, email; `?boom=1` -> `500`, ABHI BHI 1 order (rolled back), koi naya email nahi.',
        hint: '`from django.db import transaction`. `transaction.on_commit(callable)` only fires if the enclosing transaction commits — a 500 under `ATOMIC_REQUESTS` rolls it back, so the `on_commit` callback for the failed request never runs.',
        hintHi: '`transaction.on_commit(callable)` sirf tab fire hoता hai agar enclosing transaction commit hoता hai. `ATOMIC_REQUESTS` ke tahat ek 500 roll back karता hai.',
      },
    ],

    keyTakeaways: [
      '`CONN_MAX_AGE`: `0` (default) = open+close a DB connection EVERY request (TCP+TLS+auth cost each time); `N` = reuse for N seconds across requests on the same worker; `None` = forever. Persistent connections ≈ `workers × processes × replicas` — can exhaust PG `max_connections`.',
      'Always pair `CONN_MAX_AGE > 0` with `CONN_HEALTH_CHECKS = True` (Django 4.1+) — a reused connection may have been closed server-side; the health check is a cheap ping before reuse.',
      'pgbouncer TRANSACTION pooling = max reuse (a PG conn is lent per-transaction) but BREAKS connection-scoped state: server-side cursors, session `SET`, session advisory locks, `LISTEN/NOTIFY`, prepared statements. Run Django behind it with `CONN_MAX_AGE = 0` + `DISABLE_SERVER_SIDE_CURSORS = True`. SESSION pooling is safe but low reuse.',
      '`ATOMIC_REQUESTS = True` wraps EVERY request in `transaction.atomic()` — a 5xx/exception rolls back all its writes. Trade-off: long views hold a transaction (+ a pooled connection); side effects MUST use `transaction.on_commit` or they fire before the commit (email for a rolled-back order).',
      'Lost update: two requests read a row, both modify in Python, both save -> the 2nd clobbers the 1st. Fix 1: `F("col") + 1` — the DB does the arithmetic atomically (for relative/arithmetic changes). Fix 2: `select_for_update()` — pessimistic row lock (for read-decide-write logic).',
      '`select_for_update()` = `SELECT ... FOR UPDATE`, locks the rows until the transaction commits; a concurrent `select_for_update` on the same rows BLOCKS. MUST be inside `transaction.atomic()` (else `TransactionManagementError`). Evaluate the queryset inside the block. NOT supported on SQLite (accepts the call, doesn\'t lock).',
      'Variants: `nowait=True` (raise immediately if locked), `skip_locked=True` (omit locked rows — the WORK-QUEUE pattern: N workers each claim a different pending job), `of=("self",)` (lock only named tables with a join). Do the slow work OUTSIDE the lock.',
      'Optimistic alternative: a `version` column + `UPDATE ... WHERE id=? AND version=?` + retry on 0 rows — better when conflicts are rare. Profiling: `django-debug-toolbar` (dev), `django-silk`/APM (prod), `assertNumQueries` (tests).',
    ],
    keyTakeawaysHi: [
      '`CONN_MAX_AGE`: `0` (default) = HAR request par ek DB connection open+close; `N` = usi worker par requests ke paar N seconds reuse; `None` = forever. Persistent connections ≈ `workers × processes × replicas`.',
      '`CONN_MAX_AGE > 0` ko hamesha `CONN_HEALTH_CHECKS = True` (Django 4.1+) ke saath pair karो — ek reused connection server-side band ki ja sakti hai.',
      'pgbouncer TRANSACTION pooling = max reuse par connection-scoped state TODTA HAI: server-side cursors, session `SET`, session advisory locks, `LISTEN/NOTIFY`, prepared statements. Django ko `CONN_MAX_AGE = 0` + `DISABLE_SERVER_SIDE_CURSORS = True` ke saath chalाओ. SESSION pooling safe par low reuse.',
      '`ATOMIC_REQUESTS = True` HAR request ko `transaction.atomic()` mein wrap karता hai — ek 5xx saari writes roll back. Trade-off: lambे views ek transaction rakhते hain; side effects `transaction.on_commit` istemal KARNA CHAHIYE.',
      'Lost update: do requests ek row padhते hain, dono Python mein modify, dono save -> doosra pehle ko clobber karता hai. Fix 1: `F("col") + 1` — DB atomically arithmetic karता hai. Fix 2: `select_for_update()` — pessimistic row lock.',
      '`select_for_update()` = `SELECT ... FOR UPDATE`, rows ko transaction commit tak lock karता hai; usi rows par ek concurrent `select_for_update` BLOCK hoता hai. `transaction.atomic()` ke ANDAR HONA CHAHIYE. SQLite par supported nahi.',
      'Variants: `nowait=True` (locked ho toh turant raise), `skip_locked=True` (locked rows chhoड़ो — WORK-QUEUE pattern), `of=("self",)`. Dheема kaam lock ke BAHAR karो.',
      'Optimistic vikalp: ek `version` column + `UPDATE ... WHERE id=? AND version=?` + 0 rows par retry — conflicts rare hone par behtar. Profiling: `django-debug-toolbar` (dev), `django-silk`/APM (prod), `assertNumQueries` (tests).',
    ],
  },

  {
    slug: 'dj-caching-in-drf',
    title: 'Caching in DRF: Response Caching, ETags & Scoped Keys',
    titleHi: 'DRF Mein Caching: Response Caching, ETags & Scoped Keys',
    description: 'A DRF API caches the same three ways as any Django app, with two wrinkles: the natural unit to cache is the *serialized data* (not an HTML response), and the cache key almost always has to be scoped to the authenticated user (or tenant) because `get_queryset` already is. `@cache_page` on a ViewSet mostly does not do what you want.',
    descriptionHi: 'Ek DRF API kisi bhi Django app ki tarah wahi teen tarike cache karता hai, do wrinkles ke saath: cache karने ki natural unit *serialized data* hai (ek HTML response nahi), aur cache key lगbhag hamesha authenticated user (ya tenant) tak scoped honi chahिए kyunki `get_queryset` pehle se hai. Ek ViewSet par `@cache_page` zyादातr wo nahi karता jо aap chahते ho.',
    difficulty: 'HARD',
    duration: 20,
    order: 6,

    analogy: {
      en: '**A kitchen that pre-plates the components, not the whole meal, and labels each container with who ordered it.** For a public restaurant menu everyone gets the same printed card, so you photocopy it (`@cache_page`) — fine. But a DRF API is more like a meal-kit service: the response is *data*, assembled per customer from their own pantry (`get_queryset` scoped to `request.user`). Photocopying the finished plate is wrong — you would hand customer A\'s meal to customer B. What you cache instead is the expensive *prep*: the chopped-and-portioned components (a serialized list, an aggregation), stored in a container labelled with the customer id and a recipe version — `f"orders:{user.id}:v4"`. The next request from that same customer gets the pre-prepped container; a different customer misses and gets their own prepped. And the "has it changed?" phone-ahead still works: the customer keeps the label from last time (an ETag), asks "still v4?", and gets a two-word "yep" instead of the whole kit.',
      hi: '**Ek kitchen jо components pre-plate karता hai, poora meal nahi, aur har container ko is label se karता hai ki kisne order kiya.** Ek public restaurant menu ke liye sabko wahi printed card milता hai, toh aap ise photocopy karते ho (`@cache_page`). Par ek DRF API ek meal-kit service jaisा hai: response *data* hai, prati customer unki apni pantry se assembled (`get_queryset` `request.user` tak scoped). Finished plate ko photocopy karna galat hai — aap customer A ka meal customer B ko dete. Aap iske bजाy expensive *prep* cache karते ho: chopped components (ek serialized list, ek aggregation), ek container mein stored jо customer id aur ek recipe version se labelled hai — `f"orders:{user.id}:v4"`. Aur "kya ye badla?" phone-ahead abhi bhi kaam karता hai: customer pichhli baar ka label rakhता hai (ek ETag), poochता hai "abhi bhi v4?", aur poore kit ke bजाy ek do-shabd "haan" paता hai.',
    },

    simple: `**\`@cache_page\` on DRF: usually not what you want**

\`\`\`python
# @cache_page keys on URL only -> a per-user list endpoint leaks user A's data to user B.
# It also caches error responses and ignores DRF content negotiation edge cases.
# On a ViewSet you would need method_decorator + vary_on_headers("Authorization") -- fragile.
# Prefer the low-level cache, scoped explicitly.
\`\`\`

**Low-level cache, keyed by (resource, version, scope)**

\`\`\`python
from django.core.cache import cache

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user).select_related("customer")

    def list(self, request, *args, **kwargs):
        key = f"orders:list:u{request.user.id}:v{ORDER_CACHE_VERSION}:p{request.query_params.get('page', 1)}"
        data = cache.get(key)
        if data is None:
            data = super().list(request, *args, **kwargs).data     # serialize once
            cache.set(key, data, timeout=120)
        return Response(data)
\`\`\`

**Cache the expensive piece, not the whole view**

\`\`\`python
class DashboardView(APIView):
    def get(self, request):
        # cheap, per-request:
        me = UserSerializer(request.user).data
        # expensive, shared-ish -> cache with a scoped key:
        stats = cache.get_or_set(
            f"dash:stats:org{request.user.org_id}:v3",
            lambda: compute_org_stats(request.user.org_id),
            timeout=300,
        )
        return Response({"me": me, "stats": stats})
\`\`\`

**ETags for an API — conditional GET without a body**

\`\`\`python
from django.utils.decorators import method_decorator
from django.views.decorators.http import condition

def config_etag(request, *a, **kw):
    v = AppConfig.objects.values_list("version", flat=True).first()
    return f'"cfg-{v}"'

class ConfigView(APIView):
    @method_decorator(condition(etag_func=config_etag))
    def get(self, request):
        return Response(build_config())          # skipped entirely on a matching If-None-Match -> 304
\`\`\`

**\`cached_property\` on a serializer / view**

\`\`\`python
class OrderSerializer(serializers.ModelSerializer):
    line_count = serializers.SerializerMethodField()
    def get_line_count(self, obj):
        return obj.line_items.count()            # per object -> N+1 across a list!

# fix in the view, not the serializer:
def get_queryset(self):
    return Order.objects.annotate(_line_count=Count("line_items"))
# then: return obj._line_count  in the method
\`\`\`

\`\`\`
DON'T:  @cache_page on a per-user ViewSet (URL-keyed -> cross-user leak, like Module 7 lesson 2)
DO:     cache.get / get_or_set with a key = f"{resource}:{action}:u{user.id}:v{VERSION}:{page}:{filters}"
DO:     cache the serialized .data (a plain dict/list), not the Response object or the queryset
ETag:   @method_decorator(condition(etag_func=...)) on the get() method -> 304, view body skipped
invalidate: bump VERSION on write ; or delete the specific keys in perform_create/update/destroy
scope:  the cache key must mirror get_queryset's scoping -- user, tenant, role, filters, page
\`\`\``,

    simpleHi: `**DRF par \`@cache_page\`: aksar wo nahi jо aap chahते ho**

\`\`\`python
# @cache_page sirf URL par key karता hai -> ek per-user list endpoint user A ka data user B ko leak karता hai.
# Ye error responses bhi cache karता hai.
# Ek ViewSet par aapको method_decorator + vary_on_headers("Authorization") chahिए -- fragile.
# Low-level cache prefer karो, explicitly scoped.
\`\`\`

**Low-level cache, (resource, version, scope) se keyed**

\`\`\`python
from django.core.cache import cache

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user).select_related("customer")

    def list(self, request, *args, **kwargs):
        key = f"orders:list:u{request.user.id}:v{ORDER_CACHE_VERSION}:p{request.query_params.get('page', 1)}"
        data = cache.get(key)
        if data is None:
            data = super().list(request, *args, **kwargs).data     # ek baar serialize
            cache.set(key, data, timeout=120)
        return Response(data)
\`\`\`

**Expensive tुkda cache karो, poora view nahi**

\`\`\`python
class DashboardView(APIView):
    def get(self, request):
        me = UserSerializer(request.user).data                    # sasta, per-request
        stats = cache.get_or_set(                                 # expensive -> scoped key
            f"dash:stats:org{request.user.org_id}:v3",
            lambda: compute_org_stats(request.user.org_id),
            timeout=300,
        )
        return Response({"me": me, "stats": stats})
\`\`\`

**Ek API ke liye ETags — bina body ke conditional GET**

\`\`\`python
from django.utils.decorators import method_decorator
from django.views.decorators.http import condition

def config_etag(request, *a, **kw):
    v = AppConfig.objects.values_list("version", flat=True).first()
    return f'"cfg-{v}"'

class ConfigView(APIView):
    @method_decorator(condition(etag_func=config_etag))
    def get(self, request):
        return Response(build_config())          # matching If-None-Match par poori tarah skip -> 304
\`\`\`

\`\`\`
NAHI:   ek per-user ViewSet par @cache_page (URL-keyed -> cross-user leak)
KARO:   cache.get / get_or_set ek key = f"{resource}:{action}:u{user.id}:v{VERSION}:{page}:{filters}" ke saath
KARO:   serialized .data cache karो (ek plain dict/list), Response object ya queryset nahi
ETag:   get() method par @method_decorator(condition(etag_func=...)) -> 304, view body skipped
invalidate: write par VERSION bump ; ya perform_create/update/destroy mein specific keys delete
scope:  cache key ko get_queryset ke scoping ko mirror karna chahिए -- user, tenant, role, filters, page
\`\`\``,

    content: `## Why \`@cache_page\` is the wrong reflex for DRF

The Module 7 lesson-2 trap is worse in an API. \`@cache_page\` keys on method + URL + \`Vary\` headers. A DRF list endpoint:

- is almost always **scoped per user** in \`get_queryset\` — but the URL is the same for everyone, so \`@cache_page\` serves the first caller's rows to all callers;
- authenticates via an \`Authorization\` header that is **not in the key** unless you add \`@vary_on_headers("Authorization")\` — and even then you cache a separate copy per token, which changes on every JWT refresh (near-zero hit rate);
- caches **error responses** too (a \`403\`, a \`400\`) for the TTL;
- on a \`ViewSet\` needs \`method_decorator\` gymnastics because \`ViewSet\` actions are not plain view functions.

So on DRF you almost always use the **low-level cache** with a key you build deliberately.

## The scoped-key pattern

The cache key must encode everything that \`get_queryset\` (and the serializer) use to shape the response:

\`\`\`python
def cache_key(request, resource):
    parts = [
        resource,                                   # "orders"
        request.user.id,                            # scope: the user (or org/tenant)
        ORDER_CACHE_VERSION,                        # a constant you bump on schema/logic change
        request.query_params.get("page", "1"),
        request.query_params.get("ordering", ""),
        request.query_params.get("status", ""),    # every filter that changes the result
    ]
    return "orders:" + ":".join(str(p) for p in parts)
\`\`\`

Then override \`list()\` / \`retrieve()\` to check the cache, and on a miss call \`super()\` (which does the query + serialization) and store \`.data\`:

\`\`\`python
def list(self, request, *args, **kwargs):
    key = cache_key(request, "list")
    data = cache.get(key)
    if data is None:
        data = super().list(request, *args, **kwargs).data
        cache.set(key, data, timeout=120)
    return Response(data)
\`\`\`

Cache the **\`.data\`** (a plain \`dict\`/\`list\` of primitives) — not the \`Response\` object (carries renderer state, not cleanly picklable) and not the \`QuerySet\`.

## Cache the expensive piece, not the endpoint

A dashboard endpoint often mixes a cheap per-request bit (\`request.user\` serialized) with an expensive shared-ish bit (an aggregation across the org). Cache only the expensive part, with its own scoped key and TTL:

\`\`\`python
stats = cache.get_or_set(f"dash:stats:org{request.user.org_id}:v3",
                         lambda: compute_org_stats(request.user.org_id), 300)
\`\`\`

This keeps the response fresh where it needs to be and cached where it can be — the same idea as fragment caching in a template (lesson 2), applied to a JSON payload.

## Invalidation in DRF

Two levers, same as lesson 3:

- **Version bump.** \`ORDER_CACHE_VERSION\` in a constant; increment it in a deploy when the serializer shape or query logic changes. Instantly orphans every \`orders:*:v{old}:*\` key.
- **Explicit delete on write.** In \`perform_create\` / \`perform_update\` / \`perform_destroy\` (Module 5), after \`serializer.save()\`, delete the affected keys:

\`\`\`python
def perform_update(self, serializer):
    order = serializer.save()
    transaction.on_commit(lambda: cache.delete_many([
        f"orders:list:u{order.customer_id}:*",     # (Redis: delete_pattern; else track keys)
        f"orders:detail:u{order.customer_id}:{order.id}",
    ]))
\`\`\`

Because \`ModelViewSet\` uses \`.save()\`, the \`post_save\` signal fires too — but bulk actions (a custom \`@action\` doing \`QuerySet.update()\`) do not, so invalidate there explicitly.

## ETags for an API

Conditional GET is a great fit for API responses that clients poll (config, feature flags, a rarely-changing reference list). \`@method_decorator(condition(etag_func=...))\` on the \`get\` method: Django calls \`etag_func\` (a cheap \`SELECT version\`) before the view; a matching \`If-None-Match\` returns \`304\` and **the view — the whole query + serialize — never runs**.

\`\`\`python
class FeatureFlagsView(APIView):
    @method_decorator(condition(etag_func=lambda r, *a, **k:
        f'"ff-{FeatureFlag.objects.values_list(\\'updated_at\\', flat=True).order_by(\\'-updated_at\\').first()}"'))
    def get(self, request):
        return Response(FeatureFlagSerializer(FeatureFlag.objects.all(), many=True).data)
\`\`\`

Libraries: \`drf-extensions\` provides \`@cache_response\` (low-level caching with a configurable key function) and ETag mixins; \`django-rest-framework-condition\` wraps \`condition\` for DRF. For most apps the hand-rolled scoped-key approach plus \`@method_decorator(condition(...))\` is enough.

## \`cached_property\` and the serializer N+1

A \`SerializerMethodField\` that calls \`obj.related.count()\` or \`.filter()\` runs **once per object** — an N+1 across a list (Module 5 lesson 3). \`@cached_property\` on the model does **not** fix this: it memoizes per instance, but you still have N instances each doing one query. The fix is in the **view's \`get_queryset\`**: \`annotate(_count=Count("related"))\` (one aggregate) or \`prefetch_related\`, then have the method read the annotated attribute. \`cached_property\` only helps when the *same object* is asked for the value multiple times within one request (e.g. a serializer and a permission both call \`obj.total\`).`,

    contentHi: `## \`@cache_page\` DRF ke liye galat reflex kyun hai

Module 7 lesson-2 trap ek API mein bदtar hai. \`@cache_page\` method + URL + \`Vary\` headers par key karता hai. Ek DRF list endpoint:

- \`get_queryset\` mein lगbhag hamesha **prati user scoped** hai — par URL sabke liye same hai, toh \`@cache_page\` pehle caller ki rows sab callers ko serve karता hai;
- ek \`Authorization\` header ke zariye authenticate karता hai jо **key mein nahi** jab tak aap \`@vary_on_headers("Authorization")\` add na karो — aur tab bhi aap prati token ek alag copy cache karते ho, jо har JWT refresh par badalता hai;
- **error responses** bhi cache karता hai;
- ek \`ViewSet\` par \`method_decorator\` gymnastics chahिए.

Toh DRF par aap lगbhag hamesha ek deliberately banाya key ke saath **low-level cache** istemal karते ho.

## Scoped-key pattern

Cache key ko sab kuch encode karna chahिए jо \`get_queryset\` (aur serializer) response ko shape karने ke liye istemal karते hain: resource, user id (scope), ek version constant, page, aur har filter jо result badalता hai.

Phir \`list()\` / \`retrieve()\` override karके cache check karो, aur ek miss par \`super()\` call karो (jо query + serialization karता hai) aur \`.data\` store karो.

**\`.data\`** cache karो (primitives ka ek plain \`dict\`/\`list\`) — \`Response\` object nahi (renderer state le jाता hai) aur \`QuerySet\` nahi.

## Expensive tुkda cache karो, endpoint nahi

Ek dashboard endpoint aksar ek cheap per-request bit ko ek expensive shared-ish bit ke saath mix karता hai. Sirf expensive part cache karो, apni scoped key aur TTL ke saath:

\`\`\`python
stats = cache.get_or_set(f"dash:stats:org{request.user.org_id}:v3",
                         lambda: compute_org_stats(request.user.org_id), 300)
\`\`\`

## DRF mein invalidation

Do levers, lesson 3 jaisा:

- **Version bump.** Ek constant mein \`ORDER_CACHE_VERSION\`; serializer shape ya query logic badalने par ek deploy mein increment karो.
- **Write par explicit delete.** \`perform_create\` / \`perform_update\` / \`perform_destroy\` mein, \`serializer.save()\` ke baad, affected keys delete karो.

Kyunki \`ModelViewSet\` \`.save()\` istemal karता hai, \`post_save\` signal bhi fire hoता hai — par bulk actions nahi, toh wahaan explicitly invalidate karो.

## Ek API ke liye ETags

Conditional GET un API responses ke liye achhा fit hai jinhe clients poll karते hain (config, feature flags). \`get\` method par \`@method_decorator(condition(etag_func=...))\`: Django \`etag_func\` (ek cheap \`SELECT version\`) ko view se pehle call karता hai; ek matching \`If-None-Match\` \`304\` lautाता hai aur **view — poora query + serialize — kabhi nahi chalता**.

Libraries: \`drf-extensions\` \`@cache_response\` deता hai; \`django-rest-framework-condition\` \`condition\` ko DRF ke liye wrap karता hai. Zyादातr apps ke liye hand-rolled scoped-key approach kaafi hai.

## \`cached_property\` aur serializer N+1

Ek \`SerializerMethodField\` jо \`obj.related.count()\` call karता hai **prati object ek baar** chalता hai — ek list ke paar ek N+1 (Module 5 lesson 3). Model par \`@cached_property\` ise **fix nahi** karता: ye prati instance memoize karता hai, par aapke paas abhi bhi N instances hain. Fix **view ke \`get_queryset\`** mein hai: \`annotate(_count=Count("related"))\` ya \`prefetch_related\`. \`cached_property\` sirf tab madad karता hai jab *wahi object* ek request ke andar kई baar value ke liye poochा jाता hai.`,

    examples: [
      {
        title: 'Scoped cache key: user A and user B get separate cache entries',
        titleHi: 'Scoped cache key: user A aur user B ko alag cache entries milती hain',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}},
    REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": []})
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.db import models, connection
from django.db.models import Sum
from django.contrib.auth.models import User
from django.core.cache import cache
from django.test.utils import CaptureQueriesContext
from rest_framework import serializers, generics
from rest_framework.response import Response
from rest_framework.routers import SimpleRouter
from rest_framework.test import APIClient

class Order(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Order)
ada = User.objects.create_user("ada"); bo = User.objects.create_user("bo")
Order.objects.bulk_create([Order(customer=ada, total=i) for i in (10, 20, 30)])
Order.objects.bulk_create([Order(customer=bo, total=i) for i in (5, 5)])

ORDER_CACHE_VERSION = 1

class OrderSummaryView(generics.GenericAPIView):
    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)

    def get(self, request):
        key = f"orders:summary:u{request.user.id}:v{ORDER_CACHE_VERSION}"
        data = cache.get(key)
        if data is None:
            data = self.get_queryset().aggregate(total=Sum("total"))
            cache.set(key, data, timeout=120)
        return Response(data)

from django.urls import path
urlpatterns = [path("orders/summary/", OrderSummaryView.as_view())]

c_ada = APIClient(); c_ada.force_authenticate(ada)
c_bo = APIClient(); c_bo.force_authenticate(bo)

with CaptureQueriesContext(connection) as ctx:
    r1 = c_ada.get("/orders/summary/")            # miss -> query
    r2 = c_ada.get("/orders/summary/")            # hit  -> no query
    r3 = c_bo.get("/orders/summary/")             # different user -> different key -> query
print("ada:", r1.json(), "(cached:", r2.json() == r1.json(), ")")
print("bo :", r3.json(), "<- bo's own total, not ada's")
print("DB queries for 3 requests:", len(ctx.captured_queries), "(ada miss, ada hit, bo miss)")`,
        output: `ada: {'total': 60} (cached: True )
bo : {'total': 10} <- bo's own total, not ada's
DB queries for 3 requests: 2 (ada miss, ada hit, bo miss)
`,
        explain: "The cache key is f'orders:summary:u{request.user.id}:v1' -- it embeds the user id, mirroring get_queryset's customer=self.request.user scoping. ada's first GET misses and runs the aggregation; her second GET is a HIT with zero queries; bo's GET builds a DIFFERENT key (different user id), misses, and returns bo's own total of 10 -- never ada's 60. Three requests, two queries. This is the DRF caching pattern: never @cache_page (which keys on URL and would leak ada's data to bo), always a low-level key that includes every scoping dimension get_queryset uses.",
        explainHi: "Cache key f'orders:summary:u{request.user.id}:v1' hai -- ye user id embed karti hai, get_queryset ke customer=self.request.user scoping ko mirror karte hue. ada ka pehla GET miss karta hai aur aggregation chalata hai; uska doosra GET zero queries ke saath ek HIT hai; bo ka GET ek ALAG key banata hai, miss karta hai, aur bo ka apna total 10 lautata hai -- kabhi ada ka 60 nahi. Teen requests, do queries. Ye DRF caching pattern hai: kabhi @cache_page nahi, hamesha ek low-level key jo har scoping dimension shamil karti hai.",
      },
      {
        title: 'Version bump invalidates every user\'s cached list at once',
        titleHi: 'Version bump har user ki cached list ek saath invalidate karта hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}},
    REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": []})
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.db import models, connection
from django.contrib.auth.models import User
from django.core.cache import cache
from rest_framework import serializers, generics
from rest_framework.response import Response
from rest_framework.test import APIClient
from django.urls import path

class Note(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Note)
ada = User.objects.create_user("ada")
Note.objects.create(owner=ada, text="first")

class NoteSer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "text"]

def notes_version():
    return cache.get_or_set("notes:version", 1, None)

class NoteListView(generics.ListAPIView):
    serializer_class = NoteSer
    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user).order_by("id")
    def list(self, request, *a, **kw):
        key = f"notes:list:u{request.user.id}:v{notes_version()}"
        data = cache.get(key)
        status = "HIT"
        if data is None:
            data = super().list(request, *a, **kw).data
            cache.set(key, data, 300)
            status = "MISS"
        return Response({"v": notes_version(), "status": status, "notes": data})

urlpatterns = [path("notes/", NoteListView.as_view())]
c = APIClient(); c.force_authenticate(ada)

print("1:", c.get("/notes/").json())
print("2:", c.get("/notes/").json())

# a bulk operation adds notes WITHOUT firing per-object signals -> bump the version
Note.objects.bulk_create([Note(owner=ada, text="bulk-1"), Note(owner=ada, text="bulk-2")])
cache.incr("notes:version")
print("--- bulk insert + version bump ---")
print("3:", c.get("/notes/").json(), "<- MISS under v2, now shows the bulk notes")`,
        output: `1: {'v': 1, 'status': 'MISS', 'notes': [{'id': 1, 'text': 'first'}]}
2: {'v': 1, 'status': 'HIT', 'notes': [{'id': 1, 'text': 'first'}]}
--- bulk insert + version bump ---
3: {'v': 2, 'status': 'MISS', 'notes': [{'id': 1, 'text': 'first'}, {'id': 2, 'text': 'bulk-1'}, {'id': 3, 'text': 'bulk-2'}]} <- MISS under v2, now shows the bulk notes
`,
        explain: "Every list key carries a version read from the cache: f'notes:list:u{user.id}:v{notes_version()}'. Requests 1 and 2 are MISS then HIT under v1. Then bulk_create adds two notes -- and bulk_create does NOT fire post_save, so a signal-based invalidation would silently miss it and the endpoint would keep serving the stale one-note list. cache.incr('notes:version') sidesteps that: it re-keys every notes:list:* entry for every user at once, so request 3 constructs a v2 key, misses, and returns the full three-note list. Version bumping is the invalidation strategy for writes that bypass signals or touch an unknown set of keys.",
        explainHi: "Har list key cache se padhi gayi ek version le jati hai: f'notes:list:u{user.id}:v{notes_version()}'. Requests 1 aur 2 v1 ke tahat MISS phir HIT hain. Phir bulk_create do notes add karta hai -- aur bulk_create post_save FIRE NAHI karta, toh ek signal-based invalidation ise chupchaap miss kar deti aur endpoint stale one-note list serve karta rehta. cache.incr('notes:version') ise sidestep karta hai: ye har user ke liye har notes:list:* entry ko ek saath re-key karta hai, toh request 3 ek v2 key banati hai, miss karti hai, aur poori teen-note list lautati hai.",
      },
      {
        title: 'ETag on an APIView: a matching If-None-Match returns 304, view skipped',
        titleHi: 'Ek APIView par ETag: ek matching If-None-Match 304 lautाता hai, view skip',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth",
                    "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True, MIDDLEWARE=[],
    REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": []})
django.setup()

from django.db import models, connection
from django.urls import path
from django.utils.decorators import method_decorator
from django.views.decorators.http import condition
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.test import APIClient

class AppConfig(models.Model):
    key = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    version = models.IntegerField(default=1)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(AppConfig)
AppConfig.objects.create(key="theme", value="dark", version=1)

BUILDS = []

def config_etag(request, *args, **kwargs):
    v = AppConfig.objects.order_by("-version").values_list("version", flat=True).first()
    return f'"cfg-{v}"'

class ConfigView(APIView):
    @method_decorator(condition(etag_func=config_etag))
    def get(self, request):
        BUILDS.append(1)
        rows = {c.key: c.value for c in AppConfig.objects.all()}
        return Response({"config": rows})

urlpatterns = [path("config/", ConfigView.as_view())]
c = APIClient()

r1 = c.get("/config/")
print("1st:", r1.status_code, "| ETag:", r1["ETag"], "| body:", r1.json())

r2 = c.get("/config/", HTTP_IF_NONE_MATCH=r1["ETag"])
print("2nd (If-None-Match):", r2.status_code, "| body:", r2.content.decode() or "(empty)")

AppConfig.objects.filter(key="theme").update(value="light", version=2)
r3 = c.get("/config/", HTTP_IF_NONE_MATCH=r1["ETag"])
print("after change:", r3.status_code, "| ETag:", r3["ETag"], "| body:", r3.json())

print("view body (query + serialize) ran", len(BUILDS), "times -- NOT on the 304")`,
        output: `1st: 200 | ETag: "cfg-1" | body: {'config': {'theme': 'dark'}}
2nd (If-None-Match): 304 | body: (empty)
after change: 200 | ETag: "cfg-2" | body: {'config': {'theme': 'light'}}
view body (query + serialize) ran 2 times -- NOT on the 304
`,
        explain: '@method_decorator(condition(etag_func=config_etag)) puts an HTTP conditional-GET check in front of an APIView\'s get(). config_etag is a cheap \'SELECT MAX(version)\' returning \'"cfg-1"\'. The 2nd request sends that ETag in If-None-Match, it matches, and DRF returns 304 with an empty body -- get() never runs, so neither the query nor the serialization happens. After the row is updated to version 2 the old ETag no longer matches, get() runs, and the response carries ETag: "cfg-2". BUILDS confirms the body executed twice, not on the 304. This is the ideal pattern for reference endpoints (config, feature flags) that clients poll on every launch.',
        explainHi: '@method_decorator(condition(etag_func=config_etag)) ek APIView ke get() ke aage ek HTTP conditional-GET check daalta hai. config_etag ek sasta \'SELECT MAX(version)\' hai jo \'"cfg-1"\' lautata hai. 2nd request wo ETag If-None-Match mein bhejti hai, ye match karta hai, aur DRF ek khali body ke saath 304 lautata hai -- get() kabhi nahi chalta, toh na query na serialization hota hai. Row ke version 2 par update hone ke baad purana ETag match nahi karta, get() chalta hai, aur response ETag: "cfg-2" le jata hai. BUILDS pushti karta hai ki body do baar chala, 304 par nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)

    @method_decorator(cache_page(60))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
# @cache_page keys on URL only -> the first user's order list is served to every user for 60s`,
        right: `def list(self, request, *args, **kwargs):
    key = f"orders:list:u{request.user.id}:v{ORDER_CACHE_VERSION}:p{request.query_params.get('page', 1)}"
    data = cache.get(key)
    if data is None:
        data = super().list(request, *args, **kwargs).data
        cache.set(key, data, 60)
    return Response(data)`,
        why: '`@cache_page` on a DRF list action keys the cache on method + URL only. Since every authenticated user hits the same `/orders/` URL, the response cached for the first user is returned to all of them — a cross-user data leak, exactly as in Module 7 lesson 2 but harder to spot in an API. Use the low-level cache with a key that includes `request.user.id` (mirroring `get_queryset`\'s scoping) plus a version and the pagination/filter params.',
        whyHi: 'Ek DRF list action par `@cache_page` cache ko sirf method + URL par key karता hai. Kyunki har authenticated user usi `/orders/` URL ko hit karता hai, pehle user ke liye cached response sabko lautाया jाता hai — ek cross-user data leak. Low-level cache istemal karो ek key ke saath jismें `request.user.id` shамil ho.',
      },
      {
        wrong: `def list(self, request, *args, **kwargs):
    key = f"orders:{request.user.id}"
    resp = cache.get(key)
    if resp is None:
        resp = super().list(request, *args, **kwargs)     # a Response object
        cache.set(key, resp, 60)
    return resp
# caching the Response: it carries renderer/accepted-media-type state; on a hit it may
# re-render wrongly, and it is not reliably picklable across DRF versions`,
        right: `def list(self, request, *args, **kwargs):
    key = f"orders:{request.user.id}:v{V}"
    data = cache.get(key)
    if data is None:
        data = super().list(request, *args, **kwargs).data   # the plain dict/list
        cache.set(key, data, 60)
    return Response(data)                                     # a fresh Response each time`,
        why: 'A DRF `Response` is not a plain value — it holds the data plus renderer context (the negotiated media type, the renderer instance, template context). Pickling and un-pickling it, then returning it on a cache hit, can produce a response rendered for the wrong content type or fail outright. Cache `response.data`, which is a plain structure of dicts/lists/primitives, and wrap it in a new `Response(data)` on the way out so content negotiation runs fresh each time.',
        whyHi: 'Ek DRF `Response` ek plain value nahi hai — ye data plus renderer context rakhता hai. Ise pickle karके, phir ek cache hit par return karना ek response produce kar sakta hai jо galat content type ke liye rendered hai. `response.data` cache karो, jо dicts/lists/primitives ka ek plain structure hai, aur ise ek naye `Response(data)` mein wrap karो.',
      },
      {
        wrong: `class OrderSerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()
    def get_item_count(self, obj):
        return obj.items.count()      # one COUNT query per order

class Order(models.Model):
    @cached_property
    def item_count(self):
        return self.items.count()     # "fixed" it with cached_property -- still N queries for a list of N`,
        right: `# fix in the VIEW's get_queryset, not the model or serializer:
class OrderViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Order.objects.annotate(_item_count=Count("items"))
# serializer: return obj._item_count   (one aggregate query for the whole page)`,
        why: '`@cached_property` memoizes per *instance* — but serializing a list of 50 orders creates 50 instances, each computing `items.count()` once. That is still 50 queries; the memoization would only help if the *same* order object were asked for `item_count` twice. The N+1 fix always lives in the view\'s `get_queryset`: `annotate(Count(...))` collapses it to one aggregate, or `prefetch_related` to one extra query. Then the serializer reads the annotated attribute.',
        whyHi: '`@cached_property` prati *instance* memoize karता hai — par 50 orders ki ek list serialize karna 50 instances banаता hai, har ek `items.count()` ek baar compute karता hai. Wo abhi bhi 50 queries hai. N+1 fix hamesha view ke `get_queryset` mein rehता hai: `annotate(Count(...))` ise ek aggregate mein collapse karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A `CachedListMixin` on the base viewset** — overrides `list()`/`retrieve()` to check a scoped key (`f"{basename}:{action}:u{user.id}:v{VERSION}:{query_hash}"`), caches `.data` for a short TTL, and `perform_*` bumps `VERSION` or deletes the exact keys via `on_commit`. Applied to the read-heavy resources only.',
        hi: '**Base viewset par ek `CachedListMixin`** — `list()`/`retrieve()` override karके ek scoped key check karता hai, `.data` ko ek short TTL ke liye cache karता hai, aur `perform_*` `VERSION` bump karता hai. Sirf read-heavy resources par lागू.',
      },
      {
        en: '**ETags on `/api/config/`, `/api/feature-flags/`, `/api/countries/` — the polled reference endpoints** — `etag_func` is a `MAX(updated_at)` or a version integer; the mobile app sends `If-None-Match` on every launch and gets a `304` 99% of the time, saving both bandwidth and the serialize cost.',
        hi: '**`/api/config/`, `/api/feature-flags/` par ETags — polled reference endpoints** — `etag_func` ek `MAX(updated_at)` hai; mobile app har launch par `If-None-Match` bhejता hai aur 99% baar ek `304` paता hai.',
      },
      {
        en: '**A separate cache alias per concern** — `CACHES["default"]` for serialized data (short TTLs, churny), `CACHES["throttle"]` for rate-limit counters (Module 6), `CACHES["sessions"]` for `SESSION_ENGINE`. Different eviction pressure and TTLs, and a `cache.clear()` on one does not nuke the others.',
        hi: '**Prati concern ek alag cache alias** — `CACHES["default"]` serialized data ke liye, `CACHES["throttle"]` rate-limit counters ke liye, `CACHES["sessions"]` `SESSION_ENGINE` ke liye. Ek par `cache.clear()` doosron ko nuke nahi karता.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is `@cache_page` usually wrong on a DRF list endpoint, and what do you do instead?',
        qHi: 'Ek DRF list endpoint par `@cache_page` aksar galat kyun hai, aur aap iske bजाy kya karते ho?',
        a: 'cache_page builds its cache key from the request method, the full URL, and the response Vary headers. A DRF list endpoint has two properties that break this. First, its get_queryset is almost always scoped to the current user or tenant — orders objects filtered to request dot user — so the same URL slash orders returns different data per caller, but cache_page keys only on the URL, so it stores the first caller\'s rows and serves them to everyone for the TTL. That is a cross-user data leak, the same trap as caching a per-user HTML page but easier to miss in an API. Second, the API authenticates via an Authorization header that is not in the key unless you add vary_on_headers Authorization, and even then you get a separate cache entry per token, which for JWT changes on every refresh, so the hit rate is near zero; and it also caches 400 and 403 responses for the TTL. On a ViewSet you additionally have to fight method_decorator because the actions are not plain functions. So instead you use the low-level cache with a key you construct deliberately: resource name, the scope value — user id or org id — a version constant you bump on schema or logic changes, and every query parameter that changes the result, meaning the page number, the ordering, and each filter. You override list or retrieve, check the cache, and on a miss call super, take its dot data, store that, and return a fresh Response wrapping the data. You cache dot data specifically — the plain dict or list — not the Response object, because a Response carries renderer state and does not pickle and re-render cleanly. For invalidation you either bump the version constant on deploy, which orphans every key at that version, or delete the specific keys in perform_create, perform_update, and perform_destroy, wrapped in transaction dot on_commit.',
        aHi: 'cache_page apni cache key request method, full URL, aur response Vary headers se banаता hai. Ek DRF list endpoint ki do properties ise toड़ती hain. Pehli, iska get_queryset lगbhag hamesha current user tak scoped hai, toh wahi URL slash orders prati caller alag data lautाता hai, par cache_page sirf URL par key karता hai, toh ye pehle caller ki rows store karके sabko TTL ke liye serve karता hai. Ye ek cross-user data leak hai. Doosri, API ek Authorization header ke zariye authenticate karता hai jо key mein nahi hai, aur ye 400 aur 403 responses bhi cache karता hai. Toh iske bजाy aap low-level cache istemal karते ho ek deliberately banаyi key ke saath: resource name, scope value, ek version constant, aur har query parameter jо result badalता hai. Aap list ya retrieve override karके cache check karते ho, aur ek miss par super call karके iska dot data lete ho, ise store karके ek fresh Response lautाते ho. Aap dot data specifically cache karते ho, Response object nahi. Invalidation ke liye aap ya version constant bump karते ho ya perform_create/update/destroy mein specific keys delete karते ho.',
      },
      {
        q: 'A `SerializerMethodField` that calls `obj.related.count()` is an N+1. Does `cached_property` fix it? Where is the real fix?',
        qHi: 'Ek `SerializerMethodField` jо `obj.related.count()` call karता hai ek N+1 hai. Kya `cached_property` ise fix karता hai? Asli fix kahaan hai?',
        a: 'No, cached_property does not fix it. A SerializerMethodField method runs once per object being serialized. If it does obj dot related dot count, then serializing a list of fifty objects issues fifty COUNT queries — the classic N plus one. cached_property memoizes the result on the instance, so a second access of the same attribute on the same object is free. But in list serialization there is no second access — each of the fifty objects is a distinct instance, and each computes its count exactly once. So cached_property changes nothing about the query count for a list; it would only help if, within one request, the same object were asked for that value more than once, for example if both the serializer and a permission class called obj dot total. The real fix is always in the view\'s get_queryset. You annotate the count as part of the queryset: Order objects dot annotate with underscore item_count equals Count of items. That produces a single SQL query with a subquery or a grouped join that returns the count alongside each row, so the whole page costs one query instead of one-plus-fifty. The serializer method then just returns obj dot underscore item_count, reading the value the database already computed. For a to-many relationship whose objects you also need to serialize, prefetch_related is the equivalent — one extra query for all the related rows, and the method or nested serializer reads from the prefetched cache. The principle from Module 3 and Module 5 holds: the serializer describes the shape, the view\'s get_queryset is responsible for making that shape cheap to produce.',
        aHi: 'Nahi, cached_property ise fix nahi karता. Ek SerializerMethodField method serialize ho rahe prati object ek baar chalता hai. Agar ye obj dot related dot count karता hai, toh pachas objects ki ek list serialize karna pachas COUNT queries issue karता hai. cached_property result ko instance par memoize karता hai, toh usi object par usi attribute ka doosra access muft hai. Par list serialization mein koi doosra access nahi hai — pachas objects mें se har ek ek distinct instance hai. Toh cached_property ek list ke query count ke baare mein kuch nahi badalता; ye sirf tab madad karता agar, ek request ke andar, usi object se wo value ek se zyada baar poochी jाती. Asli fix hamesha view ke get_queryset mein hai. Aap count ko queryset ke hisse ke roop mein annotate karते ho: Order objects dot annotate with Count of items. Ye ek single SQL query produce karता hai. Serializer method phir bस obj dot underscore item_count return karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone DRF (`LocMemCache`, no auth/perm classes). Model `Order` (`customer` FK User, `total` int). `OrderSummaryView(GenericAPIView)` with `get_queryset` scoped to `customer=self.request.user` and a `get()` that caches `self.get_queryset().aggregate(total=Sum("total"))` under `f"orders:summary:u{request.user.id}:v1"` for 120s. Seed orders for `ada` (10+20+30) and `bo` (5+5). With `force_authenticate`d clients and `CaptureQueriesContext`: `ada` GETs twice, `bo` GETs once -> assert `ada` sees `{"total": 60}`, `bo` sees `{"total": 10}`, and exactly 2 DB queries ran (ada miss, ada hit, bo miss).',
        taskHi: 'Standalone DRF (`LocMemCache`). `Order` (`customer` FK, `total`) model karो. `OrderSummaryView` `get_queryset` scoped + `get()` jо aggregate ko `f"orders:summary:u{request.user.id}:v1"` ke tahat cache kare. `ada`/`bo` orders seed karो. `CaptureQueriesContext` se 2 queries assert karो.',
        hint: '`from django.db.models import Sum`. `c.force_authenticate(user)`. Wrap the 3 requests in one `CaptureQueriesContext(connection)`. The key\'s `u{id}` segment is what keeps ada and bo separate.',
        hintHi: '`from django.db.models import Sum`. `c.force_authenticate(user)`. 3 requests ko ek `CaptureQueriesContext` mein wrap karो.',
      },
      {
        task: 'Version-bump invalidation. Model `Note` (`owner` FK, `text`). `notes_version()` = `cache.get_or_set("notes:version", 1, None)`. `NoteListView(ListAPIView)` scoped to the user, overriding `list()` to cache `super().list(...).data` under `f"notes:list:u{user.id}:v{notes_version()}"` and return `{"v": ..., "status": "HIT"|"MISS", "notes": data}`. Seed one note, GET twice (MISS then HIT). Then `Note.objects.bulk_create([...])` (no signals) + `cache.incr("notes:version")`, GET again -> `status == "MISS"`, `v == 2`, and the bulk notes appear.',
        taskHi: 'Version-bump invalidation. `Note` (`owner` FK, `text`). `notes_version()`. `NoteListView` `list()` override karके cache. Ek note seed, GET x2 (MISS/HIT). Phir `bulk_create` + `cache.incr("notes:version")`, GET -> MISS, v=2, bulk notes dikhें.',
        hint: '`bulk_create` does NOT fire `post_save` -> a signal-based invalidation would miss it. `cache.incr("notes:version")` re-keys every `notes:list:*` key at once. `super().list(request, *a, **kw).data` is the plain list.',
        hintHi: '`bulk_create` `post_save` FIRE NAHI karता. `cache.incr("notes:version")` har `notes:list:*` key ko re-key karता hai.',
      },
      {
        task: 'ETag on an APIView, `MIDDLEWARE=[]`. Model `AppConfig` (`key`, `value`, `version` int). `config_etag(request, *a, **k)` returns `f\'"cfg-{max_version}"\'` from `.order_by("-version").values_list("version", flat=True).first()`. `ConfigView(APIView)` with `@method_decorator(condition(etag_func=config_etag))` on `get`, which appends to `BUILDS` and returns `{key: value}` for all rows. With `APIClient`: `GET /config/` -> `200` + `ETag: "cfg-1"`; `GET` with matching `If-None-Match` -> `304`, empty body; `.update(version=2)` then `GET` with the old ETag -> `200` + `ETag: "cfg-2"`. Assert `BUILDS` ran twice (not on the 304).',
        taskHi: 'Ek APIView par ETag, `MIDDLEWARE=[]`. `AppConfig` (`key`, `value`, `version`) model karो. `config_etag`. `ConfigView` `get` par `@method_decorator(condition(etag_func=config_etag))`. `APIClient` se: `GET` -> `200` + `ETag`; match -> `304`; edit + old ETag -> `200` + naya ETag. `BUILDS` do baar.',
        hint: '`from django.utils.decorators import method_decorator`; `from django.views.decorators.http import condition`. `@method_decorator(condition(etag_func=fn))` on the `get` method of the `APIView`. `condition` runs the func before `dispatch` reaches your `get`.',
        hintHi: '`from django.utils.decorators import method_decorator`; `from django.views.decorators.http import condition`. `get` method par `@method_decorator(condition(etag_func=fn))`.',
      },
    ],

    keyTakeaways: [
      '`@cache_page` on a DRF list endpoint is USUALLY WRONG: it keys on method + URL only, but `get_queryset` is per-user, so it serves the first caller\'s rows to everyone (cross-user leak); it also caches error responses and ignores the `Authorization` header unless you Vary on it (then ~0 hit rate).',
      'Use the LOW-LEVEL cache with a deliberate key: `f"{resource}:{action}:u{user.id}:v{VERSION}:{page}:{ordering}:{filters}"` — it must MIRROR everything `get_queryset` + the serializer use to shape the response (user/tenant scope, pagination, every filter).',
      'Override `list()`/`retrieve()`: `cache.get(key)` -> on miss `super().list(...).data` -> `cache.set` -> `return Response(data)`. Cache the `.data` (plain dict/list), NOT the `Response` object (renderer state, not cleanly picklable) and NOT the queryset.',
      'Cache the EXPENSIVE PIECE, not the endpoint — a dashboard mixes a cheap `request.user` bit with an expensive org aggregation; `cache.get_or_set(f"dash:stats:org{id}:v3", ..., 300)` for just the aggregation. Same idea as template fragment caching, applied to JSON.',
      'Invalidate: (1) bump a `VERSION` constant on deploy when the serializer/query shape changes -> orphans all `...:v{old}:...` keys; (2) delete specific keys in `perform_create`/`perform_update`/`perform_destroy` via `transaction.on_commit`. `ModelViewSet` fires `post_save`, but a bulk `@action` does not — invalidate there explicitly.',
      'ETags for polled read endpoints (config, feature flags, reference lists): `@method_decorator(condition(etag_func=...))` on `get` — Django calls `etag_func` (a cheap `SELECT version`/`MAX(updated_at)`) BEFORE the view; a matching `If-None-Match` -> `304` and the view (query + serialize) NEVER RUNS.',
      'A `SerializerMethodField` calling `obj.related.count()`/`.filter()` is an N+1 across a list. `@cached_property` does NOT fix it (it memoizes per instance, but a list = N distinct instances). The fix is `annotate(Count(...))` / `prefetch_related` in the view\'s `get_queryset`; the method reads the annotated attr. `cached_property` only helps when the SAME object is asked for the value twice in one request.',
      'Use a SEPARATE cache alias per concern: `default` for serialized data, `throttle` for rate limits (Module 6), `sessions` for `SESSION_ENGINE` — different TTLs and eviction, and `cache.clear()` on one doesn\'t nuke the others.',
    ],
    keyTakeawaysHi: [
      'Ek DRF list endpoint par `@cache_page` AKSAR GALAT hai: ye sirf method + URL par key karता hai, par `get_queryset` per-user hai, toh ye pehle caller ki rows sabko serve karता hai (cross-user leak); ye error responses bhi cache karता hai.',
      'LOW-LEVEL cache istemal karो ek deliberate key ke saath: `f"{resource}:{action}:u{user.id}:v{VERSION}:{page}:{filters}"` — ise sab kuch MIRROR karna chahिए jо `get_queryset` + serializer response shape karने ke liye istemal karते hain.',
      '`list()`/`retrieve()` override karो: `cache.get(key)` -> miss par `super().list(...).data` -> `cache.set` -> `return Response(data)`. `.data` cache karो (plain dict/list), `Response` object NAHI aur queryset NAHI.',
      'EXPENSIVE PIECE cache karो, endpoint nahi — ek dashboard ek cheap `request.user` bit ko ek expensive org aggregation ke saath mix karता hai; sirf aggregation ke liye `cache.get_or_set(...)`.',
      'Invalidate: (1) deploy par ek `VERSION` constant bump karो jab serializer/query shape badalता hai; (2) `perform_create`/`perform_update`/`perform_destroy` mein `transaction.on_commit` ke zariye specific keys delete karो. `ModelViewSet` `post_save` fire karता hai, par ek bulk `@action` nahi.',
      'Polled read endpoints ke liye ETags: `get` par `@method_decorator(condition(etag_func=...))` — Django `etag_func` ko view se PEHLE call karता hai; ek matching `If-None-Match` -> `304` aur view (query + serialize) KABHI NAHI CHALTA.',
      'Ek `SerializerMethodField` jо `obj.related.count()` call karता hai ek list ke paar ek N+1 hai. `@cached_property` ise FIX NAHI karता. Fix view ke `get_queryset` mein `annotate(Count(...))` / `prefetch_related` hai.',
      'Prati concern ek ALAG cache alias: `default` serialized data ke liye, `throttle` rate limits ke liye, `sessions` `SESSION_ENGINE` ke liye.',
    ],
  },
];
