/**
 * React Complete Course — Module 4: Hooks & Performance, lesson 4.
 *
 * useTransition and useDeferredValue: React 18's concurrent-rendering
 * hooks for keeping urgent input responsive while an expensive,
 * lower-priority re-render (a big filtered list, a heavy chart) happens
 * in the background without blocking it. Broken example: typing into a
 * search box that also drives a re-render of thousands of filtered
 * results in the SAME synchronous state update, so every keystroke feels
 * laggy because the browser must finish re-rendering the entire
 * expensive list before it can even show the next typed character.
 * Fixed with useTransition (when you own the setter that triggers the
 * expensive work) and useDeferredValue (when you only own a value,
 * often received as a prop, and want a lagging copy of it for expensive
 * rendering while the real value stays instantly responsive elsewhere).
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

export const REACT_MODULE_4_PART4: CourseLesson[] = [
  {
    slug: 'usetransition-usedeferredvalue-concurrent-ui',
    title: 'useTransition and useDeferredValue: Keeping Input Responsive',
    titleHi: 'useTransition Aur useDeferredValue: Input Ko Responsive Rakhna',
    description: 'A search box on a 10,000-item product list feels broken — every single keystroke visibly lags behind the actual typing, because each character typed forces React to finish re-rendering all 10,000 filtered results before it can even show the next letter.',
    descriptionHi: 'Ek 10,000-item product list par ek search box toota hua mehsoos hota hai — har ek keystroke asli typing se dikhaayi dete hue peeche reh jaati hai, kyunki har type kiya gaya character React ko sab 10,000 filtered results ko dobara render karna poora karne par majboor karta hai isse pehle ki ye agla letter bhi dikha sake.',
    difficulty: 'HARD',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A receptionist who insists on fully resolving one visitor\'s lengthy paperwork before acknowledging that a second visitor has even walked in, versus a receptionist who immediately looks up and greets the new visitor — "one moment, I\'ll be right with you" — while continuing the lengthy paperwork in the background at a lower priority.** In the first office, a visitor with a two-minute form to process makes every subsequent visitor stand in the doorway, completely unacknowledged, for the full two minutes, because the receptionist treats every task as equally urgent and processes them strictly one at a time, start to finish. In the second office, urgent things — a new visitor walking in, a phone ringing — are always handled first, immediately, even if it means setting the lengthy paperwork down mid-task and picking it back up right after; the paperwork still gets finished, just never at the cost of making someone standing right in front of the receptionist wait unnecessarily. A React app updating an expensive, low-priority re-render (a giant filtered list) using an ordinary, urgent state update is the first office: every single keystroke is forced to wait for React to completely finish the previous, expensive re-render before it can even register that new, more urgent input arrived. `useTransition` turns a specific state update into the deprioritized paperwork — React commits to finishing it eventually, but treats it as interruptible, and always attends to something explicitly marked urgent (like acknowledging what the user just typed) first.',
      hi: '**Ek receptionist jo ek visitor ke lambe paperwork ko poori tarah suljhaane par zor deta hai isse pehle ki wo ye bhi maane ki ek doosra visitor andar aa chuka hai, versus ek receptionist jo turant oopar dekhta hai aur naye visitor ka swaagat karta hai — "ek pal, main abhi aapke saath hoon" — jabki lambe paperwork ko background mein ek kam priority par jaari rakhta hai.** Pehle office mein, ek visitor jiska do-minute ka form process karna hai har baad ke visitor ko doorway mein khada rakhta hai, poori tarah bina-maane, poore do minute ke liye, kyunki receptionist har kaam ko barabar zaruri maanta hai aur unhe sakhti se ek-ek karke, shuru se ant tak process karta hai. Doosre office mein, zaruri cheezein — ek naya visitor andar aana, ek phone bajna — hamesha pehle handle ki jaati hain, turant, chahe iska matlab ho lambe paperwork ko beech mein rakhna aur turant baad wapas uthaana; paperwork phir bhi poora hota hai, bas kabhi kisi ke seedhe receptionist ke saamne khade hokar bina-zaroorat wait karne ki keemat par nahi. Ek React app jo ek mehenga, kam-priority re-render (ek vishaal filtered list) ko ek saadhaaran, zaruri state update se update karta hai pehla office hai: har ek keystroke React ko pichla, mehenga re-render poori tarah khatam karne ke liye majboor karti hai isse pehle ki ye ye bhi register kare ki naya, zyaada zaruri input aaya hai. \`useTransition\` ek khaas state update ko kam-priority paperwork mein badalta hai — React ise aakhirkaar poora karne ke liye committed hai, par ise interrupt-ho-sakne-yogya treat karta hai, aur hamesha kisi explicitly urgent maani gayi cheez ko pehle attend karta hai (jaise ye maanna ki user ne abhi kya type kiya).',
    },

    simple: `**Start broken.** Typing and the expensive filtered-list re-render happen in the same, ordinary state update:

\`\`\`jsx
function ProductSearch({ allProducts }) { // allProducts.length === 10000
  const [query, setQuery] = useState("");
  const filtered = allProducts.filter((p) => p.name.includes(query)); // expensive, runs every render

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {filtered.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

Every single keystroke calls \`setQuery\`, which is an ordinary, urgent state update — React treats it exactly the way it treats any other \`setState\` call, meaning it must fully finish re-rendering EVERYTHING that depends on \`query\`, including filtering and re-rendering all 10,000 \`<li>\` elements, before it considers the update "done" and becomes ready to respond to the next keystroke. Because filtering and re-rendering 10,000 items is genuinely expensive work, the input itself visibly lags — the character the user just typed does not appear in the input box until React has also finished the expensive list re-render triggered by that same keystroke, since both are bundled into one single, urgent, uninterruptible unit of work.

**The fix: mark the expensive update as a transition, so it can be interrupted**

\`\`\`jsx
import { useState, useTransition } from "react";

function ProductSearch({ allProducts }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(allProducts);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value); // urgent — updates the input instantly
    startTransition(() => {
      setFiltered(allProducts.filter((p) => p.name.includes(e.target.value))); // deprioritized
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Updating results…</span>}
      <ul>
        {filtered.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

\`\`\`tsx
import { useState, useTransition } from "react";

interface Product {
  id: string;
  name: string;
}

function ProductSearch({ allProducts }: { allProducts: Product[] }) {
  const [query, setQuery] = useState<string>("");
  const [filtered, setFiltered] = useState<Product[]>(allProducts);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    startTransition(() => {
      setFiltered(allProducts.filter((p) => p.name.includes(e.target.value)));
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Updating results…</span>}
      <ul>
        {filtered.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

\`setQuery\` is still called as an ordinary, urgent update — React commits to processing it immediately, so the input box itself always reflects exactly what the user just typed, with no lag whatsoever. \`setFiltered\`, the expensive update, is wrapped inside \`startTransition\`, which tells React: this update matters, but it is allowed to be interrupted by something more urgent, such as the very next keystroke. If the user types a second character before React finishes re-rendering the filtered list for the first, React does not force the first filtering pass to completion — it abandons that in-progress low-priority render and starts a fresh one reflecting the latest \`query\`, since only the MOST RECENT transition\'s result is actually useful to the user. \`isPending\`, returned alongside \`startTransition\`, is \`true\` for exactly as long as a transition is still in flight, letting the UI show a subtle "updating" indicator rather than silently displaying stale results with no explanation.`,

    simpleHi: `**Toote hue se shuru.** Typing aur mehenga filtered-list re-render ek hi, saadhaaran state update mein hote hain:

\`\`\`jsx
function ProductSearch({ allProducts }) { // allProducts.length === 10000
  const [query, setQuery] = useState("");
  const filtered = allProducts.filter((p) => p.name.includes(query)); // mehenga, har render chalta hai

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {filtered.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

Har ek keystroke \`setQuery\` bulaata hai, jo ek saadhaaran, zaruri state update hai — React ise bilkul waise treat karta hai jaise ye kisi bhi doosre \`setState\` call ko treat karta hai, matlab ise poori tarah har us cheez ko dobara render karna khatam karna hai jo \`query\` par nirbhar hai, sab 10,000 \`<li>\` elements ko filter aur dobara render karna sameet, isse pehle ki ye update ko "khatam" maane aur agli keystroke ka jawaab dene ke liye taiyaar ho. Kyunki 10,000 items ko filter aur dobara render karna sach mein mehenga kaam hai, input khud drishya roop se peeche reh jaata hai — jo character user ne abhi type kiya wo input box mein tab tak nahi dikhta jab tak React us mehenge list re-render ko bhi khatam nahi kar leta jo usi keystroke se trigger hui, kyunki dono ek akele, zaruri, bina-interrupt-hone-yogya kaam ki ikaai mein bundled hain.

**Fix: mehenge update ko ek transition maano, taaki ise interrupt kiya jaa sake**

\`\`\`jsx
import { useState, useTransition } from "react";

function ProductSearch({ allProducts }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(allProducts);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value); // zaruri — input ko turant update karta hai
    startTransition(() => {
      setFiltered(allProducts.filter((p) => p.name.includes(e.target.value))); // kam-priority
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Updating results…</span>}
      <ul>
        {filtered.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

\`\`\`tsx
import { useState, useTransition } from "react";

interface Product {
  id: string;
  name: string;
}

function ProductSearch({ allProducts }: { allProducts: Product[] }) {
  const [query, setQuery] = useState<string>("");
  const [filtered, setFiltered] = useState<Product[]>(allProducts);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    startTransition(() => {
      setFiltered(allProducts.filter((p) => p.name.includes(e.target.value)));
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Updating results…</span>}
      <ul>
        {filtered.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

\`setQuery\` abhi bhi ek saadhaaran, zaruri update ki tarah bulaaya jaata hai — React ise turant process karne ke liye committed hai, isliye input box khud hamesha bilkul wahi darsata hai jo user ne abhi type kiya, bina kisi lag ke. \`setFiltered\`, mehenga update, \`startTransition\` ke andar wrap kiya jaata hai, jo React ko batata hai: ye update maayne rakhta hai, par ise kisi zyaada zaruri cheez se interrupt hone ki anumati hai, jaisa bilkul agli keystroke. Agar user pehli ke liye React ke filtered list dobara render karna khatam karne se pehle ek doosra character type karta hai, React pehle filtering pass ko poora hone ke liye majboor nahi karta — ye us chal rahe kam-priority render ko chhod deta hai aur latest \`query\` ko darsaate hue ek taaza shuru karta hai, kyunki sirf SABSE HAALIYA transition ka nateeja hi user ke liye asal mein upyogi hai. \`isPending\`, \`startTransition\` ke saath return hota hai, tab tak \`true\` rehta hai jab tak ek transition abhi bhi in flight hai, UI ko bina kisi spashteekaran ke chupchaap stale results dikhaane ke bajaye ek halka "updating" indicator dikhaane deta hai.`,

    content: `## useDeferredValue: the same idea, when you only own a value, not the setter

\`\`\`jsx
import { useState, useDeferredValue } from "react";

function ProductSearch({ allProducts }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const filtered = allProducts.filter((p) => p.name.includes(deferredQuery)); // uses the LAGGING value

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {filtered.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

\`useTransition\` requires wrapping the specific state-updating call that triggers expensive work — this works well when that call is directly inside the same component or a function you own. Sometimes, though, the value driving expensive rendering is not something set via a call you control at all — it might arrive as a prop from a parent component that has no reason to know or care about \`useTransition\`. \`useDeferredValue\` addresses this from the other direction: instead of marking an UPDATE as low priority, it takes a VALUE (\`query\`) and gives back a second, "deferred" copy of it (\`deferredQuery\`) that intentionally lags behind whenever React is busy — the input itself still renders using the instantly up-to-date \`query\`, while the expensive filtered list renders using \`deferredQuery\`, which briefly shows the previous value before catching up once React has spare capacity, exactly like \`isPending\` from \`useTransition\`, \`useDeferredValue\` does not stop the expensive work from eventually happening; it only controls WHEN, relative to more urgent updates, that work is allowed to finish.

## Detecting staleness with useDeferredValue

\`\`\`jsx
const deferredQuery = useDeferredValue(query);
const isStale = query !== deferredQuery; // true while the deferred value is still catching up
\`\`\`

Since \`useDeferredValue\` does not come with its own built-in \`isPending\` flag the way \`useTransition\` does, a common pattern for showing a "this is slightly stale" indicator is comparing the live value against its deferred counterpart directly — for as long as they differ, the expensive part of the UI is still rendering against an older value, and a lower-opacity or "updating…" treatment on that section communicates this without blocking the input itself.

## Neither hook makes the expensive work itself faster

\`\`\`
Without useTransition/useDeferredValue:
  Urgent input update  → BLOCKED behind → expensive list re-render

With useTransition/useDeferredValue:
  Urgent input update  → happens immediately
  Expensive list re-render → happens afterward, interruptible, same total cost
\`\`\`

A genuinely common misunderstanding is treating these hooks as if they make an expensive computation itself cheaper or faster — they do not reduce how much work filtering 10,000 items takes; the browser still has to do that same amount of computation eventually. What changes is the ORDER and INTERRUPTIBILITY of that work relative to more urgent updates: the expensive work is deprioritized so it never blocks something urgent, and an in-progress low-priority render can be abandoned and restarted if a newer update supersedes it, but the underlying cost of the expensive work itself is unchanged. For data sets so large that even a single filtering pass is too slow to ever feel instant, virtualization (this course\'s earlier lesson) or reducing how much data is processed at once are the actual fixes for that separate problem — useTransition and useDeferredValue solve keeping urgent input responsive WHILE expensive work happens, not making the expensive work itself smaller.

## When to reach for useTransition vs. useDeferredValue

A rough rule that matches both examples in this lesson: reach for \`useTransition\` when you are the one calling the state setter that triggers expensive work, since wrapping that specific call in \`startTransition\` is the more direct, explicit signal. Reach for \`useDeferredValue\` when you only have access to a value — often a prop, or a value derived from a store you do not control the updates to — and cannot wrap the original update call yourself, since a deferred copy of the value can still be produced regardless of how the original value came to change.`,

    contentHi: `## useDeferredValue: wahi idea, jab tumhare paas sirf ek value hai, setter nahi

\`\`\`jsx
import { useState, useDeferredValue } from "react";

function ProductSearch({ allProducts }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const filtered = allProducts.filter((p) => p.name.includes(deferredQuery)); // LAGGING value istemal karta hai

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {filtered.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

\`useTransition\` us khaas state-update karne wali call ko wrap karna maangta hai jo mehenga kaam trigger karti hai — ye tab achhi tarah kaam karta hai jab wo call seedhe usi component ke andar ho ya ek function ke andar jo tum khud own karte ho. Kabhi-kabhi, halaanki, wo value jo mehenga rendering chalaati hai bilkul kisi aisi call se set nahi hoti jise tum control karte ho — ye ek parent component se ek prop ki tarah aa sakti hai jise \`useTransition\` ko jaanne ya iski parwaah karne ka koi kaaran nahi hai. \`useDeferredValue\` ise doosri disha se sambodhit karta hai: ek UPDATE ko kam-priority maarne ke bajaye, ye ek VALUE (\`query\`) leta hai aur iski ek doosri, "deferred" copy (\`deferredQuery\`) wapas deta hai jo jaan-boojhkar peeche rehti hai jab bhi React vyast hai — input khud abhi bhi turant-taaza \`query\` istemal karke render hota hai, jabki mehenga filtered list \`deferredQuery\` istemal karke render hota hai, jo React ke paas fursat aane ke baad pakadne se pehle thodi der purani value dikhaata hai, bilkul \`useTransition\` ke \`isPending\` ki tarah, \`useDeferredValue\` mehenge kaam ko aakhirkaar hone se nahi rokta; ye sirf ye niyantrit karta hai ki KAB, zyaada zaruri updates ke saapeksh, us kaam ko poora hone ki anumati hai.

## useDeferredValue se staleness detect karna

\`\`\`jsx
const deferredQuery = useDeferredValue(query);
const isStale = query !== deferredQuery; // true jab tak deferred value abhi bhi pakad rahi hai
\`\`\`

Kyunki \`useDeferredValue\` apna khud ka built-in \`isPending\` flag nahi laata jaisa \`useTransition\` laata hai, ek "ye thodi stale hai" indicator dikhaane ka ek aam pattern live value ko seedhe uske deferred counterpart se compare karna hai — jab tak wo alag hain, UI ka mehenga hissa abhi bhi ek purani value ke khilaaf render ho raha hai, aur us section par ek kam-opacity ya "updating…" treatment ise bina input ko rokte hue batata hai.

## Koi bhi hook mehenge kaam ko khud tez nahi banaata

\`\`\`
useTransition/useDeferredValue ke bina:
  Zaruri input update  → BLOCKED peeche → mehenga list re-render

useTransition/useDeferredValue ke saath:
  Zaruri input update  → turant hota hai
  Mehenga list re-render → baad mein hota hai, interrupt-ho-sakne-yogya, wahi total cost
\`\`\`

Ek sach mein aam galat-samajh in hooks ko aisa treat karna hai jaise ye ek mehenge computation ko khud sasta ya tez banaate hain — wo ye kam nahi karte ki 10,000 items filter karna kitna kaam leta hai; browser ko phir bhi wahi tadaad ka computation aakhirkaar karna hai. Jo badalta hai wo hai us kaam ka ORDER aur INTERRUPTIBILITY zyaada zaruri updates ke saapeksh: mehenga kaam kam-priority kiya jaata hai taaki ye kabhi kisi zaruri cheez ko block na kare, aur ek chal raha kam-priority render chhoda aur dobara shuru kiya jaa sakta hai agar ek nayi update ise supersede karti hai, par mehenge kaam ki khud ki underlying keemat na-badli hai. Data sets ke liye jo itne bade hain ki ek akela filtering pass bhi kabhi turant mehsoos hone ke liye bahut dheema hai, virtualization (is course ka pehle wala lesson) ya ek saath process ki jaane waali data kam karna us alag samasya ke asli fixes hain — \`useTransition\` aur \`useDeferredValue\` zaruri input ko responsive rakhna sulajhaate hain JABKI mehenga kaam hota hai, mehenge kaam ko khud chhota banaana nahi.

## \`useTransition\` vs. \`useDeferredValue\` kab istemal karein

Ek moti-moti rule jo is lesson ke dono examples se mel khaati hai: \`useTransition\` ki taraf jaao jab tum wahi ho jo us state setter ko bulaate ho jo mehenga kaam trigger karta hai, kyunki us khaas call ko \`startTransition\` mein wrap karna zyaada seedha, explicit signal hai. \`useDeferredValue\` ki taraf jaao jab tumhare paas sirf ek value tak pahunch hai — aksar ek prop, ya ek value jo ek store se nikaali gayi hai jiske updates ko tum control nahi karte — aur asli update call ko khud wrap nahi kar sakte, kyunki value ki ek deferred copy phir bhi banaayi jaa sakti hai chahe asli value kaise badli.`,

    examples: [
      {
        title: 'Broken: filtering blocks typing because both happen in one urgent update',
        titleHi: 'Toota: filtering typing ko block karti hai kyunki dono ek zaruri update mein hote hain',
        code: `const [query, setQuery] = useState("");
const filtered = allProducts.filter((p) => p.name.includes(query));
// every keystroke waits for the ENTIRE expensive filter to finish`,
        codeJs: `function ProductSearch({ allProducts }) {
  const [query, setQuery] = useState("");
  const filtered = allProducts.filter((p) => p.name.includes(query));

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{filtered.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}
// allProducts.length === 10000 → each keystroke feels laggy`,
        codeTs: `interface Product { id: string; name: string; }

function ProductSearch({ allProducts }: { allProducts: Product[] }) {
  const [query, setQuery] = useState<string>("");
  const filtered = allProducts.filter((p) => p.name.includes(query));

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{filtered.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}
// fully valid TypeScript — the lag is a scheduling problem, not a type error`,
        output: `Typing quickly into the input shows each character appearing with a
visible, frustrating delay, since React must finish re-rendering all
10,000 filtered <li> elements before the next keystroke registers.`,
        explain: 'setQuery and the expensive filter both happen inside the same ordinary, urgent render — React has no way to know the filtering work is safe to deprioritize.',
        explainHi: '\`setQuery\` aur mehenga filter dono ek hi saadhaaran, zaruri render ke andar hote hain — React ke paas ye jaanne ka koi tarika nahi hai ki filtering kaam ko kam-priority karna surakshit hai.',
      },
      {
        title: 'Fixed: useTransition keeps the input urgent, filtering interruptible',
        titleHi: 'Theek: \`useTransition\` input ko zaruri rakhta hai, filtering interrupt-ho-sakne-yogya',
        code: `const [isPending, startTransition] = useTransition();
setQuery(value); // urgent
startTransition(() => setFiltered(expensiveFilter(value))); // deprioritized`,
        codeJs: `function ProductSearch({ allProducts }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(allProducts);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value);
    startTransition(() => {
      setFiltered(allProducts.filter((p) => p.name.includes(e.target.value)));
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Updating…</span>}
      <ul>{filtered.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}`,
        codeTs: `interface Product { id: string; name: string; }

function ProductSearch({ allProducts }: { allProducts: Product[] }) {
  const [query, setQuery] = useState<string>("");
  const [filtered, setFiltered] = useState<Product[]>(allProducts);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    startTransition(() => {
      setFiltered(allProducts.filter((p) => p.name.includes(e.target.value)));
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Updating…</span>}
      <ul>{filtered.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}`,
        outputJs: `Typing feels instant — the input always shows the latest character
immediately. The filtered list catches up shortly after, with
"Updating…" shown while isPending is true.`,
        outputTs: `// Identical behaviour. useTransition's own type definitions give
// isPending as boolean and startTransition as (callback: () => void) => void.`,
        explain: 'setQuery is urgent and unblocked; setFiltered is wrapped in startTransition, so React can interrupt an in-progress filter pass if a newer keystroke arrives.',
        explainHi: '\`setQuery\` zaruri aur bina-block hai; \`setFiltered\` \`startTransition\` mein wrap hai, isliye React ek chal rahe filter pass ko interrupt kar sakta hai agar ek nayi keystroke aati hai.',
      },
      {
        title: 'useDeferredValue: the same fix when you only have a value, not a setter to wrap',
        titleHi: '\`useDeferredValue\`: wahi fix jab tumhare paas sirf ek value hai, wrap karne ke liye koi setter nahi',
        code: `const deferredQuery = useDeferredValue(query);
const filtered = allProducts.filter((p) => p.name.includes(deferredQuery));
const isStale = query !== deferredQuery;`,
        codeJs: `function ProductSearch({ allProducts }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const filtered = allProducts.filter((p) => p.name.includes(deferredQuery));
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul style={{ opacity: isStale ? 0.6 : 1 }}>
        {filtered.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}`,
        codeTs: `interface Product { id: string; name: string; }

function ProductSearch({ allProducts }: { allProducts: Product[] }) {
  const [query, setQuery] = useState<string>("");
  const deferredQuery = useDeferredValue(query);
  const filtered = allProducts.filter((p) => p.name.includes(deferredQuery));
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul style={{ opacity: isStale ? 0.6 : 1 }}>
        {filtered.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}`,
        outputJs: `The input responds instantly. The list briefly dims (isStale) while
deferredQuery is still catching up to the latest query, then updates
and returns to full opacity.`,
        outputTs: `// Identical behaviour. useDeferredValue<T>(value: T): T is generic,
// so deferredQuery is inferred as string here without an explicit
// type argument.`,
        explain: 'No setter is wrapped here at all — useDeferredValue instead produces a second, lagging copy of query itself, used only for the expensive part of the render.',
        explainHi: 'Yahaan koi setter bilkul wrap nahi hua — \`useDeferredValue\` iske bajaye \`query\` ki khud ek doosri, peeche rehti copy banaata hai, sirf render ke mehenge hisse ke liye istemal hoti hai.',
      },
    ],

    mistakes: [
      {
        wrong: `setQuery(value);
setFiltered(expensiveFilter(value)); // both urgent, both block each other`,
        right: `setQuery(value); // urgent
startTransition(() => setFiltered(expensiveFilter(value))); // deprioritized`,
        why: 'Calling both setters as ordinary urgent updates means React must finish the expensive one before it can even acknowledge the next keystroke, since it has no signal that one of them is safe to interrupt.',
        whyHi: 'Dono setters ko saadhaaran zaruri updates ki tarah bulaana matlab React ko mehenge wale ko khatam karna hai isse pehle ki ye agli keystroke ko bhi maane, kyunki iske paas koi signal nahi hai ki unmein se ek ko interrupt karna surakshit hai.',
      },
      {
        wrong: `startTransition(() => {
  setQuery(value); // wrapping the URGENT update instead of the expensive one
});
setFiltered(expensiveFilter(value));`,
        right: `setQuery(value); // keep the input's own update urgent
startTransition(() => setFiltered(expensiveFilter(value))); // wrap the expensive one`,
        why: 'Wrapping the input\'s own state update in startTransition, rather than the expensive one, deprioritizes the very thing that needs to feel instant, making the input itself laggy.',
        whyHi: 'Input ke apne state update ko \`startTransition\` mein wrap karna, mehenge wale ke bajaye, us cheez ko kam-priority karta hai jise turant mehsoos hone ki zaroorat hai, khud input ko lagg-daar banaate hue.',
      },
      {
        wrong: `const filtered = expensiveFilter(query); // expects useTransition/useDeferredValue to make THIS faster`,
        right: `const deferredQuery = useDeferredValue(query);
const filtered = expensiveFilter(deferredQuery); // same total cost, just no longer blocking urgent input`,
        why: 'Neither hook reduces how much work the expensive filtering itself takes — they only control when that work is allowed to happen relative to more urgent updates, not how cheap it is.',
        whyHi: 'Koi bhi hook ye kam nahi karta ki mehenga filtering khud kitna kaam leta hai — wo sirf ye niyantrit karte hain ki wo kaam zyaada zaruri updates ke saapeksh kab hone ki anumati hai, ye nahi ki ye kitna sasta hai.',
      },
    ],

    realWorld: [
      {
        en: '**useTransition and useDeferredValue are React 18\'s own official concurrent-rendering hooks, part of the same release that introduced automatic batching and the new root API** — not experimental or third-party additions.',
        hi: '**\`useTransition\` aur \`useDeferredValue\` React 18 ke apne official concurrent-rendering hooks hain, usi release ka hissa jisne automatic batching aur naya root API introduce kiya** — experimental ya third-party additions nahi.',
      },
      {
        en: '**Large, data-heavy search and filter UIs — product catalogs, admin dashboards with big tables, autocomplete over large datasets — are the textbook real-world use case these hooks were specifically designed for.**',
        hi: '**Bade, data-heavy search aur filter UIs — product catalogs, badi tables ke saath admin dashboards, bade datasets par autocomplete — asli-duniya use case hain jinke liye ye hooks khaas taur par design kiye gaye the.**',
      },
      {
        en: '**"Is this a stale value while a transition is pending?" and "when would you reach for useTransition over useDeferredValue?" are genuinely common React interview questions at companies building data-dense frontends.**',
        hi: '**"Kya ye ek stale value hai jabki ek transition pending hai?" aur "\`useDeferredValue\` ke oopar \`useTransition\` kab istemal karoge?" data-dense frontends banaane waali companies mein sach mein aam React interview sawaal hain.**',
      },
    ],

    interviewQA: [
      {
        q: 'What specific problem do useTransition and useDeferredValue solve, and why can\'t simply wrapping expensive code in useMemo solve the same problem?',
        qHi: '\`useTransition\` aur \`useDeferredValue\` khaas taur par kaunsi samasya sulajhaate hain, aur mehenge code ko sirf \`useMemo\` mein wrap karna wahi samasya kyun nahi sulajha sakta?',
        a: 'Before React 18, every state update was processed as a single, indivisible, synchronous unit of work from React\'s perspective — once a re-render triggered by a state update began, React would run it to completion before handling anything else, including a newer state update that arrived while the first was still in progress. This meant that if a single state update triggered both something urgent (updating an input\'s displayed value) and something expensive (re-rendering a large filtered list), the urgent part was inescapably stuck waiting behind the expensive part, since React had no way to distinguish "this part matters immediately" from "this part can wait" within one update — both were simply part of the same all-or-nothing unit of work. useTransition and useDeferredValue exist specifically to give a developer a way to communicate that distinction to React: useTransition lets you mark a specific STATE UPDATE (a call to a setter function) as interruptible and lower priority, so React commits to eventually finishing it, but is free to pause or abandon it if a more urgent update arrives in the meantime; useDeferredValue achieves a similar effect from a different angle by taking a VALUE and producing a second copy of it that deliberately lags behind, used only by the parts of the render that are expensive, while the original, live value stays available for anything that needs to feel instant. useMemo does not address this problem at all, because it solves a completely different one: useMemo only controls whether an expensive CALCULATION needs to be redone at all when a component re-renders with the same inputs it had last time, letting React skip re-running that calculation if nothing relevant changed. It has no concept of urgency, interruptibility, or priority between different pieces of work happening in response to a state update — if the calculation\'s own inputs genuinely did change, useMemo will still run it, and it will still be scheduled as an ordinary, urgent, uninterruptible part of that update exactly as it would without useMemo, which does nothing to prevent it from blocking a more urgent update the way useTransition specifically exists to.',
        aHi: 'React 18 se pehle, har state update React ke nazariye se ek akeli, na-baanti-jaa-sakne-yogya, synchronous kaam ki ikaai ki tarah process hoti thi — ek baar ek state update se trigger hua re-render shuru hua, React ise poora hone tak chalaata, kisi bhi doosri cheez ko handle karne se pehle, ek nayi state update sameet jo pehli abhi bhi chal rahi thi tab aayi. Iska matlab tha ki agar ek akeli state update ne kuch zaruri (ek input ki dikhaayi jaane waali value update karna) aur kuch mehenga (ek badi filtered list dobara render karna) dono trigger kiya, zaruri hissa bachne-na-yogya roop se mehenge hisse ke peeche wait karta phasa reh gaya, kyunki React ke paas ek update ke andar "ye hissa turant maayne rakhta hai" ko "ye hissa wait kar sakta hai" se alag karne ka koi tarika nahi tha — dono bas ek hi sab-ya-kuch-nahi kaam ki ikaai ka hissa the. \`useTransition\` aur \`useDeferredValue\` khaas taur par ek developer ko us farak ko React tak pahunchaane ka tarika dene ke liye maujood hain: \`useTransition\` tumhe ek khaas STATE UPDATE (ek setter function ki call) ko interrupt-ho-sakne-yogya aur kam-priority maarne deta hai, isliye React aakhirkaar ise poora karne ke liye committed hai, par ise pause ya chhodne ke liye azaad hai agar iske beech mein ek zyaada zaruri update aati hai; \`useDeferredValue\` ek alag angle se samaan asar haasil karta hai ek VALUE lekar aur iski ek doosri copy banaate hue jo jaan-boojhkar peeche rehti hai, sirf render ke un hisso dwara istemal hoti hai jo mehenge hain, jabki asli, live value kisi bhi cheez ke liye upalabdh rehti hai jise turant mehsoos hone ki zaroorat hai. \`useMemo\` is samasya ko bilkul sambodhit nahi karta, kyunki ye ek bilkul alag samasya sulajhaata hai: \`useMemo\` sirf ye niyantrit karta hai ki ek mehenga CALCULATION dobara karna zaruri hai ya nahi jab ek component un hi inputs ke saath dobara render hota hai jo pichli baar the, React ko us calculation ko dobara chalaana chhodne dete hue agar kuch mutaalliq badla nahi. Iske paas kisi bhi tarah ki urgency, interruptibility, ya priority ka concept nahi hai ek state update ke jawaab mein ho rahe alag-alag kaam ke tukdon ke beech — agar calculation ke apne inputs sach mein badle, \`useMemo\` phir bhi ise chalaayega, aur ye phir bhi us update ke ek saadhaaran, zaruri, bina-interrupt-hone-yogya hisse ki tarah schedule hoga bilkul jaise \`useMemo\` ke bina hota, jo ise ek zyaada zaruri update ko block karne se rokne mein kuch nahi karta jise \`useTransition\` khaas taur par isliye maujood hai.',
      },
      {
        q: 'Concretely, when should you reach for useTransition versus useDeferredValue for the same underlying problem of keeping urgent input responsive during expensive re-renders?',
        qHi: 'Thos roop se, zaruri input ko mehenge re-renders ke dauraan responsive rakhne ki wahi underlying samasya ke liye \`useTransition\` ya \`useDeferredValue\` kab istemal karna chahiye?',
        a: 'The deciding factor is whether you have direct access to, and control over, the specific state-updating call that triggers the expensive work, or whether you only ever have access to a value that has already been computed or received from somewhere you do not control. useTransition requires wrapping an actual function call — the call to a setter, such as setFiltered(...) — inside startTransition, which means it is the natural fit specifically when the code triggering the expensive update lives in a place you can directly edit, such as an event handler you wrote yourself that calls a setState function you own. useDeferredValue, by contrast, does not require access to any setter call at all — it only needs the VALUE itself, and produces a second, deliberately-lagging copy of that value that you can then use in place of the original wherever expensive rendering depends on it. This makes useDeferredValue the more natural fit specifically in situations where you cannot wrap the original update call yourself, most commonly because the value in question arrives as a prop passed down from a parent component that has no reason to know or care about transitions at all, or because the value comes from an external source, such as a global store or a URL query parameter, whose update mechanism you do not directly control and cannot simply wrap in startTransition. In practice, many real components end up using useDeferredValue specifically because the component doing the expensive rendering is not the same component that owns the state being typed into, whereas useTransition tends to appear directly inside the component that owns both the input\'s state and the triggering event handler.',
        aHi: 'Faisla karne wala factor ye hai ki kya tumhare paas seedhi pahunch hai, aur niyantran hai, us khaas state-update karne wali call par jo mehenga kaam trigger karti hai, ya kya tumhare paas kabhi bhi sirf ek value tak pahunch hai jo pehle se gani jaa chuki hai ya kahin se prapt hui hai jo tum control nahi karte. \`useTransition\` ek asli function call ko wrap karna maangta hai — ek setter ki call, jaisa \`setFiltered(...)\`, \`startTransition\` ke andar, matlab ye khaas taur par tab natural fit hai jab mehenga update trigger karne wala code ek aisi jagah rehta hai jise tum seedhe edit kar sakte ho, jaisa ek event handler jo tumne khud likha hai jo ek setState function bulaata hai jo tumhaara apna hai. \`useDeferredValue\`, iske ulta, kisi bhi setter call tak bilkul pahunch nahi maangta — ise sirf VALUE khud chahiye, aur us value ki ek doosri, jaan-boojhkar-peeche-rehti copy banaata hai jise tum phir asli ke bajaye istemal kar sakte ho jahan bhi mehenga rendering ispar nirbhar hai. Ye \`useDeferredValue\` ko khaas taur par un sthitiyon mein zyaada natural fit banaata hai jahan tum asli update call ko khud wrap nahi kar sakte, zyaadatar isliye kyunki sawaal mein value ek prop ki tarah aati hai jo ek parent component se neeche paas ki gayi hai jise transitions jaanne ya iski parwaah karne ka koi kaaran nahi hai, ya isliye kyunki value ek external source se aati hai, jaisa ek global store ya ek URL query parameter, jiski update mechanism tum seedhe control nahi karte aur ise \`startTransition\` mein aasaani se wrap nahi kar sakte. Practice mein, kayi asli components \`useDeferredValue\` istemal karke khatam hote hain khaas taur par isliye kyunki mehenga rendering karne wala component wahi component nahi hai jo type ki jaa rahi state ka malik hai, jabki \`useTransition\` seedhe us component ke andar dikhne ki jhukaav rakhta hai jo input ki state aur trigger karne waale event handler dono ka malik hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken example: a search input filtering a 10,000-item array directly in one ordinary state update. Confirm the input itself visibly lags while typing quickly.',
        taskHi: 'Toota example banao: ek search input jo ek 10,000-item array ko seedhe ek saadhaaran state update mein filter karta hai. Confirm karo ki tez type karte waqt input khud drishya roop se lag karta hai.',
        hint: 'Use the browser\'s performance profiler or simply time how long it takes for a typed character to visually appear in the input box while typing rapidly.',
        hintHi: 'Browser ke performance profiler ka istemal karo ya bas naapo ki tezi se type karte waqt ek type kiya gaya character input box mein drishyaman roop se dikhne mein kitna samay leta hai.',
      },
      {
        task: 'Fix it using useTransition, following this lesson\'s example. Add the isPending indicator and confirm typing now feels instant even as the filtered list catches up shortly after.',
        taskHi: 'Is lesson ke example ka palan karte hue \`useTransition\` se ise theek karo. \`isPending\` indicator jodo aur confirm karo ki typing ab turant mehsoos hoti hai chahe filtered list thodi der baad pakadti hai.',
        hint: 'Try typing several characters in quick succession and watch whether earlier, now-outdated filtering passes are visibly abandoned in favor of the latest one.',
        hintHi: 'Kayi characters ek ke baad ek tezi se type karne ki koshish karo aur dekho ki kya pehle wale, ab-purane filtering passes drishya roop se chhode jaate hain naye ke haq mein.',
      },
      {
        task: 'Rebuild the same fix using useDeferredValue instead, imagining the filtering component only receives query as a prop and cannot wrap the parent\'s own setQuery call. Compare the two approaches\' code.',
        taskHi: 'Wahi fix \`useDeferredValue\` se dobara banaao, ye kalpanaa karte hue ki filtering component ko \`query\` sirf ek prop ki tarah milti hai aur ye parent ki apni \`setQuery\` call ko wrap nahi kar sakta. Dono approaches ke code ki tulna karo.',
        hint: 'Notice that useDeferredValue never touches the setter at all — it only ever reads and transforms the value it is given.',
        hintHi: 'Notice karo ki \`useDeferredValue\` setter ko kabhi bilkul nahi chhuta — ye sirf us value ko padhta aur badalta hai jo ise diya gaya hai.',
      },
    ],

    keyTakeaways: [
      'Bundling an urgent state update (an input\'s own value) and an expensive one (filtering a huge list) into the same synchronous update makes the urgent one wait for the expensive one to finish.',
      'useTransition marks a specific state-updating call as interruptible and lower priority via startTransition, letting React abandon an in-progress low-priority render if a newer, more urgent update arrives.',
      'isPending, returned alongside startTransition, is true for as long as a transition is still in flight, letting the UI show a subtle "updating" indicator instead of silently displaying stale content.',
      'useDeferredValue takes a value, rather than a setter call, and produces a second, deliberately-lagging copy of it for expensive rendering, used when you cannot wrap the original update call yourself.',
      'Comparing a live value to its useDeferredValue counterpart (value !== deferredValue) is a common way to detect staleness, since useDeferredValue has no built-in isPending flag of its own.',
      'Neither hook makes the expensive work itself cheaper — they only control when that work is allowed to happen relative to more urgent updates, not how much computation it actually requires.',
    ],
    keyTakeawaysHi: [
      'Ek zaruri state update (ek input ki apni value) aur ek mehenge (ek vishaal list filter karna) ko ek hi synchronous update mein bundle karna zaruri wale ko mehenge ke khatam hone ka wait karaata hai.',
      '\`useTransition\` ek khaas state-update karne wali call ko \`startTransition\` ke zariye interrupt-ho-sakne-yogya aur kam-priority maarta hai, React ko ek chal rahe kam-priority render ko chhodne dete hue agar ek nayi, zyaada zaruri update aati hai.',
      '\`isPending\`, \`startTransition\` ke saath return hota hai, tab tak \`true\` rehta hai jab tak ek transition abhi bhi in flight hai, UI ko chupchaap stale content dikhaane ke bajaye ek halka "updating" indicator dikhaane deta hai.',
      '\`useDeferredValue\` ek setter call ke bajaye ek value leta hai, aur mehenge rendering ke liye iski ek doosri, jaan-boojhkar-peeche-rehti copy banaata hai, jab tum asli update call ko khud wrap nahi kar sakte tab istemal hota hai.',
      'Ek live value ko uske \`useDeferredValue\` counterpart se compare karna (\`value !== deferredValue\`) staleness detect karne ka ek aam tarika hai, kyunki \`useDeferredValue\` ka apna koi built-in \`isPending\` flag nahi hai.',
      'Koi bhi hook mehenge kaam ko khud sasta nahi banaata — wo sirf ye niyantrit karte hain ki wo kaam zyaada zaruri updates ke saapeksh kab hone ki anumati hai, ye nahi ki ise asal mein kitna computation chahiye.',
    ],
  },
];
