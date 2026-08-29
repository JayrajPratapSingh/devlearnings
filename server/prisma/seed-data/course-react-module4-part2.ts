/**
 * React Complete Course — Module 4: Hooks & Performance, lesson 2.
 *
 * Custom hooks: extracting duplicated stateful logic into a reusable
 * function. The broken example copy-pastes the window-resize-listener
 * pattern from Module 3's useEffect lesson into two separate components,
 * then a bug fix applied to one copy never reaches the other — the classic
 * cost of duplicated logic, not a new bug category, which is exactly why
 * custom hooks exist.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there (\'). Run `npx tsc --noEmit -p .`
 * after writing this file, before wiring it into seed.ts.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_4_PART2: CourseLesson[] = [
  {
    slug: 'custom-hooks',
    title: 'Custom Hooks: Sharing Stateful Logic Between Components',
    titleHi: 'Custom Hooks: Components Ke Beech Stateful Logic Share Karna',
    description: 'The same resize-listener bug fixed in one component, and still broken in its identical twin two files away.',
    descriptionHi: 'Wahi resize-listener bug ek component mein theek hua, aur do files door apne pehchaane hue jude twin mein abhi bhi toota hua.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A recipe card photocopied to five different kitchens versus one master recipe every kitchen calls.** Copy-pasting the same stateful logic (like a window-resize subscription) into several components is like photocopying a recipe card and handing an identical copy to five different kitchens — each kitchen cooks independently from its own copy. The day head office discovers the recipe has a mistake (an oven temperature that is too high) and corrects ONE kitchen\'s copy, the other four kitchens are still silently cooking from the old, wrong recipe, with no way for head office to know that or fix it centrally. A custom hook is a single master recipe every kitchen calls out to instead of holding its own copy — correcting the master recipe once instantly fixes it for every kitchen using it, because they were never actually holding independent copies to begin with, just following the same shared instructions.',
      hi: '**Ek recipe card jo paanch alag-alag kitchens ko photocopy karke di gayi versus ek master recipe jise har kitchen bulaati hai.** Wahi stateful logic (jaise window-resize subscription) ko kai components mein copy-paste karna aisa hai jaise ek recipe card photocopy karke paanch alag-alag kitchens ko ek jaisi copy thamaana — har kitchen apni khud ki copy se alag-alag pakaati hai. Jis din head office ko pata chalta hai ki recipe mein galti hai (oven ka temperature bahut zyada hai) aur EK kitchen ki copy theek karta hai, baaki chaar kitchens abhi bhi chupchap purani, galat recipe se pakaa rahi hain, head office ke paas ye jaanne ya use markazi roop se theek karne ka koi tarika nahi. Ek custom hook ek akela master recipe hai jise har kitchen apni khud ki copy rakhne ke bajaye bulaati hai — master recipe ko ek baar theek karna use turant har us kitchen ke liye theek kar deta hai jo use istemal karti hai, kyunki wo kabhi asal mein alag copies rakhi hi nahi thi, bas wahi shared nirdesh follow kar rahi thi.',
    },

    simple: `**Start broken.** Two components that both need to know the window width:

\`\`\`jsx
function Header() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <header>{width > 768 ? "Desktop nav" : "Mobile nav"}</header>;
}

function Sidebar() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    // BUG: forgot to return the cleanup function here — this copy leaks a listener
  }, []);

  return <aside>{width > 768 ? "Expanded" : "Collapsed"}</aside>;
}
\`\`\`

Both components need the exact same window-width-tracking behavior from Module 3\'s \`useEffect\` lesson, so the logic was copy-pasted from \`Header\` into \`Sidebar\` — and in the process of pasting, the cleanup function\'s \`return\` statement was accidentally dropped from \`Sidebar\`\'s copy. \`Header\` behaves correctly; \`Sidebar\` silently leaks a resize listener every time it mounts and unmounts, the exact bug Module 3 covered — except now it only exists in ONE of the two copies, invisible unless someone happens to look at \`Sidebar\`\'s version specifically. This is not a new category of bug — it is the ordinary cost of duplicated logic: a fix (or in this case, a missing fix) made in one copy has no way of reaching the other, because they were never actually the same code, just code that started out looking the same.

**The fix: extract the shared logic into a custom hook, used by both**

\`\`\`jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function Header() {
  const width = useWindowWidth();
  return <header>{width > 768 ? "Desktop nav" : "Mobile nav"}</header>;
}

function Sidebar() {
  const width = useWindowWidth();
  return <aside>{width > 768 ? "Expanded" : "Collapsed"}</aside>;
}
\`\`\`

\`\`\`tsx
function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    function handleResize(): void {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function Header() {
  const width = useWindowWidth();
  return <header>{width > 768 ? "Desktop nav" : "Mobile nav"}</header>;
}

function Sidebar() {
  const width = useWindowWidth();
  return <aside>{width > 768 ? "Expanded" : "Collapsed"}</aside>;
}
\`\`\`

\`useWindowWidth\` is an ordinary JavaScript function that happens to call other hooks (\`useState\`, \`useEffect\`) inside it — the \`use\` prefix is a naming convention React and its tooling rely on to recognize it as a hook (covered further in this lesson\'s content section), not special syntax. \`Header\` and \`Sidebar\` each call \`useWindowWidth()\` independently — each gets its OWN \`width\` state and its OWN effect subscription, entirely separate from the other\'s, even though both are running the exact same underlying code. The cleanup bug from the broken version is now structurally impossible to have in only one place: there is only one copy of the subscription logic, so there is nowhere for a "the fix only reached one of the copies" bug to live.

**What actually gets shared is the LOGIC, not the state itself** — \`Header\`\'s \`width\` and \`Sidebar\`\'s \`width\` are two completely independent numbers that happen to be produced by identically-behaving code; resizing the window updates both, but they are not somehow the same variable, any more than two people using the same recipe end up with the same physical dish.`,

    simpleHi: `**Toote hue se shuru.** Do components jinhe dono ko window width jaanni hai:

\`\`\`jsx
function Header() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <header>{width > 768 ? "Desktop nav" : "Mobile nav"}</header>;
}

function Sidebar() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    // BUG: yahan cleanup function ka return bhool gaye — ye copy ek listener leak karti hai
  }, []);

  return <aside>{width > 768 ? "Expanded" : "Collapsed"}</aside>;
}
\`\`\`

Dono components ko Module 3 ke \`useEffect\` lesson wala bilkul wahi window-width-tracking behaviour chahiye, isliye logic \`Header\` se \`Sidebar\` mein copy-paste kiya gaya — aur paste karte waqt, \`Sidebar\` ki copy se cleanup function ka \`return\` statement galti se chhoot gaya. \`Header\` sahi tarike se behave karta hai; \`Sidebar\` chupchap ek resize listener leak karta hai har baar mount aur unmount hone par, bilkul wahi bug jo Module 3 mein cover hua — bas ab ye sirf DO mein se EK copy mein maujood hai, adrishya jab tak koi khaas taur par \`Sidebar\` ka version dekhe. Ye koi naya bug ki kism nahi hai — ye duplicated logic ki aam keemat hai: ek copy mein hui fix (ya is case mein, missing fix) ka doosre tak pahunchne ka koi tarika nahi, kyunki wo asal mein kabhi ek jaisa code tha hi nahi, bas aisa code jo shuru mein ek jaisa dikhta tha.

**Fix: shared logic ko ek custom hook mein nikaalo, dono use karein**

\`\`\`jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function Header() {
  const width = useWindowWidth();
  return <header>{width > 768 ? "Desktop nav" : "Mobile nav"}</header>;
}

function Sidebar() {
  const width = useWindowWidth();
  return <aside>{width > 768 ? "Expanded" : "Collapsed"}</aside>;
}
\`\`\`

\`\`\`tsx
function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    function handleResize(): void {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function Header() {
  const width = useWindowWidth();
  return <header>{width > 768 ? "Desktop nav" : "Mobile nav"}</header>;
}

function Sidebar() {
  const width = useWindowWidth();
  return <aside>{width > 768 ? "Expanded" : "Collapsed"}</aside>;
}
\`\`\`

\`useWindowWidth\` ek aam JavaScript function hai jo apne andar doosre hooks (\`useState\`, \`useEffect\`) bulaata hai — \`use\` prefix ek naming convention hai jispar React aur uske tools ise hook pehchaanne ke liye bharosa karte hain (is lesson ke content section mein aage cover hoga), koi khaas syntax nahi. \`Header\` aur \`Sidebar\` dono \`useWindowWidth()\` alag-alag bulaate hain — har ek ko apna KHUD ka \`width\` state milta hai aur apna KHUD ka effect subscription, doosre se poori tarah alag, chahe dono bilkul wahi underlying code chala rahe hon. Toote version wala cleanup bug ab structurally sirf ek jagah hona namumkin hai: subscription logic ki sirf ek hi copy hai, isliye "fix sirf ek copy tak pahuncha" wale bug ke rehne ki jagah hi nahi hai.

**Asal mein jo share hota hai wo LOGIC hai, khud state nahi** — \`Header\` ka \`width\` aur \`Sidebar\` ka \`width\` do poori tarah alag numbers hain jo ekjaisa behave karte code se banti hain; window resize karna dono ko update karta hai, par wo kisi tarah wahi variable nahi hain, jitna do log wahi recipe use karke wahi physical dish nahi bana lete.`,

    content: `## What actually makes a function a "hook"

\`\`\`jsx
function useWindowWidth() {   // starts with "use" — this IS the rule, not just a convention followed loosely
  const [width, setWidth] = useState(window.innerWidth);
  // ...
  return width;
}
\`\`\`

A custom hook is, structurally, nothing more than an ordinary JavaScript function that calls one or more of React\'s built-in hooks inside it. The \`use\` naming prefix is not enforced by the JavaScript language itself, but it is a hard requirement of React\'s own tooling: React\'s linter (\`eslint-plugin-react-hooks\`) and React itself use this naming convention to know which functions need the "rules of hooks" (below) enforced on them — a function that calls \`useState\` internally but is NOT named starting with \`use\` will not be recognized as a hook by the linter, and violations inside it will not be caught.

## The rules of hooks, and why they exist

\`\`\`jsx
// WRONG: a hook called conditionally
function useExample(condition) {
  if (condition) {
    const [value, setValue] = useState(0);   // sometimes called, sometimes not
  }
}

// RIGHT: the hook is always called; the condition affects what happens AFTER
function useExample(condition) {
  const [value, setValue] = useState(0);
  if (condition) {
    // use value here
  }
}
\`\`\`

Hooks must be called in the exact same order on every single render of a component, and specifically must never be called inside a condition, loop, or nested function. React tracks each \`useState\`, \`useEffect\`, and similar call by its call ORDER within the component, not by name — internally, React maintains something like a list, and the third \`useState\` call always corresponds to the third slot in that list, every render. If a hook were called conditionally, the Nth hook call in one render might correspond to a completely different state variable than the Nth hook call in the next render, since the actual sequence of calls would differ — this would silently corrupt which state belongs to which hook. This rule applies identically whether the hook being called is one of React\'s own (\`useState\`, \`useEffect\`) or a custom hook built from them, since a custom hook is just a function that itself makes the same ordered calls internally.

## Custom hooks share LOGIC, not state

\`\`\`jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);   // Modal's OWN isOpen state
  // ...
}

function Sidebar() {
  const [isCollapsed, toggleCollapsed] = useToggle(true);   // Sidebar's OWN, completely separate state
  // ...
}
\`\`\`

Every call to a custom hook creates its own, entirely independent copy of whatever state and effects live inside it — \`Modal\`\'s \`isOpen\` and \`Sidebar\`\'s \`isCollapsed\` are two unrelated pieces of state, each with its own React-tracked slot, that happen to be produced by running the same \`useToggle\` code twice. Toggling \`Modal\`\'s value has zero effect on \`Sidebar\`\'s — this is precisely why custom hooks are described as sharing stateful *logic*, not sharing the state values themselves; if two components genuinely need to share the same live value, that requires lifting state up to a common parent (or Context, covered in Module 5), not a custom hook.

## A generic \`useFetch\` hook: reusing Module 3\'s data-fetching pattern

\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json();
      })
      .then((json) => { if (!ignore) setData(json); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setIsLoading(false); });

    return () => { ignore = true; };
  }, [url]);

  return { data, isLoading, error };
}

function ProfileViewer({ userId }) {
  const { data: profile, isLoading, error } = useFetch(\`/api/users/\${userId}\`);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h1>{profile.name}</h1>;
}
\`\`\`

The entire loading/error/race-condition-safe fetch pattern from the previous lesson is exactly the kind of logic worth extracting — any component that needs to fetch data from a URL and handle the same three states can call \`useFetch(url)\` instead of re-implementing the ignore flag and the three \`useState\` calls every time. This is the same duplication argument as the window-width example, just with more valuable logic: getting the race-condition guard right once, in one hook, is considerably safer than trusting every future component to copy it correctly by hand.

## TypeScript: generic custom hooks

\`\`\`tsx
interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json() as Promise<T>;
      })
      .then((json) => { if (!ignore) setData(json); })
      .catch((err: Error) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setIsLoading(false); });

    return () => { ignore = true; };
  }, [url]);

  return { data, isLoading, error };
}

interface Profile {
  name: string;
}

function ProfileViewer({ userId }: { userId: string }) {
  const { data: profile, isLoading, error } = useFetch<Profile>(\`/api/users/\${userId}\`);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h1>{profile!.name}</h1>;
}
\`\`\`

\`useFetch<T>\` is a generic function (TypeScript course, generics module) — the \`T\` a caller supplies (\`useFetch<Profile>(...)\`) flows through to type \`data\` as \`Profile | null\`, giving every consumer of the hook full autocomplete and type-checking on the fetched shape, without \`useFetch\` itself needing to know in advance what shape any particular caller will fetch. This is the same generic-function pattern the TypeScript course covers for ordinary functions, applied to a function that happens to call hooks internally — nothing about it is React-specific syntax.`,

    contentHi: `## Asal mein kya cheez ek function ko "hook" banaati hai

\`\`\`jsx
function useWindowWidth() {   // "use" se shuru — YE hi niyam hai, koi dheela follow kiya convention nahi
  const [width, setWidth] = useState(window.innerWidth);
  // ...
  return width;
}
\`\`\`

Custom hook, structurally, ek aam JavaScript function se zyada kuch nahi hai jo apne andar React ke ek ya zyada built-in hooks bulaata hai. \`use\` naming prefix khud JavaScript bhaasha se lagu nahi hota, par ye React ke apne tooling ki sakht zarurat hai: React ka linter (\`eslint-plugin-react-hooks\`) aur React khud ye naming convention use karke jaanate hain kaunse functions par "rules of hooks" (neeche) lagu karni hai — aisa function jo andar \`useState\` bulaata hai par jiska naam \`use\` se shuru nahi hota, linter use hook ki tarah pehchaanega hi nahi, aur uske andar hui galtiyaan pakdi nahi jaayengi.

## Rules of hooks, aur ye kyun maujood hain

\`\`\`jsx
// GALAT: ek hook conditionally bulaya gaya
function useExample(condition) {
  if (condition) {
    const [value, setValue] = useState(0);   // kabhi bulaaya jaata hai, kabhi nahi
  }
}

// SAHI: hook hamesha bulaaya jaata hai; condition uske BAAD kya hota hai use asar karti hai
function useExample(condition) {
  const [value, setValue] = useState(0);
  if (condition) {
    // yahan value use karo
  }
}
\`\`\`

Hooks ko component ki har akeli render par bilkul usi kram mein bulaana chahiye, aur khaas taur par unhe kabhi bhi kisi condition, loop, ya nested function ke andar nahi bulaana chahiye. React har \`useState\`, \`useEffect\`, aur jaisi calls ko unke call ke KRAM se track karta hai, naam se nahi — internally, React ek list jaisi cheez rakhta hai, aur teesri \`useState\` call hamesha us list mein teesre slot se milti hai, har render mein. Agar koi hook conditionally bulaya jaaye, ek render mein Nth hook call kisi agli render ki Nth hook call se bilkul alag state variable se mil sakta hai, kyunki calls ka asli kram alag hota — ye chupchap ye kharaab kar dega ki kaunsi state kaunse hook se judi hai. Ye niyam bilkul ekjaisa lagu hota hai chahe bulaaya gaya hook React ka apna ho (\`useState\`, \`useEffect\`) ya unse bana ek custom hook, kyunki custom hook khud ek function hai jo apne andar wahi ordered calls karta hai.

## Custom hooks LOGIC share karte hain, state nahi

\`\`\`jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);   // Modal ka KHUD ka isOpen state
  // ...
}

function Sidebar() {
  const [isCollapsed, toggleCollapsed] = useToggle(true);   // Sidebar ka KHUD ka, poori tarah alag state
  // ...
}
\`\`\`

Custom hook ki har call apni khud ki, poori tarah alag copy banaati hai jo bhi state aur effects uske andar rehte hain — \`Modal\` ka \`isOpen\` aur \`Sidebar\` ka \`isCollapsed\` do na-jude state ke tukde hain, har ek ka apna React-tracked slot, jo wahi \`useToggle\` code do baar chalane se banta hai. \`Modal\` ki value toggle karna \`Sidebar\` par zero asar karta hai — bilkul isi wajah se custom hooks ko stateful *logic* share karne wala kaha jaata hai, khud state values share karne wala nahi; agar do components ko asal mein wahi live value share karni ho, uske liye state ko common parent tak upar le jaana (ya Context, jo Module 5 mein cover hoga), koi custom hook nahi.

## Ek generic \`useFetch\` hook: Module 3 ka data-fetching pattern dobara use karna

\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json();
      })
      .then((json) => { if (!ignore) setData(json); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setIsLoading(false); });

    return () => { ignore = true; };
  }, [url]);

  return { data, isLoading, error };
}

function ProfileViewer({ userId }) {
  const { data: profile, isLoading, error } = useFetch(\`/api/users/\${userId}\`);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h1>{profile.name}</h1>;
}
\`\`\`

Pichle lesson ka poora loading/error/race-condition-safe fetch pattern bilkul waisi hi logic hai jo nikaalne laayak hai — koi bhi component jise kisi URL se data fetch karna hai aur wahi teen states sambhaalni hain, wo har baar ignore flag aur teen \`useState\` calls dobara banaane ke bajaye \`useFetch(url)\` bula sakta hai. Ye window-width example wali wahi duplication wali dalil hai, bas zyada keemti logic ke saath: race-condition guard ko ek baar, ek hook mein, sahi karna har aane wale component par bharosa karne se kaafi zyada surakshit hai ki wo use haath se sahi copy karega.

## TypeScript: generic custom hooks

\`\`\`tsx
interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json() as Promise<T>;
      })
      .then((json) => { if (!ignore) setData(json); })
      .catch((err: Error) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setIsLoading(false); });

    return () => { ignore = true; };
  }, [url]);

  return { data, isLoading, error };
}

interface Profile {
  name: string;
}

function ProfileViewer({ userId }: { userId: string }) {
  const { data: profile, isLoading, error } = useFetch<Profile>(\`/api/users/\${userId}\`);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h1>{profile!.name}</h1>;
}
\`\`\`

\`useFetch<T>\` ek generic function hai (TypeScript course, generics module) — caller jo \`T\` deta hai (\`useFetch<Profile>(...)\`) \`data\` ko \`Profile | null\` ki tarah type karne mein baha jaata hai, hook ke har istemal karne wale ko fetch hui shape par poora autocomplete aur type-checking dete hue, bina \`useFetch\` khud ko pehle se jaane ki zarurat ke ki koi khaas caller kaunsi shape fetch karega. Ye TypeScript course ke aam functions ke liye cover kiya wahi generic-function pattern hai, aise function par lagu jo apne andar hooks bulaata hai — isme kuch bhi React-khaas syntax nahi hai.`,

    examples: [
      {
        title: 'Broken: duplicated logic, a fix that reaches only one copy',
        titleHi: 'Toota: duplicated logic, fix jo sirf ek copy tak pahunchti hai',
        code: `function Header() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return <header>{width}</header>;
}
function Sidebar() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", handleResize);
    // missing cleanup here
  }, []);
  return <aside>{width}</aside>;
}`,
        codeJs: `function Header() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <header>{width > 768 ? "Desktop nav" : "Mobile nav"}</header>;
}

function Sidebar() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    // BUG: no cleanup — this copy leaks a listener on every mount/unmount
  }, []);

  return <aside>{width > 768 ? "Expanded" : "Collapsed"}</aside>;
}`,
        codeTs: `function Header() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    function handleResize(): void {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <header>{width > 768 ? "Desktop nav" : "Mobile nav"}</header>;
}

function Sidebar() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    function handleResize(): void {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    // BUG: same missing cleanup, TypeScript does not catch this either
  }, []);

  return <aside>{width > 768 ? "Expanded" : "Collapsed"}</aside>;
}
// TypeScript does not catch this — a missing return statement inside
// a useEffect is not a type error, it's the same reconciliation bug
// from Module 3, just now duplicated into two places.`,
        output: `Header: mounts and unmounts cleanly, exactly one resize listener at a
time, correctly cleaned up.
Sidebar: identical-LOOKING code, but each mount adds a listener that
is NEVER removed — mounting and unmounting Sidebar repeatedly (e.g.
via client-side routing) accumulates listeners without bound, exactly
like Module 3's original broken example.`,
        explain: 'The two components started as identical code, which is exactly what makes this class of bug dangerous — nothing about reading Sidebar in isolation looks obviously different from Header unless you specifically compare them line by line.',
        explainHi: 'Dono components ekjaisa code ki tarah shuru hue, aur bilkul isi wajah se ye kism ka bug khatarnaak hai — Sidebar ko akele padhne mein Header se zaahir taur par alag kuch nahi lagta jab tak aap unhe khaas taur par line-by-line compare na karo.',
      },
      {
        title: 'Fixed: one custom hook, used by both components',
        titleHi: 'Theek: ek custom hook, dono components use karte hain',
        code: `function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}
function Header() { const width = useWindowWidth(); return <header>{width}</header>; }
function Sidebar() { const width = useWindowWidth(); return <aside>{width}</aside>; }`,
        codeJs: `function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function Header() {
  const width = useWindowWidth();
  return <header>{width > 768 ? "Desktop nav" : "Mobile nav"}</header>;
}

function Sidebar() {
  const width = useWindowWidth();
  return <aside>{width > 768 ? "Expanded" : "Collapsed"}</aside>;
}`,
        codeTs: `function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    function handleResize(): void {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function Header() {
  const width = useWindowWidth();
  return <header>{width > 768 ? "Desktop nav" : "Mobile nav"}</header>;
}

function Sidebar() {
  const width = useWindowWidth();
  return <aside>{width > 768 ? "Expanded" : "Collapsed"}</aside>;
}`,
        outputJs: `Both Header and Sidebar now correctly clean up their listeners on
unmount — there is only one copy of the subscription logic, so there
is no second copy that could have a divergent, unfixed bug.`,
        outputTs: `// Identical behaviour. "useWindowWidth(): number" documents the
// hook's return type once — every component calling it gets the same
// checked "number" type for width without re-declaring it.`,
        explain: 'Header and Sidebar each still get their OWN independent width state and OWN effect subscription — they are not sharing a single value, they are both correctly running their own copy of the same correct logic.',
        explainHi: 'Header aur Sidebar dono ko phir bhi apna KHUD ka alag width state aur apna KHUD ka effect subscription milta hai — wo ek akeli value share nahi kar rahe, dono sahi tarike se wahi sahi logic ki apni-apni copy chala rahe hain.',
      },
      {
        title: 'A small, reusable useToggle hook',
        titleHi: 'Ek chhota, reusable useToggle hook',
        code: `function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}`,
        codeJs: `function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);
  return (
    <div>
      <button onClick={toggleOpen}>{isOpen ? "Close" : "Open"}</button>
      {isOpen && <p>Modal content</p>}
    </div>
  );
}`,
        codeTs: `function useToggle(initialValue: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);
  return (
    <div>
      <button onClick={toggleOpen}>{isOpen ? "Close" : "Open"}</button>
      {isOpen && <p>Modal content</p>}
    </div>
  );
}`,
        outputJs: `Any component needing a simple on/off boolean (a modal, a dropdown, a
sidebar collapse state) can call useToggle() instead of writing its
own useState(false) plus its own toggle handler function every time.`,
        outputTs: `// The explicit return type "[boolean, () => void]" is a TUPLE type
// (TypeScript course) — it tells TypeScript the array has exactly two
// elements in this exact order and these exact types, which is what
// makes "const [isOpen, toggleOpen] = useToggle(false)" destructure
// with correct types instead of both being typed as "boolean |
// (() => void)".`,
        explain: 'This hook is deliberately tiny — custom hooks do not need to be complicated to be worth extracting; even a two-line pattern repeated across many components is worth naming and sharing once it appears often enough.',
        explainHi: 'Ye hook jaan-boojhkar bahut chhota hai — custom hooks ko nikaalne laayak hone ke liye complicated hona zaruri nahi; do-line wala pattern bhi agar kaafi components mein dohraaya jaata hai to use ek baar naam dena aur share karna kaam ka hai.',
      },
      {
        title: 'A generic useFetch hook reusing Module 3\'s pattern',
        titleHi: 'Ek generic useFetch hook jo Module 3 ka pattern dobara use karta hai',
        code: `function useFetch(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let ignore = false;
    // ... same fetch + ignore-flag pattern as the data-fetching lesson
    return () => { ignore = true; };
  }, [url]);
  return { data, isLoading, error };
}`,
        codeJs: `function useFetch(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json();
      })
      .then((json) => { if (!ignore) setData(json); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setIsLoading(false); });

    return () => { ignore = true; };
  }, [url]);

  return { data, isLoading, error };
}

function ProfileViewer({ userId }) {
  const { data: profile, isLoading, error } = useFetch(\`/api/users/\${userId}\`);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h1>{profile.name}</h1>;
}`,
        codeTs: `interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json() as Promise<T>;
      })
      .then((json) => { if (!ignore) setData(json); })
      .catch((err: Error) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setIsLoading(false); });

    return () => { ignore = true; };
  }, [url]);

  return { data, isLoading, error };
}

interface Profile {
  name: string;
}

function ProfileViewer({ userId }: { userId: string }) {
  const { data: profile, isLoading, error } = useFetch<Profile>(\`/api/users/\${userId}\`);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h1>{profile!.name}</h1>;
}`,
        outputJs: `A ProductViewer, an OrderViewer, or any other component needing to
fetch a URL and handle loading/error/data can call useFetch(url) and
automatically get the race-condition-safe behavior from the previous
lesson, correctly, without re-implementing the ignore flag.`,
        outputTs: `// "useFetch<Profile>(...)" and "useFetch<Order>(...)" both reuse the
// exact same hook implementation, each getting back correctly and
// independently typed data — the generic parameter is supplied fresh
// at each call site.`,
        explain: 'Notice the "!" after profile in "profile!.name" — this is a non-null assertion telling TypeScript "trust me, this is not null here" because the isLoading/error checks above already guarantee data must be present by this point, something TypeScript itself cannot verify through control flow alone.',
        explainHi: '\`profile!.name\` mein \`profile\` ke baad ka "!" dhyaan do — ye ek non-null assertion hai jo TypeScript ko batata hai "mujhpar bharosa karo, ye yahan null nahi hai" kyunki upar wale isLoading/error checks pehle hi guarantee kar chuke hain ki is pal tak data maujood hona chahiye, aisi cheez jise TypeScript khud control flow se pakad nahi sakta.',
      },
    ],

    mistakes: [
      {
        wrong: `function Header() {
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
}
function Sidebar() {
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    // copy-pasted, cleanup accidentally dropped
  }, []);
}`,
        right: `function useWindowWidth() {
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // ...
}
// both Header and Sidebar call useWindowWidth() instead of duplicating the logic`,
        why: 'Duplicated logic has no mechanism connecting one copy to another — a fix or bug in one copy simply does not reach the other, since they were never the same code, only code that started out identical.',
        whyHi: 'Duplicated logic mein ek copy ko doosri se jodne wala koi mechanism nahi hota — ek copy ki fix ya bug seedha doosri tak pahunchti hi nahi, kyunki wo kabhi wahi code thi hi nahi, sirf shuru mein ekjaisa dikhta code tha.',
      },
      {
        wrong: `function useExample(condition) {
  if (condition) {
    const [value, setValue] = useState(0);   // conditionally called
  }
}`,
        right: `function useExample(condition) {
  const [value, setValue] = useState(0);   // always called, in the same order every render
  if (condition) {
    // use value here instead
  }
}`,
        why: 'React tracks each hook call by its ORDER within the component, not by name — calling a hook conditionally means the order of calls can differ between renders, silently corrupting which stored state corresponds to which hook call.',
        whyHi: 'React har hook call ko component ke andar uske KRAM se track karta hai, naam se nahi — kisi hook ko conditionally bulaana matlab calls ka kram renders ke beech alag ho sakta hai, chupchap ye kharaab karte hue ki kaunsi store hui state kaunse hook call se milti hai.',
      },
      {
        wrong: `function useAuth() {
  const [user, setUser] = useState(null);
  return user;
}
// two components calling useAuth() expecting to share the SAME logged-in user`,
        right: `// If two components genuinely need the SAME live value, lift the
// state to a common parent, or use Context (Module 5) — a custom hook
// alone gives each caller its own INDEPENDENT copy of the state`,
        why: 'Every call to a custom hook creates its own independent state — two components each calling useAuth() get two separate, unrelated "user" values, not a shared one, even though both were produced by the same hook code.',
        whyHi: 'Custom hook ki har call apni khud ki alag state banaati hai — do components jo dono \`useAuth()\` bulaate hain unhe do alag, na-jude "user" values milti hain, koi shared value nahi, chahe dono wahi hook code se bane ho.',
      },
    ],

    realWorld: [
      {
        en: '**Popular open-source hook libraries like `usehooks-ts`, `react-use`, and `ahooks` are entirely made up of exactly this pattern — reusable custom hooks extracted from common, repeated needs** — window size, local storage, debounced values, previous-value tracking, and dozens more, each one solving the same "stop copy-pasting this logic" problem this lesson demonstrated.',
        hi: '**\`usehooks-ts\`, \`react-use\`, aur \`ahooks\` jaisi popular open-source hook libraries bilkul isi pattern se poori tarah bani hain — reusable custom hooks jo aam, dohraayi jaane wali zarurton se nikaale gaye hain** — window size, local storage, debounced values, previous-value tracking, aur dus se zyada aur, har ek "is logic ko copy-paste karna band karo" wali samasya hal karta hai jo is lesson ne dikhaayi.',
      },
      {
        en: '**Extracting a custom hook is one of the most common refactoring recommendations in real code review**, specifically when a reviewer notices the same `useState`/`useEffect` combination appearing near-identically in two or more components — it is treated as seriously as duplicated non-hook logic would be in any other language.',
        hi: '**Ek custom hook nikaalna asli code review mein sabse aam refactoring sujhaavon mein se ek hai**, khaas taur par jab koi reviewer notice karta hai ki wahi \`useState\`/\`useEffect\` combination do ya zyada components mein lagbhag-ekjaisa dikh raha hai — ise utni hi gambhirta se liya jaata hai jitni kisi bhi doosri bhaasha mein duplicated non-hook logic ko li jaati.',
      },
      {
        en: '**The "rules of hooks" (no conditional calls, always same order) are enforced automatically by `eslint-plugin-react-hooks` in almost every production React project**, catching violations at write-time in the editor rather than relying on developers to remember and manually verify the rule on every hook call.',
        hi: '**"Rules of hooks" (koi conditional calls nahi, hamesha wahi kram) lagbhag har production React project mein \`eslint-plugin-react-hooks\` se apne aap lagu hoti hain**, editor mein likhte waqt hi ullanghan pakadte hue, developers par ye bharosa karne ke bajaye ki wo har hook call par niyam yaad rakhein aur haath se check karein.',
      },
    ],

    interviewQA: [
      {
        q: 'What structurally makes a function a "custom hook" versus an ordinary JavaScript function, given that a custom hook is not a distinct language feature?',
        qHi: 'Structural roop se kya cheez ek function ko "custom hook" banaati hai ek aam JavaScript function ke muqable, jab custom hook koi alag bhaasha feature hai hi nahi?',
        a: 'A custom hook is, structurally, simply an ordinary JavaScript function that calls one or more of React\'s built-in hooks (useState, useEffect, and similar) somewhere inside its own body. Nothing about the JavaScript language itself distinguishes it from any other function — what makes it recognizable as a hook, both to other developers and to React\'s own tooling, is purely the naming convention of starting the function\'s name with "use". React\'s linter (eslint-plugin-react-hooks) specifically relies on this naming convention to know which functions it should enforce the rules of hooks on — a function that internally calls useState but is not named starting with "use" would not be checked by that linter, even though it is functionally identical to a properly-named custom hook.',
        aHi: 'Custom hook, structurally, bas ek aam JavaScript function hai jo apni khud ki body ke andar kahin React ke ek ya zyada built-in hooks (useState, useEffect, aur jaisi) bulaata hai. JavaScript bhaasha khud iske baare mein aise kisi bhi doosre function se alag kuch nahi karti — isse hook ki tarah pehchaanne laayak kya banaata hai, dono doosre developers ke liye aur React ke apne tooling ke liye, poori tarah function ke naam ko "use" se shuru karne wala naming convention hai. React ka linter (eslint-plugin-react-hooks) khaas taur par is naming convention par bharosa karta hai jaanne ke liye ki kaunse functions par usko rules of hooks lagu karni chahiye — aisa function jo internally \`useState\` bulaata hai par jiska naam "use" se shuru nahi hota us linter dwara check nahi hoga, chahe wo functionally ek sahi-naam wale custom hook ke barabar hi kyun na ho.',
      },
      {
        q: 'Why must hooks always be called in the same order on every render, and never inside a conditional, loop, or nested function?',
        qHi: 'Hooks ko har render par hamesha wahi kram mein kyun bulaana chahiye, aur kabhi bhi kisi conditional, loop, ya nested function ke andar nahi?',
        a: 'React tracks the state and effects associated with each hook call by the ORDER in which the hooks are called within a component, not by any name or identifier — internally, React maintains something functionally like a positional list, where the Nth hook call in a render is associated with the Nth slot in that list, and this mapping is assumed to be stable across renders. If a hook is called conditionally — inside an if statement that sometimes is and sometimes is not entered — the actual sequence of hook calls can differ from one render to the next, meaning the Nth hook call in one render might not correspond to the same logical hook as the Nth hook call in the previous render. React has no way to detect this mismatch by itself; it would simply associate the wrong stored state with the wrong hook call, silently corrupting component behavior rather than producing an obvious error.',
        aHi: 'React har hook call se juda state aur effects ko us KRAM se track karta hai jisme hooks component ke andar bulaaye jaate hain, kisi naam ya identifier se nahi — internally, React functionally ek positional list jaisi cheez rakhta hai, jahan render mein Nth hook call us list ke Nth slot se judi hoti hai, aur ye mapping renders ke aar-paar stable maani jaati hai. Agar koi hook conditionally bulaya jaaye — ek if statement ke andar jo kabhi chalta hai kabhi nahi — hook calls ka asli kram ek render se agli mein alag ho sakta hai, matlab ek render mein Nth hook call pichli render ki Nth hook call jaise hi logical hook se na mile. React ke paas khud is bemel ko pakadne ka koi tarika nahi hai; wo bas galat store hui state ko galat hook call se jod dega, chupchap component behaviour kharaab karte hue, koi zaahir error dene ke bajaye.',
      },
      {
        q: 'If two separate components each call the same custom hook, do they share the same state, or does each get its own independent copy? Why?',
        qHi: 'Agar do alag components dono wahi custom hook bulaate hain, kya wo wahi state share karte hain, ya har ek ko apni alag copy milti hai? Kyun?',
        a: 'Each call to a custom hook creates and manages its own, entirely independent instance of whatever state and effects are declared inside that hook\'s function body — calling the same hook from two different components does not create any link or shared reference between them. This follows directly from how the built-in hooks a custom hook wraps already work: each component instance has its own separate storage for its useState calls, and a custom hook\'s internal useState call is no different just because it happens to be wrapped inside another function. Custom hooks are therefore accurately described as sharing reusable stateful LOGIC — the same code, producing the same kind of behavior — rather than sharing actual state VALUES; two components needing to observe or modify the exact same live value require a different pattern, such as lifting the state to a shared parent component or using Context.',
        aHi: 'Custom hook ki har call apna khud ka, poori tarah alag instance banaati aur sambhaalti hai jo bhi state aur effects us hook ki function body ke andar declare hain — do alag components se wahi hook bulaana unke beech koi link ya shared reference nahi banaata. Ye seedha isse nikalta hai ki custom hook jinhe wrap karta hai wo built-in hooks pehle se kaise kaam karte hain: har component instance ke paas apne \`useState\` calls ke liye apna alag storage hai, aur custom hook ki andar wali \`useState\` call kisi doosre function ke andar lapeti hone se alag nahi ban jaati. Isliye custom hooks ko sahi tarike se reusable stateful LOGIC share karne wala kaha jaata hai — wahi code, wahi kism ka behaviour banaata hua — asli state VALUES share karne wala nahi; do components jinhe bilkul wahi live value dekhni ya badalni hai unhe ek alag pattern chahiye, jaise state ko shared parent component tak upar le jaana ya Context use karna.',
      },
      {
        q: 'How does the generic type parameter in a hook like `useFetch<T>(url: string)` let different callers get correctly, independently typed data, without the hook itself knowing the shape in advance?',
        qHi: '\`useFetch<T>(url: string)\` jaise hook mein generic type parameter alag-alag callers ko sahi, alag-alag typed data kaise deta hai, hook ko khud pehle se shape jaane bina?',
        a: 'A generic function\'s type parameter — the `T` in `useFetch<T>` — is a placeholder that each individual call site fills in with a concrete type, exactly the way generic functions work outside of hooks (covered in the TypeScript course\'s generics module); nothing about this mechanism is specific to hooks or React. When one component calls `useFetch<Profile>(url)`, TypeScript substitutes `Profile` everywhere `T` appears in the hook\'s type signature for that specific call, so the returned `data` is typed as `Profile | null`. A different component calling `useFetch<Order>(otherUrl)` gets an entirely separate substitution, with `data` typed as `Order | null` for that call. The hook\'s own implementation is written once, generically, using `T` as an abstract placeholder — it never needs to know in advance what concrete types its future callers will supply, since the substitution happens independently at each call site.',
        aHi: 'Generic function ka type parameter — \`useFetch<T>\` mein \`T\` — ek placeholder hai jise har akela call site ek concrete type se bharta hai, bilkul jaise generic functions hooks se bahar kaam karte hain (TypeScript course ke generics module mein cover hua); is mechanism mein hooks ya React ke liye khaas kuch nahi hai. Jab ek component \`useFetch<Profile>(url)\` bulaata hai, TypeScript us khaas call ke liye hook ke type signature mein jahan-jahan \`T\` aata hai wahan \`Profile\` daal deta hai, isliye return hua \`data\` \`Profile | null\` type ka hota hai. Ek alag component jo \`useFetch<Order>(otherUrl)\` bulaata hai use poori tarah alag substitution milta hai, us call ke liye \`data\` \`Order | null\` type ka hota hai. Hook ka apna implementation ek baar, generically likha jaata hai, \`T\` ko ek abstract placeholder ki tarah use karte hue — use pehle se jaanne ki zarurat kabhi nahi ki uske aane wale callers kaunse concrete types denge, kyunki substitution har call site par alag-alag hota hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken Header/Sidebar example with the intentionally dropped cleanup in Sidebar\'s copy. Mount and unmount Sidebar repeatedly (e.g., by conditionally rendering it from a parent\'s toggle button) and confirm listeners accumulate, while doing the same to Header does not.',
        taskHi: 'Sidebar ki copy mein jaan-boojhkar chhoote hue cleanup wala toota Header/Sidebar example banao. Sidebar ko baar-baar mount aur unmount karo (jaise parent ke toggle button se conditionally render karke) aur confirm karo listeners jama hote hain, jabki Header ke saath aisa nahi hota.',
        hint: 'Use the browser DevTools\' Event Listeners panel on the window object to directly count accumulated listeners after several mount/unmount cycles.',
        hintHi: 'Kai mount/unmount cycles ke baad jama hue listeners seedha ginne ke liye window object par browser DevTools ka Event Listeners panel use karo.',
      },
      {
        task: 'Extract useWindowWidth and have both Header and Sidebar call it. Confirm both now clean up correctly, and add a console.log inside the hook to confirm it runs independently for each component (once per component instance, not once total).',
        taskHi: 'useWindowWidth nikaalo aur Header aur Sidebar dono ko wo bulaao. Confirm karo dono ab sahi tarike se cleanup karte hain, aur hook ke andar ek console.log jodo confirm karne ke liye ki ye har component ke liye alag-alag chalta hai (har component instance ke liye ek baar, kul milaakar ek baar nahi).',
        hint: 'Render both Header and Sidebar at once and count how many times the console.log fires on mount — it should be twice, once per component, not once shared.',
        hintHi: 'Header aur Sidebar dono ko ek saath render karo aur ginno mount par console.log kitni baar chalta hai — ye do baar hona chahiye, har component ke liye ek, ek shared baar nahi.',
      },
      {
        task: 'Build the generic useFetch<T> hook and use it from two different components fetching two different shapes (e.g., a Profile and a Product). Confirm each gets correctly, independently typed data with full autocomplete in your editor.',
        taskHi: 'Generic useFetch<T> hook banao aur ise do alag components se use karo jo do alag shapes fetch karte hain (jaise ek Profile aur ek Product). Confirm karo har ek ko sahi, alag-alag typed data milta hai apne editor mein poore autocomplete ke saath.',
        hint: 'Deliberately access a field on the fetched data that does not exist on that type (e.g., profile.email when Profile only has name) and confirm TypeScript flags it as an error.',
        hintHi: 'Jaan-boojhkar fetch hui data par aisi field access karo jo us type par maujood nahi (jaise profile.email jab Profile mein sirf name hai) aur confirm karo TypeScript ise error ki tarah flag karta hai.',
      },
    ],

    keyTakeaways: [
      'A custom hook is structurally just an ordinary function that calls React\'s built-in hooks internally — the "use" naming prefix is a convention React\'s own tooling relies on to recognize and enforce the rules of hooks, not special syntax.',
      'Hooks must be called in the same order on every render, and never conditionally, because React tracks each hook\'s state by call order, not by name — a conditional hook call can silently associate the wrong stored state with the wrong hook.',
      'Duplicated stateful logic across components has the ordinary cost of any duplicated code: a fix (or missing fix) in one copy has no mechanism for reaching the other copies, since they were never actually the same code.',
      'Custom hooks share reusable LOGIC, not shared state — every call to a custom hook creates its own entirely independent copy of the state and effects inside it; two components genuinely needing the same live value require lifting state up or Context, not a custom hook.',
      'Extracting a custom hook is worth doing once the same pattern (even a small one, like a toggle) appears across two or more components — it is one of the most common real code-review refactoring recommendations.',
      'Custom hooks can be generic, exactly like ordinary TypeScript functions — a hook like `useFetch<T>` lets each call site supply its own type argument, giving correctly and independently typed results without the hook needing to know callers\' shapes in advance.',
    ],
    keyTakeawaysHi: [
      'Custom hook structurally bas ek aam function hai jo apne andar React ke built-in hooks bulaata hai — "use" naming prefix ek convention hai jispar React ka apna tooling hooks ke rules pehchaanne aur lagu karne ke liye bharosa karta hai, koi khaas syntax nahi.',
      'Hooks ko har render par wahi kram mein bulaana chahiye, aur kabhi conditionally nahi, kyunki React har hook ki state ko call ke kram se track karta hai, naam se nahi — ek conditional hook call chupchap galat store hui state ko galat hook se jod sakti hai.',
      'Components ke aar-paar duplicated stateful logic mein kisi bhi duplicated code ki aam keemat hoti hai: ek copy mein hui fix (ya chhooti hui fix) ke doosri copies tak pahunchne ka koi mechanism nahi, kyunki wo asal mein kabhi wahi code thi hi nahi.',
      'Custom hooks reusable LOGIC share karte hain, shared state nahi — custom hook ki har call apni poori tarah alag copy banaati hai us state aur effects ki jo uske andar hain; do components jinhe asal mein wahi live value chahiye unhe state upar le jaana ya Context chahiye, koi custom hook nahi.',
      'Custom hook nikaalna tab kaam ka hai jab wahi pattern (chhota sa bhi, jaise ek toggle) do ya zyada components mein dikhe — ye asli code-review ke sabse aam refactoring sujhaavon mein se ek hai.',
      'Custom hooks generic ho sakte hain, bilkul aam TypeScript functions ki tarah — \`useFetch<T>\` jaisa hook har call site ko apna type argument dene deta hai, sahi aur alag-alag typed nateeje dete hue bina hook ko callers ki shapes pehle se jaanne ki zarurat ke.',
    ],
  },
];
