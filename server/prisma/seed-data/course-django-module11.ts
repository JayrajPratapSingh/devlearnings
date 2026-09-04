/**
 * Django Complete Course — Module 11: Templates, Rendering & Email, lessons 1-2.
 *
 * Lesson 1: the Django Template Language — {{ variables }} and their resolution order
 *           (dict -> attr -> method-no-parens -> index), {% tags %}, filters with |,
 *           {% if %} / {% for %} / {% url %} / {% with %}, autoescape and XSS,
 *           render() / TemplateResponse / render_to_string, the template loaders.
 * Lesson 2: inheritance & partials — {% extends %} / {% block %} / {{ block.super }},
 *           the base.html pattern, {% include %} (+ with / only), component partials,
 *           {% for %}...{% empty %}, when template logic is too much logic.
 *
 * Conventions: see course-django-module10.ts header. Template examples boot Django with
 * settings.configure(TEMPLATES=[{... "loaders": [("django.template.loaders.locmem.Loader",
 * {name: source})]}]) and render with render_to_string / Template(...).render(Context()).
 * Backticks inside simple/content are \`.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_11: CourseLesson[] = [
  {
    slug: 'dj-templates-and-the-dtl',
    title: 'The Django Template Language: Variables, Tags & Filters',
    titleHi: 'Django Template Language: Variables, Tags & Filters',
    description: 'A Django template is plain text (usually HTML) with two kinds of holes: `{{ variables }}` that get substituted, and `{% tags %}` that run logic like loops and conditionals. Values pass through `|filters`. Everything auto-escapes for HTML safety. This is what `render()` turns into a response.',
    descriptionHi: 'Ek Django template plain text (aksar HTML) hai do tarah ke holes ke saath: `{{ variables }}` jо substitute hote hain, aur `{% tags %}` jо loops aur conditionals jaisा logic chalाते hain. Values `|filters` se guzarti hain. Sab kuch HTML safety ke liye auto-escape hota hai. Yahi wo hai jise `render()` ek response mein badalता hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A printed form letter with fill-in blanks and a few conditional paragraphs.** The letter body is fixed text — your HTML. The blanks — "Dear ____", "Your balance is ____" — are `{{ variables }}`: the mail-merge fills them from a data record (the *context*). Some blanks have a formatting instruction attached — "date, written as Month Day, Year" — that is a `|filter`. And a few whole paragraphs are conditional: "if the account is overdue, include the reminder paragraph; for each unpaid invoice, print a line" — those are `{% tags %}`. The one safety rule the print shop enforces automatically: anything merged from the data record is treated as plain text, so a customer whose name is literally `<b>` does not end up bolding half your letter — that is auto-escaping. The template decides *layout and presentation*; it does not decide *what the data is* — that was settled before the merge ran (in the view).',
      hi: '**Fill-in blanks aur kuch conditional paragraphs waala ek printed form letter.** Letter body fixed text hai — aapका HTML. Blanks — "Dear ____", "Your balance is ____" — `{{ variables }}` hain: mail-merge unhe ek data record (the *context*) se bharता hai. Kuch blanks ke saath ek formatting instruction attached hai — "date, Month Day, Year likhी" — wo ek `|filter` hai. Aur kuch poore paragraphs conditional hain: "agar account overdue hai, reminder paragraph shamil karो; har unpaid invoice ke liye, ek line print karो" — wo `{% tags %}` hain. Ek safety rule jо print shop automatically enforce karता hai: data record se merge kी koi bhi cheez plain text ki tarah treat hoती hai, to jiska naam literally `<b>` hai wo aapke aadhे letter ko bold nahi kar deता — wo auto-escaping hai. Template *layout aur presentation* tय karता hai; ye *data kya hai* tय nahi karता — wo merge chalने se pehle settle ho gaya tha (view mein).',
    },

    simple: `**\`{{ }}\` prints a value; \`{% %}\` runs logic**

\`\`\`django
<h1>{{ book.title }}</h1>                      {# variable #}
<p>by {{ book.author|default:"Unknown" }}</p>  {# variable | filter #}

{% if book.in_print %}                          {# tag: conditional #}
  <span>In stock</span>
{% else %}
  <span>Out of print</span>
{% endif %}

<ul>
{% for tag in book.tags.all %}                  {# tag: loop #}
  <li>{{ tag.name }}</li>
{% empty %}
  <li>no tags</li>
{% endfor %}

<a href="{% url 'book-detail' pk=book.id %}">details</a>   {# tag: reverse a URL #}
{# this is a comment -- not rendered #}
\`\`\`

**Variable resolution — Django tries, in order:**

\`\`\`
{{ x.y }}   1. dict lookup      x['y']
            2. attribute        x.y
            3. method call      x.y()      <-- NO parentheses in the template; Django calls it
            4. list index       x[y]       (numeric: {{ items.0 }})
a lookup that fails at every step  ->  '' (empty string), NOT an error   (silent by design)
\`\`\`

**Filters — \`|\` transforms a value**

\`\`\`django
{{ name|upper }}                {{ price|floatformat:2 }}       {{ text|truncatewords:20 }}
{{ created|date:"M j, Y" }}     {{ body|linebreaks }}           {{ qty|default:0 }}
{{ a|add:b }}                   {{ items|length }}              {{ html|safe }}   {# opt OUT of escaping -- careful #}
\`\`\`

**Auto-escaping — HTML safety by default**

\`\`\`django
{{ user_bio }}      {# "<script>x</script>"  renders as  &lt;script&gt;x&lt;/script&gt;  #}
{{ user_bio|safe }} {# renders the raw HTML -- ONLY for content YOU control / already sanitised #}
{% autoescape off %}{{ trusted_html }}{% endautoescape %}
\`\`\`

**Rendering a template from a view**

\`\`\`python
from django.shortcuts import render

def book_detail(request, pk):
    book = get_object_or_404(Book, pk=pk)
    return render(request, "books/detail.html", {"book": book})   # template + context -> HttpResponse

# lower-level:  render_to_string("books/detail.html", {...})  -> a str
#               TemplateResponse(request, "...", {...})       -> lazy, middleware can still change it
\`\`\`

\`\`\`
templates live in:  <app>/templates/<app>/name.html   (with APP_DIRS = True)  or  a project templates/ dir
the "<app>/" folder inside templates/ is namespacing -- so two apps' "detail.html" don't collide
\`\`\``,

    simpleHi: `**\`{{ }}\` ek value print karता hai; \`{% %}\` logic chalाता hai**

\`\`\`django
<h1>{{ book.title }}</h1>                      {# variable #}
<p>by {{ book.author|default:"Unknown" }}</p>  {# variable | filter #}

{% if book.in_print %}                          {# tag: conditional #}
  <span>In stock</span>
{% else %}
  <span>Out of print</span>
{% endif %}

<ul>
{% for tag in book.tags.all %}                  {# tag: loop #}
  <li>{{ tag.name }}</li>
{% empty %}
  <li>no tags</li>
{% endfor %}

<a href="{% url 'book-detail' pk=book.id %}">details</a>   {# tag: ek URL reverse karो #}
\`\`\`

**Variable resolution — Django try karता hai, order mein:**

\`\`\`
{{ x.y }}   1. dict lookup      x['y']
            2. attribute        x.y
            3. method call      x.y()      <-- template mein KOI parentheses NAHI; Django ise call karता hai
            4. list index       x[y]       (numeric: {{ items.0 }})
ek lookup jо har step par fail hoता hai  ->  '' (empty string), ek error NAHI
\`\`\`

**Filters — \`|\` ek value transform karता hai**

\`\`\`django
{{ name|upper }}                {{ price|floatformat:2 }}       {{ text|truncatewords:20 }}
{{ created|date:"M j, Y" }}     {{ body|linebreaks }}           {{ qty|default:0 }}
{{ a|add:b }}                   {{ items|length }}              {{ html|safe }}   {# escaping se opt OUT -- saavdhaan #}
\`\`\`

**Auto-escaping — default se HTML safety**

\`\`\`django
{{ user_bio }}      {# "<script>x</script>"  render hota hai  &lt;script&gt;x&lt;/script&gt;  #}
{{ user_bio|safe }} {# raw HTML render karता hai -- SIRF wo content jо AAP control karते ho #}
\`\`\`

**Ek view se ek template render karना**

\`\`\`python
from django.shortcuts import render

def book_detail(request, pk):
    book = get_object_or_404(Book, pk=pk)
    return render(request, "books/detail.html", {"book": book})   # template + context -> HttpResponse

# lower-level:  render_to_string("books/detail.html", {...})  -> ek str
#               TemplateResponse(request, "...", {...})       -> lazy, middleware badal sakta hai
\`\`\`

\`\`\`
templates rehte hain:  <app>/templates/<app>/name.html   (APP_DIRS = True ke saath)  ya  ek project templates/ dir
templates/ ke andar "<app>/" folder namespacing hai -- to do apps ki "detail.html" collide na ho
\`\`\``,

    content: `## What a template is

A Django template is a text file — almost always HTML, but it can be an email body, a CSV, an SVG, anything — containing:

- **\`{{ expression }}\`** — a *variable* output. Django evaluates the expression against the **context** (a dict of names the view passed) and inserts the string form.
- **\`{% tag %}\` … \`{% endtag %}\`** — a *template tag*: control flow (\`if\`, \`for\`), structure (\`block\`, \`extends\`, \`include\`), or a helper (\`url\`, \`csrf_token\`, \`now\`).
- **\`{# comment #}\`** — not rendered.
- Everything else is literal text, passed through unchanged.

The template is deliberately **not a programming language**. It has no assignment, no arbitrary expressions, no imports. This is a design choice: it keeps presentation logic in templates and *business* logic in Python where it can be tested. If you find yourself fighting the template language, the answer is almost always to compute the value in the view or a model method and pass it in.

## Variable resolution

\`{{ a.b.c }}\` — the dots are *not* attribute access as in Python. For each segment, Django tries, **in this order**:

1. **Dictionary lookup:** \`a['b']\`
2. **Attribute access:** \`a.b\`
3. **Method call with no arguments:** \`a.b()\` — you write \`{{ order.total }}\`, not \`{{ order.total() }}\`; Django calls it. (A method that needs arguments cannot be called from a template — expose it as a property or a template tag.)
4. **Numeric index:** \`a[b]\` — \`{{ items.0 }}\` is \`items[0]\`.

If **every** step fails (the name is not in the context, the attribute does not exist), the result is **the empty string, not an error**. Templates fail silently by design — a missing variable should not blow up a page. This also means a typo in a variable name renders nothing rather than complaining; \`{% if debug %}{{ template.render.errors }}{% endif %}\` and the \`TEMPLATE_STRING_IF_INVALID\` setting help surface these in development.

A callable's \`.alters_data = True\` or \`.do_not_call_in_templates = True\` stops the template from calling it — Django sets this on things like \`delete()\` so \`{{ object.delete }}\` cannot accidentally delete a row.

## Tags

The essential built-ins:

- **\`{% if cond %} … {% elif %} … {% else %} … {% endif %}\`** — conditions use \`==\`, \`!=\`, \`<\`, \`in\`, \`not\`, \`and\`, \`or\`. No arbitrary expressions.
- **\`{% for x in seq %} … {% empty %} … {% endfor %}\`** — \`{% empty %}\` runs if \`seq\` is empty. Inside the loop, \`{{ forloop.counter }}\` (1-based), \`forloop.counter0\`, \`forloop.first\`, \`forloop.last\`, \`forloop.revcounter\`, and \`forloop.parentloop\` for nested loops.
- **\`{% url 'name' arg1 kw=val %}\`** — reverse a URL by its \`name\` (Module 1). **Never hard-code a path in a template.**
- **\`{% with total=order.compute_total %} … {% endwith %}\`** — bind a value once (useful when an expensive lookup or method is used several times).
- **\`{% now "Y" %}\`**, **\`{% csrf_token %}\`** (Module 4), **\`{% spaceless %}\`**, **\`{% verbatim %}\`** (emit \`{{ }}\` literally, e.g. for a JS framework).
- **\`{% extends %}\`, \`{% block %}\`, \`{% include %}\`** — Lesson 2.
- **\`{% load %}\`** — pull in a custom tag/filter library (Lesson 3).

## Filters

A **filter** transforms a value: \`{{ value|filter:arg }}\`. Chain them left to right: \`{{ name|lower|capfirst }}\`. Common ones:

| filter | use |
|---|---|
| \`default:"—"\` / \`default_if_none:"—"\` | fallback for falsy / \`None\` |
| \`date:"M j, Y"\` / \`time:"H:i"\` / \`timesince\` | format dates |
| \`floatformat:2\` | \`3.1\` → \`3.10\`; \`-2\` = "up to 2 places" |
| \`truncatewords:20\` / \`truncatechars:100\` | shorten |
| \`length\` / \`length_is\` / \`first\` / \`last\` / \`join:", "\` | sequences |
| \`linebreaks\` / \`linebreaksbr\` / \`urlize\` | plain text → HTML |
| \`add:5\` / \`divisibleby:3\` | light arithmetic |
| \`pluralize\` | \`{{ n }} item{{ n|pluralize }}\` |
| \`safe\` / \`escape\` / \`escapejs\` / \`striptags\` | escaping control |

Filters run in the template — but a filter is Python (Lesson 3), so anything complex (currency formatting, a computed label, i18n) is better as a **custom filter** with a name and a test, not a chain of six built-ins.

## Auto-escaping and XSS

By default, **every variable output is HTML-escaped**: \`<\`, \`>\`, \`&\`, \`'\`, \`"\` become entities. So if \`comment.body\` contains \`<script>steal()</script>\`, the page shows that text literally instead of running it. This is Django's built-in defence against **cross-site scripting (XSS)** and it is on for everything, everywhere, unless you opt out.

You opt out with **\`{{ value|safe }}\`** or **\`{% autoescape off %}…{% endautoescape %}\`**. Only do this for HTML that **you** produced or have already sanitised (with \`bleach\` or similar). Marking user input \`|safe\` is the classic way a comment field becomes an XSS hole.

In Python, the equivalents are \`django.utils.safestring.mark_safe(s)\` (this string is safe, do not escape it) and \`django.utils.html.format_html("<b>{}</b>", user_value)\` (build HTML with the placeholders escaped) — Lesson 3.

## Rendering from a view

- **\`render(request, template_name, context)\`** — the workhorse. Loads the template, renders it against \`context\` (plus the context processors — Lesson 3), returns an \`HttpResponse\`.
- **\`render_to_string(template_name, context, request=None)\`** — returns the rendered string. Use it for email bodies, a PDF source, an HTMX partial you assemble yourself.
- **\`TemplateResponse(request, template_name, context)\`** — a *lazy* response: the template is not rendered until the response is about to be sent, so middleware and decorators can still swap the template or add context. Class-based views use this.

## Where templates live

With \`"APP_DIRS": True\` (the default), Django looks in every app's \`templates/\` directory. The convention is \`myapp/templates/myapp/detail.html\` — the extra \`myapp/\` folder **namespaces** the template so \`render(request, "myapp/detail.html")\` is unambiguous even if another app also has a \`detail.html\`. A project-level \`templates/\` directory (added to \`DIRS\`) holds shared templates like \`base.html\` and \`404.html\`.`,

    contentHi: `## Ek template kya hai

Ek Django template ek text file hai — lगbhag hamesha HTML, par ye ek email body, ek CSV, ek SVG bhi ho sakti hai — jismें hai:

- **\`{{ expression }}\`** — ek *variable* output. Django expression ko **context** (view ne jо names pass kiye unka ek dict) ke against evaluate karता hai.
- **\`{% tag %}\` … \`{% endtag %}\`** — ek *template tag*: control flow (\`if\`, \`for\`), structure (\`block\`, \`extends\`, \`include\`), ya ek helper (\`url\`, \`csrf_token\`).
- **\`{# comment #}\`** — render nahi hota.

Template jaan-boojhkar **ek programming language nahi hai**. Isme koi assignment nahi, koi arbitrary expressions nahi, koi imports nahi. Ye ek design choice hai. Agar aap template language se lad rahe ho, jawab lगbhag hamesha value ko view ya ek model method mein compute karके pass karna hai.

## Variable resolution

\`{{ a.b.c }}\` — dots Python jaise attribute access *nahi* hain. Har segment ke liye, Django try karता hai, **is order mein**:

1. **Dictionary lookup:** \`a['b']\`
2. **Attribute access:** \`a.b\`
3. **Bina arguments ka method call:** \`a.b()\` — aap \`{{ order.total }}\` likhते ho, \`{{ order.total() }}\` nahi. (Arguments waala ek method template se call nahi ho sakta.)
4. **Numeric index:** \`a[b]\` — \`{{ items.0 }}\`.

Agar **har** step fail hoता hai, result **empty string hai, ek error nahi**. Templates jaan-boojhkar chupchaap fail hoते hain.

## Tags

- **\`{% if %} … {% elif %} … {% else %} … {% endif %}\`** — conditions \`==\`, \`!=\`, \`<\`, \`in\`, \`not\`, \`and\`, \`or\` istemal karती hain.
- **\`{% for x in seq %} … {% empty %} … {% endfor %}\`** — \`{% empty %}\` \`seq\` khali hone par chalता hai. Loop ke andar, \`{{ forloop.counter }}\` (1-based), \`forloop.first\`, \`forloop.last\`, nested ke liye \`forloop.parentloop\`.
- **\`{% url 'name' arg1 kw=val %}\`** — ek URL ko iske \`name\` se reverse karो. **Ek template mein kabhi ek path hard-code mat karो.**
- **\`{% with x=expensive %} … {% endwith %}\`** — ek value ek baar bind karो.
- **\`{% now %}\`**, **\`{% csrf_token %}\`**, **\`{% verbatim %}\`** (\`{{ }}\` literally emit karो).

## Filters

Ek **filter** ek value transform karता hai: \`{{ value|filter:arg }}\`. Left to right chain karो. Aam: \`default\`, \`date\`, \`floatformat:2\`, \`truncatewords\`, \`length\`, \`join\`, \`linebreaks\`, \`pluralize\`, \`safe\`.

Kuch bhi complex (currency formatting, ek computed label, i18n) ek **custom filter** ke roop mein behtar hai (Lesson 3), chhe built-ins ki ek chain nahi.

## Auto-escaping aur XSS

Default se, **har variable output HTML-escaped hai**: \`<\`, \`>\`, \`&\`, \`'\`, \`"\` entities ban jaate hain. To agar \`comment.body\` mein \`<script>steal()</script>\` hai, page wo text literally dikhाता hai ise chalाने ke bजाy. Ye Django ka **cross-site scripting (XSS)** ke khilaf built-in bachaव hai.

Aap **\`{{ value|safe }}\`** ya **\`{% autoescape off %}\`** se opt out karते ho. Ye sirf us HTML ke liye karो jо **aapne** banाya ya pehle se sanitise kiya. User input ko \`|safe\` mark karna wo classic tareeka hai jisse ek comment field ek XSS hole ban jaता hai.

## Ek view se rendering

- **\`render(request, template_name, context)\`** — workhorse. \`HttpResponse\` return karता hai.
- **\`render_to_string(template_name, context, request=None)\`** — rendered string return karता hai. Email bodies, ek HTMX partial ke liye.
- **\`TemplateResponse(...)\`** — ek *lazy* response: template tab tak render nahi hota jab tak response bhejने waala nahi hota, to middleware abhi bhi template swap kar sakta hai. Class-based views ise istemal karte hain.

## Templates kahaan rehते hain

\`"APP_DIRS": True\` ke saath, Django har app ki \`templates/\` directory mein dekhता hai. Convention \`myapp/templates/myapp/detail.html\` hai — extra \`myapp/\` folder template ko **namespace** karता hai. Ek project-level \`templates/\` directory shared templates jaise \`base.html\` rakhती hai.`,

    examples: [
      {
        title: 'Variables resolve by dict -> attr -> method (no parens) -> index; a miss is empty',
        titleHi: 'Variables dict -> attr -> method (no parens) -> index se resolve; ek miss empty hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=[],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [], "APP_DIRS": False,
        "OPTIONS": {"loaders": [("django.template.loaders.locmem.Loader", {
            "t.html": "dict={{ d.price }} attr={{ o.name }} method={{ o.total }} "
                      "index={{ items.0 }} missing=[{{ o.nope }}]",
        })]}}])
django.setup()

from django.template.loader import render_to_string

class Order:
    name = "Order #7"
    def total(self):            # NOTE: a plain method, called with NO parens in the template
        return 4200

print(render_to_string("t.html", {
    "d": {"price": 39.99},
    "o": Order(),
    "items": ["first", "second"],
}))`,
        output: `dict=39.99 attr=Order #7 method=4200 index=first missing=[]`,
        explain: 'The dot syntax is not attribute access: Django tries dict lookup, then attribute, then a no-argument method call, then a numeric index, and stops at the first that works. `{{ o.total }}` finds the `total` method and calls it with no parentheses -- writing `{{ o.total() }}` would be a syntax error. `{{ o.nope }}` fails every step and resolves to the empty string, not an exception, which is why a mistyped variable name silently renders nothing.',
        explainHi: 'Dot syntax attribute access nahi hai: Django dict lookup, phir attribute, phir bina-argument method call, phir ek numeric index try karता hai, aur pehle jо kaam kare wahan ruk jaता hai. `{{ o.total }}` `total` method paता hai aur ise bina parentheses call karता hai -- `{{ o.total() }}` ek syntax error hoगा. `{{ o.nope }}` har step fail karता hai aur empty string mein resolve hota hai, ek exception nahi -- isiliye ek mistyped variable name chupchaap kuch render nahi karता.',
      },
      {
        title: 'Auto-escaping neutralises an XSS payload; |safe opts out',
        titleHi: 'Auto-escaping ek XSS payload ko neutralise karta hai; |safe opt out karta hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=[],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [], "APP_DIRS": False,
        "OPTIONS": {"loaders": [("django.template.loaders.locmem.Loader", {
            "t.html": "escaped: {{ bio }}\\n"
                      "raw (|safe): {{ trusted|safe }}\\n"
                      "block off: {% autoescape off %}{{ bio }}{% endautoescape %}",
        })]}}])
django.setup()

from django.template.loader import render_to_string

print(render_to_string("t.html", {
    "bio":     "<script>steal(document.cookie)</script>",   # hostile user input
    "trusted": "<em>italic, from our own CMS</em>",          # HTML we produced
}))`,
        output: `escaped: &lt;script&gt;steal(document.cookie)&lt;/script&gt;
raw (|safe): <em>italic, from our own CMS</em>
block off: <script>steal(document.cookie)</script>`,
        explain: 'The hostile `bio` value comes out with its angle brackets turned into `&lt;` and `&gt;`, so the browser shows the text of a script tag instead of executing it -- that is auto-escaping, on by default for every variable. `{{ trusted|safe }}` and the `{% autoescape off %}` block both emit the raw HTML unchanged; only ever do that for markup you generated or sanitised yourself, never for user input.',
        explainHi: 'Hostile `bio` value apne angle brackets ke saath bahar aata hai jо `&lt;` aur `&gt;` ban gaye, to browser ek script tag ka text dikhाता hai use execute karne ke bजाy -- wo auto-escaping hai, har variable ke liye default se on. `{{ trusted|safe }}` aur `{% autoescape off %}` block dono raw HTML unchanged emit karते hain; wo sirf us markup ke liye karो jо aapne khud banाya ya sanitise kiya, kabhi user input ke liye nahi.',
      },
      {
        title: 'for / empty / forloop and {% url %} with a named route',
        titleHi: 'for / empty / forloop aur {% url %} ek named route ke saath',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=[],
    ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [], "APP_DIRS": False,
        "OPTIONS": {"loaders": [("django.template.loaders.locmem.Loader", {
            "list.html": "{% for b in books %}"
                         "{{ forloop.counter }}. {{ b.title }}"
                         "{% if forloop.first %} (newest){% endif %}"
                         " -> {% url 'book' pk=b.id %}\\n"
                         "{% empty %}(no books)\\n"
                         "{% endfor %}",
        })]}}])
django.setup()

from django.urls import path
from django.template.loader import render_to_string

def book_view(request, pk):
    pass

urlpatterns = [path("books/<int:pk>/", book_view, name="book")]

class B:
    def __init__(self, id, title):
        self.id, self.title = id, title

print(render_to_string("list.html", {"books": [B(9, "New Release"), B(4, "Older One")]}))
print("---")
print(render_to_string("list.html", {"books": []}))`,
        output: `1. New Release (newest) -> /books/9/
2. Older One -> /books/4/

---
(no books)
`,
        explain: "`{% for %}` exposes `forloop.counter` (1-based) and `forloop.first` / `forloop.last` for row-position logic. `{% url 'book' pk=b.id %}` reverses the named route to `/books/9/` -- the path lives only in `urls.py`, so restructuring URLs cannot silently break these links. The second render with an empty list runs the `{% empty %}` branch instead of the loop body.",
        explainHi: "`{% for %}` `forloop.counter` (1-based) aur `forloop.first` / `forloop.last` expose karता hai row-position logic ke liye. `{% url 'book' pk=b.id %}` named route ko `/books/9/` mein reverse karता hai -- path sirf `urls.py` mein rehता hai, to URLs restructure karna in links ko chupchaap tod nahi sakta. Empty list ke saath doosra render loop body ke bजाy `{% empty %}` branch chalाता hai.",
      },
    ],

    mistakes: [
      {
        wrong: `{# in the template #}
<p>Total: {{ order.calculate_total() }}</p>
{# TemplateSyntaxError: Could not parse the remainder: '()' #}`,
        right: `{# templates call callables automatically -- no parentheses #}
<p>Total: {{ order.calculate_total }}</p>

{# if the method needs an argument, it cannot be called from a template.
   expose it as a property, or compute it in the view: #}
def order_detail(request, pk):
    order = ...
    return render(request, "order.html", {"order": order, "total": order.total_with_tax(0.08)})`,
        why: 'The Django template language does not support call syntax. When you write {{ x.y }} and y turns out to be a method, Django calls it for you with no arguments. Writing {{ x.y() }} is a syntax error. This is intentional — it keeps templates from running arbitrary code. If a method needs arguments, you have two options: turn it into a zero-argument method or a @property so {{ order.total }} works, or call it in the view and pass the result into the context. A common pattern is a model @property for display values (full_name, is_overdue, display_status).',
        whyHi: 'Django template language call syntax support nahi karता. Jab aap \`{{ x.y }}\` likhते ho aur y ek method niklता hai, Django ise bina arguments ke aapke liye call karता hai. \`{{ x.y() }}\` ek syntax error hai. Ye jaan-boojhkar hai. Agar ek method ko arguments chahिए: ise ek zero-argument method ya ek \`@property\` banाओ, ya ise view mein call karके result context mein pass karो.',
      },
      {
        wrong: `{# rendering user-submitted markdown/HTML #}
<div class="comment">{{ comment.body_html|safe }}</div>
{# comment.body_html came straight from a <textarea>. |safe = stored XSS. #}`,
        right: `{# sanitise on the way IN, then the stored value is trusted: #}
# in the model / form:
import bleach
self.body_html = bleach.clean(raw, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS)

{# now |safe is acceptable because the value was sanitised before storage: #}
<div class="comment">{{ comment.body_html|safe }}</div>
{# or don't allow HTML at all: {{ comment.body|linebreaks }} #}`,
        why: 'Auto-escaping is the only thing stopping a comment, bio, product review, or support message that contains <script> from executing in every viewer\'s browser. |safe turns it off. Applying |safe to anything that originated from a user — even after "it looked fine in testing" — is the textbook stored-XSS vulnerability. If you must render user HTML, sanitise it with a real allowlist library (bleach, nh3) at the point it enters the system, so the stored value is already safe; then |safe on that column is defensible. If you do not need HTML, render the plain text with linebreaks and never touch |safe.',
        whyHi: 'Auto-escaping ekmatra cheez hai jо ek comment, bio, ya review jismें \`<script>\` hai use har viewer ke browser mein execute hone se rok rahi hai. \`|safe\` ise band kar deta hai. User se aayi kisi bhi cheez par \`|safe\` lागू karna textbook stored-XSS vulnerability hai. Agar aapको user HTML render karना hai, ise ek real allowlist library (bleach, nh3) se system mein enter hone ke point par sanitise karो.',
      },
      {
        wrong: `{# hard-coded path in a template #}
<a href="/books/{{ book.id }}/">details</a>
<form action="/checkout/step-2/" method="post">
{# a later urls.py change to /catalog/books/<pk>/ silently breaks every one of these #}`,
        right: `<a href="{% url 'book-detail' pk=book.id %}">details</a>
<form action="{% url 'checkout-step' step=2 %}" method="post">
{# {% url %} reverses the route by name -- change the path once in urls.py, every link follows #}`,
        why: 'Hard-coding URL paths in templates spreads knowledge of your routing across dozens of files. When you restructure urls.py — add a prefix, move an app, change a converter — every hard-coded href and form action silently points at a 404, and you find them one by one in production. {% url \'name\' %} reverses the route from its name (Module 1), so the path is defined in exactly one place. It also fails loudly at render time if the name or arguments are wrong, catching the mistake in development.',
        whyHi: 'Templates mein URL paths hard-code karna aapki routing ka gyaan dozens of files mein failा deта hai. Jab aap \`urls.py\` restructure karते ho, har hard-coded href chupchaap ek 404 par point karता hai. \`{% url \'name\' %}\` route ko iske name se reverse karता hai (Module 1), to path theek ek jagah defined hai. Ye render time par loudly fail bhi hoता hai agar name ya arguments galat hain.',
      },
    ],

    realWorld: [
      {
        en: '**`TEMPLATE_STRING_IF_INVALID` (or a strict template backend) in the dev settings** — so a typo\'d `{{ bok.title }}` renders a loud `INVALID` marker instead of a silent blank, catching the mistake before it ships as a mysteriously empty page.',
        hi: '**Dev settings mein `TEMPLATE_STRING_IF_INVALID`** — to ek typo\'d `{{ bok.title }}` ek loud `INVALID` marker render karता hai ek silent blank ke bजाy.',
      },
      {
        en: '**Model `@property` methods for every display value** — `is_overdue`, `display_status`, `full_name`, `absolute_url` — so templates stay `{{ order.display_status }}` and the logic (with its edge cases and tests) lives in Python.',
        hi: '**Har display value ke liye model `@property` methods** — `is_overdue`, `display_status`, `full_name` — to templates `{{ order.display_status }}` rehते hain aur logic Python mein rehta hai.',
      },
      {
        en: '**`bleach.clean` on save + `|safe` on read for rich-text fields** — the comment/article body is sanitised against a fixed tag allowlist the moment the form validates, so by the time the template renders it, `|safe` is safe.',
        hi: '**Rich-text fields ke liye save par `bleach.clean` + read par `|safe`** — body ek fixed tag allowlist ke against sanitise hota hai jab form validate hota hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How does `{{ a.b.c }}` resolve in a Django template, and why do templates fail silently on a missing variable?',
        qHi: 'Ek Django template mein `{{ a.b.c }}` kaise resolve hota hai, aur ek missing variable par templates chupchaap kyun fail hote hain?',
        a: 'The dots in a template variable are not Python attribute access — Django tries several lookup strategies for each segment, in a fixed order. First a dictionary lookup, so a.b means a with key b. If that fails, attribute access, a.b. If that fails and the attribute is a callable, Django calls it with no arguments — this is why you write order.total, not order.total, in the template even when total is a method; Django invokes it for you. Finally, if the segment is a number, a list index. The first strategy that succeeds wins. If every strategy fails at some segment — the name is not in the context, the attribute does not exist, the key is missing — the whole expression resolves to the empty string, not an exception. That silent-failure behaviour is deliberate. A template is presentation, often assembled by someone who is not the person who wrote the view, and a single missing or misspelled variable should degrade gracefully to a blank rather than crash the entire page for the user. The tradeoff is that typos are invisible — {{ usr.name }} instead of {{ user.name }} just renders nothing. You mitigate that in development by setting the string_if_invalid template option to something loud like INVALID, or using a stricter template backend, so missing variables are obvious while you are building the page but never break production.',
        aHi: 'Template variable mein dots Python attribute access nahi hain — Django har segment ke liye kई lookup strategies try karता hai, ek fixed order mein. Pehle ek dictionary lookup, to a.b matlab key b ke saath a. Agar wo fail hoता hai, attribute access. Agar wo fail hoता hai aur attribute ek callable hai, Django ise bina arguments ke call karता hai — isiliye aap template mein order.total likhते ho, order.total() nahi. Aakhir mein, agar segment ek number hai, ek list index. Jо pehli strategy safal hoती hai wo jeetती hai. Agar kisi segment par har strategy fail hoती hai, poora expression empty string mein resolve hoता hai, ek exception nahi. Wo silent-failure behaviour jaan-boojhkar hai. Ek single missing variable poore page ko crash karne ke bजाy gracefully ek blank mein degrade hona chahिए. Aap ise development mein string_if_invalid template option ko INVALID jaise loud kuch set karके mitigate karते ho.',
      },
      {
        q: 'What is auto-escaping, when do you use `|safe`, and how is that different from `mark_safe` / `format_html`?',
        qHi: 'Auto-escaping kya hai, aap `|safe` kab istemal karते ho, aur wo `mark_safe` / `format_html` se kaise alag hai?',
        a: 'Auto-escaping means Django HTML-escapes every variable it outputs — the characters less-than, greater-than, ampersand, single and double quote become their HTML entities — so that a value containing markup is displayed as text rather than interpreted by the browser. It is on for every variable in every template unless you explicitly turn it off, and it is the primary defence against cross-site scripting: a comment body of <script>...</script> renders harmlessly. You turn it off with the safe filter on one value, or an autoescape off block for a region. The only legitimate reason to do that is when the value is HTML that you generated or have already sanitised — a rendered markdown field that went through a sanitiser like bleach, output from a trusted CMS, an SVG you built. Applying safe to raw user input is the canonical stored-XSS bug. mark_safe and format_html are the Python-side equivalents for code that builds HTML strings, for example in a model method or a custom template tag. mark_safe of a string tells the template system this string is already safe, do not escape it — same danger as safe, so you only pass it strings you fully control. format_html is the safe way to build HTML with dynamic parts: you give it a format string with placeholders and the arguments, and it escapes each argument before substituting, so format_html of "<b>{}</b>" and a username produces bold text with the username escaped. The rule is: escape by default, and when you must emit HTML, build it with format_html and sanitise anything from users before it is ever stored.',
        aHi: 'Auto-escaping ka matlab Django jо har variable output karता hai use HTML-escape karता hai — less-than, greater-than, ampersand, quotes apni HTML entities ban jaate hain — taaki markup waali ek value browser dwara interpret hone ke bजाy text ke roop mein dikhे. Ye har template mein har variable ke liye on hai jab tak aap ise explicitly band na karो, aur ye cross-site scripting ke khilaf mukhya bachaव hai. Aap ise ek value par safe filter, ya ek region ke liye autoescape off block se band karते ho. Aisा karne ka ekmatra legitimate kaaran ye hai jab value HTML hai jо aapne generate kiya ya pehle se sanitise kiya. Raw user input par safe lागू karna canonical stored-XSS bug hai. mark_safe aur format_html Python-side equivalents hain. format_html HTML ko dynamic parts ke saath banाने ka surakshit tareeka hai: aap ise placeholders waala ek format string aur arguments dete ho, aur ye har argument ko substitute karne se pehle escape karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django with a locmem template `t.html` containing `dict={{ d.k }} attr={{ o.name }} method={{ o.size }} missing=[{{ o.absent }}]`. Define a class with a `name` attribute and a `size()` method returning `10`. Render with context `{"d": {"k": "V"}, "o": <instance>}`. Assert the output is `dict=V attr=<name> method=10 missing=[]` — the method is called WITHOUT parens and the missing lookup yields empty.',
        taskHi: 'Standalone Django ek locmem template `t.html` ke saath. Ek class define karo `name` attribute aur ek `size()` method (`10` return) ke saath. Context ke saath render karo. Assert output — method BINA parens call hota hai aur missing lookup empty deता hai.',
        hint: '`TEMPLATES=[{... "OPTIONS": {"loaders": [("django.template.loaders.locmem.Loader", {"t.html": "..."})]}}]`. `render_to_string("t.html", ctx)`.',
        hintHi: '`TEMPLATES=[{... "loaders": [("django.template.loaders.locmem.Loader", {"t.html": "..."})]}]`. `render_to_string("t.html", ctx)`.',
      },
      {
        task: 'Template `t.html` = `escaped: {{ x }}\\nsafe: {{ y|safe }}`. Render with `{"x": "<img src=x onerror=alert(1)>", "y": "<em>ok</em>"}`. Assert the `x` line has `&lt;img` (escaped) and the `y` line has a literal `<em>ok</em>`. Write one comment sentence on why passing `x` through `|safe` would be a vulnerability.',
        taskHi: 'Template `t.html` = `escaped: {{ x }}\\nsafe: {{ y|safe }}`. Render karo. Assert `x` line mein `&lt;img` hai aur `y` line mein literal `<em>ok</em>`. Ek comment vakya: `x` ko `|safe` se pass karna ek vulnerability kyun hoगा.',
        hint: 'The `x` value is a hostile payload — an `onerror` handler that fires when the broken image fails to load. Auto-escaping turns the `<` into `&lt;` so the browser never parses it as a tag.',
        hintHi: '`x` value ek hostile payload hai — ek `onerror` handler. Auto-escaping `<` ko `&lt;` mein badalता hai to browser ise ek tag ki tarah parse nahi karता.',
      },
      {
        task: 'Standalone Django with `ROOT_URLCONF=__name__` and `urlpatterns = [path("items/<int:pk>/", view, name="item")]`. Template `t.html` = `{% for i in items %}{{ forloop.counter }}: {% url \'item\' pk=i %}{% if forloop.last %} (last){% endif %}\\n{% empty %}none\\n{% endfor %}`. Render with `{"items": [3, 8]}` and with `{"items": []}`. Assert the first gives two lines with `/items/3/` and `/items/8/ (last)`, and the second gives `none`.',
        taskHi: 'Standalone Django `ROOT_URLCONF=__name__` aur `urlpatterns = [path("items/<int:pk>/", view, name="item")]` ke saath. Template `t.html` `{% for %}`/`{% url %}`/`{% empty %}` ke saath. `{"items": [3, 8]}` aur `{"items": []}` ke saath render karo. Assert.',
        hint: '`{% url \'item\' pk=i %}` reverses the named route — the path lives only in `urls.py`. `{% empty %}` is the loop body used when the sequence is empty.',
        hintHi: '`{% url \'item\' pk=i %}` named route reverse karता hai. `{% empty %}` sequence khali hone par istemal hota hai.',
      },
    ],

    keyTakeaways: [
      'A Django template = text (usually HTML) with `{{ variable }}` outputs, `{% tag %}` logic (control flow / structure / helpers), and `{# comments #}`. It is deliberately NOT a programming language — no assignment, no arbitrary expressions. Business logic goes in Python (view / model method); templates do presentation.',
      '`{{ a.b }}` resolution ORDER: (1) dict `a[\'b\']`, (2) attr `a.b`, (3) method call `a.b()` — NO parens in the template, Django calls it, (4) index `a[b]` (`{{ items.0 }}`). Every step fails -> EMPTY STRING, not an error (silent by design -> typos render nothing; use `string_if_invalid` in dev).',
      'A method that needs ARGUMENTS cannot be called from a template -> expose it as a `@property` / zero-arg method, or compute it in the view and pass the result.',
      'Tags: `{% if/elif/else %}` (`==` `in` `not` `and` `or`), `{% for x in seq %}...{% empty %}...{% endfor %}` (`forloop.counter`/`.first`/`.last`/`.parentloop`), `{% url \'name\' args %}` (NEVER hard-code a path), `{% with x=expensive %}`, `{% csrf_token %}`, `{% verbatim %}`.',
      'Filters: `{{ v|filter:arg }}`, chain left-to-right. `default`/`date:"M j, Y"`/`floatformat:2`/`truncatewords`/`length`/`join`/`linebreaks`/`pluralize`. Anything complex -> a CUSTOM filter with a name + test (Lesson 3), not a chain of 6 built-ins.',
      'AUTO-ESCAPING is ON for every variable everywhere: `< > & \' "` -> entities. This neutralises XSS — `<script>` in a comment renders as text. `{{ v|safe }}` / `{% autoescape off %}` opt out — ONLY for HTML you produced or already sanitised (`bleach` on the way IN). `|safe` on user input = stored XSS.',
      'Python side: `mark_safe(s)` (this string is safe, don\'t escape — same danger as `|safe`), `format_html("<b>{}</b>", user_val)` (builds HTML with each `{}` escaped — the SAFE way).',
      'Render: `render(request, name, ctx)` -> `HttpResponse`; `render_to_string(name, ctx)` -> `str` (email bodies, partials); `TemplateResponse(...)` -> LAZY (middleware can still swap the template/context — CBVs use it). Templates live at `myapp/templates/myapp/name.html` (the inner folder namespaces).',
    ],
    keyTakeawaysHi: [
      'Ek Django template = text (aksar HTML) `{{ variable }}` outputs, `{% tag %}` logic, aur `{# comments #}` ke saath. Ye jaan-boojhkar ek programming language NAHI — koi assignment nahi. Business logic Python mein jaata hai; templates presentation karते hain.',
      '`{{ a.b }}` resolution ORDER: (1) dict `a[\'b\']`, (2) attr `a.b`, (3) method call `a.b()` — template mein KOI parens NAHI, (4) index `a[b]`. Har step fail -> EMPTY STRING, ek error NAHI (jaan-boojhkar; dev mein `string_if_invalid` istemal karो).',
      'Ek method jise ARGUMENTS chahिए template se call nahi ho sakta -> ise ek `@property` banाओ, ya view mein compute karके result pass karो.',
      'Tags: `{% if/elif/else %}`, `{% for x in seq %}...{% empty %}...{% endfor %}` (`forloop.counter`/`.first`/`.last`), `{% url \'name\' args %}` (KABHI path hard-code nahi), `{% with %}`, `{% csrf_token %}`.',
      'Filters: `{{ v|filter:arg }}`, left-to-right chain. `default`/`date`/`floatformat:2`/`truncatewords`/`length`/`join`/`pluralize`. Kuch bhi complex -> ek CUSTOM filter (Lesson 3).',
      'AUTO-ESCAPING har jagah har variable ke liye ON hai: `< > & \' "` -> entities. Ye XSS neutralise karता hai. `{{ v|safe }}` / `{% autoescape off %}` opt out — SIRF us HTML ke liye jо aapne banाya ya pehle se sanitise kiya. User input par `|safe` = stored XSS.',
      'Python side: `mark_safe(s)` (`|safe` jaisा khatra), `format_html("<b>{}</b>", user_val)` (har `{}` escape karके HTML banाता hai — SURAKSHIT tareeka).',
      'Render: `render(request, name, ctx)` -> `HttpResponse`; `render_to_string(name, ctx)` -> `str`; `TemplateResponse(...)` -> LAZY. Templates `myapp/templates/myapp/name.html` par rehते hain.',
    ],
  },

  {
    slug: 'dj-template-inheritance-and-partials',
    title: 'Template Inheritance & Partials: `extends`, `block`, `include`',
    titleHi: 'Template Inheritance & Partials: `extends`, `block`, `include`',
    description: 'Real sites have one page shell — header, nav, footer, `<head>` — and dozens of pages that fill it in differently. `{% extends %}` + `{% block %}` is how one base template defines the shell and every page overrides just the parts that differ. `{% include %}` pulls in reusable fragments.',
    descriptionHi: 'Asli sites mein ek page shell hoti hai — header, nav, footer, `<head>` — aur dozens of pages jо ise alag tarah bharती hain. `{% extends %}` + `{% block %}` wo hai jisse ek base template shell define karता hai aur har page sirf alag hisson ko override karता hai. `{% include %}` reusable fragments pull karता hai.',
    difficulty: 'EASY',
    duration: 18,
    order: 2,

    analogy: {
      en: '**A newspaper page template.** Every page of the paper has the same furniture: the masthead across the top, the page number and section name in the corner, the folio rules, the column grid. That fixed furniture is **`base.html`**. Within it, the layout marks out empty zones — "headline goes here", "body copy here", "sidebar here" — and those are **`{% block %}`s**. An actual article **`{% extends %}`** the page template and fills each zone with its own content, leaving the furniture untouched. Sometimes an article wants to *add* to a zone rather than replace it — keep the section name but append a "continued from page 1" — that is **`{{ block.super }}`**. And a recurring element that appears in many places but is not part of the page furniture — a "related stories" box, a byline block — is a **partial** you **`{% include %}`** wherever it is needed, passing it the data it should show.',
      hi: '**Ek newspaper page template.** Paper ke har page par wahi furniture hai: upar masthead, corner mein page number aur section name, column grid. Wo fixed furniture **`base.html`** hai. Iske andar, layout khali zones mark karता hai — "headline yahaan", "body copy yahaan", "sidebar yahaan" — aur wo **`{% block %}`s** hain. Ek asli article page template ko **`{% extends %}`** karता hai aur har zone ko apne content se bharता hai, furniture ko chhue bina. Kabhi ek article ek zone ko replace karne ke bजाy usme *add* karna chahता hai — section name rakhो par ek "continued from page 1" append karो — wo **`{{ block.super }}`** hai. Aur ek recurring element jо kई jagah dikhता hai par page furniture ka hissa nahi — ek "related stories" box — ek **partial** hai jise aap jahaan zaroorat wahaan **`{% include %}`** karते ho.',
    },

    simple: `**\`base.html\` — the shell, with holes**

\`\`\`django
{# templates/base.html #}
<!doctype html>
<html>
<head>
  <title>{% block title %}My Site{% endblock %}</title>
  {% block extra_head %}{% endblock %}
</head>
<body>
  <nav>{% include "partials/nav.html" %}</nav>
  <main>{% block content %}{% endblock %}</main>
  <footer>&copy; {% now "Y" %}</footer>
  {% block scripts %}{% endblock %}
</body>
</html>
\`\`\`

**A page — \`extends\` the shell, override the blocks**

\`\`\`django
{# templates/books/detail.html #}
{% extends "base.html" %}

{% block title %}{{ book.title }} — {{ block.super }}{% endblock %}   {# add to, don't replace #}

{% block content %}
  <h1>{{ book.title }}</h1>
  <p>{{ book.description|linebreaks }}</p>
  {% include "books/_price.html" with book=book %}
{% endblock %}

{% block scripts %}<script src="{% static 'books/detail.js' %}"></script>{% endblock %}
\`\`\`

\`\`\`
{% extends "x" %}   MUST be the first non-comment line of the child template
a child only overrides the blocks it names; unnamed blocks keep the parent's content
{{ block.super }}   inside an overridden block = the parent block's rendered content
blocks can nest, and a child can override an INNER block without touching the outer one
you can extend a template that itself extends another -- multi-level inheritance
\`\`\`

**\`{% include %}\` — a reusable fragment**

\`\`\`django
{% include "partials/card.html" %}                       {# gets the current context #}
{% include "partials/card.html" with item=book title="Book" %}   {# + these #}
{% include "partials/card.html" with item=book only %}   {# ONLY these -- isolated context #}
{% include tpl_name %}                                   {# the name can be a variable #}
\`\`\`

\`\`\`
include renders another template inline. Convention: name partials _card.html (leading underscore).
without \`only\`, the partial sees EVERYTHING in the caller's context (fine, but implicit).
with \`only\`, the partial is a black box that receives exactly what you pass -- easier to reason about.
\`\`\`

**When a template has too much logic**

\`\`\`
if you are writing {% if %} nested three deep, or regrouping/sorting data in the template,
or computing values across a {% for %} -- STOP. Do it in the view, a model @property, or a
custom template tag (Lesson 3). Templates are for layout, not computation.
\`\`\``,

    simpleHi: `**\`base.html\` — shell, holes ke saath**

\`\`\`django
{# templates/base.html #}
<!doctype html>
<html>
<head>
  <title>{% block title %}My Site{% endblock %}</title>
  {% block extra_head %}{% endblock %}
</head>
<body>
  <nav>{% include "partials/nav.html" %}</nav>
  <main>{% block content %}{% endblock %}</main>
  <footer>&copy; {% now "Y" %}</footer>
  {% block scripts %}{% endblock %}
</body>
</html>
\`\`\`

**Ek page — shell ko \`extends\` karो, blocks override karो**

\`\`\`django
{# templates/books/detail.html #}
{% extends "base.html" %}

{% block title %}{{ book.title }} — {{ block.super }}{% endblock %}   {# add karो, replace nahi #}

{% block content %}
  <h1>{{ book.title }}</h1>
  <p>{{ book.description|linebreaks }}</p>
  {% include "books/_price.html" with book=book %}
{% endblock %}
\`\`\`

\`\`\`
{% extends "x" %}   child template ki PEHLI non-comment line honi CHAHIYE
ek child sirf wo blocks override karता hai jinhe wo naam deता hai; unnamed blocks parent ka content rakhते hain
{{ block.super }}   ek overridden block ke andar = parent block ka rendered content
blocks nest kar sakte hain, aur ek child ek INNER block override kar sakta hai outer ko chhue bina
aap ek template ko extend kar sakte ho jо khud doosre ko extend karта hai -- multi-level inheritance
\`\`\`

**\`{% include %}\` — ek reusable fragment**

\`\`\`django
{% include "partials/card.html" %}                       {# current context milta hai #}
{% include "partials/card.html" with item=book title="Book" %}   {# + ye #}
{% include "partials/card.html" with item=book only %}   {# SIRF ye -- isolated context #}
{% include tpl_name %}                                   {# name ek variable ho sakta hai #}
\`\`\`

\`\`\`
include ek doosra template inline render karता hai. Convention: partials ko _card.html naam do.
\`only\` ke bina, partial caller ke context mein SAB KUCH dekhता hai (theek, par implicit).
\`only\` ke saath, partial ek black box hai jо theek wo receive karता hai jо aap pass karते ho.
\`\`\`

**Jab ek template mein bahut zyada logic hai**

\`\`\`
agar aap {% if %} teen deep nested likh rahe ho, ya template mein data regroup/sort kar rahe ho,
ya ek {% for %} ke paar values compute kar rahe ho -- RUKो. Ise view, ek model @property, ya ek
custom template tag mein karो (Lesson 3). Templates layout ke liye hain, computation ke liye nahi.
\`\`\``,

    content: `## The problem inheritance solves

Every page on a site shares a shell: the doctype, \`<head>\` with CSS links and meta tags, the header, the navigation, the footer, the closing script tags. Without inheritance you copy that shell into every template and, the day you add an analytics snippet or change the nav, you edit fifty files and miss three.

**Template inheritance** inverts it: one **base template** owns the shell and marks the parts that vary as **blocks**; each **child template** \`extends\` the base and provides content for the blocks it cares about.

## \`{% extends %}\` and \`{% block %}\`

\`\`\`django
{# base.html — the parent #}
<title>{% block title %}Acme{% endblock %}</title>
<main>{% block content %}{% endblock %}</main>
{% block scripts %}<script src="/static/app.js"></script>{% endblock %}
\`\`\`

\`\`\`django
{# home.html — a child #}
{% extends "base.html" %}
{% block content %}<h1>Welcome</h1>{% endblock %}
\`\`\`

Rules:

- **\`{% extends %}\` must be the first tag** in the child (comments before it are allowed, nothing else). A template can extend exactly one parent.
- A child **only overrides the blocks it defines**. \`home.html\` above did not define \`title\` or \`scripts\`, so those render the parent's default content (\`Acme\`, and the \`app.js\` tag).
- **Content outside a block in a child is discarded** — the child template's job is to *fill blocks*, not to add free-floating HTML. Anything you want to output must be inside a block that the base renders.
- **Blocks can be named anything and there can be many.** A well-designed base has blocks for \`title\`, \`meta\`/\`extra_head\`, \`content\`, \`sidebar\`, \`scripts\`, and often \`body_class\`.

## \`{{ block.super }}\`

Inside an overridden block, \`{{ block.super }}\` renders **the parent block's content**. Use it to *extend* rather than *replace*:

\`\`\`django
{% block title %}{{ product.name }} | {{ block.super }}{% endblock %}
{# -> "Widget 3000 | Acme" #}

{% block scripts %}
  {{ block.super }}                          {# keep the base's app.js #}
  <script src="/static/product.js"></script> {# and add this page's script #}
{% endblock %}
\`\`\`

## Multi-level inheritance

A child can itself be a base for grandchildren. A common three-tier structure:

- **\`base.html\`** — the site shell, blocks for everything.
- **\`base_dashboard.html\`** — \`{% extends "base.html" %}\`, fills \`content\` with a sidebar + a nested \`{% block dashboard_content %}\`, adds dashboard CSS to \`extra_head\`.
- **\`dashboard/orders.html\`** — \`{% extends "base_dashboard.html" %}\`, overrides only \`dashboard_content\`.

The orders page gets the site shell *and* the dashboard chrome for free and only writes the bit that is unique.

## \`{% include %}\`

\`{% include %}\` renders **another template inline** at that point. It is for *fragments that repeat* — a card, a form-field row, a pagination control, a comment — as opposed to inheritance which is for the *page skeleton*.

- **\`{% include "partials/_card.html" %}\`** — the partial is rendered with **the current context**: every variable available where the \`include\` appears is available inside the partial.
- **\`{% include "..." with title="Latest" count=n %}\`** — adds those names to the context for the partial.
- **\`{% include "..." with item=x only %}\`** — the \`only\` keyword **isolates** the partial: it sees *exactly* the names you pass and nothing else. This makes the partial a genuine reusable component with an explicit interface, at the cost of having to pass everything it needs.
- **\`{% include some_variable %}\`** — the template name can be a variable, so you can pick a partial by type (\`{% include "cards/"|add:item.kind|add:".html" %}\`).

**Convention:** name partials with a leading underscore (\`_card.html\`, \`_field.html\`) so they are visually distinct from full pages, and keep them in a \`partials/\` or component-specific folder.

## \`{% include %}\` vs a custom inclusion tag

\`{% include %}\` renders a template with data you assemble in the caller. An **inclusion tag** (Lesson 3) is a template *plus a Python function* that computes the context — use it when the fragment needs a query or non-trivial logic to prepare its data (\`{% recent_comments post %}\` that fetches and renders the last five comments). \`{% include %}\` is right when the caller already has the data.

## Keep logic out of templates

Templates are a presentation layer. Signs you have pushed too much into one:

- **\`{% if %}\` nested three or more levels deep** — move the decision to a model \`@property\` or the view.
- **Sorting, filtering, or regrouping data** in the template (\`{% regroup %}\` exists but is a smell for anything non-trivial) — do it in the queryset (\`order_by\`, \`annotate\`).
- **Arithmetic across a loop** (running totals, counts) — compute it in the view or with \`annotate\` / \`aggregate\`.
- **Duplicated blocks of markup with tiny differences** — that is an \`{% include %}\` or an inclusion tag.

The test: could a front-end developer who does not know Python safely edit this template? If it is full of business rules, the answer is no, and the rules belong in Python.`,

    contentHi: `## Inheritance jо problem solve karता hai

Site par har page ek shell share karता hai: doctype, CSS links aur meta tags waala \`<head>\`, header, navigation, footer. Inheritance ke bina aap us shell ko har template mein copy karते ho aur, jis din aap ek analytics snippet add karते ho, aap pachas files edit karते ho aur teen miss karते ho.

**Template inheritance** ise ulta karता hai: ek **base template** shell ka maalik hai aur badalne waale hisson ko **blocks** ke roop mein mark karता hai; har **child template** base ko \`extends\` karता hai.

## \`{% extends %}\` aur \`{% block %}\`

Rules:

- **\`{% extends %}\` child mein pehla tag hona chahिए** (pehle comments allowed hain). Ek template theek ek parent extend kar sakta hai.
- Ek child **sirf wo blocks override karता hai jо wo define karता hai**. Undefined blocks parent ka default content render karते hain.
- **Ek child mein ek block ke bahar ka content discard ho jaता hai** — child template ka kaam *blocks bharना* hai.
- **Blocks kuch bhi named ho sakte hain aur kई ho sakte hain.** Ek achha base \`title\`, \`extra_head\`, \`content\`, \`sidebar\`, \`scripts\` ke liye blocks rakhता hai.

## \`{{ block.super }}\`

Ek overridden block ke andar, \`{{ block.super }}\` **parent block ka content** render karता hai. Ise *replace* karne ke bजाy *extend* karne ke liye istemal karो.

## Multi-level inheritance

Ek child khud grandchildren ke liye ek base ho sakta hai. Ek aam three-tier structure: \`base.html\` (site shell) -> \`base_dashboard.html\` (\`{% extends "base.html" %}\`, sidebar + nested block) -> \`dashboard/orders.html\` (sirf inner block override karता hai).

## \`{% include %}\`

\`{% include %}\` us point par **ek doosra template inline** render karता hai. Ye *repeat hone waale fragments* ke liye hai — ek card, ek form-field row, ek pagination control.

- **\`{% include "partials/_card.html" %}\`** — partial **current context** ke saath render hota hai.
- **\`{% include "..." with title="Latest" %}\`** — un names ko partial ke context mein add karता hai.
- **\`{% include "..." with item=x only %}\`** — \`only\` keyword partial ko **isolate** karता hai: ye *theek* wo names dekhता hai jо aap pass karते ho. Isse partial ek explicit interface waala ek genuine reusable component ban jaता hai.
- **\`{% include some_variable %}\`** — template name ek variable ho sakta hai.

**Convention:** partials ko ek leading underscore ke saath naam do (\`_card.html\`).

## \`{% include %}\` vs ek custom inclusion tag

\`{% include %}\` ek template ko us data ke saath render karता hai jо aap caller mein assemble karते ho. Ek **inclusion tag** (Lesson 3) ek template *plus ek Python function* hai jо context compute karता hai — ise tab istemal karो jab fragment ko apna data taiyaar karne ko ek query chahिए.

## Templates se logic bahar rakhो

- **\`{% if %}\` teen ya zyada levels deep nested** — decision ko ek model \`@property\` ya view mein move karो.
- **Template mein data sort, filter, ya regroup karना** — ise queryset mein karो.
- **Ek loop ke paar arithmetic** — ise view mein ya \`annotate\` / \`aggregate\` se compute karो.
- **Chhote differences ke saath markup ke duplicated blocks** — wo ek \`{% include %}\` hai.

Test: kya ek front-end developer jо Python nahi jaanता is template ko surakshit roop se edit kar sakta hai? Agar ye business rules se bhara hai, jawab nahi hai.`,

    examples: [
      {
        title: 'extends + block + block.super: a child fills and extends the base',
        titleHi: 'extends + block + block.super: ek child base ko bharता aur extend karता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=[],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [], "APP_DIRS": False,
        "OPTIONS": {"loaders": [("django.template.loaders.locmem.Loader", {
            "base.html": "<title>{% block title %}Acme{% endblock %}</title>\\n"
                         "<main>{% block content %}(default){% endblock %}</main>\\n"
                         "<foot>{% block scripts %}app.js{% endblock %}</foot>",
            "page.html": "{% extends 'base.html' %}\\n"
                         "{% block title %}{{ name }} | {{ block.super }}{% endblock %}\\n"
                         "{% block content %}<h1>{{ name }}</h1>{% endblock %}\\n"
                         "{% block scripts %}{{ block.super }} page.js{% endblock %}",
        })]}}])
django.setup()

from django.template.loader import render_to_string
print(render_to_string("page.html", {"name": "Widget 3000"}))`,
        output: `<title>Widget 3000 | Acme</title>
<main><h1>Widget 3000</h1></main>
<foot>app.js page.js</foot>`,
        explain: "The child overrides `title`, `content`, and `scripts`; each `{{ block.super }}` pulls in the parent block's rendered text at that point, so the title becomes `Widget 3000 | Acme` and scripts becomes `app.js page.js` rather than replacing the base entirely. A block the child does not mention -- there are none here -- would render the parent's default.",
        explainHi: 'Child `title`, `content`, aur `scripts` override karता hai; har `{{ block.super }}` us point par parent block ka rendered text kheench leता hai, to title `Widget 3000 | Acme` ban jaता hai aur scripts `app.js page.js` -- base ko poori tarah replace karne ke bजाy. Ek block jise child mention nahi karता parent ka default render karega.',
      },
      {
        title: 'include with vs include ... only: implicit context vs an isolated component',
        titleHi: 'include with vs include ... only: implicit context vs ek isolated component',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=[],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [], "APP_DIRS": False,
        "OPTIONS": {"loaders": [("django.template.loaders.locmem.Loader", {
            "_badge.html": "[{{ label }}: {{ value }} | secret={{ secret }}]",
            "host.html": "A: {% include '_badge.html' %}\\n"
                         "B: {% include '_badge.html' with label='B' value=99 %}\\n"
                         "C: {% include '_badge.html' with label='C' value=1 only %}",
        })]}}])
django.setup()

from django.template.loader import render_to_string
print(render_to_string("host.html", {
    "label": "A", "value": 42, "secret": "leaked-into-A-and-B",
}))`,
        output: `A: [A: 42 | secret=leaked-into-A-and-B]
B: [B: 99 | secret=leaked-into-A-and-B]
C: [C: 1 | secret=]`,
        explain: "Rows A and B render with the caller's full context, so `{{ secret }}` leaks into both even though nobody passed it -- that is the implicit-context default of `{% include %}`. Row C adds `only`, which isolates the partial to exactly the names in the `with` clause, so `secret` is not visible and resolves to empty. `only` turns a partial into a real component with an explicit interface.",
        explainHi: 'Rows A aur B caller ke poore context ke saath render hote hain, to `{{ secret }}` dono mein leak hota hai halाnki kisi ne ise pass nahi kiya -- wo `{% include %}` ka implicit-context default hai. Row C `only` add karता hai, jо partial ko theek `with` clause ke names tak isolate karता hai, to `secret` visible nahi hai aur empty mein resolve hota hai. `only` ek partial ko ek explicit interface waala ek real component banाता hai.',
      },
      {
        title: 'Content outside a block in a child template is silently dropped',
        titleHi: 'Ek child template mein ek block ke bahar ka content chupchaap drop hota hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x" * 50, USE_TZ=True, INSTALLED_APPS=[],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [], "APP_DIRS": False,
        "OPTIONS": {"loaders": [("django.template.loaders.locmem.Loader", {
            "base.html": "<body>{% block content %}{% endblock %}</body>",
            "child.html": "{% extends 'base.html' %}\\n"
                          "<p>THIS LINE IS OUTSIDE A BLOCK -- it will NOT render</p>\\n"
                          "{% block content %}<p>this is inside the block</p>{% endblock %}\\n"
                          "<p>SO IS THIS ONE</p>",
        })]}}])
django.setup()

from django.template.loader import render_to_string
print(render_to_string("child.html", {}))`,
        output: `<body><p>this is inside the block</p></body>`,
        explain: "The engine renders only the base template with the child's block content substituted in. Both `<p>OUTSIDE</p>` lines sit between blocks in the child, where there is no output slot, so they are parsed and discarded -- only what is inside `{% block content %}` survives. This is the usual cause of a 'my markup vanished' bug in a template that uses `{% extends %}`.",
        explainHi: "Engine sirf base template ko child ke block content ke saath substitute karके render karता hai. Dono `<p>OUTSIDE</p>` lines child mein blocks ke beech baithती hain, jahaan koi output slot nahi hai, to wo parse hokar discard ho jaती hain -- sirf jо `{% block content %}` ke andar hai wo bachता hai. Ye `{% extends %}` istemal karne waale ek template mein 'mera markup gायab ho gaya' bug ka aam kaaran hai.",
      },
    ],

    mistakes: [
      {
        wrong: `{# child template #}
{% extends "base.html" %}
{% block content %}
  <h1>{{ title }}</h1>
{% endblock %}
{% include "partials/_footer_note.html" %}   {# outside any block -- silently dropped #}`,
        right: `{% extends "base.html" %}
{% block content %}
  <h1>{{ title }}</h1>
{% endblock %}
{% block scripts %}
  {{ block.super }}
  {% include "partials/_footer_note.html" %}   {# now it is inside a block the base renders #}
{% endblock %}`,
        why: 'When a template uses {% extends %}, the only thing the engine renders is the base template with the child\'s block overrides substituted in. Anything in the child that is not inside a {% block %} the base defines — an {% include %}, a stray paragraph, a script tag — is parsed but never output, because there is nowhere for it to go. This produces a confusing "my include isn\'t showing up" bug. The fix is to put that content inside a block the base actually renders (often scripts or extra_head), using {{ block.super }} if you also want the base\'s default content for that block.',
        whyHi: 'Jab ek template \`{% extends %}\` istemal karता hai, engine sirf base template ko child ke block overrides substitute karके render karता hai. Child mein kuch bhi jо base ke define kiye ek \`{% block %}\` ke andar nahi hai — ek \`{% include %}\`, ek stray paragraph — parse hota hai par kabhi output nahi hota. Fix us content ko ek block ke andar rakhna hai jise base asal mein render karता hai.',
      },
      {
        wrong: `{# _order_row.html, included in a loop over 200 orders #}
{% include "_order_row.html" with order=order %}
{# and inside _order_row.html: #}
<td>{{ order.customer.name }}</td>   {# order.customer is a lazy FK -- one query PER ROW #}`,
        right: `# in the view: fetch the FK up front
orders = Order.objects.select_related("customer").all()
# the partial's {{ order.customer.name }} is now free -- the customer came with the row
# (this is the Module 3 N+1 lesson, and templates are where it usually bites)`,
        why: 'An {% include %} in a {% for %} loop runs the partial once per row, and any {{ obj.related_field }} inside it dereferences a relation. If the queryset did not select_related / prefetch_related that relation, each dereference is a fresh database query — the classic N+1, and templates are the single most common place it appears because the query is hidden behind a dotted lookup in a loop. The fix is always in the view or the queryset: select_related for to-one, prefetch_related for to-many, so the data is already loaded by the time the template asks for it. Django Debug Toolbar makes these visible.',
        whyHi: 'Ek \`{% for %}\` loop mein ek \`{% include %}\` partial ko prati row ek baar chalाता hai, aur iske andar koi bhi \`{{ obj.related_field }}\` ek relation dereference karता hai. Agar queryset ne us relation ko \`select_related\` / \`prefetch_related\` nahi kiya, har dereference ek fresh database query hai — classic N+1, aur templates wo sabse aam jagah hai jahaan ye dikhता hai. Fix hamesha view ya queryset mein hai.',
      },
      {
        wrong: `{# a page template with real logic in it #}
{% for order in orders %}
  {% if order.status == 'paid' and order.total > 100 and not order.refunded %}
    {% with commission=order.total|floatformat:0 %}
      {# ... 15 more lines computing a payout ... #}
{# nobody without Python knowledge can safely touch this #}`,
        right: `# view / model: the business rule lives in Python, tested
class Order(models.Model):
    @property
    def is_commissionable(self):
        return self.status == "paid" and self.total > 100 and not self.refunded
    @property
    def commission(self):
        return round(self.total * COMMISSION_RATE)

{# template: just presentation #}
{% for order in orders %}
  {% if order.is_commissionable %}<td>{{ order.commission }}</td>{% endif %}`,
        why: 'A template full of business conditions and computed values is unmaintainable and untestable: the template language has no unit tests, no debugger, and no type checking, and the logic is now invisible to anyone reviewing the Python code. Every non-trivial condition ("is this order commissionable") and every derived value ("what is the commission") belongs in a model @property or the view, where it has a name, a test, and a single definition. The template should read like a description of the layout, not the rulebook.',
        whyHi: 'Business conditions aur computed values se bhara ek template unmaintainable aur untestable hai: template language ke koi unit tests, koi debugger, koi type checking nahi. Har non-trivial condition aur har derived value ek model \`@property\` ya view mein rehni chahिए, jahaan iska ek naam, ek test, aur ek single definition hai. Template layout ka ek description padhना chahिए, rulebook nahi.',
      },
    ],

    realWorld: [
      {
        en: '**A three-level base: `base.html` -> `base_app.html` (logged-in chrome: sidebar, user menu) -> `base_settings.html` (settings sub-nav)** — a settings page extends `base_settings.html` and writes ~20 lines; it inherits the whole shell, the app chrome, and the settings navigation for free.',
        hi: '**Ek three-level base: `base.html` -> `base_app.html` -> `base_settings.html`** — ek settings page `base_settings.html` extend karता hai aur ~20 lines likhता hai; ise poora shell, app chrome, aur settings navigation muft milta hai.',
      },
      {
        en: '**A `partials/` folder of `only`-isolated components** — `_pagination.html`, `_field.html`, `_card.html`, `_avatar.html` — each `{% include %}`d with an explicit `with ... only`, so they are true components with a documented interface and no hidden dependency on the caller\'s context.',
        hi: '**`only`-isolated components ka ek `partials/` folder** — `_pagination.html`, `_field.html`, `_card.html` — har ek ek explicit `with ... only` ke saath `{% include %}`d.',
      },
      {
        en: '**`{% include "cards/"|add:item.type|add:".html" %}`** in a feed template — the partial is chosen by the item type (a `card`, a `photo`, a `poll`), each in its own file, so adding a new feed item type is one new template and zero changes to the feed loop.',
        hi: '**Ek feed template mein `{% include "cards/"|add:item.type|add:".html" %}`** — partial item type se chuna jaता hai, har ek apni file mein, to ek naya feed item type ek naya template hai aur feed loop mein zero changes.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain template inheritance: `extends`, `block`, `block.super`, and what happens to content outside a block in a child.',
        qHi: 'Template inheritance samjhाओ: `extends`, `block`, `block.super`, aur ek child mein ek block ke bahar ke content ka kya hota hai.',
        a: 'Template inheritance lets one base template define the page shell — the doctype, head, header, footer, script tags — and mark the parts that vary between pages as named blocks. A child template starts with extends of the base and then provides content for the blocks it cares about. The engine renders the base, substituting each block\'s content with the child\'s version where the child overrides it, and keeping the base\'s default where it does not. So a child that only overrides content still gets the base\'s title and footer. extends must be the first tag in the child, and a template extends exactly one parent, though that parent can itself extend another, giving you multi-level inheritance — a common pattern is a site base, an app base that adds logged-in chrome, and a section base that adds a sub-navigation. block.super, used inside an overridden block, renders the parent block\'s content at that point, so you can extend a block rather than replace it — keep the base\'s scripts and add this page\'s, or prepend the page title to the site name. The subtle rule people miss: in a child template, anything that is not inside a block the base defines is parsed but never rendered. A stray paragraph, an include, or a script tag placed between blocks in the child simply disappears, because the child\'s only job is to fill the base\'s blocks — there is no output slot for free-floating content. The fix is to move that content into a block, usually a scripts or extra_head block the base renders near the end.',
        aHi: 'Template inheritance ek base template ko page shell define karne deता hai aur pages ke beech badalne waale hisson ko named blocks ke roop mein mark karता hai. Ek child template base ke extends se shuru hota hai aur phir un blocks ke liye content deता hai jinki wo parwah karता hai. Engine base render karता hai, har block ke content ko child ke version se substitute karके jahaan child override karता hai, aur base ka default rakhके jahaan wo nahi karता. To ek child jо sirf content override karता hai use abhi bhi base ka title aur footer milta hai. extends child mein pehla tag hona chahिए, aur ek template theek ek parent extend karता hai, halाnki wo parent khud doosra extend kar sakta hai. block.super, ek overridden block ke andar istemal, parent block ka content us point par render karता hai. Wo subtle rule jо log miss karते hain: ek child template mein, kuch bhi jо base ke define kiye ek block ke andar nahi hai, parse hota hai par kabhi render nahi hota. Fix us content ko ek block mein move karna hai.',
      },
      {
        q: 'When do you use `{% include %}` vs template inheritance vs a custom inclusion tag, and what does `only` do?',
        qHi: 'Aap `{% include %}` vs template inheritance vs ek custom inclusion tag kab istemal karते ho, aur `only` kya karता hai?',
        a: 'Inheritance is for the page skeleton — the one shell every page shares, with variable regions. include is for a fragment that repeats within or across pages — a card, a form-field row, a pagination control, a comment. You reach for inheritance when the relationship is "this page is a kind of that layout", and for include when it is "render this reusable piece here". By default, an included partial is rendered with the caller\'s full context: every variable in scope where the include appears is visible inside the partial. That is convenient but implicit — the partial has a hidden dependency on whatever the caller happened to have. Adding only to the include, as in include of a template with item equals x only, isolates the partial: it sees exactly the names you pass in the with clause and nothing else. That turns the partial into a real component with an explicit interface, which is easier to reason about and safer, at the cost of having to pass everything it needs. A custom inclusion tag is the next step up: it is a template plus a Python function that builds the context. You use it when the fragment needs a query or non-trivial computation to prepare its own data — a recent-comments box that fetches the last five comments for a post. include is right when the caller already has the data ready; an inclusion tag is right when the fragment should fetch its own.',
        aHi: 'Inheritance page skeleton ke liye hai — wo ek shell jо har page share karता hai. include ek fragment ke liye hai jо pages ke andar ya paar repeat hota hai. Aap inheritance ke liye tab pahunchते ho jab relationship "ye page us layout ka ek prakaar hai" hai, aur include ke liye jab ye "is reusable piece ko yahaan render karो" hai. Default se, ek included partial caller ke poore context ke saath render hota hai. Wo suvidhajanak par implicit hai. include mein only add karna partial ko isolate karता hai: ye theek wo names dekhता hai jо aap with clause mein pass karते ho. Wo partial ko ek explicit interface waala ek real component banाता hai. Ek custom inclusion tag agla step hai: ye ek template plus ek Python function hai jо context banाता hai. Aap ise tab istemal karते ho jab fragment ko apna data taiyaar karne ko ek query chahिए.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django. locmem templates: `base.html` = `<t>{% block title %}Base{% endblock %}</t><b>{% block body %}(none){% endblock %}</b>` and `child.html` = `{% extends \'base.html\' %}{% block title %}{{ h }} :: {{ block.super }}{% endblock %}{% block body %}<p>{{ h }}</p>{% endblock %}`. Render `child.html` with `{"h": "Home"}`. Assert the title is `Home :: Base` (block.super pulled in the parent\'s "Base") and the body is `<p>Home</p>`.',
        taskHi: 'Standalone Django. locmem templates `base.html` aur `child.html` (`{% extends %}` + `{% block title %}` `{{ block.super }}` ke saath). `child.html` ko `{"h": "Home"}` ke saath render karo. Assert title `Home :: Base` hai.',
        hint: '`{{ block.super }}` renders the parent block\'s content — so `{% block title %}X :: {{ block.super }}{% endblock %}` produces `X :: <parent title content>`.',
        hintHi: '`{{ block.super }}` parent block ka content render karता hai — to `{% block title %}X :: {{ block.super }}{% endblock %}` `X :: <parent title>` produce karता hai.',
      },
      {
        task: 'locmem templates: `_row.html` = `[{{ k }}={{ v }} extra={{ extra }}]` and `host.html` = `1:{% include \'_row.html\' %} 2:{% include \'_row.html\' with k=\'B\' v=2 %} 3:{% include \'_row.html\' with k=\'C\' v=3 only %}`. Render `host.html` with `{"k": "A", "v": 1, "extra": "SHARED"}`. Assert row 1 and row 2 both show `extra=SHARED` (implicit context) but row 3 shows `extra=` (empty — `only` isolated it).',
        taskHi: 'locmem templates `_row.html` aur `host.html` (`{% include %}` teen tareeke: plain, `with`, `with ... only`). `{"k": "A", "v": 1, "extra": "SHARED"}` ke saath render karo. Assert row 1/2 `extra=SHARED` par row 3 `extra=` (empty).',
        hint: 'Without `only`, an included partial sees the entire caller context. With `only`, it sees exactly the `with` names — `extra` is not passed, so it resolves to empty.',
        hintHi: '`only` ke bina, ek included partial poora caller context dekhता hai. `only` ke saath, ye theek `with` names dekhता hai.',
      },
      {
        task: 'locmem templates: `base.html` = `<body>{% block content %}{% endblock %}</body>` and `child.html` = `{% extends \'base.html\' %}\\n<p>OUTSIDE</p>\\n{% block content %}<p>INSIDE</p>{% endblock %}\\n<p>ALSO OUTSIDE</p>`. Render `child.html`. Assert the output is exactly `<body><p>INSIDE</p></body>` — both `OUTSIDE` paragraphs are silently discarded because they are not inside a block the base renders.',
        taskHi: 'locmem templates `base.html` aur `child.html` jismें `{% block %}` ke bahar `<p>OUTSIDE</p>` lines hain. `child.html` render karo. Assert output theek `<body><p>INSIDE</p></body>` hai — dono `OUTSIDE` paragraphs chupchaap discard.',
        hint: 'When a template `{% extends %}`, the engine only renders the base with block overrides. Free-floating content in the child has no output slot and vanishes — a common "why is my markup missing" bug.',
        hintHi: 'Jab ek template `{% extends %}` karता hai, engine sirf base ko block overrides ke saath render karता hai. Child mein free-floating content gायab ho jaता hai.',
      },
    ],

    keyTakeaways: [
      'INHERITANCE = the page SKELETON. `base.html` owns the shell (`<head>`, header, footer) and marks varying regions as `{% block name %}...{% endblock %}`. A child `{% extends "base.html" %}` and overrides only the blocks it names; unnamed blocks keep the parent\'s default content.',
      '`{% extends %}` MUST be the child\'s first tag (comments allowed before). One parent per template — but the parent can extend another (multi-level: `base` -> `base_app` -> `base_section`).',
      'CONTENT OUTSIDE A `{% block %}` IN A CHILD IS SILENTLY DROPPED — a stray `{% include %}` / `<script>` / `<p>` between blocks in a child never renders (no output slot). Put it inside a block the base renders (often `scripts`/`extra_head`).',
      '`{{ block.super }}` inside an overridden block = the PARENT block\'s rendered content. Use it to EXTEND not replace: `{% block title %}{{ page }} | {{ block.super }}{% endblock %}`, or `{{ block.super }}` + this page\'s `<script>`.',
      'INCLUDE = a repeating FRAGMENT (card, field row, pagination, comment). `{% include "_x.html" %}` = current context; `{% include "_x.html" with a=1 b=2 %}` = + those; `{% include "_x.html" with a=1 only %}` = ONLY those (isolated -> a real component with an explicit interface). The name can be a variable.',
      'Convention: name partials `_card.html` (leading underscore). `{% include %}` when the CALLER has the data; a custom INCLUSION TAG (Lesson 3) when the fragment must FETCH its own data (a query).',
      'THE N+1 LIVES IN TEMPLATES: an `{% include %}` (or any `{{ obj.related.field }}`) in a `{% for %}` loop dereferences a relation per row — one query each unless the view `select_related`/`prefetch_related`d it. Fix in the view/queryset, not the template.',
      'KEEP LOGIC OUT: `{% if %}` nested 3-deep, sorting/regrouping data, arithmetic across a loop, duplicated markup with tiny diffs -> move to a model `@property`, the view, `annotate`/`order_by`, or an `{% include %}`. Test: could a non-Python front-end dev safely edit this template?',
    ],
    keyTakeawaysHi: [
      'INHERITANCE = page SKELETON. `base.html` shell ka maalik hai aur badalne waale regions ko `{% block name %}...{% endblock %}` ke roop mein mark karता hai. Ek child `{% extends "base.html" %}` karता hai aur sirf named blocks override karता hai; undefined blocks parent ka default rakhते hain.',
      '`{% extends %}` child ka PEHLA tag hona CHAHIYE. Prati template ek parent — par parent doosra extend kar sakta hai (multi-level).',
      'EK CHILD MEIN EK `{% block %}` KE BAHAR KA CONTENT CHUPCHAAP DROP HOTA HAI — blocks ke beech ek stray `{% include %}` / `<script>` kabhi render nahi hota. Ise ek block ke andar rakhо jise base render karता hai.',
      '`{{ block.super }}` ek overridden block ke andar = PARENT block ka rendered content. Ise EXTEND karne ke liye istemal karो replace nahi.',
      'INCLUDE = ek repeating FRAGMENT. `{% include "_x.html" %}` = current context; `{% include "_x.html" with a=1 %}` = + wo; `{% include "_x.html" with a=1 only %}` = SIRF wo (isolated). Name ek variable ho sakta hai.',
      'Convention: partials ko `_card.html` naam do. `{% include %}` jab CALLER ke paas data hai; ek custom INCLUSION TAG (Lesson 3) jab fragment ko apna data FETCH karना hai.',
      'N+1 TEMPLATES MEIN REHTA HAI: ek `{% for %}` loop mein ek `{% include %}` (ya koi `{{ obj.related.field }}`) prati row ek relation dereference karता hai. View/queryset mein fix karो.',
      'LOGIC BAHAR RAKHO: `{% if %}` 3-deep nested, data sort/regroup, ek loop ke paar arithmetic -> ek model `@property`, view, `annotate`/`order_by`, ya ek `{% include %}` mein move karो.',
    ],
  },
];
