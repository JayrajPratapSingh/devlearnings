/**
 * TypeScript Complete Course — Module 1: Why TypeScript & The Basics, lesson 1.
 *
 * Written to the same rules as the JS and CSS courses: open with something
 * broken, one idea per entry, no undefined jargon, every example shows its
 * output. The broken example here is a function that crashes in PRODUCTION
 * — not while writing it — because JavaScript only discovers a type mistake
 * the moment the wrong line finally executes. TypeScript's entire pitch is
 * moving that discovery earlier, onto the developer's own screen, before
 * the code ever ships.
 *
 * `output` is used (not `preview`) because TypeScript lessons are about code
 * behaviour and compiler messages, not visual rendering — matching the JS
 * course's pattern (see course-js-module1.ts's LessonExample interface).
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

export const TS_MODULE_1: CourseLesson[] = [
  {
    slug: 'why-typescript',
    title: 'Why TypeScript',
    titleHi: 'TypeScript Kyun',
    description: 'A function that crashed in production three weeks after it shipped — and would have been caught before it was ever committed.',
    descriptionHi: 'Ek function jo ship hone ke teen hafte baad production mein crash hua — aur commit hone se pehle hi pakda ja sakta tha.',
    difficulty: 'EASY',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A form that checks your answers as you fill it in, versus one that mails you back a rejection letter weeks later.** JavaScript is the second form: you write anything, submit it, and only find out something was wrong when it actually runs and breaks — which might be the moment a real user clicks a real button in production. TypeScript is the first form: it checks each field the instant you type it, in your editor, before you even hit submit. The information was always knowable — TypeScript just moves the moment you learn it from "after it broke" to "while you were writing it".',
      hi: '**Ek form jo bharte waqt hi jawab check karta hai, aur ek jo hafton baad rejection letter bhejta hai.** JavaScript doosra form hai: aap kuch bhi likho, submit karo, aur pata tabhi chalta hai jab wo asal mein chale aur toote — jo shayad tab ho jab koi asli user production mein ek asli button dabaaye. TypeScript pehla form hai: wo har field ko turant check karta hai jaise hi aap type karte ho, apne editor mein, submit karne se pehle hi. Jaankari hamesha jaan ne layak thi — TypeScript sirf wo pal badalta hai jab aapko pata chalta hai, "toote ke baad" se "likhte waqt" tak.',
    },

    simple: `**Start broken.** A plain JavaScript function, used for weeks without issue:

\`\`\`js
function getDiscountedPrice(price, discountPercent) {
  return price - (price * discountPercent / 100);
}

console.log(getDiscountedPrice(100, 20));   // 80 — looks fine
\`\`\`

Three weeks later, someone wires it up to a form where the discount field is read from user input:

\`\`\`js
const discount = document.querySelector('#discount').value;   // "20" — a STRING, from the DOM
console.log(getDiscountedPrice(100, discount));
// 100 - (100 * "20" / 100)
// "20" gets coerced to 20 for the multiplication and division... this one actually works
// but change the form to send "20%" instead, and:
console.log(getDiscountedPrice(100, "20%"));
// 100 * "20%" → NaN → the whole result is NaN
// NOTHING crashed. NOTHING threw an error. The page just quietly shows "NaN" to a real customer.
\`\`\`

JavaScript never asked what \`discountPercent\` was supposed to be. It accepted a string without complaint, tried its best with \`*\` and \`/\`, and when that best effort produced garbage, it did not stop and say so — it just kept going with \`NaN\`, silently, all the way to the customer's screen.

**The same function, in TypeScript**

\`\`\`ts
function getDiscountedPrice(price: number, discountPercent: number): number {
  return price - (price * discountPercent / 100);
}

getDiscountedPrice(100, "20%");
// Error: Argument of type 'string' is not assignable to parameter of type 'number'.
\`\`\`

This error appears **the instant you type it**, underlined red in your editor, before you save the file, before you commit, before it ever reaches a test suite, a code reviewer, or a customer. \`: number\` after each parameter is a **type annotation** — a promise to the compiler about what kind of value belongs there. The compiler now checks every call against that promise, for every line of code, forever, without you having to remember to check it yourself.

**TypeScript is not a new language you learn instead of JavaScript**

\`\`\`
Your .ts file  →  [TypeScript compiler, "tsc"]  →  a plain .js file  →  runs in the browser/Node, same as always
\`\`\`

Every valid JavaScript program is already valid-ish TypeScript (with types filled in as \`any\`, covered later this module) — you are not throwing away what you know. TypeScript is JavaScript **plus a layer that checks your work before it runs**, and that extra layer disappears entirely by the time the code actually executes: browsers and Node.js have never run a single line of TypeScript in their lives, only the plain JavaScript it compiles down to.

**Remember:** every bug TypeScript ever catches is a bug JavaScript would have let through silently, discovered only when the wrong line finally ran — often in production, often much later, often by a real user instead of by you.`,

    simpleHi: `**Toote hue se shuru.** Ek saadhi JavaScript function, hafton tak bina kisi samasya ke use hui:

\`\`\`js
function getDiscountedPrice(price, discountPercent) {
  return price - (price * discountPercent / 100);
}

console.log(getDiscountedPrice(100, 20));   // 80 — theek lagta hai
\`\`\`

Teen hafte baad, koi ise ek form se jodta hai jahan discount field DOM se user input ki tarah padhi jati hai:

\`\`\`js
const discount = document.querySelector('#discount').value;   // "20" — ek STRING, DOM se
console.log(getDiscountedPrice(100, discount));
// 100 - (100 * "20" / 100)
// multiplication aur division ke liye "20" 20 mein badal jata hai... ye ek to chal jata hai
// par form ko badal kar "20%" bhejo, aur:
console.log(getDiscountedPrice(100, "20%"));
// 100 * "20%" → NaN → poora nateeja NaN
// KUCH bhi crash nahi hua. KOI error nahi aayi. Page bas chupchap ek asli customer ko "NaN" dikha deta hai.
\`\`\`

JavaScript ne kabhi nahi poocha \`discountPercent\` kya hona chahiye tha. Usne bina shikayat kiye ek string qubool kar li, \`*\` aur \`/\` se apni poori koshish ki, aur jab wo koshish kachra bana degi, wo ruki nahi aur bataya bhi nahi — wo bas \`NaN\` ke saath chupchap chalti rahi, customer ki screen tak.

**Wahi function, TypeScript mein**

\`\`\`ts
function getDiscountedPrice(price: number, discountPercent: number): number {
  return price - (price * discountPercent / 100);
}

getDiscountedPrice(100, "20%");
// Error: Argument of type 'string' is not assignable to parameter of type 'number'.
\`\`\`

Ye error **type karte hi** dikhta hai, editor mein laal underline ke saath, file save karne se pehle, commit karne se pehle, kisi test suite, code reviewer, ya customer tak pahunchne se pehle. Har parameter ke baad \`: number\` ek **type annotation** hai — compiler se ek wachan ki wahan kaunsi kism ki value honi chahiye. Compiler ab har call ko us wachan ke hisaab se check karta hai, code ki har line ke liye, hamesha, bina aapko khud yaad rakhne ki zarurat ke.

**TypeScript koi nayi bhasha nahi hai jise aap JavaScript ke bajaye seekhte ho**

\`\`\`
Aapki .ts file  →  [TypeScript compiler, "tsc"]  →  ek saadhi .js file  →  browser/Node mein chalti hai, hamesha ki tarah
\`\`\`

Har valid JavaScript program pehle se lagbhag valid TypeScript hai (types \`any\` ki tarah bhare hue, is module mein baad mein cover hoga) — aap jo jaante ho use phenk nahi rahe. TypeScript JavaScript **plus ek layer hai jo aapka kaam chalne se pehle check karta hai**, aur wo extra layer code chalne tak poori tarah gayab ho jata hai: browsers aur Node.js ne apni zindagi mein kabhi TypeScript ki ek bhi line nahi chalayi, sirf wo saadhi JavaScript jisme wo compile hoti hai.

**Yaad rakho:** har bug jo TypeScript kabhi pakadta hai wo aisa bug hai jise JavaScript chupchap nikal jaane deta, sirf tab pata chalta jab galat line aakhirkaar chalti — aksar production mein, aksar kaafi baad mein, aksar aapke bajaye ek asli user dwara.`,

    content: `## What TypeScript actually is

TypeScript is JavaScript with an optional **type system** layered on top, checked by a separate tool (the TypeScript compiler, \`tsc\`) before your code ever runs. It compiles down to plain JavaScript — the type annotations are stripped out entirely in the output, because JavaScript engines have no concept of types at that level.

\`\`\`ts
// input.ts
function add(a: number, b: number): number {
  return a + b;
}
\`\`\`

\`\`\`js
// output.js — after tsc compiles it. Every type annotation is simply GONE.
function add(a, b) {
  return a + b;
}
\`\`\`

This is the single most important mental model for this entire course: **types exist only at compile time, for you, never at runtime, for the computer.** \`typeof\` at runtime, \`instanceof\`, and every other JavaScript runtime check still behave exactly as they always did — TypeScript adds a check that happens earlier and disappears before execution, it does not add a new runtime behaviour.

## Static typing versus dynamic typing

\`\`\`js
// JavaScript: dynamically typed — a variable's type is only known by
// actually running the code and inspecting the value at that moment.
let x = 5;
x = "hello";   // perfectly legal, JS never objects
\`\`\`

\`\`\`ts
// TypeScript: statically typed — a variable's type is fixed at the point
// it's declared (or inferred), and checked WITHOUT running the code at all.
let x = 5;       // TypeScript infers: x is a number, forever
x = "hello";      // Error: Type 'string' is not assignable to type 'number'.
\`\`\`

"Static" means the check happens by reading the source code — the compiler never executes anything to know this is wrong. "Dynamic" means JavaScript only ever discovers a type mismatch by running the exact line that has the problem, which is why the same bug can hide for weeks in a code path that simply was not exercised until later.

## Setting up: tsc, ts-node, and the compile step

\`\`\`bash
npm install -D typescript
npx tsc --init          # creates tsconfig.json
npx tsc                 # compiles all .ts files per tsconfig.json into .js
\`\`\`

\`\`\`bash
npm install -D ts-node
npx ts-node script.ts   # compiles AND runs in one step, useful for scripts/dev
\`\`\`

In a real project (React, Node, this very course's own codebase) a build tool like Vite, webpack, or the TypeScript compiler itself handles this automatically as part of the dev server or build — you rarely run \`tsc\` by hand for application code, but it is worth doing once directly so the compile-then-run pipeline is not a mystery.

## Type inference — you often don't write annotations at all

\`\`\`ts
let count = 5;          // inferred: number — no ": number" needed
let name = "Priya";     // inferred: string
let items = [1, 2, 3];  // inferred: number[]

count = "five";          // Error — even though you never wrote ": number" anywhere
\`\`\`

TypeScript looks at the value on the right of \`=\` and infers the type, then enforces it from that point on, exactly as if you had annotated it explicitly. Beginners often over-annotate everything out of habit; the TypeScript style most real codebases prefer is to **let inference work where it can**, and add an explicit annotation only where TypeScript cannot infer anything useful on its own — most commonly, function parameters, which have no "right-hand side" value to infer from.

\`\`\`ts
function greet(name) { ... }        // Error under strict settings: 'name' implicitly has an 'any' type
function greet(name: string) { ... }   // required — there's nothing to infer FROM
\`\`\`

## The primitive types

\`\`\`ts
let age: number = 29;
let name: string = "Priya";
let isActive: boolean = true;
let nothing: null = null;
let notSet: undefined = undefined;
\`\`\`

These map directly to JavaScript's own primitive types — TypeScript did not invent new kinds of data, it only added a way to *declare and check* which of JavaScript's existing kinds a value must be.

## any — the type that turns TypeScript off

\`\`\`ts
let data: any = fetchSomething();
data.whatever.you.want();   // no error, ever — TypeScript stops checking this value entirely
\`\`\`

\`any\` tells the compiler "stop checking this, trust me" — every operation on an \`any\`-typed value is allowed, with zero safety, which defeats the entire purpose of using TypeScript in the first place. It exists as an escape hatch for genuinely untyped legacy code or a migration in progress, not as a default. A later lesson in this module covers \`unknown\`, which is the safe alternative for "I don't know the type yet".

## Why this actually matters, concretely

The value of a type system is not abstract — it compounds specifically as a codebase grows past what one person can hold in their head. A function you wrote six months ago, called from a file you have never opened, by a teammate who has never seen your original code: TypeScript is what tells them, before they run anything, exactly what shape of data that function expects and returns. Without it, that information exists only in your memory, or in a comment someone forgot to update, or not at all.`,

    contentHi: `## TypeScript asal mein hai kya

TypeScript JavaScript hai jispar ek optional **type system** layer ki tarah lagi hai, jise ek alag tool (TypeScript compiler, \`tsc\`) aapka code chalne se pehle check karta hai. Ye saadhi JavaScript mein compile hoti hai — type annotations output mein poori tarah gayab ho jate hain, kyunki JavaScript engines ko us level par types ka koi concept hi nahi hai.

\`\`\`ts
// input.ts
function add(a: number, b: number): number {
  return a + b;
}
\`\`\`

\`\`\`js
// output.js — tsc compile karne ke baad. Har type annotation bas GAYAB hai.
function add(a, b) {
  return a + b;
}
\`\`\`

Ye poore course ke liye sabse zaruri mental model hai: **types sirf compile time par maujood hain, aapke liye, kabhi bhi runtime par computer ke liye nahi.** Runtime par \`typeof\`, \`instanceof\`, aur har doosra JavaScript runtime check ab bhi bilkul waisa hi vyavhaar karta hai jaisa hamesha karta tha — TypeScript ek aisa check jodta hai jo pehle hota hai aur execution se pehle gayab ho jata hai, ye koi naya runtime vyavhaar nahi jodta.

## Static typing aur dynamic typing

\`\`\`js
// JavaScript: dynamically typed — variable ka type sirf code chala kar aur
// us pal value dekh kar hi pata chalta hai.
let x = 5;
x = "hello";   // bilkul legal, JS kabhi aitraaz nahi karta
\`\`\`

\`\`\`ts
// TypeScript: statically typed — variable ka type declare (ya infer) hone ke
// pal hi tay ho jata hai, aur bina code chalaye check hota hai.
let x = 5;       // TypeScript infer karta hai: x hamesha ke liye number hai
x = "hello";      // Error: Type 'string' is not assignable to type 'number'.
\`\`\`

"Static" ka matlab hai check source code padh kar hota hai — compiler ye jaanne ke liye kabhi kuch chalata hi nahi ki ye galat hai. "Dynamic" ka matlab hai JavaScript sirf us exact line ko chala kar hi type mismatch dhoondh pata hai jisme samasya hai, isiliye wahi bug kai hafton tak ek aise code path mein chhup sakta hai jo baad tak chalaya hi nahi gaya.

## Setup karna: tsc, ts-node, aur compile step

\`\`\`bash
npm install -D typescript
npx tsc --init          # tsconfig.json banata hai
npx tsc                 # tsconfig.json ke hisaab se saari .ts files ko .js mein compile karta hai
\`\`\`

\`\`\`bash
npm install -D ts-node
npx ts-node script.ts   # ek hi step mein compile AUR chalata hai, scripts/dev ke liye kaam ka
\`\`\`

Asli project mein (React, Node, is course ke apne codebase mein) Vite, webpack, ya khud TypeScript compiler jaisa build tool ise dev server ya build ke hisse ki tarah apne aap sambhalta hai — application code ke liye aap shayad hi kabhi \`tsc\` haath se chalate ho, par ise ek baar seedha karna kaam ka hai taaki compile-phir-chalao pipeline ek raaz na rahe.

## Type inference — aksar annotations bilkul nahi likhne padte

\`\`\`ts
let count = 5;          // infer hua: number — ": number" ki zarurat nahi
let name = "Priya";     // infer hua: string
let items = [1, 2, 3];  // infer hua: number[]

count = "five";          // Error — halaanki aapne kahin ": number" likha hi nahi
\`\`\`

TypeScript \`=\` ke dayein wali value dekhta hai aur type infer karta hai, phir usi pal se use lagu kar deta hai, bilkul waisa jaise aapne use seedha annotate kiya ho. Beginners aksar aadat se sab kuch over-annotate karte hain; zyadatar asli codebases jo TypeScript style pasand karte hain wo hai: **jahan inference kaam kare wahan use kaam karne do**, aur seedha annotation sirf wahan jodo jahan TypeScript khud kuch kaam ka infer nahi kar sakta — sabse aam, function parameters, jinke paas infer karne ke liye koi "dayein taraf ki" value hi nahi hoti.

\`\`\`ts
function greet(name) { ... }        // strict settings mein Error: 'name' implicitly has an 'any' type
function greet(name: string) { ... }   // zaruri hai — infer karne ke liye kuch hai hi nahi
\`\`\`

## Primitive types

\`\`\`ts
let age: number = 29;
let name: string = "Priya";
let isActive: boolean = true;
let nothing: null = null;
let notSet: undefined = undefined;
\`\`\`

Ye seedhe JavaScript ke apne primitive types se milte hain — TypeScript ne naye kism ka data ijaad nahi kiya, sirf ek tarika joda hai *declare aur check* karne ka ki value JavaScript ke maujood kismon mein se kaunsi honi chahiye.

## any — wo type jo TypeScript ko band kar deta hai

\`\`\`ts
let data: any = fetchSomething();
data.whatever.you.want();   // kabhi error nahi — TypeScript is value ko check karna poori tarah band kar deta hai
\`\`\`

\`any\` compiler ko batata hai "isse check karna band karo, mujh par bharosa karo" — \`any\`-typed value par har operation ki ijazat hai, zero safety ke saath, jo TypeScript use karne ka poora point hi khatam kar deta hai. Ye sach mein untyped legacy code ya chalti hui migration ke liye ek escape hatch ki tarah maujood hai, default ki tarah nahi. Is module ka ek baad ka lesson \`unknown\` cover karta hai, jo "mujhe abhi type pata nahi" ke liye surakshit vikalp hai.

## Ye asal mein kyun matter karta hai, seedhe roop mein

Type system ki keemat abstract nahi hai — ye khaas taur par tab badhti jati hai jab codebase ek insaan ke dimaag mein aa sakne se badi ho jati hai. Chhe mahine pehle aapka likha ek function, jise ek aisi file se bulaya jaata hai jo aapne kabhi kholi nahi, ek teammate dwara jisne aapka asli code kabhi dekha nahi: TypeScript hi use, kuch chalane se pehle, bilkul batata hai ki us function ko kaisa data chahiye aur wo kya lautaata hai. Iske bina, wo jaankari sirf aapki yaad mein hoti hai, ya ek comment mein jise koi update karna bhool gaya, ya kahin bhi nahi.`,

    examples: [
      {
        title: 'The silent NaN — JavaScript catches nothing',
        titleHi: 'Chupa hua NaN — JavaScript kuch nahi pakadta',
        code: `function getDiscountedPrice(price, discountPercent) {
  return price - (price * discountPercent / 100);
}

console.log(getDiscountedPrice(100, "20%"));`,
        output: `NaN
// No error was thrown. No warning appeared. The function ran to completion
// and returned garbage, silently, exactly as if nothing had gone wrong.`,
        explain: 'JavaScript never questioned what "20%" was doing in a spot meant for a number. It multiplied a string by a number, got NaN, and happily returned it — the bug is invisible unless someone specifically checks the output value.',
        explainHi: 'JavaScript ne kabhi nahi poocha ki "20%" us jagah kya kar raha hai jo number ke liye thi. Usne ek string ko number se guna kiya, NaN mila, aur khushi khushi use laut diya — ye bug adrishya hai jab tak koi khaas taur par output value check na kare.',
      },
      {
        title: 'The same bug, caught before it ever runs',
        titleHi: 'Wahi bug, chalne se pehle hi pakda gaya',
        code: `function getDiscountedPrice(price: number, discountPercent: number): number {
  return price - (price * discountPercent / 100);
}

getDiscountedPrice(100, "20%");`,
        output: `// Compiler output (this line is shown red-underlined in your editor immediately,
// before you even save the file):
Error: Argument of type 'string' is not assignable to parameter of type 'number'.

// The .js file is never even generated until this error is fixed.`,
        explain: 'The exact same mistake, but this time it is impossible to ship — the compiler refuses to produce output at all until the type error is resolved, so the bug never reaches a running program in the first place.',
        explainHi: 'Bilkul wahi galti, par is baar ise ship karna namumkin hai — type error hal hone tak compiler output banane se hi mana kar deta hai, isliye bug kabhi chalte hue program tak pahunchta hi nahi.',
      },
      {
        title: 'What compiling actually produces',
        titleHi: 'Compile karne se asal mein kya banta hai',
        code: `// greet.ts
function greet(name: string): string {
  return "Hello, " + name;
}`,
        output: `// greet.js — after "npx tsc greet.ts". Compare closely: every type
// annotation is gone. This is the file that actually runs.
function greet(name) {
    return "Hello, " + name;
}`,
        explain: 'The compiled output is ordinary JavaScript with zero trace of the type system — types are a tool for the compiler and for you while writing the code, not a feature that exists while the program is running.',
        explainHi: 'Compiled output saadhi JavaScript hai jisme type system ka koi nishaan nahi — types compiler ke liye aur code likhte waqt aapke liye ek auzaar hain, program chalte waqt maujood koi feature nahi.',
      },
      {
        title: 'Static checking happens without running anything',
        titleHi: 'Static checking bina kuch chalaye hota hai',
        code: `let x = 5;
x = "hello";`,
        output: `Error: Type 'string' is not assignable to type 'number'.

// Notice: this program was never executed to produce this error.
// The compiler read the SOURCE CODE and reasoned about it — the same
// way you'd catch this mistake just by reading the two lines yourself.`,
        explain: 'This is what "static" means: the compiler examined the code as text and reasoned about what type `x` must be, entirely without running a single instruction — unlike a runtime crash, which only ever happens by actually executing the broken line.',
        explainHi: 'Yahi "static" ka matlab hai: compiler ne code ko text ki tarah dekha aur soncha ki \`x\` ka type kya hona chahiye, bina ek bhi instruction chalaye — runtime crash ke ulat, jo sirf toothi hui line asal mein chalane se hi hota hai.',
      },
      {
        title: 'Inference: TypeScript figures out the type from the value',
        titleHi: 'Inference: TypeScript value se type khud nikaal leta hai',
        code: `let count = 5;
let name = "Priya";
let items = [1, 2, 3];

count = "five";
name = 42;
items.push("four");`,
        output: `Error: Type 'string' is not assignable to type 'number'.       // count = "five"
Error: Type 'number' is not assignable to type 'string'.       // name = 42
Error: Argument of type 'string' is not assignable to parameter of type 'number'.  // items.push
// None of these variables were ever given an explicit ": type" — TypeScript
// inferred all three from their initial values and enforced them anyway.`,
        explain: 'Not one of these three variables has a written type annotation, yet all three mistakes are caught. Inference is not a weaker form of typing — it produces the exact same enforcement as writing the annotation by hand.',
        explainHi: 'In teen variables mein se ek ka bhi likha hua type annotation nahi hai, phir bhi teenon galtiyan pakdi jati hain. Inference typing ka kamzor roop nahi hai — ye bilkul wahi enforcement banata hai jo annotation haath se likhne se milta.',
      },
      {
        title: 'Where inference cannot help: function parameters',
        titleHi: 'Jahan inference madad nahi kar sakta: function parameters',
        code: `function greet(name) {
  return "Hello, " + name.toUpperCase();
}

greet(42);   // no compile error under loose settings — "name" silently became "any"`,
        output: `// Without an annotation, TypeScript has nothing to infer FROM — there's
// no "right-hand side" for a parameter the way there is for "let x = 5".
// Under strict settings this itself becomes an error:
Error: Parameter 'name' implicitly has an 'any' type.

// Fixed:
function greet(name: string) {
  return "Hello, " + name.toUpperCase();
}
greet(42);
Error: Argument of type 'number' is not assignable to parameter of type 'string'.`,
        explain: 'A parameter has no value sitting next to it the way a variable declaration does, so TypeScript cannot guess its type from context — this is exactly why parameters are the one place annotations are almost always required, not optional.',
        explainHi: 'Parameter ke bagal koi value nahi baithti jaisi variable declaration mein hoti hai, isliye TypeScript context se uska type andaza nahi laga sakta — yahi wajah hai ki parameters wo ek jagah hain jahan annotations lagbhag hamesha zaruri hain, optional nahi.',
      },
      {
        title: 'any turns off checking entirely',
        titleHi: 'any checking poori tarah band kar deta hai',
        code: `let data: any = fetchUserFromApi();

console.log(data.name.toUpperCase());
console.log(data.age.push(1));
console.log(data.thisDoesNotExist.whatever());`,
        output: `// ALL THREE lines compile with zero errors — even the third one, which is
// almost certainly nonsense. "any" tells TypeScript to stop checking this
// value completely; every property access and every call is allowed.
// If "thisDoesNotExist" is genuinely undefined, this crashes at RUNTIME —
// exactly the plain-JavaScript failure mode this whole lesson is about.`,
        explain: 'This is the trap: reaching for `any` to silence a type error feels productive in the moment, but it recreates the exact silent-failure risk of plain JavaScript for that value, defeating the reason to use TypeScript at all.',
        explainHi: 'Yahi jaal hai: type error ko chup karane ke liye \`any\` uthaana us pal kaam ka lagta hai, par ye us value ke liye bilkul saadhi JavaScript wala chup-chaap-fail-hone ka khatra dobara bana deta hai, TypeScript use karne ki wajah hi khatam karte hue.',
      },
      {
        title: 'The primitive types, checked consistently',
        titleHi: 'Primitive types, lagatar check hote hue',
        code: `let age: number = 29;
let name: string = "Priya";
let isActive: boolean = true;

age = "twenty-nine";
name = true;
isActive = 1;`,
        output: `Error: Type 'string' is not assignable to type 'number'.
Error: Type 'boolean' is not assignable to type 'string'.
Error: Type 'number' is not assignable to type 'boolean'.
// Every one of JavaScript's primitive kinds — number, string, boolean,
// null, undefined — gets this same enforcement once annotated.`,
        explain: 'TypeScript did not invent new categories of data — number, string, and boolean are the same JavaScript primitives you already know. What changed is that mismatching them is now a compile-time error instead of a silent coercion.',
        explainHi: 'TypeScript ne data ki nayi categories ijaad nahi ki — number, string, aur boolean wahi JavaScript primitives hain jo aap pehle se jaante ho. Jo badla hai wo ye hai ki unhe galat milaana ab chupchap coercion ke bajaye compile-time error hai.',
      },
    ],

    mistakes: [
      {
        wrong: `function getDiscountedPrice(price, discountPercent) {
  return price - (price * discountPercent / 100);
}
/* no annotations — a wrong type silently produces NaN in production */`,
        right: `function getDiscountedPrice(price: number, discountPercent: number): number {
  return price - (price * discountPercent / 100);
}`,
        why: 'Without annotations, JavaScript accepts any value for either parameter and does its best with whatever arithmetic that produces — including silently returning NaN. Annotations make a wrong-type call a compile error instead of a runtime surprise.',
        whyHi: 'Bina annotations ke, JavaScript kisi bhi parameter ke liye koi bhi value qubool kar leti hai aur jo bhi ganit ban paye uske saath apni poori koshish karti hai — NaN chupchap laut ana sameet. Annotations galat-type call ko runtime surprise ke bajaye compile error banate hain.',
      },
      {
        wrong: `let userAge: any = getUserAge();
console.log(userAge.toFixed(2));   // compiles fine even though ages are usually integers with no decimals expected`,
        right: `let userAge: number = getUserAge();
console.log(userAge.toFixed(2));   // TypeScript now checks every future use of userAge against "number"`,
        why: 'Reaching for `any` whenever a type is unclear turns off checking for that value entirely, silently recreating the exact bug class TypeScript exists to prevent — it should be a deliberate, rare escape hatch, not a default response to friction.',
        whyHi: 'Type saaf na hone par har baar \`any\` uthaana us value ke liye checking poori tarah band kar deta hai, chupchap wahi bug class dobara banate hue jise rokne ke liye TypeScript maujood hai — ye ek jaan-boojh kar, kam istemal hone wala escape hatch hona chahiye, friction ka default jawab nahi.',
      },
      {
        wrong: `function process(items: number[]): number {
  let total = 0;
  for (let item of items) { total += item; }
  return total;
}
/* correct, but the reader can't tell WHY these annotations were chosen without seeing usage elsewhere */`,
        right: `function process(items: number[]): number {
  // sums the price of every item in a cart, in the smallest currency unit (paise/cents)
  let total = 0;
  for (let item of items) { total += item; }
  return total;
}`,
        why: 'This is not a type error, but a common early habit: annotations state WHAT a value must be, never WHY. When the meaning is not obvious from the name and type alone (paise vs rupees, for instance), a short comment carries information a type genuinely cannot express.',
        whyHi: 'Ye type error nahi hai, par ek aam shuruaati aadat hai: annotations batate hain value KYA honi chahiye, KYUN kabhi nahi. Jab matlab naam aur type se hi saaf na ho (jaise paise vs rupees), to ek chhota comment wo jaankari deta hai jo type sach mein nahi de sakta.',
      },
    ],

    realWorld: [
      {
        en: '**Nearly every large JavaScript codebase in production has migrated to TypeScript.** Airbnb, Slack, Asana and countless others have published case studies specifically because catching a category of bug at compile time, across a codebase too large for one person to manually track, produced a measurable drop in production incidents.',
        hi: '**Lagbhag har badi production JavaScript codebase TypeScript mein migrate ho chuki hai.** Airbnb, Slack, Asana aur be-shumaar doosron ne khaas taur par case studies publish ki hain kyunki compile time par ek category ke bug pakadna, aisi codebase mein jo ek insaan ke haath se track karne se badi hai, production incidents mein naapa gaya girawat laaya.',
      },
      {
        en: '**Editor autocomplete depends entirely on types.** The reason your editor can suggest a property name, flag a typo, or show you a function\'s exact parameter list as you type it is that TypeScript is running in the background, feeding that structured information to your editor in real time.',
        hi: '**Editor autocomplete poori tarah types par nirbhar hai.** Aapka editor property naam suggest kar sake, typo flag kar sake, ya type karte waqt function ki exact parameter list dikha sake, iski wajah ye hai ki TypeScript background mein chal raha hai, wo structured jaankari real time mein aapke editor ko de raha hai.',
      },
      {
        en: '**Job postings for frontend and full-stack roles overwhelmingly list TypeScript as a requirement, not a nice-to-have**, precisely because most production React, Node and Angular codebases are written in it — this is one of the most directly employable skills covered in this entire platform.',
        hi: '**Frontend aur full-stack roles ki job postings mein TypeScript ko zyadatar ek zaroorat ki tarah likha jata hai, "achha hota to" nahi**, bilkul isliye ki zyadatar production React, Node aur Angular codebases isi mein likhi jati hain — ye is poore platform mein cover ki gayi sabse seedhi employable skills mein se ek hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is TypeScript, and what is its relationship to JavaScript?',
        qHi: 'TypeScript kya hai, aur JavaScript se uska rishta kya hai?',
        a: 'TypeScript is a superset of JavaScript that adds an optional static type system, checked by a separate compiler (tsc) before the code runs. It is not a different language you use instead of JavaScript — every TypeScript file compiles down to plain JavaScript, with all type annotations stripped out, and that compiled JavaScript is the only thing that ever actually executes in a browser or in Node.js. The type system exists purely to catch mistakes earlier, at compile time on the developer\'s own machine, rather than at runtime when the flawed code path finally executes.',
        aHi: 'TypeScript JavaScript ka superset hai jo ek optional static type system jodta hai, jise code chalne se pehle ek alag compiler (tsc) check karta hai. Ye koi alag bhasha nahi jise aap JavaScript ke bajaye use karte ho — har TypeScript file saadhi JavaScript mein compile hoti hai, saare type annotations nikaal diye jate hain, aur wahi compiled JavaScript hi asal mein browser ya Node.js mein chalti hai. Type system poori tarah galtiyan pehle pakadne ke liye hai, developer ki apni machine par compile time par, na ki runtime par jab kharaab code path aakhirkaar chalta hai.',
      },
      {
        q: 'What is the difference between static typing and dynamic typing, using JavaScript and TypeScript as the example?',
        qHi: 'Static typing aur dynamic typing mein kya fark hai, JavaScript aur TypeScript ko misaal banate hue?',
        a: 'Dynamic typing, which is how plain JavaScript behaves, means a variable\'s type is only known by actually running the code and observing the value at that moment — a type mismatch is discovered only when the specific broken line finally executes, which could be immediately or months later in a rarely-used code path. Static typing, which TypeScript adds, means the type of a variable or parameter is checked by reading the source code itself, without executing anything — the compiler reasons about what type a value must be and flags a mismatch before the program ever runs, which is why the exact same bug that would crash silently in JavaScript becomes a red-underlined error in a TypeScript editor the moment it is typed.',
        aHi: 'Dynamic typing, jo saadhi JavaScript ka vyavhaar hai, matlab hai variable ka type sirf code chala kar aur us pal value dekh kar pata chalta hai — type mismatch sirf tab pata chalta hai jab wo khaas toothi hui line aakhirkaar chalti hai, jo turant bhi ho sakta hai ya kai mahine baad ek kam-istemal hote code path mein. Static typing, jo TypeScript jodta hai, matlab hai variable ya parameter ka type source code padh kar hi check ho jata hai, bina kuch chalaye — compiler soncha hai ki value ka type kya hona chahiye aur mismatch ko program chalne se pehle hi flag kar deta hai, isi wajah se wahi bug jo JavaScript mein chupchap crash karta, TypeScript editor mein type karte hi laal underline wali error ban jata hai.',
      },
      {
        q: 'Why do function parameters almost always need an explicit type annotation, even though many variables do not?',
        qHi: 'Function parameters ko lagbhag hamesha seedha type annotation kyun chahiye, jabki kai variables ko nahi chahiye?',
        a: 'TypeScript\'s type inference works by looking at the value assigned on the right-hand side of a declaration, like `let x = 5`, and deducing the type from that value. A function parameter has no equivalent right-hand side at the point it is declared — `function greet(name)` gives TypeScript nothing to infer from, since the actual argument value is not known until the function is called elsewhere, possibly in a different file entirely. Because there is no value to infer from, an explicit annotation is required to tell the compiler what type the parameter is meant to be; under strict compiler settings, an unannotated parameter is flagged as an error precisely because it silently becomes `any` otherwise.',
        aHi: 'TypeScript ka type inference declaration ke dayein taraf assign ki hui value dekh kar kaam karta hai, jaise \`let x = 5\`, aur us value se type nikaalta hai. Function parameter ke declare hone ke waqt uske paas koi barabar ka dayein taraf ka hissa nahi hota — \`function greet(name)\` TypeScript ko infer karne ke liye kuch nahi deta, kyunki asli argument value tab tak pata nahi jab tak function kahin aur, shayad poori tarah alag file mein, bulaya na jaaye. Kyunki infer karne ke liye koi value nahi hai, compiler ko batane ke liye ki parameter ka type kya hona chahiye seedha annotation zaruri hai; strict compiler settings mein, bina-annotation parameter ko error ki tarah flag kiya jata hai bilkul isliye kyunki wo warna chupchap \`any\` ban jata hai.',
      },
      {
        q: 'What does `any` do, and why is overusing it considered a problem even though it is valid TypeScript?',
        qHi: '\`any\` kya karta hai, aur ise zyada use karna samasya kyun maana jata hai halaanki ye valid TypeScript hai?',
        a: '`any` tells the TypeScript compiler to stop checking a value entirely — every property access, method call, and reassignment on an `any`-typed value is permitted without any verification, regardless of whether it actually makes sense. It is syntactically valid and sometimes genuinely necessary, such as when interfacing with untyped legacy code or during an in-progress migration from JavaScript. The problem with overusing it is that it silently recreates the exact failure mode plain JavaScript has — a mistake that only surfaces at runtime, potentially in production — for any value marked `any`, which defeats the purpose of adopting TypeScript for that part of the code. It should be treated as a deliberate, narrow escape hatch, not a default response when a type is inconvenient to figure out.',
        aHi: '\`any\` TypeScript compiler ko batata hai ki ek value ko check karna poori tarah band kar do — \`any\`-typed value par har property access, method call, aur reassignment bina kisi verification ke ijazat paata hai, chahe wo asal mein matlab rakhta ho ya nahi. Ye syntactically valid hai aur kabhi-kabhi sach mein zaruri hai, jaise untyped legacy code ke saath kaam karte waqt ya JavaScript se chalti hui migration ke dauran. Ise zyada use karne ki samasya ye hai ki ye chupchap bilkul wahi failure mode dobara banata hai jo saadhi JavaScript ki hai — ek galti jo sirf runtime par saamne aati hai, shayad production mein, kisi bhi \`any\` maarke wali value ke liye, jo us code ke hisse ke liye TypeScript apnaane ka matlab hi khatam kar deta hai. Ise ek jaan-boojh kar, sankra escape hatch maanna chahiye, type nikaalna asuvidhajanak hone par default jawab nahi.',
      },
      {
        q: 'If TypeScript types disappear at compile time, in what sense is TypeScript actually "checking" anything, and what value does that provide?',
        qHi: 'Agar TypeScript types compile time par gayab ho jate hain, to TypeScript asal mein kis roop mein kuch "check" kar raha hai, aur uski keemat kya hai?',
        a: 'The checking happens entirely during compilation, before the types are stripped out — the TypeScript compiler reads your source code, reasons about what type every value must be based on annotations and inference, and reports an error the moment it finds an inconsistency, all without executing a single line of the program. Once that checking phase passes cleanly, the types have served their purpose and are discarded, because the compiled JavaScript output has no runtime need for them — the value is not in the types existing while the program runs, but in the confidence that, because the compiler verified every operation was internally consistent, an entire category of type-related bugs cannot exist in the code that ships.',
        aHi: 'Checking poori tarah compilation ke dauran hoti hai, types nikaale jaane se pehle — TypeScript compiler aapka source code padhta hai, annotations aur inference ke aadhaar par soncha hai ki har value ka type kya hona chahiye, aur inconsistency milte hi error report karta hai, program ki ek bhi line chalaye bina. Wo checking phase saaf paas ho jaye to, types apna kaam kar chuke hote hain aur phenk diye jate hain, kyunki compiled JavaScript output ko unki runtime par zarurat nahi — keemat isme nahi hai ki types program chalte waqt maujood hon, keemat is bharose mein hai ki, kyunki compiler ne har operation ko andar se sahi verify kiya, jo code ship hota hai usme type-related bugs ki poori category maujood ho hi nahi sakti.',
      },
    ],

    exercises: [
      {
        task: 'Write the getDiscountedPrice function in plain JavaScript, call it with a string where a number is expected, and run it — confirm you get NaN with no error. Then rewrite it in TypeScript with annotations and confirm the same call is now a compile error.',
        taskHi: 'getDiscountedPrice function ko saadhi JavaScript mein likho, ise ek string se bulaao jahan number expected hai, aur chalao — confirm karo ki bina kisi error ke NaN milta hai. Phir use annotations ke saath TypeScript mein dobara likho aur confirm karo wahi call ab compile error hai.',
        hint: 'Install TypeScript with `npm install -D typescript` and use `npx tsc yourfile.ts` to see the compiler output.',
        hintHi: '\`npm install -D typescript\` se TypeScript install karo aur compiler ka output dekhne ke liye \`npx tsc yourfile.ts\` use karo.',
      },
      {
        task: 'Write three variables with `let` and no type annotation, letting TypeScript infer their types from string, number and boolean values. Then try reassigning each to a mismatched type and read the resulting error message closely.',
        taskHi: 'String, number aur boolean values se \`let\` ke saath teen variables likho, bina type annotation ke, TypeScript ko unke types infer karne do. Phir har ek ko galat-type se dobara assign karne ki koshish karo aur milne wale error message ko dhyan se padho.',
        hint: 'Hover over each variable name in a TypeScript-aware editor (VS Code) to see what type was inferred, without writing it yourself.',
        hintHi: 'Khud likhe bina, kaunsa type infer hua ye dekhne ke liye TypeScript-aware editor (VS Code) mein har variable naam par hover karo.',
      },
      {
        task: 'Write a function with an `any`-typed parameter and call several nonsense operations on it that should not make sense. Confirm they all compile without error, then add a proper type annotation and watch the same nonsense calls become errors.',
        taskHi: 'Ek \`any\`-typed parameter wala function likho aur uspar kai bemaani operations bulaao jo matlab nahi rakhne chahiye. Confirm karo ki wo sab bina error ke compile hote hain, phir ek sahi type annotation jodo aur dekho wahi bemaani calls errors ban jati hain.',
        hint: 'Try calling `.toUpperCase()` on an `any`-typed number and see that it compiles fine but would crash if actually run.',
        hintHi: '\`any\`-typed number par \`.toUpperCase()\` bulaane ki koshish karo aur dekho ki wo theek se compile hota hai par asal mein chalane par crash karega.',
      },
    ],

    keyTakeaways: [
      'TypeScript is JavaScript plus a type system checked by a compiler before the code runs — every type annotation is stripped out, and only plain JavaScript ever actually executes.',
      'Static typing (TypeScript) catches a type mismatch by reading the source code, before anything runs; dynamic typing (plain JavaScript) only discovers it by actually executing the broken line, sometimes in production, weeks later.',
      'Type inference means TypeScript often figures out a variable\'s type from its initial value with no annotation needed — but function parameters almost always need one, since there is no "right-hand side" value to infer from.',
      '`any` turns off type checking entirely for a value, silently recreating plain JavaScript\'s failure mode — it should be a rare, deliberate escape hatch, not a default.',
      'The value of a type system compounds as a codebase grows past what one person can hold in their head — it is how a function\'s expectations get communicated to a teammate who has never seen the code.',
    ],
    keyTakeawaysHi: [
      'TypeScript JavaScript plus ek type system hai jise compiler code chalne se pehle check karta hai — har type annotation nikaal diya jata hai, aur sirf saadhi JavaScript hi asal mein chalti hai.',
      'Static typing (TypeScript) type mismatch ko source code padh kar pakadta hai, kuch bhi chalne se pehle; dynamic typing (saadhi JavaScript) use sirf toothi hui line asal mein chala kar hi dhoondh pata hai, kabhi-kabhi production mein, hafton baad.',
      'Type inference ka matlab hai TypeScript aksar variable ka type uski shuruaati value se khud nikaal leta hai, koi annotation chahiye nahi — par function parameters ko lagbhag hamesha ek chahiye, kyunki infer karne ke liye koi "dayein taraf" ki value hai hi nahi.',
      '\`any\` kisi value ke liye type checking poori tarah band kar deta hai, chupchap saadhi JavaScript ka fail-hone wala tarika dobara banate hue — ise ek kam-istemal hone wala, jaan-boojh kar escape hatch hona chahiye, default nahi.',
      'Type system ki keemat tab badhti jati hai jab codebase ek insaan ke dimaag mein aa sakne se badi ho jati hai — isi se ek function ki ummeedein ek teammate tak pahunchti hain jisne code kabhi dekha hi nahi.',
    ],
  },
];
