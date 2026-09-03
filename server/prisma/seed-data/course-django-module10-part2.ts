/**
 * Django Complete Course — Module 10: Testing, Settings & Production Deployment, lessons 4-6.
 *
 * Lesson 4: static files & STORAGES — STATIC_URL / STATIC_ROOT / STATICFILES_DIRS,
 *           collectstatic, the STORAGES setting (Django 4.2+), ManifestStaticFilesStorage
 *           (content hashing + staticfiles.json), WhiteNoise vs a CDN, MEDIA_ vs STATIC_,
 *           django-storages / S3 for user uploads.
 * Lesson 5: WSGI / ASGI & deployment — the WSGI vs ASGI callable, Gunicorn (workers /
 *           timeout / max-requests / worker classes), Uvicorn for async, Nginx in front,
 *           a Dockerfile (multi-stage, non-root, collectstatic at build), docker-compose,
 *           .dockerignore, running migrate in a release phase not the web process.
 * Lesson 6: zero-downtime migrations & async views — additive-only during a rolling deploy,
 *           the add-nullable -> deploy -> backfill -> add-constraint -> drop-column sequence,
 *           makemigrations --check as a CI gate, SeparateDatabaseAndState, never rename in
 *           one step; async def views, sync_to_async / async_to_sync, when async helps.
 *
 * Conventions: see course-django-module10.ts header. collectstatic examples use
 * override_settings + a real temp static dir + call_command("collectstatic", "--noinput").
 * ManifestStaticFilesStorage hashes are content-based and deterministic (MD5 of the file):
 * "body{color:red}" -> app.6700e3e57796.css. Deployment examples introspect the WSGI/ASGI
 * application objects and exec() a gunicorn.conf.py (a config file is plain Python).
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_10_PART2: CourseLesson[] = [
  {
    slug: 'dj-static-files-and-storages',
    title: 'Static Files, `collectstatic` & the `STORAGES` Setting',
    titleHi: 'Static Files, `collectstatic` & `STORAGES` Setting',
    description: 'Django serves your CSS/JS/images itself only in development. For production you run `collectstatic` to gather every static file into one directory, then a hashing storage renames each to `app.<hash>.css` so browsers can cache it forever, and WhiteNoise or a CDN serves it — never the Django process.',
    descriptionHi: 'Django aapke CSS/JS/images ko sirf development mein khud serve karta hai. Production ke liye aap `collectstatic` chalate ho har static file ko ek directory mein ikattha karne ko, phir ek hashing storage har ek ko `app.<hash>.css` rename karta hai taaki browsers ise hamesha ke liye cache kar sakein, aur WhiteNoise ya ek CDN ise serve karta hai — kabhi Django process nahi.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 4,

    analogy: {
      en: '**A print shop preparing a catalogue.** During design (development) the artwork is scattered across a dozen folders — one per app — and the designer pulls each image from wherever it lives. To actually print (deploy), you first do a **gather pass**: copy every final asset into one production folder (`collectstatic`). Then each file gets a **checksum stamped into its name** — `logo.a1b2c3.png` — so the printer, the warehouse, and every reprint know that *this exact bytes* is version a1b2c3; change one pixel and the name changes, so an old cached copy is never mistaken for the new one (`ManifestStaticFilesStorage` + the manifest that maps `logo.png` → `logo.a1b2c3.png`). Finally, the printed catalogues ship from a distribution warehouse near the customers (a CDN / WhiteNoise), not from the designer\'s desk — the designer (your Django process) should be drawing, not handing out copies one at a time.',
      hi: '**Ek print shop ek catalogue taiyaar kar rahi hai.** Design ke dauran (development) artwork ek dozen folders mein bikhra hai — prati app ek — aur designer har image ko jahaan wo rehti hai wahaan se kheenchta hai. Asal mein print karne ke liye (deploy), aap pehle ek **gather pass** karte ho: har final asset ko ek production folder mein copy karo (`collectstatic`). Phir har file ko iske naam mein **ek checksum stamped** milta hai — `logo.a1b2c3.png` — taaki printer aur har reprint jaane ki *ye exact bytes* version a1b2c3 hai; ek pixel badlo aur naam badalta hai, toh ek purani cached copy ko kabhi naye ke liye galat nahi samjha jaata. Aakhir mein, printed catalogues customers ke paas ek distribution warehouse se ship hote hain (ek CDN / WhiteNoise), designer ke desk se nahi.',
    },

    simple: `**The settings**

\`\`\`python
STATIC_URL  = "/static/"                        # the URL prefix browsers request
STATIC_ROOT = BASE_DIR / "staticfiles"          # where collectstatic DUMPS everything (prod)
STATICFILES_DIRS = [BASE_DIR / "assets"]        # project-level source dirs (besides each app/static/)

# Django 4.2+ : one STORAGES dict for both static and media
STORAGES = {
    "default": {                                # MEDIA -- user uploads
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {                            # STATIC -- your CSS/JS
        "BACKEND": "django.contrib.staticfiles.storage.ManifestStaticFilesStorage",
    },
}

MEDIA_URL  = "/media/"
MEDIA_ROOT = BASE_DIR / "media"                 # user uploads land here (dev)
\`\`\`

\`\`\`
STATIC   -- ships WITH your code (CSS, JS, icons, admin assets). Versioned, cacheable forever.
MEDIA    -- uploaded BY users at runtime (avatars, attachments). Never trust, never execute.
Django's dev server auto-serves STATIC when DEBUG=True. In production it serves NOTHING static.
\`\`\`

**\`collectstatic\` — the gather step**

\`\`\`bash
python manage.py collectstatic --noinput
# walks every app's static/ + STATICFILES_DIRS, copies all of it into STATIC_ROOT.
# run it: in the Docker build, or the release phase -- NOT at request time.
\`\`\`

**\`ManifestStaticFilesStorage\` — hash the filenames**

\`\`\`
input:   app.css   (contents: "body{color:red}")
output:  app.css                       (kept)
         app.6700e3e57796.css          (hashed copy -- the hash is MD5 of the content)
         staticfiles.json              {"paths": {"app.css": "app.6700e3e57796.css"}}
\`\`\`

\`\`\`
{% load static %}{% static "app.css" %}  ->  /static/app.6700e3e57796.css
change one byte of app.css  ->  new hash  ->  new URL  ->  browsers fetch the new file
unchanged file  ->  same hash  ->  same URL  ->  served from cache with a 1-year max-age
missing file referenced in CSS/JS  ->  collectstatic FAILS the build (a good thing)
\`\`\`

**Who actually serves the bytes**

\`\`\`
WhiteNoise    middleware that serves STATIC_ROOT straight from the Python process, gzip/brotli
              + far-future caching. Good default; one dependency, no extra infra.
              MIDDLEWARE = [..., "whitenoise.middleware.WhiteNoiseMiddleware", ...]  (right after Security)
S3 + CloudFront   collectstatic uploads to the bucket (django-storages S3 backend);
              the CDN serves it. Best for scale / many edge locations.
NEVER          a Django view / the WSGI worker serving static files in production.
\`\`\`

**Media (user uploads)**

\`\`\`python
STORAGES["default"]["BACKEND"] = "storages.backends.s3.S3Storage"   # django-storages
# FileField / ImageField uploads go to S3; the app stores only the key.
# serve media via signed URLs or a separate host -- never from STATIC_ROOT, never executable.
\`\`\``,

    simpleHi: `**Settings**

\`\`\`python
STATIC_URL  = "/static/"                        # browsers jo URL prefix request karte hain
STATIC_ROOT = BASE_DIR / "staticfiles"          # jahaan collectstatic sab DUMP karta hai (prod)
STATICFILES_DIRS = [BASE_DIR / "assets"]        # project-level source dirs

# Django 4.2+ : static aur media dono ke liye ek STORAGES dict
STORAGES = {
    "default": {                                # MEDIA -- user uploads
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {                            # STATIC -- aapke CSS/JS
        "BACKEND": "django.contrib.staticfiles.storage.ManifestStaticFilesStorage",
    },
}

MEDIA_URL  = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
\`\`\`

\`\`\`
STATIC   -- aapke code KE SAATH ship hota hai (CSS, JS, icons, admin assets). Versioned, cacheable.
MEDIA    -- runtime par users DWARA uploaded (avatars, attachments). Kabhi trust nahi, kabhi execute nahi.
Django ka dev server DEBUG=True par STATIC auto-serve karta hai. Production mein KUCH static serve nahi karta.
\`\`\`

**\`collectstatic\` — gather step**

\`\`\`bash
python manage.py collectstatic --noinput
# har app ke static/ + STATICFILES_DIRS ko walk karta hai, sab STATIC_ROOT mein copy karta hai.
# ise chalao: Docker build mein, ya release phase mein -- request time par NAHI.
\`\`\`

**\`ManifestStaticFilesStorage\` — filenames hash karo**

\`\`\`
input:   app.css   (contents: "body{color:red}")
output:  app.css                       (rakha)
         app.6700e3e57796.css          (hashed copy -- hash content ka MD5 hai)
         staticfiles.json              {"paths": {"app.css": "app.6700e3e57796.css"}}
\`\`\`

\`\`\`
{% load static %}{% static "app.css" %}  ->  /static/app.6700e3e57796.css
app.css ka ek byte badlo  ->  naya hash  ->  naya URL  ->  browsers naya file fetch karte hain
unchanged file  ->  same hash  ->  same URL  ->  1-year max-age ke saath cache se served
CSS/JS mein referenced ek missing file  ->  collectstatic build FAIL karta hai (achhी cheez)
\`\`\`

**Bytes asal mein kaun serve karta hai**

\`\`\`
WhiteNoise    middleware jo STATIC_ROOT ko seedhe Python process se serve karta hai, gzip/brotli
              + far-future caching. Achhा default; ek dependency, koi extra infra nahi.
              MIDDLEWARE = [..., "whitenoise.middleware.WhiteNoiseMiddleware", ...]  (Security ke theek baad)
S3 + CloudFront   collectstatic bucket ko upload karta hai (django-storages S3 backend);
              CDN ise serve karta hai. Scale / many edge locations ke liye best.
KABHI NAHI    ek Django view / WSGI worker production mein static files serve karta hua.
\`\`\`

**Media (user uploads)**

\`\`\`python
STORAGES["default"]["BACKEND"] = "storages.backends.s3.S3Storage"   # django-storages
# FileField / ImageField uploads S3 par jaate hain; app sirf key store karta hai.
# media ko signed URLs ya ek alag host ke zariye serve karo -- kabhi STATIC_ROOT se nahi.
\`\`\``,

    content: `## Static vs media

Two completely different things that both involve files on disk:

- **Static files** ship *with your code*: your CSS, JavaScript, images, fonts, plus the admin's and DRF's own assets. They are versioned in git, identical across environments, and safe to cache aggressively.
- **Media files** are *uploaded by users at runtime*: profile pictures, document attachments, CSV imports. They are untrusted (never execute an uploaded file, sanitise filenames, validate content types) and they must not live in the same place as static files.

## The static-file pipeline

**In development** (\`DEBUG = True\`), \`django.contrib.staticfiles\` auto-serves static files: a request for \`/static/app/logo.png\` is resolved by walking every app's \`static/\` directory and \`STATICFILES_DIRS\`. Convenient, slow, and **disabled when \`DEBUG = False\`** — the dev server refuses to serve static in production mode, and \`runserver\` is not a production server anyway.

**In production** you run one command at build/release time:

\`\`\`bash
python manage.py collectstatic --noinput
\`\`\`

It copies every static file it can find — each app's \`static/\`, each entry in \`STATICFILES_DIRS\` — into a single directory, **\`STATIC_ROOT\`**. That directory is then what your static server (WhiteNoise, nginx, or an upload to S3) serves. \`collectstatic\` belongs in the Docker image build or a release phase — never at request time.

## \`STATIC_URL\`, \`STATIC_ROOT\`, \`STATICFILES_DIRS\`

- **\`STATIC_URL = "/static/"\`** — the URL prefix. \`{% static "app/logo.png" %}\` renders \`/static/app/logo.png\` (or the hashed name).
- **\`STATIC_ROOT\`** — the *output* directory \`collectstatic\` fills. Must be outside your source dirs; it is generated, gitignored, and only exists after \`collectstatic\` runs.
- **\`STATICFILES_DIRS\`** — extra *input* directories beyond each app's \`static/\` — a project-level \`assets/\` or a frontend build output. \`STATIC_ROOT\` must **not** be in this list (a self-copy loop).

## The \`STORAGES\` setting (Django 4.2+)

One dict configures both file domains:

\`\`\`python
STORAGES = {
    "default":     {"BACKEND": "..."},   # media / FileField / ImageField / default_storage
    "staticfiles": {"BACKEND": "..."},   # what collectstatic writes through + how {% static %} resolves
}
\`\`\`

(Older projects use \`DEFAULT_FILE_STORAGE\` and \`STATICFILES_STORAGE\` — the \`STORAGES\` dict replaces both.)

## \`ManifestStaticFilesStorage\` — cache-busting

The problem: you want browsers to cache \`app.css\` for a year, but then a deploy changes it and users keep the stale copy. The fix is **content-hashed filenames**. \`ManifestStaticFilesStorage\` (the recommended static backend) does this during \`collectstatic\`:

1. For each file, compute a hash of its contents and write a copy named \`app.<hash>.css\` alongside the original.
2. Rewrite references *inside* CSS/JS (\`url(...)\`, \`@import\`, source maps) to point at the hashed names.
3. Write **\`staticfiles.json\`** — a manifest mapping \`app.css\` → \`app.6700e3e57796.css\`.
4. \`{% static "app.css" %}\` now reads the manifest and outputs \`/static/app.6700e3e57796.css\`.

Now every static URL is immutable: the same content always has the same URL (served with \`Cache-Control: max-age=31536000, immutable\`), and any change produces a new URL that browsers fetch fresh. A **missing** file referenced from CSS/JS makes \`collectstatic\` **fail** — which catches a broken asset reference at build time instead of a 404 in production. (\`ManifestStaticFilesStorage\` is strict about this; there is a non-strict variant if you need it.)

## Who serves the bytes

Never the Django/WSGI process directly for each file. Options:

- **WhiteNoise** — a middleware (\`whitenoise.middleware.WhiteNoiseMiddleware\`, placed right after \`SecurityMiddleware\`) that serves \`STATIC_ROOT\` efficiently: it pre-compresses to gzip/brotli at \`collectstatic\` time, sets far-future cache headers for hashed files, and streams from disk. Zero extra infrastructure, one dependency — the right default for most deployments, and it works fine behind a CDN.
- **A CDN in front of WhiteNoise** — CloudFront/Cloudflare caches the (already immutable) static responses at the edge; origin traffic for static drops to near zero.
- **S3 + CloudFront** — configure the \`staticfiles\` storage as \`django-storages\`' S3 backend; \`collectstatic\` *uploads* to the bucket, and the CDN serves from S3. Best when you have many origins/regions or want static fully decoupled from app servers.

## Media

User uploads go through the \`"default"\` storage. In production that is almost always **object storage** (\`django-storages\` with S3/GCS/Azure), not the local disk — local disk does not survive a container restart, does not scale past one host, and mixing uploads with your code is an attack surface. A \`FileField\`/\`ImageField\` then stores only the key; you serve the file via a time-limited signed URL or a dedicated media host. Never serve media from \`STATIC_ROOT\`, never from a path where it could be executed, and always validate the upload (size, content type, image dimensions).`,

    contentHi: `## Static vs media

Do bilkul alag cheezein jinme dono disk par files shamil hain:

- **Static files** *aapke code ke saath* ship hote hain: aapka CSS, JavaScript, images, fonts, plus admin aur DRF ke apne assets. Wo git mein versioned hain, environments ke paar identical, aur aggressively cache karne ke liye safe.
- **Media files** *runtime par users dwara uploaded* hain: profile pictures, document attachments. Wo untrusted hain (ek uploaded file kabhi execute mat karo, filenames sanitise karo) aur wo static files ki usi jagah nahi rehne chahिए.

## Static-file pipeline

**Development mein** (\`DEBUG = True\`), \`django.contrib.staticfiles\` static files auto-serve karta hai. Suvidhajanak, dheema, aur **\`DEBUG = False\` par disabled** — dev server production mode mein static serve karne se mana karta hai.

**Production mein** aap build/release time par ek command chalate ho:

\`\`\`bash
python manage.py collectstatic --noinput
\`\`\`

Ye har static file jo ise mil sakti hai copy karta hai — har app ka \`static/\`, \`STATICFILES_DIRS\` ki har entry — ek single directory mein, **\`STATIC_ROOT\`**. \`collectstatic\` Docker image build ya ek release phase mein hai — kabhi request time par nahi.

## \`STATIC_URL\`, \`STATIC_ROOT\`, \`STATICFILES_DIRS\`

- **\`STATIC_URL = "/static/"\`** — URL prefix.
- **\`STATIC_ROOT\`** — *output* directory jo \`collectstatic\` bharta hai. Aapke source dirs ke bahar hona chahिए; ye generated, gitignored hai.
- **\`STATICFILES_DIRS\`** — har app ke \`static/\` se aage extra *input* directories. \`STATIC_ROOT\` is list mein **nahi** hona chahिए.

## \`STORAGES\` setting (Django 4.2+)

Ek dict dono file domains configure karta hai: \`"default"\` (media) aur \`"staticfiles"\` (static). (Purane projects \`DEFAULT_FILE_STORAGE\` aur \`STATICFILES_STORAGE\` istemal karte hain — \`STORAGES\` dict dono replace karta hai.)

## \`ManifestStaticFilesStorage\` — cache-busting

Problem: aap chahte ho browsers \`app.css\` ko ek saal cache karein, par phir ek deploy ise badalta hai aur users stale copy rakhते hain. Fix **content-hashed filenames** hai. Ye \`collectstatic\` ke dauran:

1. Har file ke liye, iske contents ka ek hash compute karo aur \`app.<hash>.css\` naam ki ek copy likho.
2. CSS/JS ke *andar* references ko hashed names par point karne ko rewrite karo.
3. **\`staticfiles.json\`** likho — ek manifest.
4. \`{% static "app.css" %}\` ab manifest padhta hai aur \`/static/app.6700e3e57796.css\` output karta hai.

Ab har static URL immutable hai. Ek CSS/JS se referenced **missing** file \`collectstatic\` ko **fail** karता hai — jo build time par ek broken asset reference pakadta hai.

## Bytes kaun serve karta hai

Kabhi Django/WSGI process seedhे har file ke liye nahi. Options:

- **WhiteNoise** — ek middleware jo \`STATIC_ROOT\` ko efficiently serve karta hai: \`collectstatic\` time par gzip/brotli mein pre-compress, hashed files ke liye far-future cache headers. Zero extra infrastructure — zyादातr deployments ke liye sahi default.
- **WhiteNoise ke aage ek CDN** — CloudFront/Cloudflare edge par static responses cache karta hai.
- **S3 + CloudFront** — \`staticfiles\` storage ko \`django-storages\` S3 backend ke roop mein configure karo; \`collectstatic\` bucket ko *upload* karta hai.

## Media

User uploads \`"default"\` storage se guzarte hain. Production mein wo lगbhag hamesha **object storage** (S3/GCS ke saath \`django-storages\`) hai, local disk nahi — local disk ek container restart nahi jhelता. Ek \`FileField\`/\`ImageField\` phir sirf key store karta hai; aap file ko ek time-limited signed URL ke zariye serve karte ho. Kabhi media ko \`STATIC_ROOT\` se serve mat karo, aur hamesha upload validate karo.`,

    examples: [
      {
        title: 'collectstatic gathers files; ManifestStaticFilesStorage hashes them + writes the manifest',
        titleHi: 'collectstatic files ikattha karta hai; ManifestStaticFilesStorage unhe hash karta hai + manifest likhta hai',
        code: `import django, tempfile, os, io, json
from django.conf import settings
settings.configure(SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.staticfiles"])
django.setup()

from django.test import override_settings
from django.core.management import call_command

src = tempfile.mkdtemp()
open(os.path.join(src, "app.css"), "w").write("body{color:red}")
open(os.path.join(src, "app.js"), "w").write("console.log(1)")
dest = tempfile.mkdtemp()

with override_settings(
    STATIC_URL="/static/",
    STATIC_ROOT=dest,
    STATICFILES_DIRS=[src],
    STORAGES={
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.ManifestStaticFilesStorage"},
    },
):
    call_command("collectstatic", "--noinput", verbosity=0, stdout=io.StringIO())

    produced = sorted(f for f in os.listdir(dest))
    print("in STATIC_ROOT:", produced)

    manifest = json.load(open(os.path.join(dest, "staticfiles.json")))
    print("manifest version:", manifest["version"])
    print("app.css  ->", manifest["paths"]["app.css"])
    print("app.js   ->", manifest["paths"]["app.js"])

    # the hash is content-based: the same bytes always produce the same name, every build
    print("hashed name is deterministic (MD5 of 'body{color:red}'):",
          manifest["paths"]["app.css"] == "app.6700e3e57796.css")`,
        output: `in STATIC_ROOT: ['app.6114f5adc373.js', 'app.6700e3e57796.css', 'app.css', 'app.js', 'staticfiles.json']
manifest version: 1.1
app.css  -> app.6700e3e57796.css
app.js   -> app.6114f5adc373.js
hashed name is deterministic (MD5 of 'body{color:red}'): True`,
        explain: 'collectstatic walks STATICFILES_DIRS and copies app.css and app.js into STATIC_ROOT. Because the staticfiles storage is ManifestStaticFilesStorage, it also writes a content-hashed copy of each -- app.6700e3e57796.css and app.6114f5adc373.js -- and a staticfiles.json manifest mapping the logical name to the hashed one. The hash is an MD5 of the file contents, so "body{color:red}" always produces app.6700e3e57796.css on every build and every machine. The static template tag then reads the manifest and emits the immutable hashed URL, which can be cached for a year.',
        explainHi: 'collectstatic STATICFILES_DIRS ko walk karta hai aur app.css aur app.js ko STATIC_ROOT mein copy karta hai. Kyunki staticfiles storage ManifestStaticFilesStorage hai, ye har ek ki ek content-hashed copy bhi likhta hai -- app.6700e3e57796.css aur app.6114f5adc373.js -- aur ek staticfiles.json manifest jo logical name ko hashed se map karta hai. Hash file contents ka ek MD5 hai, toh "body{color:red}" har build aur har machine par app.6700e3e57796.css produce karta hai.',
      },
      {
        title: 'A missing referenced asset makes collectstatic fail the build',
        titleHi: 'Ek missing referenced asset collectstatic ko build fail karwaata hai',
        code: `import django, tempfile, os, io
from django.conf import settings
settings.configure(SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.staticfiles"])
django.setup()

from django.test import override_settings
from django.core.management import call_command
from django.core.management.base import CommandError

src = tempfile.mkdtemp()
# app.css references a background image that DOES NOT EXIST in the static tree
open(os.path.join(src, "app.css"), "w").write("body{background:url('missing-bg.png')}")
dest = tempfile.mkdtemp()

with override_settings(
    STATIC_URL="/static/", STATIC_ROOT=dest, STATICFILES_DIRS=[src],
    STORAGES={
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.ManifestStaticFilesStorage"},
    },
):
    try:
        call_command("collectstatic", "--noinput", verbosity=0, stdout=io.StringIO())
        print("collectstatic succeeded (unexpected)")
    except CommandError as e:
        print("collectstatic FAILED:", str(e).splitlines()[0][:70])
        print("-> a broken asset reference is caught at BUILD time, not as a 404 in prod")

from django.contrib.staticfiles.storage import ManifestStaticFilesStorage
print("strict default:", ManifestStaticFilesStorage.manifest_strict,
      "(a non-strict variant exists but you rarely want it)")`,
        output: `collectstatic FAILED: The file 'missing-bg.png' could not be found with <django.contrib.stat
-> a broken asset reference is caught at BUILD time, not as a 404 in prod
strict default: True (a non-strict variant exists but you rarely want it)`,
        explain: 'app.css contains url of missing-bg.png, but that file is not in the static tree. During collectstatic, ManifestStaticFilesStorage post-processes CSS and tries to rewrite that url to the hashed name -- and since it cannot find the file, it raises, and collectstatic surfaces it as a CommandError that fails the whole command. This is intentional: manifest_strict is True by default, so a broken asset reference is caught at build time -- in CI, before the image ships -- instead of turning into a 404 for a real user in production.',
        explainHi: 'app.css mein missing-bg.png ka url hai, par wo file static tree mein nahi hai. collectstatic ke dauran, ManifestStaticFilesStorage CSS post-process karta hai aur us url ko hashed name mein rewrite karne ki koshish karta hai -- aur kyunki ye file nahi dhoondh sakta, ye raise karta hai, aur collectstatic ise ek CommandError ke roop mein surface karta hai jo poore command ko fail karta hai. Ye jaan-boojhkar hai: manifest_strict default se True hai, toh ek broken asset reference build time par pakda jaata hai.',
      },
      {
        title: 'STATIC vs MEDIA: the two STORAGES entries and their separate roots',
        titleHi: 'STATIC vs MEDIA: do STORAGES entries aur unke alag roots',
        code: `import django, tempfile, os
from django.conf import settings
_static_root = tempfile.mkdtemp()
_media_root = tempfile.mkdtemp()
settings.configure(SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.staticfiles"],
    STATIC_URL="/static/", STATIC_ROOT=_static_root,
    MEDIA_URL="/media/", MEDIA_ROOT=_media_root,
    STORAGES={
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
    })
django.setup()

from django.core.files.storage import storages, default_storage
from django.core.files.base import ContentFile

static_storage = storages["staticfiles"]
media_storage = storages["default"]

# default_storage is a lazy proxy for the "default" entry -- same backend, same root
print("default_storage points at the media root:", default_storage.location == _media_root)
print("static location:", static_storage.location == _static_root)
print("media  location:", media_storage.location == _media_root)

# a user upload goes through default_storage -> MEDIA_ROOT, NOT STATIC_ROOT
name = default_storage.save("uploads/avatar.png", ContentFile(b"\\x89PNG fake"))
print("saved upload as:", name)
print("landed under MEDIA_ROOT:", os.path.exists(os.path.join(_media_root, name)))
print("did NOT land under STATIC_ROOT:", not os.path.exists(os.path.join(_static_root, name)))
print("url:", default_storage.url(name))`,
        output: `default_storage points at the media root: True
static location: True
media  location: True
saved upload as: uploads/avatar.png
landed under MEDIA_ROOT: True
did NOT land under STATIC_ROOT: True
url: /media/uploads/avatar.png`,
        explain: 'Two STORAGES entries, two separate roots. The default entry is the media storage -- what user uploads and FileField/ImageField go through -- and default_storage is a lazy proxy for it, pointing at MEDIA_ROOT. The staticfiles entry is separate, pointing at STATIC_ROOT. Saving an upload through default_storage lands the file under MEDIA_ROOT and nowhere near STATIC_ROOT, and its url is under MEDIA_URL. Keeping the two domains separate is what stops an uploaded file from ever being served as, or mistaken for, a static asset.',
        explainHi: 'Do STORAGES entries, do alag roots. default entry media storage hai -- jo user uploads aur FileField/ImageField se guzarte hain -- aur default_storage iske liye ek lazy proxy hai, MEDIA_ROOT par point karta hua. staticfiles entry alag hai, STATIC_ROOT par point karti hui. default_storage ke zariye ek upload save karna file ko MEDIA_ROOT ke tahat land karta hai aur STATIC_ROOT ke aas-paas kahin nahi. Do domains ko alag rakhna hi ek uploaded file ko ek static asset ke roop mein serve hone se rokta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# production settings, DEBUG = False
urlpatterns = [
    ...,
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),   # serve static from Django
]
# every CSS/JS/image request now ties up a WSGI worker; slow, and static() is a no-op unless DEBUG`,
        right: `# don't serve static from Django at all. Add WhiteNoise:
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",       # <-- right after Security
    ...,
]
STORAGES["staticfiles"]["BACKEND"] = "whitenoise.storage.CompressedManifestStaticFilesStorage"
# or put static behind a CDN / nginx / S3 -- anything but the Python process`,
        why: 'Django\'s `static()` URL helper only works when `DEBUG = True` — in production it silently adds no routes, so the classic "fix" is to hand-roll a static-serving view, which then makes every asset request occupy a WSGI worker for the duration of a file read. Workers are your scarcest resource; spending them on serving `logo.png` is why the site feels slow under load. Static files should be served by something built for it: WhiteNoise (in-process but efficient, pre-compressed, correct cache headers), a reverse proxy, or a CDN. WhiteNoise is the low-friction default and needs only a middleware line and a storage backend.',
        whyHi: 'Django ka `static()` URL helper sirf tab kaam karta hai jab `DEBUG = True` — production mein ye chupchaap koi routes add nahi karta, toh classic "fix" ek static-serving view hand-roll karna hai, jo phir har asset request ko ek WSGI worker occupy karwaata hai ek file read ki avधि ke liye. Workers aapka sabse durlabh resource hain. Static files ko iske liye bane kisi cheez dwara serve karna chahिए: WhiteNoise, ek reverse proxy, ya ek CDN.',
      },
      {
        wrong: `# Dockerfile / deploy script
CMD python manage.py collectstatic --noinput && gunicorn myproject.wsgi
# collectstatic runs on EVERY container start -- slow boot, and racy with N replicas
# also: STATIC_ROOT is inside the container, so a CDN upload would need to happen here too`,
        right: `# Dockerfile -- collectstatic at BUILD time, baked into the image
RUN python manage.py collectstatic --noinput
CMD ["gunicorn", "myproject.wsgi", "--bind", "0.0.0.0:8000"]
# every replica ships with STATIC_ROOT already populated; boot is instant; no race`,
        why: 'Running `collectstatic` at container startup means every replica re-does the same file-copy-and-hash work on every deploy and every restart, adding seconds to boot time, and if replicas start simultaneously they race on the shared `STATIC_ROOT` (or each build their own, wasting effort). `collectstatic` is a build step: its output depends only on your source, not on runtime state, so run it once in the Docker build (or a CI/release phase) and bake `STATIC_ROOT` into the image. Startup then just launches Gunicorn.',
        whyHi: 'Container startup par `collectstatic` chalाना matlab har replica har deploy aur har restart par wahi file-copy-and-hash kaam dobara karता hai, boot time mein seconds add karke, aur agar replicas ek saath start hote hain wo shared `STATIC_ROOT` par race karते hain. `collectstatic` ek build step hai: iska output sirf aapke source par depend karता hai, runtime state par nahi, toh ise Docker build mein ek baar chalao aur `STATIC_ROOT` ko image mein bake karo.',
      },
      {
        wrong: `class Document(models.Model):
    file = models.FileField(upload_to="docs/")
    # MEDIA_ROOT = BASE_DIR / "media"  on the local container disk
# a container restart / redeploy / scale-out -> every uploaded document is GONE
# and one host cannot serve uploads that landed on another`,
        right: `STORAGES = {
    "default": {"BACKEND": "storages.backends.s3.S3Storage",
               "OPTIONS": {"bucket_name": env("MEDIA_BUCKET"), "querystring_auth": True}},
    "staticfiles": {"BACKEND": "..."},
}
# uploads go to S3; the FileField stores the key; serve via signed URLs`,
        why: 'A container filesystem is ephemeral — it is discarded on every restart, redeploy, and scale event. Storing user uploads on `MEDIA_ROOT` when that is local disk means the files vanish the next time the container cycles, and with more than one replica, an upload that hit host A is a 404 from host B. Production media belongs in object storage (S3/GCS/Azure via `django-storages`): the `FileField` then holds only the storage key, the bytes are durable and shared across all app servers, and you serve them with time-limited signed URLs so access is still authorised.',
        whyHi: 'Ek container filesystem ephemeral hai — ye har restart, redeploy, aur scale event par discard hota hai. User uploads ko `MEDIA_ROOT` par store karna jab wo local disk hai matlab files agli baar container cycle hone par gायab ho jaati hain, aur ek se zyada replica ke saath, ek upload jo host A par gaya host B se ek 404 hai. Production media object storage mein hai (S3/GCS via `django-storages`): `FileField` phir sirf storage key rakhta hai.',
      },
    ],

    realWorld: [
      {
        en: '**WhiteNoise + `CompressedManifestStaticFilesStorage` + a CDN in front** — `collectstatic` runs in the Docker build, WhiteNoise serves `STATIC_ROOT` with brotli + `immutable` cache headers on hashed files, CloudFront caches at the edge so origin static traffic is near zero, and `{% static %}` always emits the hashed URL.',
        hi: '**WhiteNoise + `CompressedManifestStaticFilesStorage` + aage ek CDN** — `collectstatic` Docker build mein chalta hai, WhiteNoise `STATIC_ROOT` ko brotli + hashed files par `immutable` cache headers ke saath serve karta hai, CloudFront edge par cache karta hai.',
      },
      {
        en: '**S3 for all media via `django-storages`** — `FileField`/`ImageField` uploads go straight to a private bucket, the model stores only the key, downloads are time-limited pre-signed URLs generated per request with an ownership check, and an upload validator enforces size + content-type + (for images) dimensions before `save()`.',
        hi: '**`django-storages` ke zariye saare media ke liye S3** — `FileField`/`ImageField` uploads seedhे ek private bucket par jaate hain, model sirf key store karta hai, downloads prati request generate kiye time-limited pre-signed URLs hain, aur ek upload validator size + content-type enforce karta hai.',
      },
      {
        en: '**`collectstatic --noinput` + `check --deploy` + `makemigrations --check` as three CI gates before the image is built** — so a broken asset reference, a missing `SECURE_*` setting, or a model change with no migration all fail the pipeline, not production.',
        hi: '**Image build hone se pehle teen CI gates: `collectstatic --noinput` + `check --deploy` + `makemigrations --check`** — toh ek broken asset reference, ek missing `SECURE_*` setting, ya ek migration ke bina model change sab pipeline fail karte hain, production nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through the static-file pipeline from development to production. What does `collectstatic` do and what does `ManifestStaticFilesStorage` add?',
        qHi: 'Development se production tak static-file pipeline bataiye. `collectstatic` kya karta hai aur `ManifestStaticFilesStorage` kya add karta hai?',
        a: 'In development, with DEBUG True, django.contrib.staticfiles serves static files on the fly: a request for a static URL is resolved by searching every installed app\'s static directory plus anything in STATICFILES_DIRS. That is convenient but slow, and it is disabled when DEBUG is False, because runserver is not a production server. For production you run collectstatic once at build or release time. It walks all those same source locations and copies every static file into a single output directory, STATIC_ROOT. STATIC_ROOT is generated, gitignored, and only exists after collectstatic runs; it is what your static server actually serves. The command belongs in the Docker image build or a release phase, never at request time, because its output depends only on your source code. ManifestStaticFilesStorage, the recommended staticfiles backend, adds content-based cache busting during that collectstatic run. For each file it computes a hash of the contents and writes a copy whose name embeds the hash, like app dot 6700e3e57796 dot css. It rewrites references inside CSS and JavaScript to point at the hashed names. And it writes a manifest file, staticfiles dot json, mapping each logical name to its hashed name. After that, the static template tag reads the manifest and always emits the hashed URL. The payoff is that every static URL is immutable: identical content always has the same URL, so you can serve it with a one-year immutable cache header, and any change to a file produces a new hash, a new URL, and a fresh fetch — users never get a stale asset. As a bonus, if a CSS or JS file references an asset that is not in the static tree, collectstatic fails, so a broken reference is caught at build time instead of surfacing as a 404 in production.',
        aHi: 'Development mein, DEBUG True ke saath, django.contrib.staticfiles static files on the fly serve karta hai: ek static URL ke liye ek request har installed app ki static directory plus STATICFILES_DIRS mein kuch bhi search karke resolve hoti hai. Wo suvidhajanak par dheema hai, aur DEBUG False par disabled hai. Production ke liye aap collectstatic ek baar build ya release time par chalate ho. Ye un saari source locations ko walk karta hai aur har static file ko ek single output directory mein copy karta hai, STATIC_ROOT. Command Docker image build ya ek release phase mein hai, kabhi request time par nahi. ManifestStaticFilesStorage us collectstatic run ke dauran content-based cache busting add karta hai. Har file ke liye ye contents ka ek hash compute karta hai aur ek copy likhta hai jiska naam hash embed karta hai. Ye CSS aur JavaScript ke andar references ko hashed names par point karne ko rewrite karta hai. Aur ye ek manifest file likhta hai. Payoff ye hai ki har static URL immutable hai. Bonus ke roop mein, agar ek CSS ya JS file ek aise asset ko reference karta hai jo static tree mein nahi hai, collectstatic fail hota hai.',
      },
      {
        q: 'What is the difference between static and media files, and where should each live in production?',
        qHi: 'Static aur media files mein kya antar hai, aur production mein har ek kahaan rehna chahिए?',
        a: 'Static files ship with your code — your CSS, JavaScript, images, fonts, and the admin\'s and DRF\'s own assets. They are versioned in git, identical in every environment, and completely safe to cache aggressively because they only change when you deploy. Media files are the opposite: they are uploaded by users at runtime — avatars, document attachments, imports — so they are unknown at build time, untrusted, and must be treated as hostile input: validate the size, the content type, image dimensions, sanitise the filename, and never store them anywhere they could be executed. In production, static files are gathered by collectstatic into STATIC_ROOT and served by something efficient — WhiteNoise in-process, or a reverse proxy, or uploaded to S3 and served by a CDN — with long cache lifetimes. Media must not go on the local container filesystem, because that filesystem is ephemeral: it is wiped on every restart, redeploy, and scale event, so uploads would vanish, and with more than one replica an upload that landed on one host is a 404 from another. Production media belongs in object storage — S3, GCS, or Azure Blob via django-storages configured as the default storage. The FileField or ImageField then stores only the storage key, the actual bytes are durable and shared across all app servers, and you serve them through time-limited pre-signed URLs generated per request with an authorization check, or a dedicated media host — never mixed into STATIC_ROOT.',
        aHi: 'Static files aapke code ke saath ship hote hain — aapka CSS, JavaScript, images, fonts, aur admin aur DRF ke apne assets. Wo git mein versioned hain, har environment mein identical, aur aggressively cache karne ke liye poori tarah safe kyunki wo sirf tab badalte hain jab aap deploy karte ho. Media files ulta hain: wo runtime par users dwara uploaded hain, toh wo build time par unknown, untrusted hain, aur hostile input ki tarah treat kiye jaane chahिए: size, content type, image dimensions validate karo, filename sanitise karo, aur unhe kabhi kahin store mat karo jahaan wo execute ho sakein. Production mein, static files collectstatic dwara STATIC_ROOT mein gather kiye jaate hain aur kuch efficient dwara serve kiye jaate hain. Media local container filesystem par nahi jaana chahिए, kyunki wo filesystem ephemeral hai. Production media object storage mein hai — S3, GCS, ya Azure Blob django-storages ke zariye. FileField phir sirf storage key store karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django (`INSTALLED_APPS=["django.contrib.staticfiles"]`). A temp source dir with `app.css` (`"body{color:red}"`) and `app.js` (`"console.log(1)"`). Under `override_settings(STATIC_URL="/static/", STATIC_ROOT=<tmp>, STATICFILES_DIRS=[<src>], STORAGES={"default": FileSystemStorage, "staticfiles": ManifestStaticFilesStorage})`, run `call_command("collectstatic", "--noinput", verbosity=0, stdout=io.StringIO())`. Assert: `STATIC_ROOT` contains `app.css`, `app.6700e3e57796.css`, `app.js`, a hashed `.js`, and `staticfiles.json`; the manifest\'s `paths["app.css"] == "app.6700e3e57796.css"` (deterministic MD5 of the content).',
        taskHi: 'Standalone Django. Ek temp source dir `app.css` (`"body{color:red}"`) + `app.js` ke saath. `override_settings(...ManifestStaticFilesStorage)` ke tahat `collectstatic --noinput` chalao. Assert: `STATIC_ROOT` mein `app.css` + `app.6700e3e57796.css` + `app.js` + hashed `.js` + `staticfiles.json`; manifest ka `paths["app.css"] == "app.6700e3e57796.css"`.',
        hint: 'The hash is `md5("body{color:red}")` truncated — deterministic, so the same content always produces `app.6700e3e57796.css`. `json.load(open(STATIC_ROOT/"staticfiles.json"))["paths"]` is the mapping.',
        hintHi: 'Hash `md5("body{color:red}")` truncated hai — deterministic. `json.load(open(.../"staticfiles.json"))["paths"]` mapping hai.',
      },
      {
        task: 'Same setup, but `app.css` contains `"body{background:url(\'missing-bg.png\')}"` and there is NO `missing-bg.png` in the source dir. Run `collectstatic --noinput` under `ManifestStaticFilesStorage` and assert it raises `ValueError` whose message mentions `missing-bg.png` / "could not be found". Then read `ManifestStaticFilesStorage.manifest_strict` and assert it is `True` (that strictness is why the build fails).',
        taskHi: 'Wahi setup, par `app.css` mein `"body{background:url(\'missing-bg.png\')}"` aur source dir mein KOI `missing-bg.png` NAHI. `collectstatic --noinput` chalao aur assert karo `ValueError` raise hota hai jismें `missing-bg.png` mention ho. Phir `ManifestStaticFilesStorage.manifest_strict` `True` assert karo.',
        hint: '`ManifestStaticFilesStorage` post-processes CSS/JS and rewrites `url(...)` references to the hashed names; if the referenced file is not in the collected set, it raises rather than emit a dangling reference. This is a feature — the CI build catches it.',
        hintHi: '`ManifestStaticFilesStorage` CSS/JS post-process karta hai aur `url(...)` references rewrite karta hai; agar referenced file collected set mein nahi hai, ye raise karता hai. Ye ek feature hai.',
      },
      {
        task: 'Standalone Django with `STATIC_ROOT` and `MEDIA_ROOT` set to two different temp dirs, `STORAGES = {"default": FileSystemStorage, "staticfiles": StaticFilesStorage}`, `MEDIA_URL="/media/"`. From `django.core.files.storage` import `storages` and `default_storage`. Assert: `storages["default"] is default_storage`; `storages["staticfiles"].location` is the static dir and `storages["default"].location` is the media dir. Then `default_storage.save("uploads/x.png", ContentFile(b"..."))`, and assert the file exists under `MEDIA_ROOT` but NOT under `STATIC_ROOT`, and `default_storage.url("uploads/x.png") == "/media/uploads/x.png"`.',
        taskHi: 'Standalone Django `STATIC_ROOT` + `MEDIA_ROOT` do alag temp dirs, `STORAGES` dono entries, `MEDIA_URL="/media/"`. `storages` + `default_storage` import karo. Assert: `storages["default"] is default_storage`; locations sahi. Phir `default_storage.save("uploads/x.png", ContentFile(b"..."))`, assert file `MEDIA_ROOT` ke tahat hai par `STATIC_ROOT` ke tahat NAHI, aur `url(...) == "/media/uploads/x.png"`.',
        hint: '`from django.core.files.storage import storages, default_storage`; `from django.core.files.base import ContentFile`. `default_storage` is the `"default"` STORAGES entry — user uploads (`FileField.save`) go through it to `MEDIA_ROOT`, entirely separate from static.',
        hintHi: '`from django.core.files.storage import storages, default_storage`; `from django.core.files.base import ContentFile`. `default_storage` `"default"` entry hai — uploads iske zariye `MEDIA_ROOT` mein jaate hain.',
      },
    ],

    keyTakeaways: [
      'STATIC = ships WITH your code (CSS/JS/images/admin assets); versioned, cache-forever. MEDIA = uploaded BY users at runtime; untrusted, validate + never execute + separate location. Django\'s dev server auto-serves static only when `DEBUG=True`; in production it serves NOTHING static.',
      '`collectstatic --noinput` = the GATHER step: copies every app\'s `static/` + `STATICFILES_DIRS` into ONE dir `STATIC_ROOT`. Run at BUILD / release time (its output depends only on source) — NEVER at container startup (slow boot, racy across replicas).',
      '`STATIC_URL` = URL prefix; `STATIC_ROOT` = generated output dir (gitignored, outside sources); `STATICFILES_DIRS` = extra input dirs (must NOT contain `STATIC_ROOT`).',
      '`STORAGES` (Django 4.2+): one dict, `"default"` (media / `FileField` / `default_storage`) + `"staticfiles"` (what `collectstatic` writes through). Replaces the old `DEFAULT_FILE_STORAGE` + `STATICFILES_STORAGE`.',
      '`ManifestStaticFilesStorage`: during `collectstatic`, writes `app.<content-hash>.css` copies, rewrites `url(...)`/`@import` refs to the hashed names, and writes `staticfiles.json` mapping `app.css` -> `app.6700e3e57796.css`. `{% static %}` emits the hashed URL -> immutable, cache 1 year, any change = new URL.',
      'A file referenced from CSS/JS that is NOT in the collected set makes `collectstatic` FAIL (strict) — a broken asset ref is caught at BUILD time, not as a prod 404.',
      'Who serves the bytes: WhiteNoise (`whitenoise.middleware.WhiteNoiseMiddleware` right after Security + `CompressedManifestStaticFilesStorage`) — efficient, pre-compressed, correct headers, zero extra infra; or a CDN in front; or S3+CloudFront (`collectstatic` uploads). NEVER a Django view / WSGI worker per file.',
      'MEDIA in production = OBJECT STORAGE (`django-storages` S3/GCS/Azure), NOT the local container disk (ephemeral — wiped on restart/redeploy/scale; not shared across replicas). `FileField` stores only the key; serve via time-limited signed URLs with an auth check.',
    ],
    keyTakeawaysHi: [
      'STATIC = aapke code KE SAATH ship hota hai; versioned, cache-forever. MEDIA = runtime par users DWARA uploaded; untrusted, validate + kabhi execute nahi + alag location. Django ka dev server static sirf `DEBUG=True` par auto-serve karta hai; production mein KUCH static serve nahi karta.',
      '`collectstatic --noinput` = GATHER step: har app ka `static/` + `STATICFILES_DIRS` ko EK dir `STATIC_ROOT` mein copy karta hai. BUILD / release time par chalao — KABHI container startup par NAHI.',
      '`STATIC_URL` = URL prefix; `STATIC_ROOT` = generated output dir; `STATICFILES_DIRS` = extra input dirs (`STATIC_ROOT` NAHI hona chahिए).',
      '`STORAGES` (Django 4.2+): ek dict, `"default"` (media) + `"staticfiles"`. Purane `DEFAULT_FILE_STORAGE` + `STATICFILES_STORAGE` ko replace karta hai.',
      '`ManifestStaticFilesStorage`: `collectstatic` ke dauran `app.<content-hash>.css` copies likhta hai, `url(...)` refs rewrite karta hai, aur `staticfiles.json` mapping likhta hai. `{% static %}` hashed URL emit karta hai -> immutable, 1 saal cache.',
      'CSS/JS se referenced ek file jo collected set mein NAHI hai `collectstatic` ko FAIL karwaata hai (strict) — ek broken asset ref BUILD time par pakda jaata hai.',
      'Bytes kaun serve karta hai: WhiteNoise (`whitenoise.middleware.WhiteNoiseMiddleware` Security ke theek baad + `CompressedManifestStaticFilesStorage`); ya aage ek CDN; ya S3+CloudFront. KABHI prati file ek Django view / WSGI worker NAHI.',
      'MEDIA production mein = OBJECT STORAGE (`django-storages`), local container disk NAHI (ephemeral). `FileField` sirf key store karta hai; time-limited signed URLs ke zariye serve karo.',
    ],
  },

  {
    slug: 'dj-wsgi-asgi-and-deployment',
    title: 'WSGI/ASGI, Gunicorn & Docker Deployment',
    titleHi: 'WSGI/ASGI, Gunicorn & Docker Deployment',
    description: '`runserver` is not a production server. In production a real application server — Gunicorn (WSGI) or Uvicorn (ASGI) — runs your app in multiple worker processes, a reverse proxy sits in front for TLS and static, and the whole thing ships as a Docker image with `migrate` run separately from the web process.',
    descriptionHi: '`runserver` ek production server nahi hai. Production mein ek real application server — Gunicorn (WSGI) ya Uvicorn (ASGI) — aapke app ko kई worker processes mein chalata hai, ek reverse proxy TLS aur static ke liye aage baithता hai, aur poori cheez ek Docker image ke roop mein ship hoती hai `migrate` web process se alag chalाya gaya.',
    difficulty: 'HARD',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A restaurant kitchen at dinner service.** `runserver` is one cook working the whole menu alone with the lights half-on — fine for tasting recipes, hopeless for a full room. Production is a real line: **Gunicorn** is the head chef running several stations (**worker processes**) in parallel, each able to plate one order at a time; add stations and you serve more covers, but too many and they trip over each other for the one stove. The head chef also retires a station and spins up a fresh one after it has done N plates (**`max_requests`**), because a station slowly accumulates mess (memory) over a long shift. **Uvicorn / async workers** are a different station design for when most of the work is *waiting* — a cook who can have ten pots simmering at once instead of standing over one. **Nginx** is the maitre d at the door: takes coats (TLS), hands out the printed menus directly (static files), turns away obvious troublemakers, and only passes real orders to the kitchen. And **`migrate`** is rearranging the walk-in fridge — you do it once, before service, with the doors closed; you do not have every cook try to rearrange it mid-rush.',
      hi: '**Dinner service par ek restaurant kitchen.** `runserver` ek cook hai jो poora menu akele lights aadhी-on ke saath karता hai — recipes taste karne ke liye theek, ek poore room ke liye behaal. Production ek real line hai: **Gunicorn** head chef hai jो kई stations (**worker processes**) parallel mein chalाता hai, har ek ek samay ek order plate kar sakta hai; stations add karo aur aap zyada covers serve karते ho, par bahut zyada aur wo ek stove ke liye ek doosre par trip karते hain. Head chef ek station ko retire bhi karता hai aur N plates karने ke baad ek fresh spin up karता hai (**`max_requests`**), kyunki ek station ek lambी shift mein dheere-dheere mess (memory) jamा karता hai. **Uvicorn / async workers** ek alag station design hai jab zyादातr kaam *intezार* karna hai. **Nginx** darvaze par maitre d hai: coats leता hai (TLS), printed menus seedhe deता hai (static files), aur sirf real orders kitchen ko pass karता hai. Aur **`migrate`** walk-in fridge ko rearrange karna hai — aap ise ek baar, service se pehle, darvaze band karके karते ho.',
    },

    simple: `**WSGI vs ASGI**

\`\`\`python
# myproject/wsgi.py   -- the sync entrypoint (99% of Django apps)
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()          # a callable: (environ, start_response) -> iterable

# myproject/asgi.py   -- the async entrypoint (needed for async views, websockets, SSE)
from django.core.asgi import get_asgi_application
application = get_asgi_application()          # an async callable: (scope, receive, send)
\`\`\`

\`\`\`
WSGI   synchronous, one request per worker at a time. Gunicorn (sync/gthread workers).
       -> the default. An async view under WSGI runs, but the worker is still blocked for it.
ASGI   asynchronous, a worker can handle many concurrent requests that are I/O-waiting.
       Uvicorn / Hypercorn, or "gunicorn -k uvicorn.workers.UvicornWorker".
       -> use when you have async views, websockets (Channels), or SSE / long-poll.
\`\`\`

**Gunicorn — the WSGI application server**

\`\`\`bash
gunicorn myproject.wsgi:application \\
  --bind 0.0.0.0:8000 \\
  --workers 5 \\               # (2 x CPU cores) + 1 is the usual starting point
  --worker-class sync \\        # sync | gthread (--threads N) | uvicorn.workers.UvicornWorker
  --timeout 30 \\               # kill + replace a worker stuck for 30s (a hung request)
  --max-requests 1000 \\        # recycle a worker after 1000 requests (bounds slow memory leaks)
  --max-requests-jitter 50 \\   # stagger the recycling so all workers don't restart together
  --access-logfile - --error-logfile -
\`\`\`

\`\`\`
workers      = processes. More = more concurrency, more RAM. Not threads.
--timeout    a hung request kills its worker; keep it well above your slowest real endpoint,
             OR move that endpoint to a background job (Module 8).
--max-requests   defence against gradual memory growth: the worker is replaced, memory reclaimed.
gthread / --threads   a middle ground: fewer processes, N threads each, for I/O-bound sync views.
\`\`\`

**Nginx (or a cloud LB) in front**

\`\`\`
client --TLS--> nginx --plain HTTP--> gunicorn (127.0.0.1:8000)
nginx does:  TLS termination, HTTP/2, gzip, static files (or a CDN does), request-size limits,
             slow-client buffering (so a slow client doesn't tie up a gunicorn worker),
             rate limiting, and forwarding X-Forwarded-For / -Proto.
Django needs:  SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")   (Module 6)
\`\`\`

**Docker — multi-stage, non-root, migrate separately**

\`\`\`dockerfile
FROM python:3.12-slim AS build
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim
RUN useradd -m app
WORKDIR /app
COPY --from=build /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY . .
RUN python manage.py collectstatic --noinput        # static baked into the image
USER app                                            # do NOT run as root
EXPOSE 8000
CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "5"]
\`\`\`

\`\`\`
migrate      runs in a RELEASE step / init container / one-off task -- ONCE per deploy,
             BEFORE the new web containers take traffic. NOT in the web CMD (N replicas would race).
.dockerignore   .git, .venv, __pycache__, .env, node_modules, tests -- keep the image small
healthcheck  the orchestrator hits /livez (Module 9); readiness gates traffic on /readyz
one process per container   gunicorn in one, celery worker in another, celery beat in a third
\`\`\``,

    simpleHi: `**WSGI vs ASGI**

\`\`\`python
# myproject/wsgi.py   -- sync entrypoint (99% Django apps)
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()          # ek callable: (environ, start_response) -> iterable

# myproject/asgi.py   -- async entrypoint (async views, websockets, SSE ke liye chahिए)
from django.core.asgi import get_asgi_application
application = get_asgi_application()          # ek async callable: (scope, receive, send)
\`\`\`

\`\`\`
WSGI   synchronous, ek samay prati worker ek request. Gunicorn (sync/gthread workers).
       -> default. WSGI ke tahat ek async view chalता hai, par worker abhi bhi iske liye blocked hai.
ASGI   asynchronous, ek worker kई concurrent requests handle kar sakta hai jо I/O-waiting hain.
       Uvicorn / Hypercorn, ya "gunicorn -k uvicorn.workers.UvicornWorker".
       -> tab istemal karo jab aapke paas async views, websockets (Channels), ya SSE hon.
\`\`\`

**Gunicorn — WSGI application server**

\`\`\`bash
gunicorn myproject.wsgi:application \\
  --bind 0.0.0.0:8000 \\
  --workers 5 \\               # (2 x CPU cores) + 1 usual starting point hai
  --worker-class sync \\        # sync | gthread (--threads N) | uvicorn.workers.UvicornWorker
  --timeout 30 \\               # 30s ke liye stuck ek worker ko kill + replace karo
  --max-requests 1000 \\        # 1000 requests ke baad ek worker recycle karo (slow memory leaks bound)
  --max-requests-jitter 50 \\   # recycling stagger karo taaki saare workers ek saath restart na hon
  --access-logfile - --error-logfile -
\`\`\`

\`\`\`
workers      = processes. Zyada = zyada concurrency, zyada RAM. Threads nahi.
--timeout    ek hung request iske worker ko kill karता hai; ise apने slowest real endpoint se kaafi upar rakhо
--max-requests   gradual memory growth ke khilaf bachaव: worker replace hota hai, memory reclaimed.
gthread / --threads   ek middle ground: kam processes, prati ek N threads, I/O-bound sync views ke liye.
\`\`\`

**Nginx (ya ek cloud LB) aage**

\`\`\`
client --TLS--> nginx --plain HTTP--> gunicorn (127.0.0.1:8000)
nginx karता hai:  TLS termination, HTTP/2, gzip, static files (ya ek CDN karता hai), request-size limits,
                  slow-client buffering (taaki ek slow client ek gunicorn worker na baandhे),
                  rate limiting, aur X-Forwarded-For / -Proto forward.
Django ko chahिए:  SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")   (Module 6)
\`\`\`

**Docker — multi-stage, non-root, migrate alag**

\`\`\`dockerfile
FROM python:3.12-slim AS build
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim
RUN useradd -m app
WORKDIR /app
COPY --from=build /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY . .
RUN python manage.py collectstatic --noinput        # static image mein baked
USER app                                            # root ke roop mein MAT chalao
EXPOSE 8000
CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "5"]
\`\`\`

\`\`\`
migrate      ek RELEASE step / init container / one-off task mein chalता hai -- prati deploy EK BAAR,
             naye web containers traffic lene se PEHLE. web CMD mein NAHI (N replicas race karenge).
.dockerignore   .git, .venv, __pycache__, .env, node_modules, tests -- image chhoti rakhो
healthcheck  orchestrator /livez hit karता hai (Module 9); readiness /readyz par traffic gate karта hai
prati container ek process   gunicorn ek mein, celery worker doosre mein, celery beat teesre mein
\`\`\``,

    content: `## \`runserver\` is a development tool

\`manage.py runserver\` is single-process (well, single request at a time per the autoreloader thread), unoptimised, and explicitly documented as not for production. Production needs a real **application server** that runs your app in multiple OS processes and speaks a standard protocol.

## WSGI vs ASGI

**WSGI** (Web Server Gateway Interface) is the long-standing synchronous contract: \`application(environ, start_response)\` returns an iterable of bytes. One worker handles one request start-to-finish before taking the next. This is what \`myproject/wsgi.py\` exposes, and it is the right choice for the overwhelming majority of Django apps.

**ASGI** (Asynchronous Server Gateway Interface) is the async contract: \`async application(scope, receive, send)\`. A single worker can have many requests in flight, progressing whichever ones are not currently blocked on I/O. \`myproject/asgi.py\` exposes it. You need ASGI for: \`async def\` views that actually benefit (lesson 6), WebSockets (via Channels), and Server-Sent Events / long-polling where many connections sit mostly idle.

Running \`async def\` views under a WSGI server works — Django runs them in an event loop per request — but the worker is still occupied for the whole request, so you get the code style without the concurrency benefit. To get the benefit you deploy under ASGI (\`gunicorn -k uvicorn.workers.UvicornWorker\`, or Uvicorn/Hypercorn directly).

## Gunicorn

The standard WSGI server for Django. Key knobs:

- **\`--workers N\`** — the number of worker **processes** (not threads). Each is a full copy of your app handling one request at a time. Starting point: \`(2 × CPU cores) + 1\`. More workers = more concurrency and more memory; past a point they contend for CPU and the database connection pool.
- **\`--worker-class\`** — \`sync\` (one request per worker, simplest, CPU-bound-safe), \`gthread\` with \`--threads N\` (each worker runs N threads — better for I/O-bound sync views without N× the memory), or \`uvicorn.workers.UvicornWorker\` (async, for ASGI).
- **\`--timeout 30\`** — if a worker does not respond for 30 s, Gunicorn kills and replaces it. This protects against a single hung request taking a worker out permanently — but it means a legitimately slow endpoint (a big export) will be killed, so either raise the timeout for that route or, better, move the work to a background job (Module 8).
- **\`--max-requests 1000 --max-requests-jitter 50\`** — each worker is gracefully restarted after ~1000 requests (± jitter so they do not all cycle at once). This bounds slow memory growth (a leak, or fragmentation, or a cache that never shrinks) without you having to find the leak.
- **\`--graceful-timeout\`**, **\`--preload\`** (load the app once before forking — saves memory via copy-on-write, but breaks some things and disables \`--reload\`), **\`--worker-tmp-dir /dev/shm\`** (heartbeat file on a RAM disk — avoids stalls on some container filesystems).

A **\`gunicorn.conf.py\`** is just a Python file — you can compute \`workers\` from \`multiprocessing.cpu_count()\`, read the bind address from the environment, and define hook functions (\`post_fork\`, \`worker_int\`).

## The reverse proxy

Gunicorn should not face the internet directly. Put **nginx** (or a cloud load balancer — ALB, Cloud Load Balancing) in front:

- **TLS termination** and HTTP/2 — Gunicorn speaks plain HTTP on localhost.
- **Static files** — nginx serves \`STATIC_ROOT\` directly (or you use WhiteNoise / a CDN, lesson 4).
- **Slow-client buffering** — nginx buffers a slow upload/download so the Gunicorn worker is freed as soon as it has produced the response; without this, one slow client holds a worker.
- **Limits** — \`client_max_body_size\`, connection limits, rate limiting.
- **Forwarded headers** — nginx sets \`X-Forwarded-For\` and \`X-Forwarded-Proto\`; Django must set \`SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")\` so \`request.is_secure()\` is correct (Module 6), and you must trust the proxy (don't set this if anything can reach Gunicorn directly).

## Docker

- **Multi-stage build** — a \`build\` stage installs dependencies (and compiles wheels), the final stage copies only the installed packages and your code. Smaller image, no build toolchain in production.
- **Non-root** — \`RUN useradd\` and \`USER app\`; a container escape as root is far worse than as an unprivileged user.
- **\`collectstatic\` at build time** (lesson 4) — baked into the image.
- **\`.dockerignore\`** — exclude \`.git\`, \`.venv\`, \`__pycache__\`, \`.env\`, \`node_modules\`, test fixtures. A fat build context is slow and can leak secrets.
- **One concern per container** — the web container runs Gunicorn; separate containers run the Celery worker and Celery beat (Module 8). They share the image, differ only in \`CMD\`.
- **Health checks** — the orchestrator probes \`/livez\` and \`/readyz\` (Module 9).

## \`migrate\` is not part of the web process

Running \`python manage.py migrate\` in your web container's \`CMD\` (before \`gunicorn\`) means: every replica runs it on every start, they **race** each other on the same database, and a deploy of 10 replicas is 10 concurrent \`migrate\` calls. Instead run migrations **once per deploy, before the new code serves traffic**:

- a **release phase** (Heroku \`release:\`, a deploy pipeline step),
- an **init container** (Kubernetes) or a one-off ECS task,
- a \`docker compose run --rm web python manage.py migrate\` step in the deploy script.

The web containers then start with the schema already in place. This also forces you to write **backward-compatible migrations** — the old code is briefly still running against the new schema during a rolling deploy (lesson 6).`,

    contentHi: `## \`runserver\` ek development tool hai

\`manage.py runserver\` single-process hai, unoptimised, aur spasht roop se production ke liye nahi documented. Production ko ek real **application server** chahिए jо aapke app ko kई OS processes mein chalाता hai aur ek standard protocol bolता hai.

## WSGI vs ASGI

**WSGI** long-standing synchronous contract hai: \`application(environ, start_response)\` bytes ka ek iterable return karता hai. Ek worker ek request ko start-to-finish handle karता hai. \`myproject/wsgi.py\` ise expose karता hai, aur ye Django apps ke bhaari bahumat ke liye sahi chunaव hai.

**ASGI** async contract hai: \`async application(scope, receive, send)\`. Ek single worker kई requests in flight rakh sakta hai. Aapko ASGI chahिए: \`async def\` views jo asal mein benefit karें (lesson 6), WebSockets (Channels ke zariye), aur SSE / long-polling.

Ek WSGI server ke tahat \`async def\` views chalाना kaam karता hai — par worker abhi bhi poore request ke liye occupied hai, toh aapको concurrency benefit ke bina code style milता hai.

## Gunicorn

Django ke liye standard WSGI server. Mukhya knobs:

- **\`--workers N\`** — worker **processes** ki sankhya (threads nahi). Starting point: \`(2 × CPU cores) + 1\`.
- **\`--worker-class\`** — \`sync\` (sabse saral), \`gthread\` \`--threads N\` ke saath (I/O-bound sync views ke liye behtar), ya \`uvicorn.workers.UvicornWorker\` (async, ASGI ke liye).
- **\`--timeout 30\`** — agar ek worker 30 s ke liye respond nahi karता, Gunicorn ise kill karके replace karता hai. Par iska matlab ek legitimately slow endpoint kill hoगा — toh us route ke liye timeout badhाओ ya, behtar, kaam ko ek background job par move karो (Module 8).
- **\`--max-requests 1000 --max-requests-jitter 50\`** — har worker ~1000 requests ke baad gracefully restart hota hai. Ye slow memory growth bound karता hai.

Ek **\`gunicorn.conf.py\`** bस ek Python file hai.

## Reverse proxy

Gunicorn ko seedhе internet face nahi karna chahिए. **nginx** (ya ek cloud load balancer) aage daalो:

- **TLS termination** aur HTTP/2.
- **Static files** — nginx \`STATIC_ROOT\` seedhे serve karता hai (ya WhiteNoise / ek CDN).
- **Slow-client buffering** — nginx ek slow upload/download buffer karता hai taaki Gunicorn worker free ho jaaye.
- **Forwarded headers** — nginx \`X-Forwarded-Proto\` set karता hai; Django ko \`SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")\` set karna chahिए (Module 6).

## Docker

- **Multi-stage build** — chhoti image, production mein koi build toolchain nahi.
- **Non-root** — \`RUN useradd\` aur \`USER app\`.
- **\`collectstatic\` build time par** (lesson 4).
- **\`.dockerignore\`** — \`.git\`, \`.venv\`, \`__pycache__\`, \`.env\`, \`node_modules\` exclude karो.
- **Prati container ek concern** — web container Gunicorn chalाता hai; alag containers Celery worker aur beat chalाते hain.

## \`migrate\` web process ka hissa nahi hai

Apने web container ke \`CMD\` mein \`migrate\` chalाना matlab: har replica ise har start par chalाता hai, wo ek doosre par **race** karते hain. Iske bजाy migrations **prati deploy ek baar, naya code traffic serve karने se pehle** chalाओ:

- ek **release phase**,
- ek **init container** (Kubernetes) ya ek one-off ECS task,
- deploy script mein ek \`docker compose run --rm web python manage.py migrate\` step.

Ye aapको **backward-compatible migrations** likhने ko bhi majboor karता hai — ek rolling deploy ke dauran purana code thodी der naye schema ke against chal raha hai (lesson 6).`,

    examples: [
      {
        title: 'The WSGI and ASGI application objects: sync callable vs async callable',
        titleHi: 'WSGI aur ASGI application objects: sync callable vs async callable',
        code: `import inspect
import django
from django.conf import settings
settings.configure(DEBUG=False, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__,
    ALLOWED_HOSTS=["*"], INSTALLED_APPS=[], MIDDLEWARE=[])
django.setup()

from django.core.wsgi import get_wsgi_application
from django.core.asgi import get_asgi_application

wsgi_app = get_wsgi_application()
asgi_app = get_asgi_application()

print("WSGI:")
print("  callable:", callable(wsgi_app))
print("  __call__ is a coroutine function:", inspect.iscoroutinefunction(wsgi_app.__call__))
print("  contract: application(environ, start_response) -> iterable of bytes")

print("ASGI:")
print("  callable:", callable(asgi_app))
print("  __call__ is a coroutine function:", inspect.iscoroutinefunction(asgi_app.__call__))
print("  contract: async application(scope, receive, send)")

# what deploys them
print()
print("WSGI -> gunicorn myproject.wsgi:application  (sync / gthread workers)")
print("ASGI -> uvicorn myproject.asgi:application    or  gunicorn -k uvicorn.workers.UvicornWorker")`,
        output: `WSGI:
  callable: True
  __call__ is a coroutine function: False
  contract: application(environ, start_response) -> iterable of bytes
ASGI:
  callable: True
  __call__ is a coroutine function: True
  contract: async application(scope, receive, send)

WSGI -> gunicorn myproject.wsgi:application  (sync / gthread workers)
ASGI -> uvicorn myproject.asgi:application    or  gunicorn -k uvicorn.workers.UvicornWorker`,
        explain: "get_wsgi_application returns a plain callable whose __call__ is an ordinary function: the WSGI contract is application of environ and start_response returning an iterable of bytes, and one worker handles one request start to finish. get_asgi_application returns a callable whose __call__ is a coroutine function -- the ASGI contract is async application of scope, receive, and send, and one worker can interleave many requests. That single distinction -- sync callable versus async callable -- is why WSGI deploys under Gunicorn\\'s sync workers and ASGI needs Uvicorn or Gunicorn\\'s Uvicorn worker class.",
        explainHi: 'get_wsgi_application ek plain callable lautata hai jiska __call__ ek ordinary function hai: WSGI contract environ aur start_response ka application hai jo bytes ka ek iterable lautata hai, aur ek worker ek request start se finish handle karta hai. get_asgi_application ek callable lautata hai jiska __call__ ek coroutine function hai -- ASGI contract scope, receive, aur send ka async application hai. Wahi ek antar -- sync callable bनाम async callable -- wo hai jisse WSGI Gunicorn ke sync workers ke tahat deploy hota hai aur ASGI ko Uvicorn chahिए.',
      },
      {
        title: 'A gunicorn.conf.py is plain Python: compute workers, read the environment',
        titleHi: 'Ek gunicorn.conf.py plain Python hai: workers compute karo, environment padho',
        code: `import os, textwrap

# this is what a real gunicorn.conf.py looks like
CONF = textwrap.dedent('''
    import multiprocessing, os

    bind = os.environ.get("GUNICORN_BIND", "0.0.0.0:8000")
    workers = int(os.environ.get("WEB_CONCURRENCY", (multiprocessing.cpu_count() * 2) + 1))
    worker_class = os.environ.get("GUNICORN_WORKER_CLASS", "sync")
    threads = int(os.environ.get("GUNICORN_THREADS", 1))
    timeout = 30
    graceful_timeout = 30
    max_requests = 1000
    max_requests_jitter = 50
    accesslog = "-"
    errorlog = "-"
    worker_tmp_dir = "/dev/shm"

    def post_fork(server, worker):
        server.log.info("worker %s booted", worker.pid)
''')

# gunicorn just exec()s the config file -- simulate that
os.environ["WEB_CONCURRENCY"] = "4"           # a platform (Heroku/Fly) sets this
ns = {}
exec(compile(CONF, "gunicorn.conf.py", "exec"), ns)

print("bind:", ns["bind"])
print("workers:", ns["workers"], "(from WEB_CONCURRENCY)")
print("worker_class:", ns["worker_class"])
print("timeout / graceful_timeout:", ns["timeout"], "/", ns["graceful_timeout"])
print("max_requests (+jitter):", ns["max_requests"], "+/-", ns["max_requests_jitter"])
print("post_fork hook defined:", callable(ns["post_fork"]))

# without the env var, workers falls back to (2 x CPU cores) + 1
del os.environ["WEB_CONCURRENCY"]
ns2 = {}
exec(compile(CONF, "gunicorn.conf.py", "exec"), ns2)
import multiprocessing
print("workers without WEB_CONCURRENCY == (2 x cores) + 1:",
      ns2["workers"] == (multiprocessing.cpu_count() * 2) + 1)`,
        output: `bind: 0.0.0.0:8000
workers: 4 (from WEB_CONCURRENCY)
worker_class: sync
timeout / graceful_timeout: 30 / 30
max_requests (+jitter): 1000 +/- 50
post_fork hook defined: True
workers without WEB_CONCURRENCY == (2 x cores) + 1: True`,
        explain: 'A gunicorn config file is just a Python module that gunicorn exec()s -- every top-level assignment becomes a setting, and you can define hook functions like post_fork. Here workers reads WEB_CONCURRENCY from the environment (which platforms like Heroku and Fly set) and falls back to two times the CPU count plus one when it is absent. bind, worker_class, and threads are also env-overridable; timeout, max_requests, and the jitter are fixed. This is the idiomatic way to size Gunicorn per environment without changing code.',
        explainHi: 'Ek gunicorn config file bस ek Python module hai jise gunicorn exec() karta hai -- har top-level assignment ek setting ban jaati hai, aur aap post_fork jaise hook functions define kar sakte ho. Yahaan workers environment se WEB_CONCURRENCY padhta hai (jo Heroku aur Fly jaise platforms set karte hain) aur iske absent hone par CPU count guna do plus ek par fall back karta hai. bind, worker_class, aur threads bhi env-overridable hain. Ye code badle bina prati environment Gunicorn size karne ka idiomatic tareeka hai.',
      },
      {
        title: 'SECURE_PROXY_SSL_HEADER: how Django knows the original request was HTTPS',
        titleHi: 'SECURE_PROXY_SSL_HEADER: Django kaise jaanता hai ki original request HTTPS thi',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=False, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], MIDDLEWARE=[],
    SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO", "https"))
django.setup()

from django.http import JsonResponse
from django.urls import path
from django.test import Client

def whoami(request):
    return JsonResponse({
        "is_secure": request.is_secure(),
        "scheme": request.scheme,
    })

urlpatterns = [path("", whoami)]
c = Client()

# nginx terminated TLS and forwards plain HTTP to gunicorn, but sets X-Forwarded-Proto
r1 = c.get("/", HTTP_X_FORWARDED_PROTO="https")
print("with X-Forwarded-Proto: https ->", r1.json())

# a request that did NOT come through the TLS proxy
r2 = c.get("/")
print("no forwarded header            ->", r2.json())

print()
print("without SECURE_PROXY_SSL_HEADER set, request.is_secure() is ALWAYS False behind a proxy")
print("-> SECURE_SSL_REDIRECT would loop, secure cookies would never be set. Module 6.")`,
        output: `with X-Forwarded-Proto: https -> {'is_secure': True, 'scheme': 'https'}
no forwarded header            -> {'is_secure': False, 'scheme': 'http'}

without SECURE_PROXY_SSL_HEADER set, request.is_secure() is ALWAYS False behind a proxy
-> SECURE_SSL_REDIRECT would loop, secure cookies would never be set. Module 6.`,
        explain: "nginx or a load balancer terminates TLS and forwards plain HTTP to Gunicorn, so from Gunicorn\\'s point of view request.scheme is always http. SECURE_PROXY_SSL_HEADER tells Django to trust a specific forwarded header -- X-Forwarded-Proto -- as the real scheme: when it is https, request.is_secure returns True and request.scheme is https; without the header, both fall back to http. Without this setting behind a TLS proxy, request.is_secure is permanently False, so SECURE_SSL_REDIRECT loops forever and secure cookies are never set. You must only set it when nothing untrusted can reach Gunicorn directly.",
        explainHi: 'nginx ya ek load balancer TLS terminate karta hai aur Gunicorn ko plain HTTP forward karta hai, toh Gunicorn ke nazariye se request.scheme hamesha http hai. SECURE_PROXY_SSL_HEADER Django ko ek vishisht forwarded header -- X-Forwarded-Proto -- par real scheme ke roop mein bharosa karne ko kehta hai: jab ye https hai, request.is_secure True lautata hai; header ke bina, dono http par fall back karte hain. Ek TLS proxy ke peeche is setting ke bina, request.is_secure sthाyi roop se False hai, toh SECURE_SSL_REDIRECT hamesha ke liye loop karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# Procfile / container CMD
web: python manage.py migrate && gunicorn myproject.wsgi
# deploy 8 replicas -> 8 processes run \`migrate\` against the same DB at the same moment`,
        right: `# Procfile
release: python manage.py migrate --noinput          # runs ONCE, before the new web dynos start
web: gunicorn myproject.wsgi --bind 0.0.0.0:$PORT
# k8s: an initContainer or a Job;  ECS: a one-off task;  compose: a \`migrate\` service that exits`,
        why: 'Putting `migrate` in the web process command means it runs on every container start. On a rolling deploy of N replicas, that is N processes all trying to apply the same migrations against one database simultaneously — they race on the `django_migrations` table and the schema locks, and you get errors like "relation already exists" or "column already exists" as one wins and the others collide. Migrations must run exactly once per deploy, in a dedicated step that completes before any new web container serves traffic: a platform release phase, a Kubernetes init container or Job, or a one-off task. The web containers then just start Gunicorn against a schema that is already correct.',
        whyHi: '`migrate` ko web process command mein daalна matlab ye har container start par chalता hai. N replicas ke ek rolling deploy par, wo N processes hain jо sab ek saath ek database ke against wahi migrations apply karने ki koshish kar rahe hain — wo `django_migrations` table par race karते hain. Migrations ko theek prati deploy ek baar chalna chahिए, ek dedicated step mein jо kisi bhi naye web container ke traffic serve karने se pehle poora ho.',
      },
      {
        wrong: `gunicorn myproject.wsgi --workers 64        # "more workers = faster", on a 4-core box
# 64 processes contend for 4 cores + each opens a DB connection -> pool exhausted,
# context-switching overhead, and RAM = 64 x your app's footprint`,
        right: `gunicorn myproject.wsgi --workers 9 --timeout 30 --max-requests 1000
# (2 x 4 cores) + 1 = 9. If endpoints are I/O-bound, use gthread:
gunicorn myproject.wsgi --workers 5 --threads 4 --worker-class gthread`,
        why: 'Worker count is not a "bigger is better" dial. Each Gunicorn sync worker is a full process: it uses a copy of your app\'s memory and holds its own database connection. On a 4-core machine, 64 workers means 64 processes fighting over 4 CPUs (so most are waiting), 64 database connections (which likely exceeds your pool or Postgres\' `max_connections`), and 64× the memory. The starting point is `(2 × cores) + 1`; tune from there based on whether your workload is CPU-bound (fewer workers, they stay busy) or I/O-bound (use `gthread` with threads, or async, to get concurrency without process count).',
        whyHi: 'Worker count ek "bada behtar hai" dial nahi hai. Har Gunicorn sync worker ek poora process hai: ye aapke app ki memory ki ek copy istemal karता hai aur apna database connection rakhता hai. Ek 4-core machine par, 64 workers matlab 64 processes 4 CPUs par lad rahe hain, 64 database connections (jо shायad aapka pool exceed karता hai), aur 64× memory. Starting point `(2 × cores) + 1` hai.',
      },
      {
        wrong: `FROM python:3.12
COPY . .                                    # copies .git, .venv, .env, node_modules, __pycache__
RUN pip install -r requirements.txt
CMD python manage.py runserver 0.0.0.0:8000  # runserver in production; running as root`,
        right: `FROM python:3.12-slim AS build
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
FROM python:3.12-slim
RUN useradd -m app
COPY --from=build /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY . .                                    # with a .dockerignore excluding .git/.venv/.env/...
RUN python manage.py collectstatic --noinput
USER app
CMD ["gunicorn", "myproject.wsgi", "--bind", "0.0.0.0:8000"]`,
        why: 'Three problems. `runserver` in production is single-threaded, unoptimised, and disables its own static handling with `DEBUG=False` — it is not an application server. Running the container as root means a code-execution bug or a container escape happens with root privileges. And `COPY . .` without a `.dockerignore` bakes your `.git` history, your local `.venv`, your `.env` (secrets!), `node_modules`, and every `__pycache__` into the image — a huge, slow build context that also ships secrets. The fix: a multi-stage slim image, an unprivileged `USER`, a `.dockerignore`, `collectstatic` at build, and Gunicorn as the entrypoint.',
        whyHi: 'Teen problems. Production mein `runserver` single-threaded, unoptimised hai — ye ek application server nahi hai. Container ko root ke roop mein chalाना matlab ek code-execution bug root privileges ke saath hota hai. Aur ek `.dockerignore` ke bina `COPY . .` aapki `.git` history, `.venv`, `.env` (secrets!), `node_modules` ko image mein bake karता hai. Fix: ek multi-stage slim image, ek unprivileged `USER`, ek `.dockerignore`, build par `collectstatic`, aur Gunicorn entrypoint ke roop mein.',
      },
    ],

    realWorld: [
      {
        en: '**Gunicorn with a `gunicorn.conf.py`** — `workers` from `WEB_CONCURRENCY` (or `cpu_count*2+1`), `--timeout 30`, `--max-requests 1000 --max-requests-jitter 50`, `--worker-tmp-dir /dev/shm`, access/error logs to stdout as JSON — behind an ALB / nginx doing TLS, HTTP/2, and slow-client buffering.',
        hi: '**Ek `gunicorn.conf.py` waala Gunicorn** — `WEB_CONCURRENCY` se `workers`, `--timeout 30`, `--max-requests 1000 --max-requests-jitter 50`, `--worker-tmp-dir /dev/shm` — ek ALB / nginx ke peeche jо TLS, HTTP/2, aur slow-client buffering karता hai.',
      },
      {
        en: '**A multi-stage Dockerfile shared by three deployments** — the same image runs as `web` (`gunicorn ...wsgi`), `worker` (`celery -A proj worker`), and `beat` (`celery -A proj beat`), differing only in `CMD`; non-root, `collectstatic` baked in, a `.dockerignore`, and a `/livez` `HEALTHCHECK`.',
        hi: '**Teen deployments dwara shared ek multi-stage Dockerfile** — wahi image `web`, `worker`, aur `beat` ke roop mein chalती hai, sirf `CMD` mein alag; non-root, `collectstatic` baked in, ek `.dockerignore`.',
      },
      {
        en: '**Migrations in a release phase** — the deploy pipeline runs `migrate --noinput` as a gated step (Heroku `release:`, a k8s `Job`, an ECS run-task) that must succeed before the new task set is promoted; the web containers never run `migrate`. Combined with backward-compatible migrations (lesson 6) for zero downtime.',
        hi: '**Ek release phase mein migrations** — deploy pipeline `migrate --noinput` ko ek gated step ke roop mein chalाता hai jо naye task set ke promote hone se pehle safal hona chahिए; web containers kabhi `migrate` nahi chalाते.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between WSGI and ASGI, and how does Gunicorn fit in? When would you use an async worker?',
        qHi: 'WSGI aur ASGI mein kya antar hai, aur Gunicorn kaise fit hota hai? Aap ek async worker kab istemal karoge?',
        a: 'WSGI is the synchronous server-to-application contract Python web frameworks have used for years: the server calls application with the request environment and a start-response callback, and gets back an iterable of bytes. Crucially it is one request per worker at a time — a worker picks up a request, runs it to completion, and only then takes the next. myproject slash wsgi dot py exposes this, and it is the right choice for almost every Django app. ASGI is the asynchronous equivalent: an async callable taking scope, receive, and send. A single ASGI worker can have many requests in flight at once, making progress on whichever ones are not currently blocked waiting on I/O. myproject slash asgi dot py exposes it. Gunicorn is a WSGI server: it manages a pool of worker processes, each running your WSGI app, and it also has an ASGI mode via the Uvicorn worker class, so gunicorn dash k uvicorn dot workers dot UvicornWorker runs your ASGI app with Gunicorn\'s process management. You reach for an async deployment when the workload is dominated by waiting rather than computing: async views that make several concurrent outbound HTTP calls or database queries and await them together, WebSocket connections through Channels, and Server-Sent Events or long-polling where thousands of connections sit almost entirely idle. Under sync WSGI, each of those idle connections would pin a whole worker; under ASGI one worker handles thousands. If your views are ordinary request-response handlers doing a bit of ORM work and returning, sync WSGI with a sensible worker count is simpler and just as fast — async adds complexity for no benefit there. And note that running async def views under a WSGI server works but gives you the syntax without the concurrency: the worker is still held for the whole request.',
        aHi: 'WSGI synchronous server-to-application contract hai: server application ko request environment aur ek start-response callback ke saath call karta hai, aur bytes ka ek iterable wapas paata hai. Mahatvapoorn roop se ye ek samay prati worker ek request hai. myproject slash wsgi dot py ise expose karta hai, aur ye lगbhag har Django app ke liye sahi chunav hai. ASGI asynchronous equivalent hai: ek async callable scope, receive, aur send leta hai. Ek single ASGI worker ek saath kई requests in flight rakh sakta hai. Gunicorn ek WSGI server hai: ye worker processes ka ek pool manage karta hai, aur iska Uvicorn worker class ke zariye ek ASGI mode bhi hai. Aap ek async deployment ke liye tab pahunchte ho jab workload waiting se dominated hai computing ke bजाy: async views jो kई concurrent outbound HTTP calls karti hain, WebSocket connections, aur SSE ya long-polling jahaan hazaaron connections lगbhag poori tarah idle baithti hain. Sync WSGI ke tahat, un idle connections mein se har ek ek poora worker pin karti; ASGI ke tahat ek worker hazaaron handle karta hai.',
      },
      {
        q: 'Why must `migrate` not run in the web container\'s startup command, and where should it run instead?',
        qHi: '`migrate` ko web container ke startup command mein kyun nahi chalna chahिए, aur ise iske bजाy kahaan chalna chahिए?',
        a: 'If the web container\'s command is migrate followed by gunicorn, then migrate runs every time a container starts. During a deploy you are typically starting several replicas at once — a rolling update of, say, eight pods — so you get eight processes all attempting to apply the same set of migrations to the same database at the same instant. They contend on the django_migrations bookkeeping table and on the schema locks, and depending on timing you get failures like relation already exists or column already exists as one process wins a step and the others collide on it, or worse, a half-applied state. Even with one replica it is wasteful to re-run the migration check on every restart and crash-loop. Migrations are a deploy-level operation that must happen exactly once, and must complete before any container running the new code starts serving traffic, because the new code expects the new schema. So you run it in a dedicated step: a platform release phase that the pipeline blocks on, a Kubernetes init container or a one-shot Job, a one-off ECS run-task, or a compose service that runs migrate and exits before the web service starts. The web containers then simply launch Gunicorn against a schema that is already in the target state. A useful side effect of separating it is that it pushes you toward backward-compatible migrations, because during a rolling deploy the old code briefly runs against the new schema — so the migration in this deploy must not break the currently-running version.',
        aHi: 'Agar web container ka command migrate ke baad gunicorn hai, toh migrate har baar ek container start hone par chalta hai. Ek deploy ke dauran aap aksar ek saath kई replicas start kar rahe ho — kehte hain aath pods ka ek rolling update — toh aapko aath processes milte hain jо sab ek saath ek hi database par wahi migrations apply karne ki koshish kar rahe hain. Wo django_migrations table par aur schema locks par contend karte hain, aur timing ke hisaab se aapko relation already exists jaisi failures milti hain. Migrations ek deploy-level operation hai jise theek ek baar hona chahिए, aur naya code chalane wale kisi bhi container ke traffic serve karne se pehle poora hona chahिए. Toh aap ise ek dedicated step mein chalाते ho: ek platform release phase, ek Kubernetes init container ya ek one-shot Job, ya ek compose service. Ise alag karne ka ek useful side effect ye hai ki ye aapko backward-compatible migrations ki taraf dhakelta hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django (`settings.configure`, `MIDDLEWARE=[]`). `from django.core.wsgi import get_wsgi_application` and `from django.core.asgi import get_asgi_application`; build both. Assert: both are `callable`; `inspect.iscoroutinefunction(wsgi_app.__call__)` is `False`; `inspect.iscoroutinefunction(asgi_app.__call__)` is `True`. Print the two deploy command shapes (`gunicorn ...:application` for WSGI, `uvicorn ...:application` / `gunicorn -k uvicorn.workers.UvicornWorker` for ASGI).',
        taskHi: 'Standalone Django. `get_wsgi_application` + `get_asgi_application`; dono banao. Assert: dono `callable`; `inspect.iscoroutinefunction(wsgi_app.__call__)` `False`; `inspect.iscoroutinefunction(asgi_app.__call__)` `True`. Do deploy command shapes print karo.',
        hint: '`import inspect`. The ASGI app\'s `__call__` is `async def` — that is the whole distinction. WSGI is `application(environ, start_response)`, sync; ASGI is `async application(scope, receive, send)`.',
        hintHi: '`import inspect`. ASGI app ka `__call__` `async def` hai — wahi poora antar hai.',
      },
      {
        task: 'A string `CONF` holding a realistic `gunicorn.conf.py`: `bind = os.environ.get("GUNICORN_BIND", "0.0.0.0:8000")`, `workers = int(os.environ.get("WEB_CONCURRENCY", (multiprocessing.cpu_count()*2)+1))`, `worker_class`, `timeout = 30`, `max_requests = 1000`, `max_requests_jitter = 50`, and a `def post_fork(server, worker): ...`. `exec(compile(CONF, "gunicorn.conf.py", "exec"), ns)` with `os.environ["WEB_CONCURRENCY"] = "4"` set -> assert `ns["workers"] == 4`, `ns["bind"] == "0.0.0.0:8000"`, `callable(ns["post_fork"])`. Then delete the env var, re-`exec` into `ns2`, and assert `ns2["workers"] == (multiprocessing.cpu_count()*2)+1`.',
        taskHi: 'Ek string `CONF` ek realistic `gunicorn.conf.py` rakhta hua. `exec(compile(CONF, ...), ns)` `os.environ["WEB_CONCURRENCY"] = "4"` set ke saath -> assert `ns["workers"] == 4`, `ns["bind"]`, `callable(ns["post_fork"])`. Phir env var delete karo, `ns2` mein re-`exec`, assert `ns2["workers"] == (cpu_count*2)+1`.',
        hint: 'A gunicorn config file is just a Python module gunicorn `exec`s — every top-level assignment becomes a setting. `WEB_CONCURRENCY` is the conventional env var (Heroku/Fly/Render set it) that overrides the computed default.',
        hintHi: 'Ek gunicorn config file bस ek Python module hai jise gunicorn `exec` karता hai — har top-level assignment ek setting ban jaati hai. `WEB_CONCURRENCY` conventional env var hai.',
      },
      {
        task: 'Standalone Django with `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")`, `MIDDLEWARE=[]`. A view returning `{"is_secure": request.is_secure(), "scheme": request.scheme}`. With `django.test.Client`: `client.get("/", HTTP_X_FORWARDED_PROTO="https")` -> assert `is_secure` is `True` and `scheme == "https"`; `client.get("/")` (no header) -> assert `is_secure` is `False` and `scheme == "http"`. Write one comment sentence on why this setting is required behind a TLS-terminating proxy.',
        taskHi: 'Standalone Django `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")` ke saath, `MIDDLEWARE=[]`. Ek view jо `{"is_secure": request.is_secure(), "scheme": request.scheme}` return kare. `Client` se: `HTTP_X_FORWARDED_PROTO="https"` -> `is_secure` `True`; bina header -> `False`. Ek comment vakya.',
        hint: 'nginx/an ALB terminates TLS and talks plain HTTP to Gunicorn, so `request.scheme` would always be `"http"` — Django only knows the original was HTTPS by trusting the `X-Forwarded-Proto` header the proxy sets. Without this setting `SECURE_SSL_REDIRECT` loops forever.',
        hintHi: 'nginx/ek ALB TLS terminate karта hai aur Gunicorn se plain HTTP bolта hai, toh `request.scheme` hamesha `"http"` hoगा — Django sirf proxy ke set kiye `X-Forwarded-Proto` header par bharosा karके jaanता hai ki original HTTPS thi.',
      },
    ],

    keyTakeaways: [
      '`runserver` is a DEV tool (single-process, unoptimised, no static with `DEBUG=False`). Production needs a real APPLICATION SERVER running your app in multiple worker processes.',
      'WSGI (`myproject/wsgi.py`, `application(environ, start_response)`) = SYNCHRONOUS, one request per worker at a time — the default, right for 99% of Django apps. ASGI (`myproject/asgi.py`, `async application(scope, receive, send)`) = ASYNC, one worker handles many I/O-waiting requests — for async views, WebSockets (Channels), SSE/long-poll.',
      'Running `async def` views under WSGI works but the worker is still held for the whole request — you get the syntax, not the concurrency. Deploy under ASGI (`gunicorn -k uvicorn.workers.UvicornWorker`) to get the benefit.',
      'Gunicorn: `--workers N` = PROCESSES (not threads), start at `(2×cores)+1`; more = more RAM + DB connections + CPU contention. `--worker-class` sync | gthread (`--threads N`, for I/O-bound sync) | UvicornWorker (async). `--timeout 30` kills a hung worker. `--max-requests 1000 --max-requests-jitter 50` recycles workers to bound slow memory growth.',
      'A `gunicorn.conf.py` is PLAIN PYTHON — compute `workers` from `multiprocessing.cpu_count()` or `WEB_CONCURRENCY`, read the bind from env, define `post_fork`/`worker_int` hooks.',
      'Put nginx / a cloud LB in FRONT: TLS termination + HTTP/2, static files, slow-client BUFFERING (frees the worker as soon as the response is produced), size/rate limits, `X-Forwarded-*`. Django then needs `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")` (Module 6) so `request.is_secure()` is correct.',
      'Docker: MULTI-STAGE (slim final image, no build toolchain), NON-ROOT (`USER app`), `collectstatic` at BUILD time, a `.dockerignore` (`.git`/`.venv`/`.env`/`node_modules`), ONE concern per container (web = gunicorn; separate containers for celery worker + beat, same image different `CMD`), `/livez`+`/readyz` health checks.',
      '`migrate` runs ONCE per deploy in a RELEASE step / init container / one-off task — BEFORE the new web containers take traffic. NEVER in the web `CMD` (N replicas race on `django_migrations` + schema locks). This also forces backward-compatible migrations (lesson 6).',
    ],
    keyTakeawaysHi: [
      '`runserver` ek DEV tool hai. Production ko ek real APPLICATION SERVER chahिए jо aapke app ko kई worker processes mein chalाता hai.',
      'WSGI (`myproject/wsgi.py`) = SYNCHRONOUS, ek samay prati worker ek request — default, 99% Django apps ke liye sahi. ASGI (`myproject/asgi.py`, `async application(scope, receive, send)`) = ASYNC — async views, WebSockets (Channels), SSE ke liye.',
      'WSGI ke tahat `async def` views chalाना kaam karता hai par worker abhi bhi poore request ke liye held hai — aapko syntax milता hai, concurrency nahi. Benefit ke liye ASGI ke tahat deploy karो.',
      'Gunicorn: `--workers N` = PROCESSES (threads nahi), `(2×cores)+1` par shuru; zyada = zyada RAM + DB connections. `--worker-class` sync | gthread | UvicornWorker. `--timeout 30` ek hung worker ko kill karता hai. `--max-requests 1000 --max-requests-jitter 50` workers recycle karता hai.',
      'Ek `gunicorn.conf.py` PLAIN PYTHON hai — `multiprocessing.cpu_count()` ya `WEB_CONCURRENCY` se `workers` compute karो, env se bind padhो, `post_fork` hooks define karो.',
      'nginx / ek cloud LB AAGE daalो: TLS termination + HTTP/2, static files, slow-client BUFFERING, size/rate limits, `X-Forwarded-*`. Django ko phir `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")` chahिए (Module 6).',
      'Docker: MULTI-STAGE, NON-ROOT (`USER app`), BUILD time par `collectstatic`, ek `.dockerignore`, prati container EK concern (web = gunicorn; celery worker + beat alag containers), `/livez`+`/readyz` health checks.',
      '`migrate` prati deploy EK BAAR ek RELEASE step / init container / one-off task mein chalता hai — naye web containers traffic lene se PEHLE. web `CMD` mein KABHI nahi. Ye backward-compatible migrations ko bhi majboor karता hai (lesson 6).',
    ],
  },

  {
    slug: 'dj-zero-downtime-migrations-and-async',
    title: 'Zero-Downtime Migrations & Async Views',
    titleHi: 'Zero-Downtime Migrations & Async Views',
    description: 'During a rolling deploy, the old code and the new code both run against the *same* database for a few minutes. A migration that the old code cannot tolerate — a dropped column, a renamed field, a new NOT NULL — causes errors for real users. The fix is a sequence of small, backward-compatible migrations. Plus: when `async def` views actually help.',
    descriptionHi: 'Ek rolling deploy ke dauran, purana code aur naya code dono kuch minute ke liye *usi* database ke against chalते hain. Ek migration jise purana code tolerate nahi kar sakta — ek dropped column, ek renamed field, ek naya NOT NULL — real users ke liye errors karता hai. Fix chhote, backward-compatible migrations ka ek sequence hai. Plus: jab `async def` views asal mein madad karते hain.',
    difficulty: 'HARD',
    duration: 22,
    order: 6,

    analogy: {
      en: '**Replacing the tyres on a moving car by swapping one at a time.** You cannot jack up all four at once — the car (your service) has to keep going. So you replace them one wheel at a time, and every intermediate state has to be *drivable*: three old tyres and one new one still rolls. A **destructive migration in one step** — dropping a column the old code still reads — is jacking up all four wheels: for the minute the old and new versions overlap, the old pods hit a column that is gone and throw 500s at real users. The backward-compatible way is a sequence where every step leaves the car drivable: add the new tyre alongside (add a nullable column), let the whole fleet start using it (deploy the code that writes both), fill it with air (backfill), tighten the bolts (add the constraint), and only once *nothing* touches the old tyre do you take it off (drop the column) — each as its own deploy. **Async views** are a separate idea: for a route that spends its time *waiting* on three slow upstreams, one worker can await all three at once instead of three workers each blocking on one.',
      hi: '**Ek chalti car ke tyres ek-ek karke swap karके badalna.** Aap chaaron ko ek saath jack up nahi kar sakte — car (aapki service) ko chalte rehna hai. Toh aap unhe ek wheel ek baar mein badalte ho, aur har intermediate state *drivable* honi chahिए: teen purane tyres aur ek naya abhi bhi rolls. Ek **destructive migration ek step mein** — ek column drop karna jise purana code abhi bhi padhता hai — chaaron wheels jack up karna hai: us minute ke liye jab purani aur nayi versions overlap karती hain, purani pods ek column hit karती hain jо gaya hai. Backward-compatible tarika ek sequence hai jahaan har step car ko drivable chhodता hai: naya tyre bagal mein add karो (ek nullable column add karो), poore fleet ko ise istemal karने do (dono likhने wala code deploy karो), ise hawa se bharo (backfill), bolts tight karो (constraint add karो), aur sirf jab *kuch bhi* purana tyre nahi chhoota tab ise nikaalो (column drop karो) — har ek apne deploy ke roop mein.',
    },

    simple: `**The problem: old + new code, one database**

\`\`\`
rolling deploy timeline:
  t0   all pods run v1
  t1   half run v1, half run v2   <-- BOTH hit the same DB for ~2 minutes
  t2   all pods run v2
if v2's migration removed something v1 needs -> v1 pods 500 during t1
\`\`\`

**Safe vs unsafe operations (during the overlap)**

\`\`\`
SAFE  (old code tolerates it)              UNSAFE (breaks old code, or locks the table)
----  ------------------------              ------  --------------------------------------
add a NULLable column                      add a NOT NULL column (no default) -> old INSERTs fail
add a new table / model                    drop a column old code still SELECTs
add an index CONCURRENTLY (Postgres)       rename a column / table  (old code uses the old name)
add a column with a DB default (fast)      change a column type in place (can rewrite + lock)
                                           add a unique constraint on existing data (may fail / lock)
\`\`\`

**The pattern: split one change into N deploys**

\`\`\`
Goal: make \`phone\` NOT NULL.

Deploy 1  migration: add \`phone\` as NULLable (+ maybe a DB default)
          code:      write \`phone\` on every create/update; tolerate NULL on read
Deploy 2  data migration (or a Module-8 backfill command): fill \`phone\` for old rows
Deploy 3  migration: add the NOT NULL constraint (now every row satisfies it)
          code:      can now assume \`phone\` is always set

Goal: rename \`name\` -> \`full_name\`.
Deploy 1  add \`full_name\`, copy on write to BOTH, read \`name or full_name\`
Deploy 2  backfill \`full_name\` from \`name\`
Deploy 3  read/write only \`full_name\`
Deploy 4  drop \`name\`
\`\`\`

**CI gate: no missing migrations**

\`\`\`bash
python manage.py makemigrations --check --dry-run
# exit 1 if a model change has no migration -> fail the build
# (a model + migration must land in the SAME commit)
\`\`\`

**\`SeparateDatabaseAndState\`** — tell Django "the DB already changed"

\`\`\`python
migrations.SeparateDatabaseAndState(
    state_operations=[migrations.AlterField(...)],   # update Django's model state
    database_operations=[],                          # ...but run NO SQL (you did it by hand / concurrently)
)
\`\`\`

**Async views — when they actually help**

\`\`\`python
async def dashboard(request):
    # THREE slow upstreams, awaited concurrently -> ~max(a,b,c), not a+b+c
    a, b, c = await asyncio.gather(fetch_billing(), fetch_usage(), fetch_tickets())
    stats = await sync_to_async(compute_from_db)()      # bridge the SYNC ORM into async
    return JsonResponse({...})
\`\`\`

\`\`\`
async helps      a view that spends its time WAITING on multiple I/O calls (APIs, cache, other services)
                 + deployed under ASGI (Uvicorn worker). Then one worker serves many such requests.
async does NOT   speed up CPU work, or a single DB query, or anything under a WSGI server
sync_to_async    call sync code (the ORM, most libraries) from an async view
async_to_sync    call an async function from sync code
NEVER            a blocking call (requests.get, time.sleep, a raw ORM query) directly in async def
                 -> it blocks the whole event loop, freezing every other request on that worker
\`\`\``,

    simpleHi: `**Problem: purana + naya code, ek database**

\`\`\`
rolling deploy timeline:
  t0   saari pods v1 chalाती hain
  t1   aadhी v1, aadhी v2 chalाती hain   <-- DONO ~2 minute ke liye ek hi DB hit karती hain
  t2   saari pods v2 chalाती hain
agar v2 ke migration ne kuch hataya jo v1 ko chahिए -> v1 pods t1 ke dauran 500
\`\`\`

**Safe vs unsafe operations (overlap ke dauran)**

\`\`\`
SAFE  (purana code tolerate karता hai)     UNSAFE (purana code todता hai, ya table lock karता hai)
----  --------------------------------      ------  ----------------------------------------
ek NULLable column add karो                ek NOT NULL column (no default) add karो -> purane INSERTs fail
ek nayi table / model add karो             ek column drop karो jo purana code abhi bhi SELECT karता hai
ek index CONCURRENTLY add karो (Postgres)  ek column / table rename karो
ek DB default waala column add karो (fast) ek column type jagah par badlो (rewrite + lock kar sakta hai)
                                           existing data par ek unique constraint add karो
\`\`\`

**Pattern: ek change ko N deploys mein split karो**

\`\`\`
Goal: \`phone\` ko NOT NULL banाओ.

Deploy 1  migration: \`phone\` NULLable add karो
          code:      har create/update par \`phone\` likhо; read par NULL tolerate karो
Deploy 2  data migration (ya ek Module-8 backfill command): purani rows ke liye \`phone\` bharо
Deploy 3  migration: NOT NULL constraint add karो
          code:      ab \`phone\` hamesha set maan sakta hai

Goal: \`name\` -> \`full_name\` rename.
Deploy 1  \`full_name\` add karो, write par DONO copy karो, \`name or full_name\` padhо
Deploy 2  \`name\` se \`full_name\` backfill karो
Deploy 3  sirf \`full_name\` read/write karो
Deploy 4  \`name\` drop karो
\`\`\`

**CI gate: koi missing migrations nahi**

\`\`\`bash
python manage.py makemigrations --check --dry-run
# exit 1 agar ek model change ka koi migration nahi -> build fail karो
# (ek model + migration ek hi commit mein aane chahिए)
\`\`\`

**\`SeparateDatabaseAndState\`** — Django ko batao "DB pehle hi badla"

\`\`\`python
migrations.SeparateDatabaseAndState(
    state_operations=[migrations.AlterField(...)],   # Django ka model state update karो
    database_operations=[],                          # ...par KOI SQL mat chalाओ
)
\`\`\`

**Async views — jab wo asal mein madad karते hain**

\`\`\`python
async def dashboard(request):
    a, b, c = await asyncio.gather(fetch_billing(), fetch_usage(), fetch_tickets())
    stats = await sync_to_async(compute_from_db)()      # SYNC ORM ko async mein bridge karो
    return JsonResponse({...})
\`\`\`

\`\`\`
async madad karता hai   ek view jо apna samay kई I/O calls par WAITING kharch karता hai
                        + ASGI ke tahat deployed. Phir ek worker aise kई requests serve karता hai.
async madad NAHI karता  CPU work speed up, ya ek single DB query, ya ek WSGI server ke tahat kuch bhi
sync_to_async           ek async view se sync code (ORM) call karो
async_to_sync           sync code se ek async function call karो
KABHI NAHI              async def mein seedhे ek blocking call (requests.get, time.sleep, ek raw ORM query)
                        -> ye poore event loop ko block karता hai, us worker par har doosri request freeze
\`\`\``,

    content: `## Why migrations must be backward-compatible

A **rolling deploy** replaces instances gradually — a few at a time — so the service never goes fully down. For a window of seconds to minutes, some instances run the **old** code and some run the **new** code, and they all talk to the **one** shared database. Migrations for the new version usually run *before* the new instances start (lesson 5), which means:

**During the overlap, the old code is running against the new schema.**

If deploy \`v2\` includes a migration that drops a column \`v1\` still \`SELECT\`s, then for the whole overlap window \`v1\` instances throw \`ProgrammingError: column does not exist\` on real requests. The database change and the code change cannot both happen "at once" — there is always an overlap.

## Safe and unsafe schema changes

**Safe** (the old code neither notices nor breaks):

- **Add a nullable column.** Old \`INSERT\`s omit it → \`NULL\`; old \`SELECT\`s do not ask for it.
- **Add a column with a database-level default** — on modern Postgres this is a metadata-only change (fast, no table rewrite).
- **Add a new table / model.** Nothing old references it.
- **Add an index** — use \`AddIndexConcurrently\` (Postgres) so it does not lock writes while building.
- **Drop an index**, add a **check constraint** that all existing rows already satisfy.

**Unsafe** (breaks old code, or locks the table for the duration of a rewrite):

- **Add \`NOT NULL\` without a default** — old \`INSERT\`s that don't set it fail immediately.
- **Drop a column** old code still reads or writes.
- **Rename a column or table** — Django's \`RenameField\` is a single \`ALTER\`; the old code uses the old name and breaks the instant it runs.
- **Change a column's type** in place — may rewrite the whole table under a lock.
- **Add a \`UNIQUE\` constraint** to a populated column — scans + locks, and fails if data has dupes.

## The pattern: one logical change, several deploys

Break every risky change into a sequence where **every intermediate state is valid for both the old and the new code**.

### Making a column \`NOT NULL\`

1. **Deploy 1** — migration: add the column as **nullable** (optionally with a DB default). Code: start **writing** the field on every create/update path; **tolerate \`NULL\`** when reading.
2. **Deploy 2** — a data migration or a batched backfill command (Module 8) fills the column for all existing rows. No code change.
3. **Deploy 3** — migration: add the \`NOT NULL\` constraint (every row now satisfies it, so it is fast and safe). Code: may now assume the field is always present.

### Renaming a field

Never \`RenameField\` in one step. Instead:

1. Add \`full_name\`; write to **both** \`name\` and \`full_name\`; read \`full_name or name\`.
2. Backfill \`full_name\` from \`name\`.
3. Switch reads and writes to \`full_name\` only.
4. Drop \`name\`.

### Dropping a column

1. Deploy code that **stops using** the column (no reads, no writes).
2. In a **later** deploy, run the \`RemoveField\` migration. (If anything might roll back to the previous version, wait longer.)

## CI gate: \`makemigrations --check\`

\`\`\`bash
python manage.py makemigrations --check --dry-run
\`\`\`

Exits non-zero if your models have changes that no migration file captures. Wire this into CI so a PR that edits a model without adding the migration **fails** — a model change and its migration must land in the same commit, or the next \`migrate\` in another environment does nothing and the schema silently diverges.

## \`SeparateDatabaseAndState\`

Sometimes you apply the DDL yourself — a \`CREATE INDEX CONCURRENTLY\` that Django's ORM can't express safely, or a change you ran by hand during an incident — and you just need Django's *migration state* to agree with reality without re-running the SQL:

\`\`\`python
operations = [
    migrations.SeparateDatabaseAndState(
        state_operations=[migrations.AddIndex(model_name="order", index=...)],
        database_operations=[],   # the index already exists; don't try to create it again
    ),
]
\`\`\`

\`state_operations\` update Django's picture of the schema; \`database_operations\` are the SQL actually run. Splitting them lets the two stay consistent when you have to step outside the normal flow.

## Async views — when they help, when they don't

An **\`async def\` view** is a coroutine. Under an **ASGI** server (lesson 5) a single worker can have many such views in progress, working on whichever ones are not currently \`await\`-ing on I/O.

**It helps** when a view's wall-clock time is dominated by *waiting on multiple independent I/O operations*:

\`\`\`python
async def dashboard(request):
    billing, usage, tickets = await asyncio.gather(
        http_get(BILLING_API), http_get(USAGE_API), http_get(TICKETS_API),
    )
    return JsonResponse({...})
\`\`\`

Three upstream calls that each take 200 ms run **concurrently** — the view takes ~200 ms, not 600 ms — and while it is waiting, the worker serves other requests.

**It does not help**:

- CPU-bound work (serialisation, image processing) — async gives you concurrency, not parallelism; the GIL still applies. Use a background job or a process pool.
- A single database query — one \`await\` on one thing is the same wall-clock time as sync.
- Anything under a **WSGI** server — Django runs the coroutine to completion inside the request, worker still blocked.

**The rules**:

- **Never make a blocking call inside \`async def\`** — \`requests.get(...)\`, \`time.sleep(...)\`, a bare ORM query (\`Order.objects.count()\`), \`open(...).read()\`. A blocking call inside the event loop freezes **every** request on that worker until it returns. Use an async HTTP client (\`httpx.AsyncClient\`, \`aiohttp\`), \`asyncio.sleep\`, and the async ORM (\`await Order.objects.acount()\`, \`async for\`) or \`sync_to_async(...)\`.
- **\`sync_to_async(fn)\`** — wrap a synchronous function (the sync ORM, a sync library) so you can \`await\` it from async code; it runs in a thread pool.
- **\`async_to_sync(coro)\`** — call an async function from synchronous code (a management command, a sync view).
- Django's ORM has async methods (\`aget\`, \`acreate\`, \`acount\`, \`aexists\`, \`async for obj in qs\`) but they are wrappers — the driver is still sync under the hood for most backends. Async shines for *external* I/O, less so for the DB.

For most apps, sync views under a well-sized Gunicorn are simpler and fast enough. Reach for async when you genuinely have I/O fan-out or many idle long-lived connections.`,

    contentHi: `## Migrations backward-compatible kyun hone chahिए

Ek **rolling deploy** instances ko dheere-dheere replace karता hai. Seconds se minutes ki ek window ke liye, kuch instances **purana** code chalाते hain aur kuch **naya**, aur wo sab **ek** shared database se baat karते hain. Naye version ke liye migrations aksar naye instances start hone se *pehle* chalते hain (lesson 5), jiska matlab:

**Overlap ke dauran, purana code naye schema ke against chal raha hai.**

Agar deploy \`v2\` mein ek migration hai jо ek column drop karता hai jise \`v1\` abhi bhi \`SELECT\` karता hai, toh poore overlap window ke liye \`v1\` instances real requests par \`ProgrammingError\` throw karते hain.

## Safe aur unsafe schema changes

**Safe**: ek nullable column add karो; ek DB-level default waala column add karो; ek nayi table add karो; ek index \`CONCURRENTLY\` add karो; ek check constraint add karो jise saari existing rows pehle se satisfy karती hain.

**Unsafe**: bina default ke \`NOT NULL\` add karो; ek column drop karो jise purana code padhता hai; ek column/table rename karो; ek column ka type jagah par badlो; ek populated column par \`UNIQUE\` constraint add karो.

## Pattern: ek logical change, kई deploys

Har risky change ko ek sequence mein toड़ो jahaan **har intermediate state purane aur naye code dono ke liye valid hai**.

### Ek column ko \`NOT NULL\` banाना

1. **Deploy 1** — migration: column ko **nullable** add karो. Code: har create/update par field **likhना** shuru karो; read par **\`NULL\` tolerate karो**.
2. **Deploy 2** — ek data migration ya ek batched backfill command (Module 8) column ko saari existing rows ke liye bharता hai.
3. **Deploy 3** — migration: \`NOT NULL\` constraint add karो. Code: ab field ko hamesha present maan sakta hai.

### Ek field rename karना

Kabhi ek step mein \`RenameField\` nahi. Iske bजाy: \`full_name\` add karो; **dono** likhो; \`full_name or name\` padhो. Phir backfill. Phir sirf \`full_name\`. Phir \`name\` drop karो.

## CI gate: \`makemigrations --check\`

\`python manage.py makemigrations --check --dry-run\` non-zero exit karता hai agar aapke models mein changes hain jinhe koi migration file capture nahi karती. Ise CI mein wire karो — ek model change aur iska migration ek hi commit mein aane chahिए.

## \`SeparateDatabaseAndState\`

Kabhi aap DDL khud apply karते ho — ek \`CREATE INDEX CONCURRENTLY\` — aur aapको bस Django ke *migration state* ko reality se agree karना hai bina SQL dobara chalाye. \`state_operations\` Django ki schema ki picture update karते hain; \`database_operations\` asal mein chalayi SQL hain.

## Async views — jab wo madad karते hain

Ek **\`async def\` view** ek coroutine hai. Ek **ASGI** server ke tahat ek single worker aise kई views in progress rakh sakta hai.

**Ye madad karता hai** jab ek view ka wall-clock time *kई swतंtra I/O operations par waiting* se dominated hai: teen upstream calls jо har ek 200 ms leते hain **concurrently** chalते hain — view ~200 ms leता hai, 600 ms nahi.

**Ye madad NAHI karता**: CPU-bound work; ek single database query; ek WSGI server ke tahat kuch bhi.

**Niyam**:

- **\`async def\` ke andar kabhi ek blocking call mat karो** — \`requests.get(...)\`, \`time.sleep(...)\`, ek bare ORM query. Ek blocking call event loop ke andar us worker par **har** request ko freeze karता hai. Ek async HTTP client, \`asyncio.sleep\`, aur async ORM (\`await Order.objects.acount()\`) ya \`sync_to_async(...)\` istemal karो.
- **\`sync_to_async(fn)\`** — ek synchronous function ko wrap karो taaki aap ise async code se \`await\` kar sako.
- **\`async_to_sync(coro)\`** — synchronous code se ek async function call karो.

Zyादातr apps ke liye, ek well-sized Gunicorn ke tahat sync views saral aur kaafi tez hain. Async ke liye tab pahुँcho jab aapke paas sach mein I/O fan-out ho.`,

    examples: [
      {
        title: 'makemigrations --check as a CI gate: exit 1 when a model has no migration',
        titleHi: 'makemigrations --check ek CI gate ke roop mein: model ka migration na hone par exit 1',
        code: `import subprocess, sys, tempfile, os, textwrap

d = tempfile.mkdtemp()
os.makedirs(os.path.join(d, "shop", "migrations"))
open(os.path.join(d, "shop", "__init__.py"), "w").write("")
open(os.path.join(d, "shop", "migrations", "__init__.py"), "w").write("")
open(os.path.join(d, "shop", "models.py"), "w").write(textwrap.dedent("""
    from django.db import models
    class Product(models.Model):
        name = models.CharField(max_length=50)
"""))
open(os.path.join(d, "settings.py"), "w").write(textwrap.dedent("""
    SECRET_KEY = "x" * 50
    INSTALLED_APPS = ["shop"]
    DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}}
    DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
"""))
env = {**os.environ, "DJANGO_SETTINGS_MODULE": "settings", "PYTHONPATH": d}

def check():
    r = subprocess.run([sys.executable, "-m", "django", "makemigrations", "--check", "--dry-run"],
                       cwd=d, env=env, capture_output=True, text=True)
    return r.returncode, (r.stdout + r.stderr).strip().splitlines()[-1]

rc, msg = check()
print("model with NO migration yet:  exit", rc, "|", msg.strip())

subprocess.run([sys.executable, "-m", "django", "makemigrations", "shop"],
               cwd=d, env=env, capture_output=True, text=True)
rc, msg = check()
print("after makemigrations shop:     exit", rc, "|", msg.strip())

# add a field but DON'T make the migration -> CI must catch it
open(os.path.join(d, "shop", "models.py"), "w").write(textwrap.dedent("""
    from django.db import models
    class Product(models.Model):
        name = models.CharField(max_length=50)
        price = models.IntegerField(default=0)
"""))
rc, msg = check()
print("field added, migration missing: exit", rc, "|", msg.strip())`,
        output: `model with NO migration yet:  exit 1 | + Create model Product
after makemigrations shop:     exit 0 | No changes detected
field added, migration missing: exit 1 | + Add field price to product`,
        explain: 'makemigrations --check --dry-run exits non-zero when the models have changes that no migration file captures. Before any migration exists, the models define Product with no migration for it -- exit 1, and the dry-run shows it would create the model. After running makemigrations, the check is clean -- exit 0, No changes detected. Then adding a price field without generating the migration makes it fail again -- exit 1, it would add the field. Wired into CI, this fails a PR that edits a model without committing its migration, which must land in the same commit.',
        explainHi: 'makemigrations --check --dry-run non-zero exit karta hai jab models mein changes hain jinhe koi migration file capture nahi karti. Kisi migration ke exist hone se pehle, models Product define karte hain bina iske liye migration ke -- exit 1. makemigrations chalane ke baad, check saaf hai -- exit 0. Phir ek price field add karna bina migration generate kiye ise phir fail karta hai -- exit 1. CI mein wired, ye ek PR ko fail karta hai jo ek model edit karता hai bina iski migration commit kiye.',
      },
      {
        title: 'The add-nullable -> backfill -> add-constraint sequence, as three migration ops',
        titleHi: 'add-nullable -> backfill -> add-constraint sequence, teen migration ops ke roop mein',
        code: `import django
from django.conf import settings
settings.configure(SECRET_KEY="x" * 50,
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection, migrations
from django.db.migrations.state import ProjectState

class Member(models.Model):
    name = models.CharField(max_length=50)
    phone = models.CharField(max_length=20, null=True)     # step 1: NULLABLE
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Member)

# step 1 already applied (nullable column). Old code can INSERT without phone:
Member.objects.create(name="Ada")                          # phone stays NULL -- old code is fine
Member.objects.create(name="Bo", phone="555-0100")         # new code writes it
print("after step 1:", list(Member.objects.values_list("name", "phone")))

# step 2: backfill (a data migration / Module-8 batched command)
Member.objects.filter(phone__isnull=True).update(phone="000-0000")
print("after step 2 (backfill):", list(Member.objects.values_list("name", "phone")))

# step 3: NOW the NOT NULL constraint is safe -- every row satisfies it
with connection.schema_editor() as se:
    old = Member._meta.get_field("phone")
    new = models.CharField(max_length=20, null=False)
    new.set_attributes_from_name("phone")
    se.alter_field(Member, old, new)
print("after step 3: phone is NOT NULL and every row has a value")

# what a single-step 'add NOT NULL, no default' would have done to old INSERTs:
print()
print("if step 3 had been deploy 1: old pods doing Member(name=...) with no phone -> IntegrityError")`,
        output: `after step 1: [('Ada', None), ('Bo', '555-0100')]
after step 2 (backfill): [('Ada', '000-0000'), ('Bo', '555-0100')]
after step 3: phone is NOT NULL and every row has a value

if step 3 had been deploy 1: old pods doing Member(name=...) with no phone -> IntegrityError`,
        explain: 'Step 1 (already applied) added phone as nullable, so old code doing Member(name=...) with no phone inserts a NULL and is fine, while new code writes a real value. Step 2 is the backfill: every row that is still NULL gets a placeholder. Only after step 2 is step 3 -- adding the NOT NULL constraint -- safe, because every row now satisfies it, so the ALTER is fast and does not fail. Had step 3 been deploy 1 (add NOT NULL with no default in one migration), old pods still inserting without phone during the rolling deploy would hit an IntegrityError on real requests.',
        explainHi: 'Step 1 (pehle se applied) ne phone ko nullable add kiya, toh bina phone ke Member(name=...) karne wala purana code ek NULL insert karta hai aur theek hai, jabki naya code ek real value likhta hai. Step 2 backfill hai: har row jo abhi bhi NULL hai use ek placeholder milta hai. Sirf step 2 ke baad step 3 -- NOT NULL constraint add karna -- safe hai, kyunki ab har row ise satisfy karti hai. Agar step 3 deploy 1 hota, rolling deploy ke dauran bina phone ke insert karti purani pods ek IntegrityError hit karti.',
      },
      {
        title: 'An async view: three awaits concurrently, and sync_to_async to reach the ORM',
        titleHi: 'Ek async view: teen awaits concurrently, aur ORM tak pahunchne ko sync_to_async',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], MIDDLEWARE=[])
django.setup()

import asyncio, time, inspect
from django.http import JsonResponse
from django.urls import path
from django.test import AsyncClient
from asgiref.sync import sync_to_async

SYNC_CALLS = []
def read_from_db():                       # a stand-in for a blocking ORM call
    SYNC_CALLS.append(1)
    return {"rows": 3}

async def slow_upstream(name, ms):
    await asyncio.sleep(ms / 1000)
    return name

async def dashboard(request):
    t0 = time.perf_counter()
    a, b, c = await asyncio.gather(       # three "200ms" calls -> ~200ms total, not 600
        slow_upstream("billing", 20),
        slow_upstream("usage", 20),
        slow_upstream("tickets", 20),
    )
    db = await sync_to_async(read_from_db)()   # bridge the sync ORM into the event loop
    return JsonResponse({"sources": [a, b, c], **db,
                         "elapsed_ms": round((time.perf_counter() - t0) * 1000)})

urlpatterns = [path("dash/", dashboard)]

async def main():
    c = AsyncClient()
    r = await c.get("/dash/")
    body = r.json()
    print("view is a coroutine function:", inspect.iscoroutinefunction(dashboard))
    print("status:", r.status_code)
    print("sources:", body["sources"], "| db rows:", body["rows"])
    print("elapsed ~= one upstream, not the sum:", body["elapsed_ms"] < 60)
    print("sync ORM call bridged once:", SYNC_CALLS)

asyncio.run(main())`,
        output: `view is a coroutine function: True
status: 200
sources: ['billing', 'usage', 'tickets'] | db rows: 3
elapsed ~= one upstream, not the sum: True
sync ORM call bridged once: [1]`,
        explain: 'The dashboard view is a coroutine. asyncio.gather runs the three slow_upstream calls concurrently, so the view finishes in about the time of one call rather than the sum -- elapsed is well under the 3x total. The upstreams are awaited; the one synchronous piece, read_from_db, is bridged into the event loop with sync_to_async, which runs it in a thread so it does not block. AsyncClient drives the whole thing. This is the shape where async genuinely helps: a view whose wall-clock time is dominated by waiting on multiple independent I/O calls, served under ASGI.',
        explainHi: 'dashboard view ek coroutine hai. asyncio.gather teen slow_upstream calls ko concurrently chalata hai, toh view sum ke bजाy ek call ke samay mein khatam hota hai -- elapsed 3x total se kaafi neeche hai. upstreams awaited hain; ek synchronous tुkda, read_from_db, sync_to_async se event loop mein bridged hai, jo ise ek thread mein chalata hai toh ye block nahi karta. AsyncClient poori cheez drive karta hai. Ye wo shape hai jahaan async sach mein madad karta hai: ek view jiska wall-clock time kई swतंtra I/O calls par waiting se dominated hai, ASGI ke tahat served.',
      },
    ],

    mistakes: [
      {
        wrong: `# one migration in the v2 deploy:
operations = [
    migrations.RenameField("order", "ref", "reference_code"),
    migrations.RemoveField("order", "legacy_status"),
]
# during the rolling deploy, v1 pods still SELECT "ref" and "legacy_status" -> 500s for real users`,
        right: `# v2 deploy: add the new, keep the old, write both
migrations.AddField("order", "reference_code", models.CharField(max_length=20, null=True))
# v2 code: read reference_code or ref; write both
# v3 deploy: backfill reference_code from ref
# v4 code: use reference_code only
# v5 deploy: RemoveField("order", "ref")  and  RemoveField("order", "legacy_status")`,
        why: 'A rename or a column drop is instantaneous at the database level, but the *code* on the old pods does not know about it. For the minutes that v1 and v2 overlap during a rolling deploy, v1 is issuing `SELECT ref, legacy_status FROM order` against a schema where those columns no longer exist — every such request 500s. The database and the code can never change atomically together; there is always an overlap window. Every schema change that the currently-running version depends on must be split so that each deployed step leaves both versions able to run: add alongside, migrate reads/writes, then remove in a much later deploy.',
        whyHi: 'Ek rename ya ek column drop database level par turant hai, par purani pods par *code* iske baare mein nahi jaanता. Un minuton ke liye jab v1 aur v2 overlap karते hain, v1 ek schema ke against `SELECT ref, legacy_status FROM order` issue kar raha hai jahaan wo columns ab exist nahi karते — har aisi request 500. Database aur code kabhi atomically saath nahi badal sakte. Har schema change jispar currently-running version depend karता hai split hona chahिए.',
      },
      {
        wrong: `async def sync_all(request):
    for account in Account.objects.all():          # a BLOCKING ORM query in async def
        resp = requests.get(f"{API}/{account.id}")  # a BLOCKING http call in async def
        time.sleep(0.5)                              # and a BLOCKING sleep
    return JsonResponse({"ok": True})
# every one of these freezes the entire event loop -> all other requests on this worker stall`,
        right: `async def sync_all(request):
    account_ids = [a.id async for a in Account.objects.values_list("id", flat=True)]
    async with httpx.AsyncClient() as client:
        await asyncio.gather(*(client.get(f"{API}/{aid}") for aid in account_ids))
    return JsonResponse({"ok": True})
# or keep the view sync and enqueue the whole job to Celery (Module 8) -- often the better answer`,
        why: 'An `async def` view runs on the event loop. Any *synchronous, blocking* call inside it — a plain ORM query, `requests.get`, `time.sleep`, file I/O — does not yield control back to the loop, so for the entire duration of that blocking call, the worker cannot make progress on any other request. One slow blocking call in one async view stalls every concurrent request on that worker. Inside `async def` you must use non-blocking equivalents: `async for` / `await qs.acount()` for the ORM (or `sync_to_async`), `httpx.AsyncClient` for HTTP, `asyncio.sleep`. And if the work is a batch job, it usually should not be a request at all — enqueue it (Module 8).',
        whyHi: 'Ek `async def` view event loop par chalता hai. Iske andar koi bhi *synchronous, blocking* call — ek plain ORM query, `requests.get`, `time.sleep` — loop ko control wapas nahi deती, toh us blocking call ki poori avधि ke liye, worker kisi doosri request par progress nahi kar sakta. Ek async view mein ek dheема blocking call us worker par har concurrent request ko stall karता hai. `async def` ke andar aapको non-blocking equivalents istemal karne hi honge.',
      },
      {
        wrong: `# team practice: "add the migration in a follow-up PR to keep the model PR clean"
#   PR #1: edit models.py  (merged, deployed)
#   PR #2: python manage.py makemigrations  (merged next week)
# between the two deploys, the running code expects fields the DB doesn't have`,
        right: `# a model change and its migration ALWAYS land in the same commit/PR.
# CI gate:
#   python manage.py makemigrations --check --dry-run   ->  fails the PR if a migration is missing`,
        why: 'A model field and the migration that creates its column are one change, not two. If they land in separate deploys, the first deploy ships code that reads or writes a column the database does not have yet — instant errors — or (if the field is only read defensively) a schema that silently drifts from the models until someone runs `makemigrations` and gets a surprise diff. Keep them in the same commit, and add `makemigrations --check --dry-run` to CI so a model edit without its migration cannot be merged.',
        whyHi: 'Ek model field aur us migration jо iska column banाता hai ek change hai, do nahi. Agar wo alag deploys mein aate hain, pehla deploy aisा code ship karता hai jо ek column padhता ya likhता hai jо database ke paas abhi nahi hai. Unhe ek hi commit mein rakhо, aur CI mein `makemigrations --check --dry-run` add karो.',
      },
    ],

    realWorld: [
      {
        en: '**Every schema change reviewed for rolling-deploy safety** — a checklist on the migration PR ("does the currently-deployed code tolerate this?"), risky changes split into add / backfill / constrain / drop across separate deploys, `AddIndexConcurrently` for Postgres indexes, and a batched backfill command (Module 8) rather than a `RunPython` loop for anything over ~100k rows.',
        hi: '**Har schema change rolling-deploy safety ke liye reviewed** — migration PR par ek checklist, risky changes add / backfill / constrain / drop mein split, Postgres indexes ke liye `AddIndexConcurrently`, aur ek batched backfill command (Module 8).',
      },
      {
        en: '**`makemigrations --check --dry-run` + `check --deploy` + the test suite as CI gates** — a model edit without a migration, a missing `SECURE_*`, or a failing test all block the merge, so the deploy pipeline only ever ships a green, migration-complete build.',
        hi: '**CI gates: `makemigrations --check --dry-run` + `check --deploy` + test suite** — ek migration ke bina ek model edit, ek missing `SECURE_*`, ya ek failing test sab merge block karते hain.',
      },
      {
        en: '**Async only where the fan-out is real** — a "customer 360" endpoint that aggregates billing + usage + support + CRM in parallel runs `async def` under a Uvicorn worker; everything else stays sync under Gunicorn. `httpx.AsyncClient` for the upstreams, `sync_to_async` for the one local DB read.',
        hi: '**Async sirf jahaan fan-out asli hai** — ek "customer 360" endpoint jо billing + usage + support + CRM parallel mein aggregate karता hai `async def` chalाता hai ek Uvicorn worker ke tahat; baaki sab Gunicorn ke tahat sync rehta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why must a migration be backward-compatible, and how do you make a column `NOT NULL` with zero downtime?',
        qHi: 'Ek migration backward-compatible kyun hona chahिए, aur aap zero downtime ke saath ek column ko `NOT NULL` kaise banाते ho?',
        a: 'A rolling deploy replaces instances a few at a time so the service stays up, which means there is a window — seconds to minutes — where some instances run the old code and some run the new code, and all of them share one database. Migrations for the new version typically run before the new instances start taking traffic, so during that overlap the old code is executing against the new schema. If the new migration removed or renamed something the old code still uses, every request handled by an old instance during the overlap fails. The database change and the code change can never be truly simultaneous, so any schema change the currently-running version depends on has to be safe for both versions. To make a column NOT NULL with no downtime you split it into three deploys. First deploy: a migration that adds the column as nullable, possibly with a database default, plus code that starts writing the column on every create and update path while still tolerating null when it reads. This is safe because old instances simply do not set the column and old selects do not ask for it. Second deploy: a data migration, or better a batched backfill command for a large table, that fills the column for every existing row. No code change. Third deploy: a migration that adds the NOT NULL constraint — which is now fast and safe because every row already has a value — and code that may finally assume the field is always present. If you had done the single-step version, adding NOT NULL with no default in one migration, then during the very first overlap window old instances doing an insert without that field would hit an integrity error on real user requests.',
        aHi: 'Ek rolling deploy instances ko kuch-kuch karके replace karता hai taaki service up rahe, jiska matlab ek window hai jahaan kuch instances purana code chalाते hain aur kuch naya, aur wo sab ek database share karते hain. Naye version ke liye migrations aksar naye instances traffic lene se pehle chalते hain, toh us overlap ke dauran purana code naye schema ke against execute kar raha hai. Agar naye migration ne kuch hataya ya rename kiya jise purana code abhi bhi istemal karता hai, overlap ke dauran ek purane instance dwara handle ki har request fail hoती hai. Ek column ko bina downtime ke NOT NULL banाने ke liye aap ise teen deploys mein split karते ho. Pehla deploy: ek migration jо column ko nullable add karता hai, plus code jо column likhना shuru karता hai. Doosra deploy: ek data migration ya ek batched backfill command jо column ko har existing row ke liye bharता hai. Teesra deploy: ek migration jо NOT NULL constraint add karता hai.',
      },
      {
        q: 'When does an `async def` view actually improve things, and what must you never do inside one?',
        qHi: 'Ek `async def` view asal mein cheezein kab behtar banाता hai, aur iske andar aapको kabhi kya nahi karना chahिए?',
        a: 'An async view helps when the view spends most of its wall-clock time waiting on multiple independent I/O operations, and it is deployed under an ASGI server so a worker can actually interleave requests. The canonical case is a view that needs data from several upstream services — say billing, usage, and support APIs — where each call takes a couple hundred milliseconds. Awaited concurrently with asyncio dot gather, the three run in parallel and the view finishes in about the time of the slowest one instead of the sum, and while it is waiting the worker serves other requests. It does not help for CPU-bound work, because async gives concurrency not parallelism and the GIL still applies — heavy serialisation or image processing belongs in a background job or a process pool. It does not help for a single database query, since one await on one thing takes the same wall-clock time as the sync version. And it does nothing under a WSGI server, where Django just runs the coroutine to completion inside the request with the worker still blocked. What you must never do inside an async view is make a synchronous blocking call — a plain ORM query, requests dot get, time dot sleep, blocking file I/O. The async view runs on the event loop, and a blocking call does not yield control back, so for its entire duration the worker cannot progress any other request. One slow blocking call stalls every concurrent request on that worker, which is worse than the sync model. Inside async you use the non-blocking equivalents: async for and the a-prefixed ORM methods or sync_to_async to reach the ORM, httpx or aiohttp for HTTP, asyncio dot sleep. And often the honest answer for a batch job is not an async view at all but enqueueing the work to Celery.',
        aHi: 'Ek async view tab madad karता hai jab view apna zyादातr wall-clock time kई swतंtra I/O operations par waiting kharch karता hai, aur ye ek ASGI server ke tahat deployed hai. Canonical case ek view hai jise kई upstream services se data chahिए — kehte hain billing, usage, aur support APIs — jahaan har call kuch sau milliseconds leता hai. asyncio dot gather ke saath concurrently awaited, teen parallel mein chalते hain aur view sabse dheeme ke samay mein khatam hoता hai sum ke bजाy. Ye CPU-bound work ke liye madad nahi karता. Ye ek single database query ke liye madad nahi karता. Aur ye ek WSGI server ke tahat kuch nahi karता. Aapको ek async view ke andar kabhi jо nahi karना chahिए wo ek synchronous blocking call hai — ek plain ORM query, requests dot get, time dot sleep. Async view event loop par chalता hai, aur ek blocking call control wapas nahi deती, toh iski poori avधि ke liye worker kisi doosri request ko progress nahi kar sakta.',
      },
    ],

    exercises: [
      {
        task: 'Build a temp Django app on disk (`shop/models.py` with `Product(name)`, `shop/migrations/` package, `settings.py`, `DJANGO_SETTINGS_MODULE=settings` via env). A `check()` helper that runs `python -m django makemigrations --check --dry-run` via `subprocess` and returns `(returncode, last_line)`. Assert: before any migration -> exit `1`, last line mentions `Create model Product`; after `python -m django makemigrations shop` -> exit `0`, `No changes detected`; after adding a `price` field to the model without making the migration -> exit `1`, last line mentions `Add field price`.',
        taskHi: 'Disk par ek temp Django app banao (`shop/models.py` `Product(name)`, `shop/migrations/` package, `settings.py`). Ek `check()` helper jо `makemigrations --check --dry-run` `subprocess` se chalाe. Assert: kisi migration se pehle -> exit `1`; `makemigrations shop` ke baad -> exit `0`; ek `price` field add karke bina migration -> exit `1`.',
        hint: '`subprocess.run([sys.executable, "-m", "django", "makemigrations", "--check", "--dry-run"], cwd=d, env={..., "DJANGO_SETTINGS_MODULE": "settings", "PYTHONPATH": d})`. Non-zero exit = "your models changed and there is no migration for it" — the CI gate.',
        hintHi: '`subprocess.run([sys.executable, "-m", "django", "makemigrations", "--check", "--dry-run"], cwd=d, env={...})`. Non-zero exit = CI gate.',
      },
      {
        task: 'Standalone Django (SQLite). Model `Member(name, phone = CharField(null=True))` — i.e. STEP 1 (nullable) already applied via `schema_editor.create_model`. (a) `Member.objects.create(name="Ada")` (old code, no phone) and `Member.objects.create(name="Bo", phone="555-0100")` (new code); assert Ada\'s phone is `None`. (b) STEP 2 backfill: `Member.objects.filter(phone__isnull=True).update(phone="000-0000")`; assert no phone is `None`. (c) STEP 3: use `schema_editor.alter_field` to change `phone` to `null=False`; assert it succeeds (every row has a value). Print one line explaining what step 3 as "deploy 1" would have done to Ada\'s insert.',
        taskHi: 'Standalone Django (SQLite). `Member(name, phone = CharField(null=True))` — STEP 1 (nullable) pehle se applied. (a) `create(name="Ada")` + `create(name="Bo", phone=...)`; assert Ada ka phone `None`. (b) STEP 2 backfill: `filter(phone__isnull=True).update(phone="000-0000")`. (c) STEP 3: `schema_editor.alter_field` se `phone` ko `null=False`; assert safal. Ek line: step 3 as "deploy 1" Ada ke insert ko kya karता.',
        hint: 'To `alter_field`: `old = Member._meta.get_field("phone")`, `new = models.CharField(max_length=20, null=False)`, `new.set_attributes_from_name("phone")`, `se.alter_field(Member, old, new)`. Step 3 is only safe because step 2 made every row satisfy the constraint.',
        hintHi: '`alter_field` ke liye: `old = Member._meta.get_field("phone")`, `new = models.CharField(..., null=False)`, `new.set_attributes_from_name("phone")`, `se.alter_field(Member, old, new)`. Step 3 sirf isliye safe hai kyunki step 2 ne har row ko constraint satisfy karवाया.',
      },
      {
        task: 'Standalone Django, `MIDDLEWARE=[]`. An `async def dashboard(request)` that: `await asyncio.gather(slow("a", 20), slow("b", 20), slow("c", 20))` where `slow(name, ms)` does `await asyncio.sleep(ms/1000); return name`; then `db = await sync_to_async(read_from_db)()` where `read_from_db` appends to a `SYNC_CALLS` list and returns `{"rows": 3}`; return `JsonResponse` with the three names, the rows, and `elapsed_ms`. With `AsyncClient` inside `asyncio.run(main())`: assert `inspect.iscoroutinefunction(dashboard)`, status `200`, the three sources are present, `rows == 3`, `elapsed_ms < 60` (concurrent, not 3×20+), and `SYNC_CALLS == [1]`.',
        taskHi: 'Standalone Django, `MIDDLEWARE=[]`. Ek `async def dashboard(request)` jо `await asyncio.gather(slow("a", 20), slow("b", 20), slow("c", 20))` kare; phir `db = await sync_to_async(read_from_db)()`. `AsyncClient` + `asyncio.run(main())` se: assert `iscoroutinefunction`, `200`, teen sources, `rows == 3`, `elapsed_ms < 60`, `SYNC_CALLS == [1]`.',
        hint: '`from django.test import AsyncClient`; `from asgiref.sync import sync_to_async`; `import inspect`. `asyncio.gather` runs the three `sleep`s concurrently so the total is ~20ms not ~60ms. `sync_to_async` is how an async view calls the (sync) ORM.',
        hintHi: '`from django.test import AsyncClient`; `from asgiref.sync import sync_to_async`. `asyncio.gather` teen `sleep`s concurrently chalाता hai. `sync_to_async` async view se sync ORM call karने ka tarika hai.',
      },
    ],

    keyTakeaways: [
      'ROLLING DEPLOY = old + new code run against the SAME database for seconds-to-minutes. Migrations run BEFORE the new pods take traffic -> during the overlap the OLD code runs against the NEW schema. A migration the old code can\'t tolerate = 500s for real users.',
      'SAFE during overlap: add a NULLable column, add a column with a DB default, add a new table/model, `AddIndexConcurrently` (Postgres), add a constraint all rows already satisfy. UNSAFE: `NOT NULL` without a default, DROP a column old code uses, RENAME a column/table, change a type in place, add UNIQUE to populated data.',
      'THE PATTERN: split one logical change into N backward-compatible deploys where every intermediate state is valid for BOTH versions. `NOT NULL`: (1) add nullable + write it + tolerate NULL, (2) backfill, (3) add the constraint. RENAME: add new + write both + read either -> backfill -> read/write new only -> drop old (4 deploys).',
      'DROP a column: first deploy code that STOPS using it; in a LATER deploy run `RemoveField`. A model field and its migration MUST land in the SAME commit.',
      'CI GATE: `python manage.py makemigrations --check --dry-run` exits non-zero if a model change has no migration -> fail the PR. Pair with `check --deploy` + the test suite.',
      '`SeparateDatabaseAndState(state_operations=[...], database_operations=[])` = "update Django\'s model state but run NO SQL" — for a `CREATE INDEX CONCURRENTLY` done outside the ORM, or a hand-applied change.',
      'ASYNC VIEW helps ONLY when: the view spends its time WAITING on MULTIPLE independent I/O calls (`asyncio.gather`) AND it\'s deployed under ASGI. Does NOT help: CPU work, a single query, anything under WSGI. `async def` under WSGI = the syntax without the concurrency.',
      'NEVER a blocking call inside `async def` (`requests.get`, `time.sleep`, a bare ORM query) — it freezes the WHOLE event loop, stalling every other request on that worker. Use `httpx.AsyncClient`, `asyncio.sleep`, `await qs.acount()`/`async for`, or `sync_to_async(fn)` (sync->async) / `async_to_sync(coro)` (async->sync). Often the honest answer is a Celery job, not an async view.',
    ],
    keyTakeawaysHi: [
      'ROLLING DEPLOY = purana + naya code USI database ke against seconds-se-minutes chalते hain. Migrations naye pods ke traffic lene se PEHLE chalते hain -> overlap ke dauran PURANA code NAYE schema ke against chalता hai. Ek migration jise purana code tolerate nahi kar sakta = real users ke liye 500s.',
      'Overlap ke dauran SAFE: ek NULLable column add karो, ek DB default waala column, ek nayi table, `AddIndexConcurrently` (Postgres), ek constraint jise saari rows pehle se satisfy karती hain. UNSAFE: bina default ke `NOT NULL`, ek column DROP jise purana code istemal karता hai, ek column/table RENAME, jagah par type badalना, populated data par UNIQUE add karना.',
      'PATTERN: ek logical change ko N backward-compatible deploys mein split karो jahaan har intermediate state DONO versions ke liye valid hai. `NOT NULL`: (1) nullable add + likhो + NULL tolerate, (2) backfill, (3) constraint add. RENAME: naya add + dono likhо -> backfill -> sirf naya -> purana drop (4 deploys).',
      'Ek column DROP karो: pehle aisा code deploy karो jо ise ISTEMAL KARNA BAND kare; ek BAAD ke deploy mein `RemoveField` chalाओ. Ek model field aur iska migration ek hi commit mein aane CHAHIYE.',
      'CI GATE: `python manage.py makemigrations --check --dry-run` non-zero exit karता hai agar ek model change ka koi migration nahi -> PR fail karो. `check --deploy` + test suite ke saath pair karो.',
      '`SeparateDatabaseAndState(state_operations=[...], database_operations=[])` = "Django ka model state update karो par KOI SQL mat chalाओ" — ek `CREATE INDEX CONCURRENTLY` ke liye jо ORM ke bahar kiya gaya.',
      'ASYNC VIEW SIRF tab madad karता hai jab: view apna samay KAई swतंtra I/O calls par WAITING kharch karता hai (`asyncio.gather`) AUR ye ASGI ke tahat deployed hai. Madad NAHI karता: CPU work, ek single query, WSGI ke tahat kuch bhi.',
      'KABHI `async def` ke andar ek blocking call nahi (`requests.get`, `time.sleep`, ek bare ORM query) — ye POORE event loop ko freeze karता hai. `httpx.AsyncClient`, `asyncio.sleep`, `await qs.acount()`, ya `sync_to_async(fn)` / `async_to_sync(coro)` istemal karो. Aksar imaandaar jawab ek Celery job hai, ek async view nahi.',
    ],
  },
];
