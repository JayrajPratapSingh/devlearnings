/**
 * Node.js Complete Course — Module 6: Pro, lesson 1.
 *
 * Worker Threads: resolves the foreshadowing from Module 1, lesson 1
 * ("CPU-bound work still blocks the event loop even inside an async
 * function... covered later in this course's Pro module"). Broken example:
 * a route computing a genuinely CPU-heavy value (a naive recursive
 * Fibonacci, standing in for real CPU-bound work like image processing or
 * report generation) directly in the request handler — freezing every
 * other concurrent request on the single JS thread, even though the route
 * itself is written as async. Fixed by offloading the computation to a
 * worker_threads Worker, which runs on a genuinely separate OS thread,
 * leaving the main thread free to keep handling other requests while the
 * computation proceeds in parallel.
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

export const NODE_MODULE_6: CourseLesson[] = [
  {
    slug: 'worker-threads-cpu-bound-work',
    title: 'Worker Threads: Finally Fixing CPU-Bound Blocking',
    titleHi: 'Worker Threads: CPU-Bound Blocking Ko Aakhirkaar Theek Karna',
    description: 'A "generate report" route computes for 4 seconds — and every other user\'s completely unrelated request freezes for those exact same 4 seconds, no matter how simple their request was.',
    descriptionHi: 'Ek "generate report" route 4 second ke liye calculate karta hai — aur har doosre user ki poori tarah na-judi request bilkul unhi 4 seconds ke liye freeze ho jaati hai, unki request chahe kitni bhi saadhi ho.',
    difficulty: 'HARD',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A single shop clerk who, upon receiving one customer\'s complex custom order, disappears into the back room for twenty minutes to build it by hand — leaving every other customer standing at the counter, unable to be helped, no matter how simple their own request would have been.** Node.js\'s single JS thread handling a CPU-heavy computation directly is like a shop with only one clerk, who is perfectly capable of juggling many customers at once for QUICK requests (checking a price, ringing up a sale, answering a question) by briefly attending to each in turn and moving on — this works beautifully because each individual task takes only a moment. But the instant one customer asks for something that requires the clerk to personally, physically build a complex item by hand for twenty straight minutes, the clerk is entirely consumed by that one task for the whole twenty minutes — no other customer can be helped at all during that window, even a customer who just wants a five-second answer to a simple question, because there is only one clerk, and a clerk in the middle of building something cannot simultaneously also answer someone else. Hiring a SECOND clerk specifically to handle these complex, time-consuming custom builds in a separate back workshop changes this entirely: the first clerk remains at the counter the whole time, freely helping every other customer with their quick requests exactly as before, while the second clerk works on the complex build independently, in parallel, in their own space — the two clerks are not fighting over the same counter or the same customers, they are doing genuinely separate work, at the same time, without either blocking the other.',
      hi: '**Ek akela shop clerk jo, ek customer ka complex custom order paate hi, use haath se banaane ke liye peeche wale room mein bees minute ke liye gaayab ho jaata hai — har doosre customer ko counter par khada chhodte hue, madad na paate hue, chahe unki apni request kitni bhi saadhi hoti.** Node.js ka akela JS thread ek CPU-heavy computation seedha sambhaalna ek aisi shop jaisa hai jismein sirf ek clerk hai, jo TEZ requests (ek price check karna, ek sale ring karna, ek sawaal ka jawaab dena) ke liye ek waqt mein kai customers ko juggle karne mein poori tarah samarth hai har ek ko thodi der ke liye dhyaan dekar aur aage badhkar — ye khoobsoorati se kaam karta hai kyunki har akela kaam sirf ek pal leta hai. Par jis pal ek customer kuch aisa maangta hai jo clerk se maang karta hai ki wo personally, physically ek complex item ko haath se bees seedhe minuton mein banaaye, clerk poori tarah us ek kaam mein poore bees minuton ke liye khoya rehta hai — us window ke dauraan koi doosra customer bilkul madad nahi paa sakta, ek customer bhi nahi jo bas ek saadhe sawaal ka paanch-second ka jawaab chahta hai, kyunki sirf ek clerk hai, aur ek clerk jo kuch banaane ke beech mein hai ek saath kisi doosre ko jawaab bhi nahi de sakta. Ek DOOSRA clerk khaas taur par in complex, waqt-lene-waale custom builds ko ek alag peeche wale workshop mein sambhaalne ke liye rakhna ise poori tarah badal deta hai: pehla clerk poora waqt counter par rehta hai, har doosre customer ki tez requests mein azaadi se madad karte hue bilkul pehle jaisa, jabki doosra clerk complex build par mustaqil taur par, parallel mein, apni khud ki jagah mein kaam karta hai — dono clerks ek hi counter ya ek hi customers ke liye ladte nahi hain, wo sach mein alag kaam kar rahe hain, ek hi waqt mein, ek-doosre ko roke bina.',
    },

    simple: `**Start broken.** A "generate report" route that performs a genuinely CPU-heavy calculation directly inside the request handler — recall from this course\'s very first lesson that \`async\`/\`await\` only helps with I/O, and does nothing at all for pure computation:

\`\`\`js
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

app.get("/report", (req, res) => {
  const result = fibonacci(42); // a deliberately expensive, CPU-bound calculation
  res.json({ result });
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});
\`\`\`

Sending a request to \`/report\` takes several real seconds to respond — \`fibonacci(42)\`, computed the naive recursive way, performs an enormous number of calculations, and the JS thread genuinely cannot do anything else until every single one of them completes, since JavaScript\'s single-threaded execution model (covered in this course\'s very first lesson) means only one piece of JS code can run at any given instant, with no other JS work able to interleave with it. This is exactly the "CPU-bound work still blocks even inside an async function" gap flagged back in that lesson: writing \`/report\` as \`async\` would change nothing here, because there is no \`await\`-able I/O operation anywhere in \`fibonacci\` for the event loop to hand off to \`libuv\`\'s thread pool — the entire computation is pure, synchronous JavaScript, executed start to finish on the one JS thread, with the event loop unable to interleave any other work in the middle of it. Critically, this means that while one user\'s request to \`/report\` is computing, an ENTIRELY UNRELATED request to \`/ping\` — arriving from a completely different user, asking for something trivially fast — sits waiting the whole time too, because the single JS thread has no way to pause the Fibonacci calculation partway through to briefly go answer \`/ping\` and then resume; it must finish the entire computation before it can process anything else at all.

**The fix: offload the computation to a Worker Thread, running on a genuinely separate OS thread**

\`\`\`js
// fibonacci-worker.js — runs on its own separate thread
const { parentPort, workerData } = require("worker_threads");

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData.n);
parentPort.postMessage(result);
\`\`\`

\`\`\`js
// server.js — the main thread stays free the whole time
const { Worker } = require("worker_threads");

app.get("/report", (req, res, next) => {
  const worker = new Worker("./fibonacci-worker.js", { workerData: { n: 42 } });

  worker.on("message", (result) => {
    res.json({ result });
  });
  worker.on("error", next);
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});
\`\`\`

\`\`\`ts
// fibonacci-worker.ts
import { parentPort, workerData } from "worker_threads";

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result: number = fibonacci(workerData.n as number);
parentPort?.postMessage(result);
\`\`\`

\`\`\`ts
// server.ts — the main thread stays free the whole time
import { Worker } from "worker_threads";
import { Request, Response, NextFunction } from "express";

app.get("/report", (req: Request, res: Response, next: NextFunction): void => {
  const worker = new Worker("./fibonacci-worker.js", { workerData: { n: 42 } });

  worker.on("message", (result: number) => {
    res.json({ result });
  });
  worker.on("error", next);
});
\`\`\`

A \`Worker\` (from Node.js\'s built-in \`worker_threads\` module) runs its own JavaScript file on a genuinely SEPARATE operating-system thread, with its own independent JavaScript engine instance and its own event loop, entirely distinct from the main thread\'s — this is fundamentally different from \`libuv\`\'s thread pool (used for I/O like file reads, discussed in this course\'s first lesson), which exists specifically to run non-JavaScript work off the main thread; a Worker exists specifically to run actual JavaScript CODE off the main thread. \`workerData\` passes initial input into the worker when it is created, and \`parentPort.postMessage()\` sends a result back once the worker\'s computation finishes; the main thread listens for that message asynchronously via \`worker.on("message", ...)\`, exactly like any other event-driven Node.js API. While the worker thread churns through \`fibonacci(42)\` on its own separate thread, the main thread\'s event loop remains completely free the entire time — a concurrent request to \`/ping\` is handled immediately, with no waiting at all, because the expensive computation is no longer occupying the one thread responsible for handling every incoming request.`,

    simpleHi: `**Toote hue se shuru.** Ek "generate report" route jo request handler ke andar seedha ek sach mein CPU-heavy calculation karta hai — is course ke bilkul pehle lesson se yaad karo ki \`async\`/\`await\` sirf I/O mein madad karta hai, aur pure computation ke liye bilkul kuch nahi karta:

\`\`\`js
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

app.get("/report", (req, res) => {
  const result = fibonacci(42); // ek jaan-boojhkar mehenga, CPU-bound calculation
  res.json({ result });
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});
\`\`\`

\`/report\` ko ek request bhejna jawaab dene mein kai asli seconds leta hai — \`fibonacci(42)\`, bhole recursive tarike se calculate hua, ek bahut badi tadaad ki calculations karta hai, aur JS thread sach mein tab tak kuch aur nahi kar sakta jab tak unmein se har akeli poori na ho, kyunki JavaScript ka single-threaded execution model (is course ke bilkul pehle lesson mein cover hua) matlab hai kisi bhi diye pal mein sirf ek JS code ka tukda chal sakta hai, koi doosra JS kaam usme mila nahi sakta. Ye bilkul wahi "CPU-bound kaam ek async function ke andar bhi block karta hai" wali kami hai jo us lesson mein flag ki gayi thi: \`/report\` ko \`async\` likhna yahan kuch bhi nahi badlega, kyunki \`fibonacci\` mein kahin bhi koi \`await\`-hone-laayak I/O operation nahi hai jise event loop \`libuv\` ke thread pool ko sonp sake — poori computation pure, synchronous JavaScript hai, shuru se aakhir tak ek JS thread par chalti hui, event loop uske beech mein koi doosra kaam mila na sakte hue. Bahut zaruri, iska matlab hai jabki ek user ki \`/report\` request calculate ho rahi hai, ek POORI TARAH NA-JUDI request \`/ping\` ko — ek poori tarah alag user se aati hui, kuch mamuli-taur-par-tez maangte hue — bhi poori der intezaar mein baithi rehti hai, kyunki akele JS thread ke paas Fibonacci calculation ko beech mein rokne aur thodi der ke liye \`/ping\` ka jawaab dene aur phir dobara shuru karne ka koi tarika nahi hai; ise poori computation poori karni chahiye us se pehle ki wo kuch aur process kare.

**Fix: computation ko ek Worker Thread mein le jaao, jo ek sach mein alag OS thread par chalta hai**

\`\`\`js
// fibonacci-worker.js — apne khud ke alag thread par chalta hai
const { parentPort, workerData } = require("worker_threads");

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData.n);
parentPort.postMessage(result);
\`\`\`

\`\`\`js
// server.js — main thread poori der khaali rehta hai
const { Worker } = require("worker_threads");

app.get("/report", (req, res, next) => {
  const worker = new Worker("./fibonacci-worker.js", { workerData: { n: 42 } });

  worker.on("message", (result) => {
    res.json({ result });
  });
  worker.on("error", next);
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});
\`\`\`

\`\`\`ts
// fibonacci-worker.ts
import { parentPort, workerData } from "worker_threads";

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result: number = fibonacci(workerData.n as number);
parentPort?.postMessage(result);
\`\`\`

\`\`\`ts
// server.ts — main thread poori der khaali rehta hai
import { Worker } from "worker_threads";
import { Request, Response, NextFunction } from "express";

app.get("/report", (req: Request, res: Response, next: NextFunction): void => {
  const worker = new Worker("./fibonacci-worker.js", { workerData: { n: 42 } });

  worker.on("message", (result: number) => {
    res.json({ result });
  });
  worker.on("error", next);
});
\`\`\`

Ek \`Worker\` (Node.js ke built-in \`worker_threads\` module se) apni JavaScript file ek sach mein ALAG operating-system thread par chalaata hai, apne mustaqil JavaScript engine instance aur apne event loop ke saath, main thread se poori tarah alag — ye \`libuv\` ke thread pool (I/O ke liye istemal hota hai jaise file reads, is course ke pehle lesson mein charcha hui) se buniyaadi taur par alag hai, jo khaas taur par non-JavaScript kaam ko main thread se bahar chalaane ke liye maujood hai; ek Worker khaas taur par asli JavaScript CODE ko main thread se bahar chalaane ke liye maujood hai. \`workerData\` shuruaati input worker mein daalta hai jab wo banta hai, aur \`parentPort.postMessage()\` ek nateeja wapas bhejta hai worker ki computation khatam hote hi; main thread us message ko asynchronously sunta hai \`worker.on("message", ...)\` ke through, bilkul kisi bhi doosre event-driven Node.js API ki tarah. Jab worker thread apni alag thread par \`fibonacci(42)\` mein guzarta hai, main thread ka event loop poori der poori tarah khaali rehta hai — \`/ping\` ko ek concurrent request turant handle hoti hai, koi intezaar bilkul nahi, kyunki mehenga computation ab har aati request handle karne ke zimmedaar akele thread par kabza nahi kar raha.`,

    content: `## Worker Threads vs. libuv\'s thread pool: two genuinely different mechanisms

\`\`\`js
// libuv's thread pool: handles non-JS work (file system calls, some crypto) off-thread
await fs.promises.readFile("data.txt");

// Worker Threads: run actual JavaScript CODE on a separate thread
const worker = new Worker("./heavy-computation.js");
\`\`\`

This course\'s first lesson explained that \`fs.promises.readFile()\` does not block the main JS thread because the actual file-reading work happens in \`libuv\`\'s internal thread pool, with only a lightweight callback (delivering the result) running back on the main JS thread. Worker Threads solve a DIFFERENT problem: they exist for situations where the actual bottleneck is JavaScript CODE ITSELF performing heavy computation (parsing a huge dataset, resizing an image, generating a PDF, running a complex algorithm) — work that is not I/O at all, and therefore has no way to be handed off to \`libuv\`\'s thread pool, since that pool runs system-level, non-JS operations, not arbitrary JS logic. A \`Worker\` gets its own real JavaScript engine instance, running on its own real OS thread, specifically so that genuinely CPU-heavy JavaScript code can execute in parallel with the main thread, rather than monopolizing the single thread every incoming request depends on.

## Communication between threads: message passing, not shared memory

\`\`\`js
worker.postMessage({ command: "start", n: 42 });
worker.on("message", (result) => { /* handle result */ });

// Inside the worker file:
parentPort.on("message", (msg) => { /* handle command from main thread */ });
parentPort.postMessage(computedResult);
\`\`\`

Unlike some other languages\' threading models, a Worker Thread does not share ordinary JavaScript variables or objects directly with the main thread — communication happens by explicitly PASSING MESSAGES back and forth (\`postMessage\`/\`on("message", ...)\`), with the data being sent automatically copied (or, for certain supported types, efficiently transferred) between the two threads rather than shared as one single, mutable piece of memory both sides can silently alter at the same time. This is a deliberate design choice that avoids an entire category of notoriously difficult concurrency bugs common in languages that DO allow direct shared-memory access between threads (two threads racing to modify the same variable at the same time, producing unpredictable results) — the trade-off is that data passed to and from a worker must be explicitly sent as a message, rather than simply read directly off the same objects the main thread holds.

## Worker Threads are for CPU-bound work — not a general concurrency upgrade for everything

\`\`\`js
// WRONG — spinning up a Worker for ordinary async I/O gains nothing
const worker = new Worker("./fetch-from-database.js"); // pool.query() already doesn't block

// RIGHT — a Worker is for genuinely CPU-heavy, synchronous computation
const worker = new Worker("./resize-image.js");
\`\`\`

It is a common misunderstanding to reach for a Worker Thread as a general performance upgrade for any slow-feeling route — but a route that is slow because of a database query, a slow external API call, or any other I/O-bound wait gains NOTHING from a Worker Thread, since that work was never blocking the main thread\'s event loop in the first place (this is exactly what \`async\`/\`await\` and \`libuv\`\'s thread pool already handle correctly, as covered earlier in this course). Worker Threads specifically address the narrower case where the bottleneck is genuine, synchronous, CPU-heavy JavaScript computation with no I/O involved at all — reaching for one anywhere else adds real complexity (message passing, a separate file, error handling across threads) for zero actual benefit.

## A brief look ahead: worker pools, and this technique\'s relationship to clustering

\`\`\`js
// A naive new Worker() per request can itself become a bottleneck under heavy load —
// creating a thread has real overhead; production systems commonly maintain a
// reusable pool of workers instead (via a library like piscina), handing work to an
// already-running worker rather than spinning up a brand new thread every time.
\`\`\`

Creating a brand-new \`Worker\` for every single incoming request, as this lesson\'s example does for clarity, has a real cost of its own — starting a new OS thread and a new JavaScript engine instance is not free, and under heavy concurrent load, naively creating one worker per request can itself become a bottleneck. Production systems commonly maintain a reusable POOL of already-running workers (using a library such as \`piscina\`, built specifically for this), handing incoming computation requests to an available worker from the pool rather than paying the thread-creation cost every single time — this is conceptually the same "create once, reuse many times" idea this course\'s connection-pooling lesson covered for database connections, applied here to worker threads instead. This lesson\'s Worker Threads (parallelizing CPU-bound work WITHIN a single running Node.js process) is a distinct, complementary technique from clustering (running multiple separate Node.js PROCESSES to use multiple CPU cores for handling more concurrent requests overall) — this course\'s next lesson covers clustering and process management directly.`,

    contentHi: `## Worker Threads vs. \`libuv\` ka thread pool: do sach mein alag mechanisms

\`\`\`js
// libuv ka thread pool: non-JS kaam (file system calls, kuch crypto) thread ke bahar sambhaalta hai
await fs.promises.readFile("data.txt");

// Worker Threads: asli JavaScript CODE ko ek alag thread par chalaate hain
const worker = new Worker("./heavy-computation.js");
\`\`\`

Is course ke pehle lesson ne samjhaaya tha ki \`fs.promises.readFile()\` main JS thread ko block nahi karta kyunki asli file-padhne wala kaam \`libuv\` ke internal thread pool mein hota hai, sirf ek halka callback (nateeja pahunchaate hue) main JS thread par wapas chalta hai. Worker Threads ek ALAG samasya solve karte hain: wo un sthitiyon ke liye maujood hain jahan asli bottleneck JavaScript CODE KHUD bhaari computation kar raha hai (ek bade dataset ko parse karna, ek image resize karna, ek PDF banaana, ek complex algorithm chalaana) — kaam jo bilkul I/O nahi hai, aur isliye \`libuv\` ke thread pool ko sonpa nahi jaa sakta, kyunki wo pool system-level, non-JS operations chalaata hai, manmaana JS logic nahi. Ek \`Worker\` apna asli JavaScript engine instance paata hai, apni asli OS thread par chalte hue, khaas taur par isliye taaki sach mein CPU-heavy JavaScript code main thread ke saath parallel mein chal sake, ek akele thread par kabza karne ke bajaye jis par har aati request nirbhar hai.

## Threads ke beech communication: message passing, shared memory nahi

\`\`\`js
worker.postMessage({ command: "start", n: 42 });
worker.on("message", (result) => { /* nateeja sambhaalo */ });

// Worker file ke andar:
parentPort.on("message", (msg) => { /* main thread se command sambhaalo */ });
parentPort.postMessage(computedResult);
\`\`\`

Kuch doosri languages ke threading models ke ulta, ek Worker Thread aam JavaScript variables ya objects seedha main thread ke saath share nahi karta — communication MESSAGES ko aage-peeche PAAS karke hoti hai (\`postMessage\`/\`on("message", ...)\`), bheji ja rahi data ko apne aap copy kiya jaata hai (ya, kuch supported types ke liye, kushalta se transfer kiya jaata hai) dono threads ke beech ek akele, badalne-laayak memory ke tukde ki tarah share karne ke bajaye jise dono taraf chupke se ek saath badal sakein. Ye ek jaan-boojhkar design choice hai jo concurrency bugs ki poori ek category se bachaata hai jo aksar un languages mein aam hai jo threads ke beech seedha shared-memory access allow KARTI HAIN (do threads ek hi variable ko ek hi waqt badalne ki race karte hue, anumaanit-na-hone-laayak nateeje paida karte hue) — trade-off ye hai ki worker ko aur usse data ko explicitly ek message ki tarah bheja jaana chahiye, seedha unhi objects se padhne ke bajaye jo main thread rakhta hai.

## Worker Threads CPU-bound kaam ke liye hain — har cheez ke liye koi aam concurrency upgrade nahi

\`\`\`js
// GALAT — aam async I/O ke liye ek Worker banaana kuch nahi paata
const worker = new Worker("./fetch-from-database.js"); // pool.query() pehle se hi block nahi karta

// SAHI — ek Worker sach mein CPU-heavy, synchronous computation ke liye hai
const worker = new Worker("./resize-image.js");
\`\`\`

Ye ek aam galatfehmi hai ki ek Worker Thread ko kisi bhi dheeme-mehsoos-hote route ke liye ek aam performance upgrade ki tarah istemal kiya jaaye — par ek route jo ek database query, ek dheemi bahari API call, ya kisi bhi doosre I/O-bound intezaar ki wajah se dheema hai Worker Thread se KUCH NAHI paata, kyunki wo kaam pehli jagah main thread ke event loop ko block kar hi nahi raha tha (bilkul yahi hai jo \`async\`/\`await\` aur \`libuv\` ka thread pool pehle se sahi tarike se sambhaalte hain, jaisa is course mein pehle cover hua). Worker Threads khaas taur par us sankeern case ko sambhaalte hain jahan bottleneck asli, synchronous, CPU-heavy JavaScript computation hai bilkul koi I/O shaamil hue bina — kahin aur ek ke liye pahunchna asli complexity jodta hai (message passing, ek alag file, threads ke aar-paar error handling) zero asli faayde ke liye.

## Aage ki ek chhoti jhalak: worker pools, aur is technique ka clustering se rishta

\`\`\`js
// Ek bhola \`new Worker()\` prati request khud ek bottleneck ban sakta hai bhaari load ke neeche —
// ek thread banaana asli overhead rakhta hai; production systems aam taur par
// workers ka ek dobara-istemal-hone-laayak pool maintain karte hain (jaise \`piscina\` library se),
// kaam ko ek pehle-se-chal-rahe worker ko sonpte hue bilkul nayi thread har baar banaane ke bajaye.
\`\`\`

Har akeli aati request ke liye ek bilkul-nayi \`Worker\` banaana, jaisa is lesson ka example saaf hone ke liye karta hai, apna khud ka ek asli keemat rakhta hai — ek nayi OS thread aur ek nayi JavaScript engine instance shuru karna muft nahi hai, aur bhaari concurrent load ke neeche, bhole taur par prati-request ek worker banaana khud ek bottleneck ban sakta hai. Production systems aam taur par pehle-se-chal-rahe workers ka ek dobara-istemal-hone-laayak POOL maintain karte hain (jaise \`piscina\` jaisi ek library istemal karke, khaas taur par isi ke liye bani hui), aati computation requests ko pool se ek upalabdh worker ko sonpte hue thread-banaane ki keemat har baar chukaane ke bajaye — ye conceptually wahi "ek baar banaao, kai baar dobara istemal karo" socch hai jo is course ke connection-pooling lesson ne database connections ke liye cover ki thi, yahan worker threads par lagu hui. Is lesson ke Worker Threads (ek akele chal rahe Node.js process KE ANDAR CPU-bound kaam ko parallel banaana) clustering se ek alag, poorak technique hai (kai alag Node.js PROCESSES chalaana kai CPU cores istemal karne ke liye zyaada concurrent requests kul mila kar sambhaalne ke liye) — is course ka agla lesson seedha clustering aur process management cover karta hai.`,

    examples: [
      {
        title: 'Broken: a CPU-heavy computation directly in the request handler freezes everyone',
        titleHi: 'Toota: request handler ke andar seedha ek CPU-heavy computation sabko freeze kar deta hai',
        code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

app.get("/report", (req, res) => {
  const result = fibonacci(42);
  res.json({ result });
});
// /ping cannot be answered until /report's computation fully completes`,
        codeJs: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

app.get("/report", (req, res) => {
  const result = fibonacci(42);
  res.json({ result });
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});`,
        codeTs: `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

app.get("/report", (req: Request, res: Response): void => {
  const result = fibonacci(42);
  res.json({ result });
});

app.get("/ping", (req: Request, res: Response): void => {
  res.json({ message: "pong" });
});
// Correctly typed, completely valid TypeScript — marking the route
// async here would change nothing, since there is no I/O to await.`,
        output: `A request to /report takes several real seconds. A concurrent
request to /ping, sent from a different browser tab at the exact same
moment, does not receive a response until /report's computation fully
finishes — despite /ping's own logic being trivially fast.`,
        explain: 'The single JS thread executes fibonacci(42) start to finish with no interruption possible — there is no await point anywhere in synchronous CPU-bound code for the event loop to use to interleave other work.',
        explainHi: 'Akela JS thread \`fibonacci(42)\` shuru se aakhir tak koi rukaawat ke mumkin bina chalata hai — synchronous CPU-bound code mein kahin bhi koi \`await\` point nahi hai jise event loop doosra kaam mila ne ke liye istemal kare.',
      },
      {
        title: 'Fixed: the same computation offloaded to a Worker Thread',
        titleHi: 'Theek: wahi computation ek Worker Thread mein le jaayi gayi',
        code: `const worker = new Worker("./fibonacci-worker.js", { workerData: { n: 42 } });
worker.on("message", (result) => res.json({ result }));
worker.on("error", next);`,
        codeJs: `// fibonacci-worker.js
const { parentPort, workerData } = require("worker_threads");

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData.n);
parentPort.postMessage(result);

// server.js
const { Worker } = require("worker_threads");

app.get("/report", (req, res, next) => {
  const worker = new Worker("./fibonacci-worker.js", { workerData: { n: 42 } });
  worker.on("message", (result) => res.json({ result }));
  worker.on("error", next);
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});`,
        codeTs: `// fibonacci-worker.ts
import { parentPort, workerData } from "worker_threads";

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result: number = fibonacci(workerData.n as number);
parentPort?.postMessage(result);

// server.ts
import { Worker } from "worker_threads";
import { Request, Response, NextFunction } from "express";

app.get("/report", (req: Request, res: Response, next: NextFunction): void => {
  const worker = new Worker("./fibonacci-worker.js", { workerData: { n: 42 } });
  worker.on("message", (result: number) => res.json({ result }));
  worker.on("error", next);
});

app.get("/ping", (req: Request, res: Response): void => {
  res.json({ message: "pong" });
});`,
        outputJs: `A request to /report still takes the same several seconds to compute
its result — the computation itself is no faster. But a concurrent
/ping request now receives an immediate response, since the main
thread's event loop was never occupied by the Fibonacci calculation.`,
        outputTs: `// Identical behaviour. workerData delivers the initial input, and
// parentPort.postMessage sends the finished result back — both running
// on the worker's own separate thread.`,
        explain: 'The fix does not make the computation itself faster — it moves the computation off the single thread every other request depends on, so unrelated requests are no longer forced to wait for it.',
        explainHi: 'Fix computation ko khud tez nahi banaata — ye computation ko us akele thread se hataata hai jis par har doosri request nirbhar hai, taaki na-judi requests ab uska intezaar karne ke liye majboor na hon.',
      },
      {
        title: 'Wrong reflex: reaching for a Worker Thread for ordinary I/O',
        titleHi: 'Galat jhatka: aam I/O ke liye ek Worker Thread ki taraf jaana',
        code: `const worker = new Worker("./fetch-posts-worker.js");
// pool.query() already does not block the main thread — this adds
// complexity (message passing, a separate file) for zero benefit`,
        codeJs: `// Unnecessary — pool.query() is already non-blocking I/O
app.get("/posts", (req, res, next) => {
  const worker = new Worker("./fetch-posts-worker.js");
  worker.on("message", (posts) => res.json(posts));
  worker.on("error", next);
});

// Correct — no worker needed at all, async/await already handles this
app.get("/posts", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `// Unnecessary — pool.query() is already non-blocking I/O
app.get("/posts", (req: Request, res: Response, next: NextFunction): void => {
  const worker = new Worker("./fetch-posts-worker.js");
  worker.on("message", (posts) => res.json(posts));
  worker.on("error", next);
});

// Correct — no worker needed at all, async/await already handles this
app.get("/posts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `Both versions eventually return the same posts, but the Worker
version adds real overhead (thread creation, message passing, a
separate file to maintain) for a route that was never blocking the
main thread in the first place.`,
        outputTs: `// Identical behaviour. The database query was already handled by
// libuv's thread pool underneath pool.query() — there is no CPU-bound
// JavaScript computation here for a Worker Thread to usefully offload.`,
        explain: 'Worker Threads solve CPU-bound blocking specifically — applying them to already-non-blocking I/O work adds complexity without addressing any actual bottleneck.',
        explainHi: 'Worker Threads khaas taur par CPU-bound blocking solve karte hain — pehle-se-non-blocking I/O kaam par unhe lagu karna koi asli bottleneck sambhaale bina complexity jodta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `app.get("/report", async (req, res) => {
  const result = fibonacci(42); // marking the route async changes nothing here
  res.json({ result });
});`,
        right: `app.get("/report", (req, res, next) => {
  const worker = new Worker("./fibonacci-worker.js", { workerData: { n: 42 } });
  worker.on("message", (result) => res.json({ result }));
  worker.on("error", next);
});`,
        why: 'async/await only helps with I/O that can be handed off to libuv\'s thread pool — a purely synchronous CPU-bound computation has no await point anywhere, so marking the function async provides no benefit at all.',
        whyHi: '\`async\`/\`await\` sirf us I/O mein madad karta hai jo \`libuv\` ke thread pool ko sonpi jaa sakti hai — ek poori tarah synchronous CPU-bound computation mein kahin koi \`await\` point nahi hai, isliye function ko \`async\` banaana bilkul koi faayda nahi deta.',
      },
      {
        wrong: `const worker = new Worker("./fetch-from-database.js");
// spinning up a Worker Thread for ordinary async I/O that already doesn't block`,
        right: `const result = await pool.query("SELECT * FROM posts");
// async/await and libuv's thread pool already handle this correctly`,
        why: 'Worker Threads address genuine CPU-bound blocking specifically — applying them to I/O that was never blocking the main thread adds real complexity for no actual benefit.',
        whyHi: 'Worker Threads khaas taur par asli CPU-bound blocking sambhaalte hain — unhe us I/O par lagu karna jo main thread ko kabhi block hi nahi kar raha tha koi asli faayde ke bina asli complexity jodta hai.',
      },
      {
        wrong: `app.get("/report", (req, res, next) => {
  const worker = new Worker("./fibonacci-worker.js", { workerData: { n: 42 } });
  worker.on("message", (result) => res.json({ result }));
  // no error listener — a worker crash leaves the request hanging forever
});`,
        right: `app.get("/report", (req, res, next) => {
  const worker = new Worker("./fibonacci-worker.js", { workerData: { n: 42 } });
  worker.on("message", (result) => res.json({ result }));
  worker.on("error", next);
});`,
        why: 'A worker that throws or crashes without an error listener attached leaves the original request permanently unresolved — following this course\'s centralized error-handling lesson, every worker needs its error event routed to next(err).',
        whyHi: 'Ek worker jo error listener attach kiye bina throw ya crash karta hai asli request ko permanently unresolved chhod deta hai — is course ke centralized error-handling lesson ka palan karte hue, har worker ke error event ko \`next(err)\` tak route karna chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**Node.js\'s own official documentation explicitly recommends Worker Threads specifically for CPU-intensive JavaScript operations**, directly naming this as their intended use case, distinct from the thread pool used for I/O — this lesson\'s guidance mirrors the platform\'s own stated design intent, not an informal convention.',
        hi: '**Node.js ki apni official documentation explicitly Worker Threads ko khaas taur par CPU-intensive JavaScript operations ke liye sujhaati hai**, seedha ise unka iraada kiya gaya use case naam deti hue, I/O ke liye istemal hote thread pool se alag — is lesson ki guidance platform ke apne bataaye design iraade ko darzha karti hai, koi anaupcharik convention nahi.',
      },
      {
        en: '**Real-world CPU-heavy Node.js workloads — image and video processing, PDF generation, large-scale data transformation, complex report generation — commonly use Worker Threads (or worker-pool libraries like piscina built on top of them) specifically to avoid freezing an application\'s ability to serve other requests.**',
        hi: '**Asli-duniya CPU-heavy Node.js workloads — image aur video processing, PDF generation, bade-paimaane par data transformation, complex report generation — aam taur par Worker Threads (ya unke oopar bane worker-pool libraries jaise \`piscina\`) istemal karte hain khaas taur par ek application ki doosri requests serve karne ki kshamta ko freeze hone se bachaane ke liye.**',
      },
      {
        en: '**Modern browser JavaScript has a directly analogous concept, Web Workers**, built for exactly the same underlying reason (keeping the browser\'s single main thread free to keep the page responsive while heavy computation runs elsewhere) — this is a general pattern in JavaScript environments, not a Node.js-specific oddity.',
        hi: '**Modern browser JavaScript mein ek seedha milta-julta concept hai, Web Workers**, bilkul isi underlying wajah se bana hua (browser ke akele main thread ko khaali rakhna taaki page responsive rahe jabki bhaari computation kahin aur chalti hai) — ye JavaScript environments mein ek aam pattern hai, koi Node.js-khaas ajeebiyat nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does marking a route\'s handler function as async provide no protection against the blocking caused by a genuinely CPU-bound computation like a naive recursive Fibonacci calculation?',
        qHi: 'Ek route ke handler function ko \`async\` banaana ek sach mein CPU-bound computation jaisa ek bhola recursive Fibonacci calculation ki wajah se hone waali blocking ke khilaaf koi raksha kyun nahi deta?',
        a: 'The async keyword, and the await operator used inside an async function, exist specifically to let a function pause at a point where it is waiting on an operation that will complete LATER — typically I/O, such as a database query or a file read — handing control back to the event loop during that wait so other work can proceed in the meantime, and resuming automatically once the awaited operation completes. This mechanism fundamentally depends on there being some operation to hand off and wait on in the first place. A purely synchronous computation, like the naive recursive fibonacci function, involves no I/O and no operation that completes independently in the background — every single step of the calculation is ordinary, synchronous JavaScript that must execute, one line after another, entirely on the calling thread, with no natural pause point where control could be handed back to the event loop. Marking the surrounding function as async does not change what happens inside the function\'s body at all — if there is no await expression anywhere within it, the function still runs its entire body synchronously, from start to finish, exactly as it would without the async keyword, and the single JS thread remains fully occupied by that computation for its entire duration regardless of how the function is declared.',
        aHi: '\`async\` keyword, aur ek \`async\` function ke andar istemal hone waala \`await\` operator, khaas taur par isliye maujood hain taaki ek function ek us point par ruk sake jahan wo ek aisi operation ka intezaar kar raha hai jo BAAD mein poori hogi — aam taur par I/O, jaise ek database query ya ek file read — us intezaar ke dauraan control event loop ko wapas sonpte hue taaki iss beech doosra kaam aage badh sake, aur \`await\` ki gayi operation poori hote hi apne aap dobara shuru ho jaate hue. Ye mechanism buniyaadi taur par isi baat par nirbhar karta hai ki pehli jagah sonpne aur intezaar karne ke liye koi operation ho. Ek poori tarah synchronous computation, jaisa bhola recursive \`fibonacci\` function, koi I/O aur koi aisi operation shaamil nahi karta jo peeche mustaqil taur par poori ho — calculation ka har akela step aam, synchronous JavaScript hai jise chalna chahiye, ek line ke baad doosri, poori tarah calling thread par, koi swaabhavik pause point bina jahan control event loop ko wapas sonpi jaa sake. Aas-paas ke function ko \`async\` banaana function ke body ke andar kya hota hai use bilkul nahi badalta — agar usme kahin bhi koi \`await\` expression nahi hai, function abhi bhi apna poora body synchronously chalata hai, shuru se aakhir tak, bilkul waisa jaisa \`async\` keyword ke bina chalata, aur akela JS thread us computation se poori uski avdhi ke liye poori tarah khoya rehta hai chahe function kaise bhi declare kiya gaya ho.',
      },
      {
        q: 'How does a Worker Thread solve the problem of a CPU-heavy computation blocking other requests, and how is this mechanism fundamentally different from how async/await handles I/O?',
        qHi: 'Ek Worker Thread ek CPU-heavy computation ke doosri requests block karne ki samasya ko kaise solve karta hai, aur ye mechanism buniyaadi taur par \`async\`/\`await\` I/O ko kaise sambhaalta hai us se alag kaise hai?',
        a: 'async/await handles I/O by handing the actual work off to something else entirely — typically libuv\'s underlying thread pool, or the operating system itself — so that the single JS thread never actually performs the I/O operation directly; it simply waits to be notified when the result is ready, remaining free to run other JavaScript in the meantime. This works precisely because I/O operations are not JavaScript code at all, and can be delegated to non-JS mechanisms built for exactly this. A CPU-bound computation is fundamentally different: it IS JavaScript code, meaning it cannot be handed off to libuv\'s thread pool, which is not designed to execute arbitrary JS logic. A Worker Thread solves this by creating an entirely separate execution context — its own JavaScript engine instance, running on its own genuine operating-system thread — capable of running actual JavaScript code independently and in parallel with the main thread. The CPU-heavy computation is moved to run inside this separate worker context instead of on the main thread, which means the main thread\'s single JS thread is never occupied by it at all, remaining completely free to keep handling other incoming requests via its own event loop while the worker thread churns through the computation independently, communicating the final result back via an explicit message once finished.',
        aHi: '\`async\`/\`await\` I/O ko sambhaalta hai asli kaam ko poori tarah kisi doosre ko sonpkar — aam taur par \`libuv\` ka underlying thread pool, ya operating system khud — taaki akela JS thread kabhi asal mein I/O operation seedha na kare; ye bas ye jaanne ka intezaar karta hai ki nateeja kab taiyaar hai, iss beech doosra JavaScript chalaane ke liye khaali rehte hue. Ye theek isliye kaam karta hai kyunki I/O operations bilkul koi JavaScript code nahi hain, aur unhe non-JS mechanisms ko sonpa jaa sakta hai jo bilkul isi ke liye bane hain. Ek CPU-bound computation buniyaadi taur par alag hai: ye JAVASCRIPT CODE HAI, matlab ise \`libuv\` ke thread pool ko sonpa nahi jaa sakta, jo manmaana JS logic chalaane ke liye design hi nahi hua. Ek Worker Thread ise ek poori tarah alag execution context banaakar solve karta hai — apna khud ka JavaScript engine instance, apni khud ki asli operating-system thread par chalte hue — asli JavaScript code mustaqil taur par aur main thread ke saath parallel mein chalane ki kshamta rakhte hue. CPU-heavy computation main thread ke bajaye is alag worker context ke andar chalne ke liye le jaayi jaati hai, jiska matlab hai main thread ka akela JS thread ise kabhi bilkul kabza nahi hota, doosri aati requests apne khud ke event loop se sambhaalte rehne ke liye poori tarah khaali rehte hue jabki worker thread mustaqil taur par computation mein guzarta hai, poora hote hi ek explicit message ke through aakhri nateeja wapas bataate hue.',
      },
      {
        q: 'Why is it a mistake to use a Worker Thread for a route that performs an ordinary database query, and what does this reveal about when Worker Threads are actually the appropriate tool?',
        qHi: 'Ek route ke liye Worker Thread istemal karna ek galti kyun hai jo ek aam database query karta hai, aur ye kya zaahir karta hai ki Worker Threads asal mein kab uchit tool hain?',
        a: 'A route performing an ordinary database query via pool.query() with await is already non-blocking with respect to the main thread — the actual waiting for the database to respond happens outside the main JS thread entirely (delegated to the underlying network I/O mechanism), and the main thread remains free to handle other requests during that wait, exactly as this course\'s connection-pooling and event-loop lessons established. Introducing a Worker Thread for this route does not address any actual blocking problem, because there was never a blocking problem to solve in the first place — the route was already correctly non-blocking. What a Worker Thread DOES add in this scenario is pure overhead and complexity with no corresponding benefit: creating a new thread has a real performance cost, the worker needs its own separate file, and communication with it requires explicit message passing rather than simply awaiting a promise directly. This distinction reveals the actual criterion for reaching for a Worker Thread correctly: it is appropriate specifically when the bottleneck is genuine, synchronous CPU-bound JavaScript computation with no I/O involved — not as a general-purpose performance technique to apply to any route that merely feels slow, regardless of why it is slow.',
        aHi: 'Ek route jo \`await\` ke saath \`pool.query()\` ke through ek aam database query karta hai main thread ke sandarbh mein pehle se hi non-blocking hai — database ke jawaab dene ka asli intezaar main JS thread se poori tarah bahar hota hai (underlying network I/O mechanism ko sonpa gaya), aur main thread us intezaar ke dauraan doosri requests sambhaalne ke liye khaali rehta hai, bilkul jaisa is course ke connection-pooling aur event-loop lessons ne sthaapit kiya. Is route ke liye ek Worker Thread introduce karna koi asli blocking samasya sambhaalta nahi, kyunki pehli jagah koi blocking samasya solve karne ke liye thi hi nahi — route pehle se hi sahi tarike se non-blocking tha. Is scenario mein ek Worker Thread jo ASAL MEIN jodta hai wo hai pure overhead aur complexity bina kisi barabar faayde ke: ek nayi thread banaana ek asli performance keemat rakhta hai, worker ko apni alag file chahiye, aur uske saath communication seedha ek promise ko \`await\` karne ke bajaye explicit message passing maangta hai. Ye farak Worker Thread ki taraf sahi tarike se pahunchne ka asli maapdand zaahir karta hai: ye khaas taur par tab uchit hai jab bottleneck asli, synchronous CPU-bound JavaScript computation ho bilkul koi I/O shaamil hue bina — kisi bhi route par lagu karne ke liye ek general-purpose performance technique ki tarah nahi jo bas dheema mehsoos hota hai, chahe wo dheema kyun ho.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /report and /ping routes exactly as shown. Open two browser tabs, request /report in one, and immediately request /ping in the other — confirm /ping waits until /report finishes.',
        taskHi: 'Bilkul dikhaaye gaye jaisa toota \`/report\` aur \`/ping\` routes banao. Do browser tabs kholo, ek mein \`/report\` maango, aur turant doosre mein \`/ping\` maango — confirm karo \`/ping\` \`/report\` khatam hone tak intezaar karta hai.',
        hint: 'If fibonacci(42) computes too quickly on your machine to clearly observe the freeze, increase the argument (try 44 or 46) until the delay is easily noticeable.',
        hintHi: 'Agar \`fibonacci(42)\` tumhaari machine par freeze saaf dekhne ke liye bahut jaldi calculate ho jaata hai, argument badhaao (44 ya 46 try karo) jab tak deri aasaani se noticeable na ho.',
      },
      {
        task: 'Fix it by moving the computation into a Worker Thread. Repeat the same two-tab test and confirm /ping now responds immediately regardless of /report\'s progress.',
        taskHi: 'Computation ko ek Worker Thread mein le jaakar theek karo. Wahi do-tab test dohraao aur confirm karo \`/ping\` ab turant jawaab deta hai \`/report\` ki pragati se bekhabar.',
        hint: 'Add a console.log with a timestamp at the start and end of both the /ping handler and the worker\'s computation to directly observe their execution overlapping in time.',
        hintHi: 'Ek \`console.log\` ek timestamp ke saath \`/ping\` handler aur worker ki computation dono ki shuruaat aur aakhir mein jodo seedha unke execution ko waqt mein overlap hote dekhne ke liye.',
      },
      {
        task: 'Deliberately introduce an error inside the worker file (like referencing an undefined variable) and confirm that without a worker.on("error", next) listener, the request hangs forever — then add the listener and confirm it now correctly returns an error response.',
        taskHi: 'Worker file ke andar jaan-boojhkar ek error lagu karo (jaise ek undefined variable ka reference dena) aur confirm karo ki bina ek \`worker.on("error", next)\` listener ke, request hamesha ke liye latak jaati hai — phir listener jodo aur confirm karo ye ab sahi tarike se ek error response lautaata hai.',
        hint: 'Try throwing inside the worker file directly (throw new Error("test")) right after computing the result, as a simple, deliberate way to trigger the worker\'s error event.',
        hintHi: 'Worker file ke andar seedha throw karne ki koshish karo (\`throw new Error("test")\`) nateeja calculate karne ke theek baad, worker ka error event trigger karne ka ek saadha, jaan-boojhkar tarika.',
      },
    ],

    keyTakeaways: [
      'A genuinely CPU-bound, synchronous computation blocks the single JS thread completely, regardless of whether the surrounding function is marked async — there is no await point anywhere in pure computation for the event loop to use.',
      'Worker Threads (worker_threads) run actual JavaScript code on a genuinely separate OS thread with its own engine instance, solving a different problem from libuv\'s thread pool, which only offloads non-JS I/O work.',
      'A Worker communicates with the main thread via explicit message passing (postMessage/on("message")), not shared memory — data is copied or transferred between threads rather than mutated directly by both sides.',
      'Worker Threads are for genuine CPU-bound bottlenecks specifically — applying them to ordinary I/O (a database query, an API call) that async/await already handles correctly adds real complexity for no benefit.',
      'Every worker needs its error event routed to next(err) (or equivalent handling) — an unhandled worker error leaves the originating request hanging forever.',
      'Creating a new Worker per request has real overhead; production systems commonly maintain a reusable worker pool (e.g., via piscina) rather than spinning up a fresh thread for every single computation.',
    ],
    keyTakeawaysHi: [
      'Ek sach mein CPU-bound, synchronous computation akele JS thread ko poori tarah block karta hai, chahe aas-paas ka function \`async\` maarka ho ya na ho — pure computation mein kahin koi \`await\` point nahi hai jise event loop istemal kare.',
      'Worker Threads (\`worker_threads\`) asli JavaScript code ek sach mein alag OS thread par apne engine instance ke saath chalaate hain, \`libuv\` ke thread pool se ek alag samasya solve karte hue, jo sirf non-JS I/O kaam offload karta hai.',
      'Ek Worker main thread se explicit message passing (\`postMessage\`/\`on("message")\`) ke through communicate karta hai, shared memory se nahi — data threads ke beech copy ya transfer hota hai dono taraf se seedha badla jaane ke bajaye.',
      'Worker Threads khaas taur par asli CPU-bound bottlenecks ke liye hain — unhe aam I/O par lagu karna (ek database query, ek API call) jise \`async\`/\`await\` pehle se sahi tarike se sambhaalta hai koi faayde ke bina asli complexity jodta hai.',
      'Har worker ke error event ko \`next(err)\` (ya barabar handling) tak route karna chahiye — ek na-sambhaali worker error asli request ko hamesha ke liye latka deti hai.',
      'Har request ke liye ek naya Worker banaana asli overhead rakhta hai; production systems aam taur par ek dobara-istemal-hone-laayak worker pool maintain karte hain (jaise \`piscina\` se) har akeli computation ke liye ek taaza thread banaane ke bajaye.',
    ],
  },
];
