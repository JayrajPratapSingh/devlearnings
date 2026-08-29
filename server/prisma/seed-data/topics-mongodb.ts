import type { SeedCategory } from './topics-shared';

/**
 * MongoDB, taught with the same Users / Products / Orders domain the SQL
 * section uses — so the interesting part (how the same data is modelled
 * differently) is visible rather than buried under different examples.
 */
export const mongodbCategory: SeedCategory = {
  slug: 'mongodb',
  name: 'MongoDB',
  description: 'Documents, query operators, aggregation, indexes and the embed-vs-reference decision.',
  icon: 'mongodb',
  group: 'data',
  topics: [
    {
      slug: 'mongo-documents',
      title: 'Documents, Collections & BSON',
      difficulty: 'EASY',
      summary: 'A document is a JSON-like object; a collection is a bunch of them. No fixed schema, so two documents in one collection can look different.',
      summaryHi: 'Document ek JSON jaisa object hai; collection unka group. Koi fixed schema nahi, isliye ek hi collection ke do documents alag dikh sakte hain.',
      content: `Mapping from the SQL words you already know:

| SQL | MongoDB |
|---|---|
| database | database |
| table | **collection** |
| row | **document** |
| column | **field** |
| JOIN | \`$lookup\` (or embed the data instead) |

A document is stored as **BSON** — binary JSON. That is why it has types JSON does not: \`ObjectId\`, real \`Date\`, \`Decimal128\`, binary.

Every document gets an \`_id\`. If you do not supply one, Mongo creates an **ObjectId**: 12 bytes made of a timestamp + machine + counter. Two useful consequences — it is unique without a central sequence, and it is *roughly* sortable by creation time.

**Schemaless does not mean structureless.** Mongo will happily let you save \`price: "499"\` in one document and \`price: 499\` in the next, and then your \`$gt\` query silently misses half your data. The schema moves from the database into your application — it does not disappear.`,
      contentHi: `Aapke jaane hue SQL shabdon se mapping:

| SQL | MongoDB |
|---|---|
| database | database |
| table | **collection** |
| row | **document** |
| column | **field** |
| JOIN | \`$lookup\` (ya data embed kar do) |

Document **BSON** mein store hota hai — binary JSON. Isi wajah se ismein wo types hain jo JSON mein nahi: \`ObjectId\`, asli \`Date\`, \`Decimal128\`, binary.

Har document ko ek \`_id\` milta hai. Aap na do to Mongo **ObjectId** banata hai: 12 bytes — timestamp + machine + counter. Do faayde — bina kisi central sequence ke unique, aur *lagbhag* creation time se sortable.

**Schemaless ka matlab structureless nahi hai.** Mongo aaram se ek document mein \`price: "499"\` aur agle mein \`price: 499\` save kar lega, aur phir aapki \`$gt\` query chupchaap aadha data miss kar degi. Schema database se hat kar application mein aa jata hai — gayab nahi hota.`,
      codeExample: `// one document in the "products" collection
{
  _id: ObjectId("66c1f2a4e1b2c3d4e5f60718"),
  name: "Wireless Mouse",
  price: 499,                    // Number, not "499"
  stock: 12,
  tags: ["electronics", "accessories"],   // arrays are first-class
  supplier: { name: "Acme", city: "Pune" }, // nested object, no join needed
  createdAt: ISODate("2026-08-21T10:30:00Z")
}`,
      commonMistakes: [
        'Storing numbers as strings — "499" > 100 is false, so range queries silently miss documents.',
        'Assuming schemaless means you never have to think about shape. It just moves the responsibility to your code.',
        'Treating ObjectId as a plain string — you must cast it, or the query matches nothing.',
        'Using ObjectId timestamps as exact ordering. They are only second-resolution and machine-dependent.',
      ],
      interviewQuestions: [
        'What is the difference between a collection and a table?',
        'What is BSON and why not just JSON?',
        'What is inside an ObjectId?',
        'Does schemaless mean no schema?',
      ],
      practiceQuestions: ['Model a product with a supplier and tags as a single document, then list what a relational version would need.'],
      tags: ['mongodb', 'documents', 'bson', 'basics'],
    },

    {
      slug: 'mongo-crud',
      title: 'CRUD Operations',
      difficulty: 'EASY',
      summary: 'insertOne, find, updateOne, deleteOne. Updates need an operator like $set — passing a bare object replaces the whole document.',
      summaryHi: 'insertOne, find, updateOne, deleteOne. Update mein $set jaisa operator zaroori hai — plain object doge to poora document replace ho jayega.',
      content: `\`\`\`js
// CREATE
await db.products.insertOne({ name: "Mouse", price: 499, stock: 12 });
await db.products.insertMany([{ ... }, { ... }]);

// READ
await db.products.find({ price: { $lt: 1000 } }).toArray();
await db.products.findOne({ _id: new ObjectId(id) });

// UPDATE
await db.products.updateOne({ _id: id }, { $set: { price: 449 } });
await db.products.updateMany({ stock: 0 }, { $set: { available: false } });

// DELETE
await db.products.deleteOne({ _id: id });
\`\`\`

**The mistake everyone makes once.** \`updateOne({_id}, { price: 449 })\` without \`$set\` is not "update the price" — it **replaces the entire document** with \`{ price: 449 }\`. Name, stock, tags, all gone. Modern drivers now throw on this, but older code and \`replaceOne\` still behave this way.

Useful update operators: \`$set\`, \`$unset\`, \`$inc\` (atomic counter), \`$push\`/\`$pull\` (arrays), \`$addToSet\` (push only if absent).

\`$inc\` matters more than it looks: \`{ $inc: { stock: -1 } }\` is **atomic on the server**, so two concurrent orders cannot both read 10 and both write 9. Read-then-write in your app code can.`,
      contentHi: `\`\`\`js
// CREATE
await db.products.insertOne({ name: "Mouse", price: 499, stock: 12 });

// READ
await db.products.find({ price: { $lt: 1000 } }).toArray();

// UPDATE
await db.products.updateOne({ _id: id }, { $set: { price: 449 } });

// DELETE
await db.products.deleteOne({ _id: id });
\`\`\`

**Wo galti jo har koi ek baar karta hai.** \`$set\` ke bina \`updateOne({_id}, { price: 449 })\` "price update karo" nahi hai — ye **poore document ko replace** kar deta hai \`{ price: 449 }\` se. Name, stock, tags — sab gayab. Naye drivers ab error dete hain, par purana code aur \`replaceOne\` aise hi behave karte hain.

Kaam ke update operators: \`$set\`, \`$unset\`, \`$inc\` (atomic counter), \`$push\`/\`$pull\` (arrays), \`$addToSet\` (na ho tabhi push).

\`$inc\` dikhne se zyada important hai: \`{ $inc: { stock: -1 } }\` **server par atomic** hai, isliye do concurrent orders dono 10 padh kar dono 9 nahi likh sakte. App code mein read-then-write kar sakta hai.`,
      codeExample: `// ❌ replaces the whole document
await products.updateOne({ _id: id }, { price: 449 });

// ✅ updates one field
await products.updateOne({ _id: id }, { $set: { price: 449 } });

// ✅ atomic decrement — safe under concurrency
await products.updateOne(
  { _id: id, stock: { $gt: 0 } },
  { $inc: { stock: -1 } }
);`,
      commonMistakes: [
        'Forgetting $set and replacing the entire document.',
        'Reading stock, subtracting in JS, then writing it back — two requests race and one update is lost. Use $inc.',
        'Forgetting new ObjectId(id) — a string id matches nothing and you get a confusing empty result, not an error.',
        'find() returns a cursor, not an array. Forgetting .toArray() gives you an object that looks empty.',
      ],
      interviewQuestions: [
        'What happens if you call updateOne without an update operator?',
        'How do you decrement stock safely under concurrent requests?',
        'Difference between updateOne and replaceOne?',
        'Why does find() need toArray()?',
      ],
      practiceQuestions: ['Write an "place order" update that decrements stock only when it is above zero.'],
      relatedProblemSlugs: [],
      tags: ['mongodb', 'crud', 'must-know'],
    },

    {
      slug: 'mongo-query-operators',
      title: 'Query Operators & Projections',
      difficulty: 'MEDIUM',
      summary: 'Comparison, logical and array operators, plus projections to fetch only the fields you need.',
      summaryHi: 'Comparison, logical aur array operators, aur projections taaki sirf zaroori fields aayein.',
      content: `| Operator | Meaning | SQL equivalent |
|---|---|---|
| \`$eq\` \`$ne\` | equal / not equal | \`=\` \`!=\` |
| \`$gt\` \`$gte\` \`$lt\` \`$lte\` | comparisons | \`>\` \`>=\` \`<\` \`<=\` |
| \`$in\` \`$nin\` | in a list | \`IN\` \`NOT IN\` |
| \`$and\` \`$or\` \`$not\` | logic | \`AND\` \`OR\` \`NOT\` |
| \`$exists\` | field is present | \`IS NOT NULL\`-ish |
| \`$regex\` | pattern | \`LIKE\` |
| \`$all\` \`$size\` \`$elemMatch\` | arrays | no direct equivalent |

**Arrays behave surprisingly well.** \`{ tags: "electronics" }\` matches any document whose \`tags\` array *contains* that value — you do not need \`$in\`. That single behaviour removes most join tables.

**Projection** is the second argument: \`find(filter, { projection: { name: 1, price: 1 } })\`. \`1\` includes, \`0\` excludes, and you cannot mix them (except to exclude \`_id\`). Fetching whole documents when you need two fields is the most common avoidable cost in a Mongo app.

**\`$elemMatch\` vs plain matching** is a real interview question. \`{ scores: { $gt: 80, $lt: 90 } }\` matches a document where *some* element is >80 and *some* element is <90 — possibly different elements. \`$elemMatch\` forces **one single element** to satisfy both.`,
      contentHi: `| Operator | Matlab | SQL jaisa |
|---|---|---|
| \`$eq\` \`$ne\` | barabar / nahi | \`=\` \`!=\` |
| \`$gt\` \`$gte\` \`$lt\` \`$lte\` | comparison | \`>\` \`>=\` \`<\` \`<=\` |
| \`$in\` \`$nin\` | list mein | \`IN\` \`NOT IN\` |
| \`$and\` \`$or\` \`$not\` | logic | \`AND\` \`OR\` \`NOT\` |
| \`$exists\` | field maujood hai | \`IS NOT NULL\` jaisa |
| \`$regex\` | pattern | \`LIKE\` |
| \`$all\` \`$size\` \`$elemMatch\` | arrays | koi seedha equivalent nahi |

**Arrays kaafi achhe se behave karte hain.** \`{ tags: "electronics" }\` un saare documents ko match karta hai jinke \`tags\` array mein wo value *hai* — \`$in\` ki zarurat nahi. Bas isi ek behaviour se zyadatar join tables khatam ho jaati hain.

**Projection** doosra argument hai: \`find(filter, { projection: { name: 1, price: 1 } })\`. \`1\` include, \`0\` exclude, aur dono mix nahi kar sakte (\`_id\` hataane ko chhod kar). Do fields chahiye aur poora document laana — Mongo app ka sabse common bekaar kharcha yahi hai.

**\`$elemMatch\` vs simple matching** asli interview sawaal hai. \`{ scores: { $gt: 80, $lt: 90 } }\` us document ko match karega jahan *koi* element >80 ho aur *koi* element <90 ho — dono alag elements ho sakte hain. \`$elemMatch\` **ek hi element** par dono conditions lagata hai.`,
      codeExample: `// products under 1000, in stock, tagged electronics — name + price only
await products.find(
  { price: { $lt: 1000 }, stock: { $gt: 0 }, tags: "electronics" },
  { projection: { name: 1, price: 1, _id: 0 } }
).sort({ price: 1 }).limit(20).toArray();

// one element must satisfy BOTH conditions
await students.find({ scores: { $elemMatch: { $gt: 80, $lt: 90 } } });`,
      commonMistakes: [
        'Fetching whole documents when a projection would return two fields.',
        'Using $gt and $lt on an array and expecting one element to satisfy both — that needs $elemMatch.',
        'Unanchored $regex on a big collection — it cannot use an index, exactly like LIKE "%term".',
        'Mixing 1 and 0 in a projection, which throws.',
      ],
      interviewQuestions: [
        'How does matching work on an array field?',
        '$elemMatch vs a plain range query on an array?',
        'How do you return only some fields?',
        'Why is $regex often slow?',
      ],
      practiceQuestions: ['Find orders placed in the last 30 days over ₹5000, returning only the total and date.'],
      tags: ['mongodb', 'queries', 'operators'],
    },

    {
      slug: 'mongo-aggregation',
      title: 'Aggregation Pipeline',
      difficulty: 'HARD',
      summary: 'A conveyor belt of stages. Each stage transforms documents and passes them on — this is GROUP BY, JOIN and reporting in one place.',
      summaryHi: 'Stages ki ek conveyor belt. Har stage documents ko badal kar aage bhejta hai — GROUP BY, JOIN aur reporting sab yahin.',
      content: `The pipeline is the reason Mongo can do analytics at all.

| Stage | What it does | SQL |
|---|---|---|
| \`$match\` | filter documents | \`WHERE\` |
| \`$group\` | group + aggregate | \`GROUP BY\` |
| \`$sort\` | order | \`ORDER BY\` |
| \`$project\` | pick / compute fields | \`SELECT\` |
| \`$limit\` \`$skip\` | paginate | \`LIMIT\` \`OFFSET\` |
| \`$lookup\` | join another collection | \`LEFT JOIN\` |
| \`$unwind\` | one document per array element | no equivalent |

**Put \`$match\` first.** Stages run in order, so filtering early means every later stage handles fewer documents — and only a \`$match\` at the start of the pipeline can use an index. A \`$match\` after \`$group\` is Mongo's \`HAVING\`, and it is genuinely more expensive.

**\`$unwind\` is the one to understand.** An order with 3 items becomes 3 documents. That is how you aggregate *inside* arrays — but it multiplies your document count, so filter before you unwind, never after.

\`$lookup\` works, but it is not a real join: it runs a second query per input document unless the foreign field is indexed. If you are reaching for \`$lookup\` on every read, that is usually a signal you should have embedded the data.`,
      contentHi: `Pipeline hi wo wajah hai jisse Mongo analytics kar paata hai.

| Stage | Kaam | SQL |
|---|---|---|
| \`$match\` | documents filter | \`WHERE\` |
| \`$group\` | group + aggregate | \`GROUP BY\` |
| \`$sort\` | order | \`ORDER BY\` |
| \`$project\` | fields chuno / banao | \`SELECT\` |
| \`$limit\` \`$skip\` | pagination | \`LIMIT\` \`OFFSET\` |
| \`$lookup\` | doosri collection se join | \`LEFT JOIN\` |
| \`$unwind\` | array ke har element ka alag document | koi equivalent nahi |

**\`$match\` sabse pehle rakho.** Stages order mein chalte hain, isliye jaldi filter karne se aage ke har stage ko kam documents milte hain — aur index sirf pipeline ke shuru wale \`$match\` mein hi use hota hai. \`$group\` ke baad wala \`$match\` Mongo ka \`HAVING\` hai, aur wo sach mein mehenga hai.

**\`$unwind\` samajhna zaroori hai.** 3 items wala ek order 3 documents ban jata hai. Array ke *andar* aggregate karne ka yahi tareeka hai — par isse document count bad jata hai, isliye unwind se *pehle* filter karo, baad mein nahi.

\`$lookup\` chalta hai par asli join nahi hai: agar foreign field par index na ho to har input document ke liye alag query chalti hai. Har read par \`$lookup\` lagana pad raha ho, to aksar iska matlab hai ki data embed karna chahiye tha.`,
      codeExample: `// revenue per city, top 5 — this is one query, not five
await orders.aggregate([
  { $match: { status: "paid", createdAt: { $gte: since } } },  // index-usable, first
  { $unwind: "$items" },                                       // one doc per item
  { $group: {
      _id: "$city",
      revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
      orders:  { $addToSet: "$_id" }
  }},
  { $project: { city: "$_id", revenue: 1, orderCount: { $size: "$orders" }, _id: 0 } },
  { $sort: { revenue: -1 } },
  { $limit: 5 }
]).toArray();`,
      commonMistakes: [
        'Putting $match late — the index is wasted and every earlier stage does needless work.',
        '$unwind before filtering, multiplying documents you were about to throw away.',
        '$lookup on an unindexed foreign field, which turns into a per-document query.',
        'Forgetting _id is the grouping key in $group and then wondering where the field went.',
      ],
      interviewQuestions: [
        'Why should $match come first?',
        'What does $unwind do and when is it dangerous?',
        'Is $lookup the same as a SQL JOIN?',
        'How do you do HAVING in an aggregation?',
      ],
      practiceQuestions: [
        'Write a pipeline for each user\'s total spend and order count, highest first.',
        'Find the 5 best-selling products from orders that contain an items array.',
      ],
      tags: ['mongodb', 'aggregation', 'pipeline', 'must-know'],
    },

    {
      slug: 'mongo-indexes',
      title: 'Indexes & explain()',
      difficulty: 'HARD',
      summary: 'Same trade-off as SQL: fast reads, slower writes. Compound index order follows the ESR rule — Equality, Sort, Range.',
      summaryHi: 'SQL wala hi trade-off: reads tez, writes dheeme. Compound index ka order ESR rule follow karta hai — Equality, Sort, Range.',
      content: `Without an index, Mongo does a **COLLSCAN** — reads every document. \`explain("executionStats")\` tells you which happened.

\`\`\`js
db.orders.find({ userId: id }).sort({ createdAt: -1 }).explain("executionStats")
// want: IXSCAN   ·   bad sign: COLLSCAN with a high totalDocsExamined
\`\`\`

The number to watch is **docsExamined vs nReturned**. Examining 100,000 documents to return 20 means the index is missing or wrong.

**The ESR rule** decides compound index field order:
1. **E**quality fields first — \`userId: id\`
2. **S**ort fields next — \`createdAt: -1\`
3. **R**ange fields last — \`price: { $gt: 100 }\`

So \`{ userId: 1, createdAt: -1 }\` serves that query; \`{ createdAt: -1, userId: 1 }\` does not serve it nearly as well.

Like SQL, Mongo follows the **leftmost prefix**: an index on \`{a, b, c}\` helps queries on \`a\`, \`a+b\`, \`a+b+c\` — but not on \`b\` alone.

Other types worth naming: **unique** (enforces no duplicates — this is how you get a UNIQUE constraint back), **TTL** (auto-deletes documents after N seconds, perfect for sessions and OTPs), **text** (real word search, unlike \`$regex\`), and **partial** (index only documents matching a filter).`,
      contentHi: `Index ke bina Mongo **COLLSCAN** karta hai — har document padhta hai. \`explain("executionStats")\` batata hai kya hua.

\`\`\`js
db.orders.find({ userId: id }).sort({ createdAt: -1 }).explain("executionStats")
// chahiye: IXSCAN   ·   bura signal: COLLSCAN aur zyada totalDocsExamined
\`\`\`

Dekhne wala number hai **docsExamined vs nReturned**. 20 return karne ke liye 1,00,000 documents padhna matlab index nahi hai ya galat hai.

**ESR rule** compound index ka field order tay karta hai:
1. **E**quality fields pehle — \`userId: id\`
2. **S**ort fields uske baad — \`createdAt: -1\`
3. **R**ange fields aakhir mein — \`price: { $gt: 100 }\`

Isliye \`{ userId: 1, createdAt: -1 }\` us query ke liye sahi hai; \`{ createdAt: -1, userId: 1 }\` utna kaam nahi karega.

SQL ki tarah Mongo bhi **leftmost prefix** follow karta hai: \`{a, b, c}\` par index \`a\`, \`a+b\`, \`a+b+c\` mein chalega — par akele \`b\` mein nahi.

Aur types jo jaanna chahiye: **unique** (duplicates rokta hai — UNIQUE constraint yahin se wapas milta hai), **TTL** (N seconds baad documents apne aap delete — sessions aur OTP ke liye perfect), **text** (asli word search, \`$regex\` ke ulat), aur **partial** (sirf filter se match karne wale documents par index).`,
      codeExample: `// ESR: equality (userId) → sort (createdAt) → range would come last
await orders.createIndex({ userId: 1, createdAt: -1 });

// unique — the equivalent of a UNIQUE constraint
await users.createIndex({ email: 1 }, { unique: true });

// TTL — OTPs clean themselves up after 10 minutes
await otps.createIndex({ createdAt: 1 }, { expireAfterSeconds: 600 });`,
      commonMistakes: [
        'Indexing every field. Each one slows down every insert and update.',
        'Wrong compound order — putting the range field before the sort field.',
        'Assuming an index exists because the field is a reference. Mongo creates one only for _id.',
        'Using $regex for search instead of a text index.',
        'Reading explain() and only checking the stage name, not docsExamined vs nReturned.',
      ],
      interviewQuestions: [
        'What is the ESR rule?',
        'How do you tell whether a query used an index?',
        'What is a TTL index good for?',
        'Does Mongo create indexes automatically?',
      ],
      practiceQuestions: ['Take a slow orders query, read its explain output, add the right compound index, compare.'],
      tags: ['mongodb', 'indexes', 'performance', 'must-know'],
    },

    {
      slug: 'mongo-schema-design',
      title: 'Embed vs Reference — the real decision',
      difficulty: 'HARD',
      summary: 'Embed what you read together and that stays small. Reference what is shared, unbounded, or changes independently.',
      summaryHi: 'Jo saath padha jata hai aur chhota rehta hai use embed karo. Jo shared hai, bina limit badhta hai, ya alag se badalta hai use reference karo.',
      content: `This is *the* MongoDB design question, and the answer is driven by **how you read the data**, not by how it relates.

**Embed when:**
- You always read them together (order + its items)
- The child does not exist without the parent
- The array is **bounded** — tens, not thousands
- You want atomicity: one document = one atomic update

**Reference when:**
- The data is shared by many parents (a product referenced by 10,000 orders)
- It grows without limit (a user's activity log)
- It changes independently and often
- The document would approach the **16 MB limit**

**The killer detail: the 16 MB document cap.** An unbounded embedded array will eventually hit it, and the failure arrives in production with no warning. "Can this array grow forever?" is the question that decides most designs.

**Duplication is allowed here, and often correct.** Storing \`productName\` and \`price\` inside an order item is not a bug — it is a *historical record*. If the product price changes next month, the old order must still show what the customer actually paid. In SQL you would reach for the same trick.`,
      contentHi: `Ye MongoDB ka *asli* design sawaal hai, aur jawab is baat se aata hai ki aap data **kaise padhte ho**, na ki uska relation kya hai.

**Embed karo jab:**
- Dono hamesha saath padhe jaate hain (order + uske items)
- Child parent ke bina exist hi nahi karta
- Array **bounded** ho — dozens, hazaron nahi
- Atomicity chahiye: ek document = ek atomic update

**Reference karo jab:**
- Data kai parents mein shared ho (ek product 10,000 orders mein)
- Bina limit badhta ho (user ka activity log)
- Alag se aur baar-baar badalta ho
- Document **16 MB limit** ke paas pahunch raha ho

**Sabse important detail: 16 MB document cap.** Bina limit ka embedded array ek din isse takrayega, aur ye failure production mein bina warning ke aata hai. "Kya ye array hamesha badh sakta hai?" — yahi sawaal zyadatar design tay karta hai.

**Yahan duplication allowed hai, aur aksar sahi hai.** Order item ke andar \`productName\` aur \`price\` store karna bug nahi — wo *historical record* hai. Agle mahine product ka price badal jaye to purane order mein wahi dikhna chahiye jo customer ne actually diya tha. SQL mein bhi yahi trick use karte.`,
      codeExample: `// EMBED — items are read with the order, bounded, and price is historical
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),        // REFERENCE — user is shared and changes
  items: [
    { productId: ObjectId("..."), name: "Mouse", price: 499, qty: 2 }
    //                             ↑ duplicated on purpose: what they PAID
  ],
  total: 998,
  status: "paid",
  createdAt: ISODate("...")
}

// ❌ never embed an unbounded array
{ _id: userId, activityLog: [ /* grows forever → hits 16 MB */ ] }`,
      commonMistakes: [
        'Embedding an unbounded array and hitting the 16 MB document limit in production.',
        'Normalising like SQL out of habit, then needing $lookup on every single read.',
        'Referencing a product and showing its current price on an old order — the customer paid the old one.',
        'Embedding data that many documents share, so one edit means updating thousands of documents.',
      ],
      interviewQuestions: [
        'When do you embed and when do you reference?',
        'What is the maximum document size and why does it matter for design?',
        'Is duplicating data ever correct in MongoDB?',
        'How would you model a user with millions of activity events?',
      ],
      practiceQuestions: [
        'Model Users / Products / Orders for MongoDB and justify each embed-or-reference choice.',
        'Redesign a schema whose embedded comments array is approaching 16 MB.',
      ],
      tags: ['mongodb', 'schema-design', 'modelling', 'must-know'],
    },

    {
      slug: 'mongo-mongoose',
      title: 'Mongoose — schemas, models & populate',
      difficulty: 'MEDIUM',
      summary: 'Mongoose puts the schema back: types, validation, defaults and populate() for references.',
      summaryHi: 'Mongoose schema wapas le aata hai: types, validation, defaults aur references ke liye populate().',
      content: `Mongo is schemaless; **Mongoose is where you put the schema back**. That is the whole reason it exists — types, required fields, defaults, and validation that runs before anything is saved.

\`populate()\` follows a reference and swaps the ObjectId for the real document. It is convenient and it is **a second query** — a \`$lookup\` in disguise. Populating inside a loop is the Mongoose version of the N+1 problem.

Two things that trip people up:

- **\`findOneAndUpdate\` skips \`save\` middleware and validators by default.** If your password-hashing hook lives in \`pre('save')\`, an update path silently stores the plain password. Pass \`{ runValidators: true }\`, or route writes through \`save()\`.
- **Lean queries.** \`.lean()\` returns plain objects instead of full Mongoose documents. Much faster and much lighter — use it whenever you are only reading and rendering.`,
      contentHi: `Mongo schemaless hai; **Mongoose wahi schema wapas laata hai**. Iska poora maksad yahi hai — types, required fields, defaults, aur validation jo save hone se pehle chalti hai.

\`populate()\` reference follow karke ObjectId ki jagah asli document le aata hai. Ye convenient hai aur ye **ek doosri query** hai — chhupa hua \`$lookup\`. Loop ke andar populate karna Mongoose wala N+1 problem hai.

Do cheezein jo log fasate hain:

- **\`findOneAndUpdate\` by default \`save\` middleware aur validators skip karta hai.** Agar aapka password-hashing hook \`pre('save')\` mein hai, to update path chupchaap plain password store kar dega. \`{ runValidators: true }\` do, ya writes \`save()\` se karao.
- **Lean queries.** \`.lean()\` poore Mongoose documents ki jagah plain objects deta hai. Kaafi tez aur halka — jab sirf padh kar dikhana ho tab hamesha use karo.`,
      codeExample: `const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items:  [{ name: String, price: Number, qty: { type: Number, min: 1 } }],
  total:  { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'paid', 'shipped'], default: 'pending' },
}, { timestamps: true });          // adds createdAt / updatedAt

const Order = mongoose.model('Order', orderSchema);

// populate = a second query. Fine once; disastrous inside a loop.
const orders = await Order.find({ status: 'paid' })
  .populate('userId', 'name email')
  .lean();                          // plain objects — faster for read-only`,
      commonMistakes: [
        'populate() inside a loop — the N+1 problem, just in Mongoose clothing.',
        'findOneAndUpdate silently skipping validators and pre-save hooks.',
        'Returning full Mongoose documents from read-only endpoints instead of .lean().',
        'Defining a schema but never adding indexes, assuming Mongoose creates them.',
        'Trusting schema validation alone — it does not apply to writes made outside Mongoose.',
      ],
      interviewQuestions: [
        'Why use Mongoose if MongoDB is schemaless?',
        'What does populate() actually do?',
        'Why might findOneAndUpdate skip your password hashing?',
        'What does .lean() change?',
      ],
      practiceQuestions: ['Write a User schema with a unique email, hashed password and a pre-save hook.'],
      tags: ['mongodb', 'mongoose', 'odm', 'nodejs'],
    },

    {
      slug: 'mongo-transactions',
      title: 'Transactions, Atomicity & Replica Sets',
      difficulty: 'HARD',
      summary: 'A single document update is always atomic. Multi-document transactions exist but need a replica set and cost performance.',
      summaryHi: 'Ek document ka update hamesha atomic hota hai. Multi-document transactions milte hain par replica set chahiye aur performance ki keemat par.',
      content: `**Single-document operations are always atomic**, however deeply nested. That is a design gift: model the thing that must change together as *one document*, and you never need a transaction.

Since 4.0 Mongo supports **multi-document ACID transactions**, but:
- They require a **replica set** (a standalone \`mongod\` cannot do them — Atlas always can)
- They cost noticeably more than single-document writes
- They have a default 60-second limit
- Needing them often means the schema should have embedded instead

A **replica set** is a primary plus secondaries. Writes go to the primary, which replicates to secondaries; if it dies, an election promotes one. That is where durability and failover come from.

**Write concern** is how much confirmation you wait for. \`w: 1\` = the primary acknowledged. \`w: "majority"\` = most of the set has it, so it survives a failover. Money uses majority; analytics events do not need to.

**Read preference** decides who answers reads. Reading from secondaries scales reads out, but they lag — so a user can save something and then not see it. Do not read your own writes from a secondary.`,
      contentHi: `**Ek document ka operation hamesha atomic hota hai**, chahe kitna bhi nested ho. Ye design ka tohfa hai: jo cheezein saath badalni hain unhe *ek hi document* mein model karo, transaction ki zarurat hi nahi padegi.

4.0 se Mongo **multi-document ACID transactions** deta hai, par:
- **Replica set** chahiye (akela \`mongod\` nahi kar sakta — Atlas hamesha kar sakta hai)
- Single-document writes se kaafi mehenge hain
- Default 60-second limit hai
- Inki zarurat padna aksar iska matlab hai ki schema mein embed karna chahiye tha

**Replica set** matlab ek primary aur kuch secondaries. Writes primary par jaate hain, wahan se secondaries par replicate hote hain; primary mar jaye to election se koi promote ho jata hai. Durability aur failover yahin se aate hain.

**Write concern** matlab aap kitni confirmation ka intezar karte ho. \`w: 1\` = primary ne maan liya. \`w: "majority"\` = set ke zyadatar members ke paas pahunch gaya, isliye failover mein bhi bacha rahega. Paise ke liye majority; analytics events ke liye zarurat nahi.

**Read preference** tay karta hai reads kaun answer karega. Secondaries se padhne se reads scale hote hain, par wo peeche hote hain — user kuch save karke use dekh nahi paata. Apni hi writes secondary se mat padho.`,
      codeExample: `// Needed only because two DOCUMENTS must change together
const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await products.updateOne(
      { _id: productId, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      { session }
    );
    await orders.insertOne({ userId, productId, qty }, { session });
  }, { writeConcern: { w: 'majority' } });
} finally {
  await session.endSession();
}`,
      commonMistakes: [
        'Reaching for a transaction where a single-document $inc would have been atomic already.',
        'Trying to use transactions on a standalone mongod — they need a replica set.',
        'Using w: 1 for payments, so an acknowledged write can vanish in a failover.',
        'Reading from secondaries and being surprised the user cannot see what they just saved.',
        'Long-running transactions that hit the 60-second limit under load.',
      ],
      interviewQuestions: [
        'Does MongoDB support ACID?',
        'When do you actually need a multi-document transaction?',
        'What is a replica set and what does it give you?',
        'w: 1 vs w: "majority"?',
        'What breaks if you read from a secondary?',
      ],
      practiceQuestions: ['Implement "place an order and decrement stock" both ways — one document, and a transaction — and compare.'],
      tags: ['mongodb', 'transactions', 'acid', 'replica-set', 'advanced'],
    },

    {
      slug: 'mongo-vs-sql',
      title: 'MongoDB vs PostgreSQL — choosing',
      difficulty: 'MEDIUM',
      summary: 'Relational for related data and multi-row transactions. Document for known access patterns, varying shapes and easy horizontal scale.',
      summaryHi: 'Jude hue data aur multi-row transactions ke liye relational. Pata hue access patterns, badalte shapes aur aasan horizontal scale ke liye document.',
      content: `| | PostgreSQL | MongoDB |
|---|---|---|
| Shape | fixed schema, enforced by the DB | flexible, enforced by your app |
| Relations | real joins, foreign keys | \`$lookup\` or embed |
| Transactions | multi-row, everyday | multi-document, possible but costly |
| Scaling | replicas; sharding is work | sharding is built in |
| Best for | orders, payments, anything with integrity rules | catalogs, logs, events, content, varying shapes |

**Pick relational** when the data is genuinely relational and correctness is enforced by constraints — orders, payments, inventory. The database refusing bad data is a feature you cannot replicate in application code reliably.

**Pick document** when you know the access pattern up front, documents are the unit of read and write, and shapes vary between records.

**The answer interviewers want** is neither. It is: *"What are the access patterns?"* Then name the trade-off. And note that Postgres has **JSONB** — so "I need flexible fields" alone is rarely a reason to leave SQL. Plenty of real systems use both: Postgres for money, Mongo for the catalog.`,
      contentHi: `| | PostgreSQL | MongoDB |
|---|---|---|
| Shape | fixed schema, DB enforce karta hai | flexible, aapki app enforce karti hai |
| Relations | asli joins, foreign keys | \`$lookup\` ya embed |
| Transactions | multi-row, rozmarra | multi-document, possible par mehenge |
| Scaling | replicas; sharding mehnat | sharding built in |
| Best for | orders, payments, integrity rules wala kuch bhi | catalogs, logs, events, content, badalte shapes |

**Relational chuno** jab data sach mein relational ho aur correctness constraints se aati ho — orders, payments, inventory. Database ka galat data reject karna aisa feature hai jo application code mein bharose se nahi bana sakte.

**Document chuno** jab access pattern pehle se pata ho, documents hi padhne-likhne ki ikai hon, aur records ke shapes alag-alag hon.

**Interviewer jo jawab chahta hai** wo dono nahi hai. Wo hai: *"Access patterns kya hain?"* Phir trade-off batao. Aur ye bhi ki Postgres mein **JSONB** hai — isliye sirf "flexible fields chahiye" SQL chhodne ki wajah nahi hoti. Kai asli systems dono use karte hain: paise ke liye Postgres, catalog ke liye Mongo.`,
      commonMistakes: [
        'Choosing Mongo to avoid writing migrations, then hand-rolling migrations anyway when the shape changes.',
        'Choosing Mongo for "scale" at a size Postgres handles comfortably.',
        'Modelling Mongo exactly like SQL — one collection per table, $lookup everywhere.',
        'Claiming Mongo has no transactions. It has had them since 4.0.',
      ],
      interviewQuestions: [
        'How would you choose between MongoDB and PostgreSQL?',
        'Can MongoDB do ACID transactions?',
        'When is a document database the wrong choice?',
        'What does Postgres JSONB change about this decision?',
      ],
      practiceQuestions: ['Model the same e-commerce app both ways and list what each makes easy and hard.'],
      tags: ['mongodb', 'comparison', 'architecture', 'interview-favourite'],
    },
  ],
};
