/**
 * Django Complete Course — Module 13: Advanced ORM Expressions & Generic Relations, lesson 3.
 *
 * Lesson 3: ContentType, GenericForeignKey, GenericRelation — the contenttypes framework,
 *           a model (Comment / Tag / AuditLog / Attachment) that can point at ANY model via
 *           (content_type, object_id) + GenericForeignKey; the reverse GenericRelation and
 *           its cascade; the N+1 when iterating .target across content types and prefetching
 *           it; querying by (content_type, object_id) directly; and when a generic relation
 *           is the wrong call (a concrete FK or a join table is usually better).
 *
 * Verified against Django 6.1 on SQLite (orm_probe3.py): GFK resolution, GenericRelation
 * reverse + delete cascade, the N+1 (3 comments -> 4 queries) and prefetch_related('target')
 * collapsing it to (1 + #content_types).
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_13_PART2: CourseLesson[] = [
  {
    slug: 'dj-content-types-and-generic-relations',
    title: 'Content Types & Generic Relations: One Model, Many Targets',
    titleHi: 'Content Types Aur Generic Relations: Ek Model, Kई Targets',
    description: 'A `Comment`, a `Tag`, an `AuditLog` entry, an `Attachment` — each needs to attach to *any* model in your app, not one. The contenttypes framework gives every model a numeric id, and a `GenericForeignKey` stores `(content_type_id, object_id)` so one row can point at an article, a photo, or a product.',
    descriptionHi: 'Ek `Comment`, ek `Tag`, ek `AuditLog` entry, ek `Attachment` — har ek ko aapke app ke *kisi bhi* model se attach hona hai, ek se nahi. Contenttypes framework har model ko ek numeric id deता hai, aur ek `GenericForeignKey` `(content_type_id, object_id)` store karता hai taaki ek row ek article, ek photo, ya ek product par point kar sake.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: '**A single "sticky note" pad that can attach to any document in the building.** A normal foreign key is a note pre-printed "re: Invoice #___" — it only sticks to invoices. A **generic** note has two blanks: "re: [document type] number [id]". To file one you write down *which kind* of thing it refers to — "type 12, which the registry says means Invoice" (that is the **ContentType**, a row in a lookup table mapping every model to a number) — and the item\'s own number. Now one pad of notes serves invoices, contracts, blueprints, and photos. The cost shows up when you pick up a stack of notes and want to see what each is stuck to: you cannot follow them all in one trip, because they point into different filing cabinets — you sort the stack by document type and make one trip per cabinet (that is what prefetching a generic relation does). And the registry lookup is indirection every single time: the note says "type 12", and you always have to check what 12 means.',
      hi: '**Ek single "sticky note" pad jо building ke kisi bhi document se attach ho sakta hai.** Ek normal foreign key ek note hai jо pehle se "re: Invoice #___" printed hai — ye sirf invoices se chipakता hai. Ek **generic** note ke do blanks hain: "re: [document type] number [id]". Ek file karne ke liye aap likhते ho *kaunsी tarah* ki cheez ise refer karती hai — "type 12, jо registry kehta hai matlab Invoice" (wo **ContentType** hai, ek lookup table mein ek row jо har model ko ek number se map karता hai) — aur item ka apna number. Ab notes ka ek pad invoices, contracts, blueprints, aur photos serve karता hai. Cost tab dikhती hai jab aap notes ka ek stack uthाते ho aur dekhना chahते ho har kis se chipka hai: aap sabko ek trip mein follow nahi kar sakte, kyunki wo alag filing cabinets mein point karते hain — aap stack ko document type se sort karके prati cabinet ek trip karते ho (wo ek generic relation prefetch karna karता hai).',
    },

    simple: `**The three pieces**

\`\`\`python
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType

class Comment(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)   # WHICH model
    object_id    = models.PositiveIntegerField()                              # WHICH row
    target       = GenericForeignKey("content_type", "object_id")             # the virtual FK
    body         = models.TextField()
    created      = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["content_type", "object_id"])]        # ALWAYS add this
\`\`\`

**Writing and reading**

\`\`\`python
article = Article.objects.get(pk=1)
Comment.objects.create(target=article, body="great post")   # sets content_type + object_id for you

c = Comment.objects.first()
c.target            # -> the Article instance (a query, unless prefetched)
c.content_type      # -> <ContentType: article>
c.object_id         # -> 1
\`\`\`

**The reverse side: \`GenericRelation\`**

\`\`\`python
class Article(models.Model):
    title = models.CharField(max_length=200)
    comments = GenericRelation(Comment)          # reverse accessor + delete cascade

article.comments.all()                            # the comments on THIS article
article.comments.create(body="inline")           # target is set automatically
article.delete()                                  # its Comments are deleted too (via GenericRelation)
\`\`\`

**Querying without the GenericRelation**

\`\`\`python
ct = ContentType.objects.get_for_model(Article)          # cached after first call
Comment.objects.filter(content_type=ct, object_id=article.pk)
Comment.objects.filter(content_type=ct, object_id__in=[1, 2, 3])
\`\`\`

**The N+1 and the fix**

\`\`\`python
for c in Comment.objects.all():
    print(c.target)        # one query PER comment (worse: grouped by content type)

for c in Comment.objects.prefetch_related("target"):
    print(c.target)        # 1 query for comments + 1 per distinct content type
\`\`\`

\`\`\`
GenericForeignKey is NOT a real DB column -- it is content_type_id + object_id + Python glue.
  no database-level foreign key constraint  -> orphan rows are possible
  no JOIN to it  -> you cannot select_related("target"); filtering across it is limited
  always: an index on (content_type, object_id), and prefetch_related when iterating .target
\`\`\``,

    simpleHi: `**Teen tukdे**

\`\`\`python
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType

class Comment(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)   # KAUNSA model
    object_id    = models.PositiveIntegerField()                              # KAUNSI row
    target       = GenericForeignKey("content_type", "object_id")             # virtual FK
    body         = models.TextField()
    created      = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["content_type", "object_id"])]        # HAMESHA add karो
\`\`\`

**Likhना aur padhना**

\`\`\`python
article = Article.objects.get(pk=1)
Comment.objects.create(target=article, body="great post")   # aapke liye content_type + object_id set karता hai

c = Comment.objects.first()
c.target            # -> Article instance (ek query, jab tak prefetched na ho)
c.content_type      # -> <ContentType: article>
c.object_id         # -> 1
\`\`\`

**Reverse side: \`GenericRelation\`**

\`\`\`python
class Article(models.Model):
    title = models.CharField(max_length=200)
    comments = GenericRelation(Comment)          # reverse accessor + delete cascade

article.comments.all()                            # IS article par comments
article.comments.create(body="inline")           # target apne aap set hota hai
article.delete()                                  # iske Comments bhi delete hote hain
\`\`\`

**GenericRelation ke bina querying**

\`\`\`python
ct = ContentType.objects.get_for_model(Article)          # pehli call ke baad cached
Comment.objects.filter(content_type=ct, object_id=article.pk)
Comment.objects.filter(content_type=ct, object_id__in=[1, 2, 3])
\`\`\`

**N+1 aur fix**

\`\`\`python
for c in Comment.objects.all():
    print(c.target)        # prati comment EK query

for c in Comment.objects.prefetch_related("target"):
    print(c.target)        # comments ke liye 1 query + prati distinct content type 1
\`\`\`

\`\`\`
GenericForeignKey ek asli DB column NAHI hai -- ye content_type_id + object_id + Python glue hai.
  koi database-level foreign key constraint nahi  -> orphan rows sambhav hain
  ispar koi JOIN nahi  -> aap select_related("target") nahi kar sakte
  hamesha: (content_type, object_id) par ek index, aur .target iterate karते samay prefetch_related
\`\`\``,

    content: `## The contenttypes framework

\`django.contrib.contenttypes\` (installed by default) maintains one table, \`django_content_type\`, with a row for **every model in every installed app** — \`(app_label, model)\` and an auto \`id\`. So \`article\` might be content type 7, \`photo\` 8, \`product\` 9. \`ContentType.objects.get_for_model(Article)\` returns that row (and caches it, so repeated calls are free). This numeric id is what lets a single column "name" any model.

## \`GenericForeignKey\`

A model that must reference *any* model uses **three fields**:

1. \`content_type = ForeignKey(ContentType, on_delete=CASCADE)\` — which model.
2. \`object_id = PositiveIntegerField()\` — which row's PK. (Use \`CharField\`/\`UUIDField\` if your targets have non-integer PKs — the types must match.)
3. \`target = GenericForeignKey("content_type", "object_id")\` — **not a database column.** It is a Python descriptor: reading \`c.target\` does \`content_type.get_object_for_this_type(pk=object_id)\`; assigning \`c.target = article\` sets both underlying fields.

Assigning through the \`GenericForeignKey\` on \`create\` is the clean way — \`Comment.objects.create(target=article, body=...)\` fills \`content_type_id\` and \`object_id\`.

## \`GenericRelation\` — the reverse side

On the *target* model, \`GenericRelation(Comment)\` adds:

- a **reverse manager**: \`article.comments.all()\`, \`.filter()\`, \`.create()\` (auto-sets the target).
- **delete cascade**: deleting the article deletes its comments. (Without \`GenericRelation\`, deleting an article leaves orphan comment rows — there is no DB constraint.)
- **queryability**: \`Article.objects.annotate(n=Count("comments"))\`, \`Article.objects.filter(comments__body__icontains="bug")\`.

\`GenericRelation\` is optional and per-target — you add it to the models where you actually need the reverse accessor or the cascade. A model can have a \`GenericForeignKey\` pointing at models that do *not* have the matching \`GenericRelation\`; you just lose the reverse convenience for those.

## The costs

**1. No referential integrity.** \`object_id\` is a plain integer with no foreign-key constraint. If the target row is deleted and there is no \`GenericRelation\` cascade, the comment becomes an orphan pointing at a non-existent id — and \`c.target\` returns \`None\`. You are responsible for cleanup.

**2. No \`select_related\`, limited filtering.** There is no real join, so \`Comment.objects.select_related("target")\` is impossible. \`Comment.objects.filter(target__title="x")\` does **not** work — you filter via \`content_type\` + \`object_id\`, or via a \`GenericRelation\` from the other side. Cross-type queries ("all comments on anything owned by user U") are genuinely hard.

**3. The N+1.** Iterating \`.target\` over a queryset of mixed content types issues a query per row (Django groups by content type internally, but it is still one query per distinct \`(content_type, object_id)\` without prefetch). **\`prefetch_related("target")\`** collapses it to one query for the base rows plus one per distinct content type — Django groups the \`object_id\`s by \`content_type\` and does an \`id__in\` fetch per type.

**4. Indexing is on you.** Add \`Meta.indexes = [Index(fields=["content_type", "object_id"])]\` — without it, \`article.comments.all()\` and every reverse lookup is a full scan. This is the single most common generic-relations performance bug.

## When a generic relation is the *wrong* tool

Reach for it only when the "attach to anything" requirement is real and open-ended. It is overkill — and worse than a plain design — when:

- **There are only two or three target types.** A \`Comment\` with nullable \`article = FK(null=True)\` and \`photo = FK(null=True)\` (with a check constraint that exactly one is set) keeps referential integrity, allows \`select_related\`, and is easier to query. Or a small \`Commentable\` base with concrete subclasses.
- **You need to query across the relation often.** "Show me every comment on a published article" is a clean join with concrete FKs and a nightmare with a \`GenericForeignKey\`.
- **The targets share behaviour.** If \`Article\`, \`Photo\`, \`Video\` are all "content", a shared base model (concrete or abstract) with one real FK to it is cleaner than a generic pointer.

Generic relations shine for genuinely cross-cutting concerns: **tagging**, **audit logs / activity streams**, **attachments**, **reactions/likes**, **flags/reports** — things that legitimately apply to a dozen unrelated models and where you rarely need to join *from* the target side in bulk. Django's own admin \`LogEntry\` uses exactly this pattern.

## Practical checklist

- Index \`(content_type, object_id)\` — always.
- Add \`GenericRelation\` on target models that need the reverse accessor or the delete cascade.
- \`prefetch_related("target")\` whenever you iterate \`.target\`; \`prefetch_related("comments")\` (the \`GenericRelation\` name) from the other side.
- Cache the \`ContentType\` (\`get_for_model\` already does) rather than querying \`django_content_type\` in a loop.
- If you find yourself writing complex cross-type queries, reconsider whether concrete FKs fit better.`,

    contentHi: `## Contenttypes framework

\`django.contrib.contenttypes\` (default se installed) ek table maintain karता hai, \`django_content_type\`, **har installed app ke har model** ke liye ek row ke saath — \`(app_label, model)\` aur ek auto \`id\`. To \`article\` content type 7 ho sakta hai, \`photo\` 8, \`product\` 9. \`ContentType.objects.get_for_model(Article)\` wo row return karता hai (aur ise cache karता hai, to baar-baar calls muft hain).

## \`GenericForeignKey\`

Ek model jise *kisi bhi* model ko reference karना hai **teen fields** istemal karता hai:

1. \`content_type = ForeignKey(ContentType, on_delete=CASCADE)\` — kaunsa model.
2. \`object_id = PositiveIntegerField()\` — kaunsi row ki PK. (Non-integer PKs ke liye \`CharField\`/\`UUIDField\` istemal karो — types match hone chahिए.)
3. \`target = GenericForeignKey("content_type", "object_id")\` — **ek database column NAHI.** Ye ek Python descriptor hai.

\`create\` par \`GenericForeignKey\` ke through assign karna saaf tareeka hai — \`Comment.objects.create(target=article, body=...)\`.

## \`GenericRelation\` — reverse side

*Target* model par, \`GenericRelation(Comment)\` joडता hai:

- ek **reverse manager**: \`article.comments.all()\`, \`.filter()\`, \`.create()\`.
- **delete cascade**: article ko delete karne se iske comments delete hote hain. (\`GenericRelation\` ke bina, ek article delete karna orphan comment rows chhodता hai.)
- **queryability**: \`Article.objects.annotate(n=Count("comments"))\`.

\`GenericRelation\` optional aur per-target hai.

## Costs

**1. Koi referential integrity nahi.** \`object_id\` bina foreign-key constraint ke ek plain integer hai. Agar target row delete ho jaती hai aur koi \`GenericRelation\` cascade nahi hai, comment ek orphan ban jaता hai — aur \`c.target\` \`None\` return karता hai.

**2. Koi \`select_related\` nahi, limited filtering.** Koi asli join nahi hai, to \`Comment.objects.select_related("target")\` asambhav hai. \`Comment.objects.filter(target__title="x")\` kaam **nahi** karता — aap \`content_type\` + \`object_id\` ke through filter karते ho.

**3. N+1.** Mixed content types ke ek queryset par \`.target\` iterate karna prati row ek query issue karता hai. **\`prefetch_related("target")\`** ise base rows ke liye ek query plus prati distinct content type ek mein collapse karता hai.

**4. Indexing aap par hai.** \`Meta.indexes = [Index(fields=["content_type", "object_id"])]\` add karो — iske bina, har reverse lookup ek full scan hai. Ye sabse aam generic-relations performance bug hai.

## Jab ek generic relation *galat* tool hai

Ise sirf tab istemal karो jab "kisi bhi cheez se attach" requirement asli aur open-ended hai. Ye overkill hai jab:

- **Sirf do ya teen target types hain.** Nullable \`article = FK(null=True)\` aur \`photo = FK(null=True)\` waala ek \`Comment\` (ek check constraint ke saath ki theek ek set hai) referential integrity rakhता hai.
- **Aapको relation ke paar aksar query karना hai.** "har published article par har comment dikhाओ" concrete FKs ke saath ek saaf join hai.
- **Targets behaviour share karते hain.** Ek shared base model ek asli FK ke saath saaf hai.

Generic relations genuinely cross-cutting concerns ke liye chamakते hain: **tagging**, **audit logs**, **attachments**, **reactions/likes**, **flags/reports**. Django ka apna admin \`LogEntry\` theek ye pattern istemal karता hai.

## Practical checklist

- \`(content_type, object_id)\` index karो — hamesha.
- Reverse accessor ya delete cascade ki zaroorat waale target models par \`GenericRelation\` add karो.
- Jab bhi \`.target\` iterate karो \`prefetch_related("target")\`.
- \`ContentType\` cache karो.
- Agar aap complex cross-type queries likh rahe ho, phir se soचो ki concrete FKs behtar fit hain.`,

    examples: [
      {
        title: 'GenericForeignKey resolves to different model types; GenericRelation reverses',
        titleHi: 'GenericForeignKey alag model types par resolve hota hai; GenericRelation reverse karta hai',
        code: `import os, django
from django.conf import settings
os.path.exists("g1.sqlite3") and os.remove("g1.sqlite3")
settings.configure(DEBUG=True, SECRET_KEY="x"*50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "g1.sqlite3"}})
django.setup()
from django.db import models, connection
from django.core.management import call_command
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
call_command("migrate", run_syncdb=True, verbosity=0)

class Article(models.Model):
    title = models.CharField(max_length=40)
    comments = GenericRelation("contenttypes.Comment")
    class Meta: app_label = "contenttypes"
class Photo(models.Model):
    caption = models.CharField(max_length=40)
    class Meta: app_label = "contenttypes"
class Comment(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target = GenericForeignKey("content_type", "object_id")
    body = models.CharField(max_length=40)
    class Meta:
        app_label = "contenttypes"
        indexes = [models.Index(fields=["content_type", "object_id"])]
with connection.schema_editor() as se:
    se.create_model(Article); se.create_model(Photo); se.create_model(Comment)

art = Article.objects.create(title="Django 6")
pho = Photo.objects.create(caption="Sunset")
Comment.objects.create(target=art, body="great article")
Comment.objects.create(target=art, body="thanks")
Comment.objects.create(target=pho, body="nice colors")

for c in Comment.objects.all():
    print(f"{c.body!r} -> {type(c.target).__name__}")
print("article.comments:", [c.body for c in art.comments.all()])`,
        output: `'great article' -> Article
'thanks' -> Article
'nice colors' -> Photo
article.comments: ['great article', 'thanks']`,
        explain: '`Comment.objects.create(target=art, ...)` set both `content_type` (to the Article content type) and `object_id` for you. Reading `c.target` resolves back to the right model instance -- an `Article` for two comments, a `Photo` for the third -- from a single `Comment` table. The `GenericRelation` on `Article` gives the reverse `art.comments.all()`.',
        explainHi: '`Comment.objects.create(target=art, ...)` aapke liye `content_type` (Article content type par) aur `object_id` dono set karता hai. `c.target` padhना sahi model instance par wapas resolve hota hai -- do comments ke liye ek `Article`, teesre ke liye ek `Photo` -- ek single `Comment` table se. `Article` par `GenericRelation` reverse `art.comments.all()` deता hai.',
      },
      {
        title: 'The N+1 on .target, and prefetch_related collapsing it',
        titleHi: '.target par N+1, aur prefetch_related ise collapse karta hua',
        code: `import os, django
from django.conf import settings
os.path.exists("g2.sqlite3") and os.remove("g2.sqlite3")
settings.configure(DEBUG=True, SECRET_KEY="x"*50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "g2.sqlite3"}})
django.setup()
from django.db import models, connection
from django.core.management import call_command
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.test.utils import CaptureQueriesContext
call_command("migrate", run_syncdb=True, verbosity=0)

class Article(models.Model):
    title = models.CharField(max_length=40)
    class Meta: app_label = "contenttypes"
class Photo(models.Model):
    caption = models.CharField(max_length=40)
    class Meta: app_label = "contenttypes"
class Comment(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target = GenericForeignKey("content_type", "object_id")
    class Meta: app_label = "contenttypes"
with connection.schema_editor() as se:
    se.create_model(Article); se.create_model(Photo); se.create_model(Comment)

a = Article.objects.create(title="A")
p = Photo.objects.create(caption="P")
for t in (a, a, p, p, a):
    Comment.objects.create(target=t)

with CaptureQueriesContext(connection) as c1:
    _ = [str(c.target) for c in Comment.objects.all()]
print("naive .target loop:", len(c1.captured_queries), "queries for 5 comments")

with CaptureQueriesContext(connection) as c2:
    _ = [str(c.target) for c in Comment.objects.prefetch_related("target")]
print("prefetch_related:  ", len(c2.captured_queries), "queries (1 base + 1 per content type)")`,
        output: `naive .target loop: 6 queries for 5 comments
prefetch_related:   3 queries (1 base + 1 per content type)`,
        explain: 'A `GenericForeignKey` has no join, so `c.target` is a fresh query per comment: 5 comments cost 1 base query + 5 lookups = 6. `prefetch_related("target")` is generic-relation aware -- it collects the `object_id`s from the result, groups them by `content_type`, and runs one `id__in` query per type. Two content types (Article, Photo) means 1 + 2 = 3 queries regardless of comment count.',
        explainHi: 'Ek `GenericForeignKey` ka koi join nahi, to `c.target` prati comment ek fresh query hai: 5 comments 1 base query + 5 lookups = 6 kharch karते hain. `prefetch_related("target")` generic-relation aware hai -- ye result se `object_id`s collect karता hai, unhe `content_type` se group karता hai, aur prati type ek `id__in` query chalाता hai. Do content types (Article, Photo) matlab comment count chahे jо ho 1 + 2 = 3 queries.',
      },
      {
        title: 'No DB constraint: deleting the target without a GenericRelation orphans the row',
        titleHi: 'Koi DB constraint nahi: GenericRelation ke bina target delete karna row ko orphan karta hai',
        code: `import os, django
from django.conf import settings
os.path.exists("g3.sqlite3") and os.remove("g3.sqlite3")
settings.configure(DEBUG=True, SECRET_KEY="x"*50, USE_TZ=True,
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "g3.sqlite3"}})
django.setup()
from django.db import models, connection
from django.core.management import call_command
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
call_command("migrate", run_syncdb=True, verbosity=0)

class Post(models.Model):                       # NO GenericRelation -> no cascade
    title = models.CharField(max_length=40)
    class Meta: app_label = "contenttypes"
class Note(models.Model):                       # HAS GenericRelation -> cascades
    title = models.CharField(max_length=40)
    tags = GenericRelation("contenttypes.Tag")
    class Meta: app_label = "contenttypes"
class Tag(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target = GenericForeignKey("content_type", "object_id")
    label = models.CharField(max_length=20)
    class Meta: app_label = "contenttypes"
with connection.schema_editor() as se:
    se.create_model(Post); se.create_model(Note); se.create_model(Tag)

post = Post.objects.create(title="P")
note = Note.objects.create(title="N")
Tag.objects.create(target=post, label="draft")
Tag.objects.create(target=note, label="draft")

post.delete()                                   # Post has no GenericRelation
note.delete()                                   # Note has GenericRelation(Tag)

print("tags remaining:", Tag.objects.count())
orphan = Tag.objects.first()
print("orphan tag label:", orphan.label, "| target:", orphan.target)   # target -> None`,
        output: `tags remaining: 1
orphan tag label: draft | target: None`,
        explain: '`object_id` is a plain integer with no foreign-key constraint, so the database does nothing when a target is deleted. `Note` declares `GenericRelation(Tag)`, so deleting the note cascades to its tag. `Post` does not, so deleting the post leaves its tag behind as an orphan -- one row remains, and its `.target` resolves to `None` because the row it points at is gone.',
        explainHi: '`object_id` bina foreign-key constraint ke ek plain integer hai, to jab ek target delete hota hai database kuch nahi karता. `Note` `GenericRelation(Tag)` declare karता hai, to note delete karna iske tag tak cascade karता hai. `Post` nahi karता, to post delete karna iske tag ko ek orphan ke roop mein peeche chhodता hai -- ek row bachती hai, aur iska `.target` `None` par resolve hota hai kyunki jо row ye point karता hai wo chali gayi.',
      },
    ],

    mistakes: [
      {
        wrong: `class Comment(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target = GenericForeignKey("content_type", "object_id")
    body = models.TextField()
    # no Meta.indexes
# article.comments.all() and every "comments for this object" query is a full table scan`,
        right: `class Comment(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target = GenericForeignKey("content_type", "object_id")
    body = models.TextField()

    class Meta:
        indexes = [models.Index(fields=["content_type", "object_id"])]`,
        why: 'Every lookup of "the rows attached to this object" filters on content_type_id and object_id together. Without a composite index on those two columns, the database scans the entire comment/tag/log table for each such query — fine with a hundred rows, catastrophic with a million. Django does not add this index automatically because it cannot know your access patterns, so it is on you. A composite index on (content_type, object_id) in that order serves both the two-column lookup and content-type-only filters. This is the number-one performance problem with generic relations in the wild.',
        whyHi: 'Har "is object se attached rows" lookup content_type_id aur object_id par ek saath filter karता hai. Un do columns par ek composite index ke bina, database har aisी query ke liye poore comment/tag/log table ko scan karता hai — sau rows ke saath theek, ek million ke saath catastrophic. Django ye index automatically add nahi karता kyunki ye aapke access patterns nahi jान sakta. (content_type, object_id) par us order mein ek composite index dono lookup serve karता hai.',
      },
      {
        wrong: `# rendering a comment list
comments = Comment.objects.filter(...).order_by("-created")
for c in comments:
    render(c.target, c.body)      # c.target -> a DB query for every single comment`,
        right: `comments = Comment.objects.filter(...).order_by("-created").prefetch_related("target")
for c in comments:
    render(c.target, c.body)      # 1 query for comments + 1 per distinct content type
# for the reverse direction, prefetch the GenericRelation name:
articles = Article.objects.prefetch_related("comments")`,
        why: 'A GenericForeignKey has no join, so accessing c.target triggers a separate query to load that one object, and doing it in a loop is a classic N+1 — worse than a normal FK N+1 because the targets are spread across multiple tables. prefetch_related("target") is generic-relation aware: it collects all the object_ids from the result, groups them by content_type, and issues one id__in query per content type, then wires the objects back onto each row. The cost drops from one-per-row to one-per-distinct-model. From the target side, prefetch_related on the GenericRelation attribute name does the equivalent for the reverse accessor.',
        whyHi: 'Ek GenericForeignKey ka koi join nahi hai, to c.target access karna us ek object ko load karne ke liye ek alag query trigger karता hai, aur ise ek loop mein karna ek classic N+1 hai — ek normal FK N+1 se bura kyunki targets kई tables ke paar failе hain. prefetch_related("target") generic-relation aware hai: ye result se sabhi object_ids collect karता hai, unhe content_type se group karता hai, aur prati content type ek id__in query issue karता hai. Cost one-per-row se one-per-distinct-model tak girता hai.',
      },
      {
        wrong: `# only Article and Photo will ever be commentable, but "let's be flexible"
class Comment(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target = GenericForeignKey("content_type", "object_id")
# now: no FK integrity, no select_related, "comments on published articles" is painful`,
        right: `class Comment(models.Model):
    article = models.ForeignKey(Article, null=True, blank=True, on_delete=models.CASCADE, related_name="comments")
    photo   = models.ForeignKey(Photo,   null=True, blank=True, on_delete=models.CASCADE, related_name="comments")
    body    = models.TextField()

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(Q(article__isnull=False) & Q(photo__isnull=True)) |
                      (Q(article__isnull=True) & Q(photo__isnull=False)),
                name="comment_exactly_one_target"),
        ]
# real FK constraints, select_related("article"), clean joins for reporting`,
        why: 'Generic relations trade away referential integrity, select_related, and easy cross-relation queries for the ability to point at any model. That trade only pays off when "any model" is genuinely open-ended — tagging, audit logs, attachments across a dozen types. When there are two or three known target types, nullable concrete foreign keys with a check constraint that exactly one is set give you real database integrity, JOIN-based queries, select_related, and admin inlines, at the cost of one migration when you add a fourth type. For a small, stable set of targets that is almost always the better design.',
        whyHi: 'Generic relations referential integrity, select_related, aur aasान cross-relation queries ko kisi bhi model par point karne ki kshamता ke liye trade karते hain. Wo trade sirf tab pay off karता hai jab "koi bhi model" genuinely open-ended hai — tagging, audit logs. Jab do ya teen known target types hain, ek check constraint ke saath nullable concrete foreign keys (ki theek ek set hai) aapको asli database integrity, JOIN-based queries, select_related, aur admin inlines dete hain, ek migration ki cost par jab aap chautha type add karो.',
      },
    ],

    realWorld: [
      {
        en: '**A `Tag` / `TaggedItem` pair used across `Article`, `Product`, `Video`, `Snippet`** — a genuinely cross-cutting concern, with `(content_type, object_id)` indexed and `prefetch_related("tags")` on every list view, and a `GenericRelation` on each taggable model for the reverse `.tags` accessor.',
        hi: '**`Article`, `Product`, `Video`, `Snippet` ke paar istemal ek `Tag` / `TaggedItem` pair** — ek genuinely cross-cutting concern, `(content_type, object_id)` indexed aur har list view par `prefetch_related("tags")` ke saath.',
      },
      {
        en: '**An `ActivityLog(actor, verb, target=GFK, created)` feeding an activity stream** — "Ana commented on Post 12", "Ben liked Photo 5" — where the target is legitimately any model and the stream is only ever read forward, never joined from the target side in bulk.',
        hi: '**Ek activity stream ko feed karता ek `ActivityLog(actor, verb, target=GFK, created)`** — jahaan target legitimately koi bhi model hai aur stream sirf aage padha jaता hai.',
      },
      {
        en: '**Django admin\'s own `LogEntry`** — `content_type` + `object_id` + `object_repr`, recording every add/change/delete across every registered model; the canonical example of a generic relation done right (and note it stores `object_repr` as text so a deleted object\'s history is still readable).',
        hi: '**Django admin ka apna `LogEntry`** — `content_type` + `object_id` + `object_repr`; ek generic relation sahi kiye jaane ka canonical udाहरan (aur ye `object_repr` ko text ke roop mein store karता hai taaki ek deleted object ki history abhi bhi readable ho).',
      },
    ],

    interviewQA: [
      {
        q: 'How do `ContentType` and `GenericForeignKey` work, and what does `GenericRelation` add?',
        qHi: '`ContentType` aur `GenericForeignKey` kaise kaam karते hain, aur `GenericRelation` kya joडता hai?',
        a: 'The contenttypes framework keeps a table with one row per model across all installed apps, each with a numeric id, so every model has a stable integer handle. A model that needs to reference any model uses three fields: a foreign key to ContentType saying which model, a positive integer for the target row\'s primary key, and a GenericForeignKey that ties those two together. The GenericForeignKey is not a database column — it is a Python descriptor. Reading it looks up the content type and fetches the object by primary key; assigning an object to it sets both the content_type and object_id fields. So one table of comments, tags, or log entries can attach to articles, photos, and products interchangeably. GenericRelation is the optional reverse side, declared on a target model. It gives you a reverse manager so you can do article.comments.all() and article.comments.create(), it makes the target queryable — Count of comments, filter by comments__body — and crucially it provides a delete cascade, because there is no database foreign-key constraint on object_id and without the GenericRelation, deleting an article leaves its comment rows orphaned pointing at a dead id.',
        aHi: 'Contenttypes framework ek table rakhता hai jismें sabhi installed apps ke har model ke liye ek row hai, har ek ek numeric id ke saath, to har model ke paas ek stable integer handle hai. Ek model jise kisi bhi model ko reference karना hai teen fields istemal karता hai: ContentType ko ek foreign key jо kehta hai kaunsa model, target row ki primary key ke liye ek positive integer, aur ek GenericForeignKey jо un dono ko jodता hai. GenericForeignKey ek database column nahi hai — ye ek Python descriptor hai. Ise padhना content type lookup karता hai aur object ko primary key se fetch karता hai; ise ek object assign karna dono fields set karता hai. GenericRelation optional reverse side hai, ek target model par declared. Ye aapको ek reverse manager deता hai, target ko queryable banाता hai, aur mahatvapoorna roop se ek delete cascade deता hai, kyunki object_id par koi database foreign-key constraint nahi hai.',
      },
      {
        q: 'What are the downsides of generic relations, and when would you use concrete FKs instead?',
        qHi: 'Generic relations ke downsides kya hain, aur aap iske bजाy concrete FKs kab istemal karोge?',
        a: 'There are four. No referential integrity: object_id is a plain integer with no foreign-key constraint, so orphan rows are possible and are your job to clean up. No select_related: there is no real join, so you cannot eagerly load the target with a join, and filtering across the relation — comments where the target title is X — does not work; you filter by content_type and object_id instead. The N+1: iterating the generic foreign key over a mixed queryset issues a query per row, and the fix is prefetch_related on the target, which groups object ids by content type and does one id-in query per type. And indexing is manual: you must add a composite index on content_type and object_id or every reverse lookup is a full scan, which is the most common real-world performance bug with this feature. You use concrete foreign keys instead when the set of target types is small and known — two or three — where nullable FKs with a check constraint that exactly one is set give you database integrity, joins, select_related, and admin inlines, at the cost of a migration when a new type is added. You also prefer concrete FKs when you frequently query across the relation, or when the targets share behaviour and a common base model with one real FK is cleaner. Generic relations are right for genuinely cross-cutting, mostly-append concerns: tagging, audit logs, attachments, reactions — things that apply to many unrelated models and are rarely joined from the target side in bulk.',
        aHi: 'Chaar hain. Koi referential integrity nahi: object_id bina foreign-key constraint ke ek plain integer hai, to orphan rows sambhav hain. Koi select_related nahi: koi asli join nahi hai, to aap target ko ek join ke saath eagerly load nahi kar sakte, aur relation ke paar filter karna kaam nahi karता. N+1: ek mixed queryset par generic foreign key iterate karna prati row ek query issue karता hai, aur fix target par prefetch_related hai. Aur indexing manual hai: aapको content_type aur object_id par ek composite index add karना zaroori hai warna har reverse lookup ek full scan hai. Aap iske bजाy concrete foreign keys istemal karते ho jab target types ka set chhota aur known hai — do ya teen — jahaan ek check constraint ke saath nullable FKs aapको database integrity, joins, select_related, aur admin inlines dete hain. Aap concrete FKs bhi prefer karते ho jab aap relation ke paar aksar query karते ho.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django (SQLite, `django.contrib.contenttypes` installed). Models `Task(title)`, `Wiki(title)`, and `Star(content_type=FK(ContentType), object_id=PositiveIntegerField, target=GenericForeignKey, user=CharField)` with a `Meta.indexes` on `(content_type, object_id)`. Star a Task and a Wiki. Assert `star.target` returns the right model instance for each, and that `ContentType.objects.get_for_model(Task)` matches the first star\'s `content_type`.',
        taskHi: 'Standalone Django. Models `Task(title)`, `Wiki(title)`, aur `Star(content_type, object_id, target=GFK, user)` `(content_type, object_id)` par index ke saath. Ek Task aur ek Wiki star karo. Assert `star.target` sahi model instance return karता hai.',
        hint: '`from django.contrib.contenttypes.fields import GenericForeignKey`; `from django.contrib.contenttypes.models import ContentType`. `Star.objects.create(target=task, user="ana")` fills both fields.',
        hintHi: '`from django.contrib.contenttypes.fields import GenericForeignKey`. `Star.objects.create(target=task, user="ana")` dono fields bharता hai.',
      },
      {
        task: 'Demonstrate the N+1. Reuse `Star` from above with ~6 stars split across 3 Tasks and 2 Wikis. Wrap `[s.target for s in Star.objects.all()]` in `CaptureQueriesContext` and record the count. Then do the same with `Star.objects.prefetch_related("target")`. Assert the naive count is `> 3` and the prefetch count is exactly `3` (1 for stars + 1 per content type).',
        taskHi: 'N+1 dikhाओ. ~6 stars 3 Tasks aur 2 Wikis ke paar. `CaptureQueriesContext` mein wrap karो. Phir `prefetch_related("target")` ke saath. Assert naive `> 3` aur prefetch theek `3`.',
        hint: '`from django.test.utils import CaptureQueriesContext`; `from django.db import connection`. `with CaptureQueriesContext(connection) as ctx: ...` then `len(ctx.captured_queries)`.',
        hintHi: '`from django.test.utils import CaptureQueriesContext`. `with CaptureQueriesContext(connection) as ctx: ...` phir `len(ctx.captured_queries)`.',
      },
      {
        task: 'Show the cascade difference. Model `Item(name, notes=GenericRelation("app.Memo"))` and model `Blob(name)` (NO GenericRelation), plus `Memo(content_type, object_id, target=GFK, text)`. Attach a Memo to one Item and one Blob. Delete both parents. Assert exactly 1 Memo remains (the Blob\'s orphan), and that its `.target` is `None`. Write a comment: adding `GenericRelation` to `Blob` would have cascaded it.',
        taskHi: 'Cascade antar dikhाओ. Model `Item(name, notes=GenericRelation)` aur `Blob(name)` (KOI GenericRelation nahi), plus `Memo(...)`. Ek Item aur ek Blob ko Memo attach karो. Dono parents delete karो. Assert theek 1 Memo bacha aur iska `.target` `None` hai.',
        hint: 'The `GenericRelation` on `Item` is what wires the delete cascade. `Blob` has no such link, so its `Memo` row survives as an orphan and `memo.target` resolves to `None`.',
        hintHi: '`Item` par `GenericRelation` delete cascade wire karता hai. `Blob` ke paas aisा koi link nahi, to iski `Memo` row ek orphan ke roop mein bachती hai.',
      },
    ],

    keyTakeaways: [
      'The contenttypes framework (`django.contrib.contenttypes`, installed by default) keeps `django_content_type` — one row per model with a numeric id. `ContentType.objects.get_for_model(M)` returns it (and CACHES it).',
      'A GENERIC FK is THREE fields: `content_type = ForeignKey(ContentType, on_delete=CASCADE)` (which model), `object_id = PositiveIntegerField()` (which row — use `CharField`/`UUIDField` to match non-int PKs), `target = GenericForeignKey("content_type", "object_id")` (a Python descriptor, NOT a DB column). `create(target=obj, ...)` fills both underlying fields.',
      '`GenericRelation(Comment)` on the TARGET model adds: a reverse manager (`article.comments.all()`/`.create()`), delete CASCADE (without it, deleting the target orphans the rows — `c.target` -> `None`), and queryability (`Count("comments")`, `filter(comments__...)`). Optional and per-target.',
      'COSTS: (1) no referential integrity — `object_id` has no FK constraint, orphans possible; (2) NO `select_related("target")`, and `filter(target__field=...)` does NOT work — filter by `content_type` + `object_id`; (3) the N+1 on `.target`; (4) indexing is manual.',
      'ALWAYS add `Meta.indexes = [models.Index(fields=["content_type", "object_id"])]` — without it every reverse lookup is a full table scan. This is the #1 real-world generic-relations perf bug.',
      '`prefetch_related("target")` when iterating the GFK -> collapses N queries to (1 base + 1 per distinct content type): Django groups `object_id`s by `content_type` and does an `id__in` per type. From the other side: `prefetch_related("<GenericRelation name>")`.',
      'WRONG TOOL when: only 2-3 known target types (use nullable concrete FKs + a `CheckConstraint` that exactly one is set — keeps integrity, `select_related`, clean joins); OR you query across the relation often; OR the targets share a base model.',
      'RIGHT for genuinely cross-cutting, mostly-append concerns: tagging, audit logs / activity streams, attachments, reactions/likes, flags. Django admin\'s `LogEntry` is the canonical example (and stores `object_repr` as text so deleted objects stay readable).',
    ],
    keyTakeawaysHi: [
      'Contenttypes framework (`django.contrib.contenttypes`, default se installed) `django_content_type` rakhता hai — prati model ek row ek numeric id ke saath. `ContentType.objects.get_for_model(M)` ise return karता hai (aur CACHE karता hai).',
      'Ek GENERIC FK TEEN fields hai: `content_type = ForeignKey(ContentType, on_delete=CASCADE)`, `object_id = PositiveIntegerField()` (non-int PKs match karne ke liye `CharField`/`UUIDField`), `target = GenericForeignKey(...)` (ek Python descriptor, ek DB column NAHI). `create(target=obj, ...)` dono fields bharता hai.',
      'TARGET model par `GenericRelation(Comment)` joडता hai: ek reverse manager, delete CASCADE (iske bina, target delete karna rows ko orphan karता hai — `c.target` -> `None`), aur queryability. Optional aur per-target.',
      'COSTS: (1) koi referential integrity nahi — orphans sambhav; (2) KOI `select_related("target")` nahi, aur `filter(target__field=...)` kaam NAHI karता; (3) `.target` par N+1; (4) indexing manual hai.',
      'HAMESHA `Meta.indexes = [models.Index(fields=["content_type", "object_id"])]` add karो — iske bina har reverse lookup ek full table scan hai. Ye #1 real-world generic-relations perf bug hai.',
      'GFK iterate karते samay `prefetch_related("target")` -> N queries ko (1 base + prati distinct content type 1) mein collapse karता hai. Doosri taraf se: `prefetch_related("<GenericRelation name>")`.',
      'GALAT TOOL jab: sirf 2-3 known target types (nullable concrete FKs + ek `CheckConstraint` istemal karो); YA aap relation ke paar aksar query karते ho; YA targets ek base model share karते hain.',
      'Genuinely cross-cutting, mostly-append concerns ke liye SAHI: tagging, audit logs, attachments, reactions/likes, flags. Django admin ka `LogEntry` canonical udाहरan hai.',
    ],
  },
];
