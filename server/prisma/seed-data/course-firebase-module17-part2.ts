/**
 * Databases Complete Course — Module 17: Cloud Firestore, lessons 4-6.
 *
 * Lesson 4: Transactions, batched writes & offline — runTransaction, writeBatch,
 *           offline persistence, and latency compensation.
 * Lesson 5: Security rules — the authorization layer, request.auth / resource.data,
 *           rule functions, get()/exists(), and "rules are not filters".
 * Lesson 6: The pricing model & modeling for cost — billed per document read/write/
 *           delete, the query-fan-out trap, denormalized counters, when Firestore fits.
 *
 * NOTE: Firestore has no offline engine, so these examples are illustrative —
 * realistic SDK code and realistic results, not machine-verified.
 */

import type { CourseLesson } from './course-js-module1';

export const FIREBASE_MODULE_17_PART2: CourseLesson[] = [
  {
    slug: 'firestore-transactions-batches-and-offline',
    title: 'Transactions, Batched Writes & Offline',
    titleHi: 'Transactions, Batched Writes Aur Offline',
    description: 'A transaction reads then writes atomically, retrying if a document it read changed underneath it. A batched write commits up to 500 writes all-or-nothing but cannot read. And the client SDK works fully offline — writes queue locally, reads serve from cache, and the UI updates before the server ever confirms.',
    descriptionHi: 'Ek transaction padhता phir atomically likhता hai, retry karता hai agar ek document jo isne padhा uske neeche badal gaya. Ek batched write 500 tak writes all-or-nothing commit karता hai par padh nahi sakta. Aur client SDK poori tarah offline kaam karता hai — writes locally queue hote hain, reads cache se serve hote hain.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A transaction is a careful bank teller who reads your balance, and if anyone else touches your account before they finish stamping the withdrawal, they tear up the slip and start over from a fresh read.** A batched write is a stack of pre-filled forms handed over with one signature — all of them get filed or none do — but the teller does not read anything back to you while filing. And offline mode is a teller who keeps taking your deposit slips during a power cut, stamps them "pending", shows you the new balance immediately, and syncs the whole stack with head office the moment the lights come back — you were never blocked, and latency compensation means your passbook looked right the entire time.',
      hi: '**Ek transaction ek careful bank teller hai jo aapका balance padhता hai, aur agar koi aur aapke account ko touch karता hai iske pehle ki wo withdrawal stamp karna khatam karे, wo slip phaड़ deता hai aur ek fresh read se dobारा shuru karता hai.** Ek batched write pre-filled forms ka ek stack hai ek signature ke saath diya gaya — sab file hote hain ya koi nahi — par teller filing ke dauран aapको kुछ padhkar nahi sunाता. Aur offline mode ek teller hai jo power cut ke dauран aapki deposit slips leता rehта hai, unhe "pending" stamp karता hai, aapको naya balance turant dikhाता hai, aur poore stack ko head office ke saath sync karता hai jaisे hi lights wapas aati hain.',
    },

    simple: `**TRANSACTION -- \`runTransaction\`: read-then-write atomically, auto-retries on conflict**

\`\`\`js
await db.runTransaction(async (tx) => {
  const snap = await tx.get(accountRef);          // ALL reads first
  const balance = snap.data().balance;
  if (balance < amount) throw new Error("insufficient funds");
  tx.update(accountRef, { balance: balance - amount });   // then writes
});
// -- if accountRef changed between the get and the commit, the WHOLE function
//    re-runs with fresh data (a few times, then gives up)
\`\`\`

**BATCHED WRITE -- \`writeBatch\`: up to 500 writes, all-or-nothing, NO reads**

\`\`\`js
const batch = db.batch();
batch.set(db.collection("orders").doc("o1"), { total: 4999 });
batch.update(db.collection("users").doc("u1"), { orderCount: FieldValue.increment(1) });
batch.delete(db.collection("carts").doc("u1"));
await batch.commit();   // all three land together, or none do
\`\`\`

**OFFLINE (client SDK): enabled by default on mobile, opt-in on web**
\`\`\`
- READS  -> served from the local cache when offline (onSnapshot keeps working)
- WRITES -> queued locally, applied to the cache immediately (UI updates NOW),
            sent to the server when connectivity returns
- LATENCY COMPENSATION -> your own writes are reflected in your listeners
            instantly, before the server confirms (snap.metadata.hasPendingWrites)
\`\`\`

**Transaction vs batch:** need to READ before deciding what to write -> transaction.
Already know all the writes -> batch (cheaper, no retries).`,

    simpleHi: `**TRANSACTION -- \`runTransaction\`: read-phir-write atomically, conflict par auto-retry**

\`\`\`js
await db.runTransaction(async (tx) => {
  const snap = await tx.get(accountRef);          // SAARE reads pehle
  const balance = snap.data().balance;
  if (balance < amount) throw new Error("insufficient funds");
  tx.update(accountRef, { balance: balance - amount });   // phir writes
});
// -- agar accountRef get aur commit ke beech badla, POORA function fresh data ke saath re-run hota hai
\`\`\`

**BATCHED WRITE -- \`writeBatch\`: 500 tak writes, all-or-nothing, KOI reads nahi**

\`\`\`js
const batch = db.batch();
batch.set(db.collection("orders").doc("o1"), { total: 4999 });
batch.update(db.collection("users").doc("u1"), { orderCount: FieldValue.increment(1) });
batch.delete(db.collection("carts").doc("u1"));
await batch.commit();   // teenो saath land hote hain, ya koi nahi
\`\`\`

**OFFLINE (client SDK): mobile par default se enabled, web par opt-in**
\`\`\`
- READS  -> offline hone par local cache se serve (onSnapshot chalता rehता hai)
- WRITES -> locally queue, cache par turant apply (UI ABHI update), connectivity wapas aane par server ko bheja
- LATENCY COMPENSATION -> aapke apne writes aapke listeners mein turant reflect hote hain
\`\`\`

**Transaction vs batch:** kya likhना hai decide karne se pehle READ karना -> transaction.
Saare writes pehle se pata -> batch (sasta, koi retries nahi).`,

    content: `## Transactions

\`runTransaction(fn)\` runs a function that reads some documents and then writes based on what it read, with a guarantee: if any document the function read is modified by another client before the transaction commits, the entire function is **discarded and re-run** with fresh data. It retries a handful of times, then fails.

Rules inside a transaction:

- **All reads must come before all writes.** You cannot read, write, then read again.
- The function **may run multiple times**, so it must be free of side effects other than the Firestore writes — no sending emails, no mutating outside state.
- Writes are buffered and only applied if the whole transaction commits.

Transactions are for **read-modify-write** on data where a concurrent change would make your write wrong: transferring a balance, decrementing inventory you must not oversell, assigning the next sequence number.

## Batched writes

\`writeBatch()\` groups **up to 500 writes** (set, update, delete) that commit **atomically** — all succeed or all fail — with no partial application. Unlike a transaction, a batch:

- **cannot read** anything;
- **does not retry** — there is no conflict logic because it makes no decisions based on current data;
- is a single network round trip regardless of how many writes it contains.

Use a batch when you already know every write you want to make and just need them to land together: creating an order document and incrementing the user's order count and clearing their cart, as one indivisible operation.

## Offline persistence

The client SDK has a **local cache** and works fully offline:

- **Reads** are served from the cache when the device is offline. \`onSnapshot\` listeners keep firing from cached data, and \`get()\` returns cached results (with \`snapshot.metadata.fromCache === true\`).
- **Writes** made while offline are applied to the local cache **immediately** and queued. When connectivity returns, the queued writes are sent to the server in order.
- On mobile (iOS/Android) offline persistence is **enabled by default**. On web it is **opt-in** (\`enableIndexedDbPersistence\` / \`persistentLocalCache\`), because a shared browser is a different trust and storage situation.

## Latency compensation

When your app makes a write, Firestore updates the **local cache first and synchronously notifies your listeners**, before the write reaches the server. So your own UI reflects your own changes instantly — a new message appears the moment you send it, not after a server round trip.

\`snapshot.metadata.hasPendingWrites\` is \`true\` for a document whose local state includes writes not yet acknowledged by the server. You can use it to show a subtle "sending…" indicator. If a queued write is ultimately rejected by the server (e.g. security rules deny it), Firestore rolls the local cache back and the listener fires again with the reverted state.

## Choosing

- **Need to read data to decide what to write, and a concurrent change would corrupt the result?** → transaction.
- **Know all the writes up front, just need atomicity?** → batched write (simpler, cheaper, no retries).
- **Single-document atomic field change (counter, array)?** → neither; a plain \`update\` with \`FieldValue.increment\` / \`arrayUnion\` is already atomic on that one document.`,

    contentHi: `## Transactions

\`runTransaction(fn)\` ek function chalाता hai jo кुछ documents padhता hai aur phir jo padhा uspar based likhता hai, ek guarantee ke saath: agar koi document jo function ne padhा transaction commit hone se pehle badal jाता hai, poora function **discard aur re-run** hota hai fresh data ke saath.

Transaction ke andar rules:
- **Saare reads saare writes se pehle aane chahiye.**
- Function **кई baar chal sakta hai**, to ise side effects se free honा chahiye.
- Writes buffered hote hain.

Transactions **read-modify-write** ke liye hain jahaan ek concurrent change aapke write ko galat banा deता.

## Batched writes

\`writeBatch()\` **500 tak writes** group karта hai jo **atomically** commit hote hain. Ek transaction ke विपरीत, ek batch:
- **kुछ padh nahi sakta**;
- **retry nahi karता**;
- ek single network round trip hai.

Ek batch istemal karो jab aap pehle se har write jानते ho.

## Offline persistence

Client SDK ka ek **local cache** hai aur poori tarah offline kaam karता hai:
- **Reads** offline hone par cache se serve hote hain.
- **Writes** offline banाye gaye local cache par **turant** apply hote hain aur queue hote hain.
- Mobile par offline persistence **default se enabled** hai. Web par ye **opt-in** hai.

## Latency compensation

Jab aapका app ek write karता hai, Firestore **local cache pehle update karता hai aur synchronously aapke listeners ko notify karता hai**, write server tak pahunचne se pehle.

\`snapshot.metadata.hasPendingWrites\` ek document ke liye \`true\` hai jiska local state abhi tak server dwara acknowledge na kiye gaye writes include karता hai.

## Choosing

- **Kya likhना decide karne ke liye data padhना, aur ek concurrent change result corrupt karega?** → transaction.
- **Saare writes pehle se pata, bas atomicity chahiye?** → batched write.
- **Single-document atomic field change?** → koi nahi; \`FieldValue.increment\` ke saath ek plain \`update\` pehle se atomic hai.`,

    examples: [
      {
        title: 'A transaction re-runs if a document it read was changed by someone else',
        titleHi: 'Ek transaction re-run hota hai agar isne padha document kisi aur ne badla',
        code: `// transfer 500 from a1 to a2, but only if a1 can afford it:
await db.runTransaction(async (tx) => {
  const a1 = await tx.get(db.collection("accounts").doc("a1"));   // reads first
  const a2 = await tx.get(db.collection("accounts").doc("a2"));
  if (a1.data().balance < 500) throw new Error("insufficient funds");
  tx.update(db.collection("accounts").doc("a1"), { balance: a1.data().balance - 500 });  // then writes
  tx.update(db.collection("accounts").doc("a2"), { balance: a2.data().balance + 500 });
});
// if another client modified a1 or a2 between the reads and the commit,
// the whole function above runs again with fresh balances.
console.log("transfer committed");`,
        output: `transfer committed`,
        explain: 'The transaction does both reads (`tx.get(a1)`, `tx.get(a2)`) first, checks the balance, then does both writes. Firestore records the versions of `a1` and `a2` it read, and commits only if neither changed in the meantime; if either did, the whole function re-runs with fresh balances. On a clean run it commits and prints `transfer committed`.',
        explainHi: 'Transaction dono reads (`tx.get(a1)`, `tx.get(a2)`) pehle karता hai, balance check karता hai, phir dono writes karता hai. Firestore `a1` aur `a2` ke jo versions padhे unhe record karता hai, aur commit sirf tab karता hai agar is beech koi na badla; agar koi badla, poora function fresh balances ke saath re-run hota hai. Ek clean run par ye commit karता hai aur `transfer committed` print karта hai.',
      },
      {
        title: 'A batched write lands all-or-nothing — order created, count bumped, cart cleared together',
        titleHi: 'Ek batched write all-or-nothing land hota hai',
        code: `const batch = db.batch();
batch.set(db.collection("orders").doc("o1"), { userId: "u1", total: 4999, status: "placed" });
batch.update(db.collection("users").doc("u1"), { orderCount: FieldValue.increment(1) });
batch.delete(db.collection("carts").doc("u1"));

await batch.commit();
console.log("order placed, user updated, cart cleared — atomically");`,
        output: `order placed, user updated, cart cleared — atomically`,
        explain: "A `writeBatch` groups a `set`, an `update`, and a `delete`. `batch.commit()` applies all three atomically in one round trip — the order is created, the user's `orderCount` is incremented, and the cart is deleted, all together or not at all. A batch makes no decisions on current data, so it never reads and never retries.",
        explainHi: 'Ek `writeBatch` ek `set`, ek `update`, aur ek `delete` group karता hai. `batch.commit()` teenो ko ek round trip mein atomically apply karता hai — order create hota hai, user ka `orderCount` increment hota hai, aur cart delete hota hai, sab saath ya bilkul nahi. Ek batch current data par koi decision nahi leता, to ye kabhi padhता nahi aur kabhi retry nahi karता.',
      },
      {
        title: 'Offline: a write applies to the cache immediately, syncs later',
        titleHi: 'Offline: ek write turant cache par apply hota hai, baad mein sync hota hai',
        code: `// device goes offline...
const ref = db.collection("notes").doc("n1");

// this write does NOT throw — it applies locally and queues:
await ref.set({ text: "buy milk", done: false });

// a listener attached locally sees it right away:
const snap = await ref.get();
console.log(snap.data().text, "| fromCache:", snap.metadata.fromCache,
            "| pending:", snap.metadata.hasPendingWrites);

// ...when the device reconnects, the queued write is sent to the server automatically.`,
        output: `buy milk | fromCache: true | pending: true`,
        explain: 'Offline, `ref.set(...)` does NOT throw — the write is applied to the local cache immediately and queued for the server. A local read (or an `onSnapshot` listener) sees the new value right away: `text` is `"buy milk"`, `metadata.fromCache` is `true` (served from cache, no server contact), and `hasPendingWrites` is `true` (the server hasn\'t acknowledged it). On reconnect the queued write is sent automatically.',
        explainHi: 'Offline, `ref.set(...)` throw NAHI karता — write turant local cache par apply hota hai aur server ke liye queue hota hai. Ek local read (ya ek `onSnapshot` listener) naye value ko turant dekhता hai: `text` `"buy milk"` hai, `metadata.fromCache` `true` hai (cache se serve, koi server contact nahi), aur `hasPendingWrites` `true` hai (server ne ise acknowledge nahi kiya). Reconnect par queued write automatically bheja jाता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// doing a read AFTER a write inside a transaction
await db.runTransaction(async (tx) => {
  tx.update(counterRef, { value: FieldValue.increment(1) });
  const snap = await tx.get(counterRef);   // ERROR: reads must come before writes
  // ...
});`,
        right: `await db.runTransaction(async (tx) => {
  const snap = await tx.get(counterRef);              // all reads first
  const next = snap.data().value + 1;
  tx.update(counterRef, { value: next });             // then all writes
});`,
        why: 'A Firestore transaction operates by recording which documents were read during its read phase and the versions they were at, then attempting to commit its buffered writes only if none of those documents changed in the meantime, re-running the whole function if any did. This model requires all reads to happen before any writes, because the writes are buffered and not visible until commit, so a read performed after a write in the same transaction could neither see that write nor be tracked coherently against the commit-time conflict check. The SDK enforces this by rejecting a read issued after a write within a transaction. The correct structure is always the same: perform every read the transaction needs at the top, compute the new values from what was read, then issue every write. If a later decision depends on a document not read initially, it must still be read in the initial read phase even if it turns out not to be needed.',
        whyHi: 'Ek Firestore transaction ye record karके operate karता hai ki iske read phase ke dauран kaunसे documents padhे gaye aur wo kis version par thे, phir apne buffered writes ko commit karने ki koshish karता hai sirf agar un documents mein se koi is beech badla nahi. Ye model saare reads ko kisī bhi write se pehle hone ki zaroorat karता hai, kyunki writes buffered hote hain. SDK ise enforce karता hai ek transaction ke andar ek write ke baad issue kiye gaye read ko reject karके. Sahi structure hamesha wahi hai: har read top par, phir har write.',
      },
      {
        wrong: `// side effects inside a transaction function
await db.runTransaction(async (tx) => {
  const snap = await tx.get(orderRef);
  tx.update(orderRef, { status: "paid" });
  await sendConfirmationEmail(snap.data().email);   // BUG: the tx may retry,
  // sending the email 2-3 times; or the tx may fail after the email is sent
});`,
        right: `let orderEmail;
await db.runTransaction(async (tx) => {
  const snap = await tx.get(orderRef);
  orderEmail = snap.data().email;
  tx.update(orderRef, { status: "paid" });
});
// transaction has committed exactly once — now do the side effect:
await sendConfirmationEmail(orderEmail);`,
        why: 'The function passed to runTransaction can be executed more than once, because whenever a document it read is found to have changed before the transaction could commit, Firestore discards that attempt and runs the function again from the start with fresh data. Any effect the function has other than the Firestore writes it registers, such as sending an email, calling an external API, incrementing an in-memory counter, or writing a file, will therefore happen once per attempt rather than once per successful transaction, and may happen even on an attempt that ultimately fails and never commits. The function must be a pure computation over its reads that produces only buffered Firestore writes. Anything with an external effect is captured as data during the transaction and performed afterward, once, only after the transaction has been confirmed to have committed.',
        whyHi: '`runTransaction` ko pass kiya gaya function ek se zyada baar execute ho sakta hai, kyunki jab bhi ek document jo isne padhा transaction commit hone se pehle badla hua paya jाता hai, Firestore us attempt ko discard karता hai aur function ko shuru se phir chalाता hai. Function ka koi bhi effect Firestore writes ke alawa, jaisे ek email bhejना, prati attempt hoga na ki prati successful transaction. Function apne reads par ek pure computation honा chahiye. Bahari effect waali koi bhi cheez transaction ke dauран data ke roop mein capture ki jाती hai aur baad mein perform ki jाती hai, ek baar.',
      },
      {
        wrong: `// using a transaction just to increment a single-document counter
await db.runTransaction(async (tx) => {
  const snap = await tx.get(postRef);
  tx.update(postRef, { likes: snap.data().likes + 1 });
});
// -- works, but it's a full read + conflict-checked commit + possible retries
//    for something that has a built-in atomic primitive`,
        right: `await postRef.update({ likes: FieldValue.increment(1) });
// -- a single-document update with FieldValue.increment is ALREADY atomic.
//    No read, no transaction, no retry. Use a transaction only when the write
//    depends on reading OTHER documents or multiple documents together.`,
        why: 'A write to a single Firestore document is atomic on its own, and the FieldValue sentinels such as increment, arrayUnion, and arrayRemove perform their operation server-side against the document\'s current value without the client needing to read it first, so incrementing a counter on one document is already safe under concurrency with a plain update. Wrapping that in a transaction adds a read of the document, a commit that is conditional on the document not having changed, and the possibility of the function re-running on contention, all to achieve an atomicity guarantee that the single-document update and the increment sentinel already provide. Transactions earn their cost when the write to be made depends on the current state of one or more other documents, or when several documents must be updated together based on a consistent read of all of them, because that is the situation a single-document atomic update cannot handle. For a lone counter, the sentinel is the right tool.',
        whyHi: 'Ek single Firestore document ka ek write apne aap mein atomic hai, aur FieldValue sentinels jaisे `increment` apna operation server-side document ki current value ke against perform karते hain bina client ke ise pehle padhे, to ek document par ek counter increment karना ek plain `update` ke saath pehle se concurrency ke under safe hai. Ise ek transaction mein wrap karना ek read, ek conditional commit, aur contention par function ke re-run hone ki possibility add karता hai. Transactions apni cost tab earn karते hain jab banाne waala write ek ya zyada doosरे documents ki current state par depend karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A ticket-booking flow that runs a transaction reading the seat document and writing it "held" only if still free** — two users tapping the same seat at the same time: one transaction commits, the other re-runs, sees "held", and fails cleanly.',
        hi: '**Ek ticket-booking flow jo ek transaction chalाता hai seat document padhkar aur ise "held" likhkar sirf agar abhi bhi free hai** — do users ek hi seat tap karते hain: ek commit karता hai, doosरा re-run hota hai.',
      },
      {
        en: '**Checkout as a `writeBatch`: create the order, decrement each product\'s stock, clear the cart, write an audit-log entry** — up to 500 writes, and either the whole checkout persists or none of it does.',
        hi: '**Checkout ek `writeBatch` ke roop mein: order create, har product ka stock decrement, cart clear, audit-log entry** — ya poora checkout persist hota hai ya kuch nahi.',
      },
      {
        en: '**A field-service mobile app used in basements and rural sites** — technicians file reports offline all day, the UI behaves normally the whole time, and everything syncs when they get signal, thanks to default offline persistence and latency compensation.',
        hi: '**Ek field-service mobile app basements aur rural sites mein istemal hoti hai** — technicians poore din offline reports file karते hain, UI normal behave karता hai, aur sab sync hota hai jab signal milता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'When do you use a Firestore transaction versus a batched write?',
        qHi: 'Aap ek Firestore transaction kab istemal karте ho versus ek batched write?',
        a: 'A transaction is for when the writes you need to make depend on reading current data, and a concurrent modification of that data between your read and your write would make your write incorrect. It runs a function that reads documents and then writes based on them, and it guarantees atomicity by re-running the whole function with fresh data if any document it read changed before it could commit, retrying a few times before failing. All reads in a transaction must precede all writes, and the function must have no side effects other than the Firestore writes because it may run multiple times. Typical uses are transferring a balance, decrementing inventory that must not be oversold, or assigning the next sequence number. A batched write is for when you already know every write you want to make and simply need them to be applied together atomically, all or nothing. A batch groups up to five hundred set, update, and delete operations, commits them in a single round trip, cannot read anything, and does not retry because it makes no decisions based on current state. Typical uses are creating an order document while incrementing a counter and clearing a cart as one indivisible operation. If the change is an atomic field operation on a single document, such as incrementing a counter, neither is needed: a plain update with the increment sentinel is already atomic on that document.',
        aHi: 'Ek transaction tab ke liye hai jab jo writes aapको karने hain wo current data padhने par depend karते hain, aur us data ka ek concurrent modification aapke read aur write ke beech aapke write ko galat banा dega. Ye ek function chalाता hai jo documents padhता hai aur phir unpar based likhता hai, aur ye atomicity guarantee karता hai poore function ko fresh data ke saath re-run karके agar koi document jo isne padhा badla. Saare reads saare writes se pehle. Ek batched write tab ke liye hai jab aap pehle se har write jानते ho aur bas unhe ek saath atomically apply karना chahiye. Ek batch 500 tak operations group karта hai, ek single round trip mein commit karता hai, kुछ padh nahi sakta.',
      },
      {
        q: 'How does Firestore\'s offline support and latency compensation work?',
        qHi: 'Firestore ka offline support aur latency compensation kaise kaam karता hai?',
        a: 'The client SDK maintains a local cache of the data the app has touched, and it can operate against that cache with no network. When the device is offline, reads are served from the cache, so get calls return cached results and onSnapshot listeners keep firing with cached data, each marked with a metadata flag indicating it came from the cache. Writes made while offline are applied to the local cache immediately and added to a queue, and when connectivity returns the queued writes are sent to the server in order. On mobile this offline persistence is enabled by default; on the web it is opt-in because a shared browser has different storage and trust characteristics. Latency compensation is the related behavior that applies even when online: when the app performs a write, Firestore updates the local cache and synchronously notifies the app\'s listeners before the write has reached the server, so the app\'s own UI reflects its own changes instantly rather than after a server round trip. A document whose local state includes writes the server has not yet acknowledged carries a has-pending-writes metadata flag, which the UI can use to show a sending indicator. If the server ultimately rejects a queued write, for instance because security rules deny it, the SDK rolls the local cache back and the listeners fire again with the reverted state.',
        aHi: 'Client SDK app ne jo data touch kiya uska ek local cache maintain karता hai, aur ye us cache ke against bina network ke operate kar sakta hai. Jab device offline hai, reads cache se serve hote hain. Offline banाye gaye writes local cache par turant apply hote hain aur ek queue mein add hote hain, aur connectivity wapas aane par queued writes server ko order mein bheje jाते hain. Mobile par ye default se enabled hai; web par opt-in. Latency compensation related behavior hai jo online hone par bhi apply hota hai: jab app ek write karता hai, Firestore local cache update karता hai aur synchronously listeners ko notify karता hai write server tak pahunचne se pehle.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, write the correct structure of a `runTransaction` that transfers 500 from account `a1` to `a2` only if `a1.balance >= 500`. State the ordering rule and what happens if `a1` is modified by another client mid-transaction.',
        taskHi: 'Ek comment mein, ek `runTransaction` ka sahi structure likho jo account `a1` se `a2` mein 500 transfer karta hai sirf agar `a1.balance >= 500`.',
        hint: 'ALL reads (`tx.get(a1)`, `tx.get(a2)`) first, then the check, then ALL writes (`tx.update`). If `a1` changes before commit, the entire function re-runs with fresh data (a few retries, then it fails).',
        hintHi: 'SAARE reads pehle, phir check, phir SAARE writes. Agar `a1` commit se pehle badalता hai, poora function fresh data ke saath re-run hota hai.',
      },
      {
        task: 'You need to: create `orders/o1`, do `users/u1.orderCount += 1`, and delete `carts/u1`, all atomically, with no reads involved. In a comment, state whether you use a transaction or a `writeBatch` and why, and sketch the 3 calls.',
        taskHi: 'Aapको chahiye: `orders/o1` create karna, `users/u1.orderCount += 1`, aur `carts/u1` delete karna, sab atomically, bina reads ke.',
        hint: '`writeBatch` — you know all 3 writes up front, no read needed. `batch.set(ordersO1, {...})`, `batch.update(usersU1, { orderCount: FieldValue.increment(1) })`, `batch.delete(cartsU1)`, `await batch.commit()`. Cheaper than a transaction, no retries.',
        hintHi: '`writeBatch` — aap saare 3 writes pehle se jानते ho, koi read nahi chahiye. Transaction se sasta.',
      },
      {
        task: 'A note-taking app writes `notes/n1` while the device is offline. In a comment, describe: (a) does the `set()` call throw? (b) what does an attached `onSnapshot` listener show? (c) what do `snap.metadata.fromCache` and `hasPendingWrites` report? (d) what happens on reconnect?',
        taskHi: 'Ek note-taking app device offline hone par `notes/n1` likhता hai. Ek comment mein, batao: (a) kya `set()` call throw karता hai? (b) ek onSnapshot listener kya dikhाता hai?',
        hint: '(a) no — it applies to the cache and queues. (b) the listener fires immediately with the new value (latency compensation). (c) `fromCache: true`, `hasPendingWrites: true`. (d) the queued write is sent to the server automatically, in order.',
        hintHi: '(a) nahi — ye cache par apply hota hai aur queue hota hai. (b) listener turant naye value ke saath fire karta hai. (c) `fromCache: true`, `hasPendingWrites: true`. (d) queued write automatically server ko bheja jाता hai.',
      },
    ],

    keyTakeaways: [
      '`runTransaction(fn)` = atomic READ-then-WRITE. If any doc the fn read changed before commit, the WHOLE fn is discarded and RE-RUN with fresh data (a few retries, then fails). RULES: all reads before all writes; fn may run multiple times so it must have NO side effects (no emails, no external API calls) beyond the Firestore writes. For read-modify-write where a concurrent change corrupts your write: balance transfer, inventory, sequence numbers.',
      '`writeBatch()` = up to 500 writes (set/update/delete), all-or-nothing, ONE round trip. CANNOT read. Does NOT retry (makes no decisions on current data). Use when you already know every write and just need atomicity.',
      'CHOOSING: need to READ to decide what to write (+ concurrency would corrupt it) → transaction. Know all writes up front → batch (cheaper, no retries). Single-doc atomic field change (counter/array) → NEITHER — a plain `update` with `FieldValue.increment`/`arrayUnion` is already atomic on that one doc.',
      'OFFLINE (client SDK): local cache, works fully offline. READS served from cache (`onSnapshot` keeps firing, `get()` returns cached, `metadata.fromCache === true`). WRITES applied to the cache IMMEDIATELY + queued, sent to the server in order on reconnect. Default-ON on mobile, OPT-IN on web.',
      'LATENCY COMPENSATION: a write updates the local cache and synchronously notifies YOUR listeners BEFORE it reaches the server — your own UI reflects your own changes instantly. `snap.metadata.hasPendingWrites === true` while the server hasn\'t acknowledged. If the server later rejects the write (e.g. security rules), the cache rolls back and listeners fire again with the reverted state.',
    ],
    keyTakeawaysHi: [
      '`runTransaction(fn)` = atomic READ-phir-WRITE. Agar koi doc jo fn ne padhा commit se pehle badla, POORA fn discard aur RE-RUN hota hai. RULES: saare reads saare writes se pehle; fn кई baar chal sakta hai to iska KOI side effect nahi honा chahiye.',
      '`writeBatch()` = 500 tak writes, all-or-nothing, EK round trip. padh NAHI sakta. retry NAHI karता. Tab istemal karो jab aap pehle se har write jानते ho.',
      'CHOOSING: kya likhна decide karने ke liye READ karना (+ concurrency ise corrupt karega) → transaction. Saare writes pehle se pata → batch. Single-doc atomic field change → KOI NAHI — `FieldValue.increment` ke saath ek plain `update` pehle se atomic hai.',
      'OFFLINE (client SDK): local cache, poori tarah offline kaam karता hai. READS cache se serve. WRITES cache par TURANT apply + queue, reconnect par server ko order mein bheje. Mobile par default-ON, web par OPT-IN.',
      'LATENCY COMPENSATION: ek write local cache update karता hai aur synchronously AAPKE listeners ko notify karता hai server tak pahunचne se PEHLE. `snap.metadata.hasPendingWrites === true` jabtak server acknowledge nahi karता. Agar server baad mein write reject karता hai, cache roll back hota hai.',
    ],
  },

  {
    slug: 'firestore-security-rules',
    title: 'Security Rules',
    titleHi: 'Security Rules',
    description: 'Security rules are the authorization layer that makes it safe for an untrusted client to talk directly to the database. They match document paths and allow or deny reads and writes based on request.auth, the existing document, and the incoming data — and they are NOT query filters.',
    descriptionHi: 'Security rules wo authorization layer hain jo ek untrusted client ke liye database se seedhे baat karना safe banाती hain. Wo document paths match karती hain aur `request.auth`, maujूdа document, aur aane waale data ke based reads aur writes allow ya deny karती hain — aur wo query filters NAHI hain.',
    difficulty: 'HARD',
    duration: 26,
    order: 5,

    analogy: {
      en: '**A doorman with a rulebook posted at every door, who checks each person against the rule for that exact door — and if your request would take you through even one door you are not cleared for, he turns away the whole trip, not just that door.** The rulebook can check your ID badge (`request.auth`), what is currently behind the door (`resource.data`), and what you are trying to bring in (`request.resource.data`). It can even phone another room to check something (`get()`/`exists()`). What it cannot do is quietly let you into the rooms you are allowed into and skip the rest — that is a filter, and the doorman is not a filter. So your itinerary (your query) has to already match what the rulebook permits, or you are refused at the lobby.',
      hi: '**Ek doorman ek rulebook ke saath har door par posted, jo har vyakti ko us exact door ke rule ke against check karता hai — aur agar aapका request aapको ek bhi aisे door se le jाega jiske liye aap cleared nahi ho, wo poori trip turn away karता hai, sirf wo door nahi.** Rulebook aapका ID badge (`request.auth`) check kar sakti hai, door ke peeche abhi kya hai (`resource.data`), aur aap kya laने ki koshish kar rahे ho (`request.resource.data`). Wo ek doosरे room ko phone bhi kar sakti hai (`get()`/`exists()`). Jo ye nahi kar sakti wo hai chुpke se aapको un rooms mein jाने dेना jinme aap allowed ho — wo ek filter hai, aur doorman ek filter nahi hai.',
    },

    simple: `**Rules live in \`firestore.rules\`, deployed with the project. They match PATHS and
allow/deny OPERATIONS. The client SDK is subject to them; the Admin SDK bypasses them.**

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read: if request.auth != null;                       // any signed-in user
      allow write: if request.auth.uid == userId;                // only the owner
    }

    match /posts/{postId} {
      allow read: if true;                                       // public
      allow create: if request.auth.uid == request.resource.data.authorId;
      allow update, delete: if request.auth.uid == resource.data.authorId;
    }
  }
}
\`\`\`

**KEY OBJECTS:**
\`\`\`
request.auth            -- null if unauthenticated; else { uid, token: {email, ...} }
request.resource.data   -- the document AS IT WOULD BE after this write
resource.data           -- the document AS IT IS now (undefined on create)
request.time            -- server timestamp of the request
\`\`\`

**\`allow read\` splits into \`get\` (one doc) + \`list\` (a query). \`allow write\` splits
into \`create\` + \`update\` + \`delete\`.**

**RULES ARE NOT FILTERS.** A query whose results would include ONE forbidden document
is rejected ENTIRELY. Your query must constrain itself to what the rules permit.

**Rules can call \`get(/databases/$(database)/documents/...)\` and \`exists(...)\`** to check
OTHER documents (e.g. "is this user an admin?") -- billed as a read, keep it minimal.`,

    simpleHi: `**Rules \`firestore.rules\` mein rehते hain, project ke saath deployed. Wo PATHS match karती
hain aur OPERATIONS allow/deny karती hain. Client SDK inke adheen hai; Admin SDK inhe bypass karता hai.**

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth.uid == request.resource.data.authorId;
      allow update, delete: if request.auth.uid == resource.data.authorId;
    }
  }
}
\`\`\`

**KEY OBJECTS:**
\`\`\`
request.auth            -- unauthenticated par null; warna { uid, token: {email, ...} }
request.resource.data   -- document JAISA is write ke BAAD hoga
resource.data           -- document JAISA ABHI hai (create par undefined)
request.time            -- request ka server timestamp
\`\`\`

**\`allow read\` \`get\` (ek doc) + \`list\` (ek query) mein split hota hai. \`allow write\`
\`create\` + \`update\` + \`delete\` mein.**

**RULES FILTERS NAHI hain.** Ek query jiske results mein EK forbidden document hoga
POORI TARAH reject hoती hai. Aapki query khud ko rules jo permit karте hain tak constrain karना chahiye.

**Rules \`get(...)\` aur \`exists(...)\` call kar sakती hain** DOOSRE documents check karने ke liye -- ek read ke roop mein billed.`,

    content: `## What security rules are

Security rules are a **server-side authorization language** that Firestore evaluates on every request from a client SDK. They are not application code and not a filter — they are a gate. Each read or write a client attempts is checked against the rules for the path it targets, and if the rules do not explicitly allow it, it is denied.

The rules are why a mobile or web app can talk **directly** to Firestore with no backend server: the rules are the authorization logic that a backend would otherwise enforce. The Admin SDK, running on your trusted server, bypasses rules entirely.

Rules are written in \`firestore.rules\` and deployed with the project (via the CLI or CI), so they are version-controlled.

## Structure

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /<path> {
      allow <operations>: if <condition>;
    }
  }
}
\`\`\`

- **\`match /collection/{docId}\`** — a path pattern. \`{docId}\` is a wildcard bound to a variable.
- **\`allow read, write: if ...\`** — grant the listed operations when the condition is true.
  - \`read\` expands to **\`get\`** (single document) and **\`list\`** (query).
  - \`write\` expands to **\`create\`**, **\`update\`**, **\`delete\`**.
- Rules **do not cascade** to subcollections unless you use a recursive wildcard \`{document=**}\`.
- If multiple \`match\` blocks apply, access is granted if **any** grants it (rules are permissive OR, denials are the absence of a grant).

## The request and resource objects

- **\`request.auth\`** — \`null\` if the caller is unauthenticated. Otherwise \`{ uid, token }\`, where \`token\` holds the decoded auth token including \`email\`, \`email_verified\`, and any custom claims you have set (e.g. \`token.admin == true\`).
- **\`request.resource.data\`** — for a write, the document **as it would be after the write**. Used to validate incoming data.
- **\`resource.data\`** — the document **as it currently exists**. \`undefined\`/absent on \`create\`. Used to check ownership of the existing document.
- **\`request.time\`** — the server timestamp of the request.
- **\`request.method\`** — the operation (\`get\`, \`list\`, \`create\`, \`update\`, \`delete\`).

## Rule functions and cross-document checks

You can define functions for reuse:

\`\`\`
function isSignedIn() { return request.auth != null; }
function isOwner(uid) { return isSignedIn() && request.auth.uid == uid; }
\`\`\`

And you can read **other documents** inside a rule:

- **\`get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == 'admin'\`** — look up the caller's role document.
- **\`exists(/databases/$(database)/documents/bans/$(request.auth.uid))\`** — check whether a document exists.

Each \`get\`/\`exists\` in a rule is **billed as a document read** and adds latency, and there is a cap on how many can run per request, so keep cross-document checks minimal — often a custom claim on the auth token is a better place for "is this user an admin".

## Rules are not filters

This is the single most important thing to internalize. When a client runs a **query**, Firestore checks the \`list\` rule. If the query *could* return a document that the rule would not allow, **the entire query fails** — Firestore does not silently drop the disallowed documents and return the rest.

So the query must **constrain itself** to exactly what the rules permit. If the rule is \`allow list: if resource.data.ownerId == request.auth.uid\`, the query **must** include \`.where("ownerId", "==", currentUid)\`. The rule and the query are designed together: the rule expresses the boundary, and every query is written to stay inside it.

## Testing rules

Rules have a dedicated testing library (\`@firebase/rules-unit-testing\`) that runs them against the local emulator, so "a non-member cannot read this document" and "a user cannot set their own \`role\` to admin" become unit tests that run in CI. Rules are security-critical code and deserve the same test coverage as anything else.`,

    contentHi: `## Security rules kya hain

Security rules ek **server-side authorization language** hain jo Firestore ek client SDK se har request par evaluate karता hai. Wo application code nahi aur ek filter nahi — wo ek gate hain. Ek client jo har read ya write attempt karता hai wo us path ke rules ke against checked hai jise ye target karता hai, aur agar rules ise explicitly allow nahi karते, ise deny kiya jाता hai.

Rules wo hain jinki wajah se ek mobile ya web app Firestore se **seedhे** baat kar sakta hai bina backend server ke. Admin SDK rules ko poori tarah bypass karता hai.

Rules \`firestore.rules\` mein likhे jाते hain aur project ke saath deployed hote hain.

## Structure

\`\`\`
match /<path> {
  allow <operations>: if <condition>;
}
\`\`\`

- **\`match /collection/{docId}\`** — ek path pattern.
- **\`allow read, write: if ...\`**
  - \`read\` **\`get\`** aur **\`list\`** mein expand hota hai.
  - \`write\` **\`create\`**, **\`update\`**, **\`delete\`** mein.
- Rules subcollections mein **cascade nahi karती** jabtak aap ek recursive wildcard \`{document=**}\` istemal na karो.

## request aur resource objects

- **\`request.auth\`** — \`null\` agar caller unauthenticated. Warna \`{ uid, token }\`.
- **\`request.resource.data\`** — ek write ke liye, document **jaisा write ke baad hoga**.
- **\`resource.data\`** — document **jaisा abhi exist karता hai**. \`create\` par \`undefined\`.
- **\`request.time\`** — request ka server timestamp.

## Rule functions aur cross-document checks

\`\`\`
function isOwner(uid) { return request.auth != null && request.auth.uid == uid; }
\`\`\`

Aur aap ek rule ke andar **doosरे documents** padh sakते ho: \`get(...)\`, \`exists(...)\`. Har \`get\`/\`exists\` **ek document read ke roop mein billed** hai, to cross-document checks minimal rakhो.

## Rules filters NAHI hain

Ye samajhne ki sabse zaroori cheez hai. Jab ek client ek **query** chalाता hai, Firestore \`list\` rule check karता hai. Agar query ek document return kar *sakती* hai jise rule allow nahi karega, **poori query fail hoती hai**.

To query ko khud ko **constrain** karना chahiye theek wo jo rules permit karते hain. Agar rule \`allow list: if resource.data.ownerId == request.auth.uid\` hai, query mein \`.where("ownerId", "==", currentUid)\` **honा chahiye**.

## Rules testing

Rules ki ek dedicated testing library (\`@firebase/rules-unit-testing\`) hai. Rules security-critical code hain.`,

    examples: [
      {
        title: 'Owner-only write: request.auth.uid must match the document path',
        titleHi: 'Sirf-owner write: request.auth.uid document path se match karna chahiye',
        code: `// firestore.rules
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == userId;
}

// client, signed in as uid "abc":
await db.collection("users").doc("abc").update({ bio: "hi" });   // ALLOWED
await db.collection("users").doc("xyz").update({ bio: "hax" });   // DENIED`,
        output: `update users/abc  -> OK
update users/xyz  -> FirebaseError: Missing or insufficient permissions.`,
        explain: "The rule `allow write: if request.auth.uid == userId` grants a write only when the authenticated user's UID equals the `{userId}` wildcard in the path. Signed in as `abc`, writing `users/abc` is allowed; writing `users/xyz` fails with `Missing or insufficient permissions` because `abc != xyz`. The document path itself carries the ownership check.",
        explainHi: 'Rule `allow write: if request.auth.uid == userId` ek write sirf tab grant karता hai jab authenticated user ka UID path ke `{userId}` wildcard ke barabar ho. `abc` ke roop mein signed in, `users/abc` likhna allowed hai; `users/xyz` likhna `Missing or insufficient permissions` ke saath fail hota hai kyunki `abc != xyz`. Document path khud ownership check carry karता hai.',
      },
      {
        title: 'Validating incoming data with request.resource.data (and blocking privilege escalation)',
        titleHi: 'request.resource.data ke saath aane wale data ko validate karna',
        code: `match /users/{userId} {
  allow update: if request.auth.uid == userId
    // the user may change name/bio, but NOT their own role:
    && request.resource.data.role == resource.data.role
    && request.resource.data.keys().hasOnly(["name", "bio", "role"]);
}

// client, signed in as "abc":
await db.collection("users").doc("abc").update({ name: "Ravi" });          // ALLOWED
await db.collection("users").doc("abc").update({ role: "admin" });         // DENIED`,
        output: `update {name: "Ravi"}   -> OK
update {role: "admin"}   -> FirebaseError: Missing or insufficient permissions.`,
        explain: '`request.resource.data` is the document as it WOULD BE after the write; `resource.data` is the document as it IS now. The rule allows the update only if `request.resource.data.role == resource.data.role` — i.e. the write does not change `role`. So `update({ name: "Ravi" })` passes, but `update({ role: "admin" })` is denied: the user cannot escalate their own privileges even though they own the document.',
        explainHi: '`request.resource.data` document hai jaisा write ke BAAD hoga; `resource.data` document hai jaisा ABHI hai. Rule update sirf tab allow karता hai agar `request.resource.data.role == resource.data.role` — matlab write `role` nahi badalता. To `update({ name: "Ravi" })` pass hota hai, par `update({ role: "admin" })` deny hota hai: user apne khud ke privileges escalate nahi kar sakта bhale hi wo document own karता ho.',
      },
      {
        title: 'Rules are NOT filters: an unconstrained query fails instead of returning a subset',
        titleHi: 'Rules filters NAHI hain: ek unconstrained query subset lautane ke bajaay fail hoti hai',
        code: `match /notes/{noteId} {
  allow read: if resource.data.ownerId == request.auth.uid;
}

// client, signed in as "abc":
await db.collection("notes").get();                               // DENIED (could return others' notes)
await db.collection("notes").where("ownerId", "==", "abc").get(); // ALLOWED (matches the rule)`,
        output: `.get() [no filter]                 -> FirebaseError: Missing or insufficient permissions.
.where("ownerId", "==", "abc")     -> QuerySnapshot (3 docs)`,
        explain: 'The rule allows reading a note only when `resource.data.ownerId == request.auth.uid`. An unconstrained `db.collection("notes").get()` COULD return notes owned by others, so Firestore rejects the whole query with `Missing or insufficient permissions` — rules are not filters, they don\'t silently drop disallowed documents. Adding `.where("ownerId", "==", "abc")` makes every possible result provably match the rule, so it succeeds.',
        explainHi: 'Rule ek note padhna sirf tab allow karता hai jab `resource.data.ownerId == request.auth.uid`. Ek unconstrained `db.collection("notes").get()` doosron ke owned notes return kar SAKती hai, to Firestore poori query ko `Missing or insufficient permissions` ke saath reject karता hai — rules filters nahi hain, wo disallowed documents ko chुpke se drop nahi karते. `.where("ownerId", "==", "abc")` add karne se har possible result provably rule match karता hai, to ye succeed hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// shipping the "test mode" open rules to production
match /{document=**} {
  allow read, write: if true;
}
// -- ANYONE on the internet can read and overwrite your ENTIRE database.
//    (Firestore's "test mode" sets this with a 30-day expiry; people forget.)`,
        right: `match /{document=**} {
  allow read, write: if false;   // deny by default
}
// then grant specific access per collection:
match /posts/{postId} {
  allow read: if true;
  allow create: if request.auth.uid == request.resource.data.authorId;
  allow update, delete: if request.auth.uid == resource.data.authorId;
}`,
        why: 'A rule that allows read and write on the recursive wildcard path with a condition of true grants every client, authenticated or not, unrestricted access to every document in the database. Firestore\'s test mode configures exactly this rule with a time-limited expiry so that a new project is usable immediately during development, and the risk is that the project reaches production with the rule still in place, either because the expiry was extended or because the rule was copied without the expiry. The consequence is total: anyone who knows the project ID, which is embedded in the client configuration shipped with every app, can read the entire database and overwrite or delete any of it. The correct baseline is a default denial, a rule that allows nothing on the catch-all path, with specific allow rules added per collection that grant exactly the access each one needs based on authentication, ownership, and data validation. Access should be opt-in per path, never granted broadly and narrowed later.',
        whyHi: 'Ek rule jo recursive wildcard path par read aur write allow karता hai `true` condition ke saath har client ko, authenticated ho ya nahi, database ke har document ka unrestricted access grant karता hai. Firestore ka test mode theek yahi rule configure karता hai ek time-limited expiry ke saath. Risk ye hai ki project production tak pahunचता hai rule ke abhi bhi jagah par hone ke saath. Consequence total hai: koi bhi jo project ID jानta hai poora database padh sakta hai aur ise overwrite ya delete kar sakta hai. Sahi baseline ek default denial hai.',
      },
      {
        wrong: `// assuming rules filter a broad query down to the allowed rows
// rule: allow read: if resource.data.teamId in getUserTeams();
const allDocs = await db.collection("documents").get();
// "this will just return the docs I'm on a team for"
// -- NO. The query can't prove every result satisfies the rule, so it's
//    REJECTED IN FULL. You get an error, not a filtered list.`,
        right: `// the query must constrain to the same thing the rule checks:
const myTeamId = "team_42";
const docs = await db.collection("documents")
  .where("teamId", "==", myTeamId)
  .get();
// rule: allow read: if resource.data.teamId == request.auth.token.teamId;
// now every possible result provably satisfies the rule -> allowed`,
        why: 'Security rules are evaluated as an authorization decision per document, not applied as a filter over query results. When a client issues a query, Firestore must be able to determine that every document the query could return satisfies the read rule; it does this by checking the query\'s own constraints against the rule, not by running the query and testing each result. If the query does not constrain the fields the rule depends on, Firestore cannot prove the results will all be allowed, so it rejects the entire query rather than returning a partial result. This means a query cannot lean on the rules to reduce a broad request to the permitted subset. The query must include the same constraints the rule checks, so that the set of documents it can possibly return is entirely within what the rule permits. In practice the rule and the query are written as a pair: the rule defines the boundary in terms of ownership or membership, and the query filters on exactly that field with exactly that value.',
        whyHi: 'Security rules prati document ek authorization decision ke roop mein evaluate hoती hain, query results par ek filter ke roop mein apply nahi. Jab ek client ek query issue karता hai, Firestore ko ye determine karने mein saksham honा chahiye ki har document jo query return kar sakती hai read rule satisfy karता hai; ye query ke apne constraints ko rule ke against check karके karता hai. Agar query un fields ko constrain nahi karती jinpar rule depend karता hai, Firestore prove nahi kar sakta, to ye poori query reject karता hai. Rule aur query ek pair ke roop mein likhे jाते hain.',
      },
      {
        wrong: `// doing a get() lookup in a rule on a hot path, for every request
match /messages/{msgId} {
  allow read: if get(/databases/$(database)/documents/rooms/$(resource.data.roomId))
                   .data.members[request.auth.uid] == true;
}
// -- every single message read now costs an EXTRA document read for the room,
//    adds latency, and counts against the per-request lookup cap`,
        right: `// denormalize membership onto the message, or use a custom claim:
match /messages/{msgId} {
  allow read: if request.auth.uid in resource.data.roomMembers;
}
// roomMembers is written onto each message (kept in sync by a Cloud Function),
// so the rule needs no cross-document lookup`,
        why: 'A rule can call get or exists to read another document, but each such call is billed as a document read, adds network latency to the authorization check, and counts against a fixed limit on the number of cross-document accesses a single rule evaluation may perform. On a frequently accessed path, such as reading messages, a get lookup in the rule multiplies the read cost of every operation and slows every request, and a listener over many documents can hit the lookup cap. The alternatives avoid the lookup: the data the rule needs, such as the set of room members, can be denormalized onto each message document and kept in sync by a Cloud Function, so the rule checks a field already present on the document being read; or, for attributes that change rarely such as an admin flag or an organization ID, a custom claim can be set on the user\'s auth token, which the rule reads from request.auth.token with no document access at all. Cross-document lookups in rules are appropriate only for checks that are infrequent or cannot be modeled any other way.',
        whyHi: 'Ek rule doosरा document padhने ke liye `get` ya `exists` call kar sakती hai, par aisा har call ek document read ke roop mein billed hai, authorization check mein network latency add karता hai, aur ek fixed limit ke against count hota hai. Ek frequently accessed path par, ek `get` lookup har operation ki read cost multiply karता hai. Alternatives lookup avoid karते hain: jo data rule ko chahiye har message document par denormalize kiya ja sakta hai; ya ek custom claim user ke auth token par set kiya ja sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**A team-docs app where `allow read: if request.auth.uid in resource.data.memberUids`** and every query is written as `.where("memberUids", "array-contains", currentUid)` — rule and query mirror each other exactly.',
        hi: '**Ek team-docs app jahaan `allow read: if request.auth.uid in resource.data.memberUids`** aur har query `.where("memberUids", "array-contains", currentUid)` ke roop mein likhी jाती hai.',
      },
      {
        en: '**An admin flag as a custom claim (`request.auth.token.admin == true`) set by a Cloud Function** — so "admins can write any product" needs no `get()` lookup in the rule and costs nothing extra per request.',
        hi: '**Ek admin flag ek custom claim ke roop mein (`request.auth.token.admin == true`) ek Cloud Function dwara set** — to rule mein koi `get()` lookup nahi chahiye.',
      },
      {
        en: '**A CI job running `@firebase/rules-unit-testing` against the emulator** — asserting "an anonymous user gets permission-denied on `/users/*`" and "a user cannot escalate their own `role`" on every push.',
        hi: '**Ek CI job jo emulator ke against `@firebase/rules-unit-testing` chalाता hai** — har push par assert karता hai ki "ek anonymous user ko permission-denied milता hai".',
      },
    ],

    interviewQA: [
      {
        q: 'What are Firestore security rules and why are they what makes a "no backend" architecture safe?',
        qHi: 'Firestore security rules kya hain aur wo kyun wo hain jo ek "no backend" architecture ko safe banाती hain?',
        a: 'Security rules are a server-side authorization language that Firestore evaluates on every read and write issued by a client SDK. For each operation, Firestore checks the rules that match the document path being accessed, and unless a rule explicitly allows the operation, it is denied. The rules can base their decision on whether and who the caller is authenticated as, through request.auth and its uid and token claims; on the current contents of the document being accessed, through resource.data; on the data the write would produce, through request.resource.data; and on the contents of other documents, through get and exists lookups. This is exactly the authorization logic that a traditional backend server would implement between the client and the database, which is why moving it into rules lets a web or mobile app talk directly to Firestore with no server in between: the rules are the trust boundary. The client SDK is always subject to the rules; the Admin SDK, which runs only on trusted servers, bypasses them entirely. Because the rules are the security boundary, they are written in a dedicated file, deployed and version-controlled with the project, and tested with a dedicated unit-testing library against the local emulator.',
        aHi: 'Security rules ek server-side authorization language hain jo Firestore ek client SDK dwara issue kiye gaye har read aur write par evaluate karता hai. Har operation ke liye, Firestore un rules ko check karता hai jo access kiye ja rahे document path se match karती hain, aur jabtak ek rule explicitly operation allow na karे, ise deny kiya jाता hai. Rules apna decision base kar sakती hain: caller kaun authenticated hai (`request.auth`); document ki current contents (`resource.data`); jo data write produce karega (`request.resource.data`); aur doosरे documents ki contents. Ye theek wo authorization logic hai jo ek traditional backend server implement karega. Client SDK hamesha rules ke adheen hai; Admin SDK inhe bypass karता hai.',
      },
      {
        q: 'Explain "security rules are not filters" and its consequence for how you write queries.',
        qHi: '"Security rules filters nahi hain" aur queries kaise likhी jाती hain iske liye iska consequence samjhaओ.',
        a: 'When a client runs a query, Firestore does not execute the query, test each returned document against the read rule, and quietly omit the ones that fail. Instead it evaluates whether the query itself is guaranteed to only match documents the rule permits, by comparing the query\'s constraints against the rule\'s condition. If the query is not constrained enough to guarantee that every possible result satisfies the rule, Firestore rejects the entire query with a permission-denied error rather than returning a filtered subset. The consequence is that a query cannot rely on the rules to narrow a broad request down to the permitted documents; the query must explicitly include the constraints that the rule checks. If the rule permits reading a document only when its owner field equals the caller\'s uid, the query must filter on that owner field with that uid, so that the set of documents it could return is provably within what the rule allows. In practice the rule and the query are designed together as a matched pair: the rule states the boundary condition, and every query that reads that collection filters on exactly the field and value that keeps it inside the boundary.',
        aHi: 'Jab ek client ek query chalाता hai, Firestore query execute nahi karता, har returned document ko read rule ke against test nahi karता, aur chुpke se un ko omit nahi karता jo fail hote hain. Iske bजaay ye evaluate karता hai ki kya query khud guaranteed hai sirf un documents ko match karने ke liye jo rule permit karता hai. Agar query enough constrained nahi hai, Firestore poori query reject karता hai ek permission-denied error ke saath. Consequence ye hai ki ek query rules par bharoसा nahi kar sakti ek broad request ko narrow karने ke liye; query ko explicitly wo constraints include karना chahiye jo rule check karता hai. Rule aur query ek matched pair ke roop mein design kiye jाते hain.',
      },
    ],

    exercises: [
      {
        task: 'Write a `match /users/{userId}` rule block: any signed-in user can read; only the user themselves can write; and on update, the user must NOT be able to change their own `role` field. Use `request.auth`, `resource.data`, and `request.resource.data`.',
        taskHi: 'Ek `match /users/{userId}` rule block likho: koi bhi signed-in user padh sakta hai; sirf user khud likh sakta hai; aur update par, user apna `role` field NAHI badal sakта.',
        hint: '`allow read: if request.auth != null;` — `allow create: if request.auth.uid == userId;` — `allow update: if request.auth.uid == userId && request.resource.data.role == resource.data.role;` — `allow delete: if request.auth.uid == userId;`',
        hintHi: '`allow update: if request.auth.uid == userId && request.resource.data.role == resource.data.role;`',
      },
      {
        task: 'The rule is `allow read: if resource.data.ownerId == request.auth.uid`. A client signed in as `u1` runs `db.collection("notes").get()`. In a comment, explain what happens and why, and write the query that WOULD work.',
        taskHi: 'Rule `allow read: if resource.data.ownerId == request.auth.uid` hai. Ek client jo `u1` ke roop mein signed in hai `db.collection("notes").get()` chalाता hai.',
        hint: 'It fails with permission-denied — the unconstrained query could return other users\' notes, and rules are not filters, so the whole query is rejected. Works: `db.collection("notes").where("ownerId", "==", "u1").get()`.',
        hintHi: 'Ye permission-denied ke saath fail hota hai — rules filters nahi hain. Kaam karta hai: `.where("ownerId", "==", "u1")`.',
      },
      {
        task: 'In a comment, explain why doing `get(/databases/$(database)/documents/rooms/$(resource.data.roomId)).data.members[...]` in a `messages` read rule is a problem on a busy chat app, and give two alternatives.',
        taskHi: 'Ek comment mein, samjhaओ ki ek `messages` read rule mein `get(...)` karna ek busy chat app par ek problem kyun hai, aur do alternatives do.',
        hint: 'Every message read costs an extra billed document read + latency + counts against the per-request lookup cap (a listener on many messages can blow it). Alternatives: (1) denormalize `roomMembers` onto each message (Cloud Function keeps it synced), (2) a custom claim on the auth token.',
        hintHi: 'Har message read ek extra billed document read + latency cost karта hai. Alternatives: (1) `roomMembers` ko har message par denormalize karो, (2) auth token par ek custom claim.',
      },
    ],

    keyTakeaways: [
      'Security rules = a SERVER-SIDE AUTHORIZATION language Firestore evaluates on EVERY client-SDK read/write. They match a document PATH and `allow <ops>: if <condition>` — unless a rule explicitly allows an op, it\'s DENIED. They ARE the authorization logic that lets a client talk directly to the DB with no backend. Client SDK is subject to them; ADMIN SDK BYPASSES them. Written in `firestore.rules`, deployed + version-controlled.',
      '`read` → `get` (one doc) + `list` (query). `write` → `create` + `update` + `delete`. Rules DON\'T cascade into subcollections without `{document=**}`. KEY OBJECTS: `request.auth` (null if anon, else `{uid, token}` with custom claims), `resource.data` (doc AS IT IS now — undefined on create), `request.resource.data` (doc AS IT WOULD BE after the write), `request.time`.',
      'RULES ARE NOT FILTERS — the #1 thing to internalize. A query that COULD return one forbidden doc is REJECTED IN FULL (not silently trimmed). The query must CONSTRAIN itself to exactly what the rule permits: rule `allow list: if resource.data.ownerId == request.auth.uid` ⇒ query MUST `.where("ownerId", "==", uid)`. Rule + query are designed together as a matched pair.',
      'Rules can `get(/databases/$(database)/documents/...)` and `exists(...)` OTHER docs — but each is BILLED as a read, adds latency, and counts against a per-request lookup cap. On hot paths, instead: denormalize the needed field onto the doc (Cloud Function keeps it synced), OR use a CUSTOM CLAIM on the auth token (`request.auth.token.admin == true`) for rarely-changing attributes.',
      'DEFAULT DENY: `match /{document=**} { allow read, write: if false; }` then grant per-collection. NEVER ship Firestore "test mode" (`allow read, write: if true` with a 30-day expiry) to production — anyone with the project ID (it\'s in every client bundle) gets your whole DB. Test rules with `@firebase/rules-unit-testing` against the emulator in CI — they\'re security-critical code.',
    ],
    keyTakeawaysHi: [
      'Security rules = ek SERVER-SIDE AUTHORIZATION language jo Firestore HAR client-SDK read/write par evaluate karता hai. Wo ek document PATH match karती hain aur `allow <ops>: if <condition>` — jabtak ek rule explicitly ek op allow na karे, ise DENY kiya jाता hai. ADMIN SDK inhe BYPASS karता hai.',
      '`read` → `get` + `list`. `write` → `create` + `update` + `delete`. `{document=**}` ke bina rules subcollections mein cascade NAHI karती. KEY OBJECTS: `request.auth`, `resource.data` (abhi jaisा — create par undefined), `request.resource.data` (write ke baad jaisा), `request.time`.',
      'RULES FILTERS NAHI hain — #1 samajhne waali cheez. Ek query jo ek forbidden doc return kar SAKती hai POORI TARAH REJECT hoती hai. Query ko khud ko constrain karना chahiye: rule `resource.data.ownerId == request.auth.uid` ⇒ query mein `.where("ownerId", "==", uid)` ZAROORI. Rule + query ek matched pair.',
      'Rules `get(...)` aur `exists(...)` DOOSRE docs kar sakती hain — par har ek READ ke roop mein BILLED, latency add karता hai, ek per-request lookup cap ke against count hota hai. Hot paths par: field ko doc par denormalize karो, YA auth token par ek CUSTOM CLAIM istemal karो.',
      'DEFAULT DENY: `allow read, write: if false;` phir per-collection grant karो. Firestore "test mode" (`if true` 30-din expiry ke saath) KABHI production mein mat bhejो. Rules CI mein `@firebase/rules-unit-testing` se test karो.',
    ],
  },

  {
    slug: 'firestore-pricing-and-modeling-for-cost',
    title: 'The Pricing Model & Modeling for Cost',
    titleHi: 'Pricing Model Aur Cost Ke Liye Modeling',
    description: 'Firestore bills per document read, write, and delete — not per query, not per byte of compute. This single fact drives every modeling decision: a query returning 1,000 documents costs 1,000 reads, a listener on a big collection re-reads on every change, and a denormalized counter exists to turn 10,000 reads into 1.',
    descriptionHi: 'Firestore prati document read, write, aur delete bill karता hai — prati query nahi, prati byte compute nahi. Ye ek fact har modeling decision drive karता hai: ek query jo 1,000 documents return karती hai 1,000 reads cost karती hai, ek big collection par ek listener har change par re-read karता hai, aur ek denormalized counter 10,000 reads ko 1 mein badalने ke liye exist karता hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**A library that charges you per book pulled off the shelf — not per question asked, not per minute spent reading.** "How many books about databases do we have?" answered by pulling all 4,000 database books to count them costs 4,000 charges; answered by reading a single index card that says "4,000" costs one. A standing order to notify you whenever any database book changes, and re-send you the whole shelf each time, runs up charges even while you ignore the notifications. So you model for the bill: keep a running count on a card, subscribe to the narrowest shelf you can, and never pull a book you are only going to count.',
      hi: '**Ek library jo aapको shelf se nikाली gayी prati book charge karती hai — prati poochे gaye sawाl nahi, prati minute padhne mein bitाye nahi.** "Databases ke baare mein hamारे paas kitni books hain?" saare 4,000 database books nikालkar count karके answer kiya 4,000 charges cost karता hai; ek single index card padhkar jo "4,000" kehта hai ek cost karता hai. Ek standing order aapको notify karने ke liye jab bhi koi database book badalती hai, aur har baar aapको poori shelf re-send karता hai, charges badhाता hai jabki aap notifications ignore karते ho. To aap bill ke liye model karते ho: ek card par ek running count rakhो.',
    },

    simple: `**BILLING UNIT: the DOCUMENT operation. You pay for:**
\`\`\`
- DOCUMENT READS   -- 1 per document returned/read. A query returning N docs = N reads.
- DOCUMENT WRITES  -- 1 per document created or updated (a set/update = 1 write,
                      regardless of how many fields).
- DOCUMENT DELETES -- 1 per document deleted.
- STORAGE (per GB/month) and NETWORK EGRESS -- usually minor next to ops.
\`\`\`

**NOT billed:** the query itself, the number of filters, compute time, the size of a
document (within the 1MB cap). A 5-field read and a 300-field read cost the same: 1.

**THE FAN-OUT TRAP:**
\`\`\`
db.collection("orders").get()            // 50,000 orders -> 50,000 reads, every call
db.collection("orders").count().get()    // aggregation query -> ~1 read worth, no docs
db.collection("stats").doc("orders")     // { total: 50000 } kept current -> 1 read
\`\`\`

**LISTENER COST:** \`onSnapshot\` on a query bills the initial result set once, then
1 read per document that CHANGES (only the delta, not the whole set again). But a
listener on a huge, churny collection is a silent cost leak.

**MODEL FOR COST:**
\`\`\`
- keep DENORMALIZED COUNTERS (FieldValue.increment) instead of counting documents
- SUBSET pattern: store the 5 fields a list view needs so it doesn't read full docs
- paginate with limit() -- never fetch a collection "to see how big it is"
- narrow every listener to the smallest query that feeds the UI
\`\`\`

**Firestore FITS:** real-time UIs, mobile/offline, spiky traffic, small-doc-at-a-time
access. Firestore FIGHTS you: analytics, reporting, large scans, complex ad-hoc queries.`,

    simpleHi: `**BILLING UNIT: DOCUMENT operation. Aap pay karते ho:**
\`\`\`
- DOCUMENT READS   -- prati document returned 1. Ek query jo N docs return karती hai = N reads.
- DOCUMENT WRITES  -- prati document created ya updated 1 (fields chahे kitne bhi hon).
- DOCUMENT DELETES -- prati document deleted 1.
- STORAGE aur NETWORK EGRESS -- usually minor.
\`\`\`

**Bill NAHI hota:** query khud, filters ki sankhya, compute time, ek document ka size (1MB cap ke andar).

**FAN-OUT TRAP:**
\`\`\`
db.collection("orders").get()            // 50,000 orders -> 50,000 reads, har call
db.collection("orders").count().get()    // aggregation query -> ~1 read, koi docs nahi
db.collection("stats").doc("orders")     // { total: 50000 } current rakhा -> 1 read
\`\`\`

**LISTENER COST:** ek query par \`onSnapshot\` initial result set ek baar bill karता hai, phir
prati document jo BADALता hai 1 read (sirf delta). Par ek huge collection par ek listener ek silent cost leak hai.

**COST KE LIYE MODEL:**
\`\`\`
- DENORMALIZED COUNTERS rakhो (FieldValue.increment) documents count karने ke bजaay
- SUBSET pattern: wo 5 fields store karो jo ek list view ko chahiye
- limit() se paginate karो
- har listener ko sabse chhoti query tak narrow karो
\`\`\`

**Firestore FITS:** real-time UIs, mobile/offline, spiky traffic. Firestore aapse LAड़ता hai: analytics, reporting, large scans.`,

    content: `## What you are billed for

Firestore's price is dominated by **document operations**:

- **Document reads** — one unit per document read or returned by a query. A query that matches 1,000 documents costs 1,000 reads, no matter how selective the filter was. A \`get()\` on one document is one read.
- **Document writes** — one unit per document created or updated. A \`set\` or \`update\` is one write regardless of how many fields it touches; updating 40 fields is still one write.
- **Document deletes** — one unit per document deleted.
- **Storage** — per GB stored per month.
- **Network egress** — data sent out of Google Cloud.

For most apps the read/write/delete counts dominate the bill and storage is negligible.

**What is *not* billed:** the query execution itself, the number of \`where\` clauses, the complexity of the index, CPU time, and the size of a document (as long as it is under the 1MB cap). Reading a tiny document and a near-1MB document cost the same one read.

## The consequences for modeling

Because you pay per document touched, several patterns from earlier modules stop being optimizations and become necessities.

**Denormalized counters.** To show "1,240 comments" you must not read 1,240 comment documents. Keep a \`commentCount\` field on the parent and maintain it with \`FieldValue.increment(1)\` on each add and \`increment(-1)\` on each delete (via a Cloud Function trigger so it cannot drift). One read instead of 1,240.

**Aggregation queries.** Firestore has \`count()\`, \`sum()\`, and \`average()\` aggregation queries that compute server-side without returning the documents. \`count()\` is billed at a small fraction of the equivalent document reads (roughly one read per up-to-1000 index entries matched). Use it instead of fetching to count — but for a number shown on every page load, a maintained counter is still cheaper.

**The subset pattern is mandatory.** A list view that shows 20 orders with 4 fields each should read 20 small documents, not 20 full order documents with 60 fields and embedded line items. Store the list-view fields either as a denormalized projection or by keeping the list documents small and the detail in a subcollection.

**Pagination with \`limit()\`, always.** Never fetch a whole collection to display part of it or to measure it. Every screen that shows a list uses \`limit()\` and cursors.

## The listener cost model

An \`onSnapshot\` listener:

- bills the **initial snapshot** as one read per document in the result set;
- then bills **one read per document that subsequently changes** and re-enters or updates within the result — it does **not** re-read the whole result set on every change, only the delta;
- costs nothing extra to keep open (there is no per-minute charge), but a listener on a large, frequently-changing collection quietly accrues reads for changes the user may not even be looking at.

The trap is a listener with a broad query — \`onSnapshot\` on all of \`orders\` — on a busy collection: every order anyone creates or updates anywhere is a billed read for every connected client. Narrow the query (\`where("assignedTo", "==", me).where("status", "==", "open")\`) so the listener only sees what the UI actually shows.

## When Firestore fits, and when it fights you

**Fits well:**

- Real-time collaborative and live UIs — the \`onSnapshot\` model is the product.
- Mobile apps needing offline support — it is built in.
- Spiky, unpredictable traffic — it scales automatically with no capacity planning.
- Access patterns that read and write **one or a few documents at a time** by key or a narrow query.

**Fights you:**

- Analytics and reporting — "revenue by region by month for the last two years" means reading every order; export to BigQuery instead.
- Large scans or full-collection aggregations that are not a maintained counter.
- Complex ad-hoc queries — no joins, one range field, no full-text; each new query shape may need a new composite index.
- Workloads where the per-document read cost of a big result set is the dominant expense.

The rule of thumb: Firestore is priced and designed for **serving an application's live data to its users**, one interaction at a time. The moment the access pattern looks like "scan a lot of rows to compute something," it is the wrong tool and the bill will say so.`,

    contentHi: `## Aapको kiske liye bill kiya jाता hai

Firestore ka price **document operations** se dominated hai:

- **Document reads** — prati document read ya query dwara returned ek unit. Ek query jo 1,000 documents match karती hai 1,000 reads cost karती hai.
- **Document writes** — prati document created ya updated ek unit. Ek \`set\`/\`update\` ek write hai chahे kitne fields.
- **Document deletes** — prati document deleted ek unit.
- **Storage** — prati GB prati month.
- **Network egress**.

**Jo bill NAHI hota:** query execution khud, \`where\` clauses ki sankhya, index ki complexity, CPU time, aur ek document ka size (1MB cap ke andar).

## Modeling ke consequences

**Denormalized counters.** "1,240 comments" dikhाने ke liye aapको 1,240 comment documents nahi padhने chahiye. Parent par ek \`commentCount\` field rakhो aur ise \`FieldValue.increment(1)\` se maintain karो.

**Aggregation queries.** Firestore ke paas \`count()\`, \`sum()\`, \`average()\` hain jo server-side compute karते hain bina documents return kiye. \`count()\` equivalent document reads ke ek small fraction par billed hai.

**Subset pattern mandatory hai.** Ek list view jo 20 orders 4 fields ke saath dikhाता hai use 20 small documents padhने chahiye, 20 full order documents nahi.

**Hamesha \`limit()\` se pagination.** Kabhi ek poori collection fetch mat karो ise part display karने ke liye.

## Listener cost model

Ek \`onSnapshot\` listener:
- **initial snapshot** ko prati document ek read ke roop mein bill karता hai;
- phir **prati document jo baad mein badalता hai ek read** bill karता hai — ye poore result set ko re-read NAHI karता, sirf delta;
- khुला rakhने mein кुछ extra cost nahi, par ek large collection par ek listener chुpke se reads accrue karता hai.

Trap ek broad query waala listener hai ek busy collection par. Query narrow karो.

## Firestore kab fit hota hai, aur kab aapse lड़ता hai

**Achhа fit:**
- Real-time collaborative aur live UIs.
- Mobile apps jinhe offline support chahiye.
- Spiky, unpredictable traffic.
- Access patterns jo ek baar mein **ek ya кुछ documents** read/write karते hain.

**Aapse lड़ता hai:**
- Analytics aur reporting — BigQuery mein export karो.
- Large scans.
- Complex ad-hoc queries — koi joins nahi, ek range field, koi full-text nahi.

Rule of thumb: Firestore **ek application ka live data uske users ko serve karने** ke liye priced aur designed hai, ek interaction ek baar. Jis moment access pattern "кुछ compute karने ke liye bahut rows scan karो" jaisा dikhता hai, ye galat tool hai.`,

    examples: [
      {
        title: 'A query is billed per document returned — the filter\'s selectivity is irrelevant',
        titleHi: 'Ek query prati document returned billed hai',
        code: `// this matches 8,400 documents:
const snap = await db.collection("events")
  .where("type", "==", "page_view")
  .where("date", "==", "2026-09-01")
  .get();

console.log("documents:", snap.size, "-> billed reads:", snap.size);`,
        output: `documents: 8400 -> billed reads: 8400`,
        explain: 'Firestore bills one document read per document a query RETURNS, regardless of how selective the filter was. This query matches 8,400 documents, so it costs 8,400 reads — the two `where` clauses and the index that served them are free; only the returned documents are billed. Fetching a large result set to derive a single number is the full cost of reading all of it.',
        explainHi: 'Firestore prati document jo ek query RETURN karता hai ek document read bill karता hai, filter kitna bhi selective ho. Ye query 8,400 documents match karता hai, to ye 8,400 reads cost karता hai — do `where` clauses aur jo index unhe serve karता hai free hain; sirf returned documents billed hain. Ek single number derive karने ke liye ek large result set fetch karना iske sabhi ko padhने ki poori cost hai.',
      },
      {
        title: 'A maintained counter turns "how many?" from N reads into 1',
        titleHi: 'Ek maintained counter "kitne?" ko N reads se 1 mein badal deta hai',
        code: `// on every comment add (ideally in a Cloud Function trigger):
const batch = db.batch();
batch.set(db.collection("posts").doc("p1").collection("comments").doc(), { text: "nice" });
batch.update(db.collection("posts").doc("p1"), { commentCount: FieldValue.increment(1) });
await batch.commit();

// displaying the count is now ONE read, not one-per-comment:
const post = await db.collection("posts").doc("p1").get();
console.log("comments:", post.data().commentCount);`,
        output: `comments: 1241`,
        explain: "Instead of reading every comment document to count them, a `commentCount` field on the post is maintained with `FieldValue.increment(1)` on each add (here in a batch alongside the comment write; ideally in a Cloud Function trigger so it can't drift). Displaying the count is then ONE read of the post document — `1241` — instead of 1,241 reads.",
        explainHi: 'Har comment document padhkar count karने ke bजaay, post par ek `commentCount` field har add par `FieldValue.increment(1)` se maintained hota hai (yahaan comment write ke saath ek batch mein; ideally ek Cloud Function trigger mein taaki ye drift na kar sake). Count dikhाना phir post document ka EK read hai — `1241` — 1,241 reads ke bजaay.',
      },
      {
        title: 'count() aggregation: the number without paying to read the documents',
        titleHi: 'count() aggregation: documents padhe bina number',
        code: `// count() computes server-side and returns no documents:
const agg = await db.collection("orders")
  .where("status", "==", "open")
  .count()
  .get();

console.log("open orders:", agg.data().count);
// billed at roughly 1 read per 1000 matched index entries — far cheaper than
// fetching all the order documents, though a maintained counter beats it for
// a number shown on every page load.`,
        output: `open orders: 3170`,
        explain: '`count()` is an aggregation query: it computes the number on the server and returns no documents, so it is billed at roughly one read per 1,000 matched index entries rather than one read per matched document — here far cheaper than fetching all 3,170 open orders. For a number shown on every page load a maintained counter is still cheaper, but `count()` is ideal for an occasional exact count.',
        explainHi: '`count()` ek aggregation query hai: ye number server par compute karता hai aur koi documents return nahi karता, to ye lगभग prati 1,000 matched index entries ek read billed hai na ki prati matched document ek read — yahaan saare 3,170 open orders fetch karने se bahut sasta. Har page load par dikhाye gaye ek number ke liye ek maintained counter abhi bhi sasta hai, par `count()` ek occasional exact count ke liye ideal hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// fetching a collection just to count it or to show a summary number
const all = await db.collection("users").get();
document.getElementById("total").textContent = all.size;   // "1,204,853 users"
// -- you just paid for 1.2 MILLION document reads to display one number,
//    on every page load`,
        right: `// maintain a counter, or use count() for an occasional number:
const stats = await db.collection("stats").doc("users").get();
document.getElementById("total").textContent = stats.data().total;   // 1 read
// stats/users.total is bumped by a Cloud Function on user create/delete

// or, if the number is shown rarely:
const agg = await db.collection("users").count().get();   // ~a few reads, not 1.2M`,
        why: 'Firestore bills one document read for every document a query returns, with no discount for the query being a means to compute an aggregate rather than to display the documents. Fetching an entire collection to take its size, or to sum or average a field across it, therefore costs one read per document in the collection, and when that value is displayed on a page that loads frequently the cost is multiplied by the page view count. The number itself carries almost no data but paying to materialize every document to derive it is the full cost of reading them all. The alternatives are to maintain the aggregate as a stored value, a counter field updated by a Cloud Function whenever a document is added or removed so that reading the current value is a single document read, or, for a value needed only occasionally, to use Firestore\'s count, sum, and average aggregation queries, which compute server-side and are billed at a small fraction of the cost of returning the documents. Fetching the full collection is the one option that scales its cost directly with the collection size for no benefit.',
        whyHi: 'Firestore har document ke liye ek document read bill karता hai jo ek query return karती hai, query ke ek aggregate compute karने ka ek zariya hone ke liye koi discount nahi. Ek poori collection fetch karना iska size lेने ke liye isliye prati document ek read cost karता hai, aur jab wo value ek page par displayed hai jo frequently load hota hai cost page view count se multiply hoती hai. Alternatives hain aggregate ko ek stored value ke roop mein maintain karना, ya Firestore ki `count`/`sum`/`average` aggregation queries istemal karना.',
      },
      {
        wrong: `// a broad onSnapshot listener on a high-churn collection
db.collection("orders").onSnapshot((snap) => {
  dashboard.render(snap.docs);
});
// -- every order created or updated by ANY user, ANYWHERE, is a billed read
//    for THIS client. On a busy store that's thousands of reads/hour per open
//    dashboard tab, most for orders this user will never look at.`,
        right: `// narrow the listener to exactly what this view shows:
db.collection("orders")
  .where("warehouseId", "==", myWarehouse)
  .where("status", "in", ["picking", "packing"])
  .orderBy("createdAt")
  .limit(50)
  .onSnapshot((snap) => dashboard.render(snap.docs));
// -- now only changes to the ~50 relevant orders cost a read`,
        why: 'An onSnapshot listener is billed one read for each document in its initial result and then one read for each document that subsequently changes in a way that affects the result. The width of the listener\'s query therefore determines its ongoing cost: a listener whose query matches a large, frequently modified set of documents incurs a read every time any of those documents changes, for every client that has the listener open, regardless of whether the user is actively looking at that data. On a high-write collection this accumulates into a substantial continuous cost that is easy to overlook because it does not correspond to any user action. The fix is to make every listener\'s query as narrow as the view it feeds: filter to the specific subset the UI displays and bound it with a limit, so the only changes that cost a read are changes to documents actually on screen. A listener should never be broader than the data it is rendering.',
        whyHi: 'Ek `onSnapshot` listener apne initial result ke har document ke liye ek read billed hai aur phir har document ke liye ek read jo baad mein aisे badalता hai jo result ko affect karता hai. Listener ki query ki width isliye iski ongoing cost determine karती hai: ek listener jiski query ek large, frequently modified set match karती hai ek read incur karता hai har baar jab un documents mein se koi badalता hai, har client ke liye. Fix har listener ki query ko us view jitni narrow banाना hai jise ye feed karता hai.',
      },
      {
        wrong: `// choosing Firestore for an analytics / reporting workload
// "monthly revenue by product category by region, trailing 24 months"
const orders = await db.collection("orders")
  .where("createdAt", ">", twoYearsAgo)
  .get();   // ... 12 million documents
const report = aggregateInMemory(orders.docs);
// -- 12M reads per report run, plus you're fighting the no-join, one-range-field
//    query model the whole way`,
        right: `// Firestore serves the live app; analytics runs elsewhere:
// 1. Firestore -> BigQuery streaming export (the official extension)
// 2. run the report as SQL in BigQuery, which is built for full-table scans
//    and billed for that access pattern
// keep Firestore for "show this user their orders" — one narrow query, a few reads`,
        why: 'Firestore is priced and structured to serve an application\'s live data to its users one interaction at a time: reads and writes of a single document or a narrow query result, indexed so latency is independent of collection size. An analytics or reporting workload has the opposite shape, scanning a large fraction of a collection to compute aggregates across many dimensions, often over long time ranges, and Firestore bills every one of those scanned documents as a read while also lacking the joins, multi-field range filters, and grouping that such queries need. Running reporting on Firestore therefore combines a large and growing per-report cost with a constant fight against the query model. The standard architecture keeps Firestore as the operational store and streams its data into a system built for analytical access, such as BigQuery, where full-table scans and multi-dimensional aggregation are the designed-for pattern and the pricing reflects that. Each system is used for the access pattern it was built for.',
        whyHi: 'Firestore ek application ka live data uske users ko ek baar mein ek interaction serve karने ke liye priced aur structured hai. Ek analytics ya reporting workload ka opposite shape hai, ek collection ka ek large fraction scan karके aggregates compute karना, aur Firestore un scanned documents mein se har ek ko ek read ke roop mein bill karता hai jabki joins, multi-field range filters, aur grouping ki bhi kami hai. Standard architecture Firestore ko operational store ke roop mein rakhता hai aur iska data ek system mein stream karता hai jo analytical access ke liye bana hai, jaisे BigQuery.',
      },
    ],

    realWorld: [
      {
        en: '**A `stats/{collectionName}` document per big collection, each with a `count` maintained by a Cloud Function on create/delete** — every "X total" number in the app is a single read, not a collection scan.',
        hi: '**Prati big collection ek `stats/{collectionName}` document, har ek `count` ke saath jo ek Cloud Function maintain karta hai** — app mein har "X total" number ek single read hai.',
      },
      {
        en: '**A feed rendered from `feedItems` documents holding just `{ title, thumbUrl, authorName, createdAt }`** — the full article lives in `articles/{id}`, read only when the user taps through. The list costs 20 tiny reads, not 20 full articles.',
        hi: '**Ek feed jo `feedItems` documents se render hota hai jo sirf `{ title, thumbUrl, authorName, createdAt }` rakhते hain** — poora article `articles/{id}` mein rehта hai.',
      },
      {
        en: '**A Firestore-to-BigQuery export on the `orders` collection**, with all revenue dashboards querying BigQuery — Firestore never does a full scan, and the analytics team writes SQL with joins and GROUP BY.',
        hi: '**`orders` collection par ek Firestore-to-BigQuery export**, saare revenue dashboards BigQuery query karते hain — Firestore kabhi full scan nahi karता.',
      },
    ],

    interviewQA: [
      {
        q: 'How does Firestore pricing work, and how does it shape data modeling?',
        qHi: 'Firestore pricing kaise kaam karती hai, aur ye data modeling ko kaise shape karती hai?',
        a: 'Firestore bills primarily by document operations: one unit for each document read or returned by a query, one for each document created or updated regardless of how many fields the write touches, and one for each document deleted, plus comparatively minor charges for stored data and network egress. It does not bill for the query execution itself, the number or complexity of filters, CPU time, or the size of an individual document within the one-megabyte limit. Because the cost scales with the number of documents touched, several practices become mandatory rather than optional. Counts and other aggregates are kept as maintained counter fields updated by Cloud Function triggers, so displaying "1,240 comments" is one read rather than 1,240; the count, sum, and average aggregation queries are available for occasional aggregates at a fraction of the read cost but a maintained counter still wins for a number on every page load. List views read small projection documents holding just the fields the list shows, not full detail documents. Every list is paginated with limit and cursors, and a full collection is never fetched to display part of it or to measure it. Listeners are scoped to the narrowest query that feeds the view, because an onSnapshot listener is billed for its initial result and then for every subsequent document change within the result, so a broad listener on a busy collection is a continuous hidden cost.',
        aHi: 'Firestore mुख्यतः document operations se bill karता hai: prati document read ya query dwara returned ek unit, prati document created ya updated ek (fields chahे kitne bhi hon), aur prati document deleted ek, plus stored data aur network egress ke liye minor charges. Ye query execution khud, filters ki sankhya, CPU time, ya ek document ke size ke liye bill nahi karता. Kyunki cost touched documents ki sankhya se scale karती hai, кई practices mandatory ho jाती hain: maintained counter fields, subset/projection documents list views ke liye, hamesha `limit()` se pagination, aur listeners ko sabse narrow query tak scope karना.',
      },
      {
        q: 'When is Firestore a good fit, and when should you use something else?',
        qHi: 'Firestore kab ek achha fit hai, aur aapको kab кुछ aur istemal karना chahiye?',
        a: 'Firestore fits when the workload is serving an application\'s live data to its users one interaction at a time. It is strong for real-time and collaborative interfaces, because the onSnapshot listener model that pushes every change to connected clients is the core feature; for mobile apps that need to work offline, because a local cache, write queue, and latency compensation are built in; for spiky and unpredictable traffic, because it scales automatically with no capacity planning; and for access patterns that read and write one or a few documents at a time by key or a tightly scoped query. It works against you for analytics and reporting, where a query like revenue by region by month over two years must scan a large fraction of a collection and Firestore bills every scanned document as a read while also lacking joins, multi-field range filters, and grouping; the standard answer is to stream Firestore data into BigQuery and run analytics there. It is also awkward for workloads dominated by large scans or full-collection aggregations that are not maintained counters, and for applications needing complex ad-hoc queries, since each new query shape may require a new composite index and the query model forbids joins, allows a range filter on only one field, and has no native full-text search. The heuristic is that the moment the access pattern becomes "scan many documents to compute something," Firestore is the wrong tool.',
        aHi: 'Firestore tab fit hota hai jab workload ek application ka live data uske users ko ek baar mein ek interaction serve karना hai. Ye strong hai: real-time aur collaborative interfaces ke liye; mobile apps ke liye jinhe offline kaam karना chahiye; spiky aur unpredictable traffic ke liye; aur access patterns ke liye jo ek baar mein ek ya кुछ documents read/write karते hain. Ye aapke against kaam karता hai analytics aur reporting ke liye — standard answer Firestore data ko BigQuery mein stream karना hai. Heuristic ye hai ki jis moment access pattern "кुछ compute karने ke liye bahut documents scan karो" ban jाता hai, Firestore galat tool hai.',
      },
    ],

    exercises: [
      {
        task: 'An app shows a "Total posts: N" badge on every page. It currently does `db.collection("posts").get()` and reads `.size`. The collection has 240,000 documents and the site gets 100,000 page views/day. In a comment, compute the daily read cost, then describe two cheaper approaches.',
        taskHi: 'Ek app har page par ek "Total posts: N" badge dikhाता hai. Ye abhi `db.collection("posts").get()` karता hai. Collection mein 240,000 documents hain aur site ko 100,000 page views/din milते hain.',
        hint: '240,000 reads × 100,000 views = 24 billion reads/day. Cheaper: (1) a `stats/posts` doc with a `count` field maintained by a Cloud Function on create/delete → 1 read per view. (2) `count()` aggregation → ~240 reads per view (still far worse than the counter for this frequency).',
        hintHi: '240,000 × 100,000 = 24 billion reads/din. Sasta: (1) ek `stats/posts` doc ek `count` field ke saath → 1 read prati view. (2) `count()` aggregation.',
      },
      {
        task: 'In a comment, explain the cost model of `db.collection("tickets").where("assignee", "==", me).onSnapshot(...)` versus `db.collection("tickets").onSnapshot(...)` on a system with 500 agents and 20,000 open tickets churning constantly.',
        taskHi: 'Ek comment mein, `db.collection("tickets").where("assignee", "==", me).onSnapshot(...)` versus `db.collection("tickets").onSnapshot(...)` ka cost model samjhaओ.',
        hint: 'Narrow: initial ~40 reads (my tickets), then 1 read per change to MY tickets. Broad: initial 20,000 reads PER agent, then 1 read per change to ANY of 20,000 churning tickets, PER connected agent — thousands of reads/minute across the fleet for data 499 agents aren\'t looking at.',
        hintHi: 'Narrow: initial ~40 reads, phir 1 read prati change MERE tickets ka. Broad: initial 20,000 reads PRATI agent, phir 1 read prati change KISI bhi ticket ka, PRATI agent.',
      },
      {
        task: 'A team wants "monthly revenue by product category, trailing 24 months" as a dashboard in their app, data in a Firestore `orders` collection (~15M docs). In a comment, explain why running this on Firestore is a mistake and what the standard architecture is.',
        taskHi: 'Ek team apne app mein ek dashboard ke roop mein "product category se monthly revenue, trailing 24 months" chahती hai, data ek Firestore `orders` collection mein (~15M docs).',
        hint: 'It scans ~15M docs = 15M reads per report run, and Firestore has no joins / GROUP BY / multi-field ranges for this shape. Standard: Firestore→BigQuery streaming export (official extension), run the report as SQL in BigQuery which is built and priced for full-table scans. Firestore stays the operational store.',
        hintHi: 'Ye ~15M docs scan karta hai = 15M reads prati report. Standard: Firestore→BigQuery streaming export, report ko BigQuery mein SQL ke roop mein chalाओ.',
      },
    ],

    keyTakeaways: [
      'BILLING UNIT = the DOCUMENT operation. DOCUMENT READS: 1 per doc returned/read — a query matching N docs = N reads, no matter how selective the filter. DOCUMENT WRITES: 1 per doc created/updated, regardless of field count (40 fields = 1 write). DOCUMENT DELETES: 1 each. Plus storage (per GB/mo) and egress — usually minor. NOT billed: the query, the filter count, compute time, doc size (under 1MB).',
      'DENORMALIZED COUNTERS are mandatory, not an optimization: show "1,240 comments" from a maintained `commentCount` field (`FieldValue.increment(±1)` via a Cloud Function trigger) = 1 read, not 1,240. `count()`/`sum()`/`average()` aggregation queries compute server-side at ~1 read per 1000 matched index entries — good for occasional numbers, but a maintained counter still wins for a per-page-load number.',
      'SUBSET pattern is mandatory: a list view reads small projection docs holding just the fields shown (20 tiny reads), never full detail docs (20 × 60-field docs). Always paginate with `limit()` + cursors. NEVER fetch a whole collection to display part of it or to measure it.',
      'LISTENER COST: `onSnapshot` bills the initial result set once (1 read/doc), then 1 read per doc that CHANGES within the result (the DELTA only, not the whole set again). No per-minute charge — but a BROAD listener on a busy collection is a silent continuous leak: every write by anyone = a billed read for every connected client. Narrow every listener to exactly what the view shows.',
      'Firestore FITS: real-time/collaborative UIs (the `onSnapshot` model IS the product), mobile+offline, spiky autoscaling traffic, one-or-a-few-docs-at-a-time access by key/narrow query. Firestore FIGHTS you: analytics/reporting (stream to BigQuery instead), large scans, full-collection aggregations that aren\'t maintained counters, complex ad-hoc queries (no joins, one range field, no full-text, new query shape ⇒ new composite index). Heuristic: "scan many docs to compute something" ⇒ wrong tool.',
    ],
    keyTakeawaysHi: [
      'BILLING UNIT = DOCUMENT operation. READS: prati doc returned 1 — ek query jo N docs match karती hai = N reads. WRITES: prati doc created/updated 1 (fields chahे kitne bhi). DELETES: prati doc 1. Plus storage aur egress — usually minor. Bill NAHI hota: query, filter count, compute time, doc size (1MB ke andar).',
      'DENORMALIZED COUNTERS mandatory hain: "1,240 comments" ek maintained `commentCount` field se = 1 read, 1,240 nahi. `count()`/`sum()`/`average()` server-side compute karते hain — occasional numbers ke liye achhे, par ek maintained counter per-page-load number ke liye jeetता hai.',
      'SUBSET pattern mandatory hai: ek list view small projection docs padhता hai (20 chhote reads), full detail docs nahi. Hamesha `limit()` + cursors se paginate karो. KABHI ek poori collection fetch mat karो ise part display karने ke liye.',
      'LISTENER COST: `onSnapshot` initial result set ek baar bill karता hai, phir prati doc jo result mein BADALता hai 1 read (sirf DELTA). Koi per-minute charge nahi — par ek BROAD listener ek busy collection par ek silent leak hai. Har listener ko narrow karो.',
      'Firestore FITS: real-time/collaborative UIs, mobile+offline, spiky traffic, key/narrow-query access. Firestore aapse LAड़ता hai: analytics/reporting (BigQuery mein stream karो), large scans, complex ad-hoc queries. Heuristic: "кुछ compute karने ke liye bahut docs scan karो" ⇒ galat tool.',
    ],
  },
];
