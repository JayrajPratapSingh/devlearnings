/**
 * Node.js Complete Course — Module 9: The Data Layer — ORMs & NoSQL, lesson 2.
 *
 * MongoDB and Mongoose: documents vs rows, embed vs reference (the modelling
 * decision), Mongoose schemas / validation / middleware hooks, the aggregation
 * pipeline, indexes (and why an unindexed query is a full collection scan),
 * transactions (and their requirements), lean() reads, the populate N+1, and
 * when a document database actually fits.
 *
 * DB-dependent — example `output` blocks describe observed behaviour rather
 * than machine-captured stdout (Node course convention).
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_9_PART2: CourseLesson[] = [
  {
    slug: 'mongodb-and-mongoose',
    title: 'MongoDB & Mongoose: Documents, Embedding, Aggregation, Indexes',
    titleHi: 'MongoDB Aur Mongoose: Documents, Embedding, Aggregation, Indexes',
    description: 'A product page that loads instantly for months suddenly takes 900ms. Nothing in the code changed — the `products` collection just crossed a few hundred thousand documents, and the query filtering by `category` has no index, so every request scans the entire collection.',
    descriptionHi: 'Ek product page jo mahinon tak instantly load hota hai achaanak 900ms leta hai. Code mein kuch nahi badla — `products` collection ne bस kuch lakh documents paar kiye, aur `category` se filter karne waali query ka koi index nahi hai, to har request poori collection scan karti hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A filing system of whole folders versus a filing system of cross-referenced index cards.** A relational database is index cards: one card per fact, and a customer\'s order is reconstructed by pulling the order card, then the line-item cards it points to, then the product cards those point to — normalised, no duplication, but every question is a little assembly job. MongoDB is folders: an order document is one folder containing the order, its line items, the shipping address, all together, and reading it is pulling one folder off the shelf. That is fantastic when you always want the whole folder at once and the folder does not grow without limit. It is a trap when the same fact lives in many folders — a product name copied into ten thousand order folders means renaming the product is ten thousand edits — or when a folder grows forever (a "user" folder that embeds every event they ever triggered eventually will not fit on the shelf). The modelling question in MongoDB is always the same one: **for this access pattern, do I put the related data inside the folder (embed) or keep it in its own folder and store a reference (link)?** Get that right and reads are one operation; get it wrong and you are doing joins the database was not built to do, by hand, in application code.',
      hi: '**Poore folders ka ek filing system versus cross-referenced index cards ka ek filing system.** Ek relational database index cards hai: prati fact ek card, aur ek customer ka order order card kheenchkar, phir jo line-item cards ye point karta hai, phir jo product cards wo point karte hain — normalised, koi duplication nahi, par har sawaal ek chhota assembly job hai. MongoDB folders hai: ek order document ek folder hai jismein order, iske line items, shipping address, sab ek saath, aur ise padhna shelf se ek folder kheenchna hai. Wo shaandaar hai jab aap hamesha poora folder ek saath chaahte ho aur folder bina limit ke nahi badhta. Wo ek trap hai jab wahi fact kई folders mein rehta hai — ek product name das hazaar order folders mein copy hone ka matlab product rename karna das hazaar edits hai — ya jab ek folder hamesha ke liye badhta hai. MongoDB mein modelling sawaal hamesha wahi hai: **is access pattern ke liye, kya main related data ko folder ke andar rakhun (embed) ya ise apne folder mein rakhun aur ek reference store karun (link)?**',
    },

    simple: `**Documents, not rows**

\`\`\`js
// one order document holds everything you read together:
{
  _id: ObjectId("..."),
  customerId: ObjectId("..."),     // reference — customer lives in its own collection
  status: "paid",
  items: [                          // embedded — always read with the order, bounded in size
    { sku: "A1", name: "Widget", qty: 2, priceCents: 999 },
    { sku: "B2", name: "Gadget", qty: 1, priceCents: 4999 },
  ],
  shippingAddress: { line1: "...", city: "...", country: "IN" },   // embedded
  createdAt: ISODate("2026-01-15T..."),
}
\`\`\`

**Embed vs reference — the core decision**

\`\`\`
EMBED when:  read together always | belongs-to-one-parent | bounded size | changes with the parent
             -> order items, address, a post's tags, settings
REFERENCE when: shared across many parents | queried on its own | unbounded/large | changes independently
             -> the customer on an order, the author of 10k posts, a user's activity feed
\`\`\`

**Mongoose — schema on top of a schemaless database**

\`\`\`js
import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
  status:     { type: String, enum: ["pending", "paid", "shipped"], default: "pending" },
  items:      [{ sku: String, name: String, qty: { type: Number, min: 1 }, priceCents: Number }],
  totalCents: { type: Number, required: true },
}, { timestamps: true });                    // adds createdAt / updatedAt

orderSchema.index({ customerId: 1, createdAt: -1 });   // compound index for "this customer's orders, newest first"

export const Order = model("Order", orderSchema);
\`\`\`

**Validation + middleware hooks**

\`\`\`js
orderSchema.pre("save", function () {
  this.totalCents = this.items.reduce((s, i) => s + i.qty * i.priceCents, 0);   // derive before write
});
// pre/post: save, validate, remove, findOneAndUpdate, aggregate, ...
// validation runs on .save() and .create() — NOT on updateOne()/findOneAndUpdate() unless runValidators: true
\`\`\`

**Reads: use \`.lean()\` when you only need the data**

\`\`\`js
const orders = await Order.find({ customerId }).sort({ createdAt: -1 }).limit(20).lean();
// .lean() -> plain JS objects, no Mongoose document wrapper -> much faster, but no .save()/virtuals/getters
\`\`\`

**The aggregation pipeline — GROUP BY / joins / transforms**

\`\`\`js
const revenueByDay = await Order.aggregate([
  { $match: { status: "paid", createdAt: { $gte: since } } },
  { $group: { _id: { $dateTrunc: { date: "$createdAt", unit: "day" } }, cents: { $sum: "$totalCents" } } },
  { $sort: { _id: 1 } },
]);
\`\`\`

**Indexes — an unindexed filter is a full collection scan**

\`\`\`js
await Order.find({ status: "paid" }).explain("executionStats");
// look for: "stage": "COLLSCAN"  <- bad, add an index;  "IXSCAN" <- good
\`\`\`

**Transactions — need a replica set / Atlas, and a session**

\`\`\`js
const session = await mongoose.startSession();
await session.withTransaction(async () => {
  await Order.create([{ ... }], { session });
  await Inventory.updateOne({ sku }, { $inc: { qty: -1 } }, { session });
});
session.endSession();
\`\`\``,

    simpleHi: `**Documents, rows nahi**

\`\`\`js
// ek order document sab kuch rakhta hai jo aap saath padhte ho:
{
  _id: ObjectId("..."),
  customerId: ObjectId("..."),     // reference — customer apni collection mein rehta hai
  status: "paid",
  items: [                          // embedded — hamesha order ke saath padha, size mein bounded
    { sku: "A1", name: "Widget", qty: 2, priceCents: 999 },
  ],
  shippingAddress: { line1: "...", city: "..." },   // embedded
}
\`\`\`

**Embed vs reference — core decision**

\`\`\`
EMBED jab:  hamesha saath padha | ek-parent-ka | bounded size | parent ke saath badalta
             -> order items, address, ek post ke tags
REFERENCE jab: kई parents ke aar-paar shared | apne aap query hota | unbounded/bada | independently badalta
             -> ek order par customer, 10k posts ka author, ek user ki activity feed
\`\`\`

**Mongoose — ek schemaless database ke upar schema**

\`\`\`js
import { Schema, model } from "mongoose";
const orderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
  status:     { type: String, enum: ["pending", "paid", "shipped"], default: "pending" },
  items:      [{ sku: String, qty: { type: Number, min: 1 }, priceCents: Number }],
  totalCents: { type: Number, required: true },
}, { timestamps: true });
orderSchema.index({ customerId: 1, createdAt: -1 });   // compound index
export const Order = model("Order", orderSchema);
\`\`\`

**Validation + middleware hooks**

\`\`\`js
orderSchema.pre("save", function () {
  this.totalCents = this.items.reduce((s, i) => s + i.qty * i.priceCents, 0);
});
// validation .save()/.create() par chalti hai — updateOne()/findOneAndUpdate() par NAHI jab tak runValidators: true
\`\`\`

**Reads: \`.lean()\` istemal karo jab sirf data chahiye**

\`\`\`js
const orders = await Order.find({ customerId }).sort({ createdAt: -1 }).limit(20).lean();
// .lean() -> plain JS objects -> bahut tez, par koi .save()/virtuals/getters nahi
\`\`\`

**Aggregation pipeline — GROUP BY / joins / transforms**

\`\`\`js
const revenueByDay = await Order.aggregate([
  { $match: { status: "paid", createdAt: { $gte: since } } },
  { $group: { _id: { $dateTrunc: { date: "$createdAt", unit: "day" } }, cents: { $sum: "$totalCents" } } },
  { $sort: { _id: 1 } },
]);
\`\`\`

**Indexes — ek unindexed filter ek full collection scan hai**

\`\`\`js
await Order.find({ status: "paid" }).explain("executionStats");
// dekho: "stage": "COLLSCAN"  <- bura;  "IXSCAN" <- achha
\`\`\`

**Transactions — ek replica set / Atlas, aur ek session chahiye**

\`\`\`js
const session = await mongoose.startSession();
await session.withTransaction(async () => {
  await Order.create([{ ... }], { session });
  await Inventory.updateOne({ sku }, { $inc: { qty: -1 } }, { session });
});
session.endSession();
\`\`\``,

    content: `## Documents vs rows

A relational database stores normalised rows and reconstructs entities by joining. MongoDB stores **documents** — nested JSON-like structures (BSON) — and the design goal is that **the shape you store matches the shape you read**. An order with its line items and shipping address is *one document*; loading it is one lookup, no joins.

Key facts:

- Every document has an **\`_id\`** (an \`ObjectId\` by default — 12 bytes, roughly time-ordered).
- A **collection** is schemaless at the database level — two documents in \`products\` can have completely different fields. Mongoose (or your own validation) imposes a schema in application code.
- Documents have a **16 MB hard limit**. An array that grows unboundedly will eventually hit it — a hard failure, not a slow query.
- Queries are on a single collection; MongoDB has \`$lookup\` (a left join in the aggregation pipeline) but it is not the primary access pattern and does not perform like a relational join at scale.

## Embed vs reference — the decision that defines the schema

This is the one modelling choice that matters most, and it is driven by **access pattern**, not by "what relates to what".

**Embed** (nest the data inside the parent document) when:

- You **always read it together** with the parent (order → items).
- It **belongs to exactly one** parent (a comment on a post, if comments are few).
- Its size is **bounded** — a handful, not "grows forever".
- It **changes with the parent** and does not need to be queried independently.

**Reference** (store an \`_id\`, keep the data in its own collection) when:

- The data is **shared** by many parents (the customer referenced by all their orders).
- It is **queried on its own** ("all users in London").
- It is **large or unbounded** (a user's entire activity history).
- It **changes independently** and you do not want to update every copy.

The classic mistakes: embedding a product's full details into every order line (now a price or name change is a mass update, and stale copies drift) — versus referencing something you always read together, forcing an application-side join on every request. A common hybrid: embed a *snapshot* of the fields you need at write time (the product name and price *as sold*, which you *want* frozen) and also keep a reference for the live record.

## Mongoose

Mongoose adds a schema, validation, type casting, middleware, and query helpers on top of the raw driver.

- **Schema types**: \`String\`, \`Number\`, \`Boolean\`, \`Date\`, \`ObjectId\`, \`Buffer\`, \`Mixed\`, arrays, and nested objects. Options: \`required\`, \`default\`, \`enum\`, \`min\`/\`max\`, \`match\`, \`unique\` (which is an *index* directive, not a validator), \`index\`.
- **\`{ timestamps: true }\`** auto-manages \`createdAt\` / \`updatedAt\`.
- **Validation** runs on \`.save()\`, \`.create()\`, and \`document.validate()\`. It does **not** run on \`updateOne\`, \`updateMany\`, \`findOneAndUpdate\`, or \`findByIdAndUpdate\` unless you pass \`{ runValidators: true }\` — a very common source of "invalid data got into the database via an update".
- **Middleware (hooks)**: \`pre\`/\`post\` for \`save\`, \`validate\`, \`remove\`, \`findOneAndUpdate\`, \`aggregate\`, and more. Use them for derived fields, cascading cleanup, audit logging — but keep them simple; a hook that does I/O turns every save into a hidden multi-step operation.
- **Virtuals**: computed properties not stored in the DB (\`fullName\` from \`first\`/\`last\`).
- **\`.populate("customerId")\`**: replaces a stored \`ObjectId\` with the referenced document — Mongoose's join. It issues a **second query** (an \`$in\` over the collected ids), so \`populate\` inside a loop over documents is the Mongoose N+1; populate once on the list query instead.
- **\`.lean()\`**: returns plain objects instead of hydrated Mongoose documents. Much faster and lower memory for read-only paths (an API returning JSON), at the cost of \`.save()\`, virtuals, getters, and \`instanceof\` checks.

## The aggregation pipeline

Aggregation is MongoDB's equivalent of SQL's \`GROUP BY\`, window functions, and transforms — an ordered array of **stages**, each consuming the previous stage's output:

- **\`$match\`** — filter (put it *first* so it can use an index and reduce the working set).
- **\`$group\`** — group by \`_id\` expression, accumulate with \`$sum\`, \`$avg\`, \`$push\`, \`$addToSet\`, \`$first\`.
- **\`$project\` / \`$addFields\` / \`$set\`** — reshape documents, compute fields.
- **\`$sort\`, \`$limit\`, \`$skip\`** — order and paginate (\`$sort\` before \`$limit\` can use an index; \`$sort\` after \`$group\` cannot).
- **\`$lookup\`** — left-join another collection.
- **\`$unwind\`** — one document per array element.

Aggregation is powerful but easy to make slow: an early \`$match\` and \`$sort\` that hit an index are the difference between milliseconds and a full scan plus an in-memory sort (which has a 100 MB limit unless you \`allowDiskUse\`).

## Indexes

Without an index, a query that filters or sorts scans **every document in the collection** (\`COLLSCAN\`). That is fine at a thousand documents and catastrophic at a million.

- Create them in the schema (\`{ index: true }\`, \`schema.index({ a: 1, b: -1 })\`) so they are version-controlled and applied on startup (\`autoIndex\` — turn it *off* in production and build indexes deliberately).
- **Compound index order follows the ESR rule**: Equality fields first, then Sort fields, then Range fields. An index on \`{ customerId: 1, createdAt: -1 }\` serves "this customer's orders, newest first" in one index scan.
- A **partial index** (\`partialFilterExpression\`) indexes only matching documents — smaller, cheaper, ideal for "only active" or "only unpaid".
- **TTL index** (\`expireAfterSeconds\`) auto-deletes old documents — sessions, logs, one-time tokens.
- Every index costs write throughput and storage. Index for your real query shapes; use \`.explain("executionStats")\` and \`totalDocsExamined\` vs \`nReturned\` to verify.

## Transactions

MongoDB supports multi-document ACID transactions, but with conditions:

- The deployment must be a **replica set** (or a sharded cluster) — a standalone \`mongod\` cannot. Atlas and the standard local dev setup with \`--replSet\` can.
- You need an explicit **session** and must pass \`{ session }\` into every operation inside it.
- \`session.withTransaction(fn)\` handles commit, and retries on transient errors (like a write conflict).
- Keep transactions short and touching few documents — a long transaction holds locks and increases the write-conflict rate.

Where a relational schema would use a transaction to keep two rows consistent, the MongoDB instinct is often to **embed** those two things in one document so a single atomic document write covers it — transactions are for the genuinely cross-document cases.

## When MongoDB fits

- Document-shaped aggregates you read whole: a CMS page, a product with variants, an event payload, a user's settings blob.
- Flexible or evolving schema where fields differ per document.
- High write throughput of self-contained documents.
- Horizontal scaling via sharding is a first-class feature.

## When it does not

- Highly relational data with many-to-many links and queries that join across three or more entities — a relational database does this natively and MongoDB makes you fight.
- Reporting and ad-hoc analytics across the whole dataset — SQL and its ecosystem are far ahead.
- When you need strong cross-entity constraints (foreign keys, \`CHECK\`, \`UNIQUE\` across a relationship) enforced by the database.

"Which database" is an architecture decision, not a default — pick it from the access patterns, and it is completely normal to use Postgres for the transactional core and MongoDB (or a document column in Postgres) for the document-shaped parts.`,

    contentHi: `## Documents vs rows

Ek relational database normalised rows store karta hai aur entities ko join karke reconstruct karta hai. MongoDB **documents** store karta hai — nested JSON-jaise structures (BSON) — aur design goal ye hai ki **jo shape aap store karte ho wo shape aap padhte ho**. Iske line items aur shipping address ke saath ek order *ek document* hai; ise load karna ek lookup hai, koi joins nahi.

Key facts:
- Har document ka ek **\`_id\`** hai (default se ek \`ObjectId\`).
- Ek **collection** database level par schemaless hai. Mongoose application code mein ek schema impose karta hai.
- Documents ki ek **16 MB hard limit** hai. Ek array jo unboundedly badhta hai aakhir ise hit karega — ek hard failure.
- Queries ek single collection par hain; MongoDB mein \`$lookup\` hai par ye primary access pattern nahi hai.

## Embed vs reference — wo decision jo schema define karta hai

Ye wo ek modelling choice hai jo sabse zyaada maayne rakhti hai, aur ye **access pattern** se driven hai.

**Embed** (data ko parent document ke andar nest karo) jab: aap ise hamesha parent ke saath **saath padhte ho**; ye theek **ek** parent ka hai; iski size **bounded** hai; ye **parent ke saath badalta hai**.

**Reference** (ek \`_id\` store karo, data ko apni collection mein rakho) jab: data kई parents dwara **shared** hai; ye **apne aap query hota hai**; ye **bada ya unbounded** hai; ye **independently badalta hai**.

Classic galtiyaan: ek product ki poori details har order line mein embed karna — versus kuch reference karna jise aap hamesha saath padhte ho. Ek aam hybrid: write time par jo fields aapko chahiye unka ek *snapshot* embed karo (product name aur price *jaise becha gaya*) aur live record ke liye ek reference bhi rakho.

## Mongoose

Mongoose raw driver ke upar ek schema, validation, type casting, middleware add karta hai.

- **Validation** \`.save()\`, \`.create()\` par chalti hai. Ye \`updateOne\`, \`findOneAndUpdate\` par **nahi** chalti jab tak aap \`{ runValidators: true }\` pass na karo.
- **Middleware (hooks)**: \`pre\`/\`post\`. Derived fields, cascading cleanup ke liye — par simple rakho.
- **\`.populate("customerId")\`**: ek stored \`ObjectId\` ko referenced document se replace karta hai — Mongoose ka join. Ye ek **doosri query** issue karta hai, to documents ke ek loop ke andar \`populate\` Mongoose N+1 hai.
- **\`.lean()\`**: hydrated Mongoose documents ke bजाy plain objects return karta hai. Bahut tez read-only paths ke liye.

## Aggregation pipeline

Aggregation MongoDB ka SQL ke \`GROUP BY\` ka samतुल्य hai — **stages** ka ek ordered array, har ek pichhle stage ka output consume karta hai: \`$match\` (filter — ise *pehle* rakho), \`$group\`, \`$project\`/\`$addFields\`, \`$sort\`/\`$limit\`/\`$skip\`, \`$lookup\`, \`$unwind\`. Ek early \`$match\` aur \`$sort\` jo ek index hit karte hain milliseconds aur ek full scan ke beech ka antar hain.

## Indexes

Ek index ke bina, ek query jo filter ya sort karti hai **collection ke har document ko scan karti hai** (\`COLLSCAN\`). Ek hazaar documents par theek, ek million par catastrophic.

- Inhe schema mein banao. Production mein \`autoIndex\` *off* karo.
- **Compound index order ESR rule follow karta hai**: Equality fields pehle, phir Sort fields, phir Range fields.
- **Partial index** sirf matching documents ko index karta hai.
- **TTL index** purane documents ko auto-delete karta hai.
- Har index write throughput aur storage cost karta hai. \`.explain("executionStats")\` istemal karo.

## Transactions

MongoDB multi-document ACID transactions support karta hai, par conditions ke saath: deployment ek **replica set** hona chahiye; aapko ek explicit **session** chahiye aur har operation mein \`{ session }\` pass karna hoga; \`session.withTransaction(fn)\` commit handle karta hai. Transactions chhote rakho.

Jahaan ek relational schema do rows consistent rakhne ke liye ek transaction istemal karega, MongoDB instinct aksar un do cheezon ko ek document mein **embed** karna hai.

## MongoDB kab fit hota hai

- Document-shaped aggregates jinhe aap poora padhte ho: ek CMS page, variants waala ek product.
- Flexible ya evolving schema.
- Self-contained documents ka high write throughput.

## Kab nahi

- Highly relational data many-to-many links aur teen ya zyaada entities ke aar-paar join karne waali queries ke saath.
- Poore dataset ke aar-paar reporting aur ad-hoc analytics.
- Jab aapको database dwara enforced strong cross-entity constraints chahiye.

"Kaunsa database" ek architecture decision hai, ek default nahi.`,

    examples: [
      {
        title: 'Embed vs reference: the same data, two schema shapes, two access costs',
        titleHi: 'Embed vs reference: wahi data, do schema shapes, do access costs',
        code: `// EMBED — order carries its items; one read gets everything
const order = await Order.findById(id).lean();
order.items.forEach(i => console.log(i.name, i.qty));   // 0 extra queries

// REFERENCE — items live in their own collection
const order2 = await Order.findById(id).lean();
const items = await Item.find({ orderId: order2._id }).lean();   // 1 extra query per order`,
        codeJs: `import { Schema, model } from "mongoose";

// SHAPE A — embed: items are part of the order document
const orderEmbedSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  items: [{ sku: String, name: String, qty: Number, priceCents: Number }],  // <- nested
});
const OrderEmbed = model("OrderEmbed", orderEmbedSchema);

const o = await OrderEmbed.findById(id).lean();
// o.items is right there — reading the order read the items too. 1 query.

// SHAPE B — reference: items are a separate collection pointing back
const itemSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "OrderRef", index: true },  // <- index the FK
  sku: String, name: String, qty: Number, priceCents: Number,
});
const Item = model("Item", itemSchema);

const o2 = await OrderRef.findById(id).lean();
const items = await Item.find({ orderId: o2._id }).lean();   // second query
// worse: doing this in a loop over 50 orders = 51 queries (the populate N+1)

// EMBED wins here: items are always read with the order, belong to one order,
// and are bounded (an order has a handful of lines, not a million).`,
        codeTs: `import { Schema, model, Types } from "mongoose";

interface Item { sku: string; name: string; qty: number; priceCents: number; }
interface OrderDoc { customerId: Types.ObjectId; items: Item[]; }

const orderEmbedSchema = new Schema<OrderDoc>({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  items: [{ sku: String, name: String, qty: Number, priceCents: Number }],
});
const OrderEmbed = model<OrderDoc>("OrderEmbed", orderEmbedSchema);

const o = await OrderEmbed.findById(id).lean<OrderDoc>();
o?.items.forEach((i) => console.log(i.name, i.qty));`,
        output: `EMBED:  1 query loads the order AND its items. o.items is populated.
REFERENCE: 2 queries per order (order, then its items). Over a list of
50 orders that becomes 51 queries unless you batch the item lookup.

For "order items" — always read together, one owner, bounded size —
embedding is the right call and makes the read a single operation.`,
        explain: 'The embed-vs-reference choice is decided by access pattern. Order items are always read with the order, belong to exactly one order, and are bounded in count, so embedding them makes every order read a single document lookup. Referencing would put them in their own collection and force a second query — and inside a loop over many orders, that is the Mongoose N+1. Reference is right for data that is shared, queried independently, or unbounded — like the customer on the order.',
        explainHi: 'Embed-vs-reference choice access pattern se decide hoti hai. Order items hamesha order ke saath padhe jaate hain, theek ek order ke hain, aur count mein bounded hain, to unhe embed karna har order read ko ek single document lookup banata hai. Reference unhe apni collection mein rakhega aur ek doosri query force karega — aur kई orders ke ek loop ke andar, wo Mongoose N+1 hai.',
      },
      {
        title: 'An unindexed query is a COLLSCAN; adding the index makes it an IXSCAN',
        titleHi: 'Ek unindexed query ek COLLSCAN hai; index add karna ise ek IXSCAN banata hai',
        code: `// before: no index on status
const plan = await Order.find({ status: "paid" }).explain("executionStats");
console.log(plan.executionStats.executionStages.stage);        // "COLLSCAN"
console.log(plan.executionStats.totalDocsExamined);            // 500000 (whole collection)

// add the index
await Order.collection.createIndex({ status: 1 });

const plan2 = await Order.find({ status: "paid" }).explain("executionStats");
console.log(plan2.executionStats.executionStages.inputStage.stage);   // "IXSCAN"
console.log(plan2.executionStats.totalDocsExamined);                 // 120000 (only matching)`,
        codeJs: `// EXPLAIN shows how the query engine will run a query.
const before = await Order.find({ status: "paid" }).explain("executionStats");
console.log("stage:", before.executionStats.executionStages.stage);   // "COLLSCAN"
console.log("docs examined:", before.executionStats.totalDocsExamined); // = collection size
console.log("returned:", before.executionStats.nReturned);
// COLLSCAN + docsExamined >> nReturned  ==  "this query reads the whole collection"

// Declare the index in the schema so it is version-controlled:
//   orderSchema.index({ status: 1, createdAt: -1 });
// (ESR: status is Equality, createdAt is Sort -> Equality field first)
await Order.syncIndexes();   // build any missing schema indexes

const after = await Order.find({ status: "paid" }).sort({ createdAt: -1 }).explain("executionStats");
console.log("stage:", after.executionStats.executionStages.inputStage.stage);  // "IXSCAN"
console.log("docs examined:", after.executionStats.totalDocsExamined);         // ~= nReturned
// turn OFF autoIndex in production; build indexes as a deliberate step`,
        codeTs: `const before = await Order.find({ status: "paid" }).explain("executionStats");
const stats = (before as any).executionStats;
console.log("stage:", stats.executionStages.stage);
console.log("examined vs returned:", stats.totalDocsExamined, stats.nReturned);

// orderSchema.index({ status: 1, createdAt: -1 });
await Order.syncIndexes();

const after = await Order.find({ status: "paid" }).sort({ createdAt: -1 }).explain("executionStats");
console.log("stage:", (after as any).executionStats.executionStages.inputStage.stage);`,
        output: `stage: COLLSCAN
docs examined: 500000
returned: 120000
  -> the query read all 500k documents to return 120k

stage: IXSCAN
docs examined: 120000
returned: 120000
  -> the index led the engine straight to the matching documents

An unindexed filter or sort scans the entire collection. explain()
with executionStats shows COLLSCAN and totalDocsExamined far above
nReturned; a good index brings docsExamined down to roughly nReturned.`,
        explain: 'MongoDB has no query planner magic that saves you from a missing index — a filter or sort on an unindexed field means reading every document in the collection (COLLSCAN). It is invisible until the collection is large enough for the scan to hurt. explain("executionStats") is how you check: COLLSCAN and a totalDocsExamined much larger than nReturned means you need an index. Declare indexes in the schema (following the Equality-Sort-Range order for compound ones), version them, and build them deliberately in production rather than relying on autoIndex.',
        explainHi: 'MongoDB mein koi query planner magic nahi hai jo aapko ek missing index se bachaaye — ek unindexed field par ek filter ya sort ka matlab collection ke har document ko padhna hai (COLLSCAN). Ye tab tak invisible hai jab tak collection scan ke hurt karne ke liye kaafi bada na ho. explain("executionStats") aise check karte ho: COLLSCAN aur nReturned se bahut bada totalDocsExamined matlab aapko ek index chahiye.',
      },
      {
        title: 'Aggregation pipeline: revenue per day, with $match first so it uses an index',
        titleHi: 'Aggregation pipeline: prati din revenue, $match pehle taaki ye ek index istemal kare',
        code: `const since = new Date("2026-01-01");
const rows = await Order.aggregate([
  { $match: { status: "paid", createdAt: { $gte: since } } },   // FIRST — filter with an index
  { $group: {
      _id: { $dateTrunc: { date: "$createdAt", unit: "day" } },
      revenueCents: { $sum: "$totalCents" },
      orders: { $sum: 1 },
  }},
  { $sort: { _id: 1 } },
]);
console.log(rows);`,
        codeJs: `const since = new Date("2026-01-01");

const rows = await Order.aggregate([
  // Stage 1: $match FIRST. With an index on { status: 1, createdAt: -1 }
  // this reduces the working set before any heavy work.
  { $match: { status: "paid", createdAt: { $gte: since } } },

  // Stage 2: group by truncated day, accumulate
  { $group: {
      _id: { $dateTrunc: { date: "$createdAt", unit: "day" } },
      revenueCents: { $sum: "$totalCents" },
      orders:       { $sum: 1 },
      avgCents:     { $avg: "$totalCents" },
  }},

  // Stage 3: order the buckets
  { $sort: { _id: 1 } },

  // Stage 4: reshape for the client
  { $project: { _id: 0, day: "$_id", revenueCents: 1, orders: 1, avgCents: { $round: ["$avgCents", 0] } } },
]);
// rows: [ { day: 2026-01-01T..., revenueCents: 184000, orders: 23, avgCents: 8000 }, ... ]

// pitfall: a $sort AFTER $group cannot use an index and sorts in memory
// (100 MB cap unless { allowDiskUse: true }).`,
        codeTs: `interface DayRevenue { day: Date; revenueCents: number; orders: number; avgCents: number; }

const since = new Date("2026-01-01");
const rows = await Order.aggregate<DayRevenue>([
  { $match: { status: "paid", createdAt: { $gte: since } } },
  { $group: {
      _id: { $dateTrunc: { date: "$createdAt", unit: "day" } },
      revenueCents: { $sum: "$totalCents" },
      orders: { $sum: 1 },
      avgCents: { $avg: "$totalCents" },
  }},
  { $sort: { _id: 1 } },
  { $project: { _id: 0, day: "$_id", revenueCents: 1, orders: 1, avgCents: { $round: ["$avgCents", 0] } } },
]);`,
        output: `[
  { day: 2026-01-01T00:00:00.000Z, revenueCents: 184000, orders: 23, avgCents: 8000 },
  { day: 2026-01-02T00:00:00.000Z, revenueCents: 210500, orders: 27, avgCents: 7796 },
  { day: 2026-01-03T00:00:00.000Z, revenueCents: 95000,  orders: 12, avgCents: 7917 }
]

The pipeline filtered to paid orders since Jan 1 (using the compound
index), grouped by day, and summed. Putting $match first is what keeps
this fast — a $match after $group would scan everything.`,
        explain: 'The aggregation pipeline is an ordered list of stages, each transforming the stream from the previous one. $match is the filter and belongs first, before $group or $sort, so it can use an index and shrink the working set. $group with $sum / $avg / $count is the GROUP BY equivalent, and $project reshapes the output. The performance trap is a $sort that comes after a $group — it can no longer use an index and sorts in memory with a 100 MB limit.',
        explainHi: 'Aggregation pipeline stages ki ek ordered list hai, har ek pichhle se stream transform karti hai. $match filter hai aur pehle rehna chahiye, $group ya $sort se pehle, taaki ye ek index istemal kar sake aur working set chhota kare. $group $sum / $avg ke saath GROUP BY samतुल्य hai. Performance trap ek $sort hai jo ek $group ke baad aata hai — ye ab ek index istemal nahi kar sakta aur memory mein sort karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// embed the full, live product into every order line
const orderSchema = new Schema({
  items: [{
    product: {                                  // <- entire product document, copied
      _id: ObjectId, name: String, description: String,
      priceCents: Number, category: String, images: [String],
    },
    qty: Number,
  }],
});
// now: a product rename or price change must rewrite every order that contains it;
// and each order carries a stale snapshot that drifts from the real product`,
        right: `const orderSchema = new Schema({
  items: [{
    productId:  { type: Schema.Types.ObjectId, ref: "Product" },   // reference the live record
    nameAtSale: String,                                             // snapshot ONLY what must be frozen
    priceCentsAtSale: Number,                                       // the price as sold — intentionally fixed
    qty: Number,
  }],
});
// live product details: look up by productId when you need them (or populate on the list query)
// historical accuracy: nameAtSale / priceCentsAtSale never change`,
        why: 'Embedding a full, mutable entity that is shared across many parents turns every edit of that entity into a mass update of every document that copied it, and leaves stale copies everywhere in between. An order should reference the product by id for its live details, and separately snapshot only the fields that must be historically fixed — the name and price as they were at the time of sale, which you genuinely want frozen even if the product later changes. Embed data that belongs to one parent and changes with it; reference data that is shared and changes on its own; snapshot the specific fields where "as it was then" is the correct semantics.',
        whyHi: 'Ek poori, mutable entity ko embed karna jo kई parents ke aar-paar shared hai us entity ke har edit ko har document ka ek mass update banata hai jisne ise copy kiya. Ek order ko apni live details ke liye product ko id se reference karna chahiye, aur alag se sirf un fields ka snapshot lena chahiye jinhe historically fixed hona chahiye. Ek parent ka data jo iske saath badalta hai embed karo; shared data reference karo; specific fields snapshot karo jahaan "jaise tab tha" sahi semantics hai.',
      },
      {
        wrong: `// validation defined on the schema...
const userSchema = new Schema({
  email: { type: String, required: true, match: /^[^@]+@[^@]+$/ },
  role:  { type: String, enum: ["user", "admin"] },
});
// ...but the update path bypasses it entirely
await User.findByIdAndUpdate(id, { email: "not-an-email", role: "superuser" });
// both invalid values are written — no error`,
        right: `await User.findByIdAndUpdate(
  id,
  { email: "not-an-email", role: "superuser" },
  { runValidators: true, new: true },
);
// -> ValidationError: email does not match, role is not a valid enum value

// or load, mutate, save (runs full validation + hooks):
const user = await User.findById(id);
user.email = newEmail;
await user.save();`,
        why: 'Mongoose schema validation runs on save and create, but the update operators — updateOne, updateMany, findOneAndUpdate, findByIdAndUpdate — skip it by default, because they translate directly to a database update without loading and re-validating the document. So an endpoint that updates via findByIdAndUpdate can write data that violates every rule in the schema. Pass runValidators true on every update that takes user input, or use the load-mutate-save pattern which always validates and also runs your pre/post save hooks. Be aware runValidators still cannot see other fields for cross-field validators, since the full document is not loaded.',
        whyHi: 'Mongoose schema validation save aur create par chalti hai, par update operators — updateOne, findOneAndUpdate, findByIdAndUpdate — ise default se skip karte hain, kyunki wo document ko load aur re-validate kiye bina seedhe ek database update mein translate hote hain. To ek endpoint jo findByIdAndUpdate ke through update karta hai wo data likh sakta hai jo schema ke har rule ka ullanghan karta hai. Har update par runValidators true pass karo jo user input leta hai, ya load-mutate-save pattern istemal karo.',
      },
      {
        wrong: `// list endpoint: populate inside a loop
const orders = await Order.find({ status: "paid" }).limit(50);
for (const order of orders) {
  await order.populate("customerId");     // one query PER order -> 51 total
  view.push({ id: order._id, customer: order.customerId.name });
}`,
        right: `const orders = await Order.find({ status: "paid" })
  .limit(50)
  .populate("customerId", "name email")   // ONE extra query: an $in over all 50 customer ids
  .lean();                                 // plain objects for a read-only JSON response
view = orders.map(o => ({ id: o._id, customer: o.customerId.name }));`,
        why: 'populate is Mongoose\'s join, and it issues a query to fetch the referenced documents. Called once on a query for 50 orders, it collects the 50 customer ids and does a single find with an $in — one extra query total. Called inside a loop, once per order, it is 50 extra queries: the Mongoose N+1. Always populate on the list query, not per document. Add lean() for read paths so you get plain objects instead of the heavier hydrated documents, and pass a field projection to populate so you only pull the columns you render.',
        whyHi: 'populate Mongoose ka join hai, aur ye referenced documents fetch karne ke liye ek query issue karta hai. 50 orders ki ek query par ek baar call kiya, ye 50 customer ids collect karta hai aur ek single find $in ke saath karta hai — kul ek extra query. Ek loop ke andar call kiya, prati order ek baar, ye 50 extra queries hai: Mongoose N+1. Hamesha list query par populate karo, prati document nahi.',
      },
    ],

    realWorld: [
      {
        en: '**An e-commerce `orders` collection that embeds `items` and `shippingAddress` and references `customerId`** — order reads are a single document lookup, and a compound index on `{ customerId: 1, createdAt: -1 }` serves the "my orders" page in one index scan.',
        hi: '**Ek e-commerce `orders` collection jo `items` aur `shippingAddress` embed karti hai aur `customerId` reference karti hai** — order reads ek single document lookup hain.',
      },
      {
        en: '**A `sessions` collection with a TTL index (`expireAfterSeconds: 1209600`)** so expired sessions delete themselves and the collection never grows unbounded — the same pattern for password-reset tokens and short-lived job records.',
        hi: '**Ek `sessions` collection ek TTL index ke saath** taaki expired sessions khud ko delete karein aur collection kabhi unbounded nahi badhti.',
      },
      {
        en: '**A daily analytics rollup written by an aggregation pipeline** (`$match` on yesterday → `$group` by dimensions → `$merge` into a `daily_stats` collection) so the dashboard reads pre-aggregated documents instead of scanning the raw event collection every load.',
        hi: '**Ek daily analytics rollup jo ek aggregation pipeline dwara likha jaata hai** taaki dashboard pre-aggregated documents padhta hai raw event collection scan karne ke bजाy.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you decide whether to embed or reference in a MongoDB schema?',
        qHi: 'Aap MongoDB schema mein embed ya reference karna kaise decide karte ho?',
        a: 'The decision is driven by the access pattern, not by which things conceptually relate. You embed — nest the data inside the parent document — when you always read it together with the parent, it belongs to exactly one parent, its size is bounded, and it changes together with the parent and is not queried on its own. Order line items, a shipping address, a small set of tags on a post: all embed, so reading the parent is a single document lookup with no join. You reference — store just the id and keep the data in its own collection — when the data is shared across many parents, is queried independently, is large or unbounded, or changes on its own schedule. The customer on an order, the author of ten thousand posts, a user\'s full activity history: all reference, because copying them would mean mass updates and stale duplicates. The classic mistakes are embedding a shared mutable entity so that renaming it becomes ten thousand document rewrites, and referencing something you always read together so every request does an application-side join. A useful hybrid is to reference the live record for current details and separately snapshot the specific fields that must be historically frozen, like the product name and price as sold. And remember the 16 MB document limit — anything that grows without bound must be referenced.',
        aHi: 'Decision access pattern se driven hai, na ki kaunsi cheezein conceptually relate karti hain. Aap embed karte ho — data ko parent document ke andar nest — jab aap ise hamesha parent ke saath padhte ho, ye theek ek parent ka hai, iski size bounded hai, aur ye parent ke saath badalta hai. Order line items, ek shipping address: sab embed. Aap reference karte ho — sirf id store karo — jab data kई parents ke aar-paar shared hai, apne aap query hota hai, bada ya unbounded hai. Ek order par customer: reference. Classic galtiyaan ek shared mutable entity ko embed karna hai taaki ise rename karna das hazaar document rewrites ban jaaye. Ek useful hybrid live record ko reference karna aur alag se specific fields ka snapshot lena hai. Aur 16 MB document limit yaad rakho.',
      },
      {
        q: 'Why did a MongoDB query that was fast for a year suddenly get slow, and how would you diagnose and fix it?',
        qHi: 'Ek MongoDB query jo ek saal tak fast thi achaanak slow kyun ho gayi, aur aap kaise diagnose aur fix karenge?',
        a: 'The most likely cause is a missing index that did not matter until the collection got large. MongoDB does not warn you when a query has no supporting index — it just scans every document in the collection, a COLLSCAN. At a few thousand documents that scan is microseconds and nobody notices; when the collection crosses hundreds of thousands or millions, the same query is suddenly hundreds of milliseconds, and nothing in the application code changed. To diagnose, I run the query with explain and executionStats and look at the winning plan: a COLLSCAN stage, and totalDocsExamined far larger than nReturned, means the query read the whole collection to return a fraction of it. The fix is an index matching the query\'s filter and sort. For a compound index I follow the Equality-Sort-Range order — fields tested for equality first, then the sort field, then any range field — so an index on status ascending and createdAt descending serves a query that filters by status and sorts by createdAt. I declare indexes in the schema so they are version-controlled, turn off autoIndex in production, and build the index deliberately, ideally in the background or during a maintenance window on a large collection. Then I re-run explain to confirm the plan is now an IXSCAN with docsExamined close to nReturned.',
        aHi: 'Sabse sambhaavit kaaran ek missing index hai jo maayne nahi rakhta tha jab tak collection bada nahi ho gaya. MongoDB aapko warn nahi karta jab ek query ka koi supporting index nahi hai — ye bस collection ke har document ko scan karta hai, ek COLLSCAN. Kuch hazaar documents par wo scan microseconds hai; jab collection lakhon ya millions paar karti hai, wahi query achaanak sau milliseconds hai. Diagnose karne ke liye, main query ko explain aur executionStats ke saath chalata hoon: ek COLLSCAN stage, aur nReturned se bahut bada totalDocsExamined. Fix query ke filter aur sort se match karta ek index hai. Ek compound index ke liye main Equality-Sort-Range order follow karta hoon. Main schema mein indexes declare karta hoon, production mein autoIndex off karta hoon.',
      },
    ],

    exercises: [
      {
        task: 'Design Mongoose schemas for a blog: `Post` (title, body, `authorId` ref User, `tags` array of strings, `comments` array of `{ authorName, body, createdAt }`) and `User` (name, email unique). Justify in comments why `tags` and `comments` are embedded but `author` is referenced. Add a compound index that serves "a given author\'s posts, newest first".',
        taskHi: 'Ek blog ke liye Mongoose schemas design karo: `Post` aur `User`. Comments mein justify karo ki `tags` aur `comments` embedded kyun hain par `author` referenced. Ek compound index add karo jo "ek diye author ke posts, newest first" serve karta hai.',
        hint: '`tags`/`comments`: read with the post, belong to one post, bounded (a post has a few tags and — assume — a moderate number of comments). `author`: shared across all their posts, queried on its own, changes independently. Index: `postSchema.index({ authorId: 1, createdAt: -1 })`.',
        hintHi: '`tags`/`comments`: post ke saath padhe, ek post ke, bounded. `author`: sabhi posts ke aar-paar shared, apne aap query hota. Index: `postSchema.index({ authorId: 1, createdAt: -1 })`.',
      },
      {
        task: 'Write an aggregation pipeline on an `orders` collection (`{ status, totalCents, createdAt, customerId }`) that returns, for `status: "paid"` orders in a date range, the top 5 customers by total spend: `[{ customerId, totalCents, orderCount }]` sorted descending. Put `$match` first and explain in a comment why `$sort` + `$limit` at the end still can\'t use an index here.',
        taskHi: 'Ek `orders` collection par ek aggregation pipeline likho jo top 5 customers by total spend return karta hai. `$match` pehle rakho aur ek comment mein explain karo ki end mein `$sort` + `$limit` yahaan ek index istemal kyun nahi kar sakta.',
        hint: '`[{ $match: { status: "paid", createdAt: {...} } }, { $group: { _id: "$customerId", totalCents: { $sum: "$totalCents" }, orderCount: { $sum: 1 } } }, { $sort: { totalCents: -1 } }, { $limit: 5 }]`. The `$sort` is on `totalCents`, a value computed by `$group` — it does not exist in any index, so it is an in-memory sort.',
        hintHi: '`$match` -> `$group` (by `$customerId`, `$sum`) -> `$sort` -> `$limit`. `$sort` `totalCents` par hai, ek value jo `$group` compute karti hai — ye kisi index mein nahi hai.',
      },
      {
        task: 'Given a standalone `mongod` (no replica set), write a `transferCredits(fromId, toId, amount)` that must be atomic. Show that `session.withTransaction` throws on a standalone, then implement the fallback: model both balances as fields in ONE document (an `account_pair` or use a single `accounts` doc with a subdocument) so a single `updateOne` with `$inc` on both is atomic without a transaction. Note when you\'d actually need the real transaction.',
        taskHi: 'Ek standalone `mongod` diya, ek `transferCredits(fromId, toId, amount)` likho jo atomic hona chahiye. Dikhाao ki `session.withTransaction` standalone par throw karta hai, phir fallback implement karo: dono balances ko EK document mein fields ke roop mein model karo taaki ek single `updateOne` atomic ho.',
        hint: 'A single-document update in MongoDB is always atomic. If both balances are subfields of one doc, `updateOne({ _id, "from.balance": { $gte: amount } }, { $inc: { "from.balance": -amount, "to.balance": amount } })` succeeds-or-noops atomically. You need a real transaction when the two things genuinely cannot live in one document (two separate user accounts).',
        hintHi: 'MongoDB mein ek single-document update hamesha atomic hai. Agar dono balances ek doc ke subfields hain, ek `updateOne` `$inc` ke saath atomic hai. Aapko ek real transaction tab chahiye jab do cheezein genuinely ek document mein nahi reh sakti.',
      },
    ],

    keyTakeaways: [
      'MongoDB stores DOCUMENTS (nested BSON), goal = the shape you STORE matches the shape you READ (an order + its items + address = one document, one lookup, no join). Every doc has `_id` (`ObjectId`, ~time-ordered). Collections are schemaless at the DB level. 16 MB HARD document limit — an unbounded array eventually fails hard.',
      'EMBED vs REFERENCE is THE modelling decision, driven by ACCESS PATTERN. EMBED when: always read together + belongs to one parent + bounded size + changes with the parent (order items, address, tags). REFERENCE when: shared across parents + queried independently + large/unbounded + changes on its own (the customer, the author of 10k posts, an activity feed).',
      'Classic mistakes: embedding a shared mutable entity (rename = mass update + stale copies) vs referencing something always read together (app-side join every request). HYBRID: reference the live record + snapshot only the fields that must be historically frozen (name/price as sold).',
      'MONGOOSE adds a schema, casting, validation, hooks over the raw driver. Validation runs on `.save()`/`.create()` — NOT on `updateOne`/`updateMany`/`findOneAndUpdate`/`findByIdAndUpdate` unless `{ runValidators: true }` (a very common "bad data via update" bug). `{ timestamps: true }` for `createdAt`/`updatedAt`.',
      '`.populate("ref")` = Mongoose\'s join, issues a SECOND query (`$in` over collected ids). Once on a list query = 1 extra query; inside a loop = the Mongoose N+1. `.lean()` returns plain objects (fast, low memory) for read-only paths — loses `.save()`/virtuals/getters.',
      'AGGREGATION PIPELINE = ordered stages, each consuming the previous output: `$match` (filter — put FIRST so it uses an index), `$group` (`$sum`/`$avg`/`$push` — the GROUP BY), `$project`/`$addFields`, `$sort`/`$limit`/`$skip`, `$lookup`, `$unwind`. A `$sort` AFTER `$group` can\'t use an index -> in-memory sort (100 MB cap).',
      'NO INDEX = FULL COLLECTION SCAN (`COLLSCAN`) on any filter/sort — invisible until the collection is large. Diagnose with `.explain("executionStats")`: `COLLSCAN` + `totalDocsExamined` >> `nReturned` -> add an index. Compound index order = ESR (Equality, then Sort, then Range). Turn `autoIndex` OFF in production. Partial index for "only active", TTL index for auto-expiring docs.',
      'TRANSACTIONS need a REPLICA SET (not standalone), an explicit `session`, `{ session }` on every op inside, and `session.withTransaction(fn)` (handles commit + retries). Keep them short. The MongoDB instinct: EMBED the two things that must stay consistent into one document (single-doc writes are always atomic) — reserve transactions for genuinely cross-document cases. "Which database" is an architecture decision from the access patterns, not a default.',
    ],
    keyTakeawaysHi: [
      'MongoDB DOCUMENTS store karta hai (nested BSON), goal = jo shape aap STORE karte ho wo shape aap READ karte ho. Har doc ka `_id`. Collections DB level par schemaless. 16 MB HARD document limit.',
      'EMBED vs REFERENCE THE modelling decision hai, ACCESS PATTERN se driven. EMBED jab: hamesha saath padha + ek parent ka + bounded size + parent ke saath badalta. REFERENCE jab: parents ke aar-paar shared + independently query hota + large/unbounded + apne aap badalta.',
      'Classic galtiyaan: ek shared mutable entity embed karna (rename = mass update) vs kuch reference karna jise hamesha saath padha jaata hai. HYBRID: live record reference karo + sirf historically frozen fields ka snapshot lo.',
      'MONGOOSE ek schema, casting, validation, hooks add karta hai. Validation `.save()`/`.create()` par chalti hai — `updateOne`/`findOneAndUpdate` par NAHI jab tak `{ runValidators: true }`.',
      '`.populate("ref")` = Mongoose ka join, ek DOOSRI query issue karta hai. Ek list query par ek baar = 1 extra query; ek loop ke andar = Mongoose N+1. `.lean()` plain objects return karta hai read-only paths ke liye.',
      'AGGREGATION PIPELINE = ordered stages: `$match` (filter — PEHLE rakho), `$group`, `$project`, `$sort`/`$limit`, `$lookup`, `$unwind`. Ek `$sort` `$group` ke BAAD ek index istemal nahi kar sakta.',
      'KOI INDEX NAHI = FULL COLLECTION SCAN (`COLLSCAN`) — collection bade hone tak invisible. `.explain("executionStats")` se diagnose karo. Compound index order = ESR. Production mein `autoIndex` OFF.',
      'TRANSACTIONS ko ek REPLICA SET chahiye, ek explicit `session`, har op par `{ session }`, aur `session.withTransaction(fn)`. Chhote rakho. MongoDB instinct: consistent rehne waali do cheezein ek document mein EMBED karo.',
    ],
  },
];
