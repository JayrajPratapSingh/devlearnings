/**
 * CSS & HTML Complete Course — Module 6 (Pro), lesson 2. FINAL LESSON.
 *
 * Modern selectors (:has(), nesting, @layer) and architecture at scale. The
 * broken example is a specificity war: two equally-valid-looking rules where
 * the "wrong" one wins because of file order, and !important gets reached
 * for as a fix — which only escalates the war instead of ending it. @layer
 * is presented as the actual fix, because it controls precedence by
 * intention (layer order) rather than by accident (source order + specificity
 * arithmetic).
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

export const CSS_MODULE_6B: CourseLesson[] = [
  {
    slug: 'css-modern-selectors-architecture',
    title: 'Modern CSS and Architecture at Scale',
    titleHi: 'Modern CSS aur Scale par Architecture',
    description: 'Two rules that both look right. One of them silently loses, so someone reaches for !important — and the war escalates.',
    descriptionHi: 'Do rules jo dono sahi lagte hain. Ek chupchap haar jata hai, to koi !important uthaata hai — aur jung badhti jati hai.',
    difficulty: 'HARD',
    duration: 36,
    order: 2,

    analogy: {
      en: '**Sticky notes on a shared whiteboard versus labelled folders in filing cabinets.** A specificity war is everyone writing overrides on sticky notes stuck over each other on one whiteboard — whoever stuck their note on last wins, and when that stops being good enough, people start writing in bigger, angrier handwriting (`!important`) to try to win anyway. `@layer` is filing cabinets with labelled drawers: you decide in advance which drawer beats which — resets, then framework, then components, then overrides — and *within* a drawer, normal specificity still applies, but no drawer has to out-shout another to win. The order is declared, not fought over.',
      hi: '**Ek saath diwar par sticky notes aur alag-alag labelled folders wale filing cabinets.** Specificity war matlab sab log ek hi whiteboard par ek doosre ke upar sticky notes chipka kar overrides likh rahe hain — jisne apna note sabse aakhri mein chipkaya wo jeetta hai, aur jab ye kaafi nahi rehta, log bade, gusse wale akshron (\`!important\`) mein likhna shuru kar dete hain jeetne ki koshish mein. \`@layer\` labelled drawers wale filing cabinets hain: aap pehle hi tay kar lete ho kaunsi drawer kisse jeetegi — resets, phir framework, phir components, phir overrides — aur ek drawer *ke andar*, normal specificity abhi bhi lagu hoti hai, par kisi drawer ko doosri se zyada zor se chillane ki zarurat nahi. Kram declare kiya jata hai, ladai se nahi jeeta jata.',
    },

    simple: `**Start broken.** Two rules, both looking equally valid:

\`\`\`css
.card .title { color: blue; }
.title { color: red; }
\`\`\`

Which one wins? \`.card .title\` has two classes chained by descendant combinator — that is **higher specificity** than \`.title\` alone, so blue wins, **regardless of which rule appears later in the file**. This surprises people who assume "later in the file always wins" — that is only true when specificity is *tied*.

Now imagine a real codebase: a design-system file defines \`.button { background: var(--brand); }\`, and three weeks later someone in a totally different file writes \`.card .button { background: gray; }\` trying to grey out buttons inside disabled cards. It works, by accident — their selector happened to be more specific. Six months later someone else tries to override *that* rule and cannot figure out why their perfectly reasonable-looking CSS is losing. They reach for the emergency exit:

\`\`\`css
.button { background: var(--brand) !important; }
\`\`\`

\`!important\` wins the immediate battle but starts a war: the next person who needs to override *this* now has only one weapon left — another \`!important\` — and there is no rule above that. Once two \`!important\` declarations compete, the tiebreak falls back to specificity and then source order anyway, so you have gained nothing except a codebase that is now harder to reason about forever.

**\`@layer\` ends the war by making precedence a decision, not an accident**

\`\`\`css
@layer reset, base, components, overrides;

@layer base {
  .button { background: var(--brand); }
}
@layer components {
  .card .button { background: gray; }   /* loses to overrides layer no matter its specificity */
}
@layer overrides {
  .button.disabled { background: lightgray; }   /* always wins, even against high-specificity rules in earlier layers */
}
\`\`\`

The **layer order**, declared once at the top, decides precedence between layers — completely independent of selector specificity or which layer's CSS appears later in the file. A single-class rule in \`overrides\` beats a triple-chained selector in \`components\`, on purpose, every time. Specificity still matters **within** one layer, but layers themselves settle everything between layers before specificity is even consulted.

**Nesting — writing related rules together**

\`\`\`css
.card {
  padding: 16px;
  & .title { font-weight: 600; }
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  @media (min-width: 700px) { padding: 24px; }
}
\`\`\`

This is native CSS nesting (no Sass required since 2023 in evergreen browsers) — the \`&\` refers back to the parent selector. It groups related rules visually, but be aware it does not change the underlying specificity math; a nested rule still has exactly the specificity its fully-expanded selector would have.

**\`:has()\` — the selector that finally looks forward, not just backward**

\`\`\`css
.card:has(img) { padding-top: 0; }         /* a card, but ONLY if it contains an image */
label:has(input:checked) { color: green; }  /* style a label based on ITS OWN input's state */
\`\`\`

Every CSS selector before \`:has()\` could only describe an element by its ancestors, its position, or itself — never by what it *contains*. \`:has()\` is the first "parent selector" CSS has ever had, and it eliminates a huge class of problems that used to require JavaScript purely to add a class name based on DOM structure.

**Remember:** a specificity war is a sign the architecture needs a decision, not a bigger weapon — \`@layer\` is that decision.`,

    simpleHi: `**Toote hue se shuru.** Do rules, dono barabar sahi dikhte hain:

\`\`\`css
.card .title { color: blue; }
.title { color: red; }
\`\`\`

Kaun jeetega? \`.card .title\` mein descendant combinator se judi do classes hain — ye \`.title\` akele se **zyada specificity** hai, isliye blue jeetta hai, **file mein kaunsa rule baad mein aata hai iski parwah kiye bina**. Ye un logon ko chaunkata hai jo maan lete hain "file mein baad wala hamesha jeetta hai" — ye sirf tab sach hai jab specificity *barabar* ho.

Ab ek asli codebase soncho: ek design-system file \`.button { background: var(--brand); }\` define karti hai, aur teen hafte baad ek bilkul alag file mein koi \`.card .button { background: gray; }\` likhta hai disabled cards ke andar buttons ko grey karne ki koshish mein. Ye chalta hai, ittefaq se — unka selector zyada specific nikal gaya. Chhe mahine baad koi aur *us* rule ko override karne ki koshish karta hai aur samajh nahi pata ki uski bilkul theek dikhti CSS kyun haar rahi hai. Wo emergency exit uthaate hain:

\`\`\`css
.button { background: var(--brand) !important; }
\`\`\`

\`!important\` turant ki ladai jeet leta hai par ek jung shuru kar deta hai: agla vyakti jise *ise* override karna hai uske paas ab sirf ek hathiyar bacha hai — ek aur \`!important\` — aur uske upar koi niyam nahi hai. Ek baar do \`!important\` declarations compete karein, to tiebreak phir bhi specificity par gir jata hai aur phir source order par, isliye aapne kuch nahi paaya sivaay ek aisi codebase ke jise samajhna ab hamesha ke liye mushkil ho gaya.

**\`@layer\` priority ko ittefaq ke bajaye faisle se jung khatam karta hai**

\`\`\`css
@layer reset, base, components, overrides;

@layer base {
  .button { background: var(--brand); }
}
@layer components {
  .card .button { background: gray; }   /* overrides layer se haar jata hai uski specificity chahe kuch bhi ho */
}
@layer overrides {
  .button.disabled { background: lightgray; }   /* hamesha jeetta hai, pehle wale layers ke high-specificity rules ke bawajood */
}
\`\`\`

**Layer ka kram**, sabse upar ek baar declare kiya hua, layers ke beech priority tay karta hai — selector specificity ya file mein kaunsi layer baad mein aati hai se poori tarah bekhabar. \`overrides\` mein ek-class wala rule \`components\` mein teen-jude-hue selector ko harata hai, jaan-boojh kar, har baar. Ek layer *ke andar* specificity abhi bhi matter karti hai, par layers khud layers ke beech sab kuch tay kar deti hain, specificity se poochha jaane se pehle hi.

**Nesting — jude hue rules ko saath likhna**

\`\`\`css
.card {
  padding: 16px;
  & .title { font-weight: 600; }
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  @media (min-width: 700px) { padding: 24px; }
}
\`\`\`

Ye native CSS nesting hai (2023 se evergreen browsers mein Sass ki zarurat nahi) — \`&\` parent selector ki taraf ishara karta hai. Ye jude hue rules ko dikhne mein group karta hai, par dhyan do ki ye asli specificity ka hisaab nahi badalta; nested rule ki specificity bilkul wahi rehti hai jo uske poori tarah khule hue selector ki hoti.

**\`:has()\` — wo selector jo aakhirkaar aage bhi dekhta hai, sirf peeche nahi**

\`\`\`css
.card:has(img) { padding-top: 0; }         /* ek card, par SIRF agar usme image ho */
label:has(input:checked) { color: green; }  /* label ko uske APNE input ki state ke hisaab se style karo */
\`\`\`

\`:has()\` se pehle har CSS selector element ko sirf uske ancestors, uski jagah, ya khud se bata sakta tha — wo *kya rakhta hai* usse kabhi nahi. \`:has()\` CSS ka pehla "parent selector" hai, aur ye problems ki ek badi category khatam kar deta hai jinke liye pehle sirf DOM structure ke hisaab se class naam jodne ke liye JavaScript chahiye hoti thi.

**Yaad rakho:** specificity war iska nishaan hai ki architecture ko ek faisla chahiye, badi hathiyar nahi — \`@layer\` wahi faisla hai.`,

    content: `## The specificity hierarchy, precisely

\`\`\`
inline style        1,0,0,0    style="..."
id                     0,1,0,0    #header
class/attr/pseudo-class  0,0,1,0    .card, [type="text"], :hover
element/pseudo-element   0,0,0,1    div, ::before
\`\`\`

Compare left to right: any id beats any number of classes; any class beats any number of elements. \`!important\` sits entirely outside this system, as a separate override layer above all of it — which is exactly why it is dangerous: it cannot be out-specified, only out-\`!important\`-ed, or overridden by a later \`!important\` of equal weight via source order.

## Why source order only matters when specificity ties

\`\`\`css
.title { color: red; }        /* specificity 0,0,1,0 */
.card .title { color: blue; } /* specificity 0,0,2,0 — wins regardless of file position */
\`\`\`

The common misconception "CSS is just top-to-bottom" is only true among rules of *equal* specificity. The moment one selector is more specific, it wins no matter where it sits in the file — which is precisely how accidental specificity wars start: someone reaches for a slightly more specific selector to win *this* override, without realising they have just raised the bar for every future override attempt too.

## @layer: precedence by declaration, not by arithmetic

\`\`\`css
@layer reset, base, components, utilities, overrides;

@layer reset {
  * { margin: 0; padding: 0; }
}
@layer base {
  body { font: 16px/1.5 sans-serif; }
}
@layer components {
  .card .button.primary.large { background: blue; }   /* very high specificity */
}
@layer utilities {
  .bg-red { background: red; }   /* low specificity, but a later, higher-priority LAYER */
}
\`\`\`

A rule in a later-declared layer beats a rule in an earlier-declared layer **regardless of specificity** — the utility class above wins over the four-part selector in \`components\`, even though its own specificity is far lower, because \`utilities\` was declared after \`components\` in the \`@layer\` statement. Layers are compared first; specificity is only consulted to break ties *within* the same layer. Unlayered CSS (any rule not inside an \`@layer\` block) always beats every layered rule, which is a deliberate escape hatch — but it means introducing \`@layer\` to a codebase gradually requires wrapping the *existing* CSS in its own layer too, or the new layered rules will lose to it unexpectedly.

## Native CSS nesting

\`\`\`css
.card {
  padding: 16px;
  border: 1px solid #e5e7eb;

  & .title {
    font-weight: 600;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  &.featured {
    border-color: var(--brand);
  }

  @media (min-width: 700px) {
    padding: 24px;
  }
}
\`\`\`

This compiles, conceptually, to the same flat rules you would write by hand — \`.card .title\`, \`.card:hover\`, \`.card.featured\`, and a media-query-wrapped \`.card\`. Nesting is a source-code organisation tool; it changes nothing about specificity or the cascade, only how the rules are grouped visually on the page.

## :has() — the parent/relational selector

\`\`\`css
/* style a form group differently if it contains an invalid input */
.form-group:has(input:invalid) { border-color: red; }

/* a card gets different padding depending on whether it has an image */
.card:has(img) { padding-top: 0; }
.card:not(:has(img)) { padding-top: 16px; }

/* style a label based on its own checkbox's checked state — no JS required */
label:has(input:checked) { font-weight: 600; color: var(--brand); }

/* select any heading immediately followed by a paragraph — style the PRECEDING sibling */
h2:has(+ p) { margin-bottom: 8px; }
\`\`\`

Every selector before \`:has()\` could describe an element only in terms of its ancestors, siblings before it, or itself — never in terms of its descendants or what follows it. \`:has()\` takes a full selector as its argument and matches the outer element if *any* descendant (or, combined with \`+\`/\`~\`, sibling) matches it, which eliminates an entire category of "add a class with JavaScript just to enable a CSS rule" workarounds.

## SCSS/Sass, briefly, and what native CSS has since absorbed

\`\`\`scss
// Sass nesting, variables, and mixins — the reasons people reached for Sass historically
$brand: #2563eb;
.card {
  padding: 16px;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
}
@mixin button-base { padding: 8px 16px; border-radius: 4px; }
.btn { @include button-base; background: $brand; }
\`\`\`

Native CSS now has nesting (shown above) and custom properties (Module 6's first lesson) covering two of Sass's original core motivations. What native CSS still does **not** have: mixins (reusable declaration blocks with parameters), functions you define yourself, and build-time loops/conditionals over a list of values. Sass remains genuinely useful for those, and for compiling down component-scoped styles in large design systems — it is not obsolete, but the gap between "why reach for Sass" and "why reach for native CSS" has narrowed substantially since 2023.

## Naming conventions at scale: BEM versus utility-first

\`\`\`css
/* BEM: Block__Element--Modifier */
.card { }
.card__title { }
.card__title--large { }
.card--featured { }
\`\`\`

\`\`\`html
<!-- utility-first (Tailwind-style): compose small, single-purpose classes -->
<div class="p-4 rounded-lg shadow-md hover:shadow-lg">
\`\`\`

BEM keeps specificity flat (every selector is a single class) and makes relationships explicit in the name, at the cost of verbose HTML class attributes and CSS files that grow with every new component. Utility-first keeps CSS itself nearly static (a fixed set of single-property classes) and pushes composition into the HTML, trading long \`class\` attributes for a CSS bundle that barely grows as the product does. Both are legitimate, widely-used answers to the same underlying problem this whole lesson is about: keeping specificity and cascade behaviour predictable as a codebase grows from one page to hundreds.`,

    contentHi: `## Specificity hierarchy, seedhe roop mein

\`\`\`
inline style        1,0,0,0    style="..."
id                     0,1,0,0    #header
class/attr/pseudo-class  0,0,1,0    .card, [type="text"], :hover
element/pseudo-element   0,0,0,1    div, ::before
\`\`\`

Baayein se dayein compare karo: koi bhi id kisi bhi ginti ki classes ko harati hai; koi bhi class kisi bhi ginti ke elements ko harati hai. \`!important\` is poore system se bilkul bahar baitha hai, sabke upar ek alag override layer ki tarah — yahi wajah hai ki ye khatarnaak hai: ise zyada specific hokar nahi hara sakte, sirf zyada \`!important\` hokar, ya barabar wazan ke baad wale \`!important\` se source order ke zariye override kar sakte ho.

## Source order sirf tab kyun matter karta hai jab specificity barabar ho

\`\`\`css
.title { color: red; }        /* specificity 0,0,1,0 */
.card .title { color: blue; } /* specificity 0,0,2,0 — file mein jagah chahe kuch bhi ho, jeetta hai */
\`\`\`

Aam galatfehmi "CSS bas top-to-bottom hai" sirf *barabar* specificity wale rules ke beech sach hai. Jaise hi ek selector zyada specific hota hai, wo jeetta hai file mein chahe kahin bhi ho — aur bilkul isi tarah ittefaqan specificity wars shuru hote hain: koi thoda zyada specific selector uthata hai *is* override ko jeetne ke liye, bina ye samjhe ki usne har future override koshish ke liye bhi bar utha di hai.

## @layer: ganit se nahi, declaration se priority

\`\`\`css
@layer reset, base, components, utilities, overrides;

@layer reset {
  * { margin: 0; padding: 0; }
}
@layer base {
  body { font: 16px/1.5 sans-serif; }
}
@layer components {
  .card .button.primary.large { background: blue; }   /* bahut high specificity */
}
@layer utilities {
  .bg-red { background: red; }   /* kam specificity, par baad ki, zyada-priority wali LAYER */
}
\`\`\`

Baad mein declare hui layer ka rule pehle declare hui layer ke rule ko harata hai **specificity chahe kuch bhi ho** — upar wali utility class \`components\` ke chaar-hisson wale selector ko haraati hai, halaanki uski apni specificity kaafi kam hai, kyunki \`utilities\` \`@layer\` statement mein \`components\` ke baad declare hui thi. Layers pehle compare hoti hain; specificity sirf usi layer *ke andar* tie todne ke liye poochhi jati hai. Unlayered CSS (koi bhi rule jo \`@layer\` block ke andar nahi hai) hamesha har layered rule ko harata hai, jo jaan-boojh kar chhoda gaya raasta hai — par iska matlab hai codebase mein \`@layer\` dheere-dheere lagu karne ke liye maujood CSS ko bhi apni khud ki layer mein lapetna padega, nahi to naye layered rules use anapekshit roop se harenge.

## Native CSS nesting

\`\`\`css
.card {
  padding: 16px;
  border: 1px solid #e5e7eb;

  & .title {
    font-weight: 600;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  &.featured {
    border-color: var(--brand);
  }

  @media (min-width: 700px) {
    padding: 24px;
  }
}
\`\`\`

Ye concept ke roop mein wahi flat rules mein compile hota hai jo aap haath se likhoge — \`.card .title\`, \`.card:hover\`, \`.card.featured\`, aur ek media-query-mein-lipta hua \`.card\`. Nesting ek source-code organisation ka auzaar hai; ye specificity ya cascade ke baare mein kuch nahi badalta, sirf ye ki rules page par dikhne mein kaise group hote hain.

## :has() — parent/relational selector

\`\`\`css
/* form group ko alag style karo agar usme invalid input ho */
.form-group:has(input:invalid) { border-color: red; }

/* card ko alag padding milti hai iss par ki usme image hai ya nahi */
.card:has(img) { padding-top: 0; }
.card:not(:has(img)) { padding-top: 16px; }

/* label ko uske apne checkbox ki checked state ke hisaab se style karo — koi JS nahi chahiye */
label:has(input:checked) { font-weight: 600; color: var(--brand); }

/* koi bhi heading chuno jiske turant baad paragraph aata hai — PEHLE wale sibling ko style karo */
h2:has(+ p) { margin-bottom: 8px; }
\`\`\`

\`:has()\` se pehle har selector element ko sirf uske ancestors, usse pehle wale siblings, ya khud ke hisaab se bata sakta tha — kabhi uske descendants ya uske baad kya aata hai uske hisaab se nahi. \`:has()\` apne argument ki tarah poora selector leta hai aur bahar wale element ko match karta hai agar *koi bhi* descendant (ya, \`+\`/\`~\` ke saath milkar, sibling) usse match kare, jo "sirf ek CSS rule chalu karne ke liye JavaScript se class jodo" jaise poori category ke jugaad khatam kar deta hai.

## SCSS/Sass, sankshep mein, aur native CSS ne ab tak kya sameet liya hai

\`\`\`scss
// Sass nesting, variables, aur mixins — wo wajahein jinke liye log itihaas mein Sass uthaate the
$brand: #2563eb;
.card {
  padding: 16px;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
}
@mixin button-base { padding: 8px 16px; border-radius: 4px; }
.btn { @include button-base; background: $brand; }
\`\`\`

Native CSS mein ab nesting hai (upar dikhaya gaya) aur custom properties hain (Module 6 ka pehla lesson) jo Sass ki do asli bunyaadi wajahon ko cover karti hain. Native CSS mein abhi bhi **nahi** hai: mixins (parameters wale reuse hone layak declaration blocks), khud define kiye hue functions, aur build-time loops/conditionals ek list of values par. Sass in ke liye sach mein kaam ka bana hua hai, aur bade design systems mein component-scoped styles compile karne ke liye — ye purana nahi pada, par 2023 se "Sass kyun uthaao" aur "native CSS kyun uthaao" ke beech ka gap kaafi kam ho gaya hai.

## Scale par naming conventions: BEM aur utility-first

\`\`\`css
/* BEM: Block__Element--Modifier */
.card { }
.card__title { }
.card__title--large { }
.card--featured { }
\`\`\`

\`\`\`html
<!-- utility-first (Tailwind-jaisa): chhoti, ek-kaam-wali classes jodna -->
<div class="p-4 rounded-lg shadow-md hover:shadow-lg">
\`\`\`

BEM specificity ko flat rakhta hai (har selector ek akeli class hai) aur naam mein rishton ko saaf batata hai, iski keemat verbose HTML class attributes aur har naye component ke saath badhti CSS files hain. Utility-first CSS ko khud lagbhag static rakhta hai (single-property classes ka ek fixed set) aur composition ko HTML mein dhakelta hai, lambe \`class\` attributes ko us CSS bundle se badalte hue jo product badhne par lagbhag nahi badhta. Dono legitimate, widely-used jawab hain usi bunyaadi samasya ke jispar ye poora lesson hai: codebase ek page se sau tak badhne par specificity aur cascade ke vyavhaar ko anumaanit rakhna.`,

    examples: [
      {
        title: 'The specificity surprise: order does not always win',
        titleHi: 'Specificity ka chaunkaana: kram hamesha nahi jeetta',
        code: `.title { color: red; }         /* written SECOND in the file */
.card .title { color: blue; }  /* written FIRST, but higher specificity */`,
        preview: page(`<div class="card"><p class="title">Which colour wins?</p></div>`,
`.card .title { color:blue; font-size:14px; }
.title { color:red; font-size:14px; }`),
        previewHeight: 90,
        explain: 'Blue wins, even though `.title { color: red; }` appears LAST in the file. `.card .title` has two classes chained by a combinator, giving it higher specificity — source order is the tiebreaker only when specificity is equal, and here it is not.',
        explainHi: 'Blue jeetta hai, halaanki \`.title { color: red; }\` file mein AAKHRI mein aata hai. \`.card .title\` mein ek combinator se judi do classes hain, jo use zyada specificity deti hain — source order sirf tab tiebreaker hai jab specificity barabar ho, aur yahan wo nahi hai.',
      },
      {
        title: 'The !important escalation',
        titleHi: '!important ki badhti jung',
        code: `.button { background: blue !important; }
/* someone later needs to override this for a disabled state */
.button.disabled { background: gray !important; }   /* the only remaining weapon */`,
        preview: page(`<button class="button">Normal</button>
<button class="button disabled">Disabled</button>
<p style="font-size:13px;color:#666;margin-top:8px">Both required !important — the second one exists only because the first one blocked normal specificity from working.</p>`,
`.button { padding:8px 16px; background:blue !important; color:white; border:0; margin-right:8px; }
.button.disabled { background:gray !important; }`),
        previewHeight: 140,
        explain: 'The disabled state only needed !important because the base rule used it first, closing off the normal specificity system as an option. Every future override on this property now has to fight through !important too.',
        explainHi: 'Disabled state ko !important sirf isliye chahiye pada kyunki base rule ne use pehle istemaal kiya, aur normal specificity system ko ek vikalp ki tarah band kar diya. Is property par ab har future override ko bhi !important se hokar ladna padega.',
      },
      {
        title: '@layer resolves it without any !important',
        titleHi: '@layer bina kisi !important ke isse suljhaata hai',
        code: `@layer components, overrides;
@layer components { .button { background: blue; } }
@layer overrides   { .button.disabled { background: gray; } }`,
        preview: page(`<button class="button">Normal</button>
<button class="button disabled">Disabled — wins via layer order, no !important anywhere</button>`,
`@layer components, overrides;
@layer components { .button { padding:8px 16px; background:blue; color:white; border:0; margin-right:8px; } }
@layer overrides { .button.disabled { background:gray; } }`),
        previewHeight: 140,
        explain: 'The disabled rule wins because `overrides` was declared after `components` in the layer order — a plain, unweighted declaration. No !important was needed anywhere, and a future third layer can still be inserted above `overrides` if a genuinely higher-priority need arises.',
        explainHi: 'Disabled rule jeetta hai kyunki layer order mein \`overrides\` ko \`components\` ke baad declare kiya gaya tha — ek saada, bina-wazan declaration. Kahin bhi !important ki zarurat nahi padi, aur agar sach mein zyada-priority ki zarurat aaye to \`overrides\` ke upar ek teesri layer abhi bhi daali ja sakti hai.',
      },
      {
        title: 'A high-specificity rule still loses to a later layer',
        titleHi: 'Ek high-specificity rule phir bhi baad ki layer se haarta hai',
        code: `@layer components, utilities;
@layer components { .card .button.primary.large { background: navy; } }  /* very specific */
@layer utilities   { .bg-red { background: red; } }                       /* one class, but a later layer */`,
        preview: page(`<div class="card"><button class="button primary large bg-red">Which colour wins?</button></div>`,
`@layer components, utilities;
@layer components { .card .button.primary.large { background:navy; color:white; padding:8px 16px; border:0; } }
@layer utilities { .bg-red { background:red; } }`),
        previewHeight: 110,
        explain: 'Red wins, despite `.bg-red` having far lower specificity than the four-part `.card .button.primary.large` selector — because `utilities` is a later-declared layer, and layer order beats specificity entirely, every time, before specificity is even consulted.',
        explainHi: 'Red jeetta hai, halaanki \`.bg-red\` ki specificity chaar-hisson wale \`.card .button.primary.large\` selector se kaafi kam hai — kyunki \`utilities\` ek baad mein declare hui layer hai, aur layer order specificity ko poori tarah harata hai, har baar, specificity se poocha jaane se pehle hi.',
      },
      {
        title: 'Native CSS nesting with the & selector',
        titleHi: '& selector ke saath native CSS nesting',
        code: `.card {
  padding: 16px;
  & .title { font-weight: 600; }
  &:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.15); }
}`,
        preview: page(`<div class="card"><p class="title">Hover this card</p></div>`,
`.card { padding:16px; background:#f8fafc; border:1px solid #e2e8f0; }
.card .title { font-weight:600; margin:0; }
.card:hover { box-shadow:0 4px 10px rgba(0,0,0,0.15); }`),
        previewHeight: 110,
        explain: 'The nested source (in the code sample) and this flat, expanded CSS (in the preview) produce identical behaviour and identical specificity — nesting only changes how the rules are grouped in the source file, not how the cascade evaluates them.',
        explainHi: 'Nested source (code sample mein) aur ye flat, khula hua CSS (preview mein) ek jaisa vyavhaar aur ek jaisi specificity dete hain — nesting sirf ye badalta hai ki rules source file mein kaise group hote hain, cascade unhe kaise ganit karta hai wo nahi.',
      },
      {
        title: ':has() styling a card based on its own contents',
        titleHi: ':has() apne khud ke content ke hisaab se card style karna',
        code: `.card:has(img) { padding-top: 0; }
.card:not(:has(img)) { padding-top: 16px; }`,
        preview: page(`<div class="card"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60'%3E%3Crect width='100' height='60' fill='%2360a5fa'/%3E%3C/svg%3E"><p>Has an image — no top padding</p></div>
<div class="card"><p>No image — normal top padding</p></div>`,
`.card { border:1px solid #e2e8f0; margin-bottom:8px; font-size:13px; }
.card:has(img) { padding-top:0; padding:0 12px 12px; }
.card:not(:has(img)) { padding:16px 12px; }
.card img { display:block; width:100%; }`),
        previewHeight: 220,
        explain: 'The card\'s own styling depends on whether it contains an image, decided entirely in CSS. Before :has(), this required JavaScript to inspect the DOM and toggle a class — a large category of such workarounds is now simply unnecessary.',
        explainHi: 'Card ki apni styling iss par nirbhar hai ki usme image hai ya nahi, poori tarah CSS mein tay hoti hai. :has() se pehle, iske liye DOM check karke class toggle karne ke liye JavaScript chahiye thi — aise jugaad ki ek badi category ab bilkul zaruri nahi rahi.',
      },
      {
        title: ':has() styling a label from its own checkbox state',
        titleHi: ':has() apne khud ke checkbox ki state se label style karna',
        code: `label:has(input:checked) { color: var(--brand); font-weight: 600; }`,
        preview: page(`<label class="opt"><input type="checkbox"> Option A</label>
<label class="opt"><input type="checkbox" checked> Option B — already checked</label>`,
`:root { --brand:#2563eb; }
.opt { display:block; font-size:14px; margin:4px 0; }
.opt:has(input:checked) { color:var(--brand); font-weight:600; }`),
        previewHeight: 100,
        explain: 'Click either checkbox and its own label restyles instantly — no JavaScript event listener required. `:has()` lets the label react to the state of an element nested inside it, something no prior CSS selector could express.',
        explainHi: 'Koi bhi checkbox click karo aur uska apna label turant dobara style ho jata hai — koi JavaScript event listener nahi chahiye. \`:has()\` label ko uske andar nested element ki state par react karne deta hai, jo pehle koi bhi CSS selector nahi kah sakta tha.',
      },
      {
        title: 'BEM: flat specificity through naming discipline',
        titleHi: 'BEM: naming anushasan se flat specificity',
        code: `.card { }
.card__title { }
.card__title--large { }
.card--featured { }`,
        preview: page(`<div class="card card--featured">
  <p class="card__title card__title--large">BEM-named title</p>
</div>`,
`.card { border:1px solid #e2e8f0; padding:12px; }
.card--featured { border-color:#2563eb; }
.card__title { margin:0; font-size:14px; }
.card__title--large { font-size:18px; font-weight:600; }`),
        previewHeight: 110,
        explain: 'Every selector here is exactly one class — specificity never rises above 0,0,1,0 anywhere in this component, no matter how deeply nested the elements are. The relationships live entirely in the naming convention, not in selector structure.',
        explainHi: 'Yahan har selector bilkul ek class hai — specificity is component mein kahin bhi 0,0,1,0 se upar nahi jati, elements chahe kitne bhi gehre nested hon. Rishte poori tarah naming convention mein rehte hain, selector ke dhanche mein nahi.',
      },
      {
        title: 'Utility-first: composition in the HTML, not the CSS',
        titleHi: 'Utility-first: composition HTML mein, CSS mein nahi',
        code: `<div class="p-4 rounded-lg border shadow-sm hover:shadow-md">
  <!-- the CSS bundle barely grows no matter how many components use these -->
</div>`,
        preview: page(`<div class="box">Composed entirely from small, reusable utility classes — p-4, rounded-lg, border, shadow-sm</div>`,
`.box { padding:16px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 1px 2px rgba(0,0,0,0.05); font-size:13px; }`),
        previewHeight: 100,
        explain: 'No component-specific CSS was written at all — every visual property came from a small, shared set of single-purpose classes. The trade-off is a longer HTML class attribute in exchange for a CSS bundle that grows far more slowly as the product does.',
        explainHi: 'Koi component-specific CSS bilkul nahi likhi gayi — har drishya property ek chhote, saanjhe single-purpose classes ke set se aayi. Trade-off ek lamba HTML class attribute hai us CSS bundle ke badle jo product badhne par kaafi dheere badhta hai.',
      },
      {
        title: 'A gradual @layer migration, unlayered CSS still winning',
        titleHi: 'Dheere-dheere @layer migration, unlayered CSS phir bhi jeetta hai',
        code: `@layer components { .button { background: blue; } }
/* unlayered legacy rule, written anywhere, with LOWER specificity: */
.button { background: green; }`,
        preview: page(`<button class="button">Which colour?</button>
<p style="font-size:13px;color:#666;margin-top:8px">The unlayered rule wins, even though it looks weaker on paper — this is the deliberate escape hatch that lets a codebase adopt @layer gradually.</p>`,
`@layer components { .button { padding:8px 16px; background:blue; color:white; border:0; } }
.button { background:green; }`),
        previewHeight: 130,
        explain: 'Any rule outside an @layer block always beats every layered rule, regardless of specificity, by design. This means introducing @layer to an existing large codebase safely requires also wrapping the pre-existing CSS in its own layer, or it will unexpectedly out-rank the new layered rules.',
        explainHi: 'Kisi bhi @layer block ke bahar ka rule hamesha har layered rule ko harata hai, specificity chahe kuch bhi ho, jaan-boojh kar. Iska matlab hai maujood badi codebase mein @layer surakshit tarike se laane ke liye pehle se maujood CSS ko bhi apni khud ki layer mein lapetna padega, nahi to wo naye layered rules ko anapekshit roop se hara degi.',
      },
    ],

    mistakes: [
      {
        wrong: `.button { background: blue !important; }
/* every future override now needs !important too, escalating forever */`,
        right: `@layer components, overrides;
@layer components { .button { background: blue; } }
@layer overrides { .button.disabled { background: gray; } }`,
        why: '!important wins the immediate battle but leaves the next person who needs to override this rule with only one weapon — a competing !important — starting an arms race. @layer settles precedence by declared order instead, with no escalation possible.',
        whyHi: '!important turant ki ladai jeet leta hai par is rule ko override karne wale agle vyakti ke paas sirf ek hathiyar chhodta hai — ek competing !important — jo hathiyaron ki daud shuru kar deta hai. @layer priority declared order se tay karta hai, koi badhaav mumkin nahi.',
      },
      {
        wrong: `.card .title { color: blue; }
/* someone tries to override this LATER in the file with equal-looking specificity */
.page .title { color: red; }   /* also loses if .card wraps deeper, or wins unpredictably depending on markup */`,
        right: `@layer components, overrides;
@layer components { .card .title { color: blue; } }
@layer overrides { .title.emphasis { color: red; } }   /* wins deterministically, by layer, not by guessing selector depth */`,
        why: 'Fighting a specificity battle by adding more selector chains is fragile — the outcome depends on markup structure that can change. A layer-based override wins deterministically because of declared layer order, not because of how many ancestors happen to be chained in the selector.',
        whyHi: 'Zyada selector chains jodkar specificity ki ladai ladna kamzor hai — nateeja markup structure par nirbhar hai jo badal sakta hai. Layer-based override deterministically jeetta hai declared layer order ki wajah se, na ki selector mein kitne ancestors chain hue hain uski wajah se.',
      },
      {
        wrong: `.card__title--large.card--featured .icon { }   /* deeply chained selector trying to be "specific enough" */`,
        right: `/* BEM: name the exact relationship instead of chaining selectors to force specificity */
.card--featured .card__icon--large { }`,
        why: 'A deeply chained selector is fragile against markup changes and hard to read. BEM\'s naming convention expresses the same relationship through the class name itself, keeping every selector a single flat class regardless of how deeply nested the actual HTML is.',
        whyHi: 'Gehra chained selector markup badlav ke aage kamzor hai aur padhna mushkil. BEM ka naming convention wahi rishta class naam ke zariye khud bataata hai, har selector ko ek flat class rakhte hue, asli HTML chahe kitna bhi gehra nested ho.',
      },
    ],

    realWorld: [
      {
        en: '**Every large design system eventually adopts `@layer`.** Once a component library ships alongside consumer app CSS, the two inevitably fight for precedence — `@layer` is now the standard, purpose-built fix, replacing the older trick of deliberately inflating selector specificity or reaching for `!important`.',
        hi: '**Har badi design system aakhirkaar `@layer` apna leti hai.** Jab ek component library consumer app ki CSS ke saath bheji jati hai, dono aakhirkaar priority ke liye ladti hain — `@layer` ab standard, isi kaam ke liye bana fix hai, jo purane jugaad ki jagah leta hai jismein jaan-boojh kar selector specificity badhaayi jati thi ya `!important` uthaaya jata tha.',
      },
      {
        en: '**`:has()` replaced a large class of JavaScript-only patterns.** Form validation styling (a field group turning red when its input is invalid), "empty state" detection, and conditional layout based on child content are now pure CSS in every evergreen browser.',
        hi: '**`:has()` ne JavaScript-only patterns ki ek badi category ki jagah le li.** Form validation styling (field group ka laal hona jab uska input invalid ho), "empty state" pehchaanna, aur bachche ke content ke hisaab se conditional layout ab har evergreen browser mein khaalis CSS hai.',
      },
      {
        en: '**Tailwind CSS is the most visible utility-first success story**, and its adoption at massive scale (GitHub, OpenAI, Shopify storefronts) is largely a response to CSS bundle size and specificity chaos becoming unmanageable in component-class-per-thing architectures at large team size.',
        hi: '**Tailwind CSS sabse dikhne wali utility-first safalta ki kahaani hai**, aur bade paimane par uska apnaya jaana (GitHub, OpenAI, Shopify storefronts) zyadatar us jawab ka nateeja hai jab CSS bundle size aur specificity ki afra-tafri bade team size par component-class-per-thing architectures mein sambhalna mushkil ho gayi.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain how CSS specificity is calculated and why source order sometimes does not decide which rule wins.',
        qHi: 'CSS specificity kaise ganit hoti hai samjhao, aur source order kabhi kabhi kyun tay nahi karta kaunsa rule jeetega.',
        a: 'Specificity is calculated as a four-part value: inline styles outrank IDs, IDs outrank classes/attributes/pseudo-classes, and those outrank elements/pseudo-elements, compared strictly left to right. When two rules target the same element, the one with higher specificity wins regardless of which appears later in the stylesheet. Source order only acts as the tiebreaker when two rules have exactly equal specificity — which is why a common misconception, "later in the file always wins", breaks the moment one selector happens to be more specific than the other, even if it was written earlier.',
        aHi: 'Specificity ek chaar-hisson wali value ki tarah ganit hoti hai: inline styles IDs se upar hain, IDs classes/attributes/pseudo-classes se upar hain, aur wo elements/pseudo-elements se upar hain, seedhe baayein se dayein compare karte hue. Jab do rules ek hi element ko target karte hain, jiski specificity zyada hai wo jeetta hai file mein baad mein aaye ya pehle. Source order sirf tab tiebreaker ki tarah kaam karta hai jab do rules ki specificity bilkul barabar ho — isiliye ek aam galatfehmi, "file mein baad wala hamesha jeetta hai", tab toot jati hai jab ek selector doosre se zyada specific nikal jata hai, chahe wo pehle likha gaya ho.',
      },
      {
        q: 'What problem does @layer solve, and how does its precedence model differ from ordinary specificity?',
        qHi: '@layer kaunsi samasya hal karta hai, aur uska priority model saadhi specificity se kaise alag hai?',
        a: '@layer solves the "specificity war" problem: as a codebase grows, developers reach for increasingly specific selectors or !important to win overrides, which escalates without end because each override raises the bar for the next one. @layer lets you declare a fixed precedence order between named groups of rules up front — for example reset, base, components, then overrides — and any rule in a later-declared layer beats any rule in an earlier-declared layer, regardless of how much lower its own selector specificity is. Specificity is only consulted to break ties within the same layer; between layers, the declared order settles everything first.',
        aHi: '@layer "specificity war" ki samasya hal karta hai: codebase badhne par, developers overrides jeetne ke liye zyada se zyada specific selectors ya !important uthaate hain, jo bina ant ke badhta jata hai kyunki har override agle ke liye bar utha deta hai. @layer aapko pehle hi named groups of rules ke beech ek pakka priority kram declare karne deta hai — jaise reset, base, components, phir overrides — aur baad mein declare hui layer ka koi bhi rule pehle declare hui layer ke kisi bhi rule ko harata hai, uski apni selector specificity chahe kitni bhi kam ho. Specificity sirf usi layer ke andar tie todne ke liye poochhi jati hai; layers ke beech, declared kram sab kuch pehle hi tay kar deta hai.',
      },
      {
        q: 'What does `:has()` let you do that no earlier CSS selector could, and give a concrete example.',
        qHi: '\`:has()\` aapko wo kya karne deta hai jo koi pehle wala CSS selector nahi kar sakta tha, ek asli udahran do.',
        a: 'Every CSS selector before `:has()` could only describe an element in relation to its ancestors, preceding siblings, or itself — never in terms of what it contains or what follows it. `:has()` takes a full selector as an argument and matches the outer element if any descendant (or, with a combinator, sibling) matches that inner selector, functioning as CSS\'s first genuine "parent selector". A concrete example: `label:has(input:checked) { color: blue; }` restyles a label based on the checked state of the checkbox nested inside it — previously this required a JavaScript event listener to toggle a class, and now it is pure CSS.',
        aHi: '\`:has()\` se pehle har CSS selector element ko sirf uske ancestors, usse pehle wale siblings, ya khud ke rishte mein bata sakta tha — kabhi wo kya rakhta hai ya uske baad kya aata hai uske hisaab se nahi. \`:has()\` apne argument ki tarah poora selector leta hai aur bahar wale element ko match karta hai agar koi bhi descendant (ya, combinator ke saath, sibling) us andar wale selector se match kare, CSS ke pehle asli "parent selector" ki tarah kaam karte hue. Ek asli udahran: \`label:has(input:checked) { color: blue; }\` label ko uske andar nested checkbox ki checked state ke hisaab se dobara style karta hai — pehle iske liye class toggle karne ko JavaScript event listener chahiye tha, ab ye khaalis CSS hai.',
      },
      {
        q: 'What does native CSS nesting change about specificity, and what is it actually for?',
        qHi: 'Native CSS nesting specificity ke baare mein kya badalta hai, aur ye asal mein kis liye hai?',
        a: 'Nesting changes nothing about specificity or cascade behaviour — a nested rule has exactly the specificity its fully expanded, flat equivalent selector would have. `.card { & .title { } }` produces identical specificity and behaviour to writing `.card .title { }` directly. Nesting is purely a source-code organisation tool: it lets related rules for one component be grouped visually together in the stylesheet, which is a readability and maintenance benefit, not a change to how the cascade resolves conflicts.',
        aHi: 'Nesting specificity ya cascade ke vyavhaar ke baare mein kuch nahi badalta — nested rule ki specificity bilkul wahi hoti hai jo uske poori tarah khule hue, flat barabar selector ki hoti. \`.card { & .title { } }\` seedha \`.card .title { }\` likhne jaisi hi specificity aur vyavhaar deta hai. Nesting poori tarah ek source-code organisation ka auzaar hai: ye ek component ke jude hue rules ko stylesheet mein dikhne mein saath group karne deta hai, jo readability aur maintenance ka fayda hai, cascade conflicts kaise suljhaata hai usme koi badlav nahi.',
      },
      {
        q: 'Compare BEM and utility-first CSS as answers to the same architectural problem.',
        qHi: 'BEM aur utility-first CSS ko usi architectural samasya ke jawab ki tarah compare karo.',
        a: 'Both aim to keep specificity predictable and manageable as a codebase scales to many components. BEM (Block__Element--Modifier) achieves this by convention: every selector is a single flat class, so specificity never rises regardless of nesting depth, and relationships between elements are expressed in the class name itself — the trade-off is verbose, repetitive class attributes in HTML and a CSS file that grows linearly with the number of components. Utility-first (Tailwind-style) achieves it by composing many small, single-property classes directly in the markup, keeping the CSS bundle itself nearly static as the product grows — the trade-off is longer, denser `class` attributes and styling logic that lives in HTML rather than CSS files. Neither is objectively correct; they represent different points on the same trade-off between HTML verbosity and CSS file growth.',
        aHi: 'Dono ka lakshya hai codebase kai components tak badhne par specificity ko anumaanit aur sambhalne layak rakhna. BEM (Block__Element--Modifier) ise convention se paata hai: har selector ek flat class hai, isliye specificity nesting depth chahe kuch bhi ho kabhi nahi badhti, aur elements ke beech rishte class naam mein hi bataye jate hain — trade-off HTML mein verbose, dohraaye jaane wale class attributes aur components ki sankhya ke saath seedha badhti CSS file hai. Utility-first (Tailwind-jaisa) ise seedhe markup mein kai chhoti, single-property classes jodkar paata hai, product badhne par CSS bundle ko khud lagbhag static rakhte hue — trade-off lambe, ghane \`class\` attributes aur styling logic hai jo CSS files ke bajaye HTML mein rehta hai. Koi bhi wastavik roop se sahi nahi hai; dono HTML verbosity aur CSS file growth ke beech usi trade-off ke alag-alag bindu darshate hain.',
      },
    ],

    exercises: [
      {
        task: 'Build the specificity surprise: write `.title { color: red; }` after `.card .title { color: blue; }` in the file, and confirm blue still wins. Then add a third rule with even higher specificity to override it.',
        taskHi: 'Specificity ka chaunkaana banao: \`.card .title { color: blue; }\` ke baad file mein \`.title { color: red; }\` likho, aur confirm karo blue phir bhi jeetta hai. Phir isse override karne ke liye ek teesra rule likho jiski specificity aur bhi zyada ho.',
        hint: 'Try #id .title, or .card.featured .title, to see specificity climb.',
        hintHi: 'Specificity badhte dekhne ke liye #id .title, ya .card.featured .title try karo.',
      },
      {
        task: 'Rebuild that same conflict using @layer instead — put the two rules in differently-ordered layers and confirm the later-declared layer wins regardless of selector specificity.',
        taskHi: 'Wahi conflict @layer use karke dobara banao — do rules ko alag-alag kram ki layers mein rakho aur confirm karo baad mein declare hui layer selector specificity chahe kuch bhi ho jeetti hai.',
        hint: 'Give the "losing" rule a much higher specificity on purpose and confirm it still loses to the later layer.',
        hintHi: '"Haarne wale" rule ko jaan-boojh kar kaafi zyada specificity do aur confirm karo wo phir bhi baad ki layer se haarta hai.',
      },
      {
        task: 'Build a form group that turns its border red using `:has(input:invalid)`, with no JavaScript at all. Then add a checkbox-driven label restyle using `:has(input:checked)`.',
        taskHi: 'Bina kisi JavaScript ke \`:has(input:invalid)\` use karke ek form group banao jiska border invalid hone par laal ho jaye. Phir \`:has(input:checked)\` use karke checkbox-driven label restyle jodo.',
        hint: 'Use `<input type="email" required>` and type an invalid value to trigger `:invalid` naturally.',
        hintHi: '\`:invalid\` ko svaabhavik roop se trigger karne ke liye \`<input type="email" required>\` use karo aur ek invalid value type karo.',
      },
    ],

    keyTakeaways: [
      'Specificity is compared as a four-part value (inline, id, class, element); source order only breaks ties when specificity is equal.',
      '!important wins one battle but forces every future override to also use !important, escalating without end.',
      '@layer settles precedence between named layers by declared order, independent of selector specificity — and unlayered CSS always beats layered CSS.',
      'Native CSS nesting changes only how rules are grouped in the source file — it does not change specificity or cascade behaviour.',
      '`:has()` is CSS\'s first relational selector, matching a parent based on what it contains rather than only its ancestors.',
      'BEM keeps specificity flat via naming convention; utility-first keeps the CSS bundle nearly static by composing classes in HTML — both solve the same scaling problem differently.',
    ],
    keyTakeawaysHi: [
      'Specificity ek chaar-hisson wali value ki tarah compare hoti hai (inline, id, class, element); source order sirf tab tie todta hai jab specificity barabar ho.',
      '!important ek ladai jeet leta hai par har future override ko bhi !important use karne majboor karta hai, bina ant ke badhta hua.',
      '@layer named layers ke beech priority ko declared kram se tay karta hai, selector specificity se bekhabar — aur unlayered CSS hamesha layered CSS ko harata hai.',
      'Native CSS nesting sirf ye badalta hai ki rules source file mein kaise group hote hain — ye specificity ya cascade ke vyavhaar ko nahi badalta.',
      '\`:has()\` CSS ka pehla relational selector hai, jo parent ko uske ancestors ke bajaye uske andar kya hai uske hisaab se match karta hai.',
      'BEM naming convention se specificity flat rakhta hai; utility-first HTML mein classes jodkar CSS bundle ko lagbhag static rakhta hai — dono usi scaling samasya ko alag-alag tarike se hal karte hain.',
    ],
  },
];
