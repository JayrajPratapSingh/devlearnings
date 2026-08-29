/**
 * CSS & HTML Complete Course — Module 6 (Pro), lesson 1.
 *
 * Custom properties and theming. The broken example is a dark-mode toggle
 * built by duplicating every rule under a `.dark` class — twice the CSS,
 * twice the maintenance, and it still misses inline styles and nested
 * overrides. Custom properties collapse that duplication because they are
 * inherited, cascade-participating VALUES, not just SCSS-style text
 * substitution resolved once at build time.
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

export const CSS_MODULE_6: CourseLesson[] = [
  {
    slug: 'css-custom-properties-theming',
    title: 'Custom Properties and Theming',
    titleHi: 'Custom Properties aur Theming',
    description: 'A dark-mode toggle built by duplicating every rule — and the moment someone forgets to duplicate one.',
    descriptionHi: 'Har rule ko dohra kar bana dark-mode toggle — aur wo pal jab koi ek dohraana bhool jata hai.',
    difficulty: 'MEDIUM',
    duration: 32,
    order: 1,

    analogy: {
      en: '**A house wired for one lightbulb colour versus a house with a dimmer switch on the wall.** Duplicating rules under `.dark` is rewiring the entire house every time you want a different bulb colour — new wire, new switch, new everything, and if you miss one room it stays the old colour forever. A custom property is a dimmer switch wired once at the breaker box: every lamp in the house is already plugged into it, so turning the one dial changes every room at once, including rooms built after you installed the switch.',
      hi: '**Ek bulb rang ke liye taar wala ghar aur diwar par dimmer switch wala ghar.** \`.dark\` ke tehat rules dohraana har baar naya bulb rang chahiye to poore ghar ki taar dobara lagaana hai — nayi taar, naya switch, sab kuch naya, aur ek kamra chhoot gaya to wo hamesha purane rang mein rehta hai. Custom property ek dimmer switch hai jo breaker box par ek hi baar lagaya jata hai: ghar ka har lamp pehle se usse juda hai, isliye ek dial ghumaane se har kamra ek saath badal jata hai, un kamron sameet jo switch lagne ke baad bane.',
    },

    simple: `**Start broken.** A dark-mode toggle, built the way it seems obvious to build it first:

\`\`\`css
.card { background: white; color: #111; border: 1px solid #e5e7eb; }
.button { background: #2563eb; color: white; }

.dark .card { background: #1e293b; color: #f1f5f9; border-color: #334155; }
.dark .button { background: #3b82f6; color: white; }
\`\`\`

It works, for the two components you remembered. Now the project has forty components. Every one of them needs its own \`.dark\` override, written by hand, kept in sync by hand, forever. The day someone adds a new component and forgets the \`.dark\` block, it silently stays light-mode-coloured forever, and nobody notices until a user reports it.

**Custom properties collapse the whole problem into one place**

\`\`\`css
:root {
  --bg: white;
  --text: #111;
  --border: #e5e7eb;
}
.dark {
  --bg: #1e293b;
  --text: #f1f5f9;
  --border: #334155;
}

.card { background: var(--bg); color: var(--text); border: 1px solid var(--border); }
.button { background: var(--brand); color: white; }
\`\`\`

Now there is exactly **one** dark-mode override block, defining values, not rules. Every component that uses \`var(--bg)\` picks up the new value automatically, including ones written after this code — because a custom property is not text substitution done once; it is a **real, inherited CSS value** that every descendant reads live, every time it changes.

**The critical difference from a Sass variable**

\`\`\`scss
// Sass: resolved once, at build time, into plain text. The compiled CSS never "knows" it was a variable.
$blue: #2563eb;
.btn { color: $blue; }
\`\`\`

\`\`\`css
/* CSS custom property: resolved live, in the browser, and can change per element via the cascade */
:root { --blue: #2563eb; }
.btn { color: var(--blue); }
\`\`\`

A Sass variable is baked into the output CSS and cannot change after the file is compiled. A CSS custom property is still a variable **at runtime**, in the actual browser — it can be read by JavaScript, changed by a media query, overridden by a parent class, or flipped instantly by a \`.dark\` toggle, none of which requires rebuilding anything.

**Reading and setting from JavaScript — no rebuild needed**

\`\`\`js
document.documentElement.style.setProperty('--brand', '#dc2626');
getComputedStyle(document.documentElement).getPropertyValue('--brand');
\`\`\`

**Fallback values**

\`\`\`css
color: var(--brand, #2563eb);   /* uses #2563eb if --brand is not defined anywhere */
\`\`\`

**Remember:** if a value needs to change based on context — theme, state, component variant — put it in a custom property once, at the top, and let every rule that uses it inherit the change for free.`,

    simpleHi: `**Toote hue se shuru.** Ek dark-mode toggle, jaise wo pehle banana obvious lagta hai:

\`\`\`css
.card { background: white; color: #111; border: 1px solid #e5e7eb; }
.button { background: #2563eb; color: white; }

.dark .card { background: #1e293b; color: #f1f5f9; border-color: #334155; }
.dark .button { background: #3b82f6; color: white; }
\`\`\`

Ye chalta hai, un do components ke liye jo aapko yaad rahe. Ab project mein chaalis components hain. Har ek ko apna \`.dark\` override chahiye, haath se likha, haath se sync rakha hua, hamesha ke liye. Jis din koi naya component jodta hai aur \`.dark\` block bhool jata hai, wo chupchap hamesha light-mode-coloured raha aata hai, aur koi tab tak nahi jaanta jab tak koi user report nahi karta.

**Custom properties poori samasya ko ek jagah sikoud deti hain**

\`\`\`css
:root {
  --bg: white;
  --text: #111;
  --border: #e5e7eb;
}
.dark {
  --bg: #1e293b;
  --text: #f1f5f9;
  --border: #334155;
}

.card { background: var(--bg); color: var(--text); border: 1px solid var(--border); }
.button { background: var(--brand); color: white; }
\`\`\`

Ab bilkul **ek** dark-mode override block hai, jo rules nahi, values define karta hai. \`var(--bg)\` use karne wala har component apne aap naya value uthata hai, in code likhe jaane ke baad bane components sameet — kyunki custom property text substitution nahi hai jo ek baar hoti hai; ye ek **asli, inherit hone wali CSS value** hai jise har descendant live padhta hai, har baar wo badalne par.

**Sass variable se bunyaadi fark**

\`\`\`scss
// Sass: ek baar, build time par, kachche text mein resolve ho jata hai. Compiled CSS ko kabhi nahi pata chalta ki wo variable thi.
$blue: #2563eb;
.btn { color: $blue; }
\`\`\`

\`\`\`css
/* CSS custom property: live resolve hota hai, browser mein, aur cascade ke zariye har element mein badal sakta hai */
:root { --blue: #2563eb; }
.btn { color: var(--blue); }
\`\`\`

Sass variable output CSS mein pak jata hai aur file compile hone ke baad badal nahi sakta. CSS custom property **runtime par**, asli browser mein, ab bhi ek variable hai — use JavaScript se padha ja sakta hai, media query se badla ja sakta hai, parent class se override kiya ja sakta hai, ya \`.dark\` toggle se turant palta ja sakta hai, in mein se kisi ko bhi kuch rebuild karne ki zarurat nahi.

**JavaScript se padhna aur set karna — koi rebuild zarurat nahi**

\`\`\`js
document.documentElement.style.setProperty('--brand', '#dc2626');
getComputedStyle(document.documentElement).getPropertyValue('--brand');
\`\`\`

**Fallback values**

\`\`\`css
color: var(--brand, #2563eb);   /* agar --brand kahin bhi define nahi hai to #2563eb use karta hai */
\`\`\`

**Yaad rakho:** agar kisi value ko context ke hisaab se badalna hai — theme, state, component variant — use ek baar, sabse upar, ek custom property mein daalo, aur use use karne wala har rule badlav ko muft mein inherit karne do.`,

    content: `## Declaring and reading a custom property

\`\`\`css
:root {
  --brand: #2563eb;
  --spacing-unit: 8px;
  --max-width: 1200px;
}

.button {
  background: var(--brand);
  padding: calc(var(--spacing-unit) * 2);
}
\`\`\`

- Custom property names must start with \`--\`, are case-sensitive, and can hold any valid CSS value — a colour, a length, a whole shadow definition, even a comma-separated list.
- \`var(--name)\` substitutes the current value at the point it is used. \`var(--name, fallback)\` supplies a fallback if the property is unset anywhere in the chain.

## They are inherited and cascade — this is the whole point

\`\`\`css
:root { --text: #111; }
.card { --text: #1e3a8a; }   /* only .card and its descendants see this override */
p { color: var(--text); }
\`\`\`

A custom property behaves like any other inherited CSS property: it flows down through descendants, and can be overridden at any point in the tree, with the override applying only to that subtree. This is fundamentally different from a Sass \`$variable\`, which is a single global (or scoped-by-file) value baked into the compiled output — it has no concept of "this subtree gets a different value" at all, because by the time the browser sees it, it is not a variable anymore, just plain text.

## Theming: one override block instead of duplicated rules

\`\`\`css
:root {
  --bg: #ffffff;
  --text: #111827;
  --border: #e5e7eb;
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.dark {
  --bg: #0f172a;
  --text: #f1f5f9;
  --border: #334155;
  --shadow: 0 1px 3px rgba(0,0,0,0.4);
}

/* every component below is written ONCE, referencing the tokens: */
.card { background: var(--bg); color: var(--text); border: 1px solid var(--border); box-shadow: var(--shadow); }
\`\`\`

Toggling dark mode is now toggling one class on the root — every component that consumes these tokens updates instantly, with zero duplicated rules and zero risk of a forgotten override, because there is nothing to forget: components are written against the token, not against a specific colour.

## System-preference theming with prefers-color-scheme

\`\`\`css
:root {
  --bg: #ffffff;
  --text: #111827;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #0f172a; --text: #f1f5f9; }
}
/* an explicit .dark class can still override the system preference for a manual toggle */
.dark { --bg: #0f172a; --text: #f1f5f9; }
.light { --bg: #ffffff; --text: #111827; }
\`\`\`

A common, robust pattern: default to the OS preference via the media query, but let an explicit class win when the user has manually chosen a theme — CSS specificity and source order handle the precedence naturally as long as the manual classes are defined after the media query block.

## Reading and writing from JavaScript

\`\`\`js
// read
const styles = getComputedStyle(document.documentElement);
const brand = styles.getPropertyValue('--brand').trim();

// write — takes effect immediately, no rebuild, no reflow beyond the affected properties
document.documentElement.style.setProperty('--brand', '#dc2626');
\`\`\`

This is what makes custom properties genuinely useful for runtime theming — a user-selectable accent colour, a live theme editor, a per-tenant brand colour in a multi-tenant SaaS product — none of which is possible with a Sass variable, because Sass variables no longer exist once the CSS is compiled and shipped to the browser.

## Scoped tokens, not just global ones

\`\`\`css
.badge { --badge-color: #2563eb; background: var(--badge-color); }
.badge.warning { --badge-color: #d97706; }
.badge.danger  { --badge-color: #dc2626; }
\`\`\`

Custom properties do not have to live on \`:root\` — scoping one to a component and varying it per modifier class is a clean alternative to writing out a full colour value in three separate selectors, and it keeps the "what varies" and "how it's used" separated.

## calc() combined with custom properties

\`\`\`css
:root { --gap: 8px; }
.stack > * + * { margin-top: calc(var(--gap) * 2); }
\`\`\`

\`calc()\` can consume a custom property directly, which is how a single \`--gap\` token can drive a whole family of related, proportionally-scaled spacing values throughout a design system.`,

    contentHi: `## Custom property declare aur padhna

\`\`\`css
:root {
  --brand: #2563eb;
  --spacing-unit: 8px;
  --max-width: 1200px;
}

.button {
  background: var(--brand);
  padding: calc(var(--spacing-unit) * 2);
}
\`\`\`

- Custom property naam \`--\` se shuru hone chahiye, case-sensitive hain, aur koi bhi valid CSS value rakh sakte hain — ek rang, ek lambai, ek poori shadow definition, comma se alag ki hui list bhi.
- \`var(--name)\` use hone ki jagah par abhi ki value daal deta hai. \`var(--name, fallback)\` agar property chain mein kahin bhi set nahi hai to fallback deta hai.

## Ye inherit hoti hain aur cascade karti hain — yahi poora point hai

\`\`\`css
:root { --text: #111; }
.card { --text: #1e3a8a; }   /* sirf .card aur uske descendants ko ye override dikhta hai */
p { color: var(--text); }
\`\`\`

Custom property kisi bhi doosri inherited CSS property ki tarah vyavhaar karti hai: wo descendants mein neeche behti hai, aur tree mein kisi bhi jagah override ho sakti hai, aur wo override sirf us subtree par lagu hota hai. Ye Sass ke \`$variable\` se bunyaadi taur par alag hai, jo ek akela global (ya file-scoped) value hai jo compiled output mein pak jata hai — ise "is subtree ko alag value milegi" jaisa concept bilkul nahi pata, kyunki jab tak browser use dekhta hai, wo ab variable nahi rehta, sirf kachcha text hai.

## Theming: dohraye hue rules ke bajaye ek override block

\`\`\`css
:root {
  --bg: #ffffff;
  --text: #111827;
  --border: #e5e7eb;
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.dark {
  --bg: #0f172a;
  --text: #f1f5f9;
  --border: #334155;
  --shadow: 0 1px 3px rgba(0,0,0,0.4);
}

/* neeche ka har component EK BAAR likha jata hai, tokens use karte hue: */
.card { background: var(--bg); color: var(--text); border: 1px solid var(--border); box-shadow: var(--shadow); }
\`\`\`

Dark mode toggle karna ab root par ek class toggle karna hai — ye tokens use karne wala har component turant update ho jata hai, bina kisi dohraaye hue rule ke aur bina kisi bhoole hue override ke khatre ke, kyunki bhoolne ko kuch hai hi nahi: components token ke hisaab se likhe jate hain, kisi khaas rang ke hisaab se nahi.

## prefers-color-scheme se system-preference theming

\`\`\`css
:root {
  --bg: #ffffff;
  --text: #111827;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #0f172a; --text: #f1f5f9; }
}
/* seedhi .dark class manual toggle ke liye system preference ko phir bhi override kar sakti hai */
.dark { --bg: #0f172a; --text: #f1f5f9; }
.light { --bg: #ffffff; --text: #111827; }
\`\`\`

Ek aam, mazboot pattern: media query se default OS ki pasand par jao, par jab user ne khud theme chuna ho to seedhi class jeete — CSS specificity aur source order apne aap priority sambhal lete hain jab tak manual classes media query block ke baad define ho.

## JavaScript se padhna aur likhna

\`\`\`js
// padhna
const styles = getComputedStyle(document.documentElement);
const brand = styles.getPropertyValue('--brand').trim();

// likhna — turant asar karta hai, koi rebuild nahi, asar hui properties se zyada koi reflow nahi
document.documentElement.style.setProperty('--brand', '#dc2626');
\`\`\`

Yahi cheez custom properties ko runtime theming ke liye sach mein kaam ka banati hai — ek user-chuna accent colour, ek live theme editor, multi-tenant SaaS product mein per-tenant brand colour — in mein se koi bhi Sass variable se mumkin nahi, kyunki CSS compile hokar browser ko bhejte hi Sass variables ka wajood khatam ho jata hai.

## Sirf global nahi, scoped tokens bhi

\`\`\`css
.badge { --badge-color: #2563eb; background: var(--badge-color); }
.badge.warning { --badge-color: #d97706; }
.badge.danger  { --badge-color: #dc2626; }
\`\`\`

Custom properties ko \`:root\` par hi rehna zaruri nahi — ek component tak seemit karke use modifier class ke hisaab se badalna, teen alag selectors mein poori rang value likhne ka saaf vikalp hai, aur "kya badalta hai" ko "kaise use hota hai" se alag rakhta hai.

## Custom properties ke saath calc()

\`\`\`css
:root { --gap: 8px; }
.stack > * + * { margin-top: calc(var(--gap) * 2); }
\`\`\`

\`calc()\` custom property ko seedha use kar sakta hai, aur isi tarah ek akela \`--gap\` token poore design system mein anupaatik roop se scale hoti spacing values ka poora parivar chala sakta hai.`,

    examples: [
      {
        title: 'Duplicated dark-mode rules: the version that doesn\'t scale',
        titleHi: 'Dohraaye hue dark-mode rules: wo version jo badhta nahi',
        code: `.card { background: white; color: #111; }
.dark .card { background: #1e293b; color: #f1f5f9; }
/* every new component needs its own .dark line, forever */`,
        preview: page(`<div class="card">Light card</div>
<div class="dark"><div class="card">Dark card — required a whole separate rule</div></div>`,
`.card { background:white; color:#111; border:1px solid #e5e7eb; padding:12px; font-size:13px; margin-bottom:8px; }
.dark .card { background:#1e293b; color:#f1f5f9; border-color:#334155; }`),
        previewHeight: 130,
        explain: 'Two rules for one component. Multiply by forty real components and the maintenance burden — and the chance of forgetting one — grows linearly with every new piece of UI.',
        explainHi: 'Ek component ke liye do rules. Chaalis asli components se guna karo aur maintenance ka bojh — aur ek bhoolne ka khatra — har naye UI hisse ke saath seedha badhta jata hai.',
      },
      {
        title: 'One token block replaces every duplicated rule',
        titleHi: 'Ek token block har dohraaye hue rule ki jagah leta hai',
        code: `:root { --bg: white; --text: #111; }
.dark { --bg: #1e293b; --text: #f1f5f9; }
.card { background: var(--bg); color: var(--text); }   /* written ONCE */`,
        preview: page(`<div class="card">Light card</div>
<div class="dark"><div class="card">Dark card — same .card rule, zero duplication</div></div>`,
`:root { --bg:white; --text:#111; --border:#e5e7eb; }
.dark { --bg:#1e293b; --text:#f1f5f9; --border:#334155; }
.card { background:var(--bg); color:var(--text); border:1px solid var(--border); padding:12px; font-size:13px; margin-bottom:8px; }`),
        previewHeight: 130,
        explain: 'The `.card` rule appears exactly once, referencing tokens instead of literal colours. Any new component written the same way inherits full dark-mode support automatically, with nothing to remember.',
        explainHi: '\`.card\` rule bilkul ek baar dikhta hai, kachche rang ke bajaye tokens ka istemaal karte hue. Isi tarah likha koi bhi naya component poora dark-mode support apne aap inherit kar leta hai, kuch yaad rakhne ki zarurat nahi.',
      },
      {
        title: 'Scoped override: one subtree gets a different value',
        titleHi: 'Scoped override: ek subtree ko alag value milti hai',
        code: `:root { --text: #111; }
.highlight { --text: #1e3a8a; }   /* overrides ONLY inside .highlight */`,
        preview: page(`<p class="t">Normal text using --text</p>
<div class="highlight"><p class="t">Text inside .highlight — same rule, different inherited value</p></div>`,
`:root { --text:#111; }
.highlight { --text:#1e3a8a; background:#eff6ff; padding:8px; }
.t { color:var(--text); font-size:13px; margin:4px 0; }`),
        previewHeight: 140,
        explain: 'The same `.t { color: var(--text); }` rule produces two different colours, because custom properties are inherited and can be overridden partway down the tree — something a compiled Sass variable structurally cannot do.',
        explainHi: 'Wahi \`.t { color: var(--text); }\` rule do alag rang deta hai, kyunki custom properties inherit hoti hain aur tree mein beech mein override ho sakti hain — ye ek compiled Sass variable banawat se nahi kar sakta.',
      },
      {
        title: 'Fallback values with var()',
        titleHi: 'var() ke saath fallback values',
        code: `.a { color: var(--brand, #6b7280); }   /* --brand is not defined anywhere */
.b { color: var(--defined-brand, #6b7280); }`,
        preview: page(`<p class="a">Falls back to grey — --brand was never defined.</p>
<p class="b">Uses the real value — --defined-brand exists.</p>`,
`:root { --defined-brand:#2563eb; }
.a { color:var(--brand, #6b7280); font-size:13px; }
.b { color:var(--defined-brand, #6b7280); font-size:13px; font-weight:600; }`),
        previewHeight: 100,
        explain: 'The first paragraph silently falls back to grey rather than breaking, because `--brand` was never declared anywhere in the cascade — the fallback argument protects against exactly this.',
        explainHi: 'Pehla paragraph chupchap grey par gir jata hai, tootne ke bajaye, kyunki \`--brand\` cascade mein kahin declare hi nahi kiya gaya — fallback argument bilkul isi se bachata hai.',
      },
      {
        title: 'prefers-color-scheme plus a manual override class',
        titleHi: 'prefers-color-scheme aur ek manual override class',
        code: `@media (prefers-color-scheme: dark) { :root { --bg: #0f172a; } }
.light-forced { --bg: #ffffff; }   /* wins over the system preference */`,
        preview: page(`<div class="box">Follows system preference by default</div>
<div class="box light-forced">Forced light regardless of system preference</div>`,
`:root { --bg:#ffffff; --text:#111; }
@media (prefers-color-scheme: dark) { :root { --bg:#0f172a; --text:#f1f5f9; } }
.light-forced { --bg:#ffffff; --text:#111; }
.box { background:var(--bg); color:var(--text); padding:10px; font-size:13px; margin-bottom:6px; border:1px solid #94a3b8; }`),
        previewHeight: 130,
        explain: 'The first box respects your OS dark-mode setting; the second forces light regardless, because a class selector\'s declaration for the same custom property overrides the media query\'s root declaration through normal cascade rules.',
        explainHi: 'Pehla box aapke OS ki dark-mode setting maanta hai; doosra chahe kuch bhi ho light majboor karta hai, kyunki ek class selector ka usi custom property ke liye declaration media query ke root declaration ko normal cascade niyamon se override karta hai.',
      },
      {
        title: 'A per-variant scoped token on a badge',
        titleHi: 'Badge par ek per-variant scoped token',
        code: `.badge { --badge-color: #2563eb; background: var(--badge-color); }
.badge.warning { --badge-color: #d97706; }
.badge.danger  { --badge-color: #dc2626; }`,
        preview: page(`<span class="badge">Info</span>
<span class="badge warning">Warning</span>
<span class="badge danger">Danger</span>`,
`.badge { --badge-color:#2563eb; background:var(--badge-color); color:#fff; padding:4px 10px; border-radius:99px; font-size:12px; margin-right:6px; }
.badge.warning { --badge-color:#d97706; }
.badge.danger { --badge-color:#dc2626; }`),
        previewHeight: 90,
        explain: 'One base rule reads `--badge-color`; each modifier class sets only that one token rather than repeating the full `background` declaration three times. Adding a fourth variant means one new line, not a duplicated rule block.',
        explainHi: 'Ek base rule \`--badge-color\` padhta hai; har modifier class sirf wo ek token set karta hai, poore \`background\` declaration ko teen baar dohraane ke bajaye. Chautha variant jodne ka matlab ek nayi line hai, ek dohraaya hua rule block nahi.',
      },
      {
        title: 'calc() combined with a spacing token',
        titleHi: 'calc() ek spacing token ke saath',
        code: `:root { --gap: 6px; }
.tight  { margin-top: var(--gap); }
.normal { margin-top: calc(var(--gap) * 2); }
.loose  { margin-top: calc(var(--gap) * 4); }`,
        preview: page(`<div class="s tight">tight — 1× gap</div>
<div class="s normal">normal — 2× gap</div>
<div class="s loose">loose — 4× gap</div>`,
`:root { --gap:6px; }
.s { background:#dbeafe; padding:6px; font-size:12px; }
.tight { margin-top:var(--gap); }
.normal { margin-top:calc(var(--gap) * 2); }
.loose { margin-top:calc(var(--gap) * 4); }`),
        previewHeight: 190,
        explain: 'Changing the single `--gap` value at the root would rescale all three spacing variants proportionally at once, because they are all expressed as multiples of the same token rather than three independent hard-coded numbers.',
        explainHi: 'Root par akele \`--gap\` value badalne se teenon spacing variants ek saath anupaatik roop se rescale ho jate, kyunki sab isi token ke gune ki tarah likhe gaye hain, teen alag hard-coded numbers ki tarah nahi.',
      },
      {
        title: 'Setting a custom property from JavaScript at runtime',
        titleHi: 'Runtime par JavaScript se custom property set karna',
        code: `document.documentElement.style.setProperty('--brand', '#dc2626');
/* every element using var(--brand) updates immediately, no CSS file rebuild */`,
        preview: page(`<div class="box">Uses var(--brand)</div>
<button onclick="document.documentElement.style.setProperty('--brand', '#16a34a')">Set green</button>
<button onclick="document.documentElement.style.setProperty('--brand', '#dc2626')">Set red</button>`,
`:root { --brand:#2563eb; }
.box { background:var(--brand); color:#fff; padding:10px; font-size:13px; margin-bottom:8px; transition:background 0.2s; }
button { padding:6px 10px; margin-right:6px; }`),
        previewHeight: 130,
        explain: 'Click either button and the box updates instantly. This live, JavaScript-writable behaviour is impossible with a Sass variable, which stops existing as a variable the moment the file is compiled to plain CSS.',
        explainHi: 'Koi bhi button click karo aur box turant update hota hai. Ye live, JavaScript-likhi ja sakne wali vyavhaar Sass variable se mumkin nahi, jo file plain CSS mein compile hote hi variable ki tarah wajood mein rehna band kar deta hai.',
      },
      {
        title: 'A custom property holding a whole shadow value',
        titleHi: 'Poori shadow value rakhne wali custom property',
        code: `:root { --shadow: 0 2px 8px rgba(0,0,0,0.15); }
.dark { --shadow: 0 2px 8px rgba(0,0,0,0.5); }
.card { box-shadow: var(--shadow); }`,
        preview: page(`<div class="card">Light shadow</div>
<div class="dark"><div class="card">Dark shadow — deeper, same rule</div></div>`,
`:root { --shadow:0 2px 8px rgba(0,0,0,0.15); }
.dark { --shadow:0 2px 8px rgba(0,0,0,0.5); background:#0f172a; padding:12px; }
.card { box-shadow:var(--shadow); background:#fff; padding:14px; font-size:13px; margin-bottom:6px; }`),
        previewHeight: 180,
        explain: 'A custom property is not limited to a single colour or number — it can hold any valid CSS value, including a full multi-part shadow definition, and the whole thing swaps atomically with one token change.',
        explainHi: 'Custom property ek akele rang ya number tak seemit nahi — ye koi bhi valid CSS value rakh sakti hai, ek poori multi-part shadow definition sameet, aur poori cheez ek token badlav se atomic roop se badal jati hai.',
      },
      {
        title: 'Token naming that documents intent, not just value',
        titleHi: 'Token naming jo value nahi, irada bhi bataye',
        code: `/* naming by RAW VALUE — breaks down the moment the palette changes */
--blue-500: #2563eb;
.link { color: var(--blue-500); }

/* naming by ROLE — survives a palette change entirely */
--color-interactive: #2563eb;
.link { color: var(--color-interactive); }`,
        preview: page(`<div class="note">
  If the brand colour changes from blue to purple, <code>--color-interactive</code> just gets reassigned once — every consumer is still semantically correct.<br><br>
  A name like <code>--blue-500</code> becomes actively misleading the moment its value stops being blue.
</div>`,
`.note { font-size:13px; background:#fef3c7; border:1px solid #f59e0b; padding:10px; border-radius:4px; }`),
        previewHeight: 150,
        explain: 'This is a design-tokens naming convention, not a CSS syntax rule, but it matters at scale: a token named after its role survives a rebrand cleanly, while one named after its literal value actively lies once that value changes.',
        explainHi: 'Ye design-tokens ka naming convention hai, CSS syntax ka niyam nahi, par ye scale par matter karta hai: role ke naam wala token ek rebrand ko saaf tarike se jhelta hai, jabki literal value ke naam wala value badalte hi seedha jhooth bolne lagta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `.card { background: white; }
.dark .card { background: #1e293b; }
.button { background: #2563eb; }
.dark .button { background: #3b82f6; }
/* every component needs its own hand-written .dark line */`,
        right: `:root { --bg: white; --brand: #2563eb; }
.dark { --bg: #1e293b; --brand: #3b82f6; }
.card { background: var(--bg); }
.button { background: var(--brand); }`,
        why: 'Duplicating rules under `.dark` scales linearly with every new component and is one missed line away from a silently broken dark mode. A token layer means new components inherit theming automatically just by using the existing variables.',
        whyHi: '\`.dark\` ke tehat rules dohraana har naye component ke saath seedha badhta hai aur ek chhooti hui line dark mode ko chupchap tod deti hai. Ek token layer ka matlab hai naye components apne aap theming inherit karte hain, sirf maujood variables use karke.',
      },
      {
        wrong: `$brand: #2563eb;   // Sass variable — resolved once at build time
.btn { color: $brand; }
/* cannot be changed at runtime; a user-selectable theme colour is impossible */`,
        right: `:root { --brand: #2563eb; }
.btn { color: var(--brand); }
/* document.documentElement.style.setProperty('--brand', userColor) works at runtime */`,
        why: 'A Sass variable is text substitution finished at compile time — the shipped CSS has no idea it was ever a variable. A CSS custom property remains a live, readable, writable value in the browser, which is required for anything the user or JavaScript needs to change after the page loads.',
        whyHi: 'Sass variable text substitution hai jo compile time par khatam ho jata hai — bheji hui CSS ko pata hi nahi ki wo kabhi variable thi. CSS custom property browser mein ek live, padhi ja sakne wali, likhi ja sakne wali value bani rehti hai, jo kisi bhi cheez ke liye zaruri hai jo user ya JavaScript ko page load hone ke baad badalni ho.',
      },
      {
        wrong: `--blue-500: #2563eb;
.link { color: var(--blue-500); }
.error-text { color: var(--blue-500); }   /* rebranded to purple later — this name now lies */`,
        right: `--color-interactive: #2563eb;
--color-danger: #dc2626;
.link { color: var(--color-interactive); }
.error-text { color: var(--color-danger); }`,
        why: 'Naming a token after its literal value works until that value changes — at which point the name actively misleads anyone reading the code. Naming after the role the value plays survives a rebrand or palette change without ever needing to be renamed.',
        whyHi: 'Token ka naam uski literal value ke hisaab se rakhna tab tak chalta hai jab tak wo value na badle — badalte hi naam code padhne wale kisi ko bhi galat raah dikhata hai. Value ke role ke hisaab se naam rakhna rebrand ya palette badlav ko bina kabhi rename kiye jhel leta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Design tokens in every modern design system.** Material Design, Radix, Tailwind\'s CSS variable mode, and virtually every component library ship colours, spacing and radii as custom properties specifically so a single theme file can restyle an entire product.',
        hi: '**Har modern design system mein design tokens.** Material Design, Radix, Tailwind ka CSS variable mode, aur lagbhag har component library rang, spacing aur radii ko custom properties ki tarah bhejti hai, khaas taur par isliye ki ek theme file poore product ko dobara style kar sake.',
      },
      {
        en: '**Multi-tenant SaaS branding.** A product that lets each customer set their own accent colour (Notion, Linear, most white-label dashboards) stores that colour in a custom property set at runtime per logged-in tenant — a Sass variable could never do this per-request.',
        hi: '**Multi-tenant SaaS branding.** Aisa product jo har customer ko apna accent colour set karne deta hai (Notion, Linear, zyadatar white-label dashboards) wo rang runtime par har logged-in tenant ke liye set ki gayi custom property mein rakhta hai — Sass variable ye per-request kabhi nahi kar sakta.',
      },
      {
        en: '**System dark mode support became a checkbox item, not a project.** Since `prefers-color-scheme` plus custom properties became standard, adding dark mode to an existing product went from a multi-week rewrite to redefining one token block.',
        hi: '**System dark mode support ek checkbox item ban gaya, ek project nahi.** \`prefers-color-scheme\` aur custom properties standard bante hi, maujood product mein dark mode jodna kai-hafton ki dobara likhaai se ek token block dobara define karne tak simat gaya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the fundamental difference between a CSS custom property and a Sass/SCSS variable?',
        qHi: 'CSS custom property aur Sass/SCSS variable mein bunyaadi fark kya hai?',
        a: 'A Sass variable is a compile-time text substitution — the preprocessor replaces every occurrence with its literal value once, when the `.scss` file is compiled, and the resulting CSS has no memory that a variable was ever involved. A CSS custom property is a real, live value that exists in the browser at runtime: it participates in the cascade and inheritance like any other CSS property, can be overridden per element or per subtree, can be read and written by JavaScript after the page has loaded, and can change in response to a media query or a class toggle without any rebuild. The practical consequence is that only custom properties can power runtime theming — dark mode toggles, user-selected accent colours, per-tenant branding.',
        aHi: 'Sass variable ek compile-time text substitution hai — preprocessor \`.scss\` file compile hote hi har jagah use uski literal value se badal deta hai, aur nateeje wali CSS ko yaad hi nahi rehta ki kabhi koi variable shaamil thi. CSS custom property ek asli, live value hai jo runtime par browser mein maujood hai: ye kisi bhi doosri CSS property ki tarah cascade aur inheritance mein hissa leti hai, har element ya subtree ke hisaab se override ho sakti hai, page load hone ke baad JavaScript se padhi aur likhi ja sakti hai, aur bina kisi rebuild ke media query ya class toggle ke jawab mein badal sakti hai. Amali nateeja ye hai ki sirf custom properties hi runtime theming chala sakti hain — dark mode toggles, user-chuna accent colour, per-tenant branding.',
      },
      {
        q: 'How would you architect a dark-mode theme using custom properties, and why does it avoid the duplication problem of writing separate `.dark` rules for every component?',
        qHi: 'Custom properties se dark-mode theme kaise architect karoge, aur ye har component ke liye alag \`.dark\` rules likhne ki duplication ki samasya kaise avoid karta hai?',
        a: 'Define semantic tokens — `--bg`, `--text`, `--border`, and so on — at `:root` with their light-mode values, then redefine only those same token names inside a `.dark` class (or a `prefers-color-scheme: dark` media query) with dark-mode values. Every component is then written once, referencing `var(--bg)` etc. rather than literal colours. Toggling the `.dark` class on the root changes every consuming component simultaneously, because custom properties are inherited — there is no separate override rule to write or forget per component, since the component\'s own rule never changes, only the value it resolves to.',
        aHi: '\`:root\` par semantic tokens define karo — \`--bg\`, \`--text\`, \`--border\`, waghera — unki light-mode values ke saath, phir sirf wahi token naam \`.dark\` class ke andar (ya \`prefers-color-scheme: dark\` media query mein) dark-mode values ke saath dobara define karo. Phir har component ek baar likha jata hai, literal rangon ke bajaye \`var(--bg)\` waghera use karte hue. Root par \`.dark\` class toggle karne se use karne wala har component ek saath badal jata hai, kyunki custom properties inherit hoti hain — har component ke liye koi alag override rule likhna ya bhoolna nahi hai, kyunki component ka apna rule kabhi nahi badalta, sirf jis value tak wo resolve hota hai wo badalti hai.',
      },
      {
        q: 'What does `var(--brand, #2563eb)` do, and when is the fallback used?',
        qHi: '\`var(--brand, #2563eb)\` kya karta hai, aur fallback kab use hota hai?',
        a: 'The second argument to `var()` is a fallback value, used whenever `--brand` is not defined anywhere in the current element\'s cascade — neither on the element itself nor inherited from any ancestor. It protects against the property being entirely unset, which would otherwise make the declaration invalid and fall back to the property\'s initial value or an inherited one, often producing unexpected results. It is distinct from `.dark`-style overriding, which relies on the property being defined with a different value somewhere in the tree, not on it being undefined.',
        aHi: '\`var()\` ka doosra argument ek fallback value hai, jo tab use hoti hai jab \`--brand\` maujooda element ke cascade mein kahin bhi define nahi hai — na khud element par, na kisi ancestor se inherit hoke. Ye property ke poori tarah unset hone se bachata hai, jo warna declaration ko invalid bana deta aur property ki initial value ya inherited value par gir jata, aksar anapekshit nateeje dete hue. Ye \`.dark\`-style overriding se alag hai, jo iss par nirbhar hai ki property tree mein kahin alag value ke saath define hai, uske undefined hone par nahi.',
      },
      {
        q: 'Why should design tokens be named after their role rather than their literal value?',
        qHi: 'Design tokens ko unki literal value ke bajaye unke role ke hisaab se naam kyun dena chahiye?',
        a: 'A token named `--blue-500` is accurate only as long as the underlying colour is actually blue. The moment a rebrand or palette update changes it to purple, every place using that token still reads `--blue-500` even though nothing about it is blue anymore, which actively misleads anyone reading the code. Naming it `--color-interactive` or `--color-primary` describes what the value is *for*, not what it currently *is*, so the token name stays accurate through any future colour change — only the single definition needs to be updated, and every consumer remains semantically correct without any renaming.',
        aHi: '\`--blue-500\` naam wala token tabhi sahi hai jab tak asli rang sach mein blue ho. Rebrand ya palette update use purple kar de to, wo token use karne wali har jagah ab bhi \`--blue-500\` padhti hai jabki usme blue jaisa kuch bacha hi nahi, jo code padhne wale kisi ko bhi galat raah dikhata hai. Ise \`--color-interactive\` ya \`--color-primary\` naam dena batata hai ki value *kis liye* hai, abhi *kya* hai wo nahi, isliye token ka naam kisi bhi future rang badlav mein bhi sahi rehta hai — sirf ek definition update karni hoti hai, aur use karne wala har jagah bina kisi rename ke semantically sahi rehta hai.',
      },
      {
        q: 'Can custom properties be scoped to a single component rather than declared globally on :root, and why would you do that?',
        qHi: 'Kya custom properties ko globally :root par declare karne ke bajaye ek akele component tak seemit kiya ja sakta hai, aur aisa kyun karoge?',
        a: 'Yes — a custom property can be declared on any selector, and it will be scoped to that element and its descendants, following normal inheritance rules. A common pattern is declaring a token like `--badge-color` on a base component class and then having modifier classes (`.warning`, `.danger`) redefine only that one token, rather than repeating the full declaration that consumes it. This keeps "what varies between variants" cleanly separated from "how the variant is applied", and scales to new variants by adding one line rather than duplicating a rule block.',
        aHi: 'Haan — custom property kisi bhi selector par declare ki ja sakti hai, aur wo us element aur uske descendants tak seemit rahegi, normal inheritance niyamon ke hisaab se. Ek aam pattern hai \`--badge-color\` jaisa token ek base component class par declare karna aur phir modifier classes (\`.warning\`, \`.danger\`) ko sirf wo ek token dobara define karne dena, use karne wale poore declaration ko dohraane ke bajaye. Ye "variants ke beech kya badalta hai" ko "variant kaise lagta hai" se saaf alag rakhta hai, aur naye variant ke liye ek rule block dohraane ke bajaye ek line jodkar scale karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Take a component styled with literal colours and refactor it to use custom properties for background, text and border. Then add a `.dark` class override and confirm the component restyles without touching its own rule.',
        taskHi: 'Literal rangon se style kiya gaya component lo aur use background, text aur border ke liye custom properties use karne ke liye refactor karo. Phir ek \`.dark\` class override jodo aur confirm karo component apne khud ke rule ko chhue bina dobara style hota hai.',
        hint: 'Define the tokens on :root first with light values, then redefine only those names inside .dark.',
        hintHi: 'Pehle :root par tokens ko light values ke saath define karo, phir sirf wahi naam .dark ke andar dobara define karo.',
      },
      {
        task: 'Build a live theme switcher: a colour input that calls `document.documentElement.style.setProperty(\'--brand\', value)` on change, with several elements across the page using `var(--brand)`.',
        taskHi: 'Ek live theme switcher banao: ek colour input jo change hone par \`document.documentElement.style.setProperty(\'--brand\', value)\` bulaata hai, page par kai elements ke saath jo \`var(--brand)\` use karte hain.',
        hint: 'An HTML <input type="color"> fires an "input" event on every drag of the picker, which is a natural place to call setProperty.',
        hintHi: 'HTML <input type="color"> picker ke har drag par ek "input" event fire karta hai, jo setProperty bulaane ke liye ek svaabhavik jagah hai.',
      },
      {
        task: 'Take a set of tokens named after their literal colour value (like `--blue-500`) and rename them by role (like `--color-interactive`). Change the underlying colour and confirm nothing about the new names is misleading.',
        taskHi: 'Unki literal rang value ke naam wale tokens ka set lo (jaise \`--blue-500\`) aur unhe role ke hisaab se rename karo (jaise \`--color-interactive\`). Asli rang badlo aur confirm karo naye naamon mein kuch bhi galat raah dikhata nahi hai.',
        hint: 'This is a naming exercise more than a technical one — the payoff shows up only after the value actually changes.',
        hintHi: 'Ye ek naming exercise hai, technical se zyada — fayda tabhi dikhta hai jab value sach mein badalti hai.',
      },
    ],

    keyTakeaways: [
      'Custom properties are real, inherited CSS values that live in the browser at runtime — unlike Sass variables, which are resolved once at compile time.',
      'A theme built on custom properties needs only one override block per theme, instead of duplicating every component rule under a `.dark` class.',
      'A custom property can be overridden partway down the tree, scoping a different value to one subtree without affecting the rest of the page.',
      '`var(--name, fallback)` supplies a safe default when a property is undefined anywhere in the cascade.',
      'Custom properties can be read and written from JavaScript at runtime, which is what makes user-selectable themes and per-tenant branding possible.',
      'Name design tokens after the role a value plays (`--color-interactive`), not its literal value (`--blue-500`), so the name survives a rebrand.',
    ],
    keyTakeawaysHi: [
      'Custom properties asli, inherit hoti CSS values hain jo runtime par browser mein rehti hain — Sass variables ke ulat, jo compile time par ek baar resolve hoti hain.',
      'Custom properties par bana theme har theme ke liye sirf ek override block maangta hai, \`.dark\` class ke tehat har component rule dohraane ke bajaye.',
      'Custom property tree mein beech mein override ho sakti hai, ek alag value ko ek subtree tak seemit karte hue, baaki page ko asar kiye bina.',
      '\`var(--name, fallback)\` ek surakshit default deta hai jab property cascade mein kahin bhi undefined ho.',
      'Custom properties ko runtime par JavaScript se padha aur likha ja sakta hai, yahi cheez user-chuna themes aur per-tenant branding ko mumkin banati hai.',
      'Design tokens ko value ke role ke hisaab se naam do (\`--color-interactive\`), literal value ke hisaab se nahi (\`--blue-500\`), taaki naam rebrand ko jheel sake.',
    ],
  },
];
