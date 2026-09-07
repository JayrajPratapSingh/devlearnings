/**
 * Databases Complete Course — Module 16: MongoDB Operations & Distribution, lessons 4-6.
 * Last module of Part III.
 *
 * Lesson 4: Sharding — horizontal partitioning across servers, and why the shard
 *           key is the single most consequential design decision.
 * Lesson 5: Change streams — subscribing to a real-time feed of database changes,
 *           built on the oplog.
 * Lesson 6: Schema validation & wrapping up MongoDB — $jsonSchema validators,
 *           validation levels and actions, and a survey of the operational surface.
 *
 * Verified against a real in-memory MongoDB REPLICA SET (mongodb-memory-server).
 * Run: node verify-mongo-rs.mjs 16
 */

import type { CourseLesson } from './course-js-module1';

export const MONGO_MODULE_16_PART2: CourseLesson[] = [
  {
    slug: 'mongo-sharding',
    title: 'Sharding',
    titleHi: 'Sharding',
    description: 'A replica set copies all the data onto every server. Sharding does the opposite: it splits the data across servers, so a collection too large for one machine\'s disk, RAM, or write throughput can span many. The choice of shard key determines whether that works well or becomes a bottleneck.',
    descriptionHi: 'Ek replica set saara data har server par copy karता hai. Sharding opposite karता hai: ye data ko servers ke across split karता hai, to ek collection jo ek machine ke disk, RAM, ya write throughput ke liye bahut badी hai kई span kar sakti hai. Shard key ka choice determine karता hai ki wo achhi tarah kaam karता hai ya ek bottleneck ban jाता hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A library so large no single building can hold it, so the collection is split across branch buildings — and the rule for which branch a book goes to is everything.** Split by first letter of the author\'s surname and the "S" branch is overwhelmed while "X" sits nearly empty (a bad key: uneven distribution). Split by acquisition date and every new book goes to the newest branch, so all the receiving traffic hammers one building while the others are idle (a monotonic key: a write hotspot). Split by a hash of the ISBN and books scatter evenly across all branches — but now "show me every book by this author" means asking every branch, because that author\'s books are everywhere (a hashed key: even load, no locality). The catalog desk (the router) knows the rule and sends each request to the right branch or branches; get the rule wrong and no amount of adding branches helps.',
      hi: '**Ek library itni badी ki koi single building ise nahi rakh sakti, to collection branch buildings ke across split hai — aur kaunसी branch mein ek book jाती hai iska rule sab kुछ hai.** Author ke surname ke first letter se split karो aur "S" branch overwhelmed hai jabki "X" lगभग khaali baithती hai (ek bad key: uneven distribution). Acquisition date se split karो aur har nayi book newest branch mein jाती hai (ek monotonic key: ek write hotspot). ISBN ke ek hash se split karो aur books sabhi branches ke across evenly scatter hoती hain — par ab "is author ki har book dikhाओ" matlab har branch se poochना (ek hashed key: even load, no locality). Catalog desk (router) rule jaanता hai aur har request ko sahi branch bhejता hai.',
    },

    simple: `**SHARDING = split ONE collection's documents across many servers ("shards"), each shard
itself a replica set. For data too big for one machine.**

\`\`\`
   client --> [ mongos router ] --> shard A (replica set)  docs where key in range 1
                    |                shard B (replica set)  docs where key in range 2
                    |                shard C (replica set)  docs where key in range 3
\`\`\`

**THE SHARD KEY: the field(s) MongoDB uses to decide which shard a document lives on.
It is THE decision -- and it's very hard to change later.**

**A GOOD shard key has:**
\`\`\`
HIGH CARDINALITY   -- many distinct values (so data can be split finely)
LOW FREQUENCY      -- no single value dominates (or that value's shard is a hotspot)
NON-MONOTONIC      -- not ever-increasing (a timestamp / ObjectId sends ALL new
                      writes to ONE shard -- the "hotspot" anti-pattern)
matches the QUERIES -- queries that include the shard key hit ONE shard;
                      queries without it must hit EVERY shard ("scatter-gather")
\`\`\`

**RANGED vs HASHED shard key:**
\`\`\`
ranged  -- contiguous key ranges per shard. Good query LOCALITY (range queries hit
           few shards) but risks hotspots if the key is monotonic or skewed.
hashed  -- shard by hash(key). EVEN distribution, no monotonic hotspot -- but a
           range query on the key can't be targeted (must scatter-gather).
\`\`\`

**\`mongos\`** routes each query: to one shard if it includes the shard key, to all shards
otherwise. The **balancer** moves chunks of data between shards to keep them even.`,

    simpleHi: `**SHARDING = EK collection ke documents ko kई servers ("shards") ke across split karna,
har shard khud ek replica set. Us data ke liye jo ek machine ke liye bahut badा hai.**

\`\`\`
   client --> [ mongos router ] --> shard A (replica set)
                    |                shard B (replica set)
                    |                shard C (replica set)
\`\`\`

**SHARD KEY: wo field(s) jo MongoDB ek document kaunse shard par rehта hai decide karने ke liye
istemal karता hai. Ye THE decision hai -- aur ise baad mein badalना bahut mushkil hai.**

**Ek ACHHA shard key rakhता hai:**
\`\`\`
HIGH CARDINALITY   -- kई distinct values
LOW FREQUENCY      -- koi single value dominate nahi karती
NON-MONOTONIC      -- ever-increasing nahi (ek timestamp / ObjectId SAARE naye writes
                      EK shard ko bhejता hai -- "hotspot" anti-pattern)
QUERIES se match   -- jo queries shard key include karती hain EK shard hit karती hain;
                      bina iske queries HAR shard hit karती hain ("scatter-gather")
\`\`\`

**RANGED vs HASHED shard key:**
\`\`\`
ranged  -- prati shard contiguous key ranges. Achhi query LOCALITY par hotspots ka risk.
hashed  -- hash(key) se shard. EVEN distribution -- par range query targeted nahi ho sakti.
\`\`\`

**\`mongos\`** har query route karता hai. **Balancer** shards ke beech data ke chunks move karता hai.`,

    content: `## Sharding: horizontal partitioning

A replica set solves availability by putting a **full copy** of the data on every member. It does not solve *size*: if a collection is larger than a single server's disk, or its working set exceeds a single server's RAM, or its write rate exceeds what one primary can absorb, adding replica-set members does not help — they all hold the same too-large collection.

**Sharding** partitions the collection itself: each **shard** holds a *subset* of the documents, and each shard is its own replica set (for availability of that subset). A sharded cluster can hold and serve a collection far larger than any one machine.

The pieces:

- **Shards** — the replica sets that hold the data partitions.
- **\`mongos\`** — a routing process the application connects to instead of connecting to a shard directly. It knows which shard(s) hold which data and routes each operation accordingly.
- **Config servers** — a replica set storing the cluster's metadata (which key ranges live on which shard).
- **The balancer** — a background process that migrates **chunks** (contiguous ranges of shard-key values) between shards to keep the data roughly evenly distributed as it grows.

## The shard key

Every document in a sharded collection is assigned to a shard based on the value of its **shard key** — one or more fields, chosen when the collection is sharded. This choice is **the** decision in a sharded deployment, because:

- It determines whether data and load spread evenly or pile onto one shard.
- It determines which queries can be routed to a single shard versus which must be broadcast to all of them.
- It is **very hard to change** — historically immutable; even with modern reshard-in-place support it is an expensive operation.

A good shard key has four properties:

1. **High cardinality** — many distinct values, so the key space can be divided into many chunks and spread across many shards. A key with only a few possible values caps how finely the data can be split.
2. **Low frequency** — no single key value accounts for a large share of the documents. If one value (say, a "default" tenant, or a null) is on millions of documents, all of those documents are on one shard's chunk range and that shard is overloaded.
3. **Non-monotonic** — the key value for new documents should *not* be steadily increasing. A timestamp, an auto-incrementing counter, or a default \`ObjectId\` (which embeds a timestamp) means every newly inserted document has a key just above the previous one, so they all land in the same "highest range" chunk on one shard. That shard absorbs 100% of the insert traffic while the others sit idle — the classic **write hotspot**.
4. **Query alignment** — the queries the application runs most should *include* the shard key. A query that filters on the shard key can be routed to the one shard holding that range (a **targeted** query). A query that does not include the shard key must be sent to *every* shard and the results merged (a **scatter-gather** query), which does not scale.

## Ranged vs hashed

- **Ranged sharding** assigns contiguous ranges of shard-key values to each shard. This preserves **locality**: documents with nearby key values are on the same shard, so a range query on the key touches only a few shards. The risk is that a monotonic or skewed key produces hotspots.
- **Hashed sharding** shards on a *hash* of the key. This distributes documents **evenly** regardless of the key's natural distribution, and eliminates the monotonic-key hotspot because consecutive key values hash to unrelated shards. The cost is lost locality: a range query on the key cannot be targeted (nearby values are scattered), so it becomes scatter-gather.

The trade-off: hashed for even write distribution when you mostly do point lookups on the key; ranged when range queries on the key are important and you can ensure the key is not monotonic (for example, a compound key of \`{ region: 1, timestamp: 1 }\` — the leading \`region\` breaks monotonicity while keeping per-region time ranges local).

## Don't shard prematurely

Sharding adds real operational complexity: more servers, the \`mongos\` tier, the balancer, config servers, and a shard-key decision that constrains the schema. A single well-indexed replica set handles a very large amount of data and load. Shard when you have a concrete, measured reason — a collection genuinely outgrowing one machine's capacity — not preemptively.`,

    contentHi: `## Sharding: horizontal partitioning

Ek replica set availability solve karता hai data ki ek **full copy** har member par rakhकर. Ye *size* solve nahi karता: agar ek collection ek single server ke disk se badी hai, ya iska write rate ek primary jo absorb kar sakta hai usse zyada hai, replica-set members add karना madad nahi karता.

**Sharding** collection ko partition karता hai: har **shard** documents ka ek *subset* rakhता hai, aur har shard apna replica set hai.

Pieces:
- **Shards** — replica sets jo data partitions rakhते hain.
- **\`mongos\`** — ek routing process jise application connect karता hai.
- **Config servers** — cluster ka metadata store karता hai.
- **Balancer** — shards ke beech **chunks** migrate karता hai.

## Shard key

Ek sharded collection ka har document apne **shard key** ki value ke aadhaar par ek shard ko assign hota hai. Ye choice **THE** decision hai:
- Ye determine karता hai ki data aur load evenly spread hoते hain ya ek shard par pile hoते hain.
- Ye determine karता hai ki kaunसी queries ek single shard ko route ho sakti hain.
- Ise **badalना bahut mushkil hai**.

Ek achhа shard key ki chaar properties:
1. **High cardinality** — kई distinct values.
2. **Low frequency** — koi single key value documents ka ek badा share account nahi karती.
3. **Non-monotonic** — naye documents ke liye key value steadily increasing NAHI honi chahiye. Ek timestamp / ObjectId matlab har naya document ek key ke saath aata hai bilkul pichhले ke upar, to wo sab ek shard par land karते hain — classic **write hotspot**.
4. **Query alignment** — jo queries application aksar chalाता hai unhe shard key *include* karना chahiye.

## Ranged vs hashed

- **Ranged sharding** har shard ko contiguous ranges assign karता hai. **Locality** preserve karता hai par monotonic key hotspots produce karता hai.
- **Hashed sharding** key ke ek *hash* par shard karता hai. **Evenly** distribute karता hai, monotonic-key hotspot eliminate karता hai — par locality khो deता hai.

## Premature shard mat karो

Sharding real operational complexity add karता hai. Ek single well-indexed replica set bahut badी amount of data aur load handle karता hai. Shard karो jab aapke paas ek concrete, measured reason ho.`,

    examples: [
      {
        title: 'A hashed index serves an equality lookup but NOT a range query',
        titleHi: 'Ek hashed index ek equality lookup serve karta hai par ek range query NAHI',
        code: `await db.users.insertMany(Array.from({ length: 50 }, (_, i) => ({ uid: i })));
await db.users.createIndex({ uid: "hashed" });
const walk = (p) => { const s = []; let n = p; while (n) { s.push(n.stage); n = n.inputStage; } return s; };
const eq = await db.users.find({ uid: 5 }).explain("queryPlanner");
const rng = await db.users.find({ uid: { $gt: 5, $lt: 10 } }).explain("queryPlanner");
print({ equality: walk(eq.queryPlanner.winningPlan), range: walk(rng.queryPlanner.winningPlan) });`,
        output: `{"equality":["FETCH","IXSCAN"],"range":["COLLSCAN"]}`,
        explain: 'A hashed index stores hashes of the values, which carry no ordering information, so it can serve an EQUALITY lookup (`find({ uid: 5 })` → `IXSCAN`) but NOT a range query (`find({ uid: { $gt: 5, $lt: 10 } })` → falls back to `COLLSCAN`). This is exactly why a HASHED shard key gives even distribution but makes range queries on the key scatter-gather.',
        explainHi: 'Ek hashed index values ke hashes store karता hai, jinme koi ordering information nahi, to ye ek EQUALITY lookup serve kar sakta hai (`find({ uid: 5 })` → `IXSCAN`) par ek range query NAHI (`find({ uid: { $gt: 5, $lt: 10 } })` → `COLLSCAN` par fall back). Ye theek isliye hai ki ek HASHED shard key even distribution deता hai par key par range queries ko scatter-gather banata hai.',
      },
      {
        title: 'A monotonic key clusters recent documents — a write hotspot in a sharded cluster',
        titleHi: 'Ek monotonic key recent documents cluster karta hai — ek sharded cluster mein ek write hotspot',
        code: `await db.events.insertMany([{ _id: 1 }, { _id: 2 }, { _id: 3 }, { _id: 4 }, { _id: 5 }]);
const recent = await db.events.find({}).sort({ _id: -1 }).limit(3).project({ _id: 1 }).toArray();
print({ threeMostRecentIds: recent.map((d) => d._id) });`,
        output: `{"threeMostRecentIds":[5,4,3]}`,
        explain: 'Consecutive `_id`s are adjacent in sort order, so the three most recent are `[5, 4, 3]` — all clustered at the top. Under RANGED sharding, that top range lives on ONE shard, so a monotonically increasing key (a timestamp, a counter, a default ObjectId) sends 100% of new inserts to that one shard — the write HOTSPOT anti-pattern.',
        explainHi: 'Consecutive `_id`s sort order mein adjacent hain, to teen sabse recent `[5, 4, 3]` hain — sab top par clustered. RANGED sharding ke under, wo top range EK shard par rehति hai, to ek monotonically increasing key (ek timestamp, ek counter, ek default ObjectId) 100% naye inserts us ek shard ko bhejता hai — write HOTSPOT anti-pattern.',
      },
      {
        title: 'A hashed index is created as a distinct index kind (visible in listIndexes)',
        titleHi: 'Ek hashed index ek distinct index kind ke roop mein banaya jaता hai',
        code: `await db.users.createIndex({ region: "hashed" });
print((await db.users.listIndexes().toArray()).map((i) => ({ name: i.name, key: i.key })));`,
        output: `[{"name":"_id_","key":{"_id":1}},{"name":"region_hashed","key":{"region":"hashed"}}]`,
        explain: 'A hashed index is a distinct index KIND — its key pattern is `{ region: "hashed" }`, using the string `"hashed"` rather than `1` (ascending) or `-1` (descending). Hashed sharding is built directly on top of a hashed index of the chosen shard-key field.',
        explainHi: 'Ek hashed index ek distinct index KIND hai — iska key pattern `{ region: "hashed" }` hai, `"hashed"` string istemal karте hue `1` (ascending) ya `-1` (descending) ke bजaay. Hashed sharding chosen shard-key field ke ek hashed index ke upar seedhe bana hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// sharding on a monotonically increasing key -- the default ObjectId _id, or a
// timestamp, or an auto-increment counter
sh.shardCollection("app.events", { _id: 1 })   // _id is a monotonic ObjectId
// every new document has an _id just above the last, so 100% of inserts land in
// the single "highest range" chunk on one shard -- that shard is saturated while
// the rest are idle`,
        right: `// shard on a hashed key (even distribution, no monotonic hotspot):
sh.shardCollection("app.events", { _id: "hashed" })
// -- OR a compound key whose leading field is not monotonic:
sh.shardCollection("app.events", { tenantId: 1, timestamp: 1 })
// -- the leading tenantId spreads inserts across shards; timestamp keeps each
//    tenant's events time-ordered and local within its shard`,
        why: 'Ranged sharding assigns each shard a contiguous range of shard-key values, and the range containing the current maximum key value is on one particular shard. When the shard key increases monotonically for every new document, because it is a timestamp, an auto-incrementing number, or a default ObjectId that embeds a creation timestamp, every insert produces a key value just above the previous one, so every insert targets that same highest-range chunk on that same shard. The result is that a single shard receives essentially all the write traffic while the other shards handle none of it, which defeats the purpose of sharding for write scaling and can overwhelm that one shard. Hashed sharding avoids this by placing documents according to a hash of the key, so consecutive key values map to unrelated shards and inserts spread evenly. A compound shard key whose leading field is not monotonic, such as a tenant or region identifier followed by a timestamp, also works: the leading field distributes inserts across shards while the trailing timestamp preserves useful ordering and locality within each shard.',
        whyHi: 'Ranged sharding har shard ko contiguous range assign karता hai, aur current maximum key value waali range ek particular shard par hai. Jab shard key har naye document ke liye monotonically increase karता hai, har insert ek key value produce karता hai bilkul pichhले ke upar, to har insert usी highest-range chunk ko target karता hai usी shard par. Result ye hai ki ek single shard essentially saara write traffic receive karता hai. Hashed sharding ise avoid karता hai key ke ek hash ke aadhaar par documents place karके.',
      },
      {
        wrong: `// choosing a shard key that most queries don't filter on
sh.shardCollection("app.orders", { warehouseId: 1 })
// but the app's hottest query is find({ customerId: X }) -- which does NOT
// include warehouseId, so it must be broadcast to EVERY shard (scatter-gather)
// and the results merged, on every customer's order-history page load`,
        right: `// shard on the field the hot queries filter on:
sh.shardCollection("app.orders", { customerId: 1, orderDate: 1 })
// find({ customerId: X }) is now routed to the ONE shard holding that customer's
// range -- a targeted query that scales as shards are added`,
        why: 'When a query filters on the shard key, the router can determine from the cluster metadata exactly which shard or shards hold the matching key range and send the query only there, which is a targeted query whose cost stays roughly constant as the cluster grows because each shard\'s portion of the data stays bounded. When a query does not filter on the shard key, the router has no way to narrow it down and must send it to every shard, wait for all of them to respond, and merge the results, which is a scatter-gather query whose cost grows with the number of shards and which therefore does not benefit from sharding at all. If the collection\'s most frequent and most performance-sensitive queries do not include the chosen shard key, sharding provides no query-scaling benefit for them and adds the overhead of the scatter-gather. The shard key should be chosen so that the dominant query patterns filter on it, making those queries targeted.',
        whyHi: 'Jab ek query shard key par filter karती hai, router determine kar sakta hai ki kaunसा shard matching key range rakhता hai aur query ko sirf wahaan bhejता hai — ek targeted query jiski cost cluster badhne par roughly constant rehती hai. Jab ek query shard key par filter nahi karती, router ise narrow nahi kar sakta aur ise har shard ko bhejना paता hai — ek scatter-gather query jiski cost shards ki sankhya ke saath badhती hai. Shard key aise chunना chahiye ki dominant query patterns ispar filter karें.',
      },
      {
        wrong: `// sharding a collection preemptively, "to be ready for scale"
// a collection with 50,000 documents and light traffic, sharded on day one
// -- now every deploy manages mongos, config servers, a balancer, and a
//    shard-key choice that already constrains the schema, for a collection a
//    single replica set would serve from RAM without noticing`,
        right: `// run a single well-indexed replica set until you have a measured reason to shard:
// - a collection outgrowing one machine's disk, or
// - a working set exceeding one machine's RAM, or
// - a write rate one primary can't absorb
// then shard, with a key chosen from the now-known query patterns`,
        why: 'Sharding introduces substantial operational machinery: a routing tier of mongos processes, a separate replica set of config servers holding cluster metadata, a balancer process migrating data between shards, and multiple shard replica sets instead of one. It also forces an early commitment to a shard key that constrains how the schema and queries can evolve, made before the real query patterns are fully known. A single replica set with appropriate indexes can hold and serve a very large collection entirely from memory and handle a high request rate, so for the great majority of applications sharding is unnecessary. The right time to shard is when there is a concrete, measured limit being hit, the data no longer fits on one machine\'s disk, the working set no longer fits in one machine\'s RAM, or one primary cannot absorb the write rate, at which point the query patterns are well understood and the shard key can be chosen to make the important queries targeted.',
        whyHi: 'Sharding substantial operational machinery introduce karता hai: mongos processes ka ek routing tier, config servers ka ek alag replica set, ek balancer process, aur multiple shard replica sets. Ye ek shard key ke liye ek early commitment bhi force karता hai. Ek single replica set appropriate indexes ke saath ek bahut badी collection ko poori tarah memory se hold aur serve kar sakta hai. Shard karने ka sahi samay tab hai jab ek concrete, measured limit hit ho rahi ho.',
      },
    ],

    realWorld: [
      {
        en: '**A multi-tenant SaaS sharding its largest collection on `{ tenantId: 1, _id: 1 }`** — nearly every query is scoped to a tenant, so it routes to one shard; the compound key\'s leading `tenantId` also prevents the monotonic `_id` from creating a hotspot.',
        hi: '**Ek multi-tenant SaaS apni sabse badी collection ko `{ tenantId: 1, _id: 1 }` par shard karta hai** — lगभग har query ek tenant tak scoped hai.',
      },
      {
        en: '**An IoT platform sharding sensor readings on `{ sensorId: "hashed" }`** — billions of readings spread evenly across shards with no ingestion hotspot, and the dominant query (a single sensor\'s recent readings) stays targeted.',
        hi: '**Ek IoT platform sensor readings ko `{ sensorId: "hashed" }` par shard karta hai** — billions readings evenly spread, koi ingestion hotspot nahi.',
      },
      {
        en: '**A team that deliberately stayed on a single 3-member replica set for years** — a 400GB dataset served entirely from RAM, no sharding complexity, because they never hit a real capacity limit.',
        hi: '**Ek team jo jaan-boojhkar saalon ek single 3-member replica set par rahi** — ek 400GB dataset poori tarah RAM se served.',
      },
    ],

    interviewQA: [
      {
        q: 'What is sharding, how does it differ from replication, and what makes a good shard key?',
        qHi: 'Sharding kya hai, ye replication se kaise alag hai, aur ek achhا shard key kya banata hai?',
        a: 'Replication puts a full copy of the data on every member of a replica set, which provides availability and read distribution but does not help when a collection is simply too large or too write-heavy for one machine, since every member holds the same oversized collection. Sharding instead partitions the collection so that each shard holds only a subset of the documents, and each shard is itself a replica set for the availability of its subset, allowing a collection far larger than one machine to be stored and served. A routing process called mongos directs each operation to the appropriate shard or shards based on cluster metadata. The shard key is the field or fields whose value decides which shard a document belongs to, and choosing it well requires four properties. It must have high cardinality, meaning many distinct values, so the data can be divided into many chunks. It must have low frequency, meaning no single value covers a large fraction of documents, or that value\'s shard becomes overloaded. It must be non-monotonic, meaning the key for new documents is not steadily increasing, because a monotonic key like a timestamp or a default ObjectId sends every insert to the same shard, creating a write hotspot. And it must align with the queries, meaning the frequent queries filter on it, so they can be routed to a single shard rather than broadcast to all shards as a scatter-gather.',
        aHi: 'Replication data ki ek full copy har replica set member par rakhता hai. Sharding iske bजाy collection ko partition karता hai taaki har shard sirf documents ka ek subset rakhे. Shard key wo field(s) hai jiski value decide karती hai ki ek document kaunse shard ka hai, aur ise achhi tarah chunना ke liye chaar properties chahiye: high cardinality, low frequency, non-monotonic (ek monotonic key ek write hotspot banata hai), aur queries ke saath alignment (frequent queries ispar filter karें, taaki wo ek single shard ko route ho sakें).',
      },
      {
        q: 'What is the difference between ranged and hashed sharding, and when would you use each?',
        qHi: 'Ranged aur hashed sharding mein kya antar hai, aur aap har ek kab istemal karोge?',
        a: 'Ranged sharding assigns each shard a contiguous range of shard-key values, so documents with nearby key values live on the same shard. This preserves locality, which means a query for a range of key values touches only the few shards covering that range, making range queries on the shard key efficient. Its weakness is that a shard key which is monotonically increasing or heavily skewed toward some values produces uneven distribution and hotspots, since new or common documents all fall in one range. Hashed sharding instead distributes documents according to a hash of the shard-key value, so consecutive key values map to unrelated shards. This gives even distribution regardless of the key\'s natural pattern and eliminates the monotonic-key write hotspot, but it destroys locality: a range query on the key cannot be targeted because the values in that range are scattered across all shards, so it becomes a scatter-gather. You use hashed sharding when writes must spread evenly and the dominant queries are point lookups on the key. You use ranged sharding when range queries on the key matter and you can guarantee the key is not monotonic, often by using a compound key whose leading field is a non-monotonic identifier followed by a timestamp, which spreads writes by the leading field while keeping each group\'s time ranges local.',
        aHi: 'Ranged sharding har shard ko contiguous range assign karता hai, to nearby key values ek shard par rehते hain. Ye locality preserve karता hai. Iski weakness ye hai ki ek monotonic ya skewed shard key uneven distribution aur hotspots produce karता hai. Hashed sharding iske bजाy shard-key value ke ek hash ke aadhaar par documents distribute karता hai, even distribution deता hai aur monotonic-key write hotspot eliminate karता hai, par locality destroy karता hai. Aap hashed istemal karते ho jab writes evenly spread hone chahiye; ranged jab key par range queries matter karती hain aur aap guarantee kar sakते ho ki key monotonic nahi hai.',
      },
    ],

    exercises: [
      {
        task: 'Create a `hashed` index on a `uid` field. Run `explain("queryPlanner")` for an equality query `find({ uid: 5 })` and for a range query `find({ uid: { $gt: 5, $lt: 10 } })`. Confirm the equality plan uses `IXSCAN` while the range plan falls back to `COLLSCAN`.',
        taskHi: 'Ek `uid` field par ek `hashed` index banao. Ek equality query aur ek range query ke liye `explain("queryPlanner")` chalao.',
        hint: 'A hashed index stores hashes, which have no relationship to the values\' order, so it can serve exact-value lookups but not range comparisons — the same limitation a hashed shard key imposes on range queries.',
        hintHi: 'Ek hashed index hashes store karता hai, jinka values ke order se koi relationship nahi, to ye exact-value lookups serve kar sakta hai par range comparisons nahi.',
      },
      {
        task: 'Insert documents with sequential `_id`s 1 through 5. Query sorted by `_id` descending, limit 3. Confirm the three ids are `[5, 4, 3]` — all adjacent. In a comment, explain why sharding on a monotonic key would send all new writes to one shard.',
        taskHi: 'Sequential `_id`s 1 se 5 waale documents insert karo. `_id` descending sorted, limit 3 query karo. Confirm karo teen ids `[5, 4, 3]` hain. Ek comment mein samjhaओ ki ek monotonic key par sharding kyun saare naye writes ek shard ko bhejegi.',
        hint: 'Consecutive `_id`s are adjacent in sort order, so they fall in the same shard-key range — the highest one. Under ranged sharding, that range is on one shard, which then absorbs 100% of the insert traffic.',
        hintHi: 'Consecutive `_id`s sort order mein adjacent hain, to wo usी shard-key range mein aate hain — highest waali. Ranged sharding ke under, wo range ek shard par hai.',
      },
      {
        task: 'Create a `hashed` index on a `region` field and read `listIndexes()`. Confirm the index appears with a key pattern of `{ region: "hashed" }` (distinct from an ordinary ascending `{ region: 1 }` index).',
        taskHi: 'Ek `region` field par ek `hashed` index banao aur `listIndexes()` padho. Confirm karo index `{ region: "hashed" }` key pattern ke saath dikhता hai.',
        hint: 'A hashed index is a distinct index kind — its key pattern uses the string `"hashed"` rather than `1` or `-1`. Hashed sharding is built on top of a hashed index of the shard key.',
        hintHi: 'Ek hashed index ek distinct index kind hai — iska key pattern `"hashed"` string istemal karता hai. Hashed sharding shard key ke ek hashed index ke upar bana hai.',
      },
    ],

    keyTakeaways: [
      'REPLICATION copies the FULL data onto every replica-set member (availability). SHARDING PARTITIONS the collection — each SHARD holds a SUBSET, and each shard is itself a replica set. For a collection too big for one machine\'s disk/RAM/write-throughput.',
      'PIECES: shards (data partitions, each a replica set), `mongos` (router the app connects to — directs each op), config servers (cluster metadata), the BALANCER (migrates CHUNKS — contiguous shard-key ranges — between shards to keep them even).',
      'THE SHARD KEY (chosen when sharding a collection) is THE decision — it decides distribution, which queries can be targeted, and it\'s VERY hard to change. A good key: (1) HIGH CARDINALITY (many distinct values → fine splitting); (2) LOW FREQUENCY (no dominant value → no overloaded shard); (3) NON-MONOTONIC (a timestamp/ObjectId/counter sends ALL new writes to ONE shard = the write HOTSPOT anti-pattern); (4) QUERY ALIGNMENT (frequent queries include it → routed to ONE shard; queries without it → SCATTER-GATHER to every shard).',
      'RANGED sharding: contiguous key ranges per shard → good LOCALITY (range queries hit few shards), but a monotonic/skewed key → hotspots. HASHED sharding: shard by `hash(key)` → EVEN distribution, no monotonic hotspot, but LOST locality (range queries can\'t be targeted → scatter-gather).',
      'TRADE-OFF: hashed for even writes + point lookups on the key. Ranged when range queries on the key matter AND you can keep the key non-monotonic — e.g. a COMPOUND key `{ region: 1, timestamp: 1 }`: leading `region` breaks monotonicity + spreads writes; trailing `timestamp` keeps each region\'s time ranges local.',
      'DON\'T SHARD PREMATURELY. A single well-indexed replica set serves a very large dataset from RAM with a high request rate. Shard only for a CONCRETE, MEASURED limit (disk / working-set-vs-RAM / write rate one primary can\'t absorb) — by then the query patterns are known and the key can be chosen well.',
    ],
    keyTakeawaysHi: [
      'REPLICATION FULL data har replica-set member par copy karता hai (availability). SHARDING collection ko PARTITION karता hai — har SHARD ek SUBSET rakhता hai, aur har shard khud ek replica set hai.',
      'PIECES: shards, `mongos` (router jise app connect karता hai), config servers (metadata), BALANCER (shards ke beech CHUNKS migrate karता hai).',
      'SHARD KEY THE decision hai — ye distribution decide karता hai, aur ise badalना BAHUT mushkil hai. Ek achhа key: (1) HIGH CARDINALITY; (2) LOW FREQUENCY; (3) NON-MONOTONIC (ek timestamp/ObjectId SAARE naye writes EK shard ko bhejता hai = write HOTSPOT); (4) QUERY ALIGNMENT.',
      'RANGED: prati shard contiguous ranges → achhi LOCALITY, par monotonic key → hotspots. HASHED: `hash(key)` se → EVEN distribution, koi monotonic hotspot nahi, par LOCALITY khо deता hai.',
      'TRADE-OFF: hashed even writes + point lookups ke liye. Ranged jab key par range queries matter karती hain — e.g. ek COMPOUND key `{ region: 1, timestamp: 1 }`.',
      'PREMATURELY SHARD MAT KARO. Ek single well-indexed replica set ek bahut badा dataset RAM se serve karता hai. Shard karो sirf ek CONCRETE, MEASURED limit ke liye.',
    ],
  },

  {
    slug: 'mongo-change-streams',
    title: 'Change Streams',
    titleHi: 'Change Streams',
    description: 'A change stream is a live, ordered feed of every change to a collection, database, or whole deployment. Built on the oplog, it replaces polling: instead of asking "anything new?" on a timer, the application is pushed each insert, update, and delete as it happens.',
    descriptionHi: 'Ek change stream ek collection, database, ya poore deployment ke har change ka ek live, ordered feed hai. Oplog par bana, ye polling ko replace karता hai: ek timer par "kुछ naya?" poochne ke bजाy, application ko har insert, update, aur delete jaise ye hota hai push kiya jाता hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A newswire subscription versus repeatedly calling the newsroom to ask if anything happened.** Polling is the phone calls: every thirty seconds you ring up and ask "any news?" — mostly the answer is "no," so you have wasted a call, and if something broke twenty-nine seconds ago you are still a second behind. A change stream is the newswire: the newsroom pushes each story to you the instant it is filed, in order, with a bookmark (a **resume token**) so that if your connection drops you can reconnect and say "send me everything since this story" and miss nothing. You can also tell the wire "only send me sports stories" (a pipeline filter) so you are not woken for everything.',
      hi: '**Ek newswire subscription versus baar-baar newsroom ko call karके poochна kुछ hua kya.** Polling phone calls hai: har tees seconds aap ring karके poochते ho "koi news?" — zyadातार answer "nahi" hai, to aapne ek call waste kiya. Ek change stream newswire hai: newsroom har story ko aapको push karता hai jaise hi ye file hoती hai, order mein, ek bookmark (ek **resume token**) ke saath taaki agar aapka connection drops hota hai aap reconnect karके kah sakते ho "is story ke baad se sab kुछ bhejो" aur kuch miss na karो.',
    },

    simple: `**\`collection.watch()\` -- an async iterator of CHANGE EVENTS**

\`\`\`js
const cs = db.orders.watch();
for await (const change of cs) {
  change.operationType   // "insert" | "update" | "replace" | "delete" | ...
  change.documentKey     // { _id: ... } of the affected document
  change.fullDocument    // the whole doc (for insert; opt-in for update)
  change.updateDescription  // { updatedFields, removedFields } (for update)
  change.ns              // { db, coll }
}
\`\`\`

**Watch a COLLECTION, a DATABASE (\`db.watch()\`), or the WHOLE deployment (\`client.watch()\`)**

**FILTER with an aggregation pipeline -- only get the events you care about**

\`\`\`js
db.orders.watch([
  { $match: { operationType: "update", "updateDescription.updatedFields.status": "shipped" } },
]);
// only fires when an order's status is updated to "shipped"
\`\`\`

**RESUME TOKEN -- every event carries \`change._id\` (a resume token). If the stream drops,
reconnect with \`watch([], { resumeAfter: lastToken })\` and get every event since. No gaps.**

**Built on the OPLOG (Lesson 1) -- so it needs a replica set, and it sees changes in
the same committed order every replica applies them.**

**USE CASES:** cache invalidation, real-time notifications, syncing to a search index /
data warehouse (CDC), triggering workflows -- anything that was a polling loop.`,

    simpleHi: `**\`collection.watch()\` -- CHANGE EVENTS ka ek async iterator**

\`\`\`js
const cs = db.orders.watch();
for await (const change of cs) {
  change.operationType   // "insert" | "update" | "replace" | "delete" | ...
  change.documentKey     // affected document ka { _id: ... }
  change.fullDocument    // poora doc (insert ke liye; update ke liye opt-in)
  change.updateDescription  // { updatedFields, removedFields } (update ke liye)
  change.ns              // { db, coll }
}
\`\`\`

**Ek COLLECTION, ek DATABASE (\`db.watch()\`), ya POORA deployment (\`client.watch()\`) watch karो**

**Ek aggregation pipeline se FILTER karो -- sirf wo events jinki aapको parwाह hai**

\`\`\`js
db.orders.watch([
  { $match: { operationType: "update", "updateDescription.updatedFields.status": "shipped" } },
]);
\`\`\`

**RESUME TOKEN -- har event \`change._id\` (ek resume token) carry karता hai. Agar stream drops,
\`watch([], { resumeAfter: lastToken })\` se reconnect karो aur tabse har event paओ. Koi gaps nahi.**

**OPLOG (Lesson 1) par bana -- to ise ek replica set chahiye.**

**USE CASES:** cache invalidation, real-time notifications, ek search index / data warehouse
mein syncing (CDC), workflows trigger karना -- kुछ bhi jo ek polling loop tha.`,

    content: `## From polling to pushing

A common application need is "react when something in the database changes" — invalidate a cache, send a notification, update a search index, kick off a workflow. The naive implementation is a **polling loop**: every N seconds, query for records changed since the last check. Polling is wasteful (most polls find nothing), adds latency (up to N seconds behind), and puts constant query load on the database.

A **change stream** replaces this: the application subscribes once, and MongoDB pushes every relevant change to it as it is committed.

## \`watch()\`

\`\`\`js
const cs = db.orders.watch();
for await (const change of cs) {
  // handle each change event
}
await cs.close();
\`\`\`

\`watch()\` returns a cursor that behaves as an async iterator. Each item is a **change event** document describing one change:

- **\`operationType\`** — \`"insert"\`, \`"update"\`, \`"replace"\`, \`"delete"\`, \`"drop"\`, \`"rename"\`, \`"invalidate"\`, and others.
- **\`documentKey\`** — \`{ _id }\` of the affected document.
- **\`fullDocument\`** — the complete document. Always present for \`insert\` and \`replace\`; for \`update\`, you opt in with \`watch([], { fullDocument: "updateLookup" })\` (which fetches the current version — note it may differ from the version right after the update if there were later changes).
- **\`updateDescription\`** — for an \`update\`, \`{ updatedFields, removedFields, truncatedArrays }\` — exactly what changed, without the whole document.
- **\`ns\`** — the namespace, \`{ db, coll }\`.
- **\`clusterTime\`** — when the change was committed.

## Scope: collection, database, or deployment

- **\`collection.watch()\`** — changes to one collection.
- **\`db.watch()\`** — changes to any collection in a database.
- **\`client.watch()\`** — changes anywhere in the deployment.

Broader scopes are useful for global concerns like a data-sync pipeline that mirrors everything.

## Filtering with a pipeline

\`watch()\` takes an aggregation pipeline that runs over the change events themselves, so you only receive the ones that matter:

\`\`\`js
db.orders.watch([
  { $match: { operationType: "update", "updateDescription.updatedFields.status": "shipped" } },
]);
\`\`\`

This stream only produces an event when an order's \`status\` field is updated to \`"shipped"\` — the application is not woken for inserts, deletes, or unrelated field updates. You can also \`$project\` the event down to just the fields you need.

## Resume tokens: no missed events

Every change event carries a **resume token** in its \`_id\` field. If the change stream is interrupted — the connection drops, the application restarts, a primary fails over — you reconnect and pass the last token you processed:

\`\`\`js
db.orders.watch([], { resumeAfter: lastProcessedToken });
\`\`\`

The stream resumes from exactly after that event, delivering every change that happened in between. As long as those changes are still in the oplog (Lesson 1 — the oplog window matters here), no event is lost. This is what makes change streams safe to build reliable systems on: a consumer can crash and recover without gaps.

## Built on the oplog

A change stream is fundamentally a filtered, formatted view of the oplog. This is why it requires a replica set (a standalone has no oplog), and why the events arrive in the exact order every replica applies them and reflect only majority-committed changes by default (so a rolled-back write never produces a spurious event).

## Use cases

Anything that would otherwise be a polling loop:

- **Cache invalidation** — evict a cache entry the moment its underlying document changes.
- **Real-time features** — push a notification, update a live dashboard, refresh a collaborator's view.
- **Change data capture (CDC)** — stream every change to a search index (Elasticsearch), a data warehouse, or an analytics pipeline, keeping them in sync with the operational database.
- **Workflow triggers** — when an order reaches a state, start the fulfilment process.

Managed platforms build on this: MongoDB Atlas **Triggers** run a function in response to change events without you operating the consumer.`,

    contentHi: `## Polling se pushing tak

Ek common application need hai "react karो jab database mein kुछ badalता hai". Naive implementation ek **polling loop** hai. Polling wasteful hai, latency add karता hai, aur database par constant query load daalता hai.

Ek **change stream** ise replace karता hai: application ek baar subscribe karता hai, aur MongoDB har relevant change ko ise push karता hai jaise ye commit hota hai.

## \`watch()\`

\`\`\`js
const cs = db.orders.watch();
for await (const change of cs) { /* handle */ }
await cs.close();
\`\`\`

Har item ek **change event** document hai:
- **\`operationType\`** — \`"insert"\`, \`"update"\`, \`"delete"\`, waagairah.
- **\`documentKey\`** — affected document ka \`{ _id }\`.
- **\`fullDocument\`** — poora document (insert ke liye hamesha; update ke liye opt-in).
- **\`updateDescription\`** — ek update ke liye, \`{ updatedFields, removedFields }\`.
- **\`ns\`** — namespace, \`{ db, coll }\`.

## Scope: collection, database, ya deployment

- **\`collection.watch()\`** / **\`db.watch()\`** / **\`client.watch()\`**.

## Ek pipeline se filtering

\`\`\`js
db.orders.watch([
  { $match: { operationType: "update", "updateDescription.updatedFields.status": "shipped" } },
]);
\`\`\`

## Resume tokens: koi missed events nahi

Har change event apne \`_id\` field mein ek **resume token** carry karता hai. Agar change stream interrupt hota hai, aap reconnect karके last token pass karते ho:

\`\`\`js
db.orders.watch([], { resumeAfter: lastProcessedToken });
\`\`\`

Stream theek us event ke baad se resume hota hai. Jab tak wo changes abhi bhi oplog mein hain, koi event lost nahi hota.

## Oplog par bana

Ek change stream fundamentally oplog ka ek filtered, formatted view hai. Isिlye ise ek replica set chahiye.

## Use cases

- **Cache invalidation**, **real-time features**, **Change data capture (CDC)**, **workflow triggers**.

MongoDB Atlas **Triggers** iske upar bante hain.`,

    examples: [
      {
        title: 'A change stream captures an insert with its full document',
        titleHi: 'Ek change stream ek insert ko iske full document ke saath capture karta hai',
        code: `const cs = db.orders.watch();
const eventP = new Promise((resolve) => cs.once("change", resolve));
await db.orders.insertOne({ _id: 1, item: "widget" });
const evt = await eventP;
await cs.close();
print({ operationType: evt.operationType, fullDocument: evt.fullDocument, ns: evt.ns });`,
        output: `{"operationType":"insert","fullDocument":{"_id":1,"item":"widget"},"ns":{"db":"learn","coll":"orders"}}`,
        explain: '`db.orders.watch()` opens a change stream; `cs.once("change", ...)` captures the first event. The subsequent `insertOne` produces an `insert` change event whose `fullDocument` is the complete inserted document (always present for inserts) and whose `ns` is `{ db: "learn", coll: "orders" }`. The application is pushed this event the instant the write commits.',
        explainHi: '`db.orders.watch()` ek change stream kholta hai; `cs.once("change", ...)` pehla event capture karता hai. Baad ka `insertOne` ek `insert` change event produce karता hai jiska `fullDocument` complete inserted document hai (inserts ke liye hamesha maujood) aur jiska `ns` `{ db: "learn", coll: "orders" }` hai.',
      },
      {
        title: 'A pipeline filter delivers only update events, and updateDescription shows what changed',
        titleHi: 'Ek pipeline filter sirf update events deliver karta hai',
        code: `const cs = db.orders.watch([{ $match: { operationType: "update" } }]);
const eventP = new Promise((resolve) => cs.once("change", resolve));
await db.orders.insertOne({ _id: 1, status: "new" });
await db.orders.updateOne({ _id: 1 }, { $set: { status: "shipped" } });
const evt = await eventP;
await cs.close();
print({ operationType: evt.operationType, updatedFields: evt.updateDescription.updatedFields });`,
        output: `{"operationType":"update","updatedFields":{"status":"shipped"}}`,
        explain: 'The pipeline `[{ $match: { operationType: "update" } }]` runs over the change events themselves, so the `insert` is filtered out and only the `update` reaches the consumer. For an update, `updateDescription.updatedFields` is the DELTA — exactly `{ status: "shipped" }`, the one field that changed — without transferring the whole document.',
        explainHi: 'Pipeline `[{ $match: { operationType: "update" } }]` change events ke upar chalती hai, to `insert` filter ho jaता hai aur sirf `update` consumer tak pahunचता hai. Ek update ke liye, `updateDescription.updatedFields` DELTA hai — theek `{ status: "shipped" }`, wo ek field jo badla — bina poora document transfer kiye.',
      },
      {
        title: 'A change event carries a resume token in its _id',
        titleHi: 'Ek change event apne _id mein ek resume token carry karta hai',
        code: `const cs = db.orders.watch();
const eventP = new Promise((resolve) => cs.once("change", resolve));
await db.orders.insertOne({ _id: 1, item: "widget" });
const evt = await eventP;
await cs.close();
print({ hasResumeToken: evt._id !== undefined && evt._id !== null, operationType: evt.operationType });`,
        output: `{"hasResumeToken":true,"operationType":"insert"}`,
        explain: 'Every change event carries a resume token in its `_id` field — here confirmed present (not null/undefined). If the stream is interrupted (network blip, failover, restart), the consumer reconnects with `watch([], { resumeAfter: lastToken })` and the stream replays every change since that token, so no event is lost as long as those changes are still in the oplog window.',
        explainHi: 'Har change event apne `_id` field mein ek resume token carry karता hai — yahaan maujood confirm kiya gaya. Agar stream interrupt hota hai, consumer `watch([], { resumeAfter: lastToken })` se reconnect karता hai aur stream us token se har change replay karता hai, to koi event lost nahi hota jab tak wo changes abhi bhi oplog window mein hain.',
      },
    ],

    mistakes: [
      {
        wrong: `// keeping a polling loop when a change stream is what's wanted
setInterval(async () => {
  const changed = await db.orders.find({ updatedAt: { $gt: lastCheck } }).toArray();
  for (const o of changed) reindex(o);
  lastCheck = new Date();
}, 5000);
// every 5s a query runs whether or not anything changed; reindexing lags up to
// 5s; and this misses a document changed twice within one interval if updatedAt
// isn't perfectly maintained`,
        right: `const cs = db.orders.watch([], { fullDocument: "updateLookup" });
for await (const change of cs) {
  reindex(change.fullDocument);
}
// pushed each change the instant it commits; no wasted queries; no interval lag;
// and a resume token lets a restart pick up exactly where it left off`,
        why: 'A polling loop repeatedly queries the database on a fixed interval to find records that changed since the last check, which means it runs a query on every interval regardless of whether anything changed, it detects changes only after a delay of up to one interval, and it depends on every write correctly updating a timestamp field it can filter on, a discipline that is easy to break. A change stream inverts this: the application subscribes once and MongoDB delivers each change as an event the moment it is committed, so there are no wasted queries, no interval latency, and no dependency on a manually maintained timestamp because the stream is derived directly from the oplog record of every write. The change stream also provides a resume token with every event, so a consumer that crashes or disconnects can reconnect and receive every change that occurred while it was away, which a naive polling loop cannot guarantee. For any reactive need that was implemented as polling, a change stream is both more efficient and more correct.',
        whyHi: 'Ek polling loop ek fixed interval par database ko repeatedly query karता hai, jiska matlab hai ye har interval par ek query chalाता hai chahe kुछ badla ho ya na ho, ye changes ko ek delay ke baad detect karता hai, aur ye har write ke ek timestamp field correctly update karne par depend karता hai. Ek change stream ise invert karता hai: application ek baar subscribe karता hai aur MongoDB har change ko ek event ke roop mein deliver karता hai jaise ye commit hota hai. Change stream har event ke saath ek resume token bhi deता hai.',
      },
      {
        wrong: `// not handling reconnection -- losing events when the stream drops
const cs = db.orders.watch();
for await (const change of cs) { process(change); }
// if the connection blips or a failover happens, this loop throws and the
// process either crashes or silently stops consuming -- any change during the
// gap is never seen`,
        right: `let resumeToken = loadSavedToken();   // persisted from the last processed event
while (true) {
  const cs = db.orders.watch([], resumeToken ? { resumeAfter: resumeToken } : {});
  try {
    for await (const change of cs) {
      process(change);
      resumeToken = change._id;      // persist this after processing
      saveToken(resumeToken);
    }
  } catch (e) {
    // transient error -- loop reconnects with the last token, missing nothing
  }
}`,
        why: 'A change stream connection can be interrupted by a network blip, a primary failover, or any transient error, and when that happens the iteration over the stream throws. Code that does not anticipate this either lets the exception crash the process or lets the loop end silently, and in both cases any changes that occur between the interruption and a manual restart are never delivered, because a fresh watch call with no resume information starts from the current moment. The correct pattern persists the resume token from each event after it has been fully processed, and on any interruption reconnects with resumeAfter set to that last token, which causes the stream to replay every change that happened since, so no event is lost as long as those changes are still within the oplog window. Building a reliable consumer on a change stream requires this reconnect-and-resume loop; without it the stream is only suitable for best-effort notifications where missing an occasional event is acceptable.',
        whyHi: 'Ek change stream connection ek network blip, ek primary failover, ya kisī transient error se interrupt ho sakta hai, aur jab aisा hota hai stream par iteration throw karता hai. Code jo ise anticipate nahi karता ya to exception ko process crash karने deта hai ya loop ko silently end hone deता hai, aur dono cases mein interruption aur ek manual restart ke beech jo changes hote hain wo kabhi deliver nahi hote. Sahi pattern har event se resume token persist karता hai aur kisī bhi interruption par `resumeAfter` us last token par set karके reconnect karता hai.',
      },
      {
        wrong: `// relying on change.fullDocument for an update without opting in
const cs = db.orders.watch();
for await (const change of cs) {
  if (change.operationType === "update") {
    sendToSearchIndex(change.fullDocument);   // <- undefined for updates by default!
  }
}`,
        right: `const cs = db.orders.watch([], { fullDocument: "updateLookup" });
for await (const change of cs) {
  if (change.operationType === "update") {
    sendToSearchIndex(change.fullDocument);   // now the current full document is included
  }
  // (or just use change.updateDescription.updatedFields if a partial update suffices)
}`,
        why: 'For an insert or a replace, a change event naturally includes the complete new document because that document is part of the operation. For an update, the operation only records which fields changed and how, not the whole document, so by default an update change event has no fullDocument field and provides the modification details in updateDescription instead. If downstream processing needs the entire current document, the watch call must be given the fullDocument option set to updateLookup, which tells MongoDB to fetch and attach the current version of the document to each update event. That current version reflects the document as it stands when the lookup runs, which can differ from its state immediately after the update if further changes have occurred, a subtlety worth knowing. If the downstream logic only needs to know which fields changed, updateDescription.updatedFields already provides that without the extra lookup.',
        whyHi: 'Ek insert ya replace ke liye, ek change event naturally poora naya document include karता hai. Ek update ke liye, operation sirf record karता hai ki kaunse fields badle, poora document nahi, to default se ek update change event mein koi `fullDocument` field nahi hai. Agar downstream processing ko poora current document chahiye, `watch` call ko `fullDocument` option `updateLookup` par set karके dena chahiye. Agar downstream logic ko sirf ye jaanना hai ki kaunse fields badle, `updateDescription.updatedFields` wo pehle se deता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A search-index sync service running a `client.watch([], { fullDocument: "updateLookup" })` loop with a persisted resume token** — every insert/update/delete in the operational database is mirrored into Elasticsearch within milliseconds, and a restart resumes without gaps.',
        hi: '**Ek search-index sync service jo ek `client.watch(...)` loop chalata hai ek persisted resume token ke saath** — har change milliseconds ke andar Elasticsearch mein mirror hota hai.',
      },
      {
        en: '**A cache layer that watches its hot collections and evicts a key the instant the underlying document changes** — no TTL guessing, no stale reads, the cache is invalidated by the source of truth itself.',
        hi: '**Ek cache layer jo apni hot collections watch karta hai aur ek key evict karta hai jaise underlying document badalta hai** — koi TTL guessing nahi.',
      },
      {
        en: '**A MongoDB Atlas Trigger firing a serverless function on `{ operationType: "insert" }` into a `signups` collection** — sends a welcome email, with no polling consumer to deploy or operate.',
        hi: '**Ek MongoDB Atlas Trigger jo ek serverless function fire karta hai `signups` collection mein ek insert par** — koi polling consumer deploy nahi karna.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a change stream, how does it improve on polling, and what is a resume token?',
        qHi: 'Ek change stream kya hai, ye polling par kaise improve karता hai, aur ek resume token kya hai?',
        a: 'A change stream is a subscription to a live, ordered feed of changes to a collection, a database, or an entire deployment, opened with the watch method. The application subscribes once and MongoDB delivers a change event for each insert, update, replace, delete, and other operation as it is committed, with each event describing the operation type, the affected document key, what changed, and the namespace. This improves on a polling loop, which repeatedly queries the database on a fixed interval to find recently changed records, in three ways: it runs no query when nothing has changed rather than a wasted query every interval, it delivers changes immediately rather than after up to one interval of delay, and it does not depend on every write correctly maintaining a timestamp field to filter on, because it is derived directly from the oplog. A resume token is a value carried in the id field of every change event that marks that event\'s position in the change stream. If the stream is interrupted by a network issue or a failover, the consumer reconnects and passes the last token it fully processed as the resumeAfter option, and the stream replays every change that occurred since that point, so no event is lost as long as those changes are still within the oplog\'s retention window. This resume capability is what makes change streams suitable for building reliable systems rather than only best-effort notifications.',
        aHi: 'Ek change stream ek collection, database, ya poore deployment ke changes ke ek live, ordered feed ka ek subscription hai, `watch` method se khोla gaya. Application ek baar subscribe karता hai aur MongoDB har operation ke liye ek change event deliver karता hai jaise ye commit hota hai. Ye polling par teen tarikon se improve karता hai: koi query nahi jab kुछ nahi badla, changes turant deliver, aur ek timestamp field par depend nahi. Ek resume token har change event ke `_id` field mein carry kiya gaya ek value hai. Agar stream interrupt hota hai, consumer reconnect karके last token pass karता hai, aur stream us point se har change replay karता hai.',
      },
      {
        q: 'Why does an update change event not include the full document by default, and how do you get it?',
        qHi: 'Ek update change event default se full document kyun include nahi karता, aur aap ise kaise paते ho?',
        a: 'When a document is inserted or replaced, the operation inherently contains the complete new document, so the change event for it naturally includes that document in the fullDocument field. An update operation is different: it records only which fields were changed and what they were changed to, not the entire document, because that is all the operation needs to express and all that is written to the oplog. As a result, an update change event by default has no fullDocument field and instead provides an updateDescription object containing the updated fields, removed fields, and any truncated arrays, which is exactly the delta of the change. If the downstream consumer needs the entire current document, for example to send the whole record to a search index, the watch call is opened with the fullDocument option set to updateLookup, which instructs MongoDB to look up and attach the current version of the document to each update event. One subtlety is that this looked-up version reflects the document as it exists when the lookup is performed, so if additional changes were applied between the update and the lookup, the attached document reflects those too rather than the exact state right after the update. If the consumer only needs to know which fields changed, updateDescription already provides that without the cost of the lookup.',
        aHi: 'Jab ek document insert ya replace hota hai, operation inherently poora naya document contain karता hai, to iske liye change event naturally us document ko `fullDocument` field mein include karता hai. Ek update operation alag hai: ye sirf record karता hai ki kaunse fields badle, poora document nahi. Result mein, ek update change event default se `fullDocument` field nahi rakhता aur iske bजाy ek `updateDescription` object deता hai. Agar downstream consumer ko poora current document chahiye, `watch` call ko `fullDocument` option `updateLookup` par set karके khोla jाता hai.',
      },
    ],

    exercises: [
      {
        task: 'Open a change stream on an `orders` collection with `watch()`. Set up a promise for the first `"change"` event, then `insertOne` a document. Await the event and confirm its `operationType` is `"insert"`, its `fullDocument` is the doc you inserted, and its `ns` is `{ db: "learn", coll: "orders" }`.',
        taskHi: 'Ek `orders` collection par `watch()` se ek change stream kholo. Pehle `"change"` event ke liye ek promise set up karo, phir ek document `insertOne` karo.',
        hint: 'A change stream is an async iterator; `cs.once("change", resolve)` captures the first event. For an insert, `fullDocument` is always present (unlike updates, which need `fullDocument: "updateLookup"`).',
        hintHi: 'Ek change stream ek async iterator hai. Ek insert ke liye, `fullDocument` hamesha maujood hai.',
      },
      {
        task: 'Open a change stream with a pipeline filter of `[{ $match: { operationType: "update" } }]`. Insert a document (which the filter ignores), then `updateOne` it with `$set`. Await the event and confirm it is the update, and that `updateDescription.updatedFields` shows exactly the field you set.',
        taskHi: 'Ek pipeline filter `[{ $match: { operationType: "update" } }]` ke saath ek change stream kholo. Ek document insert karo (jise filter ignore karta hai), phir ise `$set` ke saath `updateOne` karo.',
        hint: 'The pipeline runs over the change events themselves — the `insert` event is filtered out, only the `update` reaches the consumer. `updateDescription.updatedFields` is the delta, without the whole document.',
        hintHi: 'Pipeline change events ke upar chalta hai — `insert` event filter ho jata hai, sirf `update` consumer tak pahunchता hai.',
      },
      {
        task: 'Open a change stream, capture one insert event, and confirm that `change._id` (the resume token) is present (not null/undefined). In a comment, explain how you would use it to reconnect without missing events after a disconnect.',
        taskHi: 'Ek change stream kholo, ek insert event capture karo, aur confirm karo `change._id` (resume token) maujood hai. Ek comment mein samjhaओ ki aap ise ek disconnect ke baad reconnect karne ke liye kaise istemal karोge.',
        hint: 'Every change event\'s `_id` is a resume token. On reconnect, `watch([], { resumeAfter: lastToken })` replays every change since that token — no gaps, as long as the changes are still in the oplog window.',
        hintHi: 'Har change event ka `_id` ek resume token hai. Reconnect par, `watch([], { resumeAfter: lastToken })` us token se har change replay karta hai.',
      },
    ],

    keyTakeaways: [
      'A CHANGE STREAM (`collection.watch()`, `db.watch()`, `client.watch()`) is a LIVE, ORDERED feed of every change — MongoDB PUSHES each insert/update/delete as it commits, replacing a polling loop (which runs wasted queries, lags up to one interval, and depends on a manually-maintained timestamp field).',
      'Each CHANGE EVENT: `operationType` (`"insert"`/`"update"`/`"replace"`/`"delete"`/...), `documentKey` (`{ _id }`), `fullDocument` (always for insert/replace; for UPDATE you must opt in with `{ fullDocument: "updateLookup" }`), `updateDescription` (`{ updatedFields, removedFields }` — the delta, for updates), `ns` (`{ db, coll }`), `clusterTime`.',
      'FILTER with an aggregation pipeline passed to `watch([...])` — it runs over the change events themselves, so `[{ $match: { operationType: "update", "updateDescription.updatedFields.status": "shipped" } }]` only fires on that specific change. `$project` trims the event too.',
      'RESUME TOKEN: every event carries one in `change._id`. On any interruption (network blip, failover, restart), reconnect with `watch([], { resumeAfter: lastToken })` — the stream REPLAYS every change since, NO gaps, as long as those changes are still in the oplog window. A RECONNECT-AND-RESUME loop (persist the token after processing each event) is required for a reliable consumer.',
      'Built on the OPLOG (Lesson 1) → needs a REPLICA SET, events arrive in committed order, and reflect only majority-committed changes by default (a rolled-back write never produces a spurious event).',
      'USE CASES (anything that was a polling loop): CACHE INVALIDATION (evict the moment the doc changes), REAL-TIME features (notifications, live dashboards), CHANGE DATA CAPTURE (sync to a search index / warehouse), WORKFLOW TRIGGERS. MongoDB Atlas TRIGGERS run a serverless function on change events with no consumer to operate.',
    ],
    keyTakeawaysHi: [
      'Ek CHANGE STREAM (`collection.watch()`, `db.watch()`, `client.watch()`) har change ka ek LIVE, ORDERED feed hai — MongoDB har insert/update/delete PUSH karता hai jaise ye commit hota hai, ek polling loop ko replace karते hue.',
      'Har CHANGE EVENT: `operationType`, `documentKey` (`{ _id }`), `fullDocument` (insert/replace ke liye hamesha; UPDATE ke liye `{ fullDocument: "updateLookup" }` se opt in karna), `updateDescription` (`{ updatedFields, removedFields }` — delta), `ns`, `clusterTime`.',
      '`watch([...])` ko pass ki gayi ek aggregation pipeline se FILTER karो — ye change events ke upar chalती hai.',
      'RESUME TOKEN: har event `change._id` mein ek carry karता hai. Kisī bhi interruption par, `watch([], { resumeAfter: lastToken })` se reconnect karो — stream tabse har change REPLAY karता hai, KOI gaps nahi. Ek reliable consumer ke liye ek RECONNECT-AND-RESUME loop zaroori hai.',
      'OPLOG (Lesson 1) par bana → ek REPLICA SET chahiye, events committed order mein aate hain.',
      'USE CASES: CACHE INVALIDATION, REAL-TIME features, CHANGE DATA CAPTURE, WORKFLOW TRIGGERS. MongoDB Atlas TRIGGERS change events par ek serverless function chalाते hain.',
    ],
  },

  {
    slug: 'mongo-schema-validation-and-wrap-up',
    title: 'Schema Validation & Wrapping Up MongoDB',
    titleHi: 'Schema Validation Aur MongoDB Wrap-Up',
    description: 'A flexible schema does not mean no schema. A $jsonSchema validator lets MongoDB enforce a document\'s required fields, types, and value constraints at the database level — with control over how strictly and what to do on a violation. This lesson closes Part III.',
    descriptionHi: 'Ek flexible schema ka matlab koi schema nahi hai aisा nahi. Ek `$jsonSchema` validator MongoDB ko ek document ke required fields, types, aur value constraints ko database level par enforce karने deता hai — кितna strictly aur ek violation par kya karना iske control ke saath. Ye lesson Part III band karता hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**A form that accepts handwriting in any style, but still checks that the required boxes are filled and the date field actually contains a date before it goes in the filing cabinet.** MongoDB\'s flexibility is the "any handwriting" part — two records can look different. Schema validation is the checker at the point of filing: it does not dictate every field, but it can insist that \`name\` and \`price\` are present, that \`price\` is a number and not negative, that \`email\` matches a pattern. And you set how the checker behaves: reject the form outright (\`error\`), or file it but flag it (\`warn\`); apply the rules to every form, or only to forms being newly filed while leaving old ones alone (\`moderate\`).',
      hi: '**Ek form jo kisī bhi style mein handwriting accept karता hai, par phir bhi check karता hai ki required boxes bhare hain aur date field mein actually ek date hai isse pehle ki ye filing cabinet mein jाये.** MongoDB ki flexibility "any handwriting" part hai. Schema validation filing ke point par checker hai: ye har field dictate nahi karता, par ye insist kar sakта hai ki \`name\` aur \`price\` maujood hain, ki \`price\` ek number hai aur negative nahi. Aur aap set karते ho checker kaise behave karता hai: form ko outright reject karो (\`error\`), ya file karो par flag karो (\`warn\`).',
    },

    simple: `**\`$jsonSchema\` validator: attach constraints to a collection at creation or later**

\`\`\`js
await db.createCollection("products", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["name", "price"],
    properties: {
      name:  { bsonType: "string" },
      price: { bsonType: "number", minimum: 0 },
      tags:  { bsonType: "array", items: { bsonType: "string" } },
    },
  } },
});

await db.products.insertOne({ name: "ok", price: 10 });    // fine
await db.products.insertOne({ name: "bad", price: -5 });   // [ERROR] Document failed validation
\`\`\`

**\`validationAction\` -- what happens on a violation:**
\`\`\`
"error" (default) -- reject the write
"warn"            -- allow the write, log a warning (for a gradual rollout)
\`\`\`

**\`validationLevel\` -- which writes are checked:**
\`\`\`
"strict" (default) -- all inserts AND all updates
"moderate"         -- inserts, and updates to documents that ALREADY pass;
                      existing invalid documents can still be updated
"off"              -- validation disabled
\`\`\`

**\`collMod\` adds/changes a validator on an EXISTING collection (existing docs are not
retroactively checked -- only future writes).**

**The workflow:** start \`validationAction: "warn"\`, watch the logs for violations, fix
the offending writes, then flip to \`"error"\`.`,

    simpleHi: `**\`$jsonSchema\` validator: creation par ya baad mein ek collection par constraints attach karो**

\`\`\`js
await db.createCollection("products", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["name", "price"],
    properties: {
      name:  { bsonType: "string" },
      price: { bsonType: "number", minimum: 0 },
    },
  } },
});

await db.products.insertOne({ name: "ok", price: 10 });    // theek
await db.products.insertOne({ name: "bad", price: -5 });   // [ERROR] Document failed validation
\`\`\`

**\`validationAction\` -- ek violation par kya hota hai:**
\`\`\`
"error" (default) -- write reject karो
"warn"            -- write allow karो, ek warning log karो (gradual rollout ke liye)
\`\`\`

**\`validationLevel\` -- kaunse writes checked hote hain:**
\`\`\`
"strict" (default) -- saare inserts AUR saare updates
"moderate"         -- inserts, aur un documents ke updates jo PEHLE SE pass karते hain
"off"              -- validation disabled
\`\`\`

**\`collMod\` ek EXISTING collection par ek validator add/change karता hai (existing docs
retroactively checked NAHI hote -- sirf future writes).**

**Workflow:** \`validationAction: "warn"\` se shuru karो, logs watch karो, offending writes fix karो, phir \`"error"\` mein flip karो.**`,

    content: `## Flexible does not mean unstructured

MongoDB does not require a schema, but that flexibility is a tool for genuine variation and gradual change (Module 13, Module 14), not a licence for a collection where every document disagrees about what its fields are called and what types they hold. Once a collection's intended shape has stabilized, a **validator** lets MongoDB enforce it — the same role a relational \`CREATE TABLE\` plus constraints plays, applied to a document.

## \`$jsonSchema\`

A validator is a query expression a document must satisfy to be written. \`$jsonSchema\` is the expressive way to write one — a subset of the JSON Schema standard:

\`\`\`js
await db.createCollection("products", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["name", "price"],
    properties: {
      name:   { bsonType: "string", minLength: 1 },
      price:  { bsonType: "number", minimum: 0 },
      status: { enum: ["active", "discontinued"] },
      tags:   { bsonType: "array", items: { bsonType: "string" } },
      dims:   { bsonType: "object", required: ["w", "h"],
                properties: { w: { bsonType: "number" }, h: { bsonType: "number" } } },
    },
    additionalProperties: true,
  } },
});
\`\`\`

Key keywords:

- **\`bsonType\`** — the required BSON type (\`"string"\`, \`"number"\`, \`"int"\`, \`"object"\`, \`"array"\`, \`"date"\`, \`"bool"\`, \`"objectId"\`, ...). Using \`bsonType\` rather than JSON Schema's \`type\` lets you distinguish \`int\` from \`double\`, etc.
- **\`required\`** — an array of field names that must be present.
- **\`properties\`** — per-field sub-schemas. Nested \`properties\` validate embedded objects; \`items\` validates array elements.
- **Constraints** — \`minimum\`/\`maximum\`, \`minLength\`/\`maxLength\`, \`pattern\` (regex), \`enum\`, \`minItems\`/\`maxItems\`, \`uniqueItems\`.
- **\`additionalProperties: false\`** — reject any field not listed in \`properties\` (strict); \`true\` (default) allows extras.

A document that violates the schema is rejected with a **\`Document failed validation\`** error. (Modern MongoDB can be configured to return detailed reasons; the base error is terse.)

## \`validationAction\`: reject or warn

- **\`"error"\`** (default) — a violating write fails.
- **\`"warn"\`** — a violating write is **allowed**, and a warning is written to the server log. This is the mechanism for introducing a validator to an existing collection without breaking writes on day one: run in \`"warn"\` mode, monitor the log for violations, fix the code paths producing bad documents, then switch to \`"error"\`.

\`\`\`js
await db.createCollection("t", {
  validator: { $jsonSchema: { required: ["name"], properties: { age: { bsonType: "int", minimum: 0 } } } },
  validationAction: "warn",
});
await db.t.insertOne({ name: "ok", age: -5 });   // inserted anyway; logs a warning
\`\`\`

## \`validationLevel\`: which writes are checked

- **\`"strict"\`** (default) — every insert and every update is validated.
- **\`"moderate"\`** — inserts are validated, and updates are validated only for documents that *already* satisfy the schema. A pre-existing document that does not pass can still be updated (letting you fix it gradually without the update itself being blocked).
- **\`"off"\`** — no validation.

## Adding a validator to an existing collection

\`\`\`js
await db.command({
  collMod: "orders",
  validator: { $jsonSchema: { required: ["customerId", "total"] } },
  validationLevel: "moderate",
  validationAction: "warn",
});
\`\`\`

\`collMod\` attaches or replaces a validator on a collection that already has data. Existing documents are **not** retroactively checked — validation applies only to writes from that point on. Combined with \`"moderate"\` level and \`"warn"\` action, this is the safe way to roll schema enforcement onto a live collection.

## Wrapping up Part III

MongoDB, across Modules 13-16:

- **The document model** (13) — documents, collections, BSON, and a CRUD API where one filter language works everywhere.
- **Data modeling** (14) — embed vs reference, driven by cardinality and access patterns; the design patterns; the anti-patterns and the 16MB limit.
- **Aggregation & indexes** (15) — the pipeline for grouping, joining, reshaping, and windowing; index types and the ESR rule; \`explain()\` for tuning.
- **Operations & distribution** (16) — replica sets for availability, read/write concerns for the consistency trade-off, transactions for cross-document atomicity, sharding for scale, change streams for reactivity, and validators for enforced structure.

Beyond the core, **MongoDB Atlas** (the managed service) adds Atlas Search (Lucene-based full-text and vector search), Triggers (functions on change events), Data Federation (query across clusters and cloud object storage), and automated backup with point-in-time restore.

**Part IV** moves to a different corner of the landscape: **Firebase** — Cloud Firestore and the Realtime Database — where the database, the client SDK, the auth system, and the security-rules layer are one integrated product.`,

    contentHi: `## Flexible ka matlab unstructured nahi

MongoDB ek schema require nahi karता, par wo flexibility genuine variation ke liye ek tool hai, ek collection ke liye licence nahi jahaan har document disagree karे. Ek baar ek collection ki intended shape stabilize ho gayi, ek **validator** MongoDB ko ise enforce karने deता hai.

## \`$jsonSchema\`

\`\`\`js
await db.createCollection("products", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["name", "price"],
    properties: {
      name:  { bsonType: "string" },
      price: { bsonType: "number", minimum: 0 },
    },
  } },
});
\`\`\`

Key keywords:
- **\`bsonType\`** — required BSON type.
- **\`required\`** — field names jo maujood hone chahiye.
- **\`properties\`** — per-field sub-schemas.
- **Constraints** — \`minimum\`/\`maximum\`, \`minLength\`, \`pattern\`, \`enum\`.
- **\`additionalProperties: false\`** — koi field jo listed nahi reject karो.

Ek document jo schema violate karता hai ek **\`Document failed validation\`** error ke saath reject hota hai.

## \`validationAction\`

- **\`"error"\`** (default) — ek violating write fail hota hai.
- **\`"warn"\`** — ek violating write **allowed** hai, ek warning log hota hai. Ye ek existing collection ko validator introduce karने ka mechanism hai.

## \`validationLevel\`

- **\`"strict"\`** (default) — har insert aur har update validated.
- **\`"moderate"\`** — inserts, aur un documents ke updates jo *pehle se* schema satisfy karते hain.
- **\`"off"\`** — koi validation nahi.

## Ek existing collection mein ek validator add karna

\`\`\`js
await db.command({ collMod: "orders", validator: { $jsonSchema: { required: ["customerId"] } },
  validationLevel: "moderate", validationAction: "warn" });
\`\`\`

Existing documents **retroactively checked NAHI** hote.

## Part III wrap-up

MongoDB, Modules 13-16 ke across: document model (13), data modeling (14), aggregation & indexes (15), operations & distribution (16).

**MongoDB Atlas** Atlas Search, Triggers, Data Federation, aur automated backup add karता hai.

**Part IV** ek alag corner par jाता hai: **Firebase** — Cloud Firestore aur Realtime Database.`,

    examples: [
      {
        title: 'A $jsonSchema validator rejects a document that violates a constraint',
        titleHi: 'Ek $jsonSchema validator ek document reject karta hai jo ek constraint violate karta hai',
        code: `await db.createCollection("products", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["name", "price"],
    properties: { price: { bsonType: "number", minimum: 0 } },
  } },
});
await db.products.insertOne({ name: "ok", price: 10 });
await db.products.insertOne({ name: "bad", price: -5 });`,
        output: `[ERROR] Document failed validation`,
        explain: 'The `$jsonSchema` validator requires `name` and `price`, with `price` constrained to `bsonType: "number", minimum: 0`. The first insert (`price: 10`) satisfies it. The second (`price: -5`) violates `minimum: 0`, so MongoDB rejects the write with a `Document failed validation` error — the base error is terse (detailed reasons can be configured).',
        explainHi: '`$jsonSchema` validator `name` aur `price` require karता hai, `price` `bsonType: "number", minimum: 0` tak constrained hone ke saath. Pehla insert (`price: 10`) ise satisfy karता hai. Doosरा (`price: -5`) `minimum: 0` violate karता hai, to MongoDB write ko ek `Document failed validation` error ke saath reject karता hai.',
      },
      {
        title: 'validationAction "warn" lets the invalid write through (for a gradual rollout)',
        titleHi: 'validationAction "warn" invalid write ko through jaane deta hai',
        code: `await db.createCollection("t", {
  validator: { $jsonSchema: {
    bsonType: "object", required: ["name"],
    properties: { age: { bsonType: "int", minimum: 0 } },
  } },
  validationAction: "warn",
});
await db.t.insertOne({ name: "ok", age: -5 });
print(await db.t.findOne({}, { projection: { _id: 0 } }));`,
        output: `{"name":"ok","age":-5}`,
        explain: 'The validator requires `age` to be a non-negative int, but the collection is created with `validationAction: "warn"`. So `insertOne({ name: "ok", age: -5 })` — which violates the schema — is ALLOWED anyway (a warning is written to the server log), and `findOne` returns it. This is the mechanism for introducing a validator to a live collection without breaking writes on day one.',
        explainHi: 'Validator `age` ko ek non-negative int hone ki zaroorat karता hai, par collection `validationAction: "warn"` se banaya jaता hai. To `insertOne({ name: "ok", age: -5 })` — jo schema violate karता hai — phir bhi ALLOWED hai (ek warning server log mein likha jaता hai), aur `findOne` ise return karता hai. Ye ek live collection ko ek validator introduce karने ka mechanism hai.',
      },
      {
        title: 'collMod adds a validator to an existing collection; new invalid writes are rejected',
        titleHi: 'collMod ek existing collection mein ek validator add karta hai',
        code: `await db.later.insertOne({ _id: 1, name: "preexisting" });
await db.command({
  collMod: "later",
  validator: { $jsonSchema: { bsonType: "object", required: ["name", "email"] } },
  validationLevel: "moderate",
});
print(await db.later.findOne({ _id: 1 }, { projection: { _id: 0 } }));
try { await db.later.insertOne({ _id: 2, name: "no email" }); } catch (e) { print("[ERROR] " + e.message); }`,
        output: `{"name":"preexisting"}
[ERROR] Document failed validation`,
        explain: '`collMod` attaches a validator to the `later` collection, which already contains `{ _id: 1, name: "preexisting" }` (no `email`). Existing documents are NOT retroactively checked — the pre-existing doc is still readable. But NEW writes ARE checked: inserting `{ _id: 2, name: "no email" }`, which lacks the now-required `email`, is rejected with `Document failed validation`.',
        explainHi: '`collMod` `later` collection mein ek validator attach karता hai, jismein pehle se `{ _id: 1, name: "preexisting" }` hai (koi `email` nahi). Existing documents retroactively checked NAHI hote — pre-existing doc abhi bhi readable hai. Par NAYE writes checked HAIN: `{ _id: 2, name: "no email" }` insert karna, jismein ab-required `email` nahi hai, `Document failed validation` ke saath reject hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// adding a strict "error" validator to a live collection that has bad data
await db.command({
  collMod: "users",
  validator: { $jsonSchema: { required: ["email", "createdAt"] } },
  // validationLevel defaults to "strict", validationAction to "error"
});
// now every update to a pre-existing user MISSING createdAt fails validation --
// including the migration you were about to run to backfill createdAt`,
        right: `// roll it out gradually:
await db.command({
  collMod: "users",
  validator: { $jsonSchema: { required: ["email", "createdAt"] } },
  validationLevel: "moderate",   // only validate updates to docs that already pass
  validationAction: "warn",      // and just log violations, don't reject
});
// -- backfill the missing fields, watch the log go quiet, THEN tighten to
//    validationLevel "strict" + validationAction "error"`,
        why: 'Applying a validator with the default strict level and error action to a collection that already contains documents not satisfying the new schema does not retroactively reject those documents, but it does immediately begin rejecting any update to them, because a strict-level update is validated against the full new schema regardless of whether the document previously passed. This blocks routine writes to existing invalid documents and, critically, can block the very migration intended to fix them, since that migration issues updates to those documents. The safe rollout uses the moderate validation level, which only validates updates to documents that already satisfy the schema and leaves updates to non-conforming documents unvalidated so they can be repaired, combined initially with the warn action, which permits violating writes while logging them so the extent of the problem becomes visible. Once the offending code paths are fixed and the log is quiet, the level and action are tightened to strict and error.',
        whyHi: 'Default strict level aur error action waale ek validator ko ek collection par apply karna jismein pehle se documents hain jo naye schema ko satisfy nahi karते un documents ko retroactively reject nahi karता, par ye turant unke kisī bhi update ko reject karना shuru kar deता hai. Ye existing invalid documents ke routine writes block karता hai aur, critically, wo migration bhi block kar sakta hai jo unhe fix karने ke liye hai. Safe rollout moderate validation level istemal karता hai, initially warn action ke saath combined.',
      },
      {
        wrong: `// using JSON Schema "type" instead of "bsonType", losing the int/double distinction
{ $jsonSchema: { properties: { count: { type: "number" } } } }
// "type: number" accepts an integer OR a floating-point double interchangeably --
// so a field that should always be a whole count can be stored as 3.7`,
        right: `{ $jsonSchema: { properties: { count: { bsonType: "int" } } } }
// bsonType: "int" requires a 32-bit integer specifically -- 3.7 is rejected,
// "5" (a string) is rejected, and a double 5.0 is rejected`,
        why: 'The JSON Schema standard has a single number type that does not distinguish between integers and floating-point values, and MongoDB\'s validator supports that type keyword for compatibility, but BSON has distinct types for a 32-bit integer, a 64-bit integer, and a double. Using type number in a validator therefore accepts any numeric value regardless of whether it is a whole number or has a fractional part, which is too loose for a field that is semantically a count or an identifier and should never hold a fractional value. The bsonType keyword lets the validator require a specific BSON type, so bsonType int enforces a 32-bit integer and rejects both fractional numbers and values of other types like a numeric string. For a MongoDB validator, bsonType is almost always the right choice over type because it matches the precision of BSON\'s own type system.',
        whyHi: 'JSON Schema standard mein ek single `number` type hai jo integers aur floating-point values ke beech distinguish nahi karता, par BSON ke paas ek 32-bit integer, ek 64-bit integer, aur ek double ke liye distinct types hain. Ek validator mein `type: number` istemal karна isliye kisī bhi numeric value ko accept karता hai chahe ye ek whole number ho ya nahi. `bsonType` keyword validator ko ek specific BSON type require karने deता hai.',
      },
      {
        wrong: `// treating the validator as the ONLY line of defense and skipping app-level checks
// -- the validator rejects a bad document with a terse "Document failed validation",
//    which surfaces to the user as an opaque 500 error with no field-level detail`,
        right: `// validate in the application FIRST (clear, field-level error messages for the
// user), and keep the DB validator as the SAFETY NET that catches anything the
// app missed or any write from another client / a manual fix / a script:
if (!body.email) return res.status(400).json({ error: "email is required" });
// ... then the insert, and if the DB validator ever fires, that's a bug to fix`,
        why: 'A database validator is a last line of defense that guarantees no document violating the schema is ever stored, regardless of which application, script, or manual operation issued the write, which is valuable precisely because not all writes go through one well-behaved code path. However, when the validator is the only check, a bad input reaches the database before it is caught, and the resulting error is deliberately terse, reporting only that validation failed without identifying which field or constraint was violated, so it cannot be turned into a helpful message for the user. Validating in the application layer first produces specific, actionable error messages tied to individual fields and rejects bad input before it ever reaches the database. The two layers are complementary: the application check provides good user experience for the normal path, and the database validator provides the guarantee that covers every path, so a validator firing in production indicates an application-level gap to close rather than being the intended way violations are reported.',
        whyHi: 'Ek database validator defense ki ek last line hai jo guarantee karता hai ki koi document jo schema violate karता hai kabhi store nahi hota, chahe kaunसी application ya script ne write issue kiya. Halाnki, jab validator ekmatra check hai, ek bad input database tak pahunचता hai isse pehle ki ye caught ho, aur resulting error deliberately terse hai. Application layer mein pehle validate karna specific, actionable error messages produce karता hai. Do layers complementary hain.',
      },
    ],

    realWorld: [
      {
        en: '**A `$jsonSchema` validator on a `payments` collection requiring `amount` (`bsonType: "decimal"`, `minimum: 0`), `currency` (an `enum`), and `status`** — no code path, script, or manual fix can ever write a payment record missing a required field or with a negative amount.',
        hi: '**Ek `payments` collection par ek `$jsonSchema` validator jo `amount`, `currency`, aur `status` require karta hai** — koi code path ek payment record galat nahi likh sakta.',
      },
      {
        en: '**Rolling a validator onto a 5-year-old `users` collection with `validationLevel: "moderate"` + `validationAction: "warn"`** — two weeks of log-watching, three code fixes, a backfill migration, then a flip to strict/error.',
        hi: '**Ek 5-saal purani `users` collection par ek validator `validationLevel: "moderate"` + `validationAction: "warn"` ke saath roll karna** — do hafte log-watching, phir strict/error mein flip.',
      },
      {
        en: '**A team standard: application-layer validation for user-facing error messages, plus a matching `$jsonSchema` validator as the enforced backstop** — a validator error in production is treated as a bug ticket.',
        hi: '**Ek team standard: user-facing error messages ke liye application-layer validation, plus ek matching `$jsonSchema` validator enforced backstop ke roop mein**.',
      },
    ],

    interviewQA: [
      {
        q: 'How does $jsonSchema validation work in MongoDB, and what do validationAction and validationLevel control?',
        qHi: 'MongoDB mein `$jsonSchema` validation kaise kaam karता hai, aur `validationAction` aur `validationLevel` kya control karते hain?',
        a: 'A validator is a condition, expressed as a query, that a document must satisfy to be written to a collection, and $jsonSchema is the expressive form of writing one, using a subset of the JSON Schema standard adapted for BSON. Within it, required lists fields that must be present, properties gives a per-field sub-schema that can specify a bsonType and constraints like minimum, maximum, minLength, pattern, and enum, nested properties validate embedded objects, items validates array elements, and additionalProperties controls whether fields not listed are allowed. A document that fails the schema is rejected with a Document failed validation error. validationAction controls what happens on a violation: the default error rejects the write, while warn allows the write to proceed but records a warning in the server log, which is used to introduce a validator to an existing collection without immediately breaking writes. validationLevel controls which writes are checked: the default strict validates every insert and every update, while moderate validates inserts and only those updates targeting documents that already satisfy the schema, leaving updates to non-conforming documents unvalidated so they can be repaired, and off disables validation. Adding a validator with collMod does not retroactively check existing documents; it only applies to writes from that point forward.',
        aHi: 'Ek validator ek condition hai, ek query ke roop mein express ki gayi, jise ek document ek collection mein likhе jaane ke liye satisfy karना chahiye, aur `$jsonSchema` ise likhने ka expressive form hai. Iske andar, `required` fields list karता hai jo maujood hone chahiye, `properties` ek per-field sub-schema deta hai. Ek document jo schema fail karता hai ek `Document failed validation` error ke saath reject hota hai. `validationAction` control karता hai ki ek violation par kya hota hai: default `error` write reject karता hai, `warn` write proceed hone deта hai par ek warning log karता hai. `validationLevel` control karता hai kaunse writes checked hote hain: default `strict`, `moderate` (sirf un updates jo pehle se pass karте hain), `off`.',
      },
      {
        q: 'What is the safe way to add a schema validator to an existing production collection, and why is the database validator not a substitute for application-level validation?',
        qHi: 'Ek existing production collection mein ek schema validator add karने ka safe tarika kya hai, aur database validator application-level validation ka substitute kyun nahi hai?',
        a: 'The safe rollout combines the moderate validation level with the warn validation action initially. Adding a validator does not retroactively check documents already in the collection, but with the default strict level it does begin validating every update, so an update to a pre-existing document that lacks a newly required field would fail, including the migration meant to backfill that field. The moderate level avoids this by validating only updates to documents that already conform, leaving non-conforming documents freely updatable so they can be fixed. The warn action permits violating writes while logging them, making the true extent of non-conforming data and code paths visible without breaking anything. After the offending writes are fixed, the missing data is backfilled, and the log goes quiet, the level and action are tightened to strict and error. As for why the validator does not replace application validation, the validator produces a deliberately terse error that only states validation failed without identifying the field or constraint, so it cannot be turned into a useful message for a user, and by the time it fires the bad input has already traversed the whole application. Application-layer validation catches bad input early with specific, field-level messages. The database validator is the backstop that guarantees no violating document is stored regardless of which client or script wrote it, so a validator error in production signals an application gap rather than being the normal reporting path.',
        aHi: 'Safe rollout moderate validation level ko warn validation action ke saath initially combine karता hai. Ek validator add karना collection mein pehle se documents ko retroactively check nahi karता, par default strict level ke saath ye har update validate karना shuru karता hai. Moderate level ise avoid karता hai sirf un documents ke updates validate karके jo pehle se conform karते hain. Warn action violating writes ko permit karता hai jabki unhe log karता hai. Jahaan tak validator application validation ko replace kyun nahi karता, validator ek deliberately terse error produce karता hai. Application-layer validation bad input ko jaldi catch karता hai specific, field-level messages ke saath.',
      },
    ],

    exercises: [
      {
        task: 'Create a `products` collection with a `$jsonSchema` validator requiring `name` and `price`, with `price` being `bsonType: "number", minimum: 0`. Insert a valid product, then attempt to insert one with `price: -5`. Confirm the second insert fails with `Document failed validation`.',
        taskHi: 'Ek `products` collection ek `$jsonSchema` validator ke saath banao jo `name` aur `price` require karta hai, `price` `bsonType: "number", minimum: 0` hone ke saath. Ek valid product insert karo, phir ek `price: -5` ke saath insert karne ki koshish karo.',
        hint: 'The validator is a condition every written document must satisfy. `minimum: 0` on `price` rejects `-5`; a missing `name` or `price` would also be rejected by `required`.',
        hintHi: 'Validator ek condition hai jise har likha gaya document satisfy karna chahiye. `price` par `minimum: 0` `-5` reject karta hai.',
      },
      {
        task: 'Create a collection with a validator requiring `name` and `age` (`bsonType: "int", minimum: 0`), but set `validationAction: "warn"`. Insert `{ name: "ok", age: -5 }` and confirm it is stored anyway (a `findOne` returns it). In a comment, explain when you\'d use `"warn"`.',
        taskHi: 'Ek collection ek validator ke saath banao jo `name` aur `age` require karta hai, par `validationAction: "warn"` set karo. `{ name: "ok", age: -5 }` insert karo aur confirm karo ye phir bhi stored hai.',
        hint: '`"warn"` allows violating writes and logs a warning instead of rejecting — the mechanism for introducing a validator to a collection that may already have (or still receive) non-conforming documents, without breaking on day one.',
        hintHi: '`"warn"` violating writes ko allow karta hai aur reject karne ke bजाy ek warning log karta hai.',
      },
      {
        task: 'Insert `{ _id: 1, name: "preexisting" }` into a `later` collection. Then use `db.command({ collMod: "later", validator: { $jsonSchema: { bsonType: "object", required: ["name", "email"] } }, validationLevel: "moderate" })`. Confirm the pre-existing doc is still readable, and a new insert of `{ _id: 2, name: "no email" }` is rejected.',
        taskHi: 'Ek `later` collection mein `{ _id: 1, name: "preexisting" }` insert karo. Phir `db.command({ collMod: ... })` istemal karo. Confirm karo pre-existing doc abhi bhi readable hai, aur `{ _id: 2, name: "no email" }` ka ek naya insert reject hota hai.',
        hint: '`collMod` attaches a validator to a collection that already has data. Existing documents are NOT retroactively checked — the pre-existing doc stays. New writes ARE checked, so the incomplete insert fails.',
        hintHi: '`collMod` ek collection mein ek validator attach karta hai jismein pehle se data hai. Existing documents retroactively checked NAHI hote.',
      },
    ],

    keyTakeaways: [
      'A flexible schema is NOT no schema. A `$jsonSchema` VALIDATOR (set at `createCollection` or later via `collMod`) enforces a document\'s shape at the DB level — the role a relational `CREATE TABLE` + constraints plays, applied to a document.',
      '`$jsonSchema` keywords: `bsonType` (require a specific BSON type — use this NOT JSON Schema\'s `type`, which can\'t tell `int` from `double`), `required` (fields that must be present), `properties` (per-field sub-schemas; nested `properties` for embedded objects, `items` for array elements), constraints (`minimum`/`maximum`/`minLength`/`pattern`/`enum`/...), `additionalProperties: false` (reject unlisted fields). A violation → `Document failed validation`.',
      '`validationAction`: `"error"` (default — reject the write) vs `"warn"` (ALLOW the write, log a warning — the mechanism to introduce a validator to a live collection without breaking day one).',
      '`validationLevel`: `"strict"` (default — all inserts AND updates) vs `"moderate"` (inserts, + updates only to docs that ALREADY pass — pre-existing invalid docs stay updatable so you can fix them) vs `"off"`.',
      '`collMod` adds/replaces a validator on an EXISTING collection — existing docs are NOT retroactively checked, only future writes. SAFE ROLLOUT: `validationLevel: "moderate"` + `validationAction: "warn"` → watch logs, fix bad code paths, backfill → then tighten to `"strict"` + `"error"`.',
      'Validate in the APP FIRST (specific, field-level error messages for users) + keep the DB validator as the enforced BACKSTOP (covers every client/script/manual write). A validator firing in production = an app-level gap to fix, not the intended error path.',
      'PART III COMPLETE (MongoDB): document model → data modeling → aggregation & indexes → operations & distribution. Atlas adds Search, Triggers, Data Federation, PITR backup. PART IV: Firebase (Firestore + Realtime Database).',
    ],
    keyTakeawaysHi: [
      'Ek flexible schema KOI schema NAHI hai aisा nahi. Ek `$jsonSchema` VALIDATOR ek document ki shape DB level par enforce karता hai.',
      '`$jsonSchema` keywords: `bsonType` (ek specific BSON type require karो — YE istemal karो, JSON Schema ka `type` nahi), `required`, `properties`, constraints (`minimum`/`maximum`/`pattern`/`enum`), `additionalProperties: false`. Ek violation → `Document failed validation`.',
      '`validationAction`: `"error"` (default — write reject) vs `"warn"` (write ALLOW karो, ek warning log karो).',
      '`validationLevel`: `"strict"` (default — saare inserts AUR updates) vs `"moderate"` (inserts, + sirf un docs ke updates jo PEHLE SE pass karте hain) vs `"off"`.',
      '`collMod` ek EXISTING collection par ek validator add karता hai — existing docs retroactively checked NAHI hote. SAFE ROLLOUT: `"moderate"` + `"warn"` → logs watch karो, fix karो → phir `"strict"` + `"error"` mein tighten karो.',
      'APP mein PEHLE validate karो + DB validator ko enforced BACKSTOP ke roop mein rakhो. Production mein ek validator firing = ek app-level gap fix karने ke liye.',
      'PART III COMPLETE (MongoDB). PART IV: Firebase (Firestore + Realtime Database).',
    ],
  },
];
