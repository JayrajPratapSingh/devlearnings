/**
 * Node.js Complete Course — Module 3: Data & Persistence, lesson 1.
 *
 * Connecting to a database: connection pooling versus a fresh connection
 * per request. The broken example creates a brand-new database client
 * connection inside every single route handler — it works perfectly in
 * casual manual testing (one request at a time), and then falls over under
 * genuine concurrent load, exhausting the database's connection limit and
 * crashing or hanging the app, precisely the kind of bug that only appears
 * once real traffic arrives, not during development.
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

export const NODE_MODULE_3: CourseLesson[] = [
  {
    slug: 'database-connection-pooling',
    title: 'Connecting to a Database: Connection Pooling',
    titleHi: 'Database Se Judna: Connection Pooling',
    description: 'A server that handles one user beautifully — and grinds to a halt the moment ten real people show up at once.',
    descriptionHi: 'Ek server jo ek user ko khoobsurati se sambhaalta hai — aur us pal ruk jaata hai jab ek saath das asli log aa jaate hain.',
    difficulty: 'HARD',
    duration: 25,
    order: 1,

    analogy: {
      en: '**Building a brand-new checkout counter from scratch for every single customer, versus a store with a fixed number of tills staffed and ready.** Opening a fresh database connection for every incoming request is like a store that, instead of keeping a handful of checkout counters permanently built and staffed, tears down and completely reconstructs a checkout counter from raw materials for every single customer who walks in — hire a cashier, install a register, wire up the card reader, ring up the sale, then demolish the whole counter the moment that one customer leaves. For exactly one customer at a time, this is slow but survivable — the store is empty otherwise, so there is no queue. The instant even a modest handful of customers arrive together, the store cannot build counters fast enough to keep up, and construction crews (the database itself, which can only support a limited number of simultaneous connections) run out of the physical space and materials needed to keep building new counters at all — the store grinds to a halt, not because any single sale was slow, but because "build a whole new counter per customer" was never a strategy that could survive more than one customer at a time. A connection pool is the sane alternative: a fixed set of tills, built once when the store opens, that customers are quickly assigned to and released from as they come and go, reused indefinitely rather than rebuilt from scratch each time.',
      hi: '**Har akele customer ke liye ek bilkul naya checkout counter shuru se banaana, versus ek store jismein tay sankhya ke tills staffed aur taiyaar hain.** Har aati request ke liye ek taaza database connection kholna aisa hai jaise ek store, mutthi bhar checkout counters ko hamesha ke liye bana aur staff karke rakhne ke bajaye, har akele customer ke liye jo andar aata hai raw materials se ek checkout counter tod-phod kar poori tarah dobara banaata hai — ek cashier hire karo, ek register lagaao, card reader wire karo, sale ring karo, phir poora counter dhaa do jaise hi wo ek customer chala jaaye. Bilkul ek waqt mein ek customer ke liye, ye dheema hai par jhelme laayak hai — store warna khaali hai, isliye koi line nahi hai. Us pal jaise hi mutthi bhar bhi customers saath aate hain, store itni tezi se counters bana hi nahi paata ki saath chal sake, aur construction crews (khud database, jo sirf ek seemit sankhya mein ek-saath connections support kar sakta hai) naye counters banaate rehne ke liye zaruri physical jagah aur materials khatam kar dete hain — store ruk jaata hai, is liye nahi ki koi akeli sale dheemi thi, balki isliye kyunki "har customer ke liye poora naya counter banaao" kabhi ek waqt mein ek se zyada customer jhel sakne wali strategy thi hi nahi. Connection pool samajhdaari wala vikalp hai: tills ka ek fixed set, ek baar bana jab store khulta hai, jise customers jaldi assign hote hain aur jaise-jaise wo aate-jaate hain use se release hote hain, hamesha ke liye reuse hota hua har baar shuru se banaaye jaane ke bajaye.',
    },

    simple: `**Start broken.** A route handler that opens a brand-new database connection for every single request:

\`\`\`js
const { Client } = require("pg");

app.get("/users", async (req, res, next) => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const result = await client.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    next(err);
  } finally {
    await client.end();
  }
});
\`\`\`

Testing this alone, one request at a time, it works perfectly — the client connects, runs the query, sends the response, and disconnects, every time. Deploy this and let real traffic arrive — ten, fifty, a hundred users genuinely browsing the site around the same moment, each triggering their own \`GET /users\` request — and the application starts throwing errors, or hangs, or the database itself starts rejecting connections outright. \`new Client()\` followed by \`.connect()\` performs a genuinely expensive sequence of work every single time it runs: opening a new TCP network connection to the database server, and completing the database\'s own authentication handshake — real, measurable work that takes real time, on the order of tens of milliseconds even under good conditions. Worse, every real database server enforces a hard MAXIMUM number of simultaneous open connections it will accept at once (a typical default might be 100) — a limit that exists because each open connection consumes real memory and resources on the database server itself, not something that can simply be raised without bound. Under real concurrent traffic, this route opens a new connection PER REQUEST, and if enough requests arrive close together, the number of simultaneously open connections can genuinely exceed the database\'s maximum, at which point the database starts refusing new connections outright — and every route in the entire application relying on the database, not just this one, begins failing simultaneously.

**The fix: create one connection pool once, at startup, and reuse it for every request**

\`\`\`js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,   // never open more than 20 simultaneous connections
});

app.get("/users", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
import { Pool, QueryResult } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
});

interface User {
  id: number;
  name: string;
  email: string;
}

app.get("/users", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result: QueryResult<User> = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`new Pool({ ... })\` is created exactly ONCE, when the application starts, entirely OUTSIDE any route handler — it does not itself open any connections immediately; instead, it manages a small set of already-established connections internally, opening them lazily as needed up to the configured \`max\` limit, and — critically — REUSING an existing, already-open connection for a new query whenever one is available, rather than opening a fresh one every time. \`pool.query(...)\`, called from inside any route handler, borrows an available connection from this managed set, runs the query, and returns the connection to the pool immediately afterward for the next request to reuse — no per-request connection setup or teardown cost, and a hard, predictable ceiling on how many actual database connections the application can ever have open at once, regardless of how many requests arrive simultaneously. The exact same route logic now scales correctly under real concurrent traffic, because the expensive part (establishing a connection) happens rarely, up front, rather than being repeated on every single request.`,

    simpleHi: `**Toote hue se shuru.** Ek route handler jo har akeli request ke liye ek bilkul naya database connection kholta hai:

\`\`\`js
const { Client } = require("pg");

app.get("/users", async (req, res, next) => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const result = await client.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    next(err);
  } finally {
    await client.end();
  }
});
\`\`\`

Ise akele test karna, ek waqt mein ek request, bilkul theek kaam karta hai — client connect hota hai, query chalaata hai, response bhejta hai, aur disconnect hota hai, har baar. Ise deploy karo aur asli traffic aane do — das, pachaas, sau users sach mein site browse kar rahe hain lagbhag usi pal, har ek apni khud ki \`GET /users\` request trigger karta hua — aur application errors throw karna shuru karta hai, ya jaam ho jaata hai, ya khud database connections poori tarah reject karna shuru kar deta hai. \`new Client()\` uske baad \`.connect()\` har akeli baar chalne par sach mein mehnge kaam ka silsila chalata hai: database server tak ek naya TCP network connection kholna, aur database ke apne authentication handshake ko poora karna — asli, naapi jaane laayak kaam jise asli waqt lagta hai, achhi conditions mein bhi das-das milliseconds ke daayre mein. Aur bura, har asli database server ek sakht ADHIKTAM sankhya lagu karta hai ek-saath khule connections ki jo wo ek saath accept karega (ek aam default 100 ho sakta hai) — ek seema jo isliye maujood hai kyunki har khula connection database server par asli memory aur resources kharch karta hai, koi aisi cheez nahi jise bina roke bas badhaaya ja sake. Asli chalti traffic ke tahat, ye route har REQUEST KE LIYE ek naya connection kholta hai, aur agar kaafi requests ek saath aati hain, ek-saath khule connections ki sankhya sach mein database ki adhiktam se aage nikal sakti hai, us pal database naye connections ko poori tarah reject karna shuru kar deta hai — aur poori application ka har route jo database par nirbhar hai, sirf ye ek nahi, ek saath fail hona shuru karta hai.

**Fix: ek connection pool ek baar, startup par banaao, aur use har request ke liye dobara use karo**

\`\`\`js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,   // kabhi bhi 20 se zyada ek-saath connections mat kholo
});

app.get("/users", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
import { Pool, QueryResult } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
});

interface User {
  id: number;
  name: string;
  email: string;
}

app.get("/users", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result: QueryResult<User> = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`new Pool({ ... })\` bilkul EK BAAR banta hai, jab application shuru hota hai, kisi bhi route handler se poori tarah BAHAR — ye khud koi connections turant nahi kholta; iske bajaye, ye pehle se bane connections ke ek chhote set ko internally manage karta hai, unhe zarurat ke hisaab se aalasi tarike se kholte hue configured \`max\` seema tak, aur — sabse zaruri — jab bhi ek maujood, pehle se khula connection maujood ho use ek nayi query ke liye DOBARA USE karte hue, har baar ek taaza kholne ke bajaye. Kisi bhi route handler ke andar se bulaya gaya \`pool.query(...)\` is managed set se ek maujood connection udhaar leta hai, query chalaata hai, aur turant baad usse pool mein wapas kar deta hai agli request ke dobara use karne ke liye — koi per-request connection setup ya teardown kharcha nahi, aur ek sakht, andaaza laga sakne laayak upar ki seema is baat par ki application kabhi kitne asli database connections ek saath khula rakh sakta hai, chahe kitni bhi requests ek saath aayein. Bilkul wahi route logic ab sahi tarike se asli chalti traffic ke tahat scale karta hai, kyunki mehnga hissa (connection banana) kam hi hota hai, shuru mein, har akeli request par dohraaye jaane ke bajaye.`,

    content: `## Why a connection pool is not just "faster" — it enforces a hard, safe limit

\`\`\`js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,           // never more than 20 open connections to the database, ever
  idleTimeoutMillis: 30000,   // close an idle connection after 30s of not being used
});
\`\`\`

Beyond avoiding the repeated cost of opening connections, a pool\'s \`max\` setting is a deliberate, hard ceiling on how many actual connections the application will ever open to the database simultaneously, regardless of how many concurrent requests arrive. Without a pool, the broken version had no such ceiling at all — the number of open connections was implicitly equal to the number of concurrent requests, with nothing preventing it from growing arbitrarily large and exceeding whatever limit the database itself enforces. A pool turns "how many database connections can this application use at once" from an unbounded, request-volume-dependent accident into a deliberate, configured decision — one that should be set with the database\'s own actual connection limit, and how many separate application instances might be running at once, genuinely in mind.

## What "borrowing and returning" a connection actually looks like

\`\`\`js
// pool.query(...) — the common case, handles borrowing and returning automatically
const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

// For multiple queries that must use the SAME connection (covered in the
// next lesson, for transactions), borrow one explicitly:
const client = await pool.connect();
try {
  await client.query("SELECT * FROM users WHERE id = $1", [userId]);
  await client.query("UPDATE users SET last_seen = NOW() WHERE id = $1", [userId]);
} finally {
  client.release();   // return the connection to the pool — NOT client.end(), which would destroy it
}
\`\`\`

\`pool.query(...)\` is the convenient, common-case method: it automatically borrows an available connection from the pool, runs the query, and returns the connection to the pool afterward, all in one call — this is correct and sufficient for the overwhelming majority of single, independent queries. \`pool.connect()\` explicitly borrows one specific connection and hands it back directly, for cases (covered in depth in the next lesson) where multiple queries genuinely need to run on the exact same underlying database connection — calling \`client.release()\` afterward is what returns that connection to the pool for reuse; calling \`client.end()\` instead would be a mistake here, since that permanently closes the connection rather than returning it, silently shrinking the pool\'s available connections over time.

## Basic CRUD with a pool: the four operations every API eventually needs

\`\`\`js
// Create
await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]);

// Read
const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

// Update
await pool.query("UPDATE users SET name = $1 WHERE id = $2", [newName, id]);

// Delete
await pool.query("DELETE FROM users WHERE id = $1", [id]);
\`\`\`

CRUD — Create, Read, Update, Delete — is the standard shorthand for the four fundamental operations nearly every data-backed API eventually performs, each mapping directly onto SQL\'s own \`INSERT\`, \`SELECT\`, \`UPDATE\`, and \`DELETE\` statements. Every example above uses \`$1\`, \`$2\`, and so on, as PLACEHOLDERS for values, passed as a separate array argument to \`pool.query\`, rather than directly embedding those values into the SQL string itself — this is not a stylistic choice; it is the specific mechanism (parameterized queries) that prevents SQL injection, a genuinely serious security vulnerability covered in full depth in the next lesson.

## TypeScript: typing query results with \`pg\`\'s generic \`QueryResult<T>\`

\`\`\`ts
import { Pool, QueryResult } from "pg";

interface User {
  id: number;
  name: string;
  email: string;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getUserById(id: number): Promise<User | undefined> {
  const result: QueryResult<User> = await pool.query<User>(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];   // rows is correctly typed as User[]
}
\`\`\`

\`pool.query<T>(...)\`, the \`pg\` package\'s own generic method (the same generic-function concept covered throughout this course, here applied to a database driver), lets the caller specify what shape each returned row should be treated as — supplying \`User\` here means \`result.rows\` is typed as \`User[]\`, giving every property access (\`result.rows[0].email\`) full autocomplete and compile-time checking. This does not itself verify at compile time that the database genuinely returns rows matching that shape — TypeScript is trusting the developer\'s assertion here, the same way it trusts any type annotation — but it does mean a typo like \`result.rows[0].emial\` is caught immediately, rather than silently producing \`undefined\` at runtime.`,

    contentHi: `## Connection pool sirf "tez" kyun nahi hai — ye ek sakht, surakshit seema lagu karta hai

\`\`\`js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,           // database ke saath kabhi 20 se zyada khule connections nahi, kabhi nahi
  idleTimeoutMillis: 30000,   // 30s tak istemal na hone par ek idle connection band karo
});
\`\`\`

Connections kholne ke dohraaye jaate kharche se bachne se aage, ek pool ki \`max\` setting ek jaan-boojhkar, sakht upar ki seema hai is baat par ki application database mein ek saath kabhi kitne asli connections kholega, chahe kitni bhi ek-saath requests aayein. Pool ke bina, toote version mein aisi koi seema thi hi nahi — khule connections ki sankhya bekhabar taur par ek-saath requests ki sankhya ke barabar thi, kuch bhi use man-maane roop se badhne se aur database khud jo bhi seema lagu karta hai use paar karne se rokta nahi tha. Ek pool "ye application ek saath kitne database connections use kar sakta hai" ko ek bina-seema, request-volume-par-nirbhar hadsa se ek jaan-boojhkar, configured faisla banaata hai — jise database ki apni asli connection seema, aur ek saath kitne alag application instances chal sakte hain, sach mein dhyaan mein rakhte hue set kiya jaana chahiye.

## Ek connection "udhaar lena aur wapas karna" asal mein kaisa dikhta hai

\`\`\`js
// pool.query(...) — aam case, udhaar lena aur wapas karna apne aap sambhaalta hai
const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

// Kai queries jinhe WAHI connection use karna zaruri hai (agle lesson mein
// transactions ke liye cover hoga), explicitly ek udhaar lo:
const client = await pool.connect();
try {
  await client.query("SELECT * FROM users WHERE id = $1", [userId]);
  await client.query("UPDATE users SET last_seen = NOW() WHERE id = $1", [userId]);
} finally {
  client.release();   // connection ko pool mein wapas do — client.end() NAHI, jo use nasht kar dega
}
\`\`\`

\`pool.query(...)\` suvidhajanak, aam case wala method hai: ye apne aap pool se ek maujood connection udhaar leta hai, query chalaata hai, aur baad mein connection ko pool mein wapas kar deta hai, sab ek call mein — ye zyadatar akele, na-jude queries ke liye sahi aur kaafi hai. \`pool.connect()\` explicitly ek khaas connection udhaar leta hai aur use seedha wapas thamaata hai, un cases ke liye (agle lesson mein gehraayi se cover hoga) jahan kai queries ko sach mein bilkul usi underlying database connection par chalna zaruri hai — baad mein \`client.release()\` bulaana wahi cheez hai jo us connection ko dobara istemal ke liye pool mein wapas karti hai; iske bajaye \`client.end()\` bulaana yahan ek galti hogi, kyunki wo connection ko hamesha ke liye band kar deta hai use wapas karne ke bajaye, waqt ke saath pool ke maujood connections ko chupchap chhota karte hue.

## Pool ke saath basic CRUD: chaar operations jo har API ko aakhirkaar chahiye

\`\`\`js
// Create
await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]);

// Read
const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

// Update
await pool.query("UPDATE users SET name = $1 WHERE id = $2", [newName, id]);

// Delete
await pool.query("DELETE FROM users WHERE id = $1", [id]);
\`\`\`

CRUD — Create, Read, Update, Delete — un chaar buniyaadi operations ke liye standard shorthand hai jo lagbhag har data-backed API aakhirkaar karta hai, har ek seedha SQL ke apne \`INSERT\`, \`SELECT\`, \`UPDATE\`, aur \`DELETE\` statements par map hota hai. Upar ka har example \`$1\`, \`$2\`, wagairah, ko values ke PLACEHOLDERS ki tarah use karta hai, \`pool.query\` ko ek alag array argument ki tarah pass kiye jaate hue, un values ko seedha SQL string mein hi daalne ke bajaye — ye koi stylistic chunaav nahi hai; ye wahi khaas mechanism hai (parameterized queries) jo SQL injection rokta hai, ek sach mein gambhir security vulnerability jo agle lesson mein poori gehraayi se cover hui hai.

## TypeScript: \`pg\` ke generic \`QueryResult<T>\` se query results ko type karna

\`\`\`ts
import { Pool, QueryResult } from "pg";

interface User {
  id: number;
  name: string;
  email: string;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getUserById(id: number): Promise<User | undefined> {
  const result: QueryResult<User> = await pool.query<User>(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];   // rows sahi tarike se User[] typed hai
}
\`\`\`

\`pool.query<T>(...)\`, \`pg\` package ka apna generic method (poore course mein cover hua wahi generic-function concept, yahan ek database driver par lagu), caller ko batane deta hai har lautaayi hui row ko kaunsi shape ki tarah treat karna chahiye — yahan \`User\` dena matlab \`result.rows\` \`User[]\` typed hai, har property access (\`result.rows[0].email\`) ko poora autocomplete aur compile-time checking dete hue. Ye khud compile time par verify nahi karta ki database sach mein us shape se milti rows lautaata hai — TypeScript yahan developer ke assertion par bharosa kar raha hai, wahi tarike se jaise ye kisi bhi type annotation par bharosa karta hai — par iska matlab hai \`result.rows[0].emial\` jaisa typo turant pakda jaata hai, runtime par chupchap \`undefined\` paida karne ke bajaye.`,

    examples: [
      {
        title: 'Broken: a fresh connection per request exhausts the database under load',
        titleHi: 'Toota: har request ke liye ek taaza connection load ke tahat database khatam kar deta hai',
        code: `app.get("/users", async (req, res) => {
  const client = new Client(config);
  await client.connect();
  const result = await client.query("SELECT * FROM users");
  await client.end();
  res.json(result.rows);
});`,
        codeJs: `const { Client } = require("pg");
const express = require("express");
const app = express();

app.get("/users", async (req, res, next) => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const result = await client.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    next(err);
  } finally {
    await client.end();
  }
});

app.listen(3000);
// Works fine for 1 request at a time. Under 100+ concurrent requests,
// the database's own max-connection limit is exceeded, and it starts
// refusing new connections entirely.`,
        codeTs: `import { Client } from "pg";
import express, { Request, Response, NextFunction } from "express";
const app = express();

app.get("/users", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const result = await client.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    next(err);
  } finally {
    await client.end();
  }
});

app.listen(3000);
// TypeScript does not catch this — creating a new Client per request
// is completely valid syntax. This is a scalability issue, not a type
// error.`,
        output: `Manually testing one request at a time: works perfectly every time.
Under a simulated load test with 100 concurrent requests: many
requests fail with connection errors, or the database itself logs
"too many connections" and starts rejecting new ones — including
connections needed by completely unrelated parts of the application.`,
        explain: 'This bug is specifically invisible during normal development, since a developer testing manually almost never sends more than one or two requests at the exact same moment — it only appears under genuine concurrent load, which is precisely when it is most damaging.',
        explainHi: 'Ye bug khaas taur par aam development ke dauran adrishya hai, kyunki haath se test karta developer lagbhag kabhi bhi bilkul usi pal ek ya do se zyada requests nahi bhejta — ye sirf asli chalti hui traffic ke tahat dikhta hai, jo bilkul wahi waqt hai jab ye sabse zyada nuksaandayak hai.',
      },
      {
        title: 'Fixed: a pool created once, reused for every request',
        titleHi: 'Theek: ek baar bana pool, har request ke liye dobara use hua',
        code: `const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 20 });
app.get("/users", async (req, res, next) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});`,
        codeJs: `const { Pool } = require("pg");
const express = require("express");
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
});

app.get("/users", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.listen(3000);
// Same 100-concurrent-request load test: correctly served, since
// pool.query reuses existing connections instead of opening a new one
// per request, staying well within the max limit.`,
        codeTs: `import { Pool } from "pg";
import express, { Request, Response, NextFunction } from "express";
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
});

app.get("/users", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.listen(3000);`,
        outputJs: `The same 100-concurrent-request test that broke the previous version
now succeeds — the pool never opens more than 20 actual database
connections at once, reusing them across all 100 requests as each one
finishes, well within the database's own connection limit.`,
        outputTs: `// Identical behaviour. "const pool = new Pool(...)" is created once,
// at module scope, outside any route handler — its type is inferred
// once and used identically by every route that imports it.`,
        explain: 'The route handler\'s own logic is nearly identical to the broken version — the entire fix is WHERE and HOW OFTEN the connection setup happens: once at startup, instead of once per request.',
        explainHi: 'Route handler ka apna logic toote version se lagbhag identical hai — poora fix ye hai KAHAN aur KITNI BAAR connection setup hota hai: ek baar startup par, har request par ek baar ke bajaye.',
      },
      {
        title: 'Basic CRUD operations using the pool',
        titleHi: 'Pool use karte basic CRUD operations',
        code: `await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]);
const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
await pool.query("UPDATE users SET name = $1 WHERE id = $2", [newName, id]);
await pool.query("DELETE FROM users WHERE id = $1", [id]);`,
        codeJs: `app.post("/users", validate(createUserSchema), async (req, res, next) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [req.body.name, req.body.email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.get("/users/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.delete("/users/:id", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `interface User {
  id: number;
  name: string;
  email: string;
}

app.post("/users", validate(createUserSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query<User>(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [req.body.name, req.body.email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.get("/users/:id", async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query<User>("SELECT * FROM users WHERE id = $1", [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `All four operations correctly borrow and return connections through
the same shared pool — no route creates or manages its own connection
directly, keeping the connection-management logic in exactly one
place.`,
        outputTs: `// "pool.query<User>(...)" types result.rows as "User[]" for every one
// of these routes, giving result.rows[0].email full autocomplete and
// compile-time checking throughout.`,
        explain: 'Every route here uses the exact same shared pool instance created once at module scope — none of them create their own connection, which is precisely what keeps the total number of open connections bounded regardless of how many routes or requests are active.',
        explainHi: 'Yahan har route bilkul wahi shared pool instance use karta hai jo module scope par ek baar banaya gaya — inme se koi bhi apna khud ka connection nahi banaata, aur bilkul yahi cheez hai jo khule connections ki kul sankhya ko seemit rakhti hai chahe kitne bhi routes ya requests sakriya hon.',
      },
    ],

    mistakes: [
      {
        wrong: `app.get("/users", async (req, res) => {
  const client = new Client(config);
  await client.connect();
  // ... a new connection opened on every single request
});`,
        right: `const pool = new Pool(config);   // created ONCE, at startup
app.get("/users", async (req, res) => {
  const result = await pool.query(/* ... */);   // reuses an existing connection
});`,
        why: 'A new connection per request works in casual single-request testing but exhausts the database\'s hard maximum-connection limit under real concurrent traffic, causing widespread failures across the entire application, not just the route that triggered it.',
        whyHi: 'Har request ke liye ek naya connection saadhe akele-request testing mein kaam karta hai par asli chalti hui traffic ke tahat database ki sakht adhiktam-connection seema khatam kar deta hai, poori application mein badi asafaltaayen paida karte hue, sirf us route mein nahi jisne use trigger kiya.',
      },
      {
        wrong: `const client = await pool.connect();
await client.query(/* ... */);
await client.end();   // destroys the connection instead of returning it to the pool`,
        right: `const client = await pool.connect();
await client.query(/* ... */);
client.release();   // returns the connection to the pool for reuse`,
        why: 'client.end() permanently closes a connection borrowed from a pool rather than returning it — repeatedly doing this silently shrinks the pool\'s available connections over time, eventually leaving none for other requests to use.',
        whyHi: '\`client.end()\` pool se udhaar liye connection ko wapas karne ke bajaye use hamesha ke liye band kar deta hai — baar-baar aisa karna waqt ke saath pool ke maujood connections ko chupchap chhota karta hai, aakhirkaar doosri requests ke istemal ke liye koi na chhodte hue.',
      },
      {
        wrong: `const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 500 });
// pool's own max exceeds what the database server can actually support`,
        right: `const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 20 });
// set with the database's own actual connection limit genuinely in mind`,
        why: 'A pool\'s max setting only prevents THIS application from opening too many connections — it does nothing to account for the database\'s own hard limit or other application instances also connecting to it, so it must be set conservatively relative to the database\'s actual documented maximum.',
        whyHi: 'Pool ki \`max\` setting sirf ISI application ko bahut zyada connections kholne se rokti hai — ye database ki apni sakht seema ya doosre application instances jo usse bhi jud rahe hain unka hisaab rakhne ke liye kuch nahi karti, isliye ise database ki asli documented adhiktam ko sach mein dhyaan mein rakhte hue conservatively set karna chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**"Too many connections" or "connection pool exhausted" is one of the most commonly reported real production database incidents**, and is consistently traced back to either missing connection pooling entirely or a pool\'s max setting misconfigured relative to the database\'s actual limit.',
        hi: '**"Too many connections" ya "connection pool exhausted" sabse aksar report hui asli production database incidents mein se ek hai**, aur lagataar wapas ya to poori tarah missing connection pooling se, ya database ki asli seema ke muqable galat-configured pool ki \`max\` setting se trace hoti hai.',
      },
      {
        en: '**Nearly every production Node.js application connecting to a relational database uses a connection pool** — either directly through a driver\'s own pool (like pg\'s Pool, covered here) or transparently managed by a higher-level ORM (Prisma, TypeORM, Sequelize) that maintains its own pool internally using the exact same principle.',
        hi: '**Lagbhag har production Node.js application jo ek relational database se judti hai ek connection pool use karti hai** — ya to ek driver ke apne pool ke through seedha (jaise pg ka Pool, yahan cover hua) ya ek uchch-star ORM (Prisma, TypeORM, Sequelize) dwara pardarshi roop se manage hote hue jo internally bilkul wahi principle use karke apna pool maintain karta hai.',
      },
      {
        en: '**Serverless deployment platforms (AWS Lambda and similar) introduce a well-known, specific connection-pooling complication**, since each serverless function invocation can spin up its own separate process — real production architectures using serverless functions with traditional databases typically require a dedicated external connection-pooling layer specifically to manage this.',
        hi: '**Serverless deployment platforms (AWS Lambda aur waise hi) ek achhi tarah jaani-pehchaani, khaas connection-pooling pechidgi laate hain**, kyunki har serverless function invocation apna alag process shuru kar sakta hai — asli production architectures jo traditional databases ke saath serverless functions use karti hain aam taur par khaas taur par ise manage karne ke liye ek dedicated external connection-pooling layer maangti hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a route handler creating a new database connection for every incoming request work correctly in casual manual testing but fail under real concurrent traffic?',
        qHi: 'Ek route handler jo har aati request ke liye ek naya database connection banaata hai saadhi haath se testing mein sahi tarike se kyun kaam karta hai par asli chalti hui traffic ke tahat kyun fail hota hai?',
        a: 'When a developer tests manually, requests are almost always sent one at a time, with enough of a gap between them that each request\'s connection is fully opened, used, and closed before the next request even begins — at no point during this kind of testing are there ever many connections open simultaneously, so the actual number of open connections stays low regardless of how many total requests are eventually sent over time. Real concurrent traffic is fundamentally different: many requests genuinely arrive close enough together that their connection-opening, querying, and connection-closing work overlaps in time, meaning many connections can be open SIMULTANEOUSLY rather than one at a time. Every real database server enforces a hard maximum number of connections it will accept open at once — a fixed ceiling that exists because each open connection consumes real server-side memory and resources. Under genuine concurrent load, if enough requests\' connections happen to be open at the same moment, that simultaneous count can genuinely exceed the database\'s maximum, at which point the database begins refusing new connection attempts outright, causing failures — a failure mode that simply cannot occur during single-request-at-a-time manual testing, since the number of simultaneously open connections never rises high enough to reach the limit in the first place.',
        aHi: 'Jab ek developer haath se test karta hai, requests lagbhag hamesha ek waqt mein ek bheji jaati hain, unke beech itna gap ke saath ki har request ka connection agli request shuru hone se pehle hi poori tarah khulta, use hota, aur band hota hai — is kism ki testing ke dauran kabhi bhi ek saath kai connections khule nahi hote, isliye khule connections ki asli sankhya kam rehti hai chahe waqt ke saath kul kitni bhi requests bheji jaayein. Asli chalti hui traffic buniyaadi taur par alag hai: kai requests sach mein ek doosre ke itni kareeb aati hain ki unka connection-kholna, query karna, aur connection-band-karna kaam waqt mein ek doosre par chhaa jaata hai, matlab kai connections EK-SAATH khule ho sakte hain ek waqt mein ek ke bajaye. Har asli database server ek sakht adhiktam sankhya lagu karta hai connections ki jo wo ek saath khule accept karega — ek fixed seema jo isliye maujood hai kyunki har khula connection asli server-side memory aur resources kharch karta hai. Asli chalti hui load ke tahat, agar kaafi requests ke connections samyog se usi pal khule hon, wo ek-saath ginti sach mein database ki adhiktam se aage nikal sakti hai, us pal database naye connection attempts ko poori tarah reject karna shuru kar deta hai, asafaltaayen paida karte hue — ek asafalta ka tarika jo ek-waqt-mein-ek-request wali haath se testing ke dauran bilkul ho hi nahi sakta, kyunki ek-saath khule connections ki sankhya kabhi itni upar nahi jaati ki pehli jagah seema tak pahunch sake.',
      },
      {
        q: 'What does a connection pool\'s "max" setting actually control, and why does it need to be set with the database\'s own limit in mind rather than an arbitrarily large number?',
        qHi: 'Connection pool ki "max" setting asal mein kya control karti hai, aur ise database ki apni seema ko dhyaan mein rakhte hue kyun set karna chahiye, ek man-maane bade number ke bajaye?',
        a: 'A connection pool\'s max setting specifies the largest number of simultaneous database connections that particular pool instance — and therefore that particular application, or that specific instance of it — will ever attempt to have open at once, regardless of how many requests are currently being processed; once max connections are already open and all busy, additional queries wait in an internal queue for one to become free rather than opening a new connection beyond that limit. This setting exists specifically to prevent the unbounded connection growth the broken version of this lesson demonstrated, but it only controls what THIS pool does — it has no awareness of the database server\'s own separately configured hard maximum on total incoming connections it will accept from all sources combined, nor any awareness of how many other separate application instances (other server processes, other services) might simultaneously be maintaining their own pools against the same database. Setting max to an arbitrarily large number defeats the purpose of having a limit at all, and setting it without considering the database\'s actual documented connection limit (and how many other application instances might be connecting concurrently) risks the exact same "too many connections" failure this lesson\'s broken example produced, just requiring a larger number of simultaneous application instances or a smaller database-side limit to trigger it.',
        aHi: 'Connection pool ki \`max\` setting bataati hai wo sabse badi sankhya jo ek waqt mein khule database connections ki us khaas pool instance — aur isliye us khaas application, ya uske us khaas instance — kabhi ek saath rakhne ki koshish karega, chahe abhi kitni bhi requests process ho rahi hon; ek baar \`max\` connections pehle se khule aur sab masroof ho, additional queries ek internal queue mein intezaar karte hain ek ke azaad hone ka us seema se aage ek naya connection kholne ke bajaye. Ye setting khaas taur par is lesson ke toote version wali bina-seema connection growth ko rokne ke liye maujood hai, par ye sirf ye control karti hai ki YE pool kya karta hai — use database server ki apni alag se configured sakht adhiktam ke baare mein koi jaankaari nahi jo wo sab sroton se milaakar kul aati connections mein se accept karega, na hi koi jaankaari ki kitne doosre alag application instances (doosre server processes, doosre services) samyog se apne khud ke pools usi database ke khilaaf maintain kar rahe hon. \`max\` ko ek man-maane bade number par set karna seema hone ka poora maqsad hi haraata hai, aur ise database ki asli documented connection seema (aur kitne doosre application instances samyog se jud sakte hain) ka dhyaan rakhe bina set karna bilkul wahi "too many connections" asafalta ka khatra rakhta hai jo is lesson ka toota example paida karta hai, bas use trigger karne ke liye ek-saath application instances ki zyada sankhya ya ek chhoti database-side seema maangte hue.',
      },
      {
        q: 'Why must calling pool.connect() to borrow a specific connection be paired with client.release() rather than client.end()?',
        qHi: 'Ek khaas connection udhaar lene ke liye \`pool.connect()\` bulaane ko \`client.end()\` ke bajaye \`client.release()\` ke saath kyun jodna chahiye?',
        a: 'pool.connect() hands the calling code direct access to one specific connection that the pool itself still considers part of its managed set — the connection is "checked out" from the pool for the caller\'s exclusive use temporarily, with the pool expecting it back once the caller is finished. client.release() is the specific method that returns this borrowed connection to the pool\'s internal set of available connections, making it eligible to be lent out again to a future query — this is the correct counterpart to pool.connect(), completing the borrow-and-return cycle the pool is designed around. client.end(), by contrast, permanently terminates the underlying database connection entirely, closing the actual network connection to the database server — calling this on a connection borrowed from a pool does not return it to the pool at all; it destroys the connection outright, meaning the pool has one fewer available connection in its set going forward, having no way to know the connection was closed rather than returned. Repeating this mistake across multiple borrowed connections progressively shrinks the pool\'s actual usable capacity over time, eventually leaving it with fewer working connections than its configured max would suggest, without any explicit error indicating why.',
        aHi: '\`pool.connect()\` bulaane wale code ko ek khaas connection tak seedha access thamaata hai jise pool khud abhi bhi apne managed set ka hissa maanta hai — connection pool se caller ke akele istemal ke liye thodi der ke liye "check out" hota hai, pool ummeed karta hai wo wapas aaye jab caller khatam kar le. \`client.release()\` wo khaas method hai jo is udhaar liye connection ko pool ke internal maujood connections ke set mein wapas karta hai, use ek aane wali query ko dobara udhaar dene ke laayak banaate hue — ye \`pool.connect()\` ka sahi barabar hai, us udhaar-lene-aur-wapas-karne ke cycle ko poora karte hue jiske aas-paas pool design hua hai. \`client.end()\`, iske ulat, underlying database connection ko poori tarah hamesha ke liye khatam kar deta hai, database server tak asli network connection band karte hue — pool se udhaar liye connection par ise bulaana use poori tarah pool mein wapas nahi karta; ye connection ko poori tarah nasht kar deta hai, matlab pool ke paas aage jaane ke liye apne set mein ek kam maujood connection hai, ye jaanne ka koi tarika na hote hue ki connection band hua tha ya wapas kiya gaya tha. Kai udhaar liye connections mein ye galti dohraana waqt ke saath pool ki asli istemal-laayak kaabiliyat ko dheere-dheere chhota karta hai, aakhirkaar use uski configured \`max\` se kam kaam karte connections chhodte hue, koi explicit error batae kyun.',
      },
      {
        q: 'What does typing a pg query with pool.query<User>(...) actually verify, and what does it NOT verify?',
        qHi: 'Ek pg query ko \`pool.query<User>(...)\` se type karna asal mein kya verify karta hai, aur kya NAHI verify karta?',
        a: 'Supplying a type argument to pool.query<T>(...) tells TypeScript to treat the query\'s result.rows as an array of type T, giving every subsequent access to a row\'s properties (like result.rows[0].email) full autocomplete and compile-time type checking against the shape T describes — a typo in a property name, or attempting to access a property T does not define, is caught at compile time as a result. This is purely a TypeScript-level, compile-time convenience, however — it does NOT perform any actual runtime verification that the database genuinely returns rows matching the specified shape; TypeScript has no way to inspect what a live database connection will actually return when the code runs, and is simply trusting the developer\'s type argument as an assertion of what they expect. If the actual SQL query, the database schema, or the underlying table were to change such that returned rows no longer genuinely match the specified type T, TypeScript would have no way to detect this mismatch at compile time — the code would still compile without error, and the disagreement between the asserted type and the actual runtime data would only surface as a runtime bug, not a caught type error.',
        aHi: '\`pool.query<T>(...)\` ko ek type argument dena TypeScript ko batata hai query ke \`result.rows\` ko type \`T\` ki ek array ki tarah treat karo, kisi row ki properties tak har agli baar ki access ko (jaise \`result.rows[0].email\`) poora autocomplete aur compile-time type checking dete hue \`T\` ki darzhaayi shape ke khilaaf — ek property naam mein typo, ya ek aisi property access karne ki koshish jise \`T\` define nahi karta, nateeja mein compile time par pakdi jaati hai. Ye poori tarah ek TypeScript-star, compile-time suvidha hai, halaanki — ye koi asli runtime verification NAHI karta ki database sach mein khaas shape se milti rows lautaata hai; TypeScript ke paas ye inspect karne ka koi tarika nahi ki ek asli database connection code chalne par asal mein kya lautaayega, aur bas developer ke type argument par bharosa kar raha hai jo wo ummeed karte hain uska ek assertion ki tarah. Agar asli SQL query, database schema, ya underlying table itni badle ki lautaayi hui rows ab sach mein khaas type \`T\` se na milein, TypeScript ke paas is bemel ko compile time par pakadne ka koi tarika nahi hoga — code bina error ke phir bhi compile hoga, aur assert kiye type aur asli runtime data ke beech ki asehmat sirf ek runtime bug ki tarah saamne aayegi, ek pakdi hui type error nahi.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken route creating a new Client per request. Using a load-testing tool (or a script sending 50-100 concurrent requests), confirm the app starts throwing connection errors or the database logs "too many connections".',
        taskHi: 'Har request ke liye ek naya Client banaata toota route banao. Ek load-testing tool (ya 50-100 ek-saath requests bhejta script) use karke, confirm karo app connection errors throw karna shuru karta hai ya database "too many connections" log karta hai.',
        hint: 'If a real database is inconvenient to set up, mock the Client\'s connect() method to track and log how many are simultaneously "open" during the load test, making the growth directly visible without needing a real database to actually reject anything.',
        hintHi: 'Agar asli database set up karna asuvidhajanak hai, Client ke connect() method ko mock karo track aur log karne ke liye ki load test ke dauran kitne ek-saath "khule" hain, badhaav ko seedha dikhta banaate hue bina asli database ki zarurat ke asal mein kuch reject karne ki.',
      },
      {
        task: 'Fix it with a Pool created once at module scope, with a reasonable max setting. Repeat the same load test and confirm it now succeeds correctly.',
        taskHi: 'Module scope par ek baar banaya Pool se theek karo, ek samajhdaari wali max setting ke saath. Wahi load test dohraao aur confirm karo ye ab sahi tarike se safal hota hai.',
        hint: 'Set max to an artificially small number (like 2) and send several concurrent requests, then observe requests correctly queuing and waiting for an available connection rather than failing outright, directly demonstrating the pool\'s internal queuing behavior.',
        hintHi: 'Max ko jaan-boojhkar ek chhota number set karo (jaise 2) aur kai ek-saath requests bhejo, phir dekho requests sahi tarike se ek maujood connection ka intezaar karti hain poori tarah fail hone ke bajaye, pool ke internal queuing behaviour ko seedha dikhaate hue.',
      },
      {
        task: 'Build all four CRUD routes (Create/Read/Update/Delete) using the shared pool, and add TypeScript types with pool.query<User>(...) throughout. Deliberately introduce a typo in a property access and confirm TypeScript catches it.',
        taskHi: 'Shared pool use karte chaaron CRUD routes (Create/Read/Update/Delete) banao, aur poore mein \`pool.query<User>(...)\` se TypeScript types jodo. Jaan-boojhkar ek property access mein typo daalo aur confirm karo TypeScript ise pakadta hai.',
        hint: 'Temporarily change the database schema (or the mock data) so a returned row genuinely does not match the declared User type, and confirm TypeScript does NOT catch this specific mismatch, directly demonstrating the compile-time-only nature of this type safety.',
        hintHi: 'Thodi der ke liye database schema (ya mock data) badlo taaki ek lautaayi hui row sach mein declared User type se na mile, aur confirm karo TypeScript is khaas bemel ko NAHI pakadta, is type safety ki compile-time-only fitrat seedha dikhaate hue.',
      },
    ],

    keyTakeaways: [
      'Creating a new database connection inside every route handler works correctly in single-request manual testing but exhausts the database\'s hard maximum-connection limit under real concurrent traffic, causing widespread application-wide failures.',
      'A connection pool, created once at startup, manages a small set of connections internally, reusing an already-open connection for each query instead of opening a fresh one — eliminating both the repeated connection-setup cost and the unbounded connection growth of the broken approach.',
      'A pool\'s max setting is a deliberate, hard ceiling on how many connections the application will open at once — it must be set with the database\'s own actual connection limit, and how many other application instances might connect concurrently, genuinely in mind.',
      'pool.query() automatically borrows and returns a connection for a single query; pool.connect() explicitly borrows one for multiple queries needing the same connection, requiring client.release() (not client.end()) to correctly return it afterward.',
      'CRUD (Create, Read, Update, Delete) maps directly onto SQL\'s INSERT, SELECT, UPDATE, and DELETE — every example uses numbered placeholders ($1, $2) with values passed separately, the mechanism that prevents SQL injection, covered in the next lesson.',
      'pg\'s generic pool.query<T>(...) types result.rows as T[] for compile-time autocomplete and checking, but this is purely a TypeScript-level assertion — it does not verify at runtime that the database genuinely returns rows matching that shape.',
    ],
    keyTakeawaysHi: [
      'Har route handler ke andar ek naya database connection banaana ek-request wali haath se testing mein sahi tarike se kaam karta hai par asli chalti hui traffic ke tahat database ki sakht adhiktam-connection seema khatam kar deta hai, poori application mein badi asafaltaayen paida karte hue.',
      'Ek connection pool, startup par ek baar banaya gaya, connections ke ek chhote set ko internally manage karta hai, har query ke liye ek pehle se khula connection dobara use karte hue ek taaza kholne ke bajaye — dono baar-baar wale connection-setup kharche aur toote tarike ki bina-seema connection growth ko khatam karte hue.',
      'Pool ki \`max\` setting is baat par ek jaan-boojhkar, sakht upar ki seema hai ki application ek saath kitne connections kholega — ise database ki apni asli connection seema, aur kitne doosre application instances samyog se jud sakte hain, sach mein dhyaan mein rakhte hue set karna chahiye.',
      '\`pool.query()\` apne aap ek akeli query ke liye ek connection udhaar leta aur wapas karta hai; \`pool.connect()\` explicitly ek udhaar leta hai kai queries ke liye jinhe wahi connection chahiye, baad mein sahi tarike se wapas karne ke liye \`client.release()\` (\`client.end()\` nahi) maangte hue.',
      'CRUD (Create, Read, Update, Delete) seedha SQL ke \`INSERT\`, \`SELECT\`, \`UPDATE\`, aur \`DELETE\` par map hota hai — har example numbered placeholders (\`$1\`, \`$2\`) use karta hai values ke saath alag se pass hote hue, wo mechanism jo SQL injection rokta hai, agle lesson mein cover hoga.',
      'pg ka generic \`pool.query<T>(...)\` \`result.rows\` ko compile-time autocomplete aur checking ke liye \`T[]\` ki tarah type karta hai, par ye poori tarah ek TypeScript-star assertion hai — ye runtime par verify nahi karta ki database sach mein us shape se milti rows lautaata hai.',
    ],
  },
];
