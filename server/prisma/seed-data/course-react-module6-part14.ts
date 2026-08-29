/**
 * React Complete Course — Module 6: Pro, lesson 14.
 *
 * Server-Side Rendering, hydration, and React Server Components —
 * conceptual professional awareness of the rendering models beyond
 * pure client-side rendering (CSR), which is what this Vite-based
 * course builds hands-on. Broken/naive example: a pure CSR app whose
 * initial HTML is an empty shell, so the user sees a blank page until
 * JS downloads, executes, and fetches data before anything appears.
 * Fixed (buildable in this course's own Vite+Express stack): rendering
 * real HTML on the server with renderToString, sent immediately, then
 * "hydrating" that same HTML on the client with hydrateRoot rather than
 * createRoot, attaching interactivity to the existing DOM instead of
 * discarding and rebuilding it. The lesson then explains, conceptually,
 * why React Server Components go a step further than traditional SSR —
 * this course does not teach hands-on RSC implementation, since that
 * requires a framework like Next.js, but every professional React
 * developer is expected to know what problem RSC solves and why.
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

export const REACT_MODULE_6_PART14: CourseLesson[] = [
  {
    slug: 'server-rendering-hydration-server-components',
    title: 'Server-Side Rendering, Hydration, and React Server Components',
    titleHi: 'Server-Side Rendering, Hydration, Aur React Server Components',
    description: 'A candidate who has built several genuinely solid client-side React apps freezes in an interview when asked "why does Next.js exist, and what problem do Server Components actually solve?" — a question that assumes knowledge this course, being Vite-based, has not yet directly addressed.',
    descriptionHi: 'Ek candidate jisne kayi sach mein solid client-side React apps banaayi hain interview mein jam jaata hai jab poocha jaata hai "Next.js kyun maujood hai, aur Server Components asal mein kaunsi samasya sulajhaate hain?" — ek sawaal jo aise gyaan ko maanta hai jise ye course, Vite-based hote hue, abhi tak seedhe sambodhit nahi kiya.',
    difficulty: 'HARD',
    duration: 24,
    order: 14,

    analogy: {
      en: '**A restaurant where you sit down at a completely bare table and must wait while the kitchen is BUILT from scratch, the ingredients are grown, and your food is cooked, all before anything at all appears in front of you — versus a restaurant where your food is already plated and sitting on the table the moment you sit down, though a waiter still needs a moment to hand you utensils before you can actually eat — versus a restaurant where certain dishes are handed to you fully prepared, and you were never expected to need your own cooking equipment for them at all.** The bare-table restaurant is pure client-side rendering: the browser receives an essentially empty page and must download the kitchen itself (the JavaScript bundle), unpack it, and only then start cooking (fetching data and rendering components) — nothing is visible to the diner until all of that finishes. The plated-food restaurant is traditional server-side rendering: the kitchen (the server) has already cooked and plated the meal before the diner even arrives, so real, complete-looking food is sitting there immediately — but the diner still cannot actually eat until the waiter (the browser, running React\'s hydration process) finishes attaching the same utensils and place settings the kitchen used, matching the client\'s understanding of the meal to what is already on the table, so touching the food before that handoff completes does nothing. The third restaurant, serving some dishes without ever expecting the diner to bring cooking equipment at all, is React Server Components: certain components genuinely never need to run or be interactive on the client\'s own device, so their entire preparation, and the equipment (JavaScript code) it would have required, never needs to leave the kitchen in the first place — only components that genuinely need the diner\'s own hands-on interaction still arrive with their own utensils attached.',
      hi: '**Ek restaurant jahan tum ek bilkul khaali table par baithte ho aur wait karna padta hai jabki kitchen shuru se BANAAYI jaati hai, ingredients ugaaye jaate hain, aur tumhaara khaana pakaaya jaata hai, ye sab isse pehle ki tumhare saamne kuch bhi dikhe — versus ek restaurant jahan tumhaara khaana pehle se plate mein hai aur table par baitha hai jis pal tum baithte ho, chahe ek waiter ko abhi bhi tumhe utensils dene mein ek pal lagta hai isse pehle ki tum asal mein kha sako — versus ek restaurant jahan kuch dishes tumhe poori tarah taiyaar hokar di jaati hain, aur tumse kabhi apna khud ka cooking equipment inke liye chahiye hone ki ummeed nahi ki gayi thi bilkul. Khaali-table restaurant pure client-side rendering hai: browser ko ek buniyaadi roop se khaali page milta hai aur ise kitchen khud download karni hai (JavaScript bundle), ise unpack karna hai, aur tabhi cooking shuru karna hai (data fetch karna aur components render karna) — diner ko tab tak kuch bhi drishyaman nahi hota jab tak ye sab khatam na ho jaaye. Plated-food restaurant traditional server-side rendering hai: kitchen (server) ne pehle hi khaana pakaaya aur plate kiya hai isse pehle ki diner bhi pahunche, isliye asli, poora-dikhne-waala khaana turant baitha hai wahaan — par diner phir bhi asal mein kha nahi sakta jab tak waiter (browser, React ki hydration process chalate hue) wahi utensils aur place settings jodna khatam na kare jo kitchen ne istemal ki, client ki khaane ki samajh ko us se match karte hue jo pehle se table par hai, isliye handoff poora hone se pehle khaane ko chhuna kuch nahi karta. Teesra restaurant, kuch dishes serve karta hai bina kabhi diner se cooking equipment laane ki ummeed rakhe bilkul, React Server Components hai: kuch components ko sach mein kabhi client ki apni device par chalna ya interactive hona zaroori nahi hai, isliye unki poori taiyaari, aur us equipment (JavaScript code) jo iske liye zaroori hota, ko kabhi bhi kitchen se bahar nikalne ki zaroorat nahi hai shuru mein bhi — sirf wo components jinhe sach mein diner ke apne haath-se-interaction ki zaroorat hai wo abhi bhi apne utensils ke saath aate hain.',
    },

    simple: `**Start naive (this course's own default): pure client-side rendering.**

\`\`\`html
<!-- index.html, before any JavaScript runs -->
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
\`\`\`

\`\`\`jsx
// main.jsx
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
\`\`\`

This is exactly the pattern this course's own Module 1 introduced, and it is a completely valid, widely used architecture — but it is worth being explicit about what actually happens, in order, before a user sees anything at all: the browser requests \`index.html\`, which contains essentially nothing (\`<div id="root"></div>\` is empty); the browser then downloads the JavaScript bundle referenced by that HTML; once downloaded, the browser parses and executes that JavaScript, which is what actually calls \`createRoot(...).render(<App />)\`; \`App\` itself may then need to fetch data from an API before it has anything real to display, adding yet another round trip. Only after ALL of these steps complete does the user see real content — on a slow connection, or with a large JavaScript bundle, this can mean several seconds of a blank white page, and since the initial HTML genuinely contains no content, a crawler or tool that does not execute JavaScript sees nothing meaningful there either.

**The fix (buildable in this course's own stack): render real HTML on the server, then hydrate it**

\`\`\`jsx
// server.js — using React DOM's own server rendering API
import { renderToString } from "react-dom/server";
import App from "./App";

app.get("*", (req, res) => {
  const appHtml = renderToString(<App initialData={data} />);
  res.send(\`
    <div id="root">\${appHtml}</div>
    <script>window.__INITIAL_DATA__ = \${JSON.stringify(data)}</script>
    <script type="module" src="/src/main.jsx"></script>
  \`);
});
\`\`\`

\`\`\`jsx
// main.jsx — the client "adopts" the server-rendered HTML instead of replacing it
import { hydrateRoot } from "react-dom/client";
import App from "./App";

hydrateRoot(
  document.getElementById("root"),
  <App initialData={window.__INITIAL_DATA__} />
);
\`\`\`

\`renderToString\`, called on the SERVER, produces real, fully-populated HTML for the current page — the exact same components this course has been building all along, just executed once on the server before the response is sent, rather than only ever in the browser. The response the browser receives now contains actual content inside \`<div id="root">\`, so the user sees real text, images, and layout the instant the HTML arrives, with no need to wait for JavaScript at all for that initial view. \`hydrateRoot\`, called on the CLIENT in place of \`createRoot\`, is the crucial second half: rather than throwing away the server-rendered HTML and rebuilding the DOM from scratch (which would waste the very work the server just did), \`hydrateRoot\` "adopts" the existing DOM nodes already sitting in the page, attaching the event listeners and internal React bookkeeping needed to make them interactive, on the assumption that the client will produce the exact same markup the server already sent. The page is visible immediately, but it is not genuinely interactive — clicking a button does nothing — until this hydration step finishes, which is why a slow-to-hydrate page can feel visible-but-broken for a brief window.`,

    simpleHi: `**Naive se shuru (is course ka apna default): pure client-side rendering.**

\`\`\`html
<!-- index.html, koi bhi JavaScript chalne se pehle -->
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
\`\`\`

\`\`\`jsx
// main.jsx
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
\`\`\`

Ye bilkul wahi pattern hai jise is course ke apne Module 1 ne introduce kiya, aur ye ek poori tarah valid, widely used architecture hai — par ye explicit hona vazan rakhta hai ki asal mein kya hota hai, order mein, isse pehle ki user kuch bhi dekhe: browser \`index.html\` maangta hai, jismein buniyaadi roop se kuch bhi nahi hai (\`<div id="root"></div>\` khaali hai); browser phir us HTML dwara reference kiye gaye JavaScript bundle ko download karta hai; ek baar download hone ke baad, browser us JavaScript ko parse aur execute karta hai, jo asal mein \`createRoot(...).render(<App />)\` bulaata hai; \`App\` khud ko phir API se data fetch karne ki zaroorat pad sakti hai isse pehle ki iske paas dikhaane ke liye kuch asli ho, ek aur round trip jodte hue. Sirf in SAB steps ke khatam hone ke baad hi user asli content dekhta hai — ek dheemi connection par, ya ek badi JavaScript bundle ke saath, iska matlab kayi second ka khaali safed page ho sakta hai, aur kyunki asli HTML mein sach mein koi content nahi hai, ek crawler ya tool jo JavaScript execute nahi karta wahaan bhi kuch maayne-yogya nahi dekhta.

**Fix (is course ke apne stack mein banaaya jaa sakta hai): server par asli HTML render karo, phir ise hydrate karo**

\`\`\`jsx
// server.js — React DOM ki apni server rendering API istemal karte hue
import { renderToString } from "react-dom/server";
import App from "./App";

app.get("*", (req, res) => {
  const appHtml = renderToString(<App initialData={data} />);
  res.send(\`
    <div id="root">\${appHtml}</div>
    <script>window.__INITIAL_DATA__ = \${JSON.stringify(data)}</script>
    <script type="module" src="/src/main.jsx"></script>
  \`);
});
\`\`\`

\`\`\`jsx
// main.jsx — client server-rendered HTML ko replace karne ke bajaye "adopt" karta hai
import { hydrateRoot } from "react-dom/client";
import App from "./App";

hydrateRoot(
  document.getElementById("root"),
  <App initialData={window.__INITIAL_DATA__} />
);
\`\`\`

\`renderToString\`, SERVER par bulaaya gaya, current page ke liye asli, poori tarah bhari hui HTML banaata hai — bilkul wahi components jo ye course shuru se banaata aaya hai, bas server par ek baar execute kiye gaye response bhejne se pehle, sirf browser mein hamesha ke bajaye. Response jo browser ko milta hai ab \`<div id="root">\` ke andar asli content rakhta hai, isliye user asli text, images, aur layout dekhta hai HTML aane ke turant baad, us shuru wale view ke liye JavaScript ka wait karne ki koi zaroorat nahi hote hue. \`hydrateRoot\`, CLIENT par \`createRoot\` ki jagah bulaaya gaya, mahatvapoorn doosra hissa hai: server-rendered HTML ko phenkne aur DOM ko shuru se dobara banaane ke bajaye (jo server ne abhi jo kaam kiya use barbaad karega), \`hydrateRoot\` page mein pehle se baithe asli DOM nodes ko "adopt" karta hai, un event listeners aur internal React bookkeeping ko jodkar jo unhe interactive banaane ke liye zaruri hai, ye maante hue ki client bilkul wahi markup banaayega jo server ne pehle hi bheja. Page turant drishyaman hai, par ye sach mein interactive nahi hai — ek button click karna kuch nahi karta — jab tak ye hydration step khatam nahi hota, jo bataata hai ki ek dheeme-hydrate-hone-waala page thodi der ke liye drishyaman-par-tooti tarah mehsoos ho sakta hai.`,

    content: `## Hydration mismatches: when the server and client disagree

\`\`\`jsx
function Timestamp() {
  return <span>{new Date().toLocaleTimeString()}</span>; // different on server vs client
}
\`\`\`

Hydration works on the assumption that, given the same props and data, the client will produce markup identical to what the server already rendered. Anything that can genuinely produce a different result on the server versus the client — the current time, \`Math.random()\`, or a \`typeof window !== "undefined"\` check used inconsistently — breaks this assumption, since the server renders one value into the HTML while the client, hydrating moments later, computes a different one and finds it does not match what is already in the DOM. React detects this mismatch, logs a warning, and falls back to discarding and re-rendering the mismatched portion of the tree on the client — which does not crash the app, but does mean the server\'s rendering work for that portion was wasted, and briefly, the user may see a flash as the content updates. This is the concrete, professional-relevant reason components intended to be server-rendered must produce deterministic output given the same inputs, and any genuinely client-only value (like \`window.innerWidth\`, or the actual current time as the user experiences it) needs to be read after hydration, typically inside a \`useEffect\`, rather than during the render itself.

## Why React Server Components go a step further than traditional SSR

\`\`\`
Traditional SSR:
  Server renders HTML  →  Client downloads the SAME component's JS  →  Client hydrates (re-runs the component)
  Every component's CODE ships to the browser, whether or not it ever needs to be interactive there.

React Server Components:
  Server Component runs ONLY on the server, ships zero JS for itself
  Client Component ("use client") still ships JS and hydrates, same as traditional SSR
\`\`\`

Traditional server-side rendering, the \`renderToString\` + \`hydrateRoot\` pattern this lesson just built, solves the blank-page problem by giving the browser real HTML immediately — but it does not reduce how much JavaScript the browser must still download, since every component involved in producing that HTML still needs its own code shipped to the client so hydration can re-run it there. A component that renders a large block of static marketing copy, or that uses a heavy library purely to format some text, still costs the browser that library\'s entire download size, even though that component will never actually need to respond to a click or re-render on the client. React Server Components, the model frameworks like Next.js\'s App Router are built around, address this directly: a component explicitly marked (or, in that model, marked BY DEFAULT) as a Server Component runs exclusively on the server, and its output is streamed to the client in a special, React-specific serialized format — not plain HTML, and not JavaScript — that the client-side React runtime merges directly into the page. Critically, that Server Component\'s own code, and anything it imports, never needs to be part of the JavaScript bundle sent to the browser at all, since the client never runs it. A component that genuinely needs client-side interactivity — a button with an \`onClick\`, a component using \`useState\` — is explicitly marked a Client Component (conventionally with a \`"use client"\` directive at the top of its file in frameworks that support this model) and behaves essentially like a traditional SSR + hydration component: its code does ship to the client, and it does hydrate.

## Why this course, being Vite-based, teaches this conceptually rather than hands-on

React Server Components are not a feature of the \`react\` and \`react-dom\` packages alone — they require a bundler and server runtime specifically built to support the RSC protocol (splitting a build into server-only and client-only pieces, and streaming the special serialized format between them), which is why they are, in practice, primarily available through a framework like Next.js\'s App Router rather than through a plain Vite + Express setup. This does not make RSC knowledge optional for a working professional: interviewers, and real job descriptions, routinely assume familiarity with why RSC exists and what trade-off it makes, precisely because so much of the industry has moved toward frameworks built around this model. What this course\'s own stack CAN teach hands-on is exactly what this lesson built — real SSR via \`renderToString\`/\`hydrateRoot\`, and the hydration-mismatch pitfalls that come with it — which is also, not coincidentally, the same underlying mechanism a Client Component in an RSC-based framework still relies on once it reaches the browser.`,

    contentHi: `## Hydration mismatches: jab server aur client asahmat hote hain

\`\`\`jsx
function Timestamp() {
  return <span>{new Date().toLocaleTimeString()}</span>; // server par alag, client par alag
}
\`\`\`

Hydration is dhaarna par kaam karta hai ki, wahi props aur data diye jaane par, client wahi markup banaayega jo server ne pehle hi render kiya. Kuch bhi jo sach mein server par ek alag nateeja de sakta hai client ke saapeksh — current time, \`Math.random()\`, ya ek \`typeof window !== "undefined"\` check jo asangat tarike se istemal hua — is dhaarna ko todta hai, kyunki server ek value HTML mein render karta hai jabki client, kuch pal baad hydrate karte hue, ek alag ganta hai aur paata hai ki ye DOM mein pehle se jo hai us se mel nahi khaati. React is mismatch ko detect karta hai, ek chetaavni log karta hai, aur mismatched tree ke hisse ko client par hataane aur dobara render karne par wapas jaata hai — jo app ko crash nahi karta, par iska matlab hai us hisse ke liye server ka rendering kaam barbaad ho gaya, aur thodi der ke liye, user ek flash dekh sakta hai jaise content update hota hai. Ye thos, professional-mutaalliq kaaran hai ki server-render hone ke liye banaaye gaye components ko wahi inputs diye jaane par deterministic output banaana chahiye, aur koi bhi sach mein client-only value (jaisa \`window.innerWidth\`, ya user ke anubhav ke anusaar asli current time) ko hydration ke baad padhna chahiye, aksar ek \`useEffect\` ke andar, render ke dauraan hi nahi.

## React Server Components traditional SSR se ek kadam aage kyun jaate hain

\`\`\`
Traditional SSR:
  Server HTML render karta hai  →  Client usi component ki JS download karta hai  →  Client hydrate karta hai (component dobara chalaata hai)
  Har component ka CODE browser tak jaata hai, chahe wahaan iske interactive hone ki zaroorat ho ya na ho.

React Server Components:
  Server Component SIRF server par chalta hai, apne liye zero JS bhejta hai
  Client Component ("use client") abhi bhi JS bhejta hai aur hydrate hota hai, traditional SSR ki tarah
\`\`\`

Traditional server-side rendering, \`renderToString\` + \`hydrateRoot\` pattern jise is lesson ne abhi banaaya, khaali-page samasya ko browser ko turant asli HTML dekar sulajhaata hai — par ye ye kam nahi karta ki browser ko abhi bhi kitni JavaScript download karni hai, kyunki us HTML ko banaane mein shaamil har component ko abhi bhi apna khud ka code client tak bhejna hai taaki hydration ise wahaan dobara chala sake. Ek component jo static marketing copy ka ek bada block render karta hai, ya jo ek bhaari library sirf kuch text format karne ke liye istemal karta hai, phir bhi browser ko us library ki poori download size ki keemat deta hai, chahe wo component client par kabhi asal mein ek click ka jawaab dene ya dobara render hone ki zaroorat na ho. React Server Components, wo model jiske aas-paas Next.js ka App Router jaisi frameworks banaayi gayi hain, ise seedhe sambodhit karti hain: ek component explicitly (ya, us model mein, DEFAULT taur par) Server Component ki tarah maarka gaya sirf server par chalta hai, aur iska output client tak ek khaas, React-specific serialized format mein stream kiya jaata hai — saadhi HTML nahi, aur JavaScript bhi nahi — jise client-side React runtime seedhe page mein merge karta hai. Mahatvapoorn baat, us Server Component ka apna code, aur jo bhi ye import karta hai, use kabhi bhi browser ko bheji jaane waali JavaScript bundle ka hissa hone ki zaroorat nahi hai bilkul, kyunki client ise kabhi nahi chalaata. Ek component jise sach mein client-side interactivity chahiye — ek button jismein \`onClick\` hai, ek component jo \`useState\` istemal karta hai — explicitly Client Component maarka jaata hai (parampara se ek \`"use client"\` directive ke saath uski file ke oopar un frameworks mein jo is model ko support karti hain) aur buniyaadi roop se ek traditional SSR + hydration component ki tarah vyavahaar karta hai: iska code client tak jaata hai, aur ye hydrate hota hai.

## Ye course, Vite-based hote hue, ise hands-on ke bajaye conceptually kyun sikhata hai

React Server Components akele \`react\` aur \`react-dom\` packages ki feature nahi hain — inhe ek bundler aur server runtime chahiye jo khaas taur par RSC protocol support karne ke liye banaaya gaya ho (ek build ko server-only aur client-only hisso mein todna, aur unke beech khaas serialized format stream karna), yahi wajah hai ki wo, practice mein, mukhya taur par ek framework jaisa Next.js ka App Router ke zariye upalabdh hain ek saadhe Vite + Express setup ke bajaye. Ye RSC gyaan ko ek kaam karte professional ke liye vaikalpik nahi banaata: interviewers, aur asli job descriptions, aksar iski parichitata maante hain ki RSC kyun maujood hai aur ye kaunsa trade-off banaata hai, bilkul isliye kyunki industry ka itna hissa is model ke aas-paas banaayi gayi frameworks ki taraf chala gaya hai. Is course ka apna stack hands-on kya sikha sakta hai bilkul wahi hai jo is lesson ne abhi banaaya — asli SSR \`renderToString\`/\`hydrateRoot\` ke zariye, aur hydration-mismatch pitfalls jo iske saath aate hain — jo, samyog se nahi, wahi underlying mechanism bhi hai jis par ek RSC-based framework mein ek Client Component abhi bhi nirbhar karta hai ek baar ye browser tak pahunchta hai.`,

    examples: [
      {
        title: 'Naive: pure CSR shows a blank page until JS finishes',
        titleHi: 'Naive: pure CSR ek khaali page dikhaata hai jab tak JS khatam nahi hoti',
        code: `<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
// nothing visible until JS downloads, executes, and fetches data`,
        codeJs: `// main.jsx
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
// initial HTML's <div id="root"> is empty — nothing to show a crawler
// or a user on a slow connection until this script finishes running`,
        codeTs: `// main.tsx
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root") as HTMLElement;
createRoot(container).render(<App />);
// fully valid TypeScript — the blank-page delay is architectural,
// not a type-level or logic error`,
        output: `A blank white page for however long it takes to download, parse,
and execute the JS bundle, then fetch any data App itself needs.`,
        explain: 'Every step — downloading JS, executing it, fetching data — must complete before any real content exists in the page at all.',
        explainHi: 'Har step — JS download karna, ise execute karna, data fetch karna — poora hona chahiye isse pehle ki page mein koi asli content bilkul maujood ho.',
      },
      {
        title: 'Fixed: renderToString on the server, hydrateRoot on the client',
        titleHi: 'Theek: server par \`renderToString\`, client par \`hydrateRoot\`',
        code: `// server: renderToString(<App />) → real HTML sent immediately
// client: hydrateRoot(root, <App />) → adopts that HTML, adds interactivity`,
        codeJs: `// server.js
import { renderToString } from "react-dom/server";
import App from "./App";

app.get("*", (req, res) => {
  const appHtml = renderToString(<App initialData={data} />);
  res.send(\`<div id="root">\${appHtml}</div>
    <script>window.__INITIAL_DATA__ = \${JSON.stringify(data)}</script>
    <script type="module" src="/src/main.jsx"></script>\`);
});

// main.jsx
import { hydrateRoot } from "react-dom/client";
import App from "./App";

hydrateRoot(document.getElementById("root"), <App initialData={window.__INITIAL_DATA__} />);`,
        codeTs: `// server.ts
import { renderToString } from "react-dom/server";
import App from "./App";

app.get("*", (req: Request, res: Response) => {
  const appHtml = renderToString(<App initialData={data} />);
  res.send(\`<div id="root">\${appHtml}</div>
    <script>window.__INITIAL_DATA__ = \${JSON.stringify(data)}</script>
    <script type="module" src="/src/main.tsx"></script>\`);
});

// main.tsx
import { hydrateRoot } from "react-dom/client";
import App from "./App";

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <App initialData={(window as any).__INITIAL_DATA__} />
);`,
        outputJs: `Real content is visible the instant the HTML response arrives —
no blank page. The page becomes interactive shortly after, once
hydrateRoot finishes attaching event listeners to the existing DOM.`,
        outputTs: `// Identical behaviour. The (window as any) cast reflects that
// window.__INITIAL_DATA__ is set by an inline script the compiler
// has no static knowledge of — a real, common SSR pattern.`,
        explain: 'renderToString gives the browser real HTML immediately; hydrateRoot then adopts that existing DOM rather than discarding and rebuilding it, making the page interactive without wasting the server\'s rendering work.',
        explainHi: '\`renderToString\` browser ko turant asli HTML deta hai; \`hydrateRoot\` phir us maujood DOM ko adopt karta hai use hataane aur dobara banaane ke bajaye, page ko interactive banaate hue bina server ke rendering kaam ko barbaad kiye.',
      },
      {
        title: 'A hydration mismatch caused by non-deterministic render output',
        titleHi: 'Ek hydration mismatch jo non-deterministic render output se hui',
        code: `function Timestamp() {
  return <span>{new Date().toLocaleTimeString()}</span>;
  // server renders one time, client renders a different one moments later
}`,
        codeJs: `function Timestamp() {
  return <span>{new Date().toLocaleTimeString()}</span>;
}
// server renders this at request time; client re-renders it during
// hydration a moment later — the two times genuinely differ`,
        codeTs: `function Timestamp(): JSX.Element {
  return <span>{new Date().toLocaleTimeString()}</span>;
}
// fully valid TypeScript — the mismatch is a runtime data problem,
// not caught by the type checker at all`,
        output: `A React hydration warning in the console, and a brief visible flash
as React discards the server-rendered <span> content and re-renders
it on the client to resolve the mismatch.`,
        explain: 'The server and client each compute new Date() at a genuinely different moment, producing different text — breaking hydration\'s assumption that both sides produce identical markup.',
        explainHi: 'Server aur client dono \`new Date()\` ko sach mein ek alag pal par ganate hain, alag text banaate hue — hydration ki us dhaarna ko todte hue ki dono taraf samaan markup banaate hain.',
      },
    ],

    mistakes: [
      {
        wrong: `createRoot(document.getElementById("root")).render(<App />);
// used even when the server already sent real, matching HTML`,
        right: `hydrateRoot(document.getElementById("root"), <App />);
// adopts the server-rendered HTML instead of discarding it`,
        why: 'Calling createRoot on server-rendered HTML discards the DOM the server already produced and rebuilds it from scratch, wasting the server\'s rendering work entirely.',
        whyHi: 'Server-rendered HTML par \`createRoot\` bulaana us DOM ko hataata hai jo server ne pehle hi banaaya aur ise shuru se dobara banaata hai, server ke rendering kaam ko poori tarah barbaad karte hue.',
      },
      {
        wrong: `function Greeting() {
  return <span>{Math.random() > 0.5 ? "Hi!" : "Hello!"}</span>;
  // different result on server vs client — breaks hydration's assumption`,
        right: `function Greeting({ variant }) {
  return <span>{variant === "casual" ? "Hi!" : "Hello!"}</span>;
  // deterministic given the same prop, identical on server and client`,
        why: 'A component rendered on both server and client must produce identical output given the same inputs — anything genuinely random or time-dependent breaks that assumption and causes a hydration mismatch.',
        whyHi: 'Server aur client dono par render hone waale component ko wahi inputs diye jaane par identical output banaana chahiye — kuch bhi sach mein random ya samay-nirbhar us dhaarna ko todta hai aur ek hydration mismatch ka kaaran banta hai.',
      },
      {
        wrong: `// assuming the page is fully interactive the instant content is visible
<button onClick={handleClick}>Submit</button>
// clicked before hydration completes — nothing happens, no error shown`,
        right: `// showing a loading/disabled state until hydration is confirmed complete,
// or accepting the brief visible-but-not-yet-interactive window as expected`,
        why: 'Server-rendered content is visible before hydration finishes attaching event listeners, so a click during that window silently does nothing — a real production confusion, not a bug in the traditional sense.',
        whyHi: 'Server-rendered content event listeners jodne se hydration khatam hone se pehle drishyaman hota hai, isliye us window ke dauraan ek click chupchaap kuch nahi karta — ek asli production confusion, traditional arth mein ek bug nahi.',
      },
    ],

    realWorld: [
      {
        en: '**renderToString and hydrateRoot are React DOM\'s own official server-rendering APIs, documented directly by React itself** — this lesson\'s SSR pattern is not a workaround, it is the foundation frameworks like Next.js and Remix build on top of.',
        hi: '**\`renderToString\` aur \`hydrateRoot\` React DOM ke apne official server-rendering APIs hain, seedhe React khud dwara documented** — is lesson ka SSR pattern ek workaround nahi hai, ye wo bunyaad hai jis par Next.js aur Remix jaisi frameworks banaayi gayi hain.',
      },
      {
        en: '**"Why does Next.js exist if plain React already works?" and "what is a Server Component vs. a Client Component?" are genuinely standard questions at companies using or evaluating the App Router**, precisely the gap this lesson closes.',
        hi: '**"Next.js kyun maujood hai agar saadha React pehle se kaam karta hai?" aur "ek Server Component vs. ek Client Component kya hai?" un companies mein sach mein standard sawaal hain jo App Router istemal ya evaluate karti hain**, bilkul wo gap jise ye lesson band karta hai.',
      },
      {
        en: '**Hydration mismatch warnings are a genuinely common real-world bug category**, frequently caused by exactly the non-deterministic patterns (dates, random values, browser-only checks) this lesson demonstrates.',
        hi: '**Hydration mismatch warnings ek sach mein aam asli-duniya bug category hain**, aksar bilkul un non-deterministic patterns (dates, random values, browser-only checks) se hoti hain jo ye lesson darsata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What problem does traditional server-side rendering (renderToString + hydrateRoot) solve compared to pure client-side rendering, and what problem does it NOT solve?',
        qHi: 'Traditional server-side rendering (\`renderToString\` + \`hydrateRoot\`) pure client-side rendering ke saapeksh kaunsi samasya sulajhaata hai, aur ye kaunsi samasya NAHI sulajhaata?',
        a: 'In a pure client-side rendering setup, the HTML the server initially sends is essentially empty — a bare container element with no real content inside it — and everything a user actually sees is produced afterward, entirely in the browser, only once the JavaScript bundle has been downloaded, parsed, executed, and has itself run whatever code renders the actual UI, potentially after an additional round trip to fetch data the UI depends on. This means a user\'s very first impression of the page, and anything a search engine crawler or other automated tool sees without executing JavaScript, is genuinely blank for however long that entire chain of steps takes, which can be a meaningfully long delay on a slow connection or with a large JavaScript bundle. Server-side rendering solves specifically this problem: by running the same React components once on the server, before the response is even sent, and using renderToString to convert their output into real, fully-populated HTML, the response the browser receives already contains actual visible content, meaning a user (and a crawler) sees real text and layout the instant the HTML arrives, with no need to wait for JavaScript to produce that initial view at all. What server-side rendering does NOT solve, however, is how much JavaScript the browser still needs to download overall, nor does it make the page interactive any faster — the exact same component code still needs to be shipped to the browser and executed there, via hydrateRoot, so that event handlers can be attached and the page can respond to clicks and other interaction; until that hydration process completes, the content is genuinely visible but not yet interactive, meaning a user who tries to interact with the page before hydration finishes will find that nothing happens, since no event listeners have been attached to the DOM yet. So SSR solves the "blank page while waiting for JavaScript" problem, but it does not solve, and in fact leaves entirely unchanged, both the total amount of JavaScript the browser must download and the delay before the page becomes genuinely interactive.',
        aHi: 'Ek pure client-side rendering setup mein, HTML jo server shuru mein bhejta hai buniyaadi roop se khaali hai — ek nanga container element jiske andar koi asli content nahi hai — aur user asal mein jo bhi dekhta hai wo baad mein banta hai, poori tarah browser mein, sirf ek baar jab JavaScript bundle download, parse, execute ho chuka ho, aur khud wo code chala chuka ho jo asli UI render karta hai, sambhaavit roop se ek atirikt round trip ke baad us data ko fetch karne ke liye jispar UI nirbhar hai. Iska matlab hai user ka page ka bilkul pehla prabhaav, aur kuch bhi jo ek search engine crawler ya doosra automated tool bina JavaScript execute kiye dekhta hai, sach mein khaali hai chahe us poori chain ke steps ko jitna bhi samay lage, jo ek dheemi connection par ya ek badi JavaScript bundle ke saath maayne-yogya roop se lambi der ho sakti hai. Server-side rendering bilkul isi samasya ko sulajhaata hai: usi React components ko server par ek baar chalaake, response bheje jaane se pehle bhi, aur \`renderToString\` istemal karke unke output ko asli, poori tarah bhari hui HTML mein badalke, response jo browser ko milta hai pehle hi asli drishyaman content rakhta hai, matlab ek user (aur ek crawler) asli text aur layout dekhta hai HTML aane ke turant baad, us shuru wale view ke liye JavaScript ka wait karne ki zaroorat bilkul na hote hue. Server-side rendering kya NAHI sulajhaata, halaanki, ye hai ki browser ko overall kitni JavaScript abhi bhi download karni hai, na hi ye page ko kisi bhi tez interactive banaata hai — bilkul wahi component code abhi bhi browser tak bhejna hai aur wahaan execute karna hai, \`hydrateRoot\` ke zariye, taaki event handlers jode jaa sakein aur page clicks aur doosri interaction ka jawaab de sake; jab tak wo hydration process khatam nahi hoti, content sach mein drishyaman hai par abhi tak interactive nahi hai, matlab ek user jo hydration khatam hone se pehle page ke saath interact karne ki koshish karta hai paayega ki kuch nahi hota, kyunki DOM se koi event listeners abhi tak jode nahi gaye. Toh SSR "JavaScript ka wait karte hue khaali page" samasya ko sulajhaata hai, par ye sulajhaata nahi hai, aur asal mein poori tarah na-badla chhodta hai, dono JavaScript ki kul tadaad jo browser ko download karni chahiye aur page ke sach mein interactive banne se pehle ki der.',
      },
      {
        q: 'How do React Server Components reduce the amount of JavaScript shipped to the browser in a way that traditional SSR cannot, and why does this course teach that distinction conceptually rather than hands-on?',
        qHi: 'React Server Components browser ko bheji jaane waali JavaScript ki tadaad ko us tarike se kaise kam karte hain jo traditional SSR nahi kar sakta, aur ye course us farak ko hands-on ke bajaye conceptually kyun sikhaata hai?',
        a: 'Under traditional server-side rendering, every single component involved in producing a page\'s HTML still needs its own JavaScript code to be part of the bundle sent to the browser, because hydration works by having the client re-execute those same components in order to attach event listeners and internal React bookkeeping to the DOM the server already produced. This holds true regardless of whether a given component ever actually does anything interactive on the client — a component that renders a large block of static marketing copy, or that depends on a heavy library purely to format some text for display, still contributes its own code, and that library\'s entire size, to what the browser must download and execute, even though nothing about that specific component will ever need to respond to a click or manage its own client-side state. React Server Components change this by introducing a genuinely different execution model: a component explicitly designated a Server Component runs exclusively on the server, full stop, and its rendered output is sent to the client not as a JavaScript bundle to be executed, but as a special, React-specific serialized description of the resulting UI, which the client-side React runtime is able to merge directly into the page without ever needing to run that component\'s own code itself. Since the Server Component\'s code, and anything it imports, is therefore never included in what gets sent to the browser at all, the client\'s JavaScript payload can be meaningfully smaller than the equivalent traditional-SSR page, specifically for whatever fraction of the page\'s components turn out to never need client-side interactivity — only components explicitly marked as Client Components, which do need interactivity, still ship their code and still hydrate, essentially the same way every component does under traditional SSR. This course teaches the distinction conceptually, rather than as a hands-on exercise, because React Server Components are not a capability of the react and react-dom packages by themselves — implementing the RSC protocol requires a bundler and server runtime specifically built to split a build into server-only and client-only pieces and to stream the special serialized format between them, a level of build-tooling integration that, in practice, is primarily available through a framework purpose-built around this model, such as Next.js\'s App Router, rather than through a general-purpose Vite and Express setup like the one this course\'s own projects use.',
        aHi: 'Traditional server-side rendering ke neeche, ek page ki HTML banaane mein shaamil har akela component ko abhi bhi apna khud ka JavaScript code chahiye us bundle ka hissa hone ke liye jo browser ko bheja jaata hai, kyunki hydration client ko usi components ko dobara execute karaake kaam karta hai taaki event listeners aur internal React bookkeeping ko us DOM se joda jaa sake jo server ne pehle hi banaaya. Ye tab bhi sach rehta hai chahe ek diya gaya component kabhi client par asal mein kuch bhi interactive kare ya na kare — ek component jo static marketing copy ka ek bada block render karta hai, ya jo ek bhaari library par nirbhar karta hai sirf display ke liye kuch text format karne ke liye, phir bhi apna khud ka code, aur us library ka poora size, us cheez mein yogdaan deta hai jo browser ko download aur execute karna hai, chahe us khaas component ke baare mein kuch bhi kabhi ek click ka jawaab dene ya apni client-side state manage karne ki zaroorat na ho. React Server Components ise ek sach mein alag execution model introduce karke badalte hain: ek component jise explicitly Server Component nirdisht kiya gaya sirf server par chalta hai, poora point, aur iska rendered output client ko ek JavaScript bundle ki tarah nahi bheja jaata execute hone ke liye, balki ek khaas, React-specific serialized description ki tarah nateeje wali UI ka, jise client-side React runtime seedhe page mein merge kar sakta hai bina kabhi us component ke khud ke code ko chalaane ki zaroorat ke. Kyunki Server Component ka code, aur jo bhi ye import karta hai, isliye kabhi bhi us cheez mein shaamil nahi hai jo browser ko bheji jaati hai bilkul, client ka JavaScript payload maayne-yogya roop se chhota ho sakta hai barabar traditional-SSR page ke saapeksh, khaas taur par page ke components ke us hisse ke liye jo kabhi client-side interactivity ki zaroorat nahi rakhte — sirf wo components jo explicitly Client Components maarke gaye hain, jinhe interactivity chahiye, phir bhi apna code bhejte hain aur phir bhi hydrate hote hain, buniyaadi roop se usi tarah jaise har component traditional SSR ke neeche karta hai. Ye course is farak ko conceptually sikhaata hai, ek hands-on exercise ki tarah nahi, kyunki React Server Components \`react\` aur \`react-dom\` packages ki apni ek kshamta nahi hain — RSC protocol lagu karne ke liye ek bundler aur server runtime chahiye jo khaas taur par ek build ko server-only aur client-only hisso mein todne aur unke beech khaas serialized format stream karne ke liye banaaya gaya ho, build-tooling integration ka ek star jo, practice mein, mukhya taur par ek framework ke zariye upalabdh hai jo is model ke aas-paas khaas taur par banaayi gayi hai, jaisa Next.js ka App Router, ek general-purpose Vite aur Express setup ke zariye nahi jaisa is course ke apne projects istemal karte hain.',
      },
    ],

    exercises: [
      {
        task: 'In a small Vite + Express project, add a server route that uses renderToString to send real HTML for the initial page load, following this lesson\'s example. Confirm via "view source" (not devtools\' Elements panel, which shows the hydrated DOM) that the raw HTML response genuinely contains real content.',
        taskHi: 'Ek chhote Vite + Express project mein, ek server route jodo jo \`renderToString\` istemal karta hai shuru ke page load ke liye asli HTML bhejne ke liye, is lesson ke example ka palan karte hue. "View source" ke zariye confirm karo (devtools ke Elements panel se nahi, jo hydrated DOM dikhaata hai) ki raw HTML response sach mein asli content rakhta hai.',
        hint: 'Right-click the page and choose "View Page Source" specifically, since this shows the actual bytes the server sent, unlike the Elements panel which reflects the DOM after React has run.',
        hintHi: 'Page par right-click karo aur khaas taur par "View Page Source" chuno, kyunki ye asli bytes dikhaata hai jo server ne bheje, Elements panel ke ulta jo React chalne ke baad DOM darsata hai.',
      },
      {
        task: 'Switch main.jsx from createRoot to hydrateRoot, matching the server-rendered HTML. Deliberately introduce a hydration mismatch (e.g. rendering new Date() in a component) and observe the console warning and visible flash this lesson describes.',
        taskHi: '\`main.jsx\` ko \`createRoot\` se \`hydrateRoot\` mein badlo, server-rendered HTML se match karte hue. Jaan-boojhkar ek hydration mismatch introduce karo (jaise ek component mein \`new Date()\` render karna) aur us console warning aur drishyaman flash ko dekho jise ye lesson describe karta hai.',
        hint: 'Compare what the server actually sent (view source) against what ends up in the DOM after hydration completes, to see exactly which part React discarded and re-rendered.',
        hintHi: 'Server ne asal mein kya bheja (view source) us se compare karo jo hydration khatam hone ke baad DOM mein hai, ye dekhne ke liye ki React ne asal mein kaunsa hissa hataaya aur dobara render kiya.',
      },
      {
        task: 'Write a one-paragraph explanation, in your own words, of the difference between a Server Component and a Client Component in a framework like Next.js, and why a Server Component never needs to hydrate.',
        taskHi: 'Ek paragraph mein, apne khud ke shabdon mein, ek Server Component aur ek Client Component ke beech farak samjhaao ek framework jaisa Next.js mein, aur Server Component ko kabhi hydrate karne ki zaroorat kyun nahi hoti.',
        hint: 'Focus your explanation on where each component\'s code actually executes (server only, versus server once and client again) rather than on what the resulting HTML looks like, since that is where the real distinction lives.',
        hintHi: 'Apni samjhaaish ko is baat par focus karo ki har component ka code asal mein kahaan execute hota hai (sirf server, versus server ek baar aur client dobara) us cheez ke bajaye ki nateeje wali HTML kaisi dikhti hai, kyunki asli farak wahaan rehta hai.',
      },
    ],

    keyTakeaways: [
      'Pure client-side rendering sends an essentially empty initial HTML shell, so a user sees a blank page until JavaScript downloads, executes, and often fetches data, before any real content appears.',
      'Traditional SSR (renderToString on the server) sends real, fully-populated HTML immediately, solving the blank-page problem, but every component still ships its own JS to the client for hydration to re-run.',
      'hydrateRoot, used in place of createRoot on already-server-rendered HTML, adopts the existing DOM and attaches interactivity rather than discarding and rebuilding it from scratch.',
      'A hydration mismatch happens when a component produces different output on the server versus the client (dates, random values, inconsistent environment checks), forcing React to discard and re-render that portion.',
      'React Server Components go further than traditional SSR: a Server Component runs only on the server and never ships its own code to the client at all, unlike a Client Component, which still ships code and hydrates.',
      'This course teaches SSR and hydration hands-on, since they work with a plain Vite + Express stack, but covers Server Components conceptually, since implementing the RSC protocol requires a framework built around it.',
    ],
    keyTakeawaysHi: [
      'Pure client-side rendering ek buniyaadi roop se khaali shuru ki HTML shell bhejta hai, isliye user ek khaali page dekhta hai jab tak JavaScript download, execute, aur aksar data fetch nahi karti, isse pehle ki koi asli content dikhe.',
      'Traditional SSR (server par \`renderToString\`) turant asli, poori tarah bhari hui HTML bhejta hai, khaali-page samasya sulajhaate hue, par har component abhi bhi apna khud ka JS client ko bhejta hai hydration ke dobara chalaane ke liye.',
      '\`hydrateRoot\`, pehle-se-server-rendered HTML par \`createRoot\` ki jagah istemal hota hai, maujood DOM ko adopt karta hai aur interactivity jodta hai use hataane aur shuru se dobara banaane ke bajaye.',
      'Ek hydration mismatch tab hota hai jab ek component server par client ke saapeksh alag output banaata hai (dates, random values, asangat environment checks), React ko us hisse ko hataane aur dobara render karne par majboor karte hue.',
      'React Server Components traditional SSR se aage jaate hain: ek Server Component sirf server par chalta hai aur apna khud ka code kabhi client ko bilkul nahi bhejta, ek Client Component ke ulta, jo abhi bhi code bhejta hai aur hydrate hota hai.',
      'Ye course SSR aur hydration hands-on sikhaata hai, kyunki wo ek saadhe Vite + Express stack ke saath kaam karte hain, par Server Components ko conceptually cover karta hai, kyunki RSC protocol lagu karne ke liye ek aisi framework chahiye jo iske aas-paas banaayi gayi ho.',
    ],
  },
];
