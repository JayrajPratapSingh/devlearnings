/**
 * React Complete Course — Module 6: Pro, lesson 1.
 *
 * React Router: client-side navigation, dynamic route params, and
 * programmatic navigation. The broken example uses a plain <a href> for
 * in-app navigation, causing a full page reload that discards all React
 * state (a cart count) — the classic first React Router lesson, since it is
 * the exact mistake every developer coming from server-rendered multi-page
 * sites makes on day one.
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

export const REACT_MODULE_6: CourseLesson[] = [
  {
    slug: 'react-router-client-side-navigation',
    title: 'React Router: Client-Side Navigation and Dynamic Routes',
    titleHi: 'React Router: Client-Side Navigation Aur Dynamic Routes',
    description: 'Clicking a link to a product page — and the cart icon, which showed "3 items" a moment ago, resets to "0".',
    descriptionHi: 'Ek product page ke link par click karna — aur cart icon, jo pal bhar pehle "3 items" dikha raha tha, "0" par reset ho jaata hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**Rebuilding an entire house from scratch to walk into a different room versus simply walking through an interior door.** Navigating with a plain HTML `<a href>` inside a React app is like demolishing the entire house and rebuilding it from the ground up just to move from the living room into the kitchen — the walk achieves its goal (you end up in the kitchen), but everything that existed in the living room a moment ago, and every piece of furniture you had already arranged anywhere in the house, is gone, because the whole structure was torn down and started over. React Router\'s navigation is an interior door instead — moving between "rooms" (routes) swaps out only the specific area behind that door, while the rest of the house (state living outside that specific screen — a cart count, a logged-in session, scroll position on a persistent header) stays standing, completely undisturbed, because nothing about the overall structure was ever demolished.',
      hi: '**Ek doosre kamre mein jaane ke liye poora ghar shuru se dobara banaana versus bas ek andar wale darwaze se guzarna.** React app ke andar saadhe HTML \`<a href>\` se navigate karna aisa hai jaise poora ghar girakar zameen se dobara banaao sirf living room se kitchen mein jaane ke liye — chalna apna maqsad poora karta hai (aap kitchen mein pahunch jaate ho), par jo bhi pal bhar pehle living room mein tha, aur jo bhi furniture aapne ghar mein kahin bhi pehle se jamaaya tha, chala jaata hai, kyunki poori sanrachna todkar dobara shuru ki gayi. React Router ka navigation iske bajaye ek andar wala darwaza hai — "kamron" (routes) ke beech move karna sirf us darwaze ke peeche ka khaas hissa badalta hai, jabki ghar ka baaki hissa (us khaas screen se bahar rehti state — ek cart count, ek logged-in session, ek chalte header par scroll position) khada rehta hai, poori tarah bina chhue, kyunki poori sanrachna kabhi girayi hi nahi gayi.',
    },

    simple: `**Start broken.** A cart icon and a plain link to a product page:

\`\`\`jsx
function Header({ cartCount }) {
  return (
    <header>
      <span>Cart: {cartCount} items</span>
      <a href="/products/42">View Wireless Mouse</a>
    </header>
  );
}
\`\`\`

Add three items to a cart (\`cartCount\` becomes \`3\` in state somewhere near the top of the app), then click "View Wireless Mouse". The product page loads correctly — but the cart icon now shows "Cart: 0 items". A plain HTML \`<a href="...">\` does exactly what \`<a>\` tags have always done since the beginning of the web: it tells the BROWSER to navigate to a new URL, which the browser does by throwing away the entire current page — every script, every variable, all of React itself — and starting completely fresh with a brand-new page load for \`/products/42\`. \`cartCount\`, which lived only in React state (in memory, in the now-discarded page), is gone; the new page loads React from scratch, with state reset back to its initial values, because as far as the browser is concerned, this is a completely unrelated page it has never seen before.

**The fix: React Router\'s \`<Link>\` navigates without a page reload**

\`\`\`jsx
import { Link } from "react-router-dom";

function Header({ cartCount }) {
  return (
    <header>
      <span>Cart: {cartCount} items</span>
      <Link to="/products/42">View Wireless Mouse</Link>
    </header>
  );
}
\`\`\`

\`\`\`tsx
import { Link } from "react-router-dom";

function Header({ cartCount }: { cartCount: number }) {
  return (
    <header>
      <span>Cart: {cartCount} items</span>
      <Link to="/products/42">View Wireless Mouse</Link>
    </header>
  );
}
\`\`\`

\`<Link>\` renders an \`<a>\` tag under the hood (so it still looks and behaves like a link — right-click "open in new tab" still works, for instance), but it intercepts the click with JavaScript before the browser gets a chance to perform its default full-page-navigation behavior. Instead, React Router swaps out only the specific part of the component tree that Route configuration says should change for the new URL — everything else, including the \`Header\` component and the \`cartCount\` state it reads, keeps rendering exactly as it was, entirely undisturbed, because the browser never actually reloaded the page at all. Clicking "View Wireless Mouse" now correctly shows the product page while the cart icon still reads "Cart: 3 items", because nothing about React\'s in-memory state was ever discarded.

**Why this still needs to update the URL bar and support the back button, and \`<Link>\` handles that too:** React Router uses the browser\'s History API behind the scenes to update the visible URL and add an entry to browser history exactly as a real navigation would, so the address bar, bookmarking, and the back/forward buttons all behave correctly — the only thing skipped is the wasteful, state-destroying full page reload a plain \`<a>\` would have triggered.`,

    simpleHi: `**Toote hue se shuru.** Ek cart icon aur ek product page ka saadha link:

\`\`\`jsx
function Header({ cartCount }) {
  return (
    <header>
      <span>Cart: {cartCount} items</span>
      <a href="/products/42">View Wireless Mouse</a>
    </header>
  );
}
\`\`\`

Cart mein teen items jodo (\`cartCount\` app ke upar kahin state mein \`3\` ban jaata hai), phir "View Wireless Mouse" click karo. Product page sahi tarike se load hota hai — par cart icon ab "Cart: 0 items" dikhaata hai. Saadha HTML \`<a href="...">\` bilkul wahi karta hai jo \`<a>\` tags web ki shuruaat se hamesha karte aaye hain: ye BROWSER ko batata hai naye URL par navigate karo, jo browser abhi ke poore page ko fenkkar karta hai — har script, har variable, khud poora React — aur \`/products/42\` ke liye bilkul naye page load ke saath poori tarah taaza shuru karta hai. \`cartCount\`, jo sirf React state mein rehta tha (memory mein, ab chhode gaye page mein), chala gaya; naya page React ko shuru se load karta hai, state apni shuruaati values par reset hui, kyunki browser ke nazariye se, ye ek bilkul na-juda page hai jise usne pehle kabhi nahi dekha.

**Fix: React Router ka \`<Link>\` page reload ke bina navigate karta hai**

\`\`\`jsx
import { Link } from "react-router-dom";

function Header({ cartCount }) {
  return (
    <header>
      <span>Cart: {cartCount} items</span>
      <Link to="/products/42">View Wireless Mouse</Link>
    </header>
  );
}
\`\`\`

\`\`\`tsx
import { Link } from "react-router-dom";

function Header({ cartCount }: { cartCount: number }) {
  return (
    <header>
      <span>Cart: {cartCount} items</span>
      <Link to="/products/42">View Wireless Mouse</Link>
    </header>
  );
}
\`\`\`

\`<Link>\` peeche \`<a>\` tag render karta hai (isliye ye abhi bhi link jaisa dikhta aur behave karta hai — right-click "open in new tab" abhi bhi kaam karta hai, misal ke taur par), par ye click ko JavaScript se rok leta hai us se pehle ki browser ko apna default poora-page-navigation behaviour karne ka mauka mile. Iske bajaye, React Router component tree ke sirf us khaas hisse ko badalta hai jise Route configuration naye URL ke liye badalne ko kehti hai — baaki sab kuch, \`Header\` component aur uske padhe \`cartCount\` state sameet, bilkul waise hi render hota rehta hai jaisa tha, poori tarah bina chhue, kyunki browser ne asal mein page kabhi reload kiya hi nahi. "View Wireless Mouse" click karna ab sahi tarike se product page dikhaata hai jabki cart icon abhi bhi "Cart: 3 items" padhta hai, kyunki React ke in-memory state ke baare mein kuch bhi kabhi chhoda hi nahi gaya.

**Ye abhi bhi URL bar update karna aur back button support karna kyun zaruri hai, aur \`<Link>\` ye bhi sambhaalta hai:** React Router peeche browser ke History API ka istemal karta hai dikhta URL update karne aur browser history mein ek entry jodne ke liye bilkul jaise ek asli navigation karta, isliye address bar, bookmarking, aur back/forward buttons sab sahi tarike se kaam karte hain — sirf jo skip hota hai wo bekaar, state-nashak poora page reload hai jo saadha \`<a>\` trigger karta.`,

    content: `## Setting up routes: matching a URL to a component

\`\`\`jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:productId" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

\`BrowserRouter\` wraps the whole app and enables React Router\'s URL-aware behavior throughout everything nested inside it. \`Routes\` looks at the current URL and renders whichever single \`Route\`\'s \`element\` matches — \`path="/products/:productId"\` matches any URL like \`/products/42\` or \`/products/mouse-x1\`, with \`:productId\` being a dynamic segment (covered next) rather than a literal path piece. \`path="*"\` is a catch-all matching any URL that did not match an earlier route, the standard way to render a 404/"Not Found" page. Components OUTSIDE \`Routes\` (like \`Header\` here) render on every URL regardless of which route matched, which is exactly why \`Header\`\'s cart count in the broken example survives navigation — it was never inside the part of the tree that Route swaps out in the first place.

## Reading dynamic segments with \`useParams\`

\`\`\`jsx
import { useParams } from "react-router-dom";

function ProductPage() {
  const { productId } = useParams();
  const { data: product } = useFetch(\`/api/products/\${productId}\`);   // Module 4's custom hook

  if (!product) return <p>Loading...</p>;
  return <h1>{product.name}</h1>;
}
\`\`\`

\`\`\`tsx
import { useParams } from "react-router-dom";

function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { data: product } = useFetch<Product>(\`/api/products/\${productId}\`);

  if (!product) return <p>Loading...</p>;
  return <h1>{product.name}</h1>;
}
\`\`\`

When a URL like \`/products/42\` matches a route declared as \`path="/products/:productId"\`, \`useParams()\`, called from \`ProductPage\` (or anything nested inside it), returns an object whose \`productId\` key holds the actual matched segment — \`"42"\` here, always as a string, since URL segments are text regardless of what the value conceptually represents. This is precisely how a single route definition serves every possible product page, rather than needing one hardcoded route per product — the same pattern this lesson\'s data-fetching custom hook (\`useFetch\`, Module 4) plugs into directly, using the route param as the URL to fetch.

## Programmatic navigation with \`useNavigate\`

\`\`\`jsx
import { useNavigate } from "react-router-dom";

function CheckoutForm() {
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    await submitOrder();
    navigate("/order-confirmation");   // redirect after the action completes, not from a <Link> click
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
\`\`\`

\`<Link>\` handles navigation triggered directly by a user clicking something, but some navigation needs to happen as a RESULT of code running — after a form successfully submits, after a login succeeds, after a timed redirect. \`useNavigate()\` returns a function that performs the exact same client-side navigation \`<Link>\` does, just callable from anywhere in a component\'s logic rather than tied to a click on a specific rendered element — \`navigate("/order-confirmation")\` here runs only after \`submitOrder()\` genuinely resolves successfully, which a declarative \`<Link>\` alone has no way to express.

## Nested routes and \`<Outlet>\`

\`\`\`jsx
function SettingsLayout() {
  return (
    <div className="settings-page">
      <SettingsSidebar />
      <Outlet />   {/* the matched CHILD route renders here */}
    </div>
  );
}

// In the route configuration:
<Route path="/settings" element={<SettingsLayout />}>
  <Route path="profile" element={<ProfileSettings />} />
  <Route path="billing" element={<BillingSettings />} />
</Route>
\`\`\`

A layout shared across several related pages (a settings section with a persistent sidebar, here) is expressed as a PARENT route whose \`element\` renders the shared chrome (\`SettingsSidebar\`) plus an \`<Outlet />\` — a placeholder marking exactly where the matched CHILD route\'s content should appear. Navigating between \`/settings/profile\` and \`/settings/billing\` re-renders only what \`<Outlet />\` points at; \`SettingsSidebar\` and the rest of \`SettingsLayout\` stay mounted and untouched, the same state-preservation benefit \`Link\` provides for the whole app, applied at a smaller scale to one layout shared by several sub-pages.

## TypeScript: typing route params and \`useParams\`

\`\`\`tsx
function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  // productId: string | undefined — useParams cannot GUARANTEE the param
  // exists at the type level, since a route could theoretically be
  // matched without it depending on how paths are configured

  if (!productId) return <p>Invalid product</p>;
  // after this check, productId is narrowed to "string" for the rest of the function
}
\`\`\`

\`useParams<T>()\` is generic — supplying \`{ productId: string }\` tells TypeScript what shape to expect the params object to have, but the actual returned type makes every property optional (\`productId: string | undefined\`) rather than guaranteed, since TypeScript cannot verify at compile time that a given route\'s URL pattern always includes that specific param. An explicit \`if (!productId) return ...\` check, the same narrowing technique covered for optional values throughout the TypeScript course, resolves this — after the check, TypeScript knows \`productId\` must be a real \`string\` for any code below it.`,

    contentHi: `## Routes set up karna: ek URL ko ek component se milaana

\`\`\`jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:productId" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

\`BrowserRouter\` poore app ko lapetta hai aur uske andar nested har cheez mein React Router ka URL-aware behaviour enable karta hai. \`Routes\` abhi ke URL ko dekhta hai aur jo bhi ek \`Route\` ka \`element\` mile use render karta hai — \`path="/products/:productId"\` \`/products/42\` ya \`/products/mouse-x1\` jaise kisi bhi URL se milta hai, \`:productId\` ek dynamic segment hai (aage cover hoga) koi literal path tukda nahi. \`path="*"\` ek catch-all hai jo kisi bhi URL se milta hai jo pehle kisi route se nahi mila, 404/"Not Found" page render karne ka standard tarika. \`Routes\` ke BAAHAR components (jaise yahan \`Header\`) har URL par render hote hain chahe kaunsa route mila ho, aur bilkul isi wajah se toote example mein \`Header\` ka cart count navigation ke baad bacha rehta hai — wo kabhi tree ke us hisse ke andar tha hi nahi jise Route badalta hai.

## Dynamic segments \`useParams\` se padhna

\`\`\`jsx
import { useParams } from "react-router-dom";

function ProductPage() {
  const { productId } = useParams();
  const { data: product } = useFetch(\`/api/products/\${productId}\`);   // Module 4 ka custom hook

  if (!product) return <p>Loading...</p>;
  return <h1>{product.name}</h1>;
}
\`\`\`

\`\`\`tsx
import { useParams } from "react-router-dom";

function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { data: product } = useFetch<Product>(\`/api/products/\${productId}\`);

  if (!product) return <p>Loading...</p>;
  return <h1>{product.name}</h1>;
}
\`\`\`

Jab \`/products/42\` jaisa URL \`path="/products/:productId"\` ki tarah declare hue route se milta hai, \`useParams()\`, \`ProductPage\` se bulaya gaya (ya uske andar nested kisi bhi cheez se), ek object lautaata hai jiski \`productId\` key asli mila hua segment rakhti hai — yahan \`"42"\`, hamesha ek string ki tarah, kyunki URL segments text hote hain chahe value concept mein kya batati ho. Bilkul yahi tarika hai jisse ek akela route definition har mumkin product page ki seva karta hai, har product ke liye ek hardcoded route ki zarurat ke bina — is lesson ka data-fetching custom hook (\`useFetch\`, Module 4) bilkul isi pattern mein seedha plug hota hai, route param ko fetch karne wali URL ki tarah use karte hue.

## \`useNavigate\` se programmatic navigation

\`\`\`jsx
import { useNavigate } from "react-router-dom";

function CheckoutForm() {
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    await submitOrder();
    navigate("/order-confirmation");   // action poora hone ke baad redirect, kisi <Link> click se nahi
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
\`\`\`

\`<Link>\` seedha user ke kisi cheez par click karne se trigger hui navigation sambhaalta hai, par kuch navigation code chalne ke NATEEJE ki tarah honi chahiye — form safalta se submit hone ke baad, login safal hone ke baad, ek timed redirect ke baad. \`useNavigate()\` ek function lautaata hai jo bilkul wahi client-side navigation karta hai jo \`<Link>\` karta hai, bas kisi render hue element par click se juda hone ke bajaye component ke logic mein kahin bhi bulaaya ja sakta hai — yahan \`navigate("/order-confirmation")\` sirf tab chalta hai jab \`submitOrder()\` sach mein safalta se resolve hota hai, jo akela declarative \`<Link>\` batane ka koi tarika nahi rakhta.

## Nested routes aur \`<Outlet>\`

\`\`\`jsx
function SettingsLayout() {
  return (
    <div className="settings-page">
      <SettingsSidebar />
      <Outlet />   {/* mila hua CHILD route yahan render hota hai */}
    </div>
  );
}

// Route configuration mein:
<Route path="/settings" element={<SettingsLayout />}>
  <Route path="profile" element={<ProfileSettings />} />
  <Route path="billing" element={<BillingSettings />} />
</Route>
\`\`\`

Kai jude pages mein shared layout (ek settings section jisme ek chalta hua sidebar hai, yahan) ek PARENT route ki tarah bayaan hota hai jiska \`element\` shared chrome render karta hai (\`SettingsSidebar\`) plus ek \`<Outlet />\` — ek placeholder jo bilkul batata hai mila hua CHILD route ka content kahan dikhna chahiye. \`/settings/profile\` aur \`/settings/billing\` ke beech navigate karna sirf wahi dobara render karta hai jispar \`<Outlet />\` ishara karta hai; \`SettingsSidebar\` aur \`SettingsLayout\` ka baaki hissa mounted aur bina chhue rehta hai, wahi state-preservation faayda jo \`Link\` poore app ke liye deta hai, ek chhote scale par lagu, kai sub-pages ke shared ek layout par.

## TypeScript: route params aur \`useParams\` ko type karna

\`\`\`tsx
function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  // productId: string | undefined — useParams type level par param ki
  // maujoodgi GUARANTEE nahi kar sakta, kyunki taknik roop se ek route
  // isse bina bhi milta ho sakta hai path kaise configure hue hain uspar nirbhar

  if (!productId) return <p>Invalid product</p>;
  // is check ke baad, productId function ke baaki hisse ke liye "string" mein sankra ho jaata hai
}
\`\`\`

\`useParams<T>()\` generic hai — \`{ productId: string }\` dena TypeScript ko batata hai params object ki kaunsi shape ummeed karni chahiye, par asli return hua type har property ko optional banaata hai (\`productId: string | undefined\`) guaranteed ke bajaye, kyunki TypeScript compile time par verify nahi kar sakta ki di gayi route ka URL pattern hamesha us khaas param ko shaamil karta hai. Ek explicit \`if (!productId) return ...\` check, poore TypeScript course mein optional values ke liye cover hua wahi narrowing technique, ise hal karta hai — check ke baad, TypeScript jaanta hai \`productId\` uske neeche kisi bhi code ke liye ek asli \`string\` hi hai.`,

    examples: [
      {
        title: 'Broken: a plain <a> tag causes a full reload, losing cart state',
        titleHi: 'Toota: saadha <a> tag poora reload karta hai, cart state khote hue',
        code: `function Header({ cartCount }) {
  return <header>
    <span>Cart: {cartCount} items</span>
    <a href="/products/42">View Wireless Mouse</a>
  </header>;
}`,
        codeJs: `function Header({ cartCount }) {
  return (
    <header>
      <span>Cart: {cartCount} items</span>
      <a href="/products/42">View Wireless Mouse</a>
    </header>
  );
}

function App() {
  const [cartCount, setCartCount] = useState(3);
  return (
    <div>
      <Header cartCount={cartCount} />
      {/* ...rest of the app... */}
    </div>
  );
}`,
        codeTs: `function Header({ cartCount }: { cartCount: number }) {
  return (
    <header>
      <span>Cart: {cartCount} items</span>
      <a href="/products/42">View Wireless Mouse</a>
    </header>
  );
}

function App() {
  const [cartCount, setCartCount] = useState<number>(3);
  return (
    <div>
      <Header cartCount={cartCount} />
    </div>
  );
}
// TypeScript does not catch this — a plain <a href> is completely
// valid JSX. This is a client-side-routing concern, not a type error.`,
        output: `With cartCount = 3, clicking "View Wireless Mouse" navigates to the
product page correctly, but a full browser page reload occurs — every
piece of React state, including cartCount, resets to its initial
value. The header on the new page shows "Cart: 0 items".`,
        explain: 'The navigation itself works correctly — this is not a broken link — the problem is entirely that the browser\'s default full-page-reload behavior discards all of React\'s in-memory state along with the old page.',
        explainHi: 'Navigation khud sahi tarike se kaam karta hai — ye koi toota link nahi hai — samasya poori tarah ye hai ki browser ka default poora-page-reload behaviour React ke saare in-memory state ko purane page ke saath chhod deta hai.',
      },
      {
        title: 'Fixed: <Link> preserves state across navigation',
        titleHi: 'Theek: <Link> navigation ke aar-paar state bachaata hai',
        code: `import { Link } from "react-router-dom";
function Header({ cartCount }) {
  return <header>
    <span>Cart: {cartCount} items</span>
    <Link to="/products/42">View Wireless Mouse</Link>
  </header>;
}`,
        codeJs: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Header({ cartCount }) {
  return (
    <header>
      <span>Cart: {cartCount} items</span>
      <Link to="/products/42">View Wireless Mouse</Link>
    </header>
  );
}

function App() {
  const [cartCount, setCartCount] = useState(3);
  return (
    <BrowserRouter>
      <Header cartCount={cartCount} />
      <Routes>
        <Route path="/products/:productId" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}`,
        codeTs: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Header({ cartCount }: { cartCount: number }) {
  return (
    <header>
      <span>Cart: {cartCount} items</span>
      <Link to="/products/42">View Wireless Mouse</Link>
    </header>
  );
}

function App() {
  const [cartCount, setCartCount] = useState<number>(3);
  return (
    <BrowserRouter>
      <Header cartCount={cartCount} />
      <Routes>
        <Route path="/products/:productId" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}`,
        outputJs: `With cartCount = 3, clicking "View Wireless Mouse" navigates to the
product page correctly, and the header STILL shows "Cart: 3 items" —
no full page reload occurred, so cartCount's state was never
discarded.`,
        outputTs: `// Identical behaviour. "Link" is imported from "react-router-dom",
// which ships its own TypeScript types — "to" is typed to require a
// valid path-like string, catching some malformed URLs at compile
// time.`,
        explain: 'Header itself did not change at all between the broken and fixed versions — only the single <a> tag became a <Link>, which is the entire fix.',
        explainHi: 'Toote aur theek versions ke beech \`Header\` khud bilkul nahi badla — sirf akela \`<a>\` tag \`<Link>\` bana, aur yahi poora fix hai.',
      },
      {
        title: 'useParams reads the productId from a dynamic route',
        titleHi: 'useParams dynamic route se productId padhta hai',
        code: `function ProductPage() {
  const { productId } = useParams();
  const { data: product } = useFetch(\`/api/products/\${productId}\`);
  return product ? <h1>{product.name}</h1> : <p>Loading...</p>;
}`,
        codeJs: `import { useParams } from "react-router-dom";

function ProductPage() {
  const { productId } = useParams();
  const { data: product, isLoading } = useFetch(\`/api/products/\${productId}\`);

  if (isLoading) return <p>Loading...</p>;
  return <h1>{product.name}</h1>;
}

// Route config: <Route path="/products/:productId" element={<ProductPage />} />`,
        codeTs: `import { useParams } from "react-router-dom";

interface Product {
  id: string;
  name: string;
}

function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading } = useFetch<Product>(\`/api/products/\${productId}\`);

  if (isLoading) return <p>Loading...</p>;
  return <h1>{product!.name}</h1>;
}`,
        outputJs: `Visiting /products/42 shows the mouse's name; visiting /products/7
shows a completely different product's name — the same ProductPage
component and route definition serves every product ID without any
hardcoded per-product routing.`,
        outputTs: `// "useParams<{ productId: string }>()" types productId as "string |
// undefined" — the "product!" non-null assertion after isLoading is
// false relies on isLoading correctly gating the render, the same
// pattern from Module 3's data-fetching lesson.`,
        explain: 'This example directly connects to Module 4\'s custom hooks lesson — useFetch does not know or care that its URL came from a route param rather than a hardcoded string, since it just receives a plain string either way.',
        explainHi: 'Ye example seedha Module 4 ke custom hooks lesson se judta hai — \`useFetch\` ko jaanne ya parwaah karne ki zarurat nahi ki uski URL ek route param se aayi ya hardcoded string se, kyunki wo dono taraf se bas ek saadhi string paata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `<a href="/products/42">View product</a>
// causes a full browser reload for internal navigation`,
        right: `import { Link } from "react-router-dom";
<Link to="/products/42">View product</Link>`,
        why: 'A plain <a href> triggers the browser\'s default full-page-navigation behavior, discarding all of React\'s in-memory state; <Link> intercepts the click and performs client-side-only navigation, preserving state outside the swapped route.',
        whyHi: 'Saadha \`<a href>\` browser ka default poora-page-navigation behaviour trigger karta hai, React ke saare in-memory state ko chhodte hue; \`<Link>\` click ko rok leta hai aur sirf client-side navigation karta hai, badle hue route ke bahar ki state bachaate hue.',
      },
      {
        wrong: `function ProductPage() {
  const { productId } = useParams();
  return <h1>{productId.toUpperCase()}</h1>;   // assumes productId always exists
}`,
        right: `function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  if (!productId) return <p>Invalid product</p>;
  return <h1>{productId.toUpperCase()}</h1>;   // narrowed to string after the check`,
        why: 'useParams cannot guarantee at the type level that a given param genuinely exists on every possible match, so TypeScript types every param as possibly undefined — an explicit check is needed before treating it as a definite string.',
        whyHi: '\`useParams\` type level par guarantee nahi kar sakta ki koi diya gaya param har mumkin match par sach mein maujood hai, isliye TypeScript har param ko possibly undefined ki tarah type karta hai — use ek pakki string ki tarah maanne se pehle ek explicit check chahiye.',
      },
      {
        wrong: `async function handleSubmit(event) {
  event.preventDefault();
  window.location.href = "/order-confirmation";   // full reload, same problem as a plain <a>
}`,
        right: `import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
async function handleSubmit(event) {
  event.preventDefault();
  await submitOrder();
  navigate("/order-confirmation");
}`,
        why: 'Setting window.location.href triggers the same full browser reload a plain <a> tag does; useNavigate performs client-side navigation instead, preserving state exactly like Link does for click-triggered navigation.',
        whyHi: '\`window.location.href\` set karna wahi poora browser reload trigger karta hai jo ek saadha \`<a>\` tag karta hai; \`useNavigate\` iske bajaye client-side navigation karta hai, bilkul \`Link\` jaise state bachaate hue click-trigger hui navigation ke liye.',
      },
    ],

    realWorld: [
      {
        en: '**React Router is the single most widely used routing library in the React ecosystem**, used in the vast majority of production single-page applications that need more than one URL — losing state on navigation via a plain `<a>` tag is one of the first mistakes almost every developer coming from traditional server-rendered sites makes.',
        hi: '**React Router React ecosystem mein sabse zyada use hone wali akeli routing library hai**, un zyadatar production single-page applications mein use hoti hai jinhe ek se zyada URL chahiye — saadhe \`<a>\` tag se navigation par state khona un pehle galtiyon mein se ek hai jo lagbhag har developer roaayti server-rendered sites se aakar karta hai.',
      },
      {
        en: '**Route-based code splitting (covered in the next lesson) is built directly on top of the route definitions this lesson introduces** — lazy-loading a page\'s code only when its route is actually visited is one of the most common, highest-impact performance techniques in real production apps.',
        hi: '**Route-based code splitting (agle lesson mein cover hoga) seedha in route definitions ke upar bani hai jo ye lesson introduce karta hai** — kisi page ka code sirf tab lazy-load karna jab uska route asal mein visit ho asli production apps mein sabse aam, sabse zyada asar wali performance techniques mein se ek hai.',
      },
      {
        en: '**Nested routes with a shared layout via `<Outlet>` is the standard pattern behind nearly every dashboard, settings page, or admin panel with a persistent sidebar** across production React applications — the sidebar\'s own state (a collapsed/expanded toggle, for instance) survives navigating between its sub-pages precisely because of the state-preservation this lesson demonstrated.',
        hi: '**\`<Outlet>\` se shared layout wale nested routes lagbhag har dashboard, settings page, ya chalte sidebar wale admin panel ke peeche ka standard pattern hain** production React applications mein — sidebar ki apni state (ek collapsed/expanded toggle, misal ke taur par) uske sub-pages ke beech navigate karne se bilkul isi wajah se bachi rehti hai jo state-preservation ye lesson dikhaata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does clicking a plain HTML `<a href>` link inside a React app discard all of the app\'s in-memory state, while clicking a React Router `<Link>` to the same URL does not?',
        qHi: 'React app ke andar saadha HTML \`<a href>\` link click karna app ki saari in-memory state kyun chhod deta hai, jabki wahi URL wala React Router \`<Link>\` click karna aisa nahi karta?',
        a: 'A plain `<a href>` triggers the browser\'s original, decades-old default behavior for links: navigating to a new URL by fully discarding the current page — including every script, every variable, and the entire React application currently running in memory — and requesting and loading a completely fresh page from scratch. Because React\'s state (component state, Context values, anything held only in JavaScript memory) exists only as part of that now-discarded page, none of it survives to the newly-loaded page, which starts with entirely fresh, initial state. React Router\'s `Link` renders an `<a>` tag but attaches a JavaScript click handler that intercepts the click before the browser acts on it, preventing the default full-navigation behavior and instead updating only the specific part of the already-running React component tree that the matched route says should change, using the browser\'s History API to keep the URL bar and back/forward navigation behaving correctly without ever actually discarding and reloading the page.',
        aHi: 'Saadha \`<a href>\` links ke liye browser ka asli, das saal purana default behaviour trigger karta hai: naye URL par navigate karna abhi ke page ko poori tarah chhodkar — har script, har variable, aur memory mein abhi chal rahi poori React application sameet — aur ek bilkul taaza page ko shuru se request aur load karke. Chunki React ki state (component state, Context values, sirf JavaScript memory mein rakhi koi bhi cheez) sirf us ab chhode gaye page ke hisse ki tarah maujood thi, usme se kuch bhi naye load hue page tak nahi bachta, jo bilkul taaza, shuruaati state se shuru hota hai. React Router ka \`Link\` ek \`<a>\` tag render karta hai par ek JavaScript click handler jodta hai jo click ko rok leta hai us se pehle browser uspar kaam kare, default poora-navigation behaviour rokte hue aur iske bajaye abhi chal rahi React component tree ke sirf us khaas hisse ko update karte hue jise mila hua route badalne ko kehta hai, browser ke History API ka istemal karte hue URL bar aur back/forward navigation ko sahi tarike se behave karaate hue bina asal mein page ko kabhi chhode ya reload kiye.',
      },
      {
        q: 'Why does `useParams()` type every property as possibly `undefined` in TypeScript, even for a route defined with a required-looking `:productId` segment?',
        qHi: 'TypeScript mein \`useParams()\` har property ko possibly \`undefined\` ki tarah kyun type karta hai, ek ummeed-ki-zaruri \`:productId\` segment wale route ke liye bhi?',
        a: '`useParams` is a generic function whose type argument the caller supplies manually (`useParams<{ productId: string }>()`) — TypeScript has no built-in way to inspect the actual string passed to a `<Route path="...">` prop elsewhere in the app and automatically verify that this specific `useParams` call site is genuinely inside a route that always provides a `productId` segment; route matching itself happens at runtime, not something the type checker traces through. Because that connection between a specific route\'s path pattern and a specific `useParams` call cannot be statically verified, the actual returned type marks every parameter as possibly `undefined` as a conservative, honest default — reflecting that, from what TypeScript alone can prove, there is no guarantee the param is present — requiring an explicit runtime check to narrow it down to a definite `string` before it can be used as one.',
        aHi: '\`useParams\` ek generic function hai jiska type argument caller khud deta hai (\`useParams<{ productId: string }>()\`) — TypeScript ke paas app mein kahin aur \`<Route path="...">\` prop ko pass hui asli string ko inspect karke apne aap verify karne ka koi built-in tarika nahi ki ye khaas \`useParams\` call site sach mein aise route ke andar hai jo hamesha \`productId\` segment deta hai; route matching khud runtime par hota hai, aisi cheez nahi jise type checker trace kare. Chunki khaas route ke path pattern aur khaas \`useParams\` call ke beech ye rishta statically verify nahi ho sakta, asli return hua type har parameter ko possibly \`undefined\` ki tarah maarkata hai ek conservative, imaandaar default ki tarah — ye batate hue ki, jo akela TypeScript prove kar sakta hai uske hisaab se, param maujood hai iski koi guarantee nahi hai — use ek pakki \`string\` ki tarah use karne se pehle ek explicit runtime check chahiye use sankra karne ke liye.',
      },
      {
        q: 'Why does `useNavigate` exist as a separate tool from `<Link>`, rather than `<Link>` alone covering every navigation need?',
        qHi: '\`useNavigate\` \`<Link>\` se alag ek tool ki tarah kyun maujood hai, iske bajaye ki \`<Link>\` akela har navigation zarurat cover kare?',
        a: '`<Link>` is a declarative component tied to a specific rendered element the user directly clicks — it works well for navigation that is a direct, immediate response to a click, like a menu item or a "view product" link. Some navigation needs to happen as a consequence of code finishing some other work first — redirecting to a confirmation page only after an async form submission genuinely succeeds, or redirecting after a login API call resolves — which cannot be expressed by a `<Link>` alone, since there is no click event to attach the navigation to at the moment it needs to happen. `useNavigate()` returns an imperative function that performs the identical client-side navigation `<Link>` does, but callable from anywhere in a component\'s regular JavaScript logic (inside an `async` function, inside a `.then` callback, inside a `useEffect`), making it the appropriate tool specifically for navigation triggered by something other than a direct, immediate click on a rendered link.',
        aHi: '\`<Link>\` ek declarative component hai jo ek khaas render hue element se juda hai jise user seedha click karta hai — ye achhi tarah kaam karta hai us navigation ke liye jo click ka seedha, turant jawaab hai, jaise ek menu item ya "view product" link. Kuch navigation code ke kisi doosre kaam pehle poora hone ke nateeje ki tarah honi chahiye — confirmation page par redirect sirf tab jab async form submission sach mein safal ho, ya login API call resolve hone ke baad redirect — jo akela \`<Link>\` se nahi bataya ja sakta, kyunki us pal jab navigation honi chahiye tab koi click event hi nahi hai jispar use joda jaaye. \`useNavigate()\` ek imperative function lautaata hai jo bilkul wahi client-side navigation karta hai jo \`<Link>\` karta hai, par component ke aam JavaScript logic mein kahin bhi bulaaya ja sakta hai (ek \`async\` function ke andar, ek \`.then\` callback ke andar, ek \`useEffect\` ke andar), use khaas taur par aisi navigation ke liye sahi auzaar banaate hue jo ek render hue link par seedhe, turant click ke alawa kisi doosri cheez se trigger hoti hai.',
      },
      {
        q: 'What state-preservation benefit does a shared layout using nested routes and `<Outlet>` provide over rendering each sub-page as a completely separate top-level route?',
        qHi: 'Nested routes aur \`<Outlet>\` use karne wala ek shared layout har sub-page ko ek poori tarah alag top-level route ki tarah render karne par kaunsa state-preservation faayda deta hai?',
        a: 'When a shared layout (a sidebar, a persistent header specific to one section) is expressed as a parent route rendering shared chrome plus an `<Outlet />`, only the content that `<Outlet />` points at changes when navigating between child routes — the parent route\'s own component, including any of its own state, stays mounted throughout, exactly as `Header` does for the whole app in this lesson\'s main example, just scoped to one section rather than the entire application. If each sub-page were instead defined as a completely separate top-level route, each duplicating the sidebar\'s JSX independently, the sidebar would need to be re-created (and any of its own internal state, like a collapsed/expanded toggle, reset) every time the user navigated between sub-pages, since React Router would treat each as an entirely unrelated route rather than recognizing the shared layout as a single, continuously-rendered piece of the tree.',
        aHi: 'Jab ek shared layout (ek sidebar, ek section-khaas chalta hua header) ek parent route ki tarah bayaan hota hai jo shared chrome plus ek \`<Outlet />\` render karta hai, child routes ke beech navigate karte waqt sirf wahi content badalta hai jispar \`<Outlet />\` ishara karta hai — parent route ka apna component, uski apni kisi bhi state sameet, poore waqt mounted rehta hai, bilkul jaise is lesson ke mukhya example mein \`Header\` poore app ke liye karta hai, bas ek poori application ke bajaye ek section tak seemit. Agar har sub-page iske bajaye ek poori tarah alag top-level route ki tarah define hota, har ek sidebar ke JSX ko alag se dohraate hue, sidebar ko har baar dobara banaana padta jab user sub-pages ke beech navigate karta (aur uski apni koi bhi internal state, jaise ek collapsed/expanded toggle, reset ho jaati), kyunki React Router har ek ko poori tarah na-juda route maanta, shared layout ko tree ke ek akele, lagataar render hote tukde ki tarah pehchaanne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build a small app with a cart count in App-level state, a Header rendering it, and a plain <a href> link to a product page. Add items to the cart, navigate via the link, and confirm the count resets to its initial value.',
        taskHi: 'App-level state mein cart count, use render karta Header, aur product page ka saadha <a href> link wala ek chhota app banao. Cart mein items jodo, link se navigate karo, aur confirm karo count apni shuruaati value par reset hota hai.',
        hint: 'Open the browser Network tab before clicking the link and confirm a full document request fires, versus none firing when you switch to Link in the next exercise.',
        hintHi: 'Link click karne se pehle browser Network tab kholo aur confirm karo ek poora document request chalti hai, agle exercise mein Link par switch karne par kuch na chalne ke muqable.',
      },
      {
        task: 'Switch the link to React Router\'s <Link>, wrap the app in BrowserRouter/Routes/Route, and confirm the same cart count now survives navigation to the product page.',
        taskHi: 'Link ko React Router ke <Link> mein badlo, app ko BrowserRouter/Routes/Route mein lapeto, aur confirm karo wahi cart count ab product page tak navigate hone par bacha rehta hai.',
        hint: 'Add a console.log inside Header\'s function body and confirm it does NOT re-mount (no fresh log from scratch, just a normal re-render) when navigating with Link, unlike with the plain <a>.',
        hintHi: 'Header ke function body ke andar ek console.log jodo aur confirm karo ye Link se navigate karte waqt dobara-mount NAHI hota (shuru se koi taaza log nahi, bas ek aam re-render), saadhe <a> ke ulat.',
      },
      {
        task: 'Add a dynamic route with :productId, read it with useParams inside ProductPage, and confirm visiting two different product URLs correctly shows two different products from the same component and route definition.',
        taskHi: ':productId wala dynamic route jodo, use ProductPage ke andar useParams se padho, aur confirm karo do alag product URLs visit karna wahi component aur route definition se do alag products sahi tarike se dikhaata hai.',
        hint: 'Try navigating directly to a nonexistent product ID and observe what your useFetch-based loading/error handling from Module 3 does with the resulting failed request.',
        hintHi: 'Ek na-maujood product ID par seedha navigate karne ki koshish karo aur dekho Module 3 wala aapka useFetch-based loading/error handling nateeja hui fail hui request ke saath kya karta hai.',
      },
    ],

    keyTakeaways: [
      'A plain HTML `<a href>` inside a React app triggers the browser\'s default full-page-navigation behavior, discarding all in-memory React state; React Router\'s `<Link>` intercepts the click and performs client-side-only navigation, preserving state outside the swapped route.',
      '`BrowserRouter`/`Routes`/`Route` match the current URL to a component; components outside `Routes` render on every URL regardless of the match, which is why app-wide state (a cart count, a header) survives navigation.',
      '`useParams()` reads the actual matched values of a route\'s dynamic segments (`:productId`), letting one route definition and one component serve every possible value rather than needing a hardcoded route per case.',
      '`useNavigate()` provides the same client-side navigation `<Link>` does, but as an imperative function callable from anywhere in a component\'s logic — used for navigation that should happen as a consequence of other code completing, not a direct click.',
      'A shared layout across related sub-pages is expressed as a parent route rendering shared chrome plus `<Outlet />`, which marks where the matched child route\'s content appears — the parent stays mounted, preserving its own state, while only the outlet content changes.',
      '`useParams<T>()` types every parameter as possibly `undefined`, since TypeScript cannot statically verify that a given call site is always reached through a route guaranteeing that specific param — an explicit check narrows it to a definite value before use.',
    ],
    keyTakeawaysHi: [
      'React app ke andar saadha HTML \`<a href>\` browser ka default poora-page-navigation behaviour trigger karta hai, saara in-memory React state chhodte hue; React Router ka \`<Link>\` click ko rok leta hai aur sirf client-side navigation karta hai, badle hue route ke bahar ki state bachaate hue.',
      '\`BrowserRouter\`/\`Routes\`/\`Route\` abhi ke URL ko ek component se milaate hain; \`Routes\` ke bahar components har URL par render hote hain chahe match kuch bhi ho, aur bilkul isi wajah se app-wide state (cart count, header) navigation ke aar-paar bachi rehti hai.',
      '\`useParams()\` route ke dynamic segments (\`:productId\`) ki asli mili hui values padhta hai, ek route definition aur ek component ko har mumkin value ki seva karne dete hue, har case ke liye ek hardcoded route ki zarurat ke bajaye.',
      '\`useNavigate()\` wahi client-side navigation deta hai jo \`<Link>\` deta hai, par ek imperative function ki tarah component ke logic mein kahin bhi bulaaya ja sakta hai — us navigation ke liye use hota hai jo doosre code ke poora hone ke nateeje ki tarah honi chahiye, seedhe click ki nahi.',
      'Jude sub-pages ke aar-paar ek shared layout ek parent route ki tarah bayaan hota hai jo shared chrome plus \`<Outlet />\` render karta hai, jo batata hai mila hua child route ka content kahan dikhta hai — parent mounted rehta hai, apni state bachaate hue, jabki sirf outlet content badalta hai.',
      '\`useParams<T>()\` har parameter ko possibly \`undefined\` ki tarah type karta hai, kyunki TypeScript statically verify nahi kar sakta ki di gayi call site hamesha aise route se pahunchi hai jo us khaas param ki guarantee deta hai — ek explicit check use ek pakki value tak sankra karta hai use se pehle.',
    ],
  },
];
