/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 14.
 *
 * Production-ready project structure and VS Code setup: how a real
 * production Node.js codebase is organized into layers (routes,
 * controllers, services, models, config, middleware, utils, tests,
 * migrations) instead of one flat folder, and how a team's editor
 * tooling — .vscode/settings.json, launch.json for debugging,
 * extensions.json, tsconfig.json, ESLint/Prettier — is checked into the
 * repository itself so every developer gets the same, correct setup
 * automatically rather than configuring their own editor by hand and
 * drifting out of sync with everyone else. Broken example: every file
 * dumped into one flat folder with no separation of concerns, and no
 * shared editor configuration at all, so formatting, linting, and
 * debugging setup differ from developer to developer. Fixed by a layered
 * src/ structure grouped by responsibility, and a checked-in .vscode/
 * folder that gives every developer, on first clone, the exact same
 * formatting, linting, and one-click debugging setup with zero manual
 * configuration.
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

export const NODE_MODULE_7_PART14: CourseLesson[] = [
  {
    slug: 'production-file-structure-and-vscode-setup',
    title: 'Production-Ready Project Structure and VS Code Setup',
    titleHi: 'Production-Ready Project Structure Aur VS Code Setup',
    description: 'A new developer joins the team, clones the repo, and spends their entire first day just figuring out where anything lives, why their formatter disagrees with everyone else\'s, and how to even attach a debugger — none of which should ever require asking a teammate.',
    descriptionHi: 'Ek naya developer team join karta hai, repo clone karta hai, aur apna poora pehla din bas ye pata lagaane mein bitaata hai ki kuch bhi kahaan rehta hai, unka formatter baaki sabse kyun asehmat hai, aur ek debugger kaise attach karein — inmein se kisi ke liye bhi kabhi kisi teammate se poochna nahi padna chahiye.',
    difficulty: 'EASY',
    duration: 20,
    order: 14,

    analogy: {
      en: '**A hardware store where every single item — nails, paint, wiring, plumbing pipe, garden tools — is dumped into one giant, unlabeled bin at the entrance, versus one organized into clearly labeled aisles (electrical, plumbing, tools, garden) with the exact same layout in every branch of the chain.** A brand-new employee at the single-bin store has no way to find anything without digging through the entire pile or asking someone who already memorized where things happen to be — and worse, every employee who restocks the bin puts things wherever there happens to be space, so the pile\'s organization (such as it is) constantly shifts and nobody\'s mental map stays accurate for long. A new employee at the aisle-organized store, by contrast, can walk in on day one, and even without knowing this specific branch yet, correctly guess that wiring is in the electrical aisle and a wrench is in the tools aisle — not because they memorized this exact store, but because the STRUCTURE itself is predictable and consistent, the same shape a competent employee would expect at any well-run branch in the chain. This is exactly why a Node.js project organized into consistent, predictable folders — routes, controllers, services, models — lets a new developer, or even the same developer six months later, correctly guess where a piece of logic lives before ever being told, rather than needing a guided tour of one specific, arbitrarily organized codebase every single time.',
      hi: '**Ek hardware store jahan har akeli cheez — nails, paint, wiring, plumbing pipe, garden tools — daakhil hote hi ek vishaal, bina-label wale bin mein daal di jaati hai, versus ek jo saaf label wale aisles (electrical, plumbing, tools, garden) mein organize kiya gaya hai us chain ki har branch mein bilkul wahi layout ke saath.** Ek-bin wale store mein ek bilkul-naya employee ke paas kuch bhi dhoondhne ka koi tarika nahi hai poore dher mein khodne ya kisi aise se poochhe bina jisne pehle se yaad kar liya hai cheezein kahaan hoti hain — aur bad-tar, har employee jo bin ko dobara stock karta hai cheezein jahan bhi jagah hoti hai wahaan rakh deta hai, isliye dher ka organization (jaisa bhi hai) lagaataar badalta rehta hai aur kisi ka bhi mental map lambe samay tak sahi nahi rehta. Iske ulta, aisle-organized store ka ek naya employee, pehle din andar aa sakta hai, aur is khaas branch ko jaane bina bhi, sahi tarike se anumaan laga sakta hai ki wiring electrical aisle mein hai aur ek wrench tools aisle mein — is liye nahi ki unhone ye bilkul store yaad kiya, balki isliye kyunki STRUCTURE khud anumaanit aur consistent hai, wahi shape jo ek samajhdaar employee kisi bhi achhi tarah chalti branch mein umeed karega. Bilkul isi wajah se ek Node.js project jo consistent, anumaanit folders mein organize hai — routes, controllers, services, models — ek naye developer ko, ya chhah mahine baad usi developer ko bhi, sahi tarike se anumaan lagaane deta hai ki koi logic ka tukda kahaan rehta hai kabhi bataaye jaane se pehle, har baar ek khaas, manmaani tarike se organize hui codebase ka guided tour maangne ke bajaye.',
    },

    simple: `**Start broken.** Everything dumped into one flat folder:

\`\`\`
project/
  server.js       (routes, db queries, validation, and business logic all mixed together)
  helpers.js      (a catch-all for anything that didn\'t fit elsewhere)
  db.js
  package.json
\`\`\`

This works, technically, for a tiny prototype — but as the application grows past a handful of routes, \`server.js\` becomes a single file containing route definitions, input validation, direct SQL queries, business logic, and error handling all interleaved together with no separation between them. Finding "where is the logic that calculates a refund amount" means scrolling through a file that might be several thousand lines long, with no structural hint about where business logic ends and HTTP-handling begins. Two developers editing different features both touch the same enormous file constantly, causing frequent merge conflicts on unrelated changes. A new developer joining the team has no predictable convention to rely on — they must read through the entire file just to understand where anything lives, since the organization (such as it is) reflects whatever order code happened to be added in, not any deliberate structure.

**The fix: a layered src/ structure organized by responsibility**

\`\`\`
project/
  src/
    routes/          → defines URL paths and HTTP methods, delegates to controllers
      orders.routes.js
    controllers/     → parses the request, calls a service, shapes the response
      orders.controller.js
    services/        → the actual business logic, framework-agnostic
      orders.service.js
    models/          → data shape and database access
      order.model.js
    middleware/       → auth, validation, error handling, logging
      auth.middleware.js
    config/          → environment variables, constants
      index.js
    utils/           → small, genuinely shared helpers
      currency.js
  tests/
    orders.service.test.js
  migrations/
  .env.example
  package.json
\`\`\`

Each layer has one clear job: a **route** only wires a URL and HTTP method to a controller function; a **controller** parses the incoming request and shapes the outgoing response, but contains no actual business logic itself; a **service** holds the real business logic — calculating a refund, processing an order — with no knowledge of HTTP at all, making it independently testable without spinning up a server; a **model** is responsible for the shape of the data and how it is read from or written to the database. This split means "where is the logic that calculates a refund amount" has one predictable answer — \`services/orders.service.js\` — before a new developer has read a single line of this specific codebase, because the STRUCTURE itself, not memorized knowledge of this one project, tells them where to look.`,

    simpleHi: `**Toote hue se shuru.** Sab kuch ek flat folder mein daal diya gaya:

\`\`\`
project/
  server.js       (routes, db queries, validation, aur business logic sab mile-jule)
  helpers.js      (jo bhi kahin aur fit nahi hota uske liye ek catch-all)
  db.js
  package.json
\`\`\`

Ye technically kaam karta hai, ek chhote prototype ke liye — par jaise-jaise application kuch mutthi bhar routes se aage badhta hai, \`server.js\` ek akela file ban jaata hai jismein route definitions, input validation, seedhe SQL queries, business logic, aur error handling sab bina kisi separation ke aapas mein mile hue hain. "Refund amount calculate karne wali logic kahaan hai" dhoondhna matlab hai ek file scroll karna jo shaayad kai hazaar lines ki ho, koi structural sanket bina ki business logic kahaan khatam hoti hai aur HTTP-handling kahaan shuru hoti hai. Alag features par kaam kar rahe do developers dono lagaataar usi vishaal file ko chhoote hain, na-judi changes par baar-baar merge conflicts cause karte hue. Team join karne wale ek naye developer ke paas bharosa karne ke liye koi anumaanit convention nahi hai — unhe poori file padhni padti hai bas ye samajhne ke liye ki kuch bhi kahaan rehta hai, kyunki organization (jaisa bhi hai) darsata hai code jis order mein jab-jab jodaa gaya, kisi jaan-boojhkar structure ko nahi.

**Fix: zimmedaari ke hisaab se organize ek layered \`src/\` structure**

\`\`\`
project/
  src/
    routes/          → URL paths aur HTTP methods define karta hai, controllers ko delegate karta hai
      orders.routes.js
    controllers/     → request parse karta hai, ek service call karta hai, response shape karta hai
      orders.controller.js
    services/        → asli business logic, framework-agnostic
      orders.service.js
    models/          → data shape aur database access
      order.model.js
    middleware/       → auth, validation, error handling, logging
      auth.middleware.js
    config/          → environment variables, constants
      index.js
    utils/           → chhote, sach mein shared helpers
      currency.js
  tests/
    orders.service.test.js
  migrations/
  .env.example
  package.json
\`\`\`

Har layer ka ek saaf kaam hai: ek **route** sirf ek URL aur HTTP method ko ek controller function se jodta hai; ek **controller** aati request ko parse karta hai aur jaati response shape karta hai, par khud koi asli business logic nahi rakhta; ek **service** asli business logic rakhta hai — refund calculate karna, order process karna — HTTP ke baare mein koi jaankaari bina, ise akele test karne laayak banaate hue bina server chalaaye; ek **model** data ki shape aur ye database se kaise padha ya likha jaata hai iske liye zimmedaar hai. Ye baantwaara matlab hai "refund amount calculate karne wali logic kahaan hai" ka ek anumaanit jawaab hai — \`services/orders.service.js\` — is khaas codebase ki ek bhi line padhe bina, kyunki STRUCTURE khud, is ek project ki yaad rakhi gayi jaankaari nahi, unhe batati hai kahaan dekhein.`,

    content: `## VS Code settings.json: one shared formatting and linting configuration for the whole team

\`\`\`json
// .vscode/settings.json — checked into git, applies automatically on clone
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "typescript"]
}
\`\`\`

Without a shared \`.vscode/settings.json\` checked into the repository, every developer configures their own editor by hand — some format on save, some don\'t, some use different indentation widths, some have ESLint auto-fixing enabled and some don\'t — and the codebase\'s formatting slowly drifts inconsistent across files depending on who last touched them. Checking a \`.vscode/settings.json\` directly into version control means the moment anyone clones the repository and opens it in VS Code, they get the exact same formatter, the exact same auto-fix-on-save behavior, and the exact same linting rules applied automatically, with zero manual setup required — the team\'s formatting standard travels with the code itself rather than living in each individual\'s personal, undocumented editor configuration.

## launch.json: one-click debugging instead of console.log

\`\`\`json
// .vscode/launch.json — attach a real debugger with breakpoints, one click
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "restart": true
    }
  ]
}
\`\`\`

Without a shared debug configuration, developers commonly fall back on scattering \`console.log\` statements throughout the code to inspect what a value is at a given point, then remembering to remove them all afterward — a slow, error-prone way to investigate a bug compared to a real debugger. A checked-in \`launch.json\` lets any developer set an actual breakpoint by clicking next to a line number, press one key to start the app in debug mode, and have execution pause exactly at that line with the entire call stack and every variable\'s live value inspectable — a capability that exists the moment the repository is cloned, requiring no per-developer setup or debugger knowledge beyond clicking "Start Debugging."

## tsconfig.json and .editorconfig: consistency that survives beyond any one editor

\`\`\`json
// tsconfig.json — strict mode catches entire categories of bugs at compile time
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noImplicitReturns": true,
    "target": "ES2022",
    "module": "commonjs"
  }
}
\`\`\`

A project\'s \`tsconfig.json\` is itself a form of shared, checked-in configuration: \`"strict": true\` enables an entire family of stricter type checks (no implicit \`any\`, no unchecked \`null\`/\`undefined\` access) that catch real bugs at compile time rather than at runtime in production, and this setting applies identically for every developer and every CI run, rather than being something any individual could accidentally disable locally without anyone noticing. An \`.editorconfig\` file plays a similar, narrower role for editors beyond just VS Code — defining basic conventions like indentation style and line endings that apply consistently across whatever editor a given contributor happens to prefer, not just VS Code specifically.

## extensions.json: recommending the right tools, without forcing them

\`\`\`json
// .vscode/extensions.json — VS Code prompts to install these on first open
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma"
  ]
}
\`\`\`

A checked-in \`.vscode/extensions.json\` does not install anything automatically or force a particular editor configuration on anyone — instead, VS Code detects this file on first opening the project and shows a friendly prompt suggesting these specific extensions, tailored to what this particular project actually uses (an ESLint extension, a Prisma extension for a project using Prisma). This closes the remaining gap between "the settings and debug configuration are checked in" and "the tools needed to actually use those settings correctly are installed" — a new developer is guided toward the right setup on their very first day, rather than discovering days later that a missing extension was silently preventing the shared configuration from working as intended.`,

    contentHi: `## VS Code \`settings.json\`: poori team ke liye ek shared formatting aur linting configuration

\`\`\`json
// .vscode/settings.json — git mein checked in, clone hote hi automatically lagu
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "typescript"]
}
\`\`\`

Repository mein checked-in ek shared \`.vscode/settings.json\` ke bina, har developer apna editor haath se configure karta hai — kuch save par format karte hain, kuch nahi, kuch alag indentation widths istemal karte hain, kuch ke paas ESLint auto-fixing enabled hai aur kuchon ke paas nahi — aur codebase ki formatting dheere-dheere files ke aar-paar asangat ho jaati hai is baat par nirbhar karte hue ki aakhri baar kisne chhua tha. \`.vscode/settings.json\` ko seedhe version control mein check-in karna matlab hai jis pal koi bhi repository clone karta hai aur VS Code mein kholta hai, unhe bilkul wahi formatter milta hai, bilkul wahi save-par-auto-fix vyavhaar, aur bilkul wahi linting rules automatically lagu — team ka formatting standard code ke saath khud safar karta hai, har akele ki personal, undocumented editor configuration mein rehne ke bajaye.

## \`launch.json\`: ek-click debugging, \`console.log\` ke bajaye

\`\`\`json
// .vscode/launch.json — ek asli debugger breakpoints ke saath attach karo, ek click
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "restart": true
    }
  ]
}
\`\`\`

Ek shared debug configuration ke bina, developers aam taur par poore code mein \`console.log\` statements bikhraane ki taraf jaate hain ye dekhne ke liye ki ek diye point par ek value kya hai, phir baad mein sabko hataana yaad rakhte hue — ek asli debugger ke muqable ek bug ki jaanch karne ka dheema, galti-prone tarika. Ek checked-in \`launch.json\` kisi bhi developer ko ek line number ke aage click karke ek asli breakpoint set karne deta hai, app ko debug mode mein shuru karne ke liye ek key dabaane deta hai, aur execution ko bilkul us line par rukne deta hai poori call stack aur har variable ki live value ke saath jaanche jaane laayak — ek kshamta jo repository clone hote hi maujood hoti hai, "Start Debugging" click karne se aage kisi bhi per-developer setup ya debugger jaankaari ki zaroorat bina.

## \`tsconfig.json\` aur \`.editorconfig\`: consistency jo kisi ek editor se aage tikti hai

\`\`\`json
// tsconfig.json — strict mode compile time par poori categories ke bugs pakadta hai
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noImplicitReturns": true,
    "target": "ES2022",
    "module": "commonjs"
  }
}
\`\`\`

Ek project ka \`tsconfig.json\` khud ek shared, checked-in configuration ka roop hai: \`"strict": true\` sakht type checks ka ek poora parivaar enable karta hai (koi implicit \`any\` nahi, koi bina-check \`null\`/\`undefined\` access nahi) jo asli bugs compile time par pakadta hai production mein runtime par ke bajaye, aur ye setting har developer aur har CI run ke liye samaan roop se lagu hoti hai, koi bhi akela ise locally galti se disable na kar sake bina kisi ko pata chale is ke bajaye. Ek \`.editorconfig\` file VS Code se aage ke editors ke liye ek jaisa, sankuchit role nibhaati hai — buniyaadi conventions jaise indentation style aur line endings define karte hue jo kisi bhi contributor ke pasandeeda editor ke aar-paar consistently lagu hote hain, sirf VS Code khaas taur par nahi.

## \`extensions.json\`: sahi tools ki sifaarish karna, unhe majboor kiye bina

\`\`\`json
// .vscode/extensions.json — VS Code pehli baar kholne par inhe install karne ko poochta hai
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma"
  ]
}
\`\`\`

Ek checked-in \`.vscode/extensions.json\` kuch bhi automatically install nahi karta ya kisi par koi khaas editor configuration majboor nahi karta — iske bajaye, VS Code project pehli baar kholne par is file ko pehchaanta hai aur ek dostana prompt dikhaata hai jo in khaas extensions ki sifaarish karta hai, is khaas project ne asal mein kya istemal kiya us hisaab se banaaye gaye (ek ESLint extension, Prisma istemal karti project ke liye ek Prisma extension). Ye baaki bacha gap band karta hai "settings aur debug configuration checked in hain" aur "un settings ko asal mein sahi tarike se istemal karne ke liye zaroori tools install hain" ke beech — ek naya developer apne bilkul pehle din sahi setup ki taraf guide kiya jaata hai, din baad ye pata lagaane ke bajaye ki ek gayab extension chupke se shared configuration ko iraade ke hisaab se kaam karne se rok raha tha.`,

    examples: [
      {
        title: 'Broken: one flat folder mixing routes, logic, and database access',
        titleHi: 'Toota: ek flat folder jismein routes, logic, aur database access mile hue',
        code: `// server.js — everything in one file
app.post("/orders/:id/refund", async (req, res) => {
  const order = await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
  const refundAmount = order.rows[0].payments[0].amount * 0.9; // business logic buried here
  res.json({ refunded: refundAmount });
});`,
        codeJs: `// server.js — routes, SQL, and business logic all interleaved,
// with no separation and no predictable place a new developer
// could look for "how is a refund amount calculated"
app.post("/orders/:id/refund", async (req, res) => {
  const order = await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
  const refundAmount = order.rows[0].payments[0].amount * 0.9;
  await pool.query("UPDATE orders SET refunded = $1 WHERE id = $2", [refundAmount, req.params.id]);
  res.json({ refunded: refundAmount });
});`,
        codeTs: `app.post("/orders/:id/refund", async (req: Request, res: Response): Promise<void> => {
  const order = await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
  const refundAmount = order.rows[0].payments[0].amount * 0.9;
  await pool.query("UPDATE orders SET refunded = $1 WHERE id = $2", [refundAmount, req.params.id]);
  res.json({ refunded: refundAmount });
});
// Correctly typed, completely valid TypeScript — the problem is
// organizational, not a type or logic error.`,
        output: `Works today, for this one route. As more routes are added, this
same file grows into a multi-thousand-line mix of HTTP handling,
SQL, and business rules with no structural way to find anything.`,
        explain: 'Nothing here separates "how a route is wired up" from "how a refund is actually calculated" — both live in the same function, in the same file as every other route in the entire application.',
        explainHi: 'Yahan kuch bhi "ek route kaise wire hota hai" ko "refund asal mein kaise calculate hota hai" se alag nahi karta — dono ek hi function mein rehte hain, poori application ke har doosre route jaisi hi file mein.',
      },
      {
        title: 'Fixed: a layered structure separating routes, controllers, and services',
        titleHi: 'Theek: routes, controllers, aur services ko alag karta ek layered structure',
        code: `// routes/orders.routes.js
router.post("/orders/:id/refund", ordersController.refund);

// controllers/orders.controller.js
async function refund(req, res, next) {
  try {
    const amount = await ordersService.calculateAndApplyRefund(req.params.id);
    res.json({ refunded: amount });
  } catch (err) { next(err); }
}

// services/orders.service.js
async function calculateAndApplyRefund(orderId) {
  const order = await orderModel.findById(orderId);
  const amount = order.payments[0].amount * 0.9;
  await orderModel.updateRefundAmount(orderId, amount);
  return amount;
}`,
        codeJs: `// src/routes/orders.routes.js
const router = require("express").Router();
const ordersController = require("../controllers/orders.controller");
router.post("/orders/:id/refund", ordersController.refund);
module.exports = router;

// src/controllers/orders.controller.js
const ordersService = require("../services/orders.service");
async function refund(req, res, next) {
  try {
    const amount = await ordersService.calculateAndApplyRefund(req.params.id);
    res.json({ refunded: amount });
  } catch (err) {
    next(err);
  }
}
module.exports = { refund };

// src/services/orders.service.js — no Express, no req/res, fully testable alone
const orderModel = require("../models/order.model");
async function calculateAndApplyRefund(orderId) {
  const order = await orderModel.findById(orderId);
  const amount = order.payments[0].amount * 0.9;
  await orderModel.updateRefundAmount(orderId, amount);
  return amount;
}
module.exports = { calculateAndApplyRefund };`,
        codeTs: `// src/routes/orders.routes.ts
import { Router } from "express";
import * as ordersController from "../controllers/orders.controller";
const router = Router();
router.post("/orders/:id/refund", ordersController.refund);
export default router;

// src/controllers/orders.controller.ts
import { Request, Response, NextFunction } from "express";
import * as ordersService from "../services/orders.service";
export async function refund(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const amount = await ordersService.calculateAndApplyRefund(req.params.id);
    res.json({ refunded: amount });
  } catch (err) {
    next(err);
  }
}

// src/services/orders.service.ts — framework-agnostic, unit-testable directly
import * as orderModel from "../models/order.model";
export async function calculateAndApplyRefund(orderId: string): Promise<number> {
  const order = await orderModel.findById(orderId);
  const amount = order.payments[0].amount * 0.9;
  await orderModel.updateRefundAmount(orderId, amount);
  return amount;
}`,
        outputJs: `The refund calculation now lives in exactly one predictable place —
services/orders.service.js — testable directly with a plain function
call, with no Express server, request, or response object required
at all.`,
        outputTs: `// Identical behaviour. The service layer's TypeScript types (string,
// Promise<number>) document its contract independently of any
// HTTP-specific concern.`,
        explain: 'Each layer has one job: the route wires a URL to a handler, the controller translates HTTP in and out, and the service holds the actual business logic — testable in complete isolation from Express.',
        explainHi: 'Har layer ka ek kaam hai: route ek URL ko ek handler se jodta hai, controller HTTP ko andar-baahar translate karta hai, aur service asli business logic rakhta hai — Express se poori tarah alag test ki jaane laayak.',
      },
      {
        title: 'A checked-in .vscode folder giving every clone the same setup',
        titleHi: 'Ek checked-in \`.vscode\` folder jo har clone ko wahi setup deta hai',
        code: `.vscode/
  settings.json     → format-on-save, ESLint auto-fix
  launch.json       → one-click debugger attached to "npm run dev"
  extensions.json    → recommends ESLint, Prettier, Prisma extensions`,
        codeJs: `// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": { "source.fixAll.eslint": true }
}

// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal"
    }
  ]
}`,
        codeTs: `// Identical .vscode/settings.json and launch.json — these files are
// plain JSON, not JavaScript or TypeScript, and apply the same way
// regardless of whether the project itself is written in JS or TS.
// tsconfig.json is the TS-specific piece of shared configuration:
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "commonjs"
  }
}`,
        outputJs: `A developer clones the repo, opens it in VS Code, and immediately
has format-on-save, ESLint auto-fix, and one-click debugging with
breakpoints — no manual setup, no asking a teammate how it works.`,
        outputTs: `// Identical benefit for a TypeScript project, plus tsconfig.json's
// "strict": true catching an entire category of bugs at compile
// time, identically for every contributor and every CI run.`,
        explain: 'Checking editor configuration into the repository turns "ask a teammate how to set up your editor" into "clone the repo" — the correct setup arrives automatically with the code.',
        explainHi: 'Editor configuration ko repository mein check-in karna "apna editor set up karne ke liye ek teammate se poocho" ko "repo clone karo" mein badal deta hai — sahi setup code ke saath automatically pahunchta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// Everything in one server.js file, growing indefinitely as routes are added
app.post("/orders/:id/refund", async (req, res) => { /* SQL + business logic + HTTP handling, all mixed */ });`,
        right: `// routes/ wires URLs to controllers; controllers/ handle HTTP;
// services/ hold business logic; models/ handle data access
router.post("/orders/:id/refund", ordersController.refund);`,
        why: 'A flat structure has no predictable convention for where any given piece of logic lives, forcing every developer, including the original author months later, to search rather than reliably guess.',
        whyHi: 'Ek flat structure mein koi anumaanit convention nahi hai ki koi diya logic ka tukda kahaan rehta hai, har developer ko, mahinon baad asli author ko bhi, bharosemand taur par anumaan lagaane ke bajaye dhoondhne majboor karte hue.',
      },
      {
        wrong: `// .gitignore
.vscode/
// the team's editor configuration never gets shared, everyone configures alone`,
        right: `// .gitignore
.vscode/*
!.vscode/settings.json
!.vscode/launch.json
!.vscode/extensions.json
// share the useful config files, ignore only personal, machine-specific ones`,
        why: 'Blanket-ignoring the entire .vscode/ folder discards the exact configuration meant to be shared across the team, forcing everyone to recreate their own formatting and debug setup by hand.',
        whyHi: 'Poore \`.vscode/\` folder ko blanket-ignore karna bilkul wahi configuration chhod deta hai jo team ke aar-paar share hone ke liye thi, sabko apni formatting aur debug setup haath se dobara banaane majboor karte hue.',
      },
      {
        wrong: `// services/orders.service.js
const { req, res } = require("express"); // service layer importing Express directly
async function calculateRefund(req) { return req.body.amount * 0.9; }`,
        right: `// services/orders.service.js — takes plain values, no Express types at all
async function calculateAndApplyRefund(orderId) { /* ...plain function, no req/res... */ }`,
        why: 'A service layer that depends on Express\'s req/res objects can no longer be tested or reused without a running HTTP server, defeating the entire purpose of separating business logic from the HTTP layer.',
        whyHi: 'Ek service layer jo Express ke \`req\`/\`res\` objects par nirbhar hai use ek chalti HTTP server ke bina test ya reuse nahi kiya jaa sakta, business logic ko HTTP layer se alag karne ka poora maqsad hi haar dete hue.',
      },
    ],

    realWorld: [
      {
        en: '**A layered structure separating routes, controllers, services, and models is one of the most widely adopted conventions across production Express and Node.js codebases**, closely mirroring the equivalent separation long established in other web frameworks across different languages.',
        hi: '**Routes, controllers, services, aur models ko alag karta ek layered structure production Express aur Node.js codebases mein sabse zyaada vyaapak roop se apnaayi jaane waali conventions mein se ek hai**, doosri languages ki doosri web frameworks mein lambe samay se sthaapit barabar ke separation ko kareebi se pratibimbit karte hue.',
      },
      {
        en: '**Checking .vscode/settings.json, launch.json, and extensions.json into the repository is a standard, widely recommended practice specifically because it removes an entire category of "works on my machine" onboarding friction** for every new contributor.',
        hi: '**\`.vscode/settings.json\`, \`launch.json\`, aur \`extensions.json\` ko repository mein check-in karna ek standard, vyaapak roop se recommend ki jaane waali practice hai khaas taur par isliye kyunki ye har naye contributor ke liye "mere machine par kaam karta hai" onboarding friction ki ek poori category hataata hai.**',
      },
      {
        en: '**TypeScript\'s strict mode, enforced identically for every contributor via a single shared tsconfig.json, is a commonly cited best practice for catching entire categories of bugs at compile time** rather than relying on any individual developer remembering to be careful.',
        hi: '**TypeScript ka strict mode, ek akele shared \`tsconfig.json\` ke zariye har contributor ke liye samaan roop se lagu, compile time par poori categories ke bugs pakadne ke liye ek aam taur par cite ki jaane waali best practice hai** kisi akele developer ke sambhaalne ke liye yaad rakhne par nirbhar hone ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does separating a Node.js application into routes, controllers, services, and models matter for a real, growing production codebase, rather than just being unnecessary ceremony for a small project?',
        qHi: 'Ek Node.js application ko routes, controllers, services, aur models mein alag karna ek asli, badhti production codebase ke liye kyun maayne rakhta hai, ek chhote project ke liye bekaar ceremony hone ke bajaye?',
        a: 'Separating these responsibilities matters because each layer has a genuinely different reason to change, and different developers reasonably need to touch different layers without stepping on each other. A route\'s job is purely to wire a URL and HTTP method to a specific handler function — this rarely changes once established. A controller\'s job is to translate between the HTTP world and the application\'s internal logic: parsing the request body, calling the appropriate business logic, and shaping the response — this changes when the API\'s external shape changes. A service holds the actual business logic — how a refund amount is calculated, what conditions make an order eligible for cancellation — and this changes whenever business rules themselves change, entirely independently of how that logic happens to be exposed over HTTP. A model is concerned with the shape of data and how it is persisted, changing when the underlying data model evolves. When all of this lives in one undifferentiated file, a change to a business rule, a change to an API\'s request shape, and a change to how data is stored all risk touching the exact same lines of code, causing merge conflicts between developers working on entirely unrelated concerns and making it much harder to test business logic in isolation, since testing it requires spinning up an HTTP server and simulating requests rather than simply calling a plain function directly. As a codebase grows from a handful of routes to dozens or hundreds, this separation is what keeps any single piece of logic findable and independently testable, rather than the entire application collapsing into one sprawling, tangled file that only the people who wrote it can safely navigate.',
        aHi: 'In zimmedariyon ko alag karna is liye maayne rakhta hai kyunki har layer ke paas badalne ka sach mein alag kaaran hai, aur alag developers samajhdaari se alag layers ko chhoo sakte hain ek doosre ke kaam mein rukaawat daale bina. Ek route ka kaam sirf ek URL aur HTTP method ko ek khaas handler function se jodna hai — ek baar sthaapit hone ke baad ye kam hi badalta hai. Ek controller ka kaam HTTP duniya aur application ki internal logic ke beech translate karna hai: request body parse karna, upyukt business logic call karna, aur response shape karna — ye badalta hai jab API ki bahari shape badalti hai. Ek service asli business logic rakhta hai — ek refund amount kaise calculate hota hai, kaunsi sthitiyaan ek order ko cancellation ke laayak banaati hain — aur ye badalta hai jab bhi business rules khud badalte hain, HTTP par kaise expose hote hain us se poori tarah alag. Ek model data ki shape aur ye kaise persist hoti hai iski chinta karta hai, jab underlying data model vikasit hota hai badalte hue. Jab ye sab ek na-alag-ki-gayi file mein rehta hai, ek business rule mein badlaav, ek API ke request shape mein badlaav, aur data kaise store hota hai us mein badlaav sab bilkul wahi lines chhoone ka khatra uthaate hain, poori tarah na-judi chinta par kaam kar rahe developers ke beech merge conflicts cause karte hue aur business logic ko akele test karna kaafi mushkil banaate hue, kyunki ise test karne ke liye ek HTTP server chalaana aur requests simulate karna padta hai seedhe ek saadha function call karne ke bajaye. Jaise-jaise ek codebase mutthi bhar routes se dazanon ya sainkadon tak badhta hai, ye separation hi hai jo kisi bhi ek logic ke tukde ko dhoondhne-laayak aur akele test karne-laayak rakhta hai, poori application ek phailti, uljhi hui file mein gir jaane ke bajaye jise sirf wo log jinhone likha safaltapoorvak navigate kar sakte hain.',
      },
      {
        q: 'Why should .vscode/settings.json and launch.json be checked into version control rather than left as a personal, local editor configuration?',
        qHi: '\`.vscode/settings.json\` aur \`launch.json\` version control mein check-in kyun kiye jaane chahiye, ek personal, local editor configuration ki tarah chhode jaane ke bajaye?',
        a: 'Leaving editor configuration as something each developer sets up individually, on their own machine, guarantees that configuration will drift and diverge across the team over time — one developer enables format-on-save and another does not, one has ESLint auto-fixing configured and another manually runs the linter occasionally, and the codebase\'s actual formatting and lint compliance ends up depending on which specific developer happened to touch a given file most recently, rather than being uniform throughout. Checking .vscode/settings.json into the repository turns this shared standard into something that travels with the code itself: the instant anyone clones the repository and opens it in VS Code, they receive the exact same formatter, the exact same auto-fix-on-save behavior, and the exact same linting configuration automatically, with no manual setup step required and no way to accidentally configure it differently without deliberately overriding the shared file. The same reasoning applies even more directly to launch.json: without a shared debug configuration, new developers commonly resort to scattering console.log statements throughout the code to inspect values, a slower and more error-prone way to investigate behavior than a real debugger with actual breakpoints, live variable inspection, and a full call stack. A checked-in launch.json means every developer gets one-click, fully configured debugging — correct breakpoints, correct entry point, correct runtime arguments — from the moment they clone the project, rather than needing to research and configure Node.js debugging in VS Code themselves before they can even begin investigating their first bug.',
        aHi: 'Editor configuration ko aisi cheez chhodna jo har developer apni machine par individually set up karta hai ye zamanat deta hai ki wo configuration waqt ke saath team ke aar-paar bhatak jaayegi aur alag ho jaayegi — ek developer format-on-save enable karta hai aur doosra nahi, ek ke paas ESLint auto-fixing configure hai aur doosra kabhi-kabhi haath se linter chalaata hai, aur codebase ki asli formatting aur lint compliance is baat par nirbhar ho jaati hai ki koi khaas file sabse haal mein kaunse developer ne chhui thi, poore mein ek-jaisi hone ke bajaye. \`.vscode/settings.json\` ko repository mein check-in karna is shared standard ko ek aisi cheez mein badal deta hai jo khud code ke saath safar karti hai: jis pal koi bhi repository clone karta hai aur use VS Code mein kholta hai, unhe bilkul wahi formatter, bilkul wahi save-par-auto-fix vyavhaar, aur bilkul wahi linting configuration automatically milti hai, koi manual setup step ki zaroorat bina aur galti se ise alag tarike se configure karne ka koi tarika bina jaan-boojhkar shared file ko override kiye. Wahi tark \`launch.json\` par aur bhi seedhe lagu hota hai: ek shared debug configuration ke bina, naye developers aam taur par poore code mein \`console.log\` statements bikhraane ki taraf jaate hain values dekhne ke liye, ek asli debugger ke muqable vyavhaar ki jaanch karne ka dheema aur zyaada galti-prone tarika jismein asli breakpoints, live variable inspection, aur ek poori call stack hoti hai. Ek checked-in \`launch.json\` matlab hai har developer ko ek-click, poori tarah configure ki gayi debugging milti hai — sahi breakpoints, sahi entry point, sahi runtime arguments — project clone karte hi, khud VS Code mein Node.js debugging research aur configure karne ki zaroorat se pehle jab tak wo apni pehli bug ki jaanch shuru bhi na kar sakein.',
      },
      {
        q: 'What is the practical benefit of a service layer having no dependency on Express or any HTTP-specific objects at all?',
        qHi: 'Ek service layer ka Express ya kisi bhi HTTP-khaas objects par koi nirbharta na hone ka vyavhaarik fayda kya hai?',
        a: 'A service function that accepts only plain values (an order ID, an amount) and returns a plain value, with no dependency on Express\'s request or response objects, can be called and tested directly as an ordinary function — passing in some input, awaiting the result, and asserting on what comes back — with no need to spin up an HTTP server, construct a fake request object, or simulate an actual network call. This makes writing genuinely fast, focused unit tests for business logic dramatically simpler, since a test can exercise exactly the calculation or rule being verified without any of the overhead or incidental complexity of the HTTP layer surrounding it. Beyond testing, this separation also means the exact same business logic can be reused in contexts that have nothing to do with an incoming HTTP request at all — a scheduled background job that needs to calculate refunds in bulk, a command-line administrative script, or a message-queue consumer processing events asynchronously can all call the same service function directly, without needing to fabricate a fake HTTP request just to reach logic that was never conceptually about HTTP in the first place. A service layer coupled directly to Express\'s req/res objects loses both of these benefits: it becomes untestable without an HTTP server, and unusable from any context other than directly handling an actual incoming HTTP request, unnecessarily tying business logic that has nothing to do with HTTP to the one specific transport mechanism that happens to trigger it in a web application.',
        aHi: 'Ek service function jo sirf saadhe values leta hai (ek order ID, ek amount) aur ek saadha value lautaata hai, Express ke request ya response objects par koi nirbharta bina, ise seedhe ek aam function ki tarah call aur test kiya jaa sakta hai — kuch input pass karke, result ka \`await\` karke, aur jo wapas aaya uspar assert karke — kisi HTTP server chalaane, ek nakli request object banaane, ya ek asli network call simulate karne ki zaroorat bina. Ye business logic ke liye sach mein tez, focused unit tests likhna naatakiya taur par saadha banaata hai, kyunki ek test bilkul us calculation ya rule ki jaanch kar sakta hai jise verify kiya jaa raha hai us ke aas-paas ki HTTP layer ke kisi bhi overhead ya aakasmik complexity bina. Testing se aage, ye separation ka matlab ye bhi hai ki bilkul wahi business logic un contexts mein reuse ki jaa sakti hai jinka ek aati HTTP request se bilkul koi lena-dena nahi — ek scheduled background job jise bulk mein refunds calculate karne hain, ek command-line administrative script, ya ek message-queue consumer jo events ko asynchronously process karta hai sab seedhe wahi service function call kar sakte hain, ek nakli HTTP request banaaye bina bas us logic tak pahunchne ke liye jo shuru se hi conceptually HTTP ke baare mein thi hi nahi. Ek service layer jo seedhe Express ke \`req\`/\`res\` objects se juda hai in dono faydon ko kho deta hai: ye HTTP server ke bina test-na-hone-laayak ban jaata hai, aur seedhe ek asli aati HTTP request handle karne ke alaawa kisi bhi context se istemal-na-hone-laayak, business logic ko jiska HTTP se koi lena-dena nahi bekaar mein us ek khaas transport mechanism se baandhte hue jo ek web application mein use trigger karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Take a small existing route handler that mixes SQL queries, business logic, and response formatting in one function, and split it into a route, a controller, and a service, following this lesson\'s structure.',
        taskHi: 'Ek chhota maujooda route handler lo jo SQL queries, business logic, aur response formatting ek function mein milaata hai, aur ise ek route, ek controller, aur ek service mein baanto, is lesson ke structure ka palan karte hue.',
        hint: 'Start by identifying which lines actually calculate something (business logic, belongs in the service) versus which lines only read the request or write the response (belongs in the controller).',
        hintHi: 'Pehchaan kar shuru karo ki kaunsi lines asal mein kuch calculate karti hain (business logic, service mein rehni chahiye) versus kaunsi lines sirf request padhti hain ya response likhti hain (controller mein rehni chahiye).',
      },
      {
        task: 'Write a unit test for the extracted service function directly, calling it as a plain function with sample input, with no Express server running at all.',
        taskHi: 'Extract ki gayi service function ke liye seedhe ek unit test likho, ise ek saadhe function ki tarah sample input ke saath call karte hue, bilkul koi Express server chalaaye bina.',
        hint: 'If the test needs a running server or a real HTTP request object to work, that is a signal the service still has an HTTP dependency that should be removed.',
        hintHi: 'Agar test ko kaam karne ke liye ek chalta server ya ek asli HTTP request object chahiye, ye ek sanket hai ki service mein abhi bhi ek HTTP nirbharta hai jise hataana chahiye.',
      },
      {
        task: 'Create a .vscode/settings.json, launch.json, and extensions.json for a small existing project, and confirm that closing and reopening the project in VS Code applies the formatting and debug configuration automatically.',
        taskHi: 'Ek chhote maujooda project ke liye ek \`.vscode/settings.json\`, \`launch.json\`, aur \`extensions.json\` banaao, aur confirm karo ki VS Code mein project ko band karke dobara kholna formatting aur debug configuration automatically lagu karta hai.',
        hint: 'Test this genuinely by closing VS Code entirely and reopening the folder fresh, rather than just checking the settings while the same window session is still open.',
        hintHi: 'Ise sach mein VS Code ko poori tarah band karke aur folder ko dobara taaza kholkar test karo, bas usi window session ke chalte settings check karne ke bajaye.',
      },
    ],

    keyTakeaways: [
      'A layered structure (routes, controllers, services, models) gives each piece of logic one predictable home, letting a developer correctly guess where something lives before ever being told.',
      'A service layer with no dependency on Express\'s req/res objects is independently unit-testable and reusable from background jobs, scripts, or queue consumers, not just from HTTP requests.',
      'Checking .vscode/settings.json into the repository gives every developer the exact same formatting and linting configuration automatically on clone, eliminating drift between individually configured editors.',
      'A checked-in .vscode/launch.json gives every developer one-click, fully configured debugging with real breakpoints, replacing scattered console.log statements as the default way to investigate a bug.',
      'tsconfig.json\'s "strict": true and a shared .editorconfig extend the same "configuration travels with the code" principle to type-checking and to editors beyond VS Code specifically.',
      '.vscode/extensions.json recommends the specific tools a project actually needs without forcing them, closing the gap between shared configuration existing and the tools needed to use it correctly being installed.',
    ],
    keyTakeawaysHi: [
      'Ek layered structure (routes, controllers, services, models) logic ke har tukde ko ek anumaanit ghar deta hai, ek developer ko sahi tarike se anumaan lagaane dete hue ki kuch bataaye jaane se pehle kahaan rehta hai.',
      'Ek service layer jismein Express ke \`req\`/\`res\` objects par koi nirbharta nahi hai akele unit-test-laayak aur background jobs, scripts, ya queue consumers se reuse-laayak hai, sirf HTTP requests se nahi.',
      '\`.vscode/settings.json\` ko repository mein check-in karna har developer ko clone hote hi bilkul wahi formatting aur linting configuration automatically deta hai, individually configure kiye gaye editors ke beech bhatakaav khatam karte hue.',
      'Ek checked-in \`.vscode/launch.json\` har developer ko asli breakpoints ke saath ek-click, poori tarah configure ki gayi debugging deta hai, bikhre hue \`console.log\` statements ko ek bug ki jaanch karne ke default tarike ki tarah replace karte hue.',
      '\`tsconfig.json\` ka \`"strict": true\` aur ek shared \`.editorconfig\` "configuration code ke saath safar karti hai" siddhaant ko type-checking aur VS Code se aage ke editors tak badhaate hain.',
      '\`.vscode/extensions.json\` ek project ko asal mein zaroorat wale khaas tools ki sifaarish karta hai unhe majboor kiye bina, shared configuration ke maujood hone aur use sahi tarike se istemal karne ke liye zaroori tools install hone ke beech gap band karte hue.',
    ],
  },
];
