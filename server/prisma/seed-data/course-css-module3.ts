/**
 * CSS & HTML Complete Course — Module 3 (Layout), lessons 1–2.
 *
 * Normal flow and flexbox. Flow comes first deliberately: most "flexbox
 * problems" are really a misunderstanding of what block and inline already do,
 * and flexbox only makes sense as a deviation from a default you can name.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals. One stray backtick closes the literal early.
 */

import type { CourseLesson } from './course-js-module1';

const page = (body: string, css = '') => `<!doctype html><html><head><meta charset="utf-8">
<style>
  body { font: 15px/1.5 system-ui, sans-serif; margin: 12px; color: #111; }
  ${css}
</style></head><body>${body}</body></html>`;

/** Shared look for layout demos so the boxes read as boxes. */
const boxes = `
  .box { background:#dbeafe; border:1px solid #60a5fa; padding:8px 12px; }
  .wrap { border:2px dashed #94a3b8; padding:8px; }
`;

export const CSS_MODULE_3: CourseLesson[] = [
  {
    slug: 'css-display-flow',
    title: 'Display and Normal Flow',
    titleHi: 'Display aur Normal Flow',
    description: 'Your nav links stacked vertically. Nothing is broken — that is what block means.',
    descriptionHi: 'Aapke nav links khade ho gaye. Kuch toota nahi — block ka matlab yahi hai.',
    difficulty: 'EASY',
    duration: 28,
    order: 1,

    analogy: {
      en: '**Words in a paragraph versus paragraphs on a page.** Words sit side by side and wrap to the next line when they run out of room — that is *inline*. Paragraphs each take a full line and stack downwards no matter how short they are — that is *block*. Every element on a page is already behaving as one of these two before you write a single line of CSS. Layout is not about adding behaviour; it is about knowing which default you are overriding.',
      hi: '**Paragraph mein shabd, aur page par paragraphs.** Shabd ek doosre ke bagal mein baithte hain aur jagah khatam hone par agli line par chale jate hain — wo *inline* hai. Paragraphs har ek poori line lete hain aur chhote hone par bhi neeche ki taraf lagte jate hain — wo *block* hai. Page ka har element ek line CSS likhne se pehle hi in do mein se ek jaisa vyavhaar kar raha hai. Layout vyavhaar jodna nahi hai; ye jaanna hai ki aap kaunsa default badal rahe ho.',
    },

    simple: `**Start broken.** You write a navigation bar:

\`\`\`html
<nav>
  <a href="/">Home</a>
  <a href="/docs">Docs</a>
  <a href="/pricing">Pricing</a>
</nav>
\`\`\`

Links are inline, so they sit in a row. Good. Now you add padding to make them tappable:

\`\`\`css
nav a { padding: 12px 16px; background: #dbeafe; }
\`\`\`

The backgrounds overlap the lines above and below. So you reach for \`display: block\` to fix it — and now every link is on its own line and the nav is a vertical list.

**Nothing is broken.** You asked for two different things and got both.

**The two defaults**

\`\`\`css
display: block;    /* full width available, stacks downward, respects all padding */
display: inline;   /* only as wide as its content, sits in a row, IGNORES vertical size */
\`\`\`

An inline element ignores \`width\`, \`height\`, and vertical margin. It accepts vertical *padding* but that padding does not push anything away — it just overlaps its neighbours. That is exactly the overlap you saw.

**The fix is the third value**

\`\`\`css
nav a { display: inline-block; padding: 12px 16px; }
\`\`\`

\`inline-block\` means: sit in a row like inline, but size like a block. Row layout *and* real padding.

**So what is flexbox for?**

\`inline-block\` still has the flaws of text layout. The gaps between your links come from the *whitespace in your HTML*, so deleting a newline changes your spacing. And you cannot say "spread these across the bar" or "make them all the same height".

\`display: flex\` replaces text layout with real layout:

\`\`\`css
nav { display: flex; gap: 8px; }
\`\`\`

Now the gap is a number you control, and the children are flex items — a different set of rules entirely.

**Remember the order:** block stacks, inline flows, \`inline-block\` does both, and flexbox exists because the first three are text rules being used for layout.`,

    simpleHi: `**Toote hue se shuru.** Aap ek navigation bar likhte ho:

\`\`\`html
<nav>
  <a href="/">Home</a>
  <a href="/docs">Docs</a>
  <a href="/pricing">Pricing</a>
</nav>
\`\`\`

Links inline hain, isliye wo ek line mein baithte hain. Achha. Ab aap padding daalte ho taaki tap karna aasan ho:

\`\`\`css
nav a { padding: 12px 16px; background: #dbeafe; }
\`\`\`

Backgrounds upar-neeche ki lines par chadh jate hain. To aap \`display: block\` uthate ho — aur ab har link apni line par hai aur nav ek khadi list ban gayi.

**Kuch toota nahi hai.** Aapne do alag cheezein maangi thi aur dono mili.

**Do defaults**

\`\`\`css
display: block;    /* poori mile hui chaudai, neeche lagta hai, saari padding maanta hai */
display: inline;   /* sirf apne content jitna chauda, line mein baithta hai, vertical size ANNDEKHA karta hai */
\`\`\`

Inline element \`width\`, \`height\`, aur vertical margin ko anndekha karta hai. Vertical *padding* maanta hai par wo padding kisi ko dhakelti nahi — sirf padosiyon par chadh jati hai. Wahi chadhna aapne dekha.

**Fix teesri value hai**

\`\`\`css
nav a { display: inline-block; padding: 12px 16px; }
\`\`\`

\`inline-block\` matlab: line mein baitho inline ki tarah, par size lo block ki tarah. Row layout *aur* asli padding.

**To phir flexbox kis liye?**

\`inline-block\` mein text layout ki kamiyan ab bhi hain. Aapke links ke beech ke gaps *HTML ke whitespace* se aate hain, isliye ek newline hatane se spacing badal jati hai. Aur aap ye nahi keh sakte ki "inhe bar mein failao" ya "sabki oonchai barabar karo".

\`display: flex\` text layout ko asli layout se badal deta hai:

\`\`\`css
nav { display: flex; gap: 8px; }
\`\`\`

Ab gap ek number hai jo aapke haath mein hai, aur bachche flex items hain — poore alag niyamon ka set.

**Kram yaad rakho:** block lagta hai, inline behta hai, \`inline-block\` dono karta hai, aur flexbox isliye hai ki pehle teen layout ke liye istemaal hote text ke niyam hain.`,

    content: `## The display values that matter

| Value | Width | Stacks? | Respects height / vertical margin? |
|---|---|---|---|
| \`block\` | fills the parent | yes, downward | yes |
| \`inline\` | fits content | no, flows in a row | **no** |
| \`inline-block\` | fits content | no, flows in a row | yes |
| \`flex\` | fills the parent | children in a row | yes (children become flex items) |
| \`grid\` | fills the parent | children on a grid | yes |
| \`none\` | — | removed from the page entirely | — |

\`display\` sets two things at once: how the element behaves **outside** (does it stack or flow?) and how its children are laid out **inside**. \`display: flex\` makes the box itself a block, and its children flex items.

## Which elements default to what

\`\`\`
block   : div, p, h1–h6, ul, li, section, article, header, footer, form
inline  : span, a, strong, em, code, label, img*, input*, button*
\`\`\`

\`img\`, \`input\` and \`button\` are *replaced* inline elements — inline in flow but, unlike a \`span\`, they do accept width and height.

## Two flow behaviours that surprise people

### Inline elements ignore vertical size

\`\`\`css
span { height: 100px; margin-top: 40px; }   /* both silently ignored */
\`\`\`

The line box is determined by \`line-height\`, not by anything you set on the span. Vertical padding is drawn but reserves no space, so backgrounds overlap.

### The whitespace gap

\`\`\`html
<a>One</a>
<a>Two</a>       <!-- the newline is a real space, about 4px wide -->
\`\`\`

Inline-block items are separated by whatever whitespace is between their tags, because to the browser that whitespace is a text character. That is why old CSS advice included tricks like \`font-size: 0\` on the parent. Do not use those — use flex or grid, where the parent's \`gap\` controls spacing and HTML whitespace is ignored entirely.

## Margin collapsing

Two vertical margins that meet in normal flow merge into one, and the larger wins:

\`\`\`css
h2 { margin-bottom: 20px; }
p  { margin-top: 30px; }
/* the gap is 30px, not 50px */
\`\`\`

This is deliberate — it keeps paragraph spacing even — but it surprises everyone the first time. It applies only in normal flow: **inside a flex or grid container, margins never collapse.**

## The document flow

By default every element is in **normal flow**: block boxes stack, inline boxes flow, and each one takes up space that pushes its siblings along. Two things remove an element from flow — \`position: absolute\` / \`fixed\`, and \`float\` — and once out of flow it no longer pushes anything. That is the source of most collapsed-parent bugs, and it is why we cover positioning after flex and grid rather than before.`,

    contentHi: `## Jo display values matter karti hain

| Value | Chaudai | Lagta hai? | Height / vertical margin maanta hai? |
|---|---|---|---|
| \`block\` | parent bhar deta hai | haan, neeche | haan |
| \`inline\` | content jitni | nahi, line mein behta hai | **nahi** |
| \`inline-block\` | content jitni | nahi, line mein behta hai | haan |
| \`flex\` | parent bhar deta hai | bachche ek row mein | haan (bachche flex items ban jate hain) |
| \`grid\` | parent bhar deta hai | bachche grid par | haan |
| \`none\` | — | page se poori tarah hat jata hai | — |

\`display\` ek saath do cheezein tay karta hai: element **bahar** kaisa vyavhaar kare (lagega ya behega?) aur uske bachche **andar** kaise lagenge. \`display: flex\` box ko khud block banata hai, aur uske bachchon ko flex items.

## Kis element ka default kya hai

\`\`\`
block   : div, p, h1–h6, ul, li, section, article, header, footer, form
inline  : span, a, strong, em, code, label, img*, input*, button*
\`\`\`

\`img\`, \`input\` aur \`button\` *replaced* inline elements hain — flow mein inline, par \`span\` ke ulat width aur height maan lete hain.

## Do flow vyavhaar jo logon ko chaunkate hain

### Inline elements vertical size anndekha karte hain

\`\`\`css
span { height: 100px; margin-top: 40px; }   /* dono chupchap anndekhe */
\`\`\`

Line box \`line-height\` se tay hoti hai, span par set ki kisi cheez se nahi. Vertical padding banti hai par jagah nahi rokti, isliye backgrounds chadh jate hain.

### Whitespace ka gap

\`\`\`html
<a>One</a>
<a>Two</a>       <!-- ye newline asli space hai, lagbhag 4px chauda -->
\`\`\`

Inline-block items ke beech unke tags ke beech ka whitespace aa jata hai, kyunki browser ke liye wo whitespace ek text character hai. Isiliye purani CSS salah mein parent par \`font-size: 0\` jaise jugaad hote the. Wo use na karo — flex ya grid use karo, jahan parent ka \`gap\` spacing chalata hai aur HTML ka whitespace poori tarah anndekha hota hai.

## Margin collapsing

Normal flow mein milne wale do vertical margins ek ban jate hain, aur bada jeet jata hai:

\`\`\`css
h2 { margin-bottom: 20px; }
p  { margin-top: 30px; }
/* gap 30px hai, 50px nahi */
\`\`\`

Ye jaan-boojh kar hai — isse paragraph ki spacing barabar rehti hai — par pehli baar sabko chaunkata hai. Ye sirf normal flow mein lagu hota hai: **flex ya grid container ke andar margins kabhi collapse nahi hote.**

## Document flow

Default roop se har element **normal flow** mein hai: block boxes lagte hain, inline boxes behte hain, aur har ek jagah leta hai jo uske bhai-behnon ko aage dhakelti hai. Do cheezein element ko flow se hatati hain — \`position: absolute\` / \`fixed\`, aur \`float\` — aur flow se bahar hone ke baad wo kisi ko dhakelta nahi. Yahi zyadatar collapsed-parent bugs ki jad hai, aur isiliye positioning hum flex aur grid ke baad padhte hain, pehle nahi.`,

    examples: [
      {
        title: 'The broken nav: inline padding overlaps',
        titleHi: 'Toota nav: inline padding chadh jati hai',
        code: `nav a { padding: 12px 16px; background: #dbeafe; }
/* links are inline — padding is drawn but reserves no space */`,
        preview: page(`<p>Text above the nav that will get covered.</p>
<nav><a href="#">Home</a> <a href="#">Docs</a> <a href="#">Pricing</a></nav>
<p>Text below the nav that will get covered too.</p>`,
`nav a { padding:12px 16px; background:#93c5fd; text-decoration:none; color:#1e3a8a; }`),
        previewHeight: 170,
        explain: 'The blue backgrounds sit on top of the sentences above and below. The padding was drawn, but because these are inline elements it reserved no vertical space, so nothing moved out of the way.',
        explainHi: 'Neele backgrounds upar aur neeche ke vakyon par chadhe hain. Padding bani, par ye inline elements hain isliye usne vertical jagah nahi roki, to koi hata hi nahi.',
      },
      {
        title: 'display: block fixes the overlap and breaks the row',
        titleHi: 'display: block chadhna theek karta hai par row tod deta hai',
        code: `nav a { display: block; padding: 12px 16px; }`,
        preview: page(`<p>Text above.</p>
<nav><a href="#">Home</a> <a href="#">Docs</a> <a href="#">Pricing</a></nav>
<p>Text below.</p>`,
`nav a { display:block; padding:12px 16px; background:#93c5fd; text-decoration:none; color:#1e3a8a; margin-bottom:2px; }`),
        previewHeight: 250,
        explain: 'No more overlap — but each link now claims a full line, so the nav is a vertical list. Both symptoms come from the same rule; you have traded one for the other rather than solving it.',
        explainHi: 'Chadhna khatam — par ab har link poori line le raha hai, to nav khadi list ban gaya. Dono lakshan ek hi rule se aate hain; aapne ek ko doosre se badla hai, hal nahi kiya.',
      },
      {
        title: 'inline-block: row layout with real padding',
        titleHi: 'inline-block: row layout asli padding ke saath',
        code: `nav a { display: inline-block; padding: 12px 16px; }`,
        preview: page(`<p>Text above.</p>
<nav><a href="#">Home</a> <a href="#">Docs</a> <a href="#">Pricing</a></nav>
<p>Text below.</p>`,
`nav a { display:inline-block; padding:12px 16px; background:#93c5fd; text-decoration:none; color:#1e3a8a; }`),
        previewHeight: 190,
        explain: 'A row again, and the padding now pushes the surrounding text away properly. This is the correct fix for the original bug — one value, both symptoms gone.',
        explainHi: 'Phir se ek row, aur padding ab aas-paas ke text ko theek se hata rahi hai. Asli bug ka yahi sahi fix hai — ek value, dono lakshan gaye.',
      },
      {
        title: 'The whitespace gap you did not ask for',
        titleHi: 'Wo whitespace gap jo aapne maanga nahi tha',
        code: `<!-- newlines between tags become real spaces -->
<a>One</a>
<a>Two</a>`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 6px">Tags on separate lines — a gap appears:</p>
<div class="wrap">
  <span class="box">One</span>
  <span class="box">Two</span>
  <span class="box">Three</span>
</div>
<p style="font-size:13px;color:#666;margin:10px 0 6px">Tags with no whitespace between them — the gap is gone:</p>
<div class="wrap"><span class="box">One</span><span class="box">Two</span><span class="box">Three</span></div>`,
`${boxes}
.box { display:inline-block; }`),
        previewHeight: 250,
        explain: 'Identical CSS, different HTML formatting, different spacing. Your layout is depending on where you pressed Enter — which is exactly why inline-block is the wrong tool for a real layout.',
        explainHi: 'Wahi CSS, HTML ki formatting alag, spacing alag. Aapka layout is baat par tika hai ki aapne Enter kahan dabaya — aur isiliye asli layout ke liye inline-block galat auzaar hai.',
      },
      {
        title: 'display: flex — the gap becomes a number',
        titleHi: 'display: flex — gap ek number ban jata hai',
        code: `nav { display: flex; gap: 8px; }`,
        preview: page(`<nav class="f">
  <a href="#">Home</a>
  <a href="#">Docs</a>
  <a href="#">Pricing</a>
</nav>
<p style="font-size:13px;color:#666">HTML whitespace is now ignored completely — <code>gap: 8px</code> is the only thing setting the spacing.</p>`,
`.f { display:flex; gap:8px; border:2px dashed #94a3b8; padding:8px; }
.f a { padding:12px 16px; background:#93c5fd; text-decoration:none; color:#1e3a8a; }`),
        previewHeight: 200,
        explain: 'The parent became a flex container, so its children are no longer text — they are flex items. Reformat the HTML however you like; the spacing will not move.',
        explainHi: 'Parent flex container ban gaya, isliye uske bachche ab text nahi hain — flex items hain. HTML ko jaise chahe format karo; spacing nahi hilegi.',
      },
      {
        title: 'Inline elements ignore width and height',
        titleHi: 'Inline elements width aur height anndekhi karte hain',
        code: `.a { display: inline;       width: 200px; height: 80px; }
.b { display: inline-block; width: 200px; height: 80px; }`,
        preview: page(`<div class="wrap"><span class="a">inline — 200×80 ignored</span></div>
<div class="wrap"><span class="b">inline-block — 200×80 applied</span></div>`,
`${boxes}
.a { display:inline; width:200px; height:80px; background:#fecaca; border:1px solid #ef4444; }
.b { display:inline-block; width:200px; height:80px; background:#bbf7d0; border:1px solid #10b981; }`),
        previewHeight: 210,
        explain: 'The same width and height on both. The inline element discarded them silently — no warning, no error. This is the single most common cause of "my CSS is not applying".',
        explainHi: 'Dono par wahi width aur height. Inline element ne unhe chupchap phenk diya — na warning, na error. "Meri CSS lag hi nahi rahi" ki sabse aam wajah yahi hai.',
      },
      {
        title: 'Margin collapsing in normal flow',
        titleHi: 'Normal flow mein margin collapsing',
        code: `h3 { margin-bottom: 20px; }
p  { margin-top: 30px; }
/* the gap is 30px, not 50px */`,
        preview: page(`<div class="wrap">
  <h3 class="h">margin-bottom: 20px</h3>
  <p class="p">margin-top: 30px — the actual gap is 30px, the larger of the two</p>
</div>
<div class="wrap flexed">
  <h3 class="h">margin-bottom: 20px</h3>
  <p class="p">Same markup inside a flex container — the gap is now 50px, because flex items never collapse margins</p>
</div>`,
`${boxes}
.h { background:#fde68a; margin:0 0 20px; font-size:14px; }
.p { background:#bfdbfe; margin:30px 0 0; font-size:14px; }
.flexed { display:flex; flex-direction:column; }`),
        previewHeight: 330,
        explain: 'Identical markup and margins, two different gaps. Normal flow merged the two margins and kept the larger; the flex container kept both. Knowing which context you are in tells you which arithmetic applies.',
        explainHi: 'Wahi markup aur margins, do alag gaps. Normal flow ne dono margins ko mila kar bada rakha; flex container ne dono rakhe. Aap kis context mein ho, ye jaanne se pata chalta hai kaunsa hisaab lagega.',
      },
      {
        title: 'display: none versus visibility: hidden',
        titleHi: 'display: none aur visibility: hidden',
        code: `.gone   { display: none; }        /* removed from the page */
.hidden { visibility: hidden; }   /* invisible, still takes up space */`,
        preview: page(`<div class="wrap">A <span class="box gone">B</span> C &mdash; display:none, B's space is gone</div>
<div class="wrap">A <span class="box hidden">B</span> C &mdash; visibility:hidden, B's space is held</div>`,
`${boxes}
.box { display:inline-block; }
.gone { display:none; }
.hidden { visibility:hidden; }`),
        previewHeight: 190,
        explain: '`display: none` removes the element from layout entirely and hides it from screen readers. `visibility: hidden` leaves the hole. Use the first to remove something, the second to hide it without the layout shifting.',
        explainHi: '`display: none` element ko layout se poori tarah hata deta hai aur screen readers se bhi chhupa deta hai. `visibility: hidden` khaali jagah chhod deta hai. Kuch hatane ke liye pehla, aur layout hilaye bina chhupane ke liye doosra.',
      },
      {
        title: 'A block element does not need to fill the width',
        titleHi: 'Block element ko poori chaudai bharni zaruri nahi',
        code: `.card { display: block; }              /* fills the parent */
.card { display: block; width: fit-content; }  /* only as wide as needed */`,
        preview: page(`<div class="wrap"><div class="b1">display: block — fills the parent</div></div>
<div class="wrap"><div class="b2">width: fit-content — shrinks to its text</div></div>`,
`${boxes}
.b1 { background:#dbeafe; border:1px solid #60a5fa; padding:8px; }
.b2 { background:#bbf7d0; border:1px solid #10b981; padding:8px; width:fit-content; }`),
        previewHeight: 190,
        explain: '"Block fills the width" is the default, not a law. `fit-content` gives you block stacking with inline-block sizing — useful for a badge or a button that must sit on its own line.',
        explainHi: '"Block poori chaudai bharta hai" default hai, kanoon nahi. `fit-content` block ki tarah lagna aur inline-block jaisi sizing deta hai — aise badge ya button ke liye kaam ka jise apni line par rehna hai.',
      },
      {
        title: 'The img gap nobody expects',
        titleHi: 'img ke neeche wala gap jo koi nahi socheta',
        code: `.frame img { }                    /* mysterious 4px below */
.frame img { display: block; }    /* gone */`,
        preview: page(`<div class="wrap"><span class="ph">image</span></div>
<p style="font-size:13px;color:#666;margin:6px 0">Inline: the box is taller than the image, because the image sits on a text baseline and the descender space below it is reserved.</p>
<div class="wrap"><span class="ph blk">image</span></div>
<p style="font-size:13px;color:#666;margin:6px 0">display: block &mdash; the gap is gone.</p>`,
`${boxes}
.ph { display:inline-block; width:80px; height:40px; background:#93c5fd; color:#1e3a8a; font-size:12px; text-align:center; line-height:40px; }
.blk { display:block; }`),
        previewHeight: 280,
        explain: 'An inline image sits on a text baseline, and the space below the baseline for letters like "g" is reserved even when there is no text. `display: block` takes the image out of the line box and the gap disappears.',
        explainHi: 'Inline image text ki baseline par baithti hai, aur "g" jaise akshar ke liye baseline ke neeche ki jagah bina text ke bhi ruki rehti hai. `display: block` image ko line box se bahar le aata hai aur gap gayab ho jata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `span.badge { width: 100px; height: 30px; }   /* nothing happens */`,
        right: `span.badge { display: inline-block; width: 100px; height: 30px; }`,
        previewWrong: page(`<span class="b">badge</span>`,
          `.b{width:100px;height:30px;background:#fecaca;border:1px solid #ef4444}`),
        previewRight: page(`<span class="b">badge</span>`,
          `.b{display:inline-block;width:100px;height:30px;background:#bbf7d0;border:1px solid #10b981}`),
        previewHeight: 120,
        why: '`span` is inline, and inline elements ignore width, height and vertical margin without any warning. Set `display` before you set a size.',
        whyHi: '`span` inline hai, aur inline elements width, height aur vertical margin bina kisi warning ke anndekha karte hain. Size set karne se pehle `display` set karo.',
      },
      {
        wrong: `nav { font-size: 0; }   /* the old hack to kill inline-block gaps */
nav a { font-size: 16px; }`,
        right: `nav { display: flex; gap: 8px; }`,
        why: 'The `font-size: 0` trick works by making the whitespace character zero-width, and it breaks the moment anything inherits from the nav. Flex ignores HTML whitespace entirely, so `gap` is the real answer.',
        whyHi: '`font-size: 0` wala jugaad whitespace character ko zero-width bana kar chalta hai, aur jaise hi kuch nav se inherit karta hai wo toot jata hai. Flex HTML ka whitespace poori tarah anndekha karta hai, isliye asli jawab `gap` hai.',
      },
      {
        wrong: `.a { margin-bottom: 20px; }
.b { margin-top: 30px; }   /* expecting a 50px gap */`,
        right: `.parent { display: flex; flex-direction: column; gap: 30px; }`,
        why: 'Adjacent vertical margins in normal flow collapse into the larger of the two, so you get 30px. If you need spacing you can reason about, put the container in flex or grid and use `gap`.',
        whyHi: 'Normal flow mein bagal wale vertical margins mil kar bade wale mein badal jate hain, isliye 30px milta hai. Aisi spacing chahiye jispar bharosa ho, to container ko flex ya grid banao aur `gap` use karo.',
      },
      {
        wrong: `.hidden { visibility: hidden; }   /* used to remove an item from a list */`,
        right: `.hidden { display: none; }`,
        why: '`visibility: hidden` leaves the element\'s space occupied, so a "removed" list item leaves a visible hole. Use `display: none` when the element should not exist for layout or for a screen reader.',
        whyHi: '`visibility: hidden` element ki jagah bhari rehne deta hai, isliye "hataya" gaya list item ek dikhta khaali gap chhod deta hai. Jab element layout aur screen reader ke liye hona hi nahi chahiye, tab `display: none`.',
      },
    ],

    realWorld: [
      {
        en: '**Every "why is my CSS not applying" bug.** A width or height on an inline element is the most common answer, and it is silent — devtools shows the declaration as applied but crossed through in the computed panel.',
        hi: '**Har "meri CSS kyun nahi lag rahi" bug.** Inline element par width ya height sabse aam jawab hai, aur wo chup rehta hai — devtools declaration ko laga hua dikhata hai par computed panel mein kata hua.',
      },
      {
        en: '**Email templates.** Email clients still support flexbox poorly, so table and inline-block layout is genuinely still used there — one of the few places where knowing the old rules is not just history.',
        hi: '**Email templates.** Email clients aaj bhi flexbox theek se support nahi karte, isliye wahan table aur inline-block layout sach mein abhi bhi chalta hai — un thodi jagahon mein se ek jahan purane niyam jaanna sirf itihas nahi hai.',
      },
      {
        en: '**Design-system spacing.** Component libraries set `margin: 0` on almost everything and hand spacing to a flex or grid `gap`, precisely to avoid collapsing margins producing gaps nobody wrote.',
        hi: '**Design-system spacing.** Component libraries lagbhag har cheez par `margin: 0` lagate hain aur spacing flex ya grid ke `gap` ko de dete hain, bilkul isiliye ki collapsing margins koi aisa gap na banayein jo kisi ne likha hi nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `inline`, `block` and `inline-block`?',
        qHi: '`inline`, `block` aur `inline-block` mein kya fark hai?',
        a: '`block` fills the available width and stacks vertically, and it respects width, height, and margin on all sides. `inline` is only as wide as its content and flows in a line, but it ignores width, height and vertical margin — vertical padding is painted yet reserves no space, so backgrounds overlap the neighbouring lines. `inline-block` combines the two: it flows in a line like inline but sizes like a block. The catch with `inline-block` is that it is still text layout, so whitespace in the HTML shows up as gaps between items.',
        aHi: '`block` mili hui chaudai bharta hai aur khada lagta hai, aur chaaron taraf width, height aur margin maanta hai. `inline` sirf apne content jitna chauda hai aur line mein behta hai, par width, height aur vertical margin anndekha karta hai — vertical padding banti hai par jagah nahi rokti, isliye backgrounds bagal ki lines par chadh jate hain. `inline-block` dono milata hai: inline ki tarah line mein behta hai par block ki tarah size leta hai. `inline-block` ka pech ye hai ki wo ab bhi text layout hai, isliye HTML ka whitespace items ke beech gaps bankar dikhta hai.',
      },
      {
        q: 'What is margin collapsing?',
        qHi: 'Margin collapsing kya hai?',
        a: 'When two vertical margins meet in normal flow they merge into a single margin equal to the larger of the two, not their sum. So a 20px bottom margin next to a 30px top margin produces a 30px gap. It keeps text spacing even, but it is surprising, and it does not happen inside a flex or grid container — there margins never collapse. That is one reason modern layouts prefer `gap` over margins for spacing between siblings.',
        aHi: 'Jab normal flow mein do vertical margins milte hain to wo ek margin ban jate hain jo dono mein se bade ke barabar hota hai, unke jod ke nahi. To 20px bottom margin aur 30px top margin se 30px ka gap banta hai. Isse text ki spacing barabar rehti hai, par ye chaunkata hai, aur flex ya grid container ke andar aisa nahi hota — wahan margins kabhi collapse nahi hote. Ye ek wajah hai ki modern layouts bhai-behnon ke beech spacing ke liye margins ke bajaye `gap` pasand karte hain.',
      },
      {
        q: 'Why is there a small gap between `inline-block` elements?',
        qHi: '`inline-block` elements ke beech chhota gap kyun aata hai?',
        a: 'Because the whitespace between their tags in the HTML — a newline or a space — is a real text character, and inline-block items are laid out as text. Old fixes set `font-size: 0` on the parent or removed the newlines, both fragile. The correct answer today is `display: flex` or `display: grid` on the parent: those layout modes ignore HTML whitespace, so `gap` is the only thing controlling spacing.',
        aHi: 'Kyunki HTML mein unke tags ke beech ka whitespace — newline ya space — asli text character hai, aur inline-block items text ki tarah lagte hain. Purane fix parent par `font-size: 0` lagate the ya newlines hata dete the, dono kamzor. Aaj ka sahi jawab hai parent par `display: flex` ya `display: grid`: ye layout modes HTML ka whitespace anndekha karte hain, isliye spacing sirf `gap` chalata hai.',
      },
      {
        q: 'What is the difference between `display: none` and `visibility: hidden`?',
        qHi: '`display: none` aur `visibility: hidden` mein kya fark hai?',
        a: '`display: none` removes the element from layout completely — it occupies no space and is not exposed to assistive technology. `visibility: hidden` makes it invisible but keeps its space reserved, so the layout does not shift. Use `none` to remove something, and `hidden` when you need the space held — for example to swap two states without the page jumping.',
        aHi: '`display: none` element ko layout se poori tarah hata deta hai — wo koi jagah nahi leta aur assistive technology ko bhi nahi dikhta. `visibility: hidden` use adrishya karta hai par uski jagah roki rehti hai, isliye layout nahi hilta. Kuch hatane ke liye `none`, aur jab jagah roki rehni chahiye tab `hidden` — jaise page ko kudaye bina do states badalne ke liye.',
      },
      {
        q: 'What does `display` actually control?',
        qHi: '`display` asal mein kya chalata hai?',
        a: 'Two things at once: the element\'s **outer** display type, meaning how it behaves among its siblings — block-level and stacking, or inline and flowing — and its **inner** display type, meaning how its own children are laid out. `display: flex` sets the outer type to block and the inner type to flex, which is why a flex container stacks like a block while its children become flex items. The two-value syntax `display: inline flex` makes this explicit.',
        aHi: 'Ek saath do cheezein: element ka **outer** display type, matlab wo apne bhai-behnon ke beech kaisa vyavhaar kare — block-level aur lagta hua, ya inline aur behta hua — aur uska **inner** display type, matlab uske apne bachche kaise lagenge. `display: flex` outer type ko block aur inner ko flex karta hai, isiliye flex container block ki tarah lagta hai jabki uske bachche flex items ban jate hain. Do-value wala syntax `display: inline flex` isse saaf likh deta hai.',
      },
    ],

    exercises: [
      {
        task: 'Recreate the broken nav: three inline links with 12px vertical padding and a background, with a paragraph above and below. Confirm the overlap, then fix it with one property.',
        taskHi: 'Toota nav dobara banao: teen inline links 12px vertical padding aur background ke saath, upar aur neeche ek paragraph. Chadhna confirm karo, phir ek property se theek karo.',
        hint: 'The fix is `display: inline-block`. Try `block` first so you can see why it is the wrong fix.',
        hintHi: 'Fix `display: inline-block` hai. Pehle `block` try karo taaki dikhe wo galat fix kyun hai.',
      },
      {
        task: 'Put three inline-block boxes on separate HTML lines, note the gaps, then delete the newlines between the tags and note them vanish. Now make the parent `display: flex` and reformat the HTML however you like.',
        taskHi: 'Teen inline-block boxes alag HTML lines par rakho, gaps dekho, phir tags ke beech ke newlines hatao aur unhe gayab hote dekho. Ab parent ko `display: flex` karo aur HTML ko jaise chahe format karo.',
        hint: 'With flex the gaps do not come back no matter how you format the markup — that is the point.',
        hintHi: 'Flex ke saath gaps wapas nahi aate, markup jaise bhi format karo — baat yahi hai.',
      },
      {
        task: 'Stack a heading with `margin-bottom: 20px` above a paragraph with `margin-top: 30px`. Measure the gap in devtools, then set the parent to `display: flex; flex-direction: column` and measure again.',
        taskHi: '`margin-bottom: 20px` wale heading ke neeche `margin-top: 30px` wala paragraph rakho. Devtools mein gap naapo, phir parent ko `display: flex; flex-direction: column` karo aur dobara naapo.',
        hint: '30px in normal flow, 50px in flex. Devtools highlights margins in orange when you hover the element.',
        hintHi: 'Normal flow mein 30px, flex mein 50px. Element par hover karne par devtools margins ko narangi rang mein dikhata hai.',
      },
    ],

    keyTakeaways: [
      'Every element already has a layout behaviour before you write CSS: block stacks, inline flows.',
      'Inline elements ignore width, height and vertical margin silently — that is the top cause of "my CSS is not applying".',
      '`inline-block` gives you a row with real box sizing, but the gaps come from HTML whitespace.',
      'Adjacent vertical margins collapse in normal flow — and never inside flex or grid.',
      '`display: none` removes the element; `visibility: hidden` keeps its space.',
      'Flex and grid exist because block and inline are text rules being used for layout.',
    ],
    keyTakeawaysHi: [
      'Har element ke paas CSS likhne se pehle hi layout vyavhaar hai: block lagta hai, inline behta hai.',
      'Inline elements width, height aur vertical margin chupchap anndekha karte hain — "meri CSS nahi lag rahi" ki sabse badi wajah yahi hai.',
      '`inline-block` asli box sizing ke saath row deta hai, par gaps HTML ke whitespace se aate hain.',
      'Bagal wale vertical margins normal flow mein collapse hote hain — aur flex ya grid ke andar kabhi nahi.',
      '`display: none` element hata deta hai; `visibility: hidden` uski jagah rakhta hai.',
      'Flex aur grid isliye hain ki block aur inline layout ke liye istemaal hote text ke niyam hain.',
    ],
  },

  {
    slug: 'css-flexbox',
    title: 'Flexbox',
    titleHi: 'Flexbox',
    description: 'Centre a box vertically. It used to be a famous joke. Now it is two lines.',
    descriptionHi: 'Ek box ko beech mein khada set karo. Pehle ye mashhoor mazaak tha. Ab do lines hai.',
    difficulty: 'MEDIUM',
    duration: 40,
    order: 2,

    analogy: {
      en: '**Passengers on a bench.** You tell the bench how to arrange people rather than telling each person where to sit: bunch up at one end, spread out evenly, or all press against the back rest. And if someone new sits down, everyone shifts — you never recalculate positions yourself. Flexbox is that bench. You set rules on the container, and the items sort themselves out.',
      hi: '**Bench par baithe log.** Aap har aadmi ko jagah batane ke bajaye bench ko batate ho ki logon ko kaise lagana hai: ek kinare par sikud jao, barabar fail jao, ya sab peeth-tek se chipak jao. Aur koi naya baith gaya to sab khisak jate hain — positions aap khud kabhi dobara nahi ginte. Flexbox wahi bench hai. Aap container par niyam lagate ho, aur items khud sambhal lete hain.',
    },

    simple: `**Start broken.** You need a message centred in a box — horizontally *and* vertically:

\`\`\`css
.box { height: 200px; text-align: center; }
\`\`\`

Horizontally centred. Vertically it is glued to the top. So you try the things that look like they should work:

\`\`\`css
margin: auto;              /* nothing vertically */
padding-top: 80px;         /* works until the text wraps to two lines */
line-height: 200px;        /* works until the text wraps at all */
position: absolute; top: 50%; transform: translateY(-50%);   /* works, and is awful */
\`\`\`

This was a running joke for a decade. Here is the whole answer:

\`\`\`css
.box { display: flex; justify-content: center; align-items: center; }
\`\`\`

**Two axes, and this is the only hard part**

\`\`\`css
flex-direction: row;      /* default: main axis is horizontal */
flex-direction: column;   /* main axis is VERTICAL */
\`\`\`

- \`justify-content\` moves items along the **main** axis
- \`align-items\` moves items along the **cross** axis

With \`row\`, \`justify-content\` is horizontal. With \`column\`, \`justify-content\` becomes *vertical* and \`align-items\` becomes horizontal. **They swap.** Almost every flexbox confusion is this and nothing else. Do not memorise "justify is horizontal" — it is only true half the time.

**The container properties**

\`\`\`css
.container {
  display: flex;
  flex-direction: row;              /* row | column */
  justify-content: space-between;   /* along the main axis */
  align-items: center;              /* along the cross axis */
  gap: 12px;                        /* space between items */
  flex-wrap: wrap;                  /* allow a second line */
}
\`\`\`

**The one item property worth learning**

\`\`\`css
.item { flex: 1; }   /* take an equal share of the leftover space */
\`\`\`

That is how you build a sidebar and a main area that fills the rest:

\`\`\`css
.sidebar { flex: 0 0 240px; }   /* don't grow, don't shrink, be 240px */
.main    { flex: 1; }           /* take everything left over */
\`\`\`

**Remember:** flexbox arranges items along **one** line. If you need rows *and* columns to line up together, that is grid — the next lesson.`,

    simpleHi: `**Toote hue se shuru.** Aapko ek box ke beech mein message chahiye — leti aur khadi dono taraf se:

\`\`\`css
.box { height: 200px; text-align: center; }
\`\`\`

Leti taraf beech mein aa gaya. Khadi taraf wo upar chipka hai. To aap wo cheezein try karte ho jo lagti hain ki chalengi:

\`\`\`css
margin: auto;              /* khadi taraf kuch nahi */
padding-top: 80px;         /* text do lines mein jaate hi khatam */
line-height: 200px;        /* text wrap hote hi khatam */
position: absolute; top: 50%; transform: translateY(-50%);   /* chalta hai, aur bhayanak hai */
\`\`\`

Ye ek dashak tak chalta mazaak tha. Poora jawab ye hai:

\`\`\`css
.box { display: flex; justify-content: center; align-items: center; }
\`\`\`

**Do axes, aur mushkil sirf yahi hai**

\`\`\`css
flex-direction: row;      /* default: main axis leti hui */
flex-direction: column;   /* main axis KHADI */
\`\`\`

- \`justify-content\` items ko **main** axis par hilata hai
- \`align-items\` items ko **cross** axis par hilata hai

\`row\` ke saath \`justify-content\` leti hai. \`column\` ke saath \`justify-content\` *khadi* ho jati hai aur \`align-items\` leti. **Wo badal jate hain.** Flexbox ki lagbhag saari uljhan yahi hai aur kuch nahi. "justify horizontal hota hai" yaad na karo — wo sirf aadhe waqt sach hai.

**Container ki properties**

\`\`\`css
.container {
  display: flex;
  flex-direction: row;              /* row | column */
  justify-content: space-between;   /* main axis par */
  align-items: center;              /* cross axis par */
  gap: 12px;                        /* items ke beech jagah */
  flex-wrap: wrap;                  /* doosri line ki ijazat */
}
\`\`\`

**Item ki ek property jo seekhne layak hai**

\`\`\`css
.item { flex: 1; }   /* bachi hui jagah ka barabar hissa lo */
\`\`\`

Sidebar aur baaki jagah bharne wala main area aise bante hain:

\`\`\`css
.sidebar { flex: 0 0 240px; }   /* na badho, na sikudo, 240px raho */
.main    { flex: 1; }           /* jo bacha sab lo */
\`\`\`

**Yaad rakho:** flexbox items ko **ek** line par lagata hai. Rows *aur* columns dono ko saath mein line-up karna ho, to wo grid hai — agla lesson.`,

    content: `## Container properties

\`\`\`css
display: flex;              /* or inline-flex */
flex-direction: row | row-reverse | column | column-reverse;
justify-content: flex-start | center | flex-end | space-between | space-around | space-evenly;
align-items: stretch | flex-start | center | flex-end | baseline;
flex-wrap: nowrap | wrap;
gap: 12px;                  /* or "row-gap column-gap" */
align-content: /* like align-items, but for wrapped LINES */
\`\`\`

### The axis swap, stated once

| \`flex-direction\` | Main axis | \`justify-content\` moves things | \`align-items\` moves things |
|---|---|---|---|
| \`row\` | horizontal | left ↔ right | up ↕ down |
| \`column\` | vertical | up ↕ down | left ↔ right |

If a flexbox rule "does nothing", check \`flex-direction\` first. Nine times out of ten you are using the property for the other axis.

### \`justify-content\` visualised

\`\`\`
flex-start     [AAA][BB][C]..............
center         .......[AAA][BB][C].......
flex-end       ..............[AAA][BB][C]
space-between  [AAA]......[BB]......[C]
space-around   ..[AAA]....[BB]....[C]..
space-evenly   ...[AAA]...[BB]...[C]...
\`\`\`

\`space-between\` pins the first and last items to the edges — that is the entire recipe for a header with a logo on the left and a menu on the right.

## Item properties

\`\`\`css
flex-grow: 0;      /* share of EXTRA space to absorb */
flex-shrink: 1;    /* share of OVERFLOW to give up */
flex-basis: auto;  /* starting size before growing or shrinking */

flex: 1;           /* shorthand for  1 1 0%    — "share the space equally" */
flex: 0 0 240px;   /* fixed 240px, never grows, never shrinks */
flex: auto;        /* 1 1 auto — grows, but starts from its content size */

align-self: center;   /* override align-items for ONE item */
order: -1;            /* move an item visually without touching the HTML */
\`\`\`

### \`flex: 1\` versus \`flex: auto\`

Both grow. The difference is where they start:

- \`flex: 1\` is \`1 1 0%\` — ignore content size, so all items end up **equal width**.
- \`flex: auto\` is \`1 1 auto\` — start from content size, so an item with more text stays **wider**.

For equal columns you want \`flex: 1\`. Reaching for \`flex: auto\` and wondering why the columns are uneven is a common hour lost.

## The two traps

### 1. Flex items refuse to shrink below their content

\`\`\`css
.item { flex: 1; min-width: 0; }   /* the fix */
\`\`\`

A flex item's default \`min-width\` is \`auto\`, meaning "never smaller than my content". One long unbroken string — a URL, a filename — will therefore push the whole row wider than its container. \`min-width: 0\` gives permission to shrink, and it is what \`text-overflow: ellipsis\` needs in order to work inside a flex row.

### 2. \`align-items: stretch\` is the default

Items become as tall as the tallest one automatically. That equal-height-cards behaviour people used to write JavaScript for is simply the default. If you *don't* want it, set \`align-items: flex-start\`.

## Wrapping

\`\`\`css
.tags { display: flex; flex-wrap: wrap; gap: 8px; }
\`\`\`

Without \`flex-wrap: wrap\` items shrink forever and never move to a second line — a row of tags will squeeze into slivers instead of wrapping. With wrapping on, \`align-content\` controls the spacing *between* the resulting lines, while \`align-items\` still controls alignment *within* each line. Those two get mixed up constantly.

### Wrapping is not responsive layout

\`\`\`css
.card { flex: 1 1 250px; }   /* grow, shrink, but wrap below 250px */
\`\`\`

This is the closest flexbox gets to a responsive grid, and it works well. But the last row will not line up with the rows above it, because each line is sized independently. When alignment across rows matters, use grid.`,

    contentHi: `## Container ki properties

\`\`\`css
display: flex;              /* ya inline-flex */
flex-direction: row | row-reverse | column | column-reverse;
justify-content: flex-start | center | flex-end | space-between | space-around | space-evenly;
align-items: stretch | flex-start | center | flex-end | baseline;
flex-wrap: nowrap | wrap;
gap: 12px;                  /* ya "row-gap column-gap" */
align-content: /* align-items jaisa, par wrap hui LINES ke liye */
\`\`\`

### Axis ka badalna, ek baar likha hua

| \`flex-direction\` | Main axis | \`justify-content\` kya hilata hai | \`align-items\` kya hilata hai |
|---|---|---|---|
| \`row\` | leti | baayein ↔ dayein | upar ↕ neeche |
| \`column\` | khadi | upar ↕ neeche | baayein ↔ dayein |

Koi flexbox rule "kuch nahi kar raha" to pehle \`flex-direction\` dekho. Das mein nau baar aap doosri axis wali property use kar rahe ho.

### \`justify-content\` dekh kar

\`\`\`
flex-start     [AAA][BB][C]..............
center         .......[AAA][BB][C].......
flex-end       ..............[AAA][BB][C]
space-between  [AAA]......[BB]......[C]
space-around   ..[AAA]....[BB]....[C]..
space-evenly   ...[AAA]...[BB]...[C]...
\`\`\`

\`space-between\` pehle aur aakhri item ko kinaron par chipka deta hai — baayein logo aur dayein menu wale header ki poori recipe yahi hai.

## Item ki properties

\`\`\`css
flex-grow: 0;      /* EXTRA jagah ka kitna hissa lena hai */
flex-shrink: 1;    /* OVERFLOW ka kitna hissa chhodna hai */
flex-basis: auto;  /* badhne ya sikudne se pehle ka size */

flex: 1;           /* shorthand:  1 1 0%    — "jagah barabar baanto" */
flex: 0 0 240px;   /* pakka 240px, na badhta, na sikudta */
flex: auto;        /* 1 1 auto — badhta hai, par apne content ke size se shuru */

align-self: center;   /* EK item ke liye align-items badlo */
order: -1;            /* HTML chhue bina item ko dikhne mein hilao */
\`\`\`

### \`flex: 1\` aur \`flex: auto\`

Dono badhte hain. Fark ye hai ki wo kahan se shuru karte hain:

- \`flex: 1\` matlab \`1 1 0%\` — content ka size anndekha karo, isliye saare items **barabar chaude** ho jate hain.
- \`flex: auto\` matlab \`1 1 auto\` — content ke size se shuru karo, isliye zyada text wala item **zyada chauda** rehta hai.

Barabar columns ke liye \`flex: 1\` chahiye. \`flex: auto\` utha kar sochte rehna ki columns barabar kyun nahi hain — ek ghanta aise hi jata hai.

## Do jaal

### 1. Flex items apne content se chhote hone se mana kar dete hain

\`\`\`css
.item { flex: 1; min-width: 0; }   /* fix */
\`\`\`

Flex item ki default \`min-width\` \`auto\` hoti hai, matlab "apne content se chhota kabhi nahi". Isliye ek lambi bina toote string — URL, filename — poore row ko container se chauda kar degi. \`min-width: 0\` sikudne ki ijazat deta hai, aur flex row ke andar \`text-overflow: ellipsis\` ko chalne ke liye yahi chahiye.

### 2. \`align-items: stretch\` default hai

Items apne aap sabse lambe wale jitne lambe ho jate hain. Wo barabar-oonchai wale cards ka vyavhaar jiske liye log JavaScript likhte the, wo sirf default hai. Aapko wo *nahi* chahiye to \`align-items: flex-start\` lagao.

## Wrapping

\`\`\`css
.tags { display: flex; flex-wrap: wrap; gap: 8px; }
\`\`\`

Bina \`flex-wrap: wrap\` ke items hamesha sikudte hain aur doosri line par kabhi nahi jate — tags ka row wrap hone ke bajaye patli pattiyon mein dab jayega. Wrapping on hone par \`align-content\` banne wali lines ke *beech* ki spacing chalata hai, jabki \`align-items\` ab bhi har line ke *andar* ki alignment. Ye dono lagatar milaye jate hain.

### Wrapping responsive layout nahi hai

\`\`\`css
.card { flex: 1 1 250px; }   /* badho, sikudo, par 250px se neeche wrap */
\`\`\`

Responsive grid ke sabse kareeb flexbox yahi pahunchta hai, aur ye achha chalta hai. Par aakhri row upar ki rows se line-up nahi hoga, kyunki har line apna size alag leti hai. Jab rows ke aar-paar alignment matter kare, tab grid.`,

    examples: [
      {
        title: 'The famous broken centring',
        titleHi: 'Mashhoor toota centring',
        code: `.box { height: 140px; text-align: center; }
/* horizontal: done. vertical: glued to the top. */`,
        preview: page(`<div class="b">I should be in the middle</div>`,
`.b { height:140px; text-align:center; border:2px dashed #ef4444; background:#fef2f2; }`),
        previewHeight: 180,
        explain: '`text-align: center` only ever handles the horizontal axis. There is no `text-align-vertical`, which is why this problem was a joke for a decade — the tools for it did not exist.',
        explainHi: '`text-align: center` sirf leti axis sambhalta hai. `text-align-vertical` naam ki koi cheez nahi hai, isiliye ye samasya ek dashak tak mazaak thi — iske auzaar hi nahi the.',
      },
      {
        title: 'Two lines, both axes',
        titleHi: 'Do lines, dono axes',
        code: `.box {
  display: flex;
  justify-content: center;   /* main axis: horizontal */
  align-items: center;       /* cross axis: vertical */
}`,
        preview: page(`<div class="b">Centred, both directions</div>`,
`.b { height:140px; display:flex; justify-content:center; align-items:center; border:2px dashed #10b981; background:#f0fdf4; }`),
        previewHeight: 180,
        explain: 'Three declarations replace every hack in the previous example, and unlike `line-height: 140px` this keeps working when the text wraps to two lines or the box changes size.',
        explainHi: 'Teen declarations pichle example ke saare jugaad badal dete hain, aur `line-height: 140px` ke ulat ye tab bhi chalta hai jab text do lines mein jaye ya box ka size badle.',
      },
      {
        title: 'The axis swap, side by side',
        titleHi: 'Axis ka badalna, saath mein',
        code: `.a { flex-direction: row;    justify-content: center; }
.b { flex-direction: column; justify-content: center; }`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 4px">row + justify-content: center &rarr; horizontal</p>
<div class="wrap r"><span class="box">1</span><span class="box">2</span></div>
<p style="font-size:13px;color:#666;margin:10px 0 4px">column + justify-content: center &rarr; the SAME property is now vertical</p>
<div class="wrap c"><span class="box">1</span><span class="box">2</span></div>`,
`${boxes}
.r { display:flex; flex-direction:row; justify-content:center; gap:6px; height:60px; }
.c { display:flex; flex-direction:column; justify-content:center; gap:6px; height:120px; }`),
        previewHeight: 320,
        explain: 'The same property produced perpendicular results. This is the single thing to internalise about flexbox: `justify-content` follows the main axis, and `flex-direction` decides which axis that is.',
        explainHi: 'Wahi property, lambvat nateeje. Flexbox ke baare mein sirf ye ek cheez pakki karni hai: `justify-content` main axis ke saath chalta hai, aur wo axis kaunsi hai ye `flex-direction` tay karta hai.',
      },
      {
        title: 'space-between builds a header',
        titleHi: 'space-between se header banta hai',
        code: `header { display: flex; justify-content: space-between; align-items: center; }`,
        preview: page(`<header class="h">
  <strong>Logo</strong>
  <nav class="n"><a href="#">Docs</a><a href="#">Pricing</a><a href="#">Sign in</a></nav>
</header>`,
`.h { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#1e293b; color:#fff; border-radius:6px; }
.n { display:flex; gap:14px; }
.n a { color:#cbd5e1; text-decoration:none; font-size:14px; }`),
        previewHeight: 130,
        explain: 'One declaration pins the logo left and the nav right, with no widths, floats or margins. `align-items: center` then lines them up vertically regardless of their different heights.',
        explainHi: 'Ek declaration logo ko baayein aur nav ko dayein chipka deta hai, bina widths, floats ya margins ke. Phir `align-items: center` unhe alag-alag oonchai ke bawajood khadi taraf se line-up kar deta hai.',
      },
      {
        title: 'flex: 1 versus flex: auto',
        titleHi: 'flex: 1 aur flex: auto',
        code: `.a > * { flex: 1; }      /* 1 1 0%   — equal widths */
.b > * { flex: auto; }   /* 1 1 auto — content-proportional */`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 4px">flex: 1 &mdash; exactly equal</p>
<div class="wrap a"><span class="box">Hi</span><span class="box">Medium text</span><span class="box">Quite a lot more text here</span></div>
<p style="font-size:13px;color:#666;margin:10px 0 4px">flex: auto &mdash; wider where there is more text</p>
<div class="wrap b"><span class="box">Hi</span><span class="box">Medium text</span><span class="box">Quite a lot more text here</span></div>`,
`${boxes}
.a, .b { display:flex; gap:6px; }
.a > * { flex:1; } .b > * { flex:auto; }
.box { font-size:13px; }`),
        previewHeight: 300,
        explain: 'The difference is `flex-basis`: `0%` throws away the content size so everything is equal, `auto` starts from it so text length leaks into the widths. Wanting equal columns and getting uneven ones is almost always this.',
        explainHi: 'Fark `flex-basis` ka hai: `0%` content ka size phenk deta hai isliye sab barabar, `auto` usse shuru karta hai isliye text ki lambai widths mein aa jati hai. Barabar columns chahiye aur bebarabar mil rahe hain — lagbhag hamesha yahi hai.',
      },
      {
        title: 'Sidebar plus fluid main area',
        titleHi: 'Sidebar plus behta main area',
        code: `.sidebar { flex: 0 0 200px; }   /* fixed */
.main    { flex: 1; }           /* takes the rest */`,
        preview: page(`<div class="l">
  <aside class="s">Sidebar<br><small>0 0 200px</small></aside>
  <main class="m">Main content<br><small>flex: 1 &mdash; absorbs whatever is left</small></main>
</div>`,
`.l { display:flex; gap:8px; height:130px; }
.s { flex:0 0 200px; background:#e2e8f0; padding:10px; font-size:14px; }
.m { flex:1; background:#dbeafe; padding:10px; font-size:14px; }`),
        previewHeight: 170,
        explain: 'The classic app shell in two declarations. `0 0 200px` means do not grow, do not shrink, be exactly 200px; `flex: 1` absorbs everything remaining at any window size.',
        explainHi: 'Do declarations mein classic app shell. `0 0 200px` matlab na badho, na sikudo, bilkul 200px raho; `flex: 1` kisi bhi window size par bachi hui poori jagah le leta hai.',
      },
      {
        title: 'The min-width: 0 trap',
        titleHi: 'min-width: 0 ka jaal',
        code: `.item { flex: 1; }                  /* a long URL blows out the row */
.item { flex: 1; min-width: 0; }   /* now it can shrink and truncate */`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 4px">Without min-width: 0 &mdash; the long string forces an overflow</p>
<div class="wrap f"><span class="i bad">https://example.com/a/very/long/path/that/will/not/break</span><span class="i">Other</span></div>
<p style="font-size:13px;color:#666;margin:10px 0 4px">With min-width: 0 &mdash; it truncates instead</p>
<div class="wrap f"><span class="i good">https://example.com/a/very/long/path/that/will/not/break</span><span class="i">Other</span></div>`,
`${boxes}
.f { display:flex; gap:6px; overflow:hidden; }
.i { flex:1; background:#dbeafe; border:1px solid #60a5fa; padding:6px; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.bad { min-width:auto; }
.good { min-width:0; }`),
        previewHeight: 260,
        explain: 'A flex item\'s default `min-width: auto` means "never narrower than my content", so `text-overflow: ellipsis` silently does nothing. `min-width: 0` is the permission it needs, and it is the answer to most flex overflow bugs.',
        explainHi: 'Flex item ki default `min-width: auto` ka matlab "apne content se patla kabhi nahi", isliye `text-overflow: ellipsis` chupchap kuch nahi karta. `min-width: 0` wahi ijazat hai, aur zyadatar flex overflow bugs ka jawab yahi hai.',
      },
      {
        title: 'Equal-height cards are the default',
        titleHi: 'Barabar-oonchai wale cards default hain',
        code: `.row { display: flex; }                        /* align-items: stretch */
.row { display: flex; align-items: flex-start; }`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 4px">Default (stretch) &mdash; all cards match the tallest</p>
<div class="r"><div class="c">Short</div><div class="c">Rather more text in this card, so it is the tallest one</div><div class="c">Short</div></div>
<p style="font-size:13px;color:#666;margin:10px 0 4px">align-items: flex-start &mdash; each card is its own height</p>
<div class="r top"><div class="c">Short</div><div class="c">Rather more text in this card, so it is the tallest one</div><div class="c">Short</div></div>`,
`.r { display:flex; gap:6px; }
.top { align-items:flex-start; }
.c { flex:1; background:#dbeafe; border:1px solid #60a5fa; padding:8px; font-size:13px; }`),
        previewHeight: 300,
        explain: 'Matching card heights needed JavaScript before flexbox. Now it is what you get for free, and `flex-start` is how you opt out.',
        explainHi: 'Flexbox se pehle cards ki oonchai barabar karne ke liye JavaScript chahiye tha. Ab wo muft mein milta hai, aur `flex-start` usse bahar aane ka tarika hai.',
      },
      {
        title: 'Wrapping tags',
        titleHi: 'Wrap hote tags',
        code: `.tags { display: flex; gap: 8px; }              /* squeezed into slivers */
.tags { display: flex; gap: 8px; flex-wrap: wrap; }`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 4px">nowrap (default) &mdash; they shrink instead of wrapping</p>
<div class="t"><span>javascript</span><span>typescript</span><span>react</span><span>node</span><span>postgres</span><span>docker</span><span>prisma</span></div>
<p style="font-size:13px;color:#666;margin:10px 0 4px">flex-wrap: wrap</p>
<div class="t wr"><span>javascript</span><span>typescript</span><span>react</span><span>node</span><span>postgres</span><span>docker</span><span>prisma</span></div>`,
`.t { display:flex; gap:6px; border:2px dashed #94a3b8; padding:6px; }
.wr { flex-wrap:wrap; }
.t span { background:#dbeafe; border:1px solid #60a5fa; padding:4px 8px; font-size:12px; border-radius:99px; white-space:nowrap; }`),
        previewHeight: 280,
        explain: 'Without wrapping, flex shrinks items indefinitely rather than moving them down — the tags become unreadable slivers. One property fixes it, and `gap` spaces both directions.',
        explainHi: 'Bina wrapping ke flex items ko neeche bhejne ke bajaye lagatar sikudta hai — tags padhne layak nahi rehte. Ek property isse theek karti hai, aur `gap` dono taraf spacing deta hai.',
      },
      {
        title: 'align-self and order',
        titleHi: 'align-self aur order',
        code: `.special { align-self: flex-end; }   /* one item breaks rank */
.first   { order: -1; }              /* moves visually, HTML unchanged */`,
        preview: page(`<div class="wrap f">
  <span class="box">1</span>
  <span class="box down">2 — align-self: flex-end</span>
  <span class="box">3</span>
  <span class="box lead">4 — order: -1</span>
</div>`,
`${boxes}
.f { display:flex; gap:6px; align-items:flex-start; height:90px; }
.box { font-size:12px; }
.down { align-self:flex-end; background:#fde68a; border-color:#f59e0b; }
.lead { order:-1; background:#bbf7d0; border-color:#10b981; }`),
        previewHeight: 150,
        explain: 'Item 4 is last in the HTML but renders first. Useful — but note that keyboard focus still follows the HTML order, so a visual reorder can make tabbing jump around confusingly. Reorder in the markup when the sequence matters.',
        explainHi: 'Item 4 HTML mein aakhri hai par pehle dikhta hai. Kaam ka — par dhyan do ki keyboard focus ab bhi HTML ke kram se chalta hai, isliye dikhne wala reorder tabbing ko uljhane wale tarike se kudata sakta hai. Kram matter kare to markup mein hi reorder karo.',
      },
    ],

    mistakes: [
      {
        wrong: `.col { display: flex; flex-direction: column; align-items: center; }
/* wanted vertical centring, got horizontal */`,
        right: `.col { display: flex; flex-direction: column; justify-content: center; }`,
        previewWrong: page(`<div class="c"><span class="box">A</span><span class="box">B</span></div>`,
          `${boxes}.c{display:flex;flex-direction:column;align-items:center;gap:4px;height:110px;border:2px dashed #ef4444}`),
        previewRight: page(`<div class="c"><span class="box">A</span><span class="box">B</span></div>`,
          `${boxes}.c{display:flex;flex-direction:column;justify-content:center;gap:4px;height:110px;border:2px dashed #10b981}`),
        previewHeight: 160,
        why: 'With `flex-direction: column` the main axis is vertical, so vertical centring is `justify-content`. The two properties swap axes with the direction — this is the most common flexbox mistake there is.',
        whyHi: '`flex-direction: column` mein main axis khadi hai, isliye khadi taraf beech mein karna `justify-content` hai. Direction ke saath dono properties ki axes badal jati hain — flexbox ki sabse aam galti yahi hai.',
      },
      {
        wrong: `.cols > * { flex: auto; }   /* expecting equal columns */`,
        right: `.cols > * { flex: 1; }`,
        previewWrong: page(`<div class="f"><span class="box">Hi</span><span class="box">A much longer label</span></div>`,
          `${boxes}.f{display:flex;gap:6px}.box{flex:auto;font-size:12px}`),
        previewRight: page(`<div class="f"><span class="box">Hi</span><span class="box">A much longer label</span></div>`,
          `${boxes}.f{display:flex;gap:6px}.box{flex:1;font-size:12px}`),
        previewHeight: 120,
        why: '`flex: auto` is `1 1 auto`, so each item starts at its content width and text length leaks into the result. `flex: 1` is `1 1 0%`, which discards content size and gives genuinely equal columns.',
        whyHi: '`flex: auto` matlab `1 1 auto`, isliye har item apne content ki chaudai se shuru hota hai aur text ki lambai nateeje mein aa jati hai. `flex: 1` matlab `1 1 0%`, jo content ka size phenk deta hai aur sach mein barabar columns deta hai.',
      },
      {
        wrong: `.item { flex: 1; text-overflow: ellipsis; overflow: hidden; }
/* the ellipsis never appears */`,
        right: `.item { flex: 1; min-width: 0; text-overflow: ellipsis; overflow: hidden; }`,
        why: 'A flex item\'s default `min-width: auto` refuses to go narrower than its content, so there is never any overflow to truncate. `min-width: 0` is what lets it shrink.',
        whyHi: 'Flex item ki default `min-width: auto` apne content se patla hone se mana kar deti hai, isliye kaatne ke liye overflow hi nahi banta. `min-width: 0` usse sikudne deta hai.',
      },
      {
        wrong: `.grid { display: flex; flex-wrap: wrap; }
/* used for a card grid — rows never line up */`,
        right: `.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }`,
        why: 'Flex sizes each wrapped line independently, so the last row does not align with the ones above it. When items must line up in both directions, that is what grid is for.',
        whyHi: 'Flex har wrap hui line ka size alag leta hai, isliye aakhri row upar walon se line-up nahi hoti. Jab items ko dono taraf line-up karna ho, wahi grid ka kaam hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every navigation bar and toolbar.** `display: flex; justify-content: space-between; align-items: center` is the most-typed layout rule in modern CSS, and it describes almost every header on the web.',
        hi: '**Har navigation bar aur toolbar.** `display: flex; justify-content: space-between; align-items: center` modern CSS ka sabse zyada type kiya jane wala layout rule hai, aur web ke lagbhag har header ko yahi bayan karta hai.',
      },
      {
        en: '**App shells.** A fixed sidebar with `flex: 0 0 240px` beside a `flex: 1` main area is the standard dashboard skeleton — VS Code, Slack, Notion and Gmail all resolve to that shape.',
        hi: '**App shells.** `flex: 0 0 240px` wala pakka sidebar aur uske bagal `flex: 1` wala main area standard dashboard dhancha hai — VS Code, Slack, Notion aur Gmail sab isi shakal par aate hain.',
      },
      {
        en: '**Truncating filenames and URLs.** File explorers, chat sidebars and commit lists all need `min-width: 0` on a flex item so long names can ellipsis instead of stretching the panel.',
        hi: '**Filenames aur URLs kaatna.** File explorers, chat sidebars aur commit lists sabko flex item par `min-width: 0` chahiye taaki lambe naam panel ko khichne ke bajaye ellipsis ban sakein.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the main axis and the cross axis.',
        qHi: 'Main axis aur cross axis samjhao.',
        a: 'The main axis is the direction `flex-direction` points: horizontal for `row`, vertical for `column`. The cross axis is perpendicular to it. `justify-content` aligns along the main axis and `align-items` along the cross axis, which means the two properties swap meaning when you change direction — with `column`, vertical centring is `justify-content`, not `align-items`. Checking `flex-direction` first is the fastest way to debug a flex rule that "does nothing".',
        aHi: 'Main axis wahi disha hai jahan `flex-direction` ishara karta hai: `row` ke liye leti, `column` ke liye khadi. Cross axis uske lambvat hai. `justify-content` main axis par align karta hai aur `align-items` cross axis par, matlab direction badalne par dono properties ka matlab badal jata hai — `column` ke saath khadi taraf beech mein karna `justify-content` hai, `align-items` nahi. "Kuch nahi kar raha" wale flex rule ko debug karne ka sabse tez tarika pehle `flex-direction` dekhna hai.',
      },
      {
        q: 'What does the `flex` shorthand expand to, and what is the difference between `flex: 1` and `flex: auto`?',
        qHi: '`flex` shorthand kya khulta hai, aur `flex: 1` aur `flex: auto` mein kya fark hai?',
        a: '`flex` is `flex-grow flex-shrink flex-basis`. `flex: 1` expands to `1 1 0%`, so the basis is zero and every item ends up the same width regardless of content. `flex: auto` expands to `1 1 auto`, so each item starts at its content size and then grows, leaving items with more text wider. For equal columns you want `flex: 1`; `flex: auto` is right when content length should influence the width.',
        aHi: '`flex` matlab `flex-grow flex-shrink flex-basis`. `flex: 1` khulta hai `1 1 0%`, isliye basis zero hai aur content chahe kaisa ho har item barabar chaudai ka ho jata hai. `flex: auto` khulta hai `1 1 auto`, isliye har item apne content ke size se shuru hokar badhta hai, aur zyada text wale items zyada chaude reh jate hain. Barabar columns ke liye `flex: 1`; `flex: auto` tab sahi hai jab content ki lambai chaudai ko prabhavit kare.',
      },
      {
        q: 'Why does `text-overflow: ellipsis` often fail inside a flex container?',
        qHi: 'Flex container ke andar `text-overflow: ellipsis` aksar kaam kyun nahi karta?',
        a: 'Because a flex item\'s default `min-width` is `auto`, which means it will not shrink below its content\'s intrinsic width. Truncation needs the box to be narrower than its text, and that never happens, so there is nothing to truncate. Setting `min-width: 0` on the flex item lets it shrink and the ellipsis appears. The same trick fixes most flex overflow bugs, including a long URL forcing a horizontal scrollbar.',
        aHi: 'Kyunki flex item ki default `min-width` `auto` hoti hai, matlab wo apne content ki asli chaudai se chhota nahi hoga. Kaatne ke liye box ko apne text se patla hona chahiye, aur wo kabhi hota hi nahi, isliye kaatne ko kuch nahi bachta. Flex item par `min-width: 0` lagane se wo sikud jata hai aur ellipsis dikh jata hai. Yahi jugaad zyadatar flex overflow bugs theek karta hai, jaise lamba URL horizontal scrollbar la dena.',
      },
      {
        q: 'When would you choose grid over flexbox?',
        qHi: 'Grid ko flexbox se pehle kab chunoge?',
        a: 'When you need alignment in two dimensions at once. Flexbox lays items out along one axis and sizes each wrapped line independently, so a wrapped card list will not have its last row aligned with the rows above. Grid defines rows and columns up front, so everything lines up in both directions. Roughly: flex for a row or column of components — a toolbar, a button group — and grid for a page or card layout where the structure is two-dimensional.',
        aHi: 'Jab ek saath do dishaon mein alignment chahiye. Flexbox items ko ek axis par lagata hai aur har wrap hui line ka size alag leta hai, isliye wrap hui card list ki aakhri row upar walon se line-up nahi hogi. Grid rows aur columns pehle hi tay karta hai, isliye sab kuch dono taraf line-up hota hai. Motay taur par: components ke ek row ya column ke liye flex — toolbar, button group — aur page ya card layout ke liye grid jahan dhancha do-dishaon wala hai.',
      },
      {
        q: 'Why do flex items end up the same height by default?',
        qHi: 'Flex items default roop se barabar oonchai ke kyun ho jate hain?',
        a: 'Because `align-items` defaults to `stretch`, so every item stretches along the cross axis to match the tallest one. This is why equal-height cards, which used to require JavaScript measuring, are now free. If you do not want it, set `align-items: flex-start` on the container or `align-self: flex-start` on the one item.',
        aHi: 'Kyunki `align-items` ka default `stretch` hai, isliye har item cross axis par khinch kar sabse lambe wale ke barabar ho jata hai. Isiliye barabar-oonchai wale cards, jinke liye pehle JavaScript se naapna padta tha, ab muft mein milte hain. Aapko wo nahi chahiye to container par `align-items: flex-start` ya us ek item par `align-self: flex-start` lagao.',
      },
    ],

    exercises: [
      {
        task: 'Build a header with a logo on the left, nav links in the middle and a button on the right, using one flex container and no widths.',
        taskHi: 'Ek header banao: baayein logo, beech mein nav links, dayein button — ek flex container se, bina koi width ke.',
        hint: '`justify-content: space-between` on the header, plus a nested flex container for the links.',
        hintHi: 'Header par `justify-content: space-between`, aur links ke liye ek nested flex container.',
      },
      {
        task: 'Make a row of items with a long unbroken URL in one of them. Confirm it overflows, then fix it with `min-width: 0` and `text-overflow: ellipsis`.',
        taskHi: 'Items ka ek row banao jisme ek mein lamba bina toota URL ho. Overflow confirm karo, phir `min-width: 0` aur `text-overflow: ellipsis` se theek karo.',
        hint: 'You need all three: `overflow: hidden`, `text-overflow: ellipsis`, and `min-width: 0`. Remove any one and it stops working.',
        hintHi: 'Teenon chahiye: `overflow: hidden`, `text-overflow: ellipsis`, aur `min-width: 0`. Koi ek hatao to band ho jata hai.',
      },
      {
        task: 'Take a working `row` layout with `justify-content: center` and change it to `column`. Predict what will break before you look, then fix it.',
        taskHi: '`justify-content: center` wale chalte `row` layout ko `column` karo. Dekhne se pehle andaza lagao kya bigdega, phir theek karo.',
        hint: 'Centring moves to the other axis. What was `justify-content` is now `align-items`, and vice versa.',
        hintHi: 'Centring doosri axis par chala jata hai. Jo `justify-content` tha wo ab `align-items` hai, aur ulta bhi.',
      },
    ],

    keyTakeaways: [
      '`display: flex` plus `justify-content: center` and `align-items: center` centres anything on both axes.',
      '`flex-direction` decides which axis is "main" — and `justify-content` and `align-items` swap with it.',
      '`flex: 1` is `1 1 0%` for equal columns; `flex: auto` is `1 1 auto` and lets content size leak in.',
      '`flex: 0 0 240px` beside `flex: 1` is the standard sidebar-plus-main app shell.',
      '`min-width: 0` is required before a flex item will shrink or truncate its text.',
      'Equal-height items are the default, because `align-items` starts at `stretch`.',
      'Flexbox works along one line; when rows and columns must align together, use grid.',
    ],
    keyTakeawaysHi: [
      '`display: flex` ke saath `justify-content: center` aur `align-items: center` kisi bhi cheez ko dono axes par beech mein le aata hai.',
      '`flex-direction` tay karta hai kaunsi axis "main" hai — aur `justify-content` aur `align-items` uske saath badal jate hain.',
      'Barabar columns ke liye `flex: 1` matlab `1 1 0%`; `flex: auto` matlab `1 1 auto` aur usme content ka size ghus jata hai.',
      '`flex: 0 0 240px` ke bagal `flex: 1` standard sidebar-plus-main app shell hai.',
      'Flex item sikudne ya apna text kaatne se pehle `min-width: 0` maangta hai.',
      'Barabar oonchai default hai, kyunki `align-items` `stretch` se shuru hota hai.',
      'Flexbox ek line par chalta hai; jab rows aur columns saath line-up karne hon, tab grid.',
    ],
  },
];
