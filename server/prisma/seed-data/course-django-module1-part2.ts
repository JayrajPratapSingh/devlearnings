/**
 * Django Complete Course — Module 1: Foundations & the Request Lifecycle, lessons 4-6.
 *
 * Lesson 4: the request/response cycle — WSGI/ASGI entrypoint, HttpRequest,
 *           HttpResponse / JsonResponse, status codes, dev server vs Gunicorn.
 * Lesson 5: middleware — the onion, __call__, ordering, writing one, the
 *           built-in stack, where auth and security happen.
 * Lesson 6: management commands & the shell — manage.py internals, custom
 *           BaseCommand, add_arguments/handle, call_command, scheduled jobs.
 *
 * NOTE for future editors: same conventions as course-django-module1.ts.
 *  - Every backtick inside simple/simpleHi/content/contentHi is `\``.
 *  - `$` before `{` in template literals -> `\${`.
 *  - `examples` use `code` + `output`, ASCII-only output, run with `python`.
 *  - Runnable examples boot standalone Django via settings.configure() + setup().
 *  - Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_1_PART2: CourseLesson[] = [
  {
    slug: 'dj-request-response-cycle',
    title: 'The Request/Response Cycle: WSGI, HttpRequest, HttpResponse',
    titleHi: 'Request/Response Cycle: WSGI, HttpRequest, HttpResponse',
    description: 'A request arrives at Gunicorn, becomes an `HttpRequest`, travels down the middleware stack to the URL resolver, into your view, and a returned `HttpResponse` travels back up. Knowing every station on that line is how you debug "why is this header missing" and "where do I put that check".',
    descriptionHi: 'Ek request Gunicorn par aati hai, ek `HttpRequest` ban jaati hai, middleware stack se neeche URL resolver tak jaati hai, aapke view mein, aur ek returned `HttpResponse` wapas upar jaata hai. Us line ka har station jaanna aise aap debug karte ho "ye header kyun missing hai" aur "wo check kahaan rakhun".',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 4,

    analogy: {
      en: '**A parcel moving through a mail-sorting facility.** A truck (Gunicorn/Uvicorn) backs up to the dock and drops raw sacks — bytes off the socket. At intake, each parcel is unpacked into a standard tote with labelled compartments: sender address, contents, customs form, priority sticker. That tote is the `HttpRequest` — `request.method`, `request.GET`, `request.body`, `request.headers`, `request.user`. The tote then rides a conveyor through a line of inspection stations (middleware): a scanner stamps a tracking barcode, a security station x-rays it, an address-check station validates the destination. At the end of the line a clerk (your view) reads the tote, does the work, and puts a response parcel on the return conveyor — an `HttpResponse` with a status number and its own compartments (headers, body, cookies). That response rides back through the *same* stations in reverse, each getting a chance to add a stamp (a caching header, a `Set-Cookie`, a compression wrapper) before the truck takes it away. If any station rejects the parcel, it turns it around early and the clerk never sees it — which is exactly how authentication and host-checking work.',
      hi: '**Ek parcel ek mail-sorting facility se guzarता hai.** Ek truck (Gunicorn/Uvicorn) dock par aata hai aur raw sacks drop karta hai — socket se bytes. Intake par, har parcel ek standard tote mein unpack hota hai labelled compartments ke saath: sender address, contents, customs form, priority sticker. Wo tote `HttpRequest` hai — `request.method`, `request.GET`, `request.body`, `request.headers`, `request.user`. Tote phir ek conveyor par inspection stations (middleware) ki ek line se guzarта hai. Line ke ant mein ek clerk (aapka view) tote padhता hai, kaam karता hai, aur return conveyor par ek response parcel rakhता hai — ek `HttpResponse` ek status number aur apne compartments ke saath. Wo response *wahi* stations se ulta wapas jaata hai, har ek ko ek stamp add karne ka mauka milता hai. Agar koi station parcel reject karta hai, wo ise jaldi wapas mod deta hai aur clerk kabhi nahi dekhता — yahi hai jaise authentication aur host-checking kaam karте hain.',
    },

    simple: `**The path of a request**

\`\`\`
browser
  |  HTTP over TCP
Nginx (reverse proxy, TLS, static files)
  |  proxies dynamic requests
Gunicorn / uWSGI (WSGI)   OR   Uvicorn / Daphne (ASGI)
  |  calls application(environ, start_response)
config/wsgi.py -> get_wsgi_application()   (the Django "app" object)
  |
Django's WSGIHandler builds an HttpRequest
  |
MIDDLEWARE  (top to bottom on the way in)
  |
URL resolver (ROOT_URLCONF) -> finds the view
  |
YOUR VIEW(request, *args, **kwargs) -> returns an HttpResponse
  |
MIDDLEWARE  (bottom to top on the way out)
  |
WSGIHandler turns the HttpResponse into bytes -> back to the client
\`\`\`

**The HttpRequest object**

\`\`\`python
def my_view(request):
    request.method            # "GET" / "POST" / "PUT" / ...
    request.GET               # QueryDict of ?a=1&b=2   (immutable)
    request.POST              # QueryDict of form-encoded body
    request.body              # raw bytes (use for JSON: json.loads(request.body))
    request.headers           # case-insensitive dict: request.headers["Authorization"]
    request.META              # raw WSGI environ: REMOTE_ADDR, HTTP_*, ...
    request.COOKIES           # dict
    request.user              # set by AuthenticationMiddleware (AnonymousUser if not logged in)
    request.session           # set by SessionMiddleware
    request.path              # "/blog/hello/"
    request.build_absolute_uri()   # "https://example.com/blog/hello/"
    request.is_secure()       # True under HTTPS
\`\`\`

**Building responses**

\`\`\`python
from django.http import (
    HttpResponse, JsonResponse, HttpResponseRedirect,
    HttpResponseNotFound, HttpResponseBadRequest, Http404,
)

return HttpResponse("hello", content_type="text/plain")
return HttpResponse(status=204)                       # No Content
return JsonResponse({"id": 1, "name": "Ada"})         # sets application/json
return JsonResponse([1, 2, 3], safe=False)            # non-dict top level needs safe=False
return HttpResponseRedirect("/login/")                # 302
return redirect("blog:list")                          # shortcut, resolves the name

resp = HttpResponse("x")
resp["X-Custom"] = "1"                                # set a header
resp.set_cookie("k", "v", max_age=3600, httponly=True, secure=True, samesite="Lax")
resp.status_code = 201

raise Http404("no such post")                         # caught -> 404 page
\`\`\`

**WSGI vs ASGI**

\`\`\`
WSGI  synchronous, one request per worker thread/process at a time.
      Gunicorn/uWSGI. The default and fine for most apps.
ASGI  asynchronous, supports  async def  views, WebSockets, SSE, long-lived connections.
      Uvicorn/Daphne/Hypercorn. Needed for real-time features or heavy fan-out I/O.
      config/asgi.py -> get_asgi_application()
\`\`\`

\`\`\`
HttpRequest  READ:  .method .GET .POST .body .headers .META .COOKIES .user .session .path
HttpResponse WRITE: HttpResponse(content, status=, content_type=)  JsonResponse(data)
             resp["Header"] = ...   resp.set_cookie(...)   resp.status_code = ...
Http404 / PermissionDenied / SuspiciousOperation  -> Django turns these into 404 / 403 / 400
NEVER build HTML/JSON by hand with string concatenation of user input -> use JsonResponse / templates
\`\`\``,

    simpleHi: `**Ek request ka raasta**

\`\`\`
browser
  |  HTTP over TCP
Nginx (reverse proxy, TLS, static files)
  |  dynamic requests proxy karता hai
Gunicorn / uWSGI (WSGI)   YA   Uvicorn / Daphne (ASGI)
  |  application(environ, start_response) call karता hai
config/wsgi.py -> get_wsgi_application()
  |
Django ka WSGIHandler ek HttpRequest banाता hai
  |
MIDDLEWARE  (andar jaते waqt upar se neeche)
  |
URL resolver (ROOT_URLCONF) -> view dhoondhता hai
  |
AAPKA VIEW(request, *args, **kwargs) -> ek HttpResponse lautाता hai
  |
MIDDLEWARE  (bahar jaते waqt neeche se upar)
  |
WSGIHandler HttpResponse ko bytes banाता hai -> wapas client ko
\`\`\`

**HttpRequest object**

\`\`\`python
def my_view(request):
    request.method            # "GET" / "POST" / "PUT" / ...
    request.GET               # ?a=1&b=2 ka QueryDict   (immutable)
    request.POST              # form-encoded body ka QueryDict
    request.body              # raw bytes (JSON ke liye: json.loads(request.body))
    request.headers           # case-insensitive dict: request.headers["Authorization"]
    request.META              # raw WSGI environ: REMOTE_ADDR, HTTP_*, ...
    request.user              # AuthenticationMiddleware dwara set (AnonymousUser agar logged in nahi)
    request.session           # SessionMiddleware dwara set
    request.path              # "/blog/hello/"
\`\`\`

**Responses banाना**

\`\`\`python
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect, Http404

return HttpResponse("hello", content_type="text/plain")
return HttpResponse(status=204)                       # No Content
return JsonResponse({"id": 1, "name": "Ada"})         # application/json set karता hai
return JsonResponse([1, 2, 3], safe=False)            # non-dict top level ko safe=False chahiye
return redirect("blog:list")                          # shortcut, naam resolve karता hai

resp = HttpResponse("x")
resp["X-Custom"] = "1"                                # ek header set karो
resp.set_cookie("k", "v", max_age=3600, httponly=True, secure=True, samesite="Lax")

raise Http404("no such post")                         # caught -> 404 page
\`\`\`

**WSGI vs ASGI**

\`\`\`
WSGI  synchronous, ek samay ek request prati worker. Gunicorn/uWSGI. Default aur adhikaansh apps ke liye theek.
ASGI  asynchronous,  async def  views, WebSockets, SSE support karता hai.
      Uvicorn/Daphne. Real-time features ke liye chahiye.
\`\`\`

\`\`\`
HttpRequest  PADHо:  .method .GET .POST .body .headers .META .COOKIES .user .session .path
HttpResponse LIKHо: HttpResponse(content, status=, content_type=)  JsonResponse(data)
Http404 / PermissionDenied / SuspiciousOperation  -> Django inhe 404 / 403 / 400 banाता hai
KABHI user input ke string concatenation se HTML/JSON haath se mat banाओ -> JsonResponse / templates
\`\`\``,

    content: `## The server boundary: WSGI and ASGI

A Django project cannot serve HTTP by itself. \`config/wsgi.py\` (generated by \`startproject\`) exposes a module-level \`application\` object — the result of \`get_wsgi_application()\`. A **WSGI server** (Gunicorn, uWSGI) is a long-running process that accepts TCP connections, parses HTTP, builds the WSGI \`environ\` dict, and calls \`application(environ, start_response)\`. Django's \`WSGIHandler\` receives that call, constructs an \`HttpRequest\`, runs the middleware + view, and returns an iterable of response bytes.

\`config/asgi.py\` is the async equivalent: \`get_asgi_application()\` produces an ASGI \`application\` coroutine, served by Uvicorn/Daphne/Hypercorn, which additionally supports \`async def\` views, WebSockets, and Server-Sent Events. Use WSGI unless you specifically need async or long-lived connections; the two are covered again in Module 10.

In production, Nginx (or a cloud load balancer) usually sits in front: it terminates TLS, serves \`/static/\` and \`/media/\` files directly, and reverse-proxies everything else to Gunicorn over a local socket.

## \`HttpRequest\`

Django wraps the raw request in an \`HttpRequest\`. The parts you use:

- **\`request.method\`** — the HTTP verb, uppercase.
- **\`request.GET\`** / **\`request.POST\`** — \`QueryDict\` objects (a multi-value dict). \`request.GET["q"]\` or \`request.GET.get("q", default)\`; \`request.GET.getlist("tag")\` for repeated params. Both are immutable.
- **\`request.body\`** — the raw request body as \`bytes\`. For a JSON API you read \`json.loads(request.body)\` yourself (DRF does this for you — Module 5). Accessing \`request.POST\` or \`request.body\` consumes the stream, so read one, not both.
- **\`request.headers\`** — a case-insensitive mapping: \`request.headers["Authorization"]\`, \`request.headers.get("X-Request-Id")\`.
- **\`request.META\`** — the raw WSGI environ: \`REMOTE_ADDR\`, \`REMOTE_HOST\`, \`SERVER_NAME\`, and HTTP headers as \`HTTP_\` keys. Behind a proxy, the client IP is in \`HTTP_X_FORWARDED_FOR\` (validate it — Module 6).
- **\`request.user\`** — set by \`AuthenticationMiddleware\`. An authenticated \`User\` or \`AnonymousUser\`. \`request.user.is_authenticated\` is the check.
- **\`request.session\`** — set by \`SessionMiddleware\`. A dict-like object backed by the session store.
- **\`request.path\`**, **\`request.get_full_path()\`**, **\`request.build_absolute_uri()\`**, **\`request.is_secure()\`**.

## \`HttpResponse\` and its subclasses

Every view must return an \`HttpResponse\` (or raise an exception Django knows how to turn into one). The family:

\`\`\`python
HttpResponse(content=b"", *, content_type=None, status=200)
JsonResponse(data, *, safe=True, encoder=DjangoJSONEncoder, **kwargs)   # serialises data, sets JSON header
StreamingHttpResponse(streaming_content)                                 # for large/generated bodies (Module 8)
FileResponse(open("f.pdf", "rb"))                                        # efficient file serving
HttpResponseRedirect(url)      # 302        HttpResponsePermanentRedirect(url)   # 301
HttpResponseNotFound / NotModified / BadRequest / Forbidden / NotAllowed / Gone / ServerError
\`\`\`

A response is a mutable object until it leaves:

\`\`\`python
resp = HttpResponse("body")
resp["Cache-Control"] = "no-store"          # headers via item access
resp.status_code = 202
resp.set_cookie("sessionid", value, max_age=1209600, httponly=True, secure=True, samesite="Lax")
resp.delete_cookie("old")
\`\`\`

## Exceptions Django translates

Raising one of these from anywhere in a view (or code it calls) produces the right HTTP status without a manual \`return\`:

| Raise | Result | Typical use |
|---|---|---|
| \`Http404\` | 404 page | object not found (\`get_object_or_404\` raises this) |
| \`PermissionDenied\` | 403 page | authenticated but not allowed |
| \`SuspiciousOperation\` (and subclasses) | 400 | tampered signed cookie, bad Host, etc. |
| \`BadRequest\` | 400 | malformed input |

Unhandled exceptions become a 500 — logged, and (with \`ADMINS\` set) emailed. Never let a raw exception leak to the user with \`DEBUG=True\` in production (Module 1 lesson 2).

## The dev server vs production

\`runserver\` is convenient but single-worker and insecure. Production:

\`\`\`bash
gunicorn config.wsgi:application \\
  --workers $((2 * $(nproc) + 1)) \\
  --bind unix:/run/gunicorn.sock \\
  --timeout 30 --max-requests 1000 --max-requests-jitter 50
\`\`\`

Workers give you parallelism (each is a separate process — recall the GIL, Python Module 10); \`--max-requests\` recycles workers to bound memory leaks. Uvicorn with \`--workers\` (or Gunicorn's \`uvicorn.workers.UvicornWorker\`) for ASGI. Full deployment is Module 10.`,

    contentHi: `## Server boundary: WSGI aur ASGI

Ek Django project khud HTTP serve nahi kar sakta. \`config/wsgi.py\` ek module-level \`application\` object expose karता hai — \`get_wsgi_application()\` ka result. Ek **WSGI server** (Gunicorn, uWSGI) ek long-running process hai jо TCP connections accept karता hai, HTTP parse karता hai, WSGI \`environ\` dict banाता hai, aur \`application(environ, start_response)\` call karता hai. Django ka \`WSGIHandler\` wo call receive karता hai, ek \`HttpRequest\` banाता hai, middleware + view chalाता hai, aur response bytes ka ek iterable lautाता hai.

\`config/asgi.py\` async samकक्ष hai: \`get_asgi_application()\`, Uvicorn/Daphne dwara serve, jо atirikt roop se \`async def\` views, WebSockets support karता hai. WSGI istemal karो jab tak aapko vishesh roop se async na chahiye.

Production mein, Nginx aamताur par aage baithता hai: ye TLS terminate karता hai, \`/static/\` aur \`/media/\` files seedhे serve karता hai, aur baaki sab Gunicorn ko reverse-proxy karता hai.

## \`HttpRequest\`

- **\`request.method\`** — HTTP verb, uppercase.
- **\`request.GET\`** / **\`request.POST\`** — \`QueryDict\` objects. \`request.GET.get("q", default)\`; \`request.GET.getlist("tag")\`. Dono immutable.
- **\`request.body\`** — raw request body \`bytes\` ki tarah. Ek JSON API ke liye aap khud \`json.loads(request.body)\` padhते ho. \`request.POST\` ya \`request.body\` access karna stream consume karता hai.
- **\`request.headers\`** — case-insensitive mapping.
- **\`request.META\`** — raw WSGI environ. Ek proxy ke peeche, client IP \`HTTP_X_FORWARDED_FOR\` mein hai.
- **\`request.user\`** — \`AuthenticationMiddleware\` dwara set. \`request.user.is_authenticated\` check hai.
- **\`request.session\`** — \`SessionMiddleware\` dwara set.

## \`HttpResponse\` aur iske subclasses

Har view ko ek \`HttpResponse\` lautाना chahiye (ya ek exception raise karna chahiye jise Django ek mein badal sake).

\`\`\`python
HttpResponse(content=b"", *, content_type=None, status=200)
JsonResponse(data, *, safe=True)                        # data serialise, JSON header set
StreamingHttpResponse(streaming_content)                 # bade bodies ke liye (Module 8)
FileResponse(open("f.pdf", "rb"))
HttpResponseRedirect(url)      # 302
\`\`\`

\`\`\`python
resp = HttpResponse("body")
resp["Cache-Control"] = "no-store"
resp.set_cookie("sessionid", value, max_age=1209600, httponly=True, secure=True, samesite="Lax")
\`\`\`

## Exceptions jinhe Django translate karता hai

| Raise | Result | Istemal |
|---|---|---|
| \`Http404\` | 404 page | object not found |
| \`PermissionDenied\` | 403 page | authenticated par allowed nahi |
| \`SuspiciousOperation\` | 400 | tampered signed cookie, bad Host |
| \`BadRequest\` | 400 | malformed input |

Unhandled exceptions ek 500 ban jाते hain — logged, aur (\`ADMINS\` set ke saath) emailed.

## Dev server vs production

\`\`\`bash
gunicorn config.wsgi:application \\
  --workers $((2 * $(nproc) + 1)) \\
  --bind unix:/run/gunicorn.sock \\
  --timeout 30 --max-requests 1000 --max-requests-jitter 50
\`\`\`

Workers parallelism dete hain (har ek ek alag process); \`--max-requests\` workers recycle karता hai memory leaks bound karne ko. Poora deployment Module 10 hai.`,

    examples: [
      {
        title: 'Reading an HttpRequest and returning JSON',
        titleHi: 'Ek HttpRequest padhna aur JSON lautाना',
        code: `import django, json
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], MIDDLEWARE=[], USE_TZ=True)
django.setup()

from django.urls import path
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.test import Client

@csrf_exempt
def echo(request):
    if request.method != "POST":
        return HttpResponseBadRequest("POST only")
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest("invalid JSON")
    return JsonResponse({
        "method": request.method,
        "query_q": request.GET.get("q", ""),
        "content_type": request.headers.get("Content-Type"),
        "received": payload,
    }, status=201)

urlpatterns = [path("echo/", echo)]

c = Client()
r = c.post("/echo/?q=hello", data=json.dumps({"name": "Ada", "n": 3}),
           content_type="application/json")
print("status:", r.status_code)
print("body:", r.json())
print("GET on POST-only:", c.get("/echo/").status_code)`,
        output: `status: 201
body: {'method': 'POST', 'query_q': 'hello', 'content_type': 'application/json', 'received': {'name': 'Ada', 'n': 3}}
GET on POST-only: 400
`,
        explain: 'The view reads `request.method` to gate the verb, `request.GET.get("q")` for the query string, `request.headers` for the content type, and `json.loads(request.body)` for the JSON body (raw bytes — Django does not parse JSON automatically for plain views; DRF does). It returns a `JsonResponse` with an explicit `status=201`. `@csrf_exempt` is needed here only because this is a plain view taking POST without a CSRF token; a real JSON API uses DRF or token auth (Module 6). A malformed body or wrong method returns a `400` without ever raising.',
        explainHi: 'View `request.method` padhता hai verb gate karne ko, `request.GET.get("q")` query string ke liye, `request.headers` content type ke liye, aur `json.loads(request.body)` JSON body ke liye (raw bytes — Django plain views ke liye JSON apne aap parse nahi karता; DRF karता hai). Ye ek explicit `status=201` ke saath ek `JsonResponse` lautाता hai. `@csrf_exempt` yahaan sirf isliye chahiye kyunki ye ek plain view hai jо bina CSRF token ke POST leता hai.',
      },
      {
        title: 'The exceptions Django turns into HTTP status codes',
        titleHi: 'Exceptions jinhe Django HTTP status codes mein badalता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=False, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], MIDDLEWARE=[], USE_TZ=True)
django.setup()

from django.urls import path
from django.http import HttpResponse, Http404
from django.core.exceptions import PermissionDenied, BadRequest, SuspiciousOperation
from django.test import Client

def not_found(request):   raise Http404("no such widget")
def forbidden(request):   raise PermissionDenied("not your resource")
def bad(request):         raise BadRequest("bad params")
def suspicious(request):  raise SuspiciousOperation("tampered token")
def crash(request):       raise ValueError("unhandled bug")
def ok(request):          return HttpResponse("fine")

urlpatterns = [
    path("nf/", not_found), path("fb/", forbidden), path("bad/", bad),
    path("susp/", suspicious), path("crash/", crash), path("ok/", ok),
]

c = Client(raise_request_exception=False)
for url in ["/ok/", "/nf/", "/fb/", "/bad/", "/susp/", "/crash/"]:
    print(f"{url:9} -> {c.get(url).status_code}")`,
        output: `/ok/      -> 200
/nf/      -> 404
/fb/      -> 403
/bad/     -> 400
/susp/    -> 400
/crash/   -> 500`,
        explain: 'You do not write `return HttpResponse(status=404)` for error cases — you `raise` a semantic exception and Django\'s exception-handling middleware maps it to the right status: `Http404` -> 404 (this is what `get_object_or_404` raises internally), `PermissionDenied` -> 403, `BadRequest` and `SuspiciousOperation` -> 400. Any *other* uncaught exception becomes a 500 and is logged. This keeps view code focused on the happy path with early `raise`s for the failure branches.',
        explainHi: 'Aap error cases ke liye `return HttpResponse(status=404)` nahi likhते — aap ek semantic exception `raise` karते ho aur Django ki exception-handling middleware ise sahi status par map karती hai: `Http404` -> 404 (yahi `get_object_or_404` andar raise karता hai), `PermissionDenied` -> 403, `BadRequest` aur `SuspiciousOperation` -> 400. Koi bhi *doosra* uncaught exception ek 500 ban jाता hai aur log hoता hai.',
      },
      {
        title: 'The WSGI application object is just a callable',
        titleHi: 'WSGI application object bस ek callable hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], MIDDLEWARE=["django.middleware.common.CommonMiddleware"], USE_TZ=True)
django.setup()

from django.urls import path
from django.http import JsonResponse
from django.core.wsgi import get_wsgi_application

def hello(request):
    return JsonResponse({"hello": request.GET.get("name", "world")})

urlpatterns = [path("hello/", hello)]

# this is exactly what config/wsgi.py exposes and Gunicorn imports:
application = get_wsgi_application()

# a WSGI server would build 'environ' and call application(environ, start_response).
# here we do it by hand to show there is no magic:
from io import BytesIO
captured = {}
def start_response(status, headers, exc_info=None):
    captured["status"] = status
    captured["headers"] = dict(headers)

environ = {
    "REQUEST_METHOD": "GET", "PATH_INFO": "/hello/", "QUERY_STRING": "name=Ada",
    "SERVER_NAME": "testserver", "SERVER_PORT": "80", "wsgi.url_scheme": "http",
    "wsgi.input": BytesIO(b""), "wsgi.errors": BytesIO(),
}
body = b"".join(application(environ, start_response))
print("status:", captured["status"])
print("content-type:", captured["headers"].get("Content-Type"))
print("body:", body.decode())`,
        output: `status: 200 OK
content-type: application/json
body: {"hello": "Ada"}
`,
        explain: '`get_wsgi_application()` returns a plain callable that takes \`(environ, start_response)\` and returns an iterable of bytes — the entire WSGI contract. `config/wsgi.py` assigns exactly this to a module-level `application`, and Gunicorn does `gunicorn config.wsgi:application` to import and call it. Building the `environ` dict and calling it by hand shows there is no framework magic at the boundary: a server parses HTTP into a dict, Django turns the dict into an `HttpRequest`, runs your view, and serialises the `HttpResponse` back to bytes.',
        explainHi: '`get_wsgi_application()` ek plain callable lautाता hai jо `(environ, start_response)` leता hai aur bytes ka ek iterable lautाता hai — poora WSGI contract. `config/wsgi.py` bilkul ise ek module-level `application` ko assign karता hai, aur Gunicorn `gunicorn config.wsgi:application` karता hai ise import aur call karne ko. `environ` dict haath se banाना dikhाता hai ki boundary par koi framework magic nahi hai.',
      },
    ],

    mistakes: [
      {
        wrong: `def create_user(request):
    data = json.loads(request.body)          # reads and consumes the stream
    name = request.POST["name"]              # ERROR: stream already consumed -> empty
    ...`,
        right: `def create_user(request):
    data = json.loads(request.body)          # JSON body: read ONLY request.body
    name = data["name"]
# or, for a form POST: use request.POST and do NOT touch request.body`,
        why: 'The request body is a stream that can be read once. `request.POST` parses it (for form-encoded / multipart content), and `request.body` gives the raw bytes; accessing one after the other on the same request fails or returns empty because the stream is exhausted. Decide upfront: form data -> `request.POST`; JSON/other -> `request.body` (and parse it yourself, or use DRF which handles content negotiation).',
        whyHi: 'Request body ek stream hai jise ek baar padhा jा sakta hai. `request.POST` ise parse karता hai (form-encoded content ke liye), aur `request.body` raw bytes deता hai; ek ke baad doosra access karna fail hoता hai kyunki stream khatam ho gaya. Pehle tay karो: form data -> `request.POST`; JSON -> `request.body`.',
      },
      {
        wrong: `def profile(request):
    if request.user:                         # AnonymousUser is truthy!
        return render(request, "profile.html")
    return redirect("login")`,
        right: `def profile(request):
    if request.user.is_authenticated:        # the real check
        return render(request, "profile.html")
    return redirect("login")
# better: @login_required decorator, or LoginRequiredMixin on a CBV`,
        why: '`request.user` is always set (by `AuthenticationMiddleware`) — to a real `User` when logged in, or to an `AnonymousUser` instance when not. `AnonymousUser` is a normal object and therefore truthy, so `if request.user:` is always true. The correct test is `request.user.is_authenticated`, which is `False` for `AnonymousUser`. In practice use `@login_required` / `LoginRequiredMixin` (Module 6) rather than hand-rolling the check.',
        whyHi: '`request.user` hamesha set hoता hai — logged in par ek asli `User`, warna ek `AnonymousUser` instance. `AnonymousUser` ek normal object hai aur isliye truthy, toh `if request.user:` hamesha true hai. Sahi test `request.user.is_authenticated` hai. Vyavhaar mein `@login_required` / `LoginRequiredMixin` istemal karो.',
      },
      {
        wrong: `def search(request):
    q = request.GET["query"]                 # KeyError -> 500 if ?query= is absent
    results = do_search(q)
    return JsonResponse({"results": results})`,
        right: `def search(request):
    q = request.GET.get("query", "").strip()
    if not q:
        return HttpResponseBadRequest("query is required")
    return JsonResponse({"results": do_search(q)})`,
        why: '`request.GET` and `request.POST` are dict-like; `["key"]` on a missing key raises `KeyError`, which becomes an unhandled 500 — a server error for what is really a client mistake. Use `.get("key", default)` and validate explicitly, returning a 400 for missing/invalid input. (DRF serializers do this validation for you — Module 5.)',
        whyHi: '`request.GET` aur `request.POST` dict-like hain; ek missing key par `["key"]` `KeyError` raise karता hai, jо ek unhandled 500 ban jाता hai — ek server error us cheez ke liye jо asal mein ek client mistake hai. `.get("key", default)` istemal karो aur explicitly validate karो, missing input ke liye ek 400 lautाकर.',
      },
    ],

    realWorld: [
      {
        en: '**Every request-scoped concern threads through `request`** — `request.user` for auth, `request.session` for state, a correlation/request ID added by middleware and read in logging, feature flags on `request`, the tenant on a multi-tenant app. Reading a view starts with "what did middleware attach to `request` before it got here".',
        hi: '**Har request-scoped concern `request` se guzarта hai** — auth ke liye `request.user`, state ke liye `request.session`, middleware dwara joda ek request ID logging mein padhा jाता, `request` par feature flags. Ek view padhна "middleware ne yahaan aane se pehle `request` par kya attach kiya" se shuru hoता hai.',
      },
      {
        en: '**`JsonResponse` + the semantic exceptions is the pattern for small internal endpoints** — health checks, webhooks, admin actions — where pulling in DRF is overkill. `raise Http404` / `PermissionDenied` keeps handlers short. Anything with real serialization, validation, or auth graduates to DRF (Module 5).',
        hi: '**`JsonResponse` + semantic exceptions chhote internal endpoints ke liye pattern hai** — health checks, webhooks, admin actions — jahaan DRF laana zyada hai. `raise Http404` / `PermissionDenied` handlers ko chhota rakhता hai. Asli serialization, validation, ya auth waali koi cheez DRF par graduate hoती hai.',
      },
      {
        en: '**The Nginx -> Gunicorn -> Django chain is the default production shape** — Nginx does TLS and static files, Gunicorn runs `2*cpu+1` sync workers over a unix socket with `--max-requests` recycling, Django handles dynamic requests. ASGI (Uvicorn) is swapped in only for WebSockets/SSE or heavily async I/O workloads.',
        hi: '**Nginx -> Gunicorn -> Django chain default production shape hai** — Nginx TLS aur static files karता hai, Gunicorn `2*cpu+1` sync workers chalाता hai `--max-requests` recycling ke saath, Django dynamic requests handle karता hai. ASGI (Uvicorn) sirf WebSockets/SSE ya bhaari async I/O ke liye swap hoता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through what happens from an HTTP request arriving to a response being sent, in a Django app.',
        qHi: 'Ek Django app mein, ek HTTP request aane se ek response bheje jaane tak kya hoता hai, samjhाओ.',
        a: 'In production a request first hits a reverse proxy, usually Nginx, which terminates TLS and, if the path is for static or media files, serves them directly without touching Django. Dynamic paths are proxied to the application server — Gunicorn or uWSGI for WSGI, Uvicorn or Daphne for ASGI — running as a long-lived process with a pool of workers. That server parses the raw HTTP into a WSGI environ dictionary and calls the application object that config slash wsgi dot py exposes, which is Django\'s WSGI handler. The handler builds an HttpRequest from the environ: method, path, query string, headers, body stream, cookies. Then the request passes down through the middleware stack in order — each middleware can inspect or modify the request, short-circuit with its own response, or pass it along. This is where the security checks, session loading, and authentication happen, so that by the time the request reaches a view, request dot user and request dot session are populated. After middleware, the URL resolver takes request dot path, walks the root URLconf\'s patterns in order, and finds the first match, extracting any typed path parameters. It calls the view function or class with the request and those parameters. The view does its work — querying the ORM, rendering a template or serializing data — and returns an HttpResponse, or raises an exception like Http404 or PermissionDenied that Django maps to a status code. The response then travels back up through the same middleware in reverse order, each getting a chance to add headers, set cookies, or wrap the body, for example gzip compression or cache headers. Finally the WSGI handler turns the HttpResponse into a status line, header list, and body iterable, hands it to the server, and the server writes it back over the socket, through Nginx, to the client.',
        aHi: 'Production mein ek request pehle ek reverse proxy par aati hai, aamताur par Nginx, jо TLS terminate karता hai aur, agar path static ya media files ke liye hai, unhe seedhे serve karता hai bina Django ko chhue. Dynamic paths application server ko proxy hote hain — WSGI ke liye Gunicorn, ASGI ke liye Uvicorn — ek long-lived process ki tarah chalте hue workers ke pool ke saath. Wo server raw HTTP ko ek WSGI environ dictionary mein parse karता hai aur us application object ko call karता hai jise config slash wsgi dot py expose karта hai. Handler environ se ek HttpRequest banाता hai. Phir request middleware stack se neeche kram mein guzarती hai — yahi security checks, session loading, aur authentication hoता hai. Middleware ke baad, URL resolver request dot path leता hai, root URLconf ke patterns ko kram mein chalता hai, aur pehला match dhoondhता hai. Ye view ko request aur un parameters ke saath call karता hai. View apna kaam karता hai aur ek HttpResponse lautाता hai. Response phir usi middleware se ulta wapas jाता hai. Ant mein WSGI handler HttpResponse ko bytes banाता hai.',
      },
      {
        q: 'What is `request.user`, when is it set, and what is the difference between checking it and `request.user.is_authenticated`?',
        qHi: '`request.user` kya hai, kab set hoता hai, aur ise check karne aur `request.user.is_authenticated` mein kya antar hai?',
        a: 'request dot user is the user associated with the current request, and it is attached by the AuthenticationMiddleware, which must be in the MIDDLEWARE list and must come after the SessionMiddleware because it reads the session to find the logged-in user id. The important detail is that request dot user is always set to something. If the request carries a valid session for a logged-in user, it is a User model instance. If not — an anonymous visitor, an expired session, an API call with no session — it is set to an AnonymousUser instance, which is a stand-in object that implements the same interface. Because AnonymousUser is a real object, it is truthy, so writing if request dot user is always true and tells you nothing about whether someone is logged in. The correct check is request dot user dot is_authenticated, which is a property that returns True on a real User and False on AnonymousUser. There is a matching is_anonymous. So you never test the user object for truthiness; you test the is_authenticated property. In practice, for function views you use the login_required decorator, and for class-based views the LoginRequiredMixin, both of which perform that check and redirect to the login page or return a 403 if it fails, so you rarely write the check by hand. In DRF the equivalent is the IsAuthenticated permission class. If AuthenticationMiddleware is missing or ordered before SessionMiddleware, request dot user will not be populated correctly and access to it can raise, which is a common cause of confusing auth bugs.',
        aHi: 'request dot user current request se juda user hai, aur ise AuthenticationMiddleware attach karता hai, jо MIDDLEWARE list mein hona chahiye aur SessionMiddleware ke baad aana chahiye kyunki ye session padhता hai. Mahatvapoorn detail ye hai ki request dot user hamesha kuch set hoता hai. Agar request ek logged-in user ke liye ek valid session le jाती hai, ye ek User model instance hai. Agar nahi — ek anonymous visitor, ek expired session — ye ek AnonymousUser instance set hoता hai. Kyunki AnonymousUser ek asli object hai, ye truthy hai, toh if request dot user likhna hamesha true hai. Sahi check request dot user dot is_authenticated hai, jо ek property hai jо ek asli User par True aur AnonymousUser par False lautाती hai. Vyavhaar mein, function views ke liye aap login_required decorator istemal karते ho, aur class-based views ke liye LoginRequiredMixin.',
      },
    ],

    exercises: [
      {
        task: 'Configure a standalone Django app with a `csrf_exempt` view at `/sum/` that reads a JSON body `{"numbers": [...]}` from `request.body`, returns `JsonResponse({"total": sum(numbers)})` with status 200, or a 400 `HttpResponseBadRequest` if the body is not valid JSON or `numbers` is missing. Use `django.test.Client` to POST valid and invalid bodies and print the status + body for each.',
        taskHi: 'Ek standalone Django app configure karो ek `csrf_exempt` view ke saath `/sum/` par jо `request.body` se ek JSON body `{"numbers": [...]}` padhे, `JsonResponse({"total": sum(numbers)})` status 200 ke saath lautае, ya ek 400 agar body valid JSON nahi ya `numbers` missing hai.',
        hint: '`from django.views.decorators.csrf import csrf_exempt`. `try: data = json.loads(request.body) except json.JSONDecodeError: return HttpResponseBadRequest(...)`. `numbers = data.get("numbers"); if not isinstance(numbers, list): return HttpResponseBadRequest(...)`. POST with `content_type="application/json"`.',
        hintHi: '`from django.views.decorators.csrf import csrf_exempt`. `try: data = json.loads(request.body) except json.JSONDecodeError: ...`. POST `content_type="application/json"` ke saath.',
      },
      {
        task: 'Build views that each `raise` one of `Http404`, `PermissionDenied`, `BadRequest`, and a plain `ValueError`. Wire them to URLs, and with `Client(raise_request_exception=False)` and `DEBUG=False`, GET each and assert the status codes are 404, 403, 400, and 500 respectively. Add one normal view returning 200 as a control.',
        taskHi: 'Views banाओ jо har ek `Http404`, `PermissionDenied`, `BadRequest`, aur ek plain `ValueError` mein se ek `raise` kare. Unhe URLs se wire karो, aur `Client(raise_request_exception=False)` aur `DEBUG=False` ke saath, har ek GET karो aur assert karो status codes 404, 403, 400, aur 500 hain.',
        hint: '`from django.core.exceptions import PermissionDenied, BadRequest`. `from django.http import Http404`. `Client(raise_request_exception=False)` lets the test client return the 500 page instead of re-raising `ValueError`.',
        hintHi: '`from django.core.exceptions import PermissionDenied, BadRequest`. `from django.http import Http404`. `Client(raise_request_exception=False)` test client ko 500 page return karने deता hai.',
      },
      {
        task: 'Get the WSGI `application` from `get_wsgi_application()` for a project with one view `/ping/` returning `JsonResponse({"pong": True})`. Construct an `environ` dict by hand (`REQUEST_METHOD`, `PATH_INFO`, `SERVER_NAME`, `SERVER_PORT`, `wsgi.url_scheme`, `wsgi.input`, `wsgi.errors`), call `application(environ, start_response)`, join the byte chunks, and print the captured status and the decoded body.',
        taskHi: '`get_wsgi_application()` se WSGI `application` lो ek project ke liye ek view `/ping/` ke saath jо `JsonResponse({"pong": True})` lautае. Ek `environ` dict haath se banाओ, `application(environ, start_response)` call karो, byte chunks join karो, aur captured status aur decoded body print karो.',
        hint: '`start_response(status, headers, exc_info=None)` captures into a dict. `wsgi.input` = `BytesIO(b"")`. `PATH_INFO="/ping/"`. `b"".join(application(environ, start_response)).decode()` is the body.',
        hintHi: '`start_response(status, headers, exc_info=None)` ek dict mein capture karता hai. `wsgi.input` = `BytesIO(b"")`. `PATH_INFO="/ping/"`.',
      },
    ],

    keyTakeaways: [
      'The chain: client -> Nginx (TLS, static) -> Gunicorn/uWSGI (WSGI) or Uvicorn/Daphne (ASGI) -> `config/wsgi.py:application` -> Django builds `HttpRequest` -> MIDDLEWARE (in) -> URL resolver -> VIEW -> `HttpResponse` -> MIDDLEWARE (out) -> bytes to client.',
      '`HttpRequest` (read): `.method`, `.GET`/`.POST` (immutable `QueryDict`, use `.get()`), `.body` (raw bytes for JSON), `.headers` (case-insensitive), `.META` (WSGI environ), `.COOKIES`, `.user` (from `AuthenticationMiddleware`), `.session`, `.path`.',
      'Read `request.POST` OR `request.body`, not both — the request body is a single-use stream.',
      '`request.user` is ALWAYS set: a `User` when logged in, an `AnonymousUser` (truthy!) otherwise. Check `request.user.is_authenticated`, never `if request.user`.',
      'Responses: `HttpResponse(content, status=, content_type=)`, `JsonResponse(data)` (sets JSON header; `safe=False` for non-dict top level), `StreamingHttpResponse`/`FileResponse` for big/file bodies, `HttpResponseRedirect`/`redirect()`. Set headers with `resp["Name"] = ...`; cookies with `resp.set_cookie(...)`.',
      'Raise, don\'t return, for errors: `Http404` -> 404, `PermissionDenied` -> 403, `BadRequest`/`SuspiciousOperation` -> 400. Any other uncaught exception -> 500 (logged, emailed to `ADMINS`). `get_object_or_404` raises `Http404`.',
      'Use `.get("key", default)` on `request.GET`/`POST` and validate — `["key"]` on a missing key is a `KeyError` = a 500 for a client mistake.',
      'WSGI = synchronous, one request per worker at a time (Gunicorn, `2*cpu+1` workers, `--max-requests` to recycle). ASGI = async, needed for `async def` views, WebSockets, SSE (Uvicorn/Daphne).',
    ],
    keyTakeawaysHi: [
      'Chain: client -> Nginx (TLS, static) -> Gunicorn/uWSGI (WSGI) ya Uvicorn/Daphne (ASGI) -> `config/wsgi.py:application` -> Django `HttpRequest` banाता hai -> MIDDLEWARE (in) -> URL resolver -> VIEW -> `HttpResponse` -> MIDDLEWARE (out) -> bytes client ko.',
      '`HttpRequest` (padhо): `.method`, `.GET`/`.POST` (immutable `QueryDict`, `.get()` istemal karो), `.body` (JSON ke liye raw bytes), `.headers` (case-insensitive), `.META`, `.user` (`AuthenticationMiddleware` se), `.session`, `.path`.',
      '`request.POST` YA `request.body` padhо, dono nahi — request body ek single-use stream hai.',
      '`request.user` HAMESHA set hoता hai: logged in par ek `User`, warna ek `AnonymousUser` (truthy!). `request.user.is_authenticated` check karो, kabhi `if request.user` nahi.',
      'Responses: `HttpResponse(content, status=, content_type=)`, `JsonResponse(data)` (`safe=False` non-dict top level ke liye), `StreamingHttpResponse`/`FileResponse` bade/file bodies ke liye, `redirect()`. Headers `resp["Name"] = ...` se; cookies `resp.set_cookie(...)` se.',
      'Errors ke liye raise karो, return nahi: `Http404` -> 404, `PermissionDenied` -> 403, `BadRequest`/`SuspiciousOperation` -> 400. Koi doosra uncaught exception -> 500. `get_object_or_404` `Http404` raise karता hai.',
      '`request.GET`/`POST` par `.get("key", default)` istemal karो aur validate karो — ek missing key par `["key"]` ek `KeyError` = ek client mistake ke liye 500.',
      'WSGI = synchronous, ek samay ek request prati worker (Gunicorn, `2*cpu+1` workers). ASGI = async, `async def` views, WebSockets, SSE ke liye chahiye (Uvicorn/Daphne).',
    ],
  },

  {
    slug: 'dj-middleware',
    title: 'Middleware: The Onion, Ordering, and the Built-in Stack',
    titleHi: 'Middleware: Onion, Ordering, Aur Built-in Stack',
    description: 'Middleware is the layer of code every request passes through before your view and every response passes through on the way out. Django ships a stack that does session loading, auth, CSRF, clickjacking protection and more — and the order of that stack is load-bearing.',
    descriptionHi: 'Middleware wo code ki layer hai jismें se har request aapke view se pehle guzarती hai aur har response bahar jaते waqt guzarता hai. Django ek stack ship karता hai jо session loading, auth, CSRF, clickjacking protection aur zyada karता hai — aur us stack ka kram load-bearing hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**Airport security lanes you pass on the way to the gate and again on the way out.** Each lane is a middleware. On the way in you go through them top to bottom: document check (is this `Host` allowed), bag scan (session cookie -> load session), ID verification (authentication -> attach the user), contraband check (CSRF token valid). Any lane can stop you and send you back with a rejection slip — you never reach the gate (your view). If you clear them all, you reach the gate, board (the view runs), and on the way back out you pass the *same* lanes in reverse: the last one you entered is the first you exit. On the way out each lane can add a sticker to your boarding pass — a duty-free receipt (a `Set-Cookie`), a customs stamp (a security header), shrink-wrap on your bag (gzip). The order is not cosmetic: ID verification must come *after* the bag scan, because it needs what the bag scan loaded (the session) to know who you are. Swap two lanes and the machine either breaks or quietly stops protecting you.',
      hi: '**Airport security lanes jinse aap gate ke raaste par guzarते ho aur wapas aane par phir.** Har lane ek middleware hai. Andar jaते waqt aap unse upar se neeche guzarते ho: document check (kya ye `Host` allowed hai), bag scan (session cookie -> session load karो), ID verification (authentication -> user attach karो), contraband check (CSRF token valid). Koi bhi lane aapko rok sakti hai aur ek rejection slip ke saath wapas bhej sakti hai — aap kabhi gate (aapka view) tak nahi pahुँchते. Agar aap sab clear karते ho, aap gate tak pahुँchते ho, board karте ho (view chalता hai), aur wapas jaते waqt aap *wahi* lanes se ulta guzarते ho. Kram cosmetic nahi hai: ID verification bag scan ke *baad* aana chahiye, kyunki use bag scan ne jо load kiya (session) chahiye ye jaanne ke liye aap kaun ho.',
    },

    simple: `**A middleware is a callable that wraps the next one**

\`\`\`python
class SimpleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response      # the "next" layer (or the view)

    def __call__(self, request):
        # --- code here runs BEFORE the view (request going in) ---
        response = self.get_response(request)  # call the next layer / the view
        # --- code here runs AFTER the view (response coming out) ---
        return response
\`\`\`

**Register it (order matters)**

\`\`\`python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",          # 1
    "django.contrib.sessions.middleware.SessionMiddleware",   # 2  loads request.session
    "django.middleware.common.CommonMiddleware",              # 3
    "django.middleware.csrf.CsrfViewMiddleware",              # 4
    "django.contrib.auth.middleware.AuthenticationMiddleware",# 5  needs sessions -> AFTER #2
    "django.contrib.messages.middleware.MessageMiddleware",   # 6
    "django.middleware.clickjacking.XFrameOptionsMiddleware", # 7
    "myapp.middleware.RequestIDMiddleware",                   # your own
]
\`\`\`

\`\`\`
REQUEST  flows TOP -> BOTTOM   (item 1's "before" code runs first)
RESPONSE flows BOTTOM -> TOP   (item 1's "after" code runs last)

  request  --> [1 before] --> [2 before] --> ... --> VIEW
  response <-- [1 after]  <-- [2 after]  <-- ... <-- VIEW
\`\`\`

**Short-circuiting: return a response without calling the view**

\`\`\`python
class MaintenanceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        if settings.MAINTENANCE_MODE and not request.path.startswith("/admin/"):
            return HttpResponse("Down for maintenance", status=503)   # view NEVER runs
        return self.get_response(request)
\`\`\`

**The optional hooks**

\`\`\`python
class MyMiddleware:
    def __init__(self, get_response): self.get_response = get_response
    def __call__(self, request): return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        ...   # after URL resolution, before the view. Return a response to short-circuit.

    def process_exception(self, request, exception):
        ...   # the view raised. Return a response, or None to let Django handle it.

    def process_template_response(self, request, response):
        ...   # response has .render() not yet called (TemplateResponse). Return response.
\`\`\`

**What the built-in stack does**

\`\`\`
SecurityMiddleware        HTTPS redirect, HSTS, nosniff, referrer-policy headers
SessionMiddleware         reads sessionid cookie -> request.session ; writes it back on the way out
CommonMiddleware          APPEND_SLASH redirects, DISALLOWED_USER_AGENTS, ETag
CsrfViewMiddleware        verifies the CSRF token on unsafe methods (POST/PUT/PATCH/DELETE)
AuthenticationMiddleware  request.session -> request.user  (AnonymousUser if none)
MessageMiddleware         the messages framework (flash messages) storage
XFrameOptionsMiddleware   X-Frame-Options: DENY  (clickjacking)
GZipMiddleware            (opt-in) compress the response  -- do NOT use with sensitive dynamic content (BREACH)
\`\`\``,

    simpleHi: `**Ek middleware ek callable hai jо agle ko wrap karता hai**

\`\`\`python
class SimpleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response      # "agली" layer (ya view)

    def __call__(self, request):
        # --- yahaan code view se PEHLE chalता hai (request andar jाती) ---
        response = self.get_response(request)  # agली layer / view call karो
        # --- yahaan code view ke BAAD chalता hai (response bahar aata) ---
        return response
\`\`\`

**Register karो (kram maayne rakhता hai)**

\`\`\`python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",          # 1
    "django.contrib.sessions.middleware.SessionMiddleware",   # 2  request.session load karता hai
    "django.middleware.common.CommonMiddleware",              # 3
    "django.middleware.csrf.CsrfViewMiddleware",              # 4
    "django.contrib.auth.middleware.AuthenticationMiddleware",# 5  sessions chahिए -> #2 ke BAAD
    "django.contrib.messages.middleware.MessageMiddleware",   # 6
    "django.middleware.clickjacking.XFrameOptionsMiddleware", # 7
]
\`\`\`

\`\`\`
REQUEST  UPAR -> NEECHE bahता hai   (item 1 ka "before" code pehle chalता hai)
RESPONSE NEECHE -> UPAR bahता hai   (item 1 ka "after" code aakhri chalता hai)

  request  --> [1 before] --> [2 before] --> ... --> VIEW
  response <-- [1 after]  <-- [2 after]  <-- ... <-- VIEW
\`\`\`

**Short-circuiting: view call kiye bina ek response lautाओ**

\`\`\`python
class MaintenanceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        if settings.MAINTENANCE_MODE and not request.path.startswith("/admin/"):
            return HttpResponse("Down for maintenance", status=503)   # view KABHI nahi chalता
        return self.get_response(request)
\`\`\`

**Optional hooks**

\`\`\`python
    def process_view(self, request, view_func, view_args, view_kwargs):
        ...   # URL resolution ke baad, view se pehle. Short-circuit ke liye ek response return karो.

    def process_exception(self, request, exception):
        ...   # view ne raise kiya. Ek response return karो, ya None Django ko handle karने do.
\`\`\`

**Built-in stack kya karता hai**

\`\`\`
SecurityMiddleware        HTTPS redirect, HSTS, nosniff, referrer-policy headers
SessionMiddleware         sessionid cookie padhता hai -> request.session
CommonMiddleware          APPEND_SLASH redirects, ETag
CsrfViewMiddleware        unsafe methods par CSRF token verify karता hai
AuthenticationMiddleware  request.session -> request.user
MessageMiddleware         messages framework storage
XFrameOptionsMiddleware   X-Frame-Options: DENY  (clickjacking)
GZipMiddleware            (opt-in) response compress -- sensitive dynamic content ke saath mat istemal karो (BREACH)
\`\`\``,

    content: `## The modern middleware contract

Since Django 1.10 a middleware is any callable that, given a \`get_response\` callable, returns a callable taking a \`request\` and returning a \`response\`. The class form:

\`\`\`python
class XMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # one-time configuration and initialisation, run at startup

    def __call__(self, request):
        # BEFORE: runs on the way in, in MIDDLEWARE order
        response = self.get_response(request)
        # AFTER: runs on the way out, in REVERSE MIDDLEWARE order
        return response
\`\`\`

\`get_response\` is the next middleware's \`__call__\` — or, for the innermost middleware, the view (wrapped in the view middleware machinery). Each middleware instance is created **once** at startup; \`__call__\` runs **per request**. Do not store request state on \`self\`.

## The onion, precisely

\`MIDDLEWARE\` is a list. On the way **in**, Django calls them top to bottom: \`MIDDLEWARE[0]\`'s "before" code, then \`MIDDLEWARE[1]\`'s, ... then the view. On the way **out**, the responses unwind bottom to top: the view's response is returned to the last middleware's "after" code first, and \`MIDDLEWARE[0]\`'s "after" code runs last, closest to the client.

So \`MIDDLEWARE[0]\` (\`SecurityMiddleware\`) is the outermost layer — first to see a request, last to touch a response — and the bottom of the list is closest to the view.

## Ordering rules that matter

- **\`SessionMiddleware\` before \`AuthenticationMiddleware\`.** Auth reads \`request.session\` to find the user id. Reverse them and \`request.user\` breaks.
- **\`SessionMiddleware\` before \`MessageMiddleware\`** (default message storage uses the session).
- **\`CsrfViewMiddleware\` before your views** but its check happens in \`process_view\`, so its list position mainly affects which other middleware run before the CSRF rejection.
- **\`GZipMiddleware\` near the top** (so it compresses the final response) — but only enable it when you understand the BREACH-attack tradeoff for authenticated pages.
- **\`SecurityMiddleware\` first** so its redirect-to-HTTPS happens before anything else does work.
- Your custom middleware usually goes **after** the built-ins, so \`request.user\` and \`request.session\` are available to it.

\`python manage.py check\` warns about several known-bad orderings.

## The optional hooks

Beyond \`__call__\`, a middleware may define:

- **\`process_view(request, view_func, view_args, view_kwargs)\`** — called after URL resolution, before the view. Has access to which view will run. Return \`None\` to continue, or an \`HttpResponse\` to short-circuit. Used for per-view auth/permission checks, rate limiting keyed on the view, feature gating.
- **\`process_exception(request, exception)\`** — called if the view (or a later middleware) raises. Return an \`HttpResponse\` to handle it, or \`None\` to let Django's default handling (500 / \`Http404\` mapping) proceed. Used for turning domain exceptions into JSON error responses, Sentry breadcrumbs, etc.
- **\`process_template_response(request, response)\`** — called when the view returns a \`TemplateResponse\` (render not yet run). Return a (possibly modified) response. Used to inject context or swap templates.

\`process_view\` and \`process_exception\` run in **reverse** \`MIDDLEWARE\` order (like the response path).

## Short-circuiting

Any middleware can return a response from \`__call__\` (or \`process_view\`) *without* calling \`get_response\`. The view and every inner middleware are skipped; the response then flows out through the middleware **above** this one only. This is how maintenance mode, IP allowlists, global auth walls, and \`Host\`/method rejections work.

\`\`\`python
def __call__(self, request):
    if request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip() not in ALLOWED_IPS:
        return HttpResponseForbidden("nope")     # short-circuit
    return self.get_response(request)
\`\`\`

## Function-style middleware

For simple cases:

\`\`\`python
def timing_middleware(get_response):
    def middleware(request):
        start = time.perf_counter()
        response = get_response(request)
        response["X-Response-Time-ms"] = f"{(time.perf_counter() - start) * 1000:.1f}"
        return response
    return middleware
\`\`\`

## Async middleware

If your app is ASGI, a middleware can be async. Mark compatibility with \`django.utils.decorators.sync_and_async_middleware\`, or provide an async \`__call__\`. Django adapts sync middleware to async contexts automatically (with a thread-pool hop), so mixed stacks work but pure-async is faster. Module 10 covers async.`,

    contentHi: `## Modern middleware contract

Django 1.10 se ek middleware koi bhi callable hai jо, ek \`get_response\` callable diye, ek callable lautाता hai jо ek \`request\` leता hai aur ek \`response\` lautाता hai. Class form:

\`\`\`python
class XMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # ek-baar configuration, startup par chalती hai

    def __call__(self, request):
        # PEHLE: andar jaते waqt chalता hai, MIDDLEWARE kram mein
        response = self.get_response(request)
        # BAAD: bahar jaते waqt chalता hai, ULTA MIDDLEWARE kram mein
        return response
\`\`\`

\`get_response\` agले middleware ka \`__call__\` hai — ya, andaruni middleware ke liye, view. Har middleware instance startup par **ek baar** banता hai; \`__call__\` **prati request** chalता hai. \`self\` par request state store mat karो.

## Onion, theek se

\`MIDDLEWARE\` ek list hai. **Andar** jaते waqt, Django unhe upar se neeche call karता hai. **Bahar** jaते waqt, responses neeche se upar unwind hote hain: view ka response aakhri middleware ke "after" code ko pehle lautता hai, aur \`MIDDLEWARE[0]\` ka "after" code aakhri chalता hai, client ke sabse kareeb.

Toh \`MIDDLEWARE[0]\` (\`SecurityMiddleware\`) sabse bahari layer hai — ek request dekhने waali pehli, ek response chhoone waali aakhri.

## Ordering niyam jо maayne rakhते hain

- **\`SessionMiddleware\` \`AuthenticationMiddleware\` se pehle.** Auth user id dhoondhने ke liye \`request.session\` padhता hai. Ulta karो aur \`request.user\` toot jाता hai.
- **\`SessionMiddleware\` \`MessageMiddleware\` se pehle** (default message storage session istemal karта hai).
- **\`GZipMiddleware\` upar ke paas** — par ise sirf tab enable karो jab aap authenticated pages ke liye BREACH-attack tradeoff samajhते ho.
- **\`SecurityMiddleware\` pehला** taaki iska redirect-to-HTTPS kisi aur ke kaam karne se pehle ho.
- Aapka custom middleware aamताur par built-ins ke **baad** jाता hai, taaki \`request.user\` aur \`request.session\` ise available hon.

\`python manage.py check\` kai jaane-mane galat orderings ke baare mein warn karता hai.

## Optional hooks

- **\`process_view(request, view_func, view_args, view_kwargs)\`** — URL resolution ke baad, view se pehle. \`None\` continue karने ko, ya ek \`HttpResponse\` short-circuit karने ko.
- **\`process_exception(request, exception)\`** — agar view raise karता hai. Ek \`HttpResponse\` ise handle karने ko, ya \`None\` Django ki default handling ko.
- **\`process_template_response(request, response)\`** — jab view ek \`TemplateResponse\` lautाता hai.

\`process_view\` aur \`process_exception\` **ulta** \`MIDDLEWARE\` kram mein chalते hain.

## Short-circuiting

Koi bhi middleware \`__call__\` se ek response lautा sakta hai *bina* \`get_response\` call kiye. View aur har andaruni middleware skip hote hain. Aise maintenance mode, IP allowlists, global auth walls kaam karते hain.

## Function-style middleware

\`\`\`python
def timing_middleware(get_response):
    def middleware(request):
        start = time.perf_counter()
        response = get_response(request)
        response["X-Response-Time-ms"] = f"{(time.perf_counter() - start) * 1000:.1f}"
        return response
    return middleware
\`\`\``,

    examples: [
      {
        title: 'The onion: request top-down, response bottom-up',
        titleHi: 'Onion: request upar-neeche, response neeche-upar',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], USE_TZ=True,
    MIDDLEWARE=["__main__.Outer", "__main__.Middle", "__main__.Inner"])
django.setup()

from django.http import HttpResponse
from django.urls import path
from django.test import Client

trace = []

def make(label):
    class M:
        def __init__(self, get_response): self.get_response = get_response
        def __call__(self, request):
            trace.append(f"{label}: before")
            response = self.get_response(request)
            trace.append(f"{label}: after")
            response[f"X-{label}"] = "seen"
            return response
    M.__name__ = label
    return M

Outer, Middle, Inner = make("Outer"), make("Middle"), make("Inner")

def view(request):
    trace.append("VIEW")
    return HttpResponse("ok")

urlpatterns = [path("", view)]

resp = Client().get("/")
for step in trace:
    print(step)
print("headers set:", [h for h in resp.headers if h.startswith("X-")])`,
        output: `Outer: before
Middle: before
Inner: before
VIEW
Inner: after
Middle: after
Outer: after
headers set: ['X-Inner', 'X-Middle', 'X-Outer']
`,
        explain: 'With `MIDDLEWARE = ["Outer", "Middle", "Inner"]`, the "before" code runs in list order (Outer, Middle, Inner) then the view, then the "after" code unwinds in reverse (Inner, Middle, Outer). Because each middleware sets its header in its "after" block, the headers land in that unwind order — `X-Inner` first, `X-Outer` last. `Outer` is the outermost layer: first to inspect the request, last to touch the response before it goes to the client. This is why `SecurityMiddleware` is at index 0 — its HTTPS redirect and security headers wrap everything — and why your custom middleware usually goes last, where `request.user` is already populated.',
        explainHi: '`MIDDLEWARE = ["Outer", "Middle", "Inner"]` ke saath, "before" code list kram mein chalता hai (Outer, Middle, Inner) phir view, phir "after" code ulta unwind hoता hai (Inner, Middle, Outer). `Outer` sabse bahari layer hai: request inspect karne waali pehli, client ko jaने se pehle response chhoone waali aakhri. Isiliye `SecurityMiddleware` index 0 par hai.',
      },
      {
        title: 'Short-circuiting: a maintenance-mode middleware',
        titleHi: 'Short-circuiting: ek maintenance-mode middleware',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], USE_TZ=True, MAINTENANCE_MODE=True,
    MIDDLEWARE=["__main__.MaintenanceMiddleware"])
django.setup()

from django.conf import settings as s
from django.http import HttpResponse
from django.urls import path
from django.test import Client

view_ran = {"count": 0}

class MaintenanceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        if getattr(s, "MAINTENANCE_MODE", False) and not request.path.startswith("/health"):
            return HttpResponse("Down for maintenance", status=503,
                                headers={"Retry-After": "3600"})
        return self.get_response(request)

def home(request):
    view_ran["count"] += 1
    return HttpResponse("home")

def health(request):
    return HttpResponse("ok")

urlpatterns = [path("", home), path("health/", health)]

c = Client()
r1 = c.get("/")
r2 = c.get("/health/")
print("/ ->", r1.status_code, "| Retry-After:", r1.headers.get("Retry-After"))
print("/health/ ->", r2.status_code, r2.content.decode())
print("home view executed:", view_ran["count"], "times")`,
        output: `/ -> 503 | Retry-After: 3600
/health/ -> 200 ok
home view executed: 0 times
`,
        explain: 'When `MAINTENANCE_MODE` is on, the middleware returns a `503` from `__call__` *without* calling `self.get_response(request)`, so the URL resolver and the `home` view never run (`view_ran["count"]` stays 0). The `/health/` path is exempted so load balancers and uptime checks still get a 200. Short-circuiting in middleware is how you implement cross-cutting gates — maintenance mode, global auth walls, IP allowlists, kill switches — in one place instead of at the top of every view.',
        explainHi: 'Jab `MAINTENANCE_MODE` on hai, middleware `__call__` se ek `503` lautाता hai *bina* `self.get_response(request)` call kiye, toh URL resolver aur `home` view kabhi nahi chalते. `/health/` path chhoot gaya hai taaki load balancers abhi bhi 200 paayें. Middleware mein short-circuiting aise aap cross-cutting gates implement karते ho ek jagah, har view ke top par nahi.',
      },
      {
        title: 'process_exception turns a domain error into a JSON response',
        titleHi: 'process_exception ek domain error ko JSON response mein badalता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=False, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], USE_TZ=True, MIDDLEWARE=["__main__.ApiErrorMiddleware"])
django.setup()

from django.http import JsonResponse, HttpResponse
from django.urls import path
from django.test import Client

class RateLimitExceeded(Exception):
    def __init__(self, retry_after): self.retry_after = retry_after

class ApiErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        return self.get_response(request)
    def process_exception(self, request, exception):
        if isinstance(exception, RateLimitExceeded):
            return JsonResponse({"error": "rate_limited"}, status=429,
                                headers={"Retry-After": str(exception.retry_after)})
        return None   # anything else -> Django's normal 500 handling

def limited(request):
    raise RateLimitExceeded(retry_after=30)

def broken(request):
    raise ValueError("a real bug")

def fine(request):
    return HttpResponse("ok")

urlpatterns = [path("limited/", limited), path("broken/", broken), path("fine/", fine)]

c = Client(raise_request_exception=False)
r1 = c.get("/limited/")
print("/limited/ ->", r1.status_code, r1.json(), "Retry-After:", r1.headers.get("Retry-After"))
print("/broken/  ->", c.get("/broken/").status_code, "(process_exception returned None)")
print("/fine/    ->", c.get("/fine/").status_code)`,
        output: `/limited/ -> 429 {'error': 'rate_limited'} Retry-After: 30
/broken/  -> 500 (process_exception returned None)
/fine/    -> 200
`,
        explain: '`process_exception` is called whenever a view raises. Here it recognises the app\'s `RateLimitExceeded` and converts it into a clean `429` JSON response with a `Retry-After` header — so views can just `raise RateLimitExceeded(...)` and never build error responses themselves. Returning `None` for any other exception (`ValueError`) hands control back to Django, which produces the normal logged 500. This is the standard pattern for consistent API error shapes; DRF has its own exception handler that does the same job (Module 5).',
        explainHi: '`process_exception` tab call hoता hai jab ek view raise karता hai. Yahaan ye app ke `RateLimitExceeded` ko pehchानता hai aur ise ek saaf `429` JSON response mein badalता hai ek `Retry-After` header ke saath — toh views bस `raise RateLimitExceeded(...)` kar sakte hain aur kabhi error responses khud nahi banाते. Kisi doosre exception ke liye `None` return karna control Django ko wapas deता hai. Ye consistent API error shapes ke liye standard pattern hai.',
      },
    ],

    mistakes: [
      {
        wrong: `MIDDLEWARE = [
    "django.contrib.auth.middleware.AuthenticationMiddleware",  # BEFORE sessions
    "django.contrib.sessions.middleware.SessionMiddleware",
    ...
]`,
        right: `MIDDLEWARE = [
    "django.contrib.sessions.middleware.SessionMiddleware",     # FIRST
    "django.contrib.auth.middleware.AuthenticationMiddleware",  # then auth (reads the session)
    ...
]`,
        why: '`AuthenticationMiddleware` populates `request.user` by reading the logged-in user id out of `request.session` — which only exists after `SessionMiddleware` has run. Put auth first and `request.user` is either missing or always `AnonymousUser`, silently breaking every login-gated view and permission check. `python manage.py check` flags this exact ordering.',
        whyHi: '`AuthenticationMiddleware` `request.user` ko `request.session` se logged-in user id padhकर bharता hai — jо sirf `SessionMiddleware` ke chalne ke baad maujूd hai. Auth pehle rakhो aur `request.user` ya toh missing hai ya hamesha `AnonymousUser`, chupchaap har login-gated view todता hai. `python manage.py check` isi ordering ko flag karता hai.',
      },
      {
        wrong: `class CounterMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.request_count = 0
    def __call__(self, request):
        self.request_count += 1               # shared mutable state on the instance
        request.count = self.request_count    # race under threads/async
        return self.get_response(request)`,
        right: `class RequestIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response      # config only -- no per-request state
    def __call__(self, request):
        request.id = uuid.uuid4().hex         # attach to the request, which IS per-request
        return self.get_response(request)`,
        why: 'A middleware instance is created once and shared across all requests, which under a threaded or async server run concurrently. Mutable counters or caches on `self` are race conditions and cross-request leaks. Keep `__init__` for configuration only; put per-request data on the `request` object (it is created fresh each time) or in `request`-scoped storage.',
        whyHi: 'Ek middleware instance ek baar banта hai aur saare requests mein share hoता hai, jо ek threaded ya async server ke tahat concurrently chalते hain. `self` par mutable counters race conditions aur cross-request leaks hain. `__init__` ko sirf configuration ke liye rakhо; per-request data `request` object par rakhо.',
      },
      {
        wrong: `# a view-level concern implemented as middleware that runs for EVERY request
class AdminAuditMiddleware:
    def __call__(self, request):
        response = self.get_response(request)
        AuditLog.objects.create(path=request.path, user=request.user)  # a DB write per request!
        return response`,
        right: `# scope it -- only audit what matters, and prefer a signal / decorator for view-specific logic
class AdminAuditMiddleware:
    def __call__(self, request):
        response = self.get_response(request)
        if request.path.startswith("/admin/") and request.method in ("POST", "DELETE"):
            AuditLog.objects.create(path=request.path, user_id=getattr(request.user, "id", None))
        return response`,
        why: 'Middleware runs for *every* request — static assets, health checks, 404s. Unconditional work there (a DB write, an external call, expensive parsing) multiplies your per-request latency and load across the entire site. Scope middleware tightly with path/method guards, and push genuinely view-specific behaviour into decorators, mixins, or signals that only fire where needed.',
        whyHi: 'Middleware *har* request ke liye chalता hai — static assets, health checks, 404s. Wahaan unconditional kaam (ek DB write, ek external call) aapki per-request latency ko poore site par multiply karता hai. Middleware ko path/method guards se tightly scope karो, aur genuinely view-specific behaviour ko decorators ya signals mein daalो.',
      },
    ],

    realWorld: [
      {
        en: '**Request-ID / correlation-ID middleware is nearly universal** — attach a UUID (or read an inbound `X-Request-Id`) onto `request`, add it to a logging filter so every log line for that request carries it, and echo it in the response header. Makes tracing one request across logs and services possible.',
        hi: '**Request-ID / correlation-ID middleware lगbhag universal hai** — `request` par ek UUID attach karो, ise ek logging filter mein add karो taaki us request ki har log line ise le jाए, aur ise response header mein echo karो. Ek request ko logs ke paar trace karna sambhav banाता hai.',
      },
      {
        en: '**Cross-cutting gates live in middleware**: maintenance mode, IP allowlists for admin, a global "login required except these paths" wall, tenant resolution on multi-tenant apps (`request.tenant` from the subdomain), and forcing `Cache-Control: no-store` on authenticated responses. One place, applied everywhere, testable in isolation.',
        hi: '**Cross-cutting gates middleware mein rehते hain**: maintenance mode, admin ke liye IP allowlists, ek global "login required except these paths" wall, multi-tenant apps par tenant resolution (`request.tenant` subdomain se), aur authenticated responses par `Cache-Control: no-store` force karna. Ek jagah, har jagah lागू.',
      },
      {
        en: '**Observability middleware wraps the stack**: Sentry\'s and Datadog\'s SDKs install middleware that starts a transaction/span per request and captures unhandled exceptions with request context. `django-prometheus` middleware exports per-view latency and status-code counters. These go high in the list so they see the whole request.',
        hi: '**Observability middleware stack ko wrap karता hai**: Sentry aur Datadog ke SDKs middleware install karते hain jо prati request ek transaction shuru karता hai aur unhandled exceptions capture karता hai. `django-prometheus` middleware per-view latency export karता hai. Ye list mein upar jaते hain taaki wo poori request dekhें.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the middleware execution order and why the position of a middleware in `MIDDLEWARE` matters.',
        qHi: 'Middleware execution order samjhाओ aur `MIDDLEWARE` mein ek middleware ki position kyun maayne rakhती hai.',
        a: 'MIDDLEWARE is an ordered list, and Django composes it into nested layers around the view, like an onion. On the way in, when a request arrives, Django runs the middlewares top to bottom: the "before" portion of index zero first, then index one, and so on, until it reaches the view. On the way out, the response unwinds in the opposite direction: the view returns to the "after" portion of the last middleware first, and index zero\'s "after" code runs last, immediately before the response goes to the client. So the first item in the list is the outermost layer — first to see the request, last to touch the response — and the last item is closest to the view. Position matters for two reasons. First, dependencies: some middleware needs what an earlier one produced. AuthenticationMiddleware reads request dot session to look up the user, so SessionMiddleware must come before it; put them the wrong way round and request dot user is broken across the whole app. MessageMiddleware similarly depends on the session by default. Second, scope of effect: SecurityMiddleware is first so its HTTPS redirect and security headers wrap everything, including responses generated by other middleware short-circuiting. GZipMiddleware belongs near the top so it compresses the fully assembled response. Your own middleware usually goes after the built-ins so request dot user and request dot session are already populated when it runs. Also, a middleware can short-circuit by returning a response without calling get_response, in which case the view and all inner middleware are skipped and the response only flows back out through the middleware above it — so the earlier a gate like maintenance mode or an IP allowlist sits, the less work happens before it rejects a request. Django\'s system check warns about several known-bad orderings.',
        aHi: 'MIDDLEWARE ek ordered list hai, aur Django ise view ke aas-paas nested layers mein compose karता hai, ek onion ki tarah. Andar jaते waqt, Django middlewares ko upar se neeche chalाता hai: index zero ka "before" hissa pehle, phir index one, aur aage, jab tak ye view tak nahi pahुँchता. Bahar jaते waqt, response ulti disha mein unwind hoता hai: view aakhri middleware ke "after" hisse ko pehle lautता hai, aur index zero ka "after" code aakhri chalता hai. Toh list ka pehला item sabse bahari layer hai. Position do kaarणों se maayne rakhती hai. Pehla, dependencies: kuch middleware ko wo chahिए jо ek pehle waale ne banाya. AuthenticationMiddleware user dhoondhने ke liye request dot session padhता hai, toh SessionMiddleware ise se pehle aana chahiye. Doosra, scope of effect: SecurityMiddleware pehला hai taaki iska HTTPS redirect sab kuch wrap kare. Aapka apna middleware aamताur par built-ins ke baad jाता hai.',
      },
      {
        q: 'When would you write custom middleware versus a decorator, a mixin, or a signal?',
        qHi: 'Aap custom middleware kab likhोge versus ek decorator, ek mixin, ya ek signal?',
        a: 'The deciding question is scope. Middleware runs for every request that reaches the application, before URL resolution in the request phase and after the view in the response phase. So middleware is the right tool for genuinely cross-cutting concerns that apply site-wide and are not tied to a particular view: attaching a request or correlation ID and wiring it into logging, resolving the tenant from the subdomain onto the request, a maintenance-mode or global-login gate, an IP allowlist for a whole environment, adding or normalising response headers like cache-control on authenticated responses, starting an observability span per request, and translating a category of exceptions into a consistent error response via process_exception. If the behaviour only applies to some views, middleware is the wrong layer because it still executes for all the others — static files, health checks, unrelated endpoints — and you pay that cost everywhere. For view-specific behaviour you use a decorator on function views or a mixin on class-based views: login_required, permission_required, a custom throttle, cache_page, requiring a specific header. These are opt-in per view and self-documenting at the view definition. For reacting to model changes — send an email when an order is created, invalidate a cache when a record is saved, write an audit row on delete — you use signals like post_save and post_delete, or better, override the model\'s save method or put the logic in a service function, because signals can make control flow hard to follow. And for logic that belongs to the request/response boundary but only for a subset, process_view in a middleware can inspect which view is about to run and act conditionally, which is a middle ground. The general principle: middleware for site-wide request/response concerns, decorators and mixins for per-view concerns, signals or explicit calls for data-layer reactions.',
        aHi: 'Faisla karने waala sawaal scope hai. Middleware har request ke liye chalता hai jо application tak pahुँchती hai, request phase mein URL resolution se pehle aur response phase mein view ke baad. Toh middleware genuinely cross-cutting concerns ke liye sahi tool hai jо site-wide lागू hote hain: ek request ID attach karna aur logging mein wire karna, subdomain se tenant resolve karna, ek maintenance-mode gate, ek poore environment ke liye ek IP allowlist, response headers add karna, prati request ek observability span shuru karna, aur process_exception ke zariye exceptions ki ek category ko ek consistent error response mein badalना. Agar behaviour sirf kuch views par lागू hoता hai, middleware galat layer hai kyunki ye abhi bhi baaki sab ke liye execute hoता hai. View-specific behaviour ke liye aap function views par ek decorator ya class-based views par ek mixin istemal karते ho. Model changes par react karने ke liye aap post_save jaisे signals istemal karते ho, ya behtar, model ki save method override karते ho.',
      },
    ],

    exercises: [
      {
        task: 'Configure Django with three middleware classes `A`, `B`, `C` (in that `MIDDLEWARE` order), each appending `"{name} in"` / `"{name} out"` to a shared `trace` list around `get_response`, and a view appending `"view"`. GET `/` with `django.test.Client` and print `trace`. Confirm it is `A in, B in, C in, view, C out, B out, A out`.',
        taskHi: 'Django ko teen middleware classes `A`, `B`, `C` (us `MIDDLEWARE` kram mein) ke saath configure karो, har ek `get_response` ke aas-paas ek shared `trace` list mein `"{name} in"` / `"{name} out"` append kare, aur ek view `"view"` append kare. `/` GET karो aur `trace` print karो.',
        hint: 'A factory function that returns a class with `label` closed over keeps it DRY. The "in" append is before `self.get_response(request)`, the "out" append is after. `MIDDLEWARE=["__main__.A", "__main__.B", "__main__.C"]`.',
        hintHi: 'Ek factory function jо `label` closed over ke saath ek class lautae ise DRY rakhता hai. "in" append `self.get_response(request)` se pehle, "out" append baad mein.',
      },
      {
        task: 'Write `BlocklistMiddleware` that short-circuits with `HttpResponseForbidden("blocked")` (403) when `request.headers.get("X-Client-Id")` is in a set `{"bad-1", "bad-2"}`, otherwise calls the view. Wire one view returning 200. With `Client`, send requests with client ids `"good"`, `"bad-1"`, and none, and print the status for each. Track whether the view ran.',
        taskHi: '`BlocklistMiddleware` likhо jо `HttpResponseForbidden("blocked")` (403) se short-circuit kare jab `request.headers.get("X-Client-Id")` ek set `{"bad-1", "bad-2"}` mein ho, warna view call kare. Ek view banाओ jо 200 lautае. `"good"`, `"bad-1"`, aur koi nahi ke saath requests bhejो.',
        hint: '`Client().get("/", HTTP_X_CLIENT_ID="bad-1")` sets the header. In the middleware: `if request.headers.get("X-Client-Id") in BLOCKED: return HttpResponseForbidden("blocked")`. Increment a module-level counter in the view to prove it did/did not run.',
        hintHi: '`Client().get("/", HTTP_X_CLIENT_ID="bad-1")` header set karता hai. Middleware mein: `if request.headers.get("X-Client-Id") in BLOCKED: return HttpResponseForbidden(...)`.',
      },
      {
        task: 'Write `ErrorEnvelopeMiddleware` with a `process_exception(request, exception)` that, for a custom `NotFoundError`, returns `JsonResponse({"detail": str(exception)}, status=404)`, and returns `None` for everything else. Wire views that raise `NotFoundError("gone")` and `RuntimeError("boom")`. With `Client(raise_request_exception=False)` and `DEBUG=False`, assert the first is 404 with a JSON body and the second is 500.',
        taskHi: '`ErrorEnvelopeMiddleware` likhо ek `process_exception(request, exception)` ke saath jо, ek custom `NotFoundError` ke liye, `JsonResponse({"detail": str(exception)}, status=404)` lautае, aur baaki sab ke liye `None`. Views banाओ jо `NotFoundError("gone")` aur `RuntimeError("boom")` raise karें.',
        hint: '`process_exception` is a method alongside `__call__` (which just does `return self.get_response(request)`). `isinstance(exception, NotFoundError)` -> the JSON response; else `return None` to fall through to Django\'s 500 handling.',
        hintHi: '`process_exception` `__call__` ke saath ek method hai. `isinstance(exception, NotFoundError)` -> JSON response; warna `return None` Django ki 500 handling ke liye.',
      },
    ],

    keyTakeaways: [
      'A middleware is a callable: `__init__(self, get_response)` runs ONCE at startup (config only); `__call__(self, request)` runs PER REQUEST, doing "before" work, calling `self.get_response(request)`, then "after" work, returning the response.',
      'The onion: request flows through `MIDDLEWARE` TOP -> BOTTOM, response unwinds BOTTOM -> TOP. `MIDDLEWARE[0]` is outermost (first to see the request, last to touch the response).',
      'Ordering is load-bearing: `SessionMiddleware` BEFORE `AuthenticationMiddleware` (auth reads the session) and before `MessageMiddleware`; `SecurityMiddleware` first; your middleware usually last so `request.user`/`.session` exist. `manage.py check` warns on known-bad orders.',
      'Short-circuit by returning a response from `__call__` (or `process_view`) WITHOUT calling `get_response` — the view and inner middleware are skipped. This is maintenance mode, IP allowlists, global auth walls.',
      'Optional hooks: `process_view(request, view_func, args, kwargs)` (after resolution, before view), `process_exception(request, exception)` (view raised — return a response or `None`), `process_template_response`. These run in REVERSE `MIDDLEWARE` order.',
      'NEVER store per-request state on `self` — the instance is shared across concurrent requests. Attach per-request data to the `request` object.',
      'Middleware runs for EVERY request (static, health checks, 404s). Guard any real work (DB writes, external calls) with path/method checks; push view-specific logic into decorators/mixins and data reactions into signals.',
      'Built-in stack: `SecurityMiddleware` (HTTPS/HSTS/headers), `SessionMiddleware`, `CommonMiddleware` (APPEND_SLASH/ETag), `CsrfViewMiddleware`, `AuthenticationMiddleware`, `MessageMiddleware`, `XFrameOptionsMiddleware`. `GZipMiddleware` is opt-in (BREACH tradeoff).',
    ],
    keyTakeawaysHi: [
      'Ek middleware ek callable hai: `__init__(self, get_response)` startup par EK BAAR chalता hai (sirf config); `__call__(self, request)` PRATI REQUEST chalता hai, "before" kaam karके, `self.get_response(request)` call karके, phir "after" kaam.',
      'Onion: request `MIDDLEWARE` se UPAR -> NEECHE bahता hai, response NEECHE -> UPAR unwind hoता hai. `MIDDLEWARE[0]` sabse bahari hai.',
      'Ordering load-bearing hai: `SessionMiddleware` `AuthenticationMiddleware` se PEHLE aur `MessageMiddleware` se pehle; `SecurityMiddleware` pehला; aapka middleware aamताur par aakhri. `manage.py check` galat orders par warn karता hai.',
      '`__call__` (ya `process_view`) se ek response return karके short-circuit karो BINA `get_response` call kiye — view aur andaruni middleware skip hote hain. Ye maintenance mode, IP allowlists hai.',
      'Optional hooks: `process_view`, `process_exception` (view ne raise kiya — ek response ya `None` return karो), `process_template_response`. Ye ULTA `MIDDLEWARE` kram mein chalते hain.',
      '`self` par per-request state KABHI store mat karो — instance concurrent requests mein share hoता hai. Per-request data `request` object par attach karो.',
      'Middleware HAR request ke liye chalता hai (static, health checks, 404s). Kisi asli kaam ko path/method checks se guard karो; view-specific logic decorators/mixins mein aur data reactions signals mein daalो.',
      'Built-in stack: `SecurityMiddleware`, `SessionMiddleware`, `CommonMiddleware`, `CsrfViewMiddleware`, `AuthenticationMiddleware`, `MessageMiddleware`, `XFrameOptionsMiddleware`. `GZipMiddleware` opt-in hai.',
    ],
  },

  {
    slug: 'dj-management-commands-and-shell',
    title: 'Management Commands & the Shell: Scripting Your Project',
    titleHi: 'Management Commands Aur Shell: Apne Project Ko Script Karna',
    description: 'Everything you do to a Django project — migrate, create a superuser, load fixtures — is a management command. Writing your own is how you build data backfills, nightly jobs, one-off maintenance scripts and CLI tools that run with your full project configured.',
    descriptionHi: 'Jо kuch aap ek Django project ke saath karते ho — migrate, superuser banाना, fixtures load karna — ek management command hai. Apne khud ke likhna aise aap data backfills, nightly jobs, one-off maintenance scripts aur CLI tools banाते ho jо aapke poore project configured ke saath chalते hain.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 6,

    analogy: {
      en: '**The building\'s service elevator and its logbook of standard procedures.** The public lifts (your views, your API) are for visitors doing normal things. The service elevator (`manage.py`) is for staff, and it opens onto the machine floors — the database, the cache, the file store — with the building\'s full wiring diagram already loaded. Bolted to its wall is a binder of laminated procedure cards: "run migrations", "rebuild the search index", "email everyone whose trial expires tomorrow", "recompute yesterday\'s totals". Each card is a management command: a small, named, repeatable script that anyone on the team can run the same way, that CI and cron can run unattended, that takes typed arguments, and that has access to everything the app has because it boots the app first. `manage.py shell` is the same elevator with no procedure card — it just drops you on the machine floor with a Python prompt and your models imported, for exploring and one-off surgery.',
      hi: '**Building ka service elevator aur standard procedures ka iska logbook.** Public lifts (aapke views, aapki API) visitors ke liye hain jо normal cheezein kar rahe hain. Service elevator (`manage.py`) staff ke liye hai, aur ye machine floors par khulता hai — database, cache, file store — building ka poora wiring diagram pehle se loaded ke saath. Iski deewar par bolted ek binder hai laminated procedure cards ka: "migrations chalाओ", "search index rebuild karो", "har us vyakti ko email karो jiska trial kal expire hoता hai". Har card ek management command hai: ek chhota, named, repeatable script jise team par koi bhi usi tarah chalा sakta hai, jise CI aur cron unattended chalा sakte hain, jо typed arguments leता hai. `manage.py shell` bina procedure card ke wahi elevator hai — ye bस aapko machine floor par ek Python prompt aur aapke models imported ke saath chhodता hai.',
    },

    simple: `**Anatomy of a custom command**

\`\`\`
myapp/
  management/
    __init__.py
    commands/
      __init__.py
      send_reminders.py      # -> python manage.py send_reminders
\`\`\`

\`\`\`python
# myapp/management/commands/send_reminders.py
from django.core.management.base import BaseCommand, CommandError
from myapp.models import Subscription

class Command(BaseCommand):
    help = "Email users whose subscription renews within N days"

    def add_arguments(self, parser):
        parser.add_argument("--days", type=int, default=3)
        parser.add_argument("--dry-run", action="store_true")

    def handle(self, *args, **options):
        days = options["days"]
        due = Subscription.objects.renewing_within(days)
        self.stdout.write(f"{due.count()} subscriptions due in {days} days")
        for sub in due.iterator():
            if options["dry_run"]:
                self.stdout.write(f"  would email {sub.user.email}")
            else:
                sub.send_renewal_reminder()
        self.stdout.write(self.style.SUCCESS("done"))
\`\`\`

\`\`\`bash
python manage.py send_reminders --days 7 --dry-run
python manage.py send_reminders --help
\`\`\`

**Running commands from code**

\`\`\`python
from django.core.management import call_command

call_command("migrate", verbosity=0)
call_command("send_reminders", days=7, dry_run=True)
call_command("loaddata", "initial_data.json")
\`\`\`

**The shell**

\`\`\`bash
python manage.py shell           # plain REPL, Django configured
python manage.py shell -c "from myapp.models import User; print(User.objects.count())"
python manage.py shell_plus      # (django-extensions) auto-imports all models
python manage.py dbshell         # the database's own CLI (psql, etc.)
\`\`\`

**Common built-in commands**

\`\`\`
migrate / makemigrations / showmigrations / sqlmigrate
createsuperuser / changepassword
dumpdata / loaddata                  fixtures (JSON/YAML)
collectstatic                        gather static files for deploy
shell / dbshell / shell_plus
check / check --deploy
test
sendtestemail / clearsessions / createcachetable
\`\`\`

\`\`\`
BaseCommand:
  help = "..."                          shown in  manage.py <cmd> --help
  add_arguments(self, parser)           argparse -- parser.add_argument(...)
  handle(self, *args, **options)        the body; options is a dict of parsed args
  self.stdout.write(...) / self.stderr.write(...)     NOT print()
  self.style.SUCCESS / WARNING / ERROR / NOTICE       coloured output
  raise CommandError("msg")             clean non-zero exit, no traceback
  @transaction.atomic on handle, or  self.handle = transaction.atomic(...)   for all-or-nothing
\`\`\``,

    simpleHi: `**Ek custom command ki anatomy**

\`\`\`
myapp/
  management/
    __init__.py
    commands/
      __init__.py
      send_reminders.py      # -> python manage.py send_reminders
\`\`\`

\`\`\`python
# myapp/management/commands/send_reminders.py
from django.core.management.base import BaseCommand, CommandError
from myapp.models import Subscription

class Command(BaseCommand):
    help = "Email users whose subscription renews within N days"

    def add_arguments(self, parser):
        parser.add_argument("--days", type=int, default=3)
        parser.add_argument("--dry-run", action="store_true")

    def handle(self, *args, **options):
        days = options["days"]
        due = Subscription.objects.renewing_within(days)
        self.stdout.write(f"{due.count()} subscriptions due in {days} days")
        for sub in due.iterator():
            if options["dry_run"]:
                self.stdout.write(f"  would email {sub.user.email}")
            else:
                sub.send_renewal_reminder()
        self.stdout.write(self.style.SUCCESS("done"))
\`\`\`

\`\`\`bash
python manage.py send_reminders --days 7 --dry-run
\`\`\`

**Code se commands chalाना**

\`\`\`python
from django.core.management import call_command

call_command("migrate", verbosity=0)
call_command("send_reminders", days=7, dry_run=True)
\`\`\`

**Shell**

\`\`\`bash
python manage.py shell           # plain REPL, Django configured
python manage.py shell -c "from myapp.models import User; print(User.objects.count())"
python manage.py shell_plus      # (django-extensions) saare models auto-import
python manage.py dbshell         # database ka apna CLI (psql, etc.)
\`\`\`

**Aam built-in commands**

\`\`\`
migrate / makemigrations / showmigrations / sqlmigrate
createsuperuser / changepassword
dumpdata / loaddata                  fixtures (JSON/YAML)
collectstatic                        deploy ke liye static files
shell / dbshell / shell_plus
check / check --deploy
\`\`\`

\`\`\`
BaseCommand:
  help = "..."                          manage.py <cmd> --help mein dikhta hai
  add_arguments(self, parser)           argparse -- parser.add_argument(...)
  handle(self, *args, **options)        body; options parsed args ka ek dict hai
  self.stdout.write(...) / self.stderr.write(...)     print() NAHI
  self.style.SUCCESS / WARNING / ERROR       coloured output
  raise CommandError("msg")             saaf non-zero exit, koi traceback nahi
  @transaction.atomic on handle          all-or-nothing ke liye
\`\`\``,

    content: `## Why management commands exist

A management command is a Python script that runs **with your Django project fully configured** — settings loaded, apps registered, database connection ready, models importable. That is the value: you get the ORM, your services, your settings, and any third-party integration, for free, in a script that is discoverable (\`manage.py <name>\`), consistent (everyone runs it the same way), and automatable (cron, systemd timers, CI, a Celery task calling \`call_command\`).

Use them for:

- **Data backfills and migrations of data** (not schema — schema is a migration file, but populating a new column from old data is often a command).
- **Scheduled jobs**: send digest emails, expire trials, prune old rows, refresh a materialised view, sync from an external system.
- **One-off maintenance**: recompute a denormalised counter, fix corrupted rows, bulk-anonymise data for a GDPR request.
- **Operational tooling**: a command to grant a user a role, to replay failed webhooks, to export a report.

## Discovery

Django finds commands by looking for a \`management/commands/\` package inside every app in \`INSTALLED_APPS\`. Each \`.py\` file (not starting with \`_\`) that defines a class named \`Command\` subclassing \`BaseCommand\` becomes \`python manage.py <filename>\`. Both \`management/\` and \`management/commands/\` need an \`__init__.py\`.

## The \`BaseCommand\` API

\`\`\`python
class Command(BaseCommand):
    help = "One-line description shown in --help and 'manage.py help'."

    def add_arguments(self, parser):
        # parser is an argparse.ArgumentParser
        parser.add_argument("user_ids", nargs="+", type=int)          # positional, one or more
        parser.add_argument("--since", type=str)                       # optional string
        parser.add_argument("--limit", type=int, default=100)
        parser.add_argument("--dry-run", action="store_true")          # a boolean flag
        parser.add_argument("--format", choices=["csv", "json"], default="csv")

    def handle(self, *args, **options):
        # options is a dict: {"user_ids": [1, 2], "since": None, "limit": 100, "dry_run": False, ...}
        # (argparse converts --dry-run to the key "dry_run")
        if options["limit"] < 1:
            raise CommandError("--limit must be positive")   # -> exit code 1, no traceback
        ...
\`\`\`

**Output**: use \`self.stdout.write(...)\` and \`self.stderr.write(...)\`, not \`print()\` — they respect the \`--verbosity\` level, are captured correctly by \`call_command\`, and can be redirected in tests. \`self.style.SUCCESS("...")\`, \`self.style.WARNING\`, \`self.style.ERROR\`, \`self.style.NOTICE\` add colour when the terminal supports it.

**Errors**: \`raise CommandError("message")\` for expected failures — Django prints the message to stderr and exits non-zero without a traceback. Let unexpected bugs raise normally.

**Built-in options** every command gets: \`--verbosity {0,1,2,3}\`, \`--settings\`, \`--pythonpath\`, \`--traceback\`, \`--no-color\`, \`--skip-checks\`.

## Transactions and long-running commands

By default \`handle\` runs with autocommit. For all-or-nothing behaviour, wrap it:

\`\`\`python
from django.db import transaction

class Command(BaseCommand):
    @transaction.atomic
    def handle(self, *args, **options):
        ...   # any exception rolls back the whole run
\`\`\`

For commands that process millions of rows, do **not** wrap the whole thing in one transaction (it holds locks and bloats the WAL). Instead batch: process N rows, commit, repeat — using \`queryset.iterator(chunk_size=...)\` to avoid loading everything into memory (Module 8), and \`transaction.atomic()\` per batch.

\`\`\`python
def handle(self, *args, **options):
    qs = LegacyRecord.objects.filter(migrated=False)
    batch = []
    for rec in qs.iterator(chunk_size=2000):
        batch.append(transform(rec))
        if len(batch) >= 500:
            with transaction.atomic():
                NewRecord.objects.bulk_create(batch)
            batch.clear()
    if batch:
        with transaction.atomic():
            NewRecord.objects.bulk_create(batch)
\`\`\`

## \`call_command\`

\`\`\`python
from django.core.management import call_command

call_command("collectstatic", interactive=False, verbosity=0)
call_command("send_reminders", "--days", "7")          # args as strings, like the CLI
call_command("send_reminders", days=7, dry_run=True)   # or as kwargs
out = io.StringIO()
call_command("showmigrations", stdout=out)             # capture output
\`\`\`

Used in tests, in deploy scripts, in Celery tasks that need to run a command on a schedule, and to compose commands.

## The shell

- \`python manage.py shell\` — a Python REPL with \`DJANGO_SETTINGS_MODULE\` set and \`django.setup()\` done. Uses IPython/bpython if installed. \`-c "code"\` runs a snippet and exits; \`-i ipython\` forces an interface.
- \`python manage.py shell_plus\` (from \`django-extensions\`) — same, but auto-imports every model and common utilities, and can print the SQL of every query (\`--print-sql\`).
- \`python manage.py dbshell\` — opens the database's native client (\`psql\`, \`mysql\`, \`sqlite3\`) using your \`DATABASES\` credentials. For raw SQL and DBA tasks.

Treat the production shell as surgery: prefer a written, reviewed management command for anything you might do more than once or that changes data.

## Scheduling

Django has no built-in scheduler. Options:

- **System cron / systemd timers** calling \`python manage.py <cmd>\` — simplest, but no retries, no locking, cron's environment.
- **\`django-celery-beat\`** — a database-backed schedule for Celery tasks; a task wraps \`call_command\` or the command's logic. Retries, monitoring, distributed. Module 8.
- **\`django-q2\` / RQ scheduler** — lighter alternatives.

For any cron-driven command, guard against overlapping runs (a lock via \`select_for_update\`, a cache key, or \`flock\`).`,

    contentHi: `## Management commands kyun maujूd hain

Ek management command ek Python script hai jо **aapke Django project ke poori tarah configured** ke saath chalता hai — settings loaded, apps registered, database connection ready, models importable. Yahi value hai: aapko ORM, aapki services, aapki settings muft milती hain, ek script mein jо discoverable (\`manage.py <name>\`), consistent, aur automatable (cron, systemd timers, CI) hai.

Unhe istemal karो:

- **Data backfills** (schema nahi — schema ek migration file hai, par ek naye column ko purane data se bharना aksar ek command hai).
- **Scheduled jobs**: digest emails bhejो, trials expire karो, purani rows prune karो, ek external system se sync karो.
- **One-off maintenance**: ek denormalised counter recompute karो, corrupted rows theek karो.
- **Operational tooling**: ek user ko ek role dene ka command, failed webhooks replay karne ka.

## Discovery

Django commands ko \`INSTALLED_APPS\` mein har app ke andar ek \`management/commands/\` package dhoondhकर paता hai. Har \`.py\` file jо \`Command\` naam ki ek class define karती hai jо \`BaseCommand\` subclass karती hai \`python manage.py <filename>\` ban jाती hai. Dono \`management/\` aur \`management/commands/\` ko ek \`__init__.py\` chahiye.

## \`BaseCommand\` API

\`\`\`python
class Command(BaseCommand):
    help = "..."

    def add_arguments(self, parser):
        parser.add_argument("user_ids", nargs="+", type=int)          # positional
        parser.add_argument("--since", type=str)
        parser.add_argument("--dry-run", action="store_true")          # ek boolean flag

    def handle(self, *args, **options):
        # options ek dict hai (argparse --dry-run ko "dry_run" key mein badalता hai)
        if options["limit"] < 1:
            raise CommandError("--limit must be positive")   # -> exit code 1, koi traceback nahi
\`\`\`

**Output**: \`self.stdout.write(...)\` istemal karो, \`print()\` nahi. \`self.style.SUCCESS(...)\` colour add karता hai.

**Errors**: expected failures ke liye \`raise CommandError("message")\` — Django message stderr par print karता hai aur non-zero exit karता hai bina traceback.

## Transactions aur long-running commands

\`\`\`python
from django.db import transaction

class Command(BaseCommand):
    @transaction.atomic
    def handle(self, *args, **options):
        ...   # koi bhi exception poore run ko roll back karता hai
\`\`\`

Millions rows process karने waale commands ke liye, poori cheez ko ek transaction mein wrap **mat** karो. Batch karो: N rows process karो, commit karो, repeat — \`queryset.iterator(chunk_size=...)\` istemal karके.

## \`call_command\`

\`\`\`python
from django.core.management import call_command

call_command("send_reminders", days=7, dry_run=True)
call_command("showmigrations", stdout=out)             # output capture karो
\`\`\`

## Shell

- \`python manage.py shell\` — ek Python REPL Django configured ke saath.
- \`python manage.py shell_plus\` (\`django-extensions\` se) — saare models auto-import karता hai.
- \`python manage.py dbshell\` — database ka native client (\`psql\`, etc.).

Production shell ko surgery ki tarah treat karो: kisi cheez ke liye jо aap ek baar se zyada kar sakte ho, ek likha, reviewed management command prefer karो.

## Scheduling

Django mein built-in scheduler nahi hai. Options: system cron / systemd timers, \`django-celery-beat\` (Module 8), \`django-q2\` / RQ scheduler. Kisi cron-driven command ke liye, overlapping runs se guard karो (ek lock).`,

    examples: [
      {
        title: 'A BaseCommand with typed arguments and a dry-run flag',
        titleHi: 'Typed arguments aur ek dry-run flag waala ek BaseCommand',
        code: `import django, io
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command

class Task(models.Model):
    title = models.CharField(max_length=100)
    done = models.BooleanField(default=False)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Task)
Task.objects.bulk_create([Task(title=f"T{i}", done=(i % 3 == 0)) for i in range(9)])

class Command(BaseCommand):
    help = "Mark pending tasks done"
    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, default=100)
        parser.add_argument("--dry-run", action="store_true")
    def handle(self, *args, **options):
        if options["limit"] < 1:
            raise CommandError("--limit must be >= 1")
        pending = Task.objects.filter(done=False)[:options["limit"]]
        self.stdout.write(f"pending: {Task.objects.filter(done=False).count()}")
        for t in pending:
            if options["dry_run"]:
                self.stdout.write(f"  would complete: {t.title}")
            else:
                t.done = True
                t.save(update_fields=["done"])
        verb = "would mark" if options["dry_run"] else "marked"
        self.stdout.write(self.style.SUCCESS(f"{verb} {len(pending)} task(s)"))

# register the command under a name for call_command
import sys
sys.modules["__main__"].Command = Command

out = io.StringIO()
call_command(Command(), "--dry-run", "--limit", "3", stdout=out)
print(out.getvalue().rstrip())
print("--- still pending after dry-run:", Task.objects.filter(done=False).count())

out2 = io.StringIO()
call_command(Command(), "--limit", "3", stdout=out2)
print(out2.getvalue().rstrip())
print("--- pending after real run:", Task.objects.filter(done=False).count())`,
        output: `pending: 6
  would complete: T1
  would complete: T2
  would complete: T4
would mark 3 task(s)
--- still pending after dry-run: 6
pending: 6
marked 3 task(s)
--- pending after real run: 3
`,
        explain: '`add_arguments` wires argparse options: `--limit` is a typed int with a default, `--dry-run` is a boolean flag (argparse stores it under the key `dry_run`). `handle` reads them from `options`, validates with `raise CommandError` (a clean non-zero exit, no traceback), writes progress via `self.stdout.write` (not `print`), and uses `self.style.SUCCESS` for the summary. The `--dry-run` pass reports what it *would* do and changes nothing; the real pass marks 3 tasks. In a real project this file lives at `myapp/management/commands/complete_tasks.py` and you run `python manage.py complete_tasks --dry-run`.',
        explainHi: '`add_arguments` argparse options wire karता hai: `--limit` ek typed int ek default ke saath, `--dry-run` ek boolean flag hai (argparse ise `dry_run` key ke tahat store karता hai). `handle` unhe `options` se padhता hai, `raise CommandError` se validate karता hai (ek saaf non-zero exit, koi traceback nahi), `self.stdout.write` se progress likhता hai. `--dry-run` pass report karta hai ki ye kya *karता* aur kuch nahi badalता; asli pass 3 tasks mark karता hai.',
      },
      {
        title: 'Batched backfill: iterator() + atomic() per chunk',
        titleHi: 'Batched backfill: prati chunk iterator() + atomic()',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection, transaction

class Order(models.Model):
    total_cents = models.IntegerField()
    total_dollars = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Order)
Order.objects.bulk_create([Order(total_cents=(i + 1) * 199) for i in range(2500)])

# the backfill logic a management command's handle() would contain:
def backfill(batch_size=500, chunk_size=1000):
    from decimal import Decimal
    qs = Order.objects.filter(total_dollars__isnull=True)
    batches, updated = 0, 0
    buf = []
    for order in qs.iterator(chunk_size=chunk_size):
        order.total_dollars = Decimal(order.total_cents) / 100
        buf.append(order)
        if len(buf) >= batch_size:
            with transaction.atomic():
                Order.objects.bulk_update(buf, ["total_dollars"])
            updated += len(buf); batches += 1; buf = []
    if buf:
        with transaction.atomic():
            Order.objects.bulk_update(buf, ["total_dollars"])
        updated += len(buf); batches += 1
    return batches, updated

b, u = backfill()
print(f"committed {b} batches, {u} rows updated")
print("remaining null:", Order.objects.filter(total_dollars__isnull=True).count())
o = Order.objects.get(pk=1)
print("row 1:", o.total_cents, "cents ->", o.total_dollars, "dollars")`,
        output: `committed 5 batches, 2500 rows updated
remaining null: 0
row 1: 199 cents -> 1.99 dollars
`,
        explain: 'This is the shape of a data backfill command\'s `handle()`. `qs.iterator(chunk_size=1000)` streams rows from the database in chunks instead of loading all 2500 into memory at once (Module 8 covers `iterator()` in depth). Rows are accumulated into a buffer and flushed with `bulk_update` inside a `transaction.atomic()` **per batch** — so a failure loses at most one batch, locks are held briefly, and the transaction log does not balloon. Wrapping the *entire* backfill in one `atomic()` would be the mistake for large tables.',
        explainHi: 'Ye ek data backfill command ke `handle()` ka shape hai. `qs.iterator(chunk_size=1000)` rows ko database se chunks mein stream karता hai bजाय saari 2500 ko ek saath memory mein load kiye. Rows ek buffer mein jama hoती hain aur `bulk_update` se **prati batch** ek `transaction.atomic()` ke andar flush hoती hain — toh ek failure zyada se zyada ek batch khोta hai, locks thodी der hold hote hain. *Poore* backfill ko ek `atomic()` mein wrap karna badे tables ke liye galti hoti.',
      },
      {
        title: 'call_command and capturing output',
        titleHi: 'call_command aur output capture karna',
        code: `import django, io
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "django.contrib.sessions"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.core.management import call_command, get_commands
from django.contrib.auth.models import User

# 1. run a built-in command from code (what deploy scripts / Celery tasks do)
call_command("migrate", run_syncdb=True, verbosity=0)

# 2. capture a command's output instead of printing it
buf = io.StringIO()
call_command("showmigrations", "auth", stdout=buf, no_color=True)
lines = [ln.strip() for ln in buf.getvalue().splitlines() if ln.strip()]
print("captured showmigrations output:", len(lines) > 3, "| first line:", lines[0])

# 3. pass arguments two ways (CLI-style strings OR kwargs)
User.objects.create_user("u1", password="x")
User.objects.create_user("u2", password="x")
User.objects.create_user("u3", password="x")
print("users:", User.objects.count())

# 4. commands are just registered callables
mgmt = get_commands()
print("'migrate' in the registry:", "migrate" in mgmt)
print("'migrate' from a django.core app:", "django.core" in mgmt["migrate"])
print("many commands available:", len(mgmt) > 15)`,
        output: `captured showmigrations output: True | first line: auth
users: 3
'migrate' in the registry: True
'migrate' from a django.core app: True
many commands available: True
`,
        explain: '`call_command("migrate", run_syncdb=True, verbosity=0)` runs a command programmatically — exactly what a deploy script, a test `setUp`, or a Celery beat task does. Passing `stdout=buf` captures the command\'s `self.stdout.write(...)` output into a string instead of the console, which is how you test commands and how a wrapper task can log a command\'s result. `get_commands()` is the registry: every command name mapped to the app that provides it, built-ins and your own alike (the exact provider path and command count vary by Django version).',
        explainHi: '`call_command("migrate", run_syncdb=True, verbosity=0)` ek command ko programmatically chalाता hai — bilkul wo jо ek deploy script, ek test `setUp`, ya ek Celery beat task karता hai. `stdout=buf` pass karna command ke `self.stdout.write(...)` output ko console ke bजाy ek string mein capture karता hai — aise aap commands test karते ho. `get_commands()` registry hai: har command naam us app se mapped jо ise provide karती hai (exact provider path aur command count Django version se alag hote hain).',
      },
    ],

    mistakes: [
      {
        wrong: `class Command(BaseCommand):
    def handle(self, *args, **options):
        print("Starting backfill...")            # print()
        for row in Legacy.objects.all():         # loads the whole table into memory
            row.migrate()
        print("Done")`,
        right: `class Command(BaseCommand):
    def handle(self, *args, **options):
        self.stdout.write("Starting backfill...")           # respects --verbosity, testable
        qs = Legacy.objects.filter(migrated=False)
        for row in qs.iterator(chunk_size=2000):            # streamed, not all in memory
            row.migrate()
        self.stdout.write(self.style.SUCCESS("Done"))`,
        why: '`print()` bypasses the `--verbosity` control, is not captured by `call_command(stdout=...)` (breaking tests), and does not get the styling helpers. `Model.objects.all()` in a command that runs against production data pulls every row into a Python list — fine for hundreds, an OOM for millions. Use `self.stdout.write` for output and `.iterator(chunk_size=...)` (or explicit slicing) to stream large querysets.',
        whyHi: '`print()` `--verbosity` control bypass karता hai, `call_command(stdout=...)` dwara capture nahi hoता (tests todता hai). Ek command mein `Model.objects.all()` jо production data ke khilaaf chalता hai har row ko ek Python list mein khींchता hai — sau ke liye theek, millions ke liye ek OOM. Output ke liye `self.stdout.write` aur bade querysets stream karने ke liye `.iterator(chunk_size=...)` istemal karो.',
      },
      {
        wrong: `class Command(BaseCommand):
    @transaction.atomic
    def handle(self, *args, **options):
        for record in HugeTable.objects.all():   # millions of rows
            record.recompute()
            record.save()
        # one giant transaction: holds locks for an hour, bloats the WAL, all-or-nothing`,
        right: `class Command(BaseCommand):
    def handle(self, *args, **options):
        qs = HugeTable.objects.filter(needs_recompute=True)
        for record in qs.iterator(chunk_size=2000):
            with transaction.atomic():            # one small transaction per row (or per batch)
                record.recompute()
                record.save(update_fields=[...])`,
        why: 'A single transaction around a command that processes millions of rows holds row/table locks for the whole run (blocking other writers), keeps a huge amount of undo/redo data, and means a failure at 99% loses everything. Batch it: a transaction per row or per few-hundred-row chunk gives crash-resumability (skip already-done rows), short lock durations, and bounded transaction-log growth.',
        whyHi: 'Millions rows process karne waale ek command ke aas-paas ek single transaction poore run ke liye locks hold karता hai (doosre writers block karता hai), aur ek 99% par failure sab kuch khोता hai. Batch karो: prati row ya prati kuch-sau-row chunk ek transaction crash-resumability deता hai.',
      },
      {
        wrong: `# scripts/nightly.py -- a plain script, run by cron
import os, django
os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings"
django.setup()
from myapp.models import Trial
for t in Trial.objects.expired():
    t.deactivate()`,
        right: `# myapp/management/commands/expire_trials.py
from django.core.management.base import BaseCommand
from myapp.models import Trial

class Command(BaseCommand):
    help = "Deactivate expired trials"
    def handle(self, *args, **options):
        n = 0
        for t in Trial.objects.expired().iterator():
            t.deactivate(); n += 1
        self.stdout.write(self.style.SUCCESS(f"expired {n} trials"))
# cron:  python manage.py expire_trials`,
        why: 'A hand-rolled script that pokes `DJANGO_SETTINGS_MODULE` and calls `django.setup()` reinvents what `manage.py` already does, drifts from the project\'s settings selection, is not discoverable, cannot be run via `call_command` from tests or tasks, and gets no argument parsing, verbosity control, or `CommandError` handling. Make it a management command — same code, in the right place, with all the framework support.',
        whyHi: 'Ek haath-se-bana script jо `DJANGO_SETTINGS_MODULE` poke karता hai aur `django.setup()` call karता hai wo reinvent karता hai jо `manage.py` pehle se karता hai, project ki settings selection se drift karता hai, discoverable nahi hai, tests se `call_command` ke zariye nahi chal sakta. Ise ek management command banाओ — wahi code, sahi jagah.',
      },
    ],

    realWorld: [
      {
        en: '**Data backfills after a schema migration are almost always a management command** — the migration adds the nullable column, the command populates it in batches (`iterator()` + `bulk_update` + per-batch `atomic()`), then a follow-up migration makes it non-null. Big tables get the command run as a one-off job, tracked, and idempotent (filter on `WHERE new_col IS NULL`).',
        hi: '**Ek schema migration ke baad data backfills lगbhag hamesha ek management command hai** — migration nullable column add karта hai, command ise batches mein bharता hai, phir ek follow-up migration ise non-null banाता hai. Bade tables ke liye command ek one-off job ki tarah chalता hai, idempotent (`WHERE new_col IS NULL` par filter).',
      },
      {
        en: '**Nightly/periodic jobs are commands invoked by `django-celery-beat` or cron** — expire trials, send digest emails, prune audit logs older than 90 days, refresh leaderboards, reconcile with a payment provider, recompute dashboard aggregates into a summary table (Module 9). The command holds the logic; the scheduler just calls it, with overlap protection.',
        hi: '**Nightly/periodic jobs `django-celery-beat` ya cron dwara invoke kiye commands hain** — trials expire karो, digest emails bhejो, 90 din se purane audit logs prune karो, leaderboards refresh karो, dashboard aggregates ek summary table mein recompute karो. Command logic rakhता hai; scheduler bस ise call karता hai.',
      },
      {
        en: '**Ops runbooks become commands** — `grant_role`, `replay_webhooks --since`, `anonymize_user <id>` for GDPR, `resend_invoice <id>`, `export_report --month`. Reviewable, testable, auditable (log who ran what), and safe to hand to support staff, unlike ad-hoc shell sessions on production.',
        hi: '**Ops runbooks commands ban jaते hain** — `grant_role`, `replay_webhooks --since`, GDPR ke liye `anonymize_user <id>`, `resend_invoice <id>`. Reviewable, testable, auditable, aur support staff ko dene ke liye surakshit, production par ad-hoc shell sessions ke विपरीत.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a Django management command, how do you write one, and why not just use a script?',
        qHi: 'Ek Django management command kya hai, aap ek kaise likhते ho, aur bस ek script kyun nahi?',
        a: 'A management command is a named, runnable unit of code that executes with the entire Django project configured — settings loaded, the app registry built, the database connection ready, every model and service importable — invoked as python manage dot py followed by the command name. Django discovers commands by scanning each installed app for a management slash commands package; every module in there that defines a class called Command subclassing BaseCommand becomes a command named after the file. You implement two methods. add_arguments receives an argparse parser and you register positional and optional arguments on it, with types, defaults, choices, and flags. handle is the body; it receives the parsed arguments as a dictionary called options, does the work, writes progress with self dot stdout dot write rather than print so that verbosity control and output capture work, uses self dot style for coloured output, and raises CommandError for expected failures, which exits non-zero with just the message and no traceback. You can wrap handle in transaction dot atomic for all-or-nothing semantics, though for very large jobs you batch instead. The reason to use a command rather than a standalone script is that a script has to manually set the settings module environment variable and call django dot setup, which duplicates and can drift from how the real project selects settings; it is not discoverable; it cannot be invoked from tests or from a Celery task through call_command; and it gets none of the argument parsing, verbosity levels, system-check integration, or error handling that BaseCommand provides for free. A command is the same logic placed where the framework expects it, so it is consistent for the whole team, automatable by cron or a scheduler, testable by calling call_command with a captured stdout, and composable because one command can call another.',
        aHi: 'Ek management command code ki ek named, runnable unit hai jо poore Django project configured ke saath execute hoती hai — settings loaded, app registry built, database connection ready — python manage dot py phir command naam ki tarah invoke. Django commands ko har installed app mein ek management slash commands package scan karके discover karता hai; wahaan har module jо Command naam ki ek class define karता hai jо BaseCommand subclass karती hai file ke naam par ek command ban jाता hai. Aap do methods implement karते ho. add_arguments ek argparse parser receive karta hai aur aap ispar arguments register karते ho. handle body hai; ye parsed arguments ko ek dictionary options ki tarah receive karता hai, kaam karता hai, self dot stdout dot write se progress likhता hai, aur expected failures ke liye CommandError raise karता hai. Ek script ke bजाय ek command istemal karne ka kaaran ye hai ki ek script ko manually settings module env var set karna aur django dot setup call karna hoता hai, jо duplicate karता hai; ye discoverable nahi hai; ise tests se call_command ke zariye invoke nahi kiya jа sakta.',
      },
      {
        q: 'How would you write a management command that backfills a column across a table with tens of millions of rows?',
        qHi: 'Aap ek management command kaise likhोge jо tens of millions rows waali ek table ke paar ek column backfill kare?',
        a: 'The plan has three parts: the schema change, the backfill command, and idempotency. First, a schema migration adds the new column as nullable with no default, so it is a fast metadata-only change on most databases and does not rewrite the table. Then the backfill command populates it. The command must not load the whole table into memory, so it iterates the queryset with iterator and a chunk size — a few thousand — which tells Django and the database driver to stream rows in server-side batches instead of building one giant list. It must not wrap the entire run in a single transaction, because that would hold locks for the whole duration, block other writers, accumulate an enormous amount of transaction-log data, and lose all progress if it fails near the end. Instead it accumulates transformed objects into a buffer and, every few hundred, flushes them with bulk_update inside a small transaction dot atomic block, then clears the buffer. That gives short lock windows, bounded log growth, and progress that survives a crash. Idempotency is essential: the queryset filters on the new column being null, so re-running the command picks up only unfinished rows, and an interrupted run can simply be restarted. I would add a limit or a time-box argument so it can be run in controlled windows, log progress counts periodically, and for a really large table run it as a dedicated one-off job rather than inside a deploy, monitoring database load. Finally, once the backfill is complete and verified, a second migration adds the not-null constraint and any default, and that migration can be written to also do a safety backfill in case a few rows slipped through. Throughout, I keep the transformation logic in a function the command calls, so it is unit-testable independently of the command plumbing.',
        aHi: 'Plan ke teen hisse hain: schema change, backfill command, aur idempotency. Pehle, ek schema migration naye column ko nullable bina default ke add karта hai, toh ye adhikaansh databases par ek tez metadata-only change hai aur table rewrite nahi karता. Phir backfill command ise bharता hai. Command ko poori table memory mein load nahi karna chahिए, toh ye queryset ko iterator aur ek chunk size ke saath iterate karता hai — kuch hazaar — jо Django ko rows ko server-side batches mein stream karने ko kehta hai. Ise poore run ko ek single transaction mein wrap nahi karna chahिए, kyunki wo poore samay locks hold karega. Iske bजाय ye transformed objects ko ek buffer mein jama karता hai aur, har kuch sau, unhe bulk_update se ek chhote transaction dot atomic block ke andar flush karता hai. Idempotency zaroori hai: queryset naye column ke null hone par filter karता hai, toh command ko re-run karna sirf unfinished rows uthाता hai. Aakhir mein, backfill poora hone ke baad, ek doosri migration not-null constraint add karती hai.',
      },
    ],

    exercises: [
      {
        task: 'In a standalone Django script, define a `Product` model (`name`, `price = IntegerField()`, `on_sale = BooleanField(default=False)`), create its table, and add 10 products. Write a `Command(BaseCommand)` with `--threshold` (int) and `--dry-run` flag that sets `on_sale=True` for products with `price >= threshold`. Run it via `call_command(Command(), "--threshold", "500", "--dry-run", stdout=buf)`, print the captured output, then run for real and print how many are now on sale.',
        taskHi: 'Ek standalone Django script mein, ek `Product` model define karो, iski table banाओ, 10 products add karो. Ek `Command(BaseCommand)` likhо `--threshold` (int) aur `--dry-run` flag ke saath jо `price >= threshold` waale products ke liye `on_sale=True` set kare. `call_command(Command(), "--threshold", "500", "--dry-run", stdout=buf)` se chalाओ.',
        hint: '`sys.modules["__main__"].Command = Command` before `call_command`, or pass the instance directly: `call_command(Command(), ...)`. In `handle`, `qs = Product.objects.filter(price__gte=options["threshold"])`; guard writes with `if not options["dry_run"]`.',
        hintHi: '`call_command(Command(), ...)` instance seedhे pass karो. `handle` mein `qs = Product.objects.filter(price__gte=options["threshold"])`; writes ko `if not options["dry_run"]` se guard karो.',
      },
      {
        task: 'Write a batched backfill: a `Row` model with `value = IntegerField()` and `doubled = IntegerField(null=True)`. Insert 3000 rows. Write a function `backfill(batch_size=400)` that uses `Row.objects.filter(doubled__isnull=True).iterator(chunk_size=1000)`, accumulates into a buffer, and flushes with `bulk_update(buf, ["doubled"])` inside `transaction.atomic()` every `batch_size` rows (and once more at the end). Print the number of batches committed and confirm zero rows remain null.',
        taskHi: 'Ek batched backfill likhо: ek `Row` model `value` aur `doubled` (null) ke saath. 3000 rows insert karो. Ek function `backfill(batch_size=400)` jо `.iterator(chunk_size=1000)` istemal kare, ek buffer mein jama kare, aur har `batch_size` rows `transaction.atomic()` ke andar `bulk_update` se flush kare.',
        hint: '`buf.append(row)` after setting `row.doubled = row.value * 2`. `if len(buf) >= batch_size: with transaction.atomic(): Row.objects.bulk_update(buf, ["doubled"]); buf.clear()`. Do a final flush for the remainder after the loop.',
        hintHi: '`row.doubled = row.value * 2` set karne ke baad `buf.append(row)`. `if len(buf) >= batch_size: with transaction.atomic(): Row.objects.bulk_update(buf, ["doubled"]); buf.clear()`. Loop ke baad ek final flush.',
      },
      {
        task: 'Use `call_command` three ways: (1) run `migrate --run-syncdb` with `verbosity=0`; (2) create 3 users, then capture `dumpdata auth.User --indent 2` into an `io.StringIO` and print how many JSON objects it contains; (3) call `get_commands()` and print whether `"loaddata"` and `"collectstatic"` are in the registry.',
        taskHi: '`call_command` teen tarikon se istemal karो: (1) `migrate --run-syncdb` `verbosity=0` ke saath; (2) 3 users banाओ, phir `dumpdata auth.User --indent 2` ko ek `io.StringIO` mein capture karो aur print karो ismें kितने JSON objects hain; (3) `get_commands()` call karो.',
        hint: '`call_command("dumpdata", "auth.User", indent=2, stdout=buf)`. `json.loads(buf.getvalue())` gives a list; `len(...)` is the object count. `"loaddata" in get_commands()`.',
        hintHi: '`call_command("dumpdata", "auth.User", indent=2, stdout=buf)`. `json.loads(buf.getvalue())` ek list deता hai; `len(...)` object count hai.',
      },
    ],

    keyTakeaways: [
      'A management command runs with the FULL project configured (settings, apps, DB, models). Discovered at `myapp/management/commands/<name>.py` defining `class Command(BaseCommand)` -> `python manage.py <name>`. Both `management/` dirs need `__init__.py`.',
      '`add_arguments(self, parser)` registers argparse options: positionals, `--opt type=`, `--flag action="store_true"` (stored as `flag`), `choices=`, `default=`. `handle(self, *args, **options)` is the body; `options` is the parsed dict.',
      'Output via `self.stdout.write(...)` / `self.stderr.write(...)` (respects `--verbosity`, capturable by `call_command`, testable) — NEVER `print()`. `self.style.SUCCESS/WARNING/ERROR/NOTICE` for colour.',
      '`raise CommandError("msg")` for expected failures: message to stderr, non-zero exit, NO traceback. Let unexpected bugs raise normally.',
      'Transactions: `@transaction.atomic` on `handle` for all-or-nothing. For millions of rows, do NOT wrap the whole run — batch with `.iterator(chunk_size=...)` + `bulk_update`/`bulk_create` inside a per-batch `transaction.atomic()`. Make backfills idempotent (`filter(col__isnull=True)`).',
      '`call_command("name", *args, **kwargs)` runs a command from code (tests, deploy scripts, Celery tasks). `stdout=io.StringIO()` captures its output. Args as CLI strings or as kwargs.',
      'Shell: `manage.py shell` (REPL, Django configured; `-c "code"` for a snippet), `shell_plus` (django-extensions, auto-imports models), `dbshell` (native DB client). Prefer a reviewed command over production shell surgery for anything repeatable or data-changing.',
      'Django has no built-in scheduler: cron/systemd timers, `django-celery-beat`, or `django-q2`/RQ call your commands. Always add overlap protection (a lock) to cron-driven commands.',
    ],
    keyTakeawaysHi: [
      'Ek management command POORE project configured (settings, apps, DB, models) ke saath chalता hai. `myapp/management/commands/<name>.py` par discovered jо `class Command(BaseCommand)` define karता hai -> `python manage.py <name>`. Dono `management/` dirs ko `__init__.py` chahिए.',
      '`add_arguments(self, parser)` argparse options register karता hai: positionals, `--opt type=`, `--flag action="store_true"` (`flag` ki tarah store), `choices=`, `default=`. `handle(self, *args, **options)` body hai.',
      'Output `self.stdout.write(...)` ke zariye (`--verbosity` respect karता hai, `call_command` dwara capturable, testable) — KABHI `print()` nahi. `self.style.SUCCESS/WARNING/ERROR` colour ke liye.',
      'Expected failures ke liye `raise CommandError("msg")`: message stderr par, non-zero exit, KOI traceback nahi.',
      'Transactions: `handle` par `@transaction.atomic` all-or-nothing ke liye. Millions rows ke liye poore run ko wrap MAT karो — `.iterator(chunk_size=...)` + `bulk_update` ke saath ek prati-batch `transaction.atomic()` ke andar batch karो. Backfills idempotent banाओ.',
      '`call_command("name", *args, **kwargs)` ek command ko code se chalाता hai (tests, deploy scripts, Celery tasks). `stdout=io.StringIO()` iska output capture karता hai.',
      'Shell: `manage.py shell` (REPL), `shell_plus` (django-extensions, models auto-import), `dbshell` (native DB client). Kisi repeatable ya data-changing cheez ke liye production shell surgery par ek reviewed command prefer karो.',
      'Django mein built-in scheduler nahi: cron/systemd timers, `django-celery-beat`, ya `django-q2`/RQ aapke commands call karते hain. Cron-driven commands mein hamesha overlap protection (ek lock) add karो.',
    ],
  },
];
