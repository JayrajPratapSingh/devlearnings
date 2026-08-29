/**
 * Node.js Complete Course — Module 2: Building APIs with Express, lesson 3.
 *
 * Structuring a real Express app with express.Router(). The broken example
 * is a genuinely common mistake when developers first split routes into
 * separate router files: repeating the mount-point prefix inside the
 * router's own route paths, producing an accidentally duplicated URL
 * segment (/api/users/users/:id instead of /api/users/:id). Fixed by
 * defining router routes relative to wherever the router will be mounted,
 * then covers separating routes from controllers for a real, maintainable
 * project structure.
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

export const NODE_MODULE_2_PART3: CourseLesson[] = [
  {
    slug: 'express-router-project-structure',
    title: 'express.Router() and Structuring a Real Express App',
    titleHi: 'express.Router() Aur Ek Asli Express App Ko Structure Karna',
    description: 'A freshly split-out user routes file — and the URL that used to work, "/api/users", now returns a plain 404.',
    descriptionHi: 'Ek taaza alag ki gayi user routes file — aur wo URL jo pehle kaam karta tha, "/api/users", ab bas ek saadha 404 lautaata hai.',
    difficulty: 'MEDIUM',
    duration: 23,
    order: 3,

    analogy: {
      en: '**A building\'s own internal room numbers repeated again on its street address.** Mounting a router at a specific path with app.use("/api/users", userRouter) is like assigning a building the street address "42 Example Street" — anyone finding that address has already arrived at the right building, and only needs internal directions (which floor, which room) from there. Writing a route inside that router as router.get("/users/:id", ...) instead of router.get("/:id", ...) is like the building\'s own internal room-numbering system redundantly repeating the street address on every door — Room "42 Example Street / 42 Example Street / 305" instead of simply Room "305" — so a visitor who already correctly arrived at 42 Example Street, expecting to just find room 305 from there, instead finds every door confusingly relabeled with the address they already used to get inside, and the room they were actually looking for now technically lives at an address nobody would think to look for. The router\'s own internal paths should be written relative to wherever it will eventually be mounted, exactly as a room number inside a building is written relative to the building\'s own front door, not repeating the street address the visitor already used to get there.',
      hi: '**Ek building ke apne internal room numbers uske street address par dobara dohraaye gaye.** \`app.use("/api/users", userRouter)\` se ek router ko ek khaas path par mount karna building ko street address "42 Example Street" dena jaisa hai — jo bhi wo address paata hai wo pehle hi sahi building tak pahunch chuka hai, aur wahan se sirf internal directions chahiye (kaunsi floor, kaunsa room). Us router ke andar \`router.get("/:id", ...)\` ke bajaye \`router.get("/users/:id", ...)\` jaisa route likhna building ke apne internal room-numbering system ke har darwaze par street address ko bekaar dohraane jaisa hai — Room "42 Example Street / 42 Example Street / 305" Room "305" ke bajaye — isliye ek visitor jo pehle hi sahi 42 Example Street pahuncha, wahan se bas room 305 dhoondhne ki ummeed mein, iske bajaye har darwaza confuse karti tarah us address se dobara maarkaa paata hai jo wo pehle hi andar aane ke liye use kar chuka tha, aur wo room jise wo asal mein dhoondh raha tha ab taknik roop se ek aise address par rehta hai jise koi dhoondhne ka sochega hi nahi. Router ke apne internal paths ko us hisaab se likha jaana chahiye jahan wo aakhirkaar mount hoga, bilkul jaise ek building ke andar ek room number building ke apne front door ke hisaab se likha jaata hai, us street address ko dobara na dohraate hue jo visitor pehle hi wahan pahunchne ke liye use kar chuka tha.',
    },

    simple: `**Start broken.** A freshly split-out router file, mounted with its intended prefix already repeated inside its own routes:

\`\`\`js
// routes/users.js
const express = require("express");
const router = express.Router();

router.get("/users", (req, res) => res.json({ users: [] }));
router.get("/users/:id", (req, res) => res.json({ id: req.params.id }));

module.exports = router;
\`\`\`

\`\`\`js
// app.js
const express = require("express");
const userRouter = require("./routes/users");
const app = express();

app.use("/api/users", userRouter);

app.listen(3000);
\`\`\`

The developer expects \`GET /api/users\` and \`GET /api/users/42\` to work — those were the URLs used before this router was split into its own file. Instead, both return a plain \`404 Not Found\`. \`app.use("/api/users", userRouter)\` mounts the entire router at the \`/api/users\` prefix — meaning every route path DEFINED INSIDE that router is automatically appended AFTER \`/api/users\`, not replaced by it. The router\'s own route, written as \`/users\`, therefore becomes accessible at \`/api/users\` + \`/users\` = \`/api/users/users\` — and \`/users/:id\` becomes \`/api/users/users/:id\` — neither of which matches the URLs the developer actually expected or tested against. The \`/users\` prefix was written twice: once implicitly, by mounting the router at \`/api/users\`, and once again, explicitly, inside the router\'s own route paths — a genuinely easy mistake to make specifically when moving routes that used to be defined directly on \`app\` (where they legitimately needed the full path) into a router file (where they now only need the part of the path AFTER the mount point).

**The fix: write the router\'s own routes relative to wherever it will be mounted**

\`\`\`js
// routes/users.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.json({ users: [] }));
router.get("/:id", (req, res) => res.json({ id: req.params.id }));

module.exports = router;
\`\`\`

\`\`\`ts
// routes/users.ts
import { Router, Request, Response } from "express";
const router = Router();

router.get("/", (req: Request, res: Response): void => {
  res.json({ users: [] });
});
router.get("/:id", (req: Request<{ id: string }>, res: Response): void => {
  res.json({ id: req.params.id });
});

export default router;
\`\`\`

The router\'s routes are now written relative to the mount point — \`/\` means "the mount point itself" (which becomes \`/api/users\` once mounted), and \`/:id\` means "the mount point plus one more segment" (which becomes \`/api/users/:id\`). \`app.use("/api/users", userRouter)\` remains completely unchanged in \`app.js\` — the fix lives entirely inside the router file, changing what each route path means RELATIVE TO wherever the router happens to be mounted, rather than assuming the router\'s own paths need to independently repeat the full, final URL. This is precisely the benefit of \`express.Router()\` in the first place: the router file itself does not need to know or care what prefix it will eventually be mounted at — \`app.js\` decides that, and the same router could, in principle, be mounted at a completely different prefix (\`/v2/users\`, or nested under another router entirely) without needing a single line inside the router file itself to change.`,

    simpleHi: `**Toote hue se shuru.** Ek taaza alag ki gayi router file, apni intended prefix ke saath jo pehle hi apne routes ke andar dohraayi hui hai:

\`\`\`js
// routes/users.js
const express = require("express");
const router = express.Router();

router.get("/users", (req, res) => res.json({ users: [] }));
router.get("/users/:id", (req, res) => res.json({ id: req.params.id }));

module.exports = router;
\`\`\`

\`\`\`js
// app.js
const express = require("express");
const userRouter = require("./routes/users");
const app = express();

app.use("/api/users", userRouter);

app.listen(3000);
\`\`\`

Developer ummeed karta hai \`GET /api/users\` aur \`GET /api/users/42\` kaam karenge — ye wo URLs the jo is router ke apni alag file mein alag hone se pehle use hote the. Iske bajaye, dono ek saadha \`404 Not Found\` lautaate hain. \`app.use("/api/users", userRouter)\` poore router ko \`/api/users\` prefix par mount karta hai — matlab us router ke ANDAR DEFINE hua har route path apne aap \`/api/users\` ke BAAD joda jaata hai, uski jagah nahi leta. Router ka apna route, \`/users\` ki tarah likha gaya, isliye \`/api/users\` + \`/users\` = \`/api/users/users\` par pahunch mein aata hai — aur \`/users/:id\` \`/api/users/users/:id\` ban jaata hai — dono mein se koi bhi un URLs se nahi milta jo developer asal mein ummeed karta tha ya test karta tha. \`/users\` prefix do baar likhi gayi: ek baar bekhabar, router ko \`/api/users\` par mount karke, aur ek baar dobara, explicit roop se, router ke apne route paths ke andar — ek sach mein aasan galti khaas taur par tab hoti hai jab wo routes move karte ho jo pehle seedha \`app\` par define hoti thi (jahan unhe vaidh roop se poori path chahiye thi) ek router file mein (jahan ab unhe sirf mount point ke BAAD wala hissa chahiye).

**Fix: router ke apne routes ko us hisaab se likho jahan wo aakhirkaar mount hoga**

\`\`\`js
// routes/users.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.json({ users: [] }));
router.get("/:id", (req, res) => res.json({ id: req.params.id }));

module.exports = router;
\`\`\`

\`\`\`ts
// routes/users.ts
import { Router, Request, Response } from "express";
const router = Router();

router.get("/", (req: Request, res: Response): void => {
  res.json({ users: [] });
});
router.get("/:id", (req: Request<{ id: string }>, res: Response): void => {
  res.json({ id: req.params.id });
});

export default router;
\`\`\`

Router ke routes ab mount point ke hisaab se likhe gaye hain — \`/\` ka matlab hai "mount point khud" (jo mount hone par \`/api/users\` ban jaata hai), aur \`/:id\` ka matlab hai "mount point plus ek aur segment" (jo \`/api/users/:id\` ban jaata hai). \`app.js\` mein \`app.use("/api/users", userRouter)\` poori tarah na-badla rehta hai — fix poori tarah router file ke andar rehta hai, har route path ka matlab jahan bhi router mount hua ho us HISAAB SE badalte hue, router ke apne paths ko poori, aakhri URL alag se dohraani chahiye ye maankar nahi. Ye bilkul \`express.Router()\` ka pehli jagah faayda hai: router file khud ye jaanne ya parwaah karne ki zarurat nahi rakhti ki wo aakhirkaar kaunse prefix par mount hoga — \`app.js\` ye tay karta hai, aur wahi router, siddhaant mein, ek poori tarah alag prefix par mount ho sakta hai (\`/v2/users\`, ya ek doosre router ke andar poori tarah nested) bina router file ke andar ek line badle.`,

    content: `## What \`express.Router()\` actually is: a mini, mountable version of \`app\`

\`\`\`js
const router = express.Router();

router.get("/", handler1);      // behaves like app.get, but scoped to this router
router.post("/", handler2);
router.use(someMiddleware);      // routers can have their own middleware too

module.exports = router;
\`\`\`

\`express.Router()\` creates an object supporting the exact same \`.get\`, \`.post\`, \`.put\`, \`.delete\`, and \`.use\` methods \`app\` itself has — it is, structurally, a smaller, self-contained version of the same routing system, capable of being built up independently in its own file and then attached to the main application as a single unit. This is what actually enables splitting a large application\'s routes across multiple files in the first place: each file exports its own router, defining routes relative to itself, with no built-in knowledge of where it will eventually be mounted — that decision belongs entirely to whatever file does the mounting.

## Mounting: \`app.use(prefix, router)\` versus \`app.use(router)\`

\`\`\`js
app.use("/api/users", userRouter);    // every route inside userRouter is prefixed with /api/users
app.use("/api/orders", orderRouter);   // a separate router, mounted at a different prefix

// versus, without a prefix:
app.use(userRouter);                    // userRouter's own paths ARE the final paths, no prefix added
\`\`\`

\`app.use(prefix, router)\` mounts a router such that the prefix is prepended to every route the router defines — this is the common case for splitting an API into resource-based groups (\`/api/users\`, \`/api/orders\`, each in its own router file, each mounted at its own prefix). \`app.use(router)\`, without a prefix argument, mounts a router with no prefix at all — every path the router defines becomes a final, top-level path exactly as written, useful when a router\'s routes are meant to be reached without any shared prefix. Both are genuinely valid patterns; which one is correct for a given router depends entirely on whether its routes are meant to share a common prefix or not.

## Separating routes from controllers: a real, maintainable project shape

\`\`\`js
// controllers/userController.js — the actual handler logic
async function getUser(req, res, next) {
  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
module.exports = { getUser };

// routes/users.js — just wiring paths to handlers, no business logic
const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/userController");

router.get("/:id", getUser);

module.exports = router;
\`\`\`

A route file defining its paths (\`router.get("/:id", getUser)\`) and a controller file containing the actual handler logic (\`getUser\`\'s real implementation) are conventionally kept separate once an application grows past a handful of routes — the route file becomes a simple, readable map of "this URL pattern goes to this function," while the controller file holds the actual work each handler does, without the two concerns cluttering the same file. This mirrors the same separation-of-concerns principle covered for extracting validation logic and custom hooks throughout this course\'s sibling React course — a route file that is only ever a list of paths mapped to imported functions is far easier to scan and reason about than one where routing structure and business logic are interleaved together.

## A real, common folder structure

\`\`\`
src/
  routes/
    users.js       // router: paths -> controller functions
    orders.js
  controllers/
    userController.js    // actual handler logic
    orderController.js
  middleware/
    errorHandler.js       // the centralized error handler from the previous lesson
    auth.js
  app.js             // creates the app, mounts all routers, registers error handler last
  index.js            // starts the server (app.listen), separate from app.js itself
\`\`\`

Splitting \`app.js\` (which builds and configures the Express application object, but does not itself call \`.listen()\`) from \`index.js\` (which imports the configured \`app\` and actually starts it listening) is a common, deliberate separation specifically because it makes the application object testable in isolation — a test suite can import \`app\` directly and send it fake requests without ever needing a real server to actually be listening on a real port, a pattern the upcoming testing-focused lesson in this course builds on directly.

## TypeScript: typing a router module and its exported handlers

\`\`\`ts
// controllers/userController.ts
import { Request, Response, NextFunction } from "express";

export async function getUser(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// routes/users.ts
import { Router } from "express";
import { getUser } from "../controllers/userController";

const router = Router();
router.get("/:id", getUser);

export default router;
\`\`\`

\`Router\`, imported directly from \`"express"\` (rather than accessed as \`express.Router()\`), is the typed constructor function for a router in TypeScript — the resulting object has the exact same typed \`.get\`/\`.post\`/\`.use\` methods \`app\` itself has, correctly type-checking whatever handler functions are passed to them. Exporting \`getUser\` as a named, typed function from its own controller file, with its own explicit \`Request<{ id: string }>\` parameter type, means the route file importing it gets full type-checking on the connection between the route\'s own \`:id\` parameter and the controller function\'s expectations — a mismatch (a controller written expecting a different param shape than the route actually provides) is caught at compile time rather than discovered only when a real request is made.`,

    contentHi: `## \`express.Router()\` asal mein kya hai: \`app\` ka ek chhota, mount-hone-laayak version

\`\`\`js
const router = express.Router();

router.get("/", handler1);      // app.get jaisa behave karta hai, bas is router tak seemit
router.post("/", handler2);
router.use(someMiddleware);      // routers ke paas apni khud ki middleware bhi ho sakti hai

module.exports = router;
\`\`\`

\`express.Router()\` ek aisa object banaata hai jo bilkul wahi \`.get\`, \`.post\`, \`.put\`, \`.delete\`, aur \`.use\` methods support karta hai jo \`app\` khud rakhta hai — ye, structurally, wahi routing system ka ek chhota, apne-aap-mein-poora version hai, apni khud ki file mein alag se bana ja sakta hai aur phir mukhya application se ek akeli unit ki tarah judta hai. Ye pehli jagah asal mein wo cheez hai jo ek badi application ke routes ko kai files mein baantne deti hai — har file apna khud ka router export karti hai, apne aap ke hisaab se routes define karte hue, koi built-in jaankaari ke bina ki wo aakhirkaar kahan mount hoga — wo faisla poori tarah us file ka hai jo mount karti hai.

## Mount karna: \`app.use(prefix, router)\` versus \`app.use(router)\`

\`\`\`js
app.use("/api/users", userRouter);    // userRouter ke andar har route /api/users se prefix hota hai
app.use("/api/orders", orderRouter);   // ek alag router, ek alag prefix par mount hua

// versus, prefix ke bina:
app.use(userRouter);                    // userRouter ke apne paths HI aakhri paths hain, koi prefix nahi jodi jaati
\`\`\`

\`app.use(prefix, router)\` ek router ko aise mount karta hai ki prefix router ke define kiye har route ke aage joda jaata hai — ye ek API ko resource-based groups mein baantne ka aam case hai (\`/api/users\`, \`/api/orders\`, har ek apni router file mein, har ek apne prefix par mount hua). \`app.use(router)\`, prefix argument ke bina, ek router ko bilkul koi prefix na dete hue mount karta hai — router ka define kiya har path bilkul jaise likha gaya waise hi ek aakhri, top-level path ban jaata hai, kaam ka jab router ke routes ko kisi shared prefix ke bina pahunchna ho. Dono sach mein vaidh patterns hain; kaunsa ek diye gaye router ke liye sahi hai poori tarah is baat par nirbhar hai ki uske routes ek aam prefix share karne wale hain ya nahi.

## Routes ko controllers se alag karna: ek asli, maintainable project shape

\`\`\`js
// controllers/userController.js — asli handler logic
async function getUser(req, res, next) {
  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
module.exports = { getUser };

// routes/users.js — bas paths ko handlers se jodna, koi business logic nahi
const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/userController");

router.get("/:id", getUser);

module.exports = router;
\`\`\`

Ek route file jo apne paths define karti hai (\`router.get("/:id", getUser)\`) aur ek controller file jismein asli handler logic hai (\`getUser\` ka asli implementation) ek baar application mutthi bhar routes se aage badh jaaye to roaayti roop se alag rakhi jaati hain — route file "ye URL pattern is function tak jaata hai" ka ek saadha, padhne-laayak naksha ban jaati hai, jabki controller file har handler ka asli kaam rakhti hai, dono chintaayen usi file mein bikhre bina. Ye is course ke sibling React course mein poore mein validation logic aur custom hooks nikaalne ke liye cover hui wahi separation-of-concerns principle darzha karta hai — ek route file jo hamesha sirf paths ki import ki hui functions se jodi list hai us se dekhna aur samajhna kaafi aasan hai jismein routing sanrachna aur business logic saath ghol di gayi hon.

## Ek asli, aam folder structure

\`\`\`
src/
  routes/
    users.js       // router: paths -> controller functions
    orders.js
  controllers/
    userController.js    // asli handler logic
    orderController.js
  middleware/
    errorHandler.js       // pichle lesson wala centralized error handler
    auth.js
  app.js             // app banaata hai, sab routers mount karta hai, error handler aakhir mein register karta hai
  index.js            // server shuru karta hai (app.listen), app.js se alag
\`\`\`

\`app.js\` (jo Express application object banaata aur configure karta hai, par khud \`.listen()\` nahi bulaata) ko \`index.js\` (jo configured \`app\` import karta hai aur use asal mein sunna shuru karaata hai) se alag karna ek aam, jaan-boojhkar alag-karna hai khaas taur par isliye kyunki ye application object ko isolation mein testable banaata hai — ek test suite \`app\` ko seedha import kar sakta hai aur use nakli requests bhej sakta hai bina kabhi asli server ke asal mein ek asli port par sunne ki zarurat ke, ek pattern jispar is course mein aage aane wala testing-focused lesson seedha banata hai.

## TypeScript: ek router module aur uske export hue handlers ko type karna

\`\`\`ts
// controllers/userController.ts
import { Request, Response, NextFunction } from "express";

export async function getUser(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// routes/users.ts
import { Router } from "express";
import { getUser } from "../controllers/userController";

const router = Router();
router.get("/:id", getUser);

export default router;
\`\`\`

\`Router\`, seedha \`"express"\` se import hua (\`express.Router()\` ki tarah access karne ke bajaye), TypeScript mein ek router ke liye typed constructor function hai — nateeja hua object bilkul wahi typed \`.get\`/\`.post\`/\`.use\` methods rakhta hai jo \`app\` khud rakhta hai, unhe pass hue kisi bhi handler functions ko sahi tarike se type-check karte hue. \`getUser\` ko apni khud ki controller file se ek naam-wale, typed function ki tarah export karna, apne khud ke explicit \`Request<{ id: string }>\` parameter type ke saath, matlab use import karti route file ko route ke apne \`:id\` parameter aur controller function ki ummeedon ke beech ke connection par poori type-checking milti hai — ek bemel (ek controller jo alag param shape ki ummeed karta hai jo route asal mein deta hai) compile time par pakda jaata hai, sirf tabhi na milne ke bajaye jab ek asli request ki jaaye.`,

    examples: [
      {
        title: 'Broken: the router\'s own paths repeat the mount-point prefix',
        titleHi: 'Toota: router ke apne paths mount-point prefix dohraate hain',
        code: `// routes/users.js
router.get("/users", handler);
router.get("/users/:id", handler);
// app.js
app.use("/api/users", userRouter);
// -> accessible at /api/users/users, not /api/users`,
        codeJs: `// routes/users.js
const express = require("express");
const router = express.Router();

router.get("/users", (req, res) => res.json({ users: [] }));
router.get("/users/:id", (req, res) => res.json({ id: req.params.id }));

module.exports = router;

// app.js
const express = require("express");
const userRouter = require("./routes/users");
const app = express();

app.use("/api/users", userRouter);
app.listen(3000);
// GET /api/users     -> 404
// GET /api/users/42  -> 404
// GET /api/users/users     -> works (not what was intended)
// GET /api/users/users/42  -> works (not what was intended)`,
        codeTs: `// routes/users.ts
import { Router, Request, Response } from "express";
const router = Router();

router.get("/users", (req: Request, res: Response): void => {
  res.json({ users: [] });
});
router.get("/users/:id", (req: Request<{ id: string }>, res: Response): void => {
  res.json({ id: req.params.id });
});

export default router;

// app.ts
import express from "express";
import userRouter from "./routes/users";
const app = express();

app.use("/api/users", userRouter);
app.listen(3000);
// TypeScript does not catch this — every path string is valid syntax.
// This is a routing-configuration issue, not a type error.`,
        output: `GET /api/users -> 404 Not Found (the URL the developer actually
expected to work). GET /api/users/users -> 200 OK (an accidental,
unintended URL that happens to work because the prefix was duplicated).`,
        explain: 'The router is not broken in the sense of crashing or throwing — it correctly serves requests, just at URLs nobody actually intended, which is why this class of bug is often discovered only when a client (or a test) requests the expected URL and gets a confusing 404.',
        explainHi: 'Router crash hone ya throw karne ke mane mein toota nahi hai — ye sahi tarike se requests serve karta hai, bas aise URLs par jinka koi asal mein iraada nahi tha, aur bilkul isi wajah se ye bug kism aksar tabhi discover hoti hai jab koi client (ya ek test) ummeed kiya URL maangta hai aur ek confuse karta 404 paata hai.',
      },
      {
        title: 'Fixed: router paths written relative to the mount point',
        titleHi: 'Theek: mount point ke hisaab se likhe hue router paths',
        code: `// routes/users.js
router.get("/", handler);
router.get("/:id", handler);
// app.js unchanged: app.use("/api/users", userRouter);`,
        codeJs: `// routes/users.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.json({ users: [] }));
router.get("/:id", (req, res) => res.json({ id: req.params.id }));

module.exports = router;

// app.js — completely unchanged from the broken version
const express = require("express");
const userRouter = require("./routes/users");
const app = express();

app.use("/api/users", userRouter);
app.listen(3000);
// GET /api/users     -> 200 OK
// GET /api/users/42  -> 200 OK`,
        codeTs: `// routes/users.ts
import { Router, Request, Response } from "express";
const router = Router();

router.get("/", (req: Request, res: Response): void => {
  res.json({ users: [] });
});
router.get("/:id", (req: Request<{ id: string }>, res: Response): void => {
  res.json({ id: req.params.id });
});

export default router;

// app.ts — completely unchanged from the broken version
import express from "express";
import userRouter from "./routes/users";
const app = express();

app.use("/api/users", userRouter);
app.listen(3000);`,
        outputJs: `GET /api/users and GET /api/users/42 both correctly return 200 OK now
— app.js needed zero changes; the entire fix lives inside the router
file, changing what each path means relative to the mount point.`,
        outputTs: `// Identical behaviour. The router's exported type (from "export
// default router") is unaffected by this fix — only the string
// arguments to .get() changed, not any type involved.`,
        explain: 'This demonstrates the actual value of thinking of a router as "relative to wherever it gets mounted" — the same router file, unmodified, could be mounted at a completely different prefix elsewhere and its own routes would still be correct.',
        explainHi: 'Ye router ko "jahan bhi mount ho uske hisaab se" sochne ka asli faayda dikhaata hai — wahi router file, bina badle, kahin aur ek poori tarah alag prefix par mount ho sakti hai aur uske apne routes phir bhi sahi honge.',
      },
      {
        title: 'Mounting two routers at different prefixes',
        titleHi: 'Do routers ko alag-alag prefixes par mount karna',
        code: `app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
// each router's own routes stay simple and independent`,
        codeJs: `// app.js
const express = require("express");
const userRouter = require("./routes/users");
const orderRouter = require("./routes/orders");
const app = express();

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

app.listen(3000);
// GET  /api/users
// GET  /api/users/:id
// GET  /api/orders
// POST /api/orders
// -- each router file only ever defines "/" and "/:id"-style paths,
// never needing to know about the other router or the "/api" prefix`,
        codeTs: `// app.ts
import express from "express";
import userRouter from "./routes/users";
import orderRouter from "./routes/orders";
const app = express();

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

app.listen(3000);`,
        outputJs: `Both resource groups are correctly served under their own prefixes,
from two completely independent router files — neither file contains
any reference to "/api" or to the other resource's routes at all.`,
        outputTs: `// Identical behaviour. Each imported router (userRouter, orderRouter)
// has the same Router type regardless of what its own internal routes
// are — app.use()'s signature is unaffected by which specific router
// is passed to it.`,
        explain: 'This is the actual payoff of the router pattern at scale — adding a third resource (say, /api/products) means writing one new router file and one new app.use() line, with zero risk of accidentally affecting the existing users or orders routes.',
        explainHi: 'Ye scale par router pattern ka asli faayda hai — ek teesra resource jodna (maano, /api/products) ek nayi router file aur ek nayi \`app.use()\` line likhna hai, maujood users ya orders routes ko galti se asar karne ka zero khatra.',
      },
    ],

    mistakes: [
      {
        wrong: `// routes/users.js
router.get("/users/:id", handler);
// app.js
app.use("/api/users", userRouter);
// -> actual path becomes /api/users/users/:id`,
        right: `// routes/users.js
router.get("/:id", handler);
// app.js unchanged
app.use("/api/users", userRouter);
// -> correctly /api/users/:id`,
        why: 'A router mounted with a prefix already prepends that prefix to every route inside it — repeating the same segment inside the router\'s own paths duplicates it, producing an accidental, unintended URL rather than the one actually expected.',
        whyHi: 'Ek prefix ke saath mount hua router pehle hi us prefix ko apne andar ke har route ke aage jodta hai — router ke apne paths ke andar wahi segment dobara likhna use dohraata hai, ek galti se, anaadar wala URL banaate hue us ke bajaye jo asal mein ummeed thi.',
      },
      {
        wrong: `const userController = require("../controllers/userController");
// controller file directly contains app.get(...) calls, coupled to the app instance`,
        right: `// controller file exports plain handler functions
module.exports = { getUser, createUser };
// route file wires them to paths: router.get("/:id", getUser);`,
        why: 'A controller directly registering routes on the app instance couples business logic to a specific mounting decision — exporting plain handler functions instead lets the route file decide the path and mounting, keeping the controller reusable and independently testable.',
        whyHi: 'Ek controller jo seedha \`app\` instance par routes register karta hai business logic ko ek khaas mounting faisle se jodta hai — iske bajaye saadhe handler functions export karna route file ko path aur mounting tay karne deta hai, controller ko reusable aur alag se testable rakhte hue.',
      },
      {
        wrong: `app.use(userRouter);   // no prefix, but userRouter's own routes assume one exists
// routes/users.js: router.get("/", ...) — now this IS the final path, not what was intended`,
        right: `app.use("/api/users", userRouter);   // explicit prefix matches what the router's routes assume`,
        why: 'Whether a router is meant to be mounted with a prefix or without one is a decision the mounting code and the router\'s own route paths must agree on — mismatching the two produces routes at unexpected final URLs.',
        whyHi: 'Kya ek router ko prefix ke saath mount karna hai ya bina, ye ek faisla hai jispar mounting code aur router ke apne route paths ko sehmat hona chahiye — dono ko bemel karna anpekshit aakhri URLs par routes paida karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Splitting routes into express.Router() modules, one per resource, is close to universal in real production Express applications** past a handful of endpoints — a single monolithic file defining every route directly on app quickly becomes unmanageable as an API grows.',
        hi: '**Routes ko \`express.Router()\` modules mein baantna, har resource ke liye ek, asli production Express applications mein lagbhag sarvbhaumik hai** mutthi bhar endpoints se aage — ek akeli monolithic file jo har route seedha \`app\` par define karti hai jaldi hi na-sambhal-hone-laayak ban jaati hai jaise API badhta hai.',
      },
      {
        en: '**The routes/controllers separation this lesson covered is a direct application of the Model-View-Controller (MVC) pattern\'s "controller" concept**, one of the most widely referenced architectural patterns across web frameworks generally, not something specific to Express or Node.js.',
        hi: '**Is lesson ne cover ki routes/controllers separation Model-View-Controller (MVC) pattern ke "controller" concept ka seedha istemal hai**, web frameworks mein badi taur par reference kiye jaane wale sabse aam architectural patterns mein se ek, koi Express ya Node.js ke liye khaas cheez nahi.',
      },
      {
        en: '**Separating app.js (building the Express app object) from index.js/server.js (starting it listening) is a widely adopted convention specifically because it allows automated tests to exercise the application\'s routes directly, without a real server binding to a real network port** — this pattern is a direct prerequisite for the testing techniques covered later in this course.',
        hi: '**\`app.js\` (Express app object banaana) ko \`index.js\`/\`server.js\` (use sunna shuru karaana) se alag karna ek badi taur par apnaaya convention hai khaas taur par isliye kyunki ye automated tests ko application ke routes seedha chalaane deta hai, bina kisi asli server ke ek asli network port se juda hue** — ye pattern is course mein aage cover hui testing techniques ka ek seedha prerequisite hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does mounting a router with app.use("/api/users", userRouter) cause a route defined inside that router as router.get("/users/:id", ...) to become accessible at "/api/users/users/:id" rather than "/api/users/:id"?',
        qHi: '\`app.use("/api/users", userRouter)\` se ek router mount karna us router ke andar \`router.get("/users/:id", ...)\` ki tarah define hua route \`"/api/users/:id"\` ke bajaye \`"/api/users/users/:id"\` par pahunch mein kyun banaata hai?',
        a: 'app.use(prefix, router) works by prepending the given prefix to every route path the mounted router defines — the router\'s own internal paths are not treated as complete, final URLs on their own; they are treated as continuations of whatever prefix the router is mounted at. If the router defines a route as "/users/:id", Express constructs the final, actual matchable path by concatenating the mount prefix and the router\'s own path: "/api/users" + "/users/:id" produces "/api/users/users/:id". This is not a bug in Express\'s behavior — it is precisely how mounting is designed to work, specifically so a router file does not need to know or hardcode the prefix it will eventually be mounted at. The actual mistake is that the developer wrote the router\'s own path as though it needed to independently repeat the "/users" segment, when that segment was already being supplied externally by the app.use() call\'s prefix argument — the router\'s path should have been simply "/:id", letting the prefix alone supply the "/users" portion.',
        aHi: '\`app.use(prefix, router)\` diye gaye prefix ko mount hue router ke define kiye har route path ke aage jodkar kaam karta hai — router ke apne internal paths ko apne aap poori, aakhri URLs ki tarah treat nahi kiya jaata; unhe jo bhi prefix router mount hua hai uski continuation ki tarah treat kiya jaata hai. Agar router ek route "/users/:id" ki tarah define karta hai, Express mount prefix aur router ke apne path ko jodkar aakhri, asal mein match hone laayak path banaata hai: "/api/users" + "/users/:id" "/api/users/users/:id" paida karta hai. Ye Express ke behaviour mein koi bug nahi hai — ye bilkul mounting ke kaam karne ka design hai, khaas taur par isliye ki router file ko ye jaanne ya hardcode karne ki zarurat na ho ki wo aakhirkaar kaunse prefix par mount hoga. Asli galti ye hai ki developer ne router ke apne path ko aisa likha jaise use "/users" segment ko alag se dohraana zaruri ho, jabki wo segment pehle hi \`app.use()\` call ke prefix argument se bahar se diya jaa raha tha — router ka path bas "/:id" hona chahiye tha, prefix akele "/users" wale hisse ko dete hue.',
      },
      {
        q: 'What structurally is express.Router(), and why does defining routes on a Router object rather than directly on app enable splitting a large application across multiple files?',
        qHi: 'Structurally \`express.Router()\` kya hai, aur \`app\` par seedha define karne ke bajaye ek Router object par routes define karna ek badi application ko kai files mein baantne kyun deta hai?',
        a: 'express.Router() creates an object that implements the exact same routing API app itself provides — .get(), .post(), .put(), .delete(), .use(), and so on — meaning a router can be built up in isolation, in its own file, using identical syntax to defining routes directly on the main app object, with no special or different knowledge required. Because a router is a self-contained, independent object rather than something tied directly to a single global app instance, it can be constructed entirely inside its own module, exported, and then imported and attached to the actual application object elsewhere, via app.use(). This separation is precisely what enables splitting a large application\'s routes across multiple files: each file is responsible only for building its own router, describing routes relative to itself, with no need to import or reference the main app object at all — the app.js file that eventually imports and mounts every router is the only place that needs to know about the full application\'s overall structure.',
        aHi: '\`express.Router()\` ek aisa object banaata hai jo bilkul wahi routing API lagu karta hai jo \`app\` khud deta hai — \`.get()\`, \`.post()\`, \`.put()\`, \`.delete()\`, \`.use()\`, wagairah — matlab ek router isolation mein banaya ja sakta hai, apni khud ki file mein, mukhya \`app\` object par seedha routes define karne jaise hi identical syntax use karke, koi khaas ya alag jaankaari zaruri nahi. Chunki router ek apne-aap-mein-poora, alag object hai kisi ek global \`app\` instance se seedha jude hue kuch ke bajaye, ise poori tarah apne khud ke module ke andar banaaya jaa sakta hai, export kiya jaa sakta hai, aur phir kahin aur asli application object mein import aur judaa jaa sakta hai, \`app.use()\` ke through. Ye alag karna bilkul wahi hai jo ek badi application ke routes ko kai files mein baantne deta hai: har file sirf apna khud ka router banaane ke liye zimmedaar hai, apne aap ke hisaab se routes bataate hue, mukhya \`app\` object ko import ya reference karne ki bilkul koi zarurat nahi — \`app.js\` file jo aakhirkaar har router import aur mount karti hai wo akeli jagah hai jise poori application ki overall sanrachna jaanni chahiye.',
      },
      {
        q: 'Why is separating a route file (defining paths) from a controller file (containing the actual handler logic) a widely recommended practice as an Express application grows?',
        qHi: 'Ek route file (paths define karti) ko ek controller file (asli handler logic rakhti) se alag karna ek Express application ke badhne ke saath ek badi taur par sujhaayi practice kyun hai?',
        a: 'A route file that only ever maps a URL pattern to an imported handler function (like router.get("/:id", getUser)) is a simple, quickly-scannable description of the application\'s overall URL structure — reading through it tells a developer exactly what endpoints exist without requiring them to also read through the full implementation details of each one. A controller file, holding the actual logic for what a given handler does (database queries, business logic, response formatting), can be read, modified, and reasoned about independently of the routing structure it happens to be wired into — and critically, since a controller\'s exported function is a plain function taking (req, res, next), unrelated to any specific route or mount point, it can be tested directly by calling it with constructed fake req/res objects, without needing to actually run the full application or make real HTTP requests against it. Keeping the two concerns in the same file, especially as an application grows to dozens of routes, makes both harder: the routing overview becomes cluttered with implementation details, and the implementation details become harder to test or reuse in isolation.',
        aHi: 'Ek route file jo hamesha sirf ek URL pattern ko ek import hui handler function se jodti hai (jaise \`router.get("/:id", getUser)\`) application ki poori URL sanrachna ka ek saadha, jaldi-scan-hone-laayak bayaan hai — use padhna ek developer ko bilkul batata hai kaunse endpoints maujood hain bina unhe har ek ke poore implementation details bhi padhne ki zarurat ke. Ek controller file, jismein ek diya gaya handler kya karta hai uski asli logic hai (database queries, business logic, response formatting), us routing sanrachna se alag se padha, badla, aur socha-samjha ja sakta hai jismein wo samyog se judi hai — aur sabse zaruri, chunki controller ka export hua function ek aam function hai jo \`(req, res, next)\` leta hai, kisi khaas route ya mount point se na-juda, ise seedha test kiya ja sakta hai use banaaye hue nakli \`req\`/\`res\` objects ke saath bulaakar, bina asal mein poori application chalaane ya uske khilaaf asli HTTP requests banane ki zarurat ke. Dono chintaon ko usi file mein rakhna, khaas taur par jaise application dus routes tak badhti hai, dono ko mushkil banaata hai: routing overview implementation details se ghol jaati hai, aur implementation details ko isolation mein test ya reuse karna mushkil ho jaata hai.',
      },
      {
        q: 'Why is separating app.js (which builds the Express application object) from index.js (which starts it listening) a useful convention for testing?',
        qHi: '\`app.js\` (jo Express application object banaata hai) ko \`index.js\` (jo use sunna shuru karaata hai) se alag karna testing ke liye ek kaam ki convention kyun hai?',
        a: 'An Express application object (the result of calling express(), with routes and middleware attached) is, by itself, a fully functional description of how the application should respond to requests — it does not need to actually be listening on a real network port for its request-handling logic to be exercised, since testing tools (like the supertest library, commonly paired with this pattern) can construct fake HTTP requests and pass them directly to the application object in memory, inspecting the resulting response without any real network communication happening at all. If app.listen() is called directly inside the same file that builds the application (as app.js), importing that file for testing purposes would also start a real server listening on a real port as an unavoidable side effect — undesirable in a test environment, where binding to real ports can cause conflicts, slow down test runs, and require explicit cleanup. Keeping app.js focused solely on building and exporting the configured application object, with a separate index.js responsible only for importing that object and calling .listen() on it, lets test code import app.js alone, testing the full request-handling behavior in-memory, without ever triggering the network-binding side effect that only index.js is responsible for.',
        aHi: 'Ek Express application object (\`express()\` bulaane ka nateeja, routes aur middleware jude hue) apne aap mein, ek poori tarah kaam ki application ka bayaan hai ki wo requests ko kaise jawaab deni chahiye — use uski request-handling logic chalaane ke liye asal mein ek asli network port par sunna zaruri nahi, kyunki testing tools (jaise \`supertest\` library, is pattern ke saath aam taur par jodi jaati hai) nakli HTTP requests bana sakte hain aur unhe memory mein seedha application object ko de sakte hain, nateeja hui response ko jaanchte hue bina koi asli network communication hue. Agar \`app.listen()\` bilkul usi file ke andar bulaaya jaata hai jo application banaati hai (\`app.js\` ki tarah), testing maqsad ke liye us file ko import karna ek anivarya side effect ki tarah ek asli server ko bhi ek asli port par sunna shuru karaayega — ek test environment mein anchaaha, jahan asli ports se judna takraav paida kar sakta hai, tests chalna dheema kar sakta hai, aur explicit cleanup maang sakta hai. \`app.js\` ko sirf configured application object banaane aur export karne par focused rakhna, ek alag \`index.js\` ke saath jo sirf us object ko import karne aur uspar \`.listen()\` bulaane ke liye zimmedaar hai, test code ko akela \`app.js\` import karne deta hai, poora request-handling behaviour memory mein test karte hue, us network-binding side effect ko kabhi trigger kiye bina jiske liye sirf \`index.js\` zimmedaar hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken users router with the duplicated "/users" prefix inside its own routes, mounted at "/api/users". Request /api/users (confirm 404) and /api/users/users (confirm it unexpectedly works).',
        taskHi: '"/users" prefix apne routes ke andar dohraaye jaate toota users router banao, "/api/users" par mount hua. /api/users maango (404 confirm karo) aur /api/users/users maango (confirm karo ye anpekshit roop se kaam karta hai).',
        hint: 'Use console.log(req.originalUrl) inside a route handler to directly see the full path Express actually matched against, making the duplication visible.',
        hintHi: 'Ek route handler ke andar \`console.log(req.originalUrl)\` use karo seedha poori path dekhne ke liye jise Express ne asal mein match kiya, dohraav dikhta banaate hue.',
      },
      {
        task: 'Fix it by writing the router\'s routes relative to the mount point ("/" and "/:id"). Confirm /api/users and /api/users/42 now work without any changes to app.js.',
        taskHi: 'Router ke routes ko mount point ke hisaab se likhkar theek karo ("/" aur "/:id"). Confirm karo /api/users aur /api/users/42 ab app.js mein kisi badlaav ke bina kaam karte hain.',
        hint: 'Try mounting the same, unmodified router file at a completely different prefix (like "/v2/people") in a separate test app.js and confirm its routes correctly adapt without touching the router file itself.',
        hintHi: 'Ek alag test app.js mein wahi, na-badli router file ek poori tarah alag prefix par (jaise "/v2/people") mount karne ki koshish karo aur confirm karo iske routes router file ko chhue bina sahi tarike se apne aap ko dhaal lete hain.',
      },
      {
        task: 'Build the full routes/controllers separation: a userController.js exporting getUser and createUser as plain functions, and a routes/users.js wiring them to paths. Confirm the controller functions can be called and tested directly with hand-constructed req/res objects, without going through Express at all.',
        taskHi: 'Poora routes/controllers separation banao: ek userController.js jo getUser aur createUser ko saadhe functions ki tarah export kare, aur ek routes/users.js jo unhe paths se jode. Confirm karo controller functions ko seedha haath se banaaye req/res objects ke saath bulaaya aur test kiya ja sakta hai, Express se poori tarah bina guzare.',
        hint: 'Write a small script that imports getUser directly, constructs a fake req object with a hardcoded params.id, and a fake res object with a mock json() method, then calls getUser(fakeReq, fakeRes) and inspects what the mock json() was called with.',
        hintHi: 'Ek chhota script likho jo \`getUser\` seedha import kare, ek hardcoded \`params.id\` wala nakli \`req\` object banaaye, aur ek mock \`json()\` method wala nakli \`res\` object, phir \`getUser(fakeReq, fakeRes)\` bulaaye aur jaancho mock \`json()\` kis se bulaaya gaya.',
      },
    ],

    keyTakeaways: [
      'express.Router() creates a self-contained, mountable version of app\'s own routing API, letting an application\'s routes be split across multiple files without each file needing to know its eventual mount point.',
      'app.use(prefix, router) prepends the prefix to every route the router defines — a router\'s own paths should be written relative to wherever it will be mounted, not repeating the prefix that will already be supplied externally.',
      'The same duplication mistake is common specifically when moving routes that used to be defined directly on app (needing the full path) into a router file (needing only the part after the mount point).',
      'Separating a route file (mapping paths to handler functions) from a controller file (containing the actual handler logic) keeps the routing structure easy to scan and lets controller functions be tested independently of any specific route or mount point.',
      'A common project structure keeps app.js (building the Express application object) separate from index.js (calling app.listen()), letting test code exercise the application\'s request-handling behavior in-memory without a real server binding to a real network port.',
      'In TypeScript, Router imported directly from "express" provides the same typed .get/.post/.use methods as app, and exporting typed handler functions from controller files gives compile-time checking on the connection between a route\'s parameters and a controller\'s expectations.',
    ],
    keyTakeawaysHi: [
      '\`express.Router()\` \`app\` ki apni routing API ka ek apne-aap-mein-poora, mount-hone-laayak version banaata hai, application ke routes ko kai files mein baantne dete hue bina har file ko apna aakhri mount point jaanne ki zarurat ke.',
      '\`app.use(prefix, router)\` prefix ko router ke define kiye har route ke aage jodta hai — router ke apne paths mount point ke hisaab se likhe jaane chahiye, us prefix ko dobara na dohraate hue jo pehle hi bahar se diya jaayega.',
      'Wahi dohraav wali galti khaas taur par tab aam hai jab wo routes move kiye jaate hain jo pehle seedha \`app\` par define hoti thi (poori path chahiye) ek router file mein (sirf mount point ke baad wala hissa chahiye).',
      'Ek route file (paths ko handler functions se jodna) ko ek controller file (asli handler logic rakhti) se alag karna routing sanrachna ko scan karna aasan rakhta hai aur controller functions ko kisi khaas route ya mount point se alag se test hone deta hai.',
      'Ek aam project structure \`app.js\` (Express application object banaana) ko \`index.js\` (\`app.listen()\` bulaana) se alag rakhti hai, test code ko application ka request-handling behaviour memory mein chalaane deti hai bina kisi asli server ke ek asli network port se jude.',
      'TypeScript mein, "express" se seedha import hua \`Router\` \`app\` jaise hi typed \`.get\`/\`.post\`/\`.use\` methods deta hai, aur controller files se typed handler functions export karna route ke parameters aur controller ki ummeedon ke beech connection par compile-time checking deta hai.',
    ],
  },
];
