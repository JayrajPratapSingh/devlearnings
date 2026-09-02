/**
 * Django Complete Course — Module 2: Models & the ORM, lessons 1-3.
 *
 * Lesson 1: models & fields — model = table, field types, null vs blank,
 *           default/choices/unique/db_index, Meta, __str__, the pk.
 * Lesson 2: migrations — what they are, makemigrations (autodetector) -> migrate,
 *           the migration file, showmigrations/sqlmigrate, rollback, --check.
 * Lesson 3: data migrations — RunPython (forward + reverse), historical models
 *           via apps.get_model, RunSQL, separating schema from data, squashing.
 *
 * NOTE for future editors: same conventions as course-django-module1.ts.
 *  - Every backtick inside simple/simpleHi/content/contentHi is `\``.
 *  - `$` before `{` in template literals -> `\${` (f-strings with `${...}` bite).
 *  - `examples` use `code` + `output`, ASCII-only output, run with `python`.
 *  - Boot standalone Django: settings.configure() + django.setup(); models get
 *    `class Meta: app_label = "__main__"`; tables via `connection.schema_editor()`.
 *  - Migration examples use the real migrations API (MigrationAutodetector with an
 *    empty MigrationGraph, RunPython.database_forwards) against sqlite :memory:.
 *  - Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_2: CourseLesson[] = [
  {
    slug: 'dj-models-and-fields',
    title: 'Models & Fields: A Class Is a Table',
    titleHi: 'Models Aur Fields: Ek Class Ek Table Hai',
    description: 'A Django model is a Python class where each class attribute is a database column with a type, constraints and validation baked in. Get the field definitions right — `null` vs `blank`, `choices`, `unique`, indexes, `Meta` — and the ORM, the admin, forms and the API all follow from that one declaration.',
    descriptionHi: 'Ek Django model ek Python class hai jahaan har class attribute ek database column hai ek type, constraints aur validation ke saath. Field definitions sahi karो — `null` vs `blank`, `choices`, `unique`, indexes, `Meta` — aur ORM, admin, forms aur API sab us ek declaration se follow karते hain.',
    difficulty: 'EASY',
    duration: 22,
    order: 1,

    analogy: {
      en: '**The spec sheet for a filing cabinet drawer, written once and enforced forever.** A model class is that spec: this drawer holds records; each record has a "customer name" slot that is text, at most 120 characters, must be filled; a "status" slot that may only ever contain one of four printed labels; a "signup date" slot that is a date and is stamped automatically; a "referral code" slot that is optional and must be unique across the whole drawer. From this one sheet the workshop builds the physical drawer (the database table via a migration), the intake form the clerk uses (a Django form / a DRF serializer), the read-only viewer in the back office (the admin), and the rules that reject a malformed record before it is filed (validation). Change the spec sheet and you issue a work order to retrofit the drawer (a new migration). The `Meta` block is the label on the outside of the drawer and the filing order inside it — default sort, the drawer name, cross-slot rules like "no two records with the same name and date".',
      hi: '**Ek filing cabinet drawer ki spec sheet, ek baar likhi aur hamesha ke liye enforce.** Ek model class wo spec hai: ye drawer records rakhता hai; har record mein ek "customer name" slot hai jо text hai, zyada se zyada 120 characters, bhara hona chahिए; ek "status" slot jismें kabhi chaar printed labels mein se ek hi ho sakta hai; ek "signup date" slot jо ek date hai aur apne aap stamp hoती hai; ek "referral code" slot jо optional hai aur poore drawer mein unique hona chahिए. Is ek sheet se workshop bhautik drawer banाता hai (migration ke zariye database table), intake form (ek Django form / ek DRF serializer), back office mein read-only viewer (admin), aur niyam jо ek malformed record ko file hone se pehle reject karते hain (validation). Spec sheet badalो aur aap drawer ko retrofit karne ka work order jारी karते ho (ek nayi migration). `Meta` block drawer ke bahar ka label aur andar ka filing order hai.',
    },

    simple: `**A model class**

\`\`\`python
# catalog/models.py
from django.db import models

class Product(models.Model):
    STATUS = [("draft", "Draft"), ("active", "Active"), ("archived", "Archived")]

    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)             # blank="" allowed in forms
    price_cents = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS, default="draft")
    sku = models.CharField(max_length=32, unique=True, db_index=True)
    weight_kg = models.DecimalField(max_digits=6, decimal_places=3, null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)   # set once, on insert
    updated_at = models.DateTimeField(auto_now=True)       # set on every save

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["status", "created_at"])]
        constraints = [
            models.CheckConstraint(condition=models.Q(price_cents__gte=0), name="price_nonneg"),
        ]

    def __str__(self):
        return f"{self.name} ({self.sku})"
\`\`\`

**Common field types**

\`\`\`
CharField(max_length=)       varchar        TextField()              text (no max)
IntegerField / BigIntegerField / PositiveIntegerField / SmallIntegerField
BooleanField(default=)       bool           FloatField()             double
DecimalField(max_digits=, decimal_places=)   exact -- use for MONEY, never FloatField
DateField / DateTimeField / TimeField / DurationField
  auto_now_add=True  -> set on INSERT only        auto_now=True  -> set on every save
EmailField / URLField / SlugField / UUIDField(default=uuid.uuid4)
JSONField(default=dict)      jsonb          BinaryField()
FileField(upload_to=) / ImageField()        FilePathField()
ForeignKey / ManyToManyField / OneToOneField   -- lesson 4
\`\`\`

**\`null\` vs \`blank\` — different layers**

\`\`\`
null=True    DATABASE: the column allows SQL NULL
blank=True   VALIDATION/FORMS: the field may be left empty in a form / serializer

For strings: use  blank=True  and NOT  null=True  (Django convention: "empty" is "", not NULL)
  -> otherwise you have two empty states: "" and None
For numbers/dates/FKs: use  null=True, blank=True  together when the value is truly optional
\`\`\`

**\`Meta\` options you use constantly**

\`\`\`python
class Meta:
    ordering = ["name"]                    # default .order_by() for every query (use sparingly)
    db_table = "legacy_products"           # override the auto table name
    verbose_name = "product"               # singular label (admin, errors)
    verbose_name_plural = "products"
    unique_together = [["seller", "sku"]]  # (older) or use constraints=[UniqueConstraint(...)]
    indexes = [models.Index(fields=["status", "-created_at"])]
    constraints = [models.UniqueConstraint(fields=["seller", "sku"], name="uniq_seller_sku")]
    abstract = True                        # a base class, no table -- lesson 5
\`\`\`

\`\`\`
EVERY model gets an auto  id = BigAutoField(primary_key=True)  unless you declare a pk.
  .pk is an alias for the primary-key field.
__str__  -> the human label everywhere (admin, shell, repr fallback). Always define it.
Field kwargs: null, blank, default, choices, unique, db_index, editable, help_text,
              validators=[...], verbose_name, db_column, unique_for_date
\`\`\``,

    simpleHi: `**Ek model class**

\`\`\`python
# catalog/models.py
from django.db import models

class Product(models.Model):
    STATUS = [("draft", "Draft"), ("active", "Active"), ("archived", "Archived")]

    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    price_cents = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS, default="draft")
    sku = models.CharField(max_length=32, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)   # ek baar set, insert par
    updated_at = models.DateTimeField(auto_now=True)       # har save par set

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["status", "created_at"])]

    def __str__(self):
        return f"{self.name} ({self.sku})"
\`\`\`

**Aam field types**

\`\`\`
CharField(max_length=)       varchar        TextField()              text (koi max nahi)
IntegerField / BigIntegerField / PositiveIntegerField
BooleanField(default=)       bool           FloatField()             double
DecimalField(max_digits=, decimal_places=)   exact -- MONEY ke liye, kabhi FloatField nahi
DateField / DateTimeField / TimeField
  auto_now_add=True  -> sirf INSERT par set        auto_now=True  -> har save par set
EmailField / URLField / SlugField / UUIDField(default=uuid.uuid4)
JSONField(default=dict)      jsonb          FileField(upload_to=) / ImageField()
ForeignKey / ManyToManyField / OneToOneField   -- lesson 4
\`\`\`

**\`null\` vs \`blank\` — alag layers**

\`\`\`
null=True    DATABASE: column SQL NULL allow karता hai
blank=True   VALIDATION/FORMS: field ek form / serializer mein khali chhodा jа sakta hai

Strings ke liye: blank=True istemal karो aur null=True NAHI (Django convention: "empty" "" hai, NULL nahi)
Numbers/dates/FKs ke liye: null=True, blank=True saath jab value sachmuch optional hai
\`\`\`

**\`Meta\` options**

\`\`\`python
class Meta:
    ordering = ["name"]                    # har query ke liye default .order_by() (kamdी se istemal)
    db_table = "legacy_products"
    verbose_name = "product"
    indexes = [models.Index(fields=["status", "-created_at"])]
    constraints = [models.UniqueConstraint(fields=["seller", "sku"], name="uniq_seller_sku")]
    abstract = True                        # ek base class, koi table nahi -- lesson 5
\`\`\`

\`\`\`
HAR model ko ek auto  id = BigAutoField(primary_key=True)  milता hai jab tak aap ek pk declare na karो.
  .pk primary-key field ka ek alias hai.
__str__  -> har jagah human label. Hamesha define karो.
Field kwargs: null, blank, default, choices, unique, db_index, editable, help_text, validators=[...]
\`\`\``,

    content: `## A model maps to a table

\`class Product(models.Model)\` declares a database table. Each class attribute that is a \`Field\` instance becomes a column; the field type determines the SQL column type, and its keyword arguments become constraints, defaults, and validation rules. Django generates and applies the DDL through **migrations** (lesson 2), and gives you a query API (\`Product.objects\`) and an instance API (\`p.save()\`, \`p.delete()\`).

Every model gets an implicit primary key — \`id = BigAutoField(primary_key=True)\` by default (set the project-wide type with \`DEFAULT_AUTO_FIELD\`). \`instance.pk\` is always an alias for whichever field is the primary key.

## Field types that matter

- **Text**: \`CharField(max_length=N)\` (varchar, required max), \`TextField()\` (unbounded), \`SlugField\`, \`EmailField\`, \`URLField\` — the last three are \`CharField\` with a validator.
- **Numbers**: \`IntegerField\`, \`BigIntegerField\`, \`SmallIntegerField\`, and \`Positive*\` variants. \`FloatField\` is a C double — **never for money** (binary rounding, recall Python Module 7). Use \`DecimalField(max_digits=, decimal_places=)\` for currency, which maps to SQL \`numeric\`.
- **Dates/times**: \`DateField\`, \`DateTimeField\`, \`TimeField\`, \`DurationField\`. \`auto_now_add=True\` stamps the value on the first save (creation) only; \`auto_now=True\` re-stamps on every save (updated-at). With \`USE_TZ = True\` (always keep it on) datetimes are stored in UTC and returned as timezone-aware.
- **Booleans**: \`BooleanField\`. For a nullable boolean use \`null=True\` (not the removed \`NullBooleanField\`).
- **Structured**: \`JSONField(default=dict)\` — \`jsonb\` on Postgres, queryable with \`__contains\`, \`__has_key\`, key lookups. Do not use it as a dumping ground for what should be columns.
- **Identifiers**: \`UUIDField(default=uuid.uuid4, editable=False)\` for public-facing ids you do not want to be guessable/sequential.
- **Files**: \`FileField(upload_to="...")\`, \`ImageField\` — store the path in the DB, the bytes in \`MEDIA_ROOT\` / S3.

## \`null\` vs \`blank\`

These control **different layers** and are a classic source of confusion:

- **\`null\`** is a *database* concern: does the column permit SQL \`NULL\`?
- **\`blank\`** is a *validation* concern: may the field be left empty in a form or serializer (Django checks this in \`full_clean\`, forms check it, DRF checks it)?

Rules:

- **String fields**: set \`blank=True\` if optional, but leave \`null=False\`. Django's convention is that "no value" for text is the empty string \`""\`, not \`NULL\` — allowing both gives you two "empty" states to handle everywhere. (\`CharField(null=True)\` triggers a system-check warning unless \`unique=True\`.)
- **Non-string optional fields** (int, date, FK, decimal): set **both** \`null=True, blank=True\` — there is no natural "empty" sentinel, so \`NULL\` is correct, and \`blank=True\` lets forms omit it.
- **Required fields**: neither.

## \`choices\`

\`\`\`python
class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        SHIPPED = "shipped", "Shipped"

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)

# usage:
order.status = Order.Status.PAID
order.get_status_display()          # -> "Paid"  (auto-generated method)
Order.objects.filter(status=Order.Status.SHIPPED)
\`\`\`

\`TextChoices\` / \`IntegerChoices\` (Django 3.0+) give you a named enum with \`.choices\`, \`.values\`, \`.labels\`, and \`.label\` on each member — far better than a bare list of tuples. \`choices\` is validated by \`full_clean\` and rendered as a \`<select>\` in forms, but the database itself does not enforce it unless you add a \`CheckConstraint\`.

## Indexes and constraints in \`Meta\`

- **\`db_index=True\`** on a field, or **\`Meta.indexes = [models.Index(fields=[...])]\`** for composite/expression indexes. Index the columns you filter and order by; every index slows writes, so do not over-index (Module 3).
- **\`Meta.constraints\`** — database-level rules, the strongest kind:
  - \`UniqueConstraint(fields=[...], name=..., condition=Q(...))\` — a partial/conditional unique index.
  - \`CheckConstraint(condition=Q(...), name=...)\` — e.g. \`end_date >= start_date\`, \`quantity > 0\`.
  These are enforced by the database on every write, regardless of whether your Python validation ran.

## \`__str__\` and model methods

Always define \`__str__\` — it is the label in the admin, the shell, \`repr\` fallbacks, and template rendering of an instance. Add domain methods and \`@property\` computed values on the model to keep logic next to the data:

\`\`\`python
class Product(models.Model):
    price_cents = models.PositiveIntegerField()

    @property
    def price_dollars(self):
        return self.price_cents / 100

    def is_on_sale(self):
        return self.saleprice_set.filter(active=True).exists()

    def get_absolute_url(self):
        return reverse("catalog:product", kwargs={"slug": self.slug})
\`\`\`

A \`@property\` is computed in Python and **cannot be used in a \`filter()\`** — for that you need an ORM annotation or a stored field (Module 3).`,

    contentHi: `## Ek model ek table par map hoता hai

\`class Product(models.Model)\` ek database table declare karता hai. Har class attribute jо ek \`Field\` instance hai ek column ban jाता hai; field type SQL column type tay karता hai, aur iske keyword arguments constraints, defaults, aur validation rules ban jाते hain. Django DDL ko **migrations** ke zariye generate aur apply karता hai (lesson 2), aur aapko ek query API (\`Product.objects\`) aur ek instance API (\`p.save()\`, \`p.delete()\`) deता hai.

Har model ko ek implicit primary key milता hai — default roop se \`id = BigAutoField(primary_key=True)\`. \`instance.pk\` hamesha primary key field ka ek alias hai.

## Field types jо maayne rakhते hain

- **Text**: \`CharField(max_length=N)\`, \`TextField()\`, \`SlugField\`, \`EmailField\`, \`URLField\`.
- **Numbers**: \`IntegerField\`, \`BigIntegerField\`, aur \`Positive*\` variants. \`FloatField\` ek C double hai — **kabhi money ke liye nahi**. Currency ke liye \`DecimalField(max_digits=, decimal_places=)\` istemal karो.
- **Dates/times**: \`auto_now_add=True\` value ko pehle save par stamp karता hai; \`auto_now=True\` har save par re-stamp karता hai. \`USE_TZ = True\` ke saath datetimes UTC mein store hote hain.
- **Structured**: \`JSONField(default=dict)\` — Postgres par \`jsonb\`, \`__contains\`, \`__has_key\` se queryable.
- **Identifiers**: \`UUIDField(default=uuid.uuid4, editable=False)\` public-facing ids ke liye jinhe aap guessable nahi chahते.

## \`null\` vs \`blank\`

Ye **alag layers** control karते hain:

- **\`null\`** ek *database* concern hai: kya column SQL \`NULL\` permit karता hai?
- **\`blank\`** ek *validation* concern hai: kya field ek form ya serializer mein khali chhodा jа sakta hai?

Niyam:

- **String fields**: agar optional hai toh \`blank=True\` set karो, par \`null=False\` chhodो. Django ki convention hai ki text ke liye "no value" empty string \`""\` hai, \`NULL\` nahi.
- **Non-string optional fields** (int, date, FK, decimal): **dono** \`null=True, blank=True\` set karो.
- **Required fields**: koi nahi.

## \`choices\`

\`\`\`python
class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)

order.get_status_display()          # -> "Paid"  (auto-generated method)
\`\`\`

\`TextChoices\` / \`IntegerChoices\` aapko ek named enum \`.choices\`, \`.values\`, \`.labels\` ke saath deता hai. \`choices\` \`full_clean\` dwara validate hoता hai par database khud ise enforce nahi karता jab tak aap ek \`CheckConstraint\` add na karो.

## Indexes aur constraints \`Meta\` mein

- **\`db_index=True\`** ek field par, ya **\`Meta.indexes\`** composite indexes ke liye. Un columns ko index karो jinpar aap filter aur order karते ho; har index writes dhीmा karता hai.
- **\`Meta.constraints\`** — database-level rules:
  - \`UniqueConstraint(fields=[...], name=..., condition=Q(...))\`
  - \`CheckConstraint(condition=Q(...), name=...)\` — jaise \`quantity > 0\`.
  Ye database dwara har write par enforce hote hain.

## \`__str__\` aur model methods

Hamesha \`__str__\` define karो. Model par domain methods aur \`@property\` computed values add karो:

\`\`\`python
    @property
    def price_dollars(self):
        return self.price_cents / 100
\`\`\`

Ek \`@property\` Python mein compute hoता hai aur **ek \`filter()\` mein istemal nahi ho sakta** — uske liye aapko ek ORM annotation ya ek stored field chahिए (Module 3).`,

    examples: [
      {
        title: 'A model becomes a table; field kwargs become column behaviour',
        titleHi: 'Ek model ek table ban jaता hai; field kwargs column behaviour ban jाते hain',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection

class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        SHIPPED = "shipped", "Shipped"

    reference = models.CharField(max_length=12, unique=True)
    amount_cents = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    note = models.TextField(blank=True)                # optional string: blank, NOT null
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "__main__"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order {self.reference} ({self.get_status_display()})"

with connection.schema_editor() as se:
    se.create_model(Order)

o = Order.objects.create(reference="ORD-0001", amount_cents=4999)
print("str:", str(o))
print("default status:", o.status)
print("display method:", o.get_status_display())
print("note defaulted to empty string:", repr(o.note))
print("pk is the auto id:", o.pk == o.id)

# the unique constraint is real -- enforced by the DB
try:
    Order.objects.create(reference="ORD-0001", amount_cents=1)
except Exception as e:
    print("duplicate reference rejected:", type(e).__name__)`,
        output: `str: Order ORD-0001 (Pending)
default status: pending
display method: Pending
note defaulted to empty string: ''
pk is the auto id: True
duplicate reference rejected: IntegrityError
`,
        explain: 'The class declaration produced a table with columns for `reference`, `amount_cents`, `status`, `note`, `created_at`, plus an auto `id` primary key. `default=Status.PENDING` filled `status` on insert; `TextChoices` gave the free `get_status_display()` method returning the human label. `blank=True` (no `null=True`) means the optional `note` is stored as `""`, not `NULL` — one empty state, not two. `unique=True` on `reference` is a real database constraint: the second insert with the same value raises `IntegrityError`, not a silent overwrite.',
        explainHi: 'Class declaration ne ek table banाya `reference`, `amount_cents`, `status`, `note`, `created_at` ke columns ke saath, plus ek auto `id` primary key. `default=Status.PENDING` ne insert par `status` bhara; `TextChoices` ne muft `get_status_display()` method di. `blank=True` (koi `null=True` nahi) matlab optional `note` `""` ki tarah store hoता hai, `NULL` nahi. `reference` par `unique=True` ek asli database constraint hai: usi value ke saath doosra insert `IntegrityError` raise karता hai.',
      },
      {
        title: 'null vs blank: the two empty-value layers',
        titleHi: 'null vs blank: do empty-value layers',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.core.exceptions import ValidationError

class Contact(models.Model):
    name = models.CharField(max_length=100)                  # required
    nickname = models.CharField(max_length=50, blank=True)   # optional string -> blank only
    age = models.PositiveIntegerField(null=True, blank=True) # optional number -> null AND blank
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Contact)

c = Contact.objects.create(name="Ada")
print("nickname stored as:", repr(c.nickname), "(empty string, not None)")
print("age stored as:", c.age, "(None -> SQL NULL)")

# full_clean() runs the 'blank' validation; .save() alone does NOT
c2 = Contact(name="")                        # name is required, blank not allowed
try:
    c2.full_clean()
except ValidationError as e:
    print("validation error on blank name:", list(e.message_dict.keys()))

c3 = Contact(name="Bo")                      # nickname omitted -> fine, blank=True
c3.full_clean()
print("Bo passes full_clean with empty nickname:", c3.nickname == "")`,
        output: `nickname stored as: '' (empty string, not None)
age stored as: None (None -> SQL NULL)
validation error on blank name: ['name']
Bo passes full_clean with empty nickname: True
`,
        explain: '`nickname` has only `blank=True`: it is a string, so its "empty" is `""` and the column stays `NOT NULL`. `age` has `null=True, blank=True`: a number has no natural empty value, so `None` maps to SQL `NULL` and `blank=True` lets a form omit it. The `blank` rule is a *validation* rule — it fires in `full_clean()` (and forms/serializers), not in a bare `.save()`. That is why `Contact(name="").save()` would succeed at the DB level but `full_clean()` catches the empty required field first.',
        explainHi: '`nickname` mein sirf `blank=True` hai: ye ek string hai, toh iska "empty" `""` hai aur column `NOT NULL` rehता hai. `age` mein `null=True, blank=True` hai: ek number ka koi natural empty value nahi, toh `None` SQL `NULL` par map hoता hai. `blank` niyam ek *validation* niyam hai — ye `full_clean()` mein fire hoता hai, ek bare `.save()` mein nahi. Isiliye `Contact(name="").save()` DB level par safal hoगा par `full_clean()` empty required field pehle pakadता hai.',
      },
      {
        title: 'Meta.constraints are enforced by the database',
        titleHi: 'Meta.constraints database dwara enforce hote hain',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection

class Booking(models.Model):
    room = models.CharField(max_length=20)
    day = models.DateField()
    guests = models.PositiveIntegerField()

    class Meta:
        app_label = "__main__"
        constraints = [
            models.UniqueConstraint(fields=["room", "day"], name="one_booking_per_room_per_day"),
            models.CheckConstraint(condition=models.Q(guests__gte=1, guests__lte=8),
                                   name="guests_between_1_and_8"),
        ]

with connection.schema_editor() as se:
    se.create_model(Booking)

import datetime
d = datetime.date(2024, 6, 1)
Booking.objects.create(room="A1", day=d, guests=2)
print("first booking ok")

for label, kwargs in [
    ("same room+day again", dict(room="A1", day=d, guests=3)),
    ("guests = 0", dict(room="B2", day=d, guests=0)),
    ("guests = 20", dict(room="C3", day=d, guests=20)),
    ("valid different room", dict(room="B2", day=d, guests=4)),
]:
    try:
        Booking.objects.create(**kwargs)
        print(f"  {label}: allowed")
    except Exception as e:
        print(f"  {label}: rejected ({type(e).__name__})")`,
        output: `first booking ok
  same room+day again: rejected (IntegrityError)
  guests = 0: rejected (IntegrityError)
  guests = 20: rejected (IntegrityError)
  valid different room: allowed
`,
        explain: '`UniqueConstraint(fields=["room", "day"])` and `CheckConstraint(guests BETWEEN 1 AND 8)` are compiled into real `UNIQUE` and `CHECK` clauses in the `CREATE TABLE`. They are enforced by the database on *every* write path — the ORM, `bulk_create`, raw SQL, another service — regardless of whether any Python validation ran. This is the strongest guarantee you can give your data. `choices` and model `clean()` are validation-layer only and can be bypassed; put real invariants in `Meta.constraints`.',
        explainHi: '`UniqueConstraint(fields=["room", "day"])` aur `CheckConstraint(guests BETWEEN 1 AND 8)` `CREATE TABLE` mein asli `UNIQUE` aur `CHECK` clauses mein compile hote hain. Ye database dwara *har* write path par enforce hote hain — ORM, `bulk_create`, raw SQL — chahe koi Python validation chala ho ya nahi. Ye sabse majboot guarantee hai jо aap apne data ko de sakte ho. `choices` aur model `clean()` sirf validation-layer hain aur bypass kiye jа sakte hain.',
      },
    ],

    mistakes: [
      {
        wrong: `class Invoice(models.Model):
    amount = models.FloatField()           # money as a float
    notes = models.CharField(max_length=500, null=True, blank=True)   # nullable string`,
        right: `class Invoice(models.Model):
    amount_cents = models.PositiveIntegerField()          # integer cents
    # or: amount = models.DecimalField(max_digits=12, decimal_places=2)
    notes = models.CharField(max_length=500, blank=True)  # blank only, default ""`,
        why: '`FloatField` is a binary double: `0.1 + 0.2 != 0.3`, and sums of many rows drift. Money must be an integer count of the smallest unit (cents) or a `DecimalField` (SQL `numeric`, exact). And `CharField(null=True)` creates two "no value" states — `""` and `NULL` — that every query, form, and template then has to handle; Django convention is `blank=True` alone so "empty" is always `""`.',
        whyHi: '`FloatField` ek binary double hai: `0.1 + 0.2 != 0.3`, aur kai rows ke sums drift karते hain. Money ek integer count (cents) ya ek `DecimalField` (SQL `numeric`, exact) hona chahिए. Aur `CharField(null=True)` do "no value" states banाता hai — `""` aur `NULL` — jinhe har query, form, aur template handle karna padता hai; Django convention akela `blank=True` hai.',
      },
      {
        wrong: `class Event(models.Model):
    start = models.DateTimeField()
    end = models.DateTimeField()
    # relies on the view to check end > start -- other code paths don't`,
        right: `class Event(models.Model):
    start = models.DateTimeField()
    end = models.DateTimeField()

    class Meta:
        constraints = [
            models.CheckConstraint(condition=models.Q(end__gt=models.F("start")),
                                   name="event_end_after_start"),
        ]`,
        why: 'An invariant enforced only in a view (or a serializer, or `clean()`) is enforced only on the code paths that go through that view. A `bulk_create`, a data migration, the admin, a management command, or a second service writing to the same table can all violate it. A `CheckConstraint` in `Meta.constraints` is compiled into the table and holds on every write, forever.',
        whyHi: 'Ek invariant jо sirf ek view mein enforce hoता hai sirf un code paths par enforce hoता hai jо us view se guzarते hain. Ek `bulk_create`, ek data migration, admin, ya ek doosri service sab ise violate kar sakte hain. `Meta.constraints` mein ek `CheckConstraint` table mein compile hoता hai aur har write par hamesha holds.',
      },
      {
        wrong: `class Article(models.Model):
    title = models.CharField(max_length=200)
    class Meta:
        ordering = ["-published_at"]        # a global default sort on EVERY query
# now every Article.objects.filter(...) sorts by published_at, even count() subqueries`,
        right: `class Article(models.Model):
    title = models.CharField(max_length=200)
    # no Meta.ordering -- callers order explicitly:
# Article.objects.order_by("-published_at")
# or a manager method: Article.objects.recent()`,
        why: '`Meta.ordering` adds an `ORDER BY` to *every* query for that model, including ones where it is pure overhead — `exists()`, `count()`, `in` subqueries, aggregations — and it can silently make a query use a different index or a filesort. It also surprises readers who see an unordered-looking `.filter()` return sorted rows. Prefer explicit `.order_by()` at the call site or a named manager method; reserve `Meta.ordering` for models that are genuinely always displayed in one order.',
        whyHi: '`Meta.ordering` us model ke liye *har* query mein ek `ORDER BY` add karता hai, un mein bhi jahaan ye pure overhead hai — `exists()`, `count()`, subqueries — aur ye chupchaap ek query ko ek alag index istemal karवा sakta hai. Call site par explicit `.order_by()` ya ek named manager method prefer karो.',
      },
    ],

    realWorld: [
      {
        en: '**`TextChoices`/`IntegerChoices` + a `CheckConstraint` is the standard enum pattern** — the enum gives typed access (`Order.Status.PAID`), `get_status_display()`, and admin/form dropdowns; the constraint stops a bad value entering via `bulk_create` or raw SQL. Adding a value is a one-line enum change plus a migration for the constraint.',
        hi: '**`TextChoices`/`IntegerChoices` + ek `CheckConstraint` standard enum pattern hai** — enum typed access deता hai (`Order.Status.PAID`), `get_status_display()`, aur admin/form dropdowns; constraint ek bad value ko `bulk_create` ya raw SQL se aane se rokता hai.',
      },
      {
        en: '**`created_at`/`updated_at` via `auto_now_add`/`auto_now` on an abstract `TimeStampedModel` base** (lesson 5) is on nearly every model in a real codebase. `UUIDField` for public ids appears on anything exposed in URLs where sequential integer ids would leak volume or enable enumeration.',
        hi: '**Ek abstract `TimeStampedModel` base par `auto_now_add`/`auto_now` ke zariye `created_at`/`updated_at`** (lesson 5) ek asli codebase mein lगbhag har model par hai. `UUIDField` public ids ke liye kisi bhi cheez par dikhता hai jо URLs mein expose hoती hai.',
      },
      {
        en: '**`JSONField` is used for genuinely schemaless data** — a webhook payload snapshot, per-user UI preferences, a flexible \`metadata\` bag on an integration model — and abused as a way to avoid migrations. The rule: if you filter or aggregate on a key, or it is required, it should be a column. `JSONField` on Postgres is `jsonb` and supports GIN indexes for the queryable cases.',
        hi: '**`JSONField` genuinely schemaless data ke liye istemal hoता hai** — ek webhook payload snapshot, per-user UI preferences — aur migrations se bachने ke tarike ki tarah abuse hoता hai. Niyam: agar aap ek key par filter ya aggregate karते ho, ya wo required hai, wo ek column honi chahिए.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `null` and `blank` on a Django field, and how do you choose for a given field?',
        qHi: 'Ek Django field par `null` aur `blank` mein kya antar hai, aur ek diye gaye field ke liye aap kaise chunते ho?',
        a: 'They operate at different layers. null is purely a database concern: it controls whether the underlying column is defined as allowing SQL NULL. blank is purely a validation concern: it controls whether Django considers an empty value acceptable when validating the model, which happens in full_clean, in Django forms, and in DRF serializers. A field can have any combination of the two. The convention for choosing depends on the field type. For string-based fields — CharField, TextField, and their relatives — you set blank equals True if the field is optional, but you leave null as False. Django\'s design decision is that the absence of a string value is represented by the empty string, not by NULL, so that there is exactly one "empty" state to check for rather than two. In fact CharField with null equals True raises a system-check warning unless the field is also unique, precisely because it invites that ambiguity. For non-string fields where there is no natural empty value — integers, decimals, dates, booleans that need three states, foreign keys — you set both null equals True and blank equals True when the field is genuinely optional: null so the column can hold NULL, and blank so forms and serializers accept its omission. For a required field you set neither. One subtlety people miss: because blank is a validation rule, it only takes effect when validation actually runs. A bare instance dot save does not call full_clean, so saving a model with a required field left blank will succeed at the database level unless there is also a NOT NULL constraint or a check. If you want the blank rule enforced you must call full_clean yourself, or rely on the form or serializer layer to do it, or add a database constraint.',
        aHi: 'Ye alag layers par kaam karते hain. null purी tarah ek database concern hai: ye control karता hai ki underlying column SQL NULL allow karता hai ya nahi. blank purी tarah ek validation concern hai: ye control karता hai ki Django ek empty value ko acceptable maanता hai ya nahi jab model validate karता hai, jо full_clean, Django forms, aur DRF serializers mein hoता hai. Chunne ki convention field type par nirbhar karती hai. String-based fields ke liye — CharField, TextField — aap blank equals True set karते ho agar field optional hai, par null False chhodते ho. Django ka design faisla ye hai ki ek string value ki anupasthiti empty string se represent hoती hai, NULL se nahi. Non-string fields ke liye jahaan koi natural empty value nahi — integers, decimals, dates, foreign keys — aap dono null equals True aur blank equals True set karते ho jab field sachmuch optional hai. Ek required field ke liye aap koi nahi set karते. Ek sookshमता: kyunki blank ek validation rule hai, ye sirf tab asar karता hai jab validation asal mein chalती hai. Ek bare instance dot save full_clean call nahi karता.',
      },
      {
        q: 'Where should data invariants live — in the view, the model\'s `clean()`, or `Meta.constraints` — and why?',
        qHi: 'Data invariants kahaan rehने chahिए — view mein, model ke `clean()` mein, ya `Meta.constraints` mein — aur kyun?',
        a: 'The principle is: enforce an invariant at the lowest layer that every write path must pass through, which is the database. A rule implemented only in a view — end date after start date, quantity positive, only one active record per user — is enforced only for requests that go through that specific view. Every other way data enters the table bypasses it: the Django admin, a management command doing a backfill, a data migration, a bulk_create call, DRF if the serializer does not repeat the check, another microservice writing to the same database, or a developer in the shell. So a view-level check is really just a nicety for producing a friendly error message on the common path, not a guarantee. Putting the rule in the model\'s clean method is a little better because clean is called by Django forms and can be called explicitly, but it still only runs when full_clean is invoked, and a plain save skips it, so it has the same fundamental weakness — it is validation-layer, not enforcement-layer. Meta dot constraints is the right place for true invariants. A UniqueConstraint or CheckConstraint is compiled into the CREATE TABLE as an actual UNIQUE or CHECK clause, and the database enforces it on every single write regardless of what code produced it. It cannot be bypassed. The practical approach is to use both: the constraint in Meta for the hard guarantee, and a matching check in the serializer or form or clean method so that the common path returns a clean 400 with a helpful message instead of surfacing a raw IntegrityError. Django can even help here — calling full_clean also runs validate_constraints, which checks the database constraints in Python ahead of the write. But the constraint is the thing that actually protects the data.',
        aHi: 'Siddhaant ye hai: ek invariant ko sabse neeche layer par enforce karो jismें se har write path guzarना chahिए, jо database hai. Ek rule jо sirf ek view mein implement hai sirf un requests ke liye enforce hoता hai jо us specific view se guzarती hain. Har doosra tarika jismें data table mein enter karता hai ise bypass karता hai: Django admin, ek backfill karता management command, ek data migration, ek bulk_create call, ek doosra microservice. Toh ek view-level check asal mein bस common path par ek friendly error message ke liye ek nicety hai, ek guarantee nahi. Rule ko model ke clean method mein daalna thodा behtar hai kyunki clean Django forms dwara call hoता hai, par ye abhi bhi sirf tab chalता hai jab full_clean invoke hoता hai. Meta dot constraints asli invariants ke liye sahi jagah hai. Ek UniqueConstraint ya CheckConstraint CREATE TABLE mein compile hoता hai, aur database ise har ek write par enforce karта hai. Vyavhaarik tarika dono istemal karna hai: hard guarantee ke liye Meta mein constraint, aur ek matching check serializer ya form mein.',
      },
    ],

    exercises: [
      {
        task: 'In a standalone Django script, define a `Ticket` model with: `title` (CharField, required), `priority` using an `IntegerChoices` enum (`LOW=1, MEDIUM=2, HIGH=3`, default `MEDIUM`), `assignee` (CharField, optional -> `blank=True`), `due_date` (DateField, optional -> `null=True, blank=True`), `created_at` (`auto_now_add`). Create the table, add a ticket with only `title`, and print its `priority`, `get_priority_display()`, `assignee` (should be `""`), and `due_date` (should be `None`).',
        taskHi: 'Ek standalone Django script mein, ek `Ticket` model define karो: `title` (required), `priority` ek `IntegerChoices` enum se (`LOW=1, MEDIUM=2, HIGH=3`, default `MEDIUM`), `assignee` (optional -> `blank=True`), `due_date` (optional -> `null=True, blank=True`), `created_at` (`auto_now_add`). Table banाओ, sirf `title` ke saath ek ticket add karो.',
        hint: '`class Priority(models.IntegerChoices): LOW = 1, "Low"; ...`. `priority = models.IntegerField(choices=Priority.choices, default=Priority.MEDIUM)`. `get_priority_display()` returns `"Medium"`. `assignee` stores `""`, `due_date` stores `None`.',
        hintHi: '`class Priority(models.IntegerChoices): LOW = 1, "Low"; ...`. `priority = models.IntegerField(choices=Priority.choices, default=Priority.MEDIUM)`. `get_priority_display()` `"Medium"` lautाता hai.',
      },
      {
        task: 'Define an `Appointment` model with `patient` (CharField), `starts_at` and `ends_at` (DateTimeField), and a `Meta.constraints` list with a `CheckConstraint` requiring `ends_at > starts_at` (use `models.F`). Create the table. Insert one valid appointment, then try to insert one where `ends_at < starts_at` and confirm it raises `IntegrityError`. Then try `starts_at == ends_at` and confirm that also fails.',
        taskHi: 'Ek `Appointment` model define karो `patient`, `starts_at` aur `ends_at`, aur ek `Meta.constraints` list ek `CheckConstraint` ke saath jо `ends_at > starts_at` require kare (`models.F` istemal karो). Table banाओ. Ek valid appointment insert karो, phir ek jahaan `ends_at < starts_at` aur confirm karो ye `IntegrityError` raise karता hai.',
        hint: '`models.CheckConstraint(condition=models.Q(ends_at__gt=models.F("starts_at")), name="ends_after_starts")`. `__gt` (strictly greater) means equal timestamps also violate it. Use `datetime.datetime(2024,1,1,10,0)` style values.',
        hintHi: '`models.CheckConstraint(condition=models.Q(ends_at__gt=models.F("starts_at")), name="ends_after_starts")`. `__gt` (strictly greater) matlab barabar timestamps bhi ise violate karते hain.',
      },
      {
        task: 'Define a `Profile` model with `username` (CharField, `unique=True`) and `email` (EmailField). Create the table and one profile. Then: (a) try to create a second profile with the same `username` and catch the `IntegrityError`; (b) build a `Profile(username="", email="not-an-email")` instance and call `full_clean()`, catching the `ValidationError` and printing which fields failed (expect `username` for blank and `email` for format).',
        taskHi: 'Ek `Profile` model define karो `username` (`unique=True`) aur `email` (EmailField) ke saath. Table aur ek profile banाओ. Phir: (a) usi `username` ke saath doosra profile banाने ki koshish karो aur `IntegrityError` catch karो; (b) ek `Profile(username="", email="not-an-email")` instance banाओ aur `full_clean()` call karो, `ValidationError` catch karके print karो kaunse fields fail hue.',
        hint: '`from django.core.exceptions import ValidationError`. `e.message_dict` is `{field: [errors]}`. `EmailField` adds an email validator that `full_clean` runs; the empty `username` fails the `blank=False` check.',
        hintHi: '`from django.core.exceptions import ValidationError`. `e.message_dict` `{field: [errors]}` hai. `EmailField` ek email validator add karता hai jise `full_clean` chalाता hai.',
      },
    ],

    keyTakeaways: [
      'A model class = a database table; each `Field` attribute = a column whose type + kwargs become the SQL column type, constraints, defaults, and validation. Every model gets an implicit `id = BigAutoField(primary_key=True)`; `.pk` aliases the primary key.',
      'Money: NEVER `FloatField` (binary drift). Use integer cents (`PositiveIntegerField`) or `DecimalField(max_digits=, decimal_places=)`. Dates: `auto_now_add=True` = set on insert only; `auto_now=True` = set on every save. Keep `USE_TZ = True`.',
      '`null` (DATABASE: column allows SQL NULL) and `blank` (VALIDATION: field may be empty in forms/serializers) are DIFFERENT layers. String fields: `blank=True` only (empty = `""`, never `NULL`). Non-string optional: `null=True, blank=True` together. Required: neither.',
      '`blank` validation runs in `full_clean()` / forms / serializers — NOT in a bare `.save()`. A required field left empty saves fine at the DB level unless there is also a NOT NULL / constraint.',
      '`TextChoices`/`IntegerChoices` give a typed enum with `.choices`, `.labels`, and a free `get_<field>_display()` method. `choices` is validation-only — the DB does not enforce it without a `CheckConstraint`.',
      'True invariants go in `Meta.constraints` (`UniqueConstraint`, `CheckConstraint`) — compiled into the table, enforced on EVERY write path (ORM, `bulk_create`, raw SQL, other services). View/`clean()` checks are bypassable niceties; use both (constraint + friendly serializer check).',
      '`Meta.indexes` for the columns you filter/order by (every index slows writes). `Meta.ordering` adds `ORDER BY` to EVERY query for the model — use sparingly; prefer explicit `.order_by()` or a manager method.',
      'Always define `__str__` (the label in admin/shell/templates). Add domain methods and `@property` computed values on the model — but a `@property` cannot be used in `.filter()` (needs an ORM annotation or stored field).',
    ],
    keyTakeawaysHi: [
      'Ek model class = ek database table; har `Field` attribute = ek column jiska type + kwargs SQL column type, constraints, defaults, aur validation ban jaते hain. Har model ko ek implicit `id = BigAutoField(primary_key=True)` milता hai; `.pk` primary key ka alias.',
      'Money: KABHI `FloatField` nahi (binary drift). Integer cents ya `DecimalField(max_digits=, decimal_places=)` istemal karो. Dates: `auto_now_add=True` = sirf insert par; `auto_now=True` = har save par. `USE_TZ = True` rakhो.',
      '`null` (DATABASE: column SQL NULL allow karता hai) aur `blank` (VALIDATION: field forms/serializers mein empty ho sakta hai) ALAG layers hain. String fields: sirf `blank=True` (empty = `""`, kabhi `NULL` nahi). Non-string optional: `null=True, blank=True` saath. Required: koi nahi.',
      '`blank` validation `full_clean()` / forms / serializers mein chalती hai — ek bare `.save()` mein NAHI. Ek required field khali chhodा DB level par theek save hoता hai jab tak ek NOT NULL / constraint na ho.',
      '`TextChoices`/`IntegerChoices` ek typed enum `.choices`, `.labels`, aur ek muft `get_<field>_display()` method ke saath deता hai. `choices` sirf validation hai — DB ise bina ek `CheckConstraint` enforce nahi karता.',
      'Asli invariants `Meta.constraints` (`UniqueConstraint`, `CheckConstraint`) mein jaते hain — table mein compiled, HAR write path par enforce (ORM, `bulk_create`, raw SQL). View/`clean()` checks bypass ho sakte hain; dono istemal karो.',
      '`Meta.indexes` un columns ke liye jinpar aap filter/order karते ho (har index writes dhीmा karता hai). `Meta.ordering` model ke liye HAR query mein `ORDER BY` add karता hai — kamdी se istemal karो.',
      'Hamesha `__str__` define karो. Model par domain methods aur `@property` computed values add karो — par ek `@property` `.filter()` mein istemal nahi ho sakta.',
    ],
  },

  {
    slug: 'dj-migrations',
    title: 'Migrations: makemigrations, migrate, and the Migration Graph',
    titleHi: 'Migrations: makemigrations, migrate, Aur Migration Graph',
    description: 'A migration is a version-controlled, ordered description of a schema change. `makemigrations` diffs your models against the last known state and writes the change as a file; `migrate` applies unapplied files in dependency order and records what it did. Understanding the graph is how you avoid a broken deploy.',
    descriptionHi: 'Ek migration ek version-controlled, ordered description hai ek schema change ka. `makemigrations` aapke models ko aakhri known state ke khilaaf diff karता hai aur change ko ek file ki tarah likhता hai; `migrate` unapplied files ko dependency order mein apply karता hai aur record karता hai. Graph samajhna aise aap ek toota deploy avoid karते ho.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A stack of numbered renovation permits for a building, each one building on the last.** You do not describe the *current* state of the building to the contractor — you hand over the permits in order: permit 0001 "erect the frame", 0002 "add the east wing", 0003 "widen the lobby doorway". Each permit lists the exact operations and names the permit it depends on. `makemigrations` is the architect comparing the latest blueprint to the sum of all issued permits and drafting a new permit for the difference. `migrate` is the contractor checking the building\'s logbook to see which permits are already done, then executing the rest in order, signing each line of the logbook as they finish. The logbook (`django_migrations` table) is the single source of truth for "where is this building right now". If two architects each draft a permit 0003 on different branches, you get a fork in the permit history that must be merged before the contractor can proceed — and if a permit\'s operations are written so they cannot be undone, there is no way to roll the building back to permit 0002.',
      hi: '**Ek building ke liye numbered renovation permits ka ek stack, har ek aakhri par banта hai.** Aap contractor ko building ki *current* state describe nahi karते — aap permits kram mein dete ho: permit 0001 "frame khadा karो", 0002 "east wing add karो", 0003 "lobby doorway chaudा karो". Har permit exact operations list karता hai aur us permit ka naam deता hai jispar wo nirbhar hai. `makemigrations` architect hai jо latest blueprint ko saare issued permits ke yog se compare karता hai aur antar ke liye ek naya permit draft karता hai. `migrate` contractor hai jо building ka logbook check karता hai ki kaunse permits pehle se ho gaye, phir baaki ko kram mein execute karता hai. Logbook (`django_migrations` table) "ye building abhi kahaan hai" ke liye single source of truth hai. Agar do architects alag branches par har ek ek permit 0003 draft karें, aapko permit history mein ek fork milता hai jise merge karna padता hai.',
    },

    simple: `**The two commands**

\`\`\`bash
python manage.py makemigrations           # detect model changes -> write migration file(s)
python manage.py makemigrations catalog    # just one app
python manage.py makemigrations --name add_sku_index catalog   # named
python manage.py makemigrations --dry-run --check   # CI: fail if models changed without a migration

python manage.py migrate                   # apply all unapplied migrations, in order
python manage.py migrate catalog           # up to the latest for one app
python manage.py migrate catalog 0003      # migrate TO a specific migration (up or DOWN)
python manage.py migrate catalog zero      # unapply ALL of catalog's migrations
\`\`\`

**A migration file**

\`\`\`python
# catalog/migrations/0002_product_sku.py
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ("catalog", "0001_initial"),        # runs AFTER this one
    ]
    operations = [
        migrations.AddField(
            model_name="product",
            name="sku",
            field=models.CharField(max_length=32, default="", db_index=True),
        ),
        migrations.AddConstraint(
            model_name="product",
            constraint=models.UniqueConstraint(fields=["sku"], name="uniq_sku"),
        ),
    ]
\`\`\`

**Inspecting**

\`\`\`bash
python manage.py showmigrations               # [X] applied, [ ] not applied, per app
python manage.py showmigrations --plan         # the full linear execution order
python manage.py sqlmigrate catalog 0002       # print the SQL a migration would run (don't apply)
\`\`\`

**The state Django tracks**

\`\`\`
django_migrations  table:  (app, name, applied_at)   -- the logbook of what has run
Django compares:
  MODEL STATE   (your models.py right now)
  MIGRATION STATE (replay every migration file's operations in order)
  DATABASE STATE  (what django_migrations says is applied)
makemigrations = diff(MODEL, MIGRATION) -> new file
migrate        = apply files not in django_migrations, update the table
\`\`\`

**Common operations**

\`\`\`
CreateModel / DeleteModel / RenameModel
AddField / RemoveField / AlterField / RenameField
AddIndex / RemoveIndex / AddConstraint / RemoveConstraint
AlterModelOptions / AlterUniqueTogether / AlterModelTable
RunPython(forward, reverse)      -- data migration (lesson 3)
RunSQL(sql, reverse_sql)         -- raw SQL
SeparateDatabaseAndState(...)    -- advanced: change state without touching the DB, or vice versa
\`\`\`

\`\`\`
NEVER edit an applied migration that teammates/prod have run -> make a NEW one.
NEVER delete migration files that are applied in any environment.
DO commit migration files -- they are code, reviewed like code.
DO run  makemigrations --check  in CI.
A branch merge with two migrations at the same number -> python manage.py makemigrations --merge
\`\`\``,

    simpleHi: `**Do commands**

\`\`\`bash
python manage.py makemigrations           # model changes detect karो -> migration file(s) likhо
python manage.py makemigrations --name add_sku_index catalog   # named
python manage.py makemigrations --dry-run --check   # CI: fail agar models bina migration ke badle

python manage.py migrate                   # saare unapplied migrations apply karो, kram mein
python manage.py migrate catalog 0003      # ek specific migration TAK (up ya DOWN)
python manage.py migrate catalog zero      # catalog ke SAARE migrations unapply karो
\`\`\`

**Ek migration file**

\`\`\`python
# catalog/migrations/0002_product_sku.py
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ("catalog", "0001_initial"),        # iske BAAD chalता hai
    ]
    operations = [
        migrations.AddField(
            model_name="product",
            name="sku",
            field=models.CharField(max_length=32, default="", db_index=True),
        ),
    ]
\`\`\`

**Inspecting**

\`\`\`bash
python manage.py showmigrations               # [X] applied, [ ] not applied, prati app
python manage.py showmigrations --plan         # poora linear execution order
python manage.py sqlmigrate catalog 0002       # SQL print karो jо ek migration chalाती (apply mat karो)
\`\`\`

**State jо Django track karता hai**

\`\`\`
django_migrations  table:  (app, name, applied_at)   -- kya chala iska logbook
Django compare karता hai:
  MODEL STATE   (aapka models.py abhi)
  MIGRATION STATE (har migration file ke operations kram mein replay karो)
  DATABASE STATE  (jо django_migrations kehta hai applied hai)
makemigrations = diff(MODEL, MIGRATION) -> nayi file
migrate        = files apply karो jо django_migrations mein nahi, table update karो
\`\`\`

**Aam operations**

\`\`\`
CreateModel / DeleteModel / RenameModel
AddField / RemoveField / AlterField / RenameField
AddIndex / RemoveIndex / AddConstraint / RemoveConstraint
RunPython(forward, reverse)      -- data migration (lesson 3)
RunSQL(sql, reverse_sql)         -- raw SQL
\`\`\`

\`\`\`
KABHI ek applied migration edit mat karो jо teammates/prod ne chalाई -> ek NAYI banाओ.
KABHI migration files delete mat karो jо kisi environment mein applied hain.
DO migration files commit karो -- wo code hain, code ki tarah reviewed.
DO CI mein  makemigrations --check  chalाओ.
Ek branch merge usi number par do migrations ke saath -> python manage.py makemigrations --merge
\`\`\``,

    content: `## What a migration is

A migration is a Python file describing a set of **operations** (create a table, add a column, add an index, run a function) plus a list of **dependencies** (which migrations must run before it). Migration files live in each app's \`migrations/\` package, are numbered (\`0001_initial\`, \`0002_...\`), and are **committed to version control** — they are as much a part of your codebase as the models.

Django tracks three notions of "state":

1. **Model state** — what your \`models.py\` files say right now.
2. **Migration state** — the schema you get by replaying every migration's operations in dependency order (Django computes this in memory as a \`ProjectState\`).
3. **Database state** — which migrations the \`django_migrations\` table records as applied.

\`makemigrations\` compares **model state** to **migration state** and writes a new file for the difference. \`migrate\` compares **migration state** to **database state** and applies (or unapplies) files to reconcile them, updating \`django_migrations\`.

## \`makemigrations\`

The **autodetector** diffs the two \`ProjectState\`s and emits operations: a new model becomes \`CreateModel\`, a new field \`AddField\`, a changed \`max_length\` \`AlterField\`, and so on. It cannot read your mind for ambiguous changes:

- **Adding a non-nullable field to a populated table**: Django prompts for a one-off default (\`makemigrations\` asks interactively; in CI you provide \`default=\` on the field or add \`null=True\` first).
- **Renaming a field or model**: the autodetector sees a remove + an add and asks "did you rename X to Y?" — answer yes to get a \`RenameField\` instead of destructive drop+add.

Flags: \`--name\` (readable filename), \`--empty\` (a blank migration to fill with \`RunPython\`/\`RunSQL\`), \`--dry-run\` (show what it would write), \`--check\` (exit non-zero if migrations are missing — the CI gate), \`--merge\` (resolve a branch conflict).

## \`migrate\`

\`migrate\` builds the **migration graph** — a DAG of every migration keyed by \`(app, name)\` with edges from dependencies — does a topological sort, and runs the ones not in \`django_migrations\`, wrapping each in a transaction where the database supports transactional DDL (Postgres yes; MySQL no — a failed MySQL migration can leave the schema half-changed).

- \`migrate\` — everything, all apps.
- \`migrate <app>\` — that app up to its latest.
- \`migrate <app> <name>\` — migrate **to** that migration: forward if it is ahead, **backward (unapply)** if it is behind. \`migrate <app> zero\` unapplies all of that app's migrations.
- \`--fake\` — mark as applied without running the SQL (for when the schema already matches, e.g. adopting an existing DB). \`--fake-initial\` — skip \`0001\` if the tables already exist.
- \`--plan\` — print the execution order without running.

## The graph and branch conflicts

Because migrations form a graph, two developers branching from \`0005\` and each adding \`0006_...\` create **two leaf nodes** — Django refuses to migrate an app with multiple leaves. Fix:

\`\`\`bash
python manage.py makemigrations --merge
# creates 0007_merge_... that depends on BOTH 0006 files, reuniting the graph
\`\`\`

Prefer to rebase and renumber if the conflict is caught early; \`--merge\` is fine for already-pushed branches.

## Rules that keep deploys safe

- **Never edit a migration that has been applied anywhere beyond your own machine.** Others have run it; changing it makes their DB state and the file disagree silently. Make a new migration instead.
- **Never delete an applied migration file** — \`migrate\` will not find its record's file and errors, or worse, tries to re-run dependents.
- **Commit migration files** and review them like code — an \`AlterField\` that rewrites a 50M-row table is a production incident waiting to happen (Module 8 covers zero-downtime schema changes: add nullable, backfill, add constraint, in separate deploys).
- **Run \`python manage.py makemigrations --check --dry-run\` in CI** so a model change without a migration fails the build.
- **\`sqlmigrate <app> <name>\`** before applying anything non-trivial in production — read the SQL, check for table rewrites and long locks.
- **Squashing**: after dozens of migrations, \`squashmigrations <app> 0001 0030\` collapses them into one for faster fresh setups; keep the originals until every environment has passed the squash point, then delete.

## Atomicity

Each migration runs in a transaction on databases with transactional DDL. \`atomic = False\` on the \`Migration\` class disables that — needed for operations Postgres cannot do inside a transaction (e.g. \`CREATE INDEX CONCURRENTLY\`, adding an enum value). Such migrations must be written so a partial failure is recoverable.`,

    contentHi: `## Ek migration kya hai

Ek migration ek Python file hai jо **operations** ka ek set describe karती hai (ek table banाओ, ek column add karो, ek function chalाओ) plus **dependencies** ki ek list (kaunsी migrations ise se pehle chalनी chahिए). Migration files har app ke \`migrations/\` package mein rehती hain, numbered hain, aur **version control ko committed** hain.

Django "state" ki teen dharaणाein track karता hai:

1. **Model state** — aapki \`models.py\` files abhi kya kehती hain.
2. **Migration state** — schema jо aap har migration ke operations kram mein replay karके paते ho.
3. **Database state** — kaunsी migrations \`django_migrations\` table applied ki tarah record karती hai.

\`makemigrations\` **model state** ko **migration state** se compare karता hai aur antar ke liye ek nayi file likhता hai. \`migrate\` **migration state** ko **database state** se compare karता hai aur unhe milाने ke liye files apply (ya unapply) karता hai.

## \`makemigrations\`

**autodetector** do \`ProjectState\`s ko diff karता hai aur operations emit karता hai. Ye ambiguous changes ke liye aapka mann nahi padh sakta:

- **Ek populated table mein ek non-nullable field add karna**: Django ek one-off default ke liye prompt karता hai.
- **Ek field ya model rename karna**: autodetector ek remove + ek add dekhता hai aur poochता hai "kya aapne X ko Y rename kiya?"

Flags: \`--name\`, \`--empty\`, \`--dry-run\`, \`--check\` (CI gate), \`--merge\`.

## \`migrate\`

\`migrate\` **migration graph** banाता hai — har migration ka ek DAG — ek topological sort karта hai, aur wo chalाता hai jо \`django_migrations\` mein nahi.

- \`migrate <app> <name>\` — us migration **TAK** migrate karो: aage agar ye aage hai, **peeche (unapply)** agar ye peeche hai. \`migrate <app> zero\` us app ke saare migrations unapply karता hai.
- \`--fake\` — bina SQL chalाye applied mark karो.
- \`--plan\` — bina chalाye execution order print karो.

## Graph aur branch conflicts

Do developers \`0005\` se branch karके aur har ek \`0006_...\` add karके **do leaf nodes** banाते hain — Django kai leaves waale ek app ko migrate karne se inkaar karता hai. Fix:

\`\`\`bash
python manage.py makemigrations --merge
\`\`\`

## Niyam jо deploys surakshit rakhते hain

- **Kabhi ek migration edit mat karो jо aapki apni machine se aage kahin applied hui hai.** Iske bजाय ek nayi migration banाओ.
- **Kabhi ek applied migration file delete mat karो.**
- **Migration files commit karो** aur unhe code ki tarah review karो — ek \`AlterField\` jо ek 50M-row table rewrite karता hai ek production incident hai.
- **CI mein \`python manage.py makemigrations --check --dry-run\` chalाओ.**
- **\`sqlmigrate <app> <name>\`** production mein kuch bhi non-trivial apply karne se pehle.
- **Squashing**: \`squashmigrations <app> 0001 0030\` unhe ek mein collapse karता hai.

## Atomicity

Har migration transactional DDL waale databases par ek transaction mein chalती hai. \`Migration\` class par \`atomic = False\` ise disable karता hai — \`CREATE INDEX CONCURRENTLY\` jaisे operations ke liye chahिए.`,

    examples: [
      {
        title: 'The autodetector: what makemigrations would generate',
        titleHi: 'autodetector: makemigrations kya generate karता',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models
from django.db.migrations.state import ProjectState
from django.db.migrations.autodetector import MigrationAutodetector
from django.db.migrations.questioner import NonInteractiveMigrationQuestioner
from django.db.migrations.graph import MigrationGraph

class Author(models.Model):
    name = models.CharField(max_length=100)
    class Meta:
        app_label = "__main__"

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    published = models.DateField(null=True)
    class Meta:
        app_label = "__main__"

# empty "before" state -> the diff is everything (an initial migration)
before = ProjectState()
after = ProjectState.from_apps(django.apps.apps)
detector = MigrationAutodetector(before, after,
                                 NonInteractiveMigrationQuestioner({"ask_initial": True}))
changes = detector.changes(graph=MigrationGraph(), trim_to_apps={"__main__"})

for app, migrations_list in changes.items():
    for migration in migrations_list:
        print(f"migration: {app}.{migration.name}")
        for op in migration.operations:
            print("  -", op.describe())`,
        output: `migration: __main__.0001_initial
  - Create model Author
  - Create model Book
`,
        explain: 'This is exactly what `python manage.py makemigrations` does internally: build a `ProjectState` from the current models (`after`), compare it to the previous state (`before`, empty here), and let the `MigrationAutodetector` emit operations. From two models it produced one `0001_initial` migration containing `CreateModel Author` then `CreateModel Book` — ordered so the FK target exists before the model that references it. In a real project this is written to `__main__/migrations/0001_initial.py` as a `Migration` class you commit. (Indexes and constraints declared in `Meta` are folded into the `CreateModel` options for an initial migration; a later `Meta.indexes` change would produce a separate `AddIndex`.)',
        explainHi: 'Ye bilkul wahi hai jо `python manage.py makemigrations` andar karता hai: current models se ek `ProjectState` banाओ (`after`), ise previous state se compare karो (`before`, yahaan empty), aur `MigrationAutodetector` ko operations emit karने do. Do models se isne ek `0001_initial` migration banाई jismें `CreateModel Author` phir `CreateModel Book` hai — order kiya taaki FK target us model se pehle maujूd ho jо ise reference karता hai. (`Meta` mein declare kiye indexes/constraints ek initial migration ke liye `CreateModel` options mein fold hote hain; ek baad ka `Meta.indexes` change ek alag `AddIndex` produce karता.)',
      },
      {
        title: 'A migration is operations + dependencies; applying it changes the schema',
        titleHi: 'Ek migration operations + dependencies hai; ise apply karna schema badalता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection, migrations
from django.db.migrations.state import ProjectState

# migration 0001: create the table
class M0001(migrations.Migration):
    initial = True
    operations = [
        migrations.CreateModel(
            name="Widget",
            fields=[
                ("id", models.BigAutoField(primary_key=True)),
                ("name", models.CharField(max_length=50)),
            ],
        ),
    ]

# migration 0002: add a column, depends on 0001
class M0002(migrations.Migration):
    dependencies = [("__main__", "0001")]
    operations = [
        migrations.AddField("widget", "price_cents",
                            models.PositiveIntegerField(default=0)),
    ]

# what the migrate command does: apply each migration's operations in graph order,
# threading the ProjectState through. Migration(name, app_label) is the constructor.
state = ProjectState()
for name, migration_cls in [("0001", M0001), ("0002", M0002)]:
    m = migration_cls(name, "__main__")
    with connection.schema_editor(atomic=m.atomic) as se:
        state = m.apply(state, se)

with connection.cursor() as cur:
    cur.execute("PRAGMA table_info('__main___widget')")
    cols = [(row[1], row[2]) for row in cur.fetchall()]
print("columns after 0001 + 0002:", cols)`,
        output: `columns after 0001 + 0002: [('id', 'INTEGER'), ('name', 'varchar(50)'), ('price_cents', 'integer unsigned')]
`,
        explain: 'A `Migration` is just a class with an `operations` list and a `dependencies` list. `M0002` declares it depends on `("__main__", "0001")`, so the graph runs `0001` (which `CreateModel`s the table) before `0002` (which `AddField`s `price_cents`). Applying both against a fresh `ProjectState` produces the final schema — the `__main___widget` table now has three columns. `python manage.py migrate` does this for every unapplied migration in topological order, then writes a row to `django_migrations` for each.',
        explainHi: 'Ek `Migration` bस ek class hai ek `operations` list aur ek `dependencies` list ke saath. `M0002` declare karта hai ki ye `("__main__", "0001")` par nirbhar hai, toh graph `0001` (jо table `CreateModel` karता hai) `0002` (jо `price_cents` `AddField` karта hai) se pehle chalाता hai. Dono ko ek fresh `ProjectState` ke khilaaf apply karne se final schema banता hai. `python manage.py migrate` har unapplied migration ke liye ye karता hai, phir har ke liye `django_migrations` mein ek row likhता hai.',
      },
      {
        title: 'The django_migrations table is the logbook',
        titleHi: 'django_migrations table logbook hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.core.management import call_command
from django.db.migrations.recorder import MigrationRecorder
from django.db import connection

# before migrate: no logbook entries
rec = MigrationRecorder(connection)
print("applied before migrate:", len(rec.applied_migrations()))

call_command("migrate", verbosity=0)

applied = rec.applied_migrations()
by_app = {}
for (app, name) in applied:
    by_app.setdefault(app, []).append(name)
print("apps with applied migrations:", sorted(by_app))
print("contenttypes migrations applied:", sorted(by_app["contenttypes"]))
print("auth 0001 recorded:", ("auth", "0001_initial") in applied)

# 'migrate --plan' shows what WOULD run (nothing now, all applied)
from io import StringIO
buf = StringIO()
call_command("migrate", plan=True, verbosity=1, stdout=buf)
print("plan after full migrate:", "no planned migration" in buf.getvalue().lower()
      or buf.getvalue().strip().endswith("Planned operations:"))`,
        output: `applied before migrate: 0
apps with applied migrations: ['auth', 'contenttypes']
contenttypes migrations applied: ['0001_initial', '0002_remove_content_type_name']
auth 0001 recorded: True
plan after full migrate: True
`,
        explain: '`MigrationRecorder` reads the `django_migrations` table — Django\'s logbook of `(app, name, applied_at)` rows. Before `migrate` it is empty; after, it lists every migration Django ran, per app, in the order it ran them. `migrate` consults this table to decide what is left to do: a migration whose `(app, name)` is already a row is skipped. This is why faking (`--fake`) works — it inserts the row without running the SQL — and why deleting a row (or the file) desynchronises Django from reality.',
        explainHi: '`MigrationRecorder` `django_migrations` table padhता hai — Django ka `(app, name, applied_at)` rows ka logbook. `migrate` se pehle ye empty hai; baad mein, ye har migration list karता hai jо Django ne chalाई. `migrate` is table se salah karता hai kya karna baaki hai: ek migration jiska `(app, name)` pehle se ek row hai skip hoती hai. Isiliye faking (`--fake`) kaam karता hai — ye bina SQL chalाye row insert karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# 0004_add_email.py has already been applied on staging and prod
# a teammate opens it and changes the field:
migrations.AddField("user", "email",
    field=models.EmailField(max_length=254, default=""))   # was max_length=100
# then re-runs makemigrations expecting a change`,
        right: `# leave 0004 alone. make a NEW migration:
# 0007_alter_user_email.py
migrations.AlterField("user", "email",
    field=models.EmailField(max_length=254))`,
        why: 'Once a migration is in \`django_migrations\` on any shared environment, other databases have executed its original operations. Editing the file makes the recorded "applied" state and the file\'s contents disagree, and Django will not re-apply an already-recorded migration — so the change silently never reaches those databases. Every schema change after the first shared apply must be a new, additive migration.',
        whyHi: 'Ek baar ek migration kisi shared environment par `django_migrations` mein hai, doosre databases ne iske original operations execute kar diye. File edit karna recorded "applied" state aur file ke contents ko disagree karवाता hai, aur Django ek pehle se recorded migration re-apply nahi karega — toh change chupchaap kabhi un databases tak nahi pahुँchता. Pehle shared apply ke baad har schema change ek nayi migration honi chahिए.',
      },
      {
        wrong: `# main branch and feature branch both branched at 0012, both added 0013
# after merge, the migrations/ folder has:
#   0013_add_tags.py       (depends on 0012)
#   0013_add_slug.py       (depends on 0012)
# python manage.py migrate  -> "Conflicting migrations detected; multiple leaf nodes"
# "fix": rename one to 0014 by hand`,
        right: `python manage.py makemigrations --merge
# generates 0014_merge_20240601.py:
#   dependencies = [("app", "0013_add_tags"), ("app", "0013_add_slug")]
#   operations = []
# both 0013s now converge; commit the merge migration`,
        why: 'Renaming \`0013_add_slug\` to \`0014_add_slug\` by hand does not add the dependency edge, so Django may still run them in an order that breaks (e.g. if one assumes a column the other adds). \`--merge\` creates an explicit merge migration that depends on both leaves, reuniting the graph into a single line and letting Django order everything correctly.',
        whyHi: '`0013_add_slug` ko haath se `0014_add_slug` rename karna dependency edge add nahi karता, toh Django abhi bhi unhe ऐसे order mein chalा sakta hai jо toot jाए. `--merge` ek explicit merge migration banाता hai jо dono leaves par nirbhar hai, graph ko ek single line mein reunite karता hai.',
      },
      {
        wrong: `# CI runs tests but never checks for missing migrations
# a dev adds  bio = models.TextField(blank=True)  to a model, forgets makemigrations
# tests pass (test DB is built from models via migrate --run-syncdb sometimes)
# deploy runs  migrate  -> nothing to do -> prod is missing the column -> 500s`,
        right: `# in CI, before tests:
python manage.py makemigrations --check --dry-run
# exits non-zero if any model change lacks a migration -> the build fails, dev adds it`,
        why: 'A model change without a corresponding migration is invisible until \`migrate\` runs in an environment and finds nothing to apply, leaving the schema behind the code. \`makemigrations --check\` makes this a build failure: it exits non-zero if the autodetector would generate anything, forcing the migration to be created and committed alongside the model change.',
        whyHi: 'Ek model change bina ek corresponding migration ke tab tak invisible hai jab tak `migrate` ek environment mein chalकर kuch apply na kare, schema ko code ke peeche chhodकर. `makemigrations --check` ise ek build failure banाता hai: ye non-zero exit karता hai agar autodetector kuch generate karega.',
      },
    ],

    realWorld: [
      {
        en: '**`python manage.py makemigrations --check --dry-run` is a mandatory CI step** alongside the test run and `check --deploy`. Combined with reviewing migration files in the PR, it stops "the deploy is green but the DB is missing a column" incidents.',
        hi: '**`python manage.py makemigrations --check --dry-run` ek anivaarya CI step hai** test run aur `check --deploy` ke saath. PR mein migration files review karne ke saath, ye "deploy green hai par DB mein ek column missing hai" incidents rokта hai.',
      },
      {
        en: '**`sqlmigrate` is used before every non-trivial production migration** — read the generated SQL, spot an `ALTER TABLE` that rewrites the whole table or takes an `ACCESS EXCLUSIVE` lock, and rework the change into safe steps (Module 8: add nullable column, backfill in batches, add `NOT NULL`/constraint, each as its own deploy).',
        hi: '**`sqlmigrate` har non-trivial production migration se pehle istemal hoता hai** — generated SQL padhо, ek `ALTER TABLE` spot karो jо poori table rewrite karता hai, aur change ko safe steps mein rework karो (Module 8).',
      },
      {
        en: '**Long-lived projects squash migrations periodically** — `squashmigrations app 0001 0089` replaces 89 files with one for fast fresh-DB setup (tests, new dev machines, CI), keeping the originals until every environment is past the squash point. The migration count in `showmigrations` on a mature Django project is often in the hundreds.',
        hi: '**Long-lived projects samay-samay par migrations squash karते hain** — `squashmigrations app 0001 0089` 89 files ko ek se replace karता hai fast fresh-DB setup ke liye, originals ko tab tak rakhते hue jab tak har environment squash point ke aage na ho.',
      },
    ],

    interviewQA: [
      {
        q: 'What does `makemigrations` actually do, and how is it different from `migrate`?',
        qHi: '`makemigrations` asal mein kya karता hai, aur ye `migrate` se kaise alag hai?',
        a: 'They operate on different pairs of states. Django conceptually tracks three: the model state, which is what your models dot py files describe right now; the migration state, which is the schema you would have if you replayed every migration file operation in dependency order; and the database state, which is what the django_migrations table records as actually applied. makemigrations compares the model state to the migration state. It builds a ProjectState from your current models, builds another by replaying the existing migrations, and runs an autodetector that diffs them and emits operations — CreateModel for a new model, AddField for a new field, AlterField for a changed field, AddIndex, and so on. It writes those operations, plus a dependency on the previous migration, into a new numbered file in the app\'s migrations folder. It changes no database; it only produces a file, which you commit like any other code. For ambiguous changes it needs input: adding a non-nullable column to a table that has rows requires a one-off default, and a rename looks identical to a drop-plus-add so it asks whether you renamed. migrate compares the migration state to the database state. It constructs the migration graph — a DAG of all migrations linked by their dependencies — topologically sorts it, and for each migration not recorded in django_migrations, executes its operations against the database, wrapping each in a transaction where the database supports transactional DDL, and then inserts a row into django_migrations. It can also go backwards: migrate app to an earlier migration name unapplies the ones in between using their reverse operations. So makemigrations is the design step that turns model changes into version-controlled change descriptions, and migrate is the execution step that brings a specific database in line with those descriptions.',
        aHi: 'Ye alag states ke jodon par kaam karते hain. Django teen track karта hai: model state, jо aapki models dot py files abhi describe karती hain; migration state, jо schema aapke paas hoता agar aap har migration file operation dependency order mein replay karें; aur database state, jо django_migrations table actually applied ki tarah record karती hai. makemigrations model state ko migration state se compare karता hai. Ye current models se ek ProjectState banाता hai, existing migrations replay karके doosra, aur ek autodetector chalाता hai jо unhe diff karता hai aur operations emit karता hai. Ye un operations ko ek nayi numbered file mein likhता hai. Ye koi database nahi badalता; ye sirf ek file banाता hai. migrate migration state ko database state se compare karता hai. Ye migration graph banाता hai, topologically sort karता hai, aur har migration jо django_migrations mein record nahi hai uske operations execute karता hai, phir ek row insert karता hai. Ye peeche bhi jа sakta hai.',
      },
      {
        q: 'Why must you never edit an already-applied migration, and how do you handle a migration conflict from a branch merge?',
        qHi: 'Aapko ek pehle se applied migration kabhi edit kyun nahi karni chahिए, aur ek branch merge se ek migration conflict kaise handle karते ho?',
        a: 'Once a migration has been applied in any environment other than your own machine — staging, production, a teammate\'s database — that database has already executed the migration\'s operations as they were written at that moment, and the django_migrations table has a row recording it as applied by name. Django decides what to run by checking whether an app-and-name pair is in that table; if it is, the migration is considered done and is never executed again. So if you edit the file afterward — change a field\'s max length, add an operation, alter a default — the databases that already ran the old version will not pick up the change, because Django sees the name is already recorded and skips it. The file and the actual schema silently diverge, and the divergence differs per environment depending on when each last migrated. Fresh databases, meanwhile, run the new version, so now you have two populations with different schemas from the same migration name. The rule is therefore: a migration is immutable once shared. Any further change is a new, additive migration — an AlterField, an AddConstraint, a data migration — that every database will run because its name is new. For branch-merge conflicts: if two branches both started from migration 0012 and each added a 0013, after merging the app has two migrations with no path between them, which Django calls multiple leaf nodes, and it refuses to migrate because the order is undefined. The fix is python manage dot py makemigrations dash dash merge, which generates a new migration — say 0014_merge — whose dependencies list names both 0013 files and whose operations list is empty. That reunites the graph into a single line so Django can order everything. You commit the merge migration like any other. If you catch the conflict before pushing, it is cleaner to rebase and renumber your migration to follow the other one, but for already-pushed branches the merge migration is the standard tool.',
        aHi: 'Ek baar ek migration kisi environment mein applied hui hai aapki apni machine ke alावा — staging, production, ek teammate ka database — us database ne migration ke operations pehle se execute kar diye jaise wo us pal likhे the, aur django_migrations table mein ek row hai. Django check karता hai ki ek app-and-name pair us table mein hai ya nahi; agar hai, migration done maani jाती hai aur phir kabhi execute nahi hoती. Toh agar aap file baad mein edit karते ho, wo databases jinhone purana version chalाya change nahi uthाyेंge, kyunki Django dekhता hai naam pehle se recorded hai aur skip karता hai. File aur asli schema chupchaap diverge karते hain. Niyam: ek migration share hone ke baad immutable hai. Koi aur change ek nayi, additive migration hai. Branch-merge conflicts ke liye: agar do branches dono 0012 se shuru hue aur har ek ne ek 0013 add kiya, merge ke baad app ke paas do migrations hain jinke beech koi path nahi — multiple leaf nodes. Fix python manage dot py makemigrations dash dash merge hai, jо ek nayi migration generate karта hai jiski dependencies dono 0013 files ko name karती hain aur operations empty hai.',
      },
    ],

    exercises: [
      {
        task: 'In a standalone script, define an `Article` model (`title = CharField(200)`, `body = TextField()`, `views = PositiveIntegerField(default=0)`). Use `ProjectState()`, `ProjectState.from_apps(...)`, `MigrationAutodetector`, and an empty `MigrationGraph()` to compute the migration the autodetector would generate, and print each operation via `op.describe()`. Confirm it is a single `0001_initial` with a `CreateModel`.',
        taskHi: 'Ek standalone script mein, ek `Article` model define karो (`title`, `body`, `views`). `ProjectState()`, `ProjectState.from_apps(...)`, `MigrationAutodetector`, aur ek empty `MigrationGraph()` istemal karके wo migration compute karो jо autodetector generate karता, aur har operation `op.describe()` se print karो.',
        hint: '`detector = MigrationAutodetector(ProjectState(), ProjectState.from_apps(django.apps.apps), NonInteractiveMigrationQuestioner({"ask_initial": True}))`. `changes = detector.changes(graph=MigrationGraph(), trim_to_apps={"__main__"})`.',
        hintHi: '`detector = MigrationAutodetector(ProjectState(), ProjectState.from_apps(django.apps.apps), NonInteractiveMigrationQuestioner({"ask_initial": True}))`. `changes = detector.changes(graph=MigrationGraph(), trim_to_apps={"__main__"})`.',
      },
      {
        task: 'Write two `migrations.Migration` subclasses: `M0001` with a `CreateModel` for `Task` (`id` BigAutoField pk, `name` CharField(100)), and `M0002` with `dependencies = [("__main__", "0001")]` and an `AddField` adding `done = models.BooleanField(default=False)`. Apply both against a fresh `ProjectState()` using `connection.schema_editor()` and `m.apply(state, se)`, then query `PRAGMA table_info` and print the column names — confirm `name` and `done` are present.',
        taskHi: 'Do `migrations.Migration` subclasses likhо: `M0001` ek `CreateModel` ke saath `Task` ke liye, aur `M0002` `dependencies = [("__main__", "0001")]` aur ek `AddField` ke saath jо `done = models.BooleanField(default=False)` add kare. Dono ko ek fresh `ProjectState()` ke khilaaf apply karो.',
        hint: '`state = ProjectState()`; `for name, cls in [...]: m = cls("__main__", name); with connection.schema_editor(atomic=m.atomic) as se: state = m.apply(state, se)`. Then `cur.execute("PRAGMA table_info(\'__main___task\')")`.',
        hintHi: '`state = ProjectState()`; `for name, cls in [...]: m = cls("__main__", name); with connection.schema_editor(atomic=m.atomic) as se: state = m.apply(state, se)`.',
      },
      {
        task: 'Configure Django with `contenttypes` and `auth`. Use `MigrationRecorder(connection).applied_migrations()` to show it is empty, then `call_command("migrate", verbosity=0)`, then show it again — print the sorted set of app labels that now have applied migrations and assert `("auth", "0001_initial")` is in the applied set.',
        taskHi: 'Django ko `contenttypes` aur `auth` ke saath configure karो. `MigrationRecorder(connection).applied_migrations()` istemal karके dikhाओ ye empty hai, phir `call_command("migrate", verbosity=0)`, phir phir se dikhाओ.',
        hint: '`from django.db.migrations.recorder import MigrationRecorder`. `applied_migrations()` returns a dict keyed by `(app, name)` tuples. `set(app for app, name in applied)` for the app labels.',
        hintHi: '`from django.db.migrations.recorder import MigrationRecorder`. `applied_migrations()` `(app, name)` tuples se keyed ek dict lautाता hai.',
      },
    ],

    keyTakeaways: [
      'A migration = a Python file with an `operations` list + a `dependencies` list, numbered per app, COMMITTED to version control and reviewed like code.',
      'Django tracks 3 states: MODEL (your `models.py` now), MIGRATION (replay all migration operations), DATABASE (`django_migrations` table rows). `makemigrations` = diff(MODEL, MIGRATION) -> new file. `migrate` = apply files not in `django_migrations`, in graph order.',
      '`makemigrations` runs the autodetector; it prompts for ambiguous changes: a one-off `default` when adding a non-nullable field to a populated table, and "did you rename?" for a field/model rename (yes -> `RenameField`, not destructive drop+add).',
      '`migrate <app> <name>` migrates TO that migration — forward if ahead, BACKWARD (unapply) if behind. `migrate <app> zero` unapplies all. `--fake` records without running SQL; `--plan` shows order without running.',
      'CI gate: `python manage.py makemigrations --check --dry-run` exits non-zero if a model change lacks a migration. Also run `sqlmigrate <app> <name>` before non-trivial prod migrations to read the actual SQL (spot table rewrites / long locks).',
      'NEVER edit a migration applied anywhere beyond your machine — Django skips already-recorded migrations, so the change silently never reaches those DBs. Make a NEW additive migration. NEVER delete an applied migration file.',
      'Branch merge with two migrations at the same number = "multiple leaf nodes" -> `python manage.py makemigrations --merge` creates a merge migration depending on both, reuniting the graph. Hand-renumbering does NOT add the dependency edge.',
      'Each migration runs in a transaction on transactional-DDL databases (Postgres yes, MySQL no). `atomic = False` for operations that can\'t run in a transaction (`CREATE INDEX CONCURRENTLY`). `squashmigrations` collapses many old migrations into one.',
    ],
    keyTakeawaysHi: [
      'Ek migration = ek Python file ek `operations` list + ek `dependencies` list ke saath, prati app numbered, version control ko COMMITTED aur code ki tarah reviewed.',
      'Django 3 states track karता hai: MODEL (aapki `models.py` abhi), MIGRATION (saare migration operations replay), DATABASE (`django_migrations` table rows). `makemigrations` = diff(MODEL, MIGRATION) -> nayi file. `migrate` = files apply jо `django_migrations` mein nahi.',
      '`makemigrations` autodetector chalाता hai; ye ambiguous changes ke liye prompt karता hai: ek one-off `default` jab ek populated table mein ek non-nullable field add karते ho, aur ek rename ke liye "did you rename?" (haan -> `RenameField`).',
      '`migrate <app> <name>` us migration TAK migrate karता hai — aage agar aage, PEECHE (unapply) agar peeche. `migrate <app> zero` sab unapply karता hai. `--fake` bina SQL chalाye record karता hai; `--plan` bina chalाye order dikhाता hai.',
      'CI gate: `python manage.py makemigrations --check --dry-run` non-zero exit karता hai agar ek model change mein migration nahi. `sqlmigrate <app> <name>` bhi non-trivial prod migrations se pehle.',
      'KABHI ek migration edit mat karो jо aapki machine se aage kahin applied hui — Django pehle se recorded migrations skip karता hai. Ek NAYI additive migration banाओ. KABHI ek applied migration file delete mat karो.',
      'Branch merge usi number par do migrations ke saath = "multiple leaf nodes" -> `python manage.py makemigrations --merge` ek merge migration banाता hai jо dono par nirbhar hai. Haath se renumber karna dependency edge NAHI add karता.',
      'Har migration transactional-DDL databases par ek transaction mein chalती hai (Postgres haan, MySQL nahi). `atomic = False` un operations ke liye jо ek transaction mein nahi chal sakte. `squashmigrations` kai purani migrations ko ek mein collapse karता hai.',
    ],
  },

  {
    slug: 'dj-data-migrations',
    title: 'Data Migrations: RunPython, Historical Models, and Reversibility',
    titleHi: 'Data Migrations: RunPython, Historical Models, Aur Reversibility',
    description: 'A schema migration changes the shape of a table; a data migration changes the rows. `RunPython` runs a function during `migrate` — but it must use the *historical* version of your models, provide a reverse, and be safe to run against a production-sized table.',
    descriptionHi: 'Ek schema migration ek table ka aakaar badalती hai; ek data migration rows badalती hai. `RunPython` `migrate` ke dauraan ek function chalाता hai — par ise aapke models ke *historical* version istemal karna chahिए, ek reverse provide karna chahिए, aur ek production-sized table ke khilaaf chalाने ke liye surakshit hona chahिए.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: '**Renovating a building versus re-filing all the paperwork already inside it.** A schema migration is construction: knock through a wall, add a doorway, widen a corridor. A data migration is sending in a crew to go through every existing folder and rewrite an entry — split "full name" into "first" and "last" on ten thousand records, or set a new "region" field based on each record\'s postcode. Two rules keep this crew from causing chaos. First, they must work from the floor plan *as it was when this permit was issued*, not today\'s plan — if a later permit removes the "full name" slot, a crew running this permit today would look for a slot that no longer exists. That is why `RunPython` hands you a frozen, historical snapshot of the models via `apps.get_model`, never your live model classes. Second, every re-filing instruction must come with its undo instruction, so the building can be rolled back to a previous permit cleanly — and on a building with ten thousand folders, the crew works one drawer at a time, not by emptying every cabinet onto the floor at once.',
      hi: '**Ek building renovate karna versus uske andar pehle se saara paperwork re-file karna.** Ek schema migration construction hai: ek deewar todो, ek doorway add karो. Ek data migration ek crew bhejna hai jо har maujूd folder se guzarे aur ek entry rewrite kare — "full name" ko "first" aur "last" mein split karो das hazaar records par. Do niyam is crew ko chaos se rokते hain. Pehla, unhe floor plan se kaam karna chahिए *jaise wo tha jab ye permit jारी hua*, aaj ke plan se nahi — agar ek baad ka permit "full name" slot hataता hai, ek crew jо ye permit aaj chalा rahi hai ek slot dhoondहेgी jо ab maujूd nahi. Isiliye `RunPython` aapko `apps.get_model` ke zariye models ka ek frozen, historical snapshot deता hai, kabhi aapke live model classes nahi. Doosra, har re-filing instruction ke saath iski undo instruction aani chahिए, aur das hazaar folders waali building par, crew ek drawer ek samay kaam karती hai.',
    },

    simple: `**An empty migration to fill with a data operation**

\`\`\`bash
python manage.py makemigrations --empty --name backfill_slugs catalog
\`\`\`

\`\`\`python
# catalog/migrations/0009_backfill_slugs.py
from django.db import migrations
from django.utils.text import slugify

def set_slugs(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")     # HISTORICAL model -- not the import
    for product in Product.objects.filter(slug=""):
        product.slug = slugify(product.name)
        product.save(update_fields=["slug"])

def clear_slugs(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")
    Product.objects.update(slug="")

class Migration(migrations.Migration):
    dependencies = [("catalog", "0008_product_slug")]
    operations = [
        migrations.RunPython(set_slugs, clear_slugs),   # forward, reverse
    ]
\`\`\`

**Why the historical model**

\`\`\`
apps.get_model("catalog", "Product")   ->  a model class reconstructed from the migration
                                           state AT THIS POINT in the graph.

- Has only the fields that exist at this migration (not fields added later).
- Has NO custom methods, NO custom manager methods, NO signals, NO @property.
- Safe: a future model change cannot break a past data migration.

from catalog.models import Product      ->  the CURRENT model. NEVER import this in a migration.
                                           It may have fields/columns the DB doesn't have yet
                                           (running forward) or no longer has (running backward).
\`\`\`

**Reversibility**

\`\`\`python
migrations.RunPython(forwards, backwards)                 # reversible
migrations.RunPython(forwards, migrations.RunPython.noop) # reverse = do nothing (data stays)
migrations.RunPython(forwards)                            # IRREVERSIBLE -- migrate backward errors
\`\`\`

**Raw SQL when the ORM is too slow / not enough**

\`\`\`python
migrations.RunSQL(
    sql="UPDATE catalog_product SET slug = lower(replace(name, ' ', '-')) WHERE slug = '';",
    reverse_sql="UPDATE catalog_product SET slug = '';",
)
\`\`\`

**Big tables: batch inside the function**

\`\`\`python
def backfill(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")
    qs = Product.objects.filter(slug="")
    while True:
        batch = list(qs[:2000])
        if not batch:
            break
        for p in batch:
            p.slug = slugify(p.name)
        Product.objects.bulk_update(batch, ["slug"])
\`\`\`

\`\`\`
RULES
  ALWAYS  apps.get_model(app, Model)   -- never  from app.models import Model
  ALWAYS  provide a reverse (or explicit  RunPython.noop  /  RunSQL with reverse_sql)
  SEPARATE schema and data into different migrations when practical
     (a schema migration + a data migration; some DBs won't see a new column mid-transaction)
  IDEMPOTENT where possible -- filter on the not-yet-done rows so a re-run is safe
  BATCH for large tables -- do not load or update millions of rows at once (Module 8)
  elidable=True  on RunPython/RunSQL  -> the operation is dropped when migrations are squashed
\`\`\``,

    simpleHi: `**Ek empty migration ek data operation se bharने ke liye**

\`\`\`bash
python manage.py makemigrations --empty --name backfill_slugs catalog
\`\`\`

\`\`\`python
# catalog/migrations/0009_backfill_slugs.py
from django.db import migrations
from django.utils.text import slugify

def set_slugs(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")     # HISTORICAL model -- import nahi
    for product in Product.objects.filter(slug=""):
        product.slug = slugify(product.name)
        product.save(update_fields=["slug"])

def clear_slugs(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")
    Product.objects.update(slug="")

class Migration(migrations.Migration):
    dependencies = [("catalog", "0008_product_slug")]
    operations = [
        migrations.RunPython(set_slugs, clear_slugs),   # forward, reverse
    ]
\`\`\`

**Historical model kyun**

\`\`\`
apps.get_model("catalog", "Product")   ->  ek model class jо migration state se
                                           GRAPH MEIN IS POINT PAR reconstruct hui.

- Sirf wo fields jо is migration par maujूd hain (baad mein jode fields nahi).
- KOI custom methods nahi, KOI custom manager methods nahi, KOI signals nahi, KOI @property nahi.
- Surakshit: ek future model change ek past data migration ko toot nahi sakta.

from catalog.models import Product      ->  CURRENT model. KABHI ek migration mein ise import mat karो.
\`\`\`

**Reversibility**

\`\`\`python
migrations.RunPython(forwards, backwards)                 # reversible
migrations.RunPython(forwards, migrations.RunPython.noop) # reverse = kuch mat karो
migrations.RunPython(forwards)                            # IRREVERSIBLE -- backward migrate error
\`\`\`

**Raw SQL jab ORM bahut dhीmा / kaafi nahi**

\`\`\`python
migrations.RunSQL(
    sql="UPDATE catalog_product SET slug = lower(replace(name, ' ', '-')) WHERE slug = '';",
    reverse_sql="UPDATE catalog_product SET slug = '';",
)
\`\`\`

**Bade tables: function ke andar batch karो**

\`\`\`python
def backfill(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")
    qs = Product.objects.filter(slug="")
    while True:
        batch = list(qs[:2000])
        if not batch:
            break
        for p in batch:
            p.slug = slugify(p.name)
        Product.objects.bulk_update(batch, ["slug"])
\`\`\`

\`\`\`
NIYAM
  HAMESHA  apps.get_model(app, Model)   -- kabhi  from app.models import Model  nahi
  HAMESHA  ek reverse provide karो (ya explicit  RunPython.noop)
  SCHEMA aur data ko alag migrations mein SEPARATE karो jab practical
  IDEMPOTENT jahaan sambhav -- not-yet-done rows par filter karो
  BADE tables ke liye BATCH karो (Module 8)
  elidable=True  RunPython/RunSQL par  -> squash hone par operation drop hoता hai
\`\`\``,

    content: `## Schema vs data migrations

Django's autodetector only generates **schema** operations — \`CreateModel\`, \`AddField\`, \`AlterField\`, index and constraint changes. When you also need to *populate* or *transform* existing rows — backfill a new column, split a field, denormalise a value, seed lookup rows, fix historically-bad data — you write a **data migration**: a normal migration file whose \`operations\` list contains a \`RunPython\` (or \`RunSQL\`).

You create the skeleton with \`makemigrations --empty --name <desc> <app>\` and fill in the function.

## \`RunPython(code, reverse_code=None, ...)\`

\`code\` is a function \`(apps, schema_editor)\`:

- **\`apps\`** is a **historical app registry** — call \`apps.get_model("app", "Model")\` to get a model class **as it existed at this point in the migration graph**. This class has exactly the fields defined by migrations up to and including this one, and **none of your custom code** — no custom \`Manager\`, no \`@property\`, no \`save()\` override, no signal handlers, no \`__str__\` you rely on. That is the point: a data migration written today must still run correctly in two years when someone rebuilds the database from scratch, even though \`Model\` has changed a dozen times since.
- **\`schema_editor\`** is the same object schema operations use; you rarely need it directly in \`RunPython\` (it is there for advanced index/column work).

**Never** do \`from myapp.models import MyModel\` at the top of a migration and use it in \`RunPython\`. When migrations replay on a fresh database, that import pulls in the *current* model, which may reference columns that do not exist yet at this migration's point (forward) or were removed (backward) — you get \`OperationalError: no such column\` or subtly wrong behaviour.

## Reversibility

\`migrate <app> <earlier>\` runs migrations backward using their reverse operations. For \`RunPython\`:

- \`RunPython(forwards, backwards)\` — fully reversible; \`backwards\` should undo what \`forwards\` did.
- \`RunPython(forwards, migrations.RunPython.noop)\` — reverse is a no-op: unapplying leaves the data as-is (fine when the forward change is additive and harmless to keep).
- \`RunPython(forwards)\` — **irreversible**; \`migrate\` backward past it raises \`IrreversibleError\`. Only acceptable for genuinely one-way transforms, and document why.

Give a reverse whenever you reasonably can — you will want to roll back a bad deploy, and CI often tests that migrations are reversible.

## Separating schema and data

A common, safe pattern for "add a column and populate it":

1. Migration A: \`AddField(... null=True)\` — the column exists, nullable.
2. Migration B: \`RunPython\` that backfills the column.
3. Migration C: \`AlterField(... null=False)\` and/or \`AddConstraint\` — now that every row has a value.

Keeping these as **separate migrations** matters: on some databases a \`RunPython\` in the same migration as the \`AddField\` runs in the same transaction and may not see the new column via the ORM; and separating them lets you deploy the steps independently for zero-downtime (Module 8). Within one \`RunPython\`, do not mix schema operations and data changes.

## \`RunSQL\`

\`\`\`python
migrations.RunSQL(
    sql=["UPDATE ...;", "CREATE INDEX ...;"],
    reverse_sql=["DROP INDEX ...;"],
    state_operations=[migrations.AddIndex(...)],   # tell Django's state what the SQL did
)
\`\`\`

Use \`RunSQL\` when a set-based \`UPDATE ... FROM\` is far faster than iterating in Python, or for database-specific DDL Django cannot express. \`state_operations\` keeps Django's in-memory model state consistent with what your raw SQL actually changed.

## Large tables

A \`RunPython\` that does \`for obj in Model.objects.all(): obj.save()\` on a 50-million-row table will:
- load 50M rows into memory (OOM),
- run 50M individual \`UPDATE\`s,
- hold the migration transaction open for hours (locks, WAL bloat),
- and lose all progress if it fails at 90%.

Batch it: iterate with slicing or \`.iterator(chunk_size=...)\`, update with \`bulk_update\`, and consider running the backfill as a **separate management command** (Module 1 lesson 6) rather than a migration for the very largest tables, so it can be paused, resumed, and monitored. Set \`atomic = False\` on the migration if you batch-commit inside it. Module 8 covers the full zero-downtime playbook.

## Squashing and \`elidable\`

When you \`squashmigrations\`, data migrations are a problem — replaying them on an already-populated database is wrong or wasteful. Mark one-time data migrations \`RunPython(code, reverse, elidable=True)\`: the squash process then **omits** them, on the assumption that any database old enough to need squashing has already run them.`,

    contentHi: `## Schema vs data migrations

Django ka autodetector sirf **schema** operations generate karता hai. Jab aapko maujूd rows *populate* ya *transform* karni ho — ek naya column backfill karो, ek field split karो, lookup rows seed karो — aap ek **data migration** likhते ho: ek normal migration file jiski \`operations\` list mein ek \`RunPython\` (ya \`RunSQL\`) hai.

Aap skeleton \`makemigrations --empty --name <desc> <app>\` se banाते ho.

## \`RunPython(code, reverse_code=None, ...)\`

\`code\` ek function hai \`(apps, schema_editor)\`:

- **\`apps\`** ek **historical app registry** hai — \`apps.get_model("app", "Model")\` call karके ek model class paओ **jaise wo migration graph mein is point par thi**. Is class mein bilkul wo fields hain jо is migration tak define hue, aur **aapka koi custom code nahi** — koi custom \`Manager\` nahi, koi \`@property\` nahi, koi \`save()\` override nahi. Yahi point hai: aaj likhi ek data migration ko do saal mein bhi sahi chalна chahिए.
- **\`schema_editor\`** wahi object hai jо schema operations istemal karते hain.

**Kabhi** ek migration ke top par \`from myapp.models import MyModel\` mat karो. Jab migrations ek fresh database par replay hoती hain, wo import *current* model laता hai, jо columns reference kar sakta hai jо is migration ke point par abhi maujूd nahi.

## Reversibility

- \`RunPython(forwards, backwards)\` — poori tarah reversible.
- \`RunPython(forwards, migrations.RunPython.noop)\` — reverse ek no-op hai.
- \`RunPython(forwards)\` — **irreversible**; iske aage backward \`migrate\` \`IrreversibleError\` raise karता hai.

Jab bhi aap uचित roop se kar sakte ho ek reverse do.

## Schema aur data separate karna

"Ek column add karो aur populate karो" ke liye ek safe pattern:

1. Migration A: \`AddField(... null=True)\`.
2. Migration B: \`RunPython\` jо column backfill kare.
3. Migration C: \`AlterField(... null=False)\` aur/ya \`AddConstraint\`.

Inhe **alag migrations** rakhna maayne rakhता hai: kuch databases par \`AddField\` ke saath usi migration mein ek \`RunPython\` usi transaction mein chalता hai aur ORM ke zariye naya column nahi dekh sakta.

## \`RunSQL\`

\`\`\`python
migrations.RunSQL(
    sql=["UPDATE ...;"],
    reverse_sql=["..."],
    state_operations=[migrations.AddIndex(...)],
)
\`\`\`

\`RunSQL\` istemal karो jab ek set-based \`UPDATE\` Python mein iterate karne se kaafi tez hai.

## Bade tables

Ek \`RunPython\` jо ek 50-million-row table par \`for obj in Model.objects.all(): obj.save()\` karता hai OOM hoगा, hours ke liye transaction hold karega, aur 90% par fail hone par sab progress khोगा.

Batch karो: slicing ya \`.iterator(chunk_size=...)\` se iterate karो, \`bulk_update\` se update karो, aur sabse bade tables ke liye backfill ko ek **alag management command** ki tarah chalाने par vichaar karो. Module 8 poora zero-downtime playbook cover karता hai.

## Squashing aur \`elidable\`

Jab aap \`squashmigrations\` karते ho, data migrations ek samasya hain. One-time data migrations ko \`RunPython(code, reverse, elidable=True)\` mark karो: squash process phir unhe **omit** karता hai.`,

    examples: [
      {
        title: 'RunPython with the historical model, forward and reverse',
        titleHi: 'Historical model ke saath RunPython, forward aur reverse',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection, migrations
from django.db.migrations.state import ProjectState

class Person(models.Model):
    full_name = models.CharField(max_length=200)
    first_name = models.CharField(max_length=100, default="")
    last_name = models.CharField(max_length=100, default="")
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Person)
Person.objects.bulk_create([
    Person(full_name="Ada Lovelace"), Person(full_name="Alan Turing"),
    Person(full_name="Grace Hopper"), Person(full_name="Katherine Johnson"),
])

# the data-migration functions -- note: apps.get_model, not the Person above
def split_names(apps, schema_editor):
    P = apps.get_model("__main__", "Person")
    for person in P.objects.all():
        parts = person.full_name.split(" ", 1)
        person.first_name = parts[0]
        person.last_name = parts[1] if len(parts) > 1 else ""
        person.save(update_fields=["first_name", "last_name"])

def unsplit_names(apps, schema_editor):
    P = apps.get_model("__main__", "Person")
    P.objects.update(first_name="", last_name="")

state = ProjectState.from_apps(django.apps.apps)
op = migrations.RunPython(split_names, unsplit_names)

with connection.schema_editor() as se:
    op.database_forwards("__main__", se, state, state)
print("after forward:")
for p in Person.objects.order_by("id"):
    print(f"  {p.full_name!r} -> first={p.first_name!r} last={p.last_name!r}")

with connection.schema_editor() as se:
    op.database_backwards("__main__", se, state, state)
print("after reverse: first/last cleared?",
      not Person.objects.exclude(first_name="").exists())`,
        output: `after forward:
  'Ada Lovelace' -> first='Ada' last='Lovelace'
  'Alan Turing' -> first='Alan' last='Turing'
  'Grace Hopper' -> first='Grace' last='Hopper'
  'Katherine Johnson' -> first='Katherine' last='Johnson'
after reverse: first/last cleared? True
`,
        explain: '`split_names` and `unsplit_names` receive `apps` and fetch `Person` via `apps.get_model("__main__", "Person")` — the historical version, not the `Person` class defined above. `op.database_forwards(...)` is what `migrate` calls when applying the migration; `op.database_backwards(...)` is what it calls when you `migrate` to an earlier point. Because a reverse was supplied, this data migration is reversible — you can roll a bad deploy back and the `first_name`/`last_name` columns are cleared.',
        explainHi: '`split_names` aur `unsplit_names` `apps` receive karते hain aur `Person` ko `apps.get_model("__main__", "Person")` ke zariye fetch karते hain — historical version, upar define kiya `Person` class nahi. `op.database_forwards(...)` wo hai jо `migrate` migration apply karते waqt call karता hai; `op.database_backwards(...)` wo hai jо ye tab call karता hai jab aap ek earlier point par `migrate` karते ho. Kyunki ek reverse diya gaya, ye data migration reversible hai.',
      },
      {
        title: 'Why apps.get_model, not a real import: the historical model has no custom code',
        titleHi: 'apps.get_model kyun, ek real import nahi: historical model mein koi custom code nahi',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.migrations.state import ProjectState

class ActiveManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(archived=False)   # hides archived rows!

class Item(models.Model):
    name = models.CharField(max_length=50)
    archived = models.BooleanField(default=False)
    objects = ActiveManager()                                  # custom default manager

    class Meta:
        app_label = "__main__"

    @property
    def shout(self):
        return self.name.upper()

with connection.schema_editor() as se:
    se.create_model(Item)
Item.objects.bulk_create([Item(name="a"), Item(name="b", archived=True), Item(name="c")])

# the CURRENT model: custom manager filters out archived rows
print("current Item.objects.count() (custom manager):", Item.objects.count())

# the HISTORICAL model inside a migration: plain manager, no @property, sees everything
historical_state = ProjectState.from_apps(django.apps.apps)
HistoricalItem = historical_state.apps.get_model("__main__", "Item")
print("historical HistoricalItem.objects.count():", HistoricalItem.objects.count())
print("historical model has 'shout' property:", hasattr(HistoricalItem, "shout"))
print("historical manager type:", type(HistoricalItem.objects).__name__)`,
        output: `current Item.objects.count() (custom manager): 2
historical HistoricalItem.objects.count(): 3
historical model has 'shout' property: False
historical manager type: Manager
`,
        explain: 'The real `Item` has an `ActiveManager` that hides archived rows, so `Item.objects.count()` is 2 (a and c). Inside a migration, `apps.get_model` returns a reconstructed `Item` with a **plain `Manager`** (no `ActiveManager`), **no `shout` property**, and no other custom code — so its `.objects.count()` sees all 3 rows. If a migration imported the real `Item`, a backfill using `Item.objects.all()` would silently skip every archived row, and any code touching `.shout` or relying on the custom manager could break as the model evolves. The historical model is deliberately stripped to just fields + a base manager.',
        explainHi: 'Asli `Item` mein ek `ActiveManager` hai jо archived rows chhupाता hai, toh `Item.objects.count()` 2 hai. Ek migration ke andar, `apps.get_model` ek reconstructed `Item` lautाता hai ek **plain `Manager`** ke saath (koi `ActiveManager` nahi), **koi `shout` property nahi** — toh iska `.objects.count()` saari 3 rows dekhता hai. Agar ek migration asli `Item` import karती, `Item.objects.all()` istemal karता ek backfill chupchaap har archived row skip karता. Historical model jaan-boojhकर sirf fields + ek base manager tak stripped hai.',
      },
      {
        title: 'Batched backfill inside a data migration',
        titleHi: 'Ek data migration ke andar batched backfill',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection, migrations
from django.db.migrations.state import ProjectState

class Event(models.Model):
    kind = models.CharField(max_length=20)
    kind_code = models.IntegerField(null=True)     # new column to backfill
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Event)
KINDS = ["click", "view", "signup", "purchase"]
Event.objects.bulk_create([Event(kind=KINDS[i % 4]) for i in range(5000)])

CODE_MAP = {"click": 1, "view": 2, "signup": 3, "purchase": 4}

def backfill_codes(apps, schema_editor):
    E = apps.get_model("__main__", "Event")
    batches = 0
    while True:
        # filter on the NOT-yet-done rows -> re-running is safe (idempotent)
        batch = list(E.objects.filter(kind_code__isnull=True)[:1000])
        if not batch:
            break
        for ev in batch:
            ev.kind_code = CODE_MAP[ev.kind]
        E.objects.bulk_update(batch, ["kind_code"])
        batches += 1
    print(f"  backfilled in {batches} batches")

state = ProjectState.from_apps(django.apps.apps)
op = migrations.RunPython(backfill_codes, migrations.RunPython.noop)
with connection.schema_editor() as se:
    op.database_forwards("__main__", se, state, state)

print("rows still null:", Event.objects.filter(kind_code__isnull=True).count())
print("sample:", list(Event.objects.values_list("kind", "kind_code")[:4]))
# running it again is a no-op (idempotent)
with connection.schema_editor() as se:
    op.database_forwards("__main__", se, state, state)`,
        output: `  backfilled in 5 batches
rows still null: 0
sample: [('click', 1), ('view', 2), ('signup', 3), ('purchase', 4)]
  backfilled in 0 batches
`,
        explain: 'The backfill loops `E.objects.filter(kind_code__isnull=True)[:1000]` — a bounded slice of only the unfinished rows — and `bulk_update`s each batch, instead of loading all 5000 (imagine 50M) at once. Filtering on `kind_code__isnull=True` makes it **idempotent**: a re-run (or a resume after a crash) processes only what is left, and running it a second time does zero batches. The reverse is `RunPython.noop` here because leaving the codes populated is harmless if the migration is rolled back.',
        explainHi: 'Backfill `E.objects.filter(kind_code__isnull=True)[:1000]` loop karता hai — sirf unfinished rows ka ek bounded slice — aur har batch `bulk_update` karता hai, saari 5000 ko ek saath load karne ke bजाย. `kind_code__isnull=True` par filter karna ise **idempotent** banाता hai: ek re-run sirf jо baaki hai process karता hai, aur ise doosri baar chalाना zero batches karता hai. Reverse yahaan `RunPython.noop` hai kyunki codes populated chhodना harmless hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# catalog/migrations/0009_backfill.py
from catalog.models import Product          # the CURRENT model

def backfill(apps, schema_editor):
    for p in Product.objects.all():          # uses today's model + today's manager
        p.category_code = CATEGORY_MAP[p.category]
        p.save()`,
        right: `from django.db import migrations

def backfill(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")   # the HISTORICAL model
    for p in Product.objects.filter(category_code__isnull=True):
        p.category_code = CATEGORY_MAP[p.category]
        p.save(update_fields=["category_code"])`,
        why: 'Importing the real model into a migration binds that migration to whatever the model looks like *now*. When migrations replay on a fresh database (a new dev machine, CI, a rebuild), the current model may have fields this migration has not added yet, or a custom manager that filters rows, or a `save()` override that touches a column added later — producing `OperationalError`, skipped rows, or wrong data. `apps.get_model` gives the model frozen at this migration\'s point, which is what a data migration must operate on.',
        whyHi: 'Ek migration mein asli model import karna us migration ko us se bind karता hai jaise model *abhi* dikhता hai. Jab migrations ek fresh database par replay hoती hain, current model mein wo fields ho sakte hain jо ye migration abhi tak nahi jodी, ya ek custom manager jо rows filter karता hai — jо `OperationalError` ya skipped rows produce karта hai. `apps.get_model` model ko is migration ke point par frozen deता hai.',
      },
      {
        wrong: `class Migration(migrations.Migration):
    operations = [
        migrations.AddField("order", "total_cents",
                            models.PositiveIntegerField(null=True)),
        migrations.RunPython(backfill_totals),        # same migration, right after AddField
        migrations.AlterField("order", "total_cents",
                              models.PositiveIntegerField()),   # make NOT NULL
    ]`,
        right: `# 0010_order_total_cents.py     -> AddField(null=True)
# 0011_backfill_order_totals.py -> RunPython(backfill_totals, noop)
# 0012_order_total_cents_notnull.py -> AlterField(null=False)
# three migrations = deployable in three steps, no in-transaction column-visibility issues`,
        why: 'Cramming add-column, backfill, and make-not-null into one migration runs them in a single transaction on databases with transactional DDL. On some setups the `RunPython` may not see the just-added column through the ORM, and if the backfill is slow the whole thing holds a long lock. Splitting into three migrations lets each be deployed and verified independently — the zero-downtime pattern (Module 8) — and keeps each migration fast and single-purpose.',
        whyHi: 'Add-column, backfill, aur make-not-null ko ek migration mein bharना unhe transactional DDL waale databases par ek single transaction mein chalाता hai. Kuch setups par `RunPython` just-added column ORM ke zariye nahi dekh sakta, aur agar backfill dhीmा hai poori cheez ek lamba lock hold karती hai. Teen migrations mein split karna har ek ko swतंत्r roop se deploy karने deता hai — zero-downtime pattern (Module 8).',
      },
      {
        wrong: `def convert_currency(apps, schema_editor):
    Price = apps.get_model("shop", "Price")
    for p in Price.objects.all():
        p.amount = p.amount * get_live_exchange_rate()   # external call, non-deterministic
        p.save()

migrations.RunPython(convert_currency)                    # no reverse -> irreversible + non-repeatable`,
        right: `# store the rate used, and provide a reverse:
def convert_currency(apps, schema_editor):
    Price = apps.get_model("shop", "Price")
    rate = Decimal("1.0847")                              # pin the rate in the migration
    Price.objects.filter(converted=False).update(
        amount=F("amount") * rate, converted=True, conversion_rate=rate)

def revert_currency(apps, schema_editor):
    Price = apps.get_model("shop", "Price")
    for p in Price.objects.filter(converted=True):
        p.amount = p.amount / p.conversion_rate
        p.converted = False
        p.save()

migrations.RunPython(convert_currency, revert_currency)`,
        why: 'A data migration that calls an external service (or `now()`, or a random source) produces different results every time it runs — so a fresh-database replay months later gives different data than production got, and there is no way to reverse it. Pin every input (the exchange rate, a cutoff date) as a literal in the migration, record what was applied on the row (`conversion_rate`, `converted`), make it idempotent (`filter(converted=False)`), and supply a reverse.',
        whyHi: 'Ek data migration jо ek external service (ya `now()`, ya ek random source) call karती hai har baar alag results produce karती hai — toh mahinon baad ek fresh-database replay production se alag data deता hai, aur ise reverse karne ka koi tarika nahi. Har input ko migration mein ek literal ki tarah pin karो, row par record karो kya apply hua, ise idempotent banाओ, aur ek reverse do.',
      },
    ],

    realWorld: [
      {
        en: '**Seeding lookup/reference tables is a data migration** — statuses, categories, country codes, permission groups, feature-flag defaults. `RunPython` with `get_or_create` on the historical model, `elidable=True` so it is dropped when migrations are squashed, and a reverse that deletes the seeded rows.',
        hi: '**Lookup/reference tables seed karna ek data migration hai** — statuses, categories, country codes, permission groups. Historical model par `get_or_create` ke saath `RunPython`, `elidable=True` taaki squash par drop ho, aur ek reverse jо seeded rows delete kare.',
      },
      {
        en: '**Field splits/merges and denormalisations ship as: schema migration -> data migration -> constraint migration**, often across two or three deploys for big tables. The data migration is batched, idempotent (`filter(new_field__isnull=True)`), and for the largest tables replaced by a management command run out-of-band with monitoring (Module 8).',
        hi: '**Field splits/merges aur denormalisations ship hote hain: schema migration -> data migration -> constraint migration**, aksar bade tables ke liye do-teen deploys mein. Data migration batched hai, idempotent, aur sabse bade tables ke liye ek management command se replace kiya jाता hai.',
      },
      {
        en: '**CI often asserts migrations are reversible** — a test that runs `migrate` forward then `migrate <app> zero` (or to a prior tag) and back, catching a `RunPython` without a reverse or a schema op that loses data. Teams also run the full migration set against a copy of production data in staging before every release.',
        hi: '**CI aksar assert karता hai ki migrations reversible hain** — ek test jо `migrate` forward phir `migrate <app> zero` chalाता hai, ek `RunPython` bina reverse ke pakadता hai. Teams har release se pehle staging mein production data ki ek copy ke khilaaf poora migration set bhi chalाते hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why must a data migration use `apps.get_model` instead of importing the model directly?',
        qHi: 'Ek data migration ko model seedhे import karne ke bजाय `apps.get_model` kyun istemal karna chahिए?',
        a: 'Because a migration file is permanent and must run correctly at any point in the future, against a database at exactly the schema state that migration represents, even though the model class keeps changing. When you write from myapp dot models import MyModel at the top of a migration, you bind that migration to whatever the model looks like at import time — which, when migrations replay on a fresh database or in CI or on a new developer machine, is the current model, potentially many versions ahead of this migration. That current model may declare fields whose columns this migration has not created yet, so a query touches a non-existent column and you get an OperationalError. It may have a custom default manager that filters out some rows — soft-deleted, archived, unpublished — so a backfill loop over objects dot all silently skips exactly the rows that most need fixing. It may have a save override, a property, or signal handlers that reference later columns or external services. apps dot get_model, given the app label and model name, returns a model class that Django reconstructs from the migration state at this specific point in the graph. That reconstructed class has exactly the fields defined by migrations up to and including this one and nothing more, a plain base Manager with no custom filtering, no properties, no overridden save, and no connected signals. It is deliberately inert — just fields and basic ORM access — which is precisely what a data migration needs so that it operates on the schema as it actually is at that moment and is not affected by how the model evolves afterward. The schema_editor argument passed alongside apps is for the rare cases where a data migration also needs to do low-level column or index work.',
        aHi: 'Kyunki ek migration file permanent hai aur bhavishya mein kisi bhi point par sahi chalनी chahिए, ek database ke khilaaf bilkul us schema state par jо wo migration represent karती hai, chahe model class badalता rahे. Jab aap ek migration ke top par from myapp dot models import MyModel likhते ho, aap us migration ko us se bind karते ho jaise model import time par dikhता hai — jо, jab migrations ek fresh database par replay hoती hain, current model hai, is migration se kai versions aage. Wo current model wo fields declare kar sakta hai jinke columns ye migration abhi tak nahi banाe, toh ek query ek non-existent column chhoती hai aur aapko OperationalError milता hai. Ismें ek custom default manager ho sakta hai jо kuch rows filter karता hai, toh ek backfill loop chupchaap wahi rows skip karता hai jinhe sabse zyada fix chahिए. apps dot get_model ek model class lautाता hai jise Django graph mein is specific point par migration state se reconstruct karता hai. Us class mein bilkul wo fields hain jо is migration tak define hue, ek plain base Manager, koi properties nahi, koi overridden save nahi.',
      },
      {
        q: 'How would you add a required column to a large table and populate it without downtime?',
        qHi: 'Aap ek bade table mein ek required column kaise add karоge aur bina downtime populate karoge?',
        a: 'You break it into separate migrations deployed in steps, so no single step takes a long lock or leaves the table inconsistent. Step one: a schema migration that adds the column as nullable with no default. On Postgres, adding a nullable column with no default is a fast metadata-only change — it does not rewrite the table or block reads and writes for long. Deploy this; the application code at this point does not use the column yet, or tolerates it being null. Step two: a data migration, or better for a very large table a separate management command, that backfills the column in batches. It iterates the rows where the column is still null, in chunks of a few thousand, computes the value, and writes each chunk with bulk_update inside its own small transaction. Batching keeps lock durations short, bounds the transaction log, and makes the job resumable — because the filter is on the column being null, re-running it only touches unfinished rows. For the largest tables you run this out of band, monitoring database load, possibly over hours, rather than blocking a deploy. Step three, once every row has a value: a schema migration that adds the NOT NULL constraint, and any check or unique constraint. On modern Postgres you can add NOT NULL by first adding a CHECK constraint as NOT VALID, validating it in a separate step which only takes a SHARE UPDATE EXCLUSIVE lock, then swapping it — Django can be told to do this, or you write the SQL in RunSQL. Throughout, the application is deployed in a compatible order: code that writes the column ships after step one, code that depends on it being non-null ships after step three. Each migration is individually fast, reversible where possible, and the table is queryable the entire time. Module 8 covers this playbook in full, including read-replica and index-concurrently considerations.',
        aHi: 'Aap ise alag migrations mein todते ho jо steps mein deploy hoती hain, taaki koi single step ek lamba lock na le ya table ko inconsistent na chhodे. Step ek: ek schema migration jо column ko nullable bina default ke add karता hai. Postgres par, ek nullable column bina default ke add karna ek tez metadata-only change hai. Ise deploy karो. Step do: ek data migration, ya ek bade table ke liye behtar ek alag management command, jо column ko batches mein backfill karता hai. Ye un rows par iterate karता hai jahaan column abhi null hai, kuch hazaar ke chunks mein, aur har chunk bulk_update se apne chhote transaction ke andar likhता hai. Batching lock durations chhote rakhता hai aur job ko resumable banाता hai. Step teen, ek baar har row ki ek value hai: ek schema migration jо NOT NULL constraint add karता hai. Poore samay, application ek compatible order mein deploy hoती hai. Har migration individually tez hai, jahaan sambhav reversible hai, aur table poore samay queryable hai.',
      },
    ],

    exercises: [
      {
        task: 'In a standalone script: `Customer` model with `email` (CharField) and `email_domain` (CharField, `default=""`). Create the table, insert 5 customers with emails like `"a@example.com"`. Write `set_domain(apps, schema_editor)` and `clear_domain(apps, schema_editor)` using `apps.get_model("__main__", "Customer")`, wrap them in `migrations.RunPython(set_domain, clear_domain)`, and apply forward with `op.database_forwards(...)`. Print each customer\'s `email_domain`, then apply `database_backwards` and confirm they are `""` again.',
        taskHi: 'Ek standalone script mein: `Customer` model `email` aur `email_domain` (`default=""`) ke saath. Table banाओ, 5 customers insert karो. `set_domain` aur `clear_domain` likhо `apps.get_model` istemal karके, unhe `migrations.RunPython(set_domain, clear_domain)` mein wrap karो, aur `op.database_forwards(...)` se forward apply karो.',
        hint: '`state = ProjectState.from_apps(django.apps.apps)`. `op.database_forwards("__main__", schema_editor, state, state)` inside a `with connection.schema_editor() as se:` block (pass `se`). Domain: `c.email.split("@")[1]`.',
        hintHi: '`state = ProjectState.from_apps(django.apps.apps)`. `op.database_forwards("__main__", se, state, state)` ek `with connection.schema_editor() as se:` block ke andar. Domain: `c.email.split("@")[1]`.',
      },
      {
        task: 'Demonstrate the historical-model difference. Define `Post` with a custom manager `PublishedManager` (filters `is_draft=False`) as `objects`, and a `@property word_count`. Insert 2 published + 1 draft post. Print `Post.objects.count()` (should be 2). Then get the historical model from `ProjectState.from_apps(...).apps.get_model("__main__", "Post")` and print its `.objects.count()` (should be 3), `hasattr(HistoricalPost, "word_count")` (False), and `type(HistoricalPost.objects).__name__` (`"Manager"`).',
        taskHi: 'Historical-model antar dikhाओ. `Post` define karो ek custom manager `PublishedManager` (`is_draft=False` filter) ke saath `objects` ki tarah, aur ek `@property word_count`. 2 published + 1 draft insert karो. `Post.objects.count()` print karो. Phir historical model lो aur iska `.objects.count()` print karो.',
        hint: '`ProjectState.from_apps(django.apps.apps).apps.get_model("__main__", "Post")`. The historical model always gets a plain `Manager` and drops `@property`/methods — only fields survive.',
        hintHi: '`ProjectState.from_apps(django.apps.apps).apps.get_model("__main__", "Post")`. Historical model hamesha ek plain `Manager` paता hai aur `@property`/methods drop karता hai.',
      },
      {
        task: 'Write a batched, idempotent backfill. `Record` model with `raw = IntegerField()` and `bucket = CharField(max_length=10, default="")`. Insert 4000 records with `raw` values 0..3999. Write `backfill(apps, schema_editor)` that loops `R.objects.filter(bucket="")[:800]`, sets `bucket` to `"low"` if `raw < 2000` else `"high"`, `bulk_update`s each batch, and counts batches. Apply it, print the batch count and remaining `bucket=""` count (0), then apply it AGAIN and confirm it does 0 batches.',
        taskHi: 'Ek batched, idempotent backfill likhо. `Record` model `raw` aur `bucket` (`default=""`) ke saath. 4000 records insert karो. `backfill` likhо jо `R.objects.filter(bucket="")[:800]` loop kare, `bucket` set kare, har batch `bulk_update` kare. Ise apply karो, phir se apply karके confirm karो ye 0 batches karता hai.',
        hint: '`while True: batch = list(R.objects.filter(bucket="")[:800]); if not batch: break; for r in batch: r.bucket = "low" if r.raw < 2000 else "high"; R.objects.bulk_update(batch, ["bucket"])`. Filtering on `bucket=""` makes the re-run a no-op.',
        hintHi: '`while True: batch = list(R.objects.filter(bucket="")[:800]); if not batch: break; ...; R.objects.bulk_update(batch, ["bucket"])`. `bucket=""` par filter re-run ko no-op banाता hai.',
      },
    ],

    keyTakeaways: [
      'A data migration changes ROWS (backfill, split/merge a field, seed lookup tables, fix bad data), not schema. Create the skeleton with `makemigrations --empty --name <desc> <app>`, fill in a `RunPython` (or `RunSQL`).',
      '`RunPython(code, reverse_code)` — `code(apps, schema_editor)`. ALWAYS get models via `apps.get_model("app", "Model")` — the HISTORICAL model reconstructed from the migration state at this point: only fields defined up to here, a plain `Manager`, NO custom manager / `@property` / `save()` override / signals.',
      'NEVER `from app.models import Model` in a migration — on a fresh-DB replay the current model may reference columns not yet added (forward) or removed (backward) -> `OperationalError` or silently skipped rows.',
      'Provide a reverse: `RunPython(fwd, bwd)` (reversible), `RunPython(fwd, RunPython.noop)` (unapply keeps data), or `RunPython(fwd)` (IRREVERSIBLE — `migrate` backward raises `IrreversibleError`). CI often tests reversibility.',
      'Separate schema and data: `AddField(null=True)` -> `RunPython` backfill -> `AlterField(null=False)`/`AddConstraint` as THREE migrations. One `RunPython` should not mix schema ops and data changes; same-migration `RunPython` may not see a just-added column via the ORM.',
      'Make backfills IDEMPOTENT — filter on the not-yet-done rows (`filter(new_field__isnull=True)`) so a re-run or crash-resume is safe. Pin every input (rates, dates) as a literal; never call external services or `now()` in a migration.',
      'Large tables: batch inside the `RunPython` (slice `[:2000]` or `.iterator()`, `bulk_update`), set `atomic = False` if you batch-commit, and for the biggest tables use a separate management command run out-of-band with monitoring instead (Module 8).',
      '`RunSQL(sql, reverse_sql, state_operations=[...])` when a set-based `UPDATE` beats Python iteration or for DB-specific DDL. Mark one-time data migrations `elidable=True` so `squashmigrations` drops them.',
    ],
    keyTakeawaysHi: [
      'Ek data migration ROWS badalती hai (backfill, ek field split/merge, lookup tables seed, bad data fix), schema nahi. Skeleton `makemigrations --empty --name <desc> <app>` se banाओ, ek `RunPython` (ya `RunSQL`) bharो.',
      '`RunPython(code, reverse_code)` — `code(apps, schema_editor)`. HAMESHA models `apps.get_model("app", "Model")` ke zariye lो — HISTORICAL model jо is point par migration state se reconstruct hui: sirf yahaan tak define fields, ek plain `Manager`, KOI custom manager / `@property` / `save()` override / signals nahi.',
      'KABHI ek migration mein `from app.models import Model` nahi — ek fresh-DB replay par current model wo columns reference kar sakta hai jо abhi tak nahi jode -> `OperationalError` ya chupchaap skipped rows.',
      'Ek reverse do: `RunPython(fwd, bwd)` (reversible), `RunPython(fwd, RunPython.noop)` (unapply data rakhता hai), ya `RunPython(fwd)` (IRREVERSIBLE). CI aksar reversibility test karта hai.',
      'Schema aur data separate karो: `AddField(null=True)` -> `RunPython` backfill -> `AlterField(null=False)` TEEN migrations ki tarah. Ek `RunPython` schema ops aur data changes mix nahi karे.',
      'Backfills ko IDEMPOTENT banाओ — not-yet-done rows par filter karो (`filter(new_field__isnull=True)`). Har input ko ek literal ki tarah pin karो; ek migration mein kabhi external services ya `now()` call mat karो.',
      'Bade tables: `RunPython` ke andar batch karो (`[:2000]` slice ya `.iterator()`, `bulk_update`), `atomic = False` set karो agar batch-commit karते ho, aur sabse bade tables ke liye ek alag management command istemal karो (Module 8).',
      '`RunSQL(sql, reverse_sql, state_operations=[...])` jab ek set-based `UPDATE` Python iteration ko harाता hai. One-time data migrations ko `elidable=True` mark karो taaki `squashmigrations` unhe drop kare.',
    ],
  },
];
