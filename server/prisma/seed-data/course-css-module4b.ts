/**
 * CSS & HTML Complete Course — Module 4 (Responsive), lesson 2.
 *
 * Fluid sizing with clamp() and responsive images. The broken example is a
 * heading that looks right at exactly the two breakpoints it was tested at
 * and wrong at every width in between — the case media queries structurally
 * cannot fix, because they only offer fixed steps.
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

export const CSS_MODULE_4B: CourseLesson[] = [
  {
    slug: 'css-fluid-sizing-responsive-images',
    title: 'Fluid Sizing and Responsive Images',
    titleHi: 'Fluid Sizing aur Responsive Images',
    description: 'A heading that is perfect at 400px and perfect at 1200px — and jarring at every width in between.',
    descriptionHi: 'Ek heading jo 400px par perfect hai aur 1200px par perfect hai — aur beech ki har chaudai par khatakta hai.',
    difficulty: 'MEDIUM',
    duration: 30,
    order: 2,

    analogy: {
      en: '**A staircase versus a ramp.** Media-query breakpoints are a staircase: the size jumps in fixed steps, and if you happen to be standing exactly on a step, it looks fine — but the moment between steps is a sudden, visible jerk. `clamp()` is a ramp: the size changes continuously with the screen, so there is no width where anything jumps. You feel every step on a staircase. You never feel a ramp.',
      hi: '**Seedhi aur ramp.** Media-query breakpoints ek seedhi hain: size fixed steps mein kudta hai, aur agar aap thik ek step par khade ho to theek lagta hai — par do steps ke beech ka pal ek achanak, dikhta hua jhatka hai. `clamp()` ek ramp hai: size screen ke saath lagatar badalta hai, isliye koi bhi aisi chaudai nahi jahan kuch kude. Seedhi ka har step mehsoos hota hai. Ramp kabhi mehsoos nahi hoti.',
    },

    simple: `**Start broken.** A hero heading, sized at two breakpoints:

\`\`\`css
h1 { font-size: 32px; }
@media (min-width: 1000px) { h1 { font-size: 64px; } }
\`\`\`

At exactly 400px it looks right. At exactly 1000px and above it looks right. But drag the window slowly from 400px to 1000px and watch the heading: it stays a cramped 32px the whole way, then **snaps** to double its size the instant it crosses 1000px. There is no width where 48px — the size that would actually look proportional at 700px — exists. Media queries only ever give you steps, never anything in between.

**\`clamp()\` gives you the ramp**

\`\`\`css
h1 { font-size: clamp(2rem, 5vw + 1rem, 4rem); }
\`\`\`

Read it as three checkpoints:

\`\`\`
clamp( MINIMUM, PREFERRED, MAXIMUM )
        2rem     5vw + 1rem    4rem
\`\`\`

The **preferred** value, \`5vw + 1rem\`, is a formula that scales continuously with the viewport — as the window widens, this number climbs smoothly. \`clamp()\` uses that preferred value **as long as it stays between the minimum and maximum**; below the point where it would dip under \`2rem\`, it locks at \`2rem\` instead, and above the point where it would exceed \`4rem\`, it locks at \`4rem\`. The result: the heading shrinks or grows a little on every single pixel of window resize, never stuck and never snapping.

**You do not need to hand-calculate the \`vw\` coefficient.** Tools like "Utopia" or "Fluid Type Scale Calculator" exist specifically to compute a \`clamp()\` preferred value that goes from exactly size A at width X to exactly size B at width Y — you plug in your two target sizes and it hands you the formula.

**The same idea, for spacing:**

\`\`\`css
.section { padding: clamp(16px, 4vw, 48px); }
\`\`\`

No breakpoint needed. Padding grows with the window, continuously, capped sensibly on both ends.

**Responsive images — the other half of "why does mobile feel slow"**

\`\`\`html
<img src="photo-1200.jpg"
     srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
     sizes="(min-width: 700px) 50vw, 100vw"
     alt="A description of the photo">
\`\`\`

Without \`srcset\`, a phone downloads the same 1200px-wide file a 4K monitor gets, then shrinks it — paying full desktop bandwidth for a fraction of the pixels it can even display. \`srcset\` lists candidate files with their real widths; \`sizes\` tells the browser how wide the image will actually be rendered at each viewport width; the browser picks the smallest file that still looks sharp. Nothing here needs JavaScript — it is native HTML that has existed since 2014.

**Remember:** media queries are steps, \`clamp()\` is a ramp — reach for \`clamp()\` whenever a value should track the screen continuously rather than jump at one boundary.`,

    simpleHi: `**Toote hue se shuru.** Ek hero heading, do breakpoints par size ki hui:

\`\`\`css
h1 { font-size: 32px; }
@media (min-width: 1000px) { h1 { font-size: 64px; } }
\`\`\`

Bilkul 400px par theek lagta hai. Bilkul 1000px aur usse upar theek lagta hai. Par window ko dhire se 400px se 1000px tak kheencho aur heading dekho: wo poora raasta 32px tang raha, phir 1000px paar karte hi apne size se dugna **kud jata hai**. Koi aisi chaudai nahi hai jahan 48px — jo size 700px par sach mein anupaatik lagega — maujood ho. Media queries hamesha steps hi deti hain, beech mein kuch nahi.

**\`clamp()\` aapko ramp deta hai**

\`\`\`css
h1 { font-size: clamp(2rem, 5vw + 1rem, 4rem); }
\`\`\`

Ise teen checkpoints ki tarah padho:

\`\`\`
clamp( MINIMUM, PREFERRED, MAXIMUM )
        2rem     5vw + 1rem    4rem
\`\`\`

**Preferred** value, \`5vw + 1rem\`, ek formula hai jo viewport ke saath lagatar scale hota hai — window chaudi hote hi ye number aahiste chadhta hai. \`clamp()\` us preferred value ko **tab tak use karta hai jab tak wo minimum aur maximum ke beech rehta hai**; jis jagah wo \`2rem\` se neeche jayega, wahan wo \`2rem\` par lock ho jata hai, aur jahan wo \`4rem\` se upar jayega, wahan \`4rem\` par lock ho jata hai. Nateeja: heading window resize ke har ek pixel par thoda sikudta ya badhta hai, kabhi atakta nahi aur kabhi kudta nahi.

**\`vw\` coefficient haath se nikalne ki zarurat nahi.** "Utopia" ya "Fluid Type Scale Calculator" jaise auzaar khaas taur par ek aisa \`clamp()\` preferred value nikalne ke liye hain jo chaudai X par bilkul size A se chaudai Y par bilkul size B tak jaye — aap apne do target sizes daalo aur wo formula de deta hai.

**Wahi soch, spacing ke liye:**

\`\`\`css
.section { padding: clamp(16px, 4vw, 48px); }
\`\`\`

Koi breakpoint nahi chahiye. Padding window ke saath lagatar badhta hai, dono taraf sensibly capped.

**Responsive images — "mobile slow kyun lagta hai" ka doosra hissa**

\`\`\`html
<img src="photo-1200.jpg"
     srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
     sizes="(min-width: 700px) 50vw, 100vw"
     alt="Photo ka vivaran">
\`\`\`

\`srcset\` ke bina, phone wahi 1200px-chaudi file download karta hai jo 4K monitor ko milti hai, phir use sikoud deta hai — poora desktop bandwidth chuka kar sirf itne pixels ke liye jo wo dikha bhi nahi sakta. \`srcset\` unki asli chaudai ke saath candidate files ki list deta hai; \`sizes\` browser ko batata hai ki har viewport chaudai par image asal mein kitni chaudi render hogi; browser sabse chhoti aisi file chunta hai jo phir bhi saaf dikhe. Isme kahin JavaScript ki zarurat nahi — ye native HTML hai jo 2014 se maujood hai.

**Yaad rakho:** media queries steps hain, \`clamp()\` ramp hai — jab bhi value ko screen ke saath lagatar chalna ho, na ki ek seema par kudna ho, tab \`clamp()\` lo.`,

    content: `## clamp() syntax

\`\`\`css
property: clamp(MIN, PREFERRED, MAX);
\`\`\`

- If \`PREFERRED\` evaluates smaller than \`MIN\`, the browser uses \`MIN\`.
- If \`PREFERRED\` evaluates larger than \`MAX\`, the browser uses \`MAX\`.
- Otherwise it uses \`PREFERRED\` exactly.

\`PREFERRED\` is where the continuity comes from, and it is almost always built from a viewport unit:

\`\`\`
vw   1% of the viewport WIDTH
vh   1% of the viewport HEIGHT
\`\`\`

## Why the preferred value mixes a viewport unit with a fixed unit

\`\`\`css
font-size: clamp(1.5rem, 4vw, 3rem);      /* pure vw: scales but never respects zoom perfectly */
font-size: clamp(1.5rem, 3vw + 1rem, 3rem); /* mixed: still scales, but with a stable floor built in */
\`\`\`

A pure \`vw\` value is a percentage of viewport width and nothing else — it carries no relationship to the user's base font size, so it does not scale the way \`rem\`-based type should when someone changes their browser's default text size. Adding a fixed \`rem\` term keeps that relationship while still letting the \`vw\` term supply the fluid growth. This is a genuinely subtle, easy-to-miss accessibility detail: \`font-size: 4vw\` alone technically works but quietly breaks user font-size preferences the same way a raw \`px\` value does.

## min() and max() — clamp's simpler siblings

\`\`\`css
width: min(90%, 600px);   /* whichever is SMALLER — a fluid max-width */
width: max(50%, 300px);   /* whichever is LARGER — a fluid min-width */
\`\`\`

\`clamp(A, B, C)\` is equivalent to \`max(A, min(B, C))\` — a floor combined with a ceiling. Reach for the simpler \`min()\`/\`max()\` when you only need one boundary, and \`clamp()\` when you need both.

## Responsive images: srcset and sizes

\`\`\`html
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w, photo-2000.jpg 2000w"
  sizes="(min-width: 900px) 700px, 100vw"
  alt="A meaningful description">
\`\`\`

- \`srcset\` lists real files and their **intrinsic pixel widths** (\`400w\` means the file is 400px wide) — not screen sizes, file sizes.
- \`sizes\` tells the browser, *before* it downloads anything, how wide the image will be **rendered** at different viewport widths — here, 700px wide once the viewport is 900px or more, otherwise the full viewport width.
- The browser combines both facts with the device's pixel density to pick the smallest file that will still look sharp, and downloads only that one.

\`src\` remains as the fallback for browsers that do not understand \`srcset\`.

## The picture element: art direction, not just resolution

\`\`\`html
<picture>
  <source media="(min-width: 900px)" srcset="wide-crop.jpg">
  <source media="(max-width: 899px)" srcset="tall-crop.jpg">
  <img src="tall-crop.jpg" alt="A meaningful description">
</picture>
\`\`\`

\`srcset\`/\`sizes\` on a plain \`img\` picks between different **resolutions of the same crop**. \`<picture>\` picks between genuinely **different images** — a wide landscape crop for desktop, a tighter portrait crop for phones — because the same framing does not always work at both aspect ratios. The browser evaluates the \`<source>\` elements top to bottom and uses the first one whose \`media\` condition matches, falling back to the \`img\` if none do.

## width, height and aspect-ratio prevent layout shift

\`\`\`css
img { max-width: 100%; height: auto; }
\`\`\`

\`\`\`html
<img src="photo.jpg" width="800" height="600" alt="...">
\`\`\`

Always keep the \`width\`/\`height\` attributes (or an \`aspect-ratio\` in CSS) even on a fluid image, so the browser can reserve the correct space before the file finishes downloading. Without them, the page height jumps once each image loads — a layout shift that is both jarring to read and directly penalised as Cumulative Layout Shift, a measured web performance and search-ranking signal.`,

    contentHi: `## clamp() syntax

\`\`\`css
property: clamp(MIN, PREFERRED, MAX);
\`\`\`

- Agar \`PREFERRED\` \`MIN\` se chhota nikle, to browser \`MIN\` use karta hai.
- Agar \`PREFERRED\` \`MAX\` se bada nikle, to browser \`MAX\` use karta hai.
- Nahi to wo bilkul \`PREFERRED\` use karta hai.

Continuity \`PREFERRED\` se aati hai, aur wo lagbhag hamesha kisi viewport unit se banta hai:

\`\`\`
vw   viewport ki CHAUDAI ka 1%
vh   viewport ki OONCHAI ka 1%
\`\`\`

## Preferred value viewport unit ko fixed unit ke saath kyun milata hai

\`\`\`css
font-size: clamp(1.5rem, 4vw, 3rem);      /* khaalis vw: scale hota hai par zoom ko poori tarah nahi maanta */
font-size: clamp(1.5rem, 3vw + 1rem, 3rem); /* mila hua: phir bhi scale hota hai, par ek pakka floor bhi hai */
\`\`\`

Khaalis \`vw\` value sirf viewport chaudai ka percentage hai aur kuch nahi — uska user ke base font size se koi rishta nahi, isliye jab koi apne browser ka default text size badalta hai to wo waise scale nahi hota jaise \`rem\`-based type ko hona chahiye. Fixed \`rem\` term jodne se wo rishta bana rehta hai jabki \`vw\` term fluid growth deta rehta hai. Ye sach mein sookshm, chhutne layak accessibility detail hai: akela \`font-size: 4vw\` takniki roop se chalta hai par chupchap user ki font-size pasand kharab kar deta hai, bilkul jaise ek kachcha \`px\` value karta hai.

## min() aur max() — clamp ke aasan bhai-behan

\`\`\`css
width: min(90%, 600px);   /* jo bhi CHHOTA ho — ek fluid max-width */
width: max(50%, 300px);   /* jo bhi BADA ho — ek fluid min-width */
\`\`\`

\`clamp(A, B, C)\` \`max(A, min(B, C))\` ke barabar hai — ek floor jo ek ceiling ke saath mila hua hai. Sirf ek seema chahiye ho to aasan \`min()\`/\`max()\` lo, aur dono chahiye ho to \`clamp()\`.

## Responsive images: srcset aur sizes

\`\`\`html
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w, photo-2000.jpg 2000w"
  sizes="(min-width: 900px) 700px, 100vw"
  alt="Ek matlab wala vivaran">
\`\`\`

- \`srcset\` asli files aur unki **intrinsic pixel chaudai** ki list deta hai (\`400w\` matlab file 400px chaudi hai) — screen size nahi, file size nahi.
- \`sizes\` browser ko *kuch download karne se pehle* batata hai ki alag-alag viewport chaudaiyon par image kitni chaudi **render** hogi — yahan, viewport 900px ya usse zyada hone par 700px chaudi, warna poori viewport chaudai.
- Browser dono baaton ko device ki pixel density ke saath jodkar sabse chhoti aisi file chunta hai jo phir bhi saaf dikhegi, aur sirf wahi download karta hai.

\`src\` un browsers ke liye fallback ki tarah rehta hai jo \`srcset\` samajhte nahi.

## picture element: art direction, sirf resolution nahi

\`\`\`html
<picture>
  <source media="(min-width: 900px)" srcset="wide-crop.jpg">
  <source media="(max-width: 899px)" srcset="tall-crop.jpg">
  <img src="tall-crop.jpg" alt="Ek matlab wala vivaran">
</picture>
\`\`\`

Ek saadhe \`img\` par \`srcset\`/\`sizes\` ek hi **crop ke alag resolutions** ke beech chunte hain. \`<picture>\` sach mein **alag images** ke beech chunta hai — desktop ke liye chaudi landscape crop, phone ke liye tang portrait crop — kyunki wahi framing dono aspect ratios par hamesha nahi chalti. Browser \`<source>\` elements ko upar se neeche check karta hai aur pehle wale ka istemaal karta hai jiska \`media\` sharat match kare, koi match na kare to \`img\` par fallback karta hai.

## width, height aur aspect-ratio layout shift rokte hain

\`\`\`css
img { max-width: 100%; height: auto; }
\`\`\`

\`\`\`html
<img src="photo.jpg" width="800" height="600" alt="...">
\`\`\`

Fluid image par bhi \`width\`/\`height\` attributes (ya CSS mein \`aspect-ratio\`) hamesha rakho, taaki browser file poori download hone se pehle sahi jagah rok sake. Bina inke, har image load hone par page ki height kudti hai — ye layout shift padhne mein khatakta bhi hai aur seedha Cumulative Layout Shift ki tarah dandit bhi hota hai, jo naapa jane wala web performance aur search-ranking signal hai.`,

    examples: [
      {
        title: 'The step-jump: a heading that snaps at one breakpoint',
        titleHi: 'Step-jump: ek breakpoint par kudta hua heading',
        code: `h1 { font-size: 32px; }
@media (min-width: 900px) { h1 { font-size: 64px; } }`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 6px">This preview frame is fixed-width, so imagine dragging a real window from 400px to 1200px:</p>
<h1 class="h">Heading</h1>
<p style="font-size:13px;color:#666">32px the entire way from 400px to 899px, then an instant jump to 64px at 900px — nothing in between ever exists.</p>`,
`.h { font-size:32px; margin:4px 0; }
@media (min-width:900px) { .h { font-size:64px; } }`),
        previewHeight: 150,
        explain: 'Two exact sizes exist and nothing between them does. Resize slowly across 900px in a real browser and the jump is visually jarring — a sudden pop rather than a smooth grow.',
        explainHi: 'Do exact sizes maujood hain aur unke beech kuch nahi. Asli browser mein 900px ke aar-paar dhire resize karo aur kudna dikhne mein khatakta hai — smooth badhne ke bajaye ek achanak pop.',
      },
      {
        title: 'clamp(): the same heading, growing continuously',
        titleHi: 'clamp(): wahi heading, lagatar badhta hua',
        code: `h1 { font-size: clamp(2rem, 5vw + 1rem, 4rem); }`,
        preview: page(`<h1 class="h">Heading</h1>
<p style="font-size:13px;color:#666">Resize an actual browser window with this preview and there is no width where the size jumps — it tracks the window continuously between its 2rem floor and 4rem ceiling.</p>`,
`.h { font-size:clamp(2rem, 5vw + 1rem, 4rem); margin:4px 0; }`),
        previewHeight: 150,
        explain: 'There is no single width where anything "jumps" — the size is a continuous function of the viewport, floored at 2rem and ceilinged at 4rem, exactly matching the ramp analogy.',
        explainHi: 'Koi aisi ek chaudai nahi jahan kuch "kude" — size viewport ka lagatar function hai, 2rem par floor aur 4rem par ceiling, ramp wali analogy se bilkul milta hai.',
      },
      {
        title: 'Reading clamp\'s three arguments separately',
        titleHi: 'clamp ke teen arguments alag-alag padhna',
        code: `width: clamp(200px, 50%, 500px);
/* below 400px container: locked at 200px
   between 400–1000px container: exactly 50%
   above 1000px container: locked at 500px */`,
        preview: page(`<div class="narrow"><div class="box">200px floor</div></div>
<div class="mid"><div class="box">50% preferred</div></div>
<div class="wide"><div class="box">500px ceiling</div></div>`,
`.narrow, .mid, .wide { border:1px dashed #94a3b8; padding:4px; margin-bottom:6px; }
.narrow { width:300px; } .mid { width:700px; } .wide { width:1200px; max-width:100%; }
.box { background:#dbeafe; border:1px solid #60a5fa; padding:8px; font-size:12px; width:clamp(200px, 50%, 500px); }`),
        previewHeight: 200,
        explain: 'Three different container widths, three different outcomes from the same rule: the narrow one hits the 200px floor, the middle one uses the literal 50%, and the wide one hits the 500px ceiling.',
        explainHi: 'Teen alag container widths, ek hi rule se teen alag nateeje: sankra 200px floor par pahunchta hai, beech wala 50% ka istemaal karta hai, chauda 500px ceiling par pahunchta hai.',
      },
      {
        title: 'Pure vw versus vw + rem — the font-size accessibility gap',
        titleHi: 'Khaalis vw aur vw + rem — font-size accessibility ka gap',
        code: `.pure { font-size: 4vw; }              /* ignores the user's rem-based preference below the vw threshold */
.mixed { font-size: 2vw + 1rem; }       /* keeps a rem-based floor built into the formula */`,
        preview: page(`<p class="pure">4vw alone: at a small viewport this can shrink well below a readable size, and its floor is not tied to the user's font preference at all.</p>
<p class="mixed">2vw + 1rem: still grows with the viewport, but always carries at least 1rem worth of the user's own preferred size.</p>`,
`.pure { font-size:4vw; }
.mixed { font-size:calc(2vw + 1rem); }`),
        previewHeight: 170,
        explain: 'Both scale with viewport width, but only the second carries a genuine `rem` component, so a user who raised their base font size sees that reflected here too. `clamp()` is normally built around a formula like the second, not the first.',
        explainHi: 'Dono viewport chaudai ke saath scale hote hain, par sirf doosre mein asli `rem` hissa hai, isliye jis user ne apna base font size badhaya hai use yahan bhi wo dikhta hai. `clamp()` aksar doosre jaisa formula lekar banta hai, pehle jaisa nahi.',
      },
      {
        title: 'min() as a fluid max-width',
        titleHi: 'Fluid max-width ki tarah min()',
        code: `.card { width: min(90%, 400px); }`,
        preview: page(`<div class="narrow"><div class="c">90% used — container narrower than 444px</div></div>
<div class="wide"><div class="c">400px cap used — container wide enough that 90% would exceed it</div></div>`,
`.narrow, .wide { border:1px dashed #94a3b8; padding:6px; margin-bottom:6px; }
.narrow { width:300px; } .wide { width:800px; max-width:100%; }
.c { background:#dbeafe; border:1px solid #60a5fa; padding:8px; font-size:12px; width:min(90%, 400px); }`),
        previewHeight: 180,
        explain: '`min()` picks whichever is smaller. In a narrow container 90% is the smaller number, so it wins; in a wide container 400px is smaller, so the box stops growing there instead of stretching edge to edge.',
        explainHi: '`min()` jo bhi chhota ho use chunta hai. Sankre container mein 90% chhota number hai, isliye wo jeetta hai; chaude container mein 400px chhota hai, isliye box wahin badhna band kar deta hai, kinare-se-kinare pheelne ke bajaye.',
      },
      {
        title: 'Without srcset, phones download the desktop file',
        titleHi: 'Bina srcset ke, phones desktop wali file download karte hain',
        code: `<!-- one huge file for every device -->
<img src="photo-2000.jpg" alt="Mountains">`,
        preview: page(`<div class="ph">
  <strong>375px phone:</strong> downloads and decodes the full 2000px-wide file, then the browser shrinks it visually — full bandwidth cost, only a fraction of the pixels ever shown.
</div>`,
`.ph { font-size:13px; background:#fef3c7; border:1px solid #f59e0b; padding:10px; border-radius:4px; }`),
        previewHeight: 130,
        explain: 'The browser has no way to know a smaller file exists. It downloads exactly the file named in `src`, whatever the screen size, and this single tag is often the single largest asset on a mobile page load.',
        explainHi: 'Browser ko pata hi nahi ki chhoti file bhi maujood hai. Wo screen size chahe kuch bhi ho, `src` mein likhi wahi file download karta hai, aur ye ek tag aksar mobile page load ka sabse bada asset hota hai.',
      },
      {
        title: 'srcset + sizes: the browser picks the right file itself',
        titleHi: 'srcset + sizes: browser khud sahi file chunta hai',
        code: `<img src="photo-800.jpg"
     srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1600.jpg 1600w"
     sizes="(min-width: 700px) 500px, 100vw"
     alt="Mountains">`,
        preview: page(`<div class="ph">
  <strong>On a 375px phone:</strong> <code>sizes</code> resolves to <code>100vw</code> (375px), so the browser requests <code>photo-400.jpg</code> — the smallest candidate that still covers it.<br><br>
  <strong>On a 1400px desktop, past the 700px breakpoint:</strong> <code>sizes</code> resolves to <code>500px</code>, so the browser requests <code>photo-800.jpg</code>, not the largest file — because rendering at 500px never needed 1600px of detail.
</div>`,
`.ph { font-size:13px; background:#f0fdf4; border:1px solid #10b981; padding:10px; border-radius:4px; }`),
        previewHeight: 200,
        explain: 'The browser reads `sizes` to know the RENDERED width at the current viewport, then picks the smallest `srcset` candidate that still covers that many real device pixels — often not even the largest file available, because bigger was never necessary.',
        explainHi: 'Browser abhi ke viewport par RENDERED chaudai jaanne ke liye `sizes` padhta hai, phir sabse chhota aisa `srcset` candidate chunta hai jo utne asli device pixels ko phir bhi cover kare — aksar sabse badi maujood file bhi nahi, kyunki zyada badi ki zarurat kabhi thi hi nahi.',
      },
      {
        title: 'picture: a genuinely different crop, not just a smaller file',
        titleHi: 'picture: asal mein alag crop, sirf chhoti file nahi',
        code: `<picture>
  <source media="(min-width: 700px)" srcset="wide.jpg">
  <source media="(max-width: 699px)" srcset="tall.jpg">
  <img src="tall.jpg" alt="A person standing in a field">
</picture>`,
        preview: page(`<div class="side">
  <div><p style="font-size:12px;margin:0 0 4px">Wide viewport &rarr; wide-crop.jpg</p><div class="crop wide">landscape crop — subject small, scenery wide</div></div>
  <div><p style="font-size:12px;margin:0 0 4px">Narrow viewport &rarr; tall-crop.jpg</p><div class="crop tall">portrait crop — subject fills the frame</div></div>
</div>`,
`.side { display:flex; gap:14px; flex-wrap:wrap; }
.crop { display:flex; align-items:center; justify-content:center; font-size:12px; color:#1e3a8a; background:#dbeafe; border:1px solid #60a5fa; }
.wide { width:220px; height:80px; } .tall { width:100px; height:150px; }`),
        previewHeight: 200,
        explain: 'This is not resolution switching — it is two different images, framed differently, because the same wide landscape composition that works on a desktop banner would leave the subject tiny and lost on a narrow phone screen.',
        explainHi: 'Ye resolution switching nahi hai — ye do alag images hain, alag tarike se frame ki hui, kyunki wahi chaudi landscape composition jo desktop banner par chalti hai, sankri phone screen par subject ko chhota aur khoya hua chhod degi.',
      },
      {
        title: 'aspect-ratio prevents the page from jumping while an image loads',
        titleHi: 'aspect-ratio image load hote waqt page ko kudne se rokta hai',
        code: `img { aspect-ratio: 16 / 9; width: 100%; height: auto; }
/* space is reserved BEFORE the file finishes downloading */`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 6px">Without a reserved ratio, this space collapses to 0 height until the image loads, then the page jumps:</p>
<div class="ph"></div>
<p style="font-size:13px;color:#666;margin-top:8px">With aspect-ratio set, the space is reserved immediately, so surrounding text never has to reflow when the file arrives.</p>`,
`.ph { width:100%; aspect-ratio:16/9; background:repeating-linear-gradient(45deg,#dbeafe,#dbeafe 10px,#eff6ff 10px,#eff6ff 20px); border:1px dashed #60a5fa; }`),
        previewHeight: 220,
        explain: 'The striped box represents reserved space that exists whether or not the real image has finished downloading. Without a declared ratio (or explicit width/height), that space is zero until the file arrives, and everything below it visibly jumps down.',
        explainHi: 'Dhaari wala box us roki hui jagah ko dikhata hai jo chahe asli image download hui ho ya nahi, maujood rehti hai. Declared ratio (ya seedhe width/height) ke bina, wo jagah file aane tak zero rehti hai, aur uske neeche sab kuch dikhne mein neeche kudta hai.',
      },
      {
        title: 'Fluid spacing with clamp — no breakpoint needed',
        titleHi: 'clamp se fluid spacing — koi breakpoint nahi chahiye',
        code: `.section { padding: clamp(16px, 4vw, 48px); }`,
        preview: page(`<div class="narrow"><div class="s">Narrow container — padding near the 16px floor</div></div>
<div class="wide"><div class="s">Wide container — padding grows toward the 48px ceiling</div></div>`,
`.narrow, .wide { border:1px dashed #94a3b8; margin-bottom:6px; }
.narrow { width:300px; } .wide { width:900px; max-width:100%; }
.s { background:#dbeafe; padding:clamp(16px, 4vw, 48px); font-size:13px; }`),
        previewHeight: 220,
        explain: 'One rule, two very different-feeling results, and every width in between grows smoothly rather than jumping between two hard-coded padding values at a breakpoint.',
        explainHi: 'Ek rule, do bilkul alag mehsoos hone wale nateeje, aur beech ki har chaudai kisi breakpoint par do hard-coded padding values ke beech kudne ke bajaye smoothly badhti hai.',
      },
    ],

    mistakes: [
      {
        wrong: `h1 { font-size: 32px; }
@media (min-width: 900px) { h1 { font-size: 64px; } }   /* a visible jump at 900px */`,
        right: `h1 { font-size: clamp(2rem, 5vw + 1rem, 4rem); }`,
        previewWrong: page(`<h1 class="h">Snaps at 900px</h1>`,
          `.h{font-size:32px;margin:2px 0}@media (min-width:900px){.h{font-size:64px}}`),
        previewRight: page(`<h1 class="h">Grows continuously</h1>`,
          `.h{font-size:clamp(2rem, 5vw + 1rem, 4rem);margin:2px 0}`),
        previewHeight: 100,
        why: 'A media query can only offer discrete steps. If a value should track the screen continuously — most type and spacing — `clamp()` removes the jump entirely instead of hiding it at one specific width.',
        whyHi: 'Media query sirf alag-alag steps de sakti hai. Agar koi value screen ke saath lagatar chalni chahiye — zyadatar type aur spacing — to `clamp()` kudna ek khaas chaudai par chhupane ke bajaye poori tarah hata deta hai.',
      },
      {
        wrong: `h1 { font-size: 4vw; }   /* ignores the user's font-size preference */`,
        right: `h1 { font-size: clamp(2rem, 2vw + 1.5rem, 3.5rem); }`,
        why: 'A value built purely from `vw` carries no relationship to the user\'s base font size, so raising the browser default has no effect on it — the same accessibility gap as using raw `px`. Mixing in a `rem` term restores that relationship.',
        whyHi: 'Sirf `vw` se bane value ka user ke base font size se koi rishta nahi, isliye browser default badhane ka usme koi asar nahi padta — kachcha `px` use karne wali wahi accessibility ki kami. `rem` term milane se wo rishta wapas aa jata hai.',
      },
      {
        wrong: `<img src="photo-2000.jpg" alt="...">   <!-- every device downloads the same huge file -->`,
        right: `<img src="photo-800.jpg" srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-2000.jpg 2000w" sizes="100vw" alt="...">`,
        why: 'Without `srcset`, a phone downloads and decodes the same full-resolution file a desktop monitor needs, paying the full bandwidth and CPU cost for detail it cannot even display.',
        whyHi: '`srcset` ke bina, phone wahi poori-resolution wali file download aur decode karta hai jo desktop monitor ko chahiye, poora bandwidth aur CPU kharcha karke us detail ke liye jo wo dikha bhi nahi sakta.',
      },
      {
        wrong: `<img src="photo.jpg" alt="...">   <!-- no width/height, no aspect-ratio -->`,
        right: `<img src="photo.jpg" width="800" height="600" alt="..." style="max-width:100%; height:auto">`,
        why: 'Without a declared size or aspect-ratio, the browser reserves zero space for the image until it finishes downloading, so the surrounding content jumps down the moment it arrives — a measured, penalised layout shift.',
        whyHi: 'Declared size ya aspect-ratio ke bina, browser image ke liye tab tak zero jagah rakhta hai jab tak wo download poora nahi ho jaati, isliye aas-paas ka content uske aate hi neeche kud jata hai — ek naapa jaane wala, dandit hone wala layout shift.',
      },
    ],

    realWorld: [
      {
        en: '**"Fluid typography" calculators (Utopia, Fluid Type Scale).** These tools exist entirely to generate `clamp()` values, because hand-computing the `vw` coefficient that hits exact pixel sizes at exact viewport widths is genuinely fiddly algebra most developers reach for a tool to skip.',
        hi: '**"Fluid typography" calculators (Utopia, Fluid Type Scale).** Ye tools poori tarah `clamp()` values banane ke liye hain, kyunki haath se wo `vw` coefficient nikaalna jo exact viewport widths par exact pixel sizes tak pahunche, sach mein pechida algebra hai jise chhodne ke liye zyadatar developers auzaar ka sahara lete hain.',
      },
      {
        en: '**Core Web Vitals and search ranking.** Cumulative Layout Shift, caused largely by images without reserved dimensions, is one of Google\'s three Core Web Vitals and directly affects search ranking — this is not a cosmetic concern.',
        hi: '**Core Web Vitals aur search ranking.** Cumulative Layout Shift, jo zyadatar bina roki hui dimensions wali images se hota hai, Google ke teen Core Web Vitals mein se ek hai aur search ranking ko seedha asar karta hai — ye sirf dikhne wali baat nahi hai.',
      },
      {
        en: '**News and e-commerce sites are the heaviest srcset users.** A product photo or article hero shown at dozens of sizes across a homepage, category page and detail page is the textbook case `srcset`/`sizes` was designed for.',
        hi: '**News aur e-commerce sites sabse zyada srcset use karte hain.** Ek product photo ya article hero jo homepage, category page aur detail page mein dus alag sizes par dikhaya jata hai, wahi textbook case hai jiske liye `srcset`/`sizes` design kiya gaya tha.',
      },
    ],

    interviewQA: [
      {
        q: 'What does clamp() do and why is it preferred over a media query for scaling type?',
        qHi: 'clamp() kya karta hai aur type scale karne ke liye ise media query se behtar kyun maana jata hai?',
        a: '`clamp(min, preferred, max)` uses the preferred value as long as it falls between the min and max, and locks to whichever boundary it would otherwise cross. Because the preferred value is typically built from a viewport unit, the result changes continuously with the screen width instead of in discrete jumps. A media query can only offer a fixed number of steps, so between two breakpoints the value stays frozen and then snaps — `clamp()` removes that jump entirely, growing or shrinking smoothly on every pixel of resize.',
        aHi: '`clamp(min, preferred, max)` preferred value ko tab tak use karta hai jab tak wo min aur max ke beech aaye, aur jis seema ko wo warna paar karta us par lock ho jata hai. Kyunki preferred value aksar viewport unit se banta hai, nateeja screen chaudai ke saath lagatar badalta hai, alag-alag kudte hue nahi. Media query sirf fixed number ke steps de sakti hai, isliye do breakpoints ke beech value jami rehti hai aur phir kudti hai — `clamp()` us kudne ko poori tarah hata deta hai, resize ke har pixel par smoothly badhta ya sikudta hai.',
      },
      {
        q: 'Why should a fluid font-size formula mix a viewport unit with a rem or em, rather than using pure vw?',
        qHi: 'Fluid font-size formula ko khaalis vw ke bajaye rem ya em ke saath kyun milana chahiye?',
        a: 'A pure `vw` value is only a percentage of viewport width — it has no connection to the user\'s base font size, so if someone raises their browser\'s default text size for readability, a `4vw` heading does not respond to that at all. Mixing in a `rem` term, like `2vw + 1rem`, keeps the value tied to the user\'s preference while the `vw` term still supplies the continuous scaling. Ignoring this is functionally the same accessibility failure as using raw `px` for text.',
        aHi: 'Khaalis `vw` value sirf viewport chaudai ka percentage hai — uska user ke base font size se koi taalluk nahi, isliye agar koi padhne ki suvidha ke liye apne browser ka default text size badhata hai, to `4vw` wala heading uspar bilkul react nahi karta. `2vw + 1rem` jaisa `rem` term milane se value user ki pasand se judi rehti hai jabki `vw` term lagatar scaling deta rehta hai. Ise anndekha karna functionally wahi accessibility ki chook hai jo text ke liye kachcha `px` use karne se hoti hai.',
      },
      {
        q: 'What is the difference between what srcset/sizes on an img element does and what the picture element does?',
        qHi: 'img element par srcset/sizes kya karta hai aur picture element kya karta hai, dono mein kya fark hai?',
        a: '`srcset`/`sizes` on a plain `<img>` lets the browser choose between different **resolutions of the same image** — the same crop and composition, just larger or smaller files — based on the rendered size and the device\'s pixel density. `<picture>` with multiple `<source>` elements lets the browser choose between genuinely **different images**, such as a wide landscape crop for desktop and a tighter portrait crop for mobile, because the same framing does not always suit both aspect ratios. One is a resolution decision; the other is an art-direction decision.',
        aHi: 'Saade `<img>` par `srcset`/`sizes` browser ko rendered size aur device ki pixel density ke hisaab se **ek hi image ke alag resolutions** ke beech chunne deta hai — wahi crop aur composition, sirf chhoti ya badi files. Kai `<source>` elements wala `<picture>` browser ko sach mein **alag images** ke beech chunne deta hai, jaise desktop ke liye chaudi landscape crop aur mobile ke liye tang portrait crop, kyunki wahi framing hamesha dono aspect ratios ke liye sahi nahi hoti. Ek resolution ka faisla hai; doosra art-direction ka faisla hai.',
      },
      {
        q: 'Why does an image without width/height attributes cause layout shift?',
        qHi: 'Bina width/height attributes wali image layout shift kyun karti hai?',
        a: 'Without a declared width, height, or `aspect-ratio`, the browser has no way to know how much vertical space the image will occupy before the file finishes downloading, so it renders zero height for it initially. The moment the image loads and its real dimensions are known, the page suddenly grows to make room, shifting every element below it downward. This is measured as Cumulative Layout Shift, one of Google\'s Core Web Vitals, and setting `width`/`height` attributes (or a CSS `aspect-ratio`) lets the browser reserve the correct space immediately, before a single byte of the image arrives.',
        aHi: 'Declared width, height, ya `aspect-ratio` ke bina, browser ko pata hi nahi ki file poori download hone se pehle image kitni khadi jagah legi, isliye wo shuru mein iske liye zero height render karta hai. Image load hote hi aur uski asli dimensions pata chalte hi, page achanak jagah banane ke liye badh jata hai, aur uske neeche ka har element neeche khisak jata hai. Ise Cumulative Layout Shift ki tarah naapa jata hai, jo Google ke Core Web Vitals mein se ek hai, aur `width`/`height` attributes (ya CSS `aspect-ratio`) set karne se browser image ka ek bhi byte aane se pehle hi sahi jagah rok leta hai.',
      },
      {
        q: 'What is the relationship between clamp() and min()/max()?',
        qHi: 'clamp() aur min()/max() mein kya rishta hai?',
        a: '`clamp(min, preferred, max)` is functionally equivalent to `max(min, min(preferred, max))` — it combines a floor and a ceiling around one preferred value in a single readable function. `min()` alone picks whichever of its arguments is smaller, useful as a fluid maximum (e.g. `width: min(90%, 600px)` never exceeds 600px but shrinks with the container below that). `max()` alone picks whichever is larger, useful as a fluid minimum. Reach for the single-boundary functions when you only need one constraint, and `clamp()` when a value needs both a floor and a ceiling.',
        aHi: '`clamp(min, preferred, max)` functionally `max(min, min(preferred, max))` ke barabar hai — ye ek preferred value ke charon taraf floor aur ceiling ko ek padhne layak function mein jodta hai. Akela `min()` apne arguments mein se jo bhi chhota ho use chunta hai, ek fluid maximum ki tarah kaam ka (jaise `width: min(90%, 600px)` kabhi 600px se zyada nahi hota par uske neeche container ke saath sikudta hai). Akela `max()` jo bhi bada ho use chunta hai, ek fluid minimum ki tarah kaam ka. Sirf ek seema chahiye ho to single-boundary functions lo, aur value ko floor aur ceiling dono chahiye ho to `clamp()`.',
      },
    ],

    exercises: [
      {
        task: 'Take a heading sized with a single media-query breakpoint and convert it to `clamp()`. Resize slowly across the old breakpoint and confirm the jump is gone.',
        taskHi: 'Ek breakpoint wale media query se size kiya gaya heading lo aur use `clamp()` mein badlo. Purane breakpoint ke aar-paar dhire resize karo aur confirm karo kudna gaya hai.',
        hint: 'Pick your old two sizes as the min and max, then build a preferred value that passes through roughly the midpoint at the midpoint width.',
        hintHi: 'Apne purane do sizes ko min aur max banao, phir aisa preferred value banao jo beech ki chaudai par lagbhag beech ke size se guzre.',
      },
      {
        task: 'Add `srcset` and `sizes` to an image that currently only has `src`, using three candidate widths. Open devtools network tab and confirm a narrow viewport requests the smallest file.',
        taskHi: 'Ek aisi image mein `srcset` aur `sizes` jodo jisme abhi sirf `src` hai, teen candidate widths ke saath. Devtools network tab kholo aur confirm karo ki sankri viewport sabse chhoti file maangti hai.',
        hint: 'Resize the devtools device toolbar to a phone width and reload before checking which file was requested.',
        hintHi: 'Kaunsi file maangi gayi ye check karne se pehle devtools device toolbar ko phone width par resize karke reload karo.',
      },
      {
        task: 'Build an image without width/height attributes inside a slow network throttle (devtools) and watch the layout jump when it loads. Then add width/height or aspect-ratio and confirm the jump disappears.',
        taskHi: 'Devtools ke slow network throttle ke andar bina width/height attributes wali image banao aur load hote waqt layout ka kudna dekho. Phir width/height ya aspect-ratio jodo aur confirm karo kudna gaya hai.',
        hint: 'Devtools > Network tab > throttle to "Slow 3G" makes the loading gap long enough to see clearly.',
        hintHi: 'Devtools > Network tab > "Slow 3G" par throttle karne se loading ka gap itna lamba ho jata hai ki saaf dikhe.',
      },
    ],

    keyTakeaways: [
      'Media queries produce fixed steps; `clamp()` produces continuous, jump-free scaling between a minimum and a maximum.',
      'A fluid font-size formula should mix a viewport unit with a `rem` term, or it silently ignores the user\'s font-size preference.',
      '`min()` and `max()` are clamp\'s simpler siblings — one boundary each — and `clamp(a, b, c)` is `max(a, min(b, c))`.',
      '`srcset` + `sizes` let the browser download the smallest image file that still looks sharp at its actual rendered size.',
      '`<picture>` switches between genuinely different image crops for different screens; `srcset` alone only switches resolution of the same crop.',
      'Declared width/height or `aspect-ratio` reserves space before an image loads, preventing a measured, penalised layout shift.',
    ],
    keyTakeawaysHi: [
      'Media queries fixed steps banati hain; `clamp()` minimum aur maximum ke beech lagatar, bina-kudne wali scaling banata hai.',
      'Fluid font-size formula ko viewport unit ko `rem` term ke saath milana chahiye, nahi to wo chupchap user ki font-size pasand anndekha kar deta hai.',
      '`min()` aur `max()` clamp ke aasan bhai-behan hain — har ek ki ek seema — aur `clamp(a, b, c)` matlab `max(a, min(b, c))`.',
      '`srcset` + `sizes` browser ko sabse chhoti image file download karne dete hain jo apni asli render hoti chaudai par phir bhi saaf dikhe.',
      '`<picture>` alag screens ke liye sach mein alag image crops ke beech switch karta hai; akela `srcset` sirf usi crop ka resolution switch karta hai.',
      'Declared width/height ya `aspect-ratio` image load hone se pehle jagah rok leta hai, ek naapa jaane wala, dandit hone wala layout shift rok deta hai.',
    ],
  },
];
