/**
 * CSS & HTML Complete Course — Module 2, lesson 4.
 *
 * Colours, units and typography. The lesson exists mainly to explain why `px`
 * font sizes are an accessibility failure and why `em` compounds when nested —
 * two things that look fine on the author's machine and break for real users.
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

export const CSS_MODULE_2C: CourseLesson[] = [
  {
    slug: 'css-colours-units-type',
    title: 'Colours, Units and Typography',
    titleHi: 'Colours, Units aur Typography',
    description: 'Grams or cups — why one recipe scales when you double it and the other does not.',
    descriptionHi: 'Gram ya katori — ek recipe dugni karne par sambhal jati hai aur doosri nahi.',
    difficulty: 'MEDIUM',
    duration: 32,
    order: 4,

    analogy: {
      en: '**Two ways to write a recipe.** One says "200 grams of flour" — exact, and it never changes. The other says "two cups of flour" — and if you switch to a bigger cup, the whole recipe scales with it. `px` is grams. `rem` is cups. A page written in grams ignores the reader who needs bigger text; a page written in cups grows with them.',
      hi: '**Recipe likhne ke do tarike.** Ek kehti hai "200 gram maida" — pakka, aur kabhi nahi badalta. Doosri kehti hai "do katori maida" — aur badi katori le lo to poori recipe uske saath badh jati hai. `px` gram hai. `rem` katori hai. Gram mein likha page us padhne wale ko anndekha karta hai jise bada text chahiye; katori mein likha page uske saath badh jata hai.',
    },

    simple: `**The units that matter**

\`\`\`css
font-size: 16px;    /* absolute — always exactly 16 device pixels */
font-size: 1rem;    /* relative to the ROOT font size */
font-size: 1.5em;   /* relative to the PARENT font size */
width: 50%;         /* relative to the parent's width */
width: 50vw;        /* half the viewport width */
\`\`\`

**Why \`px\` for text is an accessibility failure**

A user with poor eyesight raises their browser's default font size from 16px to 24px. That is a setting the browser provides precisely so pages can adapt.

\`\`\`css
body { font-size: 16px; }   /* ❌ ignores them completely */
body { font-size: 1rem; }   /* ✅ becomes 24px for them */
\`\`\`

\`1rem\` means "one times the root size", so it follows the user's choice. \`16px\` means sixteen pixels, full stop. This is not a preference — it is the difference between a usable page and an unusable one for a real group of people.

**Then use \`px\` freely for everything else.** Borders, shadows and small fixed gaps should not scale. It is *text* that must.

**\`em\` compounds, and that surprises everyone**

\`em\` is relative to the **parent**, so nesting multiplies:

\`\`\`css
.list { font-size: 0.9em; }
\`\`\`

\`\`\`
level 1: 0.9  × 16 = 14.4px
level 2: 0.9  × 14.4 = 13.0px
level 3: 0.9  × 13.0 = 11.7px   ← shrinking away
\`\`\`

\`rem\` always measures from the root, so it never compounds. **Use \`rem\` unless you specifically want the compounding** — and you occasionally do, for example padding that should grow with its own button's text.

**Colours**

\`\`\`css
color: #2563eb;                  /* hex — most common */
color: rgb(37 99 235);           /* red green blue */
color: rgb(37 99 235 / 50%);     /* with transparency */
color: hsl(221 83% 53%);         /* hue, saturation, lightness */
\`\`\`

\`hsl\` is the one worth learning: keep the hue and change only the lightness and you get a matching set of shades for free. Doing that with hex means guessing.

**Typography that actually matters**

\`\`\`css
line-height: 1.5;      /* unitless — 1.5× this element's font size */
max-width: 65ch;        /* about 65 characters per line */
\`\`\`

Those two do more for readability than any font choice. A line of text longer than roughly 75 characters is genuinely tiring to read, because the eye loses its place returning to the left edge.

Write \`line-height: 1.5\`, never \`1.5em\` — the unitless version recalculates per element instead of being inherited as a fixed pixel value.

**Remember:** \`rem\` for text, \`px\` for borders, unitless \`line-height\`, and cap line length with \`ch\`.`,

    simpleHi: `**Jo units matter karti hain**

\`\`\`css
font-size: 16px;    /* absolute — hamesha bilkul 16 device pixels */
font-size: 1rem;    /* ROOT font size ke hisaab se */
font-size: 1.5em;   /* PARENT font size ke hisaab se */
width: 50%;         /* parent ki chaudai ke hisaab se */
width: 50vw;        /* viewport ki aadhi chaudai */
\`\`\`

**Text ke liye \`px\` accessibility ki chook kyun hai**

Kamzor nazar wala user apne browser ka default font size 16px se 24px kar deta hai. Ye setting browser isiliye deta hai ki pages usse dhal sakein.

\`\`\`css
body { font-size: 16px; }   /* ❌ usse poori tarah anndekha karta hai */
body { font-size: 1rem; }   /* ✅ uske liye 24px ban jata hai */
\`\`\`

\`1rem\` matlab "root size ka ek guna", isliye wo user ki pasand ke saath chalta hai. \`16px\` matlab solah pixels, bas. Ye pasand ki baat nahi hai — logon ke ek asli samooh ke liye ye kaam ke aur bekaar page ka fark hai.

**Baaki har cheez ke liye \`px\` aaram se use karo.** Borders, shadows aur chhote fixed gaps ko scale nahi hona chahiye. Scale *text* ko hona chahiye.

**\`em\` gunit hota jata hai, aur ye sabko chaunkata hai**

\`em\` **parent** ke hisaab se hai, isliye nesting mein guna hota jata hai:

\`\`\`css
.list { font-size: 0.9em; }
\`\`\`

\`\`\`
level 1: 0.9  × 16 = 14.4px
level 2: 0.9  × 14.4 = 13.0px
level 3: 0.9  × 13.0 = 11.7px   ← sikudta ja raha hai
\`\`\`

\`rem\` hamesha root se naapta hai, isliye wo kabhi guna nahi hota. **\`rem\` use karo, jab tak wo guna hona aapko khaas taur par na chahiye** — aur kabhi chahiye bhi hota hai, jaise aisi padding jo apne button ke text ke saath badhe.

**Colours**

\`\`\`css
color: #2563eb;                  /* hex — sabse aam */
color: rgb(37 99 235);           /* red green blue */
color: rgb(37 99 235 / 50%);     /* transparency ke saath */
color: hsl(221 83% 53%);         /* hue, saturation, lightness */
\`\`\`

\`hsl\` seekhne layak hai: hue wahi rakho aur sirf lightness badlo, to milte-julte shades muft mein mil jate hain. Hex se yahi karna andaza lagana hai.

**Jo typography sach mein matter karti hai**

\`\`\`css
line-height: 1.5;      /* bina unit — is element ke font size ka 1.5 guna */
max-width: 65ch;        /* lagbhag 65 characters per line */
\`\`\`

Ye do cheezein readability ke liye kisi bhi font se zyada karti hain. Lagbhag 75 characters se lambi line padhna sach mein thakane wala hai, kyunki aankh baayein kinare par wapas aate waqt apni jagah kho deti hai.

\`line-height: 1.5\` likho, \`1.5em\` kabhi nahi — bina unit wala version har element par dobara nikalta hai, fixed pixel value bankar inherit nahi hota.

**Yaad rakho:** text ke liye \`rem\`, borders ke liye \`px\`, bina unit wali \`line-height\`, aur line ki lambai \`ch\` se seemit karo.`,

    content: `## The unit table

| Unit | Relative to | Use for |
|---|---|---|
| \`px\` | nothing — absolute | borders, shadows, small fixed gaps |
| \`rem\` | the root font size | **font sizes, spacing** |
| \`em\` | the parent font size | padding that should scale with its own text |
| \`%\` | the parent's size | widths |
| \`vw\` / \`vh\` | viewport width / height | full-screen sections |
| \`ch\` | width of the "0" glyph | line-length limits |
| \`fr\` | a share of leftover space | grid tracks only |

## Setting the root

\`\`\`css
html { font-size: 100%; }   /* respects the user's setting — do this */
html { font-size: 62.5%; }  /* ❌ the old "1rem = 10px" trick */
\`\`\`

The 62.5% trick made mental arithmetic easier but shrank the base for everyone who had raised their default. Use \`100%\` and do the arithmetic.

## Colour formats

\`\`\`css
/* hex — 3, 6 or 8 digits (the last two are alpha) */
#f00  #ff0000  #ff0000cc

/* modern space-separated syntax, slash for alpha */
rgb(255 0 0)          rgb(255 0 0 / 80%)
hsl(0 100% 50%)       hsl(0 100% 50% / 80%)

/* keywords */
transparent  currentColor
\`\`\`

\`currentColor\` means "whatever \`color\` is on this element" — ideal for an icon or border that should follow the text:

\`\`\`css
.btn { color: #2563eb; border: 2px solid currentColor; }
\`\`\`

### Why hsl is worth learning

\`\`\`css
--brand-light: hsl(221 83% 70%);
--brand:       hsl(221 83% 53%);
--brand-dark:  hsl(221 83% 35%);
\`\`\`

One hue, three lightness values, a guaranteed-consistent scale. The hex equivalents (\`#7ba2f5\`, \`#2563eb\`, \`#1a3f8f\`) contain the same information but you cannot read the relationship.

## Contrast is a requirement, not a preference

Text needs a contrast ratio of at least **4.5:1** against its background; **3:1** for large text (18pt+ or 14pt bold). Browser devtools shows the ratio when you inspect a colour, and warns when it fails.

Light grey text on white is the most common failure in modern design. It looks refined on a good monitor in a dark room and is unreadable on a phone in daylight.

## Typography

\`\`\`css
font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
font-size: 1rem;
font-weight: 400;      /* 400 normal, 700 bold */
line-height: 1.5;      /* unitless */
letter-spacing: -0.01em;
text-wrap: balance;    /* headings: avoids one lonely word on the last line */
\`\`\`

A **font stack** lists fallbacks left to right. \`system-ui\` uses the operating system's own typeface, which loads instantly because there is nothing to download.

### Web fonts cost something

\`\`\`css
@font-face {
  font-family: "Inter";
  src: url("inter.woff2") format("woff2");
  font-display: swap;   /* show fallback text immediately, swap when ready */
}
\`\`\`

Without \`font-display: swap\` the text is invisible while the font downloads — the "flash of invisible text". On a slow connection that can be several seconds of a blank-looking page.

## Line length

\`\`\`css
.prose { max-width: 65ch; }
\`\`\`

Around 45–75 characters per line is the readable range. Full-width text on a wide monitor is measurably harder to read, because returning to the start of the next line takes longer and the eye loses its place.`,

    contentHi: `## Unit table

| Unit | Kis ke hisaab se | Kis ke liye |
|---|---|---|
| \`px\` | kisi ke nahi — absolute | borders, shadows, chhote fixed gaps |
| \`rem\` | root font size | **font sizes, spacing** |
| \`em\` | parent font size | aisi padding jo apne text ke saath badhe |
| \`%\` | parent ka size | widths |
| \`vw\` / \`vh\` | viewport ki chaudai / oonchai | poori screen wale sections |
| \`ch\` | "0" akshar ki chaudai | line ki lambai seemit karna |
| \`fr\` | bachi hui jagah ka hissa | sirf grid tracks |

## Root set karna

\`\`\`css
html { font-size: 100%; }   /* user ki setting maanta hai — yahi karo */
html { font-size: 62.5%; }  /* ❌ purana "1rem = 10px" jugaad */
\`\`\`

62.5% wale jugaad se dimaag mein hisaab aasan ho jata tha par un sabke liye base chhota ho jata tha jinhone apna default badhaya hua tha. \`100%\` use karo aur hisaab khud karo.

## Colour formats

\`\`\`css
/* hex — 3, 6 ya 8 ank (aakhri do alpha hain) */
#f00  #ff0000  #ff0000cc

/* modern space wala syntax, alpha ke liye slash */
rgb(255 0 0)          rgb(255 0 0 / 80%)
hsl(0 100% 50%)       hsl(0 100% 50% / 80%)

/* keywords */
transparent  currentColor
\`\`\`

\`currentColor\` matlab "is element par \`color\` jo bhi hai" — aise icon ya border ke liye best jo text ke saath chale:

\`\`\`css
.btn { color: #2563eb; border: 2px solid currentColor; }
\`\`\`

### hsl seekhne layak kyun hai

\`\`\`css
--brand-light: hsl(221 83% 70%);
--brand:       hsl(221 83% 53%);
--brand-dark:  hsl(221 83% 35%);
\`\`\`

Ek hue, teen lightness values, aur pakka milta-julta scale. Inke hex roop (\`#7ba2f5\`, \`#2563eb\`, \`#1a3f8f\`) mein wahi jaankari hai par unme rishta padha hi nahi ja sakta.

## Contrast zarurat hai, pasand nahi

Text ka background se contrast ratio kam se kam **4.5:1** hona chahiye; bade text (18pt+ ya 14pt bold) ke liye **3:1**. Browser devtools rang inspect karne par ratio dikhata hai aur fail hone par warning deta hai.

Safed par halka bhoora text modern design ki sabse aam chook hai. Andhere kamre mein achhe monitor par wo shandaar lagta hai aur dhoop mein phone par padha hi nahi jata.

## Typography

\`\`\`css
font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
font-size: 1rem;
font-weight: 400;      /* 400 normal, 700 bold */
line-height: 1.5;      /* bina unit */
letter-spacing: -0.01em;
text-wrap: balance;    /* headings: aakhri line par ek akela shabd nahi chhodta */
\`\`\`

**Font stack** baayein se dayein fallbacks ginta hai. \`system-ui\` operating system ka apna typeface use karta hai, jo turant load hota hai kyunki download karne ko kuch hai hi nahi.

### Web fonts ki keemat hoti hai

\`\`\`css
@font-face {
  font-family: "Inter";
  src: url("inter.woff2") format("woff2");
  font-display: swap;   /* fallback text turant dikhao, taiyar hone par badlo */
}
\`\`\`

Bina \`font-display: swap\` ke font download hone tak text adrishya rehta hai — "flash of invisible text". Slow connection par wo kai second ka khaali dikhta page ho sakta hai.

## Line ki lambai

\`\`\`css
.prose { max-width: 65ch; }
\`\`\`

Lagbhag 45–75 characters per line padhne layak range hai. Chaude monitor par poori chaudai wala text naap kar zyada mushkil hota hai, kyunki agli line ki shuruaat par wapas aane mein zyada waqt lagta hai aur aankh apni jagah kho deti hai.`,

    examples: [
      {
        title: 'px ignores the user; rem follows them',
        titleHi: 'px user ko anndekha karta hai; rem uske saath chalta hai',
        code: `.fixed    { font-size: 16px; }
.scalable { font-size: 1rem; }
/* user sets browser default to 24px */`,
        preview: page(`<div class="sim">
  <p style="font-size:13px;color:#666;margin:0 0 8px">Simulating a user whose browser default is 24px (root font-size raised):</p>
  <p class="fixed">font-size: 16px — unchanged, still small</p>
  <p class="scalable">font-size: 1rem — grew to 24px</p>
</div>`,
`.sim { font-size: 24px; }
.fixed { font-size: 16px; margin:4px 0; background:#fee2e2; padding:4px; }
.scalable { font-size: 1rem; margin:4px 0; background:#dcfce7; padding:4px; }`),
        previewHeight: 200,
        explain: 'The container simulates a raised root size. The `px` text refused to grow; the `rem` text followed. For a user with poor eyesight the first line is simply unreadable, and no amount of zooming fixes a hard-coded pixel value the way font-size does.',
        explainHi: 'Container badhe hue root size ko dikhata hai. `px` wala text badhne se mana kar diya; `rem` wala saath chala. Kamzor nazar wale user ke liye pehli line padhi hi nahi jati, aur hard-coded pixel value ko zoom se wo nahi theek kiya ja sakta jo font-size karta hai.',
      },
      {
        title: 'em compounds when nested',
        titleHi: 'em nesting mein guna hota jata hai',
        code: `.em-list  { font-size: 0.9em; }   /* multiplies each level */
.rem-list { font-size: 0.9rem; }  /* constant at every level */`,
        preview: page(`<div class="em-list">Level 1 (0.9em)
  <div class="em-list">Level 2
    <div class="em-list">Level 3
      <div class="em-list">Level 4 — nearly gone</div>
    </div>
  </div>
</div>
<hr>
<div class="rem-list">Level 1 (0.9rem)
  <div class="rem-list">Level 2
    <div class="rem-list">Level 3
      <div class="rem-list">Level 4 — same size</div>
    </div>
  </div>
</div>`,
`.em-list { font-size:0.9em; padding-left:10px; border-left:2px solid #ef4444; }
.rem-list { font-size:0.9rem; padding-left:10px; border-left:2px solid #10b981; }`),
        previewHeight: 300,
        explain: 'The red column shrinks at every level because each 0.9 multiplies the one above it. The green column stays put because `rem` always measures from the root. This is exactly how nested menus and comment threads end up with unreadable text.',
        explainHi: 'Laal column har level par sikudta hai kyunki har 0.9 apne upar wale se guna hota hai. Hara column wahi rehta hai kyunki `rem` hamesha root se naapta hai. Nested menus aur comment threads mein text bilkul isi tarah padhne layak nahi rehta.',
      },
      {
        title: 'Where em is the right choice',
        titleHi: 'Jahan em sahi choice hai',
        code: `.btn {
  padding: 0.6em 1.2em;   /* scales with the button's own text */
}`,
        preview: page(`<button class="btn" style="font-size:12px">Small</button>
<button class="btn" style="font-size:16px">Medium</button>
<button class="btn" style="font-size:22px">Large</button>
<p style="font-size:13px;color:#666;margin-top:10px">Padding is 0.6em / 1.2em on all three — it grew with each font size automatically.</p>`,
`.btn { padding:0.6em 1.2em; background:#2563eb; color:#fff; border:0; border-radius:4px; margin-right:6px; }`),
        previewHeight: 190,
        explain: 'Here compounding is the feature. One padding rule gives correctly proportioned buttons at any size — with `rem` the large button would look cramped and the small one padded.',
        explainHi: 'Yahan guna hona hi feature hai. Ek padding rule har size par theek anupaat wale buttons deta hai — `rem` se bada button tang lagta aur chhota zyada padding wala.',
      },
      {
        title: 'Percentage, vw and vh',
        titleHi: 'Percentage, vw aur vh',
        code: `.half-parent  { width: 50%; }    /* half the parent */
.half-screen  { width: 50vw; }   /* half the VIEWPORT */`,
        preview: page(`<div class="parent">
  <div class="pc">width: 50% — half of my parent</div>
  <div class="vw">width: 50vw — half the whole viewport, ignores the parent</div>
</div>`,
`.parent { width:60%; border:2px solid #64748b; padding:6px; }
.pc { width:50%; background:#dbeafe; padding:4px; margin-bottom:4px; font-size:13px; }
.vw { width:50vw; background:#fecaca; padding:4px; font-size:13px; }`),
        previewHeight: 180,
        explain: 'The blue box measures against its container; the red one measures against the window and spills out of it. `vw` also includes the scrollbar width, which is why `width: 100vw` often causes a small horizontal scroll.',
        explainHi: 'Neela box apne container se naapta hai; laal window se naapta hai aur uske bahar nikal jata hai. `vw` mein scrollbar ki chaudai bhi shaamil hoti hai, isiliye `width: 100vw` aksar thoda horizontal scroll paida karta hai.',
      },
      {
        title: 'hsl gives you a shade scale for free',
        titleHi: 'hsl muft mein shade scale deta hai',
        code: `--light: hsl(221 83% 70%);
--base:  hsl(221 83% 53%);
--dark:  hsl(221 83% 35%);
/* same hue and saturation, only lightness changes */`,
        preview: page(`<div class="row">
  <span class="sw l1">70%</span><span class="sw l2">53%</span><span class="sw l3">35%</span>
</div>
<p style="font-size:13px;color:#666">hsl(221 83% L) — one number changed</p>
<div class="row">
  <span class="sw h1">#7ba2f5</span><span class="sw h2">#2563eb</span><span class="sw h3">#1a3f8f</span>
</div>
<p style="font-size:13px;color:#666">the same three in hex — the relationship is unreadable</p>`,
`.row { margin-bottom:4px; }
.sw { display:inline-block; padding:10px 14px; color:#fff; font-size:12px; margin-right:4px; }
.l1{background:hsl(221 83% 70%)} .l2{background:hsl(221 83% 53%)} .l3{background:hsl(221 83% 35%)}
.h1{background:#7ba2f5} .h2{background:#2563eb} .h3{background:#1a3f8f}`),
        previewHeight: 210,
        explain: 'Identical colours, two notations. In `hsl` you can see it is one hue at three lightness levels, so generating a hover state or a dark variant is arithmetic instead of guesswork.',
        explainHi: 'Wahi rang, do notation. `hsl` mein dikh jata hai ki ek hue teen lightness par hai, isliye hover state ya dark variant banana andaza lagane ke bajaye ganit ban jata hai.',
      },
      {
        title: 'currentColor follows the text',
        titleHi: 'currentColor text ke saath chalta hai',
        code: `.btn {
  color: #2563eb;
  border: 2px solid currentColor;   /* matches automatically */
}`,
        preview: page(`<button class="btn" style="color:#2563eb">Blue</button>
<button class="btn" style="color:#dc2626">Red</button>
<button class="btn" style="color:#16a34a">Green</button>
<p style="font-size:13px;color:#666;margin-top:10px">One border rule. Change <code>color</code> and the border follows — no second declaration.</p>`,
`.btn { border:2px solid currentColor; background:transparent; padding:6px 12px; border-radius:4px; margin-right:6px; font-size:14px; }`),
        previewHeight: 180,
        explain: 'Three variants from one border rule. Without `currentColor` each variant would need its own `border-color`, and the two would eventually drift apart.',
        explainHi: 'Ek border rule se teen variants. Bina `currentColor` ke har variant ko apna `border-color` chahiye hota, aur ek din dono alag ho jate.',
      },
      {
        title: 'Contrast: refined or unreadable?',
        titleHi: 'Contrast: shandaar ya na-padhne-yogya?',
        code: `.faint { color: #b0b0b0; }   /* 2.3:1 — fails */
.ok    { color: #595959; }   /* 7.0:1 — passes */`,
        preview: page(`<p class="faint">This grey looks elegant on a good monitor. Contrast ratio 2.3:1 — below the 4.5:1 minimum.</p>
<p class="ok">This one passes at 7.0:1 and is readable on a phone in sunlight.</p>
<p style="font-size:13px;color:#666">Devtools shows the ratio when you inspect any colour, and flags failures.</p>`,
`.faint { color:#b0b0b0; }
.ok { color:#595959; }`),
        previewHeight: 210,
        explain: 'Both are legible on a bright screen in a dark room. On a phone outdoors the first disappears. Light grey on white is the most common accessibility failure in modern design, and devtools will tell you the exact ratio.',
        explainHi: 'Andhere kamre mein tez screen par dono padhe jate hain. Bahar phone par pehla gayab ho jata hai. Safed par halka bhoora modern design ki sabse aam accessibility chook hai, aur devtools exact ratio bata deta hai.',
      },
      {
        title: 'Unitless line-height, and why it matters',
        titleHi: 'Bina unit wali line-height, aur wo kyun matter karti hai',
        code: `.good { line-height: 1.5; }     /* recalculates per element */
.bad  { line-height: 1.5em; }   /* inherited as a fixed px value */`,
        preview: page(`<div class="good">
  Parent at 1.5 (unitless)
  <p class="big">Bigger child — line-height recalculated, still comfortable</p>
</div>
<hr>
<div class="bad">
  Parent at 1.5em
  <p class="big">Bigger child — inherited a fixed height, lines now overlap</p>
</div>`,
`.good { line-height:1.5; }
.bad { line-height:1.5em; }
.big { font-size:26px; margin:4px 0; background:#f1f5f9; }`),
        previewHeight: 280,
        explain: 'In the second block the child inherited a computed pixel height from the parent, so its larger text is now cramped against itself. Unitless `line-height` is recalculated by each element from its own font size.',
        explainHi: 'Doosre block mein bachche ne parent se nikli pixel height inherit kar li, isliye uska bada text khud se hi chipak gaya. Bina unit wali `line-height` har element apne font size se dobara nikalta hai.',
      },
      {
        title: 'Line length changes readability',
        titleHi: 'Line ki lambai readability badal deti hai',
        code: `.wide   { max-width: none; }   /* full width — tiring */
.narrow { max-width: 45ch; }   /* comfortable */`,
        preview: page(`<p class="wide">This paragraph runs the full width of its container. On a wide monitor the eye has to travel a long way, and returning to the start of the next line becomes genuinely tiring — you lose your place and re-read the same line.</p>
<p class="narrow">This paragraph is capped at 45ch. Your eye finds the next line without effort, which is why every book, newspaper and well-made website limits line length.</p>`,
`.wide { background:#fee2e2; padding:6px; font-size:13px; }
.narrow { max-width:45ch; background:#dcfce7; padding:6px; font-size:13px; }`),
        previewHeight: 260,
        explain: 'Read both. The second is noticeably easier, and the only difference is one property. `ch` is the width of a "0", so `65ch` is roughly 65 characters regardless of the font.',
        explainHi: 'Dono padho. Doosra saaf taur par aasan hai, aur fark sirf ek property ka hai. `ch` "0" ki chaudai hai, isliye `65ch` font chahe koi bhi ho lagbhag 65 characters hi rehta hai.',
      },
      {
        title: 'A readable type scale in rem',
        titleHi: 'rem mein padhne layak type scale',
        code: `html { font-size: 100%; }        /* respect the user */
h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
p  { font-size: 1rem; line-height: 1.6; max-width: 65ch; }`,
        preview: page(`<h1>Page heading</h1>
<h2>Section heading</h2>
<p>Body text at 1rem with a 1.6 line-height and a 65ch cap. Every size here is a multiple of the user's own base size, so raising the browser default scales the entire page proportionally rather than breaking it.</p>`,
`html { font-size:100%; }
h1 { font-size:2rem; margin:0 0 4px; }
h2 { font-size:1.5rem; margin:0 0 4px; color:#475569; }
p { font-size:1rem; line-height:1.6; max-width:65ch; }`),
        previewHeight: 240,
        explain: 'Every size is relative to one base. Change the root — or let the user change it — and the whole hierarchy scales together, keeping its proportions intact.',
        explainHi: 'Har size ek base ke hisaab se hai. Root badlo — ya user ko badalne do — aur poora hierarchy saath mein scale hota hai, apne anupaat bachate hue.',
      },
    ],

    mistakes: [
      {
        wrong: `body { font-size: 14px; }`,
        right: `body { font-size: 1rem; }   /* or 0.875rem if you want smaller */`,
        previewWrong: page(`<div style="font-size:24px"><p style="font-size:14px;background:#fee2e2;padding:4px">14px — ignores the user's 24px setting</p></div>`),
        previewRight: page(`<div style="font-size:24px"><p style="font-size:1rem;background:#dcfce7;padding:4px">1rem — follows it</p></div>`),
        previewHeight: 120,
        why: 'A pixel font size cannot respond to the user\'s browser setting, so anyone who has increased their default text size gets no benefit at all. Use `rem` for text and `px` for borders.',
        whyHi: 'Pixel wala font size user ki browser setting par react nahi kar sakta, isliye jisne apna default text size badhaya hai use koi fayda hi nahi milta. Text ke liye `rem` aur borders ke liye `px`.',
      },
      {
        wrong: `.menu li { font-size: 0.9em; }   /* nested menus shrink away */`,
        right: `.menu li { font-size: 0.9rem; }`,
        previewWrong: page(`<div class="a">L1<div class="a">L2<div class="a">L3<div class="a">L4</div></div></div></div>`,
          `.a{font-size:0.9em;padding-left:8px;border-left:2px solid #ef4444}`),
        previewRight: page(`<div class="a">L1<div class="a">L2<div class="a">L3<div class="a">L4</div></div></div></div>`,
          `.a{font-size:0.9rem;padding-left:8px;border-left:2px solid #10b981}`),
        previewHeight: 150,
        why: '`em` is relative to the parent, so nesting multiplies the factor at every level. `rem` always measures from the root and never compounds.',
        whyHi: '`em` parent ke hisaab se hai, isliye nesting har level par factor guna kar deti hai. `rem` hamesha root se naapta hai aur kabhi guna nahi hota.',
      },
      {
        wrong: `html { font-size: 62.5%; }   /* the "1rem = 10px" trick */`,
        right: `html { font-size: 100%; }`,
        why: 'It makes the arithmetic easier but shrinks the base for every user who raised their default font size, undoing the accessibility benefit `rem` exists to provide.',
        whyHi: 'Isse hisaab aasan ho jata hai par un sab users ke liye base chhota ho jata hai jinhone apna default font size badhaya tha, aur `rem` ka poora accessibility fayda khatam ho jata hai.',
      },
      {
        wrong: `.container { line-height: 1.5em; }`,
        right: `.container { line-height: 1.5; }`,
        why: 'With a unit the computed pixel value is inherited, so a child with larger text keeps the parent\'s line height and its lines crowd together. Unitless recalculates per element.',
        whyHi: 'Unit ke saath nikli hui pixel value inherit hoti hai, isliye bade text wala bachcha parent ki line height rakhta hai aur uski lines chipak jati hain. Bina unit wali har element par dobara nikalti hai.',
      },
    ],

    realWorld: [
      {
        en: '**Accessibility audits.** "Font sizes are not resizable" and "insufficient colour contrast" are the two most common findings in any WCAG audit — both are decided by the choices in this lesson.',
        hi: '**Accessibility audits.** "Font sizes resize nahi hote" aur "contrast kam hai" kisi bhi WCAG audit ki sabse aam do khamiyan hain — dono is lesson ke faislon se tay hoti hain.',
      },
      {
        en: '**Design tokens.** Design systems define colour scales in `hsl` and spacing in `rem` precisely so a single root change rescales or recolours the whole product consistently.',
        hi: '**Design tokens.** Design systems rang `hsl` mein aur spacing `rem` mein isiliye likhte hain ki root ka ek badlav poore product ka size ya rang ek saath badal de.',
      },
      {
        en: '**Article layouts.** Every well-read site caps body text around 65–75 characters. Medium, Substack and the Guardian all do it, and it is a single `max-width` in `ch`.',
        hi: '**Article layouts.** Har padhi jane wali site body text 65–75 characters par seemit karti hai. Medium, Substack aur Guardian sab karte hain, aur wo `ch` mein ek `max-width` hi hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `rem` and `em`?',
        qHi: '`rem` aur `em` mein kya fark hai?',
        a: 'Both are relative, but to different things. `em` is relative to the font size of the element itself (or its parent, for `font-size`), so nesting compounds the factor at every level. `rem` is always relative to the root element\'s font size, so it never compounds. Use `rem` for type and spacing scales, and `em` when a value should scale with its own element\'s text — button padding, for example.',
        aHi: 'Dono relative hain, par alag cheezon ke. `em` khud element ke font size ke hisaab se hai (ya `font-size` ke liye uske parent ke), isliye nesting har level par factor guna kar deti hai. `rem` hamesha root element ke font size ke hisaab se hai, isliye wo kabhi guna nahi hota. Type aur spacing scales ke liye `rem`, aur jab value ko apne hi element ke text ke saath badhna ho — jaise button ki padding — tab `em`.',
      },
      {
        q: 'Why should font sizes not be set in pixels?',
        qHi: 'Font sizes pixels mein kyun nahi set karne chahiye?',
        a: 'Because a pixel value cannot respond to the user\'s browser font-size preference. Someone who has raised their default from 16px to 24px because of poor eyesight sees no change at all on a page using `px` text. Using `rem` makes every size a multiple of that preference, so the page scales with them. Borders, shadows and small fixed gaps can stay in `px` — it is text specifically that must scale.',
        aHi: 'Kyunki pixel value user ki browser font-size pasand par react nahi kar sakti. Jisne kamzor nazar ki wajah se apna default 16px se 24px kiya hai, use `px` wale text par koi fark hi nahi dikhta. `rem` use karne se har size us pasand ka guna ban jata hai, isliye page uske saath scale hota hai. Borders, shadows aur chhote fixed gaps `px` mein reh sakte hain — scale khaas taur par text ko hona chahiye.',
      },
      {
        q: 'Why is unitless `line-height` preferred?',
        qHi: 'Bina unit wali `line-height` kyun behtar hai?',
        a: 'A unitless value is inherited as a multiplier, so each element recomputes its line height from its own font size. With a unit — `1.5em` or `24px` — the *computed* value is inherited, so a child with larger text keeps the parent\'s line height and its lines crowd or overlap. `line-height: 1.5` is correct at every size.',
        aHi: 'Bina unit wali value multiplier ki tarah inherit hoti hai, isliye har element apni line height apne font size se dobara nikalta hai. Unit ke saath — `1.5em` ya `24px` — *nikli hui* value inherit hoti hai, isliye bade text wala bachcha parent ki line height rakhta hai aur uski lines chipak ya overlap ho jati hain. `line-height: 1.5` har size par sahi rehta hai.',
      },
      {
        q: 'Why use `hsl` rather than hex?',
        qHi: 'Hex ke bajaye `hsl` kyun use karein?',
        a: 'Because it is readable and manipulable. `hsl` separates hue, saturation and lightness, so a hover state or a dark variant is a change to one number, and a whole shade scale shares an obviously consistent hue. The hex equivalents encode the same colours but the relationship between them is invisible, so building a consistent palette becomes guesswork.',
        aHi: 'Kyunki wo padhi ja sakti hai aur badli ja sakti hai. `hsl` hue, saturation aur lightness ko alag karta hai, isliye hover state ya dark variant ek number ka badlav hai, aur poora shade scale ek saaf dikhta hua hue share karta hai. Hex mein wahi rang hote hain par unke beech ka rishta dikhta hi nahi, isliye ek jaisa palette banana andaza ban jata hai.',
      },
      {
        q: 'What contrast ratio does text need, and why does it matter?',
        qHi: 'Text ko kitna contrast ratio chahiye, aur wo kyun matter karta hai?',
        a: 'At least 4.5:1 against its background for normal text, and 3:1 for large text — 18pt, or 14pt bold and above. It matters because contrast that looks refined on a good monitor in a dark room can be completely unreadable on a phone in daylight, or for anyone with reduced vision. Light grey on white is the most common failure, and browser devtools reports the exact ratio when you inspect a colour.',
        aHi: 'Normal text ke liye background se kam se kam 4.5:1, aur bade text ke liye 3:1 — 18pt, ya 14pt bold aur upar. Ye isliye matter karta hai ki jo contrast andhere kamre mein achhe monitor par shandaar lagta hai, wo dhoop mein phone par ya kamzor nazar wale ke liye poori tarah na-padhne-yogya ho sakta hai. Safed par halka bhoora sabse aam chook hai, aur browser devtools rang inspect karne par exact ratio bata deta hai.',
      },
    ],

    exercises: [
      {
        task: 'Build a page using only `rem` for text, then raise your browser default font size to 24px in settings and confirm the whole page scales.',
        taskHi: 'Aisa page banao jisme text sirf `rem` mein ho, phir browser settings mein default font size 24px karo aur confirm karo ki poora page scale hota hai.',
        hint: 'Chrome: Settings → Appearance → Font size. Then swap one heading to `px` and watch only that element refuse to grow.',
        hintHi: 'Chrome: Settings → Appearance → Font size. Phir ek heading ko `px` karo aur dekho sirf wahi element badhne se mana karta hai.',
      },
      {
        task: 'Nest four divs each with `font-size: 0.9em`, then change them all to `0.9rem`. Measure the innermost text both times.',
        taskHi: 'Chaar divs nest karo, har ek par `font-size: 0.9em`, phir sabko `0.9rem` karo. Dono baar sabse andar wala text naapo.',
        hint: 'The `em` version reaches about 10.5px by level four; the `rem` version stays at 14.4px throughout.',
        hintHi: '`em` wala version chauthe level tak lagbhag 10.5px pahunch jata hai; `rem` wala 14.4px par hi rehta hai.',
      },
      {
        task: 'Build a three-step colour scale in `hsl` sharing one hue, then write the same three colours in hex and compare which version you could extend to five steps.',
        taskHi: '`hsl` mein ek hue wala teen-step colour scale banao, phir wahi teen rang hex mein likho aur compare karo ki kaunse version ko paanch steps tak badhana aasan hai.',
        hint: 'With `hsl` you interpolate the lightness numbers. With hex you open a colour picker and guess.',
        hintHi: '`hsl` mein aap lightness ke numbers ke beech ka nikaal lete ho. Hex mein colour picker kholkar andaza lagate ho.',
      },
    ],

    keyTakeaways: [
      '`rem` for font sizes and spacing; `px` is fine for borders and shadows.',
      'A `px` font size ignores the user\'s browser preference — that is an accessibility failure, not a style choice.',
      '`em` is relative to the parent so it compounds when nested; `rem` measures from the root and never does.',
      'Write `line-height: 1.5` unitless, so each element recalculates from its own font size.',
      '`hsl` makes shade scales readable and derivable; `currentColor` keeps borders and icons in sync with text.',
      'Text needs 4.5:1 contrast, and capping line length near 65ch does more for readability than any font.',
    ],
    keyTakeawaysHi: [
      'Font sizes aur spacing ke liye `rem`; borders aur shadows ke liye `px` theek hai.',
      '`px` wala font size user ki browser pasand ko anndekha karta hai — ye accessibility ki chook hai, style ki pasand nahi.',
      '`em` parent ke hisaab se hai isliye nesting mein guna hota hai; `rem` root se naapta hai aur kabhi guna nahi hota.',
      '`line-height: 1.5` bina unit likho, taaki har element apne font size se dobara nikale.',
      '`hsl` shade scales ko padhne aur banane layak banata hai; `currentColor` borders aur icons ko text ke saath jodta hai.',
      'Text ko 4.5:1 contrast chahiye, aur line ki lambai 65ch ke aas-paas rokna kisi bhi font se zyada readability deta hai.',
    ],
  },
];
