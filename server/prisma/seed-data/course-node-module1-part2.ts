/**
 * Node.js Complete Course — Module 1: Fundamentals, lesson 2.
 *
 * CommonJS versus ES Modules — arguably the single most common source of
 * beginner confusion in real Node.js projects, since two completely
 * different module systems exist, look superficially similar, and produce
 * genuinely confusing error messages when mixed. The broken example uses
 * require() in a project configured for ES Modules, crashing immediately;
 * the second broken/fixed pair covers __dirname, which silently does not
 * exist in ESM at all.
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

export const NODE_MODULE_1_PART2: CourseLesson[] = [
  {
    slug: 'commonjs-vs-es-modules',
    title: 'CommonJS vs ES Modules: Why require() and import Do Not Mix',
    titleHi: 'CommonJS vs ES Modules: require() Aur import Kyun Nahi Milte',
    description: 'One line — `require("express")` — and the whole server refuses to even start, with an error that mentions nothing about Express at all.',
    descriptionHi: 'Ek line — `require("express")` — aur poora server shuru hi nahi hota, ek aisi error ke saath jo Express ke baare mein kuch batati hi nahi.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Two different countries with their own official languages, and a document written in the wrong one at the border.** CommonJS and ES Modules are like two separate countries that both happen to use similar-looking alphabets, but have entirely different official languages and paperwork systems — a form filled out correctly for Country A (`require()`, `module.exports`) means nothing at Country B\'s border, and a customs officer there does not "sort of understand it anyway"; they reject it outright, because the officer is specifically instructed to expect Country B\'s own official format (`import`, `export`) and nothing else. The file that says which country a particular piece of paperwork belongs to — a project\'s `package.json`, via its `"type"` field, or a file\'s own extension (`.cjs` vs `.mjs`) — is the passport stamp that tells the border officer which rulebook to apply before even looking at the content. Mixing the two, or forgetting to declare which country you are in, is precisely what produces confusing, seemingly unrelated rejections at the border.',
      hi: '**Do alag desh apni-apni official bhaashaon ke saath, aur border par galat bhaasha mein likha ek document.** CommonJS aur ES Modules do alag desh jaise hain jinke paas samyog se milte-julte alphabets hain, par poori tarah alag official bhaashaayen aur paperwork systems hain — Country A ke liye sahi tarike se bhara ek form (\`require()\`, \`module.exports\`) Country B ke border par kuch matlab nahi rakhta, aur wahan ka customs officer "waise bhi kuch samajh leta" nahi hai; wo use bilkul reject kar deta hai, kyunki officer ko khaas taur par Country B ke apne official format (\`import\`, \`export\`) ki ummeed karne aur kuch aur nahi karne ka nirdesh hai. Wo file jo batati hai ki koi khaas paperwork ka tukda kaunse desh ka hai — ek project ka \`package.json\`, uske \`"type"\` field ke through, ya ek file ka apna extension (\`.cjs\` vs \`.mjs\`) — wo passport stamp hai jo border officer ko batata hai content dekhne se pehle kaunsa rulebook lagu karna hai. Dono ko milaana, ya ye batana bhoolna ki aap kaunse desh mein hain, bilkul wahi confuse karti, dekhne mein na-judi border par rejections paida karta hai.',
    },

    simple: `**Start broken.** A brand-new Node.js project, \`package.json\` says it uses ES Modules, but the code is written the old, familiar way:

\`\`\`json
{
  "name": "my-server",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js"
}
\`\`\`

\`\`\`js
// index.js
const express = require("express");   // the "old" way — CommonJS

const app = express();
app.get("/", (req, res) => res.send("Hello"));
app.listen(3000);
\`\`\`

Running \`node index.js\` does not start the server. It crashes immediately, before a single line of the actual logic runs, with:

\`\`\`
ReferenceError: require is not defined in ES module scope, you can use import instead
\`\`\`

Nothing here is about Express, or the route, or the port — the error happens on the very first line, because \`"type": "module"\` in \`package.json\` tells Node "every \`.js\` file in this project is an ES Module," and \`require\` is a CommonJS-only function that simply does not exist in the ES Module world — it was never defined as a global there at all, the same way a word from one language genuinely does not exist as a word in a different one. This is one of the most common first-week errors for anyone starting a fresh Node.js project, precisely because \`require()\` is what nearly every Node.js tutorial and Stack Overflow answer from the last decade uses by default, without necessarily mentioning which module system it assumes.

**The fix: use the module syntax that actually matches \`package.json\`\'s \`"type"\` field**

\`\`\`js
// index.js — using import/export, matching "type": "module"
import express from "express";

const app = express();
app.get("/", (req, res) => res.send("Hello"));
app.listen(3000);
\`\`\`

\`\`\`ts
// index.ts — TypeScript compiled with a modern "module" setting in tsconfig.json
import express, { Request, Response } from "express";

const app = express();
app.get("/", (req: Request, res: Response): void => {
  res.send("Hello");
});
app.listen(3000);
\`\`\`

\`import express from "express"\` is the ES Module equivalent of \`const express = require("express")\` — both ultimately load the same \`express\` package, but each syntax only works inside the module system it belongs to. Node decides which system a given \`.js\` file belongs to primarily from \`package.json\`\'s \`"type"\` field: \`"type": "module"\` makes every \`.js\` file an ES Module (using \`import\`/\`export\`); omitting \`"type"\` entirely, or setting it to \`"commonjs"\`, makes every \`.js\` file CommonJS (using \`require\`/\`module.exports\`) — this is Node\'s default when \`"type"\` is absent, for backward compatibility with the many years of Node code written before ES Modules existed in Node at all.

**A file can also declare its own system independent of \`package.json\`, using its extension:** a \`.mjs\` file is always treated as an ES Module, and a \`.cjs\` file is always treated as CommonJS, regardless of what \`"type"\` says — this lets a single project mix both systems deliberately, file by file, when genuinely needed, rather than being locked into one choice for every file.`,

    simpleHi: `**Toote hue se shuru.** Ek bilkul naya Node.js project, \`package.json\` kehta hai ye ES Modules use karta hai, par code purane, jaane-pehchaane tarike se likha hai:

\`\`\`json
{
  "name": "my-server",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js"
}
\`\`\`

\`\`\`js
// index.js
const express = require("express");   // "purana" tarika — CommonJS

const app = express();
app.get("/", (req, res) => res.send("Hello"));
app.listen(3000);
\`\`\`

\`node index.js\` chalaana server shuru nahi karta. Ye turant crash ho jaata hai, asli logic ki ek bhi line chalne se pehle, is ke saath:

\`\`\`
ReferenceError: require is not defined in ES module scope, you can use import instead
\`\`\`

Yahan kuch bhi Express ke, route ke, ya port ke baare mein nahi hai, error bilkul pehli line par hota hai, kyunki \`package.json\` mein \`"type": "module"\` Node ko batata hai "is project ki har \`.js\` file ek ES Module hai," aur \`require\` ek CommonJS-only function hai jo ES Module wali duniya mein bilkul maujood hai hi nahi — ye wahan kabhi ek global ki tarah define hi nahi hua, bilkul jaise ek bhaasha ka ek shabd sach mein ek doosri bhaasha mein shabd ki tarah maujood nahi hota. Ye kisi bhi naye Node.js project shuru karne wale ke liye sabse aam pehle-hafte ki errors mein se ek hai, bilkul isliye kyunki \`require()\` wo hai jo lagbhag har Node.js tutorial aur pichle dashak ka Stack Overflow answer default roop se use karta hai, zaruri nahi ki wo bataaye kaunsa module system ye maan raha hai.

**Fix: wo module syntax use karo jo asal mein \`package.json\` ke \`"type"\` field se milta ho**

\`\`\`js
// index.js — import/export use karte hue, "type": "module" se milte hue
import express from "express";

const app = express();
app.get("/", (req, res) => res.send("Hello"));
app.listen(3000);
\`\`\`

\`\`\`ts
// index.ts — TypeScript, tsconfig.json mein ek modern "module" setting se compile hua
import express, { Request, Response } from "express";

const app = express();
app.get("/", (req: Request, res: Response): void => {
  res.send("Hello");
});
app.listen(3000);
\`\`\`

\`import express from "express"\` \`const express = require("express")\` ka ES Module barabar hai — dono aakhirkaar wahi \`express\` package load karte hain, par har syntax sirf us module system ke andar kaam karta hai jiska wo hissa hai. Node ye tay karta hai ki di gayi \`.js\` file kaunse system ki hai mukhya taur par \`package.json\` ke \`"type"\` field se: \`"type": "module"\` har \`.js\` file ko ek ES Module banaata hai (\`import\`/\`export\` use karte hue); \`"type"\` ko poori tarah chhod dena, ya use \`"commonjs"\` set karna, har \`.js\` file ko CommonJS banaata hai (\`require\`/\`module.exports\` use karte hue) — ye Node ka default hai jab \`"type"\` maujood nahi, ES Modules Node mein bilkul maujood hone se pehle likhe gaye kai saal ke Node code ke saath backward compatibility ke liye.

**Ek file apna khud ka system \`package.json\` se bekhabar bhi bata sakti hai, apne extension se:** ek \`.mjs\` file hamesha ES Module ki tarah maani jaati hai, aur ek \`.cjs\` file hamesha CommonJS ki tarah maani jaati hai, chahe \`"type"\` kuch bhi kahe — ye ek akele project ko dono systems ko jaan-boojhkar, file-dar-file, milaane deta hai jab sach mein zaruri ho, har file ke liye ek chunaav mein band hone ke bajaye.`,

    content: `## The two systems, side by side

\`\`\`js
// CommonJS: require() to import, module.exports to export
const fs = require("fs");
function add(a, b) { return a + b; }
module.exports = { add };
module.exports.PI = 3.14159;

// ES Modules: import/export as language keywords, not function calls
import fs from "fs";
export function add(a, b) { return a + b; }
export const PI = 3.14159;
\`\`\`

CommonJS (\`require\`/\`module.exports\`) is Node\'s original module system, present since Node\'s earliest versions, long before JavaScript itself had any built-in notion of modules at all — \`require\` and \`module.exports\` are ordinary JavaScript functions and objects Node makes available, not language syntax. ES Modules (\`import\`/\`export\`) are part of the JavaScript language specification itself (the same \`import\`/\`export\` syntax used in browser-based JavaScript and throughout the React course\'s examples), added to the language after CommonJS already existed, and later supported natively by Node itself. Both ultimately do the same conceptual job — sharing code between files — but they are structurally different systems with different rules, not two spellings of the same thing.

## A structural difference beyond syntax: synchronous versus asynchronous loading

\`\`\`js
// CommonJS: require() is SYNCHRONOUS — it blocks until the required file
// is fully loaded, which is why require() can be called conditionally or
// inside a function, mid-execution
if (someCondition) {
  const specialModule = require("./special");
}

// ES Modules: import is processed at parse time, before any code runs —
// this is why "import" statements cannot be conditional or inside a function
if (someCondition) {
  import specialModule from "./special";   // SyntaxError — not allowed here
}
\`\`\`

\`require()\` is an ordinary function call that runs synchronously, in the normal flow of your code, wherever it is written — this is why it can appear inside an \`if\` statement or a function body, loaded only when that line actually executes. \`import\` statements, by contrast, are handled during a separate, earlier parsing phase, before the file\'s own code starts running at all — the JavaScript engine scans the whole file for \`import\` statements first and resolves them, which is precisely why \`import\` must always appear at the top level of a file and can never be placed inside a conditional or a function (\`import()\` as a function call, distinct from the \`import\` statement, does exist for genuinely conditional, asynchronous loading — a separate feature from the static \`import\` syntax shown here).

## \`__dirname\` and \`__filename\`: available in CommonJS, missing in ES Modules

\`\`\`js
// CommonJS: __dirname and __filename are automatically available
console.log(__dirname);    // e.g., "/Users/jay/my-server"
console.log(__filename);   // e.g., "/Users/jay/my-server/index.js"
\`\`\`

\`\`\`js
// ES Modules: __dirname and __filename do NOT exist — using them throws
console.log(__dirname);   // ReferenceError: __dirname is not defined

// The ES Module replacement, reconstructing the same information:
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);   // same value as CommonJS's __dirname would have given
\`\`\`

\`__dirname\` (the directory containing the current file) and \`__filename\` (the current file\'s full path) are two of the most commonly used CommonJS-only globals, automatically injected by Node into every CommonJS module — genuinely useful for building file paths relative to the current file\'s location (loading a config file, serving static assets). Neither exists in ES Modules at all; the ES Module system instead exposes \`import.meta.url\` (a URL string identifying the current file), from which \`__filename\` and \`__dirname\`\'s equivalents must be manually reconstructed using Node\'s \`url\` and \`path\` modules, as shown above. This is a genuinely common paper-cut when migrating an existing CommonJS project to ES Modules — code that worked using \`__dirname\` needs this small but real adjustment.

## Interoperability: using a CommonJS package from an ES Module project, and vice versa

\`\`\`js
// An ES Module file CAN import a CommonJS package — Node handles this automatically
import express from "express";   // "express" itself is published as CommonJS; this still works

// But an ES Module CANNOT be require()'d from a CommonJS file directly
const myEsmPackage = require("some-esm-only-package");   // throws: "require() of ES Module not supported"
\`\`\`

Importing a CommonJS package from ES Module code generally works transparently — Node automatically wraps the CommonJS module so \`import\` can consume it, which is why \`import express from "express"\` works even though the \`express\` package itself is written in CommonJS internally. The reverse is NOT generally possible: a genuinely ES-Module-only package cannot be loaded with \`require()\` from CommonJS code, because \`require()\` is synchronous and ES Module loading is fundamentally asynchronous — there is no synchronous way to wait for it. This asymmetry is a real, practical consideration when choosing dependencies or deciding whether to migrate an existing CommonJS project to ES Modules.

## TypeScript: \`tsconfig.json\`\'s \`"module"\` setting controls which syntax compiles to what

\`\`\`json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022"
  }
}
\`\`\`

TypeScript lets you write \`import\`/\`export\` syntax regardless of which module system the compiled output actually targets — the \`"module"\` setting in \`tsconfig.json\` controls whether TypeScript compiles that \`import\`/\`export\` syntax down to CommonJS\'s \`require\`/\`module.exports\` or leaves it as genuine ES Module \`import\`/\`export\` in the output. \`"module": "NodeNext"\` (paired with \`"moduleResolution": "NodeNext"\`) is the modern, recommended setting for Node.js projects specifically because it makes TypeScript respect the SAME \`package.json\` \`"type"\` field Node itself uses, compiling each file to match whichever system that file actually belongs to — this keeps TypeScript\'s module behavior consistent with plain Node.js\'s own rules covered throughout this lesson, rather than TypeScript silently assuming one system regardless of the project\'s actual configuration.`,

    contentHi: `## Dono systems, saath-saath

\`\`\`js
// CommonJS: import karne ke liye require(), export karne ke liye module.exports
const fs = require("fs");
function add(a, b) { return a + b; }
module.exports = { add };
module.exports.PI = 3.14159;

// ES Modules: import/export bhaasha keywords ki tarah, function calls nahi
import fs from "fs";
export function add(a, b) { return a + b; }
export const PI = 3.14159;
\`\`\`

CommonJS (\`require\`/\`module.exports\`) Node ka asli module system hai, Node ke shuruaati versions se maujood, JavaScript ke apne paas modules ka koi built-in soch hone se bahut pehle — \`require\` aur \`module.exports\` aam JavaScript functions aur objects hain jo Node maujood karaata hai, bhaasha syntax nahi. ES Modules (\`import\`/\`export\`) khud JavaScript language specification ka hissa hain (wahi \`import\`/\`export\` syntax jo browser-based JavaScript mein aur poore React course ke examples mein use hua), CommonJS ke pehle se maujood hone ke baad bhaasha mein joda gaya, aur baad mein Node ne khud natively support kiya. Dono aakhirkaar wahi conceptual kaam karte hain — files ke beech code share karna — par wo structurally alag systems hain alag niyamon ke saath, ek hi cheez ki do spellings nahi.

## Syntax se aage ek structural fark: synchronous versus asynchronous loading

\`\`\`js
// CommonJS: require() SYNCHRONOUS hai — ye tab tak block karta hai jab tak required
// file poori tarah load nahi ho jaati, aur bilkul isi wajah se require() ko conditionally
// ya function ke andar, chalte-chalte bulaya ja sakta hai
if (someCondition) {
  const specialModule = require("./special");
}

// ES Modules: import parse time par process hota hai, kisi bhi code chalne se pehle —
// bilkul isi wajah se "import" statements conditional ya function ke andar nahi ho sakte
if (someCondition) {
  import specialModule from "./special";   // SyntaxError — yahan allowed nahi
}
\`\`\`

\`require()\` ek aam function call hai jo synchronously chalta hai, aapke code ke normal flow mein, jahan bhi likha ho — bilkul isi wajah se ye ek \`if\` statement ya function body ke andar dikh sakta hai, sirf tab load hote hue jab wo line asal mein chalti hai. \`import\` statements, iske ulat, ek alag, pehle parsing phase ke dauran sambhaale jaate hain, file ke apne code ke bilkul chalna shuru karne se pehle — JavaScript engine poori file ko pehle \`import\` statements ke liye scan karta hai aur unhe resolve karta hai, aur bilkul isi wajah se \`import\` ko hamesha file ke top level par hona chahiye aur kabhi kisi conditional ya function ke andar nahi rakha ja sakta (\`import()\` ek function call ki tarah, \`import\` statement se alag, sach mein conditional, asynchronous loading ke liye maujood hai — yahan dikhaaye static \`import\` syntax se ek alag feature).

## \`__dirname\` aur \`__filename\`: CommonJS mein maujood, ES Modules mein missing

\`\`\`js
// CommonJS: __dirname aur __filename apne aap maujood hain
console.log(__dirname);    // jaise, "/Users/jay/my-server"
console.log(__filename);   // jaise, "/Users/jay/my-server/index.js"
\`\`\`

\`\`\`js
// ES Modules: __dirname aur __filename maujood NAHI hain — inhe use karna throw karta hai
console.log(__dirname);   // ReferenceError: __dirname is not defined

// ES Module replacement, wahi jaankaari dobara banaate hue:
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);   // CommonJS ka __dirname jo value deta wahi value
\`\`\`

\`__dirname\` (abhi ki file rakhta directory) aur \`__filename\` (abhi ki file ka poora path) sabse aam istemal hone wale CommonJS-only globals mein se do hain, Node dwara apne aap har CommonJS module mein daale gaye — abhi ki file ki location ke muqable file paths banaane ke liye sach mein kaam ke (config file load karna, static assets serve karna). Dono ES Modules mein bilkul maujood nahi hain; ES Module system iske bajaye \`import.meta.url\` deta hai (abhi ki file pehchaanta ek URL string), jisse \`__filename\` aur \`__dirname\` ke barabar Node ke \`url\` aur \`path\` modules se haath se dobara banaane chahiye, upar dikhaaye hue. Ye ek sach mein aam paper-cut hai jab ek maujood CommonJS project ko ES Modules mein migrate kiya jaaye — code jo \`__dirname\` use karke kaam karta tha use ye chhota par asli adjustment chahiye.

## Interoperability: ES Module project se CommonJS package use karna, aur ulta

\`\`\`js
// Ek ES Module file CommonJS package import KAR SAKTI HAI — Node ise apne aap sambhaalta hai
import express from "express";   // "express" khud CommonJS ki tarah publish hui hai; ye phir bhi kaam karta hai

// Par ek ES Module CommonJS file se seedha require() NAHI ho sakta
const myEsmPackage = require("some-esm-only-package");   // throw karta hai: "require() of ES Module not supported"
\`\`\`

ES Module code se ek CommonJS package import karna aam taur par pardarshi tarike se kaam karta hai — Node apne aap CommonJS module ko lapetta hai taaki \`import\` use consume kar sake, aur bilkul isi wajah se \`import express from "express"\` kaam karta hai chahe \`express\` package khud andar CommonJS mein likha ho. Ulta AAM TAUR PAR mumkin NAHI hai: ek sach mein sirf-ES-Module wala package CommonJS code se \`require()\` se load nahi ho sakta, kyunki \`require()\` synchronous hai aur ES Module loading buniyaadi taur par asynchronous hai — uska intezaar karne ka koi synchronous tarika nahi hai. Ye asymmetry dependencies chunte waqt ya ek maujood CommonJS project ko ES Modules mein migrate karne ka faisla karte waqt ek asli, practical baat hai.

## TypeScript: \`tsconfig.json\` ki \`"module"\` setting control karti hai kaunsa syntax kya banta hai

\`\`\`json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022"
  }
}
\`\`\`

TypeScript aapko \`import\`/\`export\` syntax likhne deta hai chahe compiled output asal mein kaunsa module system target kare — \`tsconfig.json\` mein \`"module"\` setting control karti hai ki TypeScript us \`import\`/\`export\` syntax ko CommonJS ke \`require\`/\`module.exports\` mein compile kare ya use output mein asli ES Module \`import\`/\`export\` ki tarah chhod de. \`"module": "NodeNext"\` (\`"moduleResolution": "NodeNext"\` ke saath jodi hui) Node.js projects ke liye modern, sujhaayi hui setting hai khaas taur par isliye kyunki ye TypeScript ko WAHI \`package.json\` ke \`"type"\` field ka aadar karaati hai jo Node khud use karta hai, har file ko us system ke hisaab se compile karte hue jiski wo file asal mein hai — ye TypeScript ke module behaviour ko saadhe Node.js ke apne niyamon ke saath sangat rakhta hai jo is poore lesson mein cover hue, TypeScript ke chupchap ek system maan lene ke bajaye chahe project ki asli configuration kuch bhi ho.`,

    examples: [
      {
        title: 'Broken: require() inside a "type": "module" project',
        titleHi: 'Toota: "type": "module" wale project ke andar require()',
        code: `// package.json: { "type": "module" }
const express = require("express");   // ReferenceError: require is not defined`,
        codeJs: `// package.json
// { "name": "my-server", "type": "module" }

// index.js
const express = require("express");

const app = express();
app.get("/", (req, res) => res.send("Hello"));
app.listen(3000);
// Crashes immediately: "ReferenceError: require is not defined in ES
// module scope, you can use import instead"`,
        codeTs: `// package.json
// { "name": "my-server", "type": "module" }

// index.ts (compiled with a CommonJS-targeting tsconfig, mismatched
// against package.json's "type": "module")
import express, { Request, Response } from "express";
const app = express();
app.get("/", (req: Request, res: Response): void => res.send("Hello"));
app.listen(3000);
// TypeScript compiles this without error, but the OUTPUT .js file may
// contain require() calls if tsconfig's "module" setting does not
// match package.json's "type" — the mismatch surfaces at runtime, not
// at compile time, in exactly the same way as the plain JS version.`,
        output: `node index.js immediately exits with:
ReferenceError: require is not defined in ES module scope, you can use
import instead
    at file:///.../index.js:1
— no route, no port, nothing about Express itself; the crash happens
on line 1, before any of the actual application code runs.`,
        explain: 'The error message itself directly names the fix ("you can use import instead") — this is one of Node\'s more helpful error messages specifically because this exact mistake is so common among developers moving between older CommonJS tutorials and newer ES-Module-configured projects.',
        explainHi: 'Error message khud seedha fix ka naam leta hai ("you can use import instead") — ye Node ke zyada kaam ke error messages mein se ek hai khaas taur par isliye kyunki bilkul yahi galti purane CommonJS tutorials aur naye ES-Module-configured projects ke beech move karte developers mein itni aam hai.',
      },
      {
        title: 'Fixed: import/export matching the project\'s module type',
        titleHi: 'Theek: project ke module type se milta import/export',
        code: `// package.json: { "type": "module" }
import express from "express";   // matches "type": "module"`,
        codeJs: `// package.json
// { "name": "my-server", "type": "module" }

// index.js
import express from "express";

const app = express();
app.get("/", (req, res) => res.send("Hello"));
app.listen(3000);
// Starts correctly — the syntax now matches "type": "module".`,
        codeTs: `// tsconfig.json: { "compilerOptions": { "module": "NodeNext", "moduleResolution": "NodeNext" } }
// package.json: { "type": "module" }

import express, { Request, Response } from "express";

const app = express();
app.get("/", (req: Request, res: Response): void => {
  res.send("Hello");
});
app.listen(3000);`,
        outputJs: `node index.js starts the server correctly — no error, "Hello" is
served at "/" as expected, because the import syntax and package.json's
"type": "module" now agree with each other.`,
        outputTs: `// "module": "NodeNext" in tsconfig.json makes TypeScript compile this
// file's import/export syntax consistently with package.json's own
// "type" field — the same rule Node itself follows for plain .js
// files, now respected by the TypeScript compiler too.`,
        explain: 'Nothing about Express or the route logic changed at all — the entire fix is switching one line\'s syntax (require -> import) to match a configuration file (package.json\'s "type") that was already there.',
        explainHi: 'Express ya route logic ke baare mein kuch bhi bilkul nahi badla — poora fix ek line ka syntax badalna hai (require -> import) ek aisi configuration file (package.json ka "type") se milaane ke liye jo pehle se wahin thi.',
      },
      {
        title: '__dirname does not exist in ES Modules',
        titleHi: '__dirname ES Modules mein maujood nahi hai',
        code: `// ES Module file:
console.log(__dirname);   // ReferenceError: __dirname is not defined`,
        codeJs: `// package.json: { "type": "module" }

// index.js
import path from "path";

console.log(__dirname);   // ReferenceError: __dirname is not defined
const configPath = path.join(__dirname, "config.json");   // never reached`,
        codeTs: `// package.json: { "type": "module" }

import path from "path";

console.log(__dirname);   // TypeScript itself may flag this as "Cannot
                            // find name '__dirname'" at compile time,
                            // depending on the configured @types —
                            // either way it fails, just at a different stage.
const configPath = path.join(__dirname, "config.json");`,
        output: `Running this ES Module file throws "ReferenceError: __dirname is not
defined" the moment console.log(__dirname) executes — __dirname was
never injected into this file's scope at all, unlike in a CommonJS
file where it is automatically available.`,
        explain: 'This is a genuinely common surprise specifically for developers migrating an existing CommonJS project to ES Modules — code that worked perfectly for years using __dirname suddenly breaks, purely because of the module system switch, with no other change to the logic.',
        explainHi: 'Ye ek sach mein aam ashcharya hai khaas taur par un developers ke liye jo ek maujood CommonJS project ko ES Modules mein migrate kar rahe hain — code jo saalon se \`__dirname\` use karke bilkul theek chalta tha achaanak toot jaata hai, poori tarah module system switch ki wajah se, logic mein kisi aur badlaav ke bina.',
      },
      {
        title: 'Fixed: reconstructing __dirname in ES Modules',
        titleHi: 'Theek: ES Modules mein __dirname dobara banaana',
        code: `import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);`,
        codeJs: `// package.json: { "type": "module" }

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);   // now works
const configPath = path.join(__dirname, "config.json");`,
        codeTs: `import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

console.log(__dirname);
const configPath: string = path.join(__dirname, "config.json");`,
        outputJs: `console.log(__dirname) now correctly prints the directory containing
this file, exactly matching what CommonJS's automatic __dirname would
have given — the reconstruction is manual, but the resulting value is
identical.`,
        outputTs: `// Identical behaviour. Explicitly typing "__filename: string" and
// "__dirname: string" here is optional (TypeScript infers both
// correctly from fileURLToPath/dirname's own return types) but shown
// for clarity.`,
        explain: 'import.meta.url is the ES Module system\'s own way of exposing "which file is this", analogous in purpose to CommonJS\'s automatic __filename, just requiring two extra utility calls (fileURLToPath, dirname) to reach the exact same information.',
        explainHi: '\`import.meta.url\` ES Module system ka apna tarika hai "ye kaunsi file hai" dikhaane ka, maqsad mein CommonJS ke apne aap wale \`__filename\` jaisa hi, bas do extra utility calls (\`fileURLToPath\`, \`dirname\`) maangte hue bilkul wahi jaankaari tak pahunchne ke liye.',
      },
    ],

    mistakes: [
      {
        wrong: `// package.json has "type": "module"
const express = require("express");   // require does not exist in ESM`,
        right: `// package.json has "type": "module"
import express from "express";`,
        why: 'require() is a CommonJS-only function, never defined as a global in the ES Module system at all — "type": "module" in package.json commits every .js file in the project to the ES Module world, where require() simply does not exist.',
        whyHi: '\`require()\` ek CommonJS-only function hai, ES Module system mein kabhi ek global ki tarah define hi nahi hua — package.json mein \`"type": "module"\` project ki har \`.js\` file ko ES Module wali duniya ke liye commit kar deta hai, jahan \`require()\` bilkul maujood hi nahi hai.',
      },
      {
        wrong: `if (process.env.NODE_ENV === "development") {
  import devTools from "./dev-tools.js";   // SyntaxError — import cannot be conditional
}`,
        right: `if (process.env.NODE_ENV === "development") {
  const devTools = await import("./dev-tools.js");   // dynamic import() function — this IS allowed conditionally
}`,
        why: 'The static "import" statement is resolved during parsing, before any code runs, and can never appear conditionally or inside a function — the separate dynamic import() function call exists specifically for genuinely conditional or lazy loading in ES Modules.',
        whyHi: 'Static \`import\` statement parsing ke dauran resolve hota hai, koi code chalne se pehle, aur kabhi conditionally ya function ke andar nahi aa sakta — alag dynamic \`import()\` function call khaas taur par ES Modules mein sach mein conditional ya lazy loading ke liye maujood hai.',
      },
      {
        wrong: `// ES Module file
const configPath = path.join(__dirname, "config.json");   // __dirname is undefined here`,
        right: `import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, "config.json");`,
        why: '__dirname is a CommonJS-only automatic global — it is never injected into ES Module files, so using it there throws a ReferenceError; the equivalent information must be manually reconstructed from import.meta.url.',
        whyHi: '\`__dirname\` ek CommonJS-only apne-aap wala global hai — ye ES Module files mein kabhi inject nahi hota, isliye wahan use karna ek ReferenceError throw karta hai; barabar jaankaari \`import.meta.url\` se haath se dobara banaani chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**"require is not defined in ES module scope" is one of the most frequently searched Node.js error messages online**, precisely because it is the very first error a huge fraction of developers hit when starting a fresh project scaffolded with "type": "module" while still writing code from muscle memory built on years of CommonJS tutorials.',
        hi: '**"require is not defined in ES module scope" online sabse aksar search hone wale Node.js error messages mein se ek hai**, bilkul isliye kyunki ye bahut se developers ka bilkul pehla error hai jo "type": "module" se scaffold hue ek naye project shuru karte hain jabki abhi bhi saalon ke CommonJS tutorials par bane muscle memory se code likh rahe hain.',
      },
      {
        en: '**Most modern Node.js project generators and starter templates default to ES Modules ("type": "module") specifically because ES Modules are the JavaScript language\'s own official module system**, shared with browser JavaScript, while CommonJS remains widespread mainly through the enormous body of existing packages and tutorials predating ES Modules\' Node support.',
        hi: '**Zyadatar modern Node.js project generators aur starter templates ES Modules ("type": "module") par default hote hain khaas taur par isliye kyunki ES Modules JavaScript language ka apna official module system hai**, browser JavaScript ke saath share hua, jabki CommonJS zyaada taur par maujood packages aur tutorials ki bahut badi tadaad se badi taur par phaila hua hai jo ES Modules ke Node support se pehle ki hai.',
      },
      {
        en: '**Real production incidents from mismatched module systems most commonly appear when adding a new dependency that happens to be published as ES-Module-only to an older CommonJS project** — the resulting "require() of ES Module not supported" error is a well-documented category of dependency-upgrade breakage across the ecosystem.',
        hi: '**Bemel module systems se asli production incidents sabse aksar tab dikhte hain jab ek naya dependency jodo jo samyog se sirf-ES-Module ki tarah publish hua ho ek purane CommonJS project mein** — nateeja hua "require() of ES Module not supported" error poore ecosystem mein dependency-upgrade breakage ki ek achhi tarah documented kism hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does calling require() inside a file governed by "type": "module" throw a ReferenceError, rather than simply not finding the requested package?',
        qHi: '"type": "module" ke tahat aane wali file ke andar \`require()\` bulaana ReferenceError kyun throw karta hai, maangi gayi package na milne ke bajaye?',
        a: 'The error is a ReferenceError specifically because "require" itself, as an identifier, does not exist anywhere in the ES Module execution environment at all — it is not that Node looked for a function called require and failed to find the requested package; it is that the name "require" was never defined as a variable, function, or global of any kind in this context to begin with. In CommonJS, Node automatically injects require (along with module, exports, __dirname, and __filename) into every module\'s scope before that module\'s code runs, making it available as if it were a built-in. ES Modules use an entirely different scope-setup process that does not perform this injection at all, since ES Modules have their own native import/export mechanism that makes require unnecessary and, by design, absent — attempting to reference an identifier that was never defined anywhere in the current scope or any enclosing scope is precisely what a ReferenceError means.',
        aHi: 'Error khaas taur par ek ReferenceError hai kyunki "require" khud, ek identifier ki tarah, ES Module execution environment mein kahin bhi maujood hai hi nahi — ye aisa nahi hai ki Node ne require naam ka ek function dhoondha aur maangi gayi package dhoondhne mein fail hua; ye hai ki naam "require" is context mein shuru se hi kisi bhi kism ka variable, function, ya global ki tarah define hua hi nahi. CommonJS mein, Node apne aap \`require\` (\`module\`, \`exports\`, \`__dirname\`, aur \`__filename\` ke saath) ko har module ke scope mein inject karta hai us module ka code chalne se pehle, ise aisa maujood karaate hue jaise ye ek built-in ho. ES Modules ek poori tarah alag scope-setup process use karte hain jo ye injection bilkul nahi karta, kyunki ES Modules ke paas apna khud ka native import/export mechanism hai jo \`require\` ko bekaar aur, design se, gair-maujood banaata hai — abhi ke scope ya kisi bhi lapetne wale scope mein kabhi define na hue kisi identifier ko reference karne ki koshish bilkul wahi hai jiska matlab ReferenceError hota hai.',
      },
      {
        q: 'Why must import statements always appear at the top level of a file, never conditionally or inside a function, while require() calls can appear anywhere?',
        qHi: 'Import statements ko hamesha file ke top level par hi kyun hona chahiye, kabhi conditionally ya function ke andar nahi, jabki require() calls kahin bhi dikh sakte hain?',
        a: 'require() is an ordinary JavaScript function call, executed synchronously as part of the normal, sequential flow of code — like any other function call, it runs exactly when the line containing it is reached during execution, which means it can legally appear inside an if statement, a loop, or a function body, and will only actually execute if that code path is reached. The static import statement, by contrast, is not a function call at all — it is dedicated language syntax that a JavaScript engine processes during a separate parsing phase, scanning the entire file for import statements and resolving all of a module\'s dependencies BEFORE any of that module\'s own code begins executing. Because this resolution happens ahead of and independently from the actual runtime control flow (if statements, loops, function calls), an import statement cannot meaningfully be made conditional — the engine needs to know a file\'s complete set of dependencies statically, at parse time, which is fundamentally incompatible with a dependency whose necessity might only be determined by a runtime condition. The separate dynamic import() function exists specifically to provide conditional, runtime-determined loading within the ES Module system, using a genuinely different mechanism (returning a Promise) than the static import statement.',
        aHi: '\`require()\` ek aam JavaScript function call hai, synchronously chalta hai code ke normal, kramwaar flow ke hisse ki tarah — kisi bhi doosre function call ki tarah, ye bilkul tab chalta hai jab use rakhti line execution ke dauran pahunchi jaati hai, matlab ye ek \`if\` statement, ek loop, ya ek function body ke andar sahi tarike se dikh sakta hai, aur sirf tab asal mein chalega jab wo code path pahunche. Static \`import\` statement, iske ulat, bilkul function call nahi hai — ye dedicated language syntax hai jise JavaScript engine ek alag parsing phase ke dauran process karta hai, poori file ko \`import\` statements ke liye scan karte hue aur module ki saari dependencies ko us module ka apna code chalna shuru hone se PEHLE resolve karte hue. Chunki ye resolution asli runtime control flow (if statements, loops, function calls) se pehle aur alag hota hai, ek \`import\` statement ko matlabi tarike se conditional banaya hi nahi ja sakta — engine ko file ki dependencies ka poora set statically, parse time par, jaanna zaruri hai, jo ek aisi dependency se buniyaadi taur par asangat hai jiski zarurat sirf ek runtime condition se tay ho sake. Alag dynamic \`import()\` function khaas taur par ES Module system ke andar conditional, runtime-tay-hui loading dene ke liye maujood hai, ek sach mein alag mechanism use karte hue (ek Promise lautaate hue) static \`import\` statement se.',
      },
      {
        q: 'Why does __dirname not exist in ES Modules, and what specifically must be done to reconstruct the same information there?',
        qHi: '\`__dirname\` ES Modules mein kyun maujood nahi hai, aur wahan wahi jaankaari dobara banaane ke liye khaas taur par kya karna chahiye?',
        a: '__dirname is not a language feature — it is a convenience value Node itself automatically constructs and injects into the local scope of every CommonJS module, specifically as part of how CommonJS modules are set up before their code runs. ES Modules are set up through an entirely different mechanism, one that does not perform this particular injection at all, so __dirname (along with __filename) is simply never made available there — this is not a bug or oversight, it reflects that the two module systems have genuinely different scope-setup implementations. ES Modules instead expose import.meta.url, a URL-formatted string identifying the current module\'s own location, from which the equivalent plain file-system path information must be manually derived: passing import.meta.url through the url module\'s fileURLToPath function converts it to a regular file path (equivalent to __filename), and passing that result through the path module\'s dirname function extracts the containing directory (equivalent to __dirname) — two explicit utility calls standing in for what CommonJS previously provided as an automatic global.',
        aHi: '\`__dirname\` koi bhaasha feature nahi hai — ye ek suvidha value hai jise Node khud apne aap banaata aur har CommonJS module ke local scope mein inject karta hai, khaas taur par CommonJS modules kaise set up hote hain unka hissa ki tarah unka code chalne se pehle. ES Modules ek poori tarah alag mechanism se set up hote hain, ek jo ye khaas injection bilkul nahi karta, isliye \`__dirname\` (\`__filename\` ke saath) wahan bilkul maujood karaaya hi nahi jaata — ye koi bug ya chook nahi hai, ye ye darzha karta hai ki dono module systems ki sach mein alag scope-setup implementations hain. ES Modules iske bajaye \`import.meta.url\` dete hain, ek URL-formatted string jo abhi ke module ki apni location pehchaanta hai, jisse barabar saadhi file-system path jaankaari haath se nikaalni chahiye: \`import.meta.url\` ko \`url\` module ke \`fileURLToPath\` function se guzaarna ise ek aam file path mein badal deta hai (\`__filename\` ke barabar), aur us nateeje ko \`path\` module ke \`dirname\` function se guzaarna rakhne wali directory nikaalta hai (\`__dirname\` ke barabar) — do explicit utility calls jo CommonJS pehle ek apne-aap wale global ki tarah dete the uski jagah lete hue.',
      },
      {
        q: 'Why can an ES Module import a CommonJS package, but a CommonJS file generally cannot require() a package published as ES-Module-only?',
        qHi: 'Ek ES Module CommonJS package import kyun kar sakta hai, par ek CommonJS file aam taur par sirf-ES-Module ki tarah publish hui package \`require()\` kyun nahi kar sakti?',
        a: 'Node includes built-in interoperability support that allows ES Module code to import a CommonJS module transparently — when import encounters a CommonJS module, Node wraps that module\'s module.exports so it can be consumed through the ES Module import syntax, effectively translating between the two systems in that one direction automatically. The reverse direction faces a fundamental, structural obstacle rather than a missing feature: require() is a synchronous function call that must return the requested module\'s exports immediately, within the same synchronous line of execution, but ES Module loading is inherently asynchronous by design (partly because ES Modules can themselves contain top-level await, and partly because of how the module resolution and linking process works) — there is no synchronous way to wait for an inherently asynchronous loading process to complete, which is why attempting to require() a genuinely ES-Module-only package throws an explicit "require() of ES Module not supported" error rather than silently working through some automatic conversion the way the reverse direction does.',
        aHi: 'Node built-in interoperability support shaamil karta hai jo ES Module code ko ek CommonJS module pardarshi tarike se import karne deta hai — jab \`import\` ek CommonJS module se milta hai, Node us module ke \`module.exports\` ko lapetta hai taaki use ES Module \`import\` syntax se consume kiya ja sake, us ek disha mein do systems ke beech asar mein apne aap tarjuma karte hue. Ulti disha ko ek buniyaadi, structural rukaawat ka saamna hai, ek missing feature ke bajaye: \`require()\` ek synchronous function call hai jise maangi gayi module ka exports turant lautaana chahiye, execution ki usi synchronous line ke andar, par ES Module loading design se buniyaadi taur par asynchronous hai (aansik roop se kyunki ES Modules khud top-level \`await\` rakh sakte hain, aur aansik roop se module resolution aur linking process kaise kaam karta hai iski wajah se) — ek buniyaadi taur par asynchronous loading process ke poora hone ka intezaar karne ka koi synchronous tarika nahi, aur bilkul isi wajah se sirf-ES-Module wali package ko \`require()\` karne ki koshish ek explicit "require() of ES Module not supported" error throw karti hai, ulti disha jaise kisi apne-aap wale conversion se chupchap kaam karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Create a new project with "type": "module" in package.json, then write index.js using require("express"). Run it and read the exact error message produced.',
        taskHi: 'Ek naya project banao package.json mein "type": "module" ke saath, phir index.js likho require("express") use karke. Ise chalaao aur nateeja hua bilkul error message padho.',
        hint: 'Try removing "type": "module" entirely (Node\'s default is CommonJS) and confirm the exact same require() call now works without any code changes at all.',
        hintHi: '"type": "module" ko poori tarah hataane ki koshish karo (Node ka default CommonJS hai) aur confirm karo bilkul wahi require() call ab bina kisi code badlaav ke kaam karta hai.',
      },
      {
        task: 'Fix the broken project by switching to import syntax. Confirm the server starts correctly, then try mixing one require() call alongside working import statements in the same file and observe what happens.',
        taskHi: 'Import syntax mein switch karke toota project theek karo. Confirm karo server sahi tarike se shuru hota hai, phir usi file mein kaam karti import statements ke saath ek require() call milaane ki koshish karo aur dekho kya hota hai.',
        hint: 'Note that the error appears at the exact require() line, not at the top of the file — confirming import statements above it were processed successfully before the mismatched require() was reached.',
        hintHi: 'Dhyaan do error bilkul \`require()\` line par dikhta hai, file ke upar nahi — confirm karte hue ki uske upar wali import statements bemel \`require()\` tak pahunchne se pehle safalta se process hui thi.',
      },
      {
        task: 'Build a small ES Module file that logs __dirname directly (confirm the ReferenceError), then fix it using fileURLToPath and dirname, and confirm the printed path matches what a CommonJS version of the same file would have printed.',
        taskHi: 'Ek chhota ES Module file banao jo seedha __dirname log kare (ReferenceError confirm karo), phir use fileURLToPath aur dirname se theek karo, aur confirm karo print hua path usi file ke CommonJS version ne jo print kiya hota usse milta hai.',
        hint: 'Print import.meta.url itself first, before converting it, to see the raw URL-formatted string fileURLToPath is actually converting.',
        hintHi: '\`import.meta.url\` ko khud pehle print karo, use convert karne se pehle, dekhne ke liye \`fileURLToPath\` asal mein kaunsi raw URL-formatted string convert kar raha hai.',
      },
    ],

    keyTakeaways: [
      'CommonJS (require/module.exports) and ES Modules (import/export) are two structurally different module systems, not two spellings of the same thing — code written for one throws real errors when run under the other.',
      'package.json\'s "type" field ("module" or "commonjs"/absent) determines which system every .js file in a project belongs to; individual .mjs and .cjs files declare their own system regardless of "type".',
      'require() is a synchronous function call that can appear conditionally or inside a function; the static import statement is resolved during parsing before any code runs, and can never be conditional — dynamic import() exists separately for that need.',
      '__dirname and __filename are CommonJS-only automatic globals, absent entirely from ES Modules — the equivalent information must be manually derived from import.meta.url using the url and path modules.',
      'An ES Module can transparently import a CommonJS package (Node handles the conversion automatically), but a CommonJS file generally cannot require() a genuinely ES-Module-only package, since require() is synchronous and ES Module loading is inherently asynchronous.',
      'TypeScript\'s tsconfig.json "module" setting (ideally "NodeNext") controls whether import/export syntax compiles to CommonJS or stays as ES Modules — setting it to match package.json\'s "type" keeps TypeScript\'s behavior consistent with plain Node.js.',
    ],
    keyTakeawaysHi: [
      'CommonJS (require/module.exports) aur ES Modules (import/export) do structurally alag module systems hain, ek hi cheez ki do spellings nahi — ek ke liye likha code doosre ke tahat chalne par asli errors deta hai.',
      'package.json ka "type" field ("module" ya "commonjs"/gair-maujood) tay karta hai project ki har .js file kaunse system ki hai; alag-alag .mjs aur .cjs files apna khud ka system batati hain "type" se bekhabar.',
      '\`require()\` ek synchronous function call hai jo conditionally ya function ke andar dikh sakta hai; static \`import\` statement parsing ke dauran resolve hota hai koi code chalne se pehle, aur kabhi conditional nahi ho sakta — dynamic \`import()\` alag se us zarurat ke liye maujood hai.',
      '\`__dirname\` aur \`__filename\` CommonJS-only apne-aap wale globals hain, ES Modules mein poori tarah gair-maujood — barabar jaankaari \`import.meta.url\` se \`url\` aur \`path\` modules use karke haath se nikaalni chahiye.',
      'Ek ES Module ek CommonJS package pardarshi tarike se import kar sakta hai (Node conversion apne aap sambhaalta hai), par ek CommonJS file aam taur par sirf-ES-Module wali package \`require()\` nahi kar sakti, kyunki \`require()\` synchronous hai aur ES Module loading buniyaadi taur par asynchronous hai.',
      'TypeScript ki tsconfig.json ki "module" setting (aadarsh roop se "NodeNext") control karti hai ki import/export syntax CommonJS mein compile hoti hai ya ES Modules ki tarah rehti hai — ise package.json ke "type" se milaana TypeScript ke behaviour ko saadhe Node.js ke saath sangat rakhta hai.',
    ],
  },
];
