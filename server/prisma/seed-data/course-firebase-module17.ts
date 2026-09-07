/**
 * Databases Complete Course — Module 17: Cloud Firestore, lessons 1-3.
 * Part IV of the course: Firebase.
 *
 * Lesson 1: The Firestore data model — documents, collections, subcollections,
 *           no joins, the 1MB document limit, and the client vs admin SDK split.
 * Lesson 2: CRUD & real-time listeners — get/set/update/delete/add, onSnapshot,
 *           and FieldValue sentinels.
 * Lesson 3: Querying & composite indexes — where/orderBy/limit, the composite-index
 *           requirement, the operator limits, or(), and cursor pagination.
 *
 * NOTE: Firestore is a hosted Google Cloud service with no offline engine, so the
 * examples in this module are illustrative — realistic SDK code and realistic
 * results, not machine-verified against a running database the way the SQL and
 * MongoDB modules are.
 */

import type { CourseLesson } from './course-js-module1';

export const FIREBASE_MODULE_17: CourseLesson[] = [
  {
    slug: 'firestore-the-data-model',
    title: 'The Firestore Data Model',
    titleHi: 'Firestore Data Model',
    description: 'Firestore stores documents (like MongoDB\'s), grouped into collections. But a document can also contain subcollections — collections nested under it — and there are no joins at all. A document is capped at 1MB, and two SDKs (client and admin) access the same data with very different trust models.',
    descriptionHi: 'Firestore documents store karता hai (MongoDB ke jaisे), collections mein grouped. Par ek document subcollections bhi contain kar sakta hai — collections iske under nested — aur koi joins bilkul nahi. Ek document 1MB par capped hai, aur do SDKs (client aur admin) usी data ko bahut alag trust models ke saath access karте hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A building directory where each office door (a document) has a name plaque with a few facts on it, and some doors open into a hallway of more doors (a subcollection) rather than a single room.** You navigate by walking the path — "third floor, suite 12, then the meeting-rooms hallway, then room B" — never by cross-referencing a master index, because there is no master index and no way to ask "every room with a projector across the whole building" as a join. Each plaque holds only what fits on a plaque (a document has a hard size cap). And there are two ways into the building: the public entrance where a guard checks your badge against posted rules at every door (the client SDK, governed by security rules), and the service entrance the building staff use that bypasses every lock (the admin SDK, running on your trusted server).',
      hi: '**Ek building directory jahaan har office door (ek document) par ek name plaque hai kुछ facts ke saath, aur kुछ doors ek single room ke bजaay aur doors ke ek hallway (ek subcollection) mein khulते hain.** Aap path walk karके navigate karते ho — "teesरा floor, suite 12, phir meeting-rooms hallway, phir room B" — kabhi ek master index cross-reference karके nahi, kyunki koi master index nahi hai aur "poore building mein projector waala har room" ek join ke roop mein poochne ka koi tarika nahi. Har plaque sirf wo rakhता hai jo ek plaque par fit hota hai (ek document ki ek hard size cap hai). Aur building mein do raste hain: public entrance jahaan ek guard har door par aapka badge posted rules ke against check karता hai (client SDK), aur service entrance jo building staff istemal karते hain jo har lock bypass karता hai (admin SDK).',
    },

    simple: `**HIERARCHY: (project) -> COLLECTION -> DOCUMENT -> SUBCOLLECTION -> DOCUMENT -> ...**

\`\`\`
users (collection)
  └─ user_abc (document)  { name: "Ravi", plan: "pro" }
       └─ orders (subcollection)
            └─ order_1 (document)  { total: 4999, status: "shipped" }
            └─ order_2 (document)  { total: 1299, status: "pending" }
\`\`\`

**A path always ALTERNATES collection / document:**

\`\`\`js
db.collection("users").doc("user_abc")                          // a document
db.collection("users").doc("user_abc").collection("orders")     // a subcollection
db.collection("users").doc("user_abc").collection("orders").doc("order_1")  // a document
\`\`\`

**NO JOINS.** You cannot query "orders JOIN users". You either denormalize the user
fields you need onto each order, or fetch the user and its orders separately.

**A DOCUMENT is capped at 1 MiB** (~1,048,576 bytes). Subcollections do NOT count toward
their parent document's size -- that is exactly why deep hierarchies are used for
unbounded child data (the opposite of MongoDB, where you'd use a separate collection).

**TWO SDKs, two trust models:**
\`\`\`
CLIENT SDK  -- runs in the browser / mobile app. Every read and write is checked
               against SECURITY RULES (Lesson 5). The user is untrusted.
ADMIN SDK   -- runs on YOUR server (Node, Cloud Functions). BYPASSES all security
               rules -- full access. Never ship admin credentials to a client.
\`\`\``,

    simpleHi: `**HIERARCHY: (project) -> COLLECTION -> DOCUMENT -> SUBCOLLECTION -> DOCUMENT -> ...**

\`\`\`
users (collection)
  └─ user_abc (document)  { name: "Ravi", plan: "pro" }
       └─ orders (subcollection)
            └─ order_1 (document)  { total: 4999, status: "shipped" }
\`\`\`

**Ek path hamesha ALTERNATE karता hai collection / document:**

\`\`\`js
db.collection("users").doc("user_abc")                          // ek document
db.collection("users").doc("user_abc").collection("orders")     // ek subcollection
\`\`\`

**KOI JOINS NAHI.** Aap "orders JOIN users" query nahi kar sakते. Aap ya to jo user fields
chahiye unhe har order par denormalize karते ho, ya user aur iske orders alag se fetch karते ho.

**Ek DOCUMENT 1 MiB par capped hai.** Subcollections apne parent document ke size ki taraf
count NAHI karती -- isिlye unbounded child data ke liye deep hierarchies istemal hoती hain
(MongoDB ke opposite).

**DO SDKs, do trust models:**
\`\`\`
CLIENT SDK  -- browser / mobile app mein chalता hai. Har read aur write SECURITY RULES
               (Lesson 5) ke against checked hai. User untrusted hai.
ADMIN SDK   -- AAPKE server par chalता hai. Saare security rules BYPASS karता hai -- full access.
\`\`\``,

    content: `## Documents and collections

Firestore's basic units are the same as MongoDB's: a **document** is a record of field/value pairs (with a richer set of types than JSON — timestamps, geopoints, references, nested maps and arrays), and a **collection** is a container of documents. A collection has no schema; its documents can differ in shape.

The differences start with structure.

## Subcollections and the alternating path

A Firestore document can itself contain **subcollections** — collections nested *inside* the document. So the hierarchy is not two levels (collection → document) but arbitrarily deep, always alternating:

\`\`\`
collection / document / collection / document / collection / document / ...
\`\`\`

\`\`\`js
// path to a document three levels deep:
db.collection("teams").doc("t1")
  .collection("projects").doc("p1")
  .collection("tasks").doc("task_9")
\`\`\`

Every path has an odd number of segments to reach a document (\`teams/t1/projects/p1/tasks/task_9\`) and an even number to reach a collection.

**Subcollection data does not count toward the parent document's size.** This is the key architectural difference from MongoDB. In MongoDB, an unbounded list of children goes in a *separate top-level collection* referenced by id, because embedding it would blow past the 16MB document cap. In Firestore, an unbounded list of children goes in a *subcollection under the parent document*, because a subcollection is independent of the parent's 1MB cap and is naturally scoped to that parent.

## No joins

Firestore has **no join operation of any kind**. A query runs against exactly one collection (or, with a collection group query, against every collection with a given name — Lesson 3), and returns whole documents from it. You cannot combine data from two collections in a single query.

The consequences for modeling:

- **Denormalize** the fields from a related document that you need to display alongside a document. An order that shows the customer's name stores \`customerName\` directly (the extended-reference pattern from MongoDB Module 14, now not optional but required).
- **Fetch separately** when you genuinely need the full related document: get the order, read its \`customerId\`, then get that customer document in a second round trip.
- **Structure the hierarchy** so the data you access together is under one path — a user's orders as a subcollection of the user, so "this user's orders" is one collection query with no cross-referencing.

## The 1MB document limit

A single document is capped at **1 MiB** (1,048,576 bytes) including field names and all nested data. This is much smaller than MongoDB's 16MB, which pushes Firestore modeling even harder toward keeping documents small and moving anything that grows into a subcollection.

## Client SDK vs Admin SDK

The same Firestore database is reached through two different SDKs with opposite trust models:

- **The client SDK** runs in an untrusted environment — a web browser, an iOS or Android app. Every read and write it issues is evaluated against the project's **security rules** (Lesson 5) before Firestore executes it. The client SDK is what makes "the mobile app talks directly to the database, no backend" possible — the security rules *are* the backend's authorization logic.
- **The admin SDK** runs in a trusted environment — your own Node.js server, a Cloud Function, a backend job — authenticated with a service-account key. It **bypasses security rules entirely** and has full read/write access to everything. It is for server-side work: administrative operations, data migrations, aggregations, anything that needs to act with more authority than any end user.

The critical rule: **admin credentials must never reach a client.** A service-account key in client code, or an admin SDK bundled into a mobile app, hands every user unrestricted access to the entire database.`,

    contentHi: `## Documents aur collections

Firestore ke basic units MongoDB ke jaisे hain: ek **document** field/value pairs ka ek record hai, aur ek **collection** documents ka ek container hai.

Differences structure se shuru hote hain.

## Subcollections aur alternating path

Ek Firestore document khud **subcollections** contain kar sakta hai — collections document ke *andar* nested. To hierarchy arbitrarily deep hai, hamesha alternate karте hue:

\`\`\`
collection / document / collection / document / ...
\`\`\`

**Subcollection data parent document ke size ki taraf count NAHI karता.** Ye MongoDB se key architectural antar hai. MongoDB mein, children ki ek unbounded list ek *alag top-level collection* mein jाती hai. Firestore mein, ek unbounded list *parent document ke under ek subcollection* mein jाती hai.

## Koi joins nahi

Firestore mein **kisī bhi tarah ka koi join operation nahi**. Ek query theek ek collection ke against chalती hai.

Modeling ke consequences:
- **Denormalize** un fields ko jo aapको ek related document se display karने ke liye chahiye.
- **Alag se fetch karो** jab aapको genuinely poora related document chahiye.
- **Hierarchy structure karो** taaki jo data aap saath access karते ho ek path ke under ho.

## 1MB document limit

Ek single document **1 MiB** par capped hai. Ye MongoDB ke 16MB se bahut chhota hai.

## Client SDK vs Admin SDK

- **Client SDK** ek untrusted environment mein chalता hai. Har read aur write project ke **security rules** (Lesson 5) ke against evaluate hoती hai.
- **Admin SDK** ek trusted environment mein chalता hai — aapका apna server. Ye **security rules ko poori tarah bypass karता hai**.

Critical rule: **admin credentials kabhi ek client tak nahi pahunचne chahiye.**`,

    examples: [
      {
        title: 'A path to a nested document alternates collection and document segments',
        titleHi: 'Ek nested document ka path collection aur document segments alternate karta hai',
        code: `// reference a task three levels deep:
const taskRef = db
  .collection("teams").doc("t1")
  .collection("projects").doc("p1")
  .collection("tasks").doc("task_9");

console.log(taskRef.path);`,
        output: `teams/t1/projects/p1/tasks/task_9`,
        explain: 'A Firestore path alternates collection / document segments, so reaching a document three levels deep names each collection and the document ID inside it: `teams` (collection) → `t1` (document) → `projects` → `p1` → `tasks` → `task_9`. The result is a 5-segment path with an odd segment count — every document path has an odd count, every collection path an even one.',
        explainHi: 'Ek Firestore path collection / document segments alternate karta hai, to teen level deep ek document tak pahunchne ke liye har collection aur uske andar ka document ID name hota hai: `teams` (collection) → `t1` (document) → `projects` → `p1` → `tasks` → `task_9`. Result ek 5-segment path hai ek odd segment count ke saath — har document path ka odd count hota hai, har collection path ka even.',
      },
      {
        title: 'Unbounded child data goes in a subcollection (not counted against the parent\'s 1MB)',
        titleHi: 'Unbounded child data ek subcollection mein jata hai',
        code: `// the user document stays small:
await db.collection("users").doc("u1").set({ name: "Ravi", plan: "pro" });

// the user's orders — potentially thousands — go in a subcollection:
await db.collection("users").doc("u1").collection("orders").add({ total: 4999, status: "shipped" });
await db.collection("users").doc("u1").collection("orders").add({ total: 1299, status: "pending" });

// "this user's orders" is one collection query, no join:
const snap = await db.collection("users").doc("u1").collection("orders").get();
console.log(snap.size);`,
        output: `2`,
        explain: 'The user document holds only small, bounded fields. The orders — which could grow without limit — go in an `orders` subcollection under `users/u1`, and a subcollection\'s documents do NOT count toward the parent document\'s 1MB cap. `.collection("users").doc("u1").collection("orders").get()` returns just that user\'s orders as one collection query — no join, `snap.size` is 2.',
        explainHi: 'User document sirf chhote, bounded fields rakhता hai. Orders — jo bina limit badh sakte hain — `users/u1` ke under ek `orders` subcollection mein jाते hain, aur ek subcollection ke documents parent document ke 1MB cap ki taraf count NAHI karते. `.collection("users").doc("u1").collection("orders").get()` sirf us user ke orders ek collection query ke roop mein return karता hai — koi join nahi, `snap.size` 2 hai.',
      },
      {
        title: 'No joins: denormalize the fields you need to display together',
        titleHi: 'Koi joins nahi: jo fields saath display karne hain unhe denormalize karo',
        code: `// an order stores a copy of the customer's display name — there is no way to
// join orders to customers in a query:
await db.collection("orders").doc("o1").set({
  customerId: "u1",
  customerName: "Ravi Kumar",   // denormalized copy, required (not optional)
  total: 4999,
});

// rendering an orders list needs zero extra reads for the customer name:
const snap = await db.collection("orders").where("total", ">", 1000).get();
snap.forEach((d) => console.log(d.data().customerName, d.data().total));`,
        output: `Ravi Kumar 4999`,
        explain: 'Firestore has no join, so the order stores its own copy of `customerName`. The orders query then renders the customer name with zero extra reads — `d.data().customerName` is right there on each order document. The cost is that the copy must be kept in sync if the customer renames (typically a Cloud Function on the customer document).',
        explainHi: 'Firestore mein koi join nahi, to order apni khud ki `customerName` copy store karता hai. Orders query phir customer name zero extra reads ke saath render karता hai — `d.data().customerName` har order document par wahi hai. Cost ye hai ki copy ko sync mein rakhna hoga agar customer rename karता hai (typically customer document par ek Cloud Function).',
      },
    ],

    mistakes: [
      {
        wrong: `// bundling the Admin SDK (or a service-account key) into a mobile / web app
import admin from "firebase-admin";
admin.initializeApp({ credential: admin.credential.cert(serviceAccountJson) });
// -- this key is now in the app bundle. Anyone can extract it and get
//    UNRESTRICTED read/write access to the entire Firestore database,
//    bypassing every security rule.`,
        right: `// client apps use the CLIENT SDK with the public config; security rules govern access:
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const app = initializeApp({ apiKey: "...", projectId: "...", /* public config, safe to ship */ });
const db = getFirestore(app);
// -- the Admin SDK stays on your server / Cloud Functions only`,
        why: 'The Admin SDK authenticates with a service-account credential that grants full, unrestricted access to every document in the project and completely bypasses the security rules that would otherwise constrain what a given user can read or write. It is designed for trusted server environments where the code and its credentials are not exposed. Bundling the Admin SDK or a service-account key into a client application, whether web or mobile, places that credential in an artifact that runs on end-user devices and can be extracted from the app bundle or network traffic, at which point anyone who obtains it has complete control over the entire database with no rules applied. Client applications must use the client SDK, which is initialized with the project\'s public configuration, information that is safe to expose because it identifies the project but grants no access on its own, and whose every operation is evaluated against the security rules. The Admin SDK belongs exclusively on servers and in Cloud Functions.',
        whyHi: 'Admin SDK ek service-account credential se authenticate karता hai jo project ke har document ka full, unrestricted access grant karता hai aur security rules ko poori tarah bypass karता hai. Ise trusted server environments ke liye design kiya gaya hai. Admin SDK ya ek service-account key ko ek client application mein bundle karना us credential ko ek artifact mein daalता hai jo end-user devices par chalता hai aur app bundle se extract kiya ja sakta hai. Client applications ko client SDK istemal karना chahiye, jo project ke public configuration se initialize hota hai.',
      },
      {
        wrong: `// modeling Firestore like a relational schema and expecting to join
const orders = await db.collection("orders").get();
const users = await db.collection("users").get();
// then joining in application code:
const joined = orders.docs.map((o) => ({
  ...o.data(),
  user: users.docs.find((u) => u.id === o.data().customerId)?.data(),
}));
// -- you just downloaded EVERY order and EVERY user (billed per document read)
//    to reconstruct a join Firestore won't do for you`,
        right: `// denormalize the user fields the order view needs, onto the order:
await db.collection("orders").doc("o1").set({
  customerId: "u1", customerName: "Ravi Kumar", customerTier: "gold", total: 4999,
});
// the orders query alone now has everything the view shows -- no second collection`,
        why: 'Firestore has no join capability, so reconstructing a join in application code requires downloading the full contents of both collections and matching them client-side, which is billed as one document read per document in each collection and does not scale as the collections grow. The document model expects related data that is displayed together to be denormalized: the specific fields from a related document that a view needs are copied onto the documents that view queries, so that a single collection query returns everything required to render without touching a second collection. This is the same extended-reference pattern used in MongoDB, but in Firestore it is not an optimization to reach for when a join becomes hot, it is the only way to combine data from two entities in one query, because the alternative of a real join does not exist. The trade-off is the familiar one: denormalized copies must be kept in sync when the source changes, typically via a Cloud Function triggered on the source document.',
        whyHi: 'Firestore mein koi join capability nahi hai, to application code mein ek join reconstruct karना dono collections ke full contents download karна require karता hai, jo prati document ek document read ke roop mein billed hai. Document model expect karता hai ki jo related data saath display hota hai denormalized ho: ek related document se specific fields jo ek view ko chahiye us view jo documents query karता hai unpar copy hoती hain. Ye MongoDB mein istemal kiya gaya wahi extended-reference pattern hai, par Firestore mein ye ekmatra tarika hai.',
      },
      {
        wrong: `// putting an ever-growing array or map inside a single document
await db.collection("chatRooms").doc("room1").set({
  messages: [ /* one entry appended per message, forever */ ],
});
// -- every new message rewrites the whole document, and it will hit the 1MB
//    cap (far sooner than MongoDB's 16MB) and stop accepting messages`,
        right: `// messages go in a subcollection — independent of the room document's 1MB cap:
await db.collection("chatRooms").doc("room1").collection("messages").add({
  text: "hello", sentAt: FieldValue.serverTimestamp(), userId: "u1",
});
// each message is one small document; the room document stays tiny`,
        why: 'A Firestore document has a hard size limit of one mebibyte, and every write to a document rewrites the entire document, so an array or map field that accumulates an entry per event grows the document on every write, makes each write progressively more expensive, and eventually reaches the size limit, after which further appends fail and the document can no longer be updated. This is the same unbounded-array anti-pattern that applies in MongoDB, but the one-megabyte cap is reached far sooner than MongoDB\'s sixteen-megabyte cap. Firestore\'s answer is the subcollection: because a subcollection\'s documents do not count toward the parent document\'s size, an unbounded set of children such as chat messages, activity entries, or comments is placed in a subcollection under the parent document, where each child is its own small document and the parent stays small indefinitely. This is a case where Firestore\'s deep-hierarchy model is a genuine advantage: the subcollection is naturally scoped to its parent and imposes no size pressure on it.',
        whyHi: 'Ek Firestore document ka ek hard size limit ek mebibyte hai, aur ek document ke har write poore document ko rewrite karता hai, to ek array ya map field jo prati-event ek entry accumulate karता hai har write par document ko badhाता hai aur aakhirkar size limit tak pahunчता hai. Ye wahi unbounded-array anti-pattern hai jo MongoDB mein apply hota hai, par ek-megabyte cap MongoDB ke sohleह-megabyte cap se bahut jaldi pahunचता hai. Firestore ka answer subcollection hai: kyunki ek subcollection ke documents parent document ke size ki taraf count nahi karते.',
      },
    ],

    realWorld: [
      {
        en: '**A chat app where each `chatRooms/{roomId}` document holds room metadata and a `messages` subcollection holds the messages** — the room document is a few hundred bytes forever, and a listener on the last 50 messages is a small, cheap query.',
        hi: '**Ek chat app jahaan har `chatRooms/{roomId}` document room metadata rakhता hai aur ek `messages` subcollection messages rakhती hai**.',
      },
      {
        en: '**An e-commerce `orders` collection where every order document carries `customerName`, `customerEmail`, and each line item\'s `productName` and `priceAtPurchase`** — the order-detail screen renders from one document read, no joins.',
        hi: '**Ek e-commerce `orders` collection jahaan har order document `customerName`, `customerEmail` carry karta hai** — order-detail screen ek document read se render hota hai.',
      },
      {
        en: '**A backend Cloud Function using the Admin SDK to run a nightly aggregation** the client SDK could never do — reading across all users\' order subcollections, which security rules would (correctly) forbid a client from doing.',
        hi: '**Ek backend Cloud Function jo Admin SDK istemal karta hai ek nightly aggregation chalाने ke liye** jo client SDK kabhi nahi kar sakta.',
      },
    ],

    interviewQA: [
      {
        q: 'How does the Firestore data model differ from MongoDB\'s, especially around subcollections and joins?',
        qHi: 'Firestore data model MongoDB se kaise alag hai, khaास kar subcollections aur joins ke around?',
        a: 'Both store schemaless documents grouped into collections, but Firestore adds two things. First, a document can contain subcollections, which are collections nested directly under it, so the hierarchy alternates collection and document to any depth rather than stopping at two levels, and critically a subcollection\'s data does not count toward its parent document\'s size limit. This inverts MongoDB\'s guidance for unbounded child data: in MongoDB an unbounded list of children goes in a separate top-level collection referenced by id because embedding it would exceed the sixteen-megabyte document cap, whereas in Firestore that same unbounded list goes in a subcollection under the parent document precisely because the subcollection is independent of the parent\'s one-megabyte cap and is naturally scoped to that parent. Second, Firestore has no join operation of any kind; a query runs against exactly one collection and returns whole documents from it, with no way to combine data from two collections. This makes denormalization mandatory rather than optional: the fields from a related document that a view displays must be copied onto the documents that view queries, because there is no alternative way to show data from two entities together in one query.',
        aHi: 'Dono schemaless documents store karते hain collections mein grouped, par Firestore do cheezen add karता hai. Pehla, ek document subcollections contain kar sakta hai, aur critically ek subcollection ka data iske parent document ke size limit ki taraf count nahi karता. Ye MongoDB ki guidance ko invert karता hai: MongoDB mein unbounded children ek alag top-level collection mein jाते hain, Firestore mein wahi list ek subcollection mein jाती hai parent document ke under. Doosra, Firestore mein kisī bhi tarah ka koi join operation nahi; ek query theek ek collection ke against chalती hai. Ye denormalization ko mandatory banata hai.',
      },
      {
        q: 'What is the difference between the Firestore client SDK and the admin SDK, and why must admin credentials never reach a client?',
        qHi: 'Firestore client SDK aur admin SDK mein kya antar hai, aur admin credentials kabhi ek client tak kyun nahi pahunचne chahiye?',
        a: 'The client SDK is designed to run in untrusted environments, a web browser or a mobile app, and every read and write it performs is evaluated against the project\'s security rules before Firestore executes it, so the security rules function as the application\'s authorization layer and make it possible for a client to talk directly to the database with no backend server in between. The admin SDK is designed to run in trusted environments, your own server or a Cloud Function, authenticated with a service-account credential, and it bypasses the security rules entirely, granting full unrestricted read and write access to every document in the project. It exists for server-side operations that need to act with more authority than any end user, such as administrative tasks, migrations, and cross-user aggregations. Admin credentials must never reach a client because a service-account key placed in client code, or an admin SDK bundled into an app, can be extracted from the app bundle or from network traffic by anyone using the app, and once extracted it grants that person complete control over the entire database with no rules applied. Client apps use only the client SDK, initialized with the project\'s public configuration, which identifies the project but grants no access by itself.',
        aHi: 'Client SDK untrusted environments mein chalne ke liye design kiya gaya hai, aur ye jo har read aur write perform karता hai wo project ke security rules ke against evaluate hoती hai. Admin SDK trusted environments mein chalne ke liye design kiya gaya hai, ek service-account credential se authenticated, aur ye security rules ko poori tarah bypass karता hai. Admin credentials kabhi ek client tak nahi pahunचne chahiye kyunki client code mein rakhी ek service-account key app bundle se ya network traffic se extract ki ja sakti hai, aur ek baar extracted ye us vyakti ko poore database par complete control grant karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Write the path (as a slash-separated string) to a Firestore document at `tasks` collection → `task_9` document, nested under `projects/p1`, nested under `teams/t1`. Confirm it has an odd number of segments (5).',
        taskHi: 'Ek Firestore document ka path likho (slash-separated string ke roop mein) `tasks` collection → `task_9` document par, `projects/p1` ke under nested, `teams/t1` ke under nested.',
        hint: 'A path alternates collection/document. A document path always has an odd segment count (`teams/t1/projects/p1/tasks/task_9` = 5); a collection path has an even count.',
        hintHi: 'Ek path collection/document alternate karта hai. Ek document path ka hamesha ek odd segment count hota hai.',
      },
      {
        task: 'In a comment, explain why a chat app should store messages in `chatRooms/{roomId}/messages` (a subcollection) rather than a `messages` array field on the room document. Reference the 1MB limit and the per-write rewrite cost.',
        taskHi: 'Ek comment mein, samjhaओ ki ek chat app ko messages ko `chatRooms/{roomId}/messages` (ek subcollection) mein kyun store karna chahiye ek `messages` array field ke bजaay.',
        hint: 'Every write rewrites the whole document, and the 1MB cap is hit far sooner than MongoDB\'s 16MB. A subcollection\'s documents don\'t count toward the parent\'s size, so the room document stays tiny forever.',
        hintHi: 'Har write poore document ko rewrite karta hai, aur 1MB cap MongoDB ke 16MB se bahut jaldi hit hota hai. Ek subcollection ke documents parent ke size ki taraf count nahi karte.',
      },
      {
        task: 'An order-detail screen shows the order total and the customer\'s name. In a comment, explain why the order document must store a `customerName` copy, and what the trade-off of that denormalization is.',
        taskHi: 'Ek order-detail screen order total aur customer ka naam dikhाता hai. Ek comment mein, samjhaओ ki order document ko ek `customerName` copy kyun store karna chahiye.',
        hint: 'Firestore has no joins — a query returns documents from one collection only. So the customer name must be denormalized onto the order. The trade-off: the copy must be kept in sync when the customer renames (typically via a Cloud Function).',
        hintHi: 'Firestore mein koi joins nahi — ek query sirf ek collection se documents lautaती hai. To customer name order par denormalize hona chahiye. Trade-off: copy ko sync mein rakhna hoga.',
      },
    ],

    keyTakeaways: [
      'HIERARCHY: (project) → COLLECTION → DOCUMENT → SUBCOLLECTION → DOCUMENT → ... A path ALTERNATES collection/document — a document path has an ODD segment count (`teams/t1/projects/p1/tasks/task_9`), a collection path an EVEN count.',
      'SUBCOLLECTION data does NOT count toward the parent document\'s 1MB limit. This INVERTS MongoDB\'s advice: unbounded child data goes in a SUBCOLLECTION UNDER the parent document (in MongoDB it goes in a separate top-level collection). Naturally scoped to the parent, no size pressure.',
      'NO JOINS — of any kind. A query runs against EXACTLY ONE collection and returns whole documents. To combine data from two entities: DENORMALIZE (copy the fields you display onto the querying documents — mandatory, not optional) or FETCH SEPARATELY (get doc, read its ref field, get the second doc in another round trip).',
      'A DOCUMENT is capped at 1 MiB (1,048,576 bytes) — much smaller than MongoDB\'s 16MB. Every write rewrites the WHOLE document, so an ever-growing array/map field hits the cap fast and stops accepting writes → use a subcollection.',
      'TWO SDKs: CLIENT SDK (browser/mobile, UNTRUSTED — every read/write checked against SECURITY RULES, which ARE the authorization layer that lets a client talk directly to the DB). ADMIN SDK (your server / Cloud Functions, TRUSTED — service-account key, BYPASSES all security rules, full access). Admin credentials must NEVER reach a client (extractable from the app bundle → unrestricted DB access).',
    ],
    keyTakeawaysHi: [
      'HIERARCHY: (project) → COLLECTION → DOCUMENT → SUBCOLLECTION → ... Ek path collection/document ALTERNATE karता hai — ek document path ka ODD segment count hota hai.',
      'SUBCOLLECTION data parent document ke 1MB limit ki taraf count NAHI karता. Ye MongoDB ki advice ko INVERT karता hai: unbounded child data ek SUBCOLLECTION mein parent document ke UNDER jाता hai.',
      'KOI JOINS NAHI — kisī bhi tarah ke. Ek query THEEK EK collection ke against chalती hai. Do entities ka data combine karne ke liye: DENORMALIZE (jo fields display karते ho unhe querying documents par copy karो — mandatory) ya ALAG SE FETCH karो.',
      'Ek DOCUMENT 1 MiB par capped hai — MongoDB ke 16MB se bahut chhota. Har write POORE document ko rewrite karता hai → ek ever-growing array/map field cap jaldi hit karता hai → ek subcollection istemal karो.',
      'DO SDKs: CLIENT SDK (browser/mobile, UNTRUSTED — har read/write SECURITY RULES ke against checked). ADMIN SDK (aapका server, TRUSTED — saare security rules BYPASS karता hai). Admin credentials KABHI ek client tak nahi pahunचne chahiye.',
    ],
  },

  {
    slug: 'firestore-crud-and-realtime-listeners',
    title: 'CRUD & Real-Time Listeners',
    titleHi: 'CRUD Aur Real-Time Listeners',
    description: 'get/set/update/delete/add are the writes and one-time reads. But onSnapshot is the point of Firestore: a listener that fires immediately with the current data and again on every change, so the UI is always live without any polling. FieldValue sentinels express server-side operations.',
    descriptionHi: '`get`/`set`/`update`/`delete`/`add` writes aur one-time reads hain. Par `onSnapshot` Firestore ka point hai: ek listener jo current data ke saath turant fire karता hai aur har change par phir se, to UI hamesha live hai bina kisī polling ke. `FieldValue` sentinels server-side operations express karते hain.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A stock ticker that not only tells you the price when you ask, but keeps updating on your screen every time it moves — versus a newspaper you have to keep re-buying.** A one-time `get()` is the newspaper: accurate at the moment you bought it, stale a second later. `onSnapshot()` is the ticker: the moment you subscribe it shows the current value, and then it redraws itself every time the underlying number changes, for as long as you leave it running. You never ask "did it change?" — the change is pushed to you. And `FieldValue.increment(1)` is telling the exchange "add one to this, whatever it currently is" rather than reading the number, adding one yourself, and writing it back — the exchange does the arithmetic atomically so two people incrementing at once do not clobber each other.',
      hi: '**Ek stock ticker jo sirf aapको price bataता hai jab aap poochते ho, balki har baar jab ye move karता hai aapki screen par update karता rehता hai — versus ek newspaper jise aapको baar-baar re-buy karना paता hai.** Ek one-time `get()` newspaper hai: us moment accurate jab aapne kharidा, ek second baad stale. `onSnapshot()` ticker hai: jis moment aap subscribe karते ho ye current value dikhाता hai, aur phir har baar redraw karता hai jab underlying number badalता hai. Aap kabhi nahi poochते "kya ye badla?" — change aapको push kiya jाता hai. Aur `FieldValue.increment(1)` exchange ko bataना hai "ismein ek add karो, ye jo bhi abhi hai" — exchange arithmetic atomically karता hai.',
    },

    simple: `**WRITES: \`set\` (create/overwrite), \`update\` (patch fields), \`delete\`, \`add\` (auto-ID)**

\`\`\`js
await db.collection("users").doc("u1").set({ name: "Ravi", plan: "free" });    // whole doc
await db.collection("users").doc("u1").update({ plan: "pro" });                 // patch: only "plan"
await db.collection("users").doc("u1").set({ theme: "dark" }, { merge: true }); // set + merge = patch-or-create
const ref = await db.collection("orders").add({ total: 4999 });                 // Firestore picks the ID
await db.collection("users").doc("u1").delete();
\`\`\`

**ONE-TIME READ: \`.get()\` returns a SNAPSHOT (\`.exists\`, \`.data()\`, \`.id\`)**

\`\`\`js
const snap = await db.collection("users").doc("u1").get();
if (snap.exists) console.log(snap.data());
\`\`\`

**REAL-TIME: \`.onSnapshot(cb)\` fires NOW with the current data, and AGAIN on every change**

\`\`\`js
const unsub = db.collection("orders").where("status", "==", "open")
  .onSnapshot((querySnap) => {
    render(querySnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
// ... later, to stop listening:
unsub();
\`\`\`

**FieldValue SENTINELS -- server-side operations, written into a set/update:**
\`\`\`
FieldValue.serverTimestamp()      -- the server's clock at write time (not the client's)
FieldValue.increment(n)           -- atomic add (safe under concurrent writers)
FieldValue.arrayUnion(x, y)       -- add elements if not already present
FieldValue.arrayRemove(x)         -- remove all instances of an element
FieldValue.delete()               -- remove this field from the document
\`\`\``,

    simpleHi: `**WRITES: \`set\` (create/overwrite), \`update\` (patch fields), \`delete\`, \`add\` (auto-ID)**

\`\`\`js
await db.collection("users").doc("u1").set({ name: "Ravi", plan: "free" });    // poora doc
await db.collection("users").doc("u1").update({ plan: "pro" });                 // patch: sirf "plan"
await db.collection("users").doc("u1").set({ theme: "dark" }, { merge: true }); // set + merge = patch-or-create
const ref = await db.collection("orders").add({ total: 4999 });                 // Firestore ID chunta hai
\`\`\`

**ONE-TIME READ: \`.get()\` ek SNAPSHOT lautaта hai (\`.exists\`, \`.data()\`, \`.id\`)**

\`\`\`js
const snap = await db.collection("users").doc("u1").get();
if (snap.exists) console.log(snap.data());
\`\`\`

**REAL-TIME: \`.onSnapshot(cb)\` ABHI current data ke saath fire karता hai, aur har change par PHIR SE**

\`\`\`js
const unsub = db.collection("orders").where("status", "==", "open")
  .onSnapshot((querySnap) => {
    render(querySnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
unsub();   // ... baad mein, listening stop karne ke liye
\`\`\`

**FieldValue SENTINELS -- server-side operations, ek set/update mein likhे gaye:**
\`\`\`
FieldValue.serverTimestamp()      -- write time par server ki clock (client ki nahi)
FieldValue.increment(n)           -- atomic add (concurrent writers ke under safe)
FieldValue.arrayUnion(x, y)       -- elements add karो agar pehle se nahi hain
FieldValue.arrayRemove(x)         -- ek element ke saare instances remove karो
FieldValue.delete()               -- is field ko document se remove karो
\`\`\``,

    content: `## Writes

- **\`set(data)\`** — create the document, or completely overwrite it if it exists. Every field not in \`data\` is removed.
- **\`set(data, { merge: true })\`** — create the document, or merge \`data\` into it if it exists. Fields not mentioned are left alone. This is "upsert with a patch."
- **\`update(data)\`** — patch: set the listed fields, leave the rest. Fails if the document does not exist (unlike merged \`set\`).
- **\`add(data)\`** — create a document in a collection with an auto-generated ID, returning its reference.
- **\`delete()\`** — remove the document. (Deleting a document does **not** delete its subcollections — those become orphaned and must be deleted explicitly.)

Dotted field paths reach into maps: \`update({ "address.city": "Pune" })\` sets a nested field without replacing the whole \`address\` map.

## One-time reads

\`.get()\` on a document reference returns a **DocumentSnapshot**:

- **\`.exists\`** — whether the document exists.
- **\`.data()\`** — the document's fields as an object (or \`undefined\` if it does not exist).
- **\`.id\`** — the document ID.
- **\`.ref\`** — the reference, for further operations.

\`.get()\` on a collection or query returns a **QuerySnapshot** with \`.docs\` (an array of DocumentSnapshots), \`.size\`, \`.empty\`, and \`.forEach\`.

## Real-time listeners: \`onSnapshot\`

This is the feature Firestore is built around. \`.onSnapshot(callback)\` registers a listener that:

1. **fires immediately** with the current state of the document or query, then
2. **fires again every time the result changes** — a matching document is added, modified, or removed — for as long as the listener is attached.

\`\`\`js
const unsub = db.collection("orders").where("status", "==", "open")
  .onSnapshot((querySnap) => {
    // called now, and on every subsequent change to the set of open orders
    updateUI(querySnap.docs);
  });
\`\`\`

The callback receives a fresh QuerySnapshot each time. For efficient UI updates, \`querySnap.docChanges()\` reports exactly which documents were \`added\`, \`modified\`, or \`removed\` since the last callback, so you can apply an incremental update instead of re-rendering the whole list.

\`onSnapshot\` returns an **unsubscribe function**. You must call it when the listener is no longer needed (component unmount, screen navigation) — a leaked listener keeps consuming reads and bandwidth and keeps a connection open.

Because the client SDK maintains a local cache, an \`onSnapshot\` callback often fires first with cached data (possibly stale), then again with server data. \`querySnap.metadata.fromCache\` and \`.hasPendingWrites\` tell you which.

## FieldValue sentinels

Some operations must happen on the server, not be computed by the client and written as a literal. **FieldValue** provides sentinel values you place in a \`set\` or \`update\` and Firestore resolves server-side:

- **\`serverTimestamp()\`** — replaced with the server's clock at the moment the write is applied. Use this for \`createdAt\`/\`updatedAt\` instead of the client's clock, which may be wrong or manipulable.
- **\`increment(n)\`** — atomically adds \`n\` to the field's current value (creating it at \`n\` if absent). Two clients each calling \`increment(1)\` concurrently both take effect — no read-modify-write race, no lost update.
- **\`arrayUnion(...elements)\`** — adds each element to the array field only if not already present.
- **\`arrayRemove(...elements)\`** — removes all instances of each element from the array field.
- **\`deleteField()\`** — removes the field from the document entirely.

\`increment\` and the array operations are the Firestore equivalent of MongoDB's \`$inc\`, \`$addToSet\`, and \`$pull\` — atomic field-level operations that avoid the round trip and the race of read-then-write.`,

    contentHi: `## Writes

- **\`set(data)\`** — document create karो, ya poori tarah overwrite karो agar exist karता hai.
- **\`set(data, { merge: true })\`** — document create karो, ya \`data\` ko ismein merge karो. "Upsert with a patch."
- **\`update(data)\`** — patch: listed fields set karो, baaki chhoड़о. Fail hota hai agar document exist nahi karता.
- **\`add(data)\`** — ek auto-generated ID ke saath ek document create karो.
- **\`delete()\`** — document remove karो. (Ek document delete karna iski subcollections **delete NAHI** karता.)

## One-time reads

\`.get()\` ek document reference par ek **DocumentSnapshot** lautaता hai: \`.exists\`, \`.data()\`, \`.id\`, \`.ref\`.

## Real-time listeners: \`onSnapshot\`

Ye feature hai jiske around Firestore bana hai. \`.onSnapshot(callback)\` ek listener register karता hai jo:
1. **turant fire karता hai** current state ke saath, phir
2. **har baar phir se fire karता hai jab result badalता hai**.

\`\`\`js
const unsub = db.collection("orders").where("status", "==", "open")
  .onSnapshot((querySnap) => { updateUI(querySnap.docs); });
\`\`\`

\`onSnapshot\` ek **unsubscribe function** lautaता hai. Aapको ise call karना chahiye jab listener ki zaroorat nahi — ek leaked listener reads aur bandwidth consume karता rehта hai.

## FieldValue sentinels

Kुछ operations server par honा chahiye. **FieldValue** sentinel values deता hai:

- **\`serverTimestamp()\`** — server ki clock se replace.
- **\`increment(n)\`** — atomically \`n\` add karता hai. Do clients concurrent \`increment(1)\` dono take effect karते hain.
- **\`arrayUnion(...)\`** / **\`arrayRemove(...)\`**.
- **\`deleteField()\`**.

\`increment\` aur array operations MongoDB ke \`$inc\`, \`$addToSet\`, \`$pull\` ke Firestore equivalent hain.`,

    examples: [
      {
        title: 'set overwrites, update patches, set with merge patches-or-creates',
        titleHi: 'set overwrite karta hai, update patch karta hai, set with merge patch-ya-create karta hai',
        code: `await db.collection("users").doc("u1").set({ name: "Ravi", plan: "free" });
await db.collection("users").doc("u1").update({ plan: "pro" });          // name kept
await db.collection("users").doc("u1").set({ theme: "dark" }, { merge: true });  // adds theme

const snap = await db.collection("users").doc("u1").get();
console.log(snap.data());`,
        output: `{ name: 'Ravi', plan: 'pro', theme: 'dark' }`,
        explain: '`set({ name, plan: "free" })` writes the whole document. `update({ plan: "pro" })` patches only `plan`, leaving `name`. `set({ theme: "dark" }, { merge: true })` merges `theme` in without removing anything. The final document has all three fields: `name: "Ravi"`, `plan: "pro"`, `theme: "dark"`. A plain `set({ plan: "pro" })` (no merge) would have wiped `name`.',
        explainHi: '`set({ name, plan: "free" })` poora document likhता hai. `update({ plan: "pro" })` sirf `plan` patch karता hai, `name` chhoड़te hue. `set({ theme: "dark" }, { merge: true })` `theme` ko bina kuch remove kiye merge karता hai. Final document mein teenो fields hain: `name: "Ravi"`, `plan: "pro"`, `theme: "dark"`. Ek plain `set({ plan: "pro" })` (bina merge) `name` mita deta.',
      },
      {
        title: 'onSnapshot fires with current data, then again on every change',
        titleHi: 'onSnapshot current data ke saath fire karta hai, phir har change par phir se',
        code: `// two "open" orders already exist. Attach a listener:
const unsub = db.collection("orders").where("status", "==", "open")
  .onSnapshot((snap) => console.log("open orders:", snap.size));

// -> "open orders: 2"   (fires immediately with current data)

// elsewhere, another client marks one order shipped:
await db.collection("orders").doc("o1").update({ status: "shipped" });

// -> "open orders: 1"   (the SAME listener fires again — no polling)

unsub();   // stop listening`,
        output: `open orders: 2
open orders: 1`,
        explain: '`onSnapshot` fires immediately with the current result — 2 open orders. It stays attached. When another client updates `o1` to `status: "shipped"`, that order leaves the result set and the SAME listener fires again — `open orders: 1`. No polling, no re-query: the change is pushed. `unsub()` detaches the listener.',
        explainHi: '`onSnapshot` current result ke saath turant fire karता hai — 2 open orders. Ye attached rehта hai. Jab ek doosरा client `o1` ko `status: "shipped"` update karता hai, wo order result set se nikal jाता hai aur WAHI listener phir fire karता hai — `open orders: 1`. Koi polling nahi, koi re-query nahi: change push kiya jाता hai. `unsub()` listener detach karता hai.',
      },
      {
        title: 'FieldValue.increment and serverTimestamp resolve on the server',
        titleHi: 'FieldValue.increment aur serverTimestamp server par resolve hote hain',
        code: `import { FieldValue } from "firebase-admin/firestore";

await db.collection("posts").doc("p1").set({ likes: 0 });

// two clients like the post at nearly the same time — both increments apply:
await db.collection("posts").doc("p1").update({
  likes: FieldValue.increment(1),
  lastLikedAt: FieldValue.serverTimestamp(),
});
await db.collection("posts").doc("p1").update({ likes: FieldValue.increment(1) });

const snap = await db.collection("posts").doc("p1").get();
console.log(snap.data().likes);`,
        output: `2`,
        explain: "`FieldValue.increment(1)` is resolved on the server: it adds 1 to whatever `likes` currently is, atomically. Two separate `update` calls each incrementing by 1 both take effect — 0 → 1 → 2 — with no read-modify-write race. `serverTimestamp()` similarly writes the server's clock, not the client's. Final `likes` is 2.",
        explainHi: '`FieldValue.increment(1)` server par resolve hota hai: ye `likes` jo bhi abhi hai usmein 1 add karता hai, atomically. Do alag `update` calls har ek 1 se increment karते hue dono take effect karते hain — 0 → 1 → 2 — bina read-modify-write race ke. `serverTimestamp()` isī tarah server ki clock likhता hai, client ki nahi. Final `likes` 2 hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// using set() when you meant update() -- silently wiping the other fields
await db.collection("users").doc("u1").set({ name: "Ravi", plan: "free" });
// later, "update" the plan:
await db.collection("users").doc("u1").set({ plan: "pro" });
// -- set() OVERWRITES: the document is now just { plan: "pro" }. "name" is GONE.`,
        right: `await db.collection("users").doc("u1").update({ plan: "pro" });
// -- update() patches: only "plan" changes, "name" is preserved
// -- or set({ plan: "pro" }, { merge: true }) if the doc might not exist`,
        why: 'The set method without a merge option replaces the entire document with the data provided, so any field that existed on the document but is not present in the new data is removed. This makes set the correct choice only when the intent is genuinely to define the document\'s complete contents, such as creating it fresh or replacing it wholesale from a known full state. When the intent is to change one or a few fields while preserving the rest, set silently destroys the unmentioned fields with no error. The update method is the correct operation for a partial change: it sets exactly the fields named and leaves every other field untouched, and it fails with an error if the document does not exist, which surfaces a mistaken assumption rather than creating a partial document. If the document may or may not exist and a patch-or-create is wanted, set with the merge option set to true provides that: it merges the data into an existing document or creates a new one, in both cases without removing fields.',
        whyHi: 'Bina merge option ke `set` method poore document ko diye gaye data se replace karता hai, to koi bhi field jo document par tha par naye data mein nahi hai remove ho jाता hai. Jab intent ek ya кुछ fields badalne ka hai jabki baaki preserve karना, `set` unmentioned fields ko silently destroy karता hai. `update` method ek partial change ke liye sahi operation hai. Agar document exist kar sakta hai ya nahi aur ek patch-or-create chahiye, `merge: true` ke saath `set`.',
      },
      {
        wrong: `// never unsubscribing an onSnapshot listener
function OrderList() {
  db.collection("orders").where("status", "==", "open")
    .onSnapshot((snap) => setOrders(snap.docs));
  // no cleanup -- every time this component mounts, a NEW listener is added and
  // the old ones are never removed. Reads, bandwidth, and connections leak.
}`,
        right: `function OrderList() {
  useEffect(() => {
    const unsub = db.collection("orders").where("status", "==", "open")
      .onSnapshot((snap) => setOrders(snap.docs));
    return unsub;   // cleanup: called on unmount, stops the listener
  }, []);
}`,
        why: 'An onSnapshot listener maintains an active subscription: it keeps a connection open, it continues to receive and be billed for reads every time the underlying data changes, and it holds references that prevent related resources from being cleaned up. The onSnapshot call returns an unsubscribe function specifically so this subscription can be torn down when it is no longer needed. Code that attaches a listener without ever calling the unsubscribe function accumulates listeners over the lifetime of the application, particularly in component-based UIs where a component that attaches a listener on each mount without cleanup adds a new one every time it mounts while the previous ones continue running. The result is steadily growing read costs, bandwidth usage, and open connections, all for data that is no longer being displayed. The correct pattern ties the listener\'s lifetime to the lifetime of whatever needs it: in a React component, registering the listener in an effect and returning the unsubscribe function as the effect\'s cleanup ensures exactly one active listener that is removed when the component unmounts.',
        whyHi: 'Ek `onSnapshot` listener ek active subscription maintain karता hai: ye ek connection khुला rakhता hai, ye reads receive aur bill hota rehता hai har baar jab underlying data badalता hai. `onSnapshot` call ek unsubscribe function lautaता hai specifically taaki ye subscription torn down ho sake. Code jo ek listener attach karता hai bina unsubscribe function call kiye listeners accumulate karता hai. Sahi pattern listener ki lifetime ko us cheez ki lifetime se tie karता hai jise iski zaroorat hai.',
      },
      {
        wrong: `// reading, modifying, and writing back a counter -- a lost-update race
const snap = await db.collection("posts").doc("p1").get();
await db.collection("posts").doc("p1").update({ likes: snap.data().likes + 1 });
// -- if two clients do this at the same time, both read (say) 5, both write 6,
//    and one like is LOST`,
        right: `await db.collection("posts").doc("p1").update({
  likes: FieldValue.increment(1),
});
// -- the server adds 1 to whatever the value currently is, atomically.
//    Two concurrent increments both apply: 5 -> 6 -> 7.`,
        why: 'Incrementing a numeric field by reading its current value, adding to it in client code, and writing the result back creates a window between the read and the write during which another client can perform the same sequence. When two clients both read the same starting value, both compute the same incremented result, and both write it, the field ends up incremented once instead of twice, and one update is lost. The FieldValue.increment sentinel avoids this entirely: it is not a value the client computes but an instruction to the server to add the given amount to whatever the field holds at the moment the write is applied, performed atomically. Two clients each issuing an increment of one both take effect, because each is a server-side addition to the current value rather than an overwrite with a client-computed number. This is the same reasoning as using MongoDB\'s $inc operator rather than reading and writing a counter, and it applies to any field where concurrent modifications must accumulate rather than overwrite.',
        whyHi: 'Ek numeric field ko iski current value padhkar, client code mein add karके, aur result wapas likhkar increment karना read aur write ke beech ek window banata hai jiske dauран ek doosरा client wahi sequence perform kar sakta hai. Jab do clients dono wahi starting value padhते hain, dono wahi incremented result compute karте hain, aur dono ise likhते hain, field ek baar increment hota hai do ke bजaay. `FieldValue.increment` sentinel ise poori tarah avoid karता hai: ye ek value nahi jo client compute karता hai balki server ko ek instruction hai.',
      },
    ],

    realWorld: [
      {
        en: '**A live order-status board in a restaurant kitchen** — `onSnapshot` on `orders` where `status == "cooking"`, and the board redraws itself the instant an order is marked ready, with no refresh button and no polling.',
        hi: '**Ek restaurant kitchen mein ek live order-status board** — `orders` par `onSnapshot`, aur board turant redraw hota hai jab ek order ready mark hota hai.',
      },
      {
        en: '**A post `likeCount` maintained with `FieldValue.increment(1)` on like and `increment(-1)` on unlike** — thousands of concurrent likes on a viral post all apply, no lost updates, no read-then-write.',
        hi: '**Ek post `likeCount` `FieldValue.increment(1)` se maintained** — ek viral post par hazaron concurrent likes sab apply hote hain.',
      },
      {
        en: '**Every document carrying `createdAt: serverTimestamp()` and `updatedAt: serverTimestamp()`** — reliable ordering and audit timestamps that a client with a wrong or manipulated clock cannot corrupt.',
        hi: '**Har document `createdAt: serverTimestamp()` aur `updatedAt: serverTimestamp()` carry karta hai** — reliable ordering jo ek galat clock waala client corrupt nahi kar sakta.',
      },
    ],

    interviewQA: [
      {
        q: 'What is onSnapshot, how does it differ from get(), and why must you unsubscribe?',
        qHi: '`onSnapshot` kya hai, ye `get()` se kaise alag hai, aur aapको unsubscribe kyun karna chahiye?',
        a: 'The get method performs a one-time read: it returns a snapshot of the document or query results as they are at that moment, and that is the end of the operation. The onSnapshot method instead registers a persistent listener that fires its callback immediately with the current state and then fires it again every subsequent time the result changes, whether a matching document is added, modified, or removed, for as long as the listener remains attached. This is the mechanism behind Firestore\'s real-time behavior: a UI attaches an onSnapshot listener once and thereafter reflects every change to the underlying data automatically, with no polling and no manual refresh. Because the listener is a persistent subscription, it keeps a connection open, continues to receive and be billed for reads on every change, and holds resources. The onSnapshot call returns an unsubscribe function for exactly this reason, and it must be called when the listener is no longer needed, such as when a UI component unmounts or the user navigates away. A listener that is never unsubscribed leaks: in a component-based UI that attaches a listener on each mount without cleanup, the listeners accumulate and read costs, bandwidth, and connections grow without bound for data that is no longer displayed.',
        aHi: '`get` method ek one-time read perform karता hai. `onSnapshot` method iske bजaay ek persistent listener register karता hai jo apne callback ko current state ke saath turant fire karता hai aur phir har baar phir se fire karता hai jab result badalता hai. Ye Firestore ke real-time behavior ke peeche ka mechanism hai. Kyunki listener ek persistent subscription hai, ye ek connection khुला rakhता hai aur har change par reads receive aur bill hota rehता hai. `onSnapshot` call ek unsubscribe function lautaता hai jise call karna chahiye jab listener ki zaroorat nahi.',
      },
      {
        q: 'What are FieldValue sentinels like serverTimestamp and increment, and what problem do they solve?',
        qHi: '`serverTimestamp` aur `increment` jaisे FieldValue sentinels kya hain, aur wo kaunसी problem solve karते hain?',
        a: 'FieldValue sentinels are special placeholder values that a client places inside the data of a set or update operation, which Firestore does not store literally but resolves on the server when the write is applied. serverTimestamp is replaced with the server\'s own clock at the moment of the write, which is the reliable choice for created-at and updated-at fields because a client\'s clock may be wrong or deliberately manipulated, and consistent timestamps matter for ordering. increment adds a given number to the field\'s current value atomically on the server, creating the field at that number if it does not exist. This solves the lost-update problem for counters: without it, incrementing a field means reading its value, adding one in client code, and writing the result back, and if two clients do this concurrently they both read the same starting value and both write the same incremented value, so one increment is lost. With increment, each client sends an instruction to add one to whatever the server currently holds, so two concurrent increments both take effect. The array sentinels arrayUnion and arrayRemove work the same way for adding elements only if absent and removing all instances of an element, and deleteField removes a field entirely. Together these are the Firestore equivalent of MongoDB\'s atomic field operators like the increment and array-modification operators.',
        aHi: 'FieldValue sentinels special placeholder values hain jo ek client ek `set` ya `update` operation ke data ke andar rakhता hai, jinhe Firestore literally store nahi karता balki write apply hone par server par resolve karता hai. `serverTimestamp` server ki apni clock se replace hota hai. `increment` server par atomically ek diया gaya number field ki current value mein add karता hai. Ye counters ke liye lost-update problem solve karता hai. `arrayUnion` aur `arrayRemove` array sentinels wahi tarike se kaam karते hain.',
      },
    ],

    exercises: [
      {
        task: '`set` a user doc `{ name: "Ravi", plan: "free" }`. Then `update` it to `{ plan: "pro" }`, then `set({ theme: "dark" }, { merge: true })`. In a comment, state the final document contents and explain why a plain `set({ plan: "pro" })` (no merge) would have been a bug.',
        taskHi: 'Ek user doc `{ name: "Ravi", plan: "free" }` `set` karo. Phir ise `{ plan: "pro" }` mein `update` karo, phir `set({ theme: "dark" }, { merge: true })`.',
        hint: 'Final: `{ name: "Ravi", plan: "pro", theme: "dark" }`. A plain `set({ plan: "pro" })` OVERWRITES the whole doc — `name` would be gone. `update` and merged `set` patch.',
        hintHi: 'Final: `{ name: "Ravi", plan: "pro", theme: "dark" }`. Ek plain `set({ plan: "pro" })` poore doc ko OVERWRITE karta hai — `name` chala jata.',
      },
      {
        task: 'In a comment, describe what an `onSnapshot` listener on `db.collection("orders").where("status", "==", "open")` does when: (a) first attached, (b) an open order is marked shipped by another client, (c) the component unmounts. Note what you must do in case (c).',
        taskHi: 'Ek comment mein, batao ek `onSnapshot` listener kya karta hai jab: (a) pehli baar attached, (b) ek open order shipped mark hota hai, (c) component unmount hota hai.',
        hint: '(a) fires immediately with current open orders. (b) the SAME listener fires again with the updated set. (c) you MUST call the unsubscribe function `onSnapshot` returned, or the listener leaks.',
        hintHi: '(a) turant fire karta hai. (b) WAHI listener phir se fire karta hai. (c) aapको unsubscribe function call KARNA chahiye.',
      },
      {
        task: 'A post has `{ likes: 5 }`. Two clients like it at nearly the same time. Compare: client-side `update({ likes: snap.data().likes + 1 })` versus `update({ likes: FieldValue.increment(1) })`. State the final `likes` value for each approach and why.',
        taskHi: 'Ek post ka `{ likes: 5 }` hai. Do clients ise lगभग usी samay like karте hain. Compare karo: client-side `update({ likes: snap.data().likes + 1 })` versus `update({ likes: FieldValue.increment(1) })`.',
        hint: 'Read-then-write: both read 5, both write 6 → final `likes: 6`, one like LOST. `FieldValue.increment(1)`: server adds 1 to the current value each time → 5 → 6 → 7, both applied.',
        hintHi: 'Read-then-write: dono 5 padhते hain, dono 6 likhते hain → final `6`, ek like LOST. `FieldValue.increment(1)`: server har baar 1 add karता hai → 7.',
      },
    ],

    keyTakeaways: [
      'WRITES: `set(data)` = create/OVERWRITE (unmentioned fields REMOVED). `set(data, { merge: true })` = patch-or-create (unmentioned fields KEPT). `update(data)` = patch, FAILS if the doc doesn\'t exist. `add(data)` = create with an auto-ID. `delete()` = remove the doc (but NOT its subcollections — those orphan).',
      'ONE-TIME READ: `.get()` → a SNAPSHOT. On a doc: `.exists`, `.data()`, `.id`, `.ref`. On a collection/query: `.docs` (array), `.size`, `.empty`, `.forEach`.',
      '`onSnapshot(cb)` IS the point of Firestore: fires IMMEDIATELY with current data, then AGAIN on EVERY change to the result — no polling, the UI is always live. `querySnap.docChanges()` gives the exact added/modified/removed deltas for incremental UI updates. The local cache means the first fire is often cached (check `.metadata.fromCache`).',
      '`onSnapshot` RETURNS an UNSUBSCRIBE function — you MUST call it when the listener is no longer needed (component unmount, navigation). A leaked listener keeps a connection open and keeps billing reads for data nobody\'s looking at.',
      'FieldValue SENTINELS resolve on the SERVER, written into a set/update: `serverTimestamp()` (server\'s clock, not the client\'s — for `createdAt`/`updatedAt`), `increment(n)` (ATOMIC add — two concurrent `increment(1)` BOTH apply, no lost update), `arrayUnion(...)` / `arrayRemove(...)`, `deleteField()`. The Firestore equivalent of MongoDB\'s `$inc`/`$addToSet`/`$pull`.',
    ],
    keyTakeawaysHi: [
      'WRITES: `set(data)` = create/OVERWRITE. `set(data, { merge: true })` = patch-or-create. `update(data)` = patch, FAIL agar doc exist nahi karता. `add(data)` = auto-ID ke saath create. `delete()` = doc remove (par iski subcollections NAHI).',
      'ONE-TIME READ: `.get()` → ek SNAPSHOT. Ek doc par: `.exists`, `.data()`, `.id`. Ek query par: `.docs`, `.size`, `.empty`.',
      '`onSnapshot(cb)` Firestore ka point HAI: current data ke saath TURANT fire karता hai, phir result ke HAR change par PHIR SE — koi polling nahi. `querySnap.docChanges()` exact deltas deता hai.',
      '`onSnapshot` ek UNSUBSCRIBE function RETURN karता hai — aapको ise CALL karna ZAROORI hai jab listener ki zaroorat nahi. Ek leaked listener connection khुला rakhता hai aur reads bill karता rehता hai.',
      'FieldValue SENTINELS SERVER par resolve hote hain: `serverTimestamp()` (server ki clock), `increment(n)` (ATOMIC add — do concurrent `increment(1)` DONO apply), `arrayUnion(...)` / `arrayRemove(...)`, `deleteField()`. MongoDB ke `$inc`/`$addToSet`/`$pull` ka equivalent.',
    ],
  },

  {
    slug: 'firestore-querying-and-composite-indexes',
    title: 'Querying & Composite Indexes',
    titleHi: 'Querying Aur Composite Indexes',
    description: 'Firestore queries are shallow and index-backed: where, orderBy, limit, and cursors. Every query must be served by an index, and a query filtering and ordering on multiple fields needs a composite index you declare. The operator set has real limits, and or() and collection group queries fill specific gaps.',
    descriptionHi: 'Firestore queries shallow aur index-backed hain: `where`, `orderBy`, `limit`, aur cursors. Har query ko ek index se serve hona chahiye, aur ek query jo multiple fields par filter aur order karती hai use ek composite index chahiye jo aap declare karते ho. Operator set ki real limits hain, aur `or()` aur collection group queries specific gaps bharते hain.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A library where you can only search using a pre-built index card drawer, and if the drawer you need does not exist, the librarian hands you a slip with the exact drawer to go build first.** There is no "just scan the shelves" fallback — every query is an index lookup or it is refused. A single-field drawer (by author, or by year) is made for you automatically. But "books by this author, sorted by year" needs a *combined* drawer sorted first by author then by year, and that one you have to request in advance — the first time you try the query, Firestore rejects it with a link that pre-fills the exact composite index to create. Once built, the query is instant and its cost does not depend on how large the library is, only on how many cards it returns.',
      hi: '**Ek library jahaan aap sirf ek pre-built index card drawer istemal karके search kar sakते ho, aur agar jo drawer aapको chahiye exist nahi karता, librarian aapको ek slip deता hai jo exact drawer batata hai jise pehle jाकर build karना hai.** Koi "bas shelves scan karो" fallback nahi hai — har query ek index lookup hai ya ye refuse ho jाती hai. Ek single-field drawer (author se, ya year se) aapke liye automatically banта hai. Par "is author ki books, year se sorted" ke liye ek *combined* drawer chahiye jo pehle author phir year se sorted hai, aur wo aapको pehle se request karना paता hai — pehli baar jab aap query try karते ho, Firestore ise ek link ke saath reject karता hai jo exact composite index pre-fill karता hai.',
    },

    simple: `**\`where\`, \`orderBy\`, \`limit\`, and cursors -- chained onto a collection reference**

\`\`\`js
db.collection("orders")
  .where("status", "==", "open")
  .where("total", ">", 1000)
  .orderBy("total", "desc")
  .limit(20)
  .get();
\`\`\`

**EVERY query needs an INDEX.** Single-field indexes are automatic. A query that
filters/orders on MULTIPLE fields needs a COMPOSITE INDEX you declare.

\`\`\`
First time you run a multi-field query, Firestore ERRORS with a message containing
a URL that pre-creates the exact composite index. Click it, wait for the build,
re-run.  -> firestore.indexes.json holds these in source control.
\`\`\`

**OPERATOR LIMITS (they exist because everything must be index-servable):**
\`\`\`
- range/inequality (<, <=, >, >=, !=) on only ONE field per query
- that field must be the FIRST orderBy
- in / not-in / array-contains-any: max 30 values in the array
- no OR across different fields except via or()  (and or() has its own index cost)
- no "not equal to any of a set" beyond not-in; no full-text search (use an add-on)
\`\`\`

**CURSOR PAGINATION -- \`startAfter(lastDocSnapshot)\` (NOT offset). O(1) at any page depth.**

\`\`\`js
const first = await q.limit(20).get();
const next  = await q.startAfter(first.docs[first.docs.length - 1]).limit(20).get();
\`\`\`

**\`db.collectionGroup("orders")\`** queries EVERY \`orders\` subcollection anywhere in the
database at once (e.g. "all shipped orders across all users").`,

    simpleHi: `**\`where\`, \`orderBy\`, \`limit\`, aur cursors -- ek collection reference par chained**

\`\`\`js
db.collection("orders")
  .where("status", "==", "open")
  .where("total", ">", 1000)
  .orderBy("total", "desc")
  .limit(20)
  .get();
\`\`\`

**HAR query ko ek INDEX chahiye.** Single-field indexes automatic hain. Ek query jo
MULTIPLE fields par filter/order karती hai use ek COMPOSITE INDEX chahiye jo aap declare karते ho.

\`\`\`
Pehli baar jab aap ek multi-field query chalाते ho, Firestore ek message ke saath ERROR karता hai
jismein ek URL hai jo exact composite index pre-create karता hai. Ise click karो, build ka wait
karो, re-run karो.  -> firestore.indexes.json inhe source control mein rakhता hai.
\`\`\`

**OPERATOR LIMITS:**
\`\`\`
- range/inequality (<, <=, >, >=, !=) prati query sirf EK field par
- wo field PEHLA orderBy hona chahiye
- in / not-in / array-contains-any: array mein max 30 values
- different fields ke across koi OR nahi siwaay or() ke
- koi full-text search nahi (ek add-on istemal karो)
\`\`\`

**CURSOR PAGINATION -- \`startAfter(lastDocSnapshot)\` (offset NAHI). Kisi bhi page depth par O(1).**

**\`db.collectionGroup("orders")\`** database mein kahin bhi HAR \`orders\` subcollection query karता hai.`,

    content: `## Query mechanics

A Firestore query is built by chaining constraints onto a collection (or collection group) reference:

- **\`where(field, op, value)\`** — filter. Operators: \`==\`, \`!=\`, \`<\`, \`<=\`, \`>\`, \`>=\`, \`in\`, \`not-in\`, \`array-contains\`, \`array-contains-any\`.
- **\`orderBy(field, "asc" | "desc")\`** — sort. Multiple \`orderBy\` calls sort hierarchically.
- **\`limit(n)\`** / **\`limitToLast(n)\`** — cap the result.
- **Cursors** — \`startAt\`, \`startAfter\`, \`endAt\`, \`endBefore\`, taking either field values or a document snapshot.

Queries are **shallow**: a query on a collection returns documents from that collection only, not from its subcollections.

## Every query is index-backed

Firestore has **no collection scan**. Every query must be answerable from an index, or it is rejected. This is why Firestore query latency is independent of collection size — it is proportional only to the number of documents returned.

- **Single-field indexes** are created automatically for every field (ascending and descending), so a query with one \`where\` and/or one \`orderBy\` on a single field just works.
- **Composite indexes** — for a query that filters or orders on **more than one field** — must be **explicitly declared**. The first time you run such a query, Firestore returns an error whose message contains a URL that opens the Firebase console with the exact required composite index pre-filled. You create it, wait for it to build (minutes, over the existing data), and re-run.

Composite indexes are defined in \`firestore.indexes.json\` and deployed with your project, so they live in source control alongside the code and are not just clicked into existence and forgotten.

## The operator limits

Because everything must be index-servable, Firestore queries have constraints that a SQL or MongoDB user will hit:

- **Range/inequality on one field only.** A single query can use \`<\`, \`<=\`, \`>\`, \`>=\`, or \`!=\` on at most one field. \`where("a", ">", 1).where("b", "<", 2)\` is not allowed.
- **The inequality field must be the first \`orderBy\`.** If you filter \`where("total", ">", 100)\`, the query must \`orderBy("total")\` before any other \`orderBy\`.
- **\`in\` / \`not-in\` / \`array-contains-any\` take at most 30 values.**
- **No OR across different fields directly.** \`where("a", "==", 1)\` OR \`where("b", "==", 2)\` cannot be expressed as chained \`where\`s (which AND together). The \`or()\` function (below) handles it, at the cost of the index combinations it requires.
- **No native full-text search.** Firestore matches whole field values and prefixes, not words within text. Full-text search requires an external service (Algolia, Typesense) or the Firestore full-text search extension.

## \`or()\` and \`and()\`

Modern Firestore supports \`or(...)\` and \`and(...)\` composition for disjunctions:

\`\`\`js
import { or, where } from "firebase/firestore";

query(collection(db, "orders"),
  or(where("status", "==", "urgent"), where("total", ">", 10000)));
\`\`\`

This works but expands the index requirements — an \`or\` of two conditions on different fields may need multiple composite indexes to cover the combinations.

## Cursor pagination

Firestore has **no offset-based pagination** in the SQL \`OFFSET\` sense (there is a \`.offset()\` in the admin SDK but it still reads and discards the skipped documents, and is billed for them). Real pagination uses **cursors**: you remember the last document of a page and start the next page after it.

\`\`\`js
const pageQuery = db.collection("orders").where("status", "==", "open").orderBy("createdAt").limit(20);

const page1 = await pageQuery.get();
const lastDoc = page1.docs[page1.docs.length - 1];
const page2 = await pageQuery.startAfter(lastDoc).get();
\`\`\`

Because \`startAfter\` seeks directly into the index, fetching page 500 costs exactly the same as page 1 — the same keyset-pagination advantage discussed for SQL and MongoDB, here it is the *only* option.

## Collection group queries

By default a query targets one specific collection at one path. A **collection group query** targets *every* collection with a given ID, anywhere in the database:

\`\`\`js
// every "orders" subcollection under every user, queried at once:
db.collectionGroup("orders").where("status", "==", "shipped").get();
\`\`\`

This is how you ask a question that spans all parents — "every shipped order in the system" when orders are stored per-user as \`users/{uid}/orders\`. Collection group queries need their own composite indexes (declared with \`"queryScope": "COLLECTION_GROUP"\`).`,

    contentHi: `## Query mechanics

Ek Firestore query ek collection reference par constraints chain karके banती hai:

- **\`where(field, op, value)\`** — filter. Operators: \`==\`, \`!=\`, \`<\`, \`<=\`, \`>\`, \`>=\`, \`in\`, \`not-in\`, \`array-contains\`, \`array-contains-any\`.
- **\`orderBy(field, "asc" | "desc")\`** — sort.
- **\`limit(n)\`** — result cap.
- **Cursors** — \`startAt\`, \`startAfter\`, \`endAt\`, \`endBefore\`.

Queries **shallow** hain.

## Har query index-backed hai

Firestore mein **koi collection scan nahi**. Har query ek index se answerable honी chahiye, ya ye reject ho jाती hai.

- **Single-field indexes** har field ke liye automatically banते hain.
- **Composite indexes** — ek query ke liye jo **ek se zyada field** par filter ya order karती hai — **explicitly declare** honा chahiye. Pehli baar jab aap aisī query chalाते ho, Firestore ek error lautaता hai jiske message mein ek URL hai jo exact required composite index pre-fill karता hai.

Composite indexes \`firestore.indexes.json\` mein defined hain.

## Operator limits

- **Range/inequality sirf ek field par.**
- **Inequality field pehla \`orderBy\` honा chahiye.**
- **\`in\` / \`not-in\` / \`array-contains-any\` max 30 values.**
- **Different fields ke across directly koi OR nahi.** \`or()\` function ise handle karता hai.
- **Koi native full-text search nahi.** Ek external service chahiye.

## \`or()\` aur \`and()\`

\`\`\`js
query(collection(db, "orders"), or(where("status", "==", "urgent"), where("total", ">", 10000)));
\`\`\`

Ye kaam karता hai par index requirements expand karता hai.

## Cursor pagination

Firestore mein **koi offset-based pagination nahi**. Real pagination **cursors** istemal karता hai:

\`\`\`js
const page2 = await pageQuery.startAfter(lastDoc).get();
\`\`\`

Page 500 fetch karna page 1 jitna hi cost karता hai.

## Collection group queries

\`\`\`js
db.collectionGroup("orders").where("status", "==", "shipped").get();
\`\`\`

Database mein kahin bhi HAR \`orders\` subcollection query karता hai. Apne composite indexes chahiye.`,

    examples: [
      {
        title: 'A multi-field query needs a composite index — the first run tells you exactly which',
        titleHi: 'Ek multi-field query ko ek composite index chahiye',
        code: `// filters on status AND orders by total — needs a composite index:
const q = db.collection("orders")
  .where("status", "==", "open")
  .orderBy("total", "desc")
  .limit(20);

await q.get();`,
        output: `FAILED_PRECONDITION: The query requires an index. You can create it here:
https://console.firebase.google.com/.../firestore/indexes?create_composite=...
(after creating the index and waiting for it to build, the query returns results normally)`,
        explain: 'A query that filters on `status` AND orders by a different field `total` needs a composite index, which Firestore does not create automatically. The first run fails with `FAILED_PRECONDITION` and an error message containing a console URL that pre-fills the exact index. After you create it and it finishes building over the existing data, the same query returns results normally. The index goes in `firestore.indexes.json`.',
        explainHi: 'Ek query jo `status` par filter karता hai AUR ek alag field `total` par order karता hai use ek composite index chahiye, jo Firestore automatically nahi banाता. Pehli run `FAILED_PRECONDITION` aur ek error message ke saath fail hoती hai jismein ek console URL hai jo exact index pre-fill karता hai. Aap ise banane aur existing data par build khatam hone ke baad, wahi query normally results return karती hai. Index `firestore.indexes.json` mein jाता hai.',
      },
      {
        title: 'Cursor pagination: start the next page after the last document of the previous one',
        titleHi: 'Cursor pagination: agli page pichhle ke aakhri document ke baad shuru karo',
        code: `const base = db.collection("orders").where("status", "==", "open").orderBy("createdAt");

const page1 = await base.limit(2).get();
console.log(page1.docs.map((d) => d.id));

const lastDoc = page1.docs[page1.docs.length - 1];
const page2 = await base.startAfter(lastDoc).limit(2).get();
console.log(page2.docs.map((d) => d.id));`,
        output: `[ 'o_a', 'o_b' ]
[ 'o_c', 'o_d' ]`,
        explain: "Page 1 is `base.limit(2).get()` → `['o_a', 'o_b']`. The cursor is the last document snapshot of page 1 (`o_b`). Page 2 is `base.startAfter(lastDoc).limit(2).get()` → `['o_c', 'o_d']`. `startAfter` seeks directly into the index at the position after `o_b`, so page N reads exactly N documents' worth — `.offset()` would instead read and bill for every skipped document.",
        explainHi: "Page 1 `base.limit(2).get()` hai → `['o_a', 'o_b']`. Cursor page 1 ka aakhri document snapshot hai (`o_b`). Page 2 `base.startAfter(lastDoc).limit(2).get()` hai → `['o_c', 'o_d']`. `startAfter` seedhе index mein `o_b` ke baad ki position par seek karता hai, to page N theek N documents jitna padhता hai — `.offset()` iske bजaay har skipped document ke liye padhता aur bill karता.",
      },
      {
        title: 'A collection group query spans every "orders" subcollection in the database',
        titleHi: 'Ek collection group query database mein har "orders" subcollection span karti hai',
        code: `// orders are stored per-user at users/{uid}/orders/{orderId}
// this queries EVERY user's orders subcollection at once:
const snap = await db.collectionGroup("orders")
  .where("status", "==", "shipped")
  .get();

console.log(snap.size, "shipped orders across all users");`,
        output: `47 shipped orders across all users`,
        explain: 'Orders are stored per-user at `users/{uid}/orders/{orderId}`. `db.collectionGroup("orders")` targets EVERY collection named `orders` anywhere in the database at once, so `.where("status", "==", "shipped")` finds all 47 shipped orders across all users in a single query. A collection group query needs its own composite index declared with `"queryScope": "COLLECTION_GROUP"`.',
        explainHi: 'Orders `users/{uid}/orders/{orderId}` par per-user store hote hain. `db.collectionGroup("orders")` database mein kahin bhi `orders` naam ki HAR collection ek saath target karता hai, to `.where("status", "==", "shipped")` ek single query mein saare users ke across saare 47 shipped orders dhoondता hai. Ek collection group query ko `"queryScope": "COLLECTION_GROUP"` ke saath declared apna composite index chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `// range/inequality filters on two different fields in one query
db.collection("products")
  .where("price", ">", 100)
  .where("rating", ">=", 4)
  .get();
// -- ERROR: a single query can have a range/inequality filter on only ONE field`,
        right: `// filter one field with a range, the other with equality (or filter client-side):
db.collection("products")
  .where("category", "==", "electronics")   // equality is fine on any number of fields
  .where("price", ">", 100)                  // range on ONE field
  .orderBy("price")                          // and that field must be the first orderBy
  .get();
// -- for the second range, filter the returned page in application code`,
        why: 'Firestore requires every query to be servable from a single index, and an index is an ordered structure over its fields; a range or inequality filter on a field constrains the query to a contiguous span of that field\'s values in the index, but applying a second range filter on a different field would require the results to be contiguous in two dimensions at once, which a single ordered index cannot represent. Equality filters do not have this problem because an equality constraint pins the query to one exact value of that field, so any number of equality filters can be combined and the range filter still operates over a contiguous span within them. The practical consequence is that a query can use a range or inequality on at most one field, that field must be the first field the query orders by, and any additional range condition must be applied to the fetched results in application code rather than in the query. This is a hard constraint of the index model, not a configurable limit.',
        whyHi: 'Firestore ki zaroorat hai ki har query ek single index se servable ho, aur ek index apne fields par ek ordered structure hai; ek field par ek range ya inequality filter query ko us field ki values ke ek contiguous span tak constrain karता hai, par ek doosरे field par ek doosरा range filter apply karna results ko ek saath do dimensions mein contiguous hone ki zaroorat karega. Equality filters ye problem nahi rakhते. Practical consequence ye hai ki ek query zyada se zyada ek field par ek range istemal kar sakti hai.',
      },
      {
        wrong: `// treating security rules as query filters, then over-fetching to compensate
// (this connects to Lesson 5, but the query mistake is here)
db.collection("posts").get();   // "the rules will only return posts I'm allowed to see"
// -- WRONG. Security rules do NOT filter. A query that would return a document
//    the rules forbid is REJECTED ENTIRELY -- and a query with no constraint on
//    a rule-relevant field either fails or you get nothing.`,
        right: `// the query must itself constrain to what the rules allow:
db.collection("posts").where("authorId", "==", currentUserId).get();
// -- and the rule allows read: if resource.data.authorId == request.auth.uid
// -- query and rule must AGREE on the constraint`,
        why: 'Firestore security rules are an authorization check applied per document, not a filter applied to query results. When a query is evaluated, if any document it would return fails the read rule, the entire query is rejected rather than the offending documents being silently omitted. This means a query cannot rely on the rules to narrow a broad request down to the permitted subset; instead the query itself must include the constraints that limit it to documents the rules will allow. In practice the query and the rule are written together and must agree: if the rule permits reading a post only when its author field matches the requesting user, the query must filter on that author field with that user\'s id, so that every document the query would return is one the rule permits. A query that omits the constraint the rule depends on will fail, and there is no mode where the rules quietly filter the result.',
        whyHi: 'Firestore security rules ek authorization check hain jo prati-document apply hota hai, query results par apply kiya gaya ek filter nahi. Jab ek query evaluate hoती hai, agar koi bhi document jo ye return karega read rule fail karता hai, poori query reject ho jaती hai. Iska matlab hai ek query rules par bharoसा nahi kar sakti ek broad request ko permitted subset tak narrow karने ke liye; balki query khud ko un constraints ko include karना chahiye. Practice mein query aur rule saath likhे jaते hain aur agree karना chahiye.',
      },
      {
        wrong: `// paginating with .offset() and expecting it to be cheap at depth
const page50 = await db.collection("feed")
  .orderBy("createdAt", "desc")
  .offset(980)   // skip 980 documents
  .limit(20)
  .get();
// -- Firestore reads AND BILLS YOU FOR all 980 skipped documents, plus the 20.
//    Page 50 costs 50x page 1.`,
        right: `// cursor pagination: remember the last doc, start after it
let cursor = null;
async function nextPage() {
  let q = db.collection("feed").orderBy("createdAt", "desc").limit(20);
  if (cursor) q = q.startAfter(cursor);
  const snap = await q.get();
  cursor = snap.docs[snap.docs.length - 1];
  return snap.docs;
}
// -- every page reads and bills for exactly 20 documents, regardless of depth`,
        why: 'The offset method in Firestore, where available, does not efficiently skip documents; it retrieves every skipped document from the index and discards it, and each of those retrieved documents counts as a billed read. Requesting a page deep in a result set with offset therefore reads and charges for every document up to that page, so the cost and latency grow linearly with page depth and a deep page can be dozens of times more expensive than the first. Cursor-based pagination avoids this by seeking directly into the index to the position after the last document of the previous page, using a document snapshot or its field values as the cursor, so the next page reads only the documents it actually returns regardless of how far into the collection it is. This is the same keyset-pagination reasoning that applies to SQL OFFSET and MongoDB skip, but in Firestore it matters even more because the skipped documents are not just slow to traverse, they are directly billed, and cursors are the standard and expected way to paginate.',
        whyHi: 'Firestore mein `offset` method documents ko efficiently skip nahi karता; ye index se har skipped document retrieve karта hai aur ise discard karता hai, aur un retrieved documents mein se har ek ek billed read ke roop mein count hota hai. Ek result set mein deep ek page request karна isliye us page tak har document read aur charge karता hai. Cursor-based pagination ise avoid karता hai index mein seedhे seek karके. Firestore mein ye aur bhi matter karता hai kyunki skipped documents directly billed hote hain.',
      },
    ],

    realWorld: [
      {
        en: '**A `firestore.indexes.json` with a dozen declared composite indexes, deployed via CI** — every multi-field query the app runs has its index in source control, and a new query that needs an index fails loudly in staging, not silently in production.',
        hi: '**Ek `firestore.indexes.json` ek dozen declared composite indexes ke saath, CI ke through deployed** — har multi-field query ka index source control mein hai.',
      },
      {
        en: '**An infinite-scroll feed using `startAfter(lastVisibleDoc)`** — scrolling to the 40th "page" costs exactly one page of reads, and the cursor is just the last document snapshot held in component state.',
        hi: '**Ek infinite-scroll feed jo `startAfter(lastVisibleDoc)` istemal karta hai** — 40ve "page" tak scroll karna theek ek page ke reads cost karता hai.',
      },
      {
        en: '**A `collectionGroup("reviews")` query powering an admin "recent reviews across all products" dashboard** — reviews are stored per-product as `products/{id}/reviews`, and the collection group query is the only way to see them all together.',
        hi: '**Ek `collectionGroup("reviews")` query jo ek admin "sabhi products ke recent reviews" dashboard ko power karta hai**.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does every Firestore query need an index, and what is a composite index?',
        qHi: 'Har Firestore query ko ek index kyun chahiye, aur ek composite index kya hai?',
        a: 'Firestore has no collection scan: it will not iterate a collection\'s documents to answer a query, so every query must be answerable directly from an index or it is rejected. This is a deliberate design choice that makes query latency independent of collection size, because a query only ever traverses an index to the documents it returns rather than examining documents it does not. For a query that filters or orders on a single field, Firestore automatically maintains a single-field index on every field in both directions, so such queries work with no setup. For a query that filters or orders on more than one field together, a single-field index is not enough; the query needs a composite index, which is an index ordered by several fields at once in a specific sequence, and composite indexes are not created automatically because the number of possible field combinations is large and most would never be used. Instead, the first time a query requiring a composite index is run, Firestore returns an error containing a URL that opens the console with exactly the needed composite index pre-configured, and after it is created and has finished building over the existing data, the query works. These composite index definitions are kept in a project configuration file and deployed with the code, so they are version-controlled rather than ad hoc.',
        aHi: 'Firestore mein koi collection scan nahi: ye ek query ka jawab dene ke liye ek collection ke documents ko iterate nahi karega, to har query ek index se directly answerable honी chahiye. Ye ek deliberate design choice hai jo query latency ko collection size se independent banata hai. Ek single field par filter ya order karti ek query ke liye, Firestore automatically har field par ek single-field index maintain karता hai. Ek se zyada field par ek query ke liye, ise ek composite index chahiye. Pehli baar jab ek composite index require karti ek query chalती hai, Firestore ek URL waale error ke saath lautaता hai.',
      },
      {
        q: 'What are the main operator limits in Firestore queries, and how do you paginate?',
        qHi: 'Firestore queries mein main operator limits kya hain, aur aap kaise paginate karते ho?',
        a: 'Because every query must be servable from a single ordered index, Firestore queries have several limits. A range or inequality filter, meaning less-than, greater-than, or not-equal, can be applied to at most one field per query, since two range filters would require the results to be contiguous in two dimensions at once, which a single index cannot represent; equality filters have no such limit. The field carrying the range filter must also be the first field the query orders by. The membership operators, in, not-in, and array-contains-any, accept at most thirty values in their list. There is no way to express an OR across conditions on different fields by chaining where clauses, which combine with AND; the or function provides disjunction but expands the composite index requirements. And there is no native full-text search over the words within a text field, only matching on whole values or prefixes, so full-text search requires an external service or an extension. For pagination, Firestore does not offer efficient offset-based paging; the offset method, where present, reads and bills for every skipped document. Pagination is done with cursors: the last document of a page is retained, and the next page is requested with startAfter given that document, which seeks directly into the index so each page reads and is billed for only the documents it returns, regardless of how deep into the collection it is.',
        aHi: 'Kyunki har query ek single ordered index se servable honी chahiye, Firestore queries ki кई limits hain. Ek range ya inequality filter prati query zyada se zyada ek field par apply kiya ja sakta hai. Us range filter waale field ko pehla field bhi honा chahiye jispar query order karती hai. Membership operators (`in`, `not-in`, `array-contains-any`) zyada se zyada tees values accept karते hain. Different fields par conditions ke across ek OR express karने ka koi tarika nahi siwaay `or()` function ke. Koi native full-text search nahi. Pagination cursors se ki jाती hai: page ke aakhri document ko retain kiya jाता hai, aur agla page `startAfter` ke saath request kiya jाता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, explain what happens the first time you run `db.collection("orders").where("status", "==", "open").orderBy("total", "desc").get()` on a project with no composite indexes, and what you do about it.',
        taskHi: 'Ek comment mein, samjhaओ ki kya hota hai pehli baar jab aap `db.collection("orders").where("status", "==", "open").orderBy("total", "desc").get()` chalाते ho ek project par jismein koi composite indexes nahi.',
        hint: 'It fails with a `FAILED_PRECONDITION` error containing a console URL that pre-fills the exact composite index. You create the index, wait for it to build over the existing data, re-run — and commit the index to `firestore.indexes.json`.',
        hintHi: 'Ye ek `FAILED_PRECONDITION` error ke saath fail hota hai jismein ek console URL hai jo exact composite index pre-fill karता hai.',
      },
      {
        task: 'Write a two-page cursor-pagination sequence for `db.collection("orders").where("status", "==", "open").orderBy("createdAt")` with page size 2. Page 1 is a `.limit(2).get()`; page 2 uses `.startAfter(<last doc of page 1>).limit(2)`. In a comment, note why this is O(1) per page vs `.offset()`.',
        taskHi: '`db.collection("orders").where("status", "==", "open").orderBy("createdAt")` ke liye page size 2 ke saath ek two-page cursor-pagination sequence likho.',
        hint: 'Page 2 = `base.startAfter(page1.docs[page1.docs.length - 1]).limit(2).get()`. `startAfter` seeks into the index, so page N reads exactly N docs; `.offset(k)` reads and bills for all k skipped docs.',
        hintHi: 'Page 2 = `base.startAfter(page1.docs[...]).limit(2).get()`. `startAfter` index mein seek karta hai.',
      },
      {
        task: 'Orders are stored per-user at `users/{uid}/orders/{orderId}`. In a comment, explain how you\'d query "every shipped order across all users at once", and note that this query type needs its own composite index declaration.',
        taskHi: 'Orders `users/{uid}/orders/{orderId}` par store hote hain. Ek comment mein, samjhaओ ki aap "sabhi users ke across har shipped order ek saath" kaise query karोge.',
        hint: '`db.collectionGroup("orders").where("status", "==", "shipped").get()` — a collection group query targets every collection named `orders` anywhere. It needs a composite index with `"queryScope": "COLLECTION_GROUP"`.',
        hintHi: '`db.collectionGroup("orders").where("status", "==", "shipped").get()` — ek collection group query kahin bhi har `orders` naam ki collection target karta hai.',
      },
    ],

    keyTakeaways: [
      'A query chains `where(field, op, value)` (ops: `==`/`!=`/`<`/`<=`/`>`/`>=`/`in`/`not-in`/`array-contains`/`array-contains-any`), `orderBy(field, "asc"|"desc")`, `limit(n)`, and CURSORS (`startAt`/`startAfter`/`endAt`/`endBefore`). Queries are SHALLOW — one collection only, not its subcollections.',
      'NO COLLECTION SCAN — every query MUST be servable from an INDEX or it\'s REJECTED. This makes query latency independent of collection size (proportional only to docs RETURNED). Single-field indexes: AUTOMATIC. COMPOSITE indexes (query filters/orders on 2+ fields): you DECLARE them — the first run fails with a `FAILED_PRECONDITION` error containing a console URL that pre-fills the exact index. Kept in `firestore.indexes.json` (source-controlled).',
      'OPERATOR LIMITS (all from "must be index-servable"): range/inequality (`<`/`<=`/`>`/`>=`/`!=`) on only ONE field per query, and that field must be the FIRST `orderBy` (equality filters have no such limit). `in`/`not-in`/`array-contains-any`: max 30 values. No OR across different fields by chaining `where` (they AND) — use `or()` (which expands index requirements). NO native full-text search — use Algolia/Typesense/an extension.',
      'PAGINATION: NO efficient offset. `.offset(k)` READS AND BILLS FOR all k skipped docs → page 50 costs 50× page 1. Use CURSORS: retain the last doc of a page, request the next with `startAfter(lastDoc)` — seeks into the index, so every page reads/bills for exactly its own docs regardless of depth. It\'s the ONLY sensible option.',
      '`db.collectionGroup("orders")` queries EVERY collection named `orders` anywhere in the database at once — the way to span all parents (e.g. "every shipped order" when orders live per-user at `users/{uid}/orders`). Needs its own composite index with `"queryScope": "COLLECTION_GROUP"`.',
      'SECURITY RULES ARE NOT FILTERS (Lesson 5): a query that would return a doc the rules forbid is REJECTED ENTIRELY. The query must itself constrain to what the rules allow — query and rule are written together and must AGREE on the constraint.',
    ],
    keyTakeawaysHi: [
      'Ek query `where(field, op, value)`, `orderBy(field, "asc"|"desc")`, `limit(n)`, aur CURSORS chain karती hai. Queries SHALLOW hain — sirf ek collection.',
      'KOI COLLECTION SCAN NAHI — har query ek INDEX se servable honी CHAHIYE ya ye REJECT hoती hai. Single-field indexes: AUTOMATIC. COMPOSITE indexes (2+ fields): aap DECLARE karते ho — pehli run ek console URL waale error ke saath fail hoती hai. `firestore.indexes.json` mein rakhे jाते hain.',
      'OPERATOR LIMITS: range/inequality sirf EK field par prati query, aur wo field PEHLA `orderBy` honा chahiye. `in`/`not-in`/`array-contains-any`: max 30 values. Chaining `where` se different fields ke across koi OR nahi — `or()` istemal karो. KOI native full-text search NAHI.',
      'PAGINATION: KOI efficient offset nahi. `.offset(k)` sabhi k skipped docs ke liye READS AUR BILLS. CURSORS istemal karो: `startAfter(lastDoc)` — index mein seek karता hai. Ekmatra sensible option.',
      '`db.collectionGroup("orders")` database mein kahin bhi HAR `orders` naam ki collection ek saath query karता hai. Apne composite index chahiye.',
      'SECURITY RULES FILTERS NAHI hain (Lesson 5): ek query jo ek doc return karegi jo rules forbid karते hain POORI TARAH REJECT hoती hai. Query khud ko constrain karना chahiye.',
    ],
  },
];
