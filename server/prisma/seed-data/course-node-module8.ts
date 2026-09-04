/**
 * Node.js Complete Course — Module 8: Async JavaScript & Node Primitives, lesson 1.
 *
 * Promises and async patterns: the Promise combinators (all / allSettled / race /
 * any) and when each is the right one, sequential vs parallel await and why a
 * naive await-in-a-loop serialises independent work, error propagation through
 * async functions, the unhandledRejection process event, util.promisify for
 * callback APIs, and async generators + for-await-of for streaming pagination.
 *
 * NOTE for future editors: escape every inline-code backtick inside the template
 * literal fields (content / contentHi / simple / simpleHi), including inside
 * markdown paragraphs. Single-quoted fields (explain, why, q, a, task, ...) do NOT
 * need backticks escaped — only escape an apostrophe there as a SINGLE backslash
 * (\'), never doubled. Run `npx tsc --noEmit -p .` from server/ before wiring.
 * Runnable snippets in this lesson were executed with Node 24 (np1.mjs / np2.mjs).
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_8: CourseLesson[] = [
  {
    slug: 'promises-and-async-patterns',
    title: 'Promises & Async Patterns: Combinators, Parallelism, Error Propagation',
    titleHi: 'Promises Aur Async Patterns: Combinators, Parallelism, Error Propagation',
    description: 'An endpoint that fetches a user, their orders, and their preferences takes 900ms because it `await`s each call one after another — even though none of them depends on the others and all three could run at once in 300ms.',
    descriptionHi: 'Ek endpoint jo ek user, unke orders, aur unki preferences fetch karta hai 900ms leta hai kyunki ye har call ko ek ke baad ek `await` karta hai — halaanki inmein se koi bhi doosre par nirbhar nahi hai aur teenon ek saath 300ms mein chal sakte the.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A cook preparing three dishes that share no ingredients and no steps.** The slow cook starts the rice, stands and watches it for twenty minutes until it is done, then starts the dal and watches that, then the vegetables — an hour of wall-clock time for three things that never needed each other. The fast cook starts all three on separate burners at once and only comes back when each is ready — twenty minutes total. That is `Promise.all` versus `await` in a loop: `await` means "stop here until this one finishes", so putting it inside a loop over independent tasks forces them into single file. The other combinators are about *how you wait for a group*: `Promise.all` gives up the moment any one dish burns (first rejection wins, the rest are abandoned); `Promise.allSettled` waits for every dish and hands you a report of which succeeded and which burned; `Promise.race` returns whatever finishes first, success or failure, and is how you bolt a timeout onto anything; `Promise.any` returns the first dish that comes out *right* and only fails if every single one burns.',
      hi: '**Ek cook teen dishes banaa raha hai jo koi ingredients aur koi steps share nahi karte.** Slow cook rice shuru karta hai, khada rehkar bees minute tak use dekhta hai jab tak wo ho na jaaye, phir dal shuru karta hai aur use dekhta hai, phir sabziyaan — ek ghanta wall-clock time teen cheezon ke liye jinhe kabhi ek doosre ki zaroorat nahi thi. Fast cook teenon ko alag burners par ek saath shuru karta hai aur sirf tab wapas aata hai jab har ek taiyaar ho — kul bees minute. Wo `Promise.all` versus ek loop mein `await` hai: `await` ka matlab "yahaan ruko jab tak ye ek khatam na ho", to ise independent tasks ke ek loop ke andar daalna unhe single file mein majboor karta hai. Doosre combinators ye hain ki *aap ek group ka intezaar kaise karte ho*: `Promise.all` us pal chhod deta hai jis pal koi ek dish jal jaaye (pehla rejection jeetta hai, baaki chhod diye jaate hain); `Promise.allSettled` har dish ka intezaar karta hai aur aapko ek report deta hai ki kaun safal hua aur kaun jala; `Promise.race` jo bhi pehle khatam ho wo return karta hai, safalta ya vifalta, aur yahi tarika hai kisi bhi cheez par ek timeout lagaane ka; `Promise.any` pehli dish return karta hai jo *sahi* nikle aur sirf tab fail hota hai jab har ek jal jaaye.',
    },

    simple: `**Start slow.** Independent calls, one \`await\` at a time:

\`\`\`js
async function getDashboard(userId) {
  const user = await fetchUser(userId);            // 300ms
  const orders = await fetchOrders(userId);        // 300ms  — did NOT need to wait for user
  const prefs = await fetchPreferences(userId);    // 300ms  — did NOT need either
  return { user, orders, prefs };                  // total: ~900ms
}
\`\`\`

Each \`await\` is a full stop: the next line does not run until the current promise settles. Three independent requests run back-to-back for no reason.

**The fix: start them all, then await the group**

\`\`\`js
async function getDashboard(userId) {
  const [user, orders, prefs] = await Promise.all([
    fetchUser(userId),
    fetchOrders(userId),
    fetchPreferences(userId),
  ]);                                              // total: ~300ms
  return { user, orders, prefs };
}
\`\`\`

**The four combinators**

\`\`\`
Promise.all([...])        all fulfil -> array of values.  ANY rejects -> rejects NOW with that
                         error, the rest keep running but their results are dropped.
Promise.allSettled([...]) waits for EVERY promise. -> array of {status:'fulfilled',value}
                         or {status:'rejected',reason}. Never rejects. Use for "do all, report".
Promise.race([...])      first to SETTLE wins — fulfil OR reject. Use to add a timeout.
Promise.any([...])       first to FULFIL wins; rejections ignored unless ALL reject
                         -> AggregateError. Use for "any healthy replica".
\`\`\`

**Sequential when there IS a dependency**

\`\`\`js
const user = await fetchUser(id);
const org = await fetchOrg(user.orgId);   // genuinely needs user.orgId -> await must be sequential
\`\`\`

**A parallel loop: \`map\` then \`Promise.all\`, not \`for...of\` + \`await\`**

\`\`\`js
// SERIAL (one after another):
for (const id of ids) results.push(await fetchOne(id));

// PARALLEL:
const results = await Promise.all(ids.map(id => fetchOne(id)));
\`\`\`

**Errors propagate like \`throw\`**

\`\`\`js
async function f() { throw new Error("boom"); }   // === return Promise.reject(new Error("boom"))
try { await f(); } catch (e) { /* caught here */ }

// A rejected promise nobody awaits or .catch()es:
process.on("unhandledRejection", (reason) => { log.error(reason); process.exit(1); });
\`\`\`

**\`util.promisify\` — wrap a callback API**

\`\`\`js
import { promisify } from "node:util";
const readFile = promisify(fs.readFile);          // (path, opts) -> Promise
// most core modules already ship a promise version: fs/promises, dns/promises, timers/promises
\`\`\`

**Async generators — stream pages without buffering them all**

\`\`\`js
async function* paginate(url) {
  let next = url;
  while (next) { const res = await fetch(next); const body = await res.json();
                 yield* body.items; next = body.nextPage; }
}
for await (const item of paginate("/api/things")) handle(item);   // one page in memory at a time
\`\`\``,

    simpleHi: `**Slow shuru.** Independent calls, ek baar mein ek \`await\`:

\`\`\`js
async function getDashboard(userId) {
  const user = await fetchUser(userId);            // 300ms
  const orders = await fetchOrders(userId);        // 300ms  — user ka intezaar NAHI karna tha
  const prefs = await fetchPreferences(userId);    // 300ms  — kisi ka intezaar NAHI karna tha
  return { user, orders, prefs };                  // total: ~900ms
}
\`\`\`

Har \`await\` ek full stop hai: agli line tab tak nahi chalti jab tak current promise settle na ho.

**Fix: sabko shuru karo, phir group await karo**

\`\`\`js
async function getDashboard(userId) {
  const [user, orders, prefs] = await Promise.all([
    fetchUser(userId),
    fetchOrders(userId),
    fetchPreferences(userId),
  ]);                                              // total: ~300ms
  return { user, orders, prefs };
}
\`\`\`

**Chaar combinators**

\`\`\`
Promise.all([...])        sab fulfil -> values ka array.  KOI reject -> ABHI us error ke saath
                         reject, baaki chalte rehte hain par unke results drop ho jaate hain.
Promise.allSettled([...]) HAR promise ka intezaar. -> {status:'fulfilled',value} ya
                         {status:'rejected',reason} ka array. Kabhi reject nahi.
Promise.race([...])      pehla jo SETTLE ho jeetta hai — fulfil YA reject. Timeout ke liye.
Promise.any([...])       pehla jo FULFIL ho jeetta hai; rejections ignore jab tak SAB reject na ho
                         -> AggregateError.
\`\`\`

**Sequential jab ek dependency HAI**

\`\`\`js
const user = await fetchUser(id);
const org = await fetchOrg(user.orgId);   // asal mein user.orgId chahiye -> await sequential hona chahiye
\`\`\`

**Ek parallel loop: \`map\` phir \`Promise.all\`, \`for...of\` + \`await\` nahi**

\`\`\`js
// SERIAL: for (const id of ids) results.push(await fetchOne(id));
// PARALLEL:
const results = await Promise.all(ids.map(id => fetchOne(id)));
\`\`\`

**Errors \`throw\` ki tarah propagate hote hain**

\`\`\`js
async function f() { throw new Error("boom"); }   // === return Promise.reject(...)
try { await f(); } catch (e) { /* yahaan caught */ }

process.on("unhandledRejection", (reason) => { log.error(reason); process.exit(1); });
\`\`\`

**\`util.promisify\` — ek callback API wrap karo**

\`\`\`js
import { promisify } from "node:util";
const readFile = promisify(fs.readFile);
// zyaadatar core modules pehle se ek promise version dete hain: fs/promises, dns/promises, timers/promises
\`\`\`

**Async generators — pages stream karo bina sabko buffer kiye**

\`\`\`js
async function* paginate(url) {
  let next = url;
  while (next) { const res = await fetch(next); const body = await res.json();
                 yield* body.items; next = body.nextPage; }
}
for await (const item of paginate("/api/things")) handle(item);
\`\`\``,

    content: `## \`await\` is a full stop

An \`async\` function runs top to bottom, and every \`await\` pauses it until that one promise settles. That is exactly what you want when the next line *needs* the previous result. It is exactly what you do **not** want when the calls are independent — three \`await\`s for three unrelated requests run them one after another, and the endpoint takes the sum of their latencies instead of the max.

The mental model: **calling** an async function (or any promise-returning function) *starts* the work immediately. \`await\` is just where you collect the result. So to run things in parallel, start them all first, then await:

\`\`\`js
const userP = fetchUser(id);       // started
const ordersP = fetchOrders(id);   // started (does not wait for userP)
const user = await userP;          // now collect
const orders = await ordersP;      // already in flight, resolves fast
\`\`\`

\`Promise.all([...])\` is the tidy form of that.

## The four combinators, precisely

**\`Promise.all(iterable)\`** — resolves to an array of every value, in input order, once **all** inputs fulfil. If **any** input rejects, \`all\` rejects immediately with that first error. The others are not cancelled — promises have no cancellation — they keep running, and their eventual results (or rejections) are discarded, which can produce a stray \`unhandledRejection\` if one of the abandoned ones rejects later. Use when you need every result and any failure means the whole operation failed.

**\`Promise.allSettled(iterable)\`** — waits for **every** input to settle, then resolves (never rejects) to an array of \`{ status: "fulfilled", value }\` / \`{ status: "rejected", reason }\`. Use for "attempt all of these and tell me what happened" — sending N notifications, warming M caches, importing a batch where partial success is acceptable.

**\`Promise.race(iterable)\`** — settles as soon as the **first** input settles, adopting its value or its rejection. The canonical use is a timeout:

\`\`\`js
const withTimeout = (p, ms) => Promise.race([
  p,
  new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
]);
\`\`\`

(Modern Node also has \`AbortSignal.timeout(ms)\` — Lesson 2 — which is better because it can actually abort the underlying work.)

**\`Promise.any(iterable)\`** — resolves to the **first fulfilment**, ignoring rejections; only if **all** inputs reject does it reject, with an \`AggregateError\` whose \`.errors\` is the list. Use for redundancy: query three mirrors, take the first that answers.

## The parallel-loop trap

\`\`\`js
for (const id of ids) {
  const row = await db.fetch(id);   // <-- serialises: each waits for the previous
  rows.push(row);
}
\`\`\`

This is the single most common async performance bug. If the iterations are independent, do:

\`\`\`js
const rows = await Promise.all(ids.map(id => db.fetch(id)));
\`\`\`

But **unbounded \`Promise.all\` over a large array** is its own problem — 10,000 simultaneous DB queries will exhaust the connection pool or the remote's rate limit. Cap the concurrency (Lesson 2: a semaphore / \`p-limit\`), or process in chunks. The rule: parallel, but *bounded*.

## Error propagation

Inside an \`async\` function, \`throw\` and a rejected awaited promise are the same thing: they reject the function's returned promise. \`try/catch\` around \`await\` catches both. A few sharp edges:

- **A promise you create but never \`await\` or \`.catch()\`** — a "floating promise" — swallows its own rejection. If it rejects, you get an \`unhandledRejection\` event and, by default in modern Node, the **process crashes**. Always \`await\` a promise, chain \`.catch()\`, or deliberately hand it to a background handler.
- **\`await\` in a \`.forEach()\` callback does nothing useful** — \`forEach\` ignores the returned promise, so the callbacks all fire without waiting and the outer function continues immediately. Use \`for...of\` (serial) or \`map\` + \`Promise.all\` (parallel).
- **\`return await\` vs \`return\`** inside \`try\` — \`return somePromise\` without \`await\` resolves the promise *outside* the \`try\`, so a rejection escapes the local \`catch\`. Inside a \`try/catch\` you want \`return await\`.
- **Always install \`process.on("unhandledRejection")\`** (and \`uncaughtException\`) — log the error with context and exit; let the process manager restart. A silently swallowed rejection is a bug that never shows up in logs.

## \`util.promisify\` and promise-native APIs

Older Node APIs and many npm packages use the error-first callback style: \`fn(args, (err, result) => ...)\`. \`promisify\` wraps one into a promise-returning function:

\`\`\`js
import { promisify } from "node:util";
const lookup = promisify(dns.lookup);
const { address } = await lookup("example.com");
\`\`\`

Before reaching for \`promisify\`, check whether the module already ships a promise version — \`node:fs/promises\`, \`node:dns/promises\`, \`node:timers/promises\` (\`await setTimeout(1000)\`), \`node:stream/promises\` (\`await pipeline(...)\`). For a function that calls its callback multiple times (an event-style API), \`promisify\` is the wrong tool — that is an \`EventEmitter\` or an async iterator (Lesson 3).

## Async generators for streaming

An \`async function*\` yields values over time, and \`for await...of\` consumes them one at a time. This is the clean way to iterate a paginated API, a database cursor, or a message stream **without holding the whole dataset in memory**:

\`\`\`js
async function* rows(query) {
  let cursor = null;
  do {
    const page = await db.query(query, { after: cursor, limit: 500 });
    yield* page.rows;
    cursor = page.nextCursor;
  } while (cursor);
}

for await (const row of rows("SELECT ...")) {
  await process(row);   // backpressure: the next page is not fetched until this loop is ready
}
\`\`\`

The consumer controls the pace — the generator does not fetch page N+1 until the loop asks for a value the current page cannot supply.`,

    contentHi: `## \`await\` ek full stop hai

Ek \`async\` function upar se neeche chalta hai, aur har \`await\` use rok deta hai jab tak wo ek promise settle na ho. Ye theek wahi hai jo aap chaahte ho jab agli line ko pichhle result ki *zaroorat* hai. Ye theek wahi hai jo aap **nahi** chaahte jab calls independent hain.

Mental model: ek async function ko **call karna** kaam turant *shuru* kar deta hai. \`await\` sirf wahaan hai jahaan aap result collect karte ho. To parallel mein chalaane ke liye, sabko pehle shuru karo, phir await karo. \`Promise.all([...])\` iska tidy form hai.

## Chaar combinators, sateek

**\`Promise.all(iterable)\`** — har value ka array, input order mein, jab **sab** fulfil ho jaayein. Agar **koi** reject karta hai, \`all\` turant us pehle error ke saath reject karta hai. Baaki cancel nahi hote — promises mein cancellation nahi hai — wo chalte rehte hain aur unke results discard ho jaate hain (kabhi-kabhi ek stray \`unhandledRejection\`).

**\`Promise.allSettled(iterable)\`** — **har** input ke settle hone ka intezaar, phir (kabhi reject nahi) \`{ status: "fulfilled", value }\` / \`{ status: "rejected", reason }\` ka array. "in sabko try karo aur batao kya hua" ke liye.

**\`Promise.race(iterable)\`** — jaise hi **pehla** input settle ho, uski value ya rejection le leta hai. Canonical use ek timeout hai. (Modern Node mein \`AbortSignal.timeout(ms)\` bhi hai — Lesson 2 — jo behtar hai kyunki ye asal mein underlying work abort kar sakta hai.)

**\`Promise.any(iterable)\`** — **pehli fulfilment** par resolve, rejections ignore; sirf agar **sab** reject karein to ye reject karta hai, ek \`AggregateError\` ke saath. Redundancy ke liye.

## Parallel-loop trap

\`\`\`js
for (const id of ids) { const row = await db.fetch(id); rows.push(row); }  // serialises
\`\`\`

Ye sabse aam async performance bug hai. Agar iterations independent hain:

\`\`\`js
const rows = await Promise.all(ids.map(id => db.fetch(id)));
\`\`\`

Par ek bade array par **unbounded \`Promise.all\`** apni khud ki samasya hai — 10,000 ek saath DB queries connection pool ko khatam kar dengi. Concurrency cap karo (Lesson 2: ek semaphore / \`p-limit\`). Niyam: parallel, par *bounded*.

## Error propagation

Ek \`async\` function ke andar, \`throw\` aur ek rejected awaited promise ek hi cheez hai. \`try/catch\` dono catch karta hai. Kuch sharp edges:

- **Ek promise jo aap banaate ho par kabhi \`await\` ya \`.catch()\` nahi karte** — ek "floating promise" — apni rejection nigal leta hai. Agar ye reject karta hai, aapko ek \`unhandledRejection\` event milta hai aur, modern Node mein default se, **process crash ho jaata hai**.
- **\`.forEach()\` callback mein \`await\` kuch useful nahi karta** — \`forEach\` returned promise ko ignore karta hai. \`for...of\` (serial) ya \`map\` + \`Promise.all\` (parallel) istemal karo.
- **\`return await\` vs \`return\`** ek \`try\` ke andar — \`return somePromise\` bina \`await\` promise ko \`try\` ke *baahar* resolve karta hai, to ek rejection local \`catch\` se bach jaati hai. Ek \`try/catch\` ke andar aap \`return await\` chaahte ho.
- **Hamesha \`process.on("unhandledRejection")\`** (aur \`uncaughtException\`) install karo — error ko context ke saath log karo aur exit karo.

## \`util.promisify\` aur promise-native APIs

Purane Node APIs error-first callback style istemal karte hain. \`promisify\` ek ko ek promise-returning function mein wrap karta hai. \`promisify\` tak pahunchne se pehle, check karo ki module pehle se ek promise version deta hai ya nahi — \`node:fs/promises\`, \`node:dns/promises\`, \`node:timers/promises\`. Ek function jo apna callback kई baar call karta hai (event-style API) ke liye, \`promisify\` galat tool hai — wo ek \`EventEmitter\` ya ek async iterator hai (Lesson 3).

## Streaming ke liye async generators

Ek \`async function*\` samay ke saath values yield karta hai, aur \`for await...of\` unhe ek-ek karke consume karta hai. Ye ek paginated API, ek database cursor, ya ek message stream ko **poore dataset ko memory mein rakhe bina** iterate karne ka saaf tarika hai. Consumer pace control karta hai — generator page N+1 tab tak fetch nahi karta jab tak loop nahi maangta.`,

    examples: [
      {
        title: 'all rejects on first failure; allSettled reports every outcome',
        titleHi: 'all pehli vifalta par reject; allSettled har parinaam report karta hai',
        code: `const p = (ms, v, fail) => new Promise((res, rej) =>
  setTimeout(() => fail ? rej(new Error(v)) : res(v), ms));

try {
  await Promise.all([p(10, "a"), p(5, "boom", true), p(20, "c")]);
} catch (e) {
  console.log("all caught:", e.message);
}

const settled = await Promise.allSettled([p(10, "a"), p(5, "boom", true)]);
console.log(settled.map(x =>
  x.status === "fulfilled" ? "ok:" + x.value : "fail:" + x.reason.message));`,
        codeJs: `const p = (ms, v, fail) => new Promise((res, rej) =>
  setTimeout(() => fail ? rej(new Error(v)) : res(v), ms));

// Promise.all — the first rejection wins, immediately
try {
  const values = await Promise.all([p(10, "a"), p(5, "boom", true), p(20, "c")]);
  console.log(values);                       // never reached
} catch (e) {
  console.log("all caught:", e.message);     // "all caught: boom"
}
// note: p(10,"a") and p(20,"c") still resolve in the background; their values are dropped

// Promise.allSettled — waits for all, never rejects
const settled = await Promise.allSettled([p(10, "a"), p(5, "boom", true)]);
console.log(settled.map(x =>
  x.status === "fulfilled" ? "ok:" + x.value : "fail:" + x.reason.message));
// [ 'ok:a', 'fail:boom' ]`,
        codeTs: `const p = (ms: number, v: string, fail = false): Promise<string> =>
  new Promise((res, rej) => setTimeout(() => (fail ? rej(new Error(v)) : res(v)), ms));

try {
  const values: string[] = await Promise.all([p(10, "a"), p(5, "boom", true), p(20, "c")]);
  console.log(values);
} catch (e) {
  console.log("all caught:", (e as Error).message);
}

const settled = await Promise.allSettled([p(10, "a"), p(5, "boom", true)]);
for (const r of settled) {
  if (r.status === "fulfilled") console.log("ok:", r.value);
  else console.log("fail:", (r.reason as Error).message);
}`,
        output: `all caught: boom
[ 'ok:a', 'fail:boom' ]

Promise.all threw as soon as the 5ms promise rejected, before the 10ms
and 20ms promises finished. allSettled waited for both and returned a
status for each instead of throwing.`,
        explain: 'Promise.all is "all or nothing" — one rejection rejects the whole thing immediately and the surviving promises\' results are discarded. Promise.allSettled is "do everything, report back" — it never rejects and gives you a per-promise status array, which is what you want for batch operations where partial success is fine.',
        explainHi: 'Promise.all "sab ya kuch nahi" hai — ek rejection poori cheez ko turant reject kar deti hai. Promise.allSettled "sab kuch karo, report karo" hai — ye kabhi reject nahi hota aur ek per-promise status array deta hai, jo batch operations ke liye chahiye jahaan partial success theek hai.',
      },
      {
        title: 'The await-in-a-loop trap: serial vs parallel',
        titleHi: 'await-in-a-loop trap: serial vs parallel',
        code: `const fetchOne = (id) => new Promise(r => setTimeout(() => r(id * 2), 30));
const ids = [1, 2, 3, 4];

let t = Date.now();
const serial = [];
for (const id of ids) serial.push(await fetchOne(id));   // ~120ms
console.log("serial:", serial, Date.now() - t, "ms");

t = Date.now();
const parallel = await Promise.all(ids.map(fetchOne));   // ~30ms
console.log("parallel:", parallel, Date.now() - t, "ms");`,
        codeJs: `const fetchOne = (id) => new Promise(r => setTimeout(() => r(id * 2), 30));
const ids = [1, 2, 3, 4];

// SERIAL — each await blocks the loop until that fetch finishes
let t = Date.now();
const serial = [];
for (const id of ids) {
  serial.push(await fetchOne(id));
}
console.log("serial:", serial, Date.now() - t, "ms");     // ~120ms (4 x 30)

// PARALLEL — all four start immediately, we await the group
t = Date.now();
const parallel = await Promise.all(ids.map((id) => fetchOne(id)));
console.log("parallel:", parallel, Date.now() - t, "ms");  // ~30ms

// caution: ids.map over 10_000 items = 10_000 concurrent calls.
// bound it with a concurrency limiter (Lesson 2) for large inputs.`,
        codeTs: `const fetchOne = (id: number): Promise<number> =>
  new Promise((r) => setTimeout(() => r(id * 2), 30));
const ids = [1, 2, 3, 4];

let t = Date.now();
const serial: number[] = [];
for (const id of ids) {
  serial.push(await fetchOne(id));
}
console.log("serial:", serial, Date.now() - t, "ms");

t = Date.now();
const parallel: number[] = await Promise.all(ids.map((id) => fetchOne(id)));
console.log("parallel:", parallel, Date.now() - t, "ms");`,
        output: `serial:   [ 2, 4, 6, 8 ]  ~120 ms   (4 x 30ms, one after another)
parallel: [ 2, 4, 6, 8 ]  ~30 ms    (all four at once, waited once)

Same ordered result, ~4x faster. The for...of loop ran the fetches one
at a time; Promise.all started all four and awaited the group.`,
        explain: 'await inside a loop over independent work serialises it — each iteration waits for the previous promise. Mapping the array to promises and awaiting Promise.all starts everything at once. Both produce the same ordered result array. For very large arrays, replace the unbounded map with a concurrency limiter so you do not open thousands of connections at once.',
        explainHi: 'Independent work ke ek loop ke andar await ise serialise karta hai — har iteration pichhle promise ka intezaar karta hai. Array ko promises mein map karke Promise.all await karna sab kuch ek saath shuru karta hai. Bahut bade arrays ke liye, unbounded map ko ek concurrency limiter se replace karo.',
      },
      {
        title: 'A floating promise rejection crashes the process; catch it or handle it',
        titleHi: 'Ek floating promise rejection process ko crash karta hai; ise catch ya handle karo',
        code: `process.on("unhandledRejection", (reason) => {
  console.log("unhandledRejection:", reason.message);
  process.exit(1);
});

async function risky() { throw new Error("nobody catches me"); }

risky();   // called, not awaited, no .catch() -> floating rejection`,
        codeJs: `process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
  process.exit(1);   // let the process manager restart a clean instance
});

async function risky() {
  throw new Error("nobody catches me");
}

// BROKEN: called but not awaited and no .catch() — the rejection floats
risky();
// -> "unhandledRejection: Error: nobody catches me" then exit(1)

// FIX 1: await it inside a try/catch
try { await risky(); } catch (e) { console.log("handled:", e.message); }

// FIX 2: attach a .catch() if it is genuinely fire-and-forget
risky().catch((e) => log.error({ err: e }, "background task failed"));`,
        codeTs: `process.on("unhandledRejection", (reason: unknown) => {
  console.error("unhandledRejection:", reason);
  process.exit(1);
});

async function risky(): Promise<never> {
  throw new Error("nobody catches me");
}

// void marks a deliberate fire-and-forget, but you still need the .catch()
void risky().catch((e: unknown) => console.error("background failed:", e));`,
        output: `unhandledRejection: nobody catches me

The rejected promise from risky() was never awaited and had no .catch(),
so it surfaced as an unhandledRejection. Modern Node terminates the
process on an unhandled rejection by default.`,
        explain: 'An async function that throws returns a rejected promise. If you call it without await and without .catch(), nothing observes the rejection — it becomes an unhandledRejection event, and Node crashes the process by default. The fixes: await it in a try/catch, chain a .catch() for genuine fire-and-forget work, and always install an unhandledRejection handler that logs and exits so nothing fails silently.',
        explainHi: 'Ek async function jo throw karta hai ek rejected promise return karta hai. Agar aap ise bina await aur bina .catch() ke call karte ho, koi rejection observe nahi karta — ye ek unhandledRejection event ban jaata hai, aur Node default se process crash kar deta hai. Fixes: ise ek try/catch mein await karo, genuine fire-and-forget ke liye ek .catch() chain karo, aur hamesha ek unhandledRejection handler install karo.',
      },
    ],

    mistakes: [
      {
        wrong: `async function getPage(userId) {
  const user = await db.users.find(userId);
  const posts = await db.posts.findByUser(userId);   // independent of user
  const followers = await db.follows.countFor(userId); // independent too
  return { user, posts, followers };
}
// three round-trips in series — ~3x the latency it needs`,
        right: `async function getPage(userId) {
  const [user, posts, followers] = await Promise.all([
    db.users.find(userId),
    db.posts.findByUser(userId),
    db.follows.countFor(userId),
  ]);
  return { user, posts, followers };
}
// one round-trip's worth of latency`,
        why: 'await pauses the function until that promise settles, so three sequential awaits over three independent queries make the endpoint as slow as the sum of the three, not the slowest one. Because calling the query function already starts the work, you can start all three and then await them together with Promise.all. Only keep awaits sequential when a later call genuinely needs a value from an earlier one. This one change often cuts a slow endpoint\'s latency by half or more.',
        whyHi: 'await function ko rok deta hai jab tak wo promise settle na ho, to teen independent queries par teen sequential awaits endpoint ko teenon ke sum jitna slow banaate hain, sabse slow jitna nahi. Kyunki query function ko call karna pehle se kaam shuru kar deta hai, aap teenon ko shuru karke Promise.all se ek saath await kar sakte ho. Awaits sirf tab sequential rakho jab ek baad ki call ko asal mein ek pehle ki value chahiye.',
      },
      {
        wrong: `// "run all uploads in parallel"
await Promise.all(files.map(f => uploadToS3(f)));
// files.length === 5000 -> 5000 simultaneous connections -> ECONNRESET / throttled / OOM`,
        right: `import pLimit from "p-limit";
const limit = pLimit(10);   // at most 10 uploads in flight
await Promise.all(files.map(f => limit(() => uploadToS3(f))));
// or process in chunks of 10 with a for...of loop over the chunks`,
        why: 'Promise.all over map does start every promise at once, which is the point — but "every" can be thousands. Thousands of simultaneous sockets exhaust file descriptors, blow past the remote service\'s rate limit, or run the process out of memory buffering all the in-flight data. The fix is bounded parallelism: a concurrency limiter (p-limit, or a small semaphore — Lesson 2) that keeps at most N operations running and queues the rest. You get most of the speedup of full parallelism without the resource blowup.',
        whyHi: 'map par Promise.all har promise ko ek saath shuru karta hai — par "har" hazaron ho sakta hai. Hazaron ek saath sockets file descriptors khatam kar dete hain, remote service ki rate limit paar kar jaate hain, ya process ko memory se baahar chala dete hain. Fix bounded parallelism hai: ek concurrency limiter (p-limit, ya ek chhota semaphore — Lesson 2) jo zyaada se zyaada N operations chalte rakhta hai aur baaki ko queue karta hai.',
      },
      {
        wrong: `items.forEach(async (item) => {
  await save(item);        // forEach ignores the returned promise
});
console.log("all saved");  // prints BEFORE any save() finishes`,
        right: `// serial:
for (const item of items) await save(item);
console.log("all saved");

// parallel (bounded for large lists):
await Promise.all(items.map(item => save(item)));
console.log("all saved");`,
        why: 'Array.prototype.forEach does not await or collect the promise its callback returns — it calls every callback synchronously and moves on. So an async forEach callback fires all the saves without waiting, the code after the forEach runs immediately while the saves are still in flight, and any rejection inside a callback becomes an unhandledRejection. forEach is for synchronous side effects only. For sequential async work use for...of with await; for parallel use map plus Promise.all.',
        whyHi: 'Array.prototype.forEach apne callback ke return kiye promise ko na await karta hai na collect — ye har callback ko synchronously call karke aage badh jaata hai. To ek async forEach callback saare saves bina intezaar ke fire karta hai, forEach ke baad ka code turant chalta hai, aur ek callback ke andar koi rejection ek unhandledRejection ban jaati hai. Sequential async ke liye for...of + await; parallel ke liye map + Promise.all.',
      },
    ],

    realWorld: [
      {
        en: '**A dashboard controller that `Promise.all`s the four independent widget queries** and wraps the whole thing in `Promise.race` against a 2-second budget, so a slow analytics table degrades one widget instead of hanging the page.',
        hi: '**Ek dashboard controller jo chaar independent widget queries ko `Promise.all` karta hai** aur poori cheez ko ek 2-second budget ke against `Promise.race` mein wrap karta hai.',
      },
      {
        en: '**A batch notification job using `Promise.allSettled`** over the recipient list — successes are marked sent, rejections are collected into a retry queue, and one bad email address never fails the batch.',
        hi: '**Ek batch notification job jo recipient list par `Promise.allSettled` istemal karta hai** — successes sent mark hote hain, rejections ek retry queue mein.',
      },
      {
        en: '**An export endpoint that streams a database cursor through an `async function*`** straight into the HTTP response, so a 2-million-row CSV never materialises in memory and the client starts receiving bytes within milliseconds.',
        hi: '**Ek export endpoint jo ek database cursor ko ek `async function*` ke through seedhe HTTP response mein stream karta hai** — ek 2-million-row CSV kabhi memory mein materialise nahi hoti.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `Promise.all`, `allSettled`, `race`, and `any`?',
        qHi: '`Promise.all`, `allSettled`, `race`, aur `any` mein kya antar hai?',
        a: 'All four take an iterable of promises and combine them, but they differ in what "done" means. Promise.all fulfils with an array of all the values once every input fulfils, and rejects the instant any single input rejects, adopting that first error; the other promises are not cancelled but their results are discarded. Use it when you need all the results and any failure invalidates the whole operation. Promise.allSettled waits for every input to settle and then fulfils — it never rejects — with an array of objects that each say fulfilled with a value or rejected with a reason. Use it for batch work where partial success is acceptable and you want a report. Promise.race settles as soon as the first input settles, taking its value or its rejection whichever comes first; the classic use is racing a promise against a timeout. Promise.any is race\'s optimistic cousin: it fulfils with the first input that fulfils and ignores rejections, only rejecting if every input rejects, in which case it gives an AggregateError containing all of them; use it for redundancy, like querying several mirrors and taking the first good answer.',
        aHi: 'Chaaron ek iterable of promises lete hain aur combine karte hain, par "done" ka matlab alag hai. Promise.all sab values ke array ke saath fulfil hota hai jab har input fulfil ho, aur jis pal koi ek input reject kare us pal reject karta hai; doosre promises cancel nahi hote par unke results discard ho jaate hain. Promise.allSettled har input ke settle hone ka intezaar karta hai phir fulfil hota hai — kabhi reject nahi — objects ke ek array ke saath jo har ek kehta hai fulfilled with value ya rejected with reason. Promise.race jaise hi pehla input settle ho settle ho jaata hai. Promise.any race ka optimistic cousin hai: ye pehle input ke saath fulfil hota hai jo fulfil ho aur rejections ignore karta hai, sirf tab reject karta hai jab har input reject kare.',
      },
      {
        q: 'Why does `await` inside a `for` loop often signal a performance bug, and how do you fix it safely?',
        qHi: '`for` loop ke andar `await` aksar ek performance bug kyun signal karta hai, aur aap ise surakshit tarike se kaise theek karte ho?',
        a: 'await pauses the async function until the awaited promise settles, so an await inside a loop makes each iteration wait for the previous one to finish before starting. If the iterations are independent — fetching N records by id, uploading N files — that serialisation multiplies the latency by N for no reason. The fix is to start all the operations and then await them together: map the array to an array of promises and pass it to Promise.all. But there is a second trap: an unbounded Promise.all over a large array starts every operation at once, and thousands of simultaneous connections will exhaust the connection pool, trip the remote\'s rate limiter, or run the process out of memory. So the safe version is bounded parallelism — a concurrency limiter like p-limit, or a small semaphore, that keeps at most N operations in flight and queues the rest. You get the speedup of parallelism without the resource blowup. The only time a sequential await loop is correct is when each iteration genuinely depends on the previous one, or when you specifically need to apply backpressure.',
        aHi: 'await async function ko rok deta hai jab tak awaited promise settle na ho, to ek loop ke andar await har iteration ko pichhle ke khatam hone ka intezaar karvaata hai shuru karne se pehle. Agar iterations independent hain, ye serialisation latency ko N se multiply karta hai bina wajah. Fix saari operations shuru karke unhe ek saath await karna hai: array ko promises ke array mein map karo aur Promise.all ko do. Par ek doosra trap hai: ek bade array par unbounded Promise.all har operation ek saath shuru karta hai, aur hazaron connections connection pool khatam kar denge. To surakshit version bounded parallelism hai — ek concurrency limiter jaise p-limit. Ek sequential await loop sirf tab sahi hai jab har iteration asal mein pichhle par nirbhar ho.',
      },
    ],

    exercises: [
      {
        task: 'Write `fetchAll(ids, fetchOne)` that runs `fetchOne(id)` for every id concurrently and returns the results in the SAME order as `ids`, but never has more than 3 calls in flight at once. Test it with a `fetchOne` that resolves after a random 10-50ms delay and records the peak concurrency; assert the peak is `<= 3` and the output order matches the input.',
        taskHi: '`fetchAll(ids, fetchOne)` likho jo har id ke liye `fetchOne(id)` concurrently chalata hai aur results ko `ids` ke SAME order mein return karta hai, par kabhi ek saath 3 se zyaada calls in flight nahi. Test karo aur assert peak `<= 3` hai.',
        hint: 'Keep an index into `ids`, a counter of active calls, and a results array. Start up to 3, and each time one finishes, start the next by index (so results land at `results[i]`). A small `p-limit`-style closure works.',
        hintHi: '`ids` mein ek index rakho, active calls ka ek counter, aur ek results array. Zyaada se zyaada 3 shuru karo, aur har baar ek khatam ho, index se agla shuru karo.',
      },
      {
        task: 'Write `withTimeout(promise, ms)` using `Promise.race` that resolves/rejects with `promise` if it settles within `ms`, otherwise rejects with `new Error("timeout")`. Then note in a comment one thing this version does NOT do that `AbortController` would (hint: the underlying work).',
        taskHi: '`withTimeout(promise, ms)` likho `Promise.race` istemal karke. Phir ek comment mein ek cheez batao jo ye version NAHI karta jo `AbortController` karta.',
        hint: 'Race the input against `new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))`. The comment: `Promise.race` only stops *waiting* — the slow operation keeps running and consuming resources; `AbortController` can actually cancel it.',
        hintHi: 'Input ko `new Promise((_, rej) => setTimeout(...))` ke against race karo. Comment: `Promise.race` sirf *intezaar* rokta hai — slow operation chalta rehta hai; `AbortController` ise asal mein cancel kar sakta hai.',
      },
      {
        task: 'Write an async generator `chunks(asyncIterable, size)` that yields arrays of up to `size` items pulled from the source. Drive it with a source generator that yields the numbers 1..10 one at a time (with a tiny await between), and `for await` over `chunks(source, 3)`, asserting you get `[1,2,3] [4,5,6] [7,8,9] [10]`.',
        taskHi: 'Ek async generator `chunks(asyncIterable, size)` likho jo source se `size` tak items ke arrays yield karta hai. 1..10 yield karne waale ek source se drive karo aur assert `[1,2,3] [4,5,6] [7,8,9] [10]`.',
        hint: '`async function* chunks(src, size) { let buf = []; for await (const x of src) { buf.push(x); if (buf.length === size) { yield buf; buf = []; } } if (buf.length) yield buf; }`',
        hintHi: '`async function* chunks(src, size) { let buf = []; for await (const x of src) { buf.push(x); if (buf.length === size) { yield buf; buf = []; } } if (buf.length) yield buf; }`',
      },
    ],

    keyTakeaways: [
      'Calling a promise-returning function STARTS the work; `await` is only where you collect the result. To parallelise independent calls, start them all first, then `await Promise.all([...])` — do NOT `await` each in sequence (that adds their latencies).',
      '`Promise.all` — all values, in order; rejects IMMEDIATELY on the first rejection (others keep running, results discarded — possible stray `unhandledRejection`). `Promise.allSettled` — waits for ALL, never rejects, returns `{status,value}`/`{status,reason}` per input (batch work, partial success OK).',
      '`Promise.race` — first to SETTLE (fulfil OR reject) wins; the classic timeout wrapper. `Promise.any` — first to FULFIL wins, rejections ignored unless ALL reject -> `AggregateError` (redundant mirrors).',
      'THE #1 async perf bug: `for (const x of xs) { await f(x) }` serialises independent work. Fix: `await Promise.all(xs.map(f))`. But UNBOUNDED `Promise.all` over a huge array opens thousands of connections — cap it with a concurrency limiter (`p-limit` / a semaphore, Lesson 2). Parallel, but BOUNDED.',
      'Inside an `async` fn, `throw` === a rejected awaited promise; `try/catch` catches both. A FLOATING promise (created, never `await`ed / `.catch()`ed) swallows its rejection -> `unhandledRejection` event -> modern Node CRASHES the process. Always `await`, `.catch()`, or hand off deliberately.',
      '`.forEach(async ...)` does NOT wait — `forEach` ignores the returned promise, all callbacks fire at once, code after runs immediately, rejections float. Use `for...of` + `await` (serial) or `map` + `Promise.all` (parallel). Inside `try`, prefer `return await` so a rejection hits the local `catch`.',
      'ALWAYS install `process.on("unhandledRejection", ...)` and `uncaughtException` — log with context, exit, let the process manager restart. A silently swallowed rejection never shows in logs.',
      '`util.promisify(fn)` wraps an error-first callback API — but check for a native promise version first: `node:fs/promises`, `node:dns/promises`, `node:timers/promises`, `node:stream/promises`. A callback fired MULTIPLE times is an `EventEmitter` / async iterator, not a promise.',
      'An `async function*` + `for await...of` streams values over time (paginated APIs, DB cursors, message streams) WITHOUT buffering the whole dataset — the consumer sets the pace (backpressure): page N+1 is not fetched until the loop asks for it.',
    ],
    keyTakeawaysHi: [
      'Ek promise-returning function ko call karna kaam SHURU karta hai; `await` sirf wahaan hai jahaan aap result collect karte ho. Independent calls parallelise karne ke liye, sabko pehle shuru karo, phir `await Promise.all([...])` — har ek ko sequence mein `await` NAHI karo.',
      '`Promise.all` — sab values, order mein; pehli rejection par TURANT reject. `Promise.allSettled` — SAB ka intezaar, kabhi reject nahi, `{status,value}`/`{status,reason}` per input.',
      '`Promise.race` — pehla jo SETTLE ho jeetta hai; classic timeout wrapper. `Promise.any` — pehla jo FULFIL ho jeetta hai, rejections ignore jab tak SAB reject na ho -> `AggregateError`.',
      '#1 async perf bug: `for (const x of xs) { await f(x) }` independent work serialise karta hai. Fix: `await Promise.all(xs.map(f))`. Par ek bade array par UNBOUNDED `Promise.all` hazaron connections kholta hai — ek concurrency limiter se cap karo. Parallel, par BOUNDED.',
      'Ek `async` fn ke andar, `throw` === ek rejected awaited promise. Ek FLOATING promise (banaaya, kabhi `await`/`.catch()` nahi) apni rejection nigal leta hai -> `unhandledRejection` event -> modern Node process CRASH karta hai.',
      '`.forEach(async ...)` intezaar NAHI karta — `forEach` returned promise ignore karta hai. `for...of` + `await` (serial) ya `map` + `Promise.all` (parallel) istemal karo. `try` ke andar `return await` prefer karo.',
      'HAMESHA `process.on("unhandledRejection", ...)` aur `uncaughtException` install karo — context ke saath log karo, exit karo.',
      '`util.promisify(fn)` ek error-first callback API wrap karta hai — par pehle ek native promise version check karo: `node:fs/promises`, `node:timers/promises`. Ek callback jo KAI baar fire hota hai ek `EventEmitter` / async iterator hai.',
      'Ek `async function*` + `for await...of` samay ke saath values stream karta hai (paginated APIs, DB cursors) BINA poore dataset ko buffer kiye — consumer pace set karta hai (backpressure).',
    ],
  },
];
