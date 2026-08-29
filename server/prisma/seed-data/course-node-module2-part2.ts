/**
 * Node.js Complete Course — Module 2: Building APIs with Express, lesson 2.
 *
 * Centralized error handling. The broken example is an async route handler
 * whose awaited call rejects without a try/catch — Express 4's error-
 * handling machinery was built before async/await existed and does NOT
 * automatically catch a rejected promise thrown inside an async handler,
 * so the request hangs with no response and no error log, structurally
 * similar in symptom to Module 2's first lesson but caused by a completely
 * different mechanism. Fixed with explicit next(err) (or an async-handler
 * wrapper), then centralized 4-argument error-handling middleware.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes. Also scan with a Python regex for stray
 * Devanagari characters before seeding.
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_2_PART2: CourseLesson[] = [
  {
    slug: 'centralized-error-handling',
    title: 'Centralized Error Handling in Express',
    titleHi: 'Express Mein Centralized Error Handling',
    description: 'A database query that genuinely fails — and Express, silently, does nothing about it at all.',
    descriptionHi: 'Ek database query jo sach mein fail hoti hai — aur Express, chupchap, iske baare mein bilkul kuch nahi karta.',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A safety net installed for people falling, versus someone quietly stepping through a trapdoor no net was ever built to catch.** Express\'s built-in error handling is like a safety net a circus installed specifically to catch performers who visibly FALL from the trapeze — if a performer trips and drops, the net catches them immediately, exactly as designed. But if, instead, a performer quietly steps through a hidden trapdoor in the floor that nobody accounted for when the net was installed, the net does nothing at all — not because the net is broken, but because a trapdoor was never the kind of fall the net was built to catch in the first place. A synchronous error thrown inside a route handler is the visible fall the net (Express\'s default error handling) genuinely catches. A rejected Promise inside an async handler, left unhandled, is the trapdoor — a kind of failure that came into existence years after Express\'s original error-catching net was designed, one the net was simply never built to notice, no matter how real the fall actually is.',
      hi: '**Girne wale logon ke liye lagaya ek safety net, versus koi jo chupchap ek trapdoor se guzarta hai jise pakadne ke liye koi net kabhi banaya hi nahi gaya.** Express ka built-in error handling ek circus ke lagaaye safety net jaisa hai jo khaas taur par un performers ko pakadne ke liye lagaaya gaya jo trapeze se dikhte hue GIRTE hain — agar ek performer thokar khaakar gir jaaye, net use turant pakad leta hai, bilkul jaise design hua tha. Par agar, iske bajaye, ek performer chupchap floor mein ek chhupe trapdoor se guzar jaaye jise net lagate waqt kisi ne socha hi nahi tha, net bilkul kuch nahi karta — net toota hua isliye nahi, balki isliye kyunki trapdoor kabhi wo kism ka girna tha hi nahi jise net pehli jagah pakadne ke liye bana tha. Ek route handler ke andar throw hui synchronous error wo dikhta girna hai jise net (Express ka default error handling) sach mein pakadta hai. Ek async handler ke andar reject hui Promise, na-sambhaali hui chhod di gayi, wo trapdoor hai — ek kism ki asafalta jo Express ke asli error-pakadne wale net ke design hone ke saalon baad wajood mein aayi, jise net ko notice karne ke liye kabhi banaya hi nahi gaya, chahe girna asal mein kitna bhi asli ho.',
    },

    simple: `**Start broken.** A route handler that queries a database, using \`async\`/\`await\`, with no error handling at all:

\`\`\`js
app.get("/users/:id", async (req, res) => {
  const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
  res.json(user);
});
\`\`\`

Request a user ID that causes the database query to genuinely fail — a malformed query, a connection drop, a constraint violation, anything that makes the underlying \`db.query(...)\` call\'s Promise REJECT rather than resolve. The request hangs. No response is ever sent, no error appears in the server\'s console, nothing crashes — from the outside, this looks exactly like the forgotten-\`next()\` bug from the previous lesson, but the actual cause here is completely different. Express\'s built-in error handling — the machinery that would normally catch a thrown error and turn it into a proper error response — was designed and written years before \`async\`/\`await\` existed in JavaScript at all, and it specifically catches errors thrown SYNCHRONOUSLY inside a route handler\'s own function body. A rejected Promise inside an \`async\` function is not a synchronous throw — it becomes an unhandled Promise rejection, an entirely different failure mechanism Express\'s original error-catching code has no way to see or react to; the request handler function itself technically finished running (or rather, its Promise rejected somewhere off in the background), but nothing in Express was ever told about it, so no response, and no error handler, is ever triggered.

**The fix: explicitly catch the rejection and hand it to Express with \`next(err)\`**

\`\`\`js
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    res.json(user);
  } catch (err) {
    next(err);   // explicitly hand the error to Express
  }
});
\`\`\`

\`\`\`ts
import { Request, Response, NextFunction } from "express";

app.get("/users/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    res.json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Wrapping the \`await\`ed call in a \`try\`/\`catch\` block and calling \`next(err)\` inside the \`catch\` block is the explicit bridge between JavaScript\'s modern \`async\`/\`await\` error model and Express\'s older, synchronous-throw-based one — calling \`next()\` with an argument (any truthy value, conventionally an \`Error\` object) is a special signal, distinct from calling \`next()\` with no arguments to continue the normal chain: it tells Express "something went wrong, skip every remaining normal middleware and route handler, and go straight to whatever error-handling middleware is registered instead" (covered next in this lesson). The request no longer hangs — it now correctly reaches Express\'s error-handling logic, which can turn the failure into an actual HTTP response instead of silence.`,

    simpleHi: `**Toote hue se shuru.** Ek route handler jo ek database query karta hai, \`async\`/\`await\` use karte hue, bilkul koi error handling ke bina:

\`\`\`js
app.get("/users/:id", async (req, res) => {
  const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
  res.json(user);
});
\`\`\`

Ek aisa user ID maango jo database query ko sach mein fail karaaye — ek bigdi hui query, ek connection drop, ek constraint violation, kuch bhi jo underlying \`db.query(...)\` call ki Promise ko resolve hone ke bajaye REJECT karaaye. Request jaam ho jaati hai. Kabhi koi response nahi bhejta, server ke console mein koi error nahi dikhti, kuch crash nahi hota — bahar se, ye bilkul pichle lesson wale bhoole hue \`next()\` bug jaisa dikhta hai, par yahan asli wajah poori tarah alag hai. Express ka built-in error handling — wo machinery jo normal roop se ek throw hui error ko pakadti aur use ek theek error response mein badalti — JavaScript mein \`async\`/\`await\` maujood hone se saalon pehle design aur likhi gayi thi, aur ye khaas taur par ek route handler ke apne function body ke andar SYNCHRONOUSLY throw hui errors pakadti hai. Ek \`async\` function ke andar reject hui Promise koi synchronous throw nahi hai — ye ek unhandled Promise rejection ban jaata hai, ek poori tarah alag asafalta mechanism jise Express ka asli error-pakadne wala code dekhne ya react karne ka koi tarika nahi rakhta; request handler function khud taknik roop se chalna khatam ho gaya (ya balki, uski Promise peeche kahin background mein reject hui), par Express ko kabhi iske baare mein bataaya hi nahi gaya, isliye na koi response, na koi error handler, kabhi trigger hota hai.

**Fix: rejection ko explicitly pakdo aur use \`next(err)\` se Express ko de do**

\`\`\`js
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    res.json(user);
  } catch (err) {
    next(err);   // error ko explicitly Express ko de do
  }
});
\`\`\`

\`\`\`ts
import { Request, Response, NextFunction } from "express";

app.get("/users/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    res.json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`await\` hui call ko \`try\`/\`catch\` block mein lapetna aur \`catch\` block ke andar \`next(err)\` bulaana JavaScript ke modern \`async\`/\`await\` error model aur Express ke purane, synchronous-throw-based wale ke beech explicit pul hai — \`next()\` ko ek argument ke saath bulaana (koi bhi truthy value, roaayti roop se ek \`Error\` object) ek khaas ishara hai, normal chain jaari rakhne ke liye bina argument ke \`next()\` bulaane se alag: ye Express ko batata hai "kuch galat hua, baaki bacha har normal middleware aur route handler skip karo, aur iske bajaye jo bhi error-handling middleware register hui hai seedha uspar jaao" (is lesson mein aage cover hoga). Request ab jaam nahi hoti — ye ab sahi tarike se Express ki error-handling logic tak pahunchti hai, jo asafalta ko khaamoshi ke bajaye ek asli HTTP response mein badal sakti hai.`,

    content: `## Centralized error-handling middleware: the special four-argument signature

\`\`\`js
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || "Something went wrong",
  });
}

app.use("/api", apiRoutes);
app.use(errorHandler);   // registered LAST, after every route
\`\`\`

Express recognizes error-handling middleware specifically by its ARITY — a middleware function taking exactly four parameters, \`(err, req, res, next)\`, rather than the ordinary three — and treats any function matching that shape specially: it is skipped entirely during normal request processing, and is only ever called when something upstream calls \`next(err)\` with an argument. This is precisely why it must be registered LAST, after every normal route and middleware in the file — Express walks the chain in registration order, and an error handler placed too early would never actually be reached by requests that have not yet failed, since ordinary (non-error) middleware and routes are what Express tries first for every request. A single centralized error handler, reached by every route in the application via \`next(err)\`, means the logic for turning any kind of failure into a proper, consistent HTTP response lives in exactly one place, rather than every route reimplementing its own error-to-response translation independently.

## Why every route\'s async errors should reach the same centralized handler

\`\`\`js
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await db.query(/* ... */);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;   // caught by the surrounding try/catch below, then passed to next(err)
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

app.post("/orders", async (req, res, next) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);   // the SAME centralized handler processes this failure too
  }
});
\`\`\`

Both routes above, despite doing completely different things, funnel every failure through the identical \`next(err)\` mechanism, which means both are ultimately handled by the same centralized \`errorHandler\` — a database failure in one route and a "not found" condition in another both produce a consistent, predictably-shaped error response (the same JSON structure, appropriate status codes) without either route needing its own bespoke error-formatting logic. This consistency is genuinely valuable in a real API: a client consuming the API can rely on every error response looking the same shape, regardless of which specific route or failure produced it.

## A reusable wrapper to avoid repeating try/catch in every single async route

\`\`\`js
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.get("/users/:id", asyncHandler(async (req, res) => {
  const user = await db.query(/* ... */);
  res.json(user);
  // no try/catch needed — asyncHandler catches the rejection and calls next(err) itself
}));
\`\`\`

Wrapping every single async route handler in its own \`try\`/\`catch\` block, as the earlier fix showed, works correctly but becomes genuinely repetitive across a real application with dozens of routes. \`asyncHandler\` is a small, commonly hand-written (or imported from a package like \`express-async-handler\`) utility that wraps an async route handler function once: it calls the wrapped function, and — since an \`async\` function always returns a Promise — attaches a single \`.catch(next)\` to that Promise, meaning ANY rejection anywhere inside the wrapped handler is automatically forwarded to \`next(err)\` without the route\'s own code needing an explicit \`try\`/\`catch\` at all. This does not change the underlying mechanism this lesson covered — it is still \`next(err)\` reaching the same centralized error handler — it simply removes the repetitive boilerplate of writing that bridge by hand in every route.

## TypeScript: typing custom error classes for structured error responses

\`\`\`ts
class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

// Usage in a route:
app.get("/users/:id", asyncHandler(async (req: Request, res: Response) => {
  const user = await db.query(/* ... */);
  if (!user) throw new NotFoundError(\`User \${req.params.id} not found\`);
  res.json(user);
}));

// The centralized error handler:
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  res.status(statusCode).json({ error: err.message });
}
\`\`\`

Extending JavaScript\'s built-in \`Error\` class (the same \`class ... extends\` syntax the JS course\'s classes lesson covered) lets a custom \`AppError\` carry additional, structured information — here, \`statusCode\` — alongside the standard \`message\` every \`Error\` already has, while still behaving as a genuine \`Error\` everywhere one is expected (caught by \`try\`/\`catch\`, compatible with \`next(err)\`). \`err instanceof AppError\` inside the centralized handler distinguishes deliberately-thrown, application-specific errors (which know their own correct HTTP status code) from unexpected errors (a genuine bug, a database driver throwing something unrelated to \`AppError\` entirely), letting the handler respond with the correct status code for known error types and a generic \`500\` for everything else — the same discriminated-condition pattern covered for handling different kinds of values throughout this course, applied here to error handling specifically.`,

    contentHi: `## Centralized error-handling middleware: khaas chaar-argument signature

\`\`\`js
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || "Something went wrong",
  });
}

app.use("/api", apiRoutes);
app.use(errorHandler);   // AAKHIR mein register hua, har route ke baad
\`\`\`

Express error-handling middleware ko khaas taur par uski ARITY se pehchaanta hai — ek middleware function jo bilkul chaar parameters leta hai, \`(err, req, res, next)\`, aam teen ke bajaye — aur us shape se milte kisi bhi function ko khaas tarike se treat karta hai: ye normal request processing ke dauran poori tarah skip hota hai, aur sirf tab bulaya jaata hai jab upar se koi \`next(err)\` ko ek argument ke saath bulaata hai. Bilkul isi wajah se ise AAKHIR mein register hona chahiye, file ke har normal route aur middleware ke baad — Express chain ko registration kram mein chalta hai, aur bahut jaldi rakha ek error handler un requests tak asal mein kabhi pahuncha hi nahi jaata jo abhi fail nahi hui hain, kyunki aam (non-error) middleware aur routes wo hain jo Express har request ke liye pehle try karta hai. Application ke har route se \`next(err)\` ke through pahuncha ek akela centralized error handler ka matlab hai kisi bhi kism ki asafalta ko ek theek, sangat HTTP response mein badalne wali logic bilkul ek jagah rehti hai, har route ko apna alag asafalta-se-response tarjuma alag se dobara banaane ke bajaye.

## Har route ki async errors ko wahi centralized handler tak kyun pahunchna chahiye

\`\`\`js
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await db.query(/* ... */);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;   // neeche wale aas-paas ke try/catch se pakda gaya, phir next(err) ko diya gaya
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

app.post("/orders", async (req, res, next) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);   // WAHI centralized handler ise bhi process karta hai
  }
});
\`\`\`

Upar wale dono routes, poori tarah alag kaam karte hue bhi, har asafalta ko bilkul wahi \`next(err)\` mechanism se guzaarte hain, matlab dono aakhirkaar wahi centralized \`errorHandler\` sambhaalta hai — ek route mein database asafalta aur doosre mein ek "not found" sthiti dono ek sangat, andaaza laga sakne laayak-shape wali error response paida karte hain (wahi JSON sanrachna, sahi status codes) bina kisi route ko apni khaas error-format-karne wali logic ki zarurat ke. Ye sangati asli API mein sach mein keemti hai: API use karta ek client bharosa kar sakta hai ki har error response ek jaisi shape ki dikhti hai, chahe use kaunsa khaas route ya asafalta ne banaaya ho.

## Har akele async route mein try/catch dohraane se bachne ke liye ek reusable wrapper

\`\`\`js
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.get("/users/:id", asyncHandler(async (req, res) => {
  const user = await db.query(/* ... */);
  res.json(user);
  // koi try/catch chahiye nahi — asyncHandler rejection pakadta hai aur khud next(err) bulaata hai
}));
\`\`\`

Har akele async route handler ko apne khud ke \`try\`/\`catch\` block mein lapetna, jaisa pehle wale fix ne dikhaya, sahi tarike se kaam karta hai par dus-dus routes wale ek asli application mein sach mein dohraata jaata hai. \`asyncHandler\` ek chhota, aam taur par haath se likha (ya \`express-async-handler\` jaise package se import kiya) utility hai jo ek async route handler function ko ek baar lapetta hai: ye lapeta hua function bulaata hai, aur — chunki ek \`async\` function hamesha ek Promise lautaata hai — us Promise par ek akela \`.catch(next)\` jodta hai, matlab lapete hue handler ke andar KAHIN BHI kisi bhi rejection ko apne aap \`next(err)\` tak forward kiya jaata hai bina route ke apne code ko bilkul koi explicit \`try\`/\`catch\` chahiye. Ye is lesson ne cover kiya underlying mechanism nahi badalta — ye abhi bhi \`next(err)\` wahi centralized error handler tak pahunchta hai — ye bas har route mein wo pul haath se likhne ka dohraata boilerplate hataata hai.

## TypeScript: sangat error responses ke liye custom error classes ko type karna

\`\`\`ts
class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

// Route mein istemal:
app.get("/users/:id", asyncHandler(async (req: Request, res: Response) => {
  const user = await db.query(/* ... */);
  if (!user) throw new NotFoundError(\`User \${req.params.id} not found\`);
  res.json(user);
}));

// Centralized error handler:
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  res.status(statusCode).json({ error: err.message });
}
\`\`\`

JavaScript ke built-in \`Error\` class ko extend karna (wahi \`class ... extends\` syntax jo JS course ke classes lesson mein cover hua) ek custom \`AppError\` ko extra, structured jaankaari rakhne deta hai — yahan, \`statusCode\` — us standard \`message\` ke saath jo har \`Error\` pehle se rakhta hai, phir bhi har jagah jahan ek ummeed hai ek asli \`Error\` ki tarah behave karte hue (\`try\`/\`catch\` se pakda gaya, \`next(err)\` ke saath sangat). Centralized handler ke andar \`err instanceof AppError\` jaan-boojhkar throw hui, application-khaas errors (jo apna sahi HTTP status code jaanti hain) ko ummeed-se-bahar wali errors se alag karta hai (ek asli bug, ek database driver kuch bilkul \`AppError\` se na-juda throw karta hua), handler ko jaani-pehchaani error types ke liye sahi status code aur baaki sab ke liye ek aam \`500\` ke saath jawaab dene dete hue — wahi discriminated-condition pattern jo alag-alag kism ki values sambhaalne ke liye is poore course mein cover hua, yahan khaas taur par error handling par lagu.`,

    examples: [
      {
        title: 'Broken: an unhandled rejection inside an async handler hangs forever',
        titleHi: 'Toota: async handler ke andar ek na-sambhaali rejection hamesha ke liye jaam hoti hai',
        code: `app.get("/users/:id", async (req, res) => {
  const user = await db.query(/* rejects on failure */);
  res.json(user);
});
// db.query rejects -> request hangs, no error anywhere`,
        codeJs: `const express = require("express");
const app = express();

app.get("/users/:id", async (req, res) => {
  console.log("Handler started");
  const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
  console.log("This never logs if db.query rejects");
  res.json(user);
});

app.listen(3000);
// If db.query's Promise rejects, the request hangs indefinitely — no
// response, no error log, no crash.`,
        codeTs: `import express, { Request, Response } from "express";
const app = express();

app.get("/users/:id", async (req: Request, res: Response): Promise<void> => {
  console.log("Handler started");
  const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
  console.log("This never logs if db.query rejects");
  res.json(user);
});

app.listen(3000);
// TypeScript does not catch this — an async function with no try/catch
// is completely valid syntax. This is an Express/async interop
// runtime issue, not a type error.`,
        output: `"Handler started" logs correctly. If db.query's Promise rejects, "This
never logs..." never appears, no response is ever sent, and nothing in
the console indicates a problem occurred at all — the request simply
hangs until the client's own connection eventually times out.`,
        explain: 'This produces the identical symptom as Module 2\'s first lesson (a hanging request with no error) but for a completely different reason — there, next() was never called; here, next() was never called EITHER, but because the rejection was never caught in the first place, not because the developer forgot a single explicit call.',
        explainHi: 'Ye bilkul Module 2 ke pehle lesson jaisa lakshan paida karta hai (koi error ke bina jaam hui request) par poori tarah alag wajah se — wahan, \`next()\` kabhi bulaaya hi nahi gaya; yahan, \`next()\` bhi kabhi bulaaya nahi gaya, par isliye kyunki rejection shuru mein hi kabhi pakdi hi nahi gayi, developer ek akeli explicit call bhoola isliye nahi.',
      },
      {
        title: 'Fixed: try/catch bridging async rejection to next(err)',
        titleHi: 'Theek: async rejection ko next(err) tak pul banaata try/catch',
        code: `app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await db.query(/* ... */);
    res.json(user);
  } catch (err) {
    next(err);
  }
});`,
        codeJs: `const express = require("express");
const app = express();

app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(3000);`,
        codeTs: `import express, { Request, Response, NextFunction } from "express";
const app = express();

app.get("/users/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.message);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(3000);`,
        outputJs: `The same database rejection now correctly reaches the centralized
error handler — the client receives an actual HTTP 500 response with
a JSON error body, and "Something went wrong" (or the actual error
message, server-side) is logged, instead of an indefinite silent hang.`,
        outputTs: `// Identical behaviour. The error-handling middleware's four
// parameters (err: Error, req: Request, res: Response, next:
// NextFunction) are what Express uses to recognize it as an error
// handler specifically, by their count, regardless of TypeScript
// typing.`,
        explain: 'The try/catch here is not "extra safety" — it is the mandatory, explicit bridge between async/await\'s Promise-rejection error model and Express\'s original synchronous-throw-based one, without which the rejection simply has nowhere to go.',
        explainHi: 'Yahan \`try\`/\`catch\` "extra safety" nahi hai — ye async/await ke Promise-rejection error model aur Express ke asli synchronous-throw-based wale ke beech zaruri, explicit pul hai, jiske bina rejection ke paas jaane ki koi jagah hi nahi.',
      },
      {
        title: 'A reusable asyncHandler wrapper eliminates repeated try/catch',
        titleHi: 'Ek reusable asyncHandler wrapper dohraaye jaate try/catch ko hataata hai',
        code: `function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}`,
        codeJs: `function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.get("/users/:id", asyncHandler(async (req, res) => {
  const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
  res.json(user);
}));

app.post("/orders", asyncHandler(async (req, res) => {
  const order = await createOrder(req.body);
  res.status(201).json(order);
}));`,
        codeTs: `import { Request, Response, NextFunction, RequestHandler } from "express";

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.get("/users/:id", asyncHandler(async (req, res) => {
  const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
  res.json(user);
}));`,
        outputJs: `Both routes correctly forward any rejection to the centralized error
handler, identically to the manual try/catch version — neither route's
own code contains a try/catch block at all.`,
        outputTs: `// "RequestHandler" is Express's own type for a valid route handler
// function, ensuring asyncHandler's returned function is itself
// correctly typed and usable anywhere app.get/post/etc. expect a
// handler.`,
        explain: 'This does not introduce a new error-handling mechanism — it is purely a reusable wrapper around the exact same try/catch + next(err) pattern, removing the need to type it out by hand in every single route.',
        explainHi: 'Ye koi naya error-handling mechanism introduce nahi karta — ye poori tarah bilkul wahi \`try\`/\`catch\` + \`next(err)\` pattern ke aas-paas ek reusable wrapper hai, use har akele route mein haath se type karne ki zarurat hataate hue.',
      },
      {
        title: 'Custom error classes for consistent, structured responses',
        titleHi: 'Sangat, structured responses ke liye custom error classes',
        code: `class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
class NotFoundError extends AppError {
  constructor(message = "Not found") { super(message, 404); }
}`,
        codeJs: `class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

app.get("/users/:id", asyncHandler(async (req, res) => {
  const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
  if (!user) throw new NotFoundError(\`User \${req.params.id} not found\`);
  res.json(user);
}));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});`,
        codeTs: `class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

app.get("/users/:id", asyncHandler(async (req: Request, res: Response) => {
  const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
  if (!user) throw new NotFoundError(\`User \${req.params.id} not found\`);
  res.json(user);
}));

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  res.status(statusCode).json({ error: err.message });
});`,
        outputJs: `Requesting a genuinely missing user now correctly returns HTTP 404
with { "error": "User 42 not found" } — a deliberately thrown,
application-specific error, distinguished from an unexpected database
crash (which would fall back to the generic 500), both handled by the
same centralized handler.`,
        outputTs: `// "err instanceof AppError" correctly narrows err's type and lets
// TypeScript know err.statusCode exists specifically inside that
// branch — a plain Error (from an unrelated crash) has no statusCode
// property, correctly falling back to the generic 500 case.`,
        explain: 'The route\'s own throw new NotFoundError(...) is caught by asyncHandler\'s .catch(next) exactly like any other rejection would be — a manually thrown error and a genuinely rejected Promise both funnel through the identical next(err) path.',
        explainHi: 'Route ka apna \`throw new NotFoundError(...)\` \`asyncHandler\` ke \`.catch(next)\` se bilkul waisa hi pakda jaata hai jaisa koi bhi doosri rejection hoti — ek haath se throw hui error aur ek sach mein reject hui Promise dono bilkul wahi \`next(err)\` rah se guzarte hain.',
      },
    ],

    mistakes: [
      {
        wrong: `app.get("/users/:id", async (req, res) => {
  const user = await db.query(/* rejects on failure */);
  res.json(user);
});
// no try/catch, no next — a rejection hangs the request forever`,
        right: `app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await db.query(/* ... */);
    res.json(user);
  } catch (err) {
    next(err);
  }
});`,
        why: 'Express\'s built-in error handling was designed before async/await existed and only catches errors thrown SYNCHRONOUSLY — a rejected Promise inside an async handler is a different failure mechanism entirely, requiring an explicit try/catch + next(err) bridge.',
        whyHi: 'Express ka built-in error handling \`async\`/\`await\` maujood hone se pehle design hua tha aur sirf SYNCHRONOUSLY throw hui errors pakadta hai — ek async handler ke andar reject hui Promise poori tarah ek alag asafalta mechanism hai, jise explicit \`try\`/\`catch\` + \`next(err)\` pul chahiye.',
      },
      {
        wrong: `app.use((err, req, res, next) => { ... });   // registered FIRST
app.get("/users/:id", asyncHandler(async (req, res) => { ... }));`,
        right: `app.get("/users/:id", asyncHandler(async (req, res) => { ... }));
app.use((err, req, res, next) => { ... });   // registered LAST, after every route`,
        why: 'Express processes middleware in registration order — an error handler registered before the routes it is meant to protect is simply never reached by requests, since Express has not yet failed anything by the time it walks past that early registration.',
        whyHi: 'Express middleware ko registration kram mein process karta hai — ek error handler jo un routes se pehle register hui jinki use raksha karni thi wo un requests tak bilkul kabhi pahunchti hi nahi, kyunki jab tak Express us shuruaati registration se guzarta hai tab tak kuch fail hua hi nahi hota.',
      },
      {
        wrong: `app.use((err, req, res) => {   // only THREE parameters
  res.status(500).json({ error: err.message });
});
// Express does not recognize this as error-handling middleware at all`,
        right: `app.use((err, req, res, next) => {   // exactly FOUR parameters
  res.status(500).json({ error: err.message });
});`,
        why: 'Express identifies error-handling middleware specifically by counting exactly four parameters — a function with three parameters, even one deliberately intended as an error handler, is treated as ordinary middleware instead and never receives errors via next(err).',
        whyHi: 'Express error-handling middleware ko khaas taur par bilkul chaar parameters gin kar pehchaanta hai — teen parameters wala function, jaan-boojhkar error handler ki tarah bhi hoga, iske bajaye aam middleware ki tarah treat hota hai aur \`next(err)\` se kabhi errors nahi paata.',
      },
    ],

    realWorld: [
      {
        en: '**Unhandled Promise rejections inside async Express route handlers are one of the most commonly reported real production incidents in Express 4 applications**, precisely because the failure mode (a hanging request, no error logged) gives almost no direct signal pointing at an async/await error-handling gap as the cause.',
        hi: '**Async Express route handlers ke andar unhandled Promise rejections Express 4 applications mein sabse aksar report hone wale asli production incidents mein se ek hain**, bilkul isliye kyunki asafalta ka tarika (jaam hui request, koi error log nahi hui) is baare mein lagbhag koi seedha ishara nahi deta ki wajah async/await error-handling ki kami hai.',
      },
      {
        en: '**Express 5 (a newer major version) specifically changed the default behavior so that a rejected Promise returned from an async route handler is automatically forwarded to the error handler** — a direct acknowledgment from Express\'s own maintainers that this exact gap was a widespread, genuine pain point in Express 4.',
        hi: '**Express 5 (ek naya major version) khaas taur par default behaviour badalta hai taaki ek async route handler se return hui reject hui Promise apne aap error handler tak forward ho jaaye** — Express ke apne maintainers ki taraf se ek seedha svikaar ki ye bilkul kami Express 4 mein ek badi, asli dard-bindu thi.',
      },
      {
        en: '**Packages like `express-async-handler` and `express-async-errors` exist specifically to provide the asyncHandler wrapper pattern (or an even more automatic equivalent) as a ready-made dependency**, precisely because hand-writing try/catch in every single async route is common enough to be worth automating.',
        hi: '**\`express-async-handler\` aur \`express-async-errors\` jaise packages khaas taur par isliye maujood hain ki wo asyncHandler wrapper pattern (ya isse bhi zyada apne-aap wala barabar) ek taiyaar dependency ki tarah dein**, bilkul isliye kyunki har akele async route mein haath se \`try\`/\`catch\` likhna itna aam hai ki use automate karna kaam ka ho.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does Express\'s built-in error handling fail to catch a rejected Promise inside an async route handler, when it correctly catches an error thrown synchronously in an ordinary (non-async) handler?',
        qHi: 'Express ka built-in error handling ek async route handler ke andar reject hui Promise pakadne mein kyun fail hota hai, jabki ye ek aam (non-async) handler mein synchronously throw hui error sahi tarike se pakadta hai?',
        a: 'Express\'s core request-handling machinery was designed and implemented before async/await existed as part of JavaScript at all, at a time when the only error mechanism it needed to account for inside a route handler was a synchronous throw — code that, at the moment it runs, immediately and directly signals a failure Express\'s calling code can catch with an ordinary try/catch wrapped around the handler invocation itself. An async function behaves completely differently: calling an async function returns a Promise immediately, and the function\'s actual body (including any await\'d operations and their eventual success or failure) continues running independently, asynchronously, disconnected from the moment Express originally called the function — by the time an awaited operation inside that function actually rejects, Express\'s own synchronous try/catch around the original function call has long since finished executing and has nothing left to catch. Because Express never awaits the Promise a route handler returns and never attaches its own .catch() to it, a rejection happening later, asynchronously, simply has no path back to Express\'s error-handling logic unless the route\'s own code explicitly creates one — which is exactly what wrapping the awaited call in try/catch and calling next(err) does.',
        aHi: 'Express ki core request-handling machinery JavaScript ke hisse ki tarah \`async\`/\`await\` maujood hone se poori tarah pehle design aur lagu hui thi, us waqt jab route handler ke andar hisaab rakhne ke liye chahiye ekmatra error mechanism ek synchronous throw tha — aisa code jo, us pal jab wo chalta hai, turant aur seedha ek asafalta ka ishara karta hai jise Express ka bulaane wala code handler invocation ke aas-paas lapete ek aam \`try\`/\`catch\` se pakad sakta hai. Ek async function poori tarah alag behave karta hai: ek async function bulaana turant ek Promise lautaata hai, aur function ki asli body (kisi bhi \`await\` ki hui operations aur unki aakhirkaar safalta ya asafalta sameet) alag se, asynchronously, us pal se bekhabar chalti rehti hai jab Express ne asal mein function bulaaya tha — jab tak us function ke andar ek \`await\` hui operation asal mein reject hoti hai, Express ka apna synchronous \`try\`/\`catch\` asli function call ke aas-paas bahut pehle chalna khatam kar chuka hota hai aur pakadne ko kuch bacha hi nahi. Chunki Express kabhi bhi ek route handler ke lautaaye Promise ko \`await\` nahi karta aur kabhi apna khud ka \`.catch()\` uspar nahi jodta, baad mein, asynchronously hoti ek rejection ke paas Express ki error-handling logic tak wapas jaane ka koi raasta hi nahi hota jab tak route ka apna code khud ek explicit na banaaye — jo bilkul wahi hai jo \`await\` hui call ko \`try\`/\`catch\` mein lapetna aur \`next(err)\` bulaana karta hai.',
      },
      {
        q: 'Why must centralized error-handling middleware in Express be registered after every ordinary route and middleware, rather than at the top of the file?',
        qHi: 'Express mein centralized error-handling middleware ko har aam route aur middleware ke baad register hona chahiye, file ke shuru mein nahi, ye kyun?',
        a: 'Express processes an incoming request by walking through its registered middleware and route handlers strictly in the order they appear in the source code, one at a time — for any given request, Express only reaches a particular piece of middleware once every piece registered before it in the chain has either called next() to continue or has itself ended the response. Error-handling middleware, recognized by its four-parameter signature, is specifically skipped during this normal walk-through and is only invoked when something calls next() WITH an error argument, signaling a jump directly to error-handling logic. If an error handler is registered before the routes it is meant to protect, it is positioned earlier in the chain than any of those routes\' own code — meaning by the time a request reaches and potentially fails inside one of those routes, Express has already passed the point in the chain where that error handler was registered and has no reason to go back to it; the error handler exists in the file, but it is structurally unreachable from a failure occurring in code registered after it. Registering it last, after every route, ensures it is the final possible destination in the chain, reachable from any next(err) call made by any route or middleware that came before it.',
        aHi: 'Express ek aati request ko apni registered middleware aur route handlers se guzaarkar process karta hai sakhti se us kram mein jismein wo source code mein dikhti hain, ek baar mein ek — kisi bhi di gayi request ke liye, Express sirf tabhi middleware ke ek khaas tukde tak pahunchta hai jab uske pehle chain mein register hua har tukda ya to jaari rakhne ke liye \`next()\` bula chuka ho ya khud response khatam kar chuka ho. Error-handling middleware, apne chaar-parameter signature se pehchaani jaati hai, khaas taur par is normal guzarne ke dauran skip hoti hai aur sirf tab bulaayi jaati hai jab koi \`next()\` ko ek error argument ke SAATH bulaata hai, seedha error-handling logic mein jump ka ishara karte hue. Agar ek error handler un routes se pehle register hua hai jinki use raksha karni thi, ye un routes ke apne code se chain mein pehle rakha jaata hai — matlab jab tak ek request un routes mein se ek tak pahunchti hai aur shaayad fail hoti hai, Express pehle hi chain mein wo pal paar kar chuka hai jahan wo error handler register hua tha aur wapas jaane ka koi kaaran nahi rakhta; error handler file mein maujood hai, par ye structurally us se baad register hue code mein hoti asafalta se pahunch mein nahi hai. Ise aakhir mein register karna, har route ke baad, pakka karta hai ki ye chain mein aakhri mumkin manzil hai, us se pehle aaye kisi bhi route ya middleware ke kisi bhi \`next(err)\` call se pahunch mein.',
      },
      {
        q: 'What does an asyncHandler wrapper function actually do, and why does it not represent a different error-handling mechanism from manually writing try/catch in each route?',
        qHi: 'Ek asyncHandler wrapper function asal mein kya karta hai, aur ye har route mein haath se try/catch likhne se alag koi error-handling mechanism kyun nahi darzha karta?',
        a: 'An asyncHandler wrapper takes an async route handler function and returns a new, ordinary function that Express itself registers as the actual route handler — when Express calls that returned function, it in turn calls the original wrapped async function, and because every async function always returns a Promise regardless of whether it resolves or rejects, the wrapper is able to attach a single .catch(next) to that returned Promise. If the wrapped function\'s internal logic causes its Promise to reject — whether from an awaited operation failing or from the function\'s own code explicitly throwing — that rejection is caught by the wrapper\'s .catch(next), which then calls Express\'s next() function with the error, exactly the same next(err) call a manually written try/catch block would make. The wrapper does not introduce any new way for errors to reach Express; it mechanically performs the identical try/catch-and-next(err) pattern automatically, once, in one shared piece of reusable code, rather than requiring that same pattern to be manually retyped inside every individual async route handler in the application.',
        aHi: 'Ek \`asyncHandler\` wrapper ek async route handler function leta hai aur ek naya, aam function lautaata hai jise Express khud asli route handler ki tarah register karta hai — jab Express us lautaaye function ko bulaata hai, ye badle mein asli lapeta hua async function bulaata hai, aur chunki har async function hamesha ek Promise lautaata hai chahe wo resolve ho ya reject, wrapper us lautaaye Promise par ek akela \`.catch(next)\` jod paata hai. Agar lapete hue function ki internal logic uski Promise ko reject karaati hai — chahe ek \`await\` hui operation ke fail hone se ho ya function ke apne code ke explicitly throw karne se — wo rejection wrapper ke \`.catch(next)\` se pakdi jaati hai, jo phir Express ka \`next()\` function bulaata hai error ke saath, bilkul wahi \`next(err)\` call jo ek haath se likha \`try\`/\`catch\` block karta. Wrapper errors ke Express tak pahunchne ka koi naya tarika introduce nahi karta; ye mechanically bilkul wahi \`try\`/\`catch\`-aur-\`next(err)\` pattern apne aap chalata hai, ek baar, ek shared reusable code ke tukde mein, application mein har akele async route handler ke andar wahi pattern haath se dobara type karne ki zarurat ke bajaye.',
      },
      {
        q: 'Why does distinguishing custom AppError instances (with err instanceof AppError) from ordinary, unexpected errors matter inside a centralized error handler?',
        qHi: 'Ek centralized error handler ke andar custom AppError instances ko (err instanceof AppError se) aam, ummeed-se-bahar wali errors se alag karna kyun matter karta hai?',
        a: 'A deliberately thrown, application-specific error (like a NotFoundError, created explicitly by the application\'s own code when a genuinely expected condition occurs, such as a requested resource genuinely not existing) is fundamentally different from an unexpected error (a database driver crashing, a genuine bug causing an unrelated exception) in one crucial respect: the application-specific error already knows what HTTP status code correctly represents it, since that information was deliberately encoded into it (statusCode: 404 for NotFoundError) at the moment it was created, by code that understood the specific situation. An unexpected error carries no such information — a database connection failure has no inherently correct "this is a 404" or "this is a 400" designation, and responding with an arbitrary or incorrect status code for it would be actively misleading to whatever client receives the response. Checking err instanceof AppError lets the centralized handler use the deliberately-provided, correct status code when one exists, and fall back to a generic, honest 500 (Internal Server Error) specifically for the cases where no application code decided in advance what a more specific status would be — producing HTTP responses that are more accurate for known, anticipated failure conditions while remaining safely generic for everything else.',
        aHi: 'Ek jaan-boojhkar throw hui, application-khaas error (jaise ek \`NotFoundError\`, application ke apne code se explicitly banaayi gayi jab ek sach mein ummeed ki hui sthiti hoti hai, jaise ek maangi hui resource sach mein maujood na ho) ek buniyaadi taur par ek ummeed-se-bahar wali error (ek database driver crash hona, ek asli bug jo ek na-judi exception cause karta hai) se ek zaruri baat mein alag hai: application-khaas error pehle se jaanti hai kaunsa HTTP status code use sahi tarike se darzha karta hai, kyunki wo jaankaari use banane ke pal jaan-boojhkar usme encode ki gayi thi (\`NotFoundError\` ke liye \`statusCode: 404\`), aise code se jo khaas sthiti samajhta tha. Ek ummeed-se-bahar wali error koi aisi jaankaari nahi rakhti — ek database connection asafalta ki koi buniyaadi taur par sahi "ye ek 404 hai" ya "ye ek 400 hai" darzha nahi hai, aur uske liye ek man-maane ya galat status code se jawaab dena jo bhi client response paata hai use asal mein bhramit karega. \`err instanceof AppError\` check karna centralized handler ko jaan-boojhkar diya gaya, sahi status code use karne deta hai jab wo maujood ho, aur ek aam, imaandaar \`500\` (Internal Server Error) par wapas girne deta hai khaas taur par un cases ke liye jahan koi application code ne pehle se tay nahi kiya tha ek zyada khaas status kya hoga — aisi HTTP responses paida karte hue jo jaani-pehchaani, ummeed ki hui asafalta sthitiyon ke liye zyada sateek hain jabki baaki sab ke liye surakshit taur par general rehti hain.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken async route handler with no try/catch. Force db.query (or a mock Promise) to reject and confirm the request hangs — check the Network tab and confirm it stays "pending" indefinitely with no console error.',
        taskHi: 'Bina try/catch wala toota async route handler banao. db.query (ya ek mock Promise) ko reject hone ke liye majboor karo aur confirm karo request jaam hoti hai — Network tab check karo aur confirm karo ye hamesha "pending" rehta hai bina kisi console error ke.',
        hint: 'Replace the real database call with a simple function returning Promise.reject(new Error("simulated failure")) to reliably reproduce the hang without needing a real, failing database.',
        hintHi: 'Asli database call ko ek saadhe function se badlo jo \`Promise.reject(new Error("simulated failure"))\` lautaaye jaam ko bharosemand tarike se dobara paida karne ke liye ek asli, fail hoti database ki zarurat bina.',
      },
      {
        task: 'Fix it with try/catch and next(err), plus a centralized four-parameter error handler registered last. Confirm the same forced rejection now produces a proper HTTP error response.',
        taskHi: 'try/catch aur next(err) se theek karo, ek aakhir mein register hua chaar-parameter centralized error handler ke saath. Confirm karo wahi majboor ki hui rejection ab ek theek HTTP error response paida karti hai.',
        hint: 'Try registering the error handler BEFORE the route instead, and confirm the same rejection now hangs again, directly demonstrating the ordering requirement.',
        hintHi: 'Route se PEHLE error handler register karne ki koshish karo iske bajaye, aur confirm karo wahi rejection ab dobara jaam hoti hai, ordering zarurat seedha dikhaate hue.',
      },
      {
        task: 'Build the asyncHandler wrapper and the AppError/NotFoundError class hierarchy. Create a route that throws NotFoundError for a missing resource and confirm the centralized handler correctly returns 404, while an unrelated thrown error still correctly falls back to 500.',
        taskHi: 'asyncHandler wrapper aur AppError/NotFoundError class hierarchy banao. Ek route banao jo ek missing resource ke liye NotFoundError throw kare aur confirm karo centralized handler sahi tarike se 404 lautaata hai, jabki ek na-judi throw hui error abhi bhi sahi tarike se 500 par wapas girti hai.',
        hint: 'Log err.constructor.name inside the centralized handler to directly see which specific error class reached it for each of the two cases.',
        hintHi: 'Centralized handler ke andar \`err.constructor.name\` log karo seedha dekhne ke liye do cases mein se har ek ke liye kaunsi khaas error class use tak pahunchi.',
      },
    ],

    keyTakeaways: [
      'Express\'s built-in error handling was designed before async/await existed and only catches synchronously thrown errors — a rejected Promise inside an async handler is a different failure mechanism, requiring an explicit try/catch + next(err) bridge to reach it.',
      'Error-handling middleware is recognized by Express specifically by having exactly four parameters (err, req, res, next) — a three-parameter function, even one intended as an error handler, is treated as ordinary middleware and never receives errors.',
      'Error-handling middleware must be registered last, after every ordinary route and middleware, since Express processes the chain in registration order and an error handler registered too early is structurally unreachable from later failures.',
      'next(err), called with an argument, is a distinct signal from next() with no arguments — it skips every remaining normal middleware and route handler and jumps directly to error-handling middleware instead.',
      'An asyncHandler wrapper mechanically performs the same try/catch + next(err) pattern automatically, once, rather than requiring it to be manually retyped inside every individual async route handler in the application.',
      'Custom error classes extending Error (like AppError with a statusCode) let a centralized handler distinguish deliberately-thrown, application-specific errors (which know their correct status code) from unexpected errors (which fall back to a generic 500).',
    ],
    keyTakeawaysHi: [
      'Express ka built-in error handling async/await maujood hone se pehle design hua tha aur sirf synchronously throw hui errors pakadta hai — ek async handler ke andar reject hui Promise ek alag asafalta mechanism hai, jise us tak pahunchne ke liye ek explicit try/catch + next(err) pul chahiye.',
      'Error-handling middleware ko Express khaas taur par bilkul chaar parameters (err, req, res, next) rakhne se pehchaanta hai — teen-parameter wala function, ek error handler ki tarah maana gaya bhi ho, aam middleware ki tarah treat hota hai aur kabhi errors nahi paata.',
      'Error-handling middleware ko aakhir mein register hona chahiye, har aam route aur middleware ke baad, kyunki Express chain ko registration kram mein process karta hai aur bahut jaldi register hui error handler baad ki asafaltaon se structurally pahunch mein nahi hoti.',
      'Ek argument ke saath bulaaya \`next(err)\` bina argument ke \`next()\` se ek alag ishara hai — ye baaki bacha har normal middleware aur route handler skip karta hai aur iske bajaye seedha error-handling middleware mein jump karta hai.',
      'Ek asyncHandler wrapper mechanically wahi try/catch + next(err) pattern apne aap chalata hai, ek baar, application mein har akele async route handler ke andar use haath se dobara type karne ki zarurat ke bajaye.',
      'Error ko extend karti custom error classes (jaise ek statusCode wali AppError) ek centralized handler ko jaan-boojhkar throw hui, application-khaas errors (jo apna sahi status code jaanti hain) ko ummeed-se-bahar wali errors (jo ek aam 500 par wapas girti hain) se alag karne deti hain.',
    ],
  },
];
