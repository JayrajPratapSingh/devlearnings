/**
 * CSS & HTML Complete Course — Module 3 (Layout), lessons 3–4.
 *
 * Grid, then position & stacking. Grid closes the gap flexbox deliberately
 * left open — aligning rows AND columns together — and positioning is taught
 * last in this module because "just use position: absolute" is the wrong
 * reflex until you already have flow, flex and grid as the default tools.
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

const boxes = `
  .box { background:#dbeafe; border:1px solid #60a5fa; padding:8px 12px; }
  .wrap { border:2px dashed #94a3b8; padding:8px; }
`;

export const CSS_MODULE_3B: CourseLesson[] = [
  {
    slug: 'css-grid',
    title: 'CSS Grid',
    titleHi: 'CSS Grid',
    description: 'A photo gallery where flexbox almost works — until row 2 refuses to line up with row 1.',
    descriptionHi: 'Ek photo gallery jahan flexbox lagbhag chal jata hai — jab tak row 2 row 1 ke saath line-up hone se mana nahi karti.',
    difficulty: 'MEDIUM',
    duration: 38,
    order: 3,

    analogy: {
      en: '**A seating chart versus a queue.** Flexbox is a queue — everyone lines up along one direction, and if the line wraps, the second line does not know or care what the first line looked like. Grid is a seating chart — you draw the rows and columns first, and every seat has a fixed place in both directions at once. A queue is enough for a toolbar. A seating chart is what a page layout actually is.',
      hi: '**Seating chart aur queue.** Flexbox ek queue hai — sab ek disha mein lagte hain, aur line wrap ho to doosri line ko pehli line ka pata hi nahi hota. Grid seating chart hai — pehle aap rows aur columns khinchte ho, aur har seat ki jagah dono dishaon mein ek saath pakki hai. Queue toolbar ke liye kaafi hai. Seating chart wahi hai jo page ka layout asal mein hota hai.',
    },

    simple: `**Start broken.** A photo gallery, six cards, flexbox with wrapping:

\`\`\`css
.gallery { display: flex; flex-wrap: wrap; gap: 12px; }
.card { flex: 1 1 200px; }
\`\`\`

It wraps into two rows. But card 4 in row two is taller than card 1 in row one, and they do not share a grid line — nothing in row two is required to line up under anything in row one, because flex treats each wrapped line as an independent flex container. Move the mouse to a wider window and the columns per row change unpredictably.

**Grid draws the seating chart first**

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
\`\`\`

Three explicit columns. Six cards drop into two rows of three, and every card lines up with the one above and below it — because the grid, not the content, decides where the lines fall.

**The line every grid tutorial should open with**

\`\`\`css
grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
\`\`\`

Read it right to left: each column is **at least 220px, at most an equal share** (\`minmax\`). \`auto-fill\` computes however many of those columns fit the container. Resize the window and the column *count* changes — no media query, no JavaScript. This one line replaces most of what people used to write breakpoints for.

**Placing things by name, not by counting lines**

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas: "sidebar main";
}
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
\`\`\`

You can read the layout's shape directly out of the CSS — a rectangle of area names literally drawn as text — instead of reconstructing it from column numbers.

**When to reach for which**

- One row or one column of things → **flexbox**.
- A grid of cards, or a page skeleton with named regions → **grid**.
- You can even combine them: grid for the page shell, flexbox inside each card.`,

    simpleHi: `**Toote hue se shuru.** Ek photo gallery, chhe cards, wrapping wala flexbox:

\`\`\`css
.gallery { display: flex; flex-wrap: wrap; gap: 12px; }
.card { flex: 1 1 200px; }
\`\`\`

Ye do rows mein wrap hota hai. Par row do ka card 4 row ek ke card 1 se lamba hai, aur wo ek grid line share nahi karte — row do mein kuch bhi row ek ke neeche line-up hone ko majboor nahi hai, kyunki flex har wrap hui line ko ek alag flex container maanta hai. Mouse ko chaudi window par le jao to har row mein columns anisheet tarike se badal jate hain.

**Grid pehle seating chart khinchta hai**

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
\`\`\`

Teen saaf columns. Chhe cards do rows mein teen-teen karke lagte hain, aur har card apne upar aur neeche wale ke saath line-up hota hai — kyunki lines kahan girengi ye content nahi, grid tay karta hai.

**Jo line har grid tutorial se shuru honi chahiye**

\`\`\`css
grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
\`\`\`

Dayein se baayein padho: har column **kam se kam 220px, zyada se zyada ek barabar hissa** (\`minmax\`). \`auto-fill\` hisaab lagata hai kitne aise columns container mein aa jate hain. Window resize karo aur column ki *ginti* badal jati hai — na media query, na JavaScript. Ye ek line usse zyada badalti hai jiske liye log breakpoints likha karte the.

**Naam se jagah dena, lines ginkar nahi**

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas: "sidebar main";
}
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
\`\`\`

Aap layout ki shakal seedha CSS se padh sakte ho — area naamon ka ek chaukor, seedha text ki tarah khincha hua — column numbers se dobara banane ke bajaye.

**Kaunsa kab lena hai**

- Cheezon ki ek row ya ek column → **flexbox**.
- Cards ka grid, ya named regions wala page dhancha → **grid**.
- Dono milaye bhi ja sakte hain: page shell ke liye grid, har card ke andar flexbox.`,

    content: `## The two-line minimum

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;   /* three equal-width columns */
  grid-template-rows: 100px 100px;       /* two 100px rows (optional — rows can auto-size) */
  gap: 12px;                             /* or "row-gap column-gap" */
}
\`\`\`

Children are placed into the grid automatically, filling it row by row, left to right, exactly like text — unless you place them explicitly.

## The \`fr\` unit

\`fr\` is "a fraction of the leftover space **after** fixed-size tracks are subtracted" — not a percentage of the whole.

\`\`\`css
grid-template-columns: 200px 1fr 2fr;
/* 200px is fixed. Of what's left, the second column gets 1 share, the third gets 2. */
\`\`\`

## repeat() and the auto-fill trick

\`\`\`css
grid-template-columns: repeat(3, 1fr);                       /* exactly 3 columns */
grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* however many fit */
\`\`\`

\`minmax(220px, 1fr)\` means each column is never narrower than 220px and never wider than an equal share of the space. \`auto-fill\` computes the count from the container's current width — this is CSS Grid's built-in responsiveness, and it needs no media query.

\`auto-fill\` versus \`auto-fit\` matters only when there are fewer items than columns that would fit: \`auto-fill\` leaves the empty tracks in place (items stay left-aligned, small), \`auto-fit\` collapses them to zero width so the existing items stretch to fill the row.

## Placing items explicitly

\`\`\`css
.item {
  grid-column: 1 / 3;   /* start at line 1, end at line 3 — spans two columns */
  grid-row: 2 / 4;
}
.item { grid-column: span 2; }   /* shorthand: span two tracks from wherever it lands */
\`\`\`

Grid lines are numbered starting at 1, and \`-1\` always means the last line, which is handy for "span to the edge" without knowing the column count:

\`\`\`css
.full-width { grid-column: 1 / -1; }
\`\`\`

## Named areas — the most readable grid syntax

\`\`\`css
.page {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
}
.sidebar { grid-area: sidebar; }
.header  { grid-area: header; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`

Each quoted string is one row; each word is one column's content in that row. Repeating a name across cells makes that item span them — here the sidebar spans all three rows just by appearing three times. The CSS itself is a diagram of the page.

## Alignment inside a grid

\`\`\`css
justify-items: center;   /* items within their own cell, horizontally */
align-items: center;     /* items within their own cell, vertically */
place-items: center;     /* shorthand for both */
justify-content: center; /* the WHOLE grid within the container, if it's smaller */
\`\`\`

The naming mirrors flexbox — \`justify\` is still the row-ish axis, \`align\` the column-ish one — but grid always has two dimensions, so there is no direction-swap the way there was for flex.

## Grid versus flexbox in one sentence

Flexbox is one-dimensional: it lays out a row **or** a column, and each wrapped line is independent. Grid is two-dimensional: rows and columns are defined together, so everything lines up in both directions at once. A card gallery, a page skeleton, or anything you would sketch as a table belongs in grid; a toolbar, a nav bar, or anything you would sketch as a single strip belongs in flex.`,

    contentHi: `## Do line ka kam se kam

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;   /* teen barabar-chaudi columns */
  grid-template-rows: 100px 100px;       /* do 100px rows (optional — rows khud size le sakti hain) */
  gap: 12px;                             /* ya "row-gap column-gap" */
}
\`\`\`

Bachche apne aap grid mein rakh jate hain, row-by-row, baayein se dayein, bilkul text ki tarah — jab tak aap khud jagah na do.

## \`fr\` unit

\`fr\` matlab "fixed-size tracks ghatane ke **baad** bachi hui jagah ka hissa" — poori jagah ka percentage nahi.

\`\`\`css
grid-template-columns: 200px 1fr 2fr;
/* 200px pakka hai. Jo bacha, uska doosra column 1 hissa leta hai, teesra 2 hisse. */
\`\`\`

## repeat() aur auto-fill ka jugaad

\`\`\`css
grid-template-columns: repeat(3, 1fr);                       /* bilkul 3 columns */
grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* jitne aa jayein */
\`\`\`

\`minmax(220px, 1fr)\` matlab har column kabhi 220px se patli nahi aur kabhi ek barabar hisse se chaudi nahi. \`auto-fill\` container ki abhi ki chaudai se ginti nikalta hai — yahi CSS Grid ki built-in responsiveness hai, aur isme koi media query nahi chahiye.

\`auto-fill\` aur \`auto-fit\` ka fark tabhi matter karta hai jab items un columns se kam hon jo fit ho sakte hain: \`auto-fill\` khaali tracks ko rakhta hai (items baayein-align, chhote rehte hain), \`auto-fit\` unhe zero chaudai tak sikoud deta hai isliye maujooda items pheel kar row bhar dete hain.

## Items ko seedha jagah dena

\`\`\`css
.item {
  grid-column: 1 / 3;   /* line 1 se shuru, line 3 par khatam — do columns cover */
  grid-row: 2 / 4;
}
.item { grid-column: span 2; }   /* shorthand: jahan bhi lage wahan se do tracks cover */
\`\`\`

Grid lines 1 se ginti shuru karti hain, aur \`-1\` hamesha aakhri line hoti hai, jo "kinare tak span karo" ke liye kaam ki hai bina column count jaane:

\`\`\`css
.full-width { grid-column: 1 / -1; }
\`\`\`

## Named areas — sabse padhne layak grid syntax

\`\`\`css
.page {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
}
.sidebar { grid-area: sidebar; }
.header  { grid-area: header; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`

Har quoted string ek row hai; har shabd us row mein ek column ka content hai. Ek naam ko kai cells mein dohrane se wo item unhe span kar leta hai — yahan sidebar teen baar dikhne se hi teenon rows span kar leta hai. CSS khud page ka diagram ban jata hai.

## Grid ke andar alignment

\`\`\`css
justify-items: center;   /* items apni cell ke andar, leti taraf */
align-items: center;     /* items apni cell ke andar, khadi taraf */
place-items: center;     /* dono ka shorthand */
justify-content: center; /* POORA grid container ke andar, agar chhota ho */
\`\`\`

Naam flexbox se milta hai — \`justify\` ab bhi row-si axis hai, \`align\` column-si — par grid mein hamesha do dimensions hoti hain, isliye flex jaisa direction-swap yahan nahi hota.

## Grid aur flexbox, ek vakya mein

Flexbox ek-dimension wala hai: wo ek row **ya** ek column lagata hai, aur har wrap hui line alag hoti hai. Grid do-dimension wala hai: rows aur columns saath tay hoti hain, isliye sab kuch dono dishaon mein ek saath line-up hota hai. Card gallery, page ka dhancha, ya kuch bhi jise aap table ki tarah sketch karoge wo grid mein aata hai; toolbar, nav bar, ya kuch bhi jise aap ek patti ki tarah sketch karoge wo flex mein aata hai.`,

    examples: [
      {
        title: 'Flexbox wrapping: rows do not align',
        titleHi: 'Flexbox wrapping: rows line-up nahi hoti',
        code: `.gallery { display: flex; flex-wrap: wrap; gap: 8px; }
.card { flex: 1 1 100px; }`,
        preview: page(`<div class="g">
  <div class="c">Card 1</div>
  <div class="c tall">Card 2<br>extra line<br>of text here</div>
  <div class="c">Card 3</div>
  <div class="c">Card 4</div>
  <div class="c">Card 5</div>
  <div class="c">Card 6</div>
</div>`,
`.g { display:flex; flex-wrap:wrap; gap:8px; width:340px; }
.c { flex:1 1 100px; background:#dbeafe; border:1px solid #60a5fa; padding:8px; font-size:13px; }
.tall { background:#fde68a; border-color:#f59e0b; }`),
        previewHeight: 220,
        explain: 'Card 2 is taller, so row two starts lower than it would otherwise — but nothing in row two is required to line up with a column in row one. Flex sizes each wrapped line independently.',
        explainHi: 'Card 2 lamba hai, isliye row do niche se shuru hoti hai — par row do mein kuch bhi row ek ke kisi column se line-up hone ko majboor nahi hai. Flex har wrap hui line ka size alag leta hai.',
      },
      {
        title: 'Grid: the same six cards, real alignment',
        titleHi: 'Grid: wahi chhe cards, asli alignment',
        code: `.gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }`,
        preview: page(`<div class="g">
  <div class="c">Card 1</div>
  <div class="c tall">Card 2<br>extra line<br>of text here</div>
  <div class="c">Card 3</div>
  <div class="c">Card 4</div>
  <div class="c">Card 5</div>
  <div class="c">Card 6</div>
</div>`,
`.g { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; width:340px; }
.c { background:#dbeafe; border:1px solid #60a5fa; padding:8px; font-size:13px; }
.tall { background:#fde68a; border-color:#f59e0b; }`),
        previewHeight: 220,
        explain: 'Card 4 now sits directly under card 1, and the row height is shared. The grid decided the rows and columns before placing any content, so alignment is guaranteed rather than coincidental.',
        explainHi: 'Card 4 ab card 1 ke seedha neeche hai, aur row ki height sab share karte hain. Grid ne content rakhne se pehle hi rows aur columns tay kar diye, isliye alignment ittefaq nahi, pakki hai.',
      },
      {
        title: 'auto-fill + minmax: responsive with zero media queries',
        titleHi: 'auto-fill + minmax: bina media query ke responsive',
        code: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
}`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 6px">Resize your actual browser window to see the column count change — this preview's fixed width shows one snapshot:</p>
<div class="g">
  <div class="c">1</div><div class="c">2</div><div class="c">3</div>
  <div class="c">4</div><div class="c">5</div><div class="c">6</div>
  <div class="c">7</div>
</div>`,
`.g { display:grid; grid-template-columns:repeat(auto-fill, minmax(90px, 1fr)); gap:8px; }
.c { background:#dbeafe; border:1px solid #60a5fa; padding:14px; text-align:center; font-size:13px; }`),
        previewHeight: 200,
        explain: 'No breakpoint was written for this. The browser fits as many 90px-minimum columns as the width allows and stretches them evenly — the same rule works at 320px and at 3000px.',
        explainHi: 'Iske liye koi breakpoint nahi likha gaya. Browser jitni chaudai mein 90px-minimum columns aa sakein utni fit karta hai aur unhe barabar pheela deta hai — wahi rule 320px par bhi chalta hai aur 3000px par bhi.',
      },
      {
        title: 'Explicit placement: spanning columns and rows',
        titleHi: 'Seedha jagah dena: columns aur rows span karna',
        code: `.hero { grid-column: 1 / 3; grid-row: 1 / 3; }   /* spans a 2x2 block */`,
        preview: page(`<div class="g">
  <div class="c hero">Hero — spans 2×2</div>
  <div class="c">3</div>
  <div class="c">4</div>
  <div class="c">5</div>
</div>`,
`.g { display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(2,60px); gap:8px; }
.c { background:#dbeafe; border:1px solid #60a5fa; padding:8px; font-size:13px; }
.hero { grid-column:1/3; grid-row:1/3; background:#bbf7d0; border-color:#10b981; display:flex; align-items:center; justify-content:center; text-align:center; }`),
        previewHeight: 160,
        explain: 'One item occupies a 2×2 block of the grid while the others fall into the remaining cells automatically. This is the "featured card is bigger than the rest" pattern from nearly every news site.',
        explainHi: 'Ek item grid ke 2×2 block ko cover karta hai jabki baaki apne aap bachi cells mein lag jate hain. Ye "featured card baaki se bada hai" wala pattern lagbhag har news site mein dikhta hai.',
      },
      {
        title: 'Named areas: the layout drawn as text',
        titleHi: 'Named areas: layout text ki tarah khincha hua',
        code: `.page {
  grid-template-columns: 140px 1fr;
  grid-template-areas: "sidebar header" "sidebar main";
}`,
        preview: page(`<div class="page">
  <div class="sidebar">Sidebar</div>
  <div class="header">Header</div>
  <div class="main">Main content</div>
</div>`,
`.page { display:grid; grid-template-columns:140px 1fr; grid-template-rows:40px 1fr; grid-template-areas:"sidebar header" "sidebar main"; gap:8px; height:160px; }
.sidebar { grid-area:sidebar; background:#e2e8f0; padding:8px; font-size:13px; }
.header { grid-area:header; background:#dbeafe; padding:8px; font-size:13px; }
.main { grid-area:main; background:#f0fdf4; padding:8px; font-size:13px; }`),
        previewHeight: 210,
        explain: 'The sidebar appears in both quoted rows, so it automatically spans them — no explicit row numbers needed. Compare this to the same layout done with grid-column/grid-row numbers; the areas version reads like a floor plan.',
        explainHi: 'Sidebar dono quoted rows mein dikhta hai, isliye wo apne aap unhe span kar leta hai — seedhe row numbers ki zarurat nahi. Isse wahi layout grid-column/grid-row numbers se karne se compare karo; areas wala version floor plan ki tarah padha jata hai.',
      },
      {
        title: 'The fr unit divides leftover space, not total space',
        titleHi: 'fr unit bachi hui jagah baantta hai, poori nahi',
        code: `grid-template-columns: 150px 1fr 2fr;
/* 150px fixed. What's left splits 1:2 between the other two. */`,
        preview: page(`<div class="g">
  <div class="c fixed">150px fixed</div>
  <div class="c">1fr</div>
  <div class="c">2fr &mdash; double the previous</div>
</div>`,
`.g { display:grid; grid-template-columns:150px 1fr 2fr; gap:8px; }
.c { background:#dbeafe; border:1px solid #60a5fa; padding:8px; font-size:12px; }
.fixed { background:#fde68a; border-color:#f59e0b; }`),
        previewHeight: 130,
        explain: 'The fixed column is subtracted first; the remaining space is then split 1:2 between the fr columns, so the third is exactly twice the second — never a fixed pixel amount, always proportional to whatever is left.',
        explainHi: 'Fixed column pehle nikaali jati hai; bachi hui jagah phir fr columns mein 1:2 baanti jati hai, isliye teesra doosre se bilkul dugna hai — kabhi fixed pixel amount nahi, hamesha jo bacha uske anupaat mein.',
      },
      {
        title: 'place-items centres in both directions',
        titleHi: 'place-items dono dishaon mein beech mein karta hai',
        code: `.grid { display: grid; place-items: center; }`,
        preview: page(`<div class="g"><div class="c">Centred cell</div></div>`,
`.g { display:grid; place-items:center; height:120px; border:2px dashed #94a3b8; }
.c { background:#dbeafe; border:1px solid #60a5fa; padding:10px 16px; }`),
        previewHeight: 160,
        explain: '`place-items` is shorthand for `align-items` plus `justify-items` — one declaration centres every grid item within its own cell in both directions, no flexbox needed for this particular job.',
        explainHi: '`place-items` `align-items` aur `justify-items` ka shorthand hai — ek declaration har grid item ko apni cell ke andar dono dishaon mein beech mein le aata hai, is kaam ke liye flexbox ki zarurat nahi.',
      },
      {
        title: 'auto-fill versus auto-fit with few items',
        titleHi: 'Kam items ke saath auto-fill aur auto-fit',
        code: `grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));  /* leaves empty tracks */
grid-template-columns: repeat(auto-fit,  minmax(100px, 1fr));  /* collapses them, items stretch */`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 4px">auto-fill &mdash; two items, empty tracks remain (items stay left, small)</p>
<div class="g fill"><div class="c">A</div><div class="c">B</div></div>
<p style="font-size:13px;color:#666;margin:10px 0 4px">auto-fit &mdash; same two items, empty tracks collapse and items stretch</p>
<div class="g fit"><div class="c">A</div><div class="c">B</div></div>`,
`.g { display:grid; gap:8px; width:340px; }
.fill { grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); }
.fit { grid-template-columns:repeat(auto-fit, minmax(100px, 1fr)); }
.c { background:#dbeafe; border:1px solid #60a5fa; padding:10px; text-align:center; font-size:13px; }`),
        previewHeight: 210,
        explain: 'With few items, `auto-fill` keeps the extra columns as empty invisible tracks, so items stay their minimum size and pack to the left. `auto-fit` collapses those empty tracks to zero, letting the real items grow to fill the row.',
        explainHi: 'Kam items ke saath `auto-fill` extra columns ko khaali adrishya tracks ki tarah rakhta hai, isliye items apne minimum size par baayein chipke rehte hain. `auto-fit` un khaali tracks ko zero kar deta hai, jisse asli items row bharne ke liye badh jate hain.',
      },
      {
        title: 'A full page skeleton in grid',
        titleHi: 'Grid mein poora page dhancha',
        code: `body {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 56px 1fr 40px;
  grid-template-areas: "nav header" "nav main" "nav footer";
  min-height: 100vh;
}`,
        preview: page(`<div class="page">
  <nav class="n">Nav</nav>
  <header class="h">Header</header>
  <main class="m">Main</main>
  <footer class="f">Footer</footer>
</div>`,
`.page { display:grid; grid-template-columns:150px 1fr; grid-template-rows:36px 1fr 30px; grid-template-areas:"nav header" "nav main" "nav footer"; height:200px; gap:2px; background:#94a3b8; }
.n { grid-area:nav; background:#1e293b; color:#fff; padding:8px; font-size:13px; }
.h { grid-area:header; background:#dbeafe; padding:8px; font-size:13px; }
.m { grid-area:main; background:#f0fdf4; padding:8px; font-size:13px; }
.f { grid-area:footer; background:#e2e8f0; padding:8px; font-size:13px; }`),
        previewHeight: 240,
        explain: 'The entire application shell — sidebar, header, content and footer — defined in one grid on the body. Every region has a fixed relationship to the others without a single wrapper div or float.',
        explainHi: 'Poora application shell — sidebar, header, content aur footer — body par ek hi grid mein tay hota hai. Har region ka baaki se pakka rishta hai, ek bhi wrapper div ya float ke bina.',
      },
      {
        title: 'Reordering visually with named lines — dense packing',
        titleHi: 'Named lines se dikhne mein reorder — dense packing',
        code: `.gallery {
  grid-template-columns: repeat(4, 1fr);
  grid-auto-flow: dense;   /* backfills gaps left by spanning items */
}`,
        preview: page(`<div class="g">
  <div class="c wide">Wide (span 2)</div>
  <div class="c">2</div>
  <div class="c">3</div>
  <div class="c">4</div>
  <div class="c">5</div>
</div>`,
`.g { display:grid; grid-template-columns:repeat(4,1fr); grid-auto-flow:dense; gap:8px; }
.c { background:#dbeafe; border:1px solid #60a5fa; padding:12px; font-size:13px; text-align:center; }
.wide { grid-column:span 2; background:#bbf7d0; border-color:#10b981; }`),
        previewHeight: 150,
        explain: '`grid-auto-flow: dense` lets later, smaller items backfill gaps that a spanning item would otherwise leave — useful for Pinterest-style galleries with mixed item sizes, though it can visually reorder items away from their source order.',
        explainHi: '`grid-auto-flow: dense` baad ke chhote items ko un khaali jagahon mein bharne deta hai jo span karne wala item chhod deta — mile-jule size wali Pinterest-jaisi galleries ke kaam ka, halaanki ye items ko unke source kram se dikhne mein hata sakta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `.gallery { display: flex; flex-wrap: wrap; }
/* used for a card grid — rows never align */`,
        right: `.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }`,
        previewWrong: page(`<div class="g"><div class="c">1</div><div class="c tall">2<br>extra<br>lines</div><div class="c">3</div><div class="c">4</div></div>`,
          `.g{display:flex;flex-wrap:wrap;gap:6px;width:220px}.c{flex:1 1 90px;background:#fee2e2;border:1px solid #ef4444;padding:6px;font-size:12px}.tall{background:#fde68a}`),
        previewRight: page(`<div class="g"><div class="c">1</div><div class="c tall">2<br>extra<br>lines</div><div class="c">3</div><div class="c">4</div></div>`,
          `.g{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;width:220px}.c{background:#bbf7d0;border:1px solid #10b981;padding:6px;font-size:12px}.tall{background:#fde68a}`),
        previewHeight: 170,
        why: 'Flex treats each wrapped line as its own independent container, so nothing guarantees row 2 lines up with row 1. Grid defines rows and columns together, so alignment is built in rather than hoped for.',
        whyHi: 'Flex har wrap hui line ko apna alag container maanta hai, isliye kuch bhi pakka nahi karta ki row 2 row 1 se line-up ho. Grid rows aur columns saath tay karta hai, isliye alignment banayi hui hai, ummeed ki hui nahi.',
      },
      {
        wrong: `grid-template-columns: repeat(auto-fill, 1fr);   /* one giant column */`,
        right: `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));`,
        why: 'Without a minimum, the browser cannot know how many columns fit — `1fr` alone has no fixed size to divide the container by, so it collapses to a single column. `minmax` supplies the size `auto-fill` needs to do the counting.',
        whyHi: 'Bina minimum ke browser ko pata hi nahi chalta ki kitne columns fit honge — akela `1fr` ke paas koi fixed size nahi hai jisse container ko baantne ka hisaab lage, isliye ek hi column ban jata hai. `minmax` wo size deta hai jo `auto-fill` ko ginti karne ke liye chahiye.',
      },
      {
        wrong: `.a { grid-column: 1; }
.b { grid-column: 2; }
.c { grid-column: 3; }   /* re-numbering every item to reorder the layout */`,
        right: `.page { grid-template-areas: "a b c"; }
.a { grid-area: a; } .b { grid-area: b; } .c { grid-area: c; }`,
        why: 'Line numbers work, but they say nothing about what the layout looks like — reading five items by their column numbers means mentally reconstructing a picture. Named areas ARE the picture; renaming the quoted string reorders everything at once.',
        whyHi: 'Line numbers kaam karte hain, par wo layout kaisa dikhta hai ye kuch nahi batate — paanch items unke column numbers se padhna matlab dimaag mein tasveer dobara banana. Named areas hi tasveer hain; quoted string badalne se sab kuch ek saath reorder ho jata hai.',
      },
    ],

    realWorld: [
      {
        en: '**Product and photo galleries.** Every e-commerce grid — Amazon, a Pinterest board, a photo app — resolves to `repeat(auto-fill, minmax(...))`, which is the entire reason that pattern exists.',
        hi: '**Product aur photo galleries.** Har e-commerce grid — Amazon, Pinterest board, photo app — `repeat(auto-fill, minmax(...))` par aakar ruk jaata hai, aur yahi ye pattern ke hone ki poori wajah hai.',
      },
      {
        en: '**Dashboard and app shells.** Named-area grids on the page body — sidebar, header, main, footer — are how most admin dashboards (Vercel, Linear, Notion) lay out their persistent chrome.',
        hi: '**Dashboard aur app shells.** Page body par named-area grids — sidebar, header, main, footer — isi tarike se zyadatar admin dashboards (Vercel, Linear, Notion) apna sthaayi chrome lagate hain.',
      },
      {
        en: '**Design system component libraries (CSS Grid + subgrid).** Newer component libraries use `subgrid` to align a card\'s internal title/body/footer rows across every card in a row, something flexbox genuinely cannot do.',
        hi: '**Design system component libraries (CSS Grid + subgrid).** Naye component libraries `subgrid` use karke ek row ke har card ke andar ke title/body/footer rows ko align karte hain, ye kaam flexbox sach mein nahi kar sakta.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the fundamental difference between flexbox and grid?',
        qHi: 'Flexbox aur grid mein bunyaadi fark kya hai?',
        a: 'Flexbox is one-dimensional: it distributes items along a single axis, and if they wrap, each resulting line is sized independently with no relationship to the others. Grid is two-dimensional: rows and columns are defined together up front, so every item has a fixed position along both axes at once and rows genuinely align. Use flex for a single row or column of components, and grid whenever the layout has to line up in two directions — a card gallery or a page skeleton.',
        aHi: 'Flexbox ek-dimension wala hai: wo items ko ek axis ke saath baantta hai, aur wrap hone par har banti line ka size baaki se bina rishte ke alag tay hota hai. Grid do-dimension wala hai: rows aur columns pehle hi saath tay hote hain, isliye har item ki jagah dono axes par ek saath pakki hai aur rows sach mein align hoti hain. Components ki ek row ya column ke liye flex, aur jab layout ko do dishaon mein line-up hona ho — card gallery ya page ka dhancha — tab grid.',
      },
      {
        q: 'Explain `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))`.',
        qHi: '`grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))` samjhao.',
        a: '`minmax(200px, 1fr)` defines one column type: never narrower than 200px, and if there is extra room, stretch to an equal share of it. `repeat(auto-fill, ...)` then computes how many of that column fit the container\'s current width and repeats it that many times. The result is a grid that adds or removes columns as the container resizes, with no media query — CSS Grid\'s built-in responsiveness.',
        aHi: '`minmax(200px, 1fr)` ek column type tay karta hai: kabhi 200px se patla nahi, aur agar extra jagah ho to ek barabar hisse tak pheelo. `repeat(auto-fill, ...)` phir hisaab lagata hai ki container ki abhi ki chaudai mein aisi kitni columns aati hain aur usko utni baar dohrata hai. Nateeja ek aisa grid hai jo container ka size badalne par columns jodta ya ghatata hai, bina kisi media query ke — CSS Grid ki built-in responsiveness.',
      },
      {
        q: 'What is the difference between `auto-fill` and `auto-fit`?',
        qHi: '`auto-fill` aur `auto-fit` mein kya fark hai?',
        a: 'Both compute how many columns of the given `minmax` size fit the container. The difference shows up when there are fewer items than columns that would fit: `auto-fill` keeps the leftover columns as empty tracks, so existing items stay at their minimum size and pack toward the start. `auto-fit` collapses those empty tracks to zero width, so the existing items stretch to fill the row instead.',
        aHi: 'Dono hisaab lagate hain ki diye gaye `minmax` size ki kitni columns container mein aati hain. Fark tab dikhta hai jab items un columns se kam hon jo fit ho sakti hain: `auto-fill` bachi hui columns ko khaali tracks ki tarah rakhta hai, isliye maujooda items apne minimum size par shuru ki taraf chipke rehte hain. `auto-fit` un khaali tracks ko zero chaudai tak sikoud deta hai, isliye maujooda items row bharne ke liye badh jate hain.',
      },
      {
        q: 'How do named grid areas work?',
        qHi: 'Named grid areas kaise kaam karte hain?',
        a: '`grid-template-areas` takes a set of quoted strings, one per row, where each word names the area occupying that cell. An item is placed by setting `grid-area` to match one of those names. Repeating a name across adjacent cells makes the item spanning that name occupy all of them — which is how a sidebar named in three rows spans all three without any explicit `grid-row` value. The main benefit is readability: the CSS itself looks like a diagram of the layout.',
        aHi: '`grid-template-areas` quoted strings ka ek set leta hai, ek har row ke liye, jahan har shabd us cell mein rehne wale area ka naam hai. Item ko `grid-area` us naam se milakar rakha jata hai. Ek naam ko bagal wali cells mein dohrane se us naam wala item unhe sabko cover kar leta hai — isi tarah teen rows mein naamit sidebar bina kisi seedhe `grid-row` value ke teenon span kar leta hai. Sabse bada fayda padhne layak hona hai: CSS khud layout ka diagram jaisa dikhta hai.',
      },
      {
        q: 'What does the `fr` unit mean, and how is it different from a percentage?',
        qHi: '`fr` unit ka matlab kya hai, aur wo percentage se kaise alag hai?',
        a: '`fr` stands for a fraction of the leftover space in the grid container **after** all fixed-size tracks (px, %, content-based) have been subtracted — not a fraction of the total container size the way a percentage is. In `grid-template-columns: 200px 1fr 2fr`, the 200px is removed first, and only what remains is split 1:2 between the other two columns. That makes `fr` ideal for mixing a fixed-width sidebar with a fluid main area.',
        aHi: '`fr` grid container ki us bachi hui jagah ka hissa hai jo sab fixed-size tracks (px, %, content-based) ghataye jaane ke **baad** bachti hai — percentage ki tarah poore container size ka hissa nahi. `grid-template-columns: 200px 1fr 2fr` mein pehle 200px nikaala jata hai, aur jo bachta hai wo hi baaki do columns mein 1:2 baantta hai. Isi wajah se `fr` fixed-width sidebar ko fluid main area ke saath milane ke liye best hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the same six-card gallery twice: once with flexbox wrapping, once with grid. Give one card extra text and compare what happens to the row below it.',
        taskHi: 'Wahi chhe-card gallery do baar banao: ek flexbox wrapping se, ek grid se. Ek card ko extra text do aur uske neeche wali row ka kya hota hai compare karo.',
        hint: 'In the flex version the row below shifts unevenly. In the grid version every card keeps the same row height.',
        hintHi: 'Flex version mein neeche wali row anisheet tarike se hilti hai. Grid version mein har card ki row height barabar rehti hai.',
      },
      {
        task: 'Write a responsive gallery with `repeat(auto-fill, minmax(180px, 1fr))` and resize your browser window from narrow to wide. Then change one `auto-fill` to `auto-fit` and remove enough items to see the difference.',
        taskHi: '`repeat(auto-fill, minmax(180px, 1fr))` se ek responsive gallery likho aur browser window ko sankri se chaudi tak resize karo. Phir ek `auto-fill` ko `auto-fit` karo aur itne items hatao ki fark dikhe.',
        hint: 'You need fewer items than columns that would fit for the auto-fit vs auto-fill difference to be visible.',
        hintHi: 'auto-fit aur auto-fill ka fark dikhne ke liye items utne columns se kam hone chahiye jitne fit ho sakte hain.',
      },
      {
        task: 'Build a page skeleton — sidebar, header, main, footer — using `grid-template-areas`. Then swap the sidebar from left to right by editing only the quoted strings.',
        taskHi: 'Ek page dhancha banao — sidebar, header, main, footer — `grid-template-areas` se. Phir sidebar ko baayein se dayein sirf quoted strings badal kar karo.',
        hint: 'Change "sidebar header" to "header sidebar" in every row — the individual elements\' CSS never needs to change.',
        hintHi: 'Har row mein "sidebar header" ko "header sidebar" karo — alag-alag elements ki CSS badalne ki zarurat kabhi nahi padti.',
      },
    ],

    keyTakeaways: [
      'Flexbox is one-dimensional and sizes each wrapped line independently; grid is two-dimensional and rows genuinely align.',
      '`repeat(auto-fill, minmax(200px, 1fr))` is responsive with zero media queries — the column count adapts to the container width.',
      '`fr` divides the space left over after fixed-size tracks, not the whole container.',
      '`grid-template-areas` lets the CSS read like a diagram of the layout instead of a list of line numbers.',
      '`auto-fill` keeps empty leftover tracks; `auto-fit` collapses them so existing items stretch to fill the row.',
      'Use flex for a single row or column of components; use grid for anything you would sketch as a table.',
    ],
    keyTakeawaysHi: [
      'Flexbox ek-dimension wala hai aur har wrap hui line ka size alag leta hai; grid do-dimension wala hai aur rows sach mein align hoti hain.',
      '`repeat(auto-fill, minmax(200px, 1fr))` bina kisi media query ke responsive hai — column count container ki chaudai ke hisaab se dhalta hai.',
      '`fr` fixed-size tracks ke baad bachi hui jagah baantta hai, poore container ko nahi.',
      '`grid-template-areas` se CSS line numbers ki list ke bajaye layout ke diagram jaisa padha jata hai.',
      '`auto-fill` bachi hui khaali tracks ko rakhta hai; `auto-fit` unhe sikoud deta hai taaki maujooda items row bhar dein.',
      'Components ki ek row ya column ke liye flex use karo; jise aap table ki tarah sketch karoge uske liye grid.',
    ],
  },

  {
    slug: 'css-position-stacking',
    title: 'Position and Stacking',
    titleHi: 'Position aur Stacking',
    description: 'A tooltip trapped inside its button. It is not a bug — it is overflow doing exactly what you told it to.',
    descriptionHi: 'Ek tooltip apne button ke andar phansa hua. Ye bug nahi hai — overflow bilkul wahi kar raha hai jo aapne kaha tha.',
    difficulty: 'MEDIUM',
    duration: 34,
    order: 4,

    analogy: {
      en: '**Sticky notes versus a whiteboard.** Normal flow is writing directly on the whiteboard — every new line pushes the ones below it down. `position: absolute` is a sticky note: you peel the element off the whiteboard entirely and place it at exact coordinates, and it no longer pushes anything or gets pushed. But a sticky note needs a surface to measure "exact coordinates" *from* — and that surface is the nearest ancestor you deliberately marked as one.',
      hi: '**Sticky notes aur whiteboard.** Normal flow seedha whiteboard par likhna hai — har nayi line neeche walon ko dhakel deti hai. `position: absolute` ek sticky note hai: aap element ko whiteboard se poori tarah utha kar exact coordinates par rakh dete ho, aur wo na kisi ko dhakelta hai na khud dhakela jata hai. Par sticky note ko "exact coordinates" naapne ke liye ek satah chahiye — aur wo satah wo sabse paas ka ancestor hai jise aapne jaan-boojh kar aisa nishaan lagaya.',
    },

    simple: `**Start broken.** A tooltip on a button:

\`\`\`css
.tooltip { position: absolute; top: -32px; left: 0; }
\`\`\`

You expect it to float above the button. Instead it appears somewhere else entirely — often near the top-left of the whole page.

**Why:** \`position: absolute\` positions an element relative to its **nearest positioned ancestor** — meaning the nearest ancestor with any \`position\` other than \`static\` (the default). If none exists, it falls all the way back to the page itself. Your button almost certainly never declared a position, so the browser walked up past it, past its parent, past everything, straight to the root.

**The fix is one property, on a completely different element:**

\`\`\`css
.button { position: relative; }   /* now the anchor for anything absolute inside it */
.tooltip { position: absolute; top: -32px; left: 0; }
\`\`\`

\`position: relative\` with no \`top\`/\`left\` set doesn't move the button at all — its only job here is to become the reference point.

**The four values, in one table**

\`\`\`
static    the default — normal flow, top/left/right/bottom do nothing
relative  stays in flow, but top/left etc. nudge it FROM where it would have been
absolute  removed from flow, positioned from the nearest positioned ancestor
fixed     removed from flow, positioned from the VIEWPORT — ignores scrolling
sticky    normal flow until a scroll threshold, then behaves like fixed
\`\`\`

**Stacking: two boxes overlap, which one wins?**

\`\`\`css
.a { z-index: 1; }
.b { z-index: 2; }   /* b is drawn on top */
\`\`\`

\`z-index\` only compares elements that are **already positioned** (not \`static\`) — setting it on a normal-flow element does nothing at all, which is another silent failure people hit constantly.

**Remember:** absolute needs a positioned ancestor or it escapes to the page; z-index needs position or it does nothing.`,

    simpleHi: `**Toote hue se shuru.** Ek button par tooltip:

\`\`\`css
.tooltip { position: absolute; top: -32px; left: 0; }
\`\`\`

Aap chahte ho wo button ke upar tairay. Uske bajaye wo bilkul kahin aur dikhta hai — aksar poore page ke top-left ke aas-paas.

**Kyun:** \`position: absolute\` element ko uske **sabse paas ke positioned ancestor** ke hisaab se rakhta hai — matlab wo sabse paas ka ancestor jiska \`position\` \`static\` (default) ke alawa kuch bhi ho. Agar koi nahi mile, to wo seedha page tak wapas gir jata hai. Aapke button ne lagbhag pakka koi position declare hi nahi ki, isliye browser usse upar, uske parent se upar, sabse upar, seedha root tak chala gaya.

**Fix ek property hai, bilkul alag element par:**

\`\`\`css
.button { position: relative; }   /* ab iske andar kisi bhi absolute ke liye anchor */
.tooltip { position: absolute; top: -32px; left: 0; }
\`\`\`

\`position: relative\` bina \`top\`/\`left\` set kiye button ko bilkul nahi hilata — yahan iska kaam sirf reference point banna hai.

**Chaar values, ek table mein**

\`\`\`
static    default — normal flow, top/left/right/bottom kuch nahi karte
relative  flow mein rehta hai, par top/left waghera use wahan se hilate hain jahan wo hota
absolute  flow se hataya jata hai, sabse paas ke positioned ancestor se rakha jata hai
fixed     flow se hataya jata hai, VIEWPORT se rakha jata hai — scroll anndekha karta hai
sticky    scroll threshold tak normal flow, phir fixed jaisa vyavhaar
\`\`\`

**Stacking: do boxes overlap karein, kaun jeetega?**

\`\`\`css
.a { z-index: 1; }
.b { z-index: 2; }   /* b upar banta hai */
\`\`\`

\`z-index\` sirf un elements ko compare karta hai jo **pehle se positioned hain** (\`static\` nahi) — normal-flow element par lagane se kuch nahi hota, ye ek aur chupi hui chook hai jo log lagatar jhelte hain.

**Yaad rakho:** absolute ko positioned ancestor chahiye nahi to wo page tak nikal jata hai; z-index ko position chahiye nahi to wo kuch nahi karta.`,

    content: `## The five values

\`\`\`css
position: static;    /* default — top/left/right/bottom/z-index all inert */
position: relative;  /* stays in flow, nudged from its normal spot */
position: absolute;  /* removed from flow, positioned from nearest positioned ancestor */
position: fixed;     /* removed from flow, positioned from the viewport */
position: sticky;    /* flow until a threshold, then acts fixed within its own parent */
\`\`\`

## The containing-block rule, precisely

\`position: absolute\` positions the element relative to the nearest ancestor whose \`position\` is **not** \`static\`. That ancestor doesn't need any \`top\`/\`left\` value itself — \`position: relative\` alone, with nothing else set, is enough to make it the reference point without moving it at all. This is the single most common pattern in CSS: a "positioning context" wrapper around something that needs a badge, tooltip, or overlay pinned to a corner.

\`\`\`css
.card { position: relative; }          /* just an anchor */
.badge { position: absolute; top: 8px; right: 8px; }
\`\`\`

If \`.card\` had no positioned ancestor of its own either, the badge would escape all the way to the \`<html>\` element — the classic "why is my tooltip in the corner of the whole page" bug.

## fixed versus sticky

\`\`\`css
.header { position: fixed; top: 0; }     /* pinned to the viewport, always */
.header { position: sticky; top: 0; }    /* pinned only once you scroll TO it */
\`\`\`

\`fixed\` is positioned relative to the viewport from the very start and takes the element out of flow — the space it used to occupy in the layout is gone the moment you set it. \`sticky\` is a flow element until the scroll position crosses the threshold you gave it, and then it "sticks" — but only within the bounds of its own parent. A sticky element scrolls away again once its parent's bottom edge scrolls past. This is why a sticky sidebar item stops sticking once you scroll past the sidebar itself.

## z-index and the stacking context

\`\`\`css
.behind { position: relative; z-index: 1; }
.front  { position: relative; z-index: 2; }
\`\`\`

Two rules people miss constantly:

1. **\`z-index\` does nothing on a \`static\` element.** It is only compared between positioned elements (or flex/grid items, which get the same privilege).
2. **\`z-index\` only competes within the same stacking context.** A child with \`z-index: 9999\` still loses to a sibling of its *parent* if that parent's own \`z-index\` is lower — the child's huge number never escapes its parent's stacking context. Properties like \`opacity\`, \`transform\` and \`filter\` also silently create a new stacking context, which is a common cause of "z-index: 99999 still doesn't work".

## Overflow — the other half of "my tooltip is trapped"

\`\`\`css
.card { overflow: hidden; }   /* clips ANYTHING that visually extends past this box */
\`\`\`

An absolutely positioned child that pokes outside its positioned ancestor's box gets clipped if that ancestor (or any box between them) has \`overflow: hidden\`, \`auto\`, or \`scroll\`. This is unrelated to z-index — it happens regardless of stacking order — and it is the second most common reason a dropdown or tooltip appears to vanish or get cut off.

## When positioning is (and is not) the right tool

Reach for \`position\` for things that must break out of the document's shape: tooltips, dropdown menus, modals, badges, sticky headers. Do not reach for it to build ordinary layout — a two-column page, a card grid — that is what flow, flexbox and grid are for. Positioned elements do not push or interact with their siblings at all, which is exactly why they are wrong for anything that should participate in the page's shape.`,

    contentHi: `## Paanch values

\`\`\`css
position: static;    /* default — top/left/right/bottom/z-index sab nishkriya */
position: relative;  /* flow mein rehta hai, apni normal jagah se hilta hai */
position: absolute;  /* flow se hataya jata hai, sabse paas ke positioned ancestor se */
position: fixed;     /* flow se hataya jata hai, viewport se */
position: sticky;     /* ek threshold tak flow, phir apne parent ke andar fixed jaisa */
\`\`\`

## Containing-block ka niyam, seedha

\`position: absolute\` element ko us sabse paas ke ancestor ke hisaab se rakhta hai jiska \`position\` \`static\` **nahi** hai. Us ancestor ko khud koi \`top\`/\`left\` value chahiye hi nahi — akela \`position: relative\`, bina kuch aur set kiye, use bina hilaye reference point bana deta hai. Ye CSS ka sabse aam pattern hai: kisi cheez ke charon taraf ek "positioning context" wrapper jise corner mein badge, tooltip, ya overlay chipkana hai.

\`\`\`css
.card { position: relative; }          /* sirf ek anchor */
.badge { position: absolute; top: 8px; right: 8px; }
\`\`\`

Agar \`.card\` ka khud koi positioned ancestor nahi hota, to badge poori tarah \`<html>\` element tak nikal jata — wahi classic "mera tooltip poore page ke corner mein kyun hai" bug.

## fixed aur sticky

\`\`\`css
.header { position: fixed; top: 0; }     /* viewport se chipka, hamesha */
.header { position: sticky; top: 0; }    /* sirf tab chipka jab aap wahan tak scroll karo */
\`\`\`

\`fixed\` shuru se hi viewport ke hisaab se rakha jata hai aur element ko flow se bahar le jata hai — layout mein jo jagah wo leta tha wo set karte hi khatam ho jati hai. \`sticky\` ek flow element hai jab tak scroll position aapke diye threshold ko paar nahi karti, phir wo "chipak" jata hai — par sirf apne parent ki seemaon ke andar. Sticky element parent ka niche wala kinara scroll hote hi phir se scroll ho jata hai. Isiliye sticky sidebar item sidebar ke khatam hote hi chipakna band kar deta hai.

## z-index aur stacking context

\`\`\`css
.behind { position: relative; z-index: 1; }
.front  { position: relative; z-index: 2; }
\`\`\`

Do niyam jo log lagatar chhod dete hain:

1. **\`z-index\` \`static\` element par kuch nahi karta.** Ye sirf positioned elements ke beech compare hota hai (ya flex/grid items, jinhe wahi vishesh adhikar milta hai).
2. **\`z-index\` sirf usi stacking context ke andar compete karta hai.** \`z-index: 9999\` wala bachcha apne *parent* ke ek bhai-behen se bhi haar sakta hai agar us parent ka apna \`z-index\` kam hai — bachche ka bada number kabhi apne parent ke stacking context se bahar nahi nikalta. \`opacity\`, \`transform\` aur \`filter\` jaisi properties bhi chupchap naya stacking context bana deti hain, jo "z-index: 99999 phir bhi nahi chalta" ka ek aam karan hai.

## Overflow — "mera tooltip phansa hua hai" ka doosra hissa

\`\`\`css
.card { overflow: hidden; }   /* jo bhi is box se dikhne mein bahar nikale use kaat deta hai */
\`\`\`

Ek absolutely positioned bachcha jo apne positioned ancestor ke box se bahar jhankta hai, kat jata hai agar wo ancestor (ya unke beech koi bhi box) \`overflow: hidden\`, \`auto\`, ya \`scroll\` rakhta hai. Iska z-index se koi lena-dena nahi hai — ye stacking order chahe kuch bhi ho hota hai — aur ye doosri sabse aam wajah hai jispar dropdown ya tooltip gayab ya kata hua dikhta hai.

## Positioning kab sahi auzaar hai (aur kab nahi)

\`position\` un cheezon ke liye lo jinhe document ki shakal se bahar nikalna hi hai: tooltips, dropdown menus, modals, badges, sticky headers. Isse aam layout banane ke liye mat lo — do-column page, card grid — uske liye flow, flexbox aur grid hain. Positioned elements apne bhai-behnon ko bilkul nahi dhakelte na unse react karte, aur yahi wajah hai ki wo page ki shakal mein hissa lene wali kisi bhi cheez ke liye galat hain.`,

    examples: [
      {
        title: 'The trapped tooltip: no positioned ancestor',
        titleHi: 'Phansa hua tooltip: koi positioned ancestor nahi',
        code: `.button { /* no position declared */ }
.tooltip { position: absolute; top: -32px; left: 0; }`,
        preview: page(`<div class="page">
  <p>Some page content up here.</p>
  <button class="btn">Hover me<span class="tip">I escaped to the page root</span></button>
</div>`,
`.page { position:relative; height:140px; border:2px dashed #94a3b8; padding:8px; }
.btn { margin-top:40px; padding:8px 14px; }
.tip { position:absolute; top:-32px; left:0; background:#1e293b; color:#fff; padding:4px 8px; font-size:12px; border-radius:4px; }`),
        previewHeight: 190,
        explain: 'The tooltip is positioned relative to `.page` (the nearest ancestor that happens to be positioned here) rather than the button, because the button itself declared no position — the browser kept walking up until it found one.',
        explainHi: 'Tooltip `.page` ke hisaab se (yahan sabse paas ka positioned ancestor) rakha gaya, button ke hisaab se nahi, kyunki button ne khud koi position declare nahi ki — browser tab tak upar chalta gaya jab tak use ek nahi mila.',
      },
      {
        title: 'The fix: position: relative on the button',
        titleHi: 'Fix: button par position: relative',
        code: `.button { position: relative; }   /* the anchor, doesn't move */
.tooltip { position: absolute; top: -32px; left: 0; }`,
        preview: page(`<div class="page">
  <p>Some page content up here.</p>
  <button class="btn">Hover me<span class="tip">Correctly anchored above the button</span></button>
</div>`,
`.page { position:relative; height:140px; border:2px dashed #94a3b8; padding:8px; }
.btn { position:relative; margin-top:40px; padding:8px 14px; }
.tip { position:absolute; top:-32px; left:0; background:#1e293b; color:#fff; padding:4px 8px; font-size:12px; border-radius:4px; }`),
        previewHeight: 190,
        explain: 'One property, on the button, and nothing else changed. `position: relative` with no top/left of its own has no visual effect except becoming the reference point the absolute child now measures from.',
        explainHi: 'Button par ek property, aur kuch aur nahi badla. `position: relative` bina apne top/left ke koi drishya asar nahi rakhta, sirf ek reference point ban jata hai jisse absolute bachcha ab naapta hai.',
      },
      {
        title: 'relative: nudged, but the gap it left behind stays',
        titleHi: 'relative: hilta hai, par jo jagah chhodi wo rehti hai',
        code: `.moved { position: relative; top: 12px; left: 12px; }`,
        preview: page(`<div class="row"><span class="box">A</span><span class="box moved">B — moved</span><span class="box">C</span></div>`,
`${boxes}
.row { display:flex; gap:6px; }
.moved { position:relative; top:12px; left:12px; }`),
        previewHeight: 130,
        explain: 'B visually shifted down and right, but C did not move over to fill B\'s original spot — that space is still reserved, because `relative` keeps the element in flow. Only its paint position changed.',
        explainHi: 'B dikhne mein neeche-dayein khisak gaya, par C B ki asli jagah bharne nahi aaya — wo jagah abhi bhi ruki hai, kyunki `relative` element ko flow mein rakhta hai. Sirf uski dikhne wali jagah badli.',
      },
      {
        title: 'fixed: pinned to the viewport, ignores scroll',
        titleHi: 'fixed: viewport se chipka, scroll anndekha karta hai',
        code: `.header { position: fixed; top: 0; left: 0; right: 0; }`,
        preview: page(`<div class="scroller">
  <header class="h">Fixed header — stays put</header>
  <div class="content">
    <p>Scroll this box.</p><p>Line 2</p><p>Line 3</p><p>Line 4</p><p>Line 5</p><p>Line 6</p><p>Line 7</p>
  </div>
</div>`,
`.scroller { position:relative; height:150px; overflow:auto; border:2px dashed #94a3b8; }
.h { position:fixed; top:12px; left:12px; right:12px; background:#1e293b; color:#fff; padding:6px; font-size:12px; z-index:1; }
.content { padding-top:36px; padding-left:8px; }
.content p { margin:0 0 30px; font-size:13px; }`),
        previewHeight: 190,
        explain: 'Scroll the inner box and the header never moves, because `fixed` measures from the viewport, not from any scrolling ancestor. Note it is also removed from flow — the content had to be manually pushed down with padding to avoid starting underneath it.',
        explainHi: 'Andar wale box ko scroll karo aur header kabhi nahi hilta, kyunki `fixed` viewport se naapta hai, kisi scroll hote ancestor se nahi. Ye flow se bhi hataya gaya hai — content ko uske neeche shuru hone se bachane ke liye padding se haath se neeche dhakelna pada.',
      },
      {
        title: 'sticky: flow, then fixed, then flow escapes it again',
        titleHi: 'sticky: flow, phir fixed, phir flow use phir chhod deta hai',
        code: `.label { position: sticky; top: 0; }`,
        preview: page(`<div class="scroller">
  <div class="group"><div class="label">Group A</div><p>Item 1</p><p>Item 2</p><p>Item 3</p></div>
  <div class="group"><div class="label">Group B</div><p>Item 1</p><p>Item 2</p><p>Item 3</p></div>
</div>`,
`.scroller { height:150px; overflow:auto; border:2px dashed #94a3b8; }
.group { position:relative; }
.label { position:sticky; top:0; background:#fde68a; padding:4px 8px; font-size:13px; font-weight:600; }
.group p { margin:4px 8px; font-size:13px; }`),
        previewHeight: 190,
        explain: 'Scroll down: "Group A" sticks to the top of the scroller while its items scroll past, then releases once "Group B" pushes it out — sticky is bounded by its own parent, unlike fixed which is bounded by nothing.',
        explainHi: 'Neeche scroll karo: "Group A" scroller ke top se chipak jata hai jabki uske items niche scroll hote hain, phir "Group B" ke use dhakelte hi chhod deta hai — sticky apne parent tak seemit hai, fixed ke ulat jo kisi se seemit nahi.',
      },
      {
        title: 'z-index does nothing without position',
        titleHi: 'z-index bina position ke kuch nahi karta',
        code: `.front { z-index: 10; }                     /* static — ignored */
.front { position: relative; z-index: 10; }  /* now it works */`,
        preview: page(`<div class="stage">
  <div class="a">A (z-index:10, static — ignored)</div>
  <div class="b">B (default stacking — on top anyway)</div>
</div>
<div class="stage" style="margin-top:10px">
  <div class="a2">A (position:relative; z-index:10 — now wins)</div>
  <div class="b">B</div>
</div>`,
`.stage { position:relative; height:70px; }
.a { position:absolute; top:0; left:0; width:180px; padding:10px; background:#fecaca; z-index:10; font-size:12px; }
.a2 { position:absolute; top:0; left:0; width:180px; padding:10px; background:#bbf7d0; z-index:10; font-size:12px; }
.b { position:absolute; top:15px; left:40px; width:180px; padding:10px; background:#dbeafe; font-size:12px; }`),
        previewHeight: 180,
        explain: 'z-index alone on a would-be static element has no effect if that element never gets a `position`. The moment it does, the same z-index value takes effect and correctly wins the stack.',
        explainHi: 'Agar element ko kabhi `position` na mile to akela z-index kuch nahi karta. Jaise hi wo milta hai, wahi z-index value asar karti hai aur stack sahi se jeet jati hai.',
      },
      {
        title: 'A parent stacking context traps a child\'s huge z-index',
        titleHi: 'Parent ka stacking context bachche ke bade z-index ko rok deta hai',
        code: `.parent-a { position: relative; z-index: 1; }
.parent-b { position: relative; z-index: 2; }
.parent-a .child { z-index: 9999; }   /* still loses to parent-b */`,
        preview: page(`<div class="stage">
  <div class="pa">Parent A (z-index: 1)<div class="ca">Child z-index: 9999</div></div>
  <div class="pb">Parent B (z-index: 2)</div>
</div>`,
`.stage { position:relative; height:90px; }
.pa { position:absolute; top:0; left:0; width:170px; height:60px; background:#fde68a; z-index:1; font-size:12px; padding:6px; }
.ca { position:absolute; top:30px; left:10px; width:150px; background:#dc2626; color:#fff; z-index:9999; font-size:12px; padding:6px; }
.pb { position:absolute; top:20px; left:60px; width:170px; height:60px; background:#93c5fd; z-index:2; font-size:12px; padding:6px; }`),
        previewHeight: 150,
        explain: 'The red child has a z-index of 9999 yet renders behind Parent B, because it is only competing within Parent A\'s own stacking context — and Parent A (z-index 1) already lost to Parent B (z-index 2) before the child\'s number was ever considered.',
        explainHi: 'Laal bachche ka z-index 9999 hai phir bhi wo Parent B ke peeche dikhta hai, kyunki wo sirf Parent A ke apne stacking context ke andar compete kar raha hai — aur Parent A (z-index 1) pehle hi Parent B (z-index 2) se haar chuka tha, bachche ka number kabhi vichar mein aaya hi nahi.',
      },
      {
        title: 'overflow: hidden clips a positioned child regardless of z-index',
        titleHi: 'overflow: hidden z-index chahe kuch bhi ho positioned bachche ko kaat deta hai',
        code: `.card { position: relative; overflow: hidden; }
.badge { position: absolute; top: -10px; right: -10px; z-index: 99; }`,
        preview: page(`<div class="card"><p>Card content</p><span class="badge">NEW</span></div>`,
`.card { position:relative; overflow:hidden; width:160px; height:70px; border:1px solid #94a3b8; padding:8px; background:#f8fafc; }
.badge { position:absolute; top:-10px; right:-10px; z-index:99; background:#dc2626; color:#fff; padding:4px 8px; font-size:11px; border-radius:99px; }`),
        previewHeight: 130,
        explain: 'A z-index of 99 does not save the badge — `overflow: hidden` on the positioning ancestor clips anything that visually extends past its box, regardless of stacking order. This is a completely separate rule from z-index, and it is the other common reason a dropdown appears cut off.',
        explainHi: 'z-index 99 badge ko bacha nahi pata — positioning ancestor par `overflow: hidden` kisi bhi cheez ko kaat deta hai jo uske box se dikhne mein bahar nikale, stacking order chahe kuch bhi ho. Ye z-index se bilkul alag niyam hai, aur dropdown ke kate hue dikhne ki doosri aam wajah yahi hai.',
      },
      {
        title: 'A correctly built dropdown menu',
        titleHi: 'Sahi se bana hua dropdown menu',
        code: `.menu-wrap { position: relative; }   /* anchor, no overflow:hidden */
.dropdown  { position: absolute; top: 100%; left: 0; z-index: 10; }`,
        preview: page(`<div class="menu-wrap">
  <button class="btn">Options ▾</button>
  <div class="dropdown">
    <div class="opt">Edit</div>
    <div class="opt">Duplicate</div>
    <div class="opt">Delete</div>
  </div>
</div>
<p style="margin-top:70px;font-size:13px;color:#666">Text below, unaffected — the dropdown never pushed it.</p>`,
`.menu-wrap { position:relative; display:inline-block; }
.btn { padding:6px 12px; }
.dropdown { position:absolute; top:100%; left:0; z-index:10; background:#fff; border:1px solid #94a3b8; box-shadow:0 4px 10px rgba(0,0,0,.15); min-width:120px; }
.opt { padding:8px 12px; font-size:13px; border-bottom:1px solid #f1f5f9; }`),
        previewHeight: 240,
        explain: 'The wrapper is the anchor and deliberately has no `overflow: hidden`, so the menu can extend past it freely. `top: 100%` means "start exactly at my own bottom edge" — a common trick for anchoring a panel directly under its trigger.',
        explainHi: 'Wrapper anchor hai aur jaan-boojh kar `overflow: hidden` nahi rakhta, isliye menu uske bahar aazaadi se ja sakta hai. `top: 100%` matlab "bilkul apne khud ke neeche wale kinare se shuru ho" — apne trigger ke seedhe neeche panel anchor karne ka aam jugaad.',
      },
    ],

    mistakes: [
      {
        wrong: `.button { }   /* no position — parent never declared */
.tooltip { position: absolute; top: -30px; }`,
        right: `.button { position: relative; }
.tooltip { position: absolute; top: -30px; }`,
        previewWrong: page(`<div class="p"><button class="b">Btn<span class="t">Escaped</span></button></div>`,
          `.p{position:relative;height:80px;border:2px dashed #ef4444;padding:20px}.b{padding:6px 10px}.t{position:absolute;top:-30px;left:0;background:#fee2e2;border:1px solid #ef4444;padding:2px 6px;font-size:11px}`),
        previewRight: page(`<div class="p"><button class="b">Btn<span class="t">Anchored</span></button></div>`,
          `.p{position:relative;height:80px;border:2px dashed #10b981;padding:20px}.b{position:relative;padding:6px 10px}.t{position:absolute;top:-30px;left:0;background:#dcfce7;border:1px solid #10b981;padding:2px 6px;font-size:11px}`),
        previewHeight: 130,
        why: 'An absolutely positioned element measures from the nearest ancestor that has any position other than static. Without one nearby, it escapes all the way to the page.',
        whyHi: 'Absolutely positioned element us sabse paas ke ancestor se naapta hai jiska koi bhi position static ke alawa hai. Aas-paas koi na ho to wo poore page tak nikal jata hai.',
      },
      {
        wrong: `.modal { z-index: 999999; }   /* static element — number ignored */`,
        right: `.modal { position: fixed; z-index: 999999; }`,
        why: '`z-index` is inert on a `static` element — it is compared only between elements that have a `position` set. The number, however large, does nothing until the element is actually positioned.',
        whyHi: '`z-index` `static` element par nishkriya hai — ye sirf un elements ke beech compare hota hai jinka `position` set hai. Number, chahe kitna bhi bada ho, kuch nahi karta jab tak element sach mein positioned na ho.',
      },
      {
        wrong: `.card { position: relative; overflow: hidden; }
.dropdown { position: absolute; top: 100%; z-index: 999; }
/* dropdown gets clipped anyway */`,
        right: `.card { position: relative; }   /* remove overflow:hidden, or move the dropdown out of this ancestor */
.dropdown { position: absolute; top: 100%; z-index: 999; }`,
        why: '`overflow: hidden` clips anything that visually extends past the box regardless of z-index — the two rules are unrelated. If a card needs clipped corners AND a dropdown that escapes them, the dropdown cannot be a descendant of the clipped box.',
        whyHi: '`overflow: hidden` z-index chahe kuch bhi ho box se bahar dikhne wali kisi bhi cheez ko kaat deta hai — dono niyam alag hain. Agar card ko kate hue corners bhi chahiye AUR unse bahar nikalta dropdown bhi, to dropdown clipped box ka descendant nahi ho sakta.',
      },
    ],

    realWorld: [
      {
        en: '**Every dropdown, tooltip and modal library.** Radix, Headless UI and Floating UI all exist largely to solve exactly this lesson correctly and automatically — computing a positioned ancestor, keeping the element in the viewport, and escaping clipping ancestors via portals.',
        hi: '**Har dropdown, tooltip aur modal library.** Radix, Headless UI aur Floating UI zyadatar isi lesson ko sahi tarike se aur apne aap hal karne ke liye bane hain — positioned ancestor nikalna, element ko viewport ke andar rakhna, aur portals se clipping ancestors se bachna.',
      },
      {
        en: '**Sticky table headers and sidebars.** `position: sticky` is why a spreadsheet-style table can keep its header row visible while the body scrolls, without any JavaScript scroll listener.',
        hi: '**Sticky table headers aur sidebars.** `position: sticky` isi wajah se spreadsheet-jaisi table apni header row dikhati rakh sakti hai jabki body scroll hoti hai, bina kisi JavaScript scroll listener ke.',
      },
      {
        en: '**Portals in React.** `ReactDOM.createPortal` exists specifically to escape an ancestor\'s `overflow: hidden` — mounting a modal at the document root instead of deep inside a clipped card is the standard fix for the clipping mistake above.',
        hi: '**React mein Portals.** `ReactDOM.createPortal` khaas taur par ancestor ke `overflow: hidden` se bachne ke liye hai — modal ko kisi clipped card ke andar gehre lagane ke bajaye document root par lagana upar wali clipping galti ka standard fix hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What determines where an absolutely positioned element is anchored?',
        qHi: 'Absolutely positioned element kahan anchor hoga, ye kya tay karta hai?',
        a: 'The nearest ancestor whose `position` is anything other than `static` — commonly `relative`, but `absolute`, `fixed` or `sticky` all qualify too. That ancestor does not need any `top`/`left` value; setting `position: relative` alone, with nothing else, is enough to make it the reference point without moving it. If no ancestor qualifies, the element is positioned relative to the initial containing block, which is effectively the page.',
        aHi: 'Wo sabse paas ka ancestor jiska `position` `static` ke alawa kuch bhi hai — aksar `relative`, par `absolute`, `fixed` ya `sticky` bhi maane jaate hain. Us ancestor ko koi `top`/`left` value chahiye nahi; akele `position: relative` lagana, bina kuch aur ke, use bina hilaye reference point bana deta hai. Agar koi ancestor qualify na kare, to element initial containing block ke hisaab se rakha jata hai, jo asal mein page hi hai.',
      },
      {
        q: 'What is the difference between `fixed` and `sticky`?',
        qHi: '`fixed` aur `sticky` mein kya fark hai?',
        a: 'Both remove — sort of — the element from participating with its neighbours once active, but they differ in when and relative to what. `fixed` is positioned relative to the viewport from the moment it is applied, ignoring all scrolling, and it is out of normal flow immediately. `sticky` behaves as a normal flow element until the scroll position crosses a given threshold (like `top: 0`), at which point it behaves like `fixed`, but only within the bounds of its own parent — once the parent scrolls out of view, the sticky element scrolls away with it.',
        aHi: 'Dono, active hone ke baad, element ko apne padosiyon se hissa lene se ek tarah se hataate hain, par kab aur kis ke hisaab se isme fark hai. `fixed` jaise hi lagta hai viewport ke hisaab se rakha jata hai, poora scroll anndekha karta hai, aur turant normal flow se bahar hota hai. `sticky` tab tak ek normal flow element ki tarah rehta hai jab tak scroll position diye gaye threshold (jaise `top: 0`) ko paar nahi karti, us waqt wo `fixed` jaisa ho jata hai, par sirf apne parent ki seemaon ke andar — parent view se bahar scroll hote hi sticky element bhi uske saath scroll ho jata hai.',
      },
      {
        q: 'Why does `z-index` sometimes have no effect?',
        qHi: '`z-index` kabhi-kabhi kuch asar kyun nahi karta?',
        a: 'Two common reasons. First, `z-index` is only compared between elements that have a `position` other than `static` — on a static element it is completely inert. Second, `z-index` only competes within its own stacking context: a child with an enormous z-index still cannot escape and beat an element outside its parent if the parent itself lost the stacking comparison, because properties like `position` combined with `z-index`, along with `opacity < 1`, `transform`, and `filter`, all create new stacking contexts that trap their descendants\' z-index values inside them.',
        aHi: 'Do aam wajahein. Pehli, `z-index` sirf un elements ke beech compare hota hai jinka `position` `static` nahi hai — static element par ye poori tarah nishkriya hai. Doosri, `z-index` sirf apne stacking context ke andar compete karta hai: bade z-index wala bachcha apne parent se bahar nikal kar us element ko nahi haraa sakta jo parent ke bahar hai, agar parent khud stacking comparison haar gaya ho, kyunki `position` ke saath `z-index`, aur `opacity < 1`, `transform`, `filter` jaisi properties naya stacking context banati hain jo apne descendants ke z-index values ko apne andar rok leti hain.',
      },
      {
        q: 'Why does a dropdown sometimes get clipped even with a high z-index?',
        qHi: 'Bade z-index ke bawajood dropdown kabhi kabhi kat kyun jata hai?',
        a: 'Because `overflow: hidden` (or `auto`/`scroll`) on any ancestor between the dropdown and its positioned anchor clips anything that visually extends past that ancestor\'s box — completely independent of z-index or stacking. z-index only decides paint order among overlapping elements; it has no power over clipping. The usual fix is to remove the overflow rule from that ancestor, restructure so the dropdown is not a descendant of it, or render the dropdown through a portal directly under the document body.',
        aHi: 'Kyunki dropdown aur uske positioned anchor ke beech kisi bhi ancestor par \`overflow: hidden\` (ya \`auto\`/\`scroll\`) us ancestor ke box se dikhne mein bahar nikalne wali kisi bhi cheez ko kaat deta hai — z-index ya stacking se poori tarah alag. z-index sirf overlap hote elements ke beech paint order tay karta hai; clipping par uska koi zor nahi. Aam fix hai us ancestor se overflow rule hataana, dhancha aisa banana ki dropdown uska descendant na ho, ya dropdown ko portal ke zariye seedha document body ke neeche render karna.',
      },
      {
        q: 'How does margin behave differently on a `relative` versus a `static` element?',
        qHi: '`relative` aur `static` element par margin ka vyavhaar kaise alag hai?',
        a: 'On a `static` element margin pushes neighbouring elements away as usual — it affects the whole layout. On a `relative` element, `top`/`left`/`right`/`bottom` visually shift the element from where it would otherwise sit, but the space it originally occupied stays reserved — its siblings do not move to fill the gap. This is different from margin, which genuinely does redistribute space; `relative` offsets only change what is painted, not the underlying flow calculation.',
        aHi: '`static` element par margin hamesha ki tarah aas-paas ke elements ko dhakelta hai — poore layout ko asar karta hai. `relative` element par, `top`/`left`/`right`/`bottom` element ko dikhne mein wahan se hilate hain jahan wo warna baitha hota, par jo jagah usne pehle li thi wo ruki rehti hai — uske bhai-behan gap bharne nahi aate. Ye margin se alag hai, jo sach mein jagah dobara baantta hai; `relative` ke offsets sirf ye badalte hain ki kya dikhta hai, flow ka bunyaadi hisaab nahi.',
      },
    ],

    exercises: [
      {
        task: 'Build a badge in the corner of a card. First leave the card without `position: relative` and note where the badge ends up. Then add it and watch the badge snap into place.',
        taskHi: 'Card ke corner mein ek badge banao. Pehle card par `position: relative` na lagao aur dekho badge kahan pahunchta hai. Phir lagao aur dekho badge apni jagah pe aa jata hai.',
        hint: 'Without it, check the badge\'s position relative to the whole preview, not just the card.',
        hintHi: 'Bina lagaye, badge ki jagah poore preview ke hisaab se check karo, sirf card ke hisaab se nahi.',
      },
      {
        task: 'Build a sticky section label inside a scrollable list with two groups. Confirm it releases when its own group scrolls past, and does not simply stay glued to the top forever.',
        taskHi: 'Do groups wali scrollable list ke andar sticky section label banao. Confirm karo ki wo apna group scroll hote hi chhod deta hai, hamesha ke liye top se chipka nahi rehta.',
        hint: 'Each group needs its own wrapping element with `position: relative` for the sticky label to release correctly at the right boundary.',
        hintHi: 'Sticky label ko sahi seema par sahi se chhodne ke liye har group ko apna wrapping element chahiye jispar `position: relative` ho.',
      },
      {
        task: 'Give a child element z-index: 9999 inside a parent with a lower z-index than a sibling, and confirm the child still loses. Then raise the parent\'s z-index instead and confirm it now wins.',
        taskHi: 'Ek bachche ko z-index: 9999 do us parent ke andar jiska z-index kisi bhai-behan se kam hai, aur confirm karo ki bachcha phir bhi haarta hai. Phir bachche ke bajaye parent ka z-index badhao aur confirm karo ki ab wo jeetta hai.',
        hint: 'This demonstrates that z-index numbers only mean something within their own stacking context.',
        hintHi: 'Ye dikhata hai ki z-index numbers sirf apne stacking context ke andar hi kuch matlab rakhte hain.',
      },
    ],

    keyTakeaways: [
      '`position: absolute` anchors to the nearest ancestor with any position other than `static` — or escapes to the page if none exists.',
      '`position: relative` alone, with no offsets, is the standard way to create that anchor without moving anything.',
      '`fixed` is pinned to the viewport and ignores scrolling; `sticky` is pinned only within its own parent, and only past a scroll threshold.',
      '`z-index` is inert on `static` elements and only competes within its own stacking context — a huge number cannot escape a losing parent.',
      '`overflow: hidden` clips anything extending past its box regardless of z-index — a completely separate rule from stacking.',
      'Positioning is for things that must break out of the page\'s shape — tooltips, modals, dropdowns — not for ordinary layout.',
    ],
    keyTakeawaysHi: [
      '`position: absolute` sabse paas ke us ancestor se anchor hota hai jiska position `static` ke alawa kuch bhi ho — ya koi na mile to page tak nikal jata hai.',
      'Bina offsets ke akela `position: relative` kuch bhi hilaye bina wo anchor banane ka standard tarika hai.',
      '`fixed` viewport se chipka hai aur scroll anndekha karta hai; `sticky` sirf apne parent ke andar, aur sirf ek scroll threshold ke baad chipakta hai.',
      '`z-index` `static` elements par nishkriya hai aur sirf apne stacking context ke andar compete karta hai — bada number haarte parent se bahar nahi nikal sakta.',
      '`overflow: hidden` z-index chahe kuch bhi ho box se bahar nikalne wali kisi bhi cheez ko kaat deta hai — stacking se poori tarah alag niyam.',
      'Positioning un cheezon ke liye hai jinhe page ki shakal se bahar nikalna hi hai — tooltips, modals, dropdowns — aam layout ke liye nahi.',
    ],
  },
];
