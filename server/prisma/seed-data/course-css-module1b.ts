/**
 * CSS & HTML Complete Course — Module 1, lessons 2 to 4.
 *
 * Text and media, forms, and semantic structure. The accessibility lesson sits
 * last on purpose: it only lands once you have written enough markup to have
 * built the div-soup it argues against.
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

export const CSS_MODULE_1B: CourseLesson[] = [
  /* ══════════════════ Text, Links and Images ══════════════════ */
  {
    slug: 'html-text-links-images',
    title: 'Text, Links and Images',
    titleHi: 'Text, Links aur Images',
    description: 'Signposts and photographs — and the one attribute that decides whether a blind user can use your page.',
    descriptionHi: 'Signboard aur tasveerein — aur wo ek attribute jo tay karta hai ki nabeena user aapka page use kar payega ya nahi.',
    difficulty: 'EASY',
    duration: 30,
    order: 2,

    analogy: {
      en: '**A magazine page.** There are headings, body text, photographs with captions underneath, and cross-references telling you to turn to page 47. HTML has exactly these four things — and unlike a magazine, the cross-references are clickable and the photographs can describe themselves out loud to someone who cannot see them.',
      hi: '**Magazine ka page.** Usme headings hoti hain, body text, neeche caption wali tasveerein, aur aise ishare jo kehte hain "page 47 dekho". HTML mein bilkul yahi chaar cheezein hain — aur magazine ke ulat, yahan ishare click hote hain aur tasveerein khud ko us vyakti ko bol kar bata sakti hain jo unhe dekh nahi sakta.',
    },

    simple: `**Text that means something**

\`\`\`html
<p>A normal paragraph.</p>
<strong>Important</strong>   <!-- carries weight, read with emphasis -->
<em>Stressed</em>            <!-- changes the meaning of the sentence -->
<b>Just bold</b>             <!-- looks bold, means nothing -->
<i>Just italic</i>           <!-- looks italic, means nothing -->
\`\`\`

\`strong\` and \`b\` look identical. The difference is that a screen reader emphasises \`strong\` and ignores \`b\`. **Pick by meaning, not by appearance** — if you only want the look, that is CSS's job.

**Links — the whole point of the web**

\`\`\`html
<a href="/about">About us</a>              <!-- same site -->
<a href="https://google.com">Google</a>    <!-- another site -->
<a href="#section-2">Jump down</a>         <!-- same page -->
<a href="mailto:hi@shop.com">Email us</a>
<a href="tel:+919876543210">Call us</a>
\`\`\`

Opening in a new tab needs two attributes, not one:

\`\`\`html
<a href="https://x.com" target="_blank" rel="noopener">X</a>
\`\`\`

Without \`rel="noopener"\` the page you opened can reach back and control your tab. That is a genuine security hole, not a formality.

**Link text must make sense alone**

Screen reader users often jump between links, hearing only the link text with no surrounding sentence.

\`\`\`html
<a href="/report">Click here</a>    <!-- ❌ "click here" — where? -->
<a href="/report">Read the report</a>  <!-- ✅ -->
\`\`\`

**Images — and the attribute everyone skips**

\`\`\`html
<img src="cat.jpg" alt="A ginger cat asleep on a keyboard">
\`\`\`

\`alt\` is what a blind user hears, and what everyone sees when the image fails to load. Describe **what the image conveys**, not what it is:

\`\`\`html
<img src="chart.png" alt="Chart">                    <!-- ❌ useless -->
<img src="chart.png" alt="Sales rose 20% in June">   <!-- ✅ -->
\`\`\`

For a purely decorative image, use \`alt=""\` — empty, not missing. That tells the screen reader to skip it entirely.

**Lists**

\`\`\`html
<ul>              <!-- order does not matter -->
  <li>Milk</li>
</ul>

<ol>              <!-- order matters: steps 1, 2, 3 -->
  <li>Beat eggs</li>
</ol>
\`\`\`

Only \`<li>\` may sit directly inside them. A navigation bar is a list of links — that is not a trick, it genuinely *is* a list.

**Remember:** choose tags by meaning. Every meaningful image needs a real \`alt\`. Link text must stand alone.`,

    simpleHi: `**Aisa text jiska matlab ho**

\`\`\`html
<p>Ek normal paragraph.</p>
<strong>Zaroori</strong>     <!-- vazan rakhta hai, zor dekar padha jata hai -->
<em>Zor diya gaya</em>       <!-- vaakya ka matlab badal deta hai -->
<b>Sirf bold</b>             <!-- bold dikhta hai, matlab kuch nahi -->
<i>Sirf italic</i>           <!-- italic dikhta hai, matlab kuch nahi -->
\`\`\`

\`strong\` aur \`b\` bilkul ek jaise dikhte hain. Fark ye hai ki screen reader \`strong\` par zor deta hai aur \`b\` ko anndekha karta hai. **Matlab se chuno, dikhawe se nahi** — sirf look chahiye to wo CSS ka kaam hai.

**Links — web ka poora maqsad**

\`\`\`html
<a href="/about">Hamare baare mein</a>     <!-- usi site par -->
<a href="https://google.com">Google</a>    <!-- doosri site -->
<a href="#section-2">Neeche jao</a>        <!-- usi page par -->
<a href="mailto:hi@shop.com">Email karo</a>
<a href="tel:+919876543210">Call karo</a>
\`\`\`

Naye tab mein kholne ke liye do attributes chahiye, ek nahi:

\`\`\`html
<a href="https://x.com" target="_blank" rel="noopener">X</a>
\`\`\`

Bina \`rel="noopener"\` ke, jo page aapne khola wo peeche pahunch kar aapka tab control kar sakta hai. Ye asli security chhed hai, formality nahi.

**Link ka text akela bhi samajh aana chahiye**

Screen reader users aksar links par kood-kood kar chalte hain, aur unhe sirf link ka text sunai deta hai, aas-paas ka vaakya nahi.

\`\`\`html
<a href="/report">Yahan click karo</a>    <!-- ❌ "yahan" — kahan? -->
<a href="/report">Report padho</a>        <!-- ✅ -->
\`\`\`

**Images — aur wo attribute jise sab chhod dete hain**

\`\`\`html
<img src="cat.jpg" alt="Keyboard par soti hui narangi billi">
\`\`\`

\`alt\` wahi hai jo nabeena user sunta hai, aur jo sabko tab dikhta hai jab image load na ho. Ye batao ki image **kya keh rahi hai**, ye nahi ki wo hai kya:

\`\`\`html
<img src="chart.png" alt="Chart">                       <!-- ❌ bekaar -->
<img src="chart.png" alt="June mein sales 20% badhi">   <!-- ✅ -->
\`\`\`

Sirf sajawat wali image ke liye \`alt=""\` likho — khaali, gayab nahi. Isse screen reader use poori tarah chhod deta hai.

**Lists**

\`\`\`html
<ul>              <!-- kram matter nahi karta -->
  <li>Doodh</li>
</ul>

<ol>              <!-- kram matter karta hai: step 1, 2, 3 -->
  <li>Ande phento</li>
</ol>
\`\`\`

Inke andar seedhe sirf \`<li>\` aa sakta hai. Navigation bar links ki list hi hai — ye koi chaal nahi, wo sach mein list *hai*.

**Yaad rakho:** tags matlab se chuno. Har matlab wali image ko asli \`alt\` chahiye. Link ka text akela khada ho sake.`,

    content: `## Text elements by meaning

| Tag | Means | Screen reader |
|---|---|---|
| \`<strong>\` | important | emphasises |
| \`<b>\` | stylistically bold | ignores |
| \`<em>\` | stressed emphasis | emphasises |
| \`<i>\` | technical term, foreign word | ignores |
| \`<mark>\` | highlighted / relevant | announces |
| \`<small>\` | side comment, legal print | normal |
| \`<code>\` | code | often changes voice |
| \`<time datetime="2024-06-15">\` | a machine-readable date | reads the date |

## Quotes

\`\`\`html
<blockquote cite="https://source.com">
  <p>A longer quotation.</p>
  <footer>— <cite>Author Name</cite></footer>
</blockquote>

<p>She said <q>a short inline quote</q> and left.</p>
\`\`\`

## Links, precisely

\`\`\`html
<a href="/about">          <!-- root-relative: always /about -->
<a href="about.html">      <!-- relative to the current folder -->
<a href="../index.html">   <!-- up one folder -->
<a href="#top">            <!-- an id on this page -->
<a href="/file.pdf" download>   <!-- download instead of opening -->
\`\`\`

**Never** use \`<a>\` without an \`href\` as a button — it loses keyboard focus and its button role. If the thing performs an action rather than navigating, it is a \`<button>\`.

## Images

\`\`\`html
<img src="photo.jpg"
     alt="Description of what it conveys"
     width="800" height="600"     <!-- reserves space: stops layout shift -->
     loading="lazy">              <!-- do not download until near the viewport -->
\`\`\`

Always set \`width\` and \`height\`. Without them the browser does not know how much space to reserve, so the page jumps as each image arrives — the single most common cause of a bad Cumulative Layout Shift score.

**Different images for different screens:**

\`\`\`html
<picture>
  <source media="(min-width: 800px)" srcset="wide.jpg">
  <img src="narrow.jpg" alt="…">
</picture>
\`\`\`

The \`<img>\` inside is the fallback and is required.

## Choosing alt text

\`\`\`html
<!-- decorative only: skip it entirely -->
<img src="swirl.svg" alt="">

<!-- conveys information: describe the information -->
<img src="graph.png" alt="Revenue doubled between March and June">

<!-- inside a link: describe the destination -->
<a href="/home"><img src="logo.png" alt="Home"></a>
\`\`\`

Do not begin with "Image of" — the screen reader already announces that it is an image.

## Lists

\`\`\`html
<dl>                          <!-- description list: term + definition -->
  <dt>HTML</dt>
  <dd>The structure of a page.</dd>
</dl>
\`\`\`

Nesting goes **inside** an \`<li>\`, never directly inside the \`<ul>\`:

\`\`\`html
<ul>
  <li>Fruit
    <ul><li>Apple</li></ul>   <!-- ✅ inside the li -->
  </li>
</ul>
\`\`\``,

    contentHi: `## Text elements, matlab ke hisaab se

| Tag | Matlab | Screen reader |
|---|---|---|
| \`<strong>\` | zaroori | zor deta hai |
| \`<b>\` | sirf dikhne mein bold | anndekha karta hai |
| \`<em>\` | zor diya gaya | zor deta hai |
| \`<i>\` | takneeki shabd, videshi shabd | anndekha karta hai |
| \`<mark>\` | highlight kiya / prasangik | batata hai |
| \`<small>\` | side comment, legal print | normal |
| \`<code>\` | code | aksar aawaz badal deta hai |
| \`<time datetime="2024-06-15">\` | machine-padhne-yogya date | date padhta hai |

## Quotes

\`\`\`html
<blockquote cite="https://source.com">
  <p>Ek lamba uddharan.</p>
  <footer>— <cite>Lekhak ka naam</cite></footer>
</blockquote>

<p>Usne kaha <q>chhota inline quote</q> aur chali gayi.</p>
\`\`\`

## Links, theek se

\`\`\`html
<a href="/about">          <!-- root-relative: hamesha /about -->
<a href="about.html">      <!-- current folder ke hisaab se -->
<a href="../index.html">   <!-- ek folder upar -->
<a href="#top">            <!-- is page ki koi id -->
<a href="/file.pdf" download>   <!-- kholne ke bajaye download -->
\`\`\`

Bina \`href\` wale \`<a>\` ko button ki tarah **kabhi** use mat karo — usse keyboard focus aur button role dono chale jate hain. Agar cheez navigate nahi, koi kaam karti hai, to wo \`<button>\` hai.

## Images

\`\`\`html
<img src="photo.jpg"
     alt="Wo kya keh rahi hai uska vivaran"
     width="800" height="600"     <!-- jagah reserve karta hai: layout shift rokta hai -->
     loading="lazy">              <!-- viewport ke paas aane tak download mat karo -->
\`\`\`

\`width\` aur \`height\` hamesha do. Inke bina browser ko pata hi nahi ki kitni jagah rakhni hai, isliye har image aane par page uchhalta hai — kharab Cumulative Layout Shift ka sabse aam kaaran yahi hai.

**Alag screens ke liye alag images:**

\`\`\`html
<picture>
  <source media="(min-width: 800px)" srcset="wide.jpg">
  <img src="narrow.jpg" alt="…">
</picture>
\`\`\`

Andar wala \`<img>\` fallback hai aur zaroori hai.

## Alt text chunna

\`\`\`html
<!-- sirf sajawat: poori tarah chhod do -->
<img src="swirl.svg" alt="">

<!-- jaankari de rahi hai: jaankari batao -->
<img src="graph.png" alt="March se June ke beech revenue dugna hua">

<!-- link ke andar: manzil batao -->
<a href="/home"><img src="logo.png" alt="Home"></a>
\`\`\`

"Image of" se shuru mat karo — screen reader pehle hi bata deta hai ki ye image hai.

## Lists

\`\`\`html
<dl>                          <!-- description list: shabd + arth -->
  <dt>HTML</dt>
  <dd>Page ka structure.</dd>
</dl>
\`\`\`

Nesting \`<li>\` ke **andar** hoti hai, seedhe \`<ul>\` ke andar kabhi nahi:

\`\`\`html
<ul>
  <li>Fal
    <ul><li>Seb</li></ul>   <!-- ✅ li ke andar -->
  </li>
</ul>
\`\`\``,

    examples: [
      {
        title: 'strong versus b — identical to the eye',
        titleHi: 'strong versus b — aankh ko ek jaise',
        code: `<p>This is <strong>important</strong>.</p>
<p>This is <b>just bold</b>.</p>`,
        preview: page(`<p>This is <strong>important</strong>.</p>
<p>This is <b>just bold</b>.</p>
<p style="font-size:13px;color:#666;margin-top:14px">
Visually identical. A screen reader emphasises the first and reads the second flat.</p>`),
        previewHeight: 160,
        explain: 'You cannot tell them apart by looking, which is exactly why people pick the wrong one. Choose by what you mean; if you only want boldness, use CSS.',
        explainHi: 'Dekhkar fark pata hi nahi chalta, aur isiliye log galat wala chun lete hain. Matlab se chuno; sirf motapan chahiye to CSS use karo.',
      },
      {
        title: 'Links of every kind',
        titleHi: 'Har kism ke links',
        code: `<a href="/about">Same site</a>
<a href="https://example.com">Another site</a>
<a href="#bottom">Jump down this page</a>
<a href="mailto:hi@shop.com">Email us</a>`,
        preview: page(`<p><a href="#">Same site</a></p>
<p><a href="#">Another site</a></p>
<p><a href="#bottom">Jump down this page</a></p>
<p><a href="#">Email us</a></p>
<p style="font-size:13px;color:#666">Blue and underlined by default — that is the browser telling users it is clickable.</p>`),
        previewHeight: 190,
        explain: 'Blue and underlined is not decoration — it is the convention users rely on to recognise a link. If you remove the underline, make sure something else still signals clickability.',
        explainHi: 'Neela aur underline sajawat nahi hai — user isi se pehchanta hai ki ye link hai. Underline hatao to koi aur ishara zaroor rakho jo clickable hona bataye.',
      },
      {
        title: 'Link text must stand alone',
        titleHi: 'Link text akela khada ho sake',
        code: `<!-- ❌ meaningless out of context -->
<p>To see the sales figures, <a href="#">click here</a>.</p>

<!-- ✅ describes its own destination -->
<p><a href="#">See the sales figures</a></p>`,
        preview: page(`<p>To see the sales figures, <a href="#">click here</a>.</p>
<p><a href="#">See the sales figures</a></p>
<div style="margin-top:14px;padding:8px;background:#f1f5f9;font-size:13px">
<strong>What a screen reader user hears when listing links:</strong><br>
❌ "click here"<br>
✅ "See the sales figures"
</div>`),
        previewHeight: 220,
        explain: 'Screen readers can list every link on a page. In that list the surrounding sentence is gone, so "click here" repeated eight times tells the user nothing at all.',
        explainHi: 'Screen readers page ke saare links ki list bana sakte hain. Us list mein aas-paas ka vaakya gayab hota hai, isliye aath baar "click here" user ko kuch nahi batata.',
      },
      {
        title: 'What alt text is for',
        titleHi: 'Alt text kis liye hai',
        code: `<img src="chart.png" alt="Chart">
<img src="chart.png" alt="Sales rose 20% in June">`,
        preview: page(`<p style="font-size:13px;color:#666">Both images fail to load. This is what each one leaves behind:</p>
<div style="border:2px solid #ef4444;padding:8px;margin-bottom:8px">
  <img src="broken-1.png" alt="Chart" style="max-width:100%">
</div>
<div style="border:2px solid #10b981;padding:8px">
  <img src="broken-2.png" alt="Sales rose 20% in June" style="max-width:100%">
</div>`),
        previewHeight: 210,
        explain: 'A slow connection, a typo in a path, a blocked CDN — images fail often. The second one still communicates its point. The first tells the reader nothing they did not already know.',
        explainHi: 'Slow connection, path mein typo, block hua CDN — images aksar fail hoti hain. Doosri phir bhi apni baat keh deti hai. Pehli reader ko kuch naya batati hi nahi.',
      },
      {
        title: 'Width and height stop the page jumping',
        titleHi: 'Width aur height page ko uchhalne se rokte hain',
        code: `<!-- ❌ browser cannot reserve space -->
<img src="photo.jpg" alt="…">

<!-- ✅ space reserved before it downloads -->
<img src="photo.jpg" alt="…" width="300" height="180">`,
        preview: page(`<p>Text above the image.</p>
<div style="width:300px;height:120px;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-size:13px;color:#1e40af">
  space reserved by width + height
</div>
<p>Text below stays exactly where it is while the image loads.</p>`),
        previewHeight: 240,
        explain: 'Without dimensions the text below sits directly under the heading, then jumps down when the image arrives. Users tap the wrong thing because the button moved — that is what Cumulative Layout Shift measures.',
        explainHi: 'Bina dimensions ke neeche ka text seedhe heading ke neeche hota hai, phir image aate hi neeche kood jata hai. User galat cheez par tap kar deta hai kyunki button hil gaya — Cumulative Layout Shift yahi naapta hai.',
      },
      {
        title: 'Lists, and why a navbar is one',
        titleHi: 'Lists, aur navbar list kyun hai',
        code: `<ul>
  <li>Milk</li>
  <li>Bread</li>
</ul>

<ol>
  <li>Beat the eggs</li>
  <li>Add flour</li>
</ol>`,
        preview: page(`<ul><li>Milk</li><li>Bread</li></ul>
<ol><li>Beat the eggs</li><li>Add flour</li></ol>
<p style="font-size:13px;color:#666;margin-top:12px">
A screen reader announces "list, 2 items" before reading either one — that count is the value.</p>`),
        previewHeight: 260,
        explain: 'The numbers in `<ol>` come from the browser, not from you typing them, so inserting a step renumbers everything automatically. And the announced item count is why a nav bar really should be a `<ul>`.',
        explainHi: '`<ol>` ke numbers browser deta hai, aapke type karne se nahi, isliye beech mein step daalne par sab apne aap dobara number ho jate hain. Aur item count batana hi wo wajah hai ki nav bar sach mein `<ul>` honi chahiye.',
      },
      {
        title: 'Nesting a list correctly',
        titleHi: 'List theek se nest karna',
        code: `<ul>
  <li>Fruit
    <ul>
      <li>Apple</li>
      <li>Mango</li>
    </ul>
  </li>
  <li>Vegetables</li>
</ul>`,
        preview: page(`<ul>
  <li>Fruit
    <ul><li>Apple</li><li>Mango</li></ul>
  </li>
  <li>Vegetables</li>
</ul>`),
        previewHeight: 170,
        explain: 'The inner list sits inside the `<li>`, not beside it. Putting a `<ul>` directly inside a `<ul>` is invalid and the browser will silently restructure it.',
        explainHi: 'Andar wali list `<li>` ke andar hai, uske bagal mein nahi. `<ul>` ko seedhe `<ul>` ke andar daalna galat hai aur browser usse chup-chaap dobara jama deta hai.',
      },
      {
        title: 'A magazine-style block',
        titleHi: 'Magazine jaisa block',
        code: `<article>
  <h2>Monsoon arrives early</h2>
  <p><time datetime="2024-06-15">15 June 2024</time></p>
  <figure>
    <img src="rain.jpg" alt="Rain over a city street">
    <figcaption>Heavy rain in Pune yesterday.</figcaption>
  </figure>
  <p>Rain reached the coast <strong>two weeks early</strong>.</p>
</article>`,
        preview: page(`<article>
  <h2 style="margin-top:0">Monsoon arrives early</h2>
  <p style="color:#666;font-size:13px">15 June 2024</p>
  <figure style="margin:0 0 10px">
    <div style="height:60px;background:#94a3b8;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px">photo</div>
    <figcaption style="font-size:12px;color:#666;margin-top:4px">Heavy rain in Pune yesterday.</figcaption>
  </figure>
  <p>Rain reached the coast <strong>two weeks early</strong>.</p>
</article>`),
        previewHeight: 280,
        explain: '`<figure>` and `<figcaption>` tie an image to its caption formally, so a screen reader reads them as one unit rather than as an image followed by an unrelated line of text.',
        explainHi: '`<figure>` aur `<figcaption>` image ko uske caption se aupcharik roop se jodte hain, isliye screen reader unhe ek ikai ki tarah padhta hai, na ki image ke baad koi asambandhit line.',
      },
      {
        title: 'target="_blank" needs rel="noopener"',
        titleHi: 'target="_blank" ko rel="noopener" chahiye',
        code: `<!-- ❌ the opened page can control your tab -->
<a href="https://other.com" target="_blank">Open</a>

<!-- ✅ -->
<a href="https://other.com" target="_blank" rel="noopener">Open</a>`,
        preview: page(`<div style="border:2px solid #ef4444;padding:8px;margin-bottom:8px;font-size:13px">
<strong>Without rel="noopener"</strong><br>
The new page gets <code>window.opener</code> — it can navigate your original tab
to a fake login page while you are looking elsewhere.
</div>
<div style="border:2px solid #10b981;padding:8px;font-size:13px">
<strong>With rel="noopener"</strong><br>
<code>window.opener</code> is null. No link back.
</div>`),
        previewHeight: 230,
        explain: 'This attack is called tabnabbing. Modern browsers now imply `noopener` for `target="_blank"`, but older ones do not — and writing it costs nothing.',
        explainHi: 'Is hamle ko tabnabbing kehte hain. Naye browsers ab `target="_blank"` ke saath `noopener` khud maan lete hain, par purane nahi — aur ise likhne mein kuch kharch bhi nahi hota.',
      },
    ],

    mistakes: [
      {
        wrong: `<img src="graph.png">`,
        right: `<img src="graph.png" alt="Revenue doubled from March to June">`,
        previewWrong: page(`<img src="x.png" alt="" style="border:2px solid #ef4444"><p style="font-size:12px;color:#666">Screen reader says: "graph dot png, image" — or nothing at all.</p>`),
        previewRight: page(`<img src="x.png" alt="Revenue doubled from March to June" style="border:2px solid #10b981"><p style="font-size:12px;color:#666">Screen reader says the sentence. So does the broken-image fallback.</p>`),
        previewHeight: 150,
        why: 'A missing `alt` leaves a blind user with a filename or silence. Use `alt=""` only when the image is purely decorative.',
        whyHi: 'Gayab `alt` nabeena user ko sirf filename ya khamoshi deta hai. `alt=""` sirf tab jab image bilkul sajawat ke liye ho.',
      },
      {
        wrong: `<p>Read more <a href="/x">here</a>.</p>`,
        right: `<p><a href="/x">Read the full report</a></p>`,
        why: 'Screen reader users navigate by jumping between links, hearing the link text alone. "Here" and "click here" describe nothing.',
        whyHi: 'Screen reader users link-se-link kood kar chalte hain aur sirf link ka text sunte hain. "Here" aur "click here" kuch batate hi nahi.',
      },
      {
        wrong: `<ul>
  <li>Fruit</li>
  <ul><li>Apple</li></ul>
</ul>`,
        right: `<ul>
  <li>Fruit
    <ul><li>Apple</li></ul>
  </li>
</ul>`,
        why: 'Only `<li>` may be a direct child of `<ul>`. A nested list belongs inside the `<li>` it describes.',
        whyHi: '`<ul>` ka seedha bachcha sirf `<li>` ho sakta hai. Nested list us `<li>` ke andar hoti hai jiska wo vivaran hai.',
      },
      {
        wrong: `<a onclick="save()">Save</a>`,
        right: `<button onclick="save()">Save</button>`,
        why: 'An `<a>` without `href` is not focusable and has no button role, so keyboard and screen reader users cannot activate it. If it acts rather than navigates, it is a button.',
        whyHi: 'Bina `href` wala `<a>` focus nahi hota aur uska button role bhi nahi hota, isliye keyboard aur screen reader users usse chala hi nahi sakte. Jo navigate nahi, kaam karta hai, wo button hai.',
      },
    ],

    realWorld: [
      {
        en: '**Image-heavy sites.** Setting `width`, `height` and `loading="lazy"` on every image is the cheapest performance win available — it fixes layout shift and cuts initial downloads in one go.',
        hi: '**Image wali sites.** Har image par `width`, `height` aur `loading="lazy"` lagana sabse sasta performance fayda hai — ek saath layout shift bhi theek karta hai aur shuruaati downloads bhi ghataata hai.',
      },
      {
        en: '**SEO.** Google reads `alt` text to understand images, and descriptive link text to understand what a page links to. Accessibility work and search ranking are largely the same work.',
        hi: '**SEO.** Google images samajhne ke liye `alt` text padhta hai, aur page kis se juda hai ye samajhne ke liye link ka text. Accessibility ka kaam aur search ranking ka kaam zyadatar ek hi hai.',
      },
      {
        en: '**Legal requirement.** Accessibility is mandated by law in many places — the ADA in the US, the EAA in Europe. Missing `alt` text has been the basis of real lawsuits.',
        hi: '**Kanooni zarurat.** Kai jagah accessibility kanoon se zaroori hai — US mein ADA, Europe mein EAA. Gayab `alt` text par sach mein muqadme ho chuke hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `<strong>` and `<b>`?',
        qHi: '`<strong>` aur `<b>` mein kya fark hai?',
        a: 'They render identically but carry different meaning. `<strong>` marks content as important and assistive technology emphasises it; `<b>` is presentational only and is ignored semantically. The same relationship holds between `<em>` and `<i>`. Choose by meaning and use CSS when you want appearance alone.',
        aHi: 'Dono ek jaise dikhte hain par matlab alag rakhte hain. `<strong>` content ko zaroori batata hai aur assistive technology uspar zor deti hai; `<b>` sirf dikhawe ke liye hai aur semantically anndekha hota hai. `<em>` aur `<i>` ke beech bhi yahi rishta hai. Matlab se chuno aur sirf look chahiye to CSS use karo.',
      },
      {
        q: 'When should alt text be empty?',
        qHi: 'Alt text kab khaali hona chahiye?',
        a: 'When the image is purely decorative and conveys nothing the surrounding text does not already say — a divider, a background flourish, an icon beside a label that repeats it. `alt=""` tells the screen reader to skip the image entirely. Omitting the attribute is different and worse: the reader may announce the filename instead.',
        aHi: 'Jab image bilkul sajawat ke liye ho aur aas-paas ke text se alag kuch na keh rahi ho — divider, background ka design, ya label ke bagal ka icon jo wahi baat dohrata hai. `alt=""` screen reader se kehta hai ki image poori tarah chhod do. Attribute hi na likhna alag aur bura hai: reader filename bol sakta hai.',
      },
      {
        q: 'Why set `width` and `height` on an image?',
        qHi: 'Image par `width` aur `height` kyun set karein?',
        a: 'So the browser can reserve the correct space before the file downloads. Without them the surrounding content renders at the wrong position and jumps when the image arrives, which is measured as Cumulative Layout Shift and causes users to tap the wrong element. Setting the attributes does not prevent CSS from resizing it.',
        aHi: 'Taaki browser file download hone se pehle sahi jagah reserve kar sake. Inke bina aas-paas ka content galat jagah render hota hai aur image aate hi kood jata hai, jise Cumulative Layout Shift naapta hai aur user galat element par tap kar deta hai. Ye attributes lagane se CSS uska size badalne se nahi rukti.',
      },
      {
        q: 'Why does `target="_blank"` need `rel="noopener"`?',
        qHi: '`target="_blank"` ko `rel="noopener"` kyun chahiye?',
        a: 'Without it the newly opened page receives a `window.opener` reference to your page and can navigate your original tab elsewhere — for example to a convincing fake login screen. This is called tabnabbing. Modern browsers now imply `noopener`, but declaring it explicitly costs nothing and protects older ones.',
        aHi: 'Iske bina naya khula page aapke page ka `window.opener` reference pa jata hai aur aapke original tab ko kahin aur le ja sakta hai — jaise ek bharosemand dikhne wale nakli login screen par. Ise tabnabbing kehte hain. Naye browsers ab `noopener` khud maan lete hain, par ise likhne mein kuch kharch nahi aur purane browsers bach jate hain.',
      },
      {
        q: 'When should you use a `<button>` rather than an `<a>`?',
        qHi: '`<a>` ke bajaye `<button>` kab use karein?',
        a: 'Use `<a href="…">` when the control navigates to a URL, and `<button>` when it performs an action on the current page — submitting, opening a dialog, toggling state. An `<a>` without `href` is not keyboard focusable and exposes no button role, so it is unusable without a mouse.',
        aHi: 'Jab control kisi URL par le jaye to `<a href="…">`, aur jab wo isi page par koi kaam kare — submit karna, dialog kholna, state badalna — to `<button>`. Bina `href` wala `<a>` keyboard se focus nahi hota aur uska button role bhi nahi hota, isliye bina mouse ke wo bekaar hai.',
      },
    ],

    exercises: [
      {
        task: 'Build a small article with a heading, a `<time>` element, a `<figure>` containing an image and caption, and a paragraph using `<strong>` correctly.',
        taskHi: 'Ek chhota article banao jisme heading ho, ek `<time>` element, image aur caption wala `<figure>`, aur `<strong>` ka sahi use karta ek paragraph.',
        hint: '`<time datetime="2024-06-15">15 June 2024</time>` — the attribute is machine-readable, the text is for humans.',
        hintHi: '`<time datetime="2024-06-15">15 June 2024</time>` — attribute machine ke liye hai, text insaan ke liye.',
      },
      {
        task: 'Take a page with three images and give each one appropriate alt text: one decorative, one informative, one inside a link.',
        taskHi: 'Teen images wala page lo aur har ek ko theek alt text do: ek sajawat wali, ek jaankari wali, aur ek link ke andar wali.',
        hint: 'Decorative gets `alt=""`. The one inside a link should describe the destination, not the picture.',
        hintHi: 'Sajawat wali ko `alt=""`. Link ke andar wali manzil batayegi, tasveer nahi.',
      },
      {
        task: 'Rewrite a set of links that all say "click here" so each one describes its own destination. Then read only the link texts aloud and check they still make sense.',
        taskHi: 'Aise links jo sab "click here" kehte hain, unhe aise likho ki har ek apni manzil bataye. Phir sirf link ke texts zor se padho aur dekho ki matlab bana rehta hai.',
        hint: 'Reading only the link text is exactly what a screen reader user does when listing links on a page.',
        hintHi: 'Sirf link ka text padhna bilkul wahi hai jo screen reader user page ke links list karte waqt karta hai.',
      },
    ],

    keyTakeaways: [
      '`strong`/`em` carry meaning; `b`/`i` are appearance only — pick by what you mean.',
      'Every meaningful image needs `alt` describing what it conveys; `alt=""` only for decoration.',
      'Set `width` and `height` on images to reserve space and stop the page jumping.',
      'Link text must make sense read on its own — never "click here".',
      '`target="_blank"` should always carry `rel="noopener"`.',
      'If it navigates it is an `<a>`; if it performs an action it is a `<button>`.',
    ],
    keyTakeawaysHi: [
      '`strong`/`em` matlab rakhte hain; `b`/`i` sirf dikhawa — jo kehna hai usse chuno.',
      'Har matlab wali image ko `alt` chahiye jo bataye wo kya keh rahi hai; `alt=""` sirf sajawat ke liye.',
      'Images par `width` aur `height` do taaki jagah reserve ho aur page na uchhle.',
      'Link ka text akele padhne par bhi samajh aana chahiye — "click here" kabhi nahi.',
      '`target="_blank"` ke saath hamesha `rel="noopener"` hona chahiye.',
      'Navigate kare to `<a>`; koi kaam kare to `<button>`.',
    ],
  },

  /* ══════════════════════ Forms ══════════════════════ */
  {
    slug: 'html-forms',
    title: 'Forms and Inputs',
    titleHi: 'Forms aur Inputs',
    description: 'A paper form at a counter — and the one tag that decides whether the clerk knows which box is which.',
    descriptionHi: 'Counter par rakha kaagaz ka form — aur wo ek tag jo tay karta hai ki clerk ko pata chale kaunsa box kis ka hai.',
    difficulty: 'MEDIUM',
    duration: 32,
    order: 3,

    analogy: {
      en: '**A paper form at a government counter.** Every box has a printed label beside it, otherwise nobody knows what to write. The clerk needs each box to have a name so the answers can be filed. And whatever you write, the clerk still checks it — because people write anything.',
      hi: '**Sarkari counter par rakha kaagaz ka form.** Har box ke bagal mein label chhapa hota hai, warna kisi ko pata hi nahi chalega kya likhna hai. Clerk ko har box ka naam chahiye taaki jawab file ho sakein. Aur aap jo bhi likho, clerk phir bhi jaanchta hai — kyunki log kuch bhi likh dete hain.',
    },

    simple: `**A form collects answers and sends them somewhere.**

\`\`\`html
<form action="/subscribe" method="post">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  <button type="submit">Subscribe</button>
</form>
\`\`\`

Four parts, and each one matters:

- **\`<form>\`** — the container. \`action\` is where answers go, \`method\` is how.
- **\`<label for="...">\`** — the printed text beside the box.
- **\`<input name="...">\`** — the box. **No \`name\`, no data sent.**
- **\`<button type="submit">\`** — sends it.

**The label is not decoration**

\`\`\`html
<label for="email">Email</label>
<input id="email" ...>
\`\`\`

The \`for\` must match the input's \`id\`. When they match you get three things at once:

1. Clicking the label focuses the input — a much bigger tap target on a phone
2. Screen readers announce "Email, edit text" instead of just "edit text"
3. Checkboxes become far easier to hit

Placeholder text is **not** a label. It disappears the moment you type, so the user forgets what the field was for.

**Input types do real work**

\`\`\`html
<input type="text">       <!-- anything -->
<input type="email">      <!-- validates the shape, @ keyboard on mobile -->
<input type="tel">        <!-- numeric keypad on mobile -->
<input type="number" min="1" max="10">
<input type="password">   <!-- masked -->
<input type="date">       <!-- native date picker -->
<input type="checkbox">
<input type="radio" name="size">   <!-- same name = one choice -->
\`\`\`

Using \`type="email"\` gives you validation, an appropriate mobile keyboard and accessibility for free. \`type="text"\` for an email field throws all three away.

**Radios need the same name**

\`\`\`html
<input type="radio" name="size" value="s"> Small
<input type="radio" name="size" value="m"> Medium
\`\`\`

Same \`name\` means "these are one choice". Different names means each becomes an independent toggle — a very common bug.

**Validation you get for free**

\`\`\`html
<input type="email" required minlength="5">
\`\`\`

The browser blocks submission, shows a message in the user's language and moves focus to the bad field. All of it, with no JavaScript.

**But** — the user can delete your validation in devtools in five seconds. Browser validation is politeness. **The server must check everything again.**

**Remember:** every input needs a \`label\` and a \`name\`. Use the right \`type\`. Never trust the browser's check.`,

    simpleHi: `**Form jawab jama karta hai aur unhe kahin bhejta hai.**

\`\`\`html
<form action="/subscribe" method="post">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  <button type="submit">Subscribe</button>
</form>
\`\`\`

Chaar hisse, aur har ek zaroori hai:

- **\`<form>\`** — dabba. \`action\` batata hai jawab kahan jayenge, \`method\` kaise.
- **\`<label for="...">\`** — box ke bagal likha text.
- **\`<input name="...">\`** — box. **\`name\` nahi to data jayega hi nahi.**
- **\`<button type="submit">\`** — bhejta hai.

**Label sajawat nahi hai**

\`\`\`html
<label for="email">Email</label>
<input id="email" ...>
\`\`\`

\`for\` input ki \`id\` se match hona chahiye. Match hote hi teen cheezein ek saath milti hain:

1. Label par click karne se input focus ho jata hai — phone par bahut bada tap target
2. Screen reader "Email, edit text" bolta hai, sirf "edit text" nahi
3. Checkboxes dabana bahut aasan ho jata hai

Placeholder text label **nahi** hai. Type karte hi wo gayab ho jata hai, aur user bhool jata hai ki field kis liye thi.

**Input types sach mein kaam karte hain**

\`\`\`html
<input type="text">       <!-- kuch bhi -->
<input type="email">      <!-- shape jaanchta hai, mobile par @ wala keyboard -->
<input type="tel">        <!-- mobile par numeric keypad -->
<input type="number" min="1" max="10">
<input type="password">   <!-- chhupa hua -->
<input type="date">       <!-- native date picker -->
<input type="checkbox">
<input type="radio" name="size">   <!-- ek hi name = ek chunav -->
\`\`\`

\`type="email"\` se validation, sahi mobile keyboard aur accessibility teeno muft mein milte hain. Email field par \`type="text"\` teeno phenk deta hai.

**Radios ko ek hi name chahiye**

\`\`\`html
<input type="radio" name="size" value="s"> Small
<input type="radio" name="size" value="m"> Medium
\`\`\`

Ek hi \`name\` matlab "ye ek hi chunav hain". Alag naam matlab har ek alag toggle ban jata hai — bahut aam bug.

**Muft milne wali validation**

\`\`\`html
<input type="email" required minlength="5">
\`\`\`

Browser submit rok deta hai, user ki bhasha mein message dikhata hai aur focus galat field par le jata hai. Ye sab, bina kisi JavaScript ke.

**Par** — user devtools mein paanch second mein aapki validation mita sakta hai. Browser validation shishtachar hai. **Server ko sab dobara jaanchna hi hai.**

**Yaad rakho:** har input ko \`label\` aur \`name\` chahiye. Sahi \`type\` use karo. Browser ke check par kabhi bharosa mat karo.`,

    content: `## Every way to label an input

\`\`\`html
<!-- 1. for + id — the usual way -->
<label for="name">Name</label>
<input id="name" name="name">

<!-- 2. wrapping — no ids needed -->
<label>Name <input name="name"></label>

<!-- 3. aria-label — only when a visible label is impossible -->
<input name="q" aria-label="Search">
\`\`\`

The third is a last resort — a visible label helps everyone, not only screen reader users.

## Grouping

\`\`\`html
<fieldset>
  <legend>Delivery speed</legend>
  <label><input type="radio" name="speed" value="std"> Standard</label>
  <label><input type="radio" name="speed" value="exp"> Express</label>
</fieldset>
\`\`\`

\`legend\` is announced before each option, so the user hears "Delivery speed, Standard, radio button" rather than a bare "Standard".

## Other controls

\`\`\`html
<textarea name="msg" rows="4"></textarea>       <!-- note: no value attribute -->

<select name="city">
  <option value="">Choose…</option>
  <option value="pune">Pune</option>
</select>

<input list="cities" name="city">               <!-- free text with suggestions -->
<datalist id="cities"><option value="Pune"></datalist>
\`\`\`

A \`<textarea>\` takes its value from its content, not from a \`value\` attribute — so whitespace inside the tags becomes part of the value.

## Built-in validation

\`\`\`html
<input required>
<input type="email">
<input minlength="8" maxlength="20">
<input type="number" min="1" max="99" step="1">
<input pattern="[0-9]{6}" title="Six digits">
\`\`\`

\`title\` supplies the message shown when \`pattern\` fails, so always write one.

## Autocomplete is an accessibility feature

\`\`\`html
<input name="email" autocomplete="email">
<input name="phone" autocomplete="tel">
<input name="card" autocomplete="cc-number">
\`\`\`

Correct \`autocomplete\` values let the browser fill fields for users with motor or cognitive difficulties. It is required by WCAG 2.1, not merely a convenience.

## Buttons inside a form

\`\`\`html
<button type="submit">Save</button>
<button type="button">Cancel</button>    <!-- without type it SUBMITS -->
<button type="reset">Clear</button>
\`\`\`

A \`<button>\` inside a form defaults to \`type="submit"\`. A "Cancel" button without \`type="button"\` will submit the form — a bug that appears in real products regularly.

## The rule underneath all of it

Client-side validation exists to give fast feedback. It is trivially bypassed by disabling JavaScript, editing the DOM, or posting straight to your API. **Every constraint must be enforced again on the server.**`,

    contentHi: `## Input ko label karne ke saare tarike

\`\`\`html
<!-- 1. for + id — aam tarika -->
<label for="name">Naam</label>
<input id="name" name="name">

<!-- 2. lapet kar — id ki zarurat nahi -->
<label>Naam <input name="name"></label>

<!-- 3. aria-label — sirf jab dikhne wala label sambhav hi na ho -->
<input name="q" aria-label="Search">
\`\`\`

Teesra aakhri vikalp hai — dikhne wala label sabki madad karta hai, sirf screen reader users ki nahi.

## Grouping

\`\`\`html
<fieldset>
  <legend>Delivery speed</legend>
  <label><input type="radio" name="speed" value="std"> Standard</label>
  <label><input type="radio" name="speed" value="exp"> Express</label>
</fieldset>
\`\`\`

\`legend\` har option se pehle bola jata hai, isliye user "Delivery speed, Standard, radio button" sunta hai, sirf "Standard" nahi.

## Doosre controls

\`\`\`html
<textarea name="msg" rows="4"></textarea>       <!-- dhyan do: value attribute nahi -->

<select name="city">
  <option value="">Chuno…</option>
  <option value="pune">Pune</option>
</select>

<input list="cities" name="city">               <!-- free text, sujhav ke saath -->
<datalist id="cities"><option value="Pune"></datalist>
\`\`\`

\`<textarea>\` apni value content se leta hai, \`value\` attribute se nahi — isliye tags ke andar ka whitespace bhi value ka hissa ban jata hai.

## Built-in validation

\`\`\`html
<input required>
<input type="email">
<input minlength="8" maxlength="20">
<input type="number" min="1" max="99" step="1">
<input pattern="[0-9]{6}" title="Chhe ank">
\`\`\`

\`pattern\` fail hone par jo message dikhta hai wo \`title\` se aata hai, isliye use hamesha likho.

## Autocomplete ek accessibility feature hai

\`\`\`html
<input name="email" autocomplete="email">
<input name="phone" autocomplete="tel">
<input name="card" autocomplete="cc-number">
\`\`\`

Sahi \`autocomplete\` values browser ko un users ke liye fields bharne deti hain jinhe motor ya cognitive dikkat hai. Ye WCAG 2.1 mein zaroori hai, sirf sahulat nahi.

## Form ke andar buttons

\`\`\`html
<button type="submit">Save</button>
<button type="button">Cancel</button>    <!-- bina type ke ye SUBMIT karega -->
<button type="reset">Clear</button>
\`\`\`

Form ke andar \`<button>\` ka default \`type="submit"\` hota hai. Bina \`type="button"\` wala "Cancel" button form submit kar dega — asli products mein ye bug baar-baar dikhta hai.

## Sabse neeche wala rule

Client-side validation tez feedback dene ke liye hai. JavaScript band karke, DOM badalkar, ya seedhe aapke API par post karke usse aasani se paar kiya ja sakta hai. **Har rule server par dobara lagana hi padta hai.**`,

    examples: [
      {
        title: 'A minimal working form',
        titleHi: 'Ek chhota chalta hua form',
        code: `<form action="/subscribe" method="post">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  <button type="submit">Subscribe</button>
</form>`,
        preview: page(`<form>
  <label for="email" style="display:block;margin-bottom:4px">Email</label>
  <input type="email" id="email" name="email" required style="padding:6px;width:200px">
  <button type="submit" style="padding:6px 12px;margin-left:6px">Subscribe</button>
</form>`),
        previewHeight: 130,
        explain: 'Try clicking the word "Email" — the cursor jumps into the box. That is the `for`/`id` pair working, and it makes the tap target far larger on a phone.',
        explainHi: '"Email" shabd par click karke dekho — cursor box mein pahunch jata hai. Ye `for`/`id` ki jodi ka kaam hai, aur phone par isse tap target bahut bada ho jata hai.',
      },
      {
        title: 'No name means no data',
        titleHi: 'name nahi to data nahi',
        code: `<input id="a" name="a" value="sent">
<input id="b" value="never sent">   <!-- no name -->
<input id="c" name="c" value="also lost" disabled>`,
        preview: page(`<form>
  <p><input value="sent" readonly style="padding:5px"> has a name → submitted</p>
  <p><input value="never sent" readonly style="padding:5px;border-color:#ef4444"> no name → skipped</p>
  <p><input value="also lost" readonly disabled style="padding:5px"> disabled → skipped</p>
</form>
<p style="font-size:13px;color:#666">Server receives only the first one. Neither omission warns you.</p>`),
        previewHeight: 220,
        explain: 'Two silent ways to lose a field: forgetting `name`, and marking it `disabled`. If a value must still be submitted but not edited, use `readonly` instead of `disabled`.',
        explainHi: 'Field khone ke do chup-chaap tarike: `name` bhoolna, aur usse `disabled` karna. Agar value submit to honi hai par edit nahi, to `disabled` ke bajaye `readonly` use karo.',
      },
      {
        title: 'The right type changes the keyboard',
        titleHi: 'Sahi type keyboard badal deta hai',
        code: `<input type="text">    <!-- full keyboard -->
<input type="email">   <!-- keyboard with @ and . -->
<input type="tel">     <!-- numeric keypad -->
<input type="number">  <!-- numeric with spinners -->`,
        preview: page(`<p><label>text <input type="text" style="padding:5px"></label></p>
<p><label>email <input type="email" style="padding:5px"></label></p>
<p><label>tel <input type="tel" style="padding:5px"></label></p>
<p><label>number <input type="number" min="1" max="10" style="padding:5px"></label></p>
<p style="font-size:13px;color:#666">On a phone each of these opens a different keyboard. Try the number spinners here.</p>`),
        previewHeight: 250,
        explain: 'On a desktop the difference looks small. On a phone, `type="tel"` gives a big numeric keypad instead of a cramped alphabet — a real usability gain for the cost of four characters.',
        explainHi: 'Desktop par fark chhota lagta hai. Phone par `type="tel"` tang alphabet ke bajaye bada numeric keypad deta hai — chaar characters ke badle asli fayda.',
      },
      {
        title: 'Built-in validation, no JavaScript',
        titleHi: 'Built-in validation, bina JavaScript',
        code: `<form>
  <input type="email" required placeholder="try submitting empty">
  <button>Submit</button>
</form>`,
        preview: page(`<form>
  <input type="email" required placeholder="try submitting empty" style="padding:6px;width:220px">
  <button style="padding:6px 12px">Submit</button>
</form>
<p style="font-size:13px;color:#666;margin-top:10px">
Press Submit with the box empty, then with "abc" in it. Two different messages, both from the browser, both translated automatically.</p>`),
        previewHeight: 180,
        explain: 'You wrote no validation code. The browser blocks submission, writes the message in the user\'s language and moves focus to the offending field — all of which you would otherwise have to build.',
        explainHi: 'Aapne koi validation code likha hi nahi. Browser submit rokta hai, message user ki bhasha mein likhta hai aur focus galat field par le jata hai — ye sab warna aapko khud banana padta.',
      },
      {
        title: 'Radios: the same name is the whole trick',
        titleHi: 'Radios: ek hi name hi poora khel hai',
        code: `<!-- ✅ one choice -->
<input type="radio" name="size" value="s"> Small
<input type="radio" name="size" value="m"> Medium

<!-- ❌ two independent toggles -->
<input type="radio" name="a" value="s"> Small
<input type="radio" name="b" value="m"> Medium`,
        preview: page(`<fieldset style="border:2px solid #10b981;margin-bottom:10px">
  <legend style="font-size:13px">Same name — try selecting both</legend>
  <label><input type="radio" name="size" value="s"> Small</label>
  <label style="margin-left:10px"><input type="radio" name="size" value="m"> Medium</label>
</fieldset>
<fieldset style="border:2px solid #ef4444">
  <legend style="font-size:13px">Different names — both stay selected</legend>
  <label><input type="radio" name="a"> Small</label>
  <label style="margin-left:10px"><input type="radio" name="b"> Medium</label>
</fieldset>`),
        previewHeight: 220,
        explain: 'Click both options in each group. In the first only one can be chosen; in the second both stick, and once a radio is selected it cannot be unselected — a genuinely stuck form.',
        explainHi: 'Dono groups mein dono options par click karke dekho. Pehle mein sirf ek chunta hai; doosre mein dono lag jate hain, aur radio ek baar chun jaye to hat bhi nahi sakta — form sach mein atak jata hai.',
      },
      {
        title: 'fieldset and legend group related controls',
        titleHi: 'fieldset aur legend sambandhit controls jodte hain',
        code: `<fieldset>
  <legend>Delivery speed</legend>
  <label><input type="radio" name="speed"> Standard</label>
  <label><input type="radio" name="speed"> Express</label>
</fieldset>`,
        preview: page(`<fieldset>
  <legend>Delivery speed</legend>
  <label style="display:block"><input type="radio" name="speed"> Standard (5 days)</label>
  <label style="display:block"><input type="radio" name="speed"> Express (1 day)</label>
</fieldset>
<p style="font-size:13px;color:#666;margin-top:10px">
A screen reader reads "Delivery speed, Standard, radio button 1 of 2" — the legend gives the options context.</p>`),
        previewHeight: 210,
        explain: 'Without the `fieldset`, a screen reader user hears "Standard" with no idea what it refers to. The visible border is a bonus; the announced grouping is the point.',
        explainHi: 'Bina `fieldset` ke screen reader user sirf "Standard" sunta hai aur pata hi nahi chalta kis baare mein. Dikhne wala border bonus hai; asli baat wo grouping hai jo boli jati hai.',
      },
      {
        title: 'Placeholder is not a label',
        titleHi: 'Placeholder label nahi hai',
        code: `<!-- ❌ label vanishes as soon as you type -->
<input placeholder="Email">

<!-- ✅ label stays visible -->
<label for="e">Email</label>
<input id="e" placeholder="you@example.com">`,
        preview: page(`<p style="font-size:13px;color:#666">Type in both boxes and watch what disappears:</p>
<p><input placeholder="Email" style="padding:6px;width:200px;border:2px solid #ef4444"></p>
<p>
  <label for="e" style="display:block;margin-bottom:3px">Email</label>
  <input id="e" placeholder="you@example.com" style="padding:6px;width:200px;border:2px solid #10b981">
</p>`),
        previewHeight: 210,
        explain: 'Type in the first box and the word "Email" is gone — on a long form the user can no longer tell what any field was for. Placeholders are for examples of the format, never for the label.',
        explainHi: 'Pehle box mein type karo aur "Email" gayab. Lambe form par user ko phir pata hi nahi chalta ki kaunsi field kis liye thi. Placeholder format ka udaharan dene ke liye hai, label ke liye kabhi nahi.',
      },
      {
        title: 'The Cancel button that submits',
        titleHi: 'Wo Cancel button jo submit kar deta hai',
        code: `<form>
  <button>Save</button>
  <button>Cancel</button>          <!-- ❌ also submits -->
  <button type="button">Cancel</button>  <!-- ✅ -->
</form>`,
        preview: page(`<form onsubmit="return false">
  <button style="padding:6px 12px">Save</button>
  <button style="padding:6px 12px;border-color:#ef4444">Cancel (no type — submits!)</button>
  <button type="button" style="padding:6px 12px;border-color:#10b981">Cancel (type=button)</button>
</form>
<p style="font-size:13px;color:#666;margin-top:10px">
Inside a form, a button with no type defaults to type="submit".</p>`),
        previewHeight: 180,
        explain: 'The default type of a `<button>` inside a form is `submit`, not `button`. A Cancel control that quietly saves the form is a bug that ships regularly.',
        explainHi: 'Form ke andar `<button>` ka default type `submit` hota hai, `button` nahi. Aisa Cancel jo chup-chaap form save kar de, wo bug asli products mein baar-baar jata hai.',
      },
      {
        title: 'A complete, accessible form',
        titleHi: 'Ek poora, accessible form',
        code: `<form action="/signup" method="post">
  <label for="name">Full name</label>
  <input id="name" name="name" autocomplete="name" required>

  <label for="email">Email</label>
  <input type="email" id="email" name="email"
         autocomplete="email" required>

  <fieldset>
    <legend>Plan</legend>
    <label><input type="radio" name="plan" value="free" checked> Free</label>
    <label><input type="radio" name="plan" value="pro"> Pro</label>
  </fieldset>

  <button type="submit">Create account</button>
</form>`,
        preview: page(`<form onsubmit="return false">
  <p><label for="n" style="display:block">Full name</label>
     <input id="n" name="name" required style="padding:6px;width:220px"></p>
  <p><label for="e2" style="display:block">Email</label>
     <input type="email" id="e2" name="email" required style="padding:6px;width:220px"></p>
  <fieldset style="margin-bottom:10px">
    <legend>Plan</legend>
    <label><input type="radio" name="plan" checked> Free</label>
    <label style="margin-left:10px"><input type="radio" name="plan"> Pro</label>
  </fieldset>
  <button style="padding:7px 14px">Create account</button>
</form>`),
        previewHeight: 300,
        explain: 'Every input has a label and a name, the types are correct, the radios share a name and sit in a labelled fieldset, and `autocomplete` lets the browser fill it. Zero JavaScript so far.',
        explainHi: 'Har input ka label aur name hai, types sahi hain, radios ek naam share karte hain aur label wale fieldset mein hain, aur `autocomplete` browser ko bharne deta hai. Ab tak zero JavaScript.',
      },
    ],

    mistakes: [
      {
        wrong: `<input type="text" placeholder="Email">`,
        right: `<label for="e">Email</label>
<input type="email" id="e" name="email">`,
        previewWrong: page(`<input placeholder="Email" style="padding:6px;width:200px;border:2px solid #ef4444"><p style="font-size:12px;color:#666">Type here — the only hint vanishes.</p>`),
        previewRight: page(`<label for="e" style="display:block">Email</label><input type="email" id="e" style="padding:6px;width:200px;border:2px solid #10b981"><p style="font-size:12px;color:#666">Label stays. Type is correct.</p>`),
        previewHeight: 150,
        why: 'A placeholder disappears on input, leaving the user guessing on a long form, and `type="text"` throws away validation and the mobile keyboard.',
        whyHi: 'Placeholder type karte hi gayab ho jata hai aur lambe form par user andaza lagata rehta hai, aur `type="text"` validation aur mobile keyboard dono phenk deta hai.',
      },
      {
        wrong: `<input type="radio" name="a"> Small
<input type="radio" name="b"> Medium`,
        right: `<input type="radio" name="size" value="s"> Small
<input type="radio" name="size" value="m"> Medium`,
        why: 'Radios group by `name`. Different names make each one an independent toggle that, once selected, cannot be cleared.',
        whyHi: 'Radios `name` se group hote hain. Alag naam har ek ko alag toggle bana dete hain jo ek baar chunne ke baad hat bhi nahi sakta.',
      },
      {
        wrong: `<form>
  <button>Save</button>
  <button>Cancel</button>
</form>`,
        right: `<form>
  <button type="submit">Save</button>
  <button type="button">Cancel</button>
</form>`,
        why: 'A `<button>` inside a form defaults to `type="submit"`, so Cancel submits the form instead of cancelling.',
        whyHi: 'Form ke andar `<button>` ka default `type="submit"` hota hai, isliye Cancel form cancel karne ke bajaye submit kar deta hai.',
      },
      {
        wrong: `<input name="total" value="100" disabled>`,
        right: `<input name="total" value="100" readonly>`,
        why: 'A `disabled` field is not submitted at all — its value silently disappears from the request. `readonly` prevents editing while still sending the value.',
        whyHi: '`disabled` field submit hoti hi nahi — uski value chup-chaap request se gayab ho jati hai. `readonly` edit rokta hai par value bhejta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every signup and checkout.** Correct `type` and `autocomplete` values measurably increase completion rates, because the browser fills half the form for the user.',
        hi: '**Har signup aur checkout.** Sahi `type` aur `autocomplete` values completion rate naap kar badhati hain, kyunki browser aadha form user ke liye bhar deta hai.',
      },
      {
        en: '**React forms.** `<label htmlFor>` in JSX is exactly this `for` attribute. Every form library is built on these native elements — it does not replace them.',
        hi: '**React forms.** JSX ka `<label htmlFor>` bilkul yahi `for` attribute hai. Har form library inhi native elements par bani hai — unki jagah nahi leti.',
      },
      {
        en: '**Search boxes.** A search field with no label is one of the most common accessibility failures found in audits — `aria-label="Search"` is the minimum fix.',
        hi: '**Search boxes.** Bina label wali search field audits mein milne wali sabse aam accessibility chook hai — `aria-label="Search"` sabse kam ilaaj hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why must every input have a label?',
        qHi: 'Har input ko label kyun chahiye?',
        a: 'A correctly associated label gives the accessible name a screen reader announces, and makes the label text a click target that focuses the input — a significant usability gain on touch devices. Associate it with matching `for` and `id`, or by wrapping the input inside the label.',
        aHi: 'Theek se juda label wo accessible naam deta hai jo screen reader bolta hai, aur label ke text ko click target bana deta hai jo input ko focus karta hai — touch devices par ye bada fayda hai. Use `for` aur `id` match karke jodo, ya input ko label ke andar lapet kar.',
      },
      {
        q: 'Why is a placeholder not a substitute for a label?',
        qHi: 'Placeholder label ki jagah kyun nahi le sakta?',
        a: 'It disappears as soon as the user types, so on a long form they can no longer tell what a filled field was for. Placeholder text also typically has low contrast, and some assistive technology does not announce it. Use it for an example of the expected format, alongside a real label.',
        aHi: 'User ke type karte hi wo gayab ho jata hai, isliye lambe form par pata hi nahi chalta ki bhari hui field kis liye thi. Placeholder text ka contrast bhi aksar kam hota hai, aur kuch assistive technology use padhti hi nahi. Use asli label ke saath, expected format ka udaharan dene ke liye rakho.',
      },
      {
        q: 'What is the difference between `disabled` and `readonly`?',
        qHi: '`disabled` aur `readonly` mein kya fark hai?',
        a: '`readonly` prevents editing but the field remains focusable and its value is submitted. `disabled` prevents all interaction, removes the field from the submitted data entirely, and excludes it from constraint validation. If a value must reach the server but not be edited, use `readonly`.',
        aHi: '`readonly` edit rokta hai par field focus hoti hai aur uski value submit hoti hai. `disabled` har interaction rokta hai, field ko submit hone wale data se poori tarah hata deta hai, aur constraint validation se bhi bahar rakhta hai. Value server tak jani hai par edit nahi honi, to `readonly` use karo.',
      },
      {
        q: 'Why is client-side validation not enough?',
        qHi: 'Client-side validation kaafi kyun nahi hai?',
        a: 'Everything in the browser is under the user\'s control — they can edit the DOM, set `form.noValidate`, disable JavaScript, or bypass the page entirely and post directly to the API. Browser validation is a user-experience feature that gives fast feedback; only server-side checks actually enforce a rule.',
        aHi: 'Browser ka sab kuch user ke kabze mein hai — wo DOM badal sakte hain, `form.noValidate` set kar sakte hain, JavaScript band kar sakte hain, ya page chhod kar seedhe API par post kar sakte hain. Browser validation ek user-experience feature hai jo tez feedback deta hai; rule sirf server-side checks lagu karte hain.',
      },
      {
        q: 'How do radio buttons form a group?',
        qHi: 'Radio buttons group kaise bante hain?',
        a: 'By sharing the same `name` attribute. Radios with the same name are mutually exclusive and submit a single value. Give them different names and each becomes an independent control that, once checked, cannot be unchecked by the user.',
        aHi: 'Ek hi `name` attribute share karke. Ek naam wale radios aapas mein exclusive hote hain aur ek hi value submit karte hain. Alag naam do to har ek alag control ban jata hai jo ek baar check hone ke baad user hata bhi nahi sakta.',
      },
    ],

    exercises: [
      {
        task: 'Build a signup form with name, email, password and a plan choice using radios. Every input must have a visible label and a `name`, and the radios must share one name.',
        taskHi: 'Ek signup form banao jisme naam, email, password aur radios se plan chunav ho. Har input ka dikhne wala label aur `name` ho, aur radios ek hi naam share karein.',
        hint: 'Put the radios in a `<fieldset>` with a `<legend>` so screen readers announce what the choice is about.',
        hintHi: 'Radios ko `<legend>` wale `<fieldset>` mein rakho taaki screen reader bataye ki chunav kis baare mein hai.',
      },
      {
        task: 'Add `required`, `type="email"` and `minlength="8"` and submit the form empty. Note that you wrote no validation code at all.',
        taskHi: '`required`, `type="email"` aur `minlength="8"` lagao aur khaali form submit karo. Dhyan do ki aapne koi validation code likha hi nahi.',
        hint: 'Try it in two browsers — the wording differs, and both translate automatically to the user\'s language.',
        hintHi: 'Do browsers mein try karo — shabd alag honge, aur dono apne aap user ki bhasha mein badal jate hain.',
      },
      {
        task: 'Take a form and deliberately remove one `name`, disable another field, and leave a Cancel button without `type`. Submit it and work out what went wrong from the result alone.',
        taskHi: 'Ek form lo aur jaan-boojhkar ek `name` hatao, ek field disable karo, aur Cancel button par `type` mat lagao. Submit karo aur sirf nateeje se pata lagao kya galat hua.',
        hint: 'Two fields will be missing from the data and Cancel will submit. None of the three produces a warning — that is the lesson.',
        hintHi: 'Do fields data se gayab hongi aur Cancel submit kar dega. Teeno mein se koi warning nahi deta — yahi seekhne wali baat hai.',
      },
    ],

    keyTakeaways: [
      'Every input needs a `label` (matching `for`/`id`) and a `name` — no `name` means no data sent.',
      'A placeholder is not a label; it disappears the moment the user types.',
      'The right `type` gives validation, the correct mobile keyboard and accessibility for free.',
      'Radios group by sharing one `name`; different names make them independent and unclearable.',
      'A `<button>` in a form defaults to `type="submit"` — Cancel needs `type="button"`.',
      '`disabled` fields are not submitted at all; use `readonly` when the value must still be sent.',
    ],
    keyTakeawaysHi: [
      'Har input ko `label` (match karta `for`/`id`) aur `name` chahiye — `name` nahi to data nahi jayega.',
      'Placeholder label nahi hai; user ke type karte hi wo gayab ho jata hai.',
      'Sahi `type` se validation, sahi mobile keyboard aur accessibility muft mein milte hain.',
      'Radios ek `name` share karke group bante hain; alag naam unhe alag aur na-hatne-yogya bana dete hain.',
      'Form ke andar `<button>` ka default `type="submit"` hai — Cancel ko `type="button"` chahiye.',
      '`disabled` fields submit hoti hi nahi; value bhejni ho to `readonly` use karo.',
    ],
  },

  /* ══════════════ Semantic HTML & Accessibility ══════════════ */
  {
    slug: 'html-semantic-accessibility',
    title: 'Semantic HTML and Accessibility',
    titleHi: 'Semantic HTML aur Accessibility',
    description: 'Labelled rooms versus a warehouse of identical boxes — and navigating your page with the screen switched off.',
    descriptionHi: 'Label wale kamre versus ek jaise dabbon ka godaam — aur aapka page band screen ke saath chalana.',
    difficulty: 'MEDIUM',
    duration: 34,
    order: 4,

    analogy: {
      en: '**A house with labelled rooms.** A sighted visitor glances around and knows the kitchen from the bedroom. Now imagine navigating that house blindfolded. If every room is an identical unmarked box, you are lost. If each door says "kitchen", "bedroom", "exit", you can move confidently. `<div>` is an unmarked box. `<nav>`, `<main>` and `<footer>` are labelled doors.',
      hi: '**Label wale kamron wala ghar.** Dekh sakne wala mehmaan ek nazar mein kitchen aur bedroom pehchan leta hai. Ab socho aankhon par patti baandh kar usi ghar mein chalna. Agar har kamra ek jaisa bina-naam ka dabba hai, to aap kho gaye. Agar har darwaze par "kitchen", "bedroom", "bahar ka rasta" likha hai, to aap bharose se chal sakte ho. `<div>` bina-naam ka dabba hai. `<nav>`, `<main>` aur `<footer>` label wale darwaze hain.',
    },

    simple: `**Two pages that look identical**

\`\`\`html
<!-- Version A -->
<div class="header">
  <div class="nav">…</div>
</div>
<div class="content">…</div>
<div class="footer">…</div>

<!-- Version B -->
<header>
  <nav>…</nav>
</header>
<main>…</main>
<footer>…</footer>
\`\`\`

On screen they are the same. To a screen reader, version A is three unmarked boxes. Version B announces "navigation", "main", "footer" — and lets the user jump straight to any of them.

**The tags worth knowing**

\`\`\`html
<header>    top of the page or of a section
<nav>       a set of navigation links
<main>      the main content — ONE per page
<article>   something that makes sense on its own
<section>   a thematic group, normally with a heading
<aside>     related but separate: a sidebar
<footer>    bottom of the page or of a section
\`\`\`

**Keyboard access is the fastest thing to test**

Press Tab. The focus should move through every interactive element in a sensible order, and you should always be able to *see* where it is.

\`\`\`css
:focus-visible { outline: 2px solid blue; }   /* ✅ */
*:focus { outline: none; }                     /* ❌ never do this */
\`\`\`

Removing focus outlines makes a page completely unusable for anyone navigating by keyboard. If the default ring is ugly, style it — do not delete it.

**Use the right element and you get behaviour for free**

\`\`\`html
<div onclick="save()">Save</div>     <!-- ❌ -->
<button onclick="save()">Save</button>  <!-- ✅ -->
\`\`\`

The \`<button>\` is focusable, works with Enter and Space, announces itself as a button, and can be disabled. Recreating all of that on a \`<div>\` takes about fifteen lines — and people always forget one.

**Colour alone is never enough**

About one man in twelve has some colour blindness. If red text is your only signal that a field is wrong, those users see nothing. Add an icon, a message or a border style as well.

**Three checks anyone can do today**

1. **Tab through the page.** Can you reach and see everything?
2. **Zoom to 200%.** Does the text reflow or does it get cut off?
3. **Turn the images off.** Does the alt text still explain the page?

**Remember:** the right tag gives you accessibility for free. Only reach for ARIA when no correct tag exists.`,

    simpleHi: `**Do pages jo bilkul ek jaise dikhte hain**

\`\`\`html
<!-- Version A -->
<div class="header">
  <div class="nav">…</div>
</div>
<div class="content">…</div>
<div class="footer">…</div>

<!-- Version B -->
<header>
  <nav>…</nav>
</header>
<main>…</main>
<footer>…</footer>
\`\`\`

Screen par dono same hain. Screen reader ke liye version A teen bina-naam ke dabbe hain. Version B "navigation", "main", "footer" bolta hai — aur user ko seedhe kisi bhi hisse par kood jaane deta hai.

**Jaanne layak tags**

\`\`\`html
<header>    page ya section ka upari hissa
<nav>       navigation links ka samooh
<main>      mukhya content — har page mein EK
<article>   aisi cheez jo akele bhi samajh aaye
<section>   ek vishay ka samooh, aksar heading ke saath
<aside>     juda par alag: sidebar
<footer>    page ya section ka nichla hissa
\`\`\`

**Keyboard access sabse jaldi test hone wali cheez hai**

Tab dabao. Focus har interactive element par samajhdaar kram mein jana chahiye, aur aapko hamesha *dikhna* chahiye ki wo kahan hai.

\`\`\`css
:focus-visible { outline: 2px solid blue; }   /* ✅ */
*:focus { outline: none; }                     /* ❌ ye kabhi mat karo */
\`\`\`

Focus outline hataane se page keyboard se chalne wale kisi bhi vyakti ke liye poori tarah bekaar ho jata hai. Default ring bhaddi lagti hai to usse style karo — mitao mat.

**Sahi element use karo aur behaviour muft mein milta hai**

\`\`\`html
<div onclick="save()">Save</div>     <!-- ❌ -->
<button onclick="save()">Save</button>  <!-- ✅ -->
\`\`\`

\`<button>\` focus hota hai, Enter aur Space se chalta hai, khud ko button batata hai, aur disable ho sakta hai. Ye sab \`<div>\` par dobara banane mein pandrah lines lagti hain — aur ek na ek chhoot hi jati hai.

**Sirf rang kabhi kaafi nahi hota**

Lagbhag baarah mein se ek purush ko kuch na kuch colour blindness hoti hai. Agar field galat hone ka aapka ekmatra ishara laal text hai, to un users ko kuch dikhta hi nahi. Saath mein icon, message ya border style bhi do.

**Teen jaanchein jo koi bhi aaj kar sakta hai**

1. **Page par Tab chalao.** Har cheez tak pahunch aur dikh rahi hai?
2. **200% zoom karo.** Text dobara jamta hai ya kat jata hai?
3. **Images band karo.** Alt text se page ab bhi samajh aata hai?

**Yaad rakho:** sahi tag accessibility muft mein deta hai. ARIA sirf tab lo jab koi sahi tag hai hi nahi.`,

    content: `## Landmarks and how they are used

Screen readers can list every landmark and jump between them, which is how a blind user skips a navigation bar they have already heard on ten pages.

\`\`\`html
<header>
  <nav aria-label="Main">…</nav>
</header>
<main>
  <article>
    <h1>Title</h1>
    <section><h2>Part one</h2></section>
  </article>
  <aside>Related links</aside>
</main>
<footer>…</footer>
\`\`\`

Exactly one \`<main>\` per page. If you have two \`<nav>\` elements, give each an \`aria-label\` so they can be told apart.

## section versus div

\`<section>\` is a *thematic* group and should have a heading. If you are only wrapping things for styling, a \`<div>\` is correct — an empty \`<section>\` adds noise to the outline for no benefit.

## The heading outline

\`\`\`html
<h1>Page title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another section</h2>
\`\`\`

One \`h1\` per page. Never skip a level for visual reasons — the heading list is how screen reader users navigate, and a gap reads as missing content. Change the size in CSS instead.

## Keyboard order follows the DOM

\`\`\`html
<button>First</button>
<button>Second</button>
\`\`\`

Tab order follows source order, not visual position. If CSS reorders items on screen, keyboard focus still follows the markup — which is why a flexbox \`order\` or \`row-reverse\` can produce a confusing tab sequence.

\`\`\`html
<div tabindex="0">   <!-- makes a non-interactive element focusable -->
<div tabindex="-1">  <!-- focusable only from script -->
<div tabindex="5">   <!-- ❌ never: breaks the natural order everywhere -->
\`\`\`

## A skip link

\`\`\`html
<a href="#main" class="skip-link">Skip to content</a>
\`\`\`

Visually hidden until focused, this lets a keyboard user bypass fifty navigation links on every page. It is one of the highest-value additions you can make.

## ARIA — the first rule is not to use it

> The first rule of ARIA: do not use ARIA. Use a native element instead.

\`\`\`html
<div role="button" tabindex="0" aria-pressed="false" …>   <!-- ❌ -->
<button aria-pressed="false">…</button>                    <!-- ✅ -->
\`\`\`

ARIA changes only how something is *announced*, never how it *behaves* — a \`role="button"\` div still will not respond to the Space key unless you write that yourself. Reach for ARIA only when there is genuinely no native element, such as a tab panel or a live region:

\`\`\`html
<div aria-live="polite">3 results found</div>   <!-- announced when it changes -->
<input aria-describedby="hint">
<p id="hint">Must be at least 8 characters</p>
\`\`\`

## Contrast and motion

Text needs a contrast ratio of at least **4.5:1** against its background (3:1 for large text). Browser devtools will tell you the ratio for any element.

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\`

Some people get motion sickness from parallax and large transitions. Honouring this setting takes four lines.`,

    contentHi: `## Landmarks aur unka istemaal

Screen readers saare landmarks ki list bana kar unke beech kood sakte hain, aur isi tarah ek nabeena user wo navigation bar chhod deta hai jo wo das pages par pehle hi sun chuka hai.

\`\`\`html
<header>
  <nav aria-label="Main">…</nav>
</header>
<main>
  <article>
    <h1>Title</h1>
    <section><h2>Part one</h2></section>
  </article>
  <aside>Related links</aside>
</main>
<footer>…</footer>
\`\`\`

Har page mein bilkul ek \`<main>\`. Do \`<nav>\` hain to har ek ko \`aria-label\` do taaki alag pehchane jayein.

## section versus div

\`<section>\` ek *vishay* ka samooh hai aur uski heading honi chahiye. Agar aap sirf styling ke liye lapet rahe ho to \`<div>\` hi sahi hai — bina heading wala \`<section>\` outline mein bina fayde ka shor jodta hai.

## Heading ka outline

\`\`\`html
<h1>Page title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another section</h2>
\`\`\`

Har page mein ek \`h1\`. Dikhne ki wajah se koi level kabhi mat chhodo — heading list hi wo rasta hai jispar screen reader users chalte hain, aur khaali jagah unhe lagti hai ki content gayab hai. Size CSS se badlo.

## Keyboard ka kram DOM ke hisaab se chalta hai

\`\`\`html
<button>First</button>
<button>Second</button>
\`\`\`

Tab ka kram source ke kram se chalta hai, screen par kahan dikh raha hai usse nahi. Agar CSS items ka kram badal de, keyboard focus phir bhi markup ke hisaab se chalega — isiliye flexbox ka \`order\` ya \`row-reverse\` uljhan bhara tab sequence bana deta hai.

\`\`\`html
<div tabindex="0">   <!-- non-interactive element ko focusable banata hai -->
<div tabindex="-1">  <!-- sirf script se focus hota hai -->
<div tabindex="5">   <!-- ❌ kabhi nahi: har jagah natural kram toad deta hai -->
\`\`\`

## Skip link

\`\`\`html
<a href="#main" class="skip-link">Skip to content</a>
\`\`\`

Focus hone tak adrishya, ye keyboard user ko har page par pachaas navigation links chhodne deta hai. Ye un cheezon mein se hai jinka fayda sabse zyada hai.

## ARIA — pehla rule hai ki ARIA use mat karo

> ARIA ka pehla rule: ARIA use mat karo. Uski jagah native element use karo.

\`\`\`html
<div role="button" tabindex="0" aria-pressed="false" …>   <!-- ❌ -->
<button aria-pressed="false">…</button>                    <!-- ✅ -->
\`\`\`

ARIA sirf ye badalta hai ki cheez *kaise batayi jaye*, ye nahi ki wo *kaam kaise kare* — \`role="button"\` wala div Space key par tab tak kuch nahi karega jab tak aap khud na likho. ARIA sirf tab lo jab sach mein koi native element ho hi na, jaise tab panel ya live region:

\`\`\`html
<div aria-live="polite">3 results found</div>   <!-- badalne par bola jata hai -->
<input aria-describedby="hint">
<p id="hint">Kam se kam 8 characters</p>
\`\`\`

## Contrast aur motion

Text ka background se contrast ratio kam se kam **4.5:1** hona chahiye (bade text ke liye 3:1). Browser devtools kisi bhi element ka ratio bata dete hain.

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\`

Kuch logon ko parallax aur badi transitions se chakkar aate hain. Is setting ko maanne mein chaar lines lagti hain.`,

    examples: [
      {
        title: 'Div soup versus landmarks',
        titleHi: 'Div soup versus landmarks',
        code: `<!-- A -->
<div class="header">…</div>
<div class="content">…</div>

<!-- B -->
<header>…</header>
<main>…</main>`,
        preview: page(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px">
  <div>
    <div style="border:2px solid #ef4444;padding:6px;margin-bottom:4px">div.header</div>
    <div style="border:2px solid #ef4444;padding:6px">div.content</div>
    <p style="color:#666;margin-top:6px"><strong>Screen reader:</strong><br>"group", "group"</p>
  </div>
  <div>
    <div style="border:2px solid #10b981;padding:6px;margin-bottom:4px">header</div>
    <div style="border:2px solid #10b981;padding:6px">main</div>
    <p style="color:#666;margin-top:6px"><strong>Screen reader:</strong><br>"banner", "main" — and both are jumpable</p>
  </div>
</div>`),
        previewHeight: 220,
        explain: 'Identical on screen, completely different to assistive technology. The right-hand version costs exactly the same to write and gives every screen reader user a way to navigate.',
        explainHi: 'Screen par ek jaise, assistive technology ke liye bilkul alag. Dayein wala version likhne mein utna hi kharch leta hai aur har screen reader user ko chalne ka rasta de deta hai.',
      },
      {
        title: 'A full page skeleton',
        titleHi: 'Poore page ka dhaancha',
        code: `<header>
  <nav aria-label="Main">…</nav>
</header>
<main>
  <article>
    <h1>Post title</h1>
    <section><h2>Background</h2></section>
  </article>
  <aside>Related</aside>
</main>
<footer>© 2024</footer>`,
        preview: page(`<header style="border:2px solid #8b5cf6;padding:6px;margin-bottom:6px">
  <strong style="font-size:12px">header</strong>
  <nav style="border:2px dashed #a78bfa;padding:4px;margin-top:4px;font-size:12px">nav — Home · Shop · About</nav>
</header>
<main style="border:2px solid #10b981;padding:6px;margin-bottom:6px">
  <strong style="font-size:12px">main</strong>
  <article style="border:2px dashed #34d399;padding:4px;margin-top:4px">
    <h1 style="font-size:16px;margin:0">Post title</h1>
  </article>
</main>
<footer style="border:2px solid #f59e0b;padding:6px;font-size:12px">footer — © 2024</footer>`),
        previewHeight: 260,
        explain: 'Each landmark is a destination the user can jump to. Note `aria-label` on the nav — with two navigation regions on a page, that label is what tells them apart.',
        explainHi: 'Har landmark ek manzil hai jahan user kood sakta hai. Nav par `aria-label` dhyan se dekho — page par do navigation hon to wahi label unhe alag pehchanata hai.',
      },
      {
        title: 'button versus div — press Tab and try',
        titleHi: 'button versus div — Tab dabakar dekho',
        code: `<div onclick="save()">Save (div)</div>
<button onclick="save()">Save (button)</button>`,
        preview: page(`<p style="font-size:13px;color:#666">Click in this frame, then press Tab. Only one of these can be reached.</p>
<div style="border:2px solid #ef4444;padding:6px 10px;display:inline-block;margin-right:8px;cursor:pointer">Save (div)</div>
<button style="padding:6px 10px;border:2px solid #10b981">Save (button)</button>
<p style="font-size:12px;color:#666;margin-top:10px">
The div: no focus, no Enter/Space, announced as plain text.<br>
The button: focusable, keyboard-operable, announced as "Save, button".</p>`),
        previewHeight: 210,
        explain: 'Tab reaches the button and skips the div entirely. Anyone who cannot use a mouse simply cannot press your Save control.',
        explainHi: 'Tab button tak pahunchta hai aur div ko poori tarah chhod deta hai. Jo mouse use nahi kar sakta wo aapka Save control daba hi nahi sakta.',
      },
      {
        title: 'Never remove the focus outline',
        titleHi: 'Focus outline kabhi mat hatao',
        code: `/* ❌ */
*:focus { outline: none; }

/* ✅ style it instead */
:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}`,
        preview: page(`<p style="font-size:13px;color:#666">Press Tab repeatedly in this frame.</p>
<div style="margin-bottom:10px">
  <span style="font-size:12px;color:#ef4444">outline removed:</span><br>
  <button class="no-out">One</button> <button class="no-out">Two</button>
</div>
<div>
  <span style="font-size:12px;color:#10b981">outline styled:</span><br>
  <button class="good">One</button> <button class="good">Two</button>
</div>`,
`.no-out { padding:6px 10px; }
.no-out:focus { outline: none; }
.good { padding:6px 10px; }
.good:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }`),
        previewHeight: 220,
        explain: 'In the top row you cannot tell where you are. Now imagine a checkout form with fifteen fields — the user is navigating blind. `:focus-visible` shows the ring for keyboard users only, so mouse clicks stay clean.',
        explainHi: 'Upar wali line mein pata hi nahi chalta aap kahan ho. Ab pandrah fields wale checkout form ki kalpana karo — user andhere mein chal raha hai. `:focus-visible` ring sirf keyboard users ko dikhata hai, isliye mouse click par saaf rehta hai.',
      },
      {
        title: 'Colour alone fails for many users',
        titleHi: 'Sirf rang bahut users ke liye fail hota hai',
        code: `<!-- ❌ colour is the only signal -->
<p style="color:red">Invalid email</p>

<!-- ✅ icon + text + colour -->
<p style="color:#b91c1c">⚠️ Invalid email — check the @ sign</p>`,
        preview: page(`<p style="font-size:13px;color:#666">Roughly 1 in 12 men cannot distinguish these reliably:</p>
<div style="border:2px solid #ef4444;padding:8px;margin-bottom:8px">
  <span style="color:#dc2626">Invalid</span> ·
  <span style="color:#16a34a">Valid</span>
  <div style="font-size:12px;color:#666;margin-top:4px">Colour only — indistinguishable to a colour-blind user</div>
</div>
<div style="border:2px solid #10b981;padding:8px">
  <span style="color:#dc2626">⚠️ Invalid</span> ·
  <span style="color:#16a34a">✅ Valid</span>
  <div style="font-size:12px;color:#666;margin-top:4px">Icon + colour — works for everyone</div>
</div>`),
        previewHeight: 240,
        explain: 'This also matters for anyone on a poor screen or in bright sunlight. An icon or a word costs nothing and removes the dependency on colour entirely.',
        explainHi: 'Ye un logon ke liye bhi matter karta hai jinki screen kharab hai ya jo tez dhoop mein hain. Icon ya ek shabd kuch kharch nahi leta aur rang par nirbharta poori tarah khatam kar deta hai.',
      },
      {
        title: 'Do not skip heading levels',
        titleHi: 'Heading levels mat chhodo',
        code: `<!-- ❌ jumped h1 → h4 because h4 looked right -->
<h1>Title</h1>
<h4>Subtitle</h4>

<!-- ✅ correct level, styled smaller -->
<h1>Title</h1>
<h2 class="subtitle">Subtitle</h2>`,
        preview: page(`<div style="border:2px solid #ef4444;padding:8px;margin-bottom:8px">
  <h1 style="margin:0;font-size:20px">Title</h1>
  <h4 style="margin:4px 0 0">Subtitle</h4>
  <p style="font-size:12px;color:#666;margin:6px 0 0">Outline reads: h1 … then h4. Levels 2 and 3 are missing — the reader assumes content was skipped.</p>
</div>
<div style="border:2px solid #10b981;padding:8px">
  <h1 style="margin:0;font-size:20px">Title</h1>
  <h2 style="margin:4px 0 0;font-size:14px;font-weight:600;color:#555">Subtitle</h2>
  <p style="font-size:12px;color:#666;margin:6px 0 0">Correct level, made smaller with CSS.</p>
</div>`),
        previewHeight: 260,
        explain: 'Both look the same. But screen reader users navigate by heading level, and a jump from 1 to 4 reads as two missing sections. Choose the level for structure and set the size in CSS.',
        explainHi: 'Dono ek jaise dikhte hain. Par screen reader users heading level se chalte hain, aur 1 se 4 par koodna do gayab sections jaisa lagta hai. Level structure ke liye chuno aur size CSS se set karo.',
      },
      {
        title: 'A skip link',
        titleHi: 'Skip link',
        code: `<a href="#main" class="skip-link">Skip to content</a>
<nav>… 50 links …</nav>
<main id="main">…</main>`,
        preview: page(`<p style="font-size:13px;color:#666">Click in this frame and press Tab once:</p>
<a href="#main" class="skip">Skip to content</a>
<nav style="border:1px dashed #ccc;padding:6px;margin-top:6px;font-size:12px">nav — 50 links live here</nav>
<main id="main" style="border:2px solid #10b981;padding:6px;margin-top:6px;font-size:12px">main content</main>`,
`.skip { position:absolute; left:-9999px; background:#2563eb; color:#fff; padding:6px 10px; text-decoration:none; border-radius:4px; }
.skip:focus { left:8px; top:34px; }`),
        previewHeight: 220,
        explain: 'The link is off-screen until it receives focus, then it appears. Without it a keyboard user presses Tab fifty times on every single page before reaching the content.',
        explainHi: 'Link focus milne tak screen se bahar rehta hai, phir dikh jata hai. Iske bina keyboard user har page par content tak pahunchne se pehle pachaas baar Tab dabata hai.',
      },
      {
        title: 'aria-live announces a change',
        titleHi: 'aria-live badlav ki soochna deta hai',
        code: `<div aria-live="polite">3 results found</div>`,
        preview: page(`<div style="border:2px solid #10b981;padding:8px">
  <div aria-live="polite" style="font-weight:600">3 results found</div>
</div>
<p style="font-size:13px;color:#666;margin-top:10px">
When this text changes, a screen reader reads the new value aloud without the user having to go looking for it.<br>
<code>polite</code> waits for a pause; <code>assertive</code> interrupts — use it only for genuine errors.</p>`),
        previewHeight: 210,
        explain: 'A sighted user notices the result count change out of the corner of their eye. A screen reader user gets no such hint unless the region is marked live — this is where ARIA is genuinely the right tool.',
        explainHi: 'Dekh sakne wala user aankh ke kone se result count badalta dekh leta hai. Screen reader user ko koi ishara nahi milta jab tak region live mark na ho — yahi wo jagah hai jahan ARIA sach mein sahi auzaar hai.',
      },
      {
        title: 'Respect prefers-reduced-motion',
        titleHi: 'prefers-reduced-motion ka sammaan karo',
        code: `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`,
        preview: page(`<div class="box">I slide on hover</div>
<p style="font-size:13px;color:#666;margin-top:14px">
Some people get motion sickness from movement like this. The four-line media query above turns every animation off for anyone who has asked their operating system for reduced motion.</p>`,
`.box { padding:10px; background:#c4b5fd; display:inline-block; transition: transform .4s; }
.box:hover { transform: translateX(40px); }
@media (prefers-reduced-motion: reduce) { .box { transition-duration: 0.01ms; } }`),
        previewHeight: 200,
        explain: 'The setting already exists in every operating system — the user has told their machine what they need. Honouring it is four lines, and ignoring it can make someone physically unwell.',
        explainHi: 'Ye setting har operating system mein pehle se hai — user apni machine ko bata chuka hai ki use kya chahiye. Use maanne mein chaar lines lagti hain, aur anndekha karne se kisi ki tabiyat kharab ho sakti hai.',
      },
    ],

    mistakes: [
      {
        wrong: `<div onclick="submit()">Send</div>`,
        right: `<button onclick="submit()">Send</button>`,
        previewWrong: page(`<div style="border:2px solid #ef4444;padding:6px 10px;display:inline-block">Send</div><p style="font-size:12px;color:#666">Tab cannot reach it. Enter does nothing. Announced as text.</p>`),
        previewRight: page(`<button style="border:2px solid #10b981;padding:6px 10px">Send</button><p style="font-size:12px;color:#666">Focusable, keyboard-operable, announced as "Send, button".</p>`),
        previewHeight: 140,
        why: 'A native `<button>` brings focusability, keyboard activation, a button role and a disabled state. Rebuilding all of that on a div takes many lines and is always missing something.',
        whyHi: 'Native `<button>` focus, keyboard se chalna, button role aur disabled state — sab lekar aata hai. Ye sab div par dobara banane mein kai lines lagti hain aur kuch na kuch hamesha chhoot jata hai.',
      },
      {
        wrong: `*:focus { outline: none; }`,
        right: `:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }`,
        why: 'Removing the outline leaves keyboard users with no idea where they are. Restyle it rather than deleting it; `:focus-visible` keeps it hidden for mouse users.',
        whyHi: 'Outline hataane se keyboard users ko pata hi nahi chalta wo kahan hain. Usse mitane ke bajaye style karo; `:focus-visible` mouse users ke liye usse chhupa rakhta hai.',
      },
      {
        wrong: `<h1>Title</h1>
<h4>Subtitle</h4>`,
        right: `<h1>Title</h1>
<h2 class="subtitle">Subtitle</h2>`,
        why: 'Heading levels form the outline screen reader users navigate by. A skipped level reads as missing content — pick the level for meaning and set the size in CSS.',
        whyHi: 'Heading levels wo outline banate hain jispar screen reader users chalte hain. Chhoda hua level gayab content jaisa lagta hai — level matlab se chuno aur size CSS se do.',
      },
      {
        wrong: `<div role="button" tabindex="0">Save</div>`,
        right: `<button>Save</button>`,
        why: 'ARIA changes only how something is announced, never how it behaves. That div still ignores the Space key unless you implement it yourself. Use the native element.',
        whyHi: 'ARIA sirf ye badalta hai ki cheez kaise batayi jaye, ye nahi ki wo kaam kaise kare. Wo div Space key ko tab tak anndekha karega jab tak aap khud na likho. Native element use karo.',
      },
    ],

    realWorld: [
      {
        en: '**Legal exposure.** Accessibility is required by law in many markets — the ADA in the US, the EAA across the EU from 2025. Thousands of lawsuits are filed each year over inaccessible sites.',
        hi: '**Kanooni khatra.** Kai baazaron mein accessibility kanoon se zaroori hai — US mein ADA, 2025 se poore EU mein EAA. Har saal hazaron muqadme un sites par hote hain jo accessible nahi hain.',
      },
      {
        en: '**It is the same work as SEO.** Google reads landmarks, headings and `alt` text to understand a page. Semantic markup improves ranking and accessibility with one change.',
        hi: '**Ye SEO wala hi kaam hai.** Google page samajhne ke liye landmarks, headings aur `alt` text padhta hai. Semantic markup ek hi badlav mein ranking aur accessibility dono behtar karta hai.',
      },
      {
        en: '**It helps everyone.** Captions help in a noisy train, high contrast helps in sunlight, keyboard access helps a power user with a broken trackpad. Accessible design is just better design.',
        hi: '**Ye sabki madad karta hai.** Captions shor wali train mein kaam aate hain, high contrast dhoop mein, aur keyboard access us power user ke liye jiska trackpad toot gaya hai. Accessible design bas behtar design hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is semantic HTML and why does it matter?',
        qHi: 'Semantic HTML kya hai aur kyun matter karta hai?',
        a: 'Using elements that describe what content is rather than generic containers — `<nav>`, `<main>`, `<article>` instead of `<div>`. It gives assistive technology landmarks users can jump between, helps search engines understand the page, and makes the markup readable. It costs nothing over a div and provides behaviour and meaning for free.',
        aHi: 'Aise elements use karna jo batayein content hai kya, na ki generic dabbe — `<div>` ke bajaye `<nav>`, `<main>`, `<article>`. Isse assistive technology ko landmarks milte hain jinke beech user kood sakta hai, search engines page samajhte hain, aur markup padhne layak rehta hai. Div ke mukable ye kuch mehnga nahi hai aur behaviour aur matlab muft mein deta hai.',
      },
      {
        q: 'Why should you never remove focus outlines?',
        qHi: 'Focus outlines kabhi kyun nahi hataane chahiye?',
        a: 'The outline is the only indication of where keyboard focus currently is. Removing it makes a page unusable for anyone navigating without a mouse — including users with motor impairments and power users. If the default is visually unappealing, restyle it; `:focus-visible` shows it for keyboard interaction while keeping mouse clicks clean.',
        aHi: 'Outline hi ekmatra ishara hai ki keyboard focus abhi kahan hai. Use hataane se page un sabke liye bekaar ho jata hai jo bina mouse ke chalte hain — motor dikkat wale users aur power users bhi. Default dekhne mein achha na lage to use style karo; `:focus-visible` keyboard par dikhata hai aur mouse click par saaf rehta hai.',
      },
      {
        q: 'What is the first rule of ARIA?',
        qHi: 'ARIA ka pehla rule kya hai?',
        a: 'Do not use ARIA — use a native HTML element instead. ARIA only alters how an element is announced to assistive technology; it adds no behaviour. A `div` with `role="button"` still needs focus handling and Space/Enter support written by hand, and one forgotten piece leaves it broken. Reach for ARIA only when no native element exists, such as live regions or tab panels.',
        aHi: 'ARIA use mat karo — uski jagah native HTML element use karo. ARIA sirf ye badalta hai ki element assistive technology ko kaise bataya jaye; wo koi behaviour nahi jodta. `role="button"` wale `div` ko focus handling aur Space/Enter support khud likhna padta hai, aur ek hissa bhool jao to wo toota rehta hai. ARIA sirf tab lo jab koi native element ho hi na, jaise live regions ya tab panels.',
      },
      {
        q: 'How is tab order determined?',
        qHi: 'Tab ka kram kaise tay hota hai?',
        a: 'It follows DOM source order among focusable elements, not visual position. CSS that reorders content — flexbox `order`, `row-reverse`, grid placement — leaves the tab sequence following the markup, which can feel random to a keyboard user. Fix it by reordering the markup rather than by adding positive `tabindex` values, which break the natural order across the whole page.',
        aHi: 'Wo focusable elements ke beech DOM ke source kram se chalta hai, screen par kahan dikh raha hai usse nahi. Jo CSS content ka kram badalti hai — flexbox `order`, `row-reverse`, grid placement — wahan tab sequence markup ke hisaab se hi chalta hai, jo keyboard user ko bemtalab lagta hai. Ise markup ka kram badalkar theek karo, positive `tabindex` daalkar nahi, jo poore page ka natural kram toad deta hai.',
      },
      {
        q: 'How would you quickly check a page for accessibility problems?',
        qHi: 'Page ki accessibility jaldi kaise jaanchoge?',
        a: 'Tab through it and confirm every interactive element is reachable and the focus is visible; zoom to 200% and check text reflows rather than being cut off; disable images and see whether alt text still explains the page. Then run an automated tool such as axe or Lighthouse — those catch roughly a third of issues, so the manual checks matter more.',
        aHi: 'Uspar Tab chalao aur dekho har interactive element tak pahunch ho aur focus dikhe; 200% zoom karke dekho text dobara jamta hai ya kat jata hai; images band karke dekho alt text se page samajh aata hai ya nahi. Phir axe ya Lighthouse jaisa automated tool chalao — wo lagbhag ek tihai samasyaein pakadte hain, isliye haath se ki gayi jaanch zyada zaroori hai.',
      },
    ],

    exercises: [
      {
        task: 'Take a page built entirely from divs and rewrite it using `header`, `nav`, `main`, `article`, `aside` and `footer`. Confirm it looks identical afterwards.',
        taskHi: 'Sirf divs se bana page lo aur use `header`, `nav`, `main`, `article`, `aside` aur `footer` se dobara likho. Confirm karo ki baad mein wo bilkul waisa hi dikhta hai.',
        hint: 'The visual result should not change at all — that is the point. Everything you gained was invisible.',
        hintHi: 'Dikhne mein bilkul kuch nahi badalna chahiye — baat hi yahi hai. Jo mila wo sab adrishya tha.',
      },
      {
        task: 'Tab through one of your own pages from top to bottom. Note every element you cannot reach and every point where you cannot see the focus.',
        taskHi: 'Apne kisi page par upar se neeche Tab chalao. Har wo element note karo jahan pahunch nahi paate aur har wo jagah jahan focus dikhta nahi.',
        hint: 'Non-reachable controls are almost always divs pretending to be buttons. Invisible focus is almost always `outline: none`.',
        hintHi: 'Jahan pahunch nahi hoti wahan lagbhag hamesha button banne ki koshish karte divs hote hain. Adrishya focus lagbhag hamesha `outline: none` hota hai.',
      },
      {
        task: 'Add a skip link to a page with a long navigation bar. Style it to be hidden until focused, then test it with the keyboard.',
        taskHi: 'Lambi navigation bar wale page par skip link jodo. Use aise style karo ki focus milne tak chhupa rahe, phir keyboard se test karo.',
        hint: 'Position it off-screen with `position:absolute; left:-9999px`, and bring it back in a `:focus` rule.',
        hintHi: 'Use `position:absolute; left:-9999px` se screen ke bahar rakho, aur `:focus` rule mein wapas laao.',
      },
    ],

    keyTakeaways: [
      'Semantic elements give screen reader users landmarks they can jump between — for the same effort as a div.',
      'Use the native element and you get focus, keyboard support and the correct role for free.',
      'Never remove focus outlines; restyle them with `:focus-visible` instead.',
      'One `h1` per page and never skip heading levels — style the size in CSS instead.',
      'Colour alone is not a signal; add an icon or text for colour-blind users.',
      'First rule of ARIA: do not use ARIA. It changes announcement, never behaviour.',
    ],
    keyTakeawaysHi: [
      'Semantic elements screen reader users ko aise landmarks dete hain jinke beech wo kood sakein — div jitni hi mehnat mein.',
      'Native element use karo aur focus, keyboard support aur sahi role muft mein milte hain.',
      'Focus outlines kabhi mat hatao; unhe `:focus-visible` se style karo.',
      'Har page mein ek `h1` aur heading levels kabhi mat chhodo — size CSS se do.',
      'Sirf rang ishara nahi hai; colour-blind users ke liye icon ya text jodo.',
      'ARIA ka pehla rule: ARIA use mat karo. Wo batane ka tarika badalta hai, behaviour kabhi nahi.',
    ],
  },
];
