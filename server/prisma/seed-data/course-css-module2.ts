/**
 * CSS & HTML Complete Course — Module 2: CSS Basics.
 *
 * The four things that cause almost every "why isn't my CSS working?" moment:
 * a selector that matches nothing, a more specific rule winning, a box that is
 * wider than you asked for, and a unit that does not scale.
 *
 * Writing rules (same as the rest of the course):
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example renders a real preview — a visual subject must be seen.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals. One stray backtick closes the literal early.
 */

import type { CourseLesson } from './course-js-module1';

/** Shared page chrome so every preview looks like a normal document. */
const page = (body: string, css = '') => `<!doctype html><html><head><meta charset="utf-8">
<style>
  body { font: 15px/1.5 system-ui, sans-serif; margin: 12px; color: #111; }
  ${css}
</style></head><body>${body}</body></html>`;

export const CSS_MODULE_2: CourseLesson[] = [
  /* ══════════════════════ Selectors ══════════════════════ */
  {
    slug: 'css-selectors',
    title: 'How CSS Finds Things',
    titleHi: 'CSS Cheezein Kaise Dhoondhta Hai',
    description: 'Calling someone in a crowd — by name, by uniform, or by where they are standing.',
    descriptionHi: 'Bheed mein kisi ko bulana — naam se, vardi se, ya wo kahan khada hai usse.',
    difficulty: 'EASY',
    duration: 30,
    order: 1,

    analogy: {
      en: '**Calling someone in a crowded hall.** You can shout a name ("Ravi!") and one person turns — that is an **id**. You can call a group ("everyone in a red shirt!") and many turn — that is a **class**. You can call by role ("all the waiters!") — that is an **element**. Or by position ("whoever is standing nearest the door") — that is a positional selector.',
      hi: '**Bheed bhare hall mein kisi ko bulana.** Aap naam pukar sakte ho ("Ravi!") aur ek vyakti mudta hai — wo **id** hai. Aap samooh ko bula sakte ho ("laal shirt wale sab!") aur kai mudte hain — wo **class** hai. Aap kaam se bula sakte ho ("saare waiter!") — wo **element** hai. Ya jagah se ("jo darwaze ke sabse paas khada hai") — wo positional selector hai.',
    },

    simple: `**A CSS rule has two halves**

\`\`\`css
p { color: blue; }
│   └──────────┘
│        └── declaration: what to change
└── selector: which elements
\`\`\`

**The three you will use constantly**

\`\`\`css
p          { }   /* every <p> on the page          — by role     */
.card      { }   /* every element with class="card" — by uniform */
#header    { }   /* the one element with id="header" — by name   */
\`\`\`

**Use classes for almost everything.** An \`id\` can appear only once per page and is very hard to override later. A class can be reused, combined and overridden freely.

**Combining them**

\`\`\`css
.card.featured  { }  /* has BOTH classes — no space */
.card .title    { }  /* a .title anywhere INSIDE a .card — space */
.card > .title  { }  /* a .title that is a DIRECT child */
h2, h3          { }  /* h2 or h3 — comma means "or" */
\`\`\`

That space is the single most common typo in CSS. \`.a.b\` and \`.a .b\` mean completely different things, and both are valid, so nothing warns you.

**States — things that change**

\`\`\`css
a:hover           { }  /* mouse is over it */
button:focus-visible { }  /* reached by keyboard */
input:disabled    { }
li:first-child    { }
li:last-child     { }
li:nth-child(2)   { }
li:not(.active)   { }
\`\`\`

\`:hover\` alone is a trap: a phone has no hover, so anything only reachable by hovering is invisible on mobile.

**Attribute selectors**

\`\`\`css
a[href^="https"] { }   /* href STARTS WITH https  */
a[href$=".pdf"]  { }   /* href ENDS WITH .pdf     */
input[type="email"] { }
\`\`\`

**When nothing happens, check these three first**

1. Is the class spelled exactly right, including case? \`.myCard\` ≠ \`.mycard\`
2. Did you write \`.card\` when the HTML says \`class="cards"\`?
3. Is there a space where there should not be one?

**Remember:** classes for almost everything, and mind the space between selectors.`,

    simpleHi: `**CSS rule ke do hisse hote hain**

\`\`\`css
p { color: blue; }
│   └──────────┘
│        └── declaration: kya badalna hai
└── selector: kaunse elements
\`\`\`

**Teen jo aap har waqt use karoge**

\`\`\`css
p          { }   /* page ka har <p>                — kaam se     */
.card      { }   /* har element jispar class="card" — vardi se   */
#header    { }   /* wo ek element jiski id="header" — naam se    */
\`\`\`

**Lagbhag har cheez ke liye classes use karo.** \`id\` har page par ek hi baar aa sakti hai aur baad mein use override karna bahut mushkil hota hai. Class dobara use ho sakti hai, jodi ja sakti hai aur aaram se override hoti hai.

**Inhe jodna**

\`\`\`css
.card.featured  { }  /* DONO classes hain — space nahi */
.card .title    { }  /* .card ke ANDAR kahin bhi .title — space hai */
.card > .title  { }  /* aisa .title jo SEEDHA bachcha ho */
h2, h3          { }  /* h2 ya h3 — comma matlab "ya" */
\`\`\`

Wo space CSS ki sabse aam typo hai. \`.a.b\` aur \`.a .b\` ka matlab bilkul alag hai, aur dono valid hain, isliye koi warning nahi milti.

**States — jo badalte hain**

\`\`\`css
a:hover           { }  /* mouse uspar hai */
button:focus-visible { }  /* keyboard se pahuncha */
input:disabled    { }
li:first-child    { }
li:last-child     { }
li:nth-child(2)   { }
li:not(.active)   { }
\`\`\`

Sirf \`:hover\` ek jaal hai: phone par hover hota hi nahi, isliye jo cheez sirf hover se milti hai wo mobile par adrishya hai.

**Attribute selectors**

\`\`\`css
a[href^="https"] { }   /* href https se SHURU ho    */
a[href$=".pdf"]  { }   /* href .pdf par KHATAM ho   */
input[type="email"] { }
\`\`\`

**Jab kuch na ho, pehle ye teen dekho**

1. Class ki spelling bilkul sahi hai, chhote-bade akshar samet? \`.myCard\` ≠ \`.mycard\`
2. Aapne \`.card\` likha par HTML mein \`class="cards"\` hai?
3. Kahin space hai jahan nahi hona chahiye?

**Yaad rakho:** lagbhag har cheez ke liye classes, aur selectors ke beech ke space ka dhyan rakho.`,

    content: `## Where CSS lives

\`\`\`html
<link rel="stylesheet" href="styles.css">   <!-- ✅ external: cached, reusable -->
<style> p { color: red } </style>            <!-- ⚠️ page-specific only -->
<p style="color: red">                       <!-- ❌ inline: nearly impossible to override -->
\`\`\`

## The full selector list

\`\`\`css
*                  /* everything — use sparingly, it is slow and broad */
p                  /* element */
.card              /* class */
#header            /* id */
.a.b               /* both classes on the same element */
.a .b              /* descendant: .b anywhere inside .a */
.a > .b            /* child: .b directly inside .a */
.a + .b            /* adjacent sibling: the .b immediately after .a */
.a ~ .b            /* general sibling: any .b after .a */
h1, h2             /* selector list: "or" */
\`\`\`

## Pseudo-classes — a state or a position

\`\`\`css
:hover :focus :active :visited
:focus-visible      /* focused via keyboard — style this, not :focus */
:disabled :checked :required :invalid
:first-child :last-child :only-child
:nth-child(2n)      /* every second */
:nth-child(odd)
:not(.excluded)
:is(h1, h2, h3)     /* shorthand for a selector list */
:has(> img)         /* a parent that CONTAINS something — new and powerful */
\`\`\`

\`:has()\` finally lets CSS look **downward**, which was impossible for twenty years:

\`\`\`css
.card:has(img) { padding: 0; }        /* only cards containing an image */
label:has(input:checked) { font-weight: 600; }
\`\`\`

## Pseudo-elements — a part that is not in the HTML

\`\`\`css
p::first-line { }
p::before { content: "→ "; }
p::after  { content: ""; }
input::placeholder { }
::selection { }
\`\`\`

Two colons for pseudo-**elements**, one for pseudo-**classes**. \`content\` is required for \`::before\` and \`::after\` — without it nothing appears at all.

## Specificity in one line

\`\`\`
inline style  >  #id  >  .class / :hover / [attr]  >  element
\`\`\`

The next lesson covers this properly. For now: prefer classes, and if a rule is not applying, a more specific one is probably winning.

## Keeping selectors shallow

\`\`\`css
/* ❌ brittle: breaks the moment the markup changes */
body div.wrapper ul li a span { }

/* ✅ */
.nav-label { }
\`\`\`

A long selector is both slower and tightly coupled to your HTML structure. One well-named class survives a refactor.`,

    contentHi: `## CSS kahan rehti hai

\`\`\`html
<link rel="stylesheet" href="styles.css">   <!-- ✅ external: cache hoti hai, dobara use hoti hai -->
<style> p { color: red } </style>            <!-- ⚠️ sirf isi page ke liye -->
<p style="color: red">                       <!-- ❌ inline: override karna lagbhag namumkin -->
\`\`\`

## Poori selector list

\`\`\`css
*                  /* sab kuch — kam use karo, ye slow aur bahut chaudi hai */
p                  /* element */
.card              /* class */
#header            /* id */
.a.b               /* ek hi element par dono classes */
.a .b              /* descendant: .a ke andar kahin bhi .b */
.a > .b            /* child: seedhe .a ke andar .b */
.a + .b            /* adjacent sibling: .a ke turant baad wala .b */
.a ~ .b            /* general sibling: .a ke baad koi bhi .b */
h1, h2             /* selector list: "ya" */
\`\`\`

## Pseudo-classes — koi state ya jagah

\`\`\`css
:hover :focus :active :visited
:focus-visible      /* keyboard se focus — isse style karo, :focus ko nahi */
:disabled :checked :required :invalid
:first-child :last-child :only-child
:nth-child(2n)      /* har doosra */
:nth-child(odd)
:not(.excluded)
:is(h1, h2, h3)     /* selector list ka chhota roop */
:has(> img)         /* aisa parent jiske ANDAR kuch ho — naya aur takatwar */
\`\`\`

\`:has()\` aakhirkar CSS ko **neeche** dekhne deta hai, jo bees saal tak namumkin tha:

\`\`\`css
.card:has(img) { padding: 0; }        /* sirf un cards par jinme image hai */
label:has(input:checked) { font-weight: 600; }
\`\`\`

## Pseudo-elements — aisa hissa jo HTML mein hai hi nahi

\`\`\`css
p::first-line { }
p::before { content: "→ "; }
p::after  { content: ""; }
input::placeholder { }
::selection { }
\`\`\`

Pseudo-**elements** ke liye do colon, pseudo-**classes** ke liye ek. \`::before\` aur \`::after\` ke liye \`content\` zaroori hai — uske bina kuch dikhta hi nahi.

## Specificity ek line mein

\`\`\`
inline style  >  #id  >  .class / :hover / [attr]  >  element
\`\`\`

Agla lesson ise theek se cover karta hai. Abhi ke liye: classes ko tarjeeh do, aur agar koi rule nahi lag raha to shayad koi zyada specific rule jeet raha hai.

## Selectors ko uthla rakho

\`\`\`css
/* ❌ kamzor: markup badalte hi toot jata hai */
body div.wrapper ul li a span { }

/* ✅ */
.nav-label { }
\`\`\`

Lamba selector slow bhi hai aur aapke HTML structure se kas kar juda bhi. Ek achhe naam wali class refactor jhel jaati hai.`,

    examples: [
      {
        title: 'The three basic selectors',
        titleHi: 'Teen buniyadi selectors',
        code: `p      { color: #2563eb; }
.tag   { background: #fde68a; }
#lead  { font-weight: 700; }`,
        preview: page(`<p id="lead">I have the id "lead"</p>
<p>I am just a paragraph</p>
<p><span class="tag">I have class "tag"</span></p>`,
`p { color:#2563eb; }
.tag { background:#fde68a; padding:2px 6px; border-radius:3px; }
#lead { font-weight:700; }`),
        previewHeight: 160,
        explain: 'All three paragraphs turned blue from the element selector. Only one is bold, and only the span is highlighted — each selector reached a different set.',
        explainHi: 'Teeno paragraphs element selector se neele ho gaye. Sirf ek mota hai, aur sirf span highlight hua — har selector ne alag samooh pakda.',
      },
      {
        title: 'The space that changes everything',
        titleHi: 'Wo space jo sab badal deta hai',
        code: `.card.featured { border: 3px solid green; }  /* BOTH classes */
.card .featured { border: 3px solid red; }  /* .featured INSIDE .card */`,
        preview: page(`<div class="card featured">card featured — both classes on me</div>
<div class="card">
  <div class="featured">I am .featured inside .card</div>
</div>`,
`.card { padding:8px; margin-bottom:8px; background:#f1f5f9; }
.card.featured { border:3px solid #16a34a; }
.card .featured { border:3px solid #dc2626; }`),
        previewHeight: 180,
        explain: 'Green went to the element carrying both classes; red went to a descendant. One space, two completely different meanings — and CSS reports no error either way.',
        explainHi: 'Hara us element par gaya jispar dono classes thin; laal ek descendant par. Ek space, do bilkul alag matlab — aur CSS dono par koi error nahi deti.',
      },
      {
        title: 'Descendant versus child',
        titleHi: 'Descendant versus child',
        code: `.box p   { color: blue; }   /* any p inside, at any depth */
.box > p { font-weight: 700; } /* only a DIRECT child p */`,
        preview: page(`<div class="box">
  <p>Direct child — blue AND bold</p>
  <div><p>Nested deeper — blue only</p></div>
</div>`,
`.box { border:2px solid #94a3b8; padding:8px; }
.box p { color:#2563eb; }
.box > p { font-weight:700; }`),
        previewHeight: 160,
        explain: 'Both are blue because both are inside `.box`. Only the first is bold, because only it is a *direct* child — the second sits one level deeper inside a `div`.',
        explainHi: 'Dono neele hain kyunki dono `.box` ke andar hain. Sirf pehla mota hai, kyunki sirf wahi *seedha* bachcha hai — doosra ek level aur andar `div` ke andar hai.',
      },
      {
        title: 'Hover, and why it is not enough',
        titleHi: 'Hover, aur wo kaafi kyun nahi',
        code: `.btn:hover { background: #1d4ed8; }
.btn:focus-visible { outline: 3px solid #f59e0b; }`,
        preview: page(`<p style="font-size:13px;color:#666">Hover the buttons, then click in this frame and press Tab.</p>
<button class="btn">Hover me</button>
<button class="btn">Tab to me</button>
<p style="font-size:12px;color:#666;margin-top:10px">A phone has no hover at all — anything only reachable by hovering does not exist on mobile.</p>`,
`.btn { padding:7px 14px; background:#2563eb; color:#fff; border:0; border-radius:4px; margin-right:6px; }
.btn:hover { background:#1d4ed8; }
.btn:focus-visible { outline:3px solid #f59e0b; outline-offset:2px; }`),
        previewHeight: 200,
        explain: 'Hover works with a mouse; `:focus-visible` covers the keyboard. Design a hover-only menu and phone users simply never see it — always provide a tap or focus path too.',
        explainHi: 'Hover mouse se chalta hai; `:focus-visible` keyboard sambhalta hai. Sirf hover wala menu banao to phone users use kabhi dekhte hi nahi — tap ya focus ka rasta bhi hamesha do.',
      },
      {
        title: 'Positional selectors',
        titleHi: 'Jagah wale selectors',
        code: `li:first-child   { font-weight: 700; }
li:last-child    { color: #dc2626; }
li:nth-child(2n) { background: #f1f5f9; }`,
        preview: page(`<ul>
  <li>First — bold</li>
  <li>Second — striped</li>
  <li>Third</li>
  <li>Fourth — striped</li>
  <li>Fifth — red, last</li>
</ul>`,
`li:first-child { font-weight:700; }
li:last-child { color:#dc2626; }
li:nth-child(2n) { background:#e2e8f0; }`),
        previewHeight: 190,
        explain: 'Zebra striping with no extra classes and no JavaScript. Add or remove a row and the striping recalculates itself — that is the value over hand-applied classes.',
        explainHi: 'Bina kisi extra class aur bina JavaScript ke zebra striping. Row jodo ya hatao, striping apne aap dobara nikal jati hai — haath se lagayi classes par yahi fayda hai.',
      },
      {
        title: 'Attribute selectors',
        titleHi: 'Attribute selectors',
        code: `a[href^="https"]::before { content: "🔒 "; }
a[href$=".pdf"]::after   { content: " (PDF)"; }`,
        preview: page(`<p><a href="https://example.com">Secure external link</a></p>
<p><a href="/report.pdf">Download the report</a></p>
<p><a href="/about">Ordinary internal link</a></p>`,
`a { color:#2563eb; }
a[href^="https"]::before { content:"🔒 "; }
a[href$=".pdf"]::after { content:" (PDF)"; }`),
        previewHeight: 180,
        explain: 'The lock icon and the "(PDF)" label were added by CSS from the href alone — no extra markup and no classes. `^=` means starts-with, `$=` means ends-with.',
        explainHi: 'Taala icon aur "(PDF)" label sirf href se CSS ne joda — na extra markup na classes. `^=` matlab shuru hota hai, `$=` matlab khatam hota hai.',
      },
      {
        title: '::before and ::after need content',
        titleHi: '::before aur ::after ko content chahiye',
        code: `.a::before { color: red; }              /* ❌ nothing appears */
.b::before { content: "★ "; color: #f59e0b; }  /* ✅ */`,
        preview: page(`<p class="a">No content property — nothing added</p>
<p class="b">Has content — star appears</p>`,
`.a::before { color:#dc2626; }
.b::before { content:"★ "; color:#f59e0b; }`),
        previewHeight: 140,
        explain: 'Without `content` the pseudo-element is never generated, so every other property is ignored. For a purely decorative shape use `content: ""` — empty, but present.',
        explainHi: 'Bina `content` ke pseudo-element banta hi nahi, isliye baaki har property anndekhi ho jati hai. Sirf sajawat wale aakaar ke liye `content: ""` do — khaali, par maujood.',
      },
      {
        title: ':has() — a parent that contains something',
        titleHi: ':has() — aisa parent jiske andar kuch ho',
        code: `.card:has(img) { border-color: #8b5cf6; }
label:has(input:checked) { background: #ddd6fe; }`,
        preview: page(`<div class="card"><div class="ph">image</div>Card with an image</div>
<div class="card">Card with no image</div>
<label><input type="checkbox"> Tick me — my label reacts</label>`,
`.card { border:2px solid #cbd5e1; padding:8px; margin-bottom:6px; }
.card:has(.ph) { border-color:#8b5cf6; background:#f5f3ff; }
.ph { background:#94a3b8; color:#fff; font-size:11px; padding:2px 6px; display:inline-block; margin-right:6px; }
label { display:block; padding:6px; border:1px solid #cbd5e1; margin-top:6px; }
label:has(input:checked) { background:#ddd6fe; font-weight:600; }`),
        previewHeight: 220,
        explain: 'Tick the checkbox and its label restyles itself. For twenty years CSS could only look downward from a parent; `:has()` finally lets a parent react to its children.',
        explainHi: 'Checkbox par tick karo aur uska label khud badal jata hai. Bees saal tak CSS sirf parent se neeche dekh sakti thi; `:has()` aakhirkar parent ko apne bachchon par react karne deta hai.',
      },
      {
        title: 'Why your style is not applying',
        titleHi: 'Aapki style kyun nahi lag rahi',
        code: `/* HTML: <div class="myCard">…</div> */

.mycard { background: red; }   /* ❌ wrong case */
.myCards { background: red; }  /* ❌ extra s   */
.myCard  { background: #bbf7d0; }  /* ✅ */`,
        preview: page(`<div class="myCard">Class is "myCard"</div>
<p style="font-size:13px;color:#666;margin-top:10px">
Two of the three rules below target nothing at all. CSS reports no error for a selector that matches zero elements — it simply does nothing.</p>
<pre style="font-size:12px;background:#f1f5f9;padding:8px">.mycard  { background:red }   ✗ case
.myCards { background:red }   ✗ typo
.myCard  { background:green } ✓</pre>`,
`.myCard { background:#bbf7d0; padding:8px; border:2px solid #16a34a; }`),
        previewHeight: 240,
        explain: 'CSS class names are case-sensitive and there is no warning for a selector that matches nothing. When a style does nothing at all, checking the spelling is faster than reading the rest of the file.',
        explainHi: 'CSS class ke naam mein chhote-bade akshar matter karte hain aur jo selector kisi se match na kare uspar koi warning nahi milti. Jab style bilkul kuch na kare, spelling check karna baaki file padhne se tez hai.',
      },
    ],

    mistakes: [
      {
        wrong: `.card .featured { border: 3px solid green; }
/* HTML: <div class="card featured"> */`,
        right: `.card.featured { border: 3px solid green; }`,
        previewWrong: page(`<div class="card featured">card featured</div>`,
          `.card{padding:8px;background:#f1f5f9;border:2px solid #ef4444}.card .featured{border:3px solid #16a34a}`),
        previewRight: page(`<div class="card featured">card featured</div>`,
          `.card{padding:8px;background:#f1f5f9}.card.featured{border:3px solid #16a34a}`),
        previewHeight: 110,
        why: 'A space means "descendant". `.card .featured` looks for a `.featured` *inside* a `.card`, so an element carrying both classes never matches.',
        whyHi: 'Space ka matlab hai "descendant". `.card .featured` `.card` ke *andar* `.featured` dhoondhta hai, isliye jis element par dono classes hain wo kabhi match nahi karta.',
      },
      {
        wrong: `.menu:hover .dropdown { display: block; }`,
        right: `.menu:hover .dropdown,
.menu:focus-within .dropdown { display: block; }`,
        why: 'Touch devices have no hover, so a hover-only dropdown is unreachable on a phone. `:focus-within` opens it for keyboard and tap as well.',
        whyHi: 'Touch devices par hover hota hi nahi, isliye sirf hover wala dropdown phone par kholna namumkin hai. `:focus-within` use keyboard aur tap dono ke liye khol deta hai.',
      },
      {
        wrong: `#sidebar .widget h3 span { color: red; }`,
        right: `.widget-title { color: red; }`,
        why: 'A long selector is tied to one exact markup shape and breaks on any refactor. It also raises specificity, making the rule hard to override later.',
        whyHi: 'Lamba selector ek hi markup ke aakaar se bandha hota hai aur kisi bhi refactor par toot jata hai. Wo specificity bhi badha deta hai, jisse baad mein rule override karna mushkil ho jata hai.',
      },
      {
        wrong: `.badge::before { color: red; }`,
        right: `.badge::before { content: ""; color: red; }`,
        why: 'A pseudo-element is not created at all without `content`, so every other declaration on it is ignored.',
        whyHi: 'Bina `content` ke pseudo-element banta hi nahi, isliye uspar likhi har doosri declaration anndekhi ho jati hai.',
      },
    ],

    realWorld: [
      {
        en: '**Component libraries.** Bootstrap and Tailwind are enormous sets of class selectors. Understanding `.a.b` versus `.a .b` is what lets you read and override them.',
        hi: '**Component libraries.** Bootstrap aur Tailwind class selectors ke bade samooh hain. `.a.b` aur `.a .b` ka fark samajhna hi aapko unhe padhne aur override karne deta hai.',
      },
      {
        en: '**Tables and lists.** `:nth-child(even)` gives zebra striping that stays correct when rows are added or removed — no classes to maintain.',
        hi: '**Tables aur lists.** `:nth-child(even)` aisi zebra striping deti hai jo rows jodne-hataane par bhi sahi rehti hai — koi class sambhalni nahi padti.',
      },
      {
        en: '**Form states.** `:invalid`, `:checked` and `:focus-within` let you build most form feedback with no JavaScript at all.',
        hi: '**Form states.** `:invalid`, `:checked` aur `:focus-within` se form ka zyadatar feedback bina kisi JavaScript ke ban jata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `.a.b` and `.a .b`?',
        qHi: '`.a.b` aur `.a .b` mein kya fark hai?',
        a: '`.a.b` with no space matches a single element carrying both classes. `.a .b` with a space is a descendant combinator — it matches an element with class `b` nested anywhere inside an element with class `a`. They are entirely different selectors and both are valid, so a stray space produces no error, only a rule that silently matches nothing.',
        aHi: 'Bina space wala `.a.b` us ek element se match karta hai jispar dono classes hain. Space wala `.a .b` descendant combinator hai — wo class `a` wale element ke andar kahin bhi maujood class `b` wale element se match karta hai. Ye bilkul alag selectors hain aur dono valid hain, isliye ek fizool space koi error nahi deta, sirf aisa rule banata hai jo chup-chaap kisi se match nahi karta.',
      },
      {
        q: 'When should you use an id in CSS?',
        qHi: 'CSS mein id kab use karni chahiye?',
        a: 'Almost never for styling. An id may appear only once per page, so the rule cannot be reused, and its high specificity makes it very hard to override later — which is what pushes people towards `!important`. Use classes for styling and reserve ids for fragment links and JavaScript hooks.',
        aHi: 'Styling ke liye lagbhag kabhi nahi. Id har page par ek hi baar aa sakti hai, isliye rule dobara use nahi hota, aur uski unchi specificity baad mein override karna bahut mushkil bana deti hai — aur isi se log `!important` ki taraf jate hain. Styling ke liye classes use karo aur ids ko fragment links aur JavaScript hooks ke liye rakho.',
      },
      {
        q: 'What is the difference between a pseudo-class and a pseudo-element?',
        qHi: 'Pseudo-class aur pseudo-element mein kya fark hai?',
        a: 'A pseudo-class, written with one colon, selects an existing element in a particular state or position — `:hover`, `:first-child`, `:checked`. A pseudo-element, written with two colons, targets a part of an element that does not exist in the HTML — `::before`, `::first-line`, `::placeholder`. Generated pseudo-elements require a `content` property or they are not created.',
        aHi: 'Ek colon wali pseudo-class kisi maujood element ko uski khaas state ya jagah par chunti hai — `:hover`, `:first-child`, `:checked`. Do colon wala pseudo-element element ke us hisse ko pakadta hai jo HTML mein hai hi nahi — `::before`, `::first-line`, `::placeholder`. Banaye jane wale pseudo-elements ko `content` property chahiye warna wo bante hi nahi.',
      },
      {
        q: 'What does `:has()` make possible that was impossible before?',
        qHi: '`:has()` se kya sambhav hua jo pehle namumkin tha?',
        a: 'Selecting a parent based on its descendants. CSS selectors historically only matched downward, so styling a card differently because it contains an image required JavaScript or an extra class. `:has()` lets the parent react to its contents — `.card:has(img)`, `label:has(input:checked)` — and it also enables previous-sibling logic.',
        aHi: 'Apne descendants ke aadhar par parent ko chunna. CSS selectors aitihasik roop se sirf neeche match karte the, isliye image wale card ko alag style karne ke liye JavaScript ya extra class chahiye hoti thi. `:has()` parent ko apne content par react karne deta hai — `.card:has(img)`, `label:has(input:checked)` — aur isse pichle sibling wali logic bhi sambhav hoti hai.',
      },
      {
        q: 'Why avoid deeply nested selectors?',
        qHi: 'Gehre nested selectors se kyun bachein?',
        a: 'They couple the stylesheet tightly to one exact markup structure, so any refactor of the HTML silently breaks the styling. They also accumulate specificity, which makes the rule difficult to override and encourages `!important`. A single well-named class is more readable, more reusable and survives markup changes.',
        aHi: 'Wo stylesheet ko ek hi exact markup structure se kas kar baandh dete hain, isliye HTML ka koi bhi refactor chup-chaap styling toad deta hai. Unki specificity bhi jama hoti jati hai, jisse rule override karna mushkil ho jata hai aur `!important` ki aadat padti hai. Ek achhe naam wali class zyada padhne layak, zyada reusable hai aur markup badalne par bhi bach jaati hai.',
      },
    ],

    exercises: [
      {
        task: 'Build a list of cards where cards with class `featured` get a coloured border, and the title inside every card is bold. Use `.card.featured` and `.card .title` correctly.',
        taskHi: 'Cards ki list banao jahan `featured` class wale cards par rang wala border ho, aur har card ke andar ka title mota ho. `.card.featured` aur `.card .title` sahi se use karo.',
        hint: 'One needs no space, the other needs one. Swap them and watch both rules stop working.',
        hintHi: 'Ek ko space nahi chahiye, doosre ko chahiye. Unhe ulta karke dekho — dono rules chalna band kar denge.',
      },
      {
        task: 'Style a table with zebra striping using `:nth-child`, and make the last row bold. Then add a row and confirm you changed no CSS.',
        taskHi: '`:nth-child` se table par zebra striping lagao, aur aakhri row ko mota karo. Phir ek row jodo aur confirm karo ki aapne CSS bilkul nahi badli.',
        hint: '`tr:nth-child(even)` and `tr:last-child`. The recalculation on insert is the whole point.',
        hintHi: '`tr:nth-child(even)` aur `tr:last-child`. Row daalne par apne aap dobara ginna hi poora fayda hai.',
      },
      {
        task: 'Use `:has()` to give a form field a red border only when it contains an invalid input, without writing any JavaScript.',
        taskHi: '`:has()` se form field ko sirf tab laal border do jab uske andar invalid input ho, aur koi JavaScript mat likho.',
        hint: '`.field:has(input:invalid) { border-color: red }`. Add `:not(:placeholder-shown)` so it does not turn red before the user has typed anything.',
        hintHi: '`.field:has(input:invalid) { border-color: red }`. `:not(:placeholder-shown)` bhi lagao taaki user ke kuch likhne se pehle wo laal na ho.',
      },
    ],

    keyTakeaways: [
      'A rule is a selector plus declarations — the selector decides which elements are affected.',
      'Use classes for almost all styling; ids are single-use and hard to override.',
      '`.a.b` means both classes on one element; `.a .b` means `.b` inside `.a`. The space is everything.',
      '`:hover` does not exist on touch — always pair it with `:focus-visible` or `:focus-within`.',
      '`::before` and `::after` need a `content` property or nothing is created.',
      'Keep selectors shallow; a long chain is brittle and raises specificity.',
    ],
    keyTakeawaysHi: [
      'Rule matlab selector aur declarations — selector tay karta hai kaunse elements par asar hoga.',
      'Lagbhag har styling ke liye classes use karo; ids ek baar ki hain aur override karna mushkil.',
      '`.a.b` matlab ek element par dono classes; `.a .b` matlab `.a` ke andar `.b`. Poora khel space ka hai.',
      'Touch par `:hover` hota hi nahi — use hamesha `:focus-visible` ya `:focus-within` ke saath do.',
      '`::before` aur `::after` ko `content` chahiye warna kuch banta hi nahi.',
      'Selectors uthle rakho; lambi chain kamzor hoti hai aur specificity badha deti hai.',
    ],
  },

  /* ══════════════════ Cascade & Specificity ══════════════════ */
  {
    slug: 'css-cascade-specificity',
    title: 'The Cascade and Specificity',
    titleHi: 'Cascade aur Specificity',
    description: 'Why your style is not applying — and why reaching for !important makes tomorrow worse.',
    descriptionHi: 'Aapki style kyun nahi lag rahi — aur !important lagana kal ko aur bura kyun bana deta hai.',
    difficulty: 'MEDIUM',
    duration: 34,
    order: 2,

    analogy: {
      en: '**Two people giving you instructions.** A stranger says "wear anything blue". Your mother says "wear the blue shirt with the collar". You follow your mother — not because she spoke last, but because she was **more specific**. CSS resolves conflicts the same way: the more specific instruction wins, and only when two are equally specific does the last one written apply.',
      hi: '**Do log aapko hidayat de rahe hain.** Ek ajnabi kehta hai "kuch bhi neela pehno". Aapki maa kehti hain "collar wali neeli shirt pehno". Aap maa ki maanoge — isliye nahi ki unhone baad mein kaha, balki isliye ki unhone **zyada khaas** baat kahi. CSS bhi jhagde aise hi sulajhata hai: zyada specific hidayat jeetti hai, aur jab dono barabar specific hon tabhi baad mein likhi hui lagti hai.',
    },

    simple: `**When two rules fight, three things decide the winner — in this order**

1. **Importance** — is one marked \`!important\`?
2. **Specificity** — which selector is more specific?
3. **Order** — if still tied, the one written last wins.

Most people assume order decides. It only decides **after** specificity ties.

**Counting specificity**

Count three numbers for a selector: **ids, classes, elements**.

\`\`\`css
p                 /* 0,0,1 */
.card             /* 0,1,0 */
.card p           /* 0,1,1 */
.card.featured    /* 0,2,0 */
#header           /* 1,0,0 */
#header .card p   /* 1,1,1 */
\`\`\`

Compare left to right, like version numbers. **One id beats any number of classes.** \`1,0,0\` beats \`0,9,0\` — nine classes still lose to a single id.

**This is the bug you will hit**

\`\`\`css
#sidebar p { color: grey; }   /* 1,0,1 */
.highlight { color: red; }    /* 0,1,0  ← loses, even though written after */
\`\`\`

Your \`.highlight\` class does nothing, because an id rule elsewhere in the file outranks it. The text stays grey and there is no error to tell you why.

**The temptation**

\`\`\`css
.highlight { color: red !important; }   /* now it works… */
\`\`\`

It works today. But \`!important\` beats everything, so the next person who needs to override *this* has only one option: another \`!important\`. A codebase where every rule shouts is one where nothing can be changed.

**The fix is to lower the winner, not raise the loser**

\`\`\`css
/* ❌ escalate */
#sidebar p { color: grey; }
.highlight { color: red !important; }

/* ✅ de-escalate */
.sidebar p { color: grey; }   /* id → class */
.highlight { color: red; }    /* now the later rule simply wins */
\`\`\`

**Inheritance is separate**

Some properties pass down to children on their own:

\`\`\`css
body { color: #333; font-family: sans-serif; }   /* inherited by everything */
\`\`\`

Text properties inherit. Box properties — \`border\`, \`padding\`, \`margin\`, \`background\` — do not.

**Remember:** specificity beats order. Use classes, keep specificity flat, and treat \`!important\` as a bug report.`,

    simpleHi: `**Jab do rules ladte hain, teen cheezein jeet tay karti hain — isi kram mein**

1. **Importance** — kya kisi par \`!important\` laga hai?
2. **Specificity** — kaunsa selector zyada specific hai?
3. **Kram** — phir bhi barabari ho to jo baad mein likha wo jeetta hai.

Zyadatar log samajhte hain ki kram tay karta hai. Wo sirf specificity barabar hone ke **baad** tay karta hai.

**Specificity ginna**

Kisi selector ke liye teen number gino: **ids, classes, elements**.

\`\`\`css
p                 /* 0,0,1 */
.card             /* 0,1,0 */
.card p           /* 0,1,1 */
.card.featured    /* 0,2,0 */
#header           /* 1,0,0 */
#header .card p   /* 1,1,1 */
\`\`\`

Baayein se dayein compare karo, version numbers ki tarah. **Ek id kitni bhi classes se jeet jaati hai.** \`1,0,0\` \`0,9,0\` se jeetta hai — nau classes bhi ek id se haar jaati hain.

**Ye wahi bug hai jo aapko milega**

\`\`\`css
#sidebar p { color: grey; }   /* 1,0,1 */
.highlight { color: red; }    /* 0,1,0  ← haar gaya, baad mein likhe hone par bhi */
\`\`\`

Aapki \`.highlight\` class kuch nahi karti, kyunki file mein kahin aur ki id rule usse upar hai. Text bhoora hi rehta hai aur koi error nahi batata kyun.

**Lalach**

\`\`\`css
.highlight { color: red !important; }   /* ab chal gaya… */
\`\`\`

Aaj chal gaya. Par \`!important\` sabse jeet jata hai, isliye agle vyakti ko *isse* override karna hua to uske paas ek hi vikalp hai: ek aur \`!important\`. Jis codebase mein har rule cheekhta hai, usme kuch badla hi nahi ja sakta.

**Ilaaj jeetne wale ko neeche laana hai, haarne wale ko upar nahi**

\`\`\`css
/* ❌ badhaana */
#sidebar p { color: grey; }
.highlight { color: red !important; }

/* ✅ ghataana */
.sidebar p { color: grey; }   /* id → class */
.highlight { color: red; }    /* ab baad wala rule seedhe jeet jata hai */
\`\`\`

**Inheritance alag cheez hai**

Kuch properties khud hi bachchon tak pahunch jati hain:

\`\`\`css
body { color: #333; font-family: sans-serif; }   /* sabko inherit hoti hai */
\`\`\`

Text properties inherit hoti hain. Box properties — \`border\`, \`padding\`, \`margin\`, \`background\` — nahi hoti.

**Yaad rakho:** specificity kram se jeetti hai. Classes use karo, specificity flat rakho, aur \`!important\` ko bug report samjho.`,

    content: `## The full cascade order

When two declarations set the same property on the same element, the browser decides in this order:

1. **Origin and importance** — author \`!important\` beats author normal, which beats browser defaults
2. **Specificity** — the (id, class, element) count
3. **Source order** — the last one wins

Later steps are consulted only when the earlier ones tie.

## Counting precisely

| Selector | ids | classes | elements | Reads as |
|---|---|---|---|---|
| \`*\` | 0 | 0 | 0 | 0,0,0 |
| \`p\` | 0 | 0 | 1 | 0,0,1 |
| \`.card\` | 0 | 1 | 0 | 0,1,0 |
| \`[type="text"]\` | 0 | 1 | 0 | 0,1,0 |
| \`:hover\` | 0 | 1 | 0 | 0,1,0 |
| \`#main\` | 1 | 0 | 0 | 1,0,0 |
| \`#main .card p\` | 1 | 1 | 1 | 1,1,1 |
| inline \`style=""\` | — | — | — | beats all selectors |

Attribute selectors and pseudo-classes count as classes. Pseudo-elements such as \`::before\` count as elements. \`:not()\` itself adds nothing, but what is **inside** it counts.

\`\`\`css
:not(.a)        /* 0,1,0 — the .a inside counts */
:is(#a, .b)     /* 1,0,0 — takes its MOST specific argument */
:where(#a, .b)  /* 0,0,0 — always zero, whatever is inside */
\`\`\`

\`:where()\` is the modern tool for writing defaults that are trivially overridable.

## Inheritance

Inherited by default: \`color\`, \`font-*\`, \`line-height\`, \`text-align\`, \`visibility\`, \`cursor\`, \`list-style\`.

Not inherited: \`margin\`, \`padding\`, \`border\`, \`background\`, \`width\`, \`height\`, \`display\`, \`position\`.

Force it either way:

\`\`\`css
.child { color: inherit; }    /* take the parent's value */
.child { border: initial; }   /* back to the CSS default */
.child { all: unset; }        /* strip everything */
\`\`\`

Note that inheritance always loses to any rule that actually matches the element — an inherited value is only used when nothing sets that property directly.

## The legitimate uses of !important

There are only two:

1. Overriding an inline style you cannot edit, typically from a third-party widget
2. A utility class deliberately designed to always win, such as \`.hidden { display: none !important }\`

Anything else is a signal that specificity has got out of hand.

## Cascade layers

\`\`\`css
@layer reset, base, components, utilities;

@layer components { .btn { padding: 8px; } }
@layer utilities  { .p-0 { padding: 0; } }
\`\`\`

Layers are consulted **before** specificity: any rule in a later layer beats any rule in an earlier one, regardless of how specific it is. This is the proper modern answer to specificity wars, and it is why utilities can be one class and still win.

## Debugging a rule that will not apply

Open devtools and look at the Styles panel. A declaration with a **line through it** has been overridden — hover it and devtools shows you the winning rule. That is faster than reasoning about specificity in your head.`,

    contentHi: `## Poora cascade kram

Jab do declarations ek hi element par ek hi property set karti hain, browser isi kram mein faisla karta hai:

1. **Origin aur importance** — author ka \`!important\` author ke normal se jeetta hai, jo browser defaults se jeetta hai
2. **Specificity** — (id, class, element) ki ginti
3. **Source kram** — jo baad mein likha wo jeetta hai

Baad ke steps tabhi dekhe jate hain jab pehle wale barabar hon.

## Theek se ginna

| Selector | ids | classes | elements | Padha jata hai |
|---|---|---|---|---|
| \`*\` | 0 | 0 | 0 | 0,0,0 |
| \`p\` | 0 | 0 | 1 | 0,0,1 |
| \`.card\` | 0 | 1 | 0 | 0,1,0 |
| \`[type="text"]\` | 0 | 1 | 0 | 0,1,0 |
| \`:hover\` | 0 | 1 | 0 | 0,1,0 |
| \`#main\` | 1 | 0 | 0 | 1,0,0 |
| \`#main .card p\` | 1 | 1 | 1 | 1,1,1 |
| inline \`style=""\` | — | — | — | har selector se jeetta hai |

Attribute selectors aur pseudo-classes class ke barabar ginte hain. \`::before\` jaise pseudo-elements element ke barabar. \`:not()\` khud kuch nahi jodta, par uske **andar** jo hai wo ginta hai.

\`\`\`css
:not(.a)        /* 0,1,0 — andar ka .a ginta hai */
:is(#a, .b)     /* 1,0,0 — apna SABSE specific argument leta hai */
:where(#a, .b)  /* 0,0,0 — hamesha zero, andar chahe kuch bhi ho */
\`\`\`

\`:where()\` aise defaults likhne ka modern auzaar hai jo aasani se override ho jayein.

## Inheritance

Default mein inherit hoti hain: \`color\`, \`font-*\`, \`line-height\`, \`text-align\`, \`visibility\`, \`cursor\`, \`list-style\`.

Inherit nahi hoti: \`margin\`, \`padding\`, \`border\`, \`background\`, \`width\`, \`height\`, \`display\`, \`position\`.

Dono taraf zabardasti kar sakte ho:

\`\`\`css
.child { color: inherit; }    /* parent ki value lo */
.child { border: initial; }   /* CSS default par wapas */
.child { all: unset; }        /* sab kuch hata do */
\`\`\`

Dhyan do inheritance hamesha us rule se haar jati hai jo element par sach mein match karta hai — inherited value tabhi use hoti hai jab koi us property ko seedhe set na kare.

## !important ke jayaz istemaal

Sirf do hain:

1. Aisi inline style override karna jise aap badal nahi sakte, aksar kisi third-party widget se
2. Aisi utility class jo jaan-boojhkar hamesha jeetne ke liye bani ho, jaise \`.hidden { display: none !important }\`

Baaki har istemaal ishara hai ki specificity haath se nikal chuki hai.

## Cascade layers

\`\`\`css
@layer reset, base, components, utilities;

@layer components { .btn { padding: 8px; } }
@layer utilities  { .p-0 { padding: 0; } }
\`\`\`

Layers specificity se **pehle** dekhi jati hain: baad wali layer ka koi bhi rule pehli layer ke kisi bhi rule se jeet jata hai, chahe wo kitna bhi specific ho. Specificity ki ladai ka yahi sahi modern jawab hai, aur isiliye utilities ek class hokar bhi jeet jati hain.

## Jo rule nahi lag raha usse debug karna

Devtools kholo aur Styles panel dekho. Jis declaration par **line kati hui** hai wo override ho chuki hai — uspar hover karo aur devtools jeetne wala rule dikha dega. Ye dimaag mein specificity ginne se tez hai.`,

    examples: [
      {
        title: 'Order only decides when specificity ties',
        titleHi: 'Kram tabhi tay karta hai jab specificity barabar ho',
        code: `p { color: blue; }
p { color: green; }   /* same specificity → last wins */`,
        preview: page(`<p>Both rules are 0,0,1 — the later one wins</p>`,
`p { color:#2563eb; }
p { color:#16a34a; }`),
        previewHeight: 110,
        explain: 'Green wins because the specificity is identical and it was written second. This is the case people generalise from — and it is the exception, not the rule.',
        explainHi: 'Hara jeeta kyunki specificity bilkul barabar thi aur wo baad mein likha gaya. Log isi case se aam niyam bana lete hain — jabki ye apwaad hai, niyam nahi.',
      },
      {
        title: 'The bug: a class that does nothing',
        titleHi: 'Bug: aisi class jo kuch nahi karti',
        code: `#box p     { color: grey; }   /* 1,0,1 */
.highlight { color: red; }    /* 0,1,0 — written after, still loses */`,
        preview: page(`<div id="box">
  <p class="highlight">I have class="highlight" and I am still grey.</p>
</div>
<p style="font-size:13px;color:#666;margin-top:10px">
#box p is 1,0,1 · .highlight is 0,1,0 — one id outranks the class no matter where it sits in the file.</p>`,
`#box p { color:#6b7280; }
.highlight { color:#dc2626; }`),
        previewHeight: 190,
        explain: 'This is the exact moment people reach for `!important`. The class is written later and still loses, because a single id outranks any number of classes.',
        explainHi: 'Bilkul isi pal log `!important` uthate hain. Class baad mein likhi hai phir bhi haar jati hai, kyunki ek id kitni bhi classes se upar hai.',
      },
      {
        title: 'One id beats nine classes',
        titleHi: 'Ek id nau classes se jeetti hai',
        code: `#a                            { color: green; }  /* 1,0,0 */
.c1.c2.c3.c4.c5.c6.c7.c8.c9   { color: red; }    /* 0,9,0 */`,
        preview: page(`<p id="a" class="c1 c2 c3 c4 c5 c6 c7 c8 c9">Nine classes, one id — green wins</p>
<p style="font-size:13px;color:#666;margin-top:10px">Specificity is compared left to right like a version number. 1,0,0 beats 0,9,0 outright — the columns never carry over.</p>`,
`.c1.c2.c3.c4.c5.c6.c7.c8.c9 { color:#dc2626; }
#a { color:#16a34a; }`),
        previewHeight: 190,
        explain: 'The three numbers never add up or carry. Any id at all outranks every class combination, which is exactly why ids are a poor styling tool.',
        explainHi: 'Teeno number kabhi jodte ya carry nahi hote. Koi bhi id har class ke jod se upar hai, aur isiliye styling ke liye ids kharab auzaar hain.',
      },
      {
        title: 'The escalation, and the real fix',
        titleHi: 'Badhta jhagda, aur asli ilaaj',
        code: `/* ❌ escalate */
#box p     { color: grey; }
.highlight { color: red !important; }

/* ✅ de-escalate: lower the winner */
.box p     { color: grey; }   /* id → class */
.highlight { color: red; }`,
        preview: page(`<div class="bad"><p class="hl-bad">Fixed with !important — works today, blocks tomorrow</p></div>
<div class="good"><p class="hl-good">Fixed by lowering specificity — stays overridable</p></div>`,
`.bad p { color:#6b7280; }
.hl-bad { color:#dc2626 !important; }
.good p { color:#6b7280; }
.hl-good { color:#16a34a; }
.bad, .good { padding:6px; margin-bottom:6px; border-left:4px solid #cbd5e1; }`),
        previewHeight: 170,
        explain: 'Both look fixed. The difference appears later: the first can now only be overridden by another `!important`, while the second stays a normal class anyone can beat.',
        explainHi: 'Dono theek dikhte hain. Fark baad mein dikhta hai: pehle ko ab sirf ek aur `!important` hi override kar sakta hai, jabki doosra normal class hai jise koi bhi haraa sakta hai.',
      },
      {
        title: 'Inline styles beat every selector',
        titleHi: 'Inline styles har selector se jeetti hain',
        code: `#a.b.c { color: green; }   /* very specific */
<p style="color: red">     <!-- still wins -->`,
        preview: page(`<p id="a" class="b c" style="color:#dc2626">Inline style wins over #a.b.c</p>
<p style="font-size:13px;color:#666;margin-top:10px">
This is why a third-party widget setting inline styles is one of the only legitimate reasons to use !important.</p>`,
`#a.b.c { color:#16a34a; }`),
        previewHeight: 170,
        explain: 'Only `!important` can beat an inline style. That is why widgets and email templates that write inline styles are so hard to restyle — and the one place `!important` is genuinely correct.',
        explainHi: 'Inline style ko sirf `!important` haraa sakta hai. Isiliye inline styles likhne wale widgets aur email templates dobara style karna itna mushkil hota hai — aur yahi ek jagah hai jahan `!important` sach mein sahi hai.',
      },
      {
        title: 'What inherits and what does not',
        titleHi: 'Kya inherit hota hai aur kya nahi',
        code: `.parent {
  color: #7c3aed;      /* inherited by children */
  border: 2px solid;   /* NOT inherited */
  font-style: italic;  /* inherited */
}`,
        preview: page(`<div class="parent">
  Parent text
  <p>Child paragraph — inherited the colour and the italics, but has no border of its own.</p>
</div>`,
`.parent { color:#7c3aed; border:2px solid #7c3aed; font-style:italic; padding:8px; }`),
        previewHeight: 180,
        explain: 'The child is purple and italic without any rule targeting it, but it has no border. Text properties inherit; box properties do not — that split covers almost every case.',
        explainHi: 'Bachcha bina kisi apne rule ke baingani aur italic hai, par uska koi border nahi. Text properties inherit hoti hain; box properties nahi — ye bantwara lagbhag har case cover kar leta hai.',
      },
      {
        title: 'A matching rule always beats inheritance',
        titleHi: 'Match karta rule hamesha inheritance se jeetta hai',
        code: `body { color: purple; }   /* inherited */
p    { color: black; }    /* 0,0,1 — but it MATCHES */`,
        preview: page(`<div class="wrap">
  <span>Span — inherited purple</span>
  <p>Paragraph — black, because a rule actually matches me</p>
</div>`,
`.wrap { color:#7c3aed; }
.wrap p { color:#111; }`),
        previewHeight: 150,
        explain: 'An inherited value is only used when nothing sets that property on the element directly. Even the weakest matching rule outranks the strongest inherited value.',
        explainHi: 'Inherited value tabhi use hoti hai jab element par us property ko koi seedhe set na kare. Sabse kamzor match karta rule bhi sabse mazboot inherited value se upar hai.',
      },
      {
        title: ':where() has zero specificity',
        titleHi: ':where() ki specificity zero hai',
        code: `:where(#sidebar) p { color: grey; }  /* 0,0,1 — the id is discounted */
.highlight         { color: red; }   /* 0,1,0 — now it wins */`,
        preview: page(`<div id="sidebar">
  <p class="highlight">Now the highlight class wins</p>
</div>
<p style="font-size:13px;color:#666;margin-top:10px">
:where() always contributes 0,0,0 — perfect for library defaults that consumers must be able to override.</p>`,
`:where(#sidebar) p { color:#6b7280; }
.highlight { color:#dc2626; }`),
        previewHeight: 180,
        explain: 'Same markup as the earlier broken example, but wrapping the id in `:where()` drops its specificity to zero, so a single class can now override it. This is how modern libraries ship defaults.',
        explainHi: 'Markup wahi hai jo pehle wale tooti misaal mein tha, par id ko `:where()` mein lapetne se uski specificity zero ho gayi, isliye ab ek class usse override kar sakti hai. Modern libraries defaults aise hi bhejti hain.',
      },
      {
        title: 'Cascade layers outrank specificity entirely',
        titleHi: 'Cascade layers specificity se poori tarah upar hain',
        code: `@layer base, utilities;

@layer base      { #box p { color: grey; } }  /* 1,0,1 */
@layer utilities { .red   { color: red; } }   /* 0,1,0 — still wins */`,
        preview: page(`<div id="box"><p class="red">A later layer beats any specificity in an earlier one</p></div>
<p style="font-size:13px;color:#666;margin-top:10px">
Layer order is checked BEFORE specificity — which is how a one-class utility can override a heavy selector.</p>`,
`@layer base, utilities;
@layer base { #box p { color:#6b7280; } }
@layer utilities { .red { color:#dc2626; } }`),
        previewHeight: 180,
        explain: 'The utility is far less specific and still wins, because layer order is consulted first. This is the proper modern answer to specificity wars — no `!important` anywhere.',
        explainHi: 'Utility bahut kam specific hai phir bhi jeetti hai, kyunki layer ka kram pehle dekha jata hai. Specificity ki ladai ka yahi sahi modern jawab hai — kahin bhi `!important` nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `#sidebar p { color: grey; }
.highlight { color: red !important; }`,
        right: `.sidebar p { color: grey; }
.highlight { color: red; }`,
        previewWrong: page(`<div id="sb"><p class="hl">Works — but now unoverridable</p></div>`,
          `#sb p{color:#6b7280}.hl{color:#dc2626 !important}#sb{padding:6px;border-left:4px solid #ef4444}`),
        previewRight: page(`<div class="sb"><p class="hl">Works — and stays overridable</p></div>`,
          `.sb p{color:#6b7280}.hl{color:#16a34a}.sb{padding:6px;border-left:4px solid #10b981}`),
        previewHeight: 110,
        why: '`!important` fixes today and blocks tomorrow — the next override needs another one. Lower the specificity of the winning rule instead of raising the loser.',
        whyHi: '`!important` aaj theek karta hai aur kal rok deta hai — agle override ko ek aur chahiye. Haarne wale ko upar karne ke bajaye jeetne wale rule ki specificity ghatao.',
      },
      {
        wrong: `#header .nav ul li a { color: blue; }`,
        right: `.nav-link { color: blue; }`,
        why: 'That selector is 1,1,3 — almost nothing can override it without an id or `!important`. One class keeps specificity flat and survives markup changes.',
        whyHi: 'Wo selector 1,1,3 hai — usse bina id ya `!important` ke lagbhag kuch bhi override nahi kar sakta. Ek class specificity flat rakhti hai aur markup badalne par bhi bach jati hai.',
      },
      {
        wrong: `/* assuming the later rule always wins */
.a { color: red; }
p  { color: blue; }   /* does NOT win over .a */`,
        right: `/* order only breaks a specificity tie */
.a { color: red; }
p.a { color: blue; }  /* 0,1,1 — now it wins */`,
        why: 'Source order is the last tiebreaker, not the first rule. A class always outranks an element selector regardless of where each is written.',
        whyHi: 'Source kram aakhri tiebreaker hai, pehla niyam nahi. Class hamesha element selector se upar hai, chahe dono kahin bhi likhe hon.',
      },
      {
        wrong: `.card { margin: 20px; }
/* expecting children to inherit the margin */`,
        right: `.card { margin: 20px; }
.card > * { margin: 20px; }   /* set it explicitly */`,
        why: 'Box properties — margin, padding, border, background, width — are not inherited. Only text-related properties pass down automatically.',
        whyHi: 'Box properties — margin, padding, border, background, width — inherit nahi hoti. Sirf text se judi properties apne aap neeche jati hain.',
      },
    ],

    realWorld: [
      {
        en: '**Overriding a UI library.** Bootstrap and Material ship high-specificity selectors. Knowing the count tells you the minimum selector you need instead of guessing with `!important`.',
        hi: '**UI library override karna.** Bootstrap aur Material unchi specificity wale selectors bhejte hain. Ginti aati ho to pata chal jata hai ki kam se kam kaunsa selector chahiye, `!important` se andaza lagane ke bajaye.',
      },
      {
        en: '**Tailwind and utility CSS.** Utilities are single classes that must beat component styles. Cascade layers are exactly how that is made to work without `!important`.',
        hi: '**Tailwind aur utility CSS.** Utilities ek-class wali hoti hain jinhe component styles se jeetna hota hai. Cascade layers hi wo tarika hai jisse ye bina `!important` ke chalta hai.',
      },
      {
        en: '**Design systems.** Wrapping default rules in `:where()` gives them zero specificity, so any consumer can override them with a plain class — no escalation war.',
        hi: '**Design systems.** Default rules ko `:where()` mein lapetne se unki specificity zero ho jati hai, isliye koi bhi upyogkarta unhe simple class se override kar sakta hai — koi ladai nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'How does the browser decide which of two conflicting rules applies?',
        qHi: 'Do takrate rules mein se kaunsa lagega, browser kaise tay karta hai?',
        a: 'In order: importance first — an author `!important` declaration beats a normal one; then specificity, compared as an (id, class, element) triple from left to right; and only if those tie, source order, where the later rule wins. Cascade layers, where used, are considered before specificity.',
        aHi: 'Kram mein: pehle importance — author ka `!important` normal se jeetta hai; phir specificity, jo (id, class, element) ki teen-ginti ke roop mein baayein se dayein compare hoti hai; aur ye barabar hon tabhi source kram, jahan baad wala rule jeetta hai. Jahan cascade layers hain, wo specificity se pehle dekhi jati hain.',
      },
      {
        q: 'Calculate the specificity of `#nav .item a:hover`.',
        qHi: '`#nav .item a:hover` ki specificity nikalo.',
        a: '1,2,1 — one id (`#nav`), two class-level selectors (`.item` and the pseudo-class `:hover`), and one element (`a`). Pseudo-classes and attribute selectors count in the class column; pseudo-elements count in the element column.',
        aHi: '1,2,1 — ek id (`#nav`), do class-level selectors (`.item` aur pseudo-class `:hover`), aur ek element (`a`). Pseudo-classes aur attribute selectors class wale column mein ginte hain; pseudo-elements element wale column mein.',
      },
      {
        q: 'Why is `!important` considered a problem?',
        qHi: '`!important` ko samasya kyun maana jata hai?',
        a: 'It short-circuits the cascade, so the only way to override it later is another `!important`. That escalates until every rule carries one and the cascade no longer expresses any intent, making the stylesheet effectively unmaintainable. The correct fix is almost always to reduce the specificity of the rule that is winning.',
        aHi: 'Wo cascade ko beech se kaat deta hai, isliye baad mein use override karne ka ekmatra tarika ek aur `!important` hai. Ye tab tak badhta hai jab tak har rule par ek na lag jaye aur cascade ka koi matlab hi na bache, jisse stylesheet sambhalne layak nahi rehti. Sahi ilaaj lagbhag hamesha us rule ki specificity ghatana hai jo jeet raha hai.',
      },
      {
        q: 'What is the difference between `:is()` and `:where()`?',
        qHi: '`:is()` aur `:where()` mein kya fark hai?',
        a: 'They match identically, but their specificity differs. `:is()` takes the specificity of its most specific argument, so `:is(#a, .b)` counts as 1,0,0. `:where()` always contributes zero, whatever it contains. `:where()` is therefore the right choice for library or reset defaults that consumers must be able to override with a single class.',
        aHi: 'Dono ek jaisa match karte hain, par unki specificity alag hai. `:is()` apne sabse specific argument ki specificity leta hai, isliye `:is(#a, .b)` 1,0,0 ginta hai. `:where()` hamesha zero deta hai, andar chahe kuch bhi ho. Isliye library ya reset defaults ke liye `:where()` sahi hai, jinhe upyogkarta ek class se override kar sakein.',
      },
      {
        q: 'Which CSS properties are inherited?',
        qHi: 'Kaunsi CSS properties inherit hoti hain?',
        a: 'Broadly, text-related ones: `color`, the `font-*` family, `line-height`, `text-align`, `letter-spacing`, `visibility`, `cursor` and `list-style`. Box-related properties — `margin`, `padding`, `border`, `background`, `width`, `height`, `display`, `position` — are not inherited. Any property can be forced with `inherit`, and an inherited value always loses to a rule that matches the element directly.',
        aHi: 'Mote taur par text se judi: `color`, poora `font-*` parivaar, `line-height`, `text-align`, `letter-spacing`, `visibility`, `cursor` aur `list-style`. Box se judi properties — `margin`, `padding`, `border`, `background`, `width`, `height`, `display`, `position` — inherit nahi hoti. Kisi bhi property par `inherit` se zabardasti ki ja sakti hai, aur inherited value hamesha us rule se haar jati hai jo element par seedhe match karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Write three rules targeting the same element with specificity 0,0,1, 0,1,0 and 1,0,0. Predict which colour wins before running it, then reorder them and confirm nothing changes.',
        taskHi: 'Ek hi element par teen rules likho jinki specificity 0,0,1, 0,1,0 aur 1,0,0 ho. Chalane se pehle guess karo kaunsa rang jeetega, phir unka kram badalkar confirm karo ki kuch nahi badla.',
        hint: 'Reordering proves the point: specificity decided it, not position in the file.',
        hintHi: 'Kram badalna hi baat sabit karta hai: faisla specificity ne kiya tha, file mein jagah ne nahi.',
      },
      {
        task: 'Take a stylesheet with an `!important` in it and remove it by lowering the specificity of the rule it was fighting. Confirm the result is identical.',
        taskHi: 'Aisi stylesheet lo jisme `!important` hai aur use hatao — us rule ki specificity ghata kar jisse wo lad raha tha. Confirm karo ki nateeja bilkul waisa hi hai.',
        hint: 'Usually the winning rule uses an id. Change it to a class and the `!important` becomes unnecessary.',
        hintHi: 'Aksar jeetne wala rule id use karta hai. Use class banao aur `!important` ki zarurat hi khatam ho jati hai.',
      },
      {
        task: 'Set up `@layer base, components, utilities` and prove a one-class utility in the last layer overrides an id selector in the first.',
        taskHi: '`@layer base, components, utilities` banao aur sabit karo ki aakhri layer ki ek-class utility pehli layer ke id selector ko override kar deti hai.',
        hint: 'Declare the layer order once at the top. That single line is what gives later layers priority regardless of specificity.',
        hintHi: 'Layer ka kram upar ek baar declare karo. Wahi ek line baad wali layers ko specificity se bemutasir priority deti hai.',
      },
    ],

    keyTakeaways: [
      'Conflicts resolve by importance, then specificity, then source order — order is the LAST tiebreaker.',
      'Specificity is (ids, classes, elements) compared left to right; one id beats any number of classes.',
      'Pseudo-classes and attribute selectors count as classes; `:where()` always counts as zero.',
      '`!important` fixes today and blocks tomorrow — lower the winner instead of raising the loser.',
      'Text properties inherit; box properties do not. A matching rule always beats an inherited value.',
      'Cascade layers are checked before specificity, which is the modern way to avoid specificity wars.',
    ],
    keyTakeawaysHi: [
      'Jhagde importance, phir specificity, phir source kram se sulajhte hain — kram AAKHRI tiebreaker hai.',
      'Specificity (ids, classes, elements) hai jo baayein se dayein compare hoti hai; ek id kitni bhi classes se jeetti hai.',
      'Pseudo-classes aur attribute selectors class ginte hain; `:where()` hamesha zero ginta hai.',
      '`!important` aaj theek karta hai aur kal rokta hai — haarne wale ko upar karne ke bajaye jeetne wale ko neeche laao.',
      'Text properties inherit hoti hain; box properties nahi. Match karta rule hamesha inherited value se jeetta hai.',
      'Cascade layers specificity se pehle dekhi jati hain, aur specificity ki ladai se bachne ka yahi modern tarika hai.',
    ],
  },
];
