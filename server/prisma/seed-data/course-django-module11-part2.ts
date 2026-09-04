/**
 * Django Complete Course — Module 11: Templates, Rendering & Email, lessons 3-4.
 *
 * Lesson 3: custom template tags & filters — templatetags/ + {% load %}, @register.filter,
 *           @register.simple_tag (+ takes_context), @register.inclusion_tag, context
 *           processors, mark_safe / format_html, when a tag beats logic in the view.
 * Lesson 4: templated & HTML email — send_mail vs EmailMessage vs EmailMultiAlternatives,
 *           text + HTML body from render_to_string, attachments, DEFAULT_FROM_EMAIL,
 *           the locmem backend + mail.outbox in tests, sending async via Celery.
 *
 * Verified: custom tags via a temp shoptags.py on sys.path + TEMPLATES[0]["OPTIONS"]
 * ["builtins"] = ["shoptags"]; EmailMultiAlternatives + attach_alternative + locmem
 * backend -> mail.outbox[0].alternatives[0] == (html, "text/html").
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_11_PART2: CourseLesson[] = [
  {
    slug: 'dj-custom-template-tags-and-filters',
    title: 'Custom Template Tags, Filters & Context Processors',
    titleHi: 'Custom Template Tags, Filters & Context Processors',
    description: 'When the built-in tags and filters run out — you need a currency format, a "render the last 5 comments" widget, a value on every page — you write your own. A `templatetags/` package, a `@register` decorator, and `{% load %}`. Context processors inject a variable into every template.',
    descriptionHi: 'Jab built-in tags aur filters khatm ho jaate hain — aapको ek currency format chahिए, ek "aakhri 5 comments render karो" widget, har page par ek value — aap apna likhते ho. Ek `templatetags/` package, ek `@register` decorator, aur `{% load %}`. Context processors har template mein ek variable inject karते hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**Custom rubber stamps for an office that only had the standard ones.** The stationery cupboard comes with "PAID", "DRAFT", "COPY" — the built-in filters and tags. They cover the common cases. But your office keeps writing the same thing by hand: formatting an amount as local currency, stamping "3 of 12" page markers, pasting in the standard address block. So you order **custom stamps**: a `|filter` stamp takes one thing and reprints it changed (amount → `₹1,23,456.00`); a `{% simple_tag %}` stamp takes a few inputs and prints a computed result; an `{% inclusion_tag %}` is a stamp that prints a whole pre-designed mini-form filled with data it looked up itself. To use any custom stamp on a page you first `{% load %}` that stamp set — except the ones the office manager put in *everyone\'s* drawer by default, which is what a **context processor** does: it makes one value (the current user, the site name, the cart count) appear in every template without anyone asking.',
      hi: '**Ek office ke liye custom rubber stamps jiske paas sirf standard the.** Stationery cupboard "PAID", "DRAFT", "COPY" ke saath aata hai — built-in filters aur tags. Wo aam cases cover karते hain. Par aapका office wahi cheez baar-baar haath se likhता rehता hai: ek amount ko local currency ke roop mein format karna, "3 of 12" page markers stamp karna, standard address block paste karna. To aap **custom stamps** order karते ho: ek `|filter` stamp ek cheez leता hai aur ise badalकर reprint karता hai; ek `{% simple_tag %}` stamp kuch inputs leता hai aur ek computed result print karता hai; ek `{% inclusion_tag %}` ek stamp hai jо ek poora pre-designed mini-form print karता hai jise usne khud lookup kiya. Kisi bhi custom stamp ko ek page par istemal karne ke liye aap pehle us stamp set ko `{% load %}` karते ho — sivाy un ke jо office manager ne *sabki* drawer mein default se dala, jо ek **context processor** karता hai.',
    },

    simple: `**The layout: a \`templatetags/\` package inside an app**

\`\`\`
shop/
  __init__.py
  models.py
  templatetags/
    __init__.py          <-- REQUIRED, makes it a package
    shop_extras.py       <-- your tags/filters live here
\`\`\`

\`\`\`python
# shop/templatetags/shop_extras.py
from django import template
from django.utils.html import format_html

register = template.Library()          # this exact name

@register.filter                        # {{ price|money }}
def money(value):
    return f"\${value:,.2f}"

@register.simple_tag                     # {% discount price pct=20 %}
def discount(price, pct):
    return round(price * (1 - pct / 100), 2)

@register.simple_tag(takes_context=True) # {% greeting %}  -> uses context["user"]
def greeting(context):
    return f"Hi, {context['user'].first_name}"

@register.inclusion_tag("shop/_badge.html")   # {% status_badge order.status %}
def status_badge(status):
    return {"status": status, "css": "ok" if status == "paid" else "warn"}
\`\`\`

**Using them — \`{% load %}\` first**

\`\`\`django
{% load shop_extras %}

<p>{{ product.price|money }}</p>                 {# $1,299.00 #}
{% discount product.price 15 as sale_price %}    {# store result in a variable #}
<p>Now {{ sale_price|money }}</p>
{% status_badge order.status %}                  {# renders shop/_badge.html #}
\`\`\`

**Context processors — a variable in EVERY template**

\`\`\`python
# shop/context_processors.py
def cart(request):
    return {"cart_count": request.session.get("cart_count", 0)}
\`\`\`

\`\`\`python
# settings.py -- add to TEMPLATES[0]["OPTIONS"]["context_processors"]
"context_processors": [
    "django.template.context_processors.request",
    "django.contrib.auth.context_processors.auth",       # -> {{ user }}, {{ perms }}
    "django.contrib.messages.context_processors.messages",# -> {{ messages }}
    "shop.context_processors.cart",                       # -> {{ cart_count }} everywhere
],
\`\`\`

**Building HTML safely in Python**

\`\`\`python
from django.utils.html import format_html, format_html_join
from django.utils.safestring import mark_safe

format_html("<span class='{}'>{}</span>", css, label)   # each {} is ESCAPED -- safe
mark_safe("<hr>")                                        # "trust me" -- only for constants YOU write
# NEVER: mark_safe(f"<span>{user_input}</span>")   <-- XSS
\`\`\``,

    simpleHi: `**Layout: ek app ke andar ek \`templatetags/\` package**

\`\`\`
shop/
  templatetags/
    __init__.py          <-- ZAROORI, ise ek package banाता hai
    shop_extras.py       <-- aapke tags/filters yahaan rehते hain
\`\`\`

\`\`\`python
# shop/templatetags/shop_extras.py
from django import template
from django.utils.html import format_html

register = template.Library()          # ye exact naam

@register.filter                        # {{ price|money }}
def money(value):
    return f"\${value:,.2f}"

@register.simple_tag                     # {% discount price pct=20 %}
def discount(price, pct):
    return round(price * (1 - pct / 100), 2)

@register.simple_tag(takes_context=True) # {% greeting %}  -> context["user"] istemal karता hai
def greeting(context):
    return f"Hi, {context['user'].first_name}"

@register.inclusion_tag("shop/_badge.html")   # {% status_badge order.status %}
def status_badge(status):
    return {"status": status, "css": "ok" if status == "paid" else "warn"}
\`\`\`

**Unhe istemal karना — pehle \`{% load %}\`**

\`\`\`django
{% load shop_extras %}

<p>{{ product.price|money }}</p>                 {# $1,299.00 #}
{% discount product.price 15 as sale_price %}    {# result ek variable mein store karो #}
<p>Now {{ sale_price|money }}</p>
{% status_badge order.status %}                  {# shop/_badge.html render karता hai #}
\`\`\`

**Context processors — HAR template mein ek variable**

\`\`\`python
# shop/context_processors.py
def cart(request):
    return {"cart_count": request.session.get("cart_count", 0)}
\`\`\`

\`\`\`python
# settings.py -- TEMPLATES[0]["OPTIONS"]["context_processors"] mein add karो
"context_processors": [
    "django.template.context_processors.request",
    "django.contrib.auth.context_processors.auth",       # -> {{ user }}, {{ perms }}
    "django.contrib.messages.context_processors.messages",# -> {{ messages }}
    "shop.context_processors.cart",                       # -> {{ cart_count }} har jagah
],
\`\`\`

**Python mein HTML surakshit roop se banाना**

\`\`\`python
from django.utils.html import format_html
from django.utils.safestring import mark_safe

format_html("<span class='{}'>{}</span>", css, label)   # har {} ESCAPED -- safe
mark_safe("<hr>")                                        # "trust me" -- sirf un constants ke liye jо AAP likhते ho
# KABHI NAHI: mark_safe(f"<span>{user_input}</span>")   <-- XSS
\`\`\``,

    content: `## Where custom tags live

Django discovers template tag libraries by looking for a **\`templatetags/\` package** inside each installed app. The package needs an \`__init__.py\` (a plain empty file — forgetting this is the number-one "my \`{% load %}\` says 'is not a registered tag library'" cause). Each module inside it that defines \`register = template.Library()\` becomes a loadable library, named by the **module filename** — \`shop/templatetags/shop_extras.py\` is loaded with \`{% load shop_extras %}\`.

## \`@register.filter\`

A filter is a function of one or two arguments (the value, and optionally one filter argument) that returns the transformed value:

\`\`\`python
@register.filter
def money(value, symbol="$"):
    return f"{symbol}{value:,.2f}"       # {{ p.price|money }}  or  {{ p.price|money:"$" }}
\`\`\`

- Filters must not raise — return something sensible on bad input. They should be fast (they run in the render loop).
- If your filter returns HTML, decorate it \`@register.filter(is_safe=True)\` **and** return a \`mark_safe\`/\`format_html\` value — otherwise the result is escaped.
- \`@register.filter(name="money")\` sets the template name explicitly if it differs from the function name.

## \`@register.simple_tag\`

A **simple tag** takes any positional and keyword arguments and returns a value:

\`\`\`python
@register.simple_tag
def discount(price, pct):
    return round(price * (1 - pct / 100), 2)
\`\`\`

\`\`\`django
{% discount product.price 20 %}                 {# outputs the value #}
{% discount product.price pct=20 as sale %}     {# 'as sale' -> stores it, outputs nothing #}
\`\`\`

- \`takes_context=True\` makes the first parameter the template **context** (a dict-like) — use it for tags that need \`request\`, \`user\`, or other context data. Requires the \`request\` context processor for \`context['request']\`.
- The return value is auto-escaped unless it is already a safe string. Build HTML with \`format_html\`.
- \`@register.simple_block_tag\` (Django 5.1+) is the modern way to write a tag with content between an open and close tag.

## \`@register.inclusion_tag\`

An **inclusion tag** renders a **template** using a context dict the function returns:

\`\`\`python
@register.inclusion_tag("shop/_recent_orders.html")
def recent_orders(user, count=5):
    orders = Order.objects.filter(user=user).order_by("-created")[:count]
    return {"orders": orders}
\`\`\`

\`\`\`django
{% recent_orders request.user count=3 %}   {# renders _recent_orders.html with {orders: ...} #}
\`\`\`

This is the right tool when a fragment needs to **fetch its own data** — the difference from \`{% include %}\`, which renders a template with data the caller already assembled. Add \`takes_context=True\` to also receive the parent context.

## Context processors

A **context processor** is a function \`f(request) -> dict\` whose keys are merged into the context of **every template rendered with a request** (via \`render()\` / \`TemplateResponse\` / \`RequestContext\`). Register it in \`TEMPLATES[0]["OPTIONS"]["context_processors"]\`.

Django's defaults give you \`{{ request }}\`, \`{{ user }}\`, \`{{ perms }}\`, \`{{ messages }}\`, and \`{{ DEBUG }}\`/\`MEDIA_URL\`/\`STATIC_URL\`. You add processors for things that genuinely appear on **every** page: the site/brand object, the cart item count, feature flags, the nav tree.

**Cost:** a context processor runs on *every single render*. If it hits the database (\`SiteConfig.objects.get()\`), that is a query on every page — cache it (\`cache.get_or_set\`) or you have added a guaranteed query to the whole site. Do not use a context processor for data only a few pages need — pass that in the view.

## \`mark_safe\` vs \`format_html\`

Both come from building HTML strings in Python (a tag, a filter, a model method, an admin \`display\`):

- **\`format_html("<b>{}</b> ({})", name, count)\`** — like \`str.format\`, but every argument is **HTML-escaped** before substitution, and the result is marked safe. This is the correct default. \`format_html_join(sep, fmt, args_iter)\` for lists.
- **\`mark_safe(s)\`** — "this string is safe, do not escape it". No escaping happens. Only ever pass it a string literal you wrote entirely yourself (\`mark_safe("&nbsp;")\`). \`mark_safe(f"...{value}...")\` with **any** dynamic \`value\` is an injection bug — that is exactly the case \`format_html\` exists for.

## When a custom tag is the right call

Reach for a custom tag/filter when:

- The same non-trivial formatting appears in many templates (currency, durations, file sizes, relative time in your house style).
- A widget needs its own query (recent activity, related items, a menu from the DB).
- You are tempted to write \`{% if %}\` logic three levels deep — encode the decision in a \`simple_tag\` that returns a class name or a boolean.

Do **not** use one to hide business logic that belongs in a model or service — a tag is still presentation. \`{% can_user_refund order request.user %}\` is fine (it is a display decision); putting the refund *rules* in the tag instead of \`order.can_be_refunded_by(user)\` is not.`,

    contentHi: `## Custom tags kahaan rehते hain

Django template tag libraries ko har installed app ke andar ek **\`templatetags/\` package** dhoondhकर discover karता hai. Package ko ek \`__init__.py\` chahिए (ek plain empty file — ise bhoolना number-one "\`{% load %}\` kehta hai 'is not a registered tag library'" kaaran hai). Iske andar har module jо \`register = template.Library()\` define karता hai ek loadable library ban jaता hai, **module filename** se named — \`shop/templatetags/shop_extras.py\` \`{% load shop_extras %}\` se load hota hai.

## \`@register.filter\`

Ek filter ek ya do arguments ka ek function hai (value, aur optionally ek filter argument) jо transformed value return karता hai:

\`\`\`python
@register.filter
def money(value, symbol="$"):
    return f"{symbol}{value:,.2f}"       # {{ p.price|money }}  ya  {{ p.price|money:"$" }}
\`\`\`

- Filters raise nahi karें — bad input par kuch sensible return karें. Wo tez hone chahिए.
- Agar aapका filter HTML return karता hai, ise \`@register.filter(is_safe=True)\` decorate karो **aur** ek \`mark_safe\`/\`format_html\` value return karो.

## \`@register.simple_tag\`

Ek **simple tag** koi positional aur keyword arguments leता hai aur ek value return karता hai:

\`\`\`django
{% discount product.price 20 %}                 {# value output karता hai #}
{% discount product.price pct=20 as sale %}     {# 'as sale' -> ise store karता hai, kuch output nahi #}
\`\`\`

- \`takes_context=True\` pehle parameter ko template **context** banाता hai — \`request\`, \`user\` ki zaroorat waale tags ke liye istemal karो.
- Return value auto-escaped hai jab tak ye pehle se ek safe string na ho. HTML ko \`format_html\` se banाओ.

## \`@register.inclusion_tag\`

Ek **inclusion tag** ek **template** ko function ke return kiye ek context dict se render karता hai:

\`\`\`python
@register.inclusion_tag("shop/_recent_orders.html")
def recent_orders(user, count=5):
    orders = Order.objects.filter(user=user).order_by("-created")[:count]
    return {"orders": orders}
\`\`\`

Ye sahi tool hai jab ek fragment ko **apna data fetch karना** hai — \`{% include %}\` se antar, jо ek template ko us data se render karता hai jо caller ne pehle se assemble kiya.

## Context processors

Ek **context processor** ek function \`f(request) -> dict\` hai jiske keys **har template jо ek request ke saath render hota hai** ke context mein merge hote hain. Ise \`TEMPLATES[0]["OPTIONS"]["context_processors"]\` mein register karो.

Django ke defaults aapको \`{{ request }}\`, \`{{ user }}\`, \`{{ perms }}\`, \`{{ messages }}\` dete hain. Aap un cheezon ke liye processors add karते ho jо asal mein **har** page par dikhती hain.

**Cost:** ek context processor *har single render* par chalता hai. Agar ye database hit karता hai, wo har page par ek query hai — ise cache karो ya aapne poori site mein ek guaranteed query add ki hai.

## \`mark_safe\` vs \`format_html\`

- **\`format_html("<b>{}</b> ({})", name, count)\`** — \`str.format\` jaisा, par har argument substitution se pehle **HTML-escaped** hai, aur result safe mark hai. Ye sahi default hai.
- **\`mark_safe(s)\`** — "ye string safe hai, ise escape mat karो". Koi escaping nahi. Ise kabhi sirf ek string literal do jо aapne poori tarah khud likha. **Kisi bhi** dynamic \`value\` ke saath \`mark_safe(f"...{value}...")\` ek injection bug hai.

## Jab ek custom tag sahi call hai

- Wahi non-trivial formatting kई templates mein dikhता hai (currency, durations, file sizes).
- Ek widget ko apni query chahिए (recent activity, related items).
- Aap \`{% if %}\` logic teen levels deep likhने ke liye lubhाye jaते ho — decision ko ek \`simple_tag\` mein encode karो.

Ise ek model ya service mein rehne waale business logic ko chhupाने ke liye **mat** istemal karो — ek tag abhi bhi presentation hai.`,

    examples: [
      {
        title: 'A filter, a simple_tag, and a takes_context tag registered and loaded',
        titleHi: 'Ek filter, ek simple_tag, aur ek takes_context tag register aur load kiya',
        code: `import sys, tempfile, os, django
from django.conf import settings

# write a tag library to a temp dir and put it on sys.path
d = tempfile.mkdtemp()
open(os.path.join(d, "shoptags.py"), "w").write('''
from django import template
register = template.Library()

@register.filter
def money(value):
    return f"\${value:,.2f}"

@register.simple_tag
def discount(price, pct):
    return round(price * (1 - pct / 100), 2)

@register.simple_tag(takes_context=True)
def greeting(context):
    return f"Hi, {context['who']}"
''')
sys.path.insert(0, d)

settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=[],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [], "APP_DIRS": False,
        "OPTIONS": {"builtins": ["shoptags"],   # auto-load, no {% load %} needed here
            "loaders": [("django.template.loaders.locmem.Loader", {
                "t.html": "price: {{ p|money }}\\n"
                          "{% discount p 15 as sale %}sale: {{ sale|money }}\\n"
                          "{% greeting %}",
            })]}}])
django.setup()

from django.template.loader import render_to_string
print(render_to_string("t.html", {"p": 1299, "who": "Ada"}))`,
        output: `price: $1,299.00
sale: $1,104.15
Hi, Ada`,
        explain: '`shoptags.py` is written to a temp directory on `sys.path`, and `"builtins": ["shoptags"]` auto-loads it so no `{% load %}` is needed. `{{ p|money }}` runs the filter, `{% discount p 15 as sale %}` stores the simple tag\'s return value in a variable, and `{% greeting %}` -- registered with `takes_context=True` -- reads `who` straight out of the render context.',
        explainHi: '`shoptags.py` `sys.path` par ek temp directory mein likha jaता hai, aur `"builtins": ["shoptags"]` ise auto-load karता hai to koi `{% load %}` zaroori nahi. `{{ p|money }}` filter chalाता hai, `{% discount p 15 as sale %}` simple tag ki return value ek variable mein store karता hai, aur `{% greeting %}` -- `takes_context=True` ke saath registered -- `who` ko seedhे render context se padhता hai.',
      },
      {
        title: 'inclusion_tag renders its own mini-template from a context it returns',
        titleHi: 'inclusion_tag apna mini-template return kiye ek context se render karta hai',
        code: `import sys, tempfile, os, django
from django.conf import settings

d = tempfile.mkdtemp()
open(os.path.join(d, "badges.py"), "w").write('''
from django import template
register = template.Library()

@register.inclusion_tag("_badge.html")
def status_badge(status):
    return {"status": status, "css": "ok" if status == "paid" else "warn"}
''')
sys.path.insert(0, d)

settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=[],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [], "APP_DIRS": False,
        "OPTIONS": {"builtins": ["badges"],
            "loaders": [("django.template.loaders.locmem.Loader", {
                "_badge.html": "<span class=\\"{{ css }}\\">{{ status }}</span>",
                "page.html": "{% status_badge o1 %} {% status_badge o2 %}",
            })]}}])
django.setup()

from django.template.loader import render_to_string
print(render_to_string("page.html", {"o1": "paid", "o2": "pending"}))`,
        output: `<span class="ok">paid</span> <span class="warn">pending</span>`,
        explain: '`status_badge` returns a plain dict, and `@register.inclusion_tag("_badge.html")` renders that template with the dict as its context and drops the result in place. Each of the two calls computes its own `css` class from the status it was given. This is how a fragment that needs its own small template -- not just a value -- is packaged.',
        explainHi: '`status_badge` ek plain dict return karता hai, aur `@register.inclusion_tag("_badge.html")` us template ko dict ke context ke saath render karता hai aur result ko jagah par daal deता hai. Do calls mein se har ek apni `css` class us status se compute karता hai jо use diya gaya. Aise ek fragment jise apna chhota template chahिए -- sirf ek value nahi -- package kiya jaता hai.',
      },
      {
        title: 'format_html escapes its arguments; mark_safe on user input would not',
        titleHi: 'format_html apne arguments escape karta hai; user input par mark_safe nahi karta',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=[])
django.setup()

from django.utils.html import format_html
from django.utils.safestring import mark_safe

user_label = "<script>alert(1)</script>"

safe = format_html("<span class='tag'>{}</span>", user_label)   # arg is escaped
unsafe = mark_safe(f"<span class='tag'>{user_label}</span>")     # arg is NOT escaped -- XSS

print("format_html:", safe)
print("mark_safe:  ", unsafe)`,
        output: `format_html: <span class='tag'>&lt;script&gt;alert(1)&lt;/script&gt;</span>
mark_safe:   <span class='tag'><script>alert(1)</script></span>`,
        explain: '`format_html` treats its arguments like `str.format` but HTML-escapes each one before substituting, so the `<script>` in `user_label` comes out as inert text. `mark_safe` on an f-string escapes nothing -- the same string is interpolated raw and the script tag is live. `format_html` is the mechanism that makes interpolation safe; `mark_safe` is only for literals you write in full.',
        explainHi: '`format_html` apne arguments ko `str.format` ki tarah treat karता hai par substitute karne se pehle har ek ko HTML-escape karता hai, to `user_label` mein `<script>` inert text ban kar aata hai. Ek f-string par `mark_safe` kuch escape nahi karता -- wahi string raw interpolate hoती hai aur script tag live hai. `format_html` wo mechanism hai jо interpolation ko safe banाता hai; `mark_safe` sirf un literals ke liye hai jо aap poora likhते ho.',
      },
    ],

    mistakes: [
      {
        wrong: `shop/
  templatetags/
    shop_extras.py      # no __init__.py in templatetags/
{# template: #}
{% load shop_extras %}   {# TemplateSyntaxError: 'shop_extras' is not a registered tag library #}`,
        right: `shop/
  templatetags/
    __init__.py         # <-- add this empty file
    shop_extras.py
# also: the APP ('shop') must be in INSTALLED_APPS, and after adding the
# file you must RESTART the dev server -- new tag libraries are not autoreloaded reliably.`,
        why: 'Django finds tag libraries by importing the templatetags package of each app in INSTALLED_APPS. Without __init__.py, templatetags/ is not a Python package and the import finds nothing, so {% load %} fails with "not a registered tag library". The same error appears if the app is not in INSTALLED_APPS, if the module has an import error (Django swallows it and just reports the library as missing — import the module manually in a shell to see the real traceback), or if you added the file while the server was running and it did not pick it up. Checklist: empty __init__.py present, app installed, no import errors in the module, server restarted.',
        whyHi: 'Django tag libraries ko INSTALLED_APPS ke har app ke templatetags package ko import karके dhoondhता hai. \`__init__.py\` ke bina, \`templatetags/\` ek Python package nahi hai aur import kuch nahi paता, to \`{% load %}\` "not a registered tag library" ke saath fail hota hai. Wahi error dikhता hai agar app INSTALLED_APPS mein nahi hai, agar module mein ek import error hai (Django ise nigal leता hai — shell mein module manually import karके asli traceback dekhो), ya agar aapne server chalte hue file add ki. Checklist: empty \`__init__.py\`, app installed, koi import errors nahi, server restart.',
      },
      {
        wrong: `@register.simple_tag
def user_greeting(name):
    return format_html("<h2>Welcome back, {}!</h2>", name)

# then someone "simplifies" it:
@register.simple_tag
def user_greeting(name):
    return mark_safe(f"<h2>Welcome back, {name}!</h2>")   # name comes from user.first_name`,
        right: `@register.simple_tag
def user_greeting(name):
    return format_html("<h2>Welcome back, {}!</h2>", name)   # 'name' is escaped -- safe
# if you truly need no escaping on a fixed string:  mark_safe("<hr class='divider'>")  -- a literal, no interpolation`,
        why: 'mark_safe on an f-string that interpolates a variable disables escaping for that variable. If name is user.first_name and a user sets their first name to an <img onerror=...> payload, that payload now runs in the browser of everyone who sees the greeting — stored XSS, introduced by a "cleanup" that looked equivalent. format_html is not a stylistic choice; it is the mechanism that escapes the interpolated values. Reserve mark_safe for string constants you type out in full with no interpolation, and even then prefer building the element another way.',
        whyHi: 'Ek f-string par \`mark_safe\` jо ek variable interpolate karता hai us variable ke liye escaping disable karता hai. Agar \`name\` \`user.first_name\` hai aur ek user apna first name ek \`<img onerror=...>\` payload set karता hai, wo payload ab har us vyakti ke browser mein chalता hai jо greeting dekhता hai — stored XSS, ek "cleanup" dwara peश kiya gaya jо equivalent lag raha tha. \`format_html\` ek stylistic choice nahi hai; ye wo mechanism hai jо interpolated values ko escape karता hai.',
      },
      {
        wrong: `# shop/context_processors.py
def site_config(request):
    return {"config": SiteConfig.objects.get(pk=1)}   # a DB query on EVERY page render`,
        right: `from django.core.cache import cache

def site_config(request):
    config = cache.get("site_config")
    if config is None:
        config = SiteConfig.objects.get(pk=1)
        cache.set("site_config", config, 300)          # 5 min
    return {"config": config}
# and bust the cache in SiteConfig.save()`,
        why: 'A context processor runs for every template render that has a request — which is essentially every page. Any ORM call inside it becomes a fixed per-request query that Django Debug Toolbar will show on every single view, and it is easy to miss because it is not in any view code. If the value genuinely belongs on every page (site name, feature flags, nav), cache it with a sensible TTL and invalidate on save; if it only matters to a handful of pages, it is not a context processor — pass it from those views.',
        whyHi: 'Ek context processor har template render ke liye chalता hai jismें ek request hai — jо asal mein har page hai. Iske andar koi bhi ORM call ek fixed per-request query ban jaता hai jо Django Debug Toolbar har single view par dikhाega, aur ise miss karna aasान hai kyunki ye kisi view code mein nahi hai. Agar value asal mein har page par rehni chahिए, ise ek sensible TTL ke saath cache karो aur save par invalidate karो.',
      },
    ],

    realWorld: [
      {
        en: '**A `core_extras.py` library loaded in `base.html`** — `money`, `duration`, `filesize`, `relative_time` filters in the product\'s house format, each with a unit test, so every template formats values identically and a format change is one edit.',
        hi: '**`base.html` mein load kiya ek `core_extras.py` library** — `money`, `duration`, `filesize` filters product ke house format mein, har ek ek unit test ke saath.',
      },
      {
        en: '**An `{% nav_tree request %}` inclusion tag** — fetches the menu from the DB (cached), marks the active item by matching `request.path`, and renders `_nav.html`. Every page gets a correct, self-contained nav with `{% nav_tree request %}` and nothing in the view.',
        hi: '**Ek `{% nav_tree request %}` inclusion tag** — menu ko DB se fetch karता hai (cached), `request.path` match karके active item mark karता hai, aur `_nav.html` render karता hai.',
      },
      {
        en: '**A cached `site` context processor** — `{{ site.name }}`, `{{ site.support_email }}`, `{{ site.feature_flags }}` available in every template and email, backed by one `SiteConfig` row cached for five minutes and busted in `save()`.',
        hi: '**Ek cached `site` context processor** — `{{ site.name }}`, `{{ site.feature_flags }}` har template aur email mein available, ek `SiteConfig` row dwara backed jо paanch minute cache aur `save()` mein busted.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through creating a custom template filter and a custom tag. What is the difference between `simple_tag` and `inclusion_tag`?',
        qHi: 'Ek custom template filter aur ek custom tag banाne se guzarो. `simple_tag` aur `inclusion_tag` mein kya antar hai?',
        a: 'You create a templatetags package inside an app — a directory with an empty __init__.py and one or more modules, each with register equals template.Library at the top. The module filename is the library name you {% load %}. A filter is register.filter on a function that takes the value and at most one argument and returns the transformed value; it is used as pipe-filtername in the template and should never raise. A tag is more flexible. register.simple_tag decorates a function that takes any positional and keyword arguments and returns a value — the tag outputs that value, or with "as varname" stores it in the context instead. Adding takes_context equals True makes the first parameter the template context, so the tag can read request or user. register.inclusion_tag is different in what it returns: instead of a value, the function returns a context dictionary, and Django renders a named template with that context and inserts the result. So simple_tag is for computing a value or a small string; inclusion_tag is for rendering a chunk of markup. The other important distinction is against {% include %}: an inclusion tag runs Python to build its own context, so it is the right choice when the fragment needs its own query or logic — a recent-activity widget that fetches the last five events. {% include %} just renders a template with data the caller already has. All of these keep auto-escaping: a tag or filter that returns HTML must return a format_html or mark_safe value, and format_html is the one that escapes the interpolated arguments.',
        aHi: 'Aap ek app ke andar ek templatetags package banाते ho — ek empty __init__.py aur ek ya zyada modules waali directory, har ek mein top par register = template.Library. Module filename wo library name hai jise aap {% load %} karते ho. Ek filter ek function par register.filter hai jо value aur zyada se zyada ek argument leता hai aur transformed value return karता hai. Ek tag zyada flexible hai. register.simple_tag ek function ko decorate karता hai jо koi positional aur keyword arguments leта hai aur ek value return karता hai — tag wo value output karता hai, ya "as varname" ke saath ise context mein store karता hai. takes_context = True add karna pehle parameter ko template context banाता hai. register.inclusion_tag jо return karता hai usme alag hai: ek value ke bजाy, function ek context dictionary return karता hai, aur Django us context se ek named template render karता hai. To simple_tag ek value compute karne ke liye hai; inclusion_tag markup ka ek chunk render karne ke liye hai. Doosra antar {% include %} ke khilaf hai: ek inclusion tag apna context banाne ke liye Python chalाता hai, to ye sahi choice hai jab fragment ko apni query chahिए.',
      },
      {
        q: 'What is a context processor, what does it cost, and when should you NOT use one?',
        qHi: 'Ek context processor kya hai, iski keemat kya hai, aur aapको ek kab NAHI istemal karना chahिए?',
        a: 'A context processor is a function that takes the request and returns a dictionary, and Django merges that dictionary into the context of every template rendered through render or TemplateResponse with a request. You register it in the context_processors list in the TEMPLATES setting. Django ships several — the ones that give you user, perms, messages, request, and the static and media URLs in every template. You add your own for values that genuinely belong on every page: the site or brand object, a cart item count, feature flags, the navigation tree. The cost is that the function runs on every single render that has a request, which is effectively every page of the site. If the processor does an ORM query, you have added one guaranteed query per request across the whole application, and it is easy to overlook because it lives outside any view. So the rules are: if the data really is global, cache it inside the processor with a short TTL and invalidate it when the underlying row changes; and if the data is only needed by a few pages, do not use a context processor at all — pass it from those specific views, where its cost is visible and scoped.',
        aHi: 'Ek context processor ek function hai jо request leता hai aur ek dictionary return karता hai, aur Django us dictionary ko har template ke context mein merge karता hai jо ek request ke saath render ya TemplateResponse ke through render hota hai. Aap ise TEMPLATES setting mein context_processors list mein register karते ho. Django kई ship karता hai — wo jо aapको har template mein user, perms, messages, request dete hain. Aap apne khud ke un values ke liye add karते ho jо asal mein har page par rehni chahिए. Keemat ye hai ki function har single render par chalता hai jismें ek request hai, jо asal mein site ka har page hai. Agar processor ek ORM query karता hai, aapne poore application mein prati request ek guaranteed query add ki hai. To niyam: agar data asal mein global hai, ise ek chhote TTL ke saath processor ke andar cache karो; aur agar data ko sirf kuch pages ko chahिए, ek context processor bilkul istemal mat karो.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django. Write `taxtags.py` to a temp dir on `sys.path` with a `register = template.Library()`, a `@register.filter` `pct(value)` returning `f"{value}%"`, and a `@register.simple_tag` `withtax(amount, rate)` returning `round(amount * (1 + rate/100), 2)`. Configure `TEMPLATES` with `"builtins": ["taxtags"]` and a locmem `t.html` = `{% withtax price 18 as gross %}{{ gross }} ({{ 18|pct }})`. Render with `{"price": 100}`. Assert output is `118.0 (18%)`.',
        taskHi: 'Standalone Django. `sys.path` par ek temp dir mein `taxtags.py` likho — `register`, ek `@register.filter` `pct`, ek `@register.simple_tag` `withtax`. `TEMPLATES` ko `"builtins": ["taxtags"]` ke saath configure karo. `{"price": 100}` ke saath render karo. Assert `118.0 (18%)`.',
        hint: '`open(os.path.join(d, "taxtags.py"), "w").write(...)` then `sys.path.insert(0, d)` BEFORE `django.setup()`. `"builtins"` in `OPTIONS` auto-loads without `{% load %}`.',
        hintHi: '`sys.path.insert(0, d)` `django.setup()` se PEHLE. `OPTIONS` mein `"builtins"` `{% load %}` ke bina auto-load karता hai.',
      },
      {
        task: 'Write `cardtags.py` with `@register.inclusion_tag("_card.html")` `card(title, body)` returning `{"title": title, "body": body}`. locmem templates: `_card.html` = `<div><h3>{{ title }}</h3><p>{{ body }}</p></div>` and `page.html` = `{% card "Hello" "World" %}`. Render `page.html` with `{}`. Assert output is `<div><h3>Hello</h3><p>World</p></div>`.',
        taskHi: '`cardtags.py` `@register.inclusion_tag("_card.html")` `card(title, body)` ke saath likho. locmem templates `_card.html` aur `page.html`. `page.html` render karo. Assert `<div><h3>Hello</h3><p>World</p></div>`.',
        hint: 'The inclusion tag function returns a dict; Django renders `_card.html` with it. Both templates go in the same locmem loader dict.',
        hintHi: 'Inclusion tag function ek dict return karता hai; Django ise `_card.html` ke saath render karता hai. Dono templates wahi locmem loader dict mein.',
      },
      {
        task: 'No templates needed. `import format_html, mark_safe`. Set `evil = "<b>x</b>"`. Compute `a = format_html("[{}]", evil)` and `b = mark_safe(f"[{evil}]")`. Assert `str(a) == "[&lt;b&gt;x&lt;/b&gt;]"` and `str(b) == "[<b>x</b>]"`. Write a one-line comment explaining which one is safe to feed a username into and why.',
        taskHi: 'Templates ki zaroorat nahi. `evil = "<b>x</b>"`. `a = format_html("[{}]", evil)` aur `b = mark_safe(f"[{evil}]")`. Assert `a` escaped hai aur `b` nahi. Ek comment: kaunsa ek username feed karne ke liye safe hai aur kyun.',
        hint: '`settings.configure(...)` + `django.setup()` first (needed even with no templates). `format_html` escapes each `{}` arg; `mark_safe` escapes nothing.',
        hintHi: '`settings.configure(...)` + `django.setup()` pehle. `format_html` har `{}` arg escape karता hai; `mark_safe` kuch nahi.',
      },
    ],

    keyTakeaways: [
      'Custom tags/filters live in `<app>/templatetags/<libname>.py` — the package NEEDS an empty `__init__.py` (missing it = "not a registered tag library"), the app must be in `INSTALLED_APPS`, and the dev server must be RESTARTED. Each module has `register = template.Library()`; you `{% load <libname> %}` by the module filename.',
      '`@register.filter def f(value, arg=None)` -> `{{ x|f }}` / `{{ x|f:"arg" }}`. Must not raise; must be fast. Returns HTML? -> `@register.filter(is_safe=True)` AND return `format_html`/`mark_safe`.',
      '`@register.simple_tag def f(*args, **kwargs)` -> `{% f a b=2 %}` outputs the return value, or `{% f a as name %}` stores it (outputs nothing). `takes_context=True` -> first param is the context dict (for `request`/`user`).',
      '`@register.inclusion_tag("_frag.html") def f(...)` returns a CONTEXT DICT; Django renders `_frag.html` with it. Use it when the fragment needs its OWN query/logic — vs `{% include %}` which renders with data the caller already has.',
      'CONTEXT PROCESSOR = `f(request) -> dict`, merged into EVERY template rendered with a request. Register in `TEMPLATES[0]["OPTIONS"]["context_processors"]`. Defaults give `{{ user }}`/`{{ perms }}`/`{{ messages }}`/`{{ request }}`. Add ones for genuinely-global data (site, cart count, flags, nav).',
      'CONTEXT PROCESSOR COST: runs on every render -> any ORM call = a guaranteed query on every page. CACHE it (`cache.get_or_set`, bust on save) or don\'t use one — pass page-specific data from the view.',
      '`format_html("<b>{}</b>", user_val)` = builds HTML with EACH arg HTML-ESCAPED, result marked safe — the correct default. `format_html_join(sep, fmt, rows)` for lists.',
      '`mark_safe(s)` = "don\'t escape this" — ONLY for string literals you wrote in full. `mark_safe(f"...{value}...")` with any dynamic value = stored XSS. A "simplification" from `format_html` to `mark_safe(f"...")` is a security regression.',
    ],
    keyTakeawaysHi: [
      'Custom tags/filters `<app>/templatetags/<libname>.py` mein rehते hain — package ko ek empty `__init__.py` CHAHIYE, app `INSTALLED_APPS` mein, aur dev server RESTART. Har module mein `register = template.Library()`; aap module filename se `{% load <libname> %}` karते ho.',
      '`@register.filter def f(value, arg=None)` -> `{{ x|f }}` / `{{ x|f:"arg" }}`. Raise nahi karे; tez ho. HTML return karता hai? -> `is_safe=True` AUR `format_html`/`mark_safe` return karो.',
      '`@register.simple_tag def f(*args, **kwargs)` -> `{% f a b=2 %}` return value output karता hai, ya `{% f a as name %}` ise store karता hai. `takes_context=True` -> pehla param context dict hai.',
      '`@register.inclusion_tag("_frag.html") def f(...)` ek CONTEXT DICT return karता hai; Django `_frag.html` ise render karता hai. Ise tab istemal karो jab fragment ko apni query/logic chahिए.',
      'CONTEXT PROCESSOR = `f(request) -> dict`, HAR template mein merge jо ek request ke saath render hota hai. `TEMPLATES[0]["OPTIONS"]["context_processors"]` mein register karो. Genuinely-global data ke liye ones add karो.',
      'CONTEXT PROCESSOR COST: har render par chalता hai -> koi ORM call = har page par ek guaranteed query. Ise CACHE karो ya ek istemal mat karो.',
      '`format_html("<b>{}</b>", user_val)` = HTML banाता hai HAR arg HTML-ESCAPED ke saath — sahi default.',
      '`mark_safe(s)` = "ise escape mat karो" — SIRF un string literals ke liye jо aapne poora likha. Kisi bhi dynamic value ke saath `mark_safe(f"...{value}...")` = stored XSS.',
    ],
  },

  {
    slug: 'dj-templated-and-html-email',
    title: 'Templated & HTML Email: `send_mail`, `EmailMultiAlternatives`, testing',
    titleHi: 'Templated & HTML Email: `send_mail`, `EmailMultiAlternatives`, testing',
    description: 'Password resets, receipts, notifications — Django apps send email. The right way is a plain-text body and an HTML body, both rendered from templates, sent through a backend you can swap for tests (`mail.outbox`) and production (SMTP / an API), and dispatched from a background task so a slow mail server never blocks a request.',
    descriptionHi: 'Password resets, receipts, notifications — Django apps email bhejती hain. Sahi tareeka ek plain-text body aur ek HTML body hai, dono templates se rendered, ek backend ke through bheja jise aap tests (`mail.outbox`) aur production (SMTP / ek API) ke liye swap kar sakte ho, aur ek background task se dispatched taaki ek slow mail server kabhi ek request block na kare.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 4,

    analogy: {
      en: '**Sending a formal letter through a mailroom.** You do not walk to the post office yourself — you drop the letter in the **mailroom** and it handles postage and delivery. That mailroom is the **email backend**: in development it is a clerk who just photocopies every letter into a binder so you can check what *would* have gone out (`console` / `locmem` backends, `mail.outbox`); in production it is a real courier contract (SMTP, or SendGrid/SES via an API). You write the letter from a **template** so every receipt looks the same and only the numbers change, and you enclose **two versions in the envelope** — a plain typed sheet and a nicely laid-out printed one — so a recipient whose reader cannot handle the fancy version still gets the plain one (`EmailMultiAlternatives`: text body + HTML alternative). And you hand the letter to the mailroom via an **outbox tray**, not by standing at their desk until it is sent — a background task — because the courier being slow today is not a reason to keep your customer waiting on the checkout page.',
      hi: '**Ek mailroom ke through ek formal letter bhejना.** Aap khud post office nahi jaते — aap letter ko **mailroom** mein daalते ho aur wo postage aur delivery handle karता hai. Wo mailroom **email backend** hai: development mein ye ek clerk hai jо har letter ko ek binder mein photocopy karता hai taaki aap check kar sako kya *jाता* (`console` / `locmem` backends, `mail.outbox`); production mein ye ek asli courier contract hai (SMTP, ya SendGrid/SES). Aap letter ek **template** se likhते ho taaki har receipt ek jaisा dikhे, aur aap **envelope mein do versions** rakhते ho — ek plain typed sheet aur ek achhे se laid-out printed — taaki ek recipient jiska reader fancy version handle nahi kar sakta phir bhi plain paता hai. Aur aap letter ko mailroom ko ek **outbox tray** ke through dete ho, unki desk par khade rehकर nahi — ek background task — kyunki courier ka aaj slow hona aapke customer ko checkout page par intezaar karाने ka kaaran nahi hai.',
    },

    simple: `**The quick one: \`send_mail\`**

\`\`\`python
from django.core.mail import send_mail

send_mail(
    subject="Your order shipped",
    message="Order #1042 is on its way.",       # plain text
    from_email=None,                              # None -> DEFAULT_FROM_EMAIL
    recipient_list=["customer@example.com"],
    fail_silently=False,
)
\`\`\`

**The real one: text + HTML from templates**

\`\`\`python
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

def send_receipt(order):
    ctx = {"order": order, "total": order.total}
    text_body = render_to_string("email/receipt.txt", ctx)
    html_body = render_to_string("email/receipt.html", ctx)

    msg = EmailMultiAlternatives(
        subject=f"Receipt for order #{order.id}",
        body=text_body,                          # the text/plain part
        from_email="billing@shop.com",
        to=[order.email],
        reply_to=["support@shop.com"],
    )
    msg.attach_alternative(html_body, "text/html")   # the text/html part
    msg.attach("invoice.pdf", pdf_bytes, "application/pdf")
    msg.send()
\`\`\`

**Settings**

\`\`\`python
# development -- see the mail without sending it
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"   # prints to stdout
# EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"  # tests: mail.outbox
# EMAIL_BACKEND = "django.core.mail.backends.filebased.EmailBackend"; EMAIL_FILE_PATH = "..."

# production -- SMTP
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.postmarkapp.com"; EMAIL_PORT = 587; EMAIL_USE_TLS = True
EMAIL_HOST_USER = env("EMAIL_HOST_USER"); EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = "Shop <no-reply@shop.com>"
SERVER_EMAIL = "alerts@shop.com"        # from-address for error emails to ADMINS
\`\`\`

**Testing — the locmem backend fills \`mail.outbox\`**

\`\`\`python
from django.core import mail

def test_receipt_email(db):
    send_receipt(order)
    assert len(mail.outbox) == 1
    m = mail.outbox[0]
    assert m.subject == "Receipt for order #1042"
    assert m.to == ["customer@example.com"]
    assert "1,299.00" in m.body                       # text part
    html, mime = m.alternatives[0]
    assert mime == "text/html" and "<h1>" in html
\`\`\`

**Don't block the request — send from a task**

\`\`\`python
@shared_task
def email_receipt(order_id):
    send_receipt(Order.objects.get(id=order_id))

# in the view, after the order commits:
transaction.on_commit(lambda: email_receipt.delay(order.id))
\`\`\``,

    simpleHi: `**Quick waala: \`send_mail\`**

\`\`\`python
from django.core.mail import send_mail

send_mail(
    subject="Your order shipped",
    message="Order #1042 is on its way.",       # plain text
    from_email=None,                              # None -> DEFAULT_FROM_EMAIL
    recipient_list=["customer@example.com"],
    fail_silently=False,
)
\`\`\`

**Asli waala: templates se text + HTML**

\`\`\`python
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

def send_receipt(order):
    ctx = {"order": order, "total": order.total}
    text_body = render_to_string("email/receipt.txt", ctx)
    html_body = render_to_string("email/receipt.html", ctx)

    msg = EmailMultiAlternatives(
        subject=f"Receipt for order #{order.id}",
        body=text_body,                          # text/plain part
        from_email="billing@shop.com",
        to=[order.email],
        reply_to=["support@shop.com"],
    )
    msg.attach_alternative(html_body, "text/html")   # text/html part
    msg.attach("invoice.pdf", pdf_bytes, "application/pdf")
    msg.send()
\`\`\`

**Settings**

\`\`\`python
# development -- mail dekho bheje bina
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"   # stdout par print
# EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"  # tests: mail.outbox

# production -- SMTP
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.postmarkapp.com"; EMAIL_PORT = 587; EMAIL_USE_TLS = True
EMAIL_HOST_USER = env("EMAIL_HOST_USER"); EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = "Shop <no-reply@shop.com>"
SERVER_EMAIL = "alerts@shop.com"        # ADMINS ko error emails ke liye from-address
\`\`\`

**Testing — locmem backend \`mail.outbox\` bharता hai**

\`\`\`python
from django.core import mail

def test_receipt_email(db):
    send_receipt(order)
    assert len(mail.outbox) == 1
    m = mail.outbox[0]
    assert m.subject == "Receipt for order #1042"
    assert "1,299.00" in m.body                       # text part
    html, mime = m.alternatives[0]
    assert mime == "text/html" and "<h1>" in html
\`\`\`

**Request block mat karो — ek task se bhejो**

\`\`\`python
@shared_task
def email_receipt(order_id):
    send_receipt(Order.objects.get(id=order_id))

# view mein, order commit hone ke baad:
transaction.on_commit(lambda: email_receipt.delay(order.id))
\`\`\``,

    content: `## The email objects

Django's \`django.core.mail\` gives you a small ladder:

1. **\`send_mail(subject, message, from_email, recipient_list)\`** — one call, plain text, one message. Fine for a quick notification. \`send_mass_mail\` sends several with one connection.
2. **\`EmailMessage(subject, body, from_email, to, cc=, bcc=, reply_to=, headers=)\`** — an object you build up: \`.attach(filename, content, mimetype)\`, \`.attach_file(path)\`, custom headers. Still one body (plain text by default; set \`.content_subtype = "html"\` to send an HTML-only message — not recommended).
3. **\`EmailMultiAlternatives\`** — an \`EmailMessage\` whose \`body\` is the **text/plain** part, plus \`.attach_alternative(html_string, "text/html")\` to add the **text/html** part. The recipient's client picks the richest part it can render. **This is the correct shape for any styled email** — always ship the plain-text alternative, because some clients, notification previews, and accessibility tools use it, and a text-free HTML email scores higher as spam.

## Rendering the bodies from templates

Never build an email body with string formatting. Render it with \`render_to_string\` from a template, exactly like a page:

\`\`\`
templates/email/receipt.txt    <- plain text, real newlines, no markup
templates/email/receipt.html   <- HTML; inline styles only (email clients strip <style> and external CSS)
templates/email/receipt_subject.txt   <- optional: one line, so translators/marketers can edit it
\`\`\`

\`\`\`python
ctx = {"order": order, "user": order.user}
subject = render_to_string("email/receipt_subject.txt", ctx).strip()   # .strip() -- no trailing newline in a subject
text = render_to_string("email/receipt.txt", ctx)
html = render_to_string("email/receipt.html", ctx)
\`\`\`

The templates use the same DTL you already know — \`{% extends "email/base.html" %}\`, \`{{ order.total|money }}\`, \`{% for line in order.lines.all %}\`. Keep an \`email/base.html\` with the shared header/footer/logo and inline-styled table shell.

## Backends — swap by environment

The \`EMAIL_BACKEND\` setting decides what "send" does:

| backend | use | effect |
|---|---|---|
| \`console.EmailBackend\` | local dev | prints the full message to \`stdout\` |
| \`filebased.EmailBackend\` | local dev | writes each message to a file in \`EMAIL_FILE_PATH\` |
| \`locmem.EmailBackend\` | **tests** | appends to the in-memory list \`django.core.mail.outbox\` |
| \`smtp.EmailBackend\` | production | real SMTP with \`EMAIL_HOST\`/\`PORT\`/\`USE_TLS\`/credentials |
| \`dummy.EmailBackend\` | — | discards everything |

For a transactional email provider (Postmark, SES, SendGrid, Mailgun), you can use plain SMTP with their credentials, or install **django-anymail** for an API backend that also gives you delivery webhooks, tags, and per-message tracking.

\`DEFAULT_FROM_EMAIL\` is the \`From:\` when you pass \`from_email=None\`. \`SERVER_EMAIL\` is the \`From:\` for the error emails Django sends to \`ADMINS\` on an unhandled 500 (Module 9). Set both.

## Testing email

With the \`locmem\` backend (Django's test runner and \`pytest-django\` set it automatically), every send appends an \`EmailMessage\` to **\`django.core.mail.outbox\`**, a list that resets between tests:

\`\`\`python
from django.core import mail

def test_password_reset_sends_one_email(client, django_user_model):
    django_user_model.objects.create_user("a", "a@example.com", "pw")
    client.post("/accounts/password_reset/", {"email": "a@example.com"})

    assert len(mail.outbox) == 1
    msg = mail.outbox[0]
    assert msg.to == ["a@example.com"]
    assert "reset" in msg.subject.lower()
    assert "/reset/" in msg.body
    # HTML alternative, if the view sends one:
    assert msg.alternatives and msg.alternatives[0][1] == "text/html"
\`\`\`

\`mail.outbox\` also has \`.subject\`, \`.from_email\`, \`.cc\`, \`.bcc\`, \`.reply_to\`, \`.extra_headers\`, and \`.attachments\` — assert on whatever the feature promises. \`django.test.TestCase\` exposes the same list; \`override_settings(EMAIL_BACKEND=...)\` if a specific test needs a different backend.

## Don't send email in the request/response cycle

\`msg.send()\` opens a network connection to your mail server. On a bad day that takes 5, 10, 30 seconds — and your user is staring at a spinner on the checkout page, or the request times out and they retry and get charged twice. **Send email from a background task** (Module 8):

\`\`\`python
@shared_task(bind=True, max_retries=3, retry_backoff=True)
def send_receipt_email(self, order_id):
    try:
        _send_receipt(Order.objects.get(id=order_id))
    except SMTPException as exc:
        raise self.retry(exc=exc)

# view: enqueue AFTER the transaction commits, so the task can't run before the row exists
transaction.on_commit(lambda: send_receipt_email.delay(order.id))
\`\`\`

Pass the **order ID, not the order object** (Module 8), fetch it fresh in the task, make the task idempotent (an \`emailed_at\` column or a sent-email log) because the queue is at-least-once, and let retries with backoff handle a briefly-down mail server. For low volume without Celery, \`django-mailer\` or \`django-post-office\` queue mail in the database and flush it from a cron job.`,

    contentHi: `## Email objects

Django ka \`django.core.mail\` aapको ek chhoti ladder deता hai:

1. **\`send_mail(subject, message, from_email, recipient_list)\`** — ek call, plain text, ek message. Ek quick notification ke liye theek. \`send_mass_mail\` ek connection ke saath kई bhejता hai.
2. **\`EmailMessage(subject, body, from_email, to, cc=, bcc=, reply_to=, headers=)\`** — ek object jise aap build karते ho: \`.attach(filename, content, mimetype)\`, \`.attach_file(path)\`, custom headers. Abhi bhi ek body.
3. **\`EmailMultiAlternatives\`** — ek \`EmailMessage\` jiska \`body\` **text/plain** part hai, plus **text/html** part add karne ke liye \`.attach_alternative(html_string, "text/html")\`. Recipient ka client sabse rich part chunता hai jо ye render kar sakta hai. **Ye kisi bhi styled email ke liye sahi shape hai** — hamesha plain-text alternative ship karो.

## Templates se bodies render karना

Kabhi ek email body ko string formatting se mat banाओ. Ise ek template se \`render_to_string\` se render karो, bilkul ek page ki tarah:

\`\`\`
templates/email/receipt.txt    <- plain text, asli newlines, koi markup nahi
templates/email/receipt.html   <- HTML; sirf inline styles (email clients <style> aur external CSS strip karте hain)
templates/email/receipt_subject.txt   <- optional: ek line
\`\`\`

\`\`\`python
subject = render_to_string("email/receipt_subject.txt", ctx).strip()   # .strip() -- subject mein koi trailing newline nahi
text = render_to_string("email/receipt.txt", ctx)
html = render_to_string("email/receipt.html", ctx)
\`\`\`

Templates wahi DTL istemal karте hain jise aap pehle se jaanते ho. Shared header/footer/logo ke saath ek \`email/base.html\` rakhो.

## Backends — environment se swap karो

\`EMAIL_BACKEND\` setting tय karता hai ki "send" kya karता hai:

| backend | use | effect |
|---|---|---|
| \`console.EmailBackend\` | local dev | poora message \`stdout\` par print |
| \`filebased.EmailBackend\` | local dev | har message ko \`EMAIL_FILE_PATH\` mein ek file mein likhता hai |
| \`locmem.EmailBackend\` | **tests** | in-memory list \`django.core.mail.outbox\` mein append |
| \`smtp.EmailBackend\` | production | asli SMTP |
| \`dummy.EmailBackend\` | — | sab kuch discard |

Ek transactional email provider ke liye, aap unki credentials ke saath plain SMTP istemal kar sakte ho, ya ek API backend ke liye **django-anymail** install karो jо delivery webhooks bhi deता hai.

\`DEFAULT_FROM_EMAIL\` \`From:\` hai jab aap \`from_email=None\` pass karते ho. \`SERVER_EMAIL\` un error emails ke liye \`From:\` hai jо Django ek unhandled 500 par \`ADMINS\` ko bhejता hai. Dono set karो.

## Email testing

\`locmem\` backend ke saath (Django ka test runner aur \`pytest-django\` ise automatically set karते hain), har send **\`django.core.mail.outbox\`** mein ek \`EmailMessage\` append karता hai, ek list jо tests ke beech reset hoती hai:

\`\`\`python
from django.core import mail

def test_password_reset_sends_one_email(client, django_user_model):
    django_user_model.objects.create_user("a", "a@example.com", "pw")
    client.post("/accounts/password_reset/", {"email": "a@example.com"})
    assert len(mail.outbox) == 1
    msg = mail.outbox[0]
    assert msg.to == ["a@example.com"]
    assert "/reset/" in msg.body
    assert msg.alternatives and msg.alternatives[0][1] == "text/html"
\`\`\`

\`mail.outbox\` mein \`.subject\`, \`.from_email\`, \`.cc\`, \`.bcc\`, \`.reply_to\`, aur \`.attachments\` bhi hain.

## Request/response cycle mein email mat bhejो

\`msg.send()\` aapke mail server ko ek network connection kholता hai. Ek bure din wo 5, 10, 30 seconds leता hai — aur aapका user checkout page par ek spinner ghoorта hai, ya request timeout ho jaती hai aur wo retry karता hai aur do baar charge hota hai. **Email ek background task se bhejो** (Module 8):

\`\`\`python
@shared_task(bind=True, max_retries=3, retry_backoff=True)
def send_receipt_email(self, order_id):
    try:
        _send_receipt(Order.objects.get(id=order_id))
    except SMTPException as exc:
        raise self.retry(exc=exc)

transaction.on_commit(lambda: send_receipt_email.delay(order.id))
\`\`\`

**Order ID pass karो, order object nahi** (Module 8), ise task mein fresh fetch karो, task ko idempotent banाओ kyunki queue at-least-once hai, aur backoff ke saath retries ko ek thodी der ke liye down mail server handle karने do.`,

    examples: [
      {
        title: 'EmailMultiAlternatives: text body + HTML alternative, captured in mail.outbox',
        titleHi: 'EmailMultiAlternatives: text body + HTML alternative, mail.outbox mein captured',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=[],
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="Shop <no-reply@shop.com>",
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [], "APP_DIRS": False,
        "OPTIONS": {"loaders": [("django.template.loaders.locmem.Loader", {
            "email/receipt.txt":  "Order #{{ n }}\\nTotal: {{ total }}\\nThank you.",
            "email/receipt.html": "<h1>Order #{{ n }}</h1><p>Total: <b>{{ total }}</b></p>",
        })]}}])
django.setup()

from django.core import mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

ctx = {"n": 1042, "total": "$1,299.00"}
msg = EmailMultiAlternatives(
    subject=f"Receipt for order #{ctx['n']}",
    body=render_to_string("email/receipt.txt", ctx),
    from_email=None,                       # -> DEFAULT_FROM_EMAIL
    to=["customer@example.com"],
    reply_to=["support@shop.com"],
)
msg.attach_alternative(render_to_string("email/receipt.html", ctx), "text/html")
msg.send()

m = mail.outbox[0]
print("count:    ", len(mail.outbox))
print("from:     ", m.from_email)
print("to:       ", m.to)
print("reply_to: ", m.reply_to)
print("subject:  ", m.subject)
print("body:     ", repr(m.body))
print("alt mime: ", m.alternatives[0][1])
print("alt html: ", m.alternatives[0][0])`,
        output: `count:     1
from:      Shop <no-reply@shop.com>
to:        ['customer@example.com']
reply_to:  ['support@shop.com']
subject:   Receipt for order #1042
body:      'Order #1042\\nTotal: $1,299.00\\nThank you.'
alt mime:  text/html
alt html:  <h1>Order #1042</h1><p>Total: <b>$1,299.00</b></p>`,
        explain: 'The text body is the main `body` argument and the HTML is added via `attach_alternative`, producing a `multipart/alternative` message. The `locmem` backend captures it in `mail.outbox` with everything intact: `from_email` filled from `DEFAULT_FROM_EMAIL` because `None` was passed, `reply_to`, the plain-text `body`, and `alternatives[0]` as `(html, "text/html")`.',
        explainHi: 'Text body main `body` argument hai aur HTML `attach_alternative` ke through add hota hai, ek `multipart/alternative` message produce karके. `locmem` backend ise `mail.outbox` mein sab kuch intact ke saath capture karता hai: `from_email` `DEFAULT_FROM_EMAIL` se bhara kyunki `None` pass hua, `reply_to`, plain-text `body`, aur `alternatives[0]` `(html, "text/html")` ke roop mein.',
      },
      {
        title: 'send_mail with the locmem backend; mail.outbox resets on demand',
        titleHi: 'locmem backend ke saath send_mail; mail.outbox demand par reset',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=[],
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="no-reply@shop.com")
django.setup()

from django.core import mail

mail.send_mail("Welcome", "Thanks for signing up.", None, ["a@example.com"])
mail.send_mail("Tip of the day", "Try dark mode.", None, ["a@example.com", "b@example.com"])

print("messages:", len(mail.outbox))
for m in mail.outbox:
    print(f"  - {m.subject!r} -> {m.to}  from {m.from_email}")

mail.outbox.clear()                 # what the test runner does between tests
print("after clear:", len(mail.outbox))`,
        output: `messages: 2
  - 'Welcome' -> ['a@example.com']  from no-reply@shop.com
  - 'Tip of the day' -> ['a@example.com', 'b@example.com']  from no-reply@shop.com
after clear: 0`,
        explain: "Each `send_mail` call appends one `EmailMessage` to `mail.outbox`; the list holds them in send order with `subject`, `to`, and `from_email` (from `DEFAULT_FROM_EMAIL`) all readable. `mail.outbox.clear()` is exactly what Django's test runner does between tests, which is why every test starts from an empty outbox.",
        explainHi: 'Har `send_mail` call ek `EmailMessage` `mail.outbox` mein append karता hai; list unhe send order mein `subject`, `to`, aur `from_email` (`DEFAULT_FROM_EMAIL` se) sab readable ke saath rakhती hai. `mail.outbox.clear()` theek wahi hai jо Django ka test runner tests ke beech karता hai -- isiliye har test ek empty outbox se shuru hota hai.',
      },
      {
        title: 'The HTML body auto-escapes context, exactly like a page template',
        titleHi: 'HTML body context auto-escape karta hai, bilkul ek page template ki tarah',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=[],
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [], "APP_DIRS": False,
        "OPTIONS": {"loaders": [("django.template.loaders.locmem.Loader", {
            "n.txt":  "Hi {{ name }}, your comment was posted.",
            "n.html": "<p>Hi {{ name }}, your comment was posted:</p><blockquote>{{ body }}</blockquote>",
        })]}}])
django.setup()

from django.core import mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

ctx = {"name": "Ada", "body": "<script>alert('xss in email')</script>"}
msg = EmailMultiAlternatives("Comment posted", render_to_string("n.txt", ctx),
                             "no-reply@shop.com", ["ada@example.com"])
msg.attach_alternative(render_to_string("n.html", ctx), "text/html")
msg.send()

print(mail.outbox[0].alternatives[0][0])`,
        output: `<p>Hi Ada, your comment was posted:</p><blockquote>&lt;script&gt;alert(&#x27;xss in email&#x27;)&lt;/script&gt;</blockquote>`,
        explain: 'The HTML body is rendered from a template, so it goes through the same DTL auto-escaping as a page: the `<script>` in the comment `body` comes out as `&lt;script&gt;` and the single quote as `&#x27;`. Interpolating user-supplied content into a templated email is therefore safe by default, exactly as it is on a web page.',
        explainHi: 'HTML body ek template se rendered hai, to ye ek page jaisा wahi DTL auto-escaping se guzarता hai: comment `body` mein `<script>` `&lt;script&gt;` ban kar aata hai aur single quote `&#x27;`. Ek templated email mein user-supplied content interpolate karna isliye default se safe hai, bilkul jaise ek web page par.',
      },
    ],

    mistakes: [
      {
        wrong: `def checkout(request):
    order = create_order(request)
    send_receipt(order)          # opens an SMTP connection -- blocks the response
    return redirect("order-done")
# mail server slow -> checkout hangs -> user retries -> double order`,
        right: `def checkout(request):
    order = create_order(request)
    transaction.on_commit(lambda: send_receipt_email.delay(order.id))
    return redirect("order-done")

@shared_task(bind=True, max_retries=3, retry_backoff=True)
def send_receipt_email(self, order_id):
    try:
        send_receipt(Order.objects.get(id=order_id))
    except SMTPException as exc:
        raise self.retry(exc=exc)`,
        why: 'msg.send() is a synchronous network call to your mail server. When that server is slow or briefly down, the request thread blocks for the full timeout — seconds to tens of seconds — holding a worker and leaving the user on a spinner. On checkout that is how you get duplicate orders: the user gives up, hits back, and submits again. Move every user-facing email to a background task, enqueued with transaction.on_commit so the task never runs before the row it needs is committed. Pass the ID, fetch fresh, make it idempotent, and let retry with backoff ride out a flaky mail server.',
        whyHi: '\`msg.send()\` aapke mail server ko ek synchronous network call hai. Jab wo server slow ya thodी der down hai, request thread poore timeout ke liye block hota hai — seconds se tens of seconds — ek worker rokकर aur user ko ek spinner par chhodकर. Checkout par aise aapको duplicate orders milते hain. Har user-facing email ko ek background task mein move karो, \`transaction.on_commit\` ke saath enqueued. ID pass karो, fresh fetch karो, ise idempotent banाओ.',
      },
      {
        wrong: `msg = EmailMessage("Receipt", html_body, "shop@x.com", [to])
msg.content_subtype = "html"      # HTML-only email, no plain-text part
msg.send()`,
        right: `msg = EmailMultiAlternatives("Receipt", text_body, "shop@x.com", [to])
msg.attach_alternative(html_body, "text/html")   # BOTH parts
msg.send()
# text_body is a real rendered template (email/receipt.txt), not html2text on the fly`,
        why: 'An HTML-only email has no text/plain part. That hurts you three ways: spam filters score text-free HTML mail worse, so more of it lands in junk; notification previews, screen readers, smart-watch summaries and terminal mail clients show blank or raw tags; and if the HTML fails to render (some corporate clients), the recipient sees nothing. Always send multipart/alternative with a genuinely useful plain-text body — rendered from its own .txt template, not auto-stripped from the HTML — and let the client choose.',
        whyHi: 'Ek HTML-only email mein koi text/plain part nahi hai. Ye aapको teen tareeke se nुksान karता hai: spam filters text-free HTML mail ko bura score karते hain; notification previews, screen readers, terminal mail clients blank ya raw tags dikhाते hain; aur agar HTML render nahi hoता, recipient kuch nahi dekhता. Hamesha ek asal mein useful plain-text body ke saath multipart/alternative bhejो — apne khud ke .txt template se rendered.',
      },
      {
        wrong: `# tests pass a real SMTP host, or hit a provider's sandbox
@override_settings(EMAIL_BACKEND="django.core.mail.backends.smtp.EmailBackend",
                   EMAIL_HOST="smtp.mailtrap.io", ...)
def test_welcome_email(self):
    signup(...)
    # no assertion on content -- just "it didn't crash"`,
        right: `def test_welcome_email(self):        # locmem backend is the default under the test runner
    signup(email="new@example.com")
    self.assertEqual(len(mail.outbox), 1)
    m = mail.outbox[0]
    self.assertEqual(m.to, ["new@example.com"])
    self.assertIn("confirm your email", m.body)
    self.assertEqual(m.alternatives[0][1], "text/html")`,
        why: 'Tests that send through a real SMTP server (even a sandbox like Mailtrap) are slow, flaky, need network and credentials in CI, and usually assert nothing about the message. The locmem backend — active by default under Django\'s test runner and pytest-django — captures every send in mail.outbox with full access to subject, to, body, alternatives, and attachments, synchronously and offline. Assert on what the feature actually promises: the recipient, a key phrase in the body, the presence of the HTML part, the reset link. Reserve a real backend for a single optional smoke test outside the normal suite.',
        whyHi: 'Tests jо ek asli SMTP server (ek sandbox jaise Mailtrap bhi) ke through bhejते hain slow, flaky hain, CI mein network aur credentials chahिए, aur aksar message ke baare mein kuch assert nahi karते. locmem backend — Django ke test runner aur pytest-django ke tahat default se active — har send ko \`mail.outbox\` mein capture karता hai subject, to, body, alternatives, aur attachments tak poori access ke saath, synchronously aur offline. Us par assert karो jо feature asal mein promise karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**`templates/email/base.html` + per-message `.txt` and `.html`** — an `order_shipped.html` extends the email base (inline-styled table, logo, footer), `order_shipped.txt` is the plain equivalent, `order_shipped_subject.txt` is one editable line; a helper `send_templated(name, ctx, to)` renders all three.',
        hi: '**`templates/email/base.html` + prati-message `.txt` aur `.html`** — ek helper `send_templated(name, ctx, to)` teenों render karता hai.',
      },
      {
        en: '**Every email through a Celery task with `retry_backoff` and an idempotency guard** — `Notification.objects.filter(id=nid, sent_at__isnull=True)`; a duplicated queue delivery finds `sent_at` already set and returns without re-sending.',
        hi: '**Har email `retry_backoff` aur ek idempotency guard waale ek Celery task ke through** — ek duplicated queue delivery `sent_at` pehle se set paता hai aur bina re-send kiye return karता hai.',
      },
      {
        en: '**django-anymail with SES + a delivery-status webhook** — bounces and complaints flip a `User.email_verified` flag to `False` so the app stops mailing an address that hard-bounced, protecting the sending domain\'s reputation.',
        hi: '**django-anymail SES + ek delivery-status webhook ke saath** — bounces aur complaints ek `User.email_verified` flag ko `False` karते hain taaki app ek hard-bounce address ko mail karना band kar de.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you send a templated HTML email in Django, and why include a plain-text part?',
        qHi: 'Aap Django mein ek templated HTML email kaise bhejते ho, aur ek plain-text part kyun shamil karो?',
        a: 'You render two bodies from templates with render_to_string — a dot-txt template for the plain-text version and a dot-html template for the HTML — passing both the same context, the same way you render a page. Then you build an EmailMultiAlternatives with the subject, the text body as the main body argument, the from address, and the recipient list, and you call attach_alternative with the HTML string and the mimetype text slash html. That produces a multipart/alternative message: the text is the primary part and the HTML is an alternative, and the recipient\'s mail client renders the richest part it supports. You send it with the send method, or better, from a background task. The plain-text part matters because a meaningful fraction of the audience effectively sees it: spam filters penalise HTML-only mail so it lands in junk more often, screen readers and notification previews and watch summaries and terminal clients use the text part, and some locked-down corporate clients do not render the HTML at all. The text body should be a real rendered template that reads well, not an automatic tag-strip of the HTML. Also relevant: the HTML body auto-escapes its context exactly like a page template, so interpolating user content into an email is safe by default, and DEFAULT_FROM_EMAIL supplies the From address when you pass None.',
        aHi: 'Aap render_to_string se templates se do bodies render karते ho — plain-text version ke liye ek dot-txt template aur HTML ke liye ek dot-html — dono ko wahi context pass karके. Phir aap subject, main body argument ke roop mein text body, from address, aur recipient list ke saath ek EmailMultiAlternatives banाते ho, aur aap HTML string aur mimetype text slash html ke saath attach_alternative call karते ho. Wo ek multipart/alternative message produce karता hai: text primary part hai aur HTML ek alternative hai, aur recipient ka mail client sabse rich part render karता hai jise ye support karता hai. Aap ise send method se bhejते ho, ya behtar, ek background task se. Plain-text part maayne rakhता hai kyunki audience ka ek meaningful hissa ise dekhता hai: spam filters HTML-only mail ko penalise karте hain, screen readers aur notification previews text part istemal karते hain, aur kuch corporate clients HTML bilkul render nahi karते. HTML body apne context ko bilkul ek page template ki tarah auto-escape karता hai.',
      },
      {
        q: 'How do you test that your code sends the right email, and why not send from the view?',
        qHi: 'Aap kaise test karते ho ki aapका code sahi email bhejता hai, aur view se kyun nahi bhejना?',
        a: 'Under Django\'s test runner and pytest-django, the email backend is automatically the locmem backend, which does not send anything — it appends each message to a module-level list, django.core.mail.outbox, that is reset between tests. So the test just exercises the code path that sends, then asserts on mail.outbox: that its length is what you expect, that outbox index zero has the right recipient in dot-to, a key phrase or link in dot-body, the HTML alternative present via dot-alternatives, and the right subject, cc, bcc, reply-to, or attachments if the feature promises them. It is synchronous, offline, and fast, and needs no credentials. You avoid a real SMTP server or even a provider sandbox in tests because those are slow and flaky and usually end up asserting nothing. As for the view: send is a blocking network call to the mail server, and when that server is slow or down the request thread stalls for the whole timeout, holding a worker and showing the user a spinner — on checkout that produces duplicate orders when they give up and retry. So email goes to a background task, enqueued with transaction.on_commit so it cannot run before the data is committed, passing the object\'s ID rather than the object, fetching it fresh in the task, making the task idempotent because the queue is at-least-once, and relying on retry with backoff for a briefly unavailable mail server. In tests you then either run the task eagerly or assert it was enqueued.',
        aHi: 'Django ke test runner aur pytest-django ke tahat, email backend automatically locmem backend hai, jо kuch nahi bhejता — ye har message ko ek module-level list, django.core.mail.outbox, mein append karता hai, jо tests ke beech reset hoती hai. To test bस us code path ko exercise karता hai jо bhejता hai, phir mail.outbox par assert karता hai: ki iski length wo hai jо aap expect karते ho, ki outbox index zero mein dot-to mein sahi recipient hai, dot-body mein ek key phrase ya link, dot-alternatives ke through HTML alternative present. Ye synchronous, offline, aur fast hai. Aap tests mein ek asli SMTP server se bachते ho kyunki wo slow aur flaky hain. View ke baare mein: send mail server ko ek blocking network call hai, aur jab wo server slow ya down hai request thread poore timeout ke liye ruk jaता hai — checkout par ye duplicate orders produce karता hai. To email ek background task mein jाता hai, transaction.on_commit ke saath enqueued.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django with `EMAIL_BACKEND="...locmem..."` and locmem templates `r.txt` = `Order {{ n }}: {{ total }}` and `r.html` = `<b>Order {{ n }}</b>: {{ total }}`. Build an `EmailMultiAlternatives` (subject `Receipt {{n}}` interpolated in Python, text body from `r.txt`, `to=["c@x.com"]`), `attach_alternative` the rendered `r.html` as `text/html`, `.send()`. Assert `len(mail.outbox) == 1`, `mail.outbox[0].body == "Order 5: $9.00"`, and `mail.outbox[0].alternatives[0] == ("<b>Order 5</b>: $9.00", "text/html")`.',
        taskHi: 'Standalone Django `EMAIL_BACKEND="...locmem..."` aur locmem templates `r.txt`/`r.html` ke saath. Ek `EmailMultiAlternatives` banao, `attach_alternative`, `.send()`. Assert `mail.outbox` len 1, body, aur `alternatives[0]`.',
        hint: '`from django.core import mail` then `mail.outbox` after send. `alternatives` is a list of `(content, mimetype)` tuples. `render_to_string("r.txt", {"n": 5, "total": "$9.00"})`.',
        hintHi: '`from django.core import mail` phir send ke baad `mail.outbox`. `alternatives` `(content, mimetype)` tuples ki ek list hai.',
      },
      {
        task: 'Same setup. Render the HTML body from a template `n.html` = `<p>{{ msg }}</p>` with `{"msg": "<script>x</script>"}`. Send it as an alternative. Assert the stored alternative HTML is `<p>&lt;script&gt;x&lt;/script&gt;</p>` — the email template auto-escapes context exactly like a page template.',
        taskHi: 'Wahi setup. HTML body ek template `n.html` se `{"msg": "<script>x</script>"}` ke saath render karo. Ise ek alternative ke roop mein bhejो. Assert stored HTML escaped hai.',
        hint: 'No special escaping config — DTL auto-escaping is on for email templates just as for pages. The `<` becomes `&lt;`.',
        hintHi: 'Koi special escaping config nahi — DTL auto-escaping email templates ke liye on hai jaise pages ke liye.',
      },
      {
        task: 'Model the "send from a task" pattern without Celery: write a function `enqueue_email(order_id, sink)` that appends `order_id` to `sink` (standing in for `.delay()`), and a `deliver(order_id, orders, sink_outbox)` that looks up `orders[order_id]`, calls `send_mail`, and returns early if `order_id in sent_ids`. Call `deliver` twice for the same id; assert only one message reached `mail.outbox` (idempotency) and the second call returned without sending.',
        taskHi: '"Task se send" pattern ko Celery ke bina model karo: `enqueue_email(order_id, sink)` aur `deliver(order_id, orders, ...)` jо `order_id in sent_ids` par jaldी return karता hai. `deliver` ko wahi id ke liye do baar call karo; assert sirf ek message `mail.outbox` mein pahuncha.',
        hint: 'Keep a `sent_ids = set()`; `deliver` checks membership first, sends, then adds. This is the idempotency guard that makes an at-least-once queue safe.',
        hintHi: 'Ek `sent_ids = set()` rakhो; `deliver` pehle membership check karता hai, bhejता hai, phir add karता hai. Ye wo idempotency guard hai.',
      },
    ],

    keyTakeaways: [
      'Ladder: `send_mail(subj, msg, from, [to])` (one plain-text call) -> `EmailMessage(...)` (object: `.attach()`, `cc`/`bcc`/`reply_to`, headers) -> `EmailMultiAlternatives` (`body` = text/plain part + `.attach_alternative(html, "text/html")`). `EmailMultiAlternatives` is THE shape for any styled email.',
      'ALWAYS ship the plain-text alternative — spam filters penalise HTML-only, and previews/screen-readers/terminal clients use it. Render it from its OWN `.txt` template, not an auto-strip of the HTML.',
      'Render both bodies with `render_to_string("email/x.txt"|".html", ctx)` — same DTL as pages, INCLUDING auto-escaping (user content in an HTML email is safe by default). HTML email = inline styles only (clients strip `<style>` + external CSS). `.strip()` a subject rendered from a template.',
      '`EMAIL_BACKEND`: `console` (dev, prints to stdout), `filebased` (dev, writes files), `locmem` (TESTS -> `django.core.mail.outbox`), `smtp` (prod: `EMAIL_HOST`/`PORT`/`USE_TLS`/user/password), `dummy` (discard). Set `DEFAULT_FROM_EMAIL` (used when `from_email=None`) AND `SERVER_EMAIL` (error mail to `ADMINS`).',
      'TEST with the locmem backend (default under the test runner / pytest-django): every send appends an `EmailMessage` to `mail.outbox` (resets between tests). Assert `len(mail.outbox)`, `[0].to`, `[0].subject`, phrase `in [0].body`, `[0].alternatives[0][1] == "text/html"`, `.cc`/`.bcc`/`.reply_to`/`.attachments`. Never test through real SMTP.',
      'NEVER call `.send()` in the request/response cycle — it is a blocking SMTP connection; a slow server hangs the response, and on checkout that = duplicate orders from user retries.',
      'Send from a BACKGROUND TASK (Module 8): `@shared_task(bind=True, max_retries=3, retry_backoff=True)`, `raise self.retry(exc=exc)` on `SMTPException`. Enqueue via `transaction.on_commit(lambda: task.delay(order.id))` — AFTER commit, pass the ID not the object.',
      'The queue is at-least-once -> make the send IDEMPOTENT: an `emailed_at`/`sent_at` column or a sent-email log, checked before sending. Low volume without Celery: `django-mailer`/`django-post-office` (DB queue + cron flush). Providers: plain SMTP creds, or `django-anymail` for an API backend + delivery webhooks.',
    ],
    keyTakeawaysHi: [
      'Ladder: `send_mail(subj, msg, from, [to])` -> `EmailMessage(...)` (`.attach()`, `cc`/`bcc`/`reply_to`) -> `EmailMultiAlternatives` (`body` = text/plain + `.attach_alternative(html, "text/html")`). `EmailMultiAlternatives` kisi bhi styled email ke liye SHAPE hai.',
      'HAMESHA plain-text alternative ship karो — spam filters HTML-only ko penalise karते hain. Ise apne OWN `.txt` template se render karो.',
      'Dono bodies `render_to_string("email/x.txt"|".html", ctx)` se render karो — pages jaisा DTL, auto-escaping SAMET. HTML email = sirf inline styles. Template se rendered subject ko `.strip()` karो.',
      '`EMAIL_BACKEND`: `console` (dev), `filebased` (dev), `locmem` (TESTS -> `mail.outbox`), `smtp` (prod), `dummy`. `DEFAULT_FROM_EMAIL` AUR `SERVER_EMAIL` set karो.',
      'locmem backend se TEST karो: har send `mail.outbox` mein ek `EmailMessage` append karता hai. Assert `len`, `[0].to`, `[0].subject`, `[0].body`, `[0].alternatives[0][1]`. Kabhi asli SMTP ke through test mat karो.',
      'KABHI request/response cycle mein `.send()` call mat karो — ye ek blocking SMTP connection hai; ek slow server response hang karता hai, aur checkout par ye = user retries se duplicate orders.',
      'Ek BACKGROUND TASK se bhejो (Module 8): `@shared_task(bind=True, max_retries=3, retry_backoff=True)`. `transaction.on_commit(lambda: task.delay(order.id))` ke through enqueue — commit ke BAAD, ID pass karो object nahi.',
      'Queue at-least-once hai -> send ko IDEMPOTENT banाओ: ek `sent_at` column ya ek log, bhejने se pehle checked. Celery ke bina: `django-mailer`/`django-post-office`. Providers: plain SMTP, ya `django-anymail`.',
    ],
  },
];
