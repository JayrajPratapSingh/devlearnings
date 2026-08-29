/**
 * Node.js Complete Course — Module 6: Pro, lesson 2.
 *
 * Clustering and PM2: a single `node server.js` process runs on exactly one
 * CPU core, no matter how many cores the machine has, and an uncaught
 * exception anywhere takes the ENTIRE process down, disconnecting every
 * single user, not just the one request that triggered it. Broken example:
 * a single process on an 8-core machine leaving 7 cores idle under load,
 * with no recovery if the process crashes. Fixed with Node's built-in
 * cluster module (one worker process per CPU core, load distributed by the
 * OS, automatic respawn on a worker crash) and then PM2 as the standard,
 * production-grade tool that wraps this exact mechanism plus process
 * monitoring, log management, and zero-downtime reloads.
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

export const NODE_MODULE_6_PART2: CourseLesson[] = [
  {
    slug: 'clustering-and-pm2',
    title: 'Clustering and PM2: Using All Your CPU Cores, Surviving Crashes',
    titleHi: 'Clustering Aur PM2: Sabhi CPU Cores Istemal Karna, Crashes Se Bachna',
    description: 'A production server with 8 CPU cores runs one Node.js process — 7 cores sit completely idle under load, and one uncaught exception anywhere takes down every single connected user at once.',
    descriptionHi: 'Ek production server jismein 8 CPU cores hain ek Node.js process chalaata hai — 7 cores load ke neeche poori tarah khaali baithe rehte hain, aur kahin ek uncaught exception ek saath har connected user ko gira deta hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A restaurant with eight fully equipped kitchen stations, but only one chef working, while the other seven stations sit completely empty — and if that one chef collapses, the entire restaurant stops serving anyone, immediately, with no backup.** Running a single Node.js process on a multi-core server is like a restaurant owner who built eight identical, fully stocked cooking stations, hired only one chef, and has that one chef work alone at just one station — orders pile up waiting for that single chef\'s attention no matter how many empty, ready-to-use stations sit unused right next to them, because nothing about the restaurant\'s design lets more than one station actually get used at the same time. If that one chef ever has a genuine medical emergency and has to stop entirely, there is no one else in the kitchen at all — the restaurant does not serve fewer customers, it serves ZERO customers, instantly, for everyone who happens to be there, whether their own order had anything to do with what caused the chef\'s collapse or not. An owner who instead hires seven more chefs, one for each remaining station, and puts a host at the door directing each new customer to whichever chef currently has room, gets a restaurant that can genuinely cook eight orders at once instead of one — and if any single chef has to step away, the host simply stops sending new customers to that one empty station and keeps directing everyone else to the seven who are still working, while a manager quietly gets a replacement chef ready to take that station back over.',
      hi: '**Ek restaurant jismein aath poori tarah taiyaar kitchen stations hain, par sirf ek chef kaam kar raha hai, jabki baaki saat stations bilkul khaali baithe hain — aur agar wo ek chef gir jaaye, poora restaurant turant sabko serve karna band kar deta hai, koi backup nahi.** Ek multi-core server par ek akela Node.js process chalaana ek aise restaurant owner jaisa hai jisne aath ek-jaisi, poori tarah stocked cooking stations banaayi, sirf ek chef hire kiya, aur us ek chef ko akele sirf ek station par kaam karne diya — orders us ek akele chef ke dhyaan ka intezaar karte hue dher ho jaate hain chahe unke bilkul paas kitne bhi khaali, istemal-ke-liye-taiyaar stations kyun na baithe hon, kyunki restaurant ke design mein kuch bhi ek se zyaada station ko ek hi waqt mein asal mein istemal hone nahi deta. Agar us ek chef ko kabhi ek asli medical emergency ho jaaye aur use poori tarah rukna pade, kitchen mein koi aur hai hi nahi — restaurant kam customers serve nahi karta, ye ZERO customers serve karta hai, turant, har us insaan ke liye jo wahan samyog se maujood hai, chahe unke apne order ka chef ke girne se kuch bhi lena-dena ho ya na ho. Ek owner jo iske bajaye saat aur chefs hire karta hai, baaki har station ke liye ek, aur darwaaze par ek host rakhta hai jo har naye customer ko jis bhi chef ke paas abhi jagah hai us taraf bhejta hai, ek aisa restaurant paata hai jo sach mein ek ke bajaye ek saath aath orders pakaa sakta hai — aur agar koi ek chef ko peeche hatna pade, host bas us ek khaali station par naye customers bhejna band kar deta hai aur baaki sabko un saat ki taraf bhejta rehta hai jo abhi kaam kar rahe hain, jabki ek manager chupke se us station ko wapas sambhaalne ke liye ek badla hua chef taiyaar karta hai.',
    },

    simple: `**Start broken.** An ordinary, single Node.js process, run the standard way:

\`\`\`js
// server.js
const express = require("express");
const app = express();

app.get("/report", (req, res) => {
  const result = fibonacci(40); // CPU-heavy work, from the previous lesson
  res.json({ result });
});

app.listen(3000, () => console.log("Server running on port 3000"));
\`\`\`

\`\`\`bash
node server.js
\`\`\`

This process runs correctly, and handles real traffic — but it runs as exactly ONE operating-system process, which means it can only ever use ONE CPU core, regardless of how many the underlying machine actually has. A production server with 8 CPU cores running this exact code leaves 7 of those 8 cores sitting completely idle, all the time, no matter how much concurrent traffic arrives — the machine\'s CPU capacity is enormously underused, purely because nothing about a single Node.js process spreads work across more than one core; each core is a genuinely separate hardware resource, and one process can only ever be scheduled onto one core at a time. Separately, and just as seriously: if this single process ever crashes — an uncaught exception anywhere in the code, a bug that was never supposed to happen but does — the ENTIRE process terminates immediately, and since this one process was the only thing listening on port 3000, EVERY currently connected user is disconnected at once, and no new requests can be served by anyone until a human notices and manually restarts it.

**The fix, step one: Node\'s built-in \`cluster\` module — one worker process per CPU core**

\`\`\`js
const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(\`Worker \${worker.process.pid} died, starting a replacement\`);
    cluster.fork();
  });
} else {
  require("./server"); // each worker runs its own full copy of the actual app
}
\`\`\`

\`\`\`ts
import cluster from "cluster";
import os from "os";

if (cluster.isPrimary) {
  const numCPUs: number = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(\`Worker \${worker.process.pid} died, starting a replacement\`);
    cluster.fork();
  });
} else {
  require("./server");
}
\`\`\`

\`cluster.fork()\`, called once per available CPU core (\`os.cpus().length\` reports how many the machine actually has), creates genuinely separate operating-system processes — each a full, independent copy of the application, capable of being scheduled onto its own separate core, running truly in parallel with the others. Node.js\'s \`cluster\` module automatically distributes incoming connections across these worker processes (commonly round-robin, depending on the operating system), so incoming traffic is now spread across every available core instead of being funneled entirely through one. Critically, the primary process\'s \`cluster.on("exit", ...)\` handler means that if any ONE worker crashes, only that single worker\'s currently-in-flight requests are affected — the other workers keep serving every other user without interruption, and the primary immediately forks a fresh replacement worker to restore full capacity, all without a human needing to notice or intervene.

**Step two: PM2, the production-standard tool that wraps this exact mechanism**

\`\`\`bash
npm install -g pm2
pm2 start server.js -i max
\`\`\`

Hand-writing the \`cluster\` module code above is a genuinely useful way to understand the underlying mechanism, but in real production use, teams overwhelmingly rely on PM2 (a process manager built specifically for Node.js) instead of maintaining this cluster-management code by hand — \`pm2 start server.js -i max\` does exactly what the hand-written primary/worker code above does (one worker process per CPU core, automatic respawn on crash), while also adding production-grade process monitoring, structured log management, and \`pm2 reload\` for restarting all workers one at a time with zero downtime during a deployment, none of which the raw \`cluster\` module provides on its own.`,

    simpleHi: `**Toote hue se shuru.** Ek aam, akela Node.js process, standard tarike se chalaaya gaya:

\`\`\`js
// server.js
const express = require("express");
const app = express();

app.get("/report", (req, res) => {
  const result = fibonacci(40); // pichhle lesson se CPU-heavy kaam
  res.json({ result });
});

app.listen(3000, () => console.log("Server running on port 3000"));
\`\`\`

\`\`\`bash
node server.js
\`\`\`

Ye process sahi tarike se chalta hai, aur asli traffic sambhaalta hai — par ye bilkul EK operating-system process ki tarah chalta hai, jiska matlab hai ye kabhi sirf EK CPU core istemal kar sakta hai, underlying machine ke paas asal mein chahe kitne bhi hon. Ek production server 8 CPU cores wala jo bilkul yehi code chalaata hai un 8 mein se 7 cores ko hamesha, poori tarah khaali baithne deta hai, chahe kitna bhi concurrent traffic aaye — machine ki CPU kshamta bahut kam istemal hoti hai, poori tarah isliye kyunki ek akele Node.js process ke baare mein kuch bhi kaam ko ek se zyaada core ke aar-paar nahi phailaata; har core ek sach mein alag hardware resource hai, aur ek process kabhi ek waqt mein sirf ek core par hi schedule ho sakta hai. Alag se, aur utna hi gambhir taur par: agar ye akela process kabhi crash ho jaaye — code mein kahin ek uncaught exception, ek bug jo kabhi hona nahi chahiye tha par ho gaya — POORA process turant khatam ho jaata hai, aur kyunki ye ek process port 3000 par sunne wali akeli cheez thi, HAR abhi connected user ek saath disconnect ho jaata hai, aur koi bhi naya request kisi ke dwara serve nahi ho sakta jab tak koi insaan notice na kare aur haath se use restart na kare.

**Fix, pehla kadam: Node ka built-in \`cluster\` module — prati CPU core ek worker process**

\`\`\`js
const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(\`Worker \${worker.process.pid} died, starting a replacement\`);
    cluster.fork();
  });
} else {
  require("./server"); // har worker asli app ki apni poori copy chalaata hai
}
\`\`\`

\`\`\`ts
import cluster from "cluster";
import os from "os";

if (cluster.isPrimary) {
  const numCPUs: number = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(\`Worker \${worker.process.pid} died, starting a replacement\`);
    cluster.fork();
  });
} else {
  require("./server");
}
\`\`\`

\`cluster.fork()\`, har upalabdh CPU core ke liye ek baar bulaaya gaya (\`os.cpus().length\` batata hai machine ke paas asal mein kitne hain), sach mein alag operating-system processes banaata hai — har ek application ki ek poori, mustaqil copy, apne alag core par schedule hone ke laayak, doosron ke saath sach mein parallel mein chalti hui. Node.js ka \`cluster\` module apne aap aati connections ko in worker processes ke aar-paar baantta hai (aam taur par round-robin, operating system par nirbhar), isliye aata traffic ab har upalabdh core ke aar-paar phaila hua hai, poori tarah ek ke through funnel hone ke bajaye. Bahut zaruri, primary process ka \`cluster.on("exit", ...)\` handler matlab hai ki agar koi EK worker crash hota hai, sirf us akele worker ki abhi-chal-rahi requests hi asar mein aati hain — doosre workers baaki har user ko bina rukaawat serve karte rehte hain, aur primary turant poori kshamta bahaal karne ke liye ek taaza replacement worker fork karta hai, sab kuch bina kisi insaan ke notice karne ya beech mein aane ki zarurat ke.

**Kadam do: PM2, production-standard tool jo bilkul isi mechanism ko lapetta hai**

\`\`\`bash
npm install -g pm2
pm2 start server.js -i max
\`\`\`

Upar \`cluster\` module code haath se likhna underlying mechanism samajhne ka ek sach mein kaam ka tarika hai, par asli production istemal mein, teams bahut zyaada PM2 (Node.js ke liye khaas taur par bana ek process manager) par bharosa karti hain is cluster-management code ko haath se maintain karne ke bajaye — \`pm2 start server.js -i max\` bilkul wahi karta hai jo upar wala haath-se-likha primary/worker code karta hai (prati CPU core ek worker process, crash par apne aap respawn), saath hi production-grade process monitoring, structured log management, aur deployment ke dauraan ek-ek karke sabhi workers ko zero downtime ke saath restart karne ke liye \`pm2 reload\` jodte hue, inmein se kuch bhi raw \`cluster\` module apne aap nahi deta.`,

    content: `## Why more processes, not more threads, is the fix here

\`\`\`js
// Worker Threads (previous lesson): parallelize CPU-bound work WITHIN one process
const worker = new Worker("./heavy-computation.js");

// Clustering (this lesson): run multiple independent PROCESSES to use multiple cores
cluster.fork();
\`\`\`

This lesson\'s fix is a deliberate step up from the previous lesson\'s Worker Threads, addressing a genuinely different problem. Worker Threads solve the case where ONE request needs to perform heavy CPU-bound computation without blocking other requests being served by the SAME process. Clustering solves a broader, application-wide problem: a single Node.js PROCESS, no matter how well-written, is fundamentally limited to one CPU core\'s worth of computation capacity, since a single process is what an operating system schedules onto a single core at a time. Running multiple independent processes — each capable of independently handling requests, each schedulable onto a different core — is what actually lets an application\'s total request-handling capacity scale with the number of cores a machine has, which is a different axis of scaling than making any one individual request\'s computation faster.

## Load distribution and shared server state: what clustering does and does not give you for free

\`\`\`js
// WRONG assumption — this in-memory count is NOT shared across cluster workers
let requestCount = 0;
app.get("/stats", (req, res) => {
  requestCount++; // each worker process has its OWN separate requestCount
  res.json({ requestCount });
});
\`\`\`

Node.js\'s \`cluster\` module automatically distributes incoming connections across worker processes, but each worker is a genuinely separate operating-system process with its OWN separate memory space — this means any state kept in an ordinary JavaScript variable (an in-memory counter, an in-memory cache, an in-memory session store) is NOT automatically shared between workers; each worker has its own independent copy, and a request handled by worker 2 has no visibility into a variable that was incremented by worker 5. This is precisely why this course\'s earlier lessons emphasized keeping genuinely shared, authoritative state in the database (or, for something like rate-limiting or session data specifically, in a shared external store like Redis, as covered in this course\'s rate-limiting and sessions-vs-tokens lessons) rather than in an ordinary in-process variable — a clustered application depends on this discipline even more than a single-process one, since "in-memory" now silently means "in ONE of several separate memories," not one shared memory all workers can see.

## PM2\'s ecosystem file: configuring cluster mode declaratively

\`\`\`js
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "my-api",
    script: "./server.js",
    instances: "max",       // one worker per available CPU core
    exec_mode: "cluster",
    env_production: { NODE_ENV: "production" },
  }],
};
\`\`\`

\`\`\`bash
pm2 start ecosystem.config.js --env production
\`\`\`

Beyond a single command-line invocation, PM2 supports a configuration file (commonly named \`ecosystem.config.js\`) that declaratively describes how an application should run — how many instances, which mode, and environment-specific settings (following this course\'s earlier \`process.env\` configuration lesson) — checked into the project\'s own source control alongside the application code, rather than depending on someone remembering the exact command-line flags to use every time the application is deployed or restarted.

## Zero-downtime reloads: why pm2 reload is meaningfully different from simply restarting

\`\`\`bash
# Stops everything, then starts again — a real gap with no server available at all
pm2 restart my-api

# Restarts workers ONE AT A TIME, always keeping at least some workers serving
pm2 reload my-api
\`\`\`

Because a clustered application already runs multiple independent worker processes, PM2 can restart them one at a time during a deployment (\`pm2 reload\`) rather than stopping all of them simultaneously and then starting the new version (\`pm2 restart\`, which briefly leaves zero workers available to handle any request at all) — with \`reload\`, at every point during the deployment, most workers are still running the previous version and actively serving traffic while a smaller number are briefly restarted with the new code, one group at a time, so real users experience no interruption at all during a routine deployment. This capability is a direct, practical benefit of having already invested in a multi-process, clustered architecture in the first place.`,

    contentHi: `## Zyaada processes, zyaada threads nahi, yahan fix kyun hai

\`\`\`js
// Worker Threads (pichhla lesson): ek process KE ANDAR CPU-bound kaam ko parallel banaao
const worker = new Worker("./heavy-computation.js");

// Clustering (ye lesson): kai cores istemal karne ke liye kai mustaqil PROCESSES chalaao
cluster.fork();
\`\`\`

Is lesson ka fix pichhle lesson ke Worker Threads se ek jaan-boojhkar kadam aage hai, ek sach mein alag samasya sambhaalte hue. Worker Threads us case ko solve karte hain jahan EK request ko doosri requests ko roke bina bhaari CPU-bound computation karni hai jo USI process dwara serve ho rahi hain. Clustering ek badi, poori-application-wide samasya solve karta hai: ek akela Node.js PROCESS, chahe kitna bhi achha likha ho, buniyaadi taur par ek CPU core ki computation kshamta tak simit hai, kyunki ek akela process wahi cheez hai jise ek operating system ek waqt mein ek core par schedule karta hai. Kai mustaqil processes chalaana — har ek requests ko mustaqil taur par sambhaalne ke kaabil, har ek ko alag core par schedule-hone-laayak — asal mein wo cheez hai jo ek application ki kul request-sambhaalne ki kshamta ko machine ke paas kitne cores hain uske saath scale karne deti hai, jo scaling ka ek alag axis hai kisi ek akeli request ki computation ko tez banaane se.

## Load distribution aur shared server state: clustering kya deta hai aur kya muft mein nahi deta

\`\`\`js
// GALAT maanyata — ye in-memory count cluster workers ke aar-paar SHARE NAHI hai
let requestCount = 0;
app.get("/stats", (req, res) => {
  requestCount++; // har worker process ka apna ALAG requestCount hai
  res.json({ requestCount });
});
\`\`\`

Node.js ka \`cluster\` module apne aap aati connections ko worker processes ke aar-paar baantta hai, par har worker apni ALAG memory space wali ek sach mein alag operating-system process hai — iska matlab hai koi bhi sthiti ek aam JavaScript variable mein rakhi (ek in-memory counter, ek in-memory cache, ek in-memory session store) workers ke beech apne aap SHARE NAHI hoti; har worker ki apni mustaqil copy hai, aur worker 2 dwara sambhaali ek request ko us variable mein koi visibility nahi hai jo worker 5 dwara badhaaya gaya tha. Bilkul isi wajah se is course ke pehle wale lessons ne sach mein shared, adhikrit sthiti ko database mein rakhne par zor diya (ya, khaas taur par rate-limiting ya session data jaisi kisi cheez ke liye, Redis jaise ek shared bahari store mein, is course ke rate-limiting aur sessions-vs-tokens lessons mein cover hua) ek aam in-process variable ke bajaye — ek clustered application is anushasan par ek akele-process wale se bhi zyaada nirbhar karta hai, kyunki "in-memory" ab chupke se matlab hai "kai alag memories mein se EK mein," ek shared memory nahi jise sab workers dekh sakein.

## PM2 ki ecosystem file: cluster mode ko declaratively configure karna

\`\`\`js
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "my-api",
    script: "./server.js",
    instances: "max",       // prati upalabdh CPU core ek worker
    exec_mode: "cluster",
    env_production: { NODE_ENV: "production" },
  }],
};
\`\`\`

\`\`\`bash
pm2 start ecosystem.config.js --env production
\`\`\`

Ek akeli command-line invocation se aage, PM2 ek configuration file support karta hai (aam taur par \`ecosystem.config.js\` naam se) jo declaratively describe karti hai ki ek application kaise chalna chahiye — kitni instances, kaunsa mode, aur environment-khaas settings (is course ke pehle wale \`process.env\` configuration lesson ka palan karte hue) — project ke apne source control mein application code ke saath check-in ki hui, kisi ke bilkul command-line flags yaad rakhne par nirbhar hone ke bajaye jo har baar application deploy ya restart hote waqt istemal karne chahiye.

## Zero-downtime reloads: \`pm2 reload\` sirf restart karne se maayne-rakhta alag kyun hai

\`\`\`bash
# Sab kuch rokta hai, phir dobara shuru karta hai — ek asli gap koi bhi server bilkul upalabdh na hone ke saath
pm2 restart my-api

# Workers ko EK-EK KARKE restart karta hai, hamesha kam se kam kuch workers ko serve karte rakhte hue
pm2 reload my-api
\`\`\`

Kyunki ek clustered application pehle se hi kai mustaqil worker processes chalaata hai, PM2 unhe ek-ek karke ek deployment ke dauraan restart kar sakta hai (\`pm2 reload\`) unhe sabko ek saath rokne aur phir naya version shuru karne ke bajaye (\`pm2 restart\`, jo thodi der ke liye zero workers ko kisi bhi request sambhaalne ke liye upalabdh chhod deta hai) — \`reload\` ke saath, deployment ke dauraan har point par, zyaadatar workers abhi bhi pichhla version chala rahe hain aur actively traffic serve kar rahe hain jabki kam tadaad thodi der ke liye naye code se restart hoti hai, ek waqt mein ek group, taaki asli users ek routine deployment ke dauraan bilkul koi rukaawat na anubhav karein. Ye kshamta pehli jagah ek multi-process, clustered architecture mein pehle se nivesh karne ka ek seedha, practical faayda hai.`,

    examples: [
      {
        title: 'Broken: a single process leaves most CPU cores idle and has no crash recovery',
        titleHi: 'Toota: ek akela process zyaadatar CPU cores ko khaali chhodta hai aur koi crash recovery nahi hai',
        code: `app.listen(3000);
// runs as exactly ONE OS process, on exactly ONE CPU core
// an uncaught exception here terminates the entire process — every user disconnected`,
        codeJs: `const express = require("express");
const app = express();

app.get("/report", (req, res) => {
  const result = fibonacci(40);
  res.json({ result });
});

app.listen(3000, () => console.log("Server running on port 3000"));
// node server.js — one process, one core, no automatic recovery from a crash`,
        codeTs: `import express, { Request, Response } from "express";
const app = express();

app.get("/report", (req: Request, res: Response): void => {
  const result = fibonacci(40);
  res.json({ result });
});

app.listen(3000, () => console.log("Server running on port 3000"));
// Correctly typed, completely valid TypeScript — the problem is entirely
// about how many OS processes are running, not a type or logic error.`,
        output: `On an 8-core machine, this process can only ever be scheduled onto one
core — the other 7 sit idle under heavy load. If an uncaught exception
occurs anywhere, the process exits and every connected user is
disconnected until a human manually restarts it.`,
        explain: 'A single Node.js process is, from the operating system\'s perspective, one schedulable unit — it genuinely cannot occupy more than one CPU core at a time, regardless of how the application code itself is written.',
        explainHi: 'Ek akela Node.js process, operating system ke nazariye se, ek schedule-hone-laayak ikaai hai — ye sach mein ek waqt mein ek se zyaada CPU core par kabza nahi kar sakta, chahe application code khud kaise bhi likha ho.',
      },
      {
        title: 'Fixed: Node\'s cluster module — one worker per core, automatic respawn',
        titleHi: 'Theek: Node ka \`cluster\` module — prati core ek worker, apne aap respawn',
        code: `if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) cluster.fork();
  cluster.on("exit", () => cluster.fork());
} else {
  require("./server");
}`,
        codeJs: `const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(\`Worker \${worker.process.pid} died, starting a replacement\`);
    cluster.fork();
  });
} else {
  require("./server");
}`,
        codeTs: `import cluster from "cluster";
import os from "os";

if (cluster.isPrimary) {
  const numCPUs: number = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(\`Worker \${worker.process.pid} died, starting a replacement\`);
    cluster.fork();
  });
} else {
  require("./server");
}`,
        outputJs: `On the same 8-core machine, 8 independent worker processes now run
simultaneously, one per core, all serving requests in parallel. If one
worker crashes, the other 7 continue serving unaffected, and the
primary immediately forks a replacement.`,
        outputTs: `// Identical behaviour. cluster.isPrimary distinguishes the one
// coordinating process from the worker processes it manages — each
// worker executes the else branch, running the actual application.`,
        explain: 'Every worker is a genuinely separate OS process, schedulable onto its own core — this is what actually lets total capacity scale with the number of cores, unlike Worker Threads, which parallelize within one process.',
        explainHi: 'Har worker ek sach mein alag OS process hai, apne core par schedule-hone-laayak — yehi asal mein kul kshamta ko cores ki tadaad ke saath scale karne deta hai, Worker Threads ke ulta, jo ek process ke andar parallel banaate hain.',
      },
      {
        title: 'Production practice: PM2 instead of hand-written cluster code',
        titleHi: 'Production practice: haath-se-likhe cluster code ke bajaye PM2',
        code: `pm2 start server.js -i max
// one worker per CPU core, automatic crash recovery, log management, zero-downtime reloads`,
        codeJs: `// server.js — no cluster code needed at all, PM2 handles it externally
const express = require("express");
const app = express();

app.get("/report", (req, res) => {
  const result = fibonacci(40);
  res.json({ result });
});

app.listen(3000, () => console.log("Server running on port 3000"));

// From the terminal:
// pm2 start server.js -i max
// pm2 logs
// pm2 reload server`,
        codeTs: `// server.ts — same, no cluster code needed at all
import express, { Request, Response } from "express";
const app = express();

app.get("/report", (req: Request, res: Response): void => {
  const result = fibonacci(40);
  res.json({ result });
});

app.listen(3000, () => console.log("Server running on port 3000"));

// From the terminal:
// pm2 start dist/server.js -i max
// pm2 logs
// pm2 reload server`,
        outputJs: `pm2 start server.js -i max achieves the exact same one-worker-per-core
result as the hand-written cluster code, plus automatic log capture,
process monitoring (pm2 status), and pm2 reload for zero-downtime
deployments — without maintaining any cluster-management code by hand.`,
        outputTs: `// Identical behaviour. The application code itself needs no cluster
// awareness at all — PM2 manages running multiple instances of it
// entirely externally, from outside the application's own code.`,
        explain: 'PM2 wraps the exact mechanism the hand-written cluster code demonstrates, adding production-grade monitoring and deployment tooling most real teams rely on rather than reimplementing by hand.',
        explainHi: 'PM2 bilkul wahi mechanism lapetta hai jo haath-se-likha \`cluster\` code dikhaata hai, production-grade monitoring aur deployment tooling jodte hue jis par zyaadatar asli teams haath se dobara lagu karne ke bajaye bharosa karti hain.',
      },
    ],

    mistakes: [
      {
        wrong: `app.listen(3000);
// a single process on a multi-core machine — most cores sit idle`,
        right: `if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) cluster.fork();
} else {
  require("./server");
}
// one worker process per available core`,
        why: 'A single Node.js process can only ever be scheduled onto one CPU core — running one process on a multi-core machine leaves the remaining cores\' capacity completely unused, regardless of how much traffic arrives.',
        whyHi: 'Ek akela Node.js process kabhi sirf ek CPU core par schedule ho sakta hai — ek multi-core machine par ek process chalaana baaki cores ki kshamta ko poori tarah istemal-na-hui chhod deta hai, chahe kitna bhi traffic aaye.',
      },
      {
        wrong: `let requestCount = 0; // assumed shared across cluster workers
app.get("/stats", (req, res) => {
  requestCount++;
  res.json({ requestCount }); // each worker actually has its OWN separate count`,
        right: `// Genuinely shared state lives in the database or a shared store like Redis,
// following this course's earlier rate-limiting and sessions-vs-tokens lessons
await pool.query("UPDATE stats SET request_count = request_count + 1");`,
        why: 'Cluster workers are separate OS processes with separate memory — an ordinary in-memory variable is not shared between them, so any genuinely shared state must live in the database or an external shared store instead.',
        whyHi: 'Cluster workers alag memory wali alag OS processes hain — ek aam in-memory variable unke beech share nahi hota, isliye koi bhi sach mein shared state ke bajaye database ya ek bahari shared store mein rehna chahiye.',
      },
      {
        wrong: `pm2 restart my-api
// stops all workers, THEN starts the new version — a real gap with zero workers available`,
        right: `pm2 reload my-api
// restarts workers one at a time — most workers keep serving throughout`,
        why: 'restart stops every worker before starting the new version, briefly leaving zero capacity to handle any request — reload restarts workers one at a time so the application keeps serving traffic throughout a deployment.',
        whyHi: '\`restart\` naya version shuru karne se pehle har worker ko rokta hai, thodi der ke liye koi bhi request sambhaalne ki zero kshamta chhodte hue — \`reload\` workers ko ek-ek karke restart karta hai taaki application ek deployment ke dauraan traffic serve karte rahe.',
      },
    ],

    realWorld: [
      {
        en: '**Node.js\'s own official documentation directly covers the cluster module specifically for utilizing multi-core systems**, explicitly stating that a single Node.js instance runs on a single thread and does not automatically take advantage of multi-core systems — this lesson\'s guidance mirrors the platform\'s own documented reasoning.',
        hi: '**Node.js ki apni official documentation khaas taur par multi-core systems istemal karne ke liye \`cluster\` module cover karti hai**, explicitly ye kehte hue ki ek akela Node.js instance ek akele thread par chalta hai aur apne aap multi-core systems ka faayda nahi uthaata — is lesson ki guidance platform ke apne documented reasoning ko darzha karti hai.',
      },
      {
        en: '**PM2 is one of the most widely used process managers in the Node.js production ecosystem**, and "one process per CPU core plus automatic crash recovery" is treated as a baseline production expectation for essentially any real Node.js deployment, not an advanced optimization.',
        hi: '**PM2 Node.js production ecosystem mein sabse vyapak taur par istemal hone waale process managers mein se ek hai**, aur "prati CPU core ek process plus apne aap crash recovery" ko lagbhag kisi bhi asli Node.js deployment ke liye ek baseline production ummeed ki tarah treat kiya jaata hai, koi advanced optimization nahi.',
      },
      {
        en: '**Zero-downtime deployment (restarting a running production service without any interruption to real users) is a widely recognized, standard production goal across the entire software industry**, not specific to Node.js — clustering and tools like PM2\'s reload are one concrete, commonly used mechanism for achieving it.',
        hi: '**Zero-downtime deployment (ek chal rahi production service ko asli users mein koi rukaawat bina restart karna) poori software industry mein ek vyapak taur par pehchaana gaya, standard production lakshya hai**, Node.js tak khaas nahi — clustering aur PM2 ke \`reload\` jaise tools ise haasil karne ka ek thos, aam taur par istemal hone waala mechanism hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a single Node.js process running on a machine with 8 CPU cores fail to use most of that machine\'s available computing capacity?',
        qHi: '8 CPU cores wali ek machine par chal raha ek akela Node.js process us machine ki zyaadatar upalabdh computing kshamta istemal karne mein kyun fail hota hai?',
        a: 'An operating system schedules work at the level of individual processes (and the threads within them), assigning each process to run on a specific CPU core at any given moment. A single Node.js process, regardless of how it is written internally, is fundamentally one such schedulable unit — the operating system can run it on any one available core, but it cannot simultaneously split that single process across multiple cores at once, since the process itself is treated as one indivisible unit of work from the OS scheduler\'s perspective. This means that no matter how many CPU cores a machine has, a single running Node.js process can only ever occupy one of them at any given time — the remaining cores are genuinely separate hardware resources that this one process has no way to make use of. Using the machine\'s full computing capacity therefore requires running MULTIPLE separate processes, each independently schedulable onto its own core, which is precisely what clustering (via Node\'s cluster module or a tool like PM2) achieves by starting one worker process per available core, letting the operating system schedule each one onto a different core simultaneously.',
        aHi: 'Ek operating system kaam ko akele processes (aur unke andar threads) ke star par schedule karta hai, har process ko kisi bhi diye pal par ek khaas CPU core par chalne ke liye assign karte hue. Ek akela Node.js process, andar se chahe kaise bhi likha ho, buniyaadi taur par ek aisi hi schedule-hone-laayak ikaai hai — operating system ise kisi bhi ek upalabdh core par chala sakta hai, par ye us akele process ko ek saath kai cores mein baant nahi sakta, kyunki process khud OS scheduler ke nazariye se kaam ki ek na-todi jaa sakne wali ikaai ki tarah treat hota hai. Iska matlab hai chahe ek machine mein kitne bhi CPU cores hon, ek chal raha akela Node.js process kisi bhi diye pal par unmein se sirf ek par kabza kar sakta hai — baaki cores sach mein alag hardware resources hain jinka faayda uthaane ka is ek process ke paas koi tarika nahi. Machine ki poori computing kshamta istemal karne ke liye isliye MULTIPLE alag processes chalaana zaruri hai, har ek apne core par mustaqil taur par schedule-hone-laayak, jo bilkul wahi hai jo clustering (Node ke \`cluster\` module ya PM2 jaise tool ke through) prati upalabdh core ek worker process shuru karke haasil karta hai, operating system ko har ek ko ek saath ek alag core par schedule karne dete hue.',
      },
      {
        q: 'If cluster.on("exit", () => cluster.fork()) automatically starts a replacement worker whenever one crashes, why does this NOT mean an application can simply ignore uncaught exceptions altogether?',
        qHi: 'Agar \`cluster.on("exit", () => cluster.fork())\` apne aap ek replacement worker shuru karta hai jab bhi koi crash hota hai, to iska matlab ye kyun nahi hai ki ek application uncaught exceptions ko poori tarah nazarandaaz kar sakta hai?',
        a: 'Automatic worker respawning genuinely provides real resilience — it means a single worker crash no longer takes down the entire application for every user, and full capacity is restored automatically without requiring a human to notice and intervene, which is a substantial and valuable improvement over a single unclustered process. However, this does not eliminate the actual consequences of the crash itself: every request that was actively being handled by that specific worker at the exact moment it crashed is still lost or fails, since the process handling them terminated mid-execution — those particular users still experience an error, even though the application as a whole recovers moments later, and other concurrent users on other workers remain entirely unaffected. Additionally, if the underlying bug causing the crash is triggered by a common, repeatable condition rather than a rare edge case, workers could crash and restart in a rapid, ongoing cycle, degrading overall reliability and wasting resources on repeated process startup even though the application technically never becomes fully unavailable. Automatic recovery is a valuable safety net for the cases where something unexpected genuinely does go wrong, but it does not substitute for writing correct code, proper error handling within each request (as covered in this course\'s centralized error-handling lesson), and genuinely fixing the root cause of any crash that turns out to be common or preventable.',
        aHi: 'Apne aap worker respawning sach mein asli resilience deti hai — iska matlab hai ek akele worker ka crash ab poori application ko har user ke liye nahi giraata, aur poori kshamta apne aap bahaal ho jaati hai kisi insaan ke notice karne aur beech mein aane ki zarurat bina, jo ek akele, na-clustered process se ek maayne-rakhta aur kaam ka sudhaar hai. Halaanki, ye crash ke asli nateejon ko khatam nahi karta: har request jo us khaas pal us khaas worker dwara actively sambhaali jaa rahi thi jab wo crash hua abhi bhi khoyi jaati hai ya fail hoti hai, kyunki use sambhaalta process beech-execution mein khatam ho gaya — wo khaas users abhi bhi ek error anubhav karte hain, chahe application poori tarah kuch pal baad recover ho jaaye, aur doosre workers par doosre concurrent users poori tarah bekhabar rehte hain. Additionally, agar crash ka wajah bana underlying bug ek aam, dohraaya-jaa-sakne-laayak sthiti se trigger hota hai ek dulabh edge case ke bajaye, workers ek tez, chalti chakra mein crash aur restart ho sakte hain, poori bharosemandta ko kharaab karte hue aur dohraayi process startup par resources bekaar karte hue chahe application technically kabhi poori tarah upalabdh-na-hone-wali na bane. Apne aap recovery un cases ke liye ek maayne-rakhta safety net hai jahan kuch anaay-koshit sach mein galat hota hai, par ye sahi code likhne, har request ke andar sahi error handling (jaisa is course ke centralized error-handling lesson mein cover hua), aur kisi bhi crash ke asli mool wajah ko sach mein theek karne ka substitute nahi hai jo aam ya rokne-laayak nikalta hai.',
      },
      {
        q: 'Why can\'t an ordinary JavaScript variable be used to share state (like an in-memory request counter) across cluster workers, and what does this imply about how a clustered application must manage shared state?',
        qHi: 'Cluster workers ke aar-paar sthiti (jaise ek in-memory request counter) share karne ke liye ek aam JavaScript variable kyun istemal nahi kiya jaa sakta, aur ye zaahir karta hai ki ek clustered application ko shared state kaise sambhaalna chahiye?',
        a: 'Each worker created via cluster.fork() is a genuinely separate operating-system process, and separate processes, by the fundamental design of how operating systems isolate them from each other, do not share memory space — a variable declared in one process\'s running code exists only within that process\'s own private memory, entirely invisible to and unreachable from any other process, including sibling worker processes created by the same cluster. This means that if application code declares an ordinary variable intended to track something across all requests (a running counter, an in-memory cache of recently fetched data), each individual worker process ends up with its own completely independent copy of that variable — incrementing it in worker 3 has absolutely no effect on the separate copy living inside worker 5\'s memory, and a request happening to be routed to worker 5 would see a value entirely disconnected from what worker 3 has been counting. This implies that any state genuinely meant to be shared and consistent across all of an application\'s workers cannot live in an ordinary in-process variable at all — it must instead live somewhere every worker can equally access and modify, such as the application\'s database (for persistent, authoritative data) or a shared external store like Redis (for fast, shared, possibly temporary state such as rate-limit counters or session data), exactly the pattern this course\'s earlier rate-limiting and sessions-vs-tokens lessons established for reasons that become even more consequential once an application is running as multiple separate cluster workers rather than a single process.',
        aHi: '\`cluster.fork()\` se banaaya gaya har worker ek sach mein alag operating-system process hai, aur alag processes, is buniyaadi design ki wajah se ki operating systems unhe ek-doosre se kaise alag rakhte hain, memory space share nahi karte — ek variable jo ek process ke chalte code mein declare kiya gaya hai sirf us process ki apni private memory ke andar maujood hai, kisi bhi doosre process se poori tarah adrishya aur na-pahunch-hone-laayak, wahi cluster dwara banaaye sibling worker processes sameet. Iska matlab hai agar application code ek aam variable declare karta hai jise sabhi requests ke aar-paar kuch track karna hai (ek chalta counter, haal mein fetch ki gayi data ka ek in-memory cache), har akela worker process us variable ki apni poori tarah mustaqil copy paata hai — worker 3 mein use badhaana worker 5 ki memory mein rehti alag copy par bilkul koi asar nahi karta, aur worker 5 ko route hui ek request ek aisi value dekhegi jo worker 3 ne kya gina hai us se poori tarah na-judi hai. Ye zaahir karta hai ki koi bhi sthiti jo sach mein ek application ke sabhi workers ke aar-paar shared aur sangat hone ke liye maani gayi hai bilkul ek aam in-process variable mein nahi reh sakti — iske bajaye ise kahin aisi jagah rehna chahiye jise har worker barabar access aur badal sake, jaise application ka database (sthaayi, adhikrit data ke liye) ya Redis jaisa ek shared bahari store (tez, shared, mumkin taur par asthaayi sthiti jaise rate-limit counters ya session data ke liye), bilkul wahi pattern jo is course ke pehle wale rate-limiting aur sessions-vs-tokens lessons ne sthaapit kiya un wajahon ke liye jo ek application kai alag cluster workers ki tarah chalne ke baad aur bhi zyaada maayne-rakhta ban jaati hain ek akele process ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken single-process server with a CPU-heavy /report route (reusing the previous lesson\'s fibonacci function). Using an OS-level tool (Task Manager, htop, or similar), confirm only one CPU core is busy while a request to /report is processing.',
        taskHi: 'Ek CPU-heavy \`/report\` route wala toota akela-process server banao (pichhle lesson ke \`fibonacci\` function ko dobara istemal karte hue). Ek OS-level tool (Task Manager, \`htop\`, ya waisa hi) istemal karke, confirm karo ki jab \`/report\` ki request process ho rahi hai sirf ek CPU core busy hai.',
        hint: 'Watch per-core CPU usage specifically (not just overall CPU percentage) to clearly see only one core spike while the others remain flat.',
        hintHi: 'Khaas taur par per-core CPU usage dekho (sirf overall CPU percentage nahi) saaf dekhne ke liye ki sirf ek core spike karta hai jabki baaki flat rehte hain.',
      },
      {
        task: 'Fix it with Node\'s built-in cluster module, forking one worker per os.cpus().length. Send several concurrent /report requests and confirm multiple CPU cores are now busy simultaneously.',
        taskHi: 'Node ke built-in \`cluster\` module se theek karo, \`os.cpus().length\` prati ek worker fork karte hue. Kai concurrent \`/report\` requests bhejo aur confirm karo ab kai CPU cores ek saath busy hain.',
        hint: 'Deliberately crash one worker (e.g., add a route that calls process.exit(1)) and confirm the other workers keep responding to /ping while the primary logs and starts a replacement.',
        hintHi: 'Jaan-boojhkar ek worker ko crash karo (jaise, ek route jodo jo \`process.exit(1)\` bulaaye) aur confirm karo baaki workers \`/ping\` ka jawaab dete rehte hain jabki primary log karta hai aur ek replacement shuru karta hai.',
      },
      {
        task: 'Install PM2 and start the same server with pm2 start server.js -i max. Confirm pm2 status shows one process per CPU core, then try pm2 reload and observe that the application keeps responding throughout.',
        taskHi: 'PM2 install karo aur wahi server \`pm2 start server.js -i max\` se shuru karo. Confirm karo \`pm2 status\` prati CPU core ek process dikhaata hai, phir \`pm2 reload\` try karo aur dekho ki application poori der jawaab dete rehta hai.',
        hint: 'Run a simple script that continuously sends requests to /ping once per second while performing the pm2 reload, to directly observe whether any request fails during the reload.',
        hintHi: 'Ek saadha script chalaao jo \`pm2 reload\` karte waqt prati second \`/ping\` ko lagaataar requests bheje, seedha dekhne ke liye ki kya reload ke dauraan koi request fail hoti hai.',
      },
    ],

    keyTakeaways: [
      'A single Node.js process can only ever be scheduled onto one CPU core — running one process on a multi-core machine leaves the remaining cores\' capacity unused regardless of traffic volume.',
      'Node\'s cluster module forks one worker process per CPU core, with the operating system distributing incoming connections across them, letting total request-handling capacity scale with the number of cores.',
      'Clustering also provides crash resilience: cluster.on("exit", ...) lets the primary process immediately fork a replacement worker, so one crashed worker no longer takes down the entire application for every user.',
      'Cluster workers are separate OS processes with separate memory — an ordinary in-memory variable is not shared between them, so genuinely shared state must live in the database or a shared external store like Redis.',
      'PM2 wraps this exact cluster mechanism (pm2 start app.js -i max) while adding production-grade process monitoring, log management, and configuration via an ecosystem file, which is why real teams rely on it rather than hand-writing cluster code.',
      'pm2 reload restarts workers one at a time, keeping most of them serving traffic throughout a deployment — meaningfully different from pm2 restart, which briefly leaves zero workers available.',
    ],
    keyTakeawaysHi: [
      'Ek akela Node.js process kabhi sirf ek CPU core par schedule ho sakta hai — ek multi-core machine par ek process chalaana baaki cores ki kshamta ko istemal-na-hui chhod deta hai chahe traffic volume kuch bhi ho.',
      'Node ka \`cluster\` module prati CPU core ek worker process fork karta hai, operating system unke aar-paar aati connections baante hue, kul request-sambhaalne ki kshamta ko cores ki tadaad ke saath scale karne dete hue.',
      'Clustering crash resilience bhi deta hai: \`cluster.on("exit", ...)\` primary process ko turant ek replacement worker fork karne deta hai, isliye ek crashed worker ab poori application ko har user ke liye nahi giraata.',
      'Cluster workers alag memory wali alag OS processes hain — ek aam in-memory variable unke beech share nahi hota, isliye sach mein shared state database ya Redis jaise ek shared bahari store mein rehna chahiye.',
      'PM2 bilkul isi cluster mechanism ko lapetta hai (\`pm2 start app.js -i max\`) saath hi production-grade process monitoring, log management, aur ek ecosystem file se configuration jodte hue, isi wajah se asli teams cluster code haath se likhne ke bajaye ispar bharosa karti hain.',
      '\`pm2 reload\` workers ko ek-ek karke restart karta hai, deployment ke dauraan zyaadatar ko traffic serve karte rakhte hue — \`pm2 restart\` se maayne-rakhta alag, jo thodi der ke liye zero workers ko upalabdh chhod deta hai.',
    ],
  },
];
