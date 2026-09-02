/**
 * Django Complete Course — Module 6: Auth, Permissions & API Security, lessons 4-6.
 *
 * Lesson 4: permissions — permission_classes, the built-ins, has_permission vs
 *           has_object_permission (only on get_object, NOT on list -> get_queryset
 *           scoping still required), custom classes, & | ~ composition, IsOwnerOrReadOnly.
 * Lesson 5: throttling & CORS — Anon/User/ScopedRateThrottle, DEFAULT_THROTTLE_RATES,
 *           the cache requirement, 429 + Retry-After; django-cors-headers,
 *           CORS_ALLOWED_ORIGINS (not "*" with credentials), middleware order,
 *           CORS != CSRF != auth.
 * Lesson 6: the security checklist & OWASP — manage.py check --deploy, the SECURE_*
 *           settings, cookie flags, ALLOWED_HOSTS, DEBUG, SECRET_KEY from env, the
 *           OWASP API Top 10 mapped to Django/DRF mechanisms, secrets & deps.
 *
 * Conventions: see course-django-module6.ts header. Every DRF example with APIClient
 * needs "django.contrib.auth" in INSTALLED_APPS.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_6_PART2: CourseLesson[] = [
  {
    slug: 'dj-drf-permissions',
    title: 'Permissions: `has_permission` vs `has_object_permission`',
    titleHi: 'Permissions: `has_permission` vs `has_object_permission`',
    description: 'Permissions answer "*is this authenticated identity allowed to do this?*" DRF runs every class in `permission_classes`; all must pass. `has_permission(request, view)` gates the whole view; `has_object_permission(request, view, obj)` gates a single object — but it only fires inside `get_object()`, never on a list, so `get_queryset` scoping is still your first line of defence.',
    descriptionHi: 'Permissions "*kya ye authenticated identity ye karने ke liye allowed hai?*" ka jawab deती hain. DRF `permission_classes` mein har class chalाता hai; sab pass hone chahिए. `has_permission(request, view)` poore view ko gate karता hai; `has_object_permission(request, view, obj)` ek single object ko gate karता hai — par ye sirf `get_object()` ke andar fire hoता hai, kabhi ek list par nahi, toh `get_queryset` scoping abhi bhi aapki pehli rakshा-rekhा hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A building with a lobby turnstile and a per-office keypad — and a mail room that only ever hands you your own pigeonhole.** The turnstile (`has_permission`) checks a blanket rule before you go anywhere: "employees only", "staff only after 6pm", "no visitors on this floor". If it says no, you never reach any office. The per-office keypad (`has_object_permission`) is a second, finer check applied only when you try to open *one specific door*: "this is your office" or "you are on this project". Crucially, the keypad is only wired to doors you *walk up to individually* — when you ask the mail room for "my mail", they don\'t run a keypad check on 400 pigeonholes; they are simply built to only ever reach into yours (`get_queryset` filtered to `owner=request.user`). If the mail room were lazily built to hand out any pigeonhole by number and rely on the keypad, then asking for "pigeonhole 214" — which isn\'t yours — would work, because the keypad check for a *list* request never runs. That is the DRF trap: object permissions do not protect `list`.',
      hi: '**Ek building ek lobby turnstile aur ek per-office keypad ke saath — aur ek mail room jо hamesha sirf aapka apna pigeonhole deता hai.** Turnstile (`has_permission`) ek blanket rule check karता hai kahीं jaने se pehle: "sirf employees", "6pm ke baad sirf staff". Agar ye na kehta hai, aap kisi office tak nahi pahुँchते. Per-office keypad (`has_object_permission`) ek doosra, bareek check hai jо sirf tab lागू hoता hai jab aap *ek vishisht darvaza* kholने ki koshish karते ho: "ye aapka office hai". Mahatvapoorn, keypad sirf un darvazों se wired hai jinke paas aap *vyaktigat roop se jaते ho* — jab aap mail room se "meri mail" maangते ho, wo 400 pigeonholes par keypad check nahi chalाते; wo bस aise bane hain ki hamesha sirf aapke tak pahुँchें (`get_queryset` `owner=request.user` par filtered). Agar mail room aalasी se banा hota ki number se koi bhi pigeonhole de aur keypad par nirbhar rahe, toh "pigeonhole 214" maangना — jо aapka nahi — kaam karता, kyunki ek *list* request ke liye keypad check kabhi nahi chalता. Yahi DRF trap hai: object permissions `list` ko protect nahi karती.',
    },

    simple: `**Where it runs**

\`\`\`python
# after authentication, before the handler:
#   for perm in view.get_permissions():
#       if not perm.has_permission(request, view):
#           -> 403 (or 401 if unauthenticated)      # ALL classes must pass
#
# then, ONLY inside self.get_object() (retrieve / update / destroy / a detail @action):
#   for perm in view.get_permissions():
#       if not perm.has_object_permission(request, view, obj):
#           -> 403
\`\`\`

**Built-in permission classes**

\`\`\`
AllowAny                      no check (default is IsAuthenticated if you set DEFAULT_PERMISSION_CLASSES)
IsAuthenticated               request.user.is_authenticated
IsAdminUser                   request.user.is_staff
IsAuthenticatedOrReadOnly     any user for GET/HEAD/OPTIONS ; authenticated for POST/PUT/PATCH/DELETE
DjangoModelPermissions        the model's add/change/delete perms (needs a queryset ; ties to Groups)
DjangoModelPermissionsOrAnonReadOnly   ^ but anonymous GET allowed
DjangoObjectPermissions       per-object model perms (needs a backend like django-guardian)
\`\`\`

**Configure**

\`\`\`python
REST_FRAMEWORK = {"DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"]}

class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]   # both must pass
\`\`\`

**A custom object-level permission**

\`\`\`python
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated       # view-level gate

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:              # GET/HEAD/OPTIONS
            return True
        return obj.owner_id == request.user.id                      # write only if you own it
\`\`\`

**The trap: object permissions do NOT run on \`list\`**

\`\`\`python
# has_object_permission fires only where the view calls self.get_object():
#   retrieve, update, partial_update, destroy, and detail @action methods.
# It NEVER runs for list. So THIS is insufficient on its own:

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()             # <-- every order visible in the list!
    permission_classes = [IsOwnerObjectPermission]

# You STILL need to scope the queryset:
    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)
# now list is scoped AND the object-perm double-checks retrieve/update/destroy
\`\`\`

**Composition with \`&\` \`|\` \`~\`**

\`\`\`python
permission_classes = [IsAdminUser | IsOwner]          # admin OR owner
permission_classes = [IsAuthenticated & ~IsBlocked]   # authenticated AND not blocked
# (parentheses group; each element of the list is still ANDed with the others)
\`\`\`

\`\`\`
has_permission(request, view)          -> bool. Runs on EVERY request, before the handler. View-wide gate.
has_object_permission(request, view, obj) -> bool. Runs ONLY inside get_object() (retrieve/update/destroy/detail action).
                                          NEVER on list, create -> use get_queryset() + perform_create.
permissions.SAFE_METHODS = ("GET", "HEAD", "OPTIONS")
message = "..."   on the class -> the 403 body detail
get_permissions(self)   override for per-action permissions (e.g. list=AllowAny, else IsAuthenticated)
\`\`\``,

    simpleHi: `**Kahaan chalता hai**

\`\`\`python
# authentication ke baad, handler se pehle:
#   for perm in view.get_permissions():
#       if not perm.has_permission(request, view):
#           -> 403 (ya 401 agar unauthenticated)      # SAARI classes pass honi chahिए
#
# phir, SIRF self.get_object() ke andar (retrieve / update / destroy / ek detail @action):
#   for perm in view.get_permissions():
#       if not perm.has_object_permission(request, view, obj):
#           -> 403
\`\`\`

**Built-in permission classes**

\`\`\`
AllowAny                      koi check nahi
IsAuthenticated               request.user.is_authenticated
IsAdminUser                   request.user.is_staff
IsAuthenticatedOrReadOnly     GET/HEAD/OPTIONS ke liye koi bhi ; POST/PUT/PATCH/DELETE ke liye authenticated
DjangoModelPermissions        model ke add/change/delete perms (queryset chahिए ; Groups se tie)
DjangoObjectPermissions       per-object model perms (django-guardian jaisा backend chahिए)
\`\`\`

**Configure**

\`\`\`python
REST_FRAMEWORK = {"DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"]}

class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]   # dono pass hone chahिए
\`\`\`

**Ek custom object-level permission**

\`\`\`python
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated       # view-level gate

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner_id == request.user.id                      # sirf tab write agar aap own karte ho
\`\`\`

**Trap: object permissions \`list\` par NAHI chalती**

\`\`\`python
# has_object_permission sirf wahaan fire hoता hai jahaan view self.get_object() call karта hai:
#   retrieve, update, partial_update, destroy, aur detail @action methods.
# Ye list ke liye KABHI nahi chalता. Toh YE apne aap mein insufficient hai:

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()             # <-- list mein har order dikhता hai!
    permission_classes = [IsOwnerObjectPermission]

# Aapको ABHI BHI queryset scope karna hoगा:
    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)
\`\`\`

**\`&\` \`|\` \`~\` ke saath composition**

\`\`\`python
permission_classes = [IsAdminUser | IsOwner]          # admin YA owner
permission_classes = [IsAuthenticated & ~IsBlocked]   # authenticated AUR blocked nahi
\`\`\`

\`\`\`
has_permission(request, view)          -> bool. HAR request par, handler se pehle. View-wide gate.
has_object_permission(request, view, obj) -> bool. SIRF get_object() ke andar (retrieve/update/destroy/detail action).
                                          list, create par KABHI nahi -> get_queryset() + perform_create istemal karो.
permissions.SAFE_METHODS = ("GET", "HEAD", "OPTIONS")
message = "..."   class par -> 403 body detail
get_permissions(self)   per-action permissions ke liye override
\`\`\``,

    content: `## The two hooks

A permission class can implement either or both:

### \`has_permission(self, request, view)\`

Runs on **every request** to the view, right after authentication, before the handler. This is the view-wide gate: "is this identity allowed to touch this endpoint at all?" — \`IsAuthenticated\`, \`IsAdminUser\`, "the request is a safe method", "the user's org matches the URL's org slug". Return \`False\` → \`403\` (or \`401\` if unauthenticated and \`WWW-Authenticate\` is available).

### \`has_object_permission(self, request, view, obj)\`

Runs **only when the view fetches a single object** — i.e. inside \`GenericAPIView.get_object()\`, which the \`retrieve\`, \`update\`, \`partial_update\`, \`destroy\` actions and any detail \`@action\` call. It receives the actual instance. This is the per-object gate: "you own this row", "you are a member of this project", "this document is not locked". Return \`False\` → \`403\`.

Both hooks must pass for **every** class in \`permission_classes\` — the classes are ANDed.

## The trap: \`list\` and \`create\` skip \`has_object_permission\`

\`has_object_permission\` is called by \`get_object()\`. Neither \`list\` (there is no single object) nor \`create\` (the object does not exist yet) calls \`get_object()\`. So:

- A \`ModelViewSet\` with \`queryset = Order.objects.all()\` and an \`IsOwner\` object permission will **still list every order** — the object check never runs for \`list\`.
- The fix is the same as Module 4 / Module 5: **scope \`get_queryset()\`**. \`Order.objects.filter(customer=self.request.user)\` makes the list correct, makes \`retrieve\` of someone else's order a \`404\` (the pk is not in the queryset), and the object permission then acts as defence-in-depth for \`update\`/\`destroy\`.
- For \`create\`, use \`perform_create(self, serializer)\` to stamp the owner and any tenant/status the client must not set.

**Rule**: \`get_queryset\` scoping is your primary authorization for row visibility; object permissions are a second check on the mutation path; \`perform_create\` owns the write. Never rely on object permissions alone.

## Built-ins in practice

- **\`IsAuthenticatedOrReadOnly\`** — the default for a public-read, authenticated-write API. Anonymous \`GET\` works; anything else needs a user.
- **\`IsAdminUser\`** — \`is_staff\`, not \`is_superuser\`. For internal/admin-only endpoints.
- **\`DjangoModelPermissions\`** — maps to Django's \`add_<model>\` / \`change_<model>\` / \`delete_<model>\` permissions, which you assign via Groups in the admin. Requires the view to have a \`queryset\` (to find the model). Good when you already run a Groups-based permission scheme; \`GET\` is not gated by it (add \`IsAuthenticated\` too).
- **\`DjangoObjectPermissions\`** — per-row model permissions, but Django's default auth backend does not support object-level perms, so you need \`django-guardian\` or similar.

## Custom permissions

\`\`\`python
class IsProjectMember(permissions.BasePermission):
    message = "You are not a member of this project."

    def has_permission(self, request, view):
        # cheap view-level check using a URL kwarg, before hitting the object
        project_id = view.kwargs.get("project_pk")
        return request.user.is_authenticated and \\
               request.user.memberships.filter(project_id=project_id).exists()

    def has_object_permission(self, request, view, obj):
        # obj is a Task; check membership of its project + write requires an editor role
        m = request.user.memberships.filter(project=obj.project).first()
        if not m:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return m.role in ("editor", "admin")
\`\`\`

Put the cheap check in \`has_permission\` (it runs first and can 403 before any object is loaded); put the object-specific check in \`has_object_permission\`.

## Per-action permissions

A \`ViewSet\` often wants different rules per action — anyone can \`list\`, only members can \`retrieve\`, only admins can \`destroy\`:

\`\`\`python
def get_permissions(self):
    if self.action == "list":
        return [AllowAny()]
    if self.action == "destroy":
        return [IsAdminUser()]
    return [IsAuthenticated()]
\`\`\`

(Note: instances, not classes.)

## Composition

DRF 3.9+ supports \`&\`, \`|\`, \`~\` on permission classes:

\`\`\`python
permission_classes = [IsAdminUser | IsOwnerOrReadOnly]
permission_classes = [IsAuthenticated & ~IsSuspended]
\`\`\`

Each element of the list is still ANDed with the others, so \`[A, B | C]\` means \`A and (B or C)\`.

## The \`401\`/\`403\` interaction (recap)

If **no** authenticator succeeded and a permission fails, DRF returns \`401\` (with \`WWW-Authenticate\`). If an authenticator **did** succeed but a permission fails, it is \`403\`. So an anonymous request to an \`IsAuthenticated\` view is \`401\`; a logged-in non-staff user hitting an \`IsAdminUser\` view is \`403\`.`,

    contentHi: `## Do hooks

Ek permission class ya toh implement kar sakti hai:

### \`has_permission(self, request, view)\`

View ki **har request** par chalता hai, authentication ke turant baad, handler se pehle. Ye view-wide gate hai: "kya ye identity is endpoint ko bilkul chhoo sakti hai?" — \`IsAuthenticated\`, \`IsAdminUser\`, "request ek safe method hai". \`False\` return → \`403\` (ya \`401\`).

### \`has_object_permission(self, request, view, obj)\`

**Sirf jab view ek single object fetch karता hai** chalता hai — matlab \`GenericAPIView.get_object()\` ke andar, jise \`retrieve\`, \`update\`, \`partial_update\`, \`destroy\` actions aur koi detail \`@action\` call karता hai. Ise actual instance milता hai. \`False\` return → \`403\`.

Dono hooks \`permission_classes\` mein **har** class ke liye pass hone chahिए — classes ANDed hain.

## Trap: \`list\` aur \`create\` \`has_object_permission\` skip karते hain

\`has_object_permission\` \`get_object()\` dwara call hoता hai. Na \`list\` (koi single object nahi) na \`create\` (object abhi maujूd nahi) \`get_object()\` call karता hai. Toh:

- \`queryset = Order.objects.all()\` aur ek \`IsOwner\` object permission waala ek \`ModelViewSet\` **abhi bhi har order list karega**.
- Fix wahi hai: **\`get_queryset()\` scope karो**. \`Order.objects.filter(customer=self.request.user)\` list ko sahi banаता hai, kisi aur ke order ka \`retrieve\` ek \`404\` banаता hai, aur object permission phir \`update\`/\`destroy\` ke liye defence-in-depth ki tarah kaam karता hai.
- \`create\` ke liye, \`perform_create(self, serializer)\` istemal karके owner stamp karो.

**Niyam**: \`get_queryset\` scoping row visibility ke liye aapka primary authorization hai; object permissions mutation path par ek doosra check hain; \`perform_create\` write own karता hai.

## Built-ins vyavhaar mein

- **\`IsAuthenticatedOrReadOnly\`** — ek public-read, authenticated-write API ke liye default.
- **\`IsAdminUser\`** — \`is_staff\`, \`is_superuser\` nahi.
- **\`DjangoModelPermissions\`** — Django ke \`add_<model>\` / \`change_<model>\` / \`delete_<model>\` permissions par map, jinhe aap admin mein Groups se assign karते ho. View ke paas ek \`queryset\` chahिए. \`GET\` iske dwara gated nahi.
- **\`DjangoObjectPermissions\`** — per-row model permissions, par \`django-guardian\` chahिए.

## Custom permissions

Sasta check \`has_permission\` mein rakhо (ye pehle chalता hai aur kisi object load hone se pehle 403 kar sakta hai); object-specific check \`has_object_permission\` mein.

## Per-action permissions

\`\`\`python
def get_permissions(self):
    if self.action == "list":
        return [AllowAny()]
    if self.action == "destroy":
        return [IsAdminUser()]
    return [IsAuthenticated()]
\`\`\`

(Instances, classes nahi.)

## Composition

DRF 3.9+ permission classes par \`&\`, \`|\`, \`~\` support karता hai. List ka har element abhi bhi doosron ke saath ANDed hai.

## \`401\`/\`403\` interaction

Agar **koi** authenticator safal nahi hua aur ek permission fail hoती hai, DRF \`401\` lautाता hai. Agar ek authenticator **safal** hua par ek permission fail hoती hai, ye \`403\` hai.`,

    examples: [
      {
        title: 'has_permission gates the view; has_object_permission gates one object',
        titleHi: 'has_permission view ko gate karता hai; has_object_permission ek object ko',
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
from rest_framework import serializers, viewsets, permissions
from rest_framework.routers import SimpleRouter
from rest_framework.test import APIClient

class Note(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Note)
ada = User.objects.create_user("ada"); bo = User.objects.create_user("bo")
n_ada = Note.objects.create(owner=ada, body="Ada's")
n_bo = Note.objects.create(owner=bo, body="Bo's")

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated                        # view-wide gate
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner_id == request.user.id                      # per-object write gate

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "body"]

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by("id")
    serializer_class = NoteSerializer
    permission_classes = [IsOwnerOrReadOnly]
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

router = SimpleRouter(); router.register("notes", NoteViewSet, basename="note")
urlpatterns = router.urls

anon, c_ada = APIClient(), APIClient()
c_ada.force_authenticate(ada)

print("anon list -> 403 (has_permission):", anon.get("/notes/").status_code)
print("ada list -> 200:", [x["body"] for x in c_ada.get("/notes/").json()])
print("ada GET bo's note -> 200 (SAFE_METHODS):", c_ada.get(f"/notes/{n_bo.id}/").status_code)
print("ada PATCH bo's note -> 403 (has_object_permission):",
      c_ada.patch(f"/notes/{n_bo.id}/", {"body": "hacked"}, format="json").status_code)
print("ada PATCH own note -> 200:",
      c_ada.patch(f"/notes/{n_ada.id}/", {"body": "edited"}, format="json").status_code)`,
        output: `anon list -> 403 (has_permission): 403
ada list -> 200: ["Ada's", "Bo's"]
ada GET bo's note -> 200 (SAFE_METHODS): 200
ada PATCH bo's note -> 403 (has_object_permission): 403
ada PATCH own note -> 200: 200
`,
        explain: "has_permission runs on every request -- an anonymous list fails it -> 403. has_object_permission runs only when the view fetches one object (retrieve, update, destroy): ada can GET Bo's note because SAFE_METHODS return True, but a PATCH of Bo's note fails obj.owner_id == request.user.id -> 403. perform_create stamps owner. (Note the list here shows both notes -- object permissions do not filter a list; that is the next example.)",
        explainHi: 'has_permission har request par chalta hai -- ek anonymous list ise fail karta hai -> 403. has_object_permission sirf jab view ek object fetch karta hai: ada Bo ka note GET kar sakti hai kyunki SAFE_METHODS True return karta hai, par Bo ke note ka PATCH obj.owner_id == request.user.id fail karta hai -> 403. perform_create owner stamp karta hai.',
      },
      {
        title: 'The trap: object permission does NOT protect list -> scope get_queryset',
        titleHi: 'Trap: object permission list ko protect NAHI karता -> get_queryset scope karो',
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
from rest_framework import serializers, viewsets, permissions
from rest_framework.routers import SimpleRouter
from rest_framework.test import APIClient

class Invoice(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Invoice)
ada = User.objects.create_user("ada"); bo = User.objects.create_user("bo")
Invoice.objects.create(customer=ada, amount=100)
Invoice.objects.create(customer=bo, amount=999)     # Bo's private invoice

class IsCustomer(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.customer_id == request.user.id

class InvSer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ["id", "amount"]

class BadViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Invoice.objects.all().order_by("id")       # NOT scoped
    serializer_class = InvSer
    permission_classes = [IsCustomer]

class GoodViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InvSer
    permission_classes = [IsCustomer]
    def get_queryset(self):
        return Invoice.objects.filter(customer=self.request.user).order_by("id")

router = SimpleRouter()
router.register("bad", BadViewSet, basename="bad")
router.register("good", GoodViewSet, basename="good")
urlpatterns = router.urls

c = APIClient(); c.force_authenticate(ada)
print("BAD  list  -> leaks Bo's invoice:", c.get("/bad/").json())
print("BAD  detail-> object perm DOES block:", c.get("/bad/2/").status_code)
print("GOOD list  -> scoped:", c.get("/good/").json())
print("GOOD detail-> Bo's invoice is a 404 (not in queryset):", c.get("/good/2/").status_code)`,
        output: `BAD  list  -> leaks Bo's invoice: [{'id': 1, 'amount': 100}, {'id': 2, 'amount': 999}]
BAD  detail-> object perm DOES block: 403
GOOD list  -> scoped: [{'id': 1, 'amount': 100}]
GOOD detail-> Bo's invoice is a 404 (not in queryset): 404
`,
        explain: "This is the trap. BadViewSet has queryset = Invoice.objects.all() and an IsCustomer object permission -- but has_object_permission is NEVER called for list, so GET /bad/ returns every customer's invoice. The object permission does fire on GET /bad/2/ (detail) and blocks it with 403 -- but the list already leaked the data. GoodViewSet scopes get_queryset() to customer=self.request.user: the list is correct, and Bo's invoice is a 404 (not in the queryset) rather than a 403 (which would confirm it exists).",
        explainHi: 'Ye trap hai. BadViewSet ke paas queryset = Invoice.objects.all() aur ek IsCustomer object permission hai -- par has_object_permission list ke liye KABHI call nahi hota, toh GET /bad/ har customer ka invoice lautata hai. Object permission GET /bad/2/ par fire hota hai aur ise 403 se block karta hai -- par list pehle hi data leak kar chuka. GoodViewSet get_queryset() ko scope karta hai.',
      },
      {
        title: 'Composition (| and &) and per-action get_permissions()',
        titleHi: 'Composition (| aur &) aur per-action get_permissions()',
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
from rest_framework import serializers, viewsets, permissions
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.routers import SimpleRouter
from rest_framework.test import APIClient

class Doc(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Doc)
ada = User.objects.create_user("ada")
boss = User.objects.create_user("boss", is_staff=True)
Doc.objects.create(owner=ada, title="d1")

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner_id == request.user.id

class DocSer(serializers.ModelSerializer):
    class Meta:
        model = Doc
        fields = ["id", "title"]

class DocViewSet(viewsets.ModelViewSet):
    queryset = Doc.objects.all().order_by("id")
    serializer_class = DocSer
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    def get_permissions(self):
        if self.action == "list":
            return [AllowAny()]
        if self.action in ("update", "partial_update", "destroy"):
            return [(IsAdminUser | IsOwner)()]        # admin OR owner
        return [IsAuthenticated()]

router = SimpleRouter(); router.register("docs", DocViewSet, basename="doc")
urlpatterns = router.urls

anon, c_ada, c_boss = APIClient(), APIClient(), APIClient()
c_ada.force_authenticate(ada); c_boss.force_authenticate(boss)

print("anon list (AllowAny):", anon.get("/docs/").status_code)
print("anon retrieve (IsAuthenticated) -> 403:", anon.get("/docs/1/").status_code)
print("ada delete own doc (IsOwner):", c_ada.delete("/docs/1/").status_code)
Doc.objects.create(owner=ada, title="d2")
print("boss delete ada's doc (IsAdminUser | IsOwner):", c_boss.delete("/docs/2/").status_code)`,
        output: `anon list (AllowAny): 200
anon retrieve (IsAuthenticated) -> 403: 403
ada delete own doc (IsOwner): 204
boss delete ada's doc (IsAdminUser | IsOwner): 204
`,
        explain: "get_permissions() returns different instances per action: AllowAny for list (anyone), IsAuthenticated for retrieve, and (IsAdminUser | IsOwner) for the mutating actions -- the | means admin OR owner. So ada can delete her own doc via the IsOwner half, and boss (is_staff=True) can delete anyone's doc via the IsAdminUser half. Note the () -- get_permissions must return instances, not classes.",
        explainHi: 'get_permissions() prati action alag instances lautata hai: list ke liye AllowAny, retrieve ke liye IsAuthenticated, aur mutating actions ke liye (IsAdminUser | IsOwner) -- | ka matlab admin YA owner. Toh ada apna doc IsOwner half se delete kar sakti hai, aur boss kisi ka bhi doc IsAdminUser half se. () note karo -- get_permissions ko instances lautane chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()          # every order
    serializer_class = OrderSerializer
    permission_classes = [IsOrderOwner]     # only has_object_permission
# GET /orders/ returns EVERY user's orders -- object perms never run on list`,
        right: `class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsOrderOwner]     # defence-in-depth for update/destroy
    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)   # THIS is what protects list`,
        why: '`has_object_permission` is only invoked by `get_object()`, which `list` and `create` never call. An object-only permission leaves the list endpoint wide open. Row-level visibility must be enforced by `get_queryset()` scoping; the object permission is then a redundant second check on the mutation actions. Every per-user resource viewset needs a scoped `get_queryset`.',
        whyHi: '`has_object_permission` sirf `get_object()` dwara invoke hoता hai, jise `list` aur `create` kabhi call nahi karते. Ek object-only permission list endpoint ko poori tarah khula chhoड़ती hai. Row-level visibility `get_queryset()` scoping se enforce honi chahिए; object permission phir mutation actions par ek redundant doosra check hai.',
      },
      {
        wrong: `class IsProjectAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.projectmembership_set.get(project=obj.project).role == "admin"
    # 1. only object-level -> list is unprotected
    # 2. .get() raises DoesNotExist (500) instead of returning False for a non-member`,
        right: `class IsProjectAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated       # cheap gate first

    def has_object_permission(self, request, view, obj):
        m = request.user.projectmembership_set.filter(project=obj.project, role="admin")
        return m.exists()                            # False, not an exception, for non-members`,
        why: 'Two bugs. First, a permission with only `has_object_permission` does not protect list/create (previous mistake). Second, `.get()` in a permission raises `DoesNotExist` — an unhandled `500` — when the user is not a member; permission methods must **return a boolean**, so use `.filter(...).exists()` or a `try/except` returning `False`. Also add a cheap `has_permission` check so obvious denials happen before the DB is touched.',
        whyHi: 'Do bugs. Pehla, sirf `has_object_permission` waali ek permission list/create ko protect nahi karती. Doosra, ek permission mein `.get()` `DoesNotExist` raise karता hai — ek unhandled `500` — jab user member nahi; permission methods ko ek **boolean return** karna chahिए, toh `.filter(...).exists()` istemal karो. Ek sasta `has_permission` check bhi add karो.',
      },
      {
        wrong: `def get_permissions(self):
    if self.action == "list":
        return [AllowAny]              # returning the CLASS, not an instance
    return [IsAuthenticated]
# TypeError deep in DRF: 'AllowAny' object is not callable / has no has_permission`,
        right: `def get_permissions(self):
    if self.action == "list":
        return [AllowAny()]           # instances
    return [IsAuthenticated()]`,
        why: 'The `permission_classes` *attribute* holds classes (DRF instantiates them in `get_permissions`), but when you **override** `get_permissions()` you must return **instances** — DRF calls `.has_permission()` on whatever you return without instantiating it. Same for `get_authenticators`. Forgetting the `()` gives a confusing error far from the cause.',
        whyHi: '`permission_classes` *attribute* classes rakhता hai (DRF unhe `get_permissions` mein instantiate karता hai), par jab aap `get_permissions()` **override** karते ho aapको **instances** return karna chahिए — DRF jо aap return karो uspar `.has_permission()` call karता hai bina instantiate kiye. `()` bhoolना ek confusing error deता hai.',
      },
    ],

    realWorld: [
      {
        en: '**`get_queryset` scoping + `IsOwnerOrReadOnly` + `perform_create` is the canonical per-user CRUD triad** — `get_queryset().filter(owner=request.user)` for visibility, the object permission double-checks writes, `serializer.save(owner=request.user)` on create. A code review of a new viewset checks all three are present.',
        hi: '**`get_queryset` scoping + `IsOwnerOrReadOnly` + `perform_create` canonical per-user CRUD triad hai** — visibility ke liye `get_queryset().filter(owner=request.user)`, object permission writes double-check karता hai, create par `serializer.save(owner=request.user)`.',
      },
      {
        en: '**`get_permissions()` by `self.action` for a tiered resource** — `list`/`retrieve` = `IsAuthenticated`, `create`/`update` = `IsAuthenticated & IsInOrg`, `destroy` = `IsOrgAdmin`, a `publish` `@action` = `IsOrgAdmin | IsSuperuser`. One viewset, action-specific rules.',
        hi: '**Ek tiered resource ke liye `self.action` se `get_permissions()`** — `list`/`retrieve` = `IsAuthenticated`, `create`/`update` = `IsAuthenticated & IsInOrg`, `destroy` = `IsOrgAdmin`.',
      },
      {
        en: '**`DjangoModelPermissions` + Groups for an internal admin API** — "Editors" group has `change_article`, "Publishers" also has a custom `publish_article` perm, assigned in the Django admin. The API classes are just `[IsAuthenticated, DjangoModelPermissions]`; access is managed entirely through group membership.',
        hi: '**Ek internal admin API ke liye `DjangoModelPermissions` + Groups** — "Editors" group ke paas `change_article`, "Publishers" ke paas ek custom `publish_article` perm bhi. API classes bस `[IsAuthenticated, DjangoModelPermissions]` hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `has_permission` and `has_object_permission`, and why is an object permission not enough to secure a list endpoint?',
        qHi: '`has_permission` aur `has_object_permission` mein kya antar hai, aur ek object permission ek list endpoint secure karने ke liye kyun kaafi nahi?',
        a: 'has_permission runs on every request to the view, immediately after authentication and before the handler. It is the view-wide gate and answers "may this identity use this endpoint at all" — is the user authenticated, are they staff, is this a safe method. It gets the request and the view but no object. has_object_permission runs only when the view fetches a single instance, which in practice means inside the generic get_object method that the retrieve, update, partial_update, and destroy actions call, plus any detail-level action. It receives the actual object and answers "may this identity act on this specific row" — do they own it, are they a member of its project, is it unlocked. Both hooks are checked for every class in permission_classes, and all must return True. The reason an object permission alone does not secure a list is that list never calls get_object — there is no single object to check — and neither does create, because the object does not exist yet. So a ModelViewSet whose queryset is Model.objects.all with only an owner object-permission will happily serialize every row in the list response; the object check simply is not consulted. The correct design is layered: get_queryset scoped to the current user or tenant is the primary control for which rows are visible and reachable, so list returns only your rows and retrieve of someone else\'s id is a 404 because it is not in the queryset. The object permission is then a defence-in-depth second check on the mutation path, and perform_create stamps the owner on create. Relying on object permissions alone is one of the most common DRF authorization bugs.',
        aHi: 'has_permission view ki har request par chalता hai, authentication ke turant baad aur handler se pehle. Ye view-wide gate hai aur jawab deता hai "kya ye identity is endpoint ko bilkul istemal kar sakti hai" — kya user authenticated hai, kya wo staff hai. Ise request aur view milते hain par koi object nahi. has_object_permission sirf tab chalता hai jab view ek single instance fetch karता hai, jiska vyavhaar mein matlab generic get_object method ke andar jise retrieve, update, partial_update, aur destroy actions call karते hain. Ise actual object milता hai aur jawab deता hai "kya ye identity is vishisht row par act kar sakti hai". Dono hooks permission_classes mein har class ke liye check hote hain. Ek object permission akelे ek list secure nahi karती iska karan ye hai ki list kabhi get_object call nahi karता — check karने ke liye koi single object nahi — aur na hi create. Toh ek ModelViewSet jiska queryset Model.objects.all hai sirf ek owner object-permission ke saath khushi se list response mein har row serialize karega. Sahi design layered hai: get_queryset current user par scoped primary control hai, object permission phir mutation path par ek defence-in-depth doosra check hai.',
      },
      {
        q: 'How does DRF decide between returning 401 and 403 when a permission check fails?',
        qHi: 'DRF kaise tay karता hai 401 aur 403 ke beech jab ek permission check fail hoती hai?',
        a: 'When a permission returns False, DRF looks at whether authentication succeeded on this request. If no authenticator produced a user — the request is anonymous — and the first authenticator can supply a WWW-Authenticate challenge value via its authenticate_header method, DRF returns 401 Unauthorized with that header, meaning "you need to authenticate, here is how". If authentication did succeed — there is a real user on the request — but a permission still failed, DRF returns 403 Forbidden, meaning "we know who you are and you are not allowed to do this". So the same IsAuthenticated permission produces a 401 for an anonymous caller, because the fix is to authenticate; whereas IsAdminUser produces a 403 for a logged-in non-staff user, because they are authenticated and authenticating harder will not help. There is an edge case: if the request is anonymous but no authenticator provides an authenticate_header — for example a custom authenticator that forgot to implement it — DRF cannot form a proper 401 challenge and falls back to 403 even for the anonymous request, which is misleading to clients. That is why implementing authenticate_header on every custom authenticator matters. Practically, if you are debugging and see a 403 where you expected a 401, it usually means an authenticator succeeded unexpectedly, such as SessionAuthentication matching a stale cookie in the browser.',
        aHi: 'Jab ek permission False return karती hai, DRF dekhता hai ki is request par authentication safal hua ya nahi. Agar kisi authenticator ne ek user produce nahi kiya — request anonymous hai — aur pehla authenticator apni authenticate_header method ke zariye ek WWW-Authenticate challenge value de sakta hai, DRF us header ke saath 401 Unauthorized lautाता hai, jiska matlab "aapको authenticate karna hoगा, ye rahा kaise". Agar authentication safal hua — request par ek asli user hai — par ek permission phir bhi fail hui, DRF 403 Forbidden lautाता hai, jiska matlab "hum jaanते hain aap kaun hain aur aapको ye karने ki anumati nahi". Toh wahi IsAuthenticated permission ek anonymous caller ke liye ek 401 produce karती hai; jabki IsAdminUser ek logged-in non-staff user ke liye ek 403 produce karती hai. Ek edge case hai: agar request anonymous hai par koi authenticator authenticate_header nahi deता, DRF ek uचित 401 challenge nahi banа sakta aur 403 par fall back karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone DRF. Model `Memo` (`owner` FK User, `text`). `IsOwnerOrReadOnly(BasePermission)` with `has_permission` = `request.user.is_authenticated` and `has_object_permission` = `True` for `SAFE_METHODS` else `obj.owner_id == request.user.id`. `MemoViewSet(ModelViewSet)` with `queryset = Memo.objects.all()`, `permission_classes = [IsOwnerOrReadOnly]`, `perform_create` stamping owner. Two users, one memo each. Assert: anon `list` -> `403`; ada `list` -> `200` (sees both); ada `GET` bo\'s memo -> `200`; ada `PATCH` bo\'s memo -> `403`; ada `PATCH` own -> `200`.',
        taskHi: 'Standalone DRF. `Memo` (`owner` FK, `text`) model karो. `IsOwnerOrReadOnly` likhо. `MemoViewSet` `permission_classes = [IsOwnerOrReadOnly]`, `perform_create` owner stamp. Do users, ek-ek memo. Assert karो.',
        hint: '`from rest_framework import permissions`. `permissions.SAFE_METHODS`. `c.force_authenticate(user)` (no auth backend needed). `c.patch(url, {...}, format="json")`. anon fails `has_permission` -> `403`.',
        hintHi: '`from rest_framework import permissions`. `permissions.SAFE_METHODS`. `c.force_authenticate(user)`. `c.patch(url, {...}, format="json")`.',
      },
      {
        task: 'Demonstrate the list-leak. Model `Salary` (`employee` FK User, `amount` int). Two viewsets over it: `LeakyViewSet(ReadOnlyModelViewSet)` with `queryset = Salary.objects.all()` + an `IsEmployee` object permission; `SafeViewSet(ReadOnlyModelViewSet)` with the same permission but `get_queryset` filtered to `employee=self.request.user`. Seed a salary for ada and one for bo. As ada: assert `GET /leaky/` returns BOTH salaries (the leak); `GET /leaky/<bo_id>/` -> `403` (object perm works on detail); `GET /safe/` returns only ada\'s; `GET /safe/<bo_id>/` -> `404`.',
        taskHi: 'List-leak dikhाओ. `Salary` (`employee` FK, `amount`) model karो. `LeakyViewSet` (`queryset = Salary.objects.all()` + `IsEmployee`) aur `SafeViewSet` (same perm par scoped `get_queryset`). ada ke roop mein assert karो.',
        hint: 'The leak: `has_object_permission` never runs for `list`. `LeakyViewSet` list returns every row; `LeakyViewSet` detail of bo\'s row is `403`. `SafeViewSet` detail of bo\'s row is `404` because it is not in the scoped queryset.',
        hintHi: 'Leak: `has_object_permission` `list` ke liye kabhi nahi chalता. `LeakyViewSet` list har row lautाता hai; detail `403`. `SafeViewSet` detail `404`.',
      },
      {
        task: 'Model `Ticket` (`owner` FK User, `subject`). `TicketViewSet(ModelViewSet)` with `perform_create` stamping owner and a `get_permissions()` that returns: `[AllowAny()]` for `list`, `[(IsAdminUser | IsOwner)()]` for `destroy`, `[IsAuthenticated()]` otherwise (`IsOwner` checks `obj.owner_id == request.user.id` at object level). Create `ada` (normal), `boss` (`is_staff=True`), and a ticket owned by ada. Assert: anon `list` -> `200`; anon `retrieve` -> `403`; ada `DELETE` own ticket -> `204`; recreate, then `boss` `DELETE` ada\'s ticket -> `204`.',
        taskHi: '`Ticket` (`owner` FK, `subject`) model karो. `TicketViewSet` `perform_create` owner stamp aur ek `get_permissions()` (`list`=`AllowAny`, `destroy`=`IsAdminUser | IsOwner`, warna `IsAuthenticated`). `ada`, `boss` (`is_staff`), ek ticket. Assert karो.',
        hint: '`get_permissions` returns INSTANCES: `[AllowAny()]`, `[(IsAdminUser | IsOwner)()]`. `from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser`. `IsOwner` needs only `has_object_permission`. `boss` passes via the `IsAdminUser` half of the OR.',
        hintHi: '`get_permissions` INSTANCES return karता hai: `[AllowAny()]`, `[(IsAdminUser | IsOwner)()]`. `boss` OR ke `IsAdminUser` half se pass hoता hai.',
      },
    ],

    keyTakeaways: [
      'Permissions answer "is this identity ALLOWED?" (authentication already answered "who?"). Every class in `permission_classes` is ANDed — all must pass. Fail + no auth succeeded -> `401`; fail + authenticated -> `403`.',
      '`has_permission(request, view)` runs on EVERY request before the handler — the view-wide gate (`IsAuthenticated`, `IsAdminUser`, safe-method check, URL-kwarg check).',
      '`has_object_permission(request, view, obj)` runs ONLY inside `get_object()` — i.e. `retrieve`/`update`/`partial_update`/`destroy` and detail `@action`s. NEVER on `list` or `create`.',
      'THE TRAP: an object-only permission does NOT protect `list` — a `queryset = Model.objects.all()` viewset with `IsOwner` still lists every row. Row visibility MUST come from `get_queryset()` scoping; the object permission is defence-in-depth on the mutation path; `perform_create` stamps the owner. All three together.',
      'Permission methods MUST return a bool — use `.filter(...).exists()`, never `.get()` (which raises `DoesNotExist` -> `500`). Put the cheap check in `has_permission`, the object-specific check in `has_object_permission`.',
      'Built-ins: `AllowAny`, `IsAuthenticated`, `IsAdminUser` (= `is_staff`), `IsAuthenticatedOrReadOnly` (anon GET, auth write), `DjangoModelPermissions` (Django add/change/delete perms via Groups; needs a `queryset`; does not gate GET), `DjangoObjectPermissions` (needs `django-guardian`).',
      '`get_permissions(self)` override for per-action rules — MUST return INSTANCES (`[AllowAny()]`), not classes. Compose with `&` `|` `~`: `[IsAdminUser | IsOwner]`, `[IsAuthenticated & ~IsSuspended]` (list elements still ANDed).',
      '`permissions.SAFE_METHODS = ("GET", "HEAD", "OPTIONS")`. `message = "..."` on the class sets the 403 body detail. The `IsOwnerOrReadOnly` pattern: `has_object_permission` returns `True` for safe methods, `obj.owner_id == request.user.id` otherwise.',
    ],
    keyTakeawaysHi: [
      'Permissions "kya ye identity ALLOWED hai?" ka jawab deती hain. `permission_classes` mein har class ANDed hai — sab pass hone chahिए. Fail + koi auth safal nahi -> `401`; fail + authenticated -> `403`.',
      '`has_permission(request, view)` HAR request par handler se pehle chalता hai — view-wide gate.',
      '`has_object_permission(request, view, obj)` SIRF `get_object()` ke andar chalता hai — matlab `retrieve`/`update`/`partial_update`/`destroy` aur detail `@action`s. `list` ya `create` par KABHI nahi.',
      'TRAP: ek object-only permission `list` ko protect NAHI karती — `IsOwner` ke saath ek `queryset = Model.objects.all()` viewset abhi bhi har row list karता hai. Row visibility `get_queryset()` scoping se AANI chahिए; object permission mutation path par defence-in-depth; `perform_create` owner stamp. Teenों saath.',
      'Permission methods ko ek bool RETURN karna chahिए — `.filter(...).exists()` istemal karो, kabhi `.get()` nahi (jо `DoesNotExist` -> `500` raise karता hai).',
      'Built-ins: `AllowAny`, `IsAuthenticated`, `IsAdminUser` (= `is_staff`), `IsAuthenticatedOrReadOnly`, `DjangoModelPermissions` (Groups ke zariye; `queryset` chahिए; GET gate nahi karता), `DjangoObjectPermissions` (`django-guardian` chahिए).',
      '`get_permissions(self)` override per-action rules ke liye — INSTANCES return karna CHAHIYE (`[AllowAny()]`), classes nahi. `&` `|` `~` se compose karो: `[IsAdminUser | IsOwner]`.',
      '`permissions.SAFE_METHODS = ("GET", "HEAD", "OPTIONS")`. Class par `message = "..."` 403 body detail set karता hai. `IsOwnerOrReadOnly` pattern: safe methods ke liye `True`, warna `obj.owner_id == request.user.id`.',
    ],
  },

  {
    slug: 'dj-drf-throttling-and-cors',
    title: 'Throttling & CORS',
    titleHi: 'Throttling & CORS',
    description: 'Throttling limits how many requests an identity may make in a window — `AnonRateThrottle` / `UserRateThrottle` for blanket rates, `ScopedRateThrottle` for per-endpoint limits like `login: 5/min`. It needs a shared cache. CORS is a browser mechanism: `django-cors-headers` adds the response headers that let a different-origin front-end call your API. CORS is not CSRF and not authentication.',
    descriptionHi: 'Throttling limit karता hai ek identity ek window mein kितni requests kar sakti hai — blanket rates ke liye `AnonRateThrottle` / `UserRateThrottle`, per-endpoint limits jaise `login: 5/min` ke liye `ScopedRateThrottle`. Ise ek shared cache chahिए. CORS ek browser mechanism hai: `django-cors-headers` wo response headers add karता hai jо ek alag-origin front-end ko aapki API call karने deते hain. CORS CSRF nahi hai aur authentication nahi hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 5,

    analogy: {
      en: '**A ticket counter with a "one every N seconds" turnstile, and a doorman who tells your browser which neighbourhoods are allowed to send people here.** Throttling is the turnstile: it does not care *who* you are beyond your identity tag (your user id if logged in, your IP if not) — it just counts your visits in a rolling window and, past the limit, holds up a "come back in 42 seconds" sign (a `429` with a `Retry-After` header). Different counters can have different rates: the general enquiries window lets you through often, but the "reset my password" window only serves you five times an hour, because that is where abuse concentrates. The turnstile keeps its tally in a shared ledger the whole building can see (a cache like Redis) — if each counter kept its own notepad (per-process memory), you could dodge the limit by getting routed to a different counter. CORS is the doorman: when a browser on `shop.example.com` wants to send a request to `api.example.com`, the doorman at the API checks a list and, if `shop.example.com` is on it, stamps the reply "yes, this neighbourhood may talk to me" (`Access-Control-Allow-Origin`). The doorman is *advisory to the browser only* — a `curl` or a mobile app ignores him entirely; he is not a security guard, he is a compatibility note.',
      hi: '**Ek ticket counter ek "har N seconds mein ek" turnstile ke saath, aur ek doorman jо aapke browser ko batाता hai kaunse neighbourhoods yahaan log bhej sakte hain.** Throttling turnstile hai: use parwाh nahi *aap kaun* ho aapke identity tag se aage (logged in ho toh aapka user id, warna aapka IP) — ye bस ek rolling window mein aapki visits ginता hai aur, limit ke baad, ek "42 seconds mein wapas aaओ" sign uthाता hai (ek `429` ek `Retry-After` header ke saath). Alag counters ke alag rates ho sakte hain: general enquiries window aapको aksar through deता hai, par "mera password reset karो" window aapको ghante mein sirf paanch baar serve karता hai, kyunki abuse wahीं centre hoता hai. Turnstile apni tally ek shared ledger mein rakhता hai jise poori building dekh sakti hai (Redis jaisा ek cache) — agar har counter apna notepad rakhता (per-process memory), aap ek alag counter par route hokar limit dodge kar sakte the. CORS doorman hai: jab `shop.example.com` par ek browser `api.example.com` ko ek request bhejना chahता hai, API ka doorman ek list check karता hai aur, agar `shop.example.com` uspar hai, reply par "haan, ye neighbourhood mujhse baat kar sakta hai" stamp karता hai (`Access-Control-Allow-Origin`). Doorman *sirf browser ke liye salahकार hai* — ek `curl` ya ek mobile app use poori tarah ignore karता hai; wo ek security guard nahi, ek compatibility note hai.',
    },

    simple: `**Throttling — configure**

\`\`\`python
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "20/min",      # unauthenticated -> keyed by IP
        "user": "1000/day",    # authenticated  -> keyed by user id
        "login": "5/min",      # a named scope (ScopedRateThrottle) -- see below
        "burst": "60/min",
    },
}
# rates:  "<number>/<period>"  where period is second|sec|minute|min|hour|day  (or s/m/h/d)
\`\`\`

**Per-view + scoped**

\`\`\`python
from rest_framework.throttling import ScopedRateThrottle, UserRateThrottle

class LoginView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"                # -> uses DEFAULT_THROTTLE_RATES["login"] = "5/min"

class BurstyUserThrottle(UserRateThrottle):
    scope = "burst"                         # a second per-user bucket at a different rate

class SearchView(APIView):
    throttle_classes = [UserRateThrottle, BurstyUserThrottle]   # 1000/day AND 60/min
\`\`\`

**What a client sees**

\`\`\`
HTTP 429 Too Many Requests
Retry-After: 42
{"detail": "Request was throttled. Expected available in 42 seconds."}
\`\`\`

**Throttling needs a real cache**

\`\`\`python
# the default LocMemCache is PER-PROCESS -> throttle counts are not shared across workers
CACHES = {"default": {
    "BACKEND": "django.core.cache.backends.redis.RedisCache",
    "LOCATION": "redis://127.0.0.1:6379/1",
}}
\`\`\`

**CORS — \`django-cors-headers\`**

\`\`\`python
# pip install django-cors-headers
INSTALLED_APPS = [..., "corsheaders"]
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",           # HIGH -- above CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    ...
]

CORS_ALLOWED_ORIGINS = [
    "https://app.example.com",
    "https://admin.example.com",
]
# CORS_ALLOW_ALL_ORIGINS = True     # dev only, and NOT with credentials
CORS_ALLOW_CREDENTIALS = True        # allow cookies/Authorization on cross-origin -> origin CANNOT be "*"
CORS_ALLOWED_ORIGIN_REGEXES = [r"^https://.*\\.example\\.com$"]
\`\`\`

**How a browser cross-origin call works**

\`\`\`
1. JS on https://app.example.com does  fetch("https://api.example.com/orders/", {method: "POST", ...})
2. non-simple request -> browser sends a PREFLIGHT:  OPTIONS /orders/  Origin: https://app.example.com
                                                     Access-Control-Request-Method: POST
3. CorsMiddleware replies:  Access-Control-Allow-Origin: https://app.example.com
                            Access-Control-Allow-Methods: POST, ...
                            Access-Control-Allow-Headers: authorization, content-type
4. browser then sends the real POST. Without step 3 headers, the browser BLOCKS it (the server never sees a problem).
\`\`\`

\`\`\`
CORS  = a set of RESPONSE headers a browser reads to decide if cross-origin JS may see the response.
      = NOT enforced by the server ; NOT a substitute for auth ; NOT related to CSRF.
CSRF  = protects cookie-authed state-changing requests (Module 4 lesson 6). Header-auth APIs don't need it.
auth  = who you are (this module, lessons 1-3).
CORS_ALLOW_CREDENTIALS = True  =>  CORS_ALLOWED_ORIGINS must be an explicit list, never "*"
\`\`\``,

    simpleHi: `**Throttling — configure**

\`\`\`python
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "20/min",      # unauthenticated -> IP se keyed
        "user": "1000/day",    # authenticated  -> user id se keyed
        "login": "5/min",      # ek named scope (ScopedRateThrottle)
        "burst": "60/min",
    },
}
# rates:  "<number>/<period>"  period = second|min|hour|day
\`\`\`

**Per-view + scoped**

\`\`\`python
from rest_framework.throttling import ScopedRateThrottle, UserRateThrottle

class LoginView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"                # -> DEFAULT_THROTTLE_RATES["login"] = "5/min"

class BurstyUserThrottle(UserRateThrottle):
    scope = "burst"

class SearchView(APIView):
    throttle_classes = [UserRateThrottle, BurstyUserThrottle]   # 1000/day AUR 60/min
\`\`\`

**Client kya dekhता hai**

\`\`\`
HTTP 429 Too Many Requests
Retry-After: 42
{"detail": "Request was throttled. Expected available in 42 seconds."}
\`\`\`

**Throttling ko ek asli cache chahिए**

\`\`\`python
# default LocMemCache PER-PROCESS hai -> throttle counts workers ke paar shared nahi
CACHES = {"default": {
    "BACKEND": "django.core.cache.backends.redis.RedisCache",
    "LOCATION": "redis://127.0.0.1:6379/1",
}}
\`\`\`

**CORS — \`django-cors-headers\`**

\`\`\`python
INSTALLED_APPS = [..., "corsheaders"]
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",           # HIGH -- CommonMiddleware ke upar
    "django.middleware.common.CommonMiddleware",
    ...
]
CORS_ALLOWED_ORIGINS = ["https://app.example.com", "https://admin.example.com"]
CORS_ALLOW_CREDENTIALS = True        # cross-origin par cookies/Authorization -> origin "*" NAHI ho sakta
\`\`\`

**Ek browser cross-origin call kaise kaam karता hai**

\`\`\`
1. https://app.example.com par JS  fetch("https://api.example.com/orders/", {method: "POST"})  karता hai
2. non-simple request -> browser ek PREFLIGHT bhejता hai:  OPTIONS /orders/  Origin: https://app.example.com
3. CorsMiddleware reply karता hai:  Access-Control-Allow-Origin: https://app.example.com  + Methods + Headers
4. browser phir asli POST bhejता hai. Step 3 headers ke bina, browser ise BLOCK karता hai (server ko pata nahi chalता).
\`\`\`

\`\`\`
CORS  = RESPONSE headers ka ek set jо ek browser padhता hai tay karने ko cross-origin JS response dekh sakta hai.
      = server dwara enforced NAHI ; auth ka substitute NAHI ; CSRF se sambandhit NAHI.
CSRF  = cookie-authed state-changing requests ko protect karता hai. Header-auth APIs ko iski zaroorat nahi.
auth  = aap kaun ho.
CORS_ALLOW_CREDENTIALS = True  =>  CORS_ALLOWED_ORIGINS ek explicit list honi chahिए, kabhi "*" nahi
\`\`\``,

    content: `## Throttling

### How the classes key requests

- **\`AnonRateThrottle\`** — applies only to unauthenticated requests, keyed by IP (\`REMOTE_ADDR\`, or a header if \`NUM_PROXIES\` is set). Rate from \`DEFAULT_THROTTLE_RATES["anon"]\`.
- **\`UserRateThrottle\`** — applies to authenticated requests, keyed by \`user.pk\` (falls back to IP for anonymous). Rate from \`["user"]\`.
- **\`ScopedRateThrottle\`** — keyed by \`view.throttle_scope\` + identity. Lets you set a tight limit on a specific endpoint (\`login\`, \`password-reset\`, \`expensive-report\`) while the rest of the API uses the blanket \`user\`/\`anon\` rate.

You can subclass \`UserRateThrottle\` and set a custom \`scope\` to run **two** buckets on one user — e.g. \`1000/day\` sustained plus \`60/min\` burst.

### Rate syntax

\`"<count>/<period>"\` — period is \`second\`, \`minute\`, \`hour\`, or \`day\` (or the first letter). \`"5/min"\` means 5 requests per rolling 60-second window. \`None\` disables that scope.

### The response

When the limit is hit, DRF raises \`Throttled\`, which the exception handler turns into \`429 Too Many Requests\` with a \`Retry-After\` header (seconds) and a \`detail\` message. The throttle's \`wait()\` computes the seconds.

### It needs a shared cache

Throttle counters live in Django's cache (\`django.core.cache\`). The default \`LocMemCache\` is **per-process** — with \`gunicorn -w 4\` you effectively get 4x the limit, and it resets on restart. Production throttling requires a shared backend: **Redis** or **Memcached**. Point \`CACHES["default"]\` at it (or a dedicated cache alias and override \`throttle\`'s \`cache\`).

### Limits of IP-based throttling

\`AnonRateThrottle\` keys on IP, which is imperfect: a whole office behind one NAT shares a bucket; an attacker with a botnet or rotating proxies sidesteps it. It raises the cost of abuse but is not a hard wall. Layer it with a WAF / Cloudflare rate-limiting for anything critical, and always scope-throttle auth endpoints.

## CORS

### What the same-origin policy does

A browser lets JavaScript on \`https://a.com\` freely call \`https://a.com/...\` but, for a call to \`https://b.com/...\`, it will *send* the request but **hide the response** from the JS unless \`b.com\` opts in with CORS headers. (Some requests it won't even send without a preflight.) This is a **browser** rule — it protects the *user's* other sessions, not your server.

### Simple vs preflighted requests

- **Simple**: \`GET\`/\`HEAD\`/\`POST\` with only "safe" headers and a \`Content-Type\` of \`text/plain\`, \`application/x-www-form-urlencoded\`, or \`multipart/form-data\`. The browser sends it directly with an \`Origin\` header and checks \`Access-Control-Allow-Origin\` on the response.
- **Preflighted**: anything else — \`PUT\`/\`PATCH\`/\`DELETE\`, \`Content-Type: application/json\`, an \`Authorization\` header, a custom header. The browser first sends an \`OPTIONS\` request (the *preflight*) asking "may I send a \`POST\` with an \`Authorization\` header?". The server must answer with \`Access-Control-Allow-Methods\`, \`Access-Control-Allow-Headers\`, and \`Access-Control-Allow-Origin\`. Only then does the browser send the real request.

Almost every real API call (JSON body, bearer token) is preflighted.

### \`django-cors-headers\` config

- **\`CORS_ALLOWED_ORIGINS\`** — an explicit list of scheme+host origins. Prefer this.
- **\`CORS_ALLOWED_ORIGIN_REGEXES\`** — for wildcard subdomains: \`[r"^https://\\w+\\.example\\.com$"]\`.
- **\`CORS_ALLOW_ALL_ORIGINS = True\`** — reflects any origin. **Dev only.** Never in production, and impossible to combine with credentials.
- **\`CORS_ALLOW_CREDENTIALS = True\`** — lets the browser send cookies / \`Authorization\` on cross-origin requests and read the response. The spec forbids \`Access-Control-Allow-Origin: *\` with credentials, so \`django-cors-headers\` echoes the specific origin — which means you **must** use an explicit allowlist.
- **\`CORS_ALLOW_HEADERS\` / \`CORS_ALLOW_METHODS\`** — usually the defaults are fine; extend if you use a custom header.
- **Middleware position**: \`CorsMiddleware\` must be **above** \`CommonMiddleware\` (and any middleware that generates responses) so it can add headers to redirects and errors too.

### CORS is not a security control

Setting \`CORS_ALLOWED_ORIGINS\` does **not** stop a \`curl\`, a mobile app, a server, or a malicious script running outside a browser from calling your API. It only tells *browsers* which origins' JavaScript may read responses. Your actual protection is authentication + permissions + throttling. A common confusion: "I locked CORS down, so my API is secure" — it is not; CORS is about browser compatibility, not access control.

### CORS vs CSRF vs auth

| | Protects | Mechanism | Bypassable by non-browser? |
|---|---|---|---|
| CORS | the user's cross-site *reads* in a browser | response headers the browser honours | yes, trivially |
| CSRF | your cookie-authed *writes* | a token the attacker's page cannot obtain | n/a (only browsers send cookies) |
| Auth | your endpoints | credentials in a header/cookie the server verifies | no |

A header-auth (token/JWT) API on a different origin from its SPA needs **CORS** configured (so the browser lets the SPA read responses) but does **not** need CSRF (no ambient cookie). A cookie-auth API needs both.`,

    contentHi: `## Throttling

### Classes requests ko kaise key karती hain

- **\`AnonRateThrottle\`** — sirf unauthenticated requests par lागू, IP se keyed. Rate \`DEFAULT_THROTTLE_RATES["anon"]\` se.
- **\`UserRateThrottle\`** — authenticated requests par lागू, \`user.pk\` se keyed. Rate \`["user"]\` se.
- **\`ScopedRateThrottle\`** — \`view.throttle_scope\` + identity se keyed. Ek vishisht endpoint (\`login\`, \`password-reset\`) par ek tight limit set karने deता hai.

Aap \`UserRateThrottle\` subclass karके ek custom \`scope\` set kar sakte ho ek user par **do** buckets chalाने ko.

### Rate syntax

\`"<count>/<period>"\` — period \`second\`, \`minute\`, \`hour\`, ya \`day\`. \`"5/min"\` = prati rolling 60-second window 5 requests.

### Response

Limit hit hone par, DRF \`Throttled\` raise karता hai, jise exception handler \`429 Too Many Requests\` banаता hai ek \`Retry-After\` header (seconds) ke saath.

### Ise ek shared cache chahिए

Throttle counters Django ke cache mein rehते hain. Default \`LocMemCache\` **per-process** hai — \`gunicorn -w 4\` ke saath aapको effectively 4x limit milती hai. Production throttling ko ek shared backend chahिए: **Redis** ya **Memcached**.

### IP-based throttling ki limits

\`AnonRateThrottle\` IP par key karता hai, jо imperfect hai: ek poora office ek NAT ke peeche ek bucket share karता hai; ek attacker rotating proxies se sidestep karता hai. Ye abuse ki cost badhाता hai par ek hard wall nahi. Ise ek WAF / Cloudflare rate-limiting ke saath layer karो.

## CORS

### Same-origin policy kya karती hai

Ek browser \`https://a.com\` par JavaScript ko \`https://a.com/...\` freely call karने deता hai par, \`https://b.com/...\` ke ek call ke liye, ye request *bhejेga* par JS se **response chhupाega** jab tak \`b.com\` CORS headers se opt in na kare. Ye ek **browser** rule hai — ye *user ke* doosre sessions ko protect karता hai, aapke server ko nahi.

### Simple vs preflighted requests

- **Simple**: \`GET\`/\`HEAD\`/\`POST\` sirf "safe" headers aur ek \`Content-Type\` \`text/plain\`, \`application/x-www-form-urlencoded\`, ya \`multipart/form-data\` ke saath.
- **Preflighted**: baaki sab — \`PUT\`/\`PATCH\`/\`DELETE\`, \`Content-Type: application/json\`, ek \`Authorization\` header. Browser pehle ek \`OPTIONS\` request bhejता hai (*preflight*). Server ko \`Access-Control-Allow-Methods\`, \`Access-Control-Allow-Headers\`, aur \`Access-Control-Allow-Origin\` se jawab dena hoगा.

Lगbhag har asli API call (JSON body, bearer token) preflighted hai.

### \`django-cors-headers\` config

- **\`CORS_ALLOWED_ORIGINS\`** — scheme+host origins ki ek explicit list. Ise prefer karो.
- **\`CORS_ALLOW_ALL_ORIGINS = True\`** — **Sirf dev.** Kabhi production mein nahi, aur credentials ke saath asंbhav.
- **\`CORS_ALLOW_CREDENTIALS = True\`** — browser ko cross-origin par cookies / \`Authorization\` bhejने aur response padhने deता hai. Spec credentials ke saath \`Access-Control-Allow-Origin: *\` mana karता hai, toh aapको ek explicit allowlist istemal karni **chahिए**.
- **Middleware position**: \`CorsMiddleware\` \`CommonMiddleware\` ke **upar** hona chahिए.

### CORS ek security control nahi hai

\`CORS_ALLOWED_ORIGINS\` set karna ek \`curl\`, ek mobile app, ek server ko aapki API call karने se **nahi** rokта. Ye sirf *browsers* ko batाता hai kaunse origins ka JavaScript responses padh sakta hai. Aapki asli protection authentication + permissions + throttling hai.

### CORS vs CSRF vs auth

- CORS: browser mein user ke cross-site *reads* ko protect karता hai; response headers; non-browser dwara trivially bypassable.
- CSRF: aapke cookie-authed *writes* ko protect karता hai; ek token; sirf browsers cookies bhejते hain.
- Auth: aapke endpoints; ek header/cookie mein credentials jise server verify karता hai; non-browser dwara bypassable nahi.

Ek header-auth (token/JWT) API jо apne SPA se ek alag origin par hai use **CORS** configured chahिए par CSRF **nahi** chahिए. Ek cookie-auth API ko dono chahिए.`,

    examples: [
      {
        title: 'ScopedRateThrottle: a tight 3/min limit on one endpoint -> 429 + Retry-After',
        titleHi: 'ScopedRateThrottle: ek endpoint par ek tight 3/min limit -> 429 + Retry-After',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}},
    REST_FRAMEWORK={
        "DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": [],
        "DEFAULT_THROTTLE_CLASSES": ["rest_framework.throttling.ScopedRateThrottle"],
        "DEFAULT_THROTTLE_RATES": {"login": "3/min", "search": "100/min"}})
django.setup()

from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.test import APIClient

class LoginView(APIView):
    throttle_scope = "login"
    def post(self, request):
        return Response({"ok": True})

class SearchView(APIView):
    throttle_scope = "search"
    def get(self, request):
        return Response({"results": []})

urlpatterns = [path("login/", LoginView.as_view()), path("search/", SearchView.as_view())]

c = APIClient()
for i in range(1, 6):
    r = c.post("/login/", {}, format="json")
    extra = f" | Retry-After: {r.get('Retry-After')}" if r.status_code == 429 else ""
    print(f"login attempt {i}: {r.status_code}{extra}")

# the 'search' scope is a separate bucket -- not affected
print("search still fine:", c.get("/search/").status_code)`,
        output: `login attempt 1: 200
login attempt 2: 200
login attempt 3: 200
login attempt 4: 429 | Retry-After: 60
login attempt 5: 429 | Retry-After: 60
search still fine: 200
`,
        explain: 'ScopedRateThrottle keys the counter by view.throttle_scope + identity, so login (3/min) and search (100/min) are independent buckets. The 4th POST /login/ in the window raises Throttled -> 429 with Retry-After: 60 (seconds until the oldest request ages out of the 60-second window). /search/ is unaffected. This is how you put a strict limit on abuse-prone endpoints while the rest of the API stays generous.',
        explainHi: 'ScopedRateThrottle counter ko view.throttle_scope + identity se key karta hai, toh login (3/min) aur search (100/min) independent buckets hain. Window mein 4th POST /login/ Throttled raise karta hai -> 429 Retry-After: 60 ke saath. /search/ unaffected hai.',
      },
      {
        title: 'Anon vs User throttle: keyed by IP vs user id, different rates',
        titleHi: 'Anon vs User throttle: IP vs user id se keyed, alag rates',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}},
    REST_FRAMEWORK={
        "DEFAULT_THROTTLE_CLASSES": [
            "rest_framework.throttling.AnonRateThrottle",
            "rest_framework.throttling.UserRateThrottle"],
        "DEFAULT_THROTTLE_RATES": {"anon": "2/min", "user": "5/min"}})
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.contrib.auth.models import User
from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.test import APIClient

class Ping(APIView):
    def get(self, request):
        return Response({"who": request.user.username or "anon"})

urlpatterns = [path("ping/", Ping.as_view())]
ada = User.objects.create_user("ada")

anon = APIClient()
print("anon (limit 2/min):", [anon.get("/ping/").status_code for _ in range(4)])

authed = APIClient(); authed.force_authenticate(ada)
print("ada  (limit 5/min):", [authed.get("/ping/").status_code for _ in range(7)])

# a second anonymous client from a "different IP" -- separate bucket
anon2 = APIClient(REMOTE_ADDR="10.0.0.9")
print("anon2 different IP:", [anon2.get("/ping/").status_code for _ in range(3)])`,
        output: `anon (limit 2/min): [200, 200, 429, 429]
ada  (limit 5/min): [200, 200, 200, 200, 200, 429, 429]
anon2 different IP: [200, 200, 429]
`,
        explain: 'AnonRateThrottle applies only to unauthenticated requests and keys on the client IP -- so the anonymous client hits its 2/min limit at the 3rd request. UserRateThrottle applies to authenticated requests and keys on user.pk -- ada gets her own 5/min bucket. A second anonymous client from a different REMOTE_ADDR has its own IP bucket, independent of the first. IP-based keying is why a shared office NAT would share one anon bucket in production.',
        explainHi: 'AnonRateThrottle sirf unauthenticated requests par lagu aur client IP par key karta hai -- toh anonymous client apni 2/min limit 3rd request par hit karta hai. UserRateThrottle authenticated requests par lagu aur user.pk par key karta hai. Ek alag REMOTE_ADDR se ek doosra anonymous client ka apna IP bucket hai.',
      },
      {
        title: 'CORS: the preflight OPTIONS and the Access-Control headers',
        titleHi: 'CORS: preflight OPTIONS aur Access-Control headers',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "corsheaders", "rest_framework"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    MIDDLEWARE=["corsheaders.middleware.CorsMiddleware",
               "django.middleware.common.CommonMiddleware"],
    CORS_ALLOWED_ORIGINS=["https://app.example.com"],
    CORS_ALLOW_CREDENTIALS=True,
    REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES": [], "DEFAULT_PERMISSION_CLASSES": []})
django.setup()

from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.test import APIClient

class Orders(APIView):
    def get(self, request):
        return Response({"orders": []})
    def post(self, request):
        return Response({"created": True}, status=201)

urlpatterns = [path("orders/", Orders.as_view())]
c = APIClient()

# 1. preflight from an allowed origin
pf = c.options("/orders/", HTTP_ORIGIN="https://app.example.com",
               HTTP_ACCESS_CONTROL_REQUEST_METHOD="POST",
               HTTP_ACCESS_CONTROL_REQUEST_HEADERS="authorization,content-type")
print("preflight status:", pf.status_code)
print("  Allow-Origin:", pf.get("Access-Control-Allow-Origin"))
print("  Allow-Methods:", pf.get("Access-Control-Allow-Methods"))
print("  Allow-Credentials:", pf.get("Access-Control-Allow-Credentials"))

# 2. actual GET from the allowed origin -> header present, browser will show the response
ok = c.get("/orders/", HTTP_ORIGIN="https://app.example.com")
print("allowed origin GET -> Allow-Origin:", ok.get("Access-Control-Allow-Origin"))

# 3. GET from a disallowed origin -> NO Allow-Origin header -> browser hides the response
#    (the server still returns 200 -- CORS is browser-side only)
bad = c.get("/orders/", HTTP_ORIGIN="https://evil.example.net")
print("disallowed origin GET -> status:", bad.status_code,
      "| Allow-Origin:", bad.get("Access-Control-Allow-Origin"))`,
        output: `preflight status: 200
  Allow-Origin: https://app.example.com
  Allow-Methods: DELETE, GET, OPTIONS, PATCH, POST, PUT
  Allow-Credentials: true
allowed origin GET -> Allow-Origin: https://app.example.com
disallowed origin GET -> status: 200 | Allow-Origin: None
`,
        explain: 'A non-simple cross-origin request (a JSON POST, an Authorization header) triggers a preflight OPTIONS. CorsMiddleware answers it with Access-Control-Allow-Origin (the specific origin, because CORS_ALLOW_CREDENTIALS=True forbids *), Allow-Methods, and Allow-Credentials: true. For an allowed origin the actual GET also carries Access-Control-Allow-Origin. For a disallowed origin the server still returns 200 -- it just omits the header, and the browser then hides the response from the JS. CORS is browser-side only.',
        explainHi: 'Ek non-simple cross-origin request ek preflight OPTIONS trigger karta hai. CorsMiddleware ise Access-Control-Allow-Origin (vishisht origin, kyunki CORS_ALLOW_CREDENTIALS=True * mana karta hai), Allow-Methods, aur Allow-Credentials: true ke saath jawab deta hai. Ek disallowed origin ke liye server abhi bhi 200 lautata hai -- ye bas header omit karta hai, aur browser phir response ko JS se chhupata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# production settings, running gunicorn -w 4
CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}
REST_FRAMEWORK = {"DEFAULT_THROTTLE_RATES": {"anon": "100/hour"}}
# the "100/hour" limit is actually ~400/hour (one counter per worker) and resets on every deploy`,
        right: `CACHES = {"default": {
    "BACKEND": "django.core.cache.backends.redis.RedisCache",
    "LOCATION": "redis://cache:6379/1",
}}
# now all workers share one counter and it survives restarts`,
        why: 'DRF throttles store their counters in `django.core.cache`. `LocMemCache` is a per-process dict, so with N workers you get N independent counters (N× the intended limit) and everything resets whenever a process restarts (every deploy, every crash). Real throttling needs a shared, persistent cache — Redis or Memcached — so the limit is global and stable.',
        whyHi: 'DRF throttles apne counters `django.core.cache` mein store karते hain. `LocMemCache` ek per-process dict hai, toh N workers ke saath aapको N independent counters milते hain (N× intended limit) aur har process restart par sab reset ho jाता hai. Asli throttling ko ek shared, persistent cache chahिए — Redis ya Memcached.',
      },
      {
        wrong: `CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
# django-cors-headers will refuse / the browser rejects it: "*" is illegal with credentials`,
        right: `CORS_ALLOWED_ORIGINS = [
    "https://app.example.com",
    "https://staging.app.example.com",
]
CORS_ALLOW_CREDENTIALS = True   # now the middleware echoes the specific matching origin`,
        why: 'The CORS spec forbids `Access-Control-Allow-Origin: *` together with `Access-Control-Allow-Credentials: true` — a wildcard plus credentials would let any site make authenticated requests. `django-cors-headers` handles this by echoing the *specific* request origin when it is in your allowlist, which requires an explicit `CORS_ALLOWED_ORIGINS` list (or regexes). `CORS_ALLOW_ALL_ORIGINS` is a dev-only shortcut and cannot coexist with credentials.',
        whyHi: 'CORS spec `Access-Control-Allow-Origin: *` ko `Access-Control-Allow-Credentials: true` ke saath mana karता hai — ek wildcard plus credentials kisi bhi site ko authenticated requests karने deता. `django-cors-headers` ise *vishisht* request origin echo karके handle karता hai jab wo aapke allowlist mein ho, jise ek explicit `CORS_ALLOWED_ORIGINS` list chahिए.',
      },
      {
        wrong: `# "I set CORS_ALLOWED_ORIGINS so my API only accepts requests from my frontend"
CORS_ALLOWED_ORIGINS = ["https://app.example.com"]
# then leaving an endpoint with permission_classes = [AllowAny] because "CORS protects it"`,
        right: `CORS_ALLOWED_ORIGINS = ["https://app.example.com"]   # browser convenience, NOT access control
# every non-public endpoint still needs real auth:
class ThingView(APIView):
    permission_classes = [IsAuthenticated]`,
        why: 'CORS headers only instruct *browsers* whether cross-origin JavaScript may read a response. A `curl`, Postman, a mobile app, a script, or a server ignores CORS entirely and can call your API freely. CORS is a browser compatibility mechanism, not a firewall. Access control is authentication + permissions + throttling; CORS config is orthogonal to it.',
        whyHi: 'CORS headers sirf *browsers* ko batाते hain ki cross-origin JavaScript ek response padh sakta hai. Ek `curl`, Postman, ek mobile app, ek script CORS ko poori tarah ignore karता hai aur aapki API freely call kar sakta hai. CORS ek browser compatibility mechanism hai, ek firewall nahi. Access control authentication + permissions + throttling hai.',
      },
    ],

    realWorld: [
      {
        en: '**Blanket `UserRateThrottle`/`AnonRateThrottle` at generous rates + a tight `ScopedRateThrottle` on `login`, `register`, `password-reset`, `token/refresh`, and any expensive report** — `login: 5/min`, `password-reset: 3/hour`. The generous default keeps normal clients happy; the scoped limits blunt credential-stuffing and abuse.',
        hi: '**Generous rates par blanket `UserRateThrottle`/`AnonRateThrottle` + `login`, `register`, `password-reset`, `token/refresh` par ek tight `ScopedRateThrottle`** — `login: 5/min`, `password-reset: 3/hour`.',
      },
      {
        en: '**Redis as the cache backend, shared by throttling, per-view caching (Module 7), and Celery results** — one `CACHES["default"]` pointing at Redis; throttle counters, cached responses, and session data all live there and survive deploys.',
        hi: '**Redis cache backend ke roop mein, throttling, per-view caching (Module 7), aur Celery results dwara shared** — ek `CACHES["default"]` Redis par point karता hai.',
      },
      {
        en: '**`CORS_ALLOWED_ORIGINS` per environment** — `["http://localhost:5173"]` in dev, `["https://staging.app.com"]` in staging, `["https://app.com", "https://www.app.com"]` in prod, from env vars. `CORS_ALLOW_CREDENTIALS = True` only if the SPA uses cookie auth; a bearer-token SPA often leaves it `False`.',
        hi: '**Prati environment `CORS_ALLOWED_ORIGINS`** — dev mein `["http://localhost:5173"]`, prod mein `["https://app.com", "https://www.app.com"]`, env vars se. `CORS_ALLOW_CREDENTIALS = True` sirf agar SPA cookie auth istemal kare.',
      },
    ],

    interviewQA: [
      {
        q: 'How does DRF throttling work, what does it key on, and why does it need a specific cache backend?',
        qHi: 'DRF throttling kaise kaam karता hai, ye kispar key karता hai, aur ise ek vishisht cache backend kyun chahिए?',
        a: 'Before the view handler, DRF calls allow_request on each throttle class. A rate throttle takes the identity, builds a cache key from it plus the throttle scope, reads the list of recent request timestamps stored under that key, drops any older than the window, and if the count is still at or above the limit it returns False, which makes DRF raise Throttled and return a 429 with a Retry-After header computed from when the oldest request will age out. Otherwise it appends now and writes the list back. What it keys on depends on the class: AnonRateThrottle applies only to unauthenticated requests and keys on the client IP; UserRateThrottle applies to authenticated ones and keys on the user primary key, falling back to IP; ScopedRateThrottle keys on a per-view throttle_scope string plus the identity, so you can put a strict limit on a login or password-reset endpoint while the rest of the API uses a generous blanket rate. Rates are written as count slash period, like five slash min. The cache matters because those timestamp lists live in django dot core dot cache, and the default LocMemCache is a plain per-process dictionary. Under a multi-worker server each worker has its own copy, so the effective limit is multiplied by the worker count, and every process restart — every deploy — wipes all counters. For throttling to actually enforce a global, stable limit you need a shared, persistent backend, in practice Redis or Memcached, so all workers increment the same counter and it survives restarts. IP-based anon throttling is also inherently coarse — an office behind one NAT shares a bucket, a botnet sidesteps it — so it raises the cost of abuse rather than being a hard wall, and critical endpoints get scoped throttles plus an upstream WAF.',
        aHi: 'View handler se pehle, DRF har throttle class par allow_request call karता hai. Ek rate throttle identity leता hai, iske plus throttle scope se ek cache key banаता hai, us key ke tahat store recent request timestamps ki list padhता hai, window se purane koi drop karता hai, aur agar count abhi bhi limit par ya upar hai ye False return karता hai, jо DRF ko Throttled raise karवाता hai aur ek 429 ek Retry-After header ke saath. Ye kispar key karता hai class par nirbhar karता hai: AnonRateThrottle sirf unauthenticated par lागू, IP par key; UserRateThrottle authenticated par, user primary key par; ScopedRateThrottle ek per-view throttle_scope string plus identity par. Cache maayne rakhता hai kyunki wo timestamp lists django dot core dot cache mein rehती hain, aur default LocMemCache ek plain per-process dictionary hai. Ek multi-worker server ke tahat har worker ki apni copy hoती hai, toh effective limit worker count se multiply hoती hai, aur har process restart saare counters wipe karता hai. Throttling ke asal mein ek global, stable limit enforce karने ke liye aapको ek shared, persistent backend chahिए, vyavhaar mein Redis ya Memcached.',
      },
      {
        q: 'Explain CORS and how it differs from CSRF and authentication. Does a JWT API need CORS, CSRF, or both?',
        qHi: 'CORS samjhाओ aur ye CSRF aur authentication se kaise alag hai. Kya ek JWT API ko CORS, CSRF, ya dono chahिए?',
        a: 'CORS is a browser rule. By default the same-origin policy lets JavaScript on one origin freely read responses only from that same origin; for a cross-origin request the browser will send it but hide the response from the script unless the server opts in by returning an Access-Control-Allow-Origin header naming that origin. For non-simple requests — a JSON content type, an Authorization header, a PUT or DELETE — the browser first sends a preflight OPTIONS request asking permission, and the server must answer with the allowed methods, headers, and origin before the real request goes. django-cors-headers adds those response headers based on CORS_ALLOWED_ORIGINS. The key point is that CORS is enforced entirely by the browser and only protects the user\'s other sessions — a curl, a mobile app, or a server ignores it completely and can call the API freely. So CORS is not access control; it is a browser compatibility mechanism. CSRF is different: it protects state-changing requests that authenticate via an ambient cookie the browser attaches automatically, by requiring a token the attacker\'s page cannot read. Authentication is a third thing entirely — verifying identity from a credential the server checks. For a JWT API whose SPA is on a different origin: it needs CORS configured, because the browser must be told the SPA\'s origin may read API responses, otherwise every fetch fails in the browser. It does not need CSRF protection, because the JWT travels in an Authorization header that the browser never attaches automatically to cross-site requests, so there is no ambient-credential attack to defend against. A cookie-authenticated API on a different origin would need both CORS and CSRF. And regardless of CORS and CSRF, the API still needs real authentication and permissions, because non-browser clients bypass CORS and CSRF entirely.',
        aHi: 'CORS ek browser rule hai. Default se same-origin policy JavaScript ko ek origin par sirf usi origin se responses freely padhने deती hai; ek cross-origin request ke liye browser ise bhejेga par script se response chhupाega jab tak server ek Access-Control-Allow-Origin header lौtाकर opt in na kare. Non-simple requests ke liye — ek JSON content type, ek Authorization header, ek PUT ya DELETE — browser pehle ek preflight OPTIONS request bhejता hai, aur server ko allowed methods, headers, aur origin se jawab dena hoगा. Mukhya baat ye hai ki CORS poori tarah browser dwara enforced hai aur sirf user ke doosre sessions ko protect karता hai — ek curl, ek mobile app ise poori tarah ignore karता hai. Toh CORS access control nahi hai. CSRF alag hai: ye state-changing requests ko protect karता hai jо ek ambient cookie ke zariye authenticate karती hain. Authentication ek teesri cheez hai. Ek JWT API jiska SPA ek alag origin par hai: use CORS configured chahिए, kyunki browser ko batाना hoगा ki SPA ka origin API responses padh sakta hai. Use CSRF protection nahi chahिए, kyunki JWT ek Authorization header mein travel karता hai jise browser cross-site automatically attach nahi karता. Ek cookie-authenticated API ko dono chahिए.',
      },
    ],

    exercises: [
      {
        task: 'Standalone DRF with `CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}` and `DEFAULT_THROTTLE_CLASSES = [ScopedRateThrottle]`, `DEFAULT_THROTTLE_RATES = {"otp": "3/min", "misc": "50/min"}`. `OtpView(APIView)` with `throttle_scope = "otp"`, `MiscView` with `throttle_scope = "misc"`. With `APIClient`: hit `/otp/` 5 times -> first 3 are `200`, 4th and 5th are `429` with a `Retry-After` header of `60`; `/misc/` still returns `200` (separate bucket).',
        taskHi: 'Standalone DRF `LocMemCache` aur `DEFAULT_THROTTLE_CLASSES = [ScopedRateThrottle]`, `DEFAULT_THROTTLE_RATES = {"otp": "3/min", "misc": "50/min"}` ke saath. `OtpView` (`throttle_scope = "otp"`), `MiscView` (`"misc"`). `/otp/` 5 baar hit karो. Assert karो.',
        hint: '`from rest_framework.throttling import ScopedRateThrottle`. `throttle_scope` is a class attribute on the view. `resp.get("Retry-After")`. `CACHES` must be set in `settings.configure` (throttle needs a cache).',
        hintHi: '`from rest_framework.throttling import ScopedRateThrottle`. `throttle_scope` view par ek class attribute hai. `resp.get("Retry-After")`. `CACHES` `settings.configure` mein set hona chahिए.',
      },
      {
        task: 'Show anon vs user throttle keying. `AnonRateThrottle` + `UserRateThrottle`, rates `{"anon": "2/min", "user": "4/min"}`, a `LocMemCache`. A `Ping(APIView)` returning `request.user.username or "anon"`. With `APIClient`: an anonymous client hitting `/ping/` 4 times -> `[200, 200, 429, 429]`; a `force_authenticate`d client -> `[200, 200, 200, 200, 429]`; a second anonymous client with `REMOTE_ADDR="10.1.1.1"` -> its first 2 are `200` (independent IP bucket).',
        taskHi: 'Anon vs user throttle keying dikhाओ. `AnonRateThrottle` + `UserRateThrottle`, rates `{"anon": "2/min", "user": "4/min"}`. Ek `Ping(APIView)`. Teen clients se assert karो.',
        hint: '`call_command("migrate", run_syncdb=True, verbosity=0)` for the user table. `APIClient(REMOTE_ADDR="10.1.1.1")` sets the IP. `authed = APIClient(); authed.force_authenticate(user)`. Anon throttle keys on IP; user throttle keys on `user.pk`.',
        hintHi: '`call_command("migrate", run_syncdb=True, verbosity=0)`. `APIClient(REMOTE_ADDR="10.1.1.1")`. `authed.force_authenticate(user)`.',
      },
      {
        task: 'CORS. Standalone with `corsheaders`, `MIDDLEWARE = [CorsMiddleware, CommonMiddleware]`, `CORS_ALLOWED_ORIGINS = ["https://good.example.com"]`, `CORS_ALLOW_CREDENTIALS = True`. An `Items(APIView)` with `get` and `post`. With `APIClient`: (a) an `OPTIONS` preflight with `HTTP_ORIGIN="https://good.example.com"` + `HTTP_ACCESS_CONTROL_REQUEST_METHOD="POST"` -> `200` with `Access-Control-Allow-Origin` echoing the origin and `Access-Control-Allow-Credentials: true`; (b) a `GET` with the good origin -> `Access-Control-Allow-Origin` header present; (c) a `GET` with `HTTP_ORIGIN="https://evil.test"` -> status still `200` but NO `Access-Control-Allow-Origin` header.',
        taskHi: 'CORS. Standalone `corsheaders`, `MIDDLEWARE = [CorsMiddleware, CommonMiddleware]`, `CORS_ALLOWED_ORIGINS = ["https://good.example.com"]` ke saath. Ek `Items(APIView)`. (a) preflight; (b) good origin GET; (c) evil origin GET (status 200 par koi Allow-Origin nahi).',
        hint: '`"corsheaders"` in `INSTALLED_APPS`. `c.options(url, HTTP_ORIGIN=..., HTTP_ACCESS_CONTROL_REQUEST_METHOD="POST")`. `resp.get("Access-Control-Allow-Origin")` is `None` for a disallowed origin. The server always returns 200 — CORS is browser-side.',
        hintHi: '`"corsheaders"` `INSTALLED_APPS` mein. `c.options(url, HTTP_ORIGIN=..., HTTP_ACCESS_CONTROL_REQUEST_METHOD="POST")`. Disallowed origin ke liye `resp.get("Access-Control-Allow-Origin")` `None` hai.',
      },
    ],

    keyTakeaways: [
      'Throttling limits requests per identity per window. `AnonRateThrottle` (keyed by IP, unauthenticated), `UserRateThrottle` (keyed by `user.pk`, authenticated), `ScopedRateThrottle` (keyed by `view.throttle_scope` + identity — for tight per-endpoint limits like `login: 5/min`).',
      'Rate syntax: `"<count>/<period>"` (`second`/`minute`/`hour`/`day`). Over the limit -> `Throttled` -> `429 Too Many Requests` + `Retry-After: <seconds>`. Subclass `UserRateThrottle` with a custom `scope` to run two buckets on one user (sustained + burst).',
      'Throttle counters live in `django.core.cache`. `LocMemCache` is PER-PROCESS -> with N workers you get ~N× the limit and it resets every deploy. Production throttling REQUIRES a shared backend (Redis/Memcached).',
      'IP-based anon throttling is coarse (shared NAT, botnets) — it raises abuse cost, not a hard wall. Always scope-throttle auth endpoints (`login`, `register`, `password-reset`, `token/refresh`) and layer a WAF for critical paths.',
      'CORS = RESPONSE headers a BROWSER reads to decide whether cross-origin JS may see the response. Enforced by the browser ONLY. A `curl`/mobile/server ignores it. CORS is NOT access control.',
      '`django-cors-headers`: `CorsMiddleware` ABOVE `CommonMiddleware`. `CORS_ALLOWED_ORIGINS` = explicit scheme+host list (preferred). Non-simple requests (JSON body, `Authorization` header, PUT/PATCH/DELETE) trigger a preflight `OPTIONS` the middleware answers.',
      '`CORS_ALLOW_CREDENTIALS = True` (cookies/`Authorization` cross-origin) => `CORS_ALLOWED_ORIGINS` MUST be an explicit list, NEVER `*` (the spec forbids `Allow-Origin: *` + credentials). `CORS_ALLOW_ALL_ORIGINS` is dev-only and incompatible with credentials.',
      'CORS vs CSRF vs auth: CORS protects the user\'s cross-site reads in a browser; CSRF protects cookie-authed writes; auth verifies identity. A JWT/header-auth SPA on a different origin needs CORS (browser can read responses) but NOT CSRF (no ambient cookie). A cookie-auth API needs both. All still need real auth + permissions.',
    ],
    keyTakeawaysHi: [
      'Throttling prati identity prati window requests limit karता hai. `AnonRateThrottle` (IP se keyed), `UserRateThrottle` (`user.pk` se keyed), `ScopedRateThrottle` (`view.throttle_scope` + identity se — `login: 5/min` jaise tight per-endpoint limits ke liye).',
      'Rate syntax: `"<count>/<period>"`. Limit ke upar -> `Throttled` -> `429` + `Retry-After: <seconds>`. `UserRateThrottle` ko ek custom `scope` ke saath subclass karके ek user par do buckets chalाओ.',
      'Throttle counters `django.core.cache` mein rehते hain. `LocMemCache` PER-PROCESS hai -> N workers ke saath ~N× limit aur har deploy par reset. Production throttling ko ek shared backend CHAHIYE (Redis/Memcached).',
      'IP-based anon throttling coarse hai (shared NAT, botnets) — ye abuse cost badhाता hai, ek hard wall nahi. Auth endpoints ko hamesha scope-throttle karो aur critical paths ke liye ek WAF layer karो.',
      'CORS = RESPONSE headers jо ek BROWSER padhता hai tay karने ko cross-origin JS response dekh sakta hai. SIRF browser dwara enforced. Ek `curl`/mobile/server ise ignore karता hai. CORS access control NAHI hai.',
      '`django-cors-headers`: `CorsMiddleware` `CommonMiddleware` ke UPAR. `CORS_ALLOWED_ORIGINS` = explicit scheme+host list. Non-simple requests ek preflight `OPTIONS` trigger karती hain.',
      '`CORS_ALLOW_CREDENTIALS = True` => `CORS_ALLOWED_ORIGINS` ek explicit list HONI CHAHIYE, KABHI `*` nahi (spec `Allow-Origin: *` + credentials mana karता hai). `CORS_ALLOW_ALL_ORIGINS` dev-only hai.',
      'CORS vs CSRF vs auth: CORS browser mein user ke cross-site reads ko protect karता hai; CSRF cookie-authed writes ko; auth identity verify karता hai. Ek alag origin par JWT/header-auth SPA ko CORS chahिए par CSRF NAHI. Ek cookie-auth API ko dono chahिए. Sabko abhi bhi asli auth + permissions chahिए.',
    ],
  },

  {
    slug: 'dj-security-checklist-and-owasp',
    title: 'The Deployment Security Checklist & OWASP API Top 10',
    titleHi: 'Deployment Security Checklist & OWASP API Top 10',
    description: '`python manage.py check --deploy` flags the settings that are unsafe in production: `DEBUG`, a weak `SECRET_KEY`, missing HSTS/SSL-redirect, insecure cookies, a permissive `ALLOWED_HOSTS`. Beyond settings, the OWASP API Security Top 10 maps almost one-to-one onto Django/DRF mechanisms you have already met — object permissions, explicit serializer fields, the ORM, throttling.',
    descriptionHi: '`python manage.py check --deploy` un settings ko flag karта hai jо production mein unsafe hain: `DEBUG`, ek weak `SECRET_KEY`, missing HSTS/SSL-redirect, insecure cookies, ek permissive `ALLOWED_HOSTS`. Settings se aage, OWASP API Security Top 10 lगbhag ek-se-ek un Django/DRF mechanisms par map hoता hai jinse aap pehle mil chuke ho — object permissions, explicit serializer fields, ORM, throttling.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**A pre-flight checklist plus a list of the ten ways planes actually crash.** `check --deploy` is the pre-flight checklist: a fixed set of switches the pilot confirms every single time — flaps set, doors armed, transponder on. It does not require judgement, it requires *not skipping items*: `DEBUG` off, `SECRET_KEY` from the environment, HSTS on, cookies marked Secure, `ALLOWED_HOSTS` pinned. Run it, fix everything it prints, make it part of the deploy pipeline so a regression fails the build. The OWASP API Top 10 is the crash-cause list — the failure modes that actually bring APIs down, ranked by how often. The reassuring part for a Django developer is that most of them are not new: "broken object-level authorization" is the `get_queryset` scoping + object permissions you learned in Modules 4-6; "excessive data exposure" is putting explicit fields on your serializer instead of `"__all__"`; "injection" is the parameterised ORM you have used since Module 2; "lack of rate limiting" is the throttling from lesson 5. The checklist is mechanical; the Top 10 is a map of where to point the judgement the framework cannot supply.',
      hi: '**Ek pre-flight checklist plus un das tarikों ki list jinse planes asal mein crash hoते hain.** `check --deploy` pre-flight checklist hai: switches ka ek fixed set jо pilot har baar confirm karता hai — flaps set, doors armed, transponder on. Ise judgement nahi chahिए, ise *items skip na karna* chahिए: `DEBUG` off, `SECRET_KEY` environment se, HSTS on, cookies Secure marked, `ALLOWED_HOSTS` pinned. Ise chalाओ, jо ye print kare sab fix karो, ise deploy pipeline ka hissa banаओ. OWASP API Top 10 crash-cause list hai — wo failure modes jо asal mein APIs ko neeche laते hain, kितni baar hoते hain se ranked. Ek Django developer ke liye reassuring hissा ye hai ki inmें se zyादातर naye nahi hain: "broken object-level authorization" wo `get_queryset` scoping + object permissions hai jо aapne Modules 4-6 mein seekhा; "excessive data exposure" `"__all__"` ke bजाy apne serializer par explicit fields daalна hai; "injection" wo parameterised ORM hai jо aapne Module 2 se istemal kiya; "lack of rate limiting" lesson 5 ka throttling hai.',
    },

    simple: `**\`python manage.py check --deploy\`**

\`\`\`
?: (security.W004) SECURE_HSTS_SECONDS not set
?: (security.W008) SECURE_SSL_REDIRECT is not True
?: (security.W009) SECRET_KEY has less than 50 characters / is too common
?: (security.W012) SESSION_COOKIE_SECURE is not True
?: (security.W016) CSRF_COOKIE_SECURE is not True
?: (security.W018) DEBUG is True in deployment
?: (security.W020) ALLOWED_HOSTS is empty / '*'
\`\`\`

**The production settings block**

\`\`\`python
import os

DEBUG = False
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]              # from env, never in the repo
ALLOWED_HOSTS = os.environ["DJANGO_ALLOWED_HOSTS"].split(",")   # explicit, never ['*']

# behind a TLS-terminating proxy (nginx / ALB / Cloudflare):
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# HTTPS enforcement
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000                            # 1 year -- start smaller, then raise
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# cookies
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True                            # (default True)
SESSION_COOKIE_SAMESITE = "Lax"                           # "Strict" if no cross-site nav needed
CSRF_COOKIE_HTTPONLY = False                              # JS needs to read it for the header (Module 4)

# misc headers
SECURE_CONTENT_TYPE_NOSNIFF = True                        # (default True)
X_FRAME_OPTIONS = "DENY"                                  # anti-clickjacking (default SAMEORIGIN)
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

# CSRF trusted origins if forms/session-auth are used cross-subdomain (Module 4 lesson 6)
CSRF_TRUSTED_ORIGINS = ["https://app.example.com"]
\`\`\`

**OWASP API Security Top 10 -> Django/DRF mechanism**

\`\`\`
API1 Broken Object Level Authorization (BOLA/IDOR)  -> get_queryset() scoping + has_object_permission (M4-6)
API2 Broken Authentication                          -> simplejwt, short access tokens, throttle login (L1-2, L5)
API3 Broken Object Property Level Auth / data leak  -> explicit serializer fields; read_only; a write serializer (M5)
API4 Unrestricted Resource Consumption              -> throttling, pagination, iterator(), query limits (L5, M5, M8)
API5 Broken Function Level Authorization            -> permission_classes / get_permissions per action (L4)
API6 Unrestricted Access to Sensitive Business Flows-> ScopedRateThrottle, step-up auth, idempotency keys (L5)
API7 Server Side Request Forgery                    -> validate + allowlist any URL you fetch; block internal IPs
API8 Security Misconfiguration                      -> check --deploy, DEBUG=False, this settings block
API9 Improper Inventory Management                  -> version + document APIs, retire old versions (M5 L6)
API10 Unsafe Consumption of 3rd-party APIs          -> validate upstream responses; timeouts; don't proxy blindly
\`\`\`

**Secrets & dependencies**

\`\`\`python
# .env (gitignored) or a secrets manager -- NEVER commit SECRET_KEY, DB passwords, API keys
# rotate anything that has been committed, even in old history
python -m pip_audit            # scan installed packages for known CVEs
pip list --outdated            # keep dependencies current
\`\`\`

\`\`\`
check --deploy = a mechanical settings audit. Wire it into CI so a regression fails the build.
DEBUG=False in prod is non-negotiable: DEBUG=True leaks the traceback, settings, and SQL on every 500.
ALLOWED_HOSTS must be an explicit list -- '*' disables the Host-header check (cache poisoning, password-reset abuse).
SECRET_KEY: >=50 random chars, from the environment. Rotating it invalidates sessions + signed tokens.
The OWASP Top 10 is mostly things you already do -- the risk is doing them inconsistently across endpoints.
\`\`\``,

    simpleHi: `**\`python manage.py check --deploy\`**

\`\`\`
?: (security.W004) SECURE_HSTS_SECONDS not set
?: (security.W008) SECURE_SSL_REDIRECT is not True
?: (security.W009) SECRET_KEY has less than 50 characters / is too common
?: (security.W012) SESSION_COOKIE_SECURE is not True
?: (security.W016) CSRF_COOKIE_SECURE is not True
?: (security.W018) DEBUG is True in deployment
?: (security.W020) ALLOWED_HOSTS is empty / '*'
\`\`\`

**Production settings block**

\`\`\`python
import os

DEBUG = False
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]              # env se, kabhi repo mein nahi
ALLOWED_HOSTS = os.environ["DJANGO_ALLOWED_HOSTS"].split(",")   # explicit, kabhi ['*'] nahi

# ek TLS-terminating proxy ke peeche:
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# HTTPS enforcement
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000                            # 1 saal -- chhota shuru karो, phir badhाओ
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# cookies
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_HTTPONLY = False                              # JS ko header ke liye padhना chahिए (Module 4)

# misc headers
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"                                  # anti-clickjacking
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

CSRF_TRUSTED_ORIGINS = ["https://app.example.com"]
\`\`\`

**OWASP API Security Top 10 -> Django/DRF mechanism**

\`\`\`
API1 Broken Object Level Authorization (BOLA/IDOR)  -> get_queryset() scoping + has_object_permission (M4-6)
API2 Broken Authentication                          -> simplejwt, short access tokens, login throttle (L1-2, L5)
API3 Broken Object Property Level Auth / data leak  -> explicit serializer fields; read_only; write serializer (M5)
API4 Unrestricted Resource Consumption              -> throttling, pagination, iterator(), query limits (L5, M5, M8)
API5 Broken Function Level Authorization            -> permission_classes / get_permissions per action (L4)
API6 Unrestricted Access to Sensitive Business Flows-> ScopedRateThrottle, step-up auth, idempotency keys (L5)
API7 Server Side Request Forgery                    -> jо URL fetch karो use validate + allowlist; internal IPs block
API8 Security Misconfiguration                      -> check --deploy, DEBUG=False, ye settings block
API9 Improper Inventory Management                  -> APIs version + document karो, purane versions retire karो
API10 Unsafe Consumption of 3rd-party APIs          -> upstream responses validate karो; timeouts
\`\`\`

**Secrets & dependencies**

\`\`\`python
# .env (gitignored) ya ek secrets manager -- KABHI SECRET_KEY, DB passwords, API keys commit mat karो
# jо kuch commit hua hai use rotate karो, purane history mein bhi
python -m pip_audit            # installed packages ko known CVEs ke liye scan karो
pip list --outdated
\`\`\`

\`\`\`
check --deploy = ek mechanical settings audit. Ise CI mein wire karो.
Prod mein DEBUG=False non-negotiable hai: DEBUG=True har 500 par traceback, settings, aur SQL leak karता hai.
ALLOWED_HOSTS ek explicit list honi chahिए -- '*' Host-header check disable karता hai.
SECRET_KEY: >=50 random chars, environment se. Ise rotate karna sessions + signed tokens invalidate karта hai.
OWASP Top 10 zyादातर wo cheezein hain jо aap pehle se karते ho -- risk unhe endpoints ke paar inconsistently karna hai.
\`\`\``,

    content: `## \`check --deploy\`

\`python manage.py check --deploy\` runs the \`security\` check group against your **production** settings (run it with \`DJANGO_SETTINGS_MODULE\` pointing at prod, or \`--settings\`). Each warning has a code (\`security.W00x\`) and a one-line fix. The important ones:

| Code | Setting | Why |
|---|---|---|
| W004 | \`SECURE_HSTS_SECONDS\` | tell browsers "only ever use HTTPS for this host" (start with a small value; raise once sure) |
| W008 | \`SECURE_SSL_REDIRECT\` | 301 any plain-HTTP request to HTTPS (skip if the proxy already does it) |
| W009 | \`SECRET_KEY\` | must be long, random, and from the environment — it signs sessions, password-reset tokens, JWTs |
| W012 | \`SESSION_COOKIE_SECURE\` | never send the session cookie over plain HTTP |
| W016 | \`CSRF_COOKIE_SECURE\` | same for the CSRF cookie |
| W018 | \`DEBUG\` | \`DEBUG = True\` in production leaks tracebacks, settings, and SQL on every error page |
| W020 | \`ALLOWED_HOSTS\` | must be an explicit list; \`[]\` or \`['*']\` disables the Host-header validation |
| W021 | \`SECURE_HSTS_PRELOAD\` | only if you have submitted the domain to the HSTS preload list |

Wire \`check --deploy\` (and \`check --deploy --fail-level WARNING\`) into CI so a settings regression fails the build.

## The non-negotiables

### \`DEBUG = False\`

With \`DEBUG = True\`, every unhandled exception renders Django's yellow debug page — which includes the full traceback, local variables (often containing secrets), all your settings, the SQL that ran, and installed apps. It also disables \`ALLOWED_HOSTS\` enforcement and serves static files insecurely. \`DEBUG = False\` in every non-local environment, full stop. When it is off, set \`ADMINS\` / configure Sentry so you still see the errors.

### \`SECRET_KEY\` from the environment

The key signs session data, the CSRF token, password-reset links, \`simplejwt\` tokens, and anything using \`django.core.signing\`. If it leaks, an attacker can forge all of those. Rules: at least 50 characters, cryptographically random (\`django.core.management.utils.get_random_secret_key()\`), loaded from an env var or secrets manager, **never** committed. If it was ever committed — even in old git history — generate a new one and rotate (this logs everyone out and invalidates outstanding tokens).

### \`ALLOWED_HOSTS\`

Django validates the \`Host\` header of every request against \`ALLOWED_HOSTS\`. If it is empty or \`['*']\`, an attacker can send requests with a spoofed \`Host\` — used for cache poisoning, and for making password-reset emails point at an attacker's domain. Set it to your real domains: \`["example.com", "www.example.com", "api.example.com"]\`.

### Behind a proxy

If nginx / an ALB / Cloudflare terminates TLS and forwards plain HTTP to Django, Django thinks the request is insecure. Set \`SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")\` so \`request.is_secure()\`, \`SECURE_SSL_REDIRECT\`, and secure-cookie logic work — **only** if the proxy strips any client-supplied \`X-Forwarded-Proto\` (otherwise a client can spoof it).

## OWASP API Security Top 10, mapped

The list is dominated by **authorization** failures — and every one has a Django/DRF answer you have already seen:

- **API1 — Broken Object Level Authorization (BOLA / IDOR)**: the #1 API vulnerability. "Can user A fetch user B's order by changing the id in the URL?" Fix: scope \`get_queryset()\` to the requester (list + retrieve), add \`has_object_permission\` for the mutation path, return \`404\` not \`403\` for out-of-scope ids. (Modules 4-6.)
- **API2 — Broken Authentication**: weak password rules, no lockout/throttle on login, long-lived or non-rotating tokens, JWTs with \`alg: none\` accepted. Fix: \`simplejwt\` with short access tokens + refresh rotation, \`ScopedRateThrottle\` on \`login\`/\`token\`, \`AUTH_PASSWORD_VALIDATORS\`, MFA for sensitive accounts.
- **API3 — Broken Object Property Level Authorization**: the response includes fields the caller should not see (\`is_admin\`, another user's email, internal cost), or the request lets the caller set fields they should not (\`owner\`, \`role\`). Fix: explicit \`fields\` on the serializer (never \`"__all__"\`), \`read_only_fields\`, a separate write serializer, \`perform_create\` for server-set values. (Module 5.)
- **API4 — Unrestricted Resource Consumption**: no pagination (a list returns 2M rows), no rate limit, an endpoint that runs an unbounded query or generates a huge file. Fix: \`DEFAULT_PAGINATION_CLASS\` + \`PAGE_SIZE\`, throttling, \`.only()\`/\`.iterator()\` (Module 8), a max on \`page_size\`.
- **API5 — Broken Function Level Authorization**: a regular user can call an admin-only action because the permission was forgotten on that view/action. Fix: a project-wide default \`permission_classes\`, per-action \`get_permissions()\`, a lint that every non-public view sets permissions explicitly. (Lesson 4.)
- **API6 — Unrestricted Access to Sensitive Business Flows**: automated abuse of a flow that is "allowed" per request but harmful in bulk — mass account creation, buying all the concert tickets, scraping. Fix: scoped throttling, CAPTCHA/step-up on the flow, idempotency keys, device fingerprinting.
- **API7 — Server-Side Request Forgery**: your API fetches a URL the user supplied (a webhook target, an image URL, an import-from-URL) and an attacker points it at \`http://169.254.169.254/\` (cloud metadata) or an internal service. Fix: allowlist schemes and hosts, resolve the hostname and reject private/link-local IPs, disable redirects, use a dedicated egress proxy.
- **API8 — Security Misconfiguration**: exactly the \`check --deploy\` list — \`DEBUG\`, missing headers, verbose errors, default credentials, an open \`/admin/\` without extra protection, stack traces in responses.
- **API9 — Improper Inventory Management**: an old \`/api/v1/\` still live and unpatched, an undocumented \`/internal/\` endpoint, a staging API on the internet. Fix: version and document every API (Module 5 lesson 6), retire old versions on a schedule, keep an inventory.
- **API10 — Unsafe Consumption of Third-Party APIs**: trusting an upstream's response blindly — no timeout (their outage hangs your workers), no validation (their malformed data corrupts yours), passing their data straight through to your DB or your client. Fix: timeouts, response validation, treat third-party data as untrusted input.

## Secrets and dependencies

- **Secrets**: a gitignored \`.env\` (with \`python-decouple\` / \`django-environ\`) for small setups, a secrets manager (AWS Secrets Manager, Vault) for larger. Never in the repo, never in \`settings.py\` literals, never in \`docker-compose.yml\` committed to git. If a secret was ever committed, it is compromised — rotate it.
- **Dependencies**: \`pip-audit\` (or \`safety\`) in CI to catch packages with known CVEs; \`pip list --outdated\` / Dependabot to stay current; pin versions (\`requirements.txt\` with hashes, or a lockfile) so a deploy is reproducible.
- **\`AUTH_PASSWORD_VALIDATORS\`**: keep Django's defaults (length, common-password, numeric, similarity) and consider raising the minimum length.

## The meta-point

Security in a Django/DRF app is mostly **consistency**, not exotic techniques. The framework gives you the mechanisms — the ORM parameterises queries, serializers gate fields, permissions gate access, \`check --deploy\` audits settings. The failures happen when one endpoint out of forty forgets the \`get_queryset\` scope, or one serializer uses \`"__all__"\`, or throttling is on everywhere except the login view. A checklist and a code-review habit beat any single tool.`,

    contentHi: `## \`check --deploy\`

\`python manage.py check --deploy\` \`security\` check group ko aapke **production** settings ke khilaf chalाता hai. Har warning ka ek code (\`security.W00x\`) aur ek one-line fix hai. Mahatvapoorn:

- **W004** \`SECURE_HSTS_SECONDS\` — browsers ko batाओ "is host ke liye hamesha sirf HTTPS istemal karो".
- **W008** \`SECURE_SSL_REDIRECT\` — koi bhi plain-HTTP request 301 HTTPS par.
- **W009** \`SECRET_KEY\` — lambा, random, environment se — ye sessions, password-reset tokens, JWTs sign karता hai.
- **W012/W016** \`SESSION_COOKIE_SECURE\` / \`CSRF_COOKIE_SECURE\` — cookies kabhi plain HTTP par nahi.
- **W018** \`DEBUG\` — production mein \`DEBUG = True\` har error page par tracebacks, settings, SQL leak karता hai.
- **W020** \`ALLOWED_HOSTS\` — ek explicit list honi chahिए; \`[]\` ya \`['*']\` Host-header validation disable karता hai.

\`check --deploy\` ko CI mein wire karो.

## Non-negotiables

### \`DEBUG = False\`

\`DEBUG = True\` ke saath, har unhandled exception Django ka yellow debug page render karता hai — jismें full traceback, local variables (aksar secrets), saari settings, chalा SQL, installed apps hote hain. Ye \`ALLOWED_HOSTS\` enforcement bhi disable karता hai. Har non-local environment mein \`DEBUG = False\`.

### \`SECRET_KEY\` environment se

Key session data, CSRF token, password-reset links, \`simplejwt\` tokens sign karती hai. Agar ye leak hoती hai, ek attacker un sabko forge kar sakta hai. Niyam: kam se kam 50 characters, cryptographically random, ek env var se load, **kabhi** committed nahi. Agar ye kabhi committed hui — purane git history mein bhi — ek nayi generate karो aur rotate karो.

### \`ALLOWED_HOSTS\`

Django har request ke \`Host\` header ko \`ALLOWED_HOSTS\` ke khilaf validate karता hai. Agar ye khali ya \`['*']\` hai, ek attacker ek spoofed \`Host\` ke saath requests bhej sakta hai — cache poisoning ke liye, aur password-reset emails ko ek attacker ke domain par point karने ke liye.

### Ek proxy ke peeche

Agar nginx / ek ALB / Cloudflare TLS terminate karता hai, \`SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")\` set karो — **sirf** agar proxy koi client-supplied \`X-Forwarded-Proto\` strip karता hai.

## OWASP API Security Top 10, mapped

List **authorization** failures se dominated hai — aur har ek ka ek Django/DRF jawab hai jо aapne pehle dekhа:

- **API1 — Broken Object Level Authorization (BOLA / IDOR)**: #1 API vulnerability. Fix: \`get_queryset()\` ko requester tak scope karो, mutation path ke liye \`has_object_permission\` add karो, out-of-scope ids ke liye \`404\` lautाओ. (Modules 4-6.)
- **API2 — Broken Authentication**: Fix: \`simplejwt\` short access tokens + refresh rotation ke saath, \`login\`/\`token\` par \`ScopedRateThrottle\`, \`AUTH_PASSWORD_VALIDATORS\`.
- **API3 — Broken Object Property Level Authorization**: response mein wo fields jо caller ko nahi dikhने chahिए. Fix: serializer par explicit \`fields\`, \`read_only_fields\`, ek alag write serializer. (Module 5.)
- **API4 — Unrestricted Resource Consumption**: koi pagination nahi, koi rate limit nahi. Fix: \`DEFAULT_PAGINATION_CLASS\` + \`PAGE_SIZE\`, throttling, \`.iterator()\` (Module 8).
- **API5 — Broken Function Level Authorization**: ek regular user ek admin-only action call kar sakta hai kyunki permission bhool gaye. Fix: ek project-wide default \`permission_classes\`, per-action \`get_permissions()\`. (Lesson 4.)
- **API6 — Unrestricted Access to Sensitive Business Flows**: ek flow ka automated abuse. Fix: scoped throttling, CAPTCHA, idempotency keys.
- **API7 — Server-Side Request Forgery**: aapki API ek user-supplied URL fetch karती hai aur ek attacker ise \`http://169.254.169.254/\` par point karता hai. Fix: schemes aur hosts allowlist, private IPs reject.
- **API8 — Security Misconfiguration**: bilkul \`check --deploy\` list.
- **API9 — Improper Inventory Management**: ek purana \`/api/v1/\` abhi bhi live aur unpatched. Fix: har API version + document karो.
- **API10 — Unsafe Consumption of Third-Party APIs**: ek upstream ka response blindly trust karna. Fix: timeouts, response validation.

## Secrets aur dependencies

- **Secrets**: ek gitignored \`.env\` chhote setups ke liye, ek secrets manager bade ke liye. Kabhi repo mein nahi. Agar ek secret kabhi committed hua, wo compromised hai — rotate karो.
- **Dependencies**: CI mein \`pip-audit\` known CVEs ke liye; versions pin karो.
- **\`AUTH_PASSWORD_VALIDATORS\`**: Django ke defaults rakhо.

## Meta-point

Ek Django/DRF app mein security zyादातर **consistency** hai, exotic techniques nahi. Framework aapको mechanisms deता hai. Failures tab hoती hain jab chालीs mein se ek endpoint \`get_queryset\` scope bhool jाता hai, ya ek serializer \`"__all__"\` istemal karता hai. Ek checklist aur ek code-review aadat kisi bhi single tool se behtar hai.`,

    examples: [
      {
        title: 'check --deploy: an unsafe settings file vs a hardened one',
        titleHi: 'check --deploy: ek unsafe settings file vs ek hardened',
        code: `import subprocess, sys, json, textwrap

# run  manage.py check --deploy  in a subprocess against a given settings dict, return the W-codes
RUNNER = textwrap.dedent("""
    import io, json, sys, django
    from django.conf import settings
    from django.core.management import call_command
    settings.configure(**json.loads(sys.argv[1]))
    django.setup()
    buf = io.StringIO()
    try:
        call_command("check", "--deploy", stdout=buf, stderr=buf)
    except SystemExit:
        pass
    codes = sorted({t.strip("()") for line in buf.getvalue().splitlines()
                    for t in line.split() if t.startswith("(security.")})
    print(json.dumps(codes))
""")

BASE = {"INSTALLED_APPS": ["django.contrib.contenttypes", "django.contrib.auth"],
        "DATABASES": {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
        "DEFAULT_AUTO_FIELD": "django.db.models.BigAutoField", "USE_TZ": True}

def check_deploy(cfg):
    p = subprocess.run([sys.executable, "-c", RUNNER, json.dumps({**BASE, **cfg})],
                       capture_output=True, text=True)
    return json.loads(p.stdout.strip())

unsafe = check_deploy({
    "SECRET_KEY": "django-insecure-x",       # short + auto-generated prefix
    "DEBUG": True,
    "ALLOWED_HOSTS": [],                      # empty -> Host-header check effectively off
})

hardened = check_deploy({
    "SECRET_KEY": "kv8n2Xq4mP7wL9zT3bR6yH1cD5fG0jS-eA_iUoN!pMdBqRr@t4z2",   # 50+ random chars
    "DEBUG": False,
    "ALLOWED_HOSTS": ["example.com", "www.example.com"],
    "MIDDLEWARE": ["django.middleware.security.SecurityMiddleware",
                   "django.middleware.clickjacking.XFrameOptionsMiddleware",
                   "django.middleware.csrf.CsrfViewMiddleware"],
    "SECURE_SSL_REDIRECT": True,
    "SECURE_HSTS_SECONDS": 31536000,
    "SECURE_HSTS_INCLUDE_SUBDOMAINS": True,
    "SECURE_HSTS_PRELOAD": True,
    "SESSION_COOKIE_SECURE": True,
    "CSRF_COOKIE_SECURE": True,
    "SECURE_CONTENT_TYPE_NOSNIFF": True,
    "X_FRAME_OPTIONS": "DENY",
})

print("UNSAFE   -> warnings:", unsafe)
print("HARDENED -> warnings:", hardened)`,
        output: `UNSAFE   -> warnings: ['security.W001', 'security.W002', 'security.W003', 'security.W009', 'security.W018', 'security.W020']
HARDENED -> warnings: []
`,
        explain: 'check --deploy is a mechanical audit. The unsafe config (auto-generated short SECRET_KEY, DEBUG=True, empty ALLOWED_HOSTS, no security middleware) emits W009, W018, W020 plus W001-W003 for the missing middleware. The hardened config -- a real random key, DEBUG=False, explicit hosts, SecurityMiddleware + the SECURE_* settings -- emits nothing. Wire this into CI with --fail-level WARNING so a regression fails the build.',
        explainHi: 'check --deploy ek mechanical audit hai. Unsafe config (auto-generated short SECRET_KEY, DEBUG=True, khali ALLOWED_HOSTS, koi security middleware nahi) W009, W018, W020 plus missing middleware ke liye W001-W003 emit karta hai. Hardened config kuch nahi emit karta. Ise CI mein --fail-level WARNING ke saath wire karo.',
      },
      {
        title: 'ALLOWED_HOSTS: a spoofed Host header is rejected',
        titleHi: 'ALLOWED_HOSTS: ek spoofed Host header reject hoता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=False, SECRET_KEY="k" * 60,
    ROOT_URLCONF=__name__,
    ALLOWED_HOSTS=["example.com", "api.example.com"],
    INSTALLED_APPS=["django.contrib.contenttypes"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.http import JsonResponse
from django.urls import path
from django.test import Client

def view(request):
    return JsonResponse({"host": request.get_host()})

urlpatterns = [path("", view)]
c = Client()

print("allowed host:", c.get("/", HTTP_HOST="api.example.com").status_code)
print("another allowed host:", c.get("/", HTTP_HOST="example.com").status_code)
r = c.get("/", HTTP_HOST="evil.attacker.com")
print("spoofed host -> 400 Bad Request:", r.status_code)
r2 = c.get("/", HTTP_HOST="example.com.attacker.com")
print("look-alike host -> 400:", r2.status_code)`,
        output: `allowed host: 200
another allowed host: 200
spoofed host -> 400 Bad Request: 400
look-alike host -> 400: 400
`,
        explain: "With DEBUG=False, Django validates the Host header of every request against ALLOWED_HOSTS. Requests for api.example.com / example.com pass; a spoofed Host (evil.attacker.com) or a look-alike (example.com.attacker.com) is rejected with 400 Bad Request before the view runs. An unvalidated Host enables cache poisoning and password-reset links that point at the attacker's domain -- which is why ALLOWED_HOSTS must be an explicit list, never [] or ['*'].",
        explainHi: 'DEBUG=False ke saath, Django har request ke Host header ko ALLOWED_HOSTS ke khilaf validate karta hai. api.example.com / example.com ke liye requests pass; ek spoofed Host ya ek look-alike view chalne se pehle 400 Bad Request se reject hota hai. Ek unvalidated Host cache poisoning aur password-reset links jo attacker ke domain par point karein enable karta hai.',
      },
      {
        title: 'BOLA/IDOR: the same fix as Modules 4-6 -- scope get_queryset, 404 not 403',
        titleHi: 'BOLA/IDOR: Modules 4-6 jaisा hi fix -- get_queryset scope karो, 404 not 403',
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

class BankAccount(models.Model):
    holder = models.ForeignKey(User, on_delete=models.CASCADE)
    balance_cents = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(BankAccount)
ada = User.objects.create_user("ada"); mallory = User.objects.create_user("mallory")
BankAccount.objects.create(holder=ada, balance_cents=500000)          # id 1
BankAccount.objects.create(holder=mallory, balance_cents=100)         # id 2

class AccountSer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = ["id", "balance_cents"]

class VulnerableViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BankAccount.objects.all()                              # NOT scoped -- the BOLA bug
    serializer_class = AccountSer

class FixedViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AccountSer
    def get_queryset(self):
        return BankAccount.objects.filter(holder=self.request.user)   # scoped to the requester

router = SimpleRouter()
router.register("vuln", VulnerableViewSet, basename="vuln")
router.register("fixed", FixedViewSet, basename="fixed")
urlpatterns = router.urls

c = APIClient(); c.force_authenticate(mallory)                        # mallory is logged in as herself
print("VULN: mallory reads ada's account by guessing id 1:", c.get("/vuln/1/").json())
print("FIXED: mallory reads ada's account -> 404 (not in her queryset):", c.get("/fixed/1/").status_code)
print("FIXED: mallory's own list:", c.get("/fixed/").json())`,
        output: `VULN: mallory reads ada's account by guessing id 1: {'id': 1, 'balance_cents': 500000}
FIXED: mallory reads ada's account -> 404 (not in her queryset): 404
FIXED: mallory's own list: [{'id': 2, 'balance_cents': 100}]
`,
        explain: "BOLA / IDOR -- the #1 API vulnerability -- is the same problem and the same fix as Modules 4-6. VulnerableViewSet has queryset = BankAccount.objects.all(), so mallory (logged in as herself) reads ada's account balance just by requesting id 1. FixedViewSet scopes get_queryset() to holder=self.request.user: the list is scoped, and ada's account is a 404 for mallory (not in her queryset) -- a 404 rather than a 403 because 403 would confirm the object exists.",
        explainHi: 'BOLA / IDOR -- #1 API vulnerability -- wahi problem aur wahi fix hai jaise Modules 4-6. VulnerableViewSet ke paas queryset = BankAccount.objects.all() hai, toh mallory ada ka account balance bas id 1 maangkar padhti hai. FixedViewSet get_queryset() ko holder=self.request.user par scope karta hai: list scoped hai, aur ada ka account mallory ke liye ek 404 hai (403 nahi).',
      },
    ],

    mistakes: [
      {
        wrong: `# settings.py -- one file for everything
SECRET_KEY = "django-insecure-x8f...actual-key-here"
DEBUG = True
ALLOWED_HOSTS = ["*"]
# committed to git, deployed as-is`,
        right: `# settings/base.py
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",")
DEBUG = os.environ.get("DJANGO_DEBUG", "") == "1"
# settings/prod.py imports base, adds SECURE_* ; run: manage.py check --deploy --settings=settings.prod`,
        why: 'A single settings file with a hard-coded key, `DEBUG = True`, and `ALLOWED_HOSTS = ["*"]` committed to git is three of the top misconfigurations at once: the key is compromised the moment it is pushed, `DEBUG` leaks everything on any error, and `["*"]` disables Host validation. Split settings by environment, read secrets from the environment, and gate the production file with `check --deploy` in CI.',
        whyHi: 'Ek single settings file ek hard-coded key, `DEBUG = True`, aur `ALLOWED_HOSTS = ["*"]` git mein committed teen top misconfigurations ek saath hai: key push hote hi compromised hai, `DEBUG` kisi bhi error par sab leak karता hai, aur `["*"]` Host validation disable karता hai. Settings ko environment se split karो, secrets environment se padhо.',
      },
      {
        wrong: `# a webhook-registration endpoint
def register_webhook(request):
    url = request.data["callback_url"]
    requests.post(url, json={"ping": True})   # SSRF: attacker sends url = http://169.254.169.254/...
    # -> your server fetches cloud metadata / an internal admin panel and returns the body`,
        right: `from urllib.parse import urlparse
import ipaddress, socket

def safe_external_url(url):
    p = urlparse(url)
    if p.scheme not in ("https",):
        raise ValidationError("https only")
    ip = ipaddress.ip_address(socket.gethostbyname(p.hostname))
    if ip.is_private or ip.is_loopback or ip.is_link_local:
        raise ValidationError("target not allowed")
    return url
# + disable redirects, set a short timeout, ideally route through an egress allowlist proxy`,
        why: 'Any endpoint that fetches a URL the user controls (webhook target, "import from URL", avatar URL, link preview) is an SSRF vector: an attacker points it at `http://169.254.169.254/` (AWS/GCP metadata — often leaks credentials), `http://localhost:<admin-port>/`, or an internal service. Validate the scheme, resolve the hostname and reject private/loopback/link-local IPs, disable redirect-following, set a timeout, and prefer a dedicated egress proxy with an allowlist.',
        whyHi: 'Koi bhi endpoint jо ek user-controlled URL fetch karता hai (webhook target, "import from URL", avatar URL) ek SSRF vector hai: ek attacker ise `http://169.254.169.254/` (AWS/GCP metadata) ya ek internal service par point karता hai. Scheme validate karो, hostname resolve karके private/loopback IPs reject karो, redirect-following disable karो, ek timeout set karो.',
      },
      {
        wrong: `# API v1 shipped 3 years ago, v2 is current
# v1's URLs are still routed, its code still deployed, its dependencies never updated
# an attacker finds /api/v1/users/ still returns email + phone that v2 removed`,
        right: `# keep a written inventory: which versions are live, who uses them, sunset date
# put Deprecation + Sunset response headers on v1
# same auth/permission/serializer review applied to v1 as v2 -- or turn v1 off`,
        why: 'Old API versions that are still routed but no longer maintained (OWASP API9) accumulate risk: they miss the security fixes and field-exposure changes made in newer versions, their dependencies rot, and they are often forgotten in security reviews. Either hold every live version to the same standard (auth, permissions, serializer fields, patched deps) or decommission it on a published schedule.',
        whyHi: 'Purane API versions jо abhi bhi routed hain par ab maintained nahi (OWASP API9) risk jamा karते hain: wo naye versions mein kiye security fixes miss karте hain, unki dependencies sadती hain, aur wo aksar security reviews mein bhool jाते hain. Ya har live version ko same standard par rakhо ya ek published schedule par decommission karो.',
      },
    ],

    realWorld: [
      {
        en: '**`manage.py check --deploy --fail-level WARNING` in the CI pipeline** — a PR that regresses a security setting (someone flips `DEBUG` in the wrong file, drops `SECURE_SSL_REDIRECT`) fails the build before merge. Paired with `settings/prod.py` as an explicit target.',
        hi: '**CI pipeline mein `manage.py check --deploy --fail-level WARNING`** — ek PR jо ek security setting regress karता hai merge se pehle build fail karता hai.',
      },
      {
        en: '**A "security review" checklist item on every new-endpoint PR** — is `get_queryset` scoped? Are serializer `fields` explicit (no `"__all__"`)? Is `permission_classes` set (not relying on the default by accident)? Is there a throttle if it is expensive or an auth flow? Four questions, catches most of the OWASP list.',
        hi: '**Har naye-endpoint PR par ek "security review" checklist item** — kya `get_queryset` scoped hai? Kya serializer `fields` explicit hain? Kya `permission_classes` set hai? Kya ek throttle hai? Chaar sawal.',
      },
      {
        en: '**Secrets in AWS Secrets Manager / SSM, injected as env vars at container start; `pip-audit` + Dependabot on the repo** — `SECRET_KEY`, DB URL, third-party API keys never touch git; a weekly job flags vulnerable dependencies; a committed secret triggers an alert and a rotation runbook.',
        hi: '**Secrets AWS Secrets Manager / SSM mein, container start par env vars ke roop mein injected; repo par `pip-audit` + Dependabot** — `SECRET_KEY`, DB URL, third-party API keys kabhi git ko nahi chhoote.',
      },
    ],

    interviewQA: [
      {
        q: 'What does `manage.py check --deploy` check, and what are the settings you must get right for a production Django deployment?',
        qHi: '`manage.py check --deploy` kya check karता hai, aur ek production Django deployment ke liye aapको kaunसी settings sahi karni chahिए?',
        a: 'check --deploy runs the security check group against your settings, ideally the production settings module, and prints a warning with a code and a fix for each unsafe or missing value. The ones that matter most: DEBUG must be False — with it on, any unhandled exception renders a page containing the full traceback, local variables which often hold secrets, every setting, and the SQL that ran, and it also disables Host-header validation. SECRET_KEY must be at least fifty random characters loaded from the environment, never committed, because it signs sessions, the CSRF token, password-reset links, and JWTs; if it leaks, all of those can be forged. ALLOWED_HOSTS must be an explicit list of your real domains — empty or star disables the Host-header check, which enables cache poisoning and password-reset link poisoning. For HTTPS: SECURE_SSL_REDIRECT to bounce plain HTTP, SECURE_HSTS_SECONDS with include-subdomains and preload to tell browsers to refuse HTTP for the domain, and if you are behind a TLS-terminating proxy, SECURE_PROXY_SSL_HEADER set to the X-Forwarded-Proto header — but only if the proxy strips any client-supplied value. For cookies: SESSION_COOKIE_SECURE and CSRF_COOKIE_SECURE so they never travel over plain HTTP, SESSION_COOKIE_HTTPONLY on, and SESSION_COOKIE_SAMESITE at least Lax. Plus SECURE_CONTENT_TYPE_NOSNIFF, X_FRAME_OPTIONS set to DENY for clickjacking, and CSRF_TRUSTED_ORIGINS if you use session auth across subdomains. The practical advice is to split settings by environment, read every secret from an environment variable or a secrets manager, and wire check --deploy into CI with a failure threshold so a regression cannot merge.',
        aHi: 'check --deploy security check group ko aapki settings ke khilaf chalाता hai, ideally production settings module, aur har unsafe ya missing value ke liye ek code aur ek fix ke saath ek warning print karता hai. Jо sabse zyada maayne rakhती hain: DEBUG False hona chahिए — iske on hone se, koi bhi unhandled exception ek page render karता hai jismें full traceback, local variables jо aksar secrets rakhते hain, har setting, aur chalा SQL hoता hai. SECRET_KEY kam se kam pachas random characters hona chahिए environment se load, kabhi committed nahi. ALLOWED_HOSTS aapke asli domains ki ek explicit list honi chahिए. HTTPS ke liye: SECURE_SSL_REDIRECT, SECURE_HSTS_SECONDS include-subdomains aur preload ke saath, aur agar aap ek proxy ke peeche ho, SECURE_PROXY_SSL_HEADER. Cookies ke liye: SESSION_COOKIE_SECURE aur CSRF_COOKIE_SECURE. Plus SECURE_CONTENT_TYPE_NOSNIFF, X_FRAME_OPTIONS DENY. Settings ko environment se split karो, har secret ek env var se padhо, aur check --deploy ko CI mein wire karो.',
      },
      {
        q: 'Which OWASP API risk is most common, and how do Django/DRF features address it?',
        qHi: 'Kaunसी OWASP API risk sabse aam hai, aur Django/DRF features ise kaise address karते hain?',
        a: 'The most common by a wide margin is Broken Object Level Authorization, also called BOLA or IDOR — Insecure Direct Object Reference. The pattern: an endpoint like GET slash orders slash id returns the order for that id without checking that the id belongs to the caller, so user A changes the id in the URL and reads user B\'s order. It is common because the happy path — the user viewing their own resource — works perfectly, and the vulnerability only shows up when someone deliberately tampers with the identifier. Django and DRF address it in layers that this course has built up. First and most important, get_queryset on the view is scoped to the requester — Order dot objects dot filter with customer equals request dot user — so the list action only ever returns the caller\'s rows, and the retrieve, update, and destroy actions look up the URL id within that scoped queryset, which means someone else\'s id is simply not found and returns a 404. A 404 rather than a 403 is deliberate: a 403 confirms the object exists, which itself leaks information. Second, an object-level permission via has_object_permission is added as defence in depth on the mutation actions, re-checking ownership on the instance DRF loads. Third, on create, perform_create stamps the owner from request dot user rather than trusting a field in the request body, so a user cannot create a resource owned by someone else. The key insight is that has_object_permission alone is not enough because it never runs for the list action — the queryset scope is the primary control and the object permission is the backup. The failure in practice is inconsistency: thirty-nine endpoints scope get_queryset and the fortieth forgets, so a code-review checklist that asks "is get_queryset scoped" on every new endpoint is worth more than any scanner.',
        aHi: 'Sabse aam, kaafi antar se, Broken Object Level Authorization hai, jise BOLA ya IDOR bhi kehते hain. Pattern: GET slash orders slash id jaisा ek endpoint us id ke liye order lautाता hai bina check kiye ki id caller ka hai, toh user A URL mein id badalता hai aur user B ka order padhता hai. Ye aam hai kyunki happy path perfectly kaam karता hai, aur vulnerability sirf tab dikhती hai jab koi jaanbujhкар identifier ke saath cheड़chहड़ karता hai. Django aur DRF ise layers mein address karते hain. Pehla aur sabse mahatvapoorn, view par get_queryset requester tak scoped hai — Order dot objects dot filter customer equals request dot user ke saath — toh list action sirf caller ki rows lautाता hai, aur retrieve, update, destroy actions URL id ko us scoped queryset ke andar lookup karते hain, jiska matlab kisi aur ka id nahi milता aur ek 404 lautाता hai. Ek 403 ke bजाy ek 404 jaanbujhкар hai. Doosra, has_object_permission ke zariye ek object-level permission defence in depth ke roop mein add kiya jाता hai. Teesra, create par, perform_create request body mein ek field trust karने ke bजाy request dot user se owner stamp karता hai. Mukhya samajh ye hai ki has_object_permission akelе kaafi nahi kyunki ye list action ke liye kabhi nahi chalता.',
      },
    ],

    exercises: [
      {
        task: 'Write two settings modules as strings and check them with `subprocess`. `unsafe`: `SECRET_KEY = "django-insecure-x"`, `DEBUG = True`, `ALLOWED_HOSTS = ["*"]`. `hardened`: a 60-char `SECRET_KEY`, `DEBUG = False`, real `ALLOWED_HOSTS`, plus `SECURE_SSL_REDIRECT`, `SECURE_HSTS_SECONDS`, `SECURE_HSTS_INCLUDE_SUBDOMAINS`, `SECURE_HSTS_PRELOAD`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SECURE_CONTENT_TYPE_NOSNIFF`, `X_FRAME_OPTIONS = "DENY"`. Run `python -m django check --deploy` against each (via `DJANGO_SETTINGS_MODULE` + `PYTHONPATH`) and assert the unsafe one emits `security.W009`/`W018`/`W020` (among others) and the hardened one emits none.',
        taskHi: 'Do settings modules strings ke roop mein likhо aur `subprocess` se check karो. `unsafe` aur `hardened`. Har ek ke khilaf `python -m django check --deploy` chalाओ aur assert karो `unsafe` `security.W009`/`W018`/`W020` emit karता hai aur `hardened` koi nahi.',
        hint: 'Write files to `tempfile.mkdtemp()`, set `env = dict(os.environ, DJANGO_SETTINGS_MODULE="unsafe_settings", PYTHONPATH=d)`, `subprocess.run([sys.executable, "-m", "django", "check", "--deploy"], capture_output=True, text=True, env=env)`. Parse `(security.Wxxx)` tokens from `p.stdout`.',
        hintHi: 'Files `tempfile.mkdtemp()` mein likhо, `env = dict(os.environ, DJANGO_SETTINGS_MODULE="unsafe_settings", PYTHONPATH=d)`, `subprocess.run([sys.executable, "-m", "django", "check", "--deploy"], ...)`. `(security.Wxxx)` tokens parse karो.',
      },
      {
        task: 'Demonstrate `ALLOWED_HOSTS`. `settings.configure(DEBUG=False, SECRET_KEY="k"*60, ALLOWED_HOSTS=["example.com", "api.example.com"], ...)`. One view returning `request.get_host()`. With `django.test.Client`: `HTTP_HOST="api.example.com"` -> `200`; `HTTP_HOST="example.com"` -> `200`; `HTTP_HOST="attacker.com"` -> `400`; `HTTP_HOST="example.com.attacker.com"` -> `400`. Add a one-line comment explaining what a spoofed Host enables (password-reset link poisoning, cache poisoning).',
        taskHi: '`ALLOWED_HOSTS` dikhाओ. `settings.configure(DEBUG=False, SECRET_KEY="k"*60, ALLOWED_HOSTS=["example.com", "api.example.com"], ...)`. Ek view `request.get_host()` lautाता. `Client` se 4 Host values assert karो. Comment mein spoofed Host ka khatrा samjhाओ.',
        hint: '`DEBUG` must be `False` for `ALLOWED_HOSTS` to be enforced by the test client. `c.get("/", HTTP_HOST="attacker.com")` -> `.status_code == 400`. `JsonResponse` + `request.get_host()`.',
        hintHi: '`ALLOWED_HOSTS` enforce hone ke liye `DEBUG` `False` hona chahिए. `c.get("/", HTTP_HOST="attacker.com")` -> `400`.',
      },
      {
        task: 'BOLA/IDOR. Model `Document` (`owner` FK User, `secret` text). `VulnViewSet(ReadOnlyModelViewSet)` with `queryset = Document.objects.all()`; `SafeViewSet(ReadOnlyModelViewSet)` with `get_queryset` = `Document.objects.filter(owner=self.request.user)`. Seed a doc for `alice` and one for `bob`. As `bob` (`force_authenticate`): assert `GET /vuln/<alice_doc_id>/` returns alice\'s secret (the vulnerability); `GET /safe/<alice_doc_id>/` -> `404`; `GET /safe/` returns only bob\'s doc. Comment: why `404` and not `403`.',
        taskHi: 'BOLA/IDOR. `Document` (`owner` FK, `secret`) model karो. `VulnViewSet` (`queryset = Document.objects.all()`) aur `SafeViewSet` (scoped `get_queryset`). `alice` aur `bob` ke liye docs. `bob` ke roop mein assert karो. Comment: `404` `403` kyun nahi.',
        hint: '`c.force_authenticate(bob)` (no auth backend needed). Vuln viewset leaks because `retrieve` reads `queryset` directly. Safe viewset: alice\'s doc is not in bob\'s `get_queryset()` -> `get_object()` raises `Http404`. A `403` would confirm the doc exists.',
        hintHi: '`c.force_authenticate(bob)`. Vuln viewset leak karता hai. Safe viewset: alice ka doc bob ke `get_queryset()` mein nahi -> `Http404`. Ek `403` doc ke maujूd hone ki pushti karता.',
      },
    ],

    keyTakeaways: [
      '`python manage.py check --deploy` is a mechanical audit of production settings — run it against the prod settings module and wire `--fail-level WARNING` into CI so a regression fails the build.',
      '`DEBUG = False` in every non-local environment, non-negotiable: `DEBUG = True` renders the full traceback + local vars (secrets) + all settings + SQL on every 500, and disables `ALLOWED_HOSTS`.',
      '`SECRET_KEY`: >= 50 random chars, from an env var / secrets manager, NEVER committed (rotate if it ever was — this logs everyone out). It signs sessions, CSRF tokens, password-reset links, JWTs.',
      '`ALLOWED_HOSTS`: an explicit list of real domains. `[]` or `["*"]` disables Host-header validation -> cache poisoning + password-reset link poisoning. Behind a TLS proxy: `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")` (only if the proxy strips client values).',
      'HTTPS block: `SECURE_SSL_REDIRECT`, `SECURE_HSTS_SECONDS` (+ `INCLUDE_SUBDOMAINS`, `PRELOAD`), `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SECURE_CONTENT_TYPE_NOSNIFF`, `X_FRAME_OPTIONS = "DENY"`, `SESSION_COOKIE_SAMESITE`, `CSRF_TRUSTED_ORIGINS` (for cross-subdomain session auth).',
      'OWASP API Top 10 maps onto things you already know: API1 BOLA/IDOR -> `get_queryset` scoping + `has_object_permission` + `404` not `403`; API3 data leak -> explicit serializer `fields` + write serializer; API4 -> pagination + throttling; API5 -> per-action permissions; API8 -> `check --deploy`.',
      'API7 SSRF: any endpoint that fetches a user-supplied URL — validate the scheme, resolve the host and reject private/loopback/link-local IPs (`169.254.169.254` = cloud metadata), disable redirects, timeout, egress allowlist.',
      'Security in Django/DRF is CONSISTENCY, not exotic tooling. The failure is one endpoint of forty forgetting the `get_queryset` scope, or one serializer using `"__all__"`. A per-PR checklist ("scoped queryset? explicit fields? permissions set? throttle?") + `check --deploy` in CI + `pip-audit` + secrets from env beats any single scanner.',
    ],
    keyTakeawaysHi: [
      '`python manage.py check --deploy` production settings ka ek mechanical audit hai — ise prod settings module ke khilaf chalाओ aur `--fail-level WARNING` ko CI mein wire karो.',
      'Har non-local environment mein `DEBUG = False`, non-negotiable: `DEBUG = True` har 500 par full traceback + local vars (secrets) + saari settings + SQL render karता hai, aur `ALLOWED_HOSTS` disable karता hai.',
      '`SECRET_KEY`: >= 50 random chars, ek env var / secrets manager se, KABHI committed nahi (agar tha toh rotate karो). Ye sessions, CSRF tokens, password-reset links, JWTs sign karता hai.',
      '`ALLOWED_HOSTS`: asli domains ki ek explicit list. `[]` ya `["*"]` Host-header validation disable karता hai -> cache poisoning + password-reset link poisoning. Ek TLS proxy ke peeche: `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")`.',
      'HTTPS block: `SECURE_SSL_REDIRECT`, `SECURE_HSTS_SECONDS` (+ `INCLUDE_SUBDOMAINS`, `PRELOAD`), `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SECURE_CONTENT_TYPE_NOSNIFF`, `X_FRAME_OPTIONS = "DENY"`, `CSRF_TRUSTED_ORIGINS`.',
      'OWASP API Top 10 wo cheezein hain jо aap pehle se jaanते ho: API1 BOLA/IDOR -> `get_queryset` scoping + `has_object_permission` + `404` not `403`; API3 data leak -> explicit serializer `fields` + write serializer; API4 -> pagination + throttling; API5 -> per-action permissions; API8 -> `check --deploy`.',
      'API7 SSRF: koi bhi endpoint jо ek user-supplied URL fetch karता hai — scheme validate karो, host resolve karके private/loopback IPs reject karो (`169.254.169.254` = cloud metadata), redirects disable, timeout.',
      'Django/DRF mein security CONSISTENCY hai, exotic tooling nahi. Failure chालीs mein se ek endpoint `get_queryset` scope bhoolना hai, ya ek serializer `"__all__"` istemal karna. Ek per-PR checklist + CI mein `check --deploy` + `pip-audit` + env se secrets kisi bhi single scanner se behtar hai.',
    ],
  },
];
