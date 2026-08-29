/**
 * CSS & HTML Complete Course — Module 4 (Responsive), lessons 1–2.
 *
 * Mobile-first media queries, then fluid sizing with clamp(). Mobile-first
 * is taught as a direction of cascade, not a screen-size fact — the broken
 * example is a desktop-first stylesheet whose overrides silently lose to
 * later desktop rules once you add a phone breakpoint on top.
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

export const CSS_MODULE_4: CourseLesson[] = [
  {
    slug: 'css-mobile-first-media-queries',
    title: 'Mobile-First and Media Queries',
    titleHi: 'Mobile-First aur Media Queries',
    description: 'A phone-width fix that works on your phone and silently does nothing on your laptop.',
    descriptionHi: 'Phone-chaudai ka fix jo phone par chalta hai aur laptop par chupchap kuch nahi karta.',
    difficulty: 'MEDIUM',
    duration: 30,
    order: 1,

    analogy: {
      en: '**Packing for a trip versus adding to it.** Desktop-first is packing your whole big suitcase, then trying to *remove* things to fit a carry-on — you are always fighting the bigger version. Mobile-first is the opposite: pack the carry-on first, deciding what genuinely matters, and then *add* extra items only once you know you have more room. The direction changes what "override" means, and it is the entire lesson.',
      hi: '**Trip ke liye samaan bandhna vs jodna.** Desktop-first matlab pehle poora bada suitcase bandhna, phir carry-on mein fit karne ke liye cheezein *hataana* — aap hamesha bade version se lad rahe ho. Mobile-first ulta hai: pehle carry-on bandho, tay karo ki asal mein kya chahiye, aur jab pata chale zyada jagah hai tabhi extra cheezein *jodo*. Ye disha hi "override" ka matlab badal deti hai, aur poora lesson yahi hai.',
    },

    simple: `**Start broken.** A desktop-first stylesheet, written in the order most people write it:

\`\`\`css
.sidebar { width: 300px; float: left; }

@media (max-width: 600px) {
  .sidebar { width: 100%; float: none; }
}
\`\`\`

Looks reasonable. Now a colleague adds a mid-size tablet rule *after* the file grows, without noticing where they put it:

\`\`\`css
.sidebar { width: 300px; float: left; }

@media (max-width: 600px) {
  .sidebar { width: 100%; float: none; }
}

@media (max-width: 900px) {
  .sidebar { width: 250px; float: left; }   /* added later, further down */
}
\`\`\`

On a 500px phone, **both** media queries match — 500px is under both 600px and 900px. Since they carry equal specificity, the one that appears **later in the file wins**, regardless of which range is "more specific" to a human eye. The 900px rule silently overwrites the phone-specific fix, and the phone layout breaks. This is not a rare mistake; it is the default outcome of stacking \`max-width\` queries in the wrong order.

**Mobile-first flips the direction, and the ordering problem disappears**

\`\`\`css
.sidebar { width: 100%; }   /* the default IS the phone layout */

@media (min-width: 600px) {
  .sidebar { width: 250px; float: left; }
}

@media (min-width: 900px) {
  .sidebar { width: 300px; }
}
\`\`\`

With \`min-width\`, each breakpoint only *adds* rules as the screen grows. A 500px phone matches neither \`@media\` block, so it just gets the plain, unconditional CSS — which is exactly the phone layout, because that is what you wrote first. There is no override race to lose, because later blocks can only ever apply to *larger* screens than the ones before them.

**The viewport meta tag — without this, none of it works**

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`

Without this line, mobile browsers render the page at a fake desktop width (usually 980px) and shrink it to fit, so every media query you write is evaluated against a width that has nothing to do with the physical screen. This one tag is not optional — it is a prerequisite for responsive CSS to mean anything at all on a phone.

**Remember:** write the phone layout with no media query at all, then use \`min-width\` to add complexity as space becomes available. You are never fighting a previous, bigger version of the layout.`,

    simpleHi: `**Toote hue se shuru.** Ek desktop-first stylesheet, jaisa zyadatar log likhte hain:

\`\`\`css
.sidebar { width: 300px; float: left; }

@media (max-width: 600px) {
  .sidebar { width: 100%; float: none; }
}
\`\`\`

Theek lagta hai. Ab ek colleague file badhne ke baad *baad mein* ek mid-size tablet rule jodta hai, bina dhyan diye ki wo use kahan rakh raha hai:

\`\`\`css
.sidebar { width: 300px; float: left; }

@media (max-width: 600px) {
  .sidebar { width: 100%; float: none; }
}

@media (max-width: 900px) {
  .sidebar { width: 250px; float: left; }   /* baad mein joda gaya, aur neeche */
}
\`\`\`

500px wale phone par, **dono** media queries match karti hain — 500px dono 600px aur 900px se kam hai. Dono ki specificity barabar hone se, jo **file mein baad mein aata hai wo jeetta hai**, insaani nazar mein kaunsi range "zyada khaas" hai us se koi lena-dena nahi. 900px wala rule chupchap phone-specific fix ko overwrite kar deta hai, aur phone layout toot jata hai. Ye koi durlabh galti nahi hai; galat kram mein \`max-width\` queries lagane ka yahi default nateeja hai.

**Mobile-first disha palat deta hai, aur ordering ki samasya khatam ho jati hai**

\`\`\`css
.sidebar { width: 100%; }   /* default HI phone layout hai */

@media (min-width: 600px) {
  .sidebar { width: 250px; float: left; }
}

@media (min-width: 900px) {
  .sidebar { width: 300px; }
}
\`\`\`

\`min-width\` ke saath, har breakpoint sirf screen bade hone par rules *jodta* hai. 500px wala phone in dono \`@media\` blocks mein se kisi se bhi match nahi karta, isliye use seedhi, bina shart wali CSS milti hai — jo bilkul phone layout hai, kyunki aapne wahi pehle likha tha. Koi override race harne ko nahi hai, kyunki baad wale blocks hamesha unse *bade* screens par hi lagu ho sakte hain jo pehle the.

**Viewport meta tag — iske bina kuch bhi nahi chalta**

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`

Ye line na ho to mobile browsers page ko ek nakli desktop chaudai (aksar 980px) par render karte hain aur use sikoud kar fit karte hain, isliye aapki likhi har media query ek aisi chaudai ke hisaab se check hoti hai jiska asli screen se koi lena-dena nahi. Ye ek tag optional nahi hai — phone par responsive CSS ka kuch bhi matlab hone ke liye ye zaruri sharat hai.

**Yaad rakho:** phone layout bina kisi media query ke likho, phir jaise jagah badhti jaye \`min-width\` se complexity jodo. Aap kabhi bhi layout ke pichle, bade version se ladte hi nahi.`,

    content: `## The syntax

\`\`\`css
@media (min-width: 768px) { /* rules for 768px and wider */ }
@media (max-width: 767px) { /* rules for 767px and narrower */ }
@media (min-width: 768px) and (max-width: 1023px) { /* a band */ }
@media (orientation: landscape) { }
@media (prefers-color-scheme: dark) { }
@media (prefers-reduced-motion: reduce) { }
\`\`\`

## Mobile-first, precisely defined

"Mobile-first" is not about which screen you design for visually first. It is a rule about which direction your media queries point:

\`\`\`css
/* mobile-first: unconditional rules ARE the smallest layout, then min-width ADDS */
.card { padding: 12px; }
@media (min-width: 768px) { .card { padding: 24px; } }

/* desktop-first: unconditional rules ARE the largest layout, then max-width REMOVES */
.card { padding: 24px; }
@media (max-width: 767px) { .card { padding: 12px; } }
\`\`\`

Both can work individually. The reason mobile-first wins as a convention is what happens once you have **three or more** breakpoints, as the broken example showed: \`min-width\` queries never overlap in a way that creates an ordering hazard, because each one only ever adds rules for *larger* screens than the queries above it. \`max-width\` queries stacked in the wrong order can and do overlap, and the later one in the file always wins regardless of intent.

## Common breakpoints (guidelines, not laws)

\`\`\`
no query        phone            (default)
min-width: 600px   large phone / small tablet
min-width: 900px   tablet / small laptop
min-width: 1200px  desktop
\`\`\`

The "right" breakpoints are wherever *your* content starts to look cramped or sparse — resize an actual browser window and watch for the point it breaks, rather than targeting specific device widths. Devices are too varied for any fixed list to be reliable.

## The viewport meta tag

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`

- \`width=device-width\` sets the layout viewport to the device's actual CSS pixel width instead of a fake desktop-sized default.
- \`initial-scale=1\` sets the starting zoom level so 1 CSS pixel maps to 1 device-independent pixel.

Without this tag every media query breakpoint is measured against the wrong number, so nothing responds the way you designed it to.

## Container queries — responding to the parent, not the screen

\`\`\`css
.card-wrap { container-type: inline-size; }

@container (min-width: 400px) {
  .card { display: flex; }
}
\`\`\`

A media query only ever knows about the *viewport*. But a sidebar widget and a full-width hero section can be the same component rendered at wildly different widths on the same page — a media query cannot tell them apart, because both see the same screen size. Container queries solve this: \`container-type: inline-size\` opts an element in as a query context, and its descendants can then respond to *that ancestor's* width rather than the screen's. This makes genuinely reusable components possible in a way viewport queries never could.

## prefers-reduced-motion and prefers-color-scheme

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
@media (prefers-color-scheme: dark) {
  body { background: #111; color: #eee; }
}
\`\`\`

These are not about screen size at all — they read an operating-system-level accessibility or appearance preference. \`prefers-reduced-motion\` matters for users with vestibular disorders who can experience real physical discomfort from large animated motion; it is treated in this course as no less important than a breakpoint.`,

    contentHi: `## Syntax

\`\`\`css
@media (min-width: 768px) { /* 768px aur usse chaudi screens ke liye rules */ }
@media (max-width: 767px) { /* 767px aur usse patli screens ke liye rules */ }
@media (min-width: 768px) and (max-width: 1023px) { /* ek band */ }
@media (orientation: landscape) { }
@media (prefers-color-scheme: dark) { }
@media (prefers-reduced-motion: reduce) { }
\`\`\`

## Mobile-first, seedha define kiya hua

"Mobile-first" iske baare mein nahi hai ki aap kaunsi screen ke liye pehle dikhne mein design karte ho. Ye ek niyam hai ki aapki media queries kis disha mein ishara karti hain:

\`\`\`css
/* mobile-first: bina-shart wale rules HI sabse chhota layout hain, phir min-width JODTA hai */
.card { padding: 12px; }
@media (min-width: 768px) { .card { padding: 24px; } }

/* desktop-first: bina-shart wale rules HI sabse bada layout hain, phir max-width HATATA hai */
.card { padding: 24px; }
@media (max-width: 767px) { .card { padding: 12px; } }
\`\`\`

Dono akele chal sakte hain. Mobile-first ke convention ki tarah jeetne ki wajah wahi hai jo **teen ya usse zyada** breakpoints hone par hota hai, jaise toote example ne dikhaya: \`min-width\` queries kabhi aise overlap nahi karti jisse ordering ka khatra bane, kyunki har ek sirf apne upar wali queries se *bade* screens ke liye rules jodta hai. Galat kram mein rakhi \`max-width\` queries overlap kar sakti hain aur karti hain, aur irade se koi farak nahi padta, file mein baad wali hamesha jeetti hai.

## Aam breakpoints (guidelines, kanoon nahi)

\`\`\`
koi query nahi        phone            (default)
min-width: 600px   bada phone / chhota tablet
min-width: 900px   tablet / chhota laptop
min-width: 1200px  desktop
\`\`\`

"Sahi" breakpoints wahin hain jahan *aapka* content tang ya chhitka dikhna shuru kare — kisi khaas device ki chaudai ka nishana lagane ke bajaye asli browser window resize karo aur dekho kahan wo toot ta hai. Devices itne alag-alag hain ki koi fixed list bharosemand nahi ho sakti.

## Viewport meta tag

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`

- \`width=device-width\` layout viewport ko device ki asli CSS pixel chaudai par set karta hai, ek nakli desktop-size wale default ke bajaye.
- \`initial-scale=1\` shuruaati zoom level set karta hai taaki 1 CSS pixel 1 device-independent pixel ke barabar ho.

Ye tag na ho to har media query breakpoint galat number ke hisaab se naapi jati hai, isliye kuch bhi wese react nahi karta jaise aapne design kiya tha.

## Container queries — parent ke hisaab se react karna, screen ke nahi

\`\`\`css
.card-wrap { container-type: inline-size; }

@container (min-width: 400px) {
  .card { display: flex; }
}
\`\`\`

Media query sirf *viewport* ke baare mein jaanti hai. Par ek sidebar widget aur ek full-width hero section ek hi component ho sakte hain jo ek hi page par bilkul alag chaudai par render ho — media query dono mein fark nahi kar sakti, kyunki dono ek hi screen size dekhte hain. Container queries isse hal karti hain: \`container-type: inline-size\` ek element ko query context ke roop mein chunta hai, aur uske descendants phir screen ke bajaye *us ancestor* ki chaudai ke hisaab se react kar sakte hain. Isse asal mein reuse hone layak components banna sambhav hota hai, jo viewport queries se kabhi mumkin nahi tha.

## prefers-reduced-motion aur prefers-color-scheme

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
@media (prefers-color-scheme: dark) {
  body { background: #111; color: #eee; }
}
\`\`\`

Ye screen size ke baare mein bilkul nahi hain. Ye operating-system-level accessibility ya dikhne ki pasand padhti hain. \`prefers-reduced-motion\` un users ke liye matter karta hai jinhe vestibular disorders hain aur badi animated motion se sach mein sharirik takleef ho sakti hai; is course mein isse ek breakpoint se kam mahatvapoorna nahi maana jata.`,

    examples: [
      {
        title: 'The ordering bug: max-width queries in the wrong order',
        titleHi: 'Ordering bug: galat kram mein max-width queries',
        code: `.box { background: #dbeafe; }
@media (max-width: 600px) { .box { background: #bbf7d0; } }  /* "phone" */
@media (max-width: 900px) { .box { background: #fecaca; } }  /* added later */`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 6px">This preview is roughly 380px wide (phone-sized). Both media queries match here — the LATER one wins:</p>
<div class="box">This box should be green (the phone rule) but the later max-width:900px rule overwrites it to red.</div>`,
`.box { background:#dbeafe; padding:14px; font-size:13px; }
@media (max-width:600px) { .box { background:#bbf7d0; } }
@media (max-width:900px) { .box { background:#fecaca; } }`),
        previewHeight: 130,
        explain: 'Even on a narrow phone-width preview, the box is red, not green — because 380px matches both queries, and CSS resolves the tie by file order, not by which range looks more specific to a human. The 900px rule, written later, always wins here regardless of screen size.',
        explainHi: 'Sankri phone-chaudai wale preview mein bhi, box hara nahi laal hai — kyunki 380px dono queries se match karta hai, aur CSS is tie ko file ke kram se sulzhata hai, na ki insaani nazar mein kaunsi range zyada khaas lagti hai uske hisaab se. Baad mein likha gaya 900px wala rule screen size chahe kuch bhi ho hamesha yahan jeetta hai.',
      },
      {
        title: 'Mobile-first: the same three rules, no ordering hazard',
        titleHi: 'Mobile-first: wahi teen rules, koi ordering khatra nahi',
        code: `.box { background: #bbf7d0; }   /* the phone layout, unconditionally */
@media (min-width: 601px) { .box { background: #fecaca; } }
@media (min-width: 901px) { .box { background: #dbeafe; } }`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 6px">Same phone-width preview. No media query matches below 601px, so the plain rule applies:</p>
<div class="box">Correctly green, matching the phone-first default.</div>`,
`.box { background:#bbf7d0; padding:14px; font-size:13px; }
@media (min-width:601px) { .box { background:#fecaca; } }
@media (min-width:901px) { .box { background:#dbeafe; } }`),
        previewHeight: 130,
        explain: 'Green, correctly. At a narrow width neither `min-width` block matches, so the browser falls through to the unconditional rule — which is the phone layout, by construction. There was never a race to lose.',
        explainHi: 'Sahi se hara. Sankri chaudai par koi `min-width` block match nahi karta, isliye browser bina-shart wale rule tak pahunch jata hai — jo phone layout hai, banawat se hi. Yahan kabhi koi haarne wali race thi hi nahi.',
      },
      {
        title: 'Resizing changes column count as width grows',
        titleHi: 'Resize karne se chaudai badhne par columns badalti hain',
        code: `.grid { grid-template-columns: 1fr; }
@media (min-width: 500px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 800px) { .grid { grid-template-columns: repeat(3, 1fr); } }`,
        preview: page(`<div class="grid">
  <div class="c">1</div><div class="c">2</div><div class="c">3</div><div class="c">4</div><div class="c">5</div><div class="c">6</div>
</div>
<p style="font-size:13px;color:#666;margin-top:8px">Resize your actual browser to see the column count grow: 1 &rarr; 2 &rarr; 3.</p>`,
`.grid { display:grid; grid-template-columns:1fr; gap:8px; }
@media (min-width:500px) { .grid { grid-template-columns:1fr 1fr; } }
@media (min-width:800px) { .grid { grid-template-columns:repeat(3,1fr); } }
.c { background:#dbeafe; border:1px solid #60a5fa; padding:12px; text-align:center; font-size:13px; }`),
        previewHeight: 210,
        explain: 'Each `min-width` block only ever adds more columns as space becomes available, and never has to fight a rule from a "bigger" breakpoint, because bigger breakpoints are always defined later and layer additively on top.',
        explainHi: 'Har `min-width` block sirf jagah badhne par zyada columns jodta hai, aur use kabhi kisi "bade" breakpoint ke rule se ladna nahi padta, kyunki bade breakpoints hamesha baad mein define hote hain aur upar se jud jate hain.',
      },
      {
        title: 'orientation: landscape',
        titleHi: 'orientation: landscape',
        code: `.hero { height: 60vh; }
@media (orientation: landscape) { .hero { height: 90vh; } }`,
        preview: page(`<div class="h">Try this on a phone and rotate it — the height ratio changes.</div>`,
`.h { height:80px; background:#dbeafe; display:flex; align-items:center; justify-content:center; text-align:center; font-size:13px; padding:8px; }`),
        previewHeight: 110,
        explain: '`orientation` is independent of width — a tablet in portrait and a phone in landscape can have similar widths but opposite orientations, and layouts like a full-bleed hero often want to respond to which one it is.',
        explainHi: '`orientation` chaudai se alag hai — portrait wala tablet aur landscape wala phone milti-julti chaudai rakh sakte hain par ulti orientation, aur full-bleed hero jaise layouts aksar chahte hain ki wo isi ke hisaab se react karein.',
      },
      {
        title: 'A media query is just a boolean gate around normal CSS',
        titleHi: 'Media query bas normal CSS ke charon taraf ek boolean darwaza hai',
        code: `@media (min-width: 700px) {
  .a { color: blue; }
  .b { display: flex; }
  h2 { font-size: 28px; }
}`,
        preview: page(`<h2 class="h">Heading</h2>
<p class="a">Coloured text (blue above 700px in a real browser; this preview frame itself is narrow, so nothing here changes)</p>
<div class="b">Flex row (above 700px)</div>
<p style="font-size:13px;color:#666;margin-top:8px">Any number of unrelated rules can share one media query block — it is not limited to one property.</p>`,
`.h { font-size:18px; }
.a { color:#111; }
@media (min-width:700px) { .a { color:blue; } .b { display:flex; } .h { font-size:28px; } }`),
        previewHeight: 190,
        explain: 'A media query is not a special "responsive property" — it is an ordinary CSS block that only activates under a condition, and can contain any number of unrelated selectors and declarations, exactly like `@media` didn\'t exist.',
        explainHi: 'Media query koi khaas "responsive property" nahi hai — ye ek aam CSS block hai jo sirf ek sharat ke tehat activate hota hai, aur usme kitne bhi bina-sambandh selectors aur declarations ho sakte hain, bilkul waise jaise `@media` hota hi nahi.',
      },
      {
        title: 'The viewport meta tag in practice',
        titleHi: 'Viewport meta tag amal mein',
        code: `<!-- missing: mobile browsers fake a 980px-wide desktop and zoom out -->
<meta name="viewport" content="width=device-width, initial-scale=1">`,
        preview: page(`<div class="note">
  <strong>Without the tag:</strong> a 375px phone renders this page as if it were 980px wide, then shrinks the whole thing to fit — text becomes tiny, and every media query is evaluated against 980px, not 375px.<br><br>
  <strong>With the tag:</strong> the phone reports its true 375px width, and a <code>@media (max-width: 480px)</code> rule actually applies.
</div>`,
`.note { font-size:13px; background:#fef3c7; border:1px solid #f59e0b; padding:10px; border-radius:4px; }`),
        previewHeight: 200,
        explain: 'This is the single most common reason "my responsive CSS does nothing on a real phone but works in devtools" — devtools\' device toolbar sets the viewport correctly for you automatically, masking the missing tag.',
        explainHi: '"Meri responsive CSS asli phone par kuch nahi karti par devtools mein chalti hai" ki sabse aam wajah yahi hai — devtools ka device toolbar aapke liye viewport apne aap sahi set kar deta hai, aur gayab tag ko chhupa deta hai.',
      },
      {
        title: 'prefers-reduced-motion respected',
        titleHi: 'prefers-reduced-motion maana gaya',
        code: `.spinner { animation: spin 1s linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .spinner { animation: none; }
}`,
        preview: page(`<div class="spin"></div>
<p style="font-size:13px;color:#666;margin-top:8px">If your OS has "reduce motion" enabled, this circle is static instead of spinning — try it in your system accessibility settings.</p>`,
`.spin { width:36px; height:36px; border:4px solid #dbeafe; border-top-color:#2563eb; border-radius:50%; animation:spin 1s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .spin { animation:none; } }`),
        previewHeight: 90,
        explain: 'This reads an OS-level accessibility setting, not screen size at all. For some users, uncontrolled motion is not a cosmetic annoyance but a source of real physical discomfort — treating this query as optional is treating those users as optional.',
        explainHi: 'Ye screen size nahi, OS-level accessibility setting padhta hai. Kuch users ke liye, bekabu motion sirf dikhne mein pareshaan karne wali cheez nahi, sach mein sharirik takleef ka karan hai — is query ko optional maanna un users ko optional maanna hai.',
      },
      {
        title: 'Container query: the same card responds to its own width',
        titleHi: 'Container query: wahi card apni khud ki chaudai ke hisaab se react karta hai',
        code: `.card-wrap { container-type: inline-size; }
@container (min-width: 300px) { .card { display: flex; gap: 10px; } }`,
        preview: page(`<div class="narrow"><div class="card"><span class="ph"></span><div><strong>Narrow slot</strong><br><small>Stacked — under 300px</small></div></div></div>
<div class="wide"><div class="card"><span class="ph"></span><div><strong>Wide slot</strong><br><small>Row layout — 300px and up</small></div></div></div>`,
`.narrow, .wide { container-type:inline-size; border:1px dashed #94a3b8; padding:8px; margin-bottom:8px; }
.narrow { width:180px; } .wide { width:340px; }
.card { display:block; font-size:13px; }
.ph { display:inline-block; width:30px; height:30px; background:#93c5fd; border-radius:4px; vertical-align:middle; margin-right:6px; }
@container (min-width:300px) { .card { display:flex; align-items:center; gap:10px; } .ph { margin:0; } }`),
        previewHeight: 220,
        explain: 'Both cards use the identical CSS rule. The narrow wrapper stays stacked and the wide one becomes a row — because `@container` reads the width of the nearest `container-type` ancestor, not the browser window, which a `@media` query could never do.',
        explainHi: 'Dono cards ek jaisa CSS rule use karte hain. Sankra wrapper stacked rehta hai aur chauda ek row ban jata hai — kyunki `@container` sabse paas ke `container-type` ancestor ki chaudai padhta hai, browser window ki nahi, jo `@media` query kabhi nahi kar sakti thi.',
      },
      {
        title: 'A band query for one range only',
        titleHi: 'Sirf ek range ke liye band query',
        code: `@media (min-width: 600px) and (max-width: 899px) {
  .layout { grid-template-columns: 1fr 1fr; }
}`,
        preview: page(`<div class="l"><div class="c">Sidebar</div><div class="c">Main</div></div>
<p style="font-size:13px;color:#666;margin-top:8px">This two-column rule applies ONLY between 600px and 899px — narrower or wider, other rules take over (not shown in this static preview).</p>`,
`.l { display:grid; grid-template-columns:1fr; gap:8px; }
@media (min-width:600px) and (max-width:899px) { .l { grid-template-columns:1fr 1fr; } }
.c { background:#dbeafe; padding:10px; font-size:13px; }`),
        previewHeight: 190,
        explain: '`and` combines conditions — both must be true. This is how you target a specific band, like "only tablets", rather than "this width and everything above it".',
        explainHi: '`and` conditions ko jodta hai — dono sach hone chahiye. Isi tarah aap ek khaas band ko nishana banate ho, jaise "sirf tablets", "ye chaudai aur uske upar sab kuch" ke bajaye.',
      },
    ],

    mistakes: [
      {
        wrong: `.box { background: blue; }
@media (max-width: 600px) { .box { background: green; } }
@media (max-width: 900px) { .box { background: red; } }   /* added later, overwrites phones */`,
        right: `.box { background: green; }   /* phone layout, unconditional */
@media (min-width: 601px) { .box { background: red; } }
@media (min-width: 901px) { .box { background: blue; } }`,
        previewWrong: page(`<div class="b">380px wide preview — should be green, is actually red</div>`,
          `.b{background:blue;padding:10px;font-size:12px}@media (max-width:600px){.b{background:green}}@media (max-width:900px){.b{background:red}}`),
        previewRight: page(`<div class="b">380px wide preview — correctly green</div>`,
          `.b{background:green;padding:10px;font-size:12px}@media (min-width:601px){.b{background:red}}@media (min-width:901px){.b{background:blue}}`),
        previewHeight: 100,
        why: 'Two `max-width` queries with overlapping ranges resolve by file order, not by which is "more specific" to a human reader — a later, wider `max-width` block silently wins on narrow screens too. `min-width` blocks never overlap this way.',
        whyHi: 'Overlap hoti range wali do `max-width` queries file ke kram se sulzhti hain, insaani nazar mein kaunsi "zyada khaas" hai uske hisaab se nahi — baad wala, chauda `max-width` block sankri screens par bhi chupchap jeet jata hai. `min-width` blocks kabhi is tarah overlap nahi karte.',
      },
      {
        wrong: `<head><!-- no viewport meta tag --></head>`,
        right: `<head><meta name="viewport" content="width=device-width, initial-scale=1"></head>`,
        why: 'Without it, mobile browsers render at a fake desktop-sized viewport (often 980px) and zoom out to fit — so every media query breakpoint is checked against a number that has nothing to do with the physical screen.',
        whyHi: 'Iske bina, mobile browsers ek nakli desktop-size viewport (aksar 980px) par render karte hain aur fit karne ke liye zoom out karte hain — isliye har media query breakpoint us number ke hisaab se check hoti hai jiska asli screen se koi lena-dena nahi.',
      },
      {
        wrong: `@media (min-width: 375px) { }   /* targeting one specific phone model */`,
        right: `/* resize an actual browser and set breakpoints where YOUR content breaks */`,
        why: 'Device widths change every year and vary hugely even within "phones" — a list of exact device breakpoints is out of date the day it is written. Content-driven breakpoints, found by resizing until something looks cramped, age much better.',
        whyHi: 'Device widths har saal badalte hain aur "phones" ke andar bhi bahut alag-alag hote hain — exact device breakpoints ki list likhte hi purani ho jati hai. Content-driven breakpoints, jo resize karke tab tak dhoondhe jate hain jab tak kuch tang na lage, kaafi behtar chalte hain.',
      },
    ],

    realWorld: [
      {
        en: '**Every production CSS framework since roughly 2015** (Bootstrap 4+, Tailwind) defaults to mobile-first `min-width` breakpoints for exactly this ordering-safety reason, even though the earliest responsive frameworks were desktop-first.',
        hi: '**Lagbhag 2015 se har production CSS framework** (Bootstrap 4+, Tailwind) isi ordering-safety wajah se mobile-first `min-width` breakpoints default karta hai, halaanki sabse pehle wale responsive frameworks desktop-first the.',
      },
      {
        en: '**Component libraries and container queries.** Design systems that ship a `<Card>` component used in both a narrow sidebar and a wide hero section increasingly rely on container queries specifically because a single component cannot know the screen size, only its own slot.',
        hi: '**Component libraries aur container queries.** Design systems jo ek `<Card>` component bhejti hain jo sankri sidebar aur chaudi hero section dono mein use hota hai, ab tezi se container queries par bharosa karti hain khaas taur par isliye ki ek akela component screen size nahi jaan sakta, sirf apni khud ki jagah.',
      },
      {
        en: '**Accessibility audits routinely flag missing `prefers-reduced-motion` support** as a WCAG 2.3.3 issue, alongside colour contrast and resizable text — it is treated as seriously as any other accessibility failure, not as a nice-to-have.',
        hi: '**Accessibility audits aksar gayab `prefers-reduced-motion` support ko flag karte hain** WCAG 2.3.3 issue ki tarah, colour contrast aur resizable text ke saath — ise kisi bhi doosri accessibility chook jitni gambhirta se liya jata hai, ek "achha hota to" wali cheez ki tarah nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What does "mobile-first" mean in CSS, precisely?',
        qHi: '"Mobile-first" CSS mein seedha kya matlab rakhta hai?',
        a: 'It means writing the unconditional, unwrapped CSS rules as the smallest-screen layout, and using `min-width` media queries to layer on additional styling as the viewport grows — rather than writing the largest layout unconditionally and using `max-width` queries to strip styling away for smaller screens. The practical benefit shows up once you have three or more breakpoints: `min-width` queries never create an overlapping-range ordering hazard, because each one only ever adds rules for screens larger than the ones defined above it, while stacked `max-width` queries can and do overlap, with the later rule in the file winning regardless of intent.',
        aHi: 'Iska matlab hai bina-shart, bina-lipti CSS rules ko sabse chhoti screen ke layout ki tarah likhna, aur viewport badhne par extra styling jodne ke liye `min-width` media queries use karna — bade layout ko bina-shart likhne aur chhoti screens ke liye styling hataane ke liye `max-width` queries use karne ke bajaye. Iska amali fayda tab dikhta hai jab teen ya usse zyada breakpoints hon: `min-width` queries kabhi overlap hoti range ka ordering khatra nahi banati, kyunki har ek sirf apne upar wali queries se badi screens ke liye rules jodti hai, jabki stacked `max-width` queries overlap kar sakti hain aur karti hain, aur irade se koi farak nahi padta file mein baad wala rule jeetta hai.',
      },
      {
        q: 'Why does a page look zoomed out and tiny on a phone even though the CSS has media queries in it?',
        qHi: 'CSS mein media queries hone ke bawajood page phone par zoomed out aur chhota kyun dikhta hai?',
        a: 'Almost always a missing viewport meta tag. Without `<meta name="viewport" content="width=device-width, initial-scale=1">`, mobile browsers assume a legacy desktop-sized layout viewport — commonly 980px — render the page at that width, and then zoom the whole thing out to fit the physical screen. Every media query breakpoint is then evaluated against that fake 980px number rather than the phone\'s real width, so responsive rules essentially never trigger as intended.',
        aHi: 'Lagbhag hamesha gayab viewport meta tag. `<meta name="viewport" content="width=device-width, initial-scale=1">` ke bina, mobile browsers ek purani desktop-size layout viewport maan lete hain — aksar 980px — us chaudai par page render karte hain, aur phir poore page ko asli screen mein fit karne ke liye zoom out kar dete hain. Phir har media query breakpoint us nakli 980px number ke hisaab se check hoti hai, phone ki asli chaudai ke hisaab se nahi, isliye responsive rules lagbhag kabhi wese trigger hi nahi hote jaisa socha gaya tha.',
      },
      {
        q: 'What is a container query and how is it different from a media query?',
        qHi: 'Container query kya hai aur wo media query se kaise alag hai?',
        a: 'A media query can only test properties of the viewport — its width, orientation, or the user\'s OS preferences. A container query tests the size of a specific ancestor element that has been opted in with `container-type`, so the same component can respond differently depending on where it is placed on the page, regardless of the overall screen width. This solves a problem media queries structurally cannot: a reusable card component rendered both in a 300px sidebar and a 900px hero section needs two different internal layouts, and both instances share the same viewport width.',
        aHi: 'Media query sirf viewport ki properties test kar sakti hai — uski chaudai, orientation, ya user ki OS pasand. Container query us khaas ancestor element ka size test karti hai jise `container-type` se query context chuna gaya ho, isliye ek hi component page par jahan bhi rakha jaye us jagah ke hisaab se alag react kar sakta hai, poori screen ki chaudai se bekhabar. Ye ek aisi samasya hal karti hai jo media queries banawat se hal nahi kar sakti: ek reusable card component jo 300px sidebar mein bhi render hota hai aur 900px hero section mein bhi, dono jagah alag internal layout chahiye, jabki dono instances ki viewport chaudai ek jaisi hai.',
      },
      {
        q: 'Why should `prefers-reduced-motion` be treated as a required accessibility feature rather than a nice-to-have?',
        qHi: '`prefers-reduced-motion` ko "achha hota to" ke bajaye zaruri accessibility feature kyun maana jaana chahiye?',
        a: 'Because for some users — commonly those with vestibular disorders — large-scale motion on a screen, such as parallax scrolling or sweeping animations, causes real physical symptoms like dizziness or nausea, not just visual annoyance. `prefers-reduced-motion: reduce` reads an operating-system-level setting the user explicitly turned on, so respecting it means honouring an accessibility need the same way you would respect a colour-contrast requirement, and it is checked as part of WCAG audits alongside contrast and resizable text.',
        aHi: 'Kyunki kuch users ke liye — aksar jinhe vestibular disorders hain — screen par bade paimane ki motion, jaise parallax scrolling ya lambi animations, sach mein sharirik lakshan paida karti hai jaise chakkar ya jee michlana, sirf drishya pareshaani nahi. `prefers-reduced-motion: reduce` ek operating-system-level setting padhta hai jo user ne khud jaan-boojh kar on ki, isliye ise maanne ka matlab hai us accessibility zarurat ka utna hi samman karna jitna aap colour-contrast zarurat ka karte ho, aur ye WCAG audits mein contrast aur resizable text ke saath check kiya jata hai.',
      },
      {
        q: 'Should breakpoints be chosen based on specific device widths?',
        qHi: 'Kya breakpoints khaas device widths ke hisaab se chunne chahiye?',
        a: 'No — device widths vary enormously and change every product cycle, so a breakpoint tuned to one exact device is out of date almost immediately. The more durable approach is content-driven: resize an actual browser window and set a breakpoint at whatever width your specific layout starts to look cramped, sparse, or awkward, regardless of which device happens to be that width. Common round numbers like 600px, 900px and 1200px are useful starting guidelines, not rules to match exactly.',
        aHi: 'Nahi — device widths bahut alag-alag hote hain aur har product cycle mein badalte hain, isliye ek exact device ke liye tay kiya gaya breakpoint lagbhag turant purana ho jata hai. Zyada tikaau tarika content-driven hai: asli browser window resize karo aur jis bhi chaudai par aapka khaas layout tang, chhitka, ya ajeeb dikhne lage wahan breakpoint set karo, chahe wo chaudai kisi bhi device ki ho. 600px, 900px, aur 1200px jaise aam gol numbers kaam ke shuruaati guidelines hain, exactly match karne wale niyam nahi.',
      },
    ],

    exercises: [
      {
        task: 'Recreate the ordering bug: write two overlapping `max-width` media queries where the wider one is defined second. Resize to a narrow width and confirm the "wrong" rule wins. Then convert both to `min-width` and confirm the bug disappears.',
        taskHi: 'Ordering bug dobara banao: do overlap karti `max-width` media queries likho jahan chaudi wali doosre number par define ho. Sankri chaudai par resize karo aur confirm karo "galat" rule jeetta hai. Phir dono ko `min-width` mein badlo aur confirm karo bug gayab ho jata hai.',
        hint: 'At a width matched by both queries, whichever block appears later in the file wins — regardless of which `max-width` value is smaller.',
        hintHi: 'Dono queries se match hoti chaudai par, jo block file mein baad mein aata hai wo jeetta hai — chahe koi bhi `max-width` value chhoti ho.',
      },
      {
        task: 'Add the viewport meta tag to a page that lacks it and compare how the layout renders on a simulated phone width before and after.',
        taskHi: 'Jis page mein viewport meta tag nahi hai use jodo aur simulated phone width par layout kaise render hota hai pehle aur baad mein compare karo.',
        hint: 'Use your browser devtools\' device toolbar and toggle the meta tag on and off to see the difference directly.',
        hintHi: 'Apne browser devtools ka device toolbar use karo aur meta tag ko on-off karke fark seedha dekho.',
      },
      {
        task: 'Build one card component and place it inside a narrow container and a wide one on the same page, using a container query to change its internal layout based on its own width.',
        taskHi: 'Ek card component banao aur use ek hi page par ek sankre aur ek chaude container ke andar rakho, container query use karke uska internal layout uski apni chaudai ke hisaab se badlo.',
        hint: 'Set `container-type: inline-size` on the wrapper, not on the card itself, then write `@container` rules that target the card.',
        hintHi: '`container-type: inline-size` wrapper par lagao, card par nahi, phir aise `@container` rules likho jo card ko target karein.',
      },
    ],

    keyTakeaways: [
      'Mobile-first means unconditional CSS is the smallest layout, and `min-width` queries only ever add — never remove — as the screen grows.',
      'Overlapping `max-width` queries resolve by file order, not by logical specificity, which is why stacking them in the wrong order silently breaks phones.',
      'The viewport meta tag is a prerequisite for responsive CSS on real devices, not an optional nicety.',
      'Choose breakpoints where your actual content breaks, not at specific device widths.',
      'Container queries respond to an ancestor\'s width, solving what viewport-only media queries structurally cannot: the same component rendered at different widths on one page.',
      '`prefers-reduced-motion` and `prefers-color-scheme` read OS-level accessibility and appearance preferences, and deserve the same seriousness as any other breakpoint.',
    ],
    keyTakeawaysHi: [
      'Mobile-first matlab bina-shart CSS sabse chhota layout hai, aur `min-width` queries screen badhne par sirf jodti hain — kabhi hataati nahi.',
      'Overlap hoti `max-width` queries file ke kram se sulzhti hain, logical specificity se nahi, isiliye unhe galat kram mein rakhna chupchap phones ko tod deta hai.',
      'Viewport meta tag asli devices par responsive CSS ke liye zaruri sharat hai, ek optional achhi baat nahi.',
      'Breakpoints wahan chuno jahan aapka asli content toota hai, khaas device widths par nahi.',
      'Container queries ancestor ki chaudai ke hisaab se react karte hain, jo sirf-viewport media queries banawat se hal nahi kar sakti: ek hi component ek page par alag chaudaiyon par render hona.',
      '`prefers-reduced-motion` aur `prefers-color-scheme` OS-level accessibility aur dikhne ki pasand padhte hain, aur kisi bhi doosre breakpoint jitni gambhirta ke haqdaar hain.',
    ],
  },
];
