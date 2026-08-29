/**
 * Node.js Complete Course — Module 5: Real-World Patterns & Architecture,
 * lesson 3.
 *
 * Structured logging: why scattering console.log across a production
 * application produces output that is both dangerous (accidentally logging
 * a plaintext password from req.body) and practically useless once real
 * concurrent traffic hits (interleaved lines from many simultaneous
 * requests with no way to tell which log line belongs to which request).
 * Broken example: console.log(JSON.stringify(req.body)) during signup
 * debugging leaks a real password into permanent log storage, and plain
 * console.log calls with no request identifier make debugging one specific
 * failing request among thousands of concurrent ones effectively
 * impossible. Fixed with a structured logger (winston), explicit field
 * selection instead of logging whole objects, and a per-request correlation
 * ID attached via middleware.
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

export const NODE_MODULE_5_PART3: CourseLesson[] = [
  {
    slug: 'structured-logging',
    title: 'Structured Logging: Why console.log Fails in Production',
    titleHi: 'Structured Logging: console.log Production Mein Kyun Fail Hota Hai',
    description: 'A debugging console.log(req.body) during signup quietly writes a real user\'s plaintext password into permanent log storage — and stays there long after the bug is fixed.',
    descriptionHi: 'Signup ke dauraan ek debugging \`console.log(req.body)\` chupke se ek asli user ka plaintext password permanent log storage mein likh deta hai — aur bug theek hone ke kaafi baad tak wahin rehta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**A security guard who shouts every single thing they notice into an open radio channel that everyone can hear, all mixed together with no names or timestamps attached, versus one who writes a dated, signed incident report to a specific numbered case file for every event.** Scattering console.log statements through an application is like a guard who, noticing something worth remembering, simply shouts it into a shared open channel — "someone at the door," "checking badge," "looks fine" — with no indication of WHICH visitor any given shout refers to, no timestamp, and no way to later search back through only what happened at the east entrance. When only one visitor is being processed at a time, this is mildly disorganized but still followable — there is only one possible person each shout could be about. The moment five different visitors are being checked in at five different entrances simultaneously, the shared channel becomes an unfollowable wall of overlapping shouts, with genuinely no way to determine which "looks fine" belongs to which visitor at which door. A guard trained to write a proper incident report instead assigns every visitor a specific case number the moment they arrive, and every single note about that visitor — no matter which guard writes it, or at which point in the process — is filed under that same case number, with a timestamp, so that anyone reviewing the log later can pull exactly the entries for one specific visitor\'s case and read them in order, entirely unmixed with anyone else\'s. And critically, a properly trained guard also never writes something a visitor\'s own private documents contain — a passport number, a bank card\'s PIN — directly into a report that many other staff members can freely read, precisely because a report is meant to be searchable and shareable, and a shareable record is the worst possible place for something that must stay secret.',
      hi: '**Ek security guard jo jo bhi cheez notice karta hai use ek khule radio channel par chillaakar bolta hai jise sab sun sakte hain, sab kuch ek saath milaa hua bina koi naam ya timestamp jode, versus ek jo har event ke liye ek khaas numbered case file mein ek dated, signed incident report likhta hai.** Ek application mein \`console.log\` statements bikhraana ek aise guard jaisa hai jo, kuch yaad rakhne laayak notice karke, bas use ek shared khule channel mein chillaata hai — "koi darwaaze par," "badge check kar raha," "theek lagta hai" — bina ye ishara kiye ki kaunsa visitor kisi diye chillaane se juda hai, koi timestamp nahi, aur baad mein sirf east entrance par kya hua use search karne ka koi tarika nahi. Jab ek waqt mein sirf ek visitor process ho raha hai, ye halka bekaayada hai par phir bhi follow-karne-laayak hai — har chillaane ke liye sirf ek mumkin insaan ho sakta hai. Jis pal paanch alag visitors paanch alag entrances par ek saath check ho rahe hain, shared channel ek follow-na-hone-laayak overlapping chillaahaton ki deewaar ban jaata hai, sach mein ye tay karne ka koi tarika nahi ki kis darwaaze ke kis visitor ka "theek lagta hai" hai. Ek guard jise ek theek incident report likhne ki training di gayi hai iske bajaye har visitor ko unke pahunchte hi ek khaas case number deta hai, aur us visitor ke baare mein har akela note — chahe koi bhi guard use likhe, ya process mein kisi bhi point par — bilkul usi case number ke neeche file hota hai, ek timestamp ke saath, taaki koi bhi jo baad mein log review kare bilkul ek khaas visitor ke case ki entries nikaal sake aur unhe tarteeb se padh sake, kisi aur se poori tarah na-mile hue. Aur bahut zaruri, ek theek training paaya guard bhi kabhi wo cheez nahi likhta jo ek visitor ke apne private documents mein hoti hai — ek passport number, ek bank card ka PIN — seedha ek report mein jise kai doosre staff members khule aam padh sakte hain, theek isliye kyunki ek report search-hone-laayak aur share-hone-laayak hona chahiye, aur ek share-hone-laayak record us cheez ke liye sabse buri jagah hai jise secret rehna chahiye.',
    },

    simple: `**Start broken.** A signup route, and a request-timing helper, debugged with plain \`console.log\`:

\`\`\`js
app.post("/signup", async (req, res, next) => {
  console.log("Signup request:", req.body);

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [req.body.email, hashedPassword]
    );
    console.log("User created:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log("Signup failed:", err);
    next(err);
  }
});
\`\`\`

This code was written to help debug signup issues during development, and while working alone against a handful of manual test requests, it genuinely helps — each \`console.log\` line is easy to spot, easy to read, and clearly connected to the request that triggered it. The moment this reaches production, two separate, serious problems appear. First, \`console.log("Signup request:", req.body)\` prints the ENTIRE request body, including the plaintext \`password\` field the user just typed — before it is ever hashed — directly into the server\'s log output, which is very commonly collected, stored, and retained (often for months, for compliance or debugging reasons) by a separate log-aggregation service. This means a real user\'s actual plaintext password now sits in a log archive somewhere, in exactly the same way this module\'s first lesson demonstrated a plaintext-stored password sits in a database — a data exposure risk of the same severity, just introduced through a debugging habit rather than a database schema. Second, once real production traffic means many signup requests are being processed concurrently, every one of these \`console.log\` lines from many different, simultaneous requests is printed to the exact same output stream, interleaved with no timestamp and no way to tell which "Signup failed" line belongs to which specific failing request — debugging one particular user\'s reported problem among thousands of interleaved lines becomes close to impossible.

**The fix: a structured logger, explicit field selection, and a per-request ID**

\`\`\`js
const logger = require("./logger"); // a configured winston logger, shown below

app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  next();
});

app.post("/signup", async (req, res, next) => {
  logger.info("Signup attempt", { requestId: req.requestId, email: req.body.email });

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [req.body.email, hashedPassword]
    );
    logger.info("User created", { requestId: req.requestId, userId: result.rows[0].id });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error("Signup failed", { requestId: req.requestId, error: err.message });
    next(err);
  }
});
\`\`\`

\`\`\`ts
import logger from "./logger";
import crypto from "crypto";

app.use((req: Request & { requestId?: string }, res: Response, next: NextFunction): void => {
  req.requestId = crypto.randomUUID();
  next();
});

app.post("/signup", async (req: Request & { requestId?: string }, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Signup attempt", { requestId: req.requestId, email: req.body.email });

  try {
    const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [req.body.email, hashedPassword]
    );
    logger.info("User created", { requestId: req.requestId, userId: result.rows[0].id });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error("Signup failed", { requestId: req.requestId, error: (err as Error).message });
    next(err);
  }
});
\`\`\`

Two changes fix two separate problems. First, only specifically chosen, deliberately safe fields (\`email\`, a generated \`userId\`, an error\'s \`message\`) are ever passed to the logger — never the entire \`req.body\` object wholesale, which is precisely what let the plaintext password leak in the broken version; logging must always be an explicit, deliberate choice of WHAT to record, never a reflexive dump of an entire object that happens to also contain something sensitive. Second, a \`requestId\`, generated once per incoming request via middleware and attached to \`req\`, is included in every single log line produced while handling that request — this means that even with many concurrent requests interleaving their output, every log line unambiguously states which specific request it belongs to, making it possible to filter or search for every log line connected to one particular user\'s reported problem, entirely regardless of how many other requests were being processed at the same moment.`,

    simpleHi: `**Toote hue se shuru.** Ek signup route, aur ek request-timing helper, saadhe \`console.log\` se debug kiya hua:

\`\`\`js
app.post("/signup", async (req, res, next) => {
  console.log("Signup request:", req.body);

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [req.body.email, hashedPassword]
    );
    console.log("User created:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log("Signup failed:", err);
    next(err);
  }
});
\`\`\`

Ye code development ke dauraan signup issues debug karne mein madad ke liye likha gaya tha, aur akele mutthi bhar manual test requests ke khilaaf kaam karte hue, ye sach mein madad karta hai — har \`console.log\` line dhoondhna aasaan hai, padhna aasaan hai, aur us request se saaf taur par judi hai jisne use trigger kiya. Jis pal ye production tak pahunchta hai, do alag, gambhir samasyaayein zaahir hoti hain. Pehla, \`console.log("Signup request:", req.body)\` POORI request body print karta hai, us plaintext \`password\` field sameet jo user ne bas type kiya — us se pehle ki wo kabhi hash ho — seedha server ke log output mein, jo bahut aam taur par ikattha, store, aur (aksar mahinon ke liye, compliance ya debugging wajahon se) rakha jaata hai ek alag log-aggregation service dwara. Iska matlab hai ek asli user ka asli plaintext password ab kahin ek log archive mein baitha hai, bilkul usi tarike se jaise is module ke pehle lesson ne dikhaaya tha ki ek plaintext-stored password ek database mein baitha hai — ek data exposure khatra jo utna hi gambhir hai, bas ek debugging aadat se aaya hai ek database schema se nahi. Doosra, ek baar asli production traffic ka matlab hai kai signup requests ek saath process ho rahi hain, in \`console.log\` lines mein se har ek kai alag, saath-saath ho rahi requests se bilkul usi output stream mein print hoti hai, bina timestamp ke, koi tarika nahi ki kaunsi "Signup failed" line kis khaas fail ho rahi request se hai — hazaaron mile-julii lines mein se ek khaas user ki batayi samasya debug karna lagbhag namumkin ban jaata hai.

**Fix: ek structured logger, explicit field selection, aur ek per-request ID**

\`\`\`js
const logger = require("./logger"); // ek configure kiya winston logger, neeche dikhaaya gaya

app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  next();
});

app.post("/signup", async (req, res, next) => {
  logger.info("Signup attempt", { requestId: req.requestId, email: req.body.email });

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [req.body.email, hashedPassword]
    );
    logger.info("User created", { requestId: req.requestId, userId: result.rows[0].id });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error("Signup failed", { requestId: req.requestId, error: err.message });
    next(err);
  }
});
\`\`\`

\`\`\`ts
import logger from "./logger";
import crypto from "crypto";

app.use((req: Request & { requestId?: string }, res: Response, next: NextFunction): void => {
  req.requestId = crypto.randomUUID();
  next();
});

app.post("/signup", async (req: Request & { requestId?: string }, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Signup attempt", { requestId: req.requestId, email: req.body.email });

  try {
    const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [req.body.email, hashedPassword]
    );
    logger.info("User created", { requestId: req.requestId, userId: result.rows[0].id });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error("Signup failed", { requestId: req.requestId, error: (err as Error).message });
    next(err);
  }
});
\`\`\`

Do badlaav do alag samasyaayein theek karte hain. Pehla, sirf khaas taur par chuni, jaan-boojhkar surakshit fields (\`email\`, ek banaayi \`userId\`, ek error ka \`message\`) hi kabhi logger ko diye jaate hain — kabhi poora \`req.body\` object bilkul nahi, jo bilkul wahi hai jisne toote version mein plaintext password leak hone diya; logging hamesha ek explicit, jaan-boojhkar choice hona chahiye ki KYA record karna hai, kabhi ek poore object ka reflexive dump nahi jismein samyog se kuch sensitive bhi ho. Doosra, ek \`requestId\`, jo har aati request ke liye ek baar middleware ke through banta hai aur \`req\` se juda hai, us request ko sambhaalte waqt banti har akeli log line mein shaamil hota hai — iska matlab hai chahe kai concurrent requests apna output mila rahi hon, har log line saaf taur par batati hai ki ye kis khaas request se hai, ek khaas user ki batayi samasya se judi har log line ko filter ya search karna mumkin banaate hue, us waqt kitni bhi doosri requests process ho rahi thi us se poori tarah bekhabar.`,

    content: `## Levels: not every message deserves the same attention

\`\`\`js
logger.debug("Cache lookup for key", { key: cacheKey });   // verbose, useful only while actively debugging
logger.info("User logged in", { userId: user.id });         // normal, expected operation
logger.warn("Rate limit approaching threshold", { ip });     // not an error, but worth noticing
logger.error("Database connection failed", { error: err.message }); // something is genuinely wrong
\`\`\`

A structured logger provides distinct SEVERITY LEVELS (commonly \`debug\`, \`info\`, \`warn\`, \`error\`), and a logging configuration typically specifies a minimum level to actually output — in production, a system might be configured to record only \`info\` and above, silencing noisy \`debug\`-level detail that was useful during development but would otherwise flood production logs with volume nobody needs day to day. \`console.log\` provides no such distinction at all — every single call looks identical regardless of whether it represents routine information or a genuine failure, which makes it impossible to later filter "show me only the actual problems" without manually inspecting every line\'s text.

## Machine-readable output: why JSON logs matter at real scale

\`\`\`js
// A structured logger's typical output — one JSON object per line
{"level":"error","message":"Signup failed","requestId":"a1b2...","timestamp":"2026-01-15T10:32:01.000Z"}

// versus console.log's plain, unstructured text
Signup failed: Error: duplicate key value violates unique constraint
\`\`\`

Beyond being readable by a human scrolling through a terminal, a structured logger\'s output is typically formatted as one JSON object per line — a format a log-aggregation or monitoring service (Datadog, Elasticsearch, CloudWatch, and similar tools, covered in more depth in this course\'s later deployment content) can automatically parse, index, and query, letting an engineer later ask something like "show me every \`error\`-level log line with this specific \`requestId\`" as an actual structured search, rather than manually scrolling through raw text output hoping to spot the right lines. \`console.log\`\'s freeform text output has no such guaranteed structure, which makes this kind of automated searching and filtering far harder or outright impossible at any real production scale.

## The specific danger of logging whole objects: it silently captures whatever they contain later

\`\`\`js
// WRONG — logs whatever req.body happens to contain, including fields added later
logger.info("Signup attempt", { body: req.body });

// RIGHT — only the specific fields deliberately chosen as safe to record
logger.info("Signup attempt", { email: req.body.email });
\`\`\`

A particularly easy mistake to make, beyond the specific password example this lesson opened with, is logging an entire object (\`req.body\`, a full database row, a whole error object) simply because it is convenient, rather than deliberately selecting which fields are actually safe and useful to record. This is dangerous not only because of what such an object might contain today, but because of what it might come to contain LATER — a signup form innocently gaining a new field for, say, a security question\'s answer, or a payment form\'s body later including a card number, would silently and automatically start being logged in full the moment that field is added, with no one needing to remember to update any logging code at all, unless the logging itself was written to select specific fields explicitly from the start.

## A minimal, realistic winston setup

\`\`\`js
// logger.js
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
\`\`\`

A configured logger is typically created once, in its own small module, and imported everywhere it is needed — following the same "configure once, reuse everywhere" pattern this course has used for the database connection pool. The minimum level actually recorded (\`level\`) is commonly set differently between development (\`debug\`, showing everything, to help while actively working) and production (\`info\`, hiding routine debug detail while still capturing normal operation, warnings, and errors) — following the same \`NODE_ENV\`-based branching pattern covered in this course\'s earlier configuration lesson.`,

    contentHi: `## Levels: har message ek jaisi tavajjo ke laayak nahi

\`\`\`js
logger.debug("Cache lookup for key", { key: cacheKey });   // vistrit, kaam ka sirf actively debug karte waqt
logger.info("User logged in", { userId: user.id });         // aam, ummeed ki gayi operation
logger.warn("Rate limit approaching threshold", { ip });     // koi error nahi, par notice karne laayak
logger.error("Database connection failed", { error: err.message }); // kuch sach mein galat hai
\`\`\`

Ek structured logger alag-alag SEVERITY LEVELS deta hai (aam taur par \`debug\`, \`info\`, \`warn\`, \`error\`), aur ek logging configuration aam taur par ek minimum level batati hai jo asal mein output kiya jaaye — production mein, ek system sirf \`info\` aur uske oopar record karne ke liye configure kiya jaa sakta hai, us shor bhare \`debug\`-level detail ko chup karaate hue jo development ke dauraan kaam ka tha par warna production logs ko itni volume se bhar deta jiski kisi ko roz zarurat nahi. \`console.log\` bilkul koi aisa farak nahi deta — har akeli call ek-jaisi dikhti hai chahe wo routine jaankaari darzha kare ya ek asli asafalta, jo baad mein "mujhe sirf asli samasyaayein dikhao" filter karna namumkin banaata hai bina har line ka text haath se check kiye.

## Machine-padhne-laayak output: JSON logs asli scale par kyun maayne rakhte hain

\`\`\`js
// Ek structured logger ka aam output — ek JSON object prati line
{"level":"error","message":"Signup failed","requestId":"a1b2...","timestamp":"2026-01-15T10:32:01.000Z"}

// versus console.log ka saadha, na-structured text
Signup failed: Error: duplicate key value violates unique constraint
\`\`\`

Ek terminal mein scroll karte insaan ke liye padhne-laayak hone se aage, ek structured logger ka output aam taur par ek JSON object prati line ki tarah format hota hai — ek format jise ek log-aggregation ya monitoring service (Datadog, Elasticsearch, CloudWatch, aur waise hi tools, is course ke baad wale deployment content mein zyaada gehraayi se cover honge) apne aap parse, index, aur query kar sakta hai, ek engineer ko baad mein kuch aisa poochne dete hue jaise "mujhe is khaas \`requestId\` wali har \`error\`-level log line dikhao" ek asli structured search ki tarah, raw text output ko haath se scroll karke sahi lines dhoondhne ki ummeed karne ke bajaye. \`console.log\` ke freeform text output mein aisi koi guaranteed sanrachna nahi hai, jo is kism ki automated searching aur filtering ko kisi bhi asli production scale par kaafi mushkil ya poori tarah namumkin banaata hai.

## Poore objects log karne ka khaas khatra: ye chupke se baad mein unme jo bhi ho use capture kar leta hai

\`\`\`js
// GALAT — jo bhi \`req.body\` mein hai use log karta hai, baad mein jode gaye fields sameet
logger.info("Signup attempt", { body: req.body });

// SAHI — sirf wo khaas fields jinhe jaan-boojhkar surakshit chuna gaya hai record karne ke liye
logger.info("Signup attempt", { email: req.body.email });
\`\`\`

Is lesson ki shuruaat wale khaas password example se aage, ek khaas taur par aasaan galti poora object (\`req.body\`, ek poori database row, ek poora error object) log karna hai sirf isliye kyunki ye suvidhaajanak hai, jaan-boojhkar ye chunne ke bajaye ki kaunse fields asal mein record karne ke liye surakshit aur kaam ke hain. Ye khatarnaak isliye nahi hai sirf iske liye ki aisa object aaj kya rakh sakta hai, balki iske liye bhi ki ye BAAD mein kya rakhne laga sakta hai — ek signup form ka bhole-bhaale ek security question ke jawaab ke liye ek naya field paana, ya ek payment form ki body mein baad mein ek card number shaamil hona, chupke se aur apne aap poori tarah log hona shuru ho jaayega jis pal wo field jodi jaati hai, kisi ko bhi koi logging code update karne ki yaad rakhne ki zarurat bina, jab tak logging khud shuruaat se hi khaas fields explicitly chunne ke liye na likhi gayi ho.

## Ek chhota, waastavik winston setup

\`\`\`js
// logger.js
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
\`\`\`

Ek configure kiya logger aam taur par ek baar, apne khud ke ek chhote module mein banaaya jaata hai, aur jahan bhi zarurat ho wahan import hota hai — is course ke database connection pool ke liye istemal hue usi "ek baar configure karo, har jagah dobara istemal karo" pattern ka palan karte hue. Asal mein record hone wala minimum level (\`level\`) aam taur par development (\`debug\`, sab kuch dikhaate hue, actively kaam karte waqt madad ke liye) aur production (\`info\`, routine debug detail chupaate hue jabki abhi bhi aam operation, warnings, aur errors capture karte hue) ke beech alag set hota hai — is course ke pehle wale configuration lesson mein cover hue usi \`NODE_ENV\`-based branching pattern ka palan karte hue.`,

    examples: [
      {
        title: 'Broken: console.log(req.body) leaks a plaintext password into logs',
        titleHi: 'Toota: \`console.log(req.body)\` logs mein ek plaintext password leak karta hai',
        code: `console.log("Signup request:", req.body);
// req.body.password is the user's raw, unhashed password — now permanently in log storage`,
        codeJs: `app.post("/signup", async (req, res, next) => {
  console.log("Signup request:", req.body);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [req.body.email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log("Signup failed:", err);
    next(err);
  }
});`,
        codeTs: `app.post("/signup", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("Signup request:", req.body);
  try {
    const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [req.body.email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log("Signup failed:", err);
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the vulnerability is
// entirely about what data reaches the logs, not a type error.`,
        output: `A real signup request with password "hunter2" writes exactly that
plaintext string into the server's console output — and, in a
production deployment, into whatever log-storage or aggregation
service collects that output, often retained for months.`,
        explain: 'The password is captured before it is ever hashed, purely because the entire request body was logged wholesale rather than deliberately selecting only safe fields.',
        explainHi: 'Password use kabhi hash hone se pehle capture ho jaata hai, poori tarah isliye kyunki poori request body ko bilkul bulk mein log kiya gaya, jaan-boojhkar sirf surakshit fields chunne ke bajaye.',
      },
      {
        title: 'Fixed: explicit field selection through a structured logger',
        titleHi: 'Theek: ek structured logger ke through explicit field selection',
        code: `logger.info("Signup attempt", { requestId: req.requestId, email: req.body.email });
// only the deliberately chosen, safe field is recorded — never the password`,
        codeJs: `const logger = require("./logger");

app.post("/signup", async (req, res, next) => {
  logger.info("Signup attempt", { requestId: req.requestId, email: req.body.email });
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [req.body.email, hashedPassword]
    );
    logger.info("User created", { requestId: req.requestId, userId: result.rows[0].id });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error("Signup failed", { requestId: req.requestId, error: err.message });
    next(err);
  }
});`,
        codeTs: `import logger from "./logger";

interface RequestWithId extends Request {
  requestId?: string;
}

app.post("/signup", async (req: RequestWithId, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Signup attempt", { requestId: req.requestId, email: req.body.email });
  try {
    const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [req.body.email, hashedPassword]
    );
    logger.info("User created", { requestId: req.requestId, userId: result.rows[0].id });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error("Signup failed", { requestId: req.requestId, error: (err as Error).message });
    next(err);
  }
});`,
        outputJs: `The same real signup request now logs only {"email":"user@example.com",
"requestId":"..."} — the password never appears anywhere in the log
output, regardless of what other fields req.body happens to contain.`,
        outputTs: `// Identical behaviour. RequestWithId extends Express's Request type
// to add the requestId field the correlation middleware attaches.`,
        explain: 'Logging is now an explicit, deliberate choice of exactly which fields to record — adding a new sensitive field to the request body later cannot silently start appearing in logs, since only named fields are ever passed through.',
        explainHi: 'Logging ab ek explicit, jaan-boojhkar choice hai ki bilkul kaunse fields record karne hain — request body mein baad mein ek naya sensitive field jodna chupke se logs mein dikhna shuru nahi kar sakta, kyunki sirf naam-liye fields hi kabhi through paas hote hain.',
      },
      {
        title: 'A per-request ID makes concurrent request logs distinguishable',
        titleHi: 'Ek per-request ID concurrent request logs ko alag-pehchaanne-laayak banaata hai',
        code: `app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  next();
});
// every log line during this request now includes the same requestId`,
        codeJs: `const crypto = require("crypto");

app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  next();
});

app.get("/posts/:id", async (req, res, next) => {
  logger.info("Fetching post", { requestId: req.requestId, postId: req.params.id });
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [req.params.id]);
    logger.info("Post fetched", { requestId: req.requestId, found: result.rows.length > 0 });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error("Post fetch failed", { requestId: req.requestId, error: err.message });
    next(err);
  }
});`,
        codeTs: `import crypto from "crypto";

interface RequestWithId extends Request {
  requestId?: string;
}

app.use((req: RequestWithId, res: Response, next: NextFunction): void => {
  req.requestId = crypto.randomUUID();
  next();
});

app.get("/posts/:id", async (req: RequestWithId, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Fetching post", { requestId: req.requestId, postId: req.params.id });
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [req.params.id]);
    logger.info("Post fetched", { requestId: req.requestId, found: result.rows.length > 0 });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error("Post fetch failed", { requestId: req.requestId, error: (err as Error).message });
    next(err);
  }
});`,
        outputJs: `With many requests processed concurrently, every log line from one
specific request shares the same requestId value, however many other
requests' log lines happen to interleave with it in the raw output —
filtering by that one ID isolates exactly that request's full story.`,
        outputTs: `// Identical behaviour. Generated the same way as a session ID earlier
// in this course — a fresh, unique value created once per request.`,
        explain: 'The requestId does not prevent logs from interleaving in the raw output stream — it makes each request\'s lines identifiable and searchable within that interleaved output.',
        explainHi: '\`requestId\` logs ko raw output stream mein mile-julne se nahi rokta — ye har request ki lines ko us mile-jule output ke andar pehchaanne-laayak aur search-hone-laayak banaata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `console.log("Signup request:", req.body);
// logs the entire request body, including a plaintext password field`,
        right: `logger.info("Signup attempt", { email: req.body.email });
// only the specific, deliberately chosen safe field is recorded`,
        why: 'Logging an entire object wholesale captures whatever it contains, today and in the future — a password, a card number, or any other sensitive field added later starts leaking into logs with no logging code changes required.',
        whyHi: 'Ek poore object ko bulk mein log karna jo bhi wo rakhta hai use capture karta hai, aaj aur bhavishya mein — ek password, ek card number, ya baad mein jodi koi bhi doosri sensitive field logs mein leak hona shuru kar deti hai bina koi logging code badle.',
      },
      {
        wrong: `console.log("Signup failed:", err);
// no request identifier — impossible to tell which concurrent request this belongs to`,
        right: `logger.error("Signup failed", { requestId: req.requestId, error: err.message });
// every log line from this request shares the same identifiable requestId`,
        why: 'Under real concurrent traffic, log lines from many different requests interleave in the same output stream — without a shared per-request identifier, there is no way to isolate one specific request\'s complete story.',
        whyHi: 'Asli concurrent traffic ke neeche, kai alag requests ki log lines usi output stream mein mil jaati hain — ek shared per-request identifier ke bina, ek khaas request ki poori kahaani alag karne ka koi tarika nahi.',
      },
      {
        wrong: `console.log("Something happened:", data);
// no level distinction — every message looks identical regardless of severity`,
        right: `logger.warn("Rate limit approaching threshold", { ip });
logger.error("Database connection failed", { error: err.message });
// distinct severity levels, filterable independently`,
        why: 'Without severity levels, there is no way to configure production logging to show only genuine problems (warn and above) while suppressing routine debug-level noise, or vice versa during active debugging.',
        whyHi: 'Severity levels ke bina, production logging ko sirf asli samasyaayein (\`warn\` aur oopar) dikhaane ke liye configure karne ka koi tarika nahi hai jabki routine debug-level shor chupaate hue, ya iske ulta actively debug karte waqt.',
      },
    ],

    realWorld: [
      {
        en: '**Accidentally logging sensitive data (passwords, tokens, card numbers) is a real, commonly cited category of production security incident, distinct from but just as serious as storing that same data insecurely in a database** — several widely reported real-world breaches have traced back specifically to sensitive data found sitting in log files or a log-aggregation service.',
        hi: '**Galti se sensitive data (passwords, tokens, card numbers) log karna ek asli, aam taur par cite hoti production security incident ki kism hai, us hi data ko database mein asurakshit taur par store karne se alag par utni hi gambhir** — kai vyapak taur par report hue asli-duniya breaches khaas taur par log files ya ek log-aggregation service mein baithe sensitive data tak wapas jaate hain.',
      },
      {
        en: '**Winston and pino are among the most widely used structured-logging libraries in the Node.js ecosystem**, and essentially every production-grade backend framework or starter template includes one of them (or an equivalent) configured from the very start, rather than relying on plain console.log.',
        hi: '**Winston aur pino Node.js ecosystem mein sabse vyapak taur par istemal hone waali structured-logging libraries mein se hain**, aur lagbhag har production-grade backend framework ya starter template inmein se ek (ya barabar) shuruaat se hi configure kiya hua shaamil karta hai, saadhe \`console.log\` par bharosa karne ke bajaye.',
      },
      {
        en: '**Request correlation IDs (often called a "trace ID" or "correlation ID" in production observability tooling) are a standard, foundational concept across essentially all distributed-systems monitoring** — the same idea this lesson introduces at the level of a single server extends directly to tracing one request across multiple separate microservices.',
        hi: '**Request correlation IDs (production observability tooling mein aksar ek "trace ID" ya "correlation ID" kehlaate hain) lagbhag saare distributed-systems monitoring mein ek standard, buniyaadi concept hain** — bilkul wahi socch jise ye lesson ek akele server ke star par introduce karta hai seedha ek request ko kai alag microservices ke aar-paar track karne tak badhti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is logging an entire object like req.body considered a security risk, rather than simply a style preference?',
        qHi: '\`req.body\` jaisa ek poora object log karna sirf ek style pasand ke bajaye ek security khatra kyun maana jaata hai?',
        a: 'An object like req.body is a generic container whose actual contents are determined entirely by whatever a client happens to send — the code logging it has no built-in awareness of which specific fields that object holds at the moment of logging, nor any guarantee about what fields it might hold in the future as the application evolves. Logging it wholesale means the log output automatically includes every field present, without the developer making any deliberate decision about whether each specific field is safe to record — for a signup or login route, this reliably includes a plaintext password, but the same risk applies to any route whose request body might contain something sensitive (a card number, a security answer, an authentication token) now or later. Since logs are frequently collected, transmitted to a separate log-aggregation service, and retained for extended periods (often for compliance or debugging purposes), any sensitive value that ends up there persists in a location with a different, and often much larger, set of people and systems able to access it compared to the original database it might also be stored in. The fix is not a stylistic preference for tidier code — it is the same principle of deliberately choosing what data is safe to expose, applied to logging rather than to an API response or a database column.',
        aHi: '\`req.body\` jaisa ek object ek generic container hai jiski asli cheezein poori tarah is baat se tay hoti hain ki ek client kya bhejta hai — use log karta code use log karte waqt ye jaanne ki koi built-in samajh nahi rakhta ki wo object us pal kaunse khaas fields rakhta hai, na hi bhavishya mein application badalte hue wo kaunse fields rakh sakta hai iski koi guarantee. Ise bulk mein log karna matlab hai log output apne aap har maujood field shaamil karta hai, developer ke koi jaan-boojhkar faisla liye bina ki kya har khaas field record karne ke liye surakshit hai — ek signup ya login route ke liye, ye bharosemand taur par ek plaintext password shaamil karta hai, par wahi khatra kisi bhi route par lagu hota hai jiski request body mein abhi ya baad mein kuch sensitive ho sakta hai (ek card number, ek security answer, ek authentication token). Kyunki logs aksar ikattha kiye jaate hain, ek alag log-aggregation service ko bheje jaate hain, aur lambe samay ke liye rakhe jaate hain (aksar compliance ya debugging maqsad ke liye), koi bhi sensitive value jo wahan pahunchti hai ek aisi jagah rehti hai jahan alag, aur aksar kaafi zyaada, logon aur systems ka set use access kar sakta hai us asli database ke muqable jismein wo bhi store ho sakti hai. Fix koi zyaada saaf-suthre code ke liye style ki pasand nahi hai — ye wahi principle hai jaan-boojhkar chunne ka ki kaunsa data expose karna surakshit hai, logging par lagu kiya gaya, ek API response ya database column ke bajaye.',
      },
      {
        q: 'Why does console.log become practically unusable for debugging once a server is handling many concurrent requests, even though each individual console.log call still works correctly?',
        qHi: '\`console.log\` ek server kai concurrent requests sambhaalte hi practically debugging ke liye kyun istemal-ke-laayak nahi rehta, chahe har akela \`console.log\` call abhi bhi sahi tarike se kaam karta ho?',
        a: 'Each individual console.log call does exactly what it is asked to do — it correctly prints the given message to the standard output stream, in order, without any error. The problem is not that any single call malfunctions, but that Node.js can be handling many requests concurrently (since I/O operations like database queries do not block the event loop, as covered in this course\'s earlier event-loop lesson), meaning log statements from many different, unrelated requests can genuinely interleave with each other in the single shared output stream, in whatever order their respective asynchronous operations happen to complete. A console.log call carries no built-in information about WHICH specific incoming request it is associated with — it is just a bare line of text — so when many such lines from different requests appear mixed together, there is no way to look at any individual line and determine which request it belongs to, nor any way to isolate every line belonging to one specific request a user has reported a problem with. This is precisely the gap a per-request correlation ID closes: by attaching the same unique identifier to every log line produced while handling one specific request, and including that identifier explicitly in every log call, an engineer reviewing the logs later can filter for that one ID and see exactly that request\'s complete, correctly ordered story, entirely independent of how many other requests\' lines happen to be interleaved with it in the raw output.',
        aHi: 'Har akela \`console.log\` call bilkul wahi karta hai jo usse kaha gaya hai — ye sahi tarike se diya gaya message standard output stream mein print karta hai, tarteeb se, bina kisi error ke. Samasya ye nahi hai ki koi akeli call kharaab kaam karti hai, balki ye hai ki Node.js kai requests ko ek saath sambhaal sakta hai (kyunki database queries jaise I/O operations event loop ko block nahi karte, jaisa is course ke pehle wale event-loop lesson mein cover hua), matlab kai alag, na-judi requests ki log statements sach mein ek-doosre se mil sakti hain akele shared output stream mein, jis bhi tarteeb mein unke respective asynchronous operations poore hote hain. Ek \`console.log\` call koi built-in jaankaari nahi rakhta ki ye KIS khaas aati request se juda hai — ye bas text ki ek nangi line hai — isliye jab alag requests se aisi kai lines ek saath mili dikhti hain, kisi bhi akeli line ko dekhkar ye tay karne ka koi tarika nahi hai ki ye kis request se hai, na hi kisi ek khaas request se judi har line alag karne ka koi tarika jiski koi user ne samasya batayi hai. Bilkul yahi kami hai jise ek per-request correlation ID band karta hai: ek khaas request ko sambhaalte waqt banti har log line mein wahi unique identifier jodkar, aur us identifier ko har log call mein explicitly shaamil karke, ek engineer jo baad mein logs review karta hai us ek ID ke liye filter kar sakta hai aur bilkul us request ki poori, sahi tarteeb wali kahaani dekh sakta hai, us waqt kitni bhi doosri requests ki lines usme mili hui thi us se poori tarah mustaqil.',
      },
      {
        q: 'What is the practical benefit of a structured logger\'s JSON-formatted output over console.log\'s plain text, beyond simply looking different?',
        qHi: 'Ek structured logger ke JSON-formatted output ka \`console.log\` ke saadhe text se aage kya practical faayda hai, sirf alag dikhne se aage?',
        a: 'Plain text output from console.log has no guaranteed, consistent internal structure — each call can format its message however the developer happened to write it, meaning a tool trying to process that output later has no reliable way to extract specific pieces of information (a timestamp, a severity level, a specific field like a request ID) from arbitrary free-form text without fragile, custom text-parsing logic that breaks the moment the message format changes even slightly. A structured logger\'s JSON output, by contrast, represents every log entry as a well-defined object with consistent, named fields (level, message, timestamp, and whatever additional context was explicitly passed in, such as requestId) — and JSON is a format essentially every log-aggregation and monitoring tool already knows how to parse natively, without any custom logic. This means an engineer using such a tool can perform genuine structured queries against the logs — "show me every entry where level equals error and requestId equals this specific value," for instance — treating the logs as searchable, filterable data rather than an undifferentiated wall of text that can only be scanned visually. This distinction becomes decisive at real production scale, where the volume of log output makes manual visual scanning entirely impractical, and only structured, queryable data actually remains usable.',
        aHi: '\`console.log\` se plain text output mein koi guaranteed, sangat internal sanrachna nahi hai — har call apna message jaise bhi developer ne likha ho format kar sakti hai, matlab ek tool jo baad mein us output ko process karne ki koshish karta hai us se khaas jaankaari ke tukde (ek timestamp, ek severity level, ek khaas field jaise ek request ID) manmaane free-form text se nikaalne ka koi bharosemand tarika nahi rakhta bina nazuk, custom text-parsing logic ke jo message format thoda sa badalte hi toot jaati hai. Ek structured logger ka JSON output, iske ulta, har log entry ko ek achhi tarah paribhaashit object ki tarah represent karta hai sangat, naam-liye fields ke saath (\`level\`, \`message\`, \`timestamp\`, aur jo bhi additional context explicitly diya gaya, jaise \`requestId\`) — aur JSON ek format hai jise lagbhag har log-aggregation aur monitoring tool pehle se hi apne aap parse karna jaanta hai, bina kisi custom logic ke. Iska matlab hai ek aisa tool istemal karta engineer logs ke khilaaf asli structured queries kar sakta hai — "mujhe har entry dikhaao jahan \`level\` \`error\` ke barabar hai aur \`requestId\` is khaas value ke barabar hai," misal ke taur par — logs ko search-hone-laayak, filter-hone-laayak data ki tarah treat karte hue ek na-alagi-kiyi text ki deewaar ke bajaye jise sirf visually scan kiya jaa sakta hai. Ye farak asli production scale par nirnaayak ban jaata hai, jahan log output ki volume manual visual scanning ko poori tarah gair-vyavhaarik banaati hai, aur sirf structured, query-hone-laayak data asal mein istemal-ke-laayak rehta hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken signup route logging req.body with console.log. Sign up with a real password and confirm the exact plaintext password appears in the console output.',
        taskHi: '\`console.log\` se \`req.body\` log karta toota signup route banao. Ek asli password se signup karo aur confirm karo bilkul wahi plaintext password console output mein dikhta hai.',
        hint: 'Run the server and watch the terminal output directly while making the signup request, rather than checking any file, to see this immediately.',
        hintHi: 'Server chalaao aur signup request karte waqt seedha terminal output dekho, koi file check karne ke bajaye, ise turant dekhne ke liye.',
      },
      {
        task: 'Fix it by installing winston, creating a small logger module, and replacing console.log with explicit-field logger.info/logger.error calls. Confirm the password never appears in the logged output.',
        taskHi: 'winston install karke, ek chhota logger module banaakar, aur \`console.log\` ko explicit-field \`logger.info\`/\`logger.error\` calls se badalkar theek karo. Confirm karo password logged output mein kabhi nahi dikhta.',
        hint: 'Try adding an unrelated new field to the signup form\'s body (like a "referralCode") and confirm it does NOT automatically appear in the logs unless you explicitly add it to the logger call.',
        hintHi: 'Signup form ki body mein ek na-judi naya field jodne ki koshish karo (jaise ek "referralCode") aur confirm karo ye APNE AAP logs mein nahi dikhta jab tak tum ise explicitly logger call mein na jodo.',
      },
      {
        task: 'Add the requestId correlation middleware. Fire several concurrent requests to a slow route (one with an artificial delay) and confirm, in the interleaved log output, that every line belonging to one specific request shares the same requestId.',
        taskHi: '\`requestId\` correlation middleware jodo. Ek dheeme route ko (ek artificial delay wale) kai concurrent requests bhejo aur confirm karo, mile-jule log output mein, ki ek khaas request se judi har line wahi \`requestId\` share karti hai.',
        hint: 'Sending several requests at once via Promise.all in a small script, each targeting a route with a setTimeout-based artificial delay, reliably produces interleaved log output to inspect.',
        hintHi: 'Ek chhote script mein \`Promise.all\` se ek saath kai requests bhejna, har ek ek \`setTimeout\`-based artificial delay wale route ko nishaana banaate hue, bharosemand taur par jaanchne ke liye mile-jula log output banaata hai.',
      },
    ],

    keyTakeaways: [
      'Logging an entire object like req.body wholesale captures whatever it contains today and in the future — a plaintext password, or any sensitive field added later, silently starts appearing in logs with no code changes required.',
      'The fix is deliberate, explicit field selection: log calls should only ever include specifically chosen, verified-safe data, never a reflexive dump of an entire request or database row.',
      'A structured logger provides severity levels (debug, info, warn, error), letting production configuration show only genuine problems while development can show everything.',
      'JSON-formatted structured output can be automatically parsed, indexed, and queried by log-aggregation tools — plain console.log text can only realistically be scanned visually.',
      'Under real concurrent traffic, log lines from many different requests interleave in the same output stream — a per-request correlation ID (generated once via crypto.randomUUID() and attached to every log line for that request) makes one specific request\'s full story isolatable and searchable.',
      'This is the same underlying principle as this module\'s earlier lessons on trusting client input carefully: logging requires the same deliberate, explicit choice of what to expose that SQL parameterization and validation require elsewhere.',
    ],
    keyTakeawaysHi: [
      '\`req.body\` jaisa ek poora object bulk mein log karna jo bhi wo aaj rakhta hai use capture karta hai aur bhavishya mein bhi — ek plaintext password, ya baad mein jodi koi bhi sensitive field, chupke se logs mein dikhna shuru kar deti hai bina koi code badle.',
      'Fix jaan-boojhkar, explicit field selection hai: log calls mein sirf khaas taur par chuna, verify-kiya-surakshit data hona chahiye, kabhi ek poori request ya database row ka reflexive dump nahi.',
      'Ek structured logger severity levels deta hai (\`debug\`, \`info\`, \`warn\`, \`error\`), production configuration ko sirf asli samasyaayein dikhaane dete hue jabki development sab kuch dikha sakta hai.',
      'JSON-formatted structured output ko log-aggregation tools apne aap parse, index, aur query kar sakte hain — saadha \`console.log\` text asal mein sirf visually scan kiya jaa sakta hai.',
      'Asli concurrent traffic ke neeche, kai alag requests ki log lines usi output stream mein mil jaati hain — ek per-request correlation ID (ek baar \`crypto.randomUUID()\` se banaayi aur us request ki har log line se judi) ek khaas request ki poori kahaani alag-hone-laayak aur search-hone-laayak banaata hai.',
      'Ye is module ke pehle wale lessons ka wahi underlying principle hai jo client input par dhyaan se bharosa karne ke baare mein hai: logging ko wahi jaan-boojhkar, explicit choice chahiye ki kya expose karna hai jo SQL parameterization aur validation kahin aur maangte hain.',
    ],
  },
];
