/**
 * React Complete Course — Module 6: Pro, lesson 13.
 *
 * List virtualization for genuinely long lists (thousands of rows), the
 * last of the eight gaps identified in this course's large-project /
 * large-form / security audit. Broken example: rendering every single
 * row of a 50,000-item array directly via .map() into real DOM nodes —
 * causing a multi-second initial render, enormous memory use, and janky
 * scrolling, since the browser must create, lay out, and paint tens of
 * thousands of real elements regardless of how many are actually visible
 * on screen at once. Fixed with react-window's FixedSizeList, which
 * renders only the handful of rows currently within (or just outside)
 * the visible viewport, using a tall spacer to preserve an accurate
 * scrollbar, so DOM node count stays roughly constant no matter how much
 * data the list actually holds. Also covers when virtualization is not
 * worth its own real costs (browser find-in-page, accessibility tab
 * order, measuring dynamic content) for a small or medium-sized list.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_6_PART13: CourseLesson[] = [
  {
    slug: 'list-virtualization-for-long-lists',
    title: 'List Virtualization for Long Lists',
    titleHi: 'Long Lists Ke Liye List Virtualization',
    description: 'A table meant to display 50,000 transaction rows takes eleven seconds to appear, then scrolls like a slideshow — because the browser is being asked to build, lay out, and paint fifty thousand real DOM elements, even though at most twenty of them are ever visible on screen at once.',
    descriptionHi: 'Ek table jo 50,000 transaction rows dikhaane ke liye hai gyarah second lagti hai dikhne mein, phir ek slideshow ki tarah scroll hoti hai — kyunki browser se poochha jaa raha hai pachaas hazaar asli DOM elements banaane, layout karne, aur paint karne ke liye, chahe ek waqt mein kabhi bhi bees se zyaada screen par dikhte hi nahi.',
    difficulty: 'HARD',
    duration: 20,
    order: 13,

    analogy: {
      en: '**A library that, the instant a reader asks for the card catalog, physically pulls every single one of its 100,000 index cards out of every drawer and spreads them all across the entire reading room floor — versus a library with a single catalog drawer that only ever has a few dozen cards physically sitting inside it at once, sliding forward to reveal the next few dozen exactly as the reader flips through it.** In the everything-on-the-floor library, retrieving the catalog is an enormous, slow physical undertaking regardless of whether the reader only ever intends to look at ten specific cards, because the effort of pulling out and laying down every single card was already spent before the reader even started looking, and the room itself becomes so cluttered that simply walking across it, an analogue of scrolling, becomes exhausting. In the sliding-drawer library, retrieving the catalog costs almost nothing no matter how many total cards the library actually owns, because only the handful of cards the reader could possibly be looking at right now were ever pulled out at all — the other 99,900-some cards remain calmly filed away, untouched, ready to be pulled out only if and when the reader\'s attention actually reaches them. A React list that calls .map() over an entire 50,000-item array and renders a real DOM element for every single one is the everything-on-the-floor library: the browser pays the full cost of creating, measuring, and painting fifty thousand elements up front, even though a typical screen can only physically show a few dozen rows at once. A virtualized list is the sliding-drawer library: it renders only the small number of rows currently within, or just barely outside, the visible viewport, and as the user scrolls, it slides that small window forward, discarding rows that scrolled out of view and creating new ones just as they are about to scroll in, while a tall invisible spacer keeps the browser\'s own scrollbar behaving exactly as if all fifty thousand rows had really been laid out.',
      hi: '**Ek library jo, jis pal ek reader card catalog maangta hai, physically apne 100,000 index cards mein se har ek ko har drawer se nikaal kar poori reading room ke floor par phaila deti hai — versus ek library jismein ek akela catalog drawer hai jismein ek waqt mein kabhi bhi sirf kuch dozen cards physically andar baithe hote hain, aage khisakte hue agle kuch dozen dikhaane ke liye bilkul jaise reader ise palatta hai.** Sab-floor-par library mein, catalog nikaalna ek vishaal, dheema physical udyam hai chahe reader sirf das khaas cards dekhne ka irada rakhta ho, kyunki har ek card ko nikaalne aur bichaane ki koshish pehle hi kharch ho chuki thi reader ke dekhna shuru karne se pehle bhi, aur kamra khud itna bhara ho jaata hai ki sirf usse chalna, scrolling ka ek samaan roop, thakaane waala ho jaata hai. Sliding-drawer library mein, catalog nikaalna lagbhag kuch bhi kharch nahi karta chahe library asal mein kitne bhi total cards ki maalik ho, kyunki sirf mutthi-bhar cards jo reader abhi dekh sakta hai kabhi nikaale gaye hi the — baaki 99,900-kuch cards shaant taur par file kiye hue rehte hain, bina chhue, sirf tabhi nikaale jaane ke liye taiyaar jab reader ka dhyaan asal mein unhe pahunche. Ek React list jo poori 50,000-item array par \`.map()\` bulaata hai aur har ek ke liye ek asli DOM element render karta hai sab-floor-par library hai: browser pachaas hazaar elements banaane, naapne, aur paint karne ki poori keemat pehle hi chukaata hai, chahe ek aam screen ek waqt mein sirf kuch dozen rows hi physically dikha sake. Ek virtualized list sliding-drawer library hai: ye sirf un thodi si rows ko render karta hai jo abhi visible viewport ke andar hain, ya bas thoda bahar, aur jaise user scroll karta hai, ye us chhoti window ko aage khisakaata hai, un rows ko hataate hue jo drishya se bahar scroll ho gayi aur naye banaate hue bilkul jab wo andar aane waali hain, jabki ek lambi adrishya spacer browser ke apne scrollbar ko bilkul waise hi vyavahaar karne deti hai jaise sach mein sab pachaas hazaar rows bichaayi gayi hon.',
    },

    simple: `**Start broken.** Rendering every single row of a huge array directly:

\`\`\`jsx
function TransactionList({ transactions }) { // transactions.length === 50000
  return (
    <div style={{ height: 500, overflow: "auto" }}>
      {transactions.map((t) => (
        <div key={t.id} style={{ height: 40 }}>
          {t.description} — {t.amount}
        </div>
      ))}
    </div>
  );
}
\`\`\`

React itself is not the bottleneck here — calling \`.map()\` over 50,000 items and generating 50,000 React elements is comparatively fast. The real cost is what happens after: the browser must create 50,000 actual DOM nodes, compute layout for every one of them, and paint them, even though the scrollable container is only 500px tall and can physically display roughly a dozen rows at any given moment. Every one of the other 49,988 rows was fully built and laid out purely so it could sit, invisible, above or below the visible scroll position, ready to be seen only if the user scrolls that far — the vast majority of the work the browser just did will never actually be looked at.

**The fix: render only the rows currently visible, via react-window**

\`\`\`jsx
import { FixedSizeList } from "react-window";

function TransactionList({ transactions }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {transactions[index].description} — {transactions[index].amount}
    </div>
  );

  return (
    <FixedSizeList height={500} itemCount={transactions.length} itemSize={40} width="100%">
      {Row}
    </FixedSizeList>
  );
}
\`\`\`

\`\`\`tsx
import { FixedSizeList, ListChildComponentProps } from "react-window";

interface Transaction {
  id: string;
  description: string;
  amount: number;
}

function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const Row = ({ index, style }: ListChildComponentProps) => (
    <div style={style}>
      {transactions[index].description} — {transactions[index].amount}
    </div>
  );

  return (
    <FixedSizeList height={500} itemCount={transactions.length} itemSize={40} width="100%">
      {Row}
    </FixedSizeList>
  );
}
\`\`\`

\`FixedSizeList\` knows the overall container is 500px tall and that each row is exactly 40px, so it can compute exactly which row indices currently fall within that 500px window — roughly 12 or 13 of them — and it renders ONLY those rows\' worth of \`Row\` components, regardless of whether \`transactions\` holds 50 items or 50,000. The \`style\` prop each \`Row\` receives is computed by \`react-window\` itself and contains an absolute \`top\` offset positioning that row exactly where it belongs within a tall inner container sized to the FULL list\'s total height (\`itemCount * itemSize\`) — this inner container is what makes the browser\'s own scrollbar behave exactly as if all 50,000 real rows were actually present, even though only a dozen or so DOM nodes exist at any moment. As the user scrolls, \`react-window\` recalculates which row indices now fall within the visible window and re-renders \`Row\` with the new indices — rows that scrolled out of view are simply not rendered anymore, and their DOM nodes are freed, rather than staying present but hidden somewhere off-screen.`,

    simpleHi: `**Toote hue se shuru.** Ek vishaal array ki har ek row ko seedhe render karna:

\`\`\`jsx
function TransactionList({ transactions }) { // transactions.length === 50000
  return (
    <div style={{ height: 500, overflow: "auto" }}>
      {transactions.map((t) => (
        <div key={t.id} style={{ height: 40 }}>
          {t.description} — {t.amount}
        </div>
      ))}
    </div>
  );
}
\`\`\`

React khud yahaan bottleneck nahi hai — 50,000 items par \`.map()\` bulaana aur 50,000 React elements banaana taulanaatmak roop se tez hai. Asli keemat wo hai jo baad mein hota hai: browser ko 50,000 asli DOM nodes banaane hain, un har ek ke liye layout ganana hai, aur unhe paint karna hai, chahe scrollable container sirf 500px lamba ho aur kisi bhi diye gaye pal par bhautik roop se lagbhag ek dozen rows hi dikha sake. Baaki 49,988 rows mein se har ek poori tarah banaayi aur bichaayi gayi thi sirf isliye ki wo, adrishya, visible scroll position ke oopar ya neeche baith sake, sirf tabhi dekhe jaane ke liye taiyaar jab user itni door scroll kare — browser ne jo kaam abhi kiya uska adhikaansh hissa kabhi asal mein dekha hi nahi jaayega.

**Fix: sirf abhi visible rows render karo, \`react-window\` se**

\`\`\`jsx
import { FixedSizeList } from "react-window";

function TransactionList({ transactions }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {transactions[index].description} — {transactions[index].amount}
    </div>
  );

  return (
    <FixedSizeList height={500} itemCount={transactions.length} itemSize={40} width="100%">
      {Row}
    </FixedSizeList>
  );
}
\`\`\`

\`\`\`tsx
import { FixedSizeList, ListChildComponentProps } from "react-window";

interface Transaction {
  id: string;
  description: string;
  amount: number;
}

function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const Row = ({ index, style }: ListChildComponentProps) => (
    <div style={style}>
      {transactions[index].description} — {transactions[index].amount}
    </div>
  );

  return (
    <FixedSizeList height={500} itemCount={transactions.length} itemSize={40} width="100%">
      {Row}
    </FixedSizeList>
  );
}
\`\`\`

\`FixedSizeList\` jaanta hai ki poora container 500px lamba hai aur har row bilkul 40px hai, isliye ye bilkul gan sakta hai ki abhi kaunse row indices us 500px window ke andar aate hain — lagbhag 12 ya 13 unmein se — aur ye SIRF un rows ke barabar \`Row\` components render karta hai, chahe \`transactions\` mein 50 items ho ya 50,000. Har \`Row\` ko milne wala \`style\` prop \`react-window\` khud ganta hai aur ismein ek absolute \`top\` offset positioning hai jo us row ko bilkul wahaan rakhta hai jahan ye ek lambi inner container ke andar belong karta hai poori list ki total lambaayi ke barabar size ki gayi (\`itemCount * itemSize\`) — ye inner container hi hai jo browser ke apne scrollbar ko bilkul waise vyavahaar karne deta hai jaise sach mein sab 50,000 rows maujood hon, chahe kisi bhi pal ek dozen ke aas-paas DOM nodes hi maujood hon. Jaise user scroll karta hai, \`react-window\` dobara ganta hai ki ab kaunse row indices visible window ke andar aate hain aur \`Row\` ko naye indices ke saath dobara render karta hai — rows jo drishya se bahar scroll ho gayi bas ab render nahi hoti, aur unke DOM nodes azaad ho jaate hain, kahin off-screen chhupe hue maujood rehne ke bajaye.`,

    content: `## Why the browser, not React, is the actual bottleneck

\`\`\`
50,000 rows rendered directly:
  React element creation:  fast  (~tens of milliseconds)
  DOM node creation:       slow  (50,000 real elements)
  Layout (reflow):         slow  (must position every node)
  Paint:                   slow  (must paint every node, even off-screen ones)

~12 rows rendered via virtualization:
  React element creation:  instant
  DOM node creation:       instant  (~12 elements)
  Layout (reflow):         instant
  Paint:                   instant
\`\`\`

It is tempting to assume a slow list is a React performance problem solvable with \`React.memo\` or \`useMemo\`, but neither one changes how many actual DOM nodes get created — they only control whether a component\'s own render function re-runs, not whether the resulting elements become real, laid-out, painted nodes in the browser\'s document. The cost this lesson addresses lives entirely in the browser\'s own rendering pipeline, which scales with the number of DOM nodes that exist, completely independent of how efficiently React itself decided to produce the elements describing them. Virtualization is the only fix that actually reduces DOM node count, which is the thing genuinely scaling with data size here.

## The tall spacer that keeps the scrollbar honest

\`\`\`
Actual DOM at any moment (itemCount = 50000, itemSize = 40):
<div style="height: 500px; overflow: auto">      ← visible viewport
  <div style="height: 2000000px; position: relative">  ← 50000 * 40, the spacer
    <div style="position: absolute; top: 200000px">Row 5000</div>
    <div style="position: absolute; top: 200040px">Row 5001</div>
    ... (~12 rows total, whichever are currently in view)
  </div>
</div>
\`\`\`

If only the currently-visible dozen rows existed in the DOM with no further trick, the browser\'s scrollbar would have nothing to reflect the list\'s true overall size — the scrollable area would just be as tall as those dozen rows, and the scrollbar thumb would be enormous and meaningless relative to the actual 50,000-row dataset. \`react-window\` solves this with an inner container deliberately sized to \`itemCount * itemSize\` (here, 2,000,000px), which the browser treats as the full scrollable content height for the purpose of sizing and positioning the scrollbar thumb, even though only a tiny fraction of that space actually contains real child elements at any given moment. Each currently-rendered row is positioned with \`position: absolute\` and an explicit \`top\` offset calculated from its own index, placing it exactly where it would have sat had every row genuinely been rendered, so scrolling the container and having react-window swap which dozen rows are rendered produces the visual illusion of one continuous, fully-populated 50,000-row list.

## When virtualization is not worth its own cost

Virtualization is not free — it introduces real, genuine costs of its own that a naive \`.map()\` does not have: a browser\'s native Ctrl-F "find on page" cannot find text inside a row that has scrolled out of view and is not currently in the DOM at all, since as far as the browser is concerned that text does not exist right now; keyboard tab order and screen-reader navigation through the list must be handled with more care, since off-screen items genuinely are not there to be focused or announced; and rows with a height that is not known in advance, or that changes based on their own content (a chat message that might be one line or ten), require react-window\'s more involved \`VariableSizeList\`, along with a way to measure each row\'s actual rendered height, rather than the simpler fixed-height \`itemSize\` this lesson has used throughout. For a list of a few dozen or even a few hundred items, the actual DOM-node cost this lesson opened with is nowhere near large enough to cause a real, user-visible slowdown, and introducing virtualization anyway trades away Ctrl-F, simpler accessibility, and simpler code for a performance benefit that, at that scale, was never actually needed. Virtualization earns its cost specifically once a list\'s item count reaches the thousands, where the DOM-node cost this lesson\'s broken example demonstrated becomes large enough to be genuinely, measurably felt by a real user.`,

    contentHi: `## Browser, React nahi, asli bottleneck kyun hai

\`\`\`
50,000 rows seedhe render kiye gaye:
  React element creation:  tez  (~kuch das milliseconds)
  DOM node creation:       dheema  (50,000 asli elements)
  Layout (reflow):         dheema  (har node ko position karna hai)
  Paint:                   dheema  (har node paint karna hai, off-screen wale bhi)

Virtualization se ~12 rows render kiye gaye:
  React element creation:  turant
  DOM node creation:       turant  (~12 elements)
  Layout (reflow):         turant
  Paint:                   turant
\`\`\`

Ye maan lena lubhaavna hai ki ek dheemi list ek React performance samasya hai jo \`React.memo\` ya \`useMemo\` se sulajh sakti hai, par koi bhi ye nahi badalta ki kitne asli DOM nodes banaaye jaate hain — ye sirf ye niyantrit karte hain ki ek component ka apna render function dobara chalta hai ya nahi, ye nahi ki nateeje wale elements browser ke document mein asli, bichaaye hue, paint kiye hue nodes bante hain ya nahi. Ye lesson jo keemat sambodhit karta hai wo poori tarah browser ki apni rendering pipeline mein rehti hai, jo un DOM nodes ki tadaad ke saath scale karti hai jo maujood hain, poori tarah is baat se azaad ki React ne khud kitni kushalta se un elements ko banaaya jo unhe describe karte hain. Virtualization hi akela fix hai jo asal mein DOM node count kam karta hai, jo yahaan asal mein data size ke saath scale karti cheez hai.

## Lambi spacer jo scrollbar ko honest rakhti hai

\`\`\`
Kisi bhi pal asli DOM (itemCount = 50000, itemSize = 40):
<div style="height: 500px; overflow: auto">      ← visible viewport
  <div style="height: 2000000px; position: relative">  ← 50000 * 40, spacer
    <div style="position: absolute; top: 200000px">Row 5000</div>
    <div style="position: absolute; top: 200040px">Row 5001</div>
    ... (~12 rows total, jo bhi abhi drishya mein hain)
  </div>
</div>
\`\`\`

Agar sirf abhi-visible dozen rows DOM mein maujood hoti kisi aur trick ke bina, browser ke scrollbar ke paas kuch bhi nahi hota list ke sachche overall size ko darsaane ke liye — scrollable area bas utni lambi hoti jitni wo dozen rows, aur scrollbar thumb vishaal aur bemaani hota asli 50,000-row dataset ke saapeksh. \`react-window\` ise sulajhaata hai ek inner container se jo jaan-boojhkar \`itemCount * itemSize\` (yahaan, 2,000,000px) tak size kiya gaya hai, jise browser scrollbar thumb ko size aur position karne ke maksad se poori scrollable content height ki tarah treat karta hai, chahe us jagah ka sirf ek chhota hissa asal mein kisi bhi diye gaye pal par asli child elements rakhta ho. Har abhi-rendered row \`position: absolute\` aur uske apne index se gani gayi ek explicit \`top\` offset ke saath position ki jaati hai, use bilkul wahaan rakhte hue jahan ye baithti agar har row sach mein render hui hoti, isliye container ko scroll karna aur react-window dwara kaunsi dozen rows render hoti hain badalna ek lagaataar, poori tarah bhari hui 50,000-row list ka drishya bhram paida karta hai.

## Virtualization kab apni keemat ke laayak nahi hai

Virtualization muft nahi hai — ye apni khud ki asli, sachchi keemat laata hai jo ek saadha \`.map()\` nahi rakhta: browser ka native Ctrl-F "find on page" ek row ke andar text nahi dhoondh sakta jo drishya se bahar scroll ho gayi hai aur abhi DOM mein bilkul nahi hai, kyunki jahan tak browser ka sawaal hai wo text abhi astitva mein hai hi nahi; list ke aar-paar keyboard tab order aur screen-reader navigation ko zyaada dhyaan se sambhaalna padta hai, kyunki off-screen items sach mein wahaan nahi hoti focus ya announce hone ke liye; aur rows jinki height pehle se maloom nahi hai, ya jo apni content ke aadhaar par badalti hai (ek chat message jo ek line ya das ho sakta hai), \`react-window\` ki zyaada shaamil \`VariableSizeList\` maangti hain, har row ki asli render hui height naapne ke ek tarike ke saath, is lesson ne poore samay istemal ki gayi saadhi fixed-height \`itemSize\` ke bajaye. Kuch dozen ya kuch sau items ki ek list ke liye, DOM-node keemat jise ye lesson shuru mein khola kahin bhi itni badi nahi hai ki ek asli, user-visible dheemapan paida kare, aur phir bhi virtualization introduce karna Ctrl-F, saadhi accessibility, aur saadha code ek performance benefit ke liye trade karta hai jo, us scale par, kabhi asal mein zaroori thi hi nahi. Virtualization apni keemat khaas taur par tab kamaata hai jab ek list ki item count hazaaron tak pahunchti hai, jahan DOM-node keemat jo is lesson ke toote example ne darsaayi ek asli user dwara itni mehsoos ki jaane laayak, gani jaane laayak ban jaati hai.`,

    examples: [
      {
        title: 'Broken: rendering all 50,000 rows directly with .map()',
        titleHi: 'Toota: \`.map()\` se seedhe sab 50,000 rows render karna',
        code: `{transactions.map((t) => (
  <div key={t.id}>{t.description}</div>
))}
// creates 50,000 real DOM nodes regardless of viewport size`,
        codeJs: `function TransactionList({ transactions }) {
  return (
    <div style={{ height: 500, overflow: "auto" }}>
      {transactions.map((t) => (
        <div key={t.id} style={{ height: 40 }}>
          {t.description} — {t.amount}
        </div>
      ))}
    </div>
  );
}
// transactions.length === 50000 → 50,000 real DOM nodes created,
// laid out, and painted, though at most ~12 are ever visible`,
        codeTs: `interface Transaction {
  id: string;
  description: string;
  amount: number;
}

function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div style={{ height: 500, overflow: "auto" }}>
      {transactions.map((t) => (
        <div key={t.id} style={{ height: 40 }}>
          {t.description} — {t.amount}
        </div>
      ))}
    </div>
  );
}
// fully valid, correctly typed TypeScript — the slowness is a
// browser rendering cost, not a type-level or logic error`,
        output: `Initial render takes several seconds. Scrolling drops noticeably
in frame rate. Browser memory usage climbs substantially, all
before the user has looked at more than a dozen actual rows.`,
        explain: 'Every one of the 50,000 rows becomes a real DOM node the browser must create, lay out, and paint, even though only about a dozen are visible in the 500px viewport at any moment.',
        explainHi: '50,000 mein se har ek row ek asli DOM node banti hai jo browser ko banaani, layout karni, aur paint karni padti hai, chahe kisi bhi pal 500px viewport mein sirf lagbhag ek dozen hi visible hon.',
      },
      {
        title: 'Fixed: react-window renders only the visible rows',
        titleHi: 'Theek: \`react-window\` sirf visible rows render karta hai',
        code: `<FixedSizeList height={500} itemCount={transactions.length} itemSize={40}>
  {Row}
</FixedSizeList>
// renders only ~12 rows, regardless of itemCount`,
        codeJs: `import { FixedSizeList } from "react-window";

function TransactionList({ transactions }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {transactions[index].description} — {transactions[index].amount}
    </div>
  );

  return (
    <FixedSizeList height={500} itemCount={transactions.length} itemSize={40} width="100%">
      {Row}
    </FixedSizeList>
  );
}`,
        codeTs: `import { FixedSizeList, ListChildComponentProps } from "react-window";

interface Transaction {
  id: string;
  description: string;
  amount: number;
}

function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const Row = ({ index, style }: ListChildComponentProps) => (
    <div style={style}>
      {transactions[index].description} — {transactions[index].amount}
    </div>
  );

  return (
    <FixedSizeList height={500} itemCount={transactions.length} itemSize={40} width="100%">
      {Row}
    </FixedSizeList>
  );
}`,
        outputJs: `Initial render is instant regardless of whether transactions holds
50 or 50,000 items. Scrolling stays smooth, since only a small,
constant number of DOM nodes ever exist at once.`,
        outputTs: `// Identical behaviour. ListChildComponentProps gives Row's
// { index, style } parameter accurate typing sourced directly
// from react-window's own type definitions.`,
        explain: 'FixedSizeList computes which row indices fall within the 500px viewport and renders only those Row instances, discarding rows as they scroll out of view.',
        explainHi: '\`FixedSizeList\` ganta hai ki kaunse row indices 500px viewport ke andar aate hain aur sirf un \`Row\` instances ko render karta hai, rows ko hataate hue jaise wo drishya se bahar scroll hoti hain.',
      },
      {
        title: 'The spacer trick: an inner container sized to the full list',
        titleHi: 'Spacer trick: ek inner container poori list ke barabar size ki gayi',
        code: `<div style={{ height: itemCount * itemSize, position: "relative" }}>
  {/* only visible rows rendered here, each absolutely positioned */}
</div>`,
        codeJs: `// Conceptually what react-window renders internally:
function VirtualizedInner({ itemCount, itemSize, visibleRows }) {
  return (
    <div style={{ height: itemCount * itemSize, position: "relative" }}>
      {visibleRows.map(({ index, top }) => (
        <div key={index} style={{ position: "absolute", top }}>
          {/* Row content for this index */}
        </div>
      ))}
    </div>
  );
}`,
        codeTs: `interface VisibleRow {
  index: number;
  top: number;
}

function VirtualizedInner({
  itemCount,
  itemSize,
  visibleRows,
}: {
  itemCount: number;
  itemSize: number;
  visibleRows: VisibleRow[];
}) {
  return (
    <div style={{ height: itemCount * itemSize, position: "relative" }}>
      {visibleRows.map(({ index, top }) => (
        <div key={index} style={{ position: "absolute", top }}>
          {/* Row content for this index */}
        </div>
      ))}
    </div>
  );
}`,
        outputJs: `The scrollbar's thumb correctly reflects the full 50,000-row
dataset's proportional size, even though only ~12 rows physically
exist in the DOM to produce it.`,
        outputTs: `// Identical behaviour. This is a simplified illustration of the
// mechanism react-window itself implements — application code
// typically uses FixedSizeList directly rather than reproducing this.`,
        explain: 'The tall inner container gives the browser something to size the scrollbar against, while each visible row is absolutely positioned to sit exactly where it would if every row genuinely existed.',
        explainHi: 'Lambi inner container browser ko scrollbar size karne ke liye kuch deti hai, jabki har visible row bilkul wahaan baithne ke liye absolutely position ki jaati hai jahan ye hoti agar har row sach mein maujood hoti.',
      },
    ],

    mistakes: [
      {
        wrong: `{hugeArray.map((item) => <Row key={item.id} item={item} />)}
// renders every item as a real DOM node, regardless of viewport size`,
        right: `<FixedSizeList height={500} itemCount={hugeArray.length} itemSize={40}>
  {Row}
</FixedSizeList>
// renders only the currently-visible rows`,
        why: 'Rendering every item in a large array directly creates one real DOM node per item, causing the browser\'s own layout and paint cost to scale with total data size rather than with what is actually visible.',
        whyHi: 'Ek badi array mein har item ko seedhe render karna prati-item ek asli DOM node banaata hai, browser ki apni layout aur paint keemat ko total data size ke saath scale karaate hue us cheez ke bajaye jo asal mein visible hai.',
      },
      {
        wrong: `const MemoizedRow = React.memo(Row);
// still renders all 50,000 rows, memo only skips re-renders on unchanged props`,
        right: `<FixedSizeList height={500} itemCount={50000} itemSize={40}>{Row}</FixedSizeList>
// actually reduces how many DOM nodes exist, which memo cannot do`,
        why: 'React.memo and useMemo control whether a component\'s render function re-runs, not how many actual DOM nodes the browser must create, lay out, and paint — they do not address the cost this lesson covers.',
        whyHi: '\`React.memo\` aur \`useMemo\` niyantrit karte hain ki ek component ka render function dobara chalta hai ya nahi, ye nahi ki browser ko kitne asli DOM nodes banaane, layout karne, aur paint karne padte hain — wo is lesson ki keemat sambodhit nahi karte.',
      },
      {
        wrong: `<FixedSizeList height={500} itemCount={40} itemSize={40}>{Row}</FixedSizeList>
// virtualizing a list of only 40 items`,
        right: `{smallArray.map((item) => <Row key={item.id} item={item} />)}
// a plain .map() for a genuinely small list`,
        why: 'Introducing virtualization for a list small enough that direct rendering was never actually slow trades away native browser find-in-page and simpler accessibility for a performance benefit that was not needed.',
        whyHi: 'Ek aisi list ke liye virtualization introduce karna jo itni chhoti hai ki seedha rendering kabhi asal mein dheema tha hi nahi native browser find-in-page aur saadhi accessibility ko ek aise performance benefit ke liye trade karta hai jo zaroori nahi thi.',
      },
    ],

    realWorld: [
      {
        en: '**react-window (and its more feature-rich predecessor, react-virtualized) are genuinely widely used, community-maintained libraries specifically built to solve exactly this problem**, not a hypothetical technique invented for this course.',
        hi: '**\`react-window\` (aur iska zyaada feature-rich predecessor, \`react-virtualized\`) sach mein widely used, community-maintained libraries hain khaas taur par bilkul isi samasya ko sulajhaane ke liye banaayi gayi**, is course ke liye banaayi gayi ek kaalpanik technique nahi.',
      },
      {
        en: '**Large data tables, chat histories, and infinite-scroll feeds displaying thousands or more items are the most commonly cited real-world scenarios genuinely requiring virtualization**, since these are precisely the cases where a naive .map() becomes measurably slow.',
        hi: '**Badi data tables, chat histories, aur infinite-scroll feeds jo hazaaron ya zyaada items dikhaate hain sabse aam taur par cite ki jaane waali asli-duniya scenarios hain jinhe sach mein virtualization chahiye**, kyunki ye bilkul wo cases hain jahan ek saadha \`.map()\` naapa-jaane-laayak dheema ban jaata hai.',
      },
      {
        en: '**Virtualization\'s accessibility and find-in-page trade-offs are explicitly documented, well-known limitations these libraries themselves acknowledge**, not an edge case this course is the first to point out.',
        hi: '**Virtualization ke accessibility aur find-in-page trade-offs explicitly documented, achhi tarah jaani-jaati limitations hain jinhe ye libraries khud maanti hain**, ek edge case nahi jise ye course sabse pehle bata raha hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does rendering a huge array directly with .map() become slow specifically as a browser performance problem, rather than a React performance problem, and why doesn\'t React.memo fix it?',
        qHi: 'Ek vishaal array ko seedhe \`.map()\` se render karna khaas taur par ek browser performance samasya kyun ban jaata hai, ek React performance samasya ke bajaye, aur \`React.memo\` ise kyun theek nahi karta?',
        a: 'React itself, meaning the work of calling a component function and producing the lightweight JavaScript objects that describe what should appear on screen, is genuinely fast even for tens of thousands of items — generating fifty thousand of these description objects takes on the order of milliseconds, not seconds. The actual slowness a user experiences comes from an entirely separate, later stage: once React has decided what elements should exist, the browser itself must take each one and turn it into a real, concrete DOM node, compute that node\'s exact position and size relative to every other node on the page (layout, sometimes called reflow), and then actually draw pixels for it (paint). This work is fundamentally a browser-level cost, not a React-level one, and its total size scales directly with how many real DOM nodes actually exist in the document at once, completely independent of how many elements React itself generated to describe them or how efficiently it generated them. Rendering fifty thousand items directly via .map() means fifty thousand real DOM nodes get created, laid out, and painted, even though a typical viewport can only physically display a small fraction of them — the vast majority of that work produces nodes that sit off-screen, invisible, contributing nothing a user can currently see, yet still costing the browser real time and memory to create and maintain. React.memo, and useMemo alongside it, address a genuinely different problem: they control whether a component\'s own render function needs to re-run and produce new element descriptions when a re-render is triggered, letting React skip redoing work for a component whose relevant inputs have not changed. Neither one has any bearing on how many DOM nodes actually exist in the document at any given moment — a memoized component describing fifty thousand rows still, on its very first render, causes the browser to create fifty thousand real nodes, since memo\'s optimization only ever applies to preventing unnecessary RE-renders, not to reducing how much gets rendered in the first place. Since the actual cost lives in DOM node count, only a technique that genuinely reduces how many DOM nodes exist at once, such as virtualization, which renders solely the small subset of rows currently within the visible viewport, can meaningfully address it.',
        aHi: 'React khud, matlab ek component function bulaane aur wo halke JavaScript objects banaane ka kaam jo darsaate hain ki screen par kya dikhna chahiye, sach mein tez hai das hazaaron items ke liye bhi — pachaas hazaar in description objects ko banaana milliseconds ke order mein lagta hai, seconds nahi. Asli dheemapan jo ek user mehsoos karta hai bilkul ek alag, baad ke stage se aata hai: ek baar React ne tay kar liya ki kaunse elements maujood hone chahiye, browser khud har ek ko lena chahiye aur ise ek asli, thos DOM node mein badalna chahiye, us node ki bilkul position aur size doosre har node ke saapeksh page par ganna chahiye (layout, kabhi-kabhi reflow kaha jaata hai), aur phir asal mein iske liye pixels kheenchna chahiye (paint). Ye kaam buniyaadi roop se ek browser-star ki keemat hai, React-star ki nahi, aur iska total size seedhe is baat se scale karta hai ki document mein ek waqt mein asal mein kitne asli DOM nodes maujood hain, poori tarah is baat se azaad ki React ne khud unhe describe karne ke liye kitne elements banaaye ya kitni kushalta se banaaye. Pachaas hazaar items ko seedhe \`.map()\` se render karna matlab pachaas hazaar asli DOM nodes banaaye, layout kiye, aur paint kiye jaate hain, chahe ek aam viewport bhautik roop se unka sirf ek chhota hissa hi dikha sake — us kaam ka adhikaansh hissa aise nodes banaata hai jo off-screen baithte hain, adrishya, kuch bhi contribute na karte hue jo ek user abhi dekh sakta hai, phir bhi browser ko unhe banaane aur banaaye rakhne mein asli samay aur memory kharch karwaate hue. \`React.memo\`, aur uske saath \`useMemo\`, ek sach mein alag samasya sambodhit karte hain: wo niyantrit karte hain ki ek component ka apna render function ko dobara chalne aur naye element descriptions banaane ki zaroorat hai ya nahi jab ek re-render trigger hota hai, React ko ek aise component ke liye kaam dobara karna chhodne dete hue jiske mutaalliq inputs badle nahi hain. In mein se kisi ka bhi is baat par koi asar nahi hai ki kisi bhi diye gaye pal document mein asal mein kitne DOM nodes maujood hain — ek memoized component jo pachaas hazaar rows describe karta hai phir bhi, apne bilkul pehle render par, browser ko pachaas hazaar asli nodes banaane ka kaaran banaata hai, kyunki memo ka optimization sirf zaroorat-se-zyaada RE-renders rokne mein lagu hota hai, ye kam karne mein nahi ki shuru mein kitna render hota hai. Kyunki asli keemat DOM node count mein rehti hai, sirf ek technique jo sach mein kam karti hai ki ek waqt mein kitne DOM nodes maujood hain, jaisa virtualization, jo sirf abhi visible viewport ke andar rows ka chhota subset render karta hai, ise maayne-yogya roop se sambodhit kar sakta hai.',
      },
      {
        q: 'How does react-window keep the browser\'s scrollbar accurately reflecting a list\'s true total size when only a small fraction of its rows actually exist in the DOM at any moment?',
        qHi: '\`react-window\` browser ke scrollbar ko ek list ke sachche total size ko sahi tarike se darsaate hue kaise rakhta hai jab iski rows ka sirf ek chhota hissa hi kisi bhi pal DOM mein asal mein maujood hota hai?',
        a: 'A browser computes a scrollable element\'s scrollbar thumb size and the total distance it is possible to scroll based on the actual measured height of that element\'s own content relative to its own visible viewport height — if the content genuinely measures 2,000,000 pixels tall while the viewport showing it is 500 pixels tall, the browser correctly renders a small scrollbar thumb reflecting that the visible area represents only a tiny fraction of the total scrollable content. react-window exploits this directly: rather than only rendering the dozen or so currently-visible row elements with nothing else present, it wraps them inside an inner container element deliberately given an explicit height equal to itemCount multiplied by itemSize — the height the full, entirely-populated list would have measured had every single row genuinely been rendered into the DOM at once. Because the browser calculates scrollbar behavior purely from this container\'s own measured height, it has no way to distinguish this deliberately-sized empty-except-for-a-dozen-children container from a container that is genuinely, fully packed with fifty thousand real rows — from the scrollbar\'s perspective the two are indistinguishable, since scrollbar sizing depends only on the container\'s own height, not on how many or how few actual child elements happen to be sitting inside it. The dozen or so rows that genuinely do exist inside that tall container at any given moment are each positioned with an absolute top offset calculated directly from their own index multiplied by itemSize, placing each one at precisely the vertical position it would have occupied had the entire list actually been rendered — so as the user scrolls and react-window swaps which specific rows are currently mounted, each newly-appearing row is placed at exactly the position visual continuity requires, producing what looks, to the user, like one seamless, fully-populated list, while the actual DOM underneath never holds more than a small, roughly constant number of real elements regardless of how large the underlying dataset actually is.',
        aHi: 'Ek browser ek scrollable element ke scrollbar thumb size aur us poori doori ko ganta hai jitni scroll karna mumkin hai us element ki apni content ki asli naapi gayi height ke aadhaar par uski apni visible viewport height ke saapeksh — agar content sach mein 2,000,000 pixels lambi naapi jaati hai jabki ise dikhaane waali viewport 500 pixels lambi hai, browser sahi tarike se ek chhota scrollbar thumb render karta hai ye darsaate hue ki visible area total scrollable content ka sirf ek chhota hissa darsaata hai. \`react-window\` ise seedhe istemal karta hai: sirf abhi-visible dozen ke aas-paas row elements ko kuch aur maujood na hote hue render karne ke bajaye, ye unhe ek inner container element ke andar wrap karta hai jise jaan-boojhkar ek explicit height di gayi hai \`itemCount\` ko \`itemSize\` se guna karke barabar — wo height jo poori, poori tarah bhari hui list naapti agar har ek row sach mein DOM mein ek saath render hui hoti. Kyunki browser scrollbar vyavahaar ko sirf is container ki apni naapi gayi height se ganta hai, iske paas is jaan-boojhkar-size-ki-gayi khaali-siwaay-ek-dozen-bachon-ke container ko ek container se alag karne ka koi tarika nahi hai jo sach mein, poori tarah pachaas hazaar asli rows se bhara hua hai — scrollbar ke nazariye se dono alag-pehchaanne-yogya nahi hain, kyunki scrollbar sizing sirf container ki apni height par nirbhar karti hai, ye nahi ki iske andar kitne ya kitne kam asli child elements samyog se baithe hain. Wo dozen ke aas-paas rows jo sach mein us lambi container ke andar kisi bhi diye gaye pal maujood hoti hain unmein se har ek ko ek absolute \`top\` offset ke saath position kiya jaata hai jo seedhe uske apne index ko \`itemSize\` se guna karke gani jaati hai, har ek ko bilkul us vertical position par rakhte hue jo ye kabza karti agar poori list asal mein render hui hoti — isliye jaise user scroll karta hai aur \`react-window\` badalta hai ki kaunsi khaas rows abhi mounted hain, har nayi-dikhne-waali row bilkul us position par rakhi jaati hai jo visual continuity maangti hai, user ko ek seamless, poori tarah bhari list jaisa dikhaate hue, jabki niche ki asli DOM kabhi ek chhoti, lagbhag sthir tadaad se zyaada asli elements nahi rakhti chahe underlying dataset asal mein kitna bhi bada ho.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken example: a list rendering 20,000 items directly via .map() inside a fixed-height, scrollable container. Open browser devtools and count how many actual DOM nodes exist for the list.',
        taskHi: 'Toota example banao: ek list jo 20,000 items ko seedhe \`.map()\` se ek fixed-height, scrollable container ke andar render karti hai. Browser devtools kholo aur gino ki list ke liye kitne asli DOM nodes maujood hain.',
        hint: 'Use the browser\'s Elements panel and search or count the row elements directly, comparing that number to how many rows are actually visible in the viewport at once.',
        hintHi: 'Browser ke Elements panel ka istemal karo aur row elements ko seedhe khoja ya gino, us tadaad ki tulna karo ki ek waqt mein viewport mein asal mein kitni rows visible hain.',
      },
      {
        task: 'Replace the broken list with FixedSizeList from react-window, following this lesson\'s example. Re-check the DOM node count in devtools and confirm it stays roughly constant regardless of the underlying array\'s size.',
        taskHi: 'Toote list ko \`react-window\` ke \`FixedSizeList\` se badlo, is lesson ke example ka palan karte hue. Devtools mein DOM node count dobara check karo aur confirm karo ki ye lagbhag sthir rehta hai underlying array ke size ke bhale hi kuch ho.',
        hint: 'Try the same component with an itemCount of 100 and then 100,000, and confirm the DOM node count barely changes between the two.',
        hintHi: '\`itemCount\` ko 100 aur phir 100,000 ke saath wahi component try karo, aur confirm karo ki dono ke beech DOM node count mushkil se badalta hai.',
      },
      {
        task: 'Deliberately try to use the browser\'s native Ctrl-F to find text that exists only in a row currently scrolled far out of view in the virtualized list. Explain in a sentence why it cannot be found, and what that implies about when virtualization is and is not an appropriate trade-off.',
        taskHi: 'Jaan-boojhkar browser ke native Ctrl-F ka istemal karo virtualized list mein us text ko dhoondhne ke liye jo sirf ek aisi row mein maujood hai jo abhi drishya se kaafi door scroll ho chuki hai. Ek vaakya mein samjhaao ki ye kyun nahi mil sakta, aur iska kya matlab hai ye tay karne mein ki virtualization kab upyukt trade-off hai aur kab nahi.',
        hint: 'Check the Elements panel while that row is scrolled out of view to confirm its DOM node genuinely does not exist right now, rather than merely being hidden with CSS.',
        hintHi: 'Elements panel check karo jabki wo row drishya se bahar scroll hai ye confirm karne ke liye ki iska DOM node sach mein abhi maujood nahi hai, sirf CSS se chhupaaya nahi gaya hai.',
      },
    ],

    keyTakeaways: [
      'Rendering a huge array directly with .map() creates one real DOM node per item, and the browser\'s own layout and paint cost scales with that node count, regardless of how many rows are actually visible at once.',
      'React.memo and useMemo control whether a component\'s render function re-runs, not how many DOM nodes the browser must create — they do not address the cost that makes long, unvirtualized lists slow.',
      'react-window\'s FixedSizeList renders only the rows currently within (or just outside) the visible viewport, keeping DOM node count roughly constant regardless of the underlying array\'s total size.',
      'A tall inner container, sized to itemCount times itemSize, gives the browser something to measure for scrollbar sizing, even though only a small fraction of that space actually contains real rendered rows.',
      'Each currently-rendered row is absolutely positioned using a top offset computed from its own index, placing it exactly where it would sit if the entire list had genuinely been rendered at once.',
      'Virtualization has real costs of its own — broken browser find-in-page, more careful accessibility handling, and more complex variable-height logic — and is worth paying only once a list\'s size reaches the thousands.',
    ],
    keyTakeawaysHi: [
      'Ek vishaal array ko \`.map()\` se seedhe render karna prati-item ek asli DOM node banaata hai, aur browser ki apni layout aur paint keemat us node count ke saath scale karti hai, chahe ek waqt mein asal mein kitni bhi rows visible hon.',
      '\`React.memo\` aur \`useMemo\` niyantrit karte hain ki ek component ka render function dobara chalta hai ya nahi, ye nahi ki browser ko kitne DOM nodes banaane padte hain — wo us keemat ko sambodhit nahi karte jo lambi, na-virtualized lists ko dheema banaati hai.',
      '\`react-window\` ka \`FixedSizeList\` sirf un rows ko render karta hai jo abhi visible viewport ke andar hain (ya bas bahar), DOM node count ko lagbhag sthir rakhte hue chahe underlying array ka total size kuch bhi ho.',
      'Ek lambi inner container, \`itemCount\` guna \`itemSize\` ke barabar size ki gayi, browser ko scrollbar sizing ke liye naapne ke liye kuch deti hai, chahe us jagah ka sirf ek chhota hissa hi asal mein asli rendered rows rakhta ho.',
      'Har abhi-rendered row ko ek \`top\` offset istemal karke absolutely position kiya jaata hai jo uske apne index se gana jaata hai, use bilkul wahaan rakhte hue jahan ye baithti agar poori list sach mein ek saath render hui hoti.',
      'Virtualization ki apni asli keemat hai — toota hua browser find-in-page, zyaada savdhaan accessibility handling, aur zyaada jatil variable-height logic — aur ye chukaane laayak sirf tab hai jab ek list ka size hazaaron tak pahunche.',
    ],
  },
];
