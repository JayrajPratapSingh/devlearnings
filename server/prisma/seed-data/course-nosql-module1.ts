/**
 * Databases Complete Course — Module 19: Redis, SQLite & Embedded Stores, lessons 1-3.
 * Part V of the course: beyond relational & document.
 *
 * Lesson 1: The Redis model & core commands — the flat keyspace, strings, atomic
 *           counters, TTL, and the single-threaded / O(1) mindset.
 * Lesson 2: Redis data structures — hashes, lists, sets, sorted sets, streams,
 *           and the access pattern each one unlocks.
 * Lesson 3: Redis caching & core patterns — cache-aside, eviction, rate limiting,
 *           leaderboards, sessions, locks, queues, and pub/sub vs streams.
 *
 * NOTE: Redis does not run natively on Windows and there is no in-process Redis
 * for this toolchain, so the Redis examples in this module are illustrative —
 * real redis-cli commands with realistic responses, not machine-verified. (The
 * SQLite lessons in part 2 ARE verified against a real SQLite engine.)
 */

import type { CourseLesson } from './course-js-module1';

export const NOSQL_MODULE_1: CourseLesson[] = [
  {
    slug: 'redis-the-model-and-core-commands',
    title: 'The Redis Model & Core Commands',
    titleHi: 'Redis Model Aur Core Commands',
    description: 'Redis is an in-memory data-structure server: one flat keyspace mapping string keys to values that are not just strings but lists, sets, hashes, and more. It is single-threaded, so every command is atomic, and fast commands are O(1) — the whole mental model follows from those two facts.',
    descriptionHi: 'Redis ek in-memory data-structure server hai: ek flat keyspace jo string keys ko values par map karta hai jo sirf strings nahi balki lists, sets, hashes, aur zyada hain. Ye single-threaded hai, to har command atomic hai, aur fast commands O(1) hain — poora mental model in do facts se follow hota hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A single clerk at a wall of numbered pigeonholes, working alone, very fast, one request at a time.** Each pigeonhole (a key) holds not just a slip of paper but possibly a stack of slips, a bag of unique tokens, or a labelled folder — the clerk knows how to work with each kind. Because there is exactly one clerk and they finish each request before starting the next, you never get a half-done operation and two people can never corrupt the same pigeonhole at once. The catch: if you ask the clerk to read out every slip in a pigeonhole that holds a million of them, everyone else waits in line while they do it. So you keep individual operations small and quick, because the queue is the whole world.',
      hi: '**Numbered pigeonholes ki ek wall par ek single clerk, akele kaam karta hua, bahut fast, ek baar mein ek request.** Har pigeonhole (ek key) sirf ek kaagaz ki parchi nahi balki parchiyon ka ek stack, unique tokens ka ek bag, ya ek labelled folder rakh sakta hai — clerk har kism ke saath kaam karna janta hai. Kyunki theek ek clerk hai aur wo har request agli shuru karne se pehle khatam karta hai, aapko kabhi ek half-done operation nahi milta aur do log ek hi pigeonhole ko ek saath corrupt nahi kar sakte. Catch: agar aap clerk se ek pigeonhole ki har parchi padhne ko kehte ho jismein das lakh hain, baaki sab line mein wait karte hain jab tak wo ye karta hai.',
    },

    simple: `**Redis = IN-MEMORY (RAM) + a FLAT KEYSPACE (key -> value) + SINGLE-THREADED command execution.**

\`\`\`
SET   user:1:name "Ravi"          -> OK
GET   user:1:name                 -> "Ravi"
DEL   user:1:name                 -> (integer) 1
EXISTS user:1:name                -> (integer) 0
\`\`\`

**Keys are strings.** Convention: \`type:id:field\` with \`:\` separators (\`session:abc123\`,
\`cart:42:items\`). There is no schema and no nesting of keys.

**VALUES are TYPED data structures**, not just strings:
\`\`\`
string   | int/float/text/bytes, up to 512 MB. INCR/DECR/APPEND/SETRANGE
hash     | field -> value map (like a row / small object).  HSET/HGET/HGETALL
list     | ordered, dupes ok, push/pop both ends.  LPUSH/RPUSH/LRANGE/LPOP
set      | unordered unique members.  SADD/SISMEMBER/SINTER
zset     | unique members each with a score, kept sorted.  ZADD/ZRANGE
stream   | append-only log of entries with IDs.  XADD/XRANGE/XREAD
\`\`\`

**ATOMIC COUNTERS** (no read-modify-write race — ever):
\`\`\`
INCR   page:views              -> (integer) 1
INCRBY page:views 10           -> (integer) 11
\`\`\`

**EXPIRY / TTL** — keys can auto-delete:
\`\`\`
SET  otp:ravi 462913 EX 300    -> OK        (expires in 300s)
TTL  otp:ravi                  -> (integer) 287
PERSIST otp:ravi               -> (integer) 1   (cancel the expiry)
\`\`\`

**SINGLE-THREADED** => every command runs to completion with nothing interleaved
(atomic), AND a slow command (\`KEYS *\`, \`SMEMBERS\` on a huge set) blocks EVERYONE.
Think in O(1) / O(log n); avoid O(n) on big values in production.`,

    simpleHi: `**Redis = IN-MEMORY (RAM) + ek FLAT KEYSPACE (key -> value) + SINGLE-THREADED command execution.**

\`\`\`
SET   user:1:name "Ravi"          -> OK
GET   user:1:name                 -> "Ravi"
DEL   user:1:name                 -> (integer) 1
\`\`\`

**Keys strings hain.** Convention: \`type:id:field\` \`:\` separators ke saath. Koi schema nahi, keys ki koi nesting nahi.

**VALUES TYPED data structures hain**, sirf strings nahi:
\`\`\`
string   | int/float/text/bytes.  INCR/DECR/APPEND
hash     | field -> value map (ek row / chhota object jaisa).  HSET/HGET/HGETALL
list     | ordered, dupes ok, dono ends push/pop.  LPUSH/RPUSH/LRANGE/LPOP
set      | unordered unique members.  SADD/SISMEMBER/SINTER
zset     | unique members har ek score ke saath, sorted rakha.  ZADD/ZRANGE
stream   | IDs ke saath entries ka append-only log.  XADD/XRANGE
\`\`\`

**ATOMIC COUNTERS** (koi read-modify-write race nahi — kabhi):
\`\`\`
INCR   page:views              -> (integer) 1
\`\`\`

**EXPIRY / TTL** — keys auto-delete kar sakti hain:
\`\`\`
SET  otp:ravi 462913 EX 300    -> OK
TTL  otp:ravi                  -> (integer) 287
\`\`\`

**SINGLE-THREADED** => har command completion tak chalta hai bina kuch interleaved (atomic), AUR ek slow command SABKO block karta hai. O(1) / O(log n) mein socho.`,

    content: `## What Redis is

Redis (REmote DIctionary Server) is an **in-memory data-structure store**. The whole dataset lives in RAM, which is why reads and writes take microseconds. It is most often used as a cache, a session store, a rate limiter, a queue, and a real-time leaderboard — but it can also be a primary database when its durability options are configured for it.

Three facts define the mental model:

1. **In-memory.** Data is in RAM; persistence (Lesson 4) writes to disk in the background so a restart can reload, but working memory is the constraint and the cost.
2. **One flat keyspace.** Every piece of data is reached by a single string key. There are no tables, no documents, no nesting of keys — just \`key -> value\`.
3. **Single-threaded command execution.** One command runs at a time, to completion, before the next starts.

## The keyspace

A Redis database is a flat map from string keys to values. Keys are arbitrary bytes; the near-universal convention is colon-separated segments describing what the key holds:

\`\`\`
user:1000              -> a hash of that user's fields
user:1000:sessions     -> a set of that user's session IDs
leaderboard:weekly     -> a sorted set of scores
rate:ip:203.0.113.9    -> a counter with a TTL
\`\`\`

The \`:\` is just a character — Redis does not parse it — but tools and humans read it as structure. Keep keys short (they cost memory) and predictable.

Basic key commands: \`SET\`/\`GET\`, \`DEL\`, \`EXISTS\`, \`TYPE\`, \`RENAME\`, \`RANDOMKEY\`. To find keys by pattern, **never use \`KEYS pattern\` in production** — it scans the entire keyspace and blocks the server; use \`SCAN\`, which returns a cursor and a small batch at a time.

## Strings are more than text

The \`string\` type holds any byte sequence up to 512 MB — text, a serialized JSON blob, a number, raw bytes. When the value is an integer or float, Redis gives you atomic arithmetic:

- \`INCR key\` / \`DECR key\` — add or subtract 1, returning the new value. The key is created at 0 if absent.
- \`INCRBY key n\` / \`INCRBYFLOAT key f\` — by an amount.
- \`APPEND key s\`, \`GETRANGE\`, \`SETRANGE\`, \`STRLEN\` — treat the string as a byte buffer.
- \`SET key val NX\` — set only if the key does not exist (the basis of locks, Lesson 3).
- \`SET key val XX\` — set only if it does exist.
- \`GETDEL\`, \`GETEX\` — read-and-delete, read-and-set-expiry, atomically.

Because Redis is single-threaded, \`INCR\` has no read-modify-write race: two clients each issuing \`INCR views\` always produce \`+2\`, with no lost update and no lock needed.

## Expiry and TTL

Any key can be given a **time to live**, after which Redis deletes it automatically:

- \`EXPIRE key seconds\` / \`PEXPIRE key ms\` / \`EXPIREAT key unix-ts\` — set an expiry on an existing key.
- \`SET key val EX seconds\` / \`PX ms\` — set the value and expiry in one command.
- \`TTL key\` — seconds remaining (\`-1\` = no expiry, \`-2\` = key does not exist).
- \`PERSIST key\` — remove the expiry, making the key permanent.

Expiry is how Redis stays bounded as a cache, how OTPs and password-reset tokens self-destruct, how rate-limit windows reset, and how sessions time out. Expiration is **lazy plus sampled**: a key is removed when accessed after expiry, and a background job also samples and evicts expired keys, so memory is reclaimed even for keys nobody reads again.

## Single-threaded: the two consequences

Redis executes commands on **one thread**, one at a time. (Modern Redis uses extra threads for I/O and some background work, but *command execution* is serial.)

**Consequence 1 — atomicity is free.** A single command, however complex (\`INCR\`, \`LPUSH\`, \`ZADD\`, \`SINTERSTORE\`), runs with nothing else interleaved. You never need a lock to make one command safe against concurrency. Multi-command atomicity uses \`MULTI\`/\`EXEC\` or Lua (Lesson 4).

**Consequence 2 — a slow command blocks the world.** While one command runs, every other client waits. An \`O(n)\` command on a large value — \`KEYS *\`, \`SMEMBERS\` on a set of a million, \`LRANGE huge 0 -1\`, a Lua script that loops — freezes the entire server for the duration. So:

- Know each command's complexity (the docs state it: \`GET\` is O(1), \`ZADD\` O(log n), \`SMEMBERS\` O(n)).
- Prefer O(1)/O(log n) operations; page through large collections (\`SCAN\`, \`SSCAN\`, \`HSCAN\`, \`ZSCAN\`, \`ZRANGE\` with \`LIMIT\`).
- Never run \`KEYS\`, \`FLUSHALL\` without care, or unbounded \`LRANGE\`/\`SMEMBERS\`/\`HGETALL\` on production data.

## RESP and clients

Clients speak **RESP** (REdis Serialization Protocol), a simple line-based protocol over TCP (default port 6379). You rarely see it directly — a client library (\`redis\`/\`ioredis\` for Node, \`redis-py\`, \`Jedis\`/\`Lettuce\`, \`go-redis\`) exposes each command as a method. The examples in this module are written as \`redis-cli\` commands because that maps one-to-one to what every client sends.`,

    contentHi: `## Redis kya hai

Redis (REmote DIctionary Server) ek **in-memory data-structure store** hai. Poora dataset RAM mein rehta hai, isliye reads aur writes microseconds leti hain. Ye aksar ek cache, session store, rate limiter, queue, aur real-time leaderboard ke roop mein istemal hota hai.

Teen facts mental model define karte hain:
1. **In-memory.** Data RAM mein hai; persistence background mein disk par likhta hai.
2. **Ek flat keyspace.** Har data ek single string key se pahuncha jata hai. Koi tables nahi, koi documents nahi.
3. **Single-threaded command execution.** Ek command ek baar mein chalta hai, completion tak.

## Keyspace

Convention colon-separated segments hai: \`user:1000\`, \`leaderboard:weekly\`, \`rate:ip:203.0.113.9\`.

Production mein \`KEYS pattern\` kabhi istemal mat karo — ye poore keyspace ko scan karta hai aur server ko block karta hai; \`SCAN\` istemal karo.

## Strings text se zyada hain

\`string\` type koi bhi byte sequence 512 MB tak rakhta hai. Jab value ek integer hai, Redis atomic arithmetic deta hai: \`INCR\`, \`DECR\`, \`INCRBY\`. \`SET key val NX\` — sirf tab set karo jab key exist nahi karti (locks ka basis).

Kyunki Redis single-threaded hai, \`INCR\` mein koi read-modify-write race nahi.

## Expiry aur TTL

Kisi bhi key ko ek **time to live** diya ja sakta hai: \`EXPIRE key seconds\`, \`SET key val EX seconds\`, \`TTL key\`, \`PERSIST key\`. Expiry aise Redis ek cache ke roop mein bounded rehta hai, OTPs self-destruct karte hain, rate-limit windows reset hote hain.

## Single-threaded: do consequences

**Consequence 1 — atomicity free hai.** Ek single command bina kuch interleaved chalta hai. Ek command ko concurrency ke against safe banane ke liye aapko kabhi lock ki zaroorat nahi.

**Consequence 2 — ek slow command duniya ko block karta hai.** Ek large value par ek O(n) command poore server ko freeze kar deta hai. Har command ki complexity jaano; O(1)/O(log n) prefer karo; large collections page karo.

## RESP aur clients

Clients **RESP** bolte hain, TCP par ek simple protocol (default port 6379). Ek client library har command ko ek method ke roop mein expose karti hai.`,

    examples: [
      {
        title: 'The flat keyspace: SET / GET / DEL / EXISTS / TYPE',
        titleHi: 'Flat keyspace: SET / GET / DEL / EXISTS / TYPE',
        code: `redis> SET user:1000:name "Ravi Kumar"
OK
redis> GET user:1000:name
"Ravi Kumar"
redis> TYPE user:1000:name
string
redis> EXISTS user:1000:name
(integer) 1
redis> DEL user:1000:name
(integer) 1
redis> GET user:1000:name
(nil)`,
        output: `SET/GET store and retrieve a string by key; TYPE reports the value's data-structure kind; EXISTS returns 1/0; DEL returns the count removed; GET on a missing key is (nil).`,
        explain: "Every value in Redis lives at one string key in a single flat namespace. `SET`/`GET` write and read a string; `TYPE` tells you which data-structure kind a key holds (here `string`, but it could be `hash`, `list`, `zset`, ...); `EXISTS` is 1/0; `DEL` returns how many of the named keys it removed; and a `GET` on a key that isn't there is `(nil)`, not an error.",
        explainHi: 'Redis mein har value ek single flat namespace mein ek string key par rehti hai. `SET`/`GET` ek string write aur read karte hain; `TYPE` batata hai ek key kaunsi data-structure kism rakhti hai (yahaan `string`, par ye `hash`, `list`, `zset` ho sakta hai); `EXISTS` 1/0 hai; `DEL` return karta hai kitni named keys usne remove kiin; aur ek key par `GET` jo wahaan nahi hai `(nil)` hai, ek error nahi.',
      },
      {
        title: 'Atomic counters: INCR never races, even under concurrency',
        titleHi: 'Atomic counters: INCR kabhi race nahi karta',
        code: `redis> INCR page:home:views
(integer) 1
redis> INCR page:home:views
(integer) 2
redis> INCRBY page:home:views 100
(integer) 102
redis> GET page:home:views
"102"

# two clients issuing INCR at the same instant both take effect:
#   client A: INCR -> 103
#   client B: INCR -> 104
# single-threaded execution => no lost update, no lock required`,
        output: `INCR creates the key at 0 if absent and returns the post-increment value; INCRBY adds an amount. Because command execution is serial, concurrent INCRs are applied one after another with no read-modify-write race.`,
        explain: "`INCR` creates the key at 0 if it's missing, adds 1, and returns the new value; `INCRBY` adds an arbitrary amount. Because Redis executes one command at a time to completion, two clients issuing `INCR` at the same instant are simply applied one after the other -- both take effect (102 -> 103 -> 104), with no lost update and no lock. This is the whole reason to use `INCR` instead of `GET` then `SET`.",
        explainHi: '`INCR` key ko 0 par banata hai agar ye missing hai, 1 add karta hai, aur naya value return karta hai; `INCRBY` ek arbitrary amount add karta hai. Kyunki Redis ek baar mein ek command completion tak execute karta hai, do clients jo usi instant `INCR` issue karte hain bस ek ke baad ek apply hote hain -- dono take effect (102 -> 103 -> 104), koi lost update nahi aur koi lock nahi. Ye `GET` phir `SET` ke bजाy `INCR` istemal karne ka poora kaaran hai.',
      },
      {
        title: 'TTL: a self-expiring OTP',
        titleHi: 'TTL: ek self-expiring OTP',
        code: `redis> SET otp:+9198xxx 462913 EX 300
OK
redis> TTL otp:+9198xxx
(integer) 300
# ... 13 seconds later ...
redis> TTL otp:+9198xxx
(integer) 287
redis> GET otp:+9198xxx
"462913"
# ... 300 seconds after the SET ...
redis> GET otp:+9198xxx
(nil)
redis> TTL otp:+9198xxx
(integer) -2`,
        output: `SET ... EX 300 stores the value with a 300-second time to live. TTL counts down. Once it hits 0 Redis deletes the key: GET returns (nil) and TTL returns -2 (key does not exist). -1 would mean the key exists with no expiry.`,
        explain: '`SET ... EX 300` stores the value with a 300-second time to live. `TTL` counts down the seconds remaining. Once the TTL reaches 0 Redis deletes the key automatically -- so `GET` then returns `(nil)` and `TTL` returns `-2` ("key does not exist"). `-1` would mean the key exists but has no expiry set. No cron job or cleanup sweep is involved.',
        explainHi: '`SET ... EX 300` value ko ek 300-second time to live ke saath store karta hai. `TTL` remaining seconds count down karta hai. Ek baar TTL 0 par pahunchne par Redis key ko automatically delete karta hai -- to `GET` phir `(nil)` return karta hai aur `TTL` `-2` return karta hai ("key exist nahi karti"). `-1` matlab key exist karti hai par koi expiry set nahi. Koi cron job ya cleanup sweep involved nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `# finding keys with KEYS in application code
redis> KEYS user:*:sessions
# -- on a keyspace with millions of keys, this scans EVERY key, builds the whole
#    result in memory, and BLOCKS the single command thread the entire time.
#    Every other client's request stalls. A classic production outage.`,
        right: `# SCAN: cursor-based, bounded work per call, non-blocking
redis> SCAN 0 MATCH user:*:sessions COUNT 100
1) "3072"                      # next cursor (0 when done)
2) 1) "user:1000:sessions"
   2) "user:1042:sessions"
# loop, passing the returned cursor back, until it returns 0.
# Or better: maintain your own index (a SET of the keys you care about).`,
        why: 'Redis executes commands on a single thread, so the time any one command takes is time during which no other client is served. The KEYS command walks the entire keyspace to find matches and assembles the full list of results before returning, which on a large database can take hundreds of milliseconds to seconds, during which the server is completely unresponsive to every other connection. SCAN solves this by being incremental: each call examines only a bounded slice of the keyspace, returns whatever matches it found plus a cursor, and the caller loops until the cursor comes back as zero. Each individual SCAN call is short, so other clients are interleaved between iterations and the server stays responsive. SCAN gives a weaker guarantee than KEYS, keys present for the whole scan are returned but keys added or removed during it may or may not appear, which is almost always an acceptable trade for not freezing the server. When key enumeration is a routine need, maintaining an explicit set or sorted set of the relevant keys avoids scanning at all.',
        whyHi: 'Redis commands ko ek single thread par execute karta hai, to koi bhi ek command jitna samay leta hai wo samay hai jab koi doosra client serve nahi hota. KEYS command poore keyspace ko walk karta hai matches dhoondne ke liye aur return karne se pehle results ki poori list assemble karta hai, jo ek large database par seconds le sakta hai, jiske dauran server har doosre connection ke liye poori tarah unresponsive hai. SCAN ise incremental hokar solve karta hai: har call keyspace ka sirf ek bounded slice examine karta hai, jo matches mile wo plus ek cursor return karta hai, aur caller loop karta hai jab tak cursor zero wapas na aaye.',
      },
      {
        wrong: `# a read-modify-write for a counter, "to be safe"
const n = await redis.get("downloads");
await redis.set("downloads", Number(n) + 1);
# -- two clients both GET 40, both SET 41. One download is lost.
#    You reintroduced the exact race that INCR exists to eliminate.`,
        right: `await redis.incr("downloads");   // atomic: 40 -> 41 -> 42 under concurrency
// need it conditional or multi-step? -> MULTI/EXEC + WATCH, or a Lua script`,
        why: 'The INCR command reads the current integer value of a key, adds one, stores the result, and returns it, and because Redis runs commands serially this entire sequence happens as one indivisible step with no other command able to observe or modify the key in between. Splitting the operation into a separate GET and SET in client code reopens the window that INCR closes: between the client reading the value and writing back the incremented result, another client can run the same pair, and if both read the same starting value they compute and write the same result, losing one increment. This is the canonical lost-update race, and Redis provides INCR, DECR, INCRBY, HINCRBY, ZINCRBY, and similar atomic operations specifically so it never has to happen. When the update needs a condition or spans multiple keys, the tools are a MULTI/EXEC transaction guarded by WATCH for optimistic concurrency, or a Lua script which also executes atomically on the single thread.',
        whyHi: 'INCR command ek key ki current integer value padhta hai, ek add karta hai, result store karta hai, aur ise return karta hai, aur kyunki Redis commands ko serially chalata hai ye poora sequence ek indivisible step ke roop mein hota hai jismein koi doosra command beech mein key ko observe ya modify nahi kar sakta. Operation ko client code mein ek alag GET aur SET mein split karna wo window dobara khol deta hai jo INCR band karta hai. Redis INCR, DECR, INCRBY, HINCRBY, ZINCRBY jaise atomic operations specifically deta hai taaki aisa kabhi na ho.',
      },
      {
        wrong: `# storing a big blob and reading it whole, repeatedly
redis> SET catalog:full "<8 MB of JSON>"
# then, on every request:
redis> GET catalog:full          # ships 8 MB over the socket every call,
                                  # and serializing/copying it blocks the thread`,
        right: `# split into addressable pieces so each read is small:
redis> HSET product:42 name "Widget" price 999 stock 12
redis> HGET product:42 price     # a few bytes
# or a sorted set / set / list keyed by the access pattern you actually have`,
        why: 'A Redis value can be up to 512 megabytes, but the size of a value directly affects the cost of every operation on it: the single command thread spends time proportional to the value size copying it to the output buffer, and the network spends time transferring it, during which other clients wait. Storing a large aggregate as one string and reading the whole thing on each request pays that full cost every time, even when the caller needs only a small part of it. Redis\'s typed structures exist to make data addressable at a finer grain: a hash lets a single field be read or written without touching the rest of the object, a sorted set lets a range or a rank be fetched without the whole set, a list lets the ends be accessed without the middle. Modeling the data as the structure that matches the access pattern keeps each operation small and O(1) or O(log n), which is what keeps a single-threaded server fast under load.',
        whyHi: 'Ek Redis value 512 megabytes tak ho sakti hai, par ek value ka size ispar har operation ki cost ko directly affect karta hai: single command thread value size ke proportional samay bitata hai ise output buffer mein copy karne mein, aur network ise transfer karne mein samay bitata hai, jiske dauran doosre clients wait karte hain. Ek large aggregate ko ek string ke roop mein store karna aur har request par poori cheez padhna wo poori cost har baar deta hai. Redis ke typed structures data ko ek finer grain par addressable banane ke liye exist karte hain.',
      },
    ],

    realWorld: [
      {
        en: '**A page-view counter as `INCR page:{slug}:views` on every request** — millions of concurrent increments, no lock, no database write on the hot path; a background job flushes the counters to Postgres every minute.',
        hi: '**Har request par `INCR page:{slug}:views` ke roop mein ek page-view counter** — millions concurrent increments, koi lock nahi, hot path par koi database write nahi.',
      },
      {
        en: '**OTP and password-reset tokens as `SET token:{hash} {userId} EX 600`** — the key self-destructs after 10 minutes, so expiry is enforced by Redis, not by a cron job sweeping a table.',
        hi: '**OTP aur password-reset tokens `SET token:{hash} {userId} EX 600` ke roop mein** — key 10 minute baad self-destruct karti hai.',
      },
      {
        en: '**A `SCAN`-based maintenance script that migrates old key formats** — never `KEYS`, always a cursor loop with `COUNT 500`, so the live server keeps serving traffic while the migration runs.',
        hi: '**Ek `SCAN`-based maintenance script jo purane key formats migrate karta hai** — kabhi `KEYS` nahi, hamesha ek cursor loop.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is Redis single-threaded, and what are the consequences for how you use it?',
        qHi: 'Redis single-threaded kyun hai, aur aap ise kaise istemal karte ho iske liye consequences kya hain?',
        a: 'Redis executes client commands on a single thread because its operations are almost entirely in-memory and therefore CPU- and memory-bandwidth-bound rather than I/O-bound, so a single core can process a very high command rate, and serial execution removes the need for internal locking on the data structures, which keeps each operation simple and fast. Modern Redis does use additional threads for network I/O and for some background tasks, but the execution of commands against the data is serial. The first consequence is that every individual command is atomic for free: a command as involved as incrementing a counter, pushing onto a list, or intersecting two sets runs to completion with no other command interleaved, so no application-level lock is ever needed to make a single command safe under concurrency, and operations like INCR have no lost-update race. The second consequence is that a slow command blocks every other client for its full duration, because they are all waiting on the one thread. This makes command complexity a first-class concern: fast O(1) and O(log n) operations are safe, but an O(n) command over a large value, such as KEYS across a big keyspace or SMEMBERS on a huge set, freezes the server, so large collections must be paged through with SCAN-family cursors and unbounded reads must be avoided in production.',
        aHi: 'Redis client commands ko ek single thread par execute karta hai kyunki iske operations lagभag poori tarah in-memory hain aur isliye CPU-bound hain I/O-bound ke bजाy, to ek single core ek bahut high command rate process kar sakta hai, aur serial execution data structures par internal locking ki zaroorat hataता hai. Pehla consequence ye hai ki har individual command free mein atomic hai: ek command jaise ek counter increment karna bina kisi doosre command ke interleaved completion tak chalta hai, to ek single command ko safe banane ke liye kabhi application-level lock ki zaroorat nahi. Doosra consequence ye hai ki ek slow command har doosre client ko iski poori duration ke liye block karta hai. Ye command complexity ko ek first-class concern banaता hai.',
      },
      {
        q: 'How does key expiry work in Redis, and what is it used for?',
        qHi: 'Redis mein key expiry kaise kaam karti hai, aur ye kiske liye istemal hoti hai?',
        a: 'Any key can be given a time to live, either after the fact with EXPIRE or its variants, or at write time with the EX or PX option on SET, and once the TTL elapses Redis removes the key automatically. The TTL command reports the remaining seconds, with minus one meaning the key exists but has no expiry and minus two meaning the key does not exist, and PERSIST removes an expiry to make a key permanent. Expiration is implemented in two complementary ways: lazily, when a client accesses a key that has passed its TTL it is deleted at that moment and treated as absent, and proactively, a background cycle repeatedly samples a set of keys that have TTLs and evicts the ones that have expired, so memory is reclaimed even for keys that are never accessed again. This mechanism is what makes Redis bounded and self-maintaining for a large class of use cases: cache entries that should not outlive their freshness window, one-time codes and password-reset tokens that must self-destruct, rate-limit counters whose window resets when the key expires, and sessions that time out after inactivity. The application sets the TTL and never has to run a cleanup job.',
        aHi: 'Kisi bhi key ko ek time to live diya ja sakta hai, ya to baad mein EXPIRE se, ya write time par SET par EX ya PX option se, aur ek baar TTL elapse hone par Redis key ko automatically remove karta hai. TTL command remaining seconds report karta hai, minus one matlab key exist karti hai par koi expiry nahi aur minus two matlab key exist nahi karti. Expiration do complementary tarikon se implement hoti hai: lazily, jab ek client ek expired key access karta hai wo us moment delete hoti hai, aur proactively, ek background cycle keys sample karta hai aur expired ones evict karta hai. Ye mechanism Redis ko bounded aur self-maintaining banaता hai.',
      },
    ],

    exercises: [
      {
        task: 'Write the `redis-cli` commands to: store a user\'s display name at `user:77:name`, atomically increment a login counter at `user:77:logins`, and store a session token at `session:{tok}` that expires in 1 hour. In a comment, note which of these would be a bug done as GET-then-SET.',
        taskHi: '`redis-cli` commands likho: `user:77:name` par ek display name store karo, `user:77:logins` par ek login counter atomically increment karo, aur `session:{tok}` par ek session token store karo jo 1 ghante mein expire hota hai.',
        hint: '`SET user:77:name "Ada"` / `INCR user:77:logins` / `SET session:abc123 77 EX 3600`. The login counter is the bug case: `GET` then `SET n+1` races and loses concurrent logins — `INCR` is atomic and correct.',
        hintHi: '`SET user:77:name "Ada"` / `INCR user:77:logins` / `SET session:abc123 77 EX 3600`. Login counter bug case hai: `GET` phir `SET n+1` races.',
      },
      {
        task: 'In a comment, explain what happens to the Redis server when a client runs `KEYS *` on a database with 5 million keys, and what the correct alternative is and why it does not have the same problem.',
        taskHi: 'Ek comment mein, samjhao ki Redis server ko kya hota hai jab ek client 5 million keys waale database par `KEYS *` chalata hai.',
        hint: 'The single command thread scans all 5M keys and builds the full result before returning — hundreds of ms to seconds during which EVERY other client is stalled (an outage). `SCAN` is incremental: bounded work per call + a cursor, so other commands interleave between iterations and the server stays responsive.',
        hintHi: 'Single command thread saare 5M keys scan karta hai aur return se pehle poora result banaता hai — seconds jiske dauran HAR doosra client stalled hai. `SCAN` incremental hai.',
      },
      {
        task: 'For each, name the Redis string feature: (a) a counter that must be correct under 10k concurrent writers, (b) a value that should vanish after 5 minutes, (c) "set this key only if nobody else has", (d) read a key and delete it in one atomic step.',
        taskHi: 'Har ek ke liye, Redis string feature batao: (a) ek counter jo 10k concurrent writers ke under sahi hona chahiye, (b) ek value jo 5 minute baad vanish honi chahiye, (c) "ye key sirf tab set karo jab kisi aur ne nahi", (d) ek key padho aur ek atomic step mein delete karo.',
        hint: '(a) `INCR` — serial execution makes it race-free. (b) `SET key val EX 300` (or `EXPIRE`). (c) `SET key val NX` — the lock primitive. (d) `GETDEL key`.',
        hintHi: '(a) `INCR`. (b) `SET key val EX 300`. (c) `SET key val NX`. (d) `GETDEL key`.',
      },
    ],

    keyTakeaways: [
      'Redis = IN-MEMORY (RAM, microsecond ops) + a FLAT KEYSPACE (string key → typed value, NO tables/documents/nesting) + SINGLE-THREADED command execution. Default port 6379, clients speak RESP. Used as cache, session store, rate limiter, queue, leaderboard — occasionally a primary DB.',
      'Keys are strings; convention is colon-separated segments (`user:1000:sessions`) — Redis doesn\'t parse `:`, it\'s just readable structure. Keep keys short (they cost RAM). Find keys with `SCAN` (cursor, bounded, non-blocking) — NEVER `KEYS pattern` in production (scans everything, blocks the one thread → outage).',
      'The `string` type holds any bytes ≤512MB. When it\'s a number: `INCR`/`DECR`/`INCRBY`/`INCRBYFLOAT` are ATOMIC (serial execution ⇒ no read-modify-write race, no lock). `SET key val NX` = set only if absent (lock primitive); `XX` = only if present; `GETDEL`/`GETEX` = atomic read-and-delete / read-and-expire.',
      'Any key gets a TTL: `EXPIRE key secs`, `SET key val EX secs`, `TTL key` (`-1` = no expiry, `-2` = no key), `PERSIST key`. Expiry is LAZY (deleted on access after TTL) + SAMPLED (background eviction). This is how Redis stays bounded as a cache and how OTPs/reset-tokens/rate-windows/sessions self-destruct with no cleanup job.',
      'SINGLE-THREADED ⇒ (1) every single command is ATOMIC for free — no lock needed to make one command concurrency-safe; multi-command atomicity = `MULTI`/`EXEC` or Lua. (2) a SLOW command BLOCKS EVERY client for its full duration — know each command\'s big-O (`GET` O(1), `ZADD` O(log n), `SMEMBERS` O(n)), prefer O(1)/O(log n), page big collections with `SCAN`/`SSCAN`/`HSCAN`/`ZSCAN`, never unbounded `LRANGE`/`SMEMBERS`/`HGETALL` in prod.',
    ],
    keyTakeawaysHi: [
      'Redis = IN-MEMORY + ek FLAT KEYSPACE (string key → typed value, KOI tables/documents/nesting nahi) + SINGLE-THREADED command execution. Default port 6379, clients RESP bolte hain. Cache, session store, rate limiter, queue, leaderboard ke roop mein.',
      'Keys strings hain; convention colon-separated segments hai (`user:1000:sessions`). Keys `SCAN` se dhoondo (cursor, bounded, non-blocking) — production mein KABHI `KEYS pattern` nahi (sab kuch scan karta hai, ek thread block karta hai → outage).',
      '`string` type koi bhi bytes ≤512MB rakhta hai. Jab ye ek number hai: `INCR`/`DECR`/`INCRBY` ATOMIC hain (serial execution ⇒ koi race nahi, koi lock nahi). `SET key val NX` = sirf tab set karo jab absent (lock primitive); `GETDEL` = atomic read-and-delete.',
      'Kisi bhi key ko ek TTL milta hai: `EXPIRE key secs`, `SET key val EX secs`, `TTL key` (`-1` = koi expiry nahi, `-2` = koi key nahi), `PERSIST key`. Expiry LAZY + SAMPLED hai. Aise Redis ek cache ke roop mein bounded rehta hai aur OTPs/sessions self-destruct karte hain.',
      'SINGLE-THREADED ⇒ (1) har single command free mein ATOMIC hai — ek command ko concurrency-safe banane ke liye koi lock nahi; multi-command atomicity = `MULTI`/`EXEC` ya Lua. (2) ek SLOW command HAR client ko iski poori duration block karta hai — har command ki big-O jaano, O(1)/O(log n) prefer karo, big collections `SCAN` se page karo.',
    ],
  },

  {
    slug: 'redis-data-structures',
    title: 'Redis Data Structures',
    titleHi: 'Redis Data Structures',
    description: 'The reason to use Redis over a plain key-value cache is the typed values: hashes for objects, lists for queues, sets for membership and tags, sorted sets for leaderboards and time-ordered indexes, and streams for append-only logs. Each structure has O(1) or O(log n) operations that a pattern is built on.',
    descriptionHi: 'Redis ko ek plain key-value cache ke bजाy istemal karne ka kaaran typed values hain: objects ke liye hashes, queues ke liye lists, membership aur tags ke liye sets, leaderboards ke liye sorted sets, aur append-only logs ke liye streams. Har structure ke O(1) ya O(log n) operations hain jinpar ek pattern bana hai.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 2,

    analogy: {
      en: '**The same wall of pigeonholes, but now each hole is a different kind of container.** One holds a labelled folder with tabbed sections you can pull one page from (a hash). One holds a spring-loaded tube you push cards into and pop off either end (a list). One holds a bag where every token is unique and you can instantly check membership or compare two bags (a set). One holds a bag where every token has a number pinned to it and the bag keeps itself sorted by that number (a sorted set). One holds a paper-tape printer that only ever appends, each line stamped with an ever-increasing ID (a stream). You pick the container by the question you will ask, not by what the data "is".',
      hi: '**Wahi pigeonholes ki wall, par ab har hole ek alag kism ka container hai.** Ek ek labelled folder rakhta hai tabbed sections ke saath jismein se aap ek page kheench sakte ho (ek hash). Ek ek spring-loaded tube rakhta hai jismein aap cards push karte ho aur dono end se pop karte ho (ek list). Ek ek bag rakhta hai jahaan har token unique hai (ek set). Ek ek bag rakhta hai jahaan har token par ek number pinned hai aur bag khud ko us number se sorted rakhta hai (ek sorted set). Ek ek paper-tape printer rakhta hai jo sirf append karta hai (ek stream). Aap container us sawal se chunte ho jo aap poochoge.',
    },

    simple: `**HASH -- a field->value map under one key. Use for: an object / a row.**
\`\`\`
HSET  user:42  name "Meera"  age 29  plan "pro"     -> (integer) 3
HGET  user:42  plan                                 -> "pro"
HGETALL user:42                    -> name/Meera age/29 plan/pro
HINCRBY user:42 age 1                                -> (integer) 30
\`\`\`

**LIST -- ordered sequence, push/pop both ends, dupes allowed. Use for: queue, stack, recent-N.**
\`\`\`
RPUSH  queue:jobs  "job1" "job2"       -> (integer) 2      (append right)
LPOP   queue:jobs                       -> "job1"           (take from left = FIFO)
LRANGE feed:42  0 9                     -> newest 10 items
BRPOP  queue:jobs  5                    -> block up to 5s for an item
\`\`\`

**SET -- unordered, unique members. Use for: tags, "seen" sets, relationships, uniqueness.**
\`\`\`
SADD    post:9:likes  u1 u2 u3          -> (integer) 3
SISMEMBER post:9:likes u2               -> (integer) 1
SCARD   post:9:likes                    -> (integer) 3
SINTER  user:1:following user:2:following  -> mutual follows
\`\`\`

**SORTED SET (ZSET) -- unique members, each with a score, kept in score order. Use for:
leaderboards, priority queues, time-ordered feeds, rate-limit windows, top-N.**
\`\`\`
ZADD  lb:weekly  980 "ravi"  1220 "meera"  760 "sam"   -> (integer) 3
ZREVRANGE lb:weekly 0 2 WITHSCORES   -> meera 1220, ravi 980, sam 760
ZINCRBY lb:weekly 50 "ravi"          -> "1030"
ZRANK   lb:weekly "ravi"             -> (integer) 1   (0-based, low to high)
ZRANGEBYSCORE events 1700000000 1700003600   -> entries in a time window
\`\`\`

**STREAM -- append-only log of {id -> field/value} entries. Use for: event logs,
message queues with consumer groups, activity histories.**
\`\`\`
XADD  orders:events  *  type placed  order 5001    -> "1719-0"   (auto ID)
XLEN  orders:events                                 -> (integer) 1
XRANGE orders:events  - +                           -> all entries
XREAD COUNT 10 STREAMS orders:events 0              -> read from the start
\`\`\`

**Plus:** BITMAP (bit ops on a string -- flags/presence), HYPERLOGLOG (PFADD/PFCOUNT --
approximate unique counts in 12 KB), GEO (GEOADD/GEOSEARCH -- radius queries).`,

    simpleHi: `**HASH -- ek key ke neeche ek field->value map. Iske liye: ek object / ek row.**
\`\`\`
HSET  user:42  name "Meera"  age 29  plan "pro"     -> (integer) 3
HGET  user:42  plan                                 -> "pro"
HINCRBY user:42 age 1                                -> (integer) 30
\`\`\`

**LIST -- ordered sequence, dono ends push/pop. Iske liye: queue, stack, recent-N.**
\`\`\`
RPUSH  queue:jobs  "job1" "job2"       -> (integer) 2
LPOP   queue:jobs                       -> "job1"           (FIFO)
BRPOP  queue:jobs  5                    -> ek item ke liye 5s tak block
\`\`\`

**SET -- unordered, unique members. Iske liye: tags, "seen" sets, uniqueness.**
\`\`\`
SADD    post:9:likes  u1 u2 u3          -> (integer) 3
SISMEMBER post:9:likes u2               -> (integer) 1
SINTER  user:1:following user:2:following  -> mutual follows
\`\`\`

**SORTED SET (ZSET) -- unique members, har ek score ke saath, score order mein. Iske liye:
leaderboards, priority queues, time-ordered feeds, top-N.**
\`\`\`
ZADD  lb:weekly  980 "ravi"  1220 "meera"           -> (integer) 2
ZREVRANGE lb:weekly 0 2 WITHSCORES   -> meera 1220, ravi 980
ZINCRBY lb:weekly 50 "ravi"          -> "1030"
ZRANGEBYSCORE events 1700000000 1700003600   -> ek time window mein entries
\`\`\`

**STREAM -- {id -> field/value} entries ka append-only log. Iske liye: event logs,
consumer groups ke saath message queues.**
\`\`\`
XADD  orders:events  *  type placed  order 5001    -> "1719-0"
XRANGE orders:events  - +                           -> saari entries
\`\`\`

**Plus:** BITMAP, HYPERLOGLOG (approximate unique counts 12 KB mein), GEO (radius queries).`,

    content: `## Why typed values matter

A plain cache stores opaque blobs: to change one field you fetch the whole value, parse it, edit it, re-serialize, and write it back — and two clients doing that race. Redis's typed structures let you address and mutate data at a fine grain, atomically, with the server doing the work. Choosing the right structure is choosing which operations are cheap.

## Hash — objects and rows

A hash is a map of fields to values stored under one key. It models a record: \`user:42\` with fields \`name\`, \`email\`, \`plan\`, \`lastSeen\`.

- \`HSET key f v [f v ...]\`, \`HGET key f\`, \`HMGET key f1 f2\`, \`HGETALL key\`, \`HDEL key f\`.
- \`HINCRBY key f n\` / \`HINCRBYFLOAT\` — atomic per-field arithmetic.
- \`HEXISTS\`, \`HKEYS\`, \`HVALS\`, \`HLEN\`, \`HSCAN\`.

A hash is more memory-efficient than N separate string keys for the same fields, and it lets you update one field without rewriting the object. Use it for session data, a cached DB row, a config object, per-entity counters.

## List — queues, stacks, recent items

A list is an ordered sequence of strings, duplicates allowed, with O(1) push and pop at both ends and O(n) access to the middle.

- \`LPUSH\` / \`RPUSH\` — prepend / append (returns the new length).
- \`LPOP\` / \`RPOP\` — remove and return from an end (\`LPOP key count\` for several).
- \`LRANGE key start stop\` — a slice (\`0 -1\` = all; negative indexes from the end).
- \`LLEN\`, \`LINDEX\`, \`LSET\`, \`LTRIM key 0 99\` (keep only the first 100 — the "recent N" pattern).
- \`BLPOP\` / \`BRPOP key timeout\` — **blocking** pop: wait up to \`timeout\` seconds for an element to appear. This turns a list into a work queue with no polling.
- \`LMOVE src dst LEFT RIGHT\` / \`BLMOVE\` — atomically move an element between lists (reliable-queue pattern: pop from pending, push to processing).

RPUSH + LPOP is FIFO (a queue); LPUSH + LPOP is LIFO (a stack). \`LPUSH\` + \`LTRIM\` maintains a capped "last N events" list.

## Set — membership, uniqueness, relationships

A set is an unordered collection of unique members. Add/remove/membership are O(1).

- \`SADD\`, \`SREM\`, \`SISMEMBER\` (O(1) "is X in here?"), \`SMISMEMBER\` (several at once), \`SCARD\` (count), \`SMEMBERS\` (all — O(n), page with \`SSCAN\`), \`SRANDMEMBER\`, \`SPOP\`.
- Set algebra: \`SINTER\` / \`SUNION\` / \`SDIFF\` (and \`...STORE\` variants that write the result to a key): mutual followers, users in segment A but not B, tags common to two posts.

Use it for "has this user seen this item", unique visitor sets, tag membership, follower/following graphs, deduplication.

## Sorted set — the workhorse

A sorted set (zset) is a set where every member also carries a floating-point **score**, and the structure stays ordered by score. Operations are O(log n).

- \`ZADD key score member [score member ...]\` — add or update; \`ZADD key GT 100 m\` only raises the score.
- \`ZSCORE\`, \`ZRANK\` (position low→high, 0-based), \`ZREVRANK\`, \`ZCARD\`, \`ZCOUNT key min max\`.
- \`ZRANGE\` / \`ZREVRANGE key start stop [WITHSCORES]\` — by rank. \`ZRANGEBYSCORE\` / \`ZRANGEBYLEX\` — by score or lexical range, with \`LIMIT offset count\` for paging.
- \`ZINCRBY key n member\` — atomically bump a score (the leaderboard update).
- \`ZPOPMIN\` / \`ZPOPMAX\`, \`BZPOPMIN\` — pop the lowest/highest (priority queue).
- \`ZREMRANGEBYSCORE\` / \`ZREMRANGEBYRANK\` — trim by score or rank.

Patterns: **leaderboard** (score = points, \`ZREVRANGE 0 9\` for the top 10, \`ZREVRANK\` for "your rank"); **priority queue** (score = priority, \`ZPOPMIN\`); **time-ordered index / feed** (score = timestamp, \`ZRANGEBYSCORE\` for a window, \`ZREMRANGEBYSCORE -inf {cutoff}\` to age out); **sliding-window rate limiter** (score = timestamp, remove old, count remaining, add current).

## Stream — the append-only log

A stream is an append-only sequence of entries, each with an ID (by default \`<ms>-<seq>\`, monotonically increasing) and a set of field/value pairs. Unlike a list it is designed to be *consumed* by one or many readers, with the server tracking progress.

- \`XADD key * field value [field value ...]\` — append; \`*\` auto-generates the ID. \`XADD key MAXLEN ~ 10000 * ...\` caps the length.
- \`XLEN\`, \`XRANGE key start end\` / \`XREVRANGE\` (\`-\` / \`+\` for min/max), \`XREAD [BLOCK ms] COUNT n STREAMS key id\` — read new entries after \`id\` (\`$\` = only entries added after now).
- **Consumer groups**: \`XGROUP CREATE\`, \`XREADGROUP GROUP g c COUNT n STREAMS key >\` (deliver un-delivered entries, one per consumer), \`XACK\` (mark processed), \`XPENDING\` / \`XCLAIM\` (find and reassign stuck entries). This gives at-least-once delivery, load balancing across consumers, and recovery of unacked messages — a durable message queue.

Streams vs lists: a list is a simple queue where a popped item is gone; a stream keeps its history, supports multiple independent consumers, and tracks per-group acknowledgement.

## The specialized types

- **Bitmap** — bit operations on a string (\`SETBIT\`, \`GETBIT\`, \`BITCOUNT\`, \`BITOP\`). One bit per user ID gives a daily-active-users set in ~1 bit/user.
- **HyperLogLog** — \`PFADD\`, \`PFCOUNT\`, \`PFMERGE\`: approximate cardinality (unique count) with ~0.8% error in a fixed 12 KB, regardless of how many billions of items. For "unique visitors" where exactness does not matter.
- **Geospatial** — \`GEOADD\`, \`GEOSEARCH\` (radius or box), \`GEODIST\`: a sorted set under the hood, for "restaurants within 2 km".`,

    contentHi: `## Typed values kyun matter karti hain

Ek plain cache opaque blobs store karta hai: ek field badalne ke liye aap poori value fetch karte ho, parse karte ho, edit karte ho, re-serialize karte ho, aur wapas likhte ho — aur do clients ye karte hue race karte hain. Redis ke typed structures aapko data ko ek fine grain par address aur mutate karne dete hain, atomically.

## Hash — objects aur rows

Ek hash ek key ke neeche fields ka values par ek map hai. Ye ek record model karta hai.
- \`HSET\`, \`HGET\`, \`HGETALL\`, \`HDEL\`, \`HINCRBY key f n\` (atomic per-field arithmetic).
- Ek hash N alag string keys se zyada memory-efficient hai, aur aapko ek field update karne deta hai bina object rewrite kiye.

## List — queues, stacks, recent items

Ek list strings ka ek ordered sequence hai, dono ends par O(1) push/pop.
- \`LPUSH\`/\`RPUSH\`, \`LPOP\`/\`RPOP\`, \`LRANGE\`, \`LTRIM key 0 99\` (sirf pehle 100 rakho).
- \`BLPOP\`/\`BRPOP key timeout\` — **blocking** pop: ek element ke liye \`timeout\` seconds tak wait karo. Ye ek list ko bina polling ke ek work queue banaता hai.
- \`LMOVE\` — do lists ke beech ek element atomically move karo (reliable-queue pattern).

## Set — membership, uniqueness, relationships

Ek set unique members ka ek unordered collection hai. Add/remove/membership O(1) hain.
- \`SADD\`, \`SREM\`, \`SISMEMBER\` (O(1)), \`SCARD\`, \`SMEMBERS\` (O(n), \`SSCAN\` se page karo).
- Set algebra: \`SINTER\`/\`SUNION\`/\`SDIFF\`: mutual followers, ek segment mein users.

## Sorted set — workhorse

Ek sorted set ek set hai jahaan har member ek **score** bhi rakhta hai, aur structure score se ordered rehta hai. Operations O(log n) hain.
- \`ZADD\`, \`ZSCORE\`, \`ZRANK\`, \`ZRANGE\`/\`ZREVRANGE\`, \`ZRANGEBYSCORE\`, \`ZINCRBY\`, \`ZPOPMIN\`/\`ZPOPMAX\`.

Patterns: **leaderboard** (score = points), **priority queue** (score = priority), **time-ordered feed** (score = timestamp), **sliding-window rate limiter**.

## Stream — append-only log

Ek stream entries ka ek append-only sequence hai, har ek ek ID (\`<ms>-<seq>\`) ke saath. Ek list ke विपरीत ye ek ya kai readers dwara *consume* hone ke liye design kiya gaya hai.
- \`XADD key * field value\`, \`XRANGE\`, \`XREAD\`.
- **Consumer groups**: \`XREADGROUP\`, \`XACK\`, \`XPENDING\`/\`XCLAIM\` — at-least-once delivery, consumers ke across load balancing.

## Specialized types

- **Bitmap** — ek string par bit operations. Prati user ID ek bit ~1 bit/user mein ek daily-active-users set deता hai.
- **HyperLogLog** — approximate cardinality ~0.8% error ke saath ek fixed 12 KB mein.
- **Geospatial** — \`GEOADD\`, \`GEOSEARCH\`: "2 km ke andar restaurants".`,

    examples: [
      {
        title: 'Hash: update one field of an object without touching the rest',
        titleHi: 'Hash: ek object ka ek field update karo baaki ko touch kiye bina',
        code: `redis> HSET user:42 name "Meera" age 29 plan "free"
(integer) 3
redis> HINCRBY user:42 age 1
(integer) 30
redis> HSET user:42 plan "pro"
(integer) 0
redis> HGETALL user:42
1) "name"
2) "Meera"
3) "age"
4) "30"
5) "plan"
6) "pro"
redis> HGET user:42 plan
"pro"`,
        output: `HSET creates the hash with 3 new fields (returns 3). HINCRBY does atomic per-field arithmetic (29 -> 30). The second HSET updates an existing field (returns 0 new fields). No field change ever rewrites the whole object, and HINCRBY has no read-modify-write race.`,
        explain: '`HSET` creates the hash with three new fields (returns 3 = fields added). `HINCRBY` does atomic arithmetic on one field only (29 -> 30). The second `HSET` updates an existing field, so it returns 0 (no NEW fields). At no point is the whole object read, rewritten, or locked -- each field is addressed independently, which is why a hash beats a serialized JSON blob for a mutable record.',
        explainHi: '`HSET` hash ko teen naye fields ke saath banata hai (3 return karta hai = fields added). `HINCRBY` sirf ek field par atomic arithmetic karta hai (29 -> 30). Doosra `HSET` ek existing field update karta hai, to ye 0 return karta hai (koi NAYE fields nahi). Kisi bhi point par poora object read, rewrite, ya lock nahi hota -- har field independently address hota hai, isliye ek hash ek mutable record ke liye ek serialized JSON blob se behtar hai.',
      },
      {
        title: 'List as a blocking work queue: no polling',
        titleHi: 'List ek blocking work queue ke roop mein: koi polling nahi',
        code: `# producer:
redis> RPUSH queue:email "{\\"to\\":\\"a@x.com\\"}"
(integer) 1
redis> RPUSH queue:email "{\\"to\\":\\"b@x.com\\"}"
(integer) 2

# worker (blocks until an item exists, up to 30s):
redis> BLPOP queue:email 30
1) "queue:email"
2) "{\\"to\\":\\"a@x.com\\"}"
redis> BLPOP queue:email 30
1) "queue:email"
2) "{\\"to\\":\\"b@x.com\\"}"
redis> BLPOP queue:email 30
(nil)                    # 30s passed with an empty queue`,
        output: `RPUSH appends jobs (FIFO with LPOP/BLPOP). BLPOP removes and returns the head, but if the list is empty it blocks the connection until an item arrives or the timeout elapses, returning (nil) on timeout. The worker never polls - it is woken the instant a job is pushed.`,
        explain: '`RPUSH` appends to the tail; with `LPOP`/`BLPOP` taking from the head, the list is FIFO. `BLPOP` removes and returns the head element, but if the list is empty it BLOCKS the connection -- up to the timeout -- until something is pushed, then returns immediately. On timeout with an empty list it returns `(nil)`. The worker never polls in a loop; it is woken the instant a job arrives.',
        explainHi: '`RPUSH` tail par append karta hai; `LPOP`/`BLPOP` head se lete hue, list FIFO hai. `BLPOP` head element remove aur return karta hai, par agar list empty hai ye connection ko BLOCK karta hai -- timeout tak -- jab tak kuch push nahi hota, phir turant return karta hai. Ek empty list ke saath timeout par ye `(nil)` return karta hai. Worker kabhi ek loop mein poll nahi karta; ise ek job aane ke instant woken kiya jata hai.',
      },
      {
        title: 'Set algebra: mutual follows in one command',
        titleHi: 'Set algebra: ek command mein mutual follows',
        code: `redis> SADD following:u1 u2 u3 u4 u9
(integer) 4
redis> SADD following:u2 u1 u3 u5 u9
(integer) 4
redis> SINTER following:u1 following:u2
1) "u3"
2) "u9"
redis> SDIFF following:u1 following:u2
1) "u2"
2) "u4"
redis> SISMEMBER following:u1 u9
(integer) 1`,
        output: `SINTER returns members present in both sets (accounts u1 and u2 both follow) - u3 and u9. SDIFF returns members in the first set but not the second (u1 follows but u2 does not) - u2 and u4. SISMEMBER is an O(1) membership test.`,
        explain: '`SINTER` returns the members present in every named set -- accounts u1 and u2 both follow u3 and u9. `SDIFF` returns members in the first set but not the rest -- u1 follows u2 and u4, u2 does not. `SISMEMBER` is an O(1) "is this member here?" test. All of this is impossible efficiently with a list: a set is the structure for membership and set algebra.',
        explainHi: '`SINTER` un members ko return karta hai jo har named set mein present hain -- accounts u1 aur u2 dono u3 aur u9 ko follow karte hain. `SDIFF` un members ko return karta hai jo pehle set mein hain par baaki mein nahi -- u1 u2 aur u4 ko follow karta hai, u2 nahi. `SISMEMBER` ek O(1) "kya ye member yahaan hai?" test hai. Ye sab ek list ke saath efficiently impossible hai: ek set membership aur set algebra ke liye structure hai.',
      },
      {
        title: 'Sorted set: a live leaderboard with rank lookup',
        titleHi: 'Sorted set: rank lookup ke saath ek live leaderboard',
        code: `redis> ZADD lb:weekly 980 "ravi" 1220 "meera" 760 "sam" 1450 "priya"
(integer) 4
redis> ZINCRBY lb:weekly 300 "ravi"
"1280"
redis> ZREVRANGE lb:weekly 0 2 WITHSCORES
1) "priya"
2) "1450"
3) "ravi"
4) "1280"
5) "meera"
6) "1220"
redis> ZREVRANK lb:weekly "sam"
(integer) 3
redis> ZCOUNT lb:weekly 1000 2000
(integer) 3`,
        output: `ZADD seeds four members with scores. ZINCRBY atomically adds 300 to ravi (980 -> 1280). ZREVRANGE 0 2 returns the top 3 by descending score with their scores. ZREVRANK gives sam's 0-based position from the top (3 = 4th place). ZCOUNT counts members with a score in [1000, 2000].`,
        explain: "`ZADD` seeds four members with scores. `ZINCRBY` atomically adds 300 to ravi's score (980 -> 1280). `ZREVRANGE 0 2 WITHSCORES` returns the top 3 by descending score with their scores attached. `ZREVRANK` gives sam's 0-based position from the top (3 = 4th place). `ZCOUNT` counts members whose score falls in [1000, 2000]. All O(log n) -- the set stays sorted, so nothing is sorted in the app.",
        explainHi: '`ZADD` chaar members ko scores ke saath seed karta hai. `ZINCRBY` atomically ravi ke score mein 300 add karta hai (980 -> 1280). `ZREVRANGE 0 2 WITHSCORES` descending score se top 3 return karta hai unke scores ke saath. `ZREVRANK` sam ka 0-based position top se deta hai (3 = 4th place). `ZCOUNT` un members ko count karta hai jinka score [1000, 2000] mein aata hai. Sab O(log n) -- set sorted rehta hai, to app mein kuch sort nahi hota.',
      },
      {
        title: 'Stream: an append-only event log with auto IDs',
        titleHi: 'Stream: auto IDs ke saath ek append-only event log',
        code: `redis> XADD orders:events * type "placed" order 5001 amount 4999
"1719580800000-0"
redis> XADD orders:events * type "paid" order 5001
"1719580860000-0"
redis> XLEN orders:events
(integer) 2
redis> XRANGE orders:events - +
1) 1) "1719580800000-0"
   2) 1) "type"
      2) "placed"
      3) "order"
      4) "5001"
      5) "amount"
      6) "4999"
2) 1) "1719580860000-0"
   2) 1) "type"
      2) "paid"
      3) "order"
      4) "5001"`,
        output: `XADD with * appends an entry and returns its auto-generated <ms>-<seq> ID (monotonically increasing). XLEN is the entry count. XRANGE - + returns every entry in ID order, each as [id, [field, value, ...]]. Unlike a list, the entries stay after being read, and consumer groups can track per-consumer progress over them.`,
        explain: '`XADD` with `*` appends an entry and returns its auto-generated `<ms>-<seq>` ID, which is monotonically increasing so entries are naturally time-ordered. `XLEN` is the entry count. `XRANGE - +` returns every entry in ID order, each as `[id, [field, value, field, value, ...]]`. Unlike a list pop, the entries STAY after being read, and consumer groups can track per-consumer progress over them.',
        explainHi: '`XADD` `*` ke saath ek entry append karta hai aur iski auto-generated `<ms>-<seq>` ID return karta hai, jo monotonically increasing hai to entries naturally time-ordered hain. `XLEN` entry count hai. `XRANGE - +` har entry ko ID order mein return karta hai, har ek `[id, [field, value, ...]]` ke roop mein. Ek list pop ke विपरीत, entries padhne ke BAAD RAHTI hain, aur consumer groups unpar per-consumer progress track kar sakte hain.',
      },
    ],

    mistakes: [
      {
        wrong: `# using a LIST to check membership or dedupe
redis> RPUSH post:9:likers u1 u2 u3 ... u50000
redis> LRANGE post:9:likers 0 -1     # O(n): pull all 50k to check if u42 is in it
# and every new like has to LRANGE-scan first to avoid a duplicate`,
        right: `redis> SADD post:9:likers u42        # O(1), and inherently deduped
(integer) 1
redis> SADD post:9:likers u42        # already there
(integer) 0
redis> SISMEMBER post:9:likers u42   # O(1) membership test
(integer) 1
redis> SCARD post:9:likers           # O(1) count`,
        why: 'A list preserves insertion order and allows duplicates, and it has no efficient membership operation: determining whether a value is in a list requires scanning it, which is O(n), and preventing duplicates requires that scan on every insert. A set is the structure for the questions "is this member present" and "how many distinct members are there" and "give me the members in common with another collection", all of which it answers in O(1) or in time proportional only to the result. A set also enforces uniqueness automatically, so adding a member that is already present is a no-op that returns zero rather than creating a duplicate. Choosing a list when the access pattern is membership and uniqueness turns constant-time operations into linear scans that block the single command thread, and the fix is simply to model the data as what the queries need it to be.',
        whyHi: 'Ek list insertion order preserve karti hai aur duplicates allow karti hai, aur iske paas koi efficient membership operation nahi: ye determine karna ki ek value ek list mein hai ise scan karna require karta hai, jo O(n) hai. Ek set "kya ye member present hai" aur "kitne distinct members hain" aur "doosre collection ke saath common members do" sawalon ke liye structure hai, jo sab ye O(1) mein answer karta hai. Ek set uniqueness bhi automatically enforce karta hai.',
      },
      {
        wrong: `# building a leaderboard by sorting in application code
const all = await redis.hgetall("scores");     // { ravi: "980", meera: "1220", ... }
const top10 = Object.entries(all)
  .sort((a, b) => Number(b[1]) - Number(a[1]))
  .slice(0, 10);
# -- pulls EVERY score to the client and sorts there, every time the leaderboard
#    is viewed. O(n log n) in the app, O(n) transfer, on every page load.`,
        right: `# a sorted set keeps itself ordered; the top 10 is O(log n + 10):
redis> ZINCRBY lb:weekly 25 "ravi"          # update on score change
redis> ZREVRANGE lb:weekly 0 9 WITHSCORES   # top 10, already sorted
redis> ZREVRANK lb:weekly "ravi"            # "your rank", O(log n)`,
        why: 'A sorted set maintains its members in score order at all times, so retrieving the highest or lowest ranked members, or a member\'s rank, or the members within a score range, are all logarithmic or better and transfer only the entries actually requested. Storing scores in a hash and sorting them in application code discards this: every view of the leaderboard fetches all scores, moves them across the network, and sorts them client-side, which scales with the total number of participants rather than with the size of the page being shown, and repeats that cost on every request. The sorted set is the data structure whose entire purpose is ranked access, and its update operation ZINCRBY is also atomic, so a score change under concurrency does not race. Application-side sorting is appropriate only when the dataset is small and fetched for other reasons anyway.',
        whyHi: 'Ek sorted set apne members ko hamesha score order mein maintain karta hai, to highest ya lowest ranked members retrieve karna, ya ek member ka rank, ya ek score range ke andar members, sab logarithmic ya behtar hain aur sirf actually requested entries transfer karte hain. Scores ko ek hash mein store karna aur unhe application code mein sort karna ise discard karta hai: leaderboard ka har view saare scores fetch karta hai aur unhe client-side sort karta hai, jo total participants ki sankhya se scale karta hai. Sorted set wo data structure hai jiska poora purpose ranked access hai.',
      },
      {
        wrong: `# using pub/sub for a job queue that must not lose messages
redis> SUBSCRIBE jobs         # worker subscribes
redis> PUBLISH jobs "task-1"  # if NO worker is subscribed right now,
                              # this message is dropped forever. Pub/sub is
                              # fire-and-forget with zero persistence.`,
        right: `# a stream keeps history and tracks per-consumer delivery + acks:
redis> XADD jobs * task "task-1"
redis> XGROUP CREATE jobs workers 0
redis> XREADGROUP GROUP workers w1 COUNT 1 STREAMS jobs >
redis> XACK jobs workers 1719-0        # mark done; unacked entries can be reclaimed`,
        why: 'Redis pub/sub delivers a published message only to clients that are subscribed at the moment of publication, and keeps no record of the message afterward, so a message published while a consumer is restarting, briefly disconnected, or not yet started is lost with no trace and no way to recover it. This is acceptable for genuinely ephemeral signals such as cache-invalidation notices or live presence updates, where a missed message is corrected by the next one, but it is unsuitable for work that must be processed. A stream is the durable alternative: appended entries persist until explicitly trimmed, a consumer group tracks which entries each consumer has been delivered and which have been acknowledged, entries delivered but not acknowledged remain visible in the pending list and can be claimed by another consumer after a timeout, and a consumer that restarts resumes from where it left off. This provides at-least-once delivery and recovery, which a job queue requires and pub/sub cannot offer.',
        whyHi: 'Redis pub/sub ek published message ko sirf un clients ko deliver karta hai jo publication ke moment par subscribed hain, aur baad mein message ka koi record nahi rakhta, to ek message jo publish hua jab ek consumer restart ho raha tha ya briefly disconnected tha lost ho jata hai bina kisi trace ke. Ye genuinely ephemeral signals ke liye acceptable hai jaise cache-invalidation notices, par ye us kaam ke liye unsuitable hai jise process hona chahiye. Ek stream durable alternative hai: appended entries persist karti hain, ek consumer group track karta hai ki kaunsi entries acknowledge hui hain, aur unacknowledged entries claim ki ja sakti hain.',
      },
    ],

    realWorld: [
      {
        en: '**A user session as a hash `session:{token}` with `userId`, `csrf`, `lastSeen`, plus `EXPIRE session:{token} 1800` refreshed on each request** — one field updates without rewriting the session, and it self-expires on inactivity.',
        hi: '**Ek user session ek hash `session:{token}` ke roop mein, plus `EXPIRE session:{token} 1800`** — ek field update hota hai bina session rewrite kiye, aur ye inactivity par self-expire hota hai.',
      },
      {
        en: '**A weekly leaderboard as `ZINCRBY lb:{week} {points} {userId}` on each scoring event**, with `ZREVRANGE lb:{week} 0 99` for the page and `ZREVRANK` for "you are #4,213" — all O(log n), no sorting anywhere in the app.',
        hi: '**Ek weekly leaderboard `ZINCRBY lb:{week} {points} {userId}` ke roop mein**, `ZREVRANGE` page ke liye aur `ZREVRANK` "aap #4,213 ho" ke liye — sab O(log n).',
      },
      {
        en: '**An order-events stream `XADD orders * ...` consumed by a group of fulfillment workers** — each event delivered to exactly one worker, unacked events reclaimed via `XPENDING`/`XCLAIM` after a crash, full history retained for replay.',
        hi: '**Ek order-events stream `XADD orders * ...` fulfillment workers ke ek group dwara consumed** — har event theek ek worker ko deliver, crash ke baad unacked events `XCLAIM` se reclaimed.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a Redis sorted set and what patterns is it used for?',
        qHi: 'Ek Redis sorted set kya hai aur ye kaunse patterns ke liye istemal hota hai?',
        a: 'A sorted set is a collection of unique members where each member also has an associated floating-point score, and Redis keeps the members ordered by that score at all times, with all the main operations running in logarithmic time. You can add or update a member and its score with ZADD, atomically adjust a score with ZINCRBY, look up a member\'s score or its rank, fetch a contiguous range of members by rank position or by score value with paging, count members in a score range, and pop the lowest or highest scored member. The patterns follow from what the score represents. When the score is a point total, the structure is a leaderboard: the top N is a rank-range query, a specific player\'s standing is a rank lookup, and updating a score is one atomic command. When the score is a priority, it is a priority queue that pops the most urgent item. When the score is a timestamp, it is a time-ordered index or feed: a time window is a score-range query, and old entries are aged out by removing everything below a cutoff score. That last form also implements a sliding-window rate limiter: record each request with its timestamp as the score, remove entries older than the window, count what remains, and compare to the limit. All of these keep the ordering work on the server in logarithmic time rather than sorting in the application.',
        aHi: 'Ek sorted set unique members ka ek collection hai jahaan har member ek associated floating-point score bhi rakhta hai, aur Redis members ko us score se hamesha ordered rakhta hai, saare main operations logarithmic time mein chalte hue. Aap ZADD se ek member add ya update kar sakte ho, ZINCRBY se ek score atomically adjust kar sakte ho, ek member ka rank look up kar sakte ho, rank ya score se members ka ek range fetch kar sakte ho. Patterns score ke represent karne se follow hote hain. Jab score ek point total hai, structure ek leaderboard hai. Jab score ek priority hai, ye ek priority queue hai. Jab score ek timestamp hai, ye ek time-ordered feed ya ek sliding-window rate limiter hai.',
      },
      {
        q: 'When would you use a Redis stream instead of a list for a queue?',
        qHi: 'Ek queue ke liye aap ek list ke bजाy ek Redis stream kab istemal karoge?',
        a: 'A list works as a simple queue: producers push with RPUSH, a worker pops with BLPOP which blocks until an item is available, and a popped item is removed and gone. This is sufficient when a single pool of interchangeable workers processes each item once and there is no need to review history or recover an item whose worker crashed mid-processing. A stream is the right choice when more is required. A stream retains its entries after they are read, so the history is available for auditing or replay until explicitly trimmed. It supports consumer groups, where a group tracks which entries have been delivered to which consumer and which have been acknowledged, so multiple consumers share the load and each entry goes to exactly one of them. Entries that were delivered but never acknowledged, because the consumer crashed, stay in a pending list and can be claimed by another consumer after a timeout, giving at-least-once delivery with recovery. Multiple independent consumer groups can each read the whole stream at their own pace, which a list cannot do because a pop is destructive. So the decision is: a list for a plain disposable work queue, a stream when you need history, multiple consumers or consumer groups, acknowledgement, or recovery of unprocessed items.',
        aHi: 'Ek list ek simple queue ke roop mein kaam karti hai: producers RPUSH se push karte hain, ek worker BLPOP se pop karta hai jo ek item available hone tak block karta hai, aur ek popped item remove hokar chala jata hai. Ye tab sufficient hai jab interchangeable workers ka ek single pool har item ko ek baar process karta hai. Ek stream sahi choice hai jab zyada chahiye. Ek stream apni entries ko padhne ke baad retain karti hai. Ye consumer groups support karti hai, jahaan ek group track karta hai ki kaunsi entries acknowledge hui hain. Entries jo delivered thi par kabhi acknowledge nahi hui ek pending list mein rehti hain aur claim ki ja sakti hain, at-least-once delivery deta hai.',
      },
    ],

    exercises: [
      {
        task: 'For each requirement, name the Redis structure and the key command(s): (a) "the 20 most recent activity items for a user", (b) "the set of post IDs this user has bookmarked", (c) "the top 50 players this season", (d) "a cached user profile where `lastSeen` updates often".',
        taskHi: 'Har requirement ke liye, Redis structure aur key command(s) batao: (a) "ek user ke 20 sabse recent activity items", (b) "post IDs ka set jo is user ne bookmark kiya", (c) "is season ke top 50 players", (d) "ek cached user profile jahaan `lastSeen` aksar update hota hai".',
        hint: '(a) LIST — `LPUSH feed:{uid} item` + `LTRIM feed:{uid} 0 19`. (b) SET — `SADD bookmarks:{uid} postId` / `SISMEMBER`. (c) SORTED SET — `ZREVRANGE lb:{season} 0 49 WITHSCORES`. (d) HASH — `HSET user:{uid} ...` / `HSET user:{uid} lastSeen <ts>` (one field, no object rewrite).',
        hintHi: '(a) LIST — `LPUSH` + `LTRIM`. (b) SET — `SADD`/`SISMEMBER`. (c) SORTED SET — `ZREVRANGE`. (d) HASH — ek field, koi object rewrite nahi.',
      },
      {
        task: 'In a comment, explain why implementing a job queue with `PUBLISH`/`SUBSCRIBE` loses messages, and what a stream with a consumer group gives you instead (delivery guarantee, multiple workers, crash recovery).',
        taskHi: 'Ek comment mein, samjhao ki `PUBLISH`/`SUBSCRIBE` se ek job queue implement karna messages kyun kho deta hai.',
        hint: 'Pub/sub delivers only to clients subscribed at publish time and keeps NO record — a message published during a worker restart is gone forever. A stream + consumer group: entries persist, the group tracks delivered/acked per consumer, unacked entries sit in PENDING and can be `XCLAIM`ed after a timeout → at-least-once delivery, load-balanced across workers, recoverable after a crash.',
        hintHi: 'Pub/sub sirf publish time par subscribed clients ko deliver karta hai aur KOI record nahi rakhta. Ek stream + consumer group: entries persist, unacked entries `XCLAIM` ho sakti hain → at-least-once delivery.',
      },
      {
        task: 'A leaderboard is currently `HGETALL scores` then sort in Node on every page view, with 200k players. In a comment, describe the sorted-set redesign and give the commands for "update Ravi\'s score by +30", "top 10", and "Ravi\'s rank".',
        taskHi: 'Ek leaderboard abhi har page view par `HGETALL scores` phir Node mein sort hai, 200k players ke saath. Ek comment mein, sorted-set redesign batao.',
        hint: 'Store as a ZSET `lb`. Update: `ZINCRBY lb 30 ravi` (atomic). Top 10: `ZREVRANGE lb 0 9 WITHSCORES` (O(log n + 10)). Rank: `ZREVRANK lb ravi` (O(log n), 0-based → add 1 for display). No score ever leaves the server except the page shown.',
        hintHi: 'ZSET `lb` ke roop mein store karo. Update: `ZINCRBY lb 30 ravi`. Top 10: `ZREVRANGE lb 0 9 WITHSCORES`. Rank: `ZREVRANK lb ravi`.',
      },
    ],

    keyTakeaways: [
      'The point of Redis over a plain cache is TYPED VALUES — address and mutate data at a fine grain, atomically, server-side. Pick the structure by the QUESTION you\'ll ask, not by what the data "is".',
      'HASH = field→value map under one key (an object/row). `HSET`/`HGET`/`HGETALL`/`HINCRBY`. Update ONE field without rewriting the object; more memory-efficient than N string keys. LIST = ordered, dupes ok, O(1) push/pop BOTH ends. `LPUSH`/`RPUSH`/`LPOP`/`LRANGE`/`LTRIM key 0 N` (recent-N). `BLPOP`/`BRPOP key timeout` = BLOCKING pop → a work queue with no polling. `LMOVE` = atomic move between lists (reliable queue).',
      'SET = unordered UNIQUE members, O(1) `SADD`/`SREM`/`SISMEMBER`/`SCARD`. `SINTER`/`SUNION`/`SDIFF` (+`STORE`) = mutual follows, segments, dedup. NEVER use a LIST for membership/dedup (O(n) scan per check).',
      'SORTED SET (ZSET) = unique members each with a SCORE, kept ordered, O(log n). `ZADD`/`ZINCRBY` (atomic score bump)/`ZREVRANGE 0 9` (top 10)/`ZREVRANK` (your rank)/`ZRANGEBYSCORE` (a window). Patterns by what the score is: points→LEADERBOARD, priority→PRIORITY QUEUE, timestamp→TIME-ORDERED FEED / SLIDING-WINDOW RATE LIMITER. Don\'t `HGETALL`+sort-in-app.',
      'STREAM = append-only log of `{id → field/value}` entries (`XADD key * ...`, auto `<ms>-<seq>` id). Entries PERSIST after reading (unlike list pop). CONSUMER GROUPS (`XREADGROUP`/`XACK`/`XPENDING`/`XCLAIM`) = at-least-once delivery, load balance across consumers, reclaim unacked after a crash — a durable message queue. Pub/sub is fire-and-forget with ZERO persistence — a message with no live subscriber is gone forever; use it only for ephemeral signals. Plus BITMAP (1 bit/user flags), HYPERLOGLOG (approx unique count in 12KB), GEO (radius queries).',
    ],
    keyTakeawaysHi: [
      'Redis ka point ek plain cache ke upar TYPED VALUES hai — data ko ek fine grain par address aur mutate karo, atomically, server-side. Structure us SAWAL se chuno jo aap poochoge.',
      'HASH = ek key ke neeche field→value map (ek object/row). `HSET`/`HGET`/`HINCRBY`. EK field update karo bina object rewrite kiye. LIST = ordered, dupes ok, DONO ends O(1) push/pop. `BLPOP`/`BRPOP key timeout` = BLOCKING pop → bina polling ke ek work queue. `LMOVE` = lists ke beech atomic move.',
      'SET = unordered UNIQUE members, O(1) `SADD`/`SISMEMBER`/`SCARD`. `SINTER`/`SUNION`/`SDIFF` = mutual follows, segments, dedup. Membership/dedup ke liye KABHI ek LIST nahi (prati check O(n) scan).',
      'SORTED SET (ZSET) = unique members har ek SCORE ke saath, ordered rakha, O(log n). `ZADD`/`ZINCRBY`/`ZREVRANGE 0 9`/`ZREVRANK`/`ZRANGEBYSCORE`. Score ke hisaab se patterns: points→LEADERBOARD, priority→PRIORITY QUEUE, timestamp→TIME-ORDERED FEED / SLIDING-WINDOW RATE LIMITER.',
      'STREAM = `{id → field/value}` entries ka append-only log (`XADD key * ...`). Entries padhne ke BAAD PERSIST karti hain. CONSUMER GROUPS (`XREADGROUP`/`XACK`/`XPENDING`/`XCLAIM`) = at-least-once delivery, consumers ke across load balance, crash ke baad unacked reclaim — ek durable message queue. Pub/sub fire-and-forget hai ZERO persistence ke saath.',
    ],
  },

  {
    slug: 'redis-caching-and-core-patterns',
    title: 'Redis Caching & Core Patterns',
    titleHi: 'Redis Caching Aur Core Patterns',
    description: 'Most Redis use is a handful of patterns: cache-aside with a TTL, an eviction policy for when memory fills, INCR-based rate limiting, ZSET leaderboards, hash sessions, SET NX distributed locks, list/stream job queues, and pub/sub for fan-out. Each is a few commands — the skill is knowing which, and its failure modes.',
    descriptionHi: 'Zyaadातर Redis use kuch patterns hai: ek TTL ke saath cache-aside, memory bharne ke liye ek eviction policy, INCR-based rate limiting, ZSET leaderboards, hash sessions, SET NX distributed locks, list/stream job queues, aur fan-out ke liye pub/sub. Har ek kuch commands hai — skill hai janna kaunsा, aur iske failure modes.',
    difficulty: 'HARD',
    duration: 26,
    order: 3,

    analogy: {
      en: '**A prep station next to a slow pantry.** Cache-aside: when an order needs an ingredient, check the prep station first; if it is not there, walk to the pantry, bring it, and leave a portion on the station with a "use by" note (TTL). When the station fills up, you toss whatever has been sitting longest or is used least (eviction policy). A tally counter by the door that resets every minute stops any one customer ordering fifty times (rate limit). A single hook by the register that only one cook can hang their ticket on at a time keeps two cooks from plating the same order (lock). The skill is not the station — it is knowing what happens when the pantry trip fails, when the note expires mid-rush, or when a cook forgets to take their ticket off the hook.',
      hi: '**Ek slow pantry ke bagal mein ek prep station.** Cache-aside: jab ek order ko ek ingredient chahiye, pehle prep station check karo; agar wahaan nahi hai, pantry tak jao, ise lao, aur station par ek portion "use by" note ke saath chhoड़o (TTL). Jab station bhar jata hai, jo sabse lambe se pada hai ya sabse kam istemal hota hai use toss karo (eviction policy). Door ke paas ek tally counter jo har minute reset hota hai kisi ek customer ko pachaas baar order karne se rokta hai (rate limit). Register ke paas ek single hook jispar ek baar mein sirf ek cook apna ticket hang kar sakta hai (lock). Skill station nahi hai — ye janna hai ki kya hota hai jab pantry trip fail hoti hai.',
    },

    simple: `**CACHE-ASIDE (the 90% pattern):**
\`\`\`
val = GET key
if val is nil:                       # cache MISS
    val = load_from_database()
    SET key val EX 300               # populate with a TTL
return val
# on write to the DB: DEL key   (or SET the new value)  -> invalidation
\`\`\`

**EVICTION -- when \`maxmemory\` is hit, \`maxmemory-policy\` decides what to drop:**
\`\`\`
noeviction        -> writes error out (safe default for a PRIMARY store)
allkeys-lru       -> evict least-recently-used, any key   (good general cache)
allkeys-lfu       -> evict least-frequently-used          (better for skewed access)
volatile-lru/ttl  -> only evict keys that have a TTL set  (cache + durable keys mixed)
\`\`\`

**RATE LIMIT (fixed window):**
\`\`\`
n = INCR   rate:user:42:{minute}
if n == 1: EXPIRE rate:user:42:{minute} 60
if n > 100: reject
\`\`\`

**LEADERBOARD:** \`ZINCRBY lb {pts} {user}\` ; \`ZREVRANGE lb 0 9 WITHSCORES\` ; \`ZREVRANK lb {user}\`

**SESSION:** \`HSET session:{tok} uid 42 ...\` + \`EXPIRE session:{tok} 1800\` (refresh per request)

**DISTRIBUTED LOCK:**
\`\`\`
SET lock:resource {random} NX PX 30000      -> OK = acquired, nil = someone else has it
... do work (must finish well within 30s) ...
# release ONLY if still ours, atomically (Lua): if GET == {random} then DEL
\`\`\`

**JOB QUEUE:** \`RPUSH q job\` + worker \`BLPOP q 5\` (simple) ; \`LMOVE q processing\` (reliable) ;
or a STREAM + consumer group (acks + recovery).

**PUB/SUB:** \`SUBSCRIBE channel\` / \`PUBLISH channel msg\` -- fan-out to all current
subscribers, NO persistence, NO delivery guarantee. For cache-invalidation fan-out, live
notifications -- NOT for work that matters.`,

    simpleHi: `**CACHE-ASIDE (90% pattern):**
\`\`\`
val = GET key
if val is nil:                       # cache MISS
    val = load_from_database()
    SET key val EX 300               # ek TTL ke saath populate karo
return val
# DB par write par: DEL key   -> invalidation
\`\`\`

**EVICTION -- jab \`maxmemory\` hit hota hai, \`maxmemory-policy\` decide karti hai kya drop karna:**
\`\`\`
noeviction        -> writes error karte hain (ek PRIMARY store ke liye safe default)
allkeys-lru       -> least-recently-used evict karo   (achha general cache)
allkeys-lfu       -> least-frequently-used evict karo
volatile-lru/ttl  -> sirf TTL waali keys evict karo
\`\`\`

**RATE LIMIT (fixed window):**
\`\`\`
n = INCR   rate:user:42:{minute}
if n == 1: EXPIRE rate:user:42:{minute} 60
if n > 100: reject
\`\`\`

**LEADERBOARD:** \`ZINCRBY lb {pts} {user}\` ; \`ZREVRANGE lb 0 9 WITHSCORES\`

**SESSION:** \`HSET session:{tok} uid 42 ...\` + \`EXPIRE session:{tok} 1800\`

**DISTRIBUTED LOCK:**
\`\`\`
SET lock:resource {random} NX PX 30000      -> OK = acquired, nil = kisi aur ke paas hai
... kaam karo (30s ke andar khatam hona chahiye) ...
# release SIRF agar abhi bhi hamara hai, atomically (Lua)
\`\`\`

**JOB QUEUE:** \`RPUSH q job\` + worker \`BLPOP q 5\` ; ya ek STREAM + consumer group.

**PUB/SUB:** \`SUBSCRIBE\` / \`PUBLISH\` -- saare current subscribers ko fan-out, KOI persistence
nahi, KOI delivery guarantee nahi.`,

    content: `## Cache-aside (lazy caching)

The dominant Redis pattern. The application, not Redis, owns the logic:

1. **Read:** \`GET key\`. On a hit, return it. On a miss (\`nil\`), load from the system of record (Postgres, an API), \`SET key value EX ttl\`, and return.
2. **Write:** update the system of record, then **invalidate** the cache — \`DEL key\` (simplest, next read repopulates) or \`SET\` the new value.

Design points:

- **Every cache key gets a TTL.** It bounds staleness (an invalidation you miss self-heals in \`ttl\` seconds) and bounds memory.
- **The cache is never the source of truth.** A cache flush must only cause a latency spike, never data loss.
- **Thundering herd / cache stampede:** when a hot key expires, many requests miss simultaneously and all hit the database. Mitigations: a short lock so one request recomputes while others wait or serve stale; "early recompute" (refresh at 90% of TTL); jittered TTLs so keys don't expire in lockstep.
- **Negative caching:** cache "not found" too (with a short TTL), or a missing row is a database query on every request.

## Eviction: when memory fills

Set \`maxmemory\` (e.g. \`maxmemory 4gb\`). When reached, \`maxmemory-policy\` decides:

- **\`noeviction\`** — reject writes with an error (reads and deletes still work). The right choice when Redis holds data you cannot afford to lose — a primary store, a queue.
- **\`allkeys-lru\`** — evict the approximately least-recently-used key, from all keys. The standard pure-cache policy.
- **\`allkeys-lfu\`** — least-frequently-used (tracks access frequency with decay). Better when a small set of keys is very hot and you don't want a burst of one-off accesses to evict them.
- **\`allkeys-random\`** — evict a random key. Cheap, occasionally used.
- **\`volatile-lru\` / \`volatile-lfu\` / \`volatile-ttl\` / \`volatile-random\`** — same, but **only among keys that have a TTL**. Use when one Redis instance holds both disposable cache entries (with TTLs) and keys that must not be evicted (no TTL).

LRU/LFU in Redis are **approximate** (sampled, not a full-precision list) — a deliberate trade for speed and memory.

## Rate limiting

**Fixed window** — one counter per (subject, time bucket):

\`\`\`
key = "rate:" + userId + ":" + currentMinute
n = INCR key
if n == 1: EXPIRE key 60
if n > LIMIT: reject
\`\`\`

Simple and O(1), but allows a burst of \`2×LIMIT\` across a window boundary. **Sliding-window log** with a sorted set fixes that: \`ZREMRANGEBYSCORE key -inf (now-window)\`, \`ZCARD key\`, and if under the limit \`ZADD key now now\` + \`EXPIRE\`. More precise, more memory. **Token bucket** (a hash of \`tokens\` + \`lastRefill\`, updated in a Lua script) allows controlled bursts.

## Leaderboard and session (recap in pattern form)

- **Leaderboard:** \`ZINCRBY lb:{period} {delta} {member}\` on score events; \`ZREVRANGE\` for the page, \`ZREVRANK\` for "your rank", \`EXPIRE\` the key for time-boxed boards.
- **Session store:** \`HSET session:{token} userId ... roles ...\`, \`EXPIRE session:{token} {idleTimeout}\` reset on each authenticated request (sliding expiration). Logout = \`DEL\`. Fast, and sessions vanish on their own.

## Distributed lock

To ensure only one process runs a critical section across a fleet:

\`\`\`
token = random_uuid()
acquired = SET lock:{resource} {token} NX PX 30000   # NX = only if absent, PX = 30s auto-expiry
if not acquired: someone else holds it
# ... do the work — must complete well within 30s ...
# release, but ONLY if we still hold it (a Lua script, atomic):
#   if redis.call("GET", KEYS[1]) == ARGV[1] then return redis.call("DEL", KEYS[1]) else return 0 end
\`\`\`

Critical details:

- **The \`PX\` expiry is mandatory** — if the holder crashes, the lock must free itself.
- **Release must check the token** — otherwise a process whose lock already expired deletes a lock a *different* process now holds. The check-and-delete must be atomic (Lua), not \`GET\` then \`DEL\`.
- **This is not bulletproof.** If the holder pauses (GC, VM freeze) past the expiry, another process acquires the lock and now two run at once. **Redlock** (acquire on a majority of independent Redis nodes) reduces some failure modes but is debated; for correctness-critical mutual exclusion, a lock alone is not enough — the protected resource needs its own guard (a fencing token, a conditional write).

## Job queue

- **Simple:** \`RPUSH queue job\`; workers \`BLPOP queue 5\` in a loop. If a worker crashes after \`BLPOP\` but before finishing, the job is lost.
- **Reliable:** \`LMOVE queue processing LEFT RIGHT\` (atomically move to a per-worker processing list); on completion \`LREM processing\`; a reaper moves jobs stuck in \`processing\` too long back to \`queue\`.
- **Full-featured:** a **stream** with a consumer group — \`XADD\`, \`XREADGROUP ... >\`, \`XACK\`, and \`XAUTOCLAIM\` / \`XPENDING\` to recover entries whose consumer died. This is what libraries like BullMQ build on.

## Pub/sub

\`SUBSCRIBE channel\` / \`PSUBSCRIBE pattern\` and \`PUBLISH channel message\`: every message goes to every client subscribed **at that moment**, and is then forgotten. No persistence, no acknowledgement, no replay. It is the right tool for **fan-out of ephemeral signals**: "this cache key changed, drop your local copy", "user X came online", "config reloaded". It is the wrong tool for anything that must not be missed — use a stream. (Redis 7's **sharded pub/sub** scales fan-out in Cluster.)

## Primary store vs cache

Redis can be a primary database — with AOF persistence (Lesson 4), \`noeviction\`, and replication — for data that fits in memory and suits its structures (a rate-limiter state, a real-time counter service, an ephemeral game state). But RAM is expensive, a crash can lose the last fraction of a second of writes (with \`appendfsync everysec\`), and it has no rich querying. The common shape is **Redis as an accelerator in front of a durable database**, not instead of one.`,

    contentHi: `## Cache-aside (lazy caching)

Dominant Redis pattern. Application, Redis nahi, logic owns karti hai:
1. **Read:** \`GET key\`. Hit par, return karo. Miss par (\`nil\`), system of record se load karo, \`SET key value EX ttl\`, aur return karo.
2. **Write:** system of record update karo, phir cache **invalidate** karo — \`DEL key\`.

Design points:
- **Har cache key ko ek TTL milta hai** — staleness aur memory bound karta hai.
- **Cache kabhi source of truth nahi.** Ek cache flush sirf ek latency spike cause karna chahiye, kabhi data loss nahi.
- **Thundering herd:** jab ek hot key expire hoti hai, kai requests ek saath miss karti hain aur sab database hit karti hain. Mitigations: ek short lock, "early recompute", jittered TTLs.
- **Negative caching:** "not found" bhi cache karo.

## Eviction: jab memory bharti hai

\`maxmemory\` set karo. Jab reached, \`maxmemory-policy\` decide karti hai:
- **\`noeviction\`** — writes error karte hain. Ek primary store ke liye sahi choice.
- **\`allkeys-lru\`** — least-recently-used evict karo. Standard pure-cache policy.
- **\`allkeys-lfu\`** — least-frequently-used.
- **\`volatile-*\`** — same, par **sirf TTL waali keys ke beech**.

Redis mein LRU/LFU **approximate** hain (sampled).

## Rate limiting

**Fixed window** — prati (subject, time bucket) ek counter: \`INCR key\` + \`EXPIRE key 60\` on first. Simple par ek window boundary ke across \`2×LIMIT\` burst allow karta hai. **Sliding-window log** ek sorted set ke saath ise fix karta hai.

## Distributed lock

\`\`\`
SET lock:{resource} {token} NX PX 30000
# ... kaam karo ...
# release, par SIRF agar hum abhi bhi hold karte hain (ek Lua script, atomic)
\`\`\`
Critical: \`PX\` expiry mandatory hai; release ko token check karna chahiye (atomic, Lua); **ye bulletproof nahi hai** — agar holder pause karta hai past expiry, do process ek saath chal sakte hain. Correctness-critical mutual exclusion ke liye protected resource ko apna guard chahiye (fencing token).

## Job queue

- **Simple:** \`RPUSH queue job\`; workers \`BLPOP queue 5\`. Worker crash → job lost.
- **Reliable:** \`LMOVE queue processing\`; completion par \`LREM\`; ek reaper stuck jobs wapas move karta hai.
- **Full-featured:** ek **stream** ek consumer group ke saath — \`XACK\`, \`XPENDING\`.

## Pub/sub

Har message har us client ko jाता hai jo **us moment** subscribed hai, aur phir bhula diya jata hai. Koi persistence nahi. **Ephemeral signals ke fan-out** ke liye sahi tool. Kisi aisi cheez ke liye galat jo miss nahi honi chahiye — ek stream istemal karo.

## Primary store vs cache

Redis ek primary database ho sakta hai — AOF persistence, \`noeviction\`, replication ke saath. Par RAM mehnga hai, ek crash last fraction of a second ke writes kho sakta hai, aur iske paas koi rich querying nahi. Common shape hai **Redis ek durable database ke saamne ek accelerator ke roop mein**.`,

    examples: [
      {
        title: 'Cache-aside with a TTL and invalidation on write',
        titleHi: 'Ek TTL ke saath cache-aside aur write par invalidation',
        code: `# READ path:
redis> GET product:42
(nil)                                 # MISS
# -> app loads product 42 from Postgres, then:
redis> SET product:42 "{\\"name\\":\\"Widget\\",\\"price\\":999}" EX 300
OK
redis> GET product:42
"{\\"name\\":\\"Widget\\",\\"price\\":999}"   # HIT for the next 300s

# WRITE path (price changed in Postgres):
redis> DEL product:42
(integer) 1
# next GET misses and repopulates with fresh data`,
        output: `On a miss GET returns (nil); the app loads from the system of record and SETs the key with EX 300 so it self-expires. Subsequent reads hit Redis. On a write to the source of truth the app DELs the key, so the next read repopulates - bounded staleness (<=300s even if the DEL is missed) and bounded memory.`,
        explain: 'On a miss `GET` returns `(nil)`; the app loads from the system of record and `SET`s the key with `EX 300` so it self-expires. Subsequent reads hit Redis directly. On a write to the source of truth the app `DEL`s the key so the next read repopulates with fresh data. The TTL means even a MISSED invalidation self-heals within 300s, and memory stays bounded.',
        explainHi: 'Ek miss par `GET` `(nil)` return karta hai; app system of record se load karta hai aur key ko `EX 300` ke saath `SET` karta hai to ye self-expire hoti hai. Baad ke reads seedhे Redis hit karte hain. Source of truth par ek write par app key ko `DEL` karta hai to agla read fresh data ke saath repopulate hota hai. TTL matlab ek MISSED invalidation bhi 300s ke andar self-heal hoti hai, aur memory bounded rehti hai.',
      },
      {
        title: 'Fixed-window rate limit: INCR plus EXPIRE on the first hit',
        titleHi: 'Fixed-window rate limit: pehli hit par INCR plus EXPIRE',
        code: `# limit: 5 requests per minute per user. Key includes the minute bucket.
redis> INCR rate:u42:202406281530
(integer) 1
redis> EXPIRE rate:u42:202406281530 60      # only when INCR returned 1
(integer) 1
redis> INCR rate:u42:202406281530
(integer) 2
redis> INCR rate:u42:202406281530
(integer) 3
redis> INCR rate:u42:202406281530
(integer) 4
redis> INCR rate:u42:202406281530
(integer) 5
redis> INCR rate:u42:202406281530
(integer) 6                                  # 6 > 5 -> reject this request`,
        output: `Each request does INCR on a key scoped to the user and the current minute. The first INCR returns 1, which is when EXPIRE 60 is set so the counter clears at the window end. When the returned count exceeds the limit (6 > 5) the request is rejected. O(1) per request; the only weakness is a possible 2x burst straddling a minute boundary.`,
        explain: "Each request does `INCR` on a key scoped to the user AND the current minute bucket. The first `INCR` returns 1, which is exactly when `EXPIRE 60` is set so the counter clears at the window's end. When the returned count exceeds the limit (6 > 5) the request is rejected. O(1) per request, no database. The one weakness: a burst straddling a minute boundary can allow up to 2x the limit briefly.",
        explainHi: 'Har request user AUR current minute bucket ke scoped ek key par `INCR` karta hai. Pehla `INCR` 1 return karta hai, jo theek tab hai jab `EXPIRE 60` set hota hai to counter window ke end par clear hota hai. Jab returned count limit exceed karta hai (6 > 5) request reject hoti hai. Prati request O(1), koi database nahi. Ek weakness: ek minute boundary ke across ek burst briefly limit ka 2x tak allow kar sakta hai.',
      },
      {
        title: 'Distributed lock: SET NX PX to acquire, checked Lua DEL to release',
        titleHi: 'Distributed lock: acquire karne ko SET NX PX, release karne ko checked Lua DEL',
        code: `# acquire — only one caller wins; auto-expires in 30s if the holder dies:
redis> SET lock:report:nightly "c1f9a2e7" NX PX 30000
OK                                    # acquired
# another worker, concurrently:
redis> SET lock:report:nightly "9b3d0c11" NX PX 30000
(nil)                                 # already held -> back off / skip

# release — atomically, and ONLY if we still hold our token:
redis> EVAL "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end" 1 lock:report:nightly "c1f9a2e7"
(integer) 1                           # 1 = we released our lock; 0 = it wasn't ours anymore`,
        output: `SET ... NX PX 30000 sets the key only if absent and with a 30s expiry, so exactly one caller gets OK and the rest get (nil). The PX guarantees the lock frees itself if the holder crashes. Release runs a Lua script that deletes the key only if its value still equals our token, atomically - preventing a caller whose lock already expired from deleting a lock another caller now holds.`,
        explain: "`SET lock:... {token} NX PX 30000` sets the key ONLY if absent (`NX`) and with a 30-second auto-expiry (`PX`), so exactly one caller gets `OK` and every other gets `(nil)`. The `PX` guarantees the lock frees itself if the holder crashes. Release runs a Lua script that deletes the key only if its value still equals OUR token -- atomically -- so a caller whose lock already expired can't delete a lock a different caller now holds.",
        explainHi: '`SET lock:... {token} NX PX 30000` key ko SIRF tab set karta hai agar absent (`NX`) aur ek 30-second auto-expiry ke saath (`PX`), to theek ek caller `OK` paता hai aur har doosra `(nil)`. `PX` guarantee karta hai lock khud ko free karta hai agar holder crash karta hai. Release ek Lua script chalata hai jo key ko sirf tab delete karta hai agar iski value abhi bhi HAMARA token equal karti hai -- atomically -- to ek caller jiska lock pehle se expire ho gaya ek doosre caller ka lock delete nahi kar sakta.',
      },
    ],

    mistakes: [
      {
        wrong: `# a cache key with no TTL
redis> SET user:42:profile "{...}"      # no EX / PX
# -- if an invalidation is ever missed (a bug, a failed DEL, a write that
#    bypassed the app), this key is stale FOREVER. And it never frees memory.
#    Under maxmemory it may even be the one thing that won't get evicted.`,
        right: `redis> SET user:42:profile "{...}" EX 600
# every cache key self-heals: a missed invalidation is corrected within the TTL,
# and memory is naturally bounded. Add jitter (e.g. 540-660s) so keys written
# together don't all expire in the same instant (stampede).`,
        why: 'A cache derives its value from a source of truth and must never be trusted to hold the only copy or the current copy of anything. A TTL is what enforces that: it caps how long a cache entry can diverge from the source before it is discarded and reloaded, so an invalidation that is missed for any reason, a code path that writes to the database without clearing the cache, a delete command that failed, a race, is automatically corrected once the entry expires. It also bounds memory, because entries that stop being read still go away on their own rather than accumulating until eviction. A cache key without a TTL relies on every write path in the entire system invalidating it correctly forever, which is a guarantee no real codebase keeps, and the failure is silent: the stale value is served indefinitely with nothing to indicate it is wrong. Adding jitter to the TTL, a random spread around the nominal value, additionally prevents a batch of keys written at the same time from all expiring simultaneously and causing a synchronized flood of cache misses.',
        whyHi: 'Ek cache apni value ek source of truth se derive karta hai aur ise kabhi kisi cheez ki ekmatra copy ya current copy rakhne ke liye trust nahi kiya jana chahiye. Ek TTL ise enforce karta hai: ye cap karta hai ki ek cache entry source se kitni der diverge kar sakti hai discard hone se pehle, to ek invalidation jo kisi bhi kaaran se miss hui automatically correct ho jati hai jab entry expire hoti hai. Ye memory bhi bound karta hai. Ek TTL ke bina ek cache key poore system mein har write path par sahi invalidate hone par rely karti hai, aur failure silent hai.',
      },
      {
        wrong: `# releasing a distributed lock without checking you still own it
redis> SET lock:x {token} NX PX 5000
# ... work takes 7 seconds (GC pause, slow query) ...
# lock already auto-expired at 5s; a DIFFERENT worker acquired it at 5.5s
redis> DEL lock:x                       # you just deleted SOMEONE ELSE'S lock
# now a third worker acquires it too -> two workers in the critical section`,
        right: `redis> SET lock:x {mytoken} NX PX 30000     # generous TTL, unique token
# ... work, ideally with a watchdog that extends the TTL if still running ...
redis> EVAL "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end" 1 lock:x {mytoken}
# and: don't rely on the lock alone for correctness — the protected resource
# should reject writes that don't carry a valid fencing token`,
        why: 'A Redis lock is a key with an expiry, and the expiry exists so that a holder which crashes does not block the resource forever. But the expiry also means the lock can be released by Redis while the original holder still believes it holds it, if the holder\'s work runs longer than the TTL because of a garbage-collection pause, a slow dependency, or the process being descheduled. At that point a second worker can acquire the lock legitimately. If the first worker then issues an unconditional delete to release, it removes the second worker\'s lock, and a third worker acquires it, so two workers run the critical section concurrently, which is the exact situation the lock was meant to prevent. Releasing with a check that the lock\'s value still matches the token this worker set, performed atomically in a Lua script so the check and delete cannot be interleaved, ensures a worker only ever deletes its own lock. Even with correct release, a lock whose holder pauses past the expiry cannot guarantee mutual exclusion, so a resource that truly must not be accessed twice needs its own defense, such as rejecting operations that do not present a monotonically increasing fencing token.',
        whyHi: 'Ek Redis lock ek expiry waali key hai, aur expiry isliye exist karti hai taaki ek holder jo crash karta hai resource ko hamesha ke liye block na kare. Par expiry ka matlab bhi hai ki lock Redis dwara release ho sakta hai jab original holder abhi bhi maanta hai ki wo ise hold karta hai, agar holder ka kaam TTL se zyada lamba chalta hai. Us point par ek doosra worker lock legitimately acquire kar sakta hai. Agar pehla worker phir release karne ke liye ek unconditional delete issue karta hai, ye doosre worker ka lock remove karta hai. Ek check ke saath release karna ki lock ki value abhi bhi token match karti hai, atomically ek Lua script mein, ensure karta hai ki ek worker sirf apna lock delete karta hai.',
      },
      {
        wrong: `# pub/sub for cache invalidation across app servers, assuming reliability
# app server A: PUBLISH cache:invalidate "user:42"
# app server B was mid-deploy / reconnecting -> never got the message
# -> server B serves a stale user:42 from its local in-process cache indefinitely`,
        right: `# pub/sub is fine for the FAST path, but back it with a TTL so a missed
# message self-heals:
#   - local in-process cache entries also have a short TTL (e.g. 30s)
#   - or use key-space notifications / a stream if you need guaranteed delivery
#   - or skip the local cache and just use Redis (one network hop, always fresh)`,
        why: 'Redis pub/sub delivers a message only to the connections subscribed at the instant it is published and retains nothing, so any subscriber that is restarting, redeploying, briefly disconnected, or slow to reconnect simply does not receive that message and has no way to discover it was missed. Using pub/sub as the sole mechanism to invalidate a local in-process cache on other application servers therefore means that any server which misses an invalidation message serves the stale value until something else happens to refresh it, which may be never. Pub/sub can still be used as a fast best-effort signal, but it must be backed by a mechanism that recovers from a missed message: giving the local cache entries their own short time to live so staleness is bounded regardless, using a durable stream when delivery must be guaranteed, or removing the local cache layer entirely and reading from Redis directly, which is a single fast network call that is always current.',
        whyHi: 'Redis pub/sub ek message sirf un connections ko deliver karta hai jo publish hone ke instant subscribed hain aur kuch retain nahi karta, to koi bhi subscriber jo restart ho raha hai, redeploy ho raha hai, ya briefly disconnected hai wo message receive nahi karta aur pata nahi laga sakta ki ye miss hua. Pub/sub ko ek local cache invalidate karne ke ekmatra mechanism ke roop mein istemal karna matlab koi bhi server jo ek invalidation message miss karta hai stale value serve karta hai. Pub/sub ek fast best-effort signal ke roop mein istemal ho sakta hai, par ise ek mechanism se back karna chahiye jo ek missed message se recover kare.',
      },
    ],

    realWorld: [
      {
        en: '**A product-catalog cache: `GET product:{id}` → on miss load from Postgres, `SET ... EX 600` with ±10% jitter; on any product write, `DEL product:{id}`** — the database sees only misses and writes, and a missed invalidation self-corrects in ten minutes.',
        hi: '**Ek product-catalog cache: miss par Postgres se load, `SET ... EX 600` ±10% jitter ke saath; kisi bhi product write par `DEL product:{id}`** — database sirf misses aur writes dekhta hai.',
      },
      {
        en: '**API rate limiting as `INCR rate:{apiKey}:{minute}` + `EXPIRE 60` on the first hit, rejecting at >1000** — O(1) per request, no database, and the keys clean themselves up.',
        hi: '**API rate limiting `INCR rate:{apiKey}:{minute}` + pehli hit par `EXPIRE 60` ke roop mein, >1000 par reject** — prati request O(1), koi database nahi.',
      },
      {
        en: '**A nightly report job guarded by `SET lock:report:{date} {uuid} NX PX 600000`** across three app servers — exactly one runs it, the lock frees itself if that server dies mid-run, and release is a checked Lua DEL.',
        hi: '**Ek nightly report job `SET lock:report:{date} {uuid} NX PX 600000` se guarded** teen app servers ke across — theek ek ise chalata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Describe the cache-aside pattern and its main failure modes.',
        qHi: 'Cache-aside pattern aur iske main failure modes batao.',
        a: 'In cache-aside the application manages the cache explicitly. On a read it first asks Redis for the key; if present it uses that value, and if absent it loads the value from the system of record, writes it into Redis with a time to live, and returns it. On a write it updates the system of record and then invalidates the cache, either deleting the key so the next read repopulates it or overwriting it with the new value. The cache is always a derived copy and never the source of truth, so losing the entire cache should cause only a latency spike. The main failure modes are these. A missed invalidation, from a write path that bypasses the app or a delete that failed, serves stale data until the entry expires, which is why every key must have a TTL, ideally with jitter. A cache stampede occurs when a hot key expires and many concurrent requests all miss and hit the database at once; it is mitigated with a short lock so one request recomputes while others wait or serve stale, with early recomputation before expiry, and with jittered TTLs. Absent negative caching, a lookup for something that does not exist misses every time and queries the database on every request, so "not found" should also be cached with a short TTL. And an unbounded set of keys without TTLs grows memory until eviction starts dropping things unpredictably.',
        aHi: 'Cache-aside mein application cache ko explicitly manage karti hai. Ek read par ye pehle Redis se key maangti hai; agar present hai ise istemal karti hai, agar absent hai system of record se value load karti hai, ise Redis mein ek TTL ke saath likhti hai, aur return karti hai. Ek write par ye system of record update karti hai aur phir cache invalidate karti hai. Cache hamesha ek derived copy hai aur kabhi source of truth nahi. Main failure modes: ek missed invalidation stale data serve karta hai jab tak entry expire nahi hoti (isliye har key ko TTL chahiye); ek cache stampede jab ek hot key expire hoti hai aur kai requests ek saath miss karti hain; negative caching ke bina, ek missing row har request par database query hai.',
      },
      {
        q: 'How do you implement a distributed lock with Redis, and why is it not fully reliable?',
        qHi: 'Aap Redis ke saath ek distributed lock kaise implement karte ho, aur ye poori tarah reliable kyun nahi hai?',
        a: 'The basic implementation is a single command: SET on a lock key with a unique random token as the value, the NX option so it succeeds only if the key does not already exist, and a PX option giving it an expiry such as thirty seconds. Exactly one caller gets a success response and holds the lock; the others get a nil and must back off. The expiry is essential so that a holder which crashes does not block the resource forever. Releasing the lock must not be a plain delete, because if the holder\'s work overran the expiry the lock may have been released by Redis and re-acquired by another caller, and a plain delete would then remove that other caller\'s lock. Release is instead a small Lua script that deletes the key only if its value still equals this caller\'s token, executed atomically so the check and the delete cannot be split. It is not fully reliable because the expiry that makes it crash-safe also means the lock can expire while the original holder is merely paused, by a garbage collection stall or the process being descheduled, rather than dead. During that pause another caller acquires the lock legitimately and both now believe they hold it, so both may enter the critical section. Redlock, acquiring the lock on a majority of independent Redis nodes, addresses some failure modes but is contested. For correctness-critical mutual exclusion the protected resource itself must reject operations that do not carry a valid increasing fencing token, so a stale lock holder\'s writes are refused.',
        aHi: 'Basic implementation ek single command hai: ek lock key par SET ek unique random token value ke saath, NX option taaki ye sirf tab succeed kare jab key exist nahi karti, aur ek PX option ise ek expiry deta hai jaise tees seconds. Theek ek caller ko ek success response milta hai. Expiry essential hai taaki ek holder jo crash karta hai resource ko hamesha block na kare. Lock release karna ek plain delete nahi hona chahiye, kyunki agar holder ka kaam expiry se zyada chala lock doosre caller dwara re-acquire ho sakta hai. Release ek chhota Lua script hai jo key ko sirf tab delete karta hai agar iski value abhi bhi is caller ka token equal karti hai. Ye poori tarah reliable nahi hai kyunki expiry ka matlab bhi hai ki lock expire ho sakta hai jab original holder sirf paused hai. Correctness-critical mutual exclusion ke liye protected resource ko khud ek fencing token ki zaroorat hai.',
      },
    ],

    exercises: [
      {
        task: 'Write the cache-aside read and write pseudocode for a `user:{id}:profile` cache backed by Postgres, with a 10-minute TTL. In a comment, state what must be true if Redis is completely flushed, and why every key needs the TTL even with correct invalidation.',
        taskHi: 'Ek `user:{id}:profile` cache ke liye cache-aside read aur write pseudocode likho jo Postgres se backed hai, 10-minute TTL ke saath.',
        hint: 'Read: `v = GET k; if nil { v = db.load(); SET k v EX 600 }; return v`. Write: `db.update(); DEL k`. If Redis is flushed → only a latency spike, never data loss (cache is never source of truth). TTL is still needed because SOME write path will eventually miss the `DEL` (bug, batch job, race) — the TTL caps staleness at 10 min regardless.',
        hintHi: 'Read: `v = GET k; if nil { v = db.load(); SET k v EX 600 }`. Write: `db.update(); DEL k`. Redis flush → sirf latency spike. TTL chahiye kyunki KOI write path aakhirkar `DEL` miss karega.',
      },
      {
        task: 'In a comment, write the fixed-window rate-limit logic (5 req / 10 sec / user) with exact commands, then explain the burst weakness at a window boundary and name one structure that fixes it.',
        taskHi: 'Ek comment mein, fixed-window rate-limit logic (5 req / 10 sec / user) exact commands ke saath likho.',
        hint: '`k = "rate:"+uid+":"+floor(now/10)`; `n = INCR k`; `if n==1: EXPIRE k 10`; `if n>5: reject`. Weakness: 5 requests at the end of one window + 5 at the start of the next = 10 requests in a sub-second span. Fix: a sorted-set sliding-window log (score = timestamp, remove old, `ZCARD`, add current).',
        hintHi: '`n = INCR k`; `if n==1: EXPIRE k 10`; `if n>5: reject`. Weakness: ek window ke end par 5 + agle ke start par 5. Fix: ek sorted-set sliding-window log.',
      },
      {
        task: 'A cron job runs on 4 app servers and must execute once. In a comment, give the acquire command, the release approach, and 2 reasons the lock can still fail to guarantee single execution.',
        taskHi: 'Ek cron job 4 app servers par chalti hai aur ek baar execute honi chahiye. Ek comment mein, acquire command aur release approach do.',
        hint: 'Acquire: `SET lock:{job}:{date} {uuid} NX PX <generous ms>`. Release: Lua `if GET==uuid then DEL` (atomic, token-checked). Can still fail: (1) holder GC-pauses past the PX expiry → another server acquires → two run; (2) unchecked/`GET`-then-`DEL` release deletes someone else\'s lock. Real fix: fencing token on the protected action.',
        hintHi: 'Acquire: `SET lock:{job}:{date} {uuid} NX PX <ms>`. Release: Lua token-checked `DEL`. Fail: (1) holder PX expiry se aage GC-pause karta hai → doosra acquire karta hai; (2) unchecked release doosre ka lock delete karta hai.',
      },
    ],

    keyTakeaways: [
      'CACHE-ASIDE (the 90% pattern): read = `GET k`; on `nil` load from the system of record, `SET k v EX ttl`, return. Write = update the source of truth, then `DEL k` (or `SET` new). EVERY cache key gets a TTL (bounds staleness when an invalidation is missed + bounds memory); add JITTER so keys don\'t expire in lockstep. The cache is NEVER the source of truth — a flush is a latency spike, never data loss. Watch: cache STAMPEDE (hot key expires → herd hits DB — mitigate with a short lock / early recompute / jitter) and NEGATIVE CACHING (cache "not found" too).',
      'EVICTION when `maxmemory` is hit, set by `maxmemory-policy`: `noeviction` (writes error — the right choice for a PRIMARY store / queue), `allkeys-lru` (standard pure cache), `allkeys-lfu` (better when a few keys are very hot), `volatile-*` (only evict keys that HAVE a TTL — for a mixed cache+durable instance). LRU/LFU are APPROXIMATE (sampled).',
      'RATE LIMIT fixed-window: `n = INCR rate:{subject}:{bucket}`; `if n==1: EXPIRE 60`; `if n>LIMIT: reject`. O(1), but allows a ~2×LIMIT burst across a boundary → sorted-set SLIDING-WINDOW LOG (score=ts, drop old, `ZCARD`, add) is precise but heavier; token bucket allows controlled bursts. LEADERBOARD = `ZINCRBY`/`ZREVRANGE`/`ZREVRANK`. SESSION = `HSET session:{tok} ...` + `EXPIRE` refreshed per request (sliding).',
      'DISTRIBUTED LOCK: `SET lock:{res} {randomToken} NX PX 30000` (NX = only if absent, PX expiry is MANDATORY so a dead holder frees it). Release = a Lua script that `DEL`s ONLY if `GET == our token`, atomically (never `GET` then `DEL`). STILL NOT BULLETPROOF: if the holder pauses (GC/VM freeze) past the expiry, another caller acquires and two run at once. For correctness-critical exclusion the protected resource needs its OWN guard (a fencing token / conditional write) — Redlock reduces but doesn\'t eliminate this.',
      'JOB QUEUE: `RPUSH q job` + worker `BLPOP q 5` (simple — a crash mid-job loses it); `LMOVE q processing` + a reaper (reliable); a STREAM + consumer group (`XADD`/`XREADGROUP`/`XACK`/`XAUTOCLAIM` — acks + recovery, what BullMQ builds on). PUB/SUB (`SUBSCRIBE`/`PUBLISH`) = fan-out to CURRENT subscribers only, NO persistence, NO delivery guarantee — for ephemeral signals (cache-invalidation, presence, config reload) ONLY, never for work that matters. Redis as a PRIMARY store is possible (AOF + `noeviction` + replication) but RAM is costly, a crash can lose ~1s of writes, and there\'s no rich querying — the common shape is Redis as an accelerator IN FRONT OF a durable database.',
    ],
    keyTakeawaysHi: [
      'CACHE-ASIDE (90% pattern): read = `GET k`; `nil` par system of record se load, `SET k v EX ttl`, return. Write = source of truth update, phir `DEL k`. HAR cache key ko ek TTL milta hai (staleness + memory bound karta hai); JITTER add karo. Cache KABHI source of truth nahi. Watch: cache STAMPEDE aur NEGATIVE CACHING.',
      'EVICTION jab `maxmemory` hit hota hai, `maxmemory-policy` se set: `noeviction` (writes error — ek PRIMARY store ke liye sahi), `allkeys-lru` (standard cache), `allkeys-lfu`, `volatile-*` (sirf TTL waali keys evict karo). LRU/LFU APPROXIMATE hain.',
      'RATE LIMIT fixed-window: `n = INCR rate:{subject}:{bucket}`; `if n==1: EXPIRE 60`; `if n>LIMIT: reject`. O(1), par ek boundary ke across ~2×LIMIT burst → sorted-set SLIDING-WINDOW LOG precise par heavier. LEADERBOARD = `ZINCRBY`/`ZREVRANGE`. SESSION = `HSET` + `EXPIRE` prati request refreshed.',
      'DISTRIBUTED LOCK: `SET lock:{res} {randomToken} NX PX 30000` (NX = sirf agar absent, PX expiry MANDATORY hai). Release = ek Lua script jo `DEL` karta hai SIRF agar `GET == hamara token`, atomically. FIR BHI BULLETPROOF NAHI: agar holder pause karta hai past expiry, do caller ek saath chalte hain. Correctness-critical exclusion ke liye protected resource ko APNA guard chahiye (fencing token).',
      'JOB QUEUE: `RPUSH q job` + `BLPOP q 5` (simple — crash mid-job ise kho deta hai); `LMOVE q processing` + ek reaper (reliable); ek STREAM + consumer group (acks + recovery). PUB/SUB = sirf CURRENT subscribers ko fan-out, KOI persistence nahi, KOI delivery guarantee nahi — sirf ephemeral signals ke liye. Redis ek PRIMARY store ho sakta hai par RAM mehnga hai — common shape Redis ek durable database ke SAAMNE ek accelerator ke roop mein.',
    ],
  },
];
