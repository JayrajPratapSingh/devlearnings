/**
 * Databases Complete Course — Module 19: Redis, SQLite & Embedded Stores, lessons 4-6.
 *
 * Lesson 4: Redis operations, persistence & when it fits — RDB/AOF, pipelining,
 *           MULTI/EXEC/WATCH, Lua, Cluster/Sentinel, cache vs primary store.
 * Lesson 5: SQLite, the embedded database — in-process, one file, serverless,
 *           WAL, type affinity, PRAGMAs. (VERIFIED against a real SQLite engine.)
 * Lesson 6: SQLite in practice & when embedded stores fit — the single-writer
 *           limit, FKs-off-by-default, full SQL, and SQLite vs PostgreSQL.
 *           (VERIFIED against a real SQLite engine.)
 *
 * NOTE: The Redis lesson (4) is prose-only — real redis-cli, realistic responses,
 * not machine-verified (no in-process Redis for this toolchain). The SQLite
 * lessons (5, 6) ARE verified: every example's code runs against node:sqlite
 * (SQLite 3.50.x, fully offline) and its output is diffed against what is shown.
 */

import type { CourseLesson } from './course-js-module1';

export const NOSQL_MODULE_1_PART2: CourseLesson[] = [
  {
    slug: 'redis-operations-persistence-and-when-it-fits',
    title: 'Redis Operations, Persistence & When It Fits',
    titleHi: 'Redis Operations, Persistence Aur Kab Fit Hota Hai',
    description: 'Redis persists with RDB snapshots, an AOF append log, or both — each a different durability/restart trade. Pipelining cuts round trips; MULTI/EXEC and Lua give multi-command atomicity; WATCH gives optimistic concurrency. Cluster shards, Sentinel fails over. And Redis is usually an accelerator, not the system of record.',
    descriptionHi: 'Redis RDB snapshots, ek AOF append log, ya dono se persist karta hai — har ek ek alag durability/restart trade. Pipelining round trips kaम karta hai; MULTI/EXEC aur Lua multi-command atomicity dete hain; WATCH optimistic concurrency deta hai. Cluster shards karta hai, Sentinel fail over karta hai. Aur Redis aksar ek accelerator hai, system of record nahi.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A whiteboard (RAM) with two ways to survive a power cut: a photo taken every few minutes (RDB), and a clerk writing down each stroke as you make it in a notebook (AOF).** The photo restores fast but loses whatever changed since the last shot; the notebook loses almost nothing but is slower to replay and bigger. Pipelining is handing the clerk ten instructions at once instead of waiting for a "done" after each. A transaction is saying "queue these, then do them all with nobody cutting in". Lua is handing over a sealed index card the clerk runs start-to-finish without pause. Cluster is splitting the board across several rooms by a rule everyone knows; Sentinel is a supervisor who, if the main clerk collapses, promotes a backup and tells everyone the new desk.',
      hi: '**Ek whiteboard (RAM) power cut se bachne ke do tarikon ke saath: har kuch minute mein li gayi ek photo (RDB), aur ek clerk jo aapke har stroke ko ek notebook mein likhta hai jaise aap ise banate ho (AOF).** Photo fast restore karti hai par jo last shot ke baad badla wo kho deti hai; notebook lagभag kuch nahi khoti par replay karne mein slower hai aur baड़i hai. Pipelining clerk ko ek saath das instructions dena hai. Ek transaction kehna hai "inhe queue karo, phir sab karo bina koi beech mein aaye". Lua ek sealed index card dena hai jise clerk bina ruke start-to-finish chalata hai. Cluster board ko kai rooms mein split karna hai; Sentinel ek supervisor hai jo main clerk gir jaane par ek backup ko promote karta hai.',
    },

    simple: `**PERSISTENCE -- 3 modes:**
\`\`\`
RDB   | point-in-time SNAPSHOT to one .rdb file every N sec / M changes.
      | + tiny file, FAST restart, good for backups
      | - a crash loses everything since the last snapshot (minutes)
AOF   | APPEND every write command to a log; replay on restart.
      | appendfsync: always (safest, slow) | everysec (default, <=1s loss) | no (OS-decides)
      | + minimal data loss;  - bigger file, slower restart, periodic rewrite/compaction
BOTH  | AOF for durability + RDB for fast restart & backups (common production choice)
\`\`\`

**PIPELINING -- send many commands without waiting for each reply => 1 round trip, not N.**
Not a transaction (no atomicity, replies come back together).

**MULTI / EXEC -- queue commands, then run them with nothing interleaved (atomic).**
NO rollback -- if one command errors at runtime, the others still ran.
**WATCH key** -- EXEC aborts if \`key\` changed since WATCH => optimistic concurrency (CAS).

**LUA (\`EVAL\`) -- a script runs atomically on the single thread, start to finish.**
For read-compute-write logic that must be one indivisible step. Keep it FAST (it blocks all).

**SCALING:**
\`\`\`
Replication | async primary -> replicas; replicas serve reads; NOT for zero data loss
Sentinel    | monitors a primary, auto-promotes a replica on failure, tells clients
Cluster     | 16384 hash slots split across primaries => horizontal shard + HA
            | multi-key ops must share a slot (hash tags: {user:42}:cart, {user:42}:sess)
\`\`\`

**CACHE vs PRIMARY STORE:** default = cache/accelerator in front of a durable DB.
Primary store only when: fits in RAM + AOF + noeviction + you accept ~1s crash-loss + no rich queries.`,

    simpleHi: `**PERSISTENCE -- 3 modes:**
\`\`\`
RDB   | har N sec / M changes ek .rdb file mein point-in-time SNAPSHOT.
      | + tiny file, FAST restart;  - crash last snapshot ke baad sab kuch khota hai
AOF   | har write command ko ek log mein APPEND; restart par replay.
      | appendfsync: always (safest) | everysec (default, <=1s loss) | no
      | + minimal data loss;  - baड़i file, slower restart
BOTH  | AOF durability + RDB fast restart & backups ke liye (common production choice)
\`\`\`

**PIPELINING -- bahut commands bhejo bina har reply ke wait kiye => 1 round trip, N nahi.**
Ek transaction nahi (koi atomicity nahi).

**MULTI / EXEC -- commands queue karo, phir bina kuch interleaved chalao (atomic).**
KOI rollback nahi -- agar ek command runtime par error karta hai, baaki phir bhi chale.
**WATCH key** -- EXEC abort hota hai agar \`key\` WATCH ke baad badli => optimistic concurrency (CAS).

**LUA (\`EVAL\`) -- ek script single thread par atomically chalta hai, start to finish.**
Read-compute-write logic ke liye jo ek indivisible step honi chahiye. FAST rakho.

**SCALING:**
\`\`\`
Replication | async primary -> replicas; replicas reads serve karte hain
Sentinel    | ek primary monitor karta hai, failure par ek replica auto-promote karta hai
Cluster     | 16384 hash slots primaries ke across split => horizontal shard + HA
            | multi-key ops ek slot share karne chahiye (hash tags: {user:42}:cart)
\`\`\`

**CACHE vs PRIMARY STORE:** default = ek durable DB ke saamne cache/accelerator.
Primary store sirf jab: RAM mein fits + AOF + noeviction + ~1s crash-loss accept + no rich queries.`,

    content: `## Persistence

Redis holds data in RAM; persistence is how a restart recovers it.

**RDB (snapshotting).** Redis periodically forks and writes a compact point-in-time dump of the entire dataset to a single \`.rdb\` file, triggered by rules like "after 900s if ≥1 key changed" or "after 60s if ≥10000 changed", or on demand with \`BGSAVE\`. Pros: the file is small, loads fast on restart, and is ideal as a backup artifact to copy elsewhere. Con: a crash loses every write since the last snapshot — potentially minutes of data.

**AOF (append-only file).** Redis appends every write command to a log file as it executes. On restart it replays the log to rebuild state. The \`appendfsync\` setting controls how often the OS buffer is flushed to disk: \`always\` (fsync every write — safest, slowest), \`everysec\` (fsync once a second — the default, at most ~1 second of loss), \`no\` (let the OS decide — fastest, least safe). The AOF grows, so Redis periodically **rewrites** it into the shortest command sequence that reproduces the current state. Pros: minimal data loss. Cons: larger file, slower restart than RDB, rewrite overhead.

**Both.** Running AOF and RDB together is a common production choice: AOF bounds data loss, RDB gives fast restarts and clean backups. On restart Redis prefers the AOF.

**Neither.** A pure cache with a durable backing store behind it can run with persistence off — a restart just starts cold and refills from the source of truth.

## Pipelining

Normally a client sends a command and waits for the reply before sending the next — each command costs one network round trip. **Pipelining** sends many commands back-to-back without waiting, then reads all the replies together. A batch of 1000 \`SET\`s goes from 1000 round trips to 1. It is purely a latency optimization: the commands are **not** atomic and other clients' commands can interleave between them.

## Transactions: MULTI / EXEC / WATCH

\`MULTI\` starts a transaction; subsequent commands are **queued, not executed**; \`EXEC\` runs the whole queue with **nothing else interleaved**. \`DISCARD\` throws the queue away.

Two important limits:

- **No rollback.** If a queued command fails at execution time (e.g. \`INCR\` on a key holding a string), the other commands in the transaction **still execute**. Redis transactions guarantee isolation and all-or-nothing *dispatch*, not atomic rollback on error. (A command that is syntactically wrong is caught at queue time and aborts the whole transaction.)
- **\`WATCH key [key ...]\`** before \`MULTI\` makes \`EXEC\` a compare-and-swap: if any watched key was modified by another client between the \`WATCH\` and the \`EXEC\`, \`EXEC\` returns \`nil\` and runs nothing. The client retries. This is **optimistic concurrency** — the tool for "read a value, compute something, write it back, but only if it didn't change underneath me" when a single atomic command doesn't fit.

## Lua scripting

\`EVAL script numkeys key... arg...\` (or \`EVALSHA\` with a cached script hash) runs a Lua script **atomically on the single command thread** — it executes start to finish with nothing interleaved, and can read keys, branch on their values, and write, all as one indivisible step. This is the clean way to do multi-step conditional logic atomically (a token-bucket rate limiter, a checked lock release, a conditional multi-key update). The rule: the script must be **fast**, because it blocks every other client for its entire duration — no long loops, no huge \`SMEMBERS\`. Modern Redis also has **Functions** (\`FUNCTION LOAD\`), a more managed way to register server-side Lua.

## Scaling and availability

**Replication.** A primary asynchronously streams its writes to one or more replicas. Replicas serve reads (spreading read load) and stand by as failover targets. Because replication is async, a primary can acknowledge a write and crash before it reaches any replica — replication is for read scaling and availability, not zero-data-loss durability (\`WAIT\` can force a write to reach N replicas before returning, at a latency cost).

**Sentinel.** A set of Sentinel processes monitor a primary and its replicas; on primary failure they agree it is down, promote a replica, and reconfigure clients to point at the new primary. This is high availability for a **single-primary** (non-sharded) deployment.

**Cluster.** The keyspace is split into **16384 hash slots**; each slot is owned by one primary (each with its own replicas). A key's slot is \`CRC16(key) % 16384\`. Clients are redirected (\`MOVED\`/\`ASK\`) to the node owning a key's slot. Cluster gives horizontal scale (more primaries = more memory and throughput) plus HA. The constraint: a multi-key command (\`MGET\`, \`SINTERSTORE\`, a \`MULTI\` touching several keys) only works if all its keys are in the **same slot**, which you force with a **hash tag** — \`{user:42}:cart\` and \`{user:42}:sessions\` hash only the part in braces, so both land in one slot.

## Cache or primary store?

Redis *can* be a system of record: with AOF (\`everysec\` or \`always\`), \`maxmemory-policy noeviction\`, and replication, for data that fits in RAM and maps to its structures — a rate-limiter service, a presence/last-seen service, an ephemeral matchmaking or game state, a leaderboard as the authority.

But the defaults push you the other way: RAM costs far more per GB than disk, \`everysec\` still means a crash can lose the last second of writes, there is no secondary-index querying or joins, and a dataset that outgrows memory is a hard operational problem. The overwhelmingly common architecture is **Redis as a fast layer in front of a durable database** — cache, session store, rate limiter, queue, real-time index — with Postgres or similar as the source of truth. Reach for "Redis as primary" only when the data is genuinely ephemeral or the access pattern is a perfect fit and you have accepted the durability and memory trade-offs explicitly.`,

    contentHi: `## Persistence

Redis data RAM mein rakhta hai; persistence wo hai jaise ek restart ise recover karta hai.

**RDB (snapshotting).** Redis periodically fork karta hai aur poore dataset ka ek compact point-in-time dump ek \`.rdb\` file mein likhta hai. Pros: file chhoटi hai, restart par fast load hoti hai, backup ke liye ideal. Con: ek crash last snapshot ke baad har write khota hai — minutes ka data.

**AOF (append-only file).** Redis har write command ko ek log file mein append karta hai. \`appendfsync\`: \`always\` (safest, slowest), \`everysec\` (default, ~1s loss), \`no\`. AOF badhta hai, to Redis ise periodically **rewrite** karta hai. Pros: minimal data loss. Cons: baड़i file, slower restart.

**Both.** AOF + RDB saath ek common production choice: AOF data loss bound karta hai, RDB fast restarts deta hai.

## Pipelining

**Pipelining** bahut commands ek saath bhejta hai bina wait kiye, phir saare replies saath padhta hai. 1000 \`SET\`s 1000 round trips se 1 par jाते hain. Ye purely ek latency optimization hai: commands **atomic nahi** hain.

## Transactions: MULTI / EXEC / WATCH

\`MULTI\` ek transaction shuru karta hai; commands **queued, executed nahi**; \`EXEC\` poori queue chalata hai **bina kuch interleaved**.

- **Koi rollback nahi.** Agar ek queued command execution time par fail hota hai, baaki commands **phir bhi execute** hote hain.
- **\`WATCH key\`** \`MULTI\` se pehle \`EXEC\` ko ek compare-and-swap banaता hai: agar koi watched key badli, \`EXEC\` \`nil\` return karta hai. Ye **optimistic concurrency** hai.

## Lua scripting

\`EVAL\` ek Lua script ko **single command thread par atomically** chalata hai — start to finish bina kuch interleaved. Multi-step conditional logic atomically karne ka clean tarika. Rule: script **fast** honi chahiye.

## Scaling aur availability

**Replication.** Ek primary async apne writes ek ya zyada replicas ko stream karta hai. Async hai, to ek primary ek write acknowledge kar sakta hai aur crash kar sakta hai iske pehle ki ye kisi replica tak pahunche.

**Sentinel.** Sentinel processes ek primary monitor karte hain; primary failure par ek replica promote karte hain. Ek **single-primary** deployment ke liye HA.

**Cluster.** Keyspace **16384 hash slots** mein split hai. Multi-key command sirf tab kaam karta hai agar iski saari keys **same slot** mein hain, jise aap ek **hash tag** se force karte ho — \`{user:42}:cart\`.

## Cache ya primary store?

Redis ek system of record ho *sakta* hai. Par defaults aapko doosre tarike push karte hain: RAM disk se mehnga hai, \`everysec\` ka matlab crash last second kho sakta hai, koi secondary-index querying nahi. Overwhelmingly common architecture **Redis ek durable database ke saamne ek fast layer** hai.`,

    examples: [
      {
        title: 'MULTI/EXEC has no rollback: a runtime error does not undo the rest',
        titleHi: 'MULTI/EXEC mein koi rollback nahi: ek runtime error baaki ko undo nahi karta',
        code: `redis> SET counter "not-a-number"
OK
redis> MULTI
OK
redis> INCR counter
QUEUED
redis> SET flag "set-anyway"
QUEUED
redis> EXEC
1) (error) ERR value is not an integer or out of range
2) OK

redis> GET flag
"set-anyway"`,
        output: `The INCR fails at execution time because counter holds a string, but the transaction does NOT roll back: the SET flag still executed (EXEC's second reply is OK, and GET flag confirms it). Redis transactions give isolation and ordered dispatch, not atomic rollback on error. Only a command rejected at QUEUE time (a syntax error) aborts the whole MULTI.`,
        explain: 'The `INCR` fails at execution time because `counter` holds a non-numeric string, but the transaction does NOT roll back: the `SET flag` still executed (EXEC\'s second reply is `OK`, and `GET flag` confirms `"set-anyway"`). Redis transactions give isolation and ordered dispatch, not atomic rollback on a runtime error. Only a command rejected at QUEUE time (a syntax error) aborts the whole `MULTI`.',
        explainHi: '`INCR` execution time par fail hota hai kyunki `counter` ek non-numeric string rakhta hai, par transaction rollback NAHI hota: `SET flag` phir bhi execute hua (EXEC ka doosra reply `OK` hai, aur `GET flag` `"set-anyway"` confirm karta hai). Redis transactions isolation aur ordered dispatch dete hain, ek runtime error par atomic rollback nahi. Sirf ek command jo QUEUE time par reject hua (ek syntax error) poore `MULTI` ko abort karta hai.',
      },
      {
        title: 'WATCH: optimistic concurrency for read-compute-write',
        titleHi: 'WATCH: read-compute-write ke liye optimistic concurrency',
        code: `# move 100 from account A to B, but only if A still has what we read:
redis> WATCH acct:A
OK
redis> GET acct:A
"250"
# ... app computes: 250 >= 100, ok ...
# ... meanwhile another client does: DECRBY acct:A 200  (A is now 50) ...
redis> MULTI
OK
redis> DECRBY acct:A 100
QUEUED
redis> INCRBY acct:B 100
QUEUED
redis> EXEC
(nil)              # acct:A changed since WATCH -> EXEC ran NOTHING; retry`,
        output: `WATCH acct:A arms a compare-and-swap on that key. Because another client modified acct:A between the WATCH and the EXEC, EXEC aborts and returns (nil) - neither queued command ran. The application loops: WATCH, re-read, re-check, MULTI/EXEC, until it succeeds without interference. This is how you do conditional multi-key updates that no single atomic command covers.`,
        explain: '`WATCH acct:A` arms a compare-and-swap on that key. Because another client modified `acct:A` between the `WATCH` and the `EXEC`, `EXEC` aborts and returns `(nil)` -- neither queued command ran. The application then loops: `WATCH`, re-read, re-check, `MULTI`/`EXEC`, retrying until it succeeds with no interference. This is how you do a conditional multi-key update that no single atomic command covers.',
        explainHi: '`WATCH acct:A` us key par ek compare-and-swap arm karta hai. Kyunki ek doosre client ne `acct:A` ko `WATCH` aur `EXEC` ke beech modify kiya, `EXEC` abort hota hai aur `(nil)` return karta hai -- koi queued command nahi chala. Application phir loop karta hai: `WATCH`, re-read, re-check, `MULTI`/`EXEC`, retry karte hue jab tak ye bina interference succeed nahi karta. Ye aise aap ek conditional multi-key update karte ho jo koi single atomic command cover nahi karta.',
      },
      {
        title: 'Cluster hash tags: forcing related keys into the same slot',
        titleHi: 'Cluster hash tags: related keys ko same slot mein force karna',
        code: `# in Cluster, a multi-key command needs all keys in ONE slot.
# without a hash tag, these hash independently and likely land on different nodes:
redis> MGET user:42:cart user:42:wishlist
(error) CROSSSLOT Keys in request don't hash to the same slot

# with a hash tag {user:42}, ONLY the braces part is hashed -> same slot:
redis> MGET {user:42}:cart {user:42}:wishlist
1) "[...]"
2) "[...]"
redis> CLUSTER KEYSLOT {user:42}:cart
(integer) 8353
redis> CLUSTER KEYSLOT {user:42}:wishlist
(integer) 8353`,
        output: `In Cluster mode a key's slot is CRC16 of the key mod 16384, and a command spanning multiple slots is rejected with CROSSSLOT. A hash tag - a substring in braces - makes Redis hash only that substring, so {user:42}:cart and {user:42}:wishlist both resolve to slot 8353 and can be used together in MGET, MULTI, or a Lua script.`,
        explain: "In Cluster mode a key's slot is `CRC16(key) % 16384`, and a command spanning multiple slots is rejected with `CROSSSLOT`. A hash tag -- a substring in braces -- makes Redis hash ONLY that substring, so `{user:42}:cart` and `{user:42}:wishlist` both resolve to slot 8353 and can be used together in `MGET`, `MULTI`, or a Lua script. Without the tag the two keys would hash independently to different nodes.",
        explainHi: 'Cluster mode mein ek key ka slot `CRC16(key) % 16384` hai, aur ek command jo multiple slots span karta hai `CROSSSLOT` ke saath reject hota hai. Ek hash tag -- braces mein ek substring -- Redis ko SIRF us substring ko hash karता hai, to `{user:42}:cart` aur `{user:42}:wishlist` dono slot 8353 par resolve hote hain aur `MGET`, `MULTI`, ya ek Lua script mein saath istemal ho sakte hain. Tag ke bina do keys independently alag nodes par hash hoti.',
      },
    ],

    mistakes: [
      {
        wrong: `# expecting a Redis transaction to roll back on error, like SQL
MULTI
DECRBY stock:42 1        # succeeds, stock goes negative-safe... or not
INCR orders:count        # errors — orders:count holds "abc"
EXEC
# -- the DECRBY already applied. There is NO rollback. Your stock is now
#    decremented for an order that failed to be counted.`,
        right: `# use a Lua script for conditional atomic logic — it can CHECK then act:
EVAL "
  if tonumber(redis.call('GET', KEYS[1])) < 1 then return 0 end
  redis.call('DECRBY', KEYS[1], 1)
  redis.call('INCR', KEYS[2])
  return 1
" 2 stock:42 orders:count
# one indivisible step; the check and both writes succeed or the script returns 0`,
        why: 'A Redis MULTI/EXEC transaction queues commands and then executes them consecutively with no other client interleaved, which provides isolation and guarantees the commands run as a group, but it does not provide rollback. If a command fails when it executes, because a key holds the wrong type or a value is out of range, the commands already executed in that transaction stay applied and the remaining ones still run, because Redis has no undo log. Only an error detected while queuing, such as a malformed command, aborts the whole transaction before any of it runs. For logic that must check a condition and then apply several writes as a genuine all-or-nothing unit, the correct tool is a Lua script: it executes atomically on the single thread, can read a key, decide based on its value whether to proceed, and perform the writes, returning a result that tells the caller whether the operation happened, with no possibility of a partial application from a mid-sequence error because the script controls its own flow.',
        whyHi: 'Ek Redis MULTI/EXEC transaction commands ko queue karta hai aur phir unhe consecutively execute karta hai bina kisi doosre client ke interleaved, jo isolation deta hai, par ye rollback nahi deta. Agar ek command execute hone par fail hota hai, us transaction mein pehle se execute hue commands applied rehte hain aur baaki phir bhi chalte hain, kyunki Redis mein koi undo log nahi. Logic ke liye jo ek condition check karna chahiye aur phir kai writes ek genuine all-or-nothing unit ke roop mein apply karna chahiye, sahi tool ek Lua script hai.',
      },
      {
        wrong: `# running Redis as the only store for important data with default persistence
# redis.conf: save 3600 1 300 100 60 10000   (RDB only, no AOF)
# server crashes 40 minutes after the last snapshot
# -> 40 minutes of writes are gone, permanently`,
        right: `# for data you can't lose, turn on AOF and accept its cost:
#   appendonly yes
#   appendfsync everysec        # <= 1s of loss on crash
#   maxmemory-policy noeviction # never silently drop a key
# and still ask: does this data really belong in RAM, or in Postgres with
# Redis caching in front?`,
        why: 'Redis stores data in memory, and its default persistence in many configurations is RDB snapshotting alone, which writes a full dump only at intervals defined by elapsed time and change count. Between snapshots, every write exists only in RAM, so a crash discards all writes made since the last snapshot, which can be many minutes depending on the trigger thresholds. This is acceptable when Redis is a cache whose contents can be rebuilt from a source of truth, but it means Redis must not be the only home of data that matters unless persistence is deliberately strengthened. Enabling the append-only file with a per-second fsync bounds the loss window to about one second, and setting the eviction policy to noeviction ensures the server rejects writes rather than silently dropping keys when memory fills. Even then, keeping important data solely in Redis means paying memory prices for the whole dataset, having no rich query capability, and facing a hard problem when it outgrows RAM, so the more common and safer design keeps the durable copy in a disk database and uses Redis as an accelerating layer.',
        whyHi: 'Redis data memory mein store karta hai, aur kai configurations mein iski default persistence akeli RDB snapshotting hai, jo ek full dump sirf intervals par likhti hai. Snapshots ke beech, har write sirf RAM mein exist karta hai, to ek crash last snapshot ke baad kiye gaye saare writes discard karta hai. Ye tab acceptable hai jab Redis ek cache hai. Append-only file ko per-second fsync ke saath enable karna loss window ko lagभag ek second tak bound karta hai. Fir bhi, important data ko akele Redis mein rakhna matlab poore dataset ke liye memory prices dena aur koi rich query capability na hona.',
      },
      {
        wrong: `# a big Lua script or a huge pipeline that monopolizes the thread
EVAL "for i=1,10000000 do redis.call('SET', 'k:'..i, i) end" 0
# -- runs for seconds on the ONE command thread. Every other client — every
#    GET, every health check — is frozen until it finishes. Effective outage.`,
        right: `# chunk it: many small pipelines/scripts, yielding the thread between them
for (const batch of chunks(items, 1000)) {
  const p = redis.pipeline();
  for (const it of batch) p.set(\`k:\${it.id}\`, it.val);
  await p.exec();               // ~1 round trip per 1000, thread free between batches
}
# and keep any Lua script bounded — no unbounded loops, no O(n) over huge keys`,
        why: 'Redis executes commands, Lua scripts, and the commands in a pipeline on a single thread, one unit of work at a time, and while that unit runs no other client is served. A Lua script containing a large loop, or a pipeline containing an enormous number of commands, occupies the thread for the full duration of all that work, during which every other connection, including monitoring and health checks, is blocked. On a busy server this is indistinguishable from an outage. The mitigation is to keep every indivisible unit of work small: break a bulk operation into many modest pipelines or scripts of, for example, a thousand commands each, so the thread completes one batch, serves other waiting clients, and then takes the next batch. Lua scripts in particular must have bounded execution: no unbounded iteration, and no single command inside them that is O(n) over a large collection.',
        whyHi: 'Redis commands, Lua scripts, aur ek pipeline ke commands ek single thread par execute karta hai, ek baar mein ek unit of work, aur jab wo unit chalta hai koi doosra client serve nahi hota. Ek Lua script jismein ek baड़a loop hai, ya ek pipeline jismein ek enormous number of commands hain, thread ko us saare kaam ki poori duration ke liye occupy karta hai. Ek busy server par ye ek outage se indistinguishable hai. Mitigation har indivisible unit of work ko chhota rakhna hai.',
      },
    ],

    realWorld: [
      {
        en: '**A cache-only Redis with persistence off** — a restart starts cold and refills from Postgres within minutes; simplest possible ops, and nothing of value is ever at risk in Redis.',
        hi: '**Ek cache-only Redis persistence off ke saath** — ek restart cold shuru hota hai aur minutes ke andar Postgres se refill hota hai.',
      },
      {
        en: '**A rate-limiter and feature-flag service on Redis with AOF `everysec` + `noeviction` + a Sentinel trio** — this data IS the source of truth, fits easily in RAM, and ~1s of worst-case loss on a crash is acceptable for counters.',
        hi: '**Redis par ek rate-limiter aur feature-flag service AOF `everysec` + `noeviction` + ek Sentinel trio ke saath** — ye data source of truth HAI.',
      },
      {
        en: '**A 6-node Redis Cluster (3 primaries + 3 replicas) for a session store**, with keys hash-tagged `{sess:<id>}:*` so all of one session\'s keys sit on one shard and can be read/expired together.',
        hi: '**Ek session store ke liye ek 6-node Redis Cluster (3 primaries + 3 replicas)**, keys `{sess:<id>}:*` hash-tagged.',
      },
    ],

    interviewQA: [
      {
        q: 'Compare RDB and AOF persistence in Redis.',
        qHi: 'Redis mein RDB aur AOF persistence compare karo.',
        a: 'RDB persistence takes periodic point-in-time snapshots of the entire dataset, writing a single compact dump file when configured thresholds of elapsed time and number of changes are met, or on an explicit save command. Its advantages are that the file is small, restart is fast because loading a snapshot is quicker than replaying a log, and the file is a clean artifact to use as a backup. Its disadvantage is the loss window: a crash discards every write made since the last snapshot, which can be minutes. AOF persistence instead appends every write command to a log file as it executes, and rebuilds state on restart by replaying that log. Its fsync policy controls durability versus speed: fsync on every write is safest but slow, once per second is the default and caps loss at roughly a second, and leaving it to the operating system is fastest and least safe. Because the log grows, Redis periodically rewrites it to the minimal set of commands that reproduces the current state. AOF\'s advantage is far smaller data loss; its disadvantages are a larger file, slower restart than RDB, and the rewrite overhead. Many production deployments enable both, using AOF to bound data loss and RDB for fast restarts and backups, and Redis loads the AOF on startup when both are present.',
        aHi: 'RDB persistence poore dataset ke periodic point-in-time snapshots leta hai, ek single compact dump file likhta hai jab configured thresholds meet hote hain. Iske advantages hain ki file chhoटi hai, restart fast hai, aur file backup ke liye ek clean artifact hai. Iska disadvantage loss window hai: ek crash last snapshot ke baad kiye gaye har write ko discard karta hai. AOF persistence har write command ko ek log file mein append karta hai. Iski fsync policy durability versus speed control karti hai: har write par fsync safest par slow, per second default, OS par chhodna fastest. AOF ka advantage bahut chhota data loss; disadvantages ek baड़i file aur slower restart. Kai production deployments dono enable karte hain.',
      },
      {
        q: 'What do MULTI/EXEC and WATCH give you, and what do they NOT give you?',
        qHi: 'MULTI/EXEC aur WATCH aapko kya dete hain, aur kya NAHI dete?',
        a: 'MULTI begins a transaction, after which commands are queued rather than executed, and EXEC then runs the entire queue consecutively with no other client\'s commands interleaved, so the group executes in isolation and in order. WATCH, issued before MULTI on one or more keys, turns EXEC into a compare-and-swap: if any watched key was modified by another client between the WATCH and the EXEC, EXEC executes nothing and returns nil, and the client is expected to retry the whole sequence. Together these provide isolation and optimistic concurrency control for a read-compute-write operation that no single atomic command can express. What they do not provide is rollback. If a queued command fails at execution time, because a key holds the wrong type for instance, the commands that already ran in that transaction remain applied and the subsequent queued commands still execute; there is no undo. Only a command that is malformed and rejected at queue time aborts the transaction before any of it runs. So MULTI/EXEC is not a substitute for a SQL transaction\'s atomic rollback; for conditional logic that must be genuinely all-or-nothing, a Lua script, which controls its own control flow and executes atomically, is the right tool.',
        aHi: 'MULTI ek transaction shuru karta hai, jiske baad commands queued hote hain executed ke bजाy, aur EXEC phir poori queue consecutively chalata hai bina kisi doosre client ke commands interleaved. WATCH, MULTI se pehle ek ya zyada keys par issue kiya gaya, EXEC ko ek compare-and-swap banaता hai: agar koi watched key badli, EXEC kuch execute nahi karta aur nil return karta hai. Ye isolation aur optimistic concurrency control dete hain. Jo ye NAHI dete wo rollback hai. Agar ek queued command execution time par fail hota hai, pehle se chale commands applied rehte hain. MULTI/EXEC ek SQL transaction ke atomic rollback ka substitute nahi hai; conditional logic ke liye jo genuinely all-or-nothing honi chahiye, ek Lua script sahi tool hai.',
      },
    ],

    exercises: [
      {
        task: 'A Redis instance holds rate-limit counters and feature flags that ARE the source of truth. In a comment, specify the persistence and memory config (`appendonly`, `appendfsync`, `maxmemory-policy`) and justify each choice.',
        taskHi: 'Ek Redis instance rate-limit counters aur feature flags rakhta hai jo source of truth HAIN. Ek comment mein, persistence aur memory config specify karo.',
        hint: '`appendonly yes` (RDB alone loses minutes on a crash; this data can\'t be rebuilt). `appendfsync everysec` (≤1s loss is acceptable for counters; `always` would be slow). `maxmemory-policy noeviction` (never silently drop a flag or counter — reject writes instead if memory fills).',
        hintHi: '`appendonly yes`. `appendfsync everysec` (≤1s loss counters ke liye acceptable). `maxmemory-policy noeviction` (kabhi silently ek flag drop mat karo).',
      },
      {
        task: 'In a comment, show a MULTI/EXEC that transfers 100 from `bal:A` to `bal:B` only if `bal:A >= 100`, using WATCH. Explain what EXEC returns if another client changes `bal:A` first, and why a plain MULTI without WATCH would be wrong here.',
        taskHi: 'Ek comment mein, ek MULTI/EXEC dikhao jo `bal:A` se `bal:B` mein 100 transfer karta hai sirf agar `bal:A >= 100`, WATCH istemal karke.',
        hint: '`WATCH bal:A` → `GET bal:A` → check ≥100 in app → `MULTI` / `DECRBY bal:A 100` / `INCRBY bal:B 100` / `EXEC`. If another client modified `bal:A` after the WATCH, `EXEC` returns `(nil)` and runs nothing → retry the loop. Plain MULTI can\'t check a condition (no rollback, and the GET happened before MULTI) so it could transfer from an already-drained account.',
        hintHi: '`WATCH bal:A` → `GET` → app mein ≥100 check → `MULTI`/`DECRBY`/`INCRBY`/`EXEC`. Agar koi aur `bal:A` badalta hai, `EXEC` `(nil)` return karta hai → retry.',
      },
      {
        task: 'In a comment, explain why running `EVAL` with a script that loops 5 million times is dangerous on a production Redis, and how you would restructure a genuine bulk operation instead.',
        taskHi: 'Ek comment mein, samjhao ki ek script ke saath `EVAL` chalana jo 50 lakh baar loop karta hai ek production Redis par khatarnak kyun hai.',
        hint: 'Lua runs on the ONE command thread, start to finish, blocking every other client (GETs, health checks) for the whole run — seconds of frozen server = effective outage. Instead: many small pipelines/scripts of ~1000 ops each, so the thread finishes a batch, serves waiting clients, then takes the next.',
        hintHi: 'Lua EK command thread par chalta hai, start to finish, har doosre client ko block karta hai. Iske bजाy: ~1000 ops ke kai chhote pipelines.',
      },
    ],

    keyTakeaways: [
      'PERSISTENCE: RDB = periodic point-in-time SNAPSHOT to one file — tiny, FAST restart, great backups, but a crash loses everything since the last snapshot (minutes). AOF = APPEND every write command to a log, replay on restart — `appendfsync` `always`(safe/slow) / `everysec`(default, ≤1s loss) / `no`; bigger file, slower restart, periodic rewrite/compaction. BOTH together is the common production choice; Redis loads the AOF on restart. A pure cache can run with persistence OFF.',
      'PIPELINING = send N commands without waiting for each reply → 1 round trip instead of N. Pure latency win, NOT atomic (other clients interleave). MULTI/EXEC = queue commands, run them with nothing interleaved — isolation + ordered dispatch but NO ROLLBACK (a runtime error leaves earlier commands applied and still runs the rest; only a queue-time syntax error aborts). WATCH key before MULTI = compare-and-swap: EXEC returns `nil` and runs nothing if a watched key changed → optimistic concurrency for read-compute-write.',
      'LUA (`EVAL`/`EVALSHA`) runs a script ATOMICALLY on the single thread, start to finish — the clean way to do check-then-write conditional logic as one indivisible step (token bucket, checked lock release, conditional multi-key update). Must be FAST — it blocks every client for its whole duration; no unbounded loops, no O(n) over huge keys. Same rule for giant pipelines — chunk bulk work into ~1000-op batches.',
      'SCALING: REPLICATION = async primary→replicas (read scaling + failover targets; async ⇒ NOT zero-data-loss, `WAIT` forces N replicas at a latency cost). SENTINEL = monitors + auto-promotes a replica on primary failure + repoints clients — HA for a SINGLE-primary deploy. CLUSTER = 16384 hash slots split across primaries (horizontal scale + HA); a multi-key command needs all keys in ONE slot → force it with a HASH TAG `{user:42}:cart` (only the braces part is hashed), else `CROSSSLOT` error.',
      'CACHE vs PRIMARY STORE: default is Redis as a fast layer IN FRONT OF a durable DB (cache/session/rate-limit/queue/real-time index), Postgres-or-similar as source of truth. Redis-as-primary is viable ONLY when the data fits in RAM, maps to Redis structures, you run AOF + `noeviction` + replication, and you\'ve explicitly accepted ~1s worst-case crash loss and no rich querying. RAM costs far more per GB than disk, and outgrowing memory is a hard operational problem.',
    ],
    keyTakeawaysHi: [
      'PERSISTENCE: RDB = periodic SNAPSHOT ek file mein — tiny, FAST restart, great backups, par ek crash last snapshot ke baad sab kuch khota hai. AOF = har write command ko ek log mein APPEND — `appendfsync` `always`/`everysec`(default, ≤1s loss)/`no`; baड़i file, slower restart. DONO saath common production choice hai. Ek pure cache persistence OFF ke saath chal sakta hai.',
      'PIPELINING = N commands bhejo bina har reply ke wait kiye → 1 round trip. Pure latency win, ATOMIC NAHI. MULTI/EXEC = commands queue karo, bina kuch interleaved chalao — isolation par KOI ROLLBACK NAHI. WATCH key MULTI se pehle = compare-and-swap: EXEC `nil` return karta hai agar ek watched key badli → optimistic concurrency.',
      'LUA (`EVAL`) ek script ATOMICALLY single thread par chalata hai, start to finish — check-then-write conditional logic ek indivisible step ke roop mein karne ka clean tarika. FAST honi chahiye — ye har client ko block karti hai; koi unbounded loops nahi. Giant pipelines ke liye same rule — ~1000-op batches mein chunk karo.',
      'SCALING: REPLICATION = async primary→replicas (read scaling; async ⇒ zero-data-loss NAHI). SENTINEL = monitor + primary failure par ek replica auto-promote — ek SINGLE-primary deploy ke liye HA. CLUSTER = 16384 hash slots primaries ke across split; ek multi-key command ko saari keys EK slot mein chahiye → ek HASH TAG `{user:42}:cart` se force karo.',
      'CACHE vs PRIMARY STORE: default Redis ek durable DB ke SAAMNE ek fast layer hai, Postgres source of truth. Redis-as-primary sirf tab viable jab data RAM mein fits, Redis structures par maps, aap AOF + `noeviction` + replication chalao, aur ~1s worst-case crash loss explicitly accept karo. RAM disk se bahut mehnga hai.',
    ],
  },

  {
    slug: 'sqlite-the-embedded-database',
    title: 'SQLite: The Embedded Database',
    titleHi: 'SQLite: Embedded Database',
    description: 'SQLite is not a server — it is a library your program links against, storing an entire relational database in a single ordinary file. No daemon, no port, no configuration. It is the most deployed database engine in the world, and its quirks (type affinity, WAL mode, PRAGMAs) follow from that design.',
    descriptionHi: 'SQLite ek server nahi hai — ye ek library hai jisse aapка program link karta hai, ek poore relational database ko ek single ordinary file mein store karta hai. Koi daemon nahi, koi port nahi, koi configuration nahi. Ye duniya ka sabse zyada deployed database engine hai, aur iski quirks (type affinity, WAL mode, PRAGMAs) us design se follow hoti hain.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**A spiral notebook you carry in your bag, versus renting an office with a receptionist.** Postgres is the office: it runs whether or not you are there, people connect to it over the network, the receptionist checks credentials, and it can handle a crowd. SQLite is the notebook: it only "runs" when your program has it open, there is no network and no login because it is just a file you hold, and it is superb for one person writing at a time. You can hand the whole notebook to someone else by copying one file. The trade-offs everyone mentions — one writer at a time, loose typing — are the notebook being a notebook.',
      hi: '**Ek spiral notebook jo aap apne bag mein carry karte ho, versus ek receptionist ke saath ek office rent karna.** Postgres office hai: ye chalta hai chahे aap wahaan ho ya nahi, log ise network par connect karte hain, receptionist credentials check karta hai. SQLite notebook hai: ye sirf tab "chalta" hai jab aapка program ise open rakhta hai, koi network aur koi login nahi kyunki ye bas ek file hai jo aap hold karte ho, aur ye ek baar mein ek vyakti ke likhne ke liye superb hai. Aap poori notebook kisi aur ko ek file copy karke de sakte ho. Trade-offs jo sab mention karte hain — ek baar mein ek writer, loose typing — notebook ka notebook hona hai.',
    },

    simple: `**SQLite = a LIBRARY linked into your process. The database is ONE FILE. No server.**
\`\`\`
Postgres: your app --TCP--> postgres daemon (own process, port 5432, users, config)
SQLite:   your app --function calls--> libsqlite --reads/writes--> app.db  (a file)
\`\`\`
No daemon to start, no port, no GRANT/roles, no network. Ship the app, it IS the DBMS.
The whole database is portable: copy \`app.db\` and you have copied everything.

**Special filenames:** \`app.db\` (a file) | \`:memory:\` (RAM, gone on close) | \`""\` (temp, private)
**Sidecar files in WAL mode:** \`app.db\` + \`app.db-wal\` + \`app.db-shm\`

**TYPE AFFINITY -- the declared column type is a HINT, not a rule.**
\`\`\`
CREATE TABLE t(i INTEGER, t TEXT, x BLOB);
INSERT INTO t VALUES('123', 456, '789');
-- i:  '123' -> stored as INTEGER 123   (INTEGER affinity coerces)
-- t:  456   -> stored as TEXT '456'    (TEXT affinity coerces)
-- x:  '789' -> stored as TEXT '789'    (BLOB = NO affinity, value keeps its type)
\`\`\`
Affinities: INTEGER, TEXT, REAL, NUMERIC, BLOB(none). Use \`STRICT\` tables (3.37+) to enforce types.

**JOURNAL MODE -- how SQLite stays crash-safe:**
\`\`\`
DELETE (rollback journal, default) | writes go to the db, old pages saved aside;
                                     readers and the one writer block each other
WAL (write-ahead log)              | writes append to app.db-wal; READERS DON'T BLOCK
                                     the WRITER and vice-versa. Set once, persists.
\`\`\`

**KEY PRAGMAs (per-connection settings):**
\`\`\`
PRAGMA journal_mode = WAL;      PRAGMA foreign_keys = ON;   -- OFF by default!
PRAGMA busy_timeout = 5000;     PRAGMA synchronous = NORMAL;  PRAGMA cache_size = -20000;
\`\`\``,

    simpleHi: `**SQLite = ek LIBRARY jo aapke process mein linked hai. Database EK FILE hai. Koi server nahi.**
\`\`\`
Postgres: aapка app --TCP--> postgres daemon (own process, port 5432, users, config)
SQLite:   aapка app --function calls--> libsqlite --reads/writes--> app.db  (ek file)
\`\`\`
Koi daemon start karne ko nahi, koi port nahi, koi GRANT/roles nahi, koi network nahi.
Poora database portable hai: \`app.db\` copy karo aur aapne sab kuch copy kar liya.

**Special filenames:** \`app.db\` | \`:memory:\` (RAM, close par gone) | \`""\` (temp, private)
**WAL mode mein sidecar files:** \`app.db\` + \`app.db-wal\` + \`app.db-shm\`

**TYPE AFFINITY -- declared column type ek HINT hai, ek rule nahi.**
\`\`\`
CREATE TABLE t(i INTEGER, t TEXT, x BLOB);
INSERT INTO t VALUES('123', 456, '789');
-- i:  '123' -> INTEGER 123 ke roop mein stored   (INTEGER affinity coerce karta hai)
-- t:  456   -> TEXT '456' ke roop mein stored
-- x:  '789' -> TEXT '789' ke roop mein stored    (BLOB = KOI affinity nahi)
\`\`\`
Affinities: INTEGER, TEXT, REAL, NUMERIC, BLOB(none). Types enforce karne ko \`STRICT\` tables (3.37+).

**JOURNAL MODE -- SQLite kaise crash-safe rehta hai:**
\`\`\`
DELETE (rollback journal, default) | readers aur ek writer ek doosre ko block karte hain
WAL (write-ahead log)              | writes app.db-wal mein append; READERS WRITER ko
                                     BLOCK NAHI karte aur vice-versa. Ek baar set, persists.
\`\`\`

**KEY PRAGMAs (per-connection settings):**
\`\`\`
PRAGMA journal_mode = WAL;      PRAGMA foreign_keys = ON;   -- default OFF hai!
PRAGMA busy_timeout = 5000;     PRAGMA synchronous = NORMAL;
\`\`\``,

    content: `## Not a server — a library

Every database in this course so far runs as a **server process**: you start a daemon, it listens on a port, clients connect over a socket, and it authenticates them. SQLite is fundamentally different. It is a **C library** (about one file, ~150k lines) that your program links against and calls as functions. There is no separate process, no port, no network, no user accounts, no configuration files, no \`GRANT\`. Your application, plus \`libsqlite\`, **is** the database management system.

The database itself is a **single ordinary file** on disk — a table of contents plus B-tree pages, in a documented, cross-platform format. Copying that file copies the entire database, schema and data. This is why SQLite is the most widely deployed database engine in existence: it is inside every Android and iOS device, every major browser, countless desktop apps, aircraft, and IoT devices — anywhere a program needs structured local storage without an administrator.

## Opening a database

You "connect" by opening a file:

- \`"app.db"\` — a file, created if absent. Its directory must be writable (SQLite also creates journal/WAL sidecar files there).
- \`":memory:"\` — a database that lives entirely in RAM and vanishes when the connection closes. Ideal for tests and for transient computation.
- \`""\` (empty string) — a temporary on-disk database, private to the connection, deleted on close.

## Type affinity: declared types are hints

SQLite uses **dynamic typing**. A value's type (INTEGER, REAL, TEXT, BLOB, NULL) travels with the value, not the column. A column's declared type only gives it an **affinity** — a preference SQLite applies when storing a value, converting when it losslessly can:

- **INTEGER affinity** (declared \`INT\`, \`INTEGER\`, \`BIGINT\`, …): text or real that looks like a whole number is stored as an integer.
- **TEXT affinity** (\`TEXT\`, \`VARCHAR\`, \`CHAR\`, \`CLOB\`): numbers are stored as their text form.
- **REAL affinity** (\`REAL\`, \`DOUBLE\`, \`FLOAT\`): integers are stored as floating point.
- **NUMERIC affinity** (\`NUMERIC\`, \`DECIMAL\`, \`BOOLEAN\`, \`DATE\`, \`DATETIME\`): converts text/real to integer or real when lossless, otherwise leaves it.
- **BLOB affinity / no affinity** (declared \`BLOB\`, or no type at all): the value is stored exactly as given, whatever its type.

So \`INSERT INTO t(i,t,b) VALUES('123', 456, '789')\` into \`(i INTEGER, t TEXT, b BLOB)\` stores an integer \`123\`, the text \`'456'\`, and the text \`'789'\` (the BLOB column applied no conversion). A column declared with an unrecognized type, or none, holds whatever you put in it. Since **SQLite 3.37** you can declare a table \`STRICT\` (\`CREATE TABLE t(...) STRICT;\`), which enforces the declared types and rejects mismatches — the recommended choice for new schemas that want type safety.

## Journal modes and WAL

SQLite guarantees atomic, durable transactions by keeping a **journal** so an interrupted write can be rolled back or rolled forward on the next open.

- **Rollback journal (\`DELETE\`, the default)**: before modifying a page, SQLite copies the original into a \`-journal\` file. On commit the journal is deleted; on crash the next connection restores from it. Under this mode a writer takes an exclusive lock on the whole file, so **readers and the writer block each other**.
- **Write-Ahead Log (\`WAL\`)**: changes are appended to a \`-wal\` file and only later "checkpointed" back into the main database. Crucially, **readers see a consistent snapshot from the main file while a writer appends to the WAL**, so readers and the writer do not block each other, and multiple readers run concurrently with one writer. WAL is set once (\`PRAGMA journal_mode = WAL\`) and the setting persists in the database file. It adds two sidecar files (\`-wal\`, \`-shm\`) and needs the occasional checkpoint. For almost any application with concurrent reads, WAL is the right mode.

(Note: setting \`journal_mode = WAL\` on a \`:memory:\` database has no effect — it reports \`memory\`.)

## PRAGMAs

\`PRAGMA\` statements read or set engine options, most **per connection** (so you issue them right after opening):

- \`PRAGMA journal_mode = WAL;\` — persistent, set once per database.
- \`PRAGMA foreign_keys = ON;\` — **foreign key enforcement is OFF by default** in the SQLite C library and must be enabled on every connection (some wrappers, including Node's \`node:sqlite\`, turn it on for you — but never assume).
- \`PRAGMA busy_timeout = 5000;\` — when the database is locked by another connection, wait up to this many milliseconds for the lock instead of failing immediately with \`SQLITE_BUSY\`.
- \`PRAGMA synchronous = NORMAL;\` — with WAL, \`NORMAL\` is safe against application crashes and much faster than \`FULL\` (the rollback-journal default); \`FULL\` also survives an OS crash / power loss mid-checkpoint.
- \`PRAGMA cache_size = -20000;\` — page cache size; a negative value is kibibytes (here ~20 MB).
- \`PRAGMA optimize;\` — run before closing a long-lived connection to update planner statistics.

A typical connection-open sequence for a server-side app: \`journal_mode=WAL\`, \`busy_timeout=5000\`, \`foreign_keys=ON\`, \`synchronous=NORMAL\`.`,

    contentHi: `## Ek server nahi — ek library

Is course mein ab tak har database ek **server process** ke roop mein chalta hai: aap ek daemon start karte ho, ye ek port par listen karta hai, clients ek socket par connect karte hain. SQLite fundamentally alag hai. Ye ek **C library** hai jisse aapका program link karta hai aur functions ke roop mein call karta hai. Koi alag process nahi, koi port nahi, koi network nahi, koi user accounts nahi, koi \`GRANT\` nahi.

Database khud disk par ek **single ordinary file** hai. Us file ko copy karna poore database ko copy karta hai. Isliye SQLite existence mein sabse widely deployed database engine hai.

## Ek database open karna

- \`"app.db"\` — ek file, absent hone par created.
- \`":memory:"\` — ek database jo poori tarah RAM mein rehta hai aur connection close hone par vanish hota hai. Tests ke liye ideal.
- \`""\` — ek temporary on-disk database.

## Type affinity: declared types hints hain

SQLite **dynamic typing** istemal karta hai. Ek value ka type value ke saath travel karta hai, column ke saath nahi. Ek column ka declared type sirf ise ek **affinity** deta hai — ek preference jo SQLite apply karta hai jab losslessly kar sakta hai:
- **INTEGER affinity**: text jo ek whole number jaisा dikhता hai integer ke roop mein stored.
- **TEXT affinity**: numbers unke text form ke roop mein stored.
- **BLOB affinity / no affinity**: value theek jaise di gayi stored hoti hai.

**SQLite 3.37** se aap ek table \`STRICT\` declare kar sakte ho, jo declared types enforce karta hai.

## Journal modes aur WAL

- **Rollback journal (\`DELETE\`, default)**: ek page modify karne se pehle, SQLite original ko ek \`-journal\` file mein copy karta hai. Is mode mein ek writer poori file par ek exclusive lock leta hai, to **readers aur writer ek doosre ko block karte hain**.
- **Write-Ahead Log (\`WAL\`)**: changes ek \`-wal\` file mein append hote hain. **Readers main file se ek consistent snapshot dekhte hain jab ek writer WAL mein append karta hai**, to readers aur writer ek doosre ko block nahi karte. WAL ek baar set kiya jata hai aur setting database file mein persist karti hai.

## PRAGMAs

- \`PRAGMA journal_mode = WAL;\` — persistent.
- \`PRAGMA foreign_keys = ON;\` — **foreign key enforcement default OFF hai** aur har connection par enable honi chahiye.
- \`PRAGMA busy_timeout = 5000;\` — database locked hone par turant fail hone ke bजाy itne milliseconds tak wait karo.
- \`PRAGMA synchronous = NORMAL;\` — WAL ke saath, safe aur \`FULL\` se fast.`,

    examples: [
      {
        title: 'One file, no server: a separate connection sees what another wrote',
        titleHi: 'Ek file, koi server nahi: ek alag connection dekhta hai jo doosre ne likha',
        code: `const path = tmp();

// one connection writes and closes — no daemon anywhere:
const first = open(path);
first.exec('CREATE TABLE notes(id INTEGER PRIMARY KEY, body TEXT)');
first.prepare('INSERT INTO notes(body) VALUES(?)').run('buy milk');
first.close();

// a completely independent connection to the same file:
const second = open(path);
print(second.prepare('SELECT * FROM notes').all());`,
        output: `[{"id":1,"body":"buy milk"}]`,
        explain: 'The first connection creates a table and inserts a row, then closes -- no server process exists anywhere. A completely independent second connection opens the same file and reads the row back: `[{"id":1,"body":"buy milk"}]`. The whole "database" is that one file; opening it is the entire connection step, and copying the file would copy everything.',
        explainHi: 'Pehla connection ek table banata hai aur ek row insert karta hai, phir close hota hai -- koi server process kahin exist nahi karta. Ek poori tarah independent doosra connection usi file ko open karta hai aur row wapas padhta hai: `[{"id":1,"body":"buy milk"}]`. Poora "database" wo ek file hai; ise open karna poora connection step hai, aur file copy karna sab kuch copy karega.',
      },
      {
        title: 'Type affinity: the declared column type coerces the value (or does not)',
        titleHi: 'Type affinity: declared column type value ko coerce karta hai (ya nahi)',
        code: `db.exec('CREATE TABLE t(i INTEGER, t TEXT, blob_col BLOB)');
db.exec("INSERT INTO t VALUES('42', 42, '42')");

// typeof() reports how each value is ACTUALLY stored:
print(db.prepare(
  'SELECT typeof(i) AS i_col, typeof(t) AS t_col, typeof(blob_col) AS blob_col FROM t'
).get());`,
        output: `{"i_col":"integer","t_col":"text","blob_col":"text"}`,
        explain: "The column's declared type only sets an affinity. `'42'` into the `INTEGER` column is losslessly convertible, so it's stored as an integer. `42` into the `TEXT` column is coerced to the text `'42'`. `'42'` into the `BLOB` column keeps its type unchanged, because BLOB means NO affinity -- the value is stored exactly as it arrived. `typeof()` reports the actual storage class: `integer`, `text`, `text`.",
        explainHi: "Column ka declared type sirf ek affinity set karta hai. `'42'` `INTEGER` column mein losslessly convertible hai, to ye ek integer ke roop mein stored hai. `42` `TEXT` column mein text `'42'` mein coerce hota hai. `'42'` `BLOB` column mein apna type unchanged rakhta hai, kyunki BLOB matlab KOI affinity nahi -- value theek jaise aayi stored hoti hai. `typeof()` actual storage class report karta hai: `integer`, `text`, `text`.",
      },
      {
        title: 'WAL mode on a file; no effect on :memory:',
        titleHi: 'Ek file par WAL mode; :memory: par koi effect nahi',
        code: `// on a real file, journal_mode = WAL sticks (persisted in the file header):
const fileDb = open(tmp());
print(fileDb.prepare('PRAGMA journal_mode = WAL').get());

// on an in-memory database, WAL is not applicable:
print(db.prepare('PRAGMA journal_mode').get());`,
        output: `{"journal_mode":"wal"}
{"journal_mode":"memory"}`,
        explain: 'On a real file, `PRAGMA journal_mode = WAL` takes effect and is written into the database file header, so it persists across connections -- the result is `{"journal_mode":"wal"}`. On an in-memory database WAL is not applicable, and the mode stays `{"journal_mode":"memory"}`. This is why WAL is enabled once per database file, and why `:memory:` databases behave differently.',
        explainHi: 'Ek real file par, `PRAGMA journal_mode = WAL` take effect karta hai aur database file header mein likha jata hai, to ye connections ke across persist karta hai -- result `{"journal_mode":"wal"}` hai. Ek in-memory database par WAL applicable nahi, aur mode `{"journal_mode":"memory"}` rehta hai. Isliye WAL prati database file ek baar enable hota hai, aur isliye `:memory:` databases alag behave karte hain.',
      },
    ],

    mistakes: [
      {
        wrong: `// assuming a column typed INTEGER (or DATE, or BOOLEAN) rejects wrong values
db.exec('CREATE TABLE event(id INTEGER, happened_at DATE, is_live BOOLEAN)');
db.exec("INSERT INTO event VALUES('not a number', 'tuesday', 'maybe')");
// -- ALL THREE inserts succeed. SQLite stored the strings as-is (or coerced
//    where it losslessly could). A later "WHERE id > 100" silently misbehaves.`,
        right: `// declare the table STRICT (SQLite 3.37+) to enforce declared types:
db.exec(\`CREATE TABLE event(
  id INTEGER, happened_at TEXT, is_live INTEGER
) STRICT\`);
// now INSERT ... VALUES('not a number', ...) fails with a datatype mismatch.
// STRICT allows only INT/INTEGER/REAL/TEXT/BLOB/ANY as column types.`,
        why: 'SQLite is dynamically typed: a value carries its own type and a column\'s declared type only establishes an affinity, a preference SQLite uses to convert an incoming value when the conversion is lossless, and otherwise it stores the value in whatever type it arrived as. A column declared INTEGER will store the text "not a number" as text, because that string cannot be losslessly converted to an integer, and a column declared with a type SQLite does not recognize, such as BOOLEAN or a custom name, gets no affinity at all and stores anything. This means the declared types in an ordinary SQLite schema are documentation and hints, not constraints, and code that assumes the database rejects type-inappropriate values is relying on a guarantee that is not there. A STRICT table, available since version 3.37, changes this: it permits only a small fixed set of column types and enforces them, rejecting an insert or update whose value does not match the declared type. New schemas that want the type safety of a conventional database should declare their tables STRICT.',
        whyHi: 'SQLite dynamically typed hai: ek value apna type carry karti hai aur ek column ka declared type sirf ek affinity establish karta hai, ek preference jo SQLite ek incoming value ko convert karne ke liye istemal karta hai jab conversion lossless hai, aur warna ye value ko us type mein store karta hai jismein ye aayi. INTEGER declared ek column text "not a number" ko text ke roop mein store karega. Iska matlab ek ordinary SQLite schema mein declared types documentation aur hints hain, constraints nahi. Ek STRICT table, version 3.37 se available, ise badalta hai: ye column types ka ek chhota fixed set permit karta hai aur unhe enforce karta hai.',
      },
      {
        wrong: `// putting the SQLite file on a network share (NFS / SMB) for "shared access"
const db = open('//fileserver/shared/app.db');
// -- SQLite's locking relies on OS file locks that network filesystems
//    implement incompletely or incorrectly. Concurrent access from multiple
//    machines can and does CORRUPT the database file.`,
        right: `// SQLite is single-machine. For multi-machine access, either:
//  - run a real client/server database (Postgres, MySQL)
//  - or put a small service in front of the SQLite file and have it be the
//    only process that opens the file (this is what Litestream/rqlite/Turso do)`,
        why: 'SQLite coordinates concurrent access to a database file using file locks provided by the host operating system, and this scheme is correct only when all processes accessing the file see a consistent, correctly implemented locking layer, which is the case on a single machine\'s local filesystem. Network filesystems such as NFS and SMB implement file locking partially, with caching layers and protocol limitations that can allow two clients on different machines to both believe they hold an exclusive lock, and when both then write, the database file is corrupted. The SQLite documentation states plainly that its locking will not work reliably over a network filesystem. SQLite is therefore a single-machine database. When multiple machines must share the data, the options are to use a database designed for networked client/server access, or to keep the SQLite file on one machine and place a single process in front of it that is the sole opener of the file and exposes access over the network itself, which is the model used by tools built to distribute SQLite.',
        whyHi: 'SQLite ek database file ke concurrent access ko host operating system dwara diye gaye file locks ka istemal karke coordinate karta hai, aur ye scheme sirf tab sahi hai jab file access karne wale saare processes ek consistent locking layer dekhte hain, jo ek single machine ke local filesystem par hota hai. Network filesystems jaise NFS aur SMB file locking partially implement karte hain, jo do clients ko alag machines par dono believe karne de sakta hai ki wo ek exclusive lock hold karte hain, aur jab dono likhte hain, database file corrupt hoti hai. SQLite isliye ek single-machine database hai.',
      },
      {
        wrong: `// opening a connection per request in a web server, with default settings
app.get('/x', (req, res) => {
  const db = open('app.db');           // rollback-journal mode (default)
  // ... a read query ...
  // meanwhile a background job holds a write transaction ->
  // this read gets SQLITE_BUSY and the request 500s
});`,
        right: `// enable WAL once, and set a busy_timeout on every connection:
const db = open('app.db');
db.exec('PRAGMA journal_mode = WAL');   // readers no longer block the writer
db.exec('PRAGMA busy_timeout = 5000');  // wait up to 5s for a lock, don't fail fast
db.exec('PRAGMA foreign_keys = ON');
// better: reuse ONE long-lived connection (or a tiny pool) per process`,
        why: 'In the default rollback-journal mode a writing transaction takes an exclusive lock on the entire database file, during which no other connection can read or write, so a read issued while any writer is active fails immediately with a busy error unless a busy timeout is configured. Write-ahead logging changes this: a writer appends to a separate log file while readers continue to see a consistent snapshot of the main file, so readers and a writer no longer block each other and read-heavy concurrent workloads stop hitting busy errors from ordinary writes. Because the journal mode is stored in the database file, enabling WAL once is sufficient. Setting a busy timeout on each connection additionally tells SQLite to wait and retry for a bounded period when it does encounter a lock, such as two writers contending, rather than returning a busy error on the first attempt. Combined with reusing a small number of long-lived connections rather than opening one per request, these settings make SQLite behave well under the concurrency a typical server-side application produces.',
        whyHi: 'Default rollback-journal mode mein ek writing transaction poore database file par ek exclusive lock leti hai, jiske dauran koi doosra connection read ya write nahi kar sakta, to ek read jo kisi writer ke active hone par issue hui turant ek busy error ke saath fail hoti hai jab tak ek busy timeout configure na ho. Write-ahead logging ise badalta hai: ek writer ek alag log file mein append karta hai jab readers main file ka ek consistent snapshot dekhte rehte hain, to readers aur ek writer ek doosre ko block nahi karte. Har connection par ek busy timeout set karna additionally SQLite ko wait aur retry karne ko kehta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every iOS and Android app that stores structured data locally** — contacts, messages, settings, offline caches — uses SQLite (often via Core Data or Room), because there is no server to run on a phone and the whole database is one file in the app\'s sandbox.',
        hi: '**Har iOS aur Android app jo structured data locally store karti hai** SQLite istemal karti hai, kyunki ek phone par chalaने ke liye koi server nahi.',
      },
      {
        en: '**A CLI tool that keeps state in `~/.mytool/state.db`** — a single-file SQLite database means the tool works with zero setup, the state is trivially inspectable with the `sqlite3` shell, and a user can back it up by copying one file.',
        hi: '**Ek CLI tool jo `~/.mytool/state.db` mein state rakhta hai** — ek single-file SQLite database matlab tool zero setup ke saath kaam karta hai.',
      },
      {
        en: '**A test suite that opens a `:memory:` SQLite database per test** — each test gets a pristine schema in microseconds, tests run in parallel with no shared state, and nothing touches the disk.',
        hi: '**Ek test suite jo prati test ek `:memory:` SQLite database open karti hai** — har test ko microseconds mein ek pristine schema milta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How is SQLite architecturally different from PostgreSQL or MySQL?',
        qHi: 'SQLite architecturally PostgreSQL ya MySQL se kaise alag hai?',
        a: 'PostgreSQL and MySQL are client/server databases: a dedicated server process runs continuously, listens on a network port, manages its own memory and background workers, authenticates connecting clients against user accounts, and mediates all access to the data files, which only it touches. Applications talk to it over a socket using a wire protocol. SQLite has no server at all. It is a library that the application links directly into its own process and calls as ordinary functions, and the database is a single file on the local disk that the library reads and writes directly. There is no daemon to start or supervise, no port, no network, no user accounts or privilege system, and no configuration files; the running application together with the linked library is the entire database engine. The database file is in a documented cross-platform format, so copying that one file copies the whole database. The consequences are that SQLite deploys with zero administration and is embedded anywhere a program needs local structured storage, but it is a single-machine database with one writer at a time, without the networked multi-user concurrency, role-based access control, and horizontal operational tooling that a client/server database provides.',
        aHi: 'PostgreSQL aur MySQL client/server databases hain: ek dedicated server process continuously chalta hai, ek network port par listen karta hai, connecting clients ko user accounts ke against authenticate karta hai, aur data files ke saare access ko mediate karta hai. Applications ise ek socket par baat karti hain. SQLite mein koi server nahi. Ye ek library hai jo application apne process mein directly link karti hai aur functions ke roop mein call karti hai, aur database local disk par ek single file hai. Koi daemon nahi, koi port nahi, koi network nahi, koi user accounts nahi. Consequences ye hain ki SQLite zero administration ke saath deploy hota hai, par ye ek single-machine database hai ek baar mein ek writer ke saath.',
      },
      {
        q: 'What is type affinity in SQLite and how do you get strict typing?',
        qHi: 'SQLite mein type affinity kya hai aur aap strict typing kaise pate ho?',
        a: 'SQLite is dynamically typed. A value carries its own storage class, one of integer, real, text, blob, or null, and that travels with the value rather than being fixed by the column. A column\'s declared type only gives the column an affinity, which is a preference SQLite applies when a value is stored: it will convert the incoming value to the preferred class when that conversion loses no information, and otherwise it stores the value in whatever class it arrived as. The affinities are integer, text, real, numeric, and blob, and SQLite derives which one a column has from substrings in its declared type, so INT-anything gets integer affinity, CHAR or TEXT or CLOB gets text affinity, and a declared type SQLite does not recognize, or no declared type, yields blob affinity, meaning no conversion at all. The practical effect is that an ordinary SQLite column does not reject a value of the "wrong" type; the declared types are hints. To get enforced typing, declare the table STRICT, a feature added in version 3.37. A STRICT table permits only a small fixed set of column types and rejects any insert or update whose value does not match the column\'s declared type, giving the behavior a developer coming from a conventional SQL database expects.',
        aHi: 'SQLite dynamically typed hai. Ek value apni khud ki storage class carry karti hai, aur wo value ke saath travel karti hai column dwara fix hone ke bजाy. Ek column ka declared type sirf column ko ek affinity deta hai, jo ek preference hai jo SQLite apply karta hai jab ek value store hoti hai: ye incoming value ko preferred class mein convert karega jab wo conversion koi information nahi khोti. Affinities integer, text, real, numeric, aur blob hain. Practical effect ye hai ki ek ordinary SQLite column ek "wrong" type ki value reject nahi karta. Enforced typing pane ke liye, table ko STRICT declare karo, version 3.37 mein add kiya gaya ek feature.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list everything you do NOT have to do to use SQLite that you WOULD have to do for Postgres (server process, port, users, config, network, drivers/pooling). Then state the one thing you cannot do with SQLite that Postgres does trivially.',
        taskHi: 'Ek comment mein, sab kuch list karo jo aapko SQLite istemal karne ke liye NAHI karna hai jo aapko Postgres ke liye KARNA hoga.',
        hint: 'Not needed: start/supervise a daemon, open a port, create roles + `GRANT`, tune a config file, a network, a connection pool. The one thing you can\'t do: many concurrent writers / multi-machine access — SQLite is one writer at a time, single machine.',
        hintHi: 'Nahi chahiye: ek daemon start karna, ek port kholna, roles + `GRANT`, ek config file, ek network, ek connection pool. Jo nahi kar sakte: kai concurrent writers / multi-machine access.',
      },
      {
        task: 'A table is `CREATE TABLE m(qty INTEGER, note TEXT, raw BLOB)`. In a comment, state what is stored for `INSERT INTO m VALUES(\'7\', 7, \'7\')` in each column and why, and how you would make `qty` actually reject non-integers.',
        taskHi: 'Ek table `CREATE TABLE m(qty INTEGER, note TEXT, raw BLOB)` hai. Ek comment mein, batao `INSERT INTO m VALUES(\'7\', 7, \'7\')` ke liye har column mein kya stored hai.',
        hint: '`qty` = integer `7` (INTEGER affinity coerces the text `\'7\'` losslessly). `note` = text `\'7\'` (TEXT affinity coerces the number). `raw` = text `\'7\'` (BLOB = no affinity, value keeps its arriving type). To enforce: `CREATE TABLE m(...) STRICT` with `qty INTEGER`.',
        hintHi: '`qty` = integer `7`. `note` = text `\'7\'`. `raw` = text `\'7\'` (BLOB = koi affinity nahi). Enforce karne ko: `CREATE TABLE m(...) STRICT`.',
      },
      {
        task: 'In a comment, give the four PRAGMA statements you would run immediately after opening a SQLite connection in a server-side web app, and one line each on what each fixes.',
        taskHi: 'Ek comment mein, chaar PRAGMA statements do jo aap ek server-side web app mein ek SQLite connection open karne ke turant baad chalाoge.',
        hint: '`PRAGMA journal_mode = WAL` (readers no longer block the writer). `PRAGMA busy_timeout = 5000` (wait for a lock instead of failing with SQLITE_BUSY). `PRAGMA foreign_keys = ON` (FK enforcement is OFF by default). `PRAGMA synchronous = NORMAL` (safe with WAL, much faster than FULL).',
        hintHi: '`journal_mode = WAL`, `busy_timeout = 5000`, `foreign_keys = ON` (default OFF!), `synchronous = NORMAL`.',
      },
    ],

    keyTakeaways: [
      'SQLite is NOT a server — it\'s a C LIBRARY linked into your process, called as functions. The database is ONE ORDINARY FILE (documented cross-platform format). No daemon, no port, no network, no user accounts, no `GRANT`, no config. Your app + libsqlite IS the DBMS. Copy the file = copy the entire database. It\'s the most-deployed DB engine on earth (every phone, browser, countless apps).',
      'Open a file to "connect": `"app.db"` (a file, created if absent), `":memory:"` (RAM, gone on close — ideal for tests), `""` (private temp on-disk). WAL mode adds sidecar files `app.db-wal` + `app.db-shm`.',
      'TYPE AFFINITY: SQLite is DYNAMICALLY TYPED — the value carries its type, the column\'s declared type is only a HINT (an affinity: INTEGER/TEXT/REAL/NUMERIC/BLOB-none). SQLite coerces a value to the column\'s affinity only when LOSSLESS, else stores it as-is. So `INSERT ... VALUES(\'123\', 456, \'789\')` into `(i INTEGER, t TEXT, b BLOB)` stores integer 123, text \'456\', text \'789\'. Declare a table `STRICT` (3.37+) to actually ENFORCE types.',
      'JOURNAL MODE: `DELETE` (rollback journal, DEFAULT) — a writer takes an exclusive lock on the whole file, so readers and the writer BLOCK each other. `WAL` (write-ahead log) — writes append to `-wal`, readers see a consistent snapshot of the main file, so readers and the writer DON\'T block each other + multiple readers run with one writer. Set `PRAGMA journal_mode=WAL` ONCE (persists in the file). No effect on `:memory:`.',
      'KEY PRAGMAs (mostly per-connection, issue right after opening): `journal_mode=WAL` (persistent), `foreign_keys=ON` (**FK enforcement is OFF by default in the C library!** — enable every connection), `busy_timeout=5000` (wait ms for a lock instead of instant `SQLITE_BUSY`), `synchronous=NORMAL` (safe + fast with WAL). Typical server open: WAL + busy_timeout + foreign_keys + synchronous=NORMAL.',
    ],
    keyTakeawaysHi: [
      'SQLite ek server NAHI hai — ye ek C LIBRARY hai jo aapke process mein linked hai, functions ke roop mein call hoti hai. Database EK ORDINARY FILE hai. Koi daemon nahi, koi port nahi, koi network nahi, koi user accounts nahi, koi config nahi. Aapка app + libsqlite DBMS HAI. File copy = poora database copy. Ye duniya ka sabse-deployed DB engine hai.',
      'Ek file open karo "connect" karne ko: `"app.db"`, `":memory:"` (RAM, close par gone — tests ke liye ideal), `""` (private temp). WAL mode sidecar files add karta hai.',
      'TYPE AFFINITY: SQLite DYNAMICALLY TYPED hai — value apna type carry karti hai, column ka declared type sirf ek HINT hai (ek affinity). SQLite ek value ko column ki affinity mein coerce karta hai sirf jab LOSSLESS, warna as-is store karta hai. Types ENFORCE karne ko ek table `STRICT` (3.37+) declare karo.',
      'JOURNAL MODE: `DELETE` (rollback journal, DEFAULT) — ek writer poori file par ek exclusive lock leta hai, to readers aur writer ek doosre ko BLOCK karte hain. `WAL` — writes `-wal` mein append, readers main file ka ek consistent snapshot dekhte hain, to readers aur writer ek doosre ko BLOCK NAHI karte. `PRAGMA journal_mode=WAL` EK BAAR set karo. `:memory:` par koi effect nahi.',
      'KEY PRAGMAs (mostly per-connection): `journal_mode=WAL`, `foreign_keys=ON` (**FK enforcement C library mein default OFF hai!**), `busy_timeout=5000` (ek lock ke liye ms wait karo instant `SQLITE_BUSY` ke bजाy), `synchronous=NORMAL` (WAL ke saath safe + fast).',
    ],
  },

  {
    slug: 'sqlite-in-practice-and-when-embedded-stores-fit',
    title: 'SQLite in Practice & When Embedded Stores Fit',
    titleHi: 'SQLite Practice Mein Aur Embedded Stores Kab Fit Hote Hain',
    description: 'SQLite has one hard limit — a single writer per database file — but with WAL that coexists with many concurrent readers, and it is still a full SQL engine (window functions, CTEs, JSON, FTS). It is the right choice for embedded, edge, single-node, and read-heavy workloads, and the wrong one when you need many writers or network access.',
    descriptionHi: 'SQLite ki ek hard limit hai — prati database file ek single writer — par WAL ke saath ye kai concurrent readers ke saath coexist karti hai, aur ye abhi bhi ek full SQL engine hai (window functions, CTEs, JSON, FTS). Ye embedded, edge, single-node, aur read-heavy workloads ke liye sahi choice hai, aur galat jab aapko kai writers ya network access chahiye.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**A workshop with one workbench but a huge reading room.** Any number of people can sit and read the reference books at once (concurrent readers). But there is exactly one workbench, so only one person can be building at a time; the next person waits their turn, and if they are not willing to wait even a moment they are turned away (SQLITE_BUSY). This is completely fine for a workshop where reading dominates and building is occasional. It is the wrong space for a factory floor where forty people all need to weld simultaneously — for that you rent the industrial unit (Postgres). Choosing the workshop for factory work, or the factory for a hobby bench, is the actual mistake.',
      hi: '**Ek workshop ek workbench ke saath par ek huge reading room.** Kitne bhi log ek saath reference books padh sakte hain (concurrent readers). Par theek ek workbench hai, to ek baar mein sirf ek vyakti build kar sakta hai; agla vyakti apni baari ka wait karta hai, aur agar wo ek moment bhi wait karne ko taiyaar nahi hai to unhe turn away kiya jata hai (SQLITE_BUSY). Ye ek workshop ke liye poori tarah theek hai jahaan reading dominate karti hai. Ye ek factory floor ke liye galat space hai jahaan chalis log sab ek saath weld karne ki zaroorat rakhte hain — uske liye aap industrial unit rent karte ho (Postgres).',
    },

    simple: `**THE ONE HARD LIMIT: a single database file has ONE WRITER at a time.**
\`\`\`
readers   | MANY, concurrent (with WAL: readers don't block the writer either)
writers   | exactly ONE. A second writer gets SQLITE_BUSY (or waits, if busy_timeout set)
\`\`\`
=> great for read-heavy / occasional-write. Bad for many concurrent writers.

**FOREIGN KEYS are OFF by default** in the SQLite C library -- \`PRAGMA foreign_keys = ON\`
on every connection (a bad orphaned row inserts silently otherwise).

**IT IS STILL FULL SQL** -- not a "lite" query language:
window functions, CTEs (incl. RECURSIVE), \`JSON\` functions (\`json_extract\`, \`->\`, \`->>\`),
generated columns, partial & expression indexes, triggers, views, \`FTS5\` full-text search,
\`UPSERT\` (\`ON CONFLICT\`), \`RETURNING\`, \`STRICT\` tables, R*Tree.

**NO NETWORK => no connection pool, no \`GRANT\`/roles, no \`pg_hba.conf\`.**
Deployment = ship the file (or create it on first run). Backup = copy the file
(use the online-backup API or \`VACUUM INTO\` for a consistent copy of a live DB).

**SQLite is the RIGHT choice for:**
\`\`\`
+ embedded / mobile / desktop / edge / IoT (no server can run there)
+ an application file format (.sketch, .anki, browser history are SQLite DBs)
+ test databases (:memory:, one per test, microseconds to set up)
+ CLI tools and local state
+ read-heavy, single-node web apps / low write concurrency  (many sites fit this)
+ a local cache / analytics scratch DB
\`\`\`
**Reach for Postgres/MySQL when:** many concurrent writers, multiple app servers,
network access needed, very large data, row-level security / RBAC, replication/HA.`,

    simpleHi: `**EK HARD LIMIT: ek database file mein ek baar mein EK WRITER.**
\`\`\`
readers   | KAI, concurrent (WAL ke saath: readers writer ko block bhi nahi karte)
writers   | theek EK. Ek doosra writer SQLITE_BUSY paता hai (ya waits, agar busy_timeout set)
\`\`\`
=> read-heavy / occasional-write ke liye great. Kai concurrent writers ke liye bad.

**FOREIGN KEYS default OFF hain** SQLite C library mein -- har connection par \`PRAGMA foreign_keys = ON\`.

**YE ABHI BHI FULL SQL HAI** -- ek "lite" query language nahi:
window functions, CTEs (RECURSIVE bhi), \`JSON\` functions, generated columns,
partial & expression indexes, triggers, views, \`FTS5\` full-text search, \`UPSERT\`, \`RETURNING\`, \`STRICT\`.

**KOI NETWORK => koi connection pool nahi, koi \`GRANT\`/roles nahi.**
Deployment = file ship karo. Backup = file copy karo (online-backup API ya \`VACUUM INTO\`).

**SQLite iske liye SAHI choice hai:**
\`\`\`
+ embedded / mobile / desktop / edge / IoT
+ ek application file format
+ test databases (:memory:, prati test ek)
+ CLI tools aur local state
+ read-heavy, single-node web apps / low write concurrency
+ ek local cache
\`\`\`
**Postgres/MySQL ke liye reach karo jab:** kai concurrent writers, multiple app servers,
network access chahiye, bahut large data, RBAC, replication/HA.`,

    content: `## The single-writer limit

This is the defining constraint. A SQLite database file permits **one write transaction at a time**. A second connection that tries to start a write while another holds the write lock gets \`SQLITE_BUSY\` immediately, or — if that connection set \`PRAGMA busy_timeout = N\` — waits up to \`N\` milliseconds for the lock to clear before failing.

Reads are different:

- In the default rollback-journal mode, a writer blocks readers and readers block the writer.
- In **WAL mode**, **any number of readers run concurrently with one writer**: readers see a consistent snapshot of the main file while the writer appends to the WAL. This is why WAL is essentially mandatory for any concurrent workload.

So SQLite's real concurrency profile is: **unlimited concurrent reads, serialized writes**. For a workload that is mostly reads with occasional, short writes — which describes a great many applications — this is entirely adequate, and each individual write is very fast (no network, no IPC), so the serialized writes rarely become a bottleneck until write throughput is genuinely high. For a workload with many clients writing continuously, SQLite is the wrong tool.

Practical mitigations when writes contend: keep write transactions short, batch many row changes into one transaction (one lock acquisition instead of hundreds), set a \`busy_timeout\`, and funnel writes through a single connection or a small serialized queue in the application.

## Foreign keys are off by default

Worth repeating as its own point: the SQLite C library ships with foreign-key enforcement **disabled**, for historical compatibility. \`PRAGMA foreign_keys = ON\` must be issued on **every connection** for \`REFERENCES\` clauses to actually be enforced. Some language bindings enable it automatically (Node's \`node:sqlite\` does), but relying on that is fragile — set it explicitly.

## It is a full SQL engine

"Lite" refers to the footprint and the administration model, not the SQL. SQLite supports:

- **Window functions** (\`OVER (PARTITION BY ... ORDER BY ...)\`, \`ROW_NUMBER\`, \`LAG\`, running aggregates, frames).
- **Common table expressions**, including \`WITH RECURSIVE\` for hierarchies and graphs.
- **JSON** — \`json_extract\`, the \`->\` and \`->>\` operators, \`json_object\`, \`json_group_array\`, and (3.45+) a binary **JSONB** storage format.
- **Generated columns**, **partial indexes** (\`WHERE\`), **expression indexes**, **covering indexes**.
- **Triggers**, **views**, **CHECK constraints**, **\`UPSERT\`** (\`INSERT ... ON CONFLICT ... DO UPDATE\`), **\`RETURNING\`**.
- **FTS5** — a full-text search extension with ranking (BM25), built in.
- **R*Tree** — spatial indexing.
- **\`STRICT\` tables** for enforced typing, **\`WITHOUT ROWID\`** tables for clustered-index storage.

An application that outgrows SQLite almost never does so because of a missing SQL feature; it does so because of the write-concurrency ceiling, the single-machine limitation, or data volume.

## No network: deployment and backup

Because there is no server:

- **No connection pooling** in the client/server sense — you reuse one or a few long-lived handles per process. **No \`GRANT\`, roles, or \`pg_hba.conf\`** — access control is filesystem permissions on the database file.
- **Deployment** is shipping (or creating) a file. A read-only reference database can be bundled into the application binary.
- **Backup** of a live database must be consistent: use the **online backup API** (which most bindings expose), or \`VACUUM INTO 'backup.db'\`, or copy the file only while no write transaction is in progress. For point-in-time durability and replication, tools like **Litestream** stream the WAL to object storage; **rqlite**, **Turso/libSQL**, and **Cloudflare D1** put a distribution or replication layer around the SQLite engine.

## When SQLite is the right choice

- **Embedded and on-device**: mobile apps, desktop apps, browsers, IoT, aircraft — there is no server to run, and one file fits the sandbox model.
- **Application file formats**: SQLite is an officially recommended on-disk format for documents. Many \`.app\`-specific files (design tools, note apps, game saves) are SQLite databases.
- **Test databases**: a \`:memory:\` database per test gives a real SQL engine, a clean schema in microseconds, and perfect isolation with no cleanup.
- **CLI tools and local agents**: state in \`~/.tool/state.db\` — zero setup, inspectable with the \`sqlite3\` shell.
- **Read-heavy web applications on a single node**: a content site, a documentation portal, an internal dashboard, a low-write SaaS — SQLite with WAL comfortably serves thousands of reads per second from one process, and this pattern (sometimes with Litestream for durability) is increasingly common for small-to-medium production sites.
- **A local cache or an analytics scratchpad**: a durable on-disk cache, or a place to \`ATTACH\` and crunch a few million rows without standing up a warehouse.

## When to use Postgres or MySQL instead

- **Many concurrent writers** — an app with high sustained write throughput from many users.
- **Multiple application servers** sharing one database — SQLite is single-machine; a shared file over a network filesystem risks corruption.
- **Network access required** — clients or services connecting from other hosts.
- **Very large datasets** and workloads needing parallel query execution, advanced planner features, or partitioning at scale.
- **Role-based access control, row-level security, fine-grained privileges** — SQLite has none of this.
- **Built-in replication, failover, and HA** — a managed or self-hosted client/server database provides it; SQLite needs external tooling.

## The Part V wrap: choosing from access patterns

Across this course the recurring lesson is that the database follows the workload:

- **Relational (Postgres/MySQL)** — the default for transactional application data with relationships and ad-hoc queries.
- **Document (MongoDB/Firestore)** — self-contained aggregates, flexible shape, real-time or offline needs.
- **Key-value / structures (Redis)** — caching, counters, queues, leaderboards, ephemeral state; an accelerator, not usually the system of record.
- **Embedded (SQLite)** — single-node, read-heavy, on-device, or "no server allowed".

Most real systems are **polyglot**: a durable relational core, Redis in front for speed, maybe a search engine or an analytics store at the edges. Module 20 surveys the rest of the landscape — columnar, graph, time-series, search, wide-column — and how to pick.`,

    contentHi: `## Single-writer limit

Ye defining constraint hai. Ek SQLite database file **ek baar mein ek write transaction** permit karti hai. Ek doosra connection jo ek write shuru karne ki koshish karta hai jab doosra write lock hold karta hai \`SQLITE_BUSY\` turant paता hai, ya — agar us connection ne \`PRAGMA busy_timeout\` set kiya — lock clear hone ke liye wait karta hai.

Reads alag hain: **WAL mode mein**, **kitne bhi readers ek writer ke saath concurrently chalte hain**. To SQLite ka real concurrency profile: **unlimited concurrent reads, serialized writes**. Ek workload ke liye jo zyaadातar reads hai occasional short writes ke saath, ye poori tarah adequate hai. Kai clients continuously likhne ke saath ek workload ke liye, SQLite galat tool hai.

## Foreign keys default off hain

SQLite C library foreign-key enforcement **disabled** ship karti hai. \`PRAGMA foreign_keys = ON\` **har connection** par issue hona chahiye.

## Ye ek full SQL engine hai

"Lite" footprint aur administration model ko refer karta hai, SQL ko nahi. SQLite support karta hai: window functions, CTEs (RECURSIVE bhi), JSON, generated columns, partial/expression indexes, triggers, views, UPSERT, RETURNING, FTS5 full-text search, R*Tree, STRICT tables.

Ek application jo SQLite ko outgrow karti hai lagभag kabhi ek missing SQL feature ki wajah se nahi karti; ye write-concurrency ceiling, single-machine limitation, ya data volume ki wajah se karti hai.

## Koi network nahi: deployment aur backup

Koi server nahi hone ki wajah se: **koi connection pooling nahi**, **koi GRANT/roles nahi** — access control database file par filesystem permissions hai. **Deployment** ek file ship karna hai. **Backup** consistent hona chahiye: online backup API, ya \`VACUUM INTO\`.

## SQLite kab sahi choice hai

Embedded aur on-device; application file formats; test databases (\`:memory:\` prati test); CLI tools; single node par read-heavy web applications (WAL ke saath ek process se hazaron reads/sec); ek local cache.

## Postgres ya MySQL kab istemal karें

Kai concurrent writers; multiple application servers; network access chahiye; bahut large datasets; RBAC / row-level security; built-in replication/HA.

## Part V wrap: access patterns se choosing

- **Relational** — relationships aur ad-hoc queries ke saath transactional data ke liye default.
- **Document** — self-contained aggregates, flexible shape, real-time/offline.
- **Key-value / structures (Redis)** — caching, counters, queues; ek accelerator.
- **Embedded (SQLite)** — single-node, read-heavy, on-device, ya "no server allowed".

Zyaादातर real systems **polyglot** hain. Module 20 baaki landscape survey karta hai.`,

    examples: [
      {
        title: 'The single-writer limit: a second writer gets "database is locked"',
        titleHi: 'Single-writer limit: ek doosra writer "database is locked" paता hai',
        code: `const path = tmp();
const w1 = open(path);
w1.exec('CREATE TABLE t(x INTEGER)');
const w2 = open(path);

w1.exec('BEGIN IMMEDIATE');               // w1 takes the write lock
w1.prepare('INSERT INTO t VALUES(1)').run();

try {
  w2.prepare('INSERT INTO t VALUES(2)').run();   // second writer, same file
} catch (e) {
  print('writer 2: ' + e.message);               // rejected: SQLITE_BUSY
}

w1.exec('COMMIT');                        // lock released
w2.prepare('INSERT INTO t VALUES(2)').run();      // now it works
print(w2.prepare('SELECT * FROM t ORDER BY x').all());`,
        output: `writer 2: database is locked
[{"x":1},{"x":2}]`,
        explain: "`w1` opens a write transaction with `BEGIN IMMEDIATE` and takes the database's single write lock. While `w1` holds it, `w2`'s insert is rejected immediately with `database is locked` (SQLITE_BUSY) -- there is exactly one writer per file. After `w1` commits and releases the lock, `w2`'s insert succeeds and both rows are present. (With `PRAGMA busy_timeout` set, `w2` would wait instead of failing at once.)",
        explainHi: '`w1` `BEGIN IMMEDIATE` ke saath ek write transaction open karta hai aur database ka single write lock leta hai. Jab `w1` ise hold karta hai, `w2` ka insert turant `database is locked` (SQLITE_BUSY) ke saath reject hota hai -- prati file theek ek writer hai. `w1` ke commit aur lock release karne ke baad, `w2` ka insert succeed hota hai aur dono rows present hain. (`PRAGMA busy_timeout` set ke saath, `w2` turant fail hone ke bजाy wait karta.)',
      },
      {
        title: 'Foreign keys: off by default, so an orphan row inserts silently',
        titleHi: 'Foreign keys: default off, to ek orphan row silently insert hoti hai',
        code: `// SQLite's C library ships with FK enforcement OFF — opt in per connection:
db.exec('PRAGMA foreign_keys = OFF');
db.exec('CREATE TABLE author(id INTEGER PRIMARY KEY)');
db.exec('CREATE TABLE book(id INTEGER PRIMARY KEY, author_id INTEGER REFERENCES author(id))');

db.prepare('INSERT INTO book(author_id) VALUES(999)').run();   // no author 999 exists
print('orphans allowed with FK off: ' + db.prepare('SELECT count(*) AS c FROM book').get().c);

db.exec('DELETE FROM book');
db.exec('PRAGMA foreign_keys = ON');
try {
  db.prepare('INSERT INTO book(author_id) VALUES(999)').run();
} catch (e) {
  print('with FK on: ' + e.message);
}`,
        output: `orphans allowed with FK off: 1
with FK on: FOREIGN KEY constraint failed`,
        explain: "With `PRAGMA foreign_keys = OFF` (the SQLite C library's default), a `book` row referencing a non-existent `author` id 999 inserts with no complaint -- the count is 1. After `PRAGMA foreign_keys = ON`, the same insert is rejected with `FOREIGN KEY constraint failed`. So `REFERENCES` clauses are inert unless FK enforcement is explicitly turned on, per connection.",
        explainHi: '`PRAGMA foreign_keys = OFF` ke saath (SQLite C library ka default), ek `book` row jo ek non-existent `author` id 999 reference karta hai bina kisi complaint ke insert hota hai -- count 1 hai. `PRAGMA foreign_keys = ON` ke baad, wahi insert `FOREIGN KEY constraint failed` ke saath reject hota hai. To `REFERENCES` clauses inert hain jab tak FK enforcement explicitly on nahi kiya jata, prati connection.',
      },
      {
        title: 'Still full SQL: window functions, a CTE, and JSON in one query',
        titleHi: 'Abhi bhi full SQL: ek query mein window functions, ek CTE, aur JSON',
        code: `db.exec('CREATE TABLE sale(id INTEGER PRIMARY KEY, region TEXT, amount INTEGER)');
const ins = db.prepare('INSERT INTO sale(region, amount) VALUES(?, ?)');
for (const [r, a] of [['west', 100], ['west', 250], ['east', 90]]) ins.run(r, a);

const rows = db.prepare(\`
  WITH ranked AS (
    SELECT region, amount,
           SUM(amount) OVER (PARTITION BY region ORDER BY id) AS running
    FROM sale
  )
  SELECT * FROM ranked ORDER BY region, running
\`).all();
print(rows);
print(db.prepare(\`SELECT json_extract('{"cfg":{"retries":3}}', '$.cfg.retries') AS retries\`).get());`,
        output: `[{"region":"east","amount":90,"running":90},{"region":"west","amount":100,"running":100},{"region":"west","amount":250,"running":350}]
{"retries":3}`,
        explain: 'One query uses a common table expression, a window function (`SUM(...) OVER (PARTITION BY region ORDER BY id)` for a per-region running total), and standard ordering -- all fully supported. The second shows `json_extract` pulling a nested value out of a JSON string. "Lite" is about the footprint and zero-admin model, not a reduced SQL dialect.',
        explainHi: 'Ek query ek common table expression, ek window function (`SUM(...) OVER (PARTITION BY region ORDER BY id)` ek per-region running total ke liye), aur standard ordering istemal karta hai -- sab poori tarah supported. Doosra `json_extract` dikhata hai ek nested value ko ek JSON string se pull karte hue. "Lite" footprint aur zero-admin model ke baare mein hai, ek reduced SQL dialect nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `// choosing SQLite for a multi-instance web app behind a load balancer
// 4 app servers, all opening /mnt/shared/app.db over NFS
// -- SQLite's file locking is unreliable over network filesystems.
//    Concurrent writes from different servers can corrupt the database.
//    And even on one machine, 4 processes all writing = constant SQLITE_BUSY.`,
        right: `// SQLite is single-node. For a horizontally-scaled app:
//  - use Postgres/MySQL (built for many clients over the network), OR
//  - keep SQLite but make ONE process the owner of the file and have the other
//    servers call it (rqlite, Turso/libSQL, Cloudflare D1 do exactly this), OR
//  - if it's genuinely read-heavy + single-node-capable, don't scale out —
//    one bigger box with SQLite + WAL handles far more than people expect`,
        why: 'SQLite is designed to be accessed by processes on a single machine, coordinating through that machine\'s local file locks, and it permits one write transaction at a time against a database file. Deploying it behind a load balancer with several application servers violates both premises. If the file is on a network filesystem so all servers can reach it, the file locking that SQLite depends on is implemented incompletely by NFS and SMB, and concurrent writes from different machines can corrupt the file. If instead each server has its own copy, they diverge. And even setting the network aside, several server processes all attempting sustained writes to one file contend for the single write lock and spend their time retrying or failing with busy errors. A horizontally scaled application needs either a database built for many networked clients, which is what PostgreSQL and MySQL are, or an architecture where exactly one process owns the SQLite file and the others go through it, which is the model that distributed-SQLite systems implement. Often the better realization is that a read-heavy workload does not need to scale out at all, and a single well-provisioned node running SQLite in WAL mode serves far more traffic than expected.',
        whyHi: 'SQLite ek single machine par processes dwara access hone ke liye design kiya gaya hai, us machine ke local file locks ke through coordinate karte hue, aur ye ek database file ke against ek baar mein ek write transaction permit karta hai. Ise ek load balancer ke peeche kai application servers ke saath deploy karna dono premises violate karta hai. Agar file ek network filesystem par hai, file locking jispar SQLite depend karta hai NFS aur SMB dwara incompletely implement kiya jata hai, aur alag machines se concurrent writes file corrupt kar sakte hain. Ek horizontally scaled application ko ya to kai networked clients ke liye bana ek database chahiye, ya ek architecture jahaan theek ek process SQLite file own karta hai.',
      },
      {
        wrong: `// long-held write transaction blocking every other writer for seconds
db.exec('BEGIN');
for (const row of tenThousandRows) {
  db.prepare('INSERT INTO t VALUES (?, ?)').run(row.a, row.b);
  await callSlowExternalApi(row);       // holding the write lock during network I/O
}
db.exec('COMMIT');
// -- the write lock is held for the entire loop including every API call.
//    No other connection can write for that whole time.`,
        right: `// gather data first, then hold the write lock only for the fast bulk insert:
const rows = [];
for (const row of tenThousandRows) rows.push([row.a, await callSlowExternalApi(row)]);

db.exec('BEGIN IMMEDIATE');
const stmt = db.prepare('INSERT INTO t VALUES (?, ?)');
for (const [a, b] of rows) stmt.run(a, b);
db.exec('COMMIT');                        // lock held for milliseconds, not seconds`,
        why: 'A write transaction in SQLite holds the database\'s single write lock from the moment it first modifies data until it commits or rolls back, and no other connection can perform a write during that window. A transaction that interleaves its writes with slow operations such as network calls, file downloads, or user interaction therefore keeps the write lock for the full duration of all that slow work, blocking every other writer the entire time and, in rollback-journal mode, readers as well. The fix is to separate the slow work from the locked section: perform all the slow operations first, collecting the results in memory, and then open the write transaction and apply all the changes in a tight loop with no slow calls inside it, so the lock is held only for the actual writes, which are fast. Batching many row changes into one such transaction is also far more efficient than one transaction per row, because each transaction has a fixed commit cost.',
        whyHi: 'SQLite mein ek write transaction database ka single write lock us moment se hold karti hai jab ye pehli baar data modify karti hai jab tak ye commit ya rollback nahi karti, aur us window ke dauran koi doosra connection ek write nahi kar sakta. Ek transaction jo apne writes ko slow operations jaise network calls ke saath interleave karti hai isliye write lock ko us saare slow kaam ki poori duration ke liye hold karti hai. Fix slow kaam ko locked section se alag karna hai: pehle saare slow operations perform karo, results memory mein collect karte hue, aur phir write transaction open karo aur saare changes ek tight loop mein apply karo.',
      },
    ],

    realWorld: [
      {
        en: '**A documentation site and blog serving 5,000 requests/minute from a single VM on SQLite + WAL** — content changes are a handful of writes on deploy, reads dominate, and there is no database server to operate, monitor, or pay for.',
        hi: '**Ek documentation site aur blog SQLite + WAL par ek single VM se 5,000 requests/minute serve karti hai** — content changes deploy par kुछ writes hain, reads dominate karti hain.',
      },
      {
        en: '**A desktop design app whose `.project` file is a SQLite database** — the app opens it directly, autosave is a transaction, undo history is a table, and "export/share" is just sending the file.',
        hi: '**Ek desktop design app jiski `.project` file ek SQLite database hai** — app ise directly open karti hai, autosave ek transaction hai.',
      },
      {
        en: '**A CI pipeline where every test suite spins up a `:memory:` SQLite database, runs migrations, and tears it down** — thousands of hermetic test runs, zero shared state, no test database to provision or clean.',
        hi: '**Ek CI pipeline jahaan har test suite ek `:memory:` SQLite database spin up karti hai** — hazaron hermetic test runs, zero shared state.',
      },
    ],

    interviewQA: [
      {
        q: 'What is SQLite\'s concurrency model, and what workloads does it suit or not suit?',
        qHi: 'SQLite ka concurrency model kya hai, aur ye kaunse workloads suit karta hai ya nahi?',
        a: 'A SQLite database file allows one write transaction at a time. A second connection attempting to begin a write while another holds the write lock receives a busy error immediately, or waits up to a configured busy timeout for the lock to clear. Reads depend on the journal mode: in the default rollback-journal mode a writer and readers block each other, but in write-ahead-log mode any number of readers run concurrently with a single writer, because readers see a consistent snapshot of the main database file while the writer appends to a separate log. So the model is unlimited concurrent reads with serialized writes. This suits workloads that are predominantly reads with occasional short writes, which covers a large fraction of applications: content sites, documentation portals, internal dashboards, CLI tool state, on-device storage, test databases, and low-write SaaS. Each individual write is very fast because there is no network or inter-process communication, so serialized writes rarely bottleneck until write throughput is genuinely high. It does not suit workloads with many clients writing continuously, applications spread across multiple servers that must share one database, or anything requiring access over a network, because SQLite is a single-machine engine and a shared file over a network filesystem risks corruption. Those call for a client/server database.',
        aHi: 'Ek SQLite database file ek baar mein ek write transaction allow karti hai. Ek doosra connection jo ek write shuru karne ki koshish karta hai jab doosra write lock hold karta hai turant ek busy error paता hai, ya ek configured busy timeout tak wait karta hai. Reads journal mode par depend karte hain: WAL mode mein kitne bhi readers ek single writer ke saath concurrently chalte hain. To model unlimited concurrent reads with serialized writes hai. Ye un workloads ko suit karta hai jo predominantly reads hain occasional short writes ke saath. Ye kai clients continuously likhne wale workloads ko, multiple servers par phaili applications ko, ya network access chahiye kisi cheez ko suit nahi karta.',
      },
      {
        q: 'When would you deliberately choose SQLite for a production web application?',
        qHi: 'Aap ek production web application ke liye SQLite kab deliberately chunोge?',
        a: 'When the application runs on a single node and its workload is read-dominated with modest write volume, SQLite in write-ahead-log mode is a strong and increasingly popular choice. A content site, a documentation portal, a blog, an internal tool, a dashboard, or a small-to-medium SaaS often fits this profile: the vast majority of requests are reads, writes are infrequent and short, and there is no requirement to run across multiple servers. In that situation SQLite serves many thousands of reads per second from one process with no separate database server to provision, secure, monitor, back up, or pay for, and the operational surface shrinks to a single file. Deployment is shipping or creating that file, and durability beyond local disk can be added with a tool that streams the write-ahead log to object storage. The deliberate trade being accepted is the single-writer limit and the single-machine constraint, which is fine precisely because the workload does not need concurrent writers or horizontal scaling. If the application later needs many concurrent writers, multiple app servers sharing state, network access, role-based access control, or built-in replication and failover, that is the point to move to PostgreSQL or MySQL.',
        aHi: 'Jab application ek single node par chalti hai aur iska workload read-dominated hai modest write volume ke saath, WAL mode mein SQLite ek strong aur increasingly popular choice hai. Ek content site, ek documentation portal, ek blog, ek internal tool, ya ek chhoटा-se-medium SaaS aksar is profile mein fit hota hai. Us situation mein SQLite ek process se hazaron reads per second serve karta hai bina ek alag database server ke jise provision, secure, monitor, ya pay karna ho. Deliberate trade jo accept kiya ja raha hai wo single-writer limit aur single-machine constraint hai. Agar application ko baad mein kai concurrent writers, multiple app servers, ya built-in replication chahiye, wo PostgreSQL ya MySQL par move karne ka point hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, state SQLite\'s concurrency model in one sentence, then explain why WAL mode is close to mandatory for any web app and what specifically it changes versus the default journal mode.',
        taskHi: 'Ek comment mein, SQLite ka concurrency model ek sentence mein batao, phir samjhao ki WAL mode kisi bhi web app ke liye close to mandatory kyun hai.',
        hint: 'Model: unlimited concurrent READS, one WRITER at a time. Default (rollback journal): a writer blocks all readers and vice versa. WAL: readers see a consistent snapshot of the main file while the writer appends to `-wal`, so readers and the one writer don\'t block each other + many readers run with a writer. A read-heavy web app in default mode hits `SQLITE_BUSY` constantly.',
        hintHi: 'Model: unlimited concurrent READS, ek baar mein ek WRITER. Default: ek writer saare readers ko block karta hai. WAL: readers main file ka ek consistent snapshot dekhte hain jab writer `-wal` mein append karta hai.',
      },
      {
        task: 'For each, say SQLite or Postgres and one line why: (a) an Electron desktop note-taking app, (b) a SaaS with 400 businesses each doing sustained concurrent writes, (c) a static-ish marketing site with a blog on one server, (d) test databases for a CI suite, (e) a fleet of 12 API servers behind a load balancer sharing one dataset.',
        taskHi: 'Har ek ke liye, SQLite ya Postgres batao aur ek line why: (a) ek Electron desktop note-taking app, (b) 400 businesses waali ek SaaS jo sustained concurrent writes karti hain, (c) ek server par ek blog waali static-ish marketing site, (d) ek CI suite ke liye test databases, (e) ek dataset share karne wale 12 API servers.',
        hint: '(a) SQLite — on-device, no server, one file per user. (b) Postgres — many concurrent writers exceed the single-writer limit. (c) SQLite + WAL — read-heavy, single node. (d) SQLite `:memory:` — real SQL, microsecond setup, perfect isolation. (e) Postgres — multi-machine shared access; a shared SQLite file over the network risks corruption.',
        hintHi: '(a) SQLite. (b) Postgres — kai concurrent writers. (c) SQLite + WAL. (d) SQLite `:memory:`. (e) Postgres — multi-machine shared access.',
      },
      {
        task: 'In a comment, summarize the whole course\'s "choose a database" heuristic in 4 bullets — relational, document, key-value/Redis, embedded/SQLite — one line each on what workload each is the default for.',
        taskHi: 'Ek comment mein, poore course ka "ek database chuno" heuristic 4 bullets mein summarize karo.',
        hint: 'Relational (Postgres/MySQL): transactional data with relationships + ad-hoc queries — the default. Document (Mongo/Firestore): self-contained aggregates, flexible shape, real-time/offline. Key-value/Redis: cache, counters, queues, leaderboards, ephemeral state — an accelerator, not the source of truth. Embedded/SQLite: single-node, read-heavy, on-device, or "no server allowed". Most real systems are polyglot.',
        hintHi: 'Relational: relationships + ad-hoc queries — default. Document: self-contained aggregates, real-time/offline. Redis: cache/counters/queues — ek accelerator. SQLite: single-node, read-heavy, on-device. Zyaादातर systems polyglot.',
      },
    ],

    keyTakeaways: [
      'THE ONE HARD LIMIT: a database file has ONE WRITER at a time. A 2nd writer gets `SQLITE_BUSY` immediately (or waits, if `busy_timeout` is set). READS: many, concurrent — and in WAL mode readers and the one writer DON\'T block each other. So the real profile is UNLIMITED CONCURRENT READS + SERIALIZED WRITES. Great for read-heavy / occasional-short-write; wrong for many continuous writers. Mitigate contention: short write txns, batch changes into one txn, `busy_timeout`, funnel writes through one connection.',
      'FOREIGN KEYS are OFF by default in the SQLite C library — `PRAGMA foreign_keys = ON` on EVERY connection or `REFERENCES` clauses do nothing and orphan rows insert silently. (Some bindings auto-enable it; never assume.)',
      '"Lite" = footprint + admin model, NOT the SQL. SQLite has window functions, recursive CTEs, JSON (`json_extract`/`->`/`->>`/JSONB), generated columns, partial/expression indexes, triggers, views, `UPSERT`, `RETURNING`, FTS5 full-text search (BM25), R*Tree, `STRICT` tables. Apps outgrow SQLite from write concurrency / single-machine / data volume — almost never a missing SQL feature.',
      'NO NETWORK ⇒ no connection pool (reuse 1 long-lived handle/process), no `GRANT`/roles/`pg_hba.conf` (access = filesystem permissions on the file). DEPLOY = ship/create the file. BACKUP of a live DB must be consistent: online-backup API or `VACUUM INTO` (not a raw `cp` mid-write). Litestream streams the WAL offsite; rqlite/Turso/libSQL/D1 add a distribution layer. NEVER put the file on NFS/SMB for multi-machine access — locking is unreliable, corruption results.',
      'SQLite is RIGHT for: embedded/mobile/desktop/edge/IoT (no server can run there), application file formats, test DBs (`:memory:` per test), CLI tools/local state, READ-HEAVY SINGLE-NODE web apps (WAL serves thousands of reads/sec/process — a real production pattern), local cache/analytics scratch. Use POSTGRES/MYSQL when: many concurrent writers, multiple app servers sharing one DB, network access, very large data, RBAC/row-level security, built-in replication/HA. Course heuristic: relational = default for related transactional data; document = self-contained aggregates + real-time/offline; Redis = accelerator (cache/counters/queues), not source of truth; SQLite = single-node/read-heavy/on-device. Most real systems are POLYGLOT.',
    ],
    keyTakeawaysHi: [
      'EK HARD LIMIT: ek database file mein ek baar mein EK WRITER. Ek 2nd writer turant `SQLITE_BUSY` paता hai (ya waits, agar `busy_timeout` set). READS: kai, concurrent — aur WAL mode mein readers aur ek writer ek doosre ko BLOCK NAHI karte. Real profile UNLIMITED CONCURRENT READS + SERIALIZED WRITES hai. Read-heavy ke liye great; kai continuous writers ke liye galat.',
      'FOREIGN KEYS SQLite C library mein default OFF hain — HAR connection par `PRAGMA foreign_keys = ON` ya `REFERENCES` clauses kuch nahi karte aur orphan rows silently insert hoti hain.',
      '"Lite" = footprint + admin model, SQL NAHI. SQLite mein window functions, recursive CTEs, JSON, generated columns, partial/expression indexes, triggers, views, `UPSERT`, `RETURNING`, FTS5 full-text search, R*Tree, `STRICT` tables hain. Apps SQLite ko write concurrency / single-machine / data volume se outgrow karti hain.',
      'KOI NETWORK ⇒ koi connection pool nahi, koi `GRANT`/roles nahi (access = file par filesystem permissions). DEPLOY = file ship/create karo. Ek live DB ka BACKUP consistent hona chahiye: online-backup API ya `VACUUM INTO`. Multi-machine access ke liye file KABHI NFS/SMB par mat rakho — corruption results.',
      'SQLite iske liye SAHI: embedded/mobile/desktop/edge/IoT, application file formats, test DBs (`:memory:` prati test), CLI tools, READ-HEAVY SINGLE-NODE web apps, local cache. POSTGRES/MYSQL istemal karो jab: kai concurrent writers, multiple app servers, network access, bahut large data, RBAC, built-in replication/HA. Course heuristic: relational = related transactional data ke liye default; document = self-contained aggregates + real-time/offline; Redis = accelerator; SQLite = single-node/read-heavy/on-device. Zyaादातर systems POLYGLOT hain.',
    ],
  },
];
