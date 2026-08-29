/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 13.
 *
 * uncaughtException / unhandledRejection crash safety: what happens when
 * an error occurs that no try/catch anywhere in the application was
 * positioned to catch — a bug in a rarely-hit code path, an error thrown
 * inside a callback or timer with no surrounding try/catch, a Promise that
 * rejects with nothing ever attached to handle it. Broken example: no
 * process-level handling at all — an uncaught exception crashes the whole
 * process taking down every in-flight request with it, while an unhandled
 * rejection (depending on Node.js version) can silently leave the
 * application in an unknown, possibly corrupted state without even
 * crashing. Fixed by registering process.on("uncaughtException", ...) and
 * process.on("unhandledRejection", ...) as a deliberate LAST-RESORT safety
 * net — logging the error with full context, then exiting cleanly rather
 * than attempting to keep running in a state that can no longer be
 * trusted, relying on this course's earlier process-manager lesson (PM2,
 * clustering, container restart policies) to bring a fresh, healthy
 * process back up automatically.
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

export const NODE_MODULE_7_PART13: CourseLesson[] = [
  {
    slug: 'crash-safety-uncaught-exceptions',
    title: 'Crash Safety: Handling uncaughtException and unhandledRejection',
    titleHi: 'Crash Safety: uncaughtException Aur unhandledRejection Sambhaalna',
    description: 'A single bug in a rarely-used code path throws an error nobody wrote a try/catch for — and instead of failing one request, it silently corrupts the entire process, or crashes it and takes every other in-flight request down with it.',
    descriptionHi: 'Ek kam-istemal hote code path mein ek akela bug ek error throw karta hai jiske liye kisi ne try/catch nahi likha tha — aur ek request fail hone ke bajaye, ye chupke se poore process ko corrupt kar deta hai, ya crash karta hai aur har doosri in-flight request ko apne saath le jaata hai.',
    difficulty: 'HARD',
    duration: 20,
    order: 13,

    analogy: {
      en: '**An aircraft\'s strict protocol the instant a fire warning light illuminates mid-flight, versus a pilot who simply ignores it and keeps flying normally, hoping it resolves itself.** A fire warning is not treated as routine turbulence to power through — the moment it appears, pilots follow a fixed, non-negotiable checklist: they do not continue the flight plan as if nothing happened, hoping the warning was a false alarm, because doing so risks discovering, at cruising altitude with nowhere to go, that the warning was entirely real and the situation has now worsened far beyond what it would have been if addressed immediately. Instead, the checklist calls for declaring an emergency and landing at the nearest suitable airport as quickly as safely possible — deliberately abandoning the original flight plan entirely, not because landing early is the ideal outcome, but because continuing to fly in a state where a serious, unexplained warning has fired is far riskier than the inconvenience of an unscheduled landing. Critically, this is not the end of the story: ground crews inspect the aircraft, identify and fix the actual problem, and only then does the aircraft — now genuinely known to be safe again — return to service, typically on a later flight, rather than the original crew trying to somehow "push through" and keep the original aircraft flying in a condition nobody can vouch for. A server that crashes deliberately and safely the moment it encounters a genuinely unexpected, uncaught error, rather than trying to keep running in an unknown state, is following the exact same principle: stop immediately, let a fresh, verified-healthy instance take over, rather than gambling that continuing to run is safe when there is no way to actually know that it is.',
      hi: '**Ek aircraft ka sakht protocol jis pal ek fire warning light beech-udaan mein jal uthti hai, versus ek pilot jo bas ise nazarandaaz kar deta hai aur normal taur par udta rehta hai, umeed karte hue ki ye khud theek ho jaayega.** Ek fire warning ko routine turbulence ki tarah nahi liya jaata jise jhelte hue aage badha jaaye — jis pal ye aati hai, pilots ek tay, na-badalne-laayak checklist ka palan karte hain: wo flight plan ko aise jaari nahi rakhte jaise kuch hua hi na ho, umeed karte hue ki warning ek jhoothi alarm thi, kyunki aisa karna khatra uthaata hai ki cruising altitude par, kahin jaane ki jagah bina, ye pata chale ki warning poori tarah sachi thi aur sthiti ab us se kaafi zyaada bigad chuki hai jitni turant sambhaalne par hoti. Iske bajaye, checklist ek emergency declare karne aur jitni jaldi surakshit ho sake sabse nazdeeki upyukt airport par utarne ki maang karti hai — jaan-boojhkar asli flight plan ko poori tarah chhodte hue, is liye nahi ki jaldi utarna aadarsh nateeja hai, balki isliye kyunki us sthiti mein udna jaari rakhna jahan ek gambhir, na-samjhi gayi warning aa chuki hai ek anusoochit-na-hui landing ki asuvidha se kaafi zyaada khatarnaak hai. Bahut zaruri, ye kahaani ka ant nahi hai: ground crews aircraft ki jaanch karte hain, asli samasya pehchaante aur theek karte hain, aur tabhi aircraft — ab sach mein surakshit maana gaya — sewa mein wapas aata hai, aam taur par ek baad ki flight par, asli crew ke kisi tarah "aage dhakelne" aur asli aircraft ko ek aisi sthiti mein udaate rehne ke bajaye jiski koi zamanat nahi de sakta. Ek server jo jaan-boojhkar aur surakshit taur par crash hota hai jis pal ye ek sach mein anapekshit, uncaught error se milta hai, ek anjaani sthiti mein chalte rehne ki koshish karne ke bajaye, bilkul wahi siddhaant ka palan kar raha hai: turant ruko, ek naya, verified-healthy instance ko sambhaalne do, ye jua khelne ke bajaye ki chalte rehna surakshit hai jab ye jaanne ka koi asli tarika hi nahi hai.',
    },

    simple: `**Start broken.** No process-level error handling at all:

\`\`\`js
const server = app.listen(3000);

// somewhere deep in the codebase, in a rarely-hit path:
function processRefund(order) {
  const refundAmount = order.payments[0].amount; // crashes if payments is empty
  return refundAmount;
}
\`\`\`

Under ordinary conditions, \`order.payments\` always has at least one entry, so this bug never surfaces. The day a genuinely unusual order comes through — one somehow created with an empty \`payments\` array, a state nobody anticipated — this line throws a \`TypeError\` that nothing in the codebase wraps in a \`try/catch\`, since nobody imagined this specific code path could fail. With no \`process.on("uncaughtException", ...)\` handler registered, Node.js's default behavior for an uncaught exception is to print the error to \`stderr\` and immediately terminate the entire process — not just the one request that triggered the bug, but every single other request currently being handled by that process, including completely unrelated ones that had nothing to do with the refund bug at all. Similarly, a Promise that rejects with no \`.catch()\` anywhere and no surrounding \`try/catch\` on its \`await\` produces an \`unhandledRejection\` — depending on the Node.js version, this can also terminate the process, or, in older versions, simply log a warning and leave the application silently continuing to run in a state where some operation failed with nobody ever finding out.

**The fix: a deliberate last-resort handler that logs, then exits cleanly**

\`\`\`js
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception, shutting down:", err);
  server.close(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10000).unref();
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection, shutting down:", reason);
  server.close(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10000).unref();
});
\`\`\`

\`\`\`ts
process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught exception, shutting down:", err);
  server.close(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10000).unref();
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled promise rejection, shutting down:", reason);
  server.close(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10000).unref();
});
\`\`\`

These handlers deliberately do NOT try to recover and keep the process running — the whole point is the opposite: once an error reaches this point, it means some code path failed in a way nobody anticipated or wrote explicit handling for, and the process's internal state (in-progress operations, partially-updated in-memory data, unknown side effects) can no longer be trusted to be consistent. Instead, the error is logged with full detail so it can be investigated later, \`server.close()\` stops accepting new connections while letting genuinely in-flight requests finish if they can, and \`process.exit(1)\` then shuts the process down entirely, following this course's earlier process-manager lesson: PM2, Docker's restart policy, or Kubernetes immediately notices the process has exited and starts a brand new, known-clean instance in its place. The brief \`setTimeout(..., 10000)\` acts as a hard backstop in case \`server.close()\`'s callback never fires for some reason, guaranteeing the process exits within 10 seconds regardless.`,

    simpleHi: `**Toote hue se shuru.** Bilkul koi process-level error handling nahi:

\`\`\`js
const server = app.listen(3000);

// codebase mein kahin gehraai mein, ek kam-istemal hote path mein:
function processRefund(order) {
  const refundAmount = order.payments[0].amount; // crash agar payments khaali hai
  return refundAmount;
}
\`\`\`

Aam sthiti mein, \`order.payments\` mein hamesha kam-se-kam ek entry hoti hai, isliye ye bug kabhi zaahir nahi hota. Jis din ek sach mein ajeeb order aata hai — ek jo kisi tarah ek khaali \`payments\` array ke saath banaaya gaya, ek sthiti jiski kisi ne bhi umeed nahi ki thi — ye line ek \`TypeError\` throw karti hai jise codebase mein kuch bhi \`try/catch\` mein wrap nahi karta, kyunki kisi ne bhi ye khaas code path fail ho sakta hai socha hi nahi tha. Bina kisi \`process.on("uncaughtException", ...)\` handler ke, ek uncaught exception ke liye Node.js ka default vyavhaar error ko \`stderr\` par print karna aur turant poore process ko khatam karna hai — sirf us ek request ko nahi jisne bug trigger kiya, balki us process dwara abhi handle ki jaa rahi har doosri request ko, un ke sameet jinka refund bug se bilkul koi lena-dena nahi tha. Isi tarah, ek Promise jo bina kahin \`.catch()\` ke aur uske \`await\` par koi aas-paas \`try/catch\` bina reject hota hai ek \`unhandledRejection\` paida karta hai — Node.js version ke aadhaar par, ye bhi process khatam kar sakta hai, ya, purane versions mein, bas ek warning log karta hai aur application ko chupke se ek aisi sthiti mein chalte rehne deta hai jahan koi operation fail hua par kisi ko kabhi pata hi nahi chala.

**Fix: ek jaan-boojhkar aakhri-upaay handler jo log karta hai, phir saaf tarike se exit hota hai**

\`\`\`js
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception, shutting down:", err);
  server.close(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10000).unref();
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection, shutting down:", reason);
  server.close(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10000).unref();
});
\`\`\`

\`\`\`ts
process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught exception, shutting down:", err);
  server.close(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10000).unref();
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled promise rejection, shutting down:", reason);
  server.close(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10000).unref();
});
\`\`\`

Ye handlers jaan-boojhkar recover karke process ko chalte rehne dene ki koshish NAHI karte — poora maqsad iske ulta hai: ek baar ek error yahan tak pahunch jaaye, iska matlab hai koi code path aise fail hua jiski kisi ne umeed nahi ki thi ya jiske liye explicit handling nahi likhi thi, aur process ki internal sthiti (chal rahe operations, aadhi-update-hui in-memory data, anjaane side effects) ab consistent hone ka bharosa nahi kiya jaa sakta. Iske bajaye, error ko poori detail ke saath log kiya jaata hai taaki baad mein jaancha jaa sake, \`server.close()\` nayi connections accept karna band karta hai jabki sach mein in-flight requests ko poora hone deta hai agar wo kar sakti hain, aur \`process.exit(1)\` phir process ko poori tarah band kar deta hai, is course ke pehle wale process-manager lesson ka palan karte hue: PM2, Docker ki restart policy, ya Kubernetes turant dekhta hai ki process khatam ho chuka hai aur uski jagah ek bilkul naya, jaana-pehchaana-saaf instance shuru karta hai. Chhota \`setTimeout(..., 10000)\` ek pakka backstop ki tarah kaam karta hai us sthiti mein jab \`server.close()\` ka callback kisi wajah se kabhi fire nahi hota, sunishchit karte hue ki process chahe kuch bhi ho 10 seconds ke andar exit hota hai.`,

    content: `## uncaughtException vs. unhandledRejection: two related but distinct events

\`\`\`
uncaughtException: a synchronous throw (or a callback-based async
error) that propagated all the way up without any try/catch
anywhere in its call chain catching it.

unhandledRejection: a Promise that rejected, with no .catch()
attached to it anywhere and no surrounding try/catch on whatever
awaited it.
\`\`\`

Both events represent the same underlying situation — an error occurred that no part of the application was positioned to specifically handle — but they arise from Node.js's two different error-propagation mechanisms. A traditional synchronous throw (or an error passed to a Node-style callback that nothing checks) that is never caught by any \`try/catch\` in its call stack fires \`uncaughtException\` on the \`process\` object as a genuine last resort. A rejected Promise that nothing ever attaches a \`.catch()\` to, and that is never \`await\`-ed inside a \`try/catch\`, fires \`unhandledRejection\` instead, since Promise rejections do not propagate through the same synchronous call stack a regular throw does. Registering handlers for both is necessary because modern Node.js codebases routinely contain both styles of code, and a gap in either one leaves that category of genuinely unexpected error completely unhandled.

## Why the correct response is to exit, never to "recover" and keep running

\`\`\`
Tempting but wrong:
process.on("uncaughtException", (err) => {
  console.error(err); // logged, but the process just keeps running
});
\`\`\`

It can be tempting to write a handler that simply logs the error and does nothing else, reasoning that this prevents the crash and keeps the server available. This is a serious mistake: by the time \`uncaughtException\` or \`unhandledRejection\` fires, something happened that no code anywhere was written to handle — which means the application's in-memory state may now be inconsistent in ways nobody can fully reason about. A half-completed operation may have left shared state (an in-memory cache, a counter, a lock) in an invalid condition; a module-level variable might be left in a state some other, unrelated request now silently depends on being correct. Continuing to serve new requests on top of this unknown, unverified state risks silently corrupting further work, sometimes in ways far harder to detect and debug than a clean, immediate crash would have been. Exiting the process entirely, and letting a supervisor start a completely fresh instance (following this course's earlier process-manager lesson), guarantees every subsequent request is served by a process in a known-good starting state — a strictly safer outcome than gambling on an unverified one.

## Graceful shutdown, not an abrupt kill, within the crash handler

\`\`\`js
process.on("uncaughtException", (err) => {
  console.error(err);
  server.close(() => process.exit(1)); // let in-flight requests finish
  setTimeout(() => process.exit(1), 10000).unref(); // but don't wait forever
});
\`\`\`

Simply calling \`process.exit(1)\` immediately inside the handler would abruptly terminate every currently in-flight request too, even ones entirely unrelated to whatever triggered the crash, denying them any response at all. Calling \`server.close()\` first tells the HTTP server to stop accepting brand-new connections while allowing requests already in progress a chance to finish and respond normally, then exiting once that finishes (or after a bounded timeout, in case something itself hangs during shutdown) — following the same graceful-shutdown principle this course's earlier lesson on health checks and graceful shutdown established for deliberate deploys, applied here to an unplanned, forced one instead.

## This is a last resort, not a substitute for handling errors properly elsewhere

\`\`\`js
// Still absolutely necessary — a crash handler is not a replacement:
app.get("/orders/:id", async (req, res, next) => {
  try {
    const order = await getOrder(req.params.id);
    res.json(order);
  } catch (err) {
    next(err); // handled here, specifically, with a clean response
  }
});
\`\`\`

Registering \`uncaughtException\` and \`unhandledRejection\` handlers does not reduce the importance of writing proper \`try/catch\` blocks, Express error-handling middleware, and specific error responses throughout the application — those remain the primary, correct way to handle errors that are anticipated as part of normal operation (a database query failing, a validation error, a downstream call timing out, per this course's earlier lessons). The process-level handlers exist specifically to catch the remaining, genuinely unanticipated cases that slip through everything else — a true last line of defense, not a shortcut that makes writing careful error handling elsewhere less necessary.`,

    contentHi: `## uncaughtException vs. unhandledRejection: do jude hue par alag events

\`\`\`
uncaughtException: ek synchronous throw (ya ek callback-based async
error) jo apni poori call chain mein kahin bhi kisi try/catch
dwara pakde bina bilkul oopar tak pahunch gayi.

unhandledRejection: ek Promise jo reject hua, kahin bhi koi
.catch() attach kiye bina aur jise await kiya us par koi aas-paas
try/catch bina.
\`\`\`

Dono events wahi underlying sthiti darshaate hain — ek error hua jise application ke kisi bhi hisse ne khaas taur par sambhaalne ke liye position nahi kiya tha — par ye Node.js ke do alag error-propagation mechanisms se aate hain. Ek paranaparik synchronous throw (ya ek Node-style callback ko diya gaya error jise kuch bhi check nahi karta) jise kabhi uski call stack mein kisi bhi \`try/catch\` dwara pakda nahi jaata ek sach mein aakhri-upaay ki tarah \`process\` object par \`uncaughtException\` fire karta hai. Ek reject hua Promise jise kahin \`.catch()\` attach nahi kiya jaata, aur jise kabhi ek \`try/catch\` ke andar \`await\` nahi kiya jaata, iske bajaye \`unhandledRejection\` fire karta hai, kyunki Promise rejections usi synchronous call stack se propagate nahi hote jaise ek regular throw hota hai. Dono ke liye handlers register karna zaruri hai kyunki modern Node.js codebases niyamit taur par dono style ka code rakhte hain, aur kisi ek mein bhi ek kami us category ki sach mein anapekshit error ko poori tarah bina-sambhaale chhod deti hai.

## Sahi jawaab exit karna kyun hai, "recover" karke chalte rehna kyun nahi

\`\`\`
Lubhaavana par galat:
process.on("uncaughtException", (err) => {
  console.error(err); // log hota hai, par process bas chalta rehta hai
});
\`\`\`

Ek aisa handler likhna lubhaavana ho sakta hai jo bas error log karta hai aur kuch aur nahi karta, ye soch kar ki ye crash rokta hai aur server ko upalabdh rakhta hai. Ye ek gambhir galti hai: jab tak \`uncaughtException\` ya \`unhandledRejection\` fire hota hai, kuch aisa hua hai jise kahin bhi kisi code ko sambhaalne ke liye nahi likha gaya tha — matlab application ki in-memory sthiti ab un tareekon se asangat ho sakti hai jinhe koi bhi poori tarah samajh nahi sakta. Ek aadhaa-poora operation shaayad shared state (ek in-memory cache, ek counter, ek lock) ko ek ashaant sthiti mein chhod chuka ho; ek module-level variable shaayad ek aisi sthiti mein reh gaya ho jispar koi doosri, na-judi request ab chupke se sahi hone par nirbhar hai. Is anjaani, na-verify hui sthiti ke oopar nayi requests serve karte rehna aur kaam ko chupke se corrupt karne ka khatra uthaata hai, kabhi-kabhi un tareekon se jo ek saaf, turant crash se pehchaanaana aur debug karna kaafi zyaada mushkil hote hain. Process ko poori tarah exit karna, aur ek supervisor ko ek bilkul naya instance shuru karne dena (is course ke pehle wale process-manager lesson ka palan karte hue), sunishchit karta hai ki har agli request ek jaani-pehchaani-achhi shuruaati sthiti wale process dwara serve hoti hai — ek na-verify hui sthiti par jua khelne se strictly zyaada surakshit nateeja.

## Crash handler ke andar graceful shutdown, ek achaanak kill nahi

\`\`\`js
process.on("uncaughtException", (err) => {
  console.error(err);
  server.close(() => process.exit(1)); // in-flight requests poori hone do
  setTimeout(() => process.exit(1), 10000).unref(); // par hamesha ke liye intezaar nahi
});
\`\`\`

Handler ke andar seedhe \`process.exit(1)\` call karna turant har abhi in-flight request ko bhi achaanak khatam kar dega, un ke sameet jinka crash trigger karne wali cheez se bilkul koi lena-dena nahi, unhe koi bhi response bina diye. Pehle \`server.close()\` call karna HTTP server ko bilkul nayi connections accept karna band karne ko kehta hai jabki pehle se chal rahi requests ko poora hone aur normal taur par jawaab dene ka mauka dete hue, phir ye poora hone ke baad (ya ek seemit timeout ke baad, us sthiti mein jab shutdown ke dauraan khud kuch atak jaaye) exit karta hai — is course ke pehle wale health checks aur graceful shutdown lesson ne jaan-boojhkar deploys ke liye jo siddhaant sthaapit kiya tha wahi yahan ek anayojit, majboori wale par lagu karte hue.

## Ye ek aakhri upaay hai, kahin aur sahi tarike se errors sambhaalne ka vikalp nahi

\`\`\`js
// Abhi bhi bilkul zaruri — ek crash handler ek vikalp nahi hai:
app.get("/orders/:id", async (req, res, next) => {
  try {
    const order = await getOrder(req.params.id);
    res.json(order);
  } catch (err) {
    next(err); // yahan, khaas taur par, ek saaf response ke saath sambhaala gaya
  }
});
\`\`\`

\`uncaughtException\` aur \`unhandledRejection\` handlers register karna poore application mein sahi \`try/catch\` blocks, Express error-handling middleware, aur khaas error responses likhne ki ahmiyat kam nahi karta — wo hi errors ko sambhaalne ka mukhya, sahi tarika bane rehte hain jinki normal operation ke hisse ke roop mein umeed ki jaati hai (ek database query fail hona, ek validation error, ek downstream call ka timeout hona, is course ke pehle wale lessons ke hisaab se). Process-level handlers khaas taur par un bachhe hue, sach mein anapekshit cases ko pakadne ke liye maujood hain jo baaki har cheez se guzar jaate hain — ek asli aakhri defense ki line, koi shortcut nahi jo kahin aur samajhdaari se error handling likhna kam zaruri banaaye.`,

    examples: [
      {
        title: 'Broken: no process-level handlers — a rare bug crashes everything',
        titleHi: 'Toota: koi process-level handlers nahi — ek durlabh bug sab kuch crash karta hai',
        code: `const server = app.listen(3000);

function processRefund(order) {
  return order.payments[0].amount; // throws if payments is empty
}
// no try/catch anywhere in this code path, no process-level handler`,
        codeJs: `const server = app.listen(3000);

function processRefund(order) {
  return order.payments[0].amount;
}

app.post("/refund/:orderId", async (req, res, next) => {
  const order = await getOrder(req.params.orderId);
  const amount = processRefund(order); // uncaught if payments is empty
  res.json({ refunded: amount });
});`,
        codeTs: `const server = app.listen(3000);

function processRefund(order: Order): number {
  return order.payments[0].amount;
}

app.post("/refund/:orderId", async (req: Request, res: Response): Promise<void> => {
  const order = await getOrder(req.params.orderId);
  const amount = processRefund(order);
  res.json({ refunded: amount });
});
// Correctly typed, completely valid TypeScript — the risk is a
// runtime data shape nobody anticipated, not a compile-time error.`,
        output: `Ordinary orders: works fine. One order with an empty payments
array: throws a TypeError with no handler in its call chain,
Node.js prints the error and terminates the entire process,
dropping every other in-flight request immediately.`,
        explain: 'With no process-level handler, Node.js\'s default behavior for a genuinely uncaught exception is to terminate the process outright, taking down every unrelated in-flight request with it.',
        explainHi: 'Bina kisi process-level handler ke, ek sach mein uncaught exception ke liye Node.js ka default vyavhaar process ko seedhe khatam karna hai, har na-judi in-flight request ko apne saath le jaate hue.',
      },
      {
        title: 'Fixed: a last-resort handler that logs and exits cleanly',
        titleHi: 'Theek: ek aakhri-upaay handler jo log karta hai aur saaf exit hota hai',
        code: `process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  server.close(() => process.exit(1));
  setTimeout(() => process.exit(1), 10000).unref();
});`,
        codeJs: `const server = app.listen(3000);

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception, shutting down:", err);
  server.close(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10000).unref();
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection, shutting down:", reason);
  server.close(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10000).unref();
});`,
        codeTs: `const server = app.listen(3000);

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught exception, shutting down:", err);
  server.close(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10000).unref();
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled rejection, shutting down:", reason);
  server.close(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10000).unref();
});`,
        outputJs: `The same rare bug still triggers the same underlying error, but now
it is logged clearly, in-flight requests get a chance to finish,
and the process exits cleanly for a process manager (PM2, Docker,
Kubernetes) to restart with a fresh, known-good instance.`,
        outputTs: `// Identical behaviour. Typing the handler parameters (Error,
// unknown) costs nothing and documents the shape of what each
// event actually delivers.`,
        explain: 'The handler does not attempt to recover — it logs for later investigation, finishes in-flight work where possible, and exits, trusting the process manager to bring up a clean replacement.',
        explainHi: 'Handler recover karne ki koshish nahi karta — ye baad ki jaanch ke liye log karta hai, jahan mumkin ho in-flight kaam poora karta hai, aur exit hota hai, process manager par bharosa karte hue ek saaf replacement laane ke liye.',
      },
      {
        title: 'unhandledRejection from a Promise nobody attached a .catch() to',
        titleHi: 'Ek Promise se \`unhandledRejection\` jise kisi ne \`.catch()\` nahi lagaaya',
        code: `sendAnalyticsEvent(userId, "page_view"); // returns a Promise, never awaited or caught
// if this rejects, nothing in the codebase ever finds out — until now`,
        codeJs: `function sendAnalyticsEvent(userId, eventName) {
  return fetch("https://analytics.example.com/track", {
    method: "POST",
    body: JSON.stringify({ userId, eventName }),
  });
}

app.get("/page", (req, res) => {
  sendAnalyticsEvent(req.user.id, "page_view"); // fire-and-forget, no .catch()
  res.render("page");
});
// if the analytics endpoint is down, this rejected promise becomes
// an unhandledRejection instead of silently vanishing`,
        codeTs: `function sendAnalyticsEvent(userId: string, eventName: string): Promise<Response> {
  return fetch("https://analytics.example.com/track", {
    method: "POST",
    body: JSON.stringify({ userId, eventName }),
  });
}

app.get("/page", (req: Request, res: Response): void => {
  sendAnalyticsEvent(req.user.id, "page_view");
  res.render("page");
});
// TypeScript does not flag an un-awaited Promise by default —
// the unhandledRejection handler is what actually surfaces this`,
        outputJs: `Previously: a failed analytics call vanished silently, nobody ever
knowing it failed. With the handler in place: it now surfaces as a
logged, visible unhandledRejection instead of a silent gap.`,
        outputTs: `// Identical behaviour. The correct long-term fix is adding
// .catch(err => console.error(err)) directly on this specific
// fire-and-forget call — the process-level handler is what
// caught this gap in the meantime.`,
        explain: 'A "fire-and-forget" Promise with no .catch() is exactly the kind of gap the unhandledRejection handler exists to surface — its presence is a signal to go add specific handling at the source, not just a safety net to lean on forever.',
        explainHi: 'Ek "fire-and-forget" Promise bina \`.catch()\` ke bilkul wahi tarah ka gap hai jise \`unhandledRejection\` handler zaahir karne ke liye maujood hai — iski maujoodgi source par khaas handling jodne jaane ka ek signal hai, hamesha ke liye tikne ke liye ek safety net nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `process.on("uncaughtException", (err) => {
  console.error(err);
  // no process.exit() — the process keeps running in an unknown state
});`,
        right: `process.on("uncaughtException", (err) => {
  console.error(err);
  server.close(() => process.exit(1));
  setTimeout(() => process.exit(1), 10000).unref();
});`,
        why: 'Continuing to run after a genuinely uncaught exception risks operating on top of corrupted or inconsistent in-memory state — exiting and letting a process manager start a fresh instance is the safer, correct response.',
        whyHi: 'Ek sach mein uncaught exception ke baad chalte rehna corrupt ya asangat in-memory sthiti ke oopar chalne ka khatra uthaata hai — exit karna aur process manager ko ek naya instance shuru karne dena zyaada surakshit, sahi jawaab hai.',
      },
      {
        wrong: `process.on("uncaughtException", (err) => {
  console.error(err);
  process.exit(1); // kills every in-flight request instantly, no chance to finish
});`,
        right: `process.on("uncaughtException", (err) => {
  console.error(err);
  server.close(() => process.exit(1)); // in-flight requests get a chance to finish first
  setTimeout(() => process.exit(1), 10000).unref();
});`,
        why: 'Exiting immediately without server.close() abruptly cuts off every currently in-flight request, including ones entirely unrelated to whatever triggered the crash, denying them any response at all.',
        whyHi: '\`server.close()\` ke bina turant exit hona har abhi in-flight request ko achaanak kaat deta hai, un ke sameet jinka crash trigger karne wali cheez se bilkul koi lena-dena nahi, unhe koi bhi response bina diye.',
      },
      {
        wrong: `// Relying only on process-level handlers, skipping try/catch elsewhere
app.get("/orders/:id", async (req, res) => {
  const order = await getOrder(req.params.id); // no try/catch — every error becomes a full crash
  res.json(order);
});`,
        right: `app.get("/orders/:id", async (req, res, next) => {
  try {
    const order = await getOrder(req.params.id);
    res.json(order);
  } catch (err) {
    next(err); // handled here specifically, with a clean, targeted response
  }
});`,
        why: 'Process-level handlers are a last resort for genuinely unanticipated errors, not a substitute for proper try/catch and error-handling middleware around expected failure points like database calls.',
        whyHi: 'Process-level handlers sach mein anapekshit errors ke liye ek aakhri upaay hain, database calls jaise anumaanit fail-hone ke points ke aas-paas sahi \`try/catch\` aur error-handling middleware ka vikalp nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Registering process.on("uncaughtException", ...) and process.on("unhandledRejection", ...) as a deliberate, logging, exit-on-error safety net is one of Node.js\'s own officially documented recommended production practices**, explicitly warning against attempting to resume normal operation afterward.',
        hi: '**\`process.on("uncaughtException", ...)\` aur \`process.on("unhandledRejection", ...)\` ko ek jaan-boojhkar, logging, exit-on-error safety net ki tarah register karna Node.js ki apni khud ki officially documented recommended production practices mein se ek hai**, jo explicitly baad mein normal operation resume karne ki koshish ke khilaaf chetaavni deta hai.',
      },
      {
        en: '**Process managers and container orchestrators automatically restarting a process the instant it exits is the standard mechanism relied upon industry-wide** to turn a deliberate, safe crash into a brief, largely invisible blip rather than genuine downtime, exactly the pairing this course\'s earlier process-manager lesson introduced.',
        hi: '**Process managers aur container orchestrators ka process ke exit hote hi use turant automatically restart karna wo standard mechanism hai jispar industry-wide bharosa kiya jaata hai** ek jaan-boojhkar, surakshit crash ko asli downtime ke bajaye ek chhota, lagbhag na-dikhne-waala blip banaane ke liye, bilkul wahi jodi jo is course ke pehle wale process-manager lesson ne pesh ki thi.',
      },
      {
        en: '**Error-tracking and monitoring platforms are commonly integrated directly into these process-level handlers** so that a genuinely unanticipated production crash is automatically reported to the engineering team with full context, rather than only being discoverable by someone happening to read raw server logs.',
        hi: '**Error-tracking aur monitoring platforms aam taur par seedhe in process-level handlers mein integrate kiye jaate hain** taaki ek sach mein anapekshit production crash automatically poori context ke saath engineering team ko report ho jaaye, sirf kisi ke raw server logs padhne par mil paane ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why should a process.on("uncaughtException", ...) handler exit the process rather than simply logging the error and continuing to run?',
        qHi: 'Ek \`process.on("uncaughtException", ...)\` handler ko process exit kyun karna chahiye, bas error log karke chalte rehne ke bajaye?',
        a: 'By the time an uncaughtException handler is invoked, it means an error propagated all the way through the application without any try/catch anywhere in its call chain being positioned to handle it — a genuinely unanticipated situation that no part of the codebase was written to account for. This matters because the error may have occurred partway through some operation that mutates shared, in-memory state — updating a module-level cache, incrementing a counter, holding a lock, partially constructing an object other code depends on being complete — and there is no reliable way to know, after the fact, exactly how much of that operation completed before the error was thrown or what state it left things in. If the process simply logs the error and continues running, every subsequent request now executes on top of this unknown, unverified, possibly inconsistent state, and any bugs that result from that inconsistency may be far more subtle, delayed, and difficult to trace back to the original cause than the original crash would have been — potentially corrupting further data or producing wrong results silently for an extended period before anyone notices. Exiting the process entirely discards this uncertain state completely, and a process manager or container orchestrator (following this course\'s earlier lesson on that topic) immediately starts a brand new process instance in a clean, known-good starting state, so every subsequent request is served correctly rather than on top of a foundation nobody can vouch for.',
        aHi: 'Jab tak ek \`uncaughtException\` handler invoke hota hai, iska matlab hai ek error poori application ke through propagate ho gaya bina uski call chain mein kahin bhi kisi \`try/catch\` ke use sambhaalne ke liye position hue — ek sach mein anapekshit sthiti jiske liye codebase ka koi hissa nahi likha gaya tha. Ye is liye maayne rakhta hai kyunki error kisi operation ke beech mein hua ho sakta hai jo shared, in-memory sthiti ko badalta hai — ek module-level cache update karna, ek counter badhaana, ek lock pakadna, ek object ko aadha banaana jispar doosra code poora hone par nirbhar hai — aur baad mein ye jaanne ka koi bharosemand tarika nahi hai ki error throw hone se pehle us operation ka kitna hissa poora hua ya usne cheezon ko kis sthiti mein chhoda. Agar process bas error log karta hai aur chalta rehta hai, har agli request ab is anjaani, na-verify hui, shaayad asangat sthiti ke oopar chalti hai, aur us asangati se aane waale koi bhi bugs asli crash se kaafi zyaada sookshm, deri se aane waale, aur asli kaaran tak track karna mushkil ho sakte hain — kisi ke dhyaan mein aane se pehle lambe samay tak aur data corrupt kar sakte hain ya chupke se galat nateeje paida kar sakte hain. Process ko poori tarah exit karna is anishchit sthiti ko poori tarah chhod deta hai, aur ek process manager ya container orchestrator (is course ke us topic par pehle wale lesson ka palan karte hue) turant ek bilkul naya process instance shuru karta hai ek saaf, jaani-pehchaani-achhi shuruaati sthiti mein, taaki har agli request sahi tarike se serve ho na ki ek aisi buniyaad ke oopar jiski koi zamanat nahi de sakta.',
      },
      {
        q: 'What is the practical difference between uncaughtException and unhandledRejection, and why does a production application need handlers for both?',
        qHi: '\`uncaughtException\` aur \`unhandledRejection\` mein vyavaharik antar kya hai, aur ek production application ko dono ke liye handlers kyun chahiye?',
        a: 'uncaughtException fires when a traditional, synchronous throw (or an error surfaced through Node.js\'s older callback-based error conventions) propagates all the way up through the call stack without encountering any try/catch positioned to handle it along the way — this is Node.js\'s original, long-standing error-propagation mechanism. unhandledRejection instead fires specifically for Promise-based code: when a Promise rejects, and nothing anywhere ever attaches a .catch() handler to that specific promise, and it is also never awaited inside a try/catch that would catch the rejection, the rejection has nowhere left to be handled and this event fires as Node.js\'s way of surfacing that gap. The reason both matter in a real application is that modern Node.js codebases routinely mix both styles of asynchronous code — some using async/await and Promises throughout, others still using older callback-based APIs or third-party libraries that predate widespread Promise adoption, and even Promise-heavy codebases can accidentally create a "fire-and-forget" call that starts a Promise but never actually attaches error handling to it. Registering a handler for only one of these two events leaves an entire category of genuinely unanticipated errors — whichever mechanism the missing handler was meant to catch — completely unhandled, meaning some real production failures would silently corrupt state or crash the process in an uncontrolled way rather than being caught by the same deliberate, logging, exit-cleanly safety net the other handler provides.',
        aHi: '\`uncaughtException\` tab fire hota hai jab ek paranaparik, synchronous throw (ya Node.js ke purane callback-based error conventions ke zariye zaahir hua ek error) call stack ke through bilkul oopar tak propagate hota hai bina raaste mein kisi bhi \`try/catch\` ko use sambhaalne ke liye position hue milna — ye Node.js ka asli, lambe samay se chala aa raha error-propagation mechanism hai. \`unhandledRejection\` iske bajaye khaas taur par Promise-based code ke liye fire hota hai: jab ek Promise reject hota hai, aur kahin bhi kabhi koi \`.catch()\` handler us khaas promise se attach nahi hota, aur ise kabhi bhi ek \`try/catch\` ke andar \`await\` nahi kiya jaata jo rejection pakad leta, rejection ke paas sambhaale jaane ke liye kahin jagah nahi bachti aur ye event Node.js ke us gap ko zaahir karne ke tarike ki tarah fire hota hai. Dono ka ek asli application mein maayne rakhne ka kaaran ye hai ki modern Node.js codebases niyamit taur par dono style ka asynchronous code milaate hain — kuch poori tarah async/await aur Promises istemal karte hain, doosre abhi bhi purane callback-based APIs ya third-party libraries istemal karte hain jo Promise ke vyaapak istemal se pehle ke hain, aur Promise-bhaari codebases bhi galti se ek "fire-and-forget" call bana sakte hain jo ek Promise shuru karta hai par kabhi asal mein error handling attach nahi karta. In do events mein se sirf ek ke liye handler register karna sach mein anapekshit errors ki ek poori category — jo bhi mechanism gayab handler pakadne ke liye tha — ko poori tarah bina-sambhaale chhod deta hai, matlab kuch asli production failures chupke se sthiti corrupt kar sakti hain ya process ko ek anniyantrit tarike se crash kar sakti hain us jaan-boojhkar, logging, saaf-exit-hone waale safety net dwara pakde jaane ke bajaye jo doosra handler deta hai.',
      },
      {
        q: 'Why is server.close() called inside the crash handler instead of calling process.exit() immediately?',
        qHi: 'Crash handler ke andar seedhe \`process.exit()\` call karne ke bajaye \`server.close()\` kyun call kiya jaata hai?',
        a: 'Calling process.exit() immediately, the instant an uncaughtException or unhandledRejection handler runs, terminates the Node.js process at once, which abruptly cuts off every single request the server happens to be in the middle of handling at that exact moment — not just the one request whose code path happened to trigger the crashing error, but every other, entirely unrelated in-flight request the process was concurrently serving, denying all of them any response whatsoever, even ones that were moments away from completing successfully. Calling server.close() instead tells the underlying HTTP server to stop accepting any brand-new incoming connections immediately, while allowing whatever requests are already in progress a genuine opportunity to finish their work and send their responses normally, and only once all of those in-flight requests have actually completed does server.close()\'s callback fire, at which point process.exit() is called and the process actually terminates. This does not change the fundamental decision to crash and restart — that remains correct and necessary given the corrupted, unverified state involved — but it meaningfully reduces the blast radius of that crash, sparing unrelated in-flight requests from being needlessly cut off when they could have completed successfully and independently of whatever specific code path triggered the crash. The accompanying setTimeout(() => process.exit(1), ...).unref() exists specifically as a bounded backstop, guaranteeing the process still exits within a fixed maximum time even if, for some unrelated reason, server.close()\'s callback never fires at all.',
        aHi: 'Turant \`process.exit()\` call karna, jis pal ek \`uncaughtException\` ya \`unhandledRejection\` handler chalta hai, Node.js process ko turant khatam kar deta hai, jo achaanak har us request ko kaat deta hai jise server us bilkul pal handle karne ke beech mein hai — sirf us ek request ko nahi jiske code path ne crashing error trigger kiya, balki har doosri, bilkul na-judi in-flight request ko bhi jise process ek saath serve kar raha tha, unhe koi bhi response bina diye, un ke sameet jo safaltapoorvak poora hone se bas kuch pal door theen. Iske bajaye \`server.close()\` call karna underlying HTTP server ko turant koi bhi bilkul-nayi aati connections accept karna band karne ko kehta hai, jabki jo requests pehle se chal rahi hain unhe apna kaam poora karne aur normal taur par apne responses bhejne ka ek asli mauka dete hue, aur sirf ek baar wo sab in-flight requests asal mein poori ho jaayein tabhi \`server.close()\` ka callback fire hota hai, jis point par \`process.exit()\` call hota hai aur process asal mein khatam hota hai. Ye crash karke restart karne ke buniyaadi faisle ko nahi badalta — wo shaamil corrupt, na-verify hui sthiti ko dekhte hue sahi aur zaruri bana rehta hai — par ye us crash ke blast radius ko maayne-rakhta kam karta hai, na-judi in-flight requests ko bekaar mein katne se bachaate hue jab wo jis khaas code path ne crash trigger kiya us se alag aur safaltapoorvak poori ho sakti theen. Saath wala \`setTimeout(() => process.exit(1), ...).unref()\` khaas taur par ek seemit backstop ki tarah maujood hai, sunishchit karte hue ki process phir bhi ek tay adhiktam waqt ke andar exit hota hai chahe, kisi na-judi wajah se, \`server.close()\` ka callback kabhi fire hi na ho.',
      },
    ],

    exercises: [
      {
        task: 'Write a route that deliberately throws a synchronous error with no try/catch around it. Confirm that with no process-level handler registered, Node.js prints the error and the process exits entirely.',
        taskHi: 'Ek route likho jo jaan-boojhkar ek synchronous error throw kare uske aas-paas koi \`try/catch\` bina. Confirm karo ki bina kisi process-level handler ke, Node.js error print karta hai aur process poori tarah exit hota hai.',
        hint: 'A plain throw new Error("boom") directly inside a route handler, with no try/catch anywhere in the call chain, is enough to demonstrate this.',
        hintHi: 'Ek route handler ke andar seedhe ek saadha \`throw new Error("boom")\`, call chain mein kahin bhi koi \`try/catch\` bina, ise dikhaane ke liye kaafi hai.',
      },
      {
        task: 'Add the uncaughtException handler shown in this lesson. Rerun the same broken route and confirm the error is now logged clearly and the process exits cleanly via process.exit(1) instead of Node.js\'s raw default crash output.',
        taskHi: 'Is lesson mein dikhaaya \`uncaughtException\` handler jodo. Wahi toota route dobara chalaao aur confirm karo ki error ab saaf log hota hai aur process \`process.exit(1)\` ke zariye saaf exit hota hai Node.js ke raw default crash output ke bajaye.',
        hint: 'Add a console.log immediately before the throw and another right after the process.exit(1) call is reached, to confirm the exact order handlers run in.',
        hintHi: '\`throw\` se turant pehle ek \`console.log\` jodo aur \`process.exit(1)\` call pahunchne ke turant baad ek aur, handlers kis order mein chalte hain ye confirm karne ke liye.',
      },
      {
        task: 'Add a slow, deliberately long-running in-flight request (an artificial delay) and trigger the crash while it is still in progress. Confirm server.close() lets it finish and respond before the process actually exits, rather than cutting it off immediately.',
        taskHi: 'Ek dheemi, jaan-boojhkar lambi-chalti in-flight request jodo (ek kritrim deri) aur crash trigger karo jabki ye abhi bhi chal rahi hai. Confirm karo ki \`server.close()\` ise poora hone aur jawaab dene deta hai process asal mein exit hone se pehle, turant kaatne ke bajaye.',
        hint: 'Use a setTimeout-based delay of a few seconds inside one route, trigger the crash from a different route while the first is still pending, and observe whether the slow route\'s response still arrives.',
        hintHi: 'Ek route ke andar kuch seconds ki \`setTimeout\`-based deri istemal karo, dusre route se crash trigger karo jabki pehla abhi bhi pending hai, aur dekho kya dheeme route ka response abhi bhi pahunchta hai.',
      },
    ],

    keyTakeaways: [
      'uncaughtException fires for a traditional synchronous throw that no try/catch anywhere in its call chain caught; unhandledRejection fires for a rejected Promise with no .catch() and no surrounding try/catch on its await — a production app needs handlers for both.',
      'The correct response inside these handlers is to log the error with full context and exit the process — never to attempt to keep running, since the process\'s in-memory state can no longer be trusted after a genuinely uncaught error.',
      'Exiting relies on this course\'s earlier process-manager lesson (PM2, Docker, Kubernetes) to automatically restart a fresh, known-good instance, turning a deliberate crash into a brief blip rather than lasting downtime.',
      'server.close() should be called before process.exit(), letting in-flight, unrelated requests finish and respond normally rather than being abruptly cut off by an immediate exit.',
      'A bounded setTimeout backstop guarantees the process still exits within a fixed maximum time even if server.close()\'s callback never fires for some unrelated reason.',
      'These handlers are a last resort for genuinely unanticipated errors, not a substitute for proper try/catch blocks and error-handling middleware around expected failure points throughout the application.',
    ],
    keyTakeawaysHi: [
      '\`uncaughtException\` ek paranaparik synchronous throw ke liye fire hota hai jise uski call chain mein kahin bhi kisi \`try/catch\` ne nahi pakda; \`unhandledRejection\` ek reject hue Promise ke liye fire hota hai bina \`.catch()\` aur uske \`await\` par koi aas-paas \`try/catch\` bina — ek production app ko dono ke liye handlers chahiye.',
      'In handlers ke andar sahi jawaab error ko poori context ke saath log karna aur process exit karna hai — chalte rehne ki koshish kabhi nahi, kyunki ek sach mein uncaught error ke baad process ki in-memory sthiti ka ab bharosa nahi kiya jaa sakta.',
      'Exit karna is course ke pehle wale process-manager lesson (PM2, Docker, Kubernetes) par nirbhar hai ek naya, jaana-pehchaana-achha instance automatically restart karne ke liye, ek jaan-boojhkar crash ko lambe downtime ke bajaye ek chhote blip mein badalte hue.',
      '\`server.close()\` ko \`process.exit()\` se pehle call kiya jaana chahiye, in-flight, na-judi requests ko poora hone aur normal taur par jawaab dene dete hue ek turant exit dwara achaanak kaate jaane ke bajaye.',
      'Ek seemit \`setTimeout\` backstop sunishchit karta hai ki process phir bhi ek tay adhiktam waqt ke andar exit hota hai chahe \`server.close()\` ka callback kisi na-judi wajah se kabhi fire na ho.',
      'Ye handlers sach mein anapekshit errors ke liye ek aakhri upaay hain, poore application mein anumaanit fail-hone ke points ke aas-paas sahi \`try/catch\` blocks aur error-handling middleware ka vikalp nahi.',
    ],
  },
];
