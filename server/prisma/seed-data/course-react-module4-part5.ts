/**
 * React Complete Course — Module 4: Hooks & Performance, lesson 5 (final
 * lesson of Module 4).
 *
 * useSyncExternalStore and useId: two React 18 hooks that solve narrower,
 * more infrastructure-level problems than the rest of this module, but
 * are genuinely asked about in senior/pro-level interviews. Broken
 * example 1: a hand-rolled useState+useEffect subscription to an
 * external store (window.innerWidth) that is prone to "tearing" under
 * concurrent rendering — different components reading the same external
 * value can transiently disagree, since each hook's local state update
 * happens independently via its own effect rather than being read
 * synchronously as part of one render. Fixed with useSyncExternalStore,
 * which reads the store synchronously during render and is what React
 * itself guarantees tearing-safety for. Broken example 2: a reusable
 * form-field component generating its own id via a module-level
 * incrementing counter, which breaks under Strict Mode's double-render,
 * conditional rendering, and server/client hydration. Fixed with useId,
 * which produces a stable id consistent between server and client.
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

export const REACT_MODULE_4_PART5: CourseLesson[] = [
  {
    slug: 'usesyncexternalstore-useid',
    title: 'useSyncExternalStore and useId: Safe Subscriptions and Stable IDs',
    titleHi: 'useSyncExternalStore Aur useId: Surakshit Subscriptions Aur Sthir IDs',
    description: 'Two components on the same page both display the browser window\'s current width, reading from the exact same hand-rolled subscription hook. During a fast resize, they briefly show two DIFFERENT numbers at the same instant, despite both supposedly reading the same value.',
    descriptionHi: 'Ek hi page par do components dono browser window ki current width dikhaate hain, bilkul ek hi hand-rolled subscription hook se padhte hue. Ek tez resize ke dauraan, wo thodi der ke liye ek hi pal do ALAG numbers dikhaate hain, chahe dono maana jaata hai ki wahi value padh rahe hain.',
    difficulty: 'HARD',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A stadium scoreboard read by two separate ushers, each writing the score down on their own notepad a few seconds after glancing up at the board, versus every usher simply reading the same live board directly at the exact moment they need the score.** In the notepad system, if the scoreboard changes right as one usher happens to be mid-glance while the other has not looked up yet, the two ushers\' notepads can briefly disagree about what the actual current score is — not because the scoreboard itself is ambiguous, but because each usher\'s own notepad update happens on its own separate schedule, slightly out of sync with the board and with each other. In the direct-read system, there is no notepad lag to create disagreement at all — anyone asking either usher what the score is right now gets an answer read directly off the one shared board at that exact instant, so two ushers asked at the same moment can never give different answers. A custom subscription hook built from useState and useEffect is the notepad system: each component\'s own local state is a notepad, updated on its own schedule slightly after the actual external value (like window.innerWidth) changes, and under React 18\'s concurrent rendering, two components\' notepads can transiently disagree. useSyncExternalStore is the direct-read system: it requires a getSnapshot function that reads the external value directly and synchronously, at the exact moment React needs it during a render, which is what allows React to guarantee that every component reading from that store during the same render sees the same, consistent value.',
      hi: '**Ek stadium scoreboard jise do alag ushers padhte hain, har ek board ki taraf dekhne ke kuch second baad apne khud ke notepad par score likh kar, versus har usher bas usi live board ko seedhe padhta hai bilkul us pal jab unhe score chahiye.** Notepad system mein, agar scoreboard badalta hai bilkul jab ek usher beech-dekh mein hai jabki doosre ne abhi tak nahi dekha, do ushers ke notepads thodi der ke liye is baat par asahmat ho sakte hain ki asli current score kya hai — is wajah se nahi ki scoreboard khud aspashta hai, balki isliye kyunki har usher ka apna notepad update apne alag schedule par hota hai, board se aur ek doosre se thoda out-of-sync. Direct-read system mein, asahmati paida karne ke liye koi notepad lag bilkul nahi hai — kisi ko bhi kisi usher se poochhte hue ki abhi score kya hai us ek shared board se seedhe padha gaya jawaab milta hai bilkul us pal, isliye ek hi pal poochhe gaye do ushers kabhi alag jawaab nahi de sakte. \`useState\` aur \`useEffect\` se banaaya gaya ek custom subscription hook notepad system hai: har component ki apni local state ek notepad hai, apne khud ke schedule par update hoti hai asli external value (jaisa \`window.innerWidth\`) badalne ke thodi der baad, aur React 18 ki concurrent rendering ke neeche, do components ke notepads thodi der ke liye asahmat ho sakte hain. \`useSyncExternalStore\` direct-read system hai: ise ek \`getSnapshot\` function chahiye jo external value ko seedhe aur synchronously padhta hai, bilkul us pal jab React ko iski zaroorat hai ek render ke dauraan, jo React ko ye guarantee karne deta hai ki usi render ke dauraan us store se padhne wala har component ek samaan, sthir value dekhta hai.',
    },

    simple: `**Start broken.** A hand-rolled useState + useEffect subscription to window.innerWidth:

\`\`\`jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function HeaderWidth() {
  return <span>{useWindowWidth()}</span>;
}

function SidebarWidth() {
  return <span>{useWindowWidth()}</span>;
}
\`\`\`

This pattern predates React 18\'s concurrent rendering, and for a long time it was the standard, entirely reasonable way to subscribe a component to an external, non-React value. The subtle problem it has under concurrent rendering is this: each component calling \`useWindowWidth\` maintains its OWN independent \`useState\`, updated by its OWN \`useEffect\`\'s resize listener, entirely separately from any other component also calling the same hook. Nothing links these two components\' local state updates together as part of one atomic operation — if \`window.innerWidth\` changes right as React is in the middle of a concurrent render that touches both \`HeaderWidth\` and \`SidebarWidth\`, it is possible for one component to have already re-rendered with the new width while the other briefly still shows the old one, since each component\'s own effect fires and updates its own state independently, on its own schedule. This inconsistency, where different parts of the UI momentarily disagree about the same underlying external value, is what React documentation calls "tearing" — and it is specifically a problem this useState + useEffect pattern does not protect against.

**The fix: useSyncExternalStore, which React itself guarantees is tearing-safe**

\`\`\`jsx
import { useSyncExternalStore } from "react";

function subscribe(callback) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot() {
  return window.innerWidth;
}

function useWindowWidth() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
\`\`\`

\`\`\`tsx
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot(): number {
  return window.innerWidth;
}

function useWindowWidth(): number {
  return useSyncExternalStore(subscribe, getSnapshot);
}
\`\`\`

\`useSyncExternalStore\` takes two functions: \`subscribe\`, which registers a callback to be invoked whenever the external store might have changed (here, on every \`resize\` event) and returns a cleanup function, and \`getSnapshot\`, which SYNCHRONOUSLY reads and returns the store\'s current value at the exact moment it is called. Because \`getSnapshot\` is read directly during render, rather than through an intermediate \`useState\` that updates asynchronously via an effect, React can compare snapshot values across every component reading from the same store during a single render and guarantee they are all consistent — if a concurrent render is interrupted and resumed, or if multiple components read the same store, React re-checks \`getSnapshot\`\'s value as needed to ensure the whole render reflects one single, coherent snapshot of the external world, rather than a mix of old and new values from different components\' own independently-scheduled updates.`,

    simpleHi: `**Toote hue se shuru.** \`window.innerWidth\` ko ek hand-rolled \`useState\` + \`useEffect\` subscription:

\`\`\`jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function HeaderWidth() {
  return <span>{useWindowWidth()}</span>;
}

function SidebarWidth() {
  return <span>{useWindowWidth()}</span>;
}
\`\`\`

Ye pattern React 18 ki concurrent rendering se pehle ka hai, aur lambe samay tak ye ek component ko ek external, non-React value tak subscribe karne ka standard, bilkul vyaajbi tarika tha. Concurrent rendering ke neeche iski jo sookshm samasya hai wo ye hai: \`useWindowWidth\` bulaane wala har component apna KHUD ka alag \`useState\` rakhta hai, apne KHUD ke \`useEffect\` ke resize listener se update hota hai, poori tarah kisi bhi doosre component se alag jo wahi hook bulaata hai. Kuch bhi in do components ki local state updates ko ek atomic operation ke hisse ki tarah saath nahi jodta — agar \`window.innerWidth\` badalta hai bilkul jab React ek concurrent render ke beech mein hai jo \`HeaderWidth\` aur \`SidebarWidth\` dono ko chhuta hai, ye mumkin hai ki ek component pehle hi naye width ke saath dobara render ho chuka ho jabki doosra thodi der ke liye abhi bhi purana dikhaata hai, kyunki har component ka apna effect chalta hai aur apni state update karta hai azaadi se, apne khud ke schedule par. Ye asangati, jahan UI ke alag hisse ek hi underlying external value ke baare mein thodi der ke liye asahmat hote hain, wahi hai jise React documentation "tearing" kehti hai — aur ye khaas taur par ek samasya hai jise ye \`useState\` + \`useEffect\` pattern surakshit nahi rakhta.

**Fix: \`useSyncExternalStore\`, jise React khud tearing-safe guarantee karta hai**

\`\`\`jsx
import { useSyncExternalStore } from "react";

function subscribe(callback) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot() {
  return window.innerWidth;
}

function useWindowWidth() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
\`\`\`

\`\`\`tsx
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot(): number {
  return window.innerWidth;
}

function useWindowWidth(): number {
  return useSyncExternalStore(subscribe, getSnapshot);
}
\`\`\`

\`useSyncExternalStore\` do functions leta hai: \`subscribe\`, jo ek callback register karta hai jise jab bhi external store badla ho sakta hai bulaaya jaaye (yahaan, har \`resize\` event par) aur ek cleanup function return karta hai, aur \`getSnapshot\`, jo SYNCHRONOUSLY store ki current value padhta aur return karta hai bilkul us pal jab ise bulaaya jaata hai. Kyunki \`getSnapshot\` seedhe render ke dauraan padha jaata hai, ek beech ke \`useState\` ke zariye nahi jo ek effect se asynchronously update hota hai, React ek hi render ke dauraan usi store se padhne wale har component ke aar-paar snapshot values ki tulna kar sakta hai aur guarantee kar sakta hai ki wo sab consistent hain — agar ek concurrent render interrupt aur resume hota hai, ya agar kayi components ek hi store padhte hain, React \`getSnapshot\` ki value ko zaroorat ke anusaar dobara check karta hai ye sunishchit karne ke liye ki poora render bahri duniya ka ek akela, samvedansheel snapshot darsata hai, alag components ki apni azaadi-se-schedule-ki-gayi updates se purani aur nayi values ke mix ke bajaye.`,

    content: `## useId: stable, server/client-consistent IDs for a reusable component

\`\`\`jsx
function useId() { // conceptual — the module-level counter this replaces
  return \`field-\${idCounter++}\`;
}
\`\`\`

\`useSyncExternalStore\` solves reading external, non-React state consistently. \`useId\` solves a related but different infrastructure problem: giving a reusable component, one that might render multiple instances of itself on the same page, a genuinely unique id for each instance — needed for correctly linking a \`<label htmlFor>\` to its \`<input id>\`, or for \`aria-describedby\` — while also making sure that id is IDENTICAL between the server-rendered HTML and the client\'s hydrated version of the same component instance.

## The broken version: a module-level counter

\`\`\`jsx
let idCounter = 0;
function nextId() {
  return \`field-\${idCounter++}\`;
}

function FormField({ label }) {
  const id = useMemo(() => nextId(), []);
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}
\`\`\`

This looks reasonable in isolation, but it breaks in several genuinely common situations. Under React\'s Strict Mode, component functions are deliberately invoked twice during development specifically to surface exactly this kind of bug, which can cause the counter to advance differently than expected. Across a server-rendered and then client-hydrated app, the counter starts fresh at \`0\` independently on the server and in the browser, so the very first \`FormField\` instance gets \`field-0\` on the server but, if the client happens to render components in a different order, or if some earlier component consumed an id on the client but not the server (or vice versa), a completely different id on the client — producing a mismatch between the server-rendered HTML\'s \`id\` attribute and the client\'s expectation of what that id should be, which is exactly the kind of inconsistency React\'s hydration process is designed to detect and warn about. Conditional rendering compounds this further: if an earlier \`FormField\` is conditionally skipped on one render pass but not another, every subsequent instance\'s id shifts, potentially producing duplicate id attributes elsewhere on the page — a real, invalid-HTML bug, since id values are supposed to be unique across an entire document.

## The fix: useId

\`\`\`jsx
import { useId } from "react";

function FormField({ label }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}
\`\`\`

\`\`\`tsx
import { useId } from "react";

function FormField({ label }: { label: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}
\`\`\`

\`useId\` generates its id based on the calling component\'s actual POSITION within the overall component tree, computed identically by React on the server and during client hydration, rather than from an incrementing counter that has no awareness of tree structure and can drift out of sync between environments. Because the id is derived from where in the tree a given \`FormField\` instance actually sits, rather than from the order in which some global counter happened to be incremented, it is both genuinely unique per instance (two \`FormField\`s at different tree positions get different ids) and consistent between server and client renders of the same instance, with no risk of the kind of drift a manual counter is vulnerable to. A single call to \`useId\` can also be reused for multiple related ids within one component by appending a suffix, such as \`\${id}-label\` and \`\${id}-error\`, when a component needs more than one uniquely-identified element.

## Both hooks solve infrastructure problems, not everyday ones

Most components never need \`useSyncExternalStore\` directly — it is primarily meant for library authors building reusable subscription hooks (form libraries, state-management libraries, browser-API wrappers) that other developers\' components will call, and application code often reaches it indirectly through such a library rather than calling it by hand. \`useId\` is reached for specifically when building a genuinely reusable component library, or any component that must produce ids consistent between server-rendered and hydrated output — an app that only ever server-renders nothing, or that never has more than one instance of a given form field on a page, may never encounter the specific bug either hook exists to prevent, but both are standard knowledge for anyone building shared component infrastructure or working in a codebase that does.`,

    contentHi: `## useId: ek reusable component ke liye sthir, server/client-consistent IDs

\`\`\`jsx
function useId() { // conceptual — jis module-level counter ki jagah ye leta hai
  return \`field-\${idCounter++}\`;
}
\`\`\`

\`useSyncExternalStore\` external, non-React state ko consistently padhna sulajhaata hai. \`useId\` ek judi par alag infrastructure samasya sulajhaata hai: ek reusable component ko, jo apne aap ke kayi instances ek hi page par render kar sakta hai, har instance ke liye ek sach mein unique id dena — ek \`<label htmlFor>\` ko iske \`<input id>\` se sahi tarike se jodne ke liye zaruri, ya \`aria-describedby\` ke liye — jabki ye bhi sunishchit karte hue ki wo id server-rendered HTML aur usi component instance ke client ke hydrated version ke beech IDENTICAL hai.

## Toota version: ek module-level counter

\`\`\`jsx
let idCounter = 0;
function nextId() {
  return \`field-\${idCounter++}\`;
}

function FormField({ label }) {
  const id = useMemo(() => nextId(), []);
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}
\`\`\`

Ye alag-thalag mein vyaajbi lagta hai, par ye kayi sach mein aam sthitiyon mein tootta hai. React ke Strict Mode ke neeche, component functions jaan-boojhkar development mein do baar bulaaye jaate hain khaas taur par bilkul is tarah ke bug ko saamne laane ke liye, jo counter ko ummeed se alag tarike se aage badha sakta hai. Ek server-rendered aur phir client-hydrated app ke aar-paar, counter server par aur browser mein azaadi se \`0\` par taaza shuru hota hai, isliye pehla \`FormField\` instance server par \`field-0\` paata hai par, agar client samyog se components ko alag order mein render karta hai, ya agar kisi pehle wale component ne client par ek id consume ki par server par nahi (ya ulta), client par ek bilkul alag id — server-rendered HTML ke \`id\` attribute aur client ki ummeed ke beech ek mismatch banaate hue ki wo id kya honi chahiye, jo bilkul us tarah ki asangati hai jise React ka hydration process detect karne aur chetaavni dene ke liye design kiya gaya hai. Conditional rendering ise aur badhaata hai: agar ek pehle wala \`FormField\` ek render pass mein conditionally skip hota hai par doosre mein nahi, har baad ke instance ki id khisak jaati hai, sambhaavit roop se page par kahin aur duplicate id attributes banaate hue — ek asli, invalid-HTML bug, kyunki id values ko poore document mein unique hona chahiye.

## Fix: useId

\`\`\`jsx
import { useId } from "react";

function FormField({ label }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}
\`\`\`

\`\`\`tsx
import { useId } from "react";

function FormField({ label }: { label: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}
\`\`\`

\`useId\` apni id bulaane wale component ki asli POSITION ke aadhaar par banaata hai poore component tree ke andar, jo React dwara server par aur client hydration ke dauraan samaan roop se gani jaati hai, ek incrementing counter ke bajaye jise tree structure ka koi gyaan nahi hai aur jo environments ke beech out-of-sync ho sakta hai. Kyunki id iss se nikaali jaati hai ki tree mein ek diya gaya \`FormField\` instance asal mein kahaan baitha hai, kisi global counter ke increment hone ke order se nahi, ye dono sach mein unique hai prati-instance (alag tree positions par do \`FormField\`s ko alag ids milti hain) aur server aur client renders ke beech consistent hai usi instance ke liye, us tarah ke drift ke khatre ke bina jiske liye ek manual counter vulnerable hai. \`useId\` ki ek akeli call ko ek component ke andar kayi jude ids ke liye bhi dobara istemal kiya jaa sakta hai ek suffix jodkar, jaisa \`\${id}-label\` aur \`\${id}-error\`, jab ek component ko ek se zyaada uniquely-identified element chahiye.

## Dono hooks infrastructure samasyaon ko sulajhaate hain, rozmarra ki nahi

Adhikaansh components ko kabhi seedhe \`useSyncExternalStore\` ki zaroorat nahi hoti — ye mukhya taur par library authors ke liye hai jo reusable subscription hooks banaate hain (form libraries, state-management libraries, browser-API wrappers) jinhe doosre developers ke components bulaayenge, aur application code aksar ise aisi library ke zariye parokh roop se pahunchta hai haath se bulaane ke bajaye. \`useId\` khaas taur par tab istemal hota hai jab ek sach mein reusable component library banaayi jaa rahi ho, ya koi bhi component jise server-rendered aur hydrated output ke beech consistent ids banaani hain — ek app jo kabhi kuch bhi server-render nahi karta, ya jismein kabhi ek page par ek diye gaye form field ka ek se zyaada instance nahi hota, shaayad us khaas bug ko kabhi na dekhe jise koi bhi hook rokne ke liye maujood hai, par dono standard gyaan hain kisi ke liye bhi jo shared component infrastructure banaata hai ya ek aisi codebase mein kaam karta hai jo aisa karti hai.`,

    examples: [
      {
        title: 'Broken: useState + useEffect subscription is prone to tearing',
        titleHi: 'Toota: \`useState\` + \`useEffect\` subscription tearing ke prone hai',
        code: `const [width, setWidth] = useState(window.innerWidth);
useEffect(() => {
  const handler = () => setWidth(window.innerWidth);
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}, []);`,
        codeJs: `function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function HeaderWidth() { return <span>{useWindowWidth()}</span>; }
function SidebarWidth() { return <span>{useWindowWidth()}</span>; }
// under concurrent rendering, these two can transiently disagree`,
        codeTs: `function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
// fully valid TypeScript — tearing is a scheduling/consistency
// problem, not a type error`,
        output: `During a fast resize, HeaderWidth and SidebarWidth can briefly
render with two different width values at the same instant, since
each maintains its own independently-scheduled local state.`,
        explain: 'Each component\'s useWindowWidth call has its own useState, updated by its own useEffect\'s resize listener, with nothing synchronizing the two across a single render.',
        explainHi: 'Har component ki \`useWindowWidth\` call ka apna \`useState\` hai, apne \`useEffect\` ke resize listener se update hota hai, kuch bhi dono ko ek akele render ke aar-paar synchronize nahi karta.',
      },
      {
        title: 'Fixed: useSyncExternalStore, tearing-safe by construction',
        titleHi: 'Theek: \`useSyncExternalStore\`, nirmaan se tearing-safe',
        code: `function useWindowWidth() {
  return useSyncExternalStore(subscribe, getSnapshot);
}`,
        codeJs: `function subscribe(callback) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot() {
  return window.innerWidth;
}

function useWindowWidth() {
  return useSyncExternalStore(subscribe, getSnapshot);
}`,
        codeTs: `function subscribe(callback: () => void): () => void {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot(): number {
  return window.innerWidth;
}

function useWindowWidth(): number {
  return useSyncExternalStore(subscribe, getSnapshot);
}`,
        outputJs: `HeaderWidth and SidebarWidth always agree on the window width
during any given render, since React reads getSnapshot synchronously
and guarantees consistency across the whole render.`,
        outputTs: `// Identical behaviour. useSyncExternalStore's own type signature
// infers the returned value's type from getSnapshot's own return type.`,
        explain: 'getSnapshot is read synchronously during render itself, not through an intermediate useState updated asynchronously by an effect, which is what lets React guarantee consistency.',
        explainHi: '\`getSnapshot\` render ke dauraan hi synchronously padha jaata hai, ek beech ke \`useState\` ke zariye nahi jo ek effect dwara asynchronously update hota hai, jo React ko consistency guarantee karne deta hai.',
      },
      {
        title: 'useId: stable ids for a reusable FormField component',
        titleHi: '\`useId\`: ek reusable \`FormField\` component ke liye sthir ids',
        code: `function FormField({ label }) {
  const id = useId();
  return (<div><label htmlFor={id}>{label}</label><input id={id} /></div>);
}`,
        codeJs: `let idCounter = 0; // BROKEN: module-level counter
function nextId() { return \`field-\${idCounter++}\`; }

function BrokenFormField({ label }) {
  const id = useMemo(() => nextId(), []);
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}

// FIXED: useId
function FormField({ label }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}`,
        codeTs: `let idCounter = 0; // BROKEN: module-level counter
function nextId(): string { return \`field-\${idCounter++}\`; }

function BrokenFormField({ label }: { label: string }) {
  const id = useMemo(() => nextId(), []);
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}

// FIXED: useId
function FormField({ label }: { label: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}`,
        outputJs: `The counter-based version can produce mismatched or duplicate ids
under Strict Mode, conditional rendering, or server/client hydration.
useId's version produces a stable, tree-position-derived id that
matches between server and client for the same component instance.`,
        outputTs: `// Identical behaviour. useId(): string is fully typed by React's
// own definitions with no extra annotation needed.`,
        explain: 'useId derives its value from the component\'s actual position in the tree, computed identically on server and client, rather than from an incrementing counter with no awareness of tree structure.',
        explainHi: '\`useId\` apni value component ki asli tree position se nikaalta hai, jo server aur client par samaan roop se gani jaati hai, ek incrementing counter ke bajaye jise tree structure ka koi gyaan nahi hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const [value, setValue] = useState(externalStore.getValue());
useEffect(() => externalStore.subscribe(() => setValue(externalStore.getValue())), []);
// prone to tearing under concurrent rendering`,
        right: `const value = useSyncExternalStore(externalStore.subscribe, externalStore.getValue);
// React guarantees consistency across the whole render`,
        why: 'A useState + useEffect subscription updates independently per component instance, on its own schedule, which can let different components briefly disagree about the same external value during concurrent rendering.',
        whyHi: 'Ek \`useState\` + \`useEffect\` subscription prati-component-instance azaadi se, apne khud ke schedule par update hoti hai, jo alag components ko concurrent rendering ke dauraan thodi der ke liye ek hi external value ke baare mein asahmat hone deta hai.',
      },
      {
        wrong: `let idCounter = 0;
const id = idCounter++; // module-level counter, drifts between server and client`,
        right: `const id = useId(); // derived from tree position, consistent server/client`,
        why: 'A module-level counter has no awareness of the component tree\'s structure and can advance differently under Strict Mode, conditional rendering, or between server and client renders.',
        whyHi: 'Ek module-level counter ko component tree ke structure ka koi gyaan nahi hai aur ye Strict Mode ke neeche, conditional rendering ke saath, ya server aur client renders ke beech alag tarike se aage badh sakta hai.',
      },
      {
        wrong: `const value = useSyncExternalStore(subscribe, getSnapshot);
// getSnapshot returns a brand-new object/array every call: () => ({ ...state })`,
        right: `const value = useSyncExternalStore(subscribe, getSnapshot);
// getSnapshot returns the SAME reference when nothing has changed`,
        why: 'A getSnapshot that returns a new object or array reference on every call, even when the underlying data has not changed, causes React to think the store changed on every render, triggering an infinite re-render loop.',
        whyHi: 'Ek \`getSnapshot\` jo har call par ek naya object ya array reference return karta hai, chahe underlying data badla na ho, React ko ye sochne par majboor karta hai ki store har render par badla, ek infinite re-render loop trigger karte hue.',
      },
    ],

    realWorld: [
      {
        en: '**useSyncExternalStore was added to React 18 specifically because popular state-management libraries (including Redux\'s own React bindings) needed a standard, React-blessed way to subscribe to external stores without tearing under concurrent rendering** — it is infrastructure-level, not a hypothetical hook.',
        hi: '**\`useSyncExternalStore\` ko React 18 mein khaas taur par isliye jodaa gaya kyunki popular state-management libraries (Redux ki apni React bindings sameet) ko external stores tak subscribe karne ka ek standard, React-approved tarika chahiye tha bina concurrent rendering ke neeche tearing ke** — ye infrastructure-star ka hai, ek kaalpanik hook nahi.',
      },
      {
        en: '**useId is the officially recommended fix specifically for avoiding hydration mismatches in server-rendered React apps**, cited directly in React\'s own documentation as its primary use case.',
        hi: '**\`useId\` officially recommend kiya gaya fix hai khaas taur par server-rendered React apps mein hydration mismatches avoid karne ke liye**, seedhe React ki apni documentation mein iske mukhya use case ki tarah cite kiya gaya.',
      },
      {
        en: '**"What is tearing, and how does useSyncExternalStore prevent it?" is a genuinely common senior React interview question**, specifically because it distinguishes candidates who understand concurrent rendering\'s actual implications from those who have only memorized hook names.',
        hi: '**"Tearing kya hai, aur \`useSyncExternalStore\` ise kaise rokta hai?" ek sach mein aam senior React interview sawaal hai**, khaas taur par kyunki ye un candidates ko alag karta hai jo concurrent rendering ke asli implications samajhte hain un se jinhone sirf hook naam yaad kiye hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What exactly is "tearing" in the context of concurrent React rendering, and why does a useState + useEffect subscription to an external store not protect against it?',
        qHi: 'Concurrent React rendering ke sandarbh mein "tearing" bilkul kya hai, aur ek \`useState\` + \`useEffect\` subscription ek external store se ise kyun nahi rokti?',
        a: 'Tearing refers to a situation where different parts of a single, logically consistent user interface briefly display inconsistent values derived from what should be one shared, external piece of state — for example, one component on screen showing a window width of 800 while another component, rendered as part of the very same overall update, simultaneously shows 820, despite both supposedly reflecting the same actual browser window at the same moment. This becomes possible specifically because React 18 introduced concurrent rendering, meaning React is now permitted to pause a render partway through, do other work, and resume it later, or to render different parts of the UI at different times as part of managing overall responsiveness, rather than always processing an entire render as one uninterrupted, atomic pass the way earlier versions of React did. A useState + useEffect subscription to an external store gives each individual component instance its OWN independent piece of local React state, which that component\'s own effect updates by calling its own setState function whenever the external store changes — critically, this means there is no single, shared, authoritative read of the external store happening once per render; instead, there are as many separate, independently-scheduled reads and updates as there are component instances subscribing to that store, each proceeding according to its own effect\'s own timing. If the external store changes while React is in the middle of a concurrent render, or if it needs to render two components subscribing to the same store at genuinely different points in time as part of managing that concurrency, nothing about the useState + useEffect pattern guarantees those two components\' independent local states will have already been updated to reflect the same, single, current value of the store — one may have already run its effect and updated, the other may not have gotten to it yet, producing the inconsistency tearing describes. useSyncExternalStore avoids this by requiring a getSnapshot function that React itself calls SYNCHRONOUSLY, directly during the render, rather than routing the value through an intermediate piece of local state updated later by a separate effect — because React controls exactly when and how often getSnapshot is invoked as part of its own rendering process, it can check and re-check the snapshot value as needed to guarantee that every component reading from the same store during a single overall render sees results consistent with one single, coherent snapshot of that store, rather than a patchwork of independently-timed reads.',
        aHi: 'Tearing ek aisi sthiti ko darsata hai jahan ek akeli, logically consistent user interface ke alag hisse thodi der ke liye asangat values dikhaate hain jo ek shared, external state ke ek tukde se nikaali gayi honi chahiye — misal ke taur par, screen par ek component window width 800 dikhaata hai jabki ek doosra component, bilkul usi overall update ke hisse ki tarah render hua, ek saath 820 dikhaata hai, chahe dono maana jaata hai ki usi asli browser window ko usi pal darsaate hain. Ye khaas taur par mumkin ban jaata hai kyunki React 18 ne concurrent rendering introduce ki, matlab React ko ab ek render ko beech mein rokne, doosra kaam karne, aur ise baad mein resume karne ki, ya UI ke alag hisso ko alag samay par render karne ki anumati hai poori overall responsiveness manage karne ke hisse ki tarah, hamesha ek poore render ko ek na-tuti, atomic pass ki tarah process karne ke bajaye jaisa React ke pehle wale versions karte the. \`useState\` + \`useEffect\` subscription ek external store se har akele component instance ko apna KHUD ka azaad local React state ka tukda deta hai, jise us component ka apna effect update karta hai apna khud ka setState function bulaake jab bhi external store badalta hai — mahatvapoorn baat, iska matlab hai koi ek akela, shared, adhikaarik read us external store ki nahi ho rahi hai prati render ek baar; iske bajaye, utni hi alag, azaadi-se-schedule-ki-gayi reads aur updates hain jitni components instances us store ko subscribe karte hain, har ek apne khud ke effect ki apni timing ke anusaar aage badhte hue. Agar external store badalta hai jab React ek concurrent render ke beech mein hai, ya agar ise usi store ko subscribe karne wale do components ko sach mein alag samay bindu par render karna hai us concurrency ko manage karne ke hisse ki tarah, kuch bhi \`useState\` + \`useEffect\` pattern ke baare mein guarantee nahi karta ki un do components ki azaad local states pehle hi store ki usi, ek, current value ko darsaane ke liye update ho chuki hongi — ek ne shaayad pehle hi apna effect chala liya ho aur update kar liya ho, doosre ko shaayad abhi tak mauka na mila ho, tearing jo asangati darsata hai wo paida karte hue. \`useSyncExternalStore\` ise avoid karta hai ek \`getSnapshot\` function maangkar jise React khud SYNCHRONOUSLY bulaata hai, seedhe render ke dauraan, value ko ek beech ke local state ke tukde ke zariye route karne ke bajaye jo baad mein ek alag effect dwara update hota hai — kyunki React niyantrit karta hai ki bilkul kab aur kitni baar \`getSnapshot\` bulaaya jaata hai apni khud ki rendering process ke hisse ki tarah, ye snapshot value ko zaroorat ke anusaar check aur dobara check kar sakta hai ye guarantee karne ke liye ki ek hi overall render ke dauraan usi store se padhne wala har component us store ke ek akele, samvedansheel snapshot se consistent nateeje dekhta hai, azaadi-se-samay-ki-gayi reads ke ek patchwork ke bajaye.',
      },
      {
        q: 'Why does a module-level incrementing counter fail to produce reliable ids for a reusable component, and how does useId solve the same problem differently?',
        qHi: 'Ek module-level incrementing counter ek reusable component ke liye bharosemand ids banaane mein kyun asafal hota hai, aur \`useId\` isi samasya ko alag tarike se kaise sulajhaata hai?',
        a: 'A module-level counter that increments once per call, returning something like field-0, field-1, field-2 and so on, produces an id purely based on the ORDER in which that counter happened to be called during a specific render pass, with absolutely no awareness of anything about the component tree\'s actual structure — it is simply a running tally maintained entirely outside of React\'s own rendering logic. This becomes unreliable in several genuinely common scenarios: React\'s Strict Mode deliberately invokes component functions twice during development specifically to help surface exactly this kind of bug, and a counter that increments on every call will advance further than intended when a component is invoked twice for the same logical render; when an application is server-rendered and then hydrated on the client, the counter starts over from its initial value independently in each environment, with no shared state between server and client processes, so if the two environments happen to invoke components in even a slightly different order, or if conditional rendering causes a different number of components to mount before a given instance in one environment versus the other, the resulting counter-based id assigned to logically the same component instance can differ between server-rendered HTML and the client\'s expectation during hydration, which is precisely the kind of mismatch React\'s hydration process is built to detect and warn about; and conditional rendering alone, even without any server/client split at all, can cause a counter\'s value to shift between renders whenever an earlier component that would have consumed an id is or is not present, potentially producing genuinely duplicate id values elsewhere on the page. useId solves this fundamentally differently by having React itself compute the id based on the calling component\'s actual position within the overall component tree structure, using an algorithm React applies identically regardless of whether it is running on the server or hydrating on the client — because the id is derived from tree position rather than from an external, order-dependent counter that exists outside of React\'s own bookkeeping, two renders of the same logical component instance, whether on the server or the client, or during a Strict Mode double-invocation, are computed by the same deterministic process and therefore always agree, and two different component instances at genuinely different tree positions are guaranteed to receive different ids without depending on any shared mutable counter that could drift out of sync.',
        aHi: 'Ek module-level counter jo prati-call ek baar increment hota hai, field-0, field-1, field-2 waghaira jaisa kuch return karte hue, ek id sirf us ORDER ke aadhaar par banaata hai jismein wo counter ek khaas render pass ke dauraan samyog se bulaaya gaya, component tree ke asli structure ke baare mein kisi bhi cheez ka bilkul koi gyaan na rakhte hue — ye bas ek chalti hui gin ti hai jo poori tarah React ki apni rendering logic ke bahar rakhi jaati hai. Ye kayi sach mein aam scenarios mein na-bharosemand ban jaata hai: React ka Strict Mode jaan-boojhkar component functions ko development mein do baar bulaata hai khaas taur par bilkul is tarah ke bug ko saamne laane mein madad karne ke liye, aur ek counter jo har call par increment hota hai ummeed se zyaada aage badhega jab ek component ko usi logical render ke liye do baar bulaaya jaata hai; jab ek application server-rendered hai aur phir client par hydrate hui hai, counter azaadi se har environment mein apni initial value se dobara shuru hota hai, server aur client processes ke beech koi shared state na hote hue, isliye agar dono environments samyog se components ko thoda bhi alag order mein bulaate hain, ya agar conditional rendering ek environment mein doosre ke saapeksh ek diye gaye instance se pehle mount hone wale components ki alag tadaad ka kaaran banti hai, nateeje wala counter-based id jo logically usi component instance ko assign hoti hai server-rendered HTML aur hydration ke dauraan client ki ummeed ke beech alag ho sakti hai, jo bilkul us tarah ka mismatch hai jise React ka hydration process detect karne aur chetaavni dene ke liye banaaya gaya hai; aur akela conditional rendering, bina kisi server/client split ke bhi, ek counter ki value ko renders ke beech shift karne ka kaaran ban sakta hai jab bhi ek pehle wala component jo ek id consume karta us ek environment mein maujood hai ya nahi, sambhaavit roop se page par kahin aur sach mein duplicate id values banaate hue. \`useId\` ise buniyaadi roop se alag tarike se sulajhaata hai React khud ko id ganne dekar bulaane wale component ki asli position ke aadhaar par poore component tree structure ke andar, ek algorithm istemal karte hue jise React samaan roop se lagu karta hai chahe ye server par chal raha ho ya client par hydrate kar raha ho — kyunki id tree position se nikaali jaati hai ek external, order-nirbhar counter se nahi jo React ki apni bookkeeping ke bahar maujood hai, usi logical component instance ke do renders, chahe server par ho ya client par, ya ek Strict Mode double-invocation ke dauraan, usi deterministic process dwara gane jaate hain aur isliye hamesha sahmat hote hain, aur alag-alag component instances jo sach mein alag tree positions par hain unhe alag ids milne ki guarantee hai kisi bhi shared mutable counter par nirbhar hue bina jo out-of-sync ho sakta hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken useWindowWidth hook using useState + useEffect, following this lesson\'s example, and render two components using it side by side.',
        taskHi: 'Is lesson ke example ka palan karte hue \`useState\` + \`useEffect\` se toota \`useWindowWidth\` hook banao, aur ise istemal karte hue do components ek saath render karo.',
        hint: 'Resizing the browser window rapidly, several times in quick succession, is more likely to surface any momentary disagreement than a single slow resize.',
        hintHi: 'Browser window ko tezi se, kayi baar ek ke baad ek resize karna kisi bhi pal-bhar ki asahmati ko saamne laane ki zyaada sambhaavna rakhta hai ek akeli dheemi resize se.',
      },
      {
        task: 'Rebuild the hook using useSyncExternalStore, following this lesson\'s example. Confirm both components using the hook always report the same value.',
        taskHi: 'Is lesson ke example ka palan karte hue \`useSyncExternalStore\` se hook dobara banao. Confirm karo ki hook istemal karne wale dono components hamesha wahi value report karte hain.',
        hint: 'Deliberately write a getSnapshot that returns a brand-new object on every call and observe the infinite re-render loop this lesson\'s mistakes section warns about, then fix it.',
        hintHi: 'Jaan-boojhkar ek \`getSnapshot\` likho jo har call par ek bilkul naya object return karta hai aur us infinite re-render loop ko dekho jise is lesson ka mistakes section chetaavni deta hai, phir ise theek karo.',
      },
      {
        task: 'Build the broken counter-based FormField component and render three instances of it inside a list that conditionally omits the middle one. Inspect the rendered HTML for duplicate id attributes, then fix it with useId.',
        taskHi: 'Toota counter-based \`FormField\` component banao aur ek list ke andar iske teen instances render karo jo beech waale ko conditionally chhod deti hai. Duplicate \`id\` attributes ke liye rendered HTML inspect karo, phir ise \`useId\` se theek karo.',
        hint: 'Use the browser\'s Elements panel to search for duplicate id values directly, rather than relying only on visual inspection.',
        hintHi: 'Sirf visual inspection par bharosa karne ke bajaye, seedhe duplicate \`id\` values khojne ke liye browser ke Elements panel ka istemal karo.',
      },
    ],

    keyTakeaways: [
      'A useState + useEffect subscription to an external store gives each component its own independently-scheduled local copy, which can transiently disagree with another component reading the same store during concurrent rendering — a bug called tearing.',
      'useSyncExternalStore reads the store synchronously during render via getSnapshot, which is what lets React guarantee every component reading the same store during one render sees a consistent value.',
      'getSnapshot must return the same reference when nothing has actually changed — returning a new object or array on every call causes React to think the store changed every render, triggering an infinite loop.',
      'A module-level incrementing counter for generating component ids drifts under Strict Mode\'s double-invocation, conditional rendering, and server/client hydration, since it has no awareness of the component tree\'s structure.',
      'useId derives a stable id from the calling component\'s actual position in the tree, computed identically on the server and during client hydration, avoiding both duplicate ids and hydration mismatches.',
      'Both hooks solve infrastructure-level problems primarily relevant to library authors and reusable component builders — most application code encounters them indirectly through a library rather than calling them directly.',
    ],
    keyTakeawaysHi: [
      'Ek \`useState\` + \`useEffect\` subscription ek external store ko har component ki apni azaadi-se-schedule-ki-gayi local copy deta hai, jo concurrent rendering ke dauraan usi store ko padhne wale ek doosre component se thodi der ke liye asahmat ho sakta hai — ek bug jise tearing kaha jaata hai.',
      '\`useSyncExternalStore\` store ko render ke dauraan \`getSnapshot\` ke zariye synchronously padhta hai, jo React ko guarantee karne deta hai ki ek render ke dauraan usi store ko padhne wala har component ek consistent value dekhta hai.',
      '\`getSnapshot\` ko wahi reference return karni chahiye jab asal mein kuch badla na ho — har call par ek naya object ya array return karna React ko sochne par majboor karta hai ki store har render badla, ek infinite loop trigger karte hue.',
      'Component ids banaane ke liye ek module-level incrementing counter Strict Mode ke double-invocation, conditional rendering, aur server/client hydration ke neeche drift karta hai, kyunki ise component tree ke structure ka koi gyaan nahi hai.',
      '\`useId\` bulaane wale component ki asli tree position se ek sthir id nikaalta hai, jo server par aur client hydration ke dauraan samaan roop se gani jaati hai, dono duplicate ids aur hydration mismatches avoid karte hue.',
      'Dono hooks infrastructure-star ki samasyaon ko sulajhaate hain jo mukhya taur par library authors aur reusable component builders se mutaalliq hain — adhikaansh application code inhe azaadi se bulaane ke bajaye ek library ke zariye parokh roop se milta hai.',
    ],
  },
];
