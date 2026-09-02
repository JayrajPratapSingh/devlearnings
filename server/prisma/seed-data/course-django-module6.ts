/**
 * Django Complete Course — Module 6: Auth, Permissions & API Security, lessons 1-3.
 *
 * Lesson 1: authentication — how request.user is set, authentication_classes,
 *           SessionAuthentication (+CSRF) vs TokenAuthentication vs Basic, the
 *           authenticate() contract, request.auth, 401 vs 403, WWW-Authenticate.
 * Lesson 2: JWT with djangorestframework-simplejwt — access + refresh, the three
 *           views, JWTAuthentication, claims, expiry / rotation / blacklist, the
 *           stateless trade-offs, SIMPLE_JWT settings.
 * Lesson 3: the custom user model — AUTH_USER_MODEL set BEFORE the first migrate,
 *           AbstractUser (add fields) vs AbstractBaseUser + PermissionsMixin
 *           (USERNAME_FIELD / REQUIRED_FIELDS / custom manager), get_user_model()
 *           and settings.AUTH_USER_MODEL in FKs, why day one.
 *
 * NOTE for future editors: same conventions as course-django-module5.ts.
 *  - Every backtick inside simple/simpleHi/content/contentHi is `\``; `\${` for `$`+`{`.
 *  - `examples` use `code` + `output`, ASCII-only output, run with the auto-detected python.
 *  - DRF boots standalone. A standalone example with APIClient MUST include
 *    "django.contrib.auth" in INSTALLED_APPS (DRF touches request.user).
 *  - JWT examples: SECRET_KEY must be >= 32 bytes or PyJWT prints an InsecureKeyLengthWarning.
 *  - Scan for Devanagari/Cyrillic in en/code. `npx tsc --noEmit -p .` from server/.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_6: CourseLesson[] = [
  {
    slug: 'dj-drf-authentication',
    title: 'Authentication: How `request.user` Gets Set',
    titleHi: 'Authentication: `request.user` Kaise Set Hoता Hai',
    description: 'Authentication answers one question: *who is making this request?* DRF runs its `authentication_classes` in order; the first that recognises the credentials returns `(user, auth)` and populates `request.user` and `request.auth`. If none do, `request.user` is `AnonymousUser`. Authentication never decides *if you are allowed* — that is permissions (lesson 4).',
    descriptionHi: 'Authentication ek sawal ka jawab deता hai: *ye request kaun bhej raha hai?* DRF apni `authentication_classes` order mein chalाता hai; pehla jо credentials ko pehchानता hai `(user, auth)` lautाता hai aur `request.user` aur `request.auth` populate karता hai. Agar koi nahi, `request.user` `AnonymousUser` hai. Authentication kabhi tay nahi karता *kya aapko anumati hai* — wo permissions hai (lesson 4).',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: '**The ID check at a building lobby — not the access-control list.** When you walk in, the guard checks *how you are identifying yourself*: a company badge you tap (session cookie), a visitor pass with a code (an API token), a name-and-PIN read aloud (HTTP Basic), or a signed day-pass with an expiry printed on it (a JWT). The guard tries each method they are equipped to read, in order; the first one that produces a valid identity wins, and now they know "this is Ada from Engineering" and write it on your sticker (`request.user`) along with which credential you used (`request.auth`). If nothing checks out, you are simply "unidentified visitor" (`AnonymousUser`) — not thrown out yet. Whether unidentified visitors, or Ada specifically, may enter the third-floor server room is a *different* list the guard consults afterwards (permissions). And a subtle point: a bad badge that the reader cannot even parse gets you a "please authenticate properly" (401); a valid badge for someone who is just not on the server-room list gets you a "you personally cannot go there" (403).',
      hi: '**Ek building lobby par ID check — access-control list nahi.** Jab aap andar aaते ho, guard check karता hai *aap khud ko kaise identify kar rahe ho*: ek company badge jо aap tap karते ho (session cookie), ek visitor pass ek code ke saath (ek API token), ek naam-aur-PIN zor se padhा gaya (HTTP Basic), ya ek signed day-pass jispar expiry chhpी ho (ek JWT). Guard har method try karता hai jise wo padhने ke liye equipped hai, order mein; pehla jо ek valid identity produce karता hai jeetता hai, aur ab wo jaanते hain "ye Engineering ki Ada hai" aur ise aapke sticker par likhते hain (`request.user`) plus aapne kaunsा credential istemal kiya (`request.auth`). Agar kuch check nahi hoता, aap bस "unidentified visitor" ho (`AnonymousUser`) — abhi tak nikaale nahi gaye. Kya unidentified visitors, ya khaskार Ada, teesri manzil ke server room mein jа sakte hain wo ek *alag* list hai (permissions). Aur ek sूkshm baat: ek bura badge jise reader parse bhi nahi kar sakta aapko "kripya sahi tarike se authenticate karें" (401) deता hai; kisi ke liye ek valid badge jо bस server-room list par nahi hai aapko "aap vyaktigat roop se wahaan nahi jа sakte" (403) deता hai.',
    },

    simple: `**Where it runs**

\`\`\`python
# every DRF view, before your handler:
#   for auth_class in view.authentication_classes:
#       result = auth_class().authenticate(request)      # -> (user, auth) | None | raise AuthenticationFailed
#       if result is not None:
#           request.user, request.auth = result
#           break
#   else:
#       request.user = AnonymousUser(); request.auth = None
\`\`\`

**Configure — project default + per-view override**

\`\`\`python
# settings.py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",   # browser / same-site
        "rest_framework.authentication.TokenAuthentication",     # mobile / server-to-server
    ],
}
\`\`\`

\`\`\`python
from rest_framework.authentication import TokenAuthentication, SessionAuthentication

class ReportView(APIView):
    authentication_classes = [TokenAuthentication]     # this view: token only
    permission_classes = [IsAuthenticated]
\`\`\`

**The built-in classes**

\`\`\`
SessionAuthentication    request.user from Django's session cookie.  ENFORCES CSRF on unsafe methods.
                         Use for a same-origin browser client / the browsable API.
TokenAuthentication      Header:  Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
                         DB-backed opaque token, one per user (rest_framework.authtoken).  No CSRF.
BasicAuthentication      Header:  Authorization: Basic <base64(user:pass)>.  HTTPS only.  Dev / scripts.
RemoteUserAuthentication request.META['REMOTE_USER'] set by an upstream (SSO, Kerberos).
JWTAuthentication        Header:  Authorization: Bearer <jwt>.  Stateless.  (simplejwt -- lesson 2)
\`\`\`

**Enabling \`TokenAuthentication\`**

\`\`\`python
INSTALLED_APPS = [..., "rest_framework.authtoken"]        # then migrate -> authtoken_token table
# create tokens:
from rest_framework.authtoken.models import Token
token, _ = Token.objects.get_or_create(user=user)         # token.key
# or the built-in view:
path("api-token-auth/", rest_framework.authtoken.views.obtain_auth_token)   # POST user/pass -> {"token": ...}
\`\`\`

**\`request.user\` / \`request.auth\` / 401 vs 403**

\`\`\`python
request.user           # the User instance, or AnonymousUser
request.user.is_authenticated    # True for a real user, False for AnonymousUser
request.auth           # the credential object: a Token instance, a validated JWT, None for session

# 401 Unauthorized  -> "you are not authenticated (or your credentials are bad)". Sets WWW-Authenticate.
#                      Returned when NO auth succeeded and a permission needs a user.
# 403 Forbidden     -> "you are authenticated, but not allowed to do this". (permissions -- lesson 4)
# DRF chooses: authenticated request that fails a permission -> 403 ; anonymous -> 401.
\`\`\`

\`\`\`
authenticate(request) contract:
  return (user, auth)   -> success ; request.user/request.auth set, loop stops
  return None           -> "not my kind of credential" ; DRF tries the next class
  raise AuthenticationFailed(...)  -> "my kind of credential, but invalid" ; 401 immediately, no fallthrough

authenticate_header(request) -> the WWW-Authenticate header value for a 401 (e.g. 'Token', 'Bearer realm="api"')
SessionAuthentication also runs the CSRF check on POST/PUT/PATCH/DELETE (Module 4 lesson 6)
put SessionAuthentication FIRST if you want the browsable API to work while also supporting tokens
\`\`\``,

    simpleHi: `**Kahaan chalता hai**

\`\`\`python
# har DRF view, aapke handler se pehle:
#   for auth_class in view.authentication_classes:
#       result = auth_class().authenticate(request)      # -> (user, auth) | None | raise AuthenticationFailed
#       if result is not None:
#           request.user, request.auth = result
#           break
#   else:
#       request.user = AnonymousUser(); request.auth = None
\`\`\`

**Configure — project default + per-view override**

\`\`\`python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",   # browser / same-site
        "rest_framework.authentication.TokenAuthentication",     # mobile / server-to-server
    ],
}
\`\`\`

\`\`\`python
class ReportView(APIView):
    authentication_classes = [TokenAuthentication]     # is view: sirf token
    permission_classes = [IsAuthenticated]
\`\`\`

**Built-in classes**

\`\`\`
SessionAuthentication    request.user Django ki session cookie se.  Unsafe methods par CSRF ENFORCE.
TokenAuthentication      Header:  Authorization: Token 9944b09199c62bcf...
                         DB-backed opaque token, prati user ek (rest_framework.authtoken).  Koi CSRF nahi.
BasicAuthentication      Header:  Authorization: Basic <base64(user:pass)>.  Sirf HTTPS.  Dev / scripts.
JWTAuthentication        Header:  Authorization: Bearer <jwt>.  Stateless.  (simplejwt -- lesson 2)
\`\`\`

**\`TokenAuthentication\` enable karna**

\`\`\`python
INSTALLED_APPS = [..., "rest_framework.authtoken"]        # phir migrate -> authtoken_token table
from rest_framework.authtoken.models import Token
token, _ = Token.objects.get_or_create(user=user)         # token.key
\`\`\`

**\`request.user\` / \`request.auth\` / 401 vs 403**

\`\`\`python
request.user           # User instance, ya AnonymousUser
request.user.is_authenticated    # asli user ke liye True, AnonymousUser ke liye False
request.auth           # credential object: ek Token instance, ek validated JWT, session ke liye None

# 401 Unauthorized  -> "aap authenticated nahi (ya credentials bure)". WWW-Authenticate set karता hai.
# 403 Forbidden     -> "aap authenticated ho, par ye karne ki anumati nahi". (permissions -- lesson 4)
# DRF chunता hai: authenticated request jо permission fail karता hai -> 403 ; anonymous -> 401.
\`\`\`

\`\`\`
authenticate(request) contract:
  return (user, auth)   -> safal ; request.user/request.auth set, loop rukता hai
  return None           -> "mera kism ka credential nahi" ; DRF agli class try karता hai
  raise AuthenticationFailed(...)  -> "mera kism, par invalid" ; turant 401, koi fallthrough nahi

SessionAuthentication POST/PUT/PATCH/DELETE par CSRF check bhi chalाता hai (Module 4 lesson 6)
SessionAuthentication ko PEHLE rakhо agar browsable API kaam kare aur tokens bhi support ho
\`\`\``,

    content: `## The flow

Before your view handler runs, DRF's \`APIView.initial()\` calls \`perform_authentication(request)\`, which walks \`view.authentication_classes\` and, for each, calls \`.authenticate(request)\`:

- **returns \`(user, auth)\`** → \`request.user\` and \`request.auth\` are set, the loop stops.
- **returns \`None\`** → "this is not a credential I handle" → DRF tries the next class.
- **raises \`AuthenticationFailed\`** → "this *is* my kind of credential, but it is invalid" → immediate \`401\`, no fallthrough.

If every class returns \`None\`, \`request.user\` is \`AnonymousUser()\` and \`request.auth\` is \`None\`. Note: \`request.user\` is **lazy** — the authentication actually runs the first time something accesses \`request.user\`.

## The built-in authenticators

### \`SessionAuthentication\`

Reads Django's session cookie (set at login via \`django.contrib.auth.login\`). This is what the **browsable API** and any same-origin JavaScript app use. Because it is cookie-based, it **enforces CSRF** on \`POST\`/\`PUT\`/\`PATCH\`/\`DELETE\` — your JS must send the \`X-CSRFToken\` header (Module 4 lesson 6). It does **not** send a \`WWW-Authenticate\` header or challenge; an unauthenticated request just gets \`403\` from the CSRF check or \`401\`/\`403\` from permissions.

### \`TokenAuthentication\`

A simple DB-backed scheme: one opaque token string per user in the \`authtoken_token\` table. The client sends \`Authorization: Token <key>\`. No CSRF (there is no ambient cookie). Enable with \`"rest_framework.authtoken"\` in \`INSTALLED_APPS\` + migrate; issue tokens via \`Token.objects.get_or_create(user=…)\` or the \`obtain_auth_token\` view. Good for mobile apps and scripts; downside is it is a single long-lived credential with no expiry and a DB hit per request.

### \`BasicAuthentication\`

\`Authorization: Basic <base64(username:password)>\` — the raw password on every request. **HTTPS only**, and really only for local development, \`curl\`, and internal scripts. Never for a browser app (the browser caches and re-sends it).

### \`JWTAuthentication\` (simplejwt — lesson 2)

\`Authorization: Bearer <jwt>\`. Stateless: the token is a signed JSON blob with an expiry; the server verifies the signature without a DB lookup. Short-lived access token + longer refresh token. The modern default for SPAs and mobile.

## Choosing

- **Same-origin browser app / the browsable API** → \`SessionAuthentication\`.
- **SPA on a different origin, or mobile** → JWT (\`simplejwt\`), or \`TokenAuthentication\` if you want it simpler and can accept non-expiring tokens.
- **Server-to-server / CI / webhooks** → a token (DRF token, or a JWT with a service account, or a dedicated API-key model).
- **Behind SSO** → \`RemoteUserAuthentication\` or a custom class reading the proxy's header.

You can list several — DRF tries each in order. A common combo is \`[SessionAuthentication, JWTAuthentication]\` so the browsable API works in dev *and* real clients use JWT. Put \`SessionAuthentication\` first if you want a logged-in developer to use the browsable API forms.

## 401 vs 403 — DRF's rule

- **\`401 Unauthorized\`** = "authenticate first" (or "your credentials are bad"). DRF returns this, with a \`WWW-Authenticate\` header from the first authenticator's \`authenticate_header()\`, when **no authentication succeeded** and a permission requires an authenticated user.
- **\`403 Forbidden\`** = "you *are* authenticated, but you may not do this". Returned when authentication succeeded but a permission check failed (lesson 4).

So the same \`IsAuthenticated\` permission produces \`401\` for an anonymous request and — it never produces \`403\` itself, but \`IsAdminUser\` would give \`403\` to a logged-in non-staff user. If you get a \`403\` where you expected \`401\`, an authenticator probably succeeded (e.g. \`SessionAuthentication\` matched a stale cookie).

## Writing a custom authenticator

\`\`\`python
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

class APIKeyAuthentication(BaseAuthentication):
    keyword = "Api-Key"

    def authenticate(self, request):
        header = request.headers.get("Authorization", "")
        if not header.startswith(self.keyword + " "):
            return None                                  # not our scheme -> let others try
        key = header[len(self.keyword) + 1:]
        try:
            api_key = APIKey.objects.select_related("user").get(key=key, revoked=False)
        except APIKey.DoesNotExist:
            raise AuthenticationFailed("Invalid API key.")   # our scheme, bad key -> 401
        return (api_key.user, api_key)

    def authenticate_header(self, request):
        return self.keyword                              # -> WWW-Authenticate: Api-Key
\`\`\`

Return \`None\` for "not mine" (so a fallthrough chain works); raise \`AuthenticationFailed\` only for "mine but broken". Always implement \`authenticate_header\` or an unauthenticated request gets \`403\` instead of \`401\`.`,

    contentHi: `## Flow

Aapke view handler chalने se pehle, DRF ka \`APIView.initial()\` \`perform_authentication(request)\` call karता hai, jо \`view.authentication_classes\` walk karता hai aur har ek ke liye \`.authenticate(request)\` call karता hai:

- **\`(user, auth)\` lautाता hai** → \`request.user\` aur \`request.auth\` set, loop rukता hai.
- **\`None\` lautाता hai** → "ye ek credential nahi jо main handle karता" → DRF agli class try karता hai.
- **\`AuthenticationFailed\` raise karता hai** → "ye *mera* kism ka credential hai, par invalid" → turant \`401\`, koi fallthrough nahi.

Agar har class \`None\` lautाती hai, \`request.user\` \`AnonymousUser()\` hai. \`request.user\` **lazy** hai — authentication asal mein tab chalता hai jab kuch pehli baar \`request.user\` access karता hai.

## Built-in authenticators

### \`SessionAuthentication\`

Django ki session cookie padhता hai. **Browsable API** aur koi same-origin JS app yahi istemal karते hain. Cookie-based hone se ye \`POST\`/\`PUT\`/\`PATCH\`/\`DELETE\` par **CSRF ENFORCE** karता hai — aapke JS ko \`X-CSRFToken\` header bhejना chahिए.

### \`TokenAuthentication\`

Ek saral DB-backed scheme: prati user ek opaque token. Client \`Authorization: Token <key>\` bhejता hai. Koi CSRF nahi. \`"rest_framework.authtoken"\` + migrate se enable karो. Mobile apps aur scripts ke liye achha; nuksaan ye ek single long-lived credential hai bina expiry ke aur prati request ek DB hit.

### \`BasicAuthentication\`

\`Authorization: Basic <base64(username:password)>\` — har request par raw password. **Sirf HTTPS**, aur sirf local development, \`curl\`, internal scripts ke liye.

### \`JWTAuthentication\` (simplejwt — lesson 2)

\`Authorization: Bearer <jwt>\`. Stateless: token ek signed JSON blob hai ek expiry ke saath; server signature verify karता hai bina DB lookup ke. SPAs aur mobile ke liye modern default.

## Chunna

- **Same-origin browser app / browsable API** → \`SessionAuthentication\`.
- **Ek alag origin par SPA, ya mobile** → JWT (\`simplejwt\`), ya \`TokenAuthentication\`.
- **Server-to-server / CI / webhooks** → ek token.
- **SSO ke peeche** → \`RemoteUserAuthentication\` ya ek custom class.

Aap kai list kar sakte ho — DRF har ek order mein try karता hai. Ek aam combo \`[SessionAuthentication, JWTAuthentication]\` hai.

## 401 vs 403 — DRF ka niyam

- **\`401 Unauthorized\`** = "pehle authenticate karो". DRF ise lautाता hai, ek \`WWW-Authenticate\` header ke saath, jab **koi authentication safal nahi hua** aur ek permission ko ek authenticated user chahिए.
- **\`403 Forbidden\`** = "aap *authenticated* ho, par ye nahi kar sakte". Jab authentication safal hua par ek permission check fail hua (lesson 4).

Agar aapको ek \`403\` milता hai jahaan aapne \`401\` expect kiya, ek authenticator shायद safal hua (jaise \`SessionAuthentication\` ek stale cookie se match hua).

## Ek custom authenticator likhna

\`\`\`python
class APIKeyAuthentication(BaseAuthentication):
    keyword = "Api-Key"
    def authenticate(self, request):
        header = request.headers.get("Authorization", "")
        if not header.startswith(self.keyword + " "):
            return None                                  # mera scheme nahi
        key = header[len(self.keyword) + 1:]
        try:
            api_key = APIKey.objects.select_related("user").get(key=key, revoked=False)
        except APIKey.DoesNotExist:
            raise AuthenticationFailed("Invalid API key.")
        return (api_key.user, api_key)
    def authenticate_header(self, request):
        return self.keyword
\`\`\`

"mera nahi" ke liye \`None\` return karो; "mera par toota" ke liye \`AuthenticationFailed\` raise karो. Hamesha \`authenticate_header\` implement karो warna ek unauthenticated request \`401\` ke bजाy \`403\` paता hai.`,

    examples: [
      {
        title: 'TokenAuthentication: no token -> 401, valid token -> request.user + request.auth',
        titleHi: 'TokenAuthentication: koi token nahi -> 401, valid token -> request.user + request.auth',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="test-secret-key-that-is-plenty-long-for-examples",
    ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth",
                    "rest_framework", "rest_framework.authtoken"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    REST_FRAMEWORK={
        "DEFAULT_AUTHENTICATION_CLASSES": ["rest_framework.authentication.TokenAuthentication"],
        "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"]})
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.contrib.auth.models import User
from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

class WhoAmI(APIView):
    def get(self, request):
        return Response({
            "user": request.user.username,
            "is_authenticated": request.user.is_authenticated,
            "auth_type": type(request.auth).__name__,
        })

urlpatterns = [path("me/", WhoAmI.as_view())]

ada = User.objects.create_user("ada", password="pw")
token = Token.objects.create(user=ada)

c = APIClient()
r0 = c.get("/me/")
print("no credentials:", r0.status_code, r0.json(), "| WWW-Authenticate:", r0.get("WWW-Authenticate"))

r1 = c.get("/me/", HTTP_AUTHORIZATION="Token deadbeefdeadbeef")
print("bad token:", r1.status_code, r1.json())

r2 = c.get("/me/", HTTP_AUTHORIZATION=f"Token {token.key}")
print("valid token:", r2.status_code, r2.json())`,
        output: `no credentials: 401 {'detail': 'Authentication credentials were not provided.'} | WWW-Authenticate: Token
bad token: 401 {'detail': 'Invalid token.'}
valid token: 200 {'user': 'ada', 'is_authenticated': True, 'auth_type': 'Token'}
`,
        explain: 'With DEFAULT_AUTHENTICATION_CLASSES = [TokenAuthentication] and IsAuthenticated, a request with no credentials never authenticates, so IsAuthenticated fails and DRF returns 401 with a WWW-Authenticate: Token header (from the authenticator\'s authenticate_header). A malformed token is TokenAuthentication\'s scheme but an invalid key, so it raises AuthenticationFailed -> 401 "Invalid token.". A real token sets request.user to the token\'s user and request.auth to the Token instance.',
        explainHi: 'DEFAULT_AUTHENTICATION_CLASSES = [TokenAuthentication] aur IsAuthenticated ke saath, bina credentials ki ek request kabhi authenticate nahi hoti, toh IsAuthenticated fail hoti hai aur DRF ek WWW-Authenticate: Token header ke saath 401 lautata hai. Ek malformed token ek invalid key hai, toh ye AuthenticationFailed raise karta hai -> 401. Ek real token request.user aur request.auth set karta hai.',
      },
      {
        title: 'A chain of authenticators: None falls through, AuthenticationFailed stops',
        titleHi: 'Authenticators ki ek chain: None fallthrough, AuthenticationFailed rokта hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="test-secret-key-that-is-plenty-long-for-examples",
    ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    REST_FRAMEWORK={"DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"]})
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.contrib.auth.models import User
from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.test import APIClient

LOG = []

class FirstAuth(BaseAuthentication):
    def authenticate(self, request):
        LOG.append("FirstAuth tried")
        if request.headers.get("X-First"):
            raise AuthenticationFailed("First says: bad")   # my scheme, invalid -> STOP, 401
        return None                                          # not mine -> fall through
    def authenticate_header(self, request):
        return "X-First"                                     # so DRF can form a 401 (not a 403)

class SecondAuth(BaseAuthentication):
    def authenticate(self, request):
        LOG.append("SecondAuth tried")
        if request.headers.get("X-Second") == "ok":
            return (User.objects.get(username="ada"), "second-token")
        return None
    def authenticate_header(self, request):
        return "X-Second"

class View(APIView):
    authentication_classes = [FirstAuth, SecondAuth]
    def get(self, request):
        return Response({"user": request.user.username, "auth": request.auth})

urlpatterns = [path("x/", View.as_view())]
User.objects.create_user("ada")
c = APIClient()

LOG.clear()
r = c.get("/x/", HTTP_X_SECOND="ok")
print("X-Second ok ->", r.status_code, r.json(), "| tried:", LOG)

LOG.clear()
r = c.get("/x/", HTTP_X_FIRST="1", HTTP_X_SECOND="ok")
print("X-First set ->", r.status_code, r.json(), "| tried:", LOG, "(SecondAuth never ran)")

LOG.clear()
r = c.get("/x/")
print("nothing ->", r.status_code, "| tried:", LOG)`,
        output: `X-Second ok -> 200 {'user': 'ada', 'auth': 'second-token'} | tried: ['FirstAuth tried', 'SecondAuth tried']
X-First set -> 401 {'detail': 'First says: bad'} | tried: ['FirstAuth tried'] (SecondAuth never ran)
nothing -> 401 | tried: ['FirstAuth tried', 'SecondAuth tried']
`,
        explain: 'DRF calls authenticate() on each class in order. FirstAuth returns None for a request with no X-First header -> DRF falls through to SecondAuth, which recognises X-Second: ok and returns (user, auth). When X-First is set, FirstAuth raises AuthenticationFailed -> DRF stops immediately with a 401 (its authenticate_header supplies the challenge) and SecondAuth never runs. When nothing matches, both return None, request.user is AnonymousUser, and IsAuthenticated produces the 401.',
        explainHi: 'DRF har class par order mein authenticate() call karta hai. FirstAuth bina X-First header ki request ke liye None return karta hai -> DRF SecondAuth par fall through karta hai. Jab X-First set hai, FirstAuth AuthenticationFailed raise karta hai -> DRF turant ek 401 ke saath rukta hai aur SecondAuth kabhi nahi chalta. Jab kuch match nahi karta, dono None return karte hain.',
      },
      {
        title: '401 vs 403: anonymous gets 401, wrong-role authenticated gets 403',
        titleHi: '401 vs 403: anonymous ko 401, galat-role authenticated ko 403',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="test-secret-key-that-is-plenty-long-for-examples",
    ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth",
                    "rest_framework", "rest_framework.authtoken"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES": ["rest_framework.authentication.TokenAuthentication"]})
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.contrib.auth.models import User
from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

class MembersOnly(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"ok": "members"})

class StaffOnly(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        return Response({"ok": "staff"})

urlpatterns = [path("members/", MembersOnly.as_view()), path("staff/", StaffOnly.as_view())]

ada = User.objects.create_user("ada", password="pw")            # not staff
boss = User.objects.create_user("boss", password="pw", is_staff=True)
ada_tok = Token.objects.create(user=ada).key
boss_tok = Token.objects.create(user=boss).key

c = APIClient()
print("anon -> /members/:", c.get("/members/").status_code, "(401: authenticate first)")
print("ada  -> /members/:", c.get("/members/", HTTP_AUTHORIZATION=f"Token {ada_tok}").status_code)
print("anon -> /staff/:  ", c.get("/staff/").status_code, "(401)")
print("ada  -> /staff/:  ", c.get("/staff/", HTTP_AUTHORIZATION=f"Token {ada_tok}").status_code,
      "(403: authenticated but not staff)")
print("boss -> /staff/:  ", c.get("/staff/", HTTP_AUTHORIZATION=f"Token {boss_tok}").status_code)`,
        output: `anon -> /members/: 401 (401: authenticate first)
ada  -> /members/: 200
anon -> /staff/:   401 (401)
ada  -> /staff/:   403 (403: authenticated but not staff)
boss -> /staff/:   200
`,
        explain: 'The same IsAuthenticated permission produces 401 for an anonymous request (authenticate first) but never 403. IsAdminUser (which checks is_staff) produces 403 for ada -- she is authenticated, so the fix is not "log in", it is "you personally may not". DRF\'s rule: no authentication succeeded + a permission needs a user -> 401; authentication succeeded but a permission failed -> 403. boss (is_staff=True) passes IsAdminUser -> 200.',
        explainHi: 'Wahi IsAuthenticated permission ek anonymous request ke liye 401 produce karta hai par kabhi 403 nahi. IsAdminUser (jo is_staff check karta hai) ada ke liye 403 produce karta hai -- wo authenticated hai. DRF ka niyam: koi auth safal nahi + ek permission ko user chahiye -> 401; auth safal par permission fail -> 403.',
      },
    ],

    mistakes: [
      {
        wrong: `class UploadView(APIView):
    authentication_classes = [SessionAuthentication]
    def post(self, request):
        ...
# a same-origin fetch POST fails with 403 "CSRF Failed" -- the JS did not send X-CSRFToken`,
        right: `# JS: read the csrftoken cookie, send it as a header on every mutating request
fetch("/api/upload/", {
    method: "POST",
    headers: {"X-CSRFToken": getCookie("csrftoken")},
    credentials: "same-origin",
    body: form,
})
# or, if the client is not a browser, use TokenAuthentication / JWT instead (no CSRF)`,
        why: '`SessionAuthentication` is cookie-based, so DRF enforces CSRF on unsafe methods exactly as for a Django form (Module 4 lesson 6). A `fetch`/AJAX client must read the `csrftoken` cookie and send it as `X-CSRFToken`. If the client is a mobile app or a different-origin SPA, do not use `SessionAuthentication` at all — use `TokenAuthentication` or JWT, which carry the credential in an `Authorization` header the browser never auto-attaches, so CSRF does not apply.',
        whyHi: '`SessionAuthentication` cookie-based hai, toh DRF unsafe methods par CSRF enforce karता hai bilkul ek Django form ki tarah. Ek `fetch`/AJAX client ko `csrftoken` cookie padhकर ise `X-CSRFToken` ke roop mein bhejना chahिए. Agar client ek mobile app ya alag-origin SPA hai, `SessionAuthentication` bilkul mat istemal karो — `TokenAuthentication` ya JWT istemal karो.',
      },
      {
        wrong: `class MyAuth(BaseAuthentication):
    def authenticate(self, request):
        key = request.headers.get("X-API-Key")
        if key != VALID_KEY:
            raise AuthenticationFailed("bad key")   # raises even when NO key was sent
        return (service_user, None)
# now EVERY request without an X-API-Key header is a hard 401 -- session/JWT auth never gets a turn`,
        right: `def authenticate(self, request):
    key = request.headers.get("X-API-Key")
    if key is None:
        return None                                # not our scheme -> let other authenticators try
    if key != VALID_KEY:
        raise AuthenticationFailed("bad key")      # our scheme, invalid -> 401
    return (service_user, None)`,
        why: 'A custom authenticator must return `None` when the request does not carry *its* kind of credential, so the rest of the `authentication_classes` chain still gets a chance. Raising `AuthenticationFailed` unconditionally makes your class a gate that rejects every request lacking its header — breaking session auth, JWT, and the browsable API. Raise only when the credential is present but invalid.',
        whyHi: 'Ek custom authenticator ko `None` return karna chahिए jab request *iska* kism ka credential nahi le jाता, taaki baaki `authentication_classes` chain ko mौkा mile. `AuthenticationFailed` bina shart raise karna aapki class ko ek gate banаता hai jо iske header ke bina har request reject karता hai. Sirf tab raise karो jab credential maujूd hai par invalid.',
      },
      {
        wrong: `# "why do anonymous requests get 403 instead of 401 on my API?"
class MyAuth(BaseAuthentication):
    def authenticate(self, request):
        ...
    # no authenticate_header() method`,
        right: `class MyAuth(BaseAuthentication):
    def authenticate(self, request):
        ...
    def authenticate_header(self, request):
        return "Bearer"        # or your scheme name -> DRF can now return a proper 401
`,
        why: 'DRF decides `401` vs `403` by asking the first authenticator for a `WWW-Authenticate` value via `authenticate_header()`. If no authenticator provides one, DRF cannot form a `401` challenge and falls back to `403` for unauthenticated requests — which confuses clients (a `403` says "your identity is known but forbidden"). Always implement `authenticate_header` on a custom authenticator.',
        whyHi: 'DRF `401` vs `403` tay karता hai pehle authenticator se `authenticate_header()` ke zariye ek `WWW-Authenticate` value maangकर. Agar koi authenticator ek nahi deता, DRF ek `401` challenge nahi banा sakta aur unauthenticated requests ke liye `403` par fall back karता hai — jо clients ko confuse karता hai. Ek custom authenticator par hamesha `authenticate_header` implement karो.',
      },
    ],

    realWorld: [
      {
        en: '**`DEFAULT_AUTHENTICATION_CLASSES = [SessionAuthentication, JWTAuthentication]`** — the browsable API works for a logged-in developer in dev, real SPA/mobile clients send `Authorization: Bearer`. `SessionAuthentication` first so the dev cookie wins for the HTML forms; JWT for everything else.',
        hi: '**`DEFAULT_AUTHENTICATION_CLASSES = [SessionAuthentication, JWTAuthentication]`** — browsable API dev mein ek logged-in developer ke liye kaam karता hai, asli SPA/mobile clients `Authorization: Bearer` bhejते hain.',
      },
      {
        en: '**A separate `APIKey` model for server-to-server callers** — a custom authenticator reading `Authorization: Api-Key <key>`, keys scoped to a service account with their own permission set, revocable, and logged. Distinct from user JWTs so you can rate-limit and audit machine traffic separately.',
        hi: '**Server-to-server callers ke liye ek alag `APIKey` model** — ek custom authenticator jо `Authorization: Api-Key <key>` padhता hai, keys ek service account tak scoped, revocable, aur logged.',
      },
      {
        en: '**Per-view `authentication_classes` override for a public endpoint** — most of the API requires auth via the default, but `GET /api/health/`, `GET /api/public/prices/`, and the JWT-obtain view set `authentication_classes = []` + `permission_classes = [AllowAny]` explicitly.',
        hi: '**Ek public endpoint ke liye per-view `authentication_classes` override** — zyादातर API ko default se auth chahिए, par `GET /api/health/` aur JWT-obtain view `authentication_classes = []` + `permission_classes = [AllowAny]` explicitly set karते hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through how DRF sets `request.user`, and what the three possible return values of `authenticate()` mean.',
        qHi: 'DRF `request.user` kaise set karता hai, aur `authenticate()` ke teen possible return values ka kya matlab hai?',
        a: 'Before the view handler runs, DRF\'s initial method calls perform_authentication, which is what actually triggers the work — request dot user is a lazy property, so authentication runs the first time anything reads it. DRF iterates the view\'s authentication_classes in order and calls authenticate on each instance, passing the request. There are three outcomes. If it returns a two-tuple of user and auth, DRF sets request dot user to that user and request dot auth to that auth object — which might be a token instance, a validated JWT, an API key row, whatever the scheme produced — and stops iterating. If it returns None, that means "this request does not carry the kind of credential I handle", and DRF moves on to the next authenticator, so a fallthrough chain works. If it raises AuthenticationFailed, that means "this is my kind of credential but it is invalid" — a bad token, an expired JWT — and DRF stops immediately and returns a 401, it does not try the remaining classes. If every authenticator returns None, request dot user becomes an AnonymousUser instance and request dot auth is None. Crucially, none of this decides whether the request is allowed — authentication only establishes identity. Permission classes run afterwards and decide access, and they are what turn an anonymous request into a 401 or an authenticated-but-not-allowed request into a 403. DRF picks between 401 and 403 by asking the first authenticator for a WWW-Authenticate header value via authenticate_header; if it gets one and no auth succeeded, it is a 401, otherwise a 403.',
        aHi: 'View handler chalने se pehle, DRF ka initial method perform_authentication call karता hai — request dot user ek lazy property hai, toh authentication tab chalता hai jab kuch pehli baar ise padhता hai. DRF view ke authentication_classes ko order mein iterate karता hai aur har instance par authenticate call karता hai. Teen parinaम hain. Agar ye user aur auth ka ek two-tuple return karता hai, DRF request dot user ko us user par set karता hai aur request dot auth ko us auth object par, aur iterate karna rok deता hai. Agar ye None return karता hai, iska matlab "ye request us kism ka credential nahi le jाती jise main handle karता hoon", aur DRF agle authenticator par jाता hai. Agar ye AuthenticationFailed raise karता hai, iska matlab "ye mera kism ka credential hai par invalid" — aur DRF turant rukता hai aur ek 401 lautाता hai. Agar har authenticator None return karता hai, request dot user ek AnonymousUser instance ban jाता hai. Ye kuch bhi tay nahi karता ki request allowed hai — authentication sirf identity establish karता hai.',
      },
      {
        q: 'When would you use `SessionAuthentication`, `TokenAuthentication`, and JWT, and what is the CSRF implication of each?',
        qHi: 'Aap `SessionAuthentication`, `TokenAuthentication`, aur JWT kab istemal karोge, aur har ek ka CSRF implication kya hai?',
        a: 'SessionAuthentication reads Django\'s session cookie, set when the user logs in through the normal auth machinery. You use it for a same-origin browser client — a server-rendered app with sprinkles of JavaScript, or the DRF browsable API itself. Because it relies on an ambient cookie the browser attaches automatically, it is exactly the situation CSRF attacks exploit, so DRF enforces the CSRF check on POST, PUT, PATCH, and DELETE: your JavaScript has to read the csrftoken cookie and send it as an X-CSRFToken header. TokenAuthentication is a database-backed scheme — one opaque token string per user in a table — sent as an Authorization Token header. You use it for mobile apps and scripts when you want something simple and are willing to live with a single non-expiring credential and a database lookup per request. There is no CSRF concern because the credential is in a header the browser does not auto-attach cross-site; an attacker\'s page cannot add it. JWT, via simplejwt, sends a signed, self-contained token with an expiry as an Authorization Bearer header. You use it for SPAs on a different origin and for mobile, when you want stateless verification — no database hit to check the token — and short-lived access tokens with a refresh flow. Same as token auth, no CSRF implication because it is header-based. The practical rule: cookie-based auth means CSRF protection is mandatory; header-based auth — token or JWT — means CSRF does not apply, which is one of the main reasons APIs consumed by non-browser or cross-origin clients prefer it.',
        aHi: 'SessionAuthentication Django ki session cookie padhता hai, jо user ke normal auth machinery ke zariye log in karne par set hoती hai. Aap ise ek same-origin browser client ke liye istemal karते ho — ek server-rendered app, ya DRF browsable API khud. Kyunki ye ek ambient cookie par nirbhar karता hai jise browser automatically attach karता hai, ye bilkul wo situation hai jise CSRF attacks exploit karते hain, toh DRF POST, PUT, PATCH, DELETE par CSRF check enforce karता hai. TokenAuthentication ek database-backed scheme hai — prati user ek opaque token string — ek Authorization Token header ke roop mein bheja. Aap ise mobile apps aur scripts ke liye istemal karते ho. Koi CSRF concern nahi kyunki credential ek header mein hai jise browser cross-site auto-attach nahi karता. JWT ek signed, self-contained token ek expiry ke saath ek Authorization Bearer header ke roop mein bhejता hai. Aap ise ek alag origin par SPAs aur mobile ke liye istemal karते ho, jab aap stateless verification chahते ho. Vyavhaarik niyam: cookie-based auth matlab CSRF protection zaroori hai; header-based auth matlab CSRF lागू nahi hoता.',
      },
    ],

    exercises: [
      {
        task: 'Standalone DRF with `rest_framework.authtoken`. Model-free `WhoAmI(APIView)` returning `request.user.username`, `request.user.is_authenticated`, `type(request.auth).__name__`. `DEFAULT_AUTHENTICATION_CLASSES = [TokenAuthentication]`, `DEFAULT_PERMISSION_CLASSES = [IsAuthenticated]`. Create a user + `Token`. With `APIClient`: no header -> assert `401` and a `WWW-Authenticate: Token` header; a garbage token -> `401` "Invalid token."; the real token -> `200` with `auth_type == "Token"`.',
        taskHi: 'Standalone DRF `rest_framework.authtoken` ke saath. `WhoAmI(APIView)` jо `request.user.username`, `request.user.is_authenticated`, `type(request.auth).__name__` lautае. `DEFAULT_AUTHENTICATION_CLASSES = [TokenAuthentication]`. User + `Token` banाओ. Assert karो: koi header nahi -> `401` + `WWW-Authenticate: Token`; garbage token -> `401`; real token -> `200`.',
        hint: '`INSTALLED_APPS` needs `django.contrib.contenttypes`, `django.contrib.auth`, `rest_framework`, `rest_framework.authtoken`. `call_command("migrate", run_syncdb=True, verbosity=0)`. `Token.objects.create(user=u).key`. `c.get(url, HTTP_AUTHORIZATION=f"Token {key}")`. `resp.get("WWW-Authenticate")`.',
        hintHi: '`INSTALLED_APPS` mein `rest_framework.authtoken`. `call_command("migrate", run_syncdb=True, verbosity=0)`. `Token.objects.create(user=u).key`. `c.get(url, HTTP_AUTHORIZATION=f"Token {key}")`.',
      },
      {
        task: 'Write two `BaseAuthentication` subclasses. `HeaderAuth` returns `None` unless `X-Prefer` header is present, in which case it raises `AuthenticationFailed("prefer route rejected")`. `QueryAuth` returns `(user, "q")` when `?key=letmein` is in the query string, else `None` (with an `authenticate_header` returning `"Query"`). A view with `authentication_classes = [HeaderAuth, QueryAuth]`, `permission_classes = [IsAuthenticated]`. Assert: `?key=letmein` -> `200`; `X-Prefer: 1` + `?key=letmein` -> `401` "prefer route rejected" (QueryAuth never runs); nothing -> `401`.',
        taskHi: 'Do `BaseAuthentication` subclasses likhо. `HeaderAuth` `None` return kare jab tak `X-Prefer` header na ho, warna `AuthenticationFailed` raise kare. `QueryAuth` `(user, "q")` return kare jab `?key=letmein` ho. View `authentication_classes = [HeaderAuth, QueryAuth]`. Assert karो.',
        hint: '`request.headers.get("X-Prefer")` / `request.query_params.get("key")`. Order matters: `HeaderAuth` raising stops the chain. `c.get("/x/?key=letmein")` and `c.get("/x/?key=letmein", HTTP_X_PREFER="1")`.',
        hintHi: '`request.headers.get("X-Prefer")` / `request.query_params.get("key")`. Order maayne rakhता hai: `HeaderAuth` raise karके chain rokता hai.',
      },
      {
        task: 'Demonstrate 401 vs 403. Two views: `MembersOnly` (`permission_classes = [IsAuthenticated]`) and `StaffOnly` (`permission_classes = [IsAdminUser]`). `TokenAuthentication`. Create `ada` (normal) and `boss` (`is_staff=True`), each with a token. Assert: anon -> both `401`; ada -> `/members/` `200`, `/staff/` `403`; boss -> `/staff/` `200`. Explain in a comment why ada gets `403` not `401` on `/staff/`.',
        taskHi: '401 vs 403 dikhाओ. Do views: `MembersOnly` (`IsAuthenticated`) aur `StaffOnly` (`IsAdminUser`). `TokenAuthentication`. `ada` (normal) aur `boss` (`is_staff=True`) banाओ, dono token ke saath. Assert karो. Comment mein samjhाओ ada `/staff/` par `403` kyun `401` nahi.',
        hint: '`User.objects.create_user("boss", is_staff=True)`. ada is authenticated (auth succeeded) but fails the `IsAdminUser` permission -> `403`. anon never authenticates -> `IsAuthenticated`/`IsAdminUser` both -> `401`.',
        hintHi: '`User.objects.create_user("boss", is_staff=True)`. ada authenticated hai par `IsAdminUser` permission fail karता hai -> `403`. anon kabhi authenticate nahi hoता -> `401`.',
      },
    ],

    keyTakeaways: [
      'Authentication answers "WHO is this request?" — it NEVER decides "are you allowed?" (that is permissions, lesson 4). DRF walks `authentication_classes` in order before the handler; `request.user` is lazy (auth runs on first access).',
      '`authenticate(request)` returns: `(user, auth)` -> sets `request.user`/`request.auth`, stops the chain; `None` -> "not my credential type", DRF tries the next class; `raise AuthenticationFailed` -> "mine but invalid" -> immediate `401`, no fallthrough. All `None` -> `AnonymousUser`.',
      '`SessionAuthentication`: Django session cookie, for same-origin browser apps + the browsable API. ENFORCES CSRF on POST/PUT/PATCH/DELETE (send `X-CSRFToken`).',
      '`TokenAuthentication`: `Authorization: Token <key>`, one DB-backed opaque non-expiring token per user (`rest_framework.authtoken` + migrate). No CSRF. Mobile/scripts.',
      '`BasicAuthentication`: `Authorization: Basic <b64(user:pass)>`, HTTPS only, dev/curl only. JWT (`simplejwt`, lesson 2): `Authorization: Bearer <jwt>`, stateless, short access + refresh — the modern SPA/mobile default.',
      'Cookie-based auth (session) => CSRF applies. Header-based auth (token, JWT) => CSRF does NOT apply (browser never auto-attaches `Authorization` cross-site). This is a main reason APIs prefer header auth.',
      'List several classes; DRF tries each. `[SessionAuthentication, JWTAuthentication]` is the standard combo (browsable API in dev + JWT for real clients). Override per view with `authentication_classes = [...]` (or `[]` + `AllowAny` for a public endpoint).',
      '`401` = "authenticate first / bad credentials" (no auth succeeded + a permission needs a user; sets `WWW-Authenticate`). `403` = "authenticated but not permitted". A custom authenticator MUST implement `authenticate_header()` or unauthenticated requests get `403` instead of `401`. Return `None` for "not mine", raise only for "mine but broken".',
    ],
    keyTakeawaysHi: [
      'Authentication "ye request KAUN hai?" ka jawab deता hai — ye KABHI "kya aapko anumati hai?" tay nahi karता (wo permissions, lesson 4). DRF handler se pehle `authentication_classes` order mein walk karता hai; `request.user` lazy hai.',
      '`authenticate(request)` return karता hai: `(user, auth)` -> `request.user`/`request.auth` set, chain rukती hai; `None` -> "mera credential type nahi", DRF agli class try karता hai; `raise AuthenticationFailed` -> "mera par invalid" -> turant `401`. Sab `None` -> `AnonymousUser`.',
      '`SessionAuthentication`: Django session cookie, same-origin browser apps + browsable API ke liye. POST/PUT/PATCH/DELETE par CSRF ENFORCE (`X-CSRFToken` bhejो).',
      '`TokenAuthentication`: `Authorization: Token <key>`, prati user ek DB-backed opaque non-expiring token. Koi CSRF nahi. Mobile/scripts.',
      '`BasicAuthentication`: sirf HTTPS, sirf dev/curl. JWT (`simplejwt`, lesson 2): `Authorization: Bearer <jwt>`, stateless, short access + refresh — modern SPA/mobile default.',
      'Cookie-based auth (session) => CSRF lागू. Header-based auth (token, JWT) => CSRF lागू NAHI (browser `Authorization` cross-site auto-attach nahi karता). Yahi mukhya kाran hai APIs header auth prefer karती hain.',
      'Kai classes list karो; DRF har ek try karता hai. `[SessionAuthentication, JWTAuthentication]` standard combo hai. Per view `authentication_classes = [...]` se override (ya `[]` + `AllowAny` public endpoint ke liye).',
      '`401` = "pehle authenticate karो / bure credentials" (`WWW-Authenticate` set karता hai). `403` = "authenticated par permitted nahi". Ek custom authenticator ko `authenticate_header()` implement karna CHAHIYE warna unauthenticated requests `403` paते hain. "mera nahi" ke liye `None` return karो.',
    ],
  },

  {
    slug: 'dj-drf-jwt-simplejwt',
    title: 'JWT Auth with `djangorestframework-simplejwt`',
    titleHi: 'JWT Auth `djangorestframework-simplejwt` Ke Saath',
    description: 'A JWT is a signed, self-describing token: the server verifies the signature and reads the claims (user id, expiry) without a database lookup. `simplejwt` gives you a short-lived **access** token for API calls and a longer **refresh** token to get new access tokens. Stateless is the appeal and also the catch: you cannot instantly revoke an access token.',
    descriptionHi: 'Ek JWT ek signed, self-describing token hai: server signature verify karता hai aur claims (user id, expiry) padhता hai bina ek database lookup ke. `simplejwt` aapko API calls ke liye ek short-lived **access** token aur naye access tokens paने ke liye ek longer **refresh** token deता hai. Stateless appeal hai aur catch bhi: aap ek access token ko turant revoke nahi kar sakte.',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: '**A tamper-proof festival wristband versus a name on a guest list.** DRF\'s DB token is the guest list: every time you enter, the greeter looks you up in a book (a database query), and if they cross your name out you are instantly barred. A JWT is the wristband: it has your details printed on it and a holographic seal only the venue can produce (the signature). The greeter just glances at the seal and the "valid until 3pm" print — no book, no lookup, they can wave through thousands a minute. That is the appeal: speed and no shared database. The catch is the flip side of the same coin — once a wristband is on your wrist, the venue *cannot* un-issue it. If you lose it at 1pm, whoever finds it gets in until 3pm. So the design makes the wristband cheap and short-lived (a 5-minute access token), and gives you a separate re-entry pass at the box office (the refresh token, hours or days long) that you trade for a fresh wristband — and *that* pass, being used rarely and checkable against a list, can be cancelled.',
      hi: '**Ek tamper-proof festival wristband bनाम ek guest list par ek naam.** DRF ka DB token guest list hai: har baar aap andar aaते ho, greeter aapko ek book mein dhoondhता hai (ek database query), aur agar wo aapka naam kaat de aap turant bloc ho. Ek JWT wristband hai: ispar aapki details chhpी hain aur ek holographic seal jо sirf venue banा sakta hai (signature). Greeter bस seal aur "3pm tak valid" print dekhता hai — koi book nahi, koi lookup nahi, wo ek minute mein hazारों wave through kar sakte hain. Yahi appeal hai: speed aur koi shared database nahi. Catch usi sikkे ka doosra pehlू hai — ek baar wristband aapki wrist par hai, venue ise *un-issue* nahi kar sakta. Agar aap ise 1pm par kho dete ho, jо ise dhundhता hai wo 3pm tak andar aaता hai. Toh design wristband ko sasta aur short-lived banаता hai (ek 5-minute access token), aur aapको box office par ek alag re-entry pass deता hai (refresh token, ghante ya din lambा) jise aap ek fresh wristband ke liye trade karते ho — aur *wo* pass, kam istemal hone se aur ek list ke khilaf checkable hone se, cancel ho sakta hai.',
    },

    simple: `**Install & wire**

\`\`\`python
# pip install djangorestframework-simplejwt
INSTALLED_APPS = [..., "rest_framework_simplejwt"]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}

# urls.py
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView, TokenVerifyView,
)
urlpatterns = [
    path("api/token/",         TokenObtainPairView.as_view()),   # POST {username, password} -> {access, refresh}
    path("api/token/refresh/", TokenRefreshView.as_view()),      # POST {refresh}             -> {access}
    path("api/token/verify/",  TokenVerifyView.as_view()),       # POST {token}               -> {} or 401
]
\`\`\`

**The client flow**

\`\`\`
1. POST /api/token/  {username, password}
   -> 200 {"access": "<jwt, ~5 min>", "refresh": "<jwt, ~1 day>"}
2. Every API call:  Authorization: Bearer <access>
3. access expired (401 "token_not_valid") -> POST /api/token/refresh/ {"refresh": "<refresh>"}
   -> 200 {"access": "<new access>"}     (with ROTATE_REFRESH_TOKENS: also a new "refresh")
4. refresh expired -> user must log in again
\`\`\`

**What is inside an access token**

\`\`\`python
import jwt
jwt.decode(access, options={"verify_signature": False})
# {"token_type": "access", "exp": 1757845200, "iat": 1757844900,
#  "jti": "e1c...", "user_id": 7}
# -> base64(header) . base64(payload) . signature   -- NOT encrypted, only signed. Never put secrets in it.
\`\`\`

**Settings that matter**

\`\`\`python
from datetime import timedelta
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,       # refresh call also returns a new refresh token
    "BLACKLIST_AFTER_ROTATION": True,    # old refresh token is blacklisted (needs the blacklist app)
    "SIGNING_KEY": settings.SECRET_KEY,  # or a dedicated key; RS256 with a keypair for multi-service
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_CLAIM": "user_id",
}
\`\`\`

**Custom claims**

\`\`\`python
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.profile.role      # readable client-side; do NOT trust for authz decisions server-side
        token["org_id"] = user.org_id
        return token

class MyTokenView(TokenObtainPairView):
    serializer_class = MyTokenSerializer
\`\`\`

**Blacklist (opt-in revocation for refresh tokens)**

\`\`\`python
INSTALLED_APPS = [..., "rest_framework_simplejwt.token_blacklist"]   # + migrate
# logout endpoint:
from rest_framework_simplejwt.tokens import RefreshToken
RefreshToken(request.data["refresh"]).blacklist()   # that refresh token can no longer be used
\`\`\`

\`\`\`
access token   ~5 min, sent on every request, verified by SIGNATURE only (no DB) -> cannot be revoked mid-life
refresh token  ~hours/days, sent only to /token/refresh/, CAN be blacklisted (DB-backed opt-in app)
stateless win: no session store, horizontal scale, fast auth check
stateless cost: revocation is not instant (shorten ACCESS_TOKEN_LIFETIME; blacklist refresh tokens on logout)
client storage: in memory (safest) or an httpOnly cookie ; localStorage is XSS-exposed
JWT is signed, not encrypted -- anyone can read the payload. Never put a secret or a password in a claim.
\`\`\``,

    simpleHi: `**Install & wire**

\`\`\`python
# pip install djangorestframework-simplejwt
INSTALLED_APPS = [..., "rest_framework_simplejwt"]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
urlpatterns = [
    path("api/token/",         TokenObtainPairView.as_view()),   # POST {username, password} -> {access, refresh}
    path("api/token/refresh/", TokenRefreshView.as_view()),      # POST {refresh}             -> {access}
    path("api/token/verify/",  TokenVerifyView.as_view()),
]
\`\`\`

**Client flow**

\`\`\`
1. POST /api/token/  {username, password}  -> 200 {"access": "<~5 min>", "refresh": "<~1 day>"}
2. Har API call:  Authorization: Bearer <access>
3. access expired (401 "token_not_valid") -> POST /api/token/refresh/ {"refresh": ...}  -> {"access": "<naya>"}
4. refresh expired -> user ko phir log in karna hoga
\`\`\`

**Ek access token ke andar kya hai**

\`\`\`python
import jwt
jwt.decode(access, options={"verify_signature": False})
# {"token_type": "access", "exp": ..., "iat": ..., "jti": "...", "user_id": 7}
# -> base64(header) . base64(payload) . signature  -- ENCRYPTED nahi, sirf signed. Kabhi secrets mat daalो.
\`\`\`

**Settings jо maayne rakhती hain**

\`\`\`python
from datetime import timedelta
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,       # refresh call ek naya refresh token bhi lautाता hai
    "BLACKLIST_AFTER_ROTATION": True,    # purana refresh token blacklist (blacklist app chahिए)
    "SIGNING_KEY": settings.SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
}
\`\`\`

**Custom claims**

\`\`\`python
class MyTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.profile.role      # client-side readable; server par authz ke liye TRUST mat karो
        return token
\`\`\`

**Blacklist (refresh tokens ke liye opt-in revocation)**

\`\`\`python
INSTALLED_APPS = [..., "rest_framework_simplejwt.token_blacklist"]   # + migrate
from rest_framework_simplejwt.tokens import RefreshToken
RefreshToken(request.data["refresh"]).blacklist()
\`\`\`

\`\`\`
access token   ~5 min, har request par bheja, sirf SIGNATURE se verify (koi DB nahi) -> mid-life revoke nahi
refresh token  ~ghante/din, sirf /token/refresh/ ko bheja, blacklist ho SAKTA hai (DB-backed opt-in app)
stateless win: koi session store nahi, horizontal scale, tez auth check
stateless cost: revocation turant nahi (ACCESS_TOKEN_LIFETIME chhota karो; logout par refresh blacklist)
client storage: memory mein (safest) ya ek httpOnly cookie ; localStorage XSS-exposed
JWT signed hai, encrypted nahi -- koi bhi payload padh sakta hai. Kabhi ek secret ya password claim mein mat daalो.
\`\`\``,

    content: `## What a JWT is

Three base64url segments joined by dots: \`header.payload.signature\`.

- **header** — \`{"alg": "HS256", "typ": "JWT"}\`.
- **payload** — the *claims*: \`simplejwt\` puts \`token_type\`, \`exp\` (expiry, unix seconds), \`iat\` (issued-at), \`jti\` (a unique id), and \`user_id\`.
- **signature** — \`HMAC-SHA256(base64(header) + "." + base64(payload), SIGNING_KEY)\`. This is the whole security model: the server recomputes it and compares. Change one byte of the payload and the signature no longer matches.

**It is signed, not encrypted.** Anyone can base64-decode and read the payload. Never put a password, a secret, or PII you would not log in a claim.

## The two tokens

\`TokenObtainPairView\` (POST username+password) returns:

- **access** — short (minutes). Sent as \`Authorization: Bearer <access>\` on every request. \`JWTAuthentication\` verifies the signature and \`exp\`, then loads \`User.objects.get(pk=user_id)\` (one query — the *only* DB hit, and it can be cached). An expired access token gives \`401 {"code": "token_not_valid"}\`.
- **refresh** — long (hours to days). Sent *only* to \`/token/refresh/\`, which returns a new access token. Never sent to normal API endpoints.

The split exists so the credential that travels everywhere (access) is worthless within minutes if stolen, while the credential that can mint new ones (refresh) travels rarely and can be tracked.

## Rotation and blacklisting

- **\`ROTATE_REFRESH_TOKENS = True\`** — \`/token/refresh/\` returns a *new* refresh token too, so a stolen-and-used refresh token has a short window before the legitimate client rotates it out.
- **\`BLACKLIST_AFTER_ROTATION = True\`** (needs \`rest_framework_simplejwt.token_blacklist\` in \`INSTALLED_APPS\` + migrate) — the old refresh token is written to a blacklist table and rejected thereafter. This is also how **logout** works: \`RefreshToken(token).blacklist()\`.
- There is **no blacklist for access tokens** by default — they are stateless. To approximate instant revocation you either keep \`ACCESS_TOKEN_LIFETIME\` very short (1–5 min) or add a custom check (a \`token_version\` on the user, bumped on logout/password-change, compared to a claim — which reintroduces a DB read).

## Stateless: the trade

**Win**: no session store, so any server instance can verify any token; auth is a signature check plus one cached user lookup; horizontal scaling is trivial.

**Cost**: you cannot instantly kill a specific access token. If a token leaks, it is valid until \`exp\`. Mitigations: short access lifetime, refresh rotation + blacklist, a per-user token-version claim for the "log out everywhere" button, and TLS everywhere so tokens are not sniffed.

## Client storage

- **In memory** (a JS variable) — safest against theft; lost on refresh, so you re-obtain via the refresh token (which lives in an httpOnly cookie).
- **httpOnly, Secure, SameSite cookie** — not readable by JS (XSS-safe) but then subject to CSRF, so you need CSRF protection on the endpoints that read it.
- **\`localStorage\`** — convenient, persistent, and readable by any XSS payload on your origin. Common but the weakest option.

The usual pattern: access token in memory, refresh token in an httpOnly Secure cookie, a silent refresh on page load.

## Custom claims and \`get_token\`

\`\`\`python
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username        # convenience for the client UI
        token["is_staff"] = user.is_staff
        return token
\`\`\`

Extra claims are handy for the client to render UI without an extra request. But the server must **not** trust a claim for authorization — always re-check against the DB (\`request.user.is_staff\`, an object-level permission). A claim is only as trustworthy as "it was true when the token was issued, possibly minutes ago".

## simplejwt vs DRF \`TokenAuthentication\`

| | DRF token | JWT (simplejwt) |
|---|---|---|
| Storage | one row per user, DB | none (stateless) |
| Per-request cost | 1 DB query | signature check + 1 (cacheable) user query |
| Expiry | never (unless you add it) | built-in, short |
| Revocation | instant (delete the row) | not for access tokens; blacklist for refresh |
| Refresh flow | none | access + refresh |
| Multi-service | share the DB | share the public key (RS256) |

Use DRF token for a simple internal API where instant revocation matters more than statelessness; use JWT for public SPAs/mobile and multi-service architectures.`,

    contentHi: `## Ek JWT kya hai

Teen base64url segments dots se jude: \`header.payload.signature\`.

- **header** — \`{"alg": "HS256", "typ": "JWT"}\`.
- **payload** — *claims*: \`simplejwt\` \`token_type\`, \`exp\`, \`iat\`, \`jti\`, aur \`user_id\` daalता hai.
- **signature** — \`HMAC-SHA256(base64(header) + "." + base64(payload), SIGNING_KEY)\`. Ye poora security model hai: server ise recompute karके compare karता hai.

**Ye signed hai, encrypted nahi.** Koi bhi base64-decode karके payload padh sakta hai. Kabhi ek password, secret, ya PII ek claim mein mat daalो.

## Do tokens

- **access** — short (minutes). Har request par \`Authorization: Bearer <access>\` bheja. \`JWTAuthentication\` signature aur \`exp\` verify karता hai, phir \`User.objects.get(pk=user_id)\` load karता hai (ek query — *ekmatra* DB hit, jо cache ho sakta hai). Ek expired access token \`401 {"code": "token_not_valid"}\` deता hai.
- **refresh** — long (ghante se din). *Sirf* \`/token/refresh/\` ko bheja, jо ek naya access token lautाता hai.

Split isliए hai ki jо credential har jagah travel karता hai (access) chori hone par minutes mein bekaar hai, jabki jо naye mint kar sakta hai (refresh) kam travel karता hai aur track ho sakta hai.

## Rotation aur blacklisting

- **\`ROTATE_REFRESH_TOKENS = True\`** — \`/token/refresh/\` ek *naya* refresh token bhi lautाता hai.
- **\`BLACKLIST_AFTER_ROTATION = True\`** (\`rest_framework_simplejwt.token_blacklist\` + migrate chahिए) — purana refresh token ek blacklist table mein likha jाता hai aur uske baad reject. **Logout** bhi aise kaam karता hai: \`RefreshToken(token).blacklist()\`.
- Access tokens ke liye default se **koi blacklist nahi** — wo stateless hain. Turant revocation ke aas-paas paने ke liye ya \`ACCESS_TOKEN_LIFETIME\` bahut chhota rakhо (1-5 min) ya ek custom check add karो.

## Stateless: sौda

**Win**: koi session store nahi, toh koi bhi server instance koi bhi token verify kar sakta hai; auth ek signature check plus ek cached user lookup hai; horizontal scaling trivial hai.

**Cost**: aap ek vishisht access token ko turant nahi maar sakte. Agar ek token leak hoता hai, ye \`exp\` tak valid hai. Mitigations: short access lifetime, refresh rotation + blacklist, "log out everywhere" button ke liye ek per-user token-version claim.

## Client storage

- **Memory mein** (ek JS variable) — theft ke khilaf safest; refresh par kho jाता hai.
- **httpOnly, Secure, SameSite cookie** — JS dwara readable nahi (XSS-safe) par phir CSRF ke adhीन.
- **\`localStorage\`** — convenient, persistent, aur aapke origin par kisi bhi XSS payload dwara readable. Sabse kamzor vikalp.

Usual pattern: access token memory mein, refresh token ek httpOnly Secure cookie mein.

## Custom claims

Extra claims client ke liye UI render karने ko handy hain bina ek extra request ke. Par server ko authorization ke liye ek claim **trust nahi** karna chahिए — hamesha DB ke khilaf re-check karो.

## simplejwt vs DRF \`TokenAuthentication\`

DRF token: prati user ek row, instant revocation (row delete), koi expiry nahi, koi refresh nahi. JWT: stateless, built-in short expiry, access tokens ke liye instant revocation nahi (refresh ke liye blacklist), access + refresh flow, multi-service ke liye public key share.

Ek saral internal API ke liye DRF token istemal karो jahaan instant revocation statelessness se zyada maayne rakhता hai; public SPAs/mobile aur multi-service architectures ke liye JWT.`,

    examples: [
      {
        title: 'Obtain -> use -> refresh: the full simplejwt flow',
        titleHi: 'Obtain -> use -> refresh: poora simplejwt flow',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="a-signing-key-that-is-definitely-over-32-bytes-long",
    ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth",
                    "rest_framework", "rest_framework_simplejwt"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    REST_FRAMEWORK={
        "DEFAULT_AUTHENTICATION_CLASSES": ["rest_framework_simplejwt.authentication.JWTAuthentication"],
        "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"]})
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.contrib.auth.models import User
from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.test import APIClient

class Me(APIView):
    def get(self, request):
        return Response({"user": request.user.username, "auth": type(request.auth).__name__})

urlpatterns = [
    path("token/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("me/", Me.as_view()),
]

User.objects.create_user("ada", password="s3cret-pw")
c = APIClient()

print("no token -> /me/:", c.get("/me/").status_code)

obtain = c.post("/token/", {"username": "ada", "password": "s3cret-pw"}, format="json")
print("obtain:", obtain.status_code, "keys:", sorted(obtain.json().keys()))
access, refresh = obtain.json()["access"], obtain.json()["refresh"]

print("with access -> /me/:", c.get("/me/", HTTP_AUTHORIZATION=f"Bearer {access}").json())

refreshed = c.post("/token/refresh/", {"refresh": refresh}, format="json")
print("refresh:", refreshed.status_code, "keys:", sorted(refreshed.json().keys()))
new_access = refreshed.json()["access"]
print("with new access -> /me/:", c.get("/me/", HTTP_AUTHORIZATION=f"Bearer {new_access}").status_code)

print("garbage bearer -> /me/:", c.get("/me/", HTTP_AUTHORIZATION="Bearer not.a.jwt").status_code,
      c.get("/me/", HTTP_AUTHORIZATION="Bearer not.a.jwt").json().get("code"))
print("wrong password:", c.post("/token/", {"username": "ada", "password": "wrong"}, format="json").status_code)`,
        output: `no token -> /me/: 401
obtain: 200 keys: ['access', 'refresh']
with access -> /me/: {'user': 'ada', 'auth': 'AccessToken'}
refresh: 200 keys: ['access']
with new access -> /me/: 200
garbage bearer -> /me/: 401 token_not_valid
wrong password: 401
`,
        explain: 'POST /token/ with valid credentials returns {access, refresh}. The access token goes on every request as Authorization: Bearer <jwt>; JWTAuthentication verifies it and sets request.auth to an AccessToken. When the access token expires you POST /token/refresh/ with the refresh token to get a new access token (no re-login). A malformed bearer -> 401 with code: token_not_valid. Wrong credentials at /token/ -> 401.',
        explainHi: 'Valid credentials ke saath POST /token/ {access, refresh} lautata hai. Access token har request par Authorization: Bearer <jwt> ke roop mein jata hai. Jab access token expire hota hai aap refresh token ke saath POST /token/refresh/ karke ek naya access token pate ho. Ek malformed bearer -> 401 code: token_not_valid ke saath.',
      },
      {
        title: 'A JWT is signed, not encrypted -- and expiry is enforced',
        titleHi: 'Ek JWT signed hai, encrypted nahi -- aur expiry enforce hoती hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="a-signing-key-that-is-definitely-over-32-bytes-long",
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework_simplejwt"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
from datetime import timedelta
settings.SIMPLE_JWT = {"ACCESS_TOKEN_LIFETIME": timedelta(seconds=1)}
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

import base64, json, time
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

ada = User.objects.create_user("ada")
token = str(AccessToken.for_user(ada))

# anyone can read the payload -- it is base64, not encryption
header_b64, payload_b64, sig = token.split(".")
payload = json.loads(base64.urlsafe_b64decode(payload_b64 + "=="))
print("readable claims:", {k: payload[k] for k in ("token_type", "user_id")})   # user_id is a string in the claim
print("has exp + jti:", "exp" in payload and "jti" in payload)

# tamper with the payload -> signature no longer matches -> rejected
bad_payload = dict(payload, user_id=999)
bad_b64 = base64.urlsafe_b64encode(json.dumps(bad_payload).encode()).decode().rstrip("=")
tampered = f"{header_b64}.{bad_b64}.{sig}"
auth = JWTAuthentication()
try:
    auth.get_validated_token(tampered)
    print("tampered accepted?!")
except (InvalidToken, TokenError) as e:
    print("tampered rejected:", type(e).__name__)

# a valid token expires
fresh = str(AccessToken.for_user(ada))
print("fresh token valid:", bool(auth.get_validated_token(fresh)))
time.sleep(2)
try:
    auth.get_validated_token(fresh)
    print("expired accepted?!")
except (InvalidToken, TokenError) as e:
    print("after 2s -> expired:", type(e).__name__)`,
        output: `readable claims: {'token_type': 'access', 'user_id': '1'}
has exp + jti: True
tampered rejected: InvalidToken
fresh token valid: True
after 2s -> expired: InvalidToken
`,
        explain: 'The token is header.payload.signature -- the payload is plain base64, so anyone can decode and read the claims (token_type, user_id as a string, exp, jti). That is why you never put a secret in a claim. Security comes from the signature: change any byte of the payload and the recomputed HMAC no longer matches -> InvalidToken. And the exp claim is enforced -- a token with a 1-second lifetime validates now but raises InvalidToken after time.sleep(2).',
        explainHi: 'Token header.payload.signature hai -- payload plain base64 hai, toh koi bhi decode karke claims padh sakta hai. Isiliye aap kabhi ek secret ek claim mein nahi daalte. Security signature se aati hai: payload ka koi byte badlo aur recomputed HMAC match nahi karta -> InvalidToken. Aur exp claim enforce hota hai.',
      },
      {
        title: 'Custom claims + refresh rotation + blacklist (logout)',
        titleHi: 'Custom claims + refresh rotation + blacklist (logout)',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="a-signing-key-that-is-definitely-over-32-bytes-long",
    ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework",
                    "rest_framework_simplejwt", "rest_framework_simplejwt.token_blacklist"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
from datetime import timedelta
settings.SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}
settings.REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ["rest_framework_simplejwt.authentication.JWTAuthentication"],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"]}
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

import base64, json
from django.contrib.auth.models import User
from django.urls import path
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.test import APIClient

class MySerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["is_staff"] = user.is_staff
        return token

class MyObtainView(TokenObtainPairView):
    serializer_class = MySerializer

class LogoutView(APIView):
    permission_classes = [AllowAny]              # auth is the refresh token in the body, not a header
    def post(self, request):
        RefreshToken(request.data["refresh"]).blacklist()
        return Response({"detail": "logged out"})

urlpatterns = [
    path("token/", MyObtainView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("logout/", LogoutView.as_view()),
]

User.objects.create_user("ada", password="pw123456", is_staff=True)
c = APIClient()
obtain = c.post("/token/", {"username": "ada", "password": "pw123456"}, format="json").json()
claims = json.loads(base64.urlsafe_b64decode(obtain["access"].split(".")[1] + "=="))
print("custom claims:", {k: claims[k] for k in ("username", "is_staff")})

r1 = c.post("/token/refresh/", {"refresh": obtain["refresh"]}, format="json")
print("rotate -> new refresh issued:", "refresh" in r1.json())

# the OLD refresh token is now blacklisted
r2 = c.post("/token/refresh/", {"refresh": obtain["refresh"]}, format="json")
print("reuse old refresh -> rejected:", r2.status_code, r2.json().get("code"))

# logout blacklists the current refresh token
new_refresh = r1.json()["refresh"]
print("logout:", c.post("/logout/", {"refresh": new_refresh}, format="json").json())
r3 = c.post("/token/refresh/", {"refresh": new_refresh}, format="json")
print("refresh after logout -> rejected:", r3.status_code)`,
        output: `custom claims: {'username': 'ada', 'is_staff': True}
rotate -> new refresh issued: True
reuse old refresh -> rejected: 401 token_not_valid
logout: {'detail': 'logged out'}
refresh after logout -> rejected: 401
`,
        explain: 'get_token is overridden to add username and is_staff claims -- visible to the client for rendering UI, but the server must still re-check request.user for authz. With ROTATE_REFRESH_TOKENS + BLACKLIST_AFTER_ROTATION, calling /token/refresh/ issues a new refresh token and blacklists the old one, so reusing the original refresh token is 401. Logout is just RefreshToken(token).blacklist() (the view is AllowAny because the refresh token in the body is the credential); afterwards that refresh token is rejected.',
        explainHi: 'get_token override kiya gaya username aur is_staff claims add karne ko -- client ko UI render karne ke liye visible, par server ko abhi bhi authz ke liye request.user re-check karna chahiye. ROTATE_REFRESH_TOKENS + BLACKLIST_AFTER_ROTATION ke saath, /token/refresh/ call karna ek naya refresh token deta hai aur purane ko blacklist karta hai. Logout bas RefreshToken(token).blacklist() hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# client stores the access token in localStorage
localStorage.setItem("access", data.access)
// any XSS on your origin can now read it and impersonate the user until it expires`,
        right: `// keep the access token in a plain JS variable (memory)
let accessToken = data.access;
// keep the refresh token in an httpOnly + Secure + SameSite cookie the server sets
// on page load, silently POST /token/refresh/ (cookie sent automatically) to get a fresh access token`,
        why: '`localStorage` is readable by any JavaScript running on your origin, so a single XSS bug hands an attacker a valid token until `exp`. Memory storage is wiped on reload but not scriptable to steal in bulk; the refresh token then lives in an `httpOnly` cookie the JS cannot read at all. The trade is you must handle a silent refresh on load and add CSRF protection to the refresh endpoint (since it now relies on a cookie).',
        whyHi: '`localStorage` aapke origin par chalने waale kisi bhi JavaScript dwara readable hai, toh ek single XSS bug ek attacker ko `exp` tak ek valid token deता hai. Memory storage reload par wipe hoता hai; refresh token phir ek `httpOnly` cookie mein rehता hai jise JS bilkul nahi padh sakta. Sौda: aapको load par ek silent refresh handle karna hoगा aur refresh endpoint par CSRF protection add karna hoगा.',
      },
      {
        wrong: `class DashboardView(APIView):
    def get(self, request):
        role = request.auth["role"]           # trusting a claim from the token
        if role == "admin":
            return Response(sensitive_data)`,
        right: `class DashboardView(APIView):
    permission_classes = [IsAdminUser]         # re-checked against request.user (DB-backed)
    def get(self, request):
        if request.user.is_staff:              # or a fresh DB lookup / object permission
            return Response(sensitive_data)`,
        why: 'A custom claim (`role`, `is_staff`, `org_id`) reflects the state *at the moment the token was issued* — possibly minutes ago, before the user was demoted or removed from the org. Use claims to render UI without a round-trip, but every server-side authorization decision must re-check the live source of truth: `request.user` (freshly loaded), a permission class, or an object-level check.',
        whyHi: 'Ek custom claim (`role`, `is_staff`, `org_id`) *token issue hone ke pal* ki state reflect karता hai — shायद minutes pehle, user ke demote hone se pehle. Claims ka istemal UI render karने ke liye karो bina ek round-trip ke, par har server-side authorization decision ko live source of truth re-check karna chahिए: `request.user`, ek permission class, ya ek object-level check.',
      },
      {
        wrong: `SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=7),   # "so users do not have to log in often"
}
# a leaked access token is now valid for a week, and there is no way to revoke it`,
        right: `SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),   # long-lived credential lives here, and CAN be blacklisted
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}`,
        why: 'The access token has no revocation mechanism — its only protection is a short lifetime. Making it long defeats the entire access/refresh design: a stolen token is a week-long free pass. Keep the access token in the single-digit-minutes range and put the "stay logged in" duration on the refresh token, which is sent rarely, can be rotated, and can be blacklisted on logout or suspicious activity.',
        whyHi: 'Access token ke paas koi revocation mechanism nahi — iski ekmatra protection ek short lifetime hai. Ise lambा banाना poore access/refresh design ko harा deता hai. Access token ko single-digit-minutes range mein rakhо aur "stay logged in" duration refresh token par daalो, jо kam bheja jाता hai, rotate ho sakta hai, aur logout par blacklist ho sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Access token in memory, refresh token in an httpOnly Secure cookie, silent refresh on load** — the SPA boots, POSTs to `/token/refresh/` (cookie auto-sent), gets an access token into a variable, and schedules a refresh a bit before `exp`. Logout POSTs the refresh token to a blacklist endpoint and clears the cookie.',
        hi: '**Access token memory mein, refresh token ek httpOnly Secure cookie mein, load par silent refresh** — SPA boot hoता hai, `/token/refresh/` par POST karता hai, ek access token ek variable mein paता hai, aur `exp` se thoड़ा pehle ek refresh schedule karता hai.',
      },
      {
        en: '**RS256 for a multi-service setup** — the auth service signs with a private key, every other service verifies with the shared *public* key (`SIGNING_KEY` = private, `VERIFYING_KEY` = public, `ALGORITHM = "RS256"`). No service needs the auth DB or the private key to validate a request.',
        hi: '**Ek multi-service setup ke liye RS256** — auth service ek private key se sign karता hai, har doosra service shared *public* key se verify karता hai. Kisi service ko auth DB ya private key nahi chahिए ek request validate karने ke liye.',
      },
      {
        en: '**A `token_version` integer on the user, added as a claim, checked in a custom `JWTAuthentication`** — "log out of all devices" and forced-logout-on-password-change bump `user.token_version`; a token whose claim does not match the current value is rejected. Adds one cached DB read per request but gives real global revocation.',
        hi: '**User par ek `token_version` integer, ek claim ke roop mein added, ek custom `JWTAuthentication` mein checked** — "saare devices se log out" aur password-change par forced-logout `user.token_version` bump karते hain; ek token jiska claim current value se match nahi karता reject hoता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is inside a JWT, how does the server validate one, and why can you not revoke an access token?',
        qHi: 'Ek JWT ke andar kya hai, server ise kaise validate karता hai, aur aap ek access token revoke kyun nahi kar sakte?',
        a: 'A JWT is three base64url-encoded parts joined by dots: a header saying the algorithm, a payload of claims, and a signature. simplejwt\'s access-token claims are the token type, an expiry as a unix timestamp, an issued-at time, a unique jti, and the user id. The signature is an HMAC of the header and payload using the server\'s signing key, or an RSA signature if you use RS256. To validate, the server recomputes the signature over the received header and payload and compares — if a single byte of the payload was changed, it will not match — then it checks that the expiry is in the future, and finally it loads the user by the id claim, which is the one database query and is cacheable. Nothing about this touches a session store, which is the whole point: any instance can validate any token with just the key. The reason you cannot revoke an access token is the flip side of that statelessness. Validation never consults a list of "still valid" tokens, so there is no list to remove a token from. Once issued, an access token is accepted by every server until its exp passes, full stop. The design works around this: the access token is deliberately short-lived, minutes not days, so a leaked one is only briefly useful; and the long-lived credential is the refresh token, which is sent only to the refresh endpoint, so it is exposed far less, and which can be blacklisted — simplejwt has an opt-in blacklist app, and rotation plus blacklist-after-rotation means using a refresh token invalidates the previous one. Logout is implemented by blacklisting the refresh token. If you genuinely need instant access-token revocation, you add a per-user version number as a claim and check it against the database on each request, which trades away some of the statelessness.',
        aHi: 'Ek JWT teen base64url-encoded parts hain dots se jude: ek header jо algorithm batाता hai, claims ka ek payload, aur ek signature. simplejwt ke access-token claims token type, ek unix timestamp ke roop mein expiry, ek issued-at time, ek unique jti, aur user id hain. Signature server ki signing key ka istemal karके header aur payload ka ek HMAC hai. Validate karने ke liye, server received header aur payload par signature recompute karके compare karता hai — agar payload ka ek byte badla tha, ye match nahi karega — phir check karता hai ki expiry future mein hai, aur ant mein id claim se user load karता hai, jо ek database query hai aur cacheable hai. Iska kuch bhi ek session store nahi chhoota. Aap ek access token revoke nahi kar sakte iska karan us statelessness ka doosra pehlू hai. Validation kabhi "still valid" tokens ki ek list se salah nahi leता, toh ek token ko hataने ke liye koi list nahi. Design iske aas-paas kaam karता hai: access token jaanbujhкар short-lived hai; aur long-lived credential refresh token hai, jise blacklist kiya jа sakta hai. Logout refresh token ko blacklist karके implement hoता hai.',
      },
      {
        q: 'A custom claim like `is_staff` is in the token. Should the server trust it for an authorization check? Why or why not?',
        qHi: 'Ek custom claim jaise `is_staff` token mein hai. Kya server ise ek authorization check ke liye trust kare? Kyun ya kyun nahi?',
        a: 'No. A claim is a snapshot of some fact at the moment the token was signed, which could be many minutes ago given a typical access-token lifetime, and up to the refresh lifetime if the client keeps refreshing without the claim being recomputed. In that window the user could have been demoted, removed from an organisation, had a role revoked, or been deactivated entirely, and the token would still carry the stale claim. The signature only guarantees the claim has not been tampered with since issuance — it says nothing about whether the claim is still true. So using request dot auth of role equals admin, or an is_staff claim, to gate access to sensitive data is a real vulnerability: an admin who was demoted five minutes ago still gets in until their token expires. The correct pattern is to use claims purely for the client\'s benefit — so the frontend can show or hide an admin menu without a round-trip — and to make every server-side authorization decision against the live source of truth. That means request dot user, which JWTAuthentication loads fresh from the database on each request, or a permission class like IsAdminUser that checks request dot user dot is_staff, or an object-level permission that checks ownership against the current row. The database is authoritative; the claim is a hint. If you want the claim itself to be trustworthy for authz, you have to shorten the access token lifetime enough that the staleness window is acceptable, and even then a freshly-loaded request dot user is simpler and safer.',
        aHi: 'Nahi. Ek claim kisi fact ka ek snapshot hai us pal jab token sign hua tha, jо ek typical access-token lifetime ko dekhते hue kai minutes pehle ho sakta hai. Us window mein user demote ho sakta tha, ek organisation se hataya jа sakta tha, ek role revoke ho sakta tha, ya poori tarah deactivate ho sakta tha, aur token abhi bhi stale claim le jाega. Signature sirf guarantee karता hai ki claim issuance ke baad tamper nahi hua — ye kuch nahi kehता ki claim abhi bhi sach hai. Toh sensitive data tak access gate karने ke liye ek is_staff claim ka istemal ek asli vulnerability hai. Sahi pattern claims ko purely client ke fayde ke liye istemal karna hai — taaki frontend ek admin menu dikhа ya chhupа sake bina ek round-trip ke — aur har server-side authorization decision ko live source of truth ke khilaf banаना. Iska matlab request dot user, jise JWTAuthentication har request par database se fresh load karता hai, ya IsAdminUser jaisा ek permission class. Database authoritative hai; claim ek hint hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone DRF + `rest_framework_simplejwt`, `SECRET_KEY` >= 32 chars. Wire `TokenObtainPairView` at `/token/`, `TokenRefreshView` at `/token/refresh/`, and a protected `Me(APIView)` returning `request.user.username`. Create a user. With `APIClient`: `/me/` with no header -> `401`; POST `/token/` with correct creds -> `200` with `access` + `refresh`; `/me/` with `Bearer <access>` -> `200`; POST `/token/refresh/` with the refresh -> `200` with a new `access`; `Bearer not.a.jwt` -> `401` and `.json()["code"] == "token_not_valid"`.',
        taskHi: 'Standalone DRF + `rest_framework_simplejwt`, `SECRET_KEY` >= 32 chars. `/token/`, `/token/refresh/`, aur ek protected `Me(APIView)` wire karो. User banाओ. `APIClient` se assert karो.',
        hint: '`INSTALLED_APPS`: `django.contrib.contenttypes`, `django.contrib.auth`, `rest_framework`, `rest_framework_simplejwt`. `call_command("migrate", run_syncdb=True, verbosity=0)`. `c.get(url, HTTP_AUTHORIZATION=f"Bearer {access}")`. `DEFAULT_AUTHENTICATION_CLASSES = ["rest_framework_simplejwt.authentication.JWTAuthentication"]`.',
        hintHi: '`INSTALLED_APPS` mein `rest_framework_simplejwt`. `call_command("migrate", run_syncdb=True, verbosity=0)`. `c.get(url, HTTP_AUTHORIZATION=f"Bearer {access}")`.',
      },
      {
        task: 'Show a JWT is not encrypted and expiry is enforced. `settings.SIMPLE_JWT = {"ACCESS_TOKEN_LIFETIME": timedelta(seconds=1)}`. `AccessToken.for_user(user)` -> str. (a) split on `.`, base64-decode the payload, print `token_type` + `user_id` + that `exp` is present. (b) `JWTAuthentication().get_validated_token(token)` succeeds now; after `time.sleep(2)` it raises `InvalidToken`. (c) re-base64 a payload with a changed `user_id`, reassemble with the original signature, and show `get_validated_token` raises.',
        taskHi: 'Dikhाओ ek JWT encrypted nahi aur expiry enforce hoती hai. `ACCESS_TOKEN_LIFETIME` = 1 second. `AccessToken.for_user(user)`. (a) payload decode karके claims print karो. (b) ab valid, `sleep(2)` ke baad `InvalidToken`. (c) tampered payload -> reject.',
        hint: '`import base64, json`. `base64.urlsafe_b64decode(payload_b64 + "==")`. `from rest_framework_simplejwt.exceptions import InvalidToken, TokenError`. `from rest_framework_simplejwt.tokens import AccessToken`. `str(AccessToken.for_user(u))`.',
        hintHi: '`base64.urlsafe_b64decode(payload_b64 + "==")`. `from rest_framework_simplejwt.exceptions import InvalidToken, TokenError`. `str(AccessToken.for_user(u))`.',
      },
      {
        task: 'Add `rest_framework_simplejwt.token_blacklist` + `SIMPLE_JWT` with `ROTATE_REFRESH_TOKENS` and `BLACKLIST_AFTER_ROTATION` both `True`. Subclass `TokenObtainPairSerializer.get_token` to add a `username` claim. A `LogoutView(APIView)` that does `RefreshToken(request.data["refresh"]).blacklist()`. Assert: the access token payload contains `username`; calling `/token/refresh/` twice with the *same original* refresh -> first `200`, second `401` (`token_not_valid`); after `LogoutView` on a valid refresh, `/token/refresh/` with it -> `401`.',
        taskHi: '`rest_framework_simplejwt.token_blacklist` + `SIMPLE_JWT` `ROTATE_REFRESH_TOKENS` aur `BLACKLIST_AFTER_ROTATION` dono `True`. `get_token` subclass karके `username` claim add karो. `LogoutView` jо `RefreshToken(...).blacklist()` kare. Assert karो.',
        hint: '`INSTALLED_APPS` needs `rest_framework_simplejwt.token_blacklist`; `migrate` creates its tables. `from rest_framework_simplejwt.tokens import RefreshToken`. `MyObtainView.serializer_class = MySerializer`. Decode the access payload as in exercise 2 to check the `username` claim.',
        hintHi: '`INSTALLED_APPS` mein `rest_framework_simplejwt.token_blacklist`; `migrate`. `from rest_framework_simplejwt.tokens import RefreshToken`. `MyObtainView.serializer_class = MySerializer`.',
      },
    ],

    keyTakeaways: [
      'A JWT = `base64(header).base64(payload).signature`. `simplejwt` access claims: `token_type`, `exp`, `iat`, `jti`, `user_id`. The server VERIFIES by recomputing the signature (`HMAC-SHA256` with `SIGNING_KEY`, or RSA for RS256) + checking `exp` + loading the user by id (the one, cacheable, DB hit).',
      'SIGNED, NOT ENCRYPTED — anyone can base64-decode and read the payload. NEVER put a password, secret, or sensitive PII in a claim.',
      'Two tokens: ACCESS (short, minutes; sent on every request as `Authorization: Bearer <jwt>`) and REFRESH (long, hours/days; sent ONLY to `/token/refresh/`, which returns a fresh access token). `TokenObtainPairView` / `TokenRefreshView` / `TokenVerifyView`.',
      'STATELESS WIN: no session store, any instance verifies any token, trivial horizontal scale. STATELESS COST: an access token CANNOT be revoked mid-life — its only protection is a short `ACCESS_TOKEN_LIFETIME` (keep it 1-5 min).',
      '`ROTATE_REFRESH_TOKENS=True` + `BLACKLIST_AFTER_ROTATION=True` (needs `rest_framework_simplejwt.token_blacklist` + migrate): each refresh issues a new refresh token and blacklists the old one. Logout = `RefreshToken(token).blacklist()`.',
      'Custom claims via `TokenObtainPairSerializer.get_token` override are for the CLIENT UI only. The server must NEVER trust a claim for authorization — re-check `request.user` / a permission class / an object-level check (a claim is stale the moment the user\'s role changes).',
      'Client storage: access token IN MEMORY (safest), refresh token in an `httpOnly` + `Secure` + `SameSite` cookie, silent refresh on load. `localStorage` is XSS-exposed — avoid.',
      'vs DRF `TokenAuthentication`: DRF token = 1 DB row/user, instant revocation, no expiry, no refresh. JWT = stateless, built-in expiry, no instant access revocation, access+refresh, RS256 public-key sharing for multi-service. Pick per need.',
    ],
    keyTakeawaysHi: [
      'Ek JWT = `base64(header).base64(payload).signature`. `simplejwt` access claims: `token_type`, `exp`, `iat`, `jti`, `user_id`. Server VERIFY karता hai signature recompute karके (`HMAC-SHA256` `SIGNING_KEY` ke saath) + `exp` check + id se user load (ekmatra, cacheable, DB hit).',
      'SIGNED, ENCRYPTED NAHI — koi bhi base64-decode karके payload padh sakta hai. KABHI ek password, secret, ya sensitive PII ek claim mein mat daalो.',
      'Do tokens: ACCESS (short, minutes; har request par `Authorization: Bearer <jwt>`) aur REFRESH (long, ghante/din; SIRF `/token/refresh/` ko). `TokenObtainPairView` / `TokenRefreshView` / `TokenVerifyView`.',
      'STATELESS WIN: koi session store nahi, koi bhi instance koi bhi token verify karता hai. STATELESS COST: ek access token mid-life REVOKE NAHI ho sakta — iski ekmatra protection ek short `ACCESS_TOKEN_LIFETIME` (1-5 min).',
      '`ROTATE_REFRESH_TOKENS=True` + `BLACKLIST_AFTER_ROTATION=True` (`rest_framework_simplejwt.token_blacklist` + migrate chahिए): har refresh ek naya refresh token deता hai aur purane ko blacklist karता hai. Logout = `RefreshToken(token).blacklist()`.',
      '`TokenObtainPairSerializer.get_token` override se custom claims SIRF CLIENT UI ke liye hain. Server ko authorization ke liye ek claim KABHI trust nahi karna chahिए — `request.user` / ek permission class / ek object-level check re-check karो.',
      'Client storage: access token MEMORY MEIN (safest), refresh token ek `httpOnly` + `Secure` + `SameSite` cookie mein. `localStorage` XSS-exposed hai — avoid.',
      'vs DRF `TokenAuthentication`: DRF token = 1 DB row/user, instant revocation, koi expiry nahi. JWT = stateless, built-in expiry, koi instant access revocation nahi, access+refresh, multi-service ke liye RS256.',
    ],
  },

  {
    slug: 'dj-custom-user-model',
    title: 'The Custom User Model (Do It on Day One)',
    titleHi: 'Custom User Model (Pehle Din Karो)',
    description: 'Every real Django project should set `AUTH_USER_MODEL` to its own user model **before the first migration**. Swapping later is a painful, error-prone migration. `AbstractUser` lets you add fields to Django\'s user; `AbstractBaseUser` + `PermissionsMixin` gives you full control (email login, no username, a custom manager).',
    descriptionHi: 'Har asli Django project ko apna user model `AUTH_USER_MODEL` set karna chahिए **pehli migration se pehle**. Baad mein swap karna ek dardनाk, error-prone migration hai. `AbstractUser` aapको Django ke user mein fields add karने deता hai; `AbstractBaseUser` + `PermissionsMixin` aapको poora control deता hai (email login, koi username nahi, ek custom manager).',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**Choosing the foundation slab before you build the house, not after the walls are up.** Django ships with a default user "slab" — it works, but it assumes a `username` is the primary identifier and it is welded to a specific set of columns. If you pour your foundation (run your first migration) on that default slab and later decide you actually want email-based login or an extra `organisation` column baked into the core, you are not adding a room — you are jacking up the whole house to swap the slab underneath: a data migration that touches every foreign key pointing at users, every fixture, every test. If instead, on day one, you lay *your own* slab — even one that is byte-for-byte identical to Django\'s (`class User(AbstractUser): pass`) — then every later change is just adding a room: a new field, a new manager method, email as the login field. The cost of laying your own slab on day one is one extra class and one settings line. The cost of swapping later is a weekend and a risk of data loss.',
      hi: '**Ghar banाने se pehle foundation slab chunna, deewारें khadी hone ke baad nahi.** Django ek default user "slab" ke saath aaता hai — ye kaam karता hai, par ye maanता hai ki ek `username` primary identifier hai aur ye ek vishisht set ke columns se welded hai. Agar aap apni foundation daalते ho (apni pehli migration chalाते ho) us default slab par aur baad mein tay karते ho ki aap asal mein email-based login ya ek extra `organisation` column core mein baked chahते ho, aap ek room add nahi kar rahe — aap poore ghar ko jack up kar rahe ho slab ko badalने ke liye. Agar iske bजाy, pehle din, aap *apni* slab bichhाते ho — ek jо Django ki tarah byte-for-byte identical bhi ho (`class User(AbstractUser): pass`) — toh har baad ka change bस ek room add karna hai. Pehle din apni slab bichhाने ki cost ek extra class aur ek settings line hai. Baad mein swap karने ki cost ek weekend aur data loss ka risk hai.',
    },

    simple: `**Day one — the minimum**

\`\`\`python
# accounts/models.py
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass                    # identical to Django's user FOR NOW -- but now it is YOURS to extend

# settings.py -- set this BEFORE running the first migration
AUTH_USER_MODEL = "accounts.User"
\`\`\`

**Referencing the user model everywhere else**

\`\`\`python
# in models.py -- use the string, never import the class:
from django.conf import settings

class Article(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

# in views / serializers / anywhere at runtime:
from django.contrib.auth import get_user_model
User = get_user_model()          # NOT  from django.contrib.auth.models import User
\`\`\`

**\`AbstractUser\` — add fields, keep the rest**

\`\`\`python
class User(AbstractUser):
    organisation = models.ForeignKey("Org", null=True, on_delete=models.SET_NULL)
    is_email_verified = models.BooleanField(default=False)
    # still has: username, email, first_name, last_name, is_staff, is_active, groups, user_permissions, ...
\`\`\`

**\`AbstractBaseUser\` + \`PermissionsMixin\` — full control (email login, no username)**

\`\`\`python
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("Email is required")
        user = self.model(email=self.normalize_email(email), **extra)
        user.set_password(password)              # hashes
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"          # what you log in with
    REQUIRED_FIELDS = []             # extra prompts for createsuperuser (besides USERNAME_FIELD + password)

    def __str__(self):
        return self.email
\`\`\`

\`\`\`
AbstractUser          = the concrete default user, minus the table -> subclass to ADD fields, keep username/email/etc.
AbstractBaseUser      = auth essentials only (password, last_login) -> you define every field + USERNAME_FIELD
PermissionsMixin      = is_superuser, groups, user_permissions, has_perm() -> add alongside AbstractBaseUser
BaseUserManager       = normalize_email(), make_random_password() -> subclass for create_user / create_superuser

USERNAME_FIELD        the unique field used to log in ("email", "username", ...)
REQUIRED_FIELDS       fields createsuperuser prompts for IN ADDITION to USERNAME_FIELD and password
settings.AUTH_USER_MODEL   the "app_label.ModelName" string -- use it in every FK to the user
get_user_model()      the runtime way to get the active user class
\`\`\``,

    simpleHi: `**Pehla din — minimum**

\`\`\`python
# accounts/models.py
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass                    # ABHI ke liye Django ke user jaisा identical -- par ab ye AAPKA hai extend karने ko

# settings.py -- pehli migration chalाने se PEHLE ye set karो
AUTH_USER_MODEL = "accounts.User"
\`\`\`

**User model ko baaki har jagah reference karna**

\`\`\`python
# models.py mein -- string istemal karो, kabhi class import mat karो:
from django.conf import settings

class Article(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

# views / serializers / kahीं bhi runtime par:
from django.contrib.auth import get_user_model
User = get_user_model()          # NAHI  from django.contrib.auth.models import User
\`\`\`

**\`AbstractUser\` — fields add karो, baaki rakhо**

\`\`\`python
class User(AbstractUser):
    organisation = models.ForeignKey("Org", null=True, on_delete=models.SET_NULL)
    is_email_verified = models.BooleanField(default=False)
    # abhi bhi hai: username, email, first_name, last_name, is_staff, is_active, groups, ...
\`\`\`

**\`AbstractBaseUser\` + \`PermissionsMixin\` — poora control (email login, koi username nahi)**

\`\`\`python
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("Email is required")
        user = self.model(email=self.normalize_email(email), **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
\`\`\`

\`\`\`
AbstractUser          = concrete default user, table ke bina -> subclass karके fields ADD karो
AbstractBaseUser      = sirf auth essentials (password, last_login) -> aap har field + USERNAME_FIELD define karो
PermissionsMixin      = is_superuser, groups, user_permissions, has_perm() -> AbstractBaseUser ke saath add karो
BaseUserManager       = normalize_email() -> create_user / create_superuser ke liye subclass

USERNAME_FIELD        log in karने ke liye istemal kiya unique field ("email", "username")
REQUIRED_FIELDS       createsuperuser jinke liye prompt karता hai USERNAME_FIELD aur password ke ALAWA
settings.AUTH_USER_MODEL   "app_label.ModelName" string -- user ke har FK mein istemal karो
get_user_model()      active user class paने ka runtime tarika
\`\`\``,

    content: `## Why day one

\`AUTH_USER_MODEL\` is read the very first time migrations run and is baked into the migration graph. Changing it later means:

- a data migration to move every row from \`auth_user\` to your new table, preserving pks;
- updating every FK/M2M that points at the user (articles, comments, logs, sessions, admin log entries, …);
- re-running or editing historical migrations;
- fixing every fixture and test that assumed the old model.

The official docs are blunt: *"it is highly recommended to set up a custom user model, even if the default would be sufficient... you cannot easily change it later."* Cost on day one: two lines. Cost on year one: a migration project.

## The three levels

### 1. \`class User(AbstractUser): pass\` — a no-op that is not a no-op

Identical schema to Django's user, but the model now lives in *your* app. Every future field, method, or manager override is a one-line change. This is the right default when you are not sure — you lose nothing and keep every option open.

### 2. \`AbstractUser\` + extra fields — the common case

\`AbstractUser\` is Django's concrete user implementation with the table stripped off. Subclass it to add columns (\`phone\`, \`avatar\`, \`organisation\`, \`is_email_verified\`) while keeping \`username\`, \`email\`, \`first_name\`, \`last_name\`, \`is_staff\`, \`is_active\`, \`is_superuser\`, \`groups\`, \`user_permissions\`, and all the auth methods. You can also change field attributes — e.g. \`email = models.EmailField(unique=True)\` and \`USERNAME_FIELD = "email"\` to log in by email while still having a username column.

### 3. \`AbstractBaseUser\` + \`PermissionsMixin\` — full control

\`AbstractBaseUser\` gives you only the authentication core: the hashed \`password\`, \`last_login\`, and the methods (\`set_password\`, \`check_password\`, \`get_session_auth_hash\`). You define **every other field yourself**. \`PermissionsMixin\` adds \`is_superuser\`, \`groups\`, \`user_permissions\`, and \`has_perm\`/\`has_module_perms\` so the admin and \`DjangoModelPermissions\` still work.

You must provide:

- **\`USERNAME_FIELD\`** — the name of the unique field used as the login identifier (\`"email"\`).
- **\`REQUIRED_FIELDS\`** — a list of other field names \`createsuperuser\` should prompt for (not including \`USERNAME_FIELD\` or \`password\`). Often \`[]\`.
- **a manager** — subclass \`BaseUserManager\` with \`create_user(...)\` and \`create_superuser(...)\`. \`create_user\` must call \`set_password\` (never store plaintext) and \`normalize_email\`. Django calls these from \`createsuperuser\` and you call them in signup code.
- **\`is_active\`** — Django's auth backend checks it; a user with \`is_active=False\` cannot log in.
- **\`__str__\`** — used all over the admin.

### \`EMAIL_FIELD\` and other hooks

Set \`EMAIL_FIELD = "email"\` so \`user.get_email_field_name()\` and password-reset flows work. If you drop \`first_name\`/\`last_name\`, also skip \`get_full_name\`/\`get_short_name\` or the admin will error — or just keep a \`name\` field and implement them.

## Never import the concrete \`User\`

Two rules:

1. **In \`models.py\`** (FKs, M2Ms): use the string \`settings.AUTH_USER_MODEL\`. \`ForeignKey("auth.User", …)\` or \`ForeignKey(User, …)\` with a direct import hard-codes the default model and breaks a swappable setup.
2. **Everywhere else at runtime** (views, serializers, forms, signals, tests): use \`get_user_model()\`. \`from django.contrib.auth.models import User\` returns Django's built-in class even when your project uses a custom one — a subtle bug where half your code talks to the wrong model.

## The DRF angle

- A serializer for signup / profile is a normal \`ModelSerializer\` over \`get_user_model()\`; make \`password\` \`write_only\` and hash it in \`create()\` (Module 5 lesson 1).
- \`simplejwt\`'s \`TokenObtainPairSerializer\` authenticates using \`USERNAME_FIELD\` automatically — set it to \`"email"\` and users log in with email, no extra config.
- \`request.user\` is an instance of your model, so \`request.user.organisation\`, \`request.user.is_email_verified\`, etc. are available in permissions and views.

## Doing it after the fact

If you already migrated with the default user and have little data, the least-bad path is: reset the database (dev only), or write a careful data migration with \`--fake\` on the initial custom-user migration plus manual SQL to rename the table and repoint FKs. There are blog-length guides for this precisely because it is hard. The lesson: on the next project, first commit includes the custom user model.`,

    contentHi: `## Pehla din kyun

\`AUTH_USER_MODEL\` migrations pehli baar chalने par padha jाता hai aur migration graph mein baked hoता hai. Ise baad mein badalना matlab:

- har row ko \`auth_user\` se aapke naye table mein le jाने ke liye ek data migration, pks preserve karके;
- har FK/M2M jо user par point karता hai use update karna;
- historical migrations re-run ya edit karna;
- har fixture aur test fix karna.

Official docs blunt hain: *"ek custom user model set up karна highly recommended hai, chahे default kaafi ho... aap ise baad mein aasानी se nahi badल sakte."*

## Teen levels

### 1. \`class User(AbstractUser): pass\` — ek no-op jо no-op nahi hai

Django ke user jaisा identical schema, par model ab *aapke* app mein rehता hai. Har future field ek one-line change hai. Ye sahi default hai jab aap sure nahi — aap kuch nahi khoते.

### 2. \`AbstractUser\` + extra fields — aam case

\`AbstractUser\` Django ka concrete user hai table ke bina. Subclass karके columns add karो (\`phone\`, \`avatar\`, \`organisation\`) jabki \`username\`, \`email\`, \`is_staff\`, \`groups\` sab rakhो. Aap field attributes bhi badल sakte ho — \`email = models.EmailField(unique=True)\` aur \`USERNAME_FIELD = "email"\`.

### 3. \`AbstractBaseUser\` + \`PermissionsMixin\` — poora control

\`AbstractBaseUser\` aapको sirf authentication core deता hai: hashed \`password\`, \`last_login\`, aur methods. Aap **har doosra field khud** define karो. \`PermissionsMixin\` \`is_superuser\`, \`groups\`, \`has_perm\` add karता hai.

Aapको dena hoगा:

- **\`USERNAME_FIELD\`** — login identifier ke roop mein istemal kiye unique field ka naam (\`"email"\`).
- **\`REQUIRED_FIELDS\`** — doosre field names jinke liye \`createsuperuser\` prompt kare. Aksar \`[]\`.
- **ek manager** — \`BaseUserManager\` subclass \`create_user(...)\` aur \`create_superuser(...)\` ke saath. \`create_user\` ko \`set_password\` call karna chahिए.
- **\`is_active\`** — Django ka auth backend ise check karता hai.
- **\`__str__\`**.

## Kabhi concrete \`User\` import mat karो

Do niyam:

1. **\`models.py\` mein** (FKs, M2Ms): string \`settings.AUTH_USER_MODEL\` istemal karो.
2. **Baaki har jagah runtime par** (views, serializers, tests): \`get_user_model()\` istemal karो. \`from django.contrib.auth.models import User\` Django ki built-in class lautाता hai chahे aapka project ek custom istemal kare.

## DRF angle

- Signup / profile ke liye ek serializer \`get_user_model()\` par ek normal \`ModelSerializer\` hai; \`password\` ko \`write_only\` banаओ aur \`create()\` mein hash karो.
- \`simplejwt\` ka \`TokenObtainPairSerializer\` automatically \`USERNAME_FIELD\` istemal karके authenticate karता hai — ise \`"email"\` set karो aur users email se log in karें.
- \`request.user\` aapke model ka ek instance hai.

## Baad mein karna

Agar aap pehle se default user se migrate kar chuke ho aur thoड़ा data hai, sabse kam-bura path hai: database reset karo (sirf dev), ya ek careful data migration likhо. Sabak: agle project par, pehla commit custom user model include karता hai.`,

    examples: [
      {
        title: 'AbstractUser + extra fields; get_user_model(); settings.AUTH_USER_MODEL in a FK',
        titleHi: 'AbstractUser + extra fields; get_user_model(); ek FK mein settings.AUTH_USER_MODEL',
        code: `import django, os, sys, tempfile, textwrap
from django.conf import settings

# A custom user model must live in a real, importable app -- AUTH_USER_MODEL is resolved
# during django.setup(), before a __main__ script finishes running. So: build a tiny 'accounts' package.
_pkg = tempfile.mkdtemp()
os.makedirs(f"{_pkg}/accounts")
open(f"{_pkg}/accounts/__init__.py", "w").close()
open(f"{_pkg}/accounts/models.py", "w").write(textwrap.dedent("""
    from django.contrib.auth.models import AbstractUser
    from django.conf import settings
    from django.db import models

    class User(AbstractUser):
        organisation = models.CharField(max_length=50, blank=True)
        is_email_verified = models.BooleanField(default=False)

    class Article(models.Model):
        # reference the user model by the settings string, never by import
        author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
        title = models.CharField(max_length=100)
"""))
sys.path.insert(0, _pkg)

settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "accounts"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    AUTH_USER_MODEL="accounts.User")
django.setup()

from django.db import connection
from django.contrib.auth import get_user_model
from accounts.models import User, Article

with connection.schema_editor() as se:
    se.create_model(User); se.create_model(Article)

UserModel = get_user_model()
print("get_user_model() ->", UserModel.__name__, "| is our class:", UserModel is User)

ada = UserModel.objects.create_user("ada", password="pw", organisation="Acme")
print("has default fields:", ada.username, ada.is_staff, ada.is_active)
print("has our fields:", repr(ada.organisation), ada.is_email_verified)
print("password hashed:", ada.password.startswith("pbkdf2_"))

art = Article.objects.create(author=ada, title="Hi")
print("FK points at our user:", art.author.organisation, "| related name:", ada.article_set.count())

# the wrong way -- django.contrib.auth.models.User is NOT the active model here
from django.contrib.auth.models import User as BuiltinUser
print("builtin User is NOT the project user:", BuiltinUser is not UserModel)`,
        output: `get_user_model() -> User | is our class: True
has default fields: ada False True
has our fields: 'Acme' False
password hashed: True
FK points at our user: Acme | related name: 1
builtin User is NOT the project user: True
`,
        explain: "The custom user lives in a real accounts app (it cannot live in a __main__ script because AUTH_USER_MODEL is resolved during django.setup()). get_user_model() returns your accounts.User; the model keeps every AbstractUser field (username, is_staff, is_active, groups, auth methods) and adds organisation / is_email_verified. The Article FK uses the string settings.AUTH_USER_MODEL, so it points at your model. And from django.contrib.auth.models import User is still Django's builtin class -- a different object -- which is why you use get_user_model() at runtime.",
        explainHi: 'Custom user ek asli accounts app mein rehta hai (ye ek __main__ script mein nahi reh sakta kyunki AUTH_USER_MODEL django.setup() ke dauran resolve hota hai). get_user_model() aapka accounts.User lautata hai; model har AbstractUser field rakhta hai aur organisation / is_email_verified add karta hai. Article FK string settings.AUTH_USER_MODEL istemal karta hai.',
      },
      {
        title: 'AbstractBaseUser + PermissionsMixin: email login, custom manager, no username',
        titleHi: 'AbstractBaseUser + PermissionsMixin: email login, custom manager, koi username nahi',
        code: `import django, os, sys, tempfile, textwrap
from django.conf import settings

_pkg = tempfile.mkdtemp()
os.makedirs(f"{_pkg}/accounts")
open(f"{_pkg}/accounts/__init__.py", "w").close()
open(f"{_pkg}/accounts/models.py", "w").write(textwrap.dedent("""
    from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
    from django.db import models

    class UserManager(BaseUserManager):
        def create_user(self, email, password=None, **extra):
            if not email:
                raise ValueError("Email is required")
            user = self.model(email=self.normalize_email(email), **extra)
            user.set_password(password)
            user.save(using=self._db)
            return user
        def create_superuser(self, email, password=None, **extra):
            extra.setdefault("is_staff", True)
            extra.setdefault("is_superuser", True)
            return self.create_user(email, password, **extra)

    class User(AbstractBaseUser, PermissionsMixin):
        email = models.EmailField(unique=True)
        full_name = models.CharField(max_length=150, blank=True)
        is_active = models.BooleanField(default=True)
        is_staff = models.BooleanField(default=False)
        objects = UserManager()
        USERNAME_FIELD = "email"
        REQUIRED_FIELDS = []
        def __str__(self):
            return self.email
"""))
sys.path.insert(0, _pkg)

settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "accounts"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    AUTH_USER_MODEL="accounts.User")
django.setup()

from django.db import connection
from django.contrib.auth import authenticate, get_user_model
from accounts.models import User

with connection.schema_editor() as se:
    se.create_model(User)

u = User.objects.create_user(email="Ada@Example.com ", password="s3cret", full_name="Ada L")
print("email normalised:", u.email)                 # domain lower-cased, trailing space stripped
print("no username attr:", not hasattr(u, "username"))
print("USERNAME_FIELD:", User.USERNAME_FIELD)
print("check_password:", u.check_password("s3cret"), u.check_password("nope"))

# Django's auth backend uses USERNAME_FIELD -> authenticate(email=...) with the stored (normalised) value
class FakeReq: pass
print("authenticate by email:", authenticate(FakeReq(), email=u.email, password="s3cret") == u)

su = User.objects.create_superuser("boss@example.com", "pw")
print("superuser flags:", su.is_staff, su.is_superuser, "| has_perm('anything'):", su.has_perm("x.y"))`,
        output: `email normalised: Ada@example.com
no username attr: True
USERNAME_FIELD: email
check_password: True False
authenticate by email: True
superuser flags: True True | has_perm('anything'): True
`,
        explain: "AbstractBaseUser + PermissionsMixin gives full control: email is the USERNAME_FIELD, there is no username attribute at all, and the custom UserManager.create_user normalises the email (domain lower-cased, whitespace stripped -> Ada@example.com) and hashes the password via set_password. authenticate(request, email=..., password=...) works because Django's ModelBackend looks up {USERNAME_FIELD: value}. PermissionsMixin supplies is_superuser, groups, has_perm -- and a superuser's has_perm is always True.",
        explainHi: 'AbstractBaseUser + PermissionsMixin poora control deta hai: email USERNAME_FIELD hai, koi username attribute nahi, aur custom UserManager.create_user email normalise karta hai aur set_password se password hash karta hai. authenticate(request, email=..., password=...) kaam karta hai kyunki Django ka ModelBackend {USERNAME_FIELD: value} lookup karta hai. PermissionsMixin is_superuser, groups, has_perm deta hai.',
      },
      {
        title: 'Custom user + DRF: a signup serializer that hashes the password',
        titleHi: 'Custom user + DRF: ek signup serializer jo password hash karta hai',
        code: `import django, os, sys, tempfile, textwrap
from django.conf import settings

_pkg = tempfile.mkdtemp()
os.makedirs(f"{_pkg}/accounts")
open(f"{_pkg}/accounts/__init__.py", "w").close()
open(f"{_pkg}/accounts/models.py", "w").write(textwrap.dedent("""
    from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
    from django.db import models

    class UserManager(BaseUserManager):
        def create_user(self, email, password=None, **x):
            u = self.model(email=self.normalize_email(email), **x)
            u.set_password(password); u.save(using=self._db); return u

    class User(AbstractBaseUser, PermissionsMixin):
        email = models.EmailField(unique=True)
        display_name = models.CharField(max_length=80, blank=True)
        is_active = models.BooleanField(default=True)
        is_staff = models.BooleanField(default=False)
        objects = UserManager()
        USERNAME_FIELD = "email"
        REQUIRED_FIELDS = []
"""))
sys.path.insert(0, _pkg)

settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "accounts"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    AUTH_USER_MODEL="accounts.User")
django.setup()

from django.db import connection
from django.contrib.auth import get_user_model
from accounts.models import User
from rest_framework import serializers

with connection.schema_editor() as se:
    se.create_model(User)

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    class Meta:
        model = get_user_model()
        fields = ["id", "email", "display_name", "password"]

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)   # hashes via the manager

s = SignupSerializer(data={"email": "bo@example.com", "display_name": "Bo", "password": "longenough"})
s.is_valid(raise_exception=True)
user = s.save()
print("created:", user.email, user.display_name)
print("password hashed + verifies:", user.password.startswith("pbkdf2_"), user.check_password("longenough"))
print("output has no password:", "password" not in SignupSerializer(user).data)
print("output:", dict(SignupSerializer(user).data))

short = SignupSerializer(data={"email": "x@example.com", "password": "short"})
print("short password rejected:", short.is_valid(), list(short.errors))`,
        output: `created: bo@example.com Bo
password hashed + verifies: True True
output has no password: True
output: {'id': 1, 'email': 'bo@example.com', 'display_name': 'Bo'}
short password rejected: False ['password']
`,
        explain: "A signup serializer is an ordinary ModelSerializer over get_user_model(). password is declared write_only + min_length=8 (not a model field), and create() delegates to the manager's create_user, which hashes. The result: the row stores a hashed password that check_password verifies, .data never contains password (write-only), and a too-short password is a clean 400 with the error under password -- the exact same validation model as Module 5.",
        explainHi: 'Ek signup serializer get_user_model() par ek saadharan ModelSerializer hai. password write_only + min_length=8 declare kiya hai, aur create() manager ke create_user ko delegate karta hai, jo hash karta hai. Parinam: row ek hashed password store karta hai, .data mein kabhi password nahi, aur ek chhota password ek saaf 400 hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# models.py
from django.contrib.auth.models import User

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
# this hard-codes auth.User -- if the project ever swaps in a custom user, this FK still points at the old table`,
        right: `from django.conf import settings

class Comment(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)`,
        why: 'A `ForeignKey` to the imported `User` class bakes `auth.User` into the migration. `settings.AUTH_USER_MODEL` is a string (`"accounts.User"`) resolved lazily, so the same code works whether the project uses the default user or a custom one, and a future swap does not orphan this FK. Use the setting string for every FK/M2M/O2O that points at the user model, in every app.',
        whyHi: 'Imported `User` class ke ek `ForeignKey` `auth.User` ko migration mein bake karता hai. `settings.AUTH_USER_MODEL` ek string hai (`"accounts.User"`) jо lazily resolve hoती hai, toh wahi code kaam karता hai chahे project default user istemal kare ya custom. User model par point karने waale har FK/M2M/O2O ke liye setting string istemal karो.',
      },
      {
        wrong: `# a view / serializer / test
from django.contrib.auth.models import User

def get_active_admins():
    return User.objects.filter(is_staff=True, is_active=True)
# on a project with a custom user model this queries the WRONG (unused) table`,
        right: `from django.contrib.auth import get_user_model

def get_active_admins():
    return get_user_model().objects.filter(is_staff=True, is_active=True)`,
        why: '`django.contrib.auth.models.User` is always Django\'s built-in class, regardless of `AUTH_USER_MODEL`. On a project with a custom user it still imports fine and silently queries `auth_user` — which has no rows because the app writes to `accounts_user`. `get_user_model()` returns whatever `AUTH_USER_MODEL` points at. Use it in every runtime context; use the settings string in `models.py`.',
        whyHi: '`django.contrib.auth.models.User` hamesha Django ki built-in class hai, `AUTH_USER_MODEL` ki parwाh kiye bina. Ek custom user waale project par ye abhi bhi theek import hoती hai aur chupchaap `auth_user` query karती hai — jismें koi rows nahi. `get_user_model()` jо bhi `AUTH_USER_MODEL` point karता hai wo lautाता hai.',
      },
      {
        wrong: `# it is week 8, the app has 5000 users, 12 models with a user FK, and 200 tests
# NOW someone wants email login and an 'organisation' field on the user
# -> a multi-day data migration touching every user FK, every fixture, every test`,
        right: `# week 1, first commit:
class User(AbstractUser):
    pass
# settings.py: AUTH_USER_MODEL = "accounts.User"
# migrate once. Extending it later (email login, org field) is then a normal migration.`,
        why: 'The pain is not the feature — it is that `AUTH_USER_MODEL` is fixed at first-migration time and every user FK, every migration, every fixture, and every test encodes the choice. Swapping the model afterwards is a project. Starting with an empty `class User(AbstractUser): pass` costs nothing and makes every later user-model change (fields, managers, login field) an ordinary migration. Always include it in the first commit.',
        whyHi: 'Dard feature nahi hai — ye hai ki `AUTH_USER_MODEL` first-migration time par fix hoता hai aur har user FK, har migration, har fixture, har test chunaव encode karता hai. Model ko baad mein swap karna ek project hai. Ek khali `class User(AbstractUser): pass` se shuru karna kuch cost nahi karता. Ise hamesha pehle commit mein include karो.',
      },
    ],

    realWorld: [
      {
        en: '**`class User(AbstractUser): pass` in the first commit of nearly every serious Django project** — even when the default would do. It is a one-time insurance premium: the day someone needs `phone_verified`, a `tenant` FK, or email login, it is a normal field migration instead of a swap.',
        hi: '**Lगbhag har serious Django project ke pehle commit mein `class User(AbstractUser): pass`** — chahे default kaam kare. Ye ek one-time insurance premium hai.',
      },
      {
        en: '**`AbstractBaseUser` + email login for consumer products** — no username, `USERNAME_FIELD = "email"`, a `UserManager` with `create_user(email, password)`, `simplejwt` picking up `USERNAME_FIELD` so `POST /token/ {email, password}` just works. The user table has exactly the columns the product needs.',
        hi: '**Consumer products ke liye `AbstractBaseUser` + email login** — koi username nahi, `USERNAME_FIELD = "email"`, ek `UserManager`, `simplejwt` `USERNAME_FIELD` pick karता hai toh `POST /token/ {email, password}` bस kaam karता hai.',
      },
      {
        en: '**A `Profile` O2O when the user model is already custom but you want to keep it lean** — auth-critical fields (`email`, `is_active`, `is_staff`) on `User`, everything product-specific (`bio`, `avatar`, `preferences`, `timezone`) on `Profile` created by a `post_save` signal. Keeps the user table small and the auth queries fast.',
        hi: '**Ek `Profile` O2O jab user model pehle se custom hai par aap ise lean rakhna chahте ho** — auth-critical fields `User` par, sab product-specific (`bio`, `avatar`, `preferences`) `Profile` par jо ek `post_save` signal se banता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why should you set a custom user model at the start of a project, and what are the three ways to define one?',
        qHi: 'Aapको ek project ki shuruat mein ek custom user model kyun set karna chahिए, aur ise define karने ke teen tarike kya hain?',
        a: 'AUTH_USER_MODEL is consumed the first time migrations run and it is encoded into the migration graph, into every foreign key that points at the user, and effectively into every fixture and test. Changing it after you have data means a data migration that moves every user row to a new table while preserving primary keys, repoints every user foreign key across all your apps, and often involves editing or faking historical migrations — it is a multi-day project with real risk of data loss. Setting it on day one costs one model class and one settings line. There are three levels. First, class User subclassing AbstractUser with just pass in the body — schema-identical to Django\'s user but now living in your app, so any future change is a one-line addition. This is the safe default when you are unsure. Second, subclass AbstractUser and add fields — AbstractUser is Django\'s concrete user with the table removed, so you keep username, email, names, the is_staff and is_active and is_superuser flags, groups and permissions, and all the auth methods, and you add your own columns like phone or organisation; you can also flip email to unique and set USERNAME_FIELD to email to log in by email. Third, AbstractBaseUser plus PermissionsMixin for full control — AbstractBaseUser gives only the password and last_login and the core auth methods, you define every other field, and PermissionsMixin adds the superuser flag, groups, permissions, and has_perm so the admin still works. At this level you must supply USERNAME_FIELD, REQUIRED_FIELDS, and a manager subclassing BaseUserManager with create_user and create_superuser that call set_password. Two rules regardless of level: in models dot py reference the user via the settings dot AUTH_USER_MODEL string, and everywhere else at runtime use get_user_model, never import django dot contrib dot auth dot models dot User directly because that is always the builtin class.',
        aHi: 'AUTH_USER_MODEL migrations pehli baar chalने par consume hoता hai aur ye migration graph mein, user par point karने waale har foreign key mein, aur har fixture aur test mein encode hoता hai. Ise data hone ke baad badalना matlab ek data migration jо har user row ko ek naye table mein le jाती hai primary keys preserve karके, har user foreign key repoint karती hai, aur aksar historical migrations edit karती hai — ye ek multi-day project hai data loss ke asli risk ke saath. Ise pehle din set karna ek model class aur ek settings line cost karता hai. Teen levels hain. Pehla, class User AbstractUser ko subclass karके body mein bस pass ke saath — schema-identical par ab aapke app mein. Doosra, AbstractUser subclass karके fields add karो — aap username, email, flags, groups, permissions rakhते ho aur apne columns add karते ho. Teesra, AbstractBaseUser plus PermissionsMixin poore control ke liye — aap har field define karो, aur USERNAME_FIELD, REQUIRED_FIELDS, aur ek manager dena hoगा. Do niyam: models dot py mein settings string se reference karो, baaki har jagah get_user_model istemal karो.',
      },
      {
        q: 'What is the difference between `settings.AUTH_USER_MODEL` and `get_user_model()`, and when do you use each?',
        qHi: '`settings.AUTH_USER_MODEL` aur `get_user_model()` mein kya antar hai, aur aap har ek kab istemal karते ho?',
        a: 'settings dot AUTH_USER_MODEL is a string in the form app-label dot ModelName, like accounts dot User. get_user_model is a function that returns the actual model class that string resolves to. You use the string in models dot py — specifically in the definition of any foreign key, many-to-many, or one-to-one that points at the user model. The reason is timing: when Django loads models it processes them in a particular order, and importing the concrete user class at module load time can create a circular import or, worse, bake the wrong model into a migration. The string is resolved lazily by Django\'s app registry after all models are loaded, so a foreign key to settings dot AUTH_USER_MODEL works correctly whether the project uses the default user or a custom one, and it does not break if the custom model is defined in an app that loads later. You use get_user_model everywhere else — in views, serializers, forms, signal handlers, management commands, and tests — anywhere you need the class itself at runtime to query it or instantiate it. The trap it avoids is that from django dot contrib dot auth dot models import User always gives you Django\'s builtin User class, regardless of AUTH_USER_MODEL. On a project with a custom user model that import still succeeds silently and you end up querying the unused auth_user table, which has no rows, or creating users in the wrong model. get_user_model consults AUTH_USER_MODEL and hands back whatever the project actually uses. So: the settings string for structural references in models, the function for runtime references everywhere else, and never the direct import.',
        aHi: 'settings dot AUTH_USER_MODEL app-label dot ModelName roop mein ek string hai, jaise accounts dot User. get_user_model ek function hai jо wo actual model class lautाता hai jise wo string resolve karता hai. Aap string ko models dot py mein istemal karते ho — khaskार kisi bhi foreign key, many-to-many, ya one-to-one ki definition mein jо user model par point karता hai. Karan timing hai: jab Django models load karता hai, module load time par concrete user class import karna ek circular import banа sakta hai ya galat model ko ek migration mein bake kar sakta hai. String Django ke app registry dwara lazily resolve hoती hai saare models load hone ke baad. Aap get_user_model baaki har jagah istemal karते ho — views, serializers, forms, signal handlers, tests mein. Jо trap ye avoid karता hai wo ye hai ki from django dot contrib dot auth dot models import User hamesha Django ki builtin User class deता hai, AUTH_USER_MODEL ki parwाh kiye bina.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django (`AUTH_USER_MODEL = "__main__.User"`). `class User(AbstractUser)` with an extra `phone = CharField(blank=True)` and `is_verified = BooleanField(default=False)`. `class Note(models.Model)` with `owner = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)`. Create tables, create a user via `create_user`, a note. Assert: `get_user_model() is User`; the user has both default fields (`username`, `is_staff`) and your fields (`phone`, `is_verified`); the password is hashed; the note\'s `owner` is your user and `user.note_set.count() == 1`; `from django.contrib.auth.models import User as B; B is not get_user_model()`.',
        taskHi: 'Standalone Django (`AUTH_USER_MODEL = "__main__.User"`). `class User(AbstractUser)` extra `phone` aur `is_verified` ke saath. `Note` model `owner = ForeignKey(settings.AUTH_USER_MODEL, ...)` ke saath. Tables banаओ, user + note banаओ. Assert karो.',
        hint: '`AUTH_USER_MODEL` must be in `settings.configure(...)`. `Meta: app_label = "__main__"` on both models. `connection.schema_editor()`. `get_user_model()` after `django.setup()`. `User.objects.create_user("ada", password="pw", phone="123")`.',
        hintHi: '`AUTH_USER_MODEL` `settings.configure(...)` mein hona chahिए. Dono models par `Meta: app_label = "__main__"`. `User.objects.create_user("ada", password="pw", phone="123")`.',
      },
      {
        task: 'Build an `AbstractBaseUser` + `PermissionsMixin` user with `email` (unique, `USERNAME_FIELD`), `full_name`, `is_active`, `is_staff`, `REQUIRED_FIELDS = []`, and a `UserManager(BaseUserManager)` with `create_user(email, password, **extra)` (calls `normalize_email` + `set_password`) and `create_superuser`. Assert: `create_user("  Ada@EXAMPLE.com ", "pw")` stores `email == "Ada@example.com"` (domain lowered, spaces stripped); `check_password` works; `hasattr(user, "username")` is `False`; `User.USERNAME_FIELD == "email"`; `create_superuser` sets `is_staff` and `is_superuser` True and `has_perm("anything")` returns True.',
        taskHi: 'Ek `AbstractBaseUser` + `PermissionsMixin` user banाओ `email` (unique, `USERNAME_FIELD`), `full_name`, `is_active`, `is_staff` ke saath, aur ek `UserManager`. Assert karो.',
        hint: '`from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager`. `self.model(email=self.normalize_email(email), **extra)`. `normalize_email` only lower-cases the domain part, not the local part. `PermissionsMixin` gives `has_perm` -> superuser always True.',
        hintHi: '`from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager`. `self.model(email=self.normalize_email(email), **extra)`. `normalize_email` sirf domain part lower-case karता hai.',
      },
      {
        task: 'With the `AbstractBaseUser` email-login model from exercise 2, add `rest_framework` and write `SignupSerializer(ModelSerializer)` over `get_user_model()` with `fields = ["id", "email", "full_name", "password"]`, `password` `write_only` + `min_length=8`, and `create()` delegating to `get_user_model().objects.create_user(**validated_data)`. Assert: a valid signup creates a user whose password is hashed and verifies; `.data` has no `password`; `password="short"` -> `is_valid()` False; a duplicate email -> `is_valid()` False (auto `UniqueValidator` from `unique=True`).',
        taskHi: 'Exercise 2 ke email-login model ke saath, `rest_framework` add karके `SignupSerializer(ModelSerializer)` likhо `get_user_model()` par, `password` `write_only` + `min_length=8`, `create()` `create_user` ko delegate kare. Assert karो.',
        hint: '`Meta.model = get_user_model()`. `def create(self, validated_data): return get_user_model().objects.create_user(**validated_data)`. `unique=True` on `email` -> DRF adds a `UniqueValidator` automatically (Module 5 lesson 2).',
        hintHi: '`Meta.model = get_user_model()`. `def create(self, vd): return get_user_model().objects.create_user(**vd)`. `email` par `unique=True` -> DRF auto `UniqueValidator` add karta hai.',
      },
    ],

    keyTakeaways: [
      'Set `AUTH_USER_MODEL = "app.User"` and define your own user model in the FIRST commit, even if it is `class User(AbstractUser): pass`. It is fixed at first-migration time; swapping later is a multi-day data migration touching every user FK, fixture, and test.',
      'Three levels: (1) `class User(AbstractUser): pass` — schema-identical, but now yours to extend; (2) `AbstractUser` + fields — keep `username`/`email`/flags/`groups`/auth methods, add columns, optionally `email` unique + `USERNAME_FIELD = "email"`; (3) `AbstractBaseUser` + `PermissionsMixin` — define every field, full control.',
      'At level 3 you MUST provide: `USERNAME_FIELD` (the unique login field), `REQUIRED_FIELDS` (extra `createsuperuser` prompts, often `[]`), a `BaseUserManager` subclass with `create_user`/`create_superuser` (must `set_password` + `normalize_email`), `is_active`, and `__str__`.',
      'In `models.py` (every FK/M2M/O2O to the user): use the STRING `settings.AUTH_USER_MODEL` — resolved lazily, works with default or custom, survives a swap.',
      'Everywhere else at runtime (views, serializers, forms, signals, tests): use `get_user_model()`. `from django.contrib.auth.models import User` is ALWAYS Django\'s builtin class — on a custom-user project it silently queries the wrong, empty table.',
      '`AbstractBaseUser` gives only `password` + `last_login` + auth methods; `PermissionsMixin` adds `is_superuser`/`groups`/`user_permissions`/`has_perm` so the admin and `DjangoModelPermissions` keep working.',
      'DRF: a signup/profile serializer is a normal `ModelSerializer` over `get_user_model()` with `password` `write_only` + hashed in `create()`. `simplejwt` uses `USERNAME_FIELD` automatically — set it to `"email"` and `POST /token/ {email, password}` works with no extra config.',
      '`normalize_email` lower-cases only the DOMAIN part (`Ada@EXAMPLE.com` -> `Ada@example.com`). Set `EMAIL_FIELD = "email"` for password-reset flows. Keep a `Profile` O2O for bulky product fields to keep the user table lean.',
    ],
    keyTakeawaysHi: [
      '`AUTH_USER_MODEL = "app.User"` set karो aur apna user model PEHLE commit mein define karो, chahे wo `class User(AbstractUser): pass` ho. Ye first-migration time par fix hoता hai; baad mein swap ek multi-day data migration hai.',
      'Teen levels: (1) `class User(AbstractUser): pass` — schema-identical, par ab aapka; (2) `AbstractUser` + fields — `username`/`email`/flags/`groups` rakhо, columns add karो; (3) `AbstractBaseUser` + `PermissionsMixin` — har field define karो.',
      'Level 3 par aapको DENA hoगा: `USERNAME_FIELD`, `REQUIRED_FIELDS` (aksar `[]`), ek `BaseUserManager` subclass `create_user`/`create_superuser` ke saath (`set_password` + `normalize_email` zaroori), `is_active`, aur `__str__`.',
      '`models.py` mein (user ke har FK/M2M/O2O): STRING `settings.AUTH_USER_MODEL` istemal karो — lazily resolved, default ya custom ke saath kaam karता hai.',
      'Baaki har jagah runtime par (views, serializers, forms, signals, tests): `get_user_model()` istemal karो. `from django.contrib.auth.models import User` HAMESHA Django ki builtin class hai — ek custom-user project par chupchaap galat, khali table query karता hai.',
      '`AbstractBaseUser` sirf `password` + `last_login` + auth methods deता hai; `PermissionsMixin` `is_superuser`/`groups`/`has_perm` add karता hai taaki admin aur `DjangoModelPermissions` kaam karें.',
      'DRF: ek signup/profile serializer `get_user_model()` par ek normal `ModelSerializer` hai `password` `write_only` + `create()` mein hashed. `simplejwt` `USERNAME_FIELD` automatically istemal karता hai — ise `"email"` set karो.',
      '`normalize_email` sirf DOMAIN part lower-case karता hai. Password-reset flows ke liye `EMAIL_FIELD = "email"` set karो. Bulky product fields ke liye ek `Profile` O2O rakhो.',
    ],
  },
];
