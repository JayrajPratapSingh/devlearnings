/**
 * JavaScript Complete Course — Module 5: Writing Professional Code (1 of 2).
 *
 * Modules, design patterns and performance. The line between "it works" and
 * "someone else can maintain it" gets crossed here.
 *
 * Same writing rules as Module 1:
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its output. Never make the reader guess.
 *
 * NOTE for future editors: every inline-code backtick inside these template
 * literals must be escaped. One stray backtick closes the literal early and
 * TypeScript then reports errors hundreds of lines away from the real cause.
 */

import type { CourseLesson } from './course-js-module1';

export const JS_MODULE_5_PART1: CourseLesson[] = [
  /* ══════════════════════ ES Modules ══════════════════════ */
  {
    slug: 'es-modules',
    title: 'Modules — Splitting Code Into Files',
    titleHi: 'Modules — Code Ko Files Mein Baantna',
    description: 'Every file its own kitchen, with a counter for what you choose to share.',
    descriptionHi: 'Har file apni alag rasoi, aur ek counter jispar aap wahi rakhte ho jo baantna ho.',
    difficulty: 'MEDIUM',
    duration: 32,
    order: 1,

    analogy: {
      en: '**Separate kitchens with a serving counter.** Before modules, every script shared one giant kitchen — anyone could grab your knives, and two cooks naming a bowl `data` would overwrite each other. A module is your own kitchen with a door. Whatever you put on the serving counter (`export`) is available to others; everything else stays yours.',
      hi: '**Alag rasoiyan, ek serving counter.** Modules se pehle har script ek hi badi rasoi baantti thi — koi bhi aapke chaaku utha leta, aur do cook ek hi katore ka naam `data` rakh dete to ek doosre ko mita dete. Module aapki apni rasoi hai, darwaze ke saath. Jo aap serving counter par rakhte ho (`export`) wo doosron ko milta hai; baaki sab aapka hi rehta hai.',
    },

    simple: `**One file, one job.**

\`\`\`js
// math.js
export function add(a, b) { return a + b; }
export const PI = 3.14159;
\`\`\`

\`\`\`js
// app.js
import { add, PI } from './math.js';
add(2, 3);   // 5
\`\`\`

\`export\` puts something on the counter. \`import\` goes and fetches it. Anything without \`export\` stays private to that file — nobody outside can reach it.

**Two kinds of export**

\`\`\`js
// Named — as many as you like, imported by exact name
export function add() {}
export function subtract() {}
import { add, subtract } from './math.js';

// Default — one per file, imported under any name you choose
export default function Button() {}
import Button from './Button.js';
import AnythingIWant from './Button.js';   // also legal
\`\`\`

Named exports are usually better: the name is fixed, so search and rename tools can find every use. A default export can be called anything at each import site, which quietly breaks that.

**Renaming and grouping**

\`\`\`js
import { add as sum } from './math.js';    // avoid a name clash
import * as math from './math.js';         // everything under one name
math.add(2, 3);
\`\`\`

**Modules run once**

\`\`\`js
// counter.js
console.log('counter.js is running');
export let count = 0;
\`\`\`

Import that from ten files and \`'counter.js is running'\` prints **once**. The module is evaluated the first time it is imported, then cached — every later import gets the same instance. That is why a module is a natural singleton.

**They are always strict mode**

No accidental globals, \`this\` is \`undefined\` at the top level, and everything is scoped to the file.

**In HTML**

\`\`\`html
<script type="module" src="app.js"></script>
\`\`\`

Without \`type="module"\` the browser refuses \`import\` entirely.

**Remember:** export what others need, keep the rest private, and prefer named exports.`,

    simpleHi: `**Ek file, ek kaam.**

\`\`\`js
// math.js
export function add(a, b) { return a + b; }
export const PI = 3.14159;
\`\`\`

\`\`\`js
// app.js
import { add, PI } from './math.js';
add(2, 3);   // 5
\`\`\`

\`export\` kisi cheez ko counter par rakhta hai. \`import\` jaakar usse le aata hai. Jispar \`export\` nahi hai wo us file ka apna rehta hai — bahar se koi usse chhu hi nahi sakta.

**Do tarah ke export**

\`\`\`js
// Named — jitne chaho, exact naam se import hote hain
export function add() {}
export function subtract() {}
import { add, subtract } from './math.js';

// Default — har file mein ek, kisi bhi naam se import kar sakte ho
export default function Button() {}
import Button from './Button.js';
import AnythingIWant from './Button.js';   // ye bhi chalega
\`\`\`

Named exports aksar behtar hain: naam pakka hota hai, isliye search aur rename tools har use dhoondh lete hain. Default export har import par kuch bhi kehla sakta hai, jo chup-chaap ye toad deta hai.

**Rename aur group karna**

\`\`\`js
import { add as sum } from './math.js';    // naam ki takkar se bacho
import * as math from './math.js';         // sab kuch ek naam ke andar
math.add(2, 3);
\`\`\`

**Modules ek hi baar chalte hain**

\`\`\`js
// counter.js
console.log('counter.js chal rahi hai');
export let count = 0;
\`\`\`

Ise das files se import karo, phir bhi \`'counter.js chal rahi hai'\` **ek baar** print hoga. Module pehli baar import hone par chalta hai, phir cache ho jata hai — har baad ka import wahi instance deta hai. Isiliye module swabhavik roop se singleton hai.

**Ye hamesha strict mode mein hote hain**

Galti se globals nahi bante, top level par \`this\` \`undefined\` hota hai, aur sab kuch file tak seemit rehta hai.

**HTML mein**

\`\`\`html
<script type="module" src="app.js"></script>
\`\`\`

Bina \`type="module"\` ke browser \`import\` maanta hi nahi.

**Yaad rakho:** jo doosron ko chahiye wo export karo, baaki private rakho, aur named exports ko tarjeeh do.`,

    content: `## Every form of the syntax

\`\`\`js
// exporting
export const a = 1;                    // inline
const b = 2; export { b };             // at the end
export { b as renamed };               // renamed
export default thing;                  // one per file
export * from './other.js';            // re-export everything
export { x } from './other.js';        // re-export one thing

// importing
import thing from './m.js';            // default
import { a, b } from './m.js';         // named
import thing, { a } from './m.js';     // both
import * as everything from './m.js';  // namespace
import './styles.css';                 // side effect only
\`\`\`

## Imports are hoisted and live

\`\`\`js
console.log(add(1, 2));      // works — imports are hoisted
import { add } from './math.js';
\`\`\`

Bindings are also **live**, not copies:

\`\`\`js
// counter.js
export let count = 0;
export function bump() { count++; }

// app.js
import { count, bump } from './counter.js';
console.log(count);   // 0
bump();
console.log(count);   // 1  ← the import saw the change
\`\`\`

But the binding is read-only from the importing side — \`count = 5\` throws.

## Dynamic import

\`import()\` returns a promise and can appear anywhere:

\`\`\`js
button.addEventListener('click', async () => {
  const { Chart } = await import('./chart.js');   // loaded only on click
  new Chart(el);
});
\`\`\`

This is code splitting: heavy dependencies are not downloaded until they are actually needed.

## ESM versus CommonJS

| | ESM | CommonJS |
|---|---|---|
| Syntax | \`import\` / \`export\` | \`require\` / \`module.exports\` |
| Loading | static, hoisted | dynamic, runtime |
| Bindings | live | a copy of the value |
| Tree shaking | ✅ possible | ❌ not reliably |
| In Node | \`.mjs\` or \`"type": "module"\` | the default |

Static structure is what lets a bundler prove a function is unused and drop it — that is **tree shaking**, and it is why ESM is the default for new code.

## Circular imports

\`\`\`js
// a.js
import { b } from './b.js';
export const a = 'A';

// b.js
import { a } from './a.js';   // a is still undefined here
export const b = 'B';
\`\`\`

ESM handles the cycle without crashing, but one side sees \`undefined\` during evaluation. A cycle is almost always a sign that a shared piece belongs in a third file.

## Barrel files

\`index.js\` re-exporting a folder is convenient but can defeat tree shaking and slow down cold starts, because importing one thing evaluates the whole barrel. Use them sparingly.`,

    contentHi: `## Syntax ke saare roop

\`\`\`js
// export karna
export const a = 1;                    // inline
const b = 2; export { b };             // ant mein
export { b as renamed };               // naam badal kar
export default thing;                  // har file mein ek
export * from './other.js';            // sab dobara export
export { x } from './other.js';        // ek cheez dobara export

// import karna
import thing from './m.js';            // default
import { a, b } from './m.js';         // named
import thing, { a } from './m.js';     // dono
import * as everything from './m.js';  // namespace
import './styles.css';                 // sirf side effect
\`\`\`

## Imports hoist hote hain aur live hote hain

\`\`\`js
console.log(add(1, 2));      // chalta hai — imports hoist hote hain
import { add } from './math.js';
\`\`\`

Bindings **live** bhi hoti hain, copy nahi:

\`\`\`js
// counter.js
export let count = 0;
export function bump() { count++; }

// app.js
import { count, bump } from './counter.js';
console.log(count);   // 0
bump();
console.log(count);   // 1  ← import ko badlav dikh gaya
\`\`\`

Par import karne wale ki taraf se binding read-only hai — \`count = 5\` error deta hai.

## Dynamic import

\`import()\` promise deta hai aur kahin bhi aa sakta hai:

\`\`\`js
button.addEventListener('click', async () => {
  const { Chart } = await import('./chart.js');   // sirf click par load
  new Chart(el);
});
\`\`\`

Isi ko code splitting kehte hain: bhaari dependencies tab tak download hi nahi hoti jab tak sach mein zarurat na pade.

## ESM versus CommonJS

| | ESM | CommonJS |
|---|---|---|
| Syntax | \`import\` / \`export\` | \`require\` / \`module.exports\` |
| Loading | static, hoisted | dynamic, runtime |
| Bindings | live | value ki copy |
| Tree shaking | ✅ sambhav | ❌ bharose se nahi |
| Node mein | \`.mjs\` ya \`"type": "module"\` | default |

Static structure hi bundler ko sabit karne deti hai ki koi function use hi nahi hua aur usse hataya ja sakta hai — isi ko **tree shaking** kehte hain, aur isiliye naye code mein ESM default hai.

## Circular imports

\`\`\`js
// a.js
import { b } from './b.js';
export const a = 'A';

// b.js
import { a } from './a.js';   // yahan a abhi undefined hai
export const b = 'B';
\`\`\`

ESM cycle ko bina crash kiye sambhal leta hai, par evaluation ke dauran ek taraf ko \`undefined\` dikhta hai. Cycle lagbhag hamesha ishara hai ki koi saanjhi cheez teesri file mein honi chahiye.

## Barrel files

Kisi folder ko dobara export karti \`index.js\` sahulat deti hai par tree shaking khatam kar sakti hai aur cold start slow kar sakti hai, kyunki ek cheez import karne par poora barrel chal jata hai. Inhe kam hi use karo.`,

    examples: [
      {
        title: 'Named exports',
        titleHi: 'Named exports',
        code: `// math.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
const secret = 'not exported';

// app.js
import { add, subtract } from './math.js';

console.log(add(5, 3));
console.log(subtract(5, 3));
// console.log(secret);  → ReferenceError: secret is not defined`,
        output: `8
2`,
        explain: '`secret` has no `export`, so it does not exist outside `math.js`. Privacy is the default — you opt things in, never out.',
        explainHi: '`secret` par `export` nahi hai, isliye wo `math.js` ke bahar hai hi nahi. Privacy default hai — aap cheezein andar laate ho, bahar nahi karte.',
      },
      {
        title: 'Default versus named',
        titleHi: 'Default versus named',
        code: `// Button.js
export default function Button() { return 'button'; }
export const SIZES = ['sm', 'lg'];

// app.js
import Btn from './Button.js';              // any name works
import Whatever, { SIZES } from './Button.js';

console.log(Btn());
console.log(Whatever());
console.log(SIZES);`,
        output: `button
button
[ 'sm', 'lg' ]`,
        explain: 'The same default export imported under two different names, both fine. Convenient, but it means renaming the function does not update any import — a real downside for large codebases.',
        explainHi: 'Wahi default export do alag naamon se import hua, dono chalte hain. Sahulat hai, par iska matlab function ka naam badalne se koi import nahi badalta — bade codebases ke liye ye asli nuksan hai.',
      },
      {
        title: 'Modules evaluate exactly once',
        titleHi: 'Modules bilkul ek baar chalte hain',
        code: `// config.js
console.log('>>> config.js evaluating');
export const config = { loaded: Date.now() };

// a.js
import { config } from './config.js';
export const fromA = config;

// b.js
import { config } from './config.js';
export const fromB = config;

// app.js
import { fromA } from './a.js';
import { fromB } from './b.js';
console.log('same object?', fromA === fromB);`,
        output: `>>> config.js evaluating
same object? true`,
        explain: 'Printed once despite two imports, and both files got the identical object. This caching is why a module is the simplest possible singleton.',
        explainHi: 'Do import ke bawajood ek baar print hua, aur dono files ko bilkul wahi object mila. Isi caching ki wajah se module sabse saral singleton hai.',
      },
      {
        title: 'Live bindings',
        titleHi: 'Live bindings',
        code: `// counter.js
export let count = 0;
export function bump() { count++; }

// app.js
import { count, bump } from './counter.js';

console.log(count);
bump();
bump();
console.log(count);

try { count = 99; } catch (e) { console.log('Cannot assign:', e.constructor.name); }`,
        output: `0
2
Cannot assign: TypeError`,
        explain: 'The imported `count` tracked the change — it is a live view, not a snapshot. But it is read-only from here; only `counter.js` may change it.',
        explainHi: 'Import kiya gaya `count` badlav ke saath chala — wo live view hai, snapshot nahi. Par yahan se read-only hai; sirf `counter.js` usse badal sakti hai.',
      },
      {
        title: 'Imports are hoisted',
        titleHi: 'Imports hoist hote hain',
        code: `console.log('top of file');
console.log(greet('Jay'));

import { greet } from './greet.js';

console.log('bottom of file');`,
        output: `>>> greet.js evaluating
top of file
Hello, Jay
bottom of file`,
        explain: 'Look at the first line of output: the imported module ran *before* anything in this file. All imports are resolved and evaluated before the importing module\'s first statement.',
        explainHi: 'Output ki pehli line dekho: import kiya gaya module is file ke kisi bhi code se *pehle* chala. Saare imports importing module ke pehle statement se pehle resolve aur evaluate ho jate hain.',
      },
      {
        title: 'Namespace import',
        titleHi: 'Namespace import',
        code: `// math.js exports add, subtract, PI
import * as math from './math.js';

console.log(Object.keys(math));
console.log(math.add(2, 3));
console.log(math.PI);`,
        output: `[ 'PI', 'add', 'subtract' ]
5
3.14159`,
        explain: 'Everything arrives under one name. Handy for a utility file, but it usually blocks tree shaking — the bundler cannot tell which members you actually used.',
        explainHi: 'Sab kuch ek naam ke andar aa jata hai. Utility file ke liye kaam ka, par aksar tree shaking rok deta hai — bundler bata hi nahi pata ki aapne kaunse members use kiye.',
      },
      {
        title: 'Dynamic import for code splitting',
        titleHi: 'Code splitting ke liye dynamic import',
        code: `console.log('page loaded — heavy chart NOT downloaded yet');

document.querySelector('#show').addEventListener('click', async () => {
  console.log('downloading chart module…');
  const { renderChart } = await import('./heavy-chart.js');
  renderChart();
});

// Simulating the click:
document.querySelector('#show').click();`,
        output: `page loaded — heavy chart NOT downloaded yet
downloading chart module…
>>> heavy-chart.js evaluating
chart rendered`,
        explain: 'The chart library was never in the initial bundle. On a page where most visitors never click, that is a straight saving on first load.',
        explainHi: 'Chart library initial bundle mein thi hi nahi. Jis page par zyadatar log kabhi click hi nahi karte, wahan ye pehle load par seedhi bachat hai.',
      },
      {
        title: 'The circular import trap',
        titleHi: 'Circular import ka jaal',
        code: `// a.js
import { bValue } from './b.js';
console.log('a.js sees bValue as:', bValue);
export const aValue = 'A';

// b.js
import { aValue } from './a.js';
console.log('b.js sees aValue as:', aValue);
export const bValue = 'B';

// app.js
import './a.js';`,
        output: `b.js sees aValue as: undefined
a.js sees bValue as: B`,
        explain: 'No crash, but `b.js` ran before `a.js` finished defining `aValue`. Cycles produce bugs that only appear depending on which file is imported first — move the shared piece into a third file instead.',
        explainHi: 'Crash nahi hua, par `b.js` tab chali jab `a.js` ne `aValue` define hi nahi kiya tha. Cycles aise bugs dete hain jo is baat par nirbhar karte hain ki pehle kaunsi file import hui — saanjhi cheez ko teesri file mein le jao.',
      },
      {
        title: 'Re-exporting from a barrel',
        titleHi: 'Barrel se dobara export',
        code: `// components/index.js
export { Button } from './Button.js';
export { Card } from './Card.js';
export * from './icons.js';

// app.js
import { Button, Card, HomeIcon } from './components/index.js';

console.log(typeof Button, typeof Card, typeof HomeIcon);`,
        output: `>>> Button.js evaluating
>>> Card.js evaluating
>>> icons.js evaluating
function function function`,
        explain: 'One tidy import — but note all three modules evaluated, even if you only needed `Button`. That is the hidden cost of barrel files.',
        explainHi: 'Ek saaf import — par dhyan do teeno modules chal gaye, chahe aapko sirf `Button` chahiye tha. Barrel files ki chhupi hui keemat yahi hai.',
      },
    ],

    mistakes: [
      {
        wrong: `import { add } from './math';  // ❌ fails in the browser and in Node ESM`,
        right: `import { add } from './math.js';  // ✅ extension required`,
        why: 'Native ESM requires the full path with extension. Bundlers let you omit it, which then breaks the moment the same code runs unbundled.',
        whyHi: 'Native ESM ko poora path extension ke saath chahiye. Bundlers usse chhodne dete hain, jo phir bina bundle chalne par toot jata hai.',
      },
      {
        wrong: `<script src="app.js"></script>  <!-- ❌ Cannot use import outside a module -->`,
        right: `<script type="module" src="app.js"></script>  <!-- ✅ -->`,
        why: 'Without `type="module"` the browser parses the file as a classic script, where `import` is a syntax error.',
        whyHi: 'Bina `type="module"` ke browser file ko classic script maanta hai, jahan `import` syntax error hai.',
      },
      {
        wrong: `import { count } from './c.js';\ncount = 5;  // ❌ TypeError`,
        right: `import { count, setCount } from './c.js';\nsetCount(5);  // ✅ let the owning module mutate it`,
        why: 'Imported bindings are read-only for the importer. Export a setter if the value needs to change from outside.',
        whyHi: 'Import ki gayi bindings import karne wale ke liye read-only hoti hain. Bahar se badalna ho to setter export karo.',
      },
      {
        wrong: `// a.js imports b.js, b.js imports a.js  // ❌ one side sees undefined`,
        right: `// move the shared value into shared.js; both import that  // ✅`,
        why: 'Circular dependencies leave one module partially initialised, producing order-dependent bugs that are painful to trace.',
        whyHi: 'Circular dependencies mein ek module aadha hi taiyar rehta hai, jisse order par nirbhar bugs bante hain jinhe dhoondhna mushkil hai.',
      },
    ],

    realWorld: [
      {
        en: '**Route-level code splitting.** `const Page = lazy(() => import("./Page"))` in React is exactly the dynamic import above — each route downloads only when visited.',
        hi: '**Route-level code splitting.** React mein `const Page = lazy(() => import("./Page"))` bilkul upar wala dynamic import hai — har route tabhi download hota hai jab uspar jaate ho.',
      },
      {
        en: '**Shared config as a singleton.** A module exporting a configured API client is instantiated once and reused everywhere, purely because of module caching.',
        hi: '**Shared config as singleton.** Configured API client export karti module ek baar banti hai aur har jagah wahi use hoti hai, sirf module caching ki wajah se.',
      },
      {
        en: '**Tree shaking.** Importing one function from a large utility library ships only that function — but only if the library is ESM and you avoid namespace imports.',
        hi: '**Tree shaking.** Badi utility library se ek function import karne par sirf wahi function jata hai — par tabhi jab library ESM ho aur aap namespace imports se bacho.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a default export and a named export?',
        qHi: 'Default export aur named export mein kya fark hai?',
        a: 'A module may have one default export, imported without braces and under any name the importer chooses. Named exports are imported by their exact name inside braces, and a module can have many. Named exports are generally preferred because the fixed name makes refactoring tools and code search reliable.',
        aHi: 'Ek module mein ek default export ho sakta hai, jo bina braces ke aur import karne wale ki pasand ke kisi bhi naam se aata hai. Named exports braces ke andar apne exact naam se aate hain, aur ek module mein kai ho sakte hain. Named exports aksar behtar hain kyunki pakka naam refactoring tools aur code search ko bharosemand banata hai.',
      },
      {
        q: 'What does it mean that ES module bindings are "live"?',
        qHi: 'ES module bindings "live" hain, iska kya matlab hai?',
        a: 'An import is a read-only reference to the exporting module\'s binding, not a copy of the value. If the exporting module reassigns it, importers observe the new value immediately. CommonJS `require` copies the value at import time, so later reassignment is invisible.',
        aHi: 'Import exporting module ki binding ka read-only reference hai, value ki copy nahi. Agar exporting module usse dobara assign karta hai to importers ko nayi value turant dikh jati hai. CommonJS `require` import ke waqt value copy kar leta hai, isliye baad ka reassignment dikhta hi nahi.',
      },
      {
        q: 'What is tree shaking and what does it require?',
        qHi: 'Tree shaking kya hai aur uske liye kya chahiye?',
        a: 'Eliminating exports that are never imported, so they are not shipped to the browser. It requires ESM\'s static import syntax, because the bundler must determine the dependency graph without running the code. CommonJS `require` can be called conditionally, so it cannot be analysed reliably.',
        aHi: 'Un exports ko hataana jo kabhi import hi nahi hote, taaki wo browser tak na jayein. Iske liye ESM ka static import syntax chahiye, kyunki bundler ko code chalaye bina dependency graph nikalna hota hai. CommonJS `require` shart ke saath bulaya ja sakta hai, isliye uska bharosemand vishleshan nahi ho sakta.',
      },
      {
        q: 'When would you use a dynamic `import()`?',
        qHi: 'Dynamic `import()` kab use karoge?',
        a: 'When a module is large and only needed conditionally — a charting library behind a tab, an editor that opens on click, or a route in a single-page app. It returns a promise, so the module downloads and evaluates only at that moment, keeping the initial bundle small.',
        aHi: 'Jab module bada ho aur sirf shart par chahiye ho — kisi tab ke peeche chart library, click par khulne wala editor, ya single-page app ka koi route. Wo promise deta hai, isliye module usi pal download aur evaluate hota hai, aur initial bundle chhota rehta hai.',
      },
      {
        q: 'What happens with circular imports in ESM?',
        qHi: 'ESM mein circular imports par kya hota hai?',
        a: 'They do not crash. ESM hoists declarations, so a cycle resolves, but whichever module is evaluated second may read a binding from the first before it has been initialised and see `undefined`. The behaviour depends on entry order, which makes the resulting bugs hard to reproduce — restructure so a shared module breaks the cycle.',
        aHi: 'Wo crash nahi karte. ESM declarations hoist karta hai, isliye cycle resolve ho jata hai, par jo module doosre number par evaluate hota hai wo pehle wale ki binding initialise hone se pehle padh kar `undefined` dekh sakta hai. Behaviour entry order par nirbhar hai, isliye bugs dobara banana mushkil hota hai — structure aisa badlo ki koi shared module cycle toad de.',
      },
    ],

    exercises: [
      {
        task: 'Split a single file into `math.js`, `format.js` and `app.js`. Export two functions from each and import only what `app.js` actually uses.',
        taskHi: 'Ek file ko `math.js`, `format.js` aur `app.js` mein baanto. Har ek se do functions export karo aur `app.js` mein sirf wahi import karo jo sach mein chahiye.',
        hint: 'Keep at least one helper unexported in each file to see that it is genuinely unreachable from outside.',
        hintHi: 'Har file mein kam se kam ek helper bina export ke rakho, taaki dikhe ki wo bahar se sach mein pahuncha hi nahi ja sakta.',
      },
      {
        task: 'Create `counter.js` exporting a `let count` plus `increment()`. Import it into two different files and prove both see the same value after one of them increments it.',
        taskHi: '`counter.js` banao jo `let count` aur `increment()` export kare. Use do alag files mein import karo aur sabit karo ki ek ke increment karne par dono ko wahi value dikhti hai.',
        hint: 'This demonstrates both live bindings and module caching at once — there is only ever one `count`.',
        hintHi: 'Isse live bindings aur module caching dono ek saath dikhte hain — `count` kabhi bhi ek hi hota hai.',
      },
      {
        task: 'Add a button that dynamically imports a module only on click. Watch the Network tab to confirm the file is not downloaded until you press it.',
        taskHi: 'Aisa button jodo jo sirf click par module dynamically import kare. Network tab dekho aur confirm karo ki dabane tak file download hi nahi hoti.',
        hint: '`const mod = await import("./heavy.js")`. The Network tab is the proof — the request appears only after the click.',
        hintHi: '`const mod = await import("./heavy.js")`. Network tab hi proof hai — request click ke baad hi dikhti hai.',
      },
    ],

    keyTakeaways: [
      'Each file is its own scope; only what you `export` is visible outside.',
      'Prefer named exports — a fixed name keeps search and refactoring reliable.',
      'A module is evaluated once and cached, which makes it a natural singleton.',
      'Imports are hoisted and are live, read-only views of the exporter\'s binding.',
      'Dynamic `import()` returns a promise and is how you code-split heavy dependencies.',
      'ESM\'s static structure is what makes tree shaking possible; avoid namespace imports if you rely on it.',
    ],
    keyTakeawaysHi: [
      'Har file ka apna scope hai; bahar sirf wahi dikhta hai jo aap `export` karte ho.',
      'Named exports ko tarjeeh do — pakka naam search aur refactoring ko bharosemand rakhta hai.',
      'Module ek baar evaluate hokar cache ho jata hai, isliye wo swabhavik singleton hai.',
      'Imports hoist hote hain aur exporter ki binding ke live, read-only view hote hain.',
      'Dynamic `import()` promise deta hai aur bhaari dependencies ko code-split isi se karte hain.',
      'ESM ka static structure hi tree shaking sambhav banata hai; uspar bharosa ho to namespace imports se bacho.',
    ],
  },

  /* ══════════════════════ Design Patterns ══════════════════════ */
  {
    slug: 'design-patterns',
    title: 'Design Patterns',
    titleHi: 'Design Patterns',
    description: 'Standard blueprints for problems thousands of developers already solved.',
    descriptionHi: 'Un samasyaon ke standard naksha jinhe hazaron developers pehle hi sulajha chuke hain.',
    difficulty: 'HARD',
    duration: 36,
    order: 2,

    analogy: {
      en: '**Standard building blueprints.** No architect redesigns "how a staircase works" for every house — there are proven layouts you adapt. Design patterns are the same: named, proven shapes for problems that keep recurring. Knowing their names also means one word replaces a paragraph in a code review.',
      hi: '**Standard building blueprints.** Koi architect har ghar ke liye "seedhi kaise banti hai" dobara design nahi karta — parkhe hue naksha hote hain jinhe dhal liya jata hai. Design patterns bhi wahi hain: baar-baar aane wali samasyaon ke naamdaar, parkhe hue aakaar. Unke naam pata hone ka matlab ye bhi hai ki code review mein ek shabd poore paragraph ki jagah le leta hai.',
    },

    simple: `**A pattern is a named solution to a recurring problem.**

You have already used several without knowing the names. Here are the ones that actually come up.

---

**Module — keep the internals private**

\`\`\`js
function createCounter() {
  let count = 0;                        // nobody outside can touch this
  return {
    increment: () => ++count,
    get value() { return count; },
  };
}
\`\`\`

This is just a closure. The point is that \`count\` cannot be corrupted from outside.

---

**Singleton — exactly one instance**

\`\`\`js
// config.js
export const config = { apiUrl: '/api' };
\`\`\`

In JavaScript this is nearly free: modules are cached, so every importer gets the same object. Reach for the ceremony of a \`getInstance()\` method only when you need lazy construction.

---

**Observer — tell whoever is interested**

\`\`\`js
class EventBus {
  #listeners = {};
  on(event, fn) { (this.#listeners[event] ??= []).push(fn); }
  emit(event, data) { this.#listeners[event]?.forEach(fn => fn(data)); }
}
\`\`\`

One thing changes; anything that subscribed hears about it. The publisher does not know or care who is listening. This is how DOM events, React state and every notification system work.

---

**Factory — decide which thing to build**

\`\`\`js
function createUser(type) {
  switch (type) {
    case 'admin':  return { role: 'admin', canDelete: true };
    case 'editor': return { role: 'editor', canDelete: false };
    default:       return { role: 'viewer', canDelete: false };
  }
}
\`\`\`

The caller says *what* it wants, not *how* to build it. Adding a new type touches one function.

---

**Strategy — swap the algorithm**

\`\`\`js
const sorters = {
  price: (a, b) => a.price - b.price,
  name:  (a, b) => a.name.localeCompare(b.name),
};

items.sort(sorters[chosen]);
\`\`\`

Instead of a growing \`if/else\` chain, look the behaviour up in an object. Adding a strategy adds a key.

---

**The warning that matters**

Patterns are tools, not goals. A \`SingletonFactoryObserver\` wrapping three lines of logic is worse than the three lines. Reach for a pattern when you feel the pain it solves — not before.

**Remember:** learn the names so you can talk about structure. Apply them only when the problem is actually there.`,

    simpleHi: `**Pattern baar-baar aane wali samasya ka naamdaar hal hai.**

Aap kai pehle hi use kar chuke ho, bina naam jaane. Ye rahe wo jo sach mein aate hain.

---

**Module — andar ki cheezein private rakho**

\`\`\`js
function createCounter() {
  let count = 0;                        // bahar se koi ise chhu nahi sakta
  return {
    increment: () => ++count,
    get value() { return count; },
  };
}
\`\`\`

Ye bas ek closure hai. Baat ye hai ki \`count\` bahar se bigada nahi ja sakta.

---

**Singleton — bilkul ek instance**

\`\`\`js
// config.js
export const config = { apiUrl: '/api' };
\`\`\`

JavaScript mein ye lagbhag muft hai: modules cache hote hain, isliye har importer ko wahi object milta hai. \`getInstance()\` wali tam-jham tabhi lao jab lazy construction chahiye ho.

---

**Observer — jise dilchaspi ho usse bata do**

\`\`\`js
class EventBus {
  #listeners = {};
  on(event, fn) { (this.#listeners[event] ??= []).push(fn); }
  emit(event, data) { this.#listeners[event]?.forEach(fn => fn(data)); }
}
\`\`\`

Ek cheez badalti hai; jisne subscribe kiya usse pata chal jata hai. Publisher ko pata hi nahi ki kaun sun raha hai, aur parwah bhi nahi. DOM events, React state aur har notification system aise hi chalte hain.

---

**Factory — tay karo kaunsi cheez banani hai**

\`\`\`js
function createUser(type) {
  switch (type) {
    case 'admin':  return { role: 'admin', canDelete: true };
    case 'editor': return { role: 'editor', canDelete: false };
    default:       return { role: 'viewer', canDelete: false };
  }
}
\`\`\`

Caller batata hai *kya* chahiye, *kaise* banana hai ye nahi. Naya type jodne par sirf ek function badalta hai.

---

**Strategy — algorithm badal do**

\`\`\`js
const sorters = {
  price: (a, b) => a.price - b.price,
  name:  (a, b) => a.name.localeCompare(b.name),
};

items.sort(sorters[chosen]);
\`\`\`

Badhti hui \`if/else\` chain ke bajaye behaviour ko object mein dhoondho. Nayi strategy matlab nayi key.

---

**Zaroori chetavni**

Patterns auzaar hain, lakshya nahi. Teen line ke logic par lipta \`SingletonFactoryObserver\` un teen lines se bura hai. Pattern tab lao jab uski sulajhayi samasya ka dard mehsoos ho — usse pehle nahi.

**Yaad rakho:** naam seekho taaki structure par baat kar sako. Lagao tabhi jab samasya sach mein ho.`,

    content: `## Module pattern with real privacy

Modern classes support genuinely private fields:

\`\`\`js
class Counter {
  #count = 0;                     // # means private, enforced by the language
  increment() { return ++this.#count; }
  get value() { return this.#count; }
}

new Counter().#count;             // SyntaxError — not accessible at all
\`\`\`

Before \`#\`, closures were the only way. Both are still valid; \`#\` is clearer inside a class.

## Singleton, when you need laziness

\`\`\`js
class Database {
  static #instance;
  static getInstance() {
    Database.#instance ??= new Database();
    return Database.#instance;
  }
}
\`\`\`

Singletons introduce hidden global state and make tests harder to isolate, because one test can leave state behind for the next. Prefer passing dependencies in where you can.

## Observer in practice

\`\`\`js
class Store {
  #state = {};
  #subs = new Set();

  subscribe(fn) {
    this.#subs.add(fn);
    return () => this.#subs.delete(fn);    // return an unsubscribe function
  }

  setState(patch) {
    this.#state = { ...this.#state, ...patch };
    this.#subs.forEach(fn => fn(this.#state));
  }
}
\`\`\`

Returning the unsubscribe function is the important detail — without it, subscribers leak.

## Strategy versus a switch

\`\`\`js
// A growing switch: every new case edits this function
function getPrice(type, base) {
  switch (type) { case 'vip': return base * 0.8; /* … */ }
}

// Strategy: every new case adds a key
const pricing = {
  vip: (b) => b * 0.8,
  member: (b) => b * 0.9,
  guest: (b) => b,
};
const getPrice = (type, base) => (pricing[type] ?? pricing.guest)(base);
\`\`\`

The second version is open to extension without modification — you can even register strategies from another file.

## Facade

Wrapping a messy API in a simple one:

\`\`\`js
class Api {
  async get(path) { /* fetch + res.ok + json + error mapping */ }
  async post(path, body) { /* … */ }
}
\`\`\`

The \`api()\` wrapper from the fetch lesson is a facade. So is any hook that hides three libraries behind one function.

## Patterns you should think twice about

- **God object** — one class that does everything
- **Premature abstraction** — a factory with exactly one product
- **Deep inheritance** — prefer composition; four levels of \`extends\` becomes unreadable
- **Pattern for its own sake** — if you cannot name the pain it solves, do not add it`,

    contentHi: `## Module pattern asli privacy ke saath

Modern classes mein sach mein private fields milte hain:

\`\`\`js
class Counter {
  #count = 0;                     // # matlab private, language khud lagu karti hai
  increment() { return ++this.#count; }
  get value() { return this.#count; }
}

new Counter().#count;             // SyntaxError — pahunch hi nahi sakte
\`\`\`

\`#\` se pehle closures hi ekmatra rasta the. Dono ab bhi sahi hain; class ke andar \`#\` zyada saaf hai.

## Singleton, jab laziness chahiye

\`\`\`js
class Database {
  static #instance;
  static getInstance() {
    Database.#instance ??= new Database();
    return Database.#instance;
  }
}
\`\`\`

Singletons chhupi hui global state laate hain aur tests alag rakhna mushkil kar dete hain, kyunki ek test agle ke liye state chhod sakta hai. Jahan ho sake, dependencies andar bhejna behtar hai.

## Observer vyavhaar mein

\`\`\`js
class Store {
  #state = {};
  #subs = new Set();

  subscribe(fn) {
    this.#subs.add(fn);
    return () => this.#subs.delete(fn);    // unsubscribe function wapas do
  }

  setState(patch) {
    this.#state = { ...this.#state, ...patch };
    this.#subs.forEach(fn => fn(this.#state));
  }
}
\`\`\`

Unsubscribe function return karna hi asli baat hai — uske bina subscribers leak karte hain.

## Strategy versus switch

\`\`\`js
// Badhta hua switch: har naya case is function ko badalta hai
function getPrice(type, base) {
  switch (type) { case 'vip': return base * 0.8; /* … */ }
}

// Strategy: har naya case ek key jodta hai
const pricing = {
  vip: (b) => b * 0.8,
  member: (b) => b * 0.9,
  guest: (b) => b,
};
const getPrice = (type, base) => (pricing[type] ?? pricing.guest)(base);
\`\`\`

Doosra version badle bina badhaya ja sakta hai — aap doosri file se bhi strategies register kar sakte ho.

## Facade

Uljhe hue API ko saral API mein lapetna:

\`\`\`js
class Api {
  async get(path) { /* fetch + res.ok + json + error mapping */ }
  async post(path, body) { /* … */ }
}
\`\`\`

Fetch wale sabak ka \`api()\` wrapper ek facade hai. Wo hook bhi jo teen libraries ko ek function ke peeche chhupa deta hai.

## Jin patterns par do baar sochna chahiye

- **God object** — ek class jo sab kuch karti hai
- **Premature abstraction** — aisi factory jiska bilkul ek hi product hai
- **Deep inheritance** — composition behtar hai; chaar level ka \`extends\` padha hi nahi jata
- **Sirf pattern ke liye pattern** — jis dard ka ilaaj hai wo naam na le sako to mat lagao`,

    examples: [
      {
        title: 'Module pattern with a closure',
        titleHi: 'Closure wala module pattern',
        code: `function createAccount(initial) {
  let balance = initial;
  return {
    deposit(n) { balance += n; return balance; },
    get balance() { return balance; },
  };
}

const acc = createAccount(100);
console.log(acc.deposit(50));
console.log(acc.balance);
console.log(acc.__balance);
acc.balance = 99999;
console.log('after tampering:', acc.balance);`,
        output: `150
150
undefined
after tampering: 150`,
        explain: 'The getter has no setter, so assigning to `balance` silently does nothing. The real value is unreachable — the only way in is `deposit`.',
        explainHi: 'Getter ka setter hai hi nahi, isliye `balance` par assign karne se chup-chaap kuch nahi hota. Asli value tak pahunch hi nahi — andar jane ka ekmatra rasta `deposit` hai.',
      },
      {
        title: 'Private class fields',
        titleHi: 'Private class fields',
        code: `class Counter {
  #count = 0;
  increment() { return ++this.#count; }
  get value() { return this.#count; }
}

const c = new Counter();
c.increment();
c.increment();
console.log(c.value);
console.log(Object.keys(c));
console.log(JSON.stringify(c));`,
        output: `2
[]
{}`,
        explain: 'A `#` field is invisible to `Object.keys` and to `JSON.stringify`. That is stronger than a naming convention like `_count`, which is only a polite suggestion.',
        explainHi: '`#` wali field `Object.keys` aur `JSON.stringify` dono ko nahi dikhti. Ye `_count` jaisi naam ki parampara se zyada mazboot hai, jo bas ek vinamr sujhav hoti hai.',
      },
      {
        title: 'Singleton via a module',
        titleHi: 'Module se Singleton',
        code: `// store.js
let value = 0;
export const store = {
  set(v) { value = v; },
  get() { return value; },
};

// a.js
import { store } from './store.js';
store.set(42);

// b.js
import { store } from './store.js';
console.log('b.js reads:', store.get());`,
        output: `b.js reads: 42`,
        explain: 'No `getInstance`, no class, no ceremony. Module caching already guarantees one instance — in JavaScript this is usually the whole Singleton pattern.',
        explainHi: 'Na `getInstance`, na class, na tam-jham. Module caching pehle hi ek instance ki guarantee deti hai — JavaScript mein aksar poora Singleton pattern yahi hai.',
      },
      {
        title: 'Singleton with lazy construction',
        titleHi: 'Lazy construction wala Singleton',
        code: `class Database {
  static #instance;
  #connected = false;

  constructor() {
    if (Database.#instance) return Database.#instance;
    console.log('connecting… (expensive)');
    this.#connected = true;
    Database.#instance = this;
  }
}

const a = new Database();
const b = new Database();
console.log('same instance?', a === b);`,
        output: `connecting… (expensive)
same instance? true`,
        explain: 'The connection cost is paid once, no matter how many times `new` is called. Returning the existing instance from the constructor is the trick.',
        explainHi: 'Connection ki keemat ek baar hi lagti hai, chahe `new` kitni baar bulao. Constructor se maujooda instance return karna hi chaal hai.',
      },
      {
        title: 'Observer — a small event bus',
        titleHi: 'Observer — chhota event bus',
        code: `class EventBus {
  #listeners = {};

  on(event, fn) {
    (this.#listeners[event] ??= []).push(fn);
    return () => {
      this.#listeners[event] = this.#listeners[event].filter(f => f !== fn);
    };
  }

  emit(event, data) {
    this.#listeners[event]?.forEach(fn => fn(data));
  }
}

const bus = new EventBus();
const off = bus.on('cart:add', item => console.log('analytics:', item));
bus.on('cart:add', item => console.log('badge +1 for', item));

bus.emit('cart:add', 'shirt');
off();
bus.emit('cart:add', 'shoes');`,
        output: `analytics: shirt
badge +1 for shirt
badge +1 for shoes`,
        explain: 'Two independent subscribers, neither knowing about the other. After `off()` only one remains. Returning the unsubscribe function from `on` is what makes cleanup possible.',
        explainHi: 'Do swatantra subscribers, dono ko ek doosre ka pata nahi. `off()` ke baad sirf ek bacha. `on` se unsubscribe function return karna hi cleanup sambhav banata hai.',
      },
      {
        title: 'Observer — a tiny store',
        titleHi: 'Observer — chhota store',
        code: `class Store {
  #state;
  #subs = new Set();

  constructor(initial) { this.#state = initial; }

  subscribe(fn) {
    this.#subs.add(fn);
    return () => this.#subs.delete(fn);
  }

  setState(patch) {
    this.#state = { ...this.#state, ...patch };
    this.#subs.forEach(fn => fn(this.#state));
  }
}

const store = new Store({ count: 0 });
store.subscribe(s => console.log('UI renders count =', s.count));
store.setState({ count: 1 });
store.setState({ count: 2 });`,
        output: `UI renders count = 1
UI renders count = 2`,
        explain: 'This is Redux in fifteen lines. Every state-management library is this pattern plus conveniences.',
        explainHi: 'Ye pandrah lines mein Redux hai. Har state-management library yahi pattern hai, kuch sahulaton ke saath.',
      },
      {
        title: 'Factory',
        titleHi: 'Factory',
        code: `const roles = {
  admin:  () => ({ role: 'admin',  canDelete: true,  canEdit: true }),
  editor: () => ({ role: 'editor', canDelete: false, canEdit: true }),
  viewer: () => ({ role: 'viewer', canDelete: false, canEdit: false }),
};

function createUser(name, type) {
  const build = roles[type] ?? roles.viewer;
  return { name, ...build() };
}

console.log(createUser('Jay', 'admin'));
console.log(createUser('Ravi', 'unknown'));`,
        output: `{ name: 'Jay', role: 'admin', canDelete: true, canEdit: true }
{ name: 'Ravi', role: 'viewer', canDelete: false, canEdit: false }`,
        explain: 'Callers never write permission logic — they ask for a type. An unknown type falls back safely to the least privileged role, which is the right default.',
        explainHi: 'Callers kabhi permission logic nahi likhte — wo bas type maangte hain. Anjaan type surakshit tarike se sabse kam adhikar wale role par girta hai, aur yahi sahi default hai.',
      },
      {
        title: 'Strategy beats a growing switch',
        titleHi: 'Strategy badhte switch se behtar',
        code: `const sorters = {
  priceAsc:  (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  name:      (a, b) => a.name.localeCompare(b.name),
};

const items = [
  { name: 'Cap', price: 300 },
  { name: 'Shirt', price: 500 },
  { name: 'Bag', price: 100 },
];

function sortBy(list, key) {
  const fn = sorters[key];
  if (!fn) throw new Error(\`Unknown sort: \${key}\`);
  return [...list].sort(fn);
}

console.log(sortBy(items, 'priceAsc').map(i => i.name));
console.log(sortBy(items, 'name').map(i => i.name));

sorters.priceThenName = (a, b) => a.price - b.price || a.name.localeCompare(b.name);
console.log('added a strategy without touching sortBy');`,
        output: `[ 'Bag', 'Cap', 'Shirt' ]
[ 'Bag', 'Cap', 'Shirt' ]
added a strategy without touching sortBy`,
        explain: 'The last line is the payoff: a new sort was registered from outside without editing `sortBy` at all. A switch statement would have required changing the function.',
        explainHi: 'Aakhri line hi inaam hai: naya sort bahar se register hua aur `sortBy` ko chhua tak nahi. Switch statement mein function badalna hi padta.',
      },
      {
        title: 'When a pattern is the wrong answer',
        titleHi: 'Jab pattern galat jawab hai',
        code: `// ❌ over-engineered
class GreeterFactory {
  static create(type) { return new (type === 'formal' ? Formal : Casual)(); }
}
class Formal { greet(n) { return \`Good evening, \${n}\`; } }
class Casual { greet(n) { return \`Hey \${n}\`; } }
console.log(GreeterFactory.create('casual').greet('Jay'));

// ✅ the whole thing
const greet = (n, formal = false) => (formal ? \`Good evening, \${n}\` : \`Hey \${n}\`);
console.log(greet('Jay'));`,
        output: `Hey Jay
Hey Jay`,
        explain: 'Same behaviour: eight lines and three concepts versus one line. Add the factory when there are six greeting types and they come from config — not before.',
        explainHi: 'Wahi behaviour: aath lines aur teen concepts versus ek line. Factory tab lao jab chhe greeting types hon aur wo config se aayein — usse pehle nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `class UserManager { /* fetch, validate, render, email, log… */ }  // ❌ god object`,
        right: `// split: UserApi, UserValidator, UserView  ✅`,
        why: 'A class doing everything cannot be tested, reused or understood in isolation. One reason to change per module.',
        whyHi: 'Sab kuch karti class na test ho sakti hai, na reuse, na akele samajhi ja sakti hai. Har module ke badalne ka ek hi kaaran ho.',
      },
      {
        wrong: `store.subscribe(fn);  // ❌ never unsubscribed`,
        right: `const off = store.subscribe(fn);\n// on cleanup:\noff();  // ✅`,
        why: 'The store holds a reference to every callback, keeping its whole closure alive. Un-unsubscribed listeners are the standard memory leak in SPAs.',
        whyHi: 'Store har callback ka reference rakhta hai, jisse uska poora closure zinda rehta hai. SPAs mein bina unsubscribe kiye listeners standard memory leak hain.',
      },
      {
        wrong: `class A extends B extends C extends D  // ❌ four levels deep`,
        right: `// compose small functions or mix in behaviour  ✅`,
        why: 'Deep inheritance makes behaviour impossible to trace — you must read four files to know what one method does.',
        whyHi: 'Gehri inheritance mein behaviour dhoondhna namumkin ho jata hai — ek method kya karta hai jaanne ke liye chaar files padhni padti hain.',
      },
      {
        wrong: `Database.getInstance().query(…)  // ❌ hidden global, untestable`,
        right: `function makeService(db) { return { … }; }  // ✅ inject it`,
        why: 'A singleton reached directly cannot be replaced in a test. Passing the dependency in lets you supply a fake.',
        whyHi: 'Seedhe pahunche gaye singleton ko test mein badla nahi ja sakta. Dependency andar bhejne se aap nakli version de sakte ho.',
      },
    ],

    realWorld: [
      {
        en: '**Redux and Zustand** are the Observer pattern: a store, subscribers, and notify-on-change. Knowing the pattern makes any of them readable in minutes.',
        hi: '**Redux aur Zustand** Observer pattern hi hain: ek store, subscribers, aur badlav par notify. Pattern pata ho to inme se koi bhi minton mein samajh aa jata hai.',
      },
      {
        en: '**Payment providers.** Stripe, Razorpay and PayPal behind one `PaymentStrategy` interface means adding a provider adds a file, not an `if` branch in ten places.',
        hi: '**Payment providers.** Stripe, Razorpay aur PayPal ek `PaymentStrategy` interface ke peeche hon to naya provider ek file jodta hai, das jagah `if` branch nahi.',
      },
      {
        en: '**The api() wrapper** you wrote in the fetch lesson is a Facade — one simple surface hiding status checks, JSON parsing and error mapping.',
        hi: '**Fetch wale sabak ka api() wrapper** ek Facade hai — ek saral surface jo status checks, JSON parsing aur error mapping chhupa deta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the Singleton pattern and what are its drawbacks?',
        qHi: 'Singleton pattern kya hai aur uske nuksan kya hain?',
        a: 'It guarantees exactly one instance with a global access point. In JavaScript a cached module already provides this. The drawbacks are hidden global state, implicit coupling — callers reach for it rather than declaring a dependency — and difficult testing, since state persists between tests and cannot easily be replaced with a fake.',
        aHi: 'Wo bilkul ek instance aur global access point ki guarantee deta hai. JavaScript mein cached module pehle hi ye de deta hai. Nuksan hain chhupi hui global state, implicit coupling — callers dependency declare karne ke bajaye seedhe usse pakad lete hain — aur mushkil testing, kyunki state tests ke beech bani rehti hai aur usse nakli version se badalna aasan nahi.',
      },
      {
        q: 'Explain the Observer pattern with an example.',
        qHi: 'Observer pattern udaharan ke saath samjhao.',
        a: 'A subject maintains a list of subscribers and notifies all of them when its state changes, without knowing who they are. DOM `addEventListener`, Redux `store.subscribe` and React state updates are all this pattern. A good implementation returns an unsubscribe function so subscribers can be cleaned up.',
        aHi: 'Ek subject subscribers ki list rakhta hai aur state badalne par sabko batata hai, bina ye jaane ki wo kaun hain. DOM `addEventListener`, Redux `store.subscribe` aur React state updates sab yahi pattern hain. Achhi implementation unsubscribe function return karti hai taaki subscribers saaf kiye ja sakein.',
      },
      {
        q: 'When would you use Strategy instead of a switch statement?',
        qHi: 'Switch statement ke bajaye Strategy kab use karoge?',
        a: 'When the set of behaviours is expected to grow, or when they should be registerable from elsewhere. A switch requires editing the function for every new case, whereas a strategy map only needs a new key — which satisfies the open/closed principle and keeps each behaviour independently testable.',
        aHi: 'Jab behaviours ka set badhne wala ho, ya jab unhe kahin aur se register kiya ja sake. Switch mein har naye case ke liye function badalna padta hai, jabki strategy map mein sirf nayi key chahiye — jo open/closed principle poora karta hai aur har behaviour ko alag se testable rakhta hai.',
      },
      {
        q: 'How do you create private state in JavaScript?',
        qHi: 'JavaScript mein private state kaise banate hain?',
        a: 'Two ways. A closure — declare the variable inside a function and expose only the methods that may touch it — which works anywhere and needs no class. Or a `#field` in a class, which the language enforces: it is a SyntaxError to access from outside, and it is excluded from `Object.keys` and `JSON.stringify`.',
        aHi: 'Do tarike. Closure — variable ko function ke andar declare karo aur sirf wahi methods expose karo jo usse chhu sakein — jo har jagah chalta hai aur usme class ki zarurat nahi. Ya class mein `#field`, jise language khud lagu karti hai: bahar se access karna SyntaxError hai, aur wo `Object.keys` aur `JSON.stringify` se bahar rehta hai.',
      },
      {
        q: 'When should you NOT use a design pattern?',
        qHi: 'Design pattern kab NAHI use karna chahiye?',
        a: 'When you cannot name the specific pain it relieves. A factory with one product, a strategy map with one strategy, or an observer with one subscriber all add indirection without benefit. Patterns are a response to demonstrated duplication or change pressure, not a starting point.',
        aHi: 'Jab aap wo khaas dard naam na le sako jo wo mitaata hai. Ek product wali factory, ek strategy wala map, ya ek subscriber wala observer — sab bina fayde ke ghumaav jodte hain. Patterns dikhi hui duplication ya badlav ke dabaav ka jawab hain, shuruaat nahi.',
      },
    ],

    exercises: [
      {
        task: 'Build an `EventEmitter` with `on`, `off`, `once` and `emit`. Make `on` return an unsubscribe function, and implement `once` in terms of `on`.',
        taskHi: '`on`, `off`, `once` aur `emit` wala `EventEmitter` banao. `on` unsubscribe function de, aur `once` ko `on` ke upar banao.',
        hint: '`once` wraps the handler: call the original, then immediately unsubscribe using the function `on` returned.',
        hintHi: '`once` handler ko lapetta hai: original bulao, phir turant `on` se mile function se unsubscribe kar do.',
      },
      {
        task: 'Refactor a `calculateShipping(method, weight)` switch into a strategy object. Then add an "overnight" strategy from a different file without editing the original function.',
        taskHi: '`calculateShipping(method, weight)` wale switch ko strategy object mein badlo. Phir doosri file se "overnight" strategy jodo bina original function ko chhue.',
        hint: 'Export the strategies object so another module can add a key to it. That is the whole point of the pattern.',
        hintHi: 'Strategies object export karo taaki doosra module usme key jod sake. Pattern ka poora maqsad yahi hai.',
      },
      {
        task: 'Write a `Cart` class with a private `#items` array, methods to add and remove, and a subscribe mechanism that notifies listeners whenever the total changes.',
        taskHi: 'Ek `Cart` class likho jisme private `#items` array ho, add aur remove ke methods hon, aur ek subscribe mechanism ho jo total badalne par listeners ko bataye.',
        hint: 'This combines three patterns: Module for privacy, Observer for notification, and a getter for the derived total.',
        hintHi: 'Isme teen patterns milte hain: privacy ke liye Module, notification ke liye Observer, aur derived total ke liye getter.',
      },
    ],

    keyTakeaways: [
      'A pattern is a named, proven solution — knowing the name is half the value in a code review.',
      'Module/closure and `#private` fields both give real privacy; `#` is clearer inside a class.',
      'In JavaScript a cached module IS a singleton; the `getInstance` ceremony is rarely needed.',
      'Observer = subscribe, notify on change. Always return an unsubscribe function.',
      'Strategy replaces a growing switch with a lookup, so new behaviour adds a key rather than editing code.',
      'Apply a pattern only when you can name the pain it solves. Premature abstraction is worse than none.',
    ],
    keyTakeawaysHi: [
      'Pattern ek naamdaar, parkha hua hal hai — code review mein aadha fayda naam jaanne mein hi hai.',
      'Module/closure aur `#private` fields dono asli privacy dete hain; class ke andar `#` zyada saaf hai.',
      'JavaScript mein cached module HI singleton hai; `getInstance` wali tam-jham shayad hi chahiye.',
      'Observer = subscribe karo, badlav par bata do. Unsubscribe function hamesha return karo.',
      'Strategy badhte switch ko lookup se badal deta hai, isliye naya behaviour code badalne ke bajaye key jodta hai.',
      'Pattern tabhi lagao jab uski sulajhayi samasya naam le sako. Waqt se pehle ki abstraction na hone se bhi buri hai.',
    ],
  },

  /* ══════════════════════ Performance ══════════════════════ */
  {
    slug: 'performance-optimisation',
    title: 'Performance — Debounce, Throttle and Memoize',
    titleHi: 'Performance — Debounce, Throttle aur Memoize',
    description: 'Three small functions that fix most of the slowness you will actually meet.',
    descriptionHi: 'Teen chhote functions jo aapko milne wali zyadatar slowness theek kar dete hain.',
    difficulty: 'MEDIUM',
    duration: 34,
    order: 3,

    analogy: {
      en: '**Waiting for someone to finish talking, a dripping tap, and a sticky note.** **Debounce** is waiting until the other person stops speaking before you reply. **Throttle** is a tap you let drip once a second no matter how hard it is turned. **Memoize** is writing the answer on a sticky note so you never work it out twice.',
      hi: '**Kisi ke bolna khatam hone ka intezaar, tapakta hua nal, aur ek sticky note.** **Debounce** matlab jawab dene se pehle saamne wale ka bolna khatam hone dena. **Throttle** matlab aisa nal jo chahe jitna ghumao, second mein ek hi boond girata hai. **Memoize** matlab jawab sticky note par likh lena taaki dobara kabhi na nikalna pade.',
    },

    simple: `**Most slowness has one of three shapes.**

---

**1. Something fires far too often → debounce**

A search box firing a request on every keystroke sends ten requests for "javascript". You only want the last one.

\`\`\`js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);                       // cancel the previous plan
    timer = setTimeout(() => fn(...args), delay);
  };
}

input.addEventListener('input', debounce(search, 300));
\`\`\`

*Wait until they stop typing for 300ms, then act once.* Every new keystroke cancels the pending call.

---

**2. Something must run, but not that often → throttle**

Scroll fires hundreds of times a second. You do not want to skip it entirely — you want it at a steady rate.

\`\`\`js
function throttle(fn, limit) {
  let waiting = false;
  return (...args) => {
    if (waiting) return;                       // ignore until the window passes
    fn(...args);
    waiting = true;
    setTimeout(() => { waiting = false; }, limit);
  };
}

window.addEventListener('scroll', throttle(onScroll, 100));
\`\`\`

**Debounce or throttle?** Debounce waits for the *end*. Throttle runs at a *steady rate throughout*. Search box → debounce. Scroll position → throttle.

---

**3. The same expensive answer, computed again → memoize**

\`\`\`js
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
\`\`\`

Only safe for **pure** functions — same input, same output, no side effects. Memoizing something that reads the clock or the database will hand back stale answers forever.

---

**Before you optimise anything: measure.**

\`\`\`js
console.time('label');
doWork();
console.timeEnd('label');
\`\`\`

The slow part is very often not where you assumed. Optimising the wrong function costs you time and buys nothing.

**Remember:** debounce waits for the end, throttle keeps a steady rate, memoize remembers. Measure first.`,

    simpleHi: `**Zyadatar slowness teen mein se ek shakal ki hoti hai.**

---

**1. Koi cheez bahut zyada baar chalti hai → debounce**

Har keystroke par request bhejta search box "javascript" ke liye das requests bhej deta hai. Aapko sirf aakhri chahiye.

\`\`\`js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);                       // pichla plan rad karo
    timer = setTimeout(() => fn(...args), delay);
  };
}

input.addEventListener('input', debounce(search, 300));
\`\`\`

*Jab tak wo 300ms tak type na rokein, ruko, phir ek baar chalo.* Har naya keystroke pending call rad kar deta hai.

---

**2. Chalna to hai, par itni baar nahi → throttle**

Scroll second mein saikdon baar chalta hai. Aap use poora chhodna nahi chahte — aap use ek sthir raftaar par chahte ho.

\`\`\`js
function throttle(fn, limit) {
  let waiting = false;
  return (...args) => {
    if (waiting) return;                       // window guzarne tak ignore
    fn(...args);
    waiting = true;
    setTimeout(() => { waiting = false; }, limit);
  };
}

window.addEventListener('scroll', throttle(onScroll, 100));
\`\`\`

**Debounce ya throttle?** Debounce *ant* ka intezaar karta hai. Throttle *beech mein sthir raftaar* se chalta hai. Search box → debounce. Scroll position → throttle.

---

**3. Wahi mehnga jawab, dobara nikala ja raha hai → memoize**

\`\`\`js
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
\`\`\`

Ye sirf **pure** functions ke liye surakshit hai — wahi input, wahi output, koi side effect nahi. Ghadi ya database padhne wali cheez memoize karoge to hamesha purane jawab milte rahenge.

---

**Kuch bhi optimise karne se pehle: naapo.**

\`\`\`js
console.time('label');
doWork();
console.timeEnd('label');
\`\`\`

Slow hissa aksar wahan hota hi nahi jahan aapne socha tha. Galat function optimise karne mein waqt jata hai aur milta kuch nahi.

**Yaad rakho:** debounce ant ka intezaar karta hai, throttle sthir raftaar rakhta hai, memoize yaad rakhta hai. Pehle naapo.`,

    content: `## Debounce with options

\`\`\`js
function debounce(fn, delay, { leading = false } = {}) {
  let timer = null;
  return function (...args) {
    const callNow = leading && timer === null;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!leading) fn.apply(this, args);
    }, delay);
    if (callNow) fn.apply(this, args);
  };
}
\`\`\`

\`leading: true\` fires immediately and then ignores the burst — right for a submit button. The default (trailing) waits for the pause — right for a search box.

Note \`fn.apply(this, args)\` rather than \`fn(...args)\`: it preserves \`this\`, so the wrapper still works on object methods.

## Cancelling

\`\`\`js
function debounce(fn, delay) {
  let timer;
  const wrapped = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  wrapped.cancel = () => clearTimeout(timer);
  return wrapped;
}
\`\`\`

Always expose \`cancel\` — a component unmounting with a pending debounce will otherwise update something that no longer exists.

## requestAnimationFrame for visual work

For anything that changes the screen, rAF beats a timer because it runs exactly once per frame, just before paint:

\`\`\`js
function rafThrottle(fn) {
  let queued = false;
  return (...args) => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fn(...args); });
  };
}
\`\`\`

## Memoize, carefully

\`JSON.stringify\` as a cache key is convenient but fails on functions, \`undefined\`, and objects whose key order differs. For single-argument functions keyed on an object, a \`WeakMap\` is better — entries disappear when the object does, so the cache cannot leak:

\`\`\`js
const cache = new WeakMap();
const compute = (obj) => {
  if (cache.has(obj)) return cache.get(obj);
  const result = expensive(obj);
  cache.set(obj, result);
  return result;
};
\`\`\`

An unbounded \`Map\` cache grows forever. Production code needs a size limit or a TTL.

## Other everyday wins

\`\`\`js
// Batch DOM writes — one reflow instead of N
const frag = document.createDocumentFragment();

// Delegate events — one listener instead of 1000
list.addEventListener('click', handler);

// Parallelise independent requests
await Promise.all([a(), b(), c()]);

// Lazy-load below-the-fold images
<img loading="lazy" src="…">

// Code-split heavy routes
const Page = lazy(() => import('./Page'));
\`\`\`

## Measure properly

\`\`\`js
performance.mark('start');
doWork();
performance.mark('end');
performance.measure('work', 'start', 'end');
console.log(performance.getEntriesByName('work')[0].duration);
\`\`\`

For anything real, use the browser's Performance profiler rather than timers — it shows you *which* function is slow, not just that something is.`,

    contentHi: `## Options wala debounce

\`\`\`js
function debounce(fn, delay, { leading = false } = {}) {
  let timer = null;
  return function (...args) {
    const callNow = leading && timer === null;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!leading) fn.apply(this, args);
    }, delay);
    if (callNow) fn.apply(this, args);
  };
}
\`\`\`

\`leading: true\` turant chalta hai aur phir bauchhar ignore karta hai — submit button ke liye sahi. Default (trailing) rukne ka intezaar karta hai — search box ke liye sahi.

\`fn(...args)\` ke bajaye \`fn.apply(this, args)\` dhyan se dekho: ye \`this\` bacha kar rakhta hai, isliye wrapper object methods par bhi chalta hai.

## Cancel karna

\`\`\`js
function debounce(fn, delay) {
  let timer;
  const wrapped = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  wrapped.cancel = () => clearTimeout(timer);
  return wrapped;
}
\`\`\`

\`cancel\` hamesha do — pending debounce ke saath unmount hota component warna aisi cheez update karega jo ab hai hi nahi.

## Visual kaam ke liye requestAnimationFrame

Jo cheez screen badalti hai uske liye rAF timer se behtar hai, kyunki wo har frame mein bilkul ek baar, paint se theek pehle chalta hai:

\`\`\`js
function rafThrottle(fn) {
  let queued = false;
  return (...args) => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fn(...args); });
  };
}
\`\`\`

## Memoize, dhyan se

Cache key ke liye \`JSON.stringify\` sahulat deta hai par functions, \`undefined\`, aur alag key order wale objects par fail karta hai. Ek-argument wale functions ke liye jo object par key banate hain, \`WeakMap\` behtar hai — object ke jaate hi entries gayab ho jati hain, isliye cache leak nahi karta:

\`\`\`js
const cache = new WeakMap();
const compute = (obj) => {
  if (cache.has(obj)) return cache.get(obj);
  const result = expensive(obj);
  cache.set(obj, result);
  return result;
};
\`\`\`

Bina seema wala \`Map\` cache hamesha badhta rehta hai. Production code ko size limit ya TTL chahiye.

## Baaki rozmarra ke fayde

\`\`\`js
// DOM writes ek saath — N ki jagah ek reflow
const frag = document.createDocumentFragment();

// Events delegate karo — 1000 ki jagah ek listener
list.addEventListener('click', handler);

// Alag-alag requests parallel karo
await Promise.all([a(), b(), c()]);

// Neeche wali images lazy-load karo
<img loading="lazy" src="…">

// Bhaari routes code-split karo
const Page = lazy(() => import('./Page'));
\`\`\`

## Theek se naapo

\`\`\`js
performance.mark('start');
doWork();
performance.mark('end');
performance.measure('work', 'start', 'end');
console.log(performance.getEntriesByName('work')[0].duration);
\`\`\`

Kisi bhi asli kaam ke liye timers ke bajaye browser ka Performance profiler use karo — wo batata hai *kaunsa* function slow hai, sirf ye nahi ki kuch slow hai.`,

    examples: [
      {
        title: 'The problem debounce solves',
        titleHi: 'Debounce jo samasya sulajhata hai',
        code: `let calls = 0;
function search(term) { calls++; console.log('searching for', term); }

// simulating someone typing "java"
for (const term of ['j', 'ja', 'jav', 'java']) search(term);
console.log('requests sent:', calls);`,
        output: `searching for j
searching for ja
searching for jav
searching for java
requests sent: 4`,
        explain: 'Four requests, three of them already obsolete before they returned. On a real search box typing a sentence this is dozens of wasted calls.',
        explainHi: 'Chaar requests, jinme se teen wapas aane se pehle hi bekaar ho chuki thin. Asli search box par ek vaakya likhne par ye darjanon bekaar calls hoti hain.',
      },
      {
        title: 'Debounce',
        titleHi: 'Debounce',
        code: `function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const search = debounce(t => console.log('searching for', t), 300);

search('j');
search('ja');
search('jav');
search('java');
console.log('called 4 times, waiting…');`,
        output: `called 4 times, waiting…
searching for java`,
        explain: 'Four calls, one search — and it used the final value. Each call cancelled the pending timer, so only the last one survived the 300ms of quiet.',
        explainHi: 'Chaar calls, ek search — aur usne aakhri value use ki. Har call ne pending timer rad kar diya, isliye 300ms ki khamoshi sirf aakhri wala jhel paya.',
      },
      {
        title: 'Throttle',
        titleHi: 'Throttle',
        code: `function throttle(fn, limit) {
  let waiting = false;
  return (...args) => {
    if (waiting) return;
    fn(...args);
    waiting = true;
    setTimeout(() => { waiting = false; }, limit);
  };
}

const onScroll = throttle(y => console.log('scroll at', y), 100);

// 5 rapid scroll events, ~20ms apart
[0, 50, 100, 150, 200].forEach((y, i) =>
  setTimeout(() => onScroll(y), i * 20),
);`,
        output: `scroll at 0
scroll at 200`,
        explain: 'Five events, two executions — one immediately, then one after the window reopened. Unlike debounce it fired straight away, which is what scroll handlers need.',
        explainHi: 'Paanch events, do executions — ek turant, phir ek jab window dobara khuli. Debounce ke ulat ye turant chala, aur scroll handlers ko yahi chahiye.',
      },
      {
        title: 'Debounce versus throttle side by side',
        titleHi: 'Debounce versus throttle aamne-saamne',
        code: `const log = (label) => (n) => console.log(label, n);

const d = debounce(log('debounced:'), 100);
const t = throttle(log('throttled:'), 100);

// 6 events, 30ms apart, over ~180ms
for (let i = 0; i < 6; i++) {
  setTimeout(() => { d(i); t(i); }, i * 30);
}`,
        output: `throttled: 0
throttled: 3
debounced: 5`,
        explain: 'Throttle fired twice during the burst, keeping a steady rate. Debounce fired once, at the end, with the final value. That is the whole difference.',
        explainHi: 'Throttle bauchhar ke dauran do baar chala, sthir raftaar rakhte hue. Debounce ek baar chala, ant mein, aakhri value ke saath. Poora fark bas yahi hai.',
      },
      {
        title: 'Debounce that preserves this and can be cancelled',
        titleHi: 'this bachane wala aur cancel hone wala debounce',
        code: `function debounce(fn, delay) {
  let timer;
  function wrapped(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  }
  wrapped.cancel = () => clearTimeout(timer);
  return wrapped;
}

const obj = {
  name: 'Widget',
  save: debounce(function () { console.log(this.name, 'saved'); }, 100),
};

obj.save();
setTimeout(() => console.log('done'), 200);

const other = debounce(() => console.log('never runs'), 100);
other();
other.cancel();`,
        output: `Widget saved
done`,
        explain: 'Two details that matter in real code: `fn.apply(this, args)` keeps the method bound to its object, and `cancel` stops a pending call when a component unmounts.',
        explainHi: 'Asli code ki do zaroori baatein: `fn.apply(this, args)` method ko uske object se juda rakhta hai, aur `cancel` component unmount hone par pending call rok deta hai.',
      },
      {
        title: 'Memoize',
        titleHi: 'Memoize',
        code: `function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) { console.log('  cache hit'); return cache.get(key); }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const slowFib = n => (n <= 1 ? n : slowFib(n - 1) + slowFib(n - 2));

console.time('first');
console.log(memoize(slowFib)(30));
console.timeEnd('first');

const fast = memoize(slowFib);
fast(30);
console.time('second');
fast(30);
console.timeEnd('second');`,
        output: `832040
first: 11.3ms
  cache hit
second: 0.02ms`,
        explain: 'The second call was roughly 500x faster. Note this memoizes the outer call only — the recursion inside `slowFib` is still exponential.',
        explainHi: 'Doosri call lagbhag 500 guna tez thi. Dhyan do ye sirf bahar wali call memoize karta hai — `slowFib` ke andar ki recursion abhi bhi exponential hai.',
      },
      {
        title: 'Memoizing the recursion itself',
        titleHi: 'Recursion ko hi memoize karna',
        code: `const memo = new Map();
function fib(n) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const result = fib(n - 1) + fib(n - 2);
  memo.set(n, result);
  return result;
}

console.time('memoised recursion');
console.log(fib(90));
console.timeEnd('memoised recursion');`,
        output: `2880067194370816120
memoised recursion: 0.3ms`,
        explain: '`fib(90)` would take longer than your lifetime without memoisation. Caching inside the recursion turns exponential work into linear work.',
        explainHi: 'Bina memoisation ke `fib(90)` aapki zindagi se zyada waqt le leta. Recursion ke andar cache karne se exponential kaam linear ban jata hai.',
      },
      {
        title: 'When memoize is wrong',
        titleHi: 'Jab memoize galat hai',
        code: `const getTime = memoize(() => new Date().toISOString());

console.log(getTime());
await new Promise(r => setTimeout(r, 1000));
console.log(getTime());
console.log('↑ same timestamp — the clock moved but the cache did not');`,
        output: `2024-06-15T10:30:00.000Z
2024-06-15T10:30:00.000Z
↑ same timestamp — the clock moved but the cache did not`,
        explain: 'Memoisation is only valid for pure functions. Anything depending on time, randomness, the DOM or a database will return a permanently stale answer.',
        explainHi: 'Memoisation sirf pure functions ke liye sahi hai. Jo bhi time, randomness, DOM ya database par nirbhar hai wo hamesha purana jawab dega.',
      },
      {
        title: 'Measure before you optimise',
        titleHi: 'Optimise se pehle naapo',
        code: `const items = Array.from({ length: 100_000 }, (_, i) => ({ id: i }));

console.time('find with array');
for (let i = 0; i < 100; i++) items.find(x => x.id === 99_999);
console.timeEnd('find with array');

const byId = new Map(items.map(x => [x.id, x]));
console.time('find with Map');
for (let i = 0; i < 100; i++) byId.get(99_999);
console.timeEnd('find with Map');`,
        output: `find with array: 142.7ms
find with Map: 0.04ms`,
        explain: 'No debounce or memoize would have helped here — the fix was a different data structure. This is why you measure first instead of reaching for a familiar tool.',
        explainHi: 'Yahan na debounce kaam aata na memoize — ilaaj alag data structure tha. Isiliye jaana-pehchana auzaar uthane ke bajaye pehle naapa jata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `input.addEventListener('input', () => debounce(search, 300)());  // ❌ new debounce every keystroke`,
        right: `const debounced = debounce(search, 300);\ninput.addEventListener('input', debounced);  // ✅`,
        why: 'Creating the debounced function inside the handler makes a fresh timer each time, so nothing is ever cancelled and it behaves exactly like no debounce.',
        whyHi: 'Handler ke andar debounced function banane se har baar naya timer banta hai, isliye kuch rad hota hi nahi aur behaviour bilkul bina debounce jaisa rehta hai.',
      },
      {
        wrong: `const fetchUser = memoize(id => api.get(\`/users/\${id}\`));  // ❌ never refreshes`,
        right: `// add a TTL, or invalidate the entry after a mutation  ✅`,
        why: 'Memoizing a network call caches the response forever, so the UI keeps showing data that changed on the server minutes ago.',
        whyHi: 'Network call memoize karne se response hamesha ke liye cache ho jata hai, isliye UI wahi data dikhata rehta hai jo server par minton pehle badal chuka.',
      },
      {
        wrong: `window.addEventListener('scroll', updateHeader);  // ❌ hundreds of calls a second`,
        right: `window.addEventListener('scroll', throttle(updateHeader, 100), { passive: true });  // ✅`,
        why: 'Unthrottled scroll handlers block painting and cause visible jank. `passive: true` additionally tells the browser you will not call preventDefault.',
        whyHi: 'Bina throttle wale scroll handlers painting rok dete hain aur saaf dikhne wala jhatka dete hain. `passive: true` browser ko ye bhi batata hai ki aap preventDefault nahi bulaoge.',
      },
      {
        wrong: `// rewriting a function you assume is slow  ❌`,
        right: `console.time('x'); suspect(); console.timeEnd('x');  // ✅ measure first`,
        why: 'Intuition about performance is unreliable. Optimising the wrong function wastes your effort and often makes the code harder to read for no gain.',
        whyHi: 'Performance ke baare mein andaza bharosemand nahi hota. Galat function optimise karne se mehnat barbaad hoti hai aur code aksar bina fayde ke padhne mein mushkil ho jata hai.',
      },
    ],

    realWorld: [
      {
        en: '**Search-as-you-type.** Debounced at 300ms with the previous request aborted — otherwise a slower old response can overwrite a newer one.',
        hi: '**Search-as-you-type.** 300ms par debounced aur pichli request abort — warna purana dheema response naye ko overwrite kar sakta hai.',
      },
      {
        en: '**Sticky headers and infinite scroll.** Throttled scroll handlers, or `IntersectionObserver`, which the browser optimises for you.',
        hi: '**Sticky headers aur infinite scroll.** Throttled scroll handlers, ya `IntersectionObserver`, jise browser khud optimise karta hai.',
      },
      {
        en: '**React\'s `useMemo` and `useCallback`** are memoisation with the dependency array as the cache key — the same idea you just implemented by hand.',
        hi: '**React ke `useMemo` aur `useCallback`** memoisation hi hain, jisme dependency array cache key hai — wahi idea jo aapne abhi haath se banaya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between debounce and throttle?',
        qHi: 'Debounce aur throttle mein kya fark hai?',
        a: 'Debounce delays execution until a quiet period has elapsed, so a burst of calls produces exactly one execution at the end. Throttle guarantees at most one execution per interval, so a burst produces several executions spread evenly. Use debounce when only the final value matters, throttle when you need regular updates during the activity.',
        aHi: 'Debounce execution ko tab tak taalta hai jab tak khamoshi ka waqt na guzar jaye, isliye calls ki bauchhar ant mein bilkul ek execution deti hai. Throttle har antaral mein zyada se zyada ek execution ki guarantee deta hai, isliye bauchhar barabar failey kai executions deti hai. Jab sirf aakhri value matter kare tab debounce, aur jab kaam ke dauran niyamit updates chahiye tab throttle.',
      },
      {
        q: 'Implement debounce.',
        qHi: 'Debounce banao.',
        a: 'Hold a timer id in a closure. On each call, clear the pending timer and schedule a new one. Use `fn.apply(this, args)` so the wrapper works on object methods, and expose a `cancel` so a pending call can be dropped on cleanup.',
        aHi: 'Timer id closure mein rakho. Har call par pending timer clear karo aur naya schedule karo. `fn.apply(this, args)` use karo taaki wrapper object methods par bhi chale, aur `cancel` do taaki cleanup par pending call chhodi ja sake.',
        code: `function debounce(fn, delay) {
  let timer;
  function wrapped(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  }
  wrapped.cancel = () => clearTimeout(timer);
  return wrapped;
}`,
      },
      {
        q: 'When is memoisation unsafe?',
        qHi: 'Memoisation kab surakshit nahi hai?',
        a: 'Whenever the function is not pure. If it depends on the current time, randomness, external state such as the DOM or a database, or if it has side effects, caching will return a stale result and suppress the side effect. An unbounded cache is also a memory leak, so production code needs a size limit or TTL.',
        aHi: 'Jab bhi function pure na ho. Agar wo current time, randomness, DOM ya database jaisi bahari state par nirbhar hai, ya uske side effects hain, to cache purana result dega aur side effect dab jayega. Bina seema wala cache memory leak bhi hai, isliye production code ko size limit ya TTL chahiye.',
      },
      {
        q: 'Why prefer `requestAnimationFrame` over `setTimeout` for visual updates?',
        qHi: 'Visual updates ke liye `setTimeout` se `requestAnimationFrame` behtar kyun hai?',
        a: 'rAF runs once per frame, immediately before the browser paints, so updates are synchronised with the display and never computed more often than they can be shown. It also pauses automatically in background tabs, which a timer does not.',
        aHi: 'rAF har frame mein ek baar chalta hai, browser ke paint karne se theek pehle, isliye updates display ke saath tal mein rehte hain aur dikhne se zyada baar calculate nahi hote. Wo background tabs mein apne aap ruk bhi jata hai, jo timer nahi karta.',
      },
      {
        q: 'How would you approach a page that feels slow?',
        qHi: 'Jo page slow lagta ho uspar kaise kaam karoge?',
        a: 'Measure before changing anything. Use the Performance profiler to find where time actually goes, check whether the cost is network, scripting, layout or paint, and only then choose a fix — parallelising requests, throttling a handler, batching DOM writes, or changing a data structure. Optimising on intuition usually targets the wrong function.',
        aHi: 'Kuch badalne se pehle naapo. Performance profiler se dekho ki waqt asal mein kahan ja raha hai, dekho ki kharcha network ka hai, scripting ka, layout ka ya paint ka, aur tabhi ilaaj chuno — requests parallel karna, handler throttle karna, DOM writes batch karna, ya data structure badalna. Andaze par optimise karna aksar galat function par jata hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement `debounce(fn, delay)` with a `.cancel()` method. Test it by calling it five times rapidly and confirming `fn` runs once.',
        taskHi: '`.cancel()` method wala `debounce(fn, delay)` banao. Use teji se paanch baar call karke confirm karo ki `fn` ek baar chalta hai.',
        hint: 'Attach `cancel` as a property on the returned function, then have it call `clearTimeout`.',
        hintHi: 'Return kiye function par `cancel` property lagao, aur usme `clearTimeout` bulao.',
      },
      {
        task: 'Implement `throttle(fn, limit)` and attach it to a scroll listener. Log the scroll position and confirm it fires at most ten times a second.',
        taskHi: '`throttle(fn, limit)` banao aur usse scroll listener par lagao. Scroll position log karo aur confirm karo ki wo second mein zyada se zyada das baar chalta hai.',
        hint: 'Use a `waiting` boolean plus a timer. Add `{ passive: true }` to the listener for smoother scrolling.',
        hintHi: 'Ek `waiting` boolean aur timer use karo. Smooth scrolling ke liye listener par `{ passive: true }` lagao.',
      },
      {
        task: 'Write `memoize(fn, ttlMs)` where cached entries expire after `ttlMs`. Prove it recomputes once the TTL has passed.',
        taskHi: '`memoize(fn, ttlMs)` likho jisme cached entries `ttlMs` ke baad khatam ho jayein. Sabit karo ki TTL guzarne ke baad wo dobara calculate karta hai.',
        hint: 'Store `{ value, at: Date.now() }` and treat an entry as a miss when `Date.now() - at > ttlMs`.',
        hintHi: '`{ value, at: Date.now() }` store karo aur jab `Date.now() - at > ttlMs` ho to entry ko miss maano.',
      },
    ],

    keyTakeaways: [
      'Debounce waits for a quiet period and runs once at the end — right for search boxes.',
      'Throttle runs at most once per interval, keeping a steady rate — right for scroll and resize.',
      'Create the debounced or throttled function ONCE, outside the handler, or it does nothing.',
      'Memoize only pure functions, and bound the cache with a size limit or a TTL.',
      'Use `requestAnimationFrame` for visual updates; it syncs with paint and pauses when hidden.',
      'Measure before optimising — the slow part is very often not where you assumed.',
    ],
    keyTakeawaysHi: [
      'Debounce khamoshi ka intezaar karke ant mein ek baar chalta hai — search boxes ke liye sahi.',
      'Throttle har antaral mein zyada se zyada ek baar chalta hai, sthir raftaar rakhte hue — scroll aur resize ke liye sahi.',
      'Debounced ya throttled function EK BAAR banao, handler ke bahar, warna wo kuch karta hi nahi.',
      'Sirf pure functions memoize karo, aur cache ko size limit ya TTL se baandho.',
      'Visual updates ke liye `requestAnimationFrame` use karo; wo paint ke saath chalta hai aur chhupne par ruk jata hai.',
      'Optimise se pehle naapo — slow hissa aksar wahan hota hi nahi jahan aapne socha tha.',
    ],
  },
];
