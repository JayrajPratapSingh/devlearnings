/**
 * Node.js Complete Course — Module 6: Pro, lesson 7.
 *
 * Performance profiling and memory leaks: what to actually do when a
 * server's memory usage keeps climbing over days until it crashes, or
 * responses get mysteriously slower under real load, rather than
 * guessing which part of the code might be responsible. Broken example:
 * an in-memory array that every request appends to and nothing ever
 * removes from — a classic, easy-to-write memory leak that looks
 * completely fine in every quick manual test and only reveals itself
 * after the process has been running for hours or days in production.
 * Fixed by using Node.js's own built-in heap-snapshot and CPU-profiling
 * tools (via --inspect and Chrome DevTools, or clinic.js) to observe
 * exactly which objects are accumulating and never being freed, or
 * exactly which function is consuming CPU time, rather than guessing —
 * turning "the server feels slow" or "memory keeps growing" from a vague
 * complaint into a precise, evidence-based diagnosis.
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

export const NODE_MODULE_6_PART7: CourseLesson[] = [
  {
    slug: 'performance-profiling-memory-leaks',
    title: 'Performance Profiling and Finding Memory Leaks',
    titleHi: 'Performance Profiling Aur Memory Leaks Dhoondhna',
    description: 'The server\'s memory usage climbs a little more every single day, and nobody notices until the process finally runs out of memory and crashes at 3 AM on a Saturday — with absolutely no clue which of the thousands of lines of code is actually responsible.',
    descriptionHi: 'Server ka memory istemal har akele din thoda aur badhta hai, aur kisi ko pata nahi chalta jab tak process aakhirkaar memory khatam karke Saturday ko raat 3 baje crash nahi ho jaata — bilkul koi sanket bina ki hazaaron lines code mein se asal mein kaunsi zimmedaar hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 7,

    analogy: {
      en: '**A mechanic who, faced with a car making a strange noise, starts guessing and replacing parts one at a time — the brakes, then the alternator, then the transmission — hoping one of them happens to be the problem, versus a mechanic who plugs a proper diagnostic scanner into the car\'s own onboard computer and reads out exactly which sensor is reporting an abnormal value, and precisely when the problem occurs.** The guessing mechanic might eventually stumble onto the actual problem, but only after wasting significant time and money replacing perfectly good parts that were never actually broken, and offering no real confidence that the true cause has even been found rather than the symptom simply happening to disappear temporarily. The mechanic with the diagnostic scanner does something categorically different: the car\'s own computer has been recording real, precise data all along — exactly which sensor\'s readings look abnormal, and under exactly which conditions — and the scanner simply reveals that already-existing evidence rather than requiring anyone to guess at all. Trying to fix a server\'s memory growth or slow performance by guessing which part of the code "feels like" it could be the problem, and rewriting things speculatively, is the guessing mechanic — it might eventually work, but wastes real engineering time chasing possibilities that were never actually the cause. Using Node.js\'s own built-in profiling and heap-snapshot tools is the diagnostic scanner: the running process already has precise, real information about exactly which objects are accumulating in memory or exactly which function is consuming CPU time, and the right tool simply reveals that evidence directly, turning a vague complaint into a specific, actionable finding.',
      hi: '**Ek mechanic jo, ek car ke ajeeb aawaaz karne par, ek-ek karke parts anumaan lagaakar badalna shuru karta hai — brakes, phir alternator, phir transmission — umeed karte hue ki inmein se koi ek samasya hogi, versus ek mechanic jo car ke apne onboard computer mein ek sahi diagnostic scanner plug karta hai aur bilkul padh leta hai ki kaunsa sensor asaadhaaran value report kar raha hai, aur bilkul kab samasya hoti hai.** Anumaan lagaata mechanic shaayad aakhirkaar asli samasya par thokar khaa jaaye, par sirf poori tarah theek parts badalne mein maayne-rakhta waqt aur paisa barbaad karne ke baad jo asal mein kabhi toote hi nahi the, aur ye koi asli bharosa diye bina ki asli kaaran bhi mila hai ya lakshan bas asthaayi taur par gayab ho gaya. Diagnostic scanner wala mechanic ek categorically alag cheez karta hai: car ka apna computer hamesha se asli, sateek data record kar raha tha — bilkul kaunse sensor ki readings asaadhaaran dikhti hain, aur bilkul kaunsi sthitiyon mein — aur scanner bas us pehle-se-maujood evidence ko ujaagar karta hai kisi ko bilkul anumaan lagaane ki maang kiye bina. Server ki memory growth ya dheemi performance ko ye anumaan lagaakar theek karne ki koshish karna ki code ka kaunsa hissa "lagta hai" samasya ho sakta hai, aur cheezon ko anumaanit taur par dobara likhna, anumaan lagaata mechanic hai — ye shaayad aakhirkaar kaam kare, par asli engineering waqt un sambhaavnaon ka peecha karne mein barbaad karta hai jo asal mein kabhi kaaran thi hi nahi. Node.js ke apne built-in profiling aur heap-snapshot tools istemal karna diagnostic scanner hai: chalta process pehle se sateek, asli jaankaari rakhta hai ki bilkul kaunse objects memory mein jama ho rahe hain ya bilkul kaunsa function CPU time istemal kar raha hai, aur sahi tool bas us evidence ko seedhe ujaagar karta hai, ek anisha shikaayat ko ek khaas, kaarvaai-laayak khoj mein badalte hue.',
    },

    simple: `**Start broken.** An in-memory array that every request appends to, and nothing ever removes from:

\`\`\`js
const recentRequests = [];

app.use((req, res, next) => {
  recentRequests.push({ url: req.url, timestamp: Date.now(), body: req.body });
  next();
});
\`\`\`

The intent behind this middleware is reasonable — keeping some record of recent requests, perhaps for debugging. In any quick manual test, or even a short automated test suite, this looks completely fine: the server responds correctly, nothing crashes, and \`recentRequests\` holding a few dozen or a few hundred entries uses a genuinely negligible amount of memory. The problem only reveals itself over a much longer timescale than any typical test ever runs: \`recentRequests\` is a single, module-level array that lives for the entire lifetime of the running process, and every single request appends to it, forever, with nothing anywhere ever removing an old entry. After an hour, this might hold thousands of entries; after a busy production day, potentially millions; after several days of continuous operation, the memory this one array alone occupies can grow large enough that the process eventually exhausts all available memory and crashes with an out-of-memory error — often days after the code that caused it was actually deployed, making the connection between "this line of code" and "the eventual crash" far from obvious without deliberately looking for it.

**The fix: use profiling tools to observe what's actually growing, rather than guessing**

\`\`\`bash
# Start the process with the inspector enabled
node --inspect server.js

# Open chrome://inspect in Chrome, connect to the process, and take
# a heap snapshot under normal load, then again after some time has
# passed under the same load — compare the two snapshots directly
\`\`\`

Rather than guessing which of potentially thousands of lines might be responsible, Node.js's \`--inspect\` flag opens a debugging connection that Chrome DevTools (or a similar tool) can connect to directly, offering a "Take heap snapshot" button that captures every object currently alive in memory, along with how much memory each one retains and what's still holding a reference to it. Taking one snapshot, waiting under realistic load, and taking a second snapshot, then using DevTools' built-in comparison view, shows exactly which specific objects grew in count or retained size between the two snapshots — in this example, it would show \`recentRequests\`' own array growing steadily, along with every request object retained inside it, immediately pointing at the exact line of code responsible, rather than requiring anyone to have guessed it. Once identified, the actual fix follows directly: cap the array's size (removing old entries once a limit is reached), replace it with something that expires entries automatically, or store this data somewhere outside the process's own memory entirely (a database, a proper logging system, per this course's earlier structured-logging lesson) if it's genuinely needed long-term.`,

    simpleHi: `**Toote hue se shuru.** Ek in-memory array jismein har request append karti hai, aur kuch bhi kabhi hataata nahi:

\`\`\`js
const recentRequests = [];

app.use((req, res, next) => {
  recentRequests.push({ url: req.url, timestamp: Date.now(), body: req.body });
  next();
});
\`\`\`

Is middleware ke peeche iraada samajhdaari-bhara hai — recent requests ka kuch record rakhna, shaayad debugging ke liye. Kisi bhi jaldi manual test mein, ya ek chhote automated test suite mein bhi, ye poori tarah theek dikhta hai: server sahi tarike se jawaab deta hai, kuch crash nahi hota, aur \`recentRequests\` mein kuch dazan ya kuch sau entries rakhna sach mein mamuli memory istemal karta hai. Samasya sirf ek kaafi lambi timescale ke baad zaahir hoti hai jo koi typical test kabhi chalata hi nahi: \`recentRequests\` ek akela, module-level array hai jo poori chalte process ki umr ke liye tikta hai, aur har akeli request use append karti hai, hamesha ke liye, kahin bhi kuch kabhi ek purani entry nahi hataata. Ek ghante baad, ismein shaayad hazaaron entries hon; ek busy production din ke baad, sambhaavit roop se lakhon; kai dinon ke lagaataar operation ke baad, ye ek akela array jo memory occupy karta hai itna bada ho sakta hai ki process aakhirkaar poori upalabdh memory khatam kar de aur ek out-of-memory error ke saath crash ho jaaye — aksar us code deploy hone ke kai din baad jisne ise cause kiya, "ye line of code" aur "aakhirkaar hua crash" ke beech ka rishta jaan-boojhkar dhoondhe bina saaf hone se kaafi door banaate hue.

**Fix: profiling tools istemal karo ye dekhne ke liye ki asal mein kya badh raha hai, anumaan lagaane ke bajaye**

\`\`\`bash
# Process ko inspector enabled ke saath shuru karo
node --inspect server.js

# Chrome mein chrome://inspect kholo, process se connect karo, aur
# normal load ke neeche ek heap snapshot lo, phir kuch waqt guzar
# jaane ke baad usi load ke neeche dobara lo — dono snapshots ko
# seedhe compare karo
\`\`\`

Sambhaavit roop se hazaaron lines mein se kaunsi zimmedaar ho sakti hai anumaan lagaane ke bajaye, Node.js ka \`--inspect\` flag ek debugging connection kholta hai jise Chrome DevTools (ya isi tarah ka koi tool) seedhe connect kar sakta hai, ek "Take heap snapshot" button offer karte hue jo memory mein abhi zinda har object ko capture karta hai, har ek kitni memory retain karta hai aur ise abhi bhi kya reference kar raha hai uske saath. Ek snapshot lena, wastavik load ke neeche intezaar karna, aur ek doosra snapshot lena, phir DevTools ka built-in comparison view istemal karna, bilkul dikhaata hai ki kaunse khaas objects do snapshots ke beech count ya retained size mein badhe — is misal mein, ye \`recentRequests\` ke apne array ko sthir roop se badhte hue dikhaayega, uske andar retain kiye har request object ke saath, turant zimmedaar bilkul us line of code ki taraf ishaara karte hue, kisi ke ise anumaan lagaane ki maang kiye bina. Ek baar pehchaane jaane ke baad, asli fix seedhe milta hai: array ke size ko cap karo (ek seemaa pahunchne par purani entries hataate hue), ise kisi aisi cheez se replace karo jo entries ko automatically expire karti hai, ya is data ko process ki apni memory se poori tarah baahar kahin store karo (ek database, ek asli logging system, is course ke pehle wale structured-logging lesson ke hisaab se) agar iski asal mein lambe-samay ke liye zaroorat hai.`,

    content: `## Heap snapshots: seeing exactly what's alive in memory, and what's holding onto it

\`\`\`
Take snapshot #1 → run the app under realistic load for a while →
take snapshot #2 → compare: which object types grew in count or
retained size between the two?
\`\`\`

A heap snapshot is a complete picture of every JavaScript object alive in memory at the exact moment it's taken, including how much memory each one retains and the chain of references keeping it alive (what's pointing to it, preventing garbage collection from reclaiming it). Taking a single snapshot rarely reveals a leak by itself — what matters is taking two snapshots some time apart, under comparable, realistic load, and using DevTools' comparison view to see specifically which object types grew between them. A healthy application's snapshots should look roughly similar over time, modulo normal, bounded fluctuation; a leak shows up as one or more object types (an array, a Map, closures capturing more and more data) whose count or retained size keeps climbing snapshot after snapshot, with no corresponding decrease, which is the signature of something being created and never released.

## Common, genuine causes of memory leaks in real Node.js applications

\`\`\`js
// 1. An unbounded, ever-growing in-memory cache or array (this lesson's example)
const cache = {};
app.get("/data/:id", (req, res) => { cache[req.params.id] = fetchData(req.params.id); });

// 2. Event listeners added repeatedly, never removed
socket.on("message", handler); // if this runs on every reconnect, old listeners pile up

// 3. Closures capturing large objects longer than intended
function makeHandler(hugeConfigObject) {
  return () => { /* only uses one small field, but the closure keeps the whole object alive */ };
}
\`\`\`

The most common real-world source is an unbounded cache or collection, structurally identical to this lesson's broken example — something that grows with every request and is never trimmed, expired, or bounded in size. A second common source is event listeners or callbacks registered repeatedly without the corresponding old ones ever being removed — particularly common with long-lived connections (WebSockets, this course's earlier lesson) where a listener is added on every reconnect without cleaning up the previous one. A third, subtler source is a closure that captures and keeps alive a much larger object than it actually needs, simply because JavaScript closures keep their entire enclosing scope alive as long as the closure itself is reachable — even if the closure only uses one small piece of a much larger captured object.

## CPU profiling: finding what's actually consuming processing time

\`\`\`bash
node --prof server.js
# ... exercise the app under load ...
node --prof-process isolate-0x*.log > processed.txt
# or, more conveniently:
npx clinic flame -- node server.js
\`\`\`

A separate, related concern from memory growth is CPU time: a route that feels sluggish under real load may be spending an unexpectedly large amount of time in one specific, identifiable function, rather than the slowness being evenly spread across everything the request does. Node's built-in \`--prof\` flag records exactly which functions the CPU spent time executing and for how long, and \`clinic.js\`'s \`flame\` command produces a visual "flame graph" of the same information, making it immediately obvious which function occupies the widest section of the graph — and therefore consumed the most CPU time — rather than requiring the underlying log data to be read and interpreted manually. This turns "this route feels slow" into a specific, actionable finding: perhaps a synchronous \`JSON.stringify\` on a very large object, or an accidentally quadratic loop, is consuming far more CPU time than the rest of the route combined.

## Profiling in production safely, without disrupting real traffic

\`\`\`js
// Attach the inspector to an ALREADY-RUNNING process via a signal,
// rather than needing to restart it with --inspect from the start
process.on("SIGUSR2", () => {
  const inspector = require("inspector");
  inspector.open(9229, "127.0.0.1"); // enables debugging without a restart
});
\`\`\`

Profiling a production process safely requires care: opening the inspector protocol on a live, internet-facing process without restricting access is itself a security risk (this course's earlier auth and secrets-management lessons apply the same underlying caution), so the debugging port should only ever be exposed on a trusted internal network or via a secure tunnel, never a public interface. A snapshot itself briefly pauses the process while it captures the full heap, so taking one under genuinely heavy production load has a real, if usually brief, performance cost — this is one of many reasons production incidents are often reproduced and profiled in a staging environment configured to mirror production traffic patterns first, rather than always profiling the live system directly.`,

    contentHi: `## Heap snapshots: bilkul dekho memory mein kya zinda hai, aur use kya pakde hai

\`\`\`
Snapshot #1 lo → app ko kuch der wastavik load ke neeche chalaao →
snapshot #2 lo → compare karo: kaunsi object types dono ke beech
count ya retained size mein badhi?
\`\`\`

Ek heap snapshot memory mein zinda har JavaScript object ki ek poori tasveer hai bilkul us pal jab ye li jaati hai, har ek kitni memory retain karta hai aur references ki chain jo use zinda rakhti hai (kya use point kar raha hai, garbage collection ko use wapas lene se rokte hue) sameet. Sirf ek akeli snapshot lena akele mein kam hi ek leak zaahir karta hai — jo maayne rakhta hai wo hai kuch waqt door do snapshots lena, tulnaatmak, wastavik load ke neeche, aur DevTools ka comparison view istemal karna ye dekhne ke liye ki khaas taur par kaunsi object types unke beech badhi. Ek sehatmand application ke snapshots waqt ke saath lagbhag ek jaise dikhne chahiye, normal, seemit utaar-chadhaav ke alaawa; ek leak ek ya zyaada object types ki tarah dikhta hai (ek array, ek Map, zyaada-se-zyaada data pakadte hue closures) jinka count ya retained size snapshot dar snapshot badhta rehta hai, koi mutaalliq kami bina, jo kisi cheez ke banaaye jaane aur kabhi release na hone ka sanket hai.

## Asli Node.js applications mein memory leaks ke aam, asli kaaran

\`\`\`js
// 1. Ek bina-seemaa, hamesha-badhta in-memory cache ya array (is lesson ka misal)
const cache = {};
app.get("/data/:id", (req, res) => { cache[req.params.id] = fetchData(req.params.id); });

// 2. Event listeners baar-baar jode jaate hain, kabhi hataaye nahi jaate
socket.on("message", handler); // agar ye har reconnect par chalta hai, purane listeners jama hote hain

// 3. Closures jo bade objects ko zaroorat se lambe samay tak pakde rehte hain
function makeHandler(hugeConfigObject) {
  return () => { /* sirf ek chhota field istemal karta hai, par closure poore object ko zinda rakhta hai */ };
}
\`\`\`

Sabse aam asli-duniya source ek bina-seemaa cache ya collection hai, is lesson ke toote example se structurally identical — kuch aisa jo har request ke saath badhta hai aur kabhi trim, expire, ya size mein seemit nahi hota. Ek doosra aam source event listeners ya callbacks hain jo baar-baar register kiye jaate hain purane mutaalliq unhe kabhi hataaye bina — khaas taur par lambe-chalte connections (WebSockets, is course ka pehle wala lesson) ke saath aam jahan har reconnect par ek listener jodaa jaata hai pichhle ko saaf kiye bina. Ek teesra, zyaada sookshm source ek closure hai jo apni asli zaroorat se kaafi bada object pakadta aur zinda rakhta hai, bas isliye kyunki JavaScript closures apna poora enclosing scope zinda rakhte hain jab tak closure khud reachable hai — chahe closure sirf ek kaafi bade captured object ka ek chhota tukda istemal karta ho.

## CPU profiling: ye dhoondhna ki asal mein kya processing waqt kha raha hai

\`\`\`bash
node --prof server.js
# ... app ko load ke neeche exercise karo ...
node --prof-process isolate-0x*.log > processed.txt
# ya, zyaada suvidhajanak:
npx clinic flame -- node server.js
\`\`\`

Memory growth se ek alag, mutaalliq chinta CPU time hai: ek route jo asli load ke neeche sust mehsoos hoti hai shaayad ek khaas, pehchaane-jaane-laayak function mein ek anapekshit roop se badi tadaad ka waqt bita rahi ho, dheema hona request jo kuch bhi karti hai us mein samaan roop se failne ke bajaye. Node ka built-in \`--prof\` flag record karta hai ki CPU ne bilkul kaunse functions chalaane mein waqt bitaaya aur kitni der, aur \`clinic.js\` ka \`flame\` command usi jaankaari ka ek visual "flame graph" paida karta hai, turant saaf karte hue ki kaunsa function graph ka sabse chauda hissa occupy karta hai — aur isliye sabse zyaada CPU time istemal kiya — underlying log data ko manually padhne aur samajhne ki maang karne ke bajaye. Ye "ye route dheemi mehsoos hoti hai" ko ek khaas, kaarvaai-laayak khoj mein badal deta hai: shaayad ek bahut bade object par ek synchronous \`JSON.stringify\`, ya ek galti se quadratic loop, route ke baaki hisse se milkar se kaafi zyaada CPU time istemal kar raha hai.

## Production mein surakshit taur par profiling, asli traffic ko rukaawat diye bina

\`\`\`js
// Ek PEHLE-SE-CHALTE process se inspector ko ek signal ke zariye
// attach karo, use --inspect ke saath shuru se dobara chalaane ki
// zaroorat ke bajaye
process.on("SIGUSR2", () => {
  const inspector = require("inspector");
  inspector.open(9229, "127.0.0.1"); // bina restart ke debugging enable karta hai
});
\`\`\`

Ek production process ko surakshit taur par profile karne mein savdhaani chahiye: ek chalte, internet-facing process par bina access seemit kiye inspector protocol kholna khud ek security khatra hai (is course ke pehle wale auth aur secrets-management lessons wahi buniyaadi savdhaani lagu karte hain), isliye debugging port ko kabhi bhi sirf ek bharosemand internal network par ya ek surakshit tunnel ke zariye expose kiya jaana chahiye, kabhi ek public interface par nahi. Ek snapshot khud process ko thodi der ke liye rokta hai jabki ye poora heap capture karta hai, isliye asal mein bhaari production load ke neeche ek lena ek asli, aam taur par chhoti, performance keemat rakhta hai — ye ek wajah hai jinse production incidents aksar pehle staging environment mein reproduce aur profile kiye jaate hain jo production traffic patterns ko mirror karne ke liye configure kiya jaata hai, hamesha seedhe live system ko profile karne ke bajaye.`,

    examples: [
      {
        title: 'Broken: an unbounded array that grows forever with every request',
        titleHi: 'Toota: ek bina-seemaa array jo har request ke saath hamesha ke liye badhta hai',
        code: `const recentRequests = [];
app.use((req, res, next) => {
  recentRequests.push({ url: req.url, timestamp: Date.now() });
  next();
});
// nothing ever removes an old entry`,
        codeJs: `const recentRequests = [];

app.use((req, res, next) => {
  recentRequests.push({ url: req.url, timestamp: Date.now(), body: req.body });
  next();
});

app.get("/debug/recent", (req, res) => {
  res.json(recentRequests.slice(-10));
});
// recentRequests grows without bound for the entire process lifetime`,
        codeTs: `interface RequestLogEntry {
  url: string;
  timestamp: number;
  body: unknown;
}
const recentRequests: RequestLogEntry[] = [];

app.use((req: Request, res: Response, next: NextFunction): void => {
  recentRequests.push({ url: req.url, timestamp: Date.now(), body: req.body });
  next();
});
// Correctly typed, completely valid TypeScript — the leak is entirely
// structural, not a type error.`,
        output: `Works fine for hours. After days of continuous operation, this one
array's memory usage has grown large enough to eventually exhaust
available memory and crash the process.`,
        explain: 'Every request permanently adds one entry to a module-level array that lives for the process\'s entire lifetime, with nothing anywhere ever removing an old one.',
        explainHi: 'Har request ek module-level array mein hamesha ke liye ek entry jodti hai jo process ki poori umr ke liye tikta hai, kahin bhi kuch kabhi ek purani entry nahi hataata.',
      },
      {
        title: 'Fixed: a bounded structure that discards old entries',
        titleHi: 'Theek: ek bounded structure jo purani entries hataata hai',
        code: `const recentRequests = [];
const MAX_ENTRIES = 100;
app.use((req, res, next) => {
  recentRequests.push({ url: req.url, timestamp: Date.now() });
  if (recentRequests.length > MAX_ENTRIES) recentRequests.shift();
  next();
});`,
        codeJs: `const recentRequests = [];
const MAX_ENTRIES = 100;

app.use((req, res, next) => {
  recentRequests.push({ url: req.url, timestamp: Date.now(), body: req.body });
  if (recentRequests.length > MAX_ENTRIES) {
    recentRequests.shift(); // discard the oldest entry once the cap is reached
  }
  next();
});`,
        codeTs: `interface RequestLogEntry {
  url: string;
  timestamp: number;
  body: unknown;
}
const recentRequests: RequestLogEntry[] = [];
const MAX_ENTRIES = 100;

app.use((req: Request, res: Response, next: NextFunction): void => {
  recentRequests.push({ url: req.url, timestamp: Date.now(), body: req.body });
  if (recentRequests.length > MAX_ENTRIES) {
    recentRequests.shift();
  }
  next();
});`,
        outputJs: `recentRequests never holds more than 100 entries, regardless of how
many requests the process handles over its entire lifetime — memory
usage for this structure stays small and constant.`,
        outputTs: `// Identical behaviour. This is the same "bound the size" principle
// this course's earlier caching lessons apply to a Redis cache —
// applied here to a plain in-memory array.`,
        explain: 'Capping the array\'s size and discarding the oldest entry once the cap is reached bounds its memory usage regardless of how long the process runs or how much traffic it handles.',
        explainHi: 'Array ke size ko cap karna aur cap pahunchne par sabse purani entry hataana uska memory istemal seemit karta hai chahe process kitni der chale ya kitna traffic sambhaale.',
      },
      {
        title: 'Taking and comparing two heap snapshots to confirm a fix',
        titleHi: 'Ek fix confirm karne ke liye do heap snapshots lena aur compare karna',
        code: `node --inspect server.js
// In Chrome DevTools: Memory tab → take snapshot #1 → run load → take snapshot #2
// Compare view shows which object types grew between them`,
        codeJs: `// package.json script to make this repeatable
{
  "scripts": {
    "debug": "node --inspect server.js"
  }
}
// Run "npm run debug", open chrome://inspect, connect, and use the
// Memory tab's "Take heap snapshot" button before and after a load test`,
        codeTs: `// Identical workflow for a TypeScript project — run the compiled
// output with --inspect, e.g.:
// node --inspect dist/server.js
// The heap snapshot shows actual runtime objects regardless of
// whether the source was written in JS or TS.`,
        outputJs: `Before the fix: the "Comparison" view shows the request-log array's
retained size climbing steadily between snapshots. After the fix:
the same view shows it staying flat, confirming the leak is resolved.`,
        outputTs: `// Identical behaviour. The heap snapshot operates on the actual
// running JavaScript objects at the V8 level, independent of
// TypeScript's compile-time types.`,
        explain: 'Comparing two snapshots taken under the same realistic load, before and after a fix, gives direct, observable evidence the leak is actually resolved rather than assuming it based on reading the code.',
        explainHi: 'Wahi wastavik load ke neeche liye gaye do snapshots ko compare karna, fix se pehle aur baad mein, seedha, dekha jaane-laayak evidence deta hai ki leak asal mein resolve ho gaya code padhkar anumaan lagaane ke bajaye.',
      },
    ],

    mistakes: [
      {
        wrong: `// Guessing which function is slow and rewriting it speculatively,
// based on a hunch, with no actual profiling data`,
        right: `npx clinic flame -- node server.js
// find the actual widest section of the flame graph, then fix that specific function`,
        why: 'Rewriting code based on a guess about what might be slow wastes engineering time on possibilities that may not be the actual cause, and provides no evidence the real bottleneck was ever found.',
        whyHi: 'Ek anumaan ke aadhaar par code dobara likhna ki kya dheema ho sakta hai un sambhaavnaon par engineering waqt barbaad karta hai jo asli kaaran na ho, aur koi evidence nahi deta ki asli bottleneck kabhi mila bhi tha.',
      },
      {
        wrong: `const cache = {}; // grows forever, one entry added per request, never cleared
app.get("/data/:id", (req, res) => { cache[req.params.id] = fetchData(req.params.id); });`,
        right: `const cache = new Map();
const MAX_SIZE = 1000;
function setCached(key, value) {
  if (cache.size >= MAX_SIZE) cache.delete(cache.keys().next().value);
  cache.set(key, value);
}`,
        why: 'An in-memory cache with no size limit and no expiration grows without bound for the entire lifetime of the process — every cache needs an explicit eviction strategy.',
        whyHi: 'Ek in-memory cache jismein koi size limit aur koi expiration nahi hai process ki poori umr ke liye bina-seemaa badhta hai — har cache ko ek explicit eviction strategy chahiye.',
      },
      {
        wrong: `// Opening the debugging inspector on a public-facing port with no access restriction
node --inspect=0.0.0.0:9229 server.js // reachable from the internet`,
        right: `// Bind the inspector to localhost only, or a trusted internal network
node --inspect=127.0.0.1:9229 server.js`,
        why: 'The inspector protocol grants full debugging access to the running process — exposing it on a public interface is a serious security risk, not just a profiling convenience.',
        whyHi: 'Inspector protocol chalte process ko poori debugging access deta hai — ise ek public interface par expose karna ek gambhir security khatra hai, sirf ek profiling suvidha nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Node.js\'s own built-in --inspect flag and Chrome DevTools\' Memory and Performance tabs are the standard, officially documented tools for profiling a Node.js process**, requiring no third-party service to get started.',
        hi: '**Node.js ka apna built-in \`--inspect\` flag aur Chrome DevTools ke Memory aur Performance tabs ek Node.js process ko profile karne ke liye standard, officially documented tools hain**, shuru karne ke liye koi third-party service ki zaroorat nahi.',
      },
      {
        en: '**clinic.js is a widely used, purpose-built Node.js profiling toolkit** that wraps Node\'s lower-level profiling primitives into more approachable, visual reports (flame graphs, bubble diagrams) specifically for diagnosing performance issues.',
        hi: '**clinic.js ek vyaapak roop se istemal hota, khaas taur par is maqsad ke liye bana Node.js profiling toolkit hai** jo Node ke nichle-star ke profiling primitives ko zyaada aasaan, visual reports (flame graphs, bubble diagrams) mein wrap karta hai khaas taur par performance issues ki jaanch ke liye.',
      },
      {
        en: '**An unbounded in-memory cache or collection is one of the most commonly cited real-world causes of a slow, gradual production memory leak**, precisely because it looks completely correct in any short-lived test and only reveals itself over a much longer runtime.',
        hi: '**Ek bina-seemaa in-memory cache ya collection ek dheeme, gradual production memory leak ke sabse aam taur par cite kiye jaane waale asli-duniya kaaranon mein se ek hai**, bilkul isliye kyunki ye kisi bhi chhote-samay wale test mein poori tarah sahi dikhta hai aur sirf ek kaafi lambe runtime ke baad zaahir hota hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does an unbounded in-memory cache or array typically pass every manual and automated test, only to cause a real production incident days or weeks later?',
        qHi: 'Ek bina-seemaa in-memory cache ya array aam taur par har manual aur automated test kyun pass karta hai, sirf din ya hafton baad ek asli production incident cause karne ke liye?',
        a: 'A structure that grows by one entry per request and is never trimmed has a memory footprint that is directly proportional to the total number of requests it has processed since the process started — a quantity that any short-lived test run, by its very nature, keeps extremely small. A quick manual test might exercise the route a handful of times; even a fairly thorough automated test suite typically runs for at most a few minutes and issues, at most, a few thousand requests across an entire run — at that scale, an unbounded array holding a few thousand small objects consumes a genuinely negligible, unnoticeable amount of memory, and the test suite passes, the manual verification looks fine, and the code gets deployed with every reasonable check having found nothing wrong. The problem is that a real production deployment does not run for a few minutes and then exit — it runs continuously, for hours, days, or weeks at a time, accumulating requests the entire time it stays up, and an unbounded structure\'s memory usage grows in direct, unbroken proportion to that much larger, much longer-accumulated total. The specific point at which this becomes an actual, visible problem — the process running out of available memory and crashing — depends on how much memory each accumulated entry actually occupies and how much total memory the process has available, but it is an inevitable eventual outcome for any genuinely unbounded structure running for long enough, regardless of how well-tested the code appeared to be at deployment time, since no realistic test run ever approximates the sheer duration and request volume a real production deployment experiences.',
        aHi: 'Ek structure jo prati-request ek entry se badhta hai aur kabhi trim nahi hota uska memory footprint us kul requests ki tadaad ke seedhe anupaat mein hai jo isne process shuru hone se process ki hai — ek maatra jise koi bhi chhote-samay wala test run, apni prakriti se hi, bahut chhota rakhta hai. Ek jaldi manual test shaayad route ko mutthi bhar baar exercise kare; ek kaafi vistrit automated test suite bhi aam taur par ek poore run ke aar-paar zyaada-se-zyaada kuch minute chalta hai aur zyaada-se-zyaada, kuch hazaar requests jaari karta hai — us scale par, kuch hazaar chhote objects rakhta ek bina-seemaa array sach mein mamuli, na-dikhne-laayak memory istemal karta hai, aur test suite pass hota hai, manual verification theek dikhta hai, aur code deploy ho jaata hai har samajhdaari-bhare check ke kuch bhi galat na paane ke saath. Samasya ye hai ki ek asli production deployment kuch minuton ke liye nahi chalta aur phir exit nahi karta — ye lagaataar chalta hai, ghanton, dinon, ya hafton tak, poore samay requests jama karte hue jab tak ye chalta rehta hai, aur ek bina-seemaa structure ka memory istemal us kaafi bade, kaafi zyaada-samay-tak-jama-hue kul ke seedhe, na-tootne-laayak anupaat mein badhta hai. Wo khaas point jahan ye ek asli, dikhta samasya ban jaata hai — process ke paas upalabdh memory khatam ho jaana aur crash hona — is baat par nirbhar hai ki har jama hui entry asal mein kitni memory occupy karti hai aur process ke paas kitni kul memory upalabdh hai, par ye kisi bhi sach mein bina-seemaa structure ke liye kaafi der chalne ke liye ek avashyambhaavi aakhirkaar ka natija hai, chahe deployment ke waqt code kitna bhi achhi tarah test kiya gaya dikha ho, kyunki koi bhi wastavik test run kabhi bhi ek asli production deployment ke asli avdhi aur request volume ki barabari nahi karta.',
      },
      {
        q: 'What is the practical process for using two heap snapshots to identify the specific cause of a memory leak?',
        qHi: 'Ek memory leak ke khaas kaaran ko pehchaanne ke liye do heap snapshots istemal karne ka vyavhaarik process kya hai?',
        a: 'A single heap snapshot, by itself, shows every object currently alive in memory at that one instant, but this alone doesn\'t directly reveal a leak, since a healthy, correctly functioning application also holds plenty of legitimate objects in memory at any given moment — the snapshot has no inherent way to distinguish "this object is supposed to be here" from "this object is an accumulating leak." What actually reveals a leak is comparison over time: taking a first snapshot at some starting point, then deliberately exercising the application under realistic, representative load for a meaningful period (long enough that a genuine leak would have accumulated a noticeably larger amount than normal, ordinary fluctuation would produce), and then taking a second snapshot under comparable conditions. Chrome DevTools\' Memory panel provides a dedicated "Comparison" view specifically for this purpose, which lines up the two snapshots and shows, for every object type present, how its count and total retained memory changed between the two points in time. In a genuinely healthy application, most object types should show roughly stable or only modestly fluctuating numbers between the two snapshots, reflecting normal object creation and garbage collection continuing to work as expected. An object type whose count or retained size grew substantially and consistently between the two snapshots, with no corresponding decrease, is the specific signature of a leak — and critically, DevTools also shows the retaining path for instances of that object type, meaning it can reveal not just WHICH kind of object is accumulating, but the actual chain of references (which variable, which array, which closure) that is holding those objects alive and preventing garbage collection from ever reclaiming them, pointing directly at the specific line of code responsible rather than leaving that as a separate, unresolved question.',
        aHi: 'Ek akeli heap snapshot, khud se, memory mein us ek pal par abhi zinda har object dikhaati hai, par ye akele seedhe ek leak zaahir nahi karti, kyunki ek sehatmand, sahi tarike se kaam kar rahi application bhi kisi bhi diye pal memory mein kaafi vaidh objects rakhti hai — snapshot ke paas "ye object yahaan hone ke liye hai" ko "ye object ek jama hota leak hai" se alag karne ka koi buniyaadi tarika nahi hai. Jo asal mein ek leak zaahir karta hai waqt ke saath comparison hai: ek shuruaati point par ek pehli snapshot lena, phir jaan-boojhkar application ko wastavik, pratinidhi load ke neeche ek maayne-rakhta avdhi ke liye exercise karna (itni lambi ki ek asli leak ne normal, aam utaar-chadhaav paida karega us se dhyaan-denen-laayak zyaada jama kiya ho), aur phir tulnaatmak sthitiyon mein ek doosri snapshot lena. Chrome DevTools ka Memory panel khaas taur par is maqsad ke liye ek dedicated "Comparison" view deta hai, jo do snapshots ko milaata hai aur dikhaata hai, maujood har object type ke liye, ki uska count aur kul retained memory do pal ke beech kaise badla. Ek sach mein sehatmand application mein, zyaadatar object types ko do snapshots ke beech lagbhag sthir ya sirf halke utaar-chadhaav wale numbers dikhaane chahiye, normal object creation aur garbage collection ke umeed ke hisaab se kaam karte rehne ko darsaate hue. Ek object type jiska count ya retained size do snapshots ke beech kaafi aur consistently badha, koi mutaalliq kami bina, ek leak ka khaas sanket hai — aur bahut zaruri, DevTools us object type ke instances ke liye retaining path bhi dikhaata hai, matlab ye na sirf ye zaahir kar sakta hai ki KAUNSA tarah ka object jama ho raha hai, balki references ki asli chain (kaunsa variable, kaunsa array, kaunsa closure) jo un objects ko zinda rakh rahi hai aur garbage collection ko unhe kabhi wapas lene se rok rahi hai, seedhe zimmedaar khaas line of code ki taraf ishaara karte hue ise ek alag, na-suljhi sawaal ki tarah chhodne ke bajaye.',
      },
      {
        q: 'Why is guessing which function is slow, and rewriting it speculatively, an unreliable approach compared to using an actual CPU profiler?',
        qHi: 'Kaunsa function dheema hai anumaan lagaana, aur ise anumaanit taur par dobara likhna, ek asli CPU profiler istemal karne ke muqable ek na-bharosemand tarika kyun hai?',
        a: 'A developer\'s intuition about which specific piece of code is likely responsible for a performance problem is based on subjective impressions — which parts of the code "feel" complex, which operations "seem" like they could be expensive, or which function was written most recently and is therefore top of mind — none of which is actual, measured evidence about where the running program genuinely spends its CPU time. Modern JavaScript engines optimize code in ways that can be genuinely counter-intuitive: a piece of code that looks simple on the page can sometimes be surprisingly expensive due to how it interacts with the engine\'s optimization behavior, while a piece of code that looks complex can sometimes execute very quickly once optimized, meaning intuition about "what looks slow" frequently does not match what is actually slow in practice. A CPU profiler, by contrast, directly measures where the running process\'s CPU time genuinely goes, sampling the call stack at fixed intervals while the program executes under real, representative load, and aggregating those samples into a precise breakdown of exactly how much total time was spent inside each specific function. A flame graph presents this measured data visually, with the width of each section directly proportional to the actual time spent in that function, making the genuine bottleneck immediately, visually obvious rather than requiring anyone\'s guess. Acting on a profiler\'s findings means engineering effort is spent precisely on the function actually responsible for the bulk of the measured time, with direct, before-and-after evidence (a new profiling run after the fix) that the change genuinely improved the metric that mattered — as opposed to guessing, rewriting a function based on intuition, and having no reliable way to confirm whether that specific change actually helped, made no difference, or optimized something that was never the real bottleneck to begin with.',
        aHi: 'Ek developer ka intuition ki koi khaas code ka tukda ek performance samasya ke liye zimmedaar hone ki sambhaavna rakhta hai subjective impressions par aadhaarit hai — code ke kaunse hisse "complex" mehsoos hote hain, kaunse operations "mehnga" lagte hain, ya kaunsa function sabse haal mein likha gaya tha aur isliye dimaag mein sabse oopar hai — inmein se kuch bhi is baare mein asli, naapa gaya evidence nahi hai ki chalta program asal mein apna CPU time kahaan bitaata hai. Modern JavaScript engines code ko un tareekon se optimize karte hain jo sach mein counter-intuitive ho sakte hain: code ka ek tukda jo page par saadha dikhta hai kabhi-kabhi ye kaise engine ke optimization vyavhaar se interact karta hai iski wajah se ashcharyajanak roop se mehnga ho sakta hai, jabki code ka ek tukda jo complex dikhta hai kabhi-kabhi ek baar optimize hone ke baad bahut jaldi execute ho sakta hai, matlab "kya dheema dikhta hai" ke baare mein intuition aksar us se match nahi karta jo practice mein asal mein dheema hai. Ek CPU profiler, iske ulta, seedhe naapta hai ki chalte process ka CPU time asal mein kahaan jaata hai, program ke asli, pratinidhi load ke neeche chalte waqt tay antaraal par call stack ko sample karte hue, aur un samples ko ek sateek breakdown mein jama karte hue ki bilkul kitna kul waqt har khaas function ke andar bitaaya gaya. Ek flame graph is naape gaye data ko visually pesh karta hai, har section ki chaudaai us function mein bitaaye asli waqt ke seedhe anupaat mein, asli bottleneck ko turant, visually saaf banaate hue kisi ke anumaan ki maang kiye bina. Ek profiler ki khoj par kaarvaai karna matlab hai engineering prayaas bilkul us function par kharch hota hai jo naape gaye waqt ke bade hisse ke liye asal mein zimmedaar hai, seedhe, pehle-aur-baad evidence ke saath (fix ke baad ek nayi profiling run) ki badlaav ne asal mein us metric ko behtar kiya jo maayne rakhta tha — anumaan lagaane, intuition ke aadhaar par ek function dobara likhne, aur ye confirm karne ka koi bharosemand tarika na hone ke muqable ki kya us khaas badlaav ne asal mein madad ki, koi antar nahi kiya, ya kuch aisa optimize kiya jo shuru se hi asli bottleneck tha hi nahi.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken recentRequests middleware from this lesson. Write a script that sends thousands of requests to it, and observe memory usage growing using process.memoryUsage() logged periodically.',
        taskHi: 'Is lesson ka toota \`recentRequests\` middleware banaao. Ek script likho jo ise hazaaron requests bheje, aur \`process.memoryUsage()\` ko periodically log karke memory istemal badhta hua dekho.',
        hint: 'Log process.memoryUsage().heapUsed every few seconds in a separate interval while the load-generating script runs, and watch the number climb.',
        hintHi: 'Load-generate karti script chalte waqt ek alag interval mein har kuch seconds \`process.memoryUsage().heapUsed\` log karo, aur number ko badhte hue dekho.',
      },
      {
        task: 'Start the same server with node --inspect, connect Chrome DevTools, and take two heap snapshots before and after running the load script. Use the Comparison view to identify the growing array.',
        taskHi: 'Wahi server \`node --inspect\` ke saath shuru karo, Chrome DevTools connect karo, aur load script chalaane se pehle aur baad mein do heap snapshots lo. Comparison view istemal karke badhte array ko pehchaano.',
        hint: 'The retained size column in the Comparison view, sorted descending, should make the growing recentRequests array one of the first things visible.',
        hintHi: 'Comparison view ka retained size column, descending sorted, badhta \`recentRequests\` array ko sabse pehle dikhti cheezon mein se ek banaana chahiye.',
      },
      {
        task: 'Fix the middleware using the bounded-array pattern from this lesson\'s fixed example. Rerun the same two-snapshot comparison and confirm the array\'s retained size no longer grows.',
        taskHi: 'Is lesson ke theek example ke bounded-array pattern istemal karke middleware theek karo. Wahi do-snapshot comparison dobara chalaao aur confirm karo ki array ka retained size ab nahi badhta.',
        hint: 'Run the exact same load script both times so the comparison is fair — the only thing that should differ between the two test runs is the fix itself.',
        hintHi: 'Dono baar bilkul wahi load script chalaao taaki comparison fair ho — do test runs ke beech sirf fix hi alag hona chahiye.',
      },
    ],

    keyTakeaways: [
      'An unbounded in-memory array, cache, or collection that grows with every request and is never trimmed is one of the most common, genuinely easy-to-write memory leaks in real Node.js applications.',
      'Such a leak typically passes every short-lived manual or automated test, since its memory footprint is proportional to total requests processed — a quantity only a long-running production deployment ever accumulates enough of to matter.',
      'A heap snapshot captures every object alive in memory at one instant; comparing two snapshots taken under realistic load reveals which specific object types are growing rather than requiring a guess.',
      'CPU profiling (via --prof or clinic.js\'s flame graphs) measures exactly where a program\'s CPU time actually goes, turning "this route feels slow" into a precise, evidence-based finding rather than intuition.',
      'The debugging inspector protocol grants full access to a running process — it should only ever be bound to localhost or a trusted internal network, never exposed on a public-facing interface.',
      'Fixing a genuine leak or hotspot found through profiling, then re-profiling to confirm the fix worked, provides direct, observable evidence — as opposed to guessing and hoping a speculative rewrite helped.',
    ],
    keyTakeawaysHi: [
      'Ek bina-seemaa in-memory array, cache, ya collection jo har request ke saath badhta hai aur kabhi trim nahi hota asli Node.js applications mein sabse aam, sach mein aasaani-se-likhe-jaane-laayak memory leaks mein se ek hai.',
      'Aisa leak aam taur par har chhote-samay wala manual ya automated test pass karta hai, kyunki iska memory footprint process ki gayi kul requests ke anupaat mein hai — ek maatra jiska maayne-rakhta itna jama karna sirf ek lambe-samay tak chalti production deployment hi kar paati hai.',
      'Ek heap snapshot ek pal par memory mein zinda har object capture karta hai; wastavik load ke neeche liye gaye do snapshots ko compare karna dikhaata hai ki kaunsi khaas object types badh rahi hain ek anumaan ki maang karne ke bajaye.',
      'CPU profiling (\`--prof\` ya \`clinic.js\` ke flame graphs ke zariye) bilkul naapta hai ki ek program ka CPU time asal mein kahaan jaata hai, "ye route dheemi mehsoos hoti hai" ko intuition ke bajaye ek sateek, evidence-aadhaarit khoj mein badalte hue.',
      'Debugging inspector protocol ek chalte process ko poori access deta hai — ise kabhi sirf localhost ya ek bharosemand internal network se bandh hona chahiye, kabhi ek public-facing interface par expose nahi.',
      'Profiling ke zariye mile ek asli leak ya hotspot ko theek karna, phir fix kaam kiya confirm karne ke liye dobara profile karna, seedha, dekha jaane-laayak evidence deta hai — anumaan lagaane aur umeed karne ke bajaye ki ek anumaanit rewrite ne madad ki.',
    ],
  },
];
