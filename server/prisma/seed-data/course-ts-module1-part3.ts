/**
 * TypeScript Complete Course — Module 1: Why TypeScript & The Basics, lesson 3.
 *
 * Functions in depth: optional/default/rest params, explicit return types,
 * and function TYPES (a type describing a function's shape, used to type a
 * callback parameter). The broken example is a callback parameter with no
 * type at all — every parameter inside it silently becomes `any`, so a typo
 * in a callback's own parameter usage goes uncaught even though the
 * surrounding function IS otherwise typed.
 *
 * `output` is used (not `preview`) — see course-ts-module1.ts's header note
 * for why.
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

export const TS_MODULE_1_PART3: CourseLesson[] = [
  {
    slug: 'functions-in-depth',
    title: 'Functions in Depth',
    titleHi: 'Functions Gehrai Se',
    description: 'A typo inside a callback that TypeScript never catches — because the callback parameter itself was never given a type.',
    descriptionHi: 'Ek callback ke andar typo jo TypeScript kabhi nahi pakadta — kyunki callback parameter ko khud kabhi type diya hi nahi gaya.',
    difficulty: 'EASY',
    duration: 28,
    order: 3,

    analogy: {
      en: '**A job posting with a vague duty versus one with a detailed job description.** "Handles customer issues" tells a new hire almost nothing about what they will actually be asked to do each day — they find out by doing the job and making mistakes along the way. A detailed job description — exact duties, exact tools, exact expected outcomes — lets a manager check on day one whether the person is even qualified for the role, before a single mistake happens on a real customer. An untyped callback parameter is the vague posting: the function that RECEIVES it has no idea what shape it should have, so nothing is checked until it actually runs.',
      hi: '**Halki-si duty wali job posting aur detailed job description wali posting.** "Customer issues handle karta hai" ek naye hire ko lagbhag kuch nahi batata ki use har din asal mein kya karne ko kaha jayega — use pata tab chalta hai jab wo kaam karta hai aur raaste mein galtiyan karta hai. Detailed job description — exact duties, exact tools, exact expected outcomes — ek manager ko pehle din check karne deti hai ki vyakti role ke liye qualified bhi hai ya nahi, asli customer par ek bhi galti hone se pehle. Untyped callback parameter wahi halki posting hai: jo function use RECEIVE karta hai use pata hi nahi ki uski shape kya honi chahiye, isliye jab tak wo asal mein chale kuch check nahi hota.',
    },

    simple: `**Start broken.** A helper that runs a callback for each item, with no type on the callback at all:

\`\`\`ts
function processAll(items: number[], callback) {
  for (const item of items) {
    callback(item);
  }
}

processAll([1, 2, 3], function (n) {
  console.log(n.toUpperCase());   // "n" is a number — .toUpperCase() does not exist on numbers
});
\`\`\`

This compiles without a single error, and then crashes the instant it runs: \`n.toUpperCase is not a function\`. The bug is not that TypeScript is weak here — it is that \`callback\` was never given a type, so TypeScript silently treated it, and everything about it, as \`any\`. An untyped parameter is a hole in the type system exactly where you put it, and the compiler cannot warn about a mistake inside something it was never told the shape of.

**Give the callback a function type, and the hole closes**

\`\`\`ts
function processAll(items: number[], callback: (item: number) => void): void {
  for (const item of items) {
    callback(item);
  }
}

processAll([1, 2, 3], function (n) {
  console.log(n.toUpperCase());   // Error: Property 'toUpperCase' does not exist on type 'number'.
});
\`\`\`

\`(item: number) => void\` is a **function type**: it describes a function that takes one \`number\` parameter and returns nothing meaningful (\`void\`). Once \`callback\` has this type, TypeScript now knows that inside the function you pass in, \`n\` must be a \`number\` — and it checks every line of that callback's body against that promise, the same way it checks any other typed parameter.

**Optional and default parameters — two different answers to "what if it's not given"**

\`\`\`ts
function greet(name: string, greeting?: string): string {
  return \`\${greeting ?? "Hello"}, \${name}!\`;
}

greet("Priya");                  // "Hello, Priya!"
greet("Priya", "Namaste");        // "Namaste, Priya!"
\`\`\`

\`\`\`ts
function greet(name: string, greeting: string = "Hello"): string {
  return \`\${greeting}, \${name}!\`;
}
\`\`\`

\`greeting?: string\` means the argument may be entirely omitted, and inside the function its type is \`string | undefined\` — you must handle the missing case yourself, as the earlier lesson on optional object properties covered. \`greeting: string = "Hello"\` means the same "may be omitted", but TypeScript fills in the default value automatically when it is, so inside the function \`greeting\` is simply \`string\`, never \`undefined\` — no manual \`??\` needed, because the default already resolved it.

**Rest parameters — an unknown number of extra arguments, typed as one array**

\`\`\`ts
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3, 4);   // 10 — any number of arguments, all checked as numbers
sum(1, "2");        // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
\`\`\`

\`...numbers: number[]\` collects every remaining argument into a single typed array — this is how a function like \`Math.max\` accepts any number of arguments while every one of them is still checked against the same type.

**Remember:** a parameter with no type is not "flexible" — it is a hole where TypeScript stops checking entirely, and a function type on a callback closes that hole the same way an annotation closes it on any other parameter.`,

    simpleHi: `**Toote hue se shuru.** Ek helper jo har item ke liye callback chalata hai, callback par bilkul koi type nahi:

\`\`\`ts
function processAll(items: number[], callback) {
  for (const item of items) {
    callback(item);
  }
}

processAll([1, 2, 3], function (n) {
  console.log(n.toUpperCase());   // "n" ek number hai — numbers par .toUpperCase() hota hi nahi
});
\`\`\`

Ye ek bhi error ke bina compile hota hai, aur phir chalte hi crash karta hai: \`n.toUpperCase is not a function\`. Bug ye nahi hai ki TypeScript yahan kamzor hai — bug ye hai ki \`callback\` ko kabhi type diya hi nahi gaya, isliye TypeScript ne chupchap ise, aur uske baare mein har cheez ko, \`any\` maan liya. Untyped parameter type system mein ek chhed hai bilkul wahin jahan aap use daalte ho, aur compiler kisi aisi cheez ke andar hui galti par warn nahi kar sakta jiski shape use kabhi batayi hi nahi gayi.

**Callback ko function type do, aur chhed band ho jata hai**

\`\`\`ts
function processAll(items: number[], callback: (item: number) => void): void {
  for (const item of items) {
    callback(item);
  }
}

processAll([1, 2, 3], function (n) {
  console.log(n.toUpperCase());   // Error: Property 'toUpperCase' does not exist on type 'number'.
});
\`\`\`

\`(item: number) => void\` ek **function type** hai: ye ek aisa function batata hai jo ek \`number\` parameter leta hai aur koi matlab wali cheez nahi lautaata (\`void\`). Ek baar \`callback\` ke paas ye type ho jaye, TypeScript ab jaanta hai ki jo function aap paas karte ho uske andar, \`n\` \`number\` hona chahiye — aur wo us function ke body ki har line ko us wachan ke hisaab se check karta hai, bilkul waise jaise wo kisi bhi doosre typed parameter ko check karta.

**Optional aur default parameters — "agar wo diya na jaye to" ke do alag jawab**

\`\`\`ts
function greet(name: string, greeting?: string): string {
  return \`\${greeting ?? "Hello"}, \${name}!\`;
}

greet("Priya");                  // "Hello, Priya!"
greet("Priya", "Namaste");        // "Namaste, Priya!"
\`\`\`

\`\`\`ts
function greet(name: string, greeting: string = "Hello"): string {
  return \`\${greeting}, \${name}!\`;
}
\`\`\`

\`greeting?: string\` ka matlab hai argument poori tarah chhoda ja sakta hai, aur function ke andar uska type \`string | undefined\` hai — aapko missing case khud sambhaalna hai, jaise pichle lesson mein optional object properties ke saath tha. \`greeting: string = "Hello"\` ka matlab bhi wahi "chhoda ja sakta hai" hai, par TypeScript jab wo chhoda jaye to apne aap default value bhar deta hai, isliye function ke andar \`greeting\` bas \`string\` hai, kabhi \`undefined\` nahi — koi haath se \`??\` ki zarurat nahi, kyunki default pehle hi use suljhaa chuka.

**Rest parameters — extra arguments ki anishit ginti, ek array ki tarah typed**

\`\`\`ts
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3, 4);   // 10 — kitne bhi arguments, sab numbers ki tarah check hote hue
sum(1, "2");        // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
\`\`\`

\`...numbers: number[]\` baaki har argument ko ek akele typed array mein ikattha kar deta hai — isi tarike se \`Math.max\` jaisa function kitne bhi arguments qubool karta hai jabki har ek phir bhi usi type ke hisaab se check hota hai.

**Yaad rakho:** bina type wala parameter "flexible" nahi hai — ye ek chhed hai jahan TypeScript checking poori tarah band kar deta hai, aur callback par function type wahi chhed band karta hai jaise annotation kisi bhi doosre parameter par karti hai.`,

    content: `## Parameter and return type annotations

\`\`\`ts
function add(a: number, b: number): number {
  return a + b;
}
\`\`\`

Each parameter needs its own \`: type\`, since TypeScript has no right-hand-side value to infer them from (the earlier lesson covered why). The \`: number\` after the closing parenthesis is the **return type** — usually TypeScript can infer this automatically from the function body, but writing it explicitly catches a mistake at the function's own definition rather than only at every call site.

\`\`\`ts
function double(n: number) {
  return n * 2;   // inferred return type: number — TypeScript worked this out on its own
}

function broken(n: number): number {
  return n.toString();   // Error, caught HERE: Type 'string' is not assignable to type 'number'.
}
\`\`\`

Without an explicit return type, a function whose body accidentally returns the wrong thing still gets a type — just the *wrong* one, silently inferred from the mistake — and the error only shows up later, at whatever call site expected the correct type. Writing the return type explicitly on any function with meaningful logic is a small habit that moves the error to the one place it is easiest to fix: right next to the bug itself.

## void — the return type for "nothing meaningful"

\`\`\`ts
function logMessage(msg: string): void {
  console.log(msg);
  // no return statement — or "return;" with no value — is fine for void
}

function broken(): void {
  return 42;   // Error: Type 'number' is not assignable to type 'void'.
}
\`\`\`

\`void\` means "this function is not meant to return a usable value" — it is TypeScript's way of expressing a function that exists purely for its side effects (logging, mutating something, sending a network request) rather than for the value it produces.

## Optional parameters (\`?\`) versus default parameters (\`= value\`)

\`\`\`ts
function greet(name: string, greeting?: string): string {
  // greeting's type here is: string | undefined
  return \`\${greeting ?? "Hello"}, \${name}!\`;
}

function greet2(name: string, greeting: string = "Hello"): string {
  // greeting's type here is: string — NEVER undefined, because the default already resolved it
  return \`\${greeting}, \${name}!\`;
}
\`\`\`

Both allow the argument to be omitted at the call site, but they differ in what happens inside the function body. An optional parameter genuinely can be \`undefined\` inside the function, and TypeScript requires you to account for that. A default parameter is guaranteed to already have a real value by the time the function body runs — TypeScript itself inserts the default before your code executes — so there is no \`undefined\` case to handle at all.

**Rule:** optional parameters and parameters with defaults must come after all required parameters, because JavaScript resolves arguments by position, and a required parameter after an optional one would be unreachable by any normal call.

\`\`\`ts
function bad(greeting?: string, name: string) { }   // Error: A required parameter cannot follow an optional parameter.
\`\`\`

## Rest parameters

\`\`\`ts
function sum(first: number, ...rest: number[]): number {
  return rest.reduce((total, n) => total + n, first);
}

sum(1);           // 1
sum(1, 2, 3, 4);   // 10
\`\`\`

A rest parameter (\`...name: type[]\`) must be the last parameter in the list, and collects every argument from that position onward into a single array of the declared type. It is the correct tool whenever a function should genuinely accept "any number of these", as opposed to a fixed set of optional slots.

## Function types — describing the SHAPE of a function as a type

\`\`\`ts
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

const broken: MathOperation = (a, b) => \`\${a}\${b}\`;   // Error: Type 'string' is not assignable to type 'number'.
\`\`\`

A function type describes what parameters a function accepts and what it returns, without providing an implementation — \`(a: number, b: number) => number\` is read as "a function taking two numbers and returning a number". Once \`add\` and \`multiply\` are declared with this type, TypeScript checks their actual implementations against it, and — crucially — because \`add\` and \`multiply\` already have a declared type, their own parameters \`a\` and \`b\` do not need their own explicit \`: number\` annotations; TypeScript infers them from the surrounding function type. This is called **contextual typing**.

## Typing a callback parameter — the fix for this lesson's broken example

\`\`\`ts
function processAll(items: number[], callback: (item: number) => void): void {
  for (const item of items) {
    callback(item);
  }
}

processAll([1, 2, 3], (n) => console.log(n * 2));   // "n" is inferred as number, contextually, from the function type
\`\`\`

The callback parameter's type, \`(item: number) => void\`, is exactly the same kind of function type as the standalone \`MathOperation\` example above — it just happens to live inline, as one parameter's type, rather than being given its own name. Once it is there, every callback passed to \`processAll\` is checked against it, both for what it accepts and, contextually, what its own inner parameter's type must be.

## Function overloads — briefly, for recognition

\`\`\`ts
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;
function makeDate(yearOrTimestamp: number, month?: number, day?: number): Date {
  if (month !== undefined && day !== undefined) {
    return new Date(yearOrTimestamp, month, day);
  }
  return new Date(yearOrTimestamp);
}
\`\`\`

Overload signatures let a single function name accept genuinely different call shapes with different, more precise type checking for each — this is presented here only for recognition when reading library code; writing your own overloads is a more advanced technique this course does not require yet.`,

    contentHi: `## Parameter aur return type annotations

\`\`\`ts
function add(a: number, b: number): number {
  return a + b;
}
\`\`\`

Har parameter ko apna \`: type\` chahiye, kyunki TypeScript ke paas unhe infer karne ke liye koi dayein-taraf ki value nahi hai (pichle lesson mein wajah cover hui). Closing parenthesis ke baad ka \`: number\` **return type** hai — aksar TypeScript ise function body se apne aap infer kar sakta hai, par use seedha likhna galti ko sirf har call site par pakadne ke bajaye function ki apni definition par hi pakad leta hai.

\`\`\`ts
function double(n: number) {
  return n * 2;   // infer hua return type: number — TypeScript ne ise khud nikaal liya
}

function broken(n: number): number {
  return n.toString();   // Error, YAHIN pakda: Type 'string' is not assignable to type 'number'.
}
\`\`\`

Seedha return type ke bina, ek function jiska body galti se galat cheez lautaata hai use bhi ek type milta hai — bas *galat* type, chupchap galti se infer hua — aur error sirf baad mein dikhta hai, jahan bhi call site sahi type expect kar rahi thi. Kisi bhi matlab wale logic wale function par return type seedha likhna ek chhoti aadat hai jo error ko us ek jagah le aati hai jahan theek karna sabse aasan hai: bug ke bilkul bagal.

## void — "koi matlab wali cheez nahi" ke liye return type

\`\`\`ts
function logMessage(msg: string): void {
  console.log(msg);
  // koi return statement nahi — ya "return;" bina value ke — void ke liye theek hai
}

function broken(): void {
  return 42;   // Error: Type 'number' is not assignable to type 'void'.
}
\`\`\`

\`void\` ka matlab hai "is function ka matlab kaam ki value lautaana nahi hai" — ye TypeScript ka tarika hai us function ko bataane ka jo poori tarah apne side effects (logging, kuch badalna, network request bhejna) ke liye hai, apne banaaye hue value ke liye nahi.

## Optional parameters (\`?\`) aur default parameters (\`= value\`)

\`\`\`ts
function greet(name: string, greeting?: string): string {
  // yahan greeting ka type hai: string | undefined
  return \`\${greeting ?? "Hello"}, \${name}!\`;
}

function greet2(name: string, greeting: string = "Hello"): string {
  // yahan greeting ka type hai: string — KABHI undefined nahi, kyunki default pehle hi suljhaa chuka
  return \`\${greeting}, \${name}!\`;
}
\`\`\`

Dono call site par argument chhodne dete hain, par function body ke andar kya hota hai usme fark hai. Optional parameter function ke andar sach mein \`undefined\` ho sakta hai, aur TypeScript aapko iska hisaab rakhna zaruri karta hai. Default parameter ke paas function body chalne tak pakka ek asli value hoti hai — TypeScript khud aapke code chalne se pehle default daal deta hai — isliye \`undefined\` wali sthiti sambhalne ko hai hi nahi.

**Niyam:** optional parameters aur default wale parameters saare zaruri parameters ke baad hi aane chahiye, kyunki JavaScript arguments ko position se suljhaata hai, aur optional ke baad zaruri parameter kisi bhi normal call se pahuncha hi nahi ja sakega.

\`\`\`ts
function bad(greeting?: string, name: string) { }   // Error: A required parameter cannot follow an optional parameter.
\`\`\`

## Rest parameters

\`\`\`ts
function sum(first: number, ...rest: number[]): number {
  return rest.reduce((total, n) => total + n, first);
}

sum(1);           // 1
sum(1, 2, 3, 4);   // 10
\`\`\`

Rest parameter (\`...name: type[]\`) list mein aakhri parameter hona chahiye, aur us position se aage har argument ko declare kiye type ke ek akele array mein ikattha karta hai. Ye sahi auzaar hai jab bhi function ko sach mein "in ki kitni bhi ginti" qubool karni ho, optional slots ke fixed set ke bajaye.

## Function types — function ki SHAPE ko type ki tarah bataana

\`\`\`ts
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

const broken: MathOperation = (a, b) => \`\${a}\${b}\`;   // Error: Type 'string' is not assignable to type 'number'.
\`\`\`

Function type batata hai ki function kaunse parameters leta hai aur kya lautaata hai, implementation diye bina — \`(a: number, b: number) => number\` "aisa function jo do numbers leta hai aur ek number lautaata hai" ki tarah padha jata hai. Ek baar \`add\` aur \`multiply\` is type ke saath declare ho jayein, TypeScript unke asli implementations ko uske hisaab se check karta hai, aur — sabse zaruri — kyunki \`add\` aur \`multiply\` ke paas pehle se declared type hai, unke apne parameters \`a\` aur \`b\` ko apna seedha \`: number\` annotation chahiye nahi; TypeScript unhe aas-paas ke function type se infer karta hai. Ise **contextual typing** kehte hain.

## Callback parameter ko type dena — is lesson ke toote example ka fix

\`\`\`ts
function processAll(items: number[], callback: (item: number) => void): void {
  for (const item of items) {
    callback(item);
  }
}

processAll([1, 2, 3], (n) => console.log(n * 2));   // "n" contextually number ki tarah infer hota hai, function type se
\`\`\`

Callback parameter ka type, \`(item: number) => void\`, bilkul upar wale akele \`MathOperation\` udahran jaisa hi function type hai — sirf ye inline rehta hai, ek parameter ke type ki tarah, apna khud ka naam paane ke bajaye. Ek baar wo wahan ho jaye, \`processAll\` ko diya har callback uske hisaab se check hota hai, ye dono ki wo kya qubool karta hai, aur, contextually, uske apne andar wale parameter ka type kya hona chahiye.

## Function overloads — chhote roop mein, pehchaan ke liye

\`\`\`ts
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;
function makeDate(yearOrTimestamp: number, month?: number, day?: number): Date {
  if (month !== undefined && day !== undefined) {
    return new Date(yearOrTimestamp, month, day);
  }
  return new Date(yearOrTimestamp);
}
\`\`\`

Overload signatures ek hi function naam ko sach mein alag call shapes qubool karne dete hain, har ek ke liye alag, zyada theek type checking ke saath — ye yahan sirf library code padhte waqt pehchaan ke liye diya gaya hai; apne khud ke overloads likhna ek zyada advanced technique hai jo ye course abhi zaruri nahi karta.`,

    examples: [
      {
        title: 'The hole: an untyped callback parameter',
        titleHi: 'Chhed: bina-type wala callback parameter',
        code: `function processAll(items: number[], callback) {
  for (const item of items) {
    callback(item);
  }
}

processAll([1, 2, 3], function (n) {
  console.log(n.toUpperCase());
});`,
        output: `// Compiles with ZERO errors, then crashes at runtime:
TypeError: n.toUpperCase is not a function

// "callback" was never given a type, so TypeScript silently treated it —
// and everything about its parameters — as "any". There was nothing to
// check inside a function whose shape was never described.`,
        explain: 'The mistake is entirely inside the callback, on a value TypeScript never knew the type of — an untyped parameter is a hole in the type system exactly where you left it, regardless of how well-typed the surrounding function is.',
        explainHi: 'Galti poori tarah callback ke andar hai, ek aisi value par jiska type TypeScript ko kabhi pata hi nahi tha — bina-type wala parameter type system mein bilkul wahin ek chhed hai jahan aapne use chhoda, chahe aas-paas ka function kitna bhi achha typed ho.',
      },
      {
        title: 'The fix: a function type on the callback closes the hole',
        titleHi: 'Fix: callback par function type chhed band karta hai',
        code: `function processAll(items: number[], callback: (item: number) => void): void {
  for (const item of items) {
    callback(item);
  }
}

processAll([1, 2, 3], function (n) {
  console.log(n.toUpperCase());
});`,
        output: `Error: Property 'toUpperCase' does not exist on type 'number'.

// The exact same runtime bug, caught at compile time, the instant it was
// typed — because "callback"'s parameter is now known to be a number.`,
        explain: 'Nothing about the function\'s implementation changed — only its declared type did — and that alone was enough to make TypeScript check every line inside every callback passed to it.',
        explainHi: 'Function ke implementation mein kuch nahi badla — sirf uska declared type badla — aur akela wahi kaafi tha TypeScript ko is function mein diye gaye har callback ki har line check karne ke liye.',
      },
      {
        title: 'Return type mistakes: inferred versus explicit',
        titleHi: 'Return type ki galtiyan: inferred aur explicit',
        code: `function getUserAge(user) {
  return user.age.toUpperCase();   // typo — should have been user.age.toString()
}

function getUserAge2(user: { age: number }): number {
  return user.age.toUpperCase();
}`,
        output: `// getUserAge: compiles fine — no return type declared, no parameter type
// declared. TypeScript has nothing to check this against, and the mistake
// only surfaces the day this function actually runs on a real user object.

// getUserAge2:
Error: Property 'toUpperCase' does not exist on type 'number'.
// Caught immediately, at the function's own definition.`,
        explain: 'The second version is caught not because TypeScript "tries harder" but because it was given a promise to check against — the parameter type and the return type both — while the first gave it nothing to work with at all.',
        explainHi: 'Doosra version isliye nahi pakda gaya kyunki TypeScript "zyada koshish karta hai" balki isliye kyunki use check karne ke liye ek wachan diya gaya tha — parameter type aur return type dono — jabki pehle ne kaam karne ke liye kuch diya hi nahi.',
      },
      {
        title: 'Optional parameter: undefined must be handled',
        titleHi: 'Optional parameter: undefined sambhaalna zaruri',
        code: `function greet(name: string, greeting?: string): string {
  return greeting.toUpperCase() + ", " + name;
}`,
        output: `Error: 'greeting' is possibly 'undefined'.

// Fixed:
function greet(name: string, greeting?: string): string {
  return (greeting ?? "hello").toUpperCase() + ", " + name;
}`,
        explain: 'Because `greeting?` means "string OR undefined", calling a string-only method directly on it is refused until the undefined case is explicitly accounted for — omitting the argument at a call site is legal, so the function body must be ready for it.',
        explainHi: 'Kyunki \`greeting?\` ka matlab hai "string YA undefined", uspar seedha koi string-only method bulaana tab tak mana kiya jata hai jab tak undefined wali sthiti seedhe sambhaali na jaye — call site par argument chhodna legal hai, isliye function body use taiyaar honi chahiye.',
      },
      {
        title: 'Default parameter: no undefined case at all',
        titleHi: 'Default parameter: undefined wali sthiti hai hi nahi',
        code: `function greet(name: string, greeting: string = "Hello"): string {
  return greeting.toUpperCase() + ", " + name;
}

console.log(greet("Priya"));`,
        output: `HELLO, Priya
// No error, no "?? fallback" needed anywhere. Because "greeting" has a
// default value, TypeScript knows it is ALWAYS a real string by the time
// the function body runs — never undefined — so .toUpperCase() is safe.`,
        explain: 'Unlike the optional-parameter version, no defensive handling was needed here at all — the default value guarantees a real value exists, which TypeScript reflects by giving `greeting` the plain type `string`, not `string | undefined`.',
        explainHi: 'Optional-parameter wale version ke ulat, yahan koi defensive handling ki zarurat nahi thi — default value pakka karta hai ki ek asli value maujood hai, jise TypeScript \`greeting\` ko saadha type \`string\` dekar dikhaata hai, \`string | undefined\` nahi.',
      },
      {
        title: 'Rest parameters checked as a typed array',
        titleHi: 'Rest parameters ek typed array ki tarah check hote hain',
        code: `function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3));
sum(1, "2", 3);`,
        output: `6

// Argument two:
Error: Argument of type 'string' is not assignable to parameter of type 'number'.
// Every one of the (arbitrarily many) arguments is checked individually
// against "number", the type declared for the rest parameter.`,
        explain: 'A rest parameter accepts any COUNT of arguments freely, but every individual argument still has to match the declared element type — the flexibility is in the quantity, not in what each one is allowed to be.',
        explainHi: 'Rest parameter aazaadi se kisi bhi GINTI ke arguments qubool karta hai, par har akela argument phir bhi declare kiye element type se milna chahiye — flexibility ginti mein hai, har ek kya ho sakta hai usme nahi.',
      },
      {
        title: 'A named function type used for multiple implementations',
        titleHi: 'Kai implementations ke liye use hua naamit function type',
        code: `type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;
const broken: MathOperation = (a, b) => \`\${a}+\${b}\`;`,
        output: `Error: Type '(a: number, b: number) => string' is not assignable to type 'MathOperation'.
  Type 'string' is not assignable to type 'number'.

// "add" and "multiply" both compile fine, and their own parameters "a" and
// "b" never needed explicit ": number" — TypeScript inferred them
// CONTEXTUALLY from the MathOperation type each was declared with.`,
        explain: 'A named function type does double duty: it checks conformance for every implementation assigned to it, and it lets each implementation skip re-typing its own parameters, since the surrounding type already says what they must be.',
        explainHi: 'Naamit function type dohra kaam karta hai: ye har us implementation ke liye conformance check karta hai jo use assign hui hai, aur har implementation ko apne parameters dobara type karne se bachaata hai, kyunki aas-paas ka type pehle se batata hai unhe kya hona chahiye.',
      },
      {
        title: 'void versus a mistaken return value',
        titleHi: 'void aur galti se lautaayi hui value',
        code: `function logMessage(msg: string): void {
  console.log(msg);
}

function broken(): void {
  return "done";
}`,
        output: `Error: Type 'string' is not assignable to type 'void'.

// "void" is a promise that the function's return value is not meant to be
// used — this catches a function that was supposed to be a pure side
// effect accidentally starting to return something meaningful.`,
        explain: 'This mistake is subtle precisely because "return \'done\';" looks harmless — void catches the case where a function\'s purpose (logging, a side effect) drifted into also returning a value nobody declared it should.',
        explainHi: 'Ye galti sookshm hai bilkul isliye kyunki "return \'done\';" bekasoor lagta hai — void us sthiti ko pakadta hai jahan function ka maqsad (logging, ek side effect) chupke se value bhi lautaane lagta hai jise kisi ne declare hi nahi kiya tha.',
      },
    ],

    mistakes: [
      {
        wrong: `function processAll(items: number[], callback) {
  for (const item of items) { callback(item); }
}
/* callback has no type — every mistake inside it goes uncaught */`,
        right: `function processAll(items: number[], callback: (item: number) => void): void {
  for (const item of items) { callback(item); }
}`,
        why: 'An untyped parameter is checked as `any`, meaning nothing inside a callback passed to it is verified at all — a function type on the callback parameter closes that hole exactly the way an annotation closes it on any other parameter.',
        whyHi: 'Bina-type wala parameter \`any\` ki tarah check hota hai, matlab use diye gaye callback ke andar kuch bhi verify nahi hota — callback parameter par function type wo chhed bilkul waise band karta hai jaise annotation kisi bhi doosre parameter par karti hai.',
      },
      {
        wrong: `function greet(name: string, greeting?: string) {
  return greeting.toUpperCase() + ", " + name;   // crashes if greeting is omitted
}`,
        right: `function greet(name: string, greeting: string = "Hello") {
  return greeting.toUpperCase() + ", " + name;   // always a real string — default guarantees it
}`,
        why: 'When the missing value has one obvious sensible default, a default parameter removes the need to defensively check for undefined every time the value is used — the check happens once, at the function boundary, instead of at every usage site.',
        whyHi: 'Jab missing value ke liye ek saaf samajh mein aane wala default ho, to default parameter har baar value use karte waqt defensive undefined check ki zarurat hata deta hai — check ek baar hota hai, function ki seema par, har istemal ki jagah par nahi.',
      },
      {
        wrong: `function broken(): void {
  return "unexpected";   // a side-effect function accidentally grew a return value
}`,
        right: `function broken(): void {
  console.log("unexpected");   // no return — matches its declared void intent
}`,
        why: 'Declaring `void` on a function that is meant purely for side effects catches the moment its implementation drifts into also returning a value, which is a sign the function\'s responsibility quietly changed without the type being updated to match.',
        whyHi: 'Poori tarah side effects ke liye bane function par \`void\` declare karna wo pal pakadta hai jab uska implementation chupke se value bhi lautaane lagta hai, jo ishaara hai ki function ki zimmedari chupchap badal gayi bina type ko milaane ke liye update kiye.',
      },
    ],

    realWorld: [
      {
        en: '**Every array method callback in a typed codebase — `.map`, `.filter`, `.forEach` — relies on function types.** TypeScript already knows the element type of the array, so it contextually infers your callback parameter\'s type without you writing it, which is exactly the mechanism this lesson\'s `MathOperation` example demonstrated manually.',
        hi: '**Typed codebase mein har array method callback — \`.map\`, \`.filter\`, \`.forEach\` — function types par nirbhar hai.** TypeScript ko array ka element type pehle se pata hai, isliye wo aapke callback parameter ka type bina aapke likhe contextually infer kar leta hai, bilkul wahi tarika jo is lesson ke \`MathOperation\` example ne haath se dikhaya.',
      },
      {
        en: '**React event handler props are function types.** A component prop typed `onClick: (event: MouseEvent) => void` is precisely how a parent component and a child component agree on the exact shape of a callback passed between files, with the compiler enforcing that agreement.',
        hi: '**React event handler props function types hain.** \`onClick: (event: MouseEvent) => void\` type wala component prop bilkul wahi tarika hai jisse parent component aur child component files ke beech pass hote callback ki exact shape par sahmat hote hain, compiler us sahmati ko lagu karte hue.',
      },
      {
        en: '**Optional configuration objects almost always use default parameters.** A function like `createServer(options: { port?: number } = {})` lets every caller omit the whole config object entirely, falling back to sensible defaults, without a single manual undefined check anywhere in the function body.',
        hi: '**Optional configuration objects lagbhag hamesha default parameters use karte hain.** \`createServer(options: { port?: number } = {})\` jaisa function har caller ko poora config object hi chhodne deta hai, sensible defaults par gir kar, function body mein kahin bhi ek bhi haath se undefined check kiye bina.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can an untyped callback parameter cause TypeScript to miss a bug even inside an otherwise fully-typed function?',
        qHi: 'Bina-type wala callback parameter TypeScript se ek bug kyun chhupa sakta hai us function ke andar bhi jo baaki poori tarah typed hai?',
        a: 'When a parameter has no declared type, TypeScript treats it — and every value derived from it, including its own parameters if it is a function — as `any`, which disables checking for it entirely. A callback parameter with no function type means TypeScript has no idea what shape the passed-in function should have, so it cannot check what type the callback\'s own parameters are, or catch a mistake made inside the callback\'s body. Giving the callback parameter an explicit function type, like `(item: number) => void`, tells TypeScript exactly what any function assigned to it must look like, which lets it check the implementation of every callback passed in against that shape.',
        aHi: 'Jab kisi parameter ka declared type nahi hota, TypeScript use — aur usse nikalne wali har value ko, agar wo function hai to uske apne parameters sameet — \`any\` maanta hai, jo uske liye checking poori tarah band kar deta hai. Bina function type wala callback parameter matlab TypeScript ko pata hi nahi ki diya gaya function kaisi shape ka hona chahiye, isliye wo callback ke apne parameters ka type check nahi kar sakta, ya callback ke body mein hui galti nahi pakad sakta. Callback parameter ko seedha function type dena, jaise \`(item: number) => void\`, TypeScript ko bilkul batata hai ki usse assign hua koi bhi function kaisa dikhna chahiye, jo use har diye gaye callback ka implementation us shape ke hisaab se check karne deta hai.',
      },
      {
        q: 'What is the difference between an optional parameter (`param?: type`) and a default parameter (`param: type = value`), specifically in terms of the type the parameter has inside the function body?',
        qHi: 'Optional parameter (\`param?: type\`) aur default parameter (\`param: type = value\`) mein kya fark hai, khaas taur par function body ke andar parameter ke type ke lihaaz se?',
        a: 'Both allow the argument to be omitted at the call site, but the resulting type inside the function differs. An optional parameter\'s type inside the function body is a union of the declared type and `undefined` — `greeting?: string` is effectively `string | undefined`, and TypeScript requires you to handle the possibly-missing case before treating it as a plain string. A default parameter\'s type inside the function body is simply the declared type with no `undefined` involved — `greeting: string = "Hello"` is just `string`, because TypeScript itself substitutes the default value before the function body runs whenever the argument is omitted, guaranteeing a real value is always present.',
        aHi: 'Dono call site par argument chhodne dete hain, par function ke andar bante type mein fark hai. Optional parameter ka function body ke andar type declared type aur \`undefined\` ka union hai — \`greeting?: string\` asal mein \`string | undefined\` hai, aur TypeScript aapko ise saadhi string maanne se pehle shayad-missing wali sthiti sambhaalna zaruri karta hai. Default parameter ka function body ke andar type bas declared type hai, koi \`undefined\` shaamil nahi — \`greeting: string = "Hello"\` bas \`string\` hai, kyunki TypeScript khud default value ko function body chalne se pehle daal deta hai jab bhi argument chhoda jata hai, hamesha ek asli value maujood hone ki guarantee dete hue.',
      },
      {
        q: 'What is a function type in TypeScript, and how does contextual typing relate to it?',
        qHi: 'TypeScript mein function type kya hai, aur contextual typing uska kya rishta hai?',
        a: 'A function type, written as `(param: type, ...) => returnType`, describes the shape a function must have — what it accepts and what it returns — without providing an implementation. When a value with a known function type is assigned an actual implementation (a variable declared with that type, or a parameter declared with that type receiving a passed-in function), TypeScript uses "contextual typing" to infer the types of that implementation\'s own parameters from the surrounding function type, so they do not need their own explicit annotations. This is why a callback passed to a typed array method like `.map` does not need its parameter re-annotated: TypeScript already knows the expected function shape from context, and infers the parameter type from it.',
        aHi: 'Function type, \`(param: type, ...) => returnType\` ki tarah likha jata hai, us shape ko batata hai jo function ke paas honi chahiye — wo kya qubool karta hai aur kya lautaata hai — bina implementation diye. Jab known function type wali value ko asli implementation di jati hai (us type se declare kiya gaya variable, ya us type se declare kiya gaya parameter jo koi function paata hai), TypeScript "contextual typing" use karta hai us implementation ke apne parameters ke types aas-paas ke function type se infer karne ke liye, isliye unhe apne seedhe annotations chahiye nahi. Isi wajah se \`.map\` jaisi typed array method ko diye gaye callback ko apna parameter dobara annotate karne ki zarurat nahi: TypeScript context se pehle hi expected function shape jaanta hai, aur usse parameter type infer karta hai.',
      },
      {
        q: 'What does `void` mean as a return type, and how is it different from a function simply having no return statement?',
        qHi: '\`void\` return type ki tarah kya matlab rakhta hai, aur ye seedhe kisi function ke bilkul return statement na hone se kaise alag hai?',
        a: '`void` is an explicit declaration that a function\'s return value is not meant to be used — it documents intent, not just an absence of implementation detail. A function with no return type annotation at all still gets a return type inferred by TypeScript, which would simply be `void` if nothing is ever returned — but declaring it explicitly catches the case where the function\'s body later drifts into accidentally returning something meaningful (a common outcome of refactoring), which would otherwise silently change the function\'s inferred return type without anyone noticing or updating the callers that rely on it being a pure side effect.',
        aHi: '\`void\` ek seedha declaration hai ki function ki return value use hone ke liye nahi hai — ye irada document karta hai, sirf implementation detail ki gair-maujoodgi nahi. Bina return type annotation wale function ka bhi TypeScript ek return type infer karta hai, jo bas \`void\` hoga agar kabhi kuch return na ho — par use seedha declare karna us sthiti ko pakadta hai jahan function ka body baad mein galti se kuch matlab wali cheez lautaane lagta hai (refactoring ka ek aam nateeja), jo warna chupchap function ke infer hue return type ko badal deta bina kisi ke notice kiye ya un callers ko update kiye jo iska poora side effect hone par bharosa karte hain.',
      },
      {
        q: 'When should you use a rest parameter instead of an array parameter?',
        qHi: 'Array parameter ke bajaye rest parameter kab use karna chahiye?',
        a: 'Both `function sum(numbers: number[])` and `function sum(...numbers: number[])` end up giving the function body an array of numbers to work with, and the underlying type checking of that array is identical either way. The difference is entirely at the call site: an array parameter requires the caller to already have their values collected into an array — `sum([1, 2, 3])` — while a rest parameter lets the caller pass a variable number of separate arguments directly — `sum(1, 2, 3)`. Reach for a rest parameter when the natural, ergonomic call shape is a list of separate arguments (like `Math.max(1, 2, 3)`), and a plain array parameter when the caller is realistically always going to have an actual array value on hand already.',
        aHi: '\`function sum(numbers: number[])\` aur \`function sum(...numbers: number[])\` dono function body ko kaam karne ke liye numbers ka ek array dete hain, aur us array ki bunyaadi type checking dono tarike se ek jaisi hai. Fark poori tarah call site par hai: array parameter ko caller ke paas pehle se ek array mein ikattha ki hui values chahiye — \`sum([1, 2, 3])\` — jabki rest parameter caller ko seedha alag-alag arguments ki anishit ginti pass karne deta hai — \`sum(1, 2, 3)\`. Rest parameter uthaao jab svaabhavik, aasaan call shape alag arguments ki list ho (jaise \`Math.max(1, 2, 3)\`), aur saadha array parameter tab jab caller ke paas asal mein hamesha ek asli array value pehle se hoti hai.',
      },
    ],

    exercises: [
      {
        task: 'Write a function that takes an untyped callback parameter and calls it on each array item, deliberately introducing a type mistake inside the callback. Confirm it compiles anyway. Then add a function type to the parameter and confirm the same mistake is now caught.',
        taskHi: 'Ek function likho jo bina-type wala callback parameter leta hai aur use har array item par bulaata hai, callback ke andar jaan-boojh kar ek type ki galti daalo. Confirm karo ki wo phir bhi compile hota hai. Phir parameter ko function type do aur confirm karo wahi galti ab pakdi jati hai.',
        hint: 'Try `.toUpperCase()` on a number inside the callback — it is exactly this lesson\'s broken example.',
        hintHi: 'Callback ke andar number par \`.toUpperCase()\` try karo — ye bilkul is lesson ka toota example hai.',
      },
      {
        task: 'Write the same function twice: once with an optional parameter (`greeting?: string`) and once with a default parameter (`greeting: string = "Hello"`). In each, use `greeting.toUpperCase()` directly and observe which version requires you to handle undefined first.',
        taskHi: 'Wahi function do baar likho: ek baar optional parameter (\`greeting?: string\`) se aur ek baar default parameter (\`greeting: string = "Hello"\`) se. Har ek mein, seedha \`greeting.toUpperCase()\` use karo aur dekho kaunsa version aapko pehle undefined sambhaalna zaruri karta hai.',
        hint: 'Hover over `greeting`\'s type in each version in your editor — one shows `string | undefined`, the other shows plain `string`.',
        hintHi: 'Apne editor mein har version mein \`greeting\` ke type par hover karo — ek \`string | undefined\` dikhaata hai, doosra saadha \`string\`.',
      },
      {
        task: 'Write a named function type `type Comparator = (a: number, b: number) => boolean`, then write two implementations of it — one checking `a > b`, one checking `a === b` — without annotating either implementation\'s own parameters.',
        taskHi: 'Ek naamit function type \`type Comparator = (a: number, b: number) => boolean\` likho, phir uske do implementations likho — ek \`a > b\` check karta hua, ek \`a === b\` check karta hua — kisi bhi implementation ke apne parameters ko annotate kiye bina.',
        hint: 'Hover over `a` and `b` inside either implementation to confirm TypeScript inferred their type contextually, without you writing it.',
        hintHi: 'Confirm karne ke liye ki TypeScript ne unka type contextually infer kiya, aapke likhe bina, kisi bhi implementation ke andar \`a\` aur \`b\` par hover karo.',
      },
    ],

    keyTakeaways: [
      'An untyped parameter is checked as `any` — every mistake inside it, including inside a callback\'s own body, goes uncaught regardless of how well-typed the surrounding function is.',
      'A function type like `(item: number) => void` describes a callback\'s expected shape, closing that hole exactly the way an annotation closes it on any other parameter.',
      'An optional parameter (`param?: type`) has type `T | undefined` inside the function and requires handling the missing case; a default parameter (`param: type = value`) is always the plain declared type, since TypeScript resolves the default before the function body runs.',
      'A rest parameter (`...name: type[]`) collects an arbitrary number of trailing arguments into one typed array, and must be the last parameter declared.',
      'Contextual typing means a function assigned to a variable or parameter with a known function type does not need its own parameters re-annotated — TypeScript infers them from that surrounding type.',
      'An explicit return type catches a mistake at the function\'s own definition instead of only at whichever call site first relied on the (silently wrong) inferred type.',
    ],
    keyTakeawaysHi: [
      'Bina-type wala parameter \`any\` ki tarah check hota hai — uske andar hui har galti, callback ke apne body ke andar wali sameet, pakdi nahi jati chahe aas-paas ka function kitna bhi achha typed ho.',
      '\`(item: number) => void\` jaisa function type callback ki ummeed ki hui shape batata hai, wo chhed bilkul waise band karte hue jaise annotation kisi bhi doosre parameter par karti hai.',
      'Optional parameter (\`param?: type\`) ka function ke andar type \`T | undefined\` hai aur missing sthiti sambhaalna zaruri karta hai; default parameter (\`param: type = value\`) hamesha saadha declared type hai, kyunki TypeScript function body chalne se pehle default suljhaa deta hai.',
      'Rest parameter (\`...name: type[]\`) peeche ke anishit ginti ke arguments ko ek typed array mein ikattha karta hai, aur declare hua aakhri parameter hona chahiye.',
      'Contextual typing ka matlab hai known function type wale variable ya parameter ko assign hua function apne parameters dobara annotate karne ki zarurat nahi rakhta — TypeScript unhe us aas-paas ke type se infer karta hai.',
      'Seedha return type galti ko function ki apni definition par pakadta hai, sirf us call site par nahi jo pehle chupchap galat infer hue type par bharosa karti thi.',
    ],
  },
];
