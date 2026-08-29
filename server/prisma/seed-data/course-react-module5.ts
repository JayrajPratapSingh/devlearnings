/**
 * React Complete Course — Module 5: Patterns & Architecture, lesson 1.
 *
 * The Context API: avoiding prop drilling. The broken example threads a
 * theme value through three intermediate components that never use it
 * themselves, purely to hand it down to a deeply nested component — and
 * demonstrates the real maintenance cost when a new prop needs threading
 * through every layer again. Also covers when Context is NOT the right tool
 * (high-frequency values causing broad re-renders).
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there (\'). Run `npx tsc --noEmit -p .`
 * after writing this file, before wiring it into seed.ts.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_5: CourseLesson[] = [
  {
    slug: 'context-api-avoiding-prop-drilling',
    title: 'The Context API: Avoiding Prop Drilling',
    titleHi: 'Context API: Prop Drilling Se Bachna',
    description: 'Four components deep, and three of them exist ONLY to forward a "theme" prop they never actually use.',
    descriptionHi: 'Chaar components neeche, aur unme se teen sirf isliye maujood hain ki wo ek "theme" prop aage bhejein jise wo khud kabhi use nahi karte.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 1,

    analogy: {
      en: '**Passing a note down a row of ten people versus a announcement everyone in the room can hear directly.** Threading a prop through several intermediate components that never use it themselves, just to get it to a deeply nested one, is like passing a written note hand-to-hand down a row of ten people to reach the one person at the end who actually needs to read it — every person in between has to physically take the note, notice it is not for them, and pass it along, adding effort and a chance of it getting dropped or garbled, purely to serve as a relay. Context is a loudspeaker announcement instead: anyone in the room who cares can simply listen for it directly, and the nine people in between do not need to know or do anything about a note passing through them at all, because nothing is passing "through" them anymore.',
      hi: '**Ek note ko dus logon ki line mein haath-se-haath pass karna versus ek aisi ghoshna jo room mein sabko seedha sunaayi de.** Kisi prop ko kai beech ke components se pirona jo use khud kabhi use nahi karte, sirf use ek gehre nested component tak pahunchaane ke liye, aisa hai jaise ek likha hua note haath-se-haath dus logon ki line mein pass karna taaki aakhir mein us akele vyakti tak pahunche jise use asal mein padhna hai — beech ke har vyakti ko physically note lena padta hai, notice karna padta hai ki ye unke liye nahi hai, aur use aage badhaana padta hai, mehnat aur uske girne ya bigadne ka mauka jodte hue, sirf ek relay ki tarah kaam karne ke liye. Context iske bajaye ek loudspeaker announcement hai: room mein jise bhi parwaah hai wo seedha use sun sakta hai, aur beech ke nau logon ko unse guzarte kisi note ke baare mein kuch jaanne ya karne ki zarurat hi nahi, kyunki ab kuch bhi unse "guzar" nahi raha.',
    },

    simple: `**Start broken.** A dark-mode theme value, needed by a deeply nested button, threaded through every layer in between:

\`\`\`jsx
function App() {
  const [theme, setTheme] = useState("dark");
  return <Layout theme={theme} />;
}

function Layout({ theme }) {
  // Layout never actually uses "theme" itself — it only forwards it
  return <Sidebar theme={theme} />;
}

function Sidebar({ theme }) {
  // Sidebar never uses "theme" either — same story
  return <NavItem theme={theme} label="Settings" />;
}

function NavItem({ theme, label }) {
  // Finally, four levels down, "theme" is actually used
  return <button className={theme === "dark" ? "btn-dark" : "btn-light"}>{label}</button>;
}
\`\`\`

\`App\` is the only component that owns \`theme\`, and \`NavItem\` is the only component that actually needs it — but \`Layout\` and \`Sidebar\`, sitting in between, are forced to accept \`theme\` as a prop and immediately pass it straight through to their own child, purely as relay stations. This works, but it has a real, growing cost: imagine adding a second shared value, like the logged-in user\'s name, needed by a component even deeper in the tree — every single intermediate component between \`App\` and that new destination needs a second prop added and threaded through, whether or not that component has anything to do with users. Renaming \`theme\` to \`colorScheme\` later means editing every file in the chain, not just the two that actually care about the value.

**The fix: \`createContext\` and \`useContext\` let the deep component read the value directly**

\`\`\`jsx
const ThemeContext = createContext("dark");

function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function Layout() {
  return <Sidebar />;   // no "theme" prop anywhere in sight
}

function Sidebar() {
  return <NavItem label="Settings" />;   // still no "theme" prop
}

function NavItem({ label }) {
  const theme = useContext(ThemeContext);   // reads it directly, skipping every layer in between
  return <button className={theme === "dark" ? "btn-dark" : "btn-light"}>{label}</button>;
}
\`\`\`

\`\`\`tsx
type Theme = "dark" | "light";

const ThemeContext = createContext<Theme>("dark");

function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function Layout() {
  return <Sidebar />;
}

function Sidebar() {
  return <NavItem label="Settings" />;
}

function NavItem({ label }: { label: string }) {
  const theme = useContext(ThemeContext);
  return <button className={theme === "dark" ? "btn-dark" : "btn-light"}>{label}</button>;
}
\`\`\`

\`createContext(defaultValue)\` creates a Context object — think of it as a labeled "channel" a value can be broadcast on. \`<ThemeContext.Provider value={theme}>\` wraps part of the component tree and makes \`theme\`\'s current value available to every component nested anywhere inside it, no matter how deep. \`useContext(ThemeContext)\`, called inside \`NavItem\`, reads whatever value the nearest enclosing \`Provider\` above it is currently broadcasting — completely bypassing \`Layout\` and \`Sidebar\`, neither of which need to know \`ThemeContext\` exists at all. Adding a second shared value later (the user\'s name) means creating a second Context and reading it directly wherever it is needed — \`Layout\` and \`Sidebar\` remain untouched either way, since they were never involved in the first place.

**What Context does NOT replace:** ordinary props remain the right tool for data that is genuinely specific to one component and its direct children (like \`label\` above) — Context is specifically for values that many components across different parts of the tree need, where prop drilling through components that do not care about the value becomes real, ongoing friction.`,

    simpleHi: `**Toote hue se shuru.** Ek dark-mode theme value, jo ek gehre nested button ko chahiye, beech ki har layer se pirokar pass ki gayi:

\`\`\`jsx
function App() {
  const [theme, setTheme] = useState("dark");
  return <Layout theme={theme} />;
}

function Layout({ theme }) {
  // Layout khud kabhi "theme" use nahi karta — bas use aage bhejta hai
  return <Sidebar theme={theme} />;
}

function Sidebar({ theme }) {
  // Sidebar bhi "theme" use nahi karta — wahi kahaani
  return <NavItem theme={theme} label="Settings" />;
}

function NavItem({ theme, label }) {
  // Aakhirkaar, chaar levels neeche, "theme" asal mein use hota hai
  return <button className={theme === "dark" ? "btn-dark" : "btn-light"}>{label}</button>;
}
\`\`\`

\`App\` akela component hai jo \`theme\` rakhta hai, aur \`NavItem\` akela component hai jise use asal mein chahiye — par \`Layout\` aur \`Sidebar\`, beech mein baithe hue, majboor hain \`theme\` ko prop ki tarah lene aur turant apne khud ke child ko seedha aage bhejne ke liye, sirf relay stations ki tarah. Ye kaam karta hai, par iski ek asli, badhti hui keemat hai: socho ek doosri shared value jodna, jaise logged-in user ka naam, jo tree mein aur bhi gehre kisi component ko chahiye — \`App\` aur us nayi manzil ke beech ka har akela intermediate component chahiye ki usme doosri prop jodi jaaye aur pirokar bheji jaaye, chahe us component ka users se koi lena-dena ho ya na ho. Baad mein \`theme\` ko \`colorScheme\` naam badalna matlab chain ki har file edit karna, sirf un do ko nahi jinhe asal mein value se matlab hai.

**Fix: \`createContext\` aur \`useContext\` gehre component ko value seedha padhne dete hain**

\`\`\`jsx
const ThemeContext = createContext("dark");

function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function Layout() {
  return <Sidebar />;   // kahin bhi koi "theme" prop nahi
}

function Sidebar() {
  return <NavItem label="Settings" />;   // abhi bhi koi "theme" prop nahi
}

function NavItem({ label }) {
  const theme = useContext(ThemeContext);   // seedha padhta hai, beech ki har layer skip karte hue
  return <button className={theme === "dark" ? "btn-dark" : "btn-light"}>{label}</button>;
}
\`\`\`

\`\`\`tsx
type Theme = "dark" | "light";

const ThemeContext = createContext<Theme>("dark");

function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function Layout() {
  return <Sidebar />;
}

function Sidebar() {
  return <NavItem label="Settings" />;
}

function NavItem({ label }: { label: string }) {
  const theme = useContext(ThemeContext);
  return <button className={theme === "dark" ? "btn-dark" : "btn-light"}>{label}</button>;
}
\`\`\`

\`createContext(defaultValue)\` ek Context object banaata hai — ise ek labeled "channel" ki tarah socho jispar koi value broadcast ho sakti hai. \`<ThemeContext.Provider value={theme}>\` component tree ke ek hisse ko lapetta hai aur \`theme\` ki abhi ki value ko us tree ke andar kahin bhi nested har component ke liye maujood karaata hai, chahe wo kitna bhi gehra ho. \`useContext(ThemeContext)\`, \`NavItem\` ke andar bulaya gaya, jo bhi value uske upar sabse nazdeeki lapetne wala \`Provider\` abhi broadcast kar raha hai wo padhta hai — \`Layout\` aur \`Sidebar\` ko poori tarah bekhabar chhodte hue, jinme se kisi ko bhi jaanne ki zarurat nahi ki \`ThemeContext\` maujood bhi hai. Baad mein ek doosri shared value jodna (user ka naam) matlab ek doosra Context banaana aur use seedha jahan chahiye wahan padhna — \`Layout\` aur \`Sidebar\` dono taraf se bina chhue rehte hain, kyunki wo shuru se hi shaamil the hi nahi.

**Context kya REPLACE nahi karta:** aam props us data ke liye sahi auzaar rehte hain jo sach mein ek component aur uske seedhe children ke liye khaas hai (jaise upar \`label\`) — Context khaas taur par un values ke liye hai jo tree ke alag-alag hisson ke kai components ko chahiye, jahan un components se hokar prop drilling karna jinhe value se matlab nahi hai asli, chalta hua gharshan ban jaata hai.`,

    content: `## The three pieces: \`createContext\`, \`Provider\`, and \`useContext\`

\`\`\`jsx
const ThemeContext = createContext("dark");   // 1. create the Context object, with a default value

function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={theme}>   {/* 2. broadcast a value to everything nested inside */}
      <Layout />
    </ThemeContext.Provider>
  );
}

function DeeplyNested() {
  const theme = useContext(ThemeContext);   // 3. read whatever the nearest Provider is broadcasting
}
\`\`\`

\`createContext(defaultValue)\` is called once, typically outside any component, and produces a Context object — \`defaultValue\` is only ever used by a component that calls \`useContext\` with NO matching \`Provider\` anywhere above it in the tree, which in a properly structured app is usually a sign something is missing, rather than an expected code path. \`<SomeContext.Provider value={...}>\` is a component that wraps part of the tree and makes \`value\` available to every descendant, no matter how many layers deep, as long as no OTHER \`Provider\` for the same Context sits in between (a nested \`Provider\` overrides the outer one for everything inside it). \`useContext(SomeContext)\`, called from any component, walks up the tree to find the nearest enclosing \`Provider\` and returns its current \`value\` — if that \`value\` changes, every component currently calling \`useContext\` for it re-renders with the new value automatically.

## Making the Provider double as state, so consumers can update it too

\`\`\`jsx
const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}
\`\`\`

A common, useful pattern wraps the state and its setter (or a function derived from the setter, like \`toggleTheme\`) together in one object passed as the Context\'s \`value\` — this lets any deeply nested component both READ the current value AND trigger an update to it, using the same \`useContext\` call, without props threading either direction. Extracting the state and \`Provider\` into their own dedicated component (\`ThemeProvider\` here) is standard practice, keeping the "who owns this state" logic separate from unrelated parts of \`App\`.

## A custom hook wrapping \`useContext\` for a better error message

\`\`\`jsx
const ThemeContext = createContext(undefined);

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// consuming components call useTheme() instead of useContext(ThemeContext) directly
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}
\`\`\`

Calling \`useContext\` directly on a Context whose default value is \`undefined\`, from a component that is NOT nested inside the matching \`Provider\`, silently returns \`undefined\` rather than throwing — the resulting bug (\`Cannot read property 'theme' of undefined\`) points at the destructuring line, not at the actual mistake, which is missing the \`Provider\` somewhere up the tree. A small custom hook (combining this lesson with the previous one) that checks for \`undefined\` and throws a clear, specific error is a widely used pattern that turns a confusing runtime crash into an immediately actionable message.

## When Context is the wrong tool: high-frequency values and broad re-renders

\`\`\`jsx
// Risky: mouse position changes dozens of times per second, and EVERY
// component consuming this context re-renders on every single change
const MousePositionContext = createContext({ x: 0, y: 0 });
\`\`\`

Every component that calls \`useContext\` for a given Context re-renders whenever that Context\'s \`value\` changes — for a value that changes rarely (a theme, a logged-in user, a locale setting), this is exactly the desired behavior. For a value that changes very frequently (mouse position during a drag, a value updating on every keystroke across a large tree of consumers), Context can cause far more re-rendering than a more targeted approach, since React has no built-in way to make a Context consumer re-render only when the SPECIFIC piece of the value it cares about changes — it re-renders on any change to the whole \`value\` object. This is a genuine, known limitation, and is one of the reasons dedicated state management libraries exist for cases where fine-grained update control matters more than Context\'s simplicity.

## TypeScript: typing Context, and handling the "no Provider" case

\`\`\`tsx
interface ThemeContextValue {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
\`\`\`

\`createContext<T>\` is generic — typing it as \`ThemeContextValue | undefined\`, rather than just \`ThemeContextValue\`, is deliberate and matches the runtime reality: before any \`Provider\` supplies a real value, \`undefined\` genuinely is what a consumer would get. The custom \`useTheme\` hook\'s explicit \`ThemeContextValue\` return type (not including \`undefined\`) is honest specifically because of the \`throw\` inside it — TypeScript can see that any code path returning normally must have passed the \`undefined\` check, so components calling \`useTheme()\` get a fully non-nullable value with no need for their own null check, while the underlying \`ThemeContext\`\'s more permissive type keeps the possibility honestly represented at the one place it is actually resolved.`,

    contentHi: `## Teen hisse: \`createContext\`, \`Provider\`, aur \`useContext\`

\`\`\`jsx
const ThemeContext = createContext("dark");   // 1. Context object banao, ek default value ke saath

function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={theme}>   {/* 2. andar nested har cheez ko value broadcast karo */}
      <Layout />
    </ThemeContext.Provider>
  );
}

function DeeplyNested() {
  const theme = useContext(ThemeContext);   // 3. jo bhi sabse nazdeeki Provider broadcast kar raha hai wo padho
}
\`\`\`

\`createContext(defaultValue)\` ek baar bulaya jaata hai, aam taur par kisi bhi component ke bahar, aur ek Context object banaata hai — \`defaultValue\` sirf tab use hota hai jab koi component \`useContext\` bulaata hai tree mein uske upar KOI MILTA \`Provider\` maujood na hote hue, jo ek sahi tarike se bane app mein aam taur par ye ishara hota hai ki kuch missing hai, koi ummeed kiya code path nahi. \`<SomeContext.Provider value={...}>\` ek component hai jo tree ke ek hisse ko lapetta hai aur \`value\` ko har descendant ke liye maujood karaata hai, chahe kitni bhi layers gehri ho, jab tak koi DOOSRA \`Provider\` usi Context ke liye beech mein na baitha ho (ek nested \`Provider\` apne andar sab kuch ke liye bahar wale ko override karta hai). \`useContext(SomeContext)\`, kisi bhi component se bulaaya gaya, tree mein upar chalta hai sabse nazdeeki lapetne wala \`Provider\` dhoondhne ke liye aur uski abhi ki \`value\` lautaata hai — agar wo \`value\` badalti hai, us waqt \`useContext\` bulaane wala har component apne aap nayi value ke saath dobara render hota hai.

## Provider ko state ki tarah bhi kaam karaana, taaki consumers use bhi update kar sakein

\`\`\`jsx
const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}
\`\`\`

Ek aam, kaam ka pattern state aur uske setter (ya setter se nikla function, jaise \`toggleTheme\`) ko ek object mein lapetta hai jo Context ki \`value\` ki tarah pass hota hai — ye kisi bhi gehre nested component ko abhi ki value PADHNE aur use UPDATE trigger karne dono deta hai, wahi \`useContext\` call use karte hue, kisi bhi disha mein props pirone bina. State aur \`Provider\` ko apne khud ke dedicated component mein nikaalna (yahan \`ThemeProvider\`) standard practice hai, "ye state kiski hai" wali logic ko \`App\` ke na-jude hisson se alag rakhte hue.

## \`useContext\` ko lapetta ek custom hook behtar error message ke liye

\`\`\`jsx
const ThemeContext = createContext(undefined);

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// consuming components seedha useContext(ThemeContext) ke bajaye useTheme() bulaate hain
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}
\`\`\`

Aise Context par jiski default value \`undefined\` hai seedha \`useContext\` bulaana, aise component se jo milte \`Provider\` ke andar NESTED NAHI hai, chupchap \`undefined\` lautaata hai, throw karne ke bajaye — nateeja hua bug (\`Cannot read property 'theme' of undefined\`) destructuring line ki taraf ishara karta hai, asli galti ki taraf nahi, jo tree mein kahin upar \`Provider\` missing hona hai. Ek chhota custom hook (is lesson ko pichle se jodte hue) jo \`undefined\` check karta hai aur ek saaf, khaas error throw karta hai ek achhi tarah use hone wala pattern hai jo ek confuse karne wale runtime crash ko turant kaam ka message mein badal deta hai.

## Context kab galat auzaar hai: high-frequency values aur wide re-renders

\`\`\`jsx
// Khatarnaak: mouse position ek second mein dus baar badalta hai, aur is
// context ko consume karne wala HAR component har akele badlaav par dobara render hota hai
const MousePositionContext = createContext({ x: 0, y: 0 });
\`\`\`

Diye gaye Context ke liye \`useContext\` bulaane wala har component dobara render hota hai jab bhi us Context ki \`value\` badalti hai — aise value ke liye jo kam badalta hai (theme, logged-in user, locale setting), ye bilkul chaahi hui behaviour hai. Aise value ke liye jo bahut jaldi-jaldi badalta hai (drag ke dauran mouse position, ek badi consumers ki tree mein har keystroke par badalti value), Context zyada dobara-render karaa sakta hai kisi zyada targeted tarike se — kyunki React ke paas koi built-in tarika nahi hai Context consumer ko sirf tab dobara render karaane ka jab poori \`value\` object ke us KHAAS hisse mein badlaav ho jispar use matlab hai — ye poori \`value\` object mein kisi bhi badlaav par dobara render hota hai. Ye ek asli, jaani-maani seema hai, aur un wajahon mein se ek hai ki khaas state management libraries un cases ke liye kyun maujood hain jahan baarik-daane wala update control Context ki saadgi se zyada matter karta hai.

## TypeScript: Context ko type karna, aur "koi Provider nahi" wala case sambhaalna

\`\`\`tsx
interface ThemeContextValue {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
\`\`\`

\`createContext<T>\` generic hai — ise \`ThemeContextValue | undefined\` ki tarah type karna, sirf \`ThemeContextValue\` nahi, jaan-boojhkar hai aur runtime asliyat se milta hai: kisi bhi \`Provider\` ke asli value dene se pehle, \`undefined\` sach mein wahi hai jo consumer ko milega. Custom \`useTheme\` hook ka explicit \`ThemeContextValue\` return type (\`undefined\` shaamil nahi) khaas taur par uske andar wale \`throw\` ki wajah se imaandaar hai — TypeScript dekh sakta hai ki normal roop se return hone wala koi bhi code path \`undefined\` check paar kar chuka hoga, isliye \`useTheme()\` bulaane wale components ko poori tarah non-nullable value milti hai apne khud ke null check ki zarurat bina, jabki underlying \`ThemeContext\` ka zyada permissive type us ek jagah imaandaari se sambhaavna ko darzha karta hai jahan ye asal mein resolve hoti hai.`,

    examples: [
      {
        title: 'Broken: theme prop drilled through two components that never use it',
        titleHi: 'Toota: theme prop do components se pirokar gayi jo use kabhi use nahi karte',
        code: `function App() { return <Layout theme="dark" />; }
function Layout({ theme }) { return <Sidebar theme={theme} />; }
function Sidebar({ theme }) { return <NavItem theme={theme} label="Settings" />; }
function NavItem({ theme, label }) {
  return <button className={theme === "dark" ? "btn-dark" : "btn-light"}>{label}</button>;
}`,
        codeJs: `function App() {
  const [theme, setTheme] = useState("dark");
  return <Layout theme={theme} />;
}

function Layout({ theme }) {
  return <Sidebar theme={theme} />;
}

function Sidebar({ theme }) {
  return <NavItem theme={theme} label="Settings" />;
}

function NavItem({ theme, label }) {
  return <button className={theme === "dark" ? "btn-dark" : "btn-light"}>{label}</button>;
}`,
        codeTs: `type Theme = "dark" | "light";

function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  return <Layout theme={theme} />;
}

function Layout({ theme }: { theme: Theme }) {
  return <Sidebar theme={theme} />;
}

function Sidebar({ theme }: { theme: Theme }) {
  return <NavItem theme={theme} label="Settings" />;
}

function NavItem({ theme, label }: { theme: Theme; label: string }) {
  return <button className={theme === "dark" ? "btn-dark" : "btn-light"}>{label}</button>;
}
// TypeScript does not catch this — every prop is correctly typed at
// every layer. This is a maintenance/architecture concern, not a type
// error.`,
        output: `Works correctly today. But adding a SECOND shared value (e.g., the
logged-in user's name, needed inside NavItem too) requires editing
Layout's props, Sidebar's props, AND NavItem's props — three files
touched for a value only App and NavItem actually care about.`,
        explain: 'The bug here is not a runtime error — the code works — it is the ongoing maintenance cost: every intermediate component has to know about and forward a prop it has no actual use for, and that cost compounds with every additional shared value.',
        explainHi: 'Yahan bug koi runtime error nahi hai — code kaam karta hai — ye chalta hua maintenance kharcha hai: har intermediate component ko ek prop ke baare mein jaanna aur use aage bhejna padta hai jiska use use koi asli kaam nahi, aur ye kharcha har additional shared value ke saath badhta jaata hai.',
      },
      {
        title: 'Fixed: NavItem reads the theme directly via useContext',
        titleHi: 'Theek: NavItem seedha useContext se theme padhta hai',
        code: `const ThemeContext = createContext("dark");
function App() { return <ThemeContext.Provider value="dark"><Layout /></ThemeContext.Provider>; }
function Layout() { return <Sidebar />; }
function Sidebar() { return <NavItem label="Settings" />; }
function NavItem({ label }) {
  const theme = useContext(ThemeContext);
  return <button className={theme === "dark" ? "btn-dark" : "btn-light"}>{label}</button>;
}`,
        codeJs: `const ThemeContext = createContext("dark");

function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function Layout() {
  return <Sidebar />;
}

function Sidebar() {
  return <NavItem label="Settings" />;
}

function NavItem({ label }) {
  const theme = useContext(ThemeContext);
  return <button className={theme === "dark" ? "btn-dark" : "btn-light"}>{label}</button>;
}`,
        codeTs: `type Theme = "dark" | "light";

const ThemeContext = createContext<Theme>("dark");

function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function Layout() {
  return <Sidebar />;
}

function Sidebar() {
  return <NavItem label="Settings" />;
}

function NavItem({ label }: { label: string }) {
  const theme = useContext(ThemeContext);
  return <button className={theme === "dark" ? "btn-dark" : "btn-light"}>{label}</button>;
}`,
        outputJs: `Identical visual result to the broken version, but Layout and Sidebar's
function signatures no longer mention "theme" at all — adding a second
shared value later means creating a second Context and reading it
wherever needed, with zero changes to Layout or Sidebar.`,
        outputTs: `// Identical behaviour. "createContext<Theme>('dark')" fixes the
// context's value type once — every useContext(ThemeContext) call
// anywhere in the app is correctly typed as "Theme" automatically.`,
        explain: 'Layout and Sidebar are now completely decoupled from the theme concept entirely — they could be reused in a part of the app with no theme system at all, and nothing about them would need to change.',
        explainHi: 'Layout aur Sidebar ab theme concept se poori tarah alag ho chuke hain — unhe app ke aise hisse mein bhi dobara use kiya ja sakta hai jahan koi theme system hi na ho, aur unme kuch bhi badalne ki zarurat nahi hogi.',
      },
      {
        title: 'A custom useTheme hook that throws a clear error if misused',
        titleHi: 'Ek custom useTheme hook jo galat use hone par saaf error deta hai',
        code: `const ThemeContext = createContext(undefined);
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}`,
        codeJs: `const ThemeContext = createContext(undefined);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Used correctly:
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}`,
        codeTs: `interface ThemeContextValue {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}`,
        outputJs: `Rendering ThemeToggleButton WITHOUT wrapping it in ThemeProvider throws
"Error: useTheme must be used within a ThemeProvider" immediately — a
clear, specific message pointing at the actual mistake, instead of a
confusing "Cannot read property 'theme' of undefined" pointing at the
destructuring line instead.`,
        outputTs: `// "useTheme(): ThemeContextValue" (no "| undefined") means every
// caller gets theme and toggleTheme with no null check needed —
// TypeScript trusts the throw inside useTheme to have already ruled
// out the undefined case for any code that reaches the return.`,
        explain: 'This pattern combines this lesson\'s Context with the previous lesson\'s custom hooks — useTheme is not a React built-in, it is a small custom hook wrapping useContext specifically to fail loudly and clearly rather than silently.',
        explainHi: 'Ye pattern is lesson ke Context ko pichle lesson ke custom hooks se jodta hai — \`useTheme\` koi React built-in nahi hai, ye \`useContext\` ko lapetta ek chhota custom hook hai khaas taur par chupchap fail hone ke bajaye zor se aur saaf fail hone ke liye.',
      },
    ],

    mistakes: [
      {
        wrong: `function Layout({ theme }) { return <Sidebar theme={theme} />; }
function Sidebar({ theme }) { return <NavItem theme={theme} />; }
// theme threaded through components that never use it themselves`,
        right: `function Layout() { return <Sidebar />; }
function Sidebar() { return <NavItem />; }
function NavItem() { const theme = useContext(ThemeContext); ... }`,
        why: 'Threading a prop through components that never use it themselves purely to forward it adds real, growing maintenance cost — every intermediate component must know about and pass along a value it has no actual use for, and this cost compounds with every additional shared value.',
        whyHi: 'Kisi prop ko aise components se pirona jo use khud kabhi use nahi karte sirf use aage bhejne ke liye asli, badhta hua maintenance kharcha jodta hai — har intermediate component ko ek aisi value ke baare mein jaanna aur use aage badhaana padta hai jiska use use koi asli kaam nahi, aur ye kharcha har additional shared value ke saath badhta hai.',
      },
      {
        wrong: `const ThemeContext = createContext(undefined);
function ThemeToggleButton() {
  const { theme } = useContext(ThemeContext);   // crashes if no Provider — unclear error
}`,
        right: `function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}`,
        why: 'Calling useContext directly on a Context with an undefined default, from outside its Provider, silently returns undefined — the resulting crash (destructuring a property off undefined) points at the wrong line and gives no indication that a missing Provider is the actual cause.',
        whyHi: 'Undefined default wale Context par seedha useContext bulaana, uske Provider ke bahar se, chupchap undefined lautaata hai — nateeja hua crash (undefined se property destructure karna) galat line ki taraf ishara karta hai aur koi ishara nahi deta ki asli wajah ek missing Provider hai.',
      },
      {
        wrong: `const MousePositionContext = createContext({ x: 0, y: 0 });
// updated on every mousemove — EVERY consumer anywhere in the tree
// re-renders dozens of times per second`,
        right: `// For high-frequency values, prefer passing the value directly as a
// prop to only the specific components that need it, or a state
// management library with fine-grained subscriptions`,
        why: 'Every component consuming a Context re-renders whenever that Context\'s value changes, with no built-in way to subscribe to only part of it — for values that change very frequently, this can cause far more re-rendering than a more targeted approach.',
        whyHi: 'Kisi Context ko consume karne wala har component dobara render hota hai jab bhi us Context ki value badalti hai, uske sirf ek hisse ko subscribe karne ka koi built-in tarika bina — bahut jaldi-jaldi badalne wali values ke liye, ye kisi zyada targeted tarike se kaafi zyada dobara-render karaa sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Theme (dark/light mode), authenticated user info, and locale/language selection are the three most common real-world uses of Context in production React apps** — all three are values genuinely needed across many unrelated parts of a component tree, and all three change rarely, which is exactly the profile Context is well-suited for.',
        hi: '**Theme (dark/light mode), authenticated user info, aur locale/language selection production React apps mein Context ke teen sabse aam asli-duniya istemal hain** — teeno aisi values hain jo component tree ke kai na-jude hisson mein sach mein chahiye, aur teeno kam badalti hain, aur bilkul yahi profile hai jispar Context achhi tarah fit baithta hai.',
      },
      {
        en: '**"Prop drilling" is a widely recognized term in the React community specifically because it is one of the first real architectural pain points beginners run into once an app grows past a couple of component layers** — recognizing when to reach for Context instead is considered a meaningful step in a developer\'s React growth.',
        hi: '**"Prop drilling" React community mein ek achhi tarah pehchaana naam hai khaas taur par isliye kyunki ye un pehle asli architectural dard-bindu mein se ek hai jinse beginners takraate hain jaise hi app do-teen component layers se aage badhta hai** — iske bajaye Context uthaane ka sahi waqt pehchaanna developer ki React growth mein ek matlabi kadam maana jaata hai.',
      },
      {
        en: '**Dedicated state management libraries (Redux, Zustand, Jotai, Recoil) exist partly to solve Context\'s "every consumer re-renders on any change" limitation with fine-grained subscriptions**, which is why large, complex applications with many high-frequency shared values often reach for one of these instead of raw Context.',
        hi: '**Khaas state management libraries (Redux, Zustand, Jotai, Recoil) aansik roop se Context ki "har change par har consumer re-render hota hai" seema ko baarik-daane wale subscriptions se hal karne ke liye maujood hain**, aur isi wajah se badi, complex applications jinme kai high-frequency shared values hain aksar raw Context ke bajaye in mein se ek uthaate hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What real problem does "prop drilling" cause, given that the code technically still works correctly?',
        qHi: '"Prop drilling" asal mein kya samasya cause karta hai, jabki code taknik roop se abhi bhi sahi kaam karta hai?',
        a: 'Prop drilling — threading a value through several intermediate components that never use it themselves, purely to hand it down to a deeper component — is not a correctness bug; the value does correctly reach its destination. The real cost is architectural and grows over time: every intermediate component in the chain must declare a prop for a value it has no actual use for, every one of those components\' type signatures (or PropTypes) must include it, and renaming or restructuring that value later requires editing every file in the chain, not just the two components (the source and the actual consumer) that genuinely care about it. This cost compounds with every additional shared value threaded the same way, and with every additional layer of nesting the value has to pass through.',
        aHi: 'Prop drilling — kisi value ko kai intermediate components se pirona jo use khud kabhi use nahi karte, sirf use ek gehre component tak pahunchaane ke liye — koi correctness bug nahi hai; value sahi tarike se apni manzil tak pahunchti hai. Asli keemat architectural hai aur waqt ke saath badhti hai: chain ka har intermediate component ek aisi value ke liye prop declare karta hai jiska use use koi asli kaam nahi, un har component ke type signatures (ya PropTypes) mein use shaamil karna padta hai, aur baad mein us value ka naam badalna ya use restructure karna chain ki har file edit karna maangta hai, sirf un do components (source aur asli consumer) ko nahi jinhe asal mein us se matlab hai. Ye keemat har aur shared value ke saath badhti hai jo isi tarah piroyi jaati hai, aur har aur nesting layer ke saath jisse value ko guzarna padta hai.',
      },
      {
        q: 'How does `useContext` know which value to return when called from a deeply nested component, and what happens if there is no matching `Provider` anywhere above it in the tree?',
        qHi: 'Ek gehre nested component se bulaaye jaane par \`useContext\` ye kaise jaanta hai ki kaunsi value lautaani hai, aur agar tree mein uske upar kahin bhi koi milta \`Provider\` na ho to kya hota hai?',
        a: '`useContext(SomeContext)`, when called, walks up the component tree from the calling component\'s position, looking for the nearest enclosing `<SomeContext.Provider>` — the closest one wrapping the calling component, if there happen to be multiple nested Providers for the same Context at different levels — and returns whatever value that specific Provider\'s `value` prop currently holds. If no matching `Provider` exists anywhere above the calling component in the tree, `useContext` falls back to returning the `defaultValue` that was originally passed to `createContext(defaultValue)` when the Context was created, rather than throwing an error — this default-value fallback is why forgetting to wrap part of an app in a Provider can silently produce a fallback value instead of an obvious crash, unless the default value is something like `undefined` combined with an explicit check.',
        aHi: '\`useContext(SomeContext)\`, jab bulaya jaata hai, bulaane wale component ki position se component tree mein upar chalta hai, sabse nazdeeki lapetne wala \`<SomeContext.Provider>\` dhoondhte hue — agar alag-alag levels par usi Context ke liye kai nested Providers ho to bulaane wale component ko lapetne wala sabse nazdeeki — aur jo bhi value us khaas Provider ka \`value\` prop abhi rakhta hai wo lautaata hai. Agar bulaane wale component ke upar tree mein kahin bhi koi milta \`Provider\` maujood na ho, \`useContext\` wapas us \`defaultValue\` par gir jaata hai jo Context banate waqt \`createContext(defaultValue)\` ko originally pass kiya gaya tha, koi error throw karne ke bajaye — ye default-value fallback hi wo wajah hai ki app ke ek hisse ko Provider mein lapetna bhoolna chupchap ek fallback value bana sakta hai ek zaahir crash ke bajaye, jab tak default value \`undefined\` jaisi kuch explicit check ke saath na ho.',
      },
      {
        q: 'Why does wrapping a context\'s undefined-default with a custom hook that throws an explicit error improve on calling useContext directly?',
        qHi: 'Ek context ke undefined-default ko ek custom hook mein lapetna jo explicit error throw karta hai, seedha useContext bulaane se kaise behtar hai?',
        a: 'Calling `useContext` directly on a Context whose default value is `undefined`, from a component that happens to be rendered outside the matching `Provider`, returns `undefined` without any error at the point of the `useContext` call itself — the failure instead surfaces later, typically as a crash when the calling code attempts to destructure a property off that `undefined` value (e.g., `Cannot read property \'theme\' of undefined`), pointing the developer at the destructuring line rather than at the actual root cause, which is the missing `Provider` somewhere up the tree. A custom hook that calls `useContext` internally, checks whether the result is `undefined`, and throws a specific, clear error message ("useTheme must be used within a ThemeProvider") if so, moves the failure to the earliest possible point and gives a message that directly names the actual problem, rather than leaving a developer to trace a generic property-access crash back to its real cause.',
        aHi: 'Undefined default value wale Context par seedha \`useContext\` bulaana, aise component se jo milte \`Provider\` ke bahar render hota hai, \`useContext\` call ke pal koi error diye bina \`undefined\` lautaata hai — asafalta iske bajaye baad mein saamne aati hai, aam taur par ek crash ki tarah jab bulaane wala code us \`undefined\` value se koi property destructure karne ki koshish karta hai (jaise \`Cannot read property \'theme\' of undefined\`), developer ko destructuring line ki taraf ishara karte hue, asli jad ki wajah ki taraf nahi, jo tree mein kahin upar missing \`Provider\` hai. Ek custom hook jo internally \`useContext\` bulaata hai, check karta hai ki nateeja \`undefined\` hai ya nahi, aur agar hai to ek khaas, saaf error message throw karta hai ("useTheme must be used within a ThemeProvider"), asafalta ko sabse pehle mumkin pal tak le jaata hai aur ek message deta hai jo seedha asli samasya ka naam leta hai, developer ko ek aam property-access crash ko uski asli wajah tak trace karne ke liye chhodne ke bajaye.',
      },
      {
        q: 'Why is Context a poor fit for a value that updates very frequently, like live mouse coordinates during a drag operation?',
        qHi: 'Context aise value ke liye kyun galat fit hai jo bahut jaldi-jaldi update hoti hai, jaise drag operation ke dauran live mouse coordinates?',
        a: 'Every component that calls `useContext` for a given Context re-renders whenever that Context\'s `value` changes — React has no built-in mechanism letting a consumer subscribe to only a specific part of the value, so any change to the value at all, even one that only affects a portion a particular consumer does not actually care about, triggers a re-render for every single consumer in the tree. For a value that changes rarely (a theme setting, toggled by an occasional user click), this broad re-rendering has negligible cost. For a value that changes many times per second (mouse position during a drag, a value tied to every keystroke), the same broad re-rendering behavior means every consuming component re-renders on every single change, which can produce noticeably poor performance if there are many consumers or if any of them do expensive rendering work — this is precisely the scenario where a more targeted approach (passing the value as a prop to only the specific components that need it, or a state management library offering fine-grained subscriptions) is a better fit than Context.',
        aHi: 'Diye gaye Context ke liye \`useContext\` bulaane wala har component dobara render hota hai jab bhi us Context ki \`value\` badalti hai — React ke paas koi built-in mechanism nahi hai jo consumer ko value ke sirf ek khaas hisse ko subscribe karne de, isliye value mein koi bhi badlaav, chahe wo sirf us hisse ko asar kare jispar kisi khaas consumer ko asal mein matlab hi na ho, tree ke har akele consumer ke liye re-render trigger karta hai. Aise value ke liye jo kam badalta hai (ek theme setting, kabhi-kabhaar user click se toggle hui), ye wide re-rendering mamuli keemat rakhta hai. Aise value ke liye jo ek second mein kai baar badalta hai (drag ke dauran mouse position, har keystroke se judi value), wahi wide re-rendering behaviour matlab har consuming component har akele badlaav par dobara render hota hai, jo dikhne laayak kharaab performance de sakta hai agar kai consumers hon ya unme se koi mehnga rendering kaam kare — bilkul yahi wo scenario hai jahan ek zyada targeted tarika (value ko sirf khaas components ko prop ki tarah pass karna jinhe zarurat hai, ya baarik-daane wale subscriptions dene wali ek state management library) Context se behtar fit hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken App/Layout/Sidebar/NavItem chain with theme drilled through as a prop. Then add a second unrelated shared value (a username string) needed inside NavItem, and count exactly how many files you had to touch to thread it through.',
        taskHi: 'Toota App/Layout/Sidebar/NavItem chain banao jisme theme prop ki tarah pirokar bheja gaya hai. Phir ek doosri na-judi shared value (ek username string) jodo jo NavItem ke andar chahiye, aur bilkul gino kitni files aapko use pirone ke liye chhuni padi.',
        hint: 'Deliberately count and list every file changed for the second value, then compare that count directly against the Context version in the next exercise.',
        hintHi: 'Doosri value ke liye badli gayi har file jaan-boojhkar ginno aur list karo, phir us ginti ko agle exercise wale Context version se seedha compare karo.',
      },
      {
        task: 'Fix it with createContext/Provider/useContext, then add that same second shared value (username) as a second Context and confirm Layout and Sidebar needed zero changes.',
        taskHi: 'createContext/Provider/useContext se theek karo, phir wahi doosri shared value (username) ek doosre Context ki tarah jodo aur confirm karo Layout aur Sidebar ko zero badlaav chahiye the.',
        hint: 'Try nesting a second Provider for the same Context deeper in the tree with a different value, and confirm components below that inner Provider see the inner value while components elsewhere still see the outer one.',
        hintHi: 'Usi Context ke liye ek doosra Provider tree mein aur gehra ek alag value ke saath nest karne ki koshish karo, aur confirm karo us andar wale Provider ke neeche wale components andar wali value dekhte hain jabki kahin aur ke components abhi bhi bahar wali dekhte hain.',
      },
      {
        task: 'Build the useTheme custom hook with the explicit throw. Render a consuming component OUTSIDE its ThemeProvider on purpose and read the resulting error message, then compare it to what the error would have looked like using useContext directly without the custom hook.',
        taskHi: 'Explicit throw wala useTheme custom hook banao. Jaan-boojhkar ek consuming component ko uske ThemeProvider ke BAAHAR render karo aur nateeja hui error message padho, phir use us error se compare karo jo useContext seedha custom hook ke bina use karne par dikhti.',
        hint: 'Comment out the throw temporarily to see the original, less helpful "Cannot read property of undefined" error, then restore it to see the difference directly.',
        hintHi: 'Asli, kam kaam ka "Cannot read property of undefined" error dekhne ke liye throw ko thodi der ke liye comment out karo, phir fark seedha dekhne ke liye use wapas laao.',
      },
    ],

    keyTakeaways: [
      'Prop drilling — threading a value through components that never use it themselves, purely to forward it — is not a correctness bug but a real, growing maintenance cost that compounds with every additional shared value and every layer of nesting.',
      '`createContext(defaultValue)` creates a Context object; `<SomeContext.Provider value={...}>` broadcasts a value to every descendant no matter how deep; `useContext(SomeContext)` reads the nearest enclosing Provider\'s current value directly, skipping every layer in between.',
      'Wrapping state and its setter (or derived functions) together in one object passed as a Provider\'s value lets deeply nested components both read AND update the shared value through the same useContext call.',
      'A custom hook wrapping useContext, checking for an undefined result, and throwing a specific error turns a confusing "property of undefined" crash pointing at the wrong line into an immediately actionable message pointing at the actual missing Provider.',
      'Every component consuming a Context re-renders whenever that Context\'s value changes, with no built-in way to subscribe to only part of it — Context fits values that change rarely (theme, user, locale) poorly fits values that change very frequently (live mouse position, per-keystroke values).',
      'Ordinary props remain the right tool for data genuinely specific to one component and its direct children; Context is specifically for values many components across different parts of the tree need, where prop drilling becomes real friction.',
    ],
    keyTakeawaysHi: [
      'Prop drilling — kisi value ko aise components se pirona jo use khud kabhi use nahi karte, sirf use aage bhejne ke liye — koi correctness bug nahi hai balki ek asli, badhta hua maintenance kharcha hai jo har aur shared value aur har aur nesting layer ke saath badhta hai.',
      '\`createContext(defaultValue)\` ek Context object banaata hai; \`<SomeContext.Provider value={...}>\` ek value ko har descendant ke liye broadcast karta hai chahe kitna bhi gehra ho; \`useContext(SomeContext)\` sabse nazdeeki lapetne wale Provider ki abhi ki value seedha padhta hai, beech ki har layer skip karte hue.',
      'State aur uske setter (ya nikale hue functions) ko ek object mein lapetkar Provider ki value ki tarah pass karna gehre nested components ko shared value seedha PADHNE AUR UPDATE karne dono deta hai wahi useContext call se.',
      '\`useContext\` ko lapetta ek custom hook, jo undefined nateeje ko check karta hai aur ek khaas error throw karta hai, ek confuse karne wale "property of undefined" crash ko jo galat line ki taraf ishara karta hai, ek turant kaam ke message mein badal deta hai jo asli missing Provider ki taraf ishara karta hai.',
      'Kisi Context ko consume karne wala har component dobara render hota hai jab bhi us Context ki value badalti hai, uske sirf ek hisse ko subscribe karne ka koi built-in tarika bina — Context kam badalne wali values (theme, user, locale) mein fit baithta hai, bahut jaldi-jaldi badalne wali values (live mouse position, per-keystroke values) mein kharaab fit baithta hai.',
      'Aam props us data ke liye sahi auzaar rehte hain jo sach mein ek component aur uske seedhe children ke liye khaas hai; Context khaas taur par un values ke liye hai jo tree ke alag-alag hisson ke kai components ko chahiye, jahan prop drilling asli ghars\'han ban jaata hai.',
    ],
  },
];
