/**
 * React Complete Course — Module 1: React Fundamentals, lesson 1.
 *
 * Every concept in this course is shown TWICE, back to back: once as plain
 * JavaScript (.jsx), once as TypeScript (.tsx) — so the reader sees exactly
 * what changes (prop types, generics on hooks) and exactly what stays
 * identical (JSX structure, component logic), instead of having to guess
 * or hold two separate mental models. The TS version's `explain` field
 * calls out the delta explicitly and ties back to the TypeScript course
 * wherever relevant.
 *
 * The broken example is imperative DOM manipulation — updating a counter by
 * hand with querySelector calls — used to motivate WHY React's declarative
 * model exists before teaching its syntax.
 *
 * `output` is used (not `preview`) to describe the rendered UI as text,
 * matching the JS/TS courses' pattern rather than the CSS course's live
 * iframe rendering, since this course is fundamentally about component
 * logic, not visual CSS.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields) — a plain backtick used
 * for inline code inside one of those template literals terminates the
 * literal early and produces a confusing cascade of parser errors hundreds
 * of lines away. Single-quoted string fields (explain, why, q, a, task,
 * keyTakeaways, etc.) do NOT need backticks escaped — only escape apostrophes
 * there (\'). Run `npx tsc --noEmit -p .` after writing this file, before
 * wiring it into seed.ts — it is the only fully reliable check for this
 * mistake, more reliable than any regex scan.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_1: CourseLesson[] = [
  {
    slug: 'jsx-and-your-first-component',
    title: 'JSX and Your First Component',
    titleHi: 'JSX aur Aapka Pehla Component',
    description: 'A counter updated by hand with five querySelector calls — and what happens the day a sixth place on the page also needs to know the count.',
    descriptionHi: 'Paanch querySelector calls se haath se update kiya gaya counter — aur us din kya hota hai jab page par chhati jagah ko bhi count jaanna hai.',
    difficulty: 'EASY',
    duration: 28,
    order: 1,

    analogy: {
      en: '**Turn-by-turn directions versus typing in a destination.** "Turn left at the light, go two blocks, turn right, it\'s the third building" is imperative — you are the one responsible for every single step, and if the road changes, every direction you gave is now wrong and needs manual updating. Typing a destination into a GPS is declarative — you say *where you want to end up*, and the GPS figures out and continually re-figures out every turn on its own, even if the road changes. Vanilla DOM manipulation (`document.querySelector(...).textContent = ...`) is turn-by-turn directions. React is typing in the destination: you describe what the UI *should look like* for a given piece of data, and React works out which turns — which actual DOM changes — get you there.',
      hi: '**Turn-by-turn directions aur ek destination type karna.** "Light par baayein mudo, do block jao, dayein mudo, teesri building hai" imperative hai — har ek kadam ke liye aap zimmedaar ho, aur agar sadak badle, aapki di har direction ab galat hai aur haath se update karni padegi. GPS mein destination type karna declarative hai — aap kehte ho *aapko kahan pahunchna hai*, aur GPS khud har mod nikaalta hai aur baar-baar dobara nikaalta hai, sadak badalne par bhi. Vanilla DOM manipulation (\`document.querySelector(...).textContent = ...\`) turn-by-turn directions hai. React destination type karna hai: aap batate ho UI ek diye hue data ke liye *kaisa dikhna chahiye*, aur React khud nikaalta hai kaunse mod — kaunse asli DOM badlaav — aapko wahan pahunchaate hain.',
    },

    simple: `**Start broken.** A counter, updated the way you would without any library:

\`\`\`html
<p id="count">0</p>
<button id="increment">+1</button>
<button id="reset">Reset</button>
\`\`\`

\`\`\`js
let count = 0;
const countEl = document.querySelector("#count");

document.querySelector("#increment").addEventListener("click", () => {
  count++;
  countEl.textContent = count;   // you must remember to sync the display, every time
});

document.querySelector("#reset").addEventListener("click", () => {
  count = 0;
  countEl.textContent = count;   // ...and again here
});
\`\`\`

This works. But every place \`count\` changes, you had to remember to also update \`countEl.textContent\` — the data and the display are two separate things you must keep in sync *by hand*, forever. Add a second place on the page that also shows the count (a header badge, a page title), and now you must remember to update *that* too, in both handlers. Miss one, and the two displays silently disagree — a real, extremely common bug class in hand-written UI code.

**React: describe what the UI looks like for the current data, and stop managing the DOM yourself**

\`\`\`jsx
// Counter.jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
\`\`\`

\`\`\`tsx
// Counter.tsx — identical, no type annotations needed here at all
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);   // TypeScript infers "count: number" from the 0

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
\`\`\`

Notice the \`.tsx\` version is *identical* — no annotations were needed, because \`useState(0)\` lets TypeScript infer \`count\` is a \`number\` the same way \`let x = 5\` did all the way back in the TypeScript course's first lesson. \`{count}\` inside the JSX is where React reads the current value; \`setCount(...)\` is how you tell React the value changed. You never write \`countEl.textContent = ...\` anywhere — React re-reads \`{count}\` and updates the DOM itself, every time \`setCount\` is called, no matter how many places on the page display it.

**JSX is not HTML — it is JavaScript with an HTML-shaped syntax**

\`\`\`jsx
function Greeting() {
  const name = "Priya";
  return <h1>Hello, {name}!</h1>;   // {} drops back into plain JavaScript
}
\`\`\`

\`<h1>Hello, {name}!</h1>\` looks like HTML but is actually JavaScript — it compiles to a plain function call (\`React.createElement("h1", null, "Hello, ", name, "!")\`) before it ever runs. \`{...}\` inside JSX is how you escape back into ordinary JavaScript expressions — a variable, a function call, a ternary — anything that evaluates to a value.

**A component is just a function that returns JSX**

\`\`\`jsx
function Greeting() {
  return <h1>Hello!</h1>;
}
\`\`\`

That is the entire definition. A React component is a regular JavaScript function, with two conventions: its name starts with a capital letter (so React can tell it apart from a plain HTML tag like \`<div>\`), and it returns JSX describing what should appear on screen.

**Remember:** vanilla JS makes you manually keep the DOM in sync with your data, everywhere it changes, forever. React lets you describe the UI as a function of the data once, and re-renders it for you — the \`.tsx\` version of nearly everything in this course looks identical to the \`.jsx\` version until a component actually needs to describe a shape TypeScript cannot infer on its own.`,

    simpleHi: `**Toote hue se shuru.** Ek counter, jaise use bina kisi library ke update karoge:

\`\`\`html
<p id="count">0</p>
<button id="increment">+1</button>
<button id="reset">Reset</button>
\`\`\`

\`\`\`js
let count = 0;
const countEl = document.querySelector("#count");

document.querySelector("#increment").addEventListener("click", () => {
  count++;
  countEl.textContent = count;   // aapko har baar display sync karna yaad rakhna hai
});

document.querySelector("#reset").addEventListener("click", () => {
  count = 0;
  countEl.textContent = count;   // ...aur yahan bhi dobara
});
\`\`\`

Ye chalta hai. Par jahan bhi \`count\` badalta hai, aapko \`countEl.textContent\` bhi update karna yaad rakhna padta hai — data aur display do alag cheezein hain jinhe aapko *haath se* hamesha sync rakhna hai. Page par ek doosri jagah jodo jahan bhi count dikhta ho (header badge, page title), aur ab aapko *usse* bhi update karna yaad rakhna hai, dono handlers mein. Ek chhoot jaaye, aur dono displays chupchap ek doosre se alag ho jaate hain — haath se likhe UI code mein ek asli, kaafi aam bug category.

**React: abhi ke data ke liye UI kaisa dikhta hai bataao, aur khud DOM sambhalna band karo**

\`\`\`jsx
// Counter.jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
\`\`\`

\`\`\`tsx
// Counter.tsx — bilkul wahi, yahan koi type annotations chahiye nahi
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);   // TypeScript 0 se "count: number" infer karta hai

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
\`\`\`

Dhyan do \`.tsx\` version *bilkul wahi* hai — koi annotations chahiye nahi thi, kyunki \`useState(0)\` TypeScript ko \`count\` ko \`number\` infer karne deta hai bilkul waise jaise TypeScript course ke bilkul pehle lesson mein \`let x = 5\` karta tha. JSX ke andar \`{count}\` wo jagah hai jahan React abhi ki value padhta hai; \`setCount(...)\` React ko batane ka tarika hai ki value badal gayi. Aap kahin bhi \`countEl.textContent = ...\` nahi likhte — React \`{count}\` ko dobara padhta hai aur DOM khud update karta hai, har baar jab \`setCount\` bulaya jaata hai, page par wo kitni bhi jagah dikhaya jaaye.

**JSX HTML nahi hai — ye HTML-jaisi syntax wali JavaScript hai**

\`\`\`jsx
function Greeting() {
  const name = "Priya";
  return <h1>Hello, {name}!</h1>;   // {} wapas saadhi JavaScript mein le jaata hai
}
\`\`\`

\`<h1>Hello, {name}!</h1>\` HTML jaisa dikhta hai par asal mein JavaScript hai — ye chalne se pehle ek saadhe function call mein compile hota hai (\`React.createElement("h1", null, "Hello, ", name, "!")\`). JSX ke andar \`{...}\` wapas aam JavaScript expressions mein escape karne ka tarika hai — variable, function call, ternary — koi bhi cheez jo ek value tak evaluate ho.

**Component bas ek function hai jo JSX lautaata hai**

\`\`\`jsx
function Greeting() {
  return <h1>Hello!</h1>;
}
\`\`\`

Yahi poori definition hai. React component ek aam JavaScript function hai, do conventions ke saath: uska naam capital letter se shuru hota hai (taaki React use saadhe HTML tag \`<div>\` se alag pehchaan sake), aur ye JSX lautaata hai jo batata hai screen par kya dikhna chahiye.

**Yaad rakho:** vanilla JS aapko apne data se DOM ko haath se sync rakhna majboor karta hai, jahan bhi wo badle, hamesha. React aapko UI ko data ka ek function ki tarah ek baar batane deta hai, aur use aapke liye dobara render karta hai — is course ki lagbhag har cheez ka \`.tsx\` version \`.jsx\` version jaisa hi dikhta hai jab tak koi component sach mein aisi shape na batae jo TypeScript khud infer nahi kar sakta.`,

    content: `## JSX rules: what actually compiles

\`\`\`jsx
// Every element must be closed, even ones with no children
<img src="photo.jpg" />       // NOT <img src="photo.jpg">
<br />

// Every component must return exactly ONE root element
function Broken() {
  return (
    <h1>Title</h1>
    <p>Text</p>              // Error: JSX expressions must have one parent element
  );
}

// Fixed: wrap in a single element, or a Fragment (an invisible wrapper)
function Fixed() {
  return (
    <>
      <h1>Title</h1>
      <p>Text</p>
    </>
  );
}
\`\`\`

\`<>...</>\` is a **Fragment** — shorthand for \`<React.Fragment>...</React.Fragment>\` — a wrapper that groups multiple elements without adding an actual extra \`<div>\` to the real DOM. It exists specifically because "return exactly one root element" is a hard JSX rule, and wrapping everything in an unnecessary \`<div>\` just to satisfy it would pollute the page's actual HTML structure.

## camelCase attributes, and className instead of class

\`\`\`jsx
// HTML:  <div class="card" onclick="...">
// JSX:
<div className="card" onClick={handleClick}>
\`\`\`

JSX attributes are JavaScript property names, not HTML attribute names — \`class\` is a reserved word in JavaScript (used for actual JS classes), so JSX uses \`className\` instead. Every multi-word HTML attribute becomes camelCase: \`onclick\` becomes \`onClick\`, \`tabindex\` becomes \`tabIndex\`, \`stroke-width\` (in SVG) becomes \`strokeWidth\`.

## Embedding JavaScript expressions with {}

\`\`\`jsx
function Price({ amount }) {
  return (
    <p>
      Price: \${amount}                        {/* plain text — no braces needed */}
      Price: \${amount.toFixed(2)}              {/* a function call */}
      Price: {amount > 100 ? "Expensive" : "Affordable"}   {/* a ternary */}
    </p>
  );
}
\`\`\`

\`{}\` is not special JSX syntax layered on top of JavaScript — it is a literal escape hatch back into ordinary JavaScript expression evaluation. Anything that produces a value — a variable, a function call, a ternary, arithmetic — can go inside \`{}\`. Statements (\`if\`, \`for\`, variable declarations) cannot go directly inside \`{}\`, because JSX only accepts *expressions*, not statements — this is exactly why conditional rendering (covered later in this module) reaches for ternaries and \`&&\` rather than \`if\` blocks written inline.

## Components: JavaScript functions with two conventions

\`\`\`jsx
function Greeting() {              // capitalised name — React treats this as a component
  return <h1>Hello!</h1>;
}

function greeting() {              // lowercase — React would treat <greeting /> as an unknown HTML tag
  return <h1>Hello!</h1>;
}
\`\`\`

React distinguishes your own components from built-in HTML tags purely by capitalisation: \`<Greeting />\` (capital G) is treated as your component function being called; \`<greeting />\` (lowercase) would be treated as an attempt to render an HTML tag literally named \`greeting\`, which does not exist. This is not a style preference — it is how JSX itself decides which of the two to do.

## The .jsx / .tsx file extension difference

\`\`\`
Counter.jsx    — plain JavaScript with JSX syntax
Counter.tsx    — TypeScript with JSX syntax
\`\`\`

A \`.tsx\` file is checked by the TypeScript compiler exactly like a \`.ts\` file (everything from the TypeScript course applies), with the added ability to write JSX syntax directly in the file — a plain \`.ts\` file cannot contain JSX at all; attempting to write \`<div>\` in one produces a syntax error, because the compiler does not know to expect it there.

## Setting up: create-react-app is deprecated, use Vite

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
\`\`\`

Vite is the modern standard for starting a new React project — it compiles JSX/TSX and serves the app with near-instant reload during development. The \`react-ts\` template scaffolds a project with TypeScript already configured; a plain \`react\` template gives you \`.jsx\` files instead, with no type checking at all.`,

    contentHi: `## JSX ke niyam: asal mein kya compile hota hai

\`\`\`jsx
// Har element band hona chahiye, un mein bhi jinke koi children nahi
<img src="photo.jpg" />       // <img src="photo.jpg"> NAHI
<br />

// Har component ko bilkul EK root element lautaana chahiye
function Broken() {
  return (
    <h1>Title</h1>
    <p>Text</p>              // Error: JSX expressions must have one parent element
  );
}

// Theek: ek akele element mein lapeto, ya ek Fragment (adrishya wrapper) mein
function Fixed() {
  return (
    <>
      <h1>Title</h1>
      <p>Text</p>
    </>
  );
}
\`\`\`

\`<>...</>\` ek **Fragment** hai — \`<React.Fragment>...</React.Fragment>\` ka shorthand — ek wrapper jo kai elements ko asli DOM mein ek extra \`<div>\` joda bina group karta hai. Ye khaas taur par isliye maujood hai kyunki "bilkul ek root element lautaao" ek pakka JSX niyam hai, aur sab kuch bina zarurat wale \`<div>\` mein lapetna ise sant karne ke liye page ki asli HTML structure ko ganda kar dega.

## camelCase attributes, aur class ke bajaye className

\`\`\`jsx
// HTML:  <div class="card" onclick="...">
// JSX:
<div className="card" onClick={handleClick}>
\`\`\`

JSX attributes JavaScript property naam hain, HTML attribute naam nahi — \`class\` JavaScript mein ek reserved word hai (asli JS classes ke liye use hota hai), isliye JSX iske bajaye \`className\` use karta hai. Har kai-shabd wala HTML attribute camelCase ban jaata hai: \`onclick\` \`onClick\` ban jaata hai, \`tabindex\` \`tabIndex\` ban jaata hai, \`stroke-width\` (SVG mein) \`strokeWidth\` ban jaata hai.

## {} se JavaScript expressions embed karna

\`\`\`jsx
function Price({ amount }) {
  return (
    <p>
      Price: \${amount}                        {/* saadha text — braces chahiye nahi */}
      Price: \${amount.toFixed(2)}              {/* ek function call */}
      Price: {amount > 100 ? "Expensive" : "Affordable"}   {/* ek ternary */}
    </p>
  );
}
\`\`\`

\`{}\` koi khaas JSX syntax nahi hai jo JavaScript ke upar lagi hai — ye seedha aam JavaScript expression evaluation mein wapas jaane ka escape hatch hai. Jo bhi value banata hai — variable, function call, ternary, arithmetic — \`{}\` ke andar ja sakta hai. Statements (\`if\`, \`for\`, variable declarations) seedhe \`{}\` ke andar nahi ja sakte, kyunki JSX sirf *expressions* qubool karta hai, statements nahi — bilkul isi wajah se conditional rendering (is module mein baad mein cover hoga) inline likhe \`if\` blocks ke bajaye ternaries aur \`&&\` uthaata hai.

## Components: do conventions wale JavaScript functions

\`\`\`jsx
function Greeting() {              // capital naam — React ise component maanta hai
  return <h1>Hello!</h1>;
}

function greeting() {              // lowercase — React <greeting /> ko anjaan HTML tag maanega
  return <h1>Hello!</h1>;
}
\`\`\`

React aapke apne components ko built-in HTML tags se sirf capitalisation se alag karta hai: \`<Greeting />\` (capital G) ko aapka component function bulaaya jaana maana jaata hai; \`<greeting />\` (lowercase) ko \`greeting\` naam ka HTML tag render karne ki koshish maana jaayega, jo maujood hi nahi. Ye style ki pasand nahi hai — JSX khud isi se tay karta hai in do mein se kya karna hai.

## .jsx / .tsx file extension ka fark

\`\`\`
Counter.jsx    — JSX syntax wali saadhi JavaScript
Counter.tsx    — JSX syntax wali TypeScript
\`\`\`

\`.tsx\` file ko TypeScript compiler bilkul \`.ts\` file jaisa check karta hai (TypeScript course ki har baat lagu hoti hai), file mein seedha JSX syntax likhne ki extra ability ke saath — saadhi \`.ts\` file mein JSX bilkul nahi ho sakta; usme \`<div>\` likhne ki koshish syntax error deti hai, kyunki compiler ko wahan uski ummeed hi nahi hoti.

## Setup karna: create-react-app deprecated hai, Vite use karo

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
\`\`\`

Vite naya React project shuru karne ka modern standard hai — ye JSX/TSX compile karta hai aur development ke dauran lagbhag turant reload ke saath app serve karta hai. \`react-ts\` template pehle se configured TypeScript wala project banaata hai; saadha \`react\` template iske bajaye \`.jsx\` files deta hai, bina kisi type checking ke.`,

    examples: [
      {
        title: 'A minimal component',
        titleHi: 'Ek chhota component',
        code: `function Greeting() {
  return <h1>Hello, world!</h1>;
}

export default Greeting;`,
        codeJs: `function Greeting() {
  return <h1>Hello, world!</h1>;
}

export default Greeting;`,
        codeTs: `function Greeting() {
  return <h1>Hello, world!</h1>;
}

export default Greeting;
// BYTE-FOR-BYTE IDENTICAL to the .jsx version — no type annotations
// were needed. TypeScript only shows up once a component has a shape
// to describe (props, state) — flip back to JavaScript above and
// compare character by character.`,
        output: `Renders on the page:
<h1>Hello, world!</h1>

// A component is just a function returning JSX. Nothing else is required.`,
        explain: 'This is the first and most important thing to notice about pairing JS and TS: when there is nothing to type, there is nothing to write differently. Toggle the button above — the .jsx and .tsx versions are identical.',
        explainHi: 'Ye JS aur TS ko jodne ke baare mein pehli aur sabse zaruri baat hai: jab type karne ko kuch na ho, alag likhne ko kuch nahi. Upar wala button toggle karo — .jsx aur .tsx versions ek jaise hain.',
      },
      {
        title: 'A component with props',
        titleHi: 'Props wala component',
        code: `function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

<Greeting name="Priya" />
<Greeting name={42} />        {/* no warning — name was never typed */}`,
        codeJs: `function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

<Greeting name="Priya" />
<Greeting name={42} />        {/* no warning — name was never typed */}`,
        codeTs: `interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}

<Greeting name="Priya" />
<Greeting name={42} />`,
        outputJs: `Renders:
<h1>Hello, Priya!</h1>
<h1>Hello, 42!</h1>

// The second usage is almost certainly a mistake, but nothing here
// catches it — "name" could be anything at all.`,
        outputTs: `// First usage: compiles fine, renders <h1>Hello, Priya!</h1>

// Second usage:
Error: Type 'number' is not assignable to type 'string'.

// Caught at the exact call site, before the component ever renders —
// this is Module 2 of the TypeScript course's interface pattern, applied
// directly to a component's props. Toggle back to JavaScript above to
// see the exact same mistake compile with zero warning.`,
        explain: 'The `GreetingProps` interface is an ordinary TypeScript interface, exactly as covered in the TypeScript course — the only new thing is that it describes what a component receives rather than a plain function parameter.',
        explainHi: '\`GreetingProps\` ek aam TypeScript interface hai, bilkul TypeScript course mein cover hui tarah — naya sirf itna hai ki ye batata hai component ko kya milta hai, saadhe function parameter ke bajaye.',
      },
      {
        title: 'Rendering a list with .map',
        titleHi: '.map se list render karna',
        code: `function FruitList({ fruits }) {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}

<FruitList fruits={["apple", "banana", "mango"]} />`,
        codeJs: `function FruitList({ fruits }) {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}

<FruitList fruits={["apple", "banana", "mango"]} />`,
        codeTs: `interface FruitListProps {
  fruits: string[];
}

function FruitList({ fruits }: FruitListProps) {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}

<FruitList fruits={["apple", "banana", "mango"]} />
<FruitList fruits={[1, 2, 3]} />`,
        outputJs: `Renders:
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>mango</li>
</ul>

// "fruits" could be an array of anything — numbers, objects, other
// arrays — nothing here restricts it.`,
        outputTs: `// First usage: compiles fine, identical rendered output to JavaScript.

// Second usage (an array of numbers):
Error: Type 'number[]' is not assignable to type 'string[]'.

// "fruits: string[]" makes the wrong element type a compile error, not
// a silent runtime surprise. Inside the component, "fruit" in .map() is
// automatically known to be a string — no annotation needed on the
// callback itself.`,
        explain: 'The `.map()` here is plain JavaScript either way, exactly as covered in the JS course — the TypeScript version only adds a boundary check on what array shape is allowed in, at the point the component is used.',
        explainHi: 'Yahan \`.map()\` dono taraf saadhi JavaScript hai, bilkul JS course mein cover hui tarah — TypeScript version sirf ek seemaa check jodta hai ki component use hote waqt kaunsi array shape andar aane ki ijazat hai.',
      },
      {
        title: 'Conditional rendering with && and ternary',
        titleHi: '&& aur ternary se conditional rendering',
        code: `function Notification({ message, isUrgent }) {
  return (
    <div>
      {isUrgent && <span>URGENT: </span>}
      {message ? <p>{message}</p> : <p>No new notifications</p>}
    </div>
  );
}

<Notification message="Server down" isUrgent={true} />`,
        codeJs: `function Notification({ message, isUrgent }) {
  return (
    <div>
      {isUrgent && <span>URGENT: </span>}
      {message ? <p>{message}</p> : <p>No new notifications</p>}
    </div>
  );
}

<Notification message="Server down" isUrgent={true} />
<Notification message="" isUrgent="yes" />`,
        codeTs: `interface NotificationProps {
  message: string;
  isUrgent: boolean;
}

function Notification({ message, isUrgent }: NotificationProps) {
  return (
    <div>
      {isUrgent && <span>URGENT: </span>}
      {message ? <p>{message}</p> : <p>No new notifications</p>}
    </div>
  );
}

<Notification message="Server down" isUrgent={true} />
<Notification message="" isUrgent="yes" />`,
        outputJs: `Renders (first call):
<div><span>URGENT: </span><p>Server down</p></div>

// Second call, with isUrgent="yes" (a string, not a boolean) — this
// compiles and even happens to render as truthy, purely by accident of
// how JavaScript's && operator treats non-empty strings.`,
        outputTs: `// First call: compiles fine, identical rendered output to JavaScript.

// Second call:
Error: Type 'string' is not assignable to type 'boolean'.

// "isUrgent" must genuinely be a boolean now — the string "yes" (a
// common mistake, since it LOOKS truthy) is caught immediately, instead
// of "working" by accident the way it did in the JavaScript version.`,
        explain: 'Both `&&` and the ternary are ordinary JavaScript expressions (JS course), not special JSX syntax — typing `isUrgent` as `boolean` removes the ambiguity that lets a non-boolean value silently "pass" through `&&` by accident.',
        explainHi: '\`&&\` aur ternary dono aam JavaScript expressions hain (JS course), koi khaas JSX syntax nahi — \`isUrgent\` ko \`boolean\` type karna wo abhaas hataata hai jo galti se \`&&\` se guzarti non-boolean value ko "chalne" deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `function Broken() {
  return (
    <h1>Title</h1>
    <p>Text</p>
  );
}
/* Error: JSX expressions must have one parent element */`,
        right: `function Fixed() {
  return (
    <>
      <h1>Title</h1>
      <p>Text</p>
    </>
  );
}`,
        why: 'A component must return exactly one root element — wrapping multiple elements in a Fragment (`<>...</>`) satisfies this rule without adding an unnecessary extra `<div>` to the actual rendered DOM.',
        whyHi: 'Component ko bilkul ek root element lautaana chahiye — kai elements ko Fragment (\`<>...</>\`) mein lapetna is niyam ko poora karta hai bina asli render hue DOM mein ek fizool extra \`<div>\` jode.',
      },
      {
        wrong: `<div class="card" onclick={handleClick}>
/* using raw HTML attribute names inside JSX */`,
        right: `<div className="card" onClick={handleClick}>`,
        why: 'JSX attributes are JavaScript property names, not HTML attribute names — `class` is a reserved word in JavaScript, so JSX uses `className`, and multi-word attributes like `onclick` become camelCase (`onClick`).',
        whyHi: 'JSX attributes JavaScript property naam hain, HTML attribute naam nahi — \`class\` JavaScript mein reserved word hai, isliye JSX \`className\` use karta hai, aur \`onclick\` jaise kai-shabd wale attributes camelCase (\`onClick\`) ban jaate hain.',
      },
      {
        wrong: `function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
/* no type on "name" — a caller can pass anything at all */`,
        right: `interface GreetingProps {
  name: string;
}
function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}`,
        why: 'An untyped prop in a .jsx component accepts any value, exactly like an untyped function parameter in plain JavaScript — a props interface, the same pattern from the TypeScript course\'s Module 2, catches a mismatched prop value at the call site.',
        whyHi: '.jsx component mein bina-type prop koi bhi value qubool karta hai, bilkul saadhi JavaScript mein bina-type function parameter jaisa — props interface, TypeScript course ke Module 2 wala wahi pattern, call site par galat prop value pakadta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Nearly every production React codebase started in the last few years is written in .tsx, not .jsx.** The State of JS and State of React developer surveys consistently show TypeScript as the majority choice for new React projects, which is exactly why this course teaches both side by side rather than treating TypeScript as optional.',
        hi: '**Pichle kai saalon mein shuru hui lagbhag har production React codebase .tsx mein likhi jaati hai, .jsx mein nahi.** State of JS aur State of React developer surveys lagatar dikhaate hain ki TypeScript naye React projects ke liye zyadatar chunaav hai, aur bilkul isi wajah se ye course dono ko saath sikhata hai, TypeScript ko optional maankar nahi.',
      },
      {
        en: '**Vite\'s `react-ts` template is the default recommendation in React\'s own official documentation** for starting a new project — this is not a niche preference, it is the standard on-ramp most working React developers actually use today.',
        hi: '**Vite ka \`react-ts\` template React ki apni official documentation mein naya project shuru karne ke liye default sifarish hai** — ye koi khaas pasand nahi hai, ye wahi standard raasta hai jo aaj zyadatar kaam kar rahe React developers asal mein use karte hain.',
      },
      {
        en: '**Fragments are used constantly in real components returning table rows, list items, or multiple siblings** — a `<tr>` needing to return several `<td>` elements without an illegal wrapper `<div>` breaking the table structure is a textbook use case.',
        hi: '**Fragments un asli components mein lagatar use hote hain jo table rows, list items, ya kai siblings lautaate hain** — ek \`<tr>\` jise kai \`<td>\` elements lautaane hain bina kisi galat wrapper \`<div>\` ke jo table structure tod de, ye ek textbook use case hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is JSX, and is it valid HTML?',
        qHi: 'JSX kya hai, aur kya ye valid HTML hai?',
        a: 'JSX is a syntax extension for JavaScript that lets you write HTML-like markup directly inside JavaScript code. It is not HTML — it compiles, before the code ever runs, into plain JavaScript function calls (roughly `React.createElement(type, props, ...children)`), which is why JSX uses JavaScript naming conventions like `className` instead of `class` and `onClick` instead of `onclick`: the underlying construct is a JavaScript function call, not an HTML attribute. Browsers never execute JSX directly; a build tool (Babel, or the TypeScript compiler for .tsx files) transforms it into plain JavaScript first.',
        aHi: 'JSX JavaScript ke liye ek syntax extension hai jo aapko JavaScript code ke andar seedha HTML-jaisa markup likhne deta hai. Ye HTML nahi hai — ye, code chalne se pehle, saadhe JavaScript function calls mein compile hota hai (lagbhag \`React.createElement(type, props, ...children)\`), isi wajah se JSX \`class\` ke bajaye \`className\` aur \`onclick\` ke bajaye \`onClick\` jaisi JavaScript naming conventions use karta hai: andar ka construct ek JavaScript function call hai, HTML attribute nahi. Browsers kabhi JSX seedha nahi chalate; ek build tool (Babel, ya .tsx files ke liye TypeScript compiler) use pehle saadhi JavaScript mein badalta hai.',
      },
      {
        q: 'Why must a React component return only one root element, and what is a Fragment for?',
        qHi: 'React component ko sirf ek root element kyun lautaana chahiye, aur Fragment kis liye hai?',
        a: 'JSX compiles to a function call representing a single element tree — `React.createElement` takes one type and one set of children, so there is structurally no way for a component to return two sibling elements without something containing both of them. A `<div>` could serve that containing role, but it would add a real, unwanted extra element to the actual rendered DOM, which can break CSS layouts (like a `<tr>` needing to directly contain `<td>` elements) or add meaningless nesting. A Fragment (`<>...</>` or `<React.Fragment>...</React.Fragment>`) satisfies the "one root" rule by grouping multiple elements together without rendering any actual DOM node itself.',
        aHi: 'JSX ek function call mein compile hota hai jo ek akela element tree darshaata hai — \`React.createElement\` ek type aur ek set children leta hai, isliye structurally component ke liye do sibling elements lautaane ka koi tarika nahi jab tak kuch dono ko rakhta na ho. \`<div>\` wo rakhne wala role nikaal sakta tha, par ye asli render hue DOM mein ek asli, fizool extra element jodta, jo CSS layouts tod sakta hai (jaise \`<tr>\` ko seedha \`<td>\` elements rakhne chahiye) ya bemaani nesting joda. Fragment (\`<>...</>\` ya \`<React.Fragment>...</React.Fragment>\`) "ek root" niyam ko poora karta hai kai elements ko saath group karke bina khud koi asli DOM node render kiye.',
      },
      {
        q: 'What is the difference between how a component receives props in .jsx versus .tsx?',
        qHi: '.jsx aur .tsx mein component props kaise paata hai, isme kya fark hai?',
        a: 'In both, props are received identically at the JavaScript level — typically destructured directly in the function\'s parameter list, like `function Greeting({ name })`. The difference is purely at the type level: in .jsx, `name` has no declared type and can be passed anything at all by a caller with no compile-time warning, exactly like an untyped function parameter in plain JavaScript. In .tsx, a props interface (`interface GreetingProps { name: string }`) is declared and applied as the parameter\'s type (`{ name }: GreetingProps`), which restricts what a caller can pass and catches a mismatched value at the exact call site — the same interface pattern from the TypeScript course, applied to a component instead of a plain function.',
        aHi: 'Dono mein, props JavaScript level par bilkul ek jaisa milta hai — aksar seedha function ki parameter list mein destructure hota hai, jaise \`function Greeting({ name })\`. Fark poori tarah type level par hai: .jsx mein, \`name\` ka koi declared type nahi hai aur caller use kuch bhi pass kar sakta hai bina compile-time warning, bilkul saadhi JavaScript mein bina-type function parameter jaisa. .tsx mein, props interface (\`interface GreetingProps { name: string }\`) declare hota hai aur parameter ke type ki tarah lagu hota hai (\`{ name }: GreetingProps\`), jo caller kya pass kar sakta hai seemit karta hai aur bilkul call site par galat-milti value pakadta hai — TypeScript course wala wahi interface pattern, saadhe function ke bajaye component par lagu.',
      },
      {
        q: 'Why does JSX use `className` instead of `class`?',
        qHi: 'JSX \`class\` ke bajaye \`className\` kyun use karta hai?',
        a: '`class` is a reserved keyword in JavaScript, used to define actual JavaScript classes. Since JSX compiles to plain JavaScript function calls where attributes become object property names, using `class` as a property name would collide with the reserved keyword. JSX sidesteps this by using `className`, which maps directly to the DOM\'s own `className` property (the actual JavaScript property used to read or set an element\'s CSS class, distinct from the HTML attribute name `class`). This is one instance of a broader pattern: JSX attributes are JavaScript property names, not HTML attribute names, which is also why multi-word attributes are written in camelCase.',
        aHi: '\`class\` JavaScript mein ek reserved keyword hai, asli JavaScript classes define karne ke liye use hota hai. Kyunki JSX saadhe JavaScript function calls mein compile hota hai jahan attributes object property naam ban jaate hain, property naam ki tarah \`class\` use karna reserved keyword se takraata. JSX \`className\` use karke ise bachaata hai, jo seedha DOM ki apni \`className\` property se milta hai (asli JavaScript property jo element ki CSS class padhne ya set karne ke liye use hoti hai, HTML attribute naam \`class\` se alag). Ye ek badi pattern ka udahran hai: JSX attributes JavaScript property naam hain, HTML attribute naam nahi, isi wajah se kai-shabd wale attributes camelCase mein likhe jaate hain.',
      },
      {
        q: 'What determines whether JSX like `<Foo />` is treated as a custom component or an HTML element?',
        qHi: '\`<Foo />\` jaisa JSX custom component maana jaaye ya HTML element, ye kya tay karta hai?',
        a: 'JSX distinguishes the two purely by the first letter\'s capitalisation. A lowercase tag name, like `<div>` or `<button>`, is treated as a built-in HTML element and rendered as that literal DOM tag. A capitalised tag name, like `<Greeting />`, is treated as a reference to a JavaScript variable (typically a function or class component) in scope, and React calls that function to determine what to render. This is why component names must always start with a capital letter — a lowercase component function name would cause JSX to treat `<myComponent />` as an attempt to render an HTML tag literally named "myComponent", which does not exist and would simply fail to render anything meaningful.',
        aHi: 'JSX in dono ko sirf pehle akshar ki capitalisation se alag karta hai. Lowercase tag naam, jaise \`<div>\` ya \`<button>\`, built-in HTML element ki tarah maana jaata hai aur us seedhi DOM tag ki tarah render hota hai. Capital tag naam, jaise \`<Greeting />\`, scope mein maujood ek JavaScript variable (aksar function ya class component) ke reference ki tarah maana jaata hai, aur React ye tay karne ke liye us function ko bulaata hai ki kya render karna hai. Isi wajah se component naam hamesha capital letter se shuru hone chahiye — lowercase component function naam JSX ko \`<myComponent />\` ko "myComponent" naam ki HTML tag render karne ki koshish maanne majboor karega, jo maujood hi nahi aur bas kuch matlab wala render karne mein fail ho jaayega.',
      },
    ],

    exercises: [
      {
        task: 'Build the same counter twice: once with vanilla JS and querySelector, once as a React component with useState. Click both a few times and compare how much code each approach needed to keep the display in sync.',
        taskHi: 'Wahi counter do baar banao: ek baar vanilla JS aur querySelector se, ek baar useState wale React component ki tarah. Dono ko kai baar click karo aur compare karo har tarike ko display sync rakhne ke liye kitna code chahiye tha.',
        hint: 'Add a second place on the page showing the same count in both versions, and notice how many lines you had to change in each to support it.',
        hintHi: 'Dono versions mein page par ek doosri jagah jodo jahan wahi count dikhta ho, aur dekho use support karne ke liye har ek mein aapko kitni lines badalni padi.',
      },
      {
        task: 'Write a `Greeting` component in .jsx with an untyped `name` prop, then rewrite it in .tsx with a `GreetingProps` interface. Try passing a number instead of a string to each and compare the results.',
        taskHi: '.jsx mein bina-type \`name\` prop wala \`Greeting\` component likho, phir use \`GreetingProps\` interface ke saath .tsx mein dobara likho. Har ek ko string ke bajaye number pass karke dekho aur nateeje compare karo.',
        hint: 'Use `npx tsc --noEmit` on the .tsx version to see the compile error directly, rather than only spotting the mistake by looking at rendered output.',
        hintHi: '.tsx version par \`npx tsc --noEmit\` use karo compile error seedha dekhne ke liye, sirf render hue output ko dekh kar galti pakadne ke bajaye.',
      },
      {
        task: 'Write a component rendering a list with `.map()` in both .jsx and .tsx, typing the .tsx version\'s prop as `string[]`. Try passing an array of numbers to the .tsx version and read the exact error.',
        taskHi: '.jsx aur .tsx dono mein \`.map()\` se list render karne wala component likho, .tsx version ke prop ko \`string[]\` type karte hue. .tsx version ko numbers ka array pass karke dekho aur exact error padho.',
        hint: 'Also try removing the `key` prop from the list items in either version and see what warning appears — this is unrelated to TypeScript and applies to both.',
        hintHi: 'Dono versions mein se kisi mein bhi list items se \`key\` prop hataakar dekho kaunsi warning dikhti hai — ye TypeScript se alag hai aur dono par lagu hoti hai.',
      },
    ],

    keyTakeaways: [
      'Vanilla DOM manipulation requires manually keeping the display in sync with data everywhere it changes; React lets you describe the UI once as a function of the data and re-renders it for you.',
      'JSX is not HTML — it compiles to plain JavaScript function calls, which is why it uses JavaScript naming (`className`, camelCase attributes) rather than HTML naming.',
      '`{}` inside JSX is a literal escape back into ordinary JavaScript expressions — anything that produces a value can go inside, but statements like `if` cannot.',
      'A component is just a function returning JSX, distinguished from an HTML tag purely by its capitalised name.',
      'A .tsx file is checked exactly like a .ts file with the added ability to write JSX — when a component has nothing to type, the .jsx and .tsx versions are identical; TypeScript only adds syntax once a shape (like props) needs describing.',
      'A component must return exactly one root element; a Fragment (`<>...</>`) groups multiple elements without adding an extra DOM node.',
    ],
    keyTakeawaysHi: [
      'Vanilla DOM manipulation ko display data ke har badalne wali jagah haath se sync rakhna padta hai; React aapko UI ko ek baar data ke function ki tarah batane deta hai aur use aapke liye dobara render karta hai.',
      'JSX HTML nahi hai — ye saadhe JavaScript function calls mein compile hota hai, isi wajah se ye HTML naming ke bajaye JavaScript naming (\`className\`, camelCase attributes) use karta hai.',
      'JSX ke andar \`{}\` seedha aam JavaScript expressions mein wapas jaane ka escape hatch hai — jo bhi value banata hai wo andar ja sakta hai, par \`if\` jaisi statements nahi.',
      'Component bas ek function hai jo JSX lautaata hai, HTML tag se sirf apne capital naam se alag hota hai.',
      '.tsx file bilkul .ts file jaisi check hoti hai, JSX likhne ki extra ability ke saath — jab component ko type karne ko kuch na ho, .jsx aur .tsx versions ek jaise hote hain; TypeScript sirf tab syntax jodta hai jab koi shape (jaise props) batani ho.',
      'Component ko bilkul ek root element lautaana chahiye; Fragment (\`<>...</>\`) kai elements ko bina extra DOM node jode group karta hai.',
    ],
  },
];
