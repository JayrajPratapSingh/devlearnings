/**
 * Node.js Complete Course — Module 2: Building APIs with Express, lesson 1.
 *
 * Express routing and middleware fundamentals. The broken example is a
 * middleware function that forgets to call next() — the single most common
 * first Express mistake, causing every request passing through it to hang
 * forever with no response and no error, since Express has no way of
 * knowing the middleware author intended to continue the chain.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes. Also scan with a Python regex for stray
 * Devanagari characters before seeding (this course has repeatedly needed
 * targeted fixes even after careful writing).
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_2: CourseLesson[] = [
  {
    slug: 'express-routing-middleware-fundamentals',
    title: 'Express Routing and Middleware Fundamentals',
    titleHi: 'Express Routing Aur Middleware Ki Buniyaad',
    description: 'A request that never gets a response — not an error, not a crash, just silence until the browser eventually gives up and times out.',
    descriptionHi: 'Ek request jise kabhi jawaab nahi milta — na koi error, na crash, bas khaamoshi jab tak browser aakhirkaar haar maankar timeout na ho jaaye.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 1,

    analogy: {
      en: '**A relay race where one runner forgets to hand off the baton.** Express middleware is a relay race: an incoming request is the baton, and each middleware function is one runner in the chain, each doing its own small piece of work (checking something, logging something, transforming something) before physically handing the baton to the next runner in line. A runner who does their own job perfectly — checks their assigned thing, does it correctly — but then simply stands there afterward, baton in hand, without passing it on, brings the entire race to a permanent stop: every runner still waiting further down the line stays waiting forever, not because anything went wrong with their own leg of the race, but because the baton itself never physically reached them. Calling \`next()\` inside a middleware function is that hand-off — nothing else in Express moves the request forward to the next step; without it, the chain simply stops exactly where that one runner stood still.',
      hi: '**Ek relay race jahan ek runner baton hand-off karna bhool jaata hai.** Express middleware ek relay race hai: aati hui request baton hai, aur har middleware function line mein ek runner hai, har ek apna khud ka chhota kaam karta hua (kuch check karna, kuch log karna, kuch transform karna) baton ko line ke agle runner ko physically thamaane se pehle. Ek runner jo apna kaam bilkul theek karta hai — apni sonpi hui cheez check karta hai, use sahi tarike se karta hai — par phir uske baad bas wahin khada rehta hai, baton haath mein liye, use aage bataaye bina, poori race ko hamesha ke liye rok deta hai: line mein aage intezaar kar rahe har runner ka intezaar hamesha ke liye chalta rehta hai, is liye nahi ki unke apne hisse mein kuch galat hua, balki isliye kyunki baton khud unhe physically kabhi pahuncha hi nahi. Middleware function ke andar \`next()\` bulaana wahi hand-off hai — Express mein kuch aur request ko agle step tak nahi le jaata; iske bina, chain bilkul wahin ruk jaati hai jahan wo ek runner khada raha.',
    },

    simple: `**Start broken.** A logging middleware that forgets the one thing every middleware must do:

\`\`\`js
const express = require("express");
const app = express();

function logRequest(req, res, next) {
  console.log(\`\${req.method} \${req.url}\`);
  // forgot to call next()!
}

app.use(logRequest);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(3000);
\`\`\`

Visit \`http://localhost:3000/\`. The console correctly logs \`GET /\` — \`logRequest\` genuinely runs, genuinely does its job. But the browser tab just spins, loading forever. No error appears anywhere — not in the browser, not in the server\'s console, not in the network tab beyond "pending" — the request simply never receives a response, and eventually the browser gives up on its own with a generic timeout, often after many seconds. \`app.use(logRequest)\` registers \`logRequest\` to run for every incoming request, BEFORE the route handler for \`/\` ever gets a turn — but Express has no way of automatically knowing when one middleware function is "done" and it is time to move on to the next one in line. The only signal Express looks for is an explicit call to the third parameter, \`next\` — without it, as far as Express is concerned, \`logRequest\` might still be doing something, might be about to call \`res.send()\` itself later, might be anything — Express simply waits, indefinitely, because it was never told to do otherwise.

**The fix: call \`next()\` to hand control to whatever comes after this middleware**

\`\`\`js
const express = require("express");
const app = express();

function logRequest(req, res, next) {
  console.log(\`\${req.method} \${req.url}\`);
  next();   // hand off to the next middleware/route handler
}

app.use(logRequest);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(3000);
\`\`\`

\`\`\`ts
import express, { Request, Response, NextFunction } from "express";
const app = express();

function logRequest(req: Request, res: Response, next: NextFunction): void {
  console.log(\`\${req.method} \${req.url}\`);
  next();
}

app.use(logRequest);

app.get("/", (req: Request, res: Response): void => {
  res.send("Welcome");
});

app.listen(3000);
\`\`\`

Calling \`next()\` at the end of \`logRequest\` is the explicit, mandatory signal to Express: "I am finished with my part; continue the chain." Express then moves on to whatever is registered next — here, the route handler for \`GET /\`, which calls \`res.send("Welcome")\`, which finally sends an actual HTTP response back to the browser. Every middleware function in Express receives exactly three parameters — \`req\`, \`res\`, and \`next\` — and a middleware function\'s entire job description, beyond whatever specific work it does, is to eventually do exactly one of two things: call \`next()\` to continue the chain, or call a method that sends a response (\`res.send\`, \`res.json\`, \`res.end\`, and similar) to end it. Doing neither, as the broken version did, leaves Express with no instruction at all, and it simply never proceeds.`,

    simpleHi: `**Toote hue se shuru.** Ek logging middleware jo ek cheez bhool jaata hai jo har middleware ko karni chahiye:

\`\`\`js
const express = require("express");
const app = express();

function logRequest(req, res, next) {
  console.log(\`\${req.method} \${req.url}\`);
  // next() bulaana bhool gaye!
}

app.use(logRequest);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(3000);
\`\`\`

\`http://localhost:3000/\` visit karo. Console sahi tarike se \`GET /\` log karta hai — \`logRequest\` sach mein chalta hai, sach mein apna kaam karta hai. Par browser tab bas ghoomta rehta hai, hamesha load hota hua. Kahin bhi koi error nahi dikhti — browser mein nahi, server ke console mein nahi, network tab mein "pending" se aage kuch nahi — request bas kabhi jawaab paati hi nahi, aur aakhirkaar browser khud haar maan leta hai ek aam timeout ke saath, aksar kai seconds baad. \`app.use(logRequest)\` \`logRequest\` ko har aati request ke liye chalne ke liye register karta hai, \`/\` ke route handler ki baari aane se PEHLE — par Express ke paas apne aap jaanne ka koi tarika nahi ki ek middleware function kab "khatam" hua aur line ke agle par jaane ka waqt aa gaya. Express jo akela ishara dhoondhta hai wo teesre parameter, \`next\`, ko explicit call hai — iske bina, Express ke nazariye se, \`logRequest\` shaayad abhi bhi kuch kar raha ho, shaayad khud baad mein \`res.send()\` bulaane wala ho, shaayad kuch bhi ho — Express bas hamesha ke liye intezaar karta hai, kyunki use kabhi doosri tarah karne ko kaha hi nahi gaya.

**Fix: is middleware ke baad jo bhi aata hai use control dene ke liye \`next()\` bulaao**

\`\`\`js
const express = require("express");
const app = express();

function logRequest(req, res, next) {
  console.log(\`\${req.method} \${req.url}\`);
  next();   // agle middleware/route handler ko de do
}

app.use(logRequest);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(3000);
\`\`\`

\`\`\`ts
import express, { Request, Response, NextFunction } from "express";
const app = express();

function logRequest(req: Request, res: Response, next: NextFunction): void {
  console.log(\`\${req.method} \${req.url}\`);
  next();
}

app.use(logRequest);

app.get("/", (req: Request, res: Response): void => {
  res.send("Welcome");
});

app.listen(3000);
\`\`\`

\`logRequest\` ke aakhir mein \`next()\` bulaana Express ke liye explicit, zaruri ishara hai: "main apna hissa poora kar chuka; chain jaari rakho." Express phir jo bhi agla register hua hai us par jaata hai — yahan, \`GET /\` ka route handler, jo \`res.send("Welcome")\` bulaata hai, jo aakhirkaar browser ko ek asli HTTP response wapas bhejta hai. Express mein har middleware function bilkul teen parameters paata hai — \`req\`, \`res\`, aur \`next\` — aur ek middleware function ka poora kaam-vivaran, jo bhi khaas kaam wo kare uske alawa, aakhirkaar in do mein se bilkul ek karna hai: chain jaari rakhne ke liye \`next()\` bulaana, ya use khatam karne ke liye response bhejne wala ek method (\`res.send\`, \`res.json\`, \`res.end\`, aur waise hi) bulaana. Dono mein se koi na karna, jaisa toote version ne kiya, Express ko koi nirdesh nahi deta, aur wo bas kabhi aage nahi badhta.`,

    content: `## What a middleware function fundamentally is

\`\`\`js
function myMiddleware(req, res, next) {
  // do something with req and/or res
  next();   // OR send a response — never both, never neither
}
\`\`\`

A middleware function in Express is nothing more exotic than an ordinary JavaScript function matching a specific shape: it accepts \`req\` (the incoming request), \`res\` (the outgoing response, built up piece by piece), and \`next\` (a function to call when done), and does something — reading data off \`req\`, attaching data to \`req\` for later middleware to use, checking a condition, logging, anything — before either continuing the chain (\`next()\`) or ending it (a \`res\` method that sends a response). \`app.use(middlewareFn)\` registers a function to run this way for every incoming request, before any route-specific handler; \`app.get(path, middlewareFn)\` (or \`.post\`, \`.put\`, and so on) registers a function to run this way only for requests matching that specific method and path.

## Order matters: middleware runs in the exact order it was registered

\`\`\`js
app.use((req, res, next) => {
  console.log("Middleware A");
  next();
});

app.use((req, res, next) => {
  console.log("Middleware B");
  next();
});

app.get("/", (req, res) => {
  console.log("Route handler");
  res.send("Done");
});
\`\`\`

Requesting \`/\` logs, in this exact order: \`"Middleware A"\`, then \`"Middleware B"\`, then \`"Route handler"\` — Express processes middleware and route handlers strictly in the order they were registered in the source code, each one calling \`next()\` to advance to whatever was registered immediately after it. This ordering is not a minor implementation detail; it is the entire mechanism by which Express request processing works, and it means WHERE a piece of middleware is placed in the file genuinely changes behavior — a middleware that needs to run before route handlers (parsing the request body, checking authentication) must be registered before those routes, not after.

## Route parameters and query strings: reading data out of the URL

\`\`\`js
app.get("/users/:id", (req, res) => {
  console.log(req.params.id);    // the ":id" segment of the URL, e.g., "42" for /users/42
  res.send(\`User \${req.params.id}\`);
});

app.get("/search", (req, res) => {
  console.log(req.query.q);       // the "?q=..." part of the URL, e.g., "shoes" for /search?q=shoes
  res.send(\`Searching for: \${req.query.q}\`);
});
\`\`\`

\`req.params\` holds values from named segments in the route\'s own path pattern (\`:id\` here — the same \`:productId\`-style dynamic segment concept the React Router lesson covered for client-side routes, now on the server side) — a route registered as \`/users/:id\` matches any URL like \`/users/42\` or \`/users/abc\`, with \`req.params.id\` holding whatever the actual matched value was. \`req.query\` holds values from the URL\'s query string (everything after \`?\`) as a plain object — \`/search?q=shoes&limit=10\` produces \`req.query\` as \`{ q: "shoes", limit: "10" }\`. Both are always strings (URL segments are text, regardless of what the value conceptually represents), the same caveat covered for \`process.env\` values in the previous lesson.

## Reading the request body: why \`express.json()\` is itself a middleware

\`\`\`js
app.use(express.json());   // parses JSON request bodies, populates req.body

app.post("/users", (req, res) => {
  console.log(req.body);    // { name: "Priya", email: "priya@example.com" } — parsed automatically
  res.status(201).json({ received: req.body });
});
\`\`\`

Without \`express.json()\` registered, \`req.body\` is \`undefined\` even for a request that genuinely sent a JSON payload — Express does not parse a request\'s body automatically by default, since a body could be JSON, form data, plain text, a file upload, or nothing at all, and guessing which would be both slow and error-prone. \`express.json()\` is itself an ordinary middleware function (built into Express, but structurally no different from the hand-written \`logRequest\` example) that specifically reads the raw incoming request body, parses it as JSON if the request\'s \`Content-Type\` header says it is JSON, and attaches the parsed result to \`req.body\` before calling \`next()\` — which is precisely why it must be registered with \`app.use()\` BEFORE any route handler that reads \`req.body\`, following the same ordering rule covered above.

## TypeScript: typing middleware functions and the request/response cycle

\`\`\`ts
import { Request, Response, NextFunction } from "express";

function logRequest(req: Request, res: Response, next: NextFunction): void {
  console.log(\`\${req.method} \${req.url}\`);
  next();
}

app.get("/users/:id", (req: Request<{ id: string }>, res: Response): void => {
  res.send(\`User \${req.params.id}\`);
});
\`\`\`

\`NextFunction\`, Express\'s own type for the \`next\` parameter, is what makes \`next()\` itself type-checked — calling \`next("not a function")\` or forgetting the parentheses entirely (\`next\` instead of \`next()\`, a genuinely common typo) would each be caught differently depending on context, but having \`next\` correctly typed at all is what enables useful autocomplete and catches gross misuse. \`Request<{ id: string }>\` — \`Request\`\'s generic type parameter — types \`req.params\` specifically for a route with an \`:id\` segment, so \`req.params.id\` is known to be a \`string\` with autocomplete, rather than the untyped, any-shaped object it would otherwise be; this is the same generic-typing pattern covered for \`Select<T>\` in the React course\'s advanced-patterns lesson, applied here to Express\'s own request type instead of a custom component.`,

    contentHi: `## Middleware function buniyaadi taur par kya hai

\`\`\`js
function myMiddleware(req, res, next) {
  // req aur/ya res ke saath kuch karo
  next();   // YA response bhejo — kabhi dono nahi, kabhi koi nahi
}
\`\`\`

Express mein ek middleware function kisi vichitra cheez se zyada kuch nahi hai ek aam JavaScript function se jo ek khaas shape se milta hai: ye \`req\` (aati hui request), \`res\` (jaati hui response, tukda-tukda banti hui), aur \`next\` (khatam hone par bulaane ka function) accept karta hai, aur kuch karta hai — \`req\` se data padhna, baad ke middleware ke istemal ke liye \`req\` par data jodna, ek condition check karna, log karna, kuch bhi — chain jaari rakhne (\`next()\`) ya use khatam karne (ek \`res\` method jo response bhejta hai) se pehle. \`app.use(middlewareFn)\` ek function ko is tarike se chalne ke liye register karta hai har aati request ke liye, kisi bhi route-khaas handler se pehle; \`app.get(path, middlewareFn)\` (ya \`.post\`, \`.put\`, wagairah) ek function ko is tarike se sirf un requests ke liye chalne ke liye register karta hai jo us khaas method aur path se milti hain.

## Kram matter karta hai: middleware bilkul us kram mein chalta hai jismein register hua tha

\`\`\`js
app.use((req, res, next) => {
  console.log("Middleware A");
  next();
});

app.use((req, res, next) => {
  console.log("Middleware B");
  next();
});

app.get("/", (req, res) => {
  console.log("Route handler");
  res.send("Done");
});
\`\`\`

\`/\` maangna, bilkul is kram mein log karta hai: \`"Middleware A"\`, phir \`"Middleware B"\`, phir \`"Route handler"\` — Express middleware aur route handlers ko sakhti se us kram mein process karta hai jismein wo source code mein register hue the, har ek \`next()\` bulaakar us par badhta hai jo uske bilkul baad register hua. Ye kram koi mamuli implementation detail nahi hai; ye poora mechanism hai jisse Express request processing kaam karti hai, aur iska matlab hai ki file mein middleware ka ek tukda KAHAN rakha hai asal mein behaviour badalta hai — ek middleware jise route handlers se pehle chalna chahiye (request body parse karna, authentication check karna) un routes se pehle register hona chahiye, baad mein nahi.

## Route parameters aur query strings: URL se data padhna

\`\`\`js
app.get("/users/:id", (req, res) => {
  console.log(req.params.id);    // URL ka ":id" segment, jaise, /users/42 ke liye "42"
  res.send(\`User \${req.params.id}\`);
});

app.get("/search", (req, res) => {
  console.log(req.query.q);       // URL ka "?q=..." hissa, jaise, /search?q=shoes ke liye "shoes"
  res.send(\`Searching for: \${req.query.q}\`);
});
\`\`\`

\`req.params\` route ke apne path pattern mein naam-wale segments se values rakhta hai (yahan \`:id\` — wahi \`:productId\`-style dynamic segment concept jo React Router lesson ne client-side routes ke liye cover kiya, ab server side par) — \`/users/:id\` ki tarah register hua route \`/users/42\` ya \`/users/abc\` jaise kisi bhi URL se milta hai, \`req.params.id\` jo bhi asal mein mila value tha use rakhte hue. \`req.query\` URL ki query string (\`?\` ke baad sab kuch) se values ek saadhe object ki tarah rakhta hai — \`/search?q=shoes&limit=10\` \`req.query\` ko \`{ q: "shoes", limit: "10" }\` ki tarah banaata hai. Dono hamesha strings hote hain (URL segments text hote hain, chahe value concept mein kya batati ho), wahi caveat jo pichle lesson mein \`process.env\` values ke liye cover hua.

## Request body padhna: \`express.json()\` khud ek middleware kyun hai

\`\`\`js
app.use(express.json());   // JSON request bodies parse karta hai, req.body bharta hai

app.post("/users", (req, res) => {
  console.log(req.body);    // { name: "Priya", email: "priya@example.com" } — apne aap parse hua
  res.status(201).json({ received: req.body });
});
\`\`\`

\`express.json()\` register kiye bina, \`req.body\` \`undefined\` hai chahe request ne sach mein ek JSON payload bheja ho — Express default roop se request ka body apne aap parse nahi karta, kyunki ek body JSON, form data, saadha text, ek file upload, ya bilkul kuch nahi ho sakta hai, aur kaunsa hai andaaza lagaana dono dheema aur galti-prone hoga. \`express.json()\` khud ek aam middleware function hai (Express mein built-in, par structurally haath se likhe \`logRequest\` example se alag nahi) jo khaas taur par aati raw request body padhta hai, use JSON ki tarah parse karta hai agar request ka \`Content-Type\` header kehta hai ye JSON hai, aur parse hua nateeja \`req.body\` par jodta hai \`next()\` bulaane se pehle — bilkul isi wajah se ise \`app.use()\` se register karna chahiye kisi bhi aise route handler se PEHLE jo \`req.body\` padhta hai, upar cover hua wahi ordering niyam follow karte hue.

## TypeScript: middleware functions aur request/response cycle ko type karna

\`\`\`ts
import { Request, Response, NextFunction } from "express";

function logRequest(req: Request, res: Response, next: NextFunction): void {
  console.log(\`\${req.method} \${req.url}\`);
  next();
}

app.get("/users/:id", (req: Request<{ id: string }>, res: Response): void => {
  res.send(\`User \${req.params.id}\`);
});
\`\`\`

\`NextFunction\`, \`next\` parameter ke liye Express ka apna type, wahi cheez hai jo \`next()\` ko khud type-checked banaata hai — \`next("not a function")\` bulaana ya parentheses poori tarah bhoolna (\`next\` \`next()\` ke bajaye, ek sach mein aam typo) context ke hisaab se alag-alag pakda jaata, par \`next\` ko bilkul sahi type karna hi kaam ka autocomplete deta hai aur badi galtiyon ko pakadta hai. \`Request<{ id: string }>\` — \`Request\` ka generic type parameter — \`req.params\` ko khaas taur par \`:id\` segment wale route ke liye type karta hai, isliye \`req.params.id\` ko autocomplete ke saath ek \`string\` ki tarah jaana jaata hai, us untyped, kisi-bhi-shape wale object ke bajaye jo ye warna hota; ye wahi generic-typing pattern hai jo React course ke advanced-patterns lesson mein \`Select<T>\` ke liye cover hua, yahan Express ke apne request type par lagu, kisi custom component ke bajaye.`,

    examples: [
      {
        title: 'Broken: a middleware that never calls next()',
        titleHi: 'Toota: ek middleware jo kabhi next() nahi bulaata',
        code: `function logRequest(req, res, next) {
  console.log(\`\${req.method} \${req.url}\`);
  // no next() — the request hangs forever
}
app.use(logRequest);`,
        codeJs: `const express = require("express");
const app = express();

function logRequest(req, res, next) {
  console.log(\`\${req.method} \${req.url}\`);
}

app.use(logRequest);

app.get("/", (req, res) => {
  console.log("This line never runs");
  res.send("Welcome");
});

app.listen(3000);`,
        codeTs: `import express, { Request, Response, NextFunction } from "express";
const app = express();

function logRequest(req: Request, res: Response, next: NextFunction): void {
  console.log(\`\${req.method} \${req.url}\`);
}

app.use(logRequest);

app.get("/", (req: Request, res: Response): void => {
  console.log("This line never runs");
  res.send("Welcome");
});

app.listen(3000);
// TypeScript does not catch this — a middleware function that never
// calls its "next" parameter is completely valid syntax. This is a
// runtime request-handling bug, not a type error.`,
        output: `Console logs "GET /" correctly (logRequest DID run) — but "This line
never runs" never appears, and the browser tab spins indefinitely with
no response, no error, until it eventually times out on its own.`,
        explain: 'The console log proves the middleware executed correctly — the bug is entirely about what happens (or rather, does not happen) after it finishes its own work, not about whether it ran at all.',
        explainHi: 'Console log saabit karta hai middleware sahi tarike se chala — bug poori tarah is baare mein hai ki uske apna kaam khatam karne ke baad kya hota hai (ya balki, nahi hota), ye chala ya nahi uske baare mein nahi.',
      },
      {
        title: 'Fixed: calling next() hands off to the route handler',
        titleHi: 'Theek: next() bulaana route handler ko de deta hai',
        code: `function logRequest(req, res, next) {
  console.log(\`\${req.method} \${req.url}\`);
  next();
}`,
        codeJs: `const express = require("express");
const app = express();

function logRequest(req, res, next) {
  console.log(\`\${req.method} \${req.url}\`);
  next();
}

app.use(logRequest);

app.get("/", (req, res) => {
  console.log("Route handler running");
  res.send("Welcome");
});

app.listen(3000);`,
        codeTs: `import express, { Request, Response, NextFunction } from "express";
const app = express();

function logRequest(req: Request, res: Response, next: NextFunction): void {
  console.log(\`\${req.method} \${req.url}\`);
  next();
}

app.use(logRequest);

app.get("/", (req: Request, res: Response): void => {
  console.log("Route handler running");
  res.send("Welcome");
});

app.listen(3000);`,
        outputJs: `Console logs "GET /" then "Route handler running", in that exact
order, and the browser correctly and immediately displays "Welcome" —
the single next() call is the entire fix.`,
        outputTs: `// Identical behaviour. "NextFunction" being correctly imported and
// used as next's type is what gives next() itself autocomplete and
// type-checking, though it does not by itself prevent FORGETTING to
// call it, which remains a runtime concern.`,
        explain: 'Nothing about logRequest\'s own logging logic changed — the fix is exclusively the one added line, next(), which is the mandatory signal Express needs to continue past this middleware.',
        explainHi: '\`logRequest\` ke apne logging logic mein kuch nahi badla — fix poori tarah wahi ek jodi hui line hai, \`next()\`, jo zaruri ishara hai jo Express ko is middleware ke aage jaari rakhne ke liye chahiye.',
      },
      {
        title: 'Route params and query strings',
        titleHi: 'Route params aur query strings',
        code: `app.get("/users/:id", (req, res) => {
  res.send(\`User \${req.params.id}\`);
});
app.get("/search", (req, res) => {
  res.send(\`Searching: \${req.query.q}\`);
});`,
        codeJs: `const express = require("express");
const app = express();

app.get("/users/:id", (req, res) => {
  console.log("params:", req.params);
  res.send(\`User \${req.params.id}\`);
});

app.get("/search", (req, res) => {
  console.log("query:", req.query);
  res.send(\`Searching for: \${req.query.q}\`);
});

app.listen(3000);
// GET /users/42       -> params: { id: "42" }
// GET /search?q=shoes -> query: { q: "shoes" }`,
        codeTs: `import express, { Request, Response } from "express";
const app = express();

app.get("/users/:id", (req: Request<{ id: string }>, res: Response): void => {
  console.log("params:", req.params);
  res.send(\`User \${req.params.id}\`);
});

app.get("/search", (req: Request, res: Response): void => {
  console.log("query:", req.query);
  res.send(\`Searching for: \${req.query.q}\`);
});

app.listen(3000);`,
        outputJs: `Visiting /users/42 sends "User 42"; visiting /search?q=shoes sends
"Searching for: shoes" — the same route definitions correctly serve
any matching URL, with the actual matched values available through
req.params and req.query.`,
        outputTs: `// "Request<{ id: string }>" types req.params.id as a real "string"
// with autocomplete, rather than an untyped, any-shaped object — a
// typo like req.params.di would be a compile-time error.`,
        explain: 'Both req.params and req.query values are strings — req.query.q is "shoes" the text, not any other type, regardless of what the query parameter conceptually represents.',
        explainHi: '\`req.params\` aur \`req.query\` dono ki values strings hain — \`req.query.q\` "shoes" text hai, kisi doosre type ka nahi, chahe query parameter concept mein kya batata ho.',
      },
      {
        title: 'express.json() is itself a middleware that populates req.body',
        titleHi: 'express.json() khud ek middleware hai jo req.body bharta hai',
        code: `app.use(express.json());
app.post("/users", (req, res) => {
  res.status(201).json({ received: req.body });
});`,
        codeJs: `const express = require("express");
const app = express();

app.use(express.json());   // must be registered BEFORE routes that read req.body

app.post("/users", (req, res) => {
  console.log(req.body);
  res.status(201).json({ received: req.body });
});

app.listen(3000);
// POST /users with JSON body { "name": "Priya" }
// -> req.body is { name: "Priya" }, correctly parsed`,
        codeTs: `import express, { Request, Response } from "express";
const app = express();

app.use(express.json());

interface CreateUserBody {
  name: string;
  email: string;
}

app.post("/users", (req: Request<{}, {}, CreateUserBody>, res: Response): void => {
  console.log(req.body);
  res.status(201).json({ received: req.body });
});

app.listen(3000);`,
        outputJs: `Without app.use(express.json()) registered, req.body would be
undefined for the exact same POST request, even though the client
genuinely sent a JSON payload — the body simply was never parsed.`,
        outputTs: `// "Request<{}, {}, CreateUserBody>" — Request's third generic
// parameter types the request BODY specifically — req.body.name is
// known as a string with autocomplete, and req.body.nmae (a typo)
// would be a compile-time error.`,
        explain: 'express.json() is structurally identical to the hand-written logRequest example — a function of (req, res, next) that does its work (parsing the body, attaching it to req.body) and calls next() — Express itself does not treat it as special beyond being built-in.',
        explainHi: '\`express.json()\` structurally haath se likhe \`logRequest\` example jaisa hi hai — \`(req, res, next)\` ka ek function jo apna kaam karta hai (body parse karna, use \`req.body\` par jodna) aur \`next()\` bulaata hai — Express khud ise built-in hone se aage khaas nahi maanta.',
      },
    ],

    mistakes: [
      {
        wrong: `function checkSomething(req, res, next) {
  console.log("checking...");
  // no next() and no response sent — request hangs forever
}
app.use(checkSomething);`,
        right: `function checkSomething(req, res, next) {
  console.log("checking...");
  next();
}
app.use(checkSomething);`,
        why: 'Express has no way of automatically knowing when a middleware function is finished — the explicit next() call is the only signal that tells it to proceed to whatever is registered next; without it, or without sending a response, the request simply hangs with no error.',
        whyHi: 'Express ke paas apne aap jaanne ka koi tarika nahi ki ek middleware function kab khatam hua — explicit \`next()\` call akela ishara hai jo use batata hai jo bhi agla register hua hai us par badho; iske bina, ya response bheje bina, request bas bina kisi error ke jaam ho jaati hai.',
      },
      {
        wrong: `app.get("/users/:id", (req, res) => {
  console.log(req.body);   // body parsing middleware registered AFTER this route
});
app.use(express.json());`,
        right: `app.use(express.json());   // registered BEFORE routes that need req.body
app.get("/users/:id", (req, res) => {
  console.log(req.body);
});`,
        why: 'Middleware and routes run strictly in registration order — a body-parsing middleware registered after a route that reads req.body never runs before that route\'s handler, leaving req.body undefined for it.',
        whyHi: 'Middleware aur routes sakhti se registration kram mein chalte hain — ek body-parsing middleware jo us route ke baad register hui jo \`req.body\` padhta hai us route ke handler se pehle kabhi nahi chalta, uske liye \`req.body\` undefined chhodte hue.',
      },
      {
        wrong: `app.get("/search", (req, res) => {
  const limit = req.query.limit + 1;   // "10" + 1 = "101" — string concatenation, not addition
});`,
        right: `app.get("/search", (req, res) => {
  const limit = Number(req.query.limit) + 1;   // 10 + 1 = 11
});`,
        why: 'req.query and req.params values are always strings — treating one as a number without explicit conversion produces string concatenation rather than arithmetic, the same "+" operator ambiguity covered for user input throughout the JS course.',
        whyHi: '\`req.query\` aur \`req.params\` values hamesha strings hoti hain — bina explicit conversion ke ek ko number ki tarah treat karna ganit ke bajaye string concatenation paida karta hai, wahi "+" operator ki do-arthi baat jo JS course mein user input ke liye poore mein cover hui.',
      },
    ],

    realWorld: [
      {
        en: '**A middleware that never calls next() and never sends a response is one of the most commonly reported first-week Express bugs**, precisely because the failure mode (silent hanging, not a crash or clear error) gives almost no direct hint about where in the middleware chain the problem actually is.',
        hi: '**Ek middleware jo kabhi \`next()\` nahi bulaata aur kabhi response nahi bhejta pehle-hafte ki sabse aksar report hone wali Express bugs mein se ek hai**, bilkul isliye kyunki asafalta ka tarika (chupchap jaam hona, koi crash ya saaf error nahi) is baare mein lagbhag koi seedha ishara nahi deta ki middleware chain mein samasya asal mein kahan hai.',
      },
      {
        en: '**Nearly every production Express application relies on a chain of built-in and third-party middleware** (express.json() for body parsing, cors for cross-origin requests, helmet for security headers, morgan or similar for logging) — all following the exact same (req, res, next) shape covered in this lesson, registered in a deliberate order.',
        hi: '**Lagbhag har production Express application built-in aur third-party middleware ki ek chain par nirbhar hai** (body parsing ke liye \`express.json()\`, cross-origin requests ke liye \`cors\`, security headers ke liye \`helmet\`, logging ke liye \`morgan\` ya waise hi) — sab is lesson mein cover hui bilkul wahi \`(req, res, next)\` shape follow karte hue, ek jaan-boojhkar kram mein register hue.',
      },
      {
        en: '**Middleware ordering bugs — a route reading req.body before express.json() is registered, or an auth-check middleware registered after the routes it was meant to protect — are a well-documented, recurring category of real Express application bugs**, specifically because the code still runs without crashing, just with silently wrong behavior.',
        hi: '**Middleware ordering bugs — ek route jo \`express.json()\` register hone se pehle \`req.body\` padhta hai, ya ek auth-check middleware jo un routes ke baad register hui jinki use raksha karni thi — asli Express application bugs ki ek achhi tarah documented, dohraati kism hai**, khaas taur par isliye kyunki code bina crash hue phir bhi chalta hai, bas chupchap galat behaviour ke saath.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a request hang indefinitely, with no error anywhere, when a middleware function neither calls next() nor sends a response?',
        qHi: 'Jab ek middleware function na \`next()\` bulaata hai na response bhejta hai, ek request kahin bhi koi error ke bina hamesha ke liye jaam kyun rehti hai?',
        a: 'Express processes an incoming request by moving it through a chain of registered middleware and route handler functions, one at a time, strictly in registration order — but it has no built-in way to automatically detect when any individual function in that chain has "finished" its work, since a middleware function could legitimately be doing anything from a quick synchronous check to a slow asynchronous database call before it is actually done. The only mechanism Express provides for a function to signal "I am finished, please continue" is an explicit call to next(); alternatively, calling one of the response-sending methods (res.send, res.json, res.end, and similar) signals "I am finished, and here is the actual response" instead, which also ends the chain by sending output back to the client. If a middleware function does neither — as in the broken example, which finishes its console.log and then simply returns without calling anything further — Express has received no instruction of any kind about what to do next, so it does not advance to the next function in the chain and does not send any response; the underlying request remains open and unanswered until the client\'s own connection eventually times out on its own, unrelated to anything Express itself decided.',
        aHi: 'Express ek aati request ko registered middleware aur route handler functions ki ek chain se guzaarkar process karta hai, ek baar mein ek, sakhti se registration kram mein — par uske paas apne aap pata karne ka koi built-in tarika nahi ki us chain mein koi akela function apna kaam kab "khatam" kar chuka hai, kyunki ek middleware function vaidh roop se ek turant synchronous check se lekar ek dheemi asynchronous database call tak kuch bhi kar sakta hai us se pehle ki wo asal mein khatam ho. Ekmatra mechanism jo Express ek function ko "main khatam ho gaya, kripya jaari rakho" ishara karne ke liye deta hai \`next()\` ki explicit call hai; iske alawa, response-bhejne wale methods mein se ek bulaana (\`res.send\`, \`res.json\`, \`res.end\`, aur waise hi) iske bajaye "main khatam ho gaya, aur ye raha asli response" ishara karta hai, jo bhi chain ko client ko output wapas bhejkar khatam karta hai. Agar ek middleware function dono mein se koi nahi karta — jaise toote example mein, jo apna \`console.log\` khatam karta hai aur phir bas kuch bhi bulaaye bina return karta hai — Express ko aage kya karna hai iske baare mein kisi bhi kism ka koi nirdesh nahi mila, isliye ye chain mein agle function tak nahi badhta aur koi response nahi bhejta; underlying request khuli aur bina jawaab wali rehti hai jab tak client ka apna connection khud kabhi apne aap timeout na ho jaaye, Express ne khud kya tay kiya us se bekhabar.',
      },
      {
        q: 'Why does registering express.json() after a route that reads req.body leave req.body undefined for that route, even though express.json() is registered somewhere in the app?',
        qHi: '\`express.json()\` ko ek aise route ke baad register karna jo \`req.body\` padhta hai us route ke liye \`req.body\` undefined kyun chhod deta hai, chahe \`express.json()\` app mein kahin register ho?',
        a: 'Express processes middleware and routes strictly in the order they were registered in the source code, for every incoming request — this ordering is not merely a stylistic convention, it is the literal mechanism determining which functions a given request passes through and in what sequence. If a route handler reading req.body is registered before express.json() in the source code, then for any request matching that route, Express reaches and executes that route handler FIRST, before it has any reason to reach the express.json() registration further down the file — the body-parsing middleware genuinely has not run yet at the point the route handler executes, so req.body remains undefined, exactly as if express.json() were never registered in the app at all, from that specific route\'s perspective. This is precisely why body-parsing middleware, authentication-checking middleware, and any other middleware whose effects a later route depends on must be registered earlier in the file than the routes depending on it — registration order is execution order.',
        aHi: 'Express har aati request ke liye middleware aur routes ko sakhti se us kram mein process karta hai jismein wo source code mein register hue the — ye ordering sirf ek stylistic convention nahi hai, ye asli mechanism hai jo tay karta hai ek di gayi request kaunse functions se guzarti hai aur kis kram mein. Agar \`req.body\` padhta ek route handler source code mein \`express.json()\` se pehle register hua hai, to us route se milti kisi bhi request ke liye, Express us route handler tak PEHLE pahunchta aur chalata hai, us se pehle ki use file mein aage \`express.json()\` registration tak pahunchne ka koi kaaran ho — body-parsing middleware sach mein abhi tak chala hi nahi hai us pal jab route handler chalta hai, isliye \`req.body\` undefined rehta hai, bilkul jaise \`express.json()\` us khaas route ke nazariye se app mein kabhi register hi na hui ho. Bilkul isi wajah se body-parsing middleware, authentication-checking middleware, aur koi bhi doosri middleware jiske asar par ek baad ki route nirbhar hai use us route se pehle file mein register hona chahiye jo uspar nirbhar hai — registration kram execution kram hai.',
      },
      {
        q: 'Why are req.params and req.query values always strings, even for a route like "/products/:id" where the ID is conceptually numeric?',
        qHi: '\`req.params\` aur \`req.query\` values hamesha strings kyun hoti hain, \`/products/:id\` jaise route ke liye bhi jahan ID concept mein numeric hai?',
        a: 'A URL, in its raw form, is fundamentally a string — every segment of a path (like the ":id" portion matched against an actual value in the URL), and every key/value pair in a query string, exists purely as text within that URL string, with no type information of any kind attached to it. Express extracts these pieces of text out of the URL and makes them available through req.params and req.query, but it has no way to know, and does not attempt to guess, what type a given piece of text conceptually represents on the application\'s side — a segment like "42" is, to the URL itself, indistinguishable from a segment that was always meant to be an arbitrary string identifier rather than a number. Because of this, req.params and req.query values are always provided as strings, regardless of what they conceptually mean to the application; any code that needs to treat one as a number, a boolean, or another type must explicitly convert it (typically with Number(), parseInt(), or similar), rather than assuming Express has already done so.',
        aHi: 'Ek URL, apne raw roop mein, buniyaadi taur par ek string hai — path ka har segment (jaise ":id" wala hissa jo URL mein ek asli value se milta hai), aur query string mein har key/value jodi, us URL string ke andar poori tarah text ki tarah maujood hai, uske saath koi bhi kism ki type jaankaari judi nahi. Express in text ke tukdon ko URL se nikaalta hai aur unhe \`req.params\` aur \`req.query\` se maujood karaata hai, par use jaanne ka koi tarika nahi, aur andaaza lagaane ki koshish nahi karta, ki ek diya gaya text tukda application ki taraf se concept mein kaunsa type darzha karta hai — "42" jaisa segment, khud URL ke liye, ek aise segment se alag pehchaanne laayak nahi hai jo hamesha ek man-maana string identifier hona tha number ke bajaye. Isi wajah se, \`req.params\` aur \`req.query\` values hamesha strings ki tarah di jaati hain, chahe application ke liye unka concept mein matlab kuch bhi ho; koi bhi code jise ek ko number, boolean, ya doosre type ki tarah treat karna hai use explicitly convert karna chahiye (aam taur par \`Number()\`, \`parseInt()\`, ya waise hi se), Express ne pehle se aisa kiya hai ye maankar nahi.',
      },
      {
        q: 'Structurally, what is the difference between express.json() and a hand-written middleware function like the logRequest example — is express.json() a fundamentally different kind of thing in Express?',
        qHi: 'Structurally, \`express.json()\` aur \`logRequest\` example jaise haath se likhe middleware function mein kya fark hai — kya \`express.json()\` Express mein buniyaadi taur par ek alag kism ki cheez hai?',
        a: 'express.json() is not a fundamentally different kind of thing from a hand-written middleware function — it is, structurally, exactly a function accepting (req, res, next), which reads the raw incoming request body, checks whether the request\'s Content-Type header indicates JSON, parses it into a JavaScript object if so, attaches that parsed result to req.body, and then calls next() to continue the chain — the same shape and the same responsibilities (do some work, then either call next() or send a response) as any middleware a developer writes by hand, including the logRequest example earlier in this lesson. The only difference is that express.json() ships built into the Express package itself rather than being written by the application\'s own developer, and its specific job happens to be body parsing rather than logging — but Express itself treats it identically to any other middleware function, registered with app.use() and subject to the exact same ordering rules covered throughout this lesson.',
        aHi: '\`express.json()\` haath se likhe middleware function se buniyaadi taur par ek alag kism ki cheez nahi hai — ye, structurally, bilkul \`(req, res, next)\` accept karta ek function hai, jo aati raw request body padhta hai, check karta hai ki request ka \`Content-Type\` header JSON darzha karta hai ya nahi, agar haan to use ek JavaScript object mein parse karta hai, wo parse hua nateeja \`req.body\` par jodta hai, aur phir chain jaari rakhne ke liye \`next()\` bulaata hai — wahi shape aur wahi zimmedariyan (kuch kaam karo, phir ya to \`next()\` bulaao ya response bhejo) jo koi bhi middleware jise developer haath se likhta hai rakhta hai, is lesson ke pehle wale \`logRequest\` example sameet. Sirf fark ye hai ki \`express.json()\` khud Express package mein built-in aata hai application ke apne developer dwara likha jaane ke bajaye, aur uska khaas kaam logging ke bajaye body parsing hai — par Express khud ise kisi bhi doosre middleware function jaisa hi treat karta hai, \`app.use()\` se register hua aur is poore lesson mein cover hue bilkul wahi ordering rules ke tahat.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken logRequest middleware that forgets next(). Confirm the console logs correctly while the browser hangs, and check the Network tab to confirm the request status stays "pending" indefinitely.',
        taskHi: 'next() bhoolta toota logRequest middleware banao. Confirm karo console sahi tarike se log karta hai jabki browser jaam hota hai, aur Network tab check karo confirm karne ke liye ki request status hamesha "pending" rehta hai.',
        hint: 'Add a second, completely unrelated route (like /ping) after registering the broken middleware with app.use(), and confirm that route ALSO hangs, since the middleware runs for every request regardless of path.',
        hintHi: 'Toote middleware ko app.use() se register karne ke baad ek doosra, poori tarah na-juda route jodo (jaise /ping), aur confirm karo wo route BHI jaam hota hai, kyunki middleware har request ke liye chalta hai path se bekhabar.',
      },
      {
        task: 'Fix it by calling next(). Then deliberately reorder two middleware functions and confirm the console.log order changes to match the new registration order.',
        taskHi: 'next() bulaakar theek karo. Phir jaan-boojhkar do middleware functions ko reorder karo aur confirm karo console.log kram naye registration kram se milta hua badalta hai.',
        hint: 'Register a route-specific piece of middleware (as a second argument to app.get, before the actual handler) and confirm it runs only for that specific route, not for every request the way app.use() middleware does.',
        hintHi: 'Ek route-khaas middleware ka tukda register karo (app.get ke doosre argument ki tarah, asli handler se pehle) aur confirm karo ye sirf us khaas route ke liye chalta hai, har request ke liye nahi jaise app.use() middleware karta hai.',
      },
      {
        task: 'Build a POST /users route reading req.body, without registering express.json(). Confirm req.body is undefined, then add app.use(express.json()) BEFORE the route and confirm it now populates correctly.',
        taskHi: '\`req.body\` padhta ek POST /users route banao, \`express.json()\` register kiye bina. Confirm karo \`req.body\` undefined hai, phir route se PEHLE \`app.use(express.json())\` jodo aur confirm karo ye ab sahi tarike se bharta hai.',
        hint: 'Try registering express.json() AFTER the route instead of before, and confirm req.body is still undefined for that route, directly demonstrating the ordering rule.',
        hintHi: 'Route se PEHLE ke bajaye BAAD mein \`express.json()\` register karne ki koshish karo, aur confirm karo us route ke liye \`req.body\` abhi bhi undefined hai, ordering niyam seedha dikhaate hue.',
      },
    ],

    keyTakeaways: [
      'A middleware function must always end by either calling next() (to continue the chain) or sending a response (res.send/res.json/res.end, to end it) — doing neither leaves the request hanging forever with no error, since Express has no automatic way to detect completion.',
      'Middleware and route handlers run strictly in the order they were registered in the source code — a middleware whose effects a route depends on (body parsing, authentication) must be registered before that route, not after.',
      'req.params holds values from named segments in a route\'s own path pattern (like ":id"); req.query holds values from the URL\'s query string — both are always strings, regardless of what the value conceptually represents.',
      'req.body is undefined by default; express.json() (or similar body-parsing middleware) must be registered with app.use() before any route reading req.body, since it is what actually parses the raw request body and populates req.body.',
      'express.json() is not a special or different kind of thing from a hand-written middleware function — structurally, it is exactly a (req, res, next) function that does its work and calls next(), the same shape as any middleware a developer writes.',
      'In TypeScript, Request\'s generic type parameters type req.params and req.body for a specific route, giving autocomplete and catching typos at compile time, the same generic-typing pattern covered for React components.',
    ],
    keyTakeawaysHi: [
      'Ek middleware function ko hamesha ya to \`next()\` bulaakar (chain jaari rakhne ke liye) ya response bhejkar (\`res.send\`/\`res.json\`/\`res.end\`, use khatam karne ke liye) khatam hona chahiye — dono mein se koi na karna request ko hamesha ke liye bina kisi error ke jaam chhod deta hai, kyunki Express ke paas poora hona pakadne ka koi apne-aap wala tarika nahi.',
      'Middleware aur route handlers sakhti se us kram mein chalte hain jismein wo source code mein register hue the — ek middleware jiske asar par ek route nirbhar hai (body parsing, authentication) us route se pehle register honi chahiye, baad mein nahi.',
      '\`req.params\` route ke apne path pattern mein naam-wale segments se values rakhta hai (jaise ":id"); \`req.query\` URL ki query string se values rakhta hai — dono hamesha strings hain, chahe value concept mein kya batati ho.',
      '\`req.body\` default roop se undefined hai; \`express.json()\` (ya waisi hi body-parsing middleware) kisi bhi \`req.body\` padhne wale route se pehle \`app.use()\` se register honi chahiye, kyunki ye asal mein raw request body parse karti hai aur \`req.body\` bharti hai.',
      '\`express.json()\` haath se likhe middleware function se koi khaas ya alag kism ki cheez nahi hai — structurally, ye bilkul ek \`(req, res, next)\` function hai jo apna kaam karta hai aur \`next()\` bulaata hai, wahi shape jo koi bhi developer likhi middleware rakhti hai.',
      'TypeScript mein, \`Request\` ke generic type parameters \`req.params\` aur \`req.body\` ko ek khaas route ke liye type karte hain, autocomplete dete hue aur compile time par typos pakadte hue, wahi generic-typing pattern jo React components ke liye cover hua.',
    ],
  },
];
