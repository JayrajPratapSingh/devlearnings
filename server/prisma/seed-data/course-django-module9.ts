/**
 * Django Complete Course — Module 9: Admin, Dashboards & Observability, lessons 1-3.
 *
 * Lesson 1: ModelAdmin — register/decorator, list_display + @admin.display,
 *           list_select_related / list_filter / search_fields / date_hierarchy,
 *           readonly_fields / fieldsets, get_queryset, save_model, formfield_overrides,
 *           autocomplete_fields, list_editable, the N+1 in the changelist.
 * Lesson 2: actions & inlines — custom bulk actions (signature, message_user,
 *           returning a response, intermediate pages), TabularInline / StackedInline,
 *           inline get_queryset / permissions / extra / max_num, editing related rows.
 * Lesson 3: admin permissions & audit — has_view/add/change/delete_permission,
 *           per-user get_queryset scoping (the admin IDOR), has_module_permission,
 *           is_staff vs is_superuser, LogEntry / object history, the admin is an
 *           internal tool (never public), safe-by-default patterns.
 *
 * Conventions: see course-django-module8.ts header. Admin examples need the FULL stack:
 * INSTALLED_APPS = admin/auth/contenttypes/sessions/messages + __main__; the 3 auth/session/
 * message middlewares; a TEMPLATES entry with APP_DIRS + the auth/messages/request context
 * processors. After create_model, call create_permissions() per app_config manually (the
 * post_migrate signal doesn't fire for a __main__ app). RequestFactory requests need
 * .user, .session={} and ._messages=FallbackStorage(r) set by hand. LogEntry.objects
 * .log_actions() is PLURAL in Django 6.1 (takes a queryset). Backticks escaped as \`.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_9: CourseLesson[] = [
  {
    slug: 'dj-admin-modeladmin',
    title: 'The Django Admin: `ModelAdmin`, `list_display` & the Changelist',
    titleHi: 'Django Admin: `ModelAdmin`, `list_display` & Changelist',
    description: 'The admin is a full CRUD interface generated from your models — free, and genuinely useful for internal operations. `ModelAdmin` is where you shape it: which columns the list shows, how it is filtered and searched, which fields are editable, and — crucially — how to stop the list view from firing one query per row.',
    descriptionHi: 'Admin aapke models se generate kiya gaya ek poora CRUD interface hai — muft, aur internal operations ke liye sach mein useful. `ModelAdmin` wahaan hai jahaan aap ise shape karte ho: list kaunse columns dikhati hai, ye kaise filter aur search hoti hai, kaunse fields editable hain, aur — mahatvapoorn roop se — list view ko prati row ek query firing se kaise roka jaaye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A warehouse manager\'s clipboard, versus the raw shelves.** Your models are the shelves — every item is there, but finding anything means walking every aisle. `ModelAdmin` is the clipboard the manager actually carries: a summary sheet showing just the columns that matter (`list_display`), tabs down the side to filter to one category (`list_filter`), a search box (`search_fields`), and a few cells you can write in directly without opening the full record (`list_editable`). The single most important thing about that clipboard is how it is *compiled*: a lazy assistant re-walks to the back room to look up each item\'s supplier one at a time (a query per row — the changelist N+1), while a good one pulls the whole supplier list once and cross-references (`list_select_related`). Same clipboard, same rows, but one takes a minute and the other takes an hour when the warehouse has 50,000 items. The admin is a superb back-office clipboard; it is not, and was never meant to be, the shopfront.',
      hi: '**Ek warehouse manager ka clipboard, badle raw shelves.** Aapke models shelves hain — har item wahaan hai, par kuch bhi dhoondhna matlab har aisle chalna. `ModelAdmin` wo clipboard hai jo manager asal mein carry karta hai: ek summary sheet jo sirf maayne rakhne waale columns dikhati hai (`list_display`), ek category tak filter karne ko side mein tabs (`list_filter`), ek search box (`search_fields`), aur kuch cells jinme aap seedhe likh sakte ho poora record khole bina (`list_editable`). Us clipboard ke baare mein sabse mahatvapoorn cheez ye hai ki ye kaise *compile* hota hai: ek lazy assistant har item ke supplier ko ek-ek karke dekhne back room dobara chalta hai (prati row ek query — changelist N+1), jabki ek achha poori supplier list ek baar kheenchta hai aur cross-reference karta hai (`list_select_related`). Wahi clipboard, wahi rows, par jab warehouse mein 50,000 items hain to ek ek minute leta hai aur doosra ek ghanta. Admin ek shaandaar back-office clipboard hai; ye shopfront nahi hai.',
    },

    simple: `**Register a model — two ways**

\`\`\`python
# admin.py
from django.contrib import admin
from .models import Book

# 1. quick
admin.site.register(Book)

# 2. with config (the decorator form)
@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "price", "published", "created"]
    list_select_related = ["author"]          # <-- JOIN the FK; kills the changelist N+1
    list_filter = ["published", "created"]
    search_fields = ["title", "author__name"] # __ spans relations
    date_hierarchy = "created"
    ordering = ["-created"]
    list_per_page = 50
\`\`\`

**Computed columns — \`@admin.display\`**

\`\`\`python
@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ["name", "book_count", "is_prolific"]

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_n=Count("books"))  # 1 query, not N

    @admin.display(description="# books", ordering="_n")
    def book_count(self, obj):
        return obj._n

    @admin.display(boolean=True, description="prolific?")
    def is_prolific(self, obj):
        return obj._n >= 10
\`\`\`

**The change form — \`fieldsets\`, \`readonly_fields\`**

\`\`\`python
class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ["created", "total_display"]       # shown but not editable
    fieldsets = [
        (None,       {"fields": ["customer", "status"]}),
        ("Money",    {"fields": ["subtotal", "tax", "total_display"]}),
        ("Meta",     {"fields": ["created"], "classes": ["collapse"]}),
    ]
    autocomplete_fields = ["customer"]     # a search box instead of a 100k-row <select>
\`\`\`

**Overriding save — server-controlled fields**

\`\`\`python
def save_model(self, request, obj, form, change):
    if not change:
        obj.created_by = request.user       # stamp, don't trust the form
    super().save_model(request, obj, form, change)
\`\`\`

\`\`\`
list_display         columns on the changelist (fields, callables, @admin.display methods)
list_select_related  FK columns to JOIN -> the changelist stops doing a query per row
list_filter          right-hand filter sidebar (field name, or a custom SimpleListFilter)
search_fields        the search box; "rel__field" spans relations; prefix ^ = startswith, = exact
autocomplete_fields  FK/M2M shown as an ajax search box (target model needs search_fields)
readonly_fields      visible on the form, not editable (real fields OR display callables)
get_queryset         override to annotate / select_related / scope (per-user -> lesson 3)
save_model           stamp server-controlled fields; always call super()
\`\`\``,

    simpleHi: `**Ek model register karo — do tareeke**

\`\`\`python
# admin.py
from django.contrib import admin
from .models import Book

# 1. quick
admin.site.register(Book)

# 2. config ke saath (decorator form)
@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "price", "published", "created"]
    list_select_related = ["author"]          # <-- FK JOIN karo; changelist N+1 maarta hai
    list_filter = ["published", "created"]
    search_fields = ["title", "author__name"] # __ relations span karta hai
    date_hierarchy = "created"
    ordering = ["-created"]
    list_per_page = 50
\`\`\`

**Computed columns — \`@admin.display\`**

\`\`\`python
@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ["name", "book_count", "is_prolific"]

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_n=Count("books"))  # 1 query, N nahi

    @admin.display(description="# books", ordering="_n")
    def book_count(self, obj):
        return obj._n

    @admin.display(boolean=True, description="prolific?")
    def is_prolific(self, obj):
        return obj._n >= 10
\`\`\`

**Change form — \`fieldsets\`, \`readonly_fields\`**

\`\`\`python
class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ["created", "total_display"]       # dikhta hai par editable nahi
    fieldsets = [
        (None,       {"fields": ["customer", "status"]}),
        ("Money",    {"fields": ["subtotal", "tax", "total_display"]}),
        ("Meta",     {"fields": ["created"], "classes": ["collapse"]}),
    ]
    autocomplete_fields = ["customer"]     # ek 100k-row <select> ke badle ek search box
\`\`\`

**Save override — server-controlled fields**

\`\`\`python
def save_model(self, request, obj, form, change):
    if not change:
        obj.created_by = request.user       # stamp karo, form par bharosa mat karo
    super().save_model(request, obj, form, change)
\`\`\`

\`\`\`
list_display         changelist par columns (fields, callables, @admin.display methods)
list_select_related  JOIN karne ko FK columns -> changelist prati row ek query karna band karta hai
list_filter          daayin filter sidebar (field name, ya ek custom SimpleListFilter)
search_fields        search box; "rel__field" relations span karta hai; prefix ^ = startswith, = exact
autocomplete_fields  FK/M2M ek ajax search box ke roop mein (target model ko search_fields chahiye)
readonly_fields      form par visible, editable nahi
get_queryset         annotate / select_related / scope karne ko override karo (per-user -> lesson 3)
save_model           server-controlled fields stamp karo; hamesha super() call karo
\`\`\``,

    content: `## What the admin is

Run \`django-admin startproject\` and you already have \`django.contrib.admin\` in \`INSTALLED_APPS\`. Register a model and you get a working list-search-filter-create-edit-delete interface at \`/admin/\`, with permissions, a change history, and inline editing of related objects — for free. It is one of Django's signature features and it is genuinely production-grade **for internal use**: ops teams, support staff, and data entry. It is **not** a customer-facing UI and should never be exposed to end users (lesson 3).

## \`ModelAdmin\`

You customise per model with a \`ModelAdmin\` subclass, registered with \`admin.site.register(Model, ModelAdmin)\` or the \`@admin.register(Model)\` decorator.

### The changelist (list view)

- **\`list_display\`** — the columns. Each entry is a model field name, a \`ModelAdmin\` method, a model method, or a callable. Non-field entries render as text; decorate them with \`@admin.display\` to set the column header (\`description\`), make it sortable (\`ordering="_annotation"\`), or render a boolean tick (\`boolean=True\`).
- **\`list_filter\`** — the right sidebar. A field name gives an automatic filter (choices for a char field with choices, a date drill-down for a date field, yes/no for a boolean). A \`SimpleListFilter\` subclass gives a custom one (\`lookups()\` + \`queryset()\`).
- **\`search_fields\`** — the search box. \`["title", "author__name"]\` searches both, spanning the FK. Prefixes: \`^\` = starts-with, \`=\` = exact match, \`@\` = full-text (Postgres). Every term must match *somewhere*.
- **\`date_hierarchy\`** — a year/month/day drill-down bar above the list.
- **\`list_editable\`** — fields editable inline on the changelist itself (must also be in \`list_display\`, and not the first column).
- **\`ordering\`, \`list_per_page\`, \`list_max_show_all\`, \`show_full_result_count\`** — the obvious knobs. Set \`show_full_result_count = False\` on huge tables to skip the unfiltered \`COUNT(*)\`.

### The changelist N+1

This is the one that catches everyone. \`list_display = ["title", "author"]\` renders \`str(book.author)\` for every row — and if \`author\` was not fetched, that is **one query per row**. On a 100-row page that is 101 queries; the admin feels broken.

- **\`list_select_related = ["author"]\`** adds the JOIN so the FK comes back with the row. Use a list of FK names, or \`True\` to follow all non-null FKs.
- For a computed column backed by an aggregate (\`book_count\` = \`Count("books")\`), override **\`get_queryset\`** and \`annotate\` it once, then read the annotation in the display method. Never call \`obj.books.count()\` in the method — that is the N+1 by another name.
- \`prefetch_related\` is not a \`ModelAdmin\` option; do it in \`get_queryset\` if a display method needs a to-many.

### The change form

- **\`fields\` / \`fieldsets\`** — control which fields appear and how they are grouped. \`fieldsets\` is a list of \`(title, {"fields": [...], "classes": ["collapse"]})\`. Omitting a field hides it (and, like a serializer's \`fields\`, is your allowlist against mass-assignment via the admin).
- **\`readonly_fields\`** — shown but not editable. Can be real fields (\`created\`), or display callables for computed/related read-only values.
- **\`autocomplete_fields = ["customer"]\`** — replaces the default \`<select>\` (which renders *every* row — unusable past a few hundred) with an ajax search box. The **target** model's \`ModelAdmin\` must define \`search_fields\`.
- **\`raw_id_fields\`** — a lighter alternative: just the id plus a lookup popup.
- **\`formfield_overrides = {models.TextField: {"widget": AdminMarkdownWidget}}\`** — swap the widget for a field *type* across the form.
- **\`prepopulated_fields = {"slug": ["title"]}\`** — JS that fills a slug from another field as you type.

### \`save_model\`, \`save_related\`, \`get_form\`

\`save_model(request, obj, form, change)\` runs just before the object is saved — stamp \`created_by = request.user\`, enforce an invariant, trigger a side effect. **Always call \`super().save_model(...)\`.** \`change\` is \`False\` on add, \`True\` on edit. \`get_form\` / \`get_fields\` / \`get_readonly_fields\` can vary the form by \`request\` or \`obj\` (e.g. more fields for superusers, everything readonly once an order ships).

## The admin still needs the ORM discipline

Every rule from Module 3 applies inside the admin. A slow changelist is almost always a missing \`list_select_related\` or an aggregate computed per-row. Turn on \`django-debug-toolbar\` or log \`connection.queries\` while loading an admin page — the admin will happily do 500 queries and just be slow, it will not warn you.`,

    contentHi: `## Admin kya hai

\`django-admin startproject\` chalao aur aapke paas pehle se \`django.contrib.admin\` \`INSTALLED_APPS\` mein hai. Ek model register karo aur aapको \`/admin/\` par ek kaam karta list-search-filter-create-edit-delete interface milta hai, permissions, ek change history, aur related objects ki inline editing ke saath — muft. Ye Django ki ek signature feature hai aur ye **internal use ke liye** sach mein production-grade hai: ops teams, support staff, data entry. Ye ek customer-facing UI **nahi** hai aur ise kabhi end users ke saamne nahi laana chahiye (lesson 3).

## \`ModelAdmin\`

Aap prati model ek \`ModelAdmin\` subclass se customise karte ho, \`admin.site.register(Model, ModelAdmin)\` ya \`@admin.register(Model)\` decorator se registered.

### Changelist (list view)

- **\`list_display\`** — columns. Har entry ek model field name, ek \`ModelAdmin\` method, ek model method, ya ek callable hai. \`@admin.display\` se decorate karo column header (\`description\`) set karne, ise sortable banane (\`ordering="_annotation"\`), ya ek boolean tick (\`boolean=True\`) render karne ke liye.
- **\`list_filter\`** — daayin sidebar. Ek field name ek automatic filter deta hai. Ek \`SimpleListFilter\` subclass ek custom deta hai.
- **\`search_fields\`** — search box. \`["title", "author__name"]\` dono search karta hai. Prefixes: \`^\` = starts-with, \`=\` = exact, \`@\` = full-text (Postgres).
- **\`date_hierarchy\`** — list ke upar ek year/month/day drill-down bar.
- **\`list_editable\`** — changelist par hi inline editable fields.
- **\`show_full_result_count = False\`** — bade tables par unfiltered \`COUNT(*)\` skip karne ko.

### Changelist N+1

Ye wo hai jo sabko pakadta hai. \`list_display = ["title", "author"]\` har row ke liye \`str(book.author)\` render karta hai — aur agar \`author\` fetch nahi hua, wo **prati row ek query** hai. Ek 100-row page par wo 101 queries hai.

- **\`list_select_related = ["author"]\`** JOIN add karta hai. FK names ki ek list, ya \`True\`.
- Ek aggregate-backed computed column ke liye (\`book_count\` = \`Count("books")\`), **\`get_queryset\`** override karke ise ek baar \`annotate\` karo, phir display method mein annotation padho. Method mein kabhi \`obj.books.count()\` mat call karo.

### Change form

- **\`fields\` / \`fieldsets\`** — kaunse fields dikhte hain aur kaise grouped. Ek field omit karna ise chhupata hai (aur, ek serializer ke \`fields\` ki tarah, admin ke zariye mass-assignment ke khilaf aapki allowlist hai).
- **\`readonly_fields\`** — dikhta hai par editable nahi.
- **\`autocomplete_fields = ["customer"]\`** — default \`<select>\` ko ek ajax search box se replace karta hai. **Target** model ke \`ModelAdmin\` ko \`search_fields\` define karna chahiye.
- **\`formfield_overrides\`** — ek field *type* ke liye widget swap karo.
- **\`prepopulated_fields\`** — JS jo ek slug ko ek doosre field se bharta hai.

### \`save_model\`

\`save_model(request, obj, form, change)\` object save hone se theek pehle chalta hai — \`created_by = request.user\` stamp karo. **Hamesha \`super().save_model(...)\` call karo.** \`change\` add par \`False\`, edit par \`True\`.

## Admin ko abhi bhi ORM discipline chahiye

Module 3 ka har niyam admin ke andar lागू hota hai. Ek dheema changelist lगbhag hamesha ek missing \`list_select_related\` ya ek prati-row aggregate hai. Ek admin page load karte hue \`django-debug-toolbar\` on karo — admin khushi se 500 queries karega aur bas dheema hoga, ye aapko warn nahi karega.`,

    examples: [
      {
        title: 'list_select_related turns the changelist N+1 into one JOINed query',
        titleHi: 'list_select_related changelist N+1 ko ek JOINed query mein badalta hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.admin", "django.contrib.auth",
                    "django.contrib.contenttypes", "django.contrib.sessions",
                    "django.contrib.messages", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    MIDDLEWARE=["django.contrib.sessions.middleware.SessionMiddleware",
                "django.contrib.auth.middleware.AuthenticationMiddleware",
                "django.contrib.messages.middleware.MessageMiddleware"],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "APP_DIRS": True,
                "OPTIONS": {"context_processors": [
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                    "django.template.context_processors.request"]}}],
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField")
django.setup()

from django.db import models, connection
from django.contrib import admin
from django.contrib.auth.models import User
from django.test import RequestFactory
from django.test.utils import CaptureQueriesContext

class Author(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name
    class Meta:
        app_label = "__main__"

class Book(models.Model):
    title = models.CharField(max_length=50)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    class Meta:
        app_label = "__main__"

from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)
with connection.schema_editor() as se:
    se.create_model(Author)
    se.create_model(Book)

for i in range(10):
    a = Author.objects.create(name=f"Author {i}")
    Book.objects.create(title=f"Book {i}", author=a)

site = admin.AdminSite()

# both admins show the author via a display METHOD (the changelist auto-JOINs a plain FK
# column, but NOT a FK touched inside a method -- that needs list_select_related)
class NaiveBookAdmin(admin.ModelAdmin):
    list_display = ["title", "author_name"]
    def author_name(self, obj):
        return obj.author.name

class FastBookAdmin(admin.ModelAdmin):
    list_display = ["title", "author_name"]
    list_select_related = ["author"]
    def author_name(self, obj):
        return obj.author.name

req = RequestFactory().get("/")
req.user = User.objects.create_superuser("root", "r@x.com", "pw")

def render_changelist(admin_cls):
    ma = admin_cls(Book, site)
    cl = ma.get_changelist_instance(req)
    with CaptureQueriesContext(connection) as ctx:
        rows = list(cl.get_queryset(req))
        _ = [(b.title, ma.author_name(b)) for b in rows]     # what the changelist does per row
    return len(ctx.captured_queries)

print("NaiveBookAdmin  (no list_select_related):", render_changelist(NaiveBookAdmin), "queries")
print("FastBookAdmin   (list_select_related):   ", render_changelist(FastBookAdmin), "queries")`,
        output: `NaiveBookAdmin  (no list_select_related): 11 queries
FastBookAdmin   (list_select_related):    1 queries`,
        explain: 'The changelist auto-JOINs a foreign key that appears directly as a column in list_display, so a plain FK column is fine without any config. But author_name is a display METHOD that reaches through obj.author.name, and the changelist does not detect that -- so NaiveBookAdmin fetches each author with a separate query, 10 authors plus the base query is 11. FastBookAdmin declares list_select_related = ["author"], which adds the JOIN to the one changelist query, so the same page is 1 query. Any FK you touch inside a method (or a nested FK like author__publisher) needs an explicit list_select_related.',
        explainHi: 'Changelist ek foreign key ko auto-JOIN karta hai jo seedhe list_display mein ek column ke roop mein aata hai, toh ek plain FK column bina config ke theek hai. Par author_name ek display METHOD hai jo obj.author.name se pahunchta hai, aur changelist ise detect nahi karta -- toh NaiveBookAdmin har author ko ek alag query se fetch karta hai, 10 authors plus base query 11 hai. FastBookAdmin list_select_related = ["author"] declare karta hai, jo ek changelist query mein JOIN add karta hai, toh wahi page 1 query hai. Ek method ke andar chhue kisi bhi FK (ya author__publisher jaise nested FK) ko ek explicit list_select_related chahiye.',
      },
      {
        title: '@admin.display: a computed, sortable, boolean column backed by an annotation',
        titleHi: '@admin.display: ek annotation-backed computed, sortable, boolean column',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.admin", "django.contrib.auth",
                    "django.contrib.contenttypes", "django.contrib.sessions",
                    "django.contrib.messages", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    MIDDLEWARE=["django.contrib.sessions.middleware.SessionMiddleware",
                "django.contrib.auth.middleware.AuthenticationMiddleware",
                "django.contrib.messages.middleware.MessageMiddleware"],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "APP_DIRS": True,
                "OPTIONS": {"context_processors": [
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                    "django.template.context_processors.request"]}}],
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField")
django.setup()

from django.db import models, connection
from django.db.models import Count
from django.contrib import admin
from django.contrib.auth.models import User
from django.test import RequestFactory
from django.test.utils import CaptureQueriesContext

class Author(models.Model):
    name = models.CharField(max_length=50)
    class Meta:
        app_label = "__main__"

class Book(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    class Meta:
        app_label = "__main__"

from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)
with connection.schema_editor() as se:
    se.create_model(Author)
    se.create_model(Book)

for name, n in [("Ada", 12), ("Bo", 3), ("Cy", 0)]:
    a = Author.objects.create(name=name)
    Book.objects.bulk_create([Book(author=a) for _ in range(n)])

site = admin.AdminSite()

class AuthorAdmin(admin.ModelAdmin):
    list_display = ["name", "book_count", "prolific"]

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_n=Count("books"))

    @admin.display(description="# books", ordering="_n")
    def book_count(self, obj):
        return obj._n

    @admin.display(boolean=True, description="prolific (>=10)?")
    def prolific(self, obj):
        return obj._n >= 10

ma = AuthorAdmin(Author, site)
req = RequestFactory().get("/")
req.user = User.objects.create_superuser("root", "r@x.com", "pw")

with CaptureQueriesContext(connection) as ctx:
    rows = list(ma.get_queryset(req).order_by("name"))
    table = [(ma.book_count(a), ma.prolific(a), a.name) for a in rows]
print("rows:", table)
print("queries for the whole list (annotation, not per-row count):", len(ctx.captured_queries))
print("book_count column header:", AuthorAdmin.book_count.short_description)
print("book_count sortable by:", AuthorAdmin.book_count.admin_order_field)
print("prolific renders as a tick:", AuthorAdmin.prolific.boolean)`,
        output: `rows: [(12, True, 'Ada'), (3, False, 'Bo'), (0, False, 'Cy')]
queries for the whole list (annotation, not per-row count): 1
book_count column header: # books
book_count sortable by: _n
prolific renders as a tick: True`,
        explain: 'get_queryset annotates _n = Count("books") once, so the whole author list plus its book counts is a single GROUP BY query -- not one COUNT per row. book_count just returns obj._n. The @admin.display decorator attaches metadata to the method: description becomes the column header ("# books"), ordering="_n" makes the column click-to-sortable by that annotation (a bare method column is not sortable), and boolean=True on prolific tells the admin to render a green/red tick instead of the raw True/False. You read those back off the function object as short_description, admin_order_field, and boolean.',
        explainHi: 'get_queryset ek baar _n = Count("books") annotate karta hai, toh poori author list plus iske book counts ek single GROUP BY query hai -- prati row ek COUNT nahi. book_count bas obj._n return karta hai. @admin.display decorator method par metadata attach karta hai: description column header ban jaata hai, ordering="_n" column ko us annotation se click-to-sortable banata hai, aur prolific par boolean=True admin ko raw True/False ke bajaye ek green/red tick render karne ko kehta hai. Aap unhe function object se short_description, admin_order_field, aur boolean ke roop mein wapas padhte ho.',
      },
      {
        title: 'save_model stamps a server-controlled field; readonly_fields keeps it off the form',
        titleHi: 'save_model ek server-controlled field stamp karta hai; readonly_fields ise form se rokta hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.admin", "django.contrib.auth",
                    "django.contrib.contenttypes", "django.contrib.sessions",
                    "django.contrib.messages", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    MIDDLEWARE=["django.contrib.sessions.middleware.SessionMiddleware",
                "django.contrib.auth.middleware.AuthenticationMiddleware",
                "django.contrib.messages.middleware.MessageMiddleware"],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "APP_DIRS": True,
                "OPTIONS": {"context_processors": [
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                    "django.template.context_processors.request"]}}],
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField")
django.setup()

from django.db import models, connection
from django.contrib import admin
from django.contrib.auth.models import User
from django.test import RequestFactory

class Note(models.Model):
    text = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    class Meta:
        app_label = "__main__"

from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)
with connection.schema_editor() as se:
    se.create_model(Note)

site = admin.AdminSite()

class NoteAdmin(admin.ModelAdmin):
    fields = ["text"]                          # created_by is NOT on the form
    readonly_fields = ["created_by"]

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user       # server stamps it
        super().save_model(request, obj, form, change)

ma = NoteAdmin(Note, site)
author = User.objects.create_user("ada", password="pw", is_staff=True)
req = RequestFactory().post("/"); req.user = author

# what fields does the add form expose?
AddForm = ma.get_form(req)
print("add-form fields:", list(AddForm.base_fields))

# simulate the admin saving a new Note (form only carried 'text')
n = Note(text="hello from the form")
ma.save_model(req, n, form=None, change=False)
print("saved note created_by:", Note.objects.get(pk=n.pk).created_by.username)

# a malicious form POST trying to set created_by is ignored -- the field isn't on the form
print("created_by is on the form:", "created_by" in AddForm.base_fields)`,
        output: `add-form fields: ['text']
saved note created_by: ada
created_by is on the form: False`,
        explain: 'fields = ["text"] means the generated add form has exactly one field -- created_by is not on it, so a crafted POST cannot set it. readonly_fields = ["created_by"] shows it on the change form as read-only text. save_model runs just before the object is saved and receives the request, so it stamps obj.created_by = request.user, guarded by not change so it only happens on creation, then calls super().save_model. The result: the server owns created_by entirely, and the user has no way to influence it through the admin.',
        explainHi: 'fields = ["text"] ka matlab generated add form mein theek ek field hai -- created_by uspar nahi hai, toh ek crafted POST ise set nahi kar sakta. readonly_fields = ["created_by"] ise change form par read-only text ke roop mein dikhata hai. save_model object save hone se theek pehle chalta hai aur request receive karta hai, toh ye obj.created_by = request.user stamp karta hai, not change se guarded, phir super().save_model call karta hai. Parinam: server created_by ko poori tarah own karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `class BookAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "publisher", "category"]
    # no list_select_related
# opening /admin/app/book/ with 100 rows -> ~300 extra queries (author + publisher + category each)`,
        right: `class BookAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "publisher", "category"]
    list_select_related = ["author", "publisher", "category"]
    # one query with three JOINs`,
        why: 'Every FK you put in `list_display` is dereferenced once per row when the template renders `str(obj.fk)`. Without `list_select_related`, that FK was not loaded, so each access is a fresh query — three FKs on a 100-row page is 300 extra queries and a changelist that takes seconds. `list_select_related` adds the JOINs so all the FK data comes back with the row. It takes a list of FK field names (or `True` to follow every non-null FK, which is usually too broad).',
        whyHi: 'Har FK jo aap `list_display` mein daalte ho prati row ek baar dereference hota hai jab template `str(obj.fk)` render karta hai. `list_select_related` ke bina, wo FK load nahi hua, toh har access ek fresh query hai — ek 100-row page par teen FKs 300 extra queries hai. `list_select_related` JOINs add karta hai. Ye FK field names ki ek list leta hai.',
      },
      {
        wrong: `class AuthorAdmin(admin.ModelAdmin):
    list_display = ["name", "book_count"]

    def book_count(self, obj):
        return obj.books.count()          # a COUNT query for EVERY row on the page`,
        right: `class AuthorAdmin(admin.ModelAdmin):
    list_display = ["name", "book_count"]

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_book_count=Count("books"))

    @admin.display(description="# books", ordering="_book_count")
    def book_count(self, obj):
        return obj._book_count`,
        why: 'A `list_display` method that calls `obj.related.count()` (or `.filter()`, or `.aggregate()`) runs that query once per row — the changelist N+1 in a different costume. `list_select_related` cannot help because it is an aggregate, not a FK. The fix is to compute it in the queryset with `annotate(Count(...))` (one GROUP BY for the whole page) and have the method just read the annotated attribute. `@admin.display(ordering="_book_count")` also makes the column click-to-sort, which a bare method column is not.',
        whyHi: 'Ek `list_display` method jo `obj.related.count()` call karta hai wo query prati row ek baar chalata hai — ek alag costume mein changelist N+1. `list_select_related` madad nahi kar sakta kyunki ye ek aggregate hai, ek FK nahi. Fix ise queryset mein `annotate(Count(...))` se compute karna hai (poore page ke liye ek GROUP BY) aur method ko bas annotated attribute padhna. `@admin.display(ordering="_book_count")` column ko click-to-sort bhi banata hai.',
      },
      {
        wrong: `class OrderAdmin(admin.ModelAdmin):
    # no 'fields' / 'fieldsets' -> the form shows EVERY editable field
    def save_model(self, request, obj, form, change):
        obj.processed_by = request.user
        obj.save()                        # forgot super() -> skips log entry + hooks`,
        right: `class OrderAdmin(admin.ModelAdmin):
    fields = ["customer", "status", "notes"]        # allowlist -- internal_flags etc. stay off the form
    readonly_fields = ["total", "created"]

    def save_model(self, request, obj, form, change):
        if not change:
            obj.processed_by = request.user
        super().save_model(request, obj, form, change)   # writes the LogEntry, runs hooks`,
        why: 'Two problems. Without `fields`/`fieldsets` the admin form exposes every editable field on the model, including ones a staff user should not touch (an `is_internal` flag, a `commission_rate`) — the admin equivalent of a serializer with `fields = "__all__"`. List the fields you actually want editable. And `save_model` overriding with a bare `obj.save()` instead of `super().save_model(...)` skips Django\'s bookkeeping: the admin `LogEntry` (object history) is not written, and any `ModelAdmin` save hooks do not run. Always call `super()`.',
        whyHi: 'Do problems. `fields`/`fieldsets` ke bina admin form model ke har editable field ko expose karta hai, un rows sahit jinhe ek staff user ko nahi chhoona chahiye — `fields = "__all__"` waale serializer ka admin equivalent. Jo fields aap sach mein editable chahte ho unhe list karo. Aur `save_model` ko `super().save_model(...)` ke badle ek bare `obj.save()` se override karna Django ki bookkeeping skip karta hai: admin `LogEntry` (object history) nahi likha jaata. Hamesha `super()` call karo.',
      },
    ],

    realWorld: [
      {
        en: '**A `BaseModelAdmin` the whole project inherits** — sets `list_select_related` from the model\'s FKs by default, `show_full_result_count = False`, `list_per_page = 50`, `save_on_top = True`, a `save_model` that stamps `updated_by`, and `readonly_fields` including `created`/`updated`. Individual admins only add what is model-specific.',
        hi: '**Ek `BaseModelAdmin` jise poora project inherit karta hai** — default se model ke FKs se `list_select_related` set karta hai, `show_full_result_count = False`, `list_per_page = 50`, ek `save_model` jo `updated_by` stamp karta hai. Individual admins sirf jo model-specific hai wo add karte hain.',
      },
      {
        en: '**Autocomplete everywhere a FK points at a big table** — `autocomplete_fields = ["customer", "product"]` on every order/line-item admin, with `search_fields` on the `Customer` and `Product` admins, so the change form loads instantly instead of rendering a `<select>` with 200k `<option>`s.',
        hi: '**Har jagah autocomplete jahaan ek FK ek badi table par point karta hai** — har order/line-item admin par `autocomplete_fields = ["customer", "product"]`, `Customer` aur `Product` admins par `search_fields` ke saath, taaki change form 200k `<option>`s waala ek `<select>` render karne ke badle turant load ho.',
      },
      {
        en: '**A read-mostly ops admin for a support team** — `has_add_permission`/`has_delete_permission` return `False`, most fields in `readonly_fields`, a handful of safe actions (resend receipt, retry webhook), and `list_filter` + `search_fields` tuned for how support actually looks things up (by email, order id, phone).',
        hi: '**Ek support team ke liye ek read-mostly ops admin** — `has_add_permission`/`has_delete_permission` `False` return karte hain, zyादातर fields `readonly_fields` mein, kuch safe actions (receipt resend, webhook retry), aur `list_filter` + `search_fields` is hisaab se tuned ki support asal mein kaise cheezein dhoondta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is the Django admin changelist often slow, and how do you fix it?',
        qHi: 'Django admin changelist aksar dheema kyun hai, aur aap ise kaise fix karte ho?',
        a: 'Almost always it is an N-plus-one query problem, and the admin does not warn you about it — it just does hundreds of queries and feels sluggish. The list view renders one row per object and, for each column in list_display that is a foreign key, the template evaluates str of that related object. If the related object was not fetched with the row, each of those evaluations is a separate SELECT. A page of 100 books with author, publisher, and category in list_display is 300 extra queries. The fix is list_select_related, which takes a list of foreign-key field names and adds the JOINs so all that data comes back in the one changelist query. The second common cause is a computed column — a method in list_display that calls obj dot related dot count or dot aggregate. list_select_related cannot help there because it is an aggregate, not a foreign key. You fix it by overriding get_queryset on the ModelAdmin and annotating the value once with Count or Sum, which is a single GROUP BY for the whole page, then the display method just returns the annotated attribute. Decorating that method with admin dot display and passing ordering equal to the annotation name also makes the column sortable. The third thing worth doing on very large tables is setting show_full_result_count to False, which skips the unfiltered COUNT star that the admin runs to show the total. The general point is that every ORM rule from the queries module applies inside the admin; it is just easy to forget because the admin is generated code.',
        aHi: 'Lगbhag hamesha ye ek N-plus-one query problem hai, aur admin aapko iske baare mein warn nahi karta — ye bas sainkdon queries karta hai aur sust feel hota hai. List view prati object ek row render karta hai aur, list_display mein har column ke liye jo ek foreign key hai, template us related object ka str evaluate karta hai. Agar related object row ke saath fetch nahi hua, un evaluations me se har ek ek alag SELECT hai. author, publisher, aur category waale 100 books ka ek page 300 extra queries hai. Fix list_select_related hai, jo foreign-key field names ki ek list leta hai aur JOINs add karta hai. Doosra aam kaaran ek computed column hai — list_display mein ek method jo obj dot related dot count call karta hai. Aap ise get_queryset override karke aur value ko ek baar Count se annotate karke fix karte ho. Teesri cheez jo bahut badi tables par karne layak hai wo show_full_result_count ko False set karna hai.',
      },
      {
        q: 'How do you keep a staff user from editing fields they should not, and stamp server-controlled fields, through the admin?',
        qHi: 'Aap ek staff user ko un fields ko edit karne se kaise rokte ho jo unhe nahi karne chahiye, aur admin ke zariye server-controlled fields kaise stamp karte ho?',
        a: 'Two mechanisms. First, control which fields the form even shows, with fields or fieldsets on the ModelAdmin. If you do not set either, the admin form exposes every editable field on the model — which is the admin version of a serializer declared with fields equals all, and means a staff user can change an internal flag or a commission rate just by editing a record. Listing the fields you actually want editable is an allowlist. Fields you want visible but not changeable go in readonly_fields — they render on the form as text. You can also make fields and readonly_fields vary by request or object: get_fields, get_readonly_fields, and get_form can return different sets for a superuser versus a regular staff user, or lock everything to readonly once an order has shipped. Second, for fields the server owns — created_by, processed_by, a computed total — you do not put them on the form at all, and you set them in save_model, which runs just before the object is saved and receives the request. You stamp obj dot created_by equals request dot user, guarded by the change flag so you only do it on creation, and then you must call super dot save_model, because that is what writes the admin LogEntry for the object history and runs the save hooks. Skipping super and calling obj dot save directly silently loses the audit trail.',
        aHi: 'Do mechanisms. Pehla, control karo ki form kaunse fields dikhata bhi hai, ModelAdmin par fields ya fieldsets se. Agar aap koi bhi set nahi karte, admin form model ke har editable field ko expose karta hai — jo fields equals all se declare kiye ek serializer ka admin version hai. Jo fields aap sach mein editable chahte ho unhe list karna ek allowlist hai. Jo fields aap visible par badalne yogya nahi chahte wo readonly_fields mein jaate hain. Aap fields aur readonly_fields ko request ya object se vary bhi kara sakte ho: get_fields, get_readonly_fields, aur get_form ek superuser bनाم ek regular staff user ke liye alag sets return kar sakte hain. Doosra, jo fields server owns karta hai — created_by, ek computed total — unhe form par bilkul mat daalo, aur unhe save_model mein set karo, jo object save hone se theek pehle chalta hai aur request receive karta hai. Aap obj dot created_by equals request dot user stamp karte ho, change flag se guarded, aur phir aapko super dot save_model call karna hi hai, kyunki wahi object history ke liye admin LogEntry likhta hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django with the full admin stack (admin/auth/contenttypes/sessions/messages + the 3 middlewares + a TEMPLATES entry with APP_DIRS + the auth/messages/request context processors). Models `Author(name)` and `Book(title, author FK)`. Seed 10 authors each with 1 book. Two `ModelAdmin`s for `Book`: one with `list_display = ["title", "author"]` only, one that also sets `list_select_related = ["author"]`. For each, `ma = cls(Book, site)`, `cl = ma.get_changelist_instance(req)` (req needs `.user` = a superuser), and inside `CaptureQueriesContext` iterate `cl.get_queryset(req)` and touch `str(b.author)` per row. Assert the naive one runs 11 queries and the fast one runs 1.',
        taskHi: 'Standalone Django poore admin stack ke saath. `Author(name)` aur `Book(title, author FK)` models. 10 authors seed karo har ek 1 book ke saath. `Book` ke do `ModelAdmin`: ek sirf `list_display` waala, ek jo `list_select_related = ["author"]` bhi set kare. Har ke liye `CaptureQueriesContext` mein `cl.get_queryset(req)` iterate karke prati row `str(b.author)` touch karo. Assert naive 11 queries, fast 1.',
        hint: '`from django.contrib import admin`; `site = admin.AdminSite()`. The request must have `.user` set to a `User.objects.create_superuser(...)`. `ma.get_changelist_instance(req)` builds the `ChangeList`; `cl.get_queryset(req)` is where `list_select_related` is applied.',
        hintHi: '`site = admin.AdminSite()`. Request ke paas `.user` ek superuser set hona chahiye. `ma.get_changelist_instance(req)` `ChangeList` banata hai; `cl.get_queryset(req)` wahaan hai jahaan `list_select_related` apply hota hai.',
      },
      {
        task: 'Full admin stack. `Author(name)` + `Book(author FK, related_name="books")`. Seed authors with 12, 3, and 0 books. An `AuthorAdmin` whose `get_queryset` annotates `_n=Count("books")`, with `@admin.display(description="# books", ordering="_n") def book_count(self, obj): return obj._n` and `@admin.display(boolean=True) def prolific(self, obj): return obj._n >= 10`. Inside `CaptureQueriesContext`, list `ma.get_queryset(req)` and build `[(ma.book_count(a), ma.prolific(a)) for a in rows]`. Assert exactly 1 query, the counts are `[12, 3, 0]`, `book_count.admin_order_field == "_n"`, and `prolific.boolean is True`.',
        taskHi: 'Poora admin stack. `Author(name)` + `Book(author FK, related_name="books")`. 12, 3, 0 books waale authors seed karo. `AuthorAdmin` jiska `get_queryset` `_n=Count("books")` annotate kare, `@admin.display(..., ordering="_n")` `book_count` aur `@admin.display(boolean=True)` `prolific` ke saath. `CaptureQueriesContext` mein list build karo. Assert theek 1 query, counts `[12, 3, 0]`, `admin_order_field == "_n"`, `boolean is True`.',
        hint: 'The `@admin.display` decorator attaches `short_description`, `admin_order_field`, and `boolean` to the function object — you can read them off `AuthorAdmin.book_count.admin_order_field` etc. The single query is the annotated `SELECT ... COUNT` with a `GROUP BY`.',
        hintHi: '`@admin.display` decorator function object par `short_description`, `admin_order_field`, `boolean` attach karta hai. Ek query annotated `SELECT ... COUNT` `GROUP BY` ke saath hai.',
      },
      {
        task: 'Full admin stack. Model `Note(text, created_by FK User null=True)`. A `NoteAdmin` with `fields = ["text"]`, `readonly_fields = ["created_by"]`, and a `save_model` that sets `obj.created_by = request.user` when `not change` then calls `super().save_model(...)`. Build `AddForm = ma.get_form(req)` and assert `list(AddForm.base_fields) == ["text"]` (so `created_by` is not POST-able). Then `n = Note(text="x"); ma.save_model(req, n, form=None, change=False)` and assert `Note.objects.get(pk=n.pk).created_by == req.user`.',
        taskHi: 'Poora admin stack. `Note(text, created_by FK User null=True)` model. `NoteAdmin` `fields = ["text"]`, `readonly_fields = ["created_by"]`, aur ek `save_model` jo `not change` par `obj.created_by = request.user` set kare phir `super().save_model(...)` call kare. `AddForm = ma.get_form(req)` build karke assert `list(AddForm.base_fields) == ["text"]`. Phir `ma.save_model(req, n, form=None, change=False)` aur assert `created_by == req.user`.',
        hint: 'The point: a field that is not in `fields` is not in the generated form, so a crafted POST cannot set it. `save_model` is where the server assigns it instead. `req.user` needs to be a saved `User` (staff or superuser).',
        hintHi: 'Point: ek field jo `fields` mein nahi hai generated form mein nahi hai, toh ek crafted POST ise set nahi kar sakta. `save_model` wahaan hai jahaan server ise assign karta hai. `req.user` ek saved `User` hona chahiye.',
      },
    ],

    keyTakeaways: [
      'The admin is a free, production-grade CRUD interface FOR INTERNAL USE (ops/support/data-entry). Never expose it to end users (lesson 3). Customise per model with a `ModelAdmin` + `@admin.register(Model)`.',
      'Changelist: `list_display` (columns — fields, methods, `@admin.display` callables), `list_filter` (sidebar), `search_fields` (`"rel__field"` spans FKs; `^` startswith, `=` exact), `date_hierarchy`, `list_editable`, `ordering`, `list_per_page`.',
      'THE CHANGELIST N+1: every FK in `list_display` is dereferenced per row when the template renders `str(obj.fk)`. Fix with `list_select_related = ["author", ...]` (adds JOINs). 100 rows x 3 FKs with no `list_select_related` = 300 extra queries.',
      'Computed column backed by an aggregate: override `get_queryset` -> `.annotate(_n=Count("books"))`, then the `@admin.display` method returns `obj._n`. NEVER `obj.books.count()` in the method — that IS the N+1.',
      '`@admin.display(description=, ordering=, boolean=)` — sets the column header, makes it click-to-sort (pass the annotation name), renders a ✓/✗ tick.',
      'Change form: `fields`/`fieldsets` are your ALLOWLIST (omitting = hidden = mass-assignment protection, like a serializer\'s `fields`). `readonly_fields` = visible not editable. `autocomplete_fields` = ajax search box instead of a huge `<select>` (target model needs `search_fields`).',
      '`save_model(request, obj, form, change)` — stamp server-controlled fields (`obj.created_by = request.user`, guarded by `not change`). ALWAYS call `super().save_model(...)` — it writes the `LogEntry` (object history) and runs hooks.',
      'Every Module 3 ORM rule applies inside the admin. A slow changelist is almost always a missing `list_select_related` or a per-row aggregate — the admin does 500 queries silently, it will not warn you. Profile admin pages with debug-toolbar.',
    ],
    keyTakeawaysHi: [
      'Admin ek muft, production-grade CRUD interface hai INTERNAL USE KE LIYE (ops/support/data-entry). Ise kabhi end users ke saamne mat laao (lesson 3). Prati model ek `ModelAdmin` + `@admin.register(Model)` se customise karo.',
      'Changelist: `list_display` (columns), `list_filter` (sidebar), `search_fields` (`"rel__field"` FKs span; `^` startswith, `=` exact), `date_hierarchy`, `list_editable`, `ordering`, `list_per_page`.',
      'CHANGELIST N+1: `list_display` mein har FK prati row dereference hota hai jab template `str(obj.fk)` render karta hai. `list_select_related = ["author", ...]` se fix karo. 100 rows x 3 FKs bina `list_select_related` = 300 extra queries.',
      'Ek aggregate-backed computed column: `get_queryset` override -> `.annotate(_n=Count("books"))`, phir `@admin.display` method `obj._n` return karta hai. Method mein KABHI `obj.books.count()` nahi — wo N+1 HAI.',
      '`@admin.display(description=, ordering=, boolean=)` — column header set karta hai, ise click-to-sort banata hai, ek ✓/✗ tick render karta hai.',
      'Change form: `fields`/`fieldsets` aapki ALLOWLIST hain (omit = hidden = mass-assignment protection). `readonly_fields` = visible editable nahi. `autocomplete_fields` = ek bade `<select>` ke badle ajax search box (target model ko `search_fields` chahiye).',
      '`save_model(request, obj, form, change)` — server-controlled fields stamp karo (`not change` se guarded). HAMESHA `super().save_model(...)` call karo — ye `LogEntry` (object history) likhta hai.',
      'Module 3 ka har ORM niyam admin ke andar lागू hota hai. Ek dheema changelist lगbhag hamesha ek missing `list_select_related` ya ek prati-row aggregate hai — admin chupchaap 500 queries karta hai.',
    ],
  },

  {
    slug: 'dj-admin-actions-inlines',
    title: 'Admin Actions & Inlines',
    titleHi: 'Admin Actions & Inlines',
    description: 'Two features that make the admin a real operations tool: **actions** let a staff user select rows and run one operation on all of them (mark shipped, resend email, export); **inlines** let related rows be edited on the parent\'s page (order line items right under the order).',
    descriptionHi: 'Do features jo admin ko ek asli operations tool banati hain: **actions** ek staff user ko rows select karke un sab par ek operation chalane dete hain (shipped mark, email resend, export); **inlines** related rows ko parent ke page par edit karne dete hain (order ke theek neeche order line items).',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 2,

    analogy: {
      en: '**A dispatch office.** Actions are the "do this to everything I\'ve ticked" stamp: the clerk selects forty parcels in the list, picks "mark as dispatched" from the dropdown, hits go, and all forty flip at once — one motion instead of opening forty records. Some stamps are instant ("mark dispatched"); others open a short form first ("assign to courier — which one?") before applying to the whole batch. Inlines are the packing slip stapled inside each parcel\'s folder: when you open order #5000 you do not go hunting for its line items in a separate drawer — they are right there on the same page, add/edit/remove rows inline, save once and the parent and its children commit together. Both features exist so a person doing operations work spends their time on decisions, not on navigation.',
      hi: '**Ek dispatch office.** Actions "jo maine tick kiya usko ye karo" stamp hai: clerk list mein chalis parcels select karta hai, dropdown se "mark as dispatched" chunta hai, go dabata hai, aur chalison ek saath flip ho jaate hain — chalis records kholne ke badle ek motion. Kuch stamps instant hain; doosre pehle ek chhota form kholte hain ("courier ko assign karo — kaunsa?") poore batch par apply karne se pehle. Inlines har parcel ke folder ke andar stapled packing slip hain: jab aap order #5000 kholte ho aap ek alag drawer mein iske line items dhoondhne nahi jaate — wo wahin usi page par hain, inline rows add/edit/remove karo, ek baar save karo aur parent aur iske children saath commit hote hain. Dono features isliye hain taaki operations kaam karne wala vyakti apna samay navigation par nahi, decisions par kharch kare.',
    },

    simple: `**A custom action**

\`\`\`python
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    actions = ["mark_shipped", "resend_confirmation"]

    @admin.action(description="Mark selected orders as shipped")
    def mark_shipped(self, request, queryset):
        updated = queryset.filter(status="paid").update(status="shipped", shipped_at=now())
        self.message_user(request, f"{updated} orders marked shipped.", messages.SUCCESS)

    @admin.action(description="Resend confirmation email")
    def resend_confirmation(self, request, queryset):
        for order in queryset.select_related("customer"):
            send_confirmation.delay(order.id)          # enqueue, don't send inline
        self.message_user(request, f"Queued {queryset.count()} emails.")
\`\`\`

\`\`\`
signature      def action(self, request, queryset)   -- queryset = the ticked rows
feedback       self.message_user(request, msg, level)  -- messages.SUCCESS / WARNING / ERROR
description    @admin.action(description="...")  -> the dropdown label
return None    stay on the changelist (the default)
return HttpResponse  e.g. a CSV download, or a redirect to an intermediate confirm page
permissions   @admin.action(permissions=["change"])  -> only users with change perm see it
the default "Delete selected" action is always there (remove with actions = None, or unregister it)
\`\`\`

**An action with an intermediate page**

\`\`\`python
@admin.action(description="Merge selected customers")
def merge_customers(self, request, queryset):
    if "apply" in request.POST:
        target = queryset.get(pk=request.POST["target"])
        # ... do the merge ...
        self.message_user(request, "Merged.")
        return None                                    # back to the changelist
    return render(request, "admin/merge_confirm.html",
                  {"queryset": queryset, "action": "merge_customers"})
\`\`\`

**Inlines — edit children on the parent's page**

\`\`\`python
class OrderLineInline(admin.TabularInline):     # or StackedInline (one block per row)
    model = OrderLine
    extra = 1                                    # blank rows to add
    fields = ["product", "qty", "unit_price"]
    readonly_fields = ["line_total"]
    autocomplete_fields = ["product"]

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderLineInline]
\`\`\`

\`\`\`
TabularInline   compact -- one row per child (spreadsheet-like)
StackedInline   verbose -- a full mini-form per child
extra           number of empty forms shown
max_num / min_num   cap / floor the number of children
show_change_link    a link from the inline row to that child's own change page
inline get_queryset / has_add_permission / has_change_permission  -- same hooks as ModelAdmin
the parent + all inline children save in ONE transaction on submit
\`\`\``,

    simpleHi: `**Ek custom action**

\`\`\`python
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    actions = ["mark_shipped", "resend_confirmation"]

    @admin.action(description="Mark selected orders as shipped")
    def mark_shipped(self, request, queryset):
        updated = queryset.filter(status="paid").update(status="shipped", shipped_at=now())
        self.message_user(request, f"{updated} orders marked shipped.", messages.SUCCESS)

    @admin.action(description="Resend confirmation email")
    def resend_confirmation(self, request, queryset):
        for order in queryset.select_related("customer"):
            send_confirmation.delay(order.id)          # enqueue karo, inline mat bhejo
        self.message_user(request, f"Queued {queryset.count()} emails.")
\`\`\`

\`\`\`
signature      def action(self, request, queryset)   -- queryset = ticked rows
feedback       self.message_user(request, msg, level)  -- messages.SUCCESS / WARNING / ERROR
description    @admin.action(description="...")  -> dropdown label
return None    changelist par raho (default)
return HttpResponse  jaise ek CSV download, ya ek intermediate confirm page par redirect
permissions   @admin.action(permissions=["change"])  -> sirf change perm waale users ise dekhte hain
default "Delete selected" action hamesha wahaan hai (actions = None se hatao)
\`\`\`

**Ek intermediate page waali action**

\`\`\`python
@admin.action(description="Merge selected customers")
def merge_customers(self, request, queryset):
    if "apply" in request.POST:
        target = queryset.get(pk=request.POST["target"])
        # ... merge karo ...
        self.message_user(request, "Merged.")
        return None                                    # changelist par wapas
    return render(request, "admin/merge_confirm.html",
                  {"queryset": queryset, "action": "merge_customers"})
\`\`\`

**Inlines — parent ke page par children edit karo**

\`\`\`python
class OrderLineInline(admin.TabularInline):     # ya StackedInline (prati row ek block)
    model = OrderLine
    extra = 1                                    # add karne ko blank rows
    fields = ["product", "qty", "unit_price"]
    readonly_fields = ["line_total"]
    autocomplete_fields = ["product"]

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderLineInline]
\`\`\`

\`\`\`
TabularInline   compact -- prati child ek row (spreadsheet-jaisa)
StackedInline   verbose -- prati child ek poora mini-form
extra           dikhaye gaye empty forms ki sankhya
max_num / min_num   children ki sankhya cap / floor karo
show_change_link    inline row se us child ke apne change page ka ek link
inline get_queryset / has_add_permission / has_change_permission  -- ModelAdmin jaise hi hooks
submit par parent + saare inline children EK transaction mein save hote hain
\`\`\``,

    content: `## Actions

An admin action is a function that receives the request and a queryset of the selected rows. It appears in the "Action" dropdown above the changelist; the user ticks rows, picks the action, and clicks Go.

\`\`\`python
@admin.action(description="Mark selected as reviewed", permissions=["change"])
def mark_reviewed(self, request, queryset):
    n = queryset.update(reviewed=True, reviewed_by=request.user)
    self.message_user(request, f"{n} marked reviewed.", messages.SUCCESS)

class SubmissionAdmin(admin.ModelAdmin):
    actions = [mark_reviewed]     # or ["mark_reviewed"] for a method on the class
\`\`\`

- **Signature:** \`(self, request, queryset)\` for a \`ModelAdmin\` method, or \`(modeladmin, request, queryset)\` for a standalone function.
- **\`@admin.action(description=, permissions=)\`** — the dropdown label, and which permission(s) the user needs to see the action (\`"add"\`, \`"change"\`, \`"delete"\`, \`"view"\`, or a custom \`has_<name>_permission\` on the admin).
- **Feedback:** \`self.message_user(request, message, level)\` with \`messages.SUCCESS\` / \`WARNING\` / \`ERROR\`. This is the only signal the user gets.
- **Return value:** \`None\` (or nothing) returns to the changelist. An \`HttpResponse\` is returned as-is — use it for a **CSV/file download** (build a \`StreamingHttpResponse\`, Module 8) or a **redirect to a confirmation page**.
- **The default \`Delete selected\`** action is always present. Remove it globally with \`admin.site.disable_action("delete_selected")\`, or per-admin with \`actions = [...]\` excluding it, or \`get_actions\` returning a filtered dict.

### Intermediate pages

A destructive or parameterised action (merge, bulk reassign, "are you sure?") renders its own template first, carrying the selected ids in hidden fields, and only performs the operation when the confirm form posts back. The pattern: check \`if "apply" in request.POST\` — if set, do the work and return \`None\`; otherwise \`render\` the confirm template with the queryset and \`action\` name so the form can re-submit to the same action.

### Actions do bulk operations — mind the ORM

\`queryset.update(...)\` in an action is one SQL statement — but it **skips \`save()\`, signals, and \`auto_now\`** (Module 3). If the action needs per-object logic (send an email, recompute a field), loop — but **enqueue** the slow part (\`task.delay(obj.id)\`, Module 8), do not do it inline for 500 rows inside a request.

## Inlines

An inline edits a model that has a FK to the model being edited, on the same page.

\`\`\`python
class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    fields = ["author", "body", "created"]
    readonly_fields = ["created"]
    ordering = ["-created"]

class PostAdmin(admin.ModelAdmin):
    inlines = [CommentInline]
\`\`\`

- **\`TabularInline\`** — one compact row per child, like a spreadsheet. **\`StackedInline\`** — a full form block per child; use it when children have many fields.
- **\`extra\`** — how many empty add-forms to show (set to \`0\` for existing-heavy data so the page is not cluttered).
- **\`max_num\` / \`min_num\`** — enforce a cap or floor on the number of children.
- **\`fk_name\`** — required if the child model has *two* FKs to the parent.
- **\`show_change_link = True\`** — adds a link from the inline row to that child's own full change page.
- **Permissions and queryset:** an inline has its own \`get_queryset\`, \`has_add_permission\`, \`has_change_permission\`, \`has_delete_permission\` — scope or lock it independently of the parent admin.
- **One transaction:** submitting the parent form saves the parent and every inline child atomically. A validation error on any inline row blocks the whole save.

### The inline N+1

An inline with 50 children, each showing a FK column, has the same N+1 as the changelist. Override the inline's \`get_queryset\` to \`select_related\` those FKs. \`get_formset\` is the deeper hook if you need to customise the formset class itself.

## Both are the "operations layer"

Actions and inlines are what turn the admin from a table browser into a tool support and ops staff can actually work in: fix a batch of records, enter an order with its lines in one screen, run a safe maintenance operation without a shell. Keep the actions few, named clearly, and permission-gated; keep inlines to the children people genuinely edit alongside the parent.`,

    contentHi: `## Actions

Ek admin action ek function hai jo request aur selected rows ka ek queryset receive karta hai. Ye changelist ke upar "Action" dropdown mein dikhta hai; user rows tick karta hai, action chunta hai, Go click karta hai.

- **Signature:** ek \`ModelAdmin\` method ke liye \`(self, request, queryset)\`, ya ek standalone function ke liye \`(modeladmin, request, queryset)\`.
- **\`@admin.action(description=, permissions=)\`** — dropdown label, aur user ko action dekhne ke liye kaunsi permission(s) chahiye.
- **Feedback:** \`self.message_user(request, message, level)\` \`messages.SUCCESS\` / \`WARNING\` / \`ERROR\` ke saath.
- **Return value:** \`None\` changelist par wapas. Ek \`HttpResponse\` as-is return hota hai — ise ek **CSV/file download** ya ek **confirmation page par redirect** ke liye istemal karo.
- **Default \`Delete selected\`** action hamesha maujood hai. Ise \`admin.site.disable_action("delete_selected")\` se globally hatao.

### Intermediate pages

Ek destructive ya parameterised action pehle apna template render karta hai, selected ids hidden fields mein carry karke, aur operation tabhi karta hai jab confirm form wapas post karta hai. Pattern: \`if "apply" in request.POST\` check karo.

### Actions bulk operations karte hain — ORM ka dhyaan rakho

Ek action mein \`queryset.update(...)\` ek SQL statement hai — par ye **\`save()\`, signals, aur \`auto_now\` skip karta hai** (Module 3). Agar action ko per-object logic chahiye, loop karo — par slow part ko **enqueue** karo (\`task.delay(obj.id)\`, Module 8).

## Inlines

Ek inline ek aise model ko edit karta hai jiska edit ho rahe model ke liye ek FK hai, usi page par.

- **\`TabularInline\`** — prati child ek compact row. **\`StackedInline\`** — prati child ek poora form block.
- **\`extra\`** — kitne empty add-forms dikhaye.
- **\`max_num\` / \`min_num\`** — children ki sankhya par ek cap ya floor enforce karo.
- **\`fk_name\`** — zaroori agar child model ke parent ke liye *do* FKs hain.
- **\`show_change_link = True\`** — inline row se us child ke apne full change page ka ek link.
- **Permissions aur queryset:** ek inline ka apna \`get_queryset\`, \`has_add_permission\` etc. hai.
- **Ek transaction:** parent form submit karna parent aur har inline child ko atomically save karta hai.

### Inline N+1

50 children waala ek inline, har ek ek FK column dikhata hua, changelist jaisa hi N+1 hai. Inline ke \`get_queryset\` ko un FKs ko \`select_related\` karne ko override karo.

## Dono "operations layer" hain

Actions aur inlines wo hain jo admin ko ek table browser se ek tool mein badalte hain jismein support aur ops staff asal mein kaam kar sakte hain. Actions kam, spasht roop se named, aur permission-gated rakho.`,

    examples: [
      {
        title: 'A custom action: queryset = the ticked rows, message_user for feedback',
        titleHi: 'Ek custom action: queryset = ticked rows, feedback ke liye message_user',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.admin", "django.contrib.auth",
                    "django.contrib.contenttypes", "django.contrib.sessions",
                    "django.contrib.messages", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    MIDDLEWARE=["django.contrib.sessions.middleware.SessionMiddleware",
                "django.contrib.auth.middleware.AuthenticationMiddleware",
                "django.contrib.messages.middleware.MessageMiddleware"],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "APP_DIRS": True,
                "OPTIONS": {"context_processors": [
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                    "django.template.context_processors.request"]}}],
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField")
django.setup()

from django.db import models, connection
from django.contrib import admin, messages
from django.contrib.auth.models import User
from django.contrib.messages.storage.fallback import FallbackStorage
from django.test import RequestFactory

class Order(models.Model):
    ref = models.CharField(max_length=10)
    status = models.CharField(max_length=10, default="paid")
    class Meta:
        app_label = "__main__"

from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)
with connection.schema_editor() as se:
    se.create_model(Order)
Order.objects.bulk_create([Order(ref=f"o{i}", status="paid" if i % 2 else "draft") for i in range(6)])

site = admin.AdminSite()

class OrderAdmin(admin.ModelAdmin):
    actions = ["mark_shipped"]

    @admin.action(description="Mark selected paid orders as shipped", permissions=["change"])
    def mark_shipped(self, request, queryset):
        n = queryset.filter(status="paid").update(status="shipped")
        self.message_user(request, f"{n} orders shipped.", messages.SUCCESS)

ma = OrderAdmin(Order, site)

rf = RequestFactory()
req = rf.post("/")
req.user = User.objects.create_superuser("root", "r@x.com", "pw")
req.session = {}
req._messages = FallbackStorage(req)

# the "action" is invoked with the selected queryset
selected = Order.objects.all()          # pretend the user ticked all 6
ma.mark_shipped(req, selected)

print("statuses after action:", sorted(Order.objects.values_list("status", flat=True)))
msgs = [(m.level_tag, m.message) for m in req._messages]
print("message_user produced:", msgs)
print("dropdown label:", OrderAdmin.mark_shipped.short_description)
print("gated on permission:", OrderAdmin.mark_shipped.allowed_permissions)`,
        output: `statuses after action: ['draft', 'draft', 'draft', 'shipped', 'shipped', 'shipped']
message_user produced: [('success', '3 orders shipped.')]
dropdown label: Mark selected paid orders as shipped
gated on permission: ['change']`,
        explain: 'The action is a method with the signature (self, request, queryset), where queryset is the set of rows the user ticked -- here all six orders. It does a scoped queryset.filter(status="paid").update(status="shipped"), which is one UPDATE that touches only the three paid rows and leaves the drafts alone. self.message_user with messages.SUCCESS is the only feedback channel to the user and needs request._messages set (RequestFactory does not run middleware, hence FallbackStorage). The @admin.action decorator sets short_description (the dropdown label) and allowed_permissions=[\'change\'] so only users with change permission see the action.',
        explainHi: 'Action ek method hai signature (self, request, queryset) ke saath, jahaan queryset us user ke tick kiye rows ka set hai -- yahaan saare chhe orders. Ye ek scoped queryset.filter(status="paid").update(status="shipped") karta hai, jo ek UPDATE hai jo sirf teen paid rows ko chhuta hai aur drafts ko chhodta hai. messages.SUCCESS ke saath self.message_user user ko ekmatra feedback channel hai aur ise request._messages set chahiye. @admin.action decorator short_description aur allowed_permissions=[\'change\'] set karta hai.',
      },
      {
        title: 'An action that returns a StreamingHttpResponse (CSV export of the selection)',
        titleHi: 'Ek action jo ek StreamingHttpResponse return karti hai (selection ka CSV export)',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.admin", "django.contrib.auth",
                    "django.contrib.contenttypes", "django.contrib.sessions",
                    "django.contrib.messages", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    MIDDLEWARE=["django.contrib.sessions.middleware.SessionMiddleware",
                "django.contrib.auth.middleware.AuthenticationMiddleware",
                "django.contrib.messages.middleware.MessageMiddleware"],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "APP_DIRS": True,
                "OPTIONS": {"context_processors": [
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                    "django.template.context_processors.request"]}}],
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField")
django.setup()

import csv
from django.db import models, connection
from django.contrib import admin
from django.contrib.auth.models import User
from django.http import StreamingHttpResponse
from django.test import RequestFactory

class Lead(models.Model):
    name = models.CharField(max_length=20)
    score = models.IntegerField()
    class Meta:
        app_label = "__main__"

from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)
with connection.schema_editor() as se:
    se.create_model(Lead)
Lead.objects.bulk_create([Lead(name=f"L{i}", score=i * 10) for i in range(5)])

site = admin.AdminSite()

class Echo:
    def write(self, value):
        return value

class LeadAdmin(admin.ModelAdmin):
    actions = ["export_csv"]

    @admin.action(description="Export selected to CSV")
    def export_csv(self, request, queryset):
        writer = csv.writer(Echo())
        rows = queryset.values_list("name", "score").iterator(chunk_size=100)
        def stream():
            yield writer.writerow(["name", "score"])
            for r in rows:
                yield writer.writerow(r)
        resp = StreamingHttpResponse(stream(), content_type="text/csv")
        resp["Content-Disposition"] = 'attachment; filename="leads.csv"'
        return resp

ma = LeadAdmin(Lead, site)
req = RequestFactory().post("/")
req.user = User.objects.create_superuser("root", "r@x.com", "pw")

resp = ma.export_csv(req, Lead.objects.filter(score__gte=20))
print("action returned:", type(resp).__name__)
print("disposition:", resp["Content-Disposition"])
body = b"".join(resp.streaming_content).decode().replace("\\r\\n", "\\n")   # csv.writer emits CRLF
print("csv body:")
print(body, end="")`,
        output: `action returned: StreamingHttpResponse
disposition: attachment; filename="leads.csv"
csv body:
name,score
L2,20
L3,30
L4,40
`,
        explain: 'An action that returns an HttpResponse (or a subclass) makes the admin return that response directly instead of redirecting back to the changelist -- this is exactly how "export selected to CSV" is built. The action streams queryset.values_list(...).iterator() through the Echo + csv.writer pattern from Module 8 into a StreamingHttpResponse with a Content-Disposition attachment header, so the browser downloads a file containing only the ticked rows (here the three leads with score >= 20). csv.writer emits CRLF line endings, normalised to LF here just for the printout.',
        explainHi: 'Ek action jo ek HttpResponse (ya ek subclass) return karta hai admin ko wo response seedhe return karwaata hai changelist par wapas redirect karne ke bajaye -- isi tarah "export selected to CSV" bana hai. Action queryset.values_list(...).iterator() ko Module 8 ke Echo + csv.writer pattern se ek StreamingHttpResponse mein stream karta hai ek Content-Disposition attachment header ke saath, toh browser sirf ticked rows waali ek file download karta hai. csv.writer CRLF line endings emit karta hai.',
      },
      {
        title: 'A TabularInline: the formset, extra rows, and its own permission hooks',
        titleHi: 'Ek TabularInline: formset, extra rows, aur iske apne permission hooks',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.admin", "django.contrib.auth",
                    "django.contrib.contenttypes", "django.contrib.sessions",
                    "django.contrib.messages", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    MIDDLEWARE=["django.contrib.sessions.middleware.SessionMiddleware",
                "django.contrib.auth.middleware.AuthenticationMiddleware",
                "django.contrib.messages.middleware.MessageMiddleware"],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "APP_DIRS": True,
                "OPTIONS": {"context_processors": [
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                    "django.template.context_processors.request"]}}],
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField")
django.setup()

from django.db import models, connection
from django.contrib import admin
from django.contrib.auth.models import User
from django.test import RequestFactory
from django.test.utils import CaptureQueriesContext

class Order(models.Model):
    ref = models.CharField(max_length=10)
    class Meta:
        app_label = "__main__"

class Line(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="lines")
    product = models.CharField(max_length=20)
    qty = models.IntegerField(default=1)
    class Meta:
        app_label = "__main__"

from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)
with connection.schema_editor() as se:
    se.create_model(Order)
    se.create_model(Line)
o = Order.objects.create(ref="A1")
Line.objects.bulk_create([Line(order=o, product=f"P{i}", qty=i + 1) for i in range(3)])

site = admin.AdminSite()

class LineInline(admin.TabularInline):
    model = Line
    extra = 2
    fields = ["product", "qty"]

    def has_delete_permission(self, request, obj=None):
        return False                      # lines can be added/edited here but not deleted

class OrderAdmin(admin.ModelAdmin):
    inlines = [LineInline]

req = RequestFactory().get("/")
req.user = User.objects.create_superuser("root", "r@x.com", "pw")

inline = LineInline(Order, site)
FormSet = inline.get_formset(req, obj=o)
fs = FormSet(instance=o)
print("formset class:", FormSet.__name__)
print("existing rows:", fs.initial_form_count(), "| extra blank forms:", inline.extra)
print("total forms rendered:", len(fs.forms))
print("inline blocks deletion:", inline.has_delete_permission(req, o))

with CaptureQueriesContext(connection) as ctx:
    qs = inline.get_queryset(req).filter(order=o)
    print("child rows via inline queryset:", [(l.product, l.qty) for l in qs])`,
        output: `formset class: LineFormSet
existing rows: 3 | extra blank forms: 2
total forms rendered: 5
inline blocks deletion: False
child rows via inline queryset: [('P0', 1), ('P1', 2), ('P2', 3)]
`,
        explain: "get_formset(req, obj=order) builds the formset class bound to the parent; instantiating it with instance=order binds it to that order's children. initial_form_count() is the number of existing children (3), and len(fs.forms) is those plus the extra=2 blank add-forms, so 5 forms render. has_delete_permission returning False on the inline means those child rows can be added and edited here but the delete checkbox is hidden -- an inline has its own permission hooks, independent of the parent admin. get_queryset on the inline is where you would select_related the child's FKs to avoid the inline N+1.",
        explainHi: 'get_formset(req, obj=order) parent se bound formset class banata hai; ise instance=order ke saath instantiate karna ise us order ke children se bind karta hai. initial_form_count() maujooda children ki sankhya hai (3), aur len(fs.forms) wo plus extra=2 blank add-forms hai, toh 5 forms render hote hain. inline par has_delete_permission False return karna ka matlab un child rows ko yahaan add aur edit kiya ja sakta hai par delete checkbox chhupa hai -- ek inline ke apne permission hooks hain.',
      },
    ],

    mistakes: [
      {
        wrong: `@admin.action(description="Recalculate totals")
def recalc(self, request, queryset):
    for obj in queryset:
        obj.total = obj.compute_total()
        obj.save()
        send_notification(obj.customer)        # a synchronous email per row
# a support user selects 800 rows -> 800 saves + 800 emails inside one request -> timeout`,
        right: `@admin.action(description="Recalculate totals")
def recalc(self, request, queryset):
    ids = list(queryset.values_list("id", flat=True))
    recalc_totals.delay(ids)                    # hand the batch to Celery (Module 8)
    self.message_user(request, f"Queued recalculation for {len(ids)} rows.")`,
        why: 'An admin action runs inside a single request. A loop that does a save and a synchronous side effect per row is fine for 5 rows and a disaster for 800 — the request runs for minutes, holds a worker, and hits the proxy timeout, leaving the operation half-done with no clean way to resume. If the per-row work is non-trivial, the action should just collect the ids and enqueue a background task, then tell the user it is queued. The same "too long for a request" rule from Module 8 applies to admin actions.',
        whyHi: 'Ek admin action ek single request ke andar chalta hai. Ek loop jo prati row ek save aur ek synchronous side effect karta hai 5 rows ke liye theek hai aur 800 ke liye ek aapda — request minuton chalta hai, ek worker rakhta hai, aur proxy timeout hit karta hai. Agar per-row kaam non-trivial hai, action ko bas ids collect karke ek background task enqueue karna chahiye. Module 8 ka wahi "request ke liye bahut lamba" niyam admin actions par lागू hota hai.',
      },
      {
        wrong: `class OrderLineInline(admin.TabularInline):
    model = OrderLine
    extra = 3
# every OrderLine row renders its "product" FK -> str(line.product) -> a query per line
# an order with 40 lines -> 40 extra queries just to open the order page`,
        right: `class OrderLineInline(admin.TabularInline):
    model = OrderLine
    extra = 0                               # don't clutter with blanks on an existing order
    autocomplete_fields = ["product"]       # ajax box, doesn't render every product

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("product")`,
        why: 'An inline is a mini-changelist and has the same N+1: each child row that shows a FK column dereferences that FK once. Override the inline\'s `get_queryset` to `select_related` the FKs, exactly as you would `list_select_related` on the parent admin. Also, a plain FK field in an inline renders a `<select>` of every possible target per row — `autocomplete_fields` replaces that with an ajax search box. And `extra = 3` on a model where rows already exist just adds three empty forms of clutter; set `extra = 0` for edit-heavy inlines.',
        whyHi: 'Ek inline ek mini-changelist hai aur iska wahi N+1 hai: har child row jo ek FK column dikhata hai us FK ko ek baar dereference karta hai. Inline ke `get_queryset` ko FKs ko `select_related` karne ko override karo. Aur, ek inline mein ek plain FK field prati row har possible target ka ek `<select>` render karta hai — `autocomplete_fields` ise ek ajax search box se replace karta hai. Aur jहां rows pehle se hain wahaan `extra = 3` sirf teen empty forms ki clutter add karta hai.',
      },
      {
        wrong: `@admin.action(description="Delete inactive accounts")
def purge(self, request, queryset):
    queryset.delete()                         # no confirmation, no scoping, hard delete
    self.message_user(request, "Purged.")
# one misclick on the "select all" checkbox permanently deletes every row that matched the filter`,
        right: `@admin.action(description="Delete inactive accounts", permissions=["delete"])
def purge(self, request, queryset):
    if request.POST.get("apply"):
        n = queryset.filter(is_active=False, last_login__lt=cutoff).delete()[0]
        self.message_user(request, f"Deleted {n} inactive accounts.")
        return None
    return render(request, "admin/purge_confirm.html",
                  {"count": queryset.count(), "action": "purge"})`,
        why: 'A destructive action with no confirmation step is one misclick away from a disaster — the admin\'s "select all across all pages" makes it trivial to run an action against tens of thousands of rows. A destructive or irreversible action should render an intermediate confirmation page first (showing what will be affected), re-narrow the queryset with an explicit `filter` on the way in (do not trust that the selection is what you think), gate it on the `delete` permission, and only act when the confirm form posts back with `apply`.',
        whyHi: 'Ek confirmation step ke bina ek destructive action ek misclick door ek aapda se hai — admin ka "saare pages ke paar select all" ise trivial banata hai ki ek action ko das-hazaaron rows ke against chalaya jaaye. Ek destructive ya irreversible action ko pehle ek intermediate confirmation page render karna chahiye, andar aate hue queryset ko ek explicit `filter` se re-narrow karna chahiye, `delete` permission par gate karna chahiye, aur sirf tab act karna chahiye jab confirm form `apply` ke saath wapas post karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**A small, permission-gated set of ops actions on the order admin** — "resend confirmation" (enqueues a Celery task), "mark shipped" (a scoped `.update()`), "export selected to CSV" (returns a `StreamingHttpResponse`), each `@admin.action(permissions=["change"])` so read-only support staff do not see them.',
        hi: '**Order admin par ek chhota, permission-gated ops actions ka set** — "resend confirmation" (ek Celery task enqueue karta hai), "mark shipped" (ek scoped `.update()`), "export selected to CSV" (ek `StreamingHttpResponse` return karta hai), har ek `@admin.action(permissions=["change"])`.',
      },
      {
        en: '**Order + line-items as one edit screen** — `OrderLineInline(TabularInline)` with `extra=0`, `autocomplete_fields=["product"]`, `readonly_fields=["line_total"]`, and `get_queryset` doing `select_related("product")`, so an ops user enters a whole multi-line order without leaving the page and it all commits in one transaction.',
        hi: '**Order + line-items ek edit screen ke roop mein** — `OrderLineInline(TabularInline)` `extra=0`, `autocomplete_fields=["product"]`, `readonly_fields=["line_total"]`, aur `get_queryset` `select_related("product")` karta hua, taaki ek ops user page chhode bina ek poora multi-line order enter kare.',
      },
      {
        en: '**A "merge duplicate customers" action with a confirm page** — select two+ rows, the action renders a page to pick the survivor, and on confirm it reassigns all related objects, copies missing fields, soft-deletes the losers, and writes an audit note — all in one `transaction.atomic()`.',
        hi: '**Ek confirm page waali "merge duplicate customers" action** — do+ rows select karo, action survivor chunne ko ek page render karta hai, aur confirm par ye saare related objects reassign karta hai, missing fields copy karta hai, losers ko soft-delete karta hai — sab ek `transaction.atomic()` mein.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the signature and contract of an admin action, and when should an action return a response instead of None?',
        qHi: 'Ek admin action ki signature aur contract kya hai, aur ek action ko None ke badle ek response kab return karna chahiye?',
        a: 'An admin action is a callable that Django invokes with the request and a queryset of the rows the user ticked on the changelist. As a method on a ModelAdmin the signature is self, request, queryset; as a standalone function it is modeladmin, request, queryset. You register it by name or reference in the actions list, label the dropdown entry with the admin dot action decorator\'s description, and optionally pass permissions equal to a list like change or delete so the action only appears for users who hold that permission. The only feedback channel to the user is self dot message_user, which you call with the message and a level constant like messages dot SUCCESS or WARNING. The return value controls what happens next. Returning None, or nothing, sends the user back to the changelist — that is the normal case for an action that just does an update or enqueues work. Returning an HttpResponse makes the admin return that response directly instead. You use that for two things. One is a download: the action builds a StreamingHttpResponse, typically a CSV of the selected rows, with a Content-Disposition attachment header, and returns it so the browser downloads the export. The other is an intermediate page: a destructive or parameterised action renders its own confirmation template first, carrying the selected ids in hidden fields, and checks whether the confirm form has posted back — if not, it returns the rendered template; if so, it performs the operation and returns None. That two-step pattern is how you avoid a one-click bulk delete against tens of thousands of rows.',
        aHi: 'Ek admin action ek callable hai jise Django request aur us user ke changelist par tick kiye rows ke queryset ke saath invoke karta hai. Ek ModelAdmin par ek method ke roop mein signature self, request, queryset hai; ek standalone function ke roop mein ye modeladmin, request, queryset hai. Aap ise actions list mein name ya reference se register karte ho, dropdown entry ko admin dot action decorator ke description se label karte ho, aur optionally permissions equal to ek list pass karte ho taaki action sirf un users ke liye dikhe jinke paas wo permission hai. User ko ekmatra feedback channel self dot message_user hai. Return value control karta hai ki aage kya hota hai. None return karna user ko changelist par wapas bhejta hai — wo ek action ke liye normal case hai jo bas ek update karta hai ya kaam enqueue karta hai. Ek HttpResponse return karna admin ko wo response seedhe return karwaata hai. Aap ise do cheezon ke liye istemal karte ho. Ek download: action ek StreamingHttpResponse banata hai. Doosra ek intermediate page: ek destructive action pehle apna confirmation template render karta hai aur check karta hai ki confirm form wapas post hua hai ya nahi.',
      },
      {
        q: 'How does an inline work, what does it share with `ModelAdmin`, and where is its N+1?',
        qHi: 'Ek inline kaise kaam karta hai, ye `ModelAdmin` ke saath kya share karta hai, aur iska N+1 kahaan hai?',
        a: 'An inline lets you edit a model that has a foreign key back to the model currently being edited, on the same change page. You declare an inline class — TabularInline for a compact one-row-per-child layout, or StackedInline for a full form block per child — set its model, and list it in the parent ModelAdmin\'s inlines. Django builds a formset for the child model bound to the parent instance: it shows the existing children as pre-filled rows plus a number of empty add-forms controlled by extra, and you can bound the count with min_num and max_num. When the parent form is submitted, the parent and every inline child are saved together in one transaction, and a validation error on any child row blocks the whole save. An inline shares most of the ModelAdmin surface: it has its own fields and fieldsets, readonly_fields, ordering, autocomplete_fields, and crucially its own get_queryset and its own has_add_permission, has_change_permission, and has_delete_permission, so you can scope which children are visible and lock down whether they can be added or removed independently of the parent admin. If the child model has two foreign keys to the parent you must set fk_name to disambiguate. The N+1 is exactly the changelist N+1 in miniature: each child row that displays a foreign-key column dereferences that FK once, so an inline with forty rows each showing a product FK does forty extra queries just to render the page. You fix it by overriding the inline\'s get_queryset to select_related those FKs, and by using autocomplete_fields instead of a plain FK widget so the page does not render a select of every possible target per row.',
        aHi: 'Ek inline aapko ek aise model ko edit karne deta hai jiska abhi edit ho rahe model ke liye ek foreign key hai, usi change page par. Aap ek inline class declare karte ho — ek compact one-row-per-child layout ke liye TabularInline, ya prati child ek poora form block ke liye StackedInline — iska model set karte ho, aur ise parent ModelAdmin ke inlines mein list karte ho. Django child model ke liye parent instance se bound ek formset banata hai: ye maujooda children ko pre-filled rows plus extra se controlled kuch empty add-forms dikhata hai. Jab parent form submit hota hai, parent aur har inline child ek transaction mein saath save hote hain. Ek inline zyादातर ModelAdmin surface share karta hai: iska apna fields, readonly_fields, aur mahatvapoorn roop se apna get_queryset aur apne has_add/change/delete_permission hain. N+1 theek chhote roop mein changelist N+1 hai: har child row jo ek foreign-key column display karta hai us FK ko ek baar dereference karta hai. Aap ise inline ke get_queryset ko select_related karne ko override karke fix karte ho.',
      },
    ],

    exercises: [
      {
        task: 'Full admin stack. Model `Order(ref, status default "paid")`, seed 6 alternating `"paid"`/`"draft"`. An `OrderAdmin` with `actions = ["mark_shipped"]` and `@admin.action(description="...", permissions=["change"]) def mark_shipped(self, request, queryset)` that does `queryset.filter(status="paid").update(status="shipped")` then `self.message_user(request, f"{n} shipped.", messages.SUCCESS)`. Build a POST `RequestFactory` request with `.user` (superuser), `.session = {}`, `._messages = FallbackStorage(req)`. Call `ma.mark_shipped(req, Order.objects.all())`. Assert only the 3 `"paid"` rows became `"shipped"`, the message list has one `("success", "3 shipped.")`, and `OrderAdmin.mark_shipped.allowed_permissions == ("change",)`.',
        taskHi: 'Poora admin stack. `Order(ref, status default "paid")` model, 6 seed (`"paid"`/`"draft"` alternate). `OrderAdmin` `actions = ["mark_shipped"]` aur `@admin.action(..., permissions=["change"])` `mark_shipped` ke saath jo `queryset.filter(status="paid").update(status="shipped")` kare phir `message_user`. POST request `.user`/`.session={}`/`._messages=FallbackStorage(req)` ke saath. `ma.mark_shipped(req, Order.objects.all())`. Assert sirf 3 `"paid"` -> `"shipped"`, message `("success", "3 shipped.")`, `allowed_permissions == ("change",)`.',
        hint: '`from django.contrib.messages.storage.fallback import FallbackStorage`. `message_user` needs `request._messages` set (RequestFactory does not run middleware). `@admin.action` puts `short_description` and `allowed_permissions` on the function.',
        hintHi: '`from django.contrib.messages.storage.fallback import FallbackStorage`. `message_user` ko `request._messages` set chahiye. `@admin.action` function par `short_description` aur `allowed_permissions` daalta hai.',
      },
      {
        task: 'Full admin stack + `import csv`. Model `Lead(name, score)`, seed 5 with `score = i*10`. A `LeadAdmin` with an `export_csv` action that streams `queryset.values_list("name","score").iterator()` through the `Echo`+`csv.writer` pattern (Module 8) into a `StreamingHttpResponse(content_type="text/csv")` with a `Content-Disposition` attachment header, and RETURNS it. Call `resp = ma.export_csv(req, Lead.objects.filter(score__gte=20))`. Assert `type(resp).__name__ == "StreamingHttpResponse"`, the disposition header is set, and `b"".join(resp.streaming_content).decode()` is a 4-line CSV (header + L2/L3/L4).',
        taskHi: 'Poora admin stack + `import csv`. `Lead(name, score)` model, 5 seed (`score = i*10`). `LeadAdmin` ek `export_csv` action ke saath jo `queryset.values_list(...).iterator()` ko `Echo`+`csv.writer` pattern se ek `StreamingHttpResponse` mein stream kare aur RETURN kare. `resp = ma.export_csv(req, Lead.objects.filter(score__gte=20))`. Assert `type(resp).__name__ == "StreamingHttpResponse"`, disposition set, aur body ek 4-line CSV.',
        hint: 'An action that returns an `HttpResponse` (or subclass) makes the admin return it as-is — this is how "export selection" works. The `Echo` writer trick is from Module 8 lesson 3.',
        hintHi: 'Ek action jo ek `HttpResponse` return karta hai admin ko ise as-is return karwaata hai. `Echo` writer trick Module 8 lesson 3 se hai.',
      },
      {
        task: 'Full admin stack. Models `Order(ref)` and `Line(order FK related_name="lines", product, qty)`. One order with 3 lines. A `LineInline(admin.TabularInline)` with `model = Line`, `extra = 2`, `fields = ["product", "qty"]`, and `has_delete_permission` returning `False`. Build `inline = LineInline(Order, site)`, `FormSet = inline.get_formset(req, obj=order)`, `fs = FormSet(instance=order)`. Assert `fs.initial_form_count() == 3` (existing children), `len(fs.forms) == 5` (3 + `extra` 2), `inline.has_delete_permission(req, order) is False`, and `list(inline.get_queryset(req).filter(order=order).values_list("product", flat=True))` has the 3 products.',
        taskHi: 'Poora admin stack. `Order(ref)` aur `Line(order FK related_name="lines", product, qty)` models. Ek order 3 lines ke saath. `LineInline(admin.TabularInline)` `model = Line`, `extra = 2`, `has_delete_permission` -> `False`. `FormSet = inline.get_formset(req, obj=order)`, `fs = FormSet(instance=order)`. Assert `initial_form_count() == 3`, `len(fs.forms) == 5`, `has_delete_permission is False`, aur inline queryset mein 3 products.',
        hint: '`inline.get_formset(req, obj=order)` returns the formset class; instantiating with `instance=order` binds it to the parent. `initial_form_count()` is the number of existing children; `len(fs.forms)` includes the `extra` blanks.',
        hintHi: '`inline.get_formset(req, obj=order)` formset class return karta hai; `instance=order` se instantiate karna ise parent se bind karta hai. `initial_form_count()` maujooda children ki sankhya hai.',
      },
    ],

    keyTakeaways: [
      'Admin ACTION = a function `(self, request, queryset)` (or `(modeladmin, request, queryset)`) run on the ticked rows. `@admin.action(description=, permissions=["change"])` sets the dropdown label + which perm the user needs to see it. `self.message_user(request, msg, messages.SUCCESS)` is the only user feedback.',
      'Action return value: `None` -> back to the changelist (normal). An `HttpResponse` is returned as-is -> use for a CSV/file download (`StreamingHttpResponse`) or a redirect to a confirmation page.',
      'INTERMEDIATE PAGE pattern for destructive/parameterised actions: `if "apply" in request.POST` -> do the work, return `None`; else `render` a confirm template carrying the ids + `action` name. Prevents one-click bulk delete across all pages.',
      'Actions do BULK ops: `queryset.update()` skips `save()`/signals/`auto_now` (Module 3). Per-object work (email, recompute) for many rows -> collect ids + `task.delay(ids)` (Module 8), don\'t loop synchronously in the request.',
      'The default `Delete selected` action is always present -> remove with `admin.site.disable_action("delete_selected")` or a filtered `get_actions`.',
      'INLINE = edit a model with a FK to the current model, on the same page. `TabularInline` (compact row/child) vs `StackedInline` (form block/child). `extra` (blank forms), `min_num`/`max_num`, `fk_name` (if 2 FKs to parent), `show_change_link`.',
      'An inline has its OWN `get_queryset` / `has_add/change/delete_permission` — scope & lock it independently. Parent + all inline children save in ONE transaction; a validation error on any child blocks the whole save.',
      'THE INLINE N+1: each child row showing a FK column dereferences it once. Fix: override the inline\'s `get_queryset` -> `select_related(...)`, and use `autocomplete_fields` instead of a plain FK `<select>` of every target.',
    ],
    keyTakeawaysHi: [
      'Admin ACTION = ek function `(self, request, queryset)` jo ticked rows par chalta hai. `@admin.action(description=, permissions=["change"])` dropdown label + kaunsi perm chahiye set karta hai. `self.message_user(request, msg, messages.SUCCESS)` ekmatra user feedback hai.',
      'Action return value: `None` -> changelist par wapas (normal). Ek `HttpResponse` as-is return hota hai -> ek CSV/file download (`StreamingHttpResponse`) ya ek confirmation page par redirect ke liye istemal karo.',
      'Destructive/parameterised actions ke liye INTERMEDIATE PAGE pattern: `if "apply" in request.POST` -> kaam karo, `None` return; warna ek confirm template `render` karo. Saare pages ke paar one-click bulk delete rokta hai.',
      'Actions BULK ops karte hain: `queryset.update()` `save()`/signals/`auto_now` skip karta hai (Module 3). Kई rows ke liye per-object kaam -> ids collect + `task.delay(ids)` (Module 8).',
      'Default `Delete selected` action hamesha maujood hai -> `admin.site.disable_action("delete_selected")` ya ek filtered `get_actions` se hatao.',
      'INLINE = current model ke liye ek FK waale model ko usi page par edit karo. `TabularInline` (compact row/child) vs `StackedInline` (form block/child). `extra`, `min_num`/`max_num`, `fk_name`, `show_change_link`.',
      'Ek inline ka APNA `get_queryset` / `has_add/change/delete_permission` hai — ise swतंtra roop se scope & lock karo. Parent + saare inline children EK transaction mein save hote hain.',
      'INLINE N+1: har child row jo ek FK column dikhata hai use ek baar dereference karta hai. Fix: inline ke `get_queryset` ko `select_related(...)` override karo, aur `autocomplete_fields` istemal karo.',
    ],
  },

  {
    slug: 'dj-admin-permissions-and-audit',
    title: 'Admin Permissions, Per-User Scoping & Audit',
    titleHi: 'Admin Permissions, Per-User Scoping & Audit',
    description: 'The admin runs with the full authority of whoever is logged in. `is_staff` gets you in the door; model permissions gate add/change/delete/view; but the thing people miss is `get_queryset` — without scoping it, every staff user sees and edits *every* row, which is an IDOR with a nice UI.',
    descriptionHi: 'Admin jo bhi logged in hai uski poori authority ke saath chalta hai. `is_staff` aapको darvaze se andar leta hai; model permissions add/change/delete/view gate karti hain; par jo cheez log miss karte hain wo `get_queryset` hai — ise scope kiye bina, har staff user *har* row dekhta aur edit karta hai, jo ek acche UI ke saath ek IDOR hai.',
    difficulty: 'HARD',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A shared filing room with a master key.** `is_staff` is the badge that unlocks the room door — without it you are not getting in at all. Model permissions are which cabinets your badge opens: "view invoices", "change invoices", "delete invoices" are four separate grants. But here is the gap everyone trips on: once you are in the room and can open the invoice cabinet, by default you can open *anyone\'s* invoice drawer — the whole company\'s. The admin does not automatically narrow what you see to your own region, team, or accounts. You have to install that divider yourself, by overriding `get_queryset` so a regional manager\'s cabinet only contains their region\'s files. And a superuser is the person who holds a copy of every key and can also cut new keys — you give that to almost nobody. Finally, every drawer has a sign-out sheet: the admin records who changed what and when (`LogEntry`), which is the audit trail you will want the first time something looks wrong.',
      hi: '**Ek master key waala shared filing room.** `is_staff` wo badge hai jo room ka darvaza kholta hai — iske bina aap andar hi nahi ja rahe. Model permissions ye hain ki aapka badge kaunse cabinets kholta hai: "view invoices", "change invoices", "delete invoices" chaar alag grants hain. Par yahaan wo gap hai jispe sab girte hain: ek baar aap room mein ho aur invoice cabinet khol sakte ho, default se aap *kisi ke bhi* invoice drawer khol sakte ho — poori company ka. Admin automatically aapko jo dikhta hai use aapke apne region, team, ya accounts tak narrow nahi karta. Aapko wo divider khud install karna hota hai, `get_queryset` override karke taaki ek regional manager ke cabinet mein sirf unke region ki files hon. Aur ek superuser wo vyakti hai jo har key ki ek copy rakhta hai aur nayi keys bhi kaat sakta hai. Aakhir mein, har drawer ke paas ek sign-out sheet hai: admin record karta hai ki kisne kya aur kab badla (`LogEntry`).',
    },

    simple: `**The layers**

\`\`\`
1. is_staff = True         -> can log into /admin/ at all (a plain flag on User)
2. model permissions       -> app.view_x / app.add_x / app.change_x / app.delete_x
                              (auto-created per model; assign via Groups)
3. ModelAdmin.has_*_permission(request, obj=None)  -> override to add object-level logic
4. ModelAdmin.get_queryset(request)                -> SCOPE what rows this user sees at all
5. is_superuser = True     -> bypasses ALL permission checks (grant to ~nobody)
\`\`\`

**Per-user scoping — the one people forget**

\`\`\`python
class InvoiceAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(region=request.user.profile.region)   # <-- the divider
\`\`\`

\`\`\`
without this, a "regional manager" with change_invoice sees + edits EVERY invoice.
get_queryset scopes: the changelist, the change form lookup (wrong region -> 404 not 403),
                     autocomplete results, and what actions operate on.
\`\`\`

**Object-level permission hooks**

\`\`\`python
class OrderAdmin(admin.ModelAdmin):
    def has_change_permission(self, request, obj=None):
        if obj is not None and obj.status == "shipped":
            return False                       # nobody edits a shipped order
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser       # only superusers delete orders
\`\`\`

\`\`\`
has_view_permission / has_add_permission / has_change_permission / has_delete_permission
  obj=None  -> "can this user do X to this model at all?"  (controls the changelist / add button)
  obj=X     -> "...to THIS object?"                        (controls the change form / row)
has_module_permission(request)  -> is the app shown in the admin index at all?
return False from has_add/has_delete -> the buttons vanish AND the endpoints 403
\`\`\`

**Audit: who changed what**

\`\`\`python
from django.contrib.admin.models import LogEntry, CHANGE
# every add/change/delete THROUGH THE ADMIN writes a LogEntry automatically
LogEntry.objects.filter(user=someone).order_by("-action_time")
obj_history = LogEntry.objects.filter(
    content_type=ContentType.objects.get_for_model(Order), object_id=str(order.pk))
# NOTE: a bare Model.objects.update() / a shell edit does NOT create a LogEntry
\`\`\`

\`\`\`
LogEntry fields: user, action_time, content_type, object_id, object_repr, action_flag, change_message
action_flag: ADDITION (1) / CHANGE (2) / DELETION (3)
the "History" button on every change page reads LogEntry
for a full audit trail of ALL writes (not just admin), use a dedicated package or DB triggers
\`\`\``,

    simpleHi: `**Layers**

\`\`\`
1. is_staff = True         -> /admin/ mein login kar sakte ho (User par ek plain flag)
2. model permissions       -> app.view_x / app.add_x / app.change_x / app.delete_x
                              (prati model auto-created; Groups ke zariye assign karo)
3. ModelAdmin.has_*_permission(request, obj=None)  -> object-level logic add karne ko override karo
4. ModelAdmin.get_queryset(request)                -> ye user kaunsi rows dekhta hai SCOPE karo
5. is_superuser = True     -> SAARI permission checks bypass karta hai (~kisi ko nahi do)
\`\`\`

**Per-user scoping — jo log bhool jaate hain**

\`\`\`python
class InvoiceAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(region=request.user.profile.region)   # <-- divider
\`\`\`

\`\`\`
iske bina, change_invoice waala ek "regional manager" HAR invoice dekhta + edit karta hai.
get_queryset scope karta hai: changelist, change form lookup (galat region -> 404 403 nahi),
                              autocomplete results, aur actions kis par operate karti hain.
\`\`\`

**Object-level permission hooks**

\`\`\`python
class OrderAdmin(admin.ModelAdmin):
    def has_change_permission(self, request, obj=None):
        if obj is not None and obj.status == "shipped":
            return False                       # koi ek shipped order edit nahi karta
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser       # sirf superusers orders delete karte hain
\`\`\`

\`\`\`
has_view_permission / has_add_permission / has_change_permission / has_delete_permission
  obj=None  -> "kya ye user is model ko X kar sakta hai?"  (changelist / add button control)
  obj=X     -> "...IS object ko?"                          (change form / row control)
has_module_permission(request)  -> kya app admin index mein dikhta bhi hai?
has_add/has_delete se False return -> buttons gायab AUR endpoints 403
\`\`\`

**Audit: kisne kya badla**

\`\`\`python
from django.contrib.admin.models import LogEntry, CHANGE
# har add/change/delete ADMIN KE ZARIYE apने aap ek LogEntry likhta hai
LogEntry.objects.filter(user=someone).order_by("-action_time")
# NOTE: ek bare Model.objects.update() / ek shell edit ek LogEntry NAHI banata
\`\`\`

\`\`\`
LogEntry fields: user, action_time, content_type, object_id, object_repr, action_flag, change_message
action_flag: ADDITION (1) / CHANGE (2) / DELETION (3)
har change page par "History" button LogEntry padhta hai
SAARE writes ke ek poore audit trail ke liye (sirf admin nahi), ek dedicated package ya DB triggers
\`\`\``,

    content: `## The permission layers

**1. \`is_staff\`.** A boolean on \`User\`. It is the *only* thing that lets someone reach \`/admin/\` — no \`is_staff\`, no admin, regardless of permissions. Staff status is not a role; it is "may use the admin".

**2. Model permissions.** Django auto-creates four per model: \`<app>.view_<model>\`, \`add_\`, \`change_\`, \`delete_\`. Assign them — almost always via **Groups** ("Support", "Editors", "Finance"), not to users directly. \`view\` alone gives read-only admin access to that model (the changelist and a readonly change form). A user with no permission for a model does not see it in the admin index.

**3. \`ModelAdmin.has_*_permission(request, obj=None)\`.** \`has_view_permission\`, \`has_add_permission\`, \`has_change_permission\`, \`has_delete_permission\`. Default implementations check the model permission from layer 2. Override to add logic:

- \`obj=None\` — "can this user do X to this model *in general*?" Controls whether the changelist is reachable, whether the "Add" button shows, whether the action is offered.
- \`obj=<instance>\` — "...to *this specific object*?" Controls the individual change form and row-level buttons. This is where you put "cannot edit a shipped order", "cannot delete your own account".

Returning \`False\` both hides the UI affordance **and** makes the corresponding endpoint return 403 — it is real enforcement, not just cosmetic.

**4. \`get_queryset(request)\` — the scoping layer everyone forgets.** By default \`ModelAdmin.get_queryset\` returns \`Model.objects.all()\`. Every staff user with \`change_invoice\` can therefore list, open, and edit **every invoice in the system**. That is a bulk IDOR (Module 6's API1/BOLA) wearing the admin's UI.

\`\`\`python
def get_queryset(self, request):
    qs = super().get_queryset(request)
    if request.user.is_superuser:
        return qs
    return qs.filter(team=request.user.team)
\`\`\`

Scoping \`get_queryset\` narrows **everything at once**: the changelist, the object lookup on the change form (an out-of-scope pk becomes a **404**, not a 403 — it does not confirm the object exists), autocomplete results for FKs pointing at this model, and the set of rows an action can touch. It is the single most important admin-security override, and it is not on by default.

**5. \`is_superuser\`.** Bypasses every permission check and every \`has_*_permission\` (but **not** \`get_queryset\` overrides unless you special-case it, which you usually do). Superuser is "can do literally anything, including create other superusers". Grant it to the smallest possible number of people; give everyone else \`is_staff\` + Group membership.

**\`has_module_permission(request)\`** controls whether an entire app appears in the admin index — useful to hide an app a user has no business seeing even the shape of.

## Vary the form by user or object

\`get_readonly_fields\`, \`get_fields\`, \`get_fieldsets\`, \`get_form\` all take \`request\` and \`obj\`, so the form can adapt:

\`\`\`python
def get_readonly_fields(self, request, obj=None):
    ro = list(super().get_readonly_fields(request, obj))
    if obj and obj.status == "closed":
        return ro + ["amount", "customer", "status"]      # a closed record is frozen
    if not request.user.is_superuser:
        ro += ["internal_notes"]
    return ro
\`\`\`

## Audit — \`LogEntry\`

Every create, edit, and delete **performed through the admin** writes a row to \`django_admin_log\` (\`django.contrib.admin.models.LogEntry\`): the user, the timestamp, the content type and object id, a repr, an action flag (\`ADDITION\` / \`CHANGE\` / \`DELETION\`), and a change message listing which fields changed. The "History" link on every change page reads it. You can query it directly for "what did this user do", "who last touched this record".

Critically: \`LogEntry\` records **admin actions only**. A \`Model.objects.filter(...).update(...)\`, a \`save()\` from a view, a shell edit, a data migration — none of those create a \`LogEntry\`. If you need a complete audit trail of *all* writes, use a dedicated solution: \`django-simple-history\` / \`django-auditlog\` (model-level history tables), or database triggers / logical replication into an audit store. Do not mistake the admin history for a full audit log.

## The admin is not public

The admin is a powerful internal tool and a large attack surface. Standard hardening:

- **Never on the customer-facing domain.** Serve it on an internal-only host, or behind a VPN / IP allowlist / SSO, ideally not at the guessable \`/admin/\` path.
- **\`is_staff\` is a grant, not a default.** New users are not staff.
- **Groups, not per-user permissions.** Audit group membership, not a scatter of individual grants.
- **Scope \`get_queryset\`** for anyone who is not a superuser.
- **2FA** on staff accounts (\`django-otp\` / \`django-two-factor-auth\`).
- **Rate-limit and monitor \`/admin/login/\`.**`,

    contentHi: `## Permission layers

**1. \`is_staff\`.** \`User\` par ek boolean. Ye *ekmatra* cheez hai jo kisi ko \`/admin/\` tak pahunchne deti hai — koi \`is_staff\` nahi, koi admin nahi, permissions chahe jo hon. Staff status ek role nahi hai; ye "admin istemal kar sakta hai" hai.

**2. Model permissions.** Django prati model chaar auto-create karta hai: \`<app>.view_<model>\`, \`add_\`, \`change_\`, \`delete_\`. Unhe assign karo — lगbhag hamesha **Groups** ke zariye, users ko seedhe nahi. Akela \`view\` us model ko read-only admin access deta hai.

**3. \`ModelAdmin.has_*_permission(request, obj=None)\`.** Default implementations layer 2 se model permission check karti hain. Logic add karne ko override karo:

- \`obj=None\` — "kya ye user is model ko *aam taur par* X kar sakta hai?"
- \`obj=<instance>\` — "...*is vishisht object* ko?" Yahaan aap "ek shipped order edit nahi kar sakta" daalte ho.

\`False\` return karna UI affordance ko chhupata hai **aur** corresponding endpoint ko 403 return karwaata hai.

**4. \`get_queryset(request)\` — jo scoping layer sab bhool jaate hain.** Default se \`ModelAdmin.get_queryset\` \`Model.objects.all()\` return karta hai. \`change_invoice\` waala har staff user isliye **system ki har invoice** list, open, aur edit kar sakta hai. Wo admin ke UI mein ek bulk IDOR hai.

\`get_queryset\` scope karna **ek saath sab kuch** narrow karta hai: changelist, change form par object lookup (ek out-of-scope pk ek **404** ban jaata hai, ek 403 nahi), autocomplete results, aur ek action jin rows ko chhoo sakti hai. Ye sabse mahatvapoorn admin-security override hai, aur ye default se on nahi hai.

**5. \`is_superuser\`.** Har permission check bypass karta hai (par \`get_queryset\` overrides nahi jab tak aap special-case na karo). Superuser "literally kuch bhi kar sakta hai, doosre superusers banane sahit" hai. Ise sabse kam sambhav logon ko do.

**\`has_module_permission(request)\`** control karta hai ki kya ek poora app admin index mein dikhta hai.

## Form ko user ya object se vary karo

\`get_readonly_fields\`, \`get_fields\`, \`get_form\` sab \`request\` aur \`obj\` lete hain, toh form adapt kar sakta hai (ek closed record frozen, non-superusers ke liye \`internal_notes\` readonly).

## Audit — \`LogEntry\`

Har create, edit, aur delete **admin ke zariye kiya gaya** \`django_admin_log\` mein ek row likhta hai: user, timestamp, content type aur object id, ek repr, ek action flag (\`ADDITION\` / \`CHANGE\` / \`DELETION\`), aur ek change message. Har change page par "History" link ise padhta hai.

Mahatvapoorn: \`LogEntry\` **sirf admin actions** record karta hai. Ek \`Model.objects.update(...)\`, ek view se \`save()\`, ek shell edit — inme se koi \`LogEntry\` nahi banata. *Saare* writes ke ek poore audit trail ke liye ek dedicated solution istemal karo: \`django-simple-history\` / \`django-auditlog\`, ya database triggers.

## Admin public nahi hai

Admin ek powerful internal tool aur ek bada attack surface hai. Standard hardening:

- **Kabhi customer-facing domain par nahi.** Ek internal-only host par, ya ek VPN / IP allowlist / SSO ke peeche, ideally guessable \`/admin/\` path par nahi.
- **\`is_staff\` ek grant hai, ek default nahi.**
- **Groups, per-user permissions nahi.**
- **Non-superusers ke liye \`get_queryset\` scope karo.**
- **Staff accounts par 2FA.**
- **\`/admin/login/\` rate-limit aur monitor karo.**`,

    examples: [
      {
        title: 'Model permissions gate has_change_permission; is_staff alone is not enough',
        titleHi: 'Model permissions has_change_permission gate karti hain; akela is_staff kaafi nahi',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.admin", "django.contrib.auth",
                    "django.contrib.contenttypes", "django.contrib.sessions",
                    "django.contrib.messages", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    MIDDLEWARE=["django.contrib.sessions.middleware.SessionMiddleware",
                "django.contrib.auth.middleware.AuthenticationMiddleware",
                "django.contrib.messages.middleware.MessageMiddleware"],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "APP_DIRS": True,
                "OPTIONS": {"context_processors": [
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                    "django.template.context_processors.request"]}}],
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField")
django.setup()

from django.db import models, connection
from django.contrib import admin
from django.contrib.auth.models import User, Permission
from django.contrib.auth.management import create_permissions
from django.apps import apps
from django.test import RequestFactory

class Invoice(models.Model):
    number = models.CharField(max_length=10)
    class Meta:
        app_label = "__main__"

from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)
with connection.schema_editor() as se:
    se.create_model(Invoice)
for ac in apps.get_app_configs():          # the post_migrate signal doesn't fire for __main__
    ac.models_module = True
    create_permissions(ac, verbosity=0)

site = admin.AdminSite()
ma = admin.ModelAdmin(Invoice, site)
rf = RequestFactory()

def req_for(user):
    r = rf.get("/"); r.user = user; return r

# a staff user with NO invoice permissions
plain = User.objects.create_user("plain", password="pw", is_staff=True)
r1 = req_for(User.objects.get(pk=plain.pk))
print("plain staff -- view:", ma.has_view_permission(r1),
      "| change:", ma.has_change_permission(r1))

# grant change_invoice
editor = User.objects.create_user("editor", password="pw", is_staff=True)
editor.user_permissions.add(Permission.objects.get(codename="change_invoice"))
r2 = req_for(User.objects.get(pk=editor.pk))     # reload to clear the perm cache
print("editor (change_invoice) -- change:", ma.has_change_permission(r2),
      "| delete:", ma.has_delete_permission(r2))

# superuser bypasses everything
root = User.objects.create_superuser("root", "r@x.com", "pw")
r3 = req_for(root)
print("superuser -- add:", ma.has_add_permission(r3),
      "| delete:", ma.has_delete_permission(r3))`,
        output: `plain staff -- view: False | change: False
editor (change_invoice) -- change: True | delete: False
superuser -- add: True | delete: True`,
        explain: 'is_staff only lets a user reach /admin/; it grants nothing by itself, so a staff user with no invoice permissions has has_view_permission and has_change_permission both False and would not even see Invoice in the admin index. Granting the change_invoice permission (via user_permissions, then re-fetching the user because Django caches permissions on the instance) makes has_change_permission True -- but has_delete_permission stays False, because each of view/add/change/delete is a separate grant. A superuser bypasses every check, so all four are True regardless.',
        explainHi: 'is_staff sirf ek user ko /admin/ tak pahunchne deta hai; ye khud se kuch grant nahi karta, toh bina invoice permissions ke ek staff user ke has_view aur has_change dono False hain aur wo admin index mein Invoice dekhega bhi nahi. change_invoice permission grant karna (user_permissions ke zariye, phir user re-fetch karke kyunki Django instance par permissions cache karta hai) has_change_permission True banata hai -- par has_delete_permission False rehta hai, kyunki view/add/change/delete me se har ek ek alag grant hai. Ek superuser har check bypass karta hai.',
      },
      {
        title: 'get_queryset scoping: a non-superuser only sees their team\'s rows',
        titleHi: 'get_queryset scoping: ek non-superuser sirf apni team ki rows dekhta hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.admin", "django.contrib.auth",
                    "django.contrib.contenttypes", "django.contrib.sessions",
                    "django.contrib.messages", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    MIDDLEWARE=["django.contrib.sessions.middleware.SessionMiddleware",
                "django.contrib.auth.middleware.AuthenticationMiddleware",
                "django.contrib.messages.middleware.MessageMiddleware"],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "APP_DIRS": True,
                "OPTIONS": {"context_processors": [
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                    "django.template.context_processors.request"]}}],
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField")
django.setup()

from django.db import models, connection
from django.contrib import admin
from django.contrib.auth.models import User
from django.test import RequestFactory

class Ticket(models.Model):
    subject = models.CharField(max_length=30)
    team = models.CharField(max_length=10)
    class Meta:
        app_label = "__main__"

from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)
with connection.schema_editor() as se:
    se.create_model(Ticket)
Ticket.objects.bulk_create([Ticket(subject=f"t{i}", team="red" if i % 2 else "blue") for i in range(6)])

site = admin.AdminSite()

class TicketAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(team=getattr(request.user, "_team", None))

ma = TicketAdmin(Ticket, site)
rf = RequestFactory()

root = User.objects.create_superuser("root", "r@x.com", "pw")
r_root = rf.get("/"); r_root.user = root

red_user = User.objects.create_user("red", password="pw", is_staff=True)
red_user._team = "red"
r_red = rf.get("/"); r_red.user = red_user

print("superuser sees:", ma.get_queryset(r_root).count(), "tickets")
print("red_user sees: ", ma.get_queryset(r_red).count(), "tickets",
      list(ma.get_queryset(r_red).values_list("team", flat=True)))

# the change-form lookup uses get_queryset too -> a blue ticket is NOT FOUND for red_user
blue_ticket = Ticket.objects.filter(team="blue").first()
looked_up = ma.get_object(r_red, str(blue_ticket.pk))
print("red_user get_object(blue ticket) ->", looked_up, "(scoped out -> None -> a 404 in the UI)")`,
        output: `superuser sees: 6 tickets
red_user sees:  3 tickets ['red', 'red', 'red']
red_user get_object(blue ticket) -> None (scoped out -> None -> a 404 in the UI)`,
        explain: 'The default ModelAdmin.get_queryset returns everything, so without this override every staff user would see and edit every ticket. The override returns .all() for a superuser and .filter(team=...) for everyone else. That one change scopes the changelist (red_user sees 3, all red), and it also scopes the change-form lookup: get_object runs inside get_queryset, so a blue ticket for red_user is simply not found -- get_object returns None, which the admin turns into a 404, not a 403. A 404 does not confirm the row exists; a 403 would.',
        explainHi: 'Default ModelAdmin.get_queryset sab kuch return karta hai, toh is override ke bina har staff user har ticket dekhega aur edit karega. Override ek superuser ke liye .all() aur baaki sab ke liye .filter(team=...) return karta hai. Wo ek change changelist ko scope karta hai (red_user 3 dekhta hai, sab red), aur ye change-form lookup ko bhi scope karta hai: get_object get_queryset ke andar chalta hai, toh red_user ke liye ek blue ticket bस nahi milta -- get_object None return karta hai, jise admin ek 404 mein badalta hai, ek 403 nahi. Ek 404 pushti nahi karta ki row exist karti hai.',
      },
      {
        title: 'LogEntry: admin edits are logged, a bare .update() is not',
        titleHi: 'LogEntry: admin edits log hote hain, ek bare .update() nahi',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.admin", "django.contrib.auth",
                    "django.contrib.contenttypes", "django.contrib.sessions",
                    "django.contrib.messages", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    MIDDLEWARE=["django.contrib.sessions.middleware.SessionMiddleware",
                "django.contrib.auth.middleware.AuthenticationMiddleware",
                "django.contrib.messages.middleware.MessageMiddleware"],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "APP_DIRS": True,
                "OPTIONS": {"context_processors": [
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                    "django.template.context_processors.request"]}}],
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField")
django.setup()

from django.db import models, connection
from django.contrib.auth.models import User
from django.contrib.admin.models import LogEntry, CHANGE
from django.contrib.contenttypes.models import ContentType

class Product(models.Model):
    name = models.CharField(max_length=20)
    price = models.IntegerField()
    class Meta:
        app_label = "__main__"

from django.core.management import call_command
call_command("migrate", run_syncdb=True, verbosity=0)
with connection.schema_editor() as se:
    se.create_model(Product)
p = Product.objects.create(name="Widget", price=100)
root = User.objects.create_superuser("root", "r@x.com", "pw")
ct = ContentType.objects.get_for_model(Product)

# simulate what the admin does on a change (Django 6.1: log_actions, plural, takes a queryset)
LogEntry.objects.log_actions(
    user_id=root.pk, queryset=Product.objects.filter(pk=p.pk),
    action_flag=CHANGE, change_message=[{"changed": {"fields": ["price"]}}],
    single_object=True,
)
p.price = 120
p.save(update_fields=["price"])

# a bare queryset update -- NO LogEntry
Product.objects.filter(pk=p.pk).update(price=999)

entries = LogEntry.objects.filter(content_type=ct, object_id=str(p.pk))
print("log entries for this product:", entries.count())
e = entries.first()
print("  who:", User.objects.get(pk=e.user_id).username, "| flag:", e.action_flag, "(CHANGE=2)")
print("  message:", e.get_change_message())
print("current price in DB:", Product.objects.get(pk=p.pk).price, "(the .update() to 999 left no trace)")`,
        output: `log entries for this product: 1
  who: root | flag: 2 (CHANGE=2)
  message: Changed price.
current price in DB: 999 (the .update() to 999 left no trace)`,
        explain: 'LogEntry.objects.log_actions (plural in Django 6.1, taking a queryset) is what the admin calls internally on every add/change/delete -- it records the user, timestamp, content type, object id, an action_flag (2 = CHANGE), and a change message that renders as "Changed price.". The History button on every change page reads this table. But a bare Product.objects.filter(...).update(price=999) writes zero LogEntry rows: the admin log only covers writes made through the admin. A shell edit, a management command, a data migration, or a view\'s save() all leave no trace here -- which is why the admin history is not a complete audit trail.',
        explainHi: 'LogEntry.objects.log_actions (Django 6.1 mein plural, ek queryset leta hai) wo hai jo admin har add/change/delete par internally call karta hai -- ye user, timestamp, content type, object id, ek action_flag (2 = CHANGE), aur ek change message record karta hai jo "Changed price." ke roop mein render hota hai. Har change page par History button is table ko padhta hai. Par ek bare Product.objects.filter(...).update(price=999) zero LogEntry rows likhta hai: admin log sirf admin ke zariye kiye writes cover karta hai. Ek shell edit, ek management command yahaan koi trace nahi chhodte -- isiliye admin history ek poora audit trail nahi hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# "regional managers" group has view_invoice + change_invoice
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ["number", "region", "amount"]
    # no get_queryset override
# every regional manager can list, open, and edit EVERY region's invoices`,
        right: `class InvoiceAdmin(admin.ModelAdmin):
    list_display = ["number", "region", "amount"]

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(region__in=request.user.managed_regions.all())`,
        why: 'Model permissions are all-or-nothing per model: `change_invoice` means "can change invoices", not "can change invoices in my region". Without a `get_queryset` override, `ModelAdmin.get_queryset` returns `.all()`, so every user who can change invoices can change *all* of them — the changelist, the search, the change form, and any bulk action all operate on the full table. This is the exact BOLA/IDOR pattern from Module 6, just with the admin UI on top. Scoping `get_queryset` to what the user is allowed to see is the fix, and it must be done per `ModelAdmin` — nothing does it for you.',
        whyHi: 'Model permissions prati model all-or-nothing hain: `change_invoice` matlab "invoices change kar sakta hai", "apne region mein invoices change kar sakta hai" nahi. Ek `get_queryset` override ke bina, `ModelAdmin.get_queryset` `.all()` return karta hai, toh har user jo invoices change kar sakta hai un *sab* ko change kar sakta hai. Ye Module 6 ka wahi BOLA/IDOR pattern hai, bas upar admin UI ke saath. `get_queryset` ko user jo dekhne ki anumati hai us tak scope karna fix hai, aur ye prati `ModelAdmin` karna hi hai.',
      },
      {
        wrong: `def has_change_permission(self, request, obj=None):
    return request.user.email.endswith("@ourcompany.com")
# only hides the "change" button in the UI -- right? no: it also gates the endpoint,
# BUT this logic runs on the CHANGELIST too (obj=None) and can wrongly grant/deny there`,
        right: `def has_change_permission(self, request, obj=None):
    if not super().has_change_permission(request, obj):
        return False                       # respect the model permission first
    if obj is not None and obj.locked:
        return False                       # then add object-level logic
    return True`,
        why: 'Two issues. First, replacing the whole permission check with custom logic and not calling `super()` throws away the model-permission layer — a user with no `change_x` permission at all could pass your custom check. Layer the object rule *on top of* `super().has_change_permission(...)`. Second, `has_change_permission` is called with `obj=None` for the changelist/"can they change this model at all" question and with `obj=<instance>` for a specific row — your logic has to handle both. Object-level rules go behind an `if obj is not None` guard so the `obj=None` call still delegates to `super()`.',
        whyHi: 'Do issues. Pehla, poori permission check ko custom logic se replace karna aur `super()` call na karna model-permission layer ko phenk deta hai — ek user jiske paas koi `change_x` permission hi nahi wo aapki custom check pass kar sakta hai. Object rule ko `super().has_change_permission(...)` ke *upar* layer karo. Doosra, `has_change_permission` changelist ke liye `obj=None` ke saath aur ek vishisht row ke liye `obj=<instance>` ke saath call hota hai — aapki logic ko dono handle karne hain.',
      },
      {
        wrong: `# operations runbook: "to fix the stuck orders, run in the shell:"
Order.objects.filter(status="stuck").update(status="paid")
# ... 3 months later, in an incident review: "who changed these? when? why?"
# -> nothing in LogEntry, nothing in the admin history, no record at all`,
        right: `# do it through the admin (an action) so it is logged, OR log it explicitly:
with transaction.atomic():
    stuck = Order.objects.select_for_update().filter(status="stuck")
    ids = list(stuck.values_list("id", flat=True))
    stuck.update(status="paid")
    AuditLog.objects.create(actor="ops-runbook", action="unstick_orders",
                            detail={"order_ids": ids, "reason": "INC-1234"})`,
        why: '`LogEntry` (and the admin "History" tab) only captures writes made *through the admin*. A `QuerySet.update()` from the shell, a management command, a data migration, or a view\'s `save()` leaves no trace there. If an operational fix matters enough to review later — and stuck-order fixes always do — either perform it via an admin action (so `LogEntry` records it) or write an explicit audit record with who/what/why. For blanket coverage of all model writes, adopt `django-simple-history` or `django-auditlog`, or use database-level triggers.',
        whyHi: '`LogEntry` (aur admin "History" tab) sirf *admin ke zariye* kiye writes capture karta hai. Shell se ek `QuerySet.update()`, ek management command, ek data migration — wahaan koi trace nahi chhodta. Agar ek operational fix baad mein review karne ke liye kaafi maayne rakhta hai — aur stuck-order fixes hamesha rakhte hain — ya ise ek admin action ke zariye karo ya who/what/why ke saath ek explicit audit record likho. Saare model writes ke blanket coverage ke liye `django-simple-history` apnao.',
      },
    ],

    realWorld: [
      {
        en: '**Groups mapped to job functions** — "Support" (view everything, change a few status fields, run the safe actions), "Content" (full CRUD on articles/media, nothing else), "Finance" (invoices + refunds, read-only orders). Users get `is_staff` + one or two groups; nobody gets per-user permissions.',
        hi: '**Job functions se mapped Groups** — "Support" (sab kuch view, kuch status fields change, safe actions), "Content" (articles/media par full CRUD), "Finance" (invoices + refunds, read-only orders). Users ko `is_staff` + ek-do groups milte hain; kisi ko per-user permissions nahi.',
      },
      {
        en: '**A tenant-scoped admin for a multi-tenant SaaS** — every `ModelAdmin` inherits a base whose `get_queryset` filters by `request.user.tenant`, `save_model` stamps the tenant on create, and `formfield_for_foreignkey` limits FK choices to the same tenant, so a customer-success rep assigned to Tenant A physically cannot see Tenant B\'s data in the admin.',
        hi: '**Ek multi-tenant SaaS ke liye ek tenant-scoped admin** — har `ModelAdmin` ek base inherit karta hai jiska `get_queryset` `request.user.tenant` se filter karta hai, `save_model` create par tenant stamp karta hai, aur `formfield_for_foreignkey` FK choices ko usi tenant tak limit karta hai.',
      },
      {
        en: '**Admin behind SSO + 2FA on a private hostname** — `admin.company-internal.net` not `company.com/admin/`, only reachable on the VPN, `django-otp` enforced for all staff, `/admin/login/` rate-limited, and a Sentry alert on any `LogEntry` with `action_flag=DELETION` on a sensitive model.',
        hi: '**Ek private hostname par SSO + 2FA ke peeche admin** — `admin.company-internal.net`, sirf VPN par reachable, saare staff ke liye `django-otp` enforced, `/admin/login/` rate-limited, aur ek sensitive model par `action_flag=DELETION` waale kisi bhi `LogEntry` par ek Sentry alert.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through the layers that decide whether a staff user can edit a particular row in the admin.',
        qHi: 'Un layers ke through chalo jo decide karti hain ki ek staff user admin mein ek vishisht row edit kar sakta hai ya nahi.',
        a: 'Five layers. First, is_staff on the user — a plain boolean that is the only thing letting anyone reach slash admin at all; without it, permissions are irrelevant. Second, the model permission, app dot change_model, one of the four Django auto-creates per model, normally granted through a Group. The default has_change_permission returns whether the user holds that. Third, ModelAdmin dot has_change_permission, which you can override. It is called with obj equals None to decide whether the changelist and the general change capability are available, and with obj equal to the instance to decide a specific row — that is where object-level rules live, like a shipped order being uneditable, and you layer them on top of a call to super so you do not discard the model-permission check. Returning False both removes the UI and makes the endpoint return 403. Fourth, and the one people forget, get_queryset. The change form looks the object up inside ModelAdmin dot get_queryset, so if you have scoped that queryset — filtering invoices to the user\'s region, say — a row outside the scope is not a 403, it is a 404, because the lookup simply does not find it. Without a get_queryset override every staff user with change permission can edit every row, which is a bulk IDOR with the admin UI on it. Fifth, is_superuser, which bypasses every permission check and every has-permission override, though not your get_queryset scoping unless you deliberately special-case superusers, which you usually do. So the row is editable only if the user is staff, holds the model permission or is a superuser, passes the has_change_permission override for that object, and the object is inside get_queryset.',
        aHi: 'Paanch layers. Pehla, user par is_staff — ek plain boolean jo ekmatra cheez hai jo kisi ko slash admin tak pahunchne deti hai. Doosra, model permission, app dot change_model, un chaar me se ek jo Django prati model auto-create karta hai, normally ek Group ke through granted. Teesra, ModelAdmin dot has_change_permission, jise aap override kar sakte ho. Ye obj equals None ke saath call hota hai ye decide karne ko ki changelist available hai ya nahi, aur obj equal to instance ke saath ek vishisht row decide karne ko — wahaan object-level rules rehte hain, aur aap unhe super ke call ke upar layer karte ho. False return karna UI hataता hai aur endpoint ko 403 return karwaata hai. Chautha, aur jo log bhool jaate hain, get_queryset. Change form object ko ModelAdmin dot get_queryset ke andar look up karta hai, toh agar aapne us queryset ko scope kiya hai, scope ke bahar ki ek row ek 403 nahi hai, ek 404 hai. Ek get_queryset override ke bina change permission waala har staff user har row edit kar sakta hai. Paanchvा, is_superuser, jo har permission check bypass karta hai, par aapki get_queryset scoping nahi jab tak aap superusers ko deliberately special-case na karo.',
      },
      {
        q: 'What does `LogEntry` capture, what does it miss, and how would you build a real audit trail?',
        qHi: '`LogEntry` kya capture karta hai, kya miss karta hai, aur aap ek asli audit trail kaise banaoge?',
        a: 'LogEntry, backing the django_admin_log table and the History link on every change page, records every create, edit, and delete performed through the admin. Each row has the user, the timestamp, the content type and object id, a string repr of the object, an action flag that is addition, change, or deletion, and a change message that for edits lists which fields changed. You can query it directly for what a given user did or who last touched a record. What it misses is everything not done through the admin: a QuerySet dot update from a view or the shell, a save from application code, a bulk_create, a data migration, a database change made directly — none of those produce a LogEntry, because the logging is wired into the admin\'s save path, not the model\'s. So the admin history is an audit trail of admin activity only, and treating it as a complete record of who changed what is a mistake that surfaces during an incident review. For a real audit trail you have options at different levels. At the model level, django-simple-history or django-auditlog keep a shadow history table per model, populated by signals on every save regardless of where it came from, so you can see the full version history of a row and who changed it if the actor is threaded through. At the database level, triggers or logical replication into an append-only audit store capture literally every write including ones that bypass the ORM, at the cost of living outside Django. And for deliberate operational actions you can write explicit audit rows yourself with actor, action, reason, and affected ids, which is worth doing for shell runbooks even if you also have model-level history.',
        aHi: 'LogEntry, django_admin_log table aur har change page par History link ko back karta hua, admin ke through kiye har create, edit, aur delete ko record karta hai. Har row mein user, timestamp, content type aur object id, object ka ek string repr, ek action flag jo addition, change, ya deletion hai, aur ek change message hai. Ye jo miss karta hai wo sab kuch hai jo admin ke through nahi kiya gaya: ek view ya shell se ek QuerySet dot update, application code se ek save, ek bulk_create, ek data migration — inme se koi LogEntry produce nahi karta, kyunki logging admin ke save path mein wired hai, model ke nahi. Toh admin history sirf admin activity ka ek audit trail hai. Ek asli audit trail ke liye aapke paas alag levels par options hain. Model level par, django-simple-history ya django-auditlog prati model ek shadow history table rakhte hain, har save par signals se populated. Database level par, triggers ya logical replication ek append-only audit store mein literally har write capture karte hain. Aur deliberate operational actions ke liye aap khud explicit audit rows likh sakte ho.',
      },
    ],

    exercises: [
      {
        task: 'Full admin stack + `create_permissions` per app_config manually (the `post_migrate` signal does not fire for a `__main__` app). Model `Invoice(number)`. A plain `admin.ModelAdmin(Invoice, site)`. Build request helpers that set `.user`. Assert: (a) a `create_user(is_staff=True)` with NO permissions has `has_view_permission` and `has_change_permission` both `False`; (b) after `user.user_permissions.add(Permission.objects.get(codename="change_invoice"))` and reloading the user, `has_change_permission` is `True` but `has_delete_permission` is `False`; (c) a `create_superuser` has every `has_*_permission` `True`.',
        taskHi: 'Poora admin stack + prati app_config manually `create_permissions`. `Invoice(number)` model. Ek plain `admin.ModelAdmin(Invoice, site)`. `.user` set karne waale request helpers. Assert: (a) bina permissions ke ek `is_staff` user ke `has_view` aur `has_change` dono `False`; (b) `change_invoice` add karke user reload karne ke baad `has_change` `True` par `has_delete` `False`; (c) ek superuser ke saare `has_*` `True`.',
        hint: '`from django.contrib.auth.management import create_permissions`; loop `apps.get_app_configs()`, set `ac.models_module = True`, call `create_permissions(ac, verbosity=0)`. Django caches permissions on the user object — re-fetch with `User.objects.get(pk=...)` after granting.',
        hintHi: '`from django.contrib.auth.management import create_permissions`; `apps.get_app_configs()` loop karo. Django user object par permissions cache karta hai — grant ke baad `User.objects.get(pk=...)` se re-fetch karo.',
      },
      {
        task: 'Full admin stack. Model `Ticket(subject, team)`, seed 6 alternating `team="red"`/`"blue"`. A `TicketAdmin` whose `get_queryset` returns `.all()` for a superuser else `.filter(team=getattr(request.user, "_team", None))`. Assert: (a) `ma.get_queryset(superuser_req).count() == 6`; (b) a staff user with `._team = "red"` sees `3`, all `team == "red"`; (c) `ma.get_object(red_req, str(blue_ticket.pk))` raises `Http404` (the change-form lookup is scoped, so an out-of-scope row is a 404, not a 403).',
        taskHi: 'Poora admin stack. `Ticket(subject, team)` model, 6 seed (`"red"`/`"blue"` alternate). `TicketAdmin` jiska `get_queryset` superuser ke liye `.all()` warna `.filter(team=...)`. Assert: (a) superuser 6 dekhta hai; (b) `._team = "red"` waala staff user 3 dekhta hai, sab `"red"`; (c) `ma.get_object(red_req, str(blue_ticket.pk))` `Http404` raise karta hai.',
        hint: '`from django.http import Http404`. `ModelAdmin.get_object(request, object_id)` does the change-form lookup *inside* `get_queryset(request)`, so a row your scoped queryset excludes is genuinely not found — a 404, which does not leak that the row exists.',
        hintHi: '`from django.http import Http404`. `ModelAdmin.get_object(request, object_id)` change-form lookup `get_queryset(request)` ke *andar* karta hai, toh aapki scoped queryset jise exclude karti hai wo genuinely nahi milti.',
      },
      {
        task: 'Full admin stack. Model `Product(name, price)`, one row. Use `LogEntry.objects.log_actions(user_id=..., queryset=Product.objects.filter(pk=p.pk), action_flag=CHANGE, change_message=[{"changed": {"fields": ["price"]}}], single_object=True)` to simulate an admin edit, then `p.price = 120; p.save()`. Then run a bare `Product.objects.filter(pk=p.pk).update(price=999)`. Assert: `LogEntry.objects.filter(content_type=ct, object_id=str(p.pk)).count() == 1` (only the simulated admin edit was logged), the entry\'s `action_flag == CHANGE`, `get_change_message()` mentions "price", and the DB price is `999` with no second log entry for that change.',
        taskHi: 'Poora admin stack. `Product(name, price)` model, ek row. `LogEntry.objects.log_actions(...)` se ek admin edit simulate karo, phir `p.save()`. Phir ek bare `.update(price=999)`. Assert: `LogEntry` count `1` (sirf simulated admin edit logged), `action_flag == CHANGE`, `get_change_message()` mein "price", aur DB price `999` bina us change ke liye doosre log entry ke.',
        hint: 'Django 6.1 renamed `log_action` -> `log_actions` (plural, takes a `queryset`, needs `single_object=True` for one row). The point: `QuerySet.update()` writes zero `LogEntry` rows — the admin log only covers admin-path writes.',
        hintHi: 'Django 6.1 ne `log_action` -> `log_actions` rename kiya (plural, ek `queryset` leta hai, ek row ke liye `single_object=True`). Point: `QuerySet.update()` zero `LogEntry` rows likhta hai.',
      },
    ],

    keyTakeaways: [
      'Admin permission layers: (1) `is_staff` (the ONLY thing that lets you reach `/admin/`); (2) model perms `app.view/add/change/delete_x` (auto-created, grant via GROUPS); (3) `ModelAdmin.has_*_permission(request, obj=None)` overrides; (4) `get_queryset` scoping; (5) `is_superuser` (bypasses ALL perm checks).',
      '`has_*_permission(request, obj=None)`: `obj=None` = "can this user X this model at all?" (changelist / Add button); `obj=<instance>` = "...this specific object?" (change form / row). Returning `False` hides the UI AND 403s the endpoint. Layer object rules ON TOP of `super()`.',
      'THE #1 MISSED THING: `get_queryset` defaults to `.all()`. Without scoping it, every staff user with `change_x` lists + opens + edits + bulk-actions EVERY row — a bulk IDOR (Module 6 BOLA) with the admin UI. Override it per `ModelAdmin`; nothing does it for you.',
      'Scoping `get_queryset` narrows EVERYTHING at once: changelist, the change-form lookup (out-of-scope pk -> 404 not 403, doesn\'t confirm existence), autocomplete results, and what actions touch.',
      'Model permissions are ALL-OR-NOTHING per model: `change_invoice` = "change invoices", NOT "change invoices in my region". Regional/team/tenant scoping is `get_queryset`, not a permission.',
      'Vary the form by user/object: `get_readonly_fields` / `get_fields` / `get_form` take `(request, obj)` — freeze a closed record, hide `internal_notes` from non-superusers.',
      '`LogEntry` (`django_admin_log`, the "History" button): logs every add/change/delete DONE THROUGH THE ADMIN — user, time, content_type, object_id, `action_flag` (ADDITION/CHANGE/DELETION), changed fields. A bare `.update()` / shell edit / migration writes NOTHING. Django 6.1: `log_actions` (plural).',
      'For a real audit trail of ALL writes: `django-simple-history` / `django-auditlog` (model-level shadow tables via signals), or DB triggers. The admin is an INTERNAL tool — private hostname (not `/admin/`), SSO + 2FA, rate-limited login, `is_staff` never a default.',
    ],
    keyTakeawaysHi: [
      'Admin permission layers: (1) `is_staff` (EKMATRA cheez jo aapko `/admin/` tak pahunchne deti hai); (2) model perms `app.view/add/change/delete_x` (auto-created, GROUPS ke zariye grant karo); (3) `ModelAdmin.has_*_permission` overrides; (4) `get_queryset` scoping; (5) `is_superuser` (SAARI perm checks bypass).',
      '`has_*_permission(request, obj=None)`: `obj=None` = "kya ye user is model ko X kar sakta hai?" (changelist / Add button); `obj=<instance>` = "...is vishisht object ko?". `False` return UI chhupata hai AUR endpoint 403 karta hai. Object rules ko `super()` ke UPAR layer karo.',
      '#1 MISSED CHEEZ: `get_queryset` default se `.all()`. Ise scope kiye bina, `change_x` waala har staff user HAR row list + open + edit + bulk-action karta hai — admin UI ke saath ek bulk IDOR. Ise prati `ModelAdmin` override karo.',
      '`get_queryset` scope karna ek saath SAB KUCH narrow karta hai: changelist, change-form lookup (out-of-scope pk -> 404 403 nahi), autocomplete results, aur actions kis par chalti hain.',
      'Model permissions prati model ALL-OR-NOTHING hain: `change_invoice` = "invoices change karo", "apne region mein invoices change karo" NAHI. Regional/team/tenant scoping `get_queryset` hai, ek permission nahi.',
      'Form ko user/object se vary karo: `get_readonly_fields` / `get_fields` / `get_form` `(request, obj)` lete hain — ek closed record freeze karo, non-superusers se `internal_notes` chhupao.',
      '`LogEntry` (`django_admin_log`, "History" button): ADMIN KE ZARIYE kiye har add/change/delete ko log karta hai. Ek bare `.update()` / shell edit / migration KUCH NAHI likhta. Django 6.1: `log_actions` (plural).',
      'SAARE writes ke ek asli audit trail ke liye: `django-simple-history` / `django-auditlog`, ya DB triggers. Admin ek INTERNAL tool hai — private hostname, SSO + 2FA, rate-limited login, `is_staff` kabhi default nahi.',
    ],
  },
];
