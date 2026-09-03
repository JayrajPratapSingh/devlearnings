/**
 * Django Complete Course — Module 10: Testing, Settings & Production Deployment, lessons 1-3.
 *
 * Lesson 1: testing with pytest-django — DJANGO_SETTINGS_MODULE / pytest.ini, the db /
 *           django_db marker (transaction rollback per test), --reuse-db, client /
 *           admin_client / rf / settings fixtures, django_assert_num_queries,
 *           TransactionTestCase vs the wrapped default, pytest vs unittest TestCase.
 * Lesson 2: factories, mocking & coverage — factory_boy DjangoModelFactory, Sequence /
 *           Faker / SubFactory / LazyAttribute / post_generation, build vs create,
 *           create_batch, traits; mocking external HTTP (responses / unittest.mock),
 *           @override_settings, freezegun; coverage.py + branch coverage + what to measure.
 * Lesson 3: settings & 12-factor — one settings module + environment, django-environ,
 *           SECRET_KEY / DATABASE_URL / DEBUG from env, .env (gitignored) for local only,
 *           the base/dev/prod split alternative, DJANGO_SETTINGS_MODULE, secrets, check --deploy.
 *
 * Conventions: see course-django-module9.ts header. Testing examples RUN pytest / django
 * as a SUBPROCESS against a real temp app package (tempfile.mkdtemp() + write settings.py +
 * an app/ with models.py) and normalise timing / progress in the output with re.sub.
 * factory_boy examples: settings.configure + schema_editor.create_model then define
 * DjangoModelFactory subclasses. Backticks inside simple/content are \`.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_10: CourseLesson[] = [
  {
    slug: 'dj-testing-with-pytest-django',
    title: 'Testing with `pytest-django`',
    titleHi: '`pytest-django` Ke Saath Testing',
    description: 'Django ships a test runner built on `unittest`; `pytest-django` layers pytest on top — plain `assert`, fixtures, parametrisation, and a much better experience. The key concepts: how the test database is created and reset, the `db` marker that wraps each test in a rolled-back transaction, and the fixtures that replace `self.client` and friends.',
    descriptionHi: 'Django `unittest` par bana ek test runner deta hai; `pytest-django` uske upar pytest layer karta hai — plain `assert`, fixtures, parametrisation, aur ek kaafi behtar experience. Mukhya concepts: test database kaise banta aur reset hota hai, `db` marker jo har test ko ek rolled-back transaction mein wrap karta hai, aur wo fixtures jo `self.client` aur iske saathi replace karte hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A chemistry class where every student works on an identical, freshly-wiped bench.** Setting up the room once — installing the fume hood, running the gas lines, stocking the standard reagents — is building the **test database** from your migrations; it happens once per run (and with `--reuse-db`, once ever, until the schema changes). Then each experiment (**each test**) gets the bench in the same known state: you run your reaction inside a tray, and when you are done the tray is tipped out — nothing you spilled carries over to the next student. That tipping-out is the **transaction rollback** the `db` fixture does around every test: your test can create fifty rows, and the next test still sees an empty table. A few experiments genuinely need to light the whole room on fire — test the gas shutoff, the sprinklers — and those cannot be done in a tray; they need the real room and a full manual reset afterward. That is `transaction=True` / `TransactionTestCase`: slower, used only when the thing under test is itself about transactions or `on_commit`.',
      hi: '**Ek chemistry class jahaan har student ek identical, taaza-poonchhe bench par kaam karta hai.** Room ko ek baar set karna — fume hood lagana, gas lines chalana, standard reagents stock karna — aapke migrations se **test database** banana hai; ye prati run ek baar hota hai (aur `--reuse-db` ke saath, ek baar hi, jab tak schema na badle). Phir har experiment (**har test**) ko bench usi known state mein milta hai: aap apni reaction ek tray ke andar chalate ho, aur jab aap ho jaate ho tray ulti kar di jaati hai — jo aapne giraya wo agle student tak nahi jaata. Wo ulti karna wo **transaction rollback** hai jo `db` fixture har test ke around karta hai: aapka test pachas rows bana sakta hai, aur agla test abhi bhi ek khali table dekhta hai. Kuch experiments ko sach mein poore room mein aag lagani hoti hai — gas shutoff test karo — aur wo ek tray mein nahi ho sakte. Wo `transaction=True` / `TransactionTestCase` hai: dheema, sirf tab jab test ke andar ki cheez khud transactions ke baare mein ho.',
    },

    simple: `**Setup — tell pytest where the settings are**

\`\`\`ini
# pytest.ini  (or [tool.pytest.ini_options] in pyproject.toml)
[pytest]
DJANGO_SETTINGS_MODULE = myproject.settings.test
python_files = test_*.py *_test.py
addopts = --reuse-db --strict-markers
\`\`\`

\`\`\`bash
pip install pytest pytest-django
pytest                    # discovers + runs
pytest -q -k "checkout"   # quiet, only tests matching "checkout"
pytest --reuse-db         # keep the test DB between runs (recreate only if migrations changed)
pytest --create-db        # force-rebuild the test DB
pytest -x --lf            # stop on first failure, then run last-failed first
\`\`\`

**A test needs the database — opt in**

\`\`\`python
import pytest
from shop.models import Order

@pytest.mark.django_db                     # this test may touch the DB
def test_order_total():
    o = Order.objects.create(subtotal=100, tax=8)
    assert o.total == 108

def test_pure_logic():                     # NO marker -> touching the DB raises
    assert format_money(108) == "$1.08"
\`\`\`

\`\`\`
@pytest.mark.django_db      wraps the test in a transaction that is ROLLED BACK at the end
                            -> every test starts from the migrated-but-empty schema
django_db(transaction=True) real commits + a full flush after -> for on_commit / select_for_update
                            / code that manages its own transactions. Slower.
a test without the marker that hits the DB -> "Database access not allowed, use django_db"
\`\`\`

**The fixtures (replace \`self.client\` etc.)**

\`\`\`python
def test_view(client):                     # django.test.Client
    resp = client.get("/health/")
    assert resp.status_code == 200

def test_admin(admin_client):              # a Client already logged in as a superuser
    assert admin_client.get("/admin/").status_code == 200

def test_request(rf):                      # RequestFactory
    request = rf.post("/x/", {"a": 1})

def test_with_setting(settings):           # mutate settings for THIS test only, auto-restored
    settings.FEATURE_X = True

def test_email(mailoutbox):                # captured emails
    send_welcome(...)
    assert len(mailoutbox) == 1

@pytest.fixture
def order(db):                             # your own fixture -- depends on db
    return Order.objects.create(subtotal=50)
\`\`\`

**Query-count assertions**

\`\`\`python
def test_list_is_not_n_plus_1(client, django_assert_num_queries):
    OrderFactory.create_batch(20)
    with django_assert_num_queries(3):     # fails if the view regresses to an N+1
        client.get("/orders/")
\`\`\`

\`\`\`
pytest fixture     vs   Django TestCase attribute
client                  self.client
rf                      RequestFactory()
settings                @override_settings / self.settings
django_assert_num_queries   self.assertNumQueries
admin_client            (build it yourself)
django_capture_on_commit_callbacks   run on_commit callbacks in a django_db test
\`\`\``,

    simpleHi: `**Setup — pytest ko batao settings kahaan hain**

\`\`\`ini
# pytest.ini  (ya pyproject.toml mein [tool.pytest.ini_options])
[pytest]
DJANGO_SETTINGS_MODULE = myproject.settings.test
python_files = test_*.py *_test.py
addopts = --reuse-db --strict-markers
\`\`\`

\`\`\`bash
pip install pytest pytest-django
pytest                    # discover + run
pytest -q -k "checkout"   # quiet, sirf "checkout" match karte tests
pytest --reuse-db         # runs ke beech test DB rakho (sirf migrations badalne par recreate)
pytest --create-db        # test DB force-rebuild
pytest -x --lf            # pehli failure par ruko, phir last-failed pehle chalao
\`\`\`

**Ek test ko database chahiye — opt in karo**

\`\`\`python
import pytest
from shop.models import Order

@pytest.mark.django_db                     # ye test DB chhoo sakta hai
def test_order_total():
    o = Order.objects.create(subtotal=100, tax=8)
    assert o.total == 108

def test_pure_logic():                     # KOI marker NAHI -> DB chhoona raise karta hai
    assert format_money(108) == "$1.08"
\`\`\`

\`\`\`
@pytest.mark.django_db      test ko ek transaction mein wrap karta hai jo ant mein ROLLED BACK
                            -> har test migrated-but-empty schema se shuru
django_db(transaction=True) real commits + baad mein ek full flush -> on_commit / select_for_update
                            / apne transactions manage karne wale code ke liye. Dheema.
bina marker ke ek test jo DB hit karta hai -> "Database access not allowed, use django_db"
\`\`\`

**Fixtures (\`self.client\` etc. replace karte hain)**

\`\`\`python
def test_view(client):                     # django.test.Client
    resp = client.get("/health/")
    assert resp.status_code == 200

def test_admin(admin_client):              # ek superuser ke roop mein pehle se logged in Client
    assert admin_client.get("/admin/").status_code == 200

def test_request(rf):                      # RequestFactory
    request = rf.post("/x/", {"a": 1})

def test_with_setting(settings):           # SIRF IS test ke liye settings mutate karo, auto-restored
    settings.FEATURE_X = True

def test_email(mailoutbox):                # captured emails
    send_welcome(...)
    assert len(mailoutbox) == 1

@pytest.fixture
def order(db):                             # aapka apna fixture -- db par depend karta hai
    return Order.objects.create(subtotal=50)
\`\`\`

**Query-count assertions**

\`\`\`python
def test_list_is_not_n_plus_1(client, django_assert_num_queries):
    OrderFactory.create_batch(20)
    with django_assert_num_queries(3):     # fail agar view ek N+1 par regress kare
        client.get("/orders/")
\`\`\`

\`\`\`
pytest fixture     vs   Django TestCase attribute
client                  self.client
rf                      RequestFactory()
settings                @override_settings / self.settings
django_assert_num_queries   self.assertNumQueries
admin_client            (khud banao)
django_capture_on_commit_callbacks   ek django_db test mein on_commit callbacks chalao
\`\`\``,

    content: `## What \`pytest-django\` gives you

Django's own test runner (\`manage.py test\`) is built on \`unittest\`: you write \`class FooTest(TestCase)\` with \`self.assertEqual\`. It works, but pytest is a better experience — plain \`assert\` with rich failure introspection, function-based tests, powerful fixtures, \`@parametrize\`, and a huge plugin ecosystem (Module 9). \`pytest-django\` is the bridge.

**Configuration.** pytest needs to know your settings module. Put \`DJANGO_SETTINGS_MODULE = myproject.settings.test\` in \`pytest.ini\` / \`setup.cfg\` / \`pyproject.toml\`. A dedicated \`settings/test.py\` typically: a fast password hasher (\`PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]\`), an in-memory or local SQLite/Postgres, email to \`locmem\`, \`DEBUG = False\`, and Celery in eager mode.

## The test database

On the first test that needs the DB, \`pytest-django\` **creates a test database** (named \`test_<yourdb>\`) by running all your migrations against it. This is why a broken migration fails your whole suite at collection time.

- **\`--reuse-db\`** — keep that test database between runs instead of dropping it. The next run skips the create+migrate step entirely (seconds saved) — but if you changed a migration, you must add \`--create-db\` once to rebuild. Most teams put \`--reuse-db\` in \`addopts\` and remember \`--create-db\` when migrations move.
- **\`--create-db\`** — force a fresh rebuild.
- **\`--nomigrations\`** (with \`pytest-django\`) or \`--no-migrations\` — build the schema directly from the models, skipping the migration history. Much faster, but it does not exercise your migrations, so run the real path in CI.

## The \`db\` fixture / \`django_db\` marker

A test that touches the ORM must request database access, or pytest-django raises *"Database access not allowed — use the 'django_db' mark, or the 'db' or 'transactional_db' fixtures"*. This is deliberate: it keeps your pure-logic tests honestly pure and fast.

\`\`\`python
@pytest.mark.django_db
def test_x(): ...

# or, via a fixture your own fixtures depend on:
@pytest.fixture
def order(db):
    return Order.objects.create(...)
\`\`\`

**How isolation works.** The plain \`db\` fixture wraps each test in a **transaction that is rolled back** when the test finishes (using savepoints for nested \`atomic()\`). Your test can create, update, delete freely; none of it persists. The next test starts from the same migrated-but-empty state. This is fast — a rollback is cheap — and it is why 1,000 db tests do not leave 1,000 tables' worth of junk.

**When rollback isn't enough — \`transaction=True\`.** Some things cannot be tested inside an outer transaction:

- \`transaction.on_commit()\` callbacks — they only fire on a real commit, which the rollback prevents. (Or use the \`django_capture_on_commit_callbacks\` fixture to run them explicitly.)
- Code that opens its own \`atomic()\` block and tests rollback behaviour.
- \`select_for_update()\` across threads, testing actual DB-level locking.
- A view whose behaviour depends on data being committed and visible to another connection.

\`@pytest.mark.django_db(transaction=True)\` (or \`TransactionTestCase\`) uses **real commits** and does a **full table flush** after each test instead of a rollback — correct for those cases, but noticeably slower, so use it only where needed.

## The fixtures

| pytest-django fixture | replaces |
|---|---|
| \`client\` | \`self.client\` (a \`django.test.Client\`) |
| \`async_client\` | an \`AsyncClient\` |
| \`admin_client\` | a \`client\` logged in as a fresh superuser |
| \`admin_user\` | that superuser |
| \`rf\` | \`RequestFactory()\` |
| \`settings\` | \`@override_settings\` — mutate attributes, auto-restored after the test |
| \`mailoutbox\` | \`django.core.mail.outbox\` — the list of sent \`EmailMessage\`s |
| \`django_assert_num_queries(n)\` | \`self.assertNumQueries(n)\` |
| \`django_assert_max_num_queries(n)\` | assert **at most** n queries |
| \`django_capture_on_commit_callbacks(execute=True)\` | run pending \`on_commit\` callbacks |
| \`django_user_model\` | \`get_user_model()\` |

## DRF in tests

\`APIClient\` (Module 5) is not a fixture — instantiate it, or write a small \`api_client\` fixture, and \`force_authenticate(user=...)\`. Assert on \`response.status_code\` and \`response.json()\`.

## Structure

- Keep pure-logic tests markerless and fast; they are the base of the pyramid.
- One integration test per view/endpoint that hits the real URL through \`client\` and asserts status + shape + a query count.
- Use \`@pytest.mark.parametrize\` for input tables instead of copy-pasted test functions.
- Name tests for the behaviour (\`test_expired_coupon_is_rejected\`), not the method.`,

    contentHi: `## \`pytest-django\` aapko kya deta hai

Django ka apna test runner (\`manage.py test\`) \`unittest\` par bana hai: aap \`self.assertEqual\` ke saath \`class FooTest(TestCase)\` likhte ho. Ye kaam karta hai, par pytest ek behtar experience hai — rich failure introspection ke saath plain \`assert\`, function-based tests, powerful fixtures, \`@parametrize\`, aur ek bada plugin ecosystem (Module 9). \`pytest-django\` bridge hai.

**Configuration.** pytest ko aapka settings module pata hona chahिए. \`pytest.ini\` / \`pyproject.toml\` mein \`DJANGO_SETTINGS_MODULE = myproject.settings.test\` daalो. Ek dedicated \`settings/test.py\` aksar: ek fast password hasher, ek in-memory ya local DB, email \`locmem\` ko, \`DEBUG = False\`, aur Celery eager mode mein.

## Test database

Pehle test par jise DB chahिए, \`pytest-django\` ek **test database banata hai** (\`test_<yourdb>\` naam se) aapke saare migrations chalakar. Isiliye ek toota migration aapki poori suite ko collection time par fail karta hai.

- **\`--reuse-db\`** — us test database ko runs ke beech rakho. Agla run create+migrate step poori tarah skip karta hai — par agar aapne ek migration badla, aapko ek baar \`--create-db\` add karna hoga.
- **\`--create-db\`** — fresh rebuild force karo.
- **\`--nomigrations\`** — schema seedhे models se banao, migration history skip karke. Kaafi tez, par ye aapke migrations exercise nahi karta, toh CI mein real path chalao.

## \`db\` fixture / \`django_db\` marker

Ek test jo ORM ko chhoota hai use database access maangna hi hoga, warna *"Database access not allowed"*. Ye jaan-boojhkar hai: ye aapke pure-logic tests ko imaandaari se pure aur tez rakhta hai.

**Isolation kaise kaam karta hai.** Plain \`db\` fixture har test ko ek **transaction mein wrap karta hai jo test khatam hone par rolled back** hota hai. Aapka test freely create, update, delete kar sakta hai; kuch persist nahi hota. Agla test usi migrated-but-empty state se shuru hota hai.

**Jab rollback kaafi nahi — \`transaction=True\`.** Kuch cheezein ek outer transaction ke andar test nahi ho saktीं:

- \`transaction.on_commit()\` callbacks — wo sirf ek real commit par fire hote hain. (Ya \`django_capture_on_commit_callbacks\` fixture istemal karo.)
- Apna \`atomic()\` block kholne wala code jo rollback behaviour test karta hai.
- Threads ke paar \`select_for_update()\`.

\`@pytest.mark.django_db(transaction=True)\` **real commits** istemal karta hai aur har test ke baad ek rollback ke bजाy ek **full table flush** karta hai — un cases ke liye sahi, par kaafi dheema.

## Fixtures

| pytest-django fixture | replace karta hai |
|---|---|
| \`client\` | \`self.client\` |
| \`admin_client\` | ek fresh superuser ke roop mein logged in \`client\` |
| \`rf\` | \`RequestFactory()\` |
| \`settings\` | \`@override_settings\` — attributes mutate karo, test ke baad auto-restored |
| \`mailoutbox\` | \`django.core.mail.outbox\` |
| \`django_assert_num_queries(n)\` | \`self.assertNumQueries(n)\` |
| \`django_capture_on_commit_callbacks\` | pending \`on_commit\` callbacks chalao |

## Structure

- Pure-logic tests markerless aur tez rakho.
- Prati view/endpoint ek integration test jo \`client\` ke zariye real URL hit kare aur status + shape + ek query count assert kare.
- Copy-paste ki test functions ke bजाy input tables ke liye \`@pytest.mark.parametrize\` istemal karo.
- Tests ko behaviour ke liye naam do, method ke liye nahi.`,

    examples: [
      {
        title: 'django_db rolls each test back: the second test sees an empty table',
        titleHi: 'django_db har test ko roll back karta hai: doosra test ek khali table dekhta hai',
        code: `import subprocess, sys, tempfile, os, textwrap, re

d = tempfile.mkdtemp()
os.makedirs(os.path.join(d, "app"))
open(os.path.join(d, "app", "__init__.py"), "w").write("")
open(os.path.join(d, "app", "models.py"), "w").write(textwrap.dedent("""
    from django.db import models
    class Widget(models.Model):
        name = models.CharField(max_length=20)
"""))
open(os.path.join(d, "settings.py"), "w").write(textwrap.dedent("""
    SECRET_KEY = "x" * 50
    INSTALLED_APPS = ["django.contrib.contenttypes", "django.contrib.auth", "app"]
    DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}}
    DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
    USE_TZ = True
"""))
open(os.path.join(d, "pytest.ini"), "w").write("[pytest]\\nDJANGO_SETTINGS_MODULE = settings\\n")
open(os.path.join(d, "test_iso.py"), "w").write(textwrap.dedent("""
    import pytest
    from app.models import Widget

    @pytest.mark.django_db
    def test_a_creates_rows():
        Widget.objects.create(name="one")
        Widget.objects.create(name="two")
        assert Widget.objects.count() == 2

    @pytest.mark.django_db
    def test_b_sees_none_of_them():
        assert Widget.objects.count() == 0     # test_a was rolled back

    def test_c_no_marker_cannot_touch_db():
        with pytest.raises(RuntimeError, match="Database access not allowed"):
            Widget.objects.count()
"""))

r = subprocess.run([sys.executable, "-m", "pytest", "-q", "--no-header", "-p", "no:cacheprovider", "-p", "no:warnings"],
                   cwd=d, capture_output=True, text=True)
out = re.sub(r"in [\\d.]+s", "in Ns", r.stdout).strip()
print(out.splitlines()[0])            # the progress dots
print(out.splitlines()[-1])           # the summary line`,
        output: `...                                                                      [100%]
3 passed in Ns`,
        explain: 'The test builds a real temp project and runs pytest as a subprocess. test_a creates two Widget rows and asserts the count is 2 -- it holds inside that test. test_b then asserts the count is 0: pytest-django wrapped test_a in a transaction and rolled it back at the end, so test_b starts from the same migrated-but-empty schema. test_c has no django_db marker, so the moment it touches the ORM pytest-django raises a RuntimeError saying database access is not allowed -- that guard keeps pure-logic tests honestly pure. All three pass.',
        explainHi: 'Test ek real temp project banata hai aur pytest ko ek subprocess ke roop mein chalata hai. test_a do Widget rows banata hai aur count 2 assert karta hai -- ye us test ke andar tikta hai. test_b phir count 0 assert karta hai: pytest-django ne test_a ko ek transaction mein wrap kiya aur ise ant mein roll back kiya, toh test_b usi migrated-but-empty schema se shuru hota hai. test_c ka koi django_db marker nahi, toh jis pal ye ORM ko chhuता hai pytest-django ek RuntimeError raise karta hai. Teenon pass.',
      },
      {
        title: 'The client, settings, and mailoutbox fixtures in one test file',
        titleHi: 'Ek test file mein client, settings, aur mailoutbox fixtures',
        code: `import subprocess, sys, tempfile, os, textwrap, re

d = tempfile.mkdtemp()
open(os.path.join(d, "proj.py"), "w").write(textwrap.dedent('''
    from django.http import JsonResponse
    from django.core.mail import send_mail
    from django.conf import settings
    from django.urls import path

    def ping(request):
        return JsonResponse({"ok": True, "flag": getattr(settings, "FEATURE_X", False)})

    def notify(request):
        send_mail("Hi", "body", "no-reply@x.com", ["u@x.com"])
        return JsonResponse({"sent": True})

    urlpatterns = [path("ping/", ping), path("notify/", notify)]
'''))
open(os.path.join(d, "settings.py"), "w").write(textwrap.dedent("""
    SECRET_KEY = "x" * 50
    ROOT_URLCONF = "proj"
    ALLOWED_HOSTS = ["*"]
    INSTALLED_APPS = []
    MIDDLEWARE = []
    EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
"""))
open(os.path.join(d, "pytest.ini"), "w").write("[pytest]\\nDJANGO_SETTINGS_MODULE = settings\\n")
open(os.path.join(d, "test_fix.py"), "w").write(textwrap.dedent("""
    def test_client_hits_a_url(client):
        r = client.get("/ping/")
        assert r.status_code == 200 and r.json()["ok"] is True

    def test_settings_fixture_is_scoped(client, settings):
        assert client.get("/ping/").json()["flag"] is False
        settings.FEATURE_X = True                       # only for THIS test
        assert client.get("/ping/").json()["flag"] is True

    def test_settings_restored(client):
        assert client.get("/ping/").json()["flag"] is False   # previous test's change is gone

    def test_mailoutbox_captures_email(client, mailoutbox):
        client.get("/notify/")
        assert len(mailoutbox) == 1
        assert mailoutbox[0].subject == "Hi"
"""))

r = subprocess.run([sys.executable, "-m", "pytest", "-q", "--no-header", "-p", "no:cacheprovider", "-p", "no:warnings"],
                   cwd=d, capture_output=True, text=True)
out = re.sub(r"in [\\d.]+s", "in Ns", r.stdout).strip()
print(out.splitlines()[-1])`,
        output: `4 passed in Ns`,
        explain: 'Four fixture-driven tests, no TestCase class. client is a django.test.Client that hits real URLs. The settings fixture mutates django.conf.settings for one test only -- test_settings_scoped sets FEATURE_X to True and sees it, and test_settings_restored (a later test) sees False again because pytest-django undoes the change after each test. mailoutbox is the per-test django.core.mail.outbox: test_mailoutbox hits the notify view, which calls send_mail against the locmem backend, and the sent EmailMessage lands in the list. All four pass.',
        explainHi: 'Chaar fixture-driven tests, koi TestCase class nahi. client ek django.test.Client hai jo real URLs hit karta hai. settings fixture sirf ek test ke liye django.conf.settings mutate karta hai -- test_settings_scoped FEATURE_X ko True set karta hai aur ise dekhta hai, aur test_settings_restored phir False dekhta hai kyunki pytest-django har test ke baad change undo karta hai. mailoutbox prati-test django.core.mail.outbox hai. Chaaron pass.',
      },
      {
        title: 'django_assert_num_queries catches an N+1 regression in a view',
        titleHi: 'django_assert_num_queries ek view mein ek N+1 regression pakadta hai',
        code: `import subprocess, sys, tempfile, os, textwrap, re

d = tempfile.mkdtemp()
os.makedirs(os.path.join(d, "blog"))
open(os.path.join(d, "blog", "__init__.py"), "w").write("")
open(os.path.join(d, "blog", "models.py"), "w").write(textwrap.dedent("""
    from django.db import models
    class Author(models.Model):
        name = models.CharField(max_length=30)
    class Post(models.Model):
        title = models.CharField(max_length=50)
        author = models.ForeignKey(Author, on_delete=models.CASCADE)
"""))
open(os.path.join(d, "proj.py"), "w").write(textwrap.dedent("""
    from django.http import JsonResponse
    from django.urls import path
    from blog.models import Post

    def good(request):
        posts = Post.objects.select_related("author")           # 1 query
        return JsonResponse({"posts": [f"{p.title} by {p.author.name}" for p in posts]})

    def bad(request):
        posts = Post.objects.all()                              # 1 + N queries
        return JsonResponse({"posts": [f"{p.title} by {p.author.name}" for p in posts]})

    urlpatterns = [path("good/", good), path("bad/", bad)]
"""))
open(os.path.join(d, "settings.py"), "w").write(textwrap.dedent("""
    SECRET_KEY = "x" * 50
    ROOT_URLCONF = "proj"
    ALLOWED_HOSTS = ["*"]
    INSTALLED_APPS = ["django.contrib.contenttypes", "django.contrib.auth", "blog"]
    MIDDLEWARE = []
    DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}}
    DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
"""))
open(os.path.join(d, "pytest.ini"), "w").write("[pytest]\\nDJANGO_SETTINGS_MODULE = settings\\n")
open(os.path.join(d, "test_queries.py"), "w").write(textwrap.dedent("""
    import pytest
    from blog.models import Author, Post

    @pytest.fixture
    def posts(db):
        a = Author.objects.create(name="Ada")
        b = Author.objects.create(name="Bo")
        for i in range(10):
            Post.objects.create(title=f"P{i}", author=a if i % 2 else b)

    def test_good_view_is_one_query(client, posts, django_assert_num_queries):
        with django_assert_num_queries(1):        # select_related -> a single JOINed query
            client.get("/good/")

    def test_bad_view_is_an_n_plus_1(client, posts):
        from django.db import connection
        from django.test.utils import CaptureQueriesContext
        with CaptureQueriesContext(connection) as ctx:
            client.get("/bad/")
        assert len(ctx.captured_queries) == 11    # 1 base + 10 per-author -> the N+1
        # in a real suite: with django_assert_num_queries(1): client.get("/bad/")  would FAIL CI
"""))

r = subprocess.run([sys.executable, "-m", "pytest", "-q", "--no-header", "-p", "no:cacheprovider", "-p", "no:warnings"],
                   cwd=d, capture_output=True, text=True)
out = re.sub(r"in [\\d.]+s", "in Ns", r.stdout).strip()
print(out.splitlines()[-1])`,
        output: `2 passed in Ns`,
        explain: 'The posts fixture (which depends on db) seeds two authors and ten posts. test_good_view_is_one_query wraps the request in django_assert_num_queries(1) and passes, because the good view uses select_related so the whole list comes back in one JOINed query. test_bad_view_is_an_n_plus_1 measures the bad view with CaptureQueriesContext and asserts it ran 11 queries -- one base SELECT plus one per author reference -- which is the N+1. In a real suite you would wrap the bad view in django_assert_num_queries(1) as a regression guard, and it would fail CI.',
        explainHi: 'posts fixture (jo db par depend karta hai) do authors aur das posts seed karta hai. test_good_view_is_one_query request ko django_assert_num_queries(1) mein wrap karta hai aur pass hota hai, kyunki good view select_related istemal karta hai toh poori list ek JOINed query mein wapas aati hai. test_bad_view_is_an_n_plus_1 bad view ko CaptureQueriesContext se measure karta hai aur assert karta hai ki ye 11 queries chalayi -- ek base SELECT plus prati author reference ek -- jo N+1 hai.',
      },
    ],

    mistakes: [
      {
        wrong: `class OrderTests(TestCase):
    def test_confirmation_email_sent(self):
        place_order(self.user)                      # calls transaction.on_commit(send_email)
        self.assertEqual(len(mail.outbox), 1)       # FAILS: 0 emails
# the on_commit callback never fired -- TestCase wraps the test in a transaction that rolls back`,
        right: `def test_confirmation_email_sent(db, django_capture_on_commit_callbacks, mailoutbox):
    with django_capture_on_commit_callbacks(execute=True):
        place_order(user)
    assert len(mailoutbox) == 1
# or @pytest.mark.django_db(transaction=True) if the code genuinely needs real commits`,
        why: 'Both Django\'s `TestCase` and pytest-django\'s `db` fixture wrap each test in a transaction that is rolled back at the end. `transaction.on_commit()` callbacks only run when a transaction actually commits — which never happens inside that wrapper — so an email, a Celery task, or a cache invalidation registered with `on_commit` silently does not fire in the test. Use the `django_capture_on_commit_callbacks(execute=True)` context manager to run the pending callbacks explicitly, or `transaction=True` / `TransactionTestCase` for real commits (slower). Do not "fix" it by moving the side effect out of `on_commit` — that reintroduces the Module 8 bug where the effect fires before the data is durable.',
        whyHi: 'Django ka `TestCase` aur pytest-django ka `db` fixture dono har test ko ek transaction mein wrap karte hain jo ant mein rolled back hota hai. `transaction.on_commit()` callbacks sirf tab chalte hain jab ek transaction asal mein commit hota hai — jo us wrapper ke andar kabhi nahi hota — toh `on_commit` ke saath registered ek email test mein chupchaap fire nahi hota. `django_capture_on_commit_callbacks(execute=True)` context manager istemal karo, ya `transaction=True` real commits ke liye.',
      },
      {
        wrong: `@pytest.mark.django_db
def test_pricing_math():                    # this test never touches the DB
    assert apply_discount(100, "SAVE10") == 90
# the marker forces test-DB setup + a transaction wrapper for a pure function -- slow for nothing`,
        right: `def test_pricing_math():                    # no marker -> runs instantly, no DB
    assert apply_discount(100, "SAVE10") == 90

@pytest.mark.django_db                       # marker only where the ORM is actually used
def test_pricing_with_a_real_coupon():
    coupon = Coupon.objects.create(code="SAVE10", percent=10)
    ...`,
        why: 'The `django_db` marker is not free: it ensures the test database exists and wraps the test in a transaction. Adding it to every test "just in case" makes your pure-logic tests — which should run in microseconds — pay database setup costs, and it hides which tests actually depend on the ORM. Keep the marker off pure functions. The pyramid works because the wide base of logic tests is fast; the marker belongs only on the integration layer.',
        whyHi: '`django_db` marker muft nahi hai: ye ensure karta hai ki test database exist karta hai aur test ko ek transaction mein wrap karta hai. Ise har test par "bस case mein" add karna aapke pure-logic tests ko database setup costs dilata hai, aur ye chhupata hai ki kaunse tests asal mein ORM par depend karte hain. Marker ko pure functions se door rakho.',
      },
      {
        wrong: `# addopts = --reuse-db  in pytest.ini, and you just edited a migration
$ pytest
# ... 40 confusing failures: "no such column", "table X has no column Y" ...
# the reused test DB still has the OLD schema`,
        right: `$ pytest --create-db          # rebuild the test DB once, after changing a migration
$ pytest                      # subsequent runs reuse the now-current DB
# CI should always use --create-db (or a fresh DB) so it exercises the real migration path`,
        why: '`--reuse-db` keeps the test database between runs and only rebuilds it if pytest-django detects the migration files changed — but that detection is not perfect, and editing an *existing* migration in place (rather than adding a new one) often does not trigger a rebuild. The stale schema then produces baffling "no such column" errors. After any migration change, run \`pytest --create-db\` once. In CI, always build a fresh test database so the suite proves the migrations apply cleanly from scratch.',
        whyHi: '`--reuse-db` test database ko runs ke beech rakhta hai aur ise sirf tab rebuild karta hai jab pytest-django detect kare ki migration files badle — par wo detection perfect nahi hai, aur ek *maujooda* migration ko jagah par edit karna aksar ek rebuild trigger nahi karta. Stale schema phir "no such column" errors produce karta hai. Kisi bhi migration change ke baad, ek baar `pytest --create-db` chalao. CI mein hamesha ek fresh test database banao.',
      },
    ],

    realWorld: [
      {
        en: '**`pytest.ini` with `--reuse-db --strict-markers`, a `settings/test.py`** with `MD5PasswordHasher`, `EMAIL_BACKEND=locmem`, `CELERY_TASK_ALWAYS_EAGER=True`, and SQLite (or a disposable Postgres in CI). CI runs `pytest --create-db --cov` so every run proves migrations apply and coverage does not drop.',
        hi: '**`--reuse-db --strict-markers` waali `pytest.ini`, ek `settings/test.py`** `MD5PasswordHasher`, `EMAIL_BACKEND=locmem`, `CELERY_TASK_ALWAYS_EAGER=True` ke saath. CI `pytest --create-db --cov` chalata hai.',
      },
      {
        en: '**One integration test per endpoint** through the `client`/`api_client` fixture asserting `status_code`, the response shape, and `django_assert_num_queries(N)` — so an accidental N+1 in a serializer fails CI, not production. Pure serializer/validator/pricing logic tested markerless.',
        hi: '**Prati endpoint ek integration test** `client`/`api_client` fixture ke zariye `status_code`, response shape, aur `django_assert_num_queries(N)` assert karta hua — toh ek serializer mein ek accidental N+1 CI fail karta hai, production nahi.',
      },
      {
        en: '**`django_capture_on_commit_callbacks(execute=True)` around every test of a flow that enqueues work** — signup, checkout, publish — so the test verifies the email/task/webhook that `transaction.on_commit` would fire in production, without a `transaction=True` test.',
        hi: '**Kaam enqueue karne wale har flow ke test ke around `django_capture_on_commit_callbacks(execute=True)`** — signup, checkout, publish — toh test us email/task/webhook ko verify karta hai jo `transaction.on_commit` production mein fire karta.',
      },
    ],

    interviewQA: [
      {
        q: 'How does test isolation work in pytest-django, and when do you need `transaction=True`?',
        qHi: 'pytest-django mein test isolation kaise kaam karta hai, aur aapko `transaction=True` kab chahiye?',
        a: 'The test database is built once per run by applying all your migrations to a database named test-something. Then, for a test that requests database access — via the django_db marker or the db fixture — pytest-django wraps the entire test in a database transaction and rolls that transaction back when the test finishes, using savepoints to handle any nested atomic blocks the code under test opens. So the test can create, update, and delete as much as it likes, and none of it persists: the next test starts from the same migrated-but-empty schema. This is fast because a rollback is cheap, which is what makes it viable to have thousands of database tests. You need transaction=True — or the older TransactionTestCase — when the behaviour under test depends on a real commit actually happening. The most common case is transaction.on_commit callbacks: they only run when a transaction commits, and the rollback wrapper means that never happens, so an email or Celery task registered with on_commit silently does not fire in a normal db test. Other cases are code that opens its own atomic block and asserts on rollback behaviour, testing select_for_update locking across two connections or threads, and any scenario where one connection must see data another connection committed. transaction=True uses real commits and does a full table flush after each test instead of a rollback, which is correct for those cases but meaningfully slower, so you use it only where the rollback approach genuinely cannot work. For on_commit specifically there is a lighter option: the django_capture_on_commit_callbacks fixture with execute=True runs the pending callbacks explicitly inside a normal fast db test.',
        aHi: 'Test database prati run ek baar banta hai aapke saare migrations ko test-something naam ke ek database par apply karke. Phir, ek test ke liye jo database access maangta hai — django_db marker ya db fixture ke zariye — pytest-django poore test ko ek database transaction mein wrap karta hai aur test khatam hone par us transaction ko roll back karta hai, kisi nested atomic blocks ko handle karne ke liye savepoints istemal karke. Toh test jitna chahe create, update, delete kar sakta hai, aur kuch persist nahi hota. Ye tez hai kyunki ek rollback sasta hai. Aapko transaction=True chahिए jab test ke andar ka behaviour ek real commit ke asal mein hone par depend karta hai. Sabse aam case transaction.on_commit callbacks hai: wo sirf tab chalte hain jab ek transaction commit hota hai, aur rollback wrapper ka matlab wo kabhi nahi hota. Doosre cases apna atomic block kholne wala code hain, do connections ke paar select_for_update locking test karna. transaction=True real commits istemal karta hai par kaafi dheema hai. on_commit ke liye ek halka vikalp hai: django_capture_on_commit_callbacks fixture execute=True ke saath.',
      },
      {
        q: 'What does `--reuse-db` do, and why must CI not rely on it?',
        qHi: '`--reuse-db` kya karta hai, aur CI ko ispar bharosa kyun nahi karna chahिए?',
        a: 'By default, pytest-django creates the test database at the start of every run by applying all migrations, and drops it at the end. On a large project that setup can take many seconds or more, and you pay it every single time you run the suite locally. --reuse-db tells pytest-django to keep the test database between runs: the next run finds it already there, skips the create-and-migrate step, and starts testing almost immediately. It will rebuild automatically if it detects the migration files changed, but that detection is heuristic — in particular, editing an existing migration in place, rather than adding a new migration file, frequently does not trigger a rebuild. When that happens the reused database still has the old schema, and you get a wave of confusing errors like no such column or table has no column, which look like code bugs but are really a stale test database. The fix is to run pytest --create-db once after any migration change to force a clean rebuild. CI must not rely on --reuse-db for two reasons. First, CI usually starts from a clean environment with no database to reuse anyway. Second, and more importantly, a core job of the test suite in CI is to prove that the migrations apply cleanly from an empty database — that there are no missing migrations, no broken dependencies, no data migration that crashes. Reusing a database skips exactly that check. So CI should always create a fresh test database, typically with --create-db or by running against a disposable database service, and ideally also run makemigrations --check to catch model changes that were never turned into a migration.',
        aHi: 'Default se, pytest-django har run ki shuruat mein test database banata hai saare migrations apply karke, aur ant mein ise drop karta hai. Ek bade project par wo setup kई second ya zyada le sakta hai. --reuse-db pytest-django ko test database ko runs ke beech rakhne ko kehta hai: agla run ise pehle se wahaan paata hai, create-and-migrate step skip karta hai, aur lगbhag turant testing shuru karta hai. Ye automatically rebuild karega agar ye detect kare ki migration files badle, par wo detection heuristic hai — khaskार ek maujooda migration ko jagah par edit karna aksar ek rebuild trigger nahi karta. Jab aisा hota hai reused database mein abhi bhi purana schema hai, aur aapko no such column jaise confusing errors ki ek lehar milti hai. Fix kisi bhi migration change ke baad ek baar pytest --create-db chalana hai. CI ko --reuse-db par bharosa nahi karna chahिए kyunki CI ka ek core kaam ye sabit karna hai ki migrations ek khali database se saaf apply hote hain.',
      },
    ],

    exercises: [
      {
        task: 'Build a temp Django project on disk (`tempfile.mkdtemp()` + `settings.py` with `DJANGO_SETTINGS_MODULE`-friendly layout + an `app/` package with `models.py` defining `Widget(name)` + a `pytest.ini` with `DJANGO_SETTINGS_MODULE = settings`). Write `test_iso.py` with: `test_a` (`@pytest.mark.django_db`) creating 2 `Widget`s and asserting `count() == 2`; `test_b` (`@pytest.mark.django_db`) asserting `count() == 0`; `test_c` (NO marker) asserting that `Widget.objects.count()` raises `RuntimeError` matching `"Database access not allowed"`. Run `python -m pytest -q` via `subprocess` in that dir, normalise `in <N>s` -> `in Ns`, and assert the last output line is `3 passed in Ns`.',
        taskHi: 'Disk par ek temp Django project banao (`settings.py` + ek `app/` package `models.py` mein `Widget(name)` + ek `pytest.ini`). `test_iso.py` likho: `test_a` (`@pytest.mark.django_db`) 2 `Widget` banaye aur `count() == 2`; `test_b` `count() == 0`; `test_c` (KOI marker NAHI) assert kare ki `Widget.objects.count()` `RuntimeError` `"Database access not allowed"` raise karta hai. `subprocess` se `python -m pytest -q` chalao, `in Ns` normalise karo, assert last line `3 passed in Ns`.',
        hint: '`subprocess.run([sys.executable, "-m", "pytest", "-q", "--no-header", "-p", "no:cacheprovider", "-p", "no:warnings"], cwd=d, ...)`. `test_b` passing at `count() == 0` is the whole point — `test_a`\'s rows were rolled back. `pytest.raises(RuntimeError, match="Database access not allowed")` for the markerless one.',
        hintHi: '`subprocess.run([sys.executable, "-m", "pytest", "-q", ...], cwd=d)`. `test_b` ka `count() == 0` par pass hona poora point hai. `pytest.raises(RuntimeError, match="Database access not allowed")`.',
      },
      {
        task: 'Temp project with a `proj.py` URLconf: `ping` returns `{"flag": getattr(settings, "FEATURE_X", False)}`; `notify` calls `send_mail(...)` and returns `{"sent": True}`. `settings.py` sets `EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"`. Write `test_fix.py`: `test_client` (uses `client`) asserts `/ping/` is `200`; `test_settings_scoped` (uses `client, settings`) asserts `flag` is `False`, sets `settings.FEATURE_X = True`, asserts `flag` is now `True`; `test_settings_restored` (uses `client`) asserts `flag` is `False` again; `test_mail` (uses `client, mailoutbox`) hits `/notify/` and asserts `len(mailoutbox) == 1`. Run pytest, assert `4 passed`.',
        taskHi: 'Temp project ek `proj.py` URLconf ke saath: `ping` `{"flag": getattr(settings, "FEATURE_X", False)}`; `notify` `send_mail(...)`. `settings.py` `EMAIL_BACKEND = "...locmem..."`. `test_fix.py`: `test_client`, `test_settings_scoped` (`settings.FEATURE_X = True` sirf is test ke liye), `test_settings_restored`, `test_mail` (`mailoutbox`). pytest chalao, `4 passed` assert karo.',
        hint: 'The `settings` fixture mutates `django.conf.settings` and pytest-django restores it after the test — that is why `test_settings_restored` sees `False`. `mailoutbox` is the per-test `django.core.mail.outbox`.',
        hintHi: '`settings` fixture `django.conf.settings` mutate karta hai aur pytest-django test ke baad ise restore karta hai. `mailoutbox` prati-test `django.core.mail.outbox` hai.',
      },
      {
        task: 'Temp project: `blog/models.py` with `Author(name)` and `Post(title, author FK)`; `proj.py` with `good` (uses `.select_related("author")`) and `bad` (uses `.all()`), each returning `[f"{p.title} by {p.author.name}" for p in posts]`. A `posts` fixture (`db`) creating 2 authors + 10 posts. `test_good` (`client, posts, django_assert_num_queries`): `with django_assert_num_queries(1): client.get("/good/")`. `test_bad`: `with pytest.raises(AssertionError): with django_assert_num_queries(1): client.get("/bad/")`. Run pytest, assert `2 passed`.',
        taskHi: 'Temp project: `blog/models.py` `Author(name)` + `Post(title, author FK)`; `proj.py` `good` (`.select_related`) aur `bad` (`.all()`). Ek `posts` fixture (`db`) 2 authors + 10 posts. `test_good`: `with django_assert_num_queries(1)`. `test_bad`: `with pytest.raises(AssertionError): with django_assert_num_queries(1)`. pytest chalao, `2 passed`.',
        hint: '`good` is 1 query (the JOIN); `bad` is 1 + 10. `test_bad` wraps the failing assertion in `pytest.raises(AssertionError)` so the test itself passes while demonstrating the N+1 would be caught. This is exactly how you lock a view against query regressions in CI.',
        hintHi: '`good` 1 query hai; `bad` 1 + 10. `test_bad` failing assertion ko `pytest.raises(AssertionError)` mein wrap karta hai. Isi tarah aap CI mein ek view ko query regressions ke khilaf lock karte ho.',
      },
    ],

    keyTakeaways: [
      '`pytest-django` = pytest over Django: plain `assert`, fixtures, `@parametrize`. Config: `DJANGO_SETTINGS_MODULE = ...` in `pytest.ini` / `pyproject.toml`, plus a `settings/test.py` (MD5 hasher, locmem email, eager Celery, `DEBUG=False`).',
      'The test DB is built ONCE per run by applying ALL migrations -> a broken migration fails the whole suite at collection. `--reuse-db` keeps it between runs (skips create+migrate); `--create-db` forces a rebuild; `--nomigrations` builds schema from models (fast, doesn\'t exercise migrations).',
      'A test that touches the ORM MUST opt in: `@pytest.mark.django_db` or a fixture that depends on `db` — else "Database access not allowed". Keeps pure-logic tests honestly fast. Don\'t add the marker "just in case".',
      'ISOLATION: the `db` fixture wraps each test in a transaction ROLLED BACK at the end (savepoints for nested `atomic()`). Test creates 50 rows -> next test sees 0. Cheap, which is why 1000s of DB tests are viable.',
      '`django_db(transaction=True)` (or `TransactionTestCase`) = REAL commits + a full flush after, NOT a rollback. Needed for: `transaction.on_commit` callbacks, code testing its own `atomic()` rollback, cross-connection `select_for_update`. Slower — use only where required.',
      'For `on_commit` specifically: `django_capture_on_commit_callbacks(execute=True)` runs pending callbacks inside a normal fast `db` test — no `transaction=True` needed.',
      'Fixtures replace `TestCase` attrs: `client`, `async_client`, `admin_client`, `rf`, `settings` (mutate + auto-restore), `mailoutbox`, `django_assert_num_queries(n)` / `django_assert_max_num_queries(n)`, `django_user_model`. `APIClient` is NOT a fixture — instantiate it.',
      'CI must NOT rely on `--reuse-db` — always build a FRESH test DB (`--create-db` / disposable service) so the suite proves migrations apply cleanly from empty, plus run `makemigrations --check`. `--reuse-db` + an edited-in-place migration = baffling "no such column" errors.',
    ],
    keyTakeawaysHi: [
      '`pytest-django` = Django ke upar pytest: plain `assert`, fixtures, `@parametrize`. Config: `pytest.ini` mein `DJANGO_SETTINGS_MODULE = ...`, plus ek `settings/test.py` (MD5 hasher, locmem email, eager Celery, `DEBUG=False`).',
      'Test DB prati run EK BAAR banta hai SAARE migrations apply karke -> ek toota migration collection par poori suite fail karta hai. `--reuse-db` ise runs ke beech rakhta hai; `--create-db` rebuild force karta hai; `--nomigrations` schema models se banata hai.',
      'ORM chhoone wale test ko OPT IN karna HI hoga: `@pytest.mark.django_db` ya `db` par depend karne wala fixture — warna "Database access not allowed". "Bस case mein" marker mat add karo.',
      'ISOLATION: `db` fixture har test ko ek transaction mein wrap karta hai jo ant mein ROLLED BACK hota hai. Test 50 rows banata hai -> agla test 0 dekhta hai. Sasta.',
      '`django_db(transaction=True)` (ya `TransactionTestCase`) = REAL commits + baad mein ek full flush, ek rollback NAHI. Iske liye chahिए: `transaction.on_commit` callbacks, apna `atomic()` rollback test karne wala code, cross-connection `select_for_update`. Dheema.',
      '`on_commit` ke liye: `django_capture_on_commit_callbacks(execute=True)` ek normal tez `db` test ke andar pending callbacks chalata hai — `transaction=True` ki zaroorat nahi.',
      'Fixtures `TestCase` attrs replace karte hain: `client`, `async_client`, `admin_client`, `rf`, `settings`, `mailoutbox`, `django_assert_num_queries(n)`, `django_user_model`. `APIClient` ek fixture NAHI hai.',
      'CI ko `--reuse-db` par bharosa NAHI karna chahिए — hamesha ek FRESH test DB banao taaki suite sabit kare migrations khali se saaf apply hote hain, plus `makemigrations --check` chalao.',
    ],
  },

  {
    slug: 'dj-factories-mocking-coverage',
    title: 'Factories, Mocking External Services & Coverage',
    titleHi: 'Factories, External Services Mock Karna & Coverage',
    description: 'Three tools that make a test suite maintainable: `factory_boy` builds valid model graphs with one call (no more 40-line `setUp`); mocking (`responses`, `unittest.mock`, `freezegun`) cuts the test off from the network, the clock, and other non-determinism; `coverage.py` shows what your tests actually execute.',
    descriptionHi: 'Teen tools jo ek test suite ko maintainable banate hain: `factory_boy` ek call mein valid model graphs banata hai (ab 40-line `setUp` nahi); mocking (`responses`, `unittest.mock`, `freezegun`) test ko network, clock, aur doosre non-determinism se kaat deta hai; `coverage.py` dikhata hai ki aapke tests asal mein kya execute karte hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**A film set.** A **factory** is the props department: ask for "a lived-in kitchen" and you get one fully dressed — cabinets stocked, a half-drunk coffee, a calendar on the wall — without you specifying every fork. `factory_boy` does that for model graphs: ask for an `Order` and you get a valid `Customer`, valid line items, a plausible total, all wired up. **Mocks** are the green screen and the stunt double: you are not going to actually drive the car off the cliff or fly to Rome for one shot, so you fake the parts that are expensive, dangerous, or out of your control — the payment gateway, the current date, a third-party API — and assert on what your code *tried* to do. **Coverage** is the dailies review: you watch back every scene and check which parts of the script actually got filmed. It cannot tell you the movie is *good* — a scene can be filmed badly — but it tells you, unambiguously, which pages nobody ever shot.',
      hi: '**Ek film set.** Ek **factory** props department hai: "ek lived-in kitchen" maango aur aapko ek poori dressed milti hai — cabinets stocked, ek aadhी-piyी coffee — bina aapke har fork specify kiye. `factory_boy` model graphs ke liye wo karta hai: ek `Order` maango aur aapko ek valid `Customer`, valid line items, ek plausible total milta hai. **Mocks** green screen aur stunt double hain: aap sach mein car ko cliff se nahi chalाओge ya ek shot ke liye Rome nahi udोge, toh aap un hisson ko fake karte ho jo mehenge, khatarnak, ya aapke control ke bahar hain — payment gateway, current date, ek third-party API — aur assert karte ho ki aapke code ne kya karne ki *koshish ki*. **Coverage** dailies review hai: aap har scene wapas dekhte ho aur check karte ho ki script ke kaunse hisse asal mein film hue. Ye aapko nahi bata sakta ki movie *achhी* hai — par ye aapko batata hai, spasht roop se, kaunse pages kisi ne kabhi shoot nahi kiye.',
    },

    simple: `**\`factory_boy\` — build a valid object graph**

\`\`\`python
import factory
from factory.django import DjangoModelFactory
from shop.models import Customer, Order, OrderLine

class CustomerFactory(DjangoModelFactory):
    class Meta:
        model = Customer
    name  = factory.Faker("name")
    email = factory.Sequence(lambda n: f"user{n}@example.com")   # unique per build

class OrderFactory(DjangoModelFactory):
    class Meta:
        model = Order
    customer = factory.SubFactory(CustomerFactory)               # builds/creates a Customer too
    status   = "pending"
    total    = factory.LazyAttribute(lambda o: 0)

    @factory.post_generation
    def lines(self, create, extracted, **kwargs):
        if not create:
            return
        for _ in range(extracted or 2):
            OrderLineFactory(order=self)
\`\`\`

\`\`\`python
OrderFactory.build()              # in memory, NOT saved (no DB needed) -- SubFactory also just built
OrderFactory.create()             # saved, SubFactory customer saved too
OrderFactory()                    # == .create() by default
OrderFactory.create_batch(5)      # a list of 5
OrderFactory(status="paid", customer__name="Ada")   # override own + nested fields
\`\`\`

\`\`\`
Faker("name" / "email" / "past_date" / ...)   realistic fake values
Sequence(lambda n: ...)                        a counter -> unique values (emails, slugs)
SubFactory(OtherFactory)                       a related object, built with the same strategy
LazyAttribute(lambda o: f(o))                  computed from other fields on THIS object
LazyFunction(lambda: ...)                      computed, no access to the object
post_generation                                runs AFTER the object exists (M2M, children)
traits / params                                named bundles of overrides
build vs create                                in-memory (fast, no DB) vs saved
\`\`\`

**Mocking an external HTTP call — \`responses\`**

\`\`\`python
import responses

@responses.activate
def test_sync_pushes_to_partner():
    responses.post("https://partner.example.com/v1/orders",
                   json={"id": "P-99"}, status=201)
    push_order(order)                                    # the code under test calls requests.post
    assert responses.calls[0].request.url.endswith("/v1/orders")
    assert json.loads(responses.calls[0].request.body)["total"] == order.total
    # any real HTTP call NOT registered -> ConnectionError (the test can't hit the network)
\`\`\`

**\`unittest.mock\` for anything else**

\`\`\`python
from unittest.mock import patch

@patch("shop.services.stripe.Charge.create", return_value={"id": "ch_1", "paid": True})
def test_checkout_charges_once(mock_charge):
    checkout(order)
    mock_charge.assert_called_once_with(amount=order.total_cents, currency="usd", source="tok_x")
\`\`\`

**Freeze the clock — \`freezegun\`**

\`\`\`python
from freezegun import freeze_time

@freeze_time("2026-01-15 12:00:00")
def test_trial_expiry():
    sub = SubscriptionFactory()                          # created_at is now frozen
    assert sub.trial_ends_on == date(2026, 1, 29)
\`\`\`

**Coverage**

\`\`\`bash
pip install coverage pytest-cov
pytest --cov=myproject --cov-report=term-missing --cov-branch
# term-missing lists the exact line numbers with no test hitting them
# --cov-branch also checks both sides of every if/for, not just the line
\`\`\``,

    simpleHi: `**\`factory_boy\` — ek valid object graph banao**

\`\`\`python
import factory
from factory.django import DjangoModelFactory
from shop.models import Customer, Order, OrderLine

class CustomerFactory(DjangoModelFactory):
    class Meta:
        model = Customer
    name  = factory.Faker("name")
    email = factory.Sequence(lambda n: f"user{n}@example.com")   # prati build unique

class OrderFactory(DjangoModelFactory):
    class Meta:
        model = Order
    customer = factory.SubFactory(CustomerFactory)               # ek Customer bhi banata hai
    status   = "pending"

    @factory.post_generation
    def lines(self, create, extracted, **kwargs):
        if not create:
            return
        for _ in range(extracted or 2):
            OrderLineFactory(order=self)
\`\`\`

\`\`\`python
OrderFactory.build()              # memory mein, SAVED NAHI -- SubFactory bhi bस built
OrderFactory.create()             # saved, SubFactory customer bhi saved
OrderFactory()                    # default se == .create()
OrderFactory.create_batch(5)      # 5 ki ek list
OrderFactory(status="paid", customer__name="Ada")   # apne + nested fields override karo
\`\`\`

\`\`\`
Faker("name" / "email" / ...)   realistic fake values
Sequence(lambda n: ...)          ek counter -> unique values
SubFactory(OtherFactory)         ek related object
LazyAttribute(lambda o: f(o))    IS object ke doosre fields se computed
LazyFunction(lambda: ...)        computed, object ka access nahi
post_generation                  object ke exist hone ke BAAD chalta hai (M2M, children)
build vs create                  in-memory (tez, koi DB nahi) vs saved
\`\`\`

**Ek external HTTP call mock karna — \`responses\`**

\`\`\`python
import responses

@responses.activate
def test_sync_pushes_to_partner():
    responses.post("https://partner.example.com/v1/orders",
                   json={"id": "P-99"}, status=201)
    push_order(order)
    assert responses.calls[0].request.url.endswith("/v1/orders")
    # koi bhi real HTTP call jo registered NAHI -> ConnectionError
\`\`\`

**\`unittest.mock\` baaki sab ke liye**

\`\`\`python
from unittest.mock import patch

@patch("shop.services.stripe.Charge.create", return_value={"id": "ch_1", "paid": True})
def test_checkout_charges_once(mock_charge):
    checkout(order)
    mock_charge.assert_called_once_with(amount=order.total_cents, currency="usd", source="tok_x")
\`\`\`

**Clock freeze karo — \`freezegun\`**

\`\`\`python
from freezegun import freeze_time

@freeze_time("2026-01-15 12:00:00")
def test_trial_expiry():
    sub = SubscriptionFactory()
    assert sub.trial_ends_on == date(2026, 1, 29)
\`\`\`

**Coverage**

\`\`\`bash
pip install coverage pytest-cov
pytest --cov=myproject --cov-report=term-missing --cov-branch
# term-missing bina test ke exact line numbers list karta hai
# --cov-branch har if/for ke dono side check karta hai
\`\`\``,

    content: `## \`factory_boy\`

A test needs objects to work with, and building them by hand is verbose and brittle: every required field spelled out, every FK created first, and a schema change breaks a hundred \`setUp\` methods. A **factory** is a declarative recipe for a valid instance.

\`\`\`python
class UserFactory(DjangoModelFactory):
    class Meta:
        model = get_user_model()
        django_get_or_create = ["username"]      # reuse instead of duplicate-key error

    username = factory.Sequence(lambda n: f"user{n}")
    email    = factory.LazyAttribute(lambda o: f"{o.username}@example.com")
    is_active = True

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        self.set_password(extracted or "pw")     # hash it; runs after the row exists
        if create:
            self.save(update_fields=["password"])
\`\`\`

Declarations:

- **\`factory.Faker("...")\`** — a realistic fake (name, email, address, \`past_datetime\`, \`pyint\`, ...). Deterministic if you seed Faker.
- **\`factory.Sequence(lambda n: ...)\`** — \`n\` is a per-factory counter; use for fields that must be unique.
- **\`factory.SubFactory(OtherFactory)\`** — a related object, built with the **same strategy** (build → build, create → create). Override nested fields with \`parent__child_field=...\`.
- **\`factory.LazyAttribute(lambda obj: ...)\`** — computed from other attributes already set on this object.
- **\`factory.LazyFunction(lambda: ...)\`** — computed, no object access (e.g. \`timezone.now\`).
- **\`@factory.post_generation\`** — a hook that runs **after** the instance exists: set a hashed password, add M2M members, create child rows. \`create\` is the bool "was this .create() or .build()", \`extracted\` is the value passed as \`factoryname=<x>\`.
- **\`class Params\` + traits** — named bundles: \`OrderFactory(shipped=True)\` applies a whole set of overrides.

Strategies:

- **\`.build()\`** — construct the instance in memory, **do not save**, and build (not save) any \`SubFactory\`. No database needed — great for testing \`__str__\`, \`clean()\`, serializers, pure model methods.
- **\`.create()\`** (also just \`Factory()\`) — save the instance and its sub-factories. Needs \`db\`.
- **\`.build_batch(n)\` / \`.create_batch(n)\`** — a list.
- **\`.stub()\`** — a plain object with the attributes, not a model instance at all.

Factories keep tests readable (\`OrderFactory(status="paid")\` says exactly what matters) and survive schema changes (fix the factory once, not every test).

## Mocking

A good test is **deterministic** and **isolated**: same result every run, no dependency on the network, the wall clock, randomness, or another service being up. Anything that violates that gets mocked.

### HTTP — \`responses\` (for the \`requests\` library)

\`@responses.activate\` intercepts every \`requests\` call in the test. You register the responses you expect; an unregistered call raises \`ConnectionError\`, so the test **cannot** accidentally hit the real API. Then you assert on \`responses.calls\` — the URL, method, headers, and body your code sent.

\`\`\`python
@responses.activate
def test_webhook_retry_on_500():
    responses.add(responses.POST, URL, status=500)
    responses.add(responses.POST, URL, status=200)     # second call succeeds
    deliver_webhook(event)
    assert len(responses.calls) == 2
\`\`\`

(For \`httpx\`, use \`respx\`; for \`aiohttp\`, \`aioresponses\`.)

### Anything else — \`unittest.mock.patch\`

\`patch("path.to.thing")\` replaces \`thing\` **where it is looked up**, not where it is defined — patch \`myapp.services.stripe\`, not \`stripe\`, if \`services.py\` did \`import stripe\`. The mock records calls (\`assert_called_once_with\`, \`call_args\`) and returns \`return_value\` (or raises \`side_effect\`).

\`\`\`python
@patch("myapp.tasks.send_slack_message")
def test_alert_fires(mock_slack):
    raise_threshold_breach()
    mock_slack.assert_called_once()
\`\`\`

Prefer mocking at the **boundary** (your own thin wrapper around the third party), not deep inside the vendor SDK — the wrapper is stable, the SDK internals are not.

### Time — \`freezegun\`

\`@freeze_time("2026-01-15")\` freezes \`datetime.now\`, \`date.today\`, \`time.time\`, and \`django.utils.timezone.now\`. Essential for anything with expiry, scheduling, "created today", or age calculations. \`frozen.tick()\` and \`frozen.move_to(...)\` advance it.

### The rule

Mock **your dependencies' edges**, not **your own code**. If you find yourself mocking three of your own functions to test a fourth, the design is too coupled — that is a signal, not a testing problem.

## Coverage

\`coverage.py\` (via \`pytest-cov\`) records which lines ran during the test suite.

\`\`\`bash
pytest --cov=myproject --cov-report=term-missing --cov-branch --cov-fail-under=85
\`\`\`

- **\`term-missing\`** prints, per file, the line numbers that no test executed — your to-do list.
- **\`--cov-branch\`** additionally checks that both outcomes of every \`if\`/\`while\`/\`for\` were taken. Line coverage can be 100% while a branch is never exercised; branch coverage catches that.
- **\`--cov-fail-under=N\`** fails CI if total coverage drops below \`N\` — a ratchet, not a target.

What coverage **is**: a map of untested code. What it **is not**: a measure of test quality. 100% line coverage with no assertions tests nothing. Chase coverage on the code that matters (money, auth, data integrity) and do not agonise over the last few percent of glue code. A coverage report that suddenly drops on a PR is a useful review signal: "this new branch has no test".`,

    contentHi: `## \`factory_boy\`

Ek test ko kaam karne ko objects chahिए, aur unhe haath se banana verbose aur brittle hai: har required field likha hua, har FK pehle banaya, aur ek schema change sau \`setUp\` methods todता hai. Ek **factory** ek valid instance ke liye ek declarative recipe hai.

Declarations:

- **\`factory.Faker("...")\`** — ek realistic fake (name, email, \`past_datetime\`, ...).
- **\`factory.Sequence(lambda n: ...)\`** — \`n\` ek prati-factory counter hai; unique fields ke liye.
- **\`factory.SubFactory(OtherFactory)\`** — ek related object, **usi strategy** se built (build → build, create → create). \`parent__child_field=...\` se nested override karo.
- **\`factory.LazyAttribute(lambda obj: ...)\`** — is object par pehle se set doosre attributes se computed.
- **\`factory.LazyFunction(lambda: ...)\`** — computed, object access nahi.
- **\`@factory.post_generation\`** — ek hook jo instance ke exist hone ke **baad** chalta hai: ek hashed password set karo, M2M members add karo, child rows banao.
- **\`class Params\` + traits** — named bundles.

Strategies:

- **\`.build()\`** — instance ko memory mein construct karo, **save mat karo**. Koi database nahi — \`__str__\`, \`clean()\`, serializers test karne ke liye badhिya.
- **\`.create()\`** — instance aur iske sub-factories save karo. \`db\` chahिए.
- **\`.build_batch(n)\` / \`.create_batch(n)\`** — ek list.

## Mocking

Ek achhा test **deterministic** aur **isolated** hai: har run same result, network, wall clock, randomness, ya doosre service ke up hone par koi dependency nahi.

### HTTP — \`responses\`

\`@responses.activate\` test mein har \`requests\` call intercept karta hai. Aap expected responses register karte ho; ek unregistered call \`ConnectionError\` raise karta hai, toh test **galti se** real API hit **nahi kar sakta**. Phir aap \`responses.calls\` par assert karte ho.

### Baaki sab — \`unittest.mock.patch\`

\`patch("path.to.thing")\` \`thing\` ko **jahaan ise look up kiya jaata hai** replace karta hai, jahaan ise define kiya gaya wahaan nahi — \`myapp.services.stripe\` patch karo, \`stripe\` nahi, agar \`services.py\` ne \`import stripe\` kiya.

**Boundary** par mock karo (third party ke around aapka apna thin wrapper), vendor SDK ke andar gehre nahi.

### Time — \`freezegun\`

\`@freeze_time("2026-01-15")\` \`datetime.now\`, \`date.today\`, \`time.time\`, aur \`django.utils.timezone.now\` freeze karta hai.

### Niyam

**Apni dependencies ke edges** mock karo, **apna khud ka code** nahi. Agar aap ek chauthे ko test karne ko apने teen functions mock kar rahe ho, design bahut coupled hai.

## Coverage

\`coverage.py\` (\`pytest-cov\` ke zariye) record karta hai ki test suite ke dauran kaunsी lines chalीं.

- **\`term-missing\`** prati file, un line numbers ko print karta hai jinhe kisi test ne execute nahi kiya.
- **\`--cov-branch\`** additionally check karta hai ki har \`if\`/\`while\`/\`for\` ke dono outcomes liye gaye. Line coverage 100% ho sakta hai jabki ek branch kabhi exercise na ho.
- **\`--cov-fail-under=N\`** CI fail karta hai agar total coverage \`N\` se neeche gire.

Coverage jo **hai**: untested code ka ek map. Jo **nahi hai**: test quality ka ek measure. Bina assertions ke 100% line coverage kuch test nahi karta. Us code par coverage chase karo jo maayne rakhta hai (money, auth, data integrity).`,

    examples: [
      {
        title: 'build() vs create(): in-memory graph vs saved graph, with a SubFactory',
        titleHi: 'build() vs create(): in-memory graph vs saved graph, ek SubFactory ke saath',
        code: `import django
from django.conf import settings
settings.configure(SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
import factory
from factory.django import DjangoModelFactory

class Author(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    pages = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Author)
    se.create_model(Book)

class AuthorFactory(DjangoModelFactory):
    class Meta:
        model = Author
    name = factory.Sequence(lambda n: f"Author {n}")

class BookFactory(DjangoModelFactory):
    class Meta:
        model = Book
    title = factory.Sequence(lambda n: f"Book {n}")
    author = factory.SubFactory(AuthorFactory)
    pages = factory.LazyFunction(lambda: 100)

# build() -- nothing saved, SubFactory also just built
b = BookFactory.build()
print("build: book.pk =", b.pk, "| author.pk =", b.author.pk, "| author.name =", b.author.name)
print("build: DB untouched ->", Author.objects.count(), Book.objects.count())

# create() -- both saved
c = BookFactory.create()
print("create: book.pk set =", c.pk is not None, "| author.pk set =", c.author.pk is not None)

# override own + nested fields
d = BookFactory(pages=42, author__name="Ada Lovelace")
print("override:", d.pages, "|", d.author.name)

BookFactory.create_batch(3)
print("counts after create + override + batch:", Author.objects.count(), Book.objects.count())`,
        output: `build: book.pk = None | author.pk = None | author.name = Author 0
build: DB untouched -> 0 0
create: book.pk set = True | author.pk set = True
override: 42 | Ada Lovelace
counts after create + override + batch: 5 5`,
        explain: 'django-environ gives typed accessors over os.environ. env of DEBUG, declared as a bool with default False, parses the string "false" into the actual boolean False -- not the truthy string. env.list splits ALLOWED_HOSTS on commas. env.int returns the default 60 when the variable is unset. env.db of DATABASE_URL parses one postgres URL into the whole DATABASES default dict -- ENGINE, NAME, USER, HOST, PORT. And env of STRIPE_SECRET_KEY, with no default, raises ImproperlyConfigured at startup, so the app refuses to boot misconfigured rather than running with a missing secret.',
        explainHi: 'django-environ os.environ ke upar typed accessors deta hai. DEBUG ka env, ek bool ke roop mein default False ke saath declare kiya, string "false" ko asal boolean False mein parse karta hai -- truthy string nahi. env.list ALLOWED_HOSTS ko commas par split karta hai. env.int unset hone par default 60 lautata hai. DATABASE_URL ka env.db ek postgres URL ko poore DATABASES default dict mein parse karta hai. Aur STRIPE_SECRET_KEY ka env, bina default ke, startup par ImproperlyConfigured raise karta hai.',
      },
      {
        title: 'responses: the test cannot hit the network; assert on what was sent',
        titleHi: 'responses: test network hit nahi kar sakta; jo bheja gaya uspar assert karo',
        code: `import json
import requests
import responses

PARTNER = "https://partner.example.com/v1/orders"

# the code under test
def push_order(order_id, total):
    r = requests.post(PARTNER, json={"order_id": order_id, "total_cents": total},
                      headers={"Authorization": "Bearer secret"}, timeout=10)
    r.raise_for_status()
    return r.json()["partner_id"]

@responses.activate
def run_happy():
    responses.post(PARTNER, json={"partner_id": "P-99"}, status=201)
    pid = push_order(7, 4200)
    sent = responses.calls[0].request
    print("returned partner id:", pid)
    print("called URL:", sent.url)
    print("sent body:", json.loads(sent.body))
    print("auth header forwarded:", sent.headers["Authorization"])
    print("number of HTTP calls:", len(responses.calls))

@responses.activate
def run_unregistered():
    # no responses.post(...) registered -> a real call is blocked
    try:
        push_order(1, 100)
    except requests.exceptions.ConnectionError as e:
        print("unregistered call blocked:", type(e).__name__)

run_happy()
run_unregistered()`,
        output: `returned partner id: P-99
called URL: https://partner.example.com/v1/orders
sent body: {'order_id': 7, 'total_cents': 4200}
auth header forwarded: Bearer secret
number of HTTP calls: 1
unregistered call blocked: ConnectionError`,
        explain: 'Before read_env the variables are not in os.environ. environ.Env.read_env reads a KEY=value file -- comments and blank lines allowed -- and populates os.environ, so DEBUG parses to True and DATABASE_URL resolves to a sqlite3 config. This is a local-development convenience: the file is gitignored and never deployed. The last line proves the safety property: setting a real os.environ variable and then re-reading shows the real variable wins -- read_env does not overwrite what the platform already set, so a .env file cannot accidentally override production config.',
        explainHi: 'read_env se pehle variables os.environ mein nahi hain. environ.Env.read_env ek KEY=value file padhta hai aur os.environ populate karta hai, toh DEBUG True parse hota hai aur DATABASE_URL ek sqlite3 config mein resolve hota hai. Ye ek local-development suvidha hai: file gitignored hai aur kabhi deployed nahi. Aakhri line safety property sabit karti hai: ek real os.environ variable set karke phir re-read karna dikhata hai ki real variable jeetta hai -- read_env platform ke pehle se set kiye ko overwrite nahi karta.',
      },
      {
        title: 'freeze_time + unittest.mock.patch: deterministic dates and a faked dependency',
        titleHi: 'freeze_time + unittest.mock.patch: deterministic dates aur ek faked dependency',
        code: `from datetime import date, datetime, timezone
from freezegun import freeze_time
from unittest.mock import patch

# --- code under test ---
def _now():
    return datetime.now(timezone.utc)

def trial_end(days=14):
    return (_now().date().replace(day=1) if False else _now().date()).fromordinal(
        _now().date().toordinal() + days)

class Notifier:
    def send(self, to, msg):
        raise RuntimeError("real network call!")     # must never run in a test

def welcome(user_email):
    Notifier().send(user_email, f"Welcome! Trial ends {trial_end()}")
    return trial_end()

# --- tests ---
@freeze_time("2026-01-15 09:30:00")
def test_dates_are_frozen():
    print("now (frozen):", _now().isoformat())
    print("trial ends:", trial_end())               # 2026-01-15 + 14 days
    assert trial_end() == date(2026, 1, 29)

@freeze_time("2026-01-15")
@patch.object(Notifier, "send", return_value=None)
def test_welcome_sends_and_returns_expiry(mock_send):
    ends = welcome("ada@example.com")
    print("welcome returned:", ends)
    mock_send.assert_called_once()
    to, msg = mock_send.call_args.args
    print("notified:", to, "| message mentions the date:", "2026-01-29" in msg)

test_dates_are_frozen()
test_welcome_sends_and_returns_expiry()`,
        output: `now (frozen): 2026-01-15T09:30:00+00:00
trial ends: 2026-01-29
welcome returned: 2026-01-29
notified: ada@example.com | message mentions the date: True`,
        explain: 'base.py holds everything common and reads SECRET_KEY from the environment. local.py and production.py each do from base import star and then override a few things: local turns DEBUG on, adds debug_toolbar, and swaps the email backend to console; production adds the WhiteNoise middleware and the SECURE_ settings. You pick one with DJANGO_SETTINGS_MODULE. Both files still read the secret from the environment via base -- the per-file split only decides non-secret defaults (which apps, which middleware, DEBUG), never hard-codes a production value.',
        explainHi: 'base.py sab common rakhta hai aur SECRET_KEY ko environment se padhta hai. local.py aur production.py har ek from base import star karta hai aur phir kuch override karta hai: local DEBUG on karta hai, debug_toolbar add karta hai, email backend console kar deta hai; production WhiteNoise middleware aur SECURE_ settings add karta hai. Aap DJANGO_SETTINGS_MODULE se ek chunte ho. Dono files abhi bhi secret ko base ke zariye environment se padhti hain -- prati-file split sirf non-secret defaults decide karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `@patch("stripe.Charge.create", return_value={"paid": True})     # patches the library itself
def test_checkout(mock):
    checkout(order)
# but shop/services.py did \`import stripe\` and calls \`stripe.Charge.create(...)\`
# -> the patch may or may not take effect depending on import timing; flaky`,
        right: `@patch("shop.services.stripe.Charge.create", return_value={"paid": True})
def test_checkout(mock):                       # patch where it is LOOKED UP
    checkout(order)
    mock.assert_called_once()
# even better: wrap the vendor in your own shop/payments.py and patch THAT
@patch("shop.payments.charge_card", return_value=PaymentResult(ok=True))`,
        why: '`mock.patch` replaces a name in a specific namespace. If `shop/services.py` does `import stripe` and later calls `stripe.Charge.create`, the name `stripe` lives in `shop.services` — you must patch `"shop.services.stripe.Charge.create"`. Patching `"stripe.Charge.create"` only works if nothing has already bound the name. The robust fix is to not reach into the vendor SDK from tests at all: put a thin `charge_card()` wrapper in your own module and mock *that* — a stable interface you control, not the SDK\'s internals which change between versions.',
        whyHi: '`mock.patch` ek vishisht namespace mein ek name replace karta hai. Agar `shop/services.py` `import stripe` karta hai aur baad mein `stripe.Charge.create` call karta hai, name `stripe` `shop.services` mein rehta hai — aapko `"shop.services.stripe.Charge.create"` patch karna hoga. Robust fix vendor SDK mein tests se pahunchna hi nahi: apने module mein ek thin `charge_card()` wrapper daalो aur *use* mock karo.',
      },
      {
        wrong: `class OrderFactory(DjangoModelFactory):
    class Meta:
        model = Order
    customer = factory.SubFactory(CustomerFactory)
    total = 100
    created_at = datetime(2024, 1, 1)         # a fixed literal -> every order has the same date

def test_recent_orders():
    OrderFactory.create_batch(5)              # all 5 have created_at = 2024-01-01
    assert recent_orders().count() == 0       # passes for the wrong reason`,
        right: `class OrderFactory(DjangoModelFactory):
    class Meta:
        model = Order
    customer = factory.SubFactory(CustomerFactory)
    total = factory.Faker("pyint", min_value=10, max_value=500)
    created_at = factory.LazyFunction(timezone.now)     # or Faker("past_datetime")

def test_recent_orders():
    old = OrderFactory(created_at=timezone.now() - timedelta(days=40))
    new = OrderFactory()                                 # now
    assert list(recent_orders()) == [new]`,
        why: 'Hard-coding a field to a literal in the factory means every object the factory makes is identical on that field. A test for "recent orders" then either passes trivially (all orders are old) or fails confusingly, and it does not actually exercise the date logic. Use `LazyFunction(timezone.now)` or a `Faker` for fields whose *variation* matters, and set the specific value explicitly in the one test that cares about it (`OrderFactory(created_at=...)`). The factory should produce a *plausible, varied* object; the test pins down only what it is asserting on.',
        whyHi: 'Factory mein ek field ko ek literal par hard-code karna matlab factory jo har object banata hai wo us field par identical hai. "Recent orders" ka ek test phir ya to trivially pass hota hai ya confusingly fail. `LazyFunction(timezone.now)` ya ek `Faker` istemal karo un fields ke liye jinka *variation* maayne rakhta hai, aur us ek test mein specific value explicitly set karo jise iski parwah hai.',
      },
      {
        wrong: `# CI: pytest --cov=myproject --cov-fail-under=100
# a dev adds a genuinely-hard-to-test error branch (a disk-full handler)
#   and, to make CI pass, writes:
def test_disk_full_handler():
    handle_disk_full()          # no assertions -- just runs the line for the coverage number`,
        right: `# --cov-fail-under=85, and code review flags coverage DROPS on the diff
# the disk-full branch either gets a real test (mock the OSError) or a
#   "# pragma: no cover" with a comment explaining why it is untestable here`,
        why: 'A 100% coverage gate turns coverage from a signal into a target, and per Goodhart\'s law it stops being a good signal — people write assertion-free tests that execute a line without checking anything, just to keep the number up. Set the gate at a realistic level (80-90%), and treat a coverage *decrease* on a pull request as the real signal: it means the new code has a path no test touches. Genuinely untestable lines (defensive branches for impossible states, platform-specific code) get an explicit `# pragma: no cover` with a reason, not a fake test.',
        whyHi: 'Ek 100% coverage gate coverage ko ek signal se ek target mein badalta hai, aur Goodhart ke niyam ke hisaab se ye ek achhа signal hona band kar deta hai — log assertion-free tests likhte hain jo ek line execute karte hain bina kuch check kiye. Gate ko ek realistic level par set karo (80-90%), aur ek pull request par coverage *decrease* ko asli signal maano. Sach mein untestable lines ko ek explicit `# pragma: no cover` milta hai, ek fake test nahi.',
      },
    ],

    realWorld: [
      {
        en: '**A `factories.py` per app** with a factory for every model, `SubFactory` chains for the FKs, `Sequence` for unique fields, and traits for common states (`OrderFactory(paid=True)`, `UserFactory(staff=True)`). Tests read as `OrderFactory(customer__country="DE")` — the noise is in the factory, not the test.',
        hi: '**Prati app ek `factories.py`** har model ke liye ek factory ke saath, FKs ke liye `SubFactory` chains, unique fields ke liye `Sequence`, aur aam states ke liye traits. Tests `OrderFactory(customer__country="DE")` ke roop mein padhte hain.',
      },
      {
        en: '**`@responses.activate` on every test of an integration** — payment gateway, shipping API, email provider — registering the exact expected request/response and asserting `responses.calls[0].request` matches the contract, so a real outbound call in a test is impossible and a contract drift is caught.',
        hi: '**Ek integration ke har test par `@responses.activate`** — payment gateway, shipping API, email provider — exact expected request/response register karta hua, toh ek test mein ek real outbound call asambhav hai.',
      },
      {
        en: '**`freeze_time` fixtures for anything time-sensitive** — trial expiry, rate-limit windows, "digest sent daily", token TTLs — plus `pytest --cov-branch --cov-fail-under=85` in CI and a bot comment when a PR drops coverage on changed files.',
        hi: '**Kisi bhi time-sensitive cheez ke liye `freeze_time` fixtures** — trial expiry, rate-limit windows, token TTLs — plus CI mein `pytest --cov-branch --cov-fail-under=85` aur ek bot comment jab ek PR changed files par coverage girae.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `factory.build()` and `factory.create()`, and when do you use `SubFactory`, `LazyAttribute`, and `post_generation`?',
        qHi: '`factory.build()` aur `factory.create()` mein kya antar hai, aur aap `SubFactory`, `LazyAttribute`, aur `post_generation` kab istemal karte ho?',
        a: 'build constructs the model instance in memory and does not save it, and it also only builds any related objects declared with SubFactory rather than saving them. Because nothing hits the database, a build-based test needs no database access at all, which makes it fast and suitable for testing things like a model\'s string representation, its clean method, a computed property, or a serializer\'s output. create saves the instance and cascades: every SubFactory is created too, so you get a fully persisted object graph, and the test needs database access. Factory of dots, or just calling the factory, defaults to create. SubFactory is how you express a foreign key: OrderFactory declares customer equals SubFactory of CustomerFactory, so asking for an order gives you a valid customer without the test mentioning customers, and it follows the same strategy — build propagates to build, create to create. You override a nested field with double-underscore syntax, like OrderFactory with customer dunder country equals DE. LazyAttribute takes a function of the object being built and computes a value from other attributes already set on it — for example an email built from the username. LazyFunction is the same idea but the callable takes no argument, for values that do not depend on the object, like timezone dot now. post_generation is a hook that runs after the instance exists, which is required for anything you cannot set as a constructor argument: many-to-many relationships, a hashed password that has to go through set_password, or creating child rows like order lines. Its signature gives you a create flag telling you which strategy ran and an extracted value holding whatever was passed for that declaration name.',
        aHi: 'build model instance ko memory mein construct karta hai aur ise save nahi karta, aur ye SubFactory se declare kiye kisi related objects ko bhi sirf build karta hai save karne ke bजाy. Kyunki kuch database hit nahi karta, ek build-based test ko database access ki bilkul zaroorat nahi, jo ise tez banata hai aur ek model ki string representation, iske clean method, ek computed property, ya ek serializer ke output ko test karne ke liye upयुkt. create instance ko save karta hai aur cascade karta hai: har SubFactory bhi create hota hai. Factory ya bस factory call karna default se create hai. SubFactory aap ek foreign key kaise express karte ho: OrderFactory customer equals SubFactory of CustomerFactory declare karta hai. Aap ek nested field ko double-underscore syntax se override karte ho. LazyAttribute ek function of the object leta hai aur is par pehle se set doosre attributes se ek value compute karta hai. LazyFunction wahi idea hai par callable koi argument nahi leta. post_generation ek hook hai jo instance ke exist hone ke baad chalta hai, jo kisi bhi cheez ke liye zaroori hai jise aap ek constructor argument ke roop mein set nahi kar sakte: many-to-many relationships, ek hashed password, ya child rows banana.',
      },
      {
        q: 'How do you keep a test from hitting a real external API, and what should you actually assert?',
        qHi: 'Aap ek test ko ek real external API hit karne se kaise rokte ho, aur aapko asal mein kya assert karna chahिए?',
        a: 'For code that uses the requests library, the standard tool is responses. You decorate the test with responses dot activate, which intercepts every requests call for the duration of the test. You then register the specific responses you expect — this URL and method returns this JSON with this status. Two things follow. First, any request your code makes that you did not register raises a ConnectionError, so it is impossible for the test to silently reach the real API; the test fails loudly instead. Second, responses records every call in responses dot calls, and that is what you assert on: that the right URL was hit, with the right method, that the request body your code serialised matches the contract the partner expects, that the auth header was forwarded, and how many times it was called — for example asserting a retry made exactly two calls. For non-HTTP dependencies, or an SDK that does not use requests, you use unittest dot mock dot patch, and the key rule is to patch the name where it is looked up, not where it is defined: if your service module did import stripe, you patch your_module dot stripe dot something, not stripe dot something. Even better, wrap the third party in a thin function of your own and mock that, because your wrapper is a stable interface you control. What you assert is behaviour at your boundary: that your code called the dependency once, with the arguments derived correctly from the input, and that it handled the response — success, error, retry — the way it should. You are testing your code\'s side of the contract, not the vendor\'s implementation. And you mock the edges of your system, not your own internal functions — if a test needs to mock several of your own functions, that is telling you the code is too coupled.',
        aHi: 'requests library istemal karne wale code ke liye, standard tool responses hai. Aap test ko responses dot activate se decorate karte ho, jo test ki avधि ke liye har requests call intercept karta hai. Aap phir wo specific responses register karte ho jo aap expect karte ho. Do cheezein follow karti hain. Pehli, koi bhi request jo aapke code ne ki jo aapne register nahi ki ek ConnectionError raise karti hai, toh test ke liye chupchaap real API tak pahunchna asambhav hai. Doosri, responses har call responses dot calls mein record karta hai, aur wahi aap assert karte ho: ki sahi URL hit hua, sahi method ke saath, ki aapke code ne serialise kiya request body partner ki expect ki contract se match karta hai, ki auth header forward hua. Non-HTTP dependencies ke liye aap unittest dot mock dot patch istemal karte ho, aur mukhya niyam name ko jahaan ise look up kiya jaata hai patch karna hai. Aur behtar, third party ko apne ek thin function mein wrap karo aur use mock karo. Aap jo assert karte ho wo aapki boundary par behaviour hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django (`settings.configure` + `schema_editor.create_model`). Models `Author(name)` and `Book(title, author FK, pages)`. An `AuthorFactory(DjangoModelFactory)` with `name = factory.Sequence(lambda n: f"Author {n}")`, and a `BookFactory` with `title = Sequence`, `author = factory.SubFactory(AuthorFactory)`, `pages = factory.LazyFunction(lambda: 100)`. Assert: `BookFactory.build()` gives `b.pk is None` AND `b.author.pk is None` AND `Author.objects.count() == 0`; `BookFactory.create()` gives non-None pks; `BookFactory(pages=42, author__name="Ada")` gives `.pages == 42` and `.author.name == "Ada"`; after `.create_batch(3)` the counts are 5 and 5.',
        taskHi: 'Standalone Django. `Author(name)` + `Book(title, author FK, pages)` models. `AuthorFactory` (`name = Sequence`), `BookFactory` (`title = Sequence`, `author = SubFactory(AuthorFactory)`, `pages = LazyFunction(lambda: 100)`). Assert: `.build()` -> pks `None` + `Author.objects.count() == 0`; `.create()` -> non-None pks; `BookFactory(pages=42, author__name="Ada")`; `.create_batch(3)` -> counts 5, 5.',
        hint: '`from factory.django import DjangoModelFactory`; `import factory`. `.build()` propagates the "don\'t save" strategy to the `SubFactory`, so `b.author` is also unsaved. `author__name="Ada"` reaches into the `SubFactory`.',
        hintHi: '`from factory.django import DjangoModelFactory`. `.build()` "save mat karo" strategy ko `SubFactory` tak propagate karta hai. `author__name="Ada"` `SubFactory` mein pahunchta hai.',
      },
      {
        task: 'Pure Python + `responses`. A function `push_order(order_id, total)` that does `requests.post("https://partner.example.com/v1/orders", json={"order_id": order_id, "total_cents": total}, headers={"Authorization": "Bearer secret"})`, calls `raise_for_status()`, and returns `r.json()["partner_id"]`. `@responses.activate` test 1: register `responses.post(URL, json={"partner_id": "P-99"}, status=201)`, call `push_order(7, 4200)`, assert it returns `"P-99"`, `responses.calls[0].request.url` ends `/v1/orders`, `json.loads(...body)["total_cents"] == 4200`, the `Authorization` header was forwarded, and `len(responses.calls) == 1`. `@responses.activate` test 2: register NOTHING, assert `push_order(1, 100)` raises `requests.exceptions.ConnectionError`.',
        taskHi: 'Pure Python + `responses`. `push_order(order_id, total)` jo `requests.post(URL, json=..., headers={"Authorization": "Bearer secret"})` kare, `raise_for_status()`, `r.json()["partner_id"]` return kare. Test 1: register + call + assert (returns `"P-99"`, URL, body, auth header, `len(calls) == 1`). Test 2: kuch register mat karo, assert `ConnectionError`.',
        hint: '`import responses`. `responses.post(url, json=..., status=...)` is the modern shorthand for `responses.add(responses.POST, ...)`. An unregistered request under `@responses.activate` raises `ConnectionError` — the network is unreachable by design.',
        hintHi: '`import responses`. `responses.post(url, json=..., status=...)`. `@responses.activate` ke tahat ek unregistered request `ConnectionError` raise karta hai.',
      },
      {
        task: 'Pure Python + `freezegun` + `unittest.mock`. `_now()` returns `datetime.now(timezone.utc)`; `trial_end(days=14)` returns `date.fromordinal(_now().date().toordinal() + days)`. A `Notifier` class whose `send(self, to, msg)` raises `RuntimeError` (a real call). `welcome(email)` calls `Notifier().send(email, f"... {trial_end()}")` and returns `trial_end()`. Test 1: `@freeze_time("2026-01-15 09:30:00")` -> assert `trial_end() == date(2026, 1, 29)`. Test 2: `@freeze_time("2026-01-15")` + `@patch.object(Notifier, "send", return_value=None)` -> call `welcome("ada@example.com")`, assert it returns `date(2026, 1, 29)`, `mock_send.assert_called_once()`, and the message arg contains `"2026-01-29"`.',
        taskHi: 'Pure Python + `freezegun` + `unittest.mock`. `_now()`, `trial_end(days=14)`. Ek `Notifier` jiska `send` `RuntimeError` raise kare. `welcome(email)`. Test 1: `@freeze_time("2026-01-15 09:30:00")` -> `trial_end() == date(2026, 1, 29)`. Test 2: `@freeze_time` + `@patch.object(Notifier, "send", return_value=None)` -> `welcome(...)`, assert return, `assert_called_once()`, message mein date.',
        hint: '`from freezegun import freeze_time`; `from unittest.mock import patch`. `freeze_time` freezes `datetime.now`. `@patch.object(Notifier, "send", ...)` replaces the method so the `RuntimeError` never fires; `mock_send.call_args.args` is `(to, msg)`.',
        hintHi: '`from freezegun import freeze_time`; `from unittest.mock import patch`. `freeze_time` `datetime.now` freeze karta hai. `@patch.object(Notifier, "send", ...)` method replace karta hai; `mock_send.call_args.args` `(to, msg)` hai.',
      },
    ],

    keyTakeaways: [
      '`factory_boy` `DjangoModelFactory` = a declarative recipe for a valid instance. `Faker("name")` (realistic), `Sequence(lambda n: ...)` (unique), `SubFactory(OtherFactory)` (a related object, same strategy, `parent__child=...` to override), `LazyAttribute(lambda o: ...)` (from other fields), `LazyFunction(lambda: ...)` (no object), `@post_generation` (M2M / children / hashed password — runs AFTER the row exists).',
      '`.build()` = in-memory, NOT saved, SubFactory also just built -> NO database needed (test `__str__`/`clean()`/serializers). `.create()` (== `Factory()`) = saved + sub-factories saved. `.build_batch(n)` / `.create_batch(n)` = a list.',
      'Don\'t hard-code varying fields to a literal in the factory (`created_at = datetime(2024,1,1)`) — use `LazyFunction(timezone.now)`/`Faker` and pin the specific value in the one test that asserts on it.',
      'A good test is DETERMINISTIC + ISOLATED: no real network, clock, randomness, or other service. Mock anything that violates that — at the BOUNDARY (your thin wrapper), not deep in the vendor SDK.',
      '`responses` (`@responses.activate`): intercepts every `requests` call; register expected responses; an UNREGISTERED call raises `ConnectionError` (the test CANNOT hit the real API). Assert on `responses.calls[i].request` — url, method, body, headers.',
      '`unittest.mock.patch("path.to.thing")` replaces a name WHERE IT IS LOOKED UP, not where defined — patch `myapp.services.stripe`, not `stripe`, if `services.py` did `import stripe`. `assert_called_once_with`, `call_args`, `return_value`, `side_effect`.',
      '`freezegun` `@freeze_time("2026-01-15")` freezes `datetime.now` / `date.today` / `time.time` / `timezone.now` — essential for expiry, scheduling, TTLs, "created today".',
      'COVERAGE (`pytest --cov --cov-report=term-missing --cov-branch`): a MAP of untested code, NOT a measure of quality (100% with no assertions tests nothing). `--cov-branch` checks both sides of every `if`/`for`. Gate at 80-90% (`--cov-fail-under`); the real signal is a coverage DROP on a PR. `# pragma: no cover` for genuinely untestable lines.',
    ],
    keyTakeawaysHi: [
      '`factory_boy` `DjangoModelFactory` = ek valid instance ke liye ek declarative recipe. `Faker("name")`, `Sequence(lambda n: ...)` (unique), `SubFactory(OtherFactory)` (`parent__child=...` override), `LazyAttribute(lambda o: ...)`, `LazyFunction(lambda: ...)`, `@post_generation` (M2M / children — row ke exist hone ke BAAD chalta hai).',
      '`.build()` = in-memory, SAVED NAHI, SubFactory bhi bस built -> KOI database NAHI chahिए. `.create()` (== `Factory()`) = saved + sub-factories saved. `.build_batch(n)` / `.create_batch(n)` = ek list.',
      'Factory mein varying fields ko ek literal par hard-code mat karo — `LazyFunction(timezone.now)`/`Faker` istemal karo aur specific value us ek test mein pin karo jo ispar assert karta hai.',
      'Ek achhа test DETERMINISTIC + ISOLATED hai: koi real network, clock, randomness. Ise violate karne wali kisi bhi cheez ko mock karo — BOUNDARY par (aapka thin wrapper), vendor SDK mein gehre nahi.',
      '`responses` (`@responses.activate`): har `requests` call intercept karta hai; expected responses register karo; ek UNREGISTERED call `ConnectionError` raise karta hai. `responses.calls[i].request` par assert karo.',
      '`unittest.mock.patch("path.to.thing")` ek name ko JAHAAN ISE LOOK UP KIYA JAATA HAI replace karta hai — `myapp.services.stripe` patch karo, `stripe` nahi. `assert_called_once_with`, `call_args`, `return_value`, `side_effect`.',
      '`freezegun` `@freeze_time("2026-01-15")` `datetime.now` / `date.today` / `time.time` / `timezone.now` freeze karta hai — expiry, scheduling, TTLs ke liye zaroori.',
      'COVERAGE: untested code ka ek MAP, quality ka ek measure NAHI. `--cov-branch` har `if`/`for` ke dono side check karta hai. 80-90% par gate karo; asli signal ek PR par coverage DROP hai. `# pragma: no cover` genuinely untestable lines ke liye.',
    ],
  },

  {
    slug: 'dj-settings-and-12-factor',
    title: 'Settings, Environments & 12-Factor Config',
    titleHi: 'Settings, Environments & 12-Factor Config',
    description: 'The same code runs on your laptop, in CI, in staging, and in production — what differs is *configuration*: the database URL, the secret key, whether `DEBUG` is on, which email backend. The 12-factor rule is: config comes from the environment, never from code, and secrets never touch the repo.',
    descriptionHi: 'Wahi code aapke laptop par, CI mein, staging mein, aur production mein chalta hai — jo alag hai wo *configuration* hai: database URL, secret key, `DEBUG` on hai ya nahi, kaunsा email backend. 12-factor niyam hai: config environment se aata hai, kabhi code se nahi, aur secrets kabhi repo ko nahi chhoote.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 3,

    analogy: {
      en: '**A stage play that tours to different theatres.** The *script* is your code — identical everywhere, checked into the repo. But at each venue the *technical rider* changes: which power sockets, how the lighting rig is addressed, the local stage manager\'s phone number, the safe combination for the box-office cash. You do not rewrite the script for each theatre and you certainly do not staple the safe combination to the back of every script copy. Instead there is one rider document per venue, kept by the venue, handed to the crew on arrival — the **environment**. The script *reads* the rider ("dim to the level named HOUSE"), it does not *contain* it. And the one document with the safe combination and the bank details lives in a locked drawer, given only to the people who need it, never photocopied into the tour archive — that is **secrets management**: out of the repo, out of the logs, injected at runtime.',
      hi: '**Ek stage play jo alag theatres mein tour karta hai.** *Script* aapka code hai — har jagah identical, repo mein checked in. Par har venue par *technical rider* badalta hai: kaunse power sockets, lighting rig kaise address hota hai, local stage manager ka phone number, box-office cash ke liye safe combination. Aap har theatre ke liye script dobara nahi likhte aur aap zaroor har script copy ke peeche safe combination staple nahi karte. Iske bजाy prati venue ek rider document hai, venue dwara rakha, arrival par crew ko diya — **environment**. Script rider ko *padhta hai*, ise *contain* nahi karta. Aur safe combination aur bank details waala ek document ek locked drawer mein rehta hai, sirf un logon ko diya jinhe zaroorat hai, kabhi tour archive mein photocopy nahi kiya — wo **secrets management** hai: repo ke bahar, logs ke bahar, runtime par injected.',
    },

    simple: `**The 12-factor rule: config in the environment**

\`\`\`
DON'T:  DEBUG = True                          # differs per environment -> not a code constant
        SECRET_KEY = "django-insecure-abc"    # a secret -> never in the repo
        DATABASES = {"default": {"HOST": "prod-db.internal", "PASSWORD": "hunter2"}}

DO:     read every environment-specific value and every secret from os.environ,
        with a safe default ONLY for values that are safe to default (and DEBUG is not one).
\`\`\`

**\`django-environ\` — typed env reads**

\`\`\`python
# settings.py
import environ

env = environ.Env(
    DEBUG=(bool, False),                       # (type, default) -- DEBUG defaults to False
)
environ.Env.read_env(BASE_DIR / ".env")       # load .env for LOCAL dev only (gitignored)

SECRET_KEY = env("SECRET_KEY")                # no default -> raises if missing (fail loudly)
DEBUG = env("DEBUG")                          # "1"/"true"/"yes" -> True
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])
DATABASES = {"default": env.db("DATABASE_URL")}   # postgres://user:pw@host:5432/name -> the dict
CACHES = {"default": env.cache("REDIS_URL", default="locmemcache://")}
EMAIL_CONFIG = env.email("EMAIL_URL", default="consolemail://")
vars().update(EMAIL_CONFIG)
\`\`\`

\`\`\`
env("X")                       required string; missing -> ImproperlyConfigured (good -- fail fast)
env("X", default="y")          optional
env.bool / env.int / env.list / env.json / env.db / env.cache / env.url / env.email
env.db("DATABASE_URL")         one URL -> the whole DATABASES["default"] dict
.env file                      KEY=value lines, LOCAL DEV ONLY, in .gitignore, never deployed
production                     env vars set by the platform (systemd, Docker, ECS task def, k8s)
\`\`\`

**\`.env\` and \`.gitignore\`**

\`\`\`bash
# .gitignore
.env
.env.*
!.env.example          # DO commit a template with dummy values + every key documented

# .env.example (committed)
SECRET_KEY=change-me
DEBUG=True
DATABASE_URL=postgres://dev:dev@localhost:5432/myapp
\`\`\`

**Two layout options**

\`\`\`
A) ONE settings.py + env         simplest; the file branches on env("ENVIRONMENT") if needed
B) settings/ package             base.py + local.py + production.py + test.py, each
   base.py    common                "from .base import *" then override
   local.py   DEBUG=True, sqlite, django-debug-toolbar
   production.py  DEBUG=False, real DB, SECURE_* (Module 6), whitenoise/S3
   -> DJANGO_SETTINGS_MODULE=myproject.settings.production
\`\`\`

**Never forget**

\`\`\`
- python manage.py check --deploy         (Module 6) -- run in CI, fail on WARNING
- DEBUG=False in every non-local environment (leaks the whole settings + SQL on an error page)
- SECRET_KEY: 50+ random chars, from env, DIFFERENT per environment, rotatable
- no secret in the repo, in a log line, in an error report, or in a URL
\`\`\``,

    simpleHi: `**12-factor niyam: config environment mein**

\`\`\`
NAHI:  DEBUG = True                          # prati environment alag -> ek code constant nahi
       SECRET_KEY = "django-insecure-abc"    # ek secret -> kabhi repo mein nahi
       DATABASES = {"default": {"HOST": "prod-db.internal", "PASSWORD": "hunter2"}}

KARO:  har environment-specific value aur har secret os.environ se padhो,
       ek safe default SIRF un values ke liye jinhe default karna safe hai (aur DEBUG unme se ek nahi).
\`\`\`

**\`django-environ\` — typed env reads**

\`\`\`python
# settings.py
import environ

env = environ.Env(
    DEBUG=(bool, False),                       # (type, default) -- DEBUG default se False
)
environ.Env.read_env(BASE_DIR / ".env")       # .env sirf LOCAL dev ke liye load karo (gitignored)

SECRET_KEY = env("SECRET_KEY")                # koi default nahi -> missing hone par raise
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])
DATABASES = {"default": env.db("DATABASE_URL")}   # postgres://user:pw@host:5432/name -> dict
CACHES = {"default": env.cache("REDIS_URL", default="locmemcache://")}
\`\`\`

\`\`\`
env("X")                       required string; missing -> ImproperlyConfigured (achhа -- fail fast)
env("X", default="y")          optional
env.bool / env.int / env.list / env.json / env.db / env.cache / env.url / env.email
env.db("DATABASE_URL")         ek URL -> poora DATABASES["default"] dict
.env file                      KEY=value lines, SIRF LOCAL DEV, .gitignore mein, kabhi deployed nahi
production                     platform dwara set env vars (systemd, Docker, ECS task def, k8s)
\`\`\`

**\`.env\` aur \`.gitignore\`**

\`\`\`bash
# .gitignore
.env
.env.*
!.env.example          # dummy values + har key documented waala ek template COMMIT karo

# .env.example (committed)
SECRET_KEY=change-me
DEBUG=True
DATABASE_URL=postgres://dev:dev@localhost:5432/myapp
\`\`\`

**Do layout options**

\`\`\`
A) EK settings.py + env         sabse saral
B) settings/ package             base.py + local.py + production.py + test.py, har ek
   base.py    common                "from .base import *" phir override
   local.py   DEBUG=True, sqlite, django-debug-toolbar
   production.py  DEBUG=False, real DB, SECURE_* (Module 6), whitenoise/S3
   -> DJANGO_SETTINGS_MODULE=myproject.settings.production
\`\`\`

**Kabhi mat bhoolो**

\`\`\`
- python manage.py check --deploy         (Module 6) -- CI mein chalao, WARNING par fail
- har non-local environment mein DEBUG=False
- SECRET_KEY: 50+ random chars, env se, prati environment ALAG, rotatable
- koi secret repo mein, ek log line mein, ek error report mein, ya ek URL mein nahi
\`\`\``,

    content: `## The principle

The same build artifact — the same code, the same container image — should run in every environment. Everything that differs between your laptop, CI, staging, and production is **configuration**, and configuration comes from the **environment** (environment variables), not from code and not from a file baked into the image.

This is the "config" factor of the [12-factor app](https://12factor.net). It has two payoffs: you can promote the exact image that passed CI straight to production (no "works on my machine"), and secrets never live in the repo.

## What is config vs what is code

- **Config** (from the environment): \`SECRET_KEY\`, \`DEBUG\`, \`ALLOWED_HOSTS\`, \`DATABASE_URL\`, \`REDIS_URL\`, email/SMS provider keys, S3 bucket names, feature flags, the Sentry DSN, \`ENVIRONMENT\` itself.
- **Code** (in \`settings.py\`): \`INSTALLED_APPS\`, \`MIDDLEWARE\`, \`TEMPLATES\`, \`AUTH_PASSWORD_VALIDATORS\`, URL routing — structural choices that are the same everywhere.

The test: *if two environments need different values, it is config.* \`DEBUG\` is config (it must be \`False\` in production, \`True\` locally). \`INSTALLED_APPS\` is code (mostly the same; a few dev-only apps can be appended conditionally).

## Reading the environment

Bare \`os.environ\` works but is stringly-typed and verbose (\`os.environ.get("DEBUG", "False") == "True"\`). **\`django-environ\`** gives typed accessors:

\`\`\`python
import environ
env = environ.Env(DEBUG=(bool, False), ALLOWED_HOSTS=(list, []))
environ.Env.read_env(BASE_DIR / ".env")     # populate os.environ from .env (local only)

SECRET_KEY = env("SECRET_KEY")              # required -> ImproperlyConfigured if unset
DEBUG      = env("DEBUG")                   # parsed to bool
DATABASES  = {"default": env.db()}          # reads DATABASE_URL, returns the ENGINE/NAME/USER/... dict
CACHES     = {"default": env.cache()}       # reads CACHE_URL / REDIS_URL
\`\`\`

- **Required with no default** — omit the default and a missing variable raises \`ImproperlyConfigured\` at startup. This is what you want: the app refuses to boot misconfigured rather than running with a silent wrong value.
- **URL-style values** — \`env.db("DATABASE_URL")\` turns \`postgres://user:pass@host:5432/dbname?conn_max_age=60\` into the full \`DATABASES["default"]\` dict. One variable, one place, works with every hosting platform (which all provide a \`DATABASE_URL\`).

## The \`.env\` file — local only

\`.env\` is a convenience for **local development**: a file of \`KEY=value\` lines that \`read_env\` loads into \`os.environ\` so you do not export a dozen variables by hand. It:

- **must be in \`.gitignore\`** — it contains your local secrets;
- **must never be deployed** — production/staging get their variables from the platform (systemd \`EnvironmentFile\`, a Docker \`--env-file\` managed by the orchestrator, an ECS task definition, Kubernetes \`Secret\`s, a secrets manager);
- **should have a committed \`.env.example\`** — every key with a dummy or safe value, so a new developer knows exactly what to set.

## One file or a package

**Option A — one \`settings.py\`.** Everything reads from \`env(...)\`. If a handful of things genuinely need to branch, do it explicitly: \`if env("ENVIRONMENT") == "production": ...\`. Simplest; fewer files to keep in sync.

**Option B — a \`settings/\` package.** \`base.py\` holds everything common; \`local.py\`, \`production.py\`, \`test.py\` each do \`from .base import *\` and override. You select with \`DJANGO_SETTINGS_MODULE=myproject.settings.production\`. More structure; the risk is a setting drifting between \`local\` and \`production\` unnoticed.

Both are fine. Many teams use B for the structure but still read all secrets/URLs from the environment inside each file — the split is about *which non-secret defaults apply*, not about hard-coding prod values.

## The non-negotiables

- **\`DEBUG = False\`** everywhere except local. With \`DEBUG = True\`, an unhandled exception renders a page containing your settings (including secrets if they are in \`settings.py\`), the full traceback, and local variables — to whoever hit the URL.
- **\`SECRET_KEY\`** — 50+ random characters, from the environment, **different in every environment**, and rotatable (changing it invalidates sessions and password-reset tokens, which is the point). Never \`django-insecure-...\` in production.
- **\`ALLOWED_HOSTS\`** — an explicit list; \`[]\` with \`DEBUG=False\` rejects everything, \`["*"]\` disables the Host-header check (Module 1).
- **\`python manage.py check --deploy\`** in CI, failing on any \`WARNING\` (Module 6) — it catches \`DEBUG=True\`, a weak key, missing \`SECURE_*\`, empty \`ALLOWED_HOSTS\`.
- **No secret anywhere it can leak**: not in the repo, not in \`git log\`, not in a log line, not in a Sentry event (scrub — Module 9), not in a URL query string.
- **Fail loudly on missing config.** A required \`env("X")\` with no default that raises at boot is far better than a \`.get("X", "")\` that runs the app with an empty password and fails mysteriously later.`,

    contentHi: `## Siddhant

Wahi build artifact — wahi code, wahi container image — har environment mein chalna chahिए. Aapke laptop, CI, staging, aur production ke beech jo bhi alag hai wo **configuration** hai, aur configuration **environment** (environment variables) se aata hai, code se nahi aur image mein baked ek file se nahi.

Ye [12-factor app](https://12factor.net) ka "config" factor hai. Iske do payoffs hain: aap wo exact image jo CI paas kiya seedhe production par promote kar sakte ho, aur secrets kabhi repo mein nahi rehte.

## Config kya hai vs code kya hai

- **Config** (environment se): \`SECRET_KEY\`, \`DEBUG\`, \`ALLOWED_HOSTS\`, \`DATABASE_URL\`, \`REDIS_URL\`, email/SMS provider keys, S3 bucket names, feature flags, Sentry DSN, khud \`ENVIRONMENT\`.
- **Code** (\`settings.py\` mein): \`INSTALLED_APPS\`, \`MIDDLEWARE\`, \`TEMPLATES\`, \`AUTH_PASSWORD_VALIDATORS\`, URL routing.

Test: *agar do environments ko alag values chahिए, wo config hai.* \`DEBUG\` config hai. \`INSTALLED_APPS\` code hai.

## Environment padhna

Bare \`os.environ\` kaam karta hai par stringly-typed hai. **\`django-environ\`** typed accessors deta hai:

- **Bina default ke required** — default omit karo aur ek missing variable startup par \`ImproperlyConfigured\` raise karta hai. Ye wahi hai jo aap chahte ho: app misconfigured boot karne se mana karta hai.
- **URL-style values** — \`env.db("DATABASE_URL")\` \`postgres://user:pass@host:5432/dbname\` ko poore \`DATABASES["default"]\` dict mein badalta hai. Ek variable, har hosting platform ke saath kaam karta hai.

## \`.env\` file — sirf local

\`.env\` **local development** ke liye ek suvidha hai: \`KEY=value\` lines ki ek file jise \`read_env\` \`os.environ\` mein load karta hai. Ye:

- **\`.gitignore\` mein hona chahिए**;
- **kabhi deployed nahi hona chahिए** — production/staging apne variables platform se paate hain;
- **ek committed \`.env.example\` hona chahिए** — har key ek dummy value ke saath.

## Ek file ya ek package

**Option A — ek \`settings.py\`.** Sab kuch \`env(...)\` se padhta hai. Sabse saral.

**Option B — ek \`settings/\` package.** \`base.py\` sab common rakhta hai; \`local.py\`, \`production.py\`, \`test.py\` har ek \`from .base import *\` karta hai aur override karta hai. Aap \`DJANGO_SETTINGS_MODULE\` se select karte ho.

Dono theek hain.

## Non-negotiables

- **\`DEBUG = False\`** local ke alawa har jagah. \`DEBUG = True\` ke saath, ek unhandled exception ek page render karta hai jismें aapki settings, poora traceback, aur local variables hain.
- **\`SECRET_KEY\`** — 50+ random characters, environment se, **har environment mein alag**, aur rotatable.
- **\`ALLOWED_HOSTS\`** — ek explicit list.
- **\`python manage.py check --deploy\`** CI mein, kisi bhi \`WARNING\` par fail (Module 6).
- **Koi secret kahin nahi jahaan ye leak ho sakta hai**.
- **Missing config par loudly fail karo.** Ek required \`env("X")\` jo boot par raise karta hai ek \`.get("X", "")\` se kaafi behtar hai.`,

    examples: [
      {
        title: 'django-environ: typed reads, a required var that fails loudly, DATABASE_URL -> dict',
        titleHi: 'django-environ: typed reads, ek required var jo loudly fail hota hai, DATABASE_URL -> dict',
        code: `import os
import environ

# --- pretend this is the platform-provided environment ---
os.environ.update({
    "SECRET_KEY": "s" * 50,
    "DEBUG": "false",
    "ALLOWED_HOSTS": "api.example.com,example.com",
    "DATABASE_URL": "postgres://appuser:pw@db.internal:5432/appdb",
    "CACHE_URL": "redis://cache.internal:6379/1",
    "SENTRY_DSN": "",
})

env = environ.Env(DEBUG=(bool, False))

print("SECRET_KEY len:", len(env("SECRET_KEY")))
print("DEBUG:", env("DEBUG"), type(env("DEBUG")).__name__)
print("ALLOWED_HOSTS:", env.list("ALLOWED_HOSTS"))
print("CONN_MAX_AGE (int, default):", env.int("CONN_MAX_AGE", default=60))

db = env.db("DATABASE_URL")
print("DATABASES['default']:", {k: db[k] for k in ("ENGINE", "NAME", "USER", "HOST", "PORT")})

cache = env.cache("CACHE_URL")
print("CACHES backend:", cache["BACKEND"].rsplit(".", 1)[-1], "| location:", cache["LOCATION"])

# a required var with no default -> raises if missing
try:
    env("STRIPE_SECRET_KEY")
except environ.ImproperlyConfigured as e:
    print("missing required var ->", type(e).__name__, "(app refuses to boot)")`,
        output: `SECRET_KEY len: 50
DEBUG: False bool
ALLOWED_HOSTS: ['api.example.com', 'example.com']
CONN_MAX_AGE (int, default): 60
DATABASES['default']: {'ENGINE': 'django.db.backends.postgresql', 'NAME': 'appdb', 'USER': 'appuser', 'HOST': 'db.internal', 'PORT': 5432}
CACHES backend: RedisCache | location: redis://cache.internal:6379/1
missing required var -> ImproperlyConfigured (app refuses to boot)`,
        explain: 'BookFactory.build() constructs a Book in memory and does not save it, and because build propagates its strategy to the SubFactory, the author is unsaved too -- both pks are None and the database is untouched, so a build test needs no db access. BookFactory.create() saves the book and cascades: the SubFactory author is created as well, so both pks are set. Passing pages=42 and author__name="Ada Lovelace" overrides the factory\\\'s own field and reaches into the SubFactory. After a create plus an override plus a create_batch of 3, there are 5 books and 5 authors.',
        explainHi: 'BookFactory.build() ek Book ko memory mein construct karta hai aur ise save nahi karta, aur kyunki build apni strategy ko SubFactory tak propagate karta hai, author bhi unsaved hai -- dono pks None hain aur database untouched hai. BookFactory.create() book ko save karta hai aur cascade karta hai: SubFactory author bhi create hota hai. pages=42 aur author__name="Ada Lovelace" pass karna factory ka apna field override karta hai aur SubFactory mein pahunchta hai. Ek create plus ek override plus ek create_batch of 3 ke baad, 5 books aur 5 authors hain.',
      },
      {
        title: 'read_env loads a .env file into os.environ (local dev convenience)',
        titleHi: 'read_env ek .env file ko os.environ mein load karta hai (local dev suvidha)',
        code: `import os, tempfile, textwrap
import environ

# a .env file as it would sit (gitignored) in a dev checkout
d = tempfile.mkdtemp()
env_path = os.path.join(d, ".env")
open(env_path, "w").write(textwrap.dedent("""
    # local development settings -- NEVER committed, NEVER deployed
    SECRET_KEY=local-dev-not-secret
    DEBUG=True
    DATABASE_URL=sqlite:///db.sqlite3
    EMAIL_URL=consolemail://
    # inline comments and blank lines are fine
    ALLOWED_HOSTS=localhost,127.0.0.1
"""))

# before read_env: these are not in the environment
print("before:", os.environ.get("DATABASE_URL"))

environ.Env.read_env(env_path)         # <-- typically environ.Env.read_env(BASE_DIR / ".env")

env = environ.Env(DEBUG=(bool, False))
print("after read_env:")
print("  DEBUG:", env("DEBUG"))
print("  DATABASE_URL ->", env.db()["ENGINE"].rsplit(".", 1)[-1], env.db()["NAME"])
print("  ALLOWED_HOSTS:", env.list("ALLOWED_HOSTS"))

# a real environment variable WINS over the .env file (platform config takes precedence)
os.environ["DEBUG"] = "False"
print("  DEBUG after a real env var is set:", environ.Env(DEBUG=(bool, False))("DEBUG"),
      "(os.environ beats .env)")`,
        output: `before: None
after read_env:
  DEBUG: True
  DATABASE_URL -> sqlite3 db.sqlite3
  ALLOWED_HOSTS: ['localhost', '127.0.0.1']
  DEBUG after a real env var is set: False (os.environ beats .env)`,
        explain: "@responses.activate intercepts every requests call for the test. run_happy registers a 201 response for the partner URL, so push_order gets its partner id back, and responses.calls records exactly what the code sent -- the URL, the JSON body, the forwarded Authorization header, and that there was one call. run_unregistered registers nothing, so push_order\\'s real POST hits no registered mock and raises ConnectionError -- the test physically cannot reach the real API. You assert on your side of the contract: the right request was made, not the vendor\\'s implementation.",
        explainHi: '@responses.activate test ke liye har requests call intercept karta hai. run_happy partner URL ke liye ek 201 response register karta hai, toh push_order apna partner id wapas paata hai, aur responses.calls theek record karta hai ki code ne kya bheja -- URL, JSON body, forwarded Authorization header, aur ki ek call thi. run_unregistered kuch register nahi karta, toh push_order ka real POST kisi registered mock ko hit nahi karta aur ConnectionError raise karta hai -- test physically real API tak nahi pahunch sakta.',
      },
      {
        title: 'A settings/ package: base + per-environment override via DJANGO_SETTINGS_MODULE',
        titleHi: 'Ek settings/ package: base + DJANGO_SETTINGS_MODULE ke zariye prati-environment override',
        code: `import sys, os, tempfile, textwrap, importlib

d = tempfile.mkdtemp()
pkg = os.path.join(d, "myproj", "settings")
os.makedirs(pkg)
open(os.path.join(d, "myproj", "__init__.py"), "w").write("")
open(os.path.join(pkg, "__init__.py"), "w").write("")

open(os.path.join(pkg, "base.py"), "w").write(textwrap.dedent("""
    import os
    SECRET_KEY = os.environ.get("SECRET_KEY", "unset")
    INSTALLED_APPS = ["django.contrib.contenttypes", "django.contrib.auth"]
    MIDDLEWARE = ["django.middleware.security.SecurityMiddleware"]
    DEBUG = False
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
"""))
open(os.path.join(pkg, "local.py"), "w").write(textwrap.dedent("""
    from .base import *          # noqa
    DEBUG = True
    INSTALLED_APPS = INSTALLED_APPS + ["debug_toolbar"]
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
"""))
open(os.path.join(pkg, "production.py"), "w").write(textwrap.dedent("""
    from .base import *          # noqa
    DEBUG = False
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    MIDDLEWARE = MIDDLEWARE + ["whitenoise.middleware.WhiteNoiseMiddleware"]
"""))

sys.path.insert(0, d)
os.environ["SECRET_KEY"] = "x" * 50

for mod in ("myproj.settings.local", "myproj.settings.production"):
    s = importlib.import_module(mod)
    print(f"{mod}:")
    print("  DEBUG:", s.DEBUG, "| EMAIL_BACKEND:", s.EMAIL_BACKEND.rsplit(".", 2)[-2])
    print("  debug_toolbar installed:", "debug_toolbar" in s.INSTALLED_APPS)
    print("  whitenoise middleware:", any("whitenoise" in m for m in s.MIDDLEWARE))
    print("  SECRET_KEY from env:", s.SECRET_KEY == "x" * 50)`,
        output: `myproj.settings.local:
  DEBUG: True | EMAIL_BACKEND: console
  debug_toolbar installed: True
  whitenoise middleware: False
  SECRET_KEY from env: True
myproj.settings.production:
  DEBUG: False | EMAIL_BACKEND: smtp
  debug_toolbar installed: False
  whitenoise middleware: True
  SECRET_KEY from env: True`,
        explain: "@freeze_time freezes datetime.now, so trial_end -- which is _now plus 14 days -- deterministically returns 2026-01-29 regardless of when the test runs. @patch.object replaces Notifier.send with a mock, so welcome\\'s call to the real send (which would raise on a network call) instead records the arguments. The test asserts welcome returned the frozen expiry date, that send was called exactly once, and that the message it built mentions the date -- verifying behaviour at the boundary without touching the clock or the network.",
        explainHi: '@freeze_time datetime.now ko freeze karta hai, toh trial_end -- jo _now plus 14 days hai -- deterministically 2026-01-29 lautata hai chahe test kab bhi chale. @patch.object Notifier.send ko ek mock se replace karta hai, toh welcome ka real send ka call (jo ek network call par raise karta) badle arguments record karta hai. Test assert karta hai ki welcome frozen expiry date lautaya, ki send theek ek baar call hua, aur ki jo message ise banaya date mention karta hai -- boundary par behaviour verify karna bina clock ya network chhue.',
      },
    ],

    mistakes: [
      {
        wrong: `# settings.py
SECRET_KEY = "django-insecure-9f3k2j..."     # committed to the repo, forever in git history
DEBUG = True
DATABASES = {"default": {
    "ENGINE": "django.db.backends.postgresql",
    "HOST": "prod-db.internal", "USER": "app", "PASSWORD": "S3cr3tP@ss",   # in the repo
}}`,
        right: `SECRET_KEY = env("SECRET_KEY")                # from the environment, no default
DEBUG = env.bool("DEBUG", default=False)
DATABASES = {"default": env.db("DATABASE_URL")}   # postgres://app:...@prod-db.internal/... in the env
# .env (gitignored) for local; the platform injects the real values in prod`,
        why: 'A secret committed to a repo is compromised permanently — it is in the git history on every clone, every fork, every CI cache, every laptop, and no amount of "removing it in a later commit" undoes that (you must rotate the secret). Hard-coded environment-specific values (a prod DB host, `DEBUG=True`) also mean the same file cannot run in two environments, so people copy-and-edit settings files and they drift. Read every secret and every environment-specific value from `os.environ`. Local dev uses a gitignored `.env`; every deployed environment gets its variables from the platform.',
        whyHi: 'Ek repo mein committed ek secret sthाyi roop se compromised hai — ye har clone, har fork, har CI cache par git history mein hai, aur kitna bhi "ise ek baad ke commit mein hataना" use undo nahi karta (aapko secret rotate karna hoga). Hard-coded environment-specific values ka matlab wahi file do environments mein nahi chal sakti. Har secret aur har environment-specific value ko `os.environ` se padhो.',
      },
      {
        wrong: `DEBUG = os.environ.get("DEBUG", "True")       # a string; also defaults to "True"
# ...later...
if DEBUG:                                     # "False" is a truthy string -> ALWAYS True
    ...
# production sets DEBUG=False and still runs with DEBUG on`,
        right: `env = environ.Env(DEBUG=(bool, False))
DEBUG = env("DEBUG")                          # "false"/"0"/"no" -> the bool False; default False
# or without django-environ:
DEBUG = os.environ.get("DEBUG", "False").lower() in ("1", "true", "yes")`,
        why: 'Environment variables are always strings. `os.environ.get("DEBUG", "True")` gives you the string `"False"` when production sets `DEBUG=False`, and `bool("False")` is `True` because any non-empty string is truthy. So the guard `if DEBUG:` passes and production runs with debug mode on — leaking settings and tracebacks. You must parse the string to a real boolean: `django-environ`\'s `env("DEBUG")` with a `(bool, ...)` declaration does it, or do it by hand against a set of true-ish tokens. And default `DEBUG` to `False`, never `True` — a missing variable should fail safe.',
        whyHi: 'Environment variables hamesha strings hain. `os.environ.get("DEBUG", "True")` aapको string `"False"` deta hai jab production `DEBUG=False` set karta hai, aur `bool("False")` `True` hai kyunki koi bhi non-empty string truthy hai. Toh guard `if DEBUG:` pass hota hai aur production debug mode on ke saath chalta hai. Aapko string ko ek real boolean mein parse karna hi hoga. Aur `DEBUG` ko `False` default karo, kabhi `True` nahi.',
      },
      {
        wrong: `# committed to the repo so "the team has it":
#   .env    with the real staging DATABASE_URL, SECRET_KEY, and STRIPE_SECRET_KEY
# .gitignore does NOT list .env`,
        right: `# .gitignore
.env
.env.*
!.env.example

# .env.example (committed -- a template, dummy values, every key present)
SECRET_KEY=generate-a-real-one
DEBUG=True
DATABASE_URL=postgres://dev:dev@localhost:5432/myapp
STRIPE_SECRET_KEY=sk_test_xxx
# real .env values are shared out-of-band (a password manager / secrets tool), never committed`,
        why: 'Committing a real `.env` "so everyone has the values" puts staging and production secrets into git history — the exact thing environment config exists to prevent. What you commit is `.env.example`: the complete list of keys with placeholder values, so a new developer knows precisely what to configure. The real values are distributed through a secrets manager, a password manager vault, or the deployment platform — anything but the repo. And `.gitignore` must list `.env` (and usually `.env.*`) with an explicit `!.env.example` exception.',
        whyHi: 'Ek real `.env` commit karna "taaki sabke paas values hon" staging aur production secrets ko git history mein daalता hai — theek wo cheez jise environment config rokने ke liye maujood hai. Aap `.env.example` commit karte ho: placeholder values ke saath keys ki poori list. Real values ek secrets manager ya deployment platform ke zariye distribute hoती hain. Aur `.gitignore` mein `.env` hona chahिए ek explicit `!.env.example` exception ke saath.',
      },
    ],

    realWorld: [
      {
        en: '**A single `settings.py` reading everything from `django-environ`** — `SECRET_KEY`, `DEBUG` (default `False`), `ALLOWED_HOSTS` (list), `DATABASES={"default": env.db()}`, `CACHES`, `EMAIL_URL`, `SENTRY_DSN`, `ENVIRONMENT` — with a gitignored `.env` for local, a committed `.env.example`, and `check --deploy` failing CI on any warning.',
        hi: '**Ek single `settings.py` jo sab kuch `django-environ` se padhता hai** — `SECRET_KEY`, `DEBUG` (default `False`), `ALLOWED_HOSTS`, `DATABASES={"default": env.db()}`, `CACHES`, `SENTRY_DSN` — ek gitignored `.env` local ke liye, ek committed `.env.example`, aur `check --deploy` jo CI fail karta hai.',
      },
      {
        en: '**Platform-injected env vars** — an ECS task definition / Kubernetes `Secret` / systemd `EnvironmentFile` supplies `DATABASE_URL`, `SECRET_KEY`, provider keys at container start; the image itself contains no secrets, so the same image tag runs in staging and prod with only the injected config differing.',
        hi: '**Platform-injected env vars** — ek ECS task definition / Kubernetes `Secret` / systemd `EnvironmentFile` container start par `DATABASE_URL`, `SECRET_KEY` supply karta hai; image mein koi secrets nahi, toh wahi image tag staging aur prod mein chalta hai.',
      },
      {
        en: '**A `settings/` package (`base`/`local`/`production`/`test`)** where `base.py` still reads all secrets/URLs from `env(...)` — the per-file split only decides non-secret defaults (which apps, which email backend, `SECURE_*` on or off), never hard-codes a prod value.',
        hi: '**Ek `settings/` package (`base`/`local`/`production`/`test`)** jahaan `base.py` abhi bhi saare secrets/URLs `env(...)` se padhता hai — prati-file split sirf non-secret defaults decide karta hai, kabhi ek prod value hard-code nahi karta.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the 12-factor rule for configuration, and how do you apply it to a Django `settings.py`?',
        qHi: 'Configuration ke liye 12-factor niyam kya hai, aur aap ise ek Django `settings.py` par kaise apply karte ho?',
        a: 'The rule is that configuration — everything that varies between deploys of the same code — lives in the environment, not in the code and not in a config file baked into the build. The same artifact should run unchanged on a laptop, in CI, in staging, and in production, with only environment variables differing. The immediate benefits are that you can promote the exact image that passed CI straight to production, and that secrets never enter the repository. Applying it to settings.py: you identify what is config versus what is code. Config is SECRET_KEY, DEBUG, ALLOWED_HOSTS, the database URL, the cache URL, email and third-party provider keys, the Sentry DSN, and the environment name itself — anything two environments need different values for. Code is INSTALLED_APPS, MIDDLEWARE, TEMPLATES, the password validators, URL routing — structural and the same everywhere. Then every config value is read from os.environ, typically through django-environ for typed access: env of SECRET_KEY with no default so a missing value raises at startup rather than booting misconfigured; env of DEBUG declared as a bool with default False; env dot db of DATABASE_URL which parses a single postgres URL into the full DATABASES dict. Local development uses a dot env file loaded by read_env, which is gitignored and never deployed, alongside a committed dot env dot example that documents every key. Deployed environments get their variables from the platform — a task definition, a Kubernetes secret, a systemd environment file. And you run manage.py check --deploy in CI, failing on warnings, to catch DEBUG left on, a weak secret key, empty ALLOWED_HOSTS, or missing SECURE settings.',
        aHi: 'Niyam ye hai ki configuration — sab kuch jo usi code ke deploys ke beech vary karta hai — environment mein rehta hai, code mein nahi aur build mein baked ek config file mein nahi. Wahi artifact ek laptop par, CI mein, staging mein, aur production mein unchanged chalna chahिए, sirf environment variables alag hone ke saath. Fayde ye hain ki aap wo exact image jo CI paas kiya seedhe production par promote kar sakte ho, aur secrets kabhi repository mein nahi aate. Settings.py par ise apply karne ke liye: aap pehchante ho kya config hai bनाम kya code hai. Config SECRET_KEY, DEBUG, ALLOWED_HOSTS, database URL, cache URL, provider keys, Sentry DSN hai. Code INSTALLED_APPS, MIDDLEWARE, TEMPLATES hai. Phir har config value os.environ se padhi jaati hai, aksar django-environ ke zariye: SECRET_KEY bina default ke taaki ek missing value startup par raise kare; DEBUG ek bool ke roop mein default False ke saath; DATABASE_URL ka env dot db jo ek single postgres URL ko poore DATABASES dict mein parse karta hai. Local development ek dot env file istemal karta hai jo gitignored hai. Deployed environments apne variables platform se paate hain. Aur aap CI mein check --deploy chalate ho.',
      },
      {
        q: 'Why is `DEBUG = os.environ.get("DEBUG", "False")` a bug, and why should a required setting have no default?',
        qHi: '`DEBUG = os.environ.get("DEBUG", "False")` ek bug kyun hai, aur ek required setting ka koi default kyun nahi hona chahिए?',
        a: 'Environment variables are always strings. So os.environ.get of DEBUG returns the string "False" — the literal five characters — not the boolean False. And in Python every non-empty string is truthy, so bool of "False" is True. Any code that then does if DEBUG or uses DEBUG in a conditional treats it as on. The result is that an operator sets DEBUG=False in production, believes debug mode is off, and the app runs with it on: an unhandled exception renders a page with the full traceback, local variables, and the settings module — potentially including secrets — to whoever triggered the error. The fix is to parse the string into a real boolean, either with django-environ by declaring DEBUG as a bool type, which understands "false", "0", "no", "off" as False, or by hand by lower-casing and checking membership in a set of true tokens. Separately, DEBUG should default to False, never True, so that a missing or misspelled variable fails safe rather than exposing the app. As for required settings having no default: if SECRET_KEY or DATABASE_URL is missing, you want the application to refuse to start, loudly, with an ImproperlyConfigured error naming the variable. The alternative — a default like an empty string or a placeholder — lets the app boot and then fail later in a confusing way: an empty database password produces an authentication error three layers deep, an empty secret key silently weakens signing. Failing at startup, before serving a single request, is the behaviour you want for anything the app genuinely cannot run correctly without.',
        aHi: 'Environment variables hamesha strings hain. Toh os.environ.get of DEBUG string "False" lautata hai — literal paanch characters — boolean False nahi. Aur Python mein har non-empty string truthy hai, toh bool of "False" True hai. Koi bhi code jo phir if DEBUG karta hai ise on maanता hai. Parinam ye hai ki ek operator production mein DEBUG=False set karta hai, maanता hai debug mode off hai, aur app ise on ke saath chalata hai: ek unhandled exception ek page render karta hai poore traceback, local variables, aur settings module ke saath. Fix string ko ek real boolean mein parse karna hai, ya django-environ se DEBUG ko ek bool type declare karke, ya haath se. Alag se, DEBUG ko False default karna chahिए, kabhi True nahi. Required settings ke bina default ke: agar SECRET_KEY ya DATABASE_URL missing hai, aap chahte ho application start hone se mana kare, loudly, ek ImproperlyConfigured error ke saath. Vikalp — ek empty string jaise ek default — app ko boot hone deta hai aur phir baad mein ek confusing tareeke se fail hone deta hai.',
      },
    ],

    exercises: [
      {
        task: 'Using `django-environ`: set `os.environ` to `{"SECRET_KEY": "s"*50, "DEBUG": "false", "ALLOWED_HOSTS": "api.example.com,example.com", "DATABASE_URL": "postgres://appuser:pw@db.internal:5432/appdb", "CACHE_URL": "redis://cache.internal:6379/1"}`. Build `env = environ.Env(DEBUG=(bool, False))`. Assert: `env("DEBUG") is False` (a real bool, not `"false"`); `env.list("ALLOWED_HOSTS") == ["api.example.com", "example.com"]`; `env.int("CONN_MAX_AGE", default=60) == 60`; `env.db("DATABASE_URL")["ENGINE"] == "django.db.backends.postgresql"` and `["NAME"] == "appdb"` and `["USER"] == "appuser"`; and that `env("STRIPE_SECRET_KEY")` (no default) raises `environ.ImproperlyConfigured`.',
        taskHi: '`django-environ` istemal karke: `os.environ` set karo. `env = environ.Env(DEBUG=(bool, False))`. Assert: `env("DEBUG") is False` (real bool); `env.list("ALLOWED_HOSTS")`; `env.int("CONN_MAX_AGE", default=60) == 60`; `env.db("DATABASE_URL")` ka `ENGINE`/`NAME`/`USER`; aur `env("STRIPE_SECRET_KEY")` `ImproperlyConfigured` raise karta hai.',
        hint: '`import environ`. `env.db(url)` parses a database URL into the `DATABASES["default"]` dict. `env("X")` with no default raises `environ.ImproperlyConfigured` when the var is unset — the "fail loudly" behaviour.',
        hintHi: '`import environ`. `env.db(url)` ek database URL ko `DATABASES["default"]` dict mein parse karta hai. `env("X")` bina default ke `environ.ImproperlyConfigured` raise karta hai.',
      },
      {
        task: 'Write a temp `.env` file containing `SECRET_KEY=local-dev`, `DEBUG=True`, `DATABASE_URL=sqlite:///db.sqlite3`, `ALLOWED_HOSTS=localhost,127.0.0.1` (with a comment line and a blank line). Assert `os.environ.get("DATABASE_URL")` is `None` before. Call `environ.Env.read_env(path)`. Then `env = environ.Env(DEBUG=(bool, False))` and assert `env("DEBUG") is True`, `env.db()["ENGINE"]` ends with `"sqlite3"`, `env.list("ALLOWED_HOSTS") == ["localhost", "127.0.0.1"]`. Finally set `os.environ["DEBUG"] = "False"` directly and assert a fresh `environ.Env(DEBUG=(bool, False))("DEBUG") is False` — proving a real env var overrides the `.env` file.',
        taskHi: 'Ek temp `.env` file likho (`SECRET_KEY`, `DEBUG=True`, `DATABASE_URL=sqlite:///...`, `ALLOWED_HOSTS`, ek comment + blank line ke saath). Assert `os.environ.get("DATABASE_URL")` pehle `None`. `environ.Env.read_env(path)`. Phir assert `env("DEBUG") is True`, `env.db()["ENGINE"]` `"sqlite3"` par khatam, `ALLOWED_HOSTS` list. Aakhir `os.environ["DEBUG"] = "False"` set karo aur assert ek fresh env ka `("DEBUG") is False`.',
        hint: '`environ.Env.read_env(path)` populates `os.environ` from the file but does NOT overwrite variables already set — so a platform-set `DEBUG` wins over the `.env` line. This is why `.env` is safe for local only.',
        hintHi: '`environ.Env.read_env(path)` file se `os.environ` populate karta hai par pehle se set variables ko overwrite NAHI karta.',
      },
      {
        task: 'Build a temp `settings/` package: `base.py` (`SECRET_KEY = os.environ.get("SECRET_KEY", "unset")`, `INSTALLED_APPS = [...]`, `MIDDLEWARE = ["...SecurityMiddleware"]`, `DEBUG = False`, `EMAIL_BACKEND = "...smtp..."`); `local.py` (`from .base import *`, `DEBUG = True`, `INSTALLED_APPS = INSTALLED_APPS + ["debug_toolbar"]`, `EMAIL_BACKEND = "...console..."`); `production.py` (`from .base import *`, `MIDDLEWARE = MIDDLEWARE + ["whitenoise.middleware.WhiteNoiseMiddleware"]`, `SECURE_SSL_REDIRECT = True`). Set `os.environ["SECRET_KEY"] = "x"*50`, `sys.path` to the temp dir, and `importlib.import_module` both. Assert: `local.DEBUG is True` and `"debug_toolbar" in local.INSTALLED_APPS`; `production.DEBUG is False` and a whitenoise middleware is present and `debug_toolbar` is NOT; both have `SECRET_KEY == "x"*50`.',
        taskHi: 'Ek temp `settings/` package banao: `base.py` + `local.py` (`from .base import *`, `DEBUG = True`, `+ ["debug_toolbar"]`) + `production.py` (`+ whitenoise middleware`, `SECURE_SSL_REDIRECT`). `os.environ["SECRET_KEY"]` set karo, `importlib.import_module` dono. Assert: `local.DEBUG is True` + debug_toolbar; `production.DEBUG is False` + whitenoise, no debug_toolbar; dono `SECRET_KEY == "x"*50`.',
        hint: '`from .base import *` copies `base`\'s module-level names; each override file then reassigns a few. `INSTALLED_APPS = INSTALLED_APPS + [...]` extends the imported list. Both files still read `SECRET_KEY` from the env via `base`.',
        hintHi: '`from .base import *` `base` ke module-level names copy karta hai; har override file phir kuch reassign karta hai. `INSTALLED_APPS = INSTALLED_APPS + [...]` imported list extend karta hai.',
      },
    ],

    keyTakeaways: [
      '12-FACTOR CONFIG: the same build artifact runs in every environment; everything that differs (DB URL, secret key, `DEBUG`, email backend) comes from ENVIRONMENT VARIABLES, never from code, never from a file in the image. Payoff: promote the CI-passed image straight to prod + secrets never in the repo.',
      'CONFIG (from env): `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DATABASE_URL`, `REDIS_URL`, provider keys, Sentry DSN, `ENVIRONMENT`. CODE (in settings.py): `INSTALLED_APPS`, `MIDDLEWARE`, `TEMPLATES`, validators, routing. Test: if two envs need different values, it\'s config.',
      '`django-environ`: `env("X")` (required — missing raises `ImproperlyConfigured` at boot, which you WANT), `env("X", default=)`, `env.bool/int/list/json`, `env.db("DATABASE_URL")` (one URL -> the whole `DATABASES["default"]` dict), `env.cache`, `env.email`.',
      'Env vars are ALWAYS STRINGS. `os.environ.get("DEBUG", "False")` gives the string `"False"` which is TRUTHY -> `if DEBUG:` passes in prod. Parse to a real bool (`env` with `(bool, ...)`, or `.lower() in {"1","true","yes"}`). Default `DEBUG` to `False`, never `True`.',
      'A required setting has NO DEFAULT -> the app refuses to boot misconfigured (loud `ImproperlyConfigured`) instead of running with an empty password / weak key and failing mysteriously later.',
      '`.env` = LOCAL DEV ONLY: `KEY=value` lines loaded by `env.read_env()`, in `.gitignore`, NEVER deployed. Commit `.env.example` (every key, dummy values). Deployed envs get vars from the platform (task def / k8s Secret / systemd). A real env var OVERRIDES the `.env` file.',
      'Layout: (A) one `settings.py` reading all from `env()` — simplest; or (B) a `settings/` package (`base` + `local`/`production`/`test` doing `from .base import *` + override) selected by `DJANGO_SETTINGS_MODULE`. Either way `base` still reads secrets from env.',
      'NON-NEGOTIABLE: `DEBUG=False` everywhere but local (a `True` error page leaks settings + traceback + locals); `SECRET_KEY` 50+ random chars from env, different per env; explicit `ALLOWED_HOSTS`; `check --deploy` in CI failing on WARNING; no secret in the repo / git log / a log line / a Sentry event / a URL.',
    ],
    keyTakeawaysHi: [
      '12-FACTOR CONFIG: wahi build artifact har environment mein chalta hai; jo bhi alag hai wo ENVIRONMENT VARIABLES se aata hai, kabhi code se nahi, kabhi image mein ek file se nahi. Payoff: CI-passed image seedhe prod par + secrets kabhi repo mein nahi.',
      'CONFIG (env se): `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DATABASE_URL`, `REDIS_URL`, provider keys, Sentry DSN. CODE (settings.py mein): `INSTALLED_APPS`, `MIDDLEWARE`, `TEMPLATES`, validators, routing. Test: agar do envs ko alag values chahिए, wo config hai.',
      '`django-environ`: `env("X")` (required — missing boot par `ImproperlyConfigured` raise), `env("X", default=)`, `env.bool/int/list/json`, `env.db("DATABASE_URL")` (ek URL -> poora `DATABASES["default"]` dict).',
      'Env vars HAMESHA STRINGS hain. `os.environ.get("DEBUG", "False")` string `"False"` deta hai jo TRUTHY hai -> `if DEBUG:` prod mein pass. Ek real bool mein parse karo. `DEBUG` ko `False` default karo, kabhi `True` nahi.',
      'Ek required setting ka KOI DEFAULT NAHI -> app misconfigured boot hone se mana karta hai (loud `ImproperlyConfigured`) ek empty password ke saath chalne aur baad mein mysteriously fail hone ke bजाy.',
      '`.env` = SIRF LOCAL DEV: `env.read_env()` dwara loaded `KEY=value` lines, `.gitignore` mein, KABHI deployed nahi. `.env.example` commit karo. Deployed envs vars platform se paate hain. Ek real env var `.env` file ko OVERRIDE karta hai.',
      'Layout: (A) ek `settings.py` sab `env()` se padhता — sabse saral; ya (B) ek `settings/` package (`base` + `local`/`production`/`test`) `DJANGO_SETTINGS_MODULE` se selected.',
      'NON-NEGOTIABLE: `DEBUG=False` local ke alawa har jagah; `SECRET_KEY` 50+ random chars env se, prati env alag; explicit `ALLOWED_HOSTS`; CI mein `check --deploy` WARNING par fail; koi secret repo / git log / log line / Sentry event / URL mein nahi.',
    ],
  },
];
