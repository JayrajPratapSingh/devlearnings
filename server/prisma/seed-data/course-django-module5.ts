/**
 * Django Complete Course — Module 5: Django REST Framework, lessons 1-3.
 *
 * Lesson 1: serializers — Serializer vs ModelSerializer, the two directions
 *           (to_representation / to_internal_value), is_valid/validated_data/
 *           errors, .save() -> create()/update(), save(**extra), read_only/
 *           write_only/source, SerializerMethodField.
 * Lesson 2: serializer validation — validate_<field>, validate(), the
 *           validators= list, UniqueValidator / UniqueTogetherValidator,
 *           raise_exception, the error shape, run_validation.
 * Lesson 3: nested & related serializers — PrimaryKeyRelatedField / StringRelated
 *           / SlugRelated / HyperlinkedRelated, nested read, writable nested
 *           (override create/update), many=True, depth, context, the N+1 that
 *           nested serializers cause and where select_related/prefetch_related go.
 *
 * NOTE for future editors: same conventions as course-django-module4.ts.
 *  - Every backtick inside simple/simpleHi/content/contentHi is `\``; `\${` for `$`+`{`.
 *  - `examples` use `code` + `output`, ASCII-only output, run with `python`.
 *  - DRF boots standalone: settings.configure(..., INSTALLED_APPS=[..., "rest_framework",
 *    "__main__"]) then django.setup(). Exercise serializers directly; views via
 *    `rest_framework.test.APIRequestFactory` / `APIClient`.
 *  - Scan for Devanagari/Cyrillic in en/code. `npx tsc --noEmit -p .` from server/.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_5: CourseLesson[] = [
  {
    slug: 'dj-drf-serializers',
    title: 'Serializers: the Two-Way Gate Between JSON and Models',
    titleHi: 'Serializers: JSON Aur Models Ke Beech Do-Tarfa Gate',
    description: 'A DRF serializer does two jobs: turn a model instance into a JSON-safe dict (`.data`), and turn incoming request data into validated Python you can save (`.validated_data` -> `.save()`). `ModelSerializer` writes the field list and `create`/`update` for you. The `is_valid()` / `validated_data` / `errors` shape is identical to a Django `Form` — if you know forms, you already know this.',
    descriptionHi: 'Ek DRF serializer do kaam karता hai: ek model instance ko ek JSON-safe dict banाना (`.data`), aur incoming request data ko validated Python banाना jise aap save kar sako (`.validated_data` -> `.save()`). `ModelSerializer` field list aur `create`/`update` aapke liye likhता hai. `is_valid()` / `validated_data` / `errors` shape ek Django `Form` jaisा bilkul same hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A bilingual translator at a border crossing who checks papers in both directions.** Going out (your database -> the client), the translator takes a model instance and produces a clean printed document in the traveller\'s language — only the fields that are allowed on the export form, dates formatted the agreed way, nested objects expanded or collapsed per policy. That is `serializer.data`. Coming in (the client -> your database), the translator takes the form the traveller filled out, checks every field is the right type and within range, runs the special rules ("this visa number must exist", "these two dates must be in order"), and only then hands you a stack of verified, typed values you can act on — `serializer.validated_data`. If anything is wrong, you get back a marked-up form showing exactly which fields failed and why (`serializer.errors`), and nothing crosses. `ModelSerializer` is the same translator pre-briefed from your model\'s own schema: it already knows the field types, the max lengths, the uniqueness rules, and how to file a new record or amend an existing one.',
      hi: '**Ek border crossing par ek bilingual translator jо dono directions mein papers check karता hai.** Bahar jaте (aapka database -> client), translator ek model instance leता hai aur traveller ki bhाshा mein ek saaf printed document banाता hai — sirf wo fields jо export form par allowed hain, dates agreed tarike se formatted, nested objects policy ke hisab se expand ya collapse. Wo `serializer.data` hai. Andar aaте (client -> aapka database), translator wo form leता hai jо traveller ne bharा, check karता hai har field sahi type aur range mein hai, special rules chalाता hai, aur tabhi aapko verified, typed values ka ek stack deता hai — `serializer.validated_data`. Agar kuch galat hai, aapko ek marked-up form wapas milता hai jо dikhाता hai kaunse fields fail hue aur kyun (`serializer.errors`). `ModelSerializer` wahi translator hai aapke model ke schema se pre-briefed.',
    },

    simple: `**A \`ModelSerializer\`**

\`\`\`python
from rest_framework import serializers

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ["id", "title", "body", "status", "author", "created_at"]
        read_only_fields = ["created_at"]

# --- OUT: instance -> JSON-safe dict ---
serializer = ArticleSerializer(article)
serializer.data
# {"id": 3, "title": "Hi", "body": "...", "status": "draft", "author": 7, "created_at": "2026-09-02T10:00:00Z"}

# --- OUT: many ---
ArticleSerializer(Article.objects.all(), many=True).data     # a list of dicts

# --- IN: request data -> validated Python -> saved instance ---
serializer = ArticleSerializer(data=request.data)
if serializer.is_valid():                 # runs field + validate_<field> + validate()
    article = serializer.save(author=request.user)    # extra kwargs merge into validated_data
    # -> ArticleSerializer.create(validated_data) runs Article.objects.create(**validated_data)
else:
    serializer.errors                     # {"title": ["This field is required."], ...}

# --- IN: update (partial or full) ---
serializer = ArticleSerializer(article, data=request.data, partial=True)   # PATCH
serializer.is_valid(raise_exception=True)  # -> raises ValidationError -> DRF returns 400
serializer.save()                          # -> ArticleSerializer.update(instance, validated_data)
\`\`\`

**A plain \`Serializer\` (no model)**

\`\`\`python
class SearchSerializer(serializers.Serializer):
    q = serializers.CharField(max_length=100)
    page = serializers.IntegerField(default=1, min_value=1)
    tags = serializers.ListField(child=serializers.CharField(), required=False)

s = SearchSerializer(data={"q": "django", "page": "2"})
s.is_valid()                # True
s.validated_data            # {"q": "django", "page": 2}  -- page coerced to int
\`\`\`

**Field options**

\`\`\`python
title    = serializers.CharField(max_length=200)                  # in + out
slug     = serializers.SlugField(read_only=True)                  # out only (never accepted on write)
password = serializers.CharField(write_only=True)                 # in only (never appears in .data)
author   = serializers.CharField(source="author.username")        # out: instance.author.username
label    = serializers.CharField(source="get_status_display", read_only=True)
extra    = serializers.SerializerMethodField()                    # out: calls get_extra(self, obj)

def get_extra(self, obj):
    return {"comments": obj.comments.count()}
\`\`\`

\`\`\`
Serializer(instance=None, data=empty, many=False, partial=False, context={}, **kwargs)
  .data            -> OrderedDict (or list if many) -- the OUTPUT representation
  .is_valid(raise_exception=False)  -> bool ; populates .validated_data OR .errors
  .validated_data  -> dict of type-coerced, validated values (only after is_valid)
  .errors          -> {field: [messages], "non_field_errors": [...]}   (DRF -> HTTP 400 body)
  .save(**kwargs)  -> calls .create(vd) or .update(instance, vd) ; kwargs merged into vd
  .create(validated_data) / .update(instance, validated_data)   -- ModelSerializer writes these

ModelSerializer.Meta:  model, fields=[...] | exclude=[...] | "__all__",
                       read_only_fields=[...], extra_kwargs={"field": {"write_only": True}}, depth=N
\`\`\``,

    simpleHi: `**Ek \`ModelSerializer\`**

\`\`\`python
from rest_framework import serializers

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ["id", "title", "body", "status", "author", "created_at"]
        read_only_fields = ["created_at"]

# --- BAHAR: instance -> JSON-safe dict ---
serializer = ArticleSerializer(article)
serializer.data

# --- BAHAR: many ---
ArticleSerializer(Article.objects.all(), many=True).data     # dicts ki ek list

# --- ANDAR: request data -> validated Python -> saved instance ---
serializer = ArticleSerializer(data=request.data)
if serializer.is_valid():                 # field + validate_<field> + validate() chalाता hai
    article = serializer.save(author=request.user)    # extra kwargs validated_data mein merge
else:
    serializer.errors

# --- ANDAR: update (partial ya full) ---
serializer = ArticleSerializer(article, data=request.data, partial=True)   # PATCH
serializer.is_valid(raise_exception=True)  # -> ValidationError raise -> DRF 400 lautाता hai
serializer.save()                          # -> ArticleSerializer.update(instance, validated_data)
\`\`\`

**Ek plain \`Serializer\` (koi model nahi)**

\`\`\`python
class SearchSerializer(serializers.Serializer):
    q = serializers.CharField(max_length=100)
    page = serializers.IntegerField(default=1, min_value=1)

s = SearchSerializer(data={"q": "django", "page": "2"})
s.is_valid()                # True
s.validated_data            # {"q": "django", "page": 2}  -- page int mein coerce
\`\`\`

**Field options**

\`\`\`python
title    = serializers.CharField(max_length=200)                  # in + out
slug     = serializers.SlugField(read_only=True)                  # sirf out
password = serializers.CharField(write_only=True)                 # sirf in (.data mein kabhi nahi)
author   = serializers.CharField(source="author.username")        # out: instance.author.username
extra    = serializers.SerializerMethodField()                    # out: get_extra(self, obj) call

def get_extra(self, obj):
    return {"comments": obj.comments.count()}
\`\`\`

\`\`\`
Serializer(instance=None, data=empty, many=False, partial=False, context={}, **kwargs)
  .data            -> OrderedDict (ya list agar many) -- OUTPUT representation
  .is_valid(raise_exception=False)  -> bool ; .validated_data YA .errors populate karta hai
  .validated_data  -> type-coerced, validated values ka dict (sirf is_valid ke baad)
  .errors          -> {field: [messages], "non_field_errors": [...]}   (DRF -> HTTP 400 body)
  .save(**kwargs)  -> .create(vd) ya .update(instance, vd) call karta hai ; kwargs vd mein merge
  .create(validated_data) / .update(instance, validated_data)   -- ModelSerializer ye likhta hai

ModelSerializer.Meta:  model, fields=[...] | exclude=[...] | "__all__",
                       read_only_fields=[...], extra_kwargs={...}, depth=N
\`\`\``,

    content: `## The two directions

A serializer is a **bidirectional** mapper:

- **Serialization (out)**: \`serializer = MySerializer(instance)\` then \`serializer.data\`. DRF calls \`to_representation(instance)\`, which walks each field and pulls its value off the instance (respecting \`source\`), producing an \`OrderedDict\` of JSON-primitive values. A renderer (Module 6… no, lesson 6) turns that into JSON bytes.
- **Deserialization (in)**: \`serializer = MySerializer(data=request.data)\` then \`serializer.is_valid()\`. DRF calls \`to_internal_value(data)\` (type coercion + field validation), then \`validate_<field>\` methods, then \`validate(attrs)\`. Success populates \`validated_data\`; failure populates \`errors\`.

You never call \`to_representation\` / \`to_internal_value\` directly — you use \`.data\`, \`.is_valid()\`, \`.validated_data\`, \`.save()\`. Override them only for genuinely custom wire formats.

## \`is_valid()\`, \`validated_data\`, \`errors\` — same as a Form

\`\`\`python
serializer = ArticleSerializer(data=request.data)
serializer.is_valid()          # -> bool. Also: is_valid(raise_exception=True) raises
                               #    rest_framework.exceptions.ValidationError, which DRF's
                               #    default exception handler turns into a 400 response.
serializer.validated_data      # dict of coerced values; a field that failed is absent
serializer.errors              # {"field": ["msg", ...], "non_field_errors": ["msg"]}
\`\`\`

This is deliberately the same mental model as \`django.forms\` (Module 4 lesson 4). Field validation → \`validate_<field>()\` → \`validate()\`, and cross-field rules go in \`validate()\`. The differences: DRF calls the object-level hook \`validate\` (not \`clean\`), the non-field bucket is \`non_field_errors\` (not \`__all__\`), and \`is_valid(raise_exception=True)\` is the idiom (a view rarely branches on the bool).

## \`.save()\`, \`create()\`, \`update()\`

\`serializer.save()\` dispatches:

- **No instance** (\`MySerializer(data=…)\`) → \`self.create(self.validated_data)\`.
- **Instance given** (\`MySerializer(obj, data=…)\`) → \`self.update(self.instance, self.validated_data)\`.

\`ModelSerializer\` provides both:

\`\`\`python
def create(self, validated_data):
    return Article.objects.create(**validated_data)

def update(self, instance, validated_data):
    for k, v in validated_data.items():
        setattr(instance, k, v)
    instance.save()
    return instance
\`\`\`

**\`serializer.save(**kwargs)\`** merges \`kwargs\` into \`validated_data\` before calling \`create\`/\`update\`. This is the standard way to set server-controlled fields the client must not send:

\`\`\`python
serializer.save(author=request.user, status="draft")
\`\`\`

Those fields are then **not** in \`fields\` (or are \`read_only\`), so the client cannot set them — the DRF equivalent of a Form's \`save(commit=False)\` + set + \`save()\`.

Override \`create\`/\`update\` when saving is more than one \`objects.create\` — nested writes (lesson 3), side effects, hashing a password:

\`\`\`python
def create(self, validated_data):
    password = validated_data.pop("password")
    user = User(**validated_data)
    user.set_password(password)
    user.save()
    return user
\`\`\`

## \`ModelSerializer\` — what it generates

From \`Meta.model\` + \`Meta.fields\`, \`ModelSerializer\` builds:

- a serializer field per model field, with type, \`max_length\`, \`required\` (from \`null\`/\`blank\`/\`default\`), \`choices\`, and \`allow_null\` carried over;
- \`UniqueValidator\` for \`unique=True\` fields, \`UniqueTogetherValidator\` for \`Meta.unique_together\` / \`UniqueConstraint\`;
- a working \`create()\` and \`update()\`.

**\`fields\` must be explicit.** \`fields = "__all__"\` on a model with server-controlled columns (\`owner\`, \`is_staff\`, \`balance\`) is the mass-assignment hole — same rule as \`ModelForm\`. Use \`read_only_fields\` or \`extra_kwargs\` for fields that appear in output but are set by the server. Declaring a field explicitly on the class **overrides** the generated one:

\`\`\`python
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()        # extra, computed
    password  = serializers.CharField(write_only=True)     # override: write-only

    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name", "password"]
        extra_kwargs = {"email": {"required": True}}

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
\`\`\`

## \`source\`, \`read_only\`, \`write_only\`, \`SerializerMethodField\`

- **\`source="a.b"\`** — pull the value from a nested attribute or a method (\`source="get_status_display"\` calls it). \`source="*"\` passes the whole object (for a nested serializer that flattens).
- **\`read_only=True\`** — in output, never accepted on input (silently ignored if the client sends it).
- **\`write_only=True\`** — accepted on input, never in \`.data\` (passwords, raw upload tokens).
- **\`SerializerMethodField()\`** — read-only, value from \`get_<field_name>(self, obj)\`. Handy but each call runs Python per object — if it queries (\`obj.comments.count()\`), that is an N+1 (lesson 3).

## Serializers are used everywhere in a DRF app

Views (lesson 4) call \`self.get_serializer(…)\`; the browsable API renders the serializer as an HTML form; \`swagger\`/\`openapi\` schema generation reads field definitions. Get the serializer right and most of the view is boilerplate.`,

    contentHi: `## Do directions

Ek serializer ek **bidirectional** mapper hai:

- **Serialization (out)**: \`serializer = MySerializer(instance)\` phir \`serializer.data\`. DRF \`to_representation(instance)\` call karता hai, jо har field walk karके iski value instance se nikalता hai (\`source\` respect karके), JSON-primitive values ka ek \`OrderedDict\` banाता hai.
- **Deserialization (in)**: \`serializer = MySerializer(data=request.data)\` phir \`serializer.is_valid()\`. DRF \`to_internal_value(data)\` call karता hai (type coercion + field validation), phir \`validate_<field>\` methods, phir \`validate(attrs)\`. Safalta \`validated_data\` populate karती hai; failure \`errors\`.

Aap kabhi \`to_representation\` / \`to_internal_value\` seedhे call nahi karते — aap \`.data\`, \`.is_valid()\`, \`.validated_data\`, \`.save()\` istemal karते ho.

## \`is_valid()\`, \`validated_data\`, \`errors\` — Form jaisा

Ye jaanbujhকर \`django.forms\` (Module 4 lesson 4) jaisा same mental model hai. Field validation → \`validate_<field>()\` → \`validate()\`, aur cross-field rules \`validate()\` mein jाते hain. Antar: DRF object-level hook ko \`validate\` kehта hai (\`clean\` nahi), non-field bucket \`non_field_errors\` hai (\`__all__\` nahi), aur \`is_valid(raise_exception=True)\` idiom hai.

## \`.save()\`, \`create()\`, \`update()\`

\`serializer.save()\` dispatch karта hai:

- **Koi instance nahi** → \`self.create(self.validated_data)\`.
- **Instance diya** → \`self.update(self.instance, self.validated_data)\`.

**\`serializer.save(**kwargs)\`** \`kwargs\` ko \`validated_data\` mein merge karता hai. Ye server-controlled fields set karने ka standard tarika hai:

\`\`\`python
serializer.save(author=request.user, status="draft")
\`\`\`

Wo fields \`fields\` mein **nahi** hote (ya \`read_only\`), toh client unhe set nahi kar sakta — Form ke \`save(commit=False)\` + set + \`save()\` ka DRF equivalent.

\`create\`/\`update\` override karो jab saving ek \`objects.create\` se zyada ho — nested writes (lesson 3), side effects, ek password hash karna.

## \`ModelSerializer\` — kya generate karता hai

\`Meta.model\` + \`Meta.fields\` se: har model field ke liye ek serializer field (type, \`max_length\`, \`required\`, \`choices\` carry over); \`unique=True\` ke liye \`UniqueValidator\`; ek kaam karता \`create()\` aur \`update()\`.

**\`fields\` explicit hona chahिए.** \`fields = "__all__"\` server-controlled columns waale model par mass-assignment hole hai — \`ModelForm\` jaisा hi niyam. Class par ek field explicitly declare karna generated wale ko **override** karता hai.

## \`source\`, \`read_only\`, \`write_only\`, \`SerializerMethodField\`

- **\`source="a.b"\`** — value ek nested attribute ya method se nikalो.
- **\`read_only=True\`** — output mein, input par kabhi accept nahi.
- **\`write_only=True\`** — input par accept, \`.data\` mein kabhi nahi (passwords).
- **\`SerializerMethodField()\`** — read-only, value \`get_<field_name>(self, obj)\` se. Handy par har call prati object Python chalाता hai — agar ye query karता hai, wo ek N+1 hai (lesson 3).

## Serializers ek DRF app mein har jagah

Views (lesson 4) \`self.get_serializer(…)\` call karती hain; browsable API serializer ko ek HTML form render karता hai; schema generation field definitions padhता hai. Serializer sahi karो aur zyादातर view boilerplate hai.`,

    examples: [
      {
        title: 'ModelSerializer both directions: instance -> .data, data -> .save()',
        titleHi: 'ModelSerializer dono directions: instance -> .data, data -> .save()',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from rest_framework import serializers

class Article(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    status = models.CharField(max_length=10, default="draft")
    views = models.IntegerField(default=0)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Article)

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ["id", "title", "body", "status", "views"]
        read_only_fields = ["views"]

# --- IN: create ---
s = ArticleSerializer(data={"title": "Hello", "body": "world", "views": 999})
print("valid:", s.is_valid())
print("validated_data (no 'views' -- read_only):", dict(s.validated_data))
article = s.save(status="published")            # extra kwarg merged in
print("saved:", article.id, article.status, "views:", article.views)

# --- OUT: instance -> dict ---
print("out:", dict(ArticleSerializer(article).data))

# --- IN: partial update (PATCH) ---
s2 = ArticleSerializer(article, data={"title": "Hello v2"}, partial=True)
s2.is_valid(raise_exception=True)
s2.save()
print("after patch:", Article.objects.get(pk=article.pk).title)

# --- IN: invalid ---
bad = ArticleSerializer(data={"body": "no title"})
print("invalid:", bad.is_valid(), "| errors:", {k: [str(m) for m in v] for k, v in bad.errors.items()})`,
        output: `valid: True
validated_data (no 'views' -- read_only): {'title': 'Hello', 'body': 'world'}
saved: 1 published views: 0
out: {'id': 1, 'title': 'Hello', 'body': 'world', 'status': 'published', 'views': 0}
after patch: Hello v2
invalid: False | errors: {'title': ['This field is required.']}`,
        explain: '`ArticleSerializer(data={...})` + `is_valid()` deserialises: `views` is `read_only` so the client\'s `999` is dropped from `validated_data`. `.save(status="published")` merges the extra kwarg into `validated_data` and calls `create()` — the row is saved with the server-chosen status and `views=0` (the model default). `ArticleSerializer(article).data` serialises the other direction. `partial=True` makes the PATCH accept just `title`; `is_valid(raise_exception=True)` would return a 400 with `.errors` as the body in a view. The last case shows the `Form`-identical error shape: `{"field": ["message"]}`.',
        explainHi: '`ArticleSerializer(data={...})` + `is_valid()` deserialise karता hai: `views` `read_only` hai toh client ka `999` `validated_data` se drop ho jाता hai. `.save(status="published")` extra kwarg ko `validated_data` mein merge karता hai aur `create()` call karता hai. `ArticleSerializer(article).data` doosri disha serialise karता hai. `partial=True` PATCH ko sirf `title` accept karवाता hai. Aakhिri case `Form`-identical error shape dikhाता hai.',
      },
      {
        title: 'save(**kwargs) sets server-controlled fields the client cannot send',
        titleHi: 'save(**kwargs) server-controlled fields set karta hai jo client nahi bhej sakta',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.db import models, connection
from django.contrib.auth.models import User
from rest_framework import serializers

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
    is_approved = models.BooleanField(default=False)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Comment)

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")   # OUT only
    class Meta:
        model = Comment
        fields = ["id", "author", "body", "is_approved"]
        read_only_fields = ["is_approved"]

ada = User.objects.create_user("ada")

# a malicious client tries to set author + is_approved
s = CommentSerializer(data={"body": "hi", "author": 999, "is_approved": True})
print("valid:", s.is_valid())
print("validated_data (author/is_approved dropped):", dict(s.validated_data))

comment = s.save(author=ada)          # server decides the author
print("saved author:", comment.author.username, "| is_approved:", comment.is_approved)
print("out:", dict(CommentSerializer(comment).data))`,
        output: `valid: True
validated_data (author/is_approved dropped): {'body': 'hi'}
saved author: ada | is_approved: False
out: {'id': 1, 'author': 'ada', 'body': 'hi', 'is_approved': False}
`,
        explain: 'The malicious POST sends `author: 999` and `is_approved: true`, but `author` is a `ReadOnlyField` and `is_approved` is in `read_only_fields`, so both are silently dropped — `validated_data` is just `{"body": "hi"}`. The view then calls `serializer.save(author=ada)`; the server owns that value. The saved row has `author=ada` and `is_approved=False` (the model default) regardless of what the client sent. This `save(**server_fields)` pattern is the DRF equivalent of a Form\'s `save(commit=False)` + set + `save()`.',
        explainHi: 'Malicious POST `author: 999` aur `is_approved: true` bhejता hai, par `author` ek `ReadOnlyField` hai aur `is_approved` `read_only_fields` mein hai, toh dono chupchaap drop ho jाते hain — `validated_data` sirf `{"body": "hi"}` hai. View phir `serializer.save(author=ada)` call karता hai; server us value ko own karता hai. Saved row mein `author=ada` aur `is_approved=False` hai chahे client ne kuch bhi bheja ho.',
      },
      {
        title: 'Overriding create(): hash a password, drop a write_only field',
        titleHi: 'create() override karna: password hash karo, write_only field drop karo',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()
from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)

from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)               # hash, not plaintext
        user.save()
        return user

s = RegisterSerializer(data={"username": "bo", "email": "bo@example.com", "password": "longenough"})
s.is_valid(raise_exception=True)
user = s.save()

print("user created:", user.username, user.email)
print("password stored hashed:", user.password.startswith(("pbkdf2_", "argon2", "bcrypt")))
print("check_password works:", user.check_password("longenough"))
print("out has NO password key:", "password" not in RegisterSerializer(user).data)
print("out:", dict(RegisterSerializer(user).data))

short = RegisterSerializer(data={"username": "x", "password": "short"})
print("short password rejected:", short.is_valid(), dict(short.errors))`,
        output: `user created: bo bo@example.com
password stored hashed: True
check_password works: True
out has NO password key: True
out: {'id': 1, 'username': 'bo', 'email': 'bo@example.com'}
short password rejected: False {'password': [ErrorDetail(string='Ensure this field has at least 8 characters.', code='min_length')]}
`,
        explain: '`password` is declared on the class as `write_only` + `min_length=8` — it is not a `User` model field, so `create()` must handle it. The override `pop`s it from `validated_data`, builds the `User`, calls `set_password` (which hashes) rather than assigning plaintext, and saves. `RegisterSerializer(user).data` has no `password` key because `write_only` fields never appear in output. Anything that needs more than a single `objects.create` — hashing, nested writes, side effects — is a reason to override `create`.',
        explainHi: '`password` class par `write_only` + `min_length=8` declare kiya hai — ye ek `User` model field nahi, toh `create()` ko ise handle karna hoगा. Override ise `validated_data` se `pop` karта hai, `User` banาता hai, `set_password` call karता hai (jо hash karता hai) plaintext assign karने ke bजाy, aur save karता hai. `RegisterSerializer(user).data` mein koi `password` key nahi kyunki `write_only` fields output mein kabhi nahi aaते.',
      },
    ],

    mistakes: [
      {
        wrong: `class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"          # includes user, is_verified, credits, ...
# a PATCH with {"is_verified": true, "credits": 99999} sails through`,
        right: `class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["id", "display_name", "bio", "avatar", "is_verified", "credits"]
        read_only_fields = ["is_verified", "credits"]
# server sets those via serializer.save(is_verified=..., credits=...)`,
        why: 'Every name in `fields` (and every field when `fields = "__all__"`) is writable unless marked `read_only`. `"__all__"` on a model with server-owned columns is a mass-assignment vulnerability — identical to a `ModelForm` with `fields = "__all__"`. List fields explicitly and put server-controlled ones in `read_only_fields`; set them in the view via `serializer.save(...)`.',
        whyHi: '`fields` mein har naam (aur `fields = "__all__"` par har field) writable hai jab tak `read_only` mark na ho. Server-owned columns waale model par `"__all__"` ek mass-assignment vulnerability hai — `ModelForm` `fields = "__all__"` jaisा. Fields explicitly list karो aur server-controlled ko `read_only_fields` mein daalो; view mein `serializer.save(...)` se set karो.',
      },
      {
        wrong: `serializer = ArticleSerializer(data=request.data)
serializer.save()          # AssertionError: You must call \`.is_valid()\` first
# or, worse, reading .validated_data before is_valid() -> AssertionError`,
        right: `serializer = ArticleSerializer(data=request.data)
serializer.is_valid(raise_exception=True)    # 400 with .errors as the body if invalid
serializer.save()`,
        why: '`.validated_data` and `.save()` are only available after `is_valid()` has run — DRF asserts this to stop you acting on unvalidated input. In a view, the idiom is `serializer.is_valid(raise_exception=True)` then `serializer.save()`: the exception is caught by DRF\'s default handler and returned as a `400` whose body is `serializer.errors`, so you never write the error branch by hand.',
        whyHi: '`.validated_data` aur `.save()` sirf `is_valid()` chalने ke baad available hain — DRF ise assert karता hai taaki aap unvalidated input par act na karो. Ek view mein idiom hai `serializer.is_valid(raise_exception=True)` phir `serializer.save()`: exception DRF ke default handler dwara catch hota hai aur ek `400` lautाया jाता hai jiska body `serializer.errors` hai.',
      },
      {
        wrong: `class OrderSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = ["id", "total"]
    def get_total(self, obj):
        return sum(i.price * i.qty for i in obj.items.all())   # a query PER order
# OrderSerializer(Order.objects.all(), many=True) -> 1 + N queries`,
        right: `# in the view:
def get_queryset(self):
    return Order.objects.prefetch_related("items")   # items loaded in 1 extra query
# get_total then iterates the prefetched cache -- no per-order query`,
        why: 'A `SerializerMethodField` runs its `get_` method once per object being serialized. If that method touches the database (`obj.items.all()`, `obj.author.name` on an unfetched FK, `.count()`), serializing a list is an N+1. The fix is not in the serializer — it is `select_related` / `prefetch_related` in the view\'s `get_queryset` so the related data is already loaded (Module 3, and lesson 3).',
        whyHi: 'Ek `SerializerMethodField` apni `get_` method serialize ho rahe har object par ek baar chalाता hai. Agar wo method database chhoota hai, ek list serialize karna ek N+1 hai. Fix serializer mein nahi — view ke `get_queryset` mein `select_related` / `prefetch_related` hai taaki related data pehle se loaded ho (Module 3, aur lesson 3).',
      },
    ],

    realWorld: [
      {
        en: '**One serializer per resource per shape** — `ArticleListSerializer` (a few fields, no body), `ArticleDetailSerializer` (everything + nested author), `ArticleWriteSerializer` (only client-settable fields). The view picks via `get_serializer_class()`. Trying to make one serializer do list + detail + create + update with conditionals gets unreadable fast.',
        hi: '**Prati resource prati shape ek serializer** — `ArticleListSerializer` (kuch fields), `ArticleDetailSerializer` (sab + nested author), `ArticleWriteSerializer` (sirf client-settable). View `get_serializer_class()` se chunती hai.',
      },
      {
        en: '**`serializer.save(owner=request.user, tenant=request.tenant)` is the universal create pattern** — the write serializer never lists `owner`/`tenant`, the view stamps them. Combined with a `get_queryset` scoped to `owner=request.user`, this is the whole per-user CRUD security model.',
        hi: '**`serializer.save(owner=request.user, tenant=request.tenant)` universal create pattern hai** — write serializer kabhi `owner`/`tenant` list nahi karता, view unhe stamp karता hai. `owner=request.user` par scoped ek `get_queryset` ke saath, ye poora per-user CRUD security model hai.',
      },
      {
        en: '**`to_representation` override for legacy/external wire formats** — an API that must emit `{"data": {...}, "meta": {...}}`, or snake_case internally but camelCase on the wire (`djangorestframework-camel-case`), or must include a computed `_links` block. Everything else stays declarative.',
        hi: '**Legacy/external wire formats ke liye `to_representation` override** — ek API jise `{"data": {...}, "meta": {...}}` emit karna hai, ya andar snake_case par wire par camelCase. Baaki sab declarative rehта hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the two jobs of a DRF serializer, and how does `serializer.save()` know whether to create or update?',
        qHi: 'Ek DRF serializer ke do kaam kya hain, aur `serializer.save()` kaise jaanता hai create karna hai ya update?',
        a: 'A serializer is a bidirectional mapper between model instances and primitive Python that can become JSON. Job one, serialization or output: you construct it with an instance, MySerializer of obj, and read dot data; DRF walks each declared field, pulls the value off the instance honoring the source option, and returns an ordered dict of JSON-safe values. With many equals True you pass a queryset and get a list of dicts. Job two, deserialization or input: you construct it with data equals request dot data and call is_valid; DRF coerces types and runs field validation via to_internal_value, then your validate_field methods, then the object-level validate, and populates either validated_data or errors. That input side is deliberately the same shape as a Django form. As for save: the serializer remembers whether it was given an instance. If you constructed it as MySerializer of data equals something, with no instance, save calls self dot create with validated_data. If you constructed it as MySerializer of obj comma data equals something, it has an instance, so save calls self dot update with the instance and validated_data. ModelSerializer supplies both create, which is basically Model dot objects dot create with the validated data, and update, which sets each attribute and calls save. You override them when saving is more than a single create — hashing a password, writing nested objects, firing side effects. And save accepts extra keyword arguments that get merged into validated_data before create or update runs, which is how you inject server-controlled fields like owner equals request dot user that the client is not allowed to send.',
        aHi: 'Ek serializer model instances aur primitive Python jо JSON ban sake ke beech ek bidirectional mapper hai. Kaam ek, serialization ya output: aap ise ek instance ke saath construct karते ho, MySerializer of obj, aur dot data padhते ho; DRF har declared field walk karता hai, value instance se nikalता hai source option honor karके, aur JSON-safe values ka ek ordered dict lautाता hai. many equals True ke saath ek list milती hai. Kaam do, deserialization ya input: aap ise data equals request dot data ke saath construct karके is_valid call karते ho; DRF types coerce karता hai aur field validation chalाता hai, phir aapki validate_field methods, phir object-level validate, aur ya validated_data ya errors populate karता hai. save ke liye: serializer yaad rakhता hai use ek instance diya gaya tha ya nahi. Agar MySerializer of data equals something, koi instance nahi, save self dot create call karता hai. Agar MySerializer of obj comma data equals something, iske paas ek instance hai, toh save self dot update call karता hai. save extra keyword arguments accept karता hai jо create ya update se pehle validated_data mein merge hote hain — isi se aap owner equals request dot user jaise server-controlled fields inject karते ho.',
      },
      {
        q: 'How do you stop a client from setting a field like `is_admin` or `owner` through a `ModelSerializer`?',
        qHi: 'Aap ek client ko ek `ModelSerializer` ke zariye `is_admin` ya `owner` jaisा field set karने se kaise rokते ho?',
        a: 'The rule is that every field named in Meta dot fields is writable unless you make it not writable, and fields equals the string all names every field, so that is the thing to avoid on any model that has server-owned columns — it is exactly the mass-assignment vulnerability, the same one you get from a ModelForm with fields equals all. There are three levels of defense. First, do not list the field at all in Meta dot fields; then the serializer neither accepts it nor emits it. Second, if you want it in the output but not the input, put it in read_only_fields, or declare it as a read-only field on the class, or set it via extra_kwargs with read_only True; DRF then silently ignores it if the client sends it and still includes it in dot data. Third, for the value itself: set it in the view when you call serializer dot save, passing owner equals request dot user or is_admin equals False as keyword arguments, which get merged into validated_data after validation so the client cannot influence them. In practice the write path uses a dedicated write serializer that lists only the handful of genuinely client-settable fields, and the view stamps everything else. Combine that with a get_queryset filtered to the current user and the object-level permission checks, and a client can neither create an object owned by someone else nor read or modify one that is not theirs.',
        aHi: 'Niyam ye hai ki Meta dot fields mein named har field writable hai jab tak aap use non-writable na banाओ, aur fields equals string all har field name karता hai, toh yahi cheez kisi bhi model par avoid karni hai jiske paas server-owned columns hain — ye bilkul mass-assignment vulnerability hai. Teen level ke defense hain. Pehla, field ko Meta dot fields mein list hi mat karो; phir serializer na ise accept karта hai na emit. Doosra, agar aap ise output mein chahते ho par input mein nahi, ise read_only_fields mein daalो, ya class par ek read-only field declare karो; DRF phir ise chupchaap ignore karता hai agar client bhejता hai. Teesra, value khud ke liye: ise view mein set karो jab aap serializer dot save call karो, owner equals request dot user keyword argument ke roop mein pass karके, jо validation ke baad validated_data mein merge hota hai. Vyavhaar mein write path ek dedicated write serializer istemal karता hai jо sirf genuinely client-settable fields list karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone DRF. Model `Task` (`title`, `done` bool default False, `priority` int default 1, `created_by` CharField). Write `TaskSerializer(ModelSerializer)` with `fields = ["id", "title", "done", "priority", "created_by"]` and `read_only_fields = ["created_by"]`. Show: (a) `data=` a dict incl. `created_by="hacker"` -> `is_valid()` True and `validated_data` has no `created_by`; (b) `save(created_by="system")` -> saved row has `created_by="system"`; (c) `TaskSerializer(obj).data` round-trips; (d) `data={"done": true}` with no title -> `is_valid()` False, `errors` names `title`.',
        taskHi: 'Standalone DRF. `Task` (`title`, `done` bool, `priority` int, `created_by`) model karो. `TaskSerializer(ModelSerializer)` likhо `read_only_fields = ["created_by"]` ke saath. (a) `created_by="hacker"` -> validated_data mein nahi; (b) `save(created_by="system")` -> row mein `"system"`; (c) round-trip; (d) bina title -> `errors` mein `title`.',
        hint: '`INSTALLED_APPS=[..., "rest_framework", "__main__"]`, `django.setup()`, `connection.schema_editor()`. `from rest_framework import serializers`. `s.is_valid()` before `dict(s.validated_data)`. `{k: [str(m) for m in v] for k, v in s.errors.items()}` for readable errors.',
        hintHi: '`INSTALLED_APPS=[..., "rest_framework", "__main__"]`, `django.setup()`, `connection.schema_editor()`. `from rest_framework import serializers`. `dict(s.validated_data)` se pehle `s.is_valid()`.',
      },
      {
        task: 'Add a `SerializerMethodField` `label` to `TaskSerializer` that returns `"[DONE] " + title` when `done` else `"[ ] " + title`. Add a `days_old` field via `source` pointing at a model `@property` (or a second method field) — your choice. Verify both appear only in `.data` and are ignored on input (sending `{"label": "x"}` in `data=` does not error and does not appear in `validated_data`).',
        taskHi: '`TaskSerializer` mein ek `SerializerMethodField` `label` add karो jо `done` par `"[DONE] " + title` warna `"[ ] " + title` lautае. Verify dono sirf `.data` mein aaते hain aur input par ignore hote hain.',
        hint: '`label = serializers.SerializerMethodField()` + `def get_label(self, obj): return ("[DONE] " if obj.done else "[ ] ") + obj.title`. Method fields are read-only automatically. Add `"label"` to `Meta.fields`.',
        hintHi: '`label = serializers.SerializerMethodField()` + `def get_label(self, obj): ...`. Method fields automatically read-only. `"label"` ko `Meta.fields` mein add karो.',
      },
      {
        task: 'Model `Account` (`username` unique, `password_hash`). Write `SignupSerializer(ModelSerializer)` with a `write_only`, `min_length=8` `password` field (not a model field) and `Meta.fields = ["id", "username", "password"]`. Override `create()` to store `password_hash = "hash:" + password` (pretend). Assert: valid signup -> row has `password_hash` starting `"hash:"`; `.data` has no `password`; `password="short"` -> `is_valid()` False; a duplicate `username` -> `is_valid()` False with a uniqueness error.',
        taskHi: '`Account` (`username` unique, `password_hash`) model karो. `SignupSerializer(ModelSerializer)` likhо ek `write_only`, `min_length=8` `password` field (model field nahi) ke saath. `create()` override karके `password_hash = "hash:" + password` store karो. Assert karो.',
        hint: 'Declare `password = serializers.CharField(write_only=True, min_length=8)` on the class. In `create`: `pw = validated_data.pop("password"); return Account.objects.create(**validated_data, password_hash="hash:" + pw)`. `unique=True` on the model field -> DRF auto-adds a `UniqueValidator`.',
        hintHi: 'Class par `password = serializers.CharField(write_only=True, min_length=8)`. `create` mein: `pw = validated_data.pop("password"); return Account.objects.create(**validated_data, password_hash="hash:" + pw)`. Model field par `unique=True` -> DRF auto `UniqueValidator` add karta hai.',
      },
    ],

    keyTakeaways: [
      'A serializer maps BOTH ways: `MySerializer(instance).data` = model -> JSON-safe dict (`to_representation`); `MySerializer(data=...)` + `.is_valid()` = request data -> `.validated_data` (`to_internal_value` + validation).',
      '`is_valid()` / `validated_data` / `errors` is the SAME model as a Django `Form`: field validation -> `validate_<field>()` -> `validate(attrs)` (cross-field). Differences: object hook is `validate` (not `clean`), non-field bucket is `non_field_errors` (not `__all__`), and `is_valid(raise_exception=True)` is the view idiom (DRF turns the exception into a 400 with `errors` as the body).',
      '`.save()` dispatches by construction: no instance -> `create(validated_data)`; instance given -> `update(instance, validated_data)`. `ModelSerializer` writes both. `.validated_data` / `.save()` before `.is_valid()` -> `AssertionError`.',
      '`serializer.save(**kwargs)` merges `kwargs` into `validated_data` before create/update — the standard way to set server-controlled fields (`owner=request.user`, `status="draft"`). Those fields stay out of `fields` or are `read_only`.',
      'Override `create`/`update` when saving is more than one `objects.create`: hash a password, write nested objects (lesson 3), fire side effects, `pop` a `write_only` field.',
      '`ModelSerializer` generates a field per model field (types, `max_length`, `required`, `choices`, `UniqueValidator`) plus `create`/`update`. `fields` MUST be explicit — `"__all__"` on a model with server-owned columns is a mass-assignment hole. A field declared on the class overrides the generated one.',
      '`read_only=True` (out only, input ignored), `write_only=True` (in only, never in `.data` — passwords), `source="a.b"` / `source="get_x_display"` (pull from a nested attr/method), `SerializerMethodField()` (read-only, from `get_<name>(self, obj)`).',
      'A `SerializerMethodField` (or any field walking a relation) runs per-object — if it queries, serializing a list is an N+1. Fix it in the view\'s `get_queryset` with `select_related`/`prefetch_related`, not in the serializer.',
    ],
    keyTakeawaysHi: [
      'Ek serializer DONO taraf map karता hai: `MySerializer(instance).data` = model -> JSON-safe dict; `MySerializer(data=...)` + `.is_valid()` = request data -> `.validated_data`.',
      '`is_valid()` / `validated_data` / `errors` ek Django `Form` jaisा SAME model hai: field validation -> `validate_<field>()` -> `validate(attrs)`. Antar: object hook `validate` hai (`clean` nahi), non-field bucket `non_field_errors` hai, aur `is_valid(raise_exception=True)` view idiom hai (DRF exception ko ek 400 banाता hai `errors` body ke saath).',
      '`.save()` construction se dispatch karता hai: koi instance nahi -> `create(validated_data)`; instance diya -> `update(instance, validated_data)`. `.is_valid()` se pehle `.validated_data` / `.save()` -> `AssertionError`.',
      '`serializer.save(**kwargs)` `kwargs` ko create/update se pehle `validated_data` mein merge karता hai — server-controlled fields set karने ka standard tarika (`owner=request.user`). Wo fields `fields` se bahar rehते hain ya `read_only`.',
      '`create`/`update` override karो jab saving ek `objects.create` se zyada ho: password hash, nested objects (lesson 3), side effects, ek `write_only` field `pop` karna.',
      '`ModelSerializer` prati model field ek field generate karता hai plus `create`/`update`. `fields` explicit hona CHAHIYE — server-owned columns waale model par `"__all__"` mass-assignment hole hai. Class par declare kiya field generated ko override karता hai.',
      '`read_only=True` (sirf out), `write_only=True` (sirf in, `.data` mein kabhi nahi), `source="a.b"`, `SerializerMethodField()` (read-only, `get_<name>(self, obj)` se).',
      'Ek `SerializerMethodField` prati-object chalता hai — agar ye query karता hai, list serialize karna ek N+1 hai. View ke `get_queryset` mein `select_related`/`prefetch_related` se fix karो, serializer mein nahi.',
    ],
  },

  {
    slug: 'dj-drf-serializer-validation',
    title: 'Serializer Validation: field, object, and validators',
    titleHi: 'Serializer Validation: field, object, aur validators',
    description: 'Validation runs in a fixed order: each field coerces and checks itself, then `validate_<field>` methods, then the object-level `validate(attrs)` for cross-field rules. Reusable checks go in the `validators` list. `UniqueValidator` and `UniqueTogetherValidator` enforce DB uniqueness at the API layer with a clean 400 instead of an IntegrityError 500.',
    descriptionHi: 'Validation ek fixed order mein chalती hai: har field khud coerce aur check karता hai, phir `validate_<field>` methods, phir cross-field rules ke liye object-level `validate(attrs)`. Reusable checks `validators` list mein jाते hain. `UniqueValidator` aur `UniqueTogetherValidator` DB uniqueness ko API layer par ek saaf 400 ke saath enforce karते hain ek IntegrityError 500 ke bजाy.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A three-stage inspection line for a parcel.** Stage one, each item is weighed and measured on its own — is the address a real string, is the declared value a number, is the weight under the limit (field-level: type coercion + `max_length` + `min_value` + the field\'s built-in validators). Stage two, a specialist re-checks specific items against a live database — "does this customs code actually exist?", "is this tracking number already used?" (`validate_<field>`: your per-field rule, runs only if the item passed stage one). Stage three, an inspector looks at the whole parcel together — "the insured value can\'t exceed the declared value", "express shipping requires a phone number" (`validate(attrs)`: cross-field). A parcel that fails any stage is stamped with exactly which checks failed and sent back (`serializer.errors`), and nothing ships. Rules that every parcel line needs — "no PO boxes for hazmat" — are printed once on a card that gets clipped to every relevant item (`validators=[…]`), not re-copied onto each form.',
      hi: '**Ek parcel ke liye teen-stage inspection line.** Stage ek, har item apne aap tola aur maapा jाता hai — kya address ek asli string hai, kya declared value ek number hai (field-level: type coercion + `max_length` + `min_value` + field ke built-in validators). Stage do, ek specialist vishisht items ko ek live database ke khilaf re-check karता hai — "kya ye customs code sach mein maujूd hai?" (`validate_<field>`: aapka per-field rule, sirf tab chalता hai agar item stage one pass hua). Stage teen, ek inspector poore parcel ko saath dekhता hai — "insured value declared value se zyada nahi ho sakti" (`validate(attrs)`: cross-field). Koi bhi stage fail karne waalा parcel stamp kiya jाता hai ki kaunse checks fail hue (`serializer.errors`). Rules jо har parcel line ko chahिए ek card par ek baar printed hote hain (`validators=[…]`).',
    },

    simple: `**The order (identical to a Form)**

\`\`\`python
class BookingSerializer(serializers.Serializer):
    room     = serializers.IntegerField(min_value=1)
    check_in  = serializers.DateField()
    check_out = serializers.DateField()
    coupon   = serializers.CharField(required=False, allow_blank=True)

    # 1. field-level: type coercion + min_value/max_length + built-in validators (automatic)

    # 2. per-field, runs only if the field passed step 1:
    def validate_coupon(self, value):
        if value and not Coupon.objects.filter(code=value, active=True).exists():
            raise serializers.ValidationError("Unknown or expired coupon.")
        return value                         # MUST return the (possibly transformed) value

    # 3. object-level, cross-field:
    def validate(self, attrs):
        if attrs["check_out"] <= attrs["check_in"]:
            raise serializers.ValidationError(
                {"check_out": "Check-out must be after check-in."})   # attach to a field
        return attrs                         # MUST return attrs
\`\`\`

**Reusable validators — the \`validators\` list**

\`\`\`python
def even_only(value):
    if value % 2:
        raise serializers.ValidationError("Must be an even number.")

class S(serializers.Serializer):
    seats = serializers.IntegerField(validators=[even_only])       # per-field
    class Meta:
        validators = [SomeObjectLevelValidator()]                  # object-level
\`\`\`

**Uniqueness — API-layer, not a 500**

\`\`\`python
from rest_framework.validators import UniqueValidator, UniqueTogetherValidator

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(),
                                    message="That email is taken.")])
    class Meta:
        model = User
        fields = ["id", "username", "email"]
        # ModelSerializer AUTO-adds UniqueValidator for unique=True model fields

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ["user", "org", "role"]
        validators = [UniqueTogetherValidator(
            queryset=Membership.objects.all(), fields=["user", "org"],
            message="This user is already a member of this org.")]
\`\`\`

**Errors and \`raise_exception\`**

\`\`\`python
serializer.is_valid()                        # False; serializer.errors = {...}
serializer.is_valid(raise_exception=True)    # raises rest_framework.exceptions.ValidationError
                                             # -> DRF default handler -> HTTP 400, body = errors

serializer.errors
# {"check_out": ["Check-out must be after check-in."],
#  "non_field_errors": ["..."],              # from validate() raising a non-dict
#  "coupon": ["Unknown or expired coupon."]}
\`\`\`

\`\`\`
run order:  Field.run_validation (to_internal_value + field.validators)
            -> validate_<field>(self, value)   [only for fields that passed]
            -> validate(self, attrs)           [object level; attrs may be missing keys on partial]
validate_<field>  reads ONE value, returns it (or raises ValidationError). No cross-field here.
validate(attrs)   reads/returns the dict. Raise ValidationError(str) -> non_field_errors;
                  raise ValidationError({"f": "..."}) -> attaches to field f.
validators list:  callables or classes; class validators get .set_context / __call__(value, serializer)
UniqueValidator(queryset, message=, lookup=)   UniqueTogetherValidator(queryset, fields=[...])
partial=True (PATCH): absent fields are skipped entirely -- validate() must use attrs.get(...)
\`\`\``,

    simpleHi: `**Order (ek Form jaisा bilkul same)**

\`\`\`python
class BookingSerializer(serializers.Serializer):
    room     = serializers.IntegerField(min_value=1)
    check_in  = serializers.DateField()
    check_out = serializers.DateField()
    coupon   = serializers.CharField(required=False, allow_blank=True)

    # 1. field-level: type coercion + min_value/max_length + built-in validators (automatic)

    # 2. per-field, sirf tab chalता hai agar field step 1 pass hua:
    def validate_coupon(self, value):
        if value and not Coupon.objects.filter(code=value, active=True).exists():
            raise serializers.ValidationError("Unknown or expired coupon.")
        return value                         # value return karna ZAROORI hai

    # 3. object-level, cross-field:
    def validate(self, attrs):
        if attrs["check_out"] <= attrs["check_in"]:
            raise serializers.ValidationError(
                {"check_out": "Check-out must be after check-in."})   # field se attach
        return attrs                         # attrs return karna ZAROORI hai
\`\`\`

**Reusable validators — \`validators\` list**

\`\`\`python
def even_only(value):
    if value % 2:
        raise serializers.ValidationError("Must be an even number.")

class S(serializers.Serializer):
    seats = serializers.IntegerField(validators=[even_only])       # per-field
    class Meta:
        validators = [SomeObjectLevelValidator()]                  # object-level
\`\`\`

**Uniqueness — API-layer, ek 500 nahi**

\`\`\`python
from rest_framework.validators import UniqueValidator, UniqueTogetherValidator

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(),
                                    message="That email is taken.")])
    class Meta:
        model = User
        fields = ["id", "username", "email"]
        # ModelSerializer unique=True model fields ke liye UniqueValidator AUTO-add karता hai
\`\`\`

**Errors aur \`raise_exception\`**

\`\`\`python
serializer.is_valid()                        # False; serializer.errors = {...}
serializer.is_valid(raise_exception=True)    # ValidationError raise -> DRF handler -> HTTP 400
\`\`\`

\`\`\`
run order:  Field.run_validation -> validate_<field>(self, value) [sirf pass hue fields] -> validate(self, attrs)
validate_<field>  EK value padhta hai, ise return karta hai. Yahan cross-field nahi.
validate(attrs)   dict padhta/return karta hai. ValidationError(str) -> non_field_errors;
                  ValidationError({"f": "..."}) -> field f se attach.
UniqueValidator(queryset, message=)   UniqueTogetherValidator(queryset, fields=[...])
partial=True (PATCH): absent fields poori tarah skip -- validate() ko attrs.get(...) istemal karna hai
\`\`\``,

    content: `## The pipeline

\`is_valid()\` runs \`run_validation(data)\` which does, in order:

1. **\`to_internal_value(data)\`** — for each writable field: read the raw value, run \`field.run_validation()\` (which coerces the type, checks \`required\` / \`allow_null\` / \`allow_blank\`, and runs the field's \`validators\` — \`MaxLengthValidator\`, \`MinValueValidator\`, \`EmailValidator\`, \`UniqueValidator\`, anything you passed in \`validators=[…]\`). Collects field errors into a dict.
2. **\`validate_<field_name>(self, value)\`** — called for each field that survived step 1, with its coerced value. Return the value (possibly transformed); raise \`serializers.ValidationError("msg")\` to reject. No access to other fields here reliably — they may not be validated yet.
3. **\`validate(self, attrs)\`** — \`attrs\` is the dict of everything that passed steps 1–2. Cross-field rules go here. Return \`attrs\`. Raise \`ValidationError("msg")\` for a \`non_field_errors\` entry, or \`ValidationError({"field": "msg"})\` to attach to a specific field.
4. **\`Meta.validators\`** (object-level validator classes like \`UniqueTogetherValidator\`) also run at the object level.

If any step produces errors, \`validated_data\` is not set and \`errors\` holds the accumulated dict.

## \`validate_<field>\` vs \`validate\`

- A rule about **one field in isolation** — "this coupon code must exist", "the slug must not start with a digit", normalise to lowercase — goes in \`validate_<field>\`.
- A rule **relating two or more fields** — "end after start", "if \`type == 'express'\` then \`phone\` is required", "exactly one of \`a\`/\`b\`" — goes in \`validate\`. Inside \`validate\`, use \`attrs.get("x")\` and guard for missing keys, because on a \`PATCH\` (\`partial=True\`) absent fields are simply not in \`attrs\`.

\`\`\`python
def validate(self, attrs):
    kind  = attrs.get("kind", getattr(self.instance, "kind", None))   # fall back to instance on PATCH
    phone = attrs.get("phone", getattr(self.instance, "phone", ""))
    if kind == "express" and not phone:
        raise serializers.ValidationError({"phone": "Required for express bookings."})
    return attrs
\`\`\`

## The \`validators\` list — reuse

A **field validator** is any callable \`f(value)\` that raises \`ValidationError\` on failure (or a class with \`__call__(self, value)\`). Pass a list to the field:

\`\`\`python
from django.core.validators import RegexValidator
code = serializers.CharField(validators=[RegexValidator(r"^[A-Z]{3}\\d{4}$")])
\`\`\`

An **object-level validator** is a class with \`__call__(self, attrs, serializer)\` (newer signature) put in \`Meta.validators\`. \`UniqueTogetherValidator\` is the built-in example.

Prefer a validator over a \`validate_<field>\` method when the same rule appears on several serializers — write it once, reference it everywhere.

## \`UniqueValidator\` / \`UniqueTogetherValidator\`

Without them, a duplicate insert reaches the database and raises \`IntegrityError\` → an unhandled 500. With them, DRF checks first and returns a clean \`400\` with a field error.

- **\`ModelSerializer\` adds \`UniqueValidator\` automatically** for every model field with \`unique=True\`. You only write it by hand on a plain \`Serializer\`, or to customise the \`message\` / \`queryset\` (e.g. scope uniqueness to the current tenant).
- **\`UniqueTogetherValidator(queryset=…, fields=["a", "b"])\`** in \`Meta.validators\` for a composite unique constraint. \`ModelSerializer\` adds it from \`Meta.unique_together\` / a \`UniqueConstraint\` — but only if **all** the involved fields are in \`Meta.fields\` (a common gotcha: leave one out and the validator silently disappears).
- On **update**, \`UniqueValidator\` correctly excludes the current instance (so re-saving without changing the unique field is fine).

## \`raise_exception=True\` and the error shape

In a view:

\`\`\`python
serializer.is_valid(raise_exception=True)
\`\`\`

raises \`rest_framework.exceptions.ValidationError\`. DRF's default \`exception_handler\` (lesson 6) catches it and returns:

\`\`\`
HTTP 400 Bad Request
{"check_out": ["Check-out must be after check-in."],
 "non_field_errors": ["Booking overlaps an existing reservation."]}
\`\`\`

Values are lists of \`ErrorDetail\` (a \`str\` subclass carrying a \`.code\`). The generic views and \`ViewSet\`s (lesson 4) call \`is_valid(raise_exception=True)\` for you — you rarely write it.

## Validation is not the model's \`full_clean()\`

DRF serializer validation is **separate** from \`Model.full_clean()\` / model \`clean()\` (Module 2). \`serializer.save()\` calls \`Model.objects.create()\` / \`instance.save()\`, which do **not** run \`full_clean()\`. So model-level \`clean()\` rules and \`validate_constraints\` are not enforced by DRF unless you (a) also put them in the serializer, or (b) rely on DB-level \`constraints\` (which do raise on write — as an \`IntegrityError\` you must handle). Put every invariant the API must enforce into the serializer, and back the critical ones with DB constraints.`,

    contentHi: `## Pipeline

\`is_valid()\` \`run_validation(data)\` chalाता hai jо, order mein:

1. **\`to_internal_value(data)\`** — har writable field ke liye: raw value padhо, \`field.run_validation()\` chalाओ (type coerce, \`required\` / \`allow_null\` check, field ke \`validators\` chalाओ). Field errors ek dict mein collect.
2. **\`validate_<field_name>(self, value)\`** — step 1 jeetने waale har field ke liye call, iski coerced value ke saath. Value return karो; reject karne ko \`serializers.ValidationError("msg")\` raise karो.
3. **\`validate(self, attrs)\`** — \`attrs\` steps 1–2 pass karne waale sab ka dict hai. Cross-field rules yahaan. \`attrs\` return karो. \`ValidationError("msg")\` -> \`non_field_errors\`, \`ValidationError({"field": "msg"})\` -> ek vishisht field se attach.
4. **\`Meta.validators\`** (object-level validator classes jaise \`UniqueTogetherValidator\`) bhi object level par chalते hain.

## \`validate_<field>\` vs \`validate\`

- **Ek field akelе** ke baare mein niyam \`validate_<field>\` mein jाता hai.
- **Do ya zyada fields** ko relate karता niyam \`validate\` mein. \`validate\` ke andar \`attrs.get("x")\` istemal karो, kyunki ek \`PATCH\` (\`partial=True\`) par absent fields \`attrs\` mein nahi hote.

## \`validators\` list — reuse

Ek **field validator** koi bhi callable \`f(value)\` hai jо failure par \`ValidationError\` raise karता hai. Field ko ek list pass karो.

Ek **object-level validator** ek class hai \`__call__(self, attrs, serializer)\` ke saath, \`Meta.validators\` mein.

Ek validator ko ek \`validate_<field>\` method par prefer karो jab wahi niyam kai serializers par aaता ho.

## \`UniqueValidator\` / \`UniqueTogetherValidator\`

Inke bina, ek duplicate insert database tak pahुँchता hai aur \`IntegrityError\` raise karता hai → ek unhandled 500. Inke saath, DRF pehle check karता hai aur ek saaf \`400\` lautाता hai.

- **\`ModelSerializer\` \`UniqueValidator\` automatically add karता hai** har \`unique=True\` model field ke liye.
- **\`UniqueTogetherValidator(queryset=…, fields=["a", "b"])\`** \`Meta.validators\` mein composite unique ke liye — par sirf agar **saare** involved fields \`Meta.fields\` mein hon (common gotcha).
- **Update par**, \`UniqueValidator\` current instance ko sahi se exclude karता hai.

## \`raise_exception=True\` aur error shape

\`serializer.is_valid(raise_exception=True)\` \`rest_framework.exceptions.ValidationError\` raise karता hai. DRF ka default \`exception_handler\` ise catch karता hai aur ek \`HTTP 400\` lautाता hai jiska body \`errors\` dict hai. Generic views aur \`ViewSet\`s aapke liye \`is_valid(raise_exception=True)\` call karती hain.

## Validation model ki \`full_clean()\` nahi hai

DRF serializer validation \`Model.full_clean()\` / model \`clean()\` (Module 2) se **alag** hai. \`serializer.save()\` \`Model.objects.create()\` / \`instance.save()\` call karता hai, jо \`full_clean()\` **nahi** chalाते. Toh har invariant jise API enforce karna hai serializer mein daalो, aur critical ko DB constraints se back karो.`,

    examples: [
      {
        title: 'The three stages: field -> validate_<field> -> validate(attrs)',
        titleHi: 'Teen stages: field -> validate_<field> -> validate(attrs)',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", INSTALLED_APPS=["rest_framework"], USE_TZ=True)
django.setup()

from rest_framework import serializers
import datetime

KNOWN_COUPONS = {"SAVE10", "WELCOME"}

class BookingSerializer(serializers.Serializer):
    nights   = serializers.IntegerField(min_value=1)          # stage 1: type + min_value
    check_in  = serializers.DateField()
    check_out = serializers.DateField()
    coupon   = serializers.CharField(required=False, allow_blank=True)

    def validate_coupon(self, value):                         # stage 2: one field
        if value and value.upper() not in KNOWN_COUPONS:
            raise serializers.ValidationError("Unknown coupon.")
        return value.upper() if value else value

    def validate(self, attrs):                                # stage 3: cross-field
        if attrs["check_out"] <= attrs["check_in"]:
            raise serializers.ValidationError({"check_out": "Must be after check-in."})
        span = (attrs["check_out"] - attrs["check_in"]).days
        if span != attrs["nights"]:
            raise serializers.ValidationError(
                f"nights ({attrs['nights']}) does not match the date range ({span}).")
        return attrs

def run(data):
    s = BookingSerializer(data=data)
    ok = s.is_valid()
    return ok, (dict(s.validated_data) if ok else {k: [str(m) for m in v] for k, v in s.errors.items()})

print("stage 1 fail:", run({"nights": 0, "check_in": "2026-10-01", "check_out": "2026-10-03"}))
print("stage 2 fail:", run({"nights": 2, "check_in": "2026-10-01", "check_out": "2026-10-03", "coupon": "NOPE"}))
print("stage 3 fail (dates):", run({"nights": 2, "check_in": "2026-10-05", "check_out": "2026-10-03"}))
print("stage 3 fail (mismatch):", run({"nights": 5, "check_in": "2026-10-01", "check_out": "2026-10-03"}))
print("all pass:", run({"nights": 2, "check_in": "2026-10-01", "check_out": "2026-10-03", "coupon": "save10"}))`,
        output: `stage 1 fail: (False, {'nights': ['Ensure this value is greater than or equal to 1.']})
stage 2 fail: (False, {'coupon': ['Unknown coupon.']})
stage 3 fail (dates): (False, {'check_out': ['Must be after check-in.']})
stage 3 fail (mismatch): (False, {'non_field_errors': ['nights (5) does not match the date range (2).']})
all pass: (True, {'nights': 2, 'check_in': datetime.date(2026, 10, 1), 'check_out': datetime.date(2026, 10, 3), 'coupon': 'SAVE10'})`,
        explain: 'Each failing case is blocked at a different stage. `nights: 0` fails the field-level `min_value=1` (stage 1) and never reaches the custom methods. `coupon: "NOPE"` passes stage 1 (it is a string) but `validate_coupon` rejects it (stage 2) — and note it also *transforms*: `"save10"` becomes `"SAVE10"` in the all-pass case. The date checks are cross-field so they live in `validate` (stage 3): `ValidationError({"check_out": ...})` attaches to that field, while a bare `ValidationError("...")` lands in `non_field_errors`. On success, `validated_data` holds real `datetime.date` objects.',
        explainHi: 'Har failing case ek alag stage par block hoता hai. `nights: 0` field-level `min_value=1` (stage 1) fail karता hai aur custom methods tak kabhi nahi pahुँchता. `coupon: "NOPE"` stage 1 pass karता hai par `validate_coupon` ise reject karता hai (stage 2) — aur ye *transform* bhi karता hai: `"save10"` `"SAVE10"` ban jाता hai. Date checks cross-field hain toh `validate` (stage 3) mein: `ValidationError({"check_out": ...})` us field se attach hota hai, ek bare `ValidationError("...")` `non_field_errors` mein.',
      },
      {
        title: 'UniqueValidator: a clean 400 instead of an IntegrityError 500',
        titleHi: 'UniqueValidator: IntegrityError 500 ke bजाy ek saaf 400',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from rest_framework import serializers

class Team(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Member(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    email = models.EmailField()
    class Meta:
        app_label = "__main__"
        constraints = [models.UniqueConstraint(fields=["team", "email"], name="uniq_team_email")]

with connection.schema_editor() as se:
    se.create_model(Team); se.create_model(Member)
t = Team.objects.create(slug="core", name="Core")
Member.objects.create(team=t, email="ada@example.com")

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ["id", "slug", "name"]     # ModelSerializer auto-adds UniqueValidator for 'slug'

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ["id", "team", "email"]    # auto UniqueTogetherValidator from the UniqueConstraint

dup_team = TeamSerializer(data={"slug": "core", "name": "Core 2"})
print("dup slug ->", dup_team.is_valid(), {k: [str(m) for m in v] for k, v in dup_team.errors.items()})

dup_member = MemberSerializer(data={"team": t.pk, "email": "ada@example.com"})
print("dup (team,email) ->", dup_member.is_valid(), {k: [str(m) for m in v] for k, v in dup_member.errors.items()})

ok_member = MemberSerializer(data={"team": t.pk, "email": "bo@example.com"})
print("new member ok ->", ok_member.is_valid())

# on update, re-saving the same unique value is allowed (instance excluded)
existing = Member.objects.get(email="ada@example.com")
same = MemberSerializer(existing, data={"team": t.pk, "email": "ada@example.com"})
print("update, unchanged unique ->", same.is_valid())`,
        output: `dup slug -> False {'slug': ['team with this slug already exists.']}
dup (team,email) -> False {'non_field_errors': ['The fields team, email must make a unique set.']}
new member ok -> True
update, unchanged unique -> True
`,
        explain: '`ModelSerializer` reads the model\'s constraints and adds validators automatically: `slug` is `unique=True` so it gets a `UniqueValidator` (error attached to the `slug` field); `Member` has a `UniqueConstraint(fields=["team", "email"])` so `MemberSerializer` gets a `UniqueTogetherValidator` (error in `non_field_errors`). Both fire during `is_valid()` and produce a clean `400`-shaped error dict — without them the duplicate would reach the database and raise `IntegrityError`, an unhandled `500`. On update (`MemberSerializer(existing, data=...)`) the validator excludes the current instance, so re-saving the same unique values is allowed.',
        explainHi: '`ModelSerializer` model ke constraints padhता hai aur validators automatically add karता hai: `slug` `unique=True` hai toh ise ek `UniqueValidator` milता hai; `Member` ke paas ek `UniqueConstraint` hai toh `MemberSerializer` ko ek `UniqueTogetherValidator` milता hai (error `non_field_errors` mein). Dono `is_valid()` ke dौran fire hote hain aur ek saaf `400`-shaped error dict produce karते hain — inke bina duplicate database tak pahुँchता aur `IntegrityError` (unhandled `500`) raise karता. Update par validator current instance ko exclude karता hai.',
      },
      {
        title: 'partial=True (PATCH): validate(attrs) must fall back to the instance',
        titleHi: 'partial=True (PATCH): validate(attrs) ko instance par fall back karna chahिए',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from rest_framework import serializers

class Shipment(models.Model):
    kind = models.CharField(max_length=10)          # "standard" | "express"
    phone = models.CharField(max_length=20, blank=True)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Shipment)
ship = Shipment.objects.create(kind="express", phone="999")

class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = ["id", "kind", "phone"]

    def validate(self, attrs):
        # on PATCH, a field not sent is absent from attrs -> read the instance
        kind  = attrs.get("kind",  getattr(self.instance, "kind", None))
        phone = attrs.get("phone", getattr(self.instance, "phone", ""))
        if kind == "express" and not phone:
            raise serializers.ValidationError({"phone": "Required for express shipments."})
        return attrs

# PATCH clearing the phone on an express shipment -> caught via instance fallback
s1 = ShipmentSerializer(ship, data={"phone": ""}, partial=True)
print("clear phone on express ->", s1.is_valid(), {k: [str(m) for m in v] for k, v in s1.errors.items()})

# PATCH switching to standard, no phone -> fine
s2 = ShipmentSerializer(ship, data={"kind": "standard", "phone": ""}, partial=True)
print("switch to standard ->", s2.is_valid())

# naive version would KeyError on attrs["kind"] here -- .get() + instance fallback avoids it
s3 = ShipmentSerializer(ship, data={"phone": "1234"}, partial=True)
print("just update phone ->", s3.is_valid())`,
        output: `clear phone on express -> False {'phone': ['Required for express shipments.']}
switch to standard -> True
just update phone -> True
`,
        explain: 'On a `PATCH` (`partial=True`), any field the client does not send is simply absent from `attrs` in `validate()`. Reading `attrs["kind"]` directly would `KeyError` when the client only sends `phone`. The fix is `attrs.get("kind", getattr(self.instance, "kind", None))` — take the incoming value if present, otherwise fall back to the existing instance. That is how the "clear the phone on an express shipment" case is still caught even though `kind` was not in the request: the rule reconstructs the full picture from the request plus the instance.',
        explainHi: 'Ek `PATCH` (`partial=True`) par, jо field client nahi bhejता wo `validate()` mein `attrs` se absent hai. `attrs["kind"]` seedhे padhna `KeyError` deता jab client sirf `phone` bhejता hai. Fix `attrs.get("kind", getattr(self.instance, "kind", None))` hai — incoming value lo agar hai, warna existing instance par fall back. Isi tarah "express shipment par phone clear karो" case abhi bhi pakdा jाता hai chahे `kind` request mein nahi tha.',
      },
    ],

    mistakes: [
      {
        wrong: `class RangeSerializer(serializers.Serializer):
    low  = serializers.IntegerField()
    high = serializers.IntegerField()
    def validate_high(self, value):
        if value <= self.initial_data["low"]:     # reads raw, unvalidated input
            raise serializers.ValidationError("high must exceed low")
        return value`,
        right: `def validate(self, attrs):
    if attrs["high"] <= attrs["low"]:
        raise serializers.ValidationError({"high": "high must exceed low"})
    return attrs`,
        why: 'A `validate_<field>` method only reliably has its own field. Reaching into `self.initial_data` gets the raw, un-coerced, un-validated request value (`"5"` not `5`, or a missing key). Cross-field comparisons belong in `validate(attrs)`, where `attrs` holds every field that already passed its own validation, coerced to the right type.',
        whyHi: 'Ek `validate_<field>` method ke paas sirf apna field reliably hoता hai. `self.initial_data` mein pahुँchना raw, un-coerced request value deता hai. Cross-field comparisons `validate(attrs)` mein jाते hain, jahaan `attrs` mein har field hai jо pehle se apni validation pass kar chuka hai, sahi type mein coerced.',
      },
      {
        wrong: `def validate_username(self, value):
    if User.objects.filter(username=value).exists():
        raise serializers.ValidationError("taken")
    # no return -> validated_data["username"] becomes None -> user created with username=None`,
        right: `def validate_username(self, value):
    if User.objects.filter(username=value).exists():
        raise serializers.ValidationError("taken")
    return value                              # ALWAYS return`,
        why: 'Like a Form\'s `clean_<field>`, a serializer `validate_<field>` must **return the value**. Falling off the end returns `None`, which DRF then stores as that field\'s validated value — a "valid" payload that silently nulls the field. Every `validate_<field>` ends with `return value`.',
        whyHi: 'Ek Form ke `clean_<field>` jaisा, ek serializer `validate_<field>` ko **value return karni chahिए**. End se gir jाना `None` return karता hai, jise DRF phir us field ki validated value store karता hai. Har `validate_<field>` `return value` se khatam hoता hai.',
      },
      {
        wrong: `class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ["id", "role"]          # 'user' and 'org' NOT listed
        # Membership has unique_together = ("user", "org")
# the auto UniqueTogetherValidator is silently dropped -> duplicates get an IntegrityError 500`,
        right: `class Meta:
    model = Membership
    fields = ["id", "user", "org", "role"]   # all constrained fields present
    # now the UniqueTogetherValidator is active -> clean 400 on a duplicate`,
        why: 'DRF only adds a `UniqueTogetherValidator` (from `unique_together` / `UniqueConstraint`) when **all** the fields it covers are present in `Meta.fields`. Omit one and the validator vanishes with no warning — the duplicate then hits the DB and raises `IntegrityError`, an unhandled 500. If a constrained field is server-set, include it and make it `read_only`, or add the `UniqueTogetherValidator` explicitly with an appropriate `queryset`.',
        whyHi: 'DRF ek `UniqueTogetherValidator` sirf tab add karता hai jab wo jitne fields cover karता hai **saare** `Meta.fields` mein hon. Ek chhoड़ो aur validator bina warning ke gायab — duplicate phir DB tak pahुँchता hai aur `IntegrityError` (unhandled 500) raise karता hai. Agar ek constrained field server-set hai, ise include karके `read_only` banाओ, ya `UniqueTogetherValidator` explicitly add karो.',
      },
    ],

    realWorld: [
      {
        en: '**`validate()` is where cross-field business rules live** — "discount cannot exceed subtotal", "delivery slot must be ≥ 48h out", "if `payment_method == card` then `card_token` is required". Putting them in the serializer (not the view) means every caller — the API, a management command using the serializer, a bulk import — gets them.',
        hi: '**`validate()` wahaan hai jahaan cross-field business rules rehते hain** — "discount subtotal se zyada nahi", "delivery slot >= 48h door". Unhe serializer mein rakhna (view mein nahi) matlab har caller unhe paता hai.',
      },
      {
        en: '**Tenant-scoped `UniqueValidator`** — `UniqueValidator(queryset=Project.objects.filter(org=...))` so a project name is unique *within an org*, not globally. The queryset is often built in `__init__` from `self.context["request"].user.org`.',
        hi: '**Tenant-scoped `UniqueValidator`** — `UniqueValidator(queryset=Project.objects.filter(org=...))` taaki ek project naam *ek org ke andar* unique ho, globally nahi. Queryset aksar `__init__` mein `self.context["request"].user.org` se banता hai.',
      },
      {
        en: '**A shared `validators.py` module** — `no_profanity`, `valid_gstin`, `future_date`, `indian_mobile` as plain callables, imported into every serializer that needs them. Reviewers check that a new serializer reuses these rather than re-implementing a regex.',
        hi: '**Ek shared `validators.py` module** — `no_profanity`, `valid_gstin`, `future_date` plain callables ke roop mein, har serializer mein import. Reviewers check karते hain ki naya serializer inhe reuse kare.',
      },
    ],

    interviewQA: [
      {
        q: 'In what order does DRF serializer validation run, and where does a rule comparing two fields go?',
        qHi: 'DRF serializer validation kis order mein chalती hai, aur do fields compare karता niyam kahaan jाता hai?',
        a: 'is_valid triggers run_validation, which has three main stages. Stage one is per-field: for each writable field DRF reads the raw value and runs the field\'s own run_validation, which coerces the string to the right Python type, enforces required, allow_null, allow_blank, and runs every validator attached to that field — the built-in ones like MaxLengthValidator or EmailValidator or an auto-added UniqueValidator, plus anything you passed in the validators list. A field that fails here is recorded as an error and excluded from the data that moves on. Stage two: for each field that survived stage one, DRF looks for a method named validate underscore the field name and calls it with the coerced value. That method applies a rule about that one field — does this code exist, normalise to uppercase — and must return the value, or raise serializers dot ValidationError. Stage three: DRF calls the object-level validate method with attrs, a dict of every field that passed stages one and two. This is where cross-field rules go — end date after start date, one of these fields required depending on another, a total that must not exceed a subtotal. You return attrs, or raise ValidationError with a string, which lands in non_field_errors, or with a dict mapping field names to messages, which attaches the error to those fields. Object-level validator classes in Meta dot validators, like UniqueTogetherValidator, also run at this level. So a rule that compares two fields always goes in the object-level validate, never in a validate_field method, because inside validate_high the other field may not be validated or even present yet. And on a PATCH, partial equals True, absent fields are simply not in attrs, so object-level validate must read them with attrs dot get and fall back to self dot instance.',
        aHi: 'is_valid run_validation trigger karता hai, jiske teen mukhya stages hain. Stage ek per-field hai: har writable field ke liye DRF raw value padhता hai aur field ki apni run_validation chalाता hai, jо string ko sahi Python type mein coerce karती hai, required, allow_null enforce karती hai, aur us field se attached har validator chalाती hai. Yahaan fail hone waala field error ke roop mein record hota hai. Stage do: stage ek jeetने waale har field ke liye, DRF validate underscore field name naam ki ek method dhoondhता hai aur ise coerced value ke saath call karता hai. Wo method us ek field ke baare mein niyam lागू karती hai aur value return karni chahिए, ya ValidationError raise. Stage teen: DRF object-level validate method ko attrs ke saath call karता hai, stages ek aur do pass karne waale har field ka ek dict. Yahaan cross-field rules jाते hain. Aap attrs return karते ho, ya ek string ke saath ValidationError raise (non_field_errors mein), ya ek dict ke saath (un fields se attach). Toh do fields compare karता niyam hamesha object-level validate mein jाता hai. Aur ek PATCH par absent fields attrs mein nahi hote, toh validate ko attrs dot get istemal karके self dot instance par fall back karna chahिए.',
      },
      {
        q: 'What does `UniqueValidator` do that saving directly would not, and when does DRF add it automatically?',
        qHi: '`UniqueValidator` kya karता hai jо seedhे save karne se nahi hoता, aur DRF ise kab automatically add karता hai?',
        a: 'Without a UniqueValidator, a serializer that accepts a value which duplicates an existing unique column will happily pass validation, and the duplicate is only caught when serializer dot save hits the database, where the unique index raises an IntegrityError. If nothing catches that, it propagates as an unhandled 500 — a server error for what is really a client mistake, with an ugly database message. UniqueValidator moves that check to the validation phase: it runs a queryset dot filter for the value before any write, and if a row exists it raises a ValidationError, which becomes a clean 400 with a readable field-level message like "user with this email already exists". It also handles the update case correctly — when the serializer has an instance, it excludes that instance from the check, so re-saving a record without changing its unique field does not falsely fail. DRF\'s ModelSerializer adds a UniqueValidator automatically for every model field that has unique equals True, and adds a UniqueTogetherValidator for a Meta unique_together or a UniqueConstraint — but the together one only if every field it covers is listed in Meta dot fields; drop one and the validator silently disappears and you are back to IntegrityErrors. You write UniqueValidator by hand on a plain Serializer that has no model, or when you need to customise it — a different message, or scoping the queryset so uniqueness is per-tenant rather than global, for example UniqueValidator with queryset equals Project objects filtered to the current org.',
        aHi: 'Ek UniqueValidator ke bina, ek serializer jо ek existing unique column ko duplicate karता value accept karता hai khushi se validation pass karega, aur duplicate tabhi pakdа jाता hai jab serializer dot save database ko hit karता hai, jahaan unique index ek IntegrityError raise karता hai. Agar use kuch catch nahi karता, ye ek unhandled 500 ki tarah propagate hota hai. UniqueValidator us check ko validation phase mein le jाता hai: ye kisi bhi write se pehle value ke liye ek queryset dot filter chalाता hai, aur agar ek row maujूd hai ek ValidationError raise karता hai, jо ek saaf 400 ban jाता hai ek readable field-level message ke saath. Ye update case bhi sahi handle karता hai — jab serializer ke paas ek instance hai, ye us instance ko check se exclude karता hai. DRF ka ModelSerializer har unique equals True model field ke liye ek UniqueValidator automatically add karता hai, aur ek unique_together ya UniqueConstraint ke liye ek UniqueTogetherValidator — par together wala sirf tab agar har field jise ye cover karता hai Meta dot fields mein listed ho. Aap UniqueValidator haath se ek plain Serializer par likhते ho, ya jab aapko ise customise karna ho — ek alag message, ya queryset scope karके uniqueness per-tenant banाना.',
      },
    ],

    exercises: [
      {
        task: 'Standalone DRF. `PromoSerializer(serializers.Serializer)` with `code` (CharField), `discount_pct` (IntegerField, `min_value=1`, `max_value=90`), `min_spend` (IntegerField, `min_value=0`), `max_discount` (IntegerField, `min_value=0`). Add `validate_code` that uppercases and rejects codes not matching `^[A-Z0-9]{4,12}$`. Add `validate` requiring `max_discount <= min_spend * discount_pct / 100` (the cap must be reachable). Show a stage-1, a stage-2, and a stage-3 failure plus one all-pass.',
        taskHi: 'Standalone DRF. `PromoSerializer` `code`, `discount_pct` (1-90), `min_spend`, `max_discount` ke saath. `validate_code` uppercase kare aur `^[A-Z0-9]{4,12}$` na match karne par reject kare. `validate` `max_discount <= min_spend * discount_pct / 100` require kare. Stage 1/2/3 failure + ek all-pass dikhाओ.',
        hint: '`import re`. `validate_code`: `v = value.upper(); if not re.match(r"^[A-Z0-9]{4,12}$", v): raise serializers.ValidationError("bad format"); return v`. In `validate`, cast to float for the division. Errors readable via `{k: [str(m) for m in v] for k, v in s.errors.items()}`.',
        hintHi: '`import re`. `validate_code`: `v = value.upper(); if not re.match(...): raise ...; return v`. `validate` mein division ke liye float cast.',
      },
      {
        task: 'Models `Warehouse` (`code` unique) and `Bin` (`warehouse` FK, `label`) with `UniqueConstraint(fields=["warehouse", "label"], name="uniq_bin")`. Write `BinSerializer(ModelSerializer)` with `fields = ["id", "warehouse", "label"]`. Seed one bin. Assert: creating a bin with the same `(warehouse, label)` -> `is_valid()` False with a `non_field_errors` uniqueness message; a different label -> valid; updating the existing bin to its own `(warehouse, label)` -> valid. Then REMOVE `warehouse` from `fields` and show the validator silently disappears (duplicate now passes `is_valid()`).',
        taskHi: '`Warehouse` (`code` unique) aur `Bin` (`warehouse` FK, `label`) `UniqueConstraint(fields=["warehouse","label"])` ke saath. `BinSerializer(ModelSerializer)`. Ek bin seed karो. Assert karो. Phir `fields` se `warehouse` HATAकर dikhाओ ki validator chupchaap gायab ho jाता hai.',
        hint: '`Meta.constraints = [models.UniqueConstraint(...)]`. `connection.schema_editor()`. With all fields present, `dict(s.errors)` has `non_field_errors`. With `warehouse` removed from `fields`, `s.is_valid()` returns `True` for the duplicate — the point of the exercise.',
        hintHi: '`Meta.constraints = [models.UniqueConstraint(...)]`. Saare fields present -> `dict(s.errors)` mein `non_field_errors`. `warehouse` remove -> duplicate ke liye `s.is_valid()` `True`.',
      },
      {
        task: 'Model `Event` (`starts_at` datetime, `ends_at` datetime, `capacity` int). `EventSerializer(ModelSerializer)`. In `validate`, enforce `ends_at > starts_at` (attach to `ends_at`) AND `capacity` between 1 and 10000. Make it PATCH-safe: create an event, then `PATCH` only `capacity=0` (dates absent) and confirm you get the capacity error, not a `KeyError`. Then `PATCH` only `ends_at` to before `starts_at` and confirm the date error fires using the instance\'s `starts_at`.',
        taskHi: '`Event` (`starts_at`, `ends_at`, `capacity`) model karो. `EventSerializer`. `validate` mein `ends_at > starts_at` aur `capacity` 1-10000 enforce karो. PATCH-safe banाओ: event banाओ, phir sirf `capacity=0` PATCH karके capacity error confirm karो (KeyError nahi). Phir sirf `ends_at` PATCH karके date error confirm karो.',
        hint: 'In `validate`: `starts = attrs.get("starts_at", getattr(self.instance, "starts_at", None))` and same for `ends_at`. Guard `if starts and ends and ends <= starts`. `capacity = attrs.get("capacity", getattr(self.instance, "capacity", None))`.',
        hintHi: '`validate` mein: `starts = attrs.get("starts_at", getattr(self.instance, "starts_at", None))`. `if starts and ends and ends <= starts` guard karो.',
      },
    ],

    keyTakeaways: [
      'Validation order (same as a Form): (1) field-level — type coercion + `required`/`allow_null` + the field\'s `validators` (incl. auto `UniqueValidator`); (2) `validate_<field>(self, value)` for fields that passed (1) — MUST `return value`; (3) `validate(self, attrs)` — cross-field, MUST `return attrs`.',
      '`validate_<field>` = one field in isolation. `validate(attrs)` = rules relating 2+ fields. Never reach into `self.initial_data` from a field method (raw, un-coerced).',
      'In `validate`, raise `ValidationError("msg")` -> `non_field_errors`; raise `ValidationError({"field": "msg"})` -> attaches to that field. On `partial=True` (PATCH) absent fields are NOT in `attrs` — use `attrs.get("x", getattr(self.instance, "x", default))`.',
      'The `validators=[...]` list (field-level: callables/classes; object-level: classes in `Meta.validators`) is for REUSE — write a rule once, reference it across serializers.',
      '`UniqueValidator` / `UniqueTogetherValidator` check uniqueness during validation -> clean `400`, instead of the insert hitting the DB and raising `IntegrityError` -> unhandled `500`.',
      '`ModelSerializer` AUTO-adds `UniqueValidator` for every `unique=True` field, and `UniqueTogetherValidator` from `unique_together`/`UniqueConstraint` — but ONLY if ALL covered fields are in `Meta.fields` (drop one and it silently vanishes). On update it excludes the current instance.',
      '`is_valid(raise_exception=True)` raises `rest_framework.exceptions.ValidationError` -> DRF\'s default handler -> `HTTP 400` with `errors` as the body. Generic views / ViewSets call this for you.',
      'DRF validation is SEPARATE from `Model.full_clean()` — `serializer.save()` does NOT run model `clean()`. Put every API invariant in the serializer; back the critical ones with DB `constraints`.',
    ],
    keyTakeawaysHi: [
      'Validation order (Form jaisा): (1) field-level — type coercion + `required`/`allow_null` + field ke `validators` (auto `UniqueValidator` sहित); (2) (1) pass karne waale fields ke liye `validate_<field>(self, value)` — `return value` ZAROORI; (3) `validate(self, attrs)` — cross-field, `return attrs` ZAROORI.',
      '`validate_<field>` = ek field akelे. `validate(attrs)` = 2+ fields ko relate karता niyam. Ek field method se kabhi `self.initial_data` mein mat pahुँcho (raw, un-coerced).',
      '`validate` mein, `ValidationError("msg")` -> `non_field_errors`; `ValidationError({"field": "msg"})` -> us field se attach. `partial=True` (PATCH) par absent fields `attrs` mein NAHI — `attrs.get("x", getattr(self.instance, "x", default))` istemal karो.',
      '`validators=[...]` list REUSE ke liye hai — ek niyam ek baar likhо, serializers mein reference karो.',
      '`UniqueValidator` / `UniqueTogetherValidator` validation ke dौran uniqueness check karте hain -> saaf `400`, insert ke DB hit karके `IntegrityError` -> unhandled `500` ke bजाy.',
      '`ModelSerializer` har `unique=True` field ke liye `UniqueValidator` AUTO-add karता hai, aur `unique_together`/`UniqueConstraint` se `UniqueTogetherValidator` — par SIRF agar SAARE covered fields `Meta.fields` mein hon. Update par current instance ko exclude karता hai.',
      '`is_valid(raise_exception=True)` `rest_framework.exceptions.ValidationError` raise karता hai -> DRF default handler -> `HTTP 400` `errors` body ke saath. Generic views / ViewSets ye aapke liye call karती hain.',
      'DRF validation `Model.full_clean()` se ALAG hai — `serializer.save()` model `clean()` NAHI chalाता. Har API invariant serializer mein daalो; critical ko DB `constraints` se back karो.',
    ],
  },

  {
    slug: 'dj-drf-nested-and-related-serializers',
    title: 'Related & Nested Serializers (and the N+1 they hide)',
    titleHi: 'Related & Nested Serializers (aur wo N+1 jо ye chhupाते hain)',
    description: 'A foreign key can be rendered as a bare id (`PrimaryKeyRelatedField`), a label (`StringRelatedField`/`SlugRelatedField`), a hyperlink, or a full nested object. Nested *reads* are one line; nested *writes* need you to override `create`/`update`. And every nested/related field walks a relation per object — so serializing a list without `select_related`/`prefetch_related` is an N+1.',
    descriptionHi: 'Ek foreign key ek bare id (`PrimaryKeyRelatedField`), ek label (`StringRelatedField`/`SlugRelatedField`), ek hyperlink, ya ek poora nested object render ho sakta hai. Nested *reads* ek line hain; nested *writes* ke liye aapko `create`/`update` override karna hoता hai. Aur har nested/related field prati object ek relation walk karта hai — toh bina `select_related`/`prefetch_related` ke ek list serialize karna ek N+1 hai.',
    difficulty: 'HARD',
    duration: 24,

    order: 3,

    analogy: {
      en: '**A contact card that can show a colleague\'s name in five different levels of detail.** You can print just their employee number (`PrimaryKeyRelatedField` — compact, the client looks them up separately). Or their name (`StringRelatedField` — whatever `__str__` returns). Or a specific label like their username (`SlugRelatedField`). Or a clickable link to their full profile page (`HyperlinkedRelatedField`). Or their entire profile embedded right there on the card — photo, title, team (a nested serializer). Reading is easy: pick the level and DRF fills it in. Writing is where it gets real — if the card lets you *edit* the embedded profile, someone has to decide whether that creates a new colleague, updates the existing one, or is rejected; DRF makes you write that decision (`create`/`update`). And the hidden cost: if you print a *directory* of 200 cards each showing the full embedded profile, and you did not fetch all those profiles up front, you have just made 200 separate trips to HR — the N+1.',
      hi: '**Ek contact card jо ek colleague ka naam paanch alag detail levels mein dikhा sakta hai.** Aap sirf unka employee number print kar sakte ho (`PrimaryKeyRelatedField` — compact). Ya unka naam (`StringRelatedField` — jо `__str__` lautाता hai). Ya ek vishisht label jaise unka username (`SlugRelatedField`). Ya unke full profile page ka ek clickable link (`HyperlinkedRelatedField`). Ya unka poora profile card par embedded — photo, title, team (ek nested serializer). Padhna aasan hai. Likhna asli hai — agar card aapko embedded profile *edit* karने deता hai, kisi ko tay karna hoगा ki wo ek naya colleague banाता hai, existing ko update karता hai, ya reject hoता hai; DRF aapse wo decision likhवाता hai (`create`/`update`). Aur chhupी cost: agar aap 200 cards ki *directory* print karते ho har ek full embedded profile ke saath, aur aapne wo profiles pehle fetch nahi kiye, aapne abhi HR ke 200 alag chakkar lगा diye — N+1.',
    },

    simple: `**Related fields (how a FK renders)**

\`\`\`python
class BookSerializer(serializers.ModelSerializer):
    # pick ONE representation for the 'author' FK:
    author = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all())   # 7          (default)
    author = serializers.StringRelatedField()                                    # "Ada Lovelace"  (read-only)
    author = serializers.SlugRelatedField(slug_field="username",
                                          queryset=Author.objects.all())         # "ada"
    author = serializers.HyperlinkedRelatedField(view_name="author-detail",
                                                 read_only=True)                 # "http://.../authors/7/"
    author = AuthorSerializer(read_only=True)                                    # {"id": 7, "name": "Ada", ...}

    class Meta:
        model = Book
        fields = ["id", "title", "author"]
\`\`\`

**Nested READ — one line**

\`\`\`python
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "name", "country"]

class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)                 # to-one:  nested object
    reviews = ReviewSerializer(many=True, read_only=True)     # to-many: list of nested objects
    class Meta:
        model = Book
        fields = ["id", "title", "author", "reviews"]

# {"id": 1, "title": "...", "author": {"id": 7, "name": "Ada", "country": "GB"},
#  "reviews": [{"id": 3, "stars": 5, "text": "..."}]}
\`\`\`

**Nested WRITE — override \`create\` / \`update\`**

\`\`\`python
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)                    # writable (no read_only)
    class Meta:
        model = Order
        fields = ["id", "customer", "items"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")              # pull nested out
        order = Order.objects.create(**validated_data)
        OrderItem.objects.bulk_create(
            [OrderItem(order=order, **item) for item in items_data])
        return order

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()                     # simplest: replace
            OrderItem.objects.bulk_create(
                [OrderItem(order=instance, **item) for item in items_data])
        return instance
\`\`\`

**\`depth\` — quick read-only nesting**

\`\`\`python
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "author", "publisher"]
        depth = 1        # expand FKs one level, READ-ONLY. Fine for prototypes, not for real APIs.
\`\`\`

**The N+1 — fix in the VIEW**

\`\`\`python
class BookViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BookSerializer
    def get_queryset(self):
        return (Book.objects
                .select_related("author", "publisher")       # to-one -> JOIN
                .prefetch_related("reviews"))                 # to-many -> 1 extra query
\`\`\`

\`\`\`
to-one FK / O2O   -> nested serializer field OR PrimaryKey/Slug/StringRelated ;  select_related
reverse FK / M2M  -> nested serializer(many=True) OR ...RelatedField(many=True) ;  prefetch_related
nested WRITE: field must be writable + override create()/update() to pop & handle the nested data
depth=N: read-only auto-nesting; never writable; easy to over-fetch -- prefer explicit nested serializers
context: self.context["request"] / ["view"] -- needed by Hyperlinked* fields and passed to children
\`\`\``,

    simpleHi: `**Related fields (ek FK kaise render hoता hai)**

\`\`\`python
class BookSerializer(serializers.ModelSerializer):
    # 'author' FK ke liye EK representation chunо:
    author = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all())   # 7          (default)
    author = serializers.StringRelatedField()                                    # "Ada Lovelace"  (read-only)
    author = serializers.SlugRelatedField(slug_field="username",
                                          queryset=Author.objects.all())         # "ada"
    author = AuthorSerializer(read_only=True)                                    # {"id": 7, "name": "Ada", ...}

    class Meta:
        model = Book
        fields = ["id", "title", "author"]
\`\`\`

**Nested READ — ek line**

\`\`\`python
class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)                 # to-one:  nested object
    reviews = ReviewSerializer(many=True, read_only=True)     # to-many: nested objects ki list
    class Meta:
        model = Book
        fields = ["id", "title", "author", "reviews"]
\`\`\`

**Nested WRITE — \`create\` / \`update\` override**

\`\`\`python
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)                    # writable (koi read_only nahi)
    class Meta:
        model = Order
        fields = ["id", "customer", "items"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")              # nested bahar nikalо
        order = Order.objects.create(**validated_data)
        OrderItem.objects.bulk_create(
            [OrderItem(order=order, **item) for item in items_data])
        return order
\`\`\`

**\`depth\` — quick read-only nesting**

\`\`\`python
class Meta:
    model = Book
    fields = ["id", "title", "author", "publisher"]
    depth = 1        # FKs ek level expand, READ-ONLY. Prototypes ke liye theek, asli APIs ke liye nahi.
\`\`\`

**N+1 — VIEW mein fix**

\`\`\`python
class BookViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BookSerializer
    def get_queryset(self):
        return (Book.objects
                .select_related("author", "publisher")       # to-one -> JOIN
                .prefetch_related("reviews"))                 # to-many -> 1 extra query
\`\`\`

\`\`\`
to-one FK / O2O   -> nested serializer field YA PrimaryKey/Slug/StringRelated ;  select_related
reverse FK / M2M  -> nested serializer(many=True) YA ...RelatedField(many=True) ;  prefetch_related
nested WRITE: field writable hona chahिए + create()/update() override karके nested data pop & handle karो
depth=N: read-only auto-nesting; kabhi writable nahi; over-fetch aasan -- explicit nested serializers prefer karो
context: self.context["request"] / ["view"] -- Hyperlinked* fields ko chahिए aur children ko pass hoता hai
\`\`\``,

    content: `## Related fields — five ways to render a FK

For a to-one relation (\`ForeignKey\`, \`OneToOneField\`):

| Field | Output | Writable? | Needs |
|---|---|---|---|
| \`PrimaryKeyRelatedField\` | \`7\` | yes (\`queryset=\`) | — (the default for a FK) |
| \`StringRelatedField\` | \`"Ada Lovelace"\` (the target's \`__str__\`) | no | — |
| \`SlugRelatedField(slug_field="username")\` | \`"ada"\` | yes (\`queryset=\`) | a unique-ish field |
| \`HyperlinkedRelatedField(view_name=…)\` | \`"http://…/authors/7/"\` | yes (\`queryset=\`) | \`request\` in context, a URL conf |
| \`AuthorSerializer()\` | \`{"id": 7, …}\` | not automatically | a nested serializer |

For a to-many relation (reverse FK, \`ManyToManyField\`) add \`many=True\`: \`PrimaryKeyRelatedField(many=True, …)\` → \`[7, 9]\`, \`ReviewSerializer(many=True)\` → a list of dicts.

**Choose by what the client needs.** A list endpoint usually wants ids or slugs (small payload, client already has the lookup data). A detail endpoint often wants the nested object (one request instead of two). An API that hands out links wants \`Hyperlinked*\`.

## Nested reads

A nested serializer as a field just works for **reading**:

\`\`\`python
class BookSerializer(serializers.ModelSerializer):
    author  = AuthorSerializer(read_only=True)                 # to-one
    reviews = ReviewSerializer(many=True, read_only=True)      # to-many
    class Meta:
        model = Book
        fields = ["id", "title", "author", "reviews"]
\`\`\`

Mark them \`read_only=True\` unless you are implementing nested writes — otherwise DRF expects the client to send the full nested payload and you have not written the code to handle it.

## Nested writes — you own \`create\` / \`update\`

DRF deliberately does **not** guess how to write nested data (create vs update vs replace vs link is application-specific). If a nested field is writable, override:

\`\`\`python
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    class Meta:
        model = Order
        fields = ["id", "customer", "items"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        OrderItem.objects.bulk_create([OrderItem(order=order, **it) for it in items_data])
        return order

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        instance = super().update(instance, validated_data)     # scalar fields
        if items_data is not None:
            instance.items.all().delete()
            OrderItem.objects.bulk_create([OrderItem(order=instance, **it) for it in items_data])
        return instance
\`\`\`

The "delete all + recreate" approach is the simplest and is fine when items have no identity the client cares about. If they do (editing specific line items), match on a client-sent \`id\`, update the matched ones, create the new ones, delete the missing ones — more code, and libraries like \`drf-writable-nested\` package it. Wrap the whole thing in \`transaction.atomic\` (Module 8) so a partial failure rolls back.

**Alternative: two fields, one read one write.** \`items = OrderItemSerializer(many=True, read_only=True)\` for output plus \`item_ids = PrimaryKeyRelatedField(many=True, write_only=True, source="items", queryset=…)\` for input — avoids nested-write code entirely when the client only needs to *link* existing rows, not create them.

## \`depth\`

\`Meta.depth = 1\` auto-expands every relation one level, **read-only**. It is a prototyping shortcut. Downsides: you cannot control which fields of the nested object appear, it is never writable, and it silently makes payloads large and queries N+1. Real APIs use explicit nested serializers.

## The N+1 — and it is in the VIEW, not the serializer

Every related/nested field pulls its value off the instance. For a to-one that is \`instance.author\` — a query if \`author\` was not \`select_related\`. For a to-many it is \`instance.reviews.all()\` — a query per parent if not \`prefetch_related\`. Serializing a **list** of 50 books with a nested \`author\` and \`reviews\` is \`1 + 50 + 50\` queries unless the queryset was prepared:

\`\`\`python
class BookViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BookSerializer
    def get_queryset(self):
        return (Book.objects
                .select_related("author")                     # -> the 50 author queries collapse into the JOIN
                .prefetch_related("reviews", "reviews__user")) # -> 1 (+1) extra query total
\`\`\`

DRF has no idea what your serializer will touch — **you** must line up \`get_queryset\` with the serializer's fields. This is the single most common DRF performance bug. Tools: \`assertNumQueries\` in a test, \`django-debug-toolbar\`, \`nplusone\`, or \`django-auto-prefetch\`.

Also relevant: a \`SerializerMethodField\` that calls \`obj.something.count()\` or \`.filter()\` is an N+1 the prefetch cannot always help with — use \`Count(…)\` annotations in \`get_queryset\` instead (Module 3).

## \`context\`

DRF passes \`context={"request": …, "view": …, "format": …}\` into the serializer (the generic views do this automatically). \`Hyperlinked*\` fields need \`request\` to build absolute URLs. Your own code reads \`self.context["request"].user\` for tenant scoping. Context propagates to nested serializers automatically.`,

    contentHi: `## Related fields — ek FK render karne ke paanch tarike

Ek to-one relation ke liye: \`PrimaryKeyRelatedField\` (\`7\`, default, writable), \`StringRelatedField\` (\`"Ada Lovelace"\`, read-only), \`SlugRelatedField(slug_field="username")\` (\`"ada"\`, writable), \`HyperlinkedRelatedField\` (URL, context mein \`request\` chahिए), \`AuthorSerializer()\` (nested dict).

Ek to-many relation ke liye \`many=True\` add karो.

**Client ko kya chahिए usse chunо.** Ek list endpoint aksar ids ya slugs chahता hai. Ek detail endpoint aksar nested object chahता hai.

## Nested reads

Ek nested serializer ek field ke roop mein **reading** ke liye kaam karता hai. Unhe \`read_only=True\` mark karो jab tak aap nested writes implement nahi kar rahe.

## Nested writes — aap \`create\` / \`update\` own karते ho

DRF jaanbujhकर nested data kaise likhना **guess nahi** karता. Agar ek nested field writable hai, override karो:

\`\`\`python
def create(self, validated_data):
    items_data = validated_data.pop("items")
    order = Order.objects.create(**validated_data)
    OrderItem.objects.bulk_create([OrderItem(order=order, **it) for it in items_data])
    return order
\`\`\`

"delete all + recreate" sabse saral hai. Agar items ki identity hai jispar client dhyान deता hai, ek client-sent \`id\` par match karो. Poore cheez ko \`transaction.atomic\` (Module 8) mein wrap karो.

**Vikalp: do fields, ek read ek write.** \`items = OrderItemSerializer(many=True, read_only=True)\` output ke liye plus \`item_ids = PrimaryKeyRelatedField(many=True, write_only=True, source="items", queryset=…)\` input ke liye.

## \`depth\`

\`Meta.depth = 1\` har relation ko ek level auto-expand karता hai, **read-only**. Ye ek prototyping shortcut hai. Nuksaan: aap control nahi kar sakte kaunse fields dikhते hain, ye kabhi writable nahi, aur ye chupchaap payloads bade aur queries N+1 banाता hai.

## N+1 — aur ye VIEW mein hai, serializer mein nahi

Har related/nested field apni value instance se nikalता hai. Ek to-one ke liye wo \`instance.author\` hai — ek query agar \`author\` \`select_related\` nahi tha. Ek to-many ke liye \`instance.reviews.all()\` — prati parent ek query. 50 books ki ek **list** nested \`author\` aur \`reviews\` ke saath serialize karna \`1 + 50 + 50\` queries hai jab tak queryset taiyar na ho:

\`\`\`python
def get_queryset(self):
    return (Book.objects.select_related("author").prefetch_related("reviews", "reviews__user"))
\`\`\`

DRF ko koi andaza nahi ki aapka serializer kya chhooएga — **aap** ko \`get_queryset\` ko serializer ke fields ke saath line up karna hoga. Ye sabse aam DRF performance bug hai.

Ek \`SerializerMethodField\` jо \`obj.something.count()\` call karता hai bhi ek N+1 hai — \`get_queryset\` mein \`Count(…)\` annotations istemal karो (Module 3).

## \`context\`

DRF \`context={"request": …, "view": …}\` serializer mein pass karता hai. \`Hyperlinked*\` fields ko URLs banाने ke liye \`request\` chahिए. Aapka apna code tenant scoping ke liye \`self.context["request"].user\` padhता hai. Context nested serializers mein automatically propagate hoता hai.`,

    examples: [
      {
        title: 'Five ways to render the same FK',
        titleHi: 'Wahi FK render karne ke paanch tarike',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from rest_framework import serializers

class Author(models.Model):
    name = models.CharField(max_length=50)
    username = models.SlugField(unique=True)
    class Meta:
        app_label = "__main__"
    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Author); se.create_model(Book)
ada = Author.objects.create(name="Ada Lovelace", username="ada")
book = Book.objects.create(title="Notes", author=ada)

class AuthorSer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "name", "username"]

def show(field):
    class S(serializers.ModelSerializer):
        author = field
        class Meta:
            model = Book
            fields = ["title", "author"]
    return S(book).data["author"]

print("PrimaryKey :", show(serializers.PrimaryKeyRelatedField(read_only=True)))
print("String     :", show(serializers.StringRelatedField()))
print("Slug       :", show(serializers.SlugRelatedField(slug_field="username", read_only=True)))
print("Nested     :", dict(show(AuthorSer(read_only=True))))`,
        output: `PrimaryKey : 1
String     : Ada Lovelace
Slug       : ada
Nested     : {'id': 1, 'name': 'Ada Lovelace', 'username': 'ada'}
`,
        explain: 'The same `author` FK renders four different ways depending only on the field class you assign: `PrimaryKeyRelatedField` gives the raw id (the DRF default for a FK), `StringRelatedField` gives `Author.__str__`, `SlugRelatedField(slug_field="username")` gives one chosen field, and a nested `AuthorSer` gives the whole object as a dict. A list endpoint usually wants the id or slug (small payload); a detail endpoint often wants the nested object (one request instead of two). You pick per view via `get_serializer_class()`.',
        explainHi: 'Wahi `author` FK chaar alag tarike se render hota hai sirf us field class ke aadhार par jo aap assign karte ho: `PrimaryKeyRelatedField` raw id deta hai (FK ke liye DRF default), `StringRelatedField` `Author.__str__` deta hai, `SlugRelatedField(slug_field="username")` ek chuna field deta hai, aur ek nested `AuthorSer` poora object ek dict ke roop mein deta hai. Ek list endpoint aksar id ya slug chahता hai; ek detail endpoint aksar nested object.',
      },
      {
        title: 'Nested write: override create() to build parent + children in one POST',
        titleHi: 'Nested write: create() override karke ek POST mein parent + children banao',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from rest_framework import serializers

class Order(models.Model):
    customer = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    sku = models.CharField(max_length=20)
    qty = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Order); se.create_model(OrderItem)

class OrderItemSer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["sku", "qty"]

class OrderSer(serializers.ModelSerializer):
    items = OrderItemSer(many=True)
    class Meta:
        model = Order
        fields = ["id", "customer", "items"]

    def create(self, validated_data):
        items = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        OrderItem.objects.bulk_create([OrderItem(order=order, **it) for it in items])
        return order

    def update(self, instance, validated_data):
        items = validated_data.pop("items", None)
        instance = super().update(instance, validated_data)
        if items is not None:
            instance.items.all().delete()
            OrderItem.objects.bulk_create([OrderItem(order=instance, **it) for it in items])
        return instance

payload = {"customer": "Ada", "items": [{"sku": "A1", "qty": 2}, {"sku": "B2", "qty": 1}]}
s = OrderSer(data=payload)
s.is_valid(raise_exception=True)
order = s.save()
print("order", order.id, "items:", list(order.items.values_list("sku", "qty")))
print("round-trip:", OrderSer(order).data)

s2 = OrderSer(order, data={"items": [{"sku": "C3", "qty": 9}]}, partial=True)
s2.is_valid(raise_exception=True)
s2.save()
print("after PATCH items:", list(Order.objects.get(pk=order.pk).items.values_list("sku", "qty")))

bad = OrderSer(data={"customer": "Bo", "items": [{"sku": "X", "qty": "notint"}]})
print("nested validation ->", bad.is_valid(), {k: str(v) for k, v in bad.errors.items()})`,
        output: `order 1 items: [('A1', 2), ('B2', 1)]
round-trip: {'id': 1, 'customer': 'Ada', 'items': [{'sku': 'A1', 'qty': 2}, {'sku': 'B2', 'qty': 1}]}
after PATCH items: [('C3', 9)]
nested validation -> False {'items': "{0: {'qty': [ErrorDetail(string='A valid integer is required.', code='invalid')]}}"}
`,
        explain: 'The `items` field is a writable nested serializer (`many=True`, no `read_only`), so a POST body carries the whole aggregate. `ModelSerializer.create()` cannot write nested data, so the override `pop`s `items` out of `validated_data`, creates the `Order`, then `bulk_create`s the children. `update()` does the same with delete-all + recreate. Nested validation still runs — an invalid `qty` produces an error nested under `items`, keyed by the index of the bad row. Wrap the whole thing in `transaction.atomic` in real code so a partial failure rolls back.',
        explainHi: '`items` field ek writable nested serializer hai (`many=True`, koi `read_only` nahi), toh ek POST body poora aggregate le jाता hai. `ModelSerializer.create()` nested data nahi likh sakta, toh override `items` ko `validated_data` se `pop` karता hai, `Order` banाता hai, phir children `bulk_create` karता hai. `update()` delete-all + recreate karता hai. Nested validation abhi bhi chalती hai — ek invalid `qty` `items` ke tahat nested ek error produce karता hai, bad row ke index se keyed. Asli code mein poore cheez ko `transaction.atomic` mein wrap karो.',
      },
      {
        title: 'The N+1: nested list serialization, measured, then fixed in get_queryset',
        titleHi: 'N+1: nested list serialization, maapा gaya, phir get_queryset mein fix',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "rest_framework", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.test.utils import CaptureQueriesContext
from rest_framework import serializers

class Author(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    class Meta:
        app_label = "__main__"

class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="reviews")
    stars = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    for m in (Author, Book, Review):
        se.create_model(m)
for a in range(5):
    au = Author.objects.create(name=f"A{a}")
    for b in range(4):
        bk = Book.objects.create(title=f"A{a}-B{b}", author=au)
        Review.objects.bulk_create([Review(book=bk, stars=s) for s in (3, 5)])

class ReviewSer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["stars"]

class BookSer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    reviews = ReviewSer(many=True, read_only=True)
    class Meta:
        model = Book
        fields = ["id", "title", "author", "reviews"]

def count(qs):
    with CaptureQueriesContext(connection) as ctx:
        data = BookSer(qs, many=True).data
        _ = str(data)
    return len(ctx.captured_queries)

print("20 books, naive Book.objects.all():", count(Book.objects.all()), "queries")
print("20 books, select_related + prefetch:",
      count(Book.objects.select_related("author").prefetch_related("reviews")), "queries")`,
        output: `20 books, naive Book.objects.all(): 41 queries
20 books, select_related + prefetch: 2 queries
`,
        explain: 'Serializing 20 books with a nested `author` (`StringRelatedField`) and nested `reviews` list: the naive `Book.objects.all()` is 1 query for the books + 20 for `book.author` (one per book, not `select_related`) + 20 for `book.reviews.all()` (one per book, not `prefetch_related`) = 41. Adding `.select_related("author").prefetch_related("reviews")` to the queryset collapses that to 2 (books-with-author-JOIN + one IN query for all reviews). The serializer is identical in both runs — the fix is entirely in the queryset the view hands it via `get_queryset`.',
        explainHi: '20 books ko ek nested `author` aur nested `reviews` list ke saath serialize karna: naive `Book.objects.all()` 1 query books ke liye + 20 `book.author` ke liye + 20 `book.reviews.all()` ke liye = 41. Queryset mein `.select_related("author").prefetch_related("reviews")` add karna ise 2 mein collapse karता hai. Serializer dono runs mein identical hai — fix poori tarah us queryset mein hai jo view ise `get_queryset` ke zariye deता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()          # no read_only -> DRF treats it as writable
    class Meta:
        model = Book
        fields = ["id", "title", "author"]
# POST {"title": "x", "author": 7} -> {"author": {"non_field_errors": ["Invalid data. Expected a dictionary..."]}}
# and even with a dict it fails: no create() override -> "The .create() method does not support writable nested"`,
        right: `class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)                       # for output
    author_id = serializers.PrimaryKeyRelatedField(
        source="author", write_only=True, queryset=Author.objects.all())   # for input
    class Meta:
        model = Book
        fields = ["id", "title", "author", "author_id"]`,
        why: 'A bare nested serializer field is *writable* by default, so DRF now expects the client to POST the full nested object — and then raises because `ModelSerializer.create()` cannot write nested data. If the client only needs to link an existing row, use a read-only nested serializer for output plus a `write_only` `PrimaryKeyRelatedField` (with `source=` pointing at the real FK) for input. Only write nested-`create`/`update` when the client genuinely creates the child in the same request.',
        whyHi: 'Ek bare nested serializer field default se *writable* hai, toh DRF ab client se poora nested object POST karne ki ummeed karता hai — aur phir raise karता hai kyunki `ModelSerializer.create()` nested data nahi likh sakta. Agar client ko sirf ek existing row link karni hai, output ke liye ek read-only nested serializer plus input ke liye ek `write_only` `PrimaryKeyRelatedField` (`source=` real FK par) istemal karो.',
      },
      {
        wrong: `class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()          # no select_related / prefetch_related
    serializer_class = OrderSerializer      # OrderSerializer nests customer + items + items.product
# GET /orders/ over 100 orders -> hundreds of queries; p95 latency spikes`,
        right: `class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    def get_queryset(self):
        return (Order.objects
                .select_related("customer")
                .prefetch_related("items", "items__product"))`,
        why: 'The serializer decides *what* related data is read; the view\'s queryset decides *how many queries* that takes. They must be kept in sync by hand — DRF cannot infer it. A nested `ModelViewSet` with a plain `queryset = Model.objects.all()` and a serializer that nests two levels is the textbook N+1. Every time you add a nested field to a serializer, revisit the view\'s `get_queryset`.',
        whyHi: 'Serializer tay karता hai *kya* related data padhा jाता hai; view ka queryset tay karता hai *kitni queries* lगती hain. Unhe haath se sync mein rakhna padता hai — DRF infer nahi kar sakta. Jab bhi aap serializer mein ek nested field add karो, view ke `get_queryset` ko dobara dekhо.',
      },
      {
        wrong: `class Meta:
    model = Book
    fields = ["id", "title", "author", "reviews", "publisher", "tags"]
    depth = 2         # every relation expanded 2 levels, read-only, uncontrolled
# payload is huge, includes fields you did not mean to expose, and the query count explodes`,
        right: `class BookSerializer(serializers.ModelSerializer):
    author  = AuthorSlimSerializer(read_only=True)       # exactly the 3 fields you want
    reviews = ReviewSerializer(many=True, read_only=True)
    class Meta:
        model = Book
        fields = ["id", "title", "author", "reviews"]`,
        why: '`depth` is a prototyping toy: it expands *every* relation, you cannot choose which nested fields appear (so internal or sensitive columns leak), it is always read-only, and it makes over-fetching invisible. Real APIs declare explicit nested serializers — slim ones for lists, fuller ones for detail — so payload shape and query cost are both under your control.',
        whyHi: '`depth` ek prototyping khilona hai: ye *har* relation expand karता hai, aap nahi chun sakte kaunse nested fields dikhें (toh sensitive columns leak), ye hamesha read-only hai, aur over-fetching ko invisible banाता hai. Asli APIs explicit nested serializers declare karती hain — lists ke liye slim, detail ke liye fuller.',
      },
    ],

    realWorld: [
      {
        en: '**Ids on lists, nested on detail** — `GET /articles/` returns `"author": 7`; `GET /articles/7/` returns `"author": {"id": 7, "name": "…", "avatar": "…"}`. Two serializers, chosen by the view\'s `get_serializer_class()` based on `self.action`. Keeps list payloads small and detail payloads useful.',
        hi: '**Lists par ids, detail par nested** — `GET /articles/` `"author": 7` lautाता hai; `GET /articles/7/` `"author": {...}` lautाता hai. Do serializers, view ke `get_serializer_class()` dwara chune gaye.',
      },
      {
        en: '**Read-nested + write-ids pair for M2M** — `tags = TagSerializer(many=True, read_only=True)` for display, `tag_ids = PrimaryKeyRelatedField(many=True, write_only=True, source="tags", queryset=Tag.objects.all())` for editing. The client sends `{"tag_ids": [1, 4, 9]}`; no nested-write code needed.',
        hi: '**M2M ke liye read-nested + write-ids jodी** — display ke liye `tags = TagSerializer(many=True, read_only=True)`, editing ke liye `tag_ids = PrimaryKeyRelatedField(many=True, write_only=True, source="tags", queryset=...)`.',
      },
      {
        en: '**A single nested-write endpoint for "create the whole aggregate"** — `POST /invoices/` with header + line items in one body, `create()` wrapped in `transaction.atomic`, line items `bulk_create`d. Used when the client builds the whole thing client-side and submits once (an invoice, a survey with questions, an order).',
        hi: '**"poora aggregate banаओ" ke liye ek single nested-write endpoint** — `POST /invoices/` header + line items ek body mein, `create()` `transaction.atomic` mein wrapped, line items `bulk_create`d.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you represent a foreign key in a DRF serializer, and how do you make a nested object writable?',
        qHi: 'Aap ek DRF serializer mein ek foreign key kaise represent karते ho, aur ek nested object ko writable kaise banाते ho?',
        a: 'For reading, you pick a related field based on how much the client needs. PrimaryKeyRelatedField, the default for a foreign key, gives just the id and is writable if you pass a queryset. StringRelatedField gives the target\'s str and is read-only. SlugRelatedField gives one chosen unique field like a username and is writable. HyperlinkedRelatedField gives a URL and needs the request in the serializer context. And a nested serializer instance gives the whole object as a dict. For a to-many relation you add many equals True. A common pattern is ids on list endpoints for small payloads and a nested serializer on detail endpoints, choosing between two serializers in the view\'s get_serializer_class. Nested reads just work: declare author equals AuthorSerializer read_only True and DRF fills it in. Nested writes are deliberately not automatic, because whether an incoming nested object should create a new row, update an existing one, replace a set, or just link is application-specific. So if a nested field is writable you must override create and update on the parent serializer: pop the nested data out of validated_data, create or update the parent, then handle the children yourself — often delete-all-and-recreate for simple cases, or match on a client-sent id for editable line items — and wrap it in transaction dot atomic. The lighter alternative, when the client only needs to link existing rows rather than create them, is a pair of fields: a read-only nested serializer for output plus a write-only PrimaryKeyRelatedField whose source points at the real relation for input, so the client sends a list of ids and you write no nested-write code at all.',
        aHi: 'Padhने ke liye, aap ek related field chunते ho ki client ko kितna chahिए. PrimaryKeyRelatedField, ek foreign key ke liye default, sirf id deता hai aur writable hai agar aap ek queryset pass karो. StringRelatedField target ki str deता hai aur read-only hai. SlugRelatedField ek chuna hua unique field jaise username deता hai aur writable hai. HyperlinkedRelatedField ek URL deता hai aur context mein request chahिए. Aur ek nested serializer instance poora object ek dict ke roop mein deता hai. Ek to-many relation ke liye many equals True add karो. Ek aam pattern list endpoints par ids aur detail endpoints par ek nested serializer hai. Nested reads bस kaam karते hain. Nested writes jaanbujhकर automatic nahi hain, kyunki ek incoming nested object ko naya row banाना chahिए, existing update karna chahिए, ek set replace karna chahिए, ya bस link — ye application-specific hai. Toh agar ek nested field writable hai aapko parent serializer par create aur update override karna hoga: nested data ko validated_data se pop karो, parent create/update karो, phir children khud handle karो — aksar simple cases ke liye delete-all-and-recreate — aur ise transaction dot atomic mein wrap karो. Halkा vikalp ek fields ki jodी hai: output ke liye ek read-only nested serializer plus input ke liye ek write-only PrimaryKeyRelatedField.',
      },
      {
        q: 'Why is a nested-serializer list endpoint a classic N+1, and where exactly is the fix?',
        qHi: 'Ek nested-serializer list endpoint ek classic N+1 kyun hai, aur fix thीक kahaan hai?',
        a: 'When DRF serializes an object, each related or nested field pulls its value off the instance. A to-one nested field reads instance dot author, which triggers a database query if author was not already loaded via select_related. A to-many nested field reads instance dot reviews dot all, which is a query for each parent object unless reviews was prefetched. So serializing a single object might be a few queries, but serializing a list of fifty objects, each with a nested author and a nested reviews list, is one query for the books plus fifty for the authors plus fifty for the review sets — a hundred and one queries where two would do. The serializer is not where you fix this, because the serializer only describes what data to include; it has no control over how it is fetched. The fix is in the view\'s get_queryset: select_related for the to-one relations so they come back in the same JOIN, and prefetch_related for the to-many relations and for anything nested inside them, like reviews and reviews underscore underscore user. Then the serializer reads everything from data already in memory and the query count drops to two or three regardless of page size. Because DRF cannot infer what the serializer will touch, keeping get_queryset aligned with the serializer\'s fields is a manual discipline — every time someone adds a nested field, the view needs revisiting — and it is the single most common DRF performance bug. You catch regressions with assertNumQueries in a test or a tool like nplusone. One caveat: a SerializerMethodField that calls dot count or dot filter on a related manager is an N plus one that prefetch does not always fix; for those you add Count annotations in get_queryset instead.',
        aHi: 'Jab DRF ek object serialize karता hai, har related ya nested field apni value instance se nikalता hai. Ek to-one nested field instance dot author padhता hai, jо ek database query trigger karता hai agar author pehle se select_related se load nahi tha. Ek to-many nested field instance dot reviews dot all padhता hai, jо har parent object ke liye ek query hai jab tak reviews prefetch na ho. Toh ek single object serialize karna kuch queries ho sakta hai, par pachas objects ki ek list, har ek nested author aur nested reviews list ke saath, books ke liye ek query plus authors ke liye pachas plus review sets ke liye pachas hai — ek sau ek queries jahaan do kaafi hote. Serializer wo jagah nahi hai jahaan aap ise fix karते ho, kyunki serializer sirf batाता hai kaunsा data include karna hai; iska control nahi ki ise kaise fetch kiya jाता hai. Fix view ke get_queryset mein hai: to-one relations ke liye select_related, aur to-many ke liye aur unke andar nested kisi bhi cheez ke liye prefetch_related. Phir query count do ya teen tak gir jाता hai. DRF infer nahi kar sakta, toh get_queryset ko serializer ke fields ke saath aligned rakhna ek manual discipline hai.',
      },
    ],

    exercises: [
      {
        task: 'Models `Publisher` (`name`), `Book` (`title`, `publisher` FK). One publisher, two books. Build a serializer per representation and print `BookSer(book).data["publisher"]` for: `PrimaryKeyRelatedField(read_only=True)`, `StringRelatedField()` (give `Publisher.__str__`), `SlugRelatedField(slug_field="name", read_only=True)`, and a nested `PublisherSer(read_only=True)`. Confirm each produces the expected shape (int, str, str, dict).',
        taskHi: '`Publisher` (`name`), `Book` (`title`, `publisher` FK). Ek publisher, do books. Prati representation ek serializer banаकर `BookSer(book).data["publisher"]` print karो: `PrimaryKeyRelatedField`, `StringRelatedField()`, `SlugRelatedField(slug_field="name")`, nested `PublisherSer`.',
        hint: 'Define `PublisherSer` once, then a helper that builds a `Book` serializer class with the given `publisher` field. `Publisher.__str__` returns `self.name`. `read_only=True` on the related fields so you do not need a queryset.',
        hintHi: '`PublisherSer` ek baar define karो, phir ek helper jо diye gaye `publisher` field ke saath ek `Book` serializer class banाता hai. `read_only=True` taaki queryset na chahिए.',
      },
      {
        task: 'Models `Survey` (`title`) and `Question` (`survey` FK `related_name="questions"`, `text`, `order` int). Write `SurveySerializer` with a writable nested `questions = QuestionSerializer(many=True)`. Override `create` (parent + `bulk_create` children) and `update` (delete-all + recreate when `questions` is present). Test: POST a survey with 3 questions -> all saved; round-trip `.data` shows the nested list; `PATCH` with 1 question -> old 3 replaced; POST with a question missing `text` -> `is_valid()` False, error nested under `questions`.',
        taskHi: '`Survey` (`title`) aur `Question` (`survey` FK, `text`, `order`) model karो. `SurveySerializer` writable nested `questions = QuestionSerializer(many=True)` ke saath likhо. `create` aur `update` override karो. Test karो.',
        hint: 'In `create`: `qs = validated_data.pop("questions"); survey = Survey.objects.create(**validated_data); Question.objects.bulk_create([Question(survey=survey, **q) for q in qs])`. `update`: `super().update(...)` for scalars, then if `questions` present `instance.questions.all().delete()` + recreate.',
        hintHi: '`create` mein: `qs = validated_data.pop("questions"); survey = Survey.objects.create(**validated_data); Question.objects.bulk_create(...)`. `update`: scalars ke liye `super().update(...)`.',
      },
      {
        task: 'Reproduce and fix the N+1. Models `Team` (`name`), `Player` (`team` FK `related_name="players"`, `name`), `Goal` (`player` FK `related_name="goals"`, `minute`). Seed 4 teams x 5 players x 2 goals. `TeamSerializer` nests `players` which nests `goals`. Using `CaptureQueriesContext`, print the query count for `TeamSerializer(Team.objects.all(), many=True).data` (str-ify it to force evaluation) vs `Team.objects.prefetch_related("players__goals")`. Assert the prefetched version is <= 3.',
        taskHi: 'N+1 reproduce aur fix karो. `Team`, `Player` (`team` FK), `Goal` (`player` FK). 4x5x2 seed karो. `TeamSerializer` `players` nest kare jо `goals` nest kare. `CaptureQueriesContext` se naive vs `prefetch_related("players__goals")` query count print karो.',
        hint: '`from django.test.utils import CaptureQueriesContext`. `with CaptureQueriesContext(connection) as ctx: _ = str(TeamSerializer(qs, many=True).data)` then `len(ctx.captured_queries)`. Nested prefetch uses the `__` lookup: `prefetch_related("players__goals")`.',
        hintHi: '`with CaptureQueriesContext(connection) as ctx: _ = str(TeamSerializer(qs, many=True).data)` phir `len(ctx.captured_queries)`. Nested prefetch: `prefetch_related("players__goals")`.',
      },
    ],

    keyTakeaways: [
      'A FK renders as: `PrimaryKeyRelatedField` (`7`, default, writable w/ `queryset=`), `StringRelatedField` (`__str__`, RO), `SlugRelatedField(slug_field=)` (a label, writable), `HyperlinkedRelatedField` (URL, needs `request` in context), or a nested serializer (`{...}`). Add `many=True` for to-many.',
      'Choose the representation by what the client needs: ids/slugs on lists (small), nested objects on detail (one request). Two serializers picked via `get_serializer_class()`.',
      'Nested READ = one line: `author = AuthorSerializer(read_only=True)` / `reviews = ReviewSerializer(many=True, read_only=True)`. Mark `read_only` unless you implement nested writes.',
      'Nested WRITE = you override `create`/`update`: `pop` the nested data from `validated_data`, save the parent, then handle children (simplest: delete-all + `bulk_create`; identity-aware: match on client `id`). Wrap in `transaction.atomic`.',
      'Lighter alternative to nested writes: a read-only nested serializer for output + a `write_only` `PrimaryKeyRelatedField(source="rel", queryset=...)` for input — client sends ids, no nested-write code.',
      '`Meta.depth = N` auto-nests read-only — a prototyping toy. Downsides: no field control (leaks columns), never writable, hides over-fetching. Real APIs use explicit nested serializers.',
      'THE N+1: every related/nested field walks a relation per object. Serializing a list of 50 with nested `author` + `reviews` = `1 + 50 + 50` queries. Fix is in the VIEW: `get_queryset()` with `select_related` (to-one) + `prefetch_related` (to-many, incl. nested `rel__subrel`). DRF cannot infer this — keep `get_queryset` in sync with the serializer by hand.',
      'A `SerializerMethodField` calling `obj.rel.count()`/`.filter()` is an N+1 prefetch may not fix — use `Count(...)` annotations in `get_queryset` (Module 3). `context` (`request`/`view`) propagates to nested serializers automatically.',
    ],
    keyTakeawaysHi: [
      'Ek FK render hoता hai: `PrimaryKeyRelatedField` (`7`, default), `StringRelatedField` (`__str__`, RO), `SlugRelatedField(slug_field=)` (label, writable), `HyperlinkedRelatedField` (URL, context mein `request` chahिए), ya ek nested serializer. To-many ke liye `many=True`.',
      'Representation client ki zaroorat se chunо: lists par ids/slugs (chhota), detail par nested objects. Do serializers `get_serializer_class()` se.',
      'Nested READ = ek line: `author = AuthorSerializer(read_only=True)`. `read_only` mark karो jab tak nested writes implement na karो.',
      'Nested WRITE = aap `create`/`update` override karते ho: nested data ko `validated_data` se `pop` karो, parent save karो, phir children handle karो (saral: delete-all + `bulk_create`). `transaction.atomic` mein wrap karो.',
      'Nested writes ka halkा vikalp: output ke liye read-only nested serializer + input ke liye `write_only` `PrimaryKeyRelatedField(source="rel", queryset=...)` — client ids bhejता hai.',
      '`Meta.depth = N` read-only auto-nests — prototyping khilona. Nuksaan: field control nahi (columns leak), kabhi writable nahi, over-fetching chhupाता hai.',
      'N+1: har related/nested field prati object ek relation walk karता hai. 50 ki list nested `author` + `reviews` ke saath = `1 + 50 + 50` queries. Fix VIEW mein: `get_queryset()` `select_related` (to-one) + `prefetch_related` (to-many, nested `rel__subrel` sहित). DRF infer nahi kar sakta.',
      'Ek `SerializerMethodField` jо `obj.rel.count()` call karता hai ek N+1 hai — `get_queryset` mein `Count(...)` annotations istemal karो (Module 3). `context` nested serializers mein automatically propagate hoता hai.',
    ],
  },
];
