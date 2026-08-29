/**
 * React Complete Course — Module 4: Hooks & Performance, lesson 1.
 *
 * useMemo and useCallback: when they genuinely matter, and when they are
 * pointless overhead. Two broken examples in one lesson, deliberately: (1) an
 * expensive computation re-running on every render, including renders caused
 * by completely unrelated state, fixed by useMemo; (2) a new inline function
 * passed to a React.memo'd child on every render, silently defeating the
 * memoization, fixed by useCallback. The lesson explicitly pushes back
 * against "wrap everything in useMemo" as a default habit.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there (\'). Run `npx tsc --noEmit -p .`
 * after writing this file, before wiring it into seed.ts.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_4: CourseLesson[] = [
  {
    slug: 'usememo-usecallback-when-they-matter',
    title: 'useMemo and useCallback: When They Matter, and When They Don\'t',
    titleHi: 'useMemo Aur useCallback: Kab Matter Karte Hain, Aur Kab Nahi',
    description: 'Toggling dark mode — nothing to do with the giant product list — makes the whole page freeze for a second.',
    descriptionHi: 'Dark mode toggle karna — jiska product ki badi list se koi lena-dena nahi — poore page ko ek second ke liye jaam kar deta hai.',
    difficulty: 'HARD',
    duration: 28,
    order: 1,

    analogy: {
      en: '**Re-cooking an entire meal from scratch because someone changed the tablecloth.** A component that recalculates an expensive result on every render, regardless of whether the inputs to that calculation actually changed, is like a chef who re-cooks the entire seven-course meal from raw ingredients every single time anything happens in the restaurant — a new tablecloth gets laid, someone asks for a water refill, a completely unrelated table places an order. `useMemo` is the chef writing down "if the order ticket is unchanged, just re-plate what I already cooked" — the meal only gets remade when the actual order changes, not on every unrelated event in the building. But hiring a second chef whose entire job is deciding whether to re-cook a dish that takes four seconds to make anyway is not a saving — it is its own overhead, which is exactly why `useMemo` is not a "just add it everywhere" tool: it is worth the cost of checking only when what it is protecting is genuinely expensive to redo.',
      hi: '**Poora khaana shuru se dobara pakaana kyunki kisi ne tablecloth badal di.** Aisa component jo har render par ek mehnga nateeja dobara ganit karta hai, chahe us ganit ke inputs asal mein badle ho ya na ho, aisa hai jaise ek chef poora saat-course khaana kacche saaman se har baar dobara pakaaye jab bhi restaurant mein kuch bhi ho — nayi tablecloth lagti hai, koi paani refill maangta hai, ek bilkul na-juda table order deta hai. \`useMemo\` chef ka likh lena hai "agar order ticket wahi hai, to bas jo maine pehle pakaaya hai wahi phir se plate karo" — khaana sirf tab dobara banta hai jab asli order badle, building mein har na-jude event par nahi. Par ek doosra chef rakhna jiska poora kaam ye tay karna hai ki wo dish dobara pakaani hai ya nahi jo waise bhi chaar second mein ban jaati hai, koi bachat nahi hai — ye khud apna overhead hai, aur bilkul isi wajah se \`useMemo\` "bas har jagah jod do" wala auzaar nahi hai: check karne ki keemat sirf tab uthaane layak hai jab jo wo bacha raha hai wo sach mein dobara karna mehnga ho.',
    },

    simple: `**Start broken.** A product list with client-side sorting, next to an unrelated dark-mode toggle:

\`\`\`jsx
function ProductList({ products, sortBy, isDarkMode, toggleDarkMode }) {
  const sortedProducts = expensiveSort(products, sortBy);   // recalculated on EVERY render

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <button onClick={toggleDarkMode}>Toggle theme</button>
      <ul>
        {sortedProducts.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

With a genuinely large \`products\` array (say, ten thousand items) and a non-trivial \`expensiveSort\`, clicking "Toggle theme" — which has nothing whatsoever to do with sorting — makes the whole page visibly freeze for a moment. \`expensiveSort(products, sortBy)\` runs as a plain function call directly inside the component body, so it re-executes on literally every render of \`ProductList\`, for any reason at all — including the render caused by \`toggleDarkMode\` flipping \`isDarkMode\`, a piece of state the sort does not even use. The sort result would be byte-for-byte identical to what it was a moment ago (neither \`products\` nor \`sortBy\` changed), but the component recomputes it from scratch anyway, every single time, because nothing tells it that recomputation was unnecessary.

**The fix: \`useMemo\` skips the recalculation when its dependencies have not changed**

\`\`\`jsx
function ProductList({ products, sortBy, isDarkMode, toggleDarkMode }) {
  const sortedProducts = useMemo(() => {
    return expensiveSort(products, sortBy);
  }, [products, sortBy]);   // only recompute when products or sortBy actually change

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <button onClick={toggleDarkMode}>Toggle theme</button>
      <ul>
        {sortedProducts.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

\`\`\`tsx
interface Product {
  id: string;
  name: string;
}

function ProductList({
  products,
  sortBy,
  isDarkMode,
  toggleDarkMode,
}: {
  products: Product[];
  sortBy: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const sortedProducts = useMemo<Product[]>(() => {
    return expensiveSort(products, sortBy);
  }, [products, sortBy]);

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <button onClick={toggleDarkMode}>Toggle theme</button>
      <ul>
        {sortedProducts.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

\`useMemo\`\'s dependency array works exactly like \`useEffect\`\'s — React compares each listed dependency (\`products\`, \`sortBy\`) to its value from the previous render, using the same reference-equality check covered in the \`useState\` lesson. If neither changed, React skips calling the function entirely and simply hands back the SAME result object it computed and cached last time; only when \`products\` or \`sortBy\` genuinely differ does the expensive sort actually run again. Clicking "Toggle theme" now re-renders \`ProductList\` (because \`isDarkMode\` changed), but \`useMemo\` recognizes neither of its own dependencies moved, so \`expensiveSort\` is skipped, and the freeze disappears.

**Why \`useMemo\` is not something to wrap around everything:** the memoization itself has a real, if usually small, cost — React must store the previous dependency values and result, and compare them on every render. For a genuinely cheap calculation (adding two numbers, formatting a short string), that comparison overhead can be larger than just redoing the calculation would have been — \`useMemo\` is a tool for expensive work with dependencies that do not always change, not a blanket performance habit to apply reflexively to every value a component computes.`,

    simpleHi: `**Toote hue se shuru.** Ek product list client-side sorting ke saath, ek na-jude dark-mode toggle ke bagal mein:

\`\`\`jsx
function ProductList({ products, sortBy, isDarkMode, toggleDarkMode }) {
  const sortedProducts = expensiveSort(products, sortBy);   // HAR render par dobara ganit hota hai

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <button onClick={toggleDarkMode}>Toggle theme</button>
      <ul>
        {sortedProducts.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

Ek sach mein badi \`products\` array (maano, das hazaar items) aur ek behtareen mehnge \`expensiveSort\` ke saath, "Toggle theme" click karna — jiska sorting se koi lena-dena hi nahi — poore page ko ek pal ke liye dikhta hua jaam kar deta hai. \`expensiveSort(products, sortBy)\` component body ke andar seedha ek saadhe function call ki tarah chalta hai, isliye ye \`ProductList\` ki literally har render par dobara chalta hai, kisi bhi wajah se — us render sameet jo \`toggleDarkMode\` se \`isDarkMode\` badalne se hui, ek state ka tukda jise sort istemal bhi nahi karta. Sort ka nateeja byte-for-byte wahi hoga jo pal bhar pehle tha (na \`products\` badla na \`sortBy\`), par component use waise bhi shuru se dobara ganit karta hai, har akeli baar, kyunki kuch bhi ise nahi batata ki wo dobara ganit karna zaruri hi nahi tha.

**Fix: \`useMemo\` dobara ganit karna chhod deta hai jab uski dependencies badli hi na hon**

\`\`\`jsx
function ProductList({ products, sortBy, isDarkMode, toggleDarkMode }) {
  const sortedProducts = useMemo(() => {
    return expensiveSort(products, sortBy);
  }, [products, sortBy]);   // sirf tab dobara ganit karo jab products ya sortBy asal mein badle

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <button onClick={toggleDarkMode}>Toggle theme</button>
      <ul>
        {sortedProducts.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

\`\`\`tsx
interface Product {
  id: string;
  name: string;
}

function ProductList({
  products,
  sortBy,
  isDarkMode,
  toggleDarkMode,
}: {
  products: Product[];
  sortBy: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const sortedProducts = useMemo<Product[]>(() => {
    return expensiveSort(products, sortBy);
  }, [products, sortBy]);

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <button onClick={toggleDarkMode}>Toggle theme</button>
      <ul>
        {sortedProducts.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

\`useMemo\` ki dependency array bilkul \`useEffect\` jaisi kaam karti hai — React har list ki hui dependency (\`products\`, \`sortBy\`) ko pichli render ki value se compare karta hai, wahi reference-equality check use karte hue jo \`useState\` lesson mein cover hua. Agar dono mein se koi nahi badla, React function bulaana poori tarah chhod deta hai aur bas WAHI result object wapas thamaata hai jo usne pichli baar ganit karke cache kiya tha; sirf tab jab \`products\` ya \`sortBy\` sach mein alag hon mehnga sort asal mein dobara chalta hai. "Toggle theme" click karna ab \`ProductList\` ko re-render karta hai (kyunki \`isDarkMode\` badla), par \`useMemo\` pehchaanta hai ki uski apni koi bhi dependency nahi hili, isliye \`expensiveSort\` skip ho jaata hai, aur jaam gayab ho jaata hai.

**\`useMemo\` ko har jagah lapetna kyun theek nahi hai:** memoization ki khud ek asli, aksar chhoti hi sahi, keemat hai — React ko pichli dependency values aur nateeja store karna padta hai, aur har render par unhe compare karna padta hai. Ek sach mein sasti ganit (do numbers jodna, chhota string format karna) ke liye, wo comparison overhead khud ganit dobara karne se bhi zyada ho sakta hai — \`useMemo\` mehnge kaam ke liye ek auzaar hai jiski dependencies hamesha nahi badalti, koi general performance aadat nahi jo har us value par lagu ki jaaye jo component ganit karta hai.`,

    content: `## \`useCallback\`: memoizing a function itself, not its result

\`\`\`jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);   // the SAME function reference across every render, since it has no dependencies

  return <ExpensiveChild onClick={handleClick} />;
}
\`\`\`

\`useMemo\` caches a *value* — the result of calling a function. \`useCallback\` caches the *function itself* — \`useCallback(fn, deps)\` is functionally equivalent to \`useMemo(() => fn, deps)\`, just written more directly for the common case of wanting a stable function reference. Without \`useCallback\`, an inline arrow function like \`() => console.log("clicked")\` written directly in JSX or a component body is a brand NEW function object on every single render — even though it does the exact same thing every time, it is never \`===\` to the previous render\'s version, because functions are objects, and two structurally identical functions are still two different objects in memory (JS course\'s objects/references lesson).

## The specific problem \`useCallback\` solves: defeating \`React.memo\`

\`\`\`jsx
const ExpensiveChild = React.memo(function ExpensiveChild({ onClick }) {
  console.log("ExpensiveChild rendering");
  // ... imagine genuinely expensive rendering work here
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // BROKEN: a new function every render defeats React.memo entirely
  return <ExpensiveChild onClick={() => console.log("clicked")} />;
}
\`\`\`

\`React.memo\` wraps a component so React skips re-rendering it when its props are all \`===\` to their previous values — a genuine, useful optimization for a component whose own rendering work is expensive. But if a parent passes a brand-new inline function as one of those props on every render, that prop is NEVER \`===\` to its previous value, so \`React.memo\`\'s comparison always finds a difference and re-renders the child anyway — completely defeating the memoization, silently, with no error or warning. This is the actual scenario where \`useCallback\` matters: wrapping the function passed to \`onClick\` in \`useCallback(fn, [])\` makes it the SAME reference across renders (as long as its dependencies do not change), so \`React.memo\`\'s comparison correctly finds no difference and skips re-rendering \`ExpensiveChild\`.

## Why \`useCallback\` alone, without \`React.memo\`, usually does nothing useful

\`\`\`jsx
// Pointless: OrdinaryChild is not memoized, so it re-renders on every
// Parent render regardless of whether onClick's reference is stable
function OrdinaryChild({ onClick }) {
  return <button onClick={onClick}>Click</button>;
}

function Parent() {
  const handleClick = useCallback(() => console.log("clicked"), []);   // wasted effort here
  return <OrdinaryChild onClick={handleClick} />;
}
\`\`\`

\`useCallback\` only pays off when the stable function reference is actually being *used* by something that checks reference equality to decide whether to skip work — \`React.memo\` on the receiving child being the most common case, a \`useEffect\`/\`useMemo\` dependency array being another. A plain, non-memoized child component re-renders whenever its parent re-renders regardless of whether its props\' references changed, so wrapping a function passed to it in \`useCallback\` adds the same small per-render bookkeeping cost as \`useMemo\` does, for zero actual benefit — the child was always going to re-render either way.

## Deciding when memoization is actually worth it

\`\`\`jsx
// Worth it: genuinely expensive computation, dependencies that do not
// change on every render
const sorted = useMemo(() => expensiveSort(hugeArray, sortKey), [hugeArray, sortKey]);

// NOT worth it: trivial computation
const doubled = useMemo(() => count * 2, [count]);   // just write "const doubled = count * 2;"

// Worth it: function passed to a React.memo'd child, or listed as another hook's dependency
const stableHandler = useCallback(() => doSomething(id), [id]);

// NOT worth it: function used only locally, or passed to a non-memoized child
const handleClick = useCallback(() => setOpen(true), []);   // just write a plain function
\`\`\`

The decision is not "always" or "never" — it is specifically about whether the value being memoized is expensive enough that skipping its recalculation is worth the bookkeeping cost, and, for \`useCallback\` in particular, whether the stable reference is actually consumed by something that cares about reference equality. Reaching for either hook by default, on every value or function a component creates, is a well-known anti-pattern in the React community precisely because it adds real overhead in the overwhelmingly common case where nothing was actually slow to begin with.

## TypeScript: typing \`useMemo\` and \`useCallback\`

\`\`\`tsx
const sortedProducts = useMemo<Product[]>(() => {
  return expensiveSort(products, sortBy);
}, [products, sortBy]);

const handleClick = useCallback<() => void>(() => {
  console.log("clicked");
}, []);
\`\`\`

Both hooks are generic, the same way \`useState<T>\` is — \`useMemo<T>\` fixes the type of the memoized value, and \`useCallback<T>\` fixes the type of the memoized function (\`T\` here being a function type, like \`() => void\` or \`(id: string) => void\`). In practice, both are usually inferred correctly from the function passed in without needing an explicit type argument, the same way \`useState\` usually is — the explicit annotation becomes useful mainly when the inferred type would otherwise be broader or narrower than actually intended.`,

    contentHi: `## \`useCallback\`: khud ek function ko memoize karna, uska nateeja nahi

\`\`\`jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);   // har render ke aar-paar WAHI function reference, kyunki iski koi dependency nahi

  return <ExpensiveChild onClick={handleClick} />;
}
\`\`\`

\`useMemo\` ek *value* cache karta hai — kisi function ko bulaane ka nateeja. \`useCallback\` *khud function* ko cache karta hai — \`useCallback(fn, deps)\` \`useMemo(() => fn, deps)\` ke barabar kaam karta hai, bas ek stable function reference chahne ke aam case ke liye zyada seedhe tarike se likha gaya. \`useCallback\` ke bina, JSX ya component body mein seedha likha ek inline arrow function jaisa \`() => console.log("clicked")\` har akeli render par ek bilkul NAYA function object hai — chahe wo har baar bilkul wahi kaam kare, ye kabhi bhi pichli render ke version ke \`===\` nahi hai, kyunki functions objects hain, aur do structurally ekjaisa dikhte functions phir bhi memory mein do alag objects hain (JS course ka objects/references lesson).

## Wo khaas samasya jo \`useCallback\` hal karta hai: \`React.memo\` ko haraana

\`\`\`jsx
const ExpensiveChild = React.memo(function ExpensiveChild({ onClick }) {
  console.log("ExpensiveChild rendering");
  // ... yahan sach mein mehnga rendering kaam socho
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // TOOTA: har render mein naya function React.memo ko poori tarah haraata hai
  return <ExpensiveChild onClick={() => console.log("clicked")} />;
}
\`\`\`

\`React.memo\` ek component ko lapetta hai taaki React use dobara render karna chhod de jab uske saare props apni pichli values se \`===\` hon — ek asli, kaam ka optimization aise component ke liye jiska apna rendering kaam mehnga hai. Par agar parent har render par un props mein se ek ki tarah ek bilkul naya inline function pass karta hai, wo prop kabhi apni pichli value se \`===\` NAHI hota, isliye \`React.memo\` ka comparison hamesha fark paata hai aur child ko waise bhi dobara render karta hai — memoization ko poori tarah haraate hue, chupchap, bina kisi error ya warning ke. Yahi wo asli scenario hai jahan \`useCallback\` matter karta hai: \`onClick\` ko pass hue function ko \`useCallback(fn, [])\` mein lapetna use renders ke aar-paar WAHI reference banaata hai (jab tak uski dependencies badle nahi), isliye \`React.memo\` ka comparison sahi tarike se koi fark nahi paata aur \`ExpensiveChild\` ko dobara render karna chhod deta hai.

## \`useCallback\` akele, \`React.memo\` ke bina, aksar kaam ka kuch kyun nahi karta

\`\`\`jsx
// Bekaar: OrdinaryChild memoized nahi hai, isliye ye har Parent render
// par dobara render hota hai chahe onClick ka reference stable ho ya na ho
function OrdinaryChild({ onClick }) {
  return <button onClick={onClick}>Click</button>;
}

function Parent() {
  const handleClick = useCallback(() => console.log("clicked"), []);   // yahan bekaar mehnat
  return <OrdinaryChild onClick={handleClick} />;
}
\`\`\`

\`useCallback\` sirf tab kaam deta hai jab stable function reference asal mein kisi aisi cheez dwara *use* ho rahi ho jo reference equality check karke ye tay karti hai ki kaam chhoda jaaye ya nahi — pakadne wale child par \`React.memo\` sabse aam case hai, \`useEffect\`/\`useMemo\` dependency array doosra. Ek saadha, non-memoized child component apne parent ke re-render hote hi dobara render hota hai chahe uske props ke references badle ho ya na ho, isliye usme pass hue function ko \`useCallback\` mein lapetna wahi chhota per-render bookkeeping kharcha jodta hai jo \`useMemo\` jodta hai, bina kisi asli faayde ke — child hamesha waise bhi dobara render hone hi wala tha.

## Ye tay karna ki memoization asal mein kaam ki hai ya nahi

\`\`\`jsx
// Kaam ki: sach mein mehnga ganit, dependencies jo har render par nahi badalti
const sorted = useMemo(() => expensiveSort(hugeArray, sortKey), [hugeArray, sortKey]);

// KAAM KI NAHI: mamuli ganit
const doubled = useMemo(() => count * 2, [count]);   // bas "const doubled = count * 2;" likho

// Kaam ki: React.memo'd child ko pass hua function, ya kisi doosre hook ki dependency ki tarah listed
const stableHandler = useCallback(() => doSomething(id), [id]);

// KAAM KI NAHI: function jo sirf local use hota hai, ya non-memoized child ko pass hota hai
const handleClick = useCallback(() => setOpen(true), []);   // bas ek saadha function likho
\`\`\`

Faisla "hamesha" ya "kabhi nahi" ka nahi hai — ye khaas taur par is baare mein hai ki jo value memoize ho rahi hai kya wo itni mehnga hai ki uski dobara ganit chhodna bookkeeping kharche ke laayak hai, aur, \`useCallback\` ke liye khaas taur par, kya stable reference asal mein kisi aisi cheez dwara consume ho rahi hai jo reference equality ki parwaah karti hai. Kisi bhi hook ko default roop se, component ke banaaye har value ya function par uthaana React community mein ek jaana-maana anti-pattern hai bilkul isliye kyunki ye us behad aam case mein asli overhead jodta hai jahan asal mein shuru se kuch dheema tha hi nahi.

## TypeScript: \`useMemo\` aur \`useCallback\` ko type karna

\`\`\`tsx
const sortedProducts = useMemo<Product[]>(() => {
  return expensiveSort(products, sortBy);
}, [products, sortBy]);

const handleClick = useCallback<() => void>(() => {
  console.log("clicked");
}, []);
\`\`\`

Dono hooks generic hain, bilkul jaise \`useState<T>\` hai — \`useMemo<T>\` memoized value ka type tay karta hai, aur \`useCallback<T>\` memoized function ka type tay karta hai (\`T\` yahan ek function type hai, jaise \`() => void\` ya \`(id: string) => void\`). Amal mein, dono aksar seedha pass hue function se sahi infer ho jaate hain bina explicit type argument ki zarurat ke, bilkul jaise \`useState\` aksar hota hai — explicit annotation mukhya taur par tab kaam ki banti hai jab infer hua type warna asal maqsad se zyada bhaari ya sankra hota.`,

    examples: [
      {
        title: 'Broken: an expensive sort re-runs on every unrelated render',
        titleHi: 'Toota: mehnga sort har na-judi render par dobara chalta hai',
        code: `function ProductList({ products, sortBy, isDarkMode, toggleDarkMode }) {
  const sortedProducts = expensiveSort(products, sortBy);
  return <div className={isDarkMode ? "dark" : "light"}>
    <button onClick={toggleDarkMode}>Toggle theme</button>
    <ul>{sortedProducts.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
  </div>;
}`,
        codeJs: `function ProductList({ products, sortBy, isDarkMode, toggleDarkMode }) {
  const sortedProducts = expensiveSort(products, sortBy);

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <button onClick={toggleDarkMode}>Toggle theme</button>
      <ul>
        {sortedProducts.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}`,
        codeTs: `interface Product {
  id: string;
  name: string;
}

function ProductList({
  products,
  sortBy,
  isDarkMode,
  toggleDarkMode,
}: {
  products: Product[];
  sortBy: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const sortedProducts = expensiveSort(products, sortBy);

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <button onClick={toggleDarkMode}>Toggle theme</button>
      <ul>
        {sortedProducts.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
// TypeScript does not catch this — calling expensiveSort directly is
// perfectly valid. This is a performance bug, not a type error.`,
        output: `With a 10,000-item products array, clicking "Toggle theme" causes a
visible freeze (measurable in React DevTools' Profiler as a long
render for ProductList) — even though isDarkMode has nothing to do
with sorting, expensiveSort still runs in full on that render.`,
        explain: 'The bug is invisible in normal-sized test data — a 10-item array sorts instantly regardless of whether it is memoized — which is exactly why this class of bug tends to surface only once real production data volume is reached.',
        explainHi: 'Bug normal-size test data mein adrishya hai — 10-item array turant sort hoti hai chahe wo memoized ho ya na ho — aur bilkul isi wajah se ye kism ka bug aksar sirf tab saamne aata hai jab asli production data volume tak pahunchte hain.',
      },
      {
        title: 'Fixed: useMemo skips the sort when its deps are unchanged',
        titleHi: 'Theek: dependencies na badalne par useMemo sort skip karta hai',
        code: `const sortedProducts = useMemo(() => {
  return expensiveSort(products, sortBy);
}, [products, sortBy]);`,
        codeJs: `function ProductList({ products, sortBy, isDarkMode, toggleDarkMode }) {
  const sortedProducts = useMemo(() => {
    return expensiveSort(products, sortBy);
  }, [products, sortBy]);

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <button onClick={toggleDarkMode}>Toggle theme</button>
      <ul>
        {sortedProducts.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}`,
        codeTs: `interface Product {
  id: string;
  name: string;
}

function ProductList({
  products,
  sortBy,
  isDarkMode,
  toggleDarkMode,
}: {
  products: Product[];
  sortBy: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const sortedProducts = useMemo<Product[]>(() => {
    return expensiveSort(products, sortBy);
  }, [products, sortBy]);

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <button onClick={toggleDarkMode}>Toggle theme</button>
      <ul>
        {sortedProducts.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}`,
        outputJs: `Same 10,000-item products array: clicking "Toggle theme" now re-renders
instantly, no freeze — useMemo recognizes that neither "products" nor
"sortBy" changed and hands back the cached sortedProducts array without
calling expensiveSort again.`,
        outputTs: `// Identical behaviour. "useMemo<Product[]>" isn't strictly necessary
// here since TypeScript infers Product[] from expensiveSort's return
// type, but makes the intended type explicit.`,
        explain: 'Sorting still runs in full the FIRST time, and again whenever products or sortBy genuinely change — useMemo does not make the sort itself faster, it only avoids repeating unnecessary identical work.',
        explainHi: 'Sort PEHLI baar poori tarah chalta hai, aur phir dobara jab bhi products ya sortBy sach mein badlein — useMemo sort ko khud tez nahi banaata, ye sirf bekaar ekjaisa kaam dohraane se bachaata hai.',
      },
      {
        title: 'Broken: a new inline function defeats React.memo',
        titleHi: 'Toota: naya inline function React.memo ko haraata hai',
        code: `const ExpensiveChild = React.memo(function ExpensiveChild({ onClick }) {
  return <button onClick={onClick}>Click</button>;
});
function Parent() {
  return <ExpensiveChild onClick={() => console.log("clicked")} />;
}`,
        codeJs: `const ExpensiveChild = React.memo(function ExpensiveChild({ onClick }) {
  console.log("ExpensiveChild rendering");
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild onClick={() => console.log("clicked")} />
    </div>
  );
}`,
        codeTs: `interface ExpensiveChildProps {
  onClick: () => void;
}

const ExpensiveChild = React.memo(function ExpensiveChild({ onClick }: ExpensiveChildProps) {
  console.log("ExpensiveChild rendering");
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild onClick={() => console.log("clicked")} />
    </div>
  );
}
// TypeScript does not catch this — an inline arrow function is a
// perfectly valid "() => void". This is a memoization bug, not a
// type error.`,
        output: `Clicking "Count: 0" logs "ExpensiveChild rendering" AGAIN, even though
React.memo was supposed to skip re-rendering ExpensiveChild when its
props are unchanged — because the inline "() => console.log(...)" is a
brand new function object every render, onClick is never === to its
previous value, so React.memo's comparison always finds a "change".`,
        explain: 'React.memo is not broken here — it is working exactly as designed, correctly detecting that onClick genuinely IS a different value (a different function object) on every render, even though the function\'s behavior never changes.',
        explainHi: 'React.memo yahan toota nahi hai — ye bilkul jaise design hua waisa hi kaam kar raha hai, sahi tarike se pehchaante hue ki \`onClick\` har render par sach mein ek ALAG value hai (ek alag function object), chahe function ka behaviour kabhi na badle.',
      },
      {
        title: 'Fixed: useCallback keeps the function reference stable',
        titleHi: 'Theek: useCallback function reference ko stable rakhta hai',
        code: `function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => console.log("clicked"), []);
  return <ExpensiveChild onClick={handleClick} />;
}`,
        codeJs: `const ExpensiveChild = React.memo(function ExpensiveChild({ onClick }) {
  console.log("ExpensiveChild rendering");
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild onClick={handleClick} />
    </div>
  );
}`,
        codeTs: `interface ExpensiveChildProps {
  onClick: () => void;
}

const ExpensiveChild = React.memo(function ExpensiveChild({ onClick }: ExpensiveChildProps) {
  console.log("ExpensiveChild rendering");
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback((): void => {
    console.log("clicked");
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild onClick={handleClick} />
    </div>
  );
}`,
        outputJs: `Clicking "Count: 0" no longer logs "ExpensiveChild rendering" — handleClick
is the SAME function reference across every Parent render (empty deps
array, nothing it depends on ever changes), so React.memo correctly
finds onClick unchanged and skips re-rendering ExpensiveChild.`,
        outputTs: `// Identical behaviour. "ExpensiveChildProps" documents that onClick
// must be a "() => void" — passing something with a different
// signature (like a function expecting an argument) would be a
// compile-time error.`,
        explain: 'This example is specifically why useCallback exists — without ExpensiveChild being wrapped in React.memo, wrapping handleClick in useCallback here would add bookkeeping cost for no benefit at all, since a non-memoized child re-renders regardless.',
        explainHi: 'Ye example bilkul isliye hai ki \`useCallback\` kyun maujood hai — agar ExpensiveChild \`React.memo\` mein lapeta na hota, yahan \`handleClick\` ko \`useCallback\` mein lapetna bina kisi faayde ke bookkeeping kharcha jodta, kyunki non-memoized child waise bhi dobara render hota.',
      },
    ],

    mistakes: [
      {
        wrong: `function ProductList({ products, sortBy, isDarkMode }) {
  const sorted = expensiveSort(products, sortBy);   // re-runs on EVERY render
  return <div className={isDarkMode ? "dark" : "light"}>...</div>;
}`,
        right: `function ProductList({ products, sortBy, isDarkMode }) {
  const sorted = useMemo(() => expensiveSort(products, sortBy), [products, sortBy]);
  return <div className={isDarkMode ? "dark" : "light"}>...</div>;
}`,
        why: 'A calculation written directly in the component body re-runs on every single render, for any reason at all, including renders caused by state that has nothing to do with the calculation\'s actual inputs.',
        whyHi: 'Component body mein seedha likhi ganit har akeli render par dobara chalti hai, kisi bhi wajah se, us render sameet jo aisi state se hui jiska ganit ke asli inputs se koi lena-dena hi nahi.',
      },
      {
        wrong: `const ExpensiveChild = React.memo(function ExpensiveChild({ onClick }) { ... });
<ExpensiveChild onClick={() => doSomething()} />
// a NEW function every render defeats React.memo`,
        right: `const handleClick = useCallback(() => doSomething(), []);
<ExpensiveChild onClick={handleClick} />`,
        why: 'React.memo skips re-rendering only when every prop is === to its previous value — an inline function creates a new function object on every render, so it never equals the previous render\'s function, and React.memo\'s comparison always detects a "change".',
        whyHi: 'React.memo dobara render karna sirf tab chhodta hai jab har prop apni pichli value se \`===\` ho — inline function har render par ek naya function object banaata hai, isliye ye kabhi pichli render ke function ke barabar nahi hota, aur React.memo ka comparison hamesha "badlaav" pakadta hai.',
      },
      {
        wrong: `const doubled = useMemo(() => count * 2, [count]);   // trivial calculation
const handleClick = useCallback(() => setOpen(true), []);   // passed to a NON-memoized child`,
        right: `const doubled = count * 2;   // just compute it directly
const handleClick = () => setOpen(true);   // plain function is fine here`,
        why: 'Both hooks have their own small bookkeeping cost (storing previous dependencies and comparing them every render) — applied to a trivial calculation, or a function that is not consumed by React.memo or a hook\'s dependency array, that cost is pure overhead with no offsetting benefit.',
        whyHi: 'Dono hooks ki apni chhoti bookkeeping keemat hai (pichli dependencies store karna aur har render unhe compare karna) — ek mamuli ganit par, ya aise function par jo \`React.memo\` ya kisi hook ki dependency array dwara consume nahi hota, wo keemat bina kisi barabar faayde ke khaali overhead hai.',
      },
    ],

    realWorld: [
      {
        en: '**"Just wrap everything in useMemo/useCallback" is a widely documented anti-pattern in the React community, and the official React docs themselves explicitly caution against reaching for memoization before measuring an actual performance problem** — the correct workflow is profiling first, then memoizing the specific bottleneck found, not applying it reflexively.',
        hi: '**"Bas sab kuch useMemo/useCallback mein lapet do" React community mein achhi tarah documented anti-pattern hai, aur asli React docs khud explicitly aagaah karte hain kisi asli performance samasya ko naapne se pehle memoization uthaane ke khilaaf** — sahi workflow pehle profile karna hai, phir mili khaas rukaawat ko memoize karna, bina soche-samjhe lagu karna nahi.',
      },
      {
        en: '**React Compiler (formerly "React Forget"), an official React team project, is specifically designed to automatically insert memoization like useMemo and useCallback where genuinely beneficial** — a strong signal from the React team itself that hand-placing these hooks correctly is hard enough to be worth automating.',
        hi: '**React Compiler (pehle "React Forget"), ek official React team project, khaas taur par isliye banaya gaya hai ki jahan sach mein faayda ho wahan apne aap \`useMemo\` aur \`useCallback\` jaisi memoization jode** — React team ki apni taraf se ek mazboot ishara ki in hooks ko haath se sahi rakhna itna mushkil hai ki use automate karna zaruri hai.',
      },
      {
        en: '**Large data tables, complex data-visualization dashboards, and any UI rendering thousands of DOM nodes are the most common real-world cases where useMemo/useCallback genuinely matter for measurable performance** — small forms, simple lists, and typical CRUD screens usually see no measurable benefit at all.',
        hi: '**Badi data tables, complex data-visualization dashboards, aur hazaaron DOM nodes render karne wale kisi bhi UI un sabse aam asli-duniya cases mein hain jahan \`useMemo\`/\`useCallback\` naapi jaane laayak performance ke liye sach mein matter karte hain** — chhote forms, saadhi lists, aur roaayti CRUD screens ko aksar bilkul koi naapi jaane laayak faayda nahi milta.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does clicking a button that toggles an unrelated piece of state (like dark mode) cause an expensive calculation elsewhere in the same component to re-run, if that calculation is written directly in the component body?',
        qHi: 'Ek na-judi state (jaise dark mode) toggle karne wala button click karna usi component mein kahin aur wali mehnge ganit ko dobara chalane ka kaaran kyun banta hai, agar wo ganit component body mein seedha likhi hai?',
        a: 'A component function is called in full, from top to bottom, on every single render, regardless of what specifically triggered that render — there is no built-in distinction between "state relevant to this particular calculation changed" and "some other, unrelated state changed" from the perspective of a plain function call written directly in the component body. Toggling dark mode changes a state variable, which schedules a re-render of the whole component, which means every line of code inside that function — including an unrelated expensive calculation with no actual dependency on the dark-mode state — executes again in full, simply because it is part of the function that got called.',
        aHi: 'Component function ko poora, upar se neeche tak, har akeli render par bulaya jaata hai, chahe us render ko khaas taur par kisi ne bhi trigger kiya ho — "is khaas ganit se juda state badla" aur "koi doosra, na-juda state badla" ke beech koi built-in fark nahi hai us saadhe function call ke nazariye se jo component body mein seedha likha hai. Dark mode toggle karna ek state variable badalta hai, jo poore component ki re-render schedule karta hai, matlab us function ke andar ka har akela line — dark-mode state par koi asli dependency na rakhne wali na-judi mehngi ganit sameet — dobara poori tarah chalta hai, sirf isliye kyunki ye us function ka hissa hai jo bulaaya gaya.',
      },
      {
        q: 'Why can passing an inline arrow function as a prop to a `React.memo`-wrapped component completely defeat that memoization, with no error or warning?',
        qHi: 'Ek \`React.memo\`-wrapped component ko prop ki tarah inline arrow function pass karna us memoization ko poori tarah kyun haraa sakta hai, bina kisi error ya warning ke?',
        a: '`React.memo` skips re-rendering its wrapped component specifically when every one of its props is `===` (reference-equal) to the value from the previous render. An arrow function written directly inline, as part of JSX (`onClick={() => ...}`), is a brand new function object created fresh on every single render of the parent — functions are objects in JavaScript, and two functions with structurally identical code are still two distinct objects in memory, never `===` to each other. Because that inline function is never the same reference as the previous render\'s inline function, `React.memo`\'s comparison correctly (from its own narrow perspective) finds a difference on that prop every time, and re-renders the child — the memoization technically works correctly, it is just being fed a prop that is, in fact, genuinely different every render, even though the function\'s actual behavior never changes.',
        aHi: '\`React.memo\` apne lapete hue component ko dobara render karna khaas taur par tab chhodta hai jab uska har prop pichli render ki value se \`===\` (reference-equal) ho. JSX ke hisse ki tarah seedha inline likha ek arrow function (\`onClick={() => ...}\`) parent ki har akeli render par taaza bana ek bilkul naya function object hai — functions JavaScript mein objects hain, aur structurally ekjaisa code wale do functions phir bhi memory mein do alag objects hain, kabhi ek doosre se \`===\` nahi. Chunki wo inline function kabhi pichli render ke inline function jaisa reference nahi hota, \`React.memo\` ka comparison sahi tarike se (apne khud ke sankre nazariye se) har baar us prop par fark paata hai, aur child ko dobara render karta hai — memoization taknik roop se sahi kaam karti hai, use bas ek aisi prop khilaayi jaa rahi hai jo asal mein har render sach mein alag hai, chahe function ka asli behaviour kabhi na badle.',
      },
      {
        q: 'When would wrapping a function in `useCallback` provide no actual benefit, even if the function is passed as a prop to a child component?',
        qHi: '\`useCallback\` mein ek function ko lapetna kab bilkul faayda nahi deta, chahe wo function child component ko prop ki tarah pass kiya jaaye?',
        a: '`useCallback` only provides a benefit when the stable function reference it produces is actually consumed by something that checks reference equality to decide whether to skip work — most commonly, a child component wrapped in `React.memo`, or a dependency array on another hook like `useEffect` or `useMemo`. If the child component receiving the function is NOT wrapped in `React.memo`, it re-renders whenever its parent re-renders regardless of whether the function prop\'s reference changed, since an ordinary (non-memoized) component has no reference-equality check gating its re-render at all — in that case, wrapping the function in `useCallback` adds the same small per-render bookkeeping cost the hook always has, while providing no reduction in re-renders, since the child was always going to re-render anyway.',
        aHi: '\`useCallback\` sirf tab faayda deta hai jab wo jo stable function reference banaata hai use asal mein kisi aisi cheez dwara consume kiya jaata hai jo reference equality check karke ye tay karti hai ki kaam chhoda jaaye ya nahi — sabse aam taur par, \`React.memo\` mein lapeta child component, ya \`useEffect\`/\`useMemo\` jaise kisi doosre hook ki dependency array. Agar function pane wala child component \`React.memo\` mein lapeta NAHI hai, wo apne parent ke re-render hote hi dobara render hota hai chahe function prop ka reference badla ho ya na ho, kyunki ek aam (non-memoized) component ke paas apni re-render ko roknay ke liye koi reference-equality check hai hi nahi — us case mein, function ko \`useCallback\` mein lapetna wahi chhota per-render bookkeeping kharcha jodta hai jo hook hamesha rakhta hai, bina re-renders mein koi kami diye, kyunki child waise bhi hamesha dobara render hone hi wala tha.',
      },
      {
        q: 'Why does the React team explicitly caution against reaching for `useMemo` and `useCallback` as a default habit applied to every value or function a component creates?',
        qHi: 'React team kisi bhi component ke banaaye har value ya function par default aadat ki tarah \`useMemo\` aur \`useCallback\` uthaane ke khilaaf explicitly kyun aagaah karti hai?',
        a: 'Both hooks carry a real, if usually small, cost of their own: React must store the previous dependency values and the previous result (or function reference) somewhere, and compare the current dependencies against those stored values on every single render to decide whether to reuse the cached result or recompute. For a genuinely expensive computation, this comparison cost is trivial relative to what it saves. For a cheap computation — adding two numbers, a short string concatenation, a function with no meaningful setup cost — the bookkeeping overhead of the memoization itself can be comparable to or larger than the cost of just redoing the work directly, meaning the "optimization" makes performance neutral at best and measurably worse at worst, while also adding a dependency array that must be kept correct and a small amount of genuine code complexity, for no compensating benefit.',
        aHi: 'Dono hooks ki apni ek asli, aksar chhoti hi sahi, keemat hai: React ko pichli dependency values aur pichla nateeja (ya function reference) kahin store karna padta hai, aur har akeli render par abhi ki dependencies ko un store ki hui values se compare karna padta hai ye tay karne ke liye ki cached nateeja dobara use kare ya dobara ganit kare. Ek sach mein mehngi ganit ke liye, ye comparison keemat us bachat ke saamne mamuli hai jo ye deta hai. Ek sasti ganit ke liye — do numbers jodna, ek chhota string jodna, ek function jiska koi matlabi setup kharcha nahi — memoization khud ka bookkeeping overhead kaam seedha dobara karne ki keemat ke barabar ya usse zyada ho sakta hai, matlab "optimization" behtar se behtar neutral hai aur bad se bad naapi jaane laayak kharaab, saath hi ek dependency array bhi jodta hai jise sahi rakhna padta hai aur code mein thodi asli complexity, bina koi barabar faayda diye.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken ProductList with a genuinely large mock array (10,000+ items) and an intentionally slow expensiveSort (e.g., a bubble sort). Click the dark mode toggle and use React DevTools\' Profiler to confirm expensiveSort runs on that click even though it has nothing to do with dark mode.',
        taskHi: 'Ek sach mein badi mock array (10,000+ items) aur jaan-boojhkar dheemi expensiveSort (jaise ek bubble sort) wala toota ProductList banao. Dark mode toggle click karo aur React DevTools ka Profiler use karke confirm karo expensiveSort us click par chalta hai chahe uska dark mode se koi lena-dena nahi.',
        hint: 'Add a console.time/console.timeEnd around the expensiveSort call to directly measure how long it takes on each render.',
        hintHi: 'expensiveSort call ke aas-paas ek console.time/console.timeEnd jodo direct naapne ke liye ki har render par ise kitna waqt lagta hai.',
      },
      {
        task: 'Fix it with useMemo and confirm the dark mode toggle now re-renders instantly, with expensiveSort only running when products or sortBy actually change.',
        taskHi: 'useMemo se theek karo aur confirm karo dark mode toggle ab turant re-render hota hai, expensiveSort sirf tabhi chalta hai jab products ya sortBy asal mein badlein.',
        hint: 'Temporarily remove products or sortBy from the dependency array (but keep them used inside the memoized function) and observe the resulting stale-data bug, connecting this back to the previous lesson\'s missing-dependency discussion.',
        hintHi: 'Products ya sortBy ko thodi der ke liye dependency array se hatao (par unhe memoized function ke andar use hote rehne do) aur nateeja hua stale-data bug dekho, ise pichle lesson ki missing-dependency charcha se jodte hue.',
      },
      {
        task: 'Build the ExpensiveChild/Parent example with React.memo, first without useCallback (confirm ExpensiveChild re-renders on unrelated Parent state changes), then with useCallback (confirm it stops).',
        taskHi: 'React.memo wala ExpensiveChild/Parent example banao, pehle useCallback ke bina (confirm karo ExpensiveChild na-jude Parent state changes par dobara render hota hai), phir useCallback ke saath (confirm karo ye rukta hai).',
        hint: 'Add a console.log at the top of ExpensiveChild\'s function body (not inside a useEffect) to directly see when React actually calls it versus skips it.',
        hintHi: 'ExpensiveChild ke function body ke bilkul upar ek console.log jodo (useEffect ke andar nahi) seedha dekhne ke liye React use asal mein kab bulaata hai versus kab chhodta hai.',
      },
    ],

    keyTakeaways: [
      'A calculation written directly in a component body re-runs on every render of that component, for any reason, including renders triggered by state completely unrelated to that calculation\'s actual inputs.',
      '`useMemo(fn, deps)` caches fn\'s result and only recomputes it when a dependency has genuinely changed, using the same reference-equality comparison as `useEffect`\'s dependency array.',
      '`useCallback(fn, deps)` caches the function itself, giving the same function reference across renders as long as its dependencies do not change — functionally equivalent to `useMemo(() => fn, deps)`.',
      '`useCallback` only provides real benefit when its stable reference is consumed by something that checks reference equality — most commonly a `React.memo`-wrapped child, or another hook\'s dependency array — not when passed to an ordinary, non-memoized component.',
      'An inline function or object literal written directly in JSX is a brand-new object on every render, which is specifically what defeats `React.memo`\'s prop comparison and silently causes an "optimized" child to re-render anyway.',
      'Both hooks carry their own small bookkeeping cost; applying them to trivial computations or functions with no reference-equality consumer adds overhead with no offsetting benefit, which is why reaching for them by default is a well-documented anti-pattern rather than a general best practice.',
    ],
    keyTakeawaysHi: [
      'Component body mein seedha likhi ganit us component ki har render par dobara chalti hai, kisi bhi wajah se, us render sameet jo ganit ke asli inputs se poori tarah na-judi state se hui.',
      '\`useMemo(fn, deps)\` \`fn\` ka nateeja cache karta hai aur sirf tab dobara ganit karta hai jab koi dependency sach mein badli ho, wahi reference-equality comparison use karte hue jo \`useEffect\` ki dependency array use karti hai.',
      '\`useCallback(fn, deps)\` khud function ko cache karta hai, renders ke aar-paar wahi function reference dete hue jab tak uski dependencies na badlein — \`useMemo(() => fn, deps)\` ke barabar kaam karta hai.',
      '\`useCallback\` sirf tab asli faayda deta hai jab uska stable reference kisi aisi cheez dwara consume ho jo reference equality check karti hai — sabse aam taur par \`React.memo\`-wrapped child, ya kisi doosre hook ki dependency array — na ki jab ek aam, non-memoized component ko pass ho.',
      'JSX mein seedha likha ek inline function ya object literal har render par ek bilkul naya object hai, aur khaas taur par yahi cheez \`React.memo\` ke prop comparison ko haraati hai aur ek "optimized" child ko chupchap phir bhi dobara render karaati hai.',
      'Dono hooks ki apni chhoti bookkeeping keemat hai; unhe mamuli ganit ya aise functions par lagu karna jinka koi reference-equality consumer nahi hai bina kisi barabar faayde ke overhead jodta hai, aur bilkul isi wajah se unhe default roop se uthaana ek achhi tarah documented anti-pattern hai, koi aam best practice nahi.',
    ],
  },
];
