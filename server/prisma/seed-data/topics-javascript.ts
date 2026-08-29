import type { SeedCategory } from './topics-shared';

export const javascriptCategory: SeedCategory = {
  slug: 'javascript',
  name: 'JavaScript',
  description: 'Closures, the event loop, prototypes and the async model — the core of every frontend interview.',
  icon: 'js',
  group: 'core',
  topics: [
    {
      slug: 'js-variables-and-scope',
      title: 'Variables & Scope',
      difficulty: 'EASY',
      summary: 'var is function-scoped; let and const are block-scoped. That single difference explains most confusing loop bugs.',
      summaryHi: 'var function-scoped hai; let aur const block-scoped. Loop ke zyadatar confusing bugs isi ek farq se aate hain.',
      content: `**Scope** is the region of code where a name is visible.

- \`var\` is **function-scoped**. It ignores \`{}\` blocks entirely, so a \`var\` declared inside an \`if\` or \`for\` leaks to the whole function.
- \`let\` and \`const\` are **block-scoped**. They exist only inside the nearest \`{}\`.
- \`const\` prevents *reassignment*, not *mutation*. \`const arr = []\` still allows \`arr.push(1)\`.

The classic interview bug: a \`var\` counter in a loop with async callbacks. All callbacks share one binding, so they all see the final value. \`let\` creates a fresh binding per iteration and fixes it.

**Rule of thumb:** default to \`const\`, use \`let\` when you must reassign, and never use \`var\` in new code.`,
      contentHi: `**Scope** matlab wo hissa jahan koi naam dikhai deta hai.

- \`var\` **function-scoped** hai. Ye \`{}\` blocks ko ginta hi nahi, isliye \`if\` ya \`for\` ke andar declare kiya gaya \`var\` poore function mein leak ho jata hai.
- \`let\` aur \`const\` **block-scoped** hain. Ye sirf apne nazdeeki \`{}\` ke andar hi zinda rehte hain.
- \`const\` *reassignment* rokta hai, *mutation* nahi. \`const arr = []\` ke baad bhi \`arr.push(1)\` chalta hai.

Classic interview bug: loop mein \`var\` counter aur async callbacks. Saare callbacks ek hi binding share karte hain, isliye sabko aakhri value dikhti hai. \`let\` har iteration mein nayi binding banata hai aur ye theek ho jata hai.

**Rule:** default \`const\` rakho, reassign karna ho tabhi \`let\`, aur naye code mein \`var\` bilkul mat use karo.`,
      codeExample: `for (var i = 0; i < 3; i++) setTimeout(() => console.log('var', i), 0);
for (let j = 0; j < 3; j++) setTimeout(() => console.log('let', j), 0);

const arr = [1, 2];
arr.push(3);          // allowed — mutation
console.log(arr.length);`,
      expectedOutput: `3
var 3
var 3
var 3
let 0
let 1
let 2`,
      commonMistakes: [
        'Thinking const makes objects and arrays immutable — it only freezes the binding.',
        'Using var in loops with callbacks and expecting per-iteration values.',
        'Forgetting the temporal dead zone: reading a let/const before its declaration throws, it does not give undefined.',
      ],
      interviewQuestions: [
        'What is the difference between var, let and const?',
        'What is the temporal dead zone?',
        'Why does a var loop counter print the final value inside setTimeout?',
        'Is const immutable? Explain.',
      ],
      practiceQuestions: [
        'Rewrite a var-based loop with callbacks so each callback sees its own index — without using let.',
        'Predict the output of a snippet mixing var and let inside nested blocks.',
      ],
      tags: ['scope', 'var', 'let', 'const', 'basics'],
    },

    {
      slug: 'js-hoisting',
      title: 'Hoisting',
      difficulty: 'EASY',
      summary: 'Declarations are registered before code runs. var initialises to undefined; let/const stay in the temporal dead zone.',
      summaryHi: 'Declarations code chalne se pehle register ho jaati hain. var undefined se initialise hota hai; let/const temporal dead zone mein rehte hain.',
      content: `Before executing a scope, the engine registers every declaration in it. That registration is what people call **hoisting**.

- \`var\` declarations are hoisted **and initialised to \`undefined\`**, so reading one early gives \`undefined\` rather than an error.
- \`let\` and \`const\` are hoisted but **not initialised**. Reading them before the declaration line throws \`ReferenceError\` — the gap is the **temporal dead zone (TDZ)**.
- **Function declarations** are hoisted with their body, so you can call them before they appear.
- **Function expressions** and arrow functions follow their variable's rules — a \`const fn = () => {}\` is in the TDZ until that line runs.

The precise mental model: hoisting moves *declarations*, never *assignments*.`,
      contentHi: `Kisi scope ko chalane se pehle engine us scope ki saari declarations register kar leta hai. Isi registration ko log **hoisting** kehte hain.

- \`var\` declarations hoist hoti hain **aur \`undefined\` se initialise** ho jaati hain, isliye pehle padhne par error nahi, \`undefined\` milta hai.
- \`let\` aur \`const\` hoist to hote hain par **initialise nahi** hote. Declaration line se pehle padhne par \`ReferenceError\` aata hai — is gap ko **temporal dead zone (TDZ)** kehte hain.
- **Function declarations** apni body ke saath hoist hoti hain, isliye unhe upar se bhi call kar sakte ho.
- **Function expressions** aur arrow functions apne variable ke rules follow karte hain — \`const fn = () => {}\` us line tak TDZ mein rehta hai.

Sahi mental model: hoisting *declarations* ko upar le jaati hai, *assignments* ko kabhi nahi.`,
      codeExample: `console.log(typeof a);   // undefined — var is hoisted and initialised
var a = 1;

greet();                 // works — function declaration hoisted with its body
function greet() { console.log('hi'); }

try { console.log(b); } catch (e) { console.log(e.constructor.name); }
let b = 2;`,
      expectedOutput: `undefined
hi
ReferenceError`,
      commonMistakes: [
        'Saying let and const are "not hoisted" — they are, they just stay uninitialised.',
        'Expecting a function expression to be callable before its assignment line.',
        'Believing hoisting moves the assignment too.',
      ],
      interviewQuestions: [
        'What exactly is hoisted, the declaration or the assignment?',
        'Are let and const hoisted?',
        'Difference in hoisting between a function declaration and a function expression?',
      ],
      practiceQuestions: ['Given a scrambled snippet, predict which lines throw and which print undefined.'],
      tags: ['hoisting', 'tdz', 'basics'],
    },

    {
      slug: 'js-closures',
      title: 'Closures',
      difficulty: 'MEDIUM',
      summary: 'A closure is a function plus the lexical environment it was created in — it keeps outer variables alive after the outer call returns.',
      summaryHi: 'Closure = function + wo lexical environment jisme wo bana tha — outer call khatam hone ke baad bhi outer variables zinda rehte hain.',
      content: `A **closure** is a function bundled with the scope it was *defined* in (not called in). When an inner function references an outer variable, that variable survives after the outer function returns.

Why it matters in interviews:
- **Data privacy** — variables captured in a closure cannot be reached from outside.
- **Factories** — each call to the outer function produces an independent private state.
- **Callbacks and hooks** — every React \`useEffect\`, every event handler, is a closure over the render it was created in. "Stale closure" bugs come from capturing an old value.

The key word is **lexical**: what a closure captures is decided by where the code is written, not by how it is called.`,
      contentHi: `**Closure** matlab ek function apne us scope ke saath bundled, jahan wo *define* hua tha (jahan call hua wahan nahi). Jab inner function kisi outer variable ko use karta hai, to outer function return hone ke baad bhi wo variable zinda rehta hai.

Interview mein kyun important hai:
- **Data privacy** — closure mein capture hue variables bahar se access nahi kiye ja sakte.
- **Factories** — outer function ka har call ek alag private state deta hai.
- **Callbacks aur hooks** — har React \`useEffect\`, har event handler ek closure hai us render par. "Stale closure" bugs purani value capture hone se aate hain.

Sabse important shabd hai **lexical**: closure kya capture karega, ye code kahan likha hai usse tay hota hai, kaise call hua usse nahi.`,
      codeExample: `function counter() {
  let count = 0;                 // private — no outside access
  return { inc: () => ++count, get: () => count };
}

const a = counter();
const b = counter();             // independent state
a.inc(); a.inc(); b.inc();
console.log(a.get(), b.get());`,
      expectedOutput: `2 1`,
      commonMistakes: [
        'Assuming each closure shares state — every call to the outer function creates a fresh environment.',
        'Capturing a loop variable declared with var and being surprised all closures see the same value.',
        'Holding large objects in a closure and leaking memory because the reference never dies.',
      ],
      interviewQuestions: [
        'What is a closure and when have you used one?',
        'How would you implement a private counter using closures?',
        'What is a stale closure in React and how do you fix it?',
        'Can closures cause memory leaks?',
      ],
      practiceQuestions: [
        'Write once(fn) so fn runs at most once and later calls return the first result.',
        'Implement a memoise(fn) helper using a closure over a cache.',
      ],
      tags: ['closures', 'scope', 'functions', 'must-know'],
    },

    {
      slug: 'js-this-keyword',
      title: 'The `this` Keyword',
      difficulty: 'MEDIUM',
      summary: '`this` is decided by how a function is called, except in arrow functions, which inherit it from the enclosing scope.',
      summaryHi: '`this` is baat se tay hota hai ki function kaise call hua — arrow functions ko chhod kar, jo apne bahar wale scope se `this` lete hain.',
      content: `For a regular function, \`this\` is bound **at call time**, following the first rule that matches:

1. **new binding** — \`new Foo()\` sets \`this\` to the new object.
2. **explicit binding** — \`fn.call(obj)\`, \`fn.apply(obj)\`, \`fn.bind(obj)\`.
3. **implicit binding** — \`obj.fn()\` sets \`this\` to \`obj\`.
4. **default** — \`undefined\` in strict mode, \`globalThis\` otherwise.

**Arrow functions have no \`this\` of their own.** They close over the \`this\` of the scope where they were defined, which is why they are the fix for callbacks that lose their receiver.

The classic bug: \`const f = obj.method; f()\` loses the receiver, because \`this\` follows the *call site*, not the definition.`,
      contentHi: `Normal function mein \`this\` **call ke waqt** bind hota hai, aur pehla matching rule lagta hai:

1. **new binding** — \`new Foo()\` mein \`this\` naya object hota hai.
2. **explicit binding** — \`fn.call(obj)\`, \`fn.apply(obj)\`, \`fn.bind(obj)\`.
3. **implicit binding** — \`obj.fn()\` mein \`this\` = \`obj\`.
4. **default** — strict mode mein \`undefined\`, warna \`globalThis\`.

**Arrow functions ka apna \`this\` hota hi nahi.** Wo apne define hone wale scope ka \`this\` le lete hain — isi wajah se un callbacks ka fix hain jinka receiver kho jata hai.

Classic bug: \`const f = obj.method; f()\` — receiver kho jata hai, kyunki \`this\` *call site* follow karta hai, definition nahi.`,
      codeExample: `const user = {
  name: 'Jay',
  regular() { return this?.name; },
  arrow: () => (typeof this === 'undefined' ? 'undefined' : 'outer'),
};

console.log(user.regular());        // implicit binding
const detached = user.regular;
console.log(detached());            // receiver lost
console.log(user.regular.call({ name: 'Bound' }));`,
      expectedOutput: `Jay
undefined
Bound`,
      commonMistakes: [
        'Using an arrow function as an object method and expecting `this` to be the object.',
        'Passing a method as a callback without .bind() and losing the receiver.',
        'Assuming `this` depends on where the function was defined — for regular functions it does not.',
      ],
      interviewQuestions: [
        'How is `this` determined in JavaScript?',
        'Difference between call, apply and bind?',
        'Why can an arrow function not be used as a constructor?',
        'Why do arrow functions solve the "this inside setTimeout" problem?',
      ],
      practiceQuestions: [
        'Implement your own bind() as Function.prototype.myBind.',
        'Fix a class method passed as an event handler so `this` still works.',
      ],
      tags: ['this', 'binding', 'functions', 'must-know'],
    },

    {
      slug: 'js-prototype-inheritance',
      title: 'Prototypes & Inheritance',
      difficulty: 'MEDIUM',
      summary: 'Objects delegate to a prototype chain. `class` is syntax over the same mechanism, not a different one.',
      summaryHi: 'Objects prototype chain ko delegate karte hain. `class` usi mechanism ke upar syntax hai, koi alag cheez nahi.',
      content: `Every object has an internal link (\`[[Prototype]]\`, readable via \`Object.getPrototypeOf\`) to another object. Reading a missing property walks that **prototype chain** until it finds the key or hits \`null\`.

- \`Foo.prototype\` is the object that instances of \`Foo\` delegate to.
- \`class\` is **syntactic sugar**: methods land on \`Class.prototype\`, and \`extends\` wires one prototype to another.
- Writing a property always writes on the **own object**; it never mutates the prototype. That is why shared mutable state on a prototype is a bug magnet.

This delegation is why methods are shared across thousands of instances at zero memory cost.`,
      contentHi: `Har object ka ek internal link (\`[[Prototype]]\`, \`Object.getPrototypeOf\` se padha ja sakta hai) doosre object se juda hota hai. Koi missing property padhne par engine isi **prototype chain** par chalta hai jab tak key mil na jaye ya \`null\` na aa jaye.

- \`Foo.prototype\` wo object hai jise \`Foo\` ke instances delegate karte hain.
- \`class\` **syntactic sugar** hai: methods \`Class.prototype\` par jaate hain, aur \`extends\` ek prototype ko doosre se jodta hai.
- Property likhna hamesha **own object** par hota hai; prototype kabhi mutate nahi hota. Isi wajah se prototype par shared mutable state rakhna bugs ko nyota dena hai.

Yahi delegation hai jiski wajah se hazaron instances ek hi method share karte hain, bina extra memory ke.`,
      codeExample: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + ' makes a sound'; }
}
class Dog extends Animal {
  speak() { return this.name + ' barks'; }
}

const d = new Dog('Rex');
console.log(d.speak());
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype);
console.log(d.hasOwnProperty('speak'));   // false — it lives on the prototype`,
      expectedOutput: `Rex barks
true
false`,
      commonMistakes: [
        'Putting an array or object literal on a prototype — every instance then shares one copy.',
        'Confusing __proto__ (the instance link) with .prototype (the constructor property).',
        'Thinking class gives real private fields — only #fields do.',
      ],
      interviewQuestions: [
        'Explain prototypal inheritance.',
        'Difference between __proto__ and prototype?',
        'Is class in JavaScript real classical inheritance?',
        'How does method lookup work on the prototype chain?',
      ],
      practiceQuestions: [
        'Implement inheritance without class, using Object.create.',
        'Write your own instanceof by walking the prototype chain.',
      ],
      tags: ['prototype', 'inheritance', 'class', 'oop'],
    },

    {
      slug: 'js-event-loop',
      title: 'The Event Loop',
      difficulty: 'HARD',
      summary: 'One call stack, a microtask queue and a macrotask queue. Microtasks drain completely between every macrotask.',
      summaryHi: 'Ek call stack, ek microtask queue, ek macrotask queue. Har macrotask ke beech microtasks poori tarah khaali hote hain.',
      content: `JavaScript runs on a **single thread** with one call stack. Async work is handled by queues:

- **Macrotasks** — \`setTimeout\`, \`setInterval\`, I/O callbacks, UI events.
- **Microtasks** — promise \`.then\`/\`await\` continuations, \`queueMicrotask\`, \`MutationObserver\`.

The loop: run the current script to completion → **drain the entire microtask queue** → run *one* macrotask → drain microtasks again → repeat.

That ordering explains the classic output puzzle: a resolved promise always logs before a \`setTimeout(..., 0)\` scheduled earlier, because microtasks jump the queue.

**Starvation warning:** a microtask that schedules another microtask can block rendering forever, since the loop never reaches the next macrotask.`,
      contentHi: `JavaScript **single thread** par chalta hai, ek hi call stack ke saath. Async kaam queues se handle hota hai:

- **Macrotasks** — \`setTimeout\`, \`setInterval\`, I/O callbacks, UI events.
- **Microtasks** — promise \`.then\`/\`await\` continuations, \`queueMicrotask\`, \`MutationObserver\`.

Loop chalti hai aise: current script poora chalao → **poori microtask queue khaali karo** → *ek* macrotask chalao → phir microtasks khaali karo → dohrao.

Isi order se wo classic output puzzle samajh aata hai: resolved promise hamesha pehle schedule kiye gaye \`setTimeout(..., 0)\` se pehle log hota hai, kyunki microtasks line tod dete hain.

**Starvation ka khatra:** agar microtask aur microtask schedule karta rahe, to rendering hamesha ke liye ruk sakti hai, kyunki loop agle macrotask tak pahunchti hi nahi.`,
      codeExample: `console.log('1 sync');
setTimeout(() => console.log('4 macrotask'), 0);
Promise.resolve().then(() => console.log('3 microtask'));
console.log('2 sync');`,
      expectedOutput: `1 sync
2 sync
3 microtask
4 macrotask`,
      commonMistakes: [
        'Believing setTimeout(fn, 0) runs immediately — it waits for the current task and all microtasks.',
        'Thinking async/await creates a thread. It only yields to the microtask queue.',
        'Assuming a long synchronous loop can be interrupted by a timer. It cannot — the stack must empty first.',
      ],
      interviewQuestions: [
        'Explain the event loop, microtasks and macrotasks.',
        'What is the output order of a snippet mixing setTimeout, Promise.then and sync logs?',
        'What is microtask starvation?',
        'How does Node.js differ from the browser here (process.nextTick, phases)?',
      ],
      practiceQuestions: [
        'Predict the output of a snippet with nested promises inside setTimeout.',
        'Write a chunked loop that processes a large array without freezing the UI.',
      ],
      tags: ['event-loop', 'async', 'microtask', 'must-know'],
    },

    {
      slug: 'js-promises',
      title: 'Promises',
      difficulty: 'MEDIUM',
      summary: 'A promise is a value that settles once — pending → fulfilled or rejected — and never changes again.',
      summaryHi: 'Promise ek aisi value hai jo ek hi baar settle hoti hai — pending → fulfilled ya rejected — aur phir kabhi nahi badalti.',
      content: `A promise has three states: **pending**, **fulfilled**, **rejected**. Once settled it is immutable.

Composition helpers, and when to reach for each:
- \`Promise.all\` — all must succeed; rejects on the **first** failure (fail fast).
- \`Promise.allSettled\` — waits for everything and reports each outcome; use when partial failure is acceptable.
- \`Promise.race\` — settles with the first result, success or failure; good for timeouts.
- \`Promise.any\` — first **success**; rejects only if all fail.

\`.then\` always returns a **new** promise, which is what makes chaining work. Returning a value passes it on; returning a promise waits for it; throwing routes to the nearest \`.catch\`.`,
      contentHi: `Promise ke teen states hain: **pending**, **fulfilled**, **rejected**. Ek baar settle hone ke baad wo immutable hai.

Composition helpers, aur kab kaunsa:
- \`Promise.all\` — sabka succeed hona zaroori; **pehli** failure par hi reject (fail fast).
- \`Promise.allSettled\` — sabka wait karta hai aur har result batata hai; jab kuch ka fail hona chalega tab use karo.
- \`Promise.race\` — pehla result (success ya failure) se settle; timeouts ke liye achha.
- \`Promise.any\` — pehla **success**; sab fail hone par hi reject.

\`.then\` hamesha ek **naya** promise return karta hai — isi se chaining chalti hai. Value return karo to aage pass hoti hai; promise return karo to uska wait hota hai; throw karo to nazdeeki \`.catch\` par chala jata hai.`,
      codeExample: `const ok = (v, ms) => new Promise((r) => setTimeout(() => r(v), ms));
const fail = (e, ms) => new Promise((_, rj) => setTimeout(() => rj(new Error(e)), ms));

Promise.all([ok('a', 10), ok('b', 5)]).then((v) => console.log('all', v));
Promise.allSettled([ok('a', 1), fail('boom', 1)]).then((r) =>
  console.log('settled', r.map((x) => x.status).join(',')),
);
Promise.any([fail('x', 1), ok('winner', 5)]).then((v) => console.log('any', v));`,
      expectedOutput: `settled fulfilled,rejected
all [ 'a', 'b' ]
any winner`,
      commonMistakes: [
        'Forgetting to return inside .then — the next handler then receives undefined.',
        'Using Promise.all when partial failure is fine; one rejection discards every other result.',
        'Creating an unhandled rejection by not attaching a .catch or wrapping in try/catch.',
        'Wrapping an already-async function in new Promise (the "explicit promise construction antipattern").',
      ],
      interviewQuestions: [
        'Difference between Promise.all, allSettled, race and any?',
        'What happens if you do not return inside .then?',
        'How do you add a timeout to a promise?',
        'How would you implement Promise.all yourself?',
      ],
      practiceQuestions: [
        'Implement promiseAll(promises) from scratch, preserving input order.',
        'Write withTimeout(promise, ms) using Promise.race.',
        'Build a retry(fn, times) helper with exponential backoff.',
      ],
      tags: ['promise', 'async', 'must-know'],
    },

    {
      slug: 'js-async-await',
      title: 'Async / Await',
      difficulty: 'MEDIUM',
      summary: 'Syntax over promises. An async function always returns a promise, and await pauses only that function.',
      summaryHi: 'Promises ke upar syntax. Async function hamesha promise return karta hai, aur await sirf usi function ko rokta hai.',
      content: `\`async\` makes a function return a promise. \`await\` unwraps a promise and suspends **only that function**, not the thread.

The performance mistake that shows up in real code review: awaiting inside a loop serialises independent work.

\`\`\`js
// slow — sequential
for (const id of ids) results.push(await fetchUser(id));

// fast — parallel
const results = await Promise.all(ids.map(fetchUser));
\`\`\`

Error handling uses ordinary \`try/catch\`, which is the main readability win over \`.then\` chains. In a \`for await...of\` or when you need per-item error isolation, \`Promise.allSettled\` is usually the right tool.`,
      contentHi: `\`async\` function ko promise return karwata hai. \`await\` promise ko unwrap karta hai aur **sirf usi function** ko rokta hai, poore thread ko nahi.

Code review mein sabse zyada dikhne wali performance galti: loop ke andar await karna, jisse independent kaam bhi ek-ek karke chalta hai.

\`\`\`js
// slow — sequential
for (const id of ids) results.push(await fetchUser(id));

// fast — parallel
const results = await Promise.all(ids.map(fetchUser));
\`\`\`

Error handling normal \`try/catch\` se hota hai — \`.then\` chains ke muqable yahi sabse bada readability fayda hai. \`for await...of\` mein ya jab har item ka error alag handle karna ho, wahan \`Promise.allSettled\` sahi tool hota hai.`,
      codeExample: `const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));

async function sequential() {
  const t = Date.now();
  await wait(50, 1); await wait(50, 2);
  return Date.now() - t >= 100;
}
async function parallel() {
  const t = Date.now();
  await Promise.all([wait(50, 1), wait(50, 2)]);
  return Date.now() - t < 100;
}
(async () => {
  console.log('sequential took >= 100ms:', await sequential());
  console.log('parallel took < 100ms:', await parallel());
})();`,
      expectedOutput: `sequential took >= 100ms: true
parallel took < 100ms: true`,
      commonMistakes: [
        'await inside a for loop for independent requests — turns parallel work into serial work.',
        'Forgetting that an async function swallows nothing: an un-awaited call produces an unhandled rejection.',
        'Using await in a non-async function (a syntax error outside top-level modules).',
        'Assuming await blocks the event loop — it does not.',
      ],
      interviewQuestions: [
        'What does an async function return?',
        'How do you run several async calls in parallel?',
        'How does error handling differ between async/await and .then?',
        'What is the difference between return and return await?',
      ],
      practiceQuestions: [
        'Refactor a sequential await loop into a parallel version and measure the difference.',
        'Write a mapWithConcurrency(items, fn, limit) helper.',
      ],
      relatedProblemSlugs: [],
      tags: ['async', 'await', 'promise', 'must-know'],
    },

    {
      slug: 'js-array-methods',
      title: 'Arrays & Higher-Order Methods',
      difficulty: 'EASY',
      summary: 'map/filter/reduce return new arrays; sort/splice/reverse mutate in place. Knowing which is which prevents real bugs.',
      summaryHi: 'map/filter/reduce naya array dete hain; sort/splice/reverse jagah par hi badal dete hain. Kaunsa kya karta hai, ye jaanna asli bugs bachata hai.',
      content: `**Returns a new array:** \`map\`, \`filter\`, \`slice\`, \`concat\`, \`flat\`, \`toSorted\`.
**Mutates in place:** \`sort\`, \`reverse\`, \`splice\`, \`push\`, \`pop\`, \`shift\`, \`unshift\`, \`fill\`.

Two traps worth memorising:

1. \`sort()\` with no comparator sorts **as strings**, so \`[10, 9, 1].sort()\` gives \`[1, 10, 9]\`. Always pass \`(a, b) => a - b\` for numbers.
2. \`sort()\` mutates the original. In React that means mutating state directly — copy first with \`[...arr].sort()\` or use \`toSorted()\`.

\`reduce\` is the general one: \`map\`, \`filter\`, \`some\` and \`every\` can all be written with it, which is a common interview exercise.`,
      contentHi: `**Naya array dete hain:** \`map\`, \`filter\`, \`slice\`, \`concat\`, \`flat\`, \`toSorted\`.
**Jagah par hi badalte hain:** \`sort\`, \`reverse\`, \`splice\`, \`push\`, \`pop\`, \`shift\`, \`unshift\`, \`fill\`.

Do trap yaad rakhne layak:

1. Bina comparator ke \`sort()\` **strings ki tarah** sort karta hai, isliye \`[10, 9, 1].sort()\` se \`[1, 10, 9]\` milta hai. Numbers ke liye hamesha \`(a, b) => a - b\` do.
2. \`sort()\` original ko mutate karta hai. React mein iska matlab hai state ko seedha mutate karna — pehle copy karo \`[...arr].sort()\` ya \`toSorted()\` use karo.

\`reduce\` sabse general hai: \`map\`, \`filter\`, \`some\` aur \`every\` sab isse likhe ja sakte hain — interview mein ye common exercise hai.`,
      codeExample: `console.log([10, 9, 1].sort());              // string sort — surprising
console.log([10, 9, 1].sort((a, b) => a - b));

const nums = [1, 2, 3, 4];
const doubledEven = nums.filter((n) => n % 2 === 0).map((n) => n * 2);
console.log(doubledEven);
console.log(nums.reduce((acc, n) => acc + n, 0));`,
      expectedOutput: `[ 1, 10, 9 ]
[ 1, 9, 10 ]
[ 4, 8 ]
10`,
      commonMistakes: [
        'Calling sort() on numbers without a comparator.',
        'Mutating React state with sort/splice/push instead of copying first.',
        'Using map for side effects when forEach (or a plain loop) is clearer.',
        'Forgetting reduce needs an initial value when the array can be empty.',
      ],
      interviewQuestions: [
        'Which array methods mutate and which return a new array?',
        'Why does [10, 9, 1].sort() give [1, 10, 9]?',
        'Implement map/filter using reduce.',
        'Difference between forEach and map?',
      ],
      practiceQuestions: [
        'Implement Array.prototype.myMap and myFilter.',
        'Group an array of objects by a key using reduce.',
      ],
      relatedProblemSlugs: ['two-sum', 'move-zeroes', 'maximum-subarray'],
      tags: ['array', 'map', 'filter', 'reduce'],
    },

    {
      slug: 'js-map-set',
      title: 'Map & Set',
      difficulty: 'EASY',
      summary: 'Map allows any key type and preserves insertion order; Set stores unique values. Both beat objects and arrays for lookups.',
      summaryHi: 'Map koi bhi key type leta hai aur insertion order rakhta hai; Set unique values rakhta hai. Lookup ke liye dono object/array se better hain.',
      content: `**Map vs plain object**
- Map keys can be **any value** (objects, functions), object keys are strings/symbols only.
- Map preserves **insertion order** and exposes \`.size\`.
- Map has no prototype keys, so no accidental collision with \`toString\` or \`constructor\`.
- Map is optimised for frequent additions and removals.

**Set** stores unique values with O(1) \`has\`. Deduplicating an array is \`[...new Set(arr)]\`.

Both use **SameValueZero** equality: \`NaN\` equals \`NaN\` (unlike \`===\`), but two structurally identical objects are still different keys.

In DSA work these are the default tools — a hash map turns most O(n²) scans into O(n).`,
      contentHi: `**Map vs plain object**
- Map ki keys **koi bhi value** ho sakti hain (objects, functions), object ki keys sirf strings/symbols.
- Map **insertion order** rakhta hai aur \`.size\` deta hai.
- Map par prototype keys nahi hoti, isliye \`toString\` ya \`constructor\` se galti se collision nahi hota.
- Baar-baar add/remove karne ke liye Map optimised hai.

**Set** unique values rakhta hai aur \`has\` O(1) mein deta hai. Array dedupe karna ho to \`[...new Set(arr)]\`.

Dono **SameValueZero** equality use karte hain: \`NaN\` ko \`NaN\` ke barabar maanta hai (\`===\` ke ulat), par do structurally same objects phir bhi alag keys hain.

DSA mein ye default tools hain — hash map zyadatar O(n²) scans ko O(n) bana deta hai.`,
      codeExample: `const m = new Map();
const keyObj = { id: 1 };
m.set(keyObj, 'object key').set('a', 1).set(NaN, 'nan works');
console.log(m.size, m.get(keyObj), m.get(NaN));

const s = new Set([1, 2, 2, 3, 3, 3]);
console.log([...s], s.has(2));`,
      expectedOutput: `3 object key nan works
[ 1, 2, 3 ] true`,
      commonMistakes: [
        'Using an object as a Map key and then looking it up with a structurally equal but different object.',
        'Reaching for an object as a dictionary and hitting inherited keys like "constructor".',
        'Forgetting Map/Set are not JSON-serialisable — JSON.stringify(new Map()) gives {}.',
      ],
      interviewQuestions: [
        'When would you use a Map instead of a plain object?',
        'How do you deduplicate an array?',
        'What equality does Set use for NaN?',
        'What is a WeakMap and when is it useful?',
      ],
      practiceQuestions: [
        'Implement an LRU cache using Map and its insertion order.',
        'Find the first duplicate in an array using a Set.',
      ],
      relatedProblemSlugs: ['two-sum', 'first-unique-character', 'group-anagrams'],
      tags: ['map', 'set', 'hashmap', 'data-structures'],
    },

    {
      slug: 'js-error-handling',
      title: 'Error Handling',
      difficulty: 'EASY',
      summary: 'Throw Error objects, catch narrowly, and never swallow an error silently.',
      summaryHi: 'Error objects throw karo, soch samajh kar catch karo, aur error ko chupchaap nigalo mat.',
      content: `Rules that hold up in production code:

1. **Throw \`Error\` instances**, not strings — only Errors carry a stack trace.
2. **Subclass Error** for domain failures (\`class NotFoundError extends Error\`) so callers can branch on type instead of parsing messages.
3. **Never write an empty \`catch\`.** If a failure is genuinely ignorable, log it and say why in a comment.
4. \`finally\` runs on every path — use it for cleanup.
5. In async code, an un-awaited rejected promise becomes an **unhandled rejection**, which crashes Node by default in recent versions.

In an Express API this maps to one central error middleware plus typed errors thrown from services — exactly what this app does in \`middleware/error-handler.ts\`.`,
      contentHi: `Production code mein tikne wale rules:

1. **\`Error\` instances throw karo**, strings nahi — stack trace sirf Errors ke saath aata hai.
2. Domain failures ke liye **Error subclass** banao (\`class NotFoundError extends Error\`) taaki caller message parse karne ki jagah type par branch kar sake.
3. **Khaali \`catch\` kabhi mat likho.** Agar failure sach mein ignore karne layak hai to log karo aur comment mein wajah likho.
4. \`finally\` har raste par chalta hai — cleanup wahin karo.
5. Async code mein bina await kiya rejected promise **unhandled rejection** ban jata hai, jo recent Node versions mein by default crash karta hai.

Express API mein iska matlab hai ek central error middleware aur services se typed errors — bilkul wahi jo is app ke \`middleware/error-handler.ts\` mein hai.`,
      codeExample: `class NotFoundError extends Error {
  constructor(resource) { super(resource + ' not found'); this.name = 'NotFoundError'; this.status = 404; }
}

function findUser(id) {
  if (id !== 1) throw new NotFoundError('User');
  return { id, name: 'Jay' };
}

try { findUser(2); }
catch (err) {
  if (err instanceof NotFoundError) console.log(err.status, err.message);
  else throw err;                    // do not swallow what you do not understand
}
finally { console.log('cleanup always runs'); }`,
      expectedOutput: `404 User not found
cleanup always runs`,
      commonMistakes: [
        'throw "something went wrong" — a string has no stack trace.',
        'Empty catch blocks that hide real failures.',
        'Catching every error at the top level and returning 500 for what should be a 400 or 404.',
        'Forgetting that try/catch does not catch errors thrown inside an un-awaited promise.',
      ],
      interviewQuestions: [
        'How do you create a custom error class?',
        'What is an unhandled promise rejection?',
        'How do you centralise error handling in Express?',
        'Does finally run if the try block returns?',
      ],
      practiceQuestions: [
        'Write an asyncHandler wrapper that forwards rejected promises to Express error middleware.',
        'Design an error hierarchy for a REST API (validation, auth, not found, conflict).',
      ],
      tags: ['errors', 'exceptions', 'production'],
    },

    {
      slug: 'js-es6-features',
      title: 'ES6+ Essentials',
      difficulty: 'EASY',
      summary: 'Destructuring, spread/rest, template literals, optional chaining and nullish coalescing — the syntax modern reviewers expect.',
      summaryHi: 'Destructuring, spread/rest, template literals, optional chaining aur nullish coalescing — modern code review mein yahi syntax expect kiya jata hai.',
      content: `The features that actually show up in day-to-day code:

- **Destructuring** with defaults and renaming: \`const { a: alpha = 1 } = obj\`.
- **Spread / rest**: copy and merge (\`{ ...a, ...b }\`), collect arguments (\`(...args)\`). Note both are **shallow** — nested objects are still shared.
- **Optional chaining** \`?.\` short-circuits on \`null\`/\`undefined\` instead of throwing.
- **Nullish coalescing** \`??\` falls back only for \`null\`/\`undefined\`, unlike \`||\` which also catches \`0\` and \`''\`. This distinction is a very common bug source.
- **Template literals** for interpolation and multi-line strings.

Use \`??\` for defaults whenever \`0\`, \`false\` or \`''\` are legitimate values.`,
      contentHi: `Wo features jo roz ke code mein sach much dikhte hain:

- **Destructuring** defaults aur renaming ke saath: \`const { a: alpha = 1 } = obj\`.
- **Spread / rest**: copy aur merge (\`{ ...a, ...b }\`), arguments collect (\`(...args)\`). Dhyan raho — dono **shallow** hain, nested objects abhi bhi share hote hain.
- **Optional chaining** \`?.\` \`null\`/\`undefined\` par error dene ki jagah short-circuit ho jata hai.
- **Nullish coalescing** \`??\` sirf \`null\`/\`undefined\` par fallback deta hai, jabki \`||\` \`0\` aur \`''\` ko bhi pakad leta hai. Yahi farq bahut common bug ki jad hai.
- **Template literals** interpolation aur multi-line strings ke liye.

Jab \`0\`, \`false\` ya \`''\` valid values hon, defaults ke liye hamesha \`??\` use karo.`,
      codeExample: `const config = { retries: 0, name: '' };
console.log(config.retries || 3);   // 3 — wrong, 0 is a real value
console.log(config.retries ?? 3);   // 0 — correct

const user = { profile: null };
console.log(user.profile?.city ?? 'unknown');

const { name = 'anon', ...rest } = { name: '', role: 'dev', id: 7 };
console.log(name === '', rest);`,
      expectedOutput: `3
0
unknown
true { role: 'dev', id: 7 }`,
      commonMistakes: [
        'Using || for defaults when 0, false or "" are valid — use ?? instead.',
        'Assuming spread does a deep copy; nested objects stay shared by reference.',
        'Destructuring a possibly-undefined value without a default, which throws.',
      ],
      interviewQuestions: [
        'Difference between || and ???',
        'Is spread a deep or shallow copy?',
        'How does optional chaining behave on a function call that does not exist?',
        'What is the difference between rest and spread?',
      ],
      practiceQuestions: [
        'Write a deepClone function and explain where spread falls short.',
        'Refactor a defensive nested-property check into optional chaining.',
      ],
      tags: ['es6', 'syntax', 'modern-js'],
    },
  ],
};
