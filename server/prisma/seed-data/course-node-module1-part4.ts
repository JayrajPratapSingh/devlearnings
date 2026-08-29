/**
 * Node.js Complete Course — Module 1: Fundamentals, lesson 4 (final lesson of
 * Module 1).
 *
 * process.env, environment variables, and configuration. Two related real
 * problems in one lesson: (1) a hardcoded PORT that works locally but fails
 * the instant a hosting platform assigns its own dynamic port via
 * process.env.PORT, and (2) a hardcoded secret (a database URL/API key)
 * committed directly to source code — a genuinely common, genuinely serious
 * real-world security mistake, fixed with dotenv + a gitignored .env file
 * and a committed .env.example.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes.
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_1_PART4: CourseLesson[] = [
  {
    slug: 'process-env-configuration',
    title: 'process.env, Environment Variables, and Configuration',
    titleHi: 'process.env, Environment Variables, Aur Configuration',
    description: 'A server that works flawlessly on a laptop — and gets marked "unhealthy" and killed by the hosting platform ninety seconds after every single deploy.',
    descriptionHi: 'Ek server jo laptop par bina kisi khaami ke chalta hai — aur hosting platform har akele deploy ke nabbe seconds baad use "unhealthy" maarkakar khatam kar deta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A house with its street address carved permanently into its foundation, versus one with the address on a removable mailbox sign.** Hardcoding configuration values — a port number, a database password — directly into source code is like carving your house\'s street address into its concrete foundation before it is even built: it works fine as long as the house only ever sits at that one specific address, but the instant the house needs to be moved to a different lot (a different server, a different hosting platform, someone else\'s laptop), the address is permanently wrong and cannot be corrected without literally breaking concrete. A removable mailbox sign, filled in separately for wherever the house actually ends up, solves this correctly — the house itself (your application code) stays identical regardless of where it is placed, and only the sign (environment variables, supplied fresh by whatever environment the app currently runs in) needs to change. Secrets carved into the foundation carry a second, worse problem beyond portability: anyone who ever sees the foundation — a delivery driver, a neighbor, anyone with a copy of the blueprints (your Git history) — permanently knows information that should have stayed on a sign only the current resident controls.',
      hi: '**Ek ghar jiska street address uski foundation mein hamesha ke liye khud diya hua hai, versus ek jiska address ek hataaya ja sakne wale mailbox sign par hai.** Configuration values — ek port number, ek database password — ko seedha source code mein hardcode karna aisa hai jaise apne ghar ka street address uski concrete foundation mein khud dena us se pehle ki wo bana bhi ho: ye theek kaam karta hai jab tak ghar sirf usi ek khaas address par baitha hai, par jaise hi ghar ko ek alag plot mein move karna ho (ek alag server, ek alag hosting platform, kisi aur ka laptop), address hamesha ke liye galat hai aur bina literally concrete tode theek nahi ho sakta. Ek hataaya ja sakne wala mailbox sign, alag se bhara hua jahan bhi ghar asal mein pahunchta hai, ise sahi tarike se hal karta hai — ghar khud (aapka application code) identical rehta hai chahe use kahin bhi rakha jaaye, aur sirf sign (environment variables, jo bhi environment mein app abhi chal raha hai wo taaza deta hai) ko badalna chahiye. Foundation mein khud die secrets portability se aage ek doosri, badi samasya laate hain: koi bhi jo kabhi foundation dekhta hai — ek delivery driver, ek padosi, blueprints ki copy rakhta koi bhi (aapka Git history) — hamesha ke liye aisi jaankaari jaanta hai jo sirf abhi ke resident ke control mein ek sign par rehni chahiye thi.',
    },

    simple: `**Start broken.** A server with its port number hardcoded directly into the code:

\`\`\`js
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello"));

app.listen(3000, () => console.log("Server running on port 3000"));
\`\`\`

This works perfectly on a laptop — visiting \`http://localhost:3000\` shows "Hello", every single time. Deploy this exact code to a real hosting platform (Render, Railway, Heroku, and similar all work this way), and the deployment is marked as FAILED or "unhealthy" within about a minute, even though the server process is genuinely running with no crash, no error, nothing wrong in the logs at all. Nearly every hosting platform assigns each deployed application its own port DYNAMICALLY — a different, often random number chosen by the platform itself, communicated to the running application through an environment variable, conventionally \`PORT\` — and expects the application to listen on THAT port, not on a number the application decided for itself. The server above never checks for this — it always listens on the literal number \`3000\`, ignoring whatever port the platform actually wanted it to use — so the platform\'s own health check, which tries to reach the app on the port IT assigned, finds nothing there at all and concludes the deployment failed, even though a server actually is running, just on the wrong port entirely.

**The fix: read the port from \`process.env.PORT\`, with a local fallback**

\`\`\`js
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
\`\`\`

\`\`\`ts
import express from "express";
const app = express();

app.get("/", (req, res) => res.send("Hello"));

const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
\`\`\`

\`process.env\` is a plain JavaScript object Node automatically populates with every environment variable set in whatever environment the process is currently running in — on a laptop, that is typically whatever the developer has configured (often nothing relevant, hence why \`process.env.PORT\` is usually \`undefined\` locally); on a hosting platform, the platform itself sets \`PORT\` to whatever number it actually wants the app to listen on before starting the process. \`process.env.PORT || 3000\` reads that platform-assigned value when it exists, and falls back to the literal \`3000\` only when it does not (which is exactly the local-development case, where no platform is setting it) — the exact same source code now correctly listens on whatever port each specific environment actually requires, without needing to know in advance which environment it will run in. \`process.env\` values are always strings, which is why the TypeScript version wraps it in \`Number(...)\` — \`process.env.PORT\`, even when set to \`"8080"\`, is the string \`"8080"\`, not the number \`8080\`, and \`app.listen\` genuinely needs a number.

**This same principle — read from \`process.env\`, never hardcode — applies with far higher stakes to secrets, covered next in this lesson.**`,

    simpleHi: `**Toote hue se shuru.** Ek server jiska port number seedha code mein hardcode hua hai:

\`\`\`js
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello"));

app.listen(3000, () => console.log("Server running on port 3000"));
\`\`\`

Ye laptop par bilkul theek kaam karta hai — \`http://localhost:3000\` visit karna "Hello" dikhaata hai, har akeli baar. Bilkul yahi code ek asli hosting platform par deploy karo (Render, Railway, Heroku, aur waise hi sab isi tarah kaam karte hain), aur deployment lagbhag ek minute ke andar FAILED ya "unhealthy" maark ho jaata hai, chahe server process sach mein bina kisi crash, bina kisi error, logs mein bilkul kuch galat na hote hue chal raha ho. Lagbhag har hosting platform har deploy hui application ko apna khud ka port DYNAMICALLY deta hai — ek alag, aksar random number khud platform dwara chuna gaya, chalti application ko ek environment variable ke through bataya jaata hai, roaayti roop se \`PORT\` — aur ummeed karta hai ki application WAHI port par sune, ek aisa number nahi jo application ne khud tay kiya. Upar wala server ye kabhi check hi nahi karta — ye hamesha literal number \`3000\` par sunta hai, wo bhi ignore karte hue platform asal mein use kaunsa port use karne ko chahta tha — isliye platform ka apna health check, jo app tak use diye gaye port par pahunchne ki koshish karta hai, wahan bilkul kuch nahi paata aur nateeja nikaalta hai deployment fail hui, chahe ek server asal mein chal raha ho, bas bilkul galat port par.

**Fix: port ko \`process.env.PORT\` se padho, ek local fallback ke saath**

\`\`\`js
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
\`\`\`

\`\`\`ts
import express from "express";
const app = express();

app.get("/", (req, res) => res.send("Hello"));

const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
\`\`\`

\`process.env\` ek saadha JavaScript object hai jise Node apne aap us environment mein set hui har environment variable se bharta hai jismein process abhi chal raha hai — laptop par, ye aam taur par jo bhi developer ne configure kiya hai wo hota hai (aksar kuch matlabi nahi, isi liye \`process.env.PORT\` aam taur par locally \`undefined\` hota hai); ek hosting platform par, platform khud \`PORT\` ko us number par set karta hai jo wo asal mein chahta hai app sune process shuru karne se pehle. \`process.env.PORT || 3000\` platform-diye value ko padhta hai jab wo maujood hai, aur sirf tab literal \`3000\` par gir jaata hai jab nahi (jo bilkul local-development wala case hai, jahan koi platform ise set hi nahi kar raha) — bilkul wahi source code ab sahi tarike se jo bhi port har khaas environment ko asal mein chahiye uspar sunta hai, bina pehle se jaane ki wo kaunse environment mein chalega. \`process.env\` values hamesha strings hoti hain, aur bilkul isi wajah se TypeScript version ise \`Number(...)\` mein lapetta hai — \`process.env.PORT\`, chahe \`"8080"\` par set ho, string \`"8080"\` hai, number \`8080\` nahi, aur \`app.listen\` ko sach mein ek number chahiye.

**Wahi asool — \`process.env\` se padho, kabhi hardcode mat karo — bahut zyada daav ke saath secrets par lagu hota hai, is lesson mein aage cover hoga.**`,

    content: `## What \`process.env\` actually is, and where its values come from

\`\`\`js
console.log(process.env.PORT);         // whatever the current environment set PORT to, or undefined
console.log(process.env.NODE_ENV);      // commonly "development", "production", or "test"
console.log(process.env.HOME);          // the current user's home directory path (on most systems)
\`\`\`

\`process\` is a global object Node automatically provides in every running Node.js program — no \`require\` or \`import\` needed — representing the current running process itself, and \`process.env\` is one specific property on it: a plain object whose keys and values are exactly the environment variables set in whatever shell, container, or hosting platform actually started this specific process. These values come from OUTSIDE the JavaScript code entirely — set by the operating system, a \`Dockerfile\`, a hosting platform\'s dashboard, or a shell command run before starting Node — meaning the exact same \`process.env\` line of code can genuinely produce different results depending purely on where and how the process was started, which is precisely the property this lesson\'s port example relies on.

## Local development: \`.env\` files and the \`dotenv\` package

\`\`\`
# .env (a plain text file, in the project root)
DATABASE_URL=postgres://localhost:5432/myapp_dev
JWT_SECRET=a-random-string-used-only-on-this-laptop
PORT=4000
\`\`\`

\`\`\`js
// At the very top of the app's entry file, before anything else runs:
require("dotenv").config();

console.log(process.env.DATABASE_URL);   // now populated, read from .env
\`\`\`

A real hosting platform sets environment variables through its own dashboard or configuration system, but a developer\'s own laptop has no equivalent built-in mechanism for a single project to declare "these specific variables, with these specific local values" — the \`dotenv\` package fills that gap: it reads a plain-text \`.env\` file (simple \`KEY=value\` lines) from the project root and copies each entry into \`process.env\`, making local development behave as if those variables had been set by the operating system itself. Calling \`require("dotenv").config()\` (or, in an ES Module project, \`import "dotenv/config"\`) as the very first thing the application does ensures every subsequent \`process.env\` read throughout the rest of the code sees these values already populated.

## Why \`.env\` must be gitignored, and secrets must never be hardcoded

\`\`\`js
// NEVER do this — a real secret, permanently committed to source code:
const client = new DatabaseClient("postgres://admin:Sup3rSecret!@prod-db.example.com/app");

// Instead:
const client = new DatabaseClient(process.env.DATABASE_URL);
\`\`\`

\`\`\`
# .gitignore
node_modules/
.env
\`\`\`

A hardcoded secret — a real database password, a real API key, a real JWT signing secret — written directly into a source file is permanently exposed to anyone with read access to that file: every teammate, anyone who forks or clones a public repository, and critically, anyone who can view the project\'s Git HISTORY, even long after the line is later "removed" in a newer commit (the old commit, and the secret inside it, still exists in the repository\'s history unless that history is specifically and deliberately rewritten, which is itself a difficult, disruptive operation). \`.env\` is specifically added to \`.gitignore\` so that the file HOLDING real local secret values never gets committed to version control at all — only the application code that reads from \`process.env\` (never containing the actual secret values themselves) gets committed. A real, deployed application then receives its own production secrets directly through the hosting platform\'s own environment-variable configuration (a dashboard, a deployment configuration file that is itself not committed with real values), never through a committed \`.env\` file, exactly the same "supplied by whatever environment is currently running this" principle the port example demonstrated, now applied to values whose exposure would be a genuine security incident rather than a deployment health-check failure.

## \`.env.example\`: documenting which variables are needed, without exposing real values

\`\`\`
# .env.example (committed to Git)
DATABASE_URL=postgres://user:password@localhost:5432/dbname
JWT_SECRET=replace-with-a-long-random-string
PORT=4000
\`\`\`

Since the real \`.env\` file is deliberately never committed, a new teammate cloning the project has no way to know which environment variables the application actually expects to find, or roughly what shape their values should take, without reading through the entire codebase hunting for \`process.env.SOMETHING\` references. \`.env.example\` (or \`.env.sample\`) solves this: a version of the same file, WITH placeholder or dummy values instead of real secrets, committed to Git specifically so a new developer can copy it to \`.env\` and fill in their own real local values — this is a widely-adopted convention across real Node.js projects precisely because it documents the application\'s configuration surface without ever risking a real secret being committed by mistake.

## TypeScript: \`process.env\` is loosely typed by default, and why that matters

\`\`\`ts
// Without extra setup, TypeScript types every process.env property as
// "string | undefined" — it cannot know at compile time which variables
// will genuinely be set at runtime
const dbUrl: string | undefined = process.env.DATABASE_URL;

// A common pattern: fail fast at startup if a required variable is missing,
// narrowing the type for the rest of the file
if (!process.env.DATABASE_URL) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}
const dbUrl2: string = process.env.DATABASE_URL;   // now correctly narrowed to "string"
\`\`\`

TypeScript types \`process.env\`\'s properties as \`string | undefined\` for every key, since it has no way to verify at compile time which environment variables will actually be present when the code eventually runs — this is the same nullable-DOM-API pattern covered for \`document.getElementById\` in the React course\'s Portals lesson, applied here to environment configuration instead. A common, recommended pattern in real Node.js/TypeScript projects is validating all required environment variables once, at application startup — throwing an explicit, immediate error if something required is missing, rather than letting a missing \`DATABASE_URL\` silently produce \`undefined\` and fail confusingly much later, deep inside a database connection attempt — which, as a side benefit, narrows the type for the rest of the file exactly as the \`if (!process.env.DATABASE_URL)\` check above demonstrates.

## Validating the entire configuration at once with Zod

\`\`\`js
const { z } = require("zod");

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const env = envSchema.parse(process.env);
// env.PORT is genuinely typed "number" here, not "string | undefined" —
// no manual Number(...) conversion, no separate if-check needed
\`\`\`

The \`if (!process.env.DATABASE_URL) throw\` pattern above works, but scales poorly the moment a real application has a dozen or more required variables — each one needs its own repeated check, scattered across whichever file happens to read it first, and forgetting to add a check for a newly-introduced variable silently reintroduces exactly the problem these checks exist to prevent. This course\'s earlier request-validation lesson already used Zod to validate an HTTP request body against a schema in one place; the exact same tool applies identically to \`process.env\` itself: one schema names every required variable and its expected shape — a string that must look like a URL, a secret with a minimum length, a number with a sensible default — and calling \`.parse(process.env)\` once, at startup, either returns a single, fully-typed configuration object or throws one clear, itemized error listing every problem at once, rather than each missing variable being discovered separately, one at a time, as different parts of the application happen to run.`,

    contentHi: `## \`process.env\` asal mein kya hai, aur uski values kahan se aati hain

\`\`\`js
console.log(process.env.PORT);         // abhi ke environment ne PORT ko jo bhi set kiya, ya undefined
console.log(process.env.NODE_ENV);      // aam taur par "development", "production", ya "test"
console.log(process.env.HOME);          // abhi ke user ka home directory path (zyadatar systems par)
\`\`\`

\`process\` ek global object hai jise Node har chalte Node.js program mein apne aap deta hai — koi \`require\` ya \`import\` chahiye nahi — abhi ki chalti process ko khud darzha karte hue, aur \`process.env\` uska ek khaas property hai: ek saadha object jiski keys aur values bilkul wo environment variables hain jo us shell, container, ya hosting platform mein set hain jisne asal mein is khaas process ko shuru kiya. Ye values JavaScript code se poori tarah BAHAR se aati hain — operating system, ek \`Dockerfile\`, ek hosting platform ke dashboard, ya Node shuru hone se pehle chali ek shell command dwara set hui — matlab bilkul wahi \`process.env\` code ki line sach mein alag nateeje de sakti hai poori tarah is baat par nirbhar hote hue ki process kahan aur kaise shuru hua, aur bilkul yahi property hai jispar is lesson ka port example nirbhar karta hai.

## Local development: \`.env\` files aur \`dotenv\` package

\`\`\`
# .env (ek saadhi text file, project root mein)
DATABASE_URL=postgres://localhost:5432/myapp_dev
JWT_SECRET=a-random-string-used-only-on-this-laptop
PORT=4000
\`\`\`

\`\`\`js
// App ki entry file ke bilkul upar, kuch aur chalne se pehle:
require("dotenv").config();

console.log(process.env.DATABASE_URL);   // ab bharaa hua hai, .env se padha
\`\`\`

Ek asli hosting platform apne khud ke dashboard ya configuration system se environment variables set karta hai, par ek developer ke apne laptop ke paas ek project ko "ye khaas variables, in khaas local values ke saath" declare karne ke liye koi barabar built-in mechanism nahi hai — \`dotenv\` package us kami ko bharta hai: ye ek saadhi-text \`.env\` file (saadhi \`KEY=value\` lines) project root se padhta hai aur har entry ko \`process.env\` mein copy karta hai, local development ko aisa behave karaate hue jaise un variables ko operating system ne khud set kiya ho. \`require("dotenv").config()\` (ya, ek ES Module project mein, \`import "dotenv/config"\`) ko application ka bilkul pehla kaam banaakar bulaana pakka karta hai ki baaki code ke aar-paar har agli \`process.env\` padhaai ye values pehle se bhari hui dekhe.

## \`.env\` gitignored kyun hona chahiye, aur secrets kabhi hardcode kyun nahi hone chahiye

\`\`\`js
// KABHI ye mat karo — ek asli secret, hamesha ke liye source code mein commit hua:
const client = new DatabaseClient("postgres://admin:Sup3rSecret!@prod-db.example.com/app");

// Iske bajaye:
const client = new DatabaseClient(process.env.DATABASE_URL);
\`\`\`

\`\`\`
# .gitignore
node_modules/
.env
\`\`\`

Ek hardcoded secret — ek asli database password, ek asli API key, ek asli JWT signing secret — seedha ek source file mein likha hua us file ka read access rakhte kisi ke liye bhi hamesha ke liye ujaagar hai: har teammate, koi bhi jo ek public repository fork ya clone kare, aur sabse zaruri, koi bhi jo project ki Git HISTORY dekh sake, us line ke baad wali commit mein baad mein "hataaye" jaane ke bahut baad bhi (purani commit, aur uske andar ka secret, abhi bhi repository ki history mein maujood hai jab tak us history ko khaas taur par aur jaan-boojhkar dobara na likha jaaye, jo khud ek mushkil, badhaan wala operation hai). \`.env\` ko \`.gitignore\` mein khaas taur par isliye joda jaata hai ki wo file jismein asli local secret values HAIN kabhi bhi version control mein commit ho hi na — sirf application code jo \`process.env\` se padhta hai (kabhi khud asli secret values shaamil na karte hue) commit hota hai. Ek asli, deploy hui application phir apne khud ke production secrets seedha hosting platform ke apne environment-variable configuration se paati hai (ek dashboard, ek deployment configuration file jo khud asli values ke saath commit nahi hui), kabhi ek commit hui \`.env\` file se nahi, bilkul wahi "jo bhi environment ise abhi chala raha hai wo deta hai" principle jo port example ne dikhaya, ab un values par lagu jinka ujaagar hona ek deployment health-check failure ke bajaye ek asli security incident hoga.

## \`.env.example\`: kaunsi variables chahiye batana, asli values ujaagar kiye bina

\`\`\`
# .env.example (Git mein commit hui)
DATABASE_URL=postgres://user:password@localhost:5432/dbname
JWT_SECRET=replace-with-a-long-random-string
PORT=4000
\`\`\`

Chunki asli \`.env\` file jaan-boojhkar kabhi commit nahi hoti, project clone karta ek naya teammate ye jaanne ka koi tarika nahi rakhta ki application ko asal mein kaunse environment variables chahiye, ya unki values ki takribi shape kya honi chahiye, poore codebase ko \`process.env.SOMETHING\` references ke liye khoje bina. \`.env.example\` (ya \`.env.sample\`) ise hal karta hai: usi file ka ek version, asli secrets ke bajaye placeholder ya dummy values ke SAATH, khaas taur par Git mein commit hua taaki ek naya developer ise \`.env\` mein copy kar sake aur apni asli local values bhar sake — ye asli Node.js projects mein badi taur par apnaaya convention hai bilkul isliye kyunki ye application ki configuration surface ko document karta hai bina kabhi galti se koi asli secret commit hone ka khatra uthaaye.

## TypeScript: \`process.env\` default roop se dheele tarike se typed hai, aur ye kyun matter karta hai

\`\`\`ts
// Extra setup ke bina, TypeScript har process.env property ko
// "string | undefined" ki tarah type karta hai — ye compile time par jaan nahi sakta
// ki runtime par asal mein kaunse variables set honge
const dbUrl: string | undefined = process.env.DATABASE_URL;

// Ek aam pattern: startup par turant fail hona agar zaruri variable missing hai,
// baaki file ke liye type ko sankra karte hue
if (!process.env.DATABASE_URL) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}
const dbUrl2: string = process.env.DATABASE_URL;   // ab sahi tarike se "string" mein sankra
\`\`\`

TypeScript \`process.env\` ki har key ki properties ko \`string | undefined\` ki tarah type karta hai, kyunki uske paas compile time par verify karne ka koi tarika nahi ki jab code aakhirkaar chalega tab kaunse environment variables asal mein maujood honge — ye wahi nullable-DOM-API pattern hai jo React course ke Portals lesson mein \`document.getElementById\` ke liye cover hua, yahan iske bajaye environment configuration par lagu. Asli Node.js/TypeScript projects mein ek aam, sujhaaya pattern har zaruri environment variable ko ek baar, application startup par validate karna hai — agar kuch zaruri missing hai to ek explicit, turant error throw karte hue, ek missing \`DATABASE_URL\` ko chupchap \`undefined\` paida karne aur bahut baad mein, ek database connection attempt ke andar gehri confuse karti tarah fail hone dene ke bajaye — jo, ek side faayde ki tarah, baaki file ke liye type sankra karta hai bilkul jaise upar wala \`if (!process.env.DATABASE_URL)\` check dikhaata hai.

## Poori configuration ko ek saath Zod se validate karna

\`\`\`js
const { z } = require("zod");

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const env = envSchema.parse(process.env);
// env.PORT yahan sach mein "number" ki tarah typed hai, "string | undefined" nahi —
// koi manual Number(...) conversion nahi, koi alag if-check ki zaroorat nahi
\`\`\`

Upar wala \`if (!process.env.DATABASE_URL) throw\` pattern kaam karta hai, par jis pal ek asli application mein dazan ya zyaada zaruri variables ho jaate hain scale karna kam ho jaata hai — har ek ko apna khud ka dohraaya check chahiye, jo bhi file use pehle padhti hai wahaan bikhra hua, aur ek naye-jode-gaye variable ke liye check jodna bhool jaana chupke se bilkul wahi samasya dobara le aata hai jise ye checks rokne ke liye maujood hain. Is course ka pehle wala request-validation lesson pehle se Zod istemal kar chuka hai ek HTTP request body ko ek jagah ek schema ke khilaaf validate karne ke liye; bilkul wahi tool \`process.env\` par khud identical roop se lagu hota hai: ek schema har zaruri variable aur uski anumaanit shape naam leta hai — ek string jo ek URL jaisi dikhni chahiye, ek secret ek minimum length ke saath, ek number ek samajhdaar default ke saath — aur \`.parse(process.env)\` ko ek baar, startup par, call karna ya to ek akela, poori tarah typed configuration object lautaata hai ya ek saaf, itemized error throw karta hai jo har samasya ek saath list karta hai, har missing variable ke alag-alag, ek waqt mein, application ke alag hisse jab chalte hain tab discover hone ke bajaye.`,

    examples: [
      {
        title: 'Broken: hardcoded port fails a platform\'s health check',
        titleHi: 'Toota: hardcoded port ek platform ke health check ko fail karta hai',
        code: `app.listen(3000, () => console.log("Server running on port 3000"));
// works locally; deployed platform assigns a DIFFERENT port via process.env.PORT`,
        codeJs: `const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello"));

app.listen(3000, () => console.log("Server running on port 3000"));
// Deployed to a platform that assigns process.env.PORT=10823:
// the server listens on 3000, the platform's health check probes
// 10823, finds nothing, marks the deployment unhealthy.`,
        codeTs: `import express from "express";
const app = express();

app.get("/", (req, res) => res.send("Hello"));

app.listen(3000, () => console.log("Server running on port 3000"));
// TypeScript does not catch this — app.listen(3000) is a perfectly
// valid call. This is a deployment/configuration issue, not a type
// error.`,
        output: `Locally: "Server running on port 3000" logs correctly, and the app
works when visited. On the hosting platform: the exact same log line
appears (the server IS running), but the platform's own health check,
probing the port IT assigned via process.env.PORT, finds nothing
there and marks the deployment as failed within roughly a minute.`,
        explain: 'The server process itself never crashes and logs nothing indicating a problem — the failure is entirely external, in the mismatch between the port the code chose and the port the platform actually expects, which is why this specific class of bug is often confusing to diagnose from logs alone.',
        explainHi: 'Server process khud kabhi crash nahi hota aur koi samasya batati cheez log nahi karta — asafalta poori tarah bahar wali hai, code ne jo port chuna aur platform asal mein jo ummeed karta hai uske beech bemel mein, aur bilkul isi wajah se ye khaas bug kism aksar sirf logs se diagnose karna confuse karta hai.',
      },
      {
        title: 'Fixed: reading the port from process.env with a local fallback',
        titleHi: 'Theek: process.env se port padhna ek local fallback ke saath',
        code: `const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`,
        codeJs: `const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`,
        codeTs: `import express from "express";
const app = express();

app.get("/", (req, res) => res.send("Hello"));

const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`,
        outputJs: `Locally (no PORT set): logs "Server running on port 3000", identical
to before. Deployed to a platform setting process.env.PORT=10823: logs
"Server running on port 10823" — the exact same source code correctly
adapts to whichever port each environment actually assigns.`,
        outputTs: `// "Number(process.env.PORT)" is necessary because process.env.PORT is
// always a string (or undefined) — Number(undefined) is NaN, and "NaN
// || 3000" correctly falls back to 3000, the same way "undefined ||
// 3000" does in the JS version.`,
        explain: 'Nothing about the route or the rest of the application changed — the entire fix is reading one value from process.env instead of writing it as a literal number, letting the same code correctly serve every environment it might run in.',
        explainHi: 'Route ya baaki application ke baare mein kuch nahi badla — poora fix ek value ko \`process.env\` se padhna hai use ek literal number ki tarah likhne ke bajaye, wahi code ko har environment jismein wo chal sakta hai sahi tarike se serve karne dete hue.',
      },
      {
        title: 'Broken: a real secret hardcoded directly into source code',
        titleHi: 'Toota: source code mein seedha hardcode hua ek asli secret',
        code: `const client = new DatabaseClient(
  "postgres://admin:Sup3rSecret!@prod-db.example.com/app"
);`,
        codeJs: `// db.js — committed to Git, visible to every teammate and anyone with
// repo access, permanently, even after this line is later "removed"
const client = new DatabaseClient(
  "postgres://admin:Sup3rSecret!@prod-db.example.com/app"
);

module.exports = client;`,
        codeTs: `// db.ts — identical problem, TypeScript's types have no way to flag
// "this string literal looks like a real secret"
const client = new DatabaseClient(
  "postgres://admin:Sup3rSecret!@prod-db.example.com/app"
);

export default client;
// TypeScript compiles this without any warning — a hardcoded secret is
// a perfectly valid string literal. This is a security practice issue,
// entirely outside what a type checker can catch.`,
        output: `The database password "Sup3rSecret!" is now permanently readable by
anyone with read access to this file — every current teammate, anyone
who later gains repo access, and anyone who can view Git history, even
long after a future commit "removes" this line.`,
        explain: 'This is not a hypothetical risk — accidentally committed secrets in public and private repositories are a well-documented, common real-world source of security incidents, precisely because a "quick hardcode while testing" is easy to forget to remove before committing.',
        explainHi: 'Ye koi kalpaniya khatra nahi hai — public aur private repositories mein galti se commit hue secrets security incidents ke ek achhi tarah documented, aam asli-duniya srot hain, bilkul isliye kyunki test karte waqt ek "jaldi hardcode" commit karne se pehle hataana bhoolna aasan hai.',
      },
      {
        title: 'Fixed: reading the secret from process.env, sourced from a gitignored .env',
        titleHi: 'Theek: process.env se secret padhna, gitignored .env se aata hua',
        code: `require("dotenv").config();
const client = new DatabaseClient(process.env.DATABASE_URL);`,
        codeJs: `// db.js
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}

const client = new DatabaseClient(process.env.DATABASE_URL);

module.exports = client;

// .env (gitignored, never committed):
// DATABASE_URL=postgres://admin:Sup3rSecret!@prod-db.example.com/app

// .env.example (committed, documents what's needed without real values):
// DATABASE_URL=postgres://user:password@localhost:5432/dbname`,
        codeTs: `// db.ts
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}

const client = new DatabaseClient(process.env.DATABASE_URL);

export default client;`,
        outputJs: `The source file contains zero real secret values — it only references
process.env.DATABASE_URL. Locally, dotenv loads the real value from
the gitignored .env file. In production, the hosting platform's own
environment-variable configuration supplies it. Neither path involves
a real secret ever being committed to Git.`,
        outputTs: `// The "if (!process.env.DATABASE_URL) throw" check both fails fast
// with a clear error if the variable is genuinely missing in any
// environment, and narrows process.env.DATABASE_URL from "string |
// undefined" to "string" for the DatabaseClient call below it.`,
        explain: 'The fail-fast check means a missing DATABASE_URL now produces an immediate, clear startup error naming exactly what is missing, rather than a confusing failure deep inside whatever code first tries to use an undefined connection string.',
        explainHi: 'Fail-fast check ka matlab hai ek missing \`DATABASE_URL\` ab ek turant, saaf startup error paida karta hai bilkul batate hue kya missing hai, us gehri confuse karti asafalta ke bajaye jo us code ke andar hoti jo pehle ek undefined connection string use karne ki koshish karta.',
      },
      {
        title: 'Centralizing every required variable into one Zod schema',
        titleHi: 'Har zaruri variable ko ek Zod schema mein kendrit karna',
        code: `const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3000),
});
const env = envSchema.parse(process.env);`,
        codeJs: `const { z } = require("zod");

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const env = envSchema.parse(process.env);

const client = new DatabaseClient(env.DATABASE_URL);
app.listen(env.PORT); // env.PORT is already a number, no Number(...) needed`,
        codeTs: `import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

type Env = z.infer<typeof envSchema>;
const env: Env = envSchema.parse(process.env);

const client = new DatabaseClient(env.DATABASE_URL);
app.listen(env.PORT);`,
        outputJs: `If DATABASE_URL is missing AND JWT_SECRET is too short, one single
thrown error lists both problems together, at startup — not one
problem discovered now and the second discovered days later.`,
        outputTs: `// z.infer<typeof envSchema> gives "env" a precise type automatically
// — env.PORT is "number", env.NODE_ENV is the literal union
// "development" | "production" | "test", with zero manual annotation.`,
        explain: 'One schema replaces every scattered if-check with a single validated, fully-typed configuration object, and reports every missing or malformed variable together instead of one at a time.',
        explainHi: 'Ek schema har bikhre hue if-check ki jagah ek akela validated, poori tarah typed configuration object leta hai, aur har missing ya malformed variable ko ek saath report karta hai ek waqt mein ek ke bajaye.',
      },
    ],

    mistakes: [
      {
        wrong: `app.listen(3000);
// hardcoded — ignores whatever port a hosting platform actually assigns`,
        right: `const PORT = process.env.PORT || 3000;
app.listen(PORT);`,
        why: 'Most hosting platforms assign a dynamic port through process.env.PORT and expect the application to listen on it — a hardcoded port number causes the platform\'s own health check to fail, since it probes the port it assigned, not the number the code chose.',
        whyHi: 'Zyadatar hosting platforms \`process.env.PORT\` ke through ek dynamic port dete hain aur ummeed karte hain application uspar sune — ek hardcoded port number platform ke apne health check ko fail karaata hai, kyunki wo us port ko probe karta hai jo usne diya, code ne jo number chuna wo nahi.',
      },
      {
        wrong: `const client = new DatabaseClient("postgres://admin:realpassword@host/db");
// a real secret, committed directly to source code`,
        right: `const client = new DatabaseClient(process.env.DATABASE_URL);
// the actual secret lives only in a gitignored .env locally, and the
// hosting platform's own environment-variable configuration in production`,
        why: 'A hardcoded secret is permanently visible to anyone with read access to the source file, including everyone who can view Git history, even long after the line is later removed in a newer commit.',
        whyHi: 'Hardcoded secret us source file ka read access rakhte kisi ke liye bhi hamesha ke liye dikhta hai, Git history dekh sakne wale har kisi sameet, chahe wo line baad ki commit mein kitna hi baad hataayi jaaye.',
      },
      {
        wrong: `# .gitignore
node_modules/
# .env not listed — gets committed along with real local secret values`,
        right: `# .gitignore
node_modules/
.env`,
        why: 'A .env file genuinely holds real local secret values by design — omitting it from .gitignore means those real values get committed to version control, defeating the entire purpose of keeping secrets out of source code.',
        whyHi: '\`.env\` file design se asal mein asli local secret values rakhti hai — use \`.gitignore\` se chhod dena matlab wo asli values version control mein commit ho jaati hain, secrets ko source code se bahar rakhne ka poora maqsad hi haraate hue.',
      },
      {
        wrong: `if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL");
// ...repeated separately in a different file for JWT_SECRET, another for PORT...
// a newly added variable is easy to forget to check at all`,
        right: `const envSchema = z.object({ DATABASE_URL: z.string().url(), JWT_SECRET: z.string().min(32) });
const env = envSchema.parse(process.env); // every required variable checked in one place`,
        why: 'Scattering an individual if-check for each required variable across different files scales poorly and makes it easy to forget a check entirely for a newly added variable — one schema validates everything required in a single place.',
        whyHi: 'Har zaruri variable ke liye ek alag if-check ko alag files mein bikhraana scale karne mein kharaab hai aur ek naye jode gaye variable ke liye check poori tarah bhoolna aasaan banaata hai — ek schema sab kuch zaruri ek jagah validate karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**"Health check failed" or "application failed to bind to $PORT" is one of the most common first-deployment errors reported across nearly every Node.js hosting platform\'s support forums** — precisely because a hardcoded port works flawlessly in every local test, giving a developer no warning before the first real deployment.',
        hi: '**"Health check failed" ya "application failed to bind to $PORT" lagbhag har Node.js hosting platform ke support forums mein report hone wale sabse aam pehle-deployment errors mein se ek hai** — bilkul isliye kyunki hardcoded port har local test mein bina kisi khaami ke kaam karta hai, developer ko pehle asli deployment se pehle koi chetaavni na dete hue.',
      },
      {
        en: '**GitHub\'s own automated secret-scanning feature, and tools like git-secrets and truffleHog, exist specifically because accidentally committed API keys, database credentials, and tokens are a genuinely common, high-severity class of real security incident** — this is not a theoretical concern this lesson invented for teaching purposes.',
        hi: '**GitHub ka apna automated secret-scanning feature, aur git-secrets aur truffleHog jaise tools, khaas taur par isliye maujood hain kyunki galti se commit hui API keys, database credentials, aur tokens asli security incident ki ek sach mein aam, badi-gambhirta wali kism hain** — ye koi kalpaniya chinta nahi hai jo ye lesson padhaane ke maqsad se banayi.',
      },
      {
        en: '**The `.env`/`.env.example` pattern, and reading all configuration exclusively through `process.env`, is close to universal across real-world Node.js projects and is the foundation the "twelve-factor app" methodology (a widely referenced set of best practices for building deployable services) explicitly recommends for configuration.**',
        hi: '**\`.env\`/\`.env.example\` pattern, aur configuration ko poori tarah \`process.env\` se hi padhna, asli-duniya Node.js projects mein lagbhag sarvbhaumik hai aur wo neev hai jise "twelve-factor app" methodology (deployable services banaane ke liye badi taur par reference ki gayi best practices ka set) configuration ke liye explicitly sujhaati hai.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a Node.js server hardcoding "app.listen(3000)" run without any errors on a hosting platform, yet still get marked as a failed or unhealthy deployment?',
        qHi: '"app.listen(3000)" hardcode karta Node.js server ek hosting platform par bina kisi error ke kyun chalta hai, phir bhi ek fail ya unhealthy deployment ki tarah maark ho jaata hai?',
        a: 'The server process itself starts up completely successfully — there is no crash, no thrown error, and the application genuinely is listening for connections, just on the literal port number 3000 specifically. Most hosting platforms, however, do not let a deployed application choose its own port arbitrarily; they assign each deployment a specific port dynamically (often communicated through an environment variable conventionally named PORT) and then run their own health check by attempting to connect to the application specifically on that assigned port, to verify the deployment is actually reachable. Because the hardcoded server never reads process.env.PORT and always listens on 3000 regardless of what the platform assigned, the platform\'s health check attempts to reach a completely different port than the one the server is actually listening on, finds nothing there, and concludes the deployment is unreachable or unhealthy — even though a server process genuinely is running successfully, just on a port nobody is checking.',
        aHi: 'Server process khud poori tarah safalta se shuru hota hai — koi crash nahi, koi throw hui error nahi, aur application sach mein connections sun raha hai, bas bilkul literal port number 3000 par khaas taur par. Zyadatar hosting platforms, halaanki, ek deploy hui application ko apna khud ka port man-maane tarike se chunne nahi dete; wo har deployment ko ek khaas port dynamically dete hain (aksar ek environment variable ke through bataya jaata hai roaayti roop se \`PORT\` naam ka) aur phir apna khud ka health check chalaate hain application se khaas us diye gaye port par connect karne ki koshish karke, ye verify karne ke liye ki deployment asal mein pahunch mein hai. Chunki hardcoded server kabhi \`process.env.PORT\` padhta hi nahi aur hamesha 3000 par sunta hai chahe platform ne kuch bhi diya ho, platform ka health check ek poori tarah alag port tak pahunchne ki koshish karta hai us se jispar server asal mein sun raha hai, wahan kuch nahi paata, aur nateeja nikaalta hai deployment pahunch mein nahi ya unhealthy hai — chahe ek server process sach mein safalta se chal raha ho, bas ek aise port par jise koi check nahi kar raha.',
      },
      {
        q: 'Why must a .env file never be committed to Git, while a .env.example file with the same variable names is safe and commonly committed?',
        qHi: 'Ek \`.env\` file ko Git mein kabhi commit nahi karna chahiye, jabki wahi variable names wali \`.env.example\` file surakshit hai aur aam taur par commit hoti hai, aisa kyun?',
        a: 'A real .env file, by its entire purpose, holds actual, working secret values — a real database password, a real API key, a real signing secret — that specific real values a developer needs for their local environment to actually function correctly. Committing this file to Git would permanently expose these genuine secrets to everyone with read access to the repository, including, critically, anyone who can view the repository\'s history, even long after the file might later be deleted or modified in a subsequent commit — old commits and their full contents remain part of the repository\'s history indefinitely unless that history is specifically and deliberately rewritten. A .env.example file solves the real, legitimate problem of documenting which environment variables an application needs without carrying any of that risk, because it deliberately contains only placeholder or dummy values (like "replace-with-a-long-random-string") rather than anything that actually works as a real credential — it communicates the SHAPE of the required configuration (which variable names exist, roughly what kind of value each expects) without exposing any value that could actually be used to access anything.',
        aHi: 'Ek asli \`.env\` file, apne poore maqsad se, asli, kaam karti secret values rakhti hai — ek asli database password, ek asli API key, ek asli signing secret — wo khaas asli values jo developer ko apne local environment ko asal mein sahi tarike se chalaane ke liye chahiye. Is file ko Git mein commit karna in asli secrets ko hamesha ke liye repository ka read access rakhte har kisi ke liye ujaagar kar dega, sabse zaruri, koi bhi jo repository ki history dekh sake, chahe file baad ki kisi commit mein baad mein delete ya modify ho jaaye — purani commits aur unka poora content repository ki history ka hissa hamesha ke liye rehta hai jab tak us history ko khaas taur par aur jaan-boojhkar dobara na likha jaaye. \`.env.example\` file us asli, vaidh samasya ko hal karta hai ki ek application ko kaunse environment variables chahiye ye document karna bina us khatre ko uthaaye, kyunki isme jaan-boojhkar sirf placeholder ya dummy values hain (jaise "replace-with-a-long-random-string") asli credential ki tarah kaam karti kisi cheez ke bajaye — ye zaruri configuration ki SHAPE bataata hai (kaunse variable names maujood hain, aam taur par har ek kaisi value ki ummeed karta hai) bina koi bhi aisi value ujaagar kiye jo asal mein kuch access karne mein kaam aa sake.',
      },
      {
        q: 'Why does TypeScript type every property of process.env as "string | undefined", and what is the recommended way to handle this in real code?',
        qHi: 'TypeScript \`process.env\` ki har property ko "string | undefined" ki tarah kyun type karta hai, aur asli code mein ise sambhaalne ka sujhaaya tarika kya hai?',
        a: 'TypeScript has no way to verify, at compile time, which specific environment variables will actually be present in the environment where the compiled code eventually runs — a given process.env.SOME_VARIABLE could genuinely be set or genuinely be absent depending on how and where the process is started, information that is fundamentally a runtime concern, not something knowable while merely reading and checking the source code. Typing every property as "string | undefined" (rather than optimistically assuming "string") accurately reflects this genuine uncertainty rather than hiding it, and is the same honest-nullability approach TypeScript takes for other values whose presence cannot be statically guaranteed, like a DOM query result. The recommended handling in real code is validating required environment variables explicitly, typically once at application startup — checking whether a required value is missing and throwing a clear, immediate error naming exactly which variable is absent if so, which both fails fast with an actionable message rather than a confusing later failure, and, as a direct side effect, narrows the variable\'s type from "string | undefined" down to a definite "string" for the rest of the code that follows the check.',
        aHi: 'TypeScript ke paas compile time par verify karne ka koi tarika nahi ki jis environment mein compiled code aakhirkaar chalega wahan asal mein kaunse khaas environment variables maujood honge — ek diya \`process.env.SOME_VARIABLE\` sach mein set ho sakta hai ya sach mein gair-maujood ho sakta hai is baat par nirbhar hote hue ki process kahan aur kaise shuru hoti hai, jaankaari jo buniyaadi taur par ek runtime chinta hai, koi aisi cheez nahi jo sirf source code padhkar aur check karke jaani ja sake. Har property ko "string | undefined" ki tarah type karna (aashaawaadi roop se "string" maanne ke bajaye) is asli anishchitata ko sahi tarike se darzha karta hai chhupaane ke bajaye, aur wahi imaandaar-nullability tarika hai jo TypeScript doosri values ke liye apnaata hai jinki maujoodgi statically guarantee nahi ki ja sakti, jaise ek DOM query nateeja. Asli code mein sujhaaya sambhaalna zaruri environment variables ko explicitly validate karna hai, aam taur par ek baar application startup par — check karna ki kya ek zaruri value missing hai aur agar hai to ek saaf, turant error throw karna bilkul batate hue kaunsi variable gair-maujood hai, jo dono jaldi fail hota hai ek kaam ke message ke saath ek baad ki confuse karti asafalta ke bajaye, aur, ek seedhe side-effect ki tarah, variable ke type ko "string | undefined" se ek pakki "string" tak sankra karta hai check ke baad aane wale baaki code ke liye.',
      },
      {
        q: 'Why does reading configuration through process.env, rather than hardcoding values, allow the exact same application code to run correctly across a laptop, a CI pipeline, and a production server?',
        qHi: '\`process.env\` se configuration padhna, values hardcode karne ke bajaye, bilkul wahi application code ko ek laptop, ek CI pipeline, aur ek production server ke aar-paar sahi tarike se chalne kyun deta hai?',
        a: 'A hardcoded value is fixed permanently into the source code itself, meaning it produces the identical result regardless of where or how the code actually runs — correct only for whichever single environment that specific hardcoded value happens to match, and silently or loudly wrong everywhere else. Reading a value from process.env instead defers the actual value to whatever environment starts the process at that moment — a laptop\'s shell, a CI system\'s configured secrets, a hosting platform\'s own environment-variable dashboard — each of which can supply its own appropriate value (a different database connection string for local development versus production, a different assigned port per platform) without requiring any change to the application\'s own source code at all. This is precisely the principle underlying the "twelve-factor app" methodology\'s guidance on configuration: strictly separating configuration (which varies between environments) from code (which should remain identical across them), using environment variables specifically as the mechanism for that separation.',
        aHi: 'Ek hardcoded value seedha source code mein hamesha ke liye fix hai, matlab ye identical nateeja deta hai chahe code asal mein kahin bhi ya kaise bhi chale — sirf us ek environment ke liye sahi jispar wo khaas hardcoded value samyog se milta hai, aur baaki har jagah chupchap ya zor se galat. \`process.env\` se ek value padhna iske bajaye asli value ko us pal process shuru karne wale jo bhi environment ho use taalta hai — ek laptop ka shell, ek CI system ki configured secrets, ek hosting platform ka apna environment-variable dashboard — har ek apna sahi value de sakta hai (local development ke liye ek alag database connection string versus production, har platform ke liye ek alag diya gaya port) bina application ke apne source code mein kisi bhi badlaav ki zarurat ke. Ye bilkul wahi principle hai jo "twelve-factor app" methodology ki configuration wali guidance ke peeche hai: configuration (jo environments ke beech badalta hai) ko code (jo unke aar-paar identical rehna chahiye) se sakhti se alag rakhna, environment variables ko khaas taur par us alag-karne ke mechanism ki tarah use karte hue.',
      },
    ],

    exercises: [
      {
        task: 'Build a tiny Express server hardcoding app.listen(3000). Set an environment variable manually before starting it (e.g., PORT=5000 node index.js on most shells) and confirm the server still only listens on 3000, ignoring the environment variable entirely.',
        taskHi: 'app.listen(3000) hardcode karta ek chhota Express server banao. Use shuru karne se pehle haath se ek environment variable set karo (jaise zyadatar shells mein PORT=5000 node index.js) aur confirm karo server abhi bhi sirf 3000 par sunta hai, environment variable ko poori tarah ignore karte hue.',
        hint: 'Add a console.log(process.env.PORT) right before app.listen to see the environment variable was genuinely received by the process, even though the hardcoded listen() call never consults it.',
        hintHi: 'app.listen se bilkul pehle ek console.log(process.env.PORT) jodo dekhne ke liye environment variable sach mein process ko mila tha, chahe hardcoded listen() call use kabhi consult nahi karta.',
      },
      {
        task: 'Fix it to use process.env.PORT || 3000, and confirm the same PORT=5000 environment variable now correctly changes which port the server listens on.',
        taskHi: 'process.env.PORT || 3000 use karne ke liye theek karo, aur confirm karo wahi PORT=5000 environment variable ab sahi tarike se badalta hai server kaunse port par sunta hai.',
        hint: 'Try running the fixed server with no PORT variable set at all, and confirm it correctly falls back to 3000, matching the original local-development behavior.',
        hintHi: 'Bilkul koi PORT variable set kiye bina theek hue server ko chalaane ki koshish karo, aur confirm karo ye sahi tarike se 3000 par wapas girta hai, asli local-development behaviour se milte hue.',
      },
      {
        task: 'Set up dotenv with a .env file holding a fake DATABASE_URL, add .env to .gitignore, and create a committed .env.example with placeholder values. Confirm process.env.DATABASE_URL is correctly populated after calling dotenv.config().',
        taskHi: 'Ek fake DATABASE_URL rakhti .env file ke saath dotenv set up karo, .env ko .gitignore mein jodo, aur placeholder values wali ek committed .env.example banao. Confirm karo dotenv.config() bulaane ke baad process.env.DATABASE_URL sahi tarike se bhara hua hai.',
        hint: 'Add the fail-fast check (throwing if the variable is missing), then temporarily rename .env to confirm the check correctly catches the missing-configuration case with a clear error message.',
        hintHi: 'Fail-fast check jodo (agar variable missing hai to throw karte hue), phir thodi der ke liye .env ka naam badlo confirm karne ke liye ki check missing-configuration case ko ek saaf error message ke saath sahi tarike se pakadta hai.',
      },
    ],

    keyTakeaways: [
      'process.env is a plain object Node populates with the current environment\'s actual environment variables, set externally by the OS, a shell, a Dockerfile, or a hosting platform — the same code can read different values purely based on where it runs.',
      'Most hosting platforms assign a dynamic port via process.env.PORT and health-check the application on that specific port — a hardcoded listen(3000) causes the platform\'s health check to fail even though the server is genuinely running.',
      'dotenv reads a local .env file and copies its entries into process.env, letting local development declare project-specific variables the same way a hosting platform\'s own configuration does in production.',
      'A .env file must be gitignored, never committed, since it holds real secret values that would otherwise be permanently exposed in Git history; a committed .env.example documents required variables using placeholder values only.',
      'A hardcoded secret in source code is exposed to everyone with read access to the file and to Git history indefinitely, even after the line is later removed — secrets must always be read from process.env, sourced from a gitignored .env locally and the hosting platform\'s own configuration in production.',
      'TypeScript types every process.env property as "string | undefined", since it cannot verify at compile time which variables will be set at runtime — validating required variables explicitly at startup, throwing if one is missing, both fails fast and correctly narrows the type for the rest of the code.',
      'A single Zod schema validating all of process.env at once (the same tool used for request validation) replaces scattered individual if-checks, reporting every missing or malformed variable together and producing a fully-typed configuration object with zero manual narrowing.',
    ],
    keyTakeawaysHi: [
      '\`process.env\` ek saadha object hai jise Node abhi ke environment ke asli environment variables se bharta hai, OS, ek shell, ek Dockerfile, ya ek hosting platform dwara bahar se set hue — wahi code poori tarah is baat par nirbhar alag values padh sakta hai ki wo kahan chalta hai.',
      'Zyadatar hosting platforms \`process.env.PORT\` ke through ek dynamic port dete hain aur us khaas port par application ko health-check karte hain — ek hardcoded \`listen(3000)\` platform ke health check ko fail karaata hai chahe server sach mein chal raha ho.',
      '\`dotenv\` ek local \`.env\` file padhta hai aur uski entries ko \`process.env\` mein copy karta hai, local development ko project-khaas variables declare karne dete hue wahi tarike se jo production mein hosting platform ki apni configuration karti hai.',
      '\`.env\` file gitignored honi chahiye, kabhi commit nahi honi chahiye, kyunki wo asli secret values rakhti hai jo warna Git history mein hamesha ke liye ujaagar rehti — ek committed \`.env.example\` sirf placeholder values use karke zaruri variables document karta hai.',
      'Source code mein ek hardcoded secret file ka read access rakhte har kisi ke liye aur Git history ke liye hamesha ke liye ujaagar hai, chahe line baad mein hataayi jaaye — secrets hamesha \`process.env\` se padhne chahiye, local mein ek gitignored \`.env\` se aur production mein hosting platform ki apni configuration se aate hue.',
      'TypeScript har \`process.env\` property ko "string | undefined" ki tarah type karta hai, kyunki ye compile time par verify nahi kar sakta runtime par kaunse variables set honge — zaruri variables ko startup par explicitly validate karna, agar ek missing hai to throw karna, dono jaldi fail hota hai aur baaki code ke liye type ko sahi tarike se sankra karta hai.',
      'Ek akela Zod schema jo poori \`process.env\` ko ek saath validate karta hai (wahi tool jo request validation ke liye istemal hota hai) bikhre hue alag if-checks ki jagah leta hai, har missing ya malformed variable ko ek saath report karte hue aur bina manual narrowing ke ek poori tarah typed configuration object banaate hue.',
    ],
  },
];
