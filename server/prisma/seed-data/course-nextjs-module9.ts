/**
 * Next.js Complete Course — Module 9: Database Integration at Production Scale, lessons 1-3.
 *
 * Lesson 1: The connection pooling exhaustion problem on serverless.
 * Lesson 2: Avoiding N+1 queries with Prisma.
 * Lesson 3: Transactions inside Server Actions — when and why.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_9: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-serverless-connection-pooling',
    title: 'The Serverless Connection Pool Exhaustion Problem',
    titleHi: 'Serverless Connection Pool Exhaustion Problem',
    description:
      "A traditional long-running server opens a handful of database connections once and reuses them forever. A serverless function can spin up a fresh instance per request, and if each one opens its own new database connection, a traffic spike can open far more connections than the database can actually hold.",
    descriptionHi:
      'Ek traditional long-running server ek baar muththi bhar database connections kholta hai aur unhe hamesha ke liye reuse karta hai. Ek serverless function har request ke liye ek fresh instance spin up kar sakta hai, aur agar har ek apna khud ka naya database connection kholta hai, ek traffic spike un connections se kaafi zyada khol sakta hai jitne database actually rakh sakta hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 1,

    analogy: {
      en: "**A restaurant with a fixed number of tables, versus a sudden crowd where every single new customer insists on their own personal table and refuses to share.** A restaurant with 20 tables can comfortably seat waves of customers as long as tables get reused — one party finishes, the table is cleared, the next party sits. If instead every customer showed up in their own private moment and demanded a BRAND NEW table just for themselves, refusing any table someone used before, the restaurant runs out of tables almost immediately even though far fewer than 20 people are dining at any single instant. A database's connection limit is the fixed number of tables; each serverless function instance opening its own fresh connection is the customer who won't share a table.",
      hi: 'Ek restaurant jiske paas tables ki ek fixed number hai, versus ek sudden crowd jahan har naya customer apni khud ki personal table pe zid karta hai aur share karne se mana kar deta hai. 20 tables wala ek restaurant customers ki waves ko comfortably seat kar sakta hai jab tak tables reuse hote hain — ek party khatam hoti hai, table clear hota hai, agli party baithti hai. Agar iske bajaye har customer apne khud ke private moment mein aata aur apne liye ek BILKUL NAYI table demand karta, kisi bhi table ko use karne se mana karte hue jo pehle kisi ne use ki thi, restaurant almost immediately tables se bahar ho jata chahe kisi bhi single instant pe 20 se kaafi kam log dine kar rahe hon. Ek database ki connection limit tables ki fixed number hai; har serverless function instance apna khud ka fresh connection khol raha hai wo customer hai jo table share nahi karega.',
    },

    simple: `**A traditional long-running Node.js server keeps a small, stable pool
of database connections open for its entire lifetime:**

\`\`\`
Server starts -> opens 10 connections -> reuses those SAME 10 connections
for every request, forever, until the server shuts down.
\`\`\`

**A serverless deployment (Vercel functions, AWS Lambda) can spin up MANY
separate function instances simultaneously under load — and if each one
naively creates its own new Prisma Client / database connection:**

\`\`\`
Traffic spike -> 200 simultaneous function invocations -> each one
creates a NEW Prisma Client -> 200 new database connections attempted
-> most databases cap total connections around 20-100 -> the excess
connections are refused, and requests start failing with connection
errors that have nothing to do with the actual application logic.
\`\`\`

**The core mistake to avoid — creating a new client per request:**

\`\`\`ts
// WRONG: a fresh PrismaClient (and fresh DB connection) every single call
export async function GET() {
  const prisma = new PrismaClient(); // new connection, every request
  const users = await prisma.user.findMany();
  return Response.json(users);
}
\`\`\`

**The standard fix — a single, reused client instance:**

\`\`\`ts
// lib/prisma.ts — one client, reused across every request in this instance
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma; // survives hot-reloads in dev
}
\`\`\`

**Why this alone isn't fully sufficient on serverless:** reusing one
client PER FUNCTION INSTANCE helps, but serverless platforms can still
spin up many separate instances simultaneously under real load — each with
its own single client. The deeper fix is a connection pooler that sits
between all those instances and the actual database (covered next), or an
edge-compatible driver designed specifically for this environment.`,

    simpleHi: `**Ek traditional long-running Node.js server database connections ka
ek chhota, stable pool apni poori lifetime ke liye open rakhta hai:**

\`\`\`
Server start hota hai -> 10 connections kholta hai -> har request ke
liye wahi SAME 10 connections reuse karta hai, hamesha ke liye, jab tak
server shutdown nahi hota.
\`\`\`

**Ek serverless deployment (Vercel functions, AWS Lambda) load ke andar
simultaneously MANY separate function instances spin up kar sakta hai —
aur agar har ek naively apna khud ka naya Prisma Client / database
connection banata hai:**

\`\`\`
Traffic spike -> 200 simultaneous function invocations -> har ek
ek NAYA Prisma Client banata hai -> 200 naye database connections
attempted -> zyadatar databases total connections ko 20-100 ke around
cap karte hain -> excess connections refuse ho jaate hain, aur requests
connection errors ke saath fail hona shuru ho jaate hain jinka actual
application logic se koi lena-dena nahi hai.
\`\`\`

**Avoid karne wali core mistake — per request ek naya client banana:**

\`\`\`ts
// GALAT: ek fresh PrismaClient (aur fresh DB connection) har single call pe
export async function GET() {
  const prisma = new PrismaClient(); // naya connection, har request
  const users = await prisma.user.findMany();
  return Response.json(users);
}
\`\`\`

**Standard fix — ek single, reused client instance:**

\`\`\`ts
// lib/prisma.ts — ek client, is instance ki har request ke across reused
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma; // dev mein hot-reloads ko survive karta hai
}
\`\`\`

**Ye akela serverless pe kyun poori tarah sufficient nahi hai:** ek client
PER FUNCTION INSTANCE reuse karna help karta hai, par serverless platforms
abhi bhi real load ke andar simultaneously kai separate instances spin up
kar sakte hain — har ek apne khud ke single client ke saath. Deeper fix ek
connection pooler hai jo un sab instances aur actual database ke beech
baithta hai (aage cover kiya jayega), ya ek edge-compatible driver jo
specifically is environment ke liye design kiya gaya hai.`,

    content: `## Why the problem is specific to serverless, not a general "too much
traffic" issue

A traditional server's connection count is bounded by how many server
PROCESSES you run, which you control directly and scale deliberately. A
serverless platform's whole value proposition is scaling function
instances automatically and rapidly in response to traffic — which is
exactly what makes the connection count unpredictable and potentially far
larger than any database's connection limit, without anyone having
explicitly decided to scale that aggressively. This isn't a bug in
serverless platforms; it's a direct consequence of what makes them useful
elsewhere (automatic, fine-grained scaling) colliding with what databases
require (a small, stable, known number of connections).

## Why reusing a client per instance is necessary but not sufficient

Reusing a Prisma Client across requests within the SAME function instance
(via the \`globalForPrisma\` pattern) correctly avoids opening a new
connection on every single request handled by that one instance — this
matters and is a genuine, necessary fix. What it doesn't solve is the
platform spinning up 200 DIFFERENT instances simultaneously, each with its
own reused-within-itself client, still adding up to far more total
connections than the database can hold.

## PgBouncer and connection pooling proxies

A connection pooler (PgBouncer being the most common for PostgreSQL) sits
between your application and the actual database, maintaining a small,
stable pool of REAL database connections while accepting many more
lightweight client connections from your application instances. Your 200
serverless instances all connect to the pooler (cheap, doesn't strain the
database), and the pooler multiplexes their actual queries across a much
smaller number of genuine database connections. This requires configuring
your database URL to point at the pooler rather than the database
directly, and — for Prisma specifically — often requires a
\`?pgbouncer=true\` connection string parameter to disable certain Prisma
features (like prepared statement caching) that don't work correctly
through a transaction-mode pooler.

## Prisma Accelerate and edge-compatible approaches

Prisma Accelerate is a managed connection-pooling and caching layer built
specifically for this problem, requiring no self-hosted PgBouncer — it
sits in front of your database as a service, and your app talks to it
over HTTP rather than a raw database connection, which is also what makes
it compatible with the Edge runtime (which cannot hold traditional
database connections in the same way Node.js can). Choosing between
self-hosted PgBouncer and a managed service like Accelerate is
operational (who manages the infrastructure) rather than a difference in
the underlying problem being solved.`,

    contentHi: `## Problem specifically serverless ke liye kyun hai, ek general "bahut
zyada traffic" issue nahi

Ek traditional server ka connection count is baat se bound hai ki aap
kitne server PROCESSES chalate ho, jise aap directly control karte ho aur
deliberately scale karte ho. Ek serverless platform ka poora value
proposition function instances ko automatically aur rapidly traffic ke
response mein scale karna hai — jo exactly wahi cheez hai jo connection
count ko unpredictable aur potentially kisi bhi database ki connection
limit se kaafi zyada bana deti hai, bina kisi ke explicitly itna
aggressively scale karne ka decide kiye. Ye serverless platforms mein ek
bug nahi hai; ye ek direct consequence hai us cheez ka jo unhe kahin aur
useful banata hai (automatic, fine-grained scaling) us cheez se collide
karte hue jo databases ko chahiye (chhoti, stable, known number ki
connections).

## Per instance ek client reuse karna zaroori kyun hai par sufficient nahi

WAHI function instance ke andar requests ke across ek Prisma Client reuse
karna (\`globalForPrisma\` pattern ke through) correctly us ek instance
dwara handle ki gayi har single request pe ek naya connection kholne se
avoid karta hai — ye matter karta hai aur ek genuine, necessary fix hai.
Jo ye solve nahi karta wo hai platform ka simultaneously 200 ALAG instances
spin up karna, har ek apne khud ke apne-andar-reused client ke saath,
phir bhi total connections mein add karte hue database jitna hold kar
sakta hai usse kaafi zyada.

## PgBouncer aur connection pooling proxies

Ek connection pooler (PostgreSQL ke liye PgBouncer sabse common hai)
aapki application aur actual database ke beech baithta hai, REAL database
connections ka ek chhota, stable pool maintain karte hue jabki aapke
application instances se kaafi zyada lightweight client connections
accept karta hai. Aapke 200 serverless instances sab pooler se connect
karte hain (cheap, database ko strain nahi karta), aur pooler unke actual
queries ko genuine database connections ki ek kaafi chhoti number ke
across multiplex karta hai. Isko aapke database URL ko pooler ki taraf
point karne ki zaroorat hai database ke bajaye directly, aur — Prisma ke
liye specifically — aksar ek \`?pgbouncer=true\` connection string parameter
ki zaroorat hai kuch Prisma features (jaise prepared statement caching)
ko disable karne ke liye jo ek transaction-mode pooler ke through
correctly kaam nahi karte.

## Prisma Accelerate aur edge-compatible approaches

Prisma Accelerate ek managed connection-pooling aur caching layer hai jo
specifically is problem ke liye banaya gaya, koi self-hosted PgBouncer
zaroori nahi — ye ek service ki tarah aapke database ke saamne baithta
hai, aur aapka app ise ek raw database connection ke bajaye HTTP ke
through baat karta hai, jo ise Edge runtime ke saath bhi compatible
banata hai (jo traditional database connections ko usi tarah hold nahi
kar sakta jaise Node.js kar sakta hai). Self-hosted PgBouncer aur ek
managed service jaise Accelerate ke beech choose karna operational hai
(kaun infrastructure manage karta hai) us underlying problem mein ek
difference ke bajaye jo solve kiya ja raha hai.`,

    examples: [
      {
        title: 'Singleton Prisma Client versus a naive per-request instantiation',
        titleHi: 'Singleton Prisma Client versus ek naive per-request instantiation',
        codeJs: `// lib/prisma.js — the singleton pattern, safe for both dev and production
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// app/api/users/route.js — every route imports the SAME shared instance
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany(); // reuses the existing connection
  return Response.json(users);
}

// A connection string configured to go through a pooler, not the raw database
// DATABASE_URL="postgresql://user:pass@pooler-host:6543/db?pgbouncer=true"`,
        codeTs: `// lib/prisma.ts — the singleton pattern, safe for both dev and production
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// app/api/users/route.ts — every route imports the SAME shared instance
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany(); // reuses the existing connection
  return Response.json(users);
}

// A connection string configured to go through a pooler, not the raw database
// DATABASE_URL="postgresql://user:pass@pooler-host:6543/db?pgbouncer=true"`,
        code: `const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}`,
        output:
          "Every route handler across the app imports the same 'prisma' export, meaning one function instance opens at most one database connection regardless of how many requests it handles over its lifetime — the multi-instance problem is then addressed separately at the connection string / pooler level.",
        explain:
          "Storing the client on globalThis specifically survives Next.js's dev-mode hot module reloading, which would otherwise create a new PrismaClient (and a new connection) on every file save — a common source of 'too many connections' errors during local development specifically.",
        explainHi:
          "Client ko globalThis pe store karna specifically Next.js ke dev-mode hot module reloading ko survive karta hai, jo warna har file save pe ek naya PrismaClient (aur ek naya connection) banata — local development ke dauran specifically 'too many connections' errors ka ek common source.",
      },
    ],

    mistakes: [
      {
        wrong: `// A new PrismaClient created inside every single request handler
export async function GET() {
  const prisma = new PrismaClient(); // NEW connection attempt every call
  const users = await prisma.user.findMany();
  await prisma.$disconnect(); // even with cleanup, this pattern doesn't scale
  return Response.json(users);
}`,
        right: `// One shared client instance, imported wherever needed
import { prisma } from '@/lib/prisma'; // singleton, defined once

export async function GET() {
  const users = await prisma.user.findMany(); // reuses the shared connection
  return Response.json(users);
}`,
        why: "Creating a new PrismaClient per request means every single request attempts to open its own database connection, and under any real concurrent load this can exceed the database's connection limit almost immediately — regardless of how carefully each individual connection is cleaned up afterward.",
        whyHi:
          "Per request ek naya PrismaClient banana matlab hai har single request apna khud ka database connection kholne ki koshish karta hai, aur kisi bhi real concurrent load ke andar ye database ki connection limit ko almost immediately exceed kar sakta hai, chahe har individual connection ko baad mein kitni bhi carefully clean up kiya jaaye.",
      },
    ],

    realWorld: [
      {
        en: "A Next.js app deployed on Vercel serverless functions, backed by a managed PostgreSQL database, virtually always configures its DATABASE_URL to point at a connection pooler (PgBouncer, Supabase's built-in pooler, or Prisma Accelerate) rather than the raw database port — the singleton client pattern alone is necessary but insufficient once real traffic spins up many concurrent function instances.",
        hi: 'Ek Next.js app jo Vercel serverless functions pe deployed hai, ek managed PostgreSQL database se backed, virtually hamesha apna DATABASE_URL ek connection pooler (PgBouncer, Supabase ka built-in pooler, ya Prisma Accelerate) ki taraf point karne ke liye configure karta hai raw database port ke bajaye — akela singleton client pattern zaroori hai par insufficient hai jab real traffic kai concurrent function instances spin up karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does serverless deployment create a database connection problem that a traditional long-running server does not have?',
        qHi: 'Serverless deployment ek database connection problem kyun create karta hai jo ek traditional long-running server ke paas nahi hoti?',
        a: "A traditional server opens a small, stable number of connections once and reuses them for its entire lifetime. A serverless platform can spin up many separate function instances simultaneously under load, and if each opens its own database connection, the total can far exceed what the database's connection limit allows — even though each individual instance is behaving reasonably on its own.",
        aHi: 'Ek traditional server ek chhoti, stable number ki connections ek baar kholta hai aur unhe apni poori lifetime ke liye reuse karta hai. Ek serverless platform load ke andar simultaneously kai separate function instances spin up kar sakta hai, aur agar har ek apna khud ka database connection kholta hai, total database ki connection limit jo allow karti hai usse kaafi zyada ho sakta hai — chahe har individual instance apne aap mein reasonably behave kar raha ho.',
      },
      {
        q: 'Is reusing a singleton Prisma Client per function instance sufficient to solve connection exhaustion on serverless?',
        qHi: 'Kya per function instance ek singleton Prisma Client reuse karna serverless pe connection exhaustion solve karne ke liye sufficient hai?',
        a: "It's necessary but not sufficient. It correctly avoids opening a new connection per request within a single instance, but a platform can still spin up many separate instances simultaneously, each with its own single connection — a connection pooler (PgBouncer, or a managed service like Prisma Accelerate) is needed to bound the total connection count across all instances.",
        aHi: 'Ye zaroori hai par sufficient nahi. Ye correctly ek single instance ke andar per request ek naya connection kholne se avoid karta hai, par ek platform abhi bhi simultaneously kai separate instances spin up kar sakta hai, har ek apne khud ke single connection ke saath — ek connection pooler (PgBouncer, ya ek managed service jaise Prisma Accelerate) chahiye total connection count ko sab instances ke across bound karne ke liye.',
      },
    ],

    exercises: [
      {
        task: "A team deploys their Next.js app to serverless functions, uses the singleton PrismaClient pattern correctly, and still sees 'too many connections' errors during traffic spikes. Diagnose what's still missing and propose a fix.",
        taskHi: 'Ek team apna Next.js app serverless functions pe deploy karti hai, singleton PrismaClient pattern correctly use karti hai, aur phir bhi traffic spikes ke dauran \'too many connections\' errors dekhti hai. Diagnose karo abhi kya missing hai aur ek fix propose karo.',
        hint: "The singleton pattern only bounds connections PER function instance — think about what happens when the platform runs many instances at once.",
        hintHi: 'Singleton pattern sirf PER function instance connections ko bound karta hai — socho ki kya hota hai jab platform ek saath kai instances chalata hai.',
      },
    ],

    keyTakeaways: [
      "A traditional long-running server opens a small, stable number of database connections once; a serverless platform can spin up many separate function instances simultaneously under load, each potentially opening its own connection.",
      "Creating a new PrismaClient per request is the core mistake to avoid — a singleton pattern (stored on globalThis to survive dev-mode hot reloads) reuses one connection per function instance instead.",
      'The singleton pattern is necessary but not sufficient on serverless, since many separate instances can still exist simultaneously, each with its own connection — a connection pooler (PgBouncer) bounds the total real database connections regardless of how many application instances are running.',
      'Prisma Accelerate is a managed alternative to self-hosting a pooler, communicating over HTTP rather than a raw database connection, which is also what makes it compatible with the Edge runtime.',
    ],
    keyTakeawaysHi: [
      'Ek traditional long-running server database connections ki ek chhoti, stable number ek baar kholta hai; ek serverless platform load ke andar simultaneously kai separate function instances spin up kar sakta hai, har ek potentially apna khud ka connection kholte hue.',
      'Per request ek naya PrismaClient banana avoid karne wali core mistake hai — ek singleton pattern (globalThis pe stored dev-mode hot reloads survive karne ke liye) iske bajaye per function instance ek connection reuse karta hai.',
      'Singleton pattern serverless pe zaroori hai par sufficient nahi, kyunki kai separate instances abhi bhi simultaneously exist kar sakte hain, har ek apne khud ke connection ke saath — ek connection pooler (PgBouncer) total real database connections ko bound karta hai chahe kitne bhi application instances chal rahe hon.',
      'Prisma Accelerate ek pooler ko self-host karne ka ek managed alternative hai, HTTP ke through communicate karte hue ek raw database connection ke bajaye, jo ise Edge runtime ke saath bhi compatible banata hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-prisma-n-plus-one',
    title: 'Avoiding N+1 Queries With Prisma',
    titleHi: 'Prisma Ke Saath N+1 Queries Avoid Karna',
    description:
      "Fetching a list of items and then querying each item's related data separately, one query per item, turns what should be 1-2 database round-trips into N+1 — a pattern that's easy to write by accident and gets dramatically worse as the list grows.",
    descriptionHi:
      'Ek items ki list fetch karna aur phir har item ka related data alag se query karna, ek item pe ek query, 1-2 database round-trips ko N+1 mein badal deta hai — ek pattern jo accident se likhna aasan hai aur list badhne ke saath dramatically kharab hota jata hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: "**Asking a librarian for a list of 50 books, then walking back to the desk 50 separate times to ask about each book's author, instead of asking once for the books with their authors already attached.** Getting the list of 50 books is one trip. Making 50 additional individual trips back to the desk — one per book, to ask 'who wrote this one' — turns a single reasonable errand into 51 trips. A librarian who can hand you all 50 books WITH their author information already noted alongside each one collapses this back down to one trip, no matter how many books are on the list.",
      hi: 'Ek librarian se 50 books ki ek list maangna, phir 50 separate baar desk pe wapas walk karna har book ke author ke baare mein poochhne ke liye, ek baar books ko unke authors ke saath already attached maangne ke bajaye. 50 books ki list milna ek trip hai. 50 additional individual trips wapas desk tak karna — har book ke liye ek, "isse kisne likha" poochhne ke liye — ek single reasonable errand ko 51 trips mein badal deta hai. Ek librarian jo aapko saari 50 books de sakta hai unki author information ke saath already har ek ke saath noted, ise wapas ek trip mein collapse kar deta hai, list mein kitni bhi books hon.',
    },

    simple: `**The N+1 trap: fetching a list (1 query), then fetching each item's
related data in a loop (N more queries) — total: N+1 queries for what
should be 1 or 2:**

\`\`\`ts
// WRONG: 1 query for posts, then 1 MORE query PER post for its author
const posts = await prisma.post.findMany(); // query #1
for (const post of posts) {
  post.author = await prisma.user.findUnique({ where: { id: post.authorId } });
  // query #2, #3, #4, ... #(N+1) — one per post, in a loop
}
// 100 posts -> 101 total database round-trips
\`\`\`

**The fix: Prisma's \`include\` fetches related data in the SAME query
(or a small, fixed number of queries), regardless of list size:**

\`\`\`ts
// RIGHT: exactly 1-2 queries total, no matter how many posts there are
const posts = await prisma.post.findMany({
  include: { author: true }, // fetches each post's author alongside it
});
// 100 posts -> still just 1-2 total database round-trips
\`\`\`

**Why this matters far more than it might seem:** the cost of the wrong
version doesn't scale linearly in a forgiving way — it scales linearly in
the WORST way, since every additional item in the list means one more
full network round-trip to the database. A page that feels instant with
10 test records in a local database can become unusably slow with 10,000
real records in production, and the bug is invisible in code review unless
you specifically know to look for a query inside a loop.

**\`include\` versus \`select\`:** \`include\` adds a relation alongside the
default fields; \`select\` lets you specify exactly which fields (including
nested relation fields) to fetch, which additionally avoids pulling back
columns you don't actually need — useful once a table has many columns and
a specific page only needs a few of them.`,

    simpleHi: `**N+1 trap: ek list fetch karna (1 query), phir har item ka related
data ek loop mein fetch karna (N aur queries) — total: N+1 queries jahan
1 ya 2 hone chahiye the:**

\`\`\`ts
// GALAT: posts ke liye 1 query, phir har post ke author ke liye 1 AUR query
const posts = await prisma.post.findMany(); // query #1
for (const post of posts) {
  post.author = await prisma.user.findUnique({ where: { id: post.authorId } });
  // query #2, #3, #4, ... #(N+1) — ek per post, ek loop mein
}
// 100 posts -> 101 total database round-trips
\`\`\`

**Fix: Prisma ka \`include\` related data ko WAHI query mein fetch karta
hai (ya ek chhoti, fixed number ki queries mein), list size se independent:**

\`\`\`ts
// SAHI: exactly 1-2 total queries, chahe kitne bhi posts hon
const posts = await prisma.post.findMany({
  include: { author: true }, // har post ke author ko uske saath fetch karta hai
});
// 100 posts -> abhi bhi bas 1-2 total database round-trips
\`\`\`

**Ye jitna lagta hai usse kaafi zyada kyun matter karta hai:** galat
version ki cost ek forgiving tarike se linearly scale nahi hoti — ye WORST
tarike se linearly scale hoti hai, kyunki list mein har additional item
matlab hai database tak ek aur poora network round-trip. Ek page jo local
database mein 10 test records ke saath instant feel karta hai production
mein 10,000 real records ke saath unusably slow ho sakta hai, aur bug code
review mein invisible hai jab tak aap specifically ek loop ke andar ek
query dhundhna na jaante ho.

**\`include\` versus \`select\`:** \`include\` default fields ke saath ek
relation add karta hai; \`select\` aapko exactly specify karne deta hai
kaunse fields (nested relation fields samet) fetch karne hain, jo
additionally un columns ko pull back karne se avoid karta hai jo aapko
actually nahi chahiye — useful ek baar jab ek table mein kai columns hon
aur ek specific page ko unme se sirf kuch hi chahiye.`,

    content: `## Why N+1 is so easy to write without noticing

The buggy version isn't obviously wrong when reading it in isolation —
"loop over the posts, fetch each one's author" reads like completely
ordinary, reasonable code. The problem only becomes visible when you think
in terms of DATABASE ROUND-TRIPS rather than lines of code: each iteration
of that loop is a full network request to the database, and a for-loop
around an \`await\` inside it is exactly the shape that produces N sequential
round-trips instead of one.

## Why this specifically gets worse in production, not better

A local development database, often running on the same machine as the
application, has near-zero network latency per query — so even 101
sequential queries might complete quickly enough that the bug goes
unnoticed during development. A production database is typically a
separate network hop away, where per-query latency (even a few
milliseconds) compounds directly with query COUNT. This is precisely why
N+1 bugs are so often caught only in production, under real data volumes,
rather than during development against a small local dataset — it's not
that the bug behaves differently, it's that the cost per query differs by
orders of magnitude between environments.

## \`include\` versus a manual join, and why Prisma's approach still works

Under the hood, Prisma's \`include\` for a to-one relation)often actually
executes as one query with a JOIN, or as two queries (posts, then all
relevant authors in one \`WHERE id IN (...)\` query) — the specific
implementation detail matters less than the guarantee: the number of
database round-trips stays constant (a small fixed number) regardless of
how many posts are returned, which is the property that actually matters
for avoiding the N+1 problem.

## Nested and deep includes

\`include\` can nest arbitrarily deep (a post's author's own profile, say),
and Prisma continues to batch these efficiently rather than compounding
into N+1 at each level — but genuinely deep, wide includes DO pull back
more total data in each query, so the fix for N+1 (fetching everything
needed up front) still needs to be balanced against only including
relations a given page actually displays, using \`select\` to narrow fields
further when a table has many columns you don't need.`,

    contentHi: `## N+1 bina notice kiye likhna itna aasan kyun hai

Buggy version isolation mein padhte waqt obviously galat nahi lagta —
"posts pe loop karo, har ek ka author fetch karo" poori tarah ordinary,
reasonable code jaisa padhta hai. Problem sirf tab visible hota hai jab
aap lines of code ke bajaye DATABASE ROUND-TRIPS ke terms mein sochte ho:
us loop ki har iteration database ko ek poori network request hai, aur
uske andar ek \`await\` ke around ek for-loop exactly wahi shape hai jo
ek ke bajaye N sequential round-trips produce karti hai.

## Ye production mein specifically kyun kharab hota hai, behtar nahi

Ek local development database, aksar application ke saath wahi machine
pe chalta hai, per query near-zero network latency rakhta hai — isliye
101 sequential queries bhi itni jaldi complete ho sakti hain ki bug
development ke dauran unnoticed reh jaaye. Ek production database
typically ek separate network hop dur hota hai, jahan per-query latency
(kuch milliseconds bhi) directly query COUNT ke saath compound hoti hai.
Yahi precisely wajah hai ki N+1 bugs itni baar sirf production mein catch
hote hain, real data volumes ke andar, ek chhote local dataset ke against
development ke dauran nahi — ye nahi ki bug differently behave karta hai,
ye ki per query cost environments ke beech orders of magnitude se differ
karti hai.

## \`include\` versus ek manual join, aur Prisma ka approach abhi bhi kyun kaam karta hai

Under the hood, Prisma ka \`include\` ek to-one relation ke liye aksar
actually ek query ki tarah ek JOIN ke saath execute hota hai, ya do
queries ki tarah (posts, phir sab relevant authors ek \`WHERE id IN (...)\`
query mein) — specific implementation detail us guarantee se kam matter
karta hai: database round-trips ki number constant rehti hai (ek chhoti
fixed number) chahe kitne bhi posts return hon, jo wo property hai jo
actually N+1 problem avoid karne ke liye matter karti hai.

## Nested aur deep includes

\`include\` arbitrarily deep nest ho sakta hai (ek post ke author ka apna
profile, maan lo), aur Prisma inhe efficiently batch karte rehta hai har
level pe N+1 mein compound hone ke bajaye — par genuinely deep, wide
includes har query mein zyada total data pull back KARTE hain, isliye N+1
ka fix (upfront chahiye sab kuch fetch karna) abhi bhi sirf un relations
ko include karne ke against balance karna chahiye jo ek given page actually
display karta hai, \`select\` use karte hue fields ko aur narrow karne ke
liye jab ek table mein kai columns hon jo aapko nahi chahiye.`,

    examples: [
      {
        title: 'N+1 versus a single batched query, with a nested include',
        titleHi: 'N+1 versus ek single batched query, ek nested include ke saath',
        codeJs: `// WRONG: N+1 — one query for posts, one more per post for its comments count
async function getPostsWithCommentCounts() {
  const posts = await prisma.post.findMany();
  const results = [];
  for (const post of posts) {
    const commentCount = await prisma.comment.count({ where: { postId: post.id } });
    results.push({ ...post, commentCount });
  }
  return results; // 100 posts -> 101 queries
}

// RIGHT: a single query using Prisma's _count feature
async function getPostsWithCommentCounts() {
  const posts = await prisma.post.findMany({
    include: { _count: { select: { comments: true } } },
  });
  return posts; // 100 posts -> 1 query, each post.__count.comments already populated
}

// RIGHT: nested include — post, author, AND the author's profile, still batched
async function getPostsWithAuthorProfiles() {
  return prisma.post.findMany({
    include: { author: { include: { profile: true } } },
  }); // still a small, fixed number of queries regardless of post count
}`,
        codeTs: `// WRONG: N+1 — one query for posts, one more per post for its comments count
async function getPostsWithCommentCounts() {
  const posts = await prisma.post.findMany();
  const results = [];
  for (const post of posts) {
    const commentCount = await prisma.comment.count({ where: { postId: post.id } });
    results.push({ ...post, commentCount });
  }
  return results; // 100 posts -> 101 queries
}

// RIGHT: a single query using Prisma's _count feature
async function getPostsWithCommentCounts() {
  const posts = await prisma.post.findMany({
    include: { _count: { select: { comments: true } } },
  });
  return posts; // 100 posts -> 1 query, each post._count.comments already populated
}

// RIGHT: nested include — post, author, AND the author's profile, still batched
async function getPostsWithAuthorProfiles() {
  return prisma.post.findMany({
    include: { author: { include: { profile: true } } },
  }); // still a small, fixed number of queries regardless of post count
}`,
        code: `async function getPostsWithCommentCounts() {
  const posts = await prisma.post.findMany({
    include: { _count: { select: { comments: true } } },
  });
  return posts;
}`,
        output:
          "The N+1 version issues 101 total queries for 100 posts, with latency scaling directly with post count. The _count version issues exactly one query regardless of whether there are 10 posts or 10,000.",
        explain:
          "Prisma's _count feature computes the related comment count as part of the single findMany query, entirely avoiding the loop-with-a-query-inside pattern — this is the general shape of the fix: express what you need as a richer single query rather than a loop of individually simpler ones.",
        explainHi:
          "Prisma ka _count feature related comment count ko single findMany query ke hisse ki tarah compute karta hai, poori tarah us loop-with-a-query-inside pattern ko avoid karte hue — ye fix ki general shape hai: jo chahiye use ek richer single query ki tarah express karo individually simpler ones ke ek loop ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// A query inside a loop — the classic N+1 shape
const orders = await prisma.order.findMany();
for (const order of orders) {
  order.items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
}`,
        right: `// One query, with the relation included
const orders = await prisma.order.findMany({
  include: { items: true },
});`,
        why: "Any await inside a for-loop that queries the database is a strong signal of the N+1 pattern — the fix is almost always to express the same requirement as a single query with include (or a batched query using WHERE id IN (...)), so the round-trip count stays constant regardless of list size.",
        whyHi:
          "Kisi bhi for-loop ke andar ek await jo database query karta hai N+1 pattern ka ek strong signal hai — fix almost hamesha wahi requirement ko ek single query ki tarah include ke saath express karna hai (ya ek batched query WHERE id IN (...) use karke), taaki round-trip count list size se independent constant rahe.",
      },
    ],

    realWorld: [
      {
        en: "A dashboard page listing a company's 500 employees, each with a small avatar and their manager's name, would be a textbook N+1 bug if written as 'fetch employees, then loop to fetch each one's manager' — the correct version fetches all 500 employees with their managers included in one query, keeping page load time roughly constant whether the company has 50 or 5,000 employees.",
        hi: 'Ek dashboard page jo ek company ke 500 employees list karta hai, har ek ek chhote avatar aur unke manager ke naam ke saath, ek textbook N+1 bug hota agar \'employees fetch karo, phir har ek ka manager fetch karne ke liye loop karo\' ki tarah likha jaata — correct version saare 500 employees ko unke managers included ke saath ek query mein fetch karta hai, page load time ko roughly constant rakhte hue chahe company mein 50 employees hon ya 5,000.',
      },
    ],

    interviewQA: [
      {
        q: "Why is the N+1 query pattern particularly dangerous to leave unnoticed?",
        qHi: 'N+1 query pattern ko unnoticed chhodna particularly dangerous kyun hai?',
        a: "Because its cost scales directly with the size of the list — it might be barely noticeable with 10 records in a local development database, but becomes severely slow with thousands of records in production, exactly the environment where per-query network latency also tends to be higher. The bug is easy to miss in code review unless you specifically recognize the query-inside-a-loop shape.",
        aHi: 'Kyunki iski cost directly list ke size ke saath scale hoti hai — ye local development database mein 10 records ke saath barely noticeable ho sakta hai, par production mein hazaron records ke saath severely slow ho jata hai, exactly wo environment jahan per-query network latency bhi usually zyada hoti hai. Bug code review mein miss karna aasan hai jab tak aap specifically query-inside-a-loop shape ko recognize na karo.',
      },
      {
        q: 'How does Prisma\'s include solve the N+1 problem?',
        qHi: 'Prisma ka include N+1 problem kaise solve karta hai?',
        a: "It fetches the related data as part of the same query (or a small, fixed number of additional queries, often using a batched WHERE id IN (...) lookup) rather than issuing one separate query per item in a loop — the number of database round-trips stays constant regardless of how many items are in the list.",
        aHi: 'Ye related data ko wahi query ke hisse ki tarah fetch karta hai (ya ek chhoti, fixed number ki additional queries, aksar ek batched WHERE id IN (...) lookup use karte hue) ek loop mein per item ek separate query issue karne ke bajaye — database round-trips ki number constant rehti hai list mein kitne bhi items hon.',
      },
    ],

    exercises: [
      {
        task: "A function fetches all comments on a blog post, then loops through them to fetch each commenter's display name and avatar separately. Rewrite it to avoid N+1, and explain what changes as the comment count grows from 10 to 10,000.",
        taskHi: 'Ek function ek blog post ke saare comments fetch karta hai, phir unke through loop karta hai har commenter ka display name aur avatar alag se fetch karne ke liye. Ise N+1 avoid karne ke liye rewrite karo, aur explain karo kya badalta hai jab comment count 10 se 10,000 tak badhta hai.',
        hint: "Prisma's include for the commenter relation should let you fetch comments and their authors in one shot.",
        hintHi: 'Commenter relation ke liye Prisma ka include aapko comments aur unke authors ek shot mein fetch karne dena chahiye.',
      },
    ],

    keyTakeaways: [
      "The N+1 pattern — one query for a list, then one more query per item to fetch related data in a loop — turns what should be a constant number of database round-trips into a number that grows linearly with list size.",
      'Prisma\'s include (or _count for aggregates) fetches related data as part of the same query or a small, fixed number of batched queries, keeping round-trip count constant regardless of how many items are returned.',
      'N+1 bugs are often invisible during local development (near-zero network latency to a local database) and only become apparent in production, where both real data volume and real network latency compound the cost.',
      "A query inside a for-loop is a strong, recognizable signal to look for the N+1 pattern specifically and check whether the loop's work can be expressed as a single richer query instead.",
    ],
    keyTakeawaysHi: [
      'N+1 pattern — ek list ke liye ek query, phir related data fetch karne ke liye ek loop mein per item ek aur query — ek constant number of database round-trips hona chahiye tha use list size ke saath linearly badhne wali ek number mein badal deta hai.',
      'Prisma ka include (ya aggregates ke liye _count) related data ko wahi query ke hisse ki tarah ya ek chhoti, fixed number ki batched queries ki tarah fetch karta hai, round-trip count ko constant rakhte hue chahe kitne bhi items return hon.',
      'N+1 bugs aksar local development ke dauran invisible hote hain (local database tak near-zero network latency) aur sirf production mein apparent hote hain, jahan real data volume aur real network latency dono cost ko compound karte hain.',
      'Ek for-loop ke andar ek query N+1 pattern ko specifically dhundhne ke liye ek strong, recognizable signal hai aur check karne ke liye ki kya loop ka kaam ek single richer query ki tarah express kiya ja sakta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-transactions-in-server-actions',
    title: 'Transactions Inside Server Actions',
    titleHi: 'Server Actions Ke Andar Transactions',
    description:
      "When a single logical operation requires multiple database writes, a failure partway through can leave the database in an inconsistent, half-completed state unless all the writes are wrapped in a transaction that guarantees they all succeed together or all fail together.",
    descriptionHi:
      'Jab ek single logical operation ko multiple database writes chahiye, beech mein ek failure database ko ek inconsistent, half-completed state mein chhod sakta hai jab tak saare writes ek transaction mein wrap na hon jo guarantee kare ki wo sab saath succeed karein ya sab saath fail hon.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: "**A bank transferring money between two accounts, versus a power outage happening between debiting one account and crediting the other.** A transfer is really two separate steps: subtract from account A, add to account B. If a system crash happens between these two steps — after subtracting but before adding — the money has simply vanished from the world, existing in neither account. A transaction is the bank's guarantee that these two steps happen as one indivisible unit: either both complete, or neither does, with no possible in-between state where the money is nowhere.",
      hi: 'Ek bank do accounts ke beech paisa transfer kar raha hai, versus ek power outage jo ek account debit karne aur doosre ko credit karne ke beech hota hai. Ek transfer really do separate steps hai: account A se subtract karo, account B mein add karo. Agar ek system crash in do steps ke beech hota hai — subtract karne ke baad par add karne se pehle — paisa simply duniya se vanish ho gaya, kisi bhi account mein exist nahi karta. Ek transaction bank ka guarantee hai ki ye do steps ek indivisible unit ki tarah hote hain: ya to dono complete hote hain, ya koi nahi, koi possible in-between state nahi jahan paisa kahin nahi hai.',
    },

    simple: `**The danger without a transaction — a failure partway through leaves
inconsistent data:**

\`\`\`ts
// DANGEROUS: two separate writes, no guarantee both succeed together
async function placeOrder(userId: string, items: OrderItem[]) {
  const order = await prisma.order.create({ data: { userId, items } });
  await prisma.inventory.updateMany({
    where: { productId: { in: items.map((i) => i.productId) } },
    data: { stock: { decrement: 1 } },
  }); // if THIS fails (network blip, server crash), the order above
      // already exists, but inventory was never decremented — a real,
      // committed inconsistency, not a "retry and it's fine" bug
}
\`\`\`

**The fix — wrap related writes in \`prisma.$transaction\`:**

\`\`\`ts
async function placeOrder(userId: string, items: OrderItem[]) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({ data: { userId, items } });
    await tx.inventory.updateMany({
      where: { productId: { in: items.map((i) => i.productId) } },
      data: { stock: { decrement: 1 } },
    });
    return order;
    // If ANYTHING inside this function throws, the ENTIRE transaction
    // rolls back — the order creation above is undone too, as if
    // neither write had ever been attempted.
  });
}
\`\`\`

**The rule for when a transaction is actually needed:** ask "if the SECOND
write fails after the first one succeeded, would the database be left in
a state that's actually wrong?" If yes — the order exists but inventory
wasn't decremented, a payment was recorded but the subscription wasn't
activated — the writes belong in one transaction. If the two writes are
genuinely independent (updating a user's last-login timestamp and,
separately, logging an analytics event) a partial failure isn't actually a
correctness problem, and wrapping them in a transaction adds complexity
without a real benefit.`,

    simpleHi: `**Bina transaction ke danger — beech mein ek failure inconsistent data
chhod deti hai:**

\`\`\`ts
// DANGEROUS: do separate writes, koi guarantee nahi ki dono saath succeed karein
async function placeOrder(userId: string, items: OrderItem[]) {
  const order = await prisma.order.create({ data: { userId, items } });
  await prisma.inventory.updateMany({
    where: { productId: { in: items.map((i) => i.productId) } },
    data: { stock: { decrement: 1 } },
  }); // agar YE fail hoti hai (network blip, server crash), upar wala
      // order already exist karta hai, par inventory kabhi decrement
      // nahi hui — ek real, committed inconsistency, "retry aur ye
      // theek hai" bug nahi
}
\`\`\`

**Fix — related writes ko \`prisma.$transaction\` mein wrap karo:**

\`\`\`ts
async function placeOrder(userId: string, items: OrderItem[]) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({ data: { userId, items } });
    await tx.inventory.updateMany({
      where: { productId: { in: items.map((i) => i.productId) } },
      data: { stock: { decrement: 1 } },
    });
    return order;
    // Agar is function ke andar KUCH BHI throw karta hai, POORA
    // transaction rollback ho jata hai — upar ki order creation bhi
    // undo ho jaati hai, jaise koi bhi write kabhi attempt hi nahi
    // kiya gaya ho.
  });
}
\`\`\`

**Ek transaction actually kab chahiye iski rule:** poochho "agar SECOND
write fail hoti hai pehli ke succeed hone ke baad, kya database ek aisi
state mein reh jaayega jo actually galat hai?" Agar haan — order exist
karta hai par inventory decrement nahi hui, ek payment record hui par
subscription activate nahi hua — writes ek transaction mein belong karte
hain. Agar do writes genuinely independent hain (ek user ka last-login
timestamp update karna aur, separately, ek analytics event log karna) ek
partial failure actually ek correctness problem nahi hai, aur unhe ek
transaction mein wrap karna bina real benefit ke complexity add karta hai.`,

    content: `## What "atomicity" actually guarantees

A database transaction's core guarantee is atomicity: every write inside
it either ALL commit together, or NONE of them do — there is no possible
outcome where some writes inside the transaction succeeded and others
didn't. If any statement inside the transaction throws (a constraint
violation, a network error, an explicit thrown error in your own code),
Prisma automatically rolls back every write that happened earlier in that
same transaction, leaving the database exactly as if the transaction had
never been attempted at all.

## Why "just retry the failed step" doesn't fix the underlying problem

It might seem like a failed second write could just be retried until it
succeeds. This doesn't actually restore correctness: between the first
write's success and the retry succeeding, the database is genuinely
inconsistent (an order that exists with no corresponding inventory
decrement), and anything reading the database during that window — another
request checking stock levels, a report calculating current inventory —
sees the wrong, half-completed picture. A transaction prevents this window
from ever existing in the first place, rather than trying to shrink or
recover from it after the fact.

## The performance cost of a transaction, and why it's usually worth it

A transaction typically holds a single database connection for its
entire duration and can hold row-level locks on the data it touches,
which is genuinely more expensive than issuing the same writes as
separate, unrelated statements. This cost is the correct trade for
operations where partial completion would be a real correctness bug — the
alternative (data corruption under concurrent load or partial failures) is
categorically worse than a small amount of added latency.

## Deciding what belongs inside one transaction, and what doesn't

The test from the Simple section — "would a partial failure leave the
database in a genuinely wrong state" — is the right question, not "are
these two things related in the business domain." Creating an order and
sending a confirmation email are related in the business sense, but a
failed email send doesn't leave the DATABASE inconsistent (the order is
still validly, correctly created) — so the email send typically happens
AFTER the transaction commits, as a separate step, rather than being
wrapped inside it (and definitely shouldn't be allowed to roll back a
successful order just because an email provider had a brief outage).`,

    contentHi: `## "Atomicity" actually kya guarantee karta hai

Ek database transaction ka core guarantee atomicity hai: uske andar har
write ya to SAB saath commit hote hain, ya UNME SE KOI bhi nahi hota —
koi possible outcome nahi hai jahan transaction ke andar kuch writes
succeed hue aur baaki nahi. Agar transaction ke andar koi bhi statement
throw karta hai (ek constraint violation, ek network error, aapke khud ke
code mein ek explicit thrown error), Prisma automatically har us write ko
rollback kar deta hai jo usi transaction mein pehle hua tha, database ko
exactly waisa chhodte hue jaise transaction kabhi attempt hi nahi kiya
gaya tha.

## "Bas failed step ko retry karo" underlying problem kyun fix nahi karta

Ye lag sakta hai ki ek failed second write ko bas tab tak retry kiya ja
sakta hai jab tak ye succeed na ho. Ye actually correctness restore nahi
karta: pehli write ke success aur retry ke succeed hone ke beech, database
genuinely inconsistent hai (ek order jo exist karta hai bina
corresponding inventory decrement ke), aur us window ke dauran database
padhne wali koi bhi cheez — ek doosri request jo stock levels check kar
rahi hai, ek report jo current inventory calculate kar raha hai — galat,
half-completed picture dekhti hai. Ek transaction is window ko pehli jagah
exist karne se hi rokta hai, iske baad ise shrink ya recover karne ki
koshish karne ke bajaye.

## Ek transaction ki performance cost, aur ye usually worth kyun hai

Ek transaction typically apni poori duration ke liye ek single database
connection hold karta hai aur us data pe row-level locks hold kar sakta
hai jise ye touch karta hai, jo genuinely usi writes ko separate,
unrelated statements ki tarah issue karne se zyada expensive hai. Ye cost
un operations ke liye sahi trade hai jahan partial completion ek real
correctness bug hoga — alternative (concurrent load ya partial failures
ke under data corruption) categorically worse hai thodi si added latency
se.

## Kya ek transaction ke andar belong karta hai, aur kya nahi decide karna

Simple section se test — "kya ek partial failure database ko genuinely
galat state mein chhod dega" — sahi sawaal hai, "kya ye do cheezein
business domain mein related hain" nahi. Ek order banana aur ek
confirmation email bhejna business sense mein related hain, par ek failed
email send DATABASE ko inconsistent nahi chhodta (order abhi bhi validly,
correctly created hai) — isliye email send typically transaction ke
commit hone ke BAAD hota hai, ek separate step ki tarah, uske andar wrap
hone ke bajaye (aur definitely ek successful order ko rollback nahi karna
chahiye sirf isliye kyunki ek email provider ka brief outage hua).`,

    examples: [
      {
        title: 'A checkout flow correctly split into what belongs in the transaction and what does not',
        titleHi: 'Ek checkout flow correctly split kiya gaya ki transaction mein kya belong karta hai aur kya nahi',
        codeJs: `'use server';

export async function checkout(userId, items) {
  // Everything where a partial failure would leave WRONG data goes inside:
  const order = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: { userId, items, status: 'PENDING' },
    });
    for (const item of items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (product.stock < item.quantity) {
        throw new Error(\`Insufficient stock for \${product.name}\`); // rolls back the whole transaction
      }
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
    return order;
  });

  // Sending a confirmation email does NOT need to roll back a valid order
  // if it fails — it happens after the transaction has already committed
  await sendOrderConfirmationEmail(order).catch((err) => {
    console.error('Email failed, but the order is still valid:', err);
  });

  return order;
}`,
        codeTs: `'use server';

interface OrderItem {
  productId: string;
  quantity: number;
}

export async function checkout(userId: string, items: OrderItem[]) {
  // Everything where a partial failure would leave WRONG data goes inside:
  const order = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: { userId, items, status: 'PENDING' },
    });
    for (const item of items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product || product.stock < item.quantity) {
        throw new Error(\`Insufficient stock for \${product?.name ?? item.productId}\`);
      }
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
    return order;
  });

  // Sending a confirmation email does NOT need to roll back a valid order
  // if it fails — it happens after the transaction has already committed
  await sendOrderConfirmationEmail(order).catch((err) => {
    console.error('Email failed, but the order is still valid:', err);
  });

  return order;
}`,
        code: `const order = await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: { userId, items, status: 'PENDING' } });
  await tx.product.update({ where: { id: productId }, data: { stock: { decrement: qty } } });
  return order;
});
await sendOrderConfirmationEmail(order).catch(logError);`,
        output:
          "If stock is insufficient partway through the loop, the thrown error rolls back the ENTIRE transaction — the order that was created earlier in the same transaction is undone too, leaving no trace of a half-completed checkout. If the email fails afterward, the already-committed order remains valid.",
        explain:
          "The order creation and inventory decrement are inside the transaction because a partial failure there (order exists, stock unchanged) would be a genuine data-correctness bug. The email send is deliberately outside the transaction because a failed email doesn't make the order itself incorrect — it would be wrong to discard a valid order just because a notification failed to send.",
        explainHi:
          "Order creation aur inventory decrement transaction ke andar hain kyunki wahan ek partial failure (order exist karta hai, stock unchanged) ek genuine data-correctness bug hoga. Email send deliberately transaction ke bahar hai kyunki ek failed email order ko khud incorrect nahi banata — ek valid order ko discard karna galat hoga sirf isliye kyunki ek notification bhejne mein fail hui.",
      },
    ],

    mistakes: [
      {
        wrong: `// Two related writes with NO transaction — a crash between them corrupts data
async function transferCredits(fromUserId, toUserId, amount) {
  await prisma.user.update({
    where: { id: fromUserId },
    data: { credits: { decrement: amount } },
  });
  // If the process crashes HERE, credits vanished from fromUserId
  // and were never added to toUserId — real, permanent data loss.
  await prisma.user.update({
    where: { id: toUserId },
    data: { credits: { increment: amount } },
  });
}`,
        right: `// Wrapped in a transaction — both succeed together, or neither does
async function transferCredits(fromUserId, toUserId, amount) {
  await prisma.$transaction([
    prisma.user.update({ where: { id: fromUserId }, data: { credits: { decrement: amount } } }),
    prisma.user.update({ where: { id: toUserId }, data: { credits: { increment: amount } } }),
  ]);
}`,
        why: "Without a transaction, a crash or error between the two updates leaves credits permanently deducted from one account without ever being added to the other — real, unrecoverable data corruption, not a transient glitch that a retry would fix, since the first write already committed successfully on its own.",
        whyHi:
          "Bina ek transaction ke, do updates ke beech ek crash ya error credits ko permanently ek account se deduct chhod deta hai bina unhe kabhi doosre mein add kiye — real, unrecoverable data corruption, koi transient glitch nahi jise ek retry fix kar dega, kyunki pehli write already apne aap successfully commit ho chuki thi.",
      },
    ],

    realWorld: [
      {
        en: "A ride-sharing app's payment settlement (charging the rider, crediting the driver, marking the ride complete) is universally wrapped in a database transaction — a partial failure that charged the rider without crediting the driver or marking the ride complete would be a serious, real-money accounting bug, not a cosmetic glitch.",
        hi: 'Ek ride-sharing app ka payment settlement (rider ko charge karna, driver ko credit karna, ride ko complete mark karna) universally ek database transaction mein wrap kiya jata hai — ek partial failure jo rider ko charge kare bina driver ko credit kiye ya ride ko complete mark kiye ek serious, real-money accounting bug hoga, koi cosmetic glitch nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What does a database transaction actually guarantee?',
        qHi: 'Ek database transaction actually kya guarantee karta hai?',
        a: "Atomicity — every write inside the transaction either all commit together, or none of them do. If any operation inside throws, every earlier write in that same transaction is rolled back, leaving the database exactly as if the transaction had never been attempted.",
        aHi: 'Atomicity — transaction ke andar har write ya to sab saath commit hote hain, ya unme se koi nahi. Agar andar koi bhi operation throw karta hai, usi transaction mein har earlier write rollback ho jaata hai, database ko exactly waisa chhodte hue jaise transaction kabhi attempt hi nahi kiya gaya tha.',
      },
      {
        q: 'How do you decide whether two related database writes need to be inside the same transaction?',
        qHi: 'Aap kaise decide karte ho ki kya do related database writes ko wahi transaction ke andar hona chahiye?',
        a: "Ask whether a failure of the second write, after the first one already succeeded, would leave the database in a genuinely incorrect state. If yes (an order exists with no corresponding inventory change), they belong in one transaction. If the two writes are independently valid even if one fails (a database update and a best-effort email notification), a transaction adds unnecessary cost without a real correctness benefit.",
        aHi: 'Poochho ki kya second write ki ek failure, pehli ke already succeed hone ke baad, database ko ek genuinely incorrect state mein chhod degi. Agar haan (ek order exist karta hai bina corresponding inventory change ke), wo ek transaction mein belong karte hain. Agar do writes independently valid hain chahe ek fail ho (ek database update aur ek best-effort email notification), ek transaction bina real correctness benefit ke unnecessary cost add karta hai.',
      },
    ],

    exercises: [
      {
        task: "A Server Action creates a new user account, creates a default 'personal' workspace for them, and sends a welcome email. Decide which of these three writes/actions belong inside one transaction and which should happen separately, and justify each decision.",
        taskHi: 'Ek Server Action ek naya user account banata hai, unke liye ek default \'personal\' workspace banata hai, aur ek welcome email bhejta hai. Decide karo in teen writes/actions mein se kaunse ek transaction ke andar belong karte hain aur kaunse alag se hone chahiye, aur har decision justify karo.',
        hint: "Ask, for each pair, whether one succeeding without the other would leave the database in a state that's actually wrong versus merely incomplete in a recoverable way.",
        hintHi: 'Har pair ke liye poochho ki kya ek doosre ke bina succeed hona database ko ek aisi state mein chhod dega jo actually galat hai versus sirf ek recoverable tarike se incomplete.',
      },
    ],

    keyTakeaways: [
      "A transaction guarantees atomicity: every write inside it either all commit together, or none do — if anything throws partway through, every earlier write in the same transaction is rolled back.",
      "Without a transaction, a failure between two related writes can leave the database in a genuinely inconsistent, incorrect state that a simple retry cannot fix, since the first write already committed on its own.",
      "The test for whether writes belong in one transaction: would a partial failure leave the database in a state that's actually wrong, not just whether the operations are related in the business domain.",
      'Operations where a failure is recoverable without leaving bad data (like sending a confirmation email after an order is created) typically happen outside the transaction, after it has already committed.',
    ],
    keyTakeawaysHi: [
      'Ek transaction atomicity guarantee karta hai: uske andar har write ya to sab saath commit hote hain, ya koi nahi — agar beech mein kuch bhi throw karta hai, usi transaction mein har earlier write rollback ho jaata hai.',
      'Bina ek transaction ke, do related writes ke beech ek failure database ko ek genuinely inconsistent, incorrect state mein chhod sakta hai jise ek simple retry fix nahi kar sakta, kyunki pehli write already apne aap commit ho chuki thi.',
      'Test ye ki kya writes ek transaction mein belong karte hain: kya ek partial failure database ko ek aisi state mein chhodega jo actually galat hai, sirf ye nahi ki kya operations business domain mein related hain.',
      'Operations jahan ek failure recoverable hai bina bad data chhode (jaise order create hone ke baad ek confirmation email bhejna) typically transaction ke bahar hote hain, iske already commit hone ke baad.',
    ],
  },
];
