/**
 * Django Complete Course — Module 5: Django REST Framework, lessons 4-6.
 *
 * Lesson 4: APIView, generic views, ViewSets — the request/response wrappers,
 *           the mixin ladder (get_queryset / get_serializer_class / perform_create),
 *           ViewSet + ModelViewSet + @action, which to use when.
 * Lesson 5: routers, pagination, filtering — DefaultRouter/SimpleRouter + basename,
 *           PageNumberPagination / LimitOffsetPagination / CursorPagination (keyset),
 *           DjangoFilterBackend + FilterSet, SearchFilter, OrderingFilter.
 * Lesson 6: content negotiation, versioning, settings — renderers/parsers, the
 *           Accept header, format suffixes; URLPath/Namespace/AcceptHeader/Query
 *           versioning + request.version; the REST_FRAMEWORK settings block +
 *           the default exception handler.
 *
 * Conventions: see course-django-module5.ts header.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_5_PART2: CourseLesson[] = [
  {
    slug: 'dj-drf-apiview-generics-viewsets',
    title: 'APIView, Generic Views & ViewSets: the Three Rungs',
    titleHi: 'APIView, Generic Views & ViewSets: Teen Seedhिyान',
    description: 'DRF gives you three levels of abstraction for a view. `APIView` is a thin wrapper over Django\'s `View` with DRF\'s request/response/auth/throttle machinery. Generic views add the CRUD flow so you set a `queryset` + `serializer_class` and override a hook or two. `ViewSet` groups the endpoints for one resource into one class a router wires up. You move up a rung for less code, down a rung for more control.',
    descriptionHi: 'DRF ek view ke liye teen levels ki abstraction deता hai. `APIView` Django ke `View` ke upar ek patlा wrapper hai DRF ki request/response/auth/throttle machinery ke saath. Generic views CRUD flow add karते hain toh aap ek `queryset` + `serializer_class` set karके ek-do hook override karte ho. `ViewSet` ek resource ke endpoints ko ek class mein group karता hai jise ek router wire karता hai. Kam code ke liye ek seedhी upar, zyada control ke liye ek neeche.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**Building a kitchen: raw tools, a flat-pack unit, or a fitted range.** `APIView` is a bench with power and plumbing run to it — you get the utilities (authentication, parsing the request body, content negotiation, throttling, exception handling) but you build the cabinets yourself: write `get`, `post`, decide what to query, call the serializer, return a `Response`. A generic view is the flat-pack unit — the drawer runners and hinges are pre-fitted, you supply the wood (`queryset`, `serializer_class`) and choose the finish (override `get_queryset` to scope it, `perform_create` to stamp the owner). A `ViewSet` is the whole fitted range: list, retrieve, create, update, destroy for one resource in a single unit, and a router bolts it to the wall (generates all the URLs) in one line. Same utilities underneath all three — you pick how much carpentry you want to do.',
      hi: '**Ek kitchen banाना: raw tools, ek flat-pack unit, ya ek fitted range.** `APIView` ek bench hai jismें power aur plumbing chalाya gaya hai — aapko utilities milती hain (authentication, request body parsing, content negotiation, throttling, exception handling) par aap cabinets khud banाते ho: `get`, `post` likhо, tay karो kya query karna hai, serializer call karो, ek `Response` lautाओ. Ek generic view flat-pack unit hai — drawer runners aur hinges pre-fitted hain, aap lakdी (`queryset`, `serializer_class`) supply karते ho aur finish chunते ho (`get_queryset` override karके scope, `perform_create` se owner stamp). Ek `ViewSet` poora fitted range hai: ek resource ke liye list, retrieve, create, update, destroy ek unit mein, aur ek router ise deewar par bolt karता hai (saare URLs generate) ek line mein. Teenों ke neeche wahi utilities — aap chunते ho kितni carpentry karni hai.',
    },

    simple: `**\`APIView\` — full control**

\`\`\`python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ArticleList(APIView):
    def get(self, request):
        articles = Article.objects.filter(status="published")
        return Response(ArticleSerializer(articles, many=True).data)

    def post(self, request):
        serializer = ArticleSerializer(data=request.data)       # request.data = parsed body (JSON/form/multipart)
        serializer.is_valid(raise_exception=True)               # -> 400 with errors on failure
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# request.data, request.query_params, request.user, request.auth
# Response(data, status=, headers=)  -- content-negotiated (JSON, browsable API, ...)
\`\`\`

**Generic views — the CRUD flow, batteries in**

\`\`\`python
from rest_framework import generics

class ArticleListCreate(generics.ListCreateAPIView):        # GET (list) + POST (create)
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):                                  # scoping + select_related/prefetch
        return Article.objects.filter(status="published").select_related("author")

    def perform_create(self, serializer):                    # the hook for save(**extra)
        serializer.save(author=self.request.user)

class ArticleDetail(generics.RetrieveUpdateDestroyAPIView):  # GET + PUT + PATCH + DELETE on /articles/<pk>/
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = "slug"                                    # default is "pk"
\`\`\`

The generic classes: \`ListAPIView\`, \`CreateAPIView\`, \`RetrieveAPIView\`, \`UpdateAPIView\`, \`DestroyAPIView\`, and the combos \`ListCreateAPIView\`, \`RetrieveUpdateAPIView\`, \`RetrieveDestroyAPIView\`, \`RetrieveUpdateDestroyAPIView\`.

**Override points (all optional)**

\`\`\`python
get_queryset(self)                 # dynamic queryset -- use self.request, self.kwargs
get_serializer_class(self)         # e.g. list vs detail vs write serializer by self.action / method
get_serializer_context(self)      # add to {"request", "view", "format"}
perform_create(self, serializer)   # serializer.save(owner=...) ; fire side effects
perform_update(self, serializer)
perform_destroy(self, instance)    # soft-delete instead of instance.delete()
get_object(self)                   # custom single-object lookup (default: get_queryset() + lookup_field)
\`\`\`

**\`ViewSet\` — one class per resource, router wires the URLs**

\`\`\`python
from rest_framework import viewsets
from rest_framework.decorators import action

class ArticleViewSet(viewsets.ModelViewSet):               # list + retrieve + create + update + destroy
    serializer_class = ArticleSerializer

    def get_queryset(self):
        return Article.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["post"])                  # POST /articles/<pk>/publish/
    def publish(self, request, pk=None):
        article = self.get_object()
        article.status = "published"; article.save()
        return Response({"status": "published"})

    @action(detail=False)                                   # GET /articles/mine/
    def mine(self, request):
        page = self.paginate_queryset(self.get_queryset())
        return self.get_paginated_response(self.get_serializer(page, many=True).data)

# urls.py
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register("articles", ArticleViewSet, basename="article")
urlpatterns = router.urls
\`\`\`

\`\`\`
APIView          -> write get/post/... yourself ; you get request.data, Response, auth, throttle, negotiation
GenericAPIView   -> + queryset / serializer_class / get_queryset / get_serializer / pagination / filter_backends
mixins           -> ListModelMixin, CreateModelMixin, Retrieve/Update/DestroyModelMixin (the .list()/.create()/... methods)
generics.XxxAPIView = GenericAPIView + the mixins for Xxx, bound to HTTP methods
ViewSet          -> actions (list/retrieve/create/update/partial_update/destroy) not HTTP methods ; needs a router
  ModelViewSet   = ViewSet + all 6 ; ReadOnlyModelViewSet = list + retrieve only
  @action(detail=True|False, methods=[...], url_path=, permission_classes=)  -> extra routes
\`\`\``,

    simpleHi: `**\`APIView\` — poora control**

\`\`\`python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ArticleList(APIView):
    def get(self, request):
        articles = Article.objects.filter(status="published")
        return Response(ArticleSerializer(articles, many=True).data)

    def post(self, request):
        serializer = ArticleSerializer(data=request.data)       # request.data = parsed body
        serializer.is_valid(raise_exception=True)               # -> failure par 400
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
\`\`\`

**Generic views — CRUD flow, batteries andar**

\`\`\`python
from rest_framework import generics

class ArticleListCreate(generics.ListCreateAPIView):        # GET (list) + POST (create)
    serializer_class = ArticleSerializer

    def get_queryset(self):                                  # scoping + select_related/prefetch
        return Article.objects.filter(status="published").select_related("author")

    def perform_create(self, serializer):                    # save(**extra) ka hook
        serializer.save(author=self.request.user)

class ArticleDetail(generics.RetrieveUpdateDestroyAPIView):  # GET + PUT + PATCH + DELETE
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = "slug"                                    # default "pk"
\`\`\`

**Override points (sab optional)**

\`\`\`python
get_queryset(self)                 # dynamic queryset -- self.request, self.kwargs
get_serializer_class(self)         # list vs detail vs write serializer
perform_create(self, serializer)   # serializer.save(owner=...) ; side effects
perform_destroy(self, instance)    # instance.delete() ke bजाy soft-delete
get_object(self)                   # custom single-object lookup
\`\`\`

**\`ViewSet\` — prati resource ek class, router URLs wire karता hai**

\`\`\`python
from rest_framework import viewsets
from rest_framework.decorators import action

class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer

    def get_queryset(self):
        return Article.objects.filter(author=self.request.user)

    @action(detail=True, methods=["post"])                  # POST /articles/<pk>/publish/
    def publish(self, request, pk=None):
        article = self.get_object()
        article.status = "published"; article.save()
        return Response({"status": "published"})

# urls.py
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register("articles", ArticleViewSet, basename="article")
urlpatterns = router.urls
\`\`\`

\`\`\`
APIView          -> get/post/... khud likhо ; request.data, Response, auth, throttle, negotiation milता hai
GenericAPIView   -> + queryset / serializer_class / get_queryset / get_serializer / pagination / filter_backends
mixins           -> ListModelMixin, CreateModelMixin, Retrieve/Update/DestroyModelMixin
generics.XxxAPIView = GenericAPIView + Xxx ke mixins, HTTP methods se bound
ViewSet          -> actions (list/retrieve/create/...) not HTTP methods ; router chahिए
  ModelViewSet   = ViewSet + saare 6 ; ReadOnlyModelViewSet = list + retrieve
  @action(detail=True|False, methods=[...], url_path=, permission_classes=)  -> extra routes
\`\`\``,

    content: `## \`APIView\` — the base

\`APIView\` subclasses Django's \`View\` and adds DRF's request/response cycle:

- \`request\` is a DRF \`Request\` (wraps Django's): \`.data\` (parsed body, any content type), \`.query_params\` (\`?a=1\`), \`.user\` / \`.auth\` (from the authentication classes), \`.accepted_renderer\`.
- You return a DRF \`Response(data, status=, headers=)\` — \`data\` is native Python, and a **renderer** (chosen by content negotiation) turns it into bytes. Never \`JsonResponse\` in a DRF view.
- \`authentication_classes\`, \`permission_classes\`, \`throttle_classes\`, \`renderer_classes\`, \`parser_classes\` are checked before your handler runs.
- Exceptions (\`ValidationError\`, \`PermissionDenied\`, \`NotFound\`, \`Throttled\`, …) are caught by \`exception_handler\` and turned into proper JSON error responses (lesson 6).

You write \`get\`, \`post\`, \`put\`, \`patch\`, \`delete\`. Use \`APIView\` when the endpoint is not model CRUD — a webhook, an action that orchestrates several models, a report, an auth endpoint.

## \`GenericAPIView\` + mixins

\`GenericAPIView\` adds the model-CRUD plumbing:

- **\`queryset\` / \`get_queryset(self)\`** — the base queryset. Override the method (not the attribute) for anything dynamic: scoping to \`self.request.user\`, filtering by \`self.kwargs\`, adding \`select_related\`/\`prefetch_related\`.
- **\`serializer_class\` / \`get_serializer_class(self)\`** — override the method to pick per action/method.
- **\`get_serializer(self, *args, **kwargs)\`** — builds the serializer with \`context={"request", "view", "format"}\` already set.
- **\`get_object(self)\`** — runs \`get_queryset()\`, filters by \`lookup_field\` (default \`pk\`) from the URL, checks object permissions, or raises \`Http404\`.
- **\`pagination_class\`, \`filter_backends\`** (lesson 5).

The **mixins** provide the action methods: \`ListModelMixin.list()\`, \`CreateModelMixin.create()\`, \`RetrieveModelMixin.retrieve()\`, \`UpdateModelMixin.update()\` (+ \`partial_update()\`), \`DestroyModelMixin.destroy()\`. Each does the obvious thing — \`create()\` is \`get_serializer(data=request.data)\` → \`is_valid(raise_exception=True)\` → \`perform_create(serializer)\` → \`Response(serializer.data, 201)\`.

The **\`generics.XxxAPIView\`** classes are \`GenericAPIView\` + the right mixins, wired to HTTP methods:

\`\`\`python
class ListCreateAPIView(ListModelMixin, CreateModelMixin, GenericAPIView):
    def get(self, request, *args, **kwargs):  return self.list(request, *args, **kwargs)
    def post(self, request, *args, **kwargs): return self.create(request, *args, **kwargs)
\`\`\`

### The \`perform_*\` hooks

\`perform_create\` / \`perform_update\` / \`perform_destroy\` are where you customise the write without reimplementing the mixin:

\`\`\`python
def perform_create(self, serializer):
    serializer.save(owner=self.request.user, tenant=self.request.tenant)

def perform_destroy(self, instance):
    instance.is_deleted = True          # soft delete
    instance.save(update_fields=["is_deleted"])
\`\`\`

## \`ViewSet\` — actions, not methods

A \`ViewSet\` groups every endpoint for one resource. It has **actions** — \`list\`, \`retrieve\`, \`create\`, \`update\`, \`partial_update\`, \`destroy\` — not HTTP handlers. A **router** maps actions to URLs + methods:

| Route | Method | Action |
|---|---|---|
| \`/articles/\` | GET | \`list\` |
| \`/articles/\` | POST | \`create\` |
| \`/articles/{pk}/\` | GET | \`retrieve\` |
| \`/articles/{pk}/\` | PUT / PATCH | \`update\` / \`partial_update\` |
| \`/articles/{pk}/\` | DELETE | \`destroy\` |

- **\`viewsets.ViewSet\`** — write the actions yourself (like \`APIView\` but action-shaped).
- **\`viewsets.GenericViewSet\`** — \`GenericAPIView\` machinery, no actions; add mixins to get exactly the ones you want (\`class X(ListModelMixin, RetrieveModelMixin, GenericViewSet)\`).
- **\`viewsets.ModelViewSet\`** — \`GenericViewSet\` + all six mixins. The default for full CRUD.
- **\`viewsets.ReadOnlyModelViewSet\`** — \`list\` + \`retrieve\` only.

### \`@action\` — extra routes on a ViewSet

\`\`\`python
@action(detail=True, methods=["post"], url_path="publish",
        permission_classes=[IsAdminUser])
def publish(self, request, pk=None):     # POST /articles/{pk}/publish/
    ...

@action(detail=False, methods=["get"])
def mine(self, request):                 # GET /articles/mine/
    ...
\`\`\`

\`detail=True\` → \`/{prefix}/{pk}/{url_path}/\`; \`detail=False\` → \`/{prefix}/{url_path}/\`. Inside, \`self.get_object()\`, \`self.get_serializer()\`, \`self.get_queryset()\`, \`self.paginate_queryset()\` all work. The action shows up in the router's URLs and the browsable API.

### \`get_serializer_class\` by action

\`\`\`python
def get_serializer_class(self):
    if self.action == "list":
        return ArticleListSerializer
    if self.action in ("create", "update", "partial_update"):
        return ArticleWriteSerializer
    return ArticleDetailSerializer
\`\`\`

## Which rung?

- **\`APIView\`** — the endpoint is not CRUD, or the logic is a straight line and the generic machinery would only obscure it.
- **\`generics.XxxAPIView\`** — a single CRUD endpoint, or a handful, wired manually in \`urlpatterns\`. Explicit, easy to read one at a time.
- **\`ModelViewSet\` + router** — a full REST resource, especially several of them, where consistent URLs + the browsable API + auto schema are worth the small amount of magic. Most real DRF apps are mostly \`ModelViewSet\`s with a few \`APIView\`s for the odd endpoints.

You can also mix: a \`GenericViewSet\` with only \`ListModelMixin\` + a custom \`@action\` is a common shape for a read-mostly resource with one special operation.`,

    contentHi: `## \`APIView\` — base

\`APIView\` Django ke \`View\` ko subclass karता hai aur DRF ka request/response cycle add karता hai:

- \`request\` ek DRF \`Request\` hai: \`.data\` (parsed body, koi bhi content type), \`.query_params\`, \`.user\` / \`.auth\`.
- Aap ek DRF \`Response(data, status=, headers=)\` lautाते ho — \`data\` native Python hai, aur ek **renderer** ise bytes banाता hai. Ek DRF view mein kabhi \`JsonResponse\` nahi.
- \`authentication_classes\`, \`permission_classes\`, \`throttle_classes\`, \`renderer_classes\`, \`parser_classes\` aapke handler se pehle check hote hain.
- Exceptions \`exception_handler\` dwara catch hote hain (lesson 6).

\`APIView\` istemal karो jab endpoint model CRUD nahi — ek webhook, ek action jо kai models orchestrate karता hai, ek report.

## \`GenericAPIView\` + mixins

\`GenericAPIView\` model-CRUD plumbing add karता hai:

- **\`queryset\` / \`get_queryset(self)\`** — base queryset. Method override karो kisi bhi dynamic cheez ke liye: \`self.request.user\` par scoping, \`self.kwargs\` se filtering, \`select_related\`/\`prefetch_related\`.
- **\`serializer_class\` / \`get_serializer_class(self)\`** — method override karके prati action/method chunо.
- **\`get_object(self)\`** — \`get_queryset()\` chalाता hai, \`lookup_field\` (default \`pk\`) se filter, object permissions check, ya \`Http404\`.

**Mixins** action methods deते hain: \`ListModelMixin.list()\`, \`CreateModelMixin.create()\`, etc.

**\`generics.XxxAPIView\`** classes \`GenericAPIView\` + sahi mixins hain, HTTP methods se wired.

### \`perform_*\` hooks

\`perform_create\` / \`perform_update\` / \`perform_destroy\` wahaan hain jahaan aap write customise karते ho:

\`\`\`python
def perform_create(self, serializer):
    serializer.save(owner=self.request.user)

def perform_destroy(self, instance):
    instance.is_deleted = True          # soft delete
    instance.save(update_fields=["is_deleted"])
\`\`\`

## \`ViewSet\` — actions, methods nahi

Ek \`ViewSet\` ek resource ke har endpoint ko group karता hai. Iske paas **actions** hain — \`list\`, \`retrieve\`, \`create\`, \`update\`, \`partial_update\`, \`destroy\`. Ek **router** actions ko URLs + methods par map karता hai.

- **\`viewsets.ViewSet\`** — actions khud likhо.
- **\`viewsets.GenericViewSet\`** — \`GenericAPIView\` machinery, koi actions nahi; mixins add karके bilkul jо chahिए wo lo.
- **\`viewsets.ModelViewSet\`** — \`GenericViewSet\` + saare 6 mixins. Full CRUD ke liye default.
- **\`viewsets.ReadOnlyModelViewSet\`** — sirf \`list\` + \`retrieve\`.

### \`@action\` — ek ViewSet par extra routes

\`\`\`python
@action(detail=True, methods=["post"], url_path="publish")
def publish(self, request, pk=None):     # POST /articles/{pk}/publish/
    ...
\`\`\`

\`detail=True\` → \`/{prefix}/{pk}/{url_path}/\`; \`detail=False\` → \`/{prefix}/{url_path}/\`.

### Action se \`get_serializer_class\`

\`\`\`python
def get_serializer_class(self):
    if self.action == "list":
        return ArticleListSerializer
    if self.action in ("create", "update", "partial_update"):
        return ArticleWriteSerializer
    return ArticleDetailSerializer
\`\`\`

## Kaunsी seedhी?

- **\`APIView\`** — endpoint CRUD nahi, ya logic ek straight line hai.
- **\`generics.XxxAPIView\`** — ek single CRUD endpoint, ya kuch, \`urlpatterns\` mein manually wired.
- **\`ModelViewSet\` + router** — ek full REST resource, khaskार kai. Zyादातर asli DRF apps zyादातр \`ModelViewSet\`s hain kuch \`APIView\`s ke saath.

Aap mix bhi kar sakte ho: sirf \`ListModelMixin\` + ek custom \`@action\` waala ek \`GenericViewSet\` ek aam shape hai.`,

    examples: [
      {
        title: 'APIView vs ListCreateAPIView: same endpoint, less code',
        titleHi: 'APIView vs ListCreateAPIView: wahi endpoint, kam code',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": []})
django.setup()

from django.db import models, connection
from django.urls import path
from rest_framework import serializers, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.test import APIClient

class Note(models.Model):
    title = models.CharField(max_length=100)
    pinned = models.BooleanField(default=False)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Note)
Note.objects.create(title="first", pinned=True)

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "pinned"]

# --- hand-written APIView ---
class NoteListAPIView(APIView):
    def get(self, request):
        return Response(NoteSerializer(Note.objects.all(), many=True).data)
    def post(self, request):
        s = NoteSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data, status=status.HTTP_201_CREATED)

# --- generic: same behaviour, 3 lines ---
class NoteListGeneric(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

urlpatterns = [
    path("notes-apiview/", NoteListAPIView.as_view()),
    path("notes-generic/", NoteListGeneric.as_view()),
]

c = APIClient()
print("APIView GET:", c.get("/notes-apiview/").json())
print("Generic GET:", c.get("/notes-generic/").json())
r = c.post("/notes-generic/", {"title": "second"}, format="json")
print("Generic POST:", r.status_code, r.json())
print("APIView POST invalid:", c.post("/notes-apiview/", {}, format="json").status_code,
      c.post("/notes-apiview/", {}, format="json").json())`,
        output: `APIView GET: [{'id': 1, 'title': 'first', 'pinned': True}]
Generic GET: [{'id': 1, 'title': 'first', 'pinned': True}]
Generic POST: 201 {'id': 2, 'title': 'second', 'pinned': False}
APIView POST invalid: 400 {'title': ['This field is required.']}
`,
        explain: 'Both endpoints behave identically — same GET list, same 201 on create, same 400 on an invalid body. The `APIView` spells out `get` and `post`: query, serialize, return `Response`; and for POST, `is_valid(raise_exception=True)` then `save()` then `Response(data, 201)`. `ListCreateAPIView` is those exact steps as `ListModelMixin.list()` and `CreateModelMixin.create()` — you just set `queryset` and `serializer_class` and get the same behaviour in three lines. Reach for the generic when the view *is* model CRUD; keep `APIView` when it is not.',
        explainHi: 'Dono endpoints identical behave karते hain — same GET list, create par same 201, ek invalid body par same 400. `APIView` `get` aur `post` spell karता hai: query, serialize, `Response` return; aur POST ke liye, `is_valid(raise_exception=True)` phir `save()` phir `Response(data, 201)`. `ListCreateAPIView` wahi steps hain `ListModelMixin.list()` aur `CreateModelMixin.create()` ke roop mein — aap sirf `queryset` aur `serializer_class` set karके teen lines mein wahi behaviour paते ho.',
      },
      {
        title: 'ModelViewSet + router + @action + get_queryset scoping',
        titleHi: 'ModelViewSet + router + @action + get_queryset scoping',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": []})
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.db import models, connection
from django.contrib.auth.models import User
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter
from rest_framework.test import APIClient

class Task(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    done = models.BooleanField(default=False)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Task)
ada = User.objects.create_user("ada"); bo = User.objects.create_user("bo")
Task.objects.create(owner=ada, title="Ada 1"); Task.objects.create(owner=ada, title="Ada 2")
Task.objects.create(owner=bo, title="Bo secret")

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "title", "done"]

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user).order_by("id")
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        task = self.get_object()
        task.done = True; task.save()
        return Response({"id": task.id, "done": task.done})

router = DefaultRouter()
router.register("tasks", TaskViewSet, basename="task")
urlpatterns = router.urls

c = APIClient(); c.force_authenticate(ada)
print("list (scoped to ada):", [t["title"] for t in c.get("/tasks/").json()])
print("retrieve bo's task -> 404:", c.get("/tasks/3/").status_code)
r = c.post("/tasks/", {"title": "Ada 3"}, format="json")
print("create:", r.status_code, r.json())
print("action complete:", c.post("/tasks/1/complete/").json())
print("route names:", sorted({u.name for u in router.urls if getattr(u, "name", None)}))`,
        output: `list (scoped to ada): ['Ada 1', 'Ada 2']
retrieve bo's task -> 404: 404
create: 201 {'id': 4, 'title': 'Ada 3', 'done': False}
action complete: {'id': 1, 'done': True}
route names: ['api-root', 'task-complete', 'task-detail', 'task-list']
`,
        explain: 'One `router.register` generates the whole URL set: `task-list` (`GET|POST /tasks/`), `task-detail` (`GET|PUT|PATCH|DELETE /tasks/{pk}/`), and `task-complete` for the `@action`. `get_queryset` scopes every action to `owner=self.request.user`, so Ada\'s list has only her two tasks and `GET /tasks/3/` (Bo\'s) is a `404` — `retrieve` looks up the pk *within* the scoped queryset (the IDOR fix from Module 4). `perform_create` stamps `owner`. The `@action` method uses `self.get_object()` (also scoped) and returns a custom `Response`.',
        explainHi: 'Ek `router.register` poora URL set generate karता hai: `task-list` (`GET|POST /tasks/`), `task-detail` (`GET|PUT|PATCH|DELETE /tasks/{pk}/`), aur `@action` ke liye `task-complete`. `get_queryset` har action ko `owner=self.request.user` par scope karता hai, toh Ada ki list mein sirf uske do tasks hain aur `GET /tasks/3/` (Bo ka) ek `404` hai — `retrieve` pk ko scoped queryset ke *andar* lookup karता hai (Module 4 ka IDOR fix). `perform_create` `owner` stamp karता hai.',
      },
      {
        title: 'get_serializer_class + perform_create: different shapes per action',
        titleHi: 'get_serializer_class + perform_create: prati action alag shapes',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": []})
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.db import models, connection
from django.contrib.auth.models import User
from rest_framework import serializers, viewsets
from rest_framework.routers import SimpleRouter
from rest_framework.test import APIClient

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    body = models.TextField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Post)
ada = User.objects.create_user("ada")

class PostListSerializer(serializers.ModelSerializer):     # slim: no body
    class Meta:
        model = Post
        fields = ["id", "title"]

class PostDetailSerializer(serializers.ModelSerializer):   # full + author name
    author = serializers.StringRelatedField()
    class Meta:
        model = Post
        fields = ["id", "title", "body", "author"]

class PostWriteSerializer(serializers.ModelSerializer):    # client cannot set author
    class Meta:
        model = Post
        fields = ["id", "title", "body"]

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by("id")
    def get_serializer_class(self):
        return {"list": PostListSerializer,
                "create": PostWriteSerializer,
                "update": PostWriteSerializer,
                "partial_update": PostWriteSerializer}.get(self.action, PostDetailSerializer)
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

router = SimpleRouter()
router.register("posts", PostViewSet, basename="post")
urlpatterns = router.urls

c = APIClient(); c.force_authenticate(ada)
c.post("/posts/", {"title": "Hello", "body": "world", "author": 999}, format="json")
print("list uses slim serializer:", c.get("/posts/").json())
print("detail uses full serializer:", c.get("/posts/1/").json())
print("author was server-set, not 999:", Post.objects.get(pk=1).author.username)`,
        output: `list uses slim serializer: [{'id': 1, 'title': 'Hello'}]
detail uses full serializer: {'id': 1, 'title': 'Hello', 'body': 'world', 'author': 'ada'}
author was server-set, not 999: ada
`,
        explain: '`get_serializer_class()` returns a different serializer per `self.action`: `PostListSerializer` (id + title only) for `list`, `PostWriteSerializer` (no `author`) for `create`/`update`/`partial_update`, and `PostDetailSerializer` (full + author name) otherwise. So the list payload stays small, the detail payload is useful, and the write serializer omitting `author` is what blocks the client\'s `"author": 999` — `perform_create` stamps the real author. This "slim list / fat detail / locked-down write" split is the standard shape for a real DRF resource.',
        explainHi: '`get_serializer_class()` prati `self.action` ek alag serializer lautाता hai: `list` ke liye `PostListSerializer` (sirf id + title), `create`/`update` ke liye `PostWriteSerializer` (koi `author` nahi), warna `PostDetailSerializer` (full + author name). Toh list payload chhota rehта hai, detail payload useful hai, aur write serializer `author` chhoड़ना client ke `"author": 999` ko block karता hai — `perform_create` asli author stamp karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()          # every user sees every article
    serializer_class = ArticleSerializer
    def perform_create(self, serializer):
        serializer.save()                     # author never set -> NOT NULL violation or NULL author`,
        right: `class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    def get_queryset(self):
        return Article.objects.filter(author=self.request.user)   # scope
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)                 # stamp`,
        why: 'A `ModelViewSet` with a class-level `queryset = Model.objects.all()` exposes every row to every authenticated user — for `retrieve`/`update`/`destroy` that is an IDOR (Module 4, Module 6). Scope via `get_queryset()`. And `perform_create` must stamp server-controlled fields (`author`, `owner`, `tenant`) — the write serializer does not list them, so nothing else sets them.',
        whyHi: 'Ek class-level `queryset = Model.objects.all()` waala `ModelViewSet` har row ko har authenticated user ko expose karता hai — `retrieve`/`update`/`destroy` ke liye ye ek IDOR hai. `get_queryset()` se scope karो. Aur `perform_create` ko server-controlled fields stamp karna chahिए — write serializer unhe list nahi karता.',
      },
      {
        wrong: `class ReportView(generics.GenericAPIView):
    serializer_class = ReportSerializer
    def get(self, request):
        data = build_expensive_report()
        return JsonResponse(data)             # bypasses DRF renderers, negotiation, error handling`,
        right: `class ReportView(APIView):
    def get(self, request):
        data = build_expensive_report()
        return Response(data)                 # content-negotiated; works with the browsable API`,
        why: 'Returning a Django `JsonResponse` (or `HttpResponse`) from a DRF view skips the renderer layer, so content negotiation, the browsable API, the configured default renderer, and consistent error formatting all stop working for that endpoint. Always return `rest_framework.response.Response` with native Python data and let DRF render it. Also: if the view is not CRUD, use `APIView`, not `GenericAPIView` with an unused `serializer_class`.',
        whyHi: 'Ek DRF view se ek Django `JsonResponse` lautाना renderer layer skip karता hai, toh content negotiation, browsable API, configured default renderer, aur consistent error formatting sab us endpoint ke liye band ho jाते hain. Hamesha `rest_framework.response.Response` native Python data ke saath lautाओ.',
      },
      {
        wrong: `class TaskViewSet(viewsets.ModelViewSet):
    ...
# urls.py
urlpatterns = [path("tasks/", TaskViewSet.as_view())]   # TypeError: as_view() missing actions
# or manually: path("tasks/", TaskViewSet.as_view({"get": "list", "post": "create"}))  everywhere`,
        right: `from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register("tasks", TaskViewSet, basename="task")
urlpatterns = router.urls
# (or include: path("api/", include(router.urls)))`,
        why: 'A `ViewSet` has actions, not HTTP handlers, so `ViewSet.as_view()` needs an explicit `{method: action}` map — doing that by hand for every route defeats the purpose. Register the viewset with a router; it generates the list/detail routes, the `@action` routes, the format-suffix routes, and (with `DefaultRouter`) an API root view. Use `APIView`/`generics` if you genuinely want to hand-wire URLs.',
        whyHi: 'Ek `ViewSet` ke paas actions hain, HTTP handlers nahi, toh `ViewSet.as_view()` ko ek explicit `{method: action}` map chahिए — har route ke liye ye haath se karna point hi khatam kar deता hai. Viewset ko ek router ke saath register karो; ye list/detail routes, `@action` routes, format-suffix routes generate karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A DRF app is mostly `ModelViewSet` + router, plus a few `APIView`s** — `ModelViewSet` for each resource (articles, comments, users), `APIView` for `POST /auth/login/`, `POST /webhooks/stripe/`, `GET /dashboard/summary/`. The viewsets get consistent URLs and free schema; the odd endpoints stay explicit.',
        hi: '**Ek DRF app zyादातर `ModelViewSet` + router hai, plus kuch `APIView`s** — har resource ke liye `ModelViewSet`, `POST /auth/login/`, `POST /webhooks/stripe/` ke liye `APIView`.',
      },
      {
        en: '**`get_serializer_class` by `self.action` is the standard "list is slim, detail is fat, write is locked-down" pattern** — `ArticleListSerializer` (id, title, excerpt), `ArticleDetailSerializer` (+ body, nested author, nested comments), `ArticleWriteSerializer` (only client-settable fields). `perform_create` stamps the rest.',
        hi: '**`self.action` se `get_serializer_class` standard pattern hai** — `ArticleListSerializer` (id, title, excerpt), `ArticleDetailSerializer` (+ body, nested), `ArticleWriteSerializer` (sirf client-settable). `perform_create` baaki stamp karता hai.',
      },
      {
        en: '**`@action` for resource operations that are not CRUD** — `POST /orders/{id}/cancel/`, `POST /users/{id}/reset-password/`, `GET /reports/{id}/download/`, `GET /articles/trending/`. Keeps them namespaced under the resource with the resource\'s permissions and queryset scoping, instead of a separate top-level URL.',
        hi: '**Non-CRUD resource operations ke liye `@action`** — `POST /orders/{id}/cancel/`, `GET /articles/trending/`. Unhe resource ke tahat namespaced rakhता hai resource ki permissions ke saath.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk up the three levels — APIView, generic views, ViewSets — and say what each adds.',
        qHi: 'Teen levels — APIView, generic views, ViewSets — par chadhо aur batाओ har ek kya add karता hai.',
        a: 'APIView is the base. It subclasses Django\'s View and wraps it in DRF\'s request-response cycle: request becomes a DRF Request with dot data for the parsed body regardless of content type, dot query_params, and dot user from the authentication classes; you return a DRF Response of native Python data which a renderer turns into bytes via content negotiation; and authentication, permission, and throttle classes run before your handler, while DRF exceptions are caught and formatted by the exception handler. You still write get, post, and so on yourself. You use APIView when the endpoint is not model CRUD. Generic views add GenericAPIView plus mixins. GenericAPIView contributes the CRUD plumbing: a queryset or a get_queryset method, a serializer_class or get_serializer_class, get_serializer which pre-fills the context, get_object which does the lookup-field lookup and object-permission check, and hooks for pagination and filtering. The mixins — list, create, retrieve, update, destroy — supply the actual action method bodies. The generics dot something-APIView classes just combine GenericAPIView with the right mixins and bind them to HTTP methods, so ListCreateAPIView routes GET to list and POST to create. You set queryset and serializer_class and override get_queryset for scoping and perform_create to stamp fields. ViewSets go one level further: a ViewSet groups all the endpoints for one resource into a class whose members are actions — list, retrieve, create, update, partial_update, destroy — not HTTP handlers. A router maps those actions to URLs and methods automatically. ModelViewSet is a GenericViewSet with all six mixins; ReadOnlyModelViewSet has just list and retrieve; and the at-action decorator adds extra routes like a publish endpoint on a specific object. The trade is code versus control: move up for less boilerplate and consistent URLs, down when the logic does not fit the CRUD mold.',
        aHi: 'APIView base hai. Ye Django ke View ko subclass karता hai aur ise DRF ke request-response cycle mein wrap karता hai: request ek DRF Request ban jाता hai dot data ke saath parsed body ke liye, dot query_params, aur authentication classes se dot user; aap native Python data ka ek DRF Response lautाते ho jise ek renderer content negotiation ke zariye bytes banаता hai; aur authentication, permission, throttle classes aapke handler se pehle chalती hain. Aap abhi bhi get, post khud likhते ho. Aap APIView istemal karते ho jab endpoint model CRUD nahi. Generic views GenericAPIView plus mixins add karते hain. GenericAPIView CRUD plumbing deता hai: ek queryset ya get_queryset, ek serializer_class ya get_serializer_class, get_serializer jо context pre-fill karта hai, get_object jо lookup karता hai. Mixins — list, create, retrieve, update, destroy — asli action method bodies deते hain. ViewSets ek level aur aage jाते hain: ek ViewSet ek resource ke saare endpoints ko ek class mein group karता hai jiske members actions hain, HTTP handlers nahi. Ek router un actions ko URLs aur methods par automatically map karता hai. ModelViewSet saare 6 mixins ke saath ek GenericViewSet hai. Sौda code versus control hai.',
      },
      {
        q: 'What is `perform_create` for, and why not just override `create`?',
        qHi: '`perform_create` kis liye hai, aur bस `create` override kyun nahi?',
        a: 'The CreateModelMixin dot create method is the full flow for a POST: build the serializer from request dot data, call is_valid with raise_exception True so an invalid body returns a 400 whose body is the errors, then call perform_create passing the validated serializer, then build a 201 response from the serializer\'s data with a Location header. perform_create in the base mixin is a single line: serializer dot save. It exists as a separate hook precisely so you can customise the save step without touching any of the surrounding flow. The common use is stamping server-controlled fields — perform_create calls serializer dot save with owner equals self dot request dot user, or tenant, or status equals draft — values the write serializer deliberately does not expose so the client cannot set them. It is also where post-save side effects go: send a notification, enqueue a background job, write an audit log entry, all using serializer dot instance after the save. If you override create instead, you take on responsibility for the whole flow — the is_valid call, the exception behaviour, the 201 status, the Location header — and it is easy to get one of those subtly wrong or drift from what the other actions do. Overriding perform_create keeps your change surgical: one method, one concern, and every other part of create still behaves exactly as DRF intends. The same logic applies to perform_update and perform_destroy — perform_destroy is the standard place to turn a hard delete into a soft delete by setting a flag instead of calling instance dot delete.',
        aHi: 'CreateModelMixin dot create method ek POST ke liye poora flow hai: request dot data se serializer banाओ, is_valid ko raise_exception True ke saath call karो taaki ek invalid body ek 400 lautае jiska body errors hai, phir perform_create call karो validated serializer pass karके, phir serializer ke data se ek 201 response banाओ ek Location header ke saath. Base mixin mein perform_create ek single line hai: serializer dot save. Ye ek alag hook ke roop mein maujूd hai taaki aap save step customise kar sako bina aas-paas ke flow ko chhue. Aam use server-controlled fields stamp karna hai — perform_create serializer dot save ko owner equals self dot request dot user ke saath call karता hai. Ye wahaan bhi hai jahaan post-save side effects jाते hain: ek notification bhejो, ek background job enqueue karो. Agar aap create override karते ho, aap poore flow ki zimmedari lete ho — is_valid call, 201 status, Location header — aur ek ko subtly galat karna aasan hai. perform_create override karna aapke change ko surgical rakhता hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone DRF (`REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": []}`). Model `Snippet` (`title`, `code` text, `language` default `"python"`). Build the SAME list+create endpoint twice: once as an `APIView` (`get` returns all, `post` validates + saves + 201), once as `generics.ListCreateAPIView`. Wire both. With `APIClient`, GET and POST each and assert identical JSON + status.',
        taskHi: 'Standalone DRF. `Snippet` (`title`, `code`, `language`) model karो. Wahi list+create endpoint do baar banаओ: ek `APIView` ke roop mein, ek `generics.ListCreateAPIView` ke roop mein. Dono wire karो. `APIClient` se GET aur POST karके identical JSON + status assert karो.',
        hint: '`from rest_framework.test import APIClient`. `c.post(url, {...}, format="json")`. The `APIView.post`: `s = SnippetSerializer(data=request.data); s.is_valid(raise_exception=True); s.save(); return Response(s.data, status=201)`. The generic just needs `queryset` + `serializer_class`.',
        hintHi: '`from rest_framework.test import APIClient`. `c.post(url, {...}, format="json")`. `APIView.post`: `s.is_valid(raise_exception=True); s.save(); return Response(s.data, status=201)`.',
      },
      {
        task: 'Model `Project` (`owner` FK User, `name`, `archived` bool default False). `ProjectViewSet(ModelViewSet)`: `get_queryset` scoped to `owner=self.request.user`, `perform_create` stamps `owner`. Add `@action(detail=True, methods=["post"])` `archive` that sets `archived=True` and returns the serialized project. Add `@action(detail=False)` `active` returning only non-archived projects. Register with `DefaultRouter`. With two users, assert: user A sees only their projects; A cannot retrieve B\'s (404); `archive` works; `active` filters.',
        taskHi: '`Project` (`owner` FK, `name`, `archived`) model karो. `ProjectViewSet(ModelViewSet)`: `get_queryset` `owner` par scoped, `perform_create` `owner` stamp. `@action` `archive` (detail=True) aur `active` (detail=False) add karो. `DefaultRouter` se register. Do users se assert karो.',
        hint: '`call_command("migrate", run_syncdb=True, verbosity=0)` for auth tables. `c.force_authenticate(user)`. In `archive`: `p = self.get_object(); p.archived = True; p.save(); return Response(self.get_serializer(p).data)`. In `active`: `qs = self.get_queryset().filter(archived=False); return Response(self.get_serializer(qs, many=True).data)`.',
        hintHi: '`call_command("migrate", run_syncdb=True, verbosity=0)`. `c.force_authenticate(user)`. `archive`: `p = self.get_object(); p.archived = True; p.save(); return Response(self.get_serializer(p).data)`.',
      },
      {
        task: 'Model `Doc` (`author` FK User, `title`, `body`). Three serializers: `DocListSerializer` (`id`, `title`), `DocDetailSerializer` (`id`, `title`, `body`, `author` as `StringRelatedField`), `DocWriteSerializer` (`id`, `title`, `body`). `DocViewSet(ModelViewSet)` with `get_serializer_class` returning the write one for create/update/partial_update, list one for list, detail one otherwise; `perform_create` stamps `author`. Assert: `GET /docs/` has no `body`; `GET /docs/1/` has `body` + `author` name; `POST` with `"author": 999` still sets the real author.',
        taskHi: '`Doc` (`author` FK, `title`, `body`) model karो. Teen serializers. `DocViewSet(ModelViewSet)` `get_serializer_class` ke saath (create/update ke liye write, list ke liye list, warna detail); `perform_create` `author` stamp. Assert karो.',
        hint: '`get_serializer_class`: `return {"list": DocListSerializer, "create": DocWriteSerializer, "update": DocWriteSerializer, "partial_update": DocWriteSerializer}.get(self.action, DocDetailSerializer)`. The write serializer omitting `author` is what blocks the `999`.',
        hintHi: '`get_serializer_class`: `return {"list": ..., "create": DocWriteSerializer, ...}.get(self.action, DocDetailSerializer)`. Write serializer `author` chhoड़ta hai — wahi `999` block karता hai.',
      },
    ],

    keyTakeaways: [
      '`APIView` = Django `View` + DRF machinery: `request.data` (parsed body, any type), `request.query_params`, `request.user`/`auth`, `Response(data, status=)` (content-negotiated — NEVER `JsonResponse`), auth/permission/throttle classes, `exception_handler`. You write `get`/`post`/... Use for non-CRUD endpoints.',
      '`GenericAPIView` adds: `queryset`/`get_queryset()`, `serializer_class`/`get_serializer_class()`, `get_serializer()` (context pre-set), `get_object()` (lookup + object perms), `pagination_class`, `filter_backends`.',
      'Mixins (`List`/`Create`/`Retrieve`/`Update`/`DestroyModelMixin`) provide the action bodies. `generics.XxxAPIView` = `GenericAPIView` + the right mixins bound to HTTP methods (`ListCreateAPIView`, `RetrieveUpdateDestroyAPIView`, ...).',
      'Override hooks (all optional): `get_queryset` (scope + `select_related`/`prefetch_related`), `get_serializer_class` (per action/method), `perform_create`/`perform_update` (`serializer.save(owner=...)` + side effects), `perform_destroy` (soft delete), `get_object`.',
      '`ViewSet` has ACTIONS (`list`, `retrieve`, `create`, `update`, `partial_update`, `destroy`), not HTTP handlers. A ROUTER maps actions -> URLs+methods. `ViewSet.as_view()` needs an explicit `{method: action}` map — use a router instead.',
      '`ModelViewSet` = `GenericViewSet` + all 6 mixins (full CRUD). `ReadOnlyModelViewSet` = `list` + `retrieve`. `GenericViewSet` + hand-picked mixins for exactly the actions you want.',
      '`@action(detail=True|False, methods=[...], url_path=, permission_classes=)` adds extra routes on a ViewSet: `detail=True` -> `/{prefix}/{pk}/{path}/`, `detail=False` -> `/{prefix}/{path}/`. Inside, `self.get_object()`/`get_serializer()`/`get_queryset()`/`paginate_queryset()` all work.',
      'Rung choice: `APIView` for non-CRUD / straight-line logic; `generics.XxxAPIView` for one or a few CRUD endpoints wired manually; `ModelViewSet` + router for full REST resources (most of a real app). Mixing is normal.',
    ],
    keyTakeawaysHi: [
      '`APIView` = Django `View` + DRF machinery: `request.data`, `request.query_params`, `request.user`/`auth`, `Response(data, status=)` (content-negotiated — KABHI `JsonResponse` nahi), auth/permission/throttle classes, `exception_handler`. Aap `get`/`post`/... likhते ho. Non-CRUD endpoints ke liye.',
      '`GenericAPIView` add karता hai: `queryset`/`get_queryset()`, `serializer_class`/`get_serializer_class()`, `get_serializer()`, `get_object()`, `pagination_class`, `filter_backends`.',
      'Mixins action bodies deते hain. `generics.XxxAPIView` = `GenericAPIView` + sahi mixins HTTP methods se bound.',
      'Override hooks (sab optional): `get_queryset` (scope + `select_related`/`prefetch_related`), `get_serializer_class`, `perform_create`/`perform_update`, `perform_destroy` (soft delete), `get_object`.',
      '`ViewSet` ke paas ACTIONS hain, HTTP handlers nahi. Ek ROUTER actions ko URLs+methods par map karता hai. `ViewSet.as_view()` ko ek explicit `{method: action}` map chahिए — router istemal karो.',
      '`ModelViewSet` = `GenericViewSet` + saare 6 mixins. `ReadOnlyModelViewSet` = `list` + `retrieve`. `GenericViewSet` + hand-picked mixins.',
      '`@action(detail=True|False, methods=[...])` ViewSet par extra routes add karता hai: `detail=True` -> `/{prefix}/{pk}/{path}/`, `detail=False` -> `/{prefix}/{path}/`.',
      'Seedhी chunaव: `APIView` non-CRUD ke liye; `generics.XxxAPIView` kuch CRUD endpoints ke liye; `ModelViewSet` + router full REST resources ke liye (asli app ka zyादातर). Mixing normal hai.',
    ],
  },

  {
    slug: 'dj-drf-routers-pagination-filtering',
    title: 'Routers, Pagination & Filtering',
    titleHi: 'Routers, Pagination & Filtering',
    description: 'A router turns a `ViewSet` into a full set of URLs in one line. Pagination classes cap response size — `PageNumberPagination` and `LimitOffsetPagination` are offset-based (simple, degrades deep), `CursorPagination` is keyset (O(1) per page, the payoff of Module 3\'s ordering). `DjangoFilterBackend` + `SearchFilter` + `OrderingFilter` add `?field=`, `?search=`, `?ordering=` declaratively.',
    descriptionHi: 'Ek router ek `ViewSet` ko ek line mein URLs ke ek poore set mein badalता hai. Pagination classes response size cap karती hain — `PageNumberPagination` aur `LimitOffsetPagination` offset-based hain (saral, gehरा degrade), `CursorPagination` keyset hai (prati page O(1), Module 3 ki ordering ka payoff). `DjangoFilterBackend` + `SearchFilter` + `OrderingFilter` `?field=`, `?search=`, `?ordering=` declaratively add karते hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A library front desk: one clerk who files the shelf plan, one who hands you a manageable stack, and one who narrows the search.** The router is the filing clerk — you say "this is the Articles collection, here is the viewset that handles it" and the clerk writes every call slip for you: browse the collection, fetch one by number, add, amend, remove, plus any special request forms you registered. Pagination is the clerk who will not dump all 40,000 books on the counter — they hand you 25 and a note saying "next 25 here". The offset kind counts past the ones you skipped every time (fine for page 2, slow at page 800); the cursor kind bookmarks the last book you saw and continues from there (same speed at any depth, but you cannot jump to "page 800"). Filtering is the reference clerk — you fill in "published only", "by this author", "sorted newest first" on the request slip (`?status=published&author=7&ordering=-created`) and they fetch exactly that subset, in that order.',
      hi: '**Ek library front desk: ek clerk jо shelf plan file karता hai, ek jо aapko ek manageable stack deता hai, ek jо search narrow karता hai.** Router filing clerk hai — aap kehते ho "ye Articles collection hai, ye viewset jо ise handle karता hai" aur clerk aapke liye har call slip likhता hai: collection browse karो, number se ek fetch karो, add, amend, remove, plus koi special request forms jо aapne register kiye. Pagination wo clerk hai jо saari 40,000 books counter par nahi girाega — wo aapko 25 deता hai aur ek note "agli 25 yahaan". Offset kism har baar skip ki hui ke aage ginती hai (page 2 ke liye theek, page 800 par dheema); cursor kism aapki dekhी last book bookmark karता hai (kisi bhi depth par wahi speed, par aap "page 800" par jump nahi kar sakte). Filtering reference clerk hai — aap request slip par "sirf published", "is author dwara", "newest first sorted" bharते ho aur wo bilkul wahi subset fetch karता hai.',
    },

    simple: `**Routers**

\`\`\`python
from rest_framework.routers import DefaultRouter, SimpleRouter

router = DefaultRouter()          # + an API-root view + format suffixes
router.register("articles", ArticleViewSet, basename="article")
router.register("comments", CommentViewSet)      # basename inferred from queryset

urlpatterns = [
    path("api/", include(router.urls)),
]

# generated:
#   GET|POST      /api/articles/            -> list | create        (name "article-list")
#   GET|PUT|PATCH|DELETE  /api/articles/{pk}/  -> retrieve | update | partial_update | destroy  ("article-detail")
#   + every @action route
#   + GET /api/ (DefaultRouter only) -- browsable API root
\`\`\`

\`basename\` is required when the viewset has no \`queryset\` attribute (only \`get_queryset\`). It is the prefix for \`reverse("article-list")\` / \`reverse("article-detail", kwargs={"pk": ...})\`.

**Pagination — set the default, override per view**

\`\`\`python
# settings.py
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 25,
}
\`\`\`

\`\`\`python
# GET /api/articles/?page=3
{
  "count": 940,
  "next": "http://.../api/articles/?page=4",
  "previous": "http://.../api/articles/?page=2",
  "results": [ ... 25 items ... ]
}
\`\`\`

\`\`\`python
# per-view override:
class ArticleViewSet(viewsets.ModelViewSet):
    pagination_class = MyLargePagination     # or None to disable for this view

# LimitOffsetPagination:  ?limit=10&offset=40   -> {"count", "next", "previous", "results"}
# CursorPagination (keyset -- see Module 3):
class ArticleCursorPagination(CursorPagination):
    page_size = 25
    ordering = "-created_at"                  # MUST be set; a stable, ideally unique-ish key
# GET /api/articles/?cursor=cD0yMDI2...  -> {"next", "previous", "results"}   (NO "count")
\`\`\`

**Filtering, search, ordering**

\`\`\`python
# pip install django-filter ; add "django_filters" to INSTALLED_APPS
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_fields = ["status", "author"]           # ?status=published&author=7   (exact match)
    search_fields = ["title", "body", "author__name"] # ?search=django   (icontains, OR across fields)
    ordering_fields = ["created_at", "title", "views"] # ?ordering=-created_at,title
    ordering = ["-created_at"]                         # default when ?ordering= absent
\`\`\`

**Custom \`FilterSet\` — ranges, lookups, method filters**

\`\`\`python
import django_filters as df

class ArticleFilter(df.FilterSet):
    min_views = df.NumberFilter(field_name="views", lookup_expr="gte")
    created_after = df.DateFilter(field_name="created_at", lookup_expr="date__gte")
    tag = df.CharFilter(method="filter_tag")

    class Meta:
        model = Article
        fields = ["status", "author"]

    def filter_tag(self, queryset, name, value):
        return queryset.filter(tags__slug=value)

# in the viewset:  filterset_class = ArticleFilter   (instead of filterset_fields)
\`\`\`

\`\`\`
DefaultRouter  -> list/detail/@action routes + format suffixes + API-root view (GET /api/)
SimpleRouter   -> same minus the API-root view
basename       -> required if no .queryset attr ; sets reverse() names <basename>-list / <basename>-detail

pagination (default via DEFAULT_PAGINATION_CLASS + PAGE_SIZE, or per-view pagination_class):
  PageNumberPagination   ?page=N[&page_size=]     offset ; has count ; degrades deep
  LimitOffsetPagination  ?limit=&offset=          offset ; has count
  CursorPagination       ?cursor=<opaque>         keyset ; O(1)/page ; NO count ; needs .ordering

filter_backends: DjangoFilterBackend (filterset_fields | filterset_class),
                 SearchFilter (search_fields, ?search=), OrderingFilter (ordering_fields, ?ordering=)
\`\`\``,

    simpleHi: `**Routers**

\`\`\`python
from rest_framework.routers import DefaultRouter, SimpleRouter

router = DefaultRouter()          # + ek API-root view + format suffixes
router.register("articles", ArticleViewSet, basename="article")
router.register("comments", CommentViewSet)      # basename queryset se inferred

urlpatterns = [path("api/", include(router.urls))]

# generated:
#   GET|POST      /api/articles/            -> list | create
#   GET|PUT|PATCH|DELETE  /api/articles/{pk}/  -> retrieve | update | partial_update | destroy
#   + har @action route
#   + GET /api/ (sirf DefaultRouter) -- browsable API root
\`\`\`

\`basename\` zaroori hai jab viewset ke paas koi \`queryset\` attribute nahi (sirf \`get_queryset\`).

**Pagination — default set karो, prati view override**

\`\`\`python
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 25,
}
\`\`\`

\`\`\`python
# GET /api/articles/?page=3
{"count": 940, "next": ".../?page=4", "previous": ".../?page=2", "results": [ ... 25 items ... ]}
\`\`\`

\`\`\`python
# LimitOffsetPagination:  ?limit=10&offset=40
# CursorPagination (keyset -- Module 3 dekhо):
class ArticleCursorPagination(CursorPagination):
    page_size = 25
    ordering = "-created_at"                  # SET karna ZAROORI; ek stable key
# GET /api/articles/?cursor=cD0yMDI2...  -> {"next", "previous", "results"}   (NO "count")
\`\`\`

**Filtering, search, ordering**

\`\`\`python
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class ArticleViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "author"]           # ?status=published&author=7  (exact)
    search_fields = ["title", "body", "author__name"] # ?search=django  (icontains, OR)
    ordering_fields = ["created_at", "title", "views"] # ?ordering=-created_at,title
    ordering = ["-created_at"]                         # default
\`\`\`

**Custom \`FilterSet\`**

\`\`\`python
import django_filters as df

class ArticleFilter(df.FilterSet):
    min_views = df.NumberFilter(field_name="views", lookup_expr="gte")
    tag = df.CharFilter(method="filter_tag")
    class Meta:
        model = Article
        fields = ["status", "author"]
    def filter_tag(self, queryset, name, value):
        return queryset.filter(tags__slug=value)

# viewset mein:  filterset_class = ArticleFilter
\`\`\`

\`\`\`
DefaultRouter  -> list/detail/@action routes + format suffixes + API-root view
SimpleRouter   -> wahi minus API-root view
basename       -> zaroori agar koi .queryset attr nahi ; reverse() names set karता hai

pagination:
  PageNumberPagination   ?page=N     offset ; count hai ; gehरा degrade
  LimitOffsetPagination  ?limit=&offset=   offset ; count hai
  CursorPagination       ?cursor=<opaque>  keyset ; O(1)/page ; NO count ; .ordering chahिए

filter_backends: DjangoFilterBackend, SearchFilter (?search=), OrderingFilter (?ordering=)
\`\`\``,

    content: `## Routers

\`router.register(prefix, ViewSet, basename=…)\` generates:

- \`{prefix}/\` → \`list\` (GET), \`create\` (POST) — URL name \`{basename}-list\`
- \`{prefix}/{lookup}/\` → \`retrieve\` (GET), \`update\` (PUT), \`partial_update\` (PATCH), \`destroy\` (DELETE) — name \`{basename}-detail\`
- one route per \`@action\` — name \`{basename}-{url_name}\`
- with \`format_suffix_patterns\`: \`.json\` / \`.api\` variants
- **\`DefaultRouter\` only**: \`GET /\` — the browsable API root listing all registered viewsets

\`basename\` is inferred from \`ViewSet.queryset.model\` if the attribute is set; **required** if the viewset only has \`get_queryset()\`. It is the base for \`reverse()\` — pass it explicitly if you want stable URL names.

Routers can be **combined** (\`urlpatterns = router1.urls + router2.urls\`) and **nested** for sub-resources (\`drf-nested-routers\` gives \`/articles/{id}/comments/\`), though a flat \`?article=\` filter is often simpler than nesting.

## Pagination

Set a project default:

\`\`\`python
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 25,
}
\`\`\`

Every list response is then wrapped. Without \`PAGE_SIZE\` (or a pagination class), lists are **not** paginated — a real risk on a growing table.

### \`PageNumberPagination\`

\`?page=N\`. Response: \`{"count", "next", "previous", "results"}\`. Optional client page size: set \`page_size_query_param = "page_size"\` and \`max_page_size\` on a subclass. **Offset-based**: page 800 issues \`LIMIT 25 OFFSET 19975\` — the DB walks and discards ~20k rows — and \`count\` is a \`COUNT(*)\` every request (Module 4 lesson 5). Fine for admin tables and lists a user pages a few screens of.

### \`LimitOffsetPagination\`

\`?limit=10&offset=40\`. Same offset cost, but the client controls the window directly — handy for "load 50 more" UIs and data grids.

### \`CursorPagination\` — the keyset payoff

\`\`\`python
class ArticleCursorPagination(CursorPagination):
    page_size = 25
    ordering = "-created_at"        # REQUIRED. Should be non-decreasing/stable; add a tiebreaker
                                    # for true uniqueness (DRF supports a single field or tuple).
\`\`\`

\`?cursor=<opaque base64>\`. Response: \`{"next", "previous", "results"}\` — **no \`count\`** (that is the point: no \`COUNT(*)\`). Internally it is \`WHERE created_at < :last_seen ORDER BY created_at DESC LIMIT 26\` — an indexed range scan that costs the same on page 2 or page 2000. Trade-offs: the client cannot jump to an arbitrary page, and inserts/deletes near the cursor do not shift rows across page boundaries (a feature for feeds). Use it for infinite-scroll feeds, large exports, any deep or unbounded list, and public APIs over big tables. This is the concrete reason Module 3 insisted every paginated queryset be explicitly ordered.

## Filtering — \`DjangoFilterBackend\`

\`django-filter\` (install \`django-filter\`, add \`"django_filters"\` to \`INSTALLED_APPS\`, optionally set it as \`DEFAULT_FILTER_BACKENDS\`).

**Simple**: \`filterset_fields = ["status", "author", "published"]\` → \`?status=published&author=7\` (exact match, ANDed). A dict form allows lookups: \`filterset_fields = {"views": ["gte", "lte"], "status": ["exact"]}\` → \`?views__gte=100\`.

**Custom \`FilterSet\`** for ranges, method filters, choice widgets, renamed params:

\`\`\`python
class ArticleFilter(django_filters.FilterSet):
    min_views     = django_filters.NumberFilter(field_name="views", lookup_expr="gte")
    created_after = django_filters.DateFilter(field_name="created_at", lookup_expr="date__gte")
    q             = django_filters.CharFilter(method="search_everywhere")

    class Meta:
        model = Article
        fields = ["status", "author"]

    def search_everywhere(self, qs, name, value):
        return qs.filter(Q(title__icontains=value) | Q(body__icontains=value))
\`\`\`

Set \`filterset_class = ArticleFilter\` on the view (mutually exclusive with \`filterset_fields\`).

## Search — \`SearchFilter\`

\`search_fields = ["title", "body", "author__name"]\` → \`?search=django\` does a case-insensitive \`icontains\` across all listed fields, ORed. Prefixes: \`^\` starts-with, \`=\` exact, \`@\` full-text (Postgres), \`$\` regex. Good for a single "search box"; for anything serious use Postgres full-text (\`SearchVector\`) or a dedicated engine.

## Ordering — \`OrderingFilter\`

\`ordering_fields = ["created_at", "title", "views"]\` → \`?ordering=-created_at,title\` (comma list, \`-\` for desc). \`ordering = ["-created_at"]\` sets the default when the param is absent. \`ordering_fields = "__all__"\` allows any model field (usually you want an allowlist — ordering by an unindexed column is a slow query a client can trigger).

## Order of backends matters

\`filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]\` — each backend's \`filter_queryset(request, queryset, view)\` runs in sequence on the queryset from \`get_queryset()\`, before pagination. So filtering narrows, search narrows further, ordering sorts, then the paginator slices. All of it composes with your \`get_queryset\` scoping — a client can only ever filter/search/order *within* the rows \`get_queryset\` already limited them to.`,

    contentHi: `## Routers

\`router.register(prefix, ViewSet, basename=…)\` generate karता hai:

- \`{prefix}/\` → \`list\` (GET), \`create\` (POST) — URL name \`{basename}-list\`
- \`{prefix}/{lookup}/\` → \`retrieve\` (GET), \`update\` (PUT), \`partial_update\` (PATCH), \`destroy\` (DELETE) — name \`{basename}-detail\`
- prati \`@action\` ek route
- **sirf \`DefaultRouter\`**: \`GET /\` — browsable API root

\`basename\` \`ViewSet.queryset.model\` se inferred hoता hai agar attribute set hai; **zaroori** agar viewset ke paas sirf \`get_queryset()\` hai.

Routers **combine** ho sakte hain aur sub-resources ke liye **nested** ho sakte hain, halांki ek flat \`?article=\` filter aksar nesting se saral hai.

## Pagination

Project default set karो. \`PAGE_SIZE\` (ya ek pagination class) ke bina, lists paginated **nahi** hain — ek badhते table par ek asli risk.

### \`PageNumberPagination\`

\`?page=N\`. Response: \`{"count", "next", "previous", "results"}\`. **Offset-based**: page 800 \`LIMIT 25 OFFSET 19975\` issue karता hai — DB ~20k rows walk aur discard karता hai — aur \`count\` har request par ek \`COUNT(*)\` hai.

### \`LimitOffsetPagination\`

\`?limit=10&offset=40\`. Wahi offset cost, par client window seedhे control karता hai.

### \`CursorPagination\` — keyset payoff

\`\`\`python
class ArticleCursorPagination(CursorPagination):
    page_size = 25
    ordering = "-created_at"        # REQUIRED. Stable hona chahिए.
\`\`\`

\`?cursor=<opaque base64>\`. Response: \`{"next", "previous", "results"}\` — **koi \`count\` nahi**. Andar ye \`WHERE created_at < :last_seen ORDER BY created_at DESC LIMIT 26\` hai — ek indexed range scan jо page 2 ya page 2000 par wahi cost. Trade-offs: client arbitrary page par jump nahi kar sakta. Infinite-scroll feeds, large exports, gehरी lists ke liye istemal karो. Ye asli kाran hai ki Module 3 ne har paginated queryset ko explicitly ordered hone par zor diya.

## Filtering — \`DjangoFilterBackend\`

**Saral**: \`filterset_fields = ["status", "author"]\` → \`?status=published&author=7\` (exact match, ANDed). Dict form lookups allow karता hai: \`{"views": ["gte", "lte"]}\` → \`?views__gte=100\`.

**Custom \`FilterSet\`** ranges, method filters ke liye. View par \`filterset_class = ArticleFilter\` set karो.

## Search — \`SearchFilter\`

\`search_fields = ["title", "body", "author__name"]\` → \`?search=django\` sab listed fields par ek case-insensitive \`icontains\` karता hai, ORed. Prefixes: \`^\` starts-with, \`=\` exact, \`@\` full-text (Postgres), \`$\` regex.

## Ordering — \`OrderingFilter\`

\`ordering_fields = ["created_at", "title", "views"]\` → \`?ordering=-created_at,title\`. \`ordering = ["-created_at"]\` default set karता hai. Ek allowlist chाहिए — ek unindexed column par ordering ek dheeमी query hai.

## Backends ka order maayne rakhता hai

\`filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]\` — har backend sequence mein chalता hai \`get_queryset()\` ke queryset par, pagination se pehle. Sab aapke \`get_queryset\` scoping ke saath composes karता hai — ek client sirf un rows ke *andar* filter/search/order kar sakta hai jinhe \`get_queryset\` ne pehle se limit kiya.`,

    examples: [
      {
        title: 'DefaultRouter: one register() -> the whole URL set',
        titleHi: 'DefaultRouter: ek register() -> poora URL set',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": []})
django.setup()

from django.db import models, connection
from django.urls import include, path, reverse
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter
from rest_framework.test import APIClient

class Widget(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Widget)
Widget.objects.create(name="alpha")

class WidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Widget
        fields = ["id", "name"]

class WidgetViewSet(viewsets.ModelViewSet):
    queryset = Widget.objects.all().order_by("id")
    serializer_class = WidgetSerializer
    @action(detail=False)
    def count(self, request):
        return Response({"total": self.get_queryset().count()})

router = DefaultRouter()
router.register("widgets", WidgetViewSet)          # basename inferred -> "widget"
urlpatterns = [path("api/", include(router.urls))]

c = APIClient()
print("list (no pagination configured -> plain array):", c.get("/api/widgets/").json())
print("retrieve:", c.get("/api/widgets/1/").json())
r = c.post("/api/widgets/", {"name": "beta"}, format="json")
print("create:", r.status_code, r.json())
print("@action:", c.get("/api/widgets/count/").json())
print("patch:", c.patch("/api/widgets/1/", {"name": "ALPHA"}, format="json").json())
print("delete:", c.delete("/api/widgets/2/").status_code)
print("api root:", sorted(c.get("/api/").json().keys()))
print("reverse:", reverse("widget-list"), reverse("widget-detail", kwargs={"pk": 1}))`,
        output: `list (no pagination configured -> plain array): [{'id': 1, 'name': 'alpha'}]
retrieve: {'id': 1, 'name': 'alpha'}
create: 201 {'id': 2, 'name': 'beta'}
@action: {'total': 2}
patch: {'id': 1, 'name': 'ALPHA'}
delete: 204
api root: ['widgets']
reverse: /api/widgets/ /api/widgets/1/
`,
        explain: 'A single `router.register("widgets", WidgetViewSet)` produces every route: `GET|POST /api/widgets/` (list/create), `GET|PUT|PATCH|DELETE /api/widgets/{pk}/` (retrieve/update/partial_update/destroy), `GET /api/widgets/count/` for the `@action`, and — because it is a `DefaultRouter` — `GET /api/` listing the registered viewsets. `basename` was inferred as `"widget"` from `queryset.model`, so `reverse("widget-list")` / `reverse("widget-detail", ...)` resolve. No pagination is configured here, so `list` returns a plain JSON array (not the `{count, results}` wrapper).',
        explainHi: 'Ek `router.register("widgets", WidgetViewSet)` har route produce karता hai: `GET|POST /api/widgets/`, `GET|PUT|PATCH|DELETE /api/widgets/{pk}/`, `@action` ke liye `GET /api/widgets/count/`, aur — kyunki ye ek `DefaultRouter` hai — registered viewsets list karता `GET /api/`. `basename` `queryset.model` se `"widget"` infer kiya gaya. Yahaan koi pagination configured nahi, toh `list` ek plain JSON array lautाता hai.',
      },
      {
        title: 'PageNumber vs Cursor pagination: response shape and the missing count',
        titleHi: 'PageNumber vs Cursor pagination: response shape aur missing count',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": []})
django.setup()

from django.db import models, connection
from django.urls import path
from rest_framework import serializers, generics
from rest_framework.pagination import PageNumberPagination, CursorPagination
from rest_framework.test import APIClient

class Event(models.Model):
    label = models.CharField(max_length=20)
    seq = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Event)
Event.objects.bulk_create([Event(label=f"e{i}", seq=i) for i in range(23)])

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["seq"]

class PagePagination(PageNumberPagination):
    page_size = 10

class SeqCursorPagination(CursorPagination):
    page_size = 10
    ordering = "seq"                      # REQUIRED for cursor pagination

class PageList(generics.ListAPIView):
    queryset = Event.objects.all().order_by("seq")
    serializer_class = EventSerializer
    pagination_class = PagePagination

class CursorListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = SeqCursorPagination

urlpatterns = [path("page/", PageList.as_view()), path("cursor/", CursorListView.as_view())]

c = APIClient()
p1 = c.get("/page/?page=1").json()
print("page 1 keys:", sorted(p1.keys()), "| count:", p1["count"], "| seqs:", [r["seq"] for r in p1["results"]])
p3 = c.get("/page/?page=3").json()
print("page 3 seqs:", [r["seq"] for r in p3["results"]], "| next:", p3["next"])

cur1 = c.get("/cursor/").json()
print("cursor page 1 keys:", sorted(cur1.keys()), "| seqs:", [r["seq"] for r in cur1["results"]])
print("cursor has NO count:", "count" not in cur1)
# follow the opaque cursor
next_url = cur1["next"].replace("http://testserver", "")
cur2 = c.get(next_url).json()
print("cursor page 2 seqs:", [r["seq"] for r in cur2["results"]])`,
        output: `page 1 keys: ['count', 'next', 'previous', 'results'] | count: 23 | seqs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
page 3 seqs: [20, 21, 22] | next: None
cursor page 1 keys: ['next', 'previous', 'results'] | seqs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
cursor has NO count: True
cursor page 2 seqs: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
`,
        explain: '`PageNumberPagination` wraps the list in `{count, next, previous, results}` — `count` is a `COUNT(*)` (23), and `?page=N` maps to `LIMIT 10 OFFSET (N-1)*10`. `CursorPagination` requires an `ordering` (`"seq"` here) and returns `{next, previous, results}` with **no `count`** — that is the point: no `COUNT` query, and each page is an indexed range scan (`WHERE seq > :last`) that costs the same at any depth. The trade: the client follows the opaque `next` cursor and cannot jump to an arbitrary page. Use cursor for feeds and large/deep lists (Module 3\'s "always order your queryset" is what makes it possible).',
        explainHi: '`PageNumberPagination` list ko `{count, next, previous, results}` mein wrap karता hai — `count` ek `COUNT(*)` hai (23), aur `?page=N` `LIMIT 10 OFFSET (N-1)*10` par map karता hai. `CursorPagination` ko ek `ordering` chahिए (`"seq"`) aur `{next, previous, results}` lautाता hai **koi `count` nahi** — yahi point hai: koi `COUNT` query nahi, aur har page ek indexed range scan hai jо kisi bhi depth par wahi cost. Sौda: client opaque `next` cursor follow karता hai aur arbitrary page par jump nahi kar sakta.',
      },
      {
        title: 'DjangoFilterBackend + SearchFilter + OrderingFilter, composed',
        titleHi: 'DjangoFilterBackend + SearchFilter + OrderingFilter, composed',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "django_filters", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": []})
django.setup()

from django.db import models, connection
from django.urls import path
import django_filters as df
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers, generics
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.test import APIClient

class Book(models.Model):
    title = models.CharField(max_length=100)
    status = models.CharField(max_length=10)
    pages = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Book)
Book.objects.bulk_create([
    Book(title="Django Unchained notes", status="published", pages=120),
    Book(title="Learning Django", status="published", pages=400),
    Book(title="Draft on Django", status="draft", pages=50),
    Book(title="Flask basics", status="published", pages=200),
])

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["title", "status", "pages"]

class BookFilter(df.FilterSet):
    min_pages = df.NumberFilter(field_name="pages", lookup_expr="gte")
    class Meta:
        model = Book
        fields = ["status"]

class BookList(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = None
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = BookFilter
    search_fields = ["title"]
    ordering_fields = ["pages", "title"]
    ordering = ["title"]

urlpatterns = [path("books/", BookList.as_view())]
c = APIClient()

def titles(qs): return [b["title"] for b in c.get("/books/" + qs).json()]

print("no params (default order by title):", titles(""))
print("?status=published:", titles("?status=published"))
print("?search=django:", titles("?search=django"))
print("?status=published&search=django:", titles("?status=published&search=django"))
print("?min_pages=150&ordering=-pages:", titles("?min_pages=150&ordering=-pages"))`,
        output: `no params (default order by title): ['Django Unchained notes', 'Draft on Django', 'Flask basics', 'Learning Django']
?status=published: ['Django Unchained notes', 'Flask basics', 'Learning Django']
?search=django: ['Django Unchained notes', 'Draft on Django', 'Learning Django']
?status=published&search=django: ['Django Unchained notes', 'Learning Django']
?min_pages=150&ordering=-pages: ['Learning Django', 'Flask basics']
`,
        explain: 'The three backends run in sequence on `get_queryset()`\'s result, before pagination. `DjangoFilterBackend` with `BookFilter` handles `?status=` (exact, from `Meta.fields`) and `?min_pages=` (a `NumberFilter` with `lookup_expr="gte"`). `SearchFilter` with `search_fields=["title"]` does `?search=django` as a case-insensitive `icontains`. `OrderingFilter` with `ordering_fields=["pages","title"]` handles `?ordering=-pages`, and `ordering=["title"]` is the default sort when the param is absent. Combining params ANDs them: `?status=published&search=django` returns published books whose title contains "django".',
        explainHi: 'Teenों backends sequence mein `get_queryset()` ke result par chalते hain, pagination se pehle. `DjangoFilterBackend` `BookFilter` ke saath `?status=` (exact) aur `?min_pages=` (ek `NumberFilter` `lookup_expr="gte"` ke saath) handle karता hai. `SearchFilter` `?search=django` ko ek case-insensitive `icontains` ki tarah karता hai. `OrderingFilter` `?ordering=-pages` handle karता hai, aur `ordering=["title"]` default sort hai. Params combine karna unhe AND karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# settings.py -- no pagination configured at all
REST_FRAMEWORK = {}
# GET /api/orders/ returns ALL 2,000,000 orders in one response -> OOM / timeout`,
        right: `REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 50,
}
# every list endpoint is now capped; override per-view with pagination_class where needed`,
        why: 'DRF does not paginate unless you configure it. A list endpoint with no pagination class serialises the entire queryset — fine at 20 rows, a memory-and-latency disaster at 2 million. Set a project-wide `DEFAULT_PAGINATION_CLASS` + `PAGE_SIZE` on day one; opt specific views out with `pagination_class = None` deliberately, not by omission.',
        whyHi: 'DRF paginate nahi karता jab tak aap configure na karो. Bina pagination class ke ek list endpoint poore queryset ko serialise karता hai — 20 rows par theek, 2 million par ek memory-and-latency disaster. Pehle din ek project-wide `DEFAULT_PAGINATION_CLASS` + `PAGE_SIZE` set karो.',
      },
      {
        wrong: `class FeedCursorPagination(CursorPagination):
    page_size = 20
    # no 'ordering' set
# -> AssertionError: 'FeedCursorPagination' must define an 'ordering' attribute`,
        right: `class FeedCursorPagination(CursorPagination):
    page_size = 20
    ordering = "-created_at"     # or a tuple ("-created_at", "-id") for a strict total order`,
        why: '`CursorPagination` is keyset pagination — it needs a column to seek on. It refuses to run without `ordering`. The field should be non-decreasing and ideally unique; a plain `-created_at` works but two rows with the same timestamp can be unstable across pages, so add a unique tiebreaker (`("-created_at", "-id")`). Whatever you pick must be indexed, or every page is a slow scan.',
        whyHi: '`CursorPagination` keyset pagination hai — ise seek karne ke liye ek column chahिए. Ye `ordering` ke bina chalने se mana karता hai. Field non-decreasing aur ideally unique honा chahिए; ek plain `-created_at` kaam karता hai par same timestamp waali do rows unstable ho sakti hain, toh ek unique tiebreaker add karो. Jо bhi chunо wo indexed hona chahिए.',
      },
      {
        wrong: `class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status", "author", "secret_internal_score"]
    ordering_fields = "__all__"
# a client can filter/sort by any column, incl. unindexed ones -> slow queries on demand`,
        right: `filterset_fields = ["status", "author"]           # allowlist of safe, indexed filters
ordering_fields = ["created_at", "title", "views"]  # allowlist -- all indexed`,
        why: 'Every field you expose to `filterset_fields` / `ordering_fields` is a query a client can trigger. Exposing an unindexed column lets a client run a full table scan on demand (a cheap DoS); exposing an internal column leaks its existence and lets it be used as an oracle. Keep both lists to a deliberate allowlist of fields that are safe to filter on and backed by an index.',
        whyHi: 'Har field jо aap `filterset_fields` / `ordering_fields` ko expose karते ho ek query hai jise ek client trigger kar sakta hai. Ek unindexed column expose karna ek client ko demand par ek full table scan chalाने deता hai (ek sasta DoS). Dono lists ko un fields ki ek deliberate allowlist tak rakhो jо filter karne ke liye surakshit hain aur ek index se backed.',
      },
    ],

    realWorld: [
      {
        en: '**`DefaultRouter` in `api/urls.py`, one `register()` per resource** — `router.register("articles", ...)`, `router.register("comments", ...)`, then `path("v1/", include(router.urls))`. Adding a resource is one line; the browsable API root doubles as living documentation.',
        hi: '**`api/urls.py` mein `DefaultRouter`, prati resource ek `register()`** — phir `path("v1/", include(router.urls))`. Ek resource add karna ek line hai; browsable API root living documentation ki tarah kaam karता hai.',
      },
      {
        en: '**`CursorPagination` for feeds and exports, `PageNumberPagination` for admin/back-office lists** — the activity feed and the "download all transactions" endpoint use cursor (constant time, no COUNT); the internal orders table a support agent pages through uses page numbers (they want "page 4 of 12").',
        hi: '**Feeds aur exports ke liye `CursorPagination`, admin/back-office lists ke liye `PageNumberPagination`** — activity feed aur "saare transactions download" endpoint cursor istemal karте hain; internal orders table jise ek support agent page karता hai page numbers istemal karता hai.',
      },
      {
        en: '**A shared `FilterSet` base + per-resource subclasses** — `TenantScopedFilterSet` that always injects `org=request.user.org`, extended by `ArticleFilter`, `OrderFilter`, each adding its own range/choice filters. `?created_after=`, `?status__in=`, `?min_total=` become consistent across the API.',
        hi: '**Ek shared `FilterSet` base + per-resource subclasses** — `TenantScopedFilterSet` jо hamesha `org=request.user.org` inject karता hai, `ArticleFilter`, `OrderFilter` dwara extended.',
      },
    ],

    interviewQA: [
      {
        q: 'What does a DRF router generate, and when do you have to pass `basename`?',
        qHi: 'Ek DRF router kya generate karता hai, aur aapko `basename` kab pass karna hoता hai?',
        a: 'You call router dot register with a URL prefix, a viewset class, and optionally a basename. From that one call the router builds the full URL configuration for the resource: a list route at prefix slash, mapping GET to the list action and POST to create, named basename dash list; a detail route at prefix slash lookup slash, mapping GET to retrieve, PUT to update, PATCH to partial_update, and DELETE to destroy, named basename dash detail; one route for every method decorated with at-action, detail or not; and, with format_suffix_patterns, dot json and dot api variants of all of those. A DefaultRouter additionally adds an API root view at the base URL that lists every registered viewset with hyperlinks, which doubles as browsable documentation; SimpleRouter is the same without that root view. You then expose router dot urls, usually via include under a versioned prefix. basename is the string the router uses to name the URL patterns, so reverse of basename dash list and basename dash detail resolve. The router can infer it from the model of the viewset\'s queryset attribute — register a viewset with queryset equals Article objects all and basename becomes article automatically. But if the viewset defines only get_queryset and has no queryset attribute, there is no model to infer from, and the router raises an error telling you to pass basename explicitly. It is also worth passing explicitly whenever you want the URL names to stay stable regardless of refactors to the queryset.',
        aHi: 'Aap router dot register ko ek URL prefix, ek viewset class, aur optionally ek basename ke saath call karते ho. Us ek call se router resource ke liye poori URL configuration banाता hai: prefix slash par ek list route, GET ko list action aur POST ko create par map karके, basename dash list named; prefix slash lookup slash par ek detail route, GET ko retrieve, PUT ko update, PATCH ko partial_update, DELETE ko destroy par map karके; at-action se decorated har method ke liye ek route; aur format_suffix_patterns ke saath un sabke dot json aur dot api variants. Ek DefaultRouter additionally base URL par ek API root view add karता hai jо har registered viewset ko list karता hai. Aap phir router dot urls expose karते ho. basename wo string hai jise router URL patterns name karने ke liye istemal karता hai. Router ise viewset ke queryset attribute ke model se infer kar sakta hai. Par agar viewset sirf get_queryset define karता hai aur koi queryset attribute nahi, infer karne ke liye koi model nahi, aur router ek error raise karता hai.',
      },
      {
        q: 'Compare offset pagination and cursor pagination in DRF — response shape, cost, and when to use each.',
        qHi: 'DRF mein offset pagination aur cursor pagination ki tulna karो — response shape, cost, aur kab kaunsा.',
        a: 'PageNumberPagination and LimitOffsetPagination are both offset-based. The client asks for page N, or a limit and an offset, and DRF translates that to SQL LIMIT and OFFSET on an ordered queryset. The response wraps the results in an object with count, next, and previous. Two costs come with that. OFFSET is not free — the database generates and discards every skipped row, so page eight hundred means scanning past twenty thousand rows on every request. And count runs a separate COUNT star aggregate over the filtered queryset every time. For a bounded list — an admin table, search results a user pages a few screens of — this is completely fine, and page numbers are what a back-office user expects. CursorPagination is keyset pagination. Instead of an offset it encodes an opaque cursor pointing at the last row of the current page, and the next request filters on where the ordering column is beyond that value, then takes a page. The response has next, previous, and results but deliberately no count, because there is no COUNT query. Each page is an indexed range scan that costs the same whether it is page two or page two thousand. The class requires an ordering attribute, ideally on an indexed, non-decreasing, near-unique column with a tiebreaker. The trade-offs: the client cannot jump to an arbitrary page number, only step forward and back, and rows inserted or deleted near the cursor do not shift items across page boundaries, which is actually desirable for a feed. So: cursor for infinite-scroll feeds, large exports, any deep or unbounded list, and public APIs over big tables; offset for bounded lists where the user benefits from jumping to a specific page and the table is small enough that OFFSET and COUNT are cheap.',
        aHi: 'PageNumberPagination aur LimitOffsetPagination dono offset-based hain. Client page N maangता hai, ya ek limit aur offset, aur DRF ise ek ordered queryset par SQL LIMIT aur OFFSET mein translate karता hai. Response results ko count, next, previous ke saath ek object mein wrap karता hai. Do costs aaती hain. OFFSET muft nahi hai — database har skip ki row generate karके discard karता hai. Aur count har baar ek alag COUNT star aggregate chalाता hai. Ek bounded list ke liye ye theek hai. CursorPagination keyset pagination hai. Ek offset ke bजाy ye ek opaque cursor encode karता hai jо current page ki last row ki taraf ishaरा karता hai, aur agli request filter karती hai jahaan ordering column us value se aage hai. Response mein next, previous, results hain par jaanbujhकर koi count nahi. Har page ek indexed range scan hai jо page 2 ya page 2000 par wahi cost. Class ko ek ordering attribute chahिए. Trade-offs: client arbitrary page number par jump nahi kar sakta. Toh: feeds, large exports, gehरी lists ke liye cursor; bounded lists ke liye offset.',
      },
    ],

    exercises: [
      {
        task: 'Standalone DRF. Model `Tag` (`name` unique) and `Note` (`title`, `body`). Register `NoteViewSet(ModelViewSet)` and `TagViewSet(ReadOnlyModelViewSet)` with a `DefaultRouter` under `/api/`. With `APIClient`: hit `GET /api/` and assert both `notes` and `tags` keys appear; do a full CRUD cycle on notes (create -> retrieve -> patch -> delete with the right status codes); confirm `POST /api/tags/` returns 405 (read-only). Print `reverse("note-list")` and `reverse("note-detail", kwargs={"pk": 1})`.',
        taskHi: 'Standalone DRF. `Tag` (`name` unique) aur `Note` model karो. `NoteViewSet(ModelViewSet)` aur `TagViewSet(ReadOnlyModelViewSet)` `DefaultRouter` se `/api/` ke tahat register karो. `GET /api/` mein dono keys, full CRUD cycle, `POST /api/tags/` -> 405.',
        hint: '`path("api/", include(router.urls))`. `ReadOnlyModelViewSet` has no `create` action -> POST is 405. `c.delete(url)` -> 204. `from django.urls import reverse`.',
        hintHi: '`path("api/", include(router.urls))`. `ReadOnlyModelViewSet` ke paas `create` action nahi -> POST 405. `c.delete(url)` -> 204.',
      },
      {
        task: 'Model `Ping` (`host`, `ms` int, `at` int -- a sequence). Insert 55 pings with `at` = 0..54. Build a `ListAPIView` with a `PageNumberPagination` subclass (`page_size=20`) and another with a `CursorPagination` subclass (`page_size=20`, `ordering="at"`). Assert: the page version\'s response has `count == 55` and page 3 has 15 items; the cursor version has NO `count` key, page 1 has `at` 0..19, and following `next` gives `at` 20..39.',
        taskHi: '`Ping` (`host`, `ms`, `at`) model karो. 55 pings insert karो. Ek `ListAPIView` `PageNumberPagination` (`page_size=20`) ke saath aur ek `CursorPagination` (`page_size=20`, `ordering="at"`) ke saath. Assert karो.',
        hint: 'Two separate view classes, two URLs. For cursor, follow `response.json()["next"]` (strip `http://testserver`). `"count" not in cursor_response` is the key assertion. Cursor `ordering` must be set or it raises.',
        hintHi: 'Do alag view classes, do URLs. Cursor ke liye `response.json()["next"]` follow karो (`http://testserver` strip). `"count" not in cursor_response` key assertion hai.',
      },
      {
        task: 'Model `Product` (`name`, `category`, `price_cents` int, `in_stock` bool). Insert ~8 products across 3 categories. `ProductList(ListAPIView)` with `pagination_class = None`, `filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]`, a `ProductFilter(FilterSet)` exposing `category` (exact) + `min_price`/`max_price` (NumberFilter on `price_cents` with `gte`/`lte`), `search_fields = ["name"]`, `ordering_fields = ["price_cents", "name"]`, default `ordering = ["name"]`. Assert results for: no params; `?category=X`; `?search=` (partial name); `?min_price=&max_price=`; `?category=X&ordering=-price_cents`.',
        taskHi: '`Product` (`name`, `category`, `price_cents`, `in_stock`) model karो. ~8 products. `ProductList(ListAPIView)` `pagination_class = None`, teenों filter_backends, ek `ProductFilter(FilterSet)` `category` + `min_price`/`max_price` ke saath. Cases assert karो.',
        hint: '`"django_filters"` in `INSTALLED_APPS`. `min_price = df.NumberFilter(field_name="price_cents", lookup_expr="gte")`. `filterset_class` and `filterset_fields` are mutually exclusive — use the class. Backends compose in list order.',
        hintHi: '`"django_filters"` `INSTALLED_APPS` mein. `min_price = df.NumberFilter(field_name="price_cents", lookup_expr="gte")`. `filterset_class` aur `filterset_fields` mutually exclusive.',
      },
    ],

    keyTakeaways: [
      '`router.register(prefix, ViewSet, basename=)` generates: `{prefix}/` (list/create, name `{basename}-list`), `{prefix}/{lookup}/` (retrieve/update/partial_update/destroy, name `{basename}-detail`), one route per `@action`, format suffixes, and (`DefaultRouter` only) a browsable API-root view at `/`.',
      '`basename` is inferred from `ViewSet.queryset.model`; REQUIRED when the viewset only defines `get_queryset()`. It is the base for `reverse()`.',
      'DRF does NOT paginate unless configured. Set `DEFAULT_PAGINATION_CLASS` + `PAGE_SIZE` project-wide on day one; opt out per view with `pagination_class = None` deliberately.',
      '`PageNumberPagination` (`?page=N`) and `LimitOffsetPagination` (`?limit=&offset=`) are OFFSET-based: `{count, next, previous, results}`, a `COUNT(*)` per request, and `OFFSET` cost that grows with depth. Fine for bounded / admin lists.',
      '`CursorPagination` (`?cursor=<opaque>`) is KEYSET: `{next, previous, results}` with NO `count`, O(1) per page at any depth. REQUIRES an `ordering` attr (indexed, stable, ideally unique — use a tuple for a tiebreaker). Client cannot jump to an arbitrary page. Use for feeds, exports, deep/unbounded lists. This is Module 3\'s "always order your queryset" paying off.',
      '`filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]` run in order on `get_queryset()`\'s result, before pagination, and compose with your scoping.',
      '`DjangoFilterBackend`: `filterset_fields = ["status", "author"]` (exact, ANDed) or `filterset_fields = {"views": ["gte", "lte"]}` (lookups) or a full `filterset_class = MyFilterSet` (ranges, method filters). `SearchFilter`: `search_fields` + `?search=` (icontains, ORed; `^`/`=`/`@`/`$` prefixes). `OrderingFilter`: `ordering_fields` + `?ordering=-a,b`, `ordering=[...]` default.',
      'Keep `filterset_fields` / `ordering_fields` a deliberate ALLOWLIST of indexed, safe-to-expose fields — exposing an unindexed column lets a client trigger a full scan on demand.',
    ],
    keyTakeawaysHi: [
      '`router.register(prefix, ViewSet, basename=)` generate karता hai: `{prefix}/` (list/create), `{prefix}/{lookup}/` (retrieve/update/partial_update/destroy), prati `@action` ek route, format suffixes, aur (`DefaultRouter` only) `/` par ek browsable API-root view.',
      '`basename` `ViewSet.queryset.model` se inferred hoता hai; ZAROORI jab viewset sirf `get_queryset()` define karता hai. `reverse()` ke liye base.',
      'DRF paginate NAHI karता jab tak configure na ho. Pehle din project-wide `DEFAULT_PAGINATION_CLASS` + `PAGE_SIZE` set karो; prati view `pagination_class = None` se deliberately opt out.',
      '`PageNumberPagination` (`?page=N`) aur `LimitOffsetPagination` (`?limit=&offset=`) OFFSET-based hain: `{count, next, previous, results}`, prati request ek `COUNT(*)`, aur depth ke saath badhती `OFFSET` cost. Bounded / admin lists ke liye theek.',
      '`CursorPagination` (`?cursor=<opaque>`) KEYSET hai: `{next, previous, results}` NO `count` ke saath, kisi bhi depth par prati page O(1). Ek `ordering` attr ZAROORI (indexed, stable, ideally unique). Client arbitrary page par jump nahi kar sakta. Feeds, exports, gehरी lists ke liye. Ye Module 3 ka "hamesha queryset order karो" ka payoff hai.',
      '`filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]` order mein `get_queryset()` ke result par chalते hain, pagination se pehle, aur aapke scoping ke saath compose karते hain.',
      '`DjangoFilterBackend`: `filterset_fields` (exact) ya dict (lookups) ya `filterset_class`. `SearchFilter`: `search_fields` + `?search=` (icontains, ORed). `OrderingFilter`: `ordering_fields` + `?ordering=-a,b`.',
      '`filterset_fields` / `ordering_fields` ko indexed, safe fields ki ek deliberate ALLOWLIST rakhо — ek unindexed column expose karna ek client ko demand par ek full scan trigger karने deता hai.',
    ],
  },

  {
    slug: 'dj-drf-content-negotiation-versioning-settings',
    title: 'Content Negotiation, Versioning & the Settings Block',
    titleHi: 'Content Negotiation, Versioning & Settings Block',
    description: 'A DRF `Response` holds native Python; a *renderer* chosen by the `Accept` header turns it into bytes (JSON in prod, the browsable HTML API in dev). Versioning schemes expose `request.version` so one codebase can serve `v1` and `v2`. The `REST_FRAMEWORK` settings dict is where auth, permissions, pagination, throttling, renderers, and the exception handler are configured once for the whole project.',
    descriptionHi: 'Ek DRF `Response` native Python rakhता hai; `Accept` header dwara chuna ek *renderer* ise bytes banाता hai (prod mein JSON, dev mein browsable HTML API). Versioning schemes `request.version` expose karती hain toh ek codebase `v1` aur `v2` serve kar sakta hai. `REST_FRAMEWORK` settings dict wahaan hai jahaan auth, permissions, pagination, throttling, renderers, aur exception handler poore project ke liye ek baar configure hote hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 6,

    analogy: {
      en: '**A restaurant kitchen that plates the same dish differently depending on where it is going, tracks which recipe version each order used, and keeps house rules on one clipboard.** The kitchen cooks the dish once (your view builds a Python dict). Content negotiation is the pass: a dine-in order gets it on a warm plate with garnish (the browsable HTML API for a developer in a browser), a delivery order gets it in a sealed container (compact JSON for a client), a catering order might get it in a foil tray (CSV, XML) — same food, different packaging, chosen by what the ticket says (`Accept` header). Versioning is the recipe-card number stamped on every ticket so the line cook knows "this table ordered the 2019 recipe, not the new one" (`request.version` → the view or serializer branches). And the house rules — who is allowed in the kitchen, how many orders per minute, what to do when a dish is dropped — live on one clipboard by the door, not re-taped to every station (the `REST_FRAMEWORK` settings dict).',
      hi: '**Ek restaurant kitchen jо same dish ko alag plate karता hai jahaan ye jа raha hai uske hisab se, track karता hai kaunsा recipe version har order ne istemal kiya, aur house rules ek clipboard par rakhता hai.** Kitchen dish ek baar pakाता hai (aapka view ek Python dict banаता hai). Content negotiation pass hai: ek dine-in order ise ek warm plate par garnish ke saath paता hai (developer ke liye browsable HTML API), ek delivery order ise ek sealed container mein paता hai (compact JSON), ek catering order shायद foil tray mein (CSV, XML) — same khana, alag packaging, ticket jо kehта hai uske hisab se chuna (`Accept` header). Versioning har ticket par stamp kiya recipe-card number hai taaki line cook jaane "is table ne 2019 recipe order ki, nayi nahi" (`request.version`). Aur house rules — kaun kitchen mein aa sakta hai, prati minute kितne orders — ek clipboard par darvaze ke paas rehते hain (`REST_FRAMEWORK` settings dict).',
    },

    simple: `**Content negotiation — the same view, different output**

\`\`\`python
class ArticleView(APIView):
    def get(self, request):
        return Response({"id": 1, "title": "Hi"})     # native Python

# GET /articles/1/   Accept: application/json  -> {"id": 1, "title": "Hi"}   (JSONRenderer)
# GET /articles/1/   Accept: text/html         -> the browsable API HTML page (BrowsableAPIRenderer)
# GET /articles/1/.json  or  ?format=json      -> force JSON (format suffix / query param)
\`\`\`

\`\`\`python
# settings.py -- production: JSON only, no browsable API
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": ["rest_framework.parsers.JSONParser"],   # what request.data accepts
}
\`\`\`

**Versioning — one codebase, many API versions**

\`\`\`python
REST_FRAMEWORK = {
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.URLPathVersioning",
    "DEFAULT_VERSION": "v1",
    "ALLOWED_VERSIONS": ["v1", "v2"],
}

# urls.py
urlpatterns = [path("api/<str:version>/", include(router.urls))]
# GET /api/v2/articles/  ->  request.version == "v2"
\`\`\`

\`\`\`python
class ArticleViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.request.version == "v2":
            return ArticleV2Serializer      # new field names, new shape
        return ArticleV1Serializer

    def get_queryset(self):
        qs = Article.objects.all()
        if self.request.version == "v1":
            qs = qs.exclude(status="archived")   # v1 never showed archived
        return qs
\`\`\`

**Versioning schemes**

\`\`\`
URLPathVersioning       /api/v2/articles/           request.version from the URL
NamespaceVersioning     include(..., namespace="v2")  request.version from the URL namespace
AcceptHeaderVersioning  Accept: application/json; version=2.0
QueryParameterVersioning  /api/articles/?version=2.0
HostNameVersioning      v2.api.example.com
\`\`\`

**The \`REST_FRAMEWORK\` settings block — configure once**

\`\`\`python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 25,
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_THROTTLE_CLASSES": ["rest_framework.throttling.ScopedRateThrottle"],
    "DEFAULT_THROTTLE_RATES": {"login": "5/min", "burst": "60/min"},
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],  # + BrowsableAPIRenderer in dev
    "EXCEPTION_HANDLER": "myproject.api.exceptions.custom_exception_handler",
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.URLPathVersioning",
    "DATETIME_FORMAT": "iso-8601",
}
# any per-view attribute (authentication_classes, permission_classes, ...) overrides the default
\`\`\`

**The exception handler**

\`\`\`python
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)     # DRF's default: maps APIException -> Response
    if response is not None:
        response.data = {"error": response.data, "status_code": response.status_code}
    return response
# DRF handles: ValidationError(400), NotAuthenticated(401), PermissionDenied(403),
#              NotFound(404), MethodNotAllowed(405), Throttled(429), APIException(500)
# a plain Python exception is NOT caught here -> 500 via Django (unless DEBUG shows the traceback)
\`\`\``,

    simpleHi: `**Content negotiation — wahi view, alag output**

\`\`\`python
class ArticleView(APIView):
    def get(self, request):
        return Response({"id": 1, "title": "Hi"})     # native Python

# Accept: application/json  -> {"id": 1, "title": "Hi"}   (JSONRenderer)
# Accept: text/html         -> browsable API HTML page (BrowsableAPIRenderer)
# .json  ya  ?format=json   -> force JSON
\`\`\`

\`\`\`python
# production: sirf JSON, koi browsable API nahi
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": ["rest_framework.parsers.JSONParser"],
}
\`\`\`

**Versioning — ek codebase, kai API versions**

\`\`\`python
REST_FRAMEWORK = {
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.URLPathVersioning",
    "DEFAULT_VERSION": "v1",
    "ALLOWED_VERSIONS": ["v1", "v2"],
}

# urls.py
urlpatterns = [path("api/<str:version>/", include(router.urls))]
# GET /api/v2/articles/  ->  request.version == "v2"
\`\`\`

\`\`\`python
class ArticleViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.request.version == "v2":
            return ArticleV2Serializer
        return ArticleV1Serializer
\`\`\`

**Versioning schemes**

\`\`\`
URLPathVersioning       /api/v2/articles/           request.version URL se
NamespaceVersioning     include(..., namespace="v2")  request.version URL namespace se
AcceptHeaderVersioning  Accept: application/json; version=2.0
QueryParameterVersioning  /api/articles/?version=2.0
\`\`\`

**\`REST_FRAMEWORK\` settings block — ek baar configure**

\`\`\`python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [...],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 25,
    "DEFAULT_THROTTLE_RATES": {"login": "5/min"},
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "EXCEPTION_HANDLER": "myproject.api.exceptions.custom_exception_handler",
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.URLPathVersioning",
}
# koi bhi per-view attribute default ko override karता hai
\`\`\`

**Exception handler**

\`\`\`python
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)     # DRF default: APIException -> Response
    if response is not None:
        response.data = {"error": response.data, "status_code": response.status_code}
    return response
# DRF handle karता hai: ValidationError(400), NotAuthenticated(401), PermissionDenied(403),
#              NotFound(404), MethodNotAllowed(405), Throttled(429), APIException(500)
# ek plain Python exception yahaan catch NAHI hoता -> Django ke zariye 500
\`\`\``,

    content: `## Content negotiation

Your view returns \`Response(data)\` where \`data\` is native Python. DRF then:

1. **Negotiates a renderer** — matches the request's \`Accept\` header (or a \`?format=\` param or a \`.json\` URL suffix) against \`renderer_classes\` (or \`DEFAULT_RENDERER_CLASSES\`). The first acceptable one wins; if none match, \`406 Not Acceptable\`.
2. **Renders** — the chosen renderer's \`render(data, media_type, context)\` produces bytes and sets \`Content-Type\`.

Built-in renderers: \`JSONRenderer\` (the workhorse), \`BrowsableAPIRenderer\` (the interactive HTML page — dev only), \`TemplateHTMLRenderer\`, \`StaticHTMLRenderer\`, \`AdminRenderer\`. Third-party: CSV, XML, YAML, MessagePack.

**Parsers are the input mirror.** \`request.data\` is populated by the first parser (\`parser_classes\` / \`DEFAULT_PARSER_CLASSES\`) that matches the request's \`Content-Type\`: \`JSONParser\`, \`FormParser\`, \`MultiPartParser\` (file uploads), \`FileUploadParser\`.

**Production**: pin \`DEFAULT_RENDERER_CLASSES\` to \`["rest_framework.renderers.JSONRenderer"]\` and \`DEFAULT_PARSER_CLASSES\` to JSON (+ MultiPart if you accept uploads). Keep \`BrowsableAPIRenderer\` only in the dev settings — it is a large dependency surface and leaks form structure.

## Versioning

DRF versioning does one job: it sets \`request.version\` (a string) from wherever the scheme reads it, and validates it against \`ALLOWED_VERSIONS\`. **You** decide what to do with it — DRF does not maintain parallel code for you.

| Scheme | Version comes from | URL example |
|---|---|---|
| \`URLPathVersioning\` | a \`<version>\` URL kwarg | \`/api/v2/articles/\` |
| \`NamespaceVersioning\` | the URL \`namespace\` | \`/api/v2/articles/\` (via \`include(namespace="v2")\`) |
| \`AcceptHeaderVersioning\` | \`Accept: …; version=2.0\` | — (header only) |
| \`QueryParameterVersioning\` | \`?version=\` | \`/api/articles/?version=2.0\` |
| \`HostNameVersioning\` | the subdomain | \`v2.api.example.com\` |

\`URLPathVersioning\` is the most common — the version is visible, cache-friendly, and trivial to route. Config: \`DEFAULT_VERSION\` (used when none given), \`ALLOWED_VERSIONS\` (a request for anything else → \`404\`), \`VERSION_PARAM\`.

### Using \`request.version\`

- **Different serializer**: \`get_serializer_class()\` returns \`V1Serializer\` or \`V2Serializer\` based on \`self.request.version\`.
- **Different queryset / behaviour**: \`get_queryset()\` filters differently; an \`@action\` 404s on old versions.
- **Serializer-internal**: a serializer reads \`self.context["request"].version\` and includes/renames a field.
- **Hyperlinks**: versioned schemes make \`reverse()\` / \`HyperlinkedRelatedField\` produce version-correct URLs automatically.

Keep the number of live versions small (usually 2) and have a deprecation policy — every version is code you maintain and test.

## The \`REST_FRAMEWORK\` settings dict

A single dict in \`settings.py\`. Every \`DEFAULT_*\` key sets a project-wide default that any view can override with the matching class attribute:

| Setting | Per-view attribute | What |
|---|---|---|
| \`DEFAULT_AUTHENTICATION_CLASSES\` | \`authentication_classes\` | how \`request.user\` is determined (Module 6) |
| \`DEFAULT_PERMISSION_CLASSES\` | \`permission_classes\` | who may call the view (Module 6) |
| \`DEFAULT_PAGINATION_CLASS\` + \`PAGE_SIZE\` | \`pagination_class\` | list wrapping (lesson 5) |
| \`DEFAULT_FILTER_BACKENDS\` | \`filter_backends\` | filtering (lesson 5) |
| \`DEFAULT_THROTTLE_CLASSES\` + \`DEFAULT_THROTTLE_RATES\` | \`throttle_classes\` | rate limiting (Module 6) |
| \`DEFAULT_RENDERER_CLASSES\` / \`DEFAULT_PARSER_CLASSES\` | \`renderer_classes\` / \`parser_classes\` | output / input formats |
| \`DEFAULT_VERSIONING_CLASS\` | \`versioning_class\` | how \`request.version\` is set |
| \`EXCEPTION_HANDLER\` | — (project-wide only) | how exceptions become responses |
| \`DATETIME_FORMAT\`, \`DATE_FORMAT\` | serializer field \`format=\` | wire format for dates |
| \`DEFAULT_SCHEMA_CLASS\` | — | OpenAPI schema generation |

Split it across settings modules (Module 10): a shared base, then dev adds \`BrowsableAPIRenderer\` and relaxes throttles, prod pins JSON-only and tightens them.

## The default exception handler

\`rest_framework.views.exception_handler(exc, context)\` is called for any exception raised in a view. It handles DRF's \`APIException\` hierarchy:

| Exception | Status |
|---|---|
| \`ValidationError\` | 400 |
| \`ParseError\` | 400 |
| \`AuthenticationFailed\` / \`NotAuthenticated\` | 401 |
| \`PermissionDenied\` | 403 |
| \`NotFound\` (incl. \`Http404\`) | 404 |
| \`MethodNotAllowed\` | 405 |
| \`NotAcceptable\` | 406 |
| \`Throttled\` | 429 |
| any other \`APIException\` | 500 (its \`status_code\`) |

A **non-\`APIException\`** (a \`KeyError\`, a \`ZeroDivisionError\`) returns \`None\` from the handler → Django's normal 500 path (a traceback in \`DEBUG\`, a plain 500 in production). So: raise DRF exceptions (\`raise NotFound()\`, \`raise PermissionDenied()\`, \`raise ValidationError({...})\`) from your code so they become proper responses; let genuine bugs 500.

**Customising**: wrap the default to reshape the body (a consistent \`{"error": …, "code": …}\` envelope), add a request id, log 5xx to Sentry, or map a specific library exception (e.g. \`django.core.exceptions.PermissionDenied\` vs DRF's) to the right status. Set it once via \`EXCEPTION_HANDLER\`.`,

    contentHi: `## Content negotiation

Aapka view \`Response(data)\` lautाता hai jahaan \`data\` native Python hai. DRF phir:

1. **Ek renderer negotiate karता hai** — request ke \`Accept\` header (ya ek \`?format=\` param ya ek \`.json\` URL suffix) ko \`renderer_classes\` ke khilaf match karता hai. Pehla acceptable jeetता hai; koi match nahi toh \`406 Not Acceptable\`.
2. **Render karता hai** — chuna renderer bytes produce karता hai aur \`Content-Type\` set karता hai.

Built-in renderers: \`JSONRenderer\`, \`BrowsableAPIRenderer\` (dev only), \`TemplateHTMLRenderer\`, \`StaticHTMLRenderer\`.

**Parsers input mirror hain.** \`request.data\` pehle parser dwara populate hoता hai jо request ke \`Content-Type\` se match karता hai: \`JSONParser\`, \`FormParser\`, \`MultiPartParser\` (file uploads).

**Production**: \`DEFAULT_RENDERER_CLASSES\` ko \`["rest_framework.renderers.JSONRenderer"]\` par pin karो. \`BrowsableAPIRenderer\` sirf dev settings mein rakhо.

## Versioning

DRF versioning ek kaam karता hai: ye \`request.version\` (ek string) set karता hai aur \`ALLOWED_VERSIONS\` ke khilaf validate karता hai. **Aap** tay karते ho iske saath kya karna hai.

- \`URLPathVersioning\` — ek \`<version>\` URL kwarg. \`/api/v2/articles/\`. Sabse aam.
- \`NamespaceVersioning\` — URL \`namespace\`.
- \`AcceptHeaderVersioning\` — \`Accept: …; version=2.0\`.
- \`QueryParameterVersioning\` — \`?version=\`.

Config: \`DEFAULT_VERSION\`, \`ALLOWED_VERSIONS\` (koi aur → \`404\`), \`VERSION_PARAM\`.

### \`request.version\` istemal karna

- **Alag serializer**: \`get_serializer_class()\` \`self.request.version\` ke aadhार par \`V1Serializer\` ya \`V2Serializer\` lautाता hai.
- **Alag queryset / behaviour**: \`get_queryset()\` alag filter karता hai.
- **Serializer-internal**: ek serializer \`self.context["request"].version\` padhता hai.

Live versions ki sankhya chhoti rakhо (aksar 2) aur ek deprecation policy rakhо.

## \`REST_FRAMEWORK\` settings dict

\`settings.py\` mein ek single dict. Har \`DEFAULT_*\` key ek project-wide default set karता hai jise koi bhi view matching class attribute se override kar sakta hai:

- \`DEFAULT_AUTHENTICATION_CLASSES\` / \`authentication_classes\` — \`request.user\` kaise determine hoता hai (Module 6)
- \`DEFAULT_PERMISSION_CLASSES\` / \`permission_classes\` — kaun call kar sakta hai (Module 6)
- \`DEFAULT_PAGINATION_CLASS\` + \`PAGE_SIZE\` / \`pagination_class\`
- \`DEFAULT_THROTTLE_CLASSES\` + \`DEFAULT_THROTTLE_RATES\` / \`throttle_classes\` (Module 6)
- \`DEFAULT_RENDERER_CLASSES\` / \`DEFAULT_PARSER_CLASSES\`
- \`DEFAULT_VERSIONING_CLASS\` / \`versioning_class\`
- \`EXCEPTION_HANDLER\` (sirf project-wide)

Ise settings modules mein split karो (Module 10): ek shared base, phir dev \`BrowsableAPIRenderer\` add karता hai, prod JSON-only pin karता hai.

## Default exception handler

\`rest_framework.views.exception_handler(exc, context)\` kisi bhi exception ke liye call hoता hai. Ye DRF ki \`APIException\` hierarchy handle karता hai: \`ValidationError\` (400), \`NotAuthenticated\` (401), \`PermissionDenied\` (403), \`NotFound\` / \`Http404\` (404), \`MethodNotAllowed\` (405), \`Throttled\` (429), koi aur \`APIException\` (500).

Ek **non-\`APIException\`** (ek \`KeyError\`) handler se \`None\` lautाता hai → Django ka normal 500 path. Toh: apne code se DRF exceptions raise karो (\`raise NotFound()\`, \`raise PermissionDenied()\`); asli bugs ko 500 hone do.

**Customising**: default ko wrap karके body reshape karो (ek consistent \`{"error": …, "code": …}\` envelope), ek request id add karो, 5xx ko Sentry par log karो. \`EXCEPTION_HANDLER\` ke zariye ek baar set karो.`,

    examples: [
      {
        title: 'Content negotiation: one Response, JSON or browsable HTML by Accept',
        titleHi: 'Content negotiation: ek Response, Accept se JSON ya browsable HTML',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "APP_DIRS": True,
                "DIRS": [], "OPTIONS": {"context_processors": []}}],
    REST_FRAMEWORK={
        "DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": [],
        "DEFAULT_RENDERER_CLASSES": [
            "rest_framework.renderers.JSONRenderer",
            "rest_framework.renderers.BrowsableAPIRenderer",
        ]})
django.setup()

from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.test import APIClient

class Ping(APIView):
    def get(self, request):
        return Response({"pong": True, "version": None})

urlpatterns = [path("ping/", Ping.as_view(), name="ping")]

c = APIClient()
j = c.get("/ping/", HTTP_ACCEPT="application/json")
print("Accept json ->", j["Content-Type"], j.json())

h = c.get("/ping/", HTTP_ACCEPT="text/html")
print("Accept html ->", h["Content-Type"].split(";")[0], "| is HTML page:", b"<html" in h.content.lower())

f = c.get("/ping/?format=json")            # ?format=json picks the JSON renderer directly
print("?format=json ->", f["Content-Type"], f.json())

n = c.get("/ping/", HTTP_ACCEPT="application/xml")
print("Accept xml (no XML renderer) ->", n.status_code, "(406 Not Acceptable)")`,
        output: `Accept json -> application/json {'pong': True, 'version': None}
Accept html -> text/html | is HTML page: True
?format=json -> application/json {'pong': True, 'version': None}
Accept xml (no XML renderer) -> 406 (406 Not Acceptable)
`,
        explain: 'The view returns one `Response({...})` of native Python. Content negotiation then picks a renderer: `Accept: application/json` -> `JSONRenderer` -> a JSON body; `Accept: text/html` -> `BrowsableAPIRenderer` -> a full interactive HTML page. `?format=json` (the query-param override) selects the JSON renderer directly. `Accept: application/xml` matches no configured renderer, so DRF returns `406 Not Acceptable`. In production you pin `DEFAULT_RENDERER_CLASSES` to JSON-only and add `BrowsableAPIRenderer` only in dev settings.',
        explainHi: 'View ek `Response({...})` native Python ka lautाता hai. Content negotiation phir ek renderer chunती hai: `Accept: application/json` -> `JSONRenderer` -> ek JSON body; `Accept: text/html` -> `BrowsableAPIRenderer` -> ek poora interactive HTML page. `?format=json` seedhे JSON renderer select karता hai. `Accept: application/xml` kisi configured renderer se match nahi karта, toh DRF `406 Not Acceptable` lautाता hai. Production mein `DEFAULT_RENDERER_CLASSES` ko JSON-only par pin karो.',
      },
      {
        title: 'URLPathVersioning: request.version drives the serializer',
        titleHi: 'URLPathVersioning: request.version serializer chalाता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    REST_FRAMEWORK={
        "DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": [],
        "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.URLPathVersioning",
        "DEFAULT_VERSION": "v1", "ALLOWED_VERSIONS": ["v1", "v2"]})
django.setup()

from django.db import models, connection
from django.urls import include, path
from rest_framework import serializers, viewsets
from rest_framework.routers import SimpleRouter
from rest_framework.test import APIClient

class Person(models.Model):
    first = models.CharField(max_length=30)
    last = models.CharField(max_length=30)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Person)
Person.objects.create(first="Ada", last="Lovelace")

class PersonV1Serializer(serializers.ModelSerializer):    # old: separate first/last
    class Meta:
        model = Person
        fields = ["id", "first", "last"]

class PersonV2Serializer(serializers.ModelSerializer):    # new: one 'name' field
    name = serializers.SerializerMethodField()
    class Meta:
        model = Person
        fields = ["id", "name"]
    def get_name(self, obj):
        return f"{obj.first} {obj.last}"

class PersonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Person.objects.all()
    def get_serializer_class(self):
        return PersonV2Serializer if self.request.version == "v2" else PersonV1Serializer

router = SimpleRouter()
router.register("people", PersonViewSet, basename="person")
urlpatterns = [path("api/<str:version>/", include(router.urls))]

c = APIClient()
print("v1:", c.get("/api/v1/people/1/").json())
print("v2:", c.get("/api/v2/people/1/").json())
print("no version -> DEFAULT_VERSION v1:", c.get("/api/v1/people/1/").json() == c.get("/api/v1/people/1/").json())
print("bad version -> 404:", c.get("/api/v9/people/1/").status_code)`,
        output: `v1: {'id': 1, 'first': 'Ada', 'last': 'Lovelace'}
v2: {'id': 1, 'name': 'Ada Lovelace'}
no version -> DEFAULT_VERSION v1: True
bad version -> 404: 404
`,
        explain: '`URLPathVersioning` reads the `<version>` URL kwarg and sets `request.version` to that string (validated against `ALLOWED_VERSIONS` — `v9` is a `404`). DRF does nothing else; the view acts on it: `get_serializer_class()` returns `PersonV1Serializer` (separate `first`/`last`) or `PersonV2Serializer` (a single computed `name`) based on `self.request.version`. One codebase, one queryset, one viewset — only the wire shape differs by version. Keep the number of live versions small and publish a deprecation policy, since each one is code you keep testing.',
        explainHi: '`URLPathVersioning` `<version>` URL kwarg padhता hai aur `request.version` ko us string par set karता hai (`ALLOWED_VERSIONS` ke khilaf validated — `v9` ek `404` hai). DRF aur kuch nahi karता; view uspar act karता hai: `get_serializer_class()` `self.request.version` ke aadhार par `PersonV1Serializer` ya `PersonV2Serializer` lautाता hai. Ek codebase, ek queryset, ek viewset — sirf wire shape version se alag hai.',
      },
      {
        title: 'The exception handler: DRF exceptions vs a plain bug',
        titleHi: 'Exception handler: DRF exceptions vs ek plain bug',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=False, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    REST_FRAMEWORK={
        "DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": [],
        "EXCEPTION_HANDLER": __name__ + ".envelope_handler"})
django.setup()

from django.urls import path
from rest_framework.views import APIView, exception_handler
from rest_framework.response import Response
from rest_framework import exceptions
from rest_framework.test import APIClient

def envelope_handler(exc, context):
    response = exception_handler(exc, context)          # DRF default first
    if response is not None:
        response.data = {"error": response.data, "code": response.status_code,
                         "path": context["request"].path}
    return response

class Thing(APIView):
    def get(self, request):
        which = request.query_params.get("raise")
        if which == "notfound":
            raise exceptions.NotFound("no such thing")
        if which == "perm":
            raise exceptions.PermissionDenied()
        if which == "validation":
            raise exceptions.ValidationError({"name": ["required"]})
        if which == "bug":
            return Response({"x": 1 / 0})               # ZeroDivisionError -- a real bug
        return Response({"ok": True})

urlpatterns = [path("thing/", Thing.as_view())]
c = APIClient(raise_request_exception=False)

print("ok:", c.get("/thing/").json())
print("notfound:", c.get("/thing/?raise=notfound").status_code, c.get("/thing/?raise=notfound").json())
print("perm:", c.get("/thing/?raise=perm").status_code, c.get("/thing/?raise=perm").json())
print("validation:", c.get("/thing/?raise=validation").status_code, c.get("/thing/?raise=validation").json())
print("bug -> not enveloped, plain 500:", c.get("/thing/?raise=bug").status_code)`,
        output: `ok: {'ok': True}
notfound: 404 {'error': {'detail': 'no such thing'}, 'code': 404, 'path': '/thing/'}
perm: 403 {'error': {'detail': 'You do not have permission to perform this action.'}, 'code': 403, 'path': '/thing/'}
validation: 400 {'error': {'name': ['required']}, 'code': 400, 'path': '/thing/'}
bug -> not enveloped, plain 500: 500
`,
        explain: 'The custom `EXCEPTION_HANDLER` calls DRF\'s default first, then reshapes the body into a consistent envelope. DRF\'s handler maps its `APIException` hierarchy to responses: `NotFound` -> 404, `PermissionDenied` -> 403, `ValidationError` -> 400, each with a structured body. A plain Python bug (`1/0` -> `ZeroDivisionError`) is NOT an `APIException`, so the default handler returns `None` and the request falls through to Django\'s normal 500 path — un-enveloped. Lesson: `raise` DRF exceptions from your code so they become clean responses; let genuine bugs 500.',
        explainHi: 'Custom `EXCEPTION_HANDLER` pehle DRF ka default call karता hai, phir body ko ek consistent envelope mein reshape karता hai. DRF ka handler apni `APIException` hierarchy ko responses par map karता hai: `NotFound` -> 404, `PermissionDenied` -> 403, `ValidationError` -> 400. Ek plain Python bug (`1/0` -> `ZeroDivisionError`) ek `APIException` NAHI hai, toh default handler `None` lautाता hai aur request Django ke normal 500 path par gir jाती hai — un-enveloped. Sabak: apne code se DRF exceptions `raise` karो.',
      },
    ],

    mistakes: [
      {
        wrong: `# production settings
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",   # left on in prod
    ],
}
# every API endpoint also serves a full HTML page + form; larger attack surface, info leak`,
        right: `# base.py
DEFAULT_RENDERERS = ["rest_framework.renderers.JSONRenderer"]
# dev.py
REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = DEFAULT_RENDERERS + [
    "rest_framework.renderers.BrowsableAPIRenderer"]
# prod.py keeps JSON only`,
        why: 'The browsable API renderer is a development convenience — it renders every endpoint as an interactive HTML page with a form. In production it enlarges the dependency and template surface, exposes the serializer\'s field structure and available actions to anyone with a browser, and serves HTML where clients expect JSON if the `Accept` header is loose. Pin `DEFAULT_RENDERER_CLASSES` to JSON-only in prod; add `BrowsableAPIRenderer` only in dev settings.',
        whyHi: 'Browsable API renderer ek development convenience hai — ye har endpoint ko ek interactive HTML page ki tarah render karता hai ek form ke saath. Production mein ye dependency aur template surface badhाता hai, serializer ki field structure aur available actions ko browser waale kisi bhi vyakti ko expose karता hai. Prod mein `DEFAULT_RENDERER_CLASSES` ko JSON-only par pin karो; `BrowsableAPIRenderer` sirf dev mein.',
      },
      {
        wrong: `def get(self, request, pk):
    try:
        obj = Thing.objects.get(pk=pk)
    except Thing.DoesNotExist:
        return Response({"error": "not found"}, status=404)   # hand-rolled, inconsistent shape
    if obj.owner != request.user:
        return Response({"error": "forbidden"}, status=403)`,
        right: `from rest_framework.exceptions import NotFound, PermissionDenied
def get(self, request, pk):
    obj = get_object_or_404(Thing, pk=pk)          # -> Http404 -> DRF NotFound -> handled
    if obj.owner != request.user:
        raise PermissionDenied()                   # -> handled, consistent body
    ...`,
        why: 'Hand-returning error `Response`s produces a different error shape at every call site and bypasses the exception handler (so a custom envelope, request id, or Sentry hook never runs). Raise DRF exceptions — `NotFound`, `PermissionDenied`, `ValidationError`, `Throttled` — and let `exception_handler` turn them into consistent responses. `get_object_or_404` raises `Http404`, which DRF maps to `NotFound`.',
        whyHi: 'Haath se error `Response`s lautाना har call site par ek alag error shape produce karता hai aur exception handler ko bypass karता hai (toh ek custom envelope, request id, ya Sentry hook kabhi nahi chalता). DRF exceptions raise karो — `NotFound`, `PermissionDenied`, `ValidationError` — aur `exception_handler` ko unhe consistent responses banाने do. `get_object_or_404` `Http404` raise karता hai, jise DRF `NotFound` par map karता hai.',
      },
      {
        wrong: `REST_FRAMEWORK = {
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.URLPathVersioning",
    "DEFAULT_VERSION": "v1",
    # no ALLOWED_VERSIONS
}
# /api/v99/... , /api/typo/... all "work" -> request.version is "v99" and code silently misbehaves`,
        right: `REST_FRAMEWORK = {
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.URLPathVersioning",
    "DEFAULT_VERSION": "v1",
    "ALLOWED_VERSIONS": ["v1", "v2"],   # anything else -> 404
}`,
        why: 'Without `ALLOWED_VERSIONS`, DRF accepts any version string it finds and puts it in `request.version`. A typo or a probe (`/api/v3/`, `/api/latest/`) then flows into your `if request.version == …` branches, usually falling through to some default in a way that is hard to debug. Set `ALLOWED_VERSIONS` so an unknown version is a clean `404` at the door.',
        whyHi: '`ALLOWED_VERSIONS` ke bina, DRF koi bhi version string accept karता hai jо ise milती hai aur ise `request.version` mein daalता hai. Ek typo ya ek probe (`/api/v3/`) phir aapke `if request.version == …` branches mein bahता hai. `ALLOWED_VERSIONS` set karो taaki ek anjaan version darvaze par ek saaf `404` ho.',
      },
    ],

    realWorld: [
      {
        en: '**`JSONRenderer` + `JSONParser` (+ `MultiPartParser` for uploads) is the entire prod renderer/parser config** — no XML, no YAML, no browsable API. The browsable API lives in `settings/dev.py` only. Clients that want CSV hit a dedicated `@action` with an explicit `renderer_classes = [CSVRenderer]`.',
        hi: '**`JSONRenderer` + `JSONParser` (+ uploads ke liye `MultiPartParser`) poora prod renderer/parser config hai** — koi XML, YAML, browsable API nahi. Browsable API sirf `settings/dev.py` mein.',
      },
      {
        en: '**`URLPathVersioning` with exactly two live versions and a sunset date** — `/api/v1/` frozen, `/api/v2/` current, a header (`Deprecation`, `Sunset`) on v1 responses, and analytics on which clients still call v1. `get_serializer_class` and a handful of `if self.request.version` checks carry the difference.',
        hi: '**`URLPathVersioning` bilkul do live versions aur ek sunset date ke saath** — `/api/v1/` frozen, `/api/v2/` current, v1 responses par ek header. `get_serializer_class` aur kuch `if self.request.version` checks antar le jाते hain.',
      },
      {
        en: '**A custom `EXCEPTION_HANDLER` that wraps everything in `{"errors": [...], "request_id": "..."}` and ships 5xx to Sentry** — plus mapping `django.http.Http404` and `django.core.exceptions.ValidationError` (raised deep in model code) to the right DRF status so nothing leaks as a raw 500.',
        hi: '**Ek custom `EXCEPTION_HANDLER` jо sab kuch `{"errors": [...], "request_id": "..."}` mein wrap karता hai aur 5xx ko Sentry par bhejता hai** — plus `django.http.Http404` aur `django.core.exceptions.ValidationError` ko sahi DRF status par map karता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How does DRF decide what format to return, and how do you configure a JSON-only production API?',
        qHi: 'DRF kaise tay karता hai kya format lautाना hai, aur aap ek JSON-only production API kaise configure karते ho?',
        a: 'Your view returns a Response holding native Python. DRF then runs content negotiation: it looks at the request\'s Accept header, or an overriding format query parameter or a dot-suffix on the URL, and matches it against the view\'s renderer classes, which default to DEFAULT_RENDERER_CLASSES in the settings. It picks the first renderer whose media type the client will accept; if none match, it returns 406 Not Acceptable. Then that renderer\'s render method serialises the Python data to bytes and sets the Content-Type. Out of the box DRF enables two renderers: JSONRenderer, and BrowsableAPIRenderer which produces an interactive HTML page so a developer can explore the API in a browser. Parsers are the mirror image on the way in — request dot data is filled by the first parser class whose media type matches the request\'s Content-Type, defaulting to JSON, form, and multipart. For a production API you pin DEFAULT_RENDERER_CLASSES to just the JSON renderer and DEFAULT_PARSER_CLASSES to JSON plus multipart if you accept file uploads. You drop BrowsableAPIRenderer entirely in production because it is a large template and dependency surface, it exposes the serializer field structure and the available actions to anyone with a browser, and it can serve HTML to a client that sent a loose Accept header. The clean pattern is a shared base settings module with JSON-only, and a dev settings module that appends the browsable renderer and maybe relaxes throttle rates, so the two environments differ in exactly one obvious place.',
        aHi: 'Aapka view native Python rakhता ek Response lautाता hai. DRF phir content negotiation chalाता hai: ye request ke Accept header ko dekhता hai, ya ek overriding format query parameter ya URL par ek dot-suffix, aur ise view ke renderer classes ke khilaf match karता hai. Ye pehla renderer chunता hai jiska media type client accept karega; koi match nahi toh 406 Not Acceptable. Phir wo renderer Python data ko bytes mein serialise karता hai. Default se DRF do renderers enable karता hai: JSONRenderer, aur BrowsableAPIRenderer jо ek interactive HTML page produce karता hai. Parsers andar aane par mirror image hain — request dot data pehle parser dwara bharा jाता hai jiska media type request ke Content-Type se match karता hai. Ek production API ke liye aap DEFAULT_RENDERER_CLASSES ko sirf JSON renderer par pin karते ho. Aap BrowsableAPIRenderer ko production mein poori tarah drop karते ho kyunki ye ek badा surface hai aur serializer field structure expose karता hai. Saaf pattern ek shared base settings module hai JSON-only ke saath, aur ek dev settings module jо browsable renderer append karता hai.',
      },
      {
        q: 'What does DRF versioning actually do, and what does it leave to you?',
        qHi: 'DRF versioning asal mein kya karता hai, aur kya aap par chhoड़ता hai?',
        a: 'DRF versioning is deliberately minimal. A versioning class reads a version identifier from a configured location — the URL path with URLPathVersioning, the URL namespace with NamespaceVersioning, the Accept header with AcceptHeaderVersioning, a query parameter, or the hostname — validates it against ALLOWED_VERSIONS, falls back to DEFAULT_VERSION if none was supplied, and sets request dot version to that string. It also makes reverse and hyperlinked serializer fields generate URLs for the current version automatically. That is the whole framework contribution: a validated string on the request. What it does not do is maintain two versions of your code. You decide how each version differs and implement it. The common levers: get_serializer_class returns a V1 or V2 serializer based on self dot request dot version, so the wire shape changes; get_queryset filters differently, so v1 might hide a status that v2 exposes; an at-action raises NotFound on old versions; and inside a serializer, self dot context request version can rename or add a field. Because every additional live version is code you must keep working and testing, the practical advice is to keep the number small, usually the current version and one previous, publish a deprecation and sunset policy, put Deprecation and Sunset headers on the old version\'s responses, and track which clients still use it so you know when it is safe to remove. Setting ALLOWED_VERSIONS matters too — without it any string a client puts in the URL becomes request dot version and silently flows into your branching logic; with it, an unknown version is a clean 404.',
        aHi: 'DRF versioning jaanbujhकर minimal hai. Ek versioning class ek configured location se ek version identifier padhती hai — URLPathVersioning ke saath URL path, NamespaceVersioning ke saath URL namespace, Accept header, ek query parameter, ya hostname — ise ALLOWED_VERSIONS ke khilaf validate karती hai, koi na diya gaya toh DEFAULT_VERSION par fall back karती hai, aur request dot version ko us string par set karती hai. Ye reverse aur hyperlinked serializer fields ko current version ke liye URLs generate karवाती bhi hai. Ye poora framework contribution hai: request par ek validated string. Jо ye NAHI karता wo aapke code ke do versions maintain karna hai. Aap tay karते ho har version kaise alag hai. Aam levers: get_serializer_class self dot request dot version ke aadhार par ek V1 ya V2 serializer lautाता hai; get_queryset alag filter karता hai; ek at-action purane versions par NotFound raise karता hai. Kyunki har additional live version code hai jise aap kaam karता rakhना chahिए, vyavhaarik salah sankhya chhoti rakhna hai. ALLOWED_VERSIONS set karna bhi maayne rakhता hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone DRF with `DEFAULT_RENDERER_CLASSES = [JSONRenderer, BrowsableAPIRenderer]` (add `TEMPLATES` with `APP_DIRS=True`). One `APIView` returning `Response({"ok": True})`. With `APIClient`: assert `HTTP_ACCEPT="application/json"` -> `Content-Type: application/json` and a JSON body; `HTTP_ACCEPT="text/html"` -> `Content-Type` starts `text/html` and body contains `<html`; `?format=json` with `HTTP_ACCEPT="text/html"` -> JSON wins; `HTTP_ACCEPT="application/yaml"` -> `406`.',
        taskHi: 'Standalone DRF `DEFAULT_RENDERER_CLASSES = [JSONRenderer, BrowsableAPIRenderer]` ke saath. Ek `APIView` jо `Response({"ok": True})` lautае. `APIClient` se Accept variations assert karो: json, html, `?format=json` override, yaml -> 406.',
        hint: '`TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "APP_DIRS": True, "DIRS": [], "OPTIONS": {"context_processors": []}}]` is needed for the browsable renderer. `c.get(url, HTTP_ACCEPT="text/html")`. `resp["Content-Type"]`.',
        hintHi: 'Browsable renderer ke liye `TEMPLATES` `APP_DIRS: True` ke saath chahिए. `c.get(url, HTTP_ACCEPT="text/html")`. `resp["Content-Type"]`.',
      },
      {
        task: 'Model `Item` (`sku`, `title`, `cost_cents` int). `URLPathVersioning`, `DEFAULT_VERSION="v1"`, `ALLOWED_VERSIONS=["v1","v2"]`. `ItemV1Serializer` exposes `cost_cents`; `ItemV2Serializer` exposes `cost` as a `SerializerMethodField` returning `cost_cents / 100` (a float). `ItemViewSet(ReadOnlyModelViewSet)` picks by `self.request.version`. URL: `path("api/<str:version>/", include(router.urls))`. Assert: `/api/v1/items/1/` has `cost_cents`; `/api/v2/items/1/` has `cost` (float); `/api/v3/items/1/` -> 404.',
        taskHi: '`Item` (`sku`, `title`, `cost_cents`) model karो. `URLPathVersioning`. `ItemV1Serializer` `cost_cents` expose kare; `ItemV2Serializer` `cost` (float, `cost_cents / 100`). `ItemViewSet` `self.request.version` se chune. Assert karो.',
        hint: '`get_serializer_class(self): return ItemV2Serializer if self.request.version == "v2" else ItemV1Serializer`. `ALLOWED_VERSIONS` makes `v3` a 404. `SimpleRouter` + `path("api/<str:version>/", include(router.urls))`.',
        hintHi: '`get_serializer_class(self): return ItemV2Serializer if self.request.version == "v2" else ItemV1Serializer`. `ALLOWED_VERSIONS` `v3` ko 404 banаता hai.',
      },
      {
        task: 'Set `EXCEPTION_HANDLER` to a custom function that calls DRF\'s default and, if it returned a response, replaces `response.data` with `{"error": <original>, "status": <code>}`. One `APIView` whose `get` raises `NotFound`, `PermissionDenied`, or `ValidationError({"field": ["bad"]})` based on `?raise=`, and returns `1/0` for `?raise=bug`. Use `APIClient(raise_request_exception=False)`. Assert the three DRF exceptions come back enveloped with the right status (404/403/400) and `?raise=bug` is a plain `500` (NOT enveloped).',
        taskHi: '`EXCEPTION_HANDLER` ko ek custom function par set karो jо DRF default call kare aur `response.data` ko `{"error": <original>, "status": <code>}` se replace kare. Ek `APIView` jо `?raise=` ke aadhार par `NotFound`/`PermissionDenied`/`ValidationError` raise kare, `?raise=bug` par `1/0`. Assert karो.',
        hint: '`from rest_framework.views import exception_handler`. `def h(exc, ctx): r = exception_handler(exc, ctx); if r is not None: r.data = {"error": r.data, "status": r.status_code}; return r`. `EXCEPTION_HANDLER: __name__ + ".h"`. `APIClient(raise_request_exception=False)` so the bug does not propagate.',
        hintHi: '`def h(exc, ctx): r = exception_handler(exc, ctx); if r is not None: r.data = {"error": r.data, "status": r.status_code}; return r`. `APIClient(raise_request_exception=False)`.',
      },
    ],

    keyTakeaways: [
      'Your view returns `Response(native_python)`. DRF NEGOTIATES a renderer (from `Accept` / `?format=` / `.json` suffix vs `renderer_classes`), then RENDERS to bytes. No match -> `406`. NEVER return `JsonResponse` from a DRF view.',
      'Built-in renderers: `JSONRenderer` (prod), `BrowsableAPIRenderer` (dev — interactive HTML, leaks structure, big surface). Parsers mirror it for input: `request.data` <- `JSONParser`/`FormParser`/`MultiPartParser` by `Content-Type`.',
      'Production: `DEFAULT_RENDERER_CLASSES = ["...JSONRenderer"]`, `DEFAULT_PARSER_CLASSES` = JSON (+ MultiPart for uploads). Add `BrowsableAPIRenderer` only in dev settings.',
      'DRF versioning ONLY sets `request.version` (a string) from the scheme and validates it against `ALLOWED_VERSIONS` (else `404`); `DEFAULT_VERSION` fills in when absent. YOU implement the differences.',
      'Schemes: `URLPathVersioning` (`/api/v2/...`, most common), `NamespaceVersioning`, `AcceptHeaderVersioning`, `QueryParameterVersioning`, `HostNameVersioning`. Use `request.version` in `get_serializer_class` / `get_queryset` / `@action` / serializer `context`. Keep ~2 live versions + a sunset policy.',
      '`REST_FRAMEWORK = {...}` is the one project-wide config dict. Every `DEFAULT_*` key (auth, permissions, pagination, filters, throttles, renderers, parsers, versioning, `EXCEPTION_HANDLER`, `DATETIME_FORMAT`) is overridable per view by the matching class attribute. Split across settings modules.',
      '`rest_framework.views.exception_handler` maps DRF `APIException`s to responses: `ValidationError`->400, `NotAuthenticated`->401, `PermissionDenied`->403, `NotFound`/`Http404`->404, `MethodNotAllowed`->405, `Throttled`->429. A non-`APIException` -> `None` -> Django\'s plain `500`.',
      'RAISE DRF exceptions (`raise NotFound()`, `PermissionDenied()`, `ValidationError({...})`) instead of hand-returning error `Response`s — so the exception handler (custom envelope, request id, Sentry) runs and the error shape is consistent. `get_object_or_404` -> `Http404` -> handled.',
    ],
    keyTakeawaysHi: [
      'Aapka view `Response(native_python)` lautाता hai. DRF ek renderer NEGOTIATE karता hai (`Accept` / `?format=` / `.json` vs `renderer_classes`), phir bytes mein RENDER. Koi match nahi -> `406`. Ek DRF view se KABHI `JsonResponse` nahi.',
      'Built-in renderers: `JSONRenderer` (prod), `BrowsableAPIRenderer` (dev — interactive HTML, structure leak, badा surface). Parsers input ke liye mirror: `request.data` <- `Content-Type` se.',
      'Production: `DEFAULT_RENDERER_CLASSES = ["...JSONRenderer"]`, `DEFAULT_PARSER_CLASSES` = JSON (+ uploads ke liye MultiPart). `BrowsableAPIRenderer` sirf dev settings mein.',
      'DRF versioning SIRF `request.version` (ek string) set karता hai aur `ALLOWED_VERSIONS` ke khilaf validate karता hai (warna `404`); `DEFAULT_VERSION` absent hone par bharता hai. AAP antar implement karते ho.',
      'Schemes: `URLPathVersioning` (`/api/v2/...`, sabse aam), `NamespaceVersioning`, `AcceptHeaderVersioning`, `QueryParameterVersioning`. `request.version` ko `get_serializer_class` / `get_queryset` / `@action` mein istemal karो. ~2 live versions + ek sunset policy.',
      '`REST_FRAMEWORK = {...}` ek project-wide config dict hai. Har `DEFAULT_*` key per view matching class attribute se overridable hai. Settings modules mein split karो.',
      '`rest_framework.views.exception_handler` DRF `APIException`s ko responses par map karता hai: `ValidationError`->400, `NotAuthenticated`->401, `PermissionDenied`->403, `NotFound`/`Http404`->404, `Throttled`->429. Ek non-`APIException` -> `None` -> Django ka plain `500`.',
      'DRF exceptions RAISE karो (`raise NotFound()`, `PermissionDenied()`, `ValidationError({...})`) haath se error `Response`s lautाने ke bजाy — taaki exception handler (custom envelope, request id, Sentry) chale. `get_object_or_404` -> `Http404` -> handled.',
    ],
  },
];
