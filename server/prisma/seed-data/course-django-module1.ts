/**
 * Django Complete Course — Module 1: Foundations & the Request Lifecycle, lessons 1-3.
 *
 * Lesson 1: what Django is — batteries included, project vs app, the layout,
 *           `manage.py`, the app registry, framed for an Express/Node developer.
 * Lesson 2: settings & configuration — `settings.py` anatomy, `DEBUG`/`SECRET_KEY`/
 *           `ALLOWED_HOSTS`, split settings, env vars / `django-environ`, 12-factor.
 * Lesson 3: URLs & routing — URLconf, `path()`, converters, `include()`,
 *           namespacing, `reverse()` / `resolve()`.
 *
 * NOTE for future editors: same conventions as the Python course.
 *  - Every backtick inside simple/simpleHi/content/contentHi is `\`` (inline code
 *    inside ``` blocks included). Escape `$` before `{` in template literals as `\${`.
 *  - `examples` use `code` + `output` (single language). Keep OUTPUT ASCII-only.
 *  - Runnable Django examples boot a standalone project with
 *    `settings.configure(...)` + `django.setup()`, an in-memory sqlite DB, and
 *    `connection.schema_editor()` to create tables. Django 6.1 / DRF 3.18 /
 *    Python 3.14 are installed. Run every example with `python`.
 *  - Never put a literal `\n` inside a `textwrap.dedent('''...''')` block.
 *  - Scan for Devanagari/Cyrillic (U+0900-097F, U+0400-04FF). `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_1: CourseLesson[] = [
  {
    slug: 'dj-what-is-django-project-vs-app',
    title: 'What Django Is: Project vs App, and "Batteries Included"',
    titleHi: 'Django Kya Hai: Project vs App, Aur "Batteries Included"',
    description: 'Coming from Express, where you assemble a server from a router package, an ORM package, a validation package and a folder structure you invent yourself — and finding Django hands you all of that, already wired together, with a directory layout it expects you to follow. The trade is less freedom for far less boilerplate and a decade of security defaults you get for free.',
    descriptionHi: 'Express se aana, jahaan aap ek server ko ek router package, ek ORM package, ek validation package aur ek folder structure se jodते ho jо aap khud banाते ho — aur paana ki Django aapko wo sab deता hai, pehle se saath jodा hua, ek directory layout ke saath jise wo aapse follow karवाना chahता hai. Sौda kam aazादी hai kam boilerplate aur ek dashak ki security defaults ke liye jо aapko muft milती hain.',
    difficulty: 'EASY',
    duration: 18,
    order: 1,

    analogy: {
      en: '**Express is a box of parts; Django is a pre-fab house.** With Express you get a strong frame (the HTTP layer) and then you choose every other component yourself — which ORM, which template engine, which auth library, which validation, how to lay out folders. Two Express apps written by two teams can look nothing alike. Django is a house that arrives mostly built: the wiring (URL routing), the plumbing (the ORM and migrations), the security system (CSRF, auth, password hashing, SQL-injection-safe queries), the admin panel, sessions, caching hooks, email — all installed and connected, following one blueprint. You lose the freedom to arrange the rooms however you want; you gain the ability to move in immediately and the knowledge that the load-bearing walls are in the right place. A **project** is the house — one deployable site with its settings and URL map. An **app** is a room with a purpose — "billing", "accounts", "blog" — a self-contained folder of models, views and URLs that you can, in principle, unplug and reuse in another house.',
      hi: '**Express parts ka ek dabba hai; Django ek pre-fab ghar hai.** Express ke saath aapko ek majboot frame milता hai (HTTP layer) aur phir aap har doosra component khud chunते ho — kaunsा ORM, kaunsा template engine, kaunsी auth library. Do teams dwara likhे do Express apps bilkul alag dikh sakte hain. Django ek ghar hai jо zyादातर banा hua aata hai: wiring (URL routing), plumbing (ORM aur migrations), security system (CSRF, auth, password hashing, SQL-injection-safe queries), admin panel, sessions — sab installed aur juda hua, ek blueprint follow karते hue. Aap kamron ko jaise chahें arrange karne ki aazादी khोte ho; aap turant move in karne ki aur ye jaanne ki kshमता paate ho ki load-bearing deewarें sahi jagah hain. Ek **project** ghar hai. Ek **app** ek uddेshya ke saath ek kamra hai — "billing", "accounts", "blog".',
    },

    simple: `**Two commands scaffold everything**

\`\`\`bash
pip install django

django-admin startproject config .     # creates the PROJECT (settings, root urls, wsgi/asgi)
python manage.py startapp blog          # creates an APP (models, views, admin, migrations/)
\`\`\`

\`\`\`
mysite/
  manage.py            # the CLI entry point -- every command goes through this
  config/              # the PROJECT package
    settings.py        # ALL configuration: db, installed apps, middleware, secret key
    urls.py            # the root URL map
    wsgi.py / asgi.py  # the server entry points (Gunicorn imports wsgi:application)
  blog/                # an APP
    models.py          # database tables as Python classes
    views.py           # request -> response functions/classes
    admin.py           # register models for the auto-generated admin UI
    apps.py            # app config
    migrations/        # generated schema-change files
  accounts/            # another APP
\`\`\`

**Register the app so Django sees it**

\`\`\`python
# config/settings.py
INSTALLED_APPS = [
    "django.contrib.admin",         # the admin site
    "django.contrib.auth",          # users, groups, permissions
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "blog",                         # <-- your app
    "accounts",
]
\`\`\`

**What comes in the box (vs Express, where each is a separate npm install)**

\`\`\`
Django (built in)                     Express equivalent (you pick + wire)
--------------------------------      ------------------------------------
ORM + migrations                      Prisma / TypeORM / Knex + a migration tool
URL router                            express.Router
templating                            EJS / Pug / Handlebars
forms + validation                    zod / joi + custom
auth (users, sessions, permissions)   passport + bcrypt + custom
admin CRUD UI                         (build it yourself)
CSRF / clickjacking / XSS defaults    helmet + csurf + config
password hashing (PBKDF2/Argon2)      bcrypt + rules
cache framework, email, signals       node-cache / nodemailer / EventEmitter
\`\`\`

\`\`\`
PROJECT = one deployable site.   Has settings.py, root urls.py, wsgi/asgi.py. Usually ONE per repo.
APP     = one feature area.      Has models/views/urls/admin/migrations. MANY per project.
         An app should do one thing and be (loosely) reusable.

manage.py <command>   -- runserver, migrate, makemigrations, shell, createsuperuser, test, ...
                         it just sets DJANGO_SETTINGS_MODULE and calls django.core.management
\`\`\``,

    simpleHi: `**Do commands sab kuch scaffold karते hain**

\`\`\`bash
pip install django

django-admin startproject config .     # PROJECT banाता hai (settings, root urls, wsgi/asgi)
python manage.py startapp blog          # ek APP banाता hai (models, views, admin, migrations/)
\`\`\`

\`\`\`
mysite/
  manage.py            # CLI entry point -- har command iske through jाता hai
  config/              # PROJECT package
    settings.py        # SAARI configuration: db, installed apps, middleware, secret key
    urls.py            # root URL map
    wsgi.py / asgi.py  # server entry points (Gunicorn wsgi:application import karता hai)
  blog/                # ek APP
    models.py          # database tables Python classes ki tarah
    views.py           # request -> response functions/classes
    admin.py           # auto-generated admin UI ke liye models register karो
    migrations/        # generated schema-change files
\`\`\`

**App register karो taaki Django ise dekhे**

\`\`\`python
# config/settings.py
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "blog",                         # <-- aapki app
]
\`\`\`

**Dabbe mein kya aata hai (vs Express, jahaan har ek alag npm install hai)**

\`\`\`
Django (built in)                     Express equivalent (aap chunो + wire karो)
--------------------------------      ------------------------------------
ORM + migrations                      Prisma / TypeORM / Knex + migration tool
URL router                            express.Router
templating                            EJS / Pug / Handlebars
forms + validation                    zod / joi + custom
auth (users, sessions, permissions)   passport + bcrypt + custom
admin CRUD UI                         (khud banाओ)
CSRF / clickjacking / XSS defaults    helmet + csurf + config
password hashing (PBKDF2/Argon2)      bcrypt + rules
\`\`\`

\`\`\`
PROJECT = ek deployable site.   settings.py, root urls.py, wsgi/asgi.py. Aksar EK prati repo.
APP     = ek feature area.      models/views/urls/admin/migrations. Prati project KAI.
         Ek app ko ek cheez karni chahiye aur (dheela) reusable honi chahiye.

manage.py <command>   -- runserver, migrate, makemigrations, shell, createsuperuser, test, ...
\`\`\``,

    content: `## Django's philosophy

Django calls itself "the web framework for perfectionists with deadlines". Two ideas drive it:

1. **Batteries included.** The common needs of a database-backed website — an ORM, schema migrations, URL routing, an auth system, an admin interface, forms, sessions, caching, email, security middleware — ship in the box, tested together, with sensible defaults. You are not assembling a stack; you are configuring one.
2. **Convention over configuration (mostly).** There is an expected place for models, views, URLs, templates, static files and migrations. Follow the layout and everything wires itself up. Deviate and you fight the framework.

For an Express developer the mental shift is: Express gives you an HTTP request/response loop and gets out of the way; Django gives you an entire application skeleton and asks you to fill in the domain logic.

## Project vs app — the distinction that confuses newcomers

- A **project** is the deployable unit. It is a Python package (created by \`startproject\`) that holds \`settings.py\` (all configuration), the root \`urls.py\` (the top-level URL map), and \`wsgi.py\`/\`asgi.py\` (what a production server imports). You normally have exactly one project per repository. \`manage.py\` sits next to it and is how you run every command.
- An **app** is a feature module. It is a Python package (created by \`startapp\`) with its own \`models.py\`, \`views.py\`, \`urls.py\`, \`admin.py\`, \`apps.py\` and \`migrations/\` folder. A project is made of many apps: \`accounts\`, \`billing\`, \`catalog\`, \`orders\`. The Django docs' guideline: "an app should do one thing and do it well", and ideally be reusable across projects (\`django.contrib.auth\` is itself just an app).

A common beginner layout for a medium project:

\`\`\`
config/          # the project: settings/, urls.py, wsgi.py, asgi.py
apps/
  accounts/
  catalog/
  orders/
  common/        # shared base models, utilities, mixins
manage.py
requirements.txt
\`\`\`

## \`manage.py\` and \`django-admin\`

\`django-admin\` is the framework's CLI, installed with the package. \`manage.py\` is a thin wrapper the project generates that additionally sets the \`DJANGO_SETTINGS_MODULE\` environment variable to your project's settings, so commands run with your configuration. In practice you always use \`python manage.py <command>\`:

\`\`\`bash
python manage.py runserver          # the development server (NOT for production)
python manage.py makemigrations     # detect model changes -> write migration files
python manage.py migrate            # apply migrations to the database
python manage.py createsuperuser    # make an admin login
python manage.py shell              # a Python REPL with Django configured
python manage.py test               # run the test suite
python manage.py check              # system checks; --deploy adds production checks
python manage.py collectstatic      # gather static files for serving (deploy step)
\`\`\`

## The app registry and \`AppConfig\`

At startup Django reads \`INSTALLED_APPS\`, imports each app, and populates an **app registry** (\`django.apps.apps\`). This is why an app must be listed in \`INSTALLED_APPS\` for its models to be created, its admin to appear, its templates and static files to be found, and its management commands to be available. Each app has an \`apps.py\` with an \`AppConfig\` subclass where you can set the app's label, its default auto field, and a \`ready()\` hook (the correct place to connect signals).

\`\`\`python
# blog/apps.py
from django.apps import AppConfig

class BlogConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "blog"

    def ready(self):
        from . import signals   # noqa: register signal handlers
\`\`\`

## The two servers

\`runserver\` is a lightweight development server: it auto-reloads on file changes, serves static files, and shows rich error pages. **It is single-threaded-ish, insecure, and explicitly not for production.** In production you run a WSGI server (Gunicorn, uWSGI) or ASGI server (Uvicorn, Daphne, Hypercorn) that imports \`config.wsgi:application\` / \`config.asgi:application\`, usually behind Nginx. Module 10 covers this in full.`,

    contentHi: `## Django ka darshan

Django khud ko "deadlines waale perfectionists ke liye web framework" kehta hai. Do vichaar ise chalाते hain:

1. **Batteries included.** Ek database-backed website ki aam zarooratें — ek ORM, schema migrations, URL routing, ek auth system, ek admin interface, forms, sessions, caching, email, security middleware — dabbe mein aati hain, saath test ki gayी, समझदार defaults ke saath. Aap ek stack assemble nahi kar rahe; aap ek configure kar rahe ho.
2. **Convention over configuration (zyादातर).** Models, views, URLs, templates, static files aur migrations ke liye ek अपेक्षित jagah hai. Layout follow karो aur sab khud wire ho jाता hai.

Ek Express developer ke liye mental shift: Express aapko ek HTTP request/response loop deता hai aur raaste se hat jाता hai; Django aapko ek poora application skeleton deता hai aur aapse domain logic bharने ko kehta hai.

## Project vs app — wo antar jо newcomers ko confuse karता hai

- Ek **project** deployable unit hai. Ek Python package (\`startproject\` dwara banा) jо \`settings.py\` (saari configuration), root \`urls.py\`, aur \`wsgi.py\`/\`asgi.py\` rakhता hai. Aapke paas aamताur par prati repository bilkul ek project hoता hai.
- Ek **app** ek feature module hai. Ek Python package (\`startapp\` dwara banा) apne \`models.py\`, \`views.py\`, \`urls.py\`, \`admin.py\` aur \`migrations/\` folder ke saath. Ek project kai apps se banा hai: \`accounts\`, \`billing\`, \`catalog\`, \`orders\`.

## \`manage.py\` aur \`django-admin\`

\`django-admin\` framework ka CLI hai. \`manage.py\` ek patla wrapper hai jо project banाता hai jо atirikt roop se \`DJANGO_SETTINGS_MODULE\` environment variable set karता hai. Vyavhaar mein aap hamesha \`python manage.py <command>\` istemal karते ho:

\`\`\`bash
python manage.py runserver          # development server (production ke liye NAHI)
python manage.py makemigrations     # model changes detect karो -> migration files likhо
python manage.py migrate            # migrations database par lागू karो
python manage.py createsuperuser    # ek admin login banाओ
python manage.py shell              # Django configured ke saath ek Python REPL
python manage.py check --deploy     # production checks
\`\`\`

## App registry aur \`AppConfig\`

Startup par Django \`INSTALLED_APPS\` padhता hai, har app import karता hai, aur ek **app registry** bharता hai. Isiliye ek app ko \`INSTALLED_APPS\` mein listed hona chahiye taaki iske models banें, iska admin dikhe, iske templates mile. Har app ke paas ek \`apps.py\` ek \`AppConfig\` subclass ke saath hai jahaan aap app ka label, default auto field, aur ek \`ready()\` hook (signals connect karne ki sahi jagah) set kar sakte ho.

\`\`\`python
# blog/apps.py
from django.apps import AppConfig

class BlogConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "blog"

    def ready(self):
        from . import signals   # noqa
\`\`\`

## Do servers

\`runserver\` ek halka development server hai: file changes par auto-reload, static files serve, rich error pages. **Ye insecure hai aur spasht roop se production ke liye nahi.** Production mein aap ek WSGI server (Gunicorn, uWSGI) ya ASGI server (Uvicorn, Daphne) chalाते ho jо \`config.wsgi:application\` import karता hai, aksar Nginx ke peeche. Module 10 ise poori tarah cover karता hai.`,

    examples: [
      {
        title: 'Booting Django without a project: settings.configure()',
        titleHi: 'Bina ek project ke Django boot karna: settings.configure()',
        code: `import django
from django.conf import settings

# a full "project" configured inline -- what settings.py normally holds
settings.configure(
    DEBUG=True,
    SECRET_KEY="dev-only-not-secret",
    INSTALLED_APPS=[
        "django.contrib.contenttypes",
        "django.contrib.auth",
    ],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField",
    USE_TZ=True,
)
django.setup()   # builds the app registry -- must run before importing models

from django.apps import apps

print("django version:", django.get_version())
print("apps installed:", [a.label for a in apps.get_app_configs()])
print("auth app has models:", [m.__name__ for m in apps.get_app_config("auth").get_models()][:3])
print("settings.DEBUG:", settings.DEBUG)`,
        output: `django version: 6.1
apps installed: ['contenttypes', 'auth']
auth app has models: ['Permission', 'Group', 'User']
settings.DEBUG: True`,
        explain: 'A real project keeps this configuration in `config/settings.py` and Django loads it via the `DJANGO_SETTINGS_MODULE` env var that `manage.py` sets. `settings.configure()` does the same thing inline — useful for scripts and for these lessons. `django.setup()` then reads `INSTALLED_APPS`, imports each app, and builds the **app registry**, which is why `apps.get_app_config("auth")` can list the `User`, `Group` and `Permission` models that `django.contrib.auth` ships. Nothing works before `django.setup()`.',
        explainHi: 'Ek asli project is configuration ko `config/settings.py` mein rakhता hai aur Django ise `DJANGO_SETTINGS_MODULE` env var ke zariye load karता hai jо `manage.py` set karता hai. `settings.configure()` wahi cheez inline karता hai — scripts aur in lessons ke liye useful. `django.setup()` phir `INSTALLED_APPS` padhता hai, har app import karता hai, aur **app registry** banाता hai, isiliye `apps.get_app_config("auth")` `User`, `Group` aur `Permission` models list kar sakta hai. `django.setup()` se pehle kuch kaam nahi karता.',
      },
      {
        title: 'An app is just a package with models; the registry finds them',
        titleHi: 'Ek app bस models waala ek package hai; registry unhe dhoondhता hai',
        code: `import django
from django.conf import settings
settings.configure(
    DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
)
django.setup()

from django.db import models, connection

# this module ("__main__") acts as an app; these are its "models.py"
class Category(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Product(models.Model):
    name = models.CharField(max_length=100)
    price_cents = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    class Meta:
        app_label = "__main__"

# "migrate" would do this; here we create the tables directly
with connection.schema_editor() as schema:
    schema.create_model(Category)
    schema.create_model(Product)

books = Category.objects.create(name="Books")
Product.objects.create(name="Django in Depth", price_cents=3900, category=books)
Product.objects.create(name="SQL Basics", price_cents=2500, category=books)

print("categories:", Category.objects.count())
print("products in Books:", books.products.count())
print("cheapest:", Product.objects.order_by("price_cents").first().name)`,
        output: `categories: 1
products in Books: 2
cheapest: SQL Basics`,
        explain: 'Listing `"__main__"` in `INSTALLED_APPS` makes this script behave like an app, so its `models.Model` subclasses are registered and get database tables. In a real project the app is a folder (`catalog/`), the models live in `catalog/models.py`, `app_label` is inferred, and `python manage.py makemigrations && migrate` creates the tables instead of `schema_editor`. Everything else — `.objects.create()`, `.count()`, the `related_name` reverse accessor `books.products` — is exactly what you write in production.',
        explainHi: '`INSTALLED_APPS` mein `"__main__"` list karna is script ko ek app ki tarah bartaव karवाता hai, toh iske `models.Model` subclasses register hote hain aur database tables paate hain. Ek asli project mein app ek folder hai (`catalog/`), models `catalog/models.py` mein rehते hain, `app_label` infer hoता hai, aur `python manage.py makemigrations && migrate` tables banाता hai. Baaki sab — `.objects.create()`, `.count()`, `related_name` reverse accessor `books.products` — bilkul wahi hai jо aap production mein likhते ho.',
      },
      {
        title: 'What manage.py commands actually do: call_command',
        titleHi: 'manage.py commands asal mein kya karते hain: call_command',
        code: `import django
from django.conf import settings
settings.configure(
    DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=[
        "django.contrib.contenttypes", "django.contrib.auth", "django.contrib.sessions",
    ],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
)
django.setup()

from django.core.management import call_command, get_commands
import io

# manage.py <cmd> is just this under the hood:
buf = io.StringIO()
call_command("migrate", "--run-syncdb", verbosity=0)
call_command("check", stdout=buf)
print("check:", buf.getvalue().strip())

from django.contrib.auth.models import User
User.objects.create_superuser("admin", "admin@example.com", "pw12345")
print("users:", User.objects.count())
print("is superuser:", User.objects.get(username="admin").is_superuser)

# management commands are just a registry of callables:
cmds = get_commands()
print("migrate is registered:", "migrate" in cmds)
print("migrate provided by a 'django.core' app:", "django.core" in cmds["migrate"])
print("many commands ship in the box:", len(cmds) > 15)`,
        output: `check: System check identified no issues (0 silenced).
users: 1
is superuser: True
migrate is registered: True
migrate provided by a 'django.core' app: True
many commands ship in the box: True`,
        explain: '`python manage.py migrate` is a thin shell around `call_command("migrate")`; the whole management-command system is just discoverable Python callables held in the `get_commands()` registry (name -> providing app). Here `migrate --run-syncdb` builds the auth/session tables, `check` runs the system checks (the same ones CI should run), and `create_superuser` does programmatically what the interactive `createsuperuser` prompt does. Every app can add its own commands under a `management/commands/` folder — covered in lesson 6.',
        explainHi: '`python manage.py migrate` `call_command("migrate")` ke aas-paas ek patla shell hai; poora management-command system bस discoverable Python callables hai jо `get_commands()` registry mein rakhे hain (naam -> providing app). Yahaan `migrate --run-syncdb` auth/session tables banाता hai, `check` system checks chalाता hai, aur `create_superuser` programmatically wo karता hai jо interactive `createsuperuser` prompt karता hai. Har app apne commands `management/commands/` folder ke tahat jod sakti hai — lesson 6 mein.',
      },
    ],

    mistakes: [
      {
        wrong: `# putting every model, view and URL in the project package
config/
  settings.py
  urls.py
  models.py        # <-- all 40 models here
  views.py         # <-- all views here
  wsgi.py`,
        right: `config/            # project: config only
  settings.py
  urls.py
apps/
  accounts/        # one app per feature area
    models.py
    views.py
    urls.py
  catalog/
    models.py
    ...`,
        why: 'The project package is for configuration, not domain code. Cramming all models and views into it produces one unnavigable module, circular-import headaches, and migrations that touch everything at once. Split by feature into apps: each app owns its models, views, URLs, admin and migrations, and can be understood, tested and (sometimes) reused in isolation.',
        whyHi: 'Project package configuration ke liye hai, domain code ke liye nahi. Saare models aur views ise mein bharना ek navigate na hone yogya module, circular-import sirdard, aur migrations jо ek saath sab kuch chhoote hain deता hai. Feature se apps mein baanto: har app apne models, views, URLs, admin aur migrations own karती hai.',
      },
      {
        wrong: `# blog/apps.py -- connecting signals at import time
from django.db.models.signals import post_save
from .models import Post

post_save.connect(notify_subscribers, sender=Post)   # runs during import -> AppRegistryNotReady`,
        right: `# blog/apps.py
class BlogConfig(AppConfig):
    name = "blog"
    def ready(self):
        from . import signals        # import here -> models are loaded, registry is ready`,
        why: 'Code at the top level of an app module runs while Django is still building the app registry, so importing models or connecting signals there raises `AppRegistryNotReady` or causes subtle import-order bugs. `AppConfig.ready()` is the one hook that fires *after* every app and model is loaded — it is the correct place for signal registration and other startup wiring.',
        whyHi: 'Ek app module ke top level par code tab chalता hai jab Django abhi bhi app registry banा raha hai, toh wahaan models import karna ya signals connect karna `AppRegistryNotReady` raise karता hai. `AppConfig.ready()` wo ek hook hai jо har app aur model load hone ke *baad* fire hoता hai — ye signal registration ki sahi jagah hai.',
      },
      {
        wrong: `# deploying with the dev server
python manage.py runserver 0.0.0.0:8000    # in production`,
        right: `# production: a WSGI/ASGI server importing the project's application object
gunicorn config.wsgi:application --workers 4 --bind 0.0.0.0:8000
# (behind Nginx, with DEBUG=False, real ALLOWED_HOSTS, collected static files)`,
        why: '`runserver` is a development convenience: single-process, auto-reloading, serving static files itself, with verbose debug pages that leak stack traces and settings. It is not built for concurrency, hardening, or load. Production uses Gunicorn/uWSGI (WSGI) or Uvicorn/Daphne (ASGI) importing `config.wsgi:application`, typically behind Nginx as a reverse proxy and static-file server.',
        whyHi: '`runserver` ek development suvidha hai: single-process, auto-reloading, khud static files serve karता, verbose debug pages ke saath jо stack traces aur settings leak karती hain. Ye concurrency ya load ke liye nahi banा. Production Gunicorn/uWSGI (WSGI) ya Uvicorn/Daphne (ASGI) istemal karता hai jо `config.wsgi:application` import karता hai, aamताur par Nginx ke peeche.',
      },
    ],

    realWorld: [
      {
        en: '**Every Django codebase you join has an `apps/` (or top-level) folder of feature apps** — `accounts`, `billing`, `api`, `core`/`common` for shared base classes. Reading a new codebase starts with `INSTALLED_APPS` in settings (what exists) and the root `urls.py` (how requests enter). The inherited Core-API backend follows this shape.',
        hi: '**Har Django codebase jismें aap join karते ho uska ek `apps/` folder hoता hai** — `accounts`, `billing`, `api`, `core`/`common` shared base classes ke liye. Ek naya codebase padhна `INSTALLED_APPS` (kya maujूd hai) aur root `urls.py` (requests kaise enter karते hain) se shuru hoता hai.',
      },
      {
        en: '**`python manage.py check --deploy` is a CI gate on real projects** — it flags an insecure `SECRET_KEY`, `DEBUG=True`, missing `SECURE_*` settings, a permissive `ALLOWED_HOSTS`, and more. Teams also add `makemigrations --check --dry-run` to CI so a model change without a migration fails the build.',
        hi: '**`python manage.py check --deploy` asli projects par ek CI gate hai** — ye ek insecure `SECRET_KEY`, `DEBUG=True`, missing `SECURE_*` settings, ek permissive `ALLOWED_HOSTS` flag karता hai. Teams `makemigrations --check --dry-run` bhi CI mein jodते hain.',
      },
      {
        en: '**`django.contrib.*` apps are the framework dogfooding its own app system** — `auth`, `admin`, `sessions`, `contenttypes`, `messages`, `staticfiles` are all just apps in `INSTALLED_APPS`. Third-party packages (`rest_framework`, `django_filters`, `corsheaders`, `django_celery_beat`) are added the same way: `pip install`, then add to `INSTALLED_APPS`.',
        hi: '**`django.contrib.*` apps framework ka apna app system dogfood karna hai** — `auth`, `admin`, `sessions`, `contenttypes`, `messages`, `staticfiles` sab bस `INSTALLED_APPS` mein apps hain. Third-party packages (`rest_framework`, `django_filters`, `corsheaders`) usi tarah jode jaते hain: `pip install`, phir `INSTALLED_APPS` mein add.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a Django project and a Django app?',
        qHi: 'Ek Django project aur ek Django app mein kya antar hai?',
        a: 'A project is the deployable unit — the thing you actually run and ship. It is a Python package created by django-admin startproject, and it holds the configuration: settings dot py with the database connection, installed apps, middleware, secret key and everything else; the root urls dot py that is the top-level URL map; and wsgi dot py and asgi dot py, which are the entry points a production server imports. You normally have exactly one project per repository, and manage dot py sits alongside it as the command-line entry point. An app is a feature module within that project. It is also a Python package, created by manage dot py startapp, and it contains the domain code for one area of functionality: models dot py for the database tables, views dot py for request handling, its own urls dot py, admin dot py, apps dot py with the AppConfig, and a migrations folder. A real project is composed of many apps — accounts, billing, catalog, orders, plus a common or core app for shared base classes. The Django guideline is that an app should do one thing well and, ideally, be reusable across projects; django dot contrib dot auth and the admin are themselves just apps. The practical rule: the project is for configuration and wiring, apps are for domain logic, and an app only becomes active once it is listed in INSTALLED_APPS, which is what makes Django import it, register its models, discover its templates and static files and management commands, and include it in migrations.',
        aHi: 'Ek project deployable unit hai — wo cheez jise aap asal mein chalाते aur ship karते ho. Ye ek Python package hai jо django-admin startproject dwara banा, aur ye configuration rakhता hai: settings dot py database connection, installed apps, middleware, secret key ke saath; root urls dot py jо top-level URL map hai; aur wsgi dot py aur asgi dot py, jо entry points hain jinhe ek production server import karता hai. Aapke paas aamताur par prati repository bilkul ek project hoता hai. Ek app us project ke andar ek feature module hai. Ye bhi ek Python package hai, manage dot py startapp dwara banा, aur ismें ek functionality area ke liye domain code hoता hai: models dot py, views dot py, apna urls dot py, admin dot py, aur ek migrations folder. Ek asli project kai apps se banा hai. Django guideline ye hai ki ek app ko ek cheez achhे se karni chahiye aur reusable honi chahiye. Vyavhaarik niyam: project configuration ke liye hai, apps domain logic ke liye, aur ek app tabhi active hoती hai jab wo INSTALLED_APPS mein listed ho.',
      },
      {
        q: 'What does "batteries included" mean for Django, and how does that compare to building on Express?',
        qHi: 'Django ke liye "batteries included" ka kya matlab hai, aur wo Express par banाने se kaise tulnा karता hai?',
        a: 'Batteries included means the components a database-backed web application almost always needs are shipped with the framework, tested together, and turned on by sensible defaults, rather than being separate libraries you select and integrate. Out of the box Django gives you an ORM with a schema-migration system, a URL router, a templating engine, a forms and validation layer, a full authentication system with users, groups, permissions, sessions and password hashing, an automatically generated admin CRUD interface, a caching framework, an email layer, a signals system, and security middleware that provides CSRF protection, clickjacking protection, secure-cookie handling and safe-by-default escaping in templates and parameterised queries in the ORM. With Express, the framework itself is just the HTTP request-response layer and routing; everything else is a decision. You choose an ORM or query builder like Prisma, TypeORM or Knex, and a separate migration tool; a validation library like zod or joi; an auth solution, usually Passport plus bcrypt plus a lot of custom code; a template engine if you render server-side; helmet and csurf and manual configuration for the security headers Django enables by default; and you invent your own project structure. The trade-off is real in both directions. The Django cost is that you must learn its conventions and mostly work within them, and swapping a core piece — a different ORM, say — is painful. Its benefit is that a new project or a new team member starts from a known, secure, well-documented baseline, and the pieces are guaranteed to work together. The Express cost is integration work and the risk of missing a security default; its benefit is that every layer is your choice and nothing is imposed.',
        aHi: 'Batteries included ka matlab hai ki wo components jо ek database-backed web application lगbhag hamesha chahिए framework ke saath ship hote hain, saath test kiye jaते hain, aur समझदार defaults se on hote hain, bजाय alag libraries hone ke jinhe aap select aur integrate karते ho. Dabbe se Django aapko ek ORM ek schema-migration system ke saath, ek URL router, ek templating engine, ek forms aur validation layer, ek poora authentication system users, groups, permissions, sessions aur password hashing ke saath, ek apne aap generated admin CRUD interface, ek caching framework, ek email layer, ek signals system, aur security middleware deता hai. Express ke saath, framework khud bस HTTP request-response layer aur routing hai; baaki sab ek faisla hai. Aap Prisma ya TypeORM jaisा ek ORM chunते ho; zod jaisी ek validation library; ek auth solution, aamताur par Passport plus bcrypt; aur aap apna project structure banाते ho. Sौda dono dishaओं mein asli hai. Django ki keemat ye hai ki aapko iski conventions seekhनी hain. Iska faayda ye hai ki ek naya project ek jaane-mane, surakshit baseline se shuru hoता hai.',
      },
    ],

    exercises: [
      {
        task: 'Write a standalone script that calls `settings.configure()` with `INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"]` and an in-memory sqlite DB, then `django.setup()`. Import `django.apps.apps` and print every installed app label and, for the `auth` app, the list of its model names. Confirm `User`, `Group`, `Permission` appear.',
        taskHi: 'Ek standalone script likhо jо `settings.configure()` ko `INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"]` aur ek in-memory sqlite DB ke saath call kare, phir `django.setup()`. `django.apps.apps` import karके har installed app label print karो aur `auth` app ke liye iske model names.',
        hint: '`apps.get_app_configs()` yields `AppConfig` objects with a `.label`. `apps.get_app_config("auth").get_models()` yields the model classes; use `m.__name__`. Everything must come after `django.setup()`.',
        hintHi: '`apps.get_app_configs()` `AppConfig` objects yield karता hai jinmें `.label` hai. `apps.get_app_config("auth").get_models()` model classes yield karता hai; `m.__name__` istemal karो. Sab `django.setup()` ke baad hona chahiye.',
      },
      {
        task: 'Extend the script: list `"__main__"` in `INSTALLED_APPS`, define a `Note` model (`title = CharField(max_length=100)`, `body = TextField()`, `created = DateTimeField(auto_now_add=True)`) with `Meta.app_label = "__main__"`, create its table with `connection.schema_editor()`, then create 3 notes and print the count and the most recent title.',
        taskHi: 'Script extend karो: `INSTALLED_APPS` mein `"__main__"` list karो, ek `Note` model define karो (`title`, `body`, `created`) `Meta.app_label = "__main__"` ke saath, iski table `connection.schema_editor()` se banाओ, phir 3 notes banाओ aur count aur sabse recent title print karो.',
        hint: '`with connection.schema_editor() as se: se.create_model(Note)`. `Note.objects.create(title=..., body=...)`. Most recent: `Note.objects.order_by("-created").first().title` (or `.latest("created")`).',
        hintHi: '`with connection.schema_editor() as se: se.create_model(Note)`. `Note.objects.create(title=..., body=...)`. Sabse recent: `Note.objects.order_by("-created").first().title`.',
      },
      {
        task: 'Use `call_command`: configure Django with the `contenttypes`, `auth`, `sessions`, `admin`, `messages` apps and sqlite, run `call_command("migrate", "--run-syncdb", verbosity=0)`, then `call_command("check")`. Create a superuser programmatically with `User.objects.create_superuser(...)` and assert `.is_staff` and `.is_superuser` are both `True`.',
        taskHi: '`call_command` istemal karो: Django ko `contenttypes`, `auth`, `sessions`, `admin`, `messages` apps aur sqlite ke saath configure karो, `call_command("migrate", "--run-syncdb", verbosity=0)` chalाओ, phir `call_command("check")`. Ek superuser programmatically banाओ aur assert karो `.is_staff` aur `.is_superuser` dono `True` hain.',
        hint: '`from django.core.management import call_command`. `from django.contrib.auth.models import User; u = User.objects.create_superuser("admin", "a@b.com", "pw")`. `create_superuser` sets both flags; a plain `create_user` does not.',
        hintHi: '`from django.core.management import call_command`. `from django.contrib.auth.models import User; u = User.objects.create_superuser("admin", "a@b.com", "pw")`. `create_superuser` dono flags set karता hai; ek plain `create_user` nahi.',
      },
    ],

    keyTakeaways: [
      'Django is "batteries included": ORM + migrations, URL router, templating, forms/validation, auth (users/sessions/permissions/password hashing), admin CRUD UI, caching, email, and security middleware (CSRF, clickjacking, safe queries) all ship together. Express gives you the HTTP layer; you pick and wire the rest.',
      'A PROJECT is the deployable unit (`startproject`): holds `settings.py`, root `urls.py`, `wsgi.py`/`asgi.py`. Usually ONE per repo. An APP is a feature module (`startapp`): `models.py`, `views.py`, `urls.py`, `admin.py`, `migrations/`. MANY per project.',
      'An app is only active once it is in `INSTALLED_APPS` — that is what makes Django import it, register its models, find its templates/static/commands, and include it in migrations.',
      '`manage.py <command>` is a thin wrapper that sets `DJANGO_SETTINGS_MODULE` then calls `django.core.management`. Key commands: `runserver`, `makemigrations`, `migrate`, `shell`, `createsuperuser`, `test`, `check --deploy`, `collectstatic`.',
      'At startup Django reads `INSTALLED_APPS` and builds the APP REGISTRY (`django.apps.apps`). Nothing model-related works before `django.setup()` (or before the framework has bootstrapped in a real project).',
      '`AppConfig.ready()` (in `apps.py`) is the ONLY correct place to connect signals or do startup wiring — top-level app-module code runs too early and raises `AppRegistryNotReady`.',
      '`runserver` is dev-only (single-process, auto-reload, leaks debug info). Production runs Gunicorn/uWSGI (WSGI) or Uvicorn/Daphne (ASGI) importing `config.wsgi:application`, behind Nginx.',
      'To read an unfamiliar Django codebase, start with `INSTALLED_APPS` (what exists) and the root `urls.py` (how requests enter).',
    ],
    keyTakeawaysHi: [
      'Django "batteries included" hai: ORM + migrations, URL router, templating, forms/validation, auth, admin CRUD UI, caching, email, aur security middleware sab saath ship hote hain. Express aapko HTTP layer deता hai; baaki aap chunते aur wire karते ho.',
      'Ek PROJECT deployable unit hai (`startproject`): `settings.py`, root `urls.py`, `wsgi.py`/`asgi.py` rakhता hai. Aksar EK prati repo. Ek APP ek feature module hai (`startapp`): `models.py`, `views.py`, `urls.py`, `admin.py`, `migrations/`. Prati project KAI.',
      'Ek app tabhi active hoती hai jab wo `INSTALLED_APPS` mein ho — yahi Django ko ise import karवाता hai, iske models register karवाता hai, iske templates/static/commands dhoondhवाता hai.',
      '`manage.py <command>` ek patla wrapper hai jо `DJANGO_SETTINGS_MODULE` set karता hai phir `django.core.management` call karता hai. Mukhya commands: `runserver`, `makemigrations`, `migrate`, `shell`, `createsuperuser`, `test`, `check --deploy`.',
      'Startup par Django `INSTALLED_APPS` padhता hai aur APP REGISTRY banाता hai. `django.setup()` se pehle kuch bhi model-related kaam nahi karता.',
      '`AppConfig.ready()` (`apps.py` mein) signals connect karne ki EKMAATr sahi jagah hai — top-level app-module code bahut jaldi chalता hai aur `AppRegistryNotReady` raise karता hai.',
      '`runserver` sirf dev ke liye hai. Production Gunicorn/uWSGI (WSGI) ya Uvicorn/Daphne (ASGI) chalाता hai jо `config.wsgi:application` import karता hai, Nginx ke peeche.',
      'Ek anjaan Django codebase padhने ke liye, `INSTALLED_APPS` (kya maujूd hai) aur root `urls.py` (requests kaise enter karते hain) se shuru karो.',
    ],
  },

  {
    slug: 'dj-settings-and-configuration',
    title: 'Settings & Configuration: DEBUG, SECRET_KEY, and 12-Factor',
    titleHi: 'Settings Aur Configuration: DEBUG, SECRET_KEY, Aur 12-Factor',
    description: 'One `settings.py` decides the database, the secret key, whether stack traces leak to the browser, which hosts may serve the site, and a hundred security switches. Getting it wrong is how sites get breached. The production-grade answer is split settings plus environment variables — never secrets in git.',
    descriptionHi: 'Ek `settings.py` database, secret key, kya stack traces browser mein leak hote hain, kaunse hosts site serve kar sakte hain, aur sau security switches tay karता hai. Ise galat karna aise sites breach hoती hain. Production-grade jawaab split settings plus environment variables hai — kabhi git mein secrets nahi.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**The breaker panel and the master keys of the building.** `settings.py` is the panel where every circuit is switched: which water main feeds the building (`DATABASES`), whether the front doors are unlocked (`DEBUG` — in debug mode the building hands visitors a full floor plan with every room, safe and wire labelled), which street addresses are allowed to route mail here (`ALLOWED_HOSTS`), and dozens of safety interlocks (`SECURE_*`). The `SECRET_KEY` is the master key that signs every access badge — sessions, password-reset links, signed cookies. Two rules follow. First, the panel for the show-home you tour (development) and the panel for the occupied building (production) are *different panels* — same layout, different switch positions — so you keep them as separate files, not one file with `if` statements. Second, the master key and the water-main credentials do not get photocopied into the public brochure of the building (your git repository); they are handed over at move-in time through a sealed channel (environment variables), so anyone who reads the brochure still cannot get in.',
      hi: '**Building ka breaker panel aur master keys.** `settings.py` wo panel hai jahaan har circuit switch hoता hai: kaunsा water main building ko feed karता hai (`DATABASES`), kya front doors unlocked hain (`DEBUG` — debug mode mein building visitors ko ek poora floor plan deती hai har room, safe aur wire labelled ke saath), kaunse street addresses yahaan mail route kar sakte hain (`ALLOWED_HOSTS`), aur dozens safety interlocks (`SECURE_*`). `SECRET_KEY` master key hai jо har access badge sign karता hai — sessions, password-reset links, signed cookies. Do niyam. Pehla, jо show-home aap tour karते ho (development) uska panel aur occupied building (production) ka panel *alag panels* hain — same layout, alag switch positions — toh aap unhe alag files ki tarah rakhते ho, `if` statements waali ek file nahi. Doosra, master key building ke public brochure (aapki git repository) mein photocopy nahi hoती; wo move-in par ek sealed channel (environment variables) ke zariye di jाती hai.',
    },

    simple: `**The settings that matter most**

\`\`\`python
# config/settings.py
DEBUG = False                       # True: leaks stack traces + settings on error. NEVER True in prod.
SECRET_KEY = "..."                  # signs sessions, cookies, password-reset tokens. Keep secret.
ALLOWED_HOSTS = ["example.com"]     # which Host: headers are served. [] + DEBUG=False -> refuses all.

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "mydb", "USER": "myuser", "PASSWORD": "...",
        "HOST": "db.internal", "PORT": "5432",
        "CONN_MAX_AGE": 60,         # reuse connections (perf) -- Module 7
    }
}

INSTALLED_APPS = [...]
MIDDLEWARE = [...]                  # order matters -- Module 1 lesson 5
TEMPLATES = [...]
STATIC_URL = "static/"
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_TZ = True                       # store datetimes in UTC -- always keep True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
\`\`\`

**Never do this**

\`\`\`python
SECRET_KEY = "django-insecure-hardcoded-in-git"    # in version control -> compromised
DEBUG = True                                        # in production -> full stack traces to users
ALLOWED_HOSTS = ["*"]                                # accepts any Host header -> cache poisoning risk
DATABASES = {"default": {... "PASSWORD": "hunter2"}} # password in git
\`\`\`

**Do this: environment variables**

\`\`\`python
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]                     # crash if missing -- good
DEBUG = os.environ.get("DJANGO_DEBUG", "false").lower() == "true"
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",")

# with django-environ (pip install django-environ):
import environ
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(BASE_DIR / ".env")            # .env is in .gitignore
SECRET_KEY = env("DJANGO_SECRET_KEY")
DATABASES = {"default": env.db("DATABASE_URL")}    # parses postgres://user:pw@host:5432/name
\`\`\`

**Split settings for dev vs prod**

\`\`\`
config/settings/
  __init__.py
  base.py         # everything shared
  dev.py          # from .base import *; DEBUG = True; extra apps like debug_toolbar
  prod.py         # from .base import *; DEBUG = False; SECURE_* on; real hosts
  test.py         # fast password hasher, in-memory / test db
\`\`\`

\`\`\`bash
# choose which one at runtime:
export DJANGO_SETTINGS_MODULE=config.settings.prod
python manage.py runserver --settings=config.settings.dev
\`\`\`

\`\`\`
PRODUCTION CHECKLIST (manage.py check --deploy verifies most of these)
  DEBUG = False
  SECRET_KEY from env, long + random, NOT in git, rotatable
  ALLOWED_HOSTS = your real domains (never ["*"] with DEBUG off blindly)
  SECURE_SSL_REDIRECT = True
  SECURE_HSTS_SECONDS = 31536000  (+ include-subdomains, preload)
  SESSION_COOKIE_SECURE = True    CSRF_COOKIE_SECURE = True
  SECURE_CONTENT_TYPE_NOSNIFF = True
  X_FRAME_OPTIONS = "DENY"
  database credentials from env, TLS to the DB
  DEFAULT_FROM_EMAIL, ADMINS set (error emails)
\`\`\``,

    simpleHi: `**Sabse mahatvapoorn settings**

\`\`\`python
# config/settings.py
DEBUG = False                       # True: error par stack traces + settings leak. Prod mein KABHI True nahi.
SECRET_KEY = "..."                  # sessions, cookies, password-reset tokens sign karता hai. Secret rakhо.
ALLOWED_HOSTS = ["example.com"]     # kaunse Host: headers serve hote hain. [] + DEBUG=False -> sab refuse.

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "mydb", "USER": "myuser", "PASSWORD": "...",
        "HOST": "db.internal", "PORT": "5432",
        "CONN_MAX_AGE": 60,         # connections reuse karो (perf) -- Module 7
    }
}

USE_TZ = True                       # datetimes UTC mein store karो -- hamesha True rakhो
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
\`\`\`

**Ye kabhi mat karो**

\`\`\`python
SECRET_KEY = "django-insecure-hardcoded-in-git"    # version control mein -> compromised
DEBUG = True                                        # production mein -> users ko poore stack traces
ALLOWED_HOSTS = ["*"]                                # koi bhi Host header accept -> cache poisoning risk
\`\`\`

**Ye karो: environment variables**

\`\`\`python
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]                     # missing ho toh crash -- achha
DEBUG = os.environ.get("DJANGO_DEBUG", "false").lower() == "true"
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",")

# django-environ ke saath (pip install django-environ):
import environ
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(BASE_DIR / ".env")            # .env .gitignore mein hai
SECRET_KEY = env("DJANGO_SECRET_KEY")
DATABASES = {"default": env.db("DATABASE_URL")}    # postgres://user:pw@host:5432/name parse karता hai
\`\`\`

**Dev vs prod ke liye split settings**

\`\`\`
config/settings/
  base.py         # sab shared
  dev.py          # from .base import *; DEBUG = True; debug_toolbar jaisी extra apps
  prod.py         # from .base import *; DEBUG = False; SECURE_* on; asli hosts
  test.py         # tez password hasher, in-memory / test db
\`\`\`

\`\`\`
PRODUCTION CHECKLIST (manage.py check --deploy inमें se adhikaansh verify karता hai)
  DEBUG = False
  SECRET_KEY env se, lamba + random, git mein NAHI, rotatable
  ALLOWED_HOSTS = aapke asli domains
  SECURE_SSL_REDIRECT = True
  SECURE_HSTS_SECONDS = 31536000
  SESSION_COOKIE_SECURE = True    CSRF_COOKIE_SECURE = True
  SECURE_CONTENT_TYPE_NOSNIFF = True
  X_FRAME_OPTIONS = "DENY"
  database credentials env se, DB ko TLS
\`\`\``,

    content: `## How settings load

Django needs one environment variable, \`DJANGO_SETTINGS_MODULE\`, pointing at an importable module (e.g. \`config.settings.prod\`). \`manage.py\` sets a default; \`wsgi.py\`/\`asgi.py\` set one too. At startup Django imports that module and copies its **uppercase module-level names** into \`django.conf.settings\`, layering them over \`django.conf.global_settings\` (the framework defaults). So a settings file only needs to specify what differs from the defaults.

Access settings anywhere with:

\`\`\`python
from django.conf import settings
settings.DEBUG          # not "from config.settings import DEBUG" -- always via django.conf
\`\`\`

## The three settings you must get right

### \`DEBUG\`

\`DEBUG = True\` turns on: detailed error pages showing the full traceback, local variables, and the entire settings dict (with secrets masked but structure exposed); the \`django.contrib.staticfiles\` dev file server; SQL query logging held in memory (a slow leak); and relaxed \`ALLOWED_HOSTS\`. **In production it is a critical vulnerability** — an unhandled exception hands an attacker your stack trace and configuration. Always \`False\` in prod, driven by an env var.

### \`SECRET_KEY\`

A random string Django uses as the key for all cryptographic signing: session data, \`signed cookies\`, password-reset and email-confirmation tokens, the CSRF token in some configs, and \`django.core.signing\`. If it leaks, an attacker can forge sessions and tokens. Rules: at least 50 random characters, never committed, loaded from the environment or a secrets manager, and rotatable (Django 4.1+ supports \`SECRET_KEY_FALLBACKS\` so you can rotate without logging everyone out).

### \`ALLOWED_HOSTS\`

A list of host/domain strings the site will serve. Django checks the incoming \`Host\` header against it; a mismatch returns HTTP 400. This blocks HTTP Host header attacks (cache poisoning, poisoned password-reset links). With \`DEBUG = False\` and an empty list, Django refuses every request. Set it to your real domains. \`["*"]\` disables the check — acceptable only behind a proxy that already validates Host.

## Environment variables and 12-factor

The twelve-factor methodology says: **store config in the environment**, because config varies between deploys (dev, staging, prod) while code does not. Concretely:

- Secrets and per-environment values (\`SECRET_KEY\`, \`DATABASE_URL\`, \`ALLOWED_HOSTS\`, API keys, \`DEBUG\`) come from \`os.environ\` or a helper like \`django-environ\` / \`python-decouple\`.
- Local development uses a \`.env\` file that is **in \`.gitignore\`** and loaded at startup. A committed \`.env.example\` documents the required keys with dummy values.
- Production injects real values through the platform: systemd \`EnvironmentFile\`, Docker \`--env-file\` / compose \`environment:\`, Kubernetes \`Secret\`s, or a secrets manager (AWS Secrets Manager, Vault, Doppler).
- \`os.environ["X"]\` (crash if missing) is better than \`os.environ.get("X")\` (silent \`None\`) for required settings — fail fast at boot, not at runtime.

\`\`\`python
# django-environ typed reads:
env = environ.Env(
    DEBUG=(bool, False),
    ALLOWED_HOSTS=(list, []),
    SECURE_SSL_REDIRECT=(bool, True),
)
environ.Env.read_env(BASE_DIR / ".env")

DEBUG = env("DEBUG")
DATABASES = {"default": env.db("DATABASE_URL")}    # one URL -> full DATABASES dict
CACHES = {"default": env.cache("REDIS_URL")}
\`\`\`

## Split settings

A single \`settings.py\` with \`if DEBUG:\` branches becomes unreadable and error-prone. Split into a package:

\`\`\`python
# config/settings/base.py -- everything common
INSTALLED_APPS = [...]
MIDDLEWARE = [...]
# ...

# config/settings/dev.py
from .base import *        # noqa
DEBUG = True
INSTALLED_APPS += ["debug_toolbar"]
MIDDLEWARE = ["debug_toolbar.middleware.DebugToolbarMiddleware", *MIDDLEWARE]
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# config/settings/prod.py
from .base import *        # noqa
DEBUG = False
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31_536_000
SESSION_COOKIE_SECURE = CSRF_COOKIE_SECURE = True
# ...

# config/settings/test.py
from .base import *        # noqa
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]   # fast, tests only
\`\`\`

Select with \`DJANGO_SETTINGS_MODULE=config.settings.prod\` in each environment. Keep \`__init__.py\` empty.

## The deployment checklist

\`python manage.py check --deploy\` runs security-focused system checks and warns about: \`DEBUG\`, a weak or default \`SECRET_KEY\`, missing HSTS, non-secure cookies, missing \`SECURE_SSL_REDIRECT\`, \`SECURE_CONTENT_TYPE_NOSNIFF\` off, a permissive \`X_FRAME_OPTIONS\`, and more. Wire it into CI. The full set of \`SECURE_*\` / cookie settings is covered in Module 6 (API security).`,

    contentHi: `## Settings kaise load hoती hain

Django ko ek environment variable chahiye, \`DJANGO_SETTINGS_MODULE\`, jо ek importable module ki taraf ishaara kare (jaise \`config.settings.prod\`). \`manage.py\` ek default set karता hai. Startup par Django us module ko import karता hai aur iske **uppercase module-level names** ko \`django.conf.settings\` mein copy karता hai, unhe \`django.conf.global_settings\` (framework defaults) ke upar layer karके.

Settings kahin bhi access karो:

\`\`\`python
from django.conf import settings
settings.DEBUG          # "from config.settings import DEBUG" nahi -- hamesha django.conf ke zariye
\`\`\`

## Teen settings jinhe aapko sahi karna hai

### \`DEBUG\`

\`DEBUG = True\` on karता hai: vistृत error pages jо poora traceback, local variables, aur poora settings dict dikhाते hain; dev file server; SQL query logging memory mein (ek dhीmा leak); aur relaxed \`ALLOWED_HOSTS\`. **Production mein ye ek critical vulnerability hai** — ek unhandled exception ek attacker ko aapka stack trace aur configuration deता hai. Prod mein hamesha \`False\`, ek env var se.

### \`SECRET_KEY\`

Ek random string jise Django saare cryptographic signing ki key ki tarah istemal karता hai: session data, signed cookies, password-reset aur email-confirmation tokens. Agar ye leak hoता hai, ek attacker sessions aur tokens forge kar sakta hai. Niyam: kam se kam 50 random characters, kabhi committed nahi, environment se load, aur rotatable.

### \`ALLOWED_HOSTS\`

Host/domain strings ki ek list jise site serve karegी. Django incoming \`Host\` header ko iske khilaaf check karता hai; ek mismatch HTTP 400 lautाता hai. Ye HTTP Host header attacks block karता hai. \`DEBUG = False\` aur ek khali list ke saath, Django har request refuse karता hai.

## Environment variables aur 12-factor

Twelve-factor methodology kehती hai: **config environment mein store karो**, kyunki config deploys ke beech alag hoती hai jabki code nahi.

- Secrets aur per-environment values \`os.environ\` ya \`django-environ\` jaisे helper se aati hain.
- Local development ek \`.env\` file istemal karता hai jо **\`.gitignore\` mein hai**. Ek committed \`.env.example\` required keys document karता hai.
- Production platform ke zariye asli values inject karता hai: systemd \`EnvironmentFile\`, Docker \`--env-file\`, Kubernetes \`Secret\`s, ya ek secrets manager.
- \`os.environ["X"]\` (missing ho toh crash) required settings ke liye \`os.environ.get("X")\` (silent \`None\`) se behtar hai — boot par fail fast, runtime par nahi.

## Split settings

\`if DEBUG:\` branches waali ek single \`settings.py\` unreadable ban jाती hai. Ek package mein split karो:

\`\`\`python
# config/settings/base.py -- sab common
# config/settings/dev.py -- from .base import *; DEBUG = True
# config/settings/prod.py -- from .base import *; DEBUG = False; SECURE_* on
# config/settings/test.py -- fast password hasher
\`\`\`

Har environment mein \`DJANGO_SETTINGS_MODULE=config.settings.prod\` se select karो.

## Deployment checklist

\`python manage.py check --deploy\` security-focused system checks chalाता hai aur inके baare mein warn karता hai: \`DEBUG\`, ek weak \`SECRET_KEY\`, missing HSTS, non-secure cookies. Ise CI mein wire karो.`,

    examples: [
      {
        title: 'DEBUG changes what an error reveals',
        titleHi: 'DEBUG badalता hai ki ek error kya reveal karता hai',
        code: `import django
from django.conf import settings
from django.test import Client
from django.http import HttpResponse
from django.urls import path

settings.configure(
    DEBUG=True, SECRET_KEY="dev", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["testserver"],
    INSTALLED_APPS=[], MIDDLEWARE=[], USE_TZ=True,
)
django.setup()

def boom(request):
    secret_token = "sk_live_ABC123"          # a local variable
    raise ValueError("payment gateway unreachable")

urlpatterns = [path("pay/", boom)]

# DEBUG=True: the 500 page is Django's technical error page
resp = Client(raise_request_exception=False).get("/pay/")
body = resp.content.decode()
print("status:", resp.status_code)
print("shows traceback:", "ValueError" in body and "Traceback" in body)
print("leaks local var name:", "secret_token" in body)
print("leaks the exception message:", "payment gateway unreachable" in body)
print("-- with DEBUG=False this page would be a plain 'Server Error (500)' --")`,
        output: `status: 500
shows traceback: True
leaks local var name: True
leaks the exception message: True
-- with DEBUG=False this page would be a plain 'Server Error (500)' --`,
        explain: 'With `DEBUG=True`, an unhandled exception renders Django\'s technical 500 page: the full traceback, every stack frame\'s local variables (here the name `secret_token` is visible), the exception message, request metadata, and the settings. That is invaluable in development and catastrophic in production — it is a direct information leak to whoever triggered the error. With `DEBUG=False` the same request returns a generic "Server Error (500)" page and the detail goes only to the logs and `ADMINS` error email.',
        explainHi: '`DEBUG=True` ke saath, ek unhandled exception Django ka technical 500 page render karता hai: poora traceback, har stack frame ke local variables (yahaan naam `secret_token` dikhता hai), exception message, request metadata, aur settings. Ye development mein anmol hai aur production mein vinaashkaari — ye jisne error trigger kiya use ek seedhा information leak hai. `DEBUG=False` ke saath wahi request ek generic "Server Error (500)" page lautाता hai aur detail sirf logs mein jाता hai.',
      },
      {
        title: 'ALLOWED_HOSTS validates the Host header',
        titleHi: 'ALLOWED_HOSTS Host header validate karता hai',
        code: `import django
from django.conf import settings
from django.test import Client
from django.http import HttpResponse
from django.urls import path

settings.configure(
    DEBUG=False, SECRET_KEY="x", ROOT_URLCONF=__name__,
    ALLOWED_HOSTS=["example.com", "www.example.com"],
    INSTALLED_APPS=[], MIDDLEWARE=["django.middleware.common.CommonMiddleware"], USE_TZ=True,
)
django.setup()

def home(request):
    return HttpResponse("ok " + request.get_host())

urlpatterns = [path("", home)]

c = Client()
for host in ["example.com", "www.example.com", "evil.com", "example.com.attacker.net"]:
    resp = c.get("/", HTTP_HOST=host)
    print(f"{host:28} -> {resp.status_code}")`,
        output: `example.com                  -> 200
www.example.com              -> 200
evil.com                     -> 400
example.com.attacker.net     -> 400`,
        explain: 'Django compares the request\'s `Host` header against `ALLOWED_HOSTS` before routing. A listed host is served (200); anything else gets `400 Bad Request` and never reaches a view. This blocks Host-header injection: an attacker who can make your app generate a password-reset link using an attacker-controlled `Host` could send victims a poisoned link. Note the exact-match behaviour — `example.com.attacker.net` is rejected. `["*"]` turns this check off entirely.',
        explainHi: 'Django request ke `Host` header ko routing se pehle `ALLOWED_HOSTS` ke khilaaf compare karता hai. Ek listed host serve hoता hai (200); baaki kuch `400 Bad Request` paता hai aur kabhi ek view tak nahi pahुँchता. Ye Host-header injection block karता hai: ek attacker jо aapke app ko ek attacker-controlled `Host` istemal karके password-reset link generate karवा sakta hai victims ko ek poisoned link bhej sakta hai. `["*"]` ye check poori tarah off karता hai.',
      },
      {
        title: 'Reading config from the environment, with a typed default',
        titleHi: 'Environment se config padhna, ek typed default ke saath',
        code: `import os

# simulate the deploy environment injecting values
os.environ["DJANGO_DEBUG"] = "false"
os.environ["DJANGO_ALLOWED_HOSTS"] = "example.com,api.example.com"
os.environ["DATABASE_URL"] = "postgres://app:s3cr3t@db.internal:5432/appdb"
# DJANGO_SECRET_KEY intentionally NOT set

def env_bool(key, default=False):
    return os.environ.get(key, str(default)).strip().lower() in {"1", "true", "yes", "on"}

def parse_db_url(url):
    # minimal: scheme://user:pw@host:port/name
    from urllib.parse import urlparse
    u = urlparse(url)
    return {"ENGINE": "django.db.backends.postgresql", "NAME": u.path.lstrip("/"),
            "USER": u.username, "PASSWORD": u.password, "HOST": u.hostname, "PORT": u.port}

DEBUG = env_bool("DJANGO_DEBUG")
ALLOWED_HOSTS = [h for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",") if h]
DATABASES = {"default": parse_db_url(os.environ["DATABASE_URL"])}

print("DEBUG:", DEBUG)
print("ALLOWED_HOSTS:", ALLOWED_HOSTS)
print("DB host/name:", DATABASES["default"]["HOST"], "/", DATABASES["default"]["NAME"])
print("DB password in this dict, not in git:", DATABASES["default"]["PASSWORD"] == "s3cr3t")

try:
    SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]     # required -> crash if absent
except KeyError:
    print("SECRET_KEY missing -> boot fails immediately (correct: fail fast)")`,
        output: `DEBUG: False
ALLOWED_HOSTS: ['example.com', 'api.example.com']
DB host/name: db.internal / appdb
DB password in this dict, not in git: True
SECRET_KEY missing -> boot fails immediately (correct: fail fast)`,
        explain: 'This is the shape of a 12-factor settings file: every value that changes per environment or is sensitive is read from `os.environ`, with typed parsing (a string `"false"` becomes the boolean `False`, a comma list becomes a Python list, a `DATABASE_URL` becomes the `DATABASES` dict). `django-environ` does all of this for you (`env.db()`, `env.bool()`, `env.list()`). Requiring `SECRET_KEY` via `os.environ["..."]` means a misconfigured deploy fails at boot with a clear error, not later with a subtle signing bug.',
        explainHi: 'Ye ek 12-factor settings file ka shape hai: har value jо per environment badalती hai ya sensitive hai `os.environ` se padhी jाती hai, typed parsing ke saath (ek string `"false"` boolean `False` ban jाता hai, ek comma list ek Python list, ek `DATABASE_URL` `DATABASES` dict). `django-environ` ye sab aapke liye karता hai. `SECRET_KEY` ko `os.environ["..."]` ke zariye require karna matlab ek misconfigured deploy boot par ek spasht error ke saath fail hoता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# config/settings.py -- committed to git
SECRET_KEY = "django-insecure-8k2h#v9..."
DEBUG = True
DATABASES = {"default": {..., "PASSWORD": "prod_db_password"}}
STRIPE_SECRET_KEY = "sk_live_51H..."`,
        right: `import os
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = os.environ.get("DJANGO_DEBUG", "false").lower() == "true"
DATABASES = {"default": {..., "PASSWORD": os.environ["DB_PASSWORD"]}}
STRIPE_SECRET_KEY = os.environ["STRIPE_SECRET_KEY"]
# .env (gitignored) locally; real env vars in prod; .env.example committed as documentation`,
        why: 'Anything in git history is permanently exposed to everyone with repo access and to anyone if the repo ever leaks — rewriting history does not help once it is cloned or mirrored. Secrets belong in the environment, injected at deploy time and never written to disk in the repo. A leaked `SECRET_KEY` lets an attacker forge sessions; a leaked DB password or API key is immediate. Rotate anything that has ever been committed.',
        whyHi: 'Git history mein kuch bhi permanently expose hoता hai repo access waale har vyakti ko. Secrets environment mein rehते hain, deploy time par inject kiye aur kabhi repo mein disk par nahi likhे. Ek leaked `SECRET_KEY` ek attacker ko sessions forge karne deता hai; ek leaked DB password turant. Jо kabhi committed hua use rotate karो.',
      },
      {
        wrong: `# one settings.py with runtime branching
DEBUG = os.environ.get("ENV") != "production"
if DEBUG:
    ALLOWED_HOSTS = ["*"]
    INSTALLED_APPS += ["debug_toolbar"]
else:
    ALLOWED_HOSTS = ["example.com"]
    SECURE_SSL_REDIRECT = True
    # ...50 more lines of if/else`,
        right: `# config/settings/base.py  -- shared
# config/settings/dev.py   -- from .base import *; DEBUG = True; debug_toolbar
# config/settings/prod.py  -- from .base import *; DEBUG = False; SECURE_* on
# choose with DJANGO_SETTINGS_MODULE per environment`,
        why: 'A single file full of environment `if`/`else` is hard to read, easy to get wrong (a prod-only security setting accidentally inside the dev branch), and mixes concerns. Separate modules make each environment\'s configuration explicit and reviewable, let dev-only tools (`debug_toolbar`, `django_extensions`) exist only where wanted, and make it obvious when prod is missing a hardening setting.',
        whyHi: 'Environment `if`/`else` se bhari ek single file padhна mushkil hai, galat karna aasaan (ek prod-only security setting galti se dev branch ke andar). Alag modules har environment ki configuration explicit banाते hain, dev-only tools ko sirf jahaan chahiye wahaan rehने dete hain.',
      },
      {
        wrong: `DEBUG = False
ALLOWED_HOSTS = []          # forgot to set it
# -> every request returns 400 Bad Request in production`,
        right: `DEBUG = False
ALLOWED_HOSTS = os.environ["DJANGO_ALLOWED_HOSTS"].split(",")   # ["example.com", "www.example.com"]
# and: fail loudly if unset, rather than silently serving nothing`,
        why: 'With `DEBUG = False`, Django requires `ALLOWED_HOSTS` to contain the request\'s host or it returns 400 for everything — a common "the deploy is up but every page is broken" incident. Set it from an env var, and prefer a required read so a missing value crashes the boot with a clear message instead of producing a site that 400s every request.',
        whyHi: '`DEBUG = False` ke saath, Django ko `ALLOWED_HOSTS` mein request ka host chahiye warna ye har cheez ke liye 400 lautाता hai — ek aam "deploy up hai par har page toota hai" incident. Ise ek env var se set karो, aur ek required read prefer karो.',
      },
    ],

    realWorld: [
      {
        en: '**`django-environ` + a `config/settings/` package is the near-universal production layout** — `base.py`, `prod.py`, `dev.py`, `test.py`; a gitignored `.env` locally; `DATABASE_URL` / `REDIS_URL` / `SENTRY_DSN` as single env vars parsed by `env.db()` / `env.cache()`. `DJANGO_SETTINGS_MODULE` is set in the Dockerfile, systemd unit, or platform config.',
        hi: '**`django-environ` + ek `config/settings/` package lगbhag universal production layout hai** — `base.py`, `prod.py`, `dev.py`, `test.py`; local mein ek gitignored `.env`; `DATABASE_URL` / `REDIS_URL` single env vars ki tarah `env.db()` / `env.cache()` se parse. `DJANGO_SETTINGS_MODULE` Dockerfile ya systemd unit mein set hoता hai.',
      },
      {
        en: '**`python manage.py check --deploy` runs in CI and blocks merges** on real teams, alongside `makemigrations --check`. Some teams also assert `DEBUG is False` and `"*" not in ALLOWED_HOSTS` in a dedicated settings test so a bad prod config cannot pass review.',
        hi: '**`python manage.py check --deploy` CI mein chalता hai aur merges block karता hai** asli teams par, `makemigrations --check` ke saath. Kuch teams ek dedicated settings test mein `DEBUG is False` bhi assert karती hain.',
      },
      {
        en: '**Secrets live in a manager, not the environment file, at scale** — AWS Secrets Manager / Parameter Store, HashiCorp Vault, GCP Secret Manager, or Doppler, pulled into the environment at container start by an entrypoint script or sidecar. `SECRET_KEY_FALLBACKS` (Django 4.1+) lets you rotate the key without invalidating live sessions.',
        hi: '**Secrets scale par ek manager mein rehते hain, environment file mein nahi** — AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager, ya Doppler, container start par ek entrypoint script se environment mein pull kiye. `SECRET_KEY_FALLBACKS` (Django 4.1+) aapko key rotate karne deता hai bina live sessions invalidate kiye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why must `DEBUG` be `False` in production, and what exactly does it expose?',
        qHi: 'Production mein `DEBUG` `False` kyun hona chahiye, aur ye asal mein kya expose karता hai?',
        a: 'DEBUG controls how much internal detail Django reveals and how forgiving it is about configuration. When it is True and an unhandled exception occurs, Django renders its technical error page instead of a generic 500. That page contains the full Python traceback, and for every frame in the stack it shows the local variables and their values — which routinely includes tokens, partial credentials, user data, and query parameters. It also shows the request metadata, the loaded middleware, the template context if it is a template error, and a dump of the settings, with values that look secret-ish masked but the keys and structure fully visible. On a 404 with DEBUG True you get a page listing every URL pattern in the project. Beyond error pages, DEBUG True keeps every SQL query executed during the request in memory on the connection object, which is a slow memory leak under sustained traffic, and it relaxes ALLOWED_HOSTS handling. So in production DEBUG True is a direct, unauthenticated information disclosure: anyone who can cause an error — and errors are easy to cause — gets your stack traces and configuration, which is often enough to find the next vulnerability. The correct setup is DEBUG driven by an environment variable, defaulting to False, so it is False everywhere except a developer\'s machine. With DEBUG False, an unhandled exception returns a plain "Server Error (500)" page and the real detail goes to your logging system and, if configured, an email to the ADMINS list.',
        aHi: 'DEBUG control karता hai ki Django kितna internal detail reveal karता hai. Jab ye True hai aur ek unhandled exception hoता hai, Django ek generic 500 ke bजाय apna technical error page render karता hai. Us page mein poora Python traceback hoता hai, aur stack ke har frame ke liye ye local variables aur unki values dikhाता hai — jismें routinely tokens, partial credentials, user data shaamil hoते hain. Ye request metadata, loaded middleware, aur settings ka ek dump bhi dikhाता hai. Ek 404 par DEBUG True ke saath aapko project mein har URL pattern list karता ek page milता hai. Error pages ke alावा, DEBUG True har SQL query ko memory mein rakhता hai jо sustained traffic ke tahat ek dhीmा memory leak hai. Toh production mein DEBUG True ek seedhा, unauthenticated information disclosure hai: koi bhi jо ek error cause kar sakta hai aapke stack traces aur configuration paता hai. Sahi setup DEBUG ko ek environment variable se driven karna hai, False default.',
      },
      {
        q: 'How do you manage settings for multiple environments and keep secrets out of the repo?',
        qHi: 'Aap kai environments ke liye settings kaise manage karते ho aur secrets ko repo se bahar kaise rakhते ho?',
        a: 'Two separate concerns. For per-environment configuration I split the settings module into a package: a base module with everything common — installed apps, middleware, templates, the parts that never change — and then thin per-environment modules, dev, prod, test, each of which does "from base import star" and then overrides only what differs. Dev turns DEBUG on and adds developer tools like the debug toolbar; prod turns DEBUG off and turns on the security settings — SSL redirect, HSTS, secure cookies; test swaps in a fast password hasher. Which module loads is selected by the DJANGO_SETTINGS_MODULE environment variable, set per environment in the Dockerfile, the systemd unit, or the platform config. This is much more reviewable than one file full of if-else branches, where it is easy to leave a production security setting inside the wrong branch. For secrets and values that vary by deploy — the secret key, the database URL, API keys, allowed hosts — those come from the environment, never from code in the repo. Locally I use a dot-env file that is in gitignore, loaded at startup, with a committed dot-env-dot-example that documents the required keys using dummy values. In production the real values are injected by the platform: an environment file for systemd, env vars in the container orchestrator, Kubernetes secrets, or ideally pulled from a secrets manager like Vault or AWS Secrets Manager at container start. I prefer reading required values with a form that raises if the variable is missing, so a misconfigured deploy fails immediately at boot with a clear message rather than running with a broken or insecure fallback. django-environ or python-decouple make the typed reads convenient — parsing a database URL into the DATABASES dict, a string into a boolean, a comma-separated string into a list. And anything that was ever committed by mistake must be rotated, because git history is forever.',
        aHi: 'Do alag concerns. Per-environment configuration ke liye main settings module ko ek package mein split karता hूं: ek base module sab common ke saath, aur phir patle per-environment modules, dev, prod, test, jismें se har ek "from base import star" karता hai aur phir sirf jо alag hai override karता hai. Dev DEBUG on karता hai; prod DEBUG off karता hai aur security settings on karता hai; test ek fast password hasher swap karता hai. Kaunsा module load hoता hai DJANGO_SETTINGS_MODULE environment variable se select hoता hai. Secrets aur values jо deploy se alag hoती hain ke liye — secret key, database URL, API keys — wo environment se aati hain, kabhi repo ke code se nahi. Local mein main ek dot-env file istemal karता hूं jо gitignore mein hai, ek committed dot-env-dot-example ke saath. Production mein asli values platform dwara inject hoती hain. Main required values ko ऐसे padhna prefer karता hूं jо variable missing hone par raise kare. Jо kabhi galti se committed hua use rotate karna chahiye.',
      },
    ],

    exercises: [
      {
        task: 'Configure Django with `DEBUG=True`, a `ROOT_URLCONF` pointing at your module, and a view that raises `RuntimeError("db down")`. Use `django.test.Client(raise_request_exception=False)` to GET that URL and assert the response is 500 and its body contains both `"RuntimeError"` and `"db down"`. Then note in a comment what the body would be with `DEBUG=False`.',
        taskHi: 'Django ko `DEBUG=True`, ek `ROOT_URLCONF` aapke module par, aur ek view jо `RuntimeError("db down")` raise kare ke saath configure karो. `django.test.Client(raise_request_exception=False)` se us URL ko GET karो aur assert karो response 500 hai aur iska body `"RuntimeError"` aur `"db down"` dono rakhता hai.',
        hint: '`Client(raise_request_exception=False)` stops the test client from re-raising the view\'s exception so you can inspect the 500 page. `resp.content.decode()` has the rendered technical error page while `DEBUG=True`.',
        hintHi: '`Client(raise_request_exception=False)` test client ko view ke exception ko re-raise karne se rokता hai. `resp.content.decode()` mein rendered technical error page hai jab `DEBUG=True`.',
      },
      {
        task: 'Configure with `DEBUG=False`, `ALLOWED_HOSTS=["shop.example.com"]`, `MIDDLEWARE=["django.middleware.common.CommonMiddleware"]`, and one view returning `HttpResponse("ok")`. Send requests with `HTTP_HOST` set to `"shop.example.com"`, `"other.example.com"`, and `"shop.example.com.evil.com"` and print the status code for each. Confirm only the exact match is 200.',
        taskHi: '`DEBUG=False`, `ALLOWED_HOSTS=["shop.example.com"]`, `MIDDLEWARE=["django.middleware.common.CommonMiddleware"]` ke saath configure karो. `HTTP_HOST` ko `"shop.example.com"`, `"other.example.com"`, aur `"shop.example.com.evil.com"` set karके requests bhejो aur har ek ka status code print karो.',
        hint: '`Client().get("/", HTTP_HOST="other.example.com")`. Non-matching hosts return 400 before the view runs. `shop.example.com.evil.com` is NOT a match — `ALLOWED_HOSTS` is exact (or leading-dot wildcard), not a suffix check.',
        hintHi: '`Client().get("/", HTTP_HOST="other.example.com")`. Non-matching hosts view chalne se pehle 400 lautाते hain. `shop.example.com.evil.com` ek match NAHI hai.',
      },
      {
        task: 'Write an `env` helper: `env_str(key, required=True, default=None)` that returns `os.environ[key]`, raising `RuntimeError(f"missing env: {key}")` if required and absent, else `default`. Also `env_bool(key, default=False)` mapping `"1"/"true"/"yes"/"on"` (any case) to `True`. Set a few `os.environ` values, then build `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS` and print them; show the `RuntimeError` when `SECRET_KEY` is unset.',
        taskHi: 'Ek `env` helper likhо: `env_str(key, required=True, default=None)` jо `os.environ[key]` lautае, `RuntimeError` raise karे agar required aur absent. `env_bool(key, default=False)` bhi. Kuch `os.environ` values set karो, phir `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS` banाओ.',
        hint: '`env_bool`: `os.environ.get(key, "").strip().lower() in {"1","true","yes","on"}` (fall back to `default` when the key is absent entirely). `ALLOWED_HOSTS`: `[h for h in env_str("HOSTS", default="").split(",") if h]`.',
        hintHi: '`env_bool`: `os.environ.get(key, "").strip().lower() in {"1","true","yes","on"}`. `ALLOWED_HOSTS`: `[h for h in env_str("HOSTS", default="").split(",") if h]`.',
      },
    ],

    keyTakeaways: [
      'Django loads the module named by `DJANGO_SETTINGS_MODULE`, copies its UPPERCASE names into `django.conf.settings`, layered over framework defaults. Always read via `from django.conf import settings`, never import the settings module directly.',
      '`DEBUG=True` in production is a critical vulnerability: the technical 500 page leaks the full traceback, every frame\'s local variables, the exception message, request metadata, and the settings structure. Drive `DEBUG` from an env var; default `False`.',
      '`SECRET_KEY` signs sessions, signed cookies, and password-reset/confirmation tokens. 50+ random chars, never in git, from the environment, rotatable via `SECRET_KEY_FALLBACKS`.',
      '`ALLOWED_HOSTS` is checked against the `Host` header (mismatch -> HTTP 400), blocking Host-header injection. With `DEBUG=False` an empty list refuses everything — set your real domains; `["*"]` disables the check.',
      '12-factor: config that varies per deploy or is sensitive (`SECRET_KEY`, `DATABASE_URL`, `ALLOWED_HOSTS`, API keys) comes from `os.environ`. Local: a gitignored `.env` + committed `.env.example`. Prod: platform env / secrets manager. Prefer required reads that crash on missing values.',
      'Split settings into a package: `base.py` (shared) + `dev.py`/`prod.py`/`test.py` each doing `from .base import *` and overriding. Select with `DJANGO_SETTINGS_MODULE` per environment. Beats one file of `if DEBUG:` branches.',
      '`django-environ` / `python-decouple` give typed reads: `env.db("DATABASE_URL")` -> `DATABASES` dict, `env.bool()`, `env.list()`, `env.cache()`.',
      'Run `python manage.py check --deploy` in CI. It flags `DEBUG`, weak `SECRET_KEY`, missing HSTS/SSL-redirect, non-secure cookies, permissive `X_FRAME_OPTIONS`, and more.',
    ],
    keyTakeawaysHi: [
      'Django `DJANGO_SETTINGS_MODULE` dwara named module load karता hai, iske UPPERCASE names ko `django.conf.settings` mein copy karता hai. Hamesha `from django.conf import settings` ke zariye padhо.',
      'Production mein `DEBUG=True` ek critical vulnerability hai: technical 500 page poora traceback, har frame ke local variables, exception message, aur settings structure leak karता hai. `DEBUG` ko ek env var se driven karो; default `False`.',
      '`SECRET_KEY` sessions, signed cookies, aur password-reset tokens sign karता hai. 50+ random chars, kabhi git mein nahi, environment se, `SECRET_KEY_FALLBACKS` ke zariye rotatable.',
      '`ALLOWED_HOSTS` `Host` header ke khilaaf check hoता hai (mismatch -> HTTP 400), Host-header injection block karता hai. `DEBUG=False` ke saath ek khali list sab refuse karती hai — apne asli domains set karो; `["*"]` check disable karता hai.',
      '12-factor: config jо per deploy badalती hai ya sensitive hai `os.environ` se aati hai. Local: ek gitignored `.env` + committed `.env.example`. Prod: platform env / secrets manager. Missing values par crash karne waale required reads prefer karो.',
      'Settings ko ek package mein split karो: `base.py` (shared) + `dev.py`/`prod.py`/`test.py` har ek `from .base import *` karके aur override karके. Har environment mein `DJANGO_SETTINGS_MODULE` se select karो.',
      '`django-environ` typed reads deता hai: `env.db("DATABASE_URL")` -> `DATABASES` dict, `env.bool()`, `env.list()`.',
      'CI mein `python manage.py check --deploy` chalाओ. Ye `DEBUG`, weak `SECRET_KEY`, missing HSTS/SSL-redirect, non-secure cookies flag karता hai.',
    ],
  },

  {
    slug: 'dj-urls-and-routing',
    title: 'URLs & Routing: URLconf, Converters, include(), reverse()',
    titleHi: 'URLs Aur Routing: URLconf, Converters, include(), reverse()',
    description: 'In Express you attach handlers to paths imperatively as the app boots. Django\'s URLconf is a declarative list matched top to bottom, with typed path segments, per-app URL modules stitched together by `include()`, and names you resolve back to URLs so a route change never breaks a link.',
    descriptionHi: 'Express mein aap handlers ko paths se imperatively attach karते ho jab app boot hoता hai. Django ka URLconf ek declarative list hai jо upar se neeche match hoती hai, typed path segments ke saath, per-app URL modules `include()` se sile hue, aur names jinhe aap wapas URLs mein resolve karते ho taaki ek route change kabhi ek link na todे.',
    difficulty: 'EASY',
    duration: 20,

    order: 3,

    analogy: {
      en: '**A switchboard operator working down a printed call list.** Every incoming request is a caller asking for a path. The operator (the URL resolver) reads the list from the top, and connects the call to the first entry whose pattern the path matches — order matters, the specific lines go above the catch-alls. Some entries are direct extensions (`path("about/", about_view)`); others say "for anything starting `billing/`, hand the rest of the number to the billing department\'s own switchboard" — that is `include("billing.urls")`, and it is how a large building keeps each department\'s numbers in that department\'s own book. The typed segments (`<int:pk>`, `<slug:name>`) are the operator refusing to connect a call whose extension is the wrong shape — letters where digits belong. And every line has a **name** as well as a number, so when the billing department relocates, you update one entry and every internal directory that referred to it by name still connects, because you never wrote the raw number down anywhere else — you always looked it up by name with `reverse()`.',
      hi: '**Ek switchboard operator ek printed call list par kaam kar raha hai.** Har incoming request ek caller hai jо ek path maang raha hai. Operator (URL resolver) list ko upar se padhता hai, aur call ko pehli entry se connect karता hai jiska pattern path match karता hai — kram maayne rakhता hai, specific lines catch-alls ke upar. Kuch entries seedhी extensions hain (`path("about/", about_view)`); doosri kehती hain "kisi bhi cheez ke liye jо `billing/` se shuru hoती hai, baaki number billing department ke apne switchboard ko do" — wo `include("billing.urls")` hai. Typed segments (`<int:pk>`, `<slug:name>`) operator ka ek call connect karne se inkaar karna hai jiska extension galat shape ka hai. Aur har line ka ek **naam** hai number ke alावा, toh jab billing department relocate karता hai, aap ek entry update karते ho aur har internal directory jо ise naam se refer karता tha abhi bhi connect karता hai, kyunki aapne raw number kabhi kahin nahi likhा — aap hamesha ise naam se `reverse()` se dhoondhते the.',
    },

    simple: `**The root URLconf**

\`\`\`python
# config/urls.py  --  ROOT_URLCONF points here
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("pages.urls")),           # delegate to an app's urls.py
    path("api/", include("api.urls")),
    path("blog/", include("blog.urls", namespace="blog")),
]
\`\`\`

**An app's URLconf**

\`\`\`python
# blog/urls.py
from django.urls import path
from . import views

app_name = "blog"                              # enables "blog:detail" names

urlpatterns = [
    path("", views.post_list, name="list"),               # /blog/
    path("<int:year>/", views.archive, name="archive"),   # /blog/2024/
    path("<slug:slug>/", views.post_detail, name="detail"),  # /blog/my-first-post/
]
\`\`\`

**Path converters — typed segments**

\`\`\`
<int:pk>       one or more digits          -> int         42
<str:name>     any non-empty, no slash     -> str  (default)
<slug:slug>    letters, numbers, - and _   -> str         my-post-1
<uuid:id>      a UUID                       -> UUID
<path:rest>    anything INCLUDING slashes   -> str         a/b/c.txt
\`\`\`

**Matching is top-to-bottom, first match wins**

\`\`\`python
urlpatterns = [
    path("posts/new/", views.create),          # must be ABOVE the next line
    path("posts/<slug:slug>/", views.detail),   # would also match "new" as a slug
]
\`\`\`

**Never hard-code URLs — resolve names**

\`\`\`python
# in Python:
from django.urls import reverse
url = reverse("blog:detail", kwargs={"slug": "hello-world"})   # -> "/blog/hello-world/"

# in a redirect:
from django.shortcuts import redirect
return redirect("blog:list")

# in a template:
# <a href="{% url 'blog:detail' slug=post.slug %}">{{ post.title }}</a>

# on a model:
class Post(models.Model):
    def get_absolute_url(self):
        return reverse("blog:detail", kwargs={"slug": self.slug})
\`\`\`

\`\`\`
path(route, view, kwargs=None, name=None)
  route  : a string; "<converter:name>" captures a typed segment -> passed as a kwarg to the view
  view   : a callable (FBV) or View.as_view() (CBV) or include(...)
  name   : the identifier for reverse() / {% url %}

include("app.urls")            mount another URLconf under this prefix
include(("app.urls", "app"))   with an app namespace
resolve("/blog/x/")            URL string  -> ResolverMatch (func, args, kwargs, url_name, ...)
reverse("blog:detail", kwargs=...)   name -> URL string   (raises NoReverseMatch if it can't)
\`\`\``,

    simpleHi: `**Root URLconf**

\`\`\`python
# config/urls.py  --  ROOT_URLCONF yahaan point karता hai
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("pages.urls")),           # ek app ke urls.py ko delegate karो
    path("api/", include("api.urls")),
    path("blog/", include("blog.urls", namespace="blog")),
]
\`\`\`

**Ek app ka URLconf**

\`\`\`python
# blog/urls.py
from django.urls import path
from . import views

app_name = "blog"                              # "blog:detail" names enable karता hai

urlpatterns = [
    path("", views.post_list, name="list"),               # /blog/
    path("<int:year>/", views.archive, name="archive"),   # /blog/2024/
    path("<slug:slug>/", views.post_detail, name="detail"),  # /blog/my-first-post/
]
\`\`\`

**Path converters — typed segments**

\`\`\`
<int:pk>       ek ya zyada digits          -> int         42
<str:name>     koi bhi non-empty, no slash -> str  (default)
<slug:slug>    letters, numbers, - aur _   -> str         my-post-1
<uuid:id>      ek UUID                      -> UUID
<path:rest>    kuch bhi slashes SAHIT       -> str         a/b/c.txt
\`\`\`

**Matching upar-se-neeche hai, pehla match jeetता hai**

\`\`\`python
urlpatterns = [
    path("posts/new/", views.create),          # agli line ke UPAR hona chahiye
    path("posts/<slug:slug>/", views.detail),   # "new" ko bhi ek slug ki tarah match karता
]
\`\`\`

**URLs kabhi hard-code mat karो — names resolve karो**

\`\`\`python
from django.urls import reverse
url = reverse("blog:detail", kwargs={"slug": "hello-world"})   # -> "/blog/hello-world/"

from django.shortcuts import redirect
return redirect("blog:list")

# template mein:
# <a href="{% url 'blog:detail' slug=post.slug %}">{{ post.title }}</a>

class Post(models.Model):
    def get_absolute_url(self):
        return reverse("blog:detail", kwargs={"slug": self.slug})
\`\`\`

\`\`\`
path(route, view, kwargs=None, name=None)
  route  : ek string; "<converter:name>" ek typed segment capture karता hai -> view ko kwarg
  view   : ek callable (FBV) ya View.as_view() (CBV) ya include(...)
  name   : reverse() / {% url %} ke liye identifier

include("app.urls")            is prefix ke tahat doosra URLconf mount karो
resolve("/blog/x/")            URL string  -> ResolverMatch
reverse("blog:detail", kwargs=...)   name -> URL string   (NoReverseMatch raise karता hai)
\`\`\``,

    content: `## The URLconf

\`ROOT_URLCONF\` in settings names a module (usually \`config.urls\`) that exposes a list called \`urlpatterns\`. Each entry is a \`path()\` (or \`re_path()\` for regex). On each request Django walks \`urlpatterns\` in order and uses the **first** pattern that matches the path (the part after the domain, with the leading slash stripped for matching). Match -> the view is called. No match anywhere -> HTTP 404.

\`\`\`python
from django.urls import path, re_path

urlpatterns = [
    path("articles/2003/", views.special_case_2003),
    path("articles/<int:year>/", views.year_archive),
    path("articles/<int:year>/<int:month>/", views.month_archive),
    re_path(r"^articles/(?P<year>[0-9]{4})/$", views.year_archive),   # regex form
]
\`\`\`

Captured segments are passed to the view as **keyword arguments** matching the converter name: \`path("articles/<int:year>/", views.year_archive)\` calls \`year_archive(request, year=2024)\`.

## Path converters

The built-in converters and what they capture:

| Converter | Matches | Python type |
|---|---|---|
| \`str\` (default) | any non-empty string without \`/\` | \`str\` |
| \`int\` | \`[0-9]+\` | \`int\` |
| \`slug\` | ASCII letters/numbers plus \`-\` and \`_\` | \`str\` |
| \`uuid\` | a formatted UUID | \`uuid.UUID\` |
| \`path\` | any non-empty string **including** \`/\` | \`str\` |

You can register custom converters (e.g. a \`<yyyymm:period>\`) with \`register_converter\`. \`re_path\` drops to raw regex with named groups when \`path\` is not expressive enough.

## \`include()\` and app URL modules

A monolithic root URLconf does not scale. Each app ships its own \`urls.py\` with its own \`urlpatterns\`, and the root URLconf mounts it under a prefix:

\`\`\`python
# config/urls.py
path("shop/", include("shop.urls")),

# shop/urls.py
app_name = "shop"
urlpatterns = [
    path("", views.index, name="index"),                 # -> /shop/
    path("cart/", views.cart, name="cart"),              # -> /shop/cart/
    path("p/<slug:slug>/", views.product, name="product"),   # -> /shop/p/<slug>/
]
\`\`\`

\`include()\` strips the matched prefix and hands the remainder to the included URLconf. This keeps each app's routing self-contained and movable.

## Namespacing

Two apps can both have a URL named \`"detail"\`. \`app_name = "shop"\` in \`shop/urls.py\` creates the **application namespace** so you refer to it unambiguously as \`"shop:detail"\`. For the same app mounted at two prefixes, use an **instance namespace**: \`include("shop.urls", namespace="shop-eu")\`.

## \`reverse()\`, \`resolve()\`, and never hard-coding URLs

The rule: **write URL patterns in exactly one place (the URLconf), and everywhere else refer to them by name.** Then changing a URL is a one-line edit.

- \`reverse(name, args=..., kwargs=...)\` -> the URL string. Raises \`NoReverseMatch\` if the name is unknown or the arguments do not fit — which surfaces the mistake immediately.
- \`{% url 'name' arg %}\` -> the same in templates.
- \`redirect("name", ...)\` -> an \`HttpResponseRedirect\` to the reversed URL.
- \`Model.get_absolute_url()\` -> a convention many parts of Django (the admin's "view on site", generic views, syndication) call to link to an object.
- \`resolve(path)\` -> the reverse direction: given a URL string, return a \`ResolverMatch\` with the view function, captured \`args\`/\`kwargs\`, \`url_name\`, \`app_name\`, \`namespace\`, and \`route\`. Used by middleware and debugging.

\`\`\`python
# a route change: "p/<slug>/" -> "product/<slug>/"
# BEFORE: every template, view and test that wrote "/shop/p/..." breaks
# AFTER (name-based): change one line in shop/urls.py, done
\`\`\`

## \`APPEND_SLASH\` and trailing slashes

Django URLs conventionally end in \`/\`. With \`CommonMiddleware\` and \`APPEND_SLASH = True\` (the default), a request to \`/shop/cart\` that does not match but \`/shop/cart/\` would, gets a 301 redirect to the slashed version (for GET/HEAD). APIs sometimes set \`APPEND_SLASH = False\` and match both forms explicitly.`,

    contentHi: `## URLconf

Settings mein \`ROOT_URLCONF\` ek module ka naam deता hai (aamताur par \`config.urls\`) jо \`urlpatterns\` naam ki ek list expose karता hai. Har entry ek \`path()\` (ya regex ke liye \`re_path()\`) hai. Har request par Django \`urlpatterns\` ko kram mein chalता hai aur **pehla** pattern istemal karता hai jо path match karता hai. Match -> view call hoता hai. Kahin match nahi -> HTTP 404.

Captured segments view ko **keyword arguments** ki tarah pass hote hain converter naam se match karके: \`path("articles/<int:year>/", views.year_archive)\` \`year_archive(request, year=2024)\` call karता hai.

## Path converters

| Converter | Match | Python type |
|---|---|---|
| \`str\` (default) | \`/\` ke bina koi non-empty string | \`str\` |
| \`int\` | \`[0-9]+\` | \`int\` |
| \`slug\` | ASCII letters/numbers + \`-\` aur \`_\` | \`str\` |
| \`uuid\` | ek formatted UUID | \`uuid.UUID\` |
| \`path\` | koi non-empty string \`/\` **SAHIT** | \`str\` |

Aap custom converters register kar sakte ho \`register_converter\` se. \`re_path\` raw regex par gir jाता hai jab \`path\` kaafi expressive nahi.

## \`include()\` aur app URL modules

Ek monolithic root URLconf scale nahi karता. Har app apna \`urls.py\` ship karता hai, aur root URLconf ise ek prefix ke tahat mount karता hai:

\`\`\`python
# config/urls.py
path("shop/", include("shop.urls")),

# shop/urls.py
app_name = "shop"
urlpatterns = [
    path("", views.index, name="index"),
    path("cart/", views.cart, name="cart"),
]
\`\`\`

\`include()\` matched prefix strip karता hai aur baaki included URLconf ko deता hai.

## Namespacing

Do apps dono ke paas \`"detail"\` naam ki ek URL ho sakti hai. \`shop/urls.py\` mein \`app_name = "shop"\` **application namespace** banाता hai toh aap ise \`"shop:detail"\` ki tarah refer karते ho.

## \`reverse()\`, \`resolve()\`, aur URLs kabhi hard-code na karna

Niyam: **URL patterns bilkul ek jagah likhо (URLconf), aur baaki har jagah unhe naam se refer karो.** Phir ek URL badalना ek-line ka edit hai.

- \`reverse(name, args=..., kwargs=...)\` -> URL string. \`NoReverseMatch\` raise karता hai agar naam anjaan hai ya arguments fit nahi hote.
- \`{% url 'name' arg %}\` -> templates mein wahi.
- \`redirect("name", ...)\` -> reversed URL ko ek \`HttpResponseRedirect\`.
- \`Model.get_absolute_url()\` -> ek convention jise Django ke kai hisse call karते hain.
- \`resolve(path)\` -> ulti disha: ek URL string diye, ek \`ResolverMatch\` lautाता hai view function, captured \`args\`/\`kwargs\`, \`url_name\` ke saath.

## \`APPEND_SLASH\` aur trailing slashes

Django URLs conventionally \`/\` mein khatam hoती hain. \`CommonMiddleware\` aur \`APPEND_SLASH = True\` (default) ke saath, \`/shop/cart\` ki ek request jо match nahi karती par \`/shop/cart/\` karती, ko slashed version par ek 301 redirect milता hai. APIs kabhi-kabhi \`APPEND_SLASH = False\` set karती hain.`,

    examples: [
      {
        title: 'resolve() and reverse() are inverses',
        titleHi: 'resolve() aur reverse() ulTe hain',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], MIDDLEWARE=[], USE_TZ=True)
django.setup()

from django.urls import path, include, reverse, resolve
from django.http import HttpResponse

def index(r): return HttpResponse("i")
def product(r, slug): return HttpResponse(slug)
def order(r, pk): return HttpResponse(str(pk))

shop_patterns = ([
    path("", index, name="index"),
    path("p/<slug:slug>/", product, name="product"),
    path("orders/<int:pk>/", order, name="order"),
], "shop")

urlpatterns = [path("shop/", include(shop_patterns))]

# name -> URL
u = reverse("shop:product", kwargs={"slug": "blue-mug"})
print("reverse:", u)

# URL -> match
m = resolve("/shop/orders/42/")
print("resolve view:", m.func.__name__)
print("resolve kwargs:", m.kwargs, "-- pk is an int:", isinstance(m.kwargs["pk"], int))
print("resolve url_name:", m.url_name, "namespace:", m.namespace)

# round-trip
print("round-trips:", resolve(reverse("shop:order", kwargs={"pk": 7})).kwargs == {"pk": 7})

# a bad reverse fails loudly
try:
    reverse("shop:product")   # missing the slug kwarg
except Exception as e:
    print("bad reverse:", type(e).__name__)`,
        output: `reverse: /shop/p/blue-mug/
resolve view: order
resolve kwargs: {'pk': 42} -- pk is an int: True
resolve url_name: order namespace: shop
round-trips: True
bad reverse: NoReverseMatch`,
        explain: '`reverse("shop:product", kwargs={"slug": ...})` builds the URL from the name and arguments — the one place patterns are written is `urlpatterns`, everywhere else uses the name. `resolve("/shop/orders/42/")` does the inverse: it returns the matched view, the captured kwargs (note `pk` is a real `int` because of the `<int:pk>` converter), and the `url_name`/`namespace`. Because they are inverses, `resolve(reverse(...))` round-trips. A `reverse()` with the wrong arguments raises `NoReverseMatch` immediately — a broken link fails at the call site, not silently in a template.',
        explainHi: '`reverse("shop:product", kwargs={"slug": ...})` naam aur arguments se URL banाता hai — patterns likhे jaते ek jagah `urlpatterns` hai, baaki har jagah naam istemal karता hai. `resolve("/shop/orders/42/")` ulta karता hai: matched view, captured kwargs (dhyaan do `pk` ek asli `int` hai `<int:pk>` converter ke kaaran), aur `url_name`/`namespace` lautाता hai. Kyunki wo ulTe hain, `resolve(reverse(...))` round-trip karता hai. Galat arguments waala `reverse()` turant `NoReverseMatch` raise karता hai.',
      },
      {
        title: 'Order matters, and converters reject the wrong shape',
        titleHi: 'Kram maayne rakhता hai, aur converters galat shape reject karते hain',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], MIDDLEWARE=[], USE_TZ=True)
django.setup()

from django.urls import path, resolve, Resolver404
from django.http import HttpResponse

def create(r): return HttpResponse("create form")
def detail(r, slug): return HttpResponse(f"detail {slug}")
def by_id(r, pk): return HttpResponse(f"id {pk}")

urlpatterns = [
    path("posts/new/", create, name="create"),          # specific -- must be first
    path("posts/id/<int:pk>/", by_id, name="by-id"),
    path("posts/<slug:slug>/", detail, name="detail"),  # general -- last
]

for url in ["/posts/new/", "/posts/hello-world/", "/posts/id/99/", "/posts/id/abc/"]:
    try:
        m = resolve(url)
        print(f"{url:24} -> {m.func.__name__} {m.kwargs}")
    except Resolver404:
        print(f"{url:24} -> 404 (no pattern matched)")`,
        output: `/posts/new/              -> create {}
/posts/hello-world/      -> detail {'slug': 'hello-world'}
/posts/id/99/            -> by_id {'pk': 99}
/posts/id/abc/           -> 404 (no pattern matched)`,
        explain: '`/posts/new/` matches the first pattern; if the `<slug:slug>` line came first it would swallow `new` as a slug and the create form would be unreachable — specific routes go above general ones. `/posts/id/abc/` matches no pattern: `<int:pk>` only accepts digits, so `abc` fails that converter, and `abc` is not `new`, and `id/abc` contains a slash the `<slug>` converter will not cross. A converter mismatch is a non-match (leading to 404), not a 500.',
        explainHi: '`/posts/new/` pehle pattern se match karता hai; agar `<slug:slug>` line pehle aati toh wo `new` ko ek slug ki tarah nigal jाती aur create form unreachable hota — specific routes general ke upar jaते hain. `/posts/id/abc/` kisi pattern se match nahi karता: `<int:pk>` sirf digits accept karता hai. Ek converter mismatch ek non-match hai (404 tak le jाता), ek 500 nahi.',
      },
      {
        title: 'include() mounts an app URLconf under a prefix',
        titleHi: 'include() ek app URLconf ko ek prefix ke tahat mount karता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], MIDDLEWARE=[], USE_TZ=True)
django.setup()

from django.urls import path, include, reverse
from django.http import JsonResponse
from django.test import Client

def health(r): return JsonResponse({"ok": True})
def users(r): return JsonResponse({"users": []})
def user(r, pk): return JsonResponse({"id": pk})

api_v1 = ([
    path("health/", health, name="health"),
    path("users/", users, name="user-list"),
    path("users/<int:pk>/", user, name="user-detail"),
], "v1")

urlpatterns = [
    path("api/v1/", include(api_v1)),
]

c = Client()
print("GET /api/v1/health/ ->", c.get("/api/v1/health/").json())
print("GET /api/v1/users/5/ ->", c.get("/api/v1/users/5/").json())
print("reverse v1:user-detail ->", reverse("v1:user-detail", kwargs={"pk": 5}))
print("unmounted path 404 ->", c.get("/health/").status_code)`,
        output: `GET /api/v1/health/ -> {'ok': True}
GET /api/v1/users/5/ -> {'id': 5}
reverse v1:user-detail -> /api/v1/users/5/
unmounted path 404 -> 404`,
        explain: 'The `api_v1` list is an app-style URLconf with its own names (`health`, `user-list`, `user-detail`) and namespace (`"v1"`). `include("api/v1/", ...)` mounts it: a request to `/api/v1/users/5/` has the `api/v1/` prefix stripped, and the remainder `users/5/` is matched against the included patterns. `reverse("v1:user-detail", ...)` produces the full path including the prefix. The same list could be mounted again at `/api/v2/` with a different namespace. `/health/` without the prefix is a 404 — the patterns only exist under their mount point.',
        explainHi: '`api_v1` list ek app-style URLconf hai apne names aur namespace (`"v1"`) ke saath. `include("api/v1/", ...)` ise mount karता hai: `/api/v1/users/5/` ki ek request se `api/v1/` prefix strip hoता hai, aur baaki `users/5/` included patterns ke khilaaf match hoता hai. `reverse("v1:user-detail", ...)` prefix sahit poora path banाता hai. `/health/` bina prefix ke ek 404 hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# in a view / template / test
return redirect("/blog/" + post.slug + "/")
# href="/blog/{{ post.slug }}/"
self.assertEqual(response.url, "/blog/hello/")`,
        right: `return redirect("blog:detail", slug=post.slug)
# href="{% url 'blog:detail' slug=post.slug %}"
self.assertEqual(response.url, reverse("blog:detail", kwargs={"slug": "hello"}))`,
        why: 'Hard-coded URL strings scattered through views, templates and tests all break the day you change a route, and nothing warns you until a user hits a 404. Referring to routes by name means the pattern lives in exactly one place (the URLconf); a rename is one edit, and a bad name or wrong argument raises `NoReverseMatch` at the call site during development or CI.',
        whyHi: 'Views, templates aur tests mein bikhre hard-coded URL strings sab us din todते hain jab aap ek route badalते ho, aur kuch aapko warn nahi karता jab tak ek user ek 404 nahi maarता. Routes ko naam se refer karna matlab pattern bilkul ek jagah rehता hai; ek rename ek edit hai, aur ek galat naam `NoReverseMatch` raise karता hai.',
      },
      {
        wrong: `urlpatterns = [
    path("users/<str:username>/", views.profile),
    path("users/me/", views.my_profile),          # UNREACHABLE -- "me" matched as username above
]`,
        right: `urlpatterns = [
    path("users/me/", views.my_profile),          # specific route FIRST
    path("users/<str:username>/", views.profile), # general route AFTER
]`,
        why: 'Django matches top to bottom and stops at the first hit. A general capturing pattern placed above a specific literal one will match the literal path too — here `/users/me/` is handled by `profile` with `username="me"`, and `my_profile` is dead code. Always order routes most-specific first.',
        whyHi: 'Django upar se neeche match karता hai aur pehle hit par rukता hai. Ek specific literal ke upar rakha ek general capturing pattern literal path ko bhi match karega — yahaan `/users/me/` `profile` dwara handle hoता hai `username="me"` ke saath. Hamesha routes most-specific pehle order karो.',
      },
      {
        wrong: `# blog/urls.py -- forgot app_name, or root didn't set a namespace
urlpatterns = [path("<slug:slug>/", views.detail, name="detail")]
# now two apps both define name="detail" -> reverse("detail") is ambiguous / wrong`,
        right: `# blog/urls.py
app_name = "blog"
urlpatterns = [path("<slug:slug>/", views.detail, name="detail")]
# reverse("blog:detail", kwargs={"slug": s})  -- unambiguous`,
        why: 'Without an application namespace, URL names are global and collide: a project with `blog`, `shop` and `docs` apps each naming a view `"detail"` cannot reliably `reverse("detail")`. Set `app_name` in every app\'s `urls.py` and always reverse with the `"app:name"` form. It also makes `reverse` calls self-documenting about which app they target.',
        whyHi: 'Ek application namespace ke bina, URL names global hain aur collide karते hain: `blog`, `shop` aur `docs` apps waala ek project har ek ek view ko `"detail"` naam deता `reverse("detail")` vishwasniya roop se nahi kar sakta. Har app ke `urls.py` mein `app_name` set karो aur hamesha `"app:name"` form se reverse karो.',
      },
    ],

    realWorld: [
      {
        en: '**DRF routers generate the URLconf for you** — `router.register("orders", OrderViewSet)` produces `orders/`, `orders/<pk>/`, and named routes (`order-list`, `order-detail`) automatically, then `path("api/", include(router.urls))` mounts them. Module 5 covers this; the `path`/`include`/`reverse` mechanics here are what the router builds on.',
        hi: '**DRF routers aapke liye URLconf generate karते hain** — `router.register("orders", OrderViewSet)` `orders/`, `orders/<pk>/`, aur named routes apne aap banाता hai, phir `path("api/", include(router.urls))` unhe mount karता hai. Module 5 ise cover karता hai.',
      },
      {
        en: '**`Model.get_absolute_url()` + `reverse()` power "view on site" in the admin, sitemaps, feeds, and generic `CreateView`/`UpdateView` redirects** — define it once on the model and many framework features link to your objects correctly. Tests use `reverse()` so a route change never silently breaks the suite.',
        hi: '**`Model.get_absolute_url()` + `reverse()` admin mein "view on site", sitemaps, feeds, aur generic `CreateView`/`UpdateView` redirects ko power dete hain** — ise model par ek baar define karो aur kai framework features aapke objects ko sahi link karते hain. Tests `reverse()` istemal karते hain.',
      },
      {
        en: '**Versioned API prefixes (`/api/v1/`, `/api/v2/`) are just two `include()`s with different namespaces** — often the same viewset list mounted twice while v2 is stabilised, or separate `api/v1/urls.py` and `api/v2/urls.py` modules. `APPEND_SLASH=False` is common on API URLconfs so clients get a clean 404 rather than a 301 that drops the request body.',
        hi: '**Versioned API prefixes (`/api/v1/`, `/api/v2/`) bस alag namespaces waale do `include()`s hain** — aksar wahi viewset list do baar mount jabki v2 stabilise hoती hai. API URLconfs par `APPEND_SLASH=False` aam hai taaki clients ek saaf 404 paayें ek 301 ke bजाय jо request body drop karता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How does Django route a request, and how do `path` converters and `include()` fit in?',
        qHi: 'Django ek request kaise route karता hai, aur `path` converters aur `include()` kaise fit hote hain?',
        a: 'The ROOT_URLCONF setting names a module that exposes a list called urlpatterns. On each request Django takes the path portion of the URL, strips the leading slash, and walks urlpatterns in order, testing each pattern against the path. It uses the first one that matches — order is significant, and there is no "best match", just first match. If a pattern matches, its view is called; if nothing in the entire tree matches, Django returns a 404. A pattern is created with path, whose route string can contain typed segments in angle brackets, like int colon year or slug colon slug. When such a segment matches, the captured text is converted to a Python type by the converter — int gives you an actual integer, uuid gives a UUID object, slug and str give strings, path matches greedily including slashes — and the value is passed to the view as a keyword argument with that name. A converter that does not match, like letters where int expects digits, simply makes the pattern not match, so resolution continues to the next pattern and possibly ends in a 404, never a 500. include lets a pattern delegate: instead of a view, you give it another URLconf, typically an app\'s urls module. Django strips the prefix that matched and hands the remainder of the path to the included patterns. This is how each app keeps its own routing in its own file, and how you mount an app under a prefix, or the same app under two prefixes for API versioning. Alongside routing you have the reverse operation: every pattern can have a name, and reverse, or the url template tag, turns a name plus arguments back into a URL string, so URLs are written once in the URLconf and referenced by name everywhere else. resolve is the other direction, turning a URL string into a match object describing which view and arguments it corresponds to.',
        aHi: 'ROOT_URLCONF setting ek module ka naam deता hai jо urlpatterns naam ki ek list expose karता hai. Har request par Django URL ka path hissa leता hai, leading slash strip karता hai, aur urlpatterns ko kram mein chalता hai, har pattern ko path ke khilaaf test karते hue. Ye pehला istemal karता hai jо match karता hai — kram mahatvapoorn hai, koi "best match" nahi, bस first match. Agar ek pattern match karता hai, iska view call hoता hai; agar kuch match nahi karता, Django ek 404 lautाता hai. Ek pattern path se banта hai, jiska route string angle brackets mein typed segments rakh sakta hai. Jab ऐसा ek segment match karता hai, captured text ek Python type mein convert hoता hai converter dwara — int aapko ek asli integer deता hai — aur value view ko us naam ke ek keyword argument ki tarah pass hoती hai. Ek converter jо match nahi karता pattern ko match na hone deता hai, toh resolution agle pattern par jारी rehта hai, kabhi ek 500 nahi. include ek pattern ko delegate karne deता hai: ek view ke bजाय, aap ise doosra URLconf dete ho. Django matched prefix strip karता hai aur baaki path included patterns ko deता hai.',
      },
      {
        q: 'Why should you never hard-code URLs, and what does name-based routing give you?',
        qHi: 'Aapko URLs kabhi hard-code kyun nahi karna chahiye, aur name-based routing aapko kya deता hai?',
        a: 'Hard-coding a URL means writing the literal path string — slash blog slash then the slug then a slash — in a view redirect, a template link, a serialized response, or a test assertion. The problem is that the true definition of that URL lives in the URLconf, and now you have copies of it scattered across the codebase that the framework does not know about. The day you change the route — add a version prefix, rename a segment, restructure the app — the URLconf is updated but every hard-coded copy silently still points at the old path. Nothing errors at deploy; users just start hitting 404s, and you find them one bug report at a time. Name-based routing fixes this by making the URLconf the single source of truth. Each pattern gets a name, scoped by the app namespace, and everywhere else you refer to the route by that name: reverse in Python code, the url tag in templates, redirect with a route name, get_absolute_url on the model, and reverse in tests. Django looks up the current pattern for that name and builds the URL from it, filling in the arguments you supply. So a route change is a one-line edit in the URLconf and everything that referenced it by name follows automatically. There is also a correctness benefit: if you call reverse with a name that does not exist or arguments that do not fit the pattern, it raises NoReverseMatch right there, during development or in CI, instead of producing a subtly wrong string. And reverse calls document intent — reverse of shop colon product tells the reader which app and which route, where a raw string does not.',
        aHi: 'Ek URL hard-code karna matlab literal path string likhna — slash blog slash phir slug phir ek slash — ek view redirect, ek template link, ya ek test assertion mein. Samasya ye hai ki us URL ki asli paribhaasha URLconf mein rehती hai, aur ab aapke paas iski copies codebase mein bikhri hain jinke baare mein framework nahi jaanता. Jis din aap route badalते ho, URLconf update hoता hai par har hard-coded copy chupchaap abhi bhi purane path par point karती hai. Deploy par kuch error nahi; users bस 404s maarना shuru karते hain. Name-based routing ise URLconf ko single source of truth banाकर theek karता hai. Har pattern ko ek naam milता hai, app namespace se scoped, aur baaki har jagah aap route ko us naam se refer karते ho. Ek route change URLconf mein ek-line ka edit hai. Ek correctness faayda bhi hai: agar aap reverse ko ek naam ke saath call karते ho jо maujूd nahi, ye wahीं NoReverseMatch raise karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Configure Django with `ROOT_URLCONF=__name__`. Build `urlpatterns` with: `path("", home, name="home")`, `path("articles/<int:year>/", year_view, name="year")`, `path("articles/<slug:slug>/", article_view, name="article")`. Use `resolve()` on `/`, `/articles/2024/`, `/articles/my-post/`, and `/articles/2024/extra/` and print the matched view name (or "404"). Confirm `year` captures an `int`.',
        taskHi: 'Django ko `ROOT_URLCONF=__name__` ke saath configure karो. `urlpatterns` banाओ: `path("", home, name="home")`, `path("articles/<int:year>/", year_view, name="year")`, `path("articles/<slug:slug>/", article_view, name="article")`. `/`, `/articles/2024/`, `/articles/my-post/`, aur `/articles/2024/extra/` par `resolve()` istemal karो.',
        hint: '`from django.urls import resolve, Resolver404`. `try: resolve(url).func.__name__ except Resolver404: "404"`. `/articles/2024/extra/` matches nothing — no pattern has that trailing segment. `resolve("/articles/2024/").kwargs["year"]` is `2024` (an `int`).',
        hintHi: '`from django.urls import resolve, Resolver404`. `try: resolve(url).func.__name__ except Resolver404: "404"`. `/articles/2024/extra/` kuch match nahi karта.',
      },
      {
        task: 'Build a namespaced app URLconf as a `(list, "shop")` tuple with names `index`, `product` (`<slug:slug>`), `order` (`<int:pk>`). Mount it with `include()` under `"shop/"`. Then: `reverse("shop:product", kwargs={"slug": "x"})`, `reverse("shop:order", kwargs={"pk": 3})`, and confirm `resolve(reverse("shop:order", kwargs={"pk": 3})).kwargs == {"pk": 3}`. Also show `reverse("shop:order")` (no pk) raises `NoReverseMatch`.',
        taskHi: 'Ek namespaced app URLconf ek `(list, "shop")` tuple ki tarah banाओ names `index`, `product`, `order` ke saath. Ise `include()` se `"shop/"` ke tahat mount karो. Phir `reverse` calls karो aur `resolve(reverse(...))` round-trip confirm karो.',
        hint: '`urlpatterns = [path("shop/", include(([...], "shop")))]`. `reverse("shop:order", kwargs={"pk": 3})` -> `"/shop/orders/3/"` (or whatever your route is). Wrap the bad `reverse` in `try/except NoReverseMatch`.',
        hintHi: '`urlpatterns = [path("shop/", include(([...], "shop")))]`. Bad `reverse` ko `try/except NoReverseMatch` mein wrap karो.',
      },
      {
        task: 'Demonstrate the ordering trap. Build `urlpatterns` with `path("p/<slug:slug>/", detail)` BEFORE `path("p/featured/", featured)`. Use `django.test.Client` to GET `/p/featured/` and show it hits `detail` with `slug="featured"`. Then swap the order and show `/p/featured/` now hits `featured`. Print which view handled it in each case.',
        taskHi: 'Ordering trap dikhाओ. `urlpatterns` banाओ `path("p/<slug:slug>/", detail)` ko `path("p/featured/", featured)` se PEHLE. `/p/featured/` GET karो aur dikhाओ ye `detail` ko `slug="featured"` ke saath hit karता hai. Phir order swap karो.',
        hint: 'Have each view return `HttpResponse(f"detail:{slug}")` / `HttpResponse("featured")` so the body tells you which ran. With the general route first, the literal route is unreachable.',
        hintHi: 'Har view ko `HttpResponse(f"detail:{slug}")` / `HttpResponse("featured")` return karवाओ. General route pehle ke saath, literal route unreachable hai.',
      },
    ],

    keyTakeaways: [
      '`ROOT_URLCONF` names a module with `urlpatterns`. Django walks it IN ORDER and uses the FIRST `path()` that matches the request path. No match anywhere -> 404. Specific routes must go ABOVE general capturing ones.',
      '`path("route/<converter:name>/", view, name=...)`: captured segments are passed to the view as KEYWORD ARGUMENTS. Converters: `str` (default, no `/`), `int` (-> `int`), `slug`, `uuid` (-> `UUID`), `path` (includes `/`). `re_path` for raw regex.',
      'A converter mismatch (letters for `<int>`) is a NON-MATCH -> falls through to 404, never a 500.',
      '`include("app.urls")` mounts an app\'s URLconf under a prefix: the prefix is stripped and the remainder matched against the included patterns. Each app keeps its routing in its own `urls.py`.',
      '`app_name = "shop"` in an app\'s `urls.py` creates an application namespace -> refer to routes as `"shop:detail"`. Without it, names are global and collide across apps.',
      'NEVER hard-code URL strings. Write patterns once in the URLconf; refer to them by name everywhere: `reverse("app:name", kwargs=...)`, `{% url %}`, `redirect("app:name", ...)`, `Model.get_absolute_url()`. A route change becomes a one-line edit.',
      '`reverse(name, ...)` -> URL string (raises `NoReverseMatch` on bad name/args, catching the mistake immediately). `resolve(path)` -> `ResolverMatch` (view func, `args`/`kwargs`, `url_name`, `namespace`). They are inverses.',
      '`APPEND_SLASH=True` (default, with `CommonMiddleware`) 301-redirects `/path` -> `/path/` when only the slashed form matches. APIs often set `APPEND_SLASH=False`.',
    ],
    keyTakeawaysHi: [
      '`ROOT_URLCONF` `urlpatterns` waale ek module ka naam deता hai. Django ise KRAM MEIN chalता hai aur PEHLा `path()` istemal karता hai jо request path match karता hai. Kahin match nahi -> 404. Specific routes general capturing ke UPAR jaने chahिए.',
      '`path("route/<converter:name>/", view, name=...)`: captured segments view ko KEYWORD ARGUMENTS ki tarah pass hote hain. Converters: `str` (default), `int` (-> `int`), `slug`, `uuid` (-> `UUID`), `path` (`/` sahit).',
      'Ek converter mismatch (`<int>` ke liye letters) ek NON-MATCH hai -> 404 tak gir jाता hai, kabhi ek 500 nahi.',
      '`include("app.urls")` ek app ke URLconf ko ek prefix ke tahat mount karता hai: prefix strip hoता hai aur baaki included patterns ke khilaaf match hoता hai.',
      'Ek app ke `urls.py` mein `app_name = "shop"` ek application namespace banाता hai -> routes ko `"shop:detail"` ki tarah refer karो. Iske bina, names global hain aur apps ke paar collide karते hain.',
      'URL strings KABHI hard-code mat karो. Patterns URLconf mein ek baar likhо; unhe naam se refer karो: `reverse("app:name", kwargs=...)`, `{% url %}`, `redirect(...)`, `Model.get_absolute_url()`.',
      '`reverse(name, ...)` -> URL string (`NoReverseMatch` raise karता hai galat naam/args par). `resolve(path)` -> `ResolverMatch`. Wo ulTe hain.',
      '`APPEND_SLASH=True` (default) `/path` -> `/path/` 301-redirect karता hai jab sirf slashed form match karता hai. APIs aksar `APPEND_SLASH=False` set karती hain.',
    ],
  },
];
