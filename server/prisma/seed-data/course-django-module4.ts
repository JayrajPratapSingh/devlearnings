/**
 * Django Complete Course — Module 4: Views, URLs & Forms, lessons 1-3.
 *
 * Lesson 1: function-based views — the request->response contract, render/
 *           redirect/JsonResponse, method dispatch, get_object_or_404,
 *           view decorators (@require_POST, @login_required).
 * Lesson 2: class-based views — View.as_view(), dispatch -> get/post, why CBVs,
 *           TemplateView, per-request instance, http_method_not_allowed.
 * Lesson 3: generic class-based views — ListView/DetailView/CreateView/
 *           UpdateView/DeleteView/FormView, the mixin MRO, the override points.
 *
 * NOTE for future editors: same conventions as course-django-module3.ts.
 *  - Every backtick inside simple/simpleHi/content/contentHi is `\``.
 *  - `$` before `{` in template literals -> `\${`.
 *  - `examples` use `code` + `output`, ASCII-only output, run with `python`.
 *  - Boot standalone Django; use `django.test.Client` / `RequestFactory`.
 *    Templates via `TEMPLATES` with `APP_DIRS=False` + inline `Template` strings,
 *    or `django.template.loader` shims -- prefer views that return HttpResponse/
 *    JsonResponse directly so no template files are needed.
 *  - Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_4: CourseLesson[] = [
  {
    slug: 'dj-function-based-views',
    title: 'Function-Based Views: request in, HttpResponse out',
    titleHi: 'Function-Based Views: request andar, HttpResponse bahar',
    description: 'A function-based view is one callable that takes an `HttpRequest` and returns an `HttpResponse`. Everything else — method dispatch, fetching-or-404, login gates, JSON — is a small helper or a decorator you stack on top. It is the most direct model and the right default for anything that is not plain CRUD.',
    descriptionHi: 'Ek function-based view ek callable hai jо ek `HttpRequest` leता hai aur ek `HttpResponse` lautाता hai. Baaki sab — method dispatch, fetch-ya-404, login gates, JSON — ek chhota helper ya ek decorator hai jise aap upar stack karते ho. Ye sabse seedhा model hai aur kisi bhi cheez ke liye sahi default jо plain CRUD nahi hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A single clerk at a window who does one job, with a stack of rubber stamps within reach.** The clerk (your view function) takes the form you slide under the glass (the `HttpRequest`), does the work, and slides back a printed result (the `HttpResponse`). That is the whole contract. Everything else is a rubber stamp the clerk reaches for: a "POST only" stamp that bounces you if you came to the wrong window with the wrong verb (`@require_POST`); a "show your ID" stamp that sends you to the login desk first (`@login_required`); a "not found, next!" reflex when you ask for a file that is not in the drawer (`get_object_or_404`). The stamps compose — you can require login *and* POST *and* a specific permission — and they sit right above the clerk\'s desk (the decorator lines above `def view`), so anyone reading the code sees the gates before they see the work.',
      hi: '**Ek window par ek akela clerk jо ek kaam karता hai, pahुँch mein rubber stamps ka ek stack ke saath.** Clerk (aapka view function) wo form leता hai jо aap glass ke neeche slide karते ho (`HttpRequest`), kaam karता hai, aur ek printed result wapas slide karता hai (`HttpResponse`). Wo poora contract hai. Baaki sab ek rubber stamp hai jiske liye clerk pahुँchता hai: ek "sirf POST" stamp jо aapko bounce karता hai agar aap galat verb ke saath aaye (`@require_POST`); ek "apni ID dikhाओ" stamp jо aapko pehle login desk bhejता hai (`@login_required`); ek "not found, next!" reflex jab aap ek file maangते ho jо drawer mein nahi hai (`get_object_or_404`). Stamps compose karते hain, aur wo clerk ke desk ke bilkul upar baithते hain (`def view` ke upar decorator lines), toh koi bhi code padhने waala kaam se pehle gates dekhता hai.',
    },

    simple: `**The contract: \`(request) -> HttpResponse\`**

\`\`\`python
# blog/views.py
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404

def post_list(request):
    posts = Post.objects.filter(status="published")
    return render(request, "blog/post_list.html", {"posts": posts})   # -> text/html

def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, status="published")      # 404 if not found
    return render(request, "blog/post_detail.html", {"post": post})

def post_api(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return JsonResponse({"id": post.pk, "title": post.title})          # -> application/json

def create_post(request):
    if request.method == "POST":
        # ...validate + save...
        return redirect("blog:detail", slug=new_post.slug)             # 302
    return render(request, "blog/post_form.html")
\`\`\`

**Method dispatch — three ways**

\`\`\`python
# 1. an if on request.method
def view(request):
    if request.method == "POST":
        ...
    return ...   # GET

# 2. a decorator that 405s the wrong verbs
from django.views.decorators.http import require_POST, require_http_methods

@require_POST
def like(request, pk): ...

@require_http_methods(["GET", "HEAD"])
def report(request): ...

# 3. (CBV territory -- lesson 2)
\`\`\`

**The fetch-or-404 helpers**

\`\`\`python
get_object_or_404(Post, slug=slug)                 # Post.DoesNotExist / MultipleObjectsReturned -> Http404
get_object_or_404(Post.objects.published(), pk=pk) # accepts a queryset or a manager
get_list_or_404(Post, author=user)                 # 404 if the list is empty
\`\`\`

**View decorators (stack them, outermost first)**

\`\`\`python
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_exempt

@login_required                                    # redirects to LOGIN_URL if anonymous
@permission_required("blog.add_post", raise_exception=True)   # 403 if lacking the perm
@require_POST
def publish(request, pk): ...

@cache_page(60 * 5)                                 # cache the response for 5 minutes
def stats(request): ...
\`\`\`

\`\`\`
render(request, template, context=None, status=200)   -> HttpResponse (rendered template)
redirect(to, *args, permanent=False)   -> 302 (or 301); 'to' can be a URL, a view name, or a model
JsonResponse(data, safe=True, status=200)             -> application/json
get_object_or_404(klass, **kwargs) / get_list_or_404  -> raises Http404 (Django -> the 404 page)

decorators run OUTSIDE-IN on the request, INSIDE-OUT on the response.
@require_POST @require_GET @require_http_methods(["..."])   -> 405 on a mismatched verb
@login_required(login_url=, redirect_field_name=)          -> 302 to login for AnonymousUser
@permission_required("app.codename", raise_exception=True) -> 403 (else redirect to login)
\`\`\``,

    simpleHi: `**Contract: \`(request) -> HttpResponse\`**

\`\`\`python
# blog/views.py
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404

def post_list(request):
    posts = Post.objects.filter(status="published")
    return render(request, "blog/post_list.html", {"posts": posts})   # -> text/html

def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, status="published")      # 404 agar nahi mila
    return render(request, "blog/post_detail.html", {"post": post})

def post_api(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return JsonResponse({"id": post.pk, "title": post.title})          # -> application/json

def create_post(request):
    if request.method == "POST":
        return redirect("blog:detail", slug=new_post.slug)             # 302
    return render(request, "blog/post_form.html")
\`\`\`

**Method dispatch — teen tarike**

\`\`\`python
# 1. request.method par ek if
def view(request):
    if request.method == "POST":
        ...
    return ...   # GET

# 2. ek decorator jо galat verbs ko 405 karता hai
from django.views.decorators.http import require_POST, require_http_methods

@require_POST
def like(request, pk): ...

@require_http_methods(["GET", "HEAD"])
def report(request): ...
\`\`\`

**Fetch-or-404 helpers**

\`\`\`python
get_object_or_404(Post, slug=slug)                 # DoesNotExist / MultipleObjectsReturned -> Http404
get_object_or_404(Post.objects.published(), pk=pk) # ek queryset ya ek manager accept karता hai
get_list_or_404(Post, author=user)                 # 404 agar list khali hai
\`\`\`

**View decorators (unhe stack karो, outermost pehle)**

\`\`\`python
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.cache import cache_page

@login_required                                    # anonymous ho toh LOGIN_URL par redirect
@permission_required("blog.add_post", raise_exception=True)   # perm na ho toh 403
@require_POST
def publish(request, pk): ...

@cache_page(60 * 5)                                 # response ko 5 minute cache karो
def stats(request): ...
\`\`\`

\`\`\`
render(request, template, context=None, status=200)   -> HttpResponse (rendered template)
redirect(to, *args, permanent=False)   -> 302 (ya 301); 'to' ek URL, ek view name, ya ek model
JsonResponse(data, safe=True, status=200)             -> application/json
get_object_or_404(klass, **kwargs) / get_list_or_404  -> Http404 raise karता hai

decorators request par OUTSIDE-IN, response par INSIDE-OUT chalते hain.
@require_POST @require_GET @require_http_methods(["..."])   -> mismatched verb par 405
@login_required(login_url=, redirect_field_name=)          -> AnonymousUser ke liye login par 302
@permission_required("app.codename", raise_exception=True) -> 403 (warna login par redirect)
\`\`\``,

    content: `## The view contract

A Django view is any callable that takes an \`HttpRequest\` as its first argument (plus any URL-captured kwargs) and returns an \`HttpResponse\` — or raises an exception Django maps to one (\`Http404\`, \`PermissionDenied\`, \`SuspiciousOperation\`). A function-based view (FBV) is the simplest form: a plain function.

\`\`\`python
def dashboard(request, org_slug):                  # org_slug from  path("<slug:org_slug>/", ...)
    org = get_object_or_404(Organisation, slug=org_slug)
    if not org.members.filter(pk=request.user.pk).exists():
        raise PermissionDenied
    return render(request, "dashboard.html", {"org": org})
\`\`\`

## The shortcuts

- **\`render(request, template_name, context=None, *, status=200, content_type=None)\`** — loads the template, renders it with a \`RequestContext\` (so context processors run: \`request\`, \`user\`, CSRF token, messages), returns an \`HttpResponse\`.
- **\`redirect(to, *args, permanent=False, **kwargs)\`** — returns \`HttpResponseRedirect\` (302) or \`HttpResponsePermanentRedirect\` (301). \`to\` may be: a URL string (\`"/login/"\`), a view name for \`reverse\` (\`redirect("blog:detail", slug=s)\`), or a model instance with \`get_absolute_url\` (\`redirect(post)\`).
- **\`get_object_or_404(klass, *args, **kwargs)\`** — calls \`klass.objects.get(**kwargs)\` (or \`.get\` on a passed queryset/manager) and turns \`DoesNotExist\` and \`MultipleObjectsReturned\` into \`Http404\`. \`get_list_or_404\` does the same for \`.filter()\` when the result is empty.
- **\`JsonResponse(data, encoder=DjangoJSONEncoder, safe=True, json_dumps_params=None, **kwargs)\`** — serialises \`data\` and sets \`Content-Type: application/json\`. \`safe=False\` to pass a non-dict top level.

## Method dispatch

An FBV receives every HTTP method routed to its URL. You decide what to do:

\`\`\`python
def comment_view(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect(post)
    else:
        form = CommentForm()
    return render(request, "comment_form.html", {"form": form, "post": post})
\`\`\`

To reject unexpected verbs with a proper \`405 Method Not Allowed\` (rather than falling through to a \`GET\`-shaped response), use the \`django.views.decorators.http\` decorators:

- \`@require_GET\`, \`@require_POST\`, \`@require_safe\` (GET + HEAD).
- \`@require_http_methods(["GET", "POST"])\`.

They also set the \`Allow\` header on the 405, which is correct HTTP.

## View decorators

Decorators wrap the view callable. On a request they run **outermost first** (top decorator sees the request first); the response unwinds **innermost first**.

\`\`\`python
@login_required            # 1: anonymous -> 302 to login, view never runs
@require_POST              # 2: not POST -> 405, view never runs
@transaction.atomic        # 3: wrap the view body in a DB transaction
def transfer(request):
    ...
\`\`\`

Key ones:

- **\`@login_required\`** (from \`django.contrib.auth.decorators\`) — redirects \`AnonymousUser\` to \`settings.LOGIN_URL\` with a \`?next=\` param. \`@login_required(login_url="/accounts/login/")\` to override.
- **\`@permission_required("app.codename", raise_exception=True)\`** — \`raise_exception=True\` returns \`403\` for a logged-in user lacking the permission; without it, redirects to login (usually not what you want for an authenticated user).
- **\`@user_passes_test(lambda u: u.is_staff)\`** — arbitrary predicate.
- **\`@cache_page(seconds)\`**, **\`@vary_on_headers("Cookie")\`**, **\`@cache_control(...)\`** — HTTP caching (Module 7).
- **\`@csrf_exempt\`** / **\`@csrf_protect\`** / **\`@ensure_csrf_cookie\`** — CSRF handling (lesson 6).
- **\`@require_http_methods\`** and friends — method allowlist.

For a decorator that only makes sense on a class-based view method, wrap it with \`method_decorator\` (lesson 2).

## When to use an FBV

FBVs are the right choice when the view does something bespoke: a webhook receiver, a report with complex query logic, a multi-step wizard that does not fit a generic CBV, an endpoint that returns a file or a stream, anything where the control flow is the point. For plain "list these / show one / create-update-delete this model" CRUD, the generic class-based views (lesson 3) remove the boilerplate — but you can always start with an FBV and refactor later.`,

    contentHi: `## View contract

Ek Django view koi bhi callable hai jо ek \`HttpRequest\` ko apne pehle argument ki tarah leता hai (plus koi URL-captured kwargs) aur ek \`HttpResponse\` lautाता hai — ya ek exception raise karता hai jise Django ek mein map karता hai (\`Http404\`, \`PermissionDenied\`). Ek function-based view (FBV) sabse saral roop hai: ek plain function.

## Shortcuts

- **\`render(request, template_name, context=None, *, status=200)\`** — template load karता hai, ise ek \`RequestContext\` ke saath render karता hai (toh context processors chalते hain: \`request\`, \`user\`, CSRF token, messages), ek \`HttpResponse\` lautाता hai.
- **\`redirect(to, *args, permanent=False)\`** — \`HttpResponseRedirect\` (302) lautाता hai. \`to\` ho sakta hai: ek URL string, \`reverse\` ke liye ek view name, ya ek model instance \`get_absolute_url\` ke saath.
- **\`get_object_or_404(klass, **kwargs)\`** — \`klass.objects.get(**kwargs)\` call karता hai aur \`DoesNotExist\` / \`MultipleObjectsReturned\` ko \`Http404\` mein badalता hai. \`get_list_or_404\` khali result ke liye wahi karता hai.
- **\`JsonResponse(data, safe=True, status=200)\`** — \`data\` serialise karता hai aur \`Content-Type: application/json\` set karता hai.

## Method dispatch

Ek FBV apne URL par routed har HTTP method receive karता hai. Aap tay karते ho:

\`\`\`python
def comment_view(request, post_id):
    if request.method == "POST":
        ...
    else:
        ...
    return render(...)
\`\`\`

Unexpected verbs ko ek uचित \`405 Method Not Allowed\` se reject karने ke liye, \`django.views.decorators.http\` decorators istemal karो:

- \`@require_GET\`, \`@require_POST\`, \`@require_safe\` (GET + HEAD).
- \`@require_http_methods(["GET", "POST"])\`.

Ye 405 par \`Allow\` header bhi set karते hain.

## View decorators

Decorators view callable ko wrap karते hain. Ek request par wo **outermost pehle** chalते hain; response **innermost pehle** unwind hoता hai.

Mukhya:

- **\`@login_required\`** — \`AnonymousUser\` ko \`settings.LOGIN_URL\` par ek \`?next=\` param ke saath redirect karता hai.
- **\`@permission_required("app.codename", raise_exception=True)\`** — \`raise_exception=True\` ek logged-in user ke liye \`403\` lautाता hai jiske paas permission nahi.
- **\`@user_passes_test(lambda u: u.is_staff)\`** — arbitrary predicate.
- **\`@cache_page(seconds)\`** — HTTP caching (Module 7).

## FBV kab istemal karें

FBVs sahi chunaव hain jab view kuch bespoke karता hai: ek webhook receiver, complex query logic waala ek report, ek multi-step wizard. Plain CRUD ke liye, generic class-based views (lesson 3) boilerplate hataते hain — par aap hamesha ek FBV se shuru karके baad mein refactor kar sakte ho.`,

    examples: [
      {
        title: 'A view is (request) -> HttpResponse; render / redirect / JsonResponse',
        titleHi: 'Ek view (request) -> HttpResponse hai; render / redirect / JsonResponse',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    MIDDLEWARE=["django.middleware.common.CommonMiddleware"], TEMPLATES=[])
django.setup()

from django.db import models, connection
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, get_object_or_404
from django.urls import path
from django.test import Client

class Article(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Article)
Article.objects.create(slug="hello", title="Hello World")

def detail(request, slug):
    article = get_object_or_404(Article, slug=slug)     # 404 if missing
    return HttpResponse(f"<h1>{article.title}</h1>", content_type="text/html")

def api(request, slug):
    article = get_object_or_404(Article, slug=slug)
    return JsonResponse({"slug": article.slug, "title": article.title})

def old_url(request, slug):
    return redirect("detail", slug=slug)               # 302 to the 'detail' view by name

urlpatterns = [
    path("a/<slug:slug>/", detail, name="detail"),
    path("api/<slug:slug>/", api, name="api"),
    path("old/<slug:slug>/", old_url, name="old"),
]

c = Client()
print("detail 200:", c.get("/a/hello/").status_code, c.get("/a/hello/").content.decode())
print("detail missing -> 404:", c.get("/a/nope/").status_code)
print("api json:", c.get("/api/hello/").json())
r = c.get("/old/hello/")
print("redirect:", r.status_code, "->", r["Location"])
print("redirect followed:", c.get("/old/hello/", follow=True).content.decode())`,
        output: `detail 200: 200 <h1>Hello World</h1>
detail missing -> 404: 404
api json: {'slug': 'hello', 'title': 'Hello World'}
redirect: 302 -> /a/hello/
redirect followed: <h1>Hello World</h1>
`,
        explain: 'Each view takes `request` (plus the `slug` captured by the URL pattern) and returns an `HttpResponse`. `HttpResponse` for raw HTML, `JsonResponse` for an API. `get_object_or_404(Article, slug=slug)` fetches the row or raises `Http404`, which Django turns into a 404 page — you never write `try/except DoesNotExist`. `redirect("detail", slug=slug)` reverses the named view and returns a 302 with a `Location` header; `follow=True` in the test client chases it to the final 200.',
        explainHi: 'Har view `request` (plus URL pattern dwara captured `slug`) leता hai aur ek `HttpResponse` lautाता hai. Raw HTML ke liye `HttpResponse`, ek API ke liye `JsonResponse`. `get_object_or_404(Article, slug=slug)` row fetch karता hai ya `Http404` raise karता hai, jise Django ek 404 page banाता hai — aap kabhi `try/except DoesNotExist` nahi likhते. `redirect("detail", slug=slug)` named view ko reverse karता hai aur ek `Location` header ke saath ek 302 lautाता hai.',
      },
      {
        title: 'Method dispatch: an if vs @require_POST (which sends a 405)',
        titleHi: 'Method dispatch: ek if vs @require_POST (jо ek 405 bhejता hai)',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], MIDDLEWARE=[], USE_TZ=True, TEMPLATES=[])
django.setup()

from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.urls import path
from django.views.decorators.http import require_POST, require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.test import Client

# 1. hand-rolled dispatch: GET renders a form, POST processes it
@csrf_exempt
def subscribe(request):
    if request.method == "POST":
        email = request.POST.get("email", "")
        return JsonResponse({"subscribed": email}, status=201)
    return HttpResponse("<form>...</form>")            # GET

# 2. @require_POST: a GET gets a real 405 with an Allow header
@csrf_exempt
@require_POST
def like(request):
    return JsonResponse({"liked": True})

@require_http_methods(["GET", "HEAD"])
def report(request):
    return HttpResponse("report")

urlpatterns = [
    path("subscribe/", subscribe), path("like/", like), path("report/", report),
]

c = Client()
print("GET /subscribe/ (form):", c.get("/subscribe/").status_code)
print("POST /subscribe/:", c.post("/subscribe/", {"email": "a@b.com"}).json())
r = c.get("/like/")
print("GET /like/ -> 405:", r.status_code, "| Allow:", r["Allow"])
print("POST /like/:", c.post("/like/").json())
print("POST /report/ -> 405:", c.post("/report/").status_code)`,
        output: `GET /subscribe/ (form): 200
POST /subscribe/: {'subscribed': 'a@b.com'}
GET /like/ -> 405: 405 | Allow: POST
POST /like/: {'liked': True}
POST /report/ -> 405: 405
`,
        explain: 'The `subscribe` view branches on `request.method` — GET returns the form, POST processes it. That is fine, but a `DELETE /subscribe/` would fall through to the GET branch. `@require_POST` makes the wrong verb an explicit `405 Method Not Allowed` with an `Allow` header listing exactly the permitted verbs (`POST`), and the view body never runs. `@require_http_methods(["GET", "HEAD"])` does the same for an allowlist. (`@csrf_exempt` here only because these are plain POST views without a CSRF token — lesson 6.)',
        explainHi: '`subscribe` view `request.method` par branch karता hai — GET form lautाता hai, POST ise process karता hai. Wo theek hai, par ek `DELETE /subscribe/` GET branch mein gir jаega. `@require_POST` galat verb ko ek explicit `405 Method Not Allowed` banाता hai ek `Allow` header ke saath jо bilkul permitted verbs (`POST`) list karता hai, aur view body kabhi nahi chalता. `@require_http_methods(["GET", "HEAD"])` ek allowlist ke liye wahi karता hai.',
      },
      {
        title: 'Stacking decorators: login_required + permission_required + require_POST',
        titleHi: 'Decorators stack karna: login_required + permission_required + require_POST',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True, TEMPLATES=[],
    LOGIN_URL="/login/",
    MIDDLEWARE=["django.contrib.sessions.middleware.SessionMiddleware",
               "django.contrib.auth.middleware.AuthenticationMiddleware"],
    SESSION_ENGINE="django.contrib.sessions.backends.signed_cookies")
django.setup()

from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.http import JsonResponse
from django.urls import path
from django.contrib.auth.models import User, Permission
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.test import Client

@csrf_exempt
@login_required                                  # 1: anonymous -> 302 to /login/
@permission_required("auth.add_user", raise_exception=True)   # 2: no perm -> 403
@require_POST                                     # 3: not POST -> 405
def make_user(request):
    return JsonResponse({"created": request.POST.get("username")}, status=201)

urlpatterns = [path("make-user/", make_user)]

# set up: an anonymous client, a plain user, a privileged user
plain = User.objects.create_user("plain", password="pw")
boss = User.objects.create_user("boss", password="pw")
boss.user_permissions.add(Permission.objects.get(codename="add_user"))

anon, c_plain, c_boss = Client(), Client(), Client()
c_plain.force_login(plain)
c_boss.force_login(boss)

print("anonymous POST -> redirect to login:",
      anon.post("/make-user/").status_code, anon.post("/make-user/")["Location"][:20])
print("plain user POST -> 403 (no permission):", c_plain.post("/make-user/").status_code)
print("boss GET -> 405 (require_POST):", c_boss.get("/make-user/").status_code)
print("boss POST -> 201:", c_boss.post("/make-user/", {"username": "new"}).json())`,
        output: `anonymous POST -> redirect to login: 302 /login/?next=/make-u
plain user POST -> 403 (no permission): 403
boss GET -> 405 (require_POST): 405
boss POST -> 201: {'created': 'new'}
`,
        explain: 'Three decorators stack above `make_user`, checked top-to-bottom on the way in: `@login_required` bounces an anonymous request with a `302` to `/login/?next=...`; `@permission_required(..., raise_exception=True)` returns `403` for a logged-in user without `auth.add_user`; `@require_POST` returns `405` for a GET even from the privileged user. Only a POST from `boss` (authenticated + permitted) reaches the body and gets `201`. Reading the decorator stack tells you every gate before you read the logic.',
        explainHi: 'Teen decorators `make_user` ke upar stack hote hain, andar jaते waqt top-to-bottom check kiye: `@login_required` ek anonymous request ko `/login/?next=...` par ek `302` se bounce karता hai; `@permission_required(..., raise_exception=True)` `auth.add_user` ke bina ek logged-in user ke liye `403` lautाता hai; `@require_POST` ek GET ke liye `405` lautाता hai. Sirf `boss` se ek POST (authenticated + permitted) body tak pahुँchता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `def get_post(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return HttpResponse("Not found", status=404)
    except Post.MultipleObjectsReturned:
        post = Post.objects.filter(pk=pk).first()
    return render(request, "post.html", {"post": post})`,
        right: `def get_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, "post.html", {"post": post})`,
        why: '`get_object_or_404` already handles `DoesNotExist` and `MultipleObjectsReturned` by raising `Http404`, which Django renders as your styled 404 page (not a bare "Not found" string). Hand-rolling the try/except is more code, an inconsistent 404 response, and easy to get subtly wrong. Use the shortcut; pass a filtered queryset (`get_object_or_404(Post.objects.published(), pk=pk)`) to scope it.',
        whyHi: '`get_object_or_404` pehle se `DoesNotExist` aur `MultipleObjectsReturned` ko `Http404` raise karके handle karता hai, jise Django aapke styled 404 page ki tarah render karता hai. Haath-se try/except likhna zyada code hai, ek inconsistent 404 response. Shortcut istemal karो; ise scope karने ke liye ek filtered queryset pass karो.',
      },
      {
        wrong: `def like(request, pk):
    post = get_object_or_404(Post, pk=pk)
    post.likes += 1
    post.save()
    return JsonResponse({"likes": post.likes})
# a GET request also increments the counter -> crawlers, prefetch, and link previews inflate it`,
        right: `@require_POST
def like(request, pk):
    Post.objects.filter(pk=pk).update(likes=F("likes") + 1)
    return JsonResponse({"ok": True})
# GET is now a 405; the write only happens on an explicit POST`,
        why: 'A view that mutates state must not do so on a `GET` — GET is defined as safe and idempotent, so browsers pre-fetch it, link-preview bots hit it, and a crawler will "like" every post. Gate any state change behind `@require_POST` (or PUT/PATCH/DELETE), and additionally use `F()` for the increment so concurrent likes are not lost (Module 3).',
        whyHi: 'Ek view jо state mutate karता hai use ek `GET` par aisा nahi karna chahिए — GET safe aur idempotent define hai, toh browsers ise pre-fetch karते hain, link-preview bots ise hit karते hain, aur ek crawler har post ko "like" karega. Kisi bhi state change ko `@require_POST` ke peeche gate karो, aur increment ke liye `F()` istemal karो.',
      },
      {
        wrong: `@require_POST
@login_required            # WRONG ORDER: require_POST runs first
def publish(request, pk):
    ...
# an anonymous GET gets a 405 (from require_POST) instead of a 302 to login`,
        right: `@login_required            # auth check first -- anonymous users get redirected
@require_POST              # then the method check
def publish(request, pk):
    ...`,
        why: 'Decorator order is execution order (top runs first on the request). With `@require_POST` on top, an anonymous user hitting the URL with GET gets a `405` — a confusing response that reveals the endpoint exists and expects POST. Put the auth/permission decorators outermost so unauthenticated requests are redirected or 403\'d before any method or business logic runs.',
        whyHi: 'Decorator order execution order hai (top request par pehle chalता hai). `@require_POST` upar hone se, ek anonymous user jо URL ko GET se hit karता hai ek `405` paता hai — ek confusing response. Auth/permission decorators ko outermost rakhो taaki unauthenticated requests kisi bhi method ya business logic se pehle redirect ya 403 ho jaएं.',
      },
    ],

    realWorld: [
      {
        en: '**Webhook receivers, payment callbacks, OAuth callbacks, and health checks are almost always FBVs** — `@csrf_exempt @require_POST def stripe_webhook(request):` verifies the signature, parses the event, enqueues a task, returns `200` fast. The control flow is specific enough that a generic CBV adds nothing.',
        hi: '**Webhook receivers, payment callbacks, OAuth callbacks, aur health checks lगbhag hamesha FBVs hain** — `@csrf_exempt @require_POST def stripe_webhook(request):` signature verify karता hai, event parse karता hai, ek task enqueue karता hai, tez `200` lautाता hai.',
      },
      {
        en: '**`get_object_or_404` with a scoped queryset is the standard object-fetch + authorization pattern** — `get_object_or_404(Order.objects.filter(customer=request.user), pk=pk)` returns the order only if it belongs to the requester, otherwise a clean 404 (better than 403, which confirms the object exists).',
        hi: '**Ek scoped queryset ke saath `get_object_or_404` standard object-fetch + authorization pattern hai** — `get_object_or_404(Order.objects.filter(customer=request.user), pk=pk)` order sirf tab lautाता hai agar wo requester ka hai, warna ek saaf 404.',
      },
      {
        en: '**Decorator stacks encode the access policy at the top of every view** — `@login_required @permission_required(...) @require_POST` or a project-specific `@require_org_admin`. Teams sometimes lint that every non-public view has an auth decorator, so a new endpoint cannot ship unguarded.',
        hi: '**Decorator stacks har view ke top par access policy encode karते hain** — `@login_required @permission_required(...) @require_POST`. Teams kabhi lint karती hain ki har non-public view ke paas ek auth decorator ho.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the contract for a Django view, and how do you handle "fetch this object or 404"?',
        qHi: 'Ek Django view ka contract kya hai, aur aap "ye object fetch karो ya 404" kaise handle karते ho?',
        a: 'A view is any callable that takes an HttpRequest as its first positional argument, plus any keyword arguments captured from the URL pattern, and returns an HttpResponse. It can also raise one of a small set of exceptions that Django maps to status codes — Http404 to a 404 page, PermissionDenied to 403, SuspiciousOperation to 400 — and any other unhandled exception becomes a 500. A function-based view is just a plain function fulfilling that contract; a class-based view is a class whose as_view method returns a callable that fulfils it. Inside the view you use shortcuts: render loads a template, renders it with the request context so context processors run, and returns an HttpResponse; redirect returns a 302 to a URL, a named view resolved through reverse, or a model instance via its get_absolute_url; JsonResponse serialises a dict and sets the JSON content type. For fetch-or-404 you use get_object_or_404, which takes a model class or a queryset or a manager plus lookup keyword arguments, calls get, and converts both DoesNotExist and MultipleObjectsReturned into an Http404. So you never write a try-except around a get in a view. A useful pattern is to pass a filtered queryset instead of the bare model — get_object_or_404 of Order objects filtered to the current user, pk equals pk — so the lookup is scoped: if the object exists but belongs to someone else, the requester gets a 404 rather than a 403, which does not leak the fact that the object exists. There is also get_list_or_404 which raises when a filter returns an empty list.',
        aHi: 'Ek view koi bhi callable hai jо ek HttpRequest ko apne pehle positional argument ki tarah leता hai, plus URL pattern se captured koi keyword arguments, aur ek HttpResponse lautाता hai. Ye ek chhote set ke exceptions mein se ek bhi raise kar sakta hai jise Django status codes par map karता hai — Http404 ek 404 page par, PermissionDenied 403 par. Ek function-based view bस ek plain function hai jо us contract ko poora karता hai. View ke andar aap shortcuts istemal karते ho: render ek template load karता hai; redirect ek 302 lautाता hai; JsonResponse ek dict serialise karता hai. Fetch-or-404 ke liye aap get_object_or_404 istemal karते ho, jо ek model class ya ek queryset plus lookup keyword arguments leता hai, get call karता hai, aur DoesNotExist aur MultipleObjectsReturned dono ko ek Http404 mein badalता hai. Ek useful pattern bare model ke bजाय ek filtered queryset pass karna hai, taaki lookup scoped ho.',
      },
      {
        q: 'Why does decorator order matter on a view, and what is a common ordering mistake?',
        qHi: 'Ek view par decorator order kyun maayne rakhता hai, aur ek aam ordering galti kya hai?',
        a: 'Decorators wrap the view callable in layers, and the order you write them is the order they execute on the incoming request: the topmost decorator is the outermost layer, so it sees the request first and can short-circuit before anything below it runs; the response then unwinds from the innermost layer outward. So the practical rule is to put the checks that should reject a request earliest at the top. Authentication and authorization decorators — login_required, permission_required, a custom role check — belong outermost, because if the user is not allowed to be here at all, that should be decided before we look at the HTTP method, before we touch the database, before any business logic. Below those go method restrictions like require_POST, and then things like transaction.atomic that should wrap only the actual work. The common mistake is putting require_POST above login_required. With that order, an anonymous user who hits the URL with a GET gets a 405 Method Not Allowed from require_POST, instead of a 302 redirect to the login page. That is a worse experience and it also leaks information: the 405 with its Allow header tells an unauthenticated client that the endpoint exists and expects a POST. Putting login_required on top means the anonymous request is redirected to login before the method check is ever reached, which is both more correct and less revealing. The same logic applies to permission checks: a logged-in user without the right permission should get a 403 based on who they are, not a 405 based on how they called it.',
        aHi: 'Decorators view callable ko layers mein wrap karते hain, aur aap unhe jis order mein likhते ho wahi order hai jismें wo incoming request par execute hote hain: sabse upar wala decorator sabse bahari layer hai, toh ye request pehle dekhता hai aur iske neeche kuch bhi chalne se pehle short-circuit kar sakta hai. Toh vyavhaarik niyam un checks ko top par rakhna hai jо ek request ko jaldi reject karें. Authentication aur authorization decorators outermost rehते hain, kyunki agar user ko yahaan hone ki anumati nahi, wo HTTP method dekhने se pehle, database chhoone se pehle tay hona chahिए. Aam galti require_POST ko login_required ke upar rakhna hai. Us order ke saath, ek anonymous user jо URL ko GET se hit karता hai require_POST se ek 405 paता hai, ek 302 redirect ke bजाy. Wo ek bura experience hai aur ye information bhi leak karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Configure a standalone Django project with a `Book` model (`slug` unique, `title`). Create one book. Write three views wired to URLs: `detail(request, slug)` returning `HttpResponse` with the title (404 via `get_object_or_404` if missing), `book_json(request, slug)` returning `JsonResponse({"title": ...})`, and `go(request, slug)` returning `redirect("detail", slug=slug)`. Use `django.test.Client` to check: detail 200 + body, missing -> 404, json body, and the redirect `Location` + `status_code`.',
        taskHi: 'Ek standalone Django project configure karो ek `Book` model (`slug` unique, `title`) ke saath. Ek book banाओ. Teen views likhо URLs se wired: `detail`, `book_json`, `go` (redirect). `django.test.Client` se check karो.',
        hint: '`from django.shortcuts import redirect, get_object_or_404`. `Client().get("/x/").status_code`, `.json()`, `resp["Location"]`. `TEMPLATES=[]` and return `HttpResponse`/`JsonResponse` directly so no template files are needed.',
        hintHi: '`from django.shortcuts import redirect, get_object_or_404`. `Client().get("/x/").status_code`, `.json()`, `resp["Location"]`. `TEMPLATES=[]` aur `HttpResponse`/`JsonResponse` seedhे return karो.',
      },
      {
        task: 'Write a `counter(request)` view: `@csrf_exempt`, on `POST` it does `Row.objects.filter(pk=1).update(n=F("n") + 1)` and returns the new `n` as JSON; on `GET` it returns the current `n`. Then add `@require_POST` to a second view `bump_only` that ALWAYS increments, and show that `GET /bump-only/` returns 405 with an `Allow` header while `POST` returns 200. Model `Row` with `n = IntegerField(default=0)` and seed one row.',
        taskHi: 'Ek `counter(request)` view likhो: `@csrf_exempt`, `POST` par `Row.objects.filter(pk=1).update(n=F("n") + 1)` kare, `GET` par current `n` lautае. Phir ek doosre view `bump_only` par `@require_POST` add karके dikhाओ ki `GET` 405 (`Allow` header ke saath) aur `POST` 200.',
        hint: '`from django.db.models import F`. `from django.views.decorators.http import require_POST`. `resp["Allow"]` on the 405 lists the permitted methods. `Client().post("/bump-only/")` succeeds; `.get()` is 405.',
        hintHi: '`from django.db.models import F`. `from django.views.decorators.http import require_POST`. 405 par `resp["Allow"]` permitted methods list karта hai.',
      },
      {
        task: 'Build a view `admin_action(request)` decorated with `@login_required`, `@permission_required("auth.change_user", raise_exception=True)`, and `@require_POST` (in that order, plus `@csrf_exempt`). Migrate auth, create an anonymous client, a plain user client (`force_login`), and a client for a user granted `auth.change_user`. Assert: anonymous POST -> 302 to `LOGIN_URL`; plain user POST -> 403; privileged user GET -> 405; privileged user POST -> 200.',
        taskHi: 'Ek view `admin_action(request)` banाओ `@login_required`, `@permission_required("auth.change_user", raise_exception=True)`, aur `@require_POST` se decorated (us order mein, plus `@csrf_exempt`). Auth migrate karो, teen clients banाओ. Assert karो.',
        hint: '`call_command("migrate", run_syncdb=True, verbosity=0)`. `Permission.objects.get(codename="change_user")`. `user.user_permissions.add(perm)`. `Client().force_login(user)`. `SESSION_ENGINE="django.contrib.sessions.backends.signed_cookies"` avoids a session table.',
        hintHi: '`call_command("migrate", run_syncdb=True, verbosity=0)`. `Permission.objects.get(codename="change_user")`. `user.user_permissions.add(perm)`. `Client().force_login(user)`.',
      },
    ],

    keyTakeaways: [
      'A view = a callable taking `HttpRequest` (+ URL kwargs) returning `HttpResponse`, or raising `Http404`/`PermissionDenied`/`SuspiciousOperation` (-> 404/403/400). An FBV is just a plain function.',
      'Shortcuts: `render(request, template, context, status=)` (renders with request context), `redirect(to)` (302; `to` = URL / view name / model with `get_absolute_url`), `JsonResponse(data, safe=)`, `get_object_or_404(klass_or_qs, **lookup)` / `get_list_or_404` (-> `Http404`).',
      'Method dispatch: `if request.method == "POST": ...` for bespoke flows; `@require_POST` / `@require_GET` / `@require_http_methods([...])` to send a proper `405` (with `Allow` header) on the wrong verb instead of falling through.',
      'NEVER mutate state on `GET` — GET is safe/idempotent, so bots and prefetch will trigger it. Gate writes behind `@require_POST` (or PUT/PATCH/DELETE).',
      '`get_object_or_404(Model.objects.filter(owner=request.user), pk=pk)` = fetch + authorize in one: returns the object only if it is in the scoped queryset, else a clean 404 (does not leak existence like a 403 would).',
      'Decorators execute TOP-TO-BOTTOM on the request (top = outermost). Put auth/permission decorators OUTERMOST so anonymous/forbidden requests are redirected/403\'d before the method check or business logic. `@require_POST` above `@login_required` is the classic mistake (anonymous GET -> 405 instead of login redirect).',
      '`@login_required` -> 302 to `LOGIN_URL?next=...` for `AnonymousUser`. `@permission_required("app.codename", raise_exception=True)` -> 403 for a logged-in user lacking it (without `raise_exception`, it redirects to login — usually wrong).',
      'FBVs are the right default for bespoke logic (webhooks, reports, wizards, file/stream responses). Generic CBVs (lesson 3) are for plain model CRUD — but you can start with an FBV and refactor.',
    ],
    keyTakeawaysHi: [
      'Ek view = ek callable jо `HttpRequest` (+ URL kwargs) leता hai aur `HttpResponse` lautाता hai, ya `Http404`/`PermissionDenied`/`SuspiciousOperation` raise karता hai (-> 404/403/400). Ek FBV bस ek plain function hai.',
      'Shortcuts: `render(request, template, context, status=)`, `redirect(to)` (302; `to` = URL / view name / model), `JsonResponse(data, safe=)`, `get_object_or_404(klass_or_qs, **lookup)` / `get_list_or_404` (-> `Http404`).',
      'Method dispatch: bespoke flows ke liye `if request.method == "POST": ...`; galat verb par ek uचित `405` (`Allow` header ke saath) bhejने ke liye `@require_POST` / `@require_GET` / `@require_http_methods([...])`.',
      'KABHI `GET` par state mutate mat karो — GET safe/idempotent hai, toh bots aur prefetch ise trigger karेंge. Writes ko `@require_POST` ke peeche gate karो.',
      '`get_object_or_404(Model.objects.filter(owner=request.user), pk=pk)` = ek mein fetch + authorize: object sirf tab lautाता hai agar wo scoped queryset mein hai, warna ek saaf 404.',
      'Decorators request par TOP-TO-BOTTOM execute hote hain (top = outermost). Auth/permission decorators ko OUTERMOST rakhо. `@require_POST` `@login_required` ke upar classic galti hai (anonymous GET -> 405 login redirect ke bजाy).',
      '`@login_required` -> `AnonymousUser` ke liye `LOGIN_URL?next=...` par 302. `@permission_required("app.codename", raise_exception=True)` -> ek logged-in user ke liye 403.',
      'FBVs bespoke logic (webhooks, reports, wizards) ke liye sahi default hain. Generic CBVs (lesson 3) plain model CRUD ke liye — par aap ek FBV se shuru karके refactor kar sakte ho.',
    ],
  },

  {
    slug: 'dj-class-based-views',
    title: 'Class-Based Views: as_view(), dispatch, and Why They Exist',
    titleHi: 'Class-Based Views: as_view(), dispatch, Aur Wo Kyun Maujूd Hain',
    description: 'A class-based view is a class whose `as_view()` returns a view function. The base `View` routes the request to a `get()` / `post()` method by name. The point is not "classes are nicer" — it is that behaviour becomes attributes and methods you can override and share through mixins.',
    descriptionHi: 'Ek class-based view ek class hai jiska `as_view()` ek view function lautाता hai. Base `View` request ko naam se ek `get()` / `post()` method par route karта hai. Point "classes achhे hain" nahi hai — ye hai ki behaviour attributes aur methods ban jाता hai jinhe aap override aur mixins ke zariye share kar sakte ho.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A switchboard that routes by the caller\'s request type, with a socket for every standard behaviour.** A function view is one operator who does everything by hand. A class-based view is a switchboard: the caller says "GET" and the board patches them to the `get` handler; "POST" goes to `post`; an unknown verb hits the `http_method_not_allowed` jack and returns a 405. That routing lives in one method, `dispatch`. The real value is the panel of labelled sockets around it — `template_name`, `queryset`, `login_url`, `success_url`, `paginate_by` — and the fact that you can snap in a pre-built module (a mixin) that already knows how to, say, require login, or paginate a list, or bind a form. You are not writing the wiring; you are choosing which standard modules to plug in and relabelling the few sockets that differ for your case. And because a fresh switchboard is assembled for every call, two calls never cross wires — `as_view()` builds a new instance per request.',
      hi: '**Ek switchboard jо caller ke request type se route karता hai, har standard behaviour ke liye ek socket ke saath.** Ek function view ek operator hai jо sab kuch haath se karता hai. Ek class-based view ek switchboard hai: caller "GET" kehता hai aur board unhe `get` handler par patch karता hai; "POST" `post` par jाता hai; ek anjaan verb `http_method_not_allowed` jack ko hit karता hai aur ek 405 lautाता hai. Wo routing ek method mein rehта hai, `dispatch`. Asli value iske aas-paas labelled sockets ka panel hai — `template_name`, `queryset`, `login_url`, `success_url`, `paginate_by` — aur ye tathya ki aap ek pre-built module (ek mixin) snap kar sakte ho jо pehle se jaanता hai, kaise login require karना, ya ek list paginate karна. Aur kyunki har call ke liye ek fresh switchboard assemble hoता hai, do calls kabhi wires cross nahi karती — `as_view()` prati request ek naya instance banाता hai.',
    },

    simple: `**The smallest CBV**

\`\`\`python
from django.views import View
from django.http import HttpResponse, JsonResponse

class PingView(View):
    def get(self, request):
        return HttpResponse("pong")
    def post(self, request):
        return JsonResponse({"received": request.POST.dict()}, status=201)

# in urls.py -- as_view() turns the class into a view function:
path("ping/", PingView.as_view(), name="ping")
\`\`\`

**How a request flows through a View**

\`\`\`
URL -> PingView.as_view()(request)      # a fresh PingView() instance is created
  -> view.setup(request, *args, **kwargs)   # stores self.request, self.args, self.kwargs
  -> view.dispatch(request)                  # looks at request.method.lower()
       -> if "get" in http_method_names and hasattr(self, "get"):  self.get(request)
       -> else:  self.http_method_not_allowed(request)   # -> 405 with Allow header
\`\`\`

**Attributes over arguments**

\`\`\`python
class AboutView(TemplateView):
    template_name = "pages/about.html"       # class attribute, not a call arg
    extra_context = {"section": "company"}

# override via as_view() for a one-off:
path("legal/", TemplateView.as_view(template_name="pages/legal.html"))
\`\`\`

**Override the hooks, not the flow**

\`\`\`python
class ReportView(View):
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)   # ALWAYS call super

    def get(self, request):
        return JsonResponse(build_report())
\`\`\`

**Decorating a CBV**

\`\`\`python
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

@method_decorator(login_required, name="dispatch")     # apply to the whole class
class SecureView(View): ...

class SecureView2(View):
    @method_decorator(login_required)                   # apply to one method
    def get(self, request): ...
# or, for auth specifically, use the mixin:  class SecureView3(LoginRequiredMixin, View): ...
\`\`\`

\`\`\`
View.as_view(**initkwargs)   -> a view function; initkwargs become instance attributes
  http_method_names = ["get","post","put","patch","delete","head","options","trace"]
  setup(request, *args, **kwargs)   dispatch(request, *args, **kwargs)
  get/post/put/patch/delete/head/options   -- implement the ones you support
  http_method_not_allowed(request)   -> 405   options(request) -> 200 with Allow
  a NEW instance per request -> safe to set self.x in dispatch/get

TemplateView   template_name, get_context_data()   RedirectView   url, pattern_name, permanent
method_decorator(dec, name="dispatch")   to apply a function decorator to a CBV method
LoginRequiredMixin / PermissionRequiredMixin / UserPassesTestMixin   -- lesson 3 / Module 6
\`\`\``,

    simpleHi: `**Sabse chhota CBV**

\`\`\`python
from django.views import View
from django.http import HttpResponse, JsonResponse

class PingView(View):
    def get(self, request):
        return HttpResponse("pong")
    def post(self, request):
        return JsonResponse({"received": request.POST.dict()}, status=201)

# urls.py mein -- as_view() class ko ek view function banाता hai:
path("ping/", PingView.as_view(), name="ping")
\`\`\`

**Ek request ek View se kaise bahती hai**

\`\`\`
URL -> PingView.as_view()(request)      # ek fresh PingView() instance banता hai
  -> view.setup(request, *args, **kwargs)   # self.request, self.args, self.kwargs store karता hai
  -> view.dispatch(request)                  # request.method.lower() dekhता hai
       -> if hasattr(self, "get"):  self.get(request)
       -> else:  self.http_method_not_allowed(request)   # -> 405 Allow header ke saath
\`\`\`

**Arguments par attributes**

\`\`\`python
class AboutView(TemplateView):
    template_name = "pages/about.html"       # class attribute, ek call arg nahi
    extra_context = {"section": "company"}

# ek one-off ke liye as_view() ke zariye override:
path("legal/", TemplateView.as_view(template_name="pages/legal.html"))
\`\`\`

**Hooks override karो, flow nahi**

\`\`\`python
class ReportView(View):
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)   # HAMESHA super call karो

    def get(self, request):
        return JsonResponse(build_report())
\`\`\`

**Ek CBV ko decorate karna**

\`\`\`python
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

@method_decorator(login_required, name="dispatch")     # poori class par lागू
class SecureView(View): ...

class SecureView2(View):
    @method_decorator(login_required)                   # ek method par lागू
    def get(self, request): ...
# ya, auth ke liye, mixin istemal karो:  class SecureView3(LoginRequiredMixin, View): ...
\`\`\`

\`\`\`
View.as_view(**initkwargs)   -> ek view function; initkwargs instance attributes ban jाते hain
  http_method_names = ["get","post","put","patch","delete","head","options","trace"]
  setup()   dispatch()   get/post/put/patch/delete/head/options
  http_method_not_allowed(request)   -> 405   options(request) -> 200 Allow ke saath
  prati request ek NAYA instance -> dispatch/get mein self.x set karna surakshit

TemplateView   template_name, get_context_data()   RedirectView   url, pattern_name, permanent
method_decorator(dec, name="dispatch")   ek function decorator ko ek CBV method par lागू karने ko
LoginRequiredMixin / PermissionRequiredMixin / UserPassesTestMixin   -- lesson 3 / Module 6
\`\`\``,

    content: `## \`as_view()\` and the request flow

\`SomeView.as_view()\` returns a **closure** — a plain function \`view(request, *args, **kwargs)\`. When a request arrives:

1. \`view()\` creates a **fresh instance**: \`self = SomeView(**initkwargs)\`.
2. \`self.setup(request, *args, **kwargs)\` — stores \`self.request\`, \`self.args\`, \`self.kwargs\`.
3. \`self.dispatch(request, *args, **kwargs)\` — the router.
4. \`dispatch\` lowercases \`request.method\`, checks it is in \`self.http_method_names\` and that the instance has a method of that name, and calls it: \`self.get(request, ...)\`. If not, \`self.http_method_not_allowed(request)\` returns a \`405\` with an \`Allow\` header listing the implemented handlers.
5. The handler returns an \`HttpResponse\`.

Because a new instance is created per request, **you may safely assign to \`self\`** in \`dispatch\`, \`get\`, etc. — no cross-request leakage (unlike a middleware instance, which is shared). \`SomeView(**initkwargs)\` also means the class *cannot* define \`__init__\` with required args.

## Attributes, not call arguments

CBVs configure behaviour with **class attributes** that methods read:

\`\`\`python
class ArticleListView(ListView):
    model = Article
    template_name = "articles/list.html"
    context_object_name = "articles"
    paginate_by = 20
    ordering = ["-published_at"]
\`\`\`

Any of these can be overridden per-URL by passing them to \`as_view()\`:

\`\`\`python
path("drafts/", ArticleListView.as_view(queryset=Article.objects.filter(status="draft"),
                                        template_name="articles/drafts.html"))
\`\`\`

\`as_view()\` rejects an \`initkwarg\` that is not already a class attribute (so a typo fails loudly).

## Override hooks, always call \`super()\`

The generic CBV machinery is a chain of small methods. You override the one you need and call \`super()\` so the rest of the chain runs:

\`\`\`python
class OrgReportView(TemplateView):
    template_name = "org/report.html"

    def dispatch(self, request, *args, **kwargs):
        self.org = get_object_or_404(Org, slug=kwargs["slug"])
        if not self.org.can_view(request.user):
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)     # continue to get()

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)              # get the base context
        ctx["org"] = self.org
        ctx["metrics"] = self.org.compute_metrics()
        return ctx
\`\`\`

Forgetting \`super()\` silently drops everything the parent method did — the classic CBV bug (a missing \`csrf_token\` in context, an empty page, a permission check that never runs).

## \`TemplateView\` and \`RedirectView\`

- **\`TemplateView\`** — renders \`template_name\` with \`get_context_data()\`. Use for static-ish pages that still need the template layer (nav, auth-aware header). \`extra_context={...}\` for constants.
- **\`RedirectView\`** — a configurable redirect. \`url="/new/"\` or \`pattern_name="app:new"\`, \`permanent=True/False\`, \`query_string=True\` to forward the query.

## Decorating a CBV

A function decorator (\`login_required\`, \`cache_page\`, \`csrf_exempt\`) cannot go directly on a class or a method — wrap it:

\`\`\`python
from django.utils.decorators import method_decorator

# on the whole class (applied to dispatch):
@method_decorator(login_required, name="dispatch")
class SettingsView(TemplateView): ...

# on one method:
class SettingsView(TemplateView):
    @method_decorator(cache_page(60))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
\`\`\`

For authentication and permissions specifically, prefer the **mixins** — \`LoginRequiredMixin\`, \`PermissionRequiredMixin\`, \`UserPassesTestMixin\` (from \`django.contrib.auth.mixins\`) — which are cleaner and composable (Module 6). A mixin must come **before** the view base in the MRO: \`class X(LoginRequiredMixin, ListView)\`.

## FBV vs CBV — the honest trade

CBVs shine for the CRUD family (lesson 3) because the generic views encode the whole list/detail/create/update/delete flow and you override a couple of hooks. They are worse than an FBV when the logic is a straight line — the machinery adds indirection, and a reader has to know the MRO and which method to look in. Many teams use generic CBVs for model CRUD and FBVs for everything else; some avoid CBVs entirely in favour of FBVs plus DRF for APIs. Both are valid; know how to read both.`,

    contentHi: `## \`as_view()\` aur request flow

\`SomeView.as_view()\` ek **closure** lautाता hai — ek plain function \`view(request, *args, **kwargs)\`. Jab ek request aati hai:

1. \`view()\` ek **fresh instance** banाता hai: \`self = SomeView(**initkwargs)\`.
2. \`self.setup(request, *args, **kwargs)\` — \`self.request\`, \`self.args\`, \`self.kwargs\` store karता hai.
3. \`self.dispatch(request, *args, **kwargs)\` — router.
4. \`dispatch\` \`request.method\` lowercase karता hai, check karता hai ki ye \`self.http_method_names\` mein hai aur instance ke paas us naam ki ek method hai, aur ise call karता hai: \`self.get(request, ...)\`. Agar nahi, \`self.http_method_not_allowed(request)\` ek \`405\` lautाता hai.
5. Handler ek \`HttpResponse\` lautाता hai.

Kyunki prati request ek naya instance banता hai, **aap surakshit roop se \`self\` ko assign kar sakte ho** \`dispatch\`, \`get\` mein — koi cross-request leakage nahi.

## Attributes, call arguments nahi

CBVs behaviour ko **class attributes** se configure karते hain:

\`\`\`python
class ArticleListView(ListView):
    model = Article
    template_name = "articles/list.html"
    context_object_name = "articles"
    paginate_by = 20
\`\`\`

Inmें se koi bhi per-URL override ho sakta hai unhe \`as_view()\` ko pass karके. \`as_view()\` ek \`initkwarg\` reject karता hai jо pehle se ek class attribute nahi (toh ek typo loudly fail hoता hai).

## Hooks override karो, hamesha \`super()\` call karो

\`\`\`python
class OrgReportView(TemplateView):
    def dispatch(self, request, *args, **kwargs):
        self.org = get_object_or_404(Org, slug=kwargs["slug"])
        if not self.org.can_view(request.user):
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["org"] = self.org
        return ctx
\`\`\`

\`super()\` bhoolना chupchaap sab kuch drop karता hai jо parent method ne kiya — classic CBV bug.

## \`TemplateView\` aur \`RedirectView\`

- **\`TemplateView\`** — \`template_name\` ko \`get_context_data()\` ke saath render karता hai.
- **\`RedirectView\`** — ek configurable redirect. \`url=\` ya \`pattern_name=\`, \`permanent=\`, \`query_string=True\`.

## Ek CBV ko decorate karna

\`\`\`python
from django.utils.decorators import method_decorator

@method_decorator(login_required, name="dispatch")
class SettingsView(TemplateView): ...
\`\`\`

Auth aur permissions ke liye, **mixins** prefer karो — \`LoginRequiredMixin\` — jо cleaner hain (Module 6). Ek mixin MRO mein view base se **pehle** aana chahिए: \`class X(LoginRequiredMixin, ListView)\`.

## FBV vs CBV — imaandaar sौda

CBVs CRUD family (lesson 3) ke liye chamakते hain. Wo ek FBV se bदtar hain jab logic ek straight line hai. Kai teams model CRUD ke liye generic CBVs aur baaki sab ke liye FBVs istemal karती hain. Dono valid hain; dono padhна jaano.`,

    examples: [
      {
        title: 'as_view(), dispatch routing by method, and 405 for the rest',
        titleHi: 'as_view(), method se dispatch routing, aur baaki ke liye 405',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], MIDDLEWARE=[], USE_TZ=True, TEMPLATES=[])
django.setup()

from django.views import View
from django.http import HttpResponse, JsonResponse
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.test import Client

@method_decorator(csrf_exempt, name="dispatch")
class ItemView(View):
    def get(self, request, pk):
        return JsonResponse({"id": int(pk), "method": "get"})
    def post(self, request, pk):
        return JsonResponse({"id": int(pk), "created": True}, status=201)
    def delete(self, request, pk):
        return HttpResponse(status=204)
    # no put() -> a PUT gets 405

urlpatterns = [path("items/<int:pk>/", ItemView.as_view(), name="item")]

c = Client()
print("GET:", c.get("/items/5/").json())
print("POST:", c.post("/items/5/").status_code, c.post("/items/5/").json())
print("DELETE:", c.delete("/items/5/").status_code)
r = c.put("/items/5/", content_type="application/json")
print("PUT (no handler) -> 405:", r.status_code, "| Allow:", sorted(r["Allow"].split(", ")))
o = c.options("/items/5/")
print("OPTIONS -> 200, Allow:", sorted(o["Allow"].split(", ")))`,
        output: `GET: {'id': 5, 'method': 'get'}
POST: 201 {'id': 5, 'created': True}
DELETE: 204
PUT (no handler) -> 405: 405 | Allow: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST']
OPTIONS -> 200, Allow: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST']
`,
        explain: '`ItemView.as_view()` returns a view function; each request builds a fresh `ItemView()` and calls `dispatch`, which routes `GET` -> `get()`, `POST` -> `post()`, `DELETE` -> `delete()` by method name. There is no `put()`, so `dispatch` calls `http_method_not_allowed`, returning `405` with an `Allow` header listing exactly the handlers that exist (plus the auto-provided `HEAD`/`OPTIONS`). `OPTIONS` is handled for free and returns the same `Allow` list. `@method_decorator(csrf_exempt, name="dispatch")` applies the function decorator to the whole class.',
        explainHi: '`ItemView.as_view()` ek view function lautाता hai; har request ek fresh `ItemView()` banाता hai aur `dispatch` call karता hai, jо method naam se `GET` -> `get()`, `POST` -> `post()` route karता hai. Koi `put()` nahi, toh `dispatch` `http_method_not_allowed` call karता hai, `405` lautाता hai ek `Allow` header ke saath jо bilkul un handlers ko list karता hai jо maujूd hain. `OPTIONS` muft handle hoता hai.',
      },
      {
        title: 'Overriding dispatch and get_context_data (and always calling super)',
        titleHi: 'dispatch aur get_context_data override karna (aur hamesha super call karna)',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates",
                "DIRS": [], "APP_DIRS": False,
                "OPTIONS": {"loaders": [("django.template.loaders.locmem.Loader", {
                    "report.html": "{{ team }}: {{ member_count }} members, lead={{ lead }}"})]}}])
django.setup()

from django.db import models, connection
from django.views.generic import TemplateView
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from django.urls import path
from django.test import Client, RequestFactory

class Team(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=50)
    lead = models.CharField(max_length=50)
    is_private = models.BooleanField(default=False)
    class Meta:
        app_label = "__main__"

class Member(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="members")
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Team); se.create_model(Member)
t = Team.objects.create(slug="core", name="Core", lead="Ada")
Member.objects.bulk_create([Member(team=t) for _ in range(4)])
Team.objects.create(slug="secret", name="Secret", lead="Bo", is_private=True)

class TeamReportView(TemplateView):
    template_name = "report.html"

    def dispatch(self, request, *args, **kwargs):
        self.team = get_object_or_404(Team, slug=kwargs["slug"])
        if self.team.is_private:
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)     # -> get() -> render

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)              # base context (view, etc.)
        ctx["team"] = self.team.name
        ctx["lead"] = self.team.lead
        ctx["member_count"] = self.team.members.count()
        return ctx

urlpatterns = [path("t/<slug:slug>/", TeamReportView.as_view())]

c = Client(raise_request_exception=False)
print("public team:", c.get("/t/core/").content.decode())
print("private team -> 403:", c.get("/t/secret/").status_code)
print("missing team -> 404:", c.get("/t/nope/").status_code)`,
        output: `public team: Core: 4 members, lead=Ada
private team -> 403: 403
missing team -> 404: 404
`,
        explain: '`dispatch` is overridden to fetch `self.team` and enforce access *before* the request reaches `get()` — and it calls `super().dispatch(...)` so the normal flow (route to `get`, render the template) still happens. `get_context_data` is overridden to add `team`, `lead`, `member_count`, and it calls `super().get_context_data(**kwargs)` first so the base context (which includes `view` and anything from context processors) is preserved. Skipping either `super()` call would break the view silently.',
        explainHi: '`dispatch` override kiya gaya `self.team` fetch karने aur access enforce karने ko *pehle* ki request `get()` tak pahुँche — aur ye `super().dispatch(...)` call karता hai taaki normal flow abhi bhi ho. `get_context_data` override kiya gaya `team`, `lead`, `member_count` add karने ko, aur ye pehle `super().get_context_data(**kwargs)` call karता hai taaki base context surakshit rahe. Koi bhi `super()` call skip karna view ko chupchaap toड़ता.',
      },
      {
        title: 'A fresh instance per request: self is safe to mutate',
        titleHi: 'Prati request ek fresh instance: self mutate karna surakshit hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], MIDDLEWARE=[], USE_TZ=True, TEMPLATES=[])
django.setup()

from django.views import View
from django.http import JsonResponse
from django.urls import path
from django.test import Client

# a class-level counter would leak across requests; an instance attr does not
class CounterView(View):
    shared_class_counter = 0        # DANGER: shared across all requests

    def get(self, request):
        CounterView.shared_class_counter += 1     # mutates class state -> leaks
        self.request_local = request.GET.get("x", "none")   # per-instance -> safe
        return JsonResponse({
            "class_counter": CounterView.shared_class_counter,
            "request_local": self.request_local,
        })

urlpatterns = [path("c/", CounterView.as_view())]

c = Client()
print(c.get("/c/?x=a").json())
print(c.get("/c/?x=b").json())
print(c.get("/c/?x=c").json())
print("-> class_counter accumulates (shared); request_local reflects THIS request")
# prove a new instance per request:
import gc
before = len([o for o in gc.get_objects() if type(o).__name__ == "CounterView"])
c.get("/c/"); c.get("/c/")
print("CounterView instances are short-lived (created per request, then GC'd)")`,
        output: `{'class_counter': 1, 'request_local': 'a'}
{'class_counter': 2, 'request_local': 'b'}
{'class_counter': 3, 'request_local': 'c'}
-> class_counter accumulates (shared); request_local reflects THIS request
CounterView instances are short-lived (created per request, then GC'd)
`,
        explain: '`as_view()` builds a **new `CounterView()` for every request**, so `self.request_local` set in `get()` belongs only to that request — no leakage, unlike a middleware instance which is shared. But a **class attribute** like `shared_class_counter` is one object shared by every instance, so mutating it (`CounterView.shared_class_counter += 1`) leaks state across requests and, under threads, races. Rule: read config from class attributes, write per-request data to `self`, never mutate class-level state in a handler.',
        explainHi: '`as_view()` **har request ke liye ek naya `CounterView()`** banाता hai, toh `get()` mein set kiya `self.request_local` sirf us request ka hai — koi leakage nahi. Par ek **class attribute** jaise `shared_class_counter` ek object hai jо har instance dwara share hoता hai, toh ise mutate karna requests ke paar state leak karता hai aur, threads ke tahat, race karता hai. Niyam: config class attributes se padhо, per-request data `self` par likhо, kabhi ek handler mein class-level state mutate mat karो.',
      },
    ],

    mistakes: [
      {
        wrong: `class ProfileView(TemplateView):
    template_name = "profile.html"

    def get_context_data(self, **kwargs):
        return {"user": self.request.user}     # dropped super() -> lost the base context
# template's {% csrf_token %}, {{ view }}, and context-processor vars are all missing`,
        right: `def get_context_data(self, **kwargs):
    ctx = super().get_context_data(**kwargs)   # base context first
    ctx["user"] = self.request.user
    return ctx`,
        why: 'Every generic CBV method is a link in a chain. `get_context_data` on `ContextMixin` returns the base context (the `view` object, `extra_context`, and whatever the parent classes add); skipping `super()` returns only your dict, silently losing everything else — a subtle bug where the template renders but the CSRF token or a context-processor variable is gone. The rule is universal: override a CBV hook, call `super()`, then add your part.',
        whyHi: 'Har generic CBV method ek chain mein ek link hai. `ContextMixin` par `get_context_data` base context lautाता hai; `super()` skip karna sirf aapka dict lautाता hai, chupchaap baaki sab kho deता hai. Niyam universal hai: ek CBV hook override karो, `super()` call karो, phir apna hissa add karो.',
      },
      {
        wrong: `class DashboardView(ListView, LoginRequiredMixin):   # WRONG ORDER
    model = Order
# LoginRequiredMixin's dispatch is never reached -> the auth check does nothing`,
        right: `class DashboardView(LoginRequiredMixin, ListView):   # mixin FIRST
    model = Order`,
        why: 'Python resolves methods left-to-right along the MRO. `LoginRequiredMixin` works by overriding `dispatch` to check auth and then calling `super().dispatch()`. If `ListView` comes first, its `dispatch` (via `View`) runs and returns a response before the mixin\'s `dispatch` is ever consulted. Auth/permission mixins — and mixins in general — must be listed **before** the concrete view base.',
        whyHi: 'Python methods ko MRO ke saath left-to-right resolve karता hai. `LoginRequiredMixin` `dispatch` override karके auth check karता hai aur phir `super().dispatch()` call karता hai. Agar `ListView` pehle aata hai, iska `dispatch` chalता hai aur mixin ke `dispatch` se salah lिye bina ek response lautाता hai. Auth/permission mixins concrete view base se **pehle** listed hone chahिए.',
      },
      {
        wrong: `@login_required                    # a function decorator directly on a class
class SecureView(View):
    def get(self, request): ...
# TypeError: this decorator expects a function, not a class`,
        right: `@method_decorator(login_required, name="dispatch")
class SecureView(View):
    def get(self, request): ...
# or the mixin:
class SecureView(LoginRequiredMixin, View):
    def get(self, request): ...`,
        why: 'Function-based view decorators (`login_required`, `cache_page`, `csrf_exempt`, `require_POST`) wrap a callable that takes `(request, ...)`. A CBV class is not that. Use `method_decorator(dec, name="dispatch")` to apply the decorator to a named method of the class, or `@method_decorator(dec)` directly on the method. For auth specifically, the mixins are cleaner and compose with other mixins.',
        whyHi: 'Function-based view decorators (`login_required`, `cache_page`, `csrf_exempt`) ek callable ko wrap karते hain jо `(request, ...)` leता hai. Ek CBV class wo nahi hai. `method_decorator(dec, name="dispatch")` istemal karो, ya method par seedhे `@method_decorator(dec)`. Auth ke liye, mixins cleaner hain.',
      },
    ],

    realWorld: [
      {
        en: '**A project-wide base CBV carries the cross-cutting concerns** — `class BaseView(LoginRequiredMixin, View)` with a shared `handle_no_permission`, a `get_context_data` that adds the current tenant/org, common error handling. App views subclass it, so auth and context are consistent without repeating decorators.',
        hi: '**Ek project-wide base CBV cross-cutting concerns le jाता hai** — `class BaseView(LoginRequiredMixin, View)` ek shared `handle_no_permission`, ek `get_context_data` jо current tenant add karता hai. App views ise subclass karती hain.',
      },
      {
        en: '**`TemplateView` + `get_context_data` is the standard "mostly static but needs the layout" page** — an about page, a pricing page, a dashboard landing that shows a few counts. `RedirectView` handles URL migrations (`path("old-blog/<slug>/", RedirectView.as_view(pattern_name="blog:detail", permanent=True))`).',
        hi: '**`TemplateView` + `get_context_data` standard "zyादातر static par layout chahिए" page hai** — ek about page, ek pricing page. `RedirectView` URL migrations handle karता hai.',
      },
      {
        en: '**Teams that use DRF for APIs often keep server-rendered pages on generic CBVs and skip FBVs there** — `ListView`/`DetailView`/`CreateView` for the admin-lite CRUD screens, DRF `ViewSet`s for the JSON API (Module 5). The `method_decorator` / mixin knowledge transfers: DRF\'s `APIView` is a `View` subclass.',
        hi: '**Teams jо APIs ke liye DRF istemal karती hain aksar server-rendered pages generic CBVs par rakhती hain** — CRUD screens ke liye `ListView`/`DetailView`/`CreateView`, JSON API ke liye DRF `ViewSet`s (Module 5). DRF ka `APIView` ek `View` subclass hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does `as_view()` do, and how does a request get routed to `get()` or `post()`?',
        qHi: '`as_view()` kya karता hai, aur ek request `get()` ya `post()` par kaise route hoती hai?',
        a: 'as_view is a class method that returns a closure — an ordinary function with the signature of a view, taking request and any URL keyword arguments. You put that function in the URLconf. When a request comes in and the resolver calls it, the closure does four things. First it instantiates the class, passing any keyword arguments that were given to as_view, which become instance attributes; this is why the view class cannot have an init that requires arguments, and why a fresh instance exists for every single request. Second it calls setup on the instance, which stashes the request, the positional args, and the keyword args onto self as self dot request, self dot args, self dot kwargs. Third it calls dispatch. Dispatch is the router: it takes request dot method, lowercases it, checks that the lowercase name is in the class attribute http_method_names and that the instance actually has a method by that name, and if so calls it, passing request and the URL kwargs. So a GET request is dispatched to the get method, a POST to post, a DELETE to delete, and so on. If there is no matching handler — say the view implements get but the request is a PUT — dispatch calls http_method_not_allowed, which returns a 405 response with an Allow header listing exactly the handlers that do exist, plus the automatically provided HEAD and OPTIONS. Fourth, whatever the handler returns, which must be an HttpResponse, is returned back out. The key consequences are that per-request state can be set on self safely because the instance is not shared, and that behaviour is configured through class attributes and overridable methods rather than function arguments, which is what makes mixins possible.',
        aHi: 'as_view ek class method hai jо ek closure lautाता hai — ek saadharan function jiska signature ek view ka hai, request aur koi URL keyword arguments leता hai. Aap us function ko URLconf mein rakhते ho. Jab ek request aati hai aur resolver ise call karता hai, closure chaar cheezein karता hai. Pehle ye class instantiate karता hai, as_view ko diye koi keyword arguments pass karके, jо instance attributes ban jाte hain; isiliye har ek request ke liye ek fresh instance maujूd hai. Doosra ye instance par setup call karता hai, jо request, args, aur kwargs ko self par stash karता hai. Teesra ye dispatch call karता hai. Dispatch router hai: ye request dot method leता hai, lowercase karता hai, check karता hai ki lowercase naam http_method_names mein hai aur instance ke paas us naam ki ek method hai, aur agar hai toh ise call karता hai. Toh ek GET request get method par dispatch hoती hai, ek POST post par. Agar koi matching handler nahi, dispatch http_method_not_allowed call karता hai, jо ek Allow header ke saath ek 405 lautाता hai. Mukhya parinaम ye hain ki per-request state self par surakshit set ho sakta hai, aur behaviour class attributes se configure hoता hai.',
      },
      {
        q: 'When you override a CBV method like `get_context_data` or `dispatch`, why must you call `super()`, and what breaks if you do not?',
        qHi: 'Jab aap ek CBV method jaise `get_context_data` ya `dispatch` override karते ho, aapko `super()` kyun call karna chahिए, aur na karो toh kya tootता hai?',
        a: 'Generic class-based views are built as a cooperative chain of small methods spread across several mixin classes, and each method in the chain is expected to call the same method on its parent via super so the whole chain runs. get_context_data is the clearest example. The base implementation on ContextMixin builds a context dictionary containing the view object itself under the key view, anything set in the extra_context attribute, and, as you go up the class hierarchy for a ListView or DetailView, the object list or the single object. Your override typically adds a few keys specific to your page. If you return your own dictionary without calling super and merging, you drop everything the parents contributed. The page may still render, so the bug is silent, but the template loses access to view, to any context-processor-independent additions, and for a DetailView it would lose the object itself. dispatch is similar: the base dispatch on View does the method routing to get or post. Mixins like LoginRequiredMixin override dispatch to perform their check and then call super dot dispatch to continue. If your override does its work and returns without calling super dot dispatch, the request never gets routed to a handler and you have effectively replaced the entire view with your snippet. And if a mixin is in the chain below your override and you skip super, that mixin\'s check — an auth check, a permission check — never runs, which is a security bug, not just a rendering bug. The rule is mechanical and universal: when you override a CBV hook, call super first, then add or adjust, then return.',
        aHi: 'Generic class-based views ek cooperative chain ke roop mein bane hain jо kai mixin classes mein failе chhote methods se, aur chain mein har method se ummeed hai ki wo super ke zariये apne parent par wahi method call kare taaki poori chain chale. get_context_data sabse saaf udाहरण hai. ContextMixin par base implementation ek context dictionary banाता hai jismें view object khud, extra_context attribute mein set kuch bhi, aur ek ListView ya DetailView ke liye object list ya single object hoता hai. Agar aap super call kiye bina apna dictionary return karते ho, aap sab kuch drop kar dete ho jо parents ne contribute kiya. Page abhi bhi render ho sakta hai, toh bug silent hai. dispatch samaan hai: LoginRequiredMixin jaisे mixins dispatch override karके apna check karते hain aur phir jारी rakhने ko super dot dispatch call karते hain. Agar aap super skip karते ho, us mixin ka check kabhi nahi chalता, jо ek security bug hai. Niyam: super pehle call karो, phir add karो, phir return karो.',
      },
    ],

    exercises: [
      {
        task: 'Write a CBV `WidgetView(View)` (csrf-exempt via `method_decorator` on `dispatch`) with `get(self, request, pk)` returning `JsonResponse({"id": int(pk)})`, `post` returning status 201, and `delete` returning 204. Wire it at `widgets/<int:pk>/`. With `django.test.Client`, check GET/POST/DELETE work and that a `PATCH` returns 405 with an `Allow` header that lists GET, POST, DELETE, HEAD, OPTIONS.',
        taskHi: 'Ek CBV `WidgetView(View)` likhо (`dispatch` par `method_decorator` se csrf-exempt) `get(self, request, pk)`, `post` (201), `delete` (204) ke saath. Ise `widgets/<int:pk>/` par wire karो. Client se check karो GET/POST/DELETE, aur `PATCH` 405 (`Allow` header ke saath).',
        hint: '`@method_decorator(csrf_exempt, name="dispatch")` on the class. `resp["Allow"]` on the 405 is a comma-space string; `sorted(resp["Allow"].split(", "))`. No `patch()` method -> `dispatch` returns 405.',
        hintHi: 'Class par `@method_decorator(csrf_exempt, name="dispatch")`. 405 par `resp["Allow"]` ek comma-space string hai. Koi `patch()` method nahi -> `dispatch` 405.',
      },
      {
        task: 'Model `Doc` (`slug` unique, `title`, `is_archived` bool). Write `DocView(TemplateView)` with `template_name` (use an inline `locmem` template `"{{ title }} ({{ words }})"`). Override `dispatch` to `get_object_or_404(Doc, slug=kwargs["slug"])`, raise `PermissionDenied` if `is_archived`, then `super().dispatch(...)`. Override `get_context_data` to add `title` and `words` (len of title split), calling `super()` first. Test: live doc renders, archived -> 403, missing -> 404.',
        taskHi: '`Doc` (`slug` unique, `title`, `is_archived`) model karो. `DocView(TemplateView)` likhо inline `locmem` template ke saath. `dispatch` override karके `get_object_or_404`, `PermissionDenied` agar `is_archived`, phir `super().dispatch(...)`. `get_context_data` override karके `title` aur `words` add karो, `super()` pehle.',
        hint: '`TEMPLATES` with `OPTIONS.loaders = [("django.template.loaders.locmem.Loader", {"doc.html": "{{ title }} ({{ words }})"})]`. In `dispatch`, store `self.doc`. `get_context_data`: `ctx = super().get_context_data(**kwargs); ctx["title"] = self.doc.title; ...`.',
        hintHi: '`TEMPLATES` `OPTIONS.loaders = [("django.template.loaders.locmem.Loader", {...})]` ke saath. `dispatch` mein `self.doc` store karो. `get_context_data`: `ctx = super().get_context_data(**kwargs); ...`.',
      },
      {
        task: 'Demonstrate the per-request instance. Write `PokeView(View)` with a class attribute `total = 0` and, in `get`, `PokeView.total += 1` and also `self.marker = request.GET.get("m")`. Return `JsonResponse({"total": PokeView.total, "marker": self.marker})`. Hit it 3 times with different `?m=` values and print the JSON each time — show `total` accumulates (class state, shared) while `marker` is per-request.',
        taskHi: 'Per-request instance dikhाओ. `PokeView(View)` likhо ek class attribute `total = 0` ke saath aur, `get` mein, `PokeView.total += 1` aur `self.marker = request.GET.get("m")`. `JsonResponse({"total": PokeView.total, "marker": self.marker})` return karो. Ise 3 baar hit karो.',
        hint: '`PokeView.total` is one shared int -> `+= 1` accumulates across requests (and would race under threads). `self.marker` is on a fresh instance each request -> always reflects the current `?m=`.',
        hintHi: '`PokeView.total` ek shared int hai -> `+= 1` requests ke paar accumulate karता hai. `self.marker` har request ek fresh instance par hai.',
      },
    ],

    keyTakeaways: [
      '`SomeView.as_view(**initkwargs)` returns a view function. Per request it: creates a FRESH `SomeView()` instance, runs `setup()` (stores `self.request`/`args`/`kwargs`), then `dispatch()`.',
      '`dispatch()` routes by method name: `GET` -> `self.get()`, `POST` -> `self.post()`, etc. No matching handler -> `http_method_not_allowed()` -> `405` with an `Allow` header. `HEAD`/`OPTIONS` are handled for free.',
      'A NEW instance per request means you can safely assign `self.x` in `dispatch`/`get` (no cross-request leak — unlike a shared middleware instance). But NEVER mutate a CLASS attribute in a handler — it is shared and races under threads.',
      'Configure with CLASS ATTRIBUTES (`template_name`, `model`, `queryset`, `paginate_by`, `login_url`, `success_url`) that methods read. Override per-URL by passing them to `as_view()` — which rejects an unknown kwarg (typo-safe).',
      'Override the HOOK you need (`dispatch`, `get_context_data`, `get_queryset`, `form_valid`, ...) and ALWAYS call `super()` — the generic CBVs are a cooperative method chain; skipping `super()` silently drops what the parents did (lost context, a skipped auth check, an empty page).',
      'A function decorator (`login_required`, `cache_page`, `csrf_exempt`, `require_POST`) cannot go directly on a class/method — use `@method_decorator(dec, name="dispatch")` on the class or `@method_decorator(dec)` on the method. For auth, prefer the mixins.',
      'Mixins (`LoginRequiredMixin`, `PermissionRequiredMixin`, `UserPassesTestMixin`) must come BEFORE the concrete view base in the class bases: `class X(LoginRequiredMixin, ListView)` — MRO is left-to-right, and the mixin overrides `dispatch` then calls `super()`.',
      '`TemplateView` (`template_name` + `get_context_data`) for mostly-static pages that need the template layer. `RedirectView` (`url`/`pattern_name`, `permanent`, `query_string`) for URL migrations. Generic CRUD CBVs are lesson 3.',
    ],
    keyTakeawaysHi: [
      '`SomeView.as_view(**initkwargs)` ek view function lautाता hai. Prati request ye: ek FRESH `SomeView()` instance banाता hai, `setup()` chalाता hai, phir `dispatch()`.',
      '`dispatch()` method naam se route karता hai: `GET` -> `self.get()`, `POST` -> `self.post()`. Koi matching handler nahi -> `http_method_not_allowed()` -> `405` ek `Allow` header ke saath. `HEAD`/`OPTIONS` muft handle hote hain.',
      'Prati request ek NAYA instance matlab aap `dispatch`/`get` mein `self.x` surakshit assign kar sakte ho. Par KABHI ek handler mein ek CLASS attribute mutate mat karो — wo shared hai aur threads ke tahat race karता hai.',
      'CLASS ATTRIBUTES (`template_name`, `model`, `queryset`, `paginate_by`, `login_url`, `success_url`) se configure karो. Per-URL override unhe `as_view()` ko pass karके — jо ek anjaan kwarg reject karता hai.',
      'Jо HOOK chahिए use override karो (`dispatch`, `get_context_data`, `get_queryset`, `form_valid`) aur HAMESHA `super()` call karो — generic CBVs ek cooperative method chain hain; `super()` skip karna chupchaap wo drop karता hai jо parents ne kiya.',
      'Ek function decorator (`login_required`, `cache_page`, `csrf_exempt`) class/method par seedhे nahi jа sakta — class par `@method_decorator(dec, name="dispatch")` ya method par `@method_decorator(dec)` istemal karो. Auth ke liye, mixins prefer karो.',
      'Mixins (`LoginRequiredMixin`, `PermissionRequiredMixin`) class bases mein concrete view base se PEHLE aane chahिए: `class X(LoginRequiredMixin, ListView)` — MRO left-to-right hai.',
      '`TemplateView` (`template_name` + `get_context_data`) zyादातर-static pages ke liye. `RedirectView` URL migrations ke liye. Generic CRUD CBVs lesson 3 hain.',
    ],
  },

  {
    slug: 'dj-generic-class-based-views',
    title: 'Generic CBVs: ListView, DetailView, CreateView, and the Mixin Chain',
    titleHi: 'Generic CBVs: ListView, DetailView, CreateView, Aur Mixin Chain',
    description: 'The generic class-based views encode the whole list / show one / create / update / delete flow. You set a `model` and a `template_name`, override two or three hooks, and get pagination, form handling, and redirects for free — as long as you know which method to reach into.',
    descriptionHi: 'Generic class-based views poore list / ek dikhाओ / create / update / delete flow ko encode karते hain. Aap ek `model` aur ek `template_name` set karते ho, do-teen hooks override karते ho, aur pagination, form handling, aur redirects muft paते ho — jab tak aap jaanते ho ki kaunsी method mein pahुँchना hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A flat-pack furniture kit: the frame is built, you choose the finish and the few custom cuts.** `ListView` is the "shelf unit" kit — it already knows how to fetch a set of rows, split them into pages, put them in a context variable, and render a template. You are not assembling the pagination logic; you supply the wood (`model` or `queryset`), the label on the front (`context_object_name`), how many per shelf (`paginate_by`), and the finish (`template_name`). If your shelf needs a non-standard cut — only published rows, ordered by date, with the author joined in — you reach into exactly one slot, `get_queryset`, and return the queryset you want; the rest of the kit still works. `CreateView` and `UpdateView` are the "cabinet with a door" kits: they build the form from your model, validate it on POST, save it, and redirect — and you reach into `form_valid` to set the owner or fire a notification, and `get_success_url` to say where the door leads. The skill is knowing the slots by name.',
      hi: '**Ek flat-pack furniture kit: frame banा hua hai, aap finish aur kuch custom cuts chunते ho.** `ListView` "shelf unit" kit hai — ye pehle se jaanता hai kaise rows ka ek set fetch karна, unhe pages mein split karना, ek context variable mein daalна, aur ek template render karना. Aap pagination logic assemble nahi kar rahe; aap lakdी (`model` ya `queryset`) supply karते ho, front par label (`context_object_name`), prati shelf kितne (`paginate_by`), aur finish (`template_name`). Agar aapki shelf ko ek non-standard cut chahिए — sirf published rows, date se ordered — aap bilkul ek slot mein pahुँchते ho, `get_queryset`, aur jо queryset chahिए wo return karते ho. `CreateView` aur `UpdateView` "door waala cabinet" kits hain: wo aapke model se form banाते hain, POST par validate karते hain, save karते hain, aur redirect karते hain. Kौशल slots ko naam se jaanna hai.',
    },

    simple: `**The five you use**

\`\`\`python
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView

class PostListView(ListView):
    model = Post
    paginate_by = 20
    # -> template  post_list.html,  context var  post_list  (+  object_list),  page_obj,  paginator

class PostDetailView(DetailView):
    model = Post
    # -> template  post_detail.html,  context var  post  (+  object),  looked up by  <pk> or <slug>

class PostCreateView(CreateView):
    model = Post
    fields = ["title", "body", "status"]     # or  form_class = PostForm
    success_url = "/posts/"
    # -> template  post_form.html,  GET renders the form,  POST validates + saves + redirects

class PostUpdateView(UpdateView):
    model = Post
    fields = ["title", "body", "status"]
    # -> same as CreateView but pre-filled from the object;  template  post_form.html

class PostDeleteView(DeleteView):
    model = Post
    success_url = "/posts/"
    # -> template  post_confirm_delete.html,  GET confirms,  POST deletes + redirects
\`\`\`

**The override points (reach into ONE, call super where relevant)**

\`\`\`python
class PostListView(ListView):
    paginate_by = 20

    def get_queryset(self):
        return (Post.objects.filter(status="published")
                .select_related("author").order_by("-published_at"))   # your queryset

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)          # ALWAYS super() first
        ctx["featured"] = Post.objects.filter(featured=True)[:3]
        return ctx

class PostCreateView(CreateView):
    form_class = PostForm

    def get_form_kwargs(self):
        kw = super().get_form_kwargs()
        kw["user"] = self.request.user                   # pass the user into the form
        return kw

    def form_valid(self, form):
        form.instance.author = self.request.user         # set a field the form does not expose
        response = super().form_valid(form)              # saves, sets self.object, builds the redirect
        notify_subscribers(self.object)
        return response

    def get_success_url(self):
        return reverse("blog:detail", kwargs={"slug": self.object.slug})
\`\`\`

**The URL wiring**

\`\`\`python
urlpatterns = [
    path("", PostListView.as_view(), name="list"),
    path("<slug:slug>/", PostDetailView.as_view(), name="detail"),   # DetailView reads <slug> or <pk>
    path("new/", PostCreateView.as_view(), name="create"),
    path("<slug:slug>/edit/", PostUpdateView.as_view(), name="edit"),
    path("<slug:slug>/delete/", PostDeleteView.as_view(), name="delete"),
]
\`\`\`

\`\`\`
ListView       queryset / model / get_queryset ; ordering ; paginate_by ; context_object_name
               template  <app>/<model>_list.html ; ctx  object_list + <model>_list, page_obj, paginator
DetailView     queryset / model / get_object ; slug_field / slug_url_kwarg / pk_url_kwarg
               template  <app>/<model>_detail.html ; ctx  object + <model>
CreateView     fields=[...] or form_class ; success_url or get_success_url() or model.get_absolute_url()
UpdateView       template  <app>/<model>_form.html ; hooks  get_form_kwargs, form_valid, form_invalid
DeleteView     success_url ; template  <app>/<model>_confirm_delete.html ; POST deletes

MRO (ListView) = View -> TemplateResponseMixin -> BaseListView -> MultipleObjectMixin -> ContextMixin
override:  get_queryset  get_context_data  get_object  form_valid  get_success_url  get_form_kwargs
\`\`\``,

    simpleHi: `**Paanch jо aap istemal karते ho**

\`\`\`python
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView

class PostListView(ListView):
    model = Post
    paginate_by = 20
    # -> template  post_list.html,  context var  post_list  (+  object_list),  page_obj,  paginator

class PostDetailView(DetailView):
    model = Post
    # -> template  post_detail.html,  context var  post  (+  object),  <pk> ya <slug> se lookup

class PostCreateView(CreateView):
    model = Post
    fields = ["title", "body", "status"]     # ya  form_class = PostForm
    success_url = "/posts/"

class PostUpdateView(UpdateView):
    model = Post
    fields = ["title", "body", "status"]

class PostDeleteView(DeleteView):
    model = Post
    success_url = "/posts/"
\`\`\`

**Override points (EK mein pahुँchо, jahaan relevant ho super call karो)**

\`\`\`python
class PostListView(ListView):
    paginate_by = 20

    def get_queryset(self):
        return (Post.objects.filter(status="published")
                .select_related("author").order_by("-published_at"))

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)          # HAMESHA super() pehle
        ctx["featured"] = Post.objects.filter(featured=True)[:3]
        return ctx

class PostCreateView(CreateView):
    form_class = PostForm

    def form_valid(self, form):
        form.instance.author = self.request.user         # ek field set jо form expose nahi karता
        response = super().form_valid(form)              # save karता hai, self.object set, redirect banाता hai
        notify_subscribers(self.object)
        return response

    def get_success_url(self):
        return reverse("blog:detail", kwargs={"slug": self.object.slug})
\`\`\`

**URL wiring**

\`\`\`python
urlpatterns = [
    path("", PostListView.as_view(), name="list"),
    path("<slug:slug>/", PostDetailView.as_view(), name="detail"),
    path("new/", PostCreateView.as_view(), name="create"),
    path("<slug:slug>/edit/", PostUpdateView.as_view(), name="edit"),
]
\`\`\`

\`\`\`
ListView       queryset / model / get_queryset ; ordering ; paginate_by ; context_object_name
               template  <app>/<model>_list.html ; ctx  object_list + <model>_list, page_obj, paginator
DetailView     queryset / model / get_object ; slug_field / slug_url_kwarg / pk_url_kwarg
CreateView     fields=[...] ya form_class ; success_url ya get_success_url() ya model.get_absolute_url()
UpdateView       template  <app>/<model>_form.html ; hooks  get_form_kwargs, form_valid, form_invalid
DeleteView     success_url ; template  <app>/<model>_confirm_delete.html ; POST delete karता hai

override:  get_queryset  get_context_data  get_object  form_valid  get_success_url  get_form_kwargs
\`\`\``,

    content: `## What each generic view does

Each generic CBV is a stack: \`View\` at the base for routing, a \`...ResponseMixin\` for rendering, a \`Base...View\` for the GET/POST logic, and a \`...ObjectMixin\` / \`FormMixin\` for the data. You subclass the concrete name and configure it.

### \`ListView\`

GET fetches a queryset, optionally paginates it, and renders a template.

- **Queryset**: \`model = Post\` (uses \`Post.objects.all()\`), or \`queryset = Post.objects.filter(...)\`, or override \`get_queryset(self)\` (the flexible option — use \`self.request\`, \`self.kwargs\`).
- **Ordering**: \`ordering = ["-date"]\` or in \`get_queryset\`.
- **Pagination**: \`paginate_by = 20\` — the template gets \`page_obj\` (a \`Page\`), \`paginator\`, \`is_paginated\`; the URL takes \`?page=N\`.
- **Context**: \`object_list\`, plus \`<model>_list\` (e.g. \`post_list\`), overridable with \`context_object_name = "posts"\`.
- **Template**: \`<app_label>/<model>_list.html\` by default; override \`template_name\`.

### \`DetailView\`

GET fetches one object by \`pk\` or \`slug\` from the URL and renders a template.

- **Lookup**: \`pk_url_kwarg = "pk"\` (default) or \`slug_field = "slug"\` + \`slug_url_kwarg = "slug"\`. Override \`get_object(self)\` for anything custom (e.g. scope by owner).
- **Context**: \`object\` + \`<model>\` (e.g. \`post\`).
- **Template**: \`<app>/<model>_detail.html\`.

### \`CreateView\` / \`UpdateView\`

GET renders a form; POST validates and saves.

- **The form**: \`fields = ["a", "b"]\` builds a \`ModelForm\` automatically, or \`form_class = MyForm\` for a hand-written one (lesson 4).
- **UpdateView** additionally fetches the object (like \`DetailView\`) and binds the form to it.
- **Hooks**:
  - \`get_form_kwargs(self)\` — inject data into the form (\`self.request.user\`, initial values).
  - \`form_valid(self, form)\` — runs when the form is valid. Set fields the form does not expose (\`form.instance.owner = ...\`), then \`super().form_valid(form)\` (which saves, sets \`self.object\`, and returns the redirect), then side effects.
  - \`form_invalid(self, form)\` — re-render with errors (default is fine; override to add context).
- **Redirect target**: \`success_url = "/x/"\`, or \`get_success_url(self)\` (dynamic — use \`self.object\`), or the model's \`get_absolute_url()\` if neither is set.
- **Template**: \`<app>/<model>_form.html\` (shared by Create and Update).

### \`DeleteView\`

GET renders a confirmation page (\`<model>_confirm_delete.html\`); POST deletes and redirects to \`success_url\`. Override \`get_queryset\` to scope what can be deleted.

### \`FormView\`

A form that is not tied to a model (contact form, search, a wizard step). \`form_class\`, \`template_name\`, \`success_url\`, \`form_valid\` — same hooks, no \`model\`.

## The MRO and where a method lives

For \`ListView\` the MRO is roughly:

\`\`\`
ListView -> MultipleObjectTemplateResponseMixin -> TemplateResponseMixin
         -> BaseListView -> MultipleObjectMixin -> ContextMixin -> View
\`\`\`

- \`get_queryset\`, \`get_context_object_name\`, \`paginate_queryset\` -> **\`MultipleObjectMixin\`**
- \`get_context_data\` -> **\`ContextMixin\`** (and extended by \`MultipleObjectMixin\`)
- \`get\`, the GET flow -> **\`BaseListView\`**
- \`render_to_response\`, \`get_template_names\` -> **\`TemplateResponseMixin\`**
- \`dispatch\`, \`http_method_not_allowed\` -> **\`View\`**

You do not memorise this, but when you need to override behaviour you look up which mixin owns the method (the Django docs and \`ccbv.co.uk\` list every method per view) and override it in your subclass, calling \`super()\`.

## Adding auth and scoping

\`\`\`python
class MyOrdersListView(LoginRequiredMixin, ListView):
    template_name = "orders/mine.html"
    context_object_name = "orders"
    paginate_by = 25

    def get_queryset(self):
        return (Order.objects
                .filter(customer=self.request.user)     # scope to the current user
                .select_related("customer")
                .prefetch_related("items")
                .order_by("-created_at"))
\`\`\`

\`get_queryset\` is the single most-overridden hook: it is where filtering, scoping, \`select_related\`/\`prefetch_related\` (Module 3), and ordering go. For \`DetailView\`/\`UpdateView\`/\`DeleteView\`, overriding \`get_queryset\` also scopes which single object is reachable — \`get_object\` runs \`get()\` against it, so a wrong owner yields a 404.

## When a generic CBV is the wrong tool

If you find yourself overriding \`get\`, \`post\`, and \`dispatch\` and half the mixin methods, the generic view is fighting you — drop to a plain \`View\` or an FBV. Generic CBVs pay off when your view *is* "list/detail/create/update/delete this model with a filter and a template". The moment it is materially more than that, the indirection costs more than the boilerplate it saves.`,

    contentHi: `## Har generic view kya karता hai

Har generic CBV ek stack hai: routing ke liye base par \`View\`, rendering ke liye ek \`...ResponseMixin\`, GET/POST logic ke liye ek \`Base...View\`, aur data ke liye ek \`...ObjectMixin\` / \`FormMixin\`.

### \`ListView\`

GET ek queryset fetch karता hai, optionally ise paginate karता hai, aur ek template render karता hai.

- **Queryset**: \`model = Post\`, ya \`queryset = Post.objects.filter(...)\`, ya \`get_queryset(self)\` override karो (flexible option).
- **Pagination**: \`paginate_by = 20\` — template ko \`page_obj\`, \`paginator\`, \`is_paginated\` milता hai; URL \`?page=N\` leता hai.
- **Context**: \`object_list\`, plus \`<model>_list\`, \`context_object_name = "posts"\` se overridable.
- **Template**: \`<app_label>/<model>_list.html\`.

### \`DetailView\`

GET ek object ko URL se \`pk\` ya \`slug\` se fetch karता hai.

- **Lookup**: \`pk_url_kwarg\` ya \`slug_field\` + \`slug_url_kwarg\`. \`get_object(self)\` override karो kisi bhi custom ke liye.
- **Context**: \`object\` + \`<model>\`.

### \`CreateView\` / \`UpdateView\`

GET ek form render karता hai; POST validate aur save karता hai.

- **Form**: \`fields = ["a", "b"]\` ek \`ModelForm\` automatically banाता hai, ya \`form_class = MyForm\`.
- **Hooks**:
  - \`get_form_kwargs(self)\` — form mein data inject karो.
  - \`form_valid(self, form)\` — jab form valid ho. Fields set jо form expose nahi karता, phir \`super().form_valid(form)\`, phir side effects.
  - \`form_invalid(self, form)\` — errors ke saath re-render.
- **Redirect target**: \`success_url\`, ya \`get_success_url(self)\`, ya model ka \`get_absolute_url()\`.
- **Template**: \`<app>/<model>_form.html\`.

### \`DeleteView\`

GET ek confirmation page render karता hai; POST delete karता hai aur redirect karता hai.

### \`FormView\`

Ek form jо ek model se juda nahi (contact form, search). \`form_class\`, \`template_name\`, \`success_url\`, \`form_valid\`.

## MRO aur ek method kahaan rehता hai

\`ListView\` ke liye MRO roughly:

\`\`\`
ListView -> ... -> BaseListView -> MultipleObjectMixin -> ContextMixin -> View
\`\`\`

- \`get_queryset\`, \`paginate_queryset\` -> **\`MultipleObjectMixin\`**
- \`get_context_data\` -> **\`ContextMixin\`**
- \`get\` -> **\`BaseListView\`**
- \`dispatch\` -> **\`View\`**

Aap ise yaad nahi karते, par jab aapko behaviour override karna ho aap dekhते ho kaunsा mixin method own karता hai aur ise apni subclass mein override karते ho, \`super()\` call karके.

## Auth aur scoping add karna

\`\`\`python
class MyOrdersListView(LoginRequiredMixin, ListView):
    def get_queryset(self):
        return (Order.objects.filter(customer=self.request.user)
                .select_related("customer").prefetch_related("items")
                .order_by("-created_at"))
\`\`\`

\`get_queryset\` sabse zyada override kiya hook hai: yahaan filtering, scoping, \`select_related\`/\`prefetch_related\` (Module 3) jाते hain. \`DetailView\`/\`UpdateView\`/\`DeleteView\` ke liye, \`get_queryset\` override karna ye bhi scope karता hai ki kaunsा single object reachable hai — ek galat owner ek 404 deता hai.

## Jab ek generic CBV galat tool hai

Agar aap khud ko \`get\`, \`post\`, \`dispatch\` aur aadhे mixin methods override karते paते ho, generic view aapse lad raha hai — ek plain \`View\` ya ek FBV par gir jाओ.`,

    examples: [
      {
        title: 'ListView with pagination and a scoped get_queryset',
        titleHi: 'Pagination aur ek scoped get_queryset ke saath ListView',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates",
                "DIRS": [], "APP_DIRS": False, "OPTIONS": {"loaders": [
        ("django.template.loaders.locmem.Loader", {"posts.html":
         "page {{ page_obj.number }}/{{ paginator.num_pages }}: "
         "{% for p in posts %}{{ p.title }} {% endfor %}"})]}}])
django.setup()

from django.db import models, connection
from django.views.generic import ListView
from django.urls import path
from django.test import Client

class Post(models.Model):
    title = models.CharField(max_length=50)
    status = models.CharField(max_length=20, default="published")
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Post)
Post.objects.bulk_create(
    [Post(title=f"P{i}", status="published" if i % 4 else "draft") for i in range(23)])

class PostListView(ListView):
    template_name = "posts.html"
    context_object_name = "posts"
    paginate_by = 5

    def get_queryset(self):
        return Post.objects.filter(status="published").order_by("id")   # drafts (i % 4 == 0) excluded

urlpatterns = [path("", PostListView.as_view())]

c = Client()
print("page 1:", c.get("/").content.decode().strip())
print("page 2:", c.get("/?page=2").content.decode().strip())
r = c.get("/?page=99")
print("page 99 -> 404:", r.status_code)
print("total published:", Post.objects.filter(status="published").count(), "-> 4 pages of 5")`,
        output: `page 1: page 1/4: P1 P2 P3 P5 P6
page 2: page 2/4: P7 P9 P10 P11 P13
page 99 -> 404: 404
total published: 17 -> 4 pages of 5
`,
        explain: '`ListView` with `paginate_by = 5` splits `get_queryset()` into pages: the template gets `page_obj` (the current `Page`), `paginator` (with `num_pages`), and `posts` (this page\'s 5 objects, via `context_object_name`). `?page=N` selects the page; `?page=99` (out of range) returns a `404`. `get_queryset` is overridden to return only published posts, ordered — the standard place for filtering, ordering, and `select_related`/`prefetch_related`. Everything else — the template name (`posts.html`), the context wiring, the pagination — is the generic view\'s job.',
        explainHi: '`ListView` `paginate_by = 5` ke saath `get_queryset()` ko pages mein split karता hai: template ko `page_obj` (current `Page`), `paginator` (`num_pages` ke saath), aur `posts` (is page ke 5 objects) milता hai. `?page=N` page select karता hai; `?page=99` (out of range) ek `404` lautाता hai. `get_queryset` override kiya gaya sirf published posts lautाने ko — filtering, ordering ke liye standard jagah.',
      },
      {
        title: 'DetailView + UpdateView with get_queryset scoping and form_valid',
        titleHi: 'get_queryset scoping aur form_valid ke saath DetailView + UpdateView',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "DIRS": [],
                "APP_DIRS": False, "OPTIONS": {"loaders": [
        ("django.template.loaders.locmem.Loader", {
            "note_detail.html": "{{ note.title }}: {{ note.body }} (edits={{ note.edit_count }})",
            "note_form.html": "{% for f in form %}{{ f.label }} {% endfor %}{{ form.errors }}"})]}}])
django.setup()

from django.db import models, connection
from django.views.generic import DetailView, UpdateView
from django.urls import path
from django.test import Client
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

class Note(models.Model):
    slug = models.SlugField(unique=True)
    owner = models.CharField(max_length=20)
    title = models.CharField(max_length=100)
    body = models.TextField(blank=True)
    edit_count = models.IntegerField(default=0)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Note)
Note.objects.create(slug="a", owner="ada", title="Ada note", body="hi")
Note.objects.create(slug="b", owner="bo", title="Bo note", body="yo")

CURRENT_USER = "ada"   # pretend this is request.user

class NoteDetailView(DetailView):
    model = Note
    slug_field = "slug"
    template_name = "note_detail.html"
    def get_queryset(self):
        return Note.objects.filter(owner=CURRENT_USER)     # scope: only my notes

@method_decorator(csrf_exempt, name="dispatch")
class NoteUpdateView(UpdateView):
    model = Note
    fields = ["title", "body"]
    template_name = "note_form.html"
    def get_queryset(self):
        return Note.objects.filter(owner=CURRENT_USER)
    def form_valid(self, form):
        form.instance.edit_count = form.instance.edit_count + 1   # a field not in 'fields'
        return super().form_valid(form)                           # saves, redirects
    def get_success_url(self):
        return f"/n/{self.object.slug}/"

urlpatterns = [
    path("n/<slug:slug>/", NoteDetailView.as_view(), name="note-detail"),
    path("n/<slug:slug>/edit/", NoteUpdateView.as_view(), name="note-edit"),
]

c = Client()
print("my note:", c.get("/n/a/").content.decode())
print("someone else's note -> 404:", c.get("/n/b/").status_code)
r = c.post("/n/a/edit/", {"title": "Ada note v2", "body": "updated"})
print("edit redirect:", r.status_code, "->", r["Location"])
n = Note.objects.get(slug="a")
print("after edit:", n.title, "| edit_count:", n.edit_count)
print("editing someone else's -> 404:", c.post("/n/b/edit/", {"title": "x"}).status_code)`,
        output: `my note: Ada note: hi (edits=0)
someone else's note -> 404: 404
edit redirect: 302 -> /n/a/
after edit: Ada note v2 | edit_count: 1
editing someone else's -> 404: 404
`,
        explain: 'Both views override `get_queryset` to `Note.objects.filter(owner=CURRENT_USER)` — so `DetailView`/`UpdateView` can only reach the current user\'s notes; asking for someone else\'s slug is a `404` (not a `403`, which would confirm it exists). `UpdateView` builds a `ModelForm` from `fields = ["title", "body"]`, validates the POST, and `form_valid` sets `edit_count` (a field *not* in the form) before `super().form_valid(form)` saves and redirects to `get_success_url()`. This is the whole edit flow — form, validation, save, redirect, scoping — in ~15 lines.',
        explainHi: 'Dono views `get_queryset` ko `Note.objects.filter(owner=CURRENT_USER)` mein override karते hain — toh `DetailView`/`UpdateView` sirf current user ke notes tak pahुँch sakte hain; kisi aur ka slug maangना ek `404` hai (`403` nahi). `UpdateView` `fields = ["title", "body"]` se ek `ModelForm` banाता hai, POST validate karता hai, aur `form_valid` `edit_count` (ek field jо form mein *nahi*) set karता hai `super().form_valid(form)` save aur redirect karne se pehle.',
      },
      {
        title: 'LoginRequiredMixin + get_queryset: auth and scoping together',
        titleHi: 'LoginRequiredMixin + get_queryset: auth aur scoping saath',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True, LOGIN_URL="/login/",
    SESSION_ENGINE="django.contrib.sessions.backends.signed_cookies",
    MIDDLEWARE=["django.contrib.sessions.middleware.SessionMiddleware",
               "django.contrib.auth.middleware.AuthenticationMiddleware"],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "DIRS": [],
                "APP_DIRS": False, "OPTIONS": {"loaders": [
        ("django.template.loaders.locmem.Loader",
         {"tasks.html": "{% for t in tasks %}{{ t.title }} {% endfor %}"})]}}])
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.db import models, connection
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView
from django.urls import path
from django.test import Client

class Task(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=100)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Task)
ada = User.objects.create_user("ada", password="pw")
bo = User.objects.create_user("bo", password="pw")
Task.objects.bulk_create([Task(owner=ada, title=f"Ada-{i}") for i in range(3)] +
                         [Task(owner=bo, title="Bo-secret")])

class MyTasksView(LoginRequiredMixin, ListView):
    template_name = "tasks.html"
    context_object_name = "tasks"
    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user).order_by("title")

urlpatterns = [path("tasks/", MyTasksView.as_view())]

anon, c_ada = Client(), Client()
c_ada.force_login(ada)

r = anon.get("/tasks/")
print("anonymous -> redirect to login:", r.status_code, r["Location"][:22])
print("ada's tasks (scoped, no Bo-secret):", c_ada.get("/tasks/").content.decode().strip())`,
        output: `anonymous -> redirect to login: 302 /login/?next=/tasks/
ada's tasks (scoped, no Bo-secret): Ada-0 Ada-1 Ada-2
`,
        explain: '`class MyTasksView(LoginRequiredMixin, ListView)` — the mixin comes **first**, so its `dispatch` runs, sees `AnonymousUser`, and redirects to `LOGIN_URL?next=...` before the list logic. For a logged-in user, `get_queryset` filters to `owner=self.request.user`, so Ada sees only her three tasks and never `Bo-secret`. Auth (the mixin) and row-level scoping (`get_queryset`) are separate concerns handled in separate places — this is the canonical shape of a "my things" list view.',
        explainHi: '`class MyTasksView(LoginRequiredMixin, ListView)` — mixin **pehle** aata hai, toh iska `dispatch` chalता hai, `AnonymousUser` dekhता hai, aur list logic se pehle `LOGIN_URL?next=...` par redirect karता hai. Ek logged-in user ke liye, `get_queryset` `owner=self.request.user` par filter karता hai, toh Ada sirf apne teen tasks dekhती hai aur kabhi `Bo-secret` nahi. Auth (mixin) aur row-level scoping (`get_queryset`) alag concerns hain.',
      },
    ],

    mistakes: [
      {
        wrong: `class ArticleListView(ListView):
    model = Article
    template_name = "articles.html"
# template does {{ a.author.name }} for each article -> N+1 (Module 3)`,
        right: `class ArticleListView(ListView):
    template_name = "articles.html"
    def get_queryset(self):
        return Article.objects.select_related("author").prefetch_related("tags")`,
        why: 'Setting only `model = Article` makes `get_queryset` return `Article.objects.all()` — no `select_related`/`prefetch_related`. If the template (or serializer, in DRF) walks a relation per row, that is an N+1 that scales with page size. `get_queryset` is exactly where query optimisation belongs on a generic view; override it to return the queryset your template actually needs.',
        whyHi: 'Sirf `model = Article` set karna `get_queryset` ko `Article.objects.all()` return karवाता hai — koi `select_related`/`prefetch_related` nahi. Agar template prati row ek relation chhoota hai, wo ek N+1 hai jо page size ke saath scale karता hai. `get_queryset` bilkul wahaan hai jahaan query optimisation ek generic view par rehта hai.',
      },
      {
        wrong: `class PostCreateView(CreateView):
    model = Post
    fields = ["title", "body", "author", "status", "internal_notes"]
# 'author' and 'internal_notes' are now user-editable form fields -> mass assignment`,
        right: `class PostCreateView(CreateView):
    model = Post
    fields = ["title", "body"]              # only what the user should set

    def form_valid(self, form):
        form.instance.author = self.request.user   # server sets sensitive fields
        return super().form_valid(form)`,
        why: 'Every name in `fields` becomes an editable form input the user can submit. Listing `author`, `status`, `owner`, `is_staff`, price fields, or internal columns lets a user set them via a crafted POST — the mass-assignment vulnerability. Put only user-facing fields in `fields`; set anything sensitive or server-controlled in `form_valid` on `form.instance` before `super().form_valid()`.',
        whyHi: '`fields` mein har naam ek editable form input ban jाता hai jise user submit kar sakta hai. `author`, `status`, `owner`, `is_staff`, price fields list karna ek user ko unhe ek crafted POST se set karने deता hai — mass-assignment vulnerability. `fields` mein sirf user-facing fields rakhो; kuch bhi sensitive `super().form_valid()` se pehle `form.instance` par `form_valid` mein set karो.',
      },
      {
        wrong: `class OrderDetailView(DetailView):
    model = Order
# any logged-in user can view /orders/<pk>/ for ANY order by guessing the id`,
        right: `class OrderDetailView(LoginRequiredMixin, DetailView):
    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)
# a non-owner's pk is simply not in the queryset -> 404`,
        why: 'A `DetailView` with just `model = Order` fetches any `Order` by the URL `pk` with no ownership check — an insecure direct object reference (IDOR). Scope `get_queryset` to what the current user is allowed to see; `get_object` then looks up the URL `pk` *within that queryset*, so another user\'s order returns a 404 (correctly, without confirming it exists). This applies equally to `UpdateView` and `DeleteView`.',
        whyHi: 'Sirf `model = Order` waala ek `DetailView` kisi bhi `Order` ko URL `pk` se fetch karता hai bina ownership check ke — ek insecure direct object reference (IDOR). `get_queryset` ko us tak scope karो jо current user dekh sakta hai; `get_object` phir URL `pk` ko *us queryset ke andar* lookup karता hai, toh ek doosre user ka order ek 404 lautाता hai. Ye `UpdateView` aur `DeleteView` par barabar lागू hoता hai.',
      },
    ],

    realWorld: [
      {
        en: '**Internal tools and admin-lite screens are mostly generic CBVs** — `ListView` for the table (with `get_queryset` doing the filter + `select_related` + ordering), `DetailView`/`UpdateView`/`DeleteView` for the row actions, all behind `LoginRequiredMixin`/`PermissionRequiredMixin`. Fast to build, consistent, and the override points cover the 10% that is custom.',
        hi: '**Internal tools aur admin-lite screens zyादातर generic CBVs hain** — table ke liye `ListView` (`get_queryset` filter + `select_related` + ordering karता), row actions ke liye `DetailView`/`UpdateView`/`DeleteView`, sab `LoginRequiredMixin`/`PermissionRequiredMixin` ke peeche.',
      },
      {
        en: '**`get_queryset` is where every list/detail view does scoping and optimisation** — filter to the tenant/user, `select_related` the FKs the template renders, `prefetch_related` the reverse sets, order. A code review of a new CBV checks: is `get_queryset` scoped for authz, and is it optimised for the template? (Module 3, Module 6.)',
        hi: '**`get_queryset` wahaan hai jahaan har list/detail view scoping aur optimisation karта hai** — tenant/user par filter, template jо FKs render karता hai unhe `select_related`, reverse sets ko `prefetch_related`, order. Ek naye CBV ka code review check karता hai: kya `get_queryset` authz ke liye scoped hai?',
      },
      {
        en: '**`form_valid` is the standard place to set server-controlled fields and fire post-save side effects** — `form.instance.created_by = self.request.user`, `super().form_valid(form)`, then `send_notification(self.object)` / `audit_log(...)` / `enqueue_task(self.object.pk)`. Keeps the form limited to user input and the view in charge of the rest.',
        hi: '**`form_valid` server-controlled fields set karने aur post-save side effects fire karने ki standard jagah hai** — `form.instance.created_by = self.request.user`, `super().form_valid(form)`, phir `send_notification(self.object)`.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through what `CreateView` does on a GET and on a POST, and which methods you override for what.',
        qHi: 'GET aur POST par `CreateView` kya karта hai, aur aap kis ke liye kaunsी methods override karते ho, samjhाओ.',
        a: 'CreateView combines a form-handling layer and a template-response layer over the base view routing. On a GET, dispatch routes to the get method, which builds a form instance — either a ModelForm generated from the fields attribute you listed, or the form_class you supplied — with no data bound, puts it in the context under the key form, and renders the template, which defaults to app-label slash model-name underscore form dot html. On a POST, dispatch routes to post, which builds the form bound to request dot POST and request dot FILES, then calls form dot is_valid. If the form is valid, it calls form_valid, passing the form; the base form_valid saves the form, which for a ModelForm creates the object, assigns it to self dot object, and returns a redirect to the success URL. If the form is invalid, it calls form_invalid, which re-renders the template with the same bound form so the errors display, and returns a 200. The override points, from outside in: get_form_kwargs, to inject extra data into the form constructor such as the current user or initial values — you call super, add to the dict, return it. get_form_class or form_class or fields, to control which form is used. form_valid, which is where you set fields the form does not expose, like form dot instance dot owner equals self dot request dot user, then call super dot form_valid to actually save and get the redirect, then run post-save side effects like sending a notification using self dot object. form_invalid, if you need to add context to the error re-render. And the redirect target, controlled by success_url as a static string, get_success_url as a method when it depends on the saved object, or falling back to the model\'s get_absolute_url. UpdateView is the same except it also fetches the existing object first, like DetailView, using get_queryset and get_object, and binds the form to it so the fields are pre-filled and the save is an update.',
        aHi: 'CreateView ek form-handling layer aur ek template-response layer ko base view routing ke upar combine karта hai. Ek GET par, dispatch get method par route karता hai, jо ek form instance banाता hai — ya fields attribute se generate ki ModelForm, ya jо form_class aapne diya — bina data bound ke, ise context mein form key ke tahat rakhता hai, aur template render karता hai. Ek POST par, dispatch post par route karता hai, jо request dot POST se bound form banाता hai, phir form dot is_valid call karता hai. Agar form valid hai, ye form_valid call karता hai; base form_valid form save karता hai, object ko self dot object ko assign karता hai, aur success URL par ek redirect lautाता hai. Agar invalid, ye form_invalid call karता hai, jо same bound form ke saath template re-render karता hai. Override points: get_form_kwargs form constructor mein extra data inject karne ko; form_valid jahaan aap wo fields set karते ho jо form expose nahi karता, phir super dot form_valid; aur redirect target, success_url ya get_success_url se controlled.',
      },
      {
        q: 'Why is `get_queryset` the most important hook to override, both for correctness and security?',
        qHi: '`get_queryset` correctness aur security dono ke liye sabse mahatvapoorn hook kyun hai override karने ko?',
        a: 'get_queryset is the single method that decides which rows a list, detail, update, or delete view can see and act on, and it is where you attach the query optimisations. For correctness and performance, a bare model attribute makes get_queryset return all rows with no select_related or prefetch_related, so any relation the template walks per row becomes an N-plus-one that scales with page size; overriding get_queryset to add the joins and prefetches the template actually needs, plus the filtering and ordering, is how a generic list view stays fast. For security, the crucial point is that DetailView, UpdateView, and DeleteView find their single object by looking up the URL primary key or slug within the queryset that get_queryset returns. If get_queryset is unscoped — just the model — then any authenticated user can view, edit, or delete any object by putting its id in the URL, which is the classic insecure-direct-object-reference vulnerability. Scoping get_queryset to filter by the current user or tenant means another user\'s id is simply not in the queryset, so get_object raises a 404. And a 404 is the right response here, not a 403, because a 403 confirms the object exists, which itself leaks information. So the pattern for a per-user resource view is a LoginRequiredMixin for the authentication gate plus a get_queryset filtered to request dot user for the row-level authorization, and the same get_queryset also carries the select_related and prefetch_related. Reviewers of a new generic view check exactly this: is get_queryset scoped, and is it optimised.',
        aHi: 'get_queryset wo ek method hai jо tay karता hai ki ek list, detail, update, ya delete view kaunsी rows dekh aur unpar act kar sakta hai, aur yahaan aap query optimisations attach karते ho. Correctness aur performance ke liye, ek bare model attribute get_queryset ko saari rows return karवाता hai bina select_related ya prefetch_related ke, toh template jо koi relation prati row chhoota hai wo ek N-plus-one ban jाता hai. Security ke liye, mahatvapoorn baat ye hai ki DetailView, UpdateView, aur DeleteView apna single object URL primary key ya slug ko us queryset ke andar lookup karके dhoondhते hain jо get_queryset return karता hai. Agar get_queryset unscoped hai, toh koi bhi authenticated user kisi bhi object ko URL mein iska id daalकर dekh, edit, ya delete kar sakta hai — classic IDOR vulnerability. get_queryset ko current user se filter karna matlab ek doosre user ka id queryset mein nahi hai, toh get_object ek 404 raise karता hai. Aur ek 404 sahi response hai, ek 403 nahi.',
      },
    ],

    exercises: [
      {
        task: 'Model `Article` (`title`, `status` default `"published"`). Insert 17 published + several drafts. Write `ArticleListView(ListView)` with an inline `locmem` template `"{{ page_obj.number }}/{{ paginator.num_pages }}: {% for a in articles %}{{ a.title }} {% endfor %}"`, `context_object_name="articles"`, `paginate_by=6`, and `get_queryset` returning published articles ordered by title. Test page 1, page 2, page 3, and `?page=99` -> 404. Confirm 3 pages.',
        taskHi: '`Article` (`title`, `status` default `"published"`) model karो. 17 published + kuch drafts insert karो. `ArticleListView(ListView)` likhо inline `locmem` template, `context_object_name="articles"`, `paginate_by=6`, aur `get_queryset` published articles title se ordered ke saath. Pages test karो.',
        hint: '`TEMPLATES` with `OPTIONS.loaders`. `paginate_by=6` over 17 rows -> pages of 6, 6, 5. `?page=99` is out of range -> Django\'s pagination raises `Http404`.',
        hintHi: '`TEMPLATES` `OPTIONS.loaders` ke saath. 17 rows par `paginate_by=6` -> 6, 6, 5 ke pages. `?page=99` out of range -> `Http404`.',
      },
      {
        task: 'Model `Note` (`slug` unique, `owner` CharField, `title`, `body` blank, `version` int default 0). Create notes for owners "ada" and "bo". Set `CURRENT="ada"`. Write `NoteUpdateView(UpdateView)` (csrf-exempt) with `fields=["title","body"]`, `get_queryset` scoped to `owner=CURRENT`, `form_valid` bumping `version` before `super().form_valid`, and `get_success_url` -> `/n/<slug>/`. Test: POST to ada\'s note updates it and bumps version; POST to bo\'s note -> 404.',
        taskHi: '`Note` (`slug` unique, `owner`, `title`, `body` blank, `version` int) model karो. "ada" aur "bo" ke liye notes banाओ. `CURRENT="ada"`. `NoteUpdateView(UpdateView)` likhо (csrf-exempt) `fields=["title","body"]`, `get_queryset` `owner=CURRENT` par scoped, `form_valid` `version` bump karता, `get_success_url`.',
        hint: '`@method_decorator(csrf_exempt, name="dispatch")`. In `form_valid`: `form.instance.version += 1; return super().form_valid(form)`. Because `get_queryset` filters to `owner="ada"`, `get_object` for bo\'s slug is not found -> 404.',
        hintHi: '`@method_decorator(csrf_exempt, name="dispatch")`. `form_valid` mein: `form.instance.version += 1; return super().form_valid(form)`. `get_queryset` `owner="ada"` par filter karता hai.',
      },
      {
        task: 'Model `Project` with `owner = ForeignKey(User)` and `name`. Migrate auth. Write `MyProjectsView(LoginRequiredMixin, ListView)` with an inline template listing `{{ p.name }}` for `projects`, `get_queryset` filtered to `owner=self.request.user`. Create users "ann" and "ben" with projects each. Test: anonymous GET -> 302 to `/login/?next=/projects/`; ann (force_login) sees only her projects, not ben\'s.',
        taskHi: '`Project` model karो `owner = ForeignKey(User)` aur `name` ke saath. Auth migrate karो. `MyProjectsView(LoginRequiredMixin, ListView)` likhо inline template ke saath, `get_queryset` `owner=self.request.user` par filtered. "ann" aur "ben" users banाओ. Test karो.',
        hint: '`LoginRequiredMixin` FIRST in the bases. `call_command("migrate", run_syncdb=True, verbosity=0)`. `Client().force_login(ann)`. Anonymous -> `302` with `Location` starting `/login/?next=`.',
        hintHi: 'Bases mein `LoginRequiredMixin` PEHLE. `call_command("migrate", run_syncdb=True, verbosity=0)`. `Client().force_login(ann)`.',
      },
    ],

    keyTakeaways: [
      'The 5 generic CRUD views: `ListView` (queryset -> paginate -> template), `DetailView` (one object by pk/slug), `CreateView`/`UpdateView` (form on GET, validate+save on POST), `DeleteView` (confirm on GET, delete on POST). `FormView` for a model-less form.',
      'Configure with class attributes: `model`/`queryset`, `template_name` (defaults to `<app>/<model>_list.html` etc.), `context_object_name`, `paginate_by`, `fields=[...]` or `form_class`, `success_url`. Override per-URL via `as_view(...)`.',
      '`get_queryset(self)` is the MOST important hook: it carries filtering, ordering, `select_related`/`prefetch_related` (avoid N+1 — Module 3), AND row-level scoping. For `DetailView`/`UpdateView`/`DeleteView`, `get_object` looks up the URL pk/slug WITHIN `get_queryset` — so scoping it to the user makes another user\'s pk a 404 (not a 403 — no existence leak). This is the IDOR fix.',
      '`form_valid(self, form)`: set server-controlled fields on `form.instance` (e.g. `owner = self.request.user`), then `super().form_valid(form)` (saves, sets `self.object`, returns the redirect), then post-save side effects. `get_form_kwargs` to inject data (the user, initial) into the form.',
      'Only put USER-FACING fields in `fields=[...]` — every name there is an editable input; listing `owner`/`status`/`is_staff`/price fields is a mass-assignment hole.',
      'Redirect target: `success_url` (static), `get_success_url(self)` (dynamic, uses `self.object`), or the model\'s `get_absolute_url()`.',
      'Auth via mixins listed FIRST: `class X(LoginRequiredMixin, ListView)`. MRO is left-to-right; the mixin\'s `dispatch` must run before the view\'s.',
      'ALWAYS `super()` in an overridden hook. Reach into ONE hook. If you\'re overriding `get`+`post`+`dispatch`+half the mixins, the generic view is the wrong tool — use a plain `View` or FBV.',
    ],
    keyTakeawaysHi: [
      '5 generic CRUD views: `ListView` (queryset -> paginate -> template), `DetailView` (pk/slug se ek object), `CreateView`/`UpdateView` (GET par form, POST par validate+save), `DeleteView` (GET par confirm, POST par delete). `FormView` ek model-less form ke liye.',
      'Class attributes se configure karो: `model`/`queryset`, `template_name`, `context_object_name`, `paginate_by`, `fields=[...]` ya `form_class`, `success_url`. Per-URL override `as_view(...)` ke zariye.',
      '`get_queryset(self)` sabse mahatvapoorn hook hai: ye filtering, ordering, `select_related`/`prefetch_related` (N+1 avoid — Module 3), AUR row-level scoping le jाता hai. `DetailView`/`UpdateView`/`DeleteView` ke liye, `get_object` URL pk/slug ko `get_queryset` ke ANDAR lookup karता hai — toh ise user tak scope karna ek doosre user ka pk ek 404 banाता hai. Ye IDOR fix hai.',
      '`form_valid(self, form)`: server-controlled fields `form.instance` par set karो (jaise `owner = self.request.user`), phir `super().form_valid(form)`, phir post-save side effects. `get_form_kwargs` data inject karne ko.',
      'Sirf USER-FACING fields `fields=[...]` mein rakhो — wahaan har naam ek editable input hai; `owner`/`status`/`is_staff` list karna ek mass-assignment hole hai.',
      'Redirect target: `success_url` (static), `get_success_url(self)` (dynamic), ya model ka `get_absolute_url()`.',
      'Auth mixins ke zariye PEHLE listed: `class X(LoginRequiredMixin, ListView)`. MRO left-to-right hai.',
      'HAMESHA overridden hook mein `super()`. EK hook mein pahुँcho. Agar aap `get`+`post`+`dispatch`+aadhे mixins override kar rahe ho, generic view galat tool hai — ek plain `View` ya FBV istemal karो.',
    ],
  },
];
