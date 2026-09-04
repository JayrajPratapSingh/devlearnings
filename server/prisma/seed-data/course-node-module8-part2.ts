/**
 * Node.js Complete Course — Module 8: Async JavaScript & Node Primitives, lesson 2.
 *
 * Cancellation and concurrency control: AbortController / AbortSignal as the
 * standard cancellation token (fetch, timers/promises, many libraries),
 * AbortSignal.timeout and AbortSignal.any, wiring a request's abort signal
 * through to downstream calls, and bounding parallelism with a semaphore /
 * p-limit / batching so "run them all at once" does not exhaust the pool.
 *
 * Runnable snippets executed with Node 24 (np2.mjs).
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_8_PART2: CourseLesson[] = [
  {
    slug: 'cancellation-and-concurrency-control',
    title: 'Cancellation & Concurrency Control: `AbortController`, Timeouts, Semaphores',
    titleHi: 'Cancellation Aur Concurrency Control: `AbortController`, Timeouts, Semaphores',
    description: 'A user closes the browser tab, but the server keeps running the expensive report query, holding a database connection and CPU for 40 more seconds to build a response nobody will ever read.',
    descriptionHi: 'Ek user browser tab band karta hai, par server mehnga report query chalata rehta hai, ek database connection aur CPU ko 40 aur second tak rokte hue ek aisa response banane ke liye jo koi kabhi nahi padhega.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**A kitchen ticket rail with a bell the waiter can ring to cancel an order, and a rule that no more than four pans are on the stove at once.** Without the cancel bell, once an order is fired the line cooks it to completion even if the customer walked out ten minutes ago — wasted ingredients, a wasted burner, a plate scraped into the bin. The bell is an `AbortController`: the waiter holds the handle (`controller`), every cook watches the same bell (`controller.signal`), and one ring stops everyone still working on that ticket. The signal can also ring itself after a set time (`AbortSignal.timeout`) — "if this steak is not done in eight minutes, kill it and tell the customer". The four-pan rule is concurrency control: the kitchen could physically light every burner and start forty dishes, but the line would thrash, everything would come out cold, and the exhaust fan would trip. So a token system caps how many are cooking at once and the rest wait on the rail — that is a semaphore, or `p-limit`. Both ideas exist because *starting* work is cheap and *finishing* work you no longer need, or drowning in work you started all at once, is what actually costs you.',
      hi: '**Ek kitchen ticket rail jismein ek bell hai jo waiter ek order cancel karne ke liye baja sakta hai, aur ek niyam ki ek saath chaar se zyaada pans stove par nahi.** Cancel bell ke bina, ek baar order fire ho jaaye to line ise poora pakaati hai bhale customer das minute pehle chala gaya ho — barbaad ingredients, ek barbaad burner. Bell ek `AbortController` hai: waiter handle rakhta hai (`controller`), har cook wahi bell dekhta hai (`controller.signal`), aur ek ring us ticket par kaam kar rahe sabko rok deti hai. Signal ek set time ke baad khud bhi baj sakta hai (`AbortSignal.timeout`) — "agar ye steak aath minute mein nahi ho to ise maar do". Chaar-pan niyam concurrency control hai: kitchen physically har burner jala sakti hai aur chaalis dishes shuru kar sakti hai, par line thrash karegi, sab kuch thanda nikleaga. To ek token system cap karta hai ki ek saath kitne pak rahe hain aur baaki rail par intezaar karte hain — wo ek semaphore hai, ya `p-limit`. Dono ideas maujood hain kyunki kaam *shuru* karna sasta hai aur wo kaam *khatam* karna jo ab chahiye nahi, ya ek saath shuru kiye kaam mein doobna, jo aapko asal mein mehnga padta hai.',
    },

    simple: `**\`AbortController\` — the standard cancellation token**

\`\`\`js
const controller = new AbortController();
const { signal } = controller;

// pass the signal into anything abort-aware:
const res = await fetch(url, { signal });
await setTimeout(1000, undefined, { signal });      // node:timers/promises
await readFile("big.log", { signal });              // node:fs/promises

controller.abort();                                  // -> those pending calls reject with an AbortError
signal.aborted;                                      // true
signal.reason;                                       // whatever you passed to abort(), or a DOMException
\`\`\`

**Timeouts, the modern way**

\`\`\`js
// aborts after 5s — and actually stops the underlying request
const res = await fetch(url, { signal: AbortSignal.timeout(5000) });

// combine: abort if EITHER the client disconnects OR 5s passes
const signal = AbortSignal.any([req.signal, AbortSignal.timeout(5000)]);
\`\`\`

**Make your own function abort-aware**

\`\`\`js
async function poll(url, { signal } = {}) {
  while (!signal?.aborted) {
    const r = await fetch(url, { signal });
    if (r.status !== 202) return r.json();
    await setTimeout(1000, undefined, { signal });   // also cancellable
  }
  throw new Error("aborted", { cause: signal.reason });
}
\`\`\`

**Wire the request lifetime through** (Express 5 / Node)

\`\`\`js
app.get("/report", async (req, res) => {
  // req carries an AbortSignal that fires when the client disconnects
  const signal = AbortSignal.any([req.signal ?? new AbortController().signal,
                                  AbortSignal.timeout(30_000)]);
  const rows = await db.query(bigReportSql, { signal });   // pool driver must honour it
  res.json(rows);
});
\`\`\`

**Bound concurrency — never "all at once" over a big list**

\`\`\`js
import pLimit from "p-limit";
const limit = pLimit(10);                              // at most 10 in flight
const results = await Promise.all(urls.map(u => limit(() => fetch(u))));
\`\`\`

\`\`\`
a hand-rolled semaphore:
  - a counter of free "slots" (start = N)
  - acquire(): if a slot is free, take it; else wait in a queue
  - release(): hand a slot to the next waiter, or return it to the pool
\`\`\`

**Batching — when the downstream has a bulk endpoint**

\`\`\`js
for (const group of chunk(ids, 100)) {
  await api.getMany(group);       // 1 request per 100 ids, not 1 per id
}
\`\`\``,

    simpleHi: `**\`AbortController\` — standard cancellation token**

\`\`\`js
const controller = new AbortController();
const { signal } = controller;

const res = await fetch(url, { signal });
await setTimeout(1000, undefined, { signal });      // node:timers/promises
await readFile("big.log", { signal });              // node:fs/promises

controller.abort();                                  // -> pending calls AbortError se reject
signal.aborted;                                      // true
signal.reason;                                       // jo aapne abort() ko diya
\`\`\`

**Timeouts, modern tarika**

\`\`\`js
const res = await fetch(url, { signal: AbortSignal.timeout(5000) });   // 5s baad abort — aur asal mein request rokta hai
const signal = AbortSignal.any([req.signal, AbortSignal.timeout(5000)]);  // client disconnect YA 5s
\`\`\`

**Apna function abort-aware banao**

\`\`\`js
async function poll(url, { signal } = {}) {
  while (!signal?.aborted) {
    const r = await fetch(url, { signal });
    if (r.status !== 202) return r.json();
    await setTimeout(1000, undefined, { signal });
  }
  throw new Error("aborted", { cause: signal.reason });
}
\`\`\`

**Request lifetime through wire karo**

\`\`\`js
app.get("/report", async (req, res) => {
  const signal = AbortSignal.any([req.signal ?? new AbortController().signal,
                                  AbortSignal.timeout(30_000)]);
  const rows = await db.query(bigReportSql, { signal });
  res.json(rows);
});
\`\`\`

**Concurrency bound karo — ek bade list par kabhi "all at once" nahi**

\`\`\`js
import pLimit from "p-limit";
const limit = pLimit(10);
const results = await Promise.all(urls.map(u => limit(() => fetch(u))));
\`\`\`

\`\`\`
ek hand-rolled semaphore:
  - free "slots" ka ek counter (start = N)
  - acquire(): agar slot free hai, lo; warna ek queue mein wait karo
  - release(): agle waiter ko ek slot do, ya pool mein wapas
\`\`\`

**Batching — jab downstream ke paas ek bulk endpoint hai**

\`\`\`js
for (const group of chunk(ids, 100)) {
  await api.getMany(group);       // 100 ids ke liye 1 request, per id 1 nahi
}
\`\`\``,

    content: `## Promises can't be cancelled — but the work behind them can

A \`Promise\` is a one-way notification that something finished; there is no \`.cancel()\`. What you cancel is the *operation* — the HTTP request, the file read, the timer, the query — and the standard mechanism for that across the whole platform is **\`AbortController\`** / **\`AbortSignal\`**.

- **\`new AbortController()\`** gives you a \`controller\` (holds \`.abort(reason)\`) and a \`controller.signal\` (an \`AbortSignal\`, an \`EventTarget\`).
- You **pass the signal into** any abort-aware API: \`fetch(url, { signal })\`, \`node:fs/promises\` and \`node:timers/promises\` functions, \`http.request\`, most database drivers, \`EventEmitter.once(emitter, name, { signal })\`, and any library that documents a \`signal\` option.
- Calling **\`controller.abort()\`** synchronously sets \`signal.aborted = true\`, sets \`signal.reason\`, and fires the signal's \`"abort"\` event. Every pending abort-aware call rejects, conventionally with an \`AbortError\` (a \`DOMException\` with \`name === "AbortError"\`).
- A signal is **single-use** — once aborted it stays aborted. Make a fresh controller per operation (or per request).

## Timeouts done right

The old timeout pattern — \`Promise.race([work, delay])\` — only stops you *waiting*; the slow query keeps running and holding resources. \`AbortSignal.timeout(ms)\` returns a signal that aborts itself after \`ms\`, so passing it to \`fetch\` or a driver actually **tears down the underlying work**:

\`\`\`js
try {
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
} catch (e) {
  if (e.name === "TimeoutError") { /* the request was aborted at 5s */ }
}
\`\`\`

\`AbortSignal.any([a, b, ...])\` produces a signal that aborts when **any** of the inputs abort — the standard way to combine "the client went away" with "we hit our own deadline":

\`\`\`js
const signal = AbortSignal.any([req.signal, AbortSignal.timeout(30_000)]);
\`\`\`

## Propagating cancellation through your own code

Cancellation only works if every layer forwards the signal. A handler that accepts \`req.signal\` but then calls \`db.query(sql)\` without passing it has a cancellation dead-end — the query runs to completion regardless. The pattern:

1. At the entry point, build one signal: \`AbortSignal.any([clientSignal, AbortSignal.timeout(deadline)])\`.
2. Thread it as an option (\`{ signal }\`) through every async function down the call tree.
3. In loops and long computations, check \`signal.throwIfAborted()\` (or \`if (signal.aborted) throw ...\`) between iterations.
4. In an abort-aware primitive you write, register a listener: \`signal.addEventListener("abort", () => cleanup(), { once: true })\`.

Express 5 exposes \`req.signal\`; in Express 4 you listen for \`req.on("close")\` and call \`controller.abort()\` yourself. Not every database driver honours a query-level signal — check; some support a statement timeout instead (set it at the connection level).

## Concurrency control — bounded parallelism

\`await Promise.all(items.map(fn))\` starts every \`fn\` at once. Over a 5-item array that is fine. Over a 50,000-item array it will:

- open 50,000 sockets → hit the OS file-descriptor limit (\`EMFILE\`),
- overrun your database connection pool (every extra query queues or errors),
- trip the downstream API's rate limiter (429s, or an IP ban),
- buffer 50,000 in-flight responses in memory → RSS spike, maybe OOM.

You want **bounded** parallelism: N operations running, the rest queued. Options, simplest first:

**Chunking** — process the array in slices:

\`\`\`js
for (const slice of chunk(items, 20)) {
  await Promise.all(slice.map(fn));   // 20 at a time
}
\`\`\`

Simple, but the slice only advances when its *slowest* member finishes — a straggler stalls the whole batch.

**A concurrency limiter** (\`p-limit\`, \`p-map\` with \`{ concurrency }\`, or \`Promise.map\` in Bluebird-style libs) — keeps exactly N in flight, starting the next the instant one finishes:

\`\`\`js
import pLimit from "p-limit";
const limit = pLimit(10);
const results = await Promise.all(items.map(x => limit(() => fn(x))));
\`\`\`

**A hand-rolled semaphore** — a counter of permits and a queue of waiters:

\`\`\`js
class Semaphore {
  #permits; #queue = [];
  constructor(n) { this.#permits = n; }
  async acquire() {
    if (this.#permits > 0) { this.#permits--; return; }
    await new Promise(res => this.#queue.push(res));
  }
  release() {
    const next = this.#queue.shift();
    if (next) next(); else this.#permits++;
  }
}
// usage: await sem.acquire(); try { await fn(); } finally { sem.release(); }
\`\`\`

**Batching** is different from limiting — if the downstream has a *bulk* endpoint (\`GET /users?ids=1,2,3\`, a multi-row \`INSERT\`), send 100 ids in one request instead of 100 requests. That is the biggest win of all: fewer round-trips, not just controlled parallelism.

## Choosing a concurrency limit

Start from the constraint that binds first: your DB pool size (a common default is 10), the downstream's documented rate limit, or the remote's connection cap. A limit of \`poolSize - headroom\` for DB work, or \`rateLimit / avgLatency\` for an API, is a sane starting point — then measure. Too low wastes time; too high reintroduces the blowup you were avoiding.`,

    contentHi: `## Promises cancel nahi ho sakte — par unke peeche ka kaam ho sakta hai

Ek \`Promise\` ek one-way notification hai ki kuch khatam hua; koi \`.cancel()\` nahi hai. Aap jo cancel karte ho wo *operation* hai — HTTP request, file read, timer, query — aur iske liye poore platform mein standard mechanism **\`AbortController\`** / **\`AbortSignal\`** hai.

- **\`new AbortController()\`** aapko ek \`controller\` (\`.abort(reason)\` rakhta hai) aur ek \`controller.signal\` (ek \`AbortSignal\`, ek \`EventTarget\`) deta hai.
- Aap signal ko kisi bhi abort-aware API mein **pass karte ho**: \`fetch(url, { signal })\`, \`node:fs/promises\` aur \`node:timers/promises\`, most database drivers.
- **\`controller.abort()\`** synchronously \`signal.aborted = true\` set karta hai, \`signal.reason\` set karta hai, aur \`"abort"\` event fire karta hai. Har pending abort-aware call reject karta hai, conventionally ek \`AbortError\` ke saath.
- Ek signal **single-use** hai — ek baar aborted, aborted rehta hai. Prati operation ek fresh controller banao.

## Timeouts sahi tarike se

Purana timeout pattern — \`Promise.race([work, delay])\` — sirf aapko *intezaar* karne se rokta hai; slow query chalta rehta hai. \`AbortSignal.timeout(ms)\` ek signal return karta hai jo \`ms\` ke baad khud abort ho jaata hai, to ise \`fetch\` ya ek driver ko pass karna asal mein **underlying work ko tear down karta hai**.

\`AbortSignal.any([a, b, ...])\` ek signal produce karta hai jo tab abort hota hai jab **koi** input abort ho — "client chala gaya" aur "humne apni deadline hit ki" combine karne ka standard tarika.

## Apne code ke through cancellation propagate karna

Cancellation sirf tab kaam karta hai jab har layer signal forward kare. Ek handler jo \`req.signal\` accept karta hai par phir ise pass kiye bina \`db.query(sql)\` call karta hai ek cancellation dead-end hai. Pattern:

1. Entry point par, ek signal banao: \`AbortSignal.any([clientSignal, AbortSignal.timeout(deadline)])\`.
2. Ise ek option (\`{ signal }\`) ke roop mein har async function ke through thread karo.
3. Loops aur long computations mein, iterations ke beech \`signal.throwIfAborted()\` check karo.
4. Ek abort-aware primitive mein jo aap likhte ho, ek listener register karo: \`signal.addEventListener("abort", () => cleanup(), { once: true })\`.

Express 5 \`req.signal\` expose karta hai; Express 4 mein aap \`req.on("close")\` sunte ho aur khud \`controller.abort()\` call karte ho. Har database driver ek query-level signal honour nahi karta — check karo.

## Concurrency control — bounded parallelism

\`await Promise.all(items.map(fn))\` har \`fn\` ek saath shuru karta hai. Ek 50,000-item array par ye: 50,000 sockets kholega (\`EMFILE\`), database connection pool overrun karega, downstream API ki rate limiter trip karega, memory mein 50,000 responses buffer karega (OOM).

Aap **bounded** parallelism chaahte ho: N operations chalte, baaki queued. Options:

**Chunking** — array ko slices mein process karo. Simple, par slice sirf tab aage badhta hai jab iska *slowest* member khatam ho.

**Ek concurrency limiter** (\`p-limit\`) — theek N in flight rakhta hai, jaise hi ek khatam ho agla shuru karta hai.

**Ek hand-rolled semaphore** — permits ka ek counter aur waiters ki ek queue.

**Batching** limiting se alag hai — agar downstream ke paas ek *bulk* endpoint hai, ek request mein 100 ids bhejo 100 requests ke bajaye. Ye sabse bada win hai.

## Ek concurrency limit chunna

Us constraint se shuru karo jo pehle bind karta hai: aapka DB pool size (ek aam default 10 hai), downstream ki documented rate limit, ya remote ka connection cap. Phir measure karo. Bahut kam samay barbaad karta hai; bahut zyaada wo blowup wapas laata hai jise aap avoid kar rahe the.`,

    examples: [
      {
        title: 'AbortController: abort() rejects the pending call with the reason you pass',
        titleHi: 'AbortController: abort() pending call ko aapke diye reason se reject karta hai',
        code: `const sleep = (ms, signal) => new Promise((res, rej) => {
  const t = setTimeout(res, ms);
  signal?.addEventListener("abort", () => {
    clearTimeout(t);
    rej(signal.reason ?? new Error("aborted"));
  }, { once: true });
});

const ac = new AbortController();
setTimeout(() => ac.abort(new Error("user navigated away")), 20);

try {
  await sleep(1000, ac.signal);
} catch (e) {
  console.log("stopped early:", e.message);
  console.log("signal.aborted:", ac.signal.aborted);
}`,
        codeJs: `// A cancellable sleep, written to be abort-aware
const sleep = (ms, signal) => new Promise((resolve, reject) => {
  if (signal?.aborted) return reject(signal.reason);
  const t = setTimeout(resolve, ms);
  signal?.addEventListener("abort", () => {
    clearTimeout(t);                              // stop the timer
    reject(signal.reason ?? new Error("aborted")); // reject with the reason
  }, { once: true });
});

const controller = new AbortController();
// something decides to cancel after 20ms
setTimeout(() => controller.abort(new Error("user navigated away")), 20);

try {
  await sleep(1000, controller.signal);          // would take 1s
  console.log("slept the full second");
} catch (e) {
  console.log("stopped early:", e.message);       // "stopped early: user navigated away"
  console.log("signal.aborted:", controller.signal.aborted);  // true
}`,
        codeTs: `const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(signal.reason ?? new Error("aborted"));
      },
      { once: true },
    );
  });

const controller = new AbortController();
setTimeout(() => controller.abort(new Error("user navigated away")), 20);

try {
  await sleep(1000, controller.signal);
} catch (e) {
  console.log("stopped early:", (e as Error).message);
}`,
        output: `stopped early: user navigated away
signal.aborted: true

The sleep was set for 1000ms but abort() fired at 20ms, clearing the
timer and rejecting the promise with the exact Error passed to abort().`,
        explain: 'AbortController is the cancellation token. You pass controller.signal into an operation; calling controller.abort(reason) synchronously flips signal.aborted, sets signal.reason, and fires the abort event. A well-written async primitive listens for that event, cleans up its resources (here, the timer), and rejects with signal.reason so the caller knows why it stopped.',
        explainHi: 'AbortController cancellation token hai. Aap controller.signal ko ek operation mein pass karte ho; controller.abort(reason) call karna synchronously signal.aborted flip karta hai, signal.reason set karta hai, aur abort event fire karta hai. Ek achha async primitive us event ko sunta hai, apne resources cleanup karta hai, aur signal.reason ke saath reject karta hai.',
      },
      {
        title: 'AbortSignal.timeout and AbortSignal.any: deadline OR client-disconnect',
        titleHi: 'AbortSignal.timeout aur AbortSignal.any: deadline YA client-disconnect',
        code: `const sleep = (ms, signal) => new Promise((res, rej) => {
  const t = setTimeout(res, ms);
  signal?.addEventListener("abort", () => { clearTimeout(t); rej(signal.reason); }, { once: true });
});

try {
  await sleep(1000, AbortSignal.timeout(15));
} catch (e) {
  console.log("timed out:", e.name);   // TimeoutError
}`,
        codeJs: `const sleep = (ms, signal) => new Promise((resolve, reject) => {
  const t = setTimeout(resolve, ms);
  signal?.addEventListener("abort", () => { clearTimeout(t); reject(signal.reason); }, { once: true });
});

// AbortSignal.timeout(ms) aborts itself after ms
try {
  await sleep(1000, AbortSignal.timeout(15));
} catch (e) {
  console.log("timed out:", e.name);        // "timed out: TimeoutError"
}

// AbortSignal.any combines: whichever fires first wins
const clientGone = new AbortController();
const signal = AbortSignal.any([clientGone.signal, AbortSignal.timeout(50)]);
setTimeout(() => clientGone.abort(new Error("client disconnected")), 10);
try {
  await sleep(1000, signal);
} catch (e) {
  console.log("stopped by:", e.message);     // "stopped by: client disconnected" (10ms < 50ms)
}`,
        codeTs: `const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => { clearTimeout(t); reject(signal.reason); }, { once: true });
  });

try {
  await sleep(1000, AbortSignal.timeout(15));
} catch (e) {
  console.log("timed out:", (e as Error).name);
}

const clientGone = new AbortController();
const signal: AbortSignal = AbortSignal.any([clientGone.signal, AbortSignal.timeout(50)]);
setTimeout(() => clientGone.abort(new Error("client disconnected")), 10);
try {
  await sleep(1000, signal);
} catch (e) {
  console.log("stopped by:", (e as Error).message);
}`,
        output: `timed out: TimeoutError
stopped by: client disconnected

AbortSignal.timeout gave a signal that aborted itself at 15ms with a
TimeoutError. AbortSignal.any([a, b]) produced a signal that fired when
the earliest of the two (the 10ms client-disconnect) aborted.`,
        explain: 'AbortSignal.timeout(ms) is a self-aborting signal — cleaner than racing a manual setTimeout, and it rejects with a TimeoutError you can distinguish. AbortSignal.any([...]) merges signals so an operation stops when the client disconnects OR the server deadline passes, whichever comes first. Both compose into one { signal } you thread through the call tree.',
        explainHi: 'AbortSignal.timeout(ms) ek self-aborting signal hai — ek manual setTimeout ko race karne se saaf, aur ye ek TimeoutError ke saath reject karta hai. AbortSignal.any([...]) signals merge karta hai to ek operation tab rukta hai jab client disconnect ho YA server deadline paar ho.',
      },
      {
        title: 'A semaphore caps concurrency: 5 tasks, never more than 2 running',
        titleHi: 'Ek semaphore concurrency cap karta hai: 5 tasks, kabhi 2 se zyaada nahi',
        code: `function pLimit(n) {
  let active = 0; const queue = [];
  const next = () => { if (active < n && queue.length) { active++; queue.shift()(); } };
  return (fn) => new Promise((res, rej) => {
    queue.push(() => fn().then(res, rej).finally(() => { active--; next(); }));
    next();
  });
}

const limit = pLimit(2);
let running = 0, peak = 0;
const task = (i) => async () => {
  running++; peak = Math.max(peak, running);
  await new Promise(r => setTimeout(r, 10));
  running--; return i;
};
const out = await Promise.all([1, 2, 3, 4, 5].map(i => limit(task(i))));
console.log("results:", out, "| peak concurrency:", peak);`,
        codeJs: `// A minimal p-limit: at most n callbacks running, the rest queued
function pLimit(n) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active < n && queue.length > 0) {
      active++;
      queue.shift()();
    }
  };
  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push(() =>
        fn().then(resolve, reject).finally(() => {
          active--;
          next();      // a slot freed — start the next queued task
        }),
      );
      next();
    });
}

const limit = pLimit(2);
let running = 0;
let peak = 0;
const task = (i) => async () => {
  running++;
  peak = Math.max(peak, running);
  await new Promise((r) => setTimeout(r, 10));
  running--;
  return i;
};

const results = await Promise.all([1, 2, 3, 4, 5].map((i) => limit(task(i))));
console.log("results:", results, "| peak concurrency:", peak);
// results: [ 1, 2, 3, 4, 5 ] | peak concurrency: 2`,
        codeTs: `function pLimit(n: number) {
  let active = 0;
  const queue: Array<() => void> = [];
  const next = () => {
    if (active < n && queue.length > 0) {
      active++;
      queue.shift()!();
    }
  };
  return <T>(fn: () => Promise<T>): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      queue.push(() =>
        fn().then(resolve, reject).finally(() => {
          active--;
          next();
        }),
      );
      next();
    });
}

const limit = pLimit(2);
let running = 0;
let peak = 0;
const task = (i: number) => async (): Promise<number> => {
  running++;
  peak = Math.max(peak, running);
  await new Promise((r) => setTimeout(r, 10));
  running--;
  return i;
};

const results = await Promise.all([1, 2, 3, 4, 5].map((i) => limit(task(i))));
console.log("results:", results, "| peak concurrency:", peak);`,
        output: `results: [ 1, 2, 3, 4, 5 ] | peak concurrency: 2

All five tasks were submitted at once, but the limiter kept at most two
running — tasks 3, 4, 5 waited in the queue and started as earlier ones
finished. Result order still matches submission order.`,
        explain: 'A concurrency limiter takes each task, and if a slot is free it runs it, otherwise it queues it; when a running task finishes it frees its slot and pulls the next from the queue. Peak concurrency never exceeds n. This is what stands between "map 50,000 fetches" and an EMFILE crash — you get near-parallel throughput while respecting the pool, the rate limit, and memory.',
        explainHi: 'Ek concurrency limiter har task leta hai, aur agar ek slot free hai ise chalata hai, warna ise queue karta hai; jab ek running task khatam hota hai ye apna slot free karta hai aur queue se agla kheenchta hai. Peak concurrency kabhi n se zyaada nahi. Yahi "map 50,000 fetches" aur ek EMFILE crash ke beech khada hai.',
      },
    ],

    mistakes: [
      {
        wrong: `app.get("/report", async (req, res) => {
  const rows = await db.query(hugeReportSql);   // no signal, no timeout
  res.json(rows);
});
// client disconnects at 2s; the query runs for 45s more, holding a pool connection`,
        right: `app.get("/report", async (req, res) => {
  const signal = AbortSignal.any([
    req.signal ?? new AbortController().signal,   // fires on client disconnect (Express 5)
    AbortSignal.timeout(30_000),                  // our own hard deadline
  ]);
  try {
    const rows = await db.query(hugeReportSql, { signal });   // driver must honour signal
    res.json(rows);
  } catch (e) {
    if (e.name === "AbortError" || e.name === "TimeoutError") return res.status(504).end();
    throw e;
  }
});`,
        why: 'A request handler that fires an expensive operation with no signal and no timeout keeps working long after the client has gone — holding a database connection out of the pool, burning CPU, and producing a result nobody reads. Under load, enough of these abandoned queries will exhaust the pool and take the whole service down. Build one signal at the entry point that combines the client-disconnect signal with your own deadline, thread it into every downstream call, and make sure the driver actually cancels the query when it fires (some use a statement timeout instead — configure that).',
        whyHi: 'Ek request handler jo ek mehnga operation bina signal bina timeout fire karta hai client ke jaane ke baad bhi kaam karta rehta hai — ek database connection pool se bahar rokte hue, CPU jalate hue. Load ke tahat, in abandoned queries mein se kaafi pool khatam kar dengi aur poori service down kar dengi. Entry point par ek signal banao jo client-disconnect signal ko aapki apni deadline ke saath combine kare, ise har downstream call mein thread karo.',
      },
      {
        wrong: `// timeout via Promise.race
const result = await Promise.race([
  slowQuery(),
  new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 5000)),
]);
// after 5s you get the error — but slowQuery() keeps running and holding a connection`,
        right: `const result = await slowQuery({ signal: AbortSignal.timeout(5000) });
// the signal is threaded into the driver, which actually aborts the query at 5s`,
        why: 'Promise.race with a timeout promise only makes your code stop waiting — the losing promise is not cancelled, because promises have no cancel. The slow query keeps executing, keeps its connection checked out, and keeps consuming database CPU; you have added a timeout to the response but not to the work. AbortSignal.timeout produces a signal you pass into the operation, so when it fires the operation itself is torn down. Use race only when the slow side genuinely cannot be made abort-aware, and know you are leaking that work.',
        whyHi: 'Ek timeout promise ke saath Promise.race sirf aapke code ko intezaar karne se rokta hai — haarne waala promise cancel nahi hota, kyunki promises mein cancel nahi hai. Slow query execute karti rehti hai, apna connection checked out rakhti hai. AbortSignal.timeout ek signal produce karta hai jise aap operation mein pass karte ho, to jab ye fire ho operation khud tear down ho jaata hai.',
      },
      {
        wrong: `// "process the whole import in parallel"
await Promise.all(rows.map(row => insertWithLookups(row)));
// 80_000 rows -> 80_000 concurrent transactions -> pool timeout, deadlocks, OOM`,
        right: `import pLimit from "p-limit";
const limit = pLimit(8);                       // ~ pool size minus headroom
await Promise.all(rows.map(row => limit(() => insertWithLookups(row))));

// even better if the DB supports it: batch inserts
for (const batch of chunk(rows, 500)) {
  await db.insertMany(batch);                  // 1 statement per 500 rows
}`,
        why: 'Mapping a large array straight into Promise.all launches every operation simultaneously. For database work that means more concurrent transactions than the pool has connections, so most of them queue until they time out; it also multiplies lock contention and deadlock probability. Bound it with a limiter sized near the pool, and — better still — if the downstream has a bulk API, batch: one multi-row insert instead of 500 single-row inserts is fewer round-trips, one transaction, and far less contention.',
        whyHi: 'Ek bade array ko seedhe Promise.all mein map karna har operation ko ek saath launch karta hai. Database work ke liye iska matlab pool ke connections se zyaada concurrent transactions, to zyaadatar queue karte hain jab tak timeout na ho jaayein; ye lock contention bhi multiply karta hai. Ise pool ke paas ek limiter se bound karo, aur — aur behtar — agar downstream ke paas ek bulk API hai, batch karo.',
      },
    ],

    realWorld: [
      {
        en: '**A gateway that builds `AbortSignal.any([req.signal, AbortSignal.timeout(cfg.upstreamTimeoutMs)])` once per request** and passes it into every upstream `fetch`, so a client hang-up or a slow upstream both release the gateway\'s resources immediately and return a 504.',
        hi: '**Ek gateway jo prati request ek baar `AbortSignal.any([req.signal, AbortSignal.timeout(...)])` banaata hai** aur ise har upstream `fetch` mein pass karta hai.',
      },
      {
        en: '**A nightly sync job that walks 200k external records through `p-map` with `{ concurrency: 12 }`** — tuned to sit just under the third-party API\'s 1000-requests-per-minute limit, with `AbortSignal.timeout` per call so one stuck request cannot stall a worker.',
        hi: '**Ek nightly sync job jo 200k records ko `p-map` `{ concurrency: 12 }` ke saath walk karta hai** — third-party API ki rate limit ke theek neeche tuned.',
      },
      {
        en: '**A search-as-you-type endpoint where each keystroke `controller.abort()`s the previous in-flight query** before issuing the new one, so the backend never processes stale searches and the DB only ever runs the latest.',
        hi: '**Ek search-as-you-type endpoint jahaan har keystroke pichhli in-flight query ko `controller.abort()` karta hai** naya issue karne se pehle.',
      },
    ],

    interviewQA: [
      {
        q: 'How does cancellation work in Node given that promises can\'t be cancelled?',
        qHi: 'Node mein cancellation kaise kaam karta hai jab promises cancel nahi ho sakte?',
        a: 'A promise is just a notification that some work settled, and it has no cancel method. What you actually cancel is the operation behind it — the HTTP request, the timer, the file read, the query — and the platform-wide mechanism for that is AbortController and AbortSignal. You create a controller, which owns an abort method and exposes a signal, and you pass that signal into any abort-aware API: fetch, the promise versions of the timers and fs modules, most database drivers, EventEmitter.once, and libraries that document a signal option. Calling controller.abort, optionally with a reason, synchronously sets signal.aborted to true, sets signal.reason, and dispatches an abort event on the signal; every pending abort-aware call then rejects, by convention with an AbortError. A signal is single use, so you make a fresh controller per operation or per request. For timeouts there is AbortSignal.timeout, a signal that aborts itself after a given number of milliseconds and rejects with a distinguishable TimeoutError — better than racing a manual setTimeout because it tears down the underlying work rather than just stopping you from waiting. And AbortSignal.any merges several signals so an operation stops when, for instance, the client disconnects or a server deadline passes, whichever is first. The catch is that cancellation only works if every layer forwards the signal — a handler that receives one but then calls the database without passing it has a dead end.',
        aHi: 'Ek promise sirf ek notification hai ki kuch kaam settle hua, aur iska koi cancel method nahi hai. Aap asal mein jo cancel karte ho wo operation hai — HTTP request, timer, file read, query — aur iske liye platform-wide mechanism AbortController aur AbortSignal hai. Aap ek controller banaate ho, jiske paas ek abort method hai aur ek signal expose karta hai, aur aap wo signal kisi bhi abort-aware API mein pass karte ho. controller.abort call karna synchronously signal.aborted ko true set karta hai, signal.reason set karta hai, aur ek abort event dispatch karta hai; har pending abort-aware call phir reject karta hai. Timeouts ke liye AbortSignal.timeout hai. AbortSignal.any kई signals merge karta hai. Catch ye hai ki cancellation sirf tab kaam karta hai jab har layer signal forward kare.',
      },
      {
        q: 'You need to call an API for 10,000 items. Why not `Promise.all(items.map(fn))`, and what do you do instead?',
        qHi: 'Aapko 10,000 items ke liye ek API call karni hai. `Promise.all(items.map(fn))` kyun nahi, aur aap iske bajaye kya karte ho?',
        a: 'Promise.all over map starts every call at the same instant. Ten thousand simultaneous requests will do some combination of: exhaust the OS file descriptor limit and throw EMFILE, overrun your database connection pool so most calls queue until they time out, trip the remote API\'s rate limiter and get you 429s or an IP ban, and buffer ten thousand in-flight responses in memory for a big RSS spike or an out-of-memory crash. What you want is bounded parallelism — a fixed number running, the rest queued. The simplest is chunking: slice the array and Promise.all each slice, though a slow item stalls its whole slice. Better is a concurrency limiter like p-limit or p-map with a concurrency option, or a hand-rolled semaphore — a permit counter and a waiter queue — which keeps exactly N in flight and starts the next the moment one finishes. Best of all, if the downstream has a bulk endpoint, batch: send a hundred ids in one request instead of a hundred requests. To pick the limit, start from whatever binds first — the pool size, the documented rate limit, the remote\'s connection cap — then measure and adjust.',
        aHi: 'map par Promise.all har call ko ek hi pal shuru karta hai. Das hazaar ek saath requests: OS file descriptor limit khatam karke EMFILE throw karengi, database connection pool overrun karengi, remote API ki rate limiter trip karengi (429s ya IP ban), aur das hazaar responses memory mein buffer karengi (OOM crash). Aap bounded parallelism chaahte ho — ek fixed number chalte, baaki queued. Sabse simple chunking hai. Behtar ek concurrency limiter jaise p-limit hai, ya ek hand-rolled semaphore. Sabse achha, agar downstream ke paas ek bulk endpoint hai, batch karo. Limit chunne ke liye, us cheez se shuru karo jo pehle bind karti hai, phir measure karo.',
      },
    ],

    exercises: [
      {
        task: 'Write `fetchWithRetry(url, { retries = 3, timeoutMs = 2000, signal } = {})` that: fetches with a per-attempt timeout via `AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)])`; retries on failure with exponential backoff (`2 ** attempt * 100`ms); but if the CALLER\'s `signal` aborts, stops immediately and rethrows — it must NOT keep retrying after the caller cancelled.',
        taskHi: '`fetchWithRetry(url, { retries, timeoutMs, signal })` likho jo per-attempt timeout ke saath fetch karta hai, exponential backoff par retry karta hai, par agar CALLER ka `signal` abort ho to turant rukta hai — retry NAHI karta.',
        hint: 'Each attempt: `AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)])`. In the catch, first check `signal?.aborted` and rethrow if so; only otherwise `await setTimeout(backoff)` and loop. Distinguish a timeout (retry) from a caller abort (stop).',
        hintHi: 'Har attempt: `AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)])`. catch mein, pehle `signal?.aborted` check karo aur rethrow karo; sirf warna `await setTimeout(backoff)` aur loop.',
      },
      {
        task: 'Implement `mapLimit(items, concurrency, fn)` returning results in input order, with at most `concurrency` calls to `fn` in flight. Test with 12 items, `concurrency = 4`, and an `fn` that tracks live count; assert the peak live count is exactly `4` (not `<=`) and the results are `items.map(realFn)`.',
        taskHi: '`mapLimit(items, concurrency, fn)` implement karo jo results input order mein return karta hai, zyaada se zyaada `concurrency` calls in flight. Test: 12 items, `concurrency = 4`, assert peak live count theek `4` hai.',
        hint: 'Keep `nextIndex`, `results` array, `active` count. A `runNext()` that, while `active < concurrency && nextIndex < items.length`, grabs an index, increments `active`, calls `fn`, and on settle writes `results[i]`, decrements `active`, calls `runNext()` again. Resolve when all done.',
        hintHi: '`nextIndex`, `results` array, `active` count rakho. Ek `runNext()` jo `active < concurrency` hone tak ek index grab karta hai, `fn` call karta hai, settle par `results[i]` likhta hai aur `runNext()` phir call karta hai.',
      },
      {
        task: 'Write `debounceAbort(fn)` that returns a wrapped function: each call `abort()`s the AbortController from the previous call, makes a new one, and invokes `fn(...args, controller.signal)`. Simulate a search box: call the wrapper 4 times in quick succession with an `fn` that resolves after 50ms, and assert only the LAST call\'s promise resolves — the first 3 reject with an AbortError.',
        taskHi: '`debounceAbort(fn)` likho jo ek wrapped function return karta hai: har call pichhli call ke AbortController ko `abort()` karta hai, ek naya banaata hai, aur `fn(...args, controller.signal)` invoke karta hai. Assert sirf AAKHRI call ka promise resolve hota hai.',
        hint: 'Closure over `let current = null`. On each call: `current?.abort()`, `current = new AbortController()`, `return fn(...args, current.signal)`. `fn` must check the signal and reject if aborted.',
        hintHi: '`let current = null` par closure. Har call par: `current?.abort()`, `current = new AbortController()`, `return fn(...args, current.signal)`. `fn` ko signal check karke reject karna hai agar aborted.',
      },
    ],

    keyTakeaways: [
      'Promises have NO `.cancel()`. You cancel the OPERATION behind them, and the platform-standard token is `AbortController` (`new AbortController()` -> `.abort(reason)` + `.signal`). Pass `.signal` into any abort-aware API: `fetch`, `node:fs/promises`, `node:timers/promises`, `http.request`, most DB drivers, `EventEmitter.once(e, name, { signal })`.',
      '`controller.abort(reason)` SYNCHRONOUSLY sets `signal.aborted = true`, sets `signal.reason`, fires the `"abort"` event; pending abort-aware calls reject (conventionally an `AbortError` — `DOMException`, `name === "AbortError"`). A signal is SINGLE-USE — one controller per operation/request.',
      '`AbortSignal.timeout(ms)` = a self-aborting signal, rejects with a distinguishable `TimeoutError`. BETTER than `Promise.race([work, delay])` because it TEARS DOWN the underlying work — `race` only stops you *waiting* while the slow query keeps holding a connection.',
      '`AbortSignal.any([a, b, ...])` = aborts when ANY input aborts. Standard pattern at a request entry point: `AbortSignal.any([req.signal, AbortSignal.timeout(deadlineMs)])` — client-disconnect OR server deadline.',
      'Cancellation only works if EVERY layer forwards the signal. Thread `{ signal }` through every async fn; check `signal.throwIfAborted()` between loop iterations; in your own primitive, `signal.addEventListener("abort", cleanup, { once: true })`. Express 5 has `req.signal`; Express 4 -> `req.on("close")` + your own `controller.abort()`.',
      '`await Promise.all(bigArray.map(fn))` starts ALL at once -> `EMFILE` (fd limit), pool exhaustion, downstream 429/ban, memory blowup. Use BOUNDED parallelism.',
      'Bounding options: CHUNKING (`for (const s of chunk(items, N)) await Promise.all(s.map(fn))` — simple, but a straggler stalls its slice); a CONCURRENCY LIMITER (`p-limit`, `p-map {concurrency}` — keeps exactly N in flight, starts the next on completion); a hand-rolled SEMAPHORE (permit counter + waiter queue).',
      'BATCHING beats limiting when the downstream has a BULK endpoint: `GET /users?ids=1,2,3` or a multi-row `INSERT` — 100 ids in 1 request, not 100 requests. Fewer round-trips, one transaction, less contention. Pick a concurrency limit from what binds first (DB pool size, documented rate limit, remote conn cap), then MEASURE.',
    ],
    keyTakeawaysHi: [
      'Promises mein KOI `.cancel()` nahi. Aap unke peeche ka OPERATION cancel karte ho, aur platform-standard token `AbortController` hai. `.signal` ko kisi bhi abort-aware API mein pass karo: `fetch`, `node:fs/promises`, `node:timers/promises`, most DB drivers.',
      '`controller.abort(reason)` SYNCHRONOUSLY `signal.aborted = true` set karta hai, `signal.reason` set karta hai, `"abort"` event fire karta hai. Ek signal SINGLE-USE hai — prati operation ek controller.',
      '`AbortSignal.timeout(ms)` = ek self-aborting signal, ek distinguishable `TimeoutError` ke saath reject. `Promise.race` se BEHTAR kyunki ye underlying work ko TEAR DOWN karta hai.',
      '`AbortSignal.any([a, b, ...])` = jab KOI input abort ho abort. Request entry point par pattern: `AbortSignal.any([req.signal, AbortSignal.timeout(deadlineMs)])`.',
      'Cancellation sirf tab kaam karta hai jab HAR layer signal forward kare. `{ signal }` ko har async fn ke through thread karo; loop iterations ke beech `signal.throwIfAborted()` check karo. Express 5 mein `req.signal`; Express 4 -> `req.on("close")`.',
      '`await Promise.all(bigArray.map(fn))` SAB ek saath shuru karta hai -> `EMFILE`, pool exhaustion, downstream 429/ban, memory blowup. BOUNDED parallelism istemal karo.',
      'Bounding options: CHUNKING (simple, par ek straggler slice stall karta hai); ek CONCURRENCY LIMITER (`p-limit` — theek N in flight); ek hand-rolled SEMAPHORE.',
      'BATCHING limiting se behtar hai jab downstream ke paas ek BULK endpoint hai: 1 request mein 100 ids, 100 requests nahi. Concurrency limit us cheez se chuno jo pehle bind karti hai, phir MEASURE karo.',
    ],
  },
];
