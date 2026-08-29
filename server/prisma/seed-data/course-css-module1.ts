/**
 * CSS & HTML Complete Course — Module 1: HTML, the skeleton.
 *
 * Every lesson opens with something visibly broken and fixes it, because CSS
 * and HTML are learned by seeing, not by reading a property list. The `preview`
 * fields render as real pages in a sandboxed iframe.
 *
 * Writing rules (same as the JavaScript course):
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its result — here that means a rendered preview.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals. One stray backtick closes the literal early and
 * TypeScript then reports errors far from the real cause.
 */

import type { CourseLesson } from './course-js-module1';

/** Shared page chrome so every preview looks like a normal document. */
const page = (body: string, css = '') => `<!doctype html><html><head><meta charset="utf-8">
<style>
  body { font: 15px/1.5 system-ui, sans-serif; margin: 12px; color: #111; }
  ${css}
</style></head><body>${body}</body></html>`;

export const CSS_MODULE_1: CourseLesson[] = [
  /* ══════════════════════ What HTML Actually Is ══════════════════════ */
  {
    slug: 'html-what-it-is',
    title: 'What HTML Actually Is',
    titleHi: 'HTML Asal Mein Hai Kya',
    description: 'Labelled boxes inside labelled boxes — and what happens when you forget to close one.',
    descriptionHi: 'Label wale dabbon ke andar label wale dabbe — aur ek band karna bhool jao to kya hota hai.',
    difficulty: 'EASY',
    duration: 28,
    order: 1,

    analogy: {
      en: '**Labelled boxes inside boxes.** Packing for a move, you put shirts in a box marked "clothes", and that box goes inside a bigger one marked "bedroom". HTML is exactly this: every piece of content sits in a labelled box, and boxes sit inside other boxes. The label tells the browser what the thing *is*.',
      hi: '**Dabbon ke andar label wale dabbe.** Ghar shift karte waqt aap shirts ko "kapde" wale dabbe mein rakhte ho, aur wo dabba "bedroom" wale bade dabbe mein jata hai. HTML bilkul yahi hai: har content ek label wale dabbe mein hota hai, aur dabbe doosre dabbon ke andar. Label browser ko batata hai ki cheez *hai kya*.',
    },

    simple: `**HTML labels your content. That is all it does.**

\`\`\`html
<h1>My Shop</h1>
<p>We sell good things.</p>
\`\`\`

- \`<h1>\` says "this is the main heading"
- \`<p>\` says "this is a paragraph"

The browser sees those labels and decides how to show them. You are not describing *how it looks* — that is CSS's job. You are saying *what it is*.

**A tag comes in a pair**

\`\`\`html
<p>Hello</p>
 │      │
 │      └── closing tag — note the slash
 └───────── opening tag
\`\`\`

Opening tag, content, closing tag. Together that is an **element**.

**Now watch what a missing slash does**

\`\`\`html
<p>First paragraph
<p>Second paragraph
\`\`\`

The browser guesses and usually recovers. But do the same with a \`<div>\`:

\`\`\`html
<div class="card">
  <h2>Title</h2>
<div class="card">
  <h2>Another</h2>
</div>
\`\`\`

The second card is now **inside** the first, because the first was never closed. Your two side-by-side cards become one card containing another, and the layout collapses. No error message — it just looks wrong.

**Boxes inside boxes**

\`\`\`html
<article>
  <h2>Post title</h2>
  <p>Some <strong>important</strong> text.</p>
</article>
\`\`\`

\`strong\` is inside \`p\`, which is inside \`article\`. That nesting is a **tree**, and CSS and JavaScript both navigate it. Get the nesting wrong and everything downstream goes wrong with it.

**Some tags have no closing tag**

\`\`\`html
<img src="cat.jpg" alt="A cat">
<br>
<input type="text">
\`\`\`

These are **void elements** — they contain nothing, so there is nothing to close.

**Attributes add detail**

\`\`\`html
<img src="cat.jpg" alt="A sleeping cat">
     └─ name ─┘   └────── value ──────┘
\`\`\`

**Remember:** open it, fill it, close it. Indent so you can see the nesting. Every unclosed tag becomes a layout bug.`,

    simpleHi: `**HTML aapke content par label lagata hai. Bas itna hi karta hai.**

\`\`\`html
<h1>Meri Dukaan</h1>
<p>Hum achhi cheezein bechte hain.</p>
\`\`\`

- \`<h1>\` kehta hai "ye mukhya heading hai"
- \`<p>\` kehta hai "ye paragraph hai"

Browser ye label dekhkar tay karta hai ki kaise dikhana hai. Aap ye nahi bata rahe ki *kaisa dikhe* — wo CSS ka kaam hai. Aap bata rahe ho ki *hai kya*.

**Tag jodi mein aata hai**

\`\`\`html
<p>Hello</p>
 │      │
 │      └── closing tag — slash dhyan se dekho
 └───────── opening tag
\`\`\`

Opening tag, content, closing tag. Ye teeno milkar ek **element** hai.

**Ab dekho slash chhootne se kya hota hai**

\`\`\`html
<p>Pehla paragraph
<p>Doosra paragraph
\`\`\`

Browser andaza lagakar aksar sambhal leta hai. Par wahi \`<div>\` ke saath karo:

\`\`\`html
<div class="card">
  <h2>Title</h2>
<div class="card">
  <h2>Another</h2>
</div>
\`\`\`

Ab doosra card pehle ke **andar** hai, kyunki pehla band hua hi nahi. Aapke do bagal-bagal wale cards ek card ban gaye jiske andar doosra hai, aur layout baith gaya. Koi error message nahi — bas galat dikhta hai.

**Dabbon ke andar dabbe**

\`\`\`html
<article>
  <h2>Post title</h2>
  <p>Kuch <strong>zaroori</strong> text.</p>
</article>
\`\`\`

\`strong\` \`p\` ke andar hai, jo \`article\` ke andar hai. Ye nesting ek **ped** hai, aur CSS aur JavaScript dono usi par chalte hain. Nesting galat hui to aage ka sab galat.

**Kuch tags ka closing tag hota hi nahi**

\`\`\`html
<img src="cat.jpg" alt="Ek billi">
<br>
<input type="text">
\`\`\`

Ye **void elements** hain — inke andar kuch hota hi nahi, isliye band karne ko kuch nahi.

**Attributes vivaran jodte hain**

\`\`\`html
<img src="cat.jpg" alt="Soti hui billi">
     └─ naam ─┘   └────── value ──────┘
\`\`\`

**Yaad rakho:** kholo, bharo, band karo. Indent karo taaki nesting dikhe. Har na-band kiya tag layout bug ban jata hai.`,

    content: `## The skeleton of every page

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Shown in the browser tab</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <!-- everything the user sees -->
  </body>
</html>
\`\`\`

- \`<!doctype html>\` — "use modern rules". Omit it and browsers switch to a 1990s compatibility mode where sizes behave differently.
- \`lang="en"\` — tells screen readers which language to pronounce.
- \`<meta charset="utf-8">\` — without it, accented characters and emoji render as mojibake.
- \`<meta name="viewport">\` — **without this line no mobile layout works at all.** Phones pretend to be 980px wide instead.

## head versus body

\`head\` is information *about* the page — title, stylesheets, metadata. Nothing in it is displayed. \`body\` is everything the user sees.

## Block versus inline

\`\`\`html
<div>I take the full width</div>
<span>I only take my own width</span>
\`\`\`

**Block** elements (\`div\`, \`p\`, \`h1\`, \`section\`) start on a new line and stretch across. **Inline** elements (\`span\`, \`a\`, \`strong\`, \`em\`) sit within a line of text.

The rule that follows from this: **never put a block element inside a \`<p>\`**. The browser will silently close the paragraph early to fix it, and your nesting will not be what you wrote.

## Attributes worth knowing now

\`\`\`html
<div id="main"          <!-- unique on the page -->
     class="card big"   <!-- reusable, space-separated -->
     data-user-id="7"   <!-- your own data, read via JS -->
     hidden>            <!-- boolean: present means true -->
\`\`\`

## Comments

\`\`\`html
<!-- This is a comment. It is NOT hidden from the user —
     anyone can read it with View Source. -->
\`\`\`

## Validate when something looks wrong

Nesting mistakes produce no error, only strange layout. When a page misbehaves in a way that makes no sense, paste it into the W3C validator — it will point at the unclosed tag in seconds.`,

    contentHi: `## Har page ka dhaancha

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Browser tab mein dikhta hai</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <!-- jo bhi user ko dikhta hai -->
  </body>
</html>
\`\`\`

- \`<!doctype html>\` — "naye rules use karo". Ise chhodo to browser 1990s wale compatibility mode mein chala jata hai jahan sizes alag behave karte hain.
- \`lang="en"\` — screen readers ko batata hai kaunsi bhasha bolni hai.
- \`<meta charset="utf-8">\` — iske bina accent wale characters aur emoji kuda-kachra bankar dikhte hain.
- \`<meta name="viewport">\` — **is line ke bina koi mobile layout chalta hi nahi.** Phone khud ko 980px chauda batane lagta hai.

## head versus body

\`head\` page ke *baare mein* jaankari hai — title, stylesheets, metadata. Usme se kuch dikhta nahi. \`body\` wo sab hai jo user dekhta hai.

## Block versus inline

\`\`\`html
<div>Main poori chaudai leta hoon</div>
<span>Main sirf apni chaudai leta hoon</span>
\`\`\`

**Block** elements (\`div\`, \`p\`, \`h1\`, \`section\`) nayi line se shuru hokar poori chaudai le lete hain. **Inline** elements (\`span\`, \`a\`, \`strong\`, \`em\`) text ki line ke andar hi rehte hain.

Isse ek rule nikalta hai: **\`<p>\` ke andar block element kabhi mat daalo**. Browser usse theek karne ke liye paragraph ko chup-chaap jaldi band kar dega, aur aapki nesting wo nahi rahegi jo aapne likhi thi.

## Abhi jaanne layak attributes

\`\`\`html
<div id="main"          <!-- page par unique -->
     class="card big"   <!-- reusable, space se alag -->
     data-user-id="7"   <!-- aapka apna data, JS se padhte hain -->
     hidden>            <!-- boolean: hona hi true hai -->
\`\`\`

## Comments

\`\`\`html
<!-- Ye comment hai. Ye user se CHHUPA nahi hai —
     koi bhi View Source se padh sakta hai. -->
\`\`\`

## Jab kuch galat lage tab validate karo

Nesting ki galtiyan koi error nahi deti, sirf ajeeb layout deti hain. Jab page aise bigde ki samajh hi na aaye, use W3C validator mein daal do — wo seconds mein na-band kiye tag par ungli rakh dega.`,

    examples: [
      {
        title: 'Your first HTML',
        titleHi: 'Aapki pehli HTML',
        code: `<h1>My Shop</h1>
<p>We sell good things.</p>
<p>Open <strong>every day</strong>.</p>`,
        preview: page(`<h1>My Shop</h1>
<p>We sell good things.</p>
<p>Open <strong>every day</strong>.</p>`),
        previewHeight: 150,
        explain: 'You wrote no styling at all, yet the heading is big and bold and the paragraphs are spaced. Those are the browser\'s built-in defaults for those labels.',
        explainHi: 'Aapne koi styling likhi hi nahi, phir bhi heading badi aur moti hai aur paragraphs ke beech jagah hai. Ye un labels ke liye browser ke built-in defaults hain.',
      },
      {
        title: 'Headings are a ladder, not a size chart',
        titleHi: 'Headings size chart nahi, seedhi hain',
        code: `<h1>Site title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
<h2>Another section</h2>`,
        preview: page(`<h1>Site title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
<h2>Another section</h2>`),
        previewHeight: 190,
        explain: 'They get smaller, but that is not the point — the numbers describe *structure*. Screen readers build a navigable outline from them, so skipping from `h1` to `h4` because you liked the size is a real accessibility problem.',
        explainHi: 'Ye chhote hote jate hain, par baat wo nahi hai — numbers *structure* batate hain. Screen readers inse ek outline banate hain, isliye size pasand aane ki wajah se `h1` se seedhe `h4` par kood jaana asli accessibility samasya hai.',
      },
      {
        title: 'Block versus inline, visibly',
        titleHi: 'Block versus inline, aankhon se',
        code: `<div>Block one</div>
<div>Block two</div>

<span>Inline one</span>
<span>Inline two</span>`,
        preview: page(`<div style="background:#dbeafe">Block one</div>
<div style="background:#bfdbfe">Block two</div>
<span style="background:#fde68a">Inline one</span>
<span style="background:#fcd34d">Inline two</span>`),
        previewHeight: 130,
        explain: 'The backgrounds make it obvious. Blocks stretch the full width and stack; inline elements sit side by side and are only as wide as their text.',
        explainHi: 'Background rang se saaf dikh jata hai. Blocks poori chaudai lekar ek ke neeche ek lagte hain; inline elements bagal-bagal rehte hain aur sirf apne text jitne chaude hote hain.',
      },
      {
        title: 'Nesting is a tree',
        titleHi: 'Nesting ek ped hai',
        code: `<article>
  <h2>Post title</h2>
  <p>Some <strong>important</strong> text.</p>
</article>`,
        preview: page(`<article style="border:2px solid #3b82f6;padding:10px">
  <h2 style="margin-top:0">Post title</h2>
  <p style="border:2px dashed #f59e0b;padding:6px">Some <strong style="background:#fde68a">important</strong> text.</p>
</article>`),
        previewHeight: 180,
        explain: 'The borders show the containment: `strong` (yellow) sits inside `p` (dashed), which sits inside `article` (blue). That is the tree CSS and JavaScript both walk.',
        explainHi: 'Borders containment dikhate hain: `strong` (peela) `p` (dashed) ke andar hai, jo `article` (neela) ke andar hai. Yahi wo ped hai jispar CSS aur JavaScript dono chalte hain.',
      },
      {
        title: 'The unclosed div — the classic bug',
        titleHi: 'Na-band kiya div — classic bug',
        code: `<!-- first div is never closed -->
<div class="card">
  <h3>Card one</h3>
<div class="card">
  <h3>Card two</h3>
</div>`,
        preview: page(`<div class="card">
  <h3>Card one</h3>
<div class="card">
  <h3>Card two</h3>
</div>`, `.card { border:2px solid #ef4444; padding:10px; margin-bottom:8px; }
h3 { margin:0 0 6px; font-size:15px; }`),
        previewHeight: 190,
        explain: 'Card two is drawn *inside* card one, nested rather than beside it. Nothing errored — the browser simply did what the markup literally said. This is why indentation matters: the mistake is visible at a glance when you indent.',
        explainHi: 'Card two card one ke *andar* bana, bagal mein nahi. Koi error nahi aaya — browser ne wahi kiya jo markup mein likha tha. Isiliye indentation zaroori hai: indent karo to galti ek nazar mein dikh jati hai.',
      },
      {
        title: 'Void elements close themselves',
        titleHi: 'Void elements khud band ho jate hain',
        code: `<p>Line one<br>Line two</p>
<hr>
<img src="..." alt="A red square">`,
        preview: page(`<p>Line one<br>Line two</p>
<hr>
<svg width="60" height="60"><rect width="60" height="60" fill="#ef4444"/></svg>`),
        previewHeight: 180,
        explain: '`br`, `hr` and `img` hold no content, so there is nothing to close. Writing `</br>` is simply invalid — there was never anything inside it.',
        explainHi: '`br`, `hr` aur `img` ke andar content hota hi nahi, isliye band karne ko kuch nahi. `</br>` likhna bas galat hai — uske andar kabhi kuch tha hi nahi.',
      },
      {
        title: 'Attributes carry the details',
        titleHi: 'Attributes vivaran rakhte hain',
        code: `<a href="https://example.com" target="_blank" rel="noopener">
  Visit the site
</a>

<img src="cat.jpg" alt="A sleeping cat" width="80">`,
        preview: page(`<a href="#" style="color:#2563eb">Visit the site</a>
<p style="margin-top:14px">Broken image, showing its alt text:</p>
<img src="does-not-exist.jpg" alt="A sleeping cat" width="80">`),
        previewHeight: 170,
        explain: 'The image failed to load and the browser showed the `alt` text instead. That is the same text a blind user hears — which is why an empty `alt` on a meaningful image is a real failure, not a formality.',
        explainHi: 'Image load nahi hui to browser ne `alt` text dikha diya. Wahi text ek nabeena user sunta hai — isiliye matlab wali image par khaali `alt` asli chook hai, formality nahi.',
      },
      {
        title: 'The viewport tag decides whether mobile works',
        titleHi: 'Viewport tag tay karta hai mobile chalega ya nahi',
        code: `<!-- Without it, a phone pretends to be 980px wide -->
<meta name="viewport"
      content="width=device-width, initial-scale=1">`,
        preview: page(`<div style="border:2px solid #ef4444;padding:8px;margin-bottom:10px">
  <strong>Without the tag</strong><br>
  <span style="font-size:9px">phone renders at 980px, then shrinks everything — tiny unreadable text</span>
</div>
<div style="border:2px solid #10b981;padding:8px">
  <strong>With the tag</strong><br>
  <span>phone renders at its real width — readable, and media queries work</span>
</div>`),
        previewHeight: 190,
        explain: 'This single line is the difference between a usable mobile site and a desktop page shrunk to postage-stamp size. Without it, media queries never trigger either — every "my responsive CSS does nothing" question starts here.',
        explainHi: 'Yahi ek line kaam ke mobile site aur postage-stamp jitne chhote desktop page ka fark hai. Iske bina media queries bhi kabhi nahi chalte — "meri responsive CSS kuch nahi karti" wala har sawal yahin se shuru hota hai.',
      },
      {
        title: 'A complete little page',
        titleHi: 'Ek poora chhota page',
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1">
    <title>My Shop</title>
  </head>
  <body>
    <h1>My Shop</h1>
    <p>Open <strong>every day</strong>.</p>
    <a href="/products">See products</a>
  </body>
</html>`,
        preview: page(`<h1>My Shop</h1>
<p>Open <strong>every day</strong>.</p>
<a href="#" style="color:#2563eb">See products</a>`),
        previewHeight: 170,
        explain: 'Every real page is this shape. Notice the `head` produced nothing visible — it is all instructions to the browser, while `body` is everything the user actually sees.',
        explainHi: 'Har asli page isi aakaar ka hota hai. Dhyan do `head` se kuch dikha hi nahi — wo sab browser ke liye hidayatein hain, jabki `body` wo sab hai jo user sach mein dekhta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `<div class="card">
  <h3>One</h3>
<div class="card">
  <h3>Two</h3>
</div>`,
        right: `<div class="card">
  <h3>One</h3>
</div>
<div class="card">
  <h3>Two</h3>
</div>`,
        previewWrong: page(`<div class="card"><h3>One</h3><div class="card"><h3>Two</h3></div>`,
          `.card{border:2px solid #ef4444;padding:8px;margin-bottom:6px}h3{margin:0;font-size:14px}`),
        previewRight: page(`<div class="card"><h3>One</h3></div><div class="card"><h3>Two</h3></div>`,
          `.card{border:2px solid #10b981;padding:8px;margin-bottom:6px}h3{margin:0;font-size:14px}`),
        previewHeight: 130,
        why: 'An unclosed tag nests the next element inside it instead of beside it. The browser reports nothing — you only find out from the layout.',
        whyHi: 'Na-band kiya tag agle element ko bagal mein rakhne ke bajaye apne andar daal deta hai. Browser kuch nahi batata — pata sirf layout se chalta hai.',
      },
      {
        wrong: `<p>Text <div>a block</div> more</p>`,
        right: `<p>Text</p>
<div>a block</div>
<p>more</p>`,
        previewWrong: page(`<p style="border:2px solid #ef4444;padding:4px">Text <div style="border:2px dashed #999">a block</div> more</p>`),
        previewRight: page(`<p style="border:2px solid #10b981;padding:4px">Text</p><div style="border:2px dashed #999;padding:4px">a block</div><p style="border:2px solid #10b981;padding:4px">more</p>`),
        previewHeight: 170,
        why: 'A `<p>` may only contain inline content. The browser silently closes the paragraph before the block, so "more" ends up in a third paragraph you never wrote.',
        whyHi: '`<p>` ke andar sirf inline content aa sakta hai. Browser block se pehle paragraph chup-chaap band kar deta hai, isliye "more" ek teesre paragraph mein chala jata hai jo aapne likha hi nahi.',
      },
      {
        wrong: `<img src="chart.png">`,
        right: `<img src="chart.png" alt="Sales rose 20% in June">`,
        why: 'Without `alt`, a screen reader announces only the filename, and a broken image shows nothing. Use `alt=""` **only** for purely decorative images.',
        whyHi: 'Bina `alt` ke screen reader sirf filename bolta hai, aur tooti image par kuch dikhta hi nahi. `alt=""` **sirf** un images par jo bilkul sajawat ke liye hain.',
      },
      {
        wrong: `<h1>Title</h1>
<h4>Subtitle</h4>   <!-- skipped h2 and h3 for the size -->`,
        right: `<h1>Title</h1>
<h2 class="small">Subtitle</h2>   <!-- style it, do not renumber it -->`,
        why: 'Heading levels are the page outline that screen readers navigate by. Choose the level for meaning and change the size with CSS.',
        whyHi: 'Heading levels page ka outline hain jispar screen readers chalte hain. Level matlab ke hisaab se chuno aur size CSS se badlo.',
      },
    ],

    realWorld: [
      {
        en: '**Every page you have ever opened.** View Source on any site and you will see this exact structure — doctype, head with meta and links, body with nested elements.',
        hi: '**Aapne aaj tak jo bhi page khola.** Kisi bhi site par View Source karo, bilkul yahi structure dikhega — doctype, meta aur links wala head, aur nested elements wala body.',
      },
      {
        en: '**React and Vue produce this.** JSX looks like HTML because it becomes HTML. Understanding the tree is what makes a framework\'s output readable.',
        hi: '**React aur Vue yahi banate hain.** JSX HTML jaisa dikhta hai kyunki wo HTML hi banta hai. Ped samajhna hi framework ka output padhne layak banata hai.',
      },
      {
        en: '**Search engines read the labels.** Google uses your `h1`, `title` and heading order to work out what the page is about — HTML structure is SEO, not decoration.',
        hi: '**Search engines label padhte hain.** Google aapke `h1`, `title` aur headings ke kram se samajhta hai ki page kis baare mein hai — HTML structure SEO hai, sajawat nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between an element, a tag and an attribute?',
        qHi: 'Element, tag aur attribute mein kya fark hai?',
        a: 'A tag is the markup itself, such as `<p>` or `</p>`. An element is the opening tag, its content and the closing tag taken together. An attribute is a name-value pair inside the opening tag that configures the element, such as `class="card"` or `src="cat.jpg"`.',
        aHi: 'Tag khud markup hai, jaise `<p>` ya `</p>`. Element opening tag, uska content aur closing tag — teeno milkar. Attribute opening tag ke andar naam-value ki jodi hai jo element ko set karti hai, jaise `class="card"` ya `src="cat.jpg"`.',
      },
      {
        q: 'What does the viewport meta tag do?',
        qHi: 'Viewport meta tag kya karta hai?',
        a: 'It tells a mobile browser to render at the device\'s real width rather than pretending to be a roughly 980px desktop screen and scaling the result down. Without it the page appears zoomed out and unreadable, and width-based media queries never match, so responsive CSS appears to do nothing.',
        aHi: 'Wo mobile browser se kehta hai ki device ki asli chaudai par render karo, na ki lagbhag 980px ka desktop screen bankar nateeja chhota kar do. Iske bina page zoom-out aur na-padhne-yogya dikhta hai, aur width wale media queries kabhi match nahi karte, isliye responsive CSS bekaar lagti hai.',
      },
      {
        q: 'What is the difference between block and inline elements?',
        qHi: 'Block aur inline elements mein kya fark hai?',
        a: 'Block elements begin on a new line and expand to fill their container\'s width — `div`, `p`, `h1`, `section`. Inline elements flow within a line of text and are only as wide as their content — `span`, `a`, `strong`. A block element is not valid inside a `<p>`, and browsers will restructure the markup if you write one.',
        aHi: 'Block elements nayi line se shuru hote hain aur container ki poori chaudai le lete hain — `div`, `p`, `h1`, `section`. Inline elements text ki line ke andar behte hain aur sirf apne content jitne chaude hote hain — `span`, `a`, `strong`. `<p>` ke andar block element valid nahi hai, aur likhne par browser markup ko dobara jama deta hai.',
      },
      {
        q: 'Why does a missing closing tag not produce an error?',
        qHi: 'Closing tag chhootne par error kyun nahi aata?',
        a: 'HTML parsers are specified to recover from malformed markup rather than fail, so the web does not break on one bad page. The parser applies recovery rules — usually nesting the following element inside the unclosed one — and renders something. The cost is that structural mistakes surface only as strange layout, which is why the W3C validator is worth running.',
        aHi: 'HTML parsers ko spec mein hi kaha gaya hai ki kharab markup par fail nahi, sambhalna hai, taaki ek kharab page se poora web na toote. Parser recovery rules lagata hai — aksar agle element ko na-band kiye element ke andar daal deta hai — aur kuch na kuch dikha deta hai. Keemat ye hai ki structure ki galtiyan sirf ajeeb layout ke roop mein dikhti hain, isiliye W3C validator chalane layak hai.',
      },
      {
        q: 'What are void elements?',
        qHi: 'Void elements kya hain?',
        a: 'Elements that cannot contain content and therefore have no closing tag — `img`, `br`, `hr`, `input`, `meta`, `link`. Writing `</br>` is invalid because there was never any content to close. In HTML the trailing slash in `<br />` is permitted but has no effect.',
        aHi: 'Aise elements jinke andar content ho hi nahi sakta, isliye unka closing tag nahi hota — `img`, `br`, `hr`, `input`, `meta`, `link`. `</br>` likhna galat hai kyunki band karne ko kabhi kuch tha hi nahi. HTML mein `<br />` wala slash allowed hai par uska koi asar nahi hota.',
      },
    ],

    exercises: [
      {
        task: 'Build a page with a doctype, a proper head including charset and viewport, and a body with one `h1`, two paragraphs and a link. Open it in a browser.',
        taskHi: 'Ek page banao jisme doctype ho, charset aur viewport wala theek head ho, aur body mein ek `h1`, do paragraphs aur ek link ho. Use browser mein kholo.',
        hint: 'Save it as `index.html` and double-click. Everything in `head` should be invisible on the page — if you can see it, it is in the wrong place.',
        hintHi: 'Use `index.html` naam se save karo aur double-click karo. `head` ka sab kuch page par adrishya hona chahiye — dikhe to wo galat jagah hai.',
      },
      {
        task: 'Deliberately remove one closing `</div>` from a two-card layout and look at the result. Then put it back. Note that no error appeared either way.',
        taskHi: 'Do-card wale layout se jaan-boojhkar ek `</div>` hatao aur nateeja dekho. Phir wapas lagao. Dhyan do dono baar koi error nahi aaya.',
        hint: 'Give the cards a border so the nesting is visible. This is exactly how the bug looks in a real project.',
        hintHi: 'Cards par border lagao taaki nesting dikhe. Asli project mein bug bilkul aisa hi dikhta hai.',
      },
      {
        task: 'Paste a page with a nesting mistake into the W3C validator at validator.w3.org and read what it reports.',
        taskHi: 'Nesting ki galti wala page validator.w3.org par daalo aur padho ki wo kya batata hai.',
        hint: 'It names the line and the tag. Doing this once teaches you to reach for it whenever a layout makes no sense.',
        hintHi: 'Wo line aur tag dono batata hai. Ek baar karne se aadat pad jati hai ki jab layout samajh na aaye tab yahi kholo.',
      },
    ],

    keyTakeaways: [
      'HTML labels what content IS; CSS decides how it looks.',
      'Open it, fill it, close it — an unclosed tag nests the next element inside it with no error.',
      'Nesting forms a tree, and both CSS and JavaScript navigate that tree.',
      'Block elements take the full width and stack; inline elements sit within a line.',
      'Void elements (`img`, `br`, `input`) have no closing tag because they hold no content.',
      'Without the viewport meta tag, no mobile layout and no media query works.',
    ],
    keyTakeawaysHi: [
      'HTML batata hai content HAI kya; CSS tay karta hai wo kaisa dikhe.',
      'Kholo, bharo, band karo — na-band kiya tag agle element ko bina error ke apne andar daal leta hai.',
      'Nesting ek ped banati hai, aur CSS aur JavaScript dono usi ped par chalte hain.',
      'Block elements poori chaudai lete hain aur ek ke neeche ek lagte hain; inline line ke andar rehte hain.',
      'Void elements (`img`, `br`, `input`) ka closing tag nahi hota kyunki unke andar content hi nahi hota.',
      'Viewport meta tag ke bina na mobile layout chalta hai na koi media query.',
    ],
  },
];
