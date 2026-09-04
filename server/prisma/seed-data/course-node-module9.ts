/**
 * Node.js Complete Course — Module 9: The Data Layer — ORMs & NoSQL, lesson 1.
 *
 * ORMs and query builders: the spectrum from raw driver -> query builder (Knex)
 * -> data-mapper/schema ORM (Prisma, Drizzle) -> active-record ORM (TypeORM,
 * Sequelize, Objection), what each buys and costs, schema + migration workflow,
 * modelling relations and eager-loading, the ORM N+1, the raw-SQL escape hatch,
 * and the repository pattern that keeps the ORM out of the rest of the codebase.
 *
 * DB-dependent — example `output` blocks describe the observed behaviour /
 * emitted SQL rather than machine-captured stdout (Node course convention).
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_9: CourseLesson[] = [
  {
    slug: 'orms-and-query-builders',
    title: 'ORMs & Query Builders: What They Buy, What They Cost',
    titleHi: 'ORMs Aur Query Builders: Kya Dete Hain, Kya Lete Hain',
    description: 'A list endpoint returns 50 posts in 8ms locally and 4 seconds in production. The ORM call looks innocent — `post.author.name` inside a `.map()` — but each access fires its own `SELECT`, so the page runs 51 queries against a database one network hop away.',
    descriptionHi: 'Ek list endpoint locally 8ms mein 50 posts return karta hai aur production mein 4 second. ORM call innocent dikhti hai — ek `.map()` ke andar `post.author.name` — par har access apna `SELECT` fire karta hai, to page ek database ke against 51 queries chalata hai jo ek network hop door hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**Three ways to order building materials for a construction site.** The raw driver is phoning the quarry directly and dictating exact quantities and grades — total control, and total responsibility for getting every number right and remembering what you already ordered. A query builder is a standard order form: you still choose every item and quantity, but the form fills in the boilerplate, catches obvious mistakes, and speaks the supplier\'s dialect for you — you are still thinking in materials, just not in raw phone calls. A full ORM is a project manager who takes "I need a two-storey house" and turns it into orders, schedules deliveries, and tracks what has arrived — enormous leverage when the job is standard, but the day you need a custom steel section the manager has never sourced, you are back on the phone to the quarry yourself, now also explaining to the manager what you did so its records stay straight. None of these is "best". The mistake is using the project manager for a job that was three phone calls, or dictating every rivet when a standard order form would have done — and, whichever you pick, not noticing that "add one more line to the order" quietly became fifty separate phone calls.',
      hi: '**Ek construction site ke liye building materials order karne ke teen tarike.** Raw driver seedhe quarry ko phone karna aur exact quantities aur grades dictate karna hai — poora control, aur har number sahi paane aur yaad rakhne ki poori zimmedaari ki aapne pehle kya order kiya. Ek query builder ek standard order form hai: aap abhi bhi har item aur quantity chunte ho, par form boilerplate bharta hai, obvious galtiyaan pakadta hai, aur aapke liye supplier ki dialect bolta hai. Ek poora ORM ek project manager hai jo "mujhe ek do-manzila ghar chahiye" leta hai aur ise orders mein badalta hai — bahut leverage jab kaam standard hai, par jis din aapko ek custom steel section chahiye jise manager ne kabhi source nahi kiya, aap khud wapas quarry ko phone par ho, ab manager ko bhi samjhaate hue ki aapne kya kiya. Inmein se koi "best" nahi hai. Galti project manager ko us kaam ke liye istemal karna hai jo teen phone calls tha — aur, aap jo bhi chuno, ye na dekhna ki "order mein ek aur line jodo" chupchaap pachaas alag phone calls ban gaya.',
    },

    simple: `**The spectrum — least to most abstraction**

\`\`\`
raw driver (pg, mysql2, mongodb)   you write SQL strings + placeholders. Full control, zero help.
query builder (Knex, Kysely)       you compose queries as method chains -> SQL. You still think in SQL.
schema ORM (Prisma, Drizzle)       a schema file is the source of truth; typed client; explicit relations.
active-record ORM (Sequelize,      model classes with .save()/.find(); relations as properties;
  TypeORM, Objection)              magic, and more to go wrong.
\`\`\`

**Raw driver — always parameterise**

\`\`\`js
import { Pool } from "pg";
const pool = new Pool();
const { rows } = await pool.query(
  "SELECT id, name FROM users WHERE org_id = $1 AND active = $2",   // $1, $2 placeholders
  [orgId, true],                                                     // values — never string-concatenated
);
\`\`\`

**Query builder (Knex) — composable, still explicit**

\`\`\`js
const users = await knex("users")
  .select("id", "name")
  .where({ org_id: orgId, active: true })
  .orderBy("name")
  .limit(20);
// -> select "id", "name" from "users" where "org_id" = ? and "active" = ? order by "name" limit ?
\`\`\`

**Schema ORM (Prisma) — schema is the source of truth**

\`\`\`prisma
model Post {
  id       Int     @id @default(autoincrement())
  title    String
  author   User    @relation(fields: [authorId], references: [id])
  authorId Int
}
\`\`\`
\`\`\`js
const posts = await prisma.post.findMany({
  where: { published: true },
  include: { author: { select: { name: true } } },   // <-- ONE query with a join, not N
  take: 20,
});
\`\`\`

**Migrations — the schema lives in version control, applied in order**

\`\`\`
prisma migrate dev --name add_post_slug     # generate + apply locally
prisma migrate deploy                        # apply pending migrations in prod (release step)
knex migrate:make add_post_slug / knex migrate:latest
\`\`\`

**The N+1 — the defining ORM performance bug**

\`\`\`js
const posts = await prisma.post.findMany({ take: 50 });        // 1 query
for (const p of posts) console.log((await p.author).name);     // + 50 queries  <-- N+1

// fix: eager-load the relation in the first query
const posts = await prisma.post.findMany({ take: 50, include: { author: true } });   // 1-2 queries
\`\`\`

**The escape hatch — drop to raw SQL for the 5% the ORM can't express**

\`\`\`js
const rows = await prisma.$queryRaw\`
  SELECT date_trunc('day', created_at) AS d, count(*) FROM events
  WHERE org_id = \${orgId} GROUP BY 1 ORDER BY 1\`;   // tagged template = parameterised
\`\`\``,

    simpleHi: `**Spectrum — kam se zyaada abstraction**

\`\`\`
raw driver (pg, mysql2, mongodb)   aap SQL strings + placeholders likhte ho. Poora control, zero help.
query builder (Knex, Kysely)       aap queries method chains ke roop mein compose karte ho -> SQL.
schema ORM (Prisma, Drizzle)       ek schema file source of truth hai; typed client; explicit relations.
active-record ORM (Sequelize,      .save()/.find() waale model classes; relations properties ke roop mein;
  TypeORM, Objection)              magic, aur zyaada galat hone ko.
\`\`\`

**Raw driver — hamesha parameterise karo**

\`\`\`js
import { Pool } from "pg";
const pool = new Pool();
const { rows } = await pool.query(
  "SELECT id, name FROM users WHERE org_id = $1 AND active = $2",
  [orgId, true],                                                     // values — kabhi string-concatenated nahi
);
\`\`\`

**Query builder (Knex) — composable, abhi bhi explicit**

\`\`\`js
const users = await knex("users").select("id", "name")
  .where({ org_id: orgId, active: true }).orderBy("name").limit(20);
\`\`\`

**Schema ORM (Prisma) — schema source of truth hai**

\`\`\`js
const posts = await prisma.post.findMany({
  where: { published: true },
  include: { author: { select: { name: true } } },   // <-- EK query ek join ke saath, N nahi
  take: 20,
});
\`\`\`

**Migrations — schema version control mein rehta hai, order mein applied**

\`\`\`
prisma migrate dev --name add_post_slug     # generate + apply locally
prisma migrate deploy                        # prod mein pending migrations apply (release step)
\`\`\`

**N+1 — defining ORM performance bug**

\`\`\`js
const posts = await prisma.post.findMany({ take: 50 });        // 1 query
for (const p of posts) console.log((await p.author).name);     // + 50 queries  <-- N+1

// fix: pehli query mein relation eager-load karo
const posts = await prisma.post.findMany({ take: 50, include: { author: true } });
\`\`\`

**Escape hatch — 5% ke liye raw SQL par jao jo ORM express nahi kar sakta**

\`\`\`js
const rows = await prisma.$queryRaw\`
  SELECT date_trunc('day', created_at) AS d, count(*) FROM events
  WHERE org_id = \${orgId} GROUP BY 1 ORDER BY 1\`;   // tagged template = parameterised
\`\`\``,

    content: `## The abstraction spectrum

Every data-access tool sits somewhere on a line from "you write the SQL" to "you never see the SQL", and each step trades control for convenience.

**Raw driver** (\`pg\`, \`mysql2\`, \`better-sqlite3\`, \`mongodb\`) — you send query strings and bound parameters, you get rows back. Maximum control and performance, zero help with composition, types, migrations, or mapping. Correct choice for a tiny service, a data pipeline, or a hot path you have hand-tuned.

**Query builder** (\`Knex\`, \`Kysely\`) — you build a query with a chainable API (\`.select().where().join()\`) that compiles to SQL for your dialect. You still think in relational terms and see the SQL; you gain composition (build a query in pieces, reuse fragments), parameterisation by default, and a migration runner. \`Kysely\` adds full type inference from your schema. No object mapping, no lazy relations, no magic.

**Schema-first ORM** (\`Prisma\`, \`Drizzle\`) — a schema definition (a \`.prisma\` file, or TypeScript objects for Drizzle) is the single source of truth; a code generator produces a fully typed client. Relations are explicit in every query (\`include\` / \`with\`). Prisma runs its own query engine and generates migrations from schema diffs; Drizzle is thin, close to SQL, and generates SQL migrations. These give you most of the safety of an ORM without most of the surprises.

**Active-record ORM** (\`Sequelize\`, \`TypeORM\`, \`Objection\`, \`MikroORM\`) — model classes with instance methods (\`user.save()\`, \`Post.findAll()\`), relations exposed as properties or association helpers, hooks/lifecycle callbacks, sometimes lazy loading. Maximum leverage for standard CRUD; the most behaviour hidden behind property access, the most ways for a config change to alter generated SQL, and the classic home of the N+1.

## What an ORM actually gives you

- **Mapping** — rows ↔ objects, snake_case ↔ camelCase, DB types ↔ JS types (dates, decimals, JSON, enums).
- **Composition & safety** — parameterised by construction, so a whole category of SQL-injection bugs cannot happen if you stay on the typed API.
- **Migrations** — schema changes as ordered, version-controlled, replayable files with up/down.
- **Relations** — declare once, then \`include\`/\`populate\`/\`with\` to load them; the ORM writes the join or the second query.
- **Types** (Prisma, Kysely, Drizzle) — the result shape of a query is inferred, so renaming a column is a compile error, not a runtime one.

## What it costs

- **A leaky abstraction.** You still must understand indexes, the query plan, transactions, and isolation — the ORM does not remove SQL, it postpones learning it, and it will eventually generate a query you must read the SQL to fix.
- **The N+1.** Convenient relation access (\`post.author\`, \`order.items\`) inside a loop fires one query per iteration unless you eager-load. This is *the* ORM performance bug (Module 3 in the Django course covers the same thing).
- **Generated SQL you did not choose.** Some ORMs load a to-many relation as a separate query with an \`IN (...)\` list, some as a join that multiplies rows; aggregates across two relations can double-count. You have to check the emitted SQL.
- **Migration drift and lock risk.** An auto-generated migration can propose a destructive or long-locking change (rewriting a big table, a blocking index build). Always read the generated SQL before applying it to production.
- **Weight.** A query engine, a client generator, a metadata layer — startup cost, memory, and a dependency that must track your database version.

## The N+1, concretely

\`\`\`js
// N+1: 1 query for posts, then 1 per post for its author
const posts = await Post.findAll({ limit: 50 });
const view = posts.map(p => ({ title: p.title, author: p.author.name /* lazy load */ }));
\`\`\`

Fixes, in order of preference:

1. **Eager-load** in the first query: \`include: { author: true }\` / \`.populate("author")\` / \`with: { author: true }\`.
2. **Select only what you need** — \`include: { author: { select: { name: true } } }\` — narrower rows, and it documents intent.
3. **Batch by hand** when the ORM can't: collect the author ids, one \`WHERE id IN (...)\`, build a map, attach.
4. **A DataLoader** for a GraphQL-style access pattern where the same relation is requested from many places per request.

The way you *catch* it: log every query in development (Prisma \`log: ["query"]\`, Sequelize \`logging: console.log\`, Knex \`.on("query")\`), and watch the count per request. A request that runs a number of queries proportional to a result-set size is an N+1.

## The raw-SQL escape hatch

Every good ORM has one, and you should be comfortable using it: window functions, recursive CTEs, \`LATERAL\` joins, database-specific operators (\`@>\`, full-text, \`DISTINCT ON\`), bulk \`INSERT ... ON CONFLICT\`, and any reporting query with three levels of aggregation are often clearer and faster as raw SQL. Use the ORM's **parameterised** raw API (\`prisma.$queryRaw\` tagged template, \`knex.raw("... ?", [v])\`, \`sequelize.query(sql, { replacements })\`) — never build the string yourself. Keep these in named functions in the data layer so they are as findable and testable as the rest.

## The repository pattern

Do not let \`prisma.\` / \`knex(\` / model imports spread through your controllers and services. Wrap data access in a **repository** module per aggregate:

\`\`\`js
// repositories/orderRepository.js — the ONLY file that imports the ORM for orders
export const orderRepository = {
  byId: (id) => prisma.order.findUnique({ where: { id }, include: { items: true } }),
  create: (data) => prisma.order.create({ data }),
  markPaid: (id, chargeId) => prisma.order.update({ where: { id }, data: { status: "paid", chargeId } }),
};
\`\`\`

Benefits: the query shape (including the eager-loads that prevent N+1) lives in one place; services depend on a small interface, not the ORM; tests inject a fake repository (Module 7's DI); and swapping or upgrading the ORM touches the repository layer only. The cost is a thin layer of indirection — worth it past a handful of models.`,

    contentHi: `## Abstraction spectrum

Har data-access tool ek line par kahin baithta hai "aap SQL likhte ho" se "aap kabhi SQL nahi dekhte", aur har step control ko convenience ke liye trade karta hai.

**Raw driver** (\`pg\`, \`mysql2\`, \`mongodb\`) — aap query strings aur bound parameters bhejte ho, rows wapas milte hain. Maximum control aur performance, composition/types/migrations mein zero help. Ek chhoti service, ek data pipeline, ya ek hand-tuned hot path ke liye sahi.

**Query builder** (\`Knex\`, \`Kysely\`) — aap ek chainable API se ek query banaate ho jo aapki dialect ke liye SQL mein compile hota hai. Aap abhi bhi relational terms mein sochte ho aur SQL dekhte ho; aap composition, default parameterisation, aur ek migration runner paate ho.

**Schema-first ORM** (\`Prisma\`, \`Drizzle\`) — ek schema definition single source of truth hai; ek code generator ek fully typed client produce karta hai. Relations har query mein explicit hain (\`include\` / \`with\`). Ye aapko ek ORM ki zyaadatar safety dete hain bina zyaadatar surprises ke.

**Active-record ORM** (\`Sequelize\`, \`TypeORM\`, \`Objection\`) — instance methods waale model classes, properties ke roop mein exposed relations, hooks. Standard CRUD ke liye maximum leverage; sabse zyaada behaviour property access ke peeche chhupa, N+1 ka classic ghar.

## Ek ORM asal mein kya deta hai

- **Mapping** — rows <-> objects, snake_case <-> camelCase, DB types <-> JS types.
- **Composition & safety** — construction se parameterised, to SQL-injection bugs ki ek poori category nahi ho sakti agar aap typed API par raho.
- **Migrations** — schema changes ordered, version-controlled, replayable files ke roop mein.
- **Relations** — ek baar declare karo, phir \`include\`/\`populate\`/\`with\`.
- **Types** (Prisma, Kysely, Drizzle) — ek query ka result shape inferred hai.

## Kya lagta hai

- **Ek leaky abstraction.** Aapko abhi bhi indexes, query plan, transactions samajhna hoga — ORM SQL nahi hataata, ise seekhna postpone karta hai.
- **N+1.** Ek loop ke andar convenient relation access (\`post.author\`) prati iteration ek query fire karta hai jab tak aap eager-load na karo. Ye *the* ORM performance bug hai.
- **Generated SQL jo aapne nahi chuna.** Kuch ORMs ek to-many relation ko ek alag query ke roop mein load karte hain, kuch ek join ke roop mein jo rows multiply karta hai.
- **Migration drift aur lock risk.** Ek auto-generated migration ek destructive ya long-locking change propose kar sakti hai. Production mein apply karne se pehle hamesha generated SQL padho.

## N+1, concretely

Fixes, preference ke order mein:
1. **Eager-load** pehli query mein: \`include: { author: true }\` / \`.populate("author")\`.
2. **Sirf jo chahiye wo select karo**.
3. **Haath se batch karo** jab ORM na kar sake: author ids collect karo, ek \`WHERE id IN (...)\`.
4. **Ek DataLoader** ek GraphQL-style access pattern ke liye.

Ise *pakadne* ka tarika: development mein har query log karo, prati request count dekho.

## Raw-SQL escape hatch

Har achhe ORM ke paas ek hai: window functions, recursive CTEs, \`LATERAL\` joins, database-specific operators, bulk \`INSERT ... ON CONFLICT\`. ORM ke **parameterised** raw API istemal karo (\`prisma.$queryRaw\` tagged template, \`knex.raw("... ?", [v])\`) — kabhi khud string mat banao. Inhe data layer mein named functions mein rakho.

## Repository pattern

\`prisma.\` / \`knex(\` / model imports ko apne controllers aur services mein failne mat do. Data access ko prati aggregate ek **repository** module mein wrap karo. Fayde: query shape (N+1 rokne waale eager-loads samet) ek jagah rehta hai; services ek chhote interface par nirbhar hain; tests ek fake repository inject karte hain; ORM swap karna sirf repository layer ko chhoota hai.`,

    examples: [
      {
        title: 'Raw driver: parameterised query — values are never part of the SQL string',
        titleHi: 'Raw driver: parameterised query — values kabhi SQL string ka hissa nahi',
        code: `import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const orgId = 42;
const search = "'; DROP TABLE users; --";   // hostile input

const { rows } = await pool.query(
  "SELECT id, email FROM users WHERE org_id = $1 AND email ILIKE $2",
  [orgId, \`%\${search}%\`],
);
console.log(rows.length, "matches — and users still exists");`,
        codeJs: `import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const orgId = 42;
const search = "'; DROP TABLE users; --";   // classic injection payload

// $1, $2 are placeholders; the array is sent SEPARATELY from the SQL text,
// so the driver treats the payload strictly as a string value, never as SQL.
const { rows } = await pool.query(
  "SELECT id, email FROM users WHERE org_id = $1 AND email ILIKE $2",
  [orgId, \`%\${search}%\`],
);
console.log(rows.length, "matches");

// NEVER: pool.query(\`... WHERE email ILIKE '%\${search}%'\`)  <- string-built, injectable
// pool.end() when the app shuts down (Module 7 graceful shutdown)`,
        codeTs: `import { Pool, type QueryResult } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface UserRow { id: number; email: string; }

const orgId = 42;
const search = "'; DROP TABLE users; --";

const result: QueryResult<UserRow> = await pool.query(
  "SELECT id, email FROM users WHERE org_id = $1 AND email ILIKE $2",
  [orgId, \`%\${search}%\`],
);
console.log(result.rows.length, "matches");`,
        output: `0 matches — and users still exists

The hostile string went in as a bound parameter, so Postgres compared
it as a literal value against the email column and found nothing. It was
never parsed as SQL. A string-concatenated query would have executed the
DROP TABLE.`,
        explain: 'Parameterised queries send the SQL text and the values over the wire as separate things. The database compiles the query once, with placeholders, then binds the values — which can therefore only ever be data, never syntax. This makes SQL injection structurally impossible on that query. Every driver, query builder, and ORM does this by default; you only lose it when you build the SQL string yourself with template literals or concatenation.',
        explainHi: 'Parameterised queries SQL text aur values ko wire par alag cheezon ke roop mein bhejti hain. Database query ko ek baar compile karta hai, placeholders ke saath, phir values bind karta hai — jo isliye sirf data ho sakti hain, kabhi syntax nahi. Ye us query par SQL injection ko structurally asambhav banata hai. Aap ise sirf tab khote ho jab aap khud SQL string banate ho.',
      },
      {
        title: 'The N+1: lazy relation access in a loop vs eager include',
        titleHi: 'N+1: ek loop mein lazy relation access vs eager include',
        code: `// N+1 — logs show 1 + 50 queries
const posts = await prisma.post.findMany({ take: 50 });
const view = [];
for (const p of posts) {
  const author = await prisma.user.findUnique({ where: { id: p.authorId } });
  view.push({ title: p.title, author: author.name });
}

// FIX — logs show 1 query (or 2 with Prisma's relation loading)
const posts2 = await prisma.post.findMany({
  take: 50,
  include: { author: { select: { name: true } } },
});
const view2 = posts2.map(p => ({ title: p.title, author: p.author.name }));`,
        codeJs: `// Turn on query logging in dev to SEE the problem:
// const prisma = new PrismaClient({ log: ["query"] });

// ---- N+1 version ----
const posts = await prisma.post.findMany({ take: 50 });   // query 1
const view = [];
for (const p of posts) {
  const author = await prisma.user.findUnique({ where: { id: p.authorId } });  // queries 2..51
  view.push({ title: p.title, author: author.name });
}
// dev log: 51 SELECT statements. Fast locally, 51 network round-trips in prod.

// ---- fixed version ----
const posts2 = await prisma.post.findMany({
  take: 50,
  include: { author: { select: { name: true } } },   // load the relation up front
});
const view2 = posts2.map((p) => ({ title: p.title, author: p.author.name }));
// dev log: 1-2 statements regardless of how many posts.`,
        codeTs: `const prisma = new PrismaClient({ log: ["query"] });

// N+1
const posts = await prisma.post.findMany({ take: 50 });
const view: { title: string; author: string }[] = [];
for (const p of posts) {
  const author = await prisma.user.findUniqueOrThrow({ where: { id: p.authorId } });
  view.push({ title: p.title, author: author.name });
}

// fixed
const posts2 = await prisma.post.findMany({
  take: 50,
  include: { author: { select: { name: true } } },
});
const view2 = posts2.map((p) => ({ title: p.title, author: p.author.name }));`,
        output: `N+1 version — dev query log:
  SELECT ... FROM "Post" LIMIT 50
  SELECT ... FROM "User" WHERE id = 1
  SELECT ... FROM "User" WHERE id = 2
  ... (48 more)
  => 51 queries

fixed version — dev query log:
  SELECT ... FROM "Post" LIMIT 50
  SELECT ... FROM "User" WHERE id IN (1, 2, 3, ...)
  => 2 queries, and the count does not grow with the number of posts`,
        explain: 'The first version issues one query for the list and then, inside the loop, one query per row to fetch its author — the number of queries scales with the result-set size. Locally, against a database on localhost, 51 fast queries feel instant; in production each is a network round-trip and the endpoint is dozens of times slower. include (or populate / with) tells the ORM to load the relation in the initial fetch, collapsing it to a fixed small number of queries. You catch this by logging queries in development and watching the per-request count.',
        explainHi: 'Pehla version list ke liye ek query issue karta hai aur phir, loop ke andar, prati row ek query iske author ko fetch karne ke liye — queries ki sankhya result-set size ke saath scale karti hai. Locally, 51 fast queries instant lagti hain; production mein har ek ek network round-trip hai. include (ya populate / with) ORM ko relation ko initial fetch mein load karne ko kehta hai. Aap ise development mein queries log karke pakadte ho.',
      },
      {
        title: 'The escape hatch: a reporting query the ORM can\'t express, done safely',
        titleHi: 'Escape hatch: ek reporting query jo ORM express nahi kar sakta, surakshit tarike se',
        code: `// window function + date bucketing — clearer as raw SQL
const rows = await prisma.$queryRaw\`
  SELECT
    date_trunc('week', created_at)          AS week,
    count(*)                                 AS signups,
    sum(count(*)) OVER (ORDER BY date_trunc('week', created_at)) AS cumulative
  FROM users
  WHERE org_id = \${orgId}
  GROUP BY 1
  ORDER BY 1
\`;
console.log(rows);`,
        codeJs: `// $queryRaw is a TAGGED TEMPLATE — every \${...} becomes a bound parameter,
// so \${orgId} is safe even though it looks like string interpolation.
const rows = await prisma.$queryRaw\`
  SELECT
    date_trunc('week', created_at)          AS week,
    count(*)::int                           AS signups,
    sum(count(*)) OVER (ORDER BY date_trunc('week', created_at))::int AS cumulative
  FROM users
  WHERE org_id = \${orgId}
  GROUP BY 1
  ORDER BY 1
\`;
// rows: [ { week: 2026-01-05T..., signups: 12, cumulative: 12 }, ... ]

// Knex equivalent: knex.raw("... where org_id = ?", [orgId])
// Sequelize:       sequelize.query(sql, { replacements: { orgId }, type: QueryTypes.SELECT })

// Keep this in a named data-layer function: reports.weeklySignups(orgId)`,
        codeTs: `interface SignupWeek { week: Date; signups: number; cumulative: number; }

const rows = await prisma.$queryRaw<SignupWeek[]>\`
  SELECT
    date_trunc('week', created_at)          AS week,
    count(*)::int                           AS signups,
    sum(count(*)) OVER (ORDER BY date_trunc('week', created_at))::int AS cumulative
  FROM users
  WHERE org_id = \${orgId}
  GROUP BY 1
  ORDER BY 1
\`;`,
        output: `[
  { week: 2026-01-05T00:00:00.000Z, signups: 12, cumulative: 12 },
  { week: 2026-01-12T00:00:00.000Z, signups: 20, cumulative: 32 },
  { week: 2026-01-19T00:00:00.000Z, signups: 7,  cumulative: 39 }
]

The running total via a window function and date_trunc bucketing are
awkward or impossible in most ORM query APIs but natural in SQL. The
tagged-template form parameterised orgId, so it is still injection-safe.`,
        explain: 'ORMs cover the common 90-95% of queries well and get awkward or fall short on window functions, recursive CTEs, LATERAL joins, and heavy reporting aggregation. Every mature ORM provides a raw API for exactly this. Use the parameterised form — Prisma\'s tagged template, Knex\'s ? placeholders, Sequelize replacements — so interpolated values are still bound parameters and not injectable. Wrap each raw query in a named function in the data layer so it stays as discoverable and testable as the rest of the code.',
        explainHi: 'ORMs aam 90-95% queries ko achhi tarah cover karte hain aur window functions, recursive CTEs, LATERAL joins, aur bhaari reporting aggregation par awkward ho jaate hain ya kam pad jaate hain. Har mature ORM iske liye ek raw API deta hai. Parameterised form istemal karo — Prisma ka tagged template, Knex ke ? placeholders — to interpolated values abhi bhi bound parameters hain aur injectable nahi. Har raw query ko data layer mein ek named function mein wrap karo.',
      },
    ],

    mistakes: [
      {
        wrong: `// controllers/postsController.js
import { prisma } from "../db.js";
export async function list(req, res) {
  const posts = await prisma.post.findMany({ where: { published: true }, take: 20 });
  const withAuthors = [];
  for (const p of posts) {
    const author = await prisma.user.findUnique({ where: { id: p.authorId } });  // N+1
    withAuthors.push({ ...p, authorName: author.name });
  }
  res.json(withAuthors);
}`,
        right: `// repositories/postRepository.js — the ONLY place that shapes this query
export const postRepository = {
  listPublished: (limit = 20) => prisma.post.findMany({
    where: { published: true },
    take: limit,
    include: { author: { select: { id: true, name: true } } },   // eager-load once
    orderBy: { createdAt: "desc" },
  }),
};

// controllers/postsController.js
export async function list(req, res) {
  res.json(await postRepository.listPublished());
}`,
        why: 'Two problems compound here. First, the ORM call is spread into a controller, so the query shape — and the fix for the N+1 — is wherever someone happened to write it, and the same pattern gets copy-pasted with the same bug. Second, the loop fetches each author with its own query, so a 20-post page is 21 round-trips. Moving the query into a repository puts the eager-load (include) in one place, makes the controller trivial, and means the N+1 fix lives with the query definition. Anywhere else that needs published posts calls the same repository method and inherits the correct loading.',
        whyHi: 'Do samasyaayein yahaan compound hoti hain. Pehla, ORM call ek controller mein failaayi gayi hai, to query shape — aur N+1 ka fix — jahaan kisi ne likha wahaan hai, aur wahi pattern wahi bug ke saath copy-paste hota hai. Doosra, loop har author ko apni query se fetch karta hai, to ek 20-post page 21 round-trips hai. Query ko ek repository mein le jaana eager-load (include) ko ek jagah rakhta hai, controller ko trivial banata hai.',
      },
      {
        wrong: `const rows = await prisma.$queryRawUnsafe(
  \`SELECT * FROM orders WHERE customer_email = '\${req.query.email}'\`
);
// $queryRawUnsafe + string interpolation = SQL injection, ORM or no ORM`,
        right: `// tagged-template form — the value is bound, not interpolated into the text
const rows = await prisma.$queryRaw\`
  SELECT * FROM orders WHERE customer_email = \${req.query.email}
\`;
// or $queryRawUnsafe with a parameter array:
// prisma.$queryRawUnsafe("SELECT * FROM orders WHERE customer_email = $1", req.query.email)`,
        why: 'Using an ORM does not protect you the moment you drop to its "unsafe" raw API and build the string yourself. $queryRawUnsafe (and Knex.raw with an interpolated string, and Sequelize query without replacements) takes whatever text you give it, so interpolating request input straight in is a textbook injection hole. The safe raw APIs all accept the values separately: Prisma\'s $queryRaw tagged template turns each ${} into a bound parameter, $queryRawUnsafe accepts a trailing parameter array, Knex uses ? placeholders, Sequelize uses replacements or bind. Reach for the unsafe variant only for a dynamic identifier like a table name you have validated against an allowlist — never for a value.',
        whyHi: 'Ek ORM istemal karna aapko us pal protect nahi karta jab aap iske "unsafe" raw API par jaate ho aur khud string banate ho. $queryRawUnsafe jo bhi text aap dete ho leta hai, to request input ko seedhe interpolate karna ek textbook injection hole hai. Surakshit raw APIs sab values ko alag accept karte hain: Prisma ka $queryRaw tagged template har ${} ko ek bound parameter banata hai. Unsafe variant sirf ek dynamic identifier ke liye jise aapne allowlist ke against validate kiya.',
      },
      {
        wrong: `// deploy pipeline runs this automatically against production:
prisma migrate deploy
// and the last auto-generated migration contains:
//   ALTER TABLE "events" ALTER COLUMN "payload" SET DATA TYPE jsonb USING payload::jsonb;
// on a 400M-row table -> full table rewrite -> exclusive lock -> 20 min outage`,
        right: `// 1. Read every generated migration's SQL before it ships.
// 2. For a big-table change, split it (Django course Module 10 zero-downtime pattern):
//    - add a new nullable jsonb column
//    - backfill in batches (a script / job, not a migration)
//    - switch reads/writes to the new column
//    - drop the old column in a later migration
// 3. Build indexes concurrently: raw SQL migration with CREATE INDEX CONCURRENTLY
//    (Prisma: mark it as such; Knex: knex.raw in the migration).`,
        why: 'An ORM that generates migrations from a schema diff will happily emit a statement that rewrites or exclusively locks a large table — a type change, a NOT NULL added to a populated column, a non-concurrent index build. It has no idea your events table has 400 million rows. Applied automatically in a deploy, that is a production outage. The generator is a starting point, not an authority: read the SQL of every migration, and for anything touching a big table, hand-write the safe multi-step version — add nullable, backfill out of band, constrain, drop — exactly as in the zero-downtime migration pattern.',
        whyHi: 'Ek ORM jo ek schema diff se migrations generate karta hai khushi se ek aisa statement emit karega jo ek bade table ko rewrite ya exclusively lock karta hai — ek type change, ek populated column par NOT NULL add. Ise pata nahi ki aapke events table mein 400 million rows hain. Ek deploy mein automatically applied, wo ek production outage hai. Generator ek starting point hai, ek authority nahi: har migration ka SQL padho.',
      },
    ],

    realWorld: [
      {
        en: '**Prisma with `log: ["query"]` in dev and a test that asserts an endpoint runs `<= 3` queries** — the N+1 regression is caught in CI the moment someone adds a lazy `order.customer` access to a list serializer.',
        hi: '**Prisma dev mein `log: ["query"]` ke saath aur ek test jo assert karta hai ek endpoint `<= 3` queries chalata hai** — N+1 regression CI mein pakda jaata hai.',
      },
      {
        en: '**A `repositories/` directory that is the only place importing the ORM client** — services take repository interfaces, so the team migrated from Sequelize to Prisma one repository at a time without touching a single controller.',
        hi: '**Ek `repositories/` directory jo ORM client import karne ki ekmatra jagah hai** — team ne Sequelize se Prisma ek repository ek baar mein migrate kiya bina ek bhi controller chhue.',
      },
      {
        en: '**Kysely for 95% of queries (fully typed, close to SQL) plus a handful of `sql\\\`...\\\`` raw fragments** for `DISTINCT ON` and a recursive org-hierarchy CTE — no heavyweight ORM, no hand-built strings, column renames caught at compile time.',
        hi: '**95% queries ke liye Kysely (fully typed, SQL ke kareeb) plus kuch `sql\\\`...\\\`` raw fragments** — koi heavyweight ORM nahi, koi hand-built strings nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Query builder vs ORM vs raw driver — how do you choose, and what does each cost?',
        qHi: 'Query builder vs ORM vs raw driver — aap kaise chunte ho, aur har ek ki keemat kya hai?',
        a: 'They are points on a spectrum from writing SQL yourself to never seeing it. The raw driver — pg, mysql2, mongodb — gives you full control and performance and zero help: you write parameterised query strings and map rows by hand. It fits a small service, a pipeline, or a hot path you have tuned. A query builder like Knex or Kysely lets you compose queries as method chains that compile to SQL; you still think relationally and see the SQL, but you gain composition, parameterisation by default, a migration runner, and with Kysely full type inference. It costs almost nothing and is a good default for a team comfortable with SQL. A full ORM — Prisma or Drizzle at the schema-first end, Sequelize or TypeORM at the active-record end — adds object mapping, declared relations you load with include or populate, generated migrations, and typed results. It buys the most leverage for standard CRUD. It costs a leaky abstraction — you still must understand indexes, plans, and transactions — plus the N+1 from convenient relation access, generated SQL you did not choose and must occasionally read, migration generators that can propose destructive changes, and runtime weight. My rule: default to a typed query builder or a schema-first ORM like Prisma; avoid the heavy active-record ORMs unless the team specifically wants that style; and keep the raw driver in reach for the queries the abstraction cannot express.',
        aHi: 'Ye ek spectrum par points hain khud SQL likhne se ise kabhi na dekhne tak. Raw driver aapko poora control aur performance aur zero help deta hai. Ek query builder jaise Knex ya Kysely aapko queries ko method chains ke roop mein compose karne deta hai; aap abhi bhi relationally sochte ho aur SQL dekhte ho, par aap composition, default parameterisation, ek migration runner paate ho. Ek poora ORM object mapping, declared relations, generated migrations, aur typed results add karta hai. Ye standard CRUD ke liye sabse zyaada leverage deta hai. Ye ek leaky abstraction cost karta hai — aapko abhi bhi indexes, plans samajhna hoga — plus N+1, generated SQL jo aapne nahi chuna, migration generators jo destructive changes propose kar sakte hain. Mera niyam: ek typed query builder ya Prisma jaisa schema-first ORM default karo; raw driver ko reach mein rakho.',
      },
      {
        q: 'What is the ORM N+1 problem, how do you detect it, and how do you fix it?',
        qHi: 'ORM N+1 problem kya hai, aap ise kaise detect karte ho, aur kaise fix karte ho?',
        a: 'The N+1 happens when you fetch a list of N rows with one query and then, for each row, access a relation that triggers its own query — so the total is one plus N. It comes from how natural the code looks: post dot author inside a map, order dot items in a loop. Locally, against a database on the same machine, N extra fast queries feel instant, so it usually ships; in production each is a network round-trip and the endpoint is tens of times slower, and it gets worse as data grows. You detect it by turning on query logging in development — Prisma\'s log query option, Sequelize\'s logging, a Knex query event — and watching the number of queries per request; if it scales with the size of a result set, that is an N+1. A test that asserts an endpoint stays under a small fixed query count catches regressions in CI. The fix, in order of preference: eager-load the relation in the first query with include or populate or with; select only the columns you actually use so the rows stay small; if the ORM cannot express the load, batch by hand — collect the foreign keys, one where-in query, build a map, attach; and for a request that asks for the same relation from many places, a DataLoader that coalesces the lookups into one batched query.',
        aHi: 'N+1 tab hota hai jab aap N rows ki ek list ek query se fetch karte ho aur phir, har row ke liye, ek relation access karte ho jo apni query trigger karta hai — to total ek plus N hai. Ye is baat se aata hai ki code kitna natural dikhta hai: ek map ke andar post dot author. Locally, N extra fast queries instant lagti hain, to ye aam taur par ship hoti hai; production mein har ek ek network round-trip hai aur endpoint das guna slow hai. Aap ise development mein query logging on karke detect karte ho aur prati request queries ki sankhya dekhte ho. Fix, preference ke order mein: pehli query mein relation eager-load karo include ya populate se; sirf jo columns aap istemal karte ho wo select karo; agar ORM load express nahi kar sakta, haath se batch karo; aur ek request jo kई jagah se wahi relation maangti hai ke liye, ek DataLoader.',
      },
    ],

    exercises: [
      {
        task: 'Given a raw `pg` pool, write `findUsers({ orgId, search, limit })` that returns users in `orgId` whose name OR email matches `search` (case-insensitive, partial), newest first, capped at `limit`. Every dynamic value must be a bound parameter (`$1`, `$2`, ...). Test that passing `search = "x\' OR \'1\'=\'1"` returns only genuine matches, not the whole table.',
        taskHi: 'Ek raw `pg` pool diya, `findUsers({ orgId, search, limit })` likho jo `orgId` mein users return karta hai jinka naam YA email `search` se match karta hai. Har dynamic value ek bound parameter hona chahiye. Test karo ki `search = "x\' OR \'1\'=\'1"` sirf genuine matches return karta hai.',
        hint: '`WHERE org_id = $1 AND (name ILIKE $2 OR email ILIKE $2) ORDER BY created_at DESC LIMIT $3`, params `[orgId, "%" + search + "%", limit]`. The `%...%` wrapping happens in JS on the value, not in the SQL.',
        hintHi: '`WHERE org_id = $1 AND (name ILIKE $2 OR email ILIKE $2) ORDER BY created_at DESC LIMIT $3`, params `[orgId, "%" + search + "%", limit]`.',
      },
      {
        task: 'You have `posts` (id, title, authorId) and `users` (id, name). Write a `hydrate(posts)` function that attaches `authorName` to each post WITHOUT an N+1: collect the distinct `authorId`s, run ONE `users` query with `WHERE id = ANY($1)`, build a `Map<id, name>`, and map over posts. Assert that for 100 posts by 5 authors, exactly 1 users query runs.',
        taskHi: 'Aapke paas `posts` aur `users` hain. Ek `hydrate(posts)` function likho jo har post par `authorName` attach karta hai BINA N+1: distinct `authorId`s collect karo, EK `users` query chalao, ek `Map` banao. Assert: 100 posts, 5 authors, theek 1 users query.',
        hint: '`const ids = [...new Set(posts.map(p => p.authorId))]`; `const { rows } = await pool.query("SELECT id, name FROM users WHERE id = ANY($1)", [ids])`; `const byId = new Map(rows.map(r => [r.id, r.name]))`; `return posts.map(p => ({ ...p, authorName: byId.get(p.authorId) }))`.',
        hintHi: '`const ids = [...new Set(posts.map(p => p.authorId))]`; ek `WHERE id = ANY($1)` query; ek `Map` banao; map over posts.',
      },
      {
        task: 'Design a `bookRepository` object (using any ORM or a mock) exposing exactly: `byId(id)`, `search({ q, page, pageSize })`, `create(data)`, `updateStock(id, delta)`. Write it so NO other module imports the ORM. Then write a service function `reserveCopy(bookId)` that uses ONLY the repository, and a test that injects a fake repository (no database) to verify `reserveCopy` calls `updateStock(bookId, -1)`.',
        taskHi: 'Ek `bookRepository` object design karo jo theek `byId`, `search`, `create`, `updateStock` expose karta hai. Ise aise likho ki KOI doosra module ORM import na kare. Phir ek service `reserveCopy(bookId)` likho jo SIRF repository istemal karti hai, aur ek test jo ek fake repository inject karta hai.',
        hint: 'The repository is the only file with `import { prisma }`. `reserveCopy` takes the repo as a parameter (or imports the module) and calls `repo.updateStock(bookId, -1)`. The test passes `{ updateStock: (id, d) => { calls.push([id, d]); } }`.',
        hintHi: 'Repository ekmatra file hai `import { prisma }` ke saath. `reserveCopy` repo ko parameter ke roop mein leti hai aur `repo.updateStock(bookId, -1)` call karti hai. Test ek fake `{ updateStock }` pass karta hai.',
      },
    ],

    keyTakeaways: [
      'The spectrum: RAW DRIVER (`pg`/`mysql2`/`mongodb` — you write parameterised SQL, full control, zero help) -> QUERY BUILDER (`Knex`/`Kysely` — method chains compile to SQL, you still see it, + composition/migrations/types) -> SCHEMA ORM (`Prisma`/`Drizzle` — schema is source of truth, typed client, explicit relations) -> ACTIVE-RECORD ORM (`Sequelize`/`TypeORM` — model classes, property relations, most magic, home of the N+1).',
      'PARAMETERISE ALWAYS: the driver/builder/ORM sends SQL text and values SEPARATELY, so a bound value can only be data, never syntax — SQL injection is structurally impossible on that query. You lose this ONLY by building the string yourself (`$queryRawUnsafe` + interpolation, `knex.raw` with an interpolated string).',
      'What an ORM buys: row<->object mapping, parameterisation by construction, ordered version-controlled migrations, declared relations (`include`/`populate`/`with`), and (Prisma/Kysely/Drizzle) inferred result types so a column rename is a compile error.',
      'What it costs: a LEAKY abstraction (you still must know indexes/plans/transactions); the N+1; generated SQL you did not choose (a to-many as `IN(...)` vs a row-multiplying join; double-counted aggregates); migration generators that propose destructive/long-locking changes; runtime weight.',
      'THE N+1: fetch N rows in 1 query, then access a relation per row -> 1 + N queries. Fast locally (DB on localhost), tens-of-times slower in prod (each is a round-trip). DETECT: log every query in dev (`log: ["query"]` / `logging` / `.on("query")`), watch per-request count — if it scales with result size, it\'s an N+1. A CI test asserting `<= K` queries catches regressions.',
      'FIX the N+1, in order: (1) eager-load in the first query (`include`/`populate`/`with`); (2) `select` only the columns used; (3) batch by hand — collect FKs, one `WHERE id = ANY($1)`, build a `Map`, attach; (4) a `DataLoader` for GraphQL-style repeated access.',
      'The RAW-SQL ESCAPE HATCH: window functions, recursive CTEs, `LATERAL`, DB-specific operators, `INSERT ... ON CONFLICT`, heavy reporting aggregation. Use the PARAMETERISED raw API (`prisma.$queryRaw` tagged template, `knex.raw("... ?", [v])`, Sequelize `replacements`) — never a hand-built string. Keep each in a named data-layer function.',
      'REPOSITORY PATTERN: one module per aggregate is the ONLY place that imports the ORM; it owns the query shapes (including the eager-loads that prevent N+1). Services depend on the small repository interface; tests inject a fake (Module 7 DI); swapping/upgrading the ORM touches only the repository layer.',
    ],
    keyTakeawaysHi: [
      'Spectrum: RAW DRIVER (aap parameterised SQL likhte ho, poora control) -> QUERY BUILDER (`Knex`/`Kysely` — method chains SQL mein compile) -> SCHEMA ORM (`Prisma`/`Drizzle` — schema source of truth, typed client) -> ACTIVE-RECORD ORM (`Sequelize`/`TypeORM` — model classes, sabse zyaada magic, N+1 ka ghar).',
      'HAMESHA PARAMETERISE: driver/builder/ORM SQL text aur values ALAG bhejta hai, to ek bound value sirf data ho sakti hai — SQL injection structurally asambhav. Aap ise SIRF tab khote ho jab aap khud string banate ho.',
      'ORM kya deta hai: row<->object mapping, construction se parameterisation, ordered version-controlled migrations, declared relations, aur inferred result types.',
      'Kya lagta hai: ek LEAKY abstraction; N+1; generated SQL jo aapne nahi chuna; migration generators jo destructive changes propose karte hain; runtime weight.',
      'N+1: N rows 1 query mein fetch, phir prati row ek relation access -> 1 + N queries. Locally fast, prod mein das guna slow. DETECT: dev mein har query log karo, prati request count dekho. Ek CI test jo `<= K` queries assert karta hai.',
      'N+1 FIX, order mein: (1) pehli query mein eager-load; (2) sirf istemal kiye columns `select` karo; (3) haath se batch karo; (4) GraphQL-style ke liye ek `DataLoader`.',
      'RAW-SQL ESCAPE HATCH: window functions, recursive CTEs, `LATERAL`, DB-specific operators. PARAMETERISED raw API istemal karo — kabhi hand-built string nahi.',
      'REPOSITORY PATTERN: prati aggregate ek module ORM import karne ki EKMATRA jagah hai; ye query shapes own karta hai. Services chhote interface par nirbhar; ORM swap sirf repository layer ko chhoota hai.',
    ],
  },
];
