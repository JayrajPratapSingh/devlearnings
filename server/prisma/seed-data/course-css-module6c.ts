/**
 * CSS & HTML Complete Course — Module 6 (Pro), lesson 3. FINAL LESSON.
 *
 * SCSS/Sass. Browsers cannot run Sass — it is a preprocessor compiled to
 * plain CSS before it ever reaches a browser — so unlike every other lesson
 * in this course, the `code` field shows SCSS source and the `preview`
 * shows what the COMPILED CSS produces, not a live render of the SCSS
 * itself. The broken example is copy-pasted button variants (a maintenance
 * trap plain CSS cannot avoid without custom properties), fixed with a
 * parametrised mixin — the one genuinely irreplaceable Sass feature native
 * CSS still lacks even after custom properties and nesting landed natively.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields) — a plain backtick used
 * for inline code inside one of those template literals terminates the
 * literal early and produces a confusing cascade of parser errors hundreds
 * of lines away. Single-quoted string fields (explain, why, q, a, task,
 * keyTakeaways, etc.) do NOT need backticks escaped — only escape apostrophes
 * there (\'). Run `npx tsc --noEmit -p .` after writing this file, before
 * wiring it into seed.ts — it is the only fully reliable check for this
 * mistake, more reliable than any regex scan.
 */

import type { CourseLesson } from './course-js-module1';

const page = (body: string, css = '') => `<!doctype html><html><head><meta charset="utf-8">
<style>
  body { font: 15px/1.5 system-ui, sans-serif; margin: 12px; color: #111; }
  ${css}
</style></head><body>${body}</body></html>`;

export const CSS_MODULE_6C: CourseLesson[] = [
  {
    slug: 'scss-sass',
    title: 'SCSS and Sass',
    titleHi: 'SCSS aur Sass',
    description: 'Five copy-pasted button variants, ninety percent identical — and the one line that always gets missed when they update.',
    descriptionHi: 'Paanch copy-pasted button variants, nabbe pratishat ek jaisi — aur wo ek line jo update hote waqt hamesha chhoot jati hai.',
    difficulty: 'MEDIUM',
    duration: 34,
    order: 3,

    analogy: {
      en: '**A recipe card versus a recipe with a "makes 4/8/12 servings" note.** Plain CSS is writing out the full recipe separately for 4, 8, and 12 servings — three complete, nearly-identical documents, and if you fix a typo in one you must remember to fix it in the other two. A Sass mixin is one recipe with a parameter: "multiply the flour by however many servings you asked for." Write the logic once, and every serving size is generated correctly from it — including a size nobody has asked for yet.',
      hi: '**Ek recipe card aur "4/8/12 servings banati hai" wale note wali recipe.** Saadhi CSS matlab 4, 8, aur 12 servings ke liye poori recipe alag-alag likhna — teen poore, lagbhag ek jaise documents, aur ek mein typo theek karo to doosre do mein bhi yaad rakhkar theek karna padta hai. Sass mixin ek parameter wali ek recipe hai: "maida ko utni baar guna karo jitni servings maangi gayi hain." Logic ek baar likho, aur har serving size usse sahi banti hai — un sameet jinhe abhi tak kisi ne maanga hi nahi.',
    },

    simple: `**Start broken.** Five button variants, hand-copied:

\`\`\`css
.btn-primary   { padding: 8px 16px; border-radius: 4px; font-weight: 600; background: #2563eb; color: white; }
.btn-danger    { padding: 8px 16px; border-radius: 4px; font-weight: 600; background: #dc2626; color: white; }
.btn-success   { padding: 8px 16px; border-radius: 4px; font-weight: 600; background: #16a34a; color: white; }
\`\`\`

Three declarations are identical in every rule; only \`background\` changes. Now design updates \`border-radius\` from \`4px\` to \`6px\` project-wide. Someone finds and edits \`.btn-primary\` and \`.btn-danger\`, and misses \`.btn-success\` because it was defined in a different file six scrolls down. It ships. Nobody notices for two weeks, until a designer screenshots the mismatch.

**Sass fixes this with a mixin — a reusable, parametrised block**

\`\`\`scss
@mixin button-variant($bg) {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  background: $bg;
  color: white;
}

.btn-primary { @include button-variant(#2563eb); }
.btn-danger  { @include button-variant(#dc2626); }
.btn-success { @include button-variant(#16a34a); }
\`\`\`

Now the shared declarations exist in **exactly one place**. Changing \`border-radius\` means editing the mixin once; every variant that includes it updates automatically, because there is nothing left to forget — there is only one copy of the logic, not five.

**Sass is a preprocessor, not something a browser understands**

\`\`\`
you write .scss  →  a build tool compiles it  →  the browser only ever sees plain .css
\`\`\`

A browser has never executed a single line of \`$variable\` or \`@mixin\` in its life. The \`.scss\` file is translated into ordinary CSS *before* it is shipped — which is exactly why \`var(--brand)\` (a real, runtime CSS feature, covered in Module 6's first lesson) and \`$brand\` (a Sass variable, gone by the time the browser sees it) behave so differently: one exists in the browser, the other never did.

**The features that made Sass worth reaching for, and what native CSS has since absorbed**

\`\`\`scss
// Sass nesting — native CSS has this now (Module 6, lesson 2)
.card { &:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.1); } }

// Sass variables — native CSS custom properties cover MOST of this now (Module 6, lesson 1)
$brand: #2563eb;
\`\`\`

\`\`\`scss
// Sass mixins with parameters — native CSS still has NOTHING equivalent
@mixin button-variant($bg) { background: $bg; padding: 8px 16px; }

// Sass loops generating a whole family of rules — native CSS still has NOTHING equivalent
@each $name, $color in (primary: blue, danger: red, success: green) {
  .btn-#{$name} { @include button-variant($color); }
}
\`\`\`

Nesting and variables — the two reasons most people first reached for Sass — are now native CSS features covered elsewhere in this module. **Mixins with parameters and loops over a list of values are what native CSS still cannot do**, and that gap is the honest, current reason to still reach for Sass on a real project.

**Remember:** if you are copy-pasting a block of CSS and changing one value each time, that is exactly the shape of problem a mixin solves — and it is the one job left that native CSS genuinely cannot do alone.`,

    simpleHi: `**Toote hue se shuru.** Paanch button variants, haath se copy kiye hue:

\`\`\`css
.btn-primary   { padding: 8px 16px; border-radius: 4px; font-weight: 600; background: #2563eb; color: white; }
.btn-danger    { padding: 8px 16px; border-radius: 4px; font-weight: 600; background: #dc2626; color: white; }
.btn-success   { padding: 8px 16px; border-radius: 4px; font-weight: 600; background: #16a34a; color: white; }
\`\`\`

Teen declarations har rule mein bilkul ek jaisi hain; sirf \`background\` badalta hai. Ab design \`border-radius\` ko \`4px\` se \`6px\` poore project mein badalta hai. Koi \`.btn-primary\` aur \`.btn-danger\` dhoondh kar edit karta hai, aur \`.btn-success\` chhoot jaata hai kyunki wo ek alag file mein chhe scroll neeche define kiya gaya tha. Ye ship ho jata hai. Do hafte tak koi nahi jaanta, jab tak ek designer mismatch ka screenshot nahi leta.

**Sass ise ek mixin se theek karta hai — ek reusable, parametrised block**

\`\`\`scss
@mixin button-variant($bg) {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  background: $bg;
  color: white;
}

.btn-primary { @include button-variant(#2563eb); }
.btn-danger  { @include button-variant(#dc2626); }
.btn-success { @include button-variant(#16a34a); }
\`\`\`

Ab saanjhi declarations **bilkul ek hi jagah** maujood hain. \`border-radius\` badalna matlab mixin ko ek baar edit karna; use \`@include\` karne wala har variant apne aap update ho jata hai, kyunki bhoolne ko kuch bacha hi nahi — logic ki sirf ek copy hai, paanch nahi.

**Sass ek preprocessor hai, aisi cheez nahi jise browser samajhta hai**

\`\`\`
aap .scss likhte ho  →  ek build tool use compile karta hai  →  browser ko sirf saadhi .css hi dikhti hai
\`\`\`

Browser ne apni zindagi mein kabhi ek bhi \`$variable\` ya \`@mixin\` ki line chalayi nahi. \`.scss\` file bheje jaane se *pehle* saadhi CSS mein translate ki jati hai — bilkul isi wajah se \`var(--brand)\` (ek asli, runtime CSS feature, Module 6 ke pehle lesson mein) aur \`$brand\` (ek Sass variable, browser ko dikhte-dikhte gayab) itne alag vyavhaar karte hain: ek browser mein maujood hai, doosra kabhi tha hi nahi.

**Jo features Sass uthaana kaam ka banate the, aur native CSS ne unme se kya sameet liya hai**

\`\`\`scss
// Sass nesting — native CSS mein ab ye hai (Module 6, lesson 2)
.card { &:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.1); } }

// Sass variables — native CSS custom properties ab isme se ZYADATAR cover karti hain (Module 6, lesson 1)
$brand: #2563eb;
\`\`\`

\`\`\`scss
// Parameters wale Sass mixins — native CSS ke paas ab bhi iske barabar KUCH NAHI hai
@mixin button-variant($bg) { background: $bg; padding: 8px 16px; }

// Values ki list par rules ka poora parivar banaane wale Sass loops — native CSS ke paas ab bhi iske barabar KUCH NAHI hai
@each $name, $color in (primary: blue, danger: red, success: green) {
  .btn-#{$name} { @include button-variant($color); }
}
\`\`\`

Nesting aur variables — jo do wajah zyadatar log pehle Sass uthaate the — ab is module ke doosri jagah cover ki hui native CSS features hain. **Parameters wale mixins aur values ki list par loops wo hai jo native CSS ab bhi nahi kar sakta**, aur yahi gap asli, abhi ki wajah hai ki asli project mein Sass abhi bhi uthaya jaye.

**Yaad rakho:** agar aap CSS ka block copy-paste kar rahe ho aur har baar ek value badal rahe ho, ye bilkul us samasya ki shakal hai jise mixin hal karta hai — aur ye wo ek kaam bacha hai jo native CSS akela sach mein nahi kar sakta.`,

    content: `## Sass compiles to plain CSS — nothing more, nothing less

\`\`\`
input.scss  →  [sass compiler, e.g. dart-sass, or your bundler's built-in loader]  →  output.css
\`\`\`

\`\`\`bash
npx sass input.scss output.css       # one-off compile
npx sass --watch input.scss output.css   # recompile automatically on save
\`\`\`

Every modern build tool (Vite, webpack, Next.js) has Sass support built in or a one-line plugin away, so in practice you rarely run the compiler by hand — you just import a \`.scss\` file and the bundler compiles it as part of the build. The output is always plain, ordinary \`.css\`; nothing about \`$variables\`, \`@mixin\`, or nesting survives into what actually ships to the browser.

## Variables

\`\`\`scss
$brand: #2563eb;
$spacing: 8px;

.btn { background: $brand; padding: $spacing * 2; }
\`\`\`

Compiles to:

\`\`\`css
.btn { background: #2563eb; padding: 16px; }
\`\`\`

The variable name is gone entirely in the output — \`$brand\` never existed as far as the shipped CSS is concerned, which is the core difference from a custom property covered in this module's first lesson: a Sass variable cannot be read or changed by JavaScript, cannot vary by theme without a full recompile, and has no equivalent of a fallback value, because by the time the browser has the file, it was never a variable to begin with.

## Nesting (native CSS has this too now — see Module 6, lesson 2)

\`\`\`scss
.card {
  padding: 16px;
  &:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
  .title { font-weight: 600; }
}
\`\`\`

Compiles to:

\`\`\`css
.card { padding: 16px; }
.card:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.card .title { font-weight: 600; }
\`\`\`

## Mixins — the genuinely irreplaceable feature

\`\`\`scss
@mixin flex-center($direction: row) {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: $direction;
}

.a { @include flex-center; }
.b { @include flex-center(column); }
\`\`\`

Compiles to:

\`\`\`css
.a { display: flex; align-items: center; justify-content: center; flex-direction: row; }
.b { display: flex; align-items: center; justify-content: center; flex-direction: column; }
\`\`\`

A mixin is a reusable **block of declarations**, optionally parametrised, inserted wherever \`@include\`d. This is fundamentally different from a custom property, which holds one *value* — a mixin can bundle an arbitrary number of properties, media queries, and even nested rules into one reusable unit with its own default parameter values. Native CSS has no equivalent: there is no way to define a named, reusable, parametrised group of declarations in plain CSS today.

## @extend — sharing rules through inheritance instead of duplication

\`\`\`scss
.btn-base { padding: 8px 16px; border-radius: 4px; font-weight: 600; }
.btn-primary { @extend .btn-base; background: #2563eb; color: white; }
\`\`\`

Compiles to:

\`\`\`css
.btn-base, .btn-primary { padding: 8px 16px; border-radius: 4px; font-weight: 600; }
.btn-primary { background: #2563eb; color: white; }
\`\`\`

Unlike a mixin, which copies the declarations into every place it is included, \`@extend\` merges the selectors together at compile time, sharing one rule block. In practice, most style guides now prefer mixins over \`@extend\`, because \`@extend\`\'s selector-merging behaviour can produce surprising, hard-to-predict output once used across many files — this is presented here for recognition, not as the recommended default.

## Functions — computing a value, not a block of declarations

\`\`\`scss
@function rem($px) {
  @return ($px / 16) * 1rem;
}

.card { padding: rem(24); }
\`\`\`

Compiles to:

\`\`\`css
.card { padding: 1.5rem; }
\`\`\`

A function returns a single value, unlike a mixin which inserts a block of declarations — this is Sass's equivalent of a small utility function, used here to convert a pixel design-spec number into a \`rem\` value automatically instead of doing the division by hand every time.

## @each and @for — generating a whole family of rules from a list

\`\`\`scss
$colors: (primary: #2563eb, danger: #dc2626, success: #16a34a);

@each $name, $color in $colors {
  .btn-#{$name} { background: $color; }
}
\`\`\`

Compiles to:

\`\`\`css
.btn-primary { background: #2563eb; }
.btn-danger { background: #dc2626; }
.btn-success { background: #16a34a; }
\`\`\`

\`@each\` loops over a Sass **map** (a set of key-value pairs) at compile time, generating one rule per entry. Adding a fourth colour to the \`$colors\` map generates a fourth \`.btn-\` class automatically, with no new CSS hand-written — this is the loop-based rule generation native CSS still has no way to express.

## Partials and @use — splitting a large stylesheet into files

\`\`\`scss
// _variables.scss  (the leading underscore marks it a "partial" — not compiled to its own .css file)
$brand: #2563eb;
$spacing: 8px;
\`\`\`

\`\`\`scss
// main.scss
@use 'variables' as v;
.btn { background: v.$brand; padding: v.$spacing; }
\`\`\`

\`@use\` (the modern replacement for the older \`@import\`) loads another Sass file's variables, mixins, and functions into a namespace, so a large design system can be split across many small files — \`_colors.scss\`, \`_typography.scss\`, \`_buttons.scss\` — instead of one unmanageable thousand-line file, while still compiling down to a single CSS output.`,

    contentHi: `## Sass saadhi CSS mein compile hota hai — na kam, na zyada

\`\`\`
input.scss  →  [sass compiler, jaise dart-sass, ya aapke bundler ka built-in loader]  →  output.css
\`\`\`

\`\`\`bash
npx sass input.scss output.css       # ek-baar compile
npx sass --watch input.scss output.css   # save karte hi apne aap dobara compile
\`\`\`

Har modern build tool (Vite, webpack, Next.js) mein Sass support built-in hai ya ek-line ka plugin door hai, isliye amal mein aap shayad hi compiler haath se chalate ho — bas ek \`.scss\` file import karte ho aur bundler use build ke hisse ki tarah compile kar deta hai. Output hamesha saadhi, aam \`.css\` hoti hai; \`$variables\`, \`@mixin\`, ya nesting ke baare mein kuch bhi browser ko asal mein bheji jaane wali cheez tak nahi bachta.

## Variables

\`\`\`scss
$brand: #2563eb;
$spacing: 8px;

.btn { background: $brand; padding: $spacing * 2; }
\`\`\`

Compile hota hai:

\`\`\`css
.btn { background: #2563eb; padding: 16px; }
\`\`\`

Variable ka naam output mein poori tarah gayab hai — shipped CSS ke hisaab se \`$brand\` kabhi wajood mein tha hi nahi, aur yahi is module ke pehle lesson mein cover ki hui custom property se bunyaadi fark hai: Sass variable ko JavaScript se na padha ja sakta hai na badla ja sakta hai, poore recompile ke bina theme ke hisaab se nahi badal sakta, aur uska koi fallback value jaisa kuch nahi hai, kyunki jab tak browser ke paas file pahunchti hai, wo shuru se hi variable thi hi nahi.

## Nesting (native CSS mein ab ye bhi hai — dekho Module 6, lesson 2)

\`\`\`scss
.card {
  padding: 16px;
  &:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
  .title { font-weight: 600; }
}
\`\`\`

Compile hota hai:

\`\`\`css
.card { padding: 16px; }
.card:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.card .title { font-weight: 600; }
\`\`\`

## Mixins — asal mein badla na ja sakne wala feature

\`\`\`scss
@mixin flex-center($direction: row) {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: $direction;
}

.a { @include flex-center; }
.b { @include flex-center(column); }
\`\`\`

Compile hota hai:

\`\`\`css
.a { display: flex; align-items: center; justify-content: center; flex-direction: row; }
.b { display: flex; align-items: center; justify-content: center; flex-direction: column; }
\`\`\`

Mixin **declarations ka ek block** hai, jo optionally parametrised hai, jahan bhi \`@include\` kiya jaye wahan daala jata hai. Ye custom property se bunyaadi taur par alag hai, jo ek *value* rakhti hai — mixin properties, media queries, aur nested rules tak ki koi bhi ginti ek reusable unit mein apni default parameter values ke saath bundle kar sakta hai. Native CSS ke paas iske barabar kuch nahi hai: aaj saadhi CSS mein declarations ka ek naamit, reusable, parametrised samooh define karne ka koi tarika nahi hai.

## @extend — dohraane ke bajaye inheritance se rules baantna

\`\`\`scss
.btn-base { padding: 8px 16px; border-radius: 4px; font-weight: 600; }
.btn-primary { @extend .btn-base; background: #2563eb; color: white; }
\`\`\`

Compile hota hai:

\`\`\`css
.btn-base, .btn-primary { padding: 8px 16px; border-radius: 4px; font-weight: 600; }
.btn-primary { background: #2563eb; color: white; }
\`\`\`

Mixin ke ulat, jo declarations ko har jagah copy karta hai jahan wo include hota hai, \`@extend\` compile time par selectors ko jodkar ek rule block share karta hai. Amal mein, zyadatar style guides ab \`@extend\` se zyada mixins pasand karte hain, kyunki \`@extend\` ka selector-jodne wala vyavhaar kai files mein use hone par chaunkaana wala, andaza lagana mushkil output paida kar sakta hai — ye yahan pehchaan ke liye diya gaya hai, recommended default ki tarah nahi.

## Functions — declarations ka block nahi, ek value ganit karna

\`\`\`scss
@function rem($px) {
  @return ($px / 16) * 1rem;
}

.card { padding: rem(24); }
\`\`\`

Compile hota hai:

\`\`\`css
.card { padding: 1.5rem; }
\`\`\`

Function ek akeli value lautaata hai, mixin ke ulat jo declarations ka block daalta hai — ye Sass ka chhote utility function jaisa hai, yahan pixel design-spec number ko har baar haath se bhaag karne ke bajaye apne aap \`rem\` value mein badalne ke liye use hua hai.

## @each aur @for — ek list se rules ka poora parivar banaana

\`\`\`scss
$colors: (primary: #2563eb, danger: #dc2626, success: #16a34a);

@each $name, $color in $colors {
  .btn-#{$name} { background: $color; }
}
\`\`\`

Compile hota hai:

\`\`\`css
.btn-primary { background: #2563eb; }
.btn-danger { background: #dc2626; }
.btn-success { background: #16a34a; }
\`\`\`

\`@each\` compile time par ek Sass **map** (key-value pairs ka set) par loop karta hai, har entry ke liye ek rule banate hue. \`$colors\` map mein chautha rang jodne se apne aap chautha \`.btn-\` class ban jata hai, koi nayi CSS haath se likhe bina — ye loop-based rule generation hai jo native CSS abhi bhi bata nahi sakta.

## Partials aur @use — badi stylesheet ko files mein baantna

\`\`\`scss
// _variables.scss  (aage ka underscore ise "partial" nishaan lagata hai — apni khud ki .css file mein compile nahi hota)
$brand: #2563eb;
$spacing: 8px;
\`\`\`

\`\`\`scss
// main.scss
@use 'variables' as v;
.btn { background: v.$brand; padding: v.$spacing; }
\`\`\`

\`@use\` (purane \`@import\` ka modern badla) doosri Sass file ki variables, mixins, aur functions ko ek namespace mein laata hai, isliye ek badi design system kai chhoti files mein baanti ja sakti hai — \`_colors.scss\`, \`_typography.scss\`, \`_buttons.scss\` — ek hazaar-line ki na-sambhalne-layak file ke bajaye, phir bhi ek akeli CSS output tak compile karte hue.`,

    examples: [
      {
        title: 'The broken version: five copy-pasted button rules',
        titleHi: 'Toota version: paanch copy-pasted button rules',
        code: `.btn-primary { padding: 8px 16px; border-radius: 4px; font-weight: 600; background: #2563eb; color: white; }
.btn-danger  { padding: 8px 16px; border-radius: 4px; font-weight: 600; background: #dc2626; color: white; }
.btn-success { padding: 8px 16px; border-radius: 4px; font-weight: 600; background: #16a34a; color: white; }`,
        preview: page(`<button class="a">Primary</button>
<button class="b">Danger</button>
<button class="c">Success</button>
<p style="font-size:13px;color:#666;margin-top:8px">All three CSS rules were hand-copied. Fixing border-radius means finding and editing all three separately.</p>`,
`.a,.b,.c { padding:8px 16px; border-radius:4px; font-weight:600; color:white; border:0; margin-right:6px; }
.a { background:#2563eb; } .b { background:#dc2626; } .c { background:#16a34a; }`),
        previewHeight: 130,
        explain: 'Three declarations — padding, border-radius, font-weight — are byte-for-byte identical in every rule, duplicated by hand. This is the exact shape of problem a mixin exists to solve.',
        explainHi: 'Teen declarations — padding, border-radius, font-weight — har rule mein byte-ke-byte ek jaisi hain, haath se dohraayi hui. Ye bilkul us samasya ki shakal hai jise mixin hal karne ke liye hai.',
      },
      {
        title: 'The fix: a parametrised mixin (SCSS source shown, compiled CSS previewed)',
        titleHi: 'Fix: ek parametrised mixin (SCSS source dikhaya, compiled CSS ka preview)',
        code: `@mixin button-variant($bg) {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  background: $bg;
  color: white;
}

.btn-primary { @include button-variant(#2563eb); }
.btn-danger  { @include button-variant(#dc2626); }
.btn-success { @include button-variant(#16a34a); }`,
        preview: page(`<button class="a">Primary</button>
<button class="b">Danger</button>
<button class="c">Success</button>
<p style="font-size:13px;color:#666;margin-top:8px">Same visual result — but the shared declarations now exist in exactly ONE place: the mixin. This preview shows what the SCSS compiles to.</p>`,
`.a,.b,.c { padding:8px 16px; border-radius:6px; font-weight:600; color:white; border:0; margin-right:6px; }
.a { background:#2563eb; } .b { background:#dc2626; } .c { background:#16a34a; }`),
        previewHeight: 130,
        explain: 'The compiled CSS is nearly identical to the broken version — that is the point. What changed is the SOURCE: editing border-radius now means editing the mixin once, and every variant regenerates correctly on the next build.',
        explainHi: 'Compiled CSS toote version se lagbhag milta-julta hai — baat yahi hai. Jo badla hai wo SOURCE hai: ab border-radius edit karne ka matlab hai mixin ko ek baar edit karna, aur agli build par har variant sahi tarike se dobara ban jata hai.',
      },
      {
        title: 'Variables: $brand exists at compile time, not in the browser',
        titleHi: 'Variables: $brand compile time par maujood hai, browser mein nahi',
        code: `$brand: #2563eb;
$spacing: 8px;

.btn { background: $brand; padding: $spacing * 2; }
/* compiles to: .btn { background: #2563eb; padding: 16px; } */`,
        preview: page(`<button class="btn">Uses the compiled value directly</button>
<p style="font-size:13px;color:#666;margin-top:8px">The shipped CSS contains #2563eb, not $brand — the variable name is gone by the time this HTML page loads it.</p>`,
`.btn { background:#2563eb; padding:16px; color:white; border:0; font-size:14px; }`),
        previewHeight: 130,
        explain: 'This is the whole difference from Module 6\'s custom properties lesson: this literal #2563eb cannot be changed by JavaScript at runtime, because $brand never made it into the shipped file as anything but a fixed value.',
        explainHi: 'Module 6 ke custom properties lesson se poora fark yahi hai: ye kachcha #2563eb JavaScript se runtime par badla nahi ja sakta, kyunki $brand shipped file mein ek fixed value ke alawa kuch bhi bankar pahuncha hi nahi.',
      },
      {
        title: 'Nesting compiles to flat selectors',
        titleHi: 'Nesting flat selectors mein compile hoti hai',
        code: `.card {
  padding: 16px;
  &:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
  .title { font-weight: 600; }
}
/* compiles to three separate flat rules */`,
        preview: page(`<div class="card"><p class="title">Hover this card</p></div>`,
`.card { padding:16px; background:#f8fafc; border:1px solid #e2e8f0; }
.card:hover { box-shadow:0 4px 10px rgba(0,0,0,0.1); }
.card .title { font-weight:600; margin:0; }`),
        previewHeight: 110,
        explain: 'The nested SCSS source and the flat compiled CSS in this preview produce identical behaviour — this is the same conceptual result Module 6\'s native CSS nesting lesson showed, just arriving via a build step instead of the browser itself.',
        explainHi: 'Nested SCSS source aur is preview ki flat compiled CSS ek jaisa vyavhaar dete hain — ye Module 6 ke native CSS nesting lesson jaisa hi concept ka nateeja hai, bas browser ke bajaye ek build step ke zariye pahunchta hai.',
      },
      {
        title: 'A mixin with a default parameter value',
        titleHi: 'Default parameter value wala mixin',
        code: `@mixin flex-center($direction: row) {
  display: flex; align-items: center; justify-content: center; flex-direction: $direction;
}
.a { @include flex-center; }           // uses the default: row
.b { @include flex-center(column); }   // overrides it`,
        preview: page(`<div class="a">row (default)</div>
<div class="b">column<br>(overridden)</div>`,
`.a { display:flex; align-items:center; justify-content:center; flex-direction:row; height:50px; background:#dbeafe; margin-bottom:6px; font-size:13px; }
.b { display:flex; align-items:center; justify-content:center; flex-direction:column; height:80px; background:#bbf7d0; font-size:13px; text-align:center; }`),
        previewHeight: 180,
        explain: 'Calling the mixin with no argument uses the default row direction; passing column overrides it. Default parameter values are a mixin feature with no equivalent in native CSS, which has no concept of an optional argument to a group of declarations.',
        explainHi: 'Mixin ko bina argument bulaane par default row direction use hoti hai; column pass karne se wo override hoti hai. Default parameter values mixin ka aisa feature hai jiska native CSS mein koi barabar nahi, jahan declarations ke ek samooh ko optional argument dene ka koi concept hi nahi.',
      },
      {
        title: 'Functions compute a value, not a block',
        titleHi: 'Functions ek value ganit karte hain, block nahi',
        code: `@function rem($px) {
  @return ($px / 16) * 1rem;
}
.card { padding: rem(24); }   // compiles to: padding: 1.5rem;`,
        preview: page(`<div class="card">padding: rem(24) → compiled to 1.5rem</div>`,
`.card { padding:1.5rem; background:#dbeafe; font-size:13px; }`),
        previewHeight: 90,
        explain: 'A function converts a design-spec pixel number into a rem value automatically, at compile time, instead of a developer doing the division by hand and risking a typo every single time it is used.',
        explainHi: 'Function ek design-spec pixel number ko compile time par apne aap rem value mein badal deta hai, developer ko haath se bhaag karke har baar galti ka khatra uthaane ke bajaye.',
      },
      {
        title: '@each generates a whole family of classes from one map',
        titleHi: '@each ek map se classes ka poora parivar banaata hai',
        code: `$colors: (primary: #2563eb, danger: #dc2626, success: #16a34a);
@each $name, $color in $colors {
  .btn-#{$name} { background: $color; padding: 8px 16px; color: white; border-radius: 4px; }
}`,
        preview: page(`<button class="btn-primary">btn-primary</button>
<button class="btn-danger">btn-danger</button>
<button class="btn-success">btn-success</button>
<p style="font-size:13px;color:#666;margin-top:8px">All three classes were generated from ONE @each loop over a three-entry map — adding a fourth colour to the map alone would generate a fourth class.</p>`,
`.btn-primary,.btn-danger,.btn-success { padding:8px 16px; color:white; border:0; border-radius:4px; margin-right:6px; }
.btn-primary { background:#2563eb; } .btn-danger { background:#dc2626; } .btn-success { background:#16a34a; }`),
        previewHeight: 140,
        explain: 'No developer wrote three separate class rules by hand — the loop generated all three from a single map of name-colour pairs. This loop-driven rule generation has no equivalent anywhere in native CSS.',
        explainHi: 'Kisi developer ne teen alag class rules haath se nahi likhe — loop ne unhe naam-rang pairs ke ek akele map se banaya. Is loop-driven rule generation ka koi barabar native CSS mein kahin nahi hai.',
      },
      {
        title: '@extend merges selectors instead of duplicating declarations',
        titleHi: '@extend declarations dohraane ke bajaye selectors ko jodta hai',
        code: `.btn-base { padding: 8px 16px; border-radius: 4px; font-weight: 600; }
.btn-primary { @extend .btn-base; background: #2563eb; color: white; }
/* compiles to: .btn-base, .btn-primary { padding...; } .btn-primary { background...; } */`,
        preview: page(`<button class="btn-primary">Primary — via @extend</button>
<p style="font-size:13px;color:#666;margin-top:8px">Compiled output merges .btn-base and .btn-primary into one shared selector list, rather than copying the shared declarations into .btn-primary directly the way a mixin would.</p>`,
`.btn-primary { padding:8px 16px; border-radius:4px; font-weight:600; background:#2563eb; color:white; border:0; }`),
        previewHeight: 110,
        explain: 'The visual result is identical to a mixin-based approach, but the generated CSS structure differs — @extend shares one rule block across multiple selectors, which most teams now avoid in favour of mixins because it is harder to predict at scale.',
        explainHi: 'Drishya nateeja mixin-based tarike jaisa hi hai, par banaya gaya CSS dhancha alag hai — @extend ek rule block ko kai selectors mein baantta hai, jise zyadatar teams ab mixins ke haq mein chhodti hain kyunki bade paimane par andaza lagana mushkil hai.',
      },
      {
        title: 'A theme built with Sass variables versus one built with custom properties',
        titleHi: 'Sass variables se bana theme aur custom properties se bana theme',
        code: `// Sass — fixed at compile time, cannot change without a rebuild
$brand: #2563eb;
.btn { background: $brand; }

/* Native CSS custom property — this ONE can be changed live, from JavaScript, after load */
:root { --brand: #2563eb; }
.btn { background: var(--brand); }`,
        preview: page(`<button class="sass-btn">Sass $brand — fixed forever in this file</button>
<button class="css-btn" id="live">CSS var(--brand) — click to change it live</button>
<script>document.getElementById('live').onclick = () => document.documentElement.style.setProperty('--brand', '#dc2626');</script>`,
`:root { --brand:#2563eb; }
.sass-btn { background:#2563eb; color:white; border:0; padding:8px 16px; margin-right:8px; }
.css-btn { background:var(--brand); color:white; border:0; padding:8px 16px; }`),
        previewHeight: 110,
        explain: 'Click the second button — it changes colour live via JavaScript, because var(--brand) is a real runtime value. The first button\'s colour could never do this; #2563eb is all that survived compilation, with no memory that $brand ever existed.',
        explainHi: 'Doosra button click karo — wo JavaScript se live rang badalta hai, kyunki var(--brand) ek asli runtime value hai. Pehle button ka rang ye kabhi nahi kar sakta; compile hone ke baad sirf #2563eb bacha, jise yaad hi nahi ki $brand kabhi wajood mein tha.',
      },
    ],

    mistakes: [
      {
        wrong: `.btn-primary { padding: 8px 16px; border-radius: 4px; background: blue; }
.btn-danger  { padding: 8px 16px; border-radius: 4px; background: red; }
/* shared declarations copy-pasted across every variant */`,
        right: `@mixin button-variant($bg) { padding: 8px 16px; border-radius: 4px; background: $bg; }
.btn-primary { @include button-variant(blue); }
.btn-danger  { @include button-variant(red); }`,
        why: 'Copy-pasted shared declarations across variants means a future style update (like changing border-radius) has to be found and edited in every single copy — miss one and it silently drifts out of sync. A mixin puts the shared logic in exactly one place.',
        whyHi: 'Variants mein copy-paste ki hui saanjhi declarations ka matlab hai ki future style update (jaise border-radius badalna) har akeli copy mein dhoondh kar edit karna padta hai — ek chhoot jaye to wo chupchap alag ho jata hai. Mixin saanjhi logic ko bilkul ek jagah rakhta hai.',
      },
      {
        wrong: `$brand: #2563eb;
.btn { background: $brand; }
/* the marketing team wants a per-tenant customizable brand colour — impossible without a full recompile per tenant */`,
        right: `:root { --brand: #2563eb; }
.btn { background: var(--brand); }
/* document.documentElement.style.setProperty('--brand', tenantColor) at runtime */`,
        why: 'A Sass variable is resolved once at compile time and cannot be changed after the CSS ships — a per-user or per-tenant theme requires a real runtime value, which only a CSS custom property provides, not a Sass variable.',
        whyHi: 'Sass variable compile time par ek baar resolve hoti hai aur CSS bheje jaane ke baad badli nahi ja sakti — per-user ya per-tenant theme ke liye ek asli runtime value chahiye, jo sirf CSS custom property deti hai, Sass variable nahi.',
      },
      {
        wrong: `.a { @extend .b; }
.b { @extend .c; }
.c { @extend .d; }
/* long @extend chains produce unpredictable, hard-to-trace compiled selectors */`,
        right: `@mixin shared-base { /* declarations here */ }
.a { @include shared-base; }
.b { @include shared-base; }`,
        why: '@extend chains can produce large, surprising selector lists in the compiled output that are difficult to reason about, especially across many files. Most modern Sass style guides prefer mixins for sharing declarations, reserving @extend for narrow, well-understood cases.',
        whyHi: '@extend chains compiled output mein bade, chaunkaane wale selector lists bana sakti hain jinke baare mein sochna mushkil hai, khaas taur par kai files mein. Zyadatar modern Sass style guides declarations baantne ke liye mixins pasand karte hain, @extend ko sankre, achhi tarah samjhe hue cases ke liye rakhte hain.',
      },
    ],

    realWorld: [
      {
        en: '**Large design systems still ship Sass alongside native CSS custom properties.** Bootstrap, for example, is built with Sass specifically for its mixin-driven responsive grid and utility generation, while also outputting CSS custom properties consumers can override at runtime — the two approaches are complementary, not competing.',
        hi: '**Badi design systems ab bhi native CSS custom properties ke saath Sass bhejti hain.** Bootstrap, misaal ke taur par, khaas taur par apni mixin-driven responsive grid aur utility generation ke liye Sass se bana hai, saath hi CSS custom properties bhi deta hai jo consumers runtime par override kar sakte hain — dono tarike ek doosre ke poorak hain, mukabla nahi.',
      },
      {
        en: '**Component libraries generate entire utility class sets from Sass loops.** A spacing scale of `.p-1` through `.p-12`, or a colour palette of fifty shades, is nearly always one `@each` loop over a Sass map, not fifty hand-written rules.',
        hi: '**Component libraries poori tarah Sass loops se utility class sets banati hain.** \`.p-1\` se \`.p-12\` tak ka spacing scale, ya pachaas shades ka colour palette, lagbhag hamesha Sass map par ek \`@each\` loop hi hai, pachaas haath se likhe rules nahi.',
      },
      {
        en: '**Sass remains the default in enterprise CSS architecture (ITCSS, 7-1 pattern) for its partial/@use file-splitting**, letting a stylesheet with thousands of rules stay organised across dozens of small, purpose-named files while still compiling to one optimised output.',
        hi: '**Enterprise CSS architecture (ITCSS, 7-1 pattern) mein Sass abhi bhi default hai apni partial/@use file-splitting ke liye**, jo hazaaron rules wali stylesheet ko dus chhoti, purpose-named files mein organised rakhne deta hai, phir bhi ek optimised output mein compile karte hue.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the fundamental difference between Sass and CSS, and why does that mean a browser never runs Sass directly?',
        qHi: 'Sass aur CSS mein bunyaadi fark kya hai, aur iska matlab kyun hai ki browser kabhi seedha Sass nahi chalaata?',
        a: 'Sass is a preprocessor language — it is compiled into plain CSS by a build tool before the output ever reaches a browser. Browsers have no built-in support for Sass syntax like `$variables`, `@mixin`, or `@extend`; they only understand the plain CSS that results after compilation. This is the same relationship TypeScript has to JavaScript: you author in the richer language, a build step translates it, and only the translated output ever actually executes in the runtime environment.',
        aHi: 'Sass ek preprocessor language hai — build tool use browser tak pahunchne se pehle saadhi CSS mein compile kar deta hai. Browsers ko \`$variables\`, \`@mixin\`, ya \`@extend\` jaise Sass syntax ka koi built-in support nahi hai; wo sirf wo saadhi CSS samajhte hain jo compilation ke baad milti hai. Ye TypeScript aur JavaScript ka rishta hai: aap zyada rich language mein likhte ho, ek build step use translate karta hai, aur sirf translate hua output hi asal mein runtime environment mein chalta hai.',
      },
      {
        q: 'Since native CSS now has custom properties and nesting, what is the honest remaining reason to reach for Sass on a new project?',
        qHi: 'Native CSS mein ab custom properties aur nesting hai, to naye project mein Sass uthaane ki asli bachi hui wajah kya hai?',
        a: 'Mixins with parameters, and compile-time loops/logic over lists (`@each`, `@for`, functions), have no native CSS equivalent. A mixin bundles an arbitrary number of declarations — including nested rules and media queries — into a named, reusable, parametrised unit, which native CSS cannot express at all; the closest native tool, a custom property, holds only a single value. Loop constructs that generate a whole family of rules from a data structure (a colour map, a spacing scale) are similarly unique to Sass. Variables and nesting, historically Sass\'s two headline features, are the parts native CSS has genuinely absorbed.',
        aHi: 'Parameters wale mixins, aur lists par compile-time loops/logic (\`@each\`, \`@for\`, functions), ka koi native CSS barabar nahi hai. Mixin declarations ki kisi bhi ginti ko — nested rules aur media queries sameet — ek naamit, reusable, parametrised unit mein bundle karta hai, jo native CSS bilkul bata nahi sakta; sabse kareeb native auzaar, custom property, sirf ek akeli value rakhti hai. Ek data structure (colour map, spacing scale) se rules ka poora parivar banaane wale loop constructs bhi isi tarah sirf Sass mein hain. Variables aur nesting, jo itihaas mein Sass ki do sabse badi khoobiyaan thi, wo hisse hain jo native CSS ne sach mein sameet liye hain.',
      },
      {
        q: 'Why can\'t a Sass variable be changed at runtime the way a CSS custom property can?',
        qHi: 'Sass variable ko runtime par kyun nahi badla ja sakta jaise CSS custom property badli ja sakti hai?',
        a: 'A Sass variable is resolved entirely at compile time — the build tool substitutes every `$variable` reference with its literal value before generating the output CSS, and that variable\'s name does not exist anywhere in the shipped file. A CSS custom property, by contrast, is a real value the browser tracks live as part of the cascade, which JavaScript can read and write after the page has loaded via `getPropertyValue`/`setProperty`. This is why runtime theming — a user-selectable accent colour, a live theme switcher — requires custom properties and cannot be built with Sass variables alone.',
        aHi: 'Sass variable poori tarah compile time par resolve hoti hai — build tool har \`$variable\` reference ko output CSS banane se pehle uski literal value se badal deta hai, aur us variable ka naam shipped file mein kahin bhi wajood nahi rakhta. Iske ulat, CSS custom property ek asli value hai jise browser cascade ke hisse ki tarah live track karta hai, jise JavaScript page load hone ke baad \`getPropertyValue\`/\`setProperty\` se padh aur likh sakta hai. Isiliye runtime theming — user-chuna accent colour, live theme switcher — ko custom properties chahiye aur akele Sass variables se nahi ban sakta.',
      },
      {
        q: 'What does a Sass mixin do that a Sass function does not, and vice versa?',
        qHi: 'Sass mixin wo kya karta hai jo Sass function nahi karta, aur ulta?',
        a: 'A mixin, invoked with `@include`, inserts a reusable block of one or more CSS declarations (properties and values, potentially including nested rules) wherever it is called. A function, invoked directly as a value and returning via `@return`, computes and returns a single value — a colour, a length, a number — to be used inline within some other declaration. In short: reach for a mixin when you need to emit CSS rules; reach for a function when you need to calculate a value that goes into one.',
        aHi: 'Mixin, \`@include\` se bulaya jaata hai, jahan bhi bulaya jaye wahan ek ya kai CSS declarations (properties aur values, ho sakta hai nested rules sameet) ka reusable block daalta hai. Function, seedha ek value ki tarah bulaya jaata hai aur \`@return\` se lautaata hai, ek akeli value — rang, lambai, number — ganit karke deta hai jo kisi doosri declaration ke andar use hoti hai. Sankshep mein: CSS rules banane ho to mixin uthaao; ek value ganit karni ho jo kisi rule ke andar jaaye to function uthaao.',
      },
      {
        q: 'What is the difference between @use and the older @import in Sass, and why does it matter for splitting a stylesheet into files?',
        qHi: 'Sass mein @use aur purane @import mein kya fark hai, aur stylesheet ko files mein baantne ke liye ye kyun matter karta hai?',
        a: '`@use` loads another Sass file\'s variables, mixins, and functions into a namespace (accessed with a prefix, like `v.$brand`), and each file is only ever compiled once no matter how many times it is `@use`d across a project. The older `@import` loaded everything into the global namespace with no prefixing, and could cause the same file to be compiled multiple times if imported from several places, along with naming collisions between files. `@use` is the modern, recommended way to split a large stylesheet into small, purpose-named partial files — like `_colors.scss` or `_buttons.scss` — while keeping their contents cleanly namespaced and avoiding duplicate compilation.',
        aHi: '\`@use\` doosri Sass file ki variables, mixins, aur functions ko ek namespace mein laata hai (prefix se access hota hai, jaise \`v.$brand\`), aur har file poore project mein chahe kitni baar \`@use\` ho, sirf ek baar hi compile hoti hai. Purana \`@import\` sab kuch bina prefix ke global namespace mein laata tha, aur agar kai jagah se import kiya jaye to wahi file kai baar compile ho sakti thi, files ke beech naming collisions ke saath. \`@use\` badi stylesheet ko chhoti, purpose-named partial files mein baantne ka modern, recommended tarika hai — jaise \`_colors.scss\` ya \`_buttons.scss\` — unke contents ko saaf namespace mein rakhte hue aur dohraaya hua compilation avoid karte hue.',
      },
    ],

    exercises: [
      {
        task: 'Write three button variant rules with fully duplicated shared declarations, then refactor them into a single @mixin with a colour parameter. Compile both versions (or trace through by hand) and confirm the output CSS is nearly identical.',
        taskHi: 'Poori tarah dohraayi hui saanjhi declarations ke saath teen button variant rules likho, phir unhe ek rang parameter wale akele @mixin mein refactor karo. Dono versions compile karo (ya haath se trace karo) aur confirm karo output CSS lagbhag ek jaisi hai.',
        hint: 'Install Sass with `npm install -g sass` and run `sass input.scss` to see the actual compiled output.',
        hintHi: '\`npm install -g sass\` se Sass install karo aur asli compiled output dekhne ke liye \`sass input.scss\` chalao.',
      },
      {
        task: 'Build a `$colors` Sass map with four entries and use `@each` to generate four `.btn-*` classes from it. Add a fifth entry to the map and confirm a fifth class appears with no other code changes.',
        taskHi: 'Chaar entries wala ek \`$colors\` Sass map banao aur usse \`@each\` se chaar \`.btn-*\` classes banao. Map mein paanchvi entry jodo aur confirm karo bina kisi aur code badlav ke paanchvi class dikhti hai.',
        hint: 'Use `#{$name}` interpolation inside the selector to build the class name from the map key.',
        hintHi: 'Map key se class naam banane ke liye selector ke andar \`#{$name}\` interpolation use karo.',
      },
      {
        task: 'Build the same theme two ways: once with a Sass `$brand` variable, once with a CSS `--brand` custom property. Try changing the colour at runtime with JavaScript on both and observe which one actually works.',
        taskHi: 'Wahi theme do tarike se banao: ek baar Sass \`$brand\` variable se, ek baar CSS \`--brand\` custom property se. Dono par JavaScript se runtime par rang badalne ki koshish karo aur dekho kaunsa sach mein kaam karta hai.',
        hint: 'document.documentElement.style.setProperty(\'--brand\', \'red\') works on the custom property version; there is no equivalent call for a compiled Sass variable.',
        hintHi: 'document.documentElement.style.setProperty(\'--brand\', \'red\') custom property version par kaam karta hai; compiled Sass variable ke liye koi barabar call hai hi nahi.',
      },
    ],

    keyTakeaways: [
      'Sass is a preprocessor compiled to plain CSS before it reaches a browser — a browser has never executed a single line of Sass syntax.',
      'Sass variables ($) are resolved once at compile time and cannot change at runtime; CSS custom properties (--) remain live values the browser and JavaScript can read and write after load.',
      'Native CSS has absorbed nesting and, largely, variables (via custom properties) — the genuinely irreplaceable Sass features left are mixins with parameters and compile-time loops/functions over lists.',
      'A mixin inserts a reusable block of declarations wherever included; a function computes and returns a single value used inside another declaration.',
      '@each loops over a Sass map to generate a whole family of CSS rules from a data structure, with no native CSS equivalent.',
      '@use splits a large stylesheet into small, namespaced partial files, compiling each dependency only once — the modern replacement for the older @import.',
    ],
    keyTakeawaysHi: [
      'Sass ek preprocessor hai jo browser tak pahunchne se pehle saadhi CSS mein compile hota hai — browser ne kabhi Sass syntax ki ek bhi line chalaayi nahi.',
      'Sass variables ($) compile time par ek baar resolve hote hain aur runtime par badal nahi sakte; CSS custom properties (--) live values bani rehti hain jinhe browser aur JavaScript load ke baad padh aur likh sakte hain.',
      'Native CSS ne nesting aur, zyadatar, variables (custom properties ke zariye) sameet le liye hain — jo asal mein badla na ja sakne wale Sass features bache hain wo mixins with parameters aur lists par compile-time loops/functions hain.',
      'Mixin declarations ka reusable block jahan bhi include ho wahan daalta hai; function ek akeli value ganit karke lautaata hai jo kisi doosri declaration ke andar use hoti hai.',
      '@each ek Sass map par loop karke ek data structure se CSS rules ka poora parivar banaata hai, jiska koi native CSS barabar nahi hai.',
      '@use badi stylesheet ko chhoti, namespaced partial files mein baantta hai, har dependency ko sirf ek baar compile karte hue — purane @import ka modern badla.',
    ],
  },
];
