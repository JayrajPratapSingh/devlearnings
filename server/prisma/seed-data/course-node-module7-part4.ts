/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 4.
 *
 * Load balancing, health checks, and graceful shutdown: why a load
 * balancer routing traffic across multiple server instances needs a way to
 * know an instance is actually broken (not just "the process is still
 * running"), and why simply killing a process during a deploy cuts off
 * whatever requests happen to be mid-flight at that exact instant. Broken
 * example: an instance that has silently lost its database connection
 * keeps receiving traffic from the load balancer and returning 500s to
 * every user, because nothing tells the load balancer to stop routing to
 * it; separately, a deploy that sends SIGKILL immediately severs every
 * in-flight request's connection with no response at all. Fixed with a
 * /health endpoint the load balancer polls (checking real dependencies,
 * not just "the process responds"), and a SIGTERM handler that stops
 * accepting new connections, lets in-flight requests finish (with a
 * timeout), then exits cleanly — the actual mechanism that makes
 * clustering/PM2's zero-downtime reload (covered in Module 6) genuinely
 * zero-downtime.
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

export const NODE_MODULE_7_PART4: CourseLesson[] = [
  {
    slug: 'load-balancing-health-checks-graceful-shutdown',
    title: 'Load Balancing, Health Checks, and Graceful Shutdown',
    titleHi: 'Load Balancing, Health Checks, Aur Graceful Shutdown',
    description: 'A server instance silently loses its database connection and keeps returning 500 errors to real users for twenty straight minutes — because nothing ever told the load balancer to stop sending it traffic.',
    descriptionHi: 'Ek server instance chupke se apna database connection kho deta hai aur asli users ko lagaataar bees minute tak 500 errors lautaata rehta hai — kyunki kisi ne bhi load balancer ko kabhi nahi bataaya ki use traffic bhejna band karo.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A restaurant host who keeps seating new customers at a table where the waiter has silently fainted, simply because the waiter\'s name tag is still visible from across the room — versus a host who briefly checks in on each waiter regularly and stops seating anyone at a table whose waiter does not respond.** A load balancer sending traffic to a server instance based only on whether the instance is technically "running" (a process that has not crashed) is like a restaurant host who considers a waiter "on duty" purely because they can still see that waiter\'s name tag from the host stand — the host keeps sending new customers to that waiter\'s tables indefinitely, with no actual check on whether the waiter is conscious, capable of taking an order, or has any connection to the kitchen at all. If that specific waiter quietly collapses, or the kitchen they depend on stops responding to them specifically, the waiter is still technically "there," name tag and all, and customer after customer gets seated at their table and left waiting indefinitely, with no host ever noticing anything is wrong. A host trained to do this properly instead briefly checks on every waiter at regular intervals — "can you hear me, is the kitchen responding to your orders?" — and the instant a specific waiter fails to respond correctly, that waiter\'s tables are immediately excluded from new seating, with customers directed only to waiters who are genuinely able to serve them, until that waiter is confirmed responsive again. Separately, when a waiter\'s shift genuinely needs to end, a well-run restaurant does not physically remove them mid-conversation with a customer — it waits for them to finish serving whoever they are currently with, stops assigning them anyone new, and only then lets them actually leave.',
      hi: '**Ek restaurant host jo naye customers ko ek aise table par baithaata rehta hai jahan waiter chupke se behosh ho chuka hai, sirf isliye kyunki waiter ka naam-tag abhi bhi kamre ke uss paar se dikhta hai — versus ek host jo har waiter ko niyamit taur par thodi der ke liye check karta hai aur kisi ko bhi us table par baithaana band kar deta hai jiska waiter jawaab na de.** Ek load balancer jo sirf is baat ke aadhaar par traffic ek server instance ko bhejta hai ki kya instance technically "chal raha" hai (ek process jo crash nahi hua) ek aise restaurant host jaisa hai jo ek waiter ko "duty par" maanta hai sirf isliye kyunki wo ab bhi us waiter ka naam-tag host stand se dekh sakta hai — host naye customers ko us waiter ki tables par hamesha ke liye bhejta rehta hai, is baat ki koi asli check bina ki kya waiter hosh mein hai, order lene ke kaabil hai, ya kitchen se bilkul koi connection rakhta hai. Agar wo khaas waiter chupke se gir jaaye, ya jis kitchen par wo nirbhar hai use khaas taur par jawaab dena band kar de, waiter abhi bhi technically "wahin" hai, naam-tag sameet, aur customer-dar-customer us table par baithaya jaata hai aur hamesha intezaar mein chhoda jaata hai, koi host kabhi kuch galat notice kiye bina. Ek host jise ise sahi tarike se karne ki training di gayi hai iske bajaye har waiter ko niyamit antaral par thodi der ke liye check karta hai — "kya tum sun sakte ho, kya kitchen tumhaare orders ka jawaab de rahi hai?" — aur jis pal ek khaas waiter sahi tarike se jawaab dene mein fail hota hai, us waiter ki tables turant nayi seating se exclude ho jaati hain, customers sirf un waiters ki taraf bheje jaate hain jo sach mein unhe serve kar sakte hain, jab tak wo waiter dobara responsive confirm na ho. Alag se, jab ek waiter ki shift ko sach mein khatam hona chahiye, ek achhi tarah chalaaya restaurant unhe ek customer ke saath beech-baatcheet mein physically nahi hataata — ye unke jis se bhi abhi baat kar rahe hain use serve karna poora karne ka intezaar karta hai, unhe koi naya assign karna band karta hai, aur sirf tab unhe asal mein jaane deta hai.',
    },

    simple: `**Start broken.** Two separate problems in a multi-instance deployment, neither of which this course\'s earlier clustering lesson addressed.

**Problem one: a load balancer has no way to know an instance is actually broken**

\`\`\`js
// A load balancer configuration that only checks whether a TCP connection succeeds
// upstream backend {
//   server app1:3000;
//   server app2:3000;
//   server app3:3000;
// }
\`\`\`

\`\`\`js
app.get("/orders", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [req.userId]);
    res.json(result.rows);
  } catch (err) {
    next(err); // if the database connection is lost, this fires for EVERY request
  }
});
\`\`\`

Imagine three server instances (\`app1\`, \`app2\`, \`app3\`) behind a load balancer, following this course\'s earlier clustering lesson\'s idea of scaling across multiple machines. If \`app2\`\'s connection pool loses its connection to the database — a transient network issue, the database briefly restarting — \`app2\`\'s process itself is still running perfectly fine; it has not crashed, and a load balancer that only checks "is something listening on this port" sees no problem at all. But every single request \`app2\` receives now fails, since every route touching the database throws and returns a 500 error — and because the load balancer has no way to distinguish "a healthy instance" from "a running-but-broken instance," it keeps sending roughly one-third of all traffic to \`app2\`, and roughly one-third of all users keep getting errors, for as long as it takes a human to notice and manually intervene.

**Problem two: killing a process immediately cuts off requests already in progress**

\`\`\`bash
kill -9 <pid>
# every in-flight request this process was handling gets cut off immediately, with no response at all
\`\`\`

Separately, during a routine deploy, if an old instance is simply killed outright (\`SIGKILL\`, or an abrupt restart with no coordination) the instant a new version is ready, whatever requests that instance happened to be in the middle of handling at that exact moment are severed immediately — the client\'s connection simply drops, with no response ever sent, regardless of how close that request was to finishing successfully.

**The fix: a real health check, and a graceful shutdown that finishes in-flight work first**

\`\`\`js
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1"); // confirms the database is actually reachable
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy" });
  }
});
\`\`\`

\`\`\`js
let isShuttingDown = false;

app.use((req, res, next) => {
  if (isShuttingDown) {
    return res.status(503).json({ error: "Server is shutting down, please retry" });
  }
  next();
});

process.on("SIGTERM", () => {
  isShuttingDown = true;
  server.close(() => {
    pool.end();
    process.exit(0);
  });
});
\`\`\`

\`\`\`ts
app.get("/health", async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy" });
  }
});

let isShuttingDown = false;

app.use((req: Request, res: Response, next: NextFunction): void => {
  if (isShuttingDown) {
    res.status(503).json({ error: "Server is shutting down, please retry" });
    return;
  }
  next();
});

process.on("SIGTERM", () => {
  isShuttingDown = true;
  server.close(() => {
    pool.end();
    process.exit(0);
  });
});
\`\`\`

A \`/health\` route that genuinely checks the application\'s real dependencies (here, \`SELECT 1\` against the actual database connection pool) gives the load balancer something meaningful to poll regularly — the instant \`app2\`\'s database connection is lost, its \`/health\` check starts returning \`503\`, and a load balancer configured to poll this endpoint correctly stops routing new traffic to \`app2\` until it recovers, automatically, without a human needing to notice or intervene. \`SIGTERM\` is the signal a process manager (PM2, Docker, an orchestrator) sends to ask a process to shut down cleanly, as opposed to \`SIGKILL\`, which terminates it immediately with no opportunity to react at all — handling \`SIGTERM\` lets the application stop accepting brand-new requests immediately (returning a clear \`503\` for any that arrive during shutdown, rather than accepting and then failing to serve them) while still allowing whatever requests were already in progress to finish normally, closing the database pool and exiting only once that in-flight work is done. This is the actual mechanism that makes PM2\'s \`reload\` (covered in Module 6\'s clustering lesson) genuinely zero-downtime — without a correctly implemented \`SIGTERM\` handler, "zero-downtime reload" would still cut off in-flight requests exactly like the broken \`kill -9\` example above, just orchestrated by a nicer-sounding command.`,

    simpleHi: `**Toote hue se shuru.** Ek multi-instance deployment mein do alag samasyaayein, jinmein se koi bhi is course ke pehle wale clustering lesson ne sambhaali nahi.

**Samasya ek: ek load balancer ke paas ye jaanne ka koi tarika nahi ki ek instance asal mein toota hai**

\`\`\`js
// Ek load balancer configuration jo sirf check karta hai ki kya ek TCP connection safal hoti hai
// upstream backend {
//   server app1:3000;
//   server app2:3000;
//   server app3:3000;
// }
\`\`\`

\`\`\`js
app.get("/orders", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [req.userId]);
    res.json(result.rows);
  } catch (err) {
    next(err); // agar database connection kho jaaye, ye HAR request ke liye fire hota hai
  }
});
\`\`\`

Kalpanaa karo teen server instances (\`app1\`, \`app2\`, \`app3\`) ek load balancer ke peeche, is course ke pehle wale clustering lesson ki kai machines ke aar-paar scale karne ki socch ka palan karte hue. Agar \`app2\` ka connection pool database se apna connection kho de — ek asthaayi network issue, database thodi der ke liye restart ho raha — \`app2\` ka process khud abhi bhi bilkul theek chal raha hai; ye crash nahi hua, aur ek load balancer jo sirf "is port par kuch sun raha hai" check karta hai bilkul koi samasya nahi dekhta. Par \`app2\` ko milti har akeli request ab fail hoti hai, kyunki database chhuti har route throw karti hai aur ek 500 error lautaati hai — aur kyunki load balancer ke paas "ek healthy instance" ko "chal-raha-par-toota instance" se alag karne ka koi tarika nahi, ye lagbhag ek-tihaai poori traffic \`app2\` ko bhejta rehta hai, aur lagbhag ek-tihaai users ko errors milte rehte hain, jitna bhi waqt kisi insaan ko notice karne aur haath se dakhal dene mein lagta hai.

**Samasya do: ek process ko turant maarna abhi chal rahi requests ko turant kaat deta hai**

\`\`\`bash
kill -9 <pid>
# ye process jo bhi in-flight requests sambhaal raha tha unhe turant kaat diya jaata hai, bilkul koi jawaab bina
\`\`\`

Alag se, ek routine deploy ke dauraan, agar ek purani instance ko bas seedha maar diya jaaye (\`SIGKILL\`, ya bina kisi coordination ke ek abrupt restart) us pal jab ek naya version taiyaar hai, jo bhi requests wo instance samyog se us bilkul pal handle karne ke beech mein thi turant kaati jaati hain — client ka connection bas gir jaata hai, koi jawaab kabhi bheja hi nahi jaata, chahe wo request kitni bhi safaltapoorvak khatam hone ke kareeb thi.

**Fix: ek asli health check, aur ek graceful shutdown jo pehle in-flight kaam poora karta hai**

\`\`\`js
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1"); // confirm karta hai database asal mein reachable hai
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy" });
  }
});
\`\`\`

\`\`\`js
let isShuttingDown = false;

app.use((req, res, next) => {
  if (isShuttingDown) {
    return res.status(503).json({ error: "Server is shutting down, please retry" });
  }
  next();
});

process.on("SIGTERM", () => {
  isShuttingDown = true;
  server.close(() => {
    pool.end();
    process.exit(0);
  });
});
\`\`\`

\`\`\`ts
app.get("/health", async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy" });
  }
});

let isShuttingDown = false;

app.use((req: Request, res: Response, next: NextFunction): void => {
  if (isShuttingDown) {
    res.status(503).json({ error: "Server is shutting down, please retry" });
    return;
  }
  next();
});

process.on("SIGTERM", () => {
  isShuttingDown = true;
  server.close(() => {
    pool.end();
    process.exit(0);
  });
});
\`\`\`

Ek \`/health\` route jo application ki asli dependencies sach mein check karta hai (yahan, \`SELECT 1\` asli database connection pool ke khilaaf) load balancer ko niyamit taur par poll karne ke liye kuch maayne-rakhta deta hai — jis pal \`app2\` ka database connection khota hai, uska \`/health\` check \`503\` lautaana shuru karta hai, aur is endpoint ko poll karne ke liye configure kiya ek load balancer sahi tarike se \`app2\` ko naya traffic bhejna band kar deta hai jab tak wo recover na ho, apne aap, kisi insaan ke notice karne ya dakhal dene ki zarurat bina. \`SIGTERM\` wo signal hai jo ek process manager (PM2, Docker, ek orchestrator) ek process ko saaf tarike se band hone ke liye poochne ke liye bhejta hai, \`SIGKILL\` ke ulta, jo ise turant khatam kar deta hai kisi bhi react karne ke mauke bina — \`SIGTERM\` sambhaalna application ko turant bilkul-naye requests accept karna band karne deta hai (jo bhi shutdown ke dauraan aati hain unke liye ek saaf \`503\` lautaate hue, unhe accept karke phir serve karne mein fail hone ke bajaye) jabki jo requests pehle se chal rahi thi unhe normal taur par poora hone deta hai, database pool band karte hue aur sirf tab exit karte hue jab wo in-flight kaam poora ho. Ye asal mein wahi mechanism hai jo PM2 ke \`reload\` (Module 6 ke clustering lesson mein cover hua) ko sach mein zero-downtime banaata hai — bina ek sahi tarike se lagu kiye \`SIGTERM\` handler ke, "zero-downtime reload" abhi bhi in-flight requests ko bilkul upar wale toote \`kill -9\` example ki tarah kaatega, bas ek zyaada achhe-lagte command se orchestrate hua.`,

    content: `## Liveness vs. readiness: two related but distinct questions

\`\`\`js
// Liveness: "is the process itself alive, or should it be restarted?"
app.get("/health/live", (req, res) => {
  res.status(200).json({ status: "alive" }); // no dependency checks — just confirms the process responds
});

// Readiness: "is this instance currently able to correctly serve real traffic?"
app.get("/health/ready", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ready" });
  } catch (err) {
    res.status(503).json({ status: "not ready" });
  }
});
\`\`\`

Production orchestration systems (most notably Kubernetes, though the concept applies more broadly) commonly distinguish between two related but genuinely different questions: LIVENESS ("is this process fundamentally alive, or has it hung/deadlocked in a way that only a restart can fix?") and READINESS ("is this specific instance currently able to correctly handle real traffic right now?"). A liveness check failing typically triggers restarting the process entirely, since it signals something is so fundamentally wrong that only a fresh start can help; a readiness check failing (this lesson\'s \`/health\` example, checking the database) typically triggers only removing the instance from load-balancer rotation temporarily, since the process itself is fine and may recover on its own (the database reconnecting) without needing a full restart. Conflating these two checks — restarting an instance every time a temporary, self-recoverable dependency issue occurs, rather than simply pausing traffic to it — causes unnecessary restarts and can make a transient problem worse rather than better.

## Why a health check must verify real dependencies, not just "the process responds"

\`\`\`js
// WRONG — this always returns 200, telling the load balancer nothing useful
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// RIGHT — actually attempts the specific operation the application depends on
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy" });
  }
});
\`\`\`

A health check endpoint that simply returns \`200 OK\` unconditionally, without actually attempting to verify anything, provides no genuinely useful signal at all — it will report "healthy" even in exactly the scenario this lesson\'s broken example describes, an instance whose process is running but whose database connection is dead. A meaningful health check must genuinely exercise the specific dependencies the application actually needs to function correctly (a real, lightweight database query, as shown here — following this course\'s connection-pooling lesson\'s \`pool\`) rather than merely confirming that the HTTP server itself is capable of responding to a request, which says nothing about whether it can correctly serve the application\'s ACTUAL routes.

## Graceful shutdown\'s components, one at a time

\`\`\`js
let isShuttingDown = false;

app.use((req, res, next) => {
  if (isShuttingDown) {
    return res.status(503).json({ error: "Server is shutting down, please retry" });
  }
  next();
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, starting graceful shutdown");
  isShuttingDown = true;

  server.close(() => {
    console.log("All in-flight requests completed");
    pool.end(() => {
      process.exit(0);
    });
  });

  setTimeout(() => {
    console.error("Forcing shutdown after timeout");
    process.exit(1);
  }, 10000); // a safety net in case something never finishes
});
\`\`\`

Breaking this down: the \`isShuttingDown\` flag, checked by a middleware early in the chain, ensures any BRAND NEW request arriving after shutdown has begun is immediately told to retry elsewhere (a \`503\`) rather than being accepted and then potentially failing partway through. \`server.close()\` (Node\'s built-in HTTP server method) stops the server from accepting any new incoming CONNECTIONS, but critically does not forcibly terminate connections already in progress — its callback fires only once every currently in-flight request has genuinely finished being served. Only once that callback fires does the code close the database pool (\`pool.end()\`, ensuring no lingering connections are left open) and exit the process cleanly. The \`setTimeout\` safety net exists because a request that never completes for its own reasons (a hung external API call, a bug) could otherwise leave \`server.close()\`\'s callback waiting forever — forcing an exit after a reasonable maximum wait avoids the shutdown process itself hanging indefinitely.

## The interaction with clustering: every worker needs this, and the primary needs patience

\`\`\`js
// Following Module 6's clustering lesson: each individual worker process
// needs its own SIGTERM handling, and the primary process (or PM2/an
// orchestrator) needs to give each worker enough time to finish before
// force-killing it during a reload.
\`\`\`

Following this course\'s earlier clustering lesson, graceful shutdown needs to be implemented in every individual worker process, since each one independently handles its own share of requests and each one needs the same opportunity to finish in-flight work before exiting. Tools like PM2\'s \`reload\` are specifically designed to send \`SIGTERM\` to one worker at a time, wait for it to exit cleanly (relying on that worker\'s own graceful-shutdown handling to eventually call \`process.exit()\`), and only then move on to the next worker — a deploy process that instead force-kills workers immediately defeats this entirely, regardless of how well each individual worker\'s shutdown code is written.`,

    contentHi: `## Liveness vs. readiness: do jude par alag sawaal

\`\`\`js
// Liveness: "kya process khud zinda hai, ya use restart karna chahiye?"
app.get("/health/live", (req, res) => {
  res.status(200).json({ status: "alive" }); // koi dependency checks nahi — bas confirm karta hai process jawaab deta hai
});

// Readiness: "kya ye instance abhi asli traffic sahi tarike se serve kar sakta hai?"
app.get("/health/ready", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ready" });
  } catch (err) {
    res.status(503).json({ status: "not ready" });
  }
});
\`\`\`

Production orchestration systems (khaas taur par Kubernetes, chahe concept zyaada wyaapak taur par lagu hota hai) aam taur par do jude par sach mein alag sawaalon ke beech farak karte hain: LIVENESS ("kya ye process buniyaadi taur par zinda hai, ya ye aise atak/deadlock ho gaya hai ki sirf ek restart hi theek kar sakta hai?") aur READINESS ("kya ye khaas instance abhi sahi tarike se asli traffic handle kar sakta hai?"). Ek liveness check fail hona aam taur par poori tarah process ko restart karne ko trigger karta hai, kyunki ye ishara karta hai kuch itna buniyaadi taur par galat hai ki sirf ek taaza shuruaat hi madad kar sakti hai; ek readiness check fail hona (is lesson ka \`/health\` example, database check karte hue) aam taur par sirf thodi der ke liye instance ko load-balancer rotation se hataane ko trigger karta hai, kyunki process khud theek hai aur khud apne aap recover ho sakta hai (database dobara connect hote hue) bina ek poori restart ki zarurat ke. In do checks ko mila dena — har baar jab ek asthaayi, khud-recover-hone-laayak dependency issue ho ek instance ko restart karna, sirf uske liye traffic pause karne ke bajaye — na-zaruri restarts karta hai aur ek asthaayi samasya ko behtar ke bajaye bura bana sakta hai.

## Ek health check ko asli dependencies verify karni chahiye, sirf "process jawaab deta hai" nahi

\`\`\`js
// GALAT — ye hamesha 200 lautaata hai, load balancer ko kuch kaam ka nahi batata
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// SAHI — asal mein us khaas operation ki koshish karta hai jis par application nirbhar karta hai
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy" });
  }
});
\`\`\`

Ek health check endpoint jo bas bina kisi shart ke \`200 OK\` lautaata hai, asal mein kuch bhi verify karne ki koshish kiye bina, bilkul koi sach mein kaam ka signal nahi deta — ye "healthy" report karega bilkul us scenario mein bhi jo is lesson ka toota example describe karta hai, ek instance jiska process chal raha hai par jiska database connection mar chuka hai. Ek maayne-rakhta health check ko sach mein un khaas dependencies ko exercise karna chahiye jinki application ko sahi tarike se kaam karne ke liye asal mein zarurat hai (ek asli, halki database query, yahan dikhaayi gayi — is course ke connection-pooling lesson ke \`pool\` ka palan karte hue) sirf ye confirm karne ke bajaye ki HTTP server khud ek request ka jawaab dene mein kaabil hai, jo iske baare mein kuch nahi kehta ki kya ye application ke ASLI routes ko sahi tarike se serve kar sakta hai.

## Graceful shutdown ke hisse, ek-ek karke

\`\`\`js
let isShuttingDown = false;

app.use((req, res, next) => {
  if (isShuttingDown) {
    return res.status(503).json({ error: "Server is shutting down, please retry" });
  }
  next();
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, starting graceful shutdown");
  isShuttingDown = true;

  server.close(() => {
    console.log("All in-flight requests completed");
    pool.end(() => {
      process.exit(0);
    });
  });

  setTimeout(() => {
    console.error("Forcing shutdown after timeout");
    process.exit(1);
  }, 10000); // agar kuch kabhi poora na ho ek safety net
});
\`\`\`

Ise todte hue: \`isShuttingDown\` flag, jise chain mein jaldi ek middleware check karta hai, sunishchit karta hai ki koi bhi BILKUL NAYI request jo shutdown shuru hone ke baad aati hai turant kahin aur retry karne ko kaha jaata hai (ek \`503\`) accept hokar phir beech mein fail hone ki sambhaavna ke bajaye. \`server.close()\` (Node ka built-in HTTP server method) server ko koi bhi nayi aati CONNECTIONS accept karne se rokta hai, par bahut zaruri pehle se chal rahi connections ko jabardasti khatam nahi karta — uska callback sirf tab fire hota hai jab abhi chal rahi har request sach mein serve ho chuki hoti hai. Sirf ek baar wo callback fire hota hai code database pool band karta hai (\`pool.end()\`, sunishchit karte hue koi bacha connection khula nahi chhoda gaya) aur process ko saaf tarike se exit karta hai. \`setTimeout\` safety net isliye maujood hai kyunki ek request jo apni khud ki wajahon se kabhi poori nahi hoti (ek atki bahari API call, ek bug) warna \`server.close()\` ke callback ko hamesha ke liye intezaar mein chhod sakti hai — ek uchit maximum intezaar ke baad exit force karna shutdown process ko khud hamesha ke liye latakne se bachaata hai.

## Clustering ke saath interaction: har worker ko ye chahiye, aur primary ko sabra chahiye

\`\`\`js
// Module 6 ke clustering lesson ka palan karte hue: har akele worker process ko
// apni khud ki SIGTERM handling chahiye, aur primary process (ya PM2/ek
// orchestrator) ko har worker ko force-kill karne se pehle poora hone ke liye
// ek reload ke dauraan kaafi waqt dena chahiye.
\`\`\`

Is course ke pehle wale clustering lesson ka palan karte hue, graceful shutdown ko har akele worker process mein lagu karna chahiye, kyunki har ek mustaqil taur par apna hissa requests sambhaalta hai aur har ek ko exit karne se pehle in-flight kaam poora karne ka wahi mauka chahiye. PM2 ke \`reload\` jaise tools khaas taur par ek waqt mein ek worker ko \`SIGTERM\` bhejne ke liye design kiye gaye hain, uske saaf tarike se exit hone ka intezaar karte hue (us worker ki apni graceful-shutdown handling par bharosa karte hue aakhirkaar \`process.exit()\` bulaane ke liye), aur sirf tab agle worker ki taraf badhte hue — ek deploy process jo iske bajaye workers ko turant force-kill karta hai ise poori tarah haraata hai, har akele worker ka shutdown code chahe kitna bhi achha likha ho.`,

    examples: [
      {
        title: 'Broken: a health check that always says "ok"',
        titleHi: 'Toota: ek health check jo hamesha "ok" kehta hai',
        code: `app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
// always 200, even when the database connection is completely dead`,
        codeJs: `app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/orders", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [req.userId]);
    res.json(result.rows);
  } catch (err) {
    next(err); // every real request fails, but /health still reports "ok"
  }
});`,
        codeTs: `app.get("/health", (req: Request, res: Response): void => {
  res.status(200).json({ status: "ok" });
});

app.get("/orders", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [req.userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the health check's
// uselessness is entirely about what it fails to verify, not a code defect.`,
        output: `The database connection is lost. /health continues reporting 200 "ok"
indefinitely. The load balancer keeps routing roughly a third of all
traffic to this instance, and every one of those real requests fails
with a 500.`,
        explain: 'The health check never actually attempts the operation the application depends on — it confirms only that the HTTP server itself can respond, which says nothing about whether real routes work.',
        explainHi: 'Health check kabhi asal mein us operation ki koshish nahi karta jis par application nirbhar karta hai — ye sirf confirm karta hai ki HTTP server khud jawaab de sakta hai, jo iske baare mein kuch nahi kehta ki asli routes kaam karte hain ya nahi.',
      },
      {
        title: 'Fixed: a health check that actually verifies the database',
        titleHi: 'Theek: ek health check jo asal mein database verify karta hai',
        code: `app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy" });
  }
});`,
        codeJs: `app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy" });
  }
});`,
        codeTs: `app.get("/health", async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy" });
  }
});`,
        outputJs: `The instant the database connection is lost, /health starts returning
503. A load balancer configured to poll this endpoint stops routing
new traffic to this instance within one polling interval, without any
human needing to notice.`,
        outputTs: `// Identical behaviour. This same lightweight SELECT 1 query is the
// standard way to confirm a database connection is genuinely usable,
// without the overhead of a real, meaningful query.`,
        explain: 'A single failing dependency check correctly turns "the process is alive" into "this instance cannot currently serve real traffic," which is exactly what a load balancer needs to know.',
        explainHi: 'Ek fail hoti dependency check "process zinda hai" ko sahi tarike se "ye instance abhi asli traffic serve nahi kar sakta" mein badalti hai, jo bilkul wahi hai jo ek load balancer ko jaanna chahiye.',
      },
      {
        title: 'Fixed: SIGTERM handling lets in-flight requests finish before exit',
        titleHi: 'Theek: SIGTERM handling exit se pehle in-flight requests ko poora hone deta hai',
        code: `process.on("SIGTERM", () => {
  isShuttingDown = true;
  server.close(() => {
    pool.end(() => process.exit(0));
  });
});`,
        codeJs: `let isShuttingDown = false;

app.use((req, res, next) => {
  if (isShuttingDown) {
    return res.status(503).json({ error: "Server is shutting down, please retry" });
  }
  next();
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, starting graceful shutdown");
  isShuttingDown = true;

  server.close(() => {
    pool.end(() => {
      process.exit(0);
    });
  });

  setTimeout(() => process.exit(1), 10000);
});`,
        codeTs: `let isShuttingDown = false;

app.use((req: Request, res: Response, next: NextFunction): void => {
  if (isShuttingDown) {
    res.status(503).json({ error: "Server is shutting down, please retry" });
    return;
  }
  next();
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, starting graceful shutdown");
  isShuttingDown = true;

  server.close(() => {
    pool.end(() => {
      process.exit(0);
    });
  });

  setTimeout(() => process.exit(1), 10000);
});`,
        outputJs: `A request already being handled at the moment SIGTERM arrives
completes and receives its normal response. A brand-new request
arriving after that moment immediately receives 503, prompting a retry
elsewhere, rather than being accepted and then abruptly cut off.`,
        outputTs: `// Identical behaviour. This is the exact mechanism that makes PM2's
// reload (Module 6) genuinely zero-downtime — without it, a "reload"
// would still cut off in-flight requests exactly like a raw kill -9.`,
        explain: 'server.close() stops accepting new connections but deliberately waits for already-in-progress requests to finish before its callback fires, which is what makes the shutdown "graceful" rather than abrupt.',
        explainHi: '\`server.close()\` naya connections accept karna rokta hai par jaan-boojhkar pehle-se-chal-rahi requests ke poora hone ka intezaar karta hai us se pehle ki uska callback fire ho, jo shutdown ko "graceful" banaata hai, abrupt nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
// always reports healthy, regardless of whether real dependencies actually work`,
        right: `app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy" });
  }
});`,
        why: 'A health check that never verifies real dependencies gives a load balancer no way to detect an instance that is running but genuinely broken, letting it keep receiving traffic indefinitely.',
        whyHi: 'Ek health check jo asli dependencies kabhi verify nahi karta ek load balancer ko ye pehchaanne ka koi tarika nahi deta ki ek instance chal raha hai par sach mein toota hai, use hamesha ke liye traffic paate rehne dete hue.',
      },
      {
        wrong: `kill -9 <pid>
// no chance for in-flight requests to finish, no chance to close the DB pool cleanly`,
        right: `process.on("SIGTERM", () => {
  isShuttingDown = true;
  server.close(() => pool.end(() => process.exit(0)));
});
// in-flight requests finish, then the process exits cleanly`,
        why: 'SIGKILL terminates a process immediately with no opportunity to react, cutting off whatever requests happen to be mid-flight — SIGTERM lets the application finish current work before exiting.',
        whyHi: '\`SIGKILL\` ek process ko turant khatam kar deta hai kisi react karne ke mauke bina, jo bhi requests beech mein hain unhe kaat te hue — \`SIGTERM\` application ko exit karne se pehle chalta kaam poora karne deta hai.',
      },
      {
        wrong: `app.get("/health", async (req, res) => {
  await pool.query("SELECT 1");
  res.status(200).json({ status: "ok" });
});
// a failing dependency check restarts the whole process instead of just pausing traffic to it`,
        right: `// A failing readiness check pauses traffic to this instance (removed from
// load-balancer rotation); a separate liveness check decides whether to restart`,
        why: 'Conflating "is the process alive" with "can this instance serve traffic right now" can cause unnecessary restarts for a transient, self-recoverable issue like a brief database blip.',
        whyHi: '"Kya process zinda hai" ko "kya ye instance abhi traffic serve kar sakta hai" ke saath mila dena ek asthaayi, khud-recover-hone-laayak issue jaise ek chhoti database blip ke liye na-zaruri restarts kar sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Health check endpoints (often exactly named /health or /healthz) are a standard, universally expected part of any production service running behind a load balancer or orchestrator** — nearly every cloud platform and load balancer product documents polling one as a first-class, required feature.',
        hi: '**Health check endpoints (aksar bilkul \`/health\` ya \`/healthz\` naam ke) kisi bhi production service ka ek standard, saarvavyaapi ummeed kiya hissa hain jo ek load balancer ya orchestrator ke peeche chalta hai** — lagbhag har cloud platform aur load balancer product ek ko poll karna ek first-class, zaruri feature ki tarah document karta hai.',
      },
      {
        en: '**Kubernetes explicitly distinguishes liveness and readiness probes as separate, first-class concepts with different configured behaviors**, exactly the distinction this lesson introduces — this is not a simplification for teaching purposes but the real terminology and mechanism used in production orchestration.',
        hi: '**Kubernetes explicitly liveness aur readiness probes ko alag, first-class concepts ki tarah alag karta hai alag configure kiye vyavhaar ke saath**, bilkul wahi farak jo ye lesson introduce karta hai — ye teaching maqsad ke liye koi simplification nahi hai balki production orchestration mein istemal hui asli terminology aur mechanism hai.',
      },
      {
        en: '**Graceful shutdown handling SIGTERM is a standard, expected part of any containerized or process-managed Node.js application** — Docker itself sends SIGTERM before eventually escalating to SIGKILL when stopping a container, making this directly relevant to this course\'s earlier Docker lesson.',
        hi: '**\`SIGTERM\` sambhaalta Graceful shutdown kisi bhi containerized ya process-managed Node.js application ka ek standard, ummeed kiya hissa hai** — Docker khud ek container rokte waqt aakhirkaar \`SIGKILL\` tak badhne se pehle \`SIGTERM\` bhejta hai, ise is course ke pehle wale Docker lesson se seedha maayne-rakhta banaate hue.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is a health check that always returns 200 OK worse than having no health check at all, in a practical sense?',
        qHi: 'Ek health check jo hamesha \`200 OK\` lautaata hai practical maayne mein bilkul koi health check na hone se bura kyun hai?',
        a: 'A health check that always returns 200 OK regardless of the application\'s actual state does not merely fail to help — it actively creates a false sense of confidence that something is being monitored and verified, when in reality nothing meaningful is being checked at all. A load balancer or orchestrator configured to poll this endpoint will conclude the instance is healthy and continue routing real user traffic to it under literally any circumstance short of the process itself crashing entirely, including the exact scenario this lesson describes — a process that is technically running but whose actual ability to serve requests (because its database connection is dead, or any other critical dependency has failed) is completely broken. Without any health check configured at all, at least the absence of any automated safety net might prompt a team to rely more carefully on other monitoring or alerting. With a health check that always reports healthy, the system behaves as though a genuine safety net exists and is actively protecting against exactly this failure mode, while in practice providing none of that protection — the illusion of safety can be worse than its visible absence, since it can suppress the very alertness that would otherwise catch the problem some other way.',
        aHi: 'Ek health check jo application ki asli sthiti se bekhabar hamesha \`200 OK\` lautaata hai sirf madad karne mein fail nahi hota — ye actively ek jhoothi confidence ki bhaavna paida karta hai ki kuch monitor aur verify ho raha hai, jab asal mein kuch bhi maayne-rakhta check nahi ho raha. Ek load balancer ya orchestrator jo is endpoint ko poll karne ke liye configure kiya hai ye nateeja nikaalega ki instance healthy hai aur asli user traffic use bhejta rahega literally kisi bhi sthiti mein khud process ke poori tarah crash hone se kam mein, is lesson mein describe hue bilkul scenario sameet — ek process jo technically chal raha hai par jiski requests serve karne ki asli kshamta (kyunki uska database connection mar chuka hai, ya koi bhi doosri zaruri dependency fail hui hai) poori tarah toot chuki hai. Bilkul koi health check configure na hote hue bhi, kam se kam kisi bhi automated safety net ki gairhaazri ek team ko doosri monitoring ya alerting par zyaada dhyaan se bharosa karne ke liye prerit kar sakti hai. Ek health check ke saath jo hamesha healthy report karta hai, system aise vyavhaar karta hai jaise ek asli safety net maujood hai aur bilkul is fail-hone ki tarah ke khilaaf actively bachaao kar raha hai, jabki practice mein us bachaao mein se kuch bhi na dete hue — safety ka bhram uski dikhaayi dene laayak gairhaazri se bura ho sakta hai, kyunki ye us alertness ko dabaa sakta hai jo warna samasya ko kisi aur tarike se pakadti.',
      },
      {
        q: 'What is the actual mechanism by which server.close() combined with a SIGTERM handler avoids cutting off in-flight requests, compared to simply killing the process?',
        qHi: 'Asal mein wo mechanism kya hai jismein \`server.close()\` ek \`SIGTERM\` handler ke saath jode hue in-flight requests kaatne se bachta hai, process ko bas maarne ke muqable?',
        a: 'Simply terminating a process (via SIGKILL, or an abrupt restart with no coordination) stops that process\'s execution immediately, at whatever exact point it happened to be at that moment — if it was in the middle of reading from a database, writing a response, or any other step of handling a request, all of that in-progress work simply ceases to exist, and the client that sent that request receives no response at all, typically experiencing a dropped or reset connection. Node\'s built-in HTTP server\'s close() method behaves fundamentally differently: calling it immediately stops the server from accepting any brand-new incoming connections, but it explicitly does NOT forcibly terminate connections and requests that are already in progress at the moment it is called — those continue executing normally, exactly as they would have without close() being called, running through the rest of the application\'s logic and eventually sending their actual, correct response back to the client that is still waiting for it. The close() method\'s callback function is specifically designed to fire only once every one of those already-in-progress requests has genuinely finished, not immediately when close() is first called — this is precisely the mechanism that allows code such as pool.end() and process.exit() to be deferred until it is safe to actually shut down without cutting anything off midway. The SIGTERM handler is what allows this entire close()-based sequence to be initiated deliberately and cleanly, in response to an explicit "please shut down" signal, rather than the process being forcibly and immediately terminated with no opportunity to run this graceful sequence at all.',
        aHi: 'Bas ek process ko khatam karna (\`SIGKILL\` se, ya bina kisi coordination ke ek abrupt restart) us process ke execution ko turant rokta hai, jis bhi bilkul point par wo us pal tha — agar wo database se padh raha tha, ek response likh raha tha, ya ek request sambhaalne ka koi doosra step, wo saara chal raha kaam bas maujood hona band ho jaata hai, aur wo client jisne wo request bheji thi bilkul koi jawaab nahi paata, aam taur par ek tooti ya reset hui connection anubhav karte hue. Node ke built-in HTTP server ke \`close()\` method ka vyavhaar buniyaadi taur par alag hai: ise bulaana turant server ko koi bhi bilkul-nayi aati connections accept karne se rokta hai, par ye explicitly un connections aur requests ko jabardasti khatam NAHI karta jo jab ye bulaayi jaati hai us waqt pehle se chal rahi hain — wo normal taur par chalti rehti hain, bilkul jaisa wo \`close()\` bulaaye bina chalti, application ki logic ke baaki hisse ke through chalte hue aur aakhirkaar apna asli, sahi jawaab us client ko wapas bhejte hue jo abhi bhi uska intezaar kar raha hai. \`close()\` method ka callback function khaas taur par isliye design kiya gaya hai ki wo sirf tab fire ho jab in sab pehle-se-chal-rahi requests mein se har akeli sach mein poori ho chuki ho, turant nahi jab \`close()\` pehli baar bulaayi jaati hai — bilkul yehi mechanism hai jo \`pool.end()\` aur \`process.exit()\` jaise code ko tab tak taalne deta hai jab tak asal mein beech mein kuch kaate bina band karna surakshit ho. \`SIGTERM\` handler wo hai jo is poori \`close()\`-based sequence ko jaan-boojhkar aur saaf tarike se shuru hone deta hai, ek explicit "kripya band karo" signal ka jawaab dete hue, process ke jabardasti aur turant khatam hone ke bajaye is graceful sequence ko bilkul chalaane ke mauke bina.',
      },
      {
        q: 'Why is it important to distinguish liveness from readiness rather than using a single health check for both purposes?',
        qHi: 'Liveness ko readiness se alag karna kyun zaruri hai ek akele health check ko dono maqsad ke liye istemal karne ke bajaye?',
        a: 'A liveness check answers "is this process itself fundamentally functioning, or has it gotten into a state (hung, deadlocked, stuck in an infinite loop) that it cannot recover from on its own?" — a failure here typically warrants a full process restart, since the process is presumed to be unable to fix itself. A readiness check answers a genuinely different question: "leaving aside whether the process is alive, is this specific instance currently able to correctly serve real traffic right now?" — a failure here (a temporarily lost database connection, an external dependency briefly being unavailable) often reflects a transient condition the process itself can recover from on its own, without needing to be restarted at all, once the underlying issue resolves. If a single combined check is used for both purposes, a transient, self-recoverable readiness failure (a brief database blip) would incorrectly trigger the more drastic liveness response — restarting a perfectly healthy process — which is not only unnecessary but can actively make matters worse, since restarting takes real time during which that instance serves no traffic at all, is potentially disruptive to any in-flight work, and does nothing to address a problem that was never actually about the process itself. Keeping the two checks separate allows the appropriate, proportionate response for each distinct kind of failure: pause traffic and wait for a readiness failure to potentially self-resolve, but restart only when a liveness failure indicates the process genuinely cannot recover on its own.',
        aHi: 'Ek liveness check ye sawaal ka jawaab deta hai "kya ye process khud buniyaadi taur par kaam kar raha hai, ya ye ek aisi sthiti mein pahunch gaya hai (atka, deadlocked, ek infinite loop mein phansa) jise ye khud thik nahi kar sakta?" — yahan ek asafalta aam taur par ek poori process restart ka hakdaar hai, kyunki process ko khud thik na kar paane wala maana jaata hai. Ek readiness check ek sach mein alag sawaal ka jawaab deta hai: "process zinda hai ya nahi ye chhodkar, kya ye khaas instance abhi asli traffic sahi tarike se serve kar sakta hai?" — yahan ek asafalta (ek asthaayi taur par khoya database connection, ek bahari dependency thodi der ke liye upalabdh na hona) aksar ek asthaayi sthiti darzhaata hai jise process khud recover kar sakta hai, kisi restart ki zarurat bina, ek baar underlying issue theek ho jaaye. Agar ek akela mila-jula check dono maqsad ke liye istemal hota hai, ek asthaayi, khud-recover-hone-laayak readiness asafalta (ek chhoti database blip) galat tarike se zyaada gambhir liveness jawaab trigger karegi — ek poori tarah healthy process ko restart karna — jo sirf na-zaruri nahi hai balki asal mein cheezon ko bura bana sakta hai, kyunki restart karna asli waqt leta hai jis dauraan wo instance bilkul koi traffic serve nahi karta, kisi bhi in-flight kaam ke liye mumkin taur par disruptive hai, aur ek aisi samasya ke liye kuch nahi karta jiska asal mein process khud se kabhi lena-dena tha hi nahi. Do checks ko alag rakhna har alag kism ki asafalta ke liye uchit, saman jawaab deta hai: ek readiness asafalta ke liye traffic pause karo aur uske khud-hal-hone ka intezaar karo, par sirf tab restart karo jab ek liveness asafalta ishara kare ki process sach mein khud recover nahi kar sakta.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /health route that always returns 200 alongside a route querying the database. Manually stop your local database and confirm /health keeps reporting "ok" while the database-dependent route now fails.',
        taskHi: 'Toota \`/health\` route banao jo hamesha 200 lautaata hai, ek database query karta route ke saath. Apna local database manually rokho aur confirm karo \`/health\` "ok" report karte rehta hai jabki database-nirbhar route ab fail hota hai.',
        hint: 'Stopping a local Postgres/MySQL service (rather than the app) is enough to simulate the connection loss this lesson describes.',
        hintHi: 'Ek local Postgres/MySQL service rokna (app nahi) is lesson mein bataayi connection loss simulate karne ke liye kaafi hai.',
      },
      {
        task: 'Fix the /health route to genuinely check the database. Repeat the same test and confirm /health now correctly returns 503 the moment the database becomes unreachable, and returns to 200 once it is available again.',
        taskHi: '\`/health\` route ko asal mein database check karne ke liye theek karo. Wahi test dohraao aur confirm karo \`/health\` ab sahi tarike se \`503\` lautaata hai jis pal database unreachable ho jaata hai, aur wapas \`200\` par aata hai ek baar wo dobara upalabdh ho.',
        hint: 'Poll the /health endpoint in a simple loop every second while stopping and restarting the database, to directly observe the transition happen.',
        hintHi: 'Database rokte aur dobara start karte waqt ek saadhe loop mein har second \`/health\` endpoint poll karo, transition ko seedha hote dekhne ke liye.',
      },
      {
        task: 'Implement SIGTERM handling with server.close() and a shutdown flag. Start a deliberately slow route (an artificial delay), send it a request, then trigger SIGTERM (or kill -TERM <pid>) while that request is still in flight, and confirm it still receives its normal response before the process exits.',
        taskHi: '\`server.close()\` aur ek shutdown flag ke saath \`SIGTERM\` handling lagu karo. Ek jaan-boojhkar dheema route shuru karo (ek kritrim deri), use ek request bhejo, phir \`SIGTERM\` trigger karo (ya \`kill -TERM <pid>\`) jabki wo request abhi bhi in-flight ho, aur confirm karo ye process exit hone se pehle abhi bhi apna normal jawaab paati hai.',
        hint: 'Log a timestamp at the very start and very end of the slow route, and another when SIGTERM is received, to directly see the ordering of events confirming the request finished before the process actually exited.',
        hintHi: 'Dheeme route ki bilkul shuruaat aur bilkul aakhir mein ek timestamp log karo, aur ek jab \`SIGTERM\` mile, seedha events ka kram dekhne ke liye confirm karte hue ki request process ke asal mein exit hone se pehle poori hui.',
      },
    ],

    keyTakeaways: [
      'A load balancer can only correctly avoid routing traffic to a broken instance if a health check actually verifies real dependencies (like the database) rather than merely confirming the process responds at all.',
      'Liveness (should this process be restarted?) and readiness (can this instance serve traffic right now?) are distinct questions — conflating them causes unnecessary restarts for transient, self-recoverable issues.',
      'SIGKILL terminates a process immediately with no opportunity to react, cutting off whatever requests happen to be in flight — SIGTERM asks a process to shut down cleanly, giving it a chance to finish current work first.',
      'server.close() stops accepting new connections but lets already-in-progress requests finish before its callback fires, which is the actual mechanism that makes a shutdown "graceful" rather than abrupt.',
      'A shutdown flag checked early in the middleware chain ensures brand-new requests arriving after shutdown begins are told to retry elsewhere (503) rather than being accepted and then potentially cut off.',
      'This exact mechanism is what makes PM2\'s zero-downtime reload (covered in the clustering lesson) genuinely zero-downtime — without correct SIGTERM handling in every worker, a "reload" still cuts off in-flight requests like a raw process kill.',
    ],
    keyTakeawaysHi: [
      'Ek load balancer sahi tarike se ek toote instance ko traffic bhejne se sirf tab bach sakta hai jab ek health check asal mein asli dependencies (jaise database) verify kare, sirf ye confirm karne ke bajaye ki process bilkul jawaab deta hai.',
      'Liveness (kya is process ko restart karna chahiye?) aur readiness (kya ye instance abhi traffic serve kar sakta hai?) alag sawaal hain — inhe mila dena asthaayi, khud-recover-hone-laayak issues ke liye na-zaruri restarts karta hai.',
      '\`SIGKILL\` ek process ko turant khatam kar deta hai kisi react karne ke mauke bina, jo bhi requests in-flight hain unhe kaat te hue — \`SIGTERM\` ek process se saaf tarike se band hone ke liye poochta hai, use pehle chalta kaam poora karne ka mauka dete hue.',
      '\`server.close()\` naya connections accept karna rokta hai par pehle-se-chal-rahi requests ko uska callback fire hone se pehle poora hone deta hai, jo asal mein wo mechanism hai jo shutdown ko "graceful" banaata hai, abrupt nahi.',
      'Middleware chain mein jaldi check hua ek shutdown flag sunishchit karta hai ki shutdown shuru hone ke baad aati bilkul-nayi requests ko kahin aur retry karne ko kaha jaaye (\`503\`) accept hokar phir mumkin taur par kaate jaane ke bajaye.',
      'Ye bilkul mechanism hai jo PM2 ke zero-downtime reload (clustering lesson mein cover hua) ko sach mein zero-downtime banaata hai — har worker mein sahi \`SIGTERM\` handling ke bina, ek "reload" abhi bhi in-flight requests ko ek raw process kill ki tarah kaatta hai.',
    ],
  },
];
