/**
 * JavaScript Complete Course — Module 1: Fundamentals.
 *
 * Written to the same rules as `topics-simple.ts`, because the job is the same:
 * explain it to someone who has never programmed.
 *
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its output. Never make the reader guess.
 *
 * Hinglish here means Hindi written in Roman script — the same voice the rest of
 * the seed uses. Devanagari is deliberately avoided: the reader is a developer
 * reading code, and Roman script keeps code and prose in one alphabet.
 */

export interface LessonExample {
  title: string;
  titleHi: string;
  code: string;
  /** Textual result. Visual lessons use `preview` instead. */
  output?: string;
  /**
   * A complete HTML document rendered in a sandboxed iframe. CSS and HTML have
   * to be seen rather than described, so those lessons ship this.
   */
  preview?: string;
  /** Rendered height in px; tall demos such as grids need more room. */
  previewHeight?: number;
  /**
   * JS/TS pair for the React course: when both are present, the lesson page
   * shows one JS ⇄ TS toggle button and swaps `codeJs`/`codeTs` (and their
   * matching outputs) in place, instead of stacking two separate examples.
   * `code`/`output` are ignored once these are set — fill them in too anyway,
   * identical to `codeJs`/`outputJs`, so the example still renders correctly
   * for any older client that doesn't know about the toggle.
   */
  codeJs?: string;
  codeTs?: string;
  outputJs?: string;
  outputTs?: string;
  explain: string;
  explainHi: string;
}

export interface LessonMistake {
  wrong: string;
  right: string;
  /** Side-by-side previews, so the reader sees the breakage before the fix. */
  previewWrong?: string;
  previewRight?: string;
  previewHeight?: number;
  why: string;
  whyHi: string;
}

export interface LessonQA {
  q: string;
  qHi: string;
  a: string;
  aHi: string;
  code?: string;
}

export interface LessonExercise {
  task: string;
  taskHi: string;
  hint: string;
  hintHi: string;
}

export interface CourseLesson {
  slug: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  duration: number;
  order: number;
  analogy: { en: string; hi: string };
  simple: string;
  simpleHi: string;
  content: string;
  contentHi: string;
  /** Optional single snippet; the outline-level topics in modules 2-3 use these. */
  codeExample?: string;
  expectedOutput?: string;
  examples: LessonExample[];
  mistakes: LessonMistake[];
  realWorld: { en: string; hi: string }[];
  interviewQA: LessonQA[];
  exercises: LessonExercise[];
  keyTakeaways: string[];
  keyTakeawaysHi: string[];
}

export const JS_MODULE_1: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'variables-scope-hoisting',
    title: 'Variables, Scope, and Hoisting',
    titleHi: 'Variables, Scope aur Hoisting',
    description: 'Boxes, rooms, and why JavaScript reads your names before it runs your code.',
    descriptionHi: 'Dabbe, kamre, aur JavaScript aapke naam pehle kyun padh leta hai.',
    difficulty: 'EASY',
    duration: 25,
    order: 1,

    analogy: {
      en: '**Boxes kept in rooms.** A variable is a labelled box holding a value. Scope is which room that box sits in — people in the kitchen cannot reach a box you left in the bedroom.',
      hi: '**Kamron mein rakhe dabbe.** Variable ek naam wala dabba hai jisme value rakhi hai. Scope matlab wo dabba kis kamre mein hai — kitchen wale bedroom ke dabbe tak nahi pahunch sakte.',
    },

    simple: `**Think of boxes in rooms.**

A variable is a box with a name, holding a value.

\`\`\`js
const price = 250;
\`\`\`

You just labelled a box \`price\` and put \`250\` inside it.

**Scope** = which room the box is kept in.

- \`let\` and \`const\` → the box stays in **that one room** — the \`{ }\` block it was created in.
- \`var\` → the box leaks out into the **whole house** — the entire function.

**Which one do I use?**

Use \`const\` by default. If you truly need to change the value later, use \`let\`. Do not use \`var\` — it is the old way and it leaks.

\`const\` means you cannot swap the box for a different box:

\`\`\`js
const price = 250;
price = 300;  // ❌ Error
\`\`\`

But if the box holds a bag of toys, you can still add and remove toys:

\`\`\`js
const cart = ['shirt'];
cart.push('shoes');  // ✅ Fine — same box, different contents
\`\`\`

**Hoisting** is the last piece. Before JavaScript runs your code, it quickly scans it and **writes down every name you declared**. Only then does it run line by line. So the names exist early, but the values do not.

**Remember:** names move up, values do not.`,

    simpleHi: `**Kamron mein rakhe dabbe socho.**

Variable ek dabba hai jiska naam hai aur usme value rakhi hai.

\`\`\`js
const price = 250;
\`\`\`

Aapne abhi ek dabbe par \`price\` likha aur usme \`250\` daal diya.

**Scope** = wo dabba kis kamre mein rakha hai.

- \`let\` aur \`const\` → dabba **usi ek kamre** mein rehta hai — jis \`{ }\` block mein bana tha.
- \`var\` → dabba **poore ghar** mein leak ho jata hai — poore function mein.

**Kaunsa use karun?**

Default \`const\` use karo. Agar sach mein value badalni pade tabhi \`let\`. \`var\` mat use karo — wo purana tarika hai aur leak karta hai.

\`const\` ka matlab hai dabba badal nahi sakte:

\`\`\`js
const price = 250;
price = 300;  // ❌ Error
\`\`\`

Par agar dabbe mein khilono ka thaila hai, to khilone add/remove kar sakte ho:

\`\`\`js
const cart = ['shirt'];
cart.push('shoes');  // ✅ Theek hai — dabba wahi, andar ka saaman alag
\`\`\`

**Hoisting** aakhri cheez hai. Code chalane se pehle JavaScript ek baar scan karke **aapke saare declare kiye naam note kar leta hai**. Uske baad line-by-line chalata hai. Isliye naam pehle se exist karte hain, values nahi.

**Yaad rakho:** naam upar chale jate hain, values nahi.`,

    content: `## The three keywords

| | \`var\` | \`let\` | \`const\` |
|---|---|---|---|
| Lives in | whole function | the \`{ }\` block | the \`{ }\` block |
| Can reassign? | yes | yes | **no** |
| Can redeclare? | yes | no | no |
| Before its line | \`undefined\` | ❌ error | ❌ error |

## Hoisting, precisely

JavaScript runs your file in two passes.

**Pass 1 — the roll call.** It walks the code and notes every declared name.
**Pass 2 — the run.** It executes line by line, assigning values as it reaches them.

That is why this works but gives you nothing useful:

\`\`\`js
console.log(a);  // undefined — name known, value not assigned yet
var a = 5;
\`\`\`

And why this crashes instead:

\`\`\`js
console.log(b);  // ❌ ReferenceError
let b = 5;
\`\`\`

The gap between "scope starts" and "the \`let\` line runs" is called the **Temporal Dead Zone (TDZ)**. Touching the variable in that gap is an error — deliberately, so bugs surface loudly instead of silently becoming \`undefined\`.`,

    contentHi: `## Teen keywords

| | \`var\` | \`let\` | \`const\` |
|---|---|---|---|
| Rehta hai | poore function mein | \`{ }\` block mein | \`{ }\` block mein |
| Reassign? | haan | haan | **nahi** |
| Dobara declare? | haan | nahi | nahi |
| Apni line se pehle | \`undefined\` | ❌ error | ❌ error |

## Hoisting, theek se

JavaScript aapki file do baar padhta hai.

**Pehla pass — attendance.** Poora code dekhkar har declare kiya naam note kar leta hai.
**Doosra pass — chalana.** Line-by-line chalata hai aur jaise-jaise pahunchta hai values assign karta hai.

Isiliye ye chalta to hai par kaam ka kuch nahi deta:

\`\`\`js
console.log(a);  // undefined — naam pata hai, value abhi assign nahi hui
var a = 5;
\`\`\`

Aur ye crash ho jata hai:

\`\`\`js
console.log(b);  // ❌ ReferenceError
let b = 5;
\`\`\`

"Scope shuru hone" aur "\`let\` wali line chalne" ke beech ke gap ko **Temporal Dead Zone (TDZ)** kehte hain. Us gap mein variable chhuna error hai — jaan boojhkar, taaki bug chup-chaap \`undefined\` banne ke bajaye zor se saamne aaye.`,

    examples: [
      {
        title: 'Declaring your first variable',
        titleHi: 'Apna pehla variable banana',
        code: `const name = 'Jay';
let age = 25;

console.log(name);
console.log(age);`,
        output: `Jay
25`,
        explain: 'Two boxes. `name` is locked with `const`. `age` uses `let` because a person\'s age changes.',
        explainHi: 'Do dabbe. `name` ko `const` se lock kiya. `age` ke liye `let` kyunki umar badalti hai.',
      },
      {
        title: 'const blocks reassignment',
        titleHi: 'const reassign nahi hone deta',
        code: `const city = 'Pune';
city = 'Mumbai';`,
        output: `TypeError: Assignment to constant variable.`,
        explain: 'You cannot point `city` at a different value. The box is sealed.',
        explainHi: '`city` ko doosri value par point nahi kar sakte. Dabba seal hai.',
      },
      {
        title: 'But const does NOT freeze contents',
        titleHi: 'Par const andar ka saaman freeze nahi karta',
        code: `const user = { name: 'Jay' };
user.name = 'Ravi';   // allowed
console.log(user.name);

user = { name: 'Amit' };  // not allowed`,
        output: `Ravi
TypeError: Assignment to constant variable.`,
        explain: 'Changing what is *inside* the object is fine. Replacing the whole object is not. This trips up almost everyone once.',
        explainHi: 'Object ke *andar* badalna theek hai. Poora object replace karna nahi. Ye galti lagbhag har koi ek baar karta hai.',
      },
      {
        title: 'Block scope — the room walls',
        titleHi: 'Block scope — kamre ki deewarein',
        code: `{
  let secret = 'hidden';
  console.log(secret);
}

console.log(secret);`,
        output: `hidden
ReferenceError: secret is not defined`,
        explain: '`secret` lives only inside the `{ }`. Outside those walls it does not exist.',
        explainHi: '`secret` sirf `{ }` ke andar zinda hai. Deewar ke bahar wo exist hi nahi karta.',
      },
      {
        title: 'var leaks out of the block',
        titleHi: 'var block se bahar leak karta hai',
        code: `if (true) {
  var leaked = 'I escaped';
  let contained = 'I stayed';
}

console.log(leaked);
console.log(contained);`,
        output: `I escaped
ReferenceError: contained is not defined`,
        explain: '`var` ignores block walls — it only respects function walls. This is the single biggest reason to avoid it.',
        explainHi: '`var` block ki deewar nahi maanta — sirf function ki deewar maanta hai. Isse bachne ka yahi sabse bada kaaran hai.',
      },
      {
        title: 'Hoisting with var',
        titleHi: 'var ke saath hoisting',
        code: `console.log(score);
var score = 100;
console.log(score);`,
        output: `undefined
100`,
        explain: 'Line 1 does not crash because the name `score` was already noted during the roll call. Its value simply is not there yet.',
        explainHi: 'Line 1 crash nahi hoti kyunki `score` naam attendance mein note ho chuka tha. Bas value abhi wahan nahi hai.',
      },
      {
        title: 'Hoisting with let — the TDZ',
        titleHi: 'let ke saath hoisting — TDZ',
        code: `console.log(total);
let total = 100;`,
        output: `ReferenceError: Cannot access 'total' before initialization`,
        explain: 'Notice the wording: *cannot access*, not *is not defined*. JavaScript knows the name exists — it is refusing to let you touch it early.',
        explainHi: 'Wording dekho: *cannot access*, na ki *is not defined*. JavaScript ko naam pata hai — wo bas jaldi chhune nahi de raha.',
      },
      {
        title: 'The classic loop trap',
        titleHi: 'Loop ka classic jaal',
        code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var:', i), 0);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let:', j), 0);
}`,
        output: `var: 3
var: 3
var: 3
let: 0
let: 1
let: 2`,
        explain: '`var i` is ONE box shared by all three rounds — by the time the timers fire, it holds 3. `let j` creates a FRESH box each round, so each timer sees its own value. This is the most-asked interview question on this topic.',
        explainHi: '`var i` ek hi dabba hai jo teeno round share karte hain — timer chalne tak usme 3 aa chuka hota hai. `let j` har round mein NAYA dabba banata hai, isliye har timer apni value dekhta hai. Is topic ka sabse zyada pucha jane wala interview question yahi hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const items = [];\nitems = [1, 2, 3];  // ❌`,
        right: `const items = [];\nitems.push(1, 2, 3);  // ✅`,
        why: 'You cannot reassign a `const`, but you can mutate what it holds. Push into the array instead of replacing it.',
        whyHi: '`const` reassign nahi kar sakte, par uske andar ka saaman badal sakte ho. Array replace karne ke bajaye usme push karo.',
      },
      {
        wrong: `for (var i = 0; i < btns.length; i++) {\n  btns[i].onclick = () => alert(i);  // ❌ always the last i\n}`,
        right: `for (let i = 0; i < btns.length; i++) {\n  btns[i].onclick = () => alert(i);  // ✅ each gets its own i\n}`,
        why: 'One shared `var` box versus a fresh `let` box per round. Swapping the keyword is the entire fix.',
        whyHi: 'Ek shared `var` dabba versus har round ka naya `let` dabba. Sirf keyword badalna hi poora fix hai.',
      },
      {
        wrong: `function f() {\n  console.log(x);  // ❌ undefined, silently\n  var x = 1;\n}`,
        right: `function f() {\n  const x = 1;\n  console.log(x);  // ✅ 1\n}`,
        why: 'Declare before you use. `var` hides the mistake behind a harmless-looking `undefined`; `const` makes it impossible.',
        whyHi: 'Use karne se pehle declare karo. `var` galti ko seedhe-saade `undefined` ke peeche chhupa deta hai; `const` use hone hi nahi deta.',
      },
    ],

    realWorld: [
      {
        en: '**Config values.** API keys, base URLs, and limits are declared once with `const` at the top of a file so nothing can accidentally overwrite them mid-run.',
        hi: '**Config values.** API keys, base URLs aur limits file ke top par ek baar `const` se declare hote hain taaki beech mein galti se koi overwrite na kar de.',
      },
      {
        en: '**Loop counters and accumulators.** A running total or a retry count changes on every pass, so those genuinely need `let`.',
        hi: '**Loop counters aur accumulators.** Running total ya retry count har pass mein badalta hai, isliye unhe sach mein `let` chahiye.',
      },
      {
        en: '**Event handlers in lists.** Attaching a click handler to every row in a table is exactly the `let`-vs-`var` trap — get it wrong and every row does the same thing.',
        hi: '**List mein event handlers.** Table ki har row par click handler lagana bilkul wahi `let`-vs-`var` jaal hai — galti ho to har row ek hi kaam karti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `var`, `let`, and `const`?',
        qHi: '`var`, `let` aur `const` mein kya fark hai?',
        a: '`var` is function-scoped, hoisted and initialised to `undefined`, and can be redeclared. `let` and `const` are block-scoped and sit in the Temporal Dead Zone until their declaration runs. `const` additionally cannot be reassigned — though the value it holds can still be mutated.',
        aHi: '`var` function-scoped hai, hoist hokar `undefined` ho jata hai, aur dobara declare ho sakta hai. `let` aur `const` block-scoped hain aur apni declaration line chalne tak Temporal Dead Zone mein rehte hain. `const` ko upar se reassign bhi nahi kar sakte — haan, uske andar ki value mutate ho sakti hai.',
      },
      {
        q: 'What is the Temporal Dead Zone?',
        qHi: 'Temporal Dead Zone kya hai?',
        a: 'The window between entering a scope and the `let`/`const` declaration actually executing. The binding exists but is uninitialised, so reading it throws a ReferenceError. It exists so that using a variable too early fails loudly instead of silently producing `undefined`.',
        aHi: 'Scope shuru hone aur `let`/`const` declaration actually chalne ke beech ki window. Binding exist karti hai par initialise nahi hoti, isliye padhne par ReferenceError aata hai. Ye isliye hai taaki variable jaldi use karne par chup-chaap `undefined` na mile, balki error zor se aaye.',
      },
      {
        q: 'Why does this print 3, 3, 3 and how do you fix it?',
        qHi: 'Ye 3, 3, 3 kyun print karta hai aur isse kaise theek karein?',
        a: '`var i` creates one binding shared by all iterations. By the time the async callbacks run, the loop has finished and `i` is 3. Fix it by switching to `let`, which creates a fresh binding per iteration.',
        aHi: '`var i` ek hi binding banata hai jo saare iterations share karte hain. Jab tak async callbacks chalte hain, loop khatam ho chuka hota hai aur `i` 3 hota hai. Fix: `let` use karo, jo har iteration ke liye nayi binding banata hai.',
        code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 3, 3, 3  →  change var to let  →  0, 1, 2`,
      },
      {
        q: 'Does `const` make an object immutable?',
        qHi: 'Kya `const` object ko immutable bana deta hai?',
        a: 'No. `const` locks the binding, not the value. You cannot point the name at a different object, but you can freely change the object\'s properties. For real immutability you need `Object.freeze()`.',
        aHi: 'Nahi. `const` binding lock karta hai, value nahi. Naam ko doosre object par point nahi kar sakte, par object ki properties aaram se badal sakte ho. Asli immutability ke liye `Object.freeze()` chahiye.',
      },
    ],

    exercises: [
      {
        task: 'Declare a `const` for your name and a `let` for a counter starting at 0. Increase the counter three times and log the final value.',
        taskHi: 'Apne naam ke liye ek `const` aur 0 se shuru hone wale counter ke liye ek `let` banao. Counter ko teen baar badhao aur final value log karo.',
        hint: 'Use `counter++` or `counter += 1` to increase it.',
        hintHi: 'Badhane ke liye `counter++` ya `counter += 1` use karo.',
      },
      {
        task: 'Write a block `{ }` with a `let` inside it, then try to read that variable from outside the block. Read the error message carefully.',
        taskHi: 'Ek block `{ }` likho jiske andar `let` ho, phir us variable ko block ke bahar se padhne ki koshish karo. Error message dhyan se padho.',
        hint: 'The error will say "is not defined" — because outside the block, the name genuinely does not exist.',
        hintHi: 'Error "is not defined" kahega — kyunki block ke bahar wo naam sach mein exist hi nahi karta.',
      },
      {
        task: 'Take the 3, 3, 3 loop from Example 8 and fix it two different ways: once with `let`, and once keeping `var` but wrapping the body in an IIFE.',
        taskHi: 'Example 8 wala 3, 3, 3 loop lo aur do tarikon se fix karo: ek baar `let` se, aur ek baar `var` rakhte hue body ko IIFE mein wrap karke.',
        hint: 'An IIFE looks like `(function (n) { ... })(i)` — it copies the current `i` into a new parameter `n`.',
        hintHi: 'IIFE aisa dikhta hai `(function (n) { ... })(i)` — ye current `i` ko naye parameter `n` mein copy kar deta hai.',
      },
    ],

    keyTakeaways: [
      'Use `const` by default, `let` when the value must change, and `var` never.',
      '`let` and `const` live inside their `{ }` block; `var` leaks to the whole function.',
      '`const` locks the binding, not the contents — objects and arrays can still be mutated.',
      'Hoisting moves names up, not values. `var` becomes `undefined`; `let`/`const` throw until their line runs.',
    ],
    keyTakeawaysHi: [
      'Default `const` use karo, value badalni ho to `let`, aur `var` kabhi nahi.',
      '`let` aur `const` apne `{ }` block mein rehte hain; `var` poore function mein leak karta hai.',
      '`const` binding lock karta hai, andar ka saaman nahi — objects aur arrays phir bhi mutate ho sakte hain.',
      'Hoisting naam upar le jata hai, values nahi. `var` `undefined` ban jata hai; `let`/`const` apni line tak error dete hain.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'functions-arrow-functions',
    title: 'Functions and Arrow Functions',
    titleHi: 'Functions aur Arrow Functions',
    description: 'Reusable machines, and the one rule about `this` that explains every arrow-function bug.',
    descriptionHi: 'Reusable machine, aur `this` ka wo ek rule jo har arrow-function bug samjha deta hai.',
    difficulty: 'EASY',
    duration: 30,
    order: 6,

    analogy: {
      en: '**A juice machine.** You put fruit in, it gives juice out. Same fruit, same juice, every time. You do not rebuild the machine for each glass — you built it once and keep using it.',
      hi: '**Juice ki machine.** Fal daalo, juice nikalta hai. Wahi fal, wahi juice, har baar. Har glass ke liye nayi machine nahi banate — ek baar banayi, baar-baar use karte ho.',
    },

    simple: `**A function is a juice machine.**

Fruit goes in. Juice comes out.

\`\`\`js
function makeJuice(fruit) {
  return fruit + ' juice';
}

makeJuice('apple');   // 'apple juice'
makeJuice('orange');  // 'orange juice'
\`\`\`

- \`fruit\` is the **parameter** — the slot where you drop things in.
- \`'apple'\` is the **argument** — what you actually dropped in this time.
- \`return\` is the spout the juice comes out of.

**No \`return\` means no juice.** A function without \`return\` gives you \`undefined\`.

**Arrow functions** are the same machine, written shorter:

\`\`\`js
const makeJuice = (fruit) => fruit + ' juice';
\`\`\`

No \`function\` word. No \`return\` word when it is a one-liner. That is it.

**The one real difference: \`this\`.**

Think of \`this\` as the word "here". A normal function decides what "here" means based on *who called it*. An arrow function does not decide at all — it just borrows "here" from the code surrounding it.

That single sentence explains almost every \`this\` bug you will ever hit.

**Remember:** short callback → arrow. Object method that needs \`this\` → normal function.`,

    simpleHi: `**Function ek juice machine hai.**

Fal andar jata hai. Juice bahar aata hai.

\`\`\`js
function makeJuice(fruit) {
  return fruit + ' juice';
}

makeJuice('apple');   // 'apple juice'
makeJuice('orange');  // 'orange juice'
\`\`\`

- \`fruit\` **parameter** hai — wo slot jahan aap cheez daalte ho.
- \`'apple'\` **argument** hai — is baar aapne asal mein kya daala.
- \`return\` wo tonti hai jisse juice bahar aata hai.

**\`return\` nahi to juice nahi.** Bina \`return\` wala function \`undefined\` deta hai.

**Arrow functions** wahi machine hai, chhote mein likhi:

\`\`\`js
const makeJuice = (fruit) => fruit + ' juice';
\`\`\`

Na \`function\` shabd. Na \`return\` shabd jab one-liner ho. Bas itna hi.

**Ek asli fark: \`this\`.**

\`this\` ko "yahan" shabd samjho. Normal function decide karta hai ki "yahan" ka matlab kya hai — *usse kisne call kiya* uske hisaab se. Arrow function decide karta hi nahi — wo aas-paas ke code se "yahan" udhaar le leta hai.

Yahi ek line aapke har \`this\` bug ko samjha degi.

**Yaad rakho:** chhota callback → arrow. Object method jise \`this\` chahiye → normal function.`,

    content: `## Three ways to write a function

\`\`\`js
// 1. Declaration — hoisted completely, usable before its line
function add(a, b) { return a + b; }

// 2. Expression — NOT hoisted, only usable after its line
const add = function (a, b) { return a + b; };

// 3. Arrow — not hoisted, no own \`this\`
const add = (a, b) => a + b;
\`\`\`

## The \`this\` rule

| | normal \`function\` | arrow \`=>\` |
|---|---|---|
| Has its own \`this\` | yes | **no** |
| \`this\` decided by | how it is **called** | where it is **written** |
| Works as a method | ✅ | ❌ usually wrong |
| Works as a callback | needs \`.bind()\` | ✅ ideal |
| Usable with \`new\` | ✅ | ❌ throws |
| Has \`arguments\` | ✅ | ❌ |

## Handy parameter tricks

\`\`\`js
// Default — used only when the argument is undefined
const greet = (name = 'World') => \`Hello, \${name}!\`;

// Rest — sweeps up "everything else" into an array
const sum = (...nums) => nums.reduce((t, n) => t + n, 0);
sum(1, 2, 3);  // 6
\`\`\``,

    contentHi: `## Function likhne ke teen tarike

\`\`\`js
// 1. Declaration — poora hoist hota hai, apni line se pehle bhi use ho sakta hai
function add(a, b) { return a + b; }

// 2. Expression — hoist NAHI hota, sirf apni line ke baad use hota hai
const add = function (a, b) { return a + b; };

// 3. Arrow — hoist nahi hota, apna \`this\` nahi hota
const add = (a, b) => a + b;
\`\`\`

## \`this\` ka rule

| | normal \`function\` | arrow \`=>\` |
|---|---|---|
| Apna \`this\` hai | haan | **nahi** |
| \`this\` tay hota hai | kaise **call** hua | kahan **likha** hai |
| Method ke roop mein | ✅ | ❌ aksar galat |
| Callback ke roop mein | \`.bind()\` chahiye | ✅ best |
| \`new\` ke saath | ✅ | ❌ error |
| \`arguments\` milta hai | ✅ | ❌ |

## Kaam ke parameter tricks

\`\`\`js
// Default — sirf tab lagta hai jab argument undefined ho
const greet = (name = 'World') => \`Hello, \${name}!\`;

// Rest — "baaki sab" ko array mein samet leta hai
const sum = (...nums) => nums.reduce((t, n) => t + n, 0);
sum(1, 2, 3);  // 6
\`\`\``,

    examples: [
      {
        title: 'Your first function',
        titleHi: 'Aapka pehla function',
        code: `function add(a, b) {
  return a + b;
}

console.log(add(2, 3));
console.log(add(10, 20));`,
        output: `5
30`,
        explain: 'Written once, used many times. That is the whole point of a function.',
        explainHi: 'Ek baar likha, kai baar use kiya. Function ka poora maqsad yahi hai.',
      },
      {
        title: 'No return means undefined',
        titleHi: 'return nahi to undefined',
        code: `function add(a, b) {
  a + b;   // computed, then thrown away
}

console.log(add(2, 3));`,
        output: `undefined`,
        explain: 'The sum was calculated and immediately discarded. Without `return`, nothing comes out of the machine.',
        explainHi: 'Sum calculate hua aur turant phenk diya gaya. Bina `return` ke machine se kuch bahar nahi aata.',
      },
      {
        title: 'The same function, shortened step by step',
        titleHi: 'Wahi function, step-by-step chhota',
        code: `const add1 = function (a, b) { return a + b; };
const add2 = (a, b) => { return a + b; };
const add3 = (a, b) => a + b;
const double = n => n * 2;

console.log(add1(1, 2), add2(1, 2), add3(1, 2), double(5));`,
        output: `3 3 3 10`,
        explain: 'Four spellings, identical behaviour. Drop `function`, drop the braces and `return` for a one-liner, and drop the parentheses for a single parameter.',
        explainHi: 'Chaar tarike, ek hi kaam. `function` hatao, one-liner ho to braces aur `return` hatao, aur ek hi parameter ho to brackets bhi hatao.',
      },
      {
        title: 'Default parameters',
        titleHi: 'Default parameters',
        code: `const greet = (name = 'World') => \`Hello, \${name}!\`;

console.log(greet('Jay'));
console.log(greet());
console.log(greet(undefined));
console.log(greet(null));`,
        output: `Hello, Jay!
Hello, World!
Hello, World!
Hello, null!`,
        explain: 'The default fires only for `undefined`. `null` is a real value you deliberately passed, so it is used as-is. That last line surprises a lot of people.',
        explainHi: 'Default sirf `undefined` par lagta hai. `null` ek asli value hai jo aapne jaan-boojhkar bheji, isliye wahi use hoti hai. Aakhri line bahut logon ko chaunka deti hai.',
      },
      {
        title: 'Rest parameters — any number of arguments',
        titleHi: 'Rest parameters — kitne bhi arguments',
        code: `const sum = (...nums) => nums.reduce((total, n) => total + n, 0);

console.log(sum(1, 2));
console.log(sum(1, 2, 3, 4, 5));
console.log(sum());`,
        output: `3
15
0`,
        explain: '`...nums` collects every argument into a real array. Works with two numbers or twenty.',
        explainHi: '`...nums` har argument ko ek asli array mein jama kar leta hai. Do numbers ho ya bees, dono chalte hain.',
      },
      {
        title: 'this — the bug everyone hits',
        titleHi: 'this — wo bug jo sabko lagta hai',
        code: `const counter = {
  count: 0,
  addNormal: function () { this.count++; },
  addArrow: () => { this.count++; },
};

counter.addNormal();
console.log(counter.count);

counter.addArrow();
console.log(counter.count);`,
        output: `1
1`,
        explain: '`addNormal` was called as `counter.addNormal()`, so "here" means `counter` — it works. `addArrow` borrowed "here" from the file around it, which is not `counter`, so `counter.count` never moved.',
        explainHi: '`addNormal` ko `counter.addNormal()` se call kiya, isliye "yahan" ka matlab `counter` hua — kaam ho gaya. `addArrow` ne "yahan" aas-paas ke file se udhaar liya, jo `counter` nahi hai, isliye `counter.count` hila hi nahi.',
      },
      {
        title: 'this — where arrows are exactly right',
        titleHi: 'this — jahan arrow bilkul sahi hai',
        code: `const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++;              // arrow borrows \`this\` from start()
      console.log(this.seconds);
    }, 1000);
  },
};

timer.start();  // 1, 2, 3, ...`,
        output: `1
2
3`,
        explain: 'Flip the earlier case. Inside a callback, a normal function would get its own useless `this` — the arrow correctly borrows `timer` from `start()`. This is why arrows exist.',
        explainHi: 'Pichla case ulta ho gaya. Callback ke andar normal function ko apna bekaar `this` milta — arrow sahi se `start()` se `timer` udhaar leta hai. Isiliye arrows bane hain.',
      },
      {
        title: 'Hoisting: declaration vs arrow',
        titleHi: 'Hoisting: declaration vs arrow',
        code: `console.log(hoisted(2));
function hoisted(n) { return n * 2; }

console.log(notHoisted(2));
const notHoisted = n => n * 2;`,
        output: `4
ReferenceError: Cannot access 'notHoisted' before initialization`,
        explain: 'A `function` declaration is fully ready during the roll call. An arrow stored in a `const` follows `const` rules — it sits in the TDZ until its line runs.',
        explainHi: '`function` declaration attendance ke waqt hi poori taiyar hoti hai. `const` mein rakha arrow `const` ke rules maanta hai — apni line tak TDZ mein baitha rehta hai.',
      },
      {
        title: 'Functions passed as values',
        titleHi: 'Functions ko value ki tarah bhejna',
        code: `const nums = [1, 2, 3, 4];

const doubled = nums.map(n => n * 2);
const evens = nums.filter(n => n % 2 === 0);
const total = nums.reduce((sum, n) => sum + n, 0);

console.log(doubled);
console.log(evens);
console.log(total);`,
        output: `[ 2, 4, 6, 8 ]
[ 2, 4 ]
10`,
        explain: 'In JavaScript a function is just another value you can hand to something else. `map`, `filter` and `reduce` take your little arrow and run it for you.',
        explainHi: 'JavaScript mein function bhi ek value hai jo aap kisi aur ko de sakte ho. `map`, `filter` aur `reduce` aapka chhota arrow lekar khud chalate hain.',
      },
    ],

    mistakes: [
      {
        wrong: `const user = {\n  name: 'Jay',\n  greet: () => \`Hi \${this.name}\`  // ❌ undefined\n};`,
        right: `const user = {\n  name: 'Jay',\n  greet() { return \`Hi \${this.name}\`; }  // ✅ 'Hi Jay'\n};`,
        why: 'An object method needs its own `this`. Arrows never have one, so they borrow from outside the object — where `name` does not exist.',
        whyHi: 'Object method ko apna `this` chahiye. Arrow ke paas kabhi hota hi nahi, isliye wo object ke bahar se udhaar leta hai — jahan `name` hai hi nahi.',
      },
      {
        wrong: `function calc(a, b) {\n  a + b;  // ❌ returns undefined\n}`,
        right: `function calc(a, b) {\n  return a + b;  // ✅\n}`,
        why: 'Forgetting `return` is the single most common beginner bug. The value is computed and thrown straight in the bin.',
        whyHi: '`return` bhoolna beginners ki sabse aam galti hai. Value bankar seedhe kachre mein chali jati hai.',
      },
      {
        wrong: `const Person = (name) => { this.name = name; };\nnew Person('Jay');  // ❌ TypeError`,
        right: `function Person(name) { this.name = name; }\nnew Person('Jay');  // ✅`,
        why: 'Arrow functions cannot be constructors — they have no `this` to build onto. Use a normal function or a `class`.',
        whyHi: 'Arrow functions constructor nahi ban sakte — unke paas banane ke liye `this` hi nahi hota. Normal function ya `class` use karo.',
      },
    ],

    realWorld: [
      {
        en: '**Array work.** `map`, `filter` and `reduce` are used constantly, and a one-line arrow is the natural way to write what each item should become.',
        hi: '**Array ka kaam.** `map`, `filter` aur `reduce` har waqt use hote hain, aur har item ka kya banna hai ye likhne ka natural tarika ek-line ka arrow hai.',
      },
      {
        en: '**React components.** Every event handler and every `useEffect` callback is an arrow, precisely because arrows keep `this` (and the surrounding variables) from the component around them.',
        hi: '**React components.** Har event handler aur har `useEffect` callback arrow hota hai, kyunki arrow apne aas-paas ke component se `this` (aur variables) wahi ka wahi rakhta hai.',
      },
      {
        en: '**Class methods.** A method that reads `this.something` must be a normal function or a class method — never an arrow written as an object literal property.',
        hi: '**Class methods.** Jo method `this.kuch` padhta hai wo normal function ya class method hona chahiye — object literal ki property mein likha arrow kabhi nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a regular function and an arrow function?',
        qHi: 'Regular function aur arrow function mein kya fark hai?',
        a: 'An arrow function has no own `this`, `arguments`, or `prototype`, and cannot be called with `new`. Its `this` is fixed lexically — decided by where the function is written, not by how it is called. A regular function gets its `this` from the call site.',
        aHi: 'Arrow function ka apna `this`, `arguments`, ya `prototype` nahi hota, aur usse `new` ke saath call nahi kar sakte. Uska `this` lexically fix hota hai — function kahan likha hai usse tay hota hai, kaise call hua usse nahi. Regular function ko `this` call site se milta hai.',
      },
      {
        q: 'Why should you not use an arrow function as an object method?',
        qHi: 'Arrow function ko object method kyun nahi banana chahiye?',
        a: 'Because it has no own `this`, it inherits `this` from the enclosing scope — usually the module or `window`, not the object. So `this.property` reads from the wrong place and comes back `undefined`.',
        aHi: 'Kyunki uska apna `this` nahi hota, wo enclosing scope se `this` leta hai — aksar module ya `window`, object nahi. Isliye `this.property` galat jagah se padhta hai aur `undefined` aata hai.',
        code: `const o = { n: 1, bad: () => this.n, good() { return this.n; } };
o.bad();   // undefined
o.good();  // 1`,
      },
      {
        q: 'What is the difference between a function declaration and a function expression?',
        qHi: 'Function declaration aur function expression mein kya fark hai?',
        a: 'A declaration is hoisted completely — both the name and the body — so it can be called before the line it appears on. An expression only assigns the function when that line runs, so calling it earlier throws.',
        aHi: 'Declaration poora hoist hota hai — naam aur body dono — isliye apni line se pehle bhi call ho sakta hai. Expression tabhi assign hota hai jab wo line chalti hai, isliye pehle call karne par error aata hai.',
      },
      {
        q: 'What are rest parameters and how do they differ from `arguments`?',
        qHi: 'Rest parameters kya hain aur `arguments` se kaise alag hain?',
        a: '`...rest` gives you a genuine array containing the remaining arguments, and works in arrow functions. `arguments` is an array-*like* object — it has no array methods and does not exist inside arrows. Prefer rest parameters.',
        aHi: '`...rest` aapko ek asli array deta hai jisme baaki arguments hote hain, aur arrow functions mein bhi chalta hai. `arguments` array-*jaisa* object hai — usme array methods nahi hote aur arrows ke andar wo hota hi nahi. Rest parameters behtar hain.',
      },
    ],

    exercises: [
      {
        task: 'Write `multiply(a, b)` three ways: as a declaration, as a function expression, and as an arrow. Confirm all three return the same answer.',
        taskHi: '`multiply(a, b)` teen tarikon se likho: declaration, function expression, aur arrow. Teeno ka jawab same aata hai ye confirm karo.',
        hint: 'Give them different names — `multiply1`, `multiply2`, `multiply3` — so they do not overwrite each other.',
        hintHi: 'Alag naam do — `multiply1`, `multiply2`, `multiply3` — taaki ek doosre ko overwrite na karein.',
      },
      {
        task: 'Write `greetUser(name, greeting)` where `greeting` defaults to "Hello". Call it with both arguments, then with only the name.',
        taskHi: '`greetUser(name, greeting)` likho jisme `greeting` ka default "Hello" ho. Ise dono arguments ke saath call karo, phir sirf naam ke saath.',
        hint: 'Defaults go in the parameter list: `(name, greeting = "Hello")`.',
        hintHi: 'Default parameter list mein hi likhte hain: `(name, greeting = "Hello")`.',
      },
      {
        task: 'Build an object `wallet` with `balance: 100` and a method `spend(amount)` that subtracts from `this.balance`. Write it once as an arrow and once as a normal method, and log the balance after each to see the difference for yourself.',
        taskHi: 'Ek object `wallet` banao jisme `balance: 100` ho aur ek method `spend(amount)` jo `this.balance` se ghataye. Ek baar arrow se likho aur ek baar normal method se, aur dono ke baad balance log karke fark khud dekho.',
        hint: 'The arrow version will leave the balance untouched at 100. That is the lesson.',
        hintHi: 'Arrow wala version balance ko 100 par hi chhod dega. Yahi seekhne wali baat hai.',
      },
    ],

    keyTakeaways: [
      'A function takes input, does one job, and returns output. No `return` means `undefined`.',
      'Arrow functions are shorter, but the real difference is `this`, not the syntax.',
      '`this` in a normal function is decided by *how it is called*; in an arrow, by *where it is written*.',
      'Object method that uses `this` → normal function. Callback inside a method → arrow.',
      'Declarations are hoisted; expressions and arrows are not.',
    ],
    keyTakeawaysHi: [
      'Function input leta hai, ek kaam karta hai, output return karta hai. `return` nahi to `undefined`.',
      'Arrow functions chhote hain, par asli fark `this` hai, syntax nahi.',
      'Normal function mein `this` tay hota hai *kaise call hua*; arrow mein *kahan likha hai*.',
      'Object method jo `this` use kare → normal function. Method ke andar callback → arrow.',
      'Declarations hoist hote hain; expressions aur arrows nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'async-await-promises',
    title: 'Async/Await and Promises',
    titleHi: 'Async/Await aur Promises',
    description: 'The restaurant token: how JavaScript waits for slow things without freezing.',
    descriptionHi: 'Restaurant ka token: JavaScript slow cheezon ka intezaar bina ruke kaise karta hai.',
    difficulty: 'MEDIUM',
    duration: 35,
    order: 9,

    analogy: {
      en: '**Ordering food at a restaurant.** You order, they hand you a token, and you go sit down. You do not stand frozen at the counter. When the food is ready your number is called. The token is a Promise.',
      hi: '**Restaurant mein khana order karna.** Aap order karte ho, wo token dete hain, aap jaakar baith jate ho. Counter par jam ke khade nahi rehte. Khana ban jaye to aapka number pukara jata hai. Wo token hi Promise hai.',
    },

    simple: `**Ordering food at a restaurant.**

You order a pizza. The counter gives you a **token** and says "we'll call your number".

You do not stand frozen at the counter staring at them. You go sit down and do other things. When the pizza is ready, your number is called.

**That token is a Promise.** It is not the pizza. It is a promise that a pizza is coming.

A token ends in exactly one of three states:

- **pending** — still cooking
- **fulfilled** — pizza arrived 🍕
- **rejected** — "sorry, cheese khatam" ❌

**\`await\` means "I'll wait for my number, but the restaurant keeps running."**

\`\`\`js
const pizza = await orderPizza();
console.log(pizza);
\`\`\`

Read top to bottom, like normal code. But under the hood JavaScript is free to serve other customers while you wait.

**Two rules and you are done:**

1. \`await\` only works inside a function marked \`async\`.
2. Always wrap it in \`try / catch\`, because the kitchen can run out of cheese.

\`\`\`js
async function getPizza() {
  try {
    const pizza = await orderPizza();
    return pizza;
  } catch (err) {
    console.log('Order failed:', err);
  }
}
\`\`\`

**Remember:** the token is not the pizza. \`await\` turns the token into the pizza.`,

    simpleHi: `**Restaurant mein khana order karna.**

Aapne pizza order kiya. Counter aapko ek **token** deta hai aur kehta hai "aapka number pukarenge".

Aap counter par jam ke khade rehkar unhe ghoorte nahi ho. Jaakar baith jate ho, doosre kaam karte ho. Pizza ban jaye to aapka number pukara jata hai.

**Wahi token Promise hai.** Wo pizza nahi hai. Wo waada hai ki pizza aa raha hai.

Token teen mein se exactly ek haalat mein khatam hota hai:

- **pending** — abhi ban raha hai
- **fulfilled** — pizza aa gaya 🍕
- **rejected** — "sorry, cheese khatam" ❌

**\`await\` ka matlab hai "main apne number ka intezaar karunga, par restaurant chalta rahega."**

\`\`\`js
const pizza = await orderPizza();
console.log(pizza);
\`\`\`

Upar se neeche padho, normal code jaisa. Par andar-andar JavaScript aapke intezaar ke dauran doosre customers ko serve karta rehta hai.

**Do rules aur baat khatam:**

1. \`await\` sirf us function mein chalta hai jispar \`async\` likha ho.
2. Hamesha \`try / catch\` mein rakho, kyunki kitchen mein cheese khatam ho sakti hai.

\`\`\`js
async function getPizza() {
  try {
    const pizza = await orderPizza();
    return pizza;
  } catch (err) {
    console.log('Order fail hua:', err);
  }
}
\`\`\`

**Yaad rakho:** token pizza nahi hai. \`await\` token ko pizza bana deta hai.`,

    content: `## The three states

A Promise starts **pending** and settles exactly once — into **fulfilled** or **rejected**. Once settled it never changes again.

## Two ways to read a token

\`\`\`js
// .then() chaining — the older style
orderPizza()
  .then(pizza => console.log(pizza))
  .catch(err => console.log(err));

// async/await — the same thing, read top to bottom
try {
  const pizza = await orderPizza();
  console.log(pizza);
} catch (err) {
  console.log(err);
}
\`\`\`

Both are correct. \`async/await\` is preferred because it reads like ordinary code.

## Sequential vs parallel — the performance trap

\`\`\`js
// ❌ 3 seconds — each waits for the previous one
const a = await task();  // 1s
const b = await task();  // 1s
const c = await task();  // 1s

// ✅ 1 second — all three start at once
const [a, b, c] = await Promise.all([task(), task(), task()]);
\`\`\`

Only wait sequentially when a later call genuinely needs the earlier result.

## The Promise helpers

| Helper | Settles when | Use it for |
|---|---|---|
| \`Promise.all\` | all succeed, or **any** fails | you need every result |
| \`Promise.allSettled\` | all finish, pass or fail | you want partial results |
| \`Promise.race\` | the first one settles | timeouts |
| \`Promise.any\` | the first one **succeeds** | mirrors / fallbacks |`,

    contentHi: `## Teen states

Promise **pending** se shuru hota hai aur exactly ek baar settle hota hai — **fulfilled** ya **rejected** mein. Ek baar settle ho gaya to phir kabhi nahi badalta.

## Token padhne ke do tarike

\`\`\`js
// .then() chaining — purana style
orderPizza()
  .then(pizza => console.log(pizza))
  .catch(err => console.log(err));

// async/await — wahi cheez, upar se neeche padhne wali
try {
  const pizza = await orderPizza();
  console.log(pizza);
} catch (err) {
  console.log(err);
}
\`\`\`

Dono sahi hain. \`async/await\` behtar mana jata hai kyunki wo aam code jaisa padhta hai.

## Sequential vs parallel — performance ka jaal

\`\`\`js
// ❌ 3 second — har ek pichle ka intezaar karta hai
const a = await task();  // 1s
const b = await task();  // 1s
const c = await task();  // 1s

// ✅ 1 second — teeno ek saath shuru
const [a, b, c] = await Promise.all([task(), task(), task()]);
\`\`\`

Sequential intezaar tabhi karo jab baad wali call ko pehle ka result sach mein chahiye.

## Promise ke helpers

| Helper | Kab settle hota hai | Kis kaam ke liye |
|---|---|---|
| \`Promise.all\` | sab safal, ya **koi ek** fail | har result chahiye |
| \`Promise.allSettled\` | sab khatam, pass ho ya fail | partial results chahiye |
| \`Promise.race\` | jo pehle settle ho | timeouts |
| \`Promise.any\` | jo pehle **safal** ho | mirrors / fallbacks |`,

    examples: [
      {
        title: 'Synchronous code blocks everything',
        titleHi: 'Synchronous code sab rok deta hai',
        code: `console.log('1. Order placed');

// Pretend this takes 3 seconds and freezes everything
const start = Date.now();
while (Date.now() - start < 3000) {}

console.log('2. Pizza ready');
console.log('3. Next customer');`,
        output: `1. Order placed
(3 seconds of a completely frozen page)
2. Pizza ready
3. Next customer`,
        explain: 'This is standing frozen at the counter. Nothing else can happen — in a browser, even clicks stop working. This is exactly what Promises exist to avoid.',
        explainHi: 'Ye counter par jam ke khade rehna hai. Aur kuch nahi ho sakta — browser mein clicks tak band ho jate hain. Promises isi se bachne ke liye bane hain.',
      },
      {
        title: 'A Promise hands you a token instantly',
        titleHi: 'Promise turant token de deta hai',
        code: `console.log('1. Order placed');

const token = new Promise(resolve => {
  setTimeout(() => resolve('🍕 Pizza'), 3000);
});

console.log('2. Token in hand:', token);
console.log('3. Next customer');

token.then(pizza => console.log('4. Got:', pizza));`,
        output: `1. Order placed
2. Token in hand: Promise { <pending> }
3. Next customer
4. Got: 🍕 Pizza`,
        explain: 'Look at the order. Line 3 runs *before* the pizza arrives. That is the whole benefit — the queue kept moving.',
        explainHi: 'Order dekho. Line 3 pizza aane se *pehle* chalti hai. Yahi poora fayda hai — queue chalti rahi.',
      },
      {
        title: 'await turns the token into the pizza',
        titleHi: 'await token ko pizza bana deta hai',
        code: `function orderPizza() {
  return new Promise(resolve => {
    setTimeout(() => resolve('🍕 Pizza'), 1000);
  });
}

async function dinner() {
  console.log('Ordering...');
  const pizza = await orderPizza();
  console.log('Got:', pizza);
}

dinner();`,
        output: `Ordering...
Got: 🍕 Pizza`,
        explain: 'No `.then()`, no nesting. It reads exactly like normal top-to-bottom code — but only `dinner()` pauses, not the whole program.',
        explainHi: 'Na `.then()`, na nesting. Bilkul normal upar-se-neeche code jaisa padhta hai — par sirf `dinner()` rukta hai, poora program nahi.',
      },
      {
        title: 'When the kitchen runs out of cheese',
        titleHi: 'Jab kitchen mein cheese khatam ho jaye',
        code: `function orderPizza() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Cheese khatam')), 1000);
  });
}

async function dinner() {
  try {
    const pizza = await orderPizza();
    console.log('Got:', pizza);
  } catch (err) {
    console.log('Failed:', err.message);
  }
}

dinner();`,
        output: `Failed: Cheese khatam`,
        explain: 'A rejected Promise throws at the `await` line. `try/catch` catches it exactly like a normal error. Without the `try/catch` you get an unhandled rejection.',
        explainHi: 'Rejected Promise `await` wali line par throw karta hai. `try/catch` usse normal error ki tarah pakad leta hai. `try/catch` na ho to unhandled rejection milta hai.',
      },
      {
        title: 'The sequential trap — 3 seconds',
        titleHi: 'Sequential jaal — 3 second',
        code: `const task = (name, ms) =>
  new Promise(r => setTimeout(() => r(name), ms));

async function slow() {
  console.time('slow');
  const a = await task('A', 1000);
  const b = await task('B', 1000);
  const c = await task('C', 1000);
  console.timeEnd('slow');
  console.log(a, b, c);
}

slow();`,
        output: `slow: 3005ms
A B C`,
        explain: 'Three independent tasks took 3 seconds because each one politely waited for the last. Nothing here actually needed to wait.',
        explainHi: 'Teen alag-alag kaam 3 second le gaye kyunki har ek pichle ka intezaar karta raha. Yahan kisi ko sach mein rukne ki zarurat thi hi nahi.',
      },
      {
        title: 'Promise.all — 1 second',
        titleHi: 'Promise.all — 1 second',
        code: `const task = (name, ms) =>
  new Promise(r => setTimeout(() => r(name), ms));

async function fast() {
  console.time('fast');
  const [a, b, c] = await Promise.all([
    task('A', 1000),
    task('B', 1000),
    task('C', 1000),
  ]);
  console.timeEnd('fast');
  console.log(a, b, c);
}

fast();`,
        output: `fast: 1004ms
A B C`,
        explain: 'Same work, same result, one third of the time. All three orders went to the kitchen together. This is the single most valuable optimisation in async code.',
        explainHi: 'Wahi kaam, wahi result, ek tihai time. Teeno order ek saath kitchen gaye. Async code ka sabse kaam ka optimisation yahi hai.',
      },
      {
        title: 'Fetching real data',
        titleHi: 'Asli data fetch karna',
        code: `async function getUser(id) {
  try {
    const res = await fetch(\`https://api.example.com/users/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    console.error('Could not load user:', err.message);
    return null;
  }
}`,
        output: `{ id: 1, name: 'Jay' }   // or null if it failed`,
        explain: 'Two awaits: one for the response headers, one for the body. Note the `res.ok` check — `fetch` does NOT reject on 404 or 500, so you must check it yourself.',
        explainHi: 'Do await: ek response headers ke liye, ek body ke liye. `res.ok` check dhyan se dekho — `fetch` 404 ya 500 par reject NAHI karta, isliye khud check karna padta hai.',
      },
      {
        title: 'Promise.allSettled — when some may fail',
        titleHi: 'Promise.allSettled — jab kuch fail ho sakte hain',
        code: `const ok = Promise.resolve('worked');
const bad = Promise.reject(new Error('broke'));

const results = await Promise.allSettled([ok, bad]);
console.log(results);`,
        output: `[
  { status: 'fulfilled', value: 'worked' },
  { status: 'rejected', reason: Error: broke }
]`,
        explain: '`Promise.all` would have thrown the moment `bad` failed and lost the good result. `allSettled` waits for everything and reports each outcome — use it when partial success is still useful.',
        explainHi: '`Promise.all` `bad` ke fail hote hi throw kar deta aur achha result kho deta. `allSettled` sabka intezaar karke har ek ka nateeja batata hai — jab aadha success bhi kaam ka ho to yahi use karo.',
      },
    ],

    mistakes: [
      {
        wrong: `const data = getUser(1);\nconsole.log(data.name);  // ❌ undefined`,
        right: `const data = await getUser(1);\nconsole.log(data.name);  // ✅`,
        why: 'Without `await` you are holding the token, not the pizza. Reading `.name` off a Promise gives `undefined`.',
        whyHi: 'Bina `await` ke aapke haath mein token hai, pizza nahi. Promise par `.name` padhne se `undefined` milta hai.',
      },
      {
        wrong: `const a = await taskA();\nconst b = await taskB();  // ❌ 2s, and b never needed a`,
        right: `const [a, b] = await Promise.all([taskA(), taskB()]);  // ✅ 1s`,
        why: 'Independent calls should start together. Only await in sequence when the second genuinely needs the first one\'s result.',
        whyHi: 'Alag-alag calls ek saath shuru honi chahiye. Sequence mein tabhi await karo jab doosre ko pehle ka result sach mein chahiye.',
      },
      {
        wrong: `const res = await fetch(url);\nreturn res.json();  // ❌ no error handling at all`,
        right: `try {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error(res.status);\n  return await res.json();\n} catch (e) { return null; }`,
        why: '`fetch` only rejects on network failure — a 404 or 500 still "succeeds". Check `res.ok` and wrap in `try/catch`.',
        whyHi: '`fetch` sirf network fail hone par reject karta hai — 404 ya 500 phir bhi "success" hai. `res.ok` check karo aur `try/catch` mein rakho.',
      },
      {
        wrong: `items.forEach(async (i) => { await save(i); });\nconsole.log('done');  // ❌ prints before any save finishes`,
        right: `await Promise.all(items.map(i => save(i)));\nconsole.log('done');  // ✅`,
        why: '`forEach` ignores the Promise your async callback returns, so it never waits. Use `map` + `Promise.all`, or a plain `for...of` loop.',
        whyHi: '`forEach` aapke async callback ka Promise ignore kar deta hai, isliye intezaar karta hi nahi. `map` + `Promise.all` use karo, ya simple `for...of` loop.',
      },
    ],

    realWorld: [
      {
        en: '**Every API call.** Loading a user profile, submitting a form, saving a draft — all of it is a Promise, all of it uses `await`.',
        hi: '**Har API call.** User profile load karna, form submit karna, draft save karna — sab Promise hai, sab `await` use karta hai.',
      },
      {
        en: '**Dashboard loading.** A dashboard needing user + orders + notifications should fire all three with `Promise.all`, not one after another. This is often the difference between a 3-second and a 1-second page.',
        hi: '**Dashboard load karna.** Jis dashboard ko user + orders + notifications chahiye wo teeno `Promise.all` se ek saath bheje, ek ke baad ek nahi. Aksar 3-second aur 1-second page ka fark yahi hota hai.',
      },
      {
        en: '**Timeouts.** `Promise.race([fetchData(), timeout(5000)])` gives up on a slow server instead of leaving the user staring at a spinner forever.',
        hi: '**Timeouts.** `Promise.race([fetchData(), timeout(5000)])` slow server ko chhod deta hai, warna user hamesha spinner hi dekhta rehta.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a Promise and what are its states?',
        qHi: 'Promise kya hai aur uske states kya hain?',
        a: 'A Promise is an object representing a value that is not available yet. It starts pending and settles exactly once — into fulfilled (with a value) or rejected (with a reason). Once settled, its state and value never change.',
        aHi: 'Promise ek object hai jo aisi value represent karta hai jo abhi available nahi hai. Wo pending se shuru hota hai aur exactly ek baar settle hota hai — fulfilled (value ke saath) ya rejected (reason ke saath). Settle hone ke baad uski state aur value kabhi nahi badalti.',
      },
      {
        q: 'What is the difference between `Promise.all` and `Promise.allSettled`?',
        qHi: '`Promise.all` aur `Promise.allSettled` mein kya fark hai?',
        a: '`Promise.all` rejects immediately if any input rejects, discarding the other results — use it when you need all of them. `Promise.allSettled` always waits for every promise and returns an array of `{status, value|reason}` — use it when partial success is still useful.',
        aHi: '`Promise.all` koi bhi input reject hote hi turant reject ho jata hai aur baaki results chhod deta hai — jab sab chahiye tab ise use karo. `Promise.allSettled` hamesha har promise ka intezaar karta hai aur `{status, value|reason}` ka array deta hai — jab aadha success bhi kaam ka ho tab ise use karo.',
      },
      {
        q: 'Does `await` block the whole program?',
        qHi: 'Kya `await` poore program ko rok deta hai?',
        a: 'No. It only suspends the `async` function it sits in. The call stack unwinds and the event loop continues handling other work — timers, clicks, other requests. This is the key difference from a blocking loop.',
        aHi: 'Nahi. Wo sirf us `async` function ko rokta hai jisme wo likha hai. Call stack khali ho jata hai aur event loop baaki kaam chalata rehta hai — timers, clicks, doosri requests. Blocking loop se yahi asli fark hai.',
        code: `async function f() { await sleep(1000); }
f();
console.log('runs immediately, not after 1s');`,
      },
      {
        q: 'Why does `forEach` with an async callback not wait?',
        qHi: '`forEach` async callback ke saath intezaar kyun nahi karta?',
        a: '`forEach` calls your function and throws away the returned value. Your async callback returns a Promise, which `forEach` discards, so the loop finishes immediately while the work is still running. Use `for...of` with `await`, or `map` + `Promise.all`.',
        aHi: '`forEach` aapka function call karke return value phenk deta hai. Aapka async callback Promise return karta hai, jise `forEach` chhod deta hai, isliye loop turant khatam ho jata hai jabki kaam abhi chal raha hota hai. `for...of` ke saath `await` use karo, ya `map` + `Promise.all`.',
      },
      {
        q: 'How would you add a timeout to a fetch?',
        qHi: 'Fetch par timeout kaise lagaoge?',
        a: 'Race the fetch against a promise that rejects after N milliseconds. Whichever settles first wins, so a slow server loses to the timeout.',
        aHi: 'Fetch ko ek aise promise ke saath race karao jo N millisecond baad reject ho. Jo pehle settle hota hai wo jeetta hai, isliye slow server timeout se haar jata hai.',
        code: `const timeout = ms =>
  new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));

const data = await Promise.race([fetch(url), timeout(5000)]);`,
      },
    ],

    exercises: [
      {
        task: 'Write a `sleep(ms)` function that returns a Promise resolving after `ms` milliseconds. Then use it in an async function to log "start", wait 2 seconds, and log "end".',
        taskHi: 'Ek `sleep(ms)` function likho jo `ms` millisecond baad resolve hone wala Promise return kare. Phir usse async function mein use karke "start" log karo, 2 second ruko, aur "end" log karo.',
        hint: '`const sleep = ms => new Promise(r => setTimeout(r, ms));`',
        hintHi: '`const sleep = ms => new Promise(r => setTimeout(r, ms));`',
      },
      {
        task: 'Write `loadDashboard()` that fetches a user, their orders, and their notifications. Write it the slow sequential way first, time it, then rewrite with `Promise.all` and compare.',
        taskHi: '`loadDashboard()` likho jo user, unke orders aur notifications fetch kare. Pehle slow sequential tarike se likho, time karo, phir `Promise.all` se dobara likho aur compare karo.',
        hint: 'Use `console.time("label")` and `console.timeEnd("label")` to measure both versions.',
        hintHi: 'Dono versions naapne ke liye `console.time("label")` aur `console.timeEnd("label")` use karo.',
      },
      {
        task: 'Write `safeFetch(url)` that returns the parsed JSON, or `null` if anything goes wrong — network error, non-200 status, or invalid JSON.',
        taskHi: '`safeFetch(url)` likho jo parsed JSON return kare, ya kuch bhi galat hone par `null` — network error, non-200 status, ya galat JSON.',
        hint: 'You need `try/catch` around the whole thing plus an explicit `if (!res.ok)` check inside it.',
        hintHi: 'Poore code ke around `try/catch` chahiye, aur uske andar ek `if (!res.ok)` check bhi.',
      },
    ],

    keyTakeaways: [
      'A Promise is a token for a value that is not ready yet — it is not the value itself.',
      'A Promise settles exactly once: fulfilled or rejected. It never changes after that.',
      '`await` pauses only its own `async` function, never the whole program.',
      'Independent calls belong in `Promise.all` — sequential `await` is the most common performance bug.',
      '`fetch` does not reject on 404 or 500. Check `res.ok` yourself.',
      '`forEach` does not wait for async callbacks. Use `for...of` or `map` + `Promise.all`.',
    ],
    keyTakeawaysHi: [
      'Promise us value ka token hai jo abhi taiyar nahi — wo khud value nahi hai.',
      'Promise exactly ek baar settle hota hai: fulfilled ya rejected. Uske baad kabhi nahi badalta.',
      '`await` sirf apne `async` function ko rokta hai, poore program ko kabhi nahi.',
      'Alag-alag calls `Promise.all` mein honi chahiye — sequential `await` sabse aam performance bug hai.',
      '`fetch` 404 ya 500 par reject nahi karta. `res.ok` khud check karo.',
      '`forEach` async callbacks ka intezaar nahi karta. `for...of` ya `map` + `Promise.all` use karo.',
    ],
  },
];
