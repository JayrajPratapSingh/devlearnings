/**
 * React Complete Course — Module 6: Pro, lesson 2.
 *
 * Performance optimization: React.memo and code splitting via React.lazy +
 * Suspense. The first broken example is a large product list where typing
 * in an unrelated search box re-renders every single row on every keystroke,
 * fixed with React.memo. The second is an entire admin panel bundled into
 * the main JS bundle even though most users never visit it, fixed with
 * route-based lazy loading (tying directly into the previous lesson's
 * React Router routes).
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

export const REACT_MODULE_6_PART2: CourseLesson[] = [
  {
    slug: 'performance-react-memo-code-splitting',
    title: 'Performance: React.memo and Code Splitting',
    titleHi: 'Performance: React.memo Aur Code Splitting',
    description: 'Typing a single letter into a search box re-renders two thousand product rows that have nothing to do with search.',
    descriptionHi: 'Search box mein ek akshar type karna do hazaar product rows ko dobara render karta hai jinka search se koi lena-dena nahi.',
    difficulty: 'HARD',
    duration: 27,
    order: 2,

    analogy: {
      en: '**Reprinting an entire two-thousand-page book because one word changed on the cover, versus reprinting only the cover.** A component tree where every child re-renders whenever its parent does, regardless of whether that specific child\'s own props actually changed, is like a print shop that reprints an entire two-thousand-page book from scratch every time a single word on its cover is updated — the vast majority of pages are byte-for-byte identical to the previous printing, yet the shop redoes every single one anyway, purely because "the book" as a whole was told to update. `React.memo` is the print shop learning to check each page individually first — "did THIS specific page\'s content actually change since last time?" — and reprinting only the ones that genuinely did, which for a cover-only update means reprinting exactly one page out of two thousand instead of the entire book.',
      hi: '**Poori do-hazaar-panno wali kitaab dobara print karna kyunki cover par ek shabd badla, versus sirf cover dobara print karna.** Ek component tree jahan har child dobara render hota hai jab bhi uska parent hota hai, chahe us khaas child ki apni props asal mein badli ho ya na ho, aisa hai jaise ek print shop poori do-hazaar-panno wali kitaab shuru se dobara print kare har baar jab cover par ek akela shabd update ho — zyadatar panne pichli chhapaayi se byte-for-byte identical hain, phir bhi shop har ek ko dobara karta hai, sirf isliye kyunki "kitaab" ko poori tarah update hone ko kaha gaya. \`React.memo\` us print shop ka pehle har panne ko alag-alag check karna seekhna hai — "kya IS khaas panne ka content pichli baar se asal mein badla?" — aur sirf unhi ko dobara chhapna jo sach mein badle, jo sirf-cover wale update ke liye do hazaar mein se bilkul ek panna dobara chhapne ka matlab hai, poori kitaab ke bajaye.',
    },

    simple: `**Start broken.** A search box next to a large, unrelated product list:

\`\`\`jsx
function ProductRow({ product }) {
  console.log("Rendering:", product.name);
  return <li>{product.name} — \${product.price}</li>;
}

function ProductList({ products }) {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search anything..." />
      <ul>
        {products.map((p) => <ProductRow key={p.id} product={p} />)}
      </ul>
    </div>
  );
}
\`\`\`

With two thousand products, typing a single character into the search box — which does not even filter this list, it is a completely unrelated search field — logs "Rendering: ..." two thousand times in the console, once per keystroke. \`query\` changing causes \`ProductList\` to re-render, and by default, a re-rendering parent re-renders EVERY child in its returned JSX, regardless of whether that specific child\'s own props changed at all — each \`ProductRow\` receives the exact same \`product\` object it had before, but React still calls the \`ProductRow\` function again for every single one of the two thousand rows, on every keystroke, because nothing has told it that skipping most of them would be safe.

**The fix: \`React.memo\` skips re-rendering when props are unchanged**

\`\`\`jsx
const ProductRow = React.memo(function ProductRow({ product }) {
  console.log("Rendering:", product.name);
  return <li>{product.name} — \${product.price}</li>;
});

function ProductList({ products }) {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search anything..." />
      <ul>
        {products.map((p) => <ProductRow key={p.id} product={p} />)}
      </ul>
    </div>
  );
}
\`\`\`

\`\`\`tsx
interface Product {
  id: string;
  name: string;
  price: number;
}

const ProductRow = React.memo(function ProductRow({ product }: { product: Product }) {
  console.log("Rendering:", product.name);
  return <li>{product.name} — \${product.price}</li>;
});

function ProductList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState<string>("");

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search anything..." />
      <ul>
        {products.map((p) => <ProductRow key={p.id} product={p} />)}
      </ul>
    </div>
  );
}
\`\`\`

\`React.memo(Component)\` wraps a component so React compares its new props against its previous props — using the same reference-equality check covered in the \`useState\` lesson — before deciding whether to actually re-render it. Since \`products\` itself never changes when \`query\` updates, each \`ProductRow\`\'s \`product\` prop is the exact same object reference on every re-render of \`ProductList\`, so \`React.memo\` correctly finds no difference and skips calling \`ProductRow\` entirely — the console now logs "Rendering: ..." exactly zero times per keystroke, because none of the two thousand rows actually need to update.

**Why this specific fix works but would not automatically apply to every list:** if \`products\` itself were reconstructed as a new array on every render (from Module 2\'s immutable-update lessons, a legitimately new array reference even with identical contents), \`React.memo\` would find every \`product\` prop "changed" in the reference-equality sense and re-render everything anyway — this fix specifically relies on \`products\` staying a stable reference across the renders caused by typing in the search box, which is true here since \`query\` and \`products\` are unrelated pieces of state.`,

    simpleHi: `**Toote hue se shuru.** Ek search box ek badi, na-judi product list ke bagal mein:

\`\`\`jsx
function ProductRow({ product }) {
  console.log("Rendering:", product.name);
  return <li>{product.name} — \${product.price}</li>;
}

function ProductList({ products }) {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search anything..." />
      <ul>
        {products.map((p) => <ProductRow key={p.id} product={p} />)}
      </ul>
    </div>
  );
}
\`\`\`

Do hazaar products ke saath, search box mein ek akshar type karna — jo is list ko filter bhi nahi karta, ye poori tarah na-juda search field hai — console mein "Rendering: ..." do hazaar baar log karta hai, har keystroke par ek baar. \`query\` badalna \`ProductList\` ko dobara render karaata hai, aur default roop se, dobara render hota hua parent apne return kiye JSX mein HAR child ko dobara render karta hai, chahe us khaas child ki apni props bilkul badli ho ya na ho — har \`ProductRow\` ko bilkul wahi \`product\` object milta hai jo pehle tha, par React phir bhi do hazaar rows mein se har ek ke liye \`ProductRow\` function ko dobara bulaata hai, har keystroke par, kyunki kisi ne use nahi bataya ki zyadatar ko skip karna surakshit hai.

**Fix: props na-badalne par \`React.memo\` re-render skip karta hai**

\`\`\`jsx
const ProductRow = React.memo(function ProductRow({ product }) {
  console.log("Rendering:", product.name);
  return <li>{product.name} — \${product.price}</li>;
});

function ProductList({ products }) {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search anything..." />
      <ul>
        {products.map((p) => <ProductRow key={p.id} product={p} />)}
      </ul>
    </div>
  );
}
\`\`\`

\`\`\`tsx
interface Product {
  id: string;
  name: string;
  price: number;
}

const ProductRow = React.memo(function ProductRow({ product }: { product: Product }) {
  console.log("Rendering:", product.name);
  return <li>{product.name} — \${product.price}</li>;
});

function ProductList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState<string>("");

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search anything..." />
      <ul>
        {products.map((p) => <ProductRow key={p.id} product={p} />)}
      </ul>
    </div>
  );
}
\`\`\`

\`React.memo(Component)\` ek component ko lapetta hai taaki React uski nayi props ko pichli props se compare kare — wahi reference-equality check use karte hue jo \`useState\` lesson mein cover hua — ye tay karne se pehle ki use asal mein dobara render kare ya nahi. Chunki \`products\` khud kabhi nahi badalta jab \`query\` update hoti hai, har \`ProductRow\` ka \`product\` prop \`ProductList\` ki har re-render par bilkul wahi object reference hai, isliye \`React.memo\` sahi tarike se koi fark nahi paata aur \`ProductRow\` ko bulaana poori tarah chhod deta hai — console ab har keystroke par bilkul zero baar "Rendering: ..." log karta hai, kyunki do hazaar rows mein se kisi ko bhi asal mein update hone ki zarurat nahi.

**Ye khaas fix kyun kaam karta hai par har list par apne aap lagu nahi hoga:** agar \`products\` khud har render par ek naye array ki tarah dobara banti (Module 2 ke immutable-update lessons se, ek asli naya array reference chahe contents wahi hon), \`React.memo\` har \`product\` prop ko reference-equality mane mein "badla hua" paata aur waise bhi sab kuch dobara render karta — ye fix khaas taur par is baat par nirbhar hai ki \`products\` search box mein type karne se hui renders ke aar-paar ek stable reference rehta hai, jo yahan sach hai kyunki \`query\` aur \`products\` alag-alag state ke na-jude tukde hain.`,

    content: `## \`React.memo\` compares props with the same reference-equality rule as everywhere else

\`\`\`jsx
const ProductRow = React.memo(function ProductRow({ product }) {
  return <li>{product.name}</li>;
});

// If "product" is the SAME object reference as last render, ProductRow is skipped.
// If a new { ...product } object is created every render, ProductRow re-renders every time.
\`\`\`

\`React.memo\` performs a shallow comparison of the new props object against the previous one — each individual prop is checked with \`===\`, the identical reference-equality rule covered in the \`useState\` lesson for state and the \`useMemo\`/\`useCallback\` lesson for memoized values and functions. This is precisely why \`React.memo\` and \`useCallback\` are so often used together (Module 4): a function prop recreated as a new object on every parent render defeats \`React.memo\`\'s comparison exactly the same way it defeated it in that lesson\'s broken example, regardless of whether the underlying behavior of that function actually changed.

## When \`React.memo\` is worth reaching for, and when it is not

\`\`\`jsx
// Worth it: a list with many items, each individually cheap to skip
// re-rendering but expensive in aggregate across thousands of rows
const ProductRow = React.memo(function ProductRow({ product }) { ... });

// Usually NOT worth it: a single, cheap component that re-renders rarely anyway
const PageTitle = React.memo(function PageTitle({ title }) {
  return <h1>{title}</h1>;
});
\`\`\`

The same cost-benefit reasoning from the \`useMemo\`/\`useCallback\` lesson applies directly to \`React.memo\`: it adds its own per-render comparison cost, so wrapping a component that is already cheap to render, or one that rarely receives unchanged props in practice, adds overhead without a corresponding benefit. It earns its cost specifically in cases like this lesson\'s broken example — many sibling components, each individually not free to re-render, where a parent re-renders far more often than any specific child\'s own data actually changes.

## Code splitting: not loading code the user has not asked for yet

\`\`\`jsx
import { lazy, Suspense } from "react";

const AdminPanel = lazy(() => import("./AdminPanel"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<p>Loading admin panel...</p>}>
              <AdminPanel />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

By default, a bundler combines every component in an app into one large JavaScript file, which the browser must download and parse before ANY part of the app can run — including code for pages, like an admin panel, that the overwhelming majority of visitors will never actually open. \`lazy(() => import("./AdminPanel"))\` tells the bundler to split \`AdminPanel\`\'s code into its own separate file, only actually downloaded the first time this specific \`lazy\`-wrapped component is about to render — a user who never visits \`/admin\` never downloads \`AdminPanel\`\'s code at all, shrinking the initial bundle every other page depends on. \`Suspense\`, wrapping any \`lazy\` component, is required specifically to provide a \`fallback\` — what to show during the brief window while that component\'s code is still being downloaded over the network, the same "something is loading" UI concept covered for data fetching in Module 3, applied here to loading CODE rather than data.

## Route-based code splitting, tying directly into the previous lesson

\`\`\`jsx
const Home = lazy(() => import("./pages/Home"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:productId" element={<ProductPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
\`\`\`

Since each \`Route\`\'s \`element\` already corresponds to one distinct "page" a user navigates to, lazily loading each page component is the single most common and highest-impact real-world application of code splitting — a user visiting only \`/\` and \`/products/42\` never downloads \`AdminPanel\`\'s code, and a user who eventually navigates to \`/admin\` downloads it only at that moment, rather than everyone paying the cost of every page\'s code on the very first visit to the site regardless of which pages they will actually use.

## TypeScript: typing \`React.memo\` and \`lazy\` components

\`\`\`tsx
interface ProductRowProps {
  product: Product;
}

const ProductRow = React.memo(function ProductRow({ product }: ProductRowProps) {
  return <li>{product.name}</li>;
});
// ProductRow's type is correctly inferred as a component accepting ProductRowProps —
// React.memo itself is generic, preserving whatever prop types the wrapped component had

const AdminPanel = lazy(() => import("./AdminPanel"));
// AdminPanel's type is inferred from AdminPanel.tsx's default export automatically —
// lazy() requires the imported module to have a "default" export specifically
\`\`\`

\`React.memo\` and \`lazy\` both preserve the type information of whatever component they wrap or load, through TypeScript\'s own type inference, without needing an explicit type argument in the common case — \`React.memo\`\'s generic type parameter is inferred directly from the component function passed to it, and \`lazy\`\'s from the default export of the dynamically-imported module. The one real requirement \`lazy\` imposes is that the imported file must use a \`default\` export (\`export default function AdminPanel() {...}\`) rather than a named export, since \`lazy\` specifically expects to receive a promise resolving to an object with a \`default\` property — a named-export-only component needs re-exporting as a default, or wrapping in an inline object, to work with \`lazy\`.`,

    contentHi: `## \`React.memo\` props ko compare karta hai wahi reference-equality niyam se jo har jagah hai

\`\`\`jsx
const ProductRow = React.memo(function ProductRow({ product }) {
  return <li>{product.name}</li>;
});

// Agar "product" pichli render jaisa hi SAME object reference hai, ProductRow skip hota hai.
// Agar har render mein naya { ...product } object banta hai, ProductRow har baar dobara render hota hai.
\`\`\`

\`React.memo\` nayi props object ko purani se ek shallow comparison se compare karta hai — har akeli prop \`===\` se check hoti hai, wahi identical reference-equality niyam jo \`useState\` lesson mein state ke liye aur \`useMemo\`/\`useCallback\` lesson mein memoized values aur functions ke liye cover hua. Bilkul isi wajah se \`React.memo\` aur \`useCallback\` itni aksar saath use hote hain (Module 4): har parent render par naye object ki tarah dobara banaya function prop \`React.memo\` ke comparison ko bilkul waise hi haraata hai jaise usne us lesson ke toote example mein haraya tha, chahe us function ka underlying behaviour asal mein badla ho ya na ho.

## Kab \`React.memo\` uthaana kaam ka hai, aur kab nahi

\`\`\`jsx
// Kaam ka: kai items wali list, har item ka re-render skip karna alag-alag
// sasta hai par hazaaron rows mein saath milkar mehnga
const ProductRow = React.memo(function ProductRow({ product }) { ... });

// Aam taur par KAAM KA NAHI: ek akela, sasta component jo waise bhi kam dobara render hota hai
const PageTitle = React.memo(function PageTitle({ title }) {
  return <h1>{title}</h1>;
});
\`\`\`

\`useMemo\`/\`useCallback\` lesson wali wahi cost-benefit soch \`React.memo\` par seedha lagu hoti hai: ye apni khud ki per-render comparison keemat jodta hai, isliye aise component ko lapetna jo pehle se render karne mein sasta hai, ya jise amal mein kam hi na-badli props milti hain, bina barabar faayde ke overhead jodta hai. Ye apni keemat khaas taur par is lesson ke toote example jaise cases mein kamaata hai — kai sibling components, har ek ka dobara render karna akele-akele mufat nahi, jahan parent kisi khaas child ki apni data asal mein badalne se kaafi zyada baar dobara render hota hai.

## Code splitting: aisa code load na karna jo user ne abhi maanga hi nahi

\`\`\`jsx
import { lazy, Suspense } from "react";

const AdminPanel = lazy(() => import("./AdminPanel"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<p>Loading admin panel...</p>}>
              <AdminPanel />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

Default roop se, ek bundler app ke har component ko ek badi JavaScript file mein jod deta hai, jise browser ko download aur parse karna padta hai app ka KOI BHI hissa chalne se pehle — code sameet un pages ke liye, jaise admin panel, jinhe zyadatar visitors kabhi kholte hi nahi. \`lazy(() => import("./AdminPanel"))\` bundler ko batata hai \`AdminPanel\` ka code apni alag file mein baanto, sirf tab asal mein download ho jab ye khaas \`lazy\`-wrapped component render hone hi wala ho — jo user \`/admin\` kabhi visit hi nahi karta wo \`AdminPanel\` ka code kabhi download hi nahi karta, shuruaati bundle ko chhota karte hue jispar har doosra page nirbhar hai. \`Suspense\`, kisi bhi \`lazy\` component ko lapetta hua, khaas taur par ek \`fallback\` dene ke liye zaruri hai — us chhote waqt ke dauran kya dikhaana hai jab us component ka code abhi bhi network par download ho raha hai, wahi "kuch load ho raha hai" UI concept jo Module 3 mein data fetching ke liye cover hua, yahan DATA ke bajaye CODE load karne par lagu.

## Route-based code splitting, pichle lesson se seedha judte hue

\`\`\`jsx
const Home = lazy(() => import("./pages/Home"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:productId" element={<ProductPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
\`\`\`

Chunki har \`Route\` ka \`element\` pehle se ek alag "page" ke barabar hai jispar user navigate karta hai, har page component ko lazily load karna code splitting ka sabse aam aur sabse zyada asar wala asli-duniya istemal hai — sirf \`/\` aur \`/products/42\` visit karne wala user \`AdminPanel\` ka code kabhi download nahi karta, aur jo user aakhirkaar \`/admin\` par navigate karta hai wo use sirf us pal download karta hai, sabko site ke pehle visit par har page ke code ki keemat chukaani padne ke bajaye chahe wo asal mein kaunse pages use karenge.

## TypeScript: \`React.memo\` aur \`lazy\` components ko type karna

\`\`\`tsx
interface ProductRowProps {
  product: Product;
}

const ProductRow = React.memo(function ProductRow({ product }: ProductRowProps) {
  return <li>{product.name}</li>;
});
// ProductRow ka type sahi tarike se ek aise component ki tarah infer hota hai jo ProductRowProps accept karta hai —
// React.memo khud generic hai, lapete hue component ke jo bhi prop types the unhe rakhte hue

const AdminPanel = lazy(() => import("./AdminPanel"));
// AdminPanel ka type AdminPanel.tsx ke default export se apne aap infer hota hai —
// lazy() ko chahiye import kiya module khaas taur par ek "default" export rakhe
\`\`\`

\`React.memo\` aur \`lazy\` dono jo bhi component wo lapette ya load karte hain uski type information ko TypeScript ke apne type inference se rakhte hain, aam case mein explicit type argument ki zarurat bina — \`React.memo\` ka generic type parameter seedha use pass hue component function se infer hota hai, aur \`lazy\` ka dynamically-imported module ke default export se. \`lazy\` ki ek asli zarurat ye hai ki imported file \`default\` export use kare (\`export default function AdminPanel() {...}\`) named export ke bajaye, kyunki \`lazy\` khaas taur par ek promise pane ki ummeed karta hai jo ek \`default\` property wale object mein resolve ho — sirf-named-export wale component ko default ki tarah dobara export karna, ya ek inline object mein lapetna padta hai, \`lazy\` ke saath kaam karne ke liye.`,

    examples: [
      {
        title: 'Broken: every row re-renders on every unrelated keystroke',
        titleHi: 'Toota: har row har na-judi keystroke par dobara render hota hai',
        code: `function ProductRow({ product }) {
  console.log("Rendering:", product.name);
  return <li>{product.name}</li>;
}
function ProductList({ products }) {
  const [query, setQuery] = useState("");
  return <div>
    <input value={query} onChange={(e) => setQuery(e.target.value)} />
    <ul>{products.map((p) => <ProductRow key={p.id} product={p} />)}</ul>
  </div>;
}`,
        codeJs: `function ProductRow({ product }) {
  console.log("Rendering:", product.name);
  return <li>{product.name} — \${product.price}</li>;
}

function ProductList({ products }) {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search anything..." />
      <ul>
        {products.map((p) => <ProductRow key={p.id} product={p} />)}
      </ul>
    </div>
  );
}
// With 2,000 products, typing one character logs "Rendering: ..." 2,000 times.`,
        codeTs: `interface Product {
  id: string;
  name: string;
  price: number;
}

function ProductRow({ product }: { product: Product }) {
  console.log("Rendering:", product.name);
  return <li>{product.name} — \${product.price}</li>;
}

function ProductList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState<string>("");

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search anything..." />
      <ul>
        {products.map((p) => <ProductRow key={p.id} product={p} />)}
      </ul>
    </div>
  );
}
// TypeScript does not catch this — every prop and every call is
// correctly typed. This is a performance concern, not a type error.`,
        output: `Typing "hello" into the search box logs "Rendering: ..." 2,000 times
per keystroke — 10,000 total console logs for a five-character word —
for a list that isn't even filtered by this search box.`,
        explain: 'Every single one of those 2,000 re-renders produces the exact same output as before, since "product" never actually changed — every one of them is genuinely wasted work.',
        explainHi: 'Un 2,000 re-renders mein se har ek bilkul wahi output deta hai jo pehle tha, kyunki \`product\` asal mein kabhi badla hi nahi — har ek sach mein bekaar kaam hai.',
      },
      {
        title: 'Fixed: React.memo skips re-rendering rows with unchanged props',
        titleHi: 'Theek: React.memo na-badli props wali rows ko re-render skip karta hai',
        code: `const ProductRow = React.memo(function ProductRow({ product }) {
  console.log("Rendering:", product.name);
  return <li>{product.name}</li>;
});`,
        codeJs: `const ProductRow = React.memo(function ProductRow({ product }) {
  console.log("Rendering:", product.name);
  return <li>{product.name} — \${product.price}</li>;
});

function ProductList({ products }) {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search anything..." />
      <ul>
        {products.map((p) => <ProductRow key={p.id} product={p} />)}
      </ul>
    </div>
  );
}`,
        codeTs: `interface Product {
  id: string;
  name: string;
  price: number;
}

const ProductRow = React.memo(function ProductRow({ product }: { product: Product }) {
  console.log("Rendering:", product.name);
  return <li>{product.name} — \${product.price}</li>;
});

function ProductList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState<string>("");

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search anything..." />
      <ul>
        {products.map((p) => <ProductRow key={p.id} product={p} />)}
      </ul>
    </div>
  );
}`,
        outputJs: `Typing "hello" into the search box logs "Rendering: ..." ZERO times —
each ProductRow's "product" prop is the same object reference on every
render of ProductList, so React.memo correctly skips all 2,000 rows.`,
        outputTs: `// Identical behaviour. TypeScript infers ProductRow's props type
// directly from the function passed to React.memo — no explicit
// generic type argument was needed here.`,
        explain: 'The only change from the broken version is wrapping ProductRow in React.memo — the component\'s own code, and everything about ProductList, is completely unchanged.',
        explainHi: 'Toote version se sirf ek badlaav hai — \`ProductRow\` ko \`React.memo\` mein lapetna — component ka apna code, aur \`ProductList\` ke baare mein sab kuch, bilkul na-badla hua hai.',
      },
      {
        title: 'Route-based code splitting with lazy and Suspense',
        titleHi: 'lazy aur Suspense se route-based code splitting',
        code: `const AdminPanel = lazy(() => import("./pages/AdminPanel"));
<Suspense fallback={<p>Loading...</p>}>
  <Route path="/admin" element={<AdminPanel />} />
</Suspense>`,
        codeJs: `import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}`,
        codeTs: `import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}`,
        outputJs: `Opening the browser Network tab: visiting "/" downloads Home's code
but NOT AdminPanel's — a separate, smaller JS file for AdminPanel only
downloads the moment a user actually navigates to "/admin".`,
        outputTs: `// Identical behaviour. Both Home and AdminPanel's component types are
// inferred automatically from their respective files' default
// exports — lazy() requires each to use "export default", not a
// named export.`,
        explain: 'This directly extends the previous lesson\'s route configuration — the only change is wrapping each page component in lazy(() => import(...)) and adding one shared Suspense boundary around the Routes.',
        explainHi: 'Ye pichle lesson ke route configuration ko seedha aage badhaata hai — sirf badlaav har page component ko \`lazy(() => import(...))\` mein lapetna aur \`Routes\` ke aas-paas ek shared \`Suspense\` boundary jodna hai.',
      },
    ],

    mistakes: [
      {
        wrong: `function ProductRow({ product }) { return <li>{product.name}</li>; }
// re-renders on every parent render, even when "product" is identical`,
        right: `const ProductRow = React.memo(function ProductRow({ product }) {
  return <li>{product.name}</li>;
});`,
        why: 'Without React.memo, a component re-renders whenever its parent does, regardless of whether its own props actually changed — for a component rendered many times in a list, this wastes work on every unrelated parent state change.',
        whyHi: 'React.memo ke bina, ek component apne parent ke re-render hote hi dobara render hota hai, chahe uski apni props asal mein badli ho ya na ho — ek list mein kai baar render hue component ke liye, ye har na-jude parent state change par kaam bekaar karta hai.',
      },
      {
        wrong: `const ProductRow = React.memo(function ProductRow({ product, onSelect }) { ... });
<ProductRow product={p} onSelect={() => handleSelect(p.id)} />
// a new inline function every render defeats React.memo, same as the useMemo lesson`,
        right: `const handleSelect = useCallback((id) => { ... }, []);
<ProductRow product={p} onSelect={handleSelect} />`,
        why: 'React.memo compares every prop with the same reference-equality rule as everywhere else — an inline function recreated on every render is never === to the previous render\'s function, so it defeats the memoization exactly like Module 4\'s React.memo/useCallback example.',
        whyHi: 'React.memo har prop ko wahi reference-equality niyam se compare karta hai jo har jagah hai — har render par dobara banaya inline function kabhi pichli render ke function se \`===\` nahi hota, isliye ye memoization ko bilkul waise hi haraata hai jaise Module 4 ke React.memo/useCallback example mein hua.',
      },
      {
        wrong: `import AdminPanel from "./pages/AdminPanel";
// bundled into the main JS file, downloaded by every visitor
// regardless of whether they ever visit /admin`,
        right: `const AdminPanel = lazy(() => import("./pages/AdminPanel"));
// wrapped in Suspense, downloaded only when a user navigates to /admin`,
        why: 'A regular static import bundles a component\'s code into the main JavaScript file every visitor downloads on their very first request, regardless of whether that specific page is ever actually visited — lazy() defers downloading that code until it is genuinely needed.',
        whyHi: 'Ek aam static import kisi component ka code us mukhya JavaScript file mein jod deta hai jo har visitor apni bilkul pehli request par download karta hai, chahe wo khaas page kabhi asal mein visit ho ya na ho — \`lazy()\` us code ko download karna taalta hai jab tak sach mein zarurat na ho.',
      },
    ],

    realWorld: [
      {
        en: '**React DevTools\' Profiler tab is the standard tool for identifying exactly which components are re-rendering unnecessarily** — it highlights every component that rendered during a given interaction, letting a developer directly confirm whether `React.memo` (or `useMemo`/`useCallback`) would actually help before adding it, rather than guessing.',
        hi: '**React DevTools ka Profiler tab bilkul ye pehchaanne ka standard tool hai ki kaunse components bina zarurat dobara render ho rahe hain** — ye har us component ko highlight karta hai jo ek diye gaye interaction ke dauran render hua, developer ko seedha confirm karne dete hue ki \`React.memo\` (ya \`useMemo\`/\`useCallback\`) asal mein madad karega ya nahi use jodne se pehle, andaaza lagaane ke bajaye.',
      },
      {
        en: '**Large production apps routinely measure initial bundle size as a key performance metric**, and route-based code splitting via `lazy`/`Suspense` is consistently one of the highest-impact, most commonly applied techniques for reducing it — a large admin panel, chart library, or rich-text editor bundled unconditionally can add hundreds of kilobytes every visitor pays for, whether they use that feature or not.',
        hi: '**Badi production apps roaayti roop se shuruaati bundle size ko ek mukhya performance metric ki tarah naapti hain**, aur \`lazy\`/\`Suspense\` se route-based code splitting use kam karne ki lagataar sabse zyada asar wali, sabse aam lagu ki jaane wali techniques mein se ek hai — bina shart bundled ek bada admin panel, chart library, ya rich-text editor sau kilobytes joda sakta hai jo har visitor chukaata hai, chahe wo us feature ko use kare ya na kare.',
      },
      {
        en: '**Virtualized list libraries (react-window, react-virtual, TanStack Virtual) tackle the same "huge list is slow" problem this lesson opened with, but through a different technique** — rendering only the rows currently visible in the viewport rather than all two thousand at once — which is the standard next step when React.memo alone is not enough for extremely large lists.',
        hi: '**Virtualized list libraries (react-window, react-virtual, TanStack Virtual) is lesson ke shuru wali "badi list dheemi hai" samasya ko sambhaalti hain, par ek alag technique se** — sirf abhi viewport mein dikhti rows render karte hue, ek saath saari do hazaar ke bajaye — jo agla standard kadam hai jab akela \`React.memo\` bahut badi lists ke liye kaafi nahi hota.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a component re-render whenever its parent does, even when that specific component\'s own props have not actually changed?',
        qHi: 'Ek component apne parent ke re-render hote hi dobara render kyun hota hai, chahe us khaas component ki apni props asal mein na badli ho?',
        a: 'React\'s default behavior is that a re-rendering parent re-renders every child in its returned JSX tree unconditionally — this is the simplest possible rule to implement and reason about, and for most components (which are cheap to render), the cost of this unconditional re-rendering is negligible enough not to matter in practice. React does not, by default, compare a child\'s new props against its previous props to decide whether re-rendering is actually necessary; doing so would itself add a comparison cost to every single component render, which would be net negative for the overwhelming majority of components that are already fast to render and rarely receive identical props anyway. `React.memo` exists as an explicit, opt-in exception to this default — wrapping a specific component tells React to perform that comparison specifically for this one component, worthwhile only when the component is rendered often enough with unchanged props, and expensive enough to render, that the comparison cost is worth paying.',
        aHi: 'React ka default behaviour ye hai ki dobara render hota parent apne return kiye JSX tree ka har child bina shart dobara render karta hai — ye lagu karne aur soch-samajhne ka sabse saadha mumkin niyam hai, aur zyadatar components ke liye (jo render karne mein saste hain), is bina-shart re-rendering ki keemat itni mamuli hai ki amal mein matter na kare. React default roop se child ki nayi props ko uski purani props se compare nahi karta ye tay karne ke liye ki dobara render karna asal mein zaruri hai ya nahi; aisa karna khud har akeli component render mein ek comparison keemat jodta, jo un zyadatar components ke liye net negative hota jo pehle se render karne mein tez hain aur waise bhi kam hi ekjaisa props paate hain. \`React.memo\` is default ke liye ek explicit, opt-in apvaad ki tarah maujood hai — ek khaas component ko lapetna React ko batata hai sirf is ek component ke liye wo comparison karo, sirf tab kaam ka jab component itni aksar na-badli props ke saath render hota hai, aur render karne mein itna mehnga hai, ki comparison keemat chukaane laayak ho.',
      },
      {
        q: 'Why does React.memo fail to prevent a re-render when a component receives an inline function or a freshly-spread object as a prop, even if that prop\'s actual content is identical each time?',
        qHi: 'Jab ek component ko prop ki tarah inline function ya taazi spread hui object milti hai, React.memo re-render rokne mein kyun fail hota hai, chahe us prop ka asli content har baar identical ho?',
        a: 'React.memo compares props using the same reference-equality (`===`) check used throughout React for detecting change — it checks whether the new prop value is the literal same object or function in memory as the previous render\'s value, not whether the two values are structurally or conceptually equivalent. An inline function (`() => doSomething()`) or a freshly-spread object (`{ ...obj }`) written directly in JSX creates a brand-new object in memory on every single render, regardless of whether its contents are identical to the previous render\'s version — two structurally identical objects or functions are still distinct objects in memory, and therefore never `===` to each other. Because React.memo\'s comparison finds these "different" by that reference check, it concludes the prop genuinely changed and re-renders the wrapped component, exactly as if the value had actually changed in a meaningful way — this is precisely why React.memo is so often paired with useMemo/useCallback for any prop that is itself an object or function.',
        aHi: 'React.memo props ko wahi reference-equality (\`===\`) check use karke compare karta hai jo React mein badlaav pakadne ke liye har jagah use hota hai — ye check karta hai ki naya prop value memory mein pichli render ki value ka bilkul wahi object ya function hai, ye nahi ki dono values structurally ya concept mein barabar hain. JSX mein seedha likha ek inline function (\`() => doSomething()\`) ya taazi spread hui object (\`{ ...obj }\`) har akeli render par memory mein ek bilkul naya object banaata hai, chahe uske contents pichli render ke version se identical ho ya na ho — do structurally identical objects ya functions phir bhi memory mein alag objects hain, aur isliye kabhi ek doosre se \`===\` nahi. Chunki React.memo ka comparison in dono ko us reference check se "alag" paata hai, ye nateeja nikaalta hai ki prop sach mein badla, aur lapete hue component ko dobara render karta hai, bilkul jaise value asal mein kisi matlabi tarike se badli ho — bilkul isi wajah se React.memo itni aksar useMemo/useCallback ke saath jodkar use hota hai kisi bhi aise prop ke liye jo khud ek object ya function hai.',
      },
      {
        q: 'What actual problem does wrapping a route\'s component in `lazy(() => import(...))` solve, compared to a regular static import at the top of the file?',
        qHi: 'File ke upar ek aam static import ke muqable, ek route ke component ko \`lazy(() => import(...))\` mein lapetna asal mein kaunsi samasya hal karta hai?',
        a: 'A regular static import (`import AdminPanel from "./AdminPanel"`) is resolved by the bundler at build time and bundled directly into the same JavaScript file (or a file downloaded together) as the rest of the application — every visitor downloads this code as part of their initial page load, regardless of whether they ever actually navigate to a route that renders `AdminPanel`. `lazy(() => import("./AdminPanel"))` instead tells the bundler to split `AdminPanel`\'s code into its own separate file, which is only requested from the network the first time this specific `lazy`-wrapped component is actually about to render — a visitor who only ever visits pages other than the one rendering `AdminPanel` never downloads that code at all. This directly reduces the size of the initial bundle every visitor must download before the app becomes usable, at the cost of a brief loading state (handled by the required `Suspense` fallback) the first time a visitor does navigate to a page using a lazily-loaded component.',
        aHi: 'Aam static import (\`import AdminPanel from "./AdminPanel"\`) bundler dwara build time par resolve hota hai aur baaki application ke saath usi JavaScript file mein (ya saath download hui file mein) seedha bundle ho jaata hai — har visitor is code ko apne shuruaati page load ke hisse ki tarah download karta hai, chahe wo kabhi asal mein aisi route par navigate kare jo \`AdminPanel\` render karti ho ya na kare. \`lazy(() => import("./AdminPanel"))\` iske bajaye bundler ko batata hai \`AdminPanel\` ka code apni alag file mein baanto, jo network se sirf tab request hoti hai jab ye khaas \`lazy\`-wrapped component asal mein render hone hi wala ho — aisa visitor jo sirf \`AdminPanel\` render karne wale page ke alawa doosre pages hi kabhi visit karta hai wo code kabhi bhi download nahi karta. Ye seedha us shuruaati bundle ka size kam karta hai jo har visitor ko app kaam ka banne se pehle download karna padta hai, us keemat par ki jab visitor pehli baar lazily-loaded component use karne wale page par navigate karta hai to ek chhoti loading state hoti hai (zaruri \`Suspense\` fallback se sambhaali).',
      },
      {
        q: 'Why does using a lazily-loaded component with `lazy(() => import(...))` require wrapping it in `<Suspense>`?',
        qHi: '\`lazy(() => import(...))\` se lazily-load hue component ko use karna \`<Suspense>\` mein lapetna kyun maangta hai?',
        a: 'A `lazy`-wrapped component\'s underlying code, unlike an ordinary component\'s, is not necessarily available immediately — the first time it is about to render, its code file must actually be requested and downloaded over the network, which takes a genuinely non-zero amount of time, even if brief. React needs some way to know what to display during that download window, since it cannot render the actual component before its code has finished arriving — `Suspense`, wrapping the `lazy` component, provides exactly that: a `fallback` prop specifying what to show while the wrapped content is not yet ready, conceptually the same "what to display during a loading state" need covered for data fetching in Module 3, applied here to loading a component\'s code instead of loading data. Omitting the `Suspense` wrapper around a `lazy` component is an error specifically because React has no fallback content to fall back on during that unavoidable download window.',
        aHi: '\`lazy\`-wrapped component ka underlying code, ek aam component ke ulat, zaruri nahi ki turant maujood ho — pehli baar jab wo render hone wala ho, uski code file ko asal mein network se request aur download karna padta hai, jisme sach mein kuch waqt lagta hai, chahe chhota ho. React ko kisi tarah jaanna hota hai us download window ke dauran kya dikhaana hai, kyunki wo asli component ko uska code aane se pehle render nahi kar sakta — \`Suspense\`, \`lazy\` component ko lapetta hua, bilkul yahi deta hai: ek \`fallback\` prop jo batata hai lapete hue content ke abhi taiyaar na hone tak kya dikhaana hai, concept mein wahi "loading state ke dauran kya dikhaana hai" zarurat jo Module 3 mein data fetching ke liye cover hui, yahan data load karne ke bajaye component ka code load karne par lagu. \`lazy\` component ke aas-paas \`Suspense\` wrapper chhodna khaas taur par isliye error hai kyunki React ke paas us anivarya download window ke dauran gir jaane ko koi fallback content hi nahi hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken ProductList with 2,000 mock products and a console.log inside ProductRow. Type into the search box and count how many times the log fires per keystroke.',
        taskHi: '2,000 mock products aur ProductRow ke andar ek console.log wala toota ProductList banao. Search box mein type karo aur ginno har keystroke par log kitni baar chalta hai.',
        hint: 'Use React DevTools\' Profiler tab to record a single keystroke and visually confirm all 2,000 ProductRow instances are highlighted as having rendered.',
        hintHi: 'Ek akeli keystroke record karne ke liye React DevTools ka Profiler tab use karo aur seedha dekhkar confirm karo saare 2,000 ProductRow instances render hue ki tarah highlight hote hain.',
      },
      {
        task: 'Fix it with React.memo and confirm the log count drops to zero per keystroke. Then deliberately pass an inline arrow function as an additional prop and confirm React.memo stops working again.',
        taskHi: 'React.memo se theek karo aur confirm karo log count har keystroke par zero ho jaata hai. Phir jaan-boojhkar ek additional prop ki tarah inline arrow function pass karo aur confirm karo React.memo dobara kaam karna band kar deta hai.',
        hint: 'Fix the reintroduced bug with useCallback and confirm the log count returns to zero, connecting this directly back to Module 4\'s useMemo/useCallback lesson.',
        hintHi: 'Dobara aaye bug ko useCallback se theek karo aur confirm karo log count wapas zero ho jaata hai, ise seedha Module 4 ke useMemo/useCallback lesson se jodte hue.',
      },
      {
        task: 'Build a small app with Home and AdminPanel routes, first with a regular static import for both, then switching AdminPanel to lazy(). Compare the Network tab\'s initial page load in both versions.',
        taskHi: 'Home aur AdminPanel routes wala ek chhota app banao, pehle dono ke liye aam static import ke saath, phir AdminPanel ko lazy() mein switch karke. Dono versions mein Network tab ka shuruaati page load compare karo.',
        hint: 'Look specifically at the total number and size of JS files downloaded on the very first visit to "/" in each version.',
        hintHi: 'Khaas taur par har version mein "/" ke bilkul pehle visit par download hui JS files ki kul sankhya aur size dekho.',
      },
    ],

    keyTakeaways: [
      'By default, a re-rendering parent re-renders every child in its JSX unconditionally, regardless of whether that specific child\'s own props changed — for most components this cost is negligible, but for many similar components rendered repeatedly (a large list), it compounds.',
      '`React.memo(Component)` compares new props against previous props using the same reference-equality (`===`) rule used throughout React, skipping the wrapped component\'s re-render when every prop is unchanged.',
      'An inline function or freshly-spread object passed as a prop is a new reference on every render regardless of its contents, defeating React.memo\'s comparison exactly like it defeats useCallback/useMemo — the same fix (useCallback/useMemo on the parent) applies.',
      'React.memo carries its own comparison cost; it is worth reaching for specifically when a component is rendered many times as siblings and is individually non-trivial to re-render, not as a default habit on every component.',
      '`lazy(() => import(...))` splits a component\'s code into its own file, downloaded only when that component is actually about to render, reducing the size of the initial bundle every visitor pays for regardless of which pages they use.',
      'A `lazy` component must be wrapped in `<Suspense fallback={...}>`, since React needs something to display during the unavoidable network delay while that component\'s code is being downloaded — route-based lazy loading, one `lazy` call per page component, is the most common real-world application.',
    ],
    keyTakeawaysHi: [
      'Default roop se, dobara render hota parent apne JSX ka har child bina shart dobara render karta hai, chahe us khaas child ki apni props badli ho ya na ho — zyadatar components ke liye ye keemat mamuli hai, par kai ekjaisa components jo baar-baar render hote hain (ek badi list) ke liye, ye badhti jaati hai.',
      '\`React.memo(Component)\` nayi props ko purani se wahi reference-equality (\`===\`) niyam se compare karta hai jo poore React mein use hota hai, lapete hue component ka re-render skip karta hai jab har prop na-badli ho.',
      'Prop ki tarah pass hua inline function ya taazi spread hui object har render par ek naya reference hai chahe uska content kuch bhi ho, React.memo ke comparison ko bilkul waise haraata hai jaise ye useCallback/useMemo ko haraata hai — wahi fix (parent par useCallback/useMemo) lagu hota hai.',
      'React.memo apni khud ki comparison keemat rakhta hai; ise khaas taur par uthaana kaam ka hai jab component sibling ki tarah kai baar render hota hai aur akele-akele dobara render karna trivial nahi, har component par default aadat ki tarah nahi.',
      '\`lazy(() => import(...))\` component ke code ko apni alag file mein baantta hai, sirf tab download hota hai jab wo component asal mein render hone hi wala ho, shuruaati bundle ka size kam karte hue jo har visitor chukaata hai chahe wo kaunse pages use kare.',
      'Ek \`lazy\` component ko \`<Suspense fallback={...}>\` mein lapetna zaruri hai, kyunki React ko us anivarya network delay ke dauran kuch dikhaane ko chahiye jab tak us component ka code download ho raha ho — route-based lazy loading, har page component ke liye ek \`lazy\` call, sabse aam asli-duniya istemal hai.',
    ],
  },
];
