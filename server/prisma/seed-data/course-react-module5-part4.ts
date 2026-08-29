/**
 * React Complete Course — Module 5: Patterns & Architecture, lesson 4 (final
 * lesson of Module 5).
 *
 * Error boundaries: catching render-time errors in a subtree instead of
 * letting them unmount the whole app. The broken example is a widget that
 * throws while rendering (e.g., a null/undefined access on unexpectedly
 * missing data) and takes the ENTIRE page blank/white, not just the one
 * broken widget — a genuinely common real production incident shape.
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

export const REACT_MODULE_5_PART4: CourseLesson[] = [
  {
    slug: 'error-boundaries',
    title: 'Error Boundaries: Containing Render Failures',
    titleHi: 'Error Boundaries: Render Failures Ko Rokna',
    description: 'One broken "recommended products" widget takes down the ENTIRE page — the header, the cart, the checkout button, everything.',
    descriptionHi: 'Ek tooti "recommended products" widget POORE page ko le doobti hai — header, cart, checkout button, sab kuch.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**One faulty appliance blowing a fuse for the entire building versus one blowing a fuse for just that one room.** A React app with no error boundaries is like an old building with a single fuse for the whole structure — the instant one faulty toaster in a kitchen anywhere in the building short-circuits, the ENTIRE building loses power, including rooms with nothing wrong in them at all. A properly fused building isolates each room (or each floor) behind its own breaker — that same faulty toaster still trips ITS room\'s breaker, and that room genuinely does go dark, but every other room keeps working completely normally, unaffected. An error boundary is that per-room breaker for a section of a React UI: when something inside it fails, only that specific section goes dark (shows a fallback), while the rest of the page — the header, navigation, everything outside that boundary — keeps working exactly as if nothing happened.',
      hi: '**Ek kharaab appliance poori building ka fuse udaa dena versus sirf us ek kamre ka fuse udaana.** Koi error boundaries na wala React app aisi purani building jaisa hai jisme poori sanrachna ke liye ek hi fuse hai — jaise hi building mein kahin bhi kisi kitchen mein ek kharaab toaster short-circuit karta hai, POORI building ki bijli chali jaati hai, un kamron sameet jinme kuch bhi galat nahi hai. Ek sahi tarike se fuse ki hui building har kamre (ya har floor) ko apne khud ke breaker ke peeche alag rakhti hai — wahi kharaab toaster phir bhi USKE kamre ka breaker trip karta hai, aur wo kamra sach mein andhera ho jaata hai, par har doosra kamra poori tarah normal chalta rehta hai, bekhabar. Error boundary React UI ke ek hisse ke liye wahi per-room breaker hai: jab uske andar kuch fail hota hai, sirf wo khaas hissa andhera hota hai (ek fallback dikhaata hai), jabki page ka baaki hissa — header, navigation, us boundary ke bahar sab kuch — bilkul waise hi chalta rehta hai jaise kuch hua hi na ho.',
    },

    simple: `**Start broken.** A product page with several independent sections, one of which crashes while rendering:

\`\`\`jsx
function RecommendedProducts({ products }) {
  return (
    <ul>
      {products.map((p) => <li key={p.id}>{p.name} — \${p.price.toFixed(2)}</li>)}
    </ul>
  );
}

function ProductPage({ product, recommendations }) {
  return (
    <div>
      <Header />
      <ProductDetails product={product} />
      <RecommendedProducts products={recommendations} />
      <Footer />
    </div>
  );
}
\`\`\`

If the recommendations API ever returns a product missing its \`price\` field — a genuinely realistic real-world scenario (a partial outage, a schema change, bad data) — \`p.price.toFixed(2)\` throws, because \`.toFixed\` is being called on \`undefined\`. React\'s default behavior when a component throws during rendering is to unmount the ENTIRE component tree starting from the nearest root, not just the one broken component — the crash inside \`RecommendedProducts\` takes down \`Header\`, \`ProductDetails\`, and \`Footer\` right along with it, even though none of them did anything wrong. A user trying to buy the product they came for sees a completely blank white page, unable to reach the working "Add to cart" button that was rendering perfectly fine one component away, purely because an unrelated recommendations widget received bad data.

**The fix: an error boundary contains the crash to just its own subtree**

\`\`\`jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function ProductPage({ product, recommendations }) {
  return (
    <div>
      <Header />
      <ProductDetails product={product} />
      <ErrorBoundary fallback={<p>Recommendations are unavailable right now.</p>}>
        <RecommendedProducts products={recommendations} />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
\`\`\`

\`\`\`tsx
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function ProductPage({ product, recommendations }: { product: Product; recommendations: Product[] }) {
  return (
    <div>
      <Header />
      <ProductDetails product={product} />
      <ErrorBoundary fallback={<p>Recommendations are unavailable right now.</p>}>
        <RecommendedProducts products={recommendations} />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
\`\`\`

Wrapping specifically \`RecommendedProducts\` — not the whole page — in \`ErrorBoundary\` means that exact same crash now only affects that one wrapped section. When \`RecommendedProducts\` throws, \`ErrorBoundary\` catches it and renders its \`fallback\` (a plain, calm message) in that section\'s place, while \`Header\`, \`ProductDetails\`, and \`Footer\`, none of which are inside this particular boundary, continue rendering completely normally, entirely unaware anything went wrong nearby. The user still sees a working page — they can still read the product details and click "Add to cart" — with only the recommendations section quietly degraded instead of the whole page going blank.

**Error boundaries must currently be written as class components** — there is no Hooks-based equivalent as of this writing, because \`getDerivedStateFromError\` and \`componentDidCatch\` are lifecycle methods with no Hook counterpart; this is one of the few remaining places React still requires class syntax. In practice, most teams write the \`ErrorBoundary\` class shown here once, or install a small existing package that provides one, and never write a second one by hand.`,

    simpleHi: `**Toote hue se shuru.** Ek product page jisme kai alag-alag sections hain, jinme se ek render karte waqt crash ho jaata hai:

\`\`\`jsx
function RecommendedProducts({ products }) {
  return (
    <ul>
      {products.map((p) => <li key={p.id}>{p.name} — \${p.price.toFixed(2)}</li>)}
    </ul>
  );
}

function ProductPage({ product, recommendations }) {
  return (
    <div>
      <Header />
      <ProductDetails product={product} />
      <RecommendedProducts products={recommendations} />
      <Footer />
    </div>
  );
}
\`\`\`

Agar recommendations API kabhi bhi aisa product lautaaye jiska \`price\` field missing ho — ek sach mein haqeeqi asli-duniya scenario (ek partial outage, ek schema change, kharaab data) — \`p.price.toFixed(2)\` throw karta hai, kyunki \`.toFixed\` \`undefined\` par bulaya jaa raha hai. Rendering ke dauran component throw hone par React ka default behaviour POORI component tree ko sabse nazdeeki root se unmount karna hai, sirf us ek toote component ko nahi — \`RecommendedProducts\` ke andar hua crash \`Header\`, \`ProductDetails\`, aur \`Footer\` ko apne saath le doobta hai, chahe unme se kisi ne bhi kuch galat na kiya ho. Product khareedne aaya user jise wo chahiye tha use ek bilkul khaali safed page dikhta hai, kaam karta "Add to cart" button tak na pahunch paate hue jo ek component door bilkul theek render ho raha tha, sirf isliye kyunki ek na-judi recommendations widget ko kharaab data mila.

**Fix: ek error boundary crash ko sirf apni khud ki subtree tak rokta hai**

\`\`\`jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function ProductPage({ product, recommendations }) {
  return (
    <div>
      <Header />
      <ProductDetails product={product} />
      <ErrorBoundary fallback={<p>Recommendations are unavailable right now.</p>}>
        <RecommendedProducts products={recommendations} />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
\`\`\`

\`\`\`tsx
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function ProductPage({ product, recommendations }: { product: Product; recommendations: Product[] }) {
  return (
    <div>
      <Header />
      <ProductDetails product={product} />
      <ErrorBoundary fallback={<p>Recommendations are unavailable right now.</p>}>
        <RecommendedProducts products={recommendations} />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
\`\`\`

Khaas taur par \`RecommendedProducts\` ko — poore page ko nahi — \`ErrorBoundary\` mein lapetna matlab bilkul wahi crash ab sirf us ek lapete hue section ko asar karta hai. Jab \`RecommendedProducts\` throw karta hai, \`ErrorBoundary\` use pakadta hai aur uski jagah apna \`fallback\` (ek saadha, shaant message) render karta hai, jabki \`Header\`, \`ProductDetails\`, aur \`Footer\`, jinme se koi bhi is khaas boundary ke andar nahi hai, poori tarah normal render hote rehte hain, poori tarah bekhabar ki paas mein kuch galat hua. User ko phir bhi ek chalta hua page dikhta hai — wo abhi bhi product details padh sakta hai aur "Add to cart" click kar sakta hai — sirf recommendations section chupchap kharaab hone ke saath, poore page ke khaali ho jaane ke bajaye.

**Error boundaries abhi class components ki tarah hi likhne chahiye** — is likhne ke waqt Hooks-based koi barabar nahi hai, kyunki \`getDerivedStateFromError\` aur \`componentDidCatch\` lifecycle methods hain jinka koi Hook barabar nahi hai; ye un kuch bachi jagahon mein se ek hai jahan React abhi bhi class syntax maangta hai. Amal mein, zyadatar teams yahan dikhaayi \`ErrorBoundary\` class ek baar likhti hain, ya ek chhota maujood package install karti hain jo ek deta hai, aur kabhi doosri haath se nahi likhtin.`,

    content: `## What error boundaries catch, and what they deliberately do not

\`\`\`jsx
function BrokenButton() {
  function handleClick() {
    throw new Error("Something broke");   // NOT caught by an error boundary — this is an event handler, not rendering
  }
  return <button onClick={handleClick}>Click me</button>;
}
\`\`\`

Error boundaries specifically catch errors thrown DURING RENDERING — inside a component\'s function body, or inside lifecycle methods, as the component tree is being built. They deliberately do NOT catch errors thrown inside event handlers (like the \`onClick\` above), inside \`async\` code such as a \`.then\`/\`.catch\` in a data-fetching effect, during server-side rendering, or thrown by the error boundary\'s own code. Event-handler errors are excluded specifically because React does not need to "recover" a broken render for them — the component is not currently in the middle of rendering when a click handler runs, so there is no partially-built tree that needs a fallback; an ordinary \`try\`/\`catch\` inside the handler itself is the appropriate tool there instead.

## The two lifecycle methods, and why both exist

\`\`\`jsx
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true };   // update state to trigger the fallback UI — runs during rendering, keep it side-effect-free
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);   // log/report the error — runs AFTER rendering, side effects belong here
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
\`\`\`

\`getDerivedStateFromError\`, a static method, is called during the "render" phase and is meant purely to compute new state (here, flipping \`hasError\` to \`true\`) that determines what the fallback UI should look like — it must not perform side effects like logging or network calls, the same rule that governs any code that runs during rendering. \`componentDidCatch\`, an instance method, is called during the separate "commit" phase, after React has already applied the fallback UI to the screen, and is the correct place for actual side effects: logging the error to an error-tracking service (Sentry and similar tools, covered further below), sending analytics, or any other action that should happen once, in response to the failure, without affecting what gets rendered.

## Placing boundaries around independent sections, not just at the app\'s root

\`\`\`jsx
function Dashboard() {
  return (
    <div>
      <ErrorBoundary fallback={<WidgetError />}><RevenueChart /></ErrorBoundary>
      <ErrorBoundary fallback={<WidgetError />}><RecentOrders /></ErrorBoundary>
      <ErrorBoundary fallback={<WidgetError />}><ActivityFeed /></ErrorBoundary>
    </div>
  );
}
\`\`\`

A single error boundary wrapping an entire app is better than nothing — it prevents a fully blank white screen — but it still takes down every section inside it together, since the whole wrapped subtree unmounts as one unit when any part of it throws. Placing a SEPARATE boundary around each independently-useful section (each dashboard widget here) means one section\'s failure is contained to exactly that section, leaving every other section fully functional — this granularity decision is a real architectural judgment call, not something with one universally correct answer, and generally follows the boundaries of what a user would consider one meaningful, independently-useful piece of the page.

## Error boundaries and error-tracking services

\`\`\`jsx
componentDidCatch(error, errorInfo) {
  Sentry.captureException(error, { extra: errorInfo });
}
\`\`\`

\`componentDidCatch\` receiving the actual error object and React-specific \`errorInfo\` (including the component stack showing exactly which component threw) makes it the standard integration point for error-tracking services in production apps — rather than an error silently degrading a section of UI with nobody ever finding out it happened, \`componentDidCatch\` is where that failure gets reported somewhere a developer will actually see it, which is precisely why nearly every error-tracking service\'s React integration provides a ready-made \`ErrorBoundary\` component built around this exact pattern.

## TypeScript: typing an error boundary\'s props, state, and lifecycle methods

\`\`\`tsx
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(error, errorInfo);
  }

  render(): React.ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
\`\`\`

\`React.Component<Props, State>\` is itself generic (the same generic-type concept covered throughout this course, here applied to the class-component base type rather than a hook) — supplying \`ErrorBoundaryProps\` and \`ErrorBoundaryState\` as its two type arguments correctly types \`this.props\` and \`this.state\` throughout the class body. \`React.ErrorInfo\` is a type the React type definitions ship specifically for \`componentDidCatch\`\'s second parameter, containing the \`componentStack\` string that shows exactly which component threw — this is one of the very few places in modern React where \`class\` syntax and its accompanying, slightly different typing conventions (generic base class, instance fields, no Hook generics) remain the only option.`,

    contentHi: `## Error boundaries kya pakadte hain, aur jaan-boojhkar kya nahi pakadte

\`\`\`jsx
function BrokenButton() {
  function handleClick() {
    throw new Error("Something broke");   // ERROR BOUNDARY se NAHI pakda jaata — ye event handler hai, rendering nahi
  }
  return <button onClick={handleClick}>Click me</button>;
}
\`\`\`

Error boundaries khaas taur par RENDERING KE DAURAN throw hui errors pakadte hain — component ki function body ke andar, ya lifecycle methods ke andar, jaise component tree banayi jaa rahi hoti hai. Wo jaan-boojhkar event handlers ke andar throw hui errors NAHI pakadte (jaise upar wala \`onClick\`), \`async\` code ke andar jaise data-fetching effect ke \`.then\`/\`.catch\` mein, server-side rendering ke dauran, ya khud error boundary ke code se throw hui errors. Event-handler errors khaas taur par isliye excluded hain kyunki React ko unke liye toota render "recover" karne ki zarurat nahi — jab click handler chalta hai component abhi render ke beech mein nahi hota, isliye koi adhoori bani tree nahi hai jise fallback chahiye; handler ke andar hi ek aam \`try\`/\`catch\` iske bajaye wahan sahi auzaar hai.

## Do lifecycle methods, aur dono kyun maujood hain

\`\`\`jsx
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true };   // state update karo fallback UI trigger karne ke liye — rendering ke dauran chalta hai, side-effect-free rakho
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);   // error log/report karo — rendering ke BAAD chalta hai, side effects yahan honi chahiye
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
\`\`\`

\`getDerivedStateFromError\`, ek static method, "render" phase ke dauran bulaya jaata hai aur sirf naya state ganit karne ke liye hai (yahan, \`hasError\` ko \`true\` mein flip karna) jo tay karta hai fallback UI kaisa dikhna chahiye — isme logging ya network calls jaise side effects nahi hone chahiye, wahi niyam jo rendering ke dauran chalne wale kisi bhi code par lagu hota hai. \`componentDidCatch\`, ek instance method, alag "commit" phase ke dauran bulaya jaata hai, React ke fallback UI ko screen par pehle hi lagu karne ke baad, aur asli side effects ke liye sahi jagah hai: error ko ek error-tracking service mein log karna (Sentry aur waise hi tools, neeche aage cover hoga), analytics bhejna, ya koi bhi doosra kaam jo ek baar hona chahiye, asafalta ke jawaab mein, kya render hota hai use asar kiye bina.

## Boundaries ko alag-alag sections ke aas-paas rakhna, sirf app ke root par nahi

\`\`\`jsx
function Dashboard() {
  return (
    <div>
      <ErrorBoundary fallback={<WidgetError />}><RevenueChart /></ErrorBoundary>
      <ErrorBoundary fallback={<WidgetError />}><RecentOrders /></ErrorBoundary>
      <ErrorBoundary fallback={<WidgetError />}><ActivityFeed /></ErrorBoundary>
    </div>
  );
}
\`\`\`

Poore app ko lapetta ek akela error boundary kuch na hone se behtar hai — ye poori tarah khaali safed screen rokta hai — par ye phir bhi apne andar wale har section ko saath le doobta hai, kyunki poori lapeti hui subtree ek unit ki tarah unmount hoti hai jab uska koi bhi hissa throw karta hai. Har akele kaam ke section ke aas-paas ek ALAG boundary rakhna (yahan har dashboard widget) matlab ek section ki asafalta bilkul us section tak rokdi jaati hai, har doosra section poori tarah kaam karta chhodte hue — ye granularity faisla ek asli architectural nirnay hai, koi aisi cheez nahi jiska ek sarvbhaumik sahi jawaab ho, aur aam taur par is baat ki seemaon ka follow karta hai ki user page ka ek matlabi, alag-se-kaam-ka hissa kya maanega.

## Error boundaries aur error-tracking services

\`\`\`jsx
componentDidCatch(error, errorInfo) {
  Sentry.captureException(error, { extra: errorInfo });
}
\`\`\`

\`componentDidCatch\` ko asli error object aur React-khaas \`errorInfo\` milna (component stack sameet jo bilkul dikhaata hai kaunse component ne throw kiya) ise production apps mein error-tracking services ke liye standard integration point banata hai — ek aisi error ke bajaye jo chupchap UI ke ek section ko kharaab kar de bina kisi ko kabhi pata chale ki ye hua, \`componentDidCatch\` wo jagah hai jahan wo asafalta kahin report ho jaati hai jahan koi developer use asal mein dekhega, aur bilkul isi wajah se lagbhag har error-tracking service ka React integration bilkul isi pattern ke aas-paas bana ek taiyaar \`ErrorBoundary\` component deta hai.

## TypeScript: error boundary ki props, state, aur lifecycle methods ko type karna

\`\`\`tsx
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(error, errorInfo);
  }

  render(): React.ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
\`\`\`

\`React.Component<Props, State>\` khud generic hai (poore course mein cover hua wahi generic-type concept, yahan hook ke bajaye class-component base type par lagu) — \`ErrorBoundaryProps\` aur \`ErrorBoundaryState\` ko uske do type arguments ki tarah dena poori class body mein \`this.props\` aur \`this.state\` ko sahi type karta hai. \`React.ErrorInfo\` ek type hai jo React ke type definitions khaas taur par \`componentDidCatch\` ke doosre parameter ke liye bhejte hain, \`componentStack\` string rakhte hue jo bilkul dikhaata hai kaunse component ne throw kiya — ye modern React mein un bahut kam jagahon mein se ek hai jahan \`class\` syntax aur uske saath aati thodi alag typing conventions (generic base class, instance fields, koi Hook generics nahi) abhi bhi akela vikalp hain.`,

    examples: [
      {
        title: 'Broken: one crashing section takes down the entire page',
        titleHi: 'Toota: ek crash hota section poora page le doobta hai',
        code: `function RecommendedProducts({ products }) {
  return <ul>{products.map((p) => <li key={p.id}>{p.name} — \${p.price.toFixed(2)}</li>)}</ul>;
}
function ProductPage({ recommendations }) {
  return <div><Header /><RecommendedProducts products={recommendations} /><Footer /></div>;
}`,
        codeJs: `function RecommendedProducts({ products }) {
  return (
    <ul>
      {products.map((p) => <li key={p.id}>{p.name} — \${p.price.toFixed(2)}</li>)}
    </ul>
  );
}

function ProductPage({ product, recommendations }) {
  return (
    <div>
      <Header />
      <ProductDetails product={product} />
      <RecommendedProducts products={recommendations} />
      <Footer />
    </div>
  );
}

// If any product in "recommendations" is missing "price":
// recommendations = [{ id: "1", name: "Mouse" /* no price field */ }]`,
        codeTs: `interface Product {
  id: string;
  name: string;
  price: number;
}

function RecommendedProducts({ products }: { products: Product[] }) {
  return (
    <ul>
      {products.map((p) => <li key={p.id}>{p.name} — \${p.price.toFixed(2)}</li>)}
    </ul>
  );
}

function ProductPage({ product, recommendations }: { product: Product; recommendations: Product[] }) {
  return (
    <div>
      <Header />
      <ProductDetails product={product} />
      <RecommendedProducts products={recommendations} />
      <Footer />
    </div>
  );
}
// TypeScript's "Product" type would actually catch a MISSING price
// field at compile time if the object literally lacked it — this bug
// specifically models data arriving from an external API (a fetch
// response) at runtime, which TypeScript cannot verify matches the
// declared type without runtime validation.`,
        output: `A single product in "recommendations" missing its "price" field
throws "Cannot read properties of undefined (reading 'toFixed')" —
React unmounts the ENTIRE tree, and the user sees a completely blank
page: no Header, no ProductDetails, no working "Add to cart" button,
no Footer.`,
        explain: 'This is a realistic production scenario, not a contrived one — API responses missing an expected field due to partial outages, schema migrations, or upstream bugs are common, and nothing about ProductDetails or Header caused this failure at all.',
        explainHi: 'Ye ek haqeeqi production scenario hai, koi banaya hua nahi — API responses ka ek ummeed ki hui field missing hona partial outages, schema migrations, ya upstream bugs ki wajah se aam hai, aur ProductDetails ya Header ne is asafalta ka bilkul koi kaaran nahi banaya.',
      },
      {
        title: 'Fixed: an ErrorBoundary contains the crash to one section',
        titleHi: 'Theek: ErrorBoundary crash ko ek section tak rokta hai',
        code: `<ErrorBoundary fallback={<p>Recommendations unavailable.</p>}>
  <RecommendedProducts products={recommendations} />
</ErrorBoundary>`,
        codeJs: `class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function ProductPage({ product, recommendations }) {
  return (
    <div>
      <Header />
      <ProductDetails product={product} />
      <ErrorBoundary fallback={<p>Recommendations are unavailable right now.</p>}>
        <RecommendedProducts products={recommendations} />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}`,
        codeTs: `interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render(): React.ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function ProductPage({ product, recommendations }: { product: Product; recommendations: Product[] }) {
  return (
    <div>
      <Header />
      <ProductDetails product={product} />
      <ErrorBoundary fallback={<p>Recommendations are unavailable right now.</p>}>
        <RecommendedProducts products={recommendations} />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}`,
        outputJs: `The same bad "recommendations" data still crashes RecommendedProducts
— but ErrorBoundary catches it, renders "Recommendations are
unavailable right now." in that section's place, and Header,
ProductDetails, and Footer all continue rendering completely normally.
The user can still buy the product.`,
        outputTs: `// Identical behaviour. "React.Component<ErrorBoundaryProps,
// ErrorBoundaryState>" correctly types this.props.fallback as
// ReactNode and this.state.hasError as boolean throughout the class.`,
        explain: 'Nothing about RecommendedProducts or the bad data changed — the crash still genuinely happens — what changed is that its blast radius is now limited to exactly the section wrapped in ErrorBoundary.',
        explainHi: '\`RecommendedProducts\` ya kharaab data mein kuch nahi badla — crash abhi bhi sach mein hota hai — jo badla wo ye hai ki uska blast radius ab bilkul us section tak seemit hai jo \`ErrorBoundary\` mein lapeta gaya hai.',
      },
      {
        title: 'Placing separate boundaries around independent dashboard widgets',
        titleHi: 'Alag-alag dashboard widgets ke aas-paas alag boundaries rakhna',
        code: `<ErrorBoundary fallback={<WidgetError />}><RevenueChart /></ErrorBoundary>
<ErrorBoundary fallback={<WidgetError />}><RecentOrders /></ErrorBoundary>
<ErrorBoundary fallback={<WidgetError />}><ActivityFeed /></ErrorBoundary>`,
        codeJs: `function WidgetError() {
  return <p className="widget-error">This widget failed to load.</p>;
}

function Dashboard() {
  return (
    <div className="dashboard">
      <ErrorBoundary fallback={<WidgetError />}>
        <RevenueChart />
      </ErrorBoundary>
      <ErrorBoundary fallback={<WidgetError />}>
        <RecentOrders />
      </ErrorBoundary>
      <ErrorBoundary fallback={<WidgetError />}>
        <ActivityFeed />
      </ErrorBoundary>
    </div>
  );
}`,
        codeTs: `function WidgetError() {
  return <p className="widget-error">This widget failed to load.</p>;
}

function Dashboard() {
  return (
    <div className="dashboard">
      <ErrorBoundary fallback={<WidgetError />}>
        <RevenueChart />
      </ErrorBoundary>
      <ErrorBoundary fallback={<WidgetError />}>
        <RecentOrders />
      </ErrorBoundary>
      <ErrorBoundary fallback={<WidgetError />}>
        <ActivityFeed />
      </ErrorBoundary>
    </div>
  );
}`,
        outputJs: `If RevenueChart crashes, only its own boundary catches it and shows
"This widget failed to load." — RecentOrders and ActivityFeed, each
inside their OWN separate boundary, are completely unaffected and keep
working normally.`,
        outputTs: `// Identical behaviour and type safety — each ErrorBoundary usage is
// independently typed via the same ErrorBoundaryProps interface,
// requiring both "fallback" and "children" at every usage site.`,
        explain: 'A single boundary wrapping all three widgets together would have taken down RecentOrders and ActivityFeed along with RevenueChart — placing one boundary per independently-useful section is what limits the blast radius to exactly one widget.',
        explainHi: 'Teeno widgets ko saath lapetta ek akela boundary RecentOrders aur ActivityFeed ko RevenueChart ke saath le doobta — har alag-se-kaam-ke section ke liye ek boundary rakhna wahi cheez hai jo blast radius ko bilkul ek widget tak seemit karti hai.',
      },
    ],

    mistakes: [
      {
        wrong: `function ProductPage({ recommendations }) {
  return <div><Header /><RecommendedProducts products={recommendations} /><Footer /></div>;
}
// no error boundary — a crash anywhere takes down everything`,
        right: `function ProductPage({ recommendations }) {
  return (
    <div>
      <Header />
      <ErrorBoundary fallback={<p>Unavailable.</p>}>
        <RecommendedProducts products={recommendations} />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}`,
        why: 'React\'s default behavior on a render-time error is to unmount the entire tree starting from the nearest root — without a boundary, one broken section takes down every unrelated section along with it, even ones that rendered perfectly fine.',
        whyHi: 'Render-time error par React ka default behaviour poori tree ko sabse nazdeeki root se unmount karna hai — boundary ke bina, ek toota section har na-juda section ko apne saath le doobta hai, un sameet jo bilkul theek render hue the.',
      },
      {
        wrong: `function BrokenButton() {
  function handleClick() { throw new Error("Failed"); }
  return <ErrorBoundary fallback={<p>Error</p>}>
    <button onClick={handleClick}>Click</button>
  </ErrorBoundary>;
}
// expecting ErrorBoundary to catch this — it will not`,
        right: `function BrokenButton() {
  function handleClick() {
    try {
      riskyOperation();
    } catch (err) {
      console.error(err);   // handle it directly, inside the event handler
    }
  }
  return <button onClick={handleClick}>Click</button>;
}`,
        why: 'Error boundaries only catch errors thrown during rendering, not inside event handlers — an error thrown from an onClick handler happens outside of React\'s render process entirely, so no error boundary anywhere in the tree will catch it.',
        whyHi: 'Error boundaries sirf rendering ke dauran throw hui errors pakadte hain, event handlers ke andar nahi — \`onClick\` handler se throw hui error React ke render process se poori tarah bahar hoti hai, isliye tree mein kahin bhi koi error boundary ise nahi pakdega.',
      },
      {
        wrong: `<ErrorBoundary fallback={<PageError />}>
  <RevenueChart />
  <RecentOrders />
  <ActivityFeed />
</ErrorBoundary>
// one boundary wrapping three independent widgets`,
        right: `<ErrorBoundary fallback={<WidgetError />}><RevenueChart /></ErrorBoundary>
<ErrorBoundary fallback={<WidgetError />}><RecentOrders /></ErrorBoundary>
<ErrorBoundary fallback={<WidgetError />}><ActivityFeed /></ErrorBoundary>
// one boundary per independently-useful section`,
        why: 'A single boundary wrapping several independent sections together means any one section\'s crash takes down all of them as one unit, since the whole wrapped subtree unmounts together — defeating much of the containment benefit boundaries are meant to provide.',
        whyHi: 'Kai alag-alag sections ko saath lapetta ek akela boundary matlab kisi ek section ka crash sabko ek unit ki tarah le doobta hai, kyunki poori lapeti hui subtree saath unmount hoti hai — boundaries jo containment faayda dene ke liye maane jaate hain uska zyada hissa hara dete hue.',
      },
    ],

    realWorld: [
      {
        en: '**Error boundaries wrapping independent page sections are standard practice in nearly every production React app with more than a handful of components**, precisely because a single unhandled render error taking down an entire page is a genuinely common real incident shape that error boundaries directly prevent.',
        hi: '**Alag-alag page sections ko lapetne wale error boundaries lagbhag har production React app mein standard practice hain jinme mutthi bhar se zyada components hon**, bilkul isliye kyunki poore page ko le doobne wali ek akeli na-sambhaali render error ek sach mein aam asli incident shape hai jise error boundaries seedha rokti hain.',
      },
      {
        en: '**Nearly every major error-tracking service (Sentry, Bugsnag, Rollbar) ships a pre-built React error boundary component**, built around the exact `getDerivedStateFromError`/`componentDidCatch` pattern this lesson covers, specifically so teams do not need to write and maintain one by hand.',
        hi: '**Lagbhag har badi error-tracking service (Sentry, Bugsnag, Rollbar) ek pehle se bana React error boundary component bhejti hai**, bilkul isi \`getDerivedStateFromError\`/\`componentDidCatch\` pattern ke aas-paas bana jise ye lesson cover karta hai, khaas taur par isliye ki teams ko ise haath se likhna aur maintain nahi karna padta.',
      },
      {
        en: '**Error boundaries are one of the very few remaining places in modern React where writing a class component is genuinely required**, since Hooks have no equivalent for the getDerivedStateFromError/componentDidCatch lifecycle methods — most teams write or install exactly one ErrorBoundary class and never write a second class component anywhere else in the app.',
        hi: '**Error boundaries modern React mein un bahut kam bachi jagahon mein se ek hain jahan class component likhna sach mein zaruri hai**, kyunki Hooks ke paas \`getDerivedStateFromError\`/\`componentDidCatch\` lifecycle methods ka koi barabar nahi hai — zyadatar teams bilkul ek \`ErrorBoundary\` class likhti ya install karti hain aur app mein kahin aur doosri class component kabhi nahi likhtin.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does React unmount an entire component tree by default when one component throws during rendering, rather than just removing the one broken component?',
        qHi: 'Rendering ke dauran ek component ke throw karne par React default roop se poori component tree kyun unmount karta hai, sirf us ek toote component ko hataane ke bajaye?',
        a: 'When a component throws while rendering, React cannot know with confidence what the resulting UI should look like — the component tree at that point is in a genuinely inconsistent, partially-built state, since the throw interrupted the render before it could finish producing a complete description of what should appear on screen. Rather than risk displaying a corrupted or nonsensical partial UI (which could mislead a user or, in some cases, actively cause harm — e.g., showing an incomplete price or an inconsistent form state), React\'s default, conservative choice is to unmount the entire affected tree, on the reasoning that a completely blank result is safer than an unpredictable, partially-broken one. Error boundaries exist specifically to opt back into a more graceful outcome for a known section of the tree, replacing that uncertain partial state with an explicit, developer-chosen fallback instead of an unmount.',
        aHi: 'Jab koi component rendering ke dauran throw karta hai, React bharose ke saath nahi jaan sakta ki nateeja UI kaisa dikhna chahiye — us pal component tree sach mein asangat, adhoori bani state mein hai, kyunki throw ne render ko poora hone se pehle rok diya us se pehle wo screen par kya dikhna chahiye uska poora bayaan bana pata. Kharaab ya bemaani adhoori UI dikhaane ka khatra uthaane ke bajaye (jo user ko galat raah dikha sakti hai ya, kuch cases mein, asal mein nuksaan pahuncha sakti hai — jaise adhoori price ya asangat form state dikhaana), React ka default, conservative chunaav poori asar hui tree ko unmount karna hai, is soch par ki ek bilkul khaali nateeja ek anpredictable, aadhe-toote nateeje se surakshit hai. Error boundaries khaas taur par tree ke ek jaane-maane hisse ke liye ek zyada shaant nateeje mein wapas opt karne ke liye maujood hain, us anishchit adhoori state ki jagah ek explicit, developer-chuni fallback dete hue, unmount ke bajaye.',
      },
      {
        q: 'Why do error boundaries specifically NOT catch errors thrown inside event handlers, like an onClick handler?',
        qHi: 'Error boundaries khaas taur par event handlers ke andar throw hui errors kyun NAHI pakadte, jaise ek onClick handler?',
        a: 'Error boundaries work by catching failures that occur DURING the process of rendering — while React is actively building or updating the component tree — and substituting a fallback for the affected part of that tree. An event handler like onClick runs in response to a user action, entirely separately from any render in progress at that moment; the component is not mid-render when its click handler executes, so there is no partially-built tree that needs replacing with a fallback, and nothing about React\'s rendering process is actually interrupted by the throw. Because the mechanism error boundaries use is specifically tied to the rendering process, and an event handler executes outside of that process, there is no render-tree state for an error boundary to intervene on — a plain JavaScript try/catch inside the handler itself is the correct tool for handling errors in that context instead.',
        aHi: 'Error boundaries un asafaltaon ko pakadkar kaam karte hain jo RENDERING KE DAURAN hoti hain — jab React sakriya roop se component tree bana ya update kar raha hota hai — aur tree ke asar hue hisse ke liye ek fallback substitute karte hain. \`onClick\` jaisa event handler user ke kisi kaam ke jawaab mein chalta hai, us pal chal rahi kisi bhi render se poori tarah alag; jab uska click handler chalta hai component mid-render nahi hota, isliye koi adhoori bani tree nahi hai jise fallback se badalne ki zarurat ho, aur React ke rendering process ke baare mein throw se asal mein kuch bhi baadhit nahi hota. Chunki error boundaries jo mechanism use karte hain wo khaas taur par rendering process se juda hai, aur event handler us process se bahar chalta hai, error boundary ke intervene karne ke liye koi render-tree state hi nahi hai — handler ke andar hi ek saadha JavaScript try/catch us context mein errors sambhaalne ke liye sahi auzaar hai.',
      },
      {
        q: 'What is the practical difference between wrapping an entire app in one error boundary versus wrapping each independently-useful section in its own separate boundary?',
        qHi: 'Poore app ko ek error boundary mein lapetna versus har alag-se-kaam-ke section ko apne khud ke alag boundary mein lapetna, dono mein practical fark kya hai?',
        a: 'A single error boundary wrapping the entire app prevents the worst-case outcome (a completely blank white screen with no error boundary at all), but because the entire wrapped subtree unmounts together as one unit when any part of it throws, a failure anywhere in the app — even in one small, non-critical widget — still takes down the whole app\'s UI, replacing everything with the one fallback. Wrapping each independently-useful section (a dashboard widget, a sidebar, a recommendations panel) in its own separate boundary means a failure in any one section is contained to exactly that section — every other section, each protected by its own boundary, continues rendering and functioning normally, unaffected by a failure elsewhere. The tradeoff is added code (more boundary instances, more fallback UI to design) in exchange for meaningfully better fault isolation; the right granularity is a judgment call based on what a user would consider one coherent, independently-useful piece of the page.',
        aHi: 'Poore app ko lapetta ek akela error boundary sabse bure nateeje ko rokta hai (bilkul koi error boundary na hone par poori tarah khaali safed screen), par chunki poori lapeti hui subtree ek unit ki tarah saath unmount hoti hai jab uska koi bhi hissa throw karta hai, app mein kahin bhi ek asafalta — chhoti, gair-zaruri widget mein bhi — phir bhi poore app ke UI ko le doobti hai, sab kuch ek fallback se badalte hue. Har alag-se-kaam-ke section (ek dashboard widget, ek sidebar, ek recommendations panel) ko apne khud ke alag boundary mein lapetna matlab kisi ek section mein asafalta bilkul us section tak seemit hoti hai — har doosra section, apne khud ke boundary se surakshit, normal render aur kaam karta rehta hai, kahin aur hui asafalta se bekhabar. Tradeoff ye hai ki zyada code (zyada boundary instances, zyada fallback UI design karna) uske badle matlabi behtar fault isolation ke liye; sahi granularity ek nirnay hai is baat par ki user page ka ek sangat, alag-se-kaam-ka hissa kise maanega.',
      },
      {
        q: 'Why are error boundaries still required to be written as class components, unlike almost everything else in modern React?',
        qHi: 'Error boundaries abhi bhi class components ki tarah likhne kyun zaruri hain, modern React ki lagbhag har doosri cheez ke ulat?',
        a: 'Error boundaries rely specifically on two class-component lifecycle methods — the static `getDerivedStateFromError`, which computes fallback state during the render phase, and `componentDidCatch`, which handles side effects like logging during the commit phase — and as of this course\'s writing, there is no Hook providing equivalent functionality; no `useErrorBoundary` or similar hook exists in React\'s standard API. This is a genuine, specific gap rather than an oversight avoided elsewhere — nearly every other piece of class-component functionality (state, lifecycle-equivalent side effects via useEffect, and so on) has a direct Hook-based equivalent, but error-catching during rendering specifically has not been given one, making error boundaries one of the very few remaining places modern React code is expected to use class syntax at all.',
        aHi: 'Error boundaries khaas taur par do class-component lifecycle methods par bharosa karte hain — static \`getDerivedStateFromError\`, jo render phase ke dauran fallback state ganit karta hai, aur \`componentDidCatch\`, jo commit phase ke dauran logging jaisi side effects sambhaalta hai — aur is course ke likhe jaane tak, koi Hook barabar functionality nahi deta; React ke standard API mein koi \`useErrorBoundary\` ya waisa hi hook maujood nahi. Ye ek asli, khaas kami hai kisi bhoole hue jagah se bachi hui cheez ke bajaye — lagbhag har doosri class-component functionality (state, useEffect se lifecycle-barabar side effects, wagairah) ka ek seedha Hook-based barabar hai, par rendering ke dauran error pakadne ko khaas taur par koi diya hi nahi gaya, jo error boundaries ko un bahut kam bachi jagahon mein se ek banata hai jahan modern React code se class syntax use karne ki ummeed ki jaati hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken ProductPage with RecommendedProducts crashing on a product missing "price". Confirm the entire page — including Header and Footer, which have nothing to do with the crash — goes blank.',
        taskHi: 'Toota ProductPage banao jahan RecommendedProducts "price" missing wale product par crash hota hai. Confirm karo poora page — Header aur Footer sameet, jinka crash se koi lena-dena nahi — khaali ho jaata hai.',
        hint: 'Open the browser console to see the actual error React logs, and confirm nothing in Header or Footer\'s own code is responsible for it.',
        hintHi: 'Asli error dekhne ke liye browser console kholo jo React log karta hai, aur confirm karo Header ya Footer ke apne code mein kuch bhi iska kaaran nahi hai.',
      },
      {
        task: 'Build the ErrorBoundary class and wrap only RecommendedProducts in it. Confirm the same bad data now only degrades that section while Header, ProductDetails, and Footer keep working.',
        taskHi: 'ErrorBoundary class banao aur sirf RecommendedProducts ko usme lapeto. Confirm karo wahi kharaab data ab sirf us section ko kharaab karta hai jabki Header, ProductDetails, aur Footer kaam karte rehte hain.',
        hint: 'Add a console.log inside componentDidCatch and confirm it fires with the actual error object, simulating what a real error-tracking integration would receive.',
        hintHi: 'componentDidCatch ke andar ek console.log jodo aur confirm karo ye asli error object ke saath chalta hai, ek asli error-tracking integration ko kya milega uska simulation karte hue.',
      },
      {
        task: 'Build the Dashboard example with three widgets, each in its own ErrorBoundary. Make only RevenueChart crash and confirm RecentOrders and ActivityFeed remain fully functional, then repeat with a single shared boundary around all three and confirm the difference.',
        taskHi: 'Teen widgets wala Dashboard example banao, har ek apne khud ke ErrorBoundary mein. Sirf RevenueChart ko crash karao aur confirm karo RecentOrders aur ActivityFeed poori tarah kaam karte rehte hain, phir teeno ke aas-paas ek shared boundary ke saath dohraao aur fark confirm karo.',
        hint: 'Compare screenshots of both versions side by side after the same crash to make the containment difference immediately visible.',
        hintHi: 'Wahi crash ke baad dono versions ke screenshots saath-saath compare karo containment ka fark turant dikhne laayak banaane ke liye.',
      },
    ],

    keyTakeaways: [
      'React\'s default behavior when a component throws during rendering is to unmount the entire tree starting from the nearest root — an unrelated section\'s crash can take down a whole working page, not just the section that failed.',
      'An error boundary is a class component using `getDerivedStateFromError` (to compute fallback state during rendering) and `componentDidCatch` (to handle side effects like logging during the commit phase); wrapping a subtree in one contains a crash to exactly that subtree.',
      'Error boundaries only catch errors thrown during rendering — not inside event handlers, async code like fetch callbacks, or server-side rendering — those need an ordinary try/catch at the point where they occur instead.',
      'Placing a separate boundary around each independently-useful section, rather than one boundary around the whole app, limits a failure\'s blast radius to exactly that section instead of the entire wrapped subtree.',
      '`componentDidCatch` receiving the actual error and a component stack makes it the standard integration point for error-tracking services (Sentry and similar), most of which ship a pre-built ErrorBoundary component around this exact pattern.',
      'Error boundaries are one of the few remaining places modern React requires class syntax, since no Hook currently provides an equivalent to `getDerivedStateFromError`/`componentDidCatch`.',
    ],
    keyTakeawaysHi: [
      'Rendering ke dauran component ke throw karne par React ka default behaviour poori tree ko sabse nazdeeki root se unmount karna hai — ek na-jude section ka crash poore chalte page ko le doob sakta hai, sirf fail hue section ko nahi.',
      'Error boundary ek class component hai jo \`getDerivedStateFromError\` (rendering ke dauran fallback state ganit karne ke liye) aur \`componentDidCatch\` (commit phase ke dauran logging jaisi side effects sambhaalne ke liye) use karta hai; ek subtree ko usme lapetna crash ko bilkul us subtree tak rokta hai.',
      'Error boundaries sirf rendering ke dauran throw hui errors pakadte hain — event handlers, fetch callbacks jaise async code, ya server-side rendering ke andar nahi — unhe iske bajaye us jagah ek aam try/catch chahiye jahan wo hoti hain.',
      'Poore app ke aas-paas ek boundary rakhne ke bajaye har alag-se-kaam-ke section ke aas-paas ek alag boundary rakhna asafalta ke blast radius ko bilkul us section tak seemit karta hai, poori lapeti hui subtree tak nahi.',
      '\`componentDidCatch\` ko asli error aur component stack milna ise error-tracking services (Sentry aur waise hi) ke liye standard integration point banata hai, jinme se zyadatar bilkul isi pattern ke aas-paas bana ek taiyaar ErrorBoundary component bhejte hain.',
      'Error boundaries un kuch bachi jagahon mein se ek hain jahan modern React ko class syntax chahiye, kyunki abhi koi Hook \`getDerivedStateFromError\`/\`componentDidCatch\` ka barabar nahi deta.',
    ],
  },
];
