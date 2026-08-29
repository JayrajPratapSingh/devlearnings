/**
 * Node.js Complete Course — Module 1: Fundamentals, lesson 1.
 *
 * The event loop and non-blocking I/O — the single most important Node.js
 * concept, and the one every beginner coming from a request-per-thread
 * background (or from browser-only JavaScript) gets wrong first. The broken
 * example uses a synchronous file read inside an Express route handler,
 * demonstrating that it freezes EVERY concurrent request being served by
 * that process, not just the one that triggered it — a direct consequence
 * of Node running all JavaScript on a single thread. Cross-references the
 * JS course's event-loop-timers lesson (browser context) to contrast the
 * stakes: blocking the browser's main thread freezes one tab; blocking
 * Node's event loop freezes every concurrent user's request.
 *
 * Follows the same CourseLesson shape as the JS/CSS/TS/React courses,
 * reusing the shared type from course-js-module1.ts. JS/TS pairing is kept
 * throughout, since production Node backends commonly run either.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes, and also scan with a Python regex for
 * stray Devanagari characters before seeding (see prior courses' pattern).
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_1: CourseLesson[] = [
  {
    slug: 'event-loop-non-blocking-io',
    title: 'The Event Loop and Non-Blocking I/O',
    titleHi: 'Event Loop Aur Non-Blocking I/O',
    description: 'One slow request to /report — and every single other user on the server, requesting completely unrelated pages, freezes along with it.',
    descriptionHi: 'Ek dheemi request /report ko — aur server ke har doosre user ki, poori tarah na-judi pages maangte hue, request bhi uske saath jaam ho jaati hai.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 1,

    analogy: {
      en: '**A single waiter serving an entire restaurant, versus that same waiter standing at the oven staring at a slow-cooking dish.** Node.js runs your JavaScript on exactly one thread, like a restaurant with exactly one waiter serving every table. When that waiter places an order with the kitchen and immediately moves on to take the next table\'s order, refill water, and bring out other tables\' finished dishes — coming back to the first table\'s order only once the kitchen signals it is ready — every table gets served promptly, even though only one waiter exists. But if that same waiter instead walks into the kitchen and plants themselves in front of the oven, arms crossed, personally watching a slow dish cook because they refuse to do anything else until it is done, every OTHER table in the restaurant sits ignored — not because their own orders are slow, but because the one and only waiter is physically unavailable to serve anyone while staring at the oven. Non-blocking I/O is the first waiter; a blocking, synchronous call is the second.',
      hi: '**Ek akela waiter poore restaurant ki seva karta hai, versus wahi waiter oven ke saamne khada ek dheeme pak rahe dish ko ghoor raha hai.** Node.js aapka JavaScript bilkul ek thread par chalaata hai, ek aise restaurant ki tarah jismein bilkul ek waiter har table ki seva karta hai. Jab wo waiter kitchen mein order rakhta hai aur turant agli table ka order lene, paani bharne, aur doosri tables ki taiyaar dishes laane chala jaata hai — pehli table ke order tak wapas tabhi aata hai jab kitchen ishaara karti hai wo taiyaar hai — har table turant seva paati hai, chahe sirf ek hi waiter maujood ho. Par agar wahi waiter iske bajaye kitchen mein jaakar oven ke saamne khud ko rakh de, haath baandhe, khud ek dheemi dish ko pakte dekhta rahe kyunki wo kuch aur karne se mana karta hai jab tak wo poori na ho, restaurant ki har DOOSRI table nazarandaaz baithi rehti hai — is liye nahi ki unke apne orders dheeme hain, balki isliye kyunki wo ek aur akela waiter physically kisi ki bhi seva karne ke liye maujood nahi hai jab tak wo oven ghoorta rehta hai. Non-blocking I/O pehla waiter hai; ek blocking, synchronous call doosra hai.',
    },

    simple: `**Start broken.** An Express route that reads a large report file, using the synchronous version of \`fs.readFile\`:

\`\`\`js
const express = require("express");
const fs = require("fs");
const app = express();

app.get("/report", (req, res) => {
  const data = fs.readFileSync("./large-report.csv", "utf-8");   // blocks the thread
  res.send(data);
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(3000);
\`\`\`

Open two browser tabs. In the first, request \`/report\` — a large file that takes, say, two real seconds to read off disk. WHILE that request is still in progress, in the second tab, request \`/ping\` — a route that does nothing but immediately send back the string \`"pong"\`. \`/ping\` does not respond immediately. It hangs, completely unresponsive, for the same two seconds \`/report\` is still reading its file, even though \`/ping\`\'s own handler has zero relationship to \`/report\`\'s file read and would normally return in a fraction of a millisecond. \`fs.readFileSync\` is SYNCHRONOUS — it makes Node\'s one and only JavaScript thread stop and wait, doing absolutely nothing else, until the entire file has been read from disk. Because that same single thread is what every request to this server runs on, no other request — not \`/ping\`, not a request from a different user entirely, not anything — can be processed at all while that thread is occupied reading the file, no matter how unrelated the other requests are.

**The fix: the asynchronous, non-blocking version of the same API**

\`\`\`js
const express = require("express");
const fs = require("fs/promises");
const app = express();

app.get("/report", async (req, res) => {
  const data = await fs.readFile("./large-report.csv", "utf-8");   // does NOT block the thread
  res.send(data);
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(3000);
\`\`\`

\`\`\`ts
import express, { Request, Response } from "express";
import fs from "fs/promises";

const app = express();

app.get("/report", async (req: Request, res: Response): Promise<void> => {
  const data = await fs.readFile("./large-report.csv", "utf-8");
  res.send(data);
});

app.get("/ping", (req: Request, res: Response): void => {
  res.send("pong");
});

app.listen(3000);
\`\`\`

Repeat the exact same two-tab test: request \`/report\`, and while it is still loading, request \`/ping\` — \`/ping\` now responds instantly, exactly as if \`/report\` were not running at all. \`fs.readFile\` from \`fs/promises\` does not make the JavaScript thread wait for the disk — it hands the actual file-reading work off to Node\'s underlying I/O system (backed by a separate thread pool inside \`libuv\`, Node\'s C++ engine, entirely outside your JavaScript code), and immediately returns control of the single JavaScript thread to the event loop, which is then free to pick up and run \`/ping\`\'s handler, or any other pending work, while the disk read happens in the background. Only once the file data is actually ready does Node schedule the rest of \`/report\`\'s handler (the code after \`await\`) to run — at that point, briefly, using the single thread again, but never blocking it for the entire multi-second duration of the disk read itself.

**This is the exact same event-loop machinery the JS course covered for the browser** (the event-loop-timers lesson) — a single thread, a queue of pending callbacks, synchronous code always running to completion before anything else gets a turn — but the STAKES are entirely different on a server: blocking the browser\'s main thread freezes one page for one user; blocking Node\'s event loop freezes every single concurrent request this one server process is handling, for every user, at the same time.`,

    simpleHi: `**Toote hue se shuru.** Ek Express route jo ek badi report file padhta hai, \`fs.readFile\` ke synchronous version se:

\`\`\`js
const express = require("express");
const fs = require("fs");
const app = express();

app.get("/report", (req, res) => {
  const data = fs.readFileSync("./large-report.csv", "utf-8");   // thread ko block karta hai
  res.send(data);
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(3000);
\`\`\`

Do browser tabs kholo. Pehli mein, \`/report\` maango — ek badi file jise, maano, disk se padhne mein do asli seconds lagte hain. JAB TAK wo request abhi bhi chal rahi hai, doosri tab mein, \`/ping\` maango — ek route jo kuch nahi karta sirf turant string \`"pong"\` wapas bhejta hai. \`/ping\` turant jawaab nahi deta. Ye poori tarah bekaraar ho jaata hai, wahi do seconds ke liye jab tak \`/report\` abhi bhi apni file padh raha hai, chahe \`/ping\` ke apne handler ka \`/report\` ki file read se bilkul koi rishta nahi aur normal roop se ek millisecond ke chhote hisse mein lautaana chahiye. \`fs.readFileSync\` SYNCHRONOUS hai — ye Node ke ek aur akele JavaScript thread ko rukne aur intezaar karne par majboor karta hai, bilkul kuch aur na karte hue, jab tak poori file disk se padh na li jaaye. Chunki wahi ek akela thread hai jispar is server ki har request chalti hai, koi doosri request — \`/ping\` nahi, ek poori tarah alag user ki request nahi, kuch bhi nahi — process ho sakti hai jab tak wo thread file padhne mein kabza hai, baaki requests chahe kitni bhi na-judi ho.

**Fix: usi API ka asynchronous, non-blocking version**

\`\`\`js
const express = require("express");
const fs = require("fs/promises");
const app = express();

app.get("/report", async (req, res) => {
  const data = await fs.readFile("./large-report.csv", "utf-8");   // thread ko BLOCK NAHI karta
  res.send(data);
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(3000);
\`\`\`

\`\`\`ts
import express, { Request, Response } from "express";
import fs from "fs/promises";

const app = express();

app.get("/report", async (req: Request, res: Response): Promise<void> => {
  const data = await fs.readFile("./large-report.csv", "utf-8");
  res.send(data);
});

app.get("/ping", (req: Request, res: Response): void => {
  res.send("pong");
});

app.listen(3000);
\`\`\`

Bilkul wahi do-tab test dohraao: \`/report\` maango, aur jab tak wo abhi bhi load ho raha hai, \`/ping\` maango — \`/ping\` ab turant jawaab deta hai, bilkul jaise \`/report\` chal hi na raha ho. \`fs/promises\` wala \`fs.readFile\` JavaScript thread ko disk ke liye intezaar nahi karaata — ye asli file-padhne wala kaam Node ke underlying I/O system ko de deta hai (\`libuv\` ke andar ek alag thread pool se backed, Node ka C++ engine, aapke JavaScript code se poori tarah bahar), aur turant akele JavaScript thread ka control event loop ko wapas de deta hai, jo phir \`/ping\` ka handler, ya koi bhi doosra lambit kaam, uthaakar chalaane ke liye aazad hai, jabki disk read peeche hoti rehti hai. Sirf jab file data asal mein taiyaar hota hai tabhi Node \`/report\` ke handler ke baaki hisse ko (\`await\` ke baad wala code) chalane ke liye schedule karta hai — us pal, chhoti der ke liye, wahi akela thread dobara use karte hue, par kabhi use disk read ki poori multi-second avadhi ke liye block kiye bina.

**Ye bilkul wahi event-loop machinery hai jo JS course ne browser ke liye cover ki thi** (event-loop-timers lesson) — ek akela thread, lambit callbacks ki ek queue, synchronous code hamesha poora hone tak chalta hai kisi aur ki baari aane se pehle — par server par DAAV poori tarah alag hain: browser ke main thread ko block karna ek page ko ek user ke liye jaam karta hai; Node ke event loop ko block karna is ek server process ki har akeli chalti request ko jaam karta hai, har user ke liye, ek hi waqt mein.`,

    content: `## Why Node.js has only one JavaScript thread in the first place

\`\`\`js
console.log("This line runs on THE thread.");
setTimeout(() => console.log("So does this one, later."), 0);
fs.readFile("./file.txt", () => console.log("And this one, whenever the disk finishes."));
\`\`\`

Every single line of your own JavaScript — every route handler, every callback, every \`.then()\` — runs on exactly one thread, no matter how many CPU cores the machine has or how many requests arrive simultaneously. This is a deliberate design choice, not a limitation Node happens to have: a single thread means there is never a need for locks, mutexes, or the entire category of bugs that come from multiple threads reading and writing the same JavaScript variables at the same time (a class of bug common in genuinely multi-threaded languages). Node achieves concurrency — serving many requests at once — not by running your code on multiple threads, but by never letting any single piece of your code sit around WAITING for something slow (disk, network, a database) to finish; instead, it hands the waiting off elsewhere and moves on to other work.

## What "non-blocking" actually delegates to, and what it does not

\`\`\`js
// I/O-bound work: genuinely delegated to the OS / libuv's thread pool,
// freeing the JS thread while it happens
await fs.readFile("./file.txt");        // disk I/O
await fetch("https://api.example.com");  // network I/O
await db.query("SELECT * FROM users");    // database I/O (over the network, usually)

// CPU-bound work: NOT delegated anywhere — it runs directly on the one JS
// thread, and blocks it exactly like a synchronous call would
function isPrime(n) { /* ...a slow, hand-rolled loop checking every divisor... */ }
for (let i = 0; i < 10_000_000; i++) { isPrime(i); }   // blocks the thread completely
\`\`\`

Non-blocking APIs like \`fs.readFile\`, network requests, and most database drivers work because the actual waiting — for a disk, a network round-trip, another machine — happens outside your JavaScript entirely, in the operating system or in \`libuv\`\'s own background thread pool, with only a small callback (\`"the data is ready, here it is"\`) handed back to the single JS thread once the slow part is done. This delegation only works for I/O — waiting on something external. A CPU-bound task — sorting a huge array, hashing a password expensively on purpose, running a long loop of pure computation — has no external "waiting" to delegate; the calculation itself has to happen somewhere, and by default that somewhere is the one JavaScript thread, blocking it identically to a synchronous file read for as long as the computation takes. This is precisely why \`async\`/\`await\` alone does not automatically make expensive CPU work non-blocking — genuinely offloading CPU-bound work requires Worker Threads or a separate process, covered later in this course\'s Pro module.

## When a synchronous call is genuinely fine

\`\`\`js
// Fine: reading a config file ONCE, at startup, BEFORE the server starts accepting requests
const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

const app = express();
app.get("/", (req, res) => res.send(config.welcomeMessage));
app.listen(3000);   // nothing is listening for requests yet when the sync read above happened
\`\`\`

The problem with a blocking call is specifically that it prevents OTHER pending work from running while it executes — if there genuinely is no other pending work yet (nothing has connected to the server, no other request is queued), a synchronous call blocks nothing meaningful. Reading a configuration file synchronously at the very top of a server\'s startup code, before \`app.listen()\` has even been called, is a common and reasonable use of the \`Sync\` APIs, precisely because no user request could possibly be waiting at that point in the program\'s life. The moment the server starts accepting connections, however, every synchronous call inside a request handler risks blocking every other request that might arrive while it runs.

## The naming convention: how to tell blocking and non-blocking APIs apart

\`\`\`js
fs.readFileSync(path);              // BLOCKING — the "Sync" suffix is the signal
fs.readFile(path, callback);         // non-blocking, callback-based
fs.promises.readFile(path);          // non-blocking, Promise-based (same as "fs/promises")
\`\`\`

Node\'s own built-in modules follow a consistent naming pattern: any function ending in \`Sync\` is blocking by design, intended specifically for the startup-time or command-line-script cases where blocking is harmless; the non-\`Sync\` version of the same function is non-blocking, either accepting a callback (Node\'s original style) or returning a Promise (via \`fs/promises\`, usable with \`async\`/\`await\`). Recognizing this \`Sync\` suffix is the fastest way to audit code for the exact mistake this lesson opened with — a request handler calling any \`*Sync\` function is worth a second look.

## TypeScript: typing Express route handlers correctly

\`\`\`ts
import { Request, Response, NextFunction } from "express";

app.get("/report", async (req: Request, res: Response): Promise<void> => {
  const data = await fs.readFile("./large-report.csv", "utf-8");
  res.send(data);
});
\`\`\`

Express ships its own TypeScript types for \`Request\` and \`Response\` — typing a handler\'s parameters as \`(req: Request, res: Response)\` gives autocomplete and type-checking on properties like \`req.params\`, \`req.query\`, and \`res.send\`/\`res.json\`, the same benefit typed props gave components throughout the React course. An \`async\` handler\'s return type is conventionally annotated \`Promise<void>\` — the handler does not return a meaningful value to Express itself (Express does not do anything with a route handler\'s return value); it communicates its result entirely through calling methods on \`res\`, so \`void\` (wrapped in \`Promise\` because the function is \`async\`) correctly represents that "no return value" contract.`,

    contentHi: `## Node.js ke paas shuru mein sirf ek JavaScript thread kyun hai

\`\`\`js
console.log("Ye line THE thread par chalti hai.");
setTimeout(() => console.log("Ye bhi, baad mein."), 0);
fs.readFile("./file.txt", () => console.log("Aur ye bhi, jab bhi disk khatam kare."));
\`\`\`

Aapki apni JavaScript ki har akeli line — har route handler, har callback, har \`.then()\` — bilkul ek thread par chalti hai, chahe machine mein kitne bhi CPU cores hon ya ek saath kitni bhi requests aayein. Ye ek jaan-boojhkar design chunaav hai, koi seema nahi jo Node ke paas samyog se ho: ek akela thread ka matlab hai locks, mutexes, aur us poori bugs ki kism ki kabhi zarurat nahi jo kai threads ek hi JavaScript variables ko ek hi waqt padhne aur likhne se aati hai (aisi bug ki kism jo asal mein multi-threaded languages mein aam hai). Node concurrency haasil karta hai — ek saath kai requests ki seva karna — aapke code ko kai threads par chalaakar nahi, balki aapke code ke kisi bhi hisse ko kisi dheemi cheez (disk, network, database) ke poora hone ka INTEZAAR karne kabhi na dete hue; iske bajaye, ye intezaar kahin aur de deta hai aur baaki kaam ki taraf badh jaata hai.

## "Non-blocking" asal mein kya de deta hai, aur kya nahi

\`\`\`js
// I/O-bound kaam: sach mein OS / libuv ke thread pool ko de diya jaata hai,
// jab wo hota hai JS thread ko azaad karte hue
await fs.readFile("./file.txt");        // disk I/O
await fetch("https://api.example.com");  // network I/O
await db.query("SELECT * FROM users");    // database I/O (aam taur par network par)

// CPU-bound kaam: kahin bhi diya NAHI jaata — ye seedha akele JS thread
// par chalta hai, aur use bilkul ek synchronous call jaisa block karta hai
function isPrime(n) { /* ...dheema, haath se bana loop har divisor check karta hua... */ }
for (let i = 0; i < 10_000_000; i++) { isPrime(i); }   // thread ko poori tarah block karta hai
\`\`\`

\`fs.readFile\`, network requests, aur zyadatar database drivers jaisi non-blocking APIs isliye kaam karti hain kyunki asli intezaar — disk, network round-trip, doosri machine ke liye — poori tarah aapki JavaScript se bahar hota hai, operating system mein ya \`libuv\` ke apne background thread pool mein, sirf ek chhota callback (\`"data taiyaar hai, ye raha"\`) akele JS thread ko wapas thamaate hue jab dheema hissa poora ho jaaye. Ye delegation sirf I/O ke liye kaam karta hai — kisi bahar wali cheez ka intezaar. Ek CPU-bound kaam — ek badi array sort karna, jaan-boojhkar mehngi tarike se password hash karna, saadhi ganit ka lamba loop chalaana — ke paas de dene laayak koi bahar wala "intezaar" hai hi nahi; ganit khud kahin hona hi chahiye, aur default roop se wahan ek JavaScript thread hai, use bilkul ek synchronous file read jaisa block karte hue jitna der ganit lagta hai. Bilkul isi wajah se akela \`async\`/\`await\` mehnge CPU kaam ko apne aap non-blocking nahi banaata — CPU-bound kaam ko sach mein offload karne ke liye Worker Threads ya ek alag process chahiye, is course ke Pro module mein aage cover hoga.

## Kab ek synchronous call sach mein theek hai

\`\`\`js
// Theek: ek config file ko EK BAAR padhna, startup par, server ke requests accept karna SHURU karne se PEHLE
const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

const app = express();
app.get("/", (req, res) => res.send(config.welcomeMessage));
app.listen(3000);   // upar wala sync read hote waqt abhi tak koi requests sun hi nahi raha
\`\`\`

Ek blocking call ki samasya khaas taur par ye hai ki ye DOOSRE lambit kaam ko chalne se rokti hai jab tak wo chalti hai — agar sach mein abhi koi doosra lambit kaam hai hi nahi (kisi ne server se connect nahi kiya, koi doosri request line mein nahi hai), ek synchronous call kuch bhi matlabi block nahi karti. Server ke startup code ke bilkul upar, \`app.listen()\` bulaaye jaane se pehle bhi, ek configuration file ko synchronously padhna ek aam aur samajhdaari wala \`Sync\` APIs ka istemal hai, bilkul isliye kyunki program ki zindagi ke us pal koi bhi user request intezaar kar hi nahi sakti thi. Server ke connections accept karna shuru karte hi, halaanki, request handler ke andar har synchronous call har doosri request ko block karne ka khatra rakhti hai jo uske chalte hue aa sakti hai.

## Naming convention: blocking aur non-blocking APIs ko alag kaise pehchaano

\`\`\`js
fs.readFileSync(path);              // BLOCKING — "Sync" suffix hi ishara hai
fs.readFile(path, callback);         // non-blocking, callback-based
fs.promises.readFile(path);          // non-blocking, Promise-based ("fs/promises" jaisa hi)
\`\`\`

Node ke apne built-in modules ek sangat naming pattern follow karte hain: \`Sync\` par khatam hone wala koi bhi function design se blocking hai, khaas taur par startup-time ya command-line-script cases ke liye jahan blocking bekaar-asar-wala hai; usi function ka non-\`Sync\` version non-blocking hai, ya to ek callback accept karta hai (Node ka asli style) ya ek Promise lautaata hai (\`fs/promises\` ke through, \`async\`/\`await\` ke saath use hone laayak). Ye \`Sync\` suffix pehchaanna bilkul wahi galti ke liye code audit karne ka sabse tez tarika hai jo is lesson ki shuruaat mein thi — ek request handler jo koi \`*Sync\` function bulaata hai use dobara dekhne laayak hai.

## TypeScript: Express route handlers ko sahi type karna

\`\`\`ts
import { Request, Response, NextFunction } from "express";

app.get("/report", async (req: Request, res: Response): Promise<void> => {
  const data = await fs.readFile("./large-report.csv", "utf-8");
  res.send(data);
});
\`\`\`

Express \`Request\` aur \`Response\` ke liye apne khud ke TypeScript types bhejta hai — handler ke parameters ko \`(req: Request, res: Response)\` ki tarah type karna \`req.params\`, \`req.query\`, aur \`res.send\`/\`res.json\` jaisi properties par autocomplete aur type-checking deta hai, wahi faayda jo typed props ne poore React course mein components ko diya. Ek \`async\` handler ka return type roaayti roop se \`Promise<void>\` ki tarah annotate hota hai — handler Express ko khud koi matlabi value nahi lautaata (Express route handler ki return value ke saath kuch nahi karta); ye apna nateeja poori tarah \`res\` par methods bulaakar bataata hai, isliye \`void\` (\`Promise\` mein lapeta hua kyunki function \`async\` hai) sahi tarike se us "koi return value nahi" contract ko darzha karta hai.`,

    examples: [
      {
        title: 'Broken: a synchronous read blocks every other request',
        titleHi: 'Toota: ek synchronous read har doosri request ko block karta hai',
        code: `app.get("/report", (req, res) => {
  const data = fs.readFileSync("./large-report.csv", "utf-8");
  res.send(data);
});
app.get("/ping", (req, res) => res.send("pong"));`,
        codeJs: `const express = require("express");
const fs = require("fs");
const app = express();

app.get("/report", (req, res) => {
  console.log("Starting synchronous read...");
  const data = fs.readFileSync("./large-report.csv", "utf-8");
  console.log("Finished reading.");
  res.send(data);
});

app.get("/ping", (req, res) => {
  console.log("Handling /ping");
  res.send("pong");
});

app.listen(3000);`,
        codeTs: `import express, { Request, Response } from "express";
import fs from "fs";

const app = express();

app.get("/report", (req: Request, res: Response): void => {
  console.log("Starting synchronous read...");
  const data = fs.readFileSync("./large-report.csv", "utf-8");
  console.log("Finished reading.");
  res.send(data);
});

app.get("/ping", (req: Request, res: Response): void => {
  console.log("Handling /ping");
  res.send("pong");
});

app.listen(3000);
// TypeScript does not catch this — fs.readFileSync is a perfectly
// valid, correctly-typed function call. This is an event-loop/runtime
// behavior issue, not a type error.`,
        output: `Request /report (large file, ~2s to read) in one tab, then immediately
request /ping in another tab: /ping's console log ("Handling /ping")
does not appear, and its response does not arrive, until AFTER
"Finished reading." logs — a full ~2 second delay for a route that
does nothing at all.`,
        explain: 'The console logs make the blocking directly visible: "Handling /ping" is provably delayed until the synchronous read completes, even though nothing in /ping\'s own code has anything to do with reading files.',
        explainHi: 'Console logs blocking ko seedha dikhta banaate hain: "Handling /ping" saabit taur par tab tak der hota hai jab tak synchronous read poora nahi hota, chahe \`/ping\` ke apne code mein files padhne se koi lena-dena na ho.',
      },
      {
        title: 'Fixed: the async version frees the thread immediately',
        titleHi: 'Theek: async version thread ko turant azaad karta hai',
        code: `app.get("/report", async (req, res) => {
  const data = await fs.readFile("./large-report.csv", "utf-8");
  res.send(data);
});`,
        codeJs: `const express = require("express");
const fs = require("fs/promises");
const app = express();

app.get("/report", async (req, res) => {
  console.log("Starting async read...");
  const data = await fs.readFile("./large-report.csv", "utf-8");
  console.log("Finished reading.");
  res.send(data);
});

app.get("/ping", (req, res) => {
  console.log("Handling /ping");
  res.send("pong");
});

app.listen(3000);`,
        codeTs: `import express, { Request, Response } from "express";
import fs from "fs/promises";

const app = express();

app.get("/report", async (req: Request, res: Response): Promise<void> => {
  console.log("Starting async read...");
  const data = await fs.readFile("./large-report.csv", "utf-8");
  console.log("Finished reading.");
  res.send(data);
});

app.get("/ping", (req: Request, res: Response): void => {
  console.log("Handling /ping");
  res.send("pong");
});

app.listen(3000);`,
        outputJs: `Same two-tab test: "Handling /ping" logs and /ping responds
IMMEDIATELY, appearing in the console interleaved BEFORE "Finished
reading." — the event loop picked up /ping's handler while /report's
file read was still happening in the background.`,
        outputTs: `// Identical behaviour. The only code change from the broken version is
// "fs" -> "fs/promises" and adding "async"/"await" — the route logic
// itself, and every type, are otherwise unchanged.`,
        explain: 'The two console.log calls from /report ("Starting..." and "Finished...") now have /ping\'s log interleaved between them in real usage — direct, visible proof the thread was free to do other work during the read.',
        explainHi: '\`/report\` ke do console.log calls ("Starting..." aur "Finished...") ke beech ab asli istemal mein \`/ping\` ka log interleaved hai — seedha, dikhta saboot ki read ke dauran thread doosra kaam karne ke liye azaad tha.',
      },
      {
        title: 'A synchronous call that is genuinely fine: reading config at startup',
        titleHi: 'Ek synchronous call jo sach mein theek hai: startup par config padhna',
        code: `const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
const app = express();
app.get("/", (req, res) => res.send(config.welcomeMessage));
app.listen(3000);`,
        codeJs: `const fs = require("fs");
const express = require("express");

// Runs ONCE, before app.listen() — no request could possibly be
// waiting yet, so nothing is delayed by this blocking read.
const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

const app = express();
app.get("/", (req, res) => res.send(config.welcomeMessage));
app.listen(3000, () => console.log("Server started"));`,
        codeTs: `import fs from "fs";
import express, { Request, Response } from "express";

interface AppConfig {
  welcomeMessage: string;
}

const config: AppConfig = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

const app = express();
app.get("/", (req: Request, res: Response): void => {
  res.send(config.welcomeMessage);
});
app.listen(3000, () => console.log("Server started"));`,
        outputJs: `The server takes a few extra milliseconds to start (while config.json
is read), but once app.listen() runs and "Server started" logs, every
subsequent request is served normally — the sync read happened entirely
before there was anyone to block.`,
        outputTs: `// The "AppConfig" interface documents config.json's expected shape —
// TypeScript would flag "config.welcmeMessage" (a typo) as a compile
// error, unlike the untyped JS version where it would silently be
// undefined.`,
        explain: 'This is the same fs.readFileSync function from the broken example — the difference is entirely about WHEN it runs (before any request could be waiting) rather than the function itself being inherently wrong to use.',
        explainHi: 'Ye toote example wala bilkul wahi \`fs.readFileSync\` function hai — fark poori tarah is baare mein hai ki ye KAB chalta hai (kisi request ke intezaar karne se pehle) function khud istemal karne ke liye buniyaadi taur par galat hone ke bajaye.',
      },
      {
        title: 'CPU-bound work blocks the thread identically, even with async/await',
        titleHi: 'CPU-bound kaam thread ko bilkul waisa hi block karta hai, async/await ke saath bhi',
        code: `app.get("/is-prime/:n", async (req, res) => {
  const n = Number(req.params.n);
  const result = isPrimeSlow(n);   // pure computation — nothing here is I/O
  res.json({ n, isPrime: result });
});`,
        codeJs: `function isPrimeSlow(n) {
  if (n < 2) return false;
  for (let i = 2; i < n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

app.get("/is-prime/:n", async (req, res) => {
  const n = Number(req.params.n);
  console.log("Computing...");
  const result = isPrimeSlow(n);   // a large prime "n" can take seconds — pure CPU work
  console.log("Done computing.");
  res.json({ n, isPrime: result });
});

app.get("/ping", (req, res) => res.send("pong"));
// Requesting /is-prime/2147483647 (a large prime) then immediately
// requesting /ping: /ping STILL hangs until the computation finishes,
// exactly like the original fs.readFileSync example.`,
        codeTs: `function isPrimeSlow(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i < n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

app.get("/is-prime/:n", async (req: Request, res: Response): Promise<void> => {
  const n = Number(req.params.n);
  console.log("Computing...");
  const result = isPrimeSlow(n);
  console.log("Done computing.");
  res.json({ n, isPrime: result });
});

app.get("/ping", (req: Request, res: Response): void => {
  res.send("pong");
});
// TypeScript does not catch this either — an "async" function
// containing purely synchronous, CPU-bound code is completely valid.
// The "async" keyword does not make the code inside it non-blocking by
// itself; it only enables "await" for genuinely async operations.`,
        output: `Even though the route handler is declared "async", /ping hangs for the
full duration of isPrimeSlow(2147483647) — marking a function async
does nothing to make CPU-bound work inside it non-blocking; only I/O
operations actually delegated elsewhere (as in the fixed fs example)
free the thread.`,
        explain: 'This is the single most common misconception this lesson exists to correct: "async" is not a magic keyword that makes everything inside it non-blocking — it only matters for code that actually awaits genuine I/O; pure computation blocks the thread with or without it.',
        explainHi: 'Ye is lesson ka sabse aam galatfehmi hai jise theek karne ke liye ye maujood hai: \`async\` koi jaadu wala keyword nahi hai jo uske andar sab kuch non-blocking bana de — ye sirf us code ke liye matter karta hai jo asal mein asli I/O await karta hai; saadhi ganit thread ko block karti hai uske saath ya uske bina.',
      },
    ],

    mistakes: [
      {
        wrong: `app.get("/report", (req, res) => {
  const data = fs.readFileSync("./large-report.csv", "utf-8");
  res.send(data);
});
// blocks the entire server for every other request while this reads`,
        right: `app.get("/report", async (req, res) => {
  const data = await fs.readFile("./large-report.csv", "utf-8");
  res.send(data);
});`,
        why: 'A synchronous call inside a route handler occupies Node\'s single JavaScript thread until it completes, which prevents every other pending request — no matter how unrelated — from being processed at all during that time.',
        whyHi: 'Route handler ke andar ek synchronous call Node ke akele JavaScript thread ko us se poora hone tak kabza mein rakhti hai, jo us waqt ke dauran har doosri lambit request ko — chahe kitni bhi na-judi ho — bilkul process hone se rokti hai.',
      },
      {
        wrong: `app.get("/is-prime/:n", async (req, res) => {
  const result = isPrimeSlow(Number(req.params.n));   // "async" alone does not help
  res.json({ isPrime: result });
});`,
        right: `// Genuinely offloading CPU-bound work requires a Worker Thread or a
// separate process (covered in this course's Pro module) — "async"/
// "await" alone only helps for actual I/O, never for pure computation.`,
        why: 'Marking a function "async" only matters for code that awaits genuine I/O delegated elsewhere — a synchronous, CPU-bound computation inside an async function still runs directly on and blocks the single JavaScript thread, identically to a blocking I/O call.',
        whyHi: 'Function ko "async" maark karna sirf us code ke liye matter karta hai jo kahin aur diye gaye asli I/O ko await karta hai — ek async function ke andar ek synchronous, CPU-bound ganit abhi bhi akele JavaScript thread par seedha chalti hai aur use block karti hai, ek blocking I/O call jaisa hi.',
      },
      {
        wrong: `const app = express();
app.get("/", (req, res) => res.send(config.welcomeMessage));
app.listen(3000);
const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));   // AFTER listen — a request could already be waiting`,
        right: `const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));   // BEFORE listen
const app = express();
app.get("/", (req, res) => res.send(config.welcomeMessage));
app.listen(3000);`,
        why: 'A synchronous call is only harmless when genuinely nothing else could be waiting on the thread at that moment — reading config after app.listen() has already started accepting connections risks blocking a real, already-arrived request, unlike reading it before the server starts listening at all.',
        whyHi: 'Ek synchronous call sirf tab bekaar-asar-wali hoti hai jab us pal thread par sach mein kuch aur intezaar kar hi nahi raha ho — \`app.listen()\` ke connections accept karna shuru kar chuke hone ke baad config padhna ek asli, pehle se aa chuki request ko block karne ka khatra rakhta hai, server ke bilkul sunna shuru karne se pehle use padhne ke ulat.',
      },
    ],

    realWorld: [
      {
        en: '**A blocked event loop is one of the most commonly diagnosed real production incidents in Node.js services**, typically discovered when a monitoring dashboard shows response times across ALL endpoints spiking together, rather than just one slow endpoint — a signature specifically caused by one blocking call freezing every concurrent request.',
        hi: '**Blocked event loop Node.js services mein sabse aksar diagnose hone wale asli production incidents mein se ek hai**, aam taur par tab pata chalta hai jab monitoring dashboard SAARE endpoints ke response times ko ek saath badhta dikhaata hai, sirf ek dheeme endpoint ke bajaye — ek nishaan jo khaas taur par ek blocking call se hota hai jo har chalti request ko jaam kar deti hai.',
      },
      {
        en: '**`eslint-plugin-node`\'s `no-sync` rule, widely enabled in production Node.js codebases, specifically flags any use of a `*Sync` function inside application code** — a linting rule built entirely around the exact mistake this lesson\'s broken example demonstrated.',
        hi: '**\`eslint-plugin-node\` ka \`no-sync\` rule, production Node.js codebases mein badi taur par enabled, khaas taur par application code ke andar kisi bhi \`*Sync\` function ke istemal ko flag karta hai** — ek linting rule jo poori tarah is lesson ke toote example wali bilkul wahi galti ke aas-paas bana hai.',
      },
      {
        en: '**Node.js\'s entire reputation for handling high concurrency with modest hardware comes directly from this non-blocking model** — a single Node process can genuinely serve thousands of simultaneous slow-I/O requests (waiting on databases, external APIs, file systems) precisely because it never dedicates a thread per connection the way older server architectures did.',
        hi: '**Node.js ki maamuli hardware ke saath badi concurrency sambhaalne ki poori naamvari seedha isi non-blocking model se aati hai** — ek akela Node process sach mein hazaaron ek-saath dheeme-I/O requests ki seva kar sakta hai (databases, external APIs, file systems ka intezaar karte hue) bilkul isliye kyunki ye kabhi har connection ke liye ek thread samarpit nahi karta jaise purani server architectures karti thi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a single slow, synchronous call inside one route handler cause every OTHER concurrent request to a Node.js server to hang, even requests to completely unrelated routes?',
        qHi: 'Ek route handler ke andar ek akeli dheemi, synchronous call Node.js server ki har DOOSRI chalti request ko jaam kyun karti hai, poori tarah na-jude routes ki requests ko bhi?',
        a: 'Node.js runs all JavaScript code — every route handler, every callback, regardless of which request triggered it — on exactly one thread, by design. When a synchronous call like fs.readFileSync executes, it does not return control of that thread back to Node until the entire operation completes; the thread is genuinely occupied, executing that one blocking call, for its full duration. Since every other pending request\'s handler is also JavaScript code that must run on that same single thread, and the thread is currently unavailable, none of that other code — regardless of how unrelated it is to the blocking operation — can execute until the blocking call finishes and returns the thread. This is not a bug or a resource limit being hit; it is the direct, structural consequence of Node.js\'s single-threaded execution model combined with a call that refuses to yield the thread while it works.',
        aHi: 'Node.js har JavaScript code — har route handler, har callback, chahe kaunsi request ne use trigger kiya ho — bilkul ek thread par chalaata hai, design se. Jab \`fs.readFileSync\` jaisi ek synchronous call chalti hai, ye us thread ka control Node ko tab tak wapas nahi karti jab tak poora operation poora nahi hota; thread sach mein kabza mein hai, wo ek blocking call chalate hue, uski poori avadhi ke liye. Chunki har doosri lambit request ka handler bhi JavaScript code hai jise usi ek thread par chalna chahiye, aur thread abhi maujood nahi hai, wo baaki koi bhi code — chahe blocking operation se kitna bhi na-juda ho — chal nahi sakta jab tak blocking call khatam hokar thread wapas nahi deta. Ye koi bug ya resource limit tak pahunchna nahi hai; ye Node.js ke single-threaded execution model ka seedha, structural nateeja hai ek aisi call ke saath jode jo kaam karte waqt thread chhodne se mana karti hai.',
      },
      {
        q: 'Why does using the async/fs.promises version of a function like readFile allow other requests to be served during the same disk read, when the synchronous version does not?',
        qHi: '\`readFile\` jaise function ka async/\`fs.promises\` version use karna wahi disk read ke dauran doosri requests ki seva karne kyun deta hai, jabki synchronous version aisa nahi karta?',
        a: 'The non-blocking version of an I/O function does not perform the actual waiting on the single JavaScript thread at all — it hands the real work (reading from disk, in this case) off to Node\'s underlying I/O system, backed by libuv\'s own separate thread pool operating outside of and independently from the JavaScript thread, and immediately returns control of the JavaScript thread to Node\'s event loop. With the JavaScript thread now free, the event loop is able to pick up and execute any other pending work — another request\'s handler, a timer callback, anything else queued — while the actual disk read happens in the background, on a different thread entirely. Only once that background work completes does Node schedule the specific callback (or, with async/await, the code after the await) waiting on that result to run, briefly using the JavaScript thread again at that point, but the thread was never occupied for the full duration of the slow operation the way it is with a synchronous call.',
        aHi: 'Kisi I/O function ka non-blocking version akele JavaScript thread par asli intezaar bilkul nahi karta — ye asli kaam (is case mein, disk se padhna) Node ke underlying I/O system ko de deta hai, libuv ke apne alag thread pool se backed jo JavaScript thread se bahar aur alag chalta hai, aur turant JavaScript thread ka control Node ke event loop ko wapas de deta hai. JavaScript thread ab azaad hone ke saath, event loop kisi bhi doosre lambit kaam ko uthaakar chala sakta hai — kisi doosri request ka handler, ek timer callback, line mein lagi kuch aur — jabki asli disk read peeche, ek poori tarah alag thread par hoti hai. Sirf jab wo background kaam poora hota hai tabhi Node us khaas callback ko (ya, async/await ke saath, \`await\` ke baad wale code ko) us nateeje ka intezaar karta hua chalne ke liye schedule karta hai, us pal chhoti der ke liye JavaScript thread dobara use karte hue, par thread us dheeme operation ki poori avadhi ke liye kabhi kabza mein nahi tha jaise ek synchronous call ke saath hota hai.',
      },
      {
        q: 'Why does marking a route handler function "async" not automatically make CPU-bound computation inside it non-blocking?',
        qHi: 'Ek route handler function ko "async" maark karna uske andar CPU-bound ganit ko apne aap non-blocking kyun nahi banaata?',
        a: 'The "async" keyword and "await" specifically enable a function to pause its own execution while waiting for a Promise to resolve, yielding the JavaScript thread back to the event loop during that wait, which is only useful and meaningful when there is genuinely something asynchronous being awaited — a Promise backed by real I/O delegated elsewhere, like a file read, network request, or database query. A plain, synchronous computation — a for loop, a mathematical calculation, sorting an array — has no Promise to await and nothing external to delegate the work to; it executes as ordinary, immediate, synchronous JavaScript regardless of whether it happens to be written inside a function marked "async" or not, running directly on and fully occupying the single JavaScript thread for its entire duration, identically to how it would block if the "async" keyword were removed entirely. "async" changes how a function\'s return value and internal pausing behave; it does not change how the CPU-bound parts of that function\'s own code execute.',
        aHi: '"async" keyword aur "await" khaas taur par ek function ko apna khud ka execution rokne dete hain jab tak ek Promise resolve ho, us intezaar ke dauran JavaScript thread ko event loop ko wapas dete hue, jo sirf tab kaam ka aur matlabi hai jab sach mein kuch asynchronous await ho raha ho — ek Promise jo asli I/O se backed ho jo kahin aur di gayi ho, jaise file read, network request, ya database query. Ek saadhi, synchronous ganit — ek for loop, ek ganitiya ganit, ek array sort karna — ke paas await karne laayak koi Promise nahi aur kaam dene laayak koi bahar wali cheez nahi; ye chahe "async" maark hue function ke andar likhi ho ya nahi, aam, turant, synchronous JavaScript ki tarah chalti hai, seedha akele JavaScript thread par apni poori avadhi ke liye poori tarah kabza karte hue, bilkul waisa hi jaisa "async" keyword poori tarah hataane par block karti. "async" ye badalta hai ki function ki return value aur internal rukna kaise behave karta hai; ye ye nahi badalta ki us function ke apne code ke CPU-bound hisse kaise chalte hain.',
      },
      {
        q: 'Under what specific condition is calling a synchronous, blocking function inside a Node.js server genuinely safe, and why does that condition matter?',
        qHi: 'Kis khaas condition mein Node.js server ke andar ek synchronous, blocking function bulaana sach mein surakshit hai, aur wo condition kyun matter karti hai?',
        a: 'A blocking call is only harmful to the extent that other pending work genuinely exists and is prevented from running while the block occurs — the problem is specifically about denying the thread to work that is actually waiting, not about blocking being inherently forbidden in every context. If a synchronous call runs at a point in the program where nothing else could possibly be waiting on the thread — most commonly, during server startup, before app.listen() has been called and the server has begun accepting any connections at all — there is no other pending request or callback for the block to delay, since none exists yet. This is why reading a configuration file synchronously at the top of a server\'s startup script is a common, accepted practice, while the identical function call inside a request handler, reached only after the server is already accepting and processing concurrent connections, is a genuine problem — the function itself is identical in both cases; what differs is whether anything else was actually waiting on the thread at the moment it ran.',
        aHi: 'Ek blocking call sirf usi had tak nuksaandayak hai jitna doosra lambit kaam sach mein maujood hai aur block hote waqt chalne se roka jaata hai — samasya khaas taur par thread ko us kaam se inkaar karne ke baare mein hai jo asal mein intezaar kar raha hai, har context mein blocking ke buniyaadi taur par mana hone ke baare mein nahi. Agar ek synchronous call program mein us pal chalti hai jahan thread par sach mein kuch aur intezaar kar hi nahi sakta — sabse aam taur par, server startup ke dauran, \`app.listen()\` bulaaye jaane se pehle aur server ne koi bhi connections accept karna shuru kiya hi na ho — block ko der karne ke liye koi doosri lambit request ya callback hai hi nahi, kyunki abhi tak koi maujood hi nahi. Bilkul isi wajah se server ke startup script ke bilkul upar ek configuration file synchronously padhna ek aam, sweekaar ki hui practice hai, jabki request handler ke andar wahi function call, sirf tab pahunchi jab server pehle se ek-saath connections accept aur process kar raha hai, ek asli samasya hai — function khud dono cases mein identical hai; jo alag hai wo ye hai ki jab ye chala tab thread par asal mein kuch aur intezaar kar raha tha ya nahi.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken Express server with /report (using fs.readFileSync on a genuinely large file) and /ping. Open two browser tabs, request /report in one, and immediately request /ping in the other. Time exactly how long /ping takes to respond.',
        taskHi: '/report (ek sach mein badi file par fs.readFileSync use karte hue) aur /ping wala toota Express server banao. Do browser tabs kholo, ek mein /report maango, aur turant doosri mein /ping maango. Bilkul naapo /ping ko jawaab dene mein kitna waqt lagta hai.',
        hint: 'Add console.log timestamps (Date.now()) at the start and end of each handler to measure the exact delay directly, rather than relying on how fast the response visually feels.',
        hintHi: 'Har handler ke shuru aur aakhir mein console.log timestamps (Date.now()) jodo asli der ko seedha naapne ke liye, response kitna tez mehsoos hota hai uspar bharosa karne ke bajaye.',
      },
      {
        task: 'Fix /report to use fs/promises with async/await. Repeat the exact same two-tab test and confirm /ping now responds immediately regardless of /report\'s progress.',
        taskHi: 'fs/promises aur async/await use karne ke liye /report theek karo. Bilkul wahi do-tab test dohraao aur confirm karo /ping ab turant jawaab deta hai /report ki pragati se bekhabar.',
        hint: 'Try adding a third route, /slow-cpu, doing a large synchronous loop (no file I/O at all) and confirm it blocks /ping exactly like the original fs.readFileSync did, proving the issue is blocking in general, not files specifically.',
        hintHi: 'Ek teesra route, /slow-cpu, jodne ki koshish karo jo ek bada synchronous loop kare (bilkul koi file I/O nahi) aur confirm karo ye /ping ko bilkul asli fs.readFileSync jaisa block karta hai, saabit karte hue ki samasya aam taur par blocking hai, khaas taur par files nahi.',
      },
      {
        task: 'Move the fs.readFileSync config-loading call to before app.listen() in a small server, and confirm via console.log ordering that it genuinely runs before any request could arrive.',
        taskHi: 'fs.readFileSync config-loading call ko ek chhote server mein app.listen() se pehle le jaao, aur console.log ordering se confirm karo ki ye sach mein kisi bhi request ke aane se pehle chalta hai.',
        hint: 'Deliberately move the same call to AFTER app.listen() and try sending a request the instant the server starts, to see whether you can catch it blocking a real, already-arrived request.',
        hintHi: 'Jaan-boojhkar wahi call app.listen() ke BAAD le jaane ki koshish karo aur server shuru hote hi ek request bhejne ki koshish karo, dekhne ke liye kya aap ise ek asli, pehle-hi-aa-chuki request block karte hue pakad sakte ho.',
      },
    ],

    keyTakeaways: [
      'Node.js runs all JavaScript — every route handler and callback, regardless of which request triggered it — on exactly one thread; a blocking synchronous call occupies that thread completely until it finishes, preventing every other pending request from running at all.',
      'Non-blocking APIs (fs.promises, most database drivers, fetch) work by delegating the actual waiting to the OS or libuv\'s separate thread pool and immediately freeing the JavaScript thread, resuming only the specific callback once the result is ready.',
      'Node\'s built-in modules follow a naming convention: any function ending in "Sync" is blocking by design; auditing a codebase for "*Sync" calls inside request handlers is the fastest way to find this exact class of bug.',
      'A synchronous call is genuinely harmless only when nothing else could possibly be waiting on the thread — reading configuration before app.listen() is fine; the identical call inside a request handler, reached after the server is accepting connections, is not.',
      'Non-blocking delegation only applies to I/O (disk, network, database) — CPU-bound work (a heavy loop, expensive computation) has no external "waiting" to delegate and blocks the single thread identically to a synchronous call, with or without "async"/"await".',
      'Genuinely offloading CPU-bound work requires Worker Threads or a separate process, not async/await alone — covered later in this course\'s Pro module.',
    ],
    keyTakeawaysHi: [
      'Node.js har JavaScript — har route handler aur callback, chahe kaunsi request ne use trigger kiya ho — bilkul ek thread par chalaata hai; ek blocking synchronous call us thread ko poori tarah kabza mein rakhti hai jab tak wo khatam nahi hoti, har doosri lambit request ko bilkul chalne se rokte hue.',
      'Non-blocking APIs (fs.promises, zyadatar database drivers, fetch) asli intezaar OS ya libuv ke alag thread pool ko dekar aur turant JavaScript thread azaad karke kaam karti hain, sirf khaas callback ko dobara chalaate hue jab nateeja taiyaar ho.',
      'Node ke built-in modules ek naming convention follow karte hain: "Sync" par khatam hone wala koi bhi function design se blocking hai; request handlers ke andar "*Sync" calls ke liye codebase audit karna is bilkul bug kism ko dhoondhne ka sabse tez tarika hai.',
      'Ek synchronous call sach mein bekaar-asar-wali hai sirf tab jab thread par sach mein kuch aur intezaar kar hi nahi sakta — app.listen() se pehle configuration padhna theek hai; request handler ke andar wahi call, server ke connections accept karna shuru karne ke baad pahunchi, theek nahi hai.',
      'Non-blocking delegation sirf I/O (disk, network, database) par lagu hota hai — CPU-bound kaam (ek bhaari loop, mehngi ganit) ke paas de dene laayak koi bahar wala "intezaar" hai hi nahi aur akele thread ko bilkul ek synchronous call jaisa block karta hai, "async"/"await" ke saath ya bina.',
      'CPU-bound kaam ko sach mein offload karne ke liye Worker Threads ya ek alag process chahiye, akela async/await nahi — is course ke Pro module mein aage cover hoga.',
    ],
  },
];
