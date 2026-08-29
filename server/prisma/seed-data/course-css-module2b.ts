/**
 * CSS & HTML Complete Course — Module 2, lessons 3 and 4.
 *
 * The box model and units. Between them these explain "my 300px box is 340px
 * wide", "my two 50% columns will not sit side by side", and "my text ignores
 * the user's font-size setting".
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

export const CSS_MODULE_2B: CourseLesson[] = [
  /* ══════════════════════ The Box Model ══════════════════════ */
  {
    slug: 'css-box-model',
    title: 'The Box Model',
    titleHi: 'Box Model',
    description: 'Why your 300px box is 340px wide, and the one line that fixes it everywhere.',
    descriptionHi: 'Aapka 300px ka box 340px chauda kyun hai, aur wo ek line jo isse har jagah theek kar deti hai.',
    difficulty: 'MEDIUM',
    duration: 32,
    order: 3,

    analogy: {
      en: '**A framed photograph on a wall.** There is the photo itself, the white mount around it, the wooden frame, and the gap to the next picture. Now the question that causes every layout bug: when you order a **"300mm frame"**, do you mean the photo, or the whole thing including mount and wood? CSS originally meant the photo. Almost nobody wants that.',
      hi: '**Deewar par laga framed photo.** Usme khud photo hai, uske charon or safed mount, lakdi ka frame, aur agli tasveer tak ka gap. Ab wo sawal jo har layout bug ka kaaran hai: jab aap **"300mm ka frame"** mangwate ho, aapka matlab photo hai, ya mount aur lakdi samet poori cheez? CSS ka asli matlab photo tha. Aur lagbhag koi bhi wo nahi chahta.',
    },

    simple: `**Every element is four layers**

\`\`\`
┌─────────────────────────────┐
│  margin      (gap outside)  │
│  ┌───────────────────────┐  │
│  │  border               │  │
│  │  ┌─────────────────┐  │  │
│  │  │  padding        │  │  │
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  content  │  │  │  │
\`\`\`

- **content** — the text or image
- **padding** — space *inside*, pushing the border out. Takes the background colour.
- **border** — the visible line
- **margin** — space *outside*, pushing other elements away. Always transparent.

**Now the bug**

\`\`\`css
.box {
  width: 300px;
  padding: 20px;
  border: 2px solid;
}
\`\`\`

How wide is that on screen? Not 300px. It is **344px**:

\`\`\`
300 (content) + 20 + 20 (padding) + 2 + 2 (border) = 344
\`\`\`

By default \`width\` sets the **content** only. Everything else is added on top. So two boxes at \`width: 50%\` with any padding will not fit side by side — together they are wider than their parent.

**The one line that fixes it**

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

Now \`width: 300px\` means the **whole box is 300px**, and padding and border eat into it from the inside. That is what everyone expects, and it is why this rule is at the top of practically every real stylesheet.

**Margins do something surprising: they collapse**

\`\`\`css
.a { margin-bottom: 30px; }
.b { margin-top: 20px; }
\`\`\`

The gap between them is **30px**, not 50px. Adjacent vertical margins collapse to the larger of the two. Horizontal margins never collapse.

This is why setting \`margin-bottom\` on paragraphs gives even spacing instead of doubling up — it is a feature, but it surprises everyone once.

**Centring a block**

\`\`\`css
.box { width: 300px; margin: 0 auto; }
\`\`\`

\`auto\` on both sides splits the leftover space equally. It needs a width to work — without one the box is already full width and there is nothing to share.

**Remember:** \`box-sizing: border-box\` on everything. Padding is inside, margin is outside, and vertical margins collapse.`,

    simpleHi: `**Har element chaar parton ka hai**

\`\`\`
┌─────────────────────────────┐
│  margin      (bahar ka gap) │
│  ┌───────────────────────┐  │
│  │  border               │  │
│  │  ┌─────────────────┐  │  │
│  │  │  padding        │  │  │
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  content  │  │  │  │
\`\`\`

- **content** — text ya image
- **padding** — *andar* ki jagah, jo border ko bahar dhakelti hai. Background rang leti hai.
- **border** — dikhne wali line
- **margin** — *bahar* ki jagah, jo doosre elements ko door karti hai. Hamesha transparent.

**Ab bug**

\`\`\`css
.box {
  width: 300px;
  padding: 20px;
  border: 2px solid;
}
\`\`\`

Screen par wo kitna chauda hai? 300px nahi. **344px**:

\`\`\`
300 (content) + 20 + 20 (padding) + 2 + 2 (border) = 344
\`\`\`

Default mein \`width\` sirf **content** set karta hai. Baaki sab uske upar juda jata hai. Isliye \`width: 50%\` wale do boxes jinme thodi bhi padding hai, bagal-bagal fit nahi honge — dono milkar apne parent se chaude ho jate hain.

**Wo ek line jo isse theek karti hai**

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

Ab \`width: 300px\` ka matlab hai **poora box 300px**, aur padding aur border usi ke andar se jagah lete hain. Sab yahi expect karte hain, aur isiliye ye rule lagbhag har asli stylesheet ke sabse upar hota hai.

**Margins ek chaunkane wali cheez karte hain: wo collapse hote hain**

\`\`\`css
.a { margin-bottom: 30px; }
.b { margin-top: 20px; }
\`\`\`

Unke beech ka gap **30px** hai, 50px nahi. Bagal-bagal wale vertical margins bade wale par collapse ho jate hain. Horizontal margins kabhi collapse nahi hote.

Isiliye paragraphs par \`margin-bottom\` lagane se barabar spacing milti hai, dugni nahi — ye feature hai, par ek baar sabko chaunkata hai.

**Block ko beech mein laana**

\`\`\`css
.box { width: 300px; margin: 0 auto; }
\`\`\`

Dono taraf \`auto\` bachi hui jagah barabar baant deta hai. Iske liye width chahiye — bina width ke box pehle hi poori chaudai le leta hai aur baantne ko kuch bachta hi nahi.

**Yaad rakho:** har cheez par \`box-sizing: border-box\`. Padding andar, margin bahar, aur vertical margins collapse hote hain.`,

    content: `## The shorthand order

\`\`\`css
padding: 10px;                  /* all four sides */
padding: 10px 20px;             /* vertical | horizontal */
padding: 10px 20px 30px;        /* top | horizontal | bottom */
padding: 10px 20px 30px 40px;   /* top right bottom left — clockwise */
\`\`\`

Four values run clockwise from the top. \`margin\` takes the same shapes.

## The two box-sizing values

\`\`\`css
box-sizing: content-box;   /* default: width = content only */
box-sizing: border-box;    /* width = content + padding + border */
\`\`\`

\`\`\`css
/* content-box */  width: 300px; padding: 20px; border: 2px  →  344px on screen
/* border-box  */  width: 300px; padding: 20px; border: 2px  →  300px on screen
\`\`\`

Neither includes margin — margin is always outside the box.

## Margin collapsing, precisely

Three cases where vertical margins collapse:

\`\`\`css
/* 1. Adjacent siblings — the larger wins */
.a { margin-bottom: 30px } .b { margin-top: 20px }   /* gap = 30px */

/* 2. Parent and first/last child, if no border or padding separates them */
.parent { }                 /* child's margin-top escapes the parent */
.parent { padding-top: 1px } /* now it does not */

/* 3. An empty element collapses its own top and bottom together */
\`\`\`

Collapsing does **not** happen in flex or grid containers, or with \`overflow: hidden\`, or on floated and absolutely positioned elements. Modern layouts using flex or grid simply do not experience it — which is another reason to prefer them.

## Sizing constraints

\`\`\`css
width: 300px;
min-width: 200px;     /* never narrower */
max-width: 100%;      /* never overflow the parent */
height: auto;         /* grow with content — usually correct */
\`\`\`

\`max-width: 100%\` on images is the single most valuable responsive rule there is: it stops a 2000px photo from forcing a horizontal scrollbar on a phone.

Avoid fixed \`height\` on anything holding text. Translate the page, let the user raise their font size, and fixed-height boxes overflow.

## Overflow

\`\`\`css
overflow: visible;   /* default — content spills out */
overflow: hidden;    /* clipped, no scrollbar */
overflow: auto;      /* scrollbar only when needed — usually what you want */
overflow: scroll;    /* scrollbar always */
\`\`\`

## display: none versus visibility: hidden

\`\`\`css
display: none;        /* removed from layout, takes no space, hidden from screen readers */
visibility: hidden;   /* invisible but still occupies its space */
opacity: 0;           /* invisible, still occupies space, still clickable */
\`\`\`

\`opacity: 0\` is the trap — the element is invisible but still receives clicks, so users hit an invisible button.`,

    contentHi: `## Shorthand ka kram

\`\`\`css
padding: 10px;                  /* charon taraf */
padding: 10px 20px;             /* upar-neeche | dayein-baayein */
padding: 10px 20px 30px;        /* upar | dayein-baayein | neeche */
padding: 10px 20px 30px 40px;   /* upar dayein neeche baayein — ghadi ki disha */
\`\`\`

Chaar values upar se ghadi ki disha mein chalti hain. \`margin\` bhi wahi aakaar leta hai.

## box-sizing ki do values

\`\`\`css
box-sizing: content-box;   /* default: width = sirf content */
box-sizing: border-box;    /* width = content + padding + border */
\`\`\`

\`\`\`css
/* content-box */  width: 300px; padding: 20px; border: 2px  →  screen par 344px
/* border-box  */  width: 300px; padding: 20px; border: 2px  →  screen par 300px
\`\`\`

Dono mein margin shaamil nahi hai — margin hamesha box ke bahar hota hai.

## Margin collapsing, theek se

Teen case jahan vertical margins collapse hote hain:

\`\`\`css
/* 1. Bagal-bagal wale siblings — bada jeetta hai */
.a { margin-bottom: 30px } .b { margin-top: 20px }   /* gap = 30px */

/* 2. Parent aur pehla/aakhri bachcha, agar beech mein border ya padding na ho */
.parent { }                 /* bachche ka margin-top parent se bahar nikal jata hai */
.parent { padding-top: 1px } /* ab nahi nikalta */

/* 3. Khaali element apna upar aur neeche ka margin aapas mein collapse kar leta hai */
\`\`\`

Collapsing flex ya grid containers mein, ya \`overflow: hidden\` ke saath, ya floated aur absolutely positioned elements par **nahi** hoti. Flex ya grid wale modern layouts isse jhelte hi nahi — aur unhe chunne ka ek aur kaaran yahi hai.

## Sizing ki seemaayein

\`\`\`css
width: 300px;
min-width: 200px;     /* isse patla kabhi nahi */
max-width: 100%;      /* parent se bahar kabhi nahi */
height: auto;         /* content ke saath badho — aksar yahi sahi hai */
\`\`\`

Images par \`max-width: 100%\` sabse kaam ka responsive rule hai: wo 2000px ki photo ko phone par horizontal scrollbar laane se rok deta hai.

Jisme text hai uspar fixed \`height\` se bacho. Page translate karo, user font size badhaye, aur fixed-height boxes se content bahar nikal jata hai.

## Overflow

\`\`\`css
overflow: visible;   /* default — content bahar nikal jata hai */
overflow: hidden;    /* kat jata hai, scrollbar nahi */
overflow: auto;      /* scrollbar sirf zarurat par — aksar yahi chahiye */
overflow: scroll;    /* scrollbar hamesha */
\`\`\`

## display: none versus visibility: hidden

\`\`\`css
display: none;        /* layout se hata, jagah nahi leta, screen readers se chhupa */
visibility: hidden;   /* adrishya par apni jagah leta hai */
opacity: 0;           /* adrishya, jagah leta hai, aur click bhi hota hai */
\`\`\`

\`opacity: 0\` jaal hai — element adrishya hai par click phir bhi leta hai, isliye user adrishya button daba deta hai.`,

    examples: [
      {
        title: 'The four layers, visible',
        titleHi: 'Chaar parten, aankhon se',
        code: `.box {
  margin: 16px;
  border: 4px solid #7c3aed;
  padding: 16px;
  background: #ede9fe;
}`,
        preview: page(`<div class="outer"><div class="box">content</div></div>`,
`.outer { background:#fca5a5; display:inline-block; }
.box { margin:16px; border:4px solid #7c3aed; padding:16px; background:#ede9fe; }`),
        previewHeight: 150,
        explain: 'Red is the margin (it shows the parent behind, because margin is always transparent). Purple is the border, and the light fill is padding plus content — padding takes the background, margin never does.',
        explainHi: 'Laal margin hai (peeche parent dikh raha hai, kyunki margin hamesha transparent hota hai). Baingani border hai, aur halka bhara hissa padding aur content — padding background leti hai, margin kabhi nahi.',
      },
      {
        title: 'The 300px box that is 344px',
        titleHi: 'Wo 300px box jo 344px hai',
        code: `.a { width: 300px; padding: 20px; border: 2px solid; }
/* content-box (default) → 344px on screen */`,
        preview: page(`<div class="ruler">300px</div>
<div class="a">width:300px + padding:20px + border:2px</div>
<p style="font-size:13px;color:#666">The box overshoots the ruler by 44px.</p>`,
`.ruler { width:300px; background:#cbd5e1; font-size:12px; text-align:center; margin-bottom:6px; }
.a { width:300px; padding:20px; border:2px solid #dc2626; background:#fee2e2; box-sizing:content-box; }`),
        previewHeight: 190,
        explain: 'The grey bar is exactly 300px. The box below asked for `width: 300px` and is visibly wider, because padding and border were added outside the declared width.',
        explainHi: 'Bhoori patti bilkul 300px hai. Neeche wale box ne `width: 300px` maanga tha aur saaf chauda hai, kyunki padding aur border declared width ke bahar jode gaye.',
      },
      {
        title: 'border-box makes width mean what you meant',
        titleHi: 'border-box se width ka wahi matlab hota hai jo aapka tha',
        code: `.b {
  box-sizing: border-box;
  width: 300px; padding: 20px; border: 2px solid;
}`,
        preview: page(`<div class="ruler">300px</div>
<div class="b">border-box: still exactly 300px</div>`,
`.ruler { width:300px; background:#cbd5e1; font-size:12px; text-align:center; margin-bottom:6px; }
.b { box-sizing:border-box; width:300px; padding:20px; border:2px solid #16a34a; background:#dcfce7; }`),
        previewHeight: 160,
        explain: 'Identical declarations, one extra property, and the box now lines up with the ruler exactly. Padding and border eat inward instead of growing outward.',
        explainHi: 'Wahi declarations, ek extra property, aur ab box ruler ke saath bilkul milta hai. Padding aur border bahar badhne ke bajaye andar se jagah lete hain.',
      },
      {
        title: 'Two 50% columns that will not fit',
        titleHi: 'Do 50% columns jo fit nahi hote',
        code: `.col { width: 50%; padding: 15px; float: left; }
/* 50% + 30px each → wider than the parent */`,
        preview: page(`<div class="wrap bad"><div class="col">A</div><div class="col">B</div></div>
<p style="font-size:13px;color:#666;clear:both">content-box: B is pushed onto a second row.</p>
<div class="wrap good"><div class="col2">A</div><div class="col2">B</div></div>
<p style="font-size:13px;color:#666;clear:both">border-box: they fit.</p>`,
`.wrap { border:2px solid #64748b; overflow:hidden; margin-bottom:4px; }
.col { width:50%; padding:15px; float:left; background:#fee2e2; box-sizing:content-box; }
.col2 { width:50%; padding:15px; float:left; background:#dcfce7; box-sizing:border-box; }`),
        previewHeight: 260,
        explain: 'This is the most common layout bug there is. Each column is 50% *plus* 30px of padding, so the pair exceeds 100% and the second wraps. `border-box` makes 50% mean 50% of everything.',
        explainHi: 'Ye sabse aam layout bug hai. Har column 50% *aur* 30px padding hai, isliye jodi 100% se badh jati hai aur doosra neeche chala jata hai. `border-box` se 50% ka matlab poore box ka 50% hota hai.',
      },
      {
        title: 'The global reset',
        titleHi: 'Global reset',
        code: `*, *::before, *::after {
  box-sizing: border-box;
}`,
        preview: page(`<div class="ruler">200px</div>
<div class="x">200px with padding and border</div>
<p style="font-size:13px;color:#666">One rule at the top of the stylesheet and every box on the page behaves this way.</p>`,
`*, *::before, *::after { box-sizing:border-box; }
.ruler { width:200px; background:#cbd5e1; font-size:12px; text-align:center; margin-bottom:6px; }
.x { width:200px; padding:14px; border:3px solid #2563eb; background:#dbeafe; }`),
        previewHeight: 190,
        explain: 'Write this once and never think about the box model again. It is the first rule in almost every real stylesheet and every CSS framework.',
        explainHi: 'Ise ek baar likho aur box model ke baare mein phir kabhi mat socho. Ye lagbhag har asli stylesheet aur har CSS framework ka pehla rule hai.',
      },
      {
        title: 'Vertical margins collapse',
        titleHi: 'Vertical margins collapse hote hain',
        code: `.a { margin-bottom: 40px; }
.b { margin-top: 20px; }
/* gap is 40px, not 60px */`,
        preview: page(`<div class="a">margin-bottom: 40px</div>
<div class="b">margin-top: 20px</div>
<p style="font-size:13px;color:#666">The gap between them is 40px — the larger margin, not the sum.</p>`,
`.a { background:#fde68a; padding:6px; margin-bottom:40px; }
.b { background:#bfdbfe; padding:6px; margin-top:20px; }`),
        previewHeight: 210,
        explain: 'Adjacent vertical margins collapse to the larger value. It keeps spacing even when every paragraph has a bottom margin — useful, but it catches everyone the first time they try to add margins together.',
        explainHi: 'Bagal-bagal wale vertical margins bade wale par collapse ho jate hain. Isse spacing barabar rehti hai jab har paragraph par bottom margin ho — kaam ka hai, par pehli baar margins jodne ki koshish par sabko pakadta hai.',
      },
      {
        title: 'Collapsing stops in a flex container',
        titleHi: 'Flex container mein collapsing ruk jati hai',
        code: `.normal { }                /* margins collapse: 40px */
.flex   { display: flex;
          flex-direction: column; }  /* no collapsing: 60px */`,
        preview: page(`<div class="normal"><div class="a">40px bottom</div><div class="b">20px top</div></div>
<p style="font-size:13px;color:#666">↑ block: gap = 40px (collapsed)</p>
<div class="flexbox"><div class="a">40px bottom</div><div class="b">20px top</div></div>
<p style="font-size:13px;color:#666">↑ flex column: gap = 60px (added)</p>`,
`.a { background:#fde68a; padding:4px; margin-bottom:40px; }
.b { background:#bfdbfe; padding:4px; margin-top:20px; }
.normal, .flexbox { border:1px dashed #94a3b8; margin-bottom:4px; }
.flexbox { display:flex; flex-direction:column; }`),
        previewHeight: 320,
        explain: 'Same markup, same margins, different gaps. Flex and grid containers never collapse margins, which is one reason modern layouts feel more predictable.',
        explainHi: 'Wahi markup, wahi margins, alag gap. Flex aur grid containers margins kabhi collapse nahi karte, aur isiliye modern layouts zyada bharosemand lagte hain.',
      },
      {
        title: 'margin: 0 auto centres a block',
        titleHi: 'margin: 0 auto block ko beech mein laata hai',
        code: `.centred { width: 200px; margin: 0 auto; }
.no-width { margin: 0 auto; }   /* nothing to centre */`,
        preview: page(`<div class="wrap">
  <div class="centred">width + auto = centred</div>
  <div class="nw">no width — already full width</div>
</div>`,
`.wrap { border:2px solid #94a3b8; padding:6px; }
.centred { width:200px; margin:0 auto; background:#dcfce7; padding:6px; text-align:center; }
.nw { margin:0 auto; background:#fee2e2; padding:6px; margin-top:6px; }`),
        previewHeight: 170,
        explain: '`auto` splits the leftover space equally, so it needs a width to have any leftover space to split. Without a width the block already fills the parent and nothing moves.',
        explainHi: '`auto` bachi hui jagah barabar baant deta hai, isliye baantne ke liye jagah bachne ko width chahiye. Bina width ke block pehle hi parent bhar deta hai aur kuch hilta nahi.',
      },
      {
        title: 'max-width: 100% on images',
        titleHi: 'Images par max-width: 100%',
        code: `img { max-width: 100%; height: auto; }`,
        preview: page(`<div class="frame">
  <div class="bigimg">a 900px-wide image with no max-width</div>
</div>
<p style="font-size:13px;color:#666">↑ overflows its container and forces sideways scrolling</p>
<div class="frame">
  <div class="bigimg fixed">the same image with max-width: 100%</div>
</div>`,
`.frame { border:2px solid #64748b; overflow-x:auto; margin-bottom:4px; }
.bigimg { width:900px; background:#fca5a5; padding:8px; font-size:12px; }
.bigimg.fixed { max-width:100%; background:#86efac; }`),
        previewHeight: 250,
        explain: 'The first container scrolls sideways; the second does not. This two-property rule prevents more mobile layout breakage than anything else in CSS.',
        explainHi: 'Pehla container bagal mein scroll hota hai; doosra nahi. Ye do-property wala rule CSS ki kisi bhi cheez se zyada mobile layout tootne se bachata hai.',
      },
      {
        title: 'Three ways to hide, and the trap',
        titleHi: 'Chhupane ke teen tarike, aur jaal',
        code: `.none    { display: none; }        /* gone from layout */
.hidden  { visibility: hidden; }   /* invisible, keeps its space */
.transp  { opacity: 0; }           /* invisible, STILL CLICKABLE */`,
        preview: page(`<div class="row"><button>Before</button><button class="none">none</button><button>After</button></div>
<div class="row"><button>Before</button><button class="hid">hidden</button><button>After</button></div>
<div class="row"><button>Before</button><button class="op" onclick="void 0">opacity 0</button><button>After</button></div>
<p style="font-size:13px;color:#666">Row 1: no gap. Rows 2 and 3: a gap remains. In row 3 that invisible button still takes clicks.</p>`,
`.row { margin-bottom:6px; }
button { padding:4px 8px; margin-right:4px; }
.none { display:none; }
.hid { visibility:hidden; }
.op { opacity:0; }`),
        previewHeight: 250,
        explain: '`display: none` removes the element entirely and hides it from screen readers. `opacity: 0` is the dangerous one — the button is invisible but still receives clicks, so users hit things they cannot see.',
        explainHi: '`display: none` element ko poori tarah hata deta hai aur screen readers se bhi chhupa deta hai. `opacity: 0` khatarnak hai — button adrishya hai par click phir bhi leta hai, isliye user aisi cheez daba deta hai jo dikhti hi nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `.col { width: 50%; padding: 20px; }
/* two of these overflow the parent */`,
        right: `*, *::before, *::after { box-sizing: border-box; }
.col { width: 50%; padding: 20px; }`,
        previewWrong: page(`<div class="w"><div class="c">A</div><div class="c">B</div></div>`,
          `.w{border:2px solid #64748b;overflow:hidden}.c{width:50%;padding:20px;float:left;background:#fee2e2;box-sizing:content-box}`),
        previewRight: page(`<div class="w"><div class="c">A</div><div class="c">B</div></div>`,
          `.w{border:2px solid #64748b;overflow:hidden}.c{width:50%;padding:20px;float:left;background:#dcfce7;box-sizing:border-box}`),
        previewHeight: 130,
        why: 'With the default `content-box`, padding is added outside the declared width, so two 50% columns total more than 100%. `border-box` makes the percentage include padding and border.',
        whyHi: 'Default `content-box` mein padding declared width ke bahar judti hai, isliye do 50% columns milkar 100% se zyada ho jate hain. `border-box` se percentage mein padding aur border shaamil ho jate hain.',
      },
      {
        wrong: `.card { height: 200px; }   /* text overflows when translated */`,
        right: `.card { min-height: 200px; }`,
        why: 'A fixed height cannot grow, so longer text, a larger user font size, or a translated page overflows the box. `min-height` sets a floor and still allows growth.',
        whyHi: 'Fixed height badh nahi sakti, isliye lamba text, bada user font size, ya translate kiya page box se bahar nikal jata hai. `min-height` neeche ki seema deti hai aur badhne bhi deti hai.',
      },
      {
        wrong: `.modal-backdrop { opacity: 0; }   /* invisible but still clickable */`,
        right: `.modal-backdrop { display: none; }`,
        why: '`opacity: 0` only makes an element transparent — it still occupies space and still receives pointer events, so users click an invisible overlay and nothing appears to happen.',
        whyHi: '`opacity: 0` element ko sirf transparent karta hai — wo jagah bhi leta hai aur pointer events bhi leta hai, isliye user adrishya overlay par click karta hai aur lagta hai kuch hua hi nahi.',
      },
      {
        wrong: `.a { margin-bottom: 20px }
.b { margin-top: 20px }
/* expecting 40px */`,
        right: `.stack > * + * { margin-top: 20px; }
/* one margin, no collapsing surprise */`,
        why: 'Adjacent vertical margins collapse to the larger value, so two 20px margins give 20px. Setting the gap from one side only removes the ambiguity.',
        whyHi: 'Bagal-bagal wale vertical margins bade wale par collapse ho jate hain, isliye do 20px margins 20px hi dete hain. Gap ek hi taraf se set karne se ye uljhan khatam ho jati hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every CSS framework starts here.** Bootstrap, Tailwind and every reset file set `box-sizing: border-box` globally before anything else, precisely because the default is not what anyone wants.',
        hi: '**Har CSS framework yahin se shuru hota hai.** Bootstrap, Tailwind aur har reset file sabse pehle globally `box-sizing: border-box` set karti hai, theek isliye ki default wo nahi hai jo koi chahta hai.',
      },
      {
        en: '**Responsive images.** `img { max-width: 100%; height: auto }` is in essentially every stylesheet on the web — it is what stops large photos breaking a phone layout.',
        hi: '**Responsive images.** `img { max-width: 100%; height: auto }` web ki lagbhag har stylesheet mein hai — badi photos ko phone layout todne se yahi rokta hai.',
      },
      {
        en: '**Card grids.** Equal-width cards with internal padding only work as expected under `border-box`; under the default they overflow their row every time.',
        hi: '**Card grids.** Barabar chaudai wale cards jinme andar padding ho, `border-box` ke saath hi theek chalte hain; default mein wo har baar apni row se bahar nikal jate hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the CSS box model.',
        qHi: 'CSS box model samjhao.',
        a: 'Every element is a rectangle with four concentric layers: the content, the padding inside the border, the border itself, and the margin outside it. Padding is inside the element and takes its background; margin is outside and is always transparent. Total space taken is content plus padding plus border plus margin.',
        aHi: 'Har element ek chaturbhuj hai jiski chaar parten ek doosre ke andar hain: content, border ke andar ki padding, khud border, aur uske bahar margin. Padding element ke andar hai aur uska background leti hai; margin bahar hai aur hamesha transparent hai. Kul jagah = content + padding + border + margin.',
      },
      {
        q: 'What does `box-sizing: border-box` change?',
        qHi: '`box-sizing: border-box` kya badalta hai?',
        a: 'It changes what `width` and `height` measure. By default (`content-box`) they set the content area only, so padding and border are added outside, making the rendered box larger than declared. With `border-box` the declared width includes padding and border, so a 300px box is 300px on screen. Margin is outside the box under both values.',
        aHi: 'Wo badalta hai ki `width` aur `height` kya naapte hain. Default (`content-box`) mein wo sirf content area set karte hain, isliye padding aur border bahar judte hain aur box declared se bada ban jata hai. `border-box` mein declared width mein padding aur border shaamil hote hain, isliye 300px ka box screen par 300px hi hota hai. Margin dono mein box ke bahar hi rehta hai.',
      },
      {
        q: 'What is margin collapsing?',
        qHi: 'Margin collapsing kya hai?',
        a: 'Adjacent vertical margins combine into a single margin equal to the larger of the two rather than their sum. It happens between siblings, between a parent and its first or last child when nothing separates them, and within an empty element. Horizontal margins never collapse, and it does not occur in flex or grid containers or with `overflow` set.',
        aHi: 'Bagal-bagal wale vertical margins jud kar ek margin ban jate hain jo dono ke jod ke bajaye bade wale ke barabar hota hai. Ye siblings ke beech, parent aur uske pehle ya aakhri bachche ke beech jab unhe kuch alag na kare, aur khaali element ke andar hota hai. Horizontal margins kabhi collapse nahi hote, aur ye flex ya grid containers mein ya `overflow` set hone par nahi hota.',
      },
      {
        q: 'What is the difference between `display: none`, `visibility: hidden` and `opacity: 0`?',
        qHi: '`display: none`, `visibility: hidden` aur `opacity: 0` mein kya fark hai?',
        a: '`display: none` removes the element from the layout entirely — it occupies no space and is hidden from assistive technology. `visibility: hidden` hides it but keeps its space reserved. `opacity: 0` makes it fully transparent while it still occupies space **and still receives pointer events**, which means users can click something they cannot see.',
        aHi: '`display: none` element ko layout se poori tarah hata deta hai — wo jagah nahi leta aur assistive technology se chhupa hota hai. `visibility: hidden` use chhupata hai par uski jagah bachi rehti hai. `opacity: 0` use poori tarah transparent karta hai jabki wo jagah bhi leta hai **aur pointer events bhi leta hai**, matlab user aisi cheez par click kar sakta hai jo use dikhti hi nahi.',
      },
      {
        q: 'Why avoid a fixed `height` on a text container?',
        qHi: 'Text wale container par fixed `height` se kyun bachein?',
        a: 'Because the content can grow beyond it — longer copy, a translated string, or a user who has increased their browser font size — and it will overflow or be clipped. `min-height` gives you the same visual floor while allowing the box to expand, which keeps the layout robust.',
        aHi: 'Kyunki content usse bada ho sakta hai — lamba text, translate ki gayi string, ya aisa user jisne apna browser font size badha rakha hai — aur content bahar nikal jayega ya kat jayega. `min-height` wahi dikhne wali seema deti hai aur box ko badhne bhi deti hai, jisse layout mazboot rehta hai.',
      },
    ],

    exercises: [
      {
        task: 'Make a box with `width: 300px`, `padding: 20px` and `border: 2px`. Measure it in devtools, then add `box-sizing: border-box` and measure again.',
        taskHi: 'Ek box banao jisme `width: 300px`, `padding: 20px` aur `border: 2px` ho. Devtools mein naapo, phir `box-sizing: border-box` lagakar dobara naapo.',
        hint: 'Devtools shows a box-model diagram with all four layers labelled. 344 becomes 300.',
        hintHi: 'Devtools chaaron parton ka label wala box-model diagram dikhata hai. 344 se 300 ho jayega.',
      },
      {
        task: 'Build two columns at `width: 50%` with padding and watch the second wrap. Fix it with the global `border-box` reset.',
        taskHi: '`width: 50%` wale do columns padding ke saath banao aur dekho doosra neeche chala jata hai. Global `border-box` reset se theek karo.',
        hint: 'This is the single most common CSS layout bug — worth causing once deliberately so you recognise it later.',
        hintHi: 'Ye CSS ka sabse aam layout bug hai — ek baar jaan-boojhkar karna sahi hai taaki baad mein pehchan sako.',
      },
      {
        task: 'Put a 40px bottom margin on one div and a 20px top margin on the next. Measure the gap, then wrap them in a flex column and measure again.',
        taskHi: 'Ek div par 40px bottom margin aur agle par 20px top margin lagao. Gap naapo, phir unhe flex column mein lapet kar dobara naapo.',
        hint: '40px collapsed, then 60px once flex disables collapsing. Same CSS, different result.',
        hintHi: 'Pehle 40px collapsed, phir flex collapsing band karta hai to 60px. Wahi CSS, alag nateeja.',
      },
    ],

    keyTakeaways: [
      'Four layers: content, padding (inside), border, margin (outside, always transparent).',
      'By default `width` sets the content only, so padding and border make the box wider than declared.',
      '`*, *::before, *::after { box-sizing: border-box }` is the first rule in almost every stylesheet.',
      'Adjacent vertical margins collapse to the larger value; flex and grid containers never collapse.',
      '`margin: 0 auto` centres a block, but only if it has a width.',
      '`opacity: 0` still occupies space and still takes clicks — use `display: none` to truly hide.',
    ],
    keyTakeawaysHi: [
      'Chaar parten: content, padding (andar), border, margin (bahar, hamesha transparent).',
      'Default mein `width` sirf content set karta hai, isliye padding aur border box ko declared se chauda kar dete hain.',
      '`*, *::before, *::after { box-sizing: border-box }` lagbhag har stylesheet ka pehla rule hai.',
      'Bagal-bagal wale vertical margins bade wale par collapse hote hain; flex aur grid containers kabhi collapse nahi karte.',
      '`margin: 0 auto` block ko beech mein laata hai, par sirf tab jab uski width ho.',
      '`opacity: 0` jagah bhi leta hai aur click bhi — sach mein chhupane ke liye `display: none` use karo.',
    ],
  },
];
