/**
 * Django Complete Course — Module 4: Views, URLs & Forms, lessons 4-6.
 *
 * Lesson 4: Forms & ModelForms — Form vs ModelForm, is_valid()/cleaned_data/
 *           errors, clean_<field> vs clean(), save(commit=False), widgets.
 * Lesson 5: Pagination & the messages framework — Paginator/Page, offset cost,
 *           messages.success/error, one-shot storage, get_messages.
 * Lesson 6: CSRF & view security — the attack, the token, CsrfViewMiddleware,
 *           csrf_exempt/csrf_protect/ensure_csrf_cookie, CSRF_TRUSTED_ORIGINS,
 *           SameSite cookies, clickjacking / X-Frame-Options.
 *
 * Conventions: see course-django-module4.ts header.
 */

import type { CourseLesson } from './course-js-module1';

export const DJANGO_MODULE_4_PART2: CourseLesson[] = [
  {
    slug: 'dj-forms-and-modelforms',
    title: 'Forms & ModelForms: validation you can trust',
    titleHi: 'Forms & ModelForms: validation jispar aap bharosा kar sakte ho',
    description: 'A Django `Form` turns raw request data into validated, typed Python — or a structured bag of errors. A `ModelForm` builds that form from a model. The whole point is that `form.is_valid()` is the one gate every write goes through, so validation is never scattered across the view.',
    descriptionHi: 'Ek Django `Form` raw request data ko validated, typed Python mein badalता hai — ya errors ka ek structured bag. Ek `ModelForm` us form ko ek model se banाता hai. Poora point ye hai ki `form.is_valid()` wo ek gate hai jissе har write guzarता hai, toh validation kabhi view mein bikhrी nahi hoती.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A customs desk between the outside world and your database.** Raw POST data is a suitcase someone slid across the counter — strings, maybe missing items, maybe contraband. The form is the customs officer. `is_valid()` is the inspection: every field is checked for presence, type, and range (`EmailField` must look like an email, `IntegerField` must parse, `required` fields must be there), then your `clean_<field>` methods run for per-item rules ("this coupon code must exist"), then `clean()` runs for cross-item rules ("end date must be after start date"). If anything fails, nothing passes — you get `form.errors`, a per-field dossier you show the traveller so they can fix it. If everything passes, you get `form.cleaned_data`: a dict of real Python types you can trust. A `ModelForm` is the same desk pre-configured from your model\'s own declared rules, and it can pack the approved goods straight into a model instance (`form.save()`). The rule that matters: nothing reaches the database except through the desk.',
      hi: '**Bahari duniya aur aapke database ke beech ek customs desk.** Raw POST data ek suitcase hai jise kisi ne counter ke paar slide kiya — strings, shायद missing items, shायद contraband. Form customs officer hai. `is_valid()` inspection hai: har field presence, type, aur range ke liye check hoता hai (`EmailField` ek email jaisा dikhना chahिए, `IntegerField` parse hona chahिए), phir aapki `clean_<field>` methods per-item rules ke liye chalती hain, phir `clean()` cross-item rules ke liye chalता hai. Agar kuch fail hoता hai, kuch pass nahi hoता — aapko `form.errors` milता hai. Agar sab pass hoता hai, aapko `form.cleaned_data` milता hai: asli Python types ka ek dict. Ek `ModelForm` wahi desk hai aapke model ke apne declared rules se pre-configured, aur ye approved goods ko seedhे ek model instance mein pack kar sakta hai (`form.save()`). Mahatvapoorn niyam: desk ke alावा kuch database tak nahi pahुँchता.',
    },

    simple: `**A plain Form**

\`\`\`python
from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    topic = forms.ChoiceField(choices=[("sales", "Sales"), ("support", "Support")])
    message = forms.CharField(widget=forms.Textarea, min_length=10)
    consent = forms.BooleanField(required=True)

# in a view:
def contact(request):
    if request.method == "POST":
        form = ContactForm(request.POST)          # bind the data
        if form.is_valid():                       # run all validation
            data = form.cleaned_data              # {"name": "...", "email": "...", ...} -- typed
            send_email(**data)
            return redirect("thanks")
    else:
        form = ContactForm()                      # unbound (blank)
    return render(request, "contact.html", {"form": form})
\`\`\`

**Validation layers (run in this order)**

\`\`\`python
class SignupForm(forms.Form):
    username = forms.CharField(max_length=30)
    password = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(widget=forms.PasswordInput)

    def clean_username(self):                     # 1: per-field, after the field's own validation
        name = self.cleaned_data["username"]
        if User.objects.filter(username__iexact=name).exists():
            raise forms.ValidationError("That username is taken.")
        return name                               # MUST return the value

    def clean(self):                              # 2: cross-field
        cleaned = super().clean()
        if cleaned.get("password") != cleaned.get("password2"):
            self.add_error("password2", "Passwords do not match.")
        return cleaned
\`\`\`

**A ModelForm**

\`\`\`python
from django.forms import ModelForm

class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ["title", "body", "status"]       # NEVER "__all__" on a model with sensitive fields
        widgets = {"body": forms.Textarea(attrs={"rows": 8})}
        labels = {"body": "Post content"}

form = PostForm(request.POST)
if form.is_valid():
    post = form.save(commit=False)                 # build but do not hit the DB yet
    post.author = request.user                     # set server-controlled fields
    post.save()
    form.save_m2m()                                # if the form has ManyToMany fields and commit=False
\`\`\`

**Errors**

\`\`\`python
form.errors                 # {"email": ["Enter a valid email address."], "__all__": [...]}
form.errors.as_json()       # machine-readable
form.non_field_errors()     # the "__all__" list (from clean())
form["email"].errors        # just that field's list -- used in the template
form.is_bound               # True if data was passed; is_valid() is False on an unbound form
\`\`\`

\`\`\`
Form(data=None, files=None, initial=None, prefix=None)
  unbound: Form()  -> for rendering a blank form
  bound:   Form(request.POST, request.FILES)  -> is_valid() populates cleaned_data OR errors
is_valid()  -> runs Field.clean (type/required/validators) -> clean_<field>() -> clean()
clean_<field>()  reads self.cleaned_data["<field>"], returns the (possibly changed) value, or raises ValidationError
clean()  cross-field; use self.add_error("field", msg) or return {...}; errors go to non_field_errors / __all__
ModelForm.save(commit=True)  -> commit=False builds the instance; then set fields, .save(), .save_m2m()
Field kwargs: required, label, help_text, initial, widget, validators, error_messages
\`\`\``,

    simpleHi: `**Ek plain Form**

\`\`\`python
from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    topic = forms.ChoiceField(choices=[("sales", "Sales"), ("support", "Support")])
    message = forms.CharField(widget=forms.Textarea, min_length=10)
    consent = forms.BooleanField(required=True)

# ek view mein:
def contact(request):
    if request.method == "POST":
        form = ContactForm(request.POST)          # data bind karो
        if form.is_valid():                       # saari validation chalाओ
            data = form.cleaned_data              # {"name": "...", ...} -- typed
            send_email(**data)
            return redirect("thanks")
    else:
        form = ContactForm()                      # unbound (blank)
    return render(request, "contact.html", {"form": form})
\`\`\`

**Validation layers (is order mein chalते hain)**

\`\`\`python
class SignupForm(forms.Form):
    username = forms.CharField(max_length=30)
    password = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(widget=forms.PasswordInput)

    def clean_username(self):                     # 1: per-field
        name = self.cleaned_data["username"]
        if User.objects.filter(username__iexact=name).exists():
            raise forms.ValidationError("That username is taken.")
        return name                               # value return karna ZAROORI hai

    def clean(self):                              # 2: cross-field
        cleaned = super().clean()
        if cleaned.get("password") != cleaned.get("password2"):
            self.add_error("password2", "Passwords do not match.")
        return cleaned
\`\`\`

**Ek ModelForm**

\`\`\`python
from django.forms import ModelForm

class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ["title", "body", "status"]       # sensitive fields waale model par KABHI "__all__" nahi
        widgets = {"body": forms.Textarea(attrs={"rows": 8})}

form = PostForm(request.POST)
if form.is_valid():
    post = form.save(commit=False)                 # banाओ par abhi DB hit mat karो
    post.author = request.user                     # server-controlled fields set karो
    post.save()
    form.save_m2m()
\`\`\`

**Errors**

\`\`\`python
form.errors                 # {"email": ["Enter a valid email address."], "__all__": [...]}
form.non_field_errors()     # "__all__" list (clean() se)
form["email"].errors        # sirf us field ki list -- template mein
form.is_bound               # True agar data pass hua
\`\`\`

\`\`\`
Form(data=None, files=None, initial=None, prefix=None)
  unbound: Form()  -> ek blank form render karne ko
  bound:   Form(request.POST, request.FILES)  -> is_valid() cleaned_data YA errors populate karta hai
is_valid()  -> Field.clean (type/required/validators) -> clean_<field>() -> clean()
clean_<field>()  self.cleaned_data["<field>"] padhta hai, value return karta hai, ya ValidationError raise
clean()  cross-field; self.add_error("field", msg) ya return {...}
ModelForm.save(commit=True)  -> commit=False instance banata hai; phir fields set, .save(), .save_m2m()
\`\`\``,

    content: `## Bound vs unbound

A form is **unbound** when created with no data (\`ContactForm()\`) — used to render a blank form. It is **bound** when created with data (\`ContactForm(request.POST, request.FILES)\`) — \`is_valid()\` then processes it. \`is_valid()\` on an unbound form is always \`False\`.

\`is_valid()\` does three things in order and populates either \`cleaned_data\` (all valid) or \`errors\` (anything invalid):

1. **Field-level**: each \`Field.clean(value)\` — coerces the type (\`"42"\` -> \`42\`), checks \`required\`, runs the field's built-in validators (\`EmailValidator\`, \`MaxLengthValidator\`) and any in \`validators=[...]\`.
2. **\`clean_<fieldname>()\`** — your per-field method, called only if the field passed step 1. Read \`self.cleaned_data["<field>"]\`, do your check, **return the value** (returning \`None\` silently blanks the field). Raise \`forms.ValidationError("msg")\` to reject.
3. **\`clean()\`** — cross-field rules. \`cleaned = super().clean()\`, compare fields, and either \`self.add_error("field", "msg")\` (attaches to a field) or raise \`ValidationError\` (goes to \`__all__\` / \`non_field_errors\`).

## \`cleaned_data\` and \`errors\`

- **\`form.cleaned_data\`** — a dict of validated, type-coerced values. Only present after \`is_valid()\` returns \`True\` (or partially, inside \`clean()\`). A field that failed is absent from \`cleaned_data\`.
- **\`form.errors\`** — an \`ErrorDict\`: \`{field_name: ["msg", ...], "__all__": [...]}\`. \`form.errors.as_json()\` for APIs, \`form["field"].errors\` in templates, \`form.non_field_errors()\` for the \`__all__\` bucket.

## Widgets, labels, help text

Each field has a **widget** (the HTML control) independent of its **type** (the validation). \`forms.CharField(widget=forms.Textarea)\` still validates as text but renders a \`<textarea>\`. Common: \`Textarea\`, \`PasswordInput\`, \`Select\`, \`CheckboxInput\`, \`DateInput(attrs={"type": "date"})\`, \`HiddenInput\`. Set HTML attributes with \`widget=forms.TextInput(attrs={"class": "input", "placeholder": "..."})\`.

## ModelForm

\`ModelForm\` generates fields from a model:

\`\`\`python
class ProductForm(ModelForm):
    class Meta:
        model = Product
        fields = ["name", "price_cents", "description"]   # explicit allowlist
        # exclude = ["owner"]     # the other way -- riskier, a new model field leaks in
        widgets = {"description": forms.Textarea}
        error_messages = {"name": {"unique": "A product with that name exists."}}
\`\`\`

- Model field validators carry over (\`max_length\`, \`unique\`, \`null\`), plus \`Model.clean()\` runs during \`form._post_clean()\`.
- **\`fields = "__all__"\`** or a broad \`exclude\` is the mass-assignment risk — list fields explicitly.
- **\`form.save(commit=False)\`** returns an unsaved instance so you can set server-controlled fields, then \`.save()\`. If the model has \`ManyToManyField\`s, call \`form.save_m2m()\` after (only needed with \`commit=False\`).
- Add extra non-model fields by declaring them on the form class normally; handle them in \`save()\` or the view.

## Where forms run

- **FBV**: \`form = MyForm(request.POST or None)\` then \`if request.method == "POST" and form.is_valid():\`.
- **Generic CBV** (\`CreateView\`/\`UpdateView\`/\`FormView\`): set \`form_class\` (or \`fields\` for an auto ModelForm); the view calls \`is_valid()\`, then \`form_valid(form)\` or \`form_invalid(form)\` (lesson 3).
- **DRF**: forms are *not* used — DRF has its own Serializer with the same \`is_valid()\` / \`validated_data\` / \`errors\` shape (Module 5). The mental model transfers directly.

## Validation is server-side, always

HTML5 attributes (\`required\`, \`type="email"\`, \`maxlength\`) and JS validation are UX only — a client can send anything. The form's \`is_valid()\` on the server is the real gate. Never write \`Model.objects.create(**request.POST.dict())\` — that bypasses every check and is a mass-assignment vulnerability.`,

    contentHi: `## Bound vs unbound

Ek form **unbound** hai jab bina data ke banता hai (\`ContactForm()\`) — ek blank form render karne ko. Ye **bound** hai jab data ke saath banता hai (\`ContactForm(request.POST, request.FILES)\`) — \`is_valid()\` phir ise process karта hai. Ek unbound form par \`is_valid()\` hamesha \`False\` hai.

\`is_valid()\` teen cheezein order mein karता hai aur ya \`cleaned_data\` (sab valid) ya \`errors\` populate karता hai:

1. **Field-level**: har \`Field.clean(value)\` — type coerce karता hai, \`required\` check karता hai, built-in validators chalाता hai.
2. **\`clean_<fieldname>()\`** — aapki per-field method, sirf tab call hoती hai agar field step 1 pass hua. \`self.cleaned_data["<field>"]\` padhो, apna check karो, **value return karो**. Reject karne ko \`forms.ValidationError("msg")\` raise karो.
3. **\`clean()\`** — cross-field rules. \`cleaned = super().clean()\`, fields compare karो, aur ya \`self.add_error("field", "msg")\` ya \`ValidationError\` raise karो (\`__all__\` par jाता hai).

## \`cleaned_data\` aur \`errors\`

- **\`form.cleaned_data\`** — validated, type-coerced values ka ek dict. Sirf \`is_valid()\` ke \`True\` return karne ke baad. Ek field jо fail hua \`cleaned_data\` se absent hai.
- **\`form.errors\`** — ek \`ErrorDict\`: \`{field_name: ["msg", ...], "__all__": [...]}\`. APIs ke liye \`form.errors.as_json()\`, templates mein \`form["field"].errors\`.

## Widgets

Har field ke paas ek **widget** (HTML control) hai jо iske **type** (validation) se independent hai. \`forms.CharField(widget=forms.Textarea)\` abhi bhi text ki tarah validate karता hai par ek \`<textarea>\` render karता hai. HTML attributes \`widget=forms.TextInput(attrs={"class": "input"})\` se set karो.

## ModelForm

\`\`\`python
class ProductForm(ModelForm):
    class Meta:
        model = Product
        fields = ["name", "price_cents", "description"]   # explicit allowlist
        widgets = {"description": forms.Textarea}
\`\`\`

- Model field validators carry over, plus \`Model.clean()\` chalता hai.
- **\`fields = "__all__"\`** ya ek broad \`exclude\` mass-assignment risk hai — fields explicitly list karो.
- **\`form.save(commit=False)\`** ek unsaved instance lautाता hai taaki aap server-controlled fields set kar sako, phir \`.save()\`. M2M fields ke saath, baad mein \`form.save_m2m()\` call karो.

## Forms kahaan chalते hain

- **FBV**: \`form = MyForm(request.POST or None)\` phir \`if request.method == "POST" and form.is_valid():\`.
- **Generic CBV**: \`form_class\` set karो; view \`is_valid()\` call karता hai, phir \`form_valid\` / \`form_invalid\`.
- **DRF**: forms istemal *nahi* hote — DRF ka apna Serializer hai same \`is_valid()\` / \`validated_data\` / \`errors\` shape ke saath (Module 5).

## Validation hamesha server-side

HTML5 attributes aur JS validation sirf UX hain — ek client kuch bhi bhej sakta hai. Server par form ka \`is_valid()\` asli gate hai. Kabhi \`Model.objects.create(**request.POST.dict())\` mat likhо — wo har check bypass karता hai.`,

    examples: [
      {
        title: 'is_valid() -> cleaned_data (typed) or errors (structured)',
        titleHi: 'is_valid() -> cleaned_data (typed) ya errors (structured)',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", INSTALLED_APPS=[], USE_TZ=True)
django.setup()

from django import forms

class BookingForm(forms.Form):
    name = forms.CharField(max_length=20)
    email = forms.EmailField()
    seats = forms.IntegerField(min_value=1, max_value=6)
    date = forms.DateField()

# valid submission -> cleaned_data has real Python types
good = BookingForm({"name": "Ada", "email": "ada@example.com", "seats": "3", "date": "2026-10-01"})
print("valid?", good.is_valid())
print("cleaned:", good.cleaned_data)
print("seats type:", type(good.cleaned_data["seats"]).__name__,
      "| date type:", type(good.cleaned_data["date"]).__name__)

# invalid submission -> errors, keyed by field
bad = BookingForm({"name": "A very long name over twenty", "email": "not-an-email",
                   "seats": "99", "date": ""})
print("\\nvalid?", bad.is_valid())
for field, errs in bad.errors.items():
    print(f"  {field}: {list(errs)}")          # list(errs) -> plain message strings
print("has cleaned_data for 'name'?", "name" in bad.cleaned_data)`,
        output: `valid? True
cleaned: {'name': 'Ada', 'email': 'ada@example.com', 'seats': 3, 'date': datetime.date(2026, 10, 1)}
seats type: int | date type: date

valid? False
  name: ['Ensure this value has at most 20 characters (it has 28).']
  email: ['Enter a valid email address.']
  seats: ['Ensure this value is less than or equal to 6.']
  date: ['This field is required.']
has cleaned_data for 'name'? False
`,
        explain: 'A bound form (`BookingForm({...})`) is validated by `is_valid()`. On success, `cleaned_data` holds real Python types — `seats` is an `int` coerced from `"3"`, `date` is a `datetime.date` from `"2026-10-01"`, not strings. On failure, `form.errors` is a dict keyed by field name, each value an `ErrorList` of messages (`list(errs)` unwraps it to plain strings — printing the `ErrorList` itself renders HTML). A field that failed (`name`) is entirely absent from `cleaned_data`, so code after `is_valid()` must never read a field without it having passed.',
        explainHi: 'Ek bound form (`BookingForm({...})`) `is_valid()` se validate hoता hai. Safal hone par, `cleaned_data` mein asli Python types hote hain — `seats` `"3"` se coerce kiya ek `int` hai, `date` ek `datetime.date` hai, strings nahi. Fail hone par, `form.errors` field name se keyed ek dict hai, har value messages ki ek `ErrorList` (`list(errs)` ise plain strings mein unwrap karта hai — `ErrorList` khud print karna HTML render karता hai). Ek field jо fail hua (`name`) `cleaned_data` se poori tarah absent hai.',
      },
      {
        title: 'clean_<field> (per-field) vs clean() (cross-field)',
        titleHi: 'clean_<field> (per-field) vs clean() (cross-field)',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", INSTALLED_APPS=[], USE_TZ=True)
django.setup()

from django import forms

TAKEN = {"admin", "root", "ada"}

class SignupForm(forms.Form):
    username = forms.CharField(max_length=30)
    password = forms.CharField(min_length=8)
    password2 = forms.CharField()

    def clean_username(self):
        name = self.cleaned_data["username"].lower()
        if name in TAKEN:
            raise forms.ValidationError("That username is taken.")
        return name                                   # normalised + returned

    def clean(self):
        cleaned = super().clean()
        p1, p2 = cleaned.get("password"), cleaned.get("password2")
        if p1 and p2 and p1 != p2:
            self.add_error("password2", "The two password fields must match.")
        return cleaned

f1 = SignupForm({"username": "ADA", "password": "longenough", "password2": "longenough"})
print("f1 valid?", f1.is_valid(), "| errors:", dict(f1.errors))

f2 = SignupForm({"username": "newbie", "password": "longenough", "password2": "different"})
print("f2 valid?", f2.is_valid(), "| errors:", dict(f2.errors))

f3 = SignupForm({"username": "newbie", "password": "longenough", "password2": "longenough"})
print("f3 valid?", f3.is_valid(), "| username normalised to:", f3.cleaned_data["username"])`,
        output: `f1 valid? False | errors: {'username': ['That username is taken.']}
f2 valid? False | errors: {'password2': ['The two password fields must match.']}
f3 valid? True | username normalised to: newbie`,
        explain: '`clean_username` is a per-field hook — it runs only after `username` passed its own field validation, reads `self.cleaned_data["username"]`, lowercases it, rejects taken names, and **returns** the normalised value (so `f3` ends up with `"newbie"`, not `"NEWBIE"`). `clean()` is the cross-field hook — it compares `password` and `password2` with `.get()` (either could be missing) and calls `self.add_error("password2", ...)` so the error attaches to that field. `f1` fails on the per-field rule, `f2` on the cross-field rule, `f3` passes and its `username` is transformed.',
        explainHi: '`clean_username` ek per-field hook hai — ye sirf `username` ke apni field validation pass karне ke baad chalता hai, `self.cleaned_data["username"]` padhता hai, lowercase karता hai, taken names reject karता hai, aur normalised value **return** karता hai (toh `f3` `"newbie"` ke saath khatam hoता hai, `"NEWBIE"` nahi). `clean()` cross-field hook hai — ye `password` aur `password2` ko `.get()` se compare karता hai aur `self.add_error("password2", ...)` call karता hai. `f1` per-field rule par fail, `f2` cross-field par, `f3` pass.',
      },
      {
        title: 'ModelForm: fields allowlist + save(commit=False) for server-set fields',
        titleHi: 'ModelForm: fields allowlist + server-set fields ke liye save(commit=False)',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection
from django.forms import ModelForm

class Article(models.Model):
    title = models.CharField(max_length=100)
    body = models.TextField()
    slug = models.SlugField(unique=True)
    author = models.CharField(max_length=30)
    is_featured = models.BooleanField(default=False)
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Article)

class ArticleForm(ModelForm):
    class Meta:
        model = Article
        fields = ["title", "body"]        # NOT slug / author / is_featured -> user cannot set them

# simulate a malicious POST trying to set author + is_featured
posted = {"title": "Hello", "body": "world", "author": "attacker", "is_featured": "true"}
form = ArticleForm(posted)
print("valid?", form.is_valid())
print("form only bound these fields:", list(form.fields))

article = form.save(commit=False)         # unsaved instance
article.author = "ada"                    # server decides the author
article.slug = "hello"                    # server derives the slug
article.save()

saved = Article.objects.get(slug="hello")
print("saved author:", saved.author, "(NOT 'attacker')")
print("saved is_featured:", saved.is_featured, "(the POSTed 'true' was ignored)")`,
        output: `valid? True
form only bound these fields: ['title', 'body']
saved author: ada (NOT 'attacker')
saved is_featured: False (the POSTed 'true' was ignored)
`,
        explain: '`ArticleForm.Meta.fields = ["title", "body"]` is an allowlist: the ModelForm builds inputs for exactly those two fields, so `list(form.fields)` is `["title", "body"]` and the `author`/`is_featured` keys in the POST body are simply never read — no matter what an attacker submits. `form.save(commit=False)` returns an unsaved `Article`; the server then sets `author` and `slug` itself before `.save()`. Result: the malicious `author="attacker"` and `is_featured="true"` have no effect. Listing `"__all__"` instead of the explicit two fields would have let both through — the mass-assignment vulnerability.',
        explainHi: '`ArticleForm.Meta.fields = ["title", "body"]` ek allowlist hai: ModelForm bilkul un do fields ke liye inputs banाता hai, toh `list(form.fields)` `["title", "body"]` hai aur POST body mein `author`/`is_featured` keys bilkul kabhi padhी nahi jातीं — attacker kuch bhi submit kare. `form.save(commit=False)` ek unsaved `Article` lautाता hai; server phir `.save()` se pehle `author` aur `slug` khud set karता hai. Parinाm: malicious `author="attacker"` ka koi asar nahi. Do explicit fields ke bजाy `"__all__"` list karna dono ko andar aane deता — mass-assignment vulnerability.',
      },
    ],

    mistakes: [
      {
        wrong: `def create(request):
    Post.objects.create(
        title=request.POST["title"],
        body=request.POST["body"],
        status=request.POST.get("status", "draft"),
        author_id=request.POST["author_id"],       # trusts the client
    )`,
        right: `def create(request):
    form = PostForm(request.POST)                   # PostForm.Meta.fields = ["title", "body"]
    if form.is_valid():
        post = form.save(commit=False)
        post.author = request.user                  # server sets it
        post.status = "draft"
        post.save()`,
        why: 'Reading `request.POST` keys directly into `create()` does zero validation (a missing key is a `KeyError` 500, a bad type is a DB error) and lets the client set any field named in the payload — `author_id`, `status`, `is_staff`. The form is the gate: it validates types and required-ness, its `fields` list is an allowlist, and `save(commit=False)` lets the server own the sensitive fields.',
        whyHi: '`request.POST` keys ko seedhे `create()` mein padhna zero validation karता hai (ek missing key ek `KeyError` 500 hai) aur client ko payload mein named koi bhi field set karने deता hai — `author_id`, `status`, `is_staff`. Form gate hai: ye types validate karता hai, iski `fields` list ek allowlist hai, aur `save(commit=False)` server ko sensitive fields own karने deता hai.',
      },
      {
        wrong: `class ProfileForm(forms.Form):
    website = forms.URLField()

    def clean_website(self):
        url = self.cleaned_data["website"]
        if not url.startswith("https://"):
            raise forms.ValidationError("Must be https.")
        # BUG: no return -> cleaned_data["website"] becomes None`,
        right: `def clean_website(self):
    url = self.cleaned_data["website"]
    if not url.startswith("https://"):
        raise forms.ValidationError("Must be https.")
    return url                                      # ALWAYS return the value`,
        why: 'A `clean_<field>` method must return the (possibly transformed) value. Falling off the end returns `None`, which Django then stores as that field\'s `cleaned_data` — so a form that "passed" silently wipes the field. Every `clean_<field>` ends with `return <value>`.',
        whyHi: 'Ek `clean_<field>` method ko (shायद transformed) value return karna chahिए. End se gir jाना `None` return karता hai, jise Django phir us field ka `cleaned_data` store karता hai — toh ek form jо "pass" hua chupchaap field wipe kar deता hai. Har `clean_<field>` `return <value>` se khatam hoता hai.',
      },
      {
        wrong: `class DateRangeForm(forms.Form):
    start = forms.DateField()
    end = forms.DateField()

    def clean_end(self):
        if self.cleaned_data["end"] < self.cleaned_data["start"]:   # KeyError if 'start' was invalid
            raise forms.ValidationError("End before start.")
        return self.cleaned_data["end"]`,
        right: `def clean(self):
    cleaned = super().clean()
    start, end = cleaned.get("start"), cleaned.get("end")
    if start and end and end < start:
        self.add_error("end", "End date must be on or after the start date.")
    return cleaned`,
        why: 'A comparison that needs two fields belongs in `clean()`, not `clean_<field>()`. Inside `clean_end`, `self.cleaned_data["start"]` raises `KeyError` whenever `start` itself failed field validation (it is absent from `cleaned_data`). In `clean()` you use `.get()` and guard for `None`, because any subset of fields may be missing.',
        whyHi: 'Ek comparison jise do fields chahिए wo `clean()` mein rehता hai, `clean_<field>()` mein nahi. `clean_end` ke andar, `self.cleaned_data["start"]` `KeyError` raise karता hai jab bhi `start` khud field validation mein fail hua. `clean()` mein aap `.get()` istemal karते ho aur `None` ke liye guard karते ho.',
      },
    ],

    realWorld: [
      {
        en: '**Every server-rendered write path goes through a form** — signup, checkout, profile edit, an admin action. Code review treats "this view writes to the DB without a form or serializer" as a red flag, because it means validation and the field allowlist are ad hoc.',
        hi: '**Har server-rendered write path ek form se guzarता hai** — signup, checkout, profile edit. Code review "ye view bina form ya serializer ke DB mein likhता hai" ko ek red flag manता hai.',
      },
      {
        en: '**`clean()` is where business rules that span fields live** — "a discount code cannot be combined with a sale price", "delivery date must be at least 2 working days out", "at least one contact method required". Putting them in the form (not the view) means every caller of that form gets them.',
        hi: '**`clean()` wahaan hai jahaan fields mein failे business rules rehते hain** — "ek discount code sale price ke saath combine nahi ho sakta", "delivery date kam se kam 2 working days baad". Unhe form mein rakhna (view mein nahi) matlab us form ka har caller unhe paता hai.',
      },
      {
        en: '**`save(commit=False)` + set owner + `save()` is the standard create pattern** — the form handles user input, the view stamps `created_by`, `organisation`, `status`, timestamps, then saves and fires side effects. DRF serializers do the same with `serializer.save(owner=request.user)` (Module 5).',
        hi: '**`save(commit=False)` + owner set + `save()` standard create pattern hai** — form user input handle karता hai, view `created_by`, `organisation`, `status` stamp karता hai, phir save aur side effects fire karता hai. DRF serializers wahi karते hain `serializer.save(owner=request.user)` se (Module 5).',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the validation pipeline of a Django form: what runs, in what order, and where do you put a rule that compares two fields?',
        qHi: 'Ek Django form ki validation pipeline samjhाओ: kya chalता hai, kis order mein, aur do fields compare karने wala rule aap kahaan rakhते ho?',
        a: 'You bind a form by constructing it with data — request dot POST and request dot FILES — then call is_valid, which returns a boolean and, as a side effect, populates either cleaned_data or errors. Internally is_valid runs full_clean, which has three phases. First, field-by-field: each field\'s own clean method coerces the raw string to a Python type, enforces required, and runs the field\'s validators — the built-in ones like EmailValidator or MinLengthValidator plus anything you passed in the validators list. A field that fails here has its error recorded and is left out of cleaned_data entirely. Second, for each field that survived phase one, Django looks for a method named clean_ plus the field name on the form and calls it. That method reads self dot cleaned_data for its field, applies a custom per-field rule, and must return the value — returning nothing sets the field to None. It signals rejection by raising forms dot ValidationError. Third, Django calls the form\'s clean method with no arguments, which is where cross-field rules go. You call super to get the base cleaned_data dict, then read fields with dot get because any of them might be missing if they failed earlier, compare them, and register a problem either by calling self dot add_error with a field name and message, which attaches the error to that field, or by raising ValidationError, which goes into the special __all__ bucket surfaced by non_field_errors. So a rule that compares two fields — end date after start date, password equals confirmation, at least one of several fields filled in — always goes in clean, never in a clean_field method, because inside clean_end the other field may not be in cleaned_data yet and you would get a KeyError. After is_valid you either read cleaned_data, a dict of trusted typed values, or render the form again and the errors display next to their fields.',
        aHi: 'Aap ek form ko data — request dot POST aur request dot FILES — ke saath construct karके bind karते ho, phir is_valid call karते ho, jо ek boolean return karता hai aur, side effect ke roop mein, ya cleaned_data ya errors populate karता hai. Andar is_valid full_clean chalाता hai, jiske teen phases hain. Pehle, field-by-field: har field ki apni clean method raw string ko ek Python type mein coerce karती hai, required enforce karती hai, aur field ke validators chalाती hai. Yahaan fail hone wala field cleaned_data se bahar chhod diya jाता hai. Doosra, phase ek jeetने wale har field ke liye, Django form par clean_ plus field name naam ki ek method dhoondhता hai aur ise call karता hai. Wo method apne field ke liye self dot cleaned_data padhती hai, ek custom per-field rule lागू karती hai, aur value return karni chahिए. Teesra, Django form ki clean method ko bina arguments call karता hai, jahaan cross-field rules jाते hain. Aap super call karके base cleaned_data dict paते ho, phir fields ko dot get se padhते ho, compare karते ho, aur ya self dot add_error ya ValidationError raise karके problem register karते ho. Toh do fields compare karने wala rule hamesha clean mein jाता hai, kabhi clean_field method mein nahi.',
      },
      {
        q: 'What is a ModelForm, and why is `fields = "__all__"` considered a security risk?',
        qHi: 'Ek ModelForm kya hai, aur `fields = "__all__"` ko ek security risk kyun manা jाता hai?',
        a: 'A ModelForm is a form whose fields are generated automatically from a model. You give it a Meta inner class naming the model and a fields list, and Django builds a form field for each model field, carrying over the model\'s constraints — max_length, unique, null, choices — as form validation, and also running the model\'s own clean method during the form\'s post-clean step. When valid, form dot save creates or updates the model instance and returns it; form dot save with commit False returns an unsaved instance so you can set fields the form does not manage before saving, and then you call save_m2m for any many-to-many fields. The security issue with fields equals the string all is that it tells the ModelForm to expose every field on the model as an editable, user-submittable input, including ones that should be server-controlled — an owner or author foreign key, a status or state field, a boolean like is_staff or is_published, a price or credit balance, internal bookkeeping columns. An attacker can then add those names to the POST body and the form will happily accept and save them, because they are legitimate form fields as far as it knows. This is the mass-assignment vulnerability. The fix is to always use an explicit fields list containing only the inputs the user is genuinely allowed to set, and to assign everything else in the view — typically via save commit False, set the owner to request dot user, set the status to its initial value, then save. Using exclude instead of fields is only marginally better and still risky, because the day someone adds a new sensitive field to the model, it is included in the form by default rather than excluded by default. Explicit allowlisting fails safe; the model changes and the form does not suddenly widen.',
        aHi: 'Ek ModelForm ek form hai jiske fields ek model se automatically generate hote hain. Aap ise ek Meta inner class dete ho jо model aur ek fields list naam karती hai, aur Django har model field ke liye ek form field banाता hai, model ke constraints — max_length, unique, null, choices — ko form validation ki tarah carry karके. Valid hone par, form dot save model instance banाता ya update karता hai; commit False ke saath ek unsaved instance lautाता hai. fields equals string all ke saath security issue ye hai ki ye ModelForm ko model par har field ko ek editable, user-submittable input ki tarah expose karने ko kehता hai, un fields sहित jо server-controlled hone chahिए — ek owner foreign key, ek status field, is_staff jaisा ek boolean, ek price. Ek attacker phir un names ko POST body mein add kar sakta hai aur form khushi se unhe accept aur save karega. Ye mass-assignment vulnerability hai. Fix hamesha ek explicit fields list istemal karna hai jismें sirf wo inputs hon jо user genuinely set kar sakta hai, aur baaki sab view mein assign karna.',
      },
    ],

    exercises: [
      {
        task: 'Write a plain `forms.Form` called `RegistrationForm` with `email` (EmailField), `age` (IntegerField, min_value 13), `plan` (ChoiceField: free/pro), and `newsletter` (BooleanField, not required). Bind a valid dict and print `cleaned_data` showing `age` is an `int` and `newsletter` is a `bool`. Bind an invalid dict (bad email, age 10, plan "enterprise") and print `form.errors` per field.',
        taskHi: 'Ek plain `forms.Form` `RegistrationForm` likhо `email` (EmailField), `age` (IntegerField, min_value 13), `plan` (ChoiceField: free/pro), `newsletter` (BooleanField, required nahi) ke saath. Ek valid dict bind karके `cleaned_data` print karो. Ek invalid dict bind karके `form.errors` print karो.',
        hint: '`settings.configure(INSTALLED_APPS=[], USE_TZ=True)` is enough — no DB needed for a plain Form. `ChoiceField(choices=[("free","Free"),("pro","Pro")])`. `form.is_valid()` before reading `cleaned_data`.',
        hintHi: '`settings.configure(INSTALLED_APPS=[], USE_TZ=True)` kaafi hai. `ChoiceField(choices=[("free","Free"),("pro","Pro")])`. `cleaned_data` padhने se pehle `form.is_valid()`.',
      },
      {
        task: 'Add validation to `RegistrationForm`: a `clean_email` that lowercases the email and rejects any address ending in `@example.com` ("Disposable domains not allowed"), and a `clean()` that requires `newsletter=True` when `plan == "free"` ("Free plan requires newsletter opt-in") via `add_error("newsletter", ...)`. Show: a free-plan form without newsletter fails on `newsletter`; a pro-plan form without newsletter passes; the email is lowercased in `cleaned_data`.',
        taskHi: '`RegistrationForm` mein validation add karो: ek `clean_email` jо email lowercase kare aur `@example.com` par khatam hone wale ko reject kare, aur ek `clean()` jо `plan == "free"` par `newsletter=True` require kare `add_error` ke zariye. Cases dikhाओ.',
        hint: '`clean_email` MUST `return email.lower()`. In `clean()`: `cleaned = super().clean(); if cleaned.get("plan") == "free" and not cleaned.get("newsletter"): self.add_error("newsletter", "...")`.',
        hintHi: '`clean_email` ko `return email.lower()` KARNA chahिए. `clean()` mein: `cleaned = super().clean(); if cleaned.get("plan") == "free" and not cleaned.get("newsletter"): self.add_error(...)`.',
      },
      {
        task: 'Model `Comment` (`body` TextField, `post_id` int, `author` CharField, `is_approved` bool default False). Write a `CommentForm(ModelForm)` with `Meta.fields = ["body"]` only. Simulate a POST that also includes `author="hacker"` and `is_approved="true"`. Show `list(form.fields)` is just `["body"]`, then `form.save(commit=False)`, set `comment.author = "ada"` and `comment.post_id = 1` server-side, `.save()`, and confirm the saved row has `author="ada"` and `is_approved=False`.',
        taskHi: '`Comment` (`body`, `post_id` int, `author`, `is_approved` bool default False) model karो. Ek `CommentForm(ModelForm)` likhо `Meta.fields = ["body"]` sirf. Ek POST simulate karो jismें `author="hacker"` bhi ho. `list(form.fields)` dikhाओ, phir `save(commit=False)`, server-side fields set karके `.save()`.',
        hint: 'Standalone Django boot + `connection.schema_editor()`. The malicious POST keys for `author`/`is_approved` simply are not form fields, so they are never read. `form.save(commit=False)` -> set attrs -> `.save()`.',
        hintHi: 'Standalone Django boot + `connection.schema_editor()`. `author`/`is_approved` ke malicious POST keys form fields nahi hain, toh kabhi padhे nahi jाते. `form.save(commit=False)` -> attrs set -> `.save()`.',
      },
    ],

    keyTakeaways: [
      'A form is UNBOUND (`MyForm()` — render blank) or BOUND (`MyForm(request.POST, request.FILES)` — validate). `is_valid()` on an unbound form is always `False`.',
      '`is_valid()` runs in order: (1) each `Field.clean` — type coercion, `required`, built-in + `validators=[]`; (2) `clean_<field>()` for fields that passed (1) — read `self.cleaned_data["<f>"]`, **return the value**, raise `ValidationError` to reject; (3) `clean()` — cross-field rules.',
      'Result: `form.cleaned_data` (dict of validated, TYPE-COERCED values — a failed field is absent) OR `form.errors` (`{field: [msgs], "__all__": [...]}`; `.as_json()`, `form["f"].errors`, `non_field_errors()`).',
      'Cross-field rules go in `clean()`, NOT `clean_<field>()` — use `cleaned.get("x")` and guard for `None` (a field that failed step 1 is missing). `self.add_error("field", msg)` attaches to a field; `raise ValidationError` goes to `__all__`.',
      'Every `clean_<field>` MUST `return` the (possibly transformed) value — falling off the end returns `None` and silently blanks the field.',
      '`ModelForm` builds fields from a model (`class Meta: model = X; fields = [...]`); model validators + `Model.clean()` carry over. `widgets`, `labels`, `help_texts`, `error_messages` in `Meta` customise rendering/messages.',
      '`fields = "__all__"` (or a broad `exclude`) is a MASS-ASSIGNMENT hole — list user-facing fields explicitly. `form.save(commit=False)` -> set server-controlled fields (`owner`, `status`) -> `.save()` -> `form.save_m2m()` if M2M.',
      'Client-side validation (HTML5 attrs, JS) is UX only. The server\'s `is_valid()` is the real gate. NEVER `Model.objects.create(**request.POST.dict())`. DRF serializers reuse the exact `is_valid()`/`validated_data`/`errors` model (Module 5).',
    ],
    keyTakeawaysHi: [
      'Ek form UNBOUND hai (`MyForm()` — blank render) ya BOUND (`MyForm(request.POST, request.FILES)` — validate). Ek unbound form par `is_valid()` hamesha `False` hai.',
      '`is_valid()` order mein chalता hai: (1) har `Field.clean` — type coercion, `required`, built-in + `validators=[]`; (2) `clean_<field>()` un fields ke liye jо (1) pass hue — `self.cleaned_data["<f>"]` padhо, **value return karो**, reject karne ko `ValidationError` raise karो; (3) `clean()` — cross-field rules.',
      'Result: `form.cleaned_data` (validated, TYPE-COERCED values ka dict — ek failed field absent hai) YA `form.errors`.',
      'Cross-field rules `clean()` mein jाते hain, `clean_<field>()` mein NAHI — `cleaned.get("x")` istemal karो aur `None` ke liye guard karो. `self.add_error("field", msg)` ek field se attach karता hai; `raise ValidationError` `__all__` par jाता hai.',
      'Har `clean_<field>` ko (shायद transformed) value `return` KARNI chahिए — end se gir jाना `None` return karता hai aur chupchaap field blank karता hai.',
      '`ModelForm` ek model se fields banाता hai (`class Meta: model = X; fields = [...]`); model validators + `Model.clean()` carry over. `Meta` mein `widgets`, `labels` customise karते hain.',
      '`fields = "__all__"` (ya ek broad `exclude`) ek MASS-ASSIGNMENT hole hai — user-facing fields explicitly list karो. `form.save(commit=False)` -> server-controlled fields set -> `.save()` -> M2M ho toh `form.save_m2m()`.',
      'Client-side validation sirf UX hai. Server ka `is_valid()` asli gate hai. KABHI `Model.objects.create(**request.POST.dict())` nahi. DRF serializers wahi `is_valid()`/`validated_data`/`errors` model reuse karते hain (Module 5).',
    ],
  },

  {
    slug: 'dj-pagination-and-messages',
    title: 'Pagination & the Messages Framework',
    titleHi: 'Pagination & Messages Framework',
    description: '`Paginator` slices a queryset into pages and is what `ListView.paginate_by` uses under the hood. The messages framework carries a one-shot notification ("Saved.", "Access denied.") across the redirect that follows a POST. Both are small, both have sharp edges worth knowing.',
    descriptionHi: '`Paginator` ek queryset ko pages mein slice karта hai aur yahi `ListView.paginate_by` andar istemal karता hai. Messages framework ek one-shot notification ("Saved.", "Access denied.") ko POST ke baad wale redirect ke paar le jाता hai. Dono chhote hain, dono ke sharp edges hain jaanने layak.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 5,

    analogy: {
      en: '**Pagination is a book\'s page numbers; messages are a sticky note passed to your next self.** `Paginator(queryset, 20)` is the act of deciding "20 rows to a page" — ask it for page 3 and it hands you that slice plus "page 3 of 47" and whether there is a next page. The catch is that the database still has to count all 940 rows to know it is "of 47", and to reach page 300 it has to skip 5,980 rows first — cheap for page 2, expensive deep in a big table (Module 8 has the keyset fix). The messages framework solves a different problem: after a successful POST you redirect (so a refresh does not re-submit), but the redirect is a fresh request with no memory of what just happened. `messages.success(request, "Profile saved.")` writes a sticky note into the session/cookie; the next request peels it off, shows it once, and it is gone. Read it and it self-destructs — that is why a message never shows up twice, and why a message set on a request that does *not* then display it is lost.',
      hi: '**Pagination ek kitाब ke page numbers hain; messages ek sticky note hai jо aapke agle self ko pass kiya jाता hai.** `Paginator(queryset, 20)` "ek page par 20 rows" tay karne ka act hai — ise page 3 maango aur ye aapko wo slice deता hai plus "page 3 of 47" aur kya ek next page hai. Catch ye hai ki database ko abhi bhi saari 940 rows count karni padती hain ye jaanने ko ki ye "of 47" hai, aur page 300 tak pahुँchने ko ise pehle 5,980 rows skip karni padती hain — page 2 ke liye sasta, ek bade table mein gehरा mehenga (Module 8 mein keyset fix hai). Messages framework ek alag problem solve karता hai: ek safal POST ke baad aap redirect karते ho, par redirect ek fresh request hai jiske paas abhi hua kya iski koi memory nahi. `messages.success(request, "Profile saved.")` session/cookie mein ek sticky note likhता hai; agli request ise peel karती hai, ise ek baar dikhाती hai, aur ye chala jाता hai. Ise padhо aur ye self-destruct hoता hai.',
    },

    simple: `**Paginator directly**

\`\`\`python
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

def article_list(request):
    qs = Article.objects.filter(status="published").order_by("-published_at")  # ORDER is required
    paginator = Paginator(qs, 20)                 # 20 per page

    page_number = request.GET.get("page", 1)
    page_obj = paginator.get_page(page_number)    # get_page() is forgiving: bad/OOR -> page 1 / last

    return render(request, "articles.html", {
        "page_obj": page_obj,                     # iterable of this page's 20 objects
        "paginator": paginator,
    })
\`\`\`

\`\`\`python
paginator.count           # total objects (a COUNT query)
paginator.num_pages       # total pages
paginator.page_range      # range(1, num_pages + 1)

page_obj.object_list      # this page's items
page_obj.number           # current page number
page_obj.has_next() / has_previous()
page_obj.next_page_number() / previous_page_number()   # raise EmptyPage if none
page_obj.start_index() / end_index()                   # 1-based item positions
page_obj.paginator        # back-reference
\`\`\`

**\`get_page()\` vs \`page()\`**

\`\`\`python
paginator.get_page(n)     # non-number -> page 1; ANY out-of-range number (<1 or >num_pages) -> last page.  Never raises.
paginator.page(n)         # strict: raises PageNotAnInteger or EmptyPage -- catch them yourself
\`\`\`

**In a ListView (lesson 3) it is automatic**

\`\`\`python
class ArticleListView(ListView):
    paginate_by = 20         # -> template gets page_obj, paginator, is_paginated; ?page=N; OOR -> 404
\`\`\`

**The messages framework**

\`\`\`python
from django.contrib import messages

def update_profile(request):
    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Profile updated.")     # queued
        return redirect("profile")                        # <- message survives this redirect
    ...

# levels: debug, info, success, warning, error
messages.error(request, "You do not have permission to do that.")
messages.set_level(request, messages.DEBUG)   # per-request minimum level
\`\`\`

\`\`\`django
{# in the template (base.html), rendered once then cleared #}
{% for message in messages %}
  <div class="alert alert-{{ message.tags }}">{{ message }}</div>
{% endfor %}
\`\`\`

\`\`\`
MIDDLEWARE: 'django.contrib.messages.middleware.MessageMiddleware'
context_processor: 'django.contrib.messages.context_processors.messages'  -> {{ messages }}
storage backends: FallbackStorage (default: cookie, then session), SessionStorage, CookieStorage
messages are consumed on read/iteration -> shown exactly once; set-but-not-displayed -> lost
\`\`\``,

    simpleHi: `**Paginator seedhे**

\`\`\`python
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

def article_list(request):
    qs = Article.objects.filter(status="published").order_by("-published_at")  # ORDER zaroori hai
    paginator = Paginator(qs, 20)                 # 20 prati page

    page_number = request.GET.get("page", 1)
    page_obj = paginator.get_page(page_number)    # get_page() forgiving hai: bad/OOR -> page 1 / last

    return render(request, "articles.html", {
        "page_obj": page_obj,
        "paginator": paginator,
    })
\`\`\`

\`\`\`python
paginator.count           # total objects (ek COUNT query)
paginator.num_pages       # total pages
page_obj.object_list      # is page ke items
page_obj.number           # current page number
page_obj.has_next() / has_previous()
page_obj.start_index() / end_index()                   # 1-based item positions
\`\`\`

**\`get_page()\` vs \`page()\`**

\`\`\`python
paginator.get_page(n)     # non-number -> page 1; koi bhi range-se-bahar number (<1 ya >num_pages) -> last page. Kabhi raise nahi.
paginator.page(n)         # strict: PageNotAnInteger ya EmptyPage raise karता hai
\`\`\`

**Ek ListView mein (lesson 3) ye automatic hai**

\`\`\`python
class ArticleListView(ListView):
    paginate_by = 20         # -> template ko page_obj, paginator, is_paginated milता hai; ?page=N; OOR -> 404
\`\`\`

**Messages framework**

\`\`\`python
from django.contrib import messages

def update_profile(request):
    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Profile updated.")     # queued
        return redirect("profile")                        # <- message is redirect survive karता hai
    ...

# levels: debug, info, success, warning, error
messages.error(request, "You do not have permission to do that.")
\`\`\`

\`\`\`django
{# template mein (base.html), ek baar render phir clear #}
{% for message in messages %}
  <div class="alert alert-{{ message.tags }}">{{ message }}</div>
{% endfor %}
\`\`\`

\`\`\`
MIDDLEWARE: 'django.contrib.messages.middleware.MessageMiddleware'
context_processor: 'django.contrib.messages.context_processors.messages'  -> {{ messages }}
storage: FallbackStorage (default: cookie, phir session), SessionStorage, CookieStorage
messages read/iteration par consume hote hain -> theek ek baar dikhाए jाते hain
\`\`\``,

    content: `## Paginator

\`Paginator(object_list, per_page, orphans=0, allow_empty_first_page=True)\`:

- \`object_list\` — a queryset (lazy, sliced with \`LIMIT\`/\`OFFSET\`), or any sliceable + \`len()\`-able sequence.
- \`per_page\` — page size.
- \`orphans\` — if the last page would have <= \`orphans\` items, fold them into the previous page.

**The queryset must be ordered.** Slicing an unordered queryset gives a database-defined, unstable order — page 2 may repeat rows from page 1. Add \`.order_by(...)\` (a unique-ish key, e.g. \`-created_at, -id\`).

### \`get_page()\` vs \`page()\`

- **\`paginator.get_page(number)\`** — a non-integer returns page 1; a numeric value out of range in *either* direction (\`< 1\` or \`> num_pages\`) returns the **last** page; never raises. Use this in a plain view. (The \`< 1\` case surprises people — \`validate_number\` raises \`EmptyPage\` for it, and \`get_page\` maps \`EmptyPage\` to \`num_pages\`.)
- **\`paginator.page(number)\`** — strict: raises \`PageNotAnInteger\` or \`EmptyPage\` (both subclasses of \`InvalidPage\`). \`ListView\` uses this and turns \`InvalidPage\` into an \`Http404\`.

### The \`Page\` object

\`page_obj\` is iterable (yields the page's objects) and carries \`number\`, \`paginator\`, \`has_next()\`, \`has_previous()\`, \`has_other_pages()\`, \`next_page_number()\`, \`previous_page_number()\` (these raise if there is no such page — guard with \`has_next()\`), \`start_index()\`, \`end_index()\`.

### The cost of offset pagination

\`LIMIT 20 OFFSET 5980\` makes the database **walk and discard** 5,980 rows before returning 20 — page load time grows with the page number. And \`paginator.count\` is a \`COUNT(*)\` over the filtered set on every request. For a small or moderate list this is fine. For a large, deep, or infinite-scroll list, use **keyset (cursor) pagination** — \`WHERE (created_at, id) < (:last_seen)\ ORDER BY created_at DESC, id DESC LIMIT 20\` — which is O(1) per page and needs no \`COUNT\`. Module 8 covers it; DRF ships a \`CursorPagination\` class (Module 5).

## The messages framework

### Why it exists: the POST-redirect-GET pattern

After a successful POST you should \`redirect\` (so refreshing the result page does not re-POST). But the redirect is a new request — the view that rendered the destination page knows nothing about the save that just happened. The messages framework bridges that one gap: you queue a message on the POST request, it is stored (cookie or session), and the *next* request to render pops it.

### API

\`\`\`python
from django.contrib import messages

messages.debug(request, "SQL: 3 queries")     # DEBUG - hidden unless set_level lowers the bar
messages.info(request, "You have 2 drafts.")
messages.success(request, "Order placed.")
messages.warning(request, "Your trial ends tomorrow.")
messages.error(request, "Card declined.")
messages.add_message(request, messages.SUCCESS, "...", extra_tags="sticky")
\`\`\`

Default minimum level is \`INFO\` (\`DEBUG\` messages are dropped) — change with \`MESSAGE_LEVEL\` in settings or \`messages.set_level(request, messages.DEBUG)\` per request.

### Storage and consumption

- **Backends**: \`FallbackStorage\` (default — tries \`CookieStorage\`, falls back to \`SessionStorage\` when the message set exceeds the ~2 KB cookie limit), \`SessionStorage\` (always session — needs \`django.contrib.sessions\`), \`CookieStorage\` (signed cookie, no session needed).
- **Consumed on iteration**: reading \`{{ messages }}\` in the template (or iterating \`get_messages(request)\` in Python) marks them read and clears them after the response. So a message shows **exactly once** — on the next page rendered. A message added on a request whose response never iterates \`messages\` stays queued for the request after that (which can surprise you), unless \`storage.used\` logic drops it.
- To peek without consuming: \`storage = messages.get_messages(request); storage.used = False\`.

### Wiring

\`django.contrib.messages\` in \`INSTALLED_APPS\`, \`MessageMiddleware\` in \`MIDDLEWARE\` (after \`SessionMiddleware\`), and the \`messages\` context processor in \`TEMPLATES\` (all present in the \`startproject\` default). Then render \`{% for message in messages %}\` once in your base template.

### In DRF

DRF APIs do not use the messages framework — a JSON client has nowhere to show a flash. API responses carry status directly in the body/status code. Messages are a server-rendered-HTML concern.`,

    contentHi: `## Paginator

\`Paginator(object_list, per_page, orphans=0, allow_empty_first_page=True)\`:

- \`object_list\` — ek queryset (lazy, \`LIMIT\`/\`OFFSET\` se sliced), ya koi sliceable + \`len()\`-able sequence.
- \`per_page\` — page size.
- \`orphans\` — agar last page mein <= \`orphans\` items hon, unhe pichhले page mein fold karो.

**Queryset ordered hona chahिए.** Ek unordered queryset slice karna ek database-defined, unstable order deता hai — page 2 page 1 se rows repeat kar sakta hai. \`.order_by(...)\` add karो.

### \`get_page()\` vs \`page()\`

- **\`paginator.get_page(number)\`** — ek non-integer page 1 lautाता hai; ek numeric value jо *kisi bhi* disha mein range se bahar hai (\`< 1\` ya \`> num_pages\`) **last** page lautाता hai; kabhi raise nahi. Ek plain view mein ise istemal karो. (\`< 1\` case log ko surprise karता hai — \`validate_number\` iske liye \`EmptyPage\` raise karता hai, aur \`get_page\` \`EmptyPage\` ko \`num_pages\` par map karता hai.)
- **\`paginator.page(number)\`** — strict: \`PageNotAnInteger\` ya \`EmptyPage\` raise karता hai. \`ListView\` ise istemal karता hai aur \`InvalidPage\` ko ek \`Http404\` banाता hai.

### Offset pagination ki cost

\`LIMIT 20 OFFSET 5980\` database ko 20 lautाने se pehle 5,980 rows **walk aur discard** karवाता hai — page load time page number ke saath badhता hai. Aur \`paginator.count\` har request par ek \`COUNT(*)\` hai. Ek chhoti list ke liye ye theek hai. Ek badi, gehरी list ke liye, **keyset (cursor) pagination** istemal karो — jо prati page O(1) hai aur koi \`COUNT\` nahi chahिए. Module 8 ise cover karता hai; DRF ek \`CursorPagination\` class deता hai (Module 5).

## Messages framework

### Kyun maujूd hai: POST-redirect-GET pattern

Ek safal POST ke baad aapko \`redirect\` karna chahिए (taaki result page refresh karna re-POST na kare). Par redirect ek nayi request hai — destination page render karने wale view ko abhi hui save ke baare mein kuch nahi pata. Messages framework us ek gap ko bridge karता hai: aap POST request par ek message queue karते ho, ye store hoता hai (cookie ya session), aur *agli* request ise pop karती hai.

### API

\`\`\`python
from django.contrib import messages

messages.info(request, "You have 2 drafts.")
messages.success(request, "Order placed.")
messages.error(request, "Card declined.")
messages.add_message(request, messages.SUCCESS, "...", extra_tags="sticky")
\`\`\`

Default minimum level \`INFO\` hai — \`MESSAGE_LEVEL\` se ya \`messages.set_level(request, messages.DEBUG)\` se badlो.

### Storage aur consumption

- **Backends**: \`FallbackStorage\` (default — \`CookieStorage\` try karता hai, ~2 KB cookie limit se zyada hone par \`SessionStorage\` par fallback), \`SessionStorage\`, \`CookieStorage\`.
- **Iteration par consumed**: template mein \`{{ messages }}\` padhna unhe read mark karता hai aur response ke baad clear karता hai. Toh ek message **theek ek baar** dikhता hai. Ek request par add kiya message jiska response kabhi \`messages\` iterate nahi karता uske baad wali request ke liye queued rehта hai.
- Consume kiye bina peek karने ko: \`storage = messages.get_messages(request); storage.used = False\`.

### Wiring

\`django.contrib.messages\` \`INSTALLED_APPS\` mein, \`MessageMiddleware\` \`MIDDLEWARE\` mein, aur \`messages\` context processor \`TEMPLATES\` mein (sab \`startproject\` default mein maujूd). Phir apne base template mein \`{% for message in messages %}\` ek baar render karो.

### DRF mein

DRF APIs messages framework istemal nahi karती — ek JSON client ke paas flash dikhाने ki jagah nahi. API responses status seedhे body/status code mein le jाते hain. Messages ek server-rendered-HTML concern hai.`,

    examples: [
      {
        title: 'Paginator: slicing, get_page() clamping, and the Page object',
        titleHi: 'Paginator: slicing, get_page() clamping, aur Page object',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x",
    INSTALLED_APPS=["django.contrib.contenttypes", "__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True)
django.setup()

from django.db import models, connection, reset_queries
from django.core.paginator import Paginator

class Row(models.Model):
    n = models.IntegerField()
    class Meta:
        app_label = "__main__"

with connection.schema_editor() as se:
    se.create_model(Row)
Row.objects.bulk_create([Row(n=i) for i in range(47)])

qs = Row.objects.order_by("n")          # MUST be ordered
p = Paginator(qs, 10)
print("count:", p.count, "| num_pages:", p.num_pages)

pg2 = p.get_page(2)
print("page 2 items:", [r.n for r in pg2])
print("page 2: number", pg2.number, "| has_next", pg2.has_next(),
      "| start_index", pg2.start_index(), "| end_index", pg2.end_index())

# get_page() never raises: a NON-number -> page 1; any out-of-range number -> LAST page
print("get_page('abc') -> page", p.get_page("abc").number, "(not a number -> 1)")
print("get_page(0)     -> page", p.get_page(0).number, "(< 1 -> last page, not page 1!)")
print("get_page(999)   -> page", p.get_page(999).number, "(> num_pages -> last page)")

# the SQL Django runs for a page: LIMIT/OFFSET
settings.DEBUG = True
reset_queries()
list(p.get_page(4))
print("page 4 SQL:", connection.queries[-1]["sql"].split("FROM")[1].strip())`,
        output: `count: 47 | num_pages: 5
page 2 items: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
page 2: number 2 | has_next True | start_index 11 | end_index 20
get_page('abc') -> page 1 (not a number -> 1)
get_page(0)     -> page 5 (< 1 -> last page, not page 1!)
get_page(999)   -> page 5 (> num_pages -> last page)
page 4 SQL: "__main___row" ORDER BY "__main___row"."n" ASC LIMIT 10 OFFSET 30
`,
        explain: '`Paginator(qs, 10)` over 47 rows = 5 pages; `p.count` (47) is a `COUNT(*)`, `num_pages` is derived. `p.get_page(2)` returns a `Page` you can iterate for its 10 objects, with `number`, `has_next()`, `start_index()`/`end_index()` (1-based positions in the full set). `get_page()` never raises: a value that is not a number becomes page 1, but a numeric value out of range in *either* direction — `0`, `-5`, or `999` — becomes the **last** page (a common surprise; `validate_number` raises `EmptyPage` for `< 1`, which `get_page` maps to `num_pages`). The page-4 SQL shows the mechanism: `LIMIT 10 OFFSET 30` — the DB must walk past 30 rows, which is why deep offsets get slow.',
        explainHi: '`Paginator(qs, 10)` 47 rows par = 5 pages; `p.count` (47) ek `COUNT(*)` hai. `p.get_page(2)` ek `Page` lautाता hai jise aap iske 10 objects ke liye iterate kar sakte ho, `number`, `has_next()`, `start_index()`/`end_index()` ke saath. `get_page()` kabhi raise nahi karta: ek value jо number nahi hai page 1 ban jати hai, par range se bahar ek numeric value *kisi bhi* disha mein — `0`, `-5`, ya `999` — **last** page ban jati hai (ek aam surprise; `validate_number` `< 1` ke liye `EmptyPage` raise karta hai, jise `get_page` `num_pages` par map karta hai). Page-4 SQL mechanism dikhata hai: `LIMIT 10 OFFSET 30`.',
      },
      {
        title: 'Messages survive the POST -> redirect -> GET and are shown once',
        titleHi: 'Messages POST -> redirect -> GET survive karते hain aur ek baar dikhाए jाते hain',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.messages"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.BigAutoField", USE_TZ=True,
    MIDDLEWARE=["django.contrib.sessions.middleware.SessionMiddleware",
               "django.contrib.messages.middleware.MessageMiddleware"],
    SESSION_ENGINE="django.contrib.sessions.backends.signed_cookies",
    MESSAGE_STORAGE="django.contrib.messages.storage.cookie.CookieStorage",
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "DIRS": [],
                "APP_DIRS": False, "OPTIONS": {"context_processors": [
                    "django.contrib.messages.context_processors.messages"],
                "loaders": [("django.template.loaders.locmem.Loader", {"page.html":
                    "{% for m in messages %}[{{ m.tags }}] {{ m }}\\n{% endfor %}"})]}}])
django.setup()

from django.contrib import messages
from django.shortcuts import render, redirect
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from django.test import Client

@csrf_exempt
def save_view(request):
    messages.success(request, "Profile saved.")
    messages.warning(request, "Avatar is low-res.")
    return redirect("/result/")

def result_view(request):
    return render(request, "page.html")

urlpatterns = [path("save/", save_view), path("result/", result_view)]

c = Client()
r1 = c.post("/save/")
print("POST /save/ -> ", r1.status_code, r1["Location"])
r2 = c.get("/result/")
print("GET /result/ (messages shown):")
print(r2.content.decode())
r3 = c.get("/result/")
print("GET /result/ again (already consumed):", repr(r3.content.decode()))`,
        output: `POST /save/ ->  302 /result/
GET /result/ (messages shown):
[success] Profile saved.
[warning] Avatar is low-res.

GET /result/ again (already consumed): ''
`,
        explain: '`save_view` queues two messages then `redirect`s — the classic POST-redirect-GET. The messages are serialised into a signed cookie (`CookieStorage`) that rides through the 302 to `/result/`. That GET renders `page.html`, whose `{% for m in messages %}` loop iterates them (showing both, with `m.tags` giving `success`/`warning`) — and iterating **consumes** them. The second GET of `/result/` renders nothing, because the messages were cleared after the first response. This is why a flash message appears exactly once and why you must redirect (not `render`) after the POST.',
        explainHi: '`save_view` do messages queue karta hai phir `redirect` karta hai — classic POST-redirect-GET. Messages ek signed cookie (`CookieStorage`) mein serialise hote hain jо 302 ke through `/result/` tak jati hai. Wo GET `page.html` render karta hai, jiska `{% for m in messages %}` loop unhe iterate karta hai (dono dikhata hai, `m.tags` `success`/`warning` deta hai) — aur iterate karna unhe **consume** karta hai. `/result/` ka doosra GET kuch render nahi karta. Isiliye ek flash message theek ek baar dikhta hai aur isiliye aapko POST ke baad redirect karna chahिए.',
      },
      {
        title: 'get_page() (forgiving) vs page() (strict, what ListView uses)',
        titleHi: 'get_page() (forgiving) vs page() (strict, jо ListView istemal karта hai)',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", INSTALLED_APPS=[], USE_TZ=True)
django.setup()

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger, InvalidPage

items = list(range(1, 26))            # 25 items
p = Paginator(items, 10)             # 3 pages

# get_page: never raises, clamps everything
for arg in ["2", "notanumber", 0, -5, 99]:
    print(f"get_page({arg!r:>12}) -> page {p.get_page(arg).number}")

print()

# page(): strict -- raises InvalidPage subclasses; ListView catches these and returns Http404
for arg in ["2", "xyz", "99"]:
    try:
        pg = p.page(arg)
        print(f"page({arg!r}) -> page {pg.number}")
    except InvalidPage as e:
        print(f"page({arg!r}) -> {type(e).__name__}: {e}")`,
        output: `get_page(         '2') -> page 2
get_page('notanumber') -> page 1
get_page(           0) -> page 3
get_page(          -5) -> page 3
get_page(          99) -> page 3

page('2') -> page 2
page('xyz') -> PageNotAnInteger: That page number is not an integer
page('99') -> EmptyPage: That page contains no results
`,
        explain: '`get_page(n)` is forgiving and is what you use in a plain FBV: a non-number returns page 1, and any out-of-range number (`0`, `-5`, `99`) returns the last page — it never raises. `page(n)` is strict: `"xyz"` raises `PageNotAnInteger` and `"99"` raises `EmptyPage` (both subclasses of `InvalidPage`), and you must handle them. `ListView` uses `page()` internally and converts an `InvalidPage` into an `Http404` — which is why hitting `?page=99` on a paginated `ListView` gives a 404, not a clamped last page.',
        explainHi: '`get_page(n)` forgiving hai aur yahi aap ek plain FBV mein istemal karte ho: ek non-number page 1 lautata hai, aur koi range-se-bahar number (`0`, `-5`, `99`) last page lautata hai — ye kabhi raise nahi karta. `page(n)` strict hai: `"xyz"` `PageNotAnInteger` raise karta hai aur `"99"` `EmptyPage` raise karta hai (dono `InvalidPage` ke subclasses), aur aapko unhe handle karna hai. `ListView` andar `page()` istemal karta hai aur ek `InvalidPage` ko ek `Http404` mein badalta hai — isiliye ek paginated `ListView` par `?page=99` hit karna ek 404 deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `qs = Article.objects.filter(status="published")   # no .order_by()
paginator = Paginator(qs, 20)
# page 2 sometimes repeats an article from page 1, or skips one`,
        right: `qs = Article.objects.filter(status="published").order_by("-published_at", "-id")
paginator = Paginator(qs, 20)`,
        why: 'Pagination is `LIMIT n OFFSET m` on the SQL. Without an `ORDER BY`, the database is free to return rows in any order, and that order need not be stable between the query for page 1 and the query for page 2 — so rows shift across page boundaries. Always paginate an explicitly ordered queryset, and include a tiebreaker (`-id`) so the order is total, not just "by date" with ties resolved arbitrarily.',
        whyHi: 'Pagination SQL par `LIMIT n OFFSET m` hai. Ek `ORDER BY` ke bina, database rows ko kisi bhi order mein lauta sakta hai, aur wo order page 1 aur page 2 ki query ke beech stable hona zaroori nahi — toh rows page boundaries ke paar shift hoती hain. Hamesha ek explicitly ordered queryset paginate karो, aur ek tiebreaker (`-id`) include karो.',
      },
      {
        wrong: `def profile(request):
    if request.method == "POST":
        form.save()
        messages.success(request, "Saved.")
        return render(request, "profile.html", {"form": form})   # rendered, not redirected
# refreshing the page re-submits the POST; and the message logic gets confused`,
        right: `def profile(request):
    if request.method == "POST":
        if form.is_valid():
            form.save()
            messages.success(request, "Saved.")
            return redirect("profile")        # POST-redirect-GET
    return render(request, "profile.html", {"form": form})`,
        why: 'The messages framework is designed around POST-redirect-GET. If you `render` directly after a POST instead of redirecting, refreshing re-submits the form (duplicate saves, "confirm form resubmission" dialog), and the flash message pattern breaks down. Always redirect after a successful POST; the queued message rides through to the GET.',
        whyHi: 'Messages framework POST-redirect-GET ke aas-paas design kiya hai. Agar aap ek POST ke baad redirect karने ke bजाy seedhे `render` karते ho, refresh form re-submit karता hai (duplicate saves), aur flash message pattern tootता hai. Ek safal POST ke baad hamesha redirect karो.',
      },
      {
        wrong: `# a deep "load more" feed
page = request.GET.get("page")
qs = Event.objects.order_by("-created_at")
page_obj = Paginator(qs, 20).get_page(page)   # page=500 -> OFFSET 9980, plus a COUNT(*) every call`,
        right: `# keyset pagination -- O(1) per page, no COUNT (Module 8)
after = request.GET.get("after")            # the created_at+id of the last item seen
qs = Event.objects.order_by("-created_at", "-id")
if after:
    ts, last_id = parse_cursor(after)
    qs = qs.filter(Q(created_at__lt=ts) | Q(created_at=ts, id__lt=last_id))
events = list(qs[:20])`,
        why: 'Offset pagination degrades as the offset grows — `OFFSET 9980` makes the DB scan and throw away ~10k rows per request, and `paginator.count` adds a full `COUNT(*)` every time. Fine for a 5-page admin table; bad for an infinite-scroll feed or a large export. Keyset (cursor) pagination filters by "everything after the last row I saw", which uses the index and is constant-time regardless of depth. DRF has `CursorPagination` built in.',
        whyHi: 'Offset pagination offset badhने par degrade hoती hai — `OFFSET 9980` DB ko prati request ~10k rows scan aur phenkवाता hai, aur `paginator.count` har baar ek poora `COUNT(*)` add karता hai. Ek 5-page admin table ke liye theek; ek infinite-scroll feed ke liye bura. Keyset pagination "wo sab jо meri dekhी last row ke baad" se filter karता hai, jо index istemal karता hai aur depth ki parwाh kiye bina constant-time hai.',
      },
    ],

    realWorld: [
      {
        en: '**`ListView` + `paginate_by` covers 90% of internal list screens** — the template loop over `page_obj` plus a "Page X of Y" nav with `page_obj.has_previous`/`has_next`. The `?page=N` param is bookmarkable. Reach for keyset only when a list is genuinely deep or public-facing at scale.',
        hi: '**`ListView` + `paginate_by` 90% internal list screens cover karता hai** — `page_obj` par template loop plus ek "Page X of Y" nav. `?page=N` param bookmarkable hai. Keyset ke liye sirf tab pahुँcho jab ek list sach mein gehरी ho.',
      },
      {
        en: '**Flash messages are the standard "it worked / it did not" feedback for form submissions** — `messages.success(request, "Invitation sent to " + email)` before the redirect, rendered in the base template\'s alert region. Consistent, accessible, and survives the redirect that prevents double-submits.',
        hi: '**Flash messages form submissions ke liye standard "kaam hua / nahi hua" feedback hain** — redirect se pehle `messages.success(request, "Invitation sent to " + email)`, base template ke alert region mein rendered.',
      },
      {
        en: '**`get_page()` in FBVs, `paginate_by` (which uses strict `page()`) in `ListView`** — teams pick `get_page` when a junky `?page=` should just show page 1, and the `ListView` default (404 on an invalid page) when a bad page number is a real client error worth surfacing. Know which one a given view uses.',
        hi: '**FBVs mein `get_page()`, `ListView` mein `paginate_by`** — teams `get_page` chunती hain jab ek junky `?page=` ko bस page 1 dikhाना chahिए, aur `ListView` default (invalid page par 404) jab ek bura page number ek asli client error hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How does Django pagination work at the SQL level, and when should you not use `Paginator`?',
        qHi: 'Django pagination SQL level par kaise kaam karта hai, aur aapko `Paginator` kab istemal nahi karna chahिए?',
        a: 'Paginator takes a queryset and a page size. When you ask it for a specific page, it slices the queryset — page three with a size of twenty becomes queryset from index forty to sixty — and the ORM translates that slice into a SQL LIMIT twenty OFFSET forty. It also exposes count, which runs a separate SELECT COUNT star over the filtered queryset so it can compute the number of pages. Two consequences matter. First, the queryset must have an explicit order_by, because LIMIT and OFFSET without an ORDER BY let the database return rows in any order, and that order is not guaranteed to be the same between the request for page one and the request for page two, so rows can duplicate or vanish across page boundaries; you want a total ordering, so include a unique tiebreaker like id. Second, OFFSET is not free: the database has to generate and then discard all the skipped rows before it returns your slice, so OFFSET ten thousand means scanning past ten thousand rows on every request for a deep page, and the count query is a full aggregate every time. For a bounded list — an admin table, search results a user will realistically page through a few screens of — that is completely fine and Paginator is the right tool, especially since ListView wires it up for you with paginate_by. You should not use offset pagination for deep or unbounded lists: an infinite-scroll activity feed, a public API endpoint over a huge table, a data export. There you use keyset or cursor pagination, which instead of an offset filters on where the ordering columns are past the last row the client saw — created_at less than the last timestamp, breaking ties on id — so each page is an indexed range scan that costs the same whether it is page two or page two thousand, and there is no count query. Django REST Framework ships a CursorPagination class that does exactly this.',
        aHi: 'Paginator ek queryset aur ek page size leта hai. Jab aap ise ek vishisht page maangते ho, ye queryset slice karता hai — size bees ke saath page teen index chaalis se saath ban jाता hai — aur ORM us slice ko ek SQL LIMIT bees OFFSET chaalis mein translate karता hai. Ye count bhi expose karता hai, jо ek alag SELECT COUNT star chalाता hai. Do parinaम maayne rakhते hain. Pehla, queryset ka ek explicit order_by hona chahिए, kyunki ORDER BY ke bina LIMIT aur OFFSET database ko rows kisi bhi order mein lautाने dete hain, aur wo order page ek aur page do ke beech same hone ki guarantee nahi, toh rows page boundaries ke paar duplicate ya gायब ho sakti hain. Doosra, OFFSET muft nahi hai: database ko aapki slice lautाने se pehle saari skip ki rows generate karके phenkni padती hain. Ek bounded list ke liye ye theek hai. Aapko deep ya unbounded lists ke liye offset pagination istemal nahi karna chahिए — ek infinite-scroll feed, ek bade table par ek public API. Wahaan aap keyset ya cursor pagination istemal karते ho, jо ek offset ke bजाy filter karता hai jahaan ordering columns client ki dekhी last row se aage hain.',
      },
      {
        q: 'What problem does the messages framework solve, and what does "consumed on read" mean in practice?',
        qHi: 'Messages framework kaunसा problem solve karता hai, aur "consumed on read" ka vyavhaar mein kya matlab hai?',
        a: 'The problem is carrying a short notification across a redirect. The correct pattern after a successful POST is to redirect to a GET, so that if the user refreshes the resulting page the browser does not re-submit the form. But that redirect is a brand new HTTP request, and the view that renders the destination page has no knowledge of the POST that just succeeded — there is nowhere natural to put "your profile was saved." The messages framework is a small piece of state that bridges exactly that gap. During the POST request you call messages dot success or messages dot error with the request and a string; the message is serialized into storage, which by default is a signed cookie, falling back to the session if the messages do not fit in about two kilobytes. On the next request, the template renders a loop over the messages variable, which the context processor supplies, and each message is displayed. Consumed on read means that the act of iterating that messages variable — in the template, or calling get_messages and looping it in Python — marks the message store as used, and after the response is sent the used messages are deleted from storage. The practical effects: a message is shown exactly once, on the very next rendered page, and then it is gone, which is what you want for a flash notification — a refresh of that page does not show it again. The flip side is that if you add a message during a request whose response does not iterate the messages variable at all — say an endpoint that returns JSON, or a redirect chain where the final template forgot the messages loop — the message is not consumed and stays in storage, so it can pop up unexpectedly on some later page that does render the loop. So the rule is: only add messages on requests that will end at an HTML page whose base template renders the messages block, and make sure that block exists exactly once in your base template.',
        aHi: 'Problem ek chhoti notification ko ek redirect ke paar le jाना hai. Ek safal POST ke baad sahi pattern ek GET par redirect karna hai, taaki agar user parinaमi page refresh kare toh browser form re-submit na kare. Par wo redirect ek bilkul nayi HTTP request hai, aur destination page render karने wale view ko abhi safal hui POST ka koi gyan nahi. Messages framework state ka ek chhota tुkda hai jо bilkul us gap ko bridge karता hai. POST request ke dौran aap messages dot success call karते ho; message storage mein serialize hoता hai, jо default roop se ek signed cookie hai, session par fallback karके agar messages ~2 KB mein fit nahi hote. Agli request par, template messages variable par ek loop render karता hai, aur har message dikhता hai. Consumed on read ka matlab ye hai ki us messages variable ko iterate karne ka act store ko used mark karता hai, aur response bhejने ke baad used messages storage se delete ho jाते hain. Vyavhaarik prabhaव: ek message theek ek baar dikhता hai, agle rendered page par, phir chala jाता hai. Ulta pehlू ye hai ki agar aap ek request ke dौran ek message add karते ho jiska response messages variable bilkul iterate nahi karता, message consume nahi hoता aur storage mein rehта hai.',
      },
    ],

    exercises: [
      {
        task: 'Standalone Django with a `Row` model (`n` int). Insert 55 rows. Build `Paginator(Row.objects.order_by("n"), 12)`. Print `count`, `num_pages`, the `n` values on page 3, and `page_obj.start_index()`/`end_index()` for page 3. Then show `get_page("junk").number`, `get_page(-1).number`, and `get_page(500).number`.',
        taskHi: 'Standalone Django ek `Row` model (`n` int) ke saath. 55 rows insert karो. `Paginator(Row.objects.order_by("n"), 12)` banाओ. `count`, `num_pages`, page 3 ke `n` values, aur page 3 ke `start_index()`/`end_index()` print karो. Phir `get_page("junk")`, `get_page(-1)`, `get_page(500)` dikhाओ.',
        hint: '55 / 12 -> 5 pages (12,12,12,12,7). Page 3 is `n` = 24..35, start_index 25, end_index 36. `get_page` clamps all bad input to page 1 or the last page.',
        hintHi: '55 / 12 -> 5 pages. Page 3 `n` = 24..35 hai. `get_page` saara bura input page 1 ya last page par clamp karता hai.',
      },
      {
        task: 'Wire up the messages framework standalone (`CookieStorage`, `signed_cookies` session, the messages context processor, an inline `"{% for m in messages %}{{ m.level_tag }}:{{ m }};{% endfor %}"` template). Write a csrf-exempt `do(request)` that adds a `success` and an `error` message then `redirect("/show/")`, and `show(request)` that renders the template. With `Client`: POST `/do/`, then GET `/show/` (see both messages), then GET `/show/` again (empty — consumed).',
        taskHi: 'Messages framework standalone wire karो (`CookieStorage`, `signed_cookies` session, messages context processor, ek inline template). Ek csrf-exempt `do(request)` likhо jо ek `success` aur ek `error` message add kare phir `redirect("/show/")`, aur `show(request)`. `Client` se: POST `/do/`, phir GET `/show/` (dono messages), phir GET `/show/` phir (khali).',
        hint: '`MESSAGE_STORAGE="django.contrib.messages.storage.cookie.CookieStorage"`. `MIDDLEWARE` needs `SessionMiddleware` then `MessageMiddleware`. `TEMPLATES[0]["OPTIONS"]["context_processors"]` must include the messages one.',
        hintHi: '`MESSAGE_STORAGE="...cookie.CookieStorage"`. `MIDDLEWARE` mein `SessionMiddleware` phir `MessageMiddleware`. `context_processors` mein messages wala.',
      },
      {
        task: 'Demonstrate why an unordered queryset breaks pagination. Model `Item` (`group` int, `label`). Insert 30 items where `group` cycles 0,1,2 and `label` is `f"item-{i}"`. Build `Paginator(Item.objects.all(), 10)` (NO order_by) and `Paginator(Item.objects.order_by("id"), 10)`. Collect the `label`s across all 3 pages of each and assert the ordered one has 30 unique labels; print whether the unordered one also happened to (it may, on SQLite — explain in a comment that the guarantee is absent).',
        taskHi: 'Dikhाओ ki ek unordered queryset pagination kyun toड़ता hai. `Item` (`group` int, `label`) model karो. 30 items insert karो. `Paginator(Item.objects.all(), 10)` (koi order_by nahi) aur `Paginator(Item.objects.order_by("id"), 10)` banाओ. Dono ke 3 pages ke `label`s collect karके assert karो.',
        hint: 'On SQLite an unordered `SELECT` often returns rowid order by luck, so both may give 30 unique — the point is the DB does not *promise* it. A comment noting Postgres can reorder after an `UPDATE`/`VACUUM` makes the lesson land.',
        hintHi: 'SQLite par ek unordered `SELECT` aksar luck se rowid order lautाता hai, toh dono 30 unique de sakte hain — point ye hai ki DB ise *promise* nahi karता. Ek comment ki Postgres `UPDATE`/`VACUUM` ke baad reorder kar sakta hai.',
      },
    ],

    keyTakeaways: [
      '`Paginator(queryset, per_page, orphans=0)` -> `.count` (a `COUNT(*)`), `.num_pages`, `.page_range`. `.get_page(n)` -> a `Page`. The queryset MUST be `.order_by(...)`\'d (with a unique tiebreaker like `-id`) or rows shift across page boundaries.',
      '`Page` (`page_obj`): iterable (this page\'s objects), `.number`, `.paginator`, `.has_next()`/`.has_previous()`, `.next_page_number()`/`.previous_page_number()` (raise if none — guard first), `.start_index()`/`.end_index()` (1-based).',
      '`paginator.get_page(n)` is forgiving: a non-number -> page 1, but ANY out-of-range number (`<1` OR `>num_pages`) -> the LAST page, never raises — use in FBVs. `paginator.page(n)` is strict: raises `PageNotAnInteger`/`EmptyPage` — `ListView` uses this and converts to `Http404`.',
      'Offset pagination costs grow with depth: `LIMIT 20 OFFSET 9980` scans + discards ~10k rows, and `.count` is a full `COUNT(*)` per request. Fine for bounded lists; for deep/infinite/large lists use KEYSET (cursor) pagination — filter by "past the last row seen", O(1) per page, no COUNT (Module 8; DRF `CursorPagination`).',
      'Messages framework = a one-shot notification that survives POST-redirect-GET. `messages.success/info/warning/error/debug(request, "...")` queues it; the next rendered page pops it.',
      'Messages are CONSUMED ON ITERATION — reading `{% for m in messages %}` (or `get_messages()`) shows them once, then clears them after the response. A message added on a request that never renders the loop stays queued and can surprise a later page.',
      'Wiring: `django.contrib.messages` in `INSTALLED_APPS`, `MessageMiddleware` after `SessionMiddleware`, the `messages` context processor, and one `{% for message in messages %}` block in the base template. Storage: `FallbackStorage` (cookie -> session over ~2KB), `SessionStorage`, `CookieStorage`.',
      'Default message level is `INFO` (`DEBUG` dropped) — raise/lower with `MESSAGE_LEVEL` or `messages.set_level(request, ...)`. DRF APIs do NOT use messages — JSON clients carry status in the response body/code.',
    ],
    keyTakeawaysHi: [
      '`Paginator(queryset, per_page, orphans=0)` -> `.count` (ek `COUNT(*)`), `.num_pages`, `.page_range`. `.get_page(n)` -> ek `Page`. Queryset ko `.order_by(...)` KARNA chahिए (ek unique tiebreaker jaise `-id` ke saath) warna rows page boundaries ke paar shift hoती hain.',
      '`Page` (`page_obj`): iterable, `.number`, `.paginator`, `.has_next()`/`.has_previous()`, `.next_page_number()` (koi na ho toh raise — pehle guard karो), `.start_index()`/`.end_index()` (1-based).',
      '`paginator.get_page(n)` forgiving hai: ek non-number -> page 1, par KOI BHI range-se-bahar number (`<1` YA `>num_pages`) -> LAST page, kabhi raise nahi — FBVs mein istemal karो. `paginator.page(n)` strict hai: `PageNotAnInteger`/`EmptyPage` raise karता hai — `ListView` ise istemal karता hai aur `Http404` mein badalता hai.',
      'Offset pagination costs depth ke saath badhती hain: `LIMIT 20 OFFSET 9980` ~10k rows scan + discard karता hai, aur `.count` prati request ek poora `COUNT(*)` hai. Bounded lists ke liye theek; deep/infinite lists ke liye KEYSET pagination istemal karो — "dekhी last row se aage" se filter, prati page O(1), koi COUNT nahi (Module 8; DRF `CursorPagination`).',
      'Messages framework = ek one-shot notification jо POST-redirect-GET survive karता hai. `messages.success/info/warning/error/debug(request, "...")` ise queue karता hai; agla rendered page ise pop karता hai.',
      'Messages ITERATION PAR CONSUMED hote hain — `{% for m in messages %}` (ya `get_messages()`) padhna unhe ek baar dikhाता hai, phir response ke baad clear. Ek request par add kiya message jо kabhi loop render nahi karता queued rehта hai.',
      'Wiring: `django.contrib.messages` `INSTALLED_APPS` mein, `MessageMiddleware` `SessionMiddleware` ke baad, `messages` context processor, aur base template mein ek `{% for message in messages %}` block. Storage: `FallbackStorage`, `SessionStorage`, `CookieStorage`.',
      'Default message level `INFO` hai (`DEBUG` drop) — `MESSAGE_LEVEL` ya `messages.set_level(request, ...)` se badlो. DRF APIs messages istemal NAHI karती — JSON clients status response body/code mein le jाते hain.',
    ],
  },

  {
    slug: 'dj-csrf-and-view-security',
    title: 'CSRF Protection & View-Level Security',
    titleHi: 'CSRF Protection & View-Level Security',
    description: 'CSRF is an attack where another site makes an authenticated request on your user\'s behalf. Django blocks it by default with a per-session token that must accompany every unsafe request. Knowing exactly how the check works — and the handful of decorators around it — keeps you from disabling it wrongly.',
    descriptionHi: 'CSRF ek attack hai jahaan ek doosri site aapke user ki taraf se ek authenticated request banाती hai. Django ise default roop se ek per-session token se block karता hai jо har unsafe request ke saath aana chahिए. Check thीक kaise kaam karता hai — aur iske aas-paas ke kuch decorators — jaanna aapko ise galat tarike se disable karने se rokता hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 6,

    analogy: {
      en: '**A signed withdrawal slip that only your own bank\'s counter hands out.** Your browser automatically attaches your session cookie to every request to your bank\'s site — including a request triggered by a hidden form on `evil.com` that POSTs to `yourbank.com/transfer`. The cookie rides along, so from the server\'s side the request looks authenticated. That is CSRF. The defence: the bank also requires a withdrawal slip with a one-time code printed on it, and that slip is only available at the bank\'s own counter (embedded in pages served from `yourbank.com`). `evil.com` can make your browser send the cookie, but it cannot read a page from `yourbank.com` to copy the code (the same-origin policy stops it), so it cannot produce a valid slip. Django\'s version: a CSRF token is planted as both a cookie and a hidden form field (or header); `CsrfViewMiddleware` rejects any POST/PUT/PATCH/DELETE where the two do not match, or where the request claims an `Origin`/`Referer` that is not yours. Safe methods (GET, HEAD, OPTIONS) are exempt because they should not be changing anything anyway.',
      hi: '**Ek signed withdrawal slip jо sirf aapke apne bank ka counter deता hai.** Aapka browser automatically aapki session cookie ko aapke bank ki site par har request se attach karता hai — `evil.com` par ek chhupे form dwara trigger ki request sहित jо `yourbank.com/transfer` par POST karता hai. Cookie saath aati hai, toh server ki taraf se request authenticated dikhती hai. Wo CSRF hai. Bachaव: bank ek withdrawal slip bhi require karता hai jispar ek one-time code chhpा ho, aur wo slip sirf bank ke apne counter par uplabdh hai (`yourbank.com` se serve ki pages mein embedded). `evil.com` aapke browser ko cookie bhejने banा sakta hai, par ye code copy karने ke liye `yourbank.com` se ek page nahi padh sakta (same-origin policy ise rokती hai). Django ka version: ek CSRF token cookie aur ek hidden form field (ya header) dono ki tarah lagाya jाता hai; `CsrfViewMiddleware` kisi bhi POST/PUT/PATCH/DELETE ko reject karता hai jahaan dono match nahi karते. Safe methods (GET, HEAD, OPTIONS) chhoot hain.',
    },

    simple: `**What CSRF is**

\`\`\`
1. You log into bank.com -> browser stores a session cookie for bank.com
2. You visit evil.com (still logged into bank.com in another tab)
3. evil.com serves:  <form action="https://bank.com/transfer" method="POST">
                       <input name="to" value="attacker"><input name="amount" value="5000">
                     </form>  <script>document.forms[0].submit()</script>
4. Browser sends the POST to bank.com WITH your session cookie attached
5. Without CSRF protection, bank.com processes the transfer as you
\`\`\`

**Django's defence (on by default)**

\`\`\`python
# settings.py -- both present in startproject
MIDDLEWARE = [..., "django.middleware.csrf.CsrfViewMiddleware", ...]

# every unsafe request (POST/PUT/PATCH/DELETE) must carry a token that matches the CSRF cookie
\`\`\`

\`\`\`django
{# in a template form #}
<form method="post">
  {% csrf_token %}          {# renders <input type="hidden" name="csrfmiddlewaretoken" value="..."> #}
  ...
</form>
\`\`\`

\`\`\`javascript
// for fetch / AJAX -- send the token in a header
fetch("/api/thing/", {
  method: "POST",
  headers: {"X-CSRFToken": getCookie("csrftoken")},
  body: JSON.stringify(data),
})
\`\`\`

**The check (\`CsrfViewMiddleware.process_view\`)**

\`\`\`
if request.method in ("GET", "HEAD", "OPTIONS", "TRACE"):   -> skip (safe methods)
if view is @csrf_exempt:                                     -> skip
if HTTPS and Origin header present:  Origin must be in the trusted set (scheme + host)
   else fall back to Referer check for HTTPS
token from  request.POST["csrfmiddlewaretoken"]  OR  header  settings.CSRF_HEADER_NAME
must cryptographically match the token in the  csrftoken  cookie   -> else 403
\`\`\`

**The decorators**

\`\`\`python
from django.views.decorators.csrf import csrf_exempt, csrf_protect, ensure_csrf_cookie, requires_csrf_token

@csrf_exempt                 # skip the check -- ONLY for endpoints with their own auth (webhooks w/ signature)
def stripe_webhook(request): ...

@csrf_protect                # force the check even if middleware is disabled for this view
def sensitive(request): ...

@ensure_csrf_cookie          # guarantee the csrftoken cookie is set on the response
def spa_index(request): ...  # needed when the first page is rendered by JS and has no {% csrf_token %}
\`\`\`

\`\`\`
settings:
  CSRF_COOKIE_SECURE = True          # cookie only sent over HTTPS
  CSRF_COOKIE_HTTPONLY = False       # JS needs to read it for the header (default False, and that's OK)
  CSRF_TRUSTED_ORIGINS = ["https://app.example.com", "https://*.example.com"]   # for cross-subdomain / proxied
  CSRF_USE_SESSIONS = True           # store the token in the session instead of a cookie
  CSRF_HEADER_NAME = "HTTP_X_CSRFTOKEN"

related headers (Module 6 goes deeper):
  X-Frame-Options: DENY              # XFrameOptionsMiddleware -- anti-clickjacking, on by default
  SECURE_* settings, SameSite cookies
\`\`\``,

    simpleHi: `**CSRF kya hai**

\`\`\`
1. Aap bank.com mein log in karte ho -> browser bank.com ke liye ek session cookie store karta hai
2. Aap evil.com visit karte ho (doosre tab mein abhi bhi bank.com mein logged in)
3. evil.com serve karta hai:  <form action="https://bank.com/transfer" method="POST"> ...auto-submit
4. Browser POST ko bank.com par bhejta hai AAPKI session cookie attached ke saath
5. CSRF protection ke bina, bank.com transfer ko aap ki tarah process karta hai
\`\`\`

**Django ka bachaव (default on)**

\`\`\`python
MIDDLEWARE = [..., "django.middleware.csrf.CsrfViewMiddleware", ...]
# har unsafe request (POST/PUT/PATCH/DELETE) ko ek token le jana chahिए jо CSRF cookie se match kare
\`\`\`

\`\`\`django
<form method="post">
  {% csrf_token %}          {# <input type="hidden" name="csrfmiddlewaretoken" value="..."> render karta hai #}
  ...
</form>
\`\`\`

\`\`\`javascript
// fetch / AJAX ke liye -- token ek header mein bhejो
fetch("/api/thing/", {
  method: "POST",
  headers: {"X-CSRFToken": getCookie("csrftoken")},
  body: JSON.stringify(data),
})
\`\`\`

**Check (\`CsrfViewMiddleware.process_view\`)**

\`\`\`
if request.method in ("GET", "HEAD", "OPTIONS", "TRACE"):   -> skip (safe methods)
if view is @csrf_exempt:                                     -> skip
if HTTPS and Origin header present:  Origin trusted set mein hona chahिए
token  request.POST["csrfmiddlewaretoken"]  YA  header  se
csrftoken  cookie ke token se cryptographically match hona chahिए   -> warna 403
\`\`\`

**Decorators**

\`\`\`python
from django.views.decorators.csrf import csrf_exempt, csrf_protect, ensure_csrf_cookie

@csrf_exempt                 # check skip -- SIRF apni auth waale endpoints ke liye (signature waale webhooks)
def stripe_webhook(request): ...

@csrf_protect                # check force karो
def sensitive(request): ...

@ensure_csrf_cookie          # guarantee ki csrftoken cookie response par set hai
def spa_index(request): ...  # tab chahिए jab pehla page JS render karता hai
\`\`\`

\`\`\`
settings:
  CSRF_COOKIE_SECURE = True
  CSRF_TRUSTED_ORIGINS = ["https://app.example.com", "https://*.example.com"]
  CSRF_USE_SESSIONS = True
  CSRF_HEADER_NAME = "HTTP_X_CSRFTOKEN"

related headers (Module 6 gehरा jाता hai):
  X-Frame-Options: DENY              # anti-clickjacking, default on
  SECURE_* settings, SameSite cookies
\`\`\``,

    content: `## The attack

CSRF (Cross-Site Request Forgery) exploits **ambient authority**: the browser attaches your cookies to *every* request to a domain, regardless of which site initiated the request. So a page on \`evil.com\` can contain a form (or an image, or a \`fetch\`) that targets \`yourapp.com/account/delete\`, and when your logged-in browser sends it, your session cookie goes too. The server sees an authenticated request and acts on it. The user never consented — they just visited the wrong page while logged in.

CSRF only matters for **state-changing** requests (POST, PUT, PATCH, DELETE). GET should never change state (lesson 1), so GET is not protected.

## Django's token check

\`CsrfViewMiddleware\` (in the default \`MIDDLEWARE\`) runs \`process_view\` before every view:

1. **Safe methods** (\`GET\`, \`HEAD\`, \`OPTIONS\`, \`TRACE\`) — skip.
2. **\`@csrf_exempt\` view** — skip.
3. **Origin/Referer check** — on HTTPS, if an \`Origin\` header is present it must match the request host or an entry in \`CSRF_TRUSTED_ORIGINS\`; otherwise the \`Referer\` must be same-origin (or trusted). This blocks the attack even before the token, and is why \`CSRF_TRUSTED_ORIGINS\` matters behind a proxy or across subdomains.
4. **Token match** — the request must present a CSRF token, either as the \`csrfmiddlewaretoken\` POST field or in the header named by \`CSRF_HEADER_NAME\` (default \`X-CSRFToken\`). It is compared against the token stored in the \`csrftoken\` cookie (or the session if \`CSRF_USE_SESSIONS=True\`). The tokens are masked with a random salt per render, so two valid tokens look different but both verify — this defeats a BREACH-style attack.

Fail any of steps 3-4 -> \`403 Forbidden\` with the \`CSRF_FAILURE_VIEW\` page.

## Getting the token into the request

- **A Django template form** — \`{% csrf_token %}\` inside \`<form method="post">\` renders the hidden input. Requires the form to be rendered by a view whose response also sets the \`csrftoken\` cookie (which happens automatically when \`{% csrf_token %}\` is used, or via \`@ensure_csrf_cookie\`).
- **AJAX / \`fetch\`** — read the \`csrftoken\` cookie in JS and send it as the \`X-CSRFToken\` header. Django's docs ship a \`getCookie\` helper. For same-origin \`fetch\`, also set \`credentials: "same-origin"\`.
- **A JS-rendered SPA served by Django** — the initial HTML has no \`{% csrf_token %}\`, so decorate the index view with \`@ensure_csrf_cookie\` to guarantee the cookie is planted; the SPA then reads it for every mutating call.

## The decorators

- **\`@csrf_exempt\`** — disables the check for one view. Legitimate only when the endpoint has its **own** request authentication that a cross-site attacker cannot forge: a webhook that verifies an HMAC signature, an API using token/JWT auth in an \`Authorization\` header (a browser will not attach that automatically, so CSRF does not apply). Never use it just to make a form "work".
- **\`@csrf_protect\`** — forces the check on a view even if middleware is removed. Belt-and-braces for a critical endpoint.
- **\`@ensure_csrf_cookie\`** — forces the response to include the \`csrftoken\` cookie even if the view does not render a token. For SPA bootstrap pages.
- **\`@requires_csrf_token\`** — runs the token *processing* (so \`{% csrf_token %}\` works in the template) but does **not** reject on failure. Rare; for custom error views.

## DRF and CSRF

- **SessionAuthentication** (browsable API, cookie-based) — CSRF **is** enforced by DRF, using the same middleware machinery. Your JS must send \`X-CSRFToken\`.
- **TokenAuthentication / JWT** (\`Authorization: Bearer ...\`) — **not** subject to CSRF, because the browser does not attach an \`Authorization\` header on a cross-site request; the attacker cannot supply it. DRF skips the CSRF check for these.

## Related view-security headers (Module 6 expands)

- **\`X-Frame-Options: DENY\`** (via \`XFrameOptionsMiddleware\`, on by default) — stops your pages being embedded in an \`<iframe>\` on another site (clickjacking). \`@xframe_options_exempt\` / \`@xframe_options_sameorigin\` per view.
- **\`SameSite\` cookies** (\`SESSION_COOKIE_SAMESITE = "Lax"\` default) — the browser will not send the cookie on a cross-site POST, which mitigates CSRF at the cookie layer. Defence in depth, not a replacement for the token.
- **\`SECURE_*\`** settings (HSTS, SSL redirect, secure cookies) and \`manage.py check --deploy\` — Module 6.

## The rule

Leave CSRF protection on. Use \`{% csrf_token %}\` in every form and \`X-CSRFToken\` in every AJAX mutation. Reach for \`@csrf_exempt\` only when the endpoint authenticates the request itself in a way that is immune to cross-site forgery, and write a comment saying why.`,

    contentHi: `## Attack

CSRF (Cross-Site Request Forgery) **ambient authority** exploit karता hai: browser aapki cookies ko ek domain par *har* request se attach karता hai, chahे kisi bhi site ne request initiate ki ho. Toh \`evil.com\` par ek page ek form (ya ek image, ya ek \`fetch\`) rakh sakta hai jо \`yourapp.com/account/delete\` ko target karता hai, aur jab aapka logged-in browser ise bhejता hai, aapki session cookie bhi jाती hai. Server ek authenticated request dekhता hai aur uspar act karता hai.

CSRF sirf **state-changing** requests (POST, PUT, PATCH, DELETE) ke liye maayne rakhता hai. GET ko kabhi state nahi badलना chahिए (lesson 1), toh GET protected nahi hai.

## Django ka token check

\`CsrfViewMiddleware\` har view se pehle \`process_view\` chalाता hai:

1. **Safe methods** (\`GET\`, \`HEAD\`, \`OPTIONS\`, \`TRACE\`) — skip.
2. **\`@csrf_exempt\` view** — skip.
3. **Origin/Referer check** — HTTPS par, agar ek \`Origin\` header maujूd hai toh ye request host ya \`CSRF_TRUSTED_ORIGINS\` mein ek entry se match hona chahिए. Ye token se pehle bhi attack block karता hai.
4. **Token match** — request ko ek CSRF token present karna chahिए, ya \`csrfmiddlewaretoken\` POST field ke roop mein ya \`CSRF_HEADER_NAME\` (default \`X-CSRFToken\`) naam ke header mein. Ye \`csrftoken\` cookie mein store token se compare hoता hai. Tokens prati render ek random salt se masked hote hain.

Steps 3-4 mein se koi fail -> \`403 Forbidden\`.

## Token ko request mein le jाना

- **Ek Django template form** — \`<form method="post">\` ke andar \`{% csrf_token %}\` hidden input render karता hai.
- **AJAX / \`fetch\`** — JS mein \`csrftoken\` cookie padhо aur ise \`X-CSRFToken\` header ke roop mein bhejो.
- **Ek JS-rendered SPA jо Django serve karता hai** — initial HTML mein koi \`{% csrf_token %}\` nahi, toh index view ko \`@ensure_csrf_cookie\` se decorate karो.

## Decorators

- **\`@csrf_exempt\`** — ek view ke liye check disable karता hai. Sirf tab legitimate jab endpoint ki apni request authentication ho jise ek cross-site attacker forge nahi kar sakta: ek webhook jо ek HMAC signature verify karता hai, ek API jо ek \`Authorization\` header mein token/JWT auth istemal karता hai. Kabhi ise sirf ek form "kaam" karाने ke liye istemal mat karो.
- **\`@csrf_protect\`** — ek view par check force karता hai.
- **\`@ensure_csrf_cookie\`** — response ko \`csrftoken\` cookie include karने ko force karता hai. SPA bootstrap pages ke liye.

## DRF aur CSRF

- **SessionAuthentication** (cookie-based) — CSRF DRF dwara **enforced** hai. Aapka JS \`X-CSRFToken\` bhejना chahिए.
- **TokenAuthentication / JWT** (\`Authorization: Bearer ...\`) — CSRF ke **adhीन nahi**, kyunki browser ek cross-site request par ek \`Authorization\` header attach nahi karता.

## Related view-security headers (Module 6 vistाr karता hai)

- **\`X-Frame-Options: DENY\`** — aapke pages ko ek doosri site par ek \`<iframe>\` mein embed hone se rokता hai (clickjacking).
- **\`SameSite\` cookies** (\`SESSION_COOKIE_SAMESITE = "Lax"\` default) — browser ek cross-site POST par cookie nahi bhejेga.
- **\`SECURE_*\`** settings aur \`manage.py check --deploy\` — Module 6.

## Niyam

CSRF protection on chhod do. Har form mein \`{% csrf_token %}\` aur har AJAX mutation mein \`X-CSRFToken\` istemal karो. \`@csrf_exempt\` ke liye sirf tab pahुँcho jab endpoint request ko khud aise authenticate karता hai jо cross-site forgery se immune hai, aur ek comment likhо kyun.`,

    examples: [
      {
        title: 'CSRF: a POST without a token is 403; with a valid token it passes',
        titleHi: 'CSRF: bina token ke ek POST 403 hai; ek valid token ke saath pass hoता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], USE_TZ=True, TEMPLATES=[{"BACKEND":
        "django.template.backends.django.DjangoTemplates", "DIRS": [], "APP_DIRS": False,
        "OPTIONS": {"context_processors": [], "loaders": [
            ("django.template.loaders.locmem.Loader",
             {"f.html": "<form method='post'>{% csrf_token %}</form>"})]}}],
    MIDDLEWARE=["django.middleware.csrf.CsrfViewMiddleware"])
django.setup()

from django.http import JsonResponse
from django.shortcuts import render
from django.urls import path
from django.test import Client
import re

def form_page(request):
    return render(request, "f.html")          # sets the csrftoken cookie + hidden input

def transfer(request):
    return JsonResponse({"ok": True, "method": request.method})

urlpatterns = [path("form/", form_page), path("transfer/", transfer)]

# enforce_csrf_checks=True makes the test client behave like a real browser
c = Client(enforce_csrf_checks=True)

# 1. POST with no token -> 403
print("no token:", c.post("/transfer/").status_code)

# 2. GET the form page, scrape the token, POST with it -> 200
html = c.get("/form/").content.decode()
token = re.search(r'value="([^"]+)"', html).group(1)
r = c.post("/transfer/", {"csrfmiddlewaretoken": token})
print("with form token:", r.status_code, r.json())

# 3. send it as the X-CSRFToken header instead (AJAX style)
r2 = c.post("/transfer/", data="{}", content_type="application/json",
            headers={"x-csrftoken": token})
print("with header token:", r2.status_code, r2.json())

# 4. a GET is never checked
print("GET (safe method):", c.get("/transfer/").status_code)`,
        output: `no token: 403
with form token: 200 {'ok': True, 'method': 'POST'}
with header token: 200 {'ok': True, 'method': 'POST'}
GET (safe method): 200
`,
        explain: '`Client(enforce_csrf_checks=True)` makes the test client behave like a real browser (the default client bypasses CSRF). A bare `POST /transfer/` has no token -> `CsrfViewMiddleware` returns `403`. Rendering `f.html` with `{% csrf_token %}` sets the `csrftoken` cookie and puts the masked token in a hidden input; sending that value back as the `csrfmiddlewaretoken` POST field -> `200`. The same value works when sent as the `X-CSRFToken` header instead (the AJAX path — the middleware checks the header when the body is not form-encoded). A `GET` is a safe method and is never checked.',
        explainHi: '`Client(enforce_csrf_checks=True)` test client ko ek asli browser ki tarah banata hai (default client CSRF bypass karta hai). Ek khali `POST /transfer/` ke paas koi token nahi -> `CsrfViewMiddleware` `403` lautata hai. `{% csrf_token %}` ke saath `f.html` render karna `csrftoken` cookie set karta hai aur masked token ko ek hidden input mein daalta hai; us value ko `csrfmiddlewaretoken` POST field ki tarah wapas bhejna -> `200`. Wahi value `X-CSRFToken` header ki tarah bhejने par kaam karti hai (AJAX path). Ek `GET` ek safe method hai aur kabhi check nahi hota.',
      },
      {
        title: 'csrf_exempt skips the check; ensure_csrf_cookie plants the cookie',
        titleHi: 'csrf_exempt check skip karता hai; ensure_csrf_cookie cookie lagाता hai',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__, ALLOWED_HOSTS=["*"],
    INSTALLED_APPS=[], USE_TZ=True, TEMPLATES=[],
    MIDDLEWARE=["django.middleware.csrf.CsrfViewMiddleware"])
django.setup()

from django.http import JsonResponse, HttpResponse
from django.urls import path
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.test import Client

@csrf_exempt
def webhook(request):
    # a real webhook would verify an HMAC signature header here -- THAT is its auth
    return JsonResponse({"received": True})

def normal_post(request):
    return JsonResponse({"ok": True})

@ensure_csrf_cookie
def spa_index(request):
    return HttpResponse("<div id='app'></div>")   # no {% csrf_token %}, but cookie is set

urlpatterns = [
    path("webhook/", webhook),
    path("normal/", normal_post),
    path("app/", spa_index),
]

c = Client(enforce_csrf_checks=True)

print("csrf_exempt webhook, no token:", c.post("/webhook/").status_code, "(passes)")
print("normal view, no token:", c.post("/normal/").status_code, "(403)")

resp = c.get("/app/")
print("spa_index sets csrftoken cookie:", "csrftoken" in resp.cookies)
# the SPA can now read that cookie and send X-CSRFToken on its POSTs
token = resp.cookies["csrftoken"].value
r = c.post("/normal/", headers={"x-csrftoken": token})
print("SPA POST with the planted token:", r.status_code)`,
        output: `csrf_exempt webhook, no token: 200 (passes)
normal view, no token: 403 (403)
spa_index sets csrftoken cookie: True
SPA POST with the planted token: 200
`,
        explain: '`@csrf_exempt` removes the check for `webhook` — a tokenless POST returns `200` (a real webhook would authenticate by verifying the provider\'s HMAC signature; the exemption is only safe *because* of that). `normal_post` keeps the check, so a tokenless POST is `403`. `spa_index` renders no `{% csrf_token %}`, but `@ensure_csrf_cookie` forces the `csrftoken` cookie onto the response — so a JavaScript SPA whose first page is that HTML can read the cookie and send `X-CSRFToken` on every mutating call, which is what the final `200` shows.',
        explainHi: '`@csrf_exempt` `webhook` ke liye check hata deta hai — ek tokenless POST `200` lautata hai (ek asli webhook provider ki HMAC signature verify karke authenticate karega; exemption sirf *isliए* surakshit hai). `normal_post` check rakhta hai, toh ek tokenless POST `403` hai. `spa_index` koi `{% csrf_token %}` render nahi karta, par `@ensure_csrf_cookie` `csrftoken` cookie ko response par force karta hai — toh ek JavaScript SPA jiska pehla page wo HTML hai cookie padh sakta hai aur har mutating call par `X-CSRFToken` bhej sakta hai.',
      },
      {
        title: 'The Origin/Referer check and CSRF_TRUSTED_ORIGINS',
        titleHi: 'Origin/Referer check aur CSRF_TRUSTED_ORIGINS',
        code: `import django
from django.conf import settings
settings.configure(DEBUG=True, SECRET_KEY="x", ROOT_URLCONF=__name__,
    ALLOWED_HOSTS=["app.example.com"], USE_TZ=True, TEMPLATES=[],
    CSRF_TRUSTED_ORIGINS=["https://app.example.com", "https://admin.example.com"],
    MIDDLEWARE=["django.middleware.csrf.CsrfViewMiddleware"])
django.setup()

from django.http import JsonResponse
from django.urls import path
from django.middleware.csrf import get_token
from django.test import RequestFactory
from django.views.decorators.csrf import csrf_protect

@csrf_protect
def save(request):
    return JsonResponse({"ok": True})

urlpatterns = [path("save/", save)]

rf = RequestFactory()

def try_post(origin):
    # build a request with a matching cookie+token, vary only the Origin header
    get_req = rf.get("/save/", secure=True)
    token = get_token(get_req)                      # a valid token
    req = rf.post("/save/", {"csrfmiddlewaretoken": token}, secure=True,
                  HTTP_HOST="app.example.com")
    req.COOKIES["csrftoken"] = get_req.META["CSRF_COOKIE"]
    if origin is not None:
        req.META["HTTP_ORIGIN"] = origin
    resp = save(req)
    return resp.status_code

print("Origin https://app.example.com (self):", try_post("https://app.example.com"))
print("Origin https://admin.example.com (trusted):", try_post("https://admin.example.com"))
print("Origin https://evil.com (attacker):", try_post("https://evil.com"))
print("Origin https://app.example.com.evil.com (lookalike):",
      try_post("https://app.example.com.evil.com"))`,
        output: `Origin https://app.example.com (self): 200
Origin https://admin.example.com (trusted): 200
Origin https://evil.com (attacker): 403
Origin https://app.example.com.evil.com (lookalike): 403
`,
        explain: 'Every request here carries a matching `csrftoken` cookie and token — only the `Origin` header varies. On HTTPS, `CsrfViewMiddleware` first checks that `Origin` exactly equals the request host or an entry in `CSRF_TRUSTED_ORIGINS` (scheme included). The site\'s own origin and the explicitly trusted `admin.example.com` pass; `evil.com` fails; and `app.example.com.evil.com` fails too — it is a different host, and the check is exact-match, not "endswith". This Origin check blocks a cross-site POST *before* the token is even compared, which is why `CSRF_TRUSTED_ORIGINS` must list every real front-end origin when you run behind a proxy or across subdomains.',
        explainHi: 'Yahaan har request ek matching `csrftoken` cookie aur token le jati hai — sirf `Origin` header badalta hai. HTTPS par, `CsrfViewMiddleware` pehle check karta hai ki `Origin` bilkul request host ya `CSRF_TRUSTED_ORIGINS` mein ek entry ke barabar hai (scheme sहित). Site ka apna origin aur explicitly trusted `admin.example.com` pass; `evil.com` fail; aur `app.example.com.evil.com` bhi fail — ye ek alag host hai, aur check exact-match hai, "endswith" nahi. Ye Origin check ek cross-site POST ko token compare hone se *pehle* block karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `@csrf_exempt                       # "the form kept giving 403, this fixed it"
def update_settings(request):
    request.user.profile.theme = request.POST["theme"]
    request.user.profile.save()`,
        right: `def update_settings(request):      # keep CSRF on; put {% csrf_token %} in the form
    request.user.profile.theme = request.POST["theme"]
    request.user.profile.save()
# template:  <form method="post">{% csrf_token %} ... </form>
# or for fetch:  headers: {"X-CSRFToken": getCookie("csrftoken")}`,
        why: '`@csrf_exempt` on a cookie-authenticated, state-changing view re-opens the exact hole CSRF protection closes — now `evil.com` can flip this user\'s settings, and on a more sensitive view, transfer money or change an email. The 403 means the token is missing from the request; the fix is to include it (`{% csrf_token %}` or the header), never to remove the check. `@csrf_exempt` is only for endpoints whose auth does not rely on the ambient cookie.',
        whyHi: 'Ek cookie-authenticated, state-changing view par `@csrf_exempt` bilkul wo hole phir kholता hai jо CSRF protection band karता hai — ab `evil.com` is user ki settings flip kar sakta hai. 403 ka matlab token request se missing hai; fix ise include karna hai (`{% csrf_token %}` ya header), kabhi check hataना nahi.',
      },
      {
        wrong: `// SPA fetch that keeps getting 403 on POST
fetch("/api/save/", {method: "POST", body: JSON.stringify(data)})
// no X-CSRFToken header, and maybe no csrftoken cookie was ever set`,
        right: `function getCookie(name) {
  return document.cookie.split("; ").find(r => r.startsWith(name + "="))?.split("=")[1];
}
fetch("/api/save/", {
  method: "POST",
  credentials: "same-origin",
  headers: {"Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken")},
  body: JSON.stringify(data),
});
// and the page that bootstraps the SPA must be @ensure_csrf_cookie`,
        why: 'For AJAX, Django expects the token in the `X-CSRFToken` header (it cannot be in the JSON body — the middleware only reads `request.POST` for form-encoded data). Two things must be true: the `csrftoken` cookie exists (guaranteed by `{% csrf_token %}` on a rendered form, or `@ensure_csrf_cookie` on the SPA index), and every mutating `fetch` copies it into the header. Missing either gives a 403.',
        whyHi: 'AJAX ke liye, Django token ko `X-CSRFToken` header mein expect karता hai (ye JSON body mein nahi ho sakta — middleware sirf form-encoded data ke liye `request.POST` padhता hai). Do cheezein sach honi chahिए: `csrftoken` cookie maujूd hai (`@ensure_csrf_cookie` se guaranteed), aur har mutating `fetch` ise header mein copy karता hai.',
      },
      {
        wrong: `# behind an HTTPS load balancer / reverse proxy
# forms started returning 403 "Origin checking failed" after moving to prod
# settings.py has no CSRF_TRUSTED_ORIGINS`,
        right: `# settings.py
CSRF_TRUSTED_ORIGINS = ["https://app.example.com", "https://www.example.com"]
# if the proxy terminates TLS, also:
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True`,
        why: 'On HTTPS, Django checks that the request\'s `Origin` header matches its own host or an entry in `CSRF_TRUSTED_ORIGINS` (scheme included). Behind a proxy or with multiple domains/subdomains, the `Origin` the browser sends may not exactly equal what Django thinks its host is, so you must list the real public origins explicitly. This is a deployment-config issue, not a reason to disable CSRF — and `CSRF_TRUSTED_ORIGINS` requires the scheme (`https://`) since Django 4.0.',
        whyHi: 'HTTPS par, Django check karता hai ki request ka `Origin` header iske apne host ya `CSRF_TRUSTED_ORIGINS` mein ek entry se match kare (scheme sहित). Ek proxy ke peeche ya kai domains ke saath, browser jо `Origin` bhejता hai wo Django jо sochता hai iska host hai uske barabar nahi ho sakta, toh aapko asli public origins explicitly list karna hoga. Ye ek deployment-config issue hai, CSRF disable karने ka kाran nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Webhook endpoints are the canonical legitimate `@csrf_exempt`** — Stripe, GitHub, Twilio POST to your URL with no CSRF token (they are not a browser). The endpoint is `@csrf_exempt` AND verifies the provider\'s HMAC signature header on the raw body; the signature is the real auth. A `@csrf_exempt` with no alternative auth is a bug.',
        hi: '**Webhook endpoints canonical legitimate `@csrf_exempt` hain** — Stripe, GitHub bina CSRF token ke aapke URL par POST karते hain. Endpoint `@csrf_exempt` hai AUR provider ki HMAC signature header verify karता hai; signature asli auth hai.',
      },
      {
        en: '**SPA + Django backend: the index view is `@ensure_csrf_cookie`, the API client sends `X-CSRFToken`** — or the team switches the API to `Authorization: Bearer` token auth (DRF), which sidesteps CSRF entirely because the browser never auto-attaches that header cross-site. The choice drives whether CSRF is even in the picture.',
        hi: '**SPA + Django backend: index view `@ensure_csrf_cookie` hai, API client `X-CSRFToken` bhejता hai** — ya team API ko `Authorization: Bearer` token auth (DRF) par switch karती hai, jо CSRF ko poori tarah sidestep karता hai.',
      },
      {
        en: '**`CSRF_TRUSTED_ORIGINS` + `SECURE_PROXY_SSL_HEADER` is standard deployment boilerplate** behind nginx/ALB/Cloudflare — the first CSRF 403 in staging after adding TLS termination is almost always a missing trusted origin or proxy header, checked by `manage.py check --deploy` (Module 6, Module 10).',
        hi: '**`CSRF_TRUSTED_ORIGINS` + `SECURE_PROXY_SSL_HEADER` standard deployment boilerplate hai** nginx/ALB/Cloudflare ke peeche — TLS termination add karने ke baad staging mein pehla CSRF 403 lगbhag hamesha ek missing trusted origin ya proxy header hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain CSRF and how Django\'s token-based protection stops it.',
        qHi: 'CSRF samjhाओ aur Django ki token-based protection ise kaise rokती hai.',
        a: 'CSRF, cross-site request forgery, abuses the fact that browsers attach a site\'s cookies to every request to that site, no matter which page triggered the request. If a user is logged into your app and then visits a malicious page, that page can contain a form or a script that POSTs to your app\'s money-transfer or delete-account or change-email endpoint. The browser dutifully attaches the user\'s session cookie, so on the server the request looks fully authenticated, and without a defence the action goes through. The user never intended it. Note this only concerns state-changing methods; GET is supposed to be side-effect-free so it is not protected. Django\'s defence is a secret token that the attacker cannot obtain. On rendering a page, Django sets a csrftoken value both in a cookie and, via the csrf_token template tag, in a hidden field inside every form — or the same value is read from the cookie by JavaScript and sent as an X-CSRFToken header for AJAX. CsrfViewMiddleware, which is in the default middleware list, intercepts every unsafe request before the view runs and requires two things. First, on HTTPS it checks the Origin header, or falls back to Referer, against the current host plus the CSRF_TRUSTED_ORIGINS list, which rejects an obvious cross-site request outright. Second, it requires the token from the form field or header to cryptographically match the token in the cookie. The malicious page can make the browser send the cookie, but it cannot read a response from your origin to learn the token value — the same-origin policy forbids that — so it cannot populate the form field or the header, and the match fails with a 403. The tokens are also masked with a per-request random salt so they differ each render, which prevents a compression-oracle attack from recovering them. The practical requirements are: keep the middleware enabled, put csrf_token in every form, send X-CSRFToken on every mutating fetch, and use ensure_csrf_cookie on a page that is rendered by JavaScript and has no server-rendered form.',
        aHi: 'CSRF, cross-site request forgery, is tathya ka durupयोग karता hai ki browsers ek site ki cookies ko us site par har request se attach karते hain, chahे kisi bhi page ne request trigger ki ho. Agar ek user aapke app mein logged in hai aur phir ek malicious page visit karता hai, wo page ek form ya ek script rakh sakta hai jо aapke app ke money-transfer ya delete-account endpoint par POST karता hai. Browser imaandari se user ki session cookie attach karता hai, toh server par request poori tarah authenticated dikhती hai. Ye sirf state-changing methods se sambandhit hai; GET protected nahi hai. Django ka bachaव ek secret token hai jо attacker prाpt nahi kar sakta. Ek page render karने par, Django ek csrftoken value cookie mein aur, csrf_token template tag ke zariye, har form ke andar ek hidden field mein set karता hai — ya wahi value JS dwara cookie se padhी jाती hai aur AJAX ke liye ek X-CSRFToken header ke roop mein bhejी jाती hai. CsrfViewMiddleware har unsafe request ko view chalने se pehle intercept karता hai aur do cheezein require karता hai. Pehle, HTTPS par ye Origin header check karता hai current host plus CSRF_TRUSTED_ORIGINS list ke khilाf. Doosra, ye form field ya header se token ko cookie mein token se cryptographically match hone ki maang karता hai. Malicious page cookie bhej sakta hai, par ye aapके origin se ek response nahi padh sakta token value seekhने ko — same-origin policy ise mana karती hai.',
      },
      {
        q: 'When is `@csrf_exempt` appropriate, and why do token-authenticated DRF endpoints not need CSRF protection?',
        qHi: '`@csrf_exempt` kab uचित hai, aur token-authenticated DRF endpoints ko CSRF protection kyun nahi chahिए?',
        a: 'The whole reason CSRF protection exists is that browsers automatically attach cookies to cross-site requests, giving an attacker ambient authority they did not earn. So @csrf_exempt is appropriate exactly when the endpoint\'s authentication does not depend on that ambient cookie — when a cross-site attacker, even with the victim\'s browser, cannot forge a valid authenticated request. The clearest case is a webhook. A payment provider or a source-control host POSTs events to your URL; it is not a browser, it has no session cookie, and it authenticates by signing the request body with a shared secret and putting the signature in a header. You mark that view @csrf_exempt because there is no token and no cookie in play, and you verify the HMAC signature yourself — that is the real authentication, and an attacker without the secret cannot produce it. The other case is an API authenticated by a token or JWT sent in the Authorization header. Browsers do not automatically attach an Authorization header to cross-site requests the way they do cookies; the attacker\'s page has no way to add it, because it cannot read the token from your origin. So a request authenticated purely by that header is already immune to CSRF, and enforcing a CSRF token on top would be pointless. This is exactly why DRF\'s TokenAuthentication and JWT classes skip the CSRF check, while its SessionAuthentication — which does rely on the cookie — keeps CSRF enforcement on and requires the X-CSRFToken header from browser clients. What is never appropriate is reaching for @csrf_exempt because a form or a fetch is returning 403. That 403 means the token is missing or not matching, and the fix is to send it — csrf_token in the form, X-CSRFToken on the fetch, ensure_csrf_cookie on the bootstrap page. Exempting a cookie-authenticated state-changing view re-opens the vulnerability completely.',
        aHi: 'CSRF protection maujूd hone ka poora kाран ye hai ki browsers automatically cookies ko cross-site requests se attach karते hain, ek attacker ko ambient authority dete hue. Toh @csrf_exempt bilkul tab uचित hai jab endpoint ka authentication us ambient cookie par nirbhar nahi karता — jab ek cross-site attacker, victim ke browser ke saath bhi, ek valid authenticated request forge nahi kar sakta. Sabse saaf case ek webhook hai. Ek payment provider aapके URL par events POST karता hai; ye ek browser nahi hai, iske paas koi session cookie nahi, aur ye request body ko ek shared secret se sign karके authenticate karता hai aur signature ko ek header mein daalता hai. Aap us view ko @csrf_exempt mark karते ho aur aap HMAC signature khud verify karते ho — wo asli authentication hai. Doosra case ek API hai jо Authorization header mein bheje gaye ek token ya JWT se authenticated hai. Browsers automatically ek Authorization header ko cross-site requests se attach nahi karते jaise wo cookies karते hain; attacker ka page ise add nahi kar sakta. Toh us header se purely authenticated ek request pehle se CSRF se immune hai. Isiliye DRF ka TokenAuthentication CSRF check skip karता hai, jabki iska SessionAuthentication CSRF enforcement on rakhता hai. Jо kabhi uचित nahi hai wo @csrf_exempt ke liye pahुँchना hai kyunki ek form 403 lauta raha hai.',
      },
    ],

    exercises: [
      {
        task: 'Boot standalone Django with only `CsrfViewMiddleware` and a `locmem` template `"<form method=\'post\'>{% csrf_token %}</form>"`. Views: `form_page` (renders it) and `act` (returns JSON). Using `Client(enforce_csrf_checks=True)`: (a) POST `/act/` with no token -> assert 403; (b) GET `/form/`, regex the token out of the HTML, POST `/act/` with `csrfmiddlewaretoken` -> assert 200; (c) POST again sending the token as the `x-csrftoken` header -> assert 200; (d) GET `/act/` -> assert 200 (safe method, unchecked).',
        taskHi: 'Standalone Django boot karो sirf `CsrfViewMiddleware` aur ek `locmem` template ke saath. Views: `form_page`, `act`. `Client(enforce_csrf_checks=True)` se: (a) bina token POST -> 403; (b) token scrape karके POST -> 200; (c) header ke roop mein token -> 200; (d) GET -> 200.',
        hint: '`Client(enforce_csrf_checks=True)` is the key — the default test client bypasses CSRF. `re.search(r\'value="([^"]+)"\', html)`. Header form: `c.post(url, headers={"x-csrftoken": token})`.',
        hintHi: '`Client(enforce_csrf_checks=True)` key hai — default test client CSRF bypass karता hai. `re.search(r\'value="([^"]+)"\', html)`.',
      },
      {
        task: 'Show the three decorators. `webhook` (`@csrf_exempt`) returns 200 on a POST with no token. `strict` (a normal view) returns 403 on a POST with no token. `boot` (`@ensure_csrf_cookie`) returns plain HTML; assert `"csrftoken" in response.cookies` after a GET, then use that cookie value as the `x-csrftoken` header on a POST to `strict` and assert 200.',
        taskHi: 'Teen decorators dikhाओ. `webhook` (`@csrf_exempt`), `strict` (normal), `boot` (`@ensure_csrf_cookie`). Assert karो `"csrftoken" in response.cookies`, phir us cookie value ko `strict` par POST ke liye `x-csrftoken` header ki tarah istemal karो.',
        hint: '`from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie`. `resp.cookies["csrftoken"].value`. `Client(enforce_csrf_checks=True)`.',
        hintHi: '`from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie`. `resp.cookies["csrftoken"].value`.',
      },
      {
        task: 'Test the Origin check. Configure `CSRF_TRUSTED_ORIGINS = ["https://app.example.com", "https://admin.example.com"]` and `ALLOWED_HOSTS = ["app.example.com"]`. Using `RequestFactory` with `secure=True` and `HTTP_HOST="app.example.com"`, build POSTs with a matching cookie+token but different `HTTP_ORIGIN` values: the host itself, a trusted origin, `https://evil.com`, and `https://app.example.com.evil.com`. Call a `@csrf_protect` view directly and assert 200 / 200 / 403 / 403.',
        taskHi: 'Origin check test karो. `CSRF_TRUSTED_ORIGINS` aur `ALLOWED_HOSTS` configure karो. `RequestFactory` se `secure=True` aur `HTTP_HOST` ke saath, matching cookie+token par alag `HTTP_ORIGIN` values ke saath POSTs banाओ. `@csrf_protect` view seedhे call karके 200/200/403/403 assert karो.',
        hint: '`from django.middleware.csrf import get_token`. Build a GET first, `get_token(get_req)` to obtain a valid token, copy `get_req.META["CSRF_COOKIE"]` into `req.COOKIES["csrftoken"]`. Set `req.META["HTTP_ORIGIN"]` per case.',
        hintHi: '`from django.middleware.csrf import get_token`. Pehle ek GET banाओ, `get_token(get_req)` se ek valid token, `get_req.META["CSRF_COOKIE"]` ko `req.COOKIES["csrftoken"]` mein copy karो.',
      },
    ],

    keyTakeaways: [
      'CSRF: because the browser auto-attaches your cookies to EVERY request to a domain, a form/script on `evil.com` can POST to `yourapp.com/...` as the logged-in user. Only STATE-CHANGING methods (POST/PUT/PATCH/DELETE) are at risk — GET must be side-effect-free, so it is unprotected.',
      'Django blocks it by default: `CsrfViewMiddleware` requires every unsafe request to carry a CSRF token (the `csrfmiddlewaretoken` POST field OR the `X-CSRFToken` header) that cryptographically matches the `csrftoken` cookie. `evil.com` can send the cookie but cannot READ your page to learn the token (same-origin policy) -> 403.',
      'On HTTPS there is also an Origin/Referer check against the host + `CSRF_TRUSTED_ORIGINS` (scheme required, e.g. `"https://app.example.com"`) — this is the usual cause of a post-deploy 403 behind a proxy (also needs `SECURE_PROXY_SSL_HEADER`).',
      'Get the token in: `{% csrf_token %}` inside `<form method="post">` for templates; read the `csrftoken` cookie and send `X-CSRFToken` for `fetch`/AJAX (it CANNOT be in the JSON body); `@ensure_csrf_cookie` on a JS-rendered SPA index so the cookie exists.',
      '`@csrf_exempt` = skip the check. ONLY legitimate when the endpoint has its own forgery-proof auth: a webhook verifying an HMAC signature, or `Authorization: Bearer` token auth (browser never auto-attaches that header cross-site). NEVER use it to silence a 403 on a cookie-authed form.',
      '`@csrf_protect` forces the check (belt-and-braces); `@requires_csrf_token` processes the token for templates without rejecting. `CSRF_USE_SESSIONS=True` stores the token in the session instead of a cookie.',
      'DRF: `SessionAuthentication` (cookie-based) ENFORCES CSRF — send `X-CSRFToken`. `TokenAuthentication`/JWT (`Authorization` header) is NOT subject to CSRF and DRF skips the check.',
      'Related (Module 6): `X-Frame-Options: DENY` (clickjacking, on by default), `SESSION_COOKIE_SAMESITE="Lax"` (defence in depth at the cookie layer), `SECURE_*` settings + `manage.py check --deploy`.',
    ],
    keyTakeawaysHi: [
      'CSRF: kyunki browser aapki cookies ko ek domain par HAR request se auto-attach karता hai, `evil.com` par ek form/script `yourapp.com/...` par logged-in user ki tarah POST kar sakta hai. Sirf STATE-CHANGING methods (POST/PUT/PATCH/DELETE) risk mein hain — GET side-effect-free hona chahिए.',
      'Django ise default block karता hai: `CsrfViewMiddleware` har unsafe request ko ek CSRF token le jाने ki maang karता hai (`csrfmiddlewaretoken` POST field YA `X-CSRFToken` header) jо `csrftoken` cookie se cryptographically match kare. `evil.com` cookie bhej sakta hai par aapका page nahi padh sakta token seekhने ko -> 403.',
      'HTTPS par ek Origin/Referer check bhi hai host + `CSRF_TRUSTED_ORIGINS` ke khilाf (scheme zaroori, jaise `"https://app.example.com"`) — ye ek proxy ke peeche post-deploy 403 ka aam kाран hai.',
      'Token andar le jाओ: templates ke liye `<form method="post">` ke andar `{% csrf_token %}`; `fetch`/AJAX ke liye `csrftoken` cookie padhо aur `X-CSRFToken` bhejो (ye JSON body mein NAHI ho sakta); ek JS-rendered SPA index par `@ensure_csrf_cookie`.',
      '`@csrf_exempt` = check skip. SIRF tab legitimate jab endpoint ki apni forgery-proof auth ho: ek webhook jо HMAC signature verify karता hai, ya `Authorization: Bearer` token auth. KABHI ise ek cookie-authed form par 403 chup karाने ke liye istemal mat karो.',
      '`@csrf_protect` check force karता hai; `@requires_csrf_token` templates ke liye token process karता hai bina reject kiye. `CSRF_USE_SESSIONS=True` token ko cookie ke bजाy session mein store karता hai.',
      'DRF: `SessionAuthentication` (cookie-based) CSRF ENFORCE karता hai — `X-CSRFToken` bhejो. `TokenAuthentication`/JWT (`Authorization` header) CSRF ke adhीन NAHI hai.',
      'Related (Module 6): `X-Frame-Options: DENY` (clickjacking, default on), `SESSION_COOKIE_SAMESITE="Lax"`, `SECURE_*` settings + `manage.py check --deploy`.',
    ],
  },
];
