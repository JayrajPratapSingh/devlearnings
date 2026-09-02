/**
 * Django Complete Course — Module 2: Models & the ORM, lessons 4-6.
 *
 * Lesson 4: relationships — ForeignKey + on_delete, related_name, ManyToManyField
 *           + through, OneToOneField, self-referential FK, the _id column.
 * Lesson 5: model inheritance & managers — abstract base classes, multi-table
 *           inheritance, proxy models, custom Manager + QuerySet, from_queryset.
 * Lesson 6: model methods, validation & the save lifecycle — @property vs field,
 *           save() override + update_fields, full_clean/clean/validators,
 *           validation does NOT run on save() by default.
 *
 * NOTE for future editors: same conventions as course-django-module2.ts.
 *  - Every backtick inside simple/simpleHi/content/contentHi is `\``.
 *  - `$` before `{` in template literals -> `\${`.
 *  - `examples` use `code` + `output`, ASCII-only output, run with `python`.
 *  - Boot standalone Django; models get `class Meta: app_label = "__main__"`;
 *    tables via `connection.schema_editor()`. Query counts via CaptureQueriesContext.
 *  - Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_2_PART2: CourseLesson[] = [
  {
    slug: 'dj-relationships',
    title: 'Relationships: ForeignKey, on_delete, related_name, ManyToMany',
    titleHi: 'Relationships: ForeignKey, on_delete, related_name, ManyToMany',
    description: 'A `ForeignKey` is a column plus a Python descriptor plus a reverse accessor plus a database constraint plus an `on_delete` rule. Get `on_delete` and `related_name` right and traversing your data in either direction is one attribute access; get them wrong and you delete a customer\'s entire order history by removing one row.',
    descriptionHi: 'Ek `ForeignKey` ek column plus ek Python descriptor plus ek reverse accessor plus ek database constraint plus ek `on_delete` rule hai. `on_delete` aur `related_name` sahi karो aur apne data ko kisi bhi disha mein traverse karna ek attribute access hai; galat karो aur aap ek customer ki poori order history delete kar dete ho ek row hataकर.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**Numbered coat-check tickets between a cloakroom and a coat rack.** A `ForeignKey` on \`Order\` pointing at \`Customer\` is the ticket stapled to each order: it holds the customer\'s number (\`customer_id\`, a real column), and from an order you can walk straight to the customer by following it (\`order.customer\`). The cloakroom attendant can also work the other way — "show me every coat belonging to number 45" — which is the *reverse* accessor (\`customer.orders.all()\`), and \`related_name="orders"\` is what you write on the ticket so the attendant knows to call that pile "orders" rather than the default "order_set". The critical rule is what happens when a customer closes their account: \`on_delete\` is the standing instruction. \`CASCADE\` means "shred every order too" — sometimes right (a comment when its post is deleted), catastrophic when wrong (an invoice). \`PROTECT\` means "refuse to close the account while orders exist". \`SET_NULL\` means "keep the orders, just blank the customer number". Choosing this per relationship is one of the highest-stakes decisions in a schema.',
      hi: '**Ek cloakroom aur ek coat rack ke beech numbered coat-check tickets.** `Order` par ek `ForeignKey` jо `Customer` ki taraf ishaara karता hai wo ticket hai jо har order se stapled hai: ismें customer ka number hai (`customer_id`, ek asli column), aur ek order se aap ise follow karके seedhे customer tak chal sakte ho (`order.customer`). Attendant ulti taraf bhi kaam kar sakta hai — "number 45 ke saare coats dikhाओ" — jо *reverse* accessor hai (`customer.orders.all()`), aur `related_name="orders"` wo hai jо aap ticket par likhते ho. Mahatvapoorn niyam ye hai ki kya hoता hai jab ek customer apna account band karता hai: `on_delete` standing instruction hai. `CASCADE` matlab "har order bhi shred karो" — kabhi sahi, galat hone par vinaashkaari. `PROTECT` matlab "orders maujूd hote hue account band karne se inkaar karो". `SET_NULL` matlab "orders rakhо, bस customer number blank karो".',
    },

    simple: `**The three relationship fields**

\`\`\`python
class Author(models.Model):
    name = models.CharField(max_length=100)

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    #        many books -> one author.  DB column: author_id

class Profile(models.Model):
    author = models.OneToOneField(Author, on_delete=models.CASCADE, related_name="profile")
    #        exactly one profile per author.  DB column: author_id  (with a UNIQUE constraint)

class Tag(models.Model):
    name = models.CharField(max_length=50)

class Article(models.Model):
    tags = models.ManyToManyField(Tag, related_name="articles", blank=True)
    #      many articles <-> many tags.  Creates a hidden join table: article_tags(article_id, tag_id)
\`\`\`

**Traversing in both directions**

\`\`\`python
book.author                 # -> the Author instance  (one query, or cached)
book.author_id              # -> the raw id, NO query  (use this to avoid a query!)

author.books.all()          # -> QuerySet of that author's Books  (related_name)
author.books.filter(...)    # the reverse accessor is a full manager
author.book_set.all()       # the DEFAULT reverse name if you omit related_name

article.tags.all()          # -> QuerySet of Tags
tag.articles.all()          # -> QuerySet of Articles  (reverse)
article.tags.add(tag1, tag2)     # .add() .remove() .set([...]) .clear()
\`\`\`

**\`on_delete\` — what happens to THIS row when the target is deleted**

\`\`\`
CASCADE       delete this row too                (comment when its post goes)
PROTECT       raise ProtectedError, block the delete   (invoice referencing a customer)
RESTRICT      like PROTECT but allows the delete if another cascade path also removes it
SET_NULL      set the FK column to NULL          (needs null=True) -- keep the row, lose the link
SET_DEFAULT   set the FK to its default          (needs a default)
SET(value)    set the FK to a fixed value / callable   (e.g. a "deleted user" placeholder)
DO_NOTHING    do nothing -- you must handle the DB integrity yourself (rare)
\`\`\`

**\`ManyToManyField\` with a \`through\` model (when the link has its own data)**

\`\`\`python
class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    grade = models.CharField(max_length=2, blank=True)

class Course(models.Model):
    students = models.ManyToManyField(Student, through="Enrollment", related_name="courses")
# now:  course.students.all()  works,  but you .add() via Enrollment.objects.create(...)
\`\`\`

**Self-referential and string references**

\`\`\`python
class Employee(models.Model):
    manager = models.ForeignKey("self", null=True, on_delete=models.SET_NULL,
                                related_name="reports")

class Comment(models.Model):
    post = models.ForeignKey("blog.Post", on_delete=models.CASCADE)   # string avoids import order issues
\`\`\`

\`\`\`
FK column is  <name>_id.  Always have a value for  <name>_id  before you need <name> (no query).
related_name=  sets the reverse accessor. related_query_name= sets the name used in filters.
    Book.objects.filter(author__name="Ada")     # forward, via the FK
    Author.objects.filter(books__title__icontains="django")   # reverse, via related_query_name
db_index defaults to True on ForeignKey. on_delete is REQUIRED (no default).
\`\`\``,

    simpleHi: `**Teen relationship fields**

\`\`\`python
class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    #        kai books -> ek author.  DB column: author_id

class Profile(models.Model):
    author = models.OneToOneField(Author, on_delete=models.CASCADE, related_name="profile")
    #        prati author bilkul ek profile.

class Article(models.Model):
    tags = models.ManyToManyField(Tag, related_name="articles", blank=True)
    #      kai articles <-> kai tags.  Ek hidden join table banाता hai.
\`\`\`

**Dono dishaओं mein traverse karna**

\`\`\`python
book.author                 # -> Author instance  (ek query, ya cached)
book.author_id              # -> raw id, KOI query NAHI  (query avoid karne ko ise istemal karो!)

author.books.all()          # -> us author ke Books ka QuerySet  (related_name)
author.book_set.all()       # DEFAULT reverse name agar aap related_name chhodते ho

article.tags.all()          # -> Tags ka QuerySet
tag.articles.all()          # -> Articles ka QuerySet  (reverse)
article.tags.add(tag1, tag2)     # .add() .remove() .set([...]) .clear()
\`\`\`

**\`on_delete\` — IS row ka kya hoता hai jab target delete hoता hai**

\`\`\`
CASCADE       ye row bhi delete karो
PROTECT       ProtectedError raise karो, delete block karो   (ek customer reference karta invoice)
RESTRICT      PROTECT jaisा par delete allow karता hai agar doosra cascade path bhi ise hataता hai
SET_NULL      FK column ko NULL set karो          (null=True chahिए)
SET_DEFAULT   FK ko iske default set karो          (ek default chahिए)
SET(value)    FK ko ek fixed value / callable set karो
DO_NOTHING    kuch mat karो -- aapko DB integrity khud handle karni hai (rare)
\`\`\`

**\`ManyToManyField\` ek \`through\` model ke saath (jab link ka apna data ho)**

\`\`\`python
class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    grade = models.CharField(max_length=2, blank=True)

class Course(models.Model):
    students = models.ManyToManyField(Student, through="Enrollment", related_name="courses")
# ab:  course.students.all()  kaam karता hai,  par aap Enrollment.objects.create(...) se .add() karте ho
\`\`\`

**Self-referential aur string references**

\`\`\`python
class Employee(models.Model):
    manager = models.ForeignKey("self", null=True, on_delete=models.SET_NULL,
                                related_name="reports")

class Comment(models.Model):
    post = models.ForeignKey("blog.Post", on_delete=models.CASCADE)   # string import order issues avoid karता hai
\`\`\`

\`\`\`
FK column  <name>_id  hai.  Query se bachने ke liye  <name>_id  istemal karो.
related_name=  reverse accessor set karता hai. related_query_name= filters mein naam.
    Book.objects.filter(author__name="Ada")     # forward
    Author.objects.filter(books__title__icontains="django")   # reverse
FK par db_index default True. on_delete REQUIRED hai (koi default nahi).
\`\`\``,

    content: `## \`ForeignKey\` — the anatomy

\`author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")\` on \`Book\` creates:

1. **A database column** \`author_id\` (integer/bigint) with a foreign-key constraint to \`author(id)\`, indexed by default.
2. **A forward descriptor** \`book.author\` that, on first access, runs \`SELECT * FROM author WHERE id = %s\` and caches the result on the instance. \`book.author_id\` gives you the raw id with **no query** — use it whenever you only need the id.
3. **A reverse accessor** on \`Author\`: \`author.books\` (a manager) because of \`related_name="books"\`. Without \`related_name\` it defaults to \`<model>_set\`, here \`author.book_set\`.
4. **Query traversal**: \`Book.objects.filter(author__name="Ada")\` (forward, spanning the FK) and \`Author.objects.filter(books__title="X")\` (reverse, using \`related_query_name\`, which defaults to \`related_name\`).

\`on_delete\` is a **required** argument — there is no default, deliberately, because the choice is consequential.

## \`on_delete\` in detail

When the **referenced** row (an \`Author\`) is deleted, \`on_delete\` decides the fate of rows that point at it (\`Book\`s):

| Value | Effect | Use when |
|---|---|---|
| \`CASCADE\` | delete the dependent rows too | the child has no meaning without the parent (comment/post, order-line/order) |
| \`PROTECT\` | raise \`ProtectedError\`, abort the delete | the reference is a record you must not lose (invoice -> customer, payment -> account) |
| \`RESTRICT\` | like \`PROTECT\`, but permits the delete if a *different* relation also cascades the same object | fine-grained control in complex graphs |
| \`SET_NULL\` | set the FK column to \`NULL\` (requires \`null=True\`) | keep the child, the link is optional (article -> author who left) |
| \`SET_DEFAULT\` | set the FK to the field's \`default\` (requires one) | there is a sensible fallback parent |
| \`SET(value_or_callable)\` | set the FK to a fixed value | e.g. reassign to a "[deleted]" placeholder user |
| \`DO_NOTHING\` | Django does nothing; the DB constraint decides (usually errors) | you manage integrity via DB triggers/rules yourself |

**\`CASCADE\` is not a safe default.** It is right for genuinely owned children and disastrous for anything you would want to keep as a historical record. Choose per relationship; a schema review should scrutinise every \`on_delete\`.

Cascades run in the ORM by default (Django fetches and deletes the dependent objects, firing signals), which can be slow for large fan-out; \`DO_NOTHING\` + a DB-level \`ON DELETE CASCADE\` pushes it to the database but skips signals.

## \`OneToOneField\`

A \`ForeignKey\` with a \`UNIQUE\` constraint on the column. \`profile.author\` is one \`Author\`; \`author.profile\` is one \`Profile\` (not a manager — a single object, raising \`Profile.DoesNotExist\` if absent). Used to attach optional/heavy data to a model without widening its table, and for "extend the User model" patterns (though a custom user model is usually better — Module 6).

## \`ManyToManyField\`

\`article.tags\` where \`Article.tags = ManyToManyField(Tag)\` creates a hidden **join table** \`app_article_tags(id, article_id, tag_id)\` with a unique constraint on the pair. Both sides get a manager: \`article.tags\` and (with \`related_name="articles"\`) \`tag.articles\`.

Mutation methods on the manager: \`.add(obj, ...)\`, \`.remove(obj, ...)\`, \`.set([objs])\` (replace all), \`.clear()\`. \`.add()\` on a plain M2M is idempotent. Adding an M2M relation itself never triggers a \`save()\` on either model.

### \`through\` — a custom join model

When the *relationship* has attributes (when enrolled, the grade, the role), define the join model explicitly:

\`\`\`python
class Membership(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    role = models.CharField(max_length=20)
    joined = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = [["person", "group"]]

class Group(models.Model):
    members = models.ManyToManyField(Person, through="Membership", related_name="groups")
\`\`\`

With \`through\`, the M2M manager's \`.add()\`/\`.set()\` can only use field defaults (or a \`through_defaults=\` dict) for the extra columns, so whenever the join data matters you create \`Membership\` rows directly. \`group.members.all()\` still works for reading.

## Self-referential and lazy references

- \`ForeignKey("self", ...)\` for hierarchies (employee -> manager, category -> parent). Give it \`null=True\` and \`on_delete=SET_NULL\` or \`PROTECT\` so deleting a manager does not wipe the org chart.
- \`ForeignKey("app_label.ModelName", ...)\` — a **string** reference — avoids circular imports and lets you reference a model defined later in the file or in another app. \`"self"\` is the special case for the same model.

## The \`_id\` column is your friend

Every FK stores \`<name>_id\`. \`obj.related\` may trigger a query; \`obj.related_id\` never does. When you build a response that only needs \`author_id\`, or you filter \`Book.objects.filter(author_id=5)\`, or you set \`book.author_id = 5\` before saving, you avoid a wasted \`SELECT\`. This matters a lot for the N+1 problem (Module 3).`,

    contentHi: `## \`ForeignKey\` — anatomy

\`Book\` par \`author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")\` banाता hai:

1. **Ek database column** \`author_id\` ek foreign-key constraint ke saath, default roop se indexed.
2. **Ek forward descriptor** \`book.author\` jо, pehle access par, \`SELECT * FROM author WHERE id = %s\` chalाता hai aur result instance par cache karता hai. \`book.author_id\` aapko raw id **bina query** deता hai.
3. **Ek reverse accessor** \`Author\` par: \`author.books\` (\`related_name="books"\` ke kaaran). \`related_name\` ke bina ye \`<model>_set\` default hoता hai.
4. **Query traversal**: \`Book.objects.filter(author__name="Ada")\` (forward) aur \`Author.objects.filter(books__title="X")\` (reverse).

\`on_delete\` ek **required** argument hai — koi default nahi.

## \`on_delete\` detail mein

Jab **referenced** row (ek \`Author\`) delete hoती hai, \`on_delete\` un rows ka bhagya tay karता hai jо ispar point karती hain:

| Value | Effect | Istemal jab |
|---|---|---|
| \`CASCADE\` | dependent rows bhi delete | child ka parent ke bina koi matlab nahi |
| \`PROTECT\` | \`ProtectedError\` raise, delete abort | reference ek record hai jise aap kho nahi sakte (invoice -> customer) |
| \`SET_NULL\` | FK column NULL set (\`null=True\` chahिए) | child rakhо, link optional |
| \`SET_DEFAULT\` | FK ko field ke \`default\` set | ek समझदार fallback parent hai |
| \`SET(value)\` | FK ko ek fixed value set | ek "[deleted]" placeholder user |
| \`DO_NOTHING\` | Django kuch nahi karता; DB constraint tay karता hai | aap integrity khud manage karते ho |

**\`CASCADE\` ek safe default nahi hai.** Ye genuinely owned children ke liye sahi hai aur kisi bhi cheez ke liye vinaashkaari jise aap ek historical record ki tarah rakhना chahोge.

## \`OneToOneField\`

Column par ek \`UNIQUE\` constraint waala ek \`ForeignKey\`. \`author.profile\` ek object hai (ek manager nahi — ek single object, \`Profile.DoesNotExist\` raise karता hai agar absent).

## \`ManyToManyField\`

\`article.tags\` ek hidden **join table** \`app_article_tags(id, article_id, tag_id)\` banाता hai. Dono taraf ek manager paते hain.

Mutation methods: \`.add(obj, ...)\`, \`.remove(obj, ...)\`, \`.set([objs])\`, \`.clear()\`. Ek M2B relation add karna kabhi kisi model par \`save()\` trigger nahi karता.

### \`through\` — ek custom join model

Jab *relationship* ke attributes hon (kab enrolled, grade, role), join model explicitly define karो:

\`\`\`python
class Membership(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    role = models.CharField(max_length=20)

class Group(models.Model):
    members = models.ManyToManyField(Person, through="Membership", related_name="groups")
\`\`\`

\`through\` ke saath, M2M manager ka \`.add()\`/\`.set()\` extra columns ke liye sirf field defaults (ya ek \`through_defaults=\` dict) istemal kar sakta hai, toh jab bhi join data maayne rakhता hai aap \`Membership\` rows seedhे banाते ho.

## Self-referential aur lazy references

- \`ForeignKey("self", ...)\` hierarchies ke liye. Ise \`null=True\` aur \`on_delete=SET_NULL\` do.
- \`ForeignKey("app_label.ModelName", ...)\` — ek **string** reference — circular imports avoid karता hai.

## \`_id\` column aapka dost hai

Har FK \`<name>_id\` store karता hai. \`obj.related\` ek query trigger kar sakta hai; \`obj.related_id\` kabhi nahi. Ye N+1 problem ke liye bahut maayne rakhता hai (Module 3).`,

    examples: [
      {
        title: 'ForeignKey: the column, the forward access, the reverse accessor',
        titleHi: 'ForeignKey: column, forward access, reverse accessor',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.test.utils import CaptureQueriesContext

class Author(models.Model):
    name = models.CharField(max_length=100)
    class Meta:
        app_label = "__main__"

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Author)
    se.create_model(Book)

ada = Author.objects.create(name="Ada")
Book.objects.create(title="Notes on the Analytical Engine", author=ada)
Book.objects.create(title="On Computability", author=ada)

book = Book.objects.get(title="On Computability")

# .author_id is a real column -> NO query
with CaptureQueriesContext(connection) as ctx:
    print("author_id (no query):", book.author_id)
print("  queries:", len(ctx.captured_queries))

# .author is a descriptor -> ONE query, then cached
with CaptureQueriesContext(connection) as ctx:
    print("author.name:", book.author.name)
    print("author.name again (cached):", book.author.name)
print("  queries:", len(ctx.captured_queries))

# the reverse accessor (related_name) is a full manager
print("ada's books:", list(ada.books.values_list("title", flat=True)))
print("filter forward via FK:", Book.objects.filter(author__name="Ada").count())
print("filter reverse via FK:",
      Author.objects.filter(books__title__icontains="computability").count())`,
        output: `author_id (no query): 1
  queries: 0
author.name: Ada
author.name again (cached): Ada
  queries: 1
ada's books: ['Notes on the Analytical Engine', 'On Computability']
filter forward via FK: 2
filter reverse via FK: 1
`,
        explain: '`book.author_id` reads the actual `author_id` column already loaded on the instance — zero queries. `book.author` is a descriptor: the first access runs one `SELECT` for the `Author` row and caches it, so the second access is free. `ada.books` exists because of `related_name="books"` and is a manager — `.values_list`, `.filter`, etc. all work on it. Filtering spans the FK in both directions: `author__name` (forward) and `books__title` (reverse). Preferring `book.author_id` over `book.author` when you only need the id is the core habit for avoiding N+1 (Module 3).',
        explainHi: '`book.author_id` instance par pehle se loaded actual `author_id` column padhता hai — zero queries. `book.author` ek descriptor hai: pehla access `Author` row ke liye ek `SELECT` chalाता hai aur cache karता hai. `ada.books` `related_name="books"` ke kaaran maujूd hai aur ek manager hai. Filtering FK ko dono dishaओं mein span karता hai. Jab aapko sirf id chahिए `book.author_id` ko `book.author` par prefer karna N+1 avoid karne ki core aadat hai.',
      },
      {
        title: 'on_delete: CASCADE vs PROTECT vs SET_NULL',
        titleHi: 'on_delete: CASCADE vs PROTECT vs SET_NULL',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import ProtectedError

class Customer(models.Model):
    name = models.CharField(max_length=100)
    class Meta:
        app_label = "__main__"

class Comment(models.Model):        # owned by the customer -> CASCADE
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    class Meta:
        app_label = "__main__"

class Invoice(models.Model):        # a record you must keep -> PROTECT
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    amount_cents = models.PositiveIntegerField()
    class Meta:
        app_label = "__main__"

class Review(models.Model):         # keep it, blank the author -> SET_NULL
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)
    stars = models.PositiveSmallIntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    for m in (Customer, Comment, Invoice, Review):
        se.create_model(m)

c = Customer.objects.create(name="Bo")
Comment.objects.create(customer=c, text="nice")
Review.objects.create(customer=c, stars=5)

# PROTECT blocks the delete while an invoice exists
inv = Invoice.objects.create(customer=c, amount_cents=1000)
try:
    c.delete()
except ProtectedError:
    print("delete blocked by PROTECT (invoice exists)")

inv.delete()   # remove the protecting row
c.delete()     # now allowed
print("comments after customer delete (CASCADE):", Comment.objects.count())
print("reviews after customer delete (SET_NULL):", Review.objects.count())
print("review.customer_id is now:", Review.objects.get().customer_id)`,
        output: `delete blocked by PROTECT (invoice exists)
comments after customer delete (CASCADE): 0
reviews after customer delete (SET_NULL): 1
review.customer_id is now: None
`,
        explain: 'Three relationships to the same `Customer`, three `on_delete` rules. While an `Invoice` (`PROTECT`) references `Bo`, `c.delete()` raises `ProtectedError` — you cannot lose invoices by deleting a customer. Once the invoice is gone, deleting `Bo` cascades the `Comment` (gone) but only nulls the `Review`\'s `customer_id` (the review row and its star rating survive). Picking the right rule per relationship is a schema-design decision with real consequences — `CASCADE` everywhere would have destroyed the invoice and the review.',
        explainHi: 'Usi `Customer` ke teen relationships, teen `on_delete` rules. Jabki ek `Invoice` (`PROTECT`) `Bo` ko reference karता hai, `c.delete()` `ProtectedError` raise karता hai — aap ek customer delete karके invoices nahi kho sakte. Invoice jaने ke baad, `Bo` delete karna `Comment` cascade karता hai (gaya) par sirf `Review` ka `customer_id` null karता hai. Har relationship ke liye sahi rule chunna asli parinaम waala ek schema-design faisla hai.',
      },
      {
        title: 'ManyToMany with a through model carrying its own data',
        titleHi: 'ManyToMany ek through model ke saath jо apna data le jाता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection

class Student(models.Model):
    name = models.CharField(max_length=100)
    class Meta:
        app_label = "__main__"

class Course(models.Model):
    title = models.CharField(max_length=100)
    students = models.ManyToManyField(Student, through="Enrollment", related_name="courses")
    class Meta:
        app_label = "__main__"

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    grade = models.CharField(max_length=2, blank=True)
    class Meta:
        app_label = "__main__"
        unique_together = [["student", "course"]]

with connection.schema_editor() as se:
    for m in (Student, Course, Enrollment):
        se.create_model(m)

ada = Student.objects.create(name="Ada")
bo = Student.objects.create(name="Bo")
algo = Course.objects.create(title="Algorithms")

# with a through model you create the link rows directly so they carry 'grade'
Enrollment.objects.create(student=ada, course=algo, grade="A")
Enrollment.objects.create(student=bo, course=algo, grade="B")

# reading the M2M still works normally
print("students in Algorithms:", list(algo.students.values_list("name", flat=True)))
print("Ada's courses:", list(ada.courses.values_list("title", flat=True)))

# .add() works on a through M2M (modern Django) but CANNOT set 'grade' --
# it would use the field default (""), so for real data you create Enrollment rows.
cy = Student.objects.create(name="Cy")
algo.students.add(cy)                       # links Cy, grade defaults to ""
print("Cy's enrollment grade:", repr(Enrollment.objects.get(student=cy).grade))
print("A-grade enrollments:", Enrollment.objects.filter(grade="A").count())`,
        output: `students in Algorithms: ['Ada', 'Bo']
Ada's courses: ['Algorithms']
Cy's enrollment grade: ''
A-grade enrollments: 1
`,
        explain: 'When the relationship itself has data — here a `grade` per enrollment — you define the join model (`Enrollment`) explicitly and point the `ManyToManyField` at it with `through="Enrollment"`. Reading works exactly as a plain M2M (`algo.students`, `ada.courses`). Modern Django lets `.add()` create the link too, but it can only use field defaults for the extra columns (`grade` becomes `""`), so whenever the join data matters you create `Enrollment` rows directly — or pass `through_defaults={"grade": "A"}` to `.add()`. The `unique_together` on the through model enforces "one enrollment per student per course".',
        explainHi: 'Jab relationship ke khud data ho — yahaan prati enrollment ek `grade` — aap join model (`Enrollment`) explicitly define karते ho aur `ManyToManyField` ko `through="Enrollment"` se ispar point karते ho. Reading bilkul ek plain M2M ki tarah kaam karता hai. Modern Django `.add()` ko link banाने deता hai, par ye extra columns ke liye sirf field defaults istemal kar sakta hai (`grade` `""` ban jाता hai), toh jab bhi join data maayne rakhता hai aap `Enrollment` rows seedhे banाते ho — ya `.add()` ko `through_defaults={"grade": "A"}` pass karते ho.',
      },
    ],

    mistakes: [
      {
        wrong: `class Payment(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)   # blindly CASCADE
    amount_cents = models.PositiveIntegerField()
# deleting one Account silently deletes its entire payment history`,
        right: `class Payment(models.Model):
    account = models.ForeignKey(Account, on_delete=models.PROTECT)    # or SET_NULL, or a "closed" state
    amount_cents = models.PositiveIntegerField()
# now Account.delete() raises ProtectedError while payments exist -- you must decide explicitly`,
        why: '`on_delete` has no default precisely so you cannot skip the decision. `CASCADE` is only correct when the child genuinely cannot exist without the parent (a comment, an order line). For anything that is a financial record, an audit trail, or history a user or regulator might need, `CASCADE` turns a routine "delete this account" into silent data loss. Use `PROTECT` (block it), `SET_NULL` (keep the row), or model deletion as a status change rather than a real `DELETE`.',
        whyHi: '`on_delete` ka koi default nahi bilkul isliye taaki aap faisla skip na kar sakो. `CASCADE` sirf tab sahi hai jab child genuinely parent ke bina maujूd nahi ho sakta. Kisi bhi cheez ke liye jо ek financial record ya audit trail hai, `CASCADE` ek routine "ye account delete karो" ko silent data loss mein badalता hai. `PROTECT`, `SET_NULL`, ya deletion ko ek status change ki tarah model karो.',
      },
      {
        wrong: `for book in Book.objects.all():
    print(book.author.name)          # one SELECT per book -> N+1
    # 1000 books -> 1001 queries`,
        right: `for book in Book.objects.select_related("author"):
    print(book.author.name)          # one JOIN -> 1 query total
# or, if you only need the id:
for book in Book.objects.all():
    print(book.author_id)            # 0 extra queries -- the column is already loaded`,
        why: 'Accessing \`book.author\` when the related object was not loaded triggers a per-row \`SELECT\`. Over a queryset that is the classic N+1 explosion. \`select_related("author")\` adds a SQL JOIN so every author comes back in the initial query; and if you only need \`author_id\`, read the column directly and issue no extra query at all. Module 3 is dedicated to this.',
        whyHi: 'Jab related object load nahi hua tab \`book.author\` access karna prati-row ek \`SELECT\` trigger karता hai. Ek queryset par ye classic N+1 explosion hai. \`select_related("author")\` ek SQL JOIN add karता hai; aur agar aapko sirf \`author_id\` chahिए, column seedhे padhो.',
      },
      {
        wrong: `class Category(models.Model):
    name = models.CharField(max_length=50)

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    # no related_name -> reverse accessor is product_set

class Deal(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    # also no related_name -> ALSO wants category.product_set? no -> deal_set, but confusing
# category.product_set / category.deal_set  -- inconsistent, unreadable`,
        right: `class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")

class Deal(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="deals")
# category.products.all()  /  category.deals.all()  -- explicit and consistent`,
        why: 'The default reverse name \`<model>_set\` is fine for a quick prototype but becomes noise in real code, and it forces readers to remember which model each \`_set\` belongs to. Always set \`related_name\` to a clear plural (\`products\`, \`comments\`, \`orders\`). If a model has two FKs to the same target, you *must* set distinct \`related_name\`s or Django raises a system-check error about clashing accessors.',
        whyHi: 'Default reverse name \`<model>_set\` ek quick prototype ke liye theek hai par asli code mein noise ban jाता hai. Hamesha \`related_name\` ko ek spasht plural set karो. Agar ek model ke usi target par do FKs hain, aapko alag \`related_name\`s set karne *hi* honge warna Django clashing accessors ke baare mein ek system-check error raise karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every schema review scrutinises `on_delete`** — `CASCADE` only on genuinely owned children (line items, comments, tokens), `PROTECT` on anything referencing money or identity, `SET_NULL` on optional attributions. Some teams ban bare `on_delete=CASCADE` in review and require a one-line comment justifying each choice.',
        hi: '**Har schema review `on_delete` ko scrutinise karta hai** — `CASCADE` sirf genuinely owned children par, `PROTECT` money ya identity reference karne waali kisi cheez par, `SET_NULL` optional attributions par. Kuch teams review mein bare `on_delete=CASCADE` ban karती hain.',
      },
      {
        en: '**`through` models are everywhere the link has data** — `Membership(role, joined_at)`, `OrderItem(quantity, unit_price)`, `Subscription(plan, started_at, canceled_at)`, `Like(created_at)`. The moment a "join" needs a timestamp or an attribute, it becomes a first-class model with its own FKs rather than an implicit M2M table.',
        hi: '**`through` models har jagah hain jahaan link ka data ho** — `Membership(role, joined_at)`, `OrderItem(quantity, unit_price)`, `Subscription(plan, started_at)`. Jis pal ek "join" ko ek timestamp ya attribute chahिए, ye ek first-class model ban jाता hai.',
      },
      {
        en: '**`obj.related_id` vs `obj.related` is a routine optimisation** — serializers that output `{"author": author_id}` read `book.author_id`; permission checks compare `obj.owner_id == request.user.id`; filters use `Model.objects.filter(fk_id__in=[...])`. Every avoided descriptor access is a query not made (Module 3).',
        hi: '**`obj.related_id` vs `obj.related` ek routine optimisation hai** — serializers jо `{"author": author_id}` output karते hain `book.author_id` padhते hain; permission checks `obj.owner_id == request.user.id` compare karते hain. Har avoided descriptor access ek query hai jо nahi ki gayी.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain `on_delete` and walk through when you would use `CASCADE`, `PROTECT`, and `SET_NULL`.',
        qHi: '`on_delete` samjhाओ aur bataओ aap `CASCADE`, `PROTECT`, aur `SET_NULL` kab istemal karोge.',
        a: 'on_delete is a required argument on every ForeignKey and OneToOneField that tells Django what to do to the rows containing that foreign key when the row they point at is deleted. It is required with no default deliberately, because the choice has real consequences and Django does not want you to skip thinking about it. CASCADE means when the referenced object is deleted, delete the objects that point at it too, recursively. It is correct only when the child has no independent meaning — a comment cannot exist without its post, an order line cannot exist without its order, a session token cannot exist without its user. For those, cascading is exactly the cleanup you want. PROTECT means Django refuses the delete: attempting to delete the referenced object raises a ProtectedError and the whole delete is aborted while any protected row still references it. You use this for anything you must not lose as a side effect of deleting something else — an invoice referencing a customer, a payment referencing an account, a shipment referencing an order. The delete is only allowed once the protecting rows are dealt with explicitly, which forces a deliberate decision. SET_NULL means keep the child row but set its foreign key column to NULL; it requires null equals True on the field. You use it when the relationship is an attribution that is nice to have but not essential — an article whose author left the company, a ticket whose assignee was deactivated. The article and ticket remain, they just no longer point at anyone. There are also SET_DEFAULT and SET of a value or callable for reassigning to a fallback or a placeholder like a deleted-user account, RESTRICT which is a more nuanced PROTECT, and DO_NOTHING which leaves integrity entirely to database-level rules. The practical guidance: default to PROTECT or SET_NULL for anything valuable, reserve CASCADE for genuinely owned children, and treat every on_delete as a decision to review, not a box to fill with CASCADE.',
        aHi: 'on_delete har ForeignKey aur OneToOneField par ek required argument hai jо Django ko bataता hai ki us foreign key waali rows ka kya karna hai jab wo row jispar wo point karती hain delete hoती hai. Ye bina default ke required hai jaan-boojhकर. CASCADE matlab jab referenced object delete hoता hai, ispar point karne waali objects ko bhi delete karो, recursively. Ye sirf tab sahi hai jab child ka koi swतंत्r matlab nahi — ek comment apne post ke bina maujूd nahi ho sakta. PROTECT matlab Django delete se inkaar karta hai: referenced object delete karne ki koshish ek ProtectedError raise karती hai. Aap ise kisi bhi cheez ke liye istemal karते ho jise aap kisi aur cheez ko delete karne ke side effect ki tarah kho nahi sakte — ek customer reference karta invoice. SET_NULL matlab child row rakhо par iski foreign key column NULL set karो. Aap ise tab istemal karते ho jab relationship ek attribution hai jо achha hai par zaroori nahi. Vyavhaarik salah: kisi bhi valuable cheez ke liye PROTECT ya SET_NULL default karो, CASCADE ko genuinely owned children ke liye reserve karो.',
      },
      {
        q: 'What is the difference between `obj.author` and `obj.author_id`, and why does it matter for performance?',
        qHi: '`obj.author` aur `obj.author_id` mein kya antar hai, aur ye performance ke liye kyun maayne rakhता hai?',
        a: 'When a model has a ForeignKey named author, Django stores the actual value in a database column called author_id — the integer primary key of the related row — and that column is loaded as an ordinary attribute whenever you fetch the object. So obj dot author_id is just reading an integer that is already in memory; it never touches the database. obj dot author, on the other hand, is a descriptor: it represents the related Author object, not its id. The first time you access it, if the related object has not already been loaded — for example by select_related — Django runs a SELECT against the author table for that id and caches the resulting instance on obj, so subsequent accesses in the same request are free. The performance implication is about avoiding queries you do not need. If you are building a response that only needs to output the author id, or you are doing a permission check like comparing obj dot owner_id to request dot user dot id, or you are filtering a queryset with author_id in some list, using the underscore-id form means zero extra queries because you are reading a loaded column. Reaching for obj dot author in those cases triggers a full SELECT for an object you were going to throw away after reading one field. This compounds in loops: iterating a thousand comments and accessing comment dot author dot id on each is a thousand-and-one queries, the classic N-plus-one, whereas comment dot author_id is one query for the whole loop. The rule of thumb is: if you only need the identifier, read the underscore-id attribute; only touch the descriptor when you actually need fields from the related object, and when you do need it across a queryset, prefetch it with select_related so it is one join instead of N selects.',
        aHi: 'Jab ek model mein author naam ka ek ForeignKey hai, Django asli value ko author_id naam ke ek database column mein store karता hai — related row ka integer primary key — aur wo column ek saadharan attribute ki tarah load hoता hai jab bhi aap object fetch karते ho. Toh obj dot author_id bस ek integer padhna hai jо pehle se memory mein hai; ye kabhi database ko nahi chhoता. obj dot author, doosri taraf, ek descriptor hai: ye related Author object represent karता hai. Pehli baar jab aap ise access karते ho, agar related object pehle se load nahi hua, Django us id ke liye author table ke khilaaf ek SELECT chalाता hai aur result instance ko obj par cache karता hai. Performance implication un queries se bachne ke baare mein hai jinki aapko zaroorat nahi. Agar aap ek response bana rahe ho jise sirf author id output karni hai, underscore-id form istemal karna zero extra queries matlab hai. Ye loops mein compound hoता hai: ek hazaar comments iterate karna aur har ek par comment dot author dot id access karna ek-hazaar-ek queries hai.',
      },
    ],

    exercises: [
      {
        task: 'Model `Blog`, `Post` (FK to `Blog`, `related_name="posts"`, `on_delete=CASCADE`), `Comment` (FK to `Post`, `related_name="comments"`, `on_delete=CASCADE`). Create a blog, 2 posts, 3 comments. Print `blog.posts.count()`, `post.comments.count()`, and `Comment.objects.filter(post__blog=blog).count()`. Then delete the blog and confirm all posts and comments are gone (count 0 each).',
        taskHi: '`Blog`, `Post` (FK `Blog` ko, `related_name="posts"`), `Comment` (FK `Post` ko, `related_name="comments"`) model karो. Ek blog, 2 posts, 3 comments banाओ. `blog.posts.count()`, `post.comments.count()`, aur `Comment.objects.filter(post__blog=blog).count()` print karो. Phir blog delete karके confirm karो sab gaya.',
        hint: '`Comment.objects.filter(post__blog=blog)` spans two FKs. Deleting the `Blog` cascades to `Post` (its FK) which cascades to `Comment` (its FK) — one `blog.delete()` clears the whole tree.',
        hintHi: '`Comment.objects.filter(post__blog=blog)` do FKs span karता hai. `Blog` delete karna `Post` cascade karता hai jо `Comment` cascade karता hai.',
      },
      {
        task: 'Model `Account` and `Ledger` with `Ledger.account = ForeignKey(Account, on_delete=models.PROTECT)`. Create an account and a ledger entry. Try `account.delete()` and catch `ProtectedError`, printing a message. Then delete the ledger entry, delete the account successfully, and print the final `Account.objects.count()` (0).',
        taskHi: '`Account` aur `Ledger` model karो `Ledger.account = ForeignKey(Account, on_delete=models.PROTECT)` ke saath. Ek account aur ek ledger entry banाओ. `account.delete()` try karके `ProtectedError` catch karो. Phir ledger entry delete karके, account safalтापूrvak delete karो.',
        hint: '`from django.db.models import ProtectedError`. `PROTECT` aborts the entire delete transaction if any protected row references the target. Remove the `Ledger` row first, then `account.delete()` succeeds.',
        hintHi: '`from django.db.models import ProtectedError`. `PROTECT` poore delete transaction ko abort karता hai. Pehle `Ledger` row hataओ.',
      },
      {
        task: 'Model a many-to-many with a `through`: `Person`, `Project`, and `Assignment(person FK, project FK, role CharField, unique_together person+project)`. `Project.people = ManyToManyField(Person, through="Assignment", related_name="projects")`. Create 2 people, 1 project, 2 assignments with roles "lead"/"dev". Print `project.people.count()`, each person\'s `projects.count()`, and confirm `project.people.add(person)` raises `AttributeError`. Query `Assignment.objects.filter(role="lead").count()`.',
        taskHi: 'Ek `through` ke saath many-to-many model karो: `Person`, `Project`, `Assignment(person FK, project FK, role, unique_together)`. `Project.people = ManyToManyField(Person, through="Assignment", ...)`. 2 people, 1 project, 2 assignments banाओ. `project.people.count()` print karो, confirm karो `.add()` `AttributeError` raise karता hai.',
        hint: 'With `through`, create `Assignment.objects.create(person=..., project=..., role="lead")` directly. `project.people.all()` reads fine but `project.people.add(...)` is disabled. `Assignment.objects.filter(role="lead")`.',
        hintHi: '`through` ke saath, `Assignment.objects.create(person=..., project=..., role="lead")` seedhे banाओ. `project.people.add(...)` disabled hai.',
      },
    ],

    keyTakeaways: [
      '`ForeignKey(Target, on_delete=..., related_name=...)` creates: a `<name>_id` column (indexed, FK-constrained), a forward descriptor `obj.name` (one cached `SELECT`), a reverse manager `target.<related_name>`, and both-direction filter traversal (`Model.objects.filter(fk__field=)` / `Target.objects.filter(<related_query_name>__field=)`).',
      '`obj.name_id` reads a loaded column = ZERO queries. `obj.name` is a descriptor = one `SELECT` (then cached). Use `name_id` whenever you only need the id — this is core to avoiding N+1 (Module 3).',
      '`on_delete` is REQUIRED (no default). `CASCADE` = delete dependents (only for genuinely owned children); `PROTECT` = raise `ProtectedError`, block the delete (money/identity/history); `SET_NULL` = null the FK, keep the row (needs `null=True`); also `SET_DEFAULT`, `SET(val)`, `RESTRICT`, `DO_NOTHING`. `CASCADE` is NOT a safe default.',
      '`OneToOneField` = `ForeignKey` + `UNIQUE`. The reverse side is a single object (`author.profile`), raising `Profile.DoesNotExist` if absent — not a manager.',
      '`ManyToManyField` creates a hidden join table. Managers on both sides; mutate with `.add()`/`.remove()`/`.set([...])`/`.clear()`. Adding an M2M relation never triggers `save()` on either model.',
      'Use a `through="JoinModel"` when the relationship has its own attributes (role, quantity, joined_at). The M2M manager\'s `.add()`/`.set()` can only default the extra columns (or take `through_defaults=`) — create join rows directly when the data matters. Reading (`x.related.all()`) still works.',
      '`related_name` should be a clear plural (`products`, not the default `product_set`). Two FKs to the same target REQUIRE distinct `related_name`s or Django raises a system-check clash error.',
      'Self-reference: `ForeignKey("self", null=True, on_delete=SET_NULL, ...)` for hierarchies. String refs `ForeignKey("app.Model", ...)` avoid circular imports and forward-declaration issues.',
    ],
    keyTakeawaysHi: [
      '`ForeignKey(Target, on_delete=..., related_name=...)` banाता hai: ek `<name>_id` column (indexed, FK-constrained), ek forward descriptor `obj.name` (ek cached `SELECT`), ek reverse manager `target.<related_name>`, aur dono-disha filter traversal.',
      '`obj.name_id` ek loaded column padhता hai = ZERO queries. `obj.name` ek descriptor hai = ek `SELECT` (phir cached). Jab aapko sirf id chahिए `name_id` istemal karो — ye N+1 avoid karne ka core hai (Module 3).',
      '`on_delete` REQUIRED hai (koi default nahi). `CASCADE` = dependents delete (sirf genuinely owned children ke liye); `PROTECT` = `ProtectedError` raise, delete block (money/identity/history); `SET_NULL` = FK null, row rakhो. `CASCADE` ek safe default NAHI hai.',
      '`OneToOneField` = `ForeignKey` + `UNIQUE`. Reverse side ek single object hai (`author.profile`), absent hone par `Profile.DoesNotExist` raise karта hai — ek manager nahi.',
      '`ManyToManyField` ek hidden join table banाता hai. Dono taraf managers; `.add()`/`.remove()`/`.set([...])`/`.clear()` se mutate karो. Ek M2M relation add karna kabhi `save()` trigger nahi karता.',
      'Ek `through="JoinModel"` istemal karो jab relationship ke apne attributes hon. M2M manager ka `.add()`/`.set()` extra columns ko sirf default kar sakta hai (ya `through_defaults=` leता hai) — jab data maayne rakhता hai join rows seedhे banाओ.',
      '`related_name` ek spasht plural hona chahिए (`products`, default `product_set` nahi). Usi target par do FKs ko alag `related_name`s CHAHIYE warna Django ek system-check clash error raise karता hai.',
      'Self-reference: hierarchies ke liye `ForeignKey("self", null=True, on_delete=SET_NULL, ...)`. String refs `ForeignKey("app.Model", ...)` circular imports avoid karते hain.',
    ],
  },

  {
    slug: 'dj-model-inheritance-and-managers',
    title: 'Model Inheritance & Custom Managers',
    titleHi: 'Model Inheritance Aur Custom Managers',
    description: 'Abstract base classes share fields and methods without a table; proxy models change behaviour without new columns; multi-table inheritance adds a hidden join you usually do not want. Custom managers and querysets are where you put `Article.objects.published()` so it is written once and reused everywhere.',
    descriptionHi: 'Abstract base classes fields aur methods share karते hain bina ek table ke; proxy models behaviour badalते hain bina naye columns ke; multi-table inheritance ek hidden join add karता hai jо aap aksar nahi chahते. Custom managers aur querysets wahaan hain jahaan aap `Article.objects.published()` rakhते ho taaki ye ek baar likha jाए aur har jagah reuse ho.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**Three ways to reuse a blueprint, and a house rule about the filing clerk.** An *abstract base class* is a set of standard rooms you paste into every house plan — a hallway, a utility closet, a "created/updated" plaque — before the house is ever built; there is no "abstract house", only the standard rooms appearing in each real house. A *proxy model* is the same physical house with a different sign on the door and a different set of standard operating procedures for the staff — same rooms, same address, but "the VIP entrance" behaves differently from "the service entrance". *Multi-table inheritance* is building a small annexe wired to the main house by a permanent covered walkway: every trip between them crosses the walkway (a JOIN), which is why you rarely want it. And the *manager* is the filing clerk who fetches records: the default clerk brings you everything, but you can train a clerk who, when you say "the active accounts", already knows to exclude the closed ones — and you write that instruction once, on the clerk, not in every department that asks.',
      hi: '**Ek blueprint reuse karne ke teen tarike, aur filing clerk ke baare mein ek house rule.** Ek *abstract base class* standard rooms ka ek set hai jise aap har house plan mein paste karते ho — ek hallway, ek "created/updated" plaque — house banने se pehle; koi "abstract house" nahi hai. Ek *proxy model* wahi bhautik house hai door par ek alag sign aur staff ke liye alag operating procedures ke saath. *Multi-table inheritance* ek chhota annexe banाna hai jо main house se ek permanent covered walkway se juda hai: unke beech har trip walkway paar karती hai (ek JOIN). Aur *manager* filing clerk hai jо records fetch karता hai: default clerk aapko sab kuch laता hai, par aap ek clerk train kar sakte ho jо, jab aap kehते ho "active accounts", pehle se jaanता hai ki closed ones ko exclude karna hai — aur aap wo instruction ek baar likhते ho, clerk par.',
    },

    simple: `**Abstract base class — share fields/methods, NO table for the base**

\`\`\`python
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True                 # <-- no table; fields are copied into children

    def touch(self):
        self.save(update_fields=["updated_at"])

class Article(TimeStampedModel):        # gets created_at, updated_at, touch()
    title = models.CharField(max_length=200)

class Comment(TimeStampedModel):        # also gets them -- as its OWN columns
    body = models.TextField()
\`\`\`

**Proxy model — change behaviour/Meta only, SAME table**

\`\`\`python
class Order(models.Model):
    status = models.CharField(max_length=20)
    total_cents = models.PositiveIntegerField()

class PaidOrder(Order):
    class Meta:
        proxy = True                    # <-- no new table; a different "view" of Order
        ordering = ["-total_cents"]

    objects = PaidOrderManager()         # a manager that filters status="paid"

    def refund(self): ...                # extra method
# PaidOrder.objects.all()  -> only paid orders, sorted by total.  Same rows as Order.
\`\`\`

**Multi-table inheritance — new table + hidden OneToOne JOIN (usually avoid)**

\`\`\`python
class Place(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)

class Restaurant(Place):               # NOT abstract -> its own table
    cuisine = models.CharField(max_length=50)
# Restaurant row lives in TWO tables; restaurant.name is a JOIN to place
\`\`\`

**Custom manager + queryset — put query logic in one place**

\`\`\`python
class ArticleQuerySet(models.QuerySet):
    def published(self):
        return self.filter(status="published", published_at__lte=timezone.now())
    def by_author(self, user):
        return self.filter(author=user)

class Article(models.Model):
    status = models.CharField(max_length=20)
    published_at = models.DateTimeField(null=True)

    objects = ArticleQuerySet.as_manager()      # manager built from the queryset

# now these CHAIN, because published()/by_author() return QuerySets:
Article.objects.published().by_author(request.user).order_by("-published_at")
\`\`\`

\`\`\`
abstract = True   base has NO table; fields COPIED into each child (child owns the columns)
proxy = True      NO new table; same rows as the parent; only Meta + methods + managers differ
(default)         MULTI-TABLE: child gets its own table + an implicit OneToOne to the parent -> JOINs

Manager   the entry point (Model.objects). Override get_queryset() to change the base set (careful!)
QuerySet  chainable. Custom methods return  self.filter(...)  so they compose.
  QuerySet.as_manager()          -> a manager exposing the queryset's methods
  Manager.from_queryset(QS)()    -> same, when you also want manager-only methods
  Model has  _default_manager  (the first one) and  _base_manager  (unfiltered, used internally)
\`\`\``,

    simpleHi: `**Abstract base class — fields/methods share, base ka KOI table nahi**

\`\`\`python
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True                 # <-- koi table nahi; fields children mein copy hote hain

    def touch(self):
        self.save(update_fields=["updated_at"])

class Article(TimeStampedModel):        # created_at, updated_at, touch() paता hai
    title = models.CharField(max_length=200)
\`\`\`

**Proxy model — sirf behaviour/Meta badalो, WAHI table**

\`\`\`python
class Order(models.Model):
    status = models.CharField(max_length=20)
    total_cents = models.PositiveIntegerField()

class PaidOrder(Order):
    class Meta:
        proxy = True                    # <-- koi naya table nahi; Order ka ek alag "view"
        ordering = ["-total_cents"]

    objects = PaidOrderManager()         # ek manager jо status="paid" filter karता hai
\`\`\`

**Multi-table inheritance — naya table + hidden OneToOne JOIN (aksar avoid)**

\`\`\`python
class Place(models.Model):
    name = models.CharField(max_length=100)

class Restaurant(Place):               # abstract NAHI -> apna table
    cuisine = models.CharField(max_length=50)
# Restaurant row DO tables mein rehता hai; restaurant.name ek JOIN hai
\`\`\`

**Custom manager + queryset — query logic ek jagah**

\`\`\`python
class ArticleQuerySet(models.QuerySet):
    def published(self):
        return self.filter(status="published", published_at__lte=timezone.now())
    def by_author(self, user):
        return self.filter(author=user)

class Article(models.Model):
    objects = ArticleQuerySet.as_manager()

# ab ye CHAIN karते hain:
Article.objects.published().by_author(request.user).order_by("-published_at")
\`\`\`

\`\`\`
abstract = True   base ka KOI table nahi; fields har child mein COPY hote hain
proxy = True      KOI naya table nahi; parent jaisी hi rows; sirf Meta + methods + managers alag
(default)         MULTI-TABLE: child ko apna table + parent ka ek implicit OneToOne -> JOINs

Manager   entry point (Model.objects). get_queryset() override karके base set badalो (careful!)
QuerySet  chainable. Custom methods  self.filter(...)  return karते hain toh wo compose karते hain.
  QuerySet.as_manager()          -> ek manager jо queryset ke methods expose karता hai
  Manager.from_queryset(QS)()    -> wahi, jab aapko manager-only methods bhi chahिए
\`\`\``,

    content: `## Abstract base classes — the common case

An abstract model (\`Meta.abstract = True\`) is **not** a database table. Its fields and methods are **copied into** every concrete model that inherits it. This is the right tool for shared columns and behaviour: timestamps, a soft-delete flag, an \`owner\` FK, common \`__str__\` logic, a \`slug\` + auto-slugify.

\`\`\`python
class OwnedModel(models.Model):
    owner = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

class Document(OwnedModel):
    title = models.CharField(max_length=200)
    # Document's table has: id, owner_id, created_at, title  -- all its own columns
\`\`\`

Each child owns its columns; there is no shared table and no JOIN. You can override an inherited field in a child, and you can inherit \`Meta\` (Django merges it, but you often re-declare with \`class Meta(OwnedModel.Meta): ...\`).

## Proxy models — a different lens on the same table

A proxy (\`Meta.proxy = True\`) inherits from a concrete model, adds **no fields**, and shares the parent's table and rows exactly. What it can change: \`Meta.ordering\`, \`Meta.verbose_name\`, custom methods, and — most usefully — a custom **default manager** that filters or annotates.

\`\`\`python
class Task(models.Model):
    status = models.CharField(max_length=20, default="open")

class OpenTask(Task):
    class Meta:
        proxy = True
    objects = OpenTaskManager()          # get_queryset filters status="open"

OpenTask.objects.count()                 # only open tasks -- but they ARE Task rows
OpenTask.objects.get(pk=5).status = "done"; ...   # same row as Task.objects.get(pk=5)
\`\`\`

Use proxies to give a subset of rows its own name, admin registration, manager, and methods without denormalising or adding a table.

## Multi-table inheritance — the one to be wary of

If you inherit from a concrete model **without** \`abstract\` or \`proxy\`, Django creates a **new table for the child** and an automatic \`OneToOneField\` (the parent link) joining it to the parent's table. \`restaurant.name\` (a \`Place\` field) is fetched with a JOIN; saving a \`Restaurant\` writes two rows; querying \`Place.objects.all()\` returns \`Place\` instances even for rows that are really \`Restaurant\`s (you have to check \`hasattr(place, "restaurant")\`).

It is occasionally the right model (a true "is-a" where you frequently query the base type across all subtypes), but the JOIN-on-every-access cost and the query awkwardness mean most teams reach for composition (a \`OneToOneField\` you control) or a single table with nullable subtype columns instead.

## Managers and querysets

**\`Model.objects\` is a \`Manager\`.** It is the gateway to queries; \`Manager.get_queryset()\` returns the base \`QuerySet\` for that model. **A \`QuerySet\` is lazy and chainable** — \`.filter()\`, \`.exclude()\`, \`.annotate()\` each return a new \`QuerySet\`.

To add reusable query logic, define a **custom \`QuerySet\`** whose methods return \`self.filter(...)\` so they compose, then expose it:

\`\`\`python
class OrderQuerySet(models.QuerySet):
    def paid(self):
        return self.filter(status="paid")
    def for_customer(self, customer):
        return self.filter(customer=customer)
    def this_month(self):
        start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return self.filter(created_at__gte=start)

class Order(models.Model):
    objects = OrderQuerySet.as_manager()

# every combination composes:
Order.objects.paid().for_customer(c).this_month().aggregate(total=Sum("total_cents"))
\`\`\`

- **\`QuerySet.as_manager()\`** builds a manager that forwards the queryset's methods. This is the common choice.
- **\`Manager.from_queryset(OrderQuerySet)\`** creates a manager *class* you can subclass to add methods that only make sense on the manager (not chainable), or override \`get_queryset\`.
- Overriding \`get_queryset\` to filter (\`return super().get_queryset().filter(active=True)\`) changes the **default** result set for that manager. Do this carefully: if it is the model's *first* manager it also becomes \`_default_manager\`, which the admin, related managers, and \`get_absolute_url\`-style code use — hiding rows there causes confusing bugs. A common pattern is to keep \`objects = Manager()\` (unfiltered) as the first manager and add \`published = PublishedManager()\` as a second, explicit one.
- \`Model._base_manager\` is always an unfiltered manager Django uses internally (e.g. for cascade deletes, \`RelatedManager\`) — it deliberately ignores your \`get_queryset\` override so internal integrity is not affected by a filtered default.

## Combining with abstract bases

The usual production pattern: an abstract \`TimeStampedModel\` (or \`OwnedModel\`) for fields, plus a custom queryset/manager attached on the concrete model, plus proxies where a named subset needs its own admin and methods.`,

    contentHi: `## Abstract base classes — aam case

Ek abstract model (\`Meta.abstract = True\`) ek database table **nahi** hai. Iske fields aur methods har concrete model mein **copy hote hain** jо ise inherit karता hai. Ye shared columns aur behaviour ke liye sahi tool hai: timestamps, ek soft-delete flag, ek \`owner\` FK.

\`\`\`python
class OwnedModel(models.Model):
    owner = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

class Document(OwnedModel):
    title = models.CharField(max_length=200)
    # Document ke table mein hai: id, owner_id, created_at, title  -- sab iske apne columns
\`\`\`

Har child apne columns own karता hai; koi shared table aur koi JOIN nahi.

## Proxy models — usi table par ek alag lens

Ek proxy (\`Meta.proxy = True\`) ek concrete model se inherit karता hai, **koi fields nahi** add karता, aur parent ke table aur rows bilkul share karता hai. Kya badal sakta hai: \`Meta.ordering\`, custom methods, aur — sabse useful — ek custom **default manager** jо filter ya annotate karता hai.

\`\`\`python
class OpenTask(Task):
    class Meta:
        proxy = True
    objects = OpenTaskManager()          # get_queryset status="open" filter karता hai
\`\`\`

## Multi-table inheritance — jise se saावdhaन rahना hai

Agar aap ek concrete model se \`abstract\` ya \`proxy\` **ke bina** inherit karते ho, Django **child ke liye ek naya table** banाता hai aur ek automatic \`OneToOneField\` jо ise parent ke table se join karता hai. \`restaurant.name\` ek JOIN se fetch hoता hai; ek \`Restaurant\` save karna do rows likhता hai.

Ye kabhi-kabhi sahi model hai, par JOIN-on-every-access cost matlab adhikaansh teams composition (ek \`OneToOneField\` jise aap control karते ho) ke liye pahुँchती hain.

## Managers aur querysets

**\`Model.objects\` ek \`Manager\` hai.** \`Manager.get_queryset()\` us model ke liye base \`QuerySet\` lautाता hai. **Ek \`QuerySet\` lazy aur chainable hai.**

Reusable query logic add karne ke liye, ek **custom \`QuerySet\`** define karो jiske methods \`self.filter(...)\` return karें taaki wo compose karें:

\`\`\`python
class OrderQuerySet(models.QuerySet):
    def paid(self):
        return self.filter(status="paid")
    def for_customer(self, customer):
        return self.filter(customer=customer)

class Order(models.Model):
    objects = OrderQuerySet.as_manager()

Order.objects.paid().for_customer(c).aggregate(total=Sum("total_cents"))
\`\`\`

- **\`QuerySet.as_manager()\`** ek manager banाता hai jо queryset ke methods forward karता hai. Aam chunaव.
- **\`Manager.from_queryset(OrderQuerySet)\`** ek manager *class* banаता hai.
- \`get_queryset\` ko filter karने ke liye override karna us manager ke **default** result set ko badalता hai. Ise dhyaan se karो: agar ye model ka *pehला* manager hai ye \`_default_manager\` bhi ban jाता hai, jise admin, related managers istemal karते hain.
- \`Model._base_manager\` hamesha ek unfiltered manager hai jise Django andar istemal karता hai — ye jaan-boojhकर aapke \`get_queryset\` override ko ignore karता hai.

## Abstract bases ke saath combine karna

Usual production pattern: fields ke liye ek abstract \`TimeStampedModel\`, plus concrete model par ek custom queryset/manager, plus proxies jahaan ek named subset ko apna admin chahिए.`,

    examples: [
      {
        title: 'Abstract base: fields are copied into each child table',
        titleHi: 'Abstract base: fields har child table mein copy hote hain',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True
    def age_seconds(self):
        return (self.updated_at - self.created_at).total_seconds()

class Note(TimeStampedModel):
    text = models.CharField(max_length=200)
    class Meta:
        app_label = "__main__"

class Bookmark(TimeStampedModel):
    url = models.URLField()
    class Meta:
        app_label = "__main__"

# the abstract base has NO table:
from django.apps import apps
model_names = {m.__name__ for m in apps.get_app_config("__main__").get_models()}
print("registered models:", sorted(model_names))   # Note, Bookmark -- NOT TimeStampedModel

with connection.schema_editor() as se:
    se.create_model(Note)
    se.create_model(Bookmark)

# each child table has its OWN created_at/updated_at columns
with connection.cursor() as cur:
    cur.execute("PRAGMA table_info('__main___note')")
    note_cols = [r[1] for r in cur.fetchall()]
print("Note columns:", note_cols)

n = Note.objects.create(text="hi")
print("inherited method works:", n.age_seconds() >= 0)
print("Bookmark also has created_at:", hasattr(Bookmark.objects.create(url="http://x"), "created_at"))`,
        output: `registered models: ['Bookmark', 'Note']
Note columns: ['id', 'created_at', 'updated_at', 'text']
inherited method works: True
Bookmark also has created_at: True
`,
        explain: '`TimeStampedModel` with `abstract = True` is never registered as a model and gets no table — only `Note` and `Bookmark` appear in the app registry. Its `created_at`/`updated_at` fields and its `age_seconds()` method are **copied into** each child: the `__main___note` table has its own `created_at` and `updated_at` columns (not a foreign key to some base table), and `Bookmark` independently has them too. This is the standard way to share timestamp/owner/soft-delete columns across many models with zero JOIN cost.',
        explainHi: '`TimeStampedModel` `abstract = True` ke saath kabhi ek model ki tarah register nahi hoता aur iska koi table nahi — sirf `Note` aur `Bookmark` app registry mein dikhते hain. Iske `created_at`/`updated_at` fields aur iski `age_seconds()` method har child mein **copy hote hain**: `__main___note` table ke apne `created_at` aur `updated_at` columns hain. Ye kai models mein timestamp/owner columns share karne ka standard tarika hai zero JOIN cost ke saath.',
      },
      {
        title: 'Proxy model: same rows, different manager and methods',
        titleHi: 'Proxy model: wahi rows, alag manager aur methods',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection

class Order(models.Model):
    reference = models.CharField(max_length=12)
    status = models.CharField(max_length=20, default="pending")
    total_cents = models.PositiveIntegerField()
    class Meta:
        app_label = "__main__"

class PaidOrderManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(status="paid")

class PaidOrder(Order):
    objects = PaidOrderManager()
    class Meta:
        app_label = "__main__"
        proxy = True
        ordering = ["-total_cents"]
    def refund(self):
        self.status = "refunded"
        self.save(update_fields=["status"])

with connection.schema_editor() as se:
    se.create_model(Order)

Order.objects.create(reference="A1", status="pending", total_cents=1000)
Order.objects.create(reference="A2", status="paid", total_cents=5000)
Order.objects.create(reference="A3", status="paid", total_cents=2000)

# proxy has NO table of its own
with connection.cursor() as cur:
    cur.execute("SELECT count(*) FROM sqlite_master WHERE type='table' AND name LIKE '%paidorder%'")
    print("paidorder tables:", cur.fetchone()[0])

print("Order.objects.count():", Order.objects.count())              # all 3
print("PaidOrder.objects (filtered + ordered):",
      list(PaidOrder.objects.values_list("reference", "total_cents")))
# a PaidOrder IS the same row as an Order
po = PaidOrder.objects.get(reference="A2")
po.refund()
print("Order A2 status after PaidOrder.refund():",
      Order.objects.get(reference="A2").status)`,
        output: `paidorder tables: 0
Order.objects.count(): 3
PaidOrder.objects (filtered + ordered): [('A2', 5000), ('A3', 2000)]
Order A2 status after PaidOrder.refund(): refunded
`,
        explain: '`PaidOrder` with `Meta.proxy = True` creates no table — it is a different Python-level view of the same `Order` rows. Its custom manager filters to `status="paid"` and `Meta.ordering` sorts by total, so `PaidOrder.objects` returns exactly the paid orders, largest first, while `Order.objects` still returns all three. Because they share rows, calling `PaidOrder.refund()` on `A2` mutates the very same row `Order.objects.get(reference="A2")` reads. Proxies give a subset its own name, manager, methods, and admin page without denormalising.',
        explainHi: '`PaidOrder` `Meta.proxy = True` ke saath koi table nahi banाता — ye usi `Order` rows ka ek alag Python-level view hai. Iska custom manager `status="paid"` filter karता hai aur `Meta.ordering` total se sort karता hai. Kyunki wo rows share karते hain, `A2` par `PaidOrder.refund()` call karna wahi row mutate karта hai jise `Order.objects.get(reference="A2")` padhता hai. Proxies ek subset ko apna naam, manager, methods, aur admin page dete hain bina denormalise kiye.',
      },
      {
        title: 'Custom QuerySet.as_manager(): chainable query methods',
        titleHi: 'Custom QuerySet.as_manager(): chainable query methods',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models import Sum

class OrderQuerySet(models.QuerySet):
    def paid(self):
        return self.filter(status="paid")
    def big(self, threshold=1000):
        return self.filter(total_cents__gte=threshold)
    def total_revenue(self):
        return self.aggregate(revenue=Sum("total_cents"))["revenue"] or 0

class Order(models.Model):
    status = models.CharField(max_length=20)
    total_cents = models.PositiveIntegerField()
    objects = OrderQuerySet.as_manager()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Order)
Order.objects.bulk_create([
    Order(status="paid", total_cents=500), Order(status="paid", total_cents=5000),
    Order(status="paid", total_cents=1500), Order(status="pending", total_cents=9000),
])

# each method returns a QuerySet, so they CHAIN in any order:
print("paid & big count:", Order.objects.paid().big().count())
print("big & paid count:", Order.objects.big(1000).paid().count())
print("paid big revenue:", Order.objects.paid().big().total_revenue())

# and they still compose with built-in queryset methods:
print("largest paid:", Order.objects.paid().order_by("-total_cents").first().total_cents)
# the manager forwards the queryset methods AND the built-ins:
print("manager has .paid:", hasattr(Order.objects, "paid"))`,
        output: `paid & big count: 2
big & paid count: 2
paid big revenue: 6500
largest paid: 5000
manager has .paid: True
`,
        explain: '`OrderQuerySet` defines `paid()` and `big()` as methods that return `self.filter(...)`, so they produce new `QuerySet`s and chain in any order (`paid().big()` == `big().paid()`), and mix freely with built-ins like `order_by` and `first`. `OrderQuerySet.as_manager()` makes `Order.objects` a manager that exposes all of these plus the standard queryset API. This is where `Order.objects.paid()` should live — written once on the queryset, reused in every view, task, and test, instead of copy-pasting `filter(status="paid")` everywhere.',
        explainHi: '`OrderQuerySet` `paid()` aur `big()` ko methods ki tarah define karता hai jо `self.filter(...)` return karते hain, toh wo naye `QuerySet`s banाते hain aur kisi bhi order mein chain karते hain, aur `order_by` jaisे built-ins ke saath free mile jaते hain. `OrderQuerySet.as_manager()` `Order.objects` ko ek manager banाता hai jо in sab ko expose karता hai. Yahaan `Order.objects.paid()` rehना chahिए — queryset par ek baar likha, har view, task, aur test mein reused.',
      },
    ],

    mistakes: [
      {
        wrong: `class Animal(models.Model):
    name = models.CharField(max_length=50)
    weight_kg = models.DecimalField(max_digits=6, decimal_places=2)

class Dog(Animal):          # concrete parent, no abstract/proxy -> multi-table inheritance
    breed = models.CharField(max_length=50)
# every  dog.name  is a JOIN to the animal table; saving a Dog writes two rows`,
        right: `class Animal(models.Model):
    name = models.CharField(max_length=50)
    weight_kg = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        abstract = True    # <-- fields copied into Dog's own table, no JOIN

class Dog(Animal):
    breed = models.CharField(max_length=50)`,
        why: 'Inheriting from a concrete model without `abstract` or `proxy` silently opts you into multi-table inheritance: Django adds a table for `Dog` linked by an implicit `OneToOneField`, so reading any inherited field is a JOIN, writing is two INSERTs, and `Animal.objects.all()` returns plain `Animal`s even for dog rows. If you only wanted shared fields, mark the base `abstract = True` and each child gets its own flat table.',
        whyHi: 'Ek concrete model se `abstract` ya `proxy` ke bina inherit karna aapko chupchaap multi-table inheritance mein opt-in karता hai: Django `Dog` ke liye ek implicit `OneToOneField` se linked ek table add karता hai, toh koi inherited field padhna ek JOIN hai. Agar aap sirf shared fields chahते the, base ko `abstract = True` mark karो.',
      },
      {
        wrong: `class Article(models.Model):
    status = models.CharField(max_length=20)

    objects = PublishedManager()      # get_queryset filters status="published"
# now: the admin only shows published articles;
#      article.comments (a reverse FK) may 404 in edge cases;
#      Article.objects.get(pk=draft_id) raises DoesNotExist even though the row exists`,
        right: `class Article(models.Model):
    status = models.CharField(max_length=20)

    objects = models.Manager()             # first = default = unfiltered (admin, internals use this)
    published = PublishedManager()          # explicit, opt-in: Article.published.all()

# use  Article.published.all()  in views;  Article.objects  everywhere state must be complete`,
        why: 'Making a *filtering* manager the model\'s first (default) manager means every place that uses the default — the admin, `Model.objects` in shells and migrations, some related-object lookups — silently sees a subset. Debugging "the row is in the DB but Django says it does not exist" traces back to this. Keep the first manager plain (`models.Manager()`), and add filtered managers as named, explicit alternatives.',
        whyHi: 'Ek *filtering* manager ko model ka pehला (default) manager banाna matlab har jagah jо default istemal karती hai — admin, shells aur migrations mein `Model.objects` — chupchaap ek subset dekhती hai. Pehle manager ko plain rakhो (`models.Manager()`), aur filtered managers ko named alternatives ki tarah add karो.',
      },
      {
        wrong: `class OrderManager(models.Manager):
    def paid(self):
        return self.filter(status="paid")
    def big(self):
        return self.filter(total_cents__gte=1000)

Order.objects.paid().big()      # AttributeError: 'QuerySet' object has no attribute 'big'`,
        right: `class OrderQuerySet(models.QuerySet):
    def paid(self):
        return self.filter(status="paid")
    def big(self):
        return self.filter(total_cents__gte=1000)

class Order(models.Model):
    objects = OrderQuerySet.as_manager()

Order.objects.paid().big()      # works -- both methods live on the QuerySet, so they chain`,
        why: 'Methods defined on the *Manager* are only available on `Model.objects`, not on the `QuerySet` that `.paid()` returns — so a second custom method cannot be chained. Put chainable query logic on a `QuerySet` subclass whose methods return `self.filter(...)`, then use `QuerySet.as_manager()` (or `Manager.from_queryset()`), and every method composes with every other and with the built-ins.',
        whyHi: '*Manager* par define kiye methods sirf `Model.objects` par available hain, us `QuerySet` par nahi jо `.paid()` return karता hai — toh ek doosra custom method chain nahi ho sakta. Chainable query logic ko ek `QuerySet` subclass par rakhो jiske methods `self.filter(...)` return karें, phir `QuerySet.as_manager()` istemal karो.',
      },
    ],

    realWorld: [
      {
        en: '**An abstract `TimeStampedModel` (and often `UUIDModel`, `SoftDeleteModel`, `OwnedModel`) in a `common`/`core` app** is inherited by nearly every model in the project — one place for `created_at`/`updated_at`, `id = UUIDField`, `is_deleted` + a manager that hides deleted rows, `owner` + row-level scoping.',
        hi: '**Ek `common`/`core` app mein ek abstract `TimeStampedModel` (aur aksar `UUIDModel`, `SoftDeleteModel`)** project ke lगbhag har model dwara inherit hoता hai — `created_at`/`updated_at` ke liye ek jagah, `is_deleted` + ek manager jо deleted rows chhupाता hai.',
      },
      {
        en: '**Custom querysets carry the domain vocabulary** — `Invoice.objects.overdue()`, `Subscription.objects.active().expiring_soon(7)`, `Order.objects.for_tenant(t).paid()`. Views, DRF viewset `get_queryset`, Celery tasks, and tests all call these instead of re-deriving the filter, so a change to "what active means" is one edit.',
        hi: '**Custom querysets domain vocabulary le jaते hain** — `Invoice.objects.overdue()`, `Subscription.objects.active().expiring_soon(7)`. Views, DRF viewset `get_queryset`, Celery tasks, aur tests sab inhe call karते hain, toh "active ka matlab kya hai" mein ek change ek edit hai.',
      },
      {
        en: '**Proxy models give the admin multiple curated views of one table** — `OpenTicket`, `MyTickets`, `EscalatedTicket` each registered with its own `ModelAdmin`, `list_display`, filters, and actions, all reading `Ticket` rows. Also used to attach different serializers/permissions per subset in DRF.',
        hi: '**Proxy models admin ko ek table ke kai curated views dete hain** — `OpenTicket`, `MyTickets`, `EscalatedTicket` har ek apne `ModelAdmin` ke saath registered, sab `Ticket` rows padhते hue. DRF mein prati subset alag serializers/permissions attach karने ke liye bhi.',
      },
    ],

    interviewQA: [
      {
        q: 'Compare abstract base classes, proxy models, and multi-table inheritance in Django.',
        qHi: 'Django mein abstract base classes, proxy models, aur multi-table inheritance ki tulnा karो.',
        a: 'All three use Python class inheritance, but they map to the database very differently. An abstract base class is declared with Meta abstract equals True. It is not a model in its own right — it has no table and is not registered — and its purpose is pure code reuse. Its fields and methods are copied into every concrete model that inherits it, so each child table physically contains those columns. There is no relationship between children and no join; it is exactly as if you had typed the shared fields into each model. This is the common, cheap, and recommended way to share things like timestamp columns, an owner foreign key, or common methods. A proxy model is declared with Meta proxy equals True and inherits from a concrete model. It adds no fields and creates no table; it operates on the parent\'s exact table and rows. What it can change is behaviour: a different default manager that filters or orders, extra methods, different Meta options like ordering or verbose name, and its own admin registration. A proxy instance and a parent instance for the same primary key are the same row, so a mutation through one is visible through the other. You use proxies to give a subset of rows a name, a manager, methods, and an admin page without denormalising. Multi-table inheritance happens when you inherit from a concrete model without marking it abstract or proxy. Django creates a separate table for the child and links it to the parent with an automatically added one-to-one field. Every access to an inherited field is a join to the parent table, saving a child writes a row in both tables, and querying the parent model returns parent instances even for rows that are really children. It models a genuine is-a relationship but the per-access join cost and query awkwardness lead most teams to prefer an explicit one-to-one field they control, or a single table with nullable subtype columns, instead. The quick rule: abstract for shared fields, proxy for a different lens on the same rows, and avoid multi-table inheritance unless you specifically need to query across all subtypes as the base type.',
        aHi: 'Teeno Python class inheritance istemal karते hain, par wo database par bahut alag map hote hain. Ek abstract base class Meta abstract equals True se declare hoती hai. Ye apne aap mein ek model nahi — iska koi table nahi aur ye register nahi hoती — aur iska maksad pure code reuse hai. Iske fields aur methods har concrete model mein copy hote hain jо ise inherit karता hai. Children ke beech koi relationship nahi aur koi join nahi. Ye timestamp columns jaisी cheezein share karने ka aam aur recommended tarika hai. Ek proxy model Meta proxy equals True se declare hoता hai. Ye koi fields add nahi karता aur koi table nahi banаता; ye parent ke exact table aur rows par kaam karता hai. Kya badal sakta hai wo behaviour hai: ek alag default manager, extra methods. Ek proxy instance aur usi primary key ke liye ek parent instance wahi row hain. Multi-table inheritance tab hoता hai jab aap ek concrete model se ise abstract ya proxy mark kiye bina inherit karते ho. Django child ke liye ek alag table banाता hai aur ise parent se ek apne aap jode gaye one-to-one field se link karता hai. Har inherited field access parent table ka ek join hai. Quick rule: shared fields ke liye abstract, usi rows par ek alag lens ke liye proxy, aur multi-table inheritance avoid karो.',
      },
      {
        q: 'How do you add reusable query methods like `Article.objects.published()`, and what is the pitfall with overriding `get_queryset`?',
        qHi: 'Aap `Article.objects.published()` jaisे reusable query methods kaise add karते ho, aur `get_queryset` override karने ka nuksaan kya hai?',
        a: 'The right way is to define a custom QuerySet subclass whose methods each return self dot filter of some condition, so that they produce a new QuerySet and can be chained together and mixed with the built-in queryset methods in any order. Then you expose that queryset on the model, usually with QuerySet dot as_manager, which builds a manager that forwards all of the queryset\'s methods, so Model dot objects has both published and the standard API, and published returns something that still has by_author, order_by, and so on. If you also want methods that only make sense on the manager and are not chainable — say a bulk operation or a create helper — you use Manager dot from_queryset to get a manager class and add those methods to a subclass. The reason not to just put the methods on a Manager subclass is that manager methods are only available on Model dot objects, not on the QuerySet that the first method returns, so a second custom method cannot be chained after the first. The pitfall with overriding get_queryset is about which manager is the default. If you override get_queryset on a manager to filter — return super get_queryset filtered to published — and that manager is the first one declared on the model, it becomes the model\'s default manager. The default manager is used in many places you might not expect: the Django admin\'s change list, Model dot objects in the shell and in migrations, some related-object and generic-view code paths. All of those now silently see only published rows. You get bugs like the admin not showing a draft that is clearly in the database, or Model dot objects dot get by primary key raising DoesNotExist for a row that exists. The safe pattern is to keep the first manager plain — objects equals models dot Manager — so the default is unfiltered, and add the filtering manager as a second, explicitly named one, like published equals PublishedManager, which callers opt into with Article dot published dot all. Django also keeps a separate base manager that is always unfiltered and used for internal integrity operations like cascade deletes, precisely so a filtered default cannot corrupt those.',
        aHi: 'Sahi tarika ek custom QuerySet subclass define karna hai jiske methods har ek self dot filter of some condition return karें, taaki wo ek naya QuerySet banाें aur ek saath chain ho sakें. Phir aap us queryset ko model par expose karте ho, aamताur par QuerySet dot as_manager se, jо ek manager banाता hai jо queryset ke saare methods forward karता hai. Agar aapko wo methods bhi chahिए jо sirf manager par matlab rakhते hain, aap Manager dot from_queryset istemal karते ho. Methods ko sirf ek Manager subclass par na rakhने ka kaaran ye hai ki manager methods sirf Model dot objects par available hain, us QuerySet par nahi jо pehला method return karта hai. get_queryset override karने ka nuksaan is baare mein hai ki kaunsा manager default hai. Agar aap ek manager par get_queryset override karके filter karते ho aur wo manager model par declare kiya pehला hai, ye model ka default manager ban jाता hai. Default manager kai jagah istemal hoता hai: admin ki change list, shell aur migrations mein Model dot objects. Wo sab ab chupchaap sirf published rows dekhते hain. Surakshit pattern pehle manager ko plain rakhna hai aur filtering manager ko ek doosre, explicitly named ki tarah add karna hai.',
      },
    ],

    exercises: [
      {
        task: 'Create an abstract `SluggedModel` with `slug = SlugField(unique=True)` and a `save()` override that fills `slug` from a `title` attribute via `django.utils.text.slugify` if it is empty. Make `Article(SluggedModel)` (has `title`) and `Page(SluggedModel)` (has `title`). Create the tables, add one of each without a slug, and print each one\'s generated `slug`. Confirm `SluggedModel` is not in the app registry.',
        taskHi: 'Ek abstract `SluggedModel` banाओ `slug = SlugField(unique=True)` aur ek `save()` override ke saath jо `slug` ko ek `title` attribute se `slugify` ke zariye bhare agar khali hai. `Article(SluggedModel)` aur `Page(SluggedModel)` banाओ. Tables banाओ, bina slug ke ek-ek add karो.',
        hint: '`from django.utils.text import slugify`. In `save`: `if not self.slug: self.slug = slugify(self.title)` then `super().save(*args, **kwargs)`. `abstract = True` in `SluggedModel.Meta`. `apps.get_app_config("__main__").get_models()` should list only `Article` and `Page`.',
        hintHi: '`from django.utils.text import slugify`. `save` mein: `if not self.slug: self.slug = slugify(self.title)` phir `super().save(...)`. `SluggedModel.Meta` mein `abstract = True`.',
      },
      {
        task: 'Model `Ticket` with `status` (choices `open`/`closed`) and `priority` (int). Add a `TicketQuerySet` with `open_only()` (`filter(status="open")`) and `high_priority(n=3)` (`filter(priority__gte=n)`), exposed via `objects = TicketQuerySet.as_manager()`. Insert 5 tickets with a mix. Print the counts for `Ticket.objects.open_only().high_priority()` and `Ticket.objects.high_priority(2).open_only()` and confirm chaining works in both orders.',
        taskHi: '`Ticket` model karो `status` aur `priority` ke saath. Ek `TicketQuerySet` add karो `open_only()` aur `high_priority(n=3)` ke saath, `objects = TicketQuerySet.as_manager()` ke zariye expose. 5 tickets insert karो. `Ticket.objects.open_only().high_priority()` aur ulta order ke counts print karो.',
        hint: 'Both methods `return self.filter(...)`, so `.open_only().high_priority()` and `.high_priority().open_only()` produce the same SQL and the same count. Mix with `.count()` / `.order_by()` freely.',
        hintHi: 'Dono methods `return self.filter(...)`, toh `.open_only().high_priority()` aur ulta wahi SQL aur wahi count deते hain.',
      },
      {
        task: 'Model `Task` with a `done` BooleanField. Give it `objects = models.Manager()` (first, unfiltered) and `pending = PendingManager()` where `PendingManager.get_queryset` filters `done=False`. Insert 3 done + 2 pending. Print `Task.objects.count()` (5), `Task.pending.count()` (2), and confirm `Task.objects.get(pk=<a done task pk>)` works while `Task.pending.get(pk=<same pk>)` raises `Task.DoesNotExist`.',
        taskHi: '`Task` model karो ek `done` BooleanField ke saath. Ise `objects = models.Manager()` (pehला, unfiltered) aur `pending = PendingManager()` do jahaan `PendingManager.get_queryset` `done=False` filter kare. 3 done + 2 pending insert karो. Counts print karो aur confirm karो `Task.pending.get(pk=<done pk>)` `DoesNotExist` raise karता hai.',
        hint: 'The first manager attribute becomes `_default_manager`. Keeping it plain means the admin and internals see all rows; `Task.pending` is opt-in. `Task.pending.get(pk=done_pk)` raises because that row is filtered out of `pending`\'s queryset.',
        hintHi: 'Pehला manager attribute `_default_manager` ban jाता hai. Ise plain rakhna matlab admin sab rows dekhता hai; `Task.pending` opt-in hai.',
      },
    ],

    keyTakeaways: [
      'Abstract base class (`Meta.abstract = True`): NO table, not registered. Fields + methods are COPIED into each concrete child — the child owns the columns, zero JOIN. The standard way to share `created_at`/`owner`/soft-delete/etc.',
      'Proxy model (`Meta.proxy = True`): NO new table, SAME rows as the parent. Changes only `Meta` (ordering, verbose_name), methods, and the default manager. A proxy instance and a parent instance for one pk are the same row.',
      'Multi-table inheritance (inherit a concrete model, no abstract/proxy): a NEW child table + an implicit `OneToOneField` to the parent -> a JOIN on every inherited-field access, two INSERTs per save, parent queries return parent instances. Usually prefer composition or an abstract base.',
      '`Model.objects` is a `Manager`; `Manager.get_queryset()` returns the base `QuerySet`. A `QuerySet` is lazy and chainable — `.filter()` etc. each return a new `QuerySet`.',
      'For reusable query logic: define a `QuerySet` subclass whose methods `return self.filter(...)` (so they chain), then `objects = MyQuerySet.as_manager()`. `Article.objects.published().by_author(u).order_by(...)` all compose. `Manager.from_queryset(QS)` when you also need manager-only methods.',
      'Manager methods live ONLY on `Model.objects`, not on the returned `QuerySet` — so a second manager method can\'t be chained. Chainable logic must be on the `QuerySet`.',
      'Overriding `get_queryset` to FILTER changes the default result set. If that manager is the model\'s FIRST manager it becomes `_default_manager` — used by the admin, shells, migrations, related lookups — silently hiding rows. Keep the first manager plain (`models.Manager()`); add filtered ones as named alternatives (`published = PublishedManager()`).',
      '`Model._base_manager` is always unfiltered and used internally (cascade deletes, related managers) — it ignores your `get_queryset` override by design.',
    ],
    keyTakeawaysHi: [
      'Abstract base class (`Meta.abstract = True`): KOI table nahi, register nahi. Fields + methods har concrete child mein COPY hote hain — child columns own karता hai, zero JOIN. `created_at`/`owner`/soft-delete share karने ka standard tarika.',
      'Proxy model (`Meta.proxy = True`): KOI naya table nahi, parent jaisी hi rows. Sirf `Meta`, methods, aur default manager badalता hai. Ek proxy instance aur ek parent instance ek pk ke liye wahi row hain.',
      'Multi-table inheritance (ek concrete model inherit, no abstract/proxy): ek NAYA child table + parent ka ek implicit `OneToOneField` -> har inherited-field access par ek JOIN, prati save do INSERTs. Aksar composition ya ek abstract base prefer karो.',
      '`Model.objects` ek `Manager` hai; `Manager.get_queryset()` base `QuerySet` lautाता hai. Ek `QuerySet` lazy aur chainable hai.',
      'Reusable query logic ke liye: ek `QuerySet` subclass define karो jiske methods `return self.filter(...)` (toh wo chain karें), phir `objects = MyQuerySet.as_manager()`. `Manager.from_queryset(QS)` jab aapko manager-only methods bhi chahिए.',
      'Manager methods SIRF `Model.objects` par hain, returned `QuerySet` par nahi — toh ek doosra manager method chain nahi ho sakta. Chainable logic `QuerySet` par honi chahिए.',
      '`get_queryset` ko FILTER karने ke liye override karna default result set badalता hai. Agar wo manager model ka PEHLA hai ye `_default_manager` ban jाता hai — admin, shells, migrations dwara istemal — chupchaap rows chhupाता hai. Pehle manager ko plain rakhो; filtered ones ko named alternatives ki tarah add karो.',
      '`Model._base_manager` hamesha unfiltered hai aur andar istemal hoता hai — ye aapke `get_queryset` override ko design se ignore karता hai.',
    ],
  },

  {
    slug: 'dj-model-methods-validation-lifecycle',
    title: 'Model Methods, Validation, and the save() Lifecycle',
    titleHi: 'Model Methods, Validation, Aur save() Lifecycle',
    description: 'The single most surprising fact about Django models: `.save()` does not run validation. `full_clean()` does, and forms/serializers call it — but a bare `.save()`, `bulk_create`, or `update()` writes whatever you give it, subject only to database constraints. Knowing exactly when each hook fires is how you avoid corrupt data.',
    descriptionHi: 'Django models ke baare mein sabse ascharyajanak tathya: `.save()` validation nahi chalाता. `full_clean()` chalाता hai, aur forms/serializers ise call karते hain — par ek bare `.save()`, `bulk_create`, ya `update()` jо aap dete ho wo likhता hai, sirf database constraints ke adhीन. Bilkul kab har hook fire hoता hai jaanna aise aap corrupt data avoid karते ho.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**A warehouse that files whatever you hand it, and an optional inspection desk you have to walk past.** The loading dock (`.save()`) takes your box and puts it on the shelf — it checks only the hard structural rules the building itself enforces (the shelf is the right size, the slot is not already taken: database constraints). It does *not* open the box. The inspection desk (`full_clean()`) is where someone actually opens the box, checks the contents against the packing list, rejects a mislabelled item, verifies the "region" field matches the postcode. But the inspection desk is off to the side — you only get inspected if you choose to walk past it, and the forms clerk and the API clerk are trained to always route boxes through it. If you hand a box straight to the dock (a bare `.save()`, `bulk_create`, `queryset.update()`), it is filed uninspected. The lesson: put your genuine structural rules into the building (database constraints, Module 2 lesson 1) so they cannot be skipped, and treat the inspection desk as the place for friendly, detailed rejection messages on the paths that use it.',
      hi: '**Ek warehouse jо jо aap dete ho wo file karता hai, aur ek optional inspection desk jiske paas se aapko chalना hai.** Loading dock (`.save()`) aapka box leता hai aur shelf par rakhता hai — ye sirf building ke hard structural rules check karता hai (shelf sahi size ka hai, slot pehle se nahi liya: database constraints). Ye box *nahi* kholता. Inspection desk (`full_clean()`) wo hai jahaan koi asal mein box kholता hai, contents ko packing list ke khilaaf check karता hai, ek mislabelled item reject karता hai. Par inspection desk side par hai — aap sirf tab inspect hote ho agar aap uske paas se chalne ka chunाव karते ho, aur forms clerk aur API clerk hamesha boxes ise ke through route karने ke liye trained hain. Agar aap ek box seedhे dock ko dete ho (ek bare `.save()`, `bulk_create`), ye bina inspection file hoता hai. Sabak: apne asli structural rules building mein daalो (database constraints) taaki wo skip na ho sakें.',
    },

    simple: `**The order things happen on a normal request**

\`\`\`
Form / DRF serializer   is_valid()  -> field validation + serializer/form .validate()/.clean()
                        (for ModelForm/ModelSerializer this includes model field validators
                         and, for ModelForm, model.full_clean())
        |
your view  ->  instance.save()
        |
Model.save()  ->  pre_save signal  ->  INSERT/UPDATE SQL  ->  post_save signal
        |
(NO full_clean here unless YOU call it)
\`\`\`

**\`.save()\` does NOT validate**

\`\`\`python
class Person(models.Model):
    age = models.PositiveIntegerField()
    email = models.EmailField()

p = Person(age=-5, email="not-an-email")
p.save()          # SUCCEEDS on most DBs -- no validation, and no CHECK constraint here
                  # (PositiveIntegerField's "positive" is validation-layer, not always DB-enforced)

p2 = Person(age=-5, email="not-an-email")
p2.full_clean()   # NOW it raises ValidationError: {'age': [...], 'email': [...]}
\`\`\`

**Where validation lives**

\`\`\`python
class Event(models.Model):
    start = models.DateTimeField()
    end = models.DateTimeField()
    capacity = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    def clean(self):
        # model-level, cross-field validation -- runs inside full_clean()
        if self.end <= self.start:
            raise ValidationError({"end": "must be after start"})

    def save(self, *args, **kwargs):
        self.full_clean()             # OPT IN: validate on every save of THIS model
        super().save(*args, **kwargs)
\`\`\`

**\`save()\` override — the correct shape**

\`\`\`python
def save(self, *args, **kwargs):
    if not self.slug:
        self.slug = slugify(self.title)
    super().save(*args, **kwargs)      # ALWAYS call super; ALWAYS pass *args, **kwargs
\`\`\`

**Targeted writes**

\`\`\`python
obj.save(update_fields=["status", "updated_at"])   # UPDATE only these columns (+ faster, fewer races)
obj.save(force_insert=True)                         # force an INSERT (error if pk exists)
obj.refresh_from_db()                               # reload from the DB, discard in-memory changes
obj.refresh_from_db(fields=["status"])              # just one field

Model.objects.filter(...).update(status="done")     # bulk UPDATE -- NO save(), NO signals, NO full_clean
Model.objects.bulk_create([...])                    # bulk INSERT  -- NO save(), NO auto_now, limited signals
\`\`\`

\`\`\`
RUNS full_clean:   ModelForm.is_valid(), ModelSerializer (its own validation, not model.full_clean by default),
                   admin add/change, and anywhere YOU call obj.full_clean()
DOES NOT:          bare obj.save(), obj.delete(), QuerySet.update(), bulk_create/bulk_update,
                   loaddata, most management commands
ALWAYS enforced:   database constraints (NOT NULL, UNIQUE, CHECK, FK) -- put real invariants THERE

save() signals:  pre_save / post_save   |   delete signals:  pre_delete / post_delete
m2m change:      m2m_changed            |   bulk ops fire signals inconsistently -- do not rely on them
\`\`\``,

    simpleHi: `**Ek normal request par cheezein hone ka kram**

\`\`\`
Form / DRF serializer   is_valid()  -> field validation + serializer/form .validate()/.clean()
        |
aapka view  ->  instance.save()
        |
Model.save()  ->  pre_save signal  ->  INSERT/UPDATE SQL  ->  post_save signal
        |
(YAHAN KOI full_clean nahi jab tak AAP ise call na karो)
\`\`\`

**\`.save()\` validate NAHI karता**

\`\`\`python
class Person(models.Model):
    age = models.PositiveIntegerField()
    email = models.EmailField()

p = Person(age=-5, email="not-an-email")
p.save()          # adhikaansh DBs par SAFAL -- koi validation nahi

p2 = Person(age=-5, email="not-an-email")
p2.full_clean()   # AB ye ValidationError raise karता hai: {'age': [...], 'email': [...]}
\`\`\`

**Validation kahaan rehती hai**

\`\`\`python
class Event(models.Model):
    start = models.DateTimeField()
    end = models.DateTimeField()

    def clean(self):
        # model-level, cross-field validation -- full_clean() ke andar chalता hai
        if self.end <= self.start:
            raise ValidationError({"end": "must be after start"})

    def save(self, *args, **kwargs):
        self.full_clean()             # OPT IN: IS model ke har save par validate karो
        super().save(*args, **kwargs)
\`\`\`

**\`save()\` override — sahi shape**

\`\`\`python
def save(self, *args, **kwargs):
    if not self.slug:
        self.slug = slugify(self.title)
    super().save(*args, **kwargs)      # HAMESHA super call karो; HAMESHA *args, **kwargs pass karो
\`\`\`

**Targeted writes**

\`\`\`python
obj.save(update_fields=["status", "updated_at"])   # sirf ye columns UPDATE (+ tez, kam races)
obj.refresh_from_db()                               # DB se reload, in-memory changes discard

Model.objects.filter(...).update(status="done")     # bulk UPDATE -- KOI save(), signals, full_clean nahi
Model.objects.bulk_create([...])                    # bulk INSERT  -- KOI save(), auto_now nahi
\`\`\`

\`\`\`
full_clean CHALAATA hai:   ModelForm.is_valid(), admin add/change, aur jahaan AAP obj.full_clean() call karो
NAHI:                      bare obj.save(), obj.delete(), QuerySet.update(), bulk_create/bulk_update
HAMESHA enforced:          database constraints (NOT NULL, UNIQUE, CHECK, FK) -- asli invariants WAHAN daalो

save() signals:  pre_save / post_save   |   delete signals:  pre_delete / post_delete
bulk ops signals inconsistently fire karте hain -- unpar bharosा mat karो
\`\`\``,

    content: `## The lifecycle, precisely

When you create or update a model instance through the normal path:

1. **A form or serializer validates the input.** \`ModelForm.is_valid()\` runs each field's \`to_python\` + \`validate\` + \`run_validators\`, then the form's \`clean_<field>\` methods, then \`clean()\`, and — because it is a *Model*Form — calls \`instance.full_clean(exclude=...)\` which runs model field validators, \`Model.clean_fields()\`, \`Model.clean()\`, and \`Model.validate_unique()\` / \`validate_constraints()\`. A DRF \`Serializer\` runs its own field + object validation; a \`ModelSerializer\` adds validators derived from the model (uniqueness, max_length) but **does not call \`model.full_clean()\`** unless you wire it in.
2. **The view calls \`instance.save()\`.**
3. **\`Model.save()\`** resolves \`auto_now\`/\`auto_now_add\`, sends the \`pre_save\` signal per field-less step, emits the \`INSERT\` or \`UPDATE\`, and sends \`post_save\`. It does **not** call \`full_clean\`.
4. **\`m2m\` changes** (\`obj.tags.add(...)\`) happen separately and fire \`m2m_changed\`.

So the validation you rely on in a form/DRF request comes from the form/serializer layer, **not** from \`save()\`.

## \`.save()\` does not validate — why, and what to do

Django's rationale: \`save()\` is a low-level persistence operation and should not silently do expensive work (validators can hit the database or external services) or raise where you might not expect it. Validation is a separate, opt-in step (\`full_clean\`).

Consequences and the fix:

- **Put real invariants in the database** — \`NOT NULL\`, \`UNIQUE\`, \`CheckConstraint\`, FK constraints (Module 2 lesson 1). These *are* enforced on every write, including \`bulk_create\`, \`update()\`, raw SQL, and other services. Field options like \`PositiveIntegerField\` or \`choices\` are validation-layer only unless you add a matching constraint.
- **Let the form/serializer layer produce friendly errors** on the request path.
- **Optionally call \`self.full_clean()\` inside \`save()\`** for models where you want validation on *every* save regardless of entry point — accepting the cost and that \`bulk_create\` still bypasses it.
- **In data migrations and management commands** doing bulk work, validate explicitly (or trust the DB constraints).

## \`clean()\`, \`clean_fields()\`, validators — where each fits

\`\`\`python
class Shipment(models.Model):
    weight_kg = models.DecimalField(max_digits=6, decimal_places=2,
                                    validators=[MinValueValidator(Decimal("0.01"))])  # field validator
    dispatched_at = models.DateTimeField(null=True)
    delivered_at = models.DateTimeField(null=True)

    def clean(self):
        # cross-field rules -> raise ValidationError with a dict to attach to fields,
        # or a plain message for a non-field error
        if self.delivered_at and not self.dispatched_at:
            raise ValidationError("cannot be delivered before dispatch")
        if self.delivered_at and self.dispatched_at and self.delivered_at < self.dispatched_at:
            raise ValidationError({"delivered_at": "must be after dispatch"})
\`\`\`

\`full_clean()\` calls, in order: \`clean_fields()\` (per-field: type coercion, \`blank\`, field \`validators\`), then \`clean()\` (your cross-field method), then \`validate_unique()\` and \`validate_constraints()\` (checks \`Meta.constraints\` in Python). Any of them raising \`ValidationError\` aborts and the errors are collected into \`error_dict\`.

## Overriding \`save()\` correctly

\`\`\`python
def save(self, *args, **kwargs):
    # 1. do your pre-save work (derive fields, normalise)
    self.email = self.email.lower().strip()
    if not self.slug:
        self.slug = slugify(self.title)
    # 2. ALWAYS call super with the SAME args/kwargs
    super().save(*args, **kwargs)
    # 3. post-save work that needs the pk (careful: this runs on every save)
\`\`\`

Rules: always \`super().save(*args, **kwargs)\` (never \`super().save()\` — you would drop \`update_fields\`, \`using\`, \`force_insert\`); do not do slow I/O in \`save()\` (email, external API — use \`transaction.on_commit\` or a task, Module 8); remember \`save()\` fires for the admin, the shell, tests, and every code path, so keep it cheap and idempotent.

## \`update_fields\`, \`refresh_from_db\`, bulk ops

- **\`obj.save(update_fields=[...])\`** emits \`UPDATE table SET col1=..., col2=... WHERE id=...\` touching only those columns — faster, smaller lock footprint, and it will not clobber a concurrent change to other columns. It skips \`pre_save\` for fields not listed. Use it in \`save()\` overrides and hot paths.
- **\`obj.refresh_from_db(fields=[...])\`** re-reads the row (or specific columns) and discards in-memory changes — use after a \`QuerySet.update()\` on the same object, or when a signal/trigger changed the row.
- **\`QuerySet.update(**kwargs)\`** is a single SQL \`UPDATE\` over many rows — no \`save()\`, no \`pre_save\`/\`post_save\`, no \`auto_now\`, no \`full_clean\`. Fast and race-safe for simple set-a-column operations; you must handle \`updated_at\` yourself (\`update(status="x", updated_at=timezone.now())\`).
- **\`bulk_create\` / \`bulk_update\`** — one \`INSERT\`/\`UPDATE\` for many rows; no per-object \`save()\`, no \`auto_now_add\` (pass the value), signals fire inconsistently. The tool for large writes (Module 8).

## Signals — use sparingly

\`pre_save\`/\`post_save\`/\`pre_delete\`/\`post_delete\`/\`m2m_changed\` let you hook model events from another module (connect them in \`AppConfig.ready()\`, Module 1). They are useful for genuinely decoupled cross-cutting reactions (invalidate a cache, enqueue a search-index update) but make control flow non-obvious — a \`save()\` triggering three signal handlers in other files is hard to follow and hard to test. Prefer an explicit method call or a service function for logic that belongs to the operation; reserve signals for reactions that are truly independent of the caller.`,

    contentHi: `## Lifecycle, theek se

Jab aap normal path se ek model instance create ya update karते ho:

1. **Ek form ya serializer input validate karता hai.** \`ModelForm.is_valid()\` har field ka validation chalाता hai, phir form ke \`clean_<field>\` methods, phir \`clean()\`, aur — kyunki ye ek *Model*Form hai — \`instance.full_clean()\` call karता hai. Ek DRF \`ModelSerializer\` apne validators add karता hai par **\`model.full_clean()\` call NAHI karता** jab tak aap ise wire na karो.
2. **View \`instance.save()\` call karता hai.**
3. **\`Model.save()\`** \`auto_now\`/\`auto_now_add\` resolve karता hai, \`pre_save\` signal bhejता hai, \`INSERT\` ya \`UPDATE\` emit karता hai, aur \`post_save\` bhejता hai. Ye \`full_clean\` **NAHI** call karता.

Toh jо validation aap ek form/DRF request mein rely karते ho wo form/serializer layer se aati hai, \`save()\` se **NAHI**.

## \`.save()\` validate nahi karता — kyun, aur kya karें

Django ka tark: \`save()\` ek low-level persistence operation hai aur ise chupchaap mehnga kaam nahi karna chahिए ya raise nahi karna chahिए jahaan aap ummeed na karें.

Parinaम aur fix:

- **Asli invariants database mein daalो** — \`NOT NULL\`, \`UNIQUE\`, \`CheckConstraint\`, FK constraints. Ye har write par enforce hote *hain*. \`PositiveIntegerField\` ya \`choices\` jaisे field options sirf validation-layer hain jab tak aap ek matching constraint add na karो.
- **Form/serializer layer ko friendly errors produce karने do** request path par.
- **Vaikalpik roop se \`save()\` ke andar \`self.full_clean()\` call karो** un models ke liye jahaan aap *har* save par validation chahते ho.

## \`clean()\`, validators — har ek kahaan fit hoता hai

\`full_clean()\` kram mein call karता hai: \`clean_fields()\` (per-field), phir \`clean()\` (aapki cross-field method), phir \`validate_unique()\` aur \`validate_constraints()\`. Koi bhi \`ValidationError\` raise karता abort karता hai.

## \`save()\` sahi se override karna

\`\`\`python
def save(self, *args, **kwargs):
    self.email = self.email.lower().strip()
    if not self.slug:
        self.slug = slugify(self.title)
    super().save(*args, **kwargs)      # HAMESHA SAME args/kwargs ke saath super
\`\`\`

Niyam: hamesha \`super().save(*args, **kwargs)\`; \`save()\` mein slow I/O mat karो; yaad rakhो \`save()\` admin, shell, tests ke liye fire hoता hai.

## \`update_fields\`, bulk ops

- **\`obj.save(update_fields=[...])\`** sirf un columns ko UPDATE karता hai — tez, chhota lock, concurrent change clobber nahi karता.
- **\`QuerySet.update(**kwargs)\`** ek single SQL \`UPDATE\` — koi \`save()\`, \`pre_save\`/\`post_save\`, \`auto_now\`, \`full_clean\` nahi. \`updated_at\` khud handle karो.
- **\`bulk_create\` / \`bulk_update\`** — bade writes ka tool (Module 8); koi per-object \`save()\`, koi \`auto_now_add\` nahi.

## Signals — kamdी se istemal karो

\`pre_save\`/\`post_save\` aapko model events hook karने dete hain (unhe \`AppConfig.ready()\` mein connect karो). Ye genuinely decoupled reactions ke liye useful hain par control flow non-obvious banाते hain. Operation se juda logic ke liye ek explicit method call prefer karो.`,

    examples: [
      {
        title: '.save() writes an invalid instance; full_clean() catches it',
        titleHi: '.save() ek invalid instance likhता hai; full_clean() ise pakadता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator

class Registration(models.Model):
    email = models.EmailField()
    seats = models.IntegerField(validators=[MinValueValidator(1)])
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Registration)

# 1. a bare .save() with clearly invalid data -- SUCCEEDS (no validation, no CHECK constraint)
bad = Registration(email="definitely-not-an-email", seats=-3)
bad.save()
print("bare .save() wrote the invalid row. pk =", bad.pk)
print("row count:", Registration.objects.count())

# 2. full_clean() on the same kind of data -- raises
bad2 = Registration(email="definitely-not-an-email", seats=-3)
try:
    bad2.full_clean()
except ValidationError as e:
    print("full_clean() rejected fields:", sorted(e.message_dict.keys()))

# 3. the pattern: call full_clean() yourself before save when you need the guarantee
def create_registration(email, seats):
    reg = Registration(email=email, seats=seats)
    reg.full_clean()          # raises ValidationError on bad input
    reg.save()
    return reg

try:
    create_registration("ok@example.com", 0)   # email valid, seats invalid
except ValidationError as e:
    print("guarded create rejected:", sorted(e.message_dict.keys()))
ok = create_registration("ada@example.com", 2)
print("valid create ok, seats =", ok.seats)`,
        output: `bare .save() wrote the invalid row. pk = 1
row count: 1
full_clean() rejected fields: ['email', 'seats']
guarded create rejected: ['seats']
valid create ok, seats = 2
`,
        explain: '`Registration(email="definitely-not-an-email", seats=-3).save()` succeeds: `.save()` runs no validation, and there is no database `CHECK` constraint on `seats` or format check on `email`, so the invalid row is persisted. `full_clean()` on the same data raises `ValidationError` with both fields — but only because something *called* it. The reliable pattern for non-form code paths is an explicit `reg.full_clean()` before `reg.save()`, or better, real database constraints (Module 2 lesson 1) that no write path can bypass.',
        explainHi: '`Registration(email="definitely-not-an-email", seats=-3).save()` safal hoता hai: `.save()` koi validation nahi chalाता, aur `seats` par koi database `CHECK` constraint nahi, toh invalid row persist hoती hai. Usi data par `full_clean()` `ValidationError` raise karता hai — par sirf isliye kyunki kisi ne ise *call* kiya. Non-form code paths ke liye vishwasniya pattern `reg.save()` se pehle ek explicit `reg.full_clean()` hai, ya behtar, asli database constraints.',
      },
      {
        title: 'clean() for cross-field rules; save() override done right',
        titleHi: 'cross-field rules ke liye clean(); save() override sahi se',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.core.exceptions import ValidationError
from django.utils.text import slugify

class Campaign(models.Model):
    title = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, blank=True)
    starts_on = models.DateField()
    ends_on = models.DateField()
    class Meta:
        app_label = "__main__"

    def clean(self):
        if self.ends_on <= self.starts_on:
            raise ValidationError({"ends_on": "must be after starts_on"})

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        self.full_clean()                       # opt in: validate on EVERY save of Campaign
        super().save(*args, **kwargs)           # ALWAYS pass through *args, **kwargs

with connection.schema_editor() as se:
    se.create_model(Campaign)

import datetime
c = Campaign(title="Summer Launch 2024",
             starts_on=datetime.date(2024, 6, 1), ends_on=datetime.date(2024, 8, 31))
c.save()
print("slug auto-filled:", c.slug)

# save() runs full_clean(), so a bad date range is rejected at save time
bad = Campaign(title="Broken", starts_on=datetime.date(2024, 6, 1),
               ends_on=datetime.date(2024, 5, 1))
try:
    bad.save()
except ValidationError as e:
    print("save() rejected via clean():", e.message_dict)

# update_fields: only touch 'title', skip re-deriving slug logic path
c.title = "Summer Launch 2024 (v2)"
c.save(update_fields=["title"])
print("after update_fields save, slug unchanged:", c.slug)`,
        output: `slug auto-filled: summer-launch-2024
save() rejected via clean(): {'ends_on': ['must be after starts_on']}
after update_fields save, slug unchanged: summer-launch-2024
`,
        explain: '`clean()` holds the cross-field rule (`ends_on > starts_on`) and runs as part of `full_clean()`. The `save()` override derives `slug` from `title` when empty, then calls `self.full_clean()` so *this* model validates on every save regardless of entry point, then `super().save(*args, **kwargs)` — passing the args through so `update_fields=["title"]` still works on the last call. Note `full_clean` inside `save` is a deliberate opt-in with a cost; many models rely on the form/serializer layer instead and keep `save()` cheap.',
        explainHi: '`clean()` cross-field rule rakhता hai aur `full_clean()` ke hisse ki tarah chalता hai. `save()` override `slug` ko `title` se derive karता hai jab khali hai, phir `self.full_clean()` call karта hai taaki *ye* model har save par validate kare, phir `super().save(*args, **kwargs)` — args pass karके taaki `update_fields=["title"]` abhi bhi kaam kare. `save` ke andar `full_clean` ek jaan-boojhकर opt-in hai ek cost ke saath.',
      },
      {
        title: 'QuerySet.update() and bulk_create() bypass save(), signals, and auto_now',
        titleHi: 'QuerySet.update() aur bulk_create() save(), signals, auto_now bypass karते hain',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

class Item(models.Model):
    name = models.CharField(max_length=50)
    status = models.CharField(max_length=20, default="new")
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        app_label = "__main__"

save_count = {"n": 0}

@receiver(post_save, sender=Item)
def on_save(sender, instance, **kwargs):
    save_count["n"] += 1

with connection.schema_editor() as se:
    se.create_model(Item)

# .save() path: fires post_save, sets auto_now
a = Item.objects.create(name="a")            # create() calls save()
b = Item.objects.create(name="b")
print("post_save fired for .create():", save_count["n"])
first_updated = Item.objects.get(name="a").updated_at

# QuerySet.update(): one SQL UPDATE -- NO save(), NO post_save, NO auto_now
import time; time.sleep(0.01)
Item.objects.filter(name="a").update(status="done")
print("post_save after .update():", save_count["n"], "(unchanged)")
print("updated_at changed by .update()?:",
      Item.objects.get(name="a").updated_at != first_updated, "(auto_now skipped)")

# to keep updated_at correct with .update(), set it explicitly:
Item.objects.filter(name="b").update(status="done", updated_at=timezone.now())
print("explicit updated_at in .update() works:",
      Item.objects.get(name="b").status == "done")

# bulk_create: NO per-object save(), post_save not fired (by default)
Item.objects.bulk_create([Item(name="c"), Item(name="d")])
print("post_save after bulk_create:", save_count["n"], "(still unchanged)")
print("total items:", Item.objects.count())`,
        output: `post_save fired for .create(): 2
post_save after .update(): 2 (unchanged)
updated_at changed by .update()?: False (auto_now skipped)
explicit updated_at in .update() works: True
post_save after bulk_create: 2 (still unchanged)
total items: 4
`,
        explain: '`Item.objects.create()` goes through `save()`, so `post_save` fires and `auto_now` stamps `updated_at`. `QuerySet.update()` compiles to a single SQL `UPDATE` and does **none** of that — no `save()`, no `post_save`, and `auto_now` is skipped, so `updated_at` goes stale unless you pass it explicitly. `bulk_create` similarly skips per-object `save()` and (by default) `post_save`. These bulk operations are the right tool for large writes (Module 8), but any logic you put in `save()`, a signal, or `auto_now` is silently not applied — a frequent source of "why is `updated_at` wrong" and "why didn\'t the cache invalidate" bugs.',
        explainHi: '`Item.objects.create()` `save()` se guzarта hai, toh `post_save` fire hoता hai aur `auto_now` `updated_at` stamp karता hai. `QuerySet.update()` ek single SQL `UPDATE` mein compile hoता hai aur us mein se **kuch nahi** karता — koi `save()`, koi `post_save`, aur `auto_now` skip hoता hai. `bulk_create` isi tarah per-object `save()` skip karता hai. Ye bulk operations bade writes ka sahi tool hain (Module 8), par jо logic aap `save()`, ek signal, ya `auto_now` mein daalते ho wo chupchaap lागू nahi hoता.',
      },
    ],

    mistakes: [
      {
        wrong: `class Account(models.Model):
    balance_cents = models.IntegerField()

    def clean(self):
        if self.balance_cents < 0:
            raise ValidationError("balance cannot be negative")
# then in a service:  acc.balance_cents -= amount;  acc.save()
# -> save() never calls clean() -> a negative balance is written`,
        right: `class Account(models.Model):
    balance_cents = models.IntegerField()

    class Meta:
        constraints = [
            models.CheckConstraint(condition=models.Q(balance_cents__gte=0),
                                   name="balance_nonneg"),
        ]
# now a negative balance raises IntegrityError on ANY write path, including .update() and bulk ops`,
        why: 'A rule in `clean()` only runs when `full_clean()` is called — which a bare `.save()`, `QuerySet.update()`, `bulk_create`, or a data migration never does. So the "balance cannot be negative" invariant is silently unenforced on exactly the paths (a service debiting an account) where it matters most. Real invariants belong in `Meta.constraints` so the database enforces them everywhere. Keep the `clean()` check too, for a friendly form error, but it is not the guarantee.',
        whyHi: '`clean()` mein ek rule sirf tab chalता hai jab `full_clean()` call hoता hai — jо ek bare `.save()`, `QuerySet.update()`, `bulk_create`, ya ek data migration kabhi nahi karता. Toh "balance negative nahi ho sakta" invariant bilkul un paths par silently unenforced hai jahaan ye sabse zyada maayne rakhता hai. Asli invariants `Meta.constraints` mein rehते hain.',
      },
      {
        wrong: `def save(self, *args, **kwargs):
    self.total = self.subtotal + self.tax
    super().save()                       # dropped *args, **kwargs !
    send_confirmation_email(self)         # slow I/O in save()`,
        right: `def save(self, *args, **kwargs):
    self.total = self.subtotal + self.tax
    super().save(*args, **kwargs)         # pass everything through

# email elsewhere:
from django.db import transaction
transaction.on_commit(lambda: send_confirmation_email.delay(self.pk))`,
        why: 'Calling `super().save()` with no arguments discards `update_fields`, `force_insert`, `using`, `force_update` — so `obj.save(update_fields=["status"])` silently becomes a full-row save, re-clobbering columns and breaking concurrency assumptions. And doing slow or failable I/O (email, an HTTP call) inside `save()` means every save — admin edits, tests, migrations — pays that cost and can fail mid-transaction; move it to `transaction.on_commit` and/or a background task (Module 8).',
        whyHi: '`super().save()` ko bina arguments ke call karna `update_fields`, `force_insert`, `using` discard karता hai — toh `obj.save(update_fields=["status"])` chupchaap ek full-row save ban jाता hai. Aur `save()` ke andar slow I/O karna matlab har save wo cost chukाता hai. Ise `transaction.on_commit` aur/ya ek background task mein move karो.',
      },
      {
        wrong: `# order_processing/signals.py
@receiver(post_save, sender=Order)
def handle_order(sender, instance, created, **kwargs):
    if created:
        reserve_inventory(instance)
        charge_payment(instance)          # a payment call, inside a save() signal
        send_receipt(instance)
# now every Order.objects.create() anywhere -- tests, admin, a fixture -- charges a card`,
        right: `# order_processing/services.py
def place_order(cart, payment_method):
    with transaction.atomic():
        order = Order.objects.create(...)
        reserve_inventory(order)
    transaction.on_commit(lambda: process_payment_task.delay(order.pk))
    return order
# explicit, testable, and Order.objects.create() in a test does NOT charge anyone`,
        why: 'Hanging heavy, side-effectful business logic off `post_save` makes it fire for *every* way an `Order` row is created — a test factory, a data migration, an admin action, a `loaddata` fixture, a shell session. You get surprise charges, emails in tests, and inventory reservations from a migration. Put the operation in an explicit service function that the view calls; use signals only for reactions that genuinely should happen on every save regardless of caller (e.g. invalidating a cache key).',
        whyHi: '`post_save` par bhaari, side-effectful business logic lटkाना matlab ye *har* tarike ke liye fire hoता hai jismें ek `Order` row banती hai — ek test factory, ek data migration, ek admin action. Aapko surprise charges, tests mein emails milते hain. Operation ko ek explicit service function mein rakhो jise view call karता hai; signals sirf un reactions ke liye jо genuinely har save par honi chahिए.',
      },
    ],

    realWorld: [
      {
        en: '**The reliable stack: DB constraints for invariants + serializer/form validation for UX + optional `full_clean()` in `save()` for models edited from many entry points.** Teams treat `Meta.constraints` as the source of truth and the serializer check as a mirror that produces a 400 instead of a raw `IntegrityError`.',
        hi: '**Vishwasniya stack: invariants ke liye DB constraints + UX ke liye serializer/form validation + kai entry points se edit hone waale models ke liye `save()` mein optional `full_clean()`.** Teams `Meta.constraints` ko source of truth maanती hain.',
      },
      {
        en: '**`save(update_fields=[...])` is standard in hot paths and `save()` overrides** — a status transition, a counter bump, `last_seen_at`. It halves the write, avoids clobbering concurrent edits to other columns, and skips `pre_save` work for untouched fields. `refresh_from_db(fields=[...])` pairs with it after a `QuerySet.update()`.',
        hi: '**`save(update_fields=[...])` hot paths aur `save()` overrides mein standard hai** — ek status transition, ek counter bump. Ye write aadha karता hai, doosre columns mein concurrent edits clobber karने se bachता hai.',
      },
      {
        en: '**`QuerySet.update()` + explicit `updated_at=timezone.now()` for bulk state changes** — marking a batch of jobs failed, expiring a set of tokens, bumping a denormalised count. Fast, race-safe, one round trip; the cost is that signals/`auto_now`/`save()` logic do not run, so teams document which models are safe to bulk-update.',
        hi: '**Bulk state changes ke liye `QuerySet.update()` + explicit `updated_at=timezone.now()`** — jobs ke ek batch ko failed mark karna, tokens ke ek set ko expire karna. Tez, race-safe; keemat ye ki signals/`auto_now`/`save()` logic nahi chalता.',
      },
    ],

    interviewQA: [
      {
        q: 'Does `Model.save()` run validation? Explain what runs when, and how to guarantee an invariant.',
        qHi: 'Kya `Model.save()` validation chalाता hai? Samjhाओ kya kab chalता hai, aur ek invariant kaise guarantee karें.',
        a: 'No. This is one of the most surprising things about Django for newcomers. Model dot save is a persistence operation: it resolves auto_now and auto_now_add, sends the pre_save signal, emits the INSERT or UPDATE, and sends post_save. It does not call full_clean, so it does not run field validators, does not run your clean method, does not check choices, and does not enforce anything that is only declared at the Python level. What actually validates is a separate method, full_clean, which runs clean_fields — per-field type coercion, the blank check, and the field validators — then clean, your cross-field method, then validate_unique and validate_constraints. Something has to call full_clean for any of that to happen. On a normal web request through a Django ModelForm, the form calls the model instance\'s full_clean as part of is_valid, so validation does run. A DRF serializer runs its own field and object validation and, for a ModelSerializer, adds validators derived from the model like uniqueness and max length, but it does not call the model\'s full_clean unless you wire it in. Anywhere else — a bare save in a service or the shell, a data migration, a management command, QuerySet dot update, bulk_create — nothing calls full_clean, so whatever you pass is written, subject only to what the database itself enforces. That last point is the answer to guaranteeing an invariant: put it in the database. A NOT NULL column, a UNIQUE constraint, a CheckConstraint in Meta dot constraints, a foreign key constraint — these are compiled into the schema and enforced on every write path without exception, including bulk operations and other services. A rule that lives only in clean is a nicety for producing a friendly form error, not a guarantee. The reliable pattern is: database constraints for the hard invariant, a matching check in the serializer or form so the common path returns a clean 400 instead of a raw IntegrityError, and optionally calling full_clean inside save for models that are edited from many code paths and where the validation cost is acceptable.',
        aHi: 'Nahi. Ye Django ke baare mein newcomers ke liye sabse ascharyajanak cheezon mein se ek hai. Model dot save ek persistence operation hai: ye auto_now resolve karता hai, pre_save signal bhejता hai, INSERT ya UPDATE emit karता hai, aur post_save bhejता hai. Ye full_clean call nahi karता, toh ye field validators nahi chalाता, aapki clean method nahi chalाता, choices check nahi karता. Jо asal mein validate karता hai wo ek alag method hai, full_clean, jо clean_fields chalाता hai — per-field type coercion, blank check, field validators — phir clean, aapki cross-field method, phir validate_unique aur validate_constraints. Kisi ko full_clean call karna hoता hai. Ek normal web request par ek Django ModelForm ke through, form is_valid ke hisse ki tarah model instance ka full_clean call karता hai. Ek DRF serializer apni validation chalाता hai par model ka full_clean call nahi karता jab tak aap ise wire na karो. Kahin aur — ek bare save, ek data migration, QuerySet dot update, bulk_create — kuch full_clean call nahi karता. Ek invariant guarantee karने ka jawaab: ise database mein daalо. Ek CheckConstraint, ek UNIQUE constraint — ye har write path par bina apwad enforce hote hain.',
      },
      {
        q: 'When would you use `save(update_fields=...)` vs `QuerySet.update()` vs `bulk_update()`, and what are the trade-offs?',
        qHi: 'Aap `save(update_fields=...)` vs `QuerySet.update()` vs `bulk_update()` kab istemal karोge, aur trade-offs kya hain?',
        a: 'All three write to the database but at different granularities and with different side effects. save with update_fields is for updating one loaded instance when you only changed a few columns. It emits an UPDATE that sets exactly those columns where id equals the object\'s id, which is faster than rewriting every column, holds a smaller lock, and crucially does not clobber a concurrent change someone else made to a column you did not touch. It still goes through Model dot save, so pre_save and post_save fire, though pre_save is limited to the listed fields, and auto_now on a field in the list is still applied. You use it in save overrides and hot paths like a status transition or bumping last_seen_at. QuerySet dot update is for changing a column across many rows in one statement — filter to the rows, call update with the new values, and Django issues a single SQL UPDATE. It never instantiates the objects, never calls save, never sends pre_save or post_save, and never applies auto_now, so if the model has an updated_at with auto_now you must pass updated_at equals now yourself. It is the fastest and most race-safe way to do a simple set-a-column operation on a batch — mark these jobs failed, expire these tokens — precisely because there is no per-object Python. The trade-off is that any logic in save, any signal handler, and auto_now are all skipped. bulk_update sits between them: you have a list of already-loaded, already-modified instances and you want to persist them in a few statements instead of one save each. Django generates UPDATE statements using CASE expressions to set different values per row, batched. It also skips save, skips auto_now, and fires signals inconsistently, and it does not touch the primary key. You use it in backfills and batch jobs where you had to load and transform the objects in Python but do not want N round trips. The general guidance: update_fields for one object and a targeted change, QuerySet dot update for a uniform change across many rows where you do not need per-object logic, and bulk_update when per-object computation forced you to load them but you still want few queries — and in all the bulk cases, remember that save-time behaviour does not run.',
        aHi: 'Teeno database mein likhते hain par alag granularities aur alag side effects ke saath. save with update_fields ek loaded instance update karने ke liye hai jab aapne sirf kuch columns badle. Ye ek UPDATE emit karта hai jо bilkul un columns ko set karता hai, jо har column rewrite karने se tez hai, ek chhota lock hold karता hai, aur mahatvapoorn roop se ek concurrent change clobber nahi karता jо kisi aur ne ek column mein kiya jise aapne nahi chhua. Ye abhi bhi Model dot save se guzarта hai, toh pre_save aur post_save fire hote hain. QuerySet dot update kai rows mein ek column badalने ke liye hai ek statement mein. Ye kabhi objects instantiate nahi karता, kabhi save call nahi karता, kabhi pre_save ya post_save nahi bhejता, aur kabhi auto_now apply nahi karता. Ye ek batch par ek simple set-a-column operation karने ka sabse tez aur sabse race-safe tarika hai. bulk_update unke beech baithता hai: aapke paas pehle se loaded, modified instances ki ek list hai aur aap unhe kuch statements mein persist karना chahते ho.',
      },
    ],

    exercises: [
      {
        task: 'Model `Voucher` with `code` (CharField) and `discount_percent` (IntegerField). Add a `clean()` that raises `ValidationError({"discount_percent": ...})` if it is not 1..100. Show that (a) `Voucher(code="X", discount_percent=500).save()` succeeds (print the row count), and (b) a fresh `Voucher(code="Y", discount_percent=500).full_clean()` raises, printing the failing field.',
        taskHi: '`Voucher` model karो `code` aur `discount_percent` ke saath. Ek `clean()` add karो jо `ValidationError` raise kare agar ye 1..100 nahi. Dikhाओ ki (a) `.save()` safal hoता hai aur (b) `full_clean()` raise karता hai.',
        hint: '`from django.core.exceptions import ValidationError`. `clean`: `if not (1 <= self.discount_percent <= 100): raise ValidationError({"discount_percent": "must be 1-100"})`. `.save()` never calls `clean`; `full_clean()` does.',
        hintHi: '`clean`: `if not (1 <= self.discount_percent <= 100): raise ValidationError({"discount_percent": "must be 1-100"})`. `.save()` `clean` call nahi karता; `full_clean()` karता hai.',
      },
      {
        task: 'Model `Account` with `balance_cents = IntegerField()` and `Meta.constraints = [CheckConstraint(condition=Q(balance_cents__gte=0), name="nonneg")]`. Create the table and an account with `balance_cents=100`. Show that `Account.objects.filter(pk=acc.pk).update(balance_cents=-50)` raises `IntegrityError` (the constraint holds even though `.update()` skips validation entirely). Then a valid `update(balance_cents=50)` succeeds.',
        taskHi: '`Account` model karो `balance_cents` aur ek `CheckConstraint` (`balance_cents >= 0`) ke saath. Table aur ek account banाओ. Dikhाओ ki `.update(balance_cents=-50)` `IntegrityError` raise karता hai (constraint holds chahe `.update()` validation poori tarah skip kare).',
        hint: '`from django.db import IntegrityError`. `QuerySet.update()` runs no Python validation at all, but the DB `CHECK` constraint is still enforced on the `UPDATE` statement.',
        hintHi: '`from django.db import IntegrityError`. `QuerySet.update()` koi Python validation nahi chalाता, par DB `CHECK` constraint abhi bhi enforce hoता hai.',
      },
      {
        task: 'Model `Doc` with `title`, `status` (default `"draft"`), `updated_at = DateTimeField(auto_now=True)`. Connect a `post_save` receiver that increments a module counter. Create a doc via `Doc.objects.create(...)` (counter -> 1, `updated_at` set). Sleep 10ms, then `Doc.objects.filter(pk=d.pk).update(status="published")`. Print: counter (still 1 — no `post_save`), and whether `updated_at` changed (False — `auto_now` skipped). Then `d.refresh_from_db()` and confirm `status` is `"published"`.',
        taskHi: '`Doc` model karो `title`, `status`, `updated_at = auto_now` ke saath. Ek `post_save` receiver connect karो jо ek counter badhाe. `Doc.objects.create(...)` se banाओ. Phir `.update(status="published")`. Print karो: counter (abhi 1), kya `updated_at` badla (False). Phir `refresh_from_db()`.',
        hint: '`@receiver(post_save, sender=Doc)`. `.create()` -> `save()` -> `post_save` + `auto_now`. `.update()` -> raw SQL -> neither. `d.refresh_from_db()` reloads the row so the in-memory `d.status` catches up.',
        hintHi: '`@receiver(post_save, sender=Doc)`. `.create()` -> `save()` -> `post_save` + `auto_now`. `.update()` -> raw SQL -> koi nahi. `d.refresh_from_db()` row reload karта hai.',
      },
    ],

    keyTakeaways: [
      '`Model.save()` does NOT run validation — no field validators, no `clean()`, no `choices` check. It resolves `auto_now`, fires `pre_save`/`post_save`, and emits the SQL. Only `full_clean()` validates, and something must CALL it.',
      '`ModelForm.is_valid()` calls `instance.full_clean()`; the Django admin does; DRF `ModelSerializer` runs its OWN validation (uniqueness, max_length from the model) but does NOT call `model.full_clean()` unless you wire it in. A bare `.save()`, `QuerySet.update()`, `bulk_create`, migrations, and commands do NOT.',
      'Guarantee invariants with DATABASE constraints (`NOT NULL`, `UNIQUE`, `CheckConstraint`, FK) — enforced on EVERY write path. `clean()` / field options / `choices` are validation-layer niceties for friendly errors, not guarantees.',
      '`full_clean()` runs, in order: `clean_fields()` (per-field: coercion, `blank`, validators) -> `clean()` (your cross-field method, raise `ValidationError` with a dict) -> `validate_unique()` + `validate_constraints()`.',
      '`save()` override shape: do pre-save work, then ALWAYS `super().save(*args, **kwargs)` (never bare `super().save()` — drops `update_fields`/`force_insert`/`using`). No slow I/O in `save()` — use `transaction.on_commit` / a task. Remember `save()` fires for admin, shell, tests, every path.',
      '`obj.save(update_fields=[...])` = `UPDATE` only those columns: faster, smaller lock, won\'t clobber concurrent edits to other columns. `obj.refresh_from_db(fields=[...])` reloads after a `QuerySet.update()` or a trigger.',
      '`QuerySet.update()` = one SQL `UPDATE`, MANY rows: NO `save()`, NO `pre_save`/`post_save`, NO `auto_now` (pass `updated_at=timezone.now()` yourself), NO `full_clean`. `bulk_create`/`bulk_update` similarly skip per-object `save()` and `auto_now_add`.',
      'Signals (`pre_save`/`post_save`/`m2m_changed`, connected in `AppConfig.ready()`) make control flow non-obvious and fire for every code path (tests, migrations, fixtures). Use an explicit service function for operation logic; reserve signals for truly caller-independent reactions.',
    ],
    keyTakeawaysHi: [
      '`Model.save()` validation NAHI chalाता — koi field validators, koi `clean()`, koi `choices` check. Ye `auto_now` resolve karта hai, `pre_save`/`post_save` fire karता hai, aur SQL emit karता hai. Sirf `full_clean()` validate karता hai, aur kisi ko ise CALL karna hoता hai.',
      '`ModelForm.is_valid()` `instance.full_clean()` call karता hai; admin karта hai; DRF `ModelSerializer` apni validation chalाता hai par `model.full_clean()` call NAHI karता jab tak aap wire na karो. Ek bare `.save()`, `QuerySet.update()`, `bulk_create`, migrations NAHI karते.',
      'Invariants ko DATABASE constraints se guarantee karो (`NOT NULL`, `UNIQUE`, `CheckConstraint`, FK) — HAR write path par enforce. `clean()` / field options / `choices` friendly errors ke liye niceties hain, guarantees nahi.',
      '`full_clean()` kram mein chalता hai: `clean_fields()` -> `clean()` (aapki cross-field method) -> `validate_unique()` + `validate_constraints()`.',
      '`save()` override shape: pre-save kaam karो, phir HAMESHA `super().save(*args, **kwargs)` (kabhi bare `super().save()` nahi — `update_fields` drop karता hai). `save()` mein koi slow I/O nahi. Yaad rakhो `save()` admin, shell, tests ke liye fire hoता hai.',
      '`obj.save(update_fields=[...])` = sirf un columns ka `UPDATE`: tez, chhota lock, doosre columns mein concurrent edits clobber nahi karta. `obj.refresh_from_db(fields=[...])` ek `QuerySet.update()` ke baad reload karता hai.',
      '`QuerySet.update()` = ek SQL `UPDATE`, KAI rows: KOI `save()`, `pre_save`/`post_save`, `auto_now` (`updated_at=timezone.now()` khud pass karो), `full_clean` nahi. `bulk_create`/`bulk_update` isi tarah per-object `save()` aur `auto_now_add` skip karते hain.',
      'Signals (`AppConfig.ready()` mein connected) control flow non-obvious banаते hain aur har code path (tests, migrations, fixtures) ke liye fire hote hain. Operation logic ke liye ek explicit service function istemal karो.',
    ],
  },
];
