/**
 * Databases Complete Course — Module 16: MongoDB Operations & Distribution, lessons 1-3.
 * Last module of Part III.
 *
 * Lesson 1: Replica sets — members, elections, the oplog, and automatic failover.
 * Lesson 2: Read preference & read/write concern — where reads go, how durable a
 *           write must be, what a read is allowed to see, and causal consistency.
 * Lesson 3: Sessions & multi-document transactions — ACID across documents, when
 *           you genuinely need them, and what they cost.
 *
 * Verified against a real in-memory MongoDB REPLICA SET (mongodb-memory-server).
 * Run: node verify-mongo-rs.mjs 16
 *
 * NOTE: examples in this module get `client` in scope (the MongoClient) in addition
 * to `db`, `print`, and `ObjectId` — transactions and admin commands need it.
 */

import type { CourseLesson } from './course-js-module1';

export const MONGO_MODULE_16: CourseLesson[] = [
  {
    slug: 'mongo-replica-sets',
    title: 'Replica Sets',
    titleHi: 'Replica Sets',
    description: 'A replica set is a group of MongoDB servers holding the same data: one primary that takes all writes, and secondaries that copy the primary\'s operation log and stay in sync. If the primary fails, the secondaries elect a new one automatically — this is how MongoDB survives a server going down.',
    descriptionHi: 'Ek replica set MongoDB servers ka ek group hai jo wahi data rakhते hain: ek primary jo saare writes leता hai, aur secondaries jo primary ke operation log ko copy karते hain aur sync mein rehते hain. Agar primary fail hota hai, secondaries automatically ek naya elect karते hain — MongoDB ek server neeche jaane se aise survive karता hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A head chef who calls out every action, and two line cooks writing down every call in identical notebooks — so if the head chef walks out mid-service, a line cook picks up the exact same notebook and takes over.** The head chef is the primary: every order, every change, goes through them. The line cooks are secondaries: they do not invent anything, they just replay the head chef\'s called-out actions into their own notebooks, staying a beat behind but otherwise identical. That stream of called-out actions is the **oplog** — a replayable log of every write. If the head chef collapses, the cooks quickly agree among themselves who takes over (an **election**), and because that cook\'s notebook already contains every action up to the last moment, service continues with barely a pause. Three people in the kitchen, not two, so that if one is out the remaining two can still form a majority and agree on a decision.',
      hi: '**Ek head chef jo har action call karता hai, aur do line cooks jo identical notebooks mein har call likhते hain — to agar head chef mid-service chala jaता hai, ek line cook wahi exact notebook uthाता hai aur take over karता hai.** Head chef primary hai: har order, har change, unke through jाता hai. Line cooks secondaries hain: wo kुछ invent nahi karते, wo bas head chef ke called-out actions ko apni notebooks mein replay karते hain, ek beat peeche rehते hue par warna identical. Wo called-out actions ki stream **oplog** hai — har write ka ek replayable log. Agar head chef collapse hota hai, cooks jaldi aapस mein tay karते hain kaun take over karega (ek **election**). Kitchen mein teen log, do nahi, taaki agar ek out hai to baaki do abhi bhi ek majority bana sakें.',
    },

    simple: `**A REPLICA SET = several servers, same data. ONE primary (all writes), N secondaries (copies).**

\`\`\`
   client writes ---> [ PRIMARY ] ---oplog---> [ SECONDARY ]
                          |         ---oplog---> [ SECONDARY ]
   client reads  --------/  (reads go to the primary by default)
\`\`\`

**THE OPLOG: a capped, replayable log of every write. Secondaries tail it to stay in sync.**

\`\`\`js
// every insert/update/delete on the primary is recorded in local.oplog.rs as an
// operation a secondary can replay to reproduce the exact same state
{ op: "i", ns: "learn.orders", o: { _id: 1, ... } }   // an insert
{ op: "u", ns: "learn.orders", o: { ...the change... } }  // an update
\`\`\`

**ELECTION: if the primary becomes unreachable, the remaining members VOTE a new primary
(usually within seconds). Writes pause briefly, then resume against the new primary.**

**WHY 3 MEMBERS (not 2): an election needs a MAJORITY. With 2 members, losing 1 leaves 1 --
which can't be a majority of 2, so no new primary is elected and writes stop. With 3,
losing 1 leaves 2 = a majority.** (A cheap "arbiter" member can vote but holds no data.)

**A replica set is the MINIMUM production topology.** A standalone \`mongod\` has no
failover, no oplog-based recovery, and can't do transactions or change streams.`,

    simpleHi: `**Ek REPLICA SET = kई servers, wahi data. EK primary (saare writes), N secondaries (copies).**

\`\`\`
   client writes ---> [ PRIMARY ] ---oplog---> [ SECONDARY ]
                          |         ---oplog---> [ SECONDARY ]
   client reads  --------/  (reads default se primary ko jaते hain)
\`\`\`

**OPLOG: har write ka ek capped, replayable log. Secondaries ise tail karते hain sync mein rehne ko.**

\`\`\`js
{ op: "i", ns: "learn.orders", o: { _id: 1, ... } }   // ek insert
{ op: "u", ns: "learn.orders", o: { ...change... } }  // ek update
\`\`\`

**ELECTION: agar primary unreachable ho jaता hai, baaki members ek naya primary VOTE karते hain
(usually seconds ke andar). Writes briefly pause karते hain, phir naye primary ke against resume.**

**3 MEMBERS KYUN (2 nahi): ek election ko ek MAJORITY chahiye. 2 members ke saath, 1 khोna 1 chhoड़ता hai --
jo 2 ka majority nahi ho sakта, to koi naya primary elect nahi hota aur writes ruk jaते hain. 3 ke saath,
1 khोna 2 chhoड़ता hai = ek majority.** (Ek sasta "arbiter" member vote kar sakta hai par data nahi rakhता.)

**Ek replica set MINIMUM production topology hai.** Ek standalone \`mongod\` mein koi failover nahi,
koi oplog-based recovery nahi, aur transactions ya change streams nahi kar sakта.`,

    content: `## What a replica set is

A **replica set** is a group of \`mongod\` processes that maintain the same data set:

- Exactly one member is the **primary**. All writes go to the primary. By default, all reads also go to the primary.
- The other members are **secondaries**. Each secondary continuously copies the primary's writes and applies them to its own copy of the data, staying (nearly) in sync.

A client connects to the *set*, not to a specific server; the driver discovers the members and always routes writes to whichever one is currently primary.

## The oplog

The mechanism that keeps secondaries in sync is the **oplog** (operations log): a special capped collection (\`local.oplog.rs\`) on the primary in which every write is recorded as a single, **idempotent, replayable operation**.

\`\`\`js
{ op: "i", ns: "learn.orders", o: { _id: 1, item: "widget" } }   // insert
{ op: "u", ns: "learn.orders", o: { /* the diff */ }, o2: { _id: 1 } }  // update
{ op: "d", ns: "learn.orders", o: { _id: 1 } }   // delete
\`\`\`

Each secondary "tails" the primary's oplog — reads new entries as they appear — and applies each one to reach the same state. Because oplog entries are idempotent (applying \`op: "u"\` with a specific change produces the same result whether applied once or twice), a secondary that falls behind and catches up, or replays entries after a restart, converges correctly. The oplog is also what powers **point-in-time recovery**, **change streams** (Lesson 5), and the initial sync of a new member.

The oplog is *capped* — fixed size, oldest entries overwritten. If a secondary is offline longer than the oplog window (the time span the oplog covers), it can no longer catch up incrementally and must do a full resync.

## Elections and failover

If the primary becomes unreachable — crash, network partition, maintenance — the remaining members **hold an election**: they communicate, compare how up-to-date each one's data is, and vote for a new primary. A member can only become primary with votes from a **majority** of the set's voting members. The election typically completes in a few seconds; during it, writes fail (there is no primary to accept them), and then resume automatically once a new primary is chosen. Well-built application code retries a write that fails during a failover.

## Why an odd number, and at least three

Elections require a **strict majority** of votes. This is why a replica set should have an **odd number** of voting members, and at least **three**:

- **Two members**: if one fails, the survivor sees only itself — one vote out of two is not a majority — so it cannot become (or stay) primary, and the set has *no* primary and accepts *no writes*. A two-member set has no fault tolerance.
- **Three members**: if one fails, the other two form a majority (2 of 3) and can elect a primary. The set tolerates one member down.

A third member that only needs to vote (not serve data) can be a lightweight **arbiter** — a \`mongod\` that participates in elections but stores no data. Arbiters are a way to get majority voting on a two-data-node budget, though a full third data-bearing member is generally preferred.

## Why this is the production baseline

A single \`mongod\` (a "standalone") has none of this: if it goes down, the database is down until someone restores it; a disk failure can lose data with no replica to fall back on. It also **cannot** run multi-document transactions (Lesson 3) or serve change streams (Lesson 5), both of which require the oplog infrastructure. A replica set — three members, spread across failure domains — is the minimum sensible production deployment.`,

    contentHi: `## Ek replica set kya hai

Ek **replica set** \`mongod\` processes ka ek group hai jo wahi data set maintain karते hain:

- Theek ek member **primary** hai. Saare writes primary ko jaते hain. Default se, saare reads bhi primary ko jaते hain.
- Baaki members **secondaries** hain. Har secondary continuously primary ke writes copy karता hai.

Ek client *set* se connect karता hai, ek specific server se nahi.

## Oplog

Wo mechanism jo secondaries ko sync mein rakhता hai **oplog** hai (operations log): primary par ek special capped collection (\`local.oplog.rs\`) jismein har write ek single, **idempotent, replayable operation** ke roop mein record hota hai.

\`\`\`js
{ op: "i", ns: "learn.orders", o: { _id: 1, item: "widget" } }   // insert
{ op: "u", ns: "learn.orders", o: { /* diff */ }, o2: { _id: 1 } }  // update
\`\`\`

Har secondary primary ke oplog ko "tail" karता hai. Oplog point-in-time recovery, change streams (Lesson 5), aur ek naye member ke initial sync ko bhi power karта hai. Oplog *capped* hai — fixed size, oldest entries overwritten.

## Elections aur failover

Agar primary unreachable ho jाता hai, baaki members **ek election hold karते hain**. Ek member sirf set ke voting members ki ek **majority** se votes ke saath primary ban sakta hai. Election usually кुछ seconds mein complete hota hai.

## Ek odd number kyun, aur kam se kam teen

Elections ko ek **strict majority** votes chahiye:

- **Do members**: agar ek fail hota hai, survivor sirf khud ko dekhता hai — 2 mein se 1 vote majority nahi hai — to ye primary nahi ban sakta, aur set ke paas *koi* primary nahi aur *koi writes* accept nahi.
- **Teen members**: agar ek fail hota hai, baaki do ek majority banाते hain (3 mein se 2).

Ek teesरा member jise sirf vote karना hai ek lightweight **arbiter** ho sakta hai.

## Ye production baseline kyun hai

Ek single \`mongod\` mein ye kुछ nahi: agar ye neeche jाता hai, database neeche hai. Ye multi-document transactions (Lesson 3) ya change streams (Lesson 5) **nahi** chala sakta. Ek replica set — teen members — minimum sensible production deployment hai.`,

    examples: [
      {
        title: 'replSetGetStatus shows the member is a PRIMARY in a replica set',
        titleHi: 'replSetGetStatus dikhata hai member ek replica set mein ek PRIMARY hai',
        code: `const st = await client.db("admin").command({ replSetGetStatus: 1 });
print({ memberCount: st.members.length, state: st.members[0].stateStr });`,
        output: `{"memberCount":1,"state":"PRIMARY"}`,
        explain: '`replSetGetStatus` (run against the `admin` database) reports the replica set\'s membership. Here there is one member, and its `stateStr` is `"PRIMARY"` — the member that takes all writes. A production set would show three members: one PRIMARY and two SECONDARY.',
        explainHi: '`replSetGetStatus` (`admin` database ke against chalaya gaya) replica set ki membership report karta hai. Yahaan ek member hai, aur iska `stateStr` `"PRIMARY"` hai — wo member jo saare writes leता hai. Ek production set teen members dikhata: ek PRIMARY aur do SECONDARY.',
      },
      {
        title: 'The oplog records every write as a replayable operation',
        titleHi: 'Oplog har write ko ek replayable operation ke roop mein record karta hai',
        code: `await db.orders.insertOne({ _id: 1, item: "widget" });
const op = await client.db("local").collection("oplog.rs")
  .find({ op: "i", ns: "learn.orders" }).sort({ ts: -1 }).limit(1).toArray();
print({ op: op[0].op, ns: op[0].ns, o: op[0].o });`,
        output: `{"op":"i","ns":"learn.orders","o":{"_id":1,"item":"widget"}}`,
        explain: 'The `insertOne` on the primary is recorded in `local.oplog.rs` as an operation with `op: "i"` (insert), the namespace `ns: "learn.orders"`, and `o` holding the exact inserted document. Secondaries tail this oplog and replay each entry to reproduce the primary\'s state.',
        explainHi: 'Primary par `insertOne` `local.oplog.rs` mein ek operation ke roop mein record hota hai `op: "i"` (insert), namespace `ns: "learn.orders"`, aur `o` theek insert kiya gaya document rakhте hue. Secondaries is oplog ko tail karते hain aur har entry replay karके primary ki state reproduce karते hain.',
      },
      {
        title: 'An update is also recorded in the oplog, as an "u" operation',
        titleHi: 'Ek update bhi oplog mein record hota hai, ek "u" operation ke roop mein',
        code: `await db.orders.insertOne({ _id: 1, status: "new" });
await db.orders.updateOne({ _id: 1 }, { $set: { status: "shipped" } });
const op = await client.db("local").collection("oplog.rs")
  .find({ op: "u", ns: "learn.orders" }).sort({ ts: -1 }).limit(1).toArray();
print({ op: op[0].op, ns: op[0].ns });`,
        output: `{"op":"u","ns":"learn.orders"}`,
        explain: 'The update is recorded as a separate oplog entry with `op: "u"` (deletes are `op: "d"`), namespace `ns: "learn.orders"`. Every write — insert, update, delete — becomes one idempotent, replayable oplog operation, which is what lets a secondary converge to the primary\'s exact state.',
        explainHi: 'Update ek alag oplog entry ke roop mein record hota hai `op: "u"` ke saath (deletes `op: "d"` hain), namespace `ns: "learn.orders"`. Har write — insert, update, delete — ek idempotent, replayable oplog operation ban jaता hai, jo hai jo ek secondary ko primary ki exact state par converge hone deता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// running production on a standalone mongod "because it's simpler"
// mongod --dbpath /data/db     (one process, no replica set)
// -- a crash or disk failure means downtime or data loss with no fallback,
// -- and transactions and change streams simply don't work`,
        right: `// run a replica set with at least three members across failure domains:
// mongod --replSet rs0 ...   x3 (different hosts / availability zones)
// then rs.initiate(...) to form the set
// -- one member can fail with automatic failover, and the full feature set works`,
        why: 'A standalone mongod has a single copy of the data and a single point of failure: if the process crashes, the host dies, or the disk fails, the database is unavailable until it is manually restored, and in the disk-failure case data written since the last backup is simply gone because there is no second copy. A replica set keeps the same data on multiple servers that stay synchronized through the oplog, so the loss of one member triggers an automatic election of a new primary and service continues, and no single disk failure loses committed data. Beyond availability, several MongoDB features depend on the replica set infrastructure and are unavailable on a standalone: multi-document transactions require the oplog and the majority-commit machinery, and change streams are built directly on top of the oplog. Running production on a standalone therefore forgoes both fault tolerance and a meaningful part of the database\'s functionality.',
        whyHi: 'Ek standalone \`mongod\` ke paas data ki ek single copy aur ek single point of failure hai: agar process crash hota hai, ya disk fail hoती hai, database unavailable hai jab tak manually restore na ho, aur disk-failure case mein last backup ke baad likha gaya data bas chala jaता hai. Ek replica set wahi data multiple servers par rakhता hai jo oplog ke through synchronized rehते hain. Iske alावा, kई MongoDB features replica set infrastructure par depend karते hain: multi-document transactions aur change streams standalone par unavailable hain.',
      },
      {
        wrong: `// deploying a two-member replica set to "save a server"
// PRIMARY + one SECONDARY
// -- if EITHER fails, the survivor sees only 1 of 2 votes, which is not a
//    majority, so it steps down / can't be elected: the set has NO primary
//    and accepts NO writes until the failed member returns`,
        right: `// three voting members -- the set tolerates one being down:
// PRIMARY + SECONDARY + SECONDARY   (or PRIMARY + SECONDARY + ARBITER on a budget)
// -- losing one leaves two, which IS a majority of three, so an election succeeds`,
        why: 'An election requires a candidate to receive votes from a strict majority of the replica set\'s voting members, meaning more than half. In a two-member set, a majority is two, so if either member becomes unreachable the single survivor holds only one of the two votes and cannot reach a majority, which means it cannot be elected primary and, if it was the primary, must step down to avoid a split-brain scenario. The practical result is that a two-member set has no fault tolerance at all: the failure of either member halts all writes. A three-member set makes a majority two, so losing any one member still leaves two that can vote for a new primary, and the set continues operating. This is why replica sets should have an odd number of voting members and at least three; a lightweight arbiter can supply the third vote without the cost of a third full data-bearing server, though a real third member is generally better.',
        whyHi: 'Ek election ko ek candidate ko replica set ke voting members ki ek strict majority se votes chahiye. Ek two-member set mein, ek majority do hai, to agar koi bhi member unreachable ho jाता hai single survivor sirf do mein se ek vote rakhता hai aur majority tak nahi pahunch sakta. Ek two-member set mein koi fault tolerance bilkul nahi hai. Ek three-member set ek majority ko do banata hai, to koi ek member khोna abhi bhi do chhoड़ता hai.',
      },
      {
        wrong: `// letting a secondary fall so far behind that the oplog "rolls over" past it
// a secondary offline for a week; the oplog only covers 24 hours of writes
// -- when it comes back, the oldest changes it needs are already overwritten,
//    so it can't catch up incrementally and errors into a "recovering" state`,
        right: `// size the oplog for the longest realistic maintenance/outage window, and
// monitor secondary replication lag so a lagging member is noticed early:
// -- if a secondary does fall too far behind, a full resync (initial sync)
//    rebuilds it from scratch -- expensive but recoverable`,
        why: 'The oplog is a capped collection of fixed size, so once it fills, each new write overwrites the oldest entry, and the oplog therefore only retains writes going back a limited time window determined by its size and the write rate. A secondary stays synchronized by continuously applying oplog entries newer than the last one it processed, but if it is offline or lagging for longer than the oplog\'s retention window, the entries it still needs to apply have been overwritten, leaving a gap it cannot bridge incrementally. In that situation the secondary cannot resume normal replication and instead requires a full initial sync, copying the entire data set from another member, which is far more expensive than incremental catch-up. Avoiding this means sizing the oplog to comfortably exceed the longest expected period a secondary might be unavailable, whether for maintenance or an outage, and monitoring replication lag so a secondary drifting toward the edge of the window is addressed before it falls off.',
        whyHi: 'Oplog ek fixed size ka capped collection hai, to ek baar ye bhar jाता hai, har naya write oldest entry ko overwrite karता hai, aur oplog sirf ek limited time window tak writes retain karता hai. Ek secondary sync mein rehता hai continuously oplog entries apply karके, par agar ye oplog ke retention window se zyada der offline ya lagging hai, wo entries jinhe use apply karना hai overwrite ho chuki hain. Us situation mein secondary ko ek full initial sync chahiye. Isse bachने ka matlab oplog ko itna size karना ki wo sabse lambी expected period se comfortably exceed kare.',
      },
    ],

    realWorld: [
      {
        en: '**A three-member replica set spread across three availability zones** — an entire AZ can go dark and the two remaining members elect a primary and keep serving, with the application retrying the handful of writes that failed during the ~5-second election.',
        hi: '**Ek three-member replica set teen availability zones ke across** — ek poora AZ dark ho sakta hai aur baaki do members ek primary elect karके serving rakhते hain.',
      },
      {
        en: '**An oplog sized to ~72 hours of writes** — comfortably covering a long weekend maintenance window during which a secondary is taken offline, so it catches up incrementally on return instead of doing a full resync.',
        hi: '**Ek oplog ~72 hours ke writes ke liye sized** — ek long weekend maintenance window comfortably cover karता hai.',
      },
      {
        en: '**A monitoring alert on replication lag exceeding 10 seconds** — an early warning that a secondary is struggling to keep up, before it risks falling off the oplog window entirely.',
        hi: '**Replication lag 10 seconds se zyada hone par ek monitoring alert** — ek early warning ki ek secondary keep up karne mein struggle kar raha hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a replica set, what is the oplog, and how do secondaries stay in sync?',
        qHi: 'Ek replica set kya hai, oplog kya hai, aur secondaries sync mein kaise rehते hain?',
        a: 'A replica set is a group of MongoDB servers that all hold the same data. Exactly one member is the primary and receives all writes; by default it also serves all reads. The other members are secondaries, each maintaining its own full copy of the data. The oplog, short for operations log, is a special capped collection on the primary in which every write is recorded as a single idempotent, replayable operation, an insert, an update expressed as a diff, or a delete, each tagged with the namespace it applies to. Secondaries stay in sync by continuously tailing the primary\'s oplog: each one reads new oplog entries as they are written and applies them to its own data, reaching the same state as the primary a short time later. Because the operations are idempotent, a secondary that falls behind and catches up, or replays entries after a restart, still converges to the correct state. The oplog is capped, meaning it has a fixed size and the oldest entries are overwritten as new ones arrive, so a secondary that is offline longer than the time span the oplog covers can no longer catch up incrementally and must perform a full resync from another member.',
        aHi: 'Ek replica set MongoDB servers ka ek group hai jo sab wahi data rakhते hain. Theek ek member primary hai aur saare writes leता hai. Baaki members secondaries hain. Oplog, operations log, primary par ek special capped collection hai jismein har write ek single idempotent, replayable operation ke roop mein record hota hai. Secondaries sync mein rehते hain continuously primary ke oplog ko tail karके: har ek naye oplog entries padhता hai aur unhe apne data par apply karता hai. Oplog capped hai, matlab iska ek fixed size hai.',
      },
      {
        q: 'Why does a replica set need an odd number of members, and at least three?',
        qHi: 'Ek replica set ko ek odd number of members kyun chahiye, aur kam se kam teen?',
        a: 'Electing a primary requires a candidate to receive votes from a strict majority of the replica set\'s voting members, which is more than half. In a two-member set, a majority is both members, so if either one becomes unreachable the surviving member holds only one of two votes and cannot reach a majority; it therefore cannot be elected primary, and if it was the primary it must step down. The consequence is that a two-member set has no fault tolerance at all, because losing either member halts all writes until the failed member returns. Adding a third voting member makes a majority two out of three, so the failure of any single member still leaves two members that can together form a majority and elect a primary, and the set keeps operating. This is why replica sets are configured with an odd number of voting members and at least three: an odd count avoids the possibility of a tied vote, and three is the minimum that provides tolerance for one member being down. If the budget does not allow a third full data-bearing server, a lightweight arbiter member can provide the third vote while storing no data, though a real third member is generally preferred.',
        aHi: 'Ek primary elect karne ke liye ek candidate ko replica set ke voting members ki ek strict majority se votes chahiye. Ek two-member set mein, ek majority dono members hain, to agar koi bhi unreachable ho jaता hai surviving member sirf do mein se ek vote rakhता hai. Iska consequence ye hai ki ek two-member set mein koi fault tolerance nahi hai. Ek teesरा voting member add karna ek majority ko teen mein se do banata hai. Agar budget ek teesरा full data-bearing server allow nahi karता, ek lightweight arbiter member teesरा vote de sakta hai jabki koi data store nahi karता.',
      },
    ],

    exercises: [
      {
        task: 'Run `client.db("admin").command({ replSetGetStatus: 1 })` and print `members.length` and `members[0].stateStr`. Confirm the member count and that the first member\'s state is `"PRIMARY"`.',
        taskHi: '`client.db("admin").command({ replSetGetStatus: 1 })` chalao aur `members.length` aur `members[0].stateStr` print karo. Confirm karo member count aur ki pehle member ka state `"PRIMARY"` hai.',
        hint: 'A client is always connected to a replica set (not a bare server) in a production-shaped MongoDB. `replSetGetStatus` (against the `admin` database) reports the set\'s membership and each member\'s current state.',
        hintHi: 'Ek client hamesha ek replica set se connected hota hai. `replSetGetStatus` (`admin` database ke against) set ki membership aur har member ka state report karta hai.',
      },
      {
        task: 'Insert `{ _id: 1, item: "widget" }` into an `orders` collection. Then query `client.db("local").collection("oplog.rs")` for `{ op: "i", ns: "learn.orders" }`, sorted by `ts` descending, limit 1. Confirm the oplog entry\'s `o` field is the exact document you inserted.',
        taskHi: 'Ek `orders` collection mein `{ _id: 1, item: "widget" }` insert karo. Phir `client.db("local").collection("oplog.rs")` ko `{ op: "i", ns: "learn.orders" }` ke liye query karo. Confirm karo oplog entry ka `o` field theek wo document hai jo aapne insert kiya.',
        hint: 'Every write on the primary is recorded in `local.oplog.rs` as a replayable operation — `op: "i"` for insert, with `ns` (namespace) and `o` (the operation payload). This is what secondaries tail.',
        hintHi: 'Primary par har write `local.oplog.rs` mein ek replayable operation ke roop mein record hota hai — insert ke liye `op: "i"`.',
      },
      {
        task: 'Insert a document, then `updateOne` it with `$set`. Query the oplog for `{ op: "u", ns: "learn.orders" }` (limit 1, newest first) and confirm the operation type recorded is `"u"` and the namespace is `"learn.orders"`.',
        taskHi: 'Ek document insert karo, phir ise `$set` ke saath `updateOne` karo. Oplog ko `{ op: "u", ns: "learn.orders" }` ke liye query karo aur confirm karo recorded operation type `"u"` hai.',
        hint: 'Updates are recorded as `op: "u"` oplog entries (deletes as `op: "d"`). A secondary replays each entry in order to reproduce the primary\'s exact state.',
        hintHi: 'Updates `op: "u"` oplog entries ke roop mein record hote hain (deletes `op: "d"` ke roop mein).',
      },
    ],

    keyTakeaways: [
      'A REPLICA SET = several `mongod` servers holding the SAME data: exactly ONE PRIMARY (takes all writes, and all reads by default) + N SECONDARIES (each keeps a full synced copy). A client connects to the SET; the driver routes writes to whichever member is currently primary.',
      'THE OPLOG (`local.oplog.rs`): a CAPPED collection on the primary recording every write as ONE idempotent, replayable operation (`op: "i"`/`"u"`/`"d"` + namespace + payload). Secondaries "TAIL" it — read new entries and apply them to converge. Idempotency means a lagging or restarting secondary still converges correctly.',
      'The oplog also powers POINT-IN-TIME RECOVERY, CHANGE STREAMS (Lesson 5), and a new member\'s initial sync. It\'s CAPPED — if a secondary is offline longer than the oplog\'s time window, the entries it needs are overwritten and it must do a FULL RESYNC. Size the oplog for the longest realistic outage; monitor replication lag.',
      'ELECTION: if the primary becomes unreachable, remaining members VOTE a new primary (~seconds). A member needs votes from a MAJORITY of voting members to become primary. Writes fail during the election, then resume — well-built app code RETRIES writes that fail during a failover.',
      'WHY ODD, AT LEAST 3: an election needs a strict MAJORITY. TWO members → losing one leaves 1 of 2 (not a majority) → NO primary, NO writes: zero fault tolerance. THREE → losing one leaves 2 of 3 (a majority) → election succeeds, set keeps running. A lightweight ARBITER can supply a vote without storing data (budget option; a real member is better).',
      'A replica set is the MINIMUM sensible production topology. A standalone `mongod` has NO failover, NO oplog recovery, and CANNOT run multi-doc transactions (Lesson 3) or change streams (Lesson 5).',
    ],
    keyTakeawaysHi: [
      'Ek REPLICA SET = kई `mongod` servers jo WAHI data rakhते hain: theek EK PRIMARY (saare writes, aur default se saare reads) + N SECONDARIES (har ek ek full synced copy rakhता hai). Ek client SET se connect karता hai.',
      'OPLOG (`local.oplog.rs`): primary par ek CAPPED collection jo har write ko EK idempotent, replayable operation ke roop mein record karता hai. Secondaries ise "TAIL" karते hain — naye entries padhते hain aur apply karके converge karते hain.',
      'Oplog POINT-IN-TIME RECOVERY, CHANGE STREAMS (Lesson 5), aur ek naye member ke initial sync ko bhi power karता hai. Ye CAPPED hai — agar ek secondary oplog ke time window se zyada der offline hai, ise ek FULL RESYNC karना paता hai.',
      'ELECTION: agar primary unreachable ho jाता hai, baaki members ek naya primary VOTE karते hain (~seconds). Ek member ko primary banне ke liye voting members ki ek MAJORITY se votes chahiye. App code failover ke dauран fail hoते writes RETRY karta hai.',
      'ODD KYUN, KAM SE KAM 3: ek election ko ek strict MAJORITY chahiye. DO members → ek khोna 2 mein se 1 chhoड़ता hai (majority nahi) → KOI primary nahi, KOI writes nahi. TEEN → ek khोna 3 mein se 2 chhoड़ता hai (ek majority) → election succeed hota hai.',
      'Ek replica set MINIMUM sensible production topology hai. Ek standalone `mongod` mein KOI failover nahi, KOI oplog recovery nahi, aur multi-doc transactions ya change streams NAHI chala sakta.',
    ],
  },

  {
    slug: 'mongo-read-preference-and-concerns',
    title: 'Read Preference & Read/Write Concern',
    titleHi: 'Read Preference Aur Read/Write Concern',
    description: 'Three independent knobs control the consistency-vs-availability trade-off: read preference (which member a read goes to), write concern (how many members must acknowledge a write before it is "done"), and read concern (what a read is allowed to see).',
    descriptionHi: 'Teen independent knobs consistency-vs-availability trade-off control karте hain: read preference (ek read kaunse member ko jाता hai), write concern (ek write ke "done" hone se pehle кितne members ko acknowledge karna chahiye), aur read concern (ek read kya dekhने ki ijaазат hai).',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Sending a legal document by courier: you choose which office to deliver it to (read preference), how many signatures you need back before you consider it "filed" (write concern), and whether the clerk you ask is allowed to quote you a draft or only the finalized, countersigned version (read concern).** Delivering to the head office (primary) is always current; delivering to a branch (secondary) is faster and closer but might be working from yesterday\'s file. Requiring one signature (w:1) is quick but the document could still be lost if that one office burns down before it copies the file onward; requiring a majority of offices to sign (w:majority) means the filing survives any single office failing. And a clerk quoting "the finalized version only" (readConcern majority) will never read you back something that could later be un-filed.',
      hi: '**Ek legal document courier se bhejना: aap chunते ho kaunse office mein deliver karना (read preference), kितne signatures wapas chahiye ise "filed" maanne se pehle (write concern), aur jo clerk aap poochते ho kya use ek draft quote karne ki ijaазат hai ya sirf finalized, countersigned version (read concern).** Head office (primary) mein deliver karna hamesha current hai; ek branch (secondary) mein faster aur closer hai par kal ki file se kaam kar raha ho sakta hai. Ek signature (w:1) require karna quick hai par document abhi bhi lost ho sakta hai; ek majority of offices ko sign karना require karna (w:majority) matlab filing kisī bhi single office fail hone ko survive karती hai.',
    },

    simple: `**READ PREFERENCE -- which member does a read go to?**
\`\`\`
primary            (default) -- always the primary. Freshest, but no read scaling.
primaryPreferred   -- primary if available, else a secondary
secondary          -- only secondaries. Scales reads, but data may lag the primary.
secondaryPreferred -- secondary if available, else primary
nearest            -- lowest network latency, primary or secondary
\`\`\`

**WRITE CONCERN -- how durable must a write be before it "succeeds"? \`{ w, j, wtimeout }\`**
\`\`\`
w: 1          (default) -- the primary has it. Fast. Lost if the primary fails
                           before replicating it.
w: "majority" -- a majority of members have it. Survives any single member failing.
                 The right default for data you can't lose.
j: true       -- the write is on the primary's on-disk journal (not just in memory)
\`\`\`

**READ CONCERN -- what is a read allowed to see? \`{ level }\`**
\`\`\`
local       (default) -- whatever this member currently has, committed or not
majority    -- only data that a majority of members have (can't be rolled back)
linearizable -- majority + guaranteed to reflect all writes that completed before it
snapshot    -- a consistent point-in-time view (used inside transactions)
\`\`\`

**CAUSAL CONSISTENCY (a session option): "read your own writes" and "reads see monotonic
time" -- even across primary and secondaries. The default for a client session.**`,

    simpleHi: `**READ PREFERENCE -- ek read kaunse member ko jाता hai?**
\`\`\`
primary            (default) -- hamesha primary. Freshest, par koi read scaling nahi.
primaryPreferred   -- primary agar available, warna ek secondary
secondary          -- sirf secondaries. Reads scale karта hai, par data lag kar sakта hai.
secondaryPreferred -- secondary agar available, warna primary
nearest            -- sabse kam network latency
\`\`\`

**WRITE CONCERN -- ek write ke "succeed" hone se pehle кितna durable? \`{ w, j, wtimeout }\`**
\`\`\`
w: 1          (default) -- primary ke paas hai. Fast. Lost agar primary replicate karne se pehle fail ho.
w: "majority" -- members ki ek majority ke paas hai. Kisī bhi single member fail hone ko survive karता hai.
j: true       -- write primary ke on-disk journal par hai (sirf memory mein nahi)
\`\`\`

**READ CONCERN -- ek read kya dekhने ki ijaازat? \`{ level }\`**
\`\`\`
local       (default) -- jo bhi is member ke paas abhi hai, committed ho ya na ho
majority    -- sirf wo data jo ek majority of members ke paas hai (rollback nahi ho sakta)
linearizable -- majority + guaranteed sabhi writes reflect karता hai jo iske pehle complete hue
snapshot    -- ek consistent point-in-time view (transactions ke andar)
\`\`\`

**CAUSAL CONSISTENCY (ek session option): "apne khud ke writes padhо" -- ek client session ka default.**`,

    content: `## Three separate knobs

MongoDB gives you three independent controls over the consistency/availability trade-off, one for reads, one for writes, and one for read visibility.

## Read preference: where a read goes

By default, both reads and writes go to the **primary**, which always has the newest data. Setting a different **read preference** routes reads elsewhere:

- **\`primary\`** (default) — always the primary. Strongest consistency; no read load spreading.
- **\`secondary\`** — reads go to secondaries only. This spreads read load off the primary and lets a nearby secondary serve a geographically distant client faster — but a secondary can be **slightly behind** the primary (replication lag), so a read might miss a very recent write.
- **\`primaryPreferred\` / \`secondaryPreferred\`** — use the preferred type, fall back to the other if it is unavailable.
- **\`nearest\`** — whichever member has the lowest network latency, regardless of role.

Reading from secondaries is an availability and latency optimization that costs you a small window of staleness. It is appropriate for data where "a few seconds old" is fine (analytics, feeds, most content) and wrong for reads that must reflect the latest write (a user checking a setting they just changed).

## Write concern: how durable a write must be

A **write concern** \`{ w, j, wtimeout }\` says how much confirmation the driver waits for before reporting a write as successful:

- **\`w: 1\`** (default) — the primary has applied the write. Fast, but if the primary crashes before that write replicates to any secondary, the write is lost (and, after failover, a client that saw it succeed finds it gone — a "rollback").
- **\`w: "majority"\`** — a majority of the replica set's members have the write. Because a majority is also what an election requires, any newly elected primary is guaranteed to have this write, so it can never be rolled back. This is the correct default for anything you genuinely cannot lose.
- **\`w: 0\`** — do not wait for any acknowledgment ("fire and forget"). Only for truly disposable data.
- **\`j: true\`** — additionally require the write to be recorded in the primary's on-disk journal, not just held in memory, so it survives a primary process crash even before replication.
- **\`wtimeout\`** — how long to wait for the \`w\` acknowledgment before returning a timeout error (the write may still eventually apply).

## Read concern: what a read may see

A **read concern** \`{ level }\` controls whether a read can return data that might later disappear:

- **\`local\`** (default) — returns the member's most recent data, whether or not it has been confirmed by a majority. Fast, but on a secondary this can include writes that a subsequent rollback removes.
- **\`majority\`** — returns only data that has been acknowledged by a majority of members, and therefore cannot be rolled back. Slightly slower; the right choice when a read must not observe data that could vanish.
- **\`linearizable\`** — the strongest: guarantees the read reflects every write that completed before the read began (only on the primary, only for single-document reads, at a real latency cost).
- **\`snapshot\`** — a consistent view of the data as of a single point in time, used by transactions (Lesson 3).

\`w: "majority"\` on writes and \`readConcern: "majority"\` on reads together give you the guarantee most applications actually want: a read never sees something that a write did not durably commit.

## Causal consistency

A **client session** with **causal consistency** (the default for an explicitly started session) guarantees, for operations *in that session*, that a read always reflects the session's own prior writes ("read your own writes"), and that successive reads see time moving forward, never backward — even if the operations are routed to different members. This closes the most surprising gap in a system that reads from secondaries: without it, a user could save a change against the primary and then, reading from a lagging secondary, not see their own change. With a causally consistent session, that cannot happen.`,

    contentHi: `## Teen alag knobs

MongoDB aapको consistency/availability trade-off par teen independent controls deता hai, ek reads ke liye, ek writes ke liye, aur ek read visibility ke liye.

## Read preference: ek read kahaan jाता hai

Default se, reads aur writes dono **primary** ko jाते hain. Ek alag **read preference** reads ko kahin aur route karता hai:

- **\`primary\`** (default) — hamesha primary. Strongest consistency.
- **\`secondary\`** — reads sirf secondaries ko. Ye primary se read load spread karता hai — par ek secondary primary se **thoda peeche** ho sakta hai (replication lag).
- **\`primaryPreferred\` / \`secondaryPreferred\`** — preferred type istemal karो, doosre par fall back karो.
- **\`nearest\`** — sabse kam network latency.

Secondaries se reading ek availability aur latency optimization hai jo aapко staleness ki ek chhoti window cost karता hai.

## Write concern: ek write кितna durable

Ek **write concern** \`{ w, j, wtimeout }\`:

- **\`w: 1\`** (default) — primary ne write apply kiya. Fast, par agar primary replicate hone se pehle crash hota hai, write lost hai.
- **\`w: "majority"\`** — replica set ke members ki ek majority ke paas write hai. Kyunki ek majority wahi hai jo ek election require karта hai, koi bhi newly elected primary guaranteed hai ki iske paas ye write ho. Ye kabhi rollback nahi ho sakta.
- **\`j: true\`** — additionally require karो ki write primary ke on-disk journal mein record ho.

## Read concern: ek read kya dekh sakta hai

- **\`local\`** (default) — member ka most recent data, chahe majority se confirmed ho ya na ho.
- **\`majority\`** — sirf wo data jo ek majority se acknowledged hai, aur isliye rollback nahi ho sakta.
- **\`linearizable\`** — strongest.
- **\`snapshot\`** — ek consistent point-in-time view (transactions).

\`w: "majority"\` writes par aur \`readConcern: "majority"\` reads par saath aapको wo guarantee deता hai jo zyadातार applications actually chाहती hain.

## Causal consistency

Ek **client session** **causal consistency** ke saath (ek explicitly started session ka default) guarantee karता hai, us session ke operations ke liye, ki ek read hamesha session ke khud ke prior writes reflect karता hai ("apne khud ke writes padhо"). Ye ek system mein sabse surprising gap band karता hai jo secondaries se padhता hai.`,

    examples: [
      {
        title: 'A write with w: "majority" — acknowledged only once a majority holds it',
        titleHi: 'Ek write w: "majority" ke saath — sirf ek baar acknowledged jab ek majority ise rakhता hai',
        code: `const r = await db.orders.insertOne({ _id: 1, total: 4999 }, { writeConcern: { w: "majority" } });
print({ acknowledged: r.acknowledged, insertedId: r.insertedId });`,
        output: `{"acknowledged":true,"insertedId":1}`,
        explain: '`{ writeConcern: { w: "majority" } }` means the driver reports the write as successful only once a majority of the replica set\'s members have it. Since electing a new primary also requires a majority, any future primary is guaranteed to have this write — it can never be rolled back. `acknowledged: true` confirms the majority was reached.',
        explainHi: '`{ writeConcern: { w: "majority" } }` matlab driver write ko successful sirf tab report karta hai jab replica set ke members ki ek majority ke paas ho. Kyunki ek naya primary elect karने ko bhi ek majority chahiye, koi future primary iske paas guaranteed hai — ye kabhi rollback nahi ho sakta.',
      },
      {
        title: 'A read with readConcern "majority" returns only majority-committed data',
        titleHi: 'Ek read readConcern "majority" ke saath sirf majority-committed data lautaता hai',
        code: `await db.orders.insertOne({ _id: 1, total: 500 }, { writeConcern: { w: "majority" } });
const docs = await db.orders.find({}, { readConcern: { level: "majority" } }).project({ _id: 1, total: 1 }).toArray();
print(docs);`,
        output: `[{"_id":1,"total":500}]`,
        explain: '`readConcern: { level: "majority" }` returns only data that has been acknowledged by a majority of members and therefore cannot be rolled back. Since the write used `w: "majority"`, the document is majority-committed and the read returns it. The default `local` read concern would also return uncommitted data (on a secondary, potentially roll-back-able).',
        explainHi: '`readConcern: { level: "majority" }` sirf wo data return karta hai jo members ki ek majority se acknowledged hai aur isliye rollback nahi ho sakta. Kyunki write ne `w: "majority"` istemal kiya, document majority-committed hai aur read ise return karta hai.',
      },
      {
        title: 'A causally consistent session reads its own write, even routed elsewhere',
        titleHi: 'Ek causally consistent session apna khud ka write padhता hai',
        code: `const session = client.startSession({ causalConsistency: true });
await db.settings.insertOne({ _id: "theme", value: "dark" }, { session });
const read = await db.settings.findOne({ _id: "theme" }, { session });
await session.endSession();
print(read);`,
        output: `{"_id":"theme","value":"dark"}`,
        explain: 'A session started with `causalConsistency: true` carries a logical timestamp. The `insertOne` records the timestamp at which it was ordered; the subsequent `findOne` in the same session forces whichever member serves it to have replicated up to at least that timestamp before answering — so the read always reflects the session\'s own prior writes ("read your own writes"), even across primary and secondaries.',
        explainHi: 'Ek session jo `causalConsistency: true` se start hua ek logical timestamp carry karta hai. `insertOne` us timestamp ko record karta hai jispar ise order kiya gaya; usi session mein baad ka `findOne` jo bhi member ise serve karता hai use us timestamp tak replicate karने ke liye force karta hai answer karne se pehle — to read hamesha session ke khud ke prior writes reflect karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// reading a just-changed value from a secondary and getting the old one
await db.users.updateOne({ _id: 1 }, { $set: { plan: "pro" } });   // to the primary
const u = await db.users.findOne(
  { _id: 1 },
  { readPreference: "secondaryPreferred" }   // may hit a lagging secondary
);
// u.plan might still be "free" -- the secondary hasn't replicated the update yet`,
        right: `// a read that must reflect a write the same client just made should either
// use the default primary read preference, or run in a causally consistent session:
const session = client.startSession();   // causally consistent by default
await db.users.updateOne({ _id: 1 }, { $set: { plan: "pro" } }, { session });
const u = await db.users.findOne({ _id: 1 }, { session });   // guaranteed to see plan: "pro"`,
        why: 'Secondaries apply the primary\'s writes asynchronously by tailing the oplog, so at any instant a secondary\'s data can be slightly behind the primary\'s by the replication lag, typically milliseconds but sometimes more under load. A read routed to a secondary immediately after a write to the primary can therefore land on a secondary that has not yet applied that write and return the previous value, which is surprising and often incorrect when the same client made the write and expects to see its effect. Two mechanisms prevent this. Using the default primary read preference sends the read to the same member that holds the write, so it is always visible. Alternatively, running both the write and the read inside a causally consistent client session, which is the default for an explicitly started session, guarantees that any read in that session reflects the session\'s own earlier writes regardless of which member serves it, because the session carries a logical timestamp that a secondary must have caught up to before answering.',
        whyHi: 'Secondaries primary ke writes ko asynchronously apply karते hain oplog ko tail karके, to kisī bhi instant par ek secondary ka data primary se replication lag se thoda peeche ho sakta hai. Ek read jo ek write ke turant baad ek secondary ko route hota hai isliye previous value return kar sakta hai. Do mechanisms ise prevent karते hain: default primary read preference istemal karना, ya write aur read dono ko ek causally consistent client session ke andar chalाना.',
      },
      {
        wrong: `// leaving write concern at the default w: 1 for financial / critical data
await db.transactions.insertOne(
  { from: "A", to: "B", amount: 5000 }
);   // w: 1 -- only the primary has it
// if the primary crashes in the next few milliseconds before replicating,
// this transaction is GONE, and after failover the client believes it succeeded`,
        right: `await db.transactions.insertOne(
  { from: "A", to: "B", amount: 5000 },
  { writeConcern: { w: "majority" } }
);
// acknowledged only once a MAJORITY of the set has it -- so any future primary
// (which also needs a majority) is guaranteed to have this write; it cannot roll back`,
        why: 'With the default write concern of w equal to 1, a write is acknowledged as soon as the primary has applied it, before it has necessarily been copied to any secondary. If the primary then fails in the brief interval before that write replicates, the write exists only on the now-dead primary. When a new primary is elected from the surviving members, it does not have the write, and once the failed former primary rejoins it must roll back any writes the new primary lacks, so the write is permanently lost even though the client was told it succeeded. Setting w to majority makes the write acknowledged only after a majority of the set has it. Since electing a new primary also requires a majority, the new primary\'s supporters necessarily include at least one member that has the write, so the new primary has it too and it can never be rolled back. For any data whose loss would be a real problem, majority write concern is the correct setting despite the small added latency.',
        whyHi: 'Default write concern `w` equal to 1 ke saath, ek write acknowledged hoता hai jaise hi primary ne ise apply kiya, isse pehle ki ye zaroori taur par kisī secondary ko copy ho. Agar primary phir replicate hone se pehle fail hota hai, write sirf ab-dead primary par exist karता hai. `w` ko `majority` set karna write ko sirf tab acknowledge karता hai jab set ki ek majority ke paas ho. Kyunki ek naya primary elect karne ko bhi ek majority chahiye, naye primary ke paas bhi write hai aur ye kabhi rollback nahi ho sakta.',
      },
      {
        wrong: `// using readConcern "linearizable" for ordinary reads "to be safe"
const doc = await db.products.findOne(
  { _id: sku },
  { readConcern: { level: "linearizable" } }
);   // on EVERY product page load
// linearizable forces the primary to confirm it's still primary via a
// round trip to a majority BEFORE answering -- real latency on every read`,
        right: `// use "majority" for reads that must not see roll-back-able data;
// reserve "linearizable" for the rare read that truly needs "reflects every
// write that finished before I started" (and accept its cost):
const doc = await db.products.findOne({ _id: sku }, { readConcern: { level: "majority" } });`,
        why: 'The linearizable read concern provides the strongest possible guarantee: the read is certain to reflect every write that completed before the read began, with no possibility of reading stale data even momentarily. Achieving this requires the primary, before returning the result, to confirm that it is still the primary by communicating with a majority of the set, which adds a network round trip to every such read. This cost is justified only for the specific reads that genuinely require that guarantee, such as a read whose result determines a decision that cannot tolerate acting on outdated information. For the far more common need of simply not observing data that might later be rolled back, the majority read concern is sufficient and considerably cheaper, since it only requires that the returned data has already been majority-acknowledged, without the extra confirmation round trip. Applying linearizable to routine reads imposes its latency everywhere for a guarantee those reads do not need.',
        whyHi: 'Linearizable read concern strongest possible guarantee deता hai: read certain hai ki har write reflect karे jo read shuru hone se pehle complete hua. Ise achieve karने ke liye primary ko, result return karne se pehle, confirm karना paता hai ki ye abhi bhi primary hai ek majority se communicate karके, jo har aisे read mein ek network round trip add karता hai. Ye cost sirf un specific reads ke liye justified hai jinhe genuinely wo guarantee chahiye. Zyada common need ke liye, `majority` read concern kaafi hai aur kaafi sasta.',
      },
    ],

    realWorld: [
      {
        en: '**An analytics dashboard reading with `readPreference: "secondary"`** — the numbers being a few seconds stale is completely fine, and the read load is kept off the primary that serves the transactional workload.',
        hi: '**Ek analytics dashboard `readPreference: "secondary"` ke saath padhता hai** — numbers кुछ seconds stale hona bilkul theek hai.',
      },
      {
        en: '**Every payment and ledger write using `{ w: "majority", j: true }`** — a write is not considered done until a majority of the set has it on durable storage, so a failover can never lose a recorded transaction.',
        hi: '**Har payment aur ledger write `{ w: "majority", j: true }` istemal karता hai** — ek failover kabhi ek recorded transaction nahi kho sakta.',
      },
      {
        en: '**A user-settings flow wrapped in a causally consistent session** — the user changes a preference and the very next screen, even if served by a secondary, reflects it, because the session guarantees read-your-writes.',
        hi: '**Ek user-settings flow ek causally consistent session mein wrapped** — user ek preference badalता hai aur agli screen ise reflect karती hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between read preference, write concern, and read concern?',
        qHi: 'Read preference, write concern, aur read concern mein kya antar hai?',
        a: 'These are three independent controls over the consistency and availability trade-off. Read preference determines which member of the replica set a read is routed to: the default is the primary, which always has the newest data, while options like secondary or nearest send reads to other members to spread load or reduce latency, at the cost of possibly reading data that lags the primary by the replication delay. Write concern determines how much acknowledgment the driver waits for before treating a write as successful: the default w of 1 means the primary has applied it, which is fast but loses the write if the primary fails before replicating it, while w of majority means a majority of members have it, which guarantees it survives any single failure and can never be rolled back because a new primary also requires a majority. Read concern determines what a read is permitted to return: the default local returns the member\'s latest data whether or not it is majority-confirmed, while majority returns only data that has been acknowledged by a majority and therefore cannot disappear, and linearizable additionally guarantees the read reflects every write that finished before it started. They compose: majority write concern together with majority read concern gives the common guarantee that a read never observes something a write did not durably commit.',
        aHi: 'Ye teen independent controls hain consistency aur availability trade-off par. Read preference determine karта hai ki ek read replica set ke kaunse member ko route hota hai. Write concern determine karта hai ki driver ek write ko successful maanne se pehle кितna acknowledgment wait karता hai: default `w` of 1 matlab primary ne ise apply kiya, jabki `w` of `majority` matlab members ki ek majority ke paas hai. Read concern determine karта hai ki ek read kya return kar sakta hai: default `local` member ka latest data return karता hai, jabki `majority` sirf wo data return karता hai jo ek majority se acknowledged hai.',
      },
      {
        q: 'What problem does reading from a secondary introduce, and how does a causally consistent session solve it?',
        qHi: 'Ek secondary se reading kaunसी problem introduce karती hai, aur ek causally consistent session ise kaise solve karता hai?',
        a: 'Secondaries apply the primary\'s writes asynchronously, continuously copying entries from the oplog, so at any moment a secondary can be behind the primary by the replication lag. When an application writes to the primary and then immediately issues a read that is routed to a secondary, that secondary may not have applied the write yet and returns the previous value, which is confusing and often wrong when the same client made the write and expects its effect to be visible. A causally consistent client session solves this by attaching a logical timestamp to the session\'s operations: when the session performs a write, it records the timestamp at which that write was ordered, and when the session later performs a read on any member, the driver requires that member to have replicated up to at least that timestamp before answering, waiting briefly if necessary. This guarantees that any read in the session reflects the session\'s own earlier writes regardless of which member serves the read, and that successive reads in the session never see time move backward. An explicitly started client session is causally consistent by default, so wrapping a write-then-read sequence in a single session is enough to get read-your-writes behavior even when reads may go to secondaries.',
        aHi: 'Secondaries primary ke writes ko asynchronously apply karते hain, to kisī bhi moment par ek secondary primary se replication lag se peeche ho sakta hai. Jab ek application primary ko likhता hai aur phir turant ek read issue karता hai jo ek secondary ko route hota hai, wo secondary abhi tak write apply nahi kiya ho sakta aur previous value return karता hai. Ek causally consistent client session ise solve karता hai session ke operations ko ek logical timestamp attach karके: jab session ek read karता hai, driver us member ko us timestamp tak replicate karने ki zaroorat karता hai answer karne se pehle.',
      },
    ],

    exercises: [
      {
        task: 'Insert a document into an `orders` collection with `{ writeConcern: { w: "majority" } }`. Confirm the result is `acknowledged: true` with the inserted `_id`. In a comment, explain why `w: "majority"` guarantees the write cannot be rolled back.',
        taskHi: 'Ek `orders` collection mein ek document `{ writeConcern: { w: "majority" } }` ke saath insert karo. Confirm karo result `acknowledged: true` hai. Ek comment mein samjhaओ ki `w: "majority"` kyun guarantee karता hai ki write rollback nahi ho sakta.',
        hint: 'A majority write concern acknowledges only once a majority of the set holds the write. Since electing a new primary also requires a majority, any future primary is guaranteed to have this write.',
        hintHi: 'Ek majority write concern sirf tab acknowledge karता hai jab set ki ek majority ke paas write ho. Kyunki ek naya primary elect karने ko bhi ek majority chahiye.',
      },
      {
        task: 'Insert a document with `w: "majority"`, then read the collection with `{ readConcern: { level: "majority" } }` and confirm the document comes back. In a comment, note what `readConcern: "majority"` protects against compared to the default `local`.',
        taskHi: 'Ek document `w: "majority"` ke saath insert karo, phir collection ko `{ readConcern: { level: "majority" } }` ke saath padho. Ek comment mein note karo `readConcern: "majority"` default `local` ke muकाble kis se protect karता hai.',
        hint: '`local` returns the member\'s latest data whether or not it is majority-confirmed — on a secondary that can include writes a later rollback removes. `majority` returns only data that cannot disappear.',
        hintHi: '`local` member ka latest data return karता hai chahe majority-confirmed ho ya na ho. `majority` sirf wo data return karता hai jo gayab nahi ho sakta.',
      },
      {
        task: 'Start a session with `client.startSession({ causalConsistency: true })`. Inside it, `insertOne` a settings document and then `findOne` it back — both passing `{ session }`. Confirm the read returns the just-inserted document. Explain in a comment why this holds even if the read is served by a lagging secondary.',
        taskHi: 'Ek session `client.startSession({ causalConsistency: true })` se start karo. Iske andar, ek settings document `insertOne` karo aur phir ise `findOne` karो — dono `{ session }` pass karте hue.',
        hint: 'A causally consistent session carries a logical timestamp; a read in the session forces whichever member serves it to have replicated up to the session\'s own prior writes before answering — read-your-writes across members.',
        hintHi: 'Ek causally consistent session ek logical timestamp carry karता hai; session mein ek read jo bhi member ise serve karта hai use session ke prior writes tak replicate karने ke liye force karता hai.',
      },
    ],

    keyTakeaways: [
      'THREE INDEPENDENT KNOBS on the consistency/availability trade-off: READ PREFERENCE (which member a read goes to), WRITE CONCERN (how many members must have a write before it "succeeds"), READ CONCERN (what a read may see).',
      'READ PREFERENCE: `primary` (default — freshest, no read scaling); `secondary`/`secondaryPreferred` (spreads read load, closer to distant clients, but data can LAG the primary by the replication delay); `nearest` (lowest latency, any role). Secondary reads trade a small staleness window for availability/latency — wrong for "read a value I just changed".',
      'WRITE CONCERN `{ w, j, wtimeout }`: `w: 1` (default — only the primary has it; LOST if the primary fails before replicating → a post-failover "rollback" of a write the client saw succeed). `w: "majority"` — a majority holds it; since an election ALSO needs a majority, any future primary is guaranteed to have it → CANNOT be rolled back. The right default for data you can\'t lose. `j: true` — also require it in the primary\'s on-disk journal.',
      'READ CONCERN `{ level }`: `local` (default — the member\'s latest data, majority-confirmed or not; on a secondary can include roll-back-able writes). `majority` — only majority-acknowledged data that cannot disappear. `linearizable` — strongest (reflects every write finished before it started), but forces a majority round trip per read — reserve for the rare read that truly needs it. `snapshot` — for transactions.',
      '`w: "majority"` + `readConcern: "majority"` together = the guarantee most apps actually want: a read NEVER sees something a write did not durably commit.',
      'CAUSAL CONSISTENCY (default for an explicitly-started client session): within the session, a read ALWAYS reflects the session\'s own prior writes ("read your own writes") and successive reads never see time go backward — EVEN across primary and secondaries. Wrapping a write-then-read in one session fixes the "changed a setting, next screen shows the old value" bug.',
    ],
    keyTakeawaysHi: [
      'CONSISTENCY/AVAILABILITY trade-off par TEEN INDEPENDENT KNOBS: READ PREFERENCE, WRITE CONCERN, READ CONCERN.',
      'READ PREFERENCE: `primary` (default — freshest); `secondary` (read load spread karта hai, par data primary se LAG kar sakta hai); `nearest`. Secondary reads ek chhoti staleness window ko availability/latency ke liye trade karते hain.',
      'WRITE CONCERN `{ w, j, wtimeout }`: `w: 1` (default — sirf primary ke paas; primary replicate karne se pehle fail hone par LOST). `w: "majority"` — ek majority ke paas hai; kyunki ek election ko BHI ek majority chahiye, koi future primary iske paas guaranteed hai → rollback NAHI ho sakta.',
      'READ CONCERN `{ level }`: `local` (default). `majority` — sirf majority-acknowledged data jo gayab nahi ho sakta. `linearizable` — strongest, par har read par ek majority round trip force karता hai. `snapshot` — transactions ke liye.',
      '`w: "majority"` + `readConcern: "majority"` saath = wo guarantee jo zyadातार apps chाहती hain.',
      'CAUSAL CONSISTENCY (ek explicitly-started client session ka default): session ke andar, ek read HAMESHA session ke khud ke prior writes reflect karता hai. Ek write-then-read ko ek session mein wrap karна "setting badla, agli screen purani value dikhाती hai" bug fix karता hai.',
    ],
  },

  {
    slug: 'mongo-sessions-and-transactions',
    title: 'Sessions & Multi-Document Transactions',
    titleHi: 'Sessions Aur Multi-Document Transactions',
    description: 'A single MongoDB write on one document is already atomic. A multi-document transaction extends that guarantee across several documents and collections: all the writes commit together or none do. They work, but they cost — and good document modeling usually removes the need for them.',
    descriptionHi: 'Ek single MongoDB write ek document par pehle se atomic hai. Ek multi-document transaction us guarantee ko kई documents aur collections ke across extend karта hai: saare writes saath commit karте hain ya koi nahi. Wo kaam karते hain, par cost karते hain — aur achhа document modeling usually unki zaroorat hataता hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**Moving house: everything goes on the truck and gets unloaded at the new place, or if the truck breaks down, everything comes back to the old place — you never end up with the sofa at the new house and the bed still at the old one.** A single-document write is like carrying one box: it either arrives or it does not, no in-between. A multi-document transaction is the whole move treated as one unit: debit one account *and* credit another, insert an order *and* decrement inventory — if anything fails partway, every change is undone and it is as if the move never started. The cost is real: the truck is booked exclusively for the duration, other people wait, and if the move takes too long the whole thing is called off. So you only rent the truck when the move genuinely cannot be done box by box.',
      hi: '**Ghar shift karna: sab kुछ truck par jाता hai aur naye place par unload hota hai, ya agar truck breakdown hota hai, sab kुछ purane place wapas aata hai — aap kabhi sofa naye ghar mein aur bed purane mein nahi paते.** Ek single-document write ek box carry karने jaisा hai: ya to ye pahunचता hai ya nahi. Ek multi-document transaction poora move ek unit ke roop mein: ek account debit karो *aur* doosरा credit karो — agar kुछ bhi partway fail hota hai, har change undo hota hai. Cost real hai: truck duration ke liye exclusively booked hai, doosre log wait karते hain, aur agar move bahut lamba leता hai poori cheez cancel ho jाती hai.',
    },

    simple: `**A SINGLE-document write is ALREADY atomic -- no transaction needed for it**

\`\`\`js
// this whole update is all-or-nothing, even across the three operators:
await db.orders.updateOne({ _id: 1 }, {
  $set: { status: "paid" }, $inc: { version: 1 }, $push: { events: "payment" },
});
\`\`\`

**A MULTI-document transaction: several writes commit TOGETHER or not at all**

\`\`\`js
const session = client.startSession();
await session.withTransaction(async () => {
  await db.accounts.updateOne({ _id: "A" }, { $inc: { bal: -30 } }, { session });
  await db.accounts.updateOne({ _id: "B" }, { $inc: { bal:  30 } }, { session });
});   // both applied, or (on any error) neither
await session.endSession();
\`\`\`

**AN ERROR inside the transaction ABORTS everything -- automatic rollback**

\`\`\`js
await session.withTransaction(async () => {
  await db.accounts.updateOne({ _id: "A" }, { $inc: { bal: -30 } }, { session });
  throw new Error("...");   // -> the -30 is rolled back; A's balance is unchanged
});
\`\`\`

**THE COSTS**
\`\`\`
- requires a REPLICA SET (a standalone can't do them)
- a default 60-SECOND limit -- a long transaction is aborted
- holds locks; concurrent writers to the same docs get a WriteConflict and must retry
- slower than a single write -- don't wrap every operation in one
\`\`\`

**GOOD MODELING USUALLY REMOVES THE NEED:** embed what changes together into ONE document,
and a single-document update gives you atomicity for free.`,

    simpleHi: `**Ek SINGLE-document write PEHLE SE atomic hai -- iske liye koi transaction nahi chahiye**

\`\`\`js
await db.orders.updateOne({ _id: 1 }, {
  $set: { status: "paid" }, $inc: { version: 1 }, $push: { events: "payment" },
});
\`\`\`

**Ek MULTI-document transaction: kई writes SAATH commit karте hain ya bilkul nahi**

\`\`\`js
const session = client.startSession();
await session.withTransaction(async () => {
  await db.accounts.updateOne({ _id: "A" }, { $inc: { bal: -30 } }, { session });
  await db.accounts.updateOne({ _id: "B" }, { $inc: { bal:  30 } }, { session });
});
await session.endSession();
\`\`\`

**Transaction ke andar EK ERROR sab kुछ ABORT karता hai -- automatic rollback**

\`\`\`js
await session.withTransaction(async () => {
  await db.accounts.updateOne({ _id: "A" }, { $inc: { bal: -30 } }, { session });
  throw new Error("...");   // -> -30 rollback hota hai; A ka balance unchanged
});
\`\`\`

**COSTS**
\`\`\`
- ek REPLICA SET chahiye (ek standalone nahi kar sakta)
- ek default 60-SECOND limit -- ek lamba transaction abort hota hai
- locks holds karता hai; usी docs ko concurrent writers ko WriteConflict milता hai aur retry karна paता hai
- ek single write se slower -- har operation ko ek mein wrap mat karो
\`\`\`

**ACHHA MODELING USUALLY ZAROORAT HATAТА HAI:** jo saath badalता hai use EK document mein embed karो.`,

    content: `## Single-document atomicity is built in

Every write to a single MongoDB document is **atomic**, no matter how many fields or operators it touches. An \`updateOne\` that sets three fields, increments a counter, and pushes onto an array either applies all of those changes or, on any failure, none of them — another reader never sees a half-applied state. This is why Module 14's advice to *embed what changes together* is also a concurrency-safety strategy: if the data that must stay consistent lives in one document, a single-document update keeps it consistent for free.

## When you need more: multi-document transactions

A **multi-document transaction** extends the all-or-nothing guarantee across multiple documents, multiple collections, even multiple databases:

\`\`\`js
const session = client.startSession();
await session.withTransaction(async () => {
  await db.accounts.updateOne({ _id: "A" }, { $inc: { bal: -30 } }, { session });
  await db.accounts.updateOne({ _id: "B" }, { $inc: { bal:  30 } }, { session });
});
await session.endSession();
\`\`\`

- **\`client.startSession()\`** creates a session. Transactions run within a session.
- **\`session.withTransaction(fn)\`** runs \`fn\`, and on success commits every write made with that \`session\`; it also **automatically retries** the transaction on the specific transient errors MongoDB says are safe to retry.
- Every operation that should be part of the transaction must be passed \`{ session }\`. An operation without the session is *not* in the transaction.
- If \`fn\` throws — an application error, a constraint violation, anything — \`withTransaction\` **aborts** the transaction: every write made in it is rolled back, and the error propagates out.

(There is also a lower-level API — \`session.startTransaction()\`, \`session.commitTransaction()\`, \`session.abortTransaction()\` — but \`withTransaction\` is preferred because it handles the retry logic.)

## The costs

Transactions are a real feature, but they are not free:

- **They require a replica set.** A standalone \`mongod\` cannot run them at all (this is one more reason a replica set is the production baseline).
- **There is a time limit** — 60 seconds by default. A transaction that runs longer is aborted. Transactions are for short, focused units of work, not long-running batch jobs.
- **They hold locks.** While a transaction has modified a document, another transaction that tries to modify the same document gets a **\`WriteConflict\`** error and must retry (which \`withTransaction\` does automatically for its own transaction, but contention still costs throughput).
- **They are slower** than an equivalent single write, because of the coordination and the majority-commit at the end.

## The guidance: model to avoid them

MongoDB's own recommendation is to **design your schema so that multi-document transactions are rare**. In practice:

- Data that must change together and be read together belongs **in one document** (Module 14). A single-document update is atomic — no transaction needed.
- A "computed" field maintained with \`$inc\` in the same operation that changes its input (Module 14 Lesson 4) covers many "keep two things consistent" cases without a transaction.
- Genuine cross-entity, cross-collection atomic operations — a bank transfer between two account documents, an order that must atomically create a record *and* decrement a shared inventory counter — are the real use case. Reach for a transaction there, keep it small, and let \`withTransaction\` handle the retries.

If you find yourself wrapping most of your writes in transactions, that is usually a sign the schema is too normalized — too split across documents and collections — for the document model.`,

    contentHi: `## Single-document atomicity built in hai

Ek single MongoDB document ke har write **atomic** hai, chahe ye кितne fields ya operators touch kare. Ek \`updateOne\` jo teen fields set karता hai, ek counter increment karता hai, aur ek array par push karता hai ya to un saare changes ko apply karता hai ya, kisī failure par, koi nahi. Isिlye Module 14 ki *jo saath badalता hai use embed karो* advice ek concurrency-safety strategy bhi hai.

## Jab aapको zyada chahiye: multi-document transactions

\`\`\`js
const session = client.startSession();
await session.withTransaction(async () => {
  await db.accounts.updateOne({ _id: "A" }, { $inc: { bal: -30 } }, { session });
  await db.accounts.updateOne({ _id: "B" }, { $inc: { bal:  30 } }, { session });
});
await session.endSession();
\`\`\`

- **\`session.withTransaction(fn)\`** \`fn\` chalाता hai, aur success par us \`session\` ke saath kiya har write commit karता hai; ye specific transient errors par **automatically retry** bhi karता hai.
- Har operation jo transaction ka hissa hona chahiye use \`{ session }\` pass karna chahiye.
- Agar \`fn\` throw karता hai, \`withTransaction\` transaction ko **abort** karता hai.

## Costs

- **Unhe ek replica set chahiye.** Ek standalone \`mongod\` unhe bilkul nahi chala sakta.
- **Ek time limit hai** — default se 60 seconds.
- **Wo locks holds karте hain.** Ek transaction ne jab ek document modify kiya hai, ek doosरा transaction jo usी document ko modify karने ki koshish karता hai ek **\`WriteConflict\`** error paता hai.
- **Wo slower hain** ek equivalent single write se.

## Guidance: unhe avoid karने ke liye model karो

MongoDB ki apni recommendation hai apne schema ko **design karो taaki multi-document transactions rare hon**:

- Jo data saath badalना chahiye aur saath padhа jaना chahiye **ek document mein** rehता hai (Module 14).
- Genuine cross-entity, cross-collection atomic operations — do account documents ke beech ek bank transfer — real use case hain.

Agar aap khud ko apne zyadातार writes ko transactions mein wrap karते paते ho, wo usually ek sign hai ki schema bahut normalized hai.`,

    examples: [
      {
        title: 'A multi-document transaction: both updates commit together',
        titleHi: 'Ek multi-document transaction: dono updates saath commit karte hain',
        code: `await db.accounts.insertMany([{ _id: "A", bal: 100 }, { _id: "B", bal: 0 }]);
const session = client.startSession();
await session.withTransaction(async () => {
  await db.accounts.updateOne({ _id: "A" }, { $inc: { bal: -30 } }, { session });
  await db.accounts.updateOne({ _id: "B" }, { $inc: { bal: 30 } }, { session });
});
await session.endSession();
print(await db.accounts.find({}).sort({ _id: 1 }).project({ _id: 1, bal: 1 }).toArray());`,
        output: `[{"_id":"A","bal":70},{"_id":"B","bal":30}]`,
        explain: 'Both `updateOne` calls pass `{ session }`, so they are part of the transaction. `withTransaction` runs the callback and, on success, commits both writes together: A goes 100 → 70, B goes 0 → 30. There is no moment where an observer sees one applied and the other not.',
        explainHi: 'Dono `updateOne` calls `{ session }` pass karте hain, to wo transaction ka hissa hain. `withTransaction` callback chalाता hai aur, success par, dono writes saath commit karता hai: A 100 → 70, B 0 → 30. Koi moment nahi jahaan ek observer ek applied aur doosरा nahi dekhे.',
      },
      {
        title: 'An error inside the transaction rolls back every write in it',
        titleHi: 'Transaction ke andar ek error ismein har write rollback karta hai',
        code: `await db.accounts.insertMany([{ _id: "A", bal: 100 }, { _id: "B", bal: 0 }]);
const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await db.accounts.updateOne({ _id: "A" }, { $inc: { bal: -30 } }, { session });
    throw new Error("payment provider declined");
  });
} catch (e) {
  print("caught: " + e.message);
}
await session.endSession();
print(await db.accounts.find({}).sort({ _id: 1 }).project({ _id: 1, bal: 1 }).toArray());`,
        output: `caught: payment provider declined
[{"_id":"A","bal":100},{"_id":"B","bal":0}]`,
        explain: "The `$inc` on A runs, then the callback throws. `withTransaction` catches the throw and ABORTS the transaction: the -30 on A is rolled back, so A's balance is unchanged at 100 and B's at 0. The error propagates out to the surrounding `catch`, which prints it. All-or-nothing: since not everything committed, nothing did.",
        explainHi: 'A par `$inc` chalता hai, phir callback throw karता hai. `withTransaction` throw catch karता hai aur transaction ABORT karता hai: A par -30 rollback hota hai, to A ka balance 100 par unchanged hai aur B ka 0 par. Error surrounding `catch` tak propagate hota hai. All-or-nothing: kyunki sab kुछ commit nahi hua, kuch nahi hua.',
      },
      {
        title: 'Explicit session.abortTransaction() discards the pending write',
        titleHi: 'Explicit session.abortTransaction() pending write discard karta hai',
        code: `await db.accounts.insertOne({ _id: "A", bal: 100 });
const session = client.startSession();
session.startTransaction();
await db.accounts.updateOne({ _id: "A" }, { $inc: { bal: -50 } }, { session });
await session.abortTransaction();
await session.endSession();
print((await db.accounts.findOne({ _id: "A" })).bal);`,
        output: `100`,
        explain: "Using the explicit lower-level API (`session.startTransaction()` / `abortTransaction()` rather than `withTransaction`): the `$inc` of -50 on A is applied inside the open transaction, then `abortTransaction()` discards it. A's balance is back to 100 — the pending write never became visible.",
        explainHi: 'Explicit lower-level API istemal karके (`session.startTransaction()` / `abortTransaction()` `withTransaction` ke bजाy): A par -50 ka `$inc` open transaction ke andar apply hota hai, phir `abortTransaction()` ise discard karta hai. A ka balance 100 par wapas hai — pending write kabhi visible nahi bana.',
      },
    ],

    mistakes: [
      {
        wrong: `// forgetting to pass { session } to an operation inside a transaction
await session.withTransaction(async () => {
  await db.accounts.updateOne({ _id: "A" }, { $inc: { bal: -30 } }, { session });
  await db.accounts.updateOne({ _id: "B" }, { $inc: { bal: 30 } });   // <- no { session }!
});
// the second update is NOT part of the transaction -- it commits immediately and
// independently. If the transaction later aborts, B's +30 stays but A's -30 is undone.`,
        right: `await session.withTransaction(async () => {
  await db.accounts.updateOne({ _id: "A" }, { $inc: { bal: -30 } }, { session });
  await db.accounts.updateOne({ _id: "B" }, { $inc: { bal: 30 } }, { session });
});
// EVERY operation that must be atomic with the others gets { session }`,
        why: 'A MongoDB transaction is scoped to a session, and an operation only participates in the transaction if it is explicitly associated with that session by passing the session object. An operation issued without the session, even inside the callback of withTransaction, runs as an ordinary standalone write: it commits immediately, on its own, and is completely unaffected by whether the surrounding transaction later commits or aborts. This produces exactly the partial-update inconsistency transactions exist to prevent, because if the transaction aborts, the writes that were in it are rolled back while the write that was missing the session has already taken permanent effect. Every read and write that needs to be atomic with the rest of the transaction must be passed the session, and a common source of this bug is a helper function that issues its own writes without threading the session through to them.',
        whyHi: 'Ek MongoDB transaction ek session tak scoped hai, aur ek operation transaction mein sirf tab participate karता hai agar ye explicitly us session ke saath associated hai session object pass karके. Bina session ke issue kiya gaya ek operation, `withTransaction` ke callback ke andar bhi, ek ordinary standalone write ke roop mein chalता hai: ye turant commit karता hai. Ye theek wo partial-update inconsistency produce karता hai jise prevent karने ke liye transactions exist karते hain.',
      },
      {
        wrong: `// using a transaction where a single-document update would be atomic already
await session.withTransaction(async () => {
  await db.orders.updateOne({ _id: 1 }, { $set: { status: "paid" } }, { session });
  await db.orders.updateOne({ _id: 1 }, { $inc: { version: 1 } }, { session });
  await db.orders.updateOne({ _id: 1 }, { $push: { events: "payment" } }, { session });
});
// three separate updates to the SAME document, wrapped in a transaction for no
// reason -- a single-document write is already atomic across all its operators`,
        right: `await db.orders.updateOne({ _id: 1 }, {
  $set: { status: "paid" },
  $inc: { version: 1 },
  $push: { events: "payment" },
});
// one update, all operators applied atomically, no transaction, no session`,
        why: 'Every write to a single document in MongoDB is atomic regardless of how many fields it modifies or how many update operators it uses, so a single updateOne that sets a field, increments a counter, and pushes onto an array applies all of those changes as one indivisible unit with no possibility of another reader observing a partial result. Splitting that same logical change into multiple separate updates to the same document and wrapping them in a transaction adds the full cost of a transaction, the session, the locks, the majority commit, the time limit, to recreate an atomicity guarantee that a single update already provides for free. When all the fields that must change together live in one document, the correct approach is one update statement combining all the operators, and a transaction is only warranted when the atomicity must span more than one document.',
        whyHi: 'Ek single MongoDB document ke har write atomic hai chahe ye кितne fields modify kare, to ek single `updateOne` jo ek field set karता hai, ek counter increment karता hai, aur ek array par push karता hai un saare changes ko ek indivisible unit ke roop mein apply karता hai. Us same logical change ko multiple separate updates mein split karके ek transaction mein wrap karना ek transaction ki full cost add karता hai ek atomicity guarantee recreate karने ke liye jo ek single update pehle se free deता hai.',
      },
      {
        wrong: `// running a long batch job inside one transaction
await session.withTransaction(async () => {
  for (const record of tenThousandRecords) {
    await db.imported.insertOne(record, { session });
  }
});
// this will exceed the 60-second default transaction limit and be aborted,
// AND it holds locks on everything it touched for the whole duration`,
        right: `// process in small batches, each its own transaction (or no transaction if
// single-document atomicity suffices):
for (const chunk of chunksOf(tenThousandRecords, 100)) {
  const session = client.startSession();
  await session.withTransaction(async () => {
    for (const record of chunk) await db.imported.insertOne(record, { session });
  });
  await session.endSession();
}`,
        why: 'MongoDB transactions have a default runtime limit of 60 seconds, after which the transaction is automatically aborted and all its writes rolled back, and this limit exists because a transaction holds locks on every document it has modified for its entire duration, so a long transaction blocks other writers to those documents for that whole time and consumes server resources tracking a large pending change set. A batch job that processes thousands of records inside a single transaction will typically exceed the time limit and lose all its work, and even if it fit within the limit it would serialize a large amount of contention. The right structure for bulk work is to divide it into small batches, each processed in its own short transaction if cross-document atomicity within a batch is needed, or with no transaction at all if each record is independent and single-document atomicity is sufficient. Transactions are designed for short, focused units of work, not for wrapping an entire long-running operation.',
        whyHi: 'MongoDB transactions ka ek default runtime limit 60 seconds hai, jiske baad transaction automatically abort hota hai. Ye limit exist karता hai kyunki ek transaction har document par locks holds karता hai jise usne modify kiya iski poori duration ke liye. Ek batch job jo hazaron records ko ek single transaction ke andar process karता hai typically time limit exceed karega. Bulk work ke liye sahi structure ise chhote batches mein divide karना hai, har ek apni chhoti transaction mein.',
      },
    ],

    realWorld: [
      {
        en: '**A funds-transfer endpoint using `withTransaction` to debit one account document and credit another** — the only place in the codebase that needs a transaction, because the two balances live in separate documents and must move together.',
        hi: '**Ek funds-transfer endpoint jo `withTransaction` istemal karta hai** — codebase mein ekmatra jagah jise ek transaction chahiye.',
      },
      {
        en: '**An order-placement flow that creates an `orders` document AND decrements a shared `inventory` counter in one transaction** — so an order is never recorded against stock that was already sold.',
        hi: '**Ek order-placement flow jo ek `orders` document banata hai AUR ek shared `inventory` counter decrement karta hai ek transaction mein**.',
      },
      {
        en: '**A schema review that eliminated a transaction by embedding a `lineItems` array directly in the order document** — the line items and the order total now change in one single-document update, no transaction required.',
        hi: '**Ek schema review jisne ek `lineItems` array ko order document mein embed karके ek transaction hataya** — ab ek single-document update mein badalते hain.',
      },
    ],

    interviewQA: [
      {
        q: 'When do you actually need a multi-document transaction in MongoDB, given that single-document writes are already atomic?',
        qHi: 'Aapको MongoDB mein ek multi-document transaction kab actually chahiye, ye dekhte hue ki single-document writes pehle se atomic hain?',
        a: 'Every write to a single MongoDB document is atomic no matter how many fields or update operators it involves, so any set of changes that all live within one document is already all-or-nothing without a transaction, and this is a large fraction of what applications need if the schema embeds data that changes together. A multi-document transaction is genuinely required only when an atomic change must span more than one document, more than one collection, or more than one database, and the classic examples are a transfer that debits one account document and credits another, or an order operation that must both insert an order record and decrement a shared inventory counter that other orders also touch. In those cases the two writes are in separate documents by necessity and there is no single-document update that covers both, so a transaction is the mechanism that keeps them consistent. MongoDB\'s own guidance is to design the schema so these situations are rare, using embedding and computed fields maintained in the same update to keep related data in one document, and to reserve transactions for the true cross-entity cases while keeping each transaction small and short.',
        aHi: 'Ek single MongoDB document ke har write atomic hai chahe ye кितne fields involve kare, to koi bhi changes ka set jo ek document ke andar rehта hai pehle se all-or-nothing hai bina ek transaction ke. Ek multi-document transaction genuinely sirf tab chahiye jab ek atomic change ek se zyada document, ek se zyada collection, ya ek se zyada database span kare. Classic examples ek transfer hai jo ek account debit karता hai aur doosरा credit karता hai. MongoDB ki apni guidance hai schema ko design karो taaki ye situations rare hon.',
      },
      {
        q: 'What are the costs and limits of MongoDB transactions?',
        qHi: 'MongoDB transactions ki costs aur limits kya hain?',
        a: 'MongoDB transactions carry several costs. First, they require a replica set: a standalone mongod cannot run them at all, because the transaction machinery depends on the oplog and majority-commit infrastructure that only a replica set provides. Second, there is a default time limit of 60 seconds, and a transaction running longer than that is automatically aborted with all its writes rolled back, so transactions are only suitable for short, focused units of work and not for long batch operations. Third, a transaction holds locks on every document it has modified for its entire duration, so while it is open, another transaction attempting to modify one of those same documents receives a WriteConflict error and must retry; withTransaction retries its own transaction automatically on such transient errors, but the contention still reduces throughput when many transactions touch overlapping documents. Fourth, a transaction is slower than an equivalent single write because of the coordination overhead and the majority commit performed at the end. Because of these costs, the recommended approach is to model the schema so that most changes fit within a single document and are atomic for free, and to use transactions only for the genuine cross-document cases, keeping each one small.',
        aHi: 'MongoDB transactions kई costs carry karते hain. Pehla, unhe ek replica set chahiye. Doosra, ek default time limit 60 seconds hai, aur ek transaction jo isse zyada chalता hai automatically abort hota hai. Teesra, ek transaction har document par locks holds karता hai jise usne modify kiya iski poori duration ke liye, to ek doosरा transaction jo unmein se ek document ko modify karने ki koshish karता hai ek `WriteConflict` error paता hai. Chautha, ek transaction ek equivalent single write se slower hai.',
      },
    ],

    exercises: [
      {
        task: 'Insert accounts A (bal 100) and B (bal 0). Use `client.startSession()` and `session.withTransaction` to `$inc` A by -30 and B by +30, passing `{ session }` to both updates. Confirm the final balances are A: 70, B: 30.',
        taskHi: 'Accounts A (bal 100) aur B (bal 0) insert karo. `client.startSession()` aur `session.withTransaction` istemal karके A ko -30 aur B ko +30 `$inc` karo, dono updates ko `{ session }` pass karte hue.',
        hint: 'Both updates must receive `{ session }` to be part of the transaction. `withTransaction` commits them together on success (and auto-retries safe transient errors).',
        hintHi: 'Dono updates ko transaction ka hissa hone ke liye `{ session }` receive karna chahiye. `withTransaction` unhe success par saath commit karता hai.',
      },
      {
        task: 'Same setup. This time, inside `withTransaction`, do the `$inc` on A by -30 and then `throw new Error("declined")`. Catch the error outside. Confirm A\'s balance is still 100 and B\'s is still 0 — the whole transaction rolled back.',
        taskHi: 'Wahi setup. Is baar, `withTransaction` ke andar, A par -30 `$inc` karo aur phir `throw new Error("declined")`. Error bahar catch karo. Confirm karo A ka balance abhi bhi 100 hai.',
        hint: 'Any error thrown inside the `withTransaction` callback aborts the transaction — every write made with the session is rolled back, and the error propagates out to your `catch`.',
        hintHi: '`withTransaction` callback ke andar throw kiya gaya koi bhi error transaction ko abort karता hai — session ke saath kiya har write rollback hota hai.',
      },
      {
        task: 'Insert account A (bal 100). Use the explicit API: `session.startTransaction()`, `$inc` A by -50 with `{ session }`, then `session.abortTransaction()`. Confirm A\'s balance is still 100.',
        taskHi: 'Account A (bal 100) insert karo. Explicit API istemal karo: `session.startTransaction()`, A par -50 `$inc` karo `{ session }` ke saath, phir `session.abortTransaction()`.',
        hint: 'The explicit `startTransaction`/`commitTransaction`/`abortTransaction` API is lower-level than `withTransaction` (which adds retry handling). `abortTransaction()` discards every pending write.',
        hintHi: 'Explicit `startTransaction`/`commitTransaction`/`abortTransaction` API `withTransaction` se lower-level hai. `abortTransaction()` har pending write discard karता hai.',
      },
    ],

    keyTakeaways: [
      'A SINGLE-document write is ALREADY ATOMIC across ALL its fields and operators — an `updateOne` with `$set` + `$inc` + `$push` applies all-or-nothing, no transaction needed. This is why Module 14\'s "embed what changes together" is also a CONCURRENCY-SAFETY strategy.',
      'A MULTI-DOCUMENT TRANSACTION extends all-or-nothing across multiple docs/collections/databases: `client.startSession()` → `session.withTransaction(async () => { ...ops with { session }... })`. `withTransaction` commits on success AND auto-retries the safe transient errors. EVERY op that must be atomic with the rest MUST be passed `{ session }` — an op without it commits independently.',
      'An ERROR thrown inside the transaction callback → automatic ABORT: every write made with the session rolls back, the error propagates. (Lower-level API: `session.startTransaction()` / `commitTransaction()` / `abortTransaction()` — but `withTransaction` is preferred for the retry handling.)',
      'THE COSTS: (1) require a REPLICA SET — a standalone can\'t run them. (2) a default 60-SECOND limit — longer transactions are aborted; they\'re for short focused work, NOT batch jobs (chunk those into small per-batch transactions). (3) hold LOCKS — a concurrent writer to the same doc gets a `WriteConflict` and must retry; contention costs throughput. (4) SLOWER than a single write.',
      'THE GUIDANCE: design the schema so multi-doc transactions are RARE. Embed data that changes+reads together into ONE document (single-doc update = free atomicity). A computed field `$inc`\'d in the same op that changes its input covers many cases. Reserve transactions for GENUINE cross-entity atomic ops (bank transfer between two account docs; order-insert + shared-inventory-decrement).',
      'Wrapping MOST of your writes in transactions is a smell — usually the schema is too normalized (too split across docs/collections) for the document model.',
    ],
    keyTakeawaysHi: [
      'Ek SINGLE-document write PEHLE SE ATOMIC hai iske SAARE fields aur operators ke across. Isिlye Module 14 ka "jo saath badalता hai use embed karो" ek CONCURRENCY-SAFETY strategy bhi hai.',
      'Ek MULTI-DOCUMENT TRANSACTION all-or-nothing ko multiple docs/collections ke across extend karता hai: `session.withTransaction(async () => { ...ops with { session }... })`. HAR op jo baaki ke saath atomic hona chahiye use `{ session }` pass karna ZAROORI hai.',
      'Transaction callback ke andar throw kiya gaya ek ERROR → automatic ABORT: session ke saath kiya har write rollback hota hai.',
      'COSTS: (1) ek REPLICA SET chahiye. (2) ek default 60-SECOND limit — batch jobs ke liye NAHI. (3) LOCKS holds karте hain — ek concurrent writer ko `WriteConflict` milता hai. (4) ek single write se SLOWER.',
      'GUIDANCE: schema ko design karो taaki multi-doc transactions RARE hon. Jo data saath badalता+padhа jाता hai use EK document mein embed karो. Transactions ko GENUINE cross-entity atomic ops ke liye reserve karो.',
      'Apne ZYADATAR writes ko transactions mein wrap karна ek smell hai — usually schema bahut normalized hai.',
    ],
  },
];
