/**
 * CSS & HTML Complete Course — Module 1 (HTML), lesson 5.
 *
 * Tables. The broken example is a "table" built entirely from styled divs —
 * it looks pixel-identical to a real table, and is invisible structure to a
 * screen reader, because visual alignment and semantic meaning are two
 * different things a div can never provide on its own.
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

export const CSS_MODULE_1C: CourseLesson[] = [
  {
    slug: 'html-tables',
    title: 'Tables',
    titleHi: 'Tables',
    description: 'A "table" built from styled divs that looks pixel-perfect and says nothing to a screen reader.',
    descriptionHi: 'Styled divs se bana ek "table" jo pixel-perfect dikhta hai aur screen reader ko kuch nahi batata.',
    difficulty: 'EASY',
    duration: 26,
    order: 5,

    analogy: {
      en: '**A spreadsheet versus a photo of a spreadsheet.** Rows of numbers lined up with CSS `display: flex` are a photo of a spreadsheet — it looks exactly right to an eye, but you cannot ask it "what is in the Price column of row 3?" because nothing in it ever said "this is a column called Price". A real `<table>` is the actual spreadsheet: every cell knows which row and column it belongs to, so a screen reader — or a script, or a browser\'s own table-sorting features — can navigate it by structure, not just by pixels.',
      hi: '**Ek spreadsheet aur spreadsheet ki ek photo.** CSS \`display: flex\` se laaine mein lage numbers spreadsheet ki ek photo hain — aankh ko bilkul sahi dikhte hain, par aap usse ye nahi pooch sakte "row 3 ke Price column mein kya hai?" kyunki usme kabhi kisi ne kaha hi nahi "ye Price naam ka column hai". Ek asli \`<table>\` asli spreadsheet hai: har cell ko pata hai wo kaunsi row aur column mein hai, isliye screen reader — ya koi script, ya browser ki apni table-sorting features — use pixels se nahi, structure se navigate kar sakte hain.',
    },

    simple: `**Start broken.** A price list, built the way it visually "just works":

\`\`\`html
<div class="row"><div>Item</div><div>Price</div></div>
<div class="row"><div>Coffee</div><div>$4</div></div>
<div class="row"><div>Tea</div><div>$3</div></div>
\`\`\`

\`\`\`css
.row { display: flex; }
.row div { flex: 1; }
\`\`\`

On screen, this looks exactly like a table — three neat rows, two aligned columns. But turn on a screen reader and navigate into it: you hear "Item. Price. Coffee. $4. Tea. $3." — six disconnected words, with no way to ask "which row is this cell in?" or "which column is Price?". Visually it is a table. Structurally, to any technology that is not a pair of human eyes, it is six meaningless boxes in a row.

**The fix: use the element that actually means "table"**

\`\`\`html
<table>
  <thead>
    <tr><th>Item</th><th>Price</th></tr>
  </thead>
  <tbody>
    <tr><td>Coffee</td><td>$4</td></tr>
    <tr><td>Tea</td><td>$3</td></tr>
  </tbody>
</table>
\`\`\`

Now a screen reader announces "Table, 2 columns, 3 rows. Item, Price. Coffee, $4." — it knows the shape, the headers, and which cell belongs to which row and column, because the tags themselves carry that meaning. This is the exact same lesson as Module 1's very first one: HTML labels what things *are*, and a div styled to look like a table is a lie the browser cannot see through.

**The five tags that make a real table**

\`\`\`html
<table>            <!-- the whole table -->
  <thead>           <!-- the header section -->
    <tr>             <!-- a row -->
      <th>Item</th>   <!-- a HEADER cell -->
    </tr>
  </thead>
  <tbody>            <!-- the body section -->
    <tr>
      <td>Coffee</td>  <!-- a normal DATA cell -->
    </tr>
  </tbody>
</table>
\`\`\`

\`<th>\` versus \`<td>\` is the entire trick: \`<th>\` means "this cell is a heading for the row or column it sits in", and screen readers use that relationship to announce "Price: $4" instead of just "$4" when you land on a data cell — the header is read out *for* you.

**Tables overflow. Plan for it.**

\`\`\`css
.table-wrap { overflow-x: auto; }
\`\`\`

\`\`\`html
<div class="table-wrap">
  <table>...</table>
</div>
\`\`\`

A wide table on a narrow phone screen either breaks the page layout by forcing horizontal overflow on the whole body, or — wrapped in a scrollable container — stays contained and simply scrolls sideways within its own box. This one wrapper is the entire fix for "my table breaks mobile".

**Remember:** if data genuinely has rows and columns — a price list, a schedule, a spreadsheet export — reach for \`<table>\`, not \`<div>\` plus flexbox. Visual alignment is not the same thing as structure.`,

    simpleHi: `**Toote hue se shuru.** Ek price list, jaise wo dikhne mein "bas chal jaata hai":

\`\`\`html
<div class="row"><div>Item</div><div>Price</div></div>
<div class="row"><div>Coffee</div><div>$4</div></div>
<div class="row"><div>Tea</div><div>$3</div></div>
\`\`\`

\`\`\`css
.row { display: flex; }
.row div { flex: 1; }
\`\`\`

Screen par, ye bilkul table jaisa dikhta hai — teen saaf rows, do aligned columns. Par screen reader on karo aur andar navigate karo: aapko sunayi deta hai "Item. Price. Coffee. $4. Tea. $3." — chhe bikhre hue shabd, ye poochne ka koi tarika nahi ki "ye cell kaunsi row mein hai?" ya "Price kaunsa column hai?". Dikhne mein ye table hai. Structure mein, insaani aankhon ke alawa kisi bhi technology ke liye, ye row mein chhe bemaani boxes hain.

**Fix: wo element use karo jiska asal mein matlab "table" hai**

\`\`\`html
<table>
  <thead>
    <tr><th>Item</th><th>Price</th></tr>
  </thead>
  <tbody>
    <tr><td>Coffee</td><td>$4</td></tr>
    <tr><td>Tea</td><td>$3</td></tr>
  </tbody>
</table>
\`\`\`

Ab screen reader ye ghoshit karta hai "Table, 2 columns, 3 rows. Item, Price. Coffee, $4." — use shakal, headers, aur kaunsa cell kaunsi row aur column mein hai, sab pata hai, kyunki tags khud wo matlab uthaate hain. Ye bilkul Module 1 ke bilkul pehle lesson jaisa hi sabak hai: HTML batata hai cheezein *hai kya*, aur table jaisa dikhne ke liye style kiya gaya div ek jhooth hai jise browser dekh nahi sakta.

**Paanch tags jo asli table banate hain**

\`\`\`html
<table>            <!-- poora table -->
  <thead>           <!-- header hissa -->
    <tr>             <!-- ek row -->
      <th>Item</th>   <!-- ek HEADER cell -->
    </tr>
  </thead>
  <tbody>            <!-- body hissa -->
    <tr>
      <td>Coffee</td>  <!-- ek normal DATA cell -->
    </tr>
  </tbody>
</table>
\`\`\`

\`<th>\` aur \`<td>\` ka fark hi poora jugaad hai: \`<th>\` ka matlab hai "ye cell us row ya column ka heading hai jisme wo baitha hai", aur screen readers is rishte ko use karke "Price: $4" ghoshit karte hain, sirf "$4" ke bajaye, jab aap data cell par pahunchte ho — header aapke liye padha jata hai.

**Tables overflow karti hain. Uske liye taiyaar raho.**

\`\`\`css
.table-wrap { overflow-x: auto; }
\`\`\`

\`\`\`html
<div class="table-wrap">
  <table>...</table>
</div>
\`\`\`

Sankri phone screen par chaudi table ya to poore body par horizontal overflow majboor karke page layout tod deti hai, ya — ek scrollable container mein lipti hui — apne andar hi ruki rehti hai aur bas apni khud ki box mein bagal se scroll hoti hai. Ye ek wrapper hi "meri table mobile tod deti hai" ka poora fix hai.

**Yaad rakho:** agar data mein sach mein rows aur columns hain — price list, schedule, spreadsheet export — to \`<table>\` uthao, \`<div>\` plus flexbox nahi. Drishya alignment structure jaisi cheez nahi hai.`,

    content: `## The full anatomy of a table

\`\`\`html
<table>
  <caption>Q1 Product Sales</caption>

  <thead>
    <tr>
      <th scope="col">Product</th>
      <th scope="col">Units</th>
      <th scope="col">Revenue</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">Coffee</th>
      <td>240</td>
      <td>$960</td>
    </tr>
    <tr>
      <th scope="row">Tea</th>
      <td>180</td>
      <td>$540</td>
    </tr>
  </tbody>

  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>420</td>
      <td>$1,500</td>
    </tr>
  </tfoot>
</table>
\`\`\`

- \`<caption>\` is the table's title, announced first by a screen reader — it is to a table what \`alt\` is to an image, and it is frequently skipped even though it is one line.
- \`<thead>\`/\`<tbody>\`/\`<tfoot>\` group rows by role. \`<tfoot>\` is for summary rows (totals, averages) and, unusually, can be written before \`<tbody>\` in the source while still rendering last — browsers place it correctly regardless of source order.
- \`scope="col"\` on a \`<th>\` says "I am the heading for everything below me in this column"; \`scope="row"\` says "I am the heading for everything beside me in this row". Without \`scope\`, a screen reader has to guess, and often guesses wrong on complex tables.

## th versus td — the one fact that matters most

\`\`\`html
<th>Price</th>   <!-- a HEADING cell: bold and centred by default, and read aloud as a label -->
<td>$4</td>      <!-- a DATA cell: plain text, read aloud as a value -->
\`\`\`

The visual difference (bold, centred) is a browser default you can override with CSS — that is not the point of \`<th>\`. The point is the accessibility relationship it creates: when a screen reader user tabs to a data cell, it can announce the row and column headers associated with that cell, turning a bare "$4" into "Price, Coffee: $4". A table built entirely from \`<td>\` cells, even with bold CSS on the first row, never creates that relationship — the bold text is just visually bold text, invisible as structure.

## colspan and rowspan — cells that span multiple slots

\`\`\`html
<table>
  <tr>
    <th colspan="2">Name</th>
    <th>Age</th>
  </tr>
  <tr>
    <td>First</td>
    <td>Last</td>
    <td>29</td>
  </tr>
</table>
\`\`\`

\`colspan="2"\` makes one header cell stretch across two columns beneath it — useful for a grouped heading like "Name" sitting above separate "First"/"Last" columns. \`rowspan\` does the equivalent vertically, for a cell that applies to several rows at once (a category label spanning three product rows, for example).

## Responsive tables: the wrapper pattern

\`\`\`css
.table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;   /* smooth momentum scrolling on iOS */
}
\`\`\`

\`\`\`html
<div class="table-wrap">
  <table>...</table>
</div>
\`\`\`

A table's natural width is however wide its content needs to be — it does not shrink to fit a phone screen the way text wraps. Wrapping it in a container with \`overflow-x: auto\` contains that overflow to the table itself: the table scrolls sideways within its box, while the rest of the page layout stays intact. Without the wrapper, a wide table forces the entire page body to scroll horizontally, which is a far worse experience.

## An alternative for small phones: reflowing rows into cards

\`\`\`css
@media (max-width: 600px) {
  table, thead, tbody, tr, th, td { display: block; }
  thead { display: none; }
  td::before { content: attr(data-label) ": "; font-weight: 600; }
}
\`\`\`

\`\`\`html
<td data-label="Price">$4</td>
\`\`\`

At the narrowest widths, some products abandon the scrolling table entirely and use CSS to make each row present as a stacked card, with each cell's own label injected from a \`data-*\` attribute via \`::before\`. This trades a real, semantically correct table structure at the DOM level for a card-like visual layout — a deliberate, non-default technique used when scrolling sideways is judged worse for the specific content than restructuring visually.

## Styling tables with CSS

\`\`\`css
table { border-collapse: collapse; width: 100%; }
th, td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: left; }
tbody tr:nth-child(even) { background: #f8fafc; }
\`\`\`

\`border-collapse: collapse\` merges adjacent cell borders into single lines instead of the default double-border look. \`nth-child(even)\` on rows is the standard "zebra striping" pattern, which measurably helps a reader's eye track across a wide row without losing their place — the same line-tracking problem covered in Module 2's line-length lesson, solved here by colour instead of width.`,

    contentHi: `## Table ki poori anatomy

\`\`\`html
<table>
  <caption>Q1 Product Sales</caption>

  <thead>
    <tr>
      <th scope="col">Product</th>
      <th scope="col">Units</th>
      <th scope="col">Revenue</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">Coffee</th>
      <td>240</td>
      <td>$960</td>
    </tr>
    <tr>
      <th scope="row">Tea</th>
      <td>180</td>
      <td>$540</td>
    </tr>
  </tbody>

  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>420</td>
      <td>$1,500</td>
    </tr>
  </tfoot>
</table>
\`\`\`

- \`<caption>\` table ka title hai, screen reader se sabse pehle ghoshit hota hai — table ke liye ye wahi hai jo image ke liye \`alt\` hai, aur ek line hone ke bawajood aksar chhoda ja deta hai.
- \`<thead>\`/\`<tbody>\`/\`<tfoot>\` rows ko unke role se group karte hain. \`<tfoot>\` summary rows (totals, averages) ke liye hai aur, ajeeb taur par, source mein \`<tbody>\` se pehle likha ja sakta hai phir bhi aakhri mein render hota hai — browsers ise source order se bekhabar sahi jagah rakhte hain.
- \`<th>\` par \`scope="col"\` kehta hai "main us column mein neeche har cheez ka heading hoon"; \`scope="row"\` kehta hai "main us row mein mere bagal har cheez ka heading hoon". \`scope\` ke bina, screen reader ko andaza lagana padta hai, aur complex tables par aksar galat andaza lagata hai.

## th aur td — sabse zyada matter karne wali ek baat

\`\`\`html
<th>Price</th>   <!-- ek HEADING cell: default roop se bold aur centred, aur label ki tarah padhi jati hai -->
<td>$4</td>      <!-- ek DATA cell: saadha text, value ki tarah padha jata hai -->
\`\`\`

Drishya fark (bold, centred) ek browser default hai jise aap CSS se override kar sakte ho — ye \`<th>\` ka matlab nahi hai. Matlab wo accessibility rishta hai jo ye banata hai: jab screen reader user data cell par tab karta hai, to wo us cell se jude row aur column headers ghoshit kar sakta hai, ek nangi "$4" ko "Price, Coffee: $4" bana kar. Poori tarah \`<td>\` cells se bana table, pehli row par bold CSS ke bawajood bhi, wo rishta kabhi nahi banata — bold text sirf dikhne mein bold text hai, structure ki tarah adrishya.

## colspan aur rowspan — kai slots span karne wale cells

\`\`\`html
<table>
  <tr>
    <th colspan="2">Name</th>
    <th>Age</th>
  </tr>
  <tr>
    <td>First</td>
    <td>Last</td>
    <td>29</td>
  </tr>
</table>
\`\`\`

\`colspan="2"\` ek header cell ko uske neeche do columns tak pheelata hai — "Name" jaisi grouped heading ke liye kaam ka jo alag "First"/"Last" columns ke upar baithi hai. \`rowspan\` yahi kaam khadi taraf karta hai, aise cell ke liye jo ek saath kai rows par lagu hoti hai (jaise ek category label jo teen product rows tak pheeli ho).

## Responsive tables: wrapper pattern

\`\`\`css
.table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;   /* iOS par smooth momentum scrolling */
}
\`\`\`

\`\`\`html
<div class="table-wrap">
  <table>...</table>
</div>
\`\`\`

Table ki svaabhavik chaudai wahi hai jitni uske content ko chahiye — wo phone screen mein fit hone ke liye text ki tarah wrap nahi hoti. Ise \`overflow-x: auto\` wale container mein lapetne se wo overflow sirf table tak seemit rehta hai: table apni box ke andar hi bagal se scroll hoti hai, jabki baaki page layout theek raheta hai. Wrapper ke bina, chaudi table poore page body ko horizontally scroll karne majboor kar deti hai, jo kaafi bura anubhav hai.

## Chhote phones ke liye ek vikalp: rows ko cards mein reflow karna

\`\`\`css
@media (max-width: 600px) {
  table, thead, tbody, tr, th, td { display: block; }
  thead { display: none; }
  td::before { content: attr(data-label) ": "; font-weight: 600; }
}
\`\`\`

\`\`\`html
<td data-label="Price">$4</td>
\`\`\`

Sabse sankri chaudaiyon par, kuch products poori tarah scroll hoti table chhod dete hain aur CSS use karke har row ko stacked card ki tarah dikhate hain, har cell ka apna label \`data-*\` attribute se \`::before\` ke zariye daalte hue. Ye DOM level par asli, semantically sahi table structure ko card-jaisi drishya layout ke badle mein deta hai — ek jaan-boojha hua, gair-default tarika jo tab use hota hai jab bagal se scroll karna us khaas content ke liye dikhne mein dobara banaane se bura maana jaye.

## CSS se tables style karna

\`\`\`css
table { border-collapse: collapse; width: 100%; }
th, td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: left; }
tbody tr:nth-child(even) { background: #f8fafc; }
\`\`\`

\`border-collapse: collapse\` bagal wali cells ke borders ko default double-border dikhne ke bajaye ek line mein jod deta hai. Rows par \`nth-child(even)\` "zebra striping" ka standard pattern hai, jo naapa gaya taur par padhne wale ki aankh ko chaudi row ke aar-paar apni jagah khoye bina track karne mein madad karta hai — wahi line-tracking samasya jo Module 2 ke line-length lesson mein thi, yahan chaudai ke bajaye rang se hal ki gayi.`,

    examples: [
      {
        title: 'The broken version: divs pretending to be a table',
        titleHi: 'Toota version: table hone ka natak karte hue divs',
        code: `<div class="row"><div>Item</div><div>Price</div></div>
<div class="row"><div>Coffee</div><div>$4</div></div>`,
        preview: page(`<div class="row header"><div>Item</div><div>Price</div></div>
<div class="row"><div>Coffee</div><div>$4</div></div>
<div class="row"><div>Tea</div><div>$3</div></div>
<p style="font-size:13px;color:#666;margin-top:8px">Looks like a table. A screen reader announces six disconnected pieces of text with no row/column relationship at all.</p>`,
`.row { display:flex; border-bottom:1px solid #e5e7eb; }
.row div { flex:1; padding:6px 10px; font-size:13px; }
.header { font-weight:600; background:#f8fafc; }`),
        previewHeight: 180,
        explain: 'Visually indistinguishable from a real table. The gap is entirely invisible to a sighted mouse user and entirely present for anyone using assistive technology, which is exactly the kind of bug that ships unnoticed for years.',
        explainHi: 'Dikhne mein asli table se alag nahi kiya ja sakta. Ye kami mouse use karne wale dekhne wale user ke liye poori tarah adrishya hai aur assistive technology use karne wale kisi ke liye poori tarah maujood hai, aur bilkul aisa bug hai jo saalon bina dhyan diye ship ho jata hai.',
      },
      {
        title: 'The fix: a real semantic table',
        titleHi: 'Fix: ek asli semantic table',
        code: `<table>
  <thead><tr><th>Item</th><th>Price</th></tr></thead>
  <tbody>
    <tr><td>Coffee</td><td>$4</td></tr>
    <tr><td>Tea</td><td>$3</td></tr>
  </tbody>
</table>`,
        preview: page(`<table>
  <thead><tr><th>Item</th><th>Price</th></tr></thead>
  <tbody>
    <tr><td>Coffee</td><td>$4</td></tr>
    <tr><td>Tea</td><td>$3</td></tr>
  </tbody>
</table>`,
`table { border-collapse:collapse; font-size:13px; }
th, td { padding:6px 12px; border-bottom:1px solid #e5e7eb; text-align:left; }
th { background:#f8fafc; }`),
        previewHeight: 150,
        explain: 'Pixel-similar to the broken version, but now a screen reader announces "Table, 2 columns, 3 rows" and reads each data cell together with its column header — structure a div can visually mimic but never actually provide.',
        explainHi: 'Toote hue version se pixel mein milta-julta, par ab screen reader "Table, 2 columns, 3 rows" ghoshit karta hai aur har data cell ko uske column header ke saath padhta hai — structure jise div dikhne mein nakal kar sakta hai par kabhi asal mein de nahi sakta.',
      },
      {
        title: 'caption — the table\'s alt text',
        titleHi: 'caption — table ka alt text',
        code: `<table>
  <caption>Q1 Product Sales</caption>
  ...
</table>`,
        preview: page(`<table>
  <caption>Q1 Product Sales</caption>
  <thead><tr><th>Product</th><th>Revenue</th></tr></thead>
  <tbody><tr><td>Coffee</td><td>$960</td></tr></tbody>
</table>`,
`table { border-collapse:collapse; font-size:13px; }
caption { text-align:left; font-weight:600; margin-bottom:6px; }
th, td { padding:6px 12px; border-bottom:1px solid #e5e7eb; text-align:left; }`),
        previewHeight: 150,
        explain: 'A sighted user infers the table\'s subject from surrounding page context. A screen reader user landing directly on the table hears the caption first, which is often the only clue they get about what the table is actually about.',
        explainHi: 'Dekhne wala user table ka vishay aas-paas ke page context se andaza laga leta hai. Screen reader user jo seedha table par pahunchta hai, use sabse pehle caption sunayi deta hai, jo aksar table asal mein kis baare mein hai iska ekmatra sanket hota hai.',
      },
      {
        title: 'scope="col" and scope="row" resolve ambiguity',
        titleHi: 'scope="col" aur scope="row" abhaas dur karte hain',
        code: `<th scope="col">Revenue</th>   <!-- heading for the column below -->
<th scope="row">Coffee</th>     <!-- heading for the row beside -->`,
        preview: page(`<table>
  <thead><tr><th scope="col">Product</th><th scope="col">Revenue</th></tr></thead>
  <tbody>
    <tr><th scope="row">Coffee</th><td>$960</td></tr>
    <tr><th scope="row">Tea</th><td>$540</td></tr>
  </tbody>
</table>`,
`table { border-collapse:collapse; font-size:13px; }
th, td { padding:6px 12px; border-bottom:1px solid #e5e7eb; text-align:left; }
th[scope="col"] { background:#f8fafc; }`),
        previewHeight: 150,
        explain: 'On a data cell like "$960", a screen reader with scope information can announce "Revenue, Coffee: $960" — both the column and row headers — rather than leaving the user to guess which row and column they landed on.',
        explainHi: '"$960" jaise data cell par, scope jaankari wala screen reader "Revenue, Coffee: $960" ghoshit kar sakta hai — column aur row dono headers — user ko andaza lagana chhod diye bina ki wo kaunsi row aur column par pahuncha.',
      },
      {
        title: 'colspan grouping related columns under one heading',
        titleHi: 'colspan judi columns ko ek heading ke tehat group karna',
        code: `<tr>
  <th colspan="2">Name</th>
  <th>Age</th>
</tr>
<tr><td>First</td><td>Last</td><td>29</td></tr>`,
        preview: page(`<table>
  <tr><th colspan="2">Name</th><th>Age</th></tr>
  <tr><td>Ada</td><td>Lovelace</td><td>29</td></tr>
</table>`,
`table { border-collapse:collapse; font-size:13px; }
th, td { padding:6px 12px; border:1px solid #e5e7eb; text-align:center; }`),
        previewHeight: 130,
        explain: 'One "Name" header visually and structurally spans the two columns beneath it, correctly grouping "First" and "Last" as sub-parts of the same concept instead of three unrelated equal-weight columns.',
        explainHi: 'Ek "Name" header dikhne mein aur structure mein apne neeche ki do columns ko span karta hai, "First" aur "Last" ko sahi tarike se usi concept ke sub-parts ki tarah group karta hai, teen na-jude barabar-wazan wale columns ke bajaye.',
      },
      {
        title: 'rowspan for a category label spanning several rows',
        titleHi: 'kai rows tak pheeli category label ke liye rowspan',
        code: `<tr><th rowspan="2">Drinks</th><td>Coffee</td><td>$4</td></tr>
<tr><td>Tea</td><td>$3</td></tr>`,
        preview: page(`<table>
  <tr><th rowspan="2">Drinks</th><td>Coffee</td><td>$4</td></tr>
  <tr><td>Tea</td><td>$3</td></tr>
  <tr><th>Snacks</th><td>Chips</td><td>$2</td></tr>
</table>`,
`table { border-collapse:collapse; font-size:13px; }
th, td { padding:6px 12px; border:1px solid #e5e7eb; text-align:left; }`),
        previewHeight: 160,
        explain: '"Drinks" spans two rows without being repeated, correctly expressing that both Coffee and Tea belong to the same category, rather than duplicating the label or leaving it ambiguous which rows it covers.',
        explainHi: '"Drinks" bina dohraaye do rows span karta hai, sahi tarike se batate hue ki Coffee aur Tea dono ek hi category ke hain, label dohraane ya ye abhaas chhodne ke bajaye ki wo kaunsi rows ko cover karta hai.',
      },
      {
        title: 'Without the overflow wrapper, a wide table breaks the page',
        titleHi: 'Overflow wrapper ke bina, chaudi table page tod deti hai',
        code: `<table>...</table>   <!-- no wrapper — table forces the whole body to scroll sideways -->`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 6px">Imagine this preview is a 375px phone. Without a wrapper, the WHOLE PAGE gains horizontal scroll because of this one wide table:</p>
<table>
  <tr><th>Product</th><th>SKU</th><th>Warehouse</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>
  <tr><td>Coffee</td><td>SKU-001</td><td>North</td><td>240</td><td>$4.00</td><td>$960.00</td></tr>
</table>`,
`table { border-collapse:collapse; font-size:12px; white-space:nowrap; }
th, td { padding:6px 10px; border:1px solid #e5e7eb; }`),
        previewHeight: 150,
        explain: 'This table is wider than a phone screen and has nowhere to put the overflow, so — without a wrapper — the entire page body scrolls sideways, dragging unrelated content off-screen along with it.',
        explainHi: 'Ye table phone screen se chaudi hai aur overflow ke liye koi jagah nahi hai, isliye — wrapper ke bina — poora page body bagal se scroll hota hai, apne saath na-judi content ko bhi screen se bahar khinch ta hai.',
      },
      {
        title: 'The overflow wrapper contains the scroll to the table',
        titleHi: 'Overflow wrapper scroll ko table tak seemit karta hai',
        code: `<div class="table-wrap"><table>...</table></div>`,
        preview: page(`<p style="font-size:13px;color:#666;margin:0 0 6px">Same table, wrapped. Only the table itself scrolls sideways; the paragraph below stays put.</p>
<div class="table-wrap">
<table>
  <tr><th>Product</th><th>SKU</th><th>Warehouse</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>
  <tr><td>Coffee</td><td>SKU-001</td><td>North</td><td>240</td><td>$4.00</td><td>$960.00</td></tr>
</table>
</div>
<p style="font-size:13px;margin-top:8px">This text never moves, no matter how far the table above is scrolled.</p>`,
`.table-wrap { overflow-x:auto; max-width:280px; border:1px solid #94a3b8; }
table { border-collapse:collapse; font-size:12px; white-space:nowrap; }
th, td { padding:6px 10px; border:1px solid #e5e7eb; }`),
        previewHeight: 210,
        explain: 'Try scrolling the table sideways in this preview — the surrounding page stays fixed. The wrapper contains the overflow to a single scrollable box instead of letting it escape to the whole document.',
        explainHi: 'Is preview mein table ko bagal se scroll karke dekho — aas-paas ka page tika rehta hai. Wrapper overflow ko ek scrollable box tak seemit rakhta hai, use poore document tak nikalne dene ke bajaye.',
      },
      {
        title: 'nth-child(even) zebra striping for readability',
        titleHi: 'Padhne ki suvidha ke liye nth-child(even) zebra striping',
        code: `tbody tr:nth-child(even) { background: #f8fafc; }`,
        preview: page(`<table>
  <thead><tr><th>Product</th><th>Units</th><th>Revenue</th></tr></thead>
  <tbody>
    <tr><td>Coffee</td><td>240</td><td>$960</td></tr>
    <tr><td>Tea</td><td>180</td><td>$540</td></tr>
    <tr><td>Cocoa</td><td>90</td><td>$270</td></tr>
    <tr><td>Juice</td><td>60</td><td>$180</td></tr>
  </tbody>
</table>`,
`table { border-collapse:collapse; width:100%; font-size:13px; }
th, td { padding:6px 12px; text-align:left; }
th { background:#e2e8f0; }
tbody tr:nth-child(even) { background:#f8fafc; }`),
        previewHeight: 200,
        explain: 'The alternating background gives the eye a visual anchor when tracking a wide row from left to right, the same line-tracking problem solved by limiting paragraph width, here solved with colour instead.',
        explainHi: 'Badalta hua background aankh ko ek chaudi row ko baayein se dayein track karte waqt ek drishya anchor deta hai, wahi line-tracking samasya jo paragraph ki chaudai seemit karke hal ki jati hai, yahan chaudai ke bajaye rang se hal ki gayi.',
      },
    ],

    mistakes: [
      {
        wrong: `<div class="table"><div class="row"><div>Item</div><div>Price</div></div></div>
/* looks right, invisible structure to a screen reader */`,
        right: `<table><thead><tr><th>Item</th><th>Price</th></tr></thead></table>`,
        previewWrong: page(`<div class="row"><div>Item</div><div>Price</div></div>`,
          `.row{display:flex;font-size:13px;font-weight:600}.row div{flex:1;padding:6px}`),
        previewRight: page(`<table><thead><tr><th>Item</th><th>Price</th></tr></thead></table>`,
          `table{border-collapse:collapse;font-size:13px}th{padding:6px 12px;text-align:left}`),
        previewHeight: 90,
        why: 'A div styled with flexbox can visually mimic a table perfectly, but it carries no row/column relationship a screen reader can announce — visual alignment and semantic structure are two separate things, and only a real `<table>` provides both.',
        whyHi: 'Flexbox se style kiya hua div table ki drishya nakal poori tarah kar sakta hai, par usme koi row/column rishta nahi hai jo screen reader ghoshit kar sake — drishya alignment aur semantic structure do alag cheezein hain, aur sirf asli \`<table>\` dono deta hai.',
      },
      {
        wrong: `<table>
  <tr><td>Item</td><td>Price</td></tr>   <!-- header row built from <td>, not <th> -->
  <tr><td>Coffee</td><td>$4</td></tr>
</table>`,
        right: `<table>
  <thead><tr><th>Item</th><th>Price</th></tr></thead>
  <tbody><tr><td>Coffee</td><td>$4</td></tr></tbody>
</table>`,
        why: 'A `<td>` first row can be styled bold with CSS to look like a header, but it creates none of the accessibility relationship `<th>` provides — a screen reader still reads it as an ordinary data cell, not a heading.',
        whyHi: '\`<td>\` wali pehli row CSS se bold style karke heading jaisi dikhaayi ja sakti hai, par ye \`<th>\` ka koi bhi accessibility rishta nahi banaati — screen reader use phir bhi ek saadhe data cell ki tarah padhta hai, heading ki tarah nahi.',
      },
      {
        wrong: `<table><!-- no wrapper --></table>
/* on a phone, this forces the whole page body to scroll sideways */`,
        right: `<div class="table-wrap" style="overflow-x: auto;"><table>...</table></div>`,
        why: 'A table\'s natural width is set by its content, not the viewport — it does not shrink to fit a narrow screen. Without a scrollable wrapper, an unavoidably wide table drags the entire page into horizontal scroll instead of containing the overflow to itself.',
        whyHi: 'Table ki svaabhavik chaudai uske content se tay hoti hai, viewport se nahi — wo sankri screen mein fit hone ke liye sikudti nahi. Scrollable wrapper ke bina, ek anivaarya roop se chaudi table poore page ko horizontal scroll mein khinch le jati hai, overflow ko khud tak seemit rakhne ke bajaye.',
      },
    ],

    realWorld: [
      {
        en: '**Admin dashboards and data grids.** Any product with a real backend — an inventory system, an analytics panel, a billing history — displays genuinely tabular data, and a semantic `<table>` is what makes it sortable, screen-reader-navigable, and copy-pasteable into a spreadsheet correctly.',
        hi: '**Admin dashboards aur data grids.** Koi bhi product jiska asli backend ho — inventory system, analytics panel, billing history — sach mein tabular data dikhata hai, aur semantic \`<table>\` hi use sortable, screen-reader-navigable, aur spreadsheet mein sahi tarike se copy-paste hone layak banata hai.',
      },
      {
        en: '**Accessibility audits flag div-tables constantly.** "Data table is not marked up as a table" is a standard WCAG finding, and it is one of the easier ones to both cause accidentally (it looks right!) and fix once identified.',
        hi: '**Accessibility audits div-tables ko lagatar flag karte hain.** "Data table ko table ki tarah markup nahi kiya gaya" ek standard WCAG finding hai, aur ye galti se hone (dikhta to sahi hai!) aur pehchaan hote hi theek karne, dono mein aasan hai.',
      },
      {
        en: '**Financial and pricing tables are where the overflow wrapper pattern matters most.** A pricing comparison or a bank statement genuinely needs many columns, and mobile users expect to scroll it sideways rather than have it break the page — this pattern is standard on nearly every fintech product.',
        hi: '**Financial aur pricing tables mein overflow wrapper pattern sabse zyada matter karta hai.** Pricing comparison ya bank statement ko sach mein kai columns chahiye, aur mobile users use bagal se scroll karne ki ummeed rakhte hain, page todne ki nahi — ye pattern lagbhag har fintech product mein standard hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is using divs with flexbox to visually build a table considered an accessibility problem, even if it looks identical to a real table?',
        qHi: 'Table visually banane ke liye divs aur flexbox use karna accessibility ki samasya kyun maana jata hai, chahe wo asli table jaisa hi dikhe?',
        a: 'A visual match is not a structural match. A real `<table>` establishes explicit relationships between cells, rows, and column/row headers that a screen reader can query and announce — for example, reading a data cell together with its associated column header. A div-based layout achieves the same pixel arrangement using flexbox, but carries none of that relationship in the DOM; a screen reader announces each div\'s text in isolation with no way to know it belongs to a row or column. The bug is entirely invisible to sighted users navigating with a mouse, which is exactly why it is so easy to ship without noticing.',
        aHi: 'Drishya milna structural milna nahi hai. Asli \`<table>\` cells, rows, aur column/row headers ke beech saaf rishte banaata hai jo screen reader poochh aur ghoshit kar sakta hai — jaise data cell ko uske jude column header ke saath padhna. Div-based layout flexbox use karke wahi pixel arrangement paata hai, par DOM mein wo rishta bilkul nahi rakhta; screen reader har div ka text alag-thalag ghoshit karta hai, ye jaane bina ki wo kisi row ya column ka hissa hai. Ye bug mouse se navigate karne wale dekhne wale users ke liye poori tarah adrishya hai, aur bilkul isi wajah se ye bina dhyan diye ship hona itna aasan hai.',
      },
      {
        q: 'What is the practical difference between `<th>` and `<td>`, beyond the default bold/centred styling?',
        qHi: '\`<th>\` aur \`<td>\` mein default bold/centred styling se aage amali fark kya hai?',
        a: 'Beyond the default visual styling — which can be overridden with CSS either way — `<th>` establishes an accessibility relationship that `<td>` does not: it marks the cell as a heading for the row or column it belongs to, identified further with `scope="col"` or `scope="row"`. When a screen reader user lands on a related data cell, it can announce the associated header alongside the value, turning a bare number into a labelled one. A table built entirely from `<td>`, even with the first row styled bold via CSS, never creates this relationship, because the styling is purely visual and carries no semantic meaning.',
        aHi: 'Default drishya styling se aage — jo dono taraf CSS se override ho sakti hai — \`<th>\` ek accessibility rishta banaata hai jo \`<td>\` nahi banaata: ye cell ko us row ya column ka heading ki tarah nishaan lagaata hai jiska wo hissa hai, \`scope="col"\` ya \`scope="row"\` se aur saaf kiya jata hai. Jab screen reader user kisi jude data cell par pahunchta hai, to wo value ke saath jude header ko ghoshit kar sakta hai, ek nangi sankhya ko ek labelled sankhya bana kar. Poori tarah \`<td>\` se bani table, pehli row par CSS se bold style kiye jaane par bhi, ye rishta kabhi nahi banaati, kyunki styling poori tarah drishya hai aur koi semantic matlab nahi rakhti.',
      },
      {
        q: 'Why does a wide table need special handling on a narrow screen, and what is the standard fix?',
        qHi: 'Sankri screen par chaudi table ko khaas handling kyun chahiye, aur standard fix kya hai?',
        a: 'A table\'s width is determined by the content it needs to display, not the viewport — unlike text, it does not naturally reflow or shrink to fit a narrow screen. If rendered directly on the page with no containment, a table wider than the viewport forces the entire page body into horizontal scroll, dragging unrelated content along with it. The standard fix is to wrap the table in a container with `overflow-x: auto`, so only that container scrolls sideways while the rest of the page layout remains intact — an approach some products replace at the very narrowest widths with a CSS technique that reflows each row into a stacked, card-like layout instead.',
        aHi: 'Table ki chaudai us content se tay hoti hai jise use dikhana hai, viewport se nahi — text ke ulat, wo sankri screen mein fit hone ke liye svaabhavik roop se reflow ya sikud ti nahi. Bina kisi containment ke seedhe page par render hone par, viewport se chaudi table poore page body ko horizontal scroll mein majboor kar deti hai, apne saath na-judi content ko bhi khinch le jati hai. Standard fix hai table ko \`overflow-x: auto\` wale container mein lapetna, taaki sirf wo container bagal se scroll ho jabki baaki page layout theek rahe — kuch products sabse sankri chaudaiyon par is tarike ki jagah ek CSS jugaad lagate hain jo har row ko stacked, card-jaisi layout mein reflow kar deta hai.',
      },
      {
        q: 'What does `scope="col"` versus `scope="row"` on a `<th>` element actually do?',
        qHi: '\`<th>\` element par \`scope="col"\` aur \`scope="row"\` asal mein kya karte hain?',
        a: 'Both clarify which cells a heading applies to, resolving ambiguity a screen reader would otherwise have to guess at, especially in a table with headers in both the first row and first column. `scope="col"` declares that a `<th>` is the heading for every cell below it in that column. `scope="row"` declares that a `<th>` is the heading for every cell beside it in that row. Without an explicit scope, complex tables — particularly ones with row headers as well as column headers — can be announced incorrectly, because the browser has to infer the relationship heuristically instead of being told directly.',
        aHi: 'Dono saaf karte hain ki heading kaunsi cells par lagu hoti hai, us abhaas ko dur karte hue jo screen reader ko warna andaza lagana padta, khaas taur par aisi table mein jahan headers pehli row aur pehle column dono mein hon. \`scope="col"\` batata hai ki \`<th>\` us column mein uske neeche har cell ka heading hai. \`scope="row"\` batata hai ki \`<th>\` us row mein uske bagal har cell ka heading hai. Seedhe scope ke bina, complex tables — khaas taur par row headers aur column headers dono wali — galat tarike se ghoshit ho sakti hain, kyunki browser ko rishta seedha bataye jaane ke bajaye andaza lagakar nikaalna padta hai.',
      },
      {
        q: 'When should you NOT use a `<table>`?',
        qHi: '\`<table>\` kab use nahi karna chahiye?',
        a: 'A table should be reserved for genuinely tabular data — content with real rows and columns, like a price list, a schedule, or a spreadsheet export, where each cell\'s meaning depends on its row and column position. Using `<table>` purely to achieve a visual page layout — for example, positioning a navigation sidebar and main content side by side — was a common practice in the 1990s and early 2000s and is now considered an anti-pattern, because that arrangement is not actually tabular data; it is layout, and CSS (flexbox or grid) is the correct tool for it. The historical mistake and the modern div-table mistake this lesson focuses on are, in a sense, mirror images of each other: using the wrong tool for what the content structurally is.',
        aHi: 'Table ko sach mein tabular data ke liye rakhna chahiye — asli rows aur columns wala content, jaise price list, schedule, ya spreadsheet export, jahan har cell ka matlab uski row aur column ki jagah par nirbhar karta hai. Sirf drishya page layout paane ke liye \`<table>\` use karna — jaise navigation sidebar aur main content ko bagal-bagal rakhna — 1990s aur 2000s ki shuruaat mein aam tarika tha aur ab anti-pattern maana jata hai, kyunki wo arrangement asal mein tabular data hai hi nahi; wo layout hai, aur CSS (flexbox ya grid) uske liye sahi auzaar hai. Purana galti aur is lesson ki modern div-table galti, ek tarah se, ek doosre ki ulti tasveer hain: content structure mein jo hai uske liye galat auzaar use karna.',
      },
    ],

    exercises: [
      {
        task: 'Build the same price list twice — once as styled flex divs, once as a real table with thead/tbody/th. Turn on your OS screen reader (VoiceOver on Mac, Narrator on Windows) and navigate both, noting the difference in what you hear.',
        taskHi: 'Wahi price list do baar banao — ek baar styled flex divs se, ek baar thead/tbody/th wali asli table se. Apne OS ka screen reader on karo (Mac par VoiceOver, Windows par Narrator) aur dono navigate karo, jo sunayi deta hai uska fark note karo.',
        hint: 'macOS: Cmd+F5 toggles VoiceOver. Windows: Ctrl+Win+Enter toggles Narrator.',
        hintHi: 'macOS: Cmd+F5 VoiceOver toggle karta hai. Windows: Ctrl+Win+Enter Narrator toggle karta hai.',
      },
      {
        task: 'Build a table wide enough to overflow a phone-width viewport. First render it with no wrapper and confirm the whole page scrolls sideways, then add the overflow-x:auto wrapper and confirm only the table scrolls.',
        taskHi: 'Ek table itni chaudi banao ki wo phone-width viewport se bahar nikal jaye. Pehle use bina wrapper ke render karo aur confirm karo poora page bagal se scroll hota hai, phir overflow-x:auto wrapper jodo aur confirm karo sirf table scroll hoti hai.',
        hint: 'Use Chrome DevTools\' device toolbar set to a narrow phone width to see the difference clearly.',
        hintHi: 'Fark saaf dekhne ke liye Chrome DevTools ka device toolbar sankri phone width par set karke use karo.',
      },
      {
        task: 'Build a table with a header row spanning two grouped columns using colspan, and a category column spanning three rows using rowspan.',
        taskHi: 'Ek table banao jisme colspan se do grouped columns tak pheeli header row ho, aur rowspan se teen rows tak pheeli category column ho.',
        hint: 'Draw the table on paper first, marking which cells merge, before writing the HTML.',
        hintHi: 'HTML likhne se pehle table ko kaagaz par khinch lo, ye nishaan lagate hue ki kaunsi cells mil rahi hain.',
      },
    ],

    keyTakeaways: [
      'A div styled with flexbox can look pixel-identical to a table but carries no row/column relationship a screen reader can announce.',
      '`<th>` versus `<td>` is not just visual styling — `<th>` creates an accessibility relationship that lets assistive technology announce a data cell together with its header.',
      '`scope="col"`/`scope="row"` resolve ambiguity in tables that have both row and column headers.',
      '`<caption>` is a table\'s alt text — announced first by a screen reader, and easy to forget since it costs only one line.',
      'A table does not shrink to fit a narrow screen; wrap it in a container with `overflow-x: auto` so only the table scrolls sideways, not the whole page.',
      'Tables belong to genuinely tabular data (rows and columns that mean something); using `<table>` purely for visual page layout is the historical anti-pattern this lesson\'s modern div-table mistake mirrors.',
    ],
    keyTakeawaysHi: [
      'Flexbox se style kiya hua div table se pixel mein milta-julta dikh sakta hai par usme koi row/column rishta nahi jo screen reader ghoshit kar sake.',
      '\`<th>\` aur \`<td>\` sirf drishya styling nahi hai — \`<th>\` ek accessibility rishta banaata hai jo assistive technology ko data cell ko uske header ke saath ghoshit karne deta hai.',
      '\`scope="col"\`/\`scope="row"\` un tables mein abhaas dur karte hain jinme row aur column dono headers hon.',
      '\`<caption>\` table ka alt text hai — screen reader se sabse pehle ghoshit hota hai, aur ek line ki keemat hone ke bawajood bhoolna aasan hai.',
      'Table sankri screen mein fit hone ke liye sikudti nahi; use \`overflow-x: auto\` wale container mein lapeto taaki sirf table bagal se scroll ho, poora page nahi.',
      'Tables sach mein tabular data (rows aur columns jinka matlab ho) ki hain; sirf drishya page layout ke liye \`<table>\` use karna wahi purana anti-pattern hai jiski parchhayi is lesson ki modern div-table galti hai.',
    ],
  },
];
