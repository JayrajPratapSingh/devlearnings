/**
 * Node.js Complete Course — Module 8: Async JavaScript & Node Primitives, lesson 3.
 *
 * EventEmitter and the observer pattern: on / once / emit / off, the special
 * 'error' event (unhandled -> throw), the MaxListenersExceededWarning leak
 * signal, emit is synchronous, events.once() / events.on() as promise/async-
 * iterator bridges, removing listeners with AbortSignal, EventTarget vs
 * EventEmitter, and the fact that streams (and many core objects) ARE emitters.
 *
 * Runnable snippets executed with Node 24 (np3.mjs).
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_8_PART3: CourseLesson[] = [
  {
    slug: 'eventemitter-and-the-observer-pattern',
    title: 'EventEmitter & the Observer Pattern',
    titleHi: 'EventEmitter Aur Observer Pattern',
    description: 'A long-running service slows down and its memory climbs for hours until it is killed. The cause: every incoming connection calls `emitter.on("config-change", ...)` and nothing ever calls `.off()`, so the listener array grows without bound.',
    descriptionHi: 'Ek long-running service slow ho jaati hai aur iski memory ghanton tak chadhti hai jab tak ise maar na diya jaaye. Kaaran: har aane waala connection `emitter.on("config-change", ...)` call karta hai aur kabhi koi `.off()` call nahi karta, to listener array bina bound ke badhta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A newsroom noticeboard where reporters pin "tell me when X happens" cards.** An editor (`EventEmitter`) does not call each reporter individually — reporters walk up and pin a card for a topic (`.on("election-called", handler)`), and when that thing happens the editor reads every card pinned to that topic and hands each reporter the story (`.emit("election-called", data)`). A reporter who only wants the first result pins a self-removing card (`.once(...)`). One topic — the error topic — is special: if something goes wrong and *no* card is pinned to it, the whole newsroom stops (an unhandled error event is re-thrown and crashes the process). The failure mode that bites in production: reporters who leave the building but never take their cards down. The board fills up, the editor spends longer and longer reading cards on every event, memory for all those dead handlers is never freed — and Node warns you at exactly eleven cards on one topic (`MaxListenersExceededWarning`) precisely because that is what a leak looks like. Every `.on()` needs a matching `.off()` when the subscriber goes away.',
      hi: '**Ek newsroom noticeboard jahaan reporters "batao jab X ho" cards pin karte hain.** Ek editor (`EventEmitter`) har reporter ko alag se call nahi karta — reporters aakar ek topic ke liye ek card pin karte hain (`.on("election-called", handler)`), aur jab wo cheez hoti hai editor us topic par pin har card padhta hai aur har reporter ko story deta hai (`.emit("election-called", data)`). Ek reporter jo sirf pehla result chaahta hai ek self-removing card pin karta hai (`.once(...)`). Ek topic — error topic — special hai: agar kuch galat ho aur error topic par *koi* card pin na ho, poora newsroom ruk jaata hai (ek unhandled error event re-throw hota hai aur process crash karta hai). Production mein jo failure mode bites: reporters jo building chhod dete hain par kabhi apne cards nahi utaarte. Board bhar jaata hai, editor har event par cards padhne mein zyaada-zyaada samay lagata hai, un sab dead handlers ki memory kabhi free nahi hoti — aur Node aapko theek gyaarah cards par ek topic par warn karta hai kyunki wahi ek leak jaisa dikhta hai. Har `.on()` ko ek matching `.off()` chahiye jab subscriber chala jaaye.',
    },

    simple: `**\`EventEmitter\` — subscribe, then emit**

\`\`\`js
import { EventEmitter } from "node:events";
const bus = new EventEmitter();

bus.on("order:created", (order) => sendReceipt(order));   // subscribe (fires every time)
bus.once("ready", () => console.log("started"));          // fires exactly once, then auto-removes

bus.emit("order:created", { id: 42 });                     // synchronously calls every listener
bus.emit("ready");                                          // "started"
bus.emit("ready");                                          // nothing — once() already removed it
\`\`\`

**Removing listeners**

\`\`\`js
const onChange = (cfg) => reload(cfg);
bus.on("config", onChange);
bus.off("config", onChange);            // must be the SAME function reference
bus.removeAllListeners("config");       // nuke a whole event

// modern: remove on abort
bus.on("tick", handler, { signal: ac.signal });   // ac.abort() removes it
\`\`\`

**The \`'error'\` event is special**

\`\`\`js
bus.emit("error", new Error("boom"));   // if NO 'error' listener -> THROWS, crashes the process

bus.on("error", (err) => log.error({ err }));   // always attach one on long-lived emitters
\`\`\`

**\`emit\` is synchronous**

\`\`\`js
console.log("A");
bus.on("x", () => console.log("B"));
bus.emit("x");            // B runs here, now, before...
console.log("C");        // -> A, B, C
\`\`\`

**The leak warning**

\`\`\`
(node:123) MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
11 x listeners added to [EventEmitter]. MaxListeners is 10.
\`\`\`
Not a limit — a smoke alarm. Default max is 10 per event. \`bus.setMaxListeners(n)\` if genuinely needed; otherwise you have an \`.on()\` without an \`.off()\`.

**Bridge events to promises / async iteration**

\`\`\`js
import { once, on } from "node:events";

const [result] = await once(worker, "message");        // wait for the next 'message' (or 'error' -> reject)

for await (const [chunk] of on(readable, "data")) {     // async-iterate an event stream
  handle(chunk);
}
\`\`\`

**Streams ARE emitters**

\`\`\`js
res.on("finish", () => log.info("response sent"));
req.on("aborted", () => cleanup());
readStream.on("error", handleError).on("end", done);
\`\`\``,

    simpleHi: `**\`EventEmitter\` — subscribe, phir emit**

\`\`\`js
import { EventEmitter } from "node:events";
const bus = new EventEmitter();

bus.on("order:created", (order) => sendReceipt(order));   // subscribe (har baar fire)
bus.once("ready", () => console.log("started"));          // theek ek baar, phir auto-remove

bus.emit("order:created", { id: 42 });                     // synchronously har listener call karta hai
bus.emit("ready");                                          // "started"
bus.emit("ready");                                          // kuch nahi — once() ne pehle hi hata diya
\`\`\`

**Listeners hataana**

\`\`\`js
const onChange = (cfg) => reload(cfg);
bus.on("config", onChange);
bus.off("config", onChange);            // wahi function reference hona chahiye
bus.removeAllListeners("config");

bus.on("tick", handler, { signal: ac.signal });   // ac.abort() ise hataata hai
\`\`\`

**\`'error'\` event special hai**

\`\`\`js
bus.emit("error", new Error("boom"));   // agar KOI 'error' listener nahi -> THROW, process crash

bus.on("error", (err) => log.error({ err }));   // long-lived emitters par hamesha ek lagao
\`\`\`

**\`emit\` synchronous hai**

\`\`\`js
console.log("A");
bus.on("x", () => console.log("B"));
bus.emit("x");            // B yahaan chalta hai, abhi
console.log("C");        // -> A, B, C
\`\`\`

**Leak warning**

\`\`\`
(node:123) MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
\`\`\`
Ek limit nahi — ek smoke alarm. Default max 10 prati event. Warna aapke paas ek \`.on()\` bina \`.off()\` ke hai.

**Events ko promises / async iteration se bridge karo**

\`\`\`js
import { once, on } from "node:events";
const [result] = await once(worker, "message");
for await (const [chunk] of on(readable, "data")) handle(chunk);
\`\`\`

**Streams emitters HAIN**

\`\`\`js
res.on("finish", () => log.info("response sent"));
req.on("aborted", () => cleanup());
\`\`\``,

    content: `## The observer pattern, built in

\`EventEmitter\` (from \`node:events\`) is Node's implementation of publish/subscribe: an object holds a map of event name → list of listener functions, \`.emit(name, ...args)\` calls each listener for that name with those args, and \`.on(name, fn)\` / \`.off(name, fn)\` manage the list. It is the backbone of the standard library — \`http.Server\`, sockets, streams, the \`process\` object, child processes are all emitters — and the right tool whenever one part of your system needs to react to something another part does without the two being directly coupled.

### The core API

- **\`.on(name, fn)\`** / alias **\`.addListener\`** — subscribe; fires on every matching \`emit\`.
- **\`.once(name, fn)\`** — subscribe for exactly one emit, then auto-remove.
- **\`.off(name, fn)\`** / alias **\`.removeListener\`** — unsubscribe. **Requires the same function reference** you passed to \`.on\` — an inline arrow you did not keep a handle to cannot be removed.
- **\`.emit(name, ...args)\`** — call every listener for \`name\`, in subscription order, **synchronously**, with \`...args\`. Returns \`true\` if there were listeners.
- **\`.removeAllListeners([name])\`** — clear one event or all events.
- **\`.listenerCount(name)\`**, **\`.eventNames()\`**, **\`.listeners(name)\`** — introspection.
- **\`.prependListener\`** — add to the front (rarely needed).

### \`emit\` is synchronous

When you call \`.emit\`, every listener runs *before \`.emit\` returns*. This surprises people expecting event-loop deferral. Consequences:

- A slow synchronous listener blocks the emitter and everything after the \`emit\` call.
- If a listener \`throw\`s, it propagates out of \`.emit\` (and later listeners do not run). Wrap risky listener bodies, or emit an \`'error'\` event instead of throwing.
- To defer a listener, it must schedule its own work (\`queueMicrotask\`, \`setImmediate\`). An \`async\` listener returns a promise that \`emit\` ignores — a rejection in it becomes an \`unhandledRejection\`.

## The \`'error'\` event

\`'error'\` is the one event name with built-in semantics: **if an \`EventEmitter\` emits \`'error'\` and there is no \`'error'\` listener, the error is thrown** — and since it is thrown from inside \`.emit\`, usually asynchronously from an I/O callback, there is no \`try/catch\` around it and it crashes the process via \`uncaughtException\`.

Therefore: **every long-lived emitter you create or consume needs an \`'error'\` listener.** Streams, sockets, servers, database clients — attach one, even if it only logs. \`events.errorMonitor\` is a special symbol you can subscribe with to observe \`'error'\` events *without* counting as "handled" (for logging while still letting the default throw happen).

## The leak warning

By default an emitter warns to \`stderr\` when a **single event** accumulates **more than 10** listeners:

\`\`\`
MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 x listeners added...
\`\`\`

This is not a hard cap — the 11th listener still works — it is a heuristic for the most common bug: subscribing in a per-request or per-connection code path and never unsubscribing, so the array (and the closures each listener captures) grows for the life of the process. When you see it:

1. **Find the \`.on()\` that runs repeatedly** with no matching \`.off()\`. Fix the leak.
2. If the count is genuinely legitimate (e.g. a known fixed set of 20 plugins), raise it: \`emitter.setMaxListeners(50)\` on that emitter, or \`events.setMaxListeners(50, emitter)\`, or \`0\` to disable.

The cleanest way to avoid the leak is to tie the subscription's lifetime to something: \`emitter.on(name, fn, { signal })\` removes \`fn\` when \`signal\` aborts, so wiring the request's \`AbortSignal\` (Lesson 2) in means the listener is cleaned up automatically when the request ends.

## Promise and async-iterator bridges

Consuming events with raw \`.on\` inside \`async\` code is awkward. \`node:events\` provides two helpers:

- **\`events.once(emitter, name, { signal })\`** → a promise that resolves with the args array of the next \`name\` emit, or **rejects if the emitter emits \`'error'\` first**. Perfect for "wait for this worker's next message", "wait for the server to be \`listening\`".
- **\`events.on(emitter, name, { signal })\`** → an **async iterator** that yields \`[...args]\` for each emit, so you can \`for await...of\` an event stream with backpressure and a clean way to stop (the \`signal\`).

## \`EventEmitter\` vs \`EventTarget\`

Node also has the web-standard **\`EventTarget\`** / \`Event\` (what \`AbortSignal\`, \`fetch\` bodies, and browser-shared code use). Differences:

| | \`EventEmitter\` | \`EventTarget\` |
|---|---|---|
| add | \`.on(name, fn)\` | \`.addEventListener(name, fn)\` |
| payload | any args: \`emit(n, a, b)\` | one \`Event\` object |
| \`'error'\` | unhandled → throws | no special behaviour |
| listener count | warns at 10 | no warning |
| ecosystem | Node core, npm | web APIs, cross-platform |

Use \`EventEmitter\` for Node-internal pub/sub; use \`EventTarget\` when you need web compatibility or you are already dealing with \`AbortSignal\`.

## When NOT to use an EventEmitter

- **When you need the result back.** Events are fire-and-forget; the emitter does not see listener return values. If A calls B and needs B's answer, that is a function call or a promise, not an event.
- **Across processes or machines.** \`EventEmitter\` is in-memory, single-process. For that you need a message queue / broker (Module 6/7) or a channel layer.
- **For a strict request/response with one handler.** That is just a method. Reach for events when there are *multiple, independent* reactions to one occurrence, or when you want the producer not to know who is listening.`,

    contentHi: `## Observer pattern, built in

\`EventEmitter\` (\`node:events\` se) Node ka publish/subscribe implementation hai: ek object event name -> listener functions ki list ka ek map rakhta hai, \`.emit(name, ...args)\` us name ke har listener ko un args ke saath call karta hai, aur \`.on(name, fn)\` / \`.off(name, fn)\` list manage karte hain. Ye standard library ki reedh hai — \`http.Server\`, sockets, streams, \`process\` object, child processes sab emitters hain.

### Core API

- **\`.on(name, fn)\`** — subscribe; har matching \`emit\` par fire.
- **\`.once(name, fn)\`** — theek ek emit ke liye subscribe, phir auto-remove.
- **\`.off(name, fn)\`** — unsubscribe. **Wahi function reference chahiye** jo aapne \`.on\` ko diya — ek inline arrow jise aapne rakha nahi wo hataaya nahi jaa sakta.
- **\`.emit(name, ...args)\`** — har listener ko \`name\` ke liye, subscription order mein, **synchronously** call karta hai.
- **\`.removeAllListeners([name])\`**, **\`.listenerCount(name)\`**, **\`.eventNames()\`**.

### \`emit\` synchronous hai

Jab aap \`.emit\` call karte ho, har listener \`.emit\` ke return hone se *pehle* chalta hai. Consequences: ek slow synchronous listener emitter ko block karta hai; agar ek listener \`throw\` karta hai, ye \`.emit\` se propagate hota hai (aur baad ke listeners nahi chalte); ek \`async\` listener ek promise return karta hai jise \`emit\` ignore karta hai — usme ek rejection ek \`unhandledRejection\` ban jaati hai.

## \`'error'\` event

\`'error'\` wo ek event name hai jiske built-in semantics hain: **agar ek \`EventEmitter\` \`'error'\` emit karta hai aur koi \`'error'\` listener nahi hai, error throw hoti hai** — aur kyunki ye \`.emit\` ke andar se throw hoti hai, aam taur par ek I/O callback se asynchronously, iske aas-paas koi \`try/catch\` nahi hai aur ye process crash karti hai.

Isliye: **har long-lived emitter jise aap banaate ya consume karte ho use ek \`'error'\` listener chahiye.** Streams, sockets, servers, database clients — ek lagao, bhale ye sirf log kare.

## Leak warning

Default se ek emitter \`stderr\` ko warn karta hai jab ek **single event** **10 se zyaada** listeners jama karta hai. Ye ek hard cap nahi hai — ye sabse aam bug ke liye ek heuristic hai: ek per-request ya per-connection code path mein subscribe karna aur kabhi unsubscribe nahi karna. Jab aap ise dekho:

1. **Wo \`.on()\` dhoondho jo baar-baar chalta hai** bina matching \`.off()\` ke. Leak fix karo.
2. Agar count genuinely legitimate hai, ise raise karo: \`emitter.setMaxListeners(50)\`.

Leak avoid karne ka sabse saaf tarika subscription ki lifetime ko kisi cheez se baandhna hai: \`emitter.on(name, fn, { signal })\` \`fn\` ko hataata hai jab \`signal\` abort ho.

## Promise aur async-iterator bridges

- **\`events.once(emitter, name, { signal })\`** -> ek promise jo agle \`name\` emit ke args array ke saath resolve hota hai, ya **reject hota hai agar emitter pehle \`'error'\` emit kare**.
- **\`events.on(emitter, name, { signal })\`** -> ek **async iterator** jo har emit ke liye \`[...args]\` yield karta hai.

## \`EventEmitter\` vs \`EventTarget\`

Node mein web-standard **\`EventTarget\`** / \`Event\` bhi hai (jo \`AbortSignal\`, \`fetch\` bodies istemal karte hain). \`EventEmitter\`: \`.on()\`, koi bhi args, \`'error'\` unhandled -> throws, 10 par warns, Node core. \`EventTarget\`: \`.addEventListener()\`, ek \`Event\` object, koi special \`'error'\`, koi warning, web APIs. Node-internal pub/sub ke liye \`EventEmitter\`; web compatibility ya \`AbortSignal\` ke liye \`EventTarget\`.

## Kab EventEmitter NAHI

- **Jab aapko result wapas chahiye.** Events fire-and-forget hain.
- **Processes ya machines ke aar-paar.** \`EventEmitter\` in-memory, single-process hai. Iske liye ek message queue / broker chahiye.
- **Ek strict request/response ke liye ek handler ke saath.** Wo bस ek method hai. Events tab istemal karo jab ek occurrence par *kई, independent* reactions hon.`,

    examples: [
      {
        title: 'on fires every time, once fires exactly once, off needs the same reference',
        titleHi: 'on har baar fire, once theek ek baar, off ko wahi reference chahiye',
        code: `import { EventEmitter } from "node:events";
const bus = new EventEmitter();

bus.on("tick", (n) => console.log("A:", n));
const b = (n) => console.log("B:", n);
bus.once("tick", b);

bus.emit("tick", 1);   // A:1  B:1
bus.emit("tick", 2);   // A:2  (B was removed after firing once)

bus.off("tick", b);    // no-op — b is already gone
bus.emit("tick", 3);   // A:3`,
        codeJs: `import { EventEmitter } from "node:events";
const bus = new EventEmitter();

const a = (n) => console.log("A:", n);
const b = (n) => console.log("B (once):", n);

bus.on("tick", a);      // permanent subscriber
bus.once("tick", b);    // one-shot subscriber

bus.emit("tick", 1);    // -> "A: 1"  then  "B (once): 1"
bus.emit("tick", 2);    // -> "A: 2"   (b auto-removed after the first emit)

// to remove a permanent listener you need the SAME function reference:
bus.off("tick", a);
bus.emit("tick", 3);    // -> (nothing) — a is gone too

// this would NOT work — a fresh arrow is a different reference:
// bus.on("tick", (n) => console.log(n));
// bus.off("tick", (n) => console.log(n));   // removes nothing`,
        codeTs: `import { EventEmitter } from "node:events";
const bus = new EventEmitter();

const a = (n: number) => console.log("A:", n);
const b = (n: number) => console.log("B (once):", n);

bus.on("tick", a);
bus.once("tick", b);

bus.emit("tick", 1);
bus.emit("tick", 2);

bus.off("tick", a);
bus.emit("tick", 3);`,
        output: `A: 1
B (once): 1
A: 2
(nothing after off)

on() stays subscribed until removed; once() removes itself after the
first emit; off() only works when passed the exact function reference
that was registered.`,
        explain: 'on and once differ only in lifetime — once wraps your listener so it removes itself after running. off (removeListener) does an identity comparison against the stored listeners, so you must hand it the same function object you gave on; an equivalent-looking inline arrow will not match and silently removes nothing, which is a common source of "I called off but it still fires" and of listener leaks.',
        explainHi: 'on aur once sirf lifetime mein alag hain — once aapke listener ko wrap karta hai taaki ye chalne ke baad khud ko hata le. off stored listeners ke against ek identity comparison karta hai, to aapko wahi function object dena hoga jo aapne on ko diya; ek equivalent-dikhta inline arrow match nahi karega aur chupchaap kuch nahi hataata.',
      },
      {
        title: "An unhandled 'error' event throws; a handled one does not",
        titleHi: "Ek unhandled 'error' event throw karta hai; ek handled nahi",
        code: `import { EventEmitter } from "node:events";

// no 'error' listener -> emit('error') throws
try {
  new EventEmitter().emit("error", new Error("boom"));
} catch (e) {
  console.log("threw:", e.message);
}

// with an 'error' listener -> it is just a normal event
const safe = new EventEmitter();
safe.on("error", (e) => console.log("handled:", e.message));
safe.emit("error", new Error("boom"));
console.log("still running");`,
        codeJs: `import { EventEmitter } from "node:events";

// CASE 1: no 'error' listener — Node re-throws the error object
try {
  const e1 = new EventEmitter();
  e1.emit("error", new Error("boom"));
} catch (err) {
  console.log("threw:", err.message);   // "threw: boom"
}
// In real code this throw usually comes from an async I/O callback, so
// there is no try/catch around it and it becomes uncaughtException -> crash.

// CASE 2: with an 'error' listener — treated as an ordinary event
const e2 = new EventEmitter();
e2.on("error", (err) => console.log("handled:", err.message));
e2.emit("error", new Error("boom"));   // "handled: boom"
console.log("still running");           // reached

// => attach an 'error' listener to every stream, socket, server, db client.`,
        codeTs: `import { EventEmitter } from "node:events";

try {
  const e1 = new EventEmitter();
  e1.emit("error", new Error("boom"));
} catch (err) {
  console.log("threw:", (err as Error).message);
}

const e2 = new EventEmitter();
e2.on("error", (err: Error) => console.log("handled:", err.message));
e2.emit("error", new Error("boom"));
console.log("still running");`,
        output: `threw: boom
handled: boom
still running

Emitting 'error' with no listener re-throws the error. Once an 'error'
listener exists, the same emit is just a normal event and execution
continues.`,
        explain: "'error' is the one event with special semantics: an EventEmitter that emits it with no registered 'error' listener re-throws the value. Because emit is usually called from deep inside an async callback, that throw is not catchable by your code and surfaces as uncaughtException, crashing the process. The rule is absolute: attach an 'error' listener to every long-lived emitter — streams, sockets, servers, DB clients — even one that only logs.",
        explainHi: "'error' wo ek event hai jiske special semantics hain: ek EventEmitter jo ise bina ek registered 'error' listener ke emit karta hai value ko re-throw karta hai. Kyunki emit aam taur par ek async callback ke andar se call hota hai, wo throw aapke code se catchable nahi hai aur uncaughtException ban jaata hai. Niyam absolute hai: har long-lived emitter par ek 'error' listener lagao.",
      },
      {
        title: 'events.once bridges an event to a promise; the leak warning at 11',
        titleHi: 'events.once ek event ko promise se bridge karta hai; 11 par leak warning',
        code: `import { EventEmitter, once } from "node:events";
const worker = new EventEmitter();

setTimeout(() => worker.emit("done", { rows: 5 }), 10);
const [result] = await once(worker, "done");
console.log("worker finished:", result);

const leaky = new EventEmitter();
for (let i = 0; i < 11; i++) leaky.on("cfg", () => {});
console.log("listeners on cfg:", leaky.listenerCount("cfg"));`,
        codeJs: `import { EventEmitter, once } from "node:events";

// BRIDGE: turn "the next 'done' event" into an awaitable
const worker = new EventEmitter();
setTimeout(() => worker.emit("done", { rows: 5 }), 10);

const [result] = await once(worker, "done");   // resolves with the emit args array
console.log("worker finished:", result);        // { rows: 5 }
// once() also rejects if the emitter emits 'error' before 'done'

// LEAK SIGNAL: 11 listeners on one event prints a warning to stderr
const leaky = new EventEmitter();
for (let i = 0; i < 11; i++) {
  leaky.on("cfg", () => {});    // imagine this runs once per incoming connection
}
console.log("listeners on cfg:", leaky.listenerCount("cfg"));   // 11
// stderr: MaxListenersExceededWarning: Possible EventEmitter memory leak detected.`,
        codeTs: `import { EventEmitter, once } from "node:events";

const worker = new EventEmitter();
setTimeout(() => worker.emit("done", { rows: 5 }), 10);

const [result] = (await once(worker, "done")) as [{ rows: number }];
console.log("worker finished:", result);

const leaky = new EventEmitter();
for (let i = 0; i < 11; i++) leaky.on("cfg", () => {});
console.log("listeners on cfg:", leaky.listenerCount("cfg"));`,
        output: `worker finished: { rows: 5 }
listeners on cfg: 11
(node:NNNNN) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 cfg listeners added to [EventEmitter]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit

events.once turned the one-shot 'done' event into a value you can
await. Adding an 11th listener to one event name triggered Node's leak
heuristic on stderr.`,
        explain: "events.once(emitter, name) is the clean bridge from a one-time event to async/await — it resolves with the emit's arguments and rejects on 'error', so you get normal try/catch flow. The MaxListenersExceededWarning at 11 listeners on a single event is Node telling you that a subscription is probably running in a loop or a per-request path without a matching removal; treat it as a leak to find, not a number to bump.",
        explainHi: "events.once(emitter, name) ek one-time event se async/await tak ka saaf bridge hai — ye emit ke arguments ke saath resolve hota hai aur 'error' par reject karta hai. Ek single event par 11 listeners par MaxListenersExceededWarning Node aapko bata raha hai ki ek subscription shaayad ek loop ya per-request path mein bina matching removal ke chal raha hai; ise dhoondhne ke liye ek leak samjho.",
      },
    ],

    mistakes: [
      {
        wrong: `function handleConnection(socket) {
  config.on("change", (cfg) => socket.write(serialize(cfg)));  // new listener per connection
  // ...no config.off("change", ...) when the socket closes
}
// after 10k connections: 10k listeners on 'change', memory climbing, emit getting slower`,
        right: `function handleConnection(socket) {
  const onChange = (cfg) => socket.write(serialize(cfg));
  config.on("change", onChange);
  socket.once("close", () => config.off("change", onChange));  // clean up

  // or tie it to an abort signal:
  // const ac = new AbortController();
  // config.on("change", onChange, { signal: ac.signal });
  // socket.once("close", () => ac.abort());
}`,
        why: 'Subscribing inside a per-connection or per-request handler and never unsubscribing is the classic EventEmitter leak. Every connection adds a listener that captures that connection\'s closure (the socket, any request state), and nothing removes it when the connection ends, so the listener array and all that captured memory grow for the life of the process. emit also gets linearly slower as the array grows. The fix is to pair every on with an off keyed to the subscriber\'s lifetime — the socket\'s close event, or an AbortSignal you abort on cleanup.',
        whyHi: 'Ek per-connection ya per-request handler ke andar subscribe karna aur kabhi unsubscribe nahi karna classic EventEmitter leak hai. Har connection ek listener add karta hai jo us connection ka closure capture karta hai, aur kuch ise nahi hataata jab connection khatam ho. emit bhi linearly slow ho jaata hai. Fix har on ko ek off ke saath pair karna hai jo subscriber ki lifetime se keyed ho.',
      },
      {
        wrong: `const stream = fs.createReadStream("big.csv");
stream.on("data", (chunk) => process(chunk));
stream.on("end", () => done());
// no 'error' listener — a permission error or a mid-read failure throws and crashes`,
        right: `const stream = fs.createReadStream("big.csv");
stream.on("data", (chunk) => process(chunk));
stream.on("end", () => done());
stream.on("error", (err) => {
  log.error({ err }, "read failed");
  cleanup();
});
// or use stream/promises pipeline(), which rejects on error instead of throwing`,
        why: 'A readable stream is an EventEmitter, and if it emits error with no error listener the error is re-thrown from inside an async callback and crashes the process via uncaughtException. This is easy to miss because the happy path (data, end) works perfectly in testing; the crash only shows up when a file is missing, permissions change, a disk fills, or a network stream drops mid-transfer. Every stream, socket, and server needs an error listener. Using stream.pipeline (or the promise version) handles this for you by turning stream errors into a rejected promise.',
        whyHi: 'Ek readable stream ek EventEmitter hai, aur agar ye bina ek error listener ke error emit kare wo error ek async callback ke andar se re-throw hoti hai aur process crash karti hai. Ise miss karna aasaan hai kyunki happy path testing mein perfectly kaam karta hai; crash sirf tab dikhta hai jab ek file missing ho, permissions badlein, disk bhar jaaye. Har stream, socket, server ko ek error listener chahiye.',
      },
      {
        wrong: `emitter.on("job", async (job) => {
  const result = await runJob(job);   // if this rejects -> unhandledRejection
  return result;                       // emit() ignores this return value entirely
});
const output = emitter.emit("job", job);   // output is a boolean (had listeners?), NOT the result`,
        right: `// if you need the result, do not use an event — call the function:
const result = await runJob(job);

// if you genuinely want fan-out AND must handle async listener failures:
emitter.on("job", (job) => {
  runJob(job).catch((err) => log.error({ err, job }, "job listener failed"));
});`,
        why: 'emit calls listeners synchronously and ignores whatever they return, including a promise. So an async listener that throws produces an unhandledRejection that emit cannot see, and emit\'s own return value is just a boolean saying whether any listener was registered — never the listener\'s result. Events are one-way notifications. When you need a value back, that is a function call or a promise. When you do want fan-out but listeners are async, each listener must catch its own rejection, because the emitter will not.',
        whyHi: 'emit listeners ko synchronously call karta hai aur wo jo bhi return karte hain use ignore karta hai, ek promise samet. To ek async listener jo throw karta hai ek unhandledRejection produce karta hai jise emit dekh nahi sakta, aur emit ka apna return value sirf ek boolean hai. Events one-way notifications hain. Jab aapko ek value wapas chahiye, wo ek function call ya ek promise hai.',
      },
    ],

    realWorld: [
      {
        en: '**A domain event bus** where `orderService.emit("order:paid", order)` fans out to an email listener, an analytics listener, and an inventory listener — each independent, each free to fail without breaking the others, and the order service knowing none of them.',
        hi: '**Ek domain event bus** jahaan `orderService.emit("order:paid", order)` ek email listener, ek analytics listener, aur ek inventory listener ko fan out karta hai — har ek independent.',
      },
      {
        en: '**`await once(server, "listening")` in the app bootstrap** and `await once(worker, "message")` to collect a worker-thread result — event-to-promise bridges that keep the startup and job code linear instead of nested callbacks.',
        hi: '**App bootstrap mein `await once(server, "listening")`** aur ek worker-thread result collect karne ke liye `await once(worker, "message")` — event-to-promise bridges.',
      },
      {
        en: '**Every `on()` in the connection handler registered with `{ signal: req.signal }`** so when the request ends, all its listeners are removed in one `abort()` and the `MaxListenersExceededWarning` that used to appear under load is gone.',
        hi: '**Connection handler mein har `on()` `{ signal: req.signal }` ke saath registered** to jab request khatam ho, iske saare listeners ek `abort()` mein hat jaate hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is special about the `error` event on an EventEmitter, and why does it matter?',
        qHi: 'Ek EventEmitter par `error` event mein kya special hai, aur ye kyun maayne rakhta hai?',
        a: 'error is the only event name that EventEmitter treats specially. If an emitter emits error and there is no listener registered for error, Node re-throws the error value instead of silently dropping it. The important consequence is where that throw happens: emit on a stream, socket, or server is almost always called from inside an asynchronous I/O callback, so there is no surrounding try/catch in your code, and the throw propagates to uncaughtException and crashes the process. The happy path hides this — data and end and finish all work fine in testing — so the missing error listener only bites in production when a file is absent, permissions change, a socket resets, or a disk fills. The rule is to attach an error listener to every long-lived emitter you create or consume, even if it only logs. If you want to observe error events for logging without suppressing the default throw, subscribe with the events.errorMonitor symbol instead of the string. And when you build your own emitter that can fail, emit an error event rather than throwing synchronously from inside a listener.',
        aHi: 'error wo ekmatra event name hai jise EventEmitter specially treat karta hai. Agar ek emitter error emit karta hai aur error ke liye koi listener registered nahi hai, Node error value ko chupchaap drop karne ke bajaye re-throw karta hai. Mahatvapoorna consequence ye hai ki wo throw kahaan hota hai: ek stream, socket, ya server par emit lagbhag hamesha ek asynchronous I/O callback ke andar se call hota hai, to aapke code mein koi surrounding try/catch nahi hai, aur throw uncaughtException tak propagate hota hai aur process crash karta hai. Happy path ise chhupata hai. Niyam har long-lived emitter par ek error listener lagana hai.',
      },
      {
        q: 'You see `MaxListenersExceededWarning` in production logs. What does it mean and how do you respond?',
        qHi: 'Aap production logs mein `MaxListenersExceededWarning` dekhte ho. Iska kya matlab hai aur aap kaise respond karte ho?',
        a: 'Node prints that warning to stderr when a single event name on one emitter accumulates more than ten listeners, which is the default threshold. It is not a hard limit — the eleventh listener still fires — it is a heuristic for the most common EventEmitter bug: code that subscribes in a repeated path, typically per request or per connection or in a loop, and never unsubscribes. Each of those listeners is a closure that captures request or connection state, so the listener array and all that captured memory grow for the lifetime of the process, and emit gets linearly slower as the array grows. My first response is to treat it as a real leak: find the on call that runs repeatedly and check whether there is a matching off tied to the subscriber going away — the socket close event, the request finishing, an AbortSignal aborting. The cleanest fix is to register with the signal option so the listener is removed automatically when the request\'s AbortSignal fires. Only if the count is genuinely legitimate — a fixed known set of plugins, say twenty — do I raise the threshold with setMaxListeners on that specific emitter, never globally and never as a reflex to silence the warning.',
        aHi: 'Node wo warning stderr ko print karta hai jab ek emitter par ek single event name das se zyaada listeners jama karta hai. Ye ek hard limit nahi hai — gyaarahvaan listener bhi fire hota hai — ye sabse aam EventEmitter bug ke liye ek heuristic hai: code jo ek repeated path mein subscribe karta hai, aam taur par prati request ya prati connection, aur kabhi unsubscribe nahi karta. Un listeners mein se har ek ek closure hai jo request ya connection state capture karta hai. Mera pehla response ise ek real leak samajhna hai: wo on call dhoondho jo baar-baar chalta hai aur check karo ki ek matching off hai ya nahi. Sabse saaf fix signal option ke saath register karna hai. Sirf agar count genuinely legitimate hai, main us specific emitter par setMaxListeners se threshold raise karta hoon.',
      },
    ],

    exercises: [
      {
        task: 'Build a tiny `TypedBus` class wrapping an `EventEmitter` with `on(event, fn)` returning an unsubscribe function (calling it does `emitter.off(event, fn)`). Prove it works: subscribe, emit (handler runs), call the returned unsubscribe, emit again (handler does NOT run). This is the pattern that makes leaks hard to write.',
        taskHi: 'Ek chhoti `TypedBus` class banao jo ek `EventEmitter` wrap karti hai jismein `on(event, fn)` ek unsubscribe function return karta hai. Saabit karo: subscribe, emit (handler chalta hai), unsubscribe call karo, phir emit (handler NAHI chalta).',
        hint: '`on(event, fn) { this.#e.on(event, fn); return () => this.#e.off(event, fn); }`. The caller stores the returned function and calls it in their cleanup.',
        hintHi: '`on(event, fn) { this.#e.on(event, fn); return () => this.#e.off(event, fn); }`. Caller returned function store karta hai aur apne cleanup mein call karta hai.',
      },
      {
        task: 'Write `collect(emitter, event, count, { signal })` using `events.on` (the async iterator) that resolves to an array of the first `count` payloads emitted for `event`, or rejects if `signal` aborts first. Test with an emitter that emits `"x"` every 5ms and `count = 3`; assert you get exactly 3 values and the iteration stops after that.',
        taskHi: '`collect(emitter, event, count, { signal })` likho `events.on` istemal karke jo pehle `count` payloads ke array ke saath resolve hota hai, ya `signal` abort hone par reject. Test: har 5ms `"x"` emit, `count = 3`, assert theek 3 values.',
        hint: '`for await (const [payload] of on(emitter, event, { signal })) { out.push(payload); if (out.length === count) break; }` then `return out`. The `break` stops the iterator and removes the internal listener.',
        hintHi: '`for await (const [payload] of on(emitter, event, { signal })) { out.push(payload); if (out.length === count) break; }` phir `return out`. `break` iterator rokta hai.',
      },
      {
        task: 'Demonstrate the synchronous nature of `emit`. Write code that logs `"1"`, registers a listener that logs `"2"` AND does a `setTimeout(() => log "4", 0)`, then `emit`s, then logs `"3"`. Assert the console order is `1, 2, 3, 4` — proving the listener body ran synchronously inside `emit` but its deferred work ran later.',
        taskHi: '`emit` ki synchronous nature dikhaao. Code likho jo `"1"` log karta hai, ek listener register karta hai jo `"2"` log karta hai AUR ek `setTimeout(() => log "4", 0)` karta hai, phir `emit`, phir `"3"` log. Assert order `1, 2, 3, 4`.',
        hint: 'The listener runs to completion (logging 2, scheduling the timer) before `emit` returns, so 3 logs next; the timer callback (4) runs on a later tick.',
        hintHi: 'Listener poora chalta hai (2 log, timer schedule) `emit` ke return se pehle, to 3 agla log hota hai; timer callback (4) ek baad ke tick par.',
      },
    ],

    keyTakeaways: [
      '`EventEmitter` (`node:events`) = built-in pub/sub: `name -> [listeners]`. `.on(name, fn)` (every emit), `.once(name, fn)` (one then auto-remove), `.off(name, fn)` (needs the SAME function reference — an inline arrow you didn\'t keep can\'t be removed), `.emit(name, ...args)` (calls all listeners in order). `http.Server`, sockets, streams, `process`, child processes are all emitters.',
      '`.emit()` is SYNCHRONOUS — every listener runs before `emit` returns. A slow sync listener blocks; a `throw` propagates out of `emit` and skips later listeners; an `async` listener returns a promise `emit` IGNORES (a rejection -> `unhandledRejection`).',
      "THE `'error'` EVENT IS SPECIAL: emitting `'error'` with NO `'error'` listener RE-THROWS the value — and since `emit` is usually called from an async I/O callback, it becomes `uncaughtException` and CRASHES the process. Attach an `'error'` listener to EVERY long-lived emitter (streams, sockets, servers, DB clients), even one that just logs. `events.errorMonitor` observes without counting as handled.",
      '`MaxListenersExceededWarning` at >10 listeners on one event = a heuristic for the #1 bug: subscribing in a per-request/per-connection/loop path with no matching `.off()`. FIND the leak; only `setMaxListeners(n)` if the count is genuinely legitimate.',
      'Tie a subscription\'s lifetime to something: `emitter.on(name, fn, { signal })` removes `fn` when `signal` aborts — wire the request\'s `AbortSignal` and listeners clean up automatically. Or pair `.on()` with `.off()` on `socket.once("close", ...)`.',
      'BRIDGES: `events.once(emitter, name, { signal })` -> a promise resolving with the emit args array, REJECTING if `\'error\'` fires first (wait for `"listening"`, a worker `"message"`). `events.on(emitter, name, { signal })` -> an async iterator you `for await...of` (event stream + clean stop).',
      '`EventEmitter` vs `EventTarget`: `.on()` + any args + `\'error\'`-throws + 10-listener warning + Node core, VS `.addEventListener()` + one `Event` object + no special `error` + no warning + web-standard (`AbortSignal`, `fetch`). Node pub/sub -> `EventEmitter`; web compat -> `EventTarget`.',
      "DON'T use an EventEmitter when you need the result back (that's a function/promise — `emit` returns a bool, ignores listener returns), across processes/machines (it's in-memory single-process — use a queue/broker), or for a strict 1-handler request/response (just a method). Use events for MULTIPLE independent reactions to one occurrence.",
    ],
    keyTakeawaysHi: [
      '`EventEmitter` (`node:events`) = built-in pub/sub. `.on(name, fn)` (har emit), `.once(name, fn)` (ek phir auto-remove), `.off(name, fn)` (WAHI function reference chahiye), `.emit(name, ...args)`. `http.Server`, sockets, streams, `process` sab emitters hain.',
      '`.emit()` SYNCHRONOUS hai — har listener `emit` ke return se pehle chalta hai. Ek `throw` `emit` se propagate hota hai aur baad ke listeners skip; ek `async` listener ek promise return karta hai jise `emit` IGNORE karta hai (rejection -> `unhandledRejection`).',
      "`'error'` EVENT SPECIAL HAI: `'error'` ko BINA ek `'error'` listener ke emit karna value RE-THROW karta hai — aur kyunki `emit` aam taur par ek async I/O callback se call hota hai, ye `uncaughtException` ban jaata hai aur process CRASH karta hai. HAR long-lived emitter par ek `'error'` listener lagao.",
      '>10 listeners par `MaxListenersExceededWarning` = #1 bug ke liye ek heuristic: ek per-request/per-connection/loop path mein subscribe karna bina matching `.off()`. Leak DHOONDHO.',
      'Ek subscription ki lifetime ko kisi cheez se baandho: `emitter.on(name, fn, { signal })` `fn` ko hataata hai jab `signal` abort ho. Ya `.on()` ko `socket.once("close", ...)` par `.off()` ke saath pair karo.',
      'BRIDGES: `events.once(emitter, name)` -> ek promise jo emit args ke saath resolve, `\'error\'` pehle fire hone par REJECT. `events.on(emitter, name)` -> ek async iterator jise aap `for await...of` karte ho.',
      '`EventEmitter` vs `EventTarget`: `.on()` + koi bhi args + `\'error\'`-throws + Node core, VS `.addEventListener()` + ek `Event` + koi special `error` + web-standard. Node pub/sub -> `EventEmitter`.',
      "EventEmitter NAHI jab aapko result wapas chahiye (wo ek function/promise hai), processes/machines ke aar-paar (in-memory single-process — ek queue/broker), ya ek strict 1-handler request/response ke liye. Events ek occurrence par KAI independent reactions ke liye.",
    ],
  },
];
