/**
 * Databases Complete Course — Module 12: PostgreSQL Operations & Scale, lessons 4-6.
 * Last module of Part II.
 *
 * Lesson 4: The connection model, pooling & key GUCs — why PostgreSQL connections are
 *           expensive, how pooling addresses that, and the configuration knobs that
 *           matter most (work_mem, shared_buffers, effective_cache_size, max_connections).
 * Lesson 5: VACUUM & autovacuum tuning, bloat & monitoring — per-table autovacuum
 *           configuration, VACUUM FULL vs pg_repack, and the catalog/stat views used
 *           to watch a table's size and health.
 * Lesson 6: WAL, replication, backups & zero-downtime schema changes — the write-ahead
 *           log, physical vs logical replication, backup strategies, and the
 *           add-nullable / backfill / NOT VALID / VALIDATE migration pattern.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 12
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_12_PART2: CourseLesson[] = [
  {
    slug: 'sql-connections-pooling-and-key-gucs',
    title: 'The Connection Model, Pooling & Key GUCs',
    titleHi: 'Connection Model, Pooling Aur Key GUCs',
    description: 'Every PostgreSQL connection is a full operating-system process, which makes connections genuinely expensive and caps how many a server can hold. A connection pooler sits in front to reuse a small number of them, and a handful of configuration parameters control how much memory each query and the server as a whole may use.',
    descriptionHi: 'Har PostgreSQL connection ek poora operating-system process hai, jo connections ko genuinely mehanga banata hai aur cap karta hai ki ek server кितne rakh sakta hai. Ek connection pooler saamne baithता hai unmein se ek chhoti sankhya ko reuse karne ke liye, aur кुछ configuration parameters control karте hain ki har query aur poora server кितni memory istemal kar sakta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A restaurant with a fixed number of full-time waiters, plus a host who assigns them to tables — not a system where every guest gets a personal waiter hired on the spot.** Hiring, training, and equipping a brand-new waiter for every single guest who walks in would be absurdly expensive, and the kitchen can only coordinate with so many waiters at once before service collapses into chaos. PostgreSQL connections work the same way: each one is a genuine operating-system process the server spins up, with its own memory and overhead, and there is a hard ceiling (`max_connections`) beyond which the server refuses more. A connection pooler is the host at the door: it keeps a small, fixed team of real waiters (database connections) and hands each arriving guest (application request) whichever waiter is currently free, so a hundred guests can be served over an evening by ten waiters who never stop moving, rather than a hundred waiters standing around. And `work_mem` is the size of the tray each waiter is allowed to carry — too small and they make endless trips to the kitchen for one table, too large and ten waiters carrying oversized trays at once overwhelm the floor.',
      hi: '**Ek restaurant jismein full-time waiters ki ek fixed sankhya hai, saath hi ek host jo unhe tables assign karta hai — ek aisa system nahi jahaan har guest ko ek personal waiter mile jo mौke par hire kiya gaya.** Har single guest ke liye ek bilkul naya waiter hire, train, aur equip karna absurdly mehanga hoगa, aur kitchen ek saath itne hi waiters ke saath coordinate kar sakti hai. PostgreSQL connections waise hi kaam karte hain: har ek ek genuine operating-system process hai jise server spin up karta hai, apni memory aur overhead ke saath, aur ek hard ceiling (`max_connections`) hai jiske aage server aur refuse karta hai. Ek connection pooler darwaाze par host hai: ye real waiters (database connections) ki ek chhoti, fixed team rakhता hai aur har aane waale guest ko jo bhi waiter abhi free hai deта hai. Aur `work_mem` wo tray ka size hai jo har waiter le jaane ki ijaазат rakhता hai.',
    },

    simple: `**Every connection is a full OS process -- \`max_connections\` is the hard ceiling**

\`\`\`sql
SHOW max_connections;   -- default: 100
\`\`\`
\`\`\`
 max_connections
-----------------
 100
(1 row)
-- each connection = a real process with its own memory -- opening/closing them
-- repeatedly is genuinely expensive, and there's a fixed limit
\`\`\`

**A connection pooler (PgBouncer, etc.) reuses a small pool of real connections
across many application clients**
\`\`\`
1000 app clients  ->  [ pooler ]  ->  20 real PostgreSQL connections
                                       (each reused as clients come and go)
\`\`\`

**Two pooling MODES, and why \`SET LOCAL\` matters for one of them**

\`\`\`
session mode      -- a client holds a real connection for its whole session --
                     plain SET persists safely (but fewer clients can be served)
transaction mode  -- a client holds a real connection only for one transaction,
                     then it's handed to someone else -- a plain SET would LEAK
                     into the next client -- use SET LOCAL (auto-reverts at COMMIT)
\`\`\`

\`\`\`sql
BEGIN;
SET LOCAL work_mem = '64MB';   -- applies to THIS transaction only
SHOW work_mem;                 -- 64MB
COMMIT;
SHOW work_mem;                 -- back to 4MB -- the SET LOCAL reverted automatically
\`\`\`

**Key memory GUCs**
\`\`\`
work_mem              -- memory PER SORT / HASH / etc. operation, PER query --
                        many concurrent queries each using it adds up FAST
shared_buffers        -- the server's main shared cache of table/index pages
                        (~25% of RAM is a common starting point)
effective_cache_size  -- a HINT to the planner about total OS + PG cache available --
                        doesn't allocate anything, just informs plan choices
max_connections       -- the hard ceiling on concurrent connections
\`\`\``,

    simpleHi: `**Har connection ek poora OS process hai -- \`max_connections\` hard ceiling hai**

\`\`\`sql
SHOW max_connections;   -- default: 100
\`\`\`
\`\`\`
 max_connections
-----------------
 100
(1 row)
\`\`\`

**Ek connection pooler (PgBouncer, waagаirah) kई application clients ke across real connections ke ek chhote pool ko reuse karta hai**
\`\`\`
1000 app clients  ->  [ pooler ]  ->  20 real PostgreSQL connections
\`\`\`

**Do pooling MODES, aur ek ke liye \`SET LOCAL\` kyun matter karta hai**

\`\`\`
session mode      -- ek client ek real connection apne poore session ke liye rakhता hai --
                     plain SET safely persist karta hai
transaction mode  -- ek client ek real connection sirf ek transaction ke liye rakhता hai,
                     phir ye kisī aur ko diya jaता hai -- ek plain SET agle client mein
                     LEAK karega -- SET LOCAL istemal karo (COMMIT par auto-revert)
\`\`\`

\`\`\`sql
BEGIN;
SET LOCAL work_mem = '64MB';   -- SIRF IS transaction par apply hota hai
SHOW work_mem;                 -- 64MB
COMMIT;
SHOW work_mem;                 -- wapas 4MB -- SET LOCAL automatically revert hua
\`\`\`

**Key memory GUCs**
\`\`\`
work_mem              -- memory PRATI SORT / HASH / waagairah operation, PRATI query
shared_buffers        -- server ka main shared cache of table/index pages (~25% RAM)
effective_cache_size  -- planner ko ek HINT total OS + PG cache ke baare mein --
                        kuch allocate nahi karta, bas plan choices inform karta hai
max_connections       -- concurrent connections par hard ceiling
\`\`\``,

    content: `## Why PostgreSQL connections are expensive

Each client connection to PostgreSQL is served by a dedicated **operating-system process** the server forks — not a lightweight thread, but a full process with its own memory footprint and setup cost. This has two direct consequences: opening a connection is genuinely slow relative to running a query (so an application that opens a fresh connection per request wastes significant time on connection setup), and the server can only sustain so many at once before the sheer process overhead degrades everything. \`max_connections\` (default 100) is the hard configured ceiling; attempting connection 101 simply fails.

\`\`\`sql
SHOW max_connections;
\`\`\`

## Connection pooling

A **connection pooler** — PgBouncer being the most common, though some frameworks and cloud providers bundle their own — sits between the application and PostgreSQL. It maintains a small pool of real database connections and multiplexes many application clients across them: a client asks the pooler for a connection, uses it briefly, and returns it, and the pooler hands that same physical connection to the next client that needs one. A thousand application clients that are each idle most of the time can be served comfortably by twenty real PostgreSQL connections this way, keeping the server well under \`max_connections\` while the application sees effectively unlimited concurrency.

## Session mode vs transaction mode

Poolers offer different **modes** that trade concurrency for session fidelity:

- **Session mode**: a client holds its assigned real connection for the entire duration of its session, and only returns it on disconnect. Session-level state (a plain \`SET\`, a prepared statement, a temporary table) behaves exactly as it would with a direct connection, but the pool can serve no more concurrent clients than it has real connections.
- **Transaction mode**: a client holds a real connection only for the length of one transaction, then it is immediately returned to the pool and likely handed to a different client. This allows far more clients per real connection, but it breaks any assumption that session state persists across transactions — a plain \`SET work_mem = ...\` issued in one transaction would silently apply to whichever unrelated client gets that connection next.

\`\`\`sql
BEGIN;
SET LOCAL work_mem = '64MB';
SHOW work_mem;
COMMIT;
SHOW work_mem;
\`\`\`

\`SET LOCAL\` scopes a parameter change to the current transaction only, automatically reverting it at \`COMMIT\` or \`ROLLBACK\`. Under transaction-mode pooling, \`SET LOCAL\` is the safe way to adjust a parameter for one specific expensive query without leaking that change onto the next client to borrow the connection — which is why any code intended to run behind a transaction-mode pooler must use \`SET LOCAL\`, never a plain \`SET\`, for per-query tuning.

## The key GUCs

PostgreSQL has hundreds of configuration parameters ("GUCs" — Grand Unified Configuration variables), but a handful account for most real-world tuning:

- **\`work_mem\`** — the amount of memory a single sort, hash join, or similar operation may use before spilling to disk. Critically, this is **per operation, per query**: a single complex query can use several multiples of \`work_mem\` if it has multiple sorts or hashes, and many concurrent queries each doing so multiplies it further. Setting it high enough that a few queries can run in memory but low enough that dozens running at once cannot exhaust RAM is the balancing act; a common approach is a modest global default with \`SET LOCAL\` bumps for specific known-heavy queries.
- **\`shared_buffers\`** — the server's own shared cache of table and index pages, shared across all connections. A frequent starting point is around 25% of the machine's RAM, leaving the rest for the operating system's own file cache (which PostgreSQL also benefits from).
- **\`effective_cache_size\`** — not an allocation at all, but a **hint** to the planner about how much memory is likely available for caching data across both \`shared_buffers\` and the OS cache combined. A higher value makes the planner more willing to choose index scans over sequential scans, on the assumption the needed pages are probably cached; it changes plan choices without changing what memory is actually used.
- **\`max_connections\`** — the hard ceiling discussed above, which pooling exists specifically to let an application stay comfortably under.

Getting these roughly right matters far more than fine-tuning obscure parameters: an application layer that opens connections without pooling, or a \`work_mem\` set so high that a traffic spike exhausts memory, causes production incidents that no amount of query optimization elsewhere compensates for.`,

    contentHi: `## PostgreSQL connections mehange kyun hain

PostgreSQL ka har client connection ek dedicated **operating-system process** dwara serve hota hai jise server fork karta hai — ek lightweight thread nahi, balki ek poora process apni memory footprint aur setup cost ke saath. Iske do direct consequences hain: ek connection kholna ek query chalane ke sapeksh genuinely slow hai, aur server ek saath itne hi rakh sakta hai. \`max_connections\` (default 100) hard configured ceiling hai.

\`\`\`sql
SHOW max_connections;
\`\`\`

## Connection pooling

Ek **connection pooler** — PgBouncer sabse common — application aur PostgreSQL ke beech baithता hai. Ye real database connections ka ek chhota pool maintain karta hai aur kई application clients ko unke across multiplex karta hai.

## Session mode vs transaction mode

- **Session mode**: ek client apne assigned real connection ko apne poore session ke liye rakhता hai. Session-level state exactly waise behave karta hai jaise ek direct connection ke saath.
- **Transaction mode**: ek client ek real connection sirf ek transaction ke liye rakhता hai, phir ye turant pool ko wapas kiya jaता hai. Ek plain \`SET work_mem = ...\` chupchaap us client par apply hoगa jise wo connection agla milta hai.

\`\`\`sql
BEGIN;
SET LOCAL work_mem = '64MB';
SHOW work_mem;
COMMIT;
SHOW work_mem;
\`\`\`

\`SET LOCAL\` ek parameter change ko sirf current transaction tak scope karta hai, ise \`COMMIT\` ya \`ROLLBACK\` par automatically revert karте hue.

## Key GUCs

- **\`work_mem\`** — memory jo ek single sort, hash join, ya similar operation istemal kar sakta hai disk par spill karne se pehle. Ye **prati operation, prati query** hai.
- **\`shared_buffers\`** — server ka apna shared cache of table aur index pages. Ek frequent starting point machine ki RAM ka lgbhag 25%.
- **\`effective_cache_size\`** — bilkul ek allocation nahi, balki planner ko ek **hint**.
- **\`max_connections\`** — hard ceiling.`,

    examples: [
      {
        title: 'The key server-level GUCs and their PostgreSQL defaults',
        titleHi: 'Key server-level GUCs aur unke PostgreSQL defaults',
        code: `SHOW work_mem;
SHOW shared_buffers;
SHOW effective_cache_size;
SHOW max_connections;`,
        output: ` work_mem
----------
 4MB
(1 row)

 shared_buffers
----------------
 128MB
(1 row)

 effective_cache_size
----------------------
 4GB
(1 row)

 max_connections
-----------------
 100
(1 row)`,
        explain: "These are PGlite's defaults, matching a standard PostgreSQL install: `work_mem` 4MB (per sort/hash operation, per query), `shared_buffers` 128MB (the server's main shared page cache), `effective_cache_size` 4GB (a planner hint, allocates nothing), and `max_connections` 100 (the hard ceiling on concurrent connections).",
        explainHi: 'Ye PGlite ke defaults hain, ek standard PostgreSQL install se match karте hue: `work_mem` 4MB (prati sort/hash operation, prati query), `shared_buffers` 128MB (server ka main shared page cache), `effective_cache_size` 4GB (ek planner hint, kuch allocate nahi karta), aur `max_connections` 100 (concurrent connections par hard ceiling).',
      },
      {
        title: 'A plain SET changes a parameter for the rest of the session',
        titleHi: 'Ek plain SET ek parameter ko baaki session ke liye badalता hai',
        code: `SHOW work_mem;
SET work_mem = '16MB';
SHOW work_mem;`,
        output: ` work_mem
----------
 4MB
(1 row)

 work_mem
----------
 16MB
(1 row)`,
        explain: "A plain `SET work_mem = '16MB'` changes the parameter for the rest of the current session — the second `SHOW` confirms the new value took effect and will persist across every subsequent transaction on this connection until changed again or the session ends.",
        explainHi: "Ek plain `SET work_mem = '16MB'` parameter ko current session ke baaki hisse ke liye badalता hai — doosرा `SHOW` confirm karta hai ki nayi value effect mein aayi aur is connection par har baad ke transaction par persist karegi jab tak dobara na badli jaaye ya session khatm na ho.",
      },
      {
        title: 'SET LOCAL scopes a change to one transaction and auto-reverts at COMMIT',
        titleHi: 'SET LOCAL ek change ko ek transaction tak scope karta hai aur COMMIT par auto-revert karta hai',
        code: `SHOW work_mem;
BEGIN;
SET LOCAL work_mem = '64MB';
SHOW work_mem;
COMMIT;
SHOW work_mem;`,
        output: ` work_mem
----------
 4MB
(1 row)

 work_mem
----------
 64MB
(1 row)

 work_mem
----------
 4MB
(1 row)`,
        explain: "`SET LOCAL work_mem = '64MB'` inside the transaction shows `64MB` while the transaction is open, but the moment `COMMIT` runs, PostgreSQL automatically reverts the parameter to its prior value (`4MB`) — which is exactly what makes `SET LOCAL` the safe way to tune one query behind a transaction-mode connection pooler, where a plain `SET` would leak onto the next client.",
        explainHi: "Transaction ke andar `SET LOCAL work_mem = '64MB'` transaction khula rehne par `64MB` dikhaता hai, par jaise hi `COMMIT` chalta hai, PostgreSQL parameter ko automatically iski prior value (`4MB`) par revert karta hai — jo theek wo hai jo `SET LOCAL` ko ek transaction-mode connection pooler ke peeche ek query tune karne ka safe tarika banaता hai.",
      },
    ],

    mistakes: [
      {
        wrong: `-- an application opening a fresh PostgreSQL connection for every single request
function handleRequest(req) {
  const conn = openNewPostgresConnection();   // full OS process spun up EACH time
  const result = conn.query(...);
  conn.close();
  return result;
}
// under load, connection setup/teardown dominates, and max_connections is hit fast`,
        right: `// reuse connections through a pool -- either a client-library pool or an
// external pooler like PgBouncer -- so a request borrows an already-open
// connection and returns it, rather than creating one:
const pool = createConnectionPool({ max: 20 });
function handleRequest(req) {
  return pool.withConnection(conn => conn.query(...));
}`,
        why: 'Because each PostgreSQL connection is backed by a dedicated operating-system process rather than a lightweight thread, establishing one involves real process creation and initialization overhead that is substantial relative to the cost of running a typical query. An application that opens a new connection for every request pays that setup and teardown cost on every single request, which under any meaningful load becomes a dominant fraction of total response time, and simultaneously risks exhausting max_connections during traffic spikes, since many requests arriving close together each try to create their own process. A connection pool, whether built into the database client library or run as a separate process like PgBouncer, keeps a bounded set of connections open and hands them out to requests as needed, so the expensive setup happens a fixed number of times at startup rather than once per request, and the number of real connections stays predictable regardless of request volume.',
        whyHi: 'Kyunki har PostgreSQL connection ek dedicated operating-system process dwara backed hai, ek connection establish karne mein real process creation aur initialization overhead shamil hai jo ek typical query chalane ki cost ke sapeksh substantial hai. Ek application jo har request ke liye ek naya connection kholti hai wo setup aur teardown cost har single request par pay karti hai. Ek connection pool ek bounded set of connections khुला rakhता hai aur unhe requests ko zaroorat ke hisaab se deता hai.',
      },
      {
        wrong: `-- using a plain SET for per-query tuning behind a transaction-mode pooler
BEGIN;
SET work_mem = '256MB';   -- plain SET, not SET LOCAL
SELECT ... /* a big reporting query that benefits from more work_mem */ ;
COMMIT;
-- the connection returns to the pool STILL at work_mem = 256MB, and the next
-- unrelated client to borrow it inherits that setting silently`,
        right: `BEGIN;
SET LOCAL work_mem = '256MB';   -- scoped to THIS transaction only
SELECT ... /* the big reporting query */ ;
COMMIT;
-- work_mem automatically reverts at COMMIT -- the next client borrowing this
-- pooled connection gets the normal default, not the leftover 256MB`,
        why: 'Under transaction-mode pooling, a physical database connection is returned to the pool at the end of each transaction and then handed to whichever client needs one next, which means any session-level state left on that connection by one client becomes the starting state for the next, entirely unrelated client. A plain SET changes a parameter for the remainder of the session, so a plain SET work_mem issued to tune one heavy query persists on the connection after that query\'s transaction commits, and the next client to borrow the connection silently inherits the elevated value, potentially causing that client\'s ordinary queries to use far more memory than intended, with the effect being intermittent and hard to diagnose since it depends on connection reuse timing. SET LOCAL restricts the change to the current transaction and reverts it automatically at COMMIT or ROLLBACK, which is exactly the scope needed for safe per-query tuning behind a transaction-mode pooler, and is the reason such tuning must always use SET LOCAL rather than plain SET in that environment.',
        whyHi: 'Transaction-mode pooling ke under, ek physical database connection har transaction ke ant mein pool ko wapas kiya jaता hai aur phir jo bhi client agla chahiye use diya jaता hai, jiska matlab hai ek client dwara us connection par chhoड़a gaya koi bhi session-level state agle, poori tarah unrelated client ke liye starting state ban jaता hai. `SET LOCAL` change ko current transaction tak restrict karta hai aur ise `COMMIT` ya `ROLLBACK` par automatically revert karta hai.',
      },
      {
        wrong: `-- setting work_mem very high globally "so complex queries are always fast"
ALTER SYSTEM SET work_mem = '512MB';
-- looks fine in testing with one query at a time -- then a traffic spike runs
-- 60 concurrent queries, each with a couple of sorts, and the server runs out
-- of memory (60 * 2 * 512MB is far more RAM than exists)`,
        right: `-- keep the global work_mem modest, and raise it only for specific known-heavy
-- queries via SET LOCAL within their own transaction:
ALTER SYSTEM SET work_mem = '8MB';   -- safe under high concurrency
-- then, for a specific report:
BEGIN; SET LOCAL work_mem = '256MB'; SELECT /* the heavy report */; COMMIT;`,
        why: 'work_mem limits memory for a single sort or hash operation within a single query, not for a query as a whole and not for the server as a whole, which means the true memory exposure from a given work_mem value is that value multiplied by the number of memory-intensive operations per query, multiplied again by the number of such queries running concurrently. A value that appears safe when tested with one query at a time can, under realistic concurrent load, imply a total memory demand many times larger than the machine has, leading to the operating system killing PostgreSQL processes or the server slowing dramatically as it swaps. The sound approach is to keep the global default low enough to be safe even at high concurrency, accepting that most queries will do fine with it, and to raise work_mem only for the specific, identified queries that genuinely benefit, scoped to their own transaction with SET LOCAL so the elevated value never applies broadly.',
        whyHi: '`work_mem` ek single query ke andar ek single sort ya hash operation ke liye memory limit karta hai, ek query ke liye poore roop mein nahi aur server ke liye poore roop mein nahi. Ek value jo ek query ek baar test karne par safe dikhती hai, realistic concurrent load ke under, machine ke paas jitni hai usse kई guna badी total memory demand imply kar sakti hai. Sound approach global default ko high concurrency par bhi safe rakhна hai, aur `work_mem` ko sirf specific, identified queries ke liye badhाना.',
      },
    ],

    realWorld: [
      {
        en: '**PgBouncer in transaction mode fronting a PostgreSQL instance for a fleet of application servers**, letting hundreds of app processes share ~25 real database connections and keeping the server far below `max_connections`.',
        hi: '**PgBouncer transaction mode mein ek PostgreSQL instance ko application servers ke ek fleet ke liye front karta hai**, sौ-sौ app processes ko ~25 real database connections share karne dete hue.',
      },
      {
        en: '**A codebase convention that all report/export queries wrap their `work_mem` bump in `BEGIN; SET LOCAL work_mem = ...; ... COMMIT;`** precisely because the app runs behind a transaction-mode pooler where a plain `SET` would leak.',
        hi: '**Ek codebase convention ki sabhi report/export queries apne `work_mem` bump ko `BEGIN; SET LOCAL work_mem = ...; ... COMMIT;` mein wrap karти hain** theek isliye kyunki app ek transaction-mode pooler ke peeche chalti hai.',
      },
      {
        en: '**An incident postmortem tracing an out-of-memory server crash to a globally elevated `work_mem` interacting with a concurrency spike** — resolved by lowering the global default and moving the bump to `SET LOCAL` on the two queries that needed it.',
        hi: '**Ek incident postmortem jo ek out-of-memory server crash ko ek globally elevated `work_mem` tak trace karta hai jo ek concurrency spike ke saath interact karta hai** — global default kam karके resolve kiya gaya.',
      },
    ],

    interviewQA: [
      {
        q: 'Why are PostgreSQL connections expensive, and how does a connection pooler help?',
        qHi: 'PostgreSQL connections mehange kyun hain, aur ek connection pooler kaise madad karta hai?',
        a: 'Each connection to PostgreSQL is served by its own dedicated operating-system process that the server forks, rather than a lightweight thread, so establishing a connection carries the real cost of process creation and initialization, which is substantial compared to the cost of executing a typical query. This has two practical effects: an application that opens a new connection per request spends a significant and avoidable fraction of its time on connection setup and teardown, and because each process consumes memory and scheduling overhead, the server can only sustain a bounded number of connections, enforced by the max_connections setting, beyond which new connections are simply refused. A connection pooler sits between the application and the database and maintains a small, fixed set of already-established connections, lending each one out to a client that needs it and taking it back when the client is done, so many application clients share a handful of real connections. This means the expensive per-process setup happens a fixed number of times rather than once per request, the number of real connections stays predictable and well under max_connections regardless of how many application clients exist, and the application effectively sees far more concurrency than the database is directly configured to allow.',
        aHi: 'PostgreSQL ka har connection apne dedicated operating-system process dwara serve hota hai jise server fork karta hai, ek lightweight thread ke bजाय, to ek connection establish karne mein process creation aur initialization ki real cost hai. Iske do practical effects hain: ek application jo har request ke liye ek naya connection kholti hai apne samay ka ek significant hissa connection setup par kharch karti hai, aur server sirf ek bounded sankhya rakh sakta hai (`max_connections`). Ek connection pooler application aur database ke beech baithता hai aur pehle-se-established connections ka ek chhota, fixed set maintain karta hai.',
      },
      {
        q: 'What is the difference between SET and SET LOCAL, and why does it matter behind a transaction-mode connection pooler?',
        qHi: '`SET` aur `SET LOCAL` mein kya antar hai, aur ye ek transaction-mode connection pooler ke peeche kyun matter karta hai?',
        a: 'A plain SET changes a configuration parameter for the remainder of the current session, so the new value persists across every subsequent transaction on that connection until it is explicitly changed again or the session ends. SET LOCAL restricts the change to the current transaction only, and PostgreSQL automatically reverts the parameter to its prior value when that transaction commits or rolls back. This distinction is mostly invisible with a direct connection, since a session maps to one client for its whole lifetime, but it becomes critical under transaction-mode pooling, where a physical connection is returned to the pool at the end of each transaction and then handed to a different, unrelated client. In that environment, a plain SET issued to tune one heavy query, such as raising work_mem, remains on the connection after that transaction commits, and the next client to borrow the connection silently inherits the elevated value, which can cause that client\'s ordinary queries to behave unexpectedly, with an intermittent, hard-to-diagnose pattern tied to connection reuse. SET LOCAL avoids this entirely by guaranteeing the change is scoped to and reverted with the single transaction that made it, which is why per-query tuning behind a transaction-mode pooler must always use SET LOCAL rather than plain SET.',
        aHi: 'Ek plain `SET` ek configuration parameter ko current session ke baaki hisse ke liye badalता hai. `SET LOCAL` change ko sirf current transaction tak restrict karta hai, aur PostgreSQL parameter ko automatically iski prior value par revert karta hai jab wo transaction commit ya rollback hota hai. Ye distinction ek direct connection ke saath zyadातार invisible hai, par transaction-mode pooling ke under critical ban jaта hai, jahaan ek physical connection har transaction ke ant mein pool ko wapas kiya jaता hai aur phir ek alag client ko diya jaता hai.',
      },
    ],

    exercises: [
      {
        task: 'Run `SHOW` for `work_mem`, `shared_buffers`, `effective_cache_size`, and `max_connections`. In a comment, note which one is a HINT to the planner that allocates no memory, and which one is measured PER sort/hash operation PER query.',
        taskHi: '`work_mem`, `shared_buffers`, `effective_cache_size`, aur `max_connections` ke liye `SHOW` chalao. Ek comment mein note karo kaunसा planner ko ek HINT hai jo koi memory allocate nahi karta, aur kaunसा PRATI sort/hash operation PRATI query measure hota hai.',
        hint: '`effective_cache_size` is the planner hint (allocates nothing, just informs plan choices). `work_mem` is the per-operation, per-query one — its true memory exposure is the value times operations per query times concurrent queries.',
        hintHi: '`effective_cache_size` planner hint hai (kuch allocate nahi karta). `work_mem` prati-operation, prati-query waala hai.',
      },
      {
        task: 'Run `SHOW work_mem`, then `SET work_mem = \'16MB\'`, then `SHOW work_mem` again — confirm the session value changed. Explain in a comment why this plain `SET` would be unsafe behind a transaction-mode pooler.',
        taskHi: '`SHOW work_mem` chalao, phir `SET work_mem = \'16MB\'`, phir dobara `SHOW work_mem` — confirm karo session value badla. Ek comment mein samjhaओ ki ye plain `SET` ek transaction-mode pooler ke peeche unsafe kyun hoगa.',
        hint: 'A plain `SET` persists for the rest of the session. Under transaction-mode pooling, the connection returns to the pool after the transaction still carrying that value, and the next unrelated client inherits it.',
        hintHi: 'Ek plain `SET` baaki session ke liye persist karta hai. Transaction-mode pooling ke under, connection us value ke saath pool ko wapas jaता hai aur agla unrelated client ise inherit karta hai.',
      },
      {
        task: 'Run `SHOW work_mem`, then `BEGIN; SET LOCAL work_mem = \'64MB\'; SHOW work_mem; COMMIT; SHOW work_mem`. Confirm the value is `64MB` inside the transaction and back to the default after `COMMIT`.',
        taskHi: '`SHOW work_mem` chalao, phir `BEGIN; SET LOCAL work_mem = \'64MB\'; SHOW work_mem; COMMIT; SHOW work_mem`. Confirm karo value transaction ke andar `64MB` hai aur `COMMIT` ke baad default par wapas.',
        hint: '`SET LOCAL` is transaction-scoped — PostgreSQL reverts it automatically at `COMMIT`/`ROLLBACK`, which is exactly what makes it safe for per-query tuning behind a transaction-mode pooler.',
        hintHi: '`SET LOCAL` transaction-scoped hai — PostgreSQL ise `COMMIT`/`ROLLBACK` par automatically revert karta hai.',
      },
    ],

    keyTakeaways: [
      'Every PostgreSQL connection is a full OS PROCESS (not a thread) — genuinely expensive to open, with a hard ceiling at `max_connections` (default 100). An app opening a fresh connection per request wastes major time on setup and hits the ceiling under load.',
      'A CONNECTION POOLER (PgBouncer, etc.) sits in front and multiplexes many application clients across a small fixed pool of real connections — a thousand mostly-idle clients served by ~20 real connections, keeping the server well under `max_connections`.',
      'SESSION MODE: a client holds a real connection for its whole session — plain `SET`, prepared statements, temp tables all work normally, but fewer clients can be served. TRANSACTION MODE: a client holds a connection for only ONE transaction, then it goes to someone else — far more clients served, but session state does NOT persist safely.',
      '`SET` changes a parameter for the rest of the SESSION; `SET LOCAL` scopes it to the current TRANSACTION and auto-reverts at `COMMIT`/`ROLLBACK`. Behind a transaction-mode pooler, per-query tuning MUST use `SET LOCAL` — a plain `SET` leaks the value onto the next client that borrows the connection.',
      '`work_mem`: memory PER sort/hash operation, PER query — true exposure = value × operations-per-query × concurrent-queries, so a value safe for one query can exhaust RAM under a concurrency spike. Keep the global default modest; bump specific heavy queries via `SET LOCAL`.',
      '`shared_buffers`: the server\'s main shared page cache (~25% of RAM is a common start). `effective_cache_size`: a HINT to the planner about total available cache — allocates NOTHING, just makes index scans more attractive. `max_connections`: the hard ceiling pooling exists to stay under.',
    ],
    keyTakeawaysHi: [
      'Har PostgreSQL connection ek poora OS PROCESS hai (thread nahi) — kholna genuinely mehanga, `max_connections` par ek hard ceiling ke saath (default 100).',
      'Ek CONNECTION POOLER (PgBouncer, waagairah) saamne baithता hai aur kई application clients ko real connections ke ek chhote fixed pool ke across multiplex karta hai.',
      'SESSION MODE: ek client ek real connection apne poore session ke liye rakhता hai. TRANSACTION MODE: ek client ek connection sirf EK transaction ke liye rakhता hai — session state safely persist NAHI karta.',
      '`SET` ek parameter ko baaki SESSION ke liye badalता hai; `SET LOCAL` ise current TRANSACTION tak scope karta hai aur `COMMIT`/`ROLLBACK` par auto-revert karta hai. Ek transaction-mode pooler ke peeche, per-query tuning ko `SET LOCAL` istemal karna ZAROORI hai.',
      '`work_mem`: memory PRATI sort/hash operation, PRATI query — true exposure = value × operations-per-query × concurrent-queries. Global default modest rakho; specific heavy queries ko `SET LOCAL` se badhाओ.',
      '`shared_buffers`: server ka main shared page cache (~25% RAM). `effective_cache_size`: planner ko ek HINT — KUCH allocate nahi karta. `max_connections`: hard ceiling.',
    ],
  },

  {
    slug: 'sql-vacuum-tuning-bloat-and-monitoring',
    title: 'VACUUM Tuning, Bloat & Monitoring',
    titleHi: 'VACUUM Tuning, Bloat Aur Monitoring',
    description: 'Module 10 covered what VACUUM does; this lesson covers operating it: tuning autovacuum per-table for a high-churn workload, the difference between plain VACUUM and VACUUM FULL, and the catalog views that let you watch a table\'s size and reclaim needs over time.',
    descriptionHi: 'Module 10 ne cover kiya ki VACUUM kya karta hai; ye lesson ise operate karna cover karta hai: ek high-churn workload ke liye autovacuum ko prati-table tune karna, plain VACUUM aur VACUUM FULL ke beech antar, aur wo catalog views jo aapको ek table ka size aur reclaim needs samay ke saath dekhने deте hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A shared workshop where the default cleaning schedule is fine for most benches, but the welding station needs its own, far more frequent sweep.** A workshop-wide rule like "sweep each bench once its floor is 20% covered in scrap" works reasonably for benches that only occasionally produce waste. But the welding station generates debris constantly, and by the time it hits the 20% threshold it is already a hazard and a bottleneck. The fix is not to change the whole workshop\'s schedule — that would over-clean every quiet bench — but to post a station-specific rule right at the welding bay: "sweep this one at 2%." PostgreSQL\'s autovacuum works exactly this way: a sensible cluster-wide default for how much dead-tuple accumulation triggers a cleanup, plus the ability to override that threshold on a single high-churn table that would otherwise bloat badly between cluster-default runs. A plain `VACUUM` is the routine sweep that makes the swept-up space reusable in place; `VACUUM FULL` is closing the whole bay to rebuild the bench from scratch so it physically takes up less room again — thorough, but nothing else can use that bay while it happens.',
      hi: '**Ek shared workshop jahaan default cleaning schedule zyadातार benches ke liye theek hai, par welding station ko apna, kई guna zyada frequent sweep chahiye.** Ek workshop-wide rule jaisा "har bench ko sweep karo jab iska floor 20% scrap se covered ho" un benches ke liye theek kaam karta hai jo sirf occasionally waste produce karte hain. Par welding station lगातार debris generate karta hai. Fix poore workshop ka schedule badalна nahi hai — balki welding bay par ek station-specific rule post karна: "ise 2% par sweep karो." PostgreSQL ka autovacuum bilkul aise kaam karta hai: ek sensible cluster-wide default, plus ek single high-churn table par us threshold ko override karne ki ability. Ek plain \`VACUUM\` routine sweep hai jo swept-up space ko jagah par reusable banata hai; \`VACUUM FULL\` poore bay ko band karके bench ko scratch se rebuild karна hai.',
    },

    simple: `**Per-table autovacuum tuning: override the cluster default for a high-churn table**

\`\`\`sql
CREATE TABLE queue (id int PRIMARY KEY, status text);
ALTER TABLE queue SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_cost_delay = 0);
SELECT reloptions FROM pg_class WHERE relname = 'queue';
\`\`\`
\`\`\`
 reloptions
------------------------------------------------------------------
 {autovacuum_vacuum_scale_factor=0.01,autovacuum_vacuum_cost_delay=0}
(1 row)
-- this queue table gets vacuumed once ~1% of its rows are dead, instead of
-- the cluster default (~20%) -- appropriate for a table churned constantly
\`\`\`

**Disabling autovacuum for one table (rare -- usually a mistake, occasionally deliberate)**

\`\`\`sql
ALTER TABLE some_table SET (autovacuum_enabled = false);
-- e.g. a table you bulk-load and bulk-replace on a fixed schedule and vacuum
-- manually right after -- but forgetting to re-enable is a classic bloat bug
\`\`\`

**\`VACUUM\` vs \`VACUUM FULL\`**
\`\`\`
VACUUM       -- marks dead-tuple space REUSABLE in place, light lock, runs often
             -- (does NOT shrink the file on disk)
VACUUM FULL  -- rewrites the WHOLE table compactly, RETURNS disk space to the OS,
             -- but takes an ACCESS EXCLUSIVE lock (blocks everything) for its
             -- whole duration -- pg_repack is the online alternative
\`\`\`

**Monitoring table size via the catalog (\`pg_stat_user_tables\` counters lag; \`pg_class\` updates on ANALYZE)**

\`\`\`sql
SELECT reltuples, relpages FROM pg_class WHERE relname = 'queue';   -- -1 / 0 before first ANALYZE
ANALYZE queue;
SELECT reltuples, relpages FROM pg_class WHERE relname = 'queue';   -- now a real row/page estimate
\`\`\``,

    simpleHi: `**Prati-table autovacuum tuning: ek high-churn table ke liye cluster default override karo**

\`\`\`sql
CREATE TABLE queue (id int PRIMARY KEY, status text);
ALTER TABLE queue SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_cost_delay = 0);
SELECT reloptions FROM pg_class WHERE relname = 'queue';
\`\`\`
\`\`\`
 reloptions
------------------------------------------------------------------
 {autovacuum_vacuum_scale_factor=0.01,autovacuum_vacuum_cost_delay=0}
(1 row)
\`\`\`

**Ek table ke liye autovacuum disable karna (rare -- usually ek mistake)**

\`\`\`sql
ALTER TABLE some_table SET (autovacuum_enabled = false);
\`\`\`

**\`VACUUM\` vs \`VACUUM FULL\`**
\`\`\`
VACUUM       -- dead-tuple space ko jagah par REUSABLE mark karta hai, light lock
             -- (disk par file ko SHRINK NAHI karta)
VACUUM FULL  -- POORI table ko compactly rewrite karta hai, disk space OS ko WAPAS karta hai,
             -- par apni poori duration ke liye ek ACCESS EXCLUSIVE lock leta hai
             -- pg_repack online alternative hai
\`\`\`

**Catalog se table size monitor karna**

\`\`\`sql
SELECT reltuples, relpages FROM pg_class WHERE relname = 'queue';   -- pehle ANALYZE se pehle -1 / 0
ANALYZE queue;
SELECT reltuples, relpages FROM pg_class WHERE relname = 'queue';   -- ab ek real row/page estimate
\`\`\``,

    content: `## Recap: what VACUUM does (Module 10, Lesson 5)

Every \`UPDATE\` and \`DELETE\` leaves a dead tuple — an old row version that still occupies physical space until reclaimed. \`VACUUM\` scans a table, identifies dead tuples no longer visible to any transaction, and marks their space reusable for future writes. \`autovacuum\` runs this automatically once a table accumulates enough dead tuples relative to its size. This lesson is about the operational side: tuning when autovacuum fires, choosing between \`VACUUM\` and \`VACUUM FULL\`, and monitoring what's happening.

## Per-table autovacuum tuning

Autovacuum's default trigger is roughly "when dead tuples reach 20% of the table's estimated live row count" (governed by \`autovacuum_vacuum_scale_factor\`, default \`0.2\`). That default is a reasonable compromise for a typical table, but a table under constant churn — a job queue, a session store, a counter table — can accumulate enough bloat to hurt performance long before hitting 20%, and waits too long between runs.

\`\`\`sql
CREATE TABLE queue (id int PRIMARY KEY, status text);
ALTER TABLE queue SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_cost_delay = 0);
SELECT reloptions FROM pg_class WHERE relname = 'queue';
\`\`\`

\`ALTER TABLE ... SET (...)\` stores these overrides in the table's \`reloptions\` (visible in \`pg_class\`), and autovacuum applies them to that one table instead of the cluster defaults. Setting \`autovacuum_vacuum_scale_factor = 0.01\` makes this queue table vacuum at roughly 1% dead tuples; \`autovacuum_vacuum_cost_delay = 0\` removes the throttling that normally paces autovacuum gently, letting it finish faster on a table where keeping up matters more than being unobtrusive.

## Disabling autovacuum for a table

\`\`\`sql
ALTER TABLE some_table SET (autovacuum_enabled = false);
\`\`\`

This is occasionally deliberate — a staging table that is bulk-loaded, fully consumed, and truncated on a fixed schedule might be vacuumed manually right after each load rather than reactively — but far more often it is a mistake, or a temporary measure someone forgot to reverse. A table with autovacuum disabled and no compensating manual \`VACUUM\` schedule will bloat without bound. If you disable it, the reason and the compensating process should both be documented.

## \`VACUUM\` vs \`VACUUM FULL\`

- **\`VACUUM\`** (plain) marks dead-tuple space as reusable *in place*, takes only a lightweight lock that does not block reads or writes, and is what runs routinely. It does **not** return space to the operating system — a bloated table stays the same size on disk, it just stops growing as the reclaimed space gets reused.
- **\`VACUUM FULL\`** rewrites the entire table into a new, compact file and drops the old one, genuinely shrinking the on-disk size and returning space to the OS — but it takes an \`ACCESS EXCLUSIVE\` lock for its entire duration, blocking every read and write against the table until it completes. On a large table this can mean minutes or hours of total unavailability.

Because \`VACUUM FULL\`'s lock makes it unusable on a busy production table, the common alternative is **\`pg_repack\`**, an extension that achieves the same compaction by building the new copy in the background and swapping it in with only a brief lock at the very end.

(Note: \`VACUUM\` in any form cannot run inside a transaction block, which is why it never appears combined with other statements — it is always issued on its own.)

## Monitoring: watching a table's size and health

\`pg_stat_user_tables\` exposes per-table counters like \`n_dead_tup\` (estimated dead tuples), \`n_live_tup\`, \`last_autovacuum\`, and \`seq_scan\` — the primary view for "is autovacuum keeping up with this table." (These counters are maintained by a background statistics collector and can lag slightly behind reality, but over any meaningful time window they are the right signal.)

\`pg_class\` carries \`reltuples\` and \`relpages\` — the planner's own row-count and page-count estimates for a table, refreshed by \`ANALYZE\` (and by autovacuum's analyze phase):

\`\`\`sql
SELECT reltuples, relpages FROM pg_class WHERE relname = 'queue';
ANALYZE queue;
SELECT reltuples, relpages FROM pg_class WHERE relname = 'queue';
\`\`\`

Before the first \`ANALYZE\`, \`reltuples\` reads \`-1\` (meaning "unknown"); afterward it holds a real estimate, and \`relpages\` reflects how many 8 KB pages the table occupies. Comparing \`relpages\` against what the live row count *should* require is a rough, quick bloat check: a table holding a thousand small rows that occupies far more pages than a thousand small rows need is carrying dead-tuple bloat that \`VACUUM\` (or \`VACUUM FULL\` / \`pg_repack\`) would reclaim.

Alongside these, \`pg_stat_activity\` (one row per connection, showing each one's current query and state) and \`pg_locks\` (one row per held or awaited lock) are the two views for diagnosing what is happening *right now* — a query that won't finish, a lock that is blocking others — and \`pg_stat_statements\` (Module 11, Lesson 6) is the extension for finding which queries consume the most time cumulatively.`,

    contentHi: `## Recap: VACUUM kya karta hai (Module 10, Lesson 5)

Har \`UPDATE\` aur \`DELETE\` ek dead tuple chhoड़ता hai. \`VACUUM\` ek table scan karta hai, dead tuples identify karta hai, aur unki space ko future writes ke liye reusable mark karta hai. \`autovacuum\` ise automatically chalाता hai. Ye lesson operational side ke baare mein hai.

## Prati-table autovacuum tuning

Autovacuum ka default trigger lgbhag "jab dead tuples table ke estimated live row count ke 20% tak pahunch jaayein" hai. Ek constant churn ke under table — ek job queue, ek session store — 20% tak pahunchне se bahut pehle kaafi bloat accumulate kar sakti hai.

\`\`\`sql
CREATE TABLE queue (id int PRIMARY KEY, status text);
ALTER TABLE queue SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_cost_delay = 0);
SELECT reloptions FROM pg_class WHERE relname = 'queue';
\`\`\`

\`ALTER TABLE ... SET (...)\` in overrides ko table ke \`reloptions\` mein store karta hai.

## Ek table ke liye autovacuum disable karna

\`\`\`sql
ALTER TABLE some_table SET (autovacuum_enabled = false);
\`\`\`

Ye occasionally deliberate hai, par bahut zyada aksar ek mistake hai. Autovacuum disabled aur koi compensating manual \`VACUUM\` schedule na hone waali ek table bina bound ke bloat karegi.

## \`VACUUM\` vs \`VACUUM FULL\`

- **\`VACUUM\`** (plain) dead-tuple space ko *jagah par* reusable mark karta hai, sirf ek lightweight lock leta hai. Ye disk par space OS ko wapas **nahi** karta.
- **\`VACUUM FULL\`** poori table ko ek naye, compact file mein rewrite karta hai, genuinely on-disk size shrink karte hue — par apni poori duration ke liye ek \`ACCESS EXCLUSIVE\` lock leta hai.

\`VACUUM FULL\` ke lock ki wajah se common alternative **\`pg_repack\`** hai.

(Note: \`VACUUM\` kisī bhi roop mein ek transaction block ke andar nahi chal sakta.)

## Monitoring

\`pg_stat_user_tables\` prati-table counters expose karta hai jaisā \`n_dead_tup\`, \`n_live_tup\`, \`last_autovacuum\`.

\`pg_class\` \`reltuples\` aur \`relpages\` carry karta hai — planner ke apne row-count aur page-count estimates, \`ANALYZE\` dwara refresh:

\`\`\`sql
SELECT reltuples, relpages FROM pg_class WHERE relname = 'queue';
ANALYZE queue;
SELECT reltuples, relpages FROM pg_class WHERE relname = 'queue';
\`\`\`

Pehle \`ANALYZE\` se pehle, \`reltuples\` \`-1\` padhता hai (matlab "unknown"); baad mein ye ek real estimate rakhता hai.

\`pg_stat_activity\` aur \`pg_locks\` abhi kya ho raha hai diagnose karne ke liye do views hain.`,

    examples: [
      {
        title: 'Per-table autovacuum tuning is stored in the table\'s reloptions',
        titleHi: 'Prati-table autovacuum tuning table ke reloptions mein store hota hai',
        code: `CREATE TABLE queue (id int PRIMARY KEY, status text);
ALTER TABLE queue SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_cost_delay = 0);
SELECT reloptions FROM pg_class WHERE relname = 'queue';`,
        output: ` reloptions
--------------------------------------------------------------------------
 ["autovacuum_vacuum_scale_factor=0.01","autovacuum_vacuum_cost_delay=0"]
(1 row)`,
        explain: "`ALTER TABLE ... SET (...)` stores both autovacuum overrides in the table's `reloptions` (queryable from `pg_class`). Autovacuum now applies these to `queue` alone instead of the cluster defaults — `scale_factor = 0.01` makes it vacuum at ~1% dead tuples, `cost_delay = 0` removes the throttling that normally paces it gently.",
        explainHi: '`ALTER TABLE ... SET (...)` dono autovacuum overrides ko table ke `reloptions` mein store karta hai (`pg_class` se queryable). Autovacuum ab inhe sirf `queue` par apply karta hai cluster defaults ke bजाy — `scale_factor = 0.01` ise ~1% dead tuples par vacuum karता hai, `cost_delay = 0` throttling hataता hai.',
      },
      {
        title: 'Autovacuum can be disabled per table (visible in reloptions)',
        titleHi: 'Autovacuum ko prati-table disable kiya ja sakta hai (reloptions mein visible)',
        code: `CREATE TABLE staging (id int PRIMARY KEY, raw text);
ALTER TABLE staging SET (autovacuum_enabled = false);
SELECT reloptions FROM pg_class WHERE relname = 'staging';`,
        output: ` reloptions
------------------------------
 ["autovacuum_enabled=false"]
(1 row)`,
        explain: '`autovacuum_enabled = false` is stored in `reloptions` just like any other per-table setting. This turns off automatic vacuuming for `staging` entirely — occasionally deliberate for a bulk-load-and-truncate table, but a table left this way with ongoing writes and no manual VACUUM schedule bloats without bound, with no error or alert to signal it.',
        explainHi: '`autovacuum_enabled = false` `reloptions` mein store hota hai jaise koi bhi doosra per-table setting. Ye `staging` ke liye automatic vacuuming poori tarah band karता hai — occasionally deliberate, par is tarah chhoड़i gayi ek table ongoing writes aur koi manual VACUUM schedule ke bina bina bound ke bloat karती hai.',
      },
      {
        title: 'pg_class.reltuples/relpages are unknown until ANALYZE populates them',
        titleHi: 'pg_class.reltuples/relpages ANALYZE se populate hone tak unknown hain',
        code: `CREATE TABLE queue (id int PRIMARY KEY, status text);
INSERT INTO queue SELECT g, 'pending' FROM generate_series(1, 100) g;
SELECT reltuples, relpages FROM pg_class WHERE relname = 'queue';
ANALYZE queue;
SELECT reltuples, relpages FROM pg_class WHERE relname = 'queue';`,
        output: ` reltuples | relpages
-----------+----------
 -1        | 0
(1 row)

 reltuples | relpages
-----------+----------
 100       | 1
(1 row)`,
        explain: 'Before any `ANALYZE`, `pg_class.reltuples` reads `-1` (meaning "unknown" — the planner has no estimate yet) and `relpages` reads `0`. After `ANALYZE queue`, both hold real values: `reltuples` is `100` (the actual row count) and `relpages` is `1` (the table fits in a single 8KB page). Comparing `relpages` against what the row count should need is a quick bloat check.',
        explainHi: 'Kisī bhi `ANALYZE` se pehle, `pg_class.reltuples` `-1` padhता hai (matlab "unknown") aur `relpages` `0` padhता hai. `ANALYZE queue` ke baad, dono real values rakhते hain: `reltuples` `100` hai (actual row count) aur `relpages` `1` hai. `relpages` ko row count ke against compare karna ek quick bloat check hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- leaving a high-churn table on the cluster-default autovacuum settings
CREATE TABLE job_queue (id int PRIMARY KEY, state text, claimed_at timestamptz);
-- millions of rows inserted, claimed (UPDATE), and deleted every hour --
-- autovacuum only fires at ~20% dead tuples, by which point the table is
-- badly bloated and every queue query has slowed down`,
        right: `CREATE TABLE job_queue (id int PRIMARY KEY, state text, claimed_at timestamptz);
ALTER TABLE job_queue SET (
  autovacuum_vacuum_scale_factor = 0.02,   -- vacuum at ~2% dead, not ~20%
  autovacuum_vacuum_cost_delay = 0          -- don't throttle it on this table
);`,
        why: 'The cluster-default autovacuum trigger, roughly twenty percent dead tuples relative to live rows, is calibrated for a typical table where writes are a modest fraction of activity and a periodic cleanup at that threshold keeps bloat acceptable. A table under constant, heavy churn, such as a job queue where rows are continuously inserted, updated as they are claimed, and deleted as they complete, generates dead tuples so fast that waiting until twenty percent means the table spends most of its time significantly bloated, with every query against it scanning through far more dead space than live data. Overriding the scale factor down to a small value for that specific table makes autovacuum fire far more often, keeping the dead-tuple fraction low continuously, and removing the cost delay lets each autovacuum run complete quickly rather than being paced gently, which matters on a table where falling behind compounds. This is a per-table override precisely because applying the same aggressive settings cluster-wide would waste effort constantly re-vacuuming quiet tables that do not need it.',
        whyHi: 'Cluster-default autovacuum trigger, lgbhag bees percent dead tuples, ek typical table ke liye calibrated hai. Ek constant, heavy churn ke under table, jaisā ek job queue, dead tuples itni tezi se generate karta hai ki bees percent tak wait karna matlab table apna zyadातार samay significantly bloated bitaता hai. Us specific table ke liye scale factor ko ek chhoti value tak override karna autovacuum ko kई guna zyada aksar fire karता hai.',
      },
      {
        wrong: `-- running VACUUM FULL on a large, busy production table to reclaim disk space
VACUUM FULL orders;
-- takes an ACCESS EXCLUSIVE lock on "orders" for its entire duration --
-- on a large table, that's minutes-to-hours where NO query can read or write
-- "orders" at all -- effectively an outage`,
        right: `-- use pg_repack (extension) for online compaction with only a brief final lock:
-- pg_repack -t orders -d mydb
-- or, if a maintenance window IS available and the table is small enough:
--   schedule VACUUM FULL during that window, communicated in advance
-- and for routine dead-space reuse (not shrinking the file), plain autovacuum
-- handles it with no meaningful locking at all`,
        why: 'VACUUM FULL genuinely reclaims disk space by rewriting the entire table into a fresh, compact file, but it can only do so by holding an ACCESS EXCLUSIVE lock on the table for the whole rewrite, which blocks every other read and write against that table until it finishes. On a small table this is a brief inconvenience, but on a large production table the rewrite can take minutes or hours, during which the table is completely unavailable to the application, which is functionally an outage for any feature that touches it. pg_repack exists specifically to solve this: it performs the same compaction by building the reorganized copy in the background while the table remains fully available, and only takes a brief exclusive lock at the very end to swap the new version in. For the routine goal of keeping reclaimed space available for reuse, as opposed to physically shrinking the file, plain autovacuum already does that continuously with only lightweight locking, so VACUUM FULL should be reserved for the specific case of needing to actually return disk space to the operating system, and even then pg_repack is usually the better tool on anything busy.',
        whyHi: '`VACUUM FULL` genuinely disk space reclaim karta hai poori table ko ek fresh, compact file mein rewrite karके, par ye sirf ek `ACCESS EXCLUSIVE` lock table par poore rewrite ke liye hold karके kar sakta hai. Ek large production table par rewrite minutes ya hours le sakta hai, jiske dauран table application ke liye poori tarah unavailable hai. `pg_repack` theek ise solve karne ke liye exist karta hai.',
      },
      {
        wrong: `-- disabling autovacuum on a table "temporarily" during a bulk migration,
-- then forgetting to re-enable it
ALTER TABLE big_table SET (autovacuum_enabled = false);
-- ... migration finishes, weeks pass, nobody re-enables it ...
-- big_table now bloats without bound, and the cause is invisible unless
-- someone thinks to check reloptions`,
        right: `-- if you must disable it for a migration, make re-enabling part of the SAME
-- change set, or set a reminder, and document why:
ALTER TABLE big_table SET (autovacuum_enabled = false);  -- migration NNNN, re-enable in migration NNNN+1
-- ... and immediately draft the follow-up:
ALTER TABLE big_table RESET (autovacuum_enabled);   -- or SET (autovacuum_enabled = true)`,
        why: 'Disabling autovacuum on a table removes the automatic mechanism that keeps its dead-tuple accumulation in check, so a table left in that state with ongoing write traffic and no compensating manual VACUUM schedule will grow in physical size indefinitely, with query performance degrading steadily as scans wade through more and more dead space. The failure mode is particularly insidious because there is no error, no alert, and no obvious symptom pointing at the cause: the table just gets slower and larger over time, and diagnosing it requires specifically inspecting the table\'s reloptions to notice autovacuum was turned off, which is not something anyone checks routinely. If autovacuum genuinely must be disabled for a bounded operation like a bulk migration, the re-enabling step should be part of the same planned change, ideally as an immediately-drafted follow-up migration, and the reason should be documented inline so a future investigator can understand why the setting exists.',
        whyHi: 'Ek table par autovacuum disable karna wo automatic mechanism hataता hai jo iski dead-tuple accumulation ko check mein rakhता hai. Failure mode particularly insidious hai kyunki koi error nahi, koi alert nahi: table bas samay ke saath slower aur larger hoती jaती hai. Agar autovacuum ko genuinely disable karna hai, re-enabling step usī planned change ka hissa hona chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**A job-queue table with `autovacuum_vacuum_scale_factor = 0.02` and `autovacuum_vacuum_cost_delay = 0`** set the day it was created, because at cluster defaults it bloated badly within hours of going live.',
        hi: '**Ek job-queue table jismein `autovacuum_vacuum_scale_factor = 0.02` aur `autovacuum_vacuum_cost_delay = 0`** iske banне ke din set kiye gaye.',
      },
      {
        en: '**A production runbook entry: "never `VACUUM FULL` a table over 1 GB during business hours — use `pg_repack`"**, written after a `VACUUM FULL` on the orders table caused a 40-minute partial outage.',
        hi: '**Ek production runbook entry: "business hours ke dauран 1 GB se badी table ko kabhi `VACUUM FULL` mat karo — `pg_repack` istemal karo"**.',
      },
      {
        en: '**A weekly monitoring check comparing each large table\'s `relpages` against its expected size from `reltuples`**, flagging any table whose physical footprint has drifted well beyond what its live row count justifies.',
        hi: '**Ek weekly monitoring check jo har large table ke `relpages` ko iske `reltuples` se expected size ke against compare karta hai**.',
      },
    ],

    interviewQA: [
      {
        q: 'Why would you tune autovacuum settings for a specific table rather than cluster-wide, and what settings would you change for a high-churn table?',
        qHi: 'Aap cluster-wide ke bजाy ek specific table ke liye autovacuum settings kyun tune karоge, aur ek high-churn table ke liye kaunsi settings badloge?',
        a: 'The cluster-wide autovacuum defaults, most notably a scale factor that triggers a vacuum once dead tuples reach roughly twenty percent of a table\'s live row count, are a reasonable compromise for a typical table where writes are a modest share of activity. A table under constant, heavy write churn, such as a job queue or session store where rows are continuously inserted, updated, and deleted, produces dead tuples fast enough that waiting for the twenty percent threshold leaves it significantly bloated most of the time, slowing every query against it. Applying an aggressive setting cluster-wide to fix that would waste resources constantly re-vacuuming the many quiet tables that do not need it, so the correct approach is a per-table override on the specific high-churn table. For such a table, lowering autovacuum_vacuum_scale_factor to something like one or two percent makes autovacuum fire far more often, keeping the dead-tuple fraction continuously low, and setting autovacuum_vacuum_cost_delay to zero removes the throttling that normally paces autovacuum gently, letting each run finish quickly on a table where falling behind compounds rapidly.',
        aHi: 'Cluster-wide autovacuum defaults, sabse notably ek scale factor jo ek vacuum trigger karta hai jab dead tuples table ke live row count ke lगभग bees percent tak pahunch jaayein, ek typical table ke liye ek reasonable compromise hai. Ek constant, heavy write churn ke under table dead tuples itni tezi se produce karta hai ki bees percent threshold ke liye wait karna use zyadातार samay significantly bloated chhoड़ता hai. Aisī table ke liye, `autovacuum_vacuum_scale_factor` ko ek ya do percent jaisा kुछ tak kam karna autovacuum ko kई guna zyada aksar fire karता hai.',
      },
      {
        q: 'What is the difference between VACUUM and VACUUM FULL, and why is pg_repack usually preferred over VACUUM FULL in production?',
        qHi: '`VACUUM` aur `VACUUM FULL` mein kya antar hai, aur production mein `pg_repack` usually `VACUUM FULL` par kyun prefer kiya jaata hai?',
        a: 'Plain VACUUM identifies dead tuples that are no longer visible to any transaction and marks the space they occupy as available for reuse by future inserts and updates, doing so in place, holding only a lightweight lock that does not block reads or writes; it does not, however, return any space to the operating system, so a table that has bloated stays the same physical size on disk and simply stops growing as the reclaimed space gets reused. VACUUM FULL instead rewrites the entire table into a brand-new, compact file and drops the old one, which genuinely shrinks the table\'s on-disk footprint and returns space to the operating system, but it can only do this while holding an ACCESS EXCLUSIVE lock on the table for the full duration of the rewrite, blocking every read and write against that table until it completes, which on a large table can mean an extended outage. pg_repack is an extension that achieves the same compaction as VACUUM FULL but performs the rewrite in the background while the table remains fully available, taking only a brief exclusive lock at the very end to swap in the reorganized copy, which is why it is the standard choice for reclaiming disk space on a busy production table where VACUUM FULL\'s long lock would be unacceptable.',
        aHi: 'Plain `VACUUM` dead tuples identify karta hai aur wo space jo wo occupy karte hain future inserts aur updates dwara reuse ke liye available mark karta hai, jagah par, sirf ek lightweight lock hold karके; ye, halाnki, koi space operating system ko wapas nahi karta. `VACUUM FULL` iske bजाy poori table ko ek bilkul naye, compact file mein rewrite karta hai, jo genuinely table ke on-disk footprint ko shrink karta hai, par ye sirf poore rewrite ke liye ek `ACCESS EXCLUSIVE` lock hold karके kar sakta hai. `pg_repack` ek extension hai jo wahi compaction achieve karta hai par rewrite background mein perform karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Create a table `queue(id int PRIMARY KEY, status text)`. Run `ALTER TABLE queue SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_cost_delay = 0)`, then query `reloptions` from `pg_class` for that table and confirm both settings are stored.',
        taskHi: 'Ek table `queue(id, status)` banao. `ALTER TABLE queue SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_cost_delay = 0)` chalao, phir us table ke liye `pg_class` se `reloptions` query karo aur confirm karo dono settings stored hain.',
        hint: 'Per-table autovacuum overrides live in the table\'s `reloptions`, applied to just that table instead of the cluster defaults — appropriate for a table churned far more heavily than average.',
        hintHi: 'Prati-table autovacuum overrides table ke `reloptions` mein rehte hain, sirf us table par apply hote hain.',
      },
      {
        task: 'Create a table `staging(id int PRIMARY KEY, raw text)` and disable autovacuum for it with `ALTER TABLE staging SET (autovacuum_enabled = false)`. Confirm via `reloptions`. In a comment, explain why forgetting to re-enable this is a classic bloat bug.',
        taskHi: 'Ek table `staging(id, raw)` banao aur iske liye autovacuum disable karo `ALTER TABLE staging SET (autovacuum_enabled = false)` se. `reloptions` se confirm karo. Ek comment mein samjhaओ ki ise dobara enable karna bhoolna ek classic bloat bug kyun hai.',
        hint: 'A table with autovacuum disabled and no manual VACUUM schedule bloats without bound — and there\'s no error or alert, so the cause stays invisible unless someone checks `reloptions`.',
        hintHi: 'Autovacuum disabled aur koi manual VACUUM schedule na hone waali ek table bina bound ke bloat karti hai — aur koi error ya alert nahi.',
      },
      {
        task: 'Create a table `queue(id int PRIMARY KEY, status text)`, insert 100 rows, and query `reltuples, relpages` from `pg_class`. Note the values. Then run `ANALYZE queue` and query again — confirm `reltuples` goes from `-1` (unknown) to a real estimate.',
        taskHi: 'Ek table `queue(id, status)` banao, 100 rows insert karo, aur `pg_class` se `reltuples, relpages` query karo. Values note karo. Phir `ANALYZE queue` chalao aur dobara query karo — confirm karo `reltuples` `-1` (unknown) se ek real estimate mein jaता hai.',
        hint: '`reltuples = -1` means the planner has no row-count estimate yet. `ANALYZE` (and autovacuum\'s analyze phase) populates it — comparing `relpages` against what the row count should need is a quick bloat check.',
        hintHi: '`reltuples = -1` matlab planner ke paas abhi koi row-count estimate nahi hai. `ANALYZE` ise populate karta hai.',
      },
    ],

    keyTakeaways: [
      'Module 10 covered WHAT VACUUM does; this is OPERATING it. Autovacuum\'s cluster default fires at ~20% dead tuples (`autovacuum_vacuum_scale_factor = 0.2`) — fine for a typical table, too slow for a high-churn one (job queue, session store, counter table).',
      'PER-TABLE autovacuum tuning: `ALTER TABLE t SET (autovacuum_vacuum_scale_factor = 0.02, autovacuum_vacuum_cost_delay = 0)` — stored in the table\'s `reloptions` (visible in `pg_class`), applied to just that table. Lower scale factor = vacuum more often; zero cost delay = don\'t throttle it.',
      '`ALTER TABLE t SET (autovacuum_enabled = false)` — occasionally deliberate (bulk-load-and-truncate staging tables vacuumed manually), but usually a mistake. Disabled + no manual VACUUM = unbounded bloat, with NO error or alert — invisible unless someone checks `reloptions`.',
      '`VACUUM` (plain): marks dead space REUSABLE in place, lightweight lock, runs routinely — does NOT shrink the file on disk. `VACUUM FULL`: rewrites the whole table compactly and RETURNS disk space to the OS, but holds an `ACCESS EXCLUSIVE` lock (blocks ALL reads/writes) for its entire duration — effectively an outage on a large table. `pg_repack` is the online alternative (background rebuild, brief final lock).',
      'VACUUM (any form) CANNOT run inside a transaction block — always issued on its own.',
      'MONITORING: `pg_stat_user_tables` (`n_dead_tup`, `n_live_tup`, `last_autovacuum` — background-collected, lags slightly). `pg_class.reltuples`/`relpages` (planner\'s row/page estimates, refreshed by `ANALYZE`; `reltuples = -1` means unknown). `pg_stat_activity` + `pg_locks` for what\'s happening RIGHT NOW; `pg_stat_statements` (Module 11) for cumulative worst queries.',
    ],
    keyTakeawaysHi: [
      'Module 10 ne cover kiya VACUUM KYA karta hai; ye ise OPERATE karna hai. Autovacuum ka cluster default ~20% dead tuples par fire hota hai — ek typical table ke liye theek, ek high-churn ke liye bahut slow.',
      'PRATI-TABLE autovacuum tuning: `ALTER TABLE t SET (autovacuum_vacuum_scale_factor = 0.02, autovacuum_vacuum_cost_delay = 0)` — table ke `reloptions` mein store, sirf us table par apply. Kam scale factor = zyada aksar vacuum.',
      '`ALTER TABLE t SET (autovacuum_enabled = false)` — occasionally deliberate, par usually ek mistake. Disabled + koi manual VACUUM nahi = unbounded bloat, KOI error ya alert ke bina.',
      '`VACUUM` (plain): dead space ko jagah par REUSABLE mark karta hai, lightweight lock — file ko disk par SHRINK NAHI karta. `VACUUM FULL`: poori table ko compactly rewrite karta hai aur disk space OS ko WAPAS karta hai, par apni poori duration ke liye ek `ACCESS EXCLUSIVE` lock hold karता hai. `pg_repack` online alternative hai.',
      'VACUUM (kisi bhi roop mein) ek transaction block ke andar NAHI chal sakta.',
      'MONITORING: `pg_stat_user_tables` (`n_dead_tup`, `n_live_tup`, `last_autovacuum` — background-collected, thoda lag). `pg_class.reltuples`/`relpages` (`ANALYZE` dwara refresh; `reltuples = -1` matlab unknown). `pg_stat_activity` + `pg_locks` abhi kya ho raha hai ke liye; `pg_stat_statements` (Module 11) cumulative worst queries ke liye.',
    ],
  },

  {
    slug: 'sql-wal-replication-backups-and-zero-downtime-changes',
    title: 'WAL, Replication, Backups & Zero-Downtime Changes',
    titleHi: 'WAL, Replication, Backups Aur Zero-Downtime Changes',
    description: 'The write-ahead log is the mechanism behind crash recovery, replication, and point-in-time backups all at once. This closing lesson connects those pieces and then covers the one operational skill every developer needs hands-on: changing a schema on a live database without downtime.',
    descriptionHi: 'Write-ahead log crash recovery, replication, aur point-in-time backups sabke peeche ka mechanism hai, ek saath. Ye closing lesson un pieces ko connect karta hai aur phir wo ek operational skill cover karta hai jo har developer ko hands-on chahiye: ek live database par bina downtime ke ek schema badalна.',
    difficulty: 'HARD',
    duration: 26,
    order: 6,

    analogy: {
      en: '**A bank that writes every transaction into a permanent ledger BEFORE updating any account balance — and keeps a courier continuously carrying copies of new ledger pages to a branch across town.** The bank\'s core discipline is that nothing is considered done until it is written in the append-only ledger; the account balances on the wall are just a convenient summary that can always be rebuilt by replaying the ledger from the start. That ledger is the write-ahead log (WAL): every change is recorded there first, so a power cut mid-update loses nothing — on restart, the bank replays any ledger entries that hadn\'t yet made it to the balances. Because the ledger is a complete, ordered record, a courier carrying copies of each new page to a second branch keeps that branch a perfect replica, just slightly behind — this is replication. And keeping every ledger page ever written, plus one old photograph of the balances, means the bank can reconstruct its exact state at any past moment by replaying the ledger up to that point — this is point-in-time recovery. Changing the ledger\'s format while the bank is open, though, is the delicate part: you cannot just swap in new columns mid-day, you add them empty, fill them in gradually between customers, and only then start requiring them.',
      hi: '**Ek bank jo har transaction ko ek permanent ledger mein likhता hai KISI BHI account balance update karne SE PEHLE — aur ek courier ko lगात  ledger ke naye pages ki copies shaher ke paar ek branch tak le jaate rakhता hai.** Bank ki core discipline ye hai ki kuch bhi done nahi maana jaता jab tak wo append-only ledger mein likhा na ho. Wo ledger write-ahead log (WAL) hai: har change wahaan pehle record hota hai, to ek update ke beech mein power cut kuch nahi khoता. Kyunki ledger ek complete, ordered record hai, ek courier har naye page ki copies ek doosri branch tak le jaate hue us branch ko ek perfect replica rakhता hai — ye replication hai. Aur har ledger page rakhна, plus balances ki ek purани photograph, matlab bank apni exact state kisī bhi past moment par reconstruct kar sakta hai — ye point-in-time recovery hai.',
    },

    simple: `**The write-ahead log (WAL): every change is written to the log BEFORE the table itself**

\`\`\`
1. change is written to the WAL, and flushed to disk        <- transaction is now "durable"
2. the actual table page is updated (in memory, later on disk)
-- a crash between 1 and 2 loses nothing: on restart, PostgreSQL REPLAYS the WAL
\`\`\`

**One WAL, three features:**
\`\`\`
crash recovery  -- replay WAL entries not yet applied to table files
replication     -- stream the WAL to another server, which replays it -> a live replica
PITR backups    -- keep a base backup + all WAL since -> restore to ANY point in time
\`\`\`

**\`wal_level\` gates what the WAL supports; a primary is not "in recovery"**

\`\`\`sql
SHOW wal_level;              -- 'replica' (default) supports physical replication;
                            -- 'logical' is needed for logical replication
SELECT pg_is_in_recovery();  -- false on a primary; true on a standby/replica
\`\`\`

**Physical vs logical replication**
\`\`\`
physical  -- byte-level copy of the whole cluster -- replica is identical, read-only,
            all-or-nothing -- the standard for high availability + read replicas
logical   -- replicates specific tables as row-level changes -- replica can differ,
            can be a different PG version -- for selective sync, migrations, CDC
\`\`\`

**Zero-downtime schema change: add nullable -> backfill -> add constraint \`NOT VALID\` -> \`VALIDATE\`**

\`\`\`sql
ALTER TABLE users ADD COLUMN email_verified boolean;              -- 1. instant, nullable
UPDATE users SET email_verified = false WHERE email_verified IS NULL;  -- 2. backfill in batches
ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT false;  -- 3. default for new rows
ALTER TABLE users ADD CONSTRAINT ev_nn CHECK (email_verified IS NOT NULL) NOT VALID;  -- 4. cheap
ALTER TABLE users VALIDATE CONSTRAINT ev_nn;                      -- 5. scans, but doesn't block writes
\`\`\``,

    simpleHi: `**Write-ahead log (WAL): har change log mein likhा jaता hai TABLE SE PEHLE**

\`\`\`
1. change WAL mein likhа jaता hai, aur disk par flush hota hai    <- transaction ab "durable" hai
2. actual table page update hota hai (memory mein, baad mein disk par)
-- 1 aur 2 ke beech ek crash kuch nahi khoता: restart par, PostgreSQL WAL REPLAY karta hai
\`\`\`

**Ek WAL, teen features:**
\`\`\`
crash recovery  -- WAL entries replay karo jo abhi table files par apply nahi hui
replication     -- WAL ko ek doosre server par stream karo, jo ise replay karta hai
PITR backups    -- ek base backup + tabse sabhi WAL rakho -> KISI BHI point in time par restore
\`\`\`

**\`wal_level\` gate karta hai WAL kya support karta hai; ek primary "in recovery" nahi hai**

\`\`\`sql
SHOW wal_level;              -- 'replica' (default) physical replication support karta hai;
                            -- 'logical' logical replication ke liye chahiye
SELECT pg_is_in_recovery();  -- ek primary par false; ek standby/replica par true
\`\`\`

**Physical vs logical replication**
\`\`\`
physical  -- poore cluster ka byte-level copy -- replica identical, read-only, all-or-nothing
logical   -- specific tables ko row-level changes ke roop mein replicate karta hai --
            replica differ kar sakta hai, ek alag PG version ho sakta hai
\`\`\`

**Zero-downtime schema change: add nullable -> backfill -> add constraint \`NOT VALID\` -> \`VALIDATE\`**

\`\`\`sql
ALTER TABLE users ADD COLUMN email_verified boolean;              -- 1. instant, nullable
UPDATE users SET email_verified = false WHERE email_verified IS NULL;  -- 2. batches mein backfill
ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT false;  -- 3. naye rows ke liye default
ALTER TABLE users ADD CONSTRAINT ev_nn CHECK (email_verified IS NOT NULL) NOT VALID;  -- 4. sasta
ALTER TABLE users VALIDATE CONSTRAINT ev_nn;                      -- 5. scan karta hai, par writes block nahi karta
\`\`\``,

    content: `## The write-ahead log

PostgreSQL never updates a table file directly as the first step of a change. Instead, it writes a record of the change to the **write-ahead log (WAL)** — a sequential, append-only log on disk — and flushes that to disk *before* the transaction is reported as committed. Only afterward is the actual table page updated, which can happen lazily, in memory first and on disk later.

This ordering ("log ahead of data") is what makes a transaction **durable**: if the server crashes after the commit but before the table page made it to disk, the change is not lost, because on restart PostgreSQL replays every WAL record that hadn't yet been applied, reconstructing exactly the committed state. Crash recovery *is* WAL replay.

## One log, three features

Because the WAL is a complete, ordered record of every change, the same mechanism powers three distinct capabilities:

- **Crash recovery** — replay unapplied WAL on startup, as above.
- **Replication** — stream the WAL to another server as it is generated; that server replays it continuously, staying a near-live copy of the primary.
- **Point-in-time recovery (PITR)** — keep a full base backup plus every WAL segment generated since, and you can restore the database to its exact state at *any* moment in that window by replaying WAL up to a chosen point (just before an accidental \`DROP TABLE\`, for instance).

\`\`\`sql
SHOW wal_level;
SELECT pg_is_in_recovery();
\`\`\`

\`wal_level\` controls how much information the WAL carries: \`replica\` (the default) carries enough for physical replication and PITR; \`logical\` carries additional detail needed for logical replication. \`pg_is_in_recovery()\` returns \`false\` on a primary and \`true\` on a standby that is continuously replaying WAL from a primary — a simple way for an application or a health check to tell which kind of server it is connected to.

## Physical vs logical replication

- **Physical replication** ships the raw WAL, byte for byte, so the standby is an exact block-level copy of the entire primary cluster — every database, every table, identical. A physical standby is read-only and cannot selectively replicate or transform anything; its strengths are simplicity and completeness, making it the standard basis for high availability (promote the standby if the primary fails) and for read replicas (route read-only queries to standbys to offload the primary).
- **Logical replication** decodes the WAL into a stream of row-level changes (this row was inserted, this one updated) for specific, chosen tables, and applies them to a target that can be structured differently, run a different PostgreSQL major version, or already contain other data. Its flexibility makes it the tool for selective synchronization, major-version upgrades with minimal downtime, and change-data-capture pipelines feeding other systems.

Failover — automatically promoting a standby to primary when the primary fails — is not built into PostgreSQL itself; tools like **Patroni** add the cluster coordination, health checking, and automated promotion around PostgreSQL's replication primitives.

## Backups: \`pg_dump\` vs physical base backups

- **\`pg_dump\`** produces a logical backup: a file of SQL statements (or a custom archive) that recreates the database's contents. It is portable across PostgreSQL versions and architectures, can back up a single database or table, and is the right tool for moving data between environments — but restoring a large database from a dump is slow, since it replays every \`INSERT\` and rebuilds every index.
- **\`pg_basebackup\`** produces a physical backup: a byte-level copy of the cluster's data files, which combined with archived WAL is what enables PITR. Restoring is fast (it is a file copy plus WAL replay, not statement re-execution), but the backup is tied to the exact PostgreSQL version and platform.

A typical production setup uses physical base backups plus continuous WAL archiving for fast recovery and PITR, and periodic \`pg_dump\`s as a portable, version-independent secondary safety net.

## Zero-downtime schema changes

The one operational skill every developer needs hands-on is changing a schema on a live, high-traffic database without locking anyone out. The danger is that some \`ALTER TABLE\` operations take an \`ACCESS EXCLUSIVE\` lock and hold it while scanning or rewriting the whole table — instant on a small table, a multi-minute outage on a large one.

The safe pattern for adding a required column, demonstrated here for a \`NOT NULL\`-style requirement, breaks the change into individually cheap steps:

\`\`\`sql
ALTER TABLE users ADD COLUMN email_verified boolean;
UPDATE users SET email_verified = false WHERE email_verified IS NULL;
ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT false;
ALTER TABLE users ADD CONSTRAINT email_verified_not_null CHECK (email_verified IS NOT NULL) NOT VALID;
ALTER TABLE users VALIDATE CONSTRAINT email_verified_not_null;
\`\`\`

1. **Add the column as nullable** — instant, since existing rows just read as \`NULL\` with no rewrite.
2. **Backfill in batches** — an \`UPDATE\` (ideally chunked by primary key in the application, not one giant statement) fills in the value for existing rows without a schema lock.
3. **Set the default** for future inserts — a metadata-only change on modern PostgreSQL.
4. **Add the constraint as \`NOT VALID\`** — this records the constraint and enforces it on all *new* writes immediately, but explicitly skips scanning existing rows, so it takes only a brief lock regardless of table size.
5. **\`VALIDATE\` the constraint** — this does scan every existing row to confirm compliance, but it takes only a \`SHARE UPDATE EXCLUSIVE\` lock, which does not block reads or writes, just other schema changes.

The \`NOT VALID\` / \`VALIDATE\` split is the key move: it separates "start enforcing this rule" (cheap, instant) from "prove the existing data already complies" (a scan, but non-blocking). A \`NOT VALID\` constraint still rejects any new row that violates it — it only defers the check of pre-existing rows.

## Closing Module 12 and Part II

This closes Module 12 and Part II. The course has now covered the SQL core (Modules 1-10) and PostgreSQL's power features and operational reality (Modules 11-12). Part III moves to a fundamentally different model: MongoDB and the document database paradigm.`,

    contentHi: `## Write-ahead log

PostgreSQL kabhi ek table file ko seedhe ek change ke pehle step ke roop mein update nahi karta. Iske bजाy, ye change ka ek record **write-ahead log (WAL)** mein likhता hai — disk par ek sequential, append-only log — aur ise disk par flush karता hai transaction ke committed report hone *se pehle*.

Ye ordering wo hai jo ek transaction ko **durable** banaता hai: agar server commit ke baad par table page disk par pahunchne se pehle crash hota hai, change lost nahi hota, kyunki restart par PostgreSQL har WAL record replay karta hai jo abhi apply nahi hua thа.

## Ek log, teen features

- **Crash recovery** — startup par unapplied WAL replay karo.
- **Replication** — WAL ko ek doosre server par stream karo jaise ye generate hota hai.
- **Point-in-time recovery (PITR)** — ek full base backup plus tabse har WAL segment rakho.

\`\`\`sql
SHOW wal_level;
SELECT pg_is_in_recovery();
\`\`\`

\`wal_level\` control karta hai WAL кितni information carry karta hai. \`pg_is_in_recovery()\` ek primary par \`false\` aur ek standby par \`true\` lautaता hai.

## Physical vs logical replication

- **Physical replication** raw WAL ship karta hai, byte for byte — standby poore primary cluster ka ek exact block-level copy hai. High availability aur read replicas ke liye standard.
- **Logical replication** WAL ko specific, chosen tables ke liye row-level changes ke ek stream mein decode karta hai. Selective synchronization, major-version upgrades ke liye tool.

Failover PostgreSQL mein built-in nahi hai; **Patroni** jaisе tools cluster coordination add karте hain.

## Backups: \`pg_dump\` vs physical base backups

- **\`pg_dump\`** ek logical backup produce karta hai. Versions ke across portable, par ek large database ko restore karna slow hai.
- **\`pg_basebackup\`** ek physical backup produce karta hai. Restore karna fast hai, par backup exact PostgreSQL version se tied hai.

## Zero-downtime schema changes

Danger ye hai ki kुछ \`ALTER TABLE\` operations ek \`ACCESS EXCLUSIVE\` lock leते hain aur ise poori table scan ya rewrite karte hue hold karте hain.

\`\`\`sql
ALTER TABLE users ADD COLUMN email_verified boolean;
UPDATE users SET email_verified = false WHERE email_verified IS NULL;
ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT false;
ALTER TABLE users ADD CONSTRAINT email_verified_not_null CHECK (email_verified IS NOT NULL) NOT VALID;
ALTER TABLE users VALIDATE CONSTRAINT email_verified_not_null;
\`\`\`

1. **Column ko nullable add karo** — instant.
2. **Batches mein backfill** — ek \`UPDATE\` bina ek schema lock ke.
3. **Default set karo** future inserts ke liye.
4. **Constraint ko \`NOT VALID\` add karo** — ye constraint record karta hai aur ise sabhi *naye* writes par turant enforce karta hai, par existing rows scan karna explicitly skip karta hai.
5. **Constraint \`VALIDATE\` karo** — ye har existing row scan karta hai, par sirf ek \`SHARE UPDATE EXCLUSIVE\` lock leта hai jo reads ya writes block nahi karta.

\`NOT VALID\` / \`VALIDATE\` split key move hai.

## Module 12 aur Part II ko band karna

Ye Module 12 aur Part II ko band karta hai. Part III ek fundamentally alag model par jaता hai: MongoDB.`,

    examples: [
      {
        title: 'wal_level and pg_is_in_recovery report the server\'s replication configuration and role',
        titleHi: 'wal_level aur pg_is_in_recovery server ki replication configuration aur role report karte hain',
        code: `SHOW wal_level;
SHOW max_wal_senders;
SELECT pg_is_in_recovery() AS is_standby;`,
        output: ` wal_level
-----------
 replica
(1 row)

 max_wal_senders
-----------------
 10
(1 row)

 is_standby
------------
 f
(1 row)`,
        explain: '`wal_level` is `replica` (the default), which carries enough WAL detail for physical replication and point-in-time recovery — `logical` would be needed for logical replication. `max_wal_senders` 10 caps concurrent replication streams. `pg_is_in_recovery()` returns `f` (false), so this server is a primary, not a standby continuously replaying WAL.',
        explainHi: '`wal_level` `replica` hai (default), jo physical replication aur point-in-time recovery ke liye kaafi WAL detail carry karta hai — logical replication ke liye `logical` chahiye. `max_wal_senders` 10 concurrent replication streams cap karta hai. `pg_is_in_recovery()` `f` (false) lautaता hai, to ye server ek primary hai, ek standby nahi.',
      },
      {
        title: 'The zero-downtime pattern: add nullable, backfill, default, NOT VALID, VALIDATE',
        titleHi: 'Zero-downtime pattern: add nullable, backfill, default, NOT VALID, VALIDATE',
        code: `CREATE TABLE users (id int PRIMARY KEY, email text);
INSERT INTO users VALUES (1, 'a@x.com'), (2, 'b@x.com');
ALTER TABLE users ADD COLUMN email_verified boolean;
UPDATE users SET email_verified = false WHERE email_verified IS NULL;
ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT false;
ALTER TABLE users ADD CONSTRAINT email_verified_not_null CHECK (email_verified IS NOT NULL) NOT VALID;
ALTER TABLE users VALIDATE CONSTRAINT email_verified_not_null;
SELECT id, email, email_verified FROM users ORDER BY id;`,
        output: ` id | email   | email_verified
----+---------+----------------
 1  | a@x.com | f
 2  | b@x.com | f
(2 rows)`,
        explain: 'Each step is individually cheap and non-blocking: add the column nullable (instant), backfill with `UPDATE` (row locks only), `SET DEFAULT` (metadata only), `ADD CONSTRAINT ... NOT VALID` (brief lock, no existing-row scan), then `VALIDATE CONSTRAINT` (scans existing rows but under a lock that permits concurrent reads/writes). The final state: every row has `email_verified = false`.',
        explainHi: 'Har step individually sasta aur non-blocking hai: column ko nullable add karo (instant), `UPDATE` se backfill (sirf row locks), `SET DEFAULT` (sirf metadata), `ADD CONSTRAINT ... NOT VALID` (brief lock, koi existing-row scan nahi), phir `VALIDATE CONSTRAINT` (existing rows scan karta hai par ek lock ke under jo concurrent reads/writes permit karta hai). Final state: har row ka `email_verified = false`.',
      },
      {
        title: 'A NOT VALID constraint skips existing rows but still enforces new writes; VALIDATE checks the rest',
        titleHi: 'Ek NOT VALID constraint existing rows skip karta hai par naye writes enforce karta hai; VALIDATE baaki check karta hai',
        code: `CREATE TABLE users (id int PRIMARY KEY, age int);
INSERT INTO users VALUES (1, -5), (2, 30);
ALTER TABLE users ADD CONSTRAINT age_positive CHECK (age > 0) NOT VALID;
INSERT INTO users VALUES (3, 40);
SELECT id, age FROM users ORDER BY id;`,
        output: ` id | age
----+-----
 1  | -5
 2  | 30
 3  | 40
(3 rows)`,
        explain: 'The `age = -5` row was inserted BEFORE the `CHECK (age > 0) NOT VALID` constraint was added, and `NOT VALID` tells PostgreSQL to skip scanning pre-existing rows — so that violating row survives, and all three rows coexist. But `NOT VALID` still enforces the rule on every NEW write from the moment it is added: an `INSERT` with `age = 40` succeeds, while one with `age <= 0` would be rejected.',
        explainHi: '`age = -5` row `CHECK (age > 0) NOT VALID` constraint add hone SE PEHLE insert hui thi, aur `NOT VALID` PostgreSQL ko pre-existing rows scan karna skip karne ko kehта hai — to wo violating row bachती hai, aur teenon rows coexist karti hain. Par `NOT VALID` phir bhi har NAYE write par rule enforce karta hai add hone ke pal se: `age = 40` waala ek `INSERT` succeed hota hai, jabki `age <= 0` waala reject hoga.',
      },
    ],

    mistakes: [
      {
        wrong: `-- adding a NOT NULL column with a default directly, on a large busy table, in one step
ALTER TABLE users ADD COLUMN email_verified boolean NOT NULL DEFAULT false;
-- on older PostgreSQL this rewrites the ENTIRE table under an ACCESS EXCLUSIVE
-- lock -- a multi-minute outage on a large table
-- (modern PG optimizes the constant-default case, but a NON-constant default,
--  or adding NOT NULL to an existing column, still forces a blocking scan/rewrite)`,
        right: `-- break it into individually cheap, non-blocking steps:
ALTER TABLE users ADD COLUMN email_verified boolean;                    -- 1. instant
UPDATE users SET email_verified = false WHERE email_verified IS NULL;   -- 2. batched backfill
ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT false;        -- 3. metadata only
ALTER TABLE users ADD CONSTRAINT ev_nn CHECK (email_verified IS NOT NULL) NOT VALID;  -- 4. brief lock
ALTER TABLE users VALIDATE CONSTRAINT ev_nn;                            -- 5. non-blocking scan`,
        why: 'Several forms of ALTER TABLE, including adding a column with certain kinds of default, adding NOT NULL to an existing column, or changing a column\'s type, require PostgreSQL to hold an ACCESS EXCLUSIVE lock on the table while it scans or rewrites every row, and that lock blocks every read and write against the table for the entire duration, which on a large table means a real outage measured in minutes. The safe alternative decomposes the same end state into a sequence of individually cheap operations: adding the column as plain nullable is instant because existing rows simply read as null with no rewrite, backfilling the value is a normal UPDATE that takes only row locks and can be chunked to keep each batch short, setting the default afterward is a metadata-only change, and enforcing the not-null requirement is split into adding a CHECK constraint as NOT VALID, which starts enforcing on new writes under only a brief lock without scanning existing data, followed by VALIDATE, which does scan but under a lock weak enough that reads and writes continue normally throughout. Each step is safe to run on a live system, where the single combined statement is not.',
        whyHi: 'Kई forms ke `ALTER TABLE`, jinme certain defaults ke saath ek column add karna, ek existing column mein `NOT NULL` add karna, ya ek column ka type badalна shamil hai, PostgreSQL ko har row scan ya rewrite karte hue table par ek `ACCESS EXCLUSIVE` lock hold karna zaroori hai, aur wo lock table ke against har read aur write ko poori duration ke liye block karta hai. Safe alternative usī end state ko individually cheap operations ke ek sequence mein decompose karta hai.',
      },
      {
        wrong: `-- assuming a NOT VALID constraint doesn't enforce anything until VALIDATE is run
ALTER TABLE users ADD CONSTRAINT age_positive CHECK (age > 0) NOT VALID;
INSERT INTO users VALUES (99, -1);
-- expecting this to succeed "because the constraint isn't validated yet" --
-- it FAILS: NOT VALID skips checking EXISTING rows, not NEW ones`,
        right: `ALTER TABLE users ADD CONSTRAINT age_positive CHECK (age > 0) NOT VALID;
-- this DOES immediately reject any new row with age <= 0 --
-- the "NOT VALID" only means "don't scan the rows that were already here" --
-- new writes are enforced from the moment the constraint is added
INSERT INTO users VALUES (99, 5);   -- fine; INSERT ... VALUES (99, -1) is rejected`,
        why: 'The NOT VALID modifier on a newly added constraint changes exactly one thing: it tells PostgreSQL to skip the immediate full-table scan that would normally verify every existing row satisfies the constraint at the moment it is added. It does not defer or disable enforcement of the constraint on new activity; from the instant a NOT VALID constraint exists, every insert and every update is checked against it and rejected if it violates the rule, identically to a fully validated constraint. The purpose of NOT VALID is specifically to make adding the constraint cheap and non-blocking on a large table by not scanning existing data up front, with the separate VALIDATE step later performing that scan under a much weaker lock; it is not a way to add a constraint that is somehow inactive until validated. Misreading it as "the constraint does nothing yet" leads to surprise when a new write that violates the rule is correctly rejected.',
        whyHi: 'Ek naye add ki gayi constraint par `NOT VALID` modifier theek ek cheez badalता hai: ye PostgreSQL ko wo immediate full-table scan skip karne ko kehта hai jo normally verify karega ki har existing row constraint satisfy karti hai. Ye constraint ke enforcement ko naye activity par defer ya disable nahi karta; ek `NOT VALID` constraint ke exist karne ke pal se, har insert aur har update iske against check hota hai aur violate karne par reject hota hai.',
      },
      {
        wrong: `-- treating a physical replica / read replica as a backup
-- "we have a standby replicating the primary, so we're covered if something breaks"
-- then someone runs an accidental DELETE FROM orders; on the primary --
-- the standby faithfully replicates that DELETE within seconds. Both are now wrong.`,
        right: `-- replication protects against a SERVER failing; it does NOT protect against a
-- bad WRITE (accidental DELETE, buggy migration, corruption) -- those replicate
-- to the standby just as fast as any other change. A real backup strategy needs:
--   - point-in-time recovery (base backup + archived WAL) to rewind past the bad write
--   - and/or periodic pg_dump snapshots retained for a meaningful window`,
        why: 'A physical replica exists to take over if the primary server fails, and it stays continuously synchronized by replaying the primary\'s write-ahead log, which means every change on the primary, including destructive or mistaken ones, is faithfully applied to the replica within seconds. This makes replication excellent protection against hardware failure, a crashed process, or a lost data center, but no protection at all against a logically bad write such as an accidental unfiltered DELETE, a migration that corrupts data, or an application bug that writes garbage, because the replica dutifully copies that damage as quickly as it copies anything else. Genuine recovery from a bad write requires the ability to restore the database to a state from before the write occurred, which is what point-in-time recovery provides by combining a base backup with the archived stream of WAL, allowing replay to be stopped at a chosen moment, and what retained periodic logical dumps provide as an independent fallback. Conflating "we have a replica" with "we have backups" is a common and dangerous gap in a data-protection strategy.',
        whyHi: 'Ek physical replica exist karta hai primary server fail hone par take over karne ke liye, aur ye primary ke write-ahead log ko replay karके continuously synchronized rehта hai, jiska matlab hai primary par har change, destructive ya mistaken samet, seconds ke andar replica par faithfully apply hota hai. Ye replication ko hardware failure ke against excellent protection banata hai, par ek logically bad write ke against bilkul koi protection nahi. Ek bad write se genuine recovery ke liye database ko write hone se pehle ki ek state par restore karne ki ability chahiye, jo point-in-time recovery deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**A high-availability setup with a physical standby and Patroni handling automated failover**, plus completely separate point-in-time recovery from base backups + archived WAL for protection against bad writes — the two treated as distinct requirements.',
        hi: '**Ek high-availability setup ek physical standby aur automated failover handle karте Patroni ke saath**, plus bad writes ke against protection ke liye poori tarah alag point-in-time recovery.',
      },
      {
        en: '**A major-version upgrade done with near-zero downtime via logical replication**: stand up the new-version database as a logical replica of the old, let it catch up, then switch the application over in one brief cutover.',
        hi: '**Ek major-version upgrade logical replication ke through near-zero downtime ke saath kiya gaya**.',
      },
      {
        en: '**A migration-review checklist requiring every "add required column" migration to use the add-nullable / backfill / NOT VALID / VALIDATE sequence**, never a single blocking `ALTER TABLE ... NOT NULL DEFAULT`.',
        hi: '**Ek migration-review checklist jo har "add required column" migration ko add-nullable / backfill / NOT VALID / VALIDATE sequence istemal karne ki maang karti hai**.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the write-ahead log, and how does one mechanism support crash recovery, replication, and point-in-time backups?',
        qHi: 'Write-ahead log kya hai, aur ek mechanism crash recovery, replication, aur point-in-time backups kaise support karta hai?',
        a: 'The write-ahead log is a sequential, append-only record on disk to which PostgreSQL writes a description of every change before it modifies the corresponding table data, and critically, it flushes that log record to durable storage before reporting a transaction as committed. This ordering is what makes commits durable: if the server crashes after a commit but before the modified table pages have been written to disk, nothing is lost, because on restart PostgreSQL replays every log record not yet reflected in the data files, reconstructing exactly the committed state, so crash recovery is simply log replay. Because the log is a complete and correctly ordered record of every change, the same log drives two further capabilities. Replication works by streaming the log to another server as it is generated and having that server continuously replay it, keeping it a near-live copy of the primary. Point-in-time recovery works by keeping a full base backup of the data files plus every log segment generated since, which together allow the database to be restored to its state at any chosen moment in that window by replaying the log up to exactly that point, for instance to just before an accidental destructive statement.',
        aHi: 'Write-ahead log disk par ek sequential, append-only record hai jismein PostgreSQL har change ka ek description likhता hai corresponding table data ko modify karne se pehle, aur critically, ye us log record ko durable storage par flush karता hai ek transaction ko committed report karne se pehle. Ye ordering wo hai jo commits ko durable banaता hai. Kyunki log har change ka ek complete aur correctly ordered record hai, wahi log do aur capabilities drive karta hai: replication aur point-in-time recovery.',
      },
      {
        q: 'Walk through the safe, zero-downtime way to add a required (NOT NULL) column to a large, busy table.',
        qHi: 'Ek large, busy table mein ek required (NOT NULL) column add karne ka safe, zero-downtime tarika walk karo.',
        a: 'A single ALTER TABLE that adds a NOT NULL column, especially with a non-constant default or when adding the constraint to existing data, forces PostgreSQL to hold an ACCESS EXCLUSIVE lock while it scans or rewrites every row, which blocks all reads and writes on the table for the full duration and constitutes an outage on a large table. The safe decomposition is five individually cheap steps. First, add the column as plain nullable, which is instant because existing rows just read as null with no rewrite. Second, backfill the intended value for existing rows with an UPDATE, ideally chunked by primary key in application code so each batch is short and takes only brief row locks rather than one enormous statement. Third, set the column default for future inserts, which is a metadata-only change on modern PostgreSQL. Fourth, add a CHECK constraint expressing the not-null requirement with the NOT VALID modifier, which immediately begins enforcing the rule on all new inserts and updates but explicitly skips scanning the existing rows, so it takes only a brief lock regardless of table size. Fifth, run VALIDATE CONSTRAINT, which does scan every existing row to confirm compliance, but does so under a SHARE UPDATE EXCLUSIVE lock that permits concurrent reads and writes and only conflicts with other schema changes. Every step is individually safe on a live system, and the NOT VALID then VALIDATE split is the key idea, separating the instant act of starting enforcement from the slower but non-blocking act of verifying existing data.',
        aHi: 'Ek single `ALTER TABLE` jo ek `NOT NULL` column add karta hai PostgreSQL ko har row scan ya rewrite karte hue ek `ACCESS EXCLUSIVE` lock hold karne ke liye force karta hai. Safe decomposition paанch individually cheap steps hai: (1) column ko plain nullable add karo — instant; (2) existing rows ke liye value backfill karo ek `UPDATE` se, application code mein primary key se chunked; (3) future inserts ke liye default set karo — metadata-only; (4) ek `CHECK` constraint `NOT VALID` modifier ke saath add karo — turant naye writes par enforce karta hai par existing rows scan skip karta hai; (5) `VALIDATE CONSTRAINT` chalao — har existing row scan karta hai par ek weak lock ke under.',
      },
    ],

    exercises: [
      {
        task: 'Run `SHOW wal_level`, `SHOW max_wal_senders`, and `SELECT pg_is_in_recovery()`. In a comment, note which `wal_level` value is required for LOGICAL replication (not the default) and what `pg_is_in_recovery()` returning `true` would tell you about a server.',
        taskHi: '`SHOW wal_level`, `SHOW max_wal_senders`, aur `SELECT pg_is_in_recovery()` chalao. Ek comment mein note karo ki LOGICAL replication ke liye kaunसा `wal_level` value chahiye (default nahi) aur `pg_is_in_recovery()` ka `true` lautana ek server ke baare mein kya bataega.',
        hint: '`wal_level = logical` is needed for logical replication (`replica` is the default and supports physical replication + PITR). `pg_is_in_recovery() = true` means the server is a standby continuously replaying WAL from a primary.',
        hintHi: '`wal_level = logical` logical replication ke liye chahiye. `pg_is_in_recovery() = true` matlab server ek standby hai jo ek primary se WAL continuously replay kar raha hai.',
      },
      {
        task: 'Table `users(id int PRIMARY KEY, email text)` with two rows. Run the full zero-downtime sequence to add a required `email_verified boolean` column defaulting to `false`: add nullable, backfill with `UPDATE`, `SET DEFAULT`, add a `CHECK (... IS NOT NULL) NOT VALID` constraint, then `VALIDATE` it. Confirm the final table state.',
        taskHi: 'Table `users(id, email)` do rows ke saath. Ek required `email_verified boolean` column `false` default karте hue add karne ke liye poora zero-downtime sequence chalao. Final table state confirm karo.',
        hint: 'Each step is individually cheap and non-blocking on a live system, unlike a single `ALTER TABLE ... NOT NULL DEFAULT`. The `NOT VALID` / `VALIDATE` split separates "start enforcing" from "verify existing rows".',
        hintHi: 'Har step individually sasta aur ek live system par non-blocking hai. `NOT VALID` / `VALIDATE` split "enforce karna shuru karo" ko "existing rows verify karo" se alag karta hai.',
      },
      {
        task: 'Table `users(id int PRIMARY KEY, age int)`. Insert a row with `age = -5` and one with `age = 30`. Add `CHECK (age > 0) NOT VALID`. Then insert a valid row (`age = 40`) and confirm all three rows coexist — the pre-existing bad row was NOT rejected by adding the constraint. In a comment, note that a NEW row with `age <= 0` WOULD be rejected.',
        taskHi: 'Table `users(id, age)`. `age = -5` aur `age = 30` waali rows insert karo. `CHECK (age > 0) NOT VALID` add karo. Phir ek valid row (`age = 40`) insert karo aur confirm karo teenon rows coexist karti hain. Ek comment mein note karo ki `age <= 0` waali ek NAYI row REJECT hoती.',
        hint: '`NOT VALID` only skips checking rows that were ALREADY there when the constraint was added — it enforces the rule on every new write immediately.',
        hintHi: '`NOT VALID` sirf un rows ko check karna skip karta hai jo constraint add hone par PEHLE SE thin — ye har naye write par rule turant enforce karta hai.',
      },
    ],

    keyTakeaways: [
      'The WRITE-AHEAD LOG (WAL): every change is written to a sequential on-disk log AND flushed BEFORE the transaction is reported committed; the actual table page is updated later. A crash loses nothing — restart REPLAYS unapplied WAL. Crash recovery IS WAL replay.',
      'ONE log, THREE features: crash recovery (replay on startup), REPLICATION (stream WAL to another server that replays it → near-live copy), POINT-IN-TIME RECOVERY (base backup + all WAL since → restore to ANY moment, e.g. just before an accidental `DROP`).',
      '`wal_level`: `replica` (default) supports physical replication + PITR; `logical` is needed for logical replication. `pg_is_in_recovery()`: `false` on a primary, `true` on a standby continuously replaying WAL.',
      'PHYSICAL replication: byte-level copy of the WHOLE cluster, replica is identical/read-only/all-or-nothing — the standard for high availability + read replicas. LOGICAL replication: specific tables as row-level changes, replica can differ / be a different PG version — for selective sync, near-zero-downtime major upgrades, CDC. Failover (auto-promote a standby) is NOT built in — Patroni etc. add it.',
      'BACKUPS: `pg_dump` = logical (portable across versions, single DB/table, but SLOW to restore — replays every INSERT). `pg_basebackup` = physical (fast restore = file copy + WAL replay, but version/platform-locked; enables PITR). A replica is NOT a backup — a bad write (accidental DELETE, buggy migration) replicates to the standby within seconds.',
      'ZERO-DOWNTIME "add required column": (1) ADD COLUMN nullable — instant. (2) backfill via batched `UPDATE` — row locks only. (3) `SET DEFAULT` — metadata only. (4) `ADD CONSTRAINT ... CHECK (... IS NOT NULL) NOT VALID` — brief lock, enforces on NEW writes immediately, SKIPS scanning existing rows. (5) `VALIDATE CONSTRAINT` — scans existing rows but under a lock that does NOT block reads/writes. NEVER a single `ALTER TABLE ... NOT NULL DEFAULT` on a large busy table (ACCESS EXCLUSIVE lock + full rewrite = outage).',
      '`NOT VALID` defers ONLY the check of pre-existing rows — it enforces the constraint on every new insert/update from the moment it is added. It is not "an inactive constraint until VALIDATE".',
    ],
    keyTakeawaysHi: [
      'WRITE-AHEAD LOG (WAL): har change ek sequential on-disk log mein likhा jaता hai AUR flush hota hai transaction ke committed report hone SE PEHLE; actual table page baad mein update hota hai. Ek crash kuch nahi khoता — restart unapplied WAL REPLAY karta hai.',
      'EK log, TEEN features: crash recovery, REPLICATION (WAL ko ek doosre server par stream karo → near-live copy), POINT-IN-TIME RECOVERY (base backup + tabse sabhi WAL → KISI BHI moment par restore).',
      '`wal_level`: `replica` (default) physical replication + PITR support karta hai; `logical` logical replication ke liye chahiye. `pg_is_in_recovery()`: ek primary par `false`, ek standby par `true`.',
      'PHYSICAL replication: POORE cluster ka byte-level copy — high availability + read replicas ke liye standard. LOGICAL replication: specific tables row-level changes ke roop mein — selective sync, near-zero-downtime major upgrades ke liye. Failover built-in NAHI hai — Patroni ise add karta hai.',
      'BACKUPS: `pg_dump` = logical (versions ke across portable, par restore SLOW). `pg_basebackup` = physical (fast restore, par version-locked; PITR enable karta hai). Ek replica ek backup NAHI hai — ek bad write standby par seconds ke andar replicate hoती hai.',
      'ZERO-DOWNTIME "add required column": (1) ADD COLUMN nullable — instant. (2) batched `UPDATE` se backfill. (3) `SET DEFAULT` — metadata only. (4) `ADD CONSTRAINT ... NOT VALID` — brief lock, NAYE writes par turant enforce, existing rows scan SKIP. (5) `VALIDATE CONSTRAINT` — existing rows scan karta hai par ek lock ke under jo reads/writes block NAHI karta.',
      '`NOT VALID` SIRF pre-existing rows ke check ko defer karta hai — ye constraint ko har naye insert/update par add hone ke pal se enforce karta hai.',
    ],
  },
];
