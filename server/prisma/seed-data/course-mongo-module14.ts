/**
 * Databases Complete Course — Module 14: MongoDB Data Modeling, lessons 1-3.
 *
 * Lesson 1: Embed vs reference — the core decision, and what drives it.
 * Lesson 2: Cardinality & the 16MB limit — one-to-few, one-to-many, one-to-squillions,
 *           the hard document-size cap, and unbounded arrays as the #1 anti-pattern.
 * Lesson 3: Referencing & $lookup — which side holds the reference, joining with
 *           $lookup, and the extended-reference pattern.
 *
 * Verified against a real in-memory MongoDB (mongodb-memory-server).
 * Run: node verify-mongo.mjs 14
 */

import type { CourseLesson } from './course-js-module1';

export const MONGO_MODULE_14: CourseLesson[] = [
  {
    slug: 'mongo-embed-vs-reference',
    title: 'Embed vs Reference',
    titleHi: 'Embed vs Reference',
    description: 'The central modeling decision in MongoDB: does related data live INSIDE the document that owns it (embedded), or in a separate collection linked by an id (referenced)? Embed what is read together, bounded, and owned; reference what is large, shared, unbounded, or queried on its own.',
    descriptionHi: 'MongoDB mein central modeling decision: kya related data us document ke ANDAR rehта hai jo ise own karता hai (embedded), ya ek alag collection mein ek id se linked (referenced)? Jo saath padhа jaता hai, bounded, aur owned hai use embed karो; jo large, shared, unbounded, ya apne aap query hota hai use reference karो.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A passport that carries your photo and signature inside it — versus a passport that just prints your bank\'s name, not your entire account history.** Your photo belongs *to* your passport: it is small, it is read every single time the passport is used, and it does not exist independently of you — so it is printed right there, embedded. Your bank, though, is referenced by name only: your account history is huge, it changes constantly for reasons unrelated to your passport, other documents reference the same bank, and nobody inspecting your passport needs your transactions — so the passport carries a pointer ("First National Bank"), and anyone who genuinely needs the account details looks them up separately. MongoDB modeling is exactly this judgment, made field by field: embed the data that is small, always read alongside its owner, and owned by it; reference the data that is large, shared, independently changing, or queried on its own.',
      hi: '**Ek passport jo aapka photo aur signature apne andar carry karता hai — versus ek passport jo bas aapke bank ka naam print karता hai, aapki poori account history nahi.** Aapka photo aapke passport *ka* hai: ye chhota hai, har baar padhа jaता hai jab passport istemal hota hai, aur aapke bina independently exist nahi karता — to ye wahin print hota hai, embedded. Aapka bank, halाnki, sirf naam se referenced hai: aapki account history huge hai, ye lगातार badalती hai passport se unrelated कारणों se, doosre documents usी bank ko reference karते hain — to passport ek pointer carry karता hai. MongoDB modeling theek yahi judgment hai, field-by-field: chhota, hamesha apne owner ke saath padhа gaya, aur iske dwara owned data embed karो; large, shared, independently changing, ya apne aap query hone waala data reference karो.',
    },

    simple: `**EMBED: related data lives INSIDE the document -- one read gets everything, no join**

\`\`\`js
// a user document with address and preferences embedded:
{
  _id: 1,
  name: "Ravi",
  address: { city: "Pune", zip: "411001" },       // read with every profile view
  prefs: { theme: "dark", emailNotifs: true }      // small, owned, never queried alone
}
await db.users.findOne({ _id: 1 });   // the WHOLE profile, one lookup
\`\`\`

**REFERENCE: related data lives in ANOTHER collection, linked by id**

\`\`\`js
// orders reference the customer -- they're shared context, unbounded, queried on their own
{ _id: 100, custId: 1, items: [...], total: 4999 }
{ _id: 101, custId: 1, items: [...], total: 1299 }
await db.orders.find({ custId: 1 }).toArray();   // all of a customer's orders
\`\`\`

**THE DECISION -- embed when ALL of these hold; reference when ANY breaks:**
\`\`\`
EMBED if:                              REFERENCE if:
- read together with the parent        - queried independently / by other docs
- bounded (a few, not unbounded)        - unbounded or large (approaches 16MB)
- owned by the parent (no shared use)   - shared across many parent documents
- changes with the parent               - changes on its own schedule
\`\`\`

**MOST real documents do BOTH:** a blog post EMBEDS the author's display name (extended
reference -- Lesson 3) and a comment count, but REFERENCES the full comment list.`,

    simpleHi: `**EMBED: related data document ke ANDAR rehта hai -- ek read sab kुछ paता hai, koi join nahi**

\`\`\`js
{
  _id: 1,
  name: "Ravi",
  address: { city: "Pune", zip: "411001" },       // har profile view ke saath padhа jaता hai
  prefs: { theme: "dark", emailNotifs: true }      // chhota, owned, kabhi akela query nahi
}
await db.users.findOne({ _id: 1 });   // POORA profile, ek lookup
\`\`\`

**REFERENCE: related data DOOSRI collection mein rehта hai, id se linked**

\`\`\`js
{ _id: 100, custId: 1, items: [...], total: 4999 }
{ _id: 101, custId: 1, items: [...], total: 1299 }
await db.orders.find({ custId: 1 }).toArray();   // ek customer ke saare orders
\`\`\`

**DECISION -- embed jab ye SAB hold karें; reference jab KOI break ho:**
\`\`\`
EMBED agar:                            REFERENCE agar:
- parent ke saath padhа jaता hai       - independently / doosre docs dwara query hota hai
- bounded (kुछ, unbounded nahi)         - unbounded ya large (16MB tak pahunchta hai)
- parent ke dwara owned                 - kई parent documents ke across shared
- parent ke saath badalता hai           - apne schedule par badalता hai
\`\`\`

**ZYADATAR real documents DONO karते hain:** ek blog post author ka display name EMBED karता hai
(extended reference -- Lesson 3) aur ek comment count, par poore comment list ko REFERENCE karता hai.`,

    content: `## The one decision that matters most

Relational modeling (Modules 1-12) starts from normalization: split data so each fact lives in exactly one place, then join at query time. MongoDB modeling starts from the opposite instinct — **keep data that is used together in the same document** — and only splits it out when a specific reason forces the split. Every modeling choice in this module is a variation on one question: for a given piece of related data, **embed it or reference it?**

## Embedding

Embedded data lives as a nested field inside the document that owns it:

\`\`\`js
{
  _id: 1,
  name: "Ravi",
  address: { city: "Pune", zip: "411001" },
  prefs: { theme: "dark", emailNotifs: true }
}
\`\`\`

Reading the whole user — profile page, name, address, settings — is a single \`findOne\`, with no join and no second query. The data is physically together on disk, so it loads together. This is MongoDB's core performance advantage, and it is why embedding is the **default** you reach for first.

## Referencing

Referenced data lives in its own collection, and the linking document stores just an identifier:

\`\`\`js
// in the orders collection:
{ _id: 100, custId: 1, items: [/* ... */], total: 4999 }
{ _id: 101, custId: 1, items: [/* ... */], total: 1299 }
\`\`\`

Each order stores \`custId: 1\` rather than a copy of the whole customer. To get a customer's orders you query the \`orders\` collection directly (\`find({ custId: 1 })\`); to combine an order with its customer you use \`$lookup\` (Lesson 3), MongoDB's join operation.

## The decision criteria

Embed a piece of related data when **all** of these hold:

1. **Read together** — it is almost always loaded alongside its parent, not on its own.
2. **Bounded** — there is a small, known, non-growing number of them (a person has a handful of addresses, not an unbounded stream).
3. **Owned** — it belongs to exactly one parent and is not referenced by other documents.
4. **Changes with the parent** — it is updated as part of updating the parent, not on an independent schedule.

Reference it when **any** of these breaks:

1. It is **queried independently** — you frequently ask for these things directly, or filter across all of them regardless of parent.
2. It is **unbounded or large** — the count grows without limit, or the total size could approach the 16MB document cap (Lesson 2).
3. It is **shared** — many parent documents point at the same instance, and duplicating it everywhere would be wasteful and hard to keep consistent.
4. It **changes on its own schedule** — frequent independent updates to embedded data mean rewriting the (larger) parent document every time.

## Most documents do both

Real documents are rarely all-embedded or all-referenced. A blog post typically:

- **embeds** the author's display name and avatar URL (a tiny copy — the *extended reference* pattern, Lesson 3) so rendering the post needs no author lookup,
- **embeds** a \`commentCount\` (a *computed* value, Module 14 Lesson 4) so the post can show "42 comments" without counting,
- **references** the full list of comments (unbounded, queried with their own pagination) by keeping them in a \`comments\` collection with a \`postId\`.

Getting this split right — embed the small, hot, owned parts; reference the large, cold, shared parts — is the whole craft of MongoDB data modeling, and the rest of this module is patterns for doing it well.`,

    contentHi: `## Wo ek decision jo sabse zyada matter karता hai

Relational modeling normalization se shuru hota hai: data split karो taaki har fact theek ek jagah rahe, phir query time par join karो. MongoDB modeling opposite instinct se shuru hota hai — **jo data saath istemal hota hai use usी document mein rakhो** — aur ise sirf tab split karता hai jab ek specific कारण split ko force karे. Is module ka har modeling choice ek sawaal par variation hai: ek diye gaye related data ke liye, **ise embed karें ya reference karें?**

## Embedding

Embedded data us document ke andar ek nested field ke roop mein rehта hai jo ise own karता hai:

\`\`\`js
{
  _id: 1,
  name: "Ravi",
  address: { city: "Pune", zip: "411001" },
  prefs: { theme: "dark", emailNotifs: true }
}
\`\`\`

Poore user ko padhна ek single \`findOne\` hai, koi join nahi. Ye MongoDB ka core performance advantage hai, aur isiliye embedding **default** hai.

## Referencing

Referenced data apni collection mein rehта hai, aur linking document sirf ek identifier store karता hai:

\`\`\`js
{ _id: 100, custId: 1, items: [/* ... */], total: 4999 }
\`\`\`

Ek customer ke orders paane ke liye aap \`orders\` collection ko seedhे query karते ho; ek order ko iske customer ke saath combine karne ke liye aap \`$lookup\` istemal karते ho (Lesson 3).

## Decision criteria

Related data embed karो jab ye **sab** hold karें:

1. **Saath padhа jaता hai**
2. **Bounded** — chhoti, known, non-growing sankhya
3. **Owned** — theek ek parent ka
4. **Parent ke saath badalता hai**

Reference karो jab ye **koi** break ho:

1. **Independently query hota hai**
2. **Unbounded ya large** (16MB cap)
3. **Shared** — kई parent documents usी instance ko point karते hain
4. **Apne schedule par badalता hai**

## Zyadातार documents dono karते hain

Ek blog post typically:
- author ka display name **embed** karता hai (*extended reference* pattern, Lesson 3),
- ek \`commentCount\` **embed** karता hai (*computed* value, Lesson 4),
- poore comment list ko **reference** karता hai.`,

    examples: [
      {
        title: 'Embedding: the whole user profile in one findOne, no join',
        titleHi: 'Embedding: poora user profile ek findOne mein, koi join nahi',
        code: `await db.users.insertOne({
  _id: 1,
  name: "Ravi",
  address: { city: "Pune", zip: "411001" },
  prefs: { theme: "dark", emailNotifs: true },
});
print(await db.users.findOne({ _id: 1 }, { projection: { _id: 0 } }));`,
        output: `{"name":"Ravi","address":{"city":"Pune","zip":"411001"},"prefs":{"theme":"dark","emailNotifs":true}}`,
        explain: "`address` and `prefs` are embedded as nested fields inside the user document, so one `findOne` returns the entire profile — name, address, and settings — with no join and no second query. The data is physically together on disk, which is the document model's core performance advantage.",
        explainHi: '`address` aur `prefs` user document ke andar nested fields ke roop mein embedded hain, to ek `findOne` poora profile lautaता hai — name, address, aur settings — koi join aur koi doosri query ke bina. Data disk par physically saath hai, jo document model ka core performance advantage hai.',
      },
      {
        title: 'Referencing: orders link to a customer by id, queried on their own',
        titleHi: 'Referencing: orders ek customer ko id se link karte hain, apne aap query hote hain',
        code: `await db.customers.insertOne({ _id: 1, name: "Ravi" });
await db.orders.insertMany([
  { _id: 100, custId: 1, total: 4999 },
  { _id: 101, custId: 1, total: 1299 },
  { _id: 102, custId: 2, total: 500 },
]);
print(await db.orders.find({ custId: 1 }).project({ _id: 1, total: 1 }).toArray());`,
        output: `[{"_id":100,"total":4999},{"_id":101,"total":1299}]`,
        explain: "Each order stores `custId` rather than a copy of the customer. Orders are unbounded per customer and queried on their own (by date, status, across all customers for reporting), so they reference the customer by id — and `find({ custId: 1 })` on the `orders` collection returns exactly customer 1's two orders, ignoring customer 2's.",
        explainHi: 'Har order customer ki ek copy ke bजाy `custId` store karta hai. Orders prati-customer unbounded hain aur apne aap query hote hain, to wo customer ko id se reference karte hain — aur `orders` collection par `find({ custId: 1 })` theek customer 1 ke do orders lautaता hai.',
      },
      {
        title: 'A real document does both: embed the hot/owned parts, reference the unbounded list',
        titleHi: 'Ek real document dono karta hai: hot/owned parts embed, unbounded list reference',
        code: `await db.posts.insertOne({
  _id: 1,
  title: "Modeling in MongoDB",
  author: { _id: 7, name: "Ravi" },   // extended reference: a tiny copy, no lookup to render
  commentCount: 2,                     // computed: show "2 comments" without counting
});
await db.comments.insertMany([         // referenced: unbounded, paginated separately
  { _id: 50, postId: 1, text: "Great post" },
  { _id: 51, postId: 1, text: "Thanks!" },
]);
print(await db.posts.findOne({ _id: 1 }, { projection: { _id: 0 } }));
print(await db.comments.countDocuments({ postId: 1 }));`,
        output: `{"title":"Modeling in MongoDB","author":{"_id":7,"name":"Ravi"},"commentCount":2}
2`,
        explain: 'The post EMBEDS a tiny copy of the author (`author: { _id, name }` — extended reference, so rendering needs no author lookup) and a `commentCount` (computed, so it shows "2 comments" without counting), but REFERENCES the comments in a separate collection (unbounded, paginated separately). `findOne` on the post returns the embedded parts; `countDocuments` gets the real comment count.',
        explainHi: 'Post author ki ek chhoti copy EMBED karta hai (`author: { _id, name }` — extended reference) aur ek `commentCount` (computed), par comments ko ek alag collection mein REFERENCE karta hai (unbounded). Post par `findOne` embedded parts lautaता hai; `countDocuments` real comment count deता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// embedding an unbounded, independently-growing list inside its parent
{
  _id: 1,
  name: "Ravi",
  activityLog: [ /* one entry per action, forever -- grows without limit */ ]
}
// every new action rewrites the entire (ever-larger) user document, and the
// document eventually approaches or hits the 16MB cap`,
        right: `// keep the unbounded list in its own collection, referenced by the parent's id:
{ _id: 1, name: "Ravi" }
// in the "activity" collection:
{ _id: 900, userId: 1, action: "login", at: /* ... */ }
// each new action is one small insert; the user document never grows`,
        why: 'Embedding is the right default only for related data that is bounded, meaning there is a small and non-growing number of items. An activity log, an audit trail, a message history, or any collection of records that accumulates one entry per event over the lifetime of the parent is inherently unbounded, and embedding it means the parent document grows every time an event occurs. This has two compounding costs: every append rewrites the entire document, which gets slower as the document gets larger, and the document eventually approaches the hard 16MB size limit, at which point further appends fail outright. The correct model for an unbounded child collection is to give it its own collection where each entry is an independent small document referencing the parent by id, so that adding an entry is a constant-cost insert and the parent document stays small regardless of how much history accumulates.',
        whyHi: 'Embedding sirf bounded related data ke liye sahi default hai, matlab items ki ek chhoti aur non-growing sankhya. Ek activity log, ek audit trail, ya koi bhi records collection jo parent ke lifetime par prati-event ek entry accumulate karता hai inherently unbounded hai, aur ise embed karna matlab parent document har baar badhता hai. Iski do compounding costs hain: har append poore document ko rewrite karता hai, aur document aakhirkar hard 16MB size limit tak pahunchता hai. Sahi model ek unbounded child collection ko apni collection deना hai.',
      },
      {
        wrong: `// referencing data that is small, owned, and always read with its parent
{ _id: 1, name: "Ravi", addressId: 88 }   // address in a separate collection
// now EVERY profile read is two queries (or a $lookup) to get the address --
// for data that is one small object, belongs only to this user, and is
// never queried on its own`,
        right: `{ _id: 1, name: "Ravi", address: { city: "Pune", zip: "411001" } }
// one small owned object, read with every profile view -- embed it, and every
// profile read is a single findOne`,
        why: 'Referencing introduces a second lookup, or a $lookup stage, every time the referenced data is needed, which is worth paying only when referencing buys something in return, such as avoiding an unbounded array, sharing one instance across many parents, or supporting independent queries. When the related data is a single small object that belongs to exactly one parent, is loaded on essentially every read of that parent, and is never queried in isolation, referencing it provides none of those benefits while imposing the per-read cost of the extra lookup on the most common access path. Embedding that object instead keeps the whole entity in one document, so the common read is a single operation, which is precisely the performance characteristic MongoDB\'s document model exists to provide.',
        whyHi: 'Referencing ek doosरा lookup, ya ek `$lookup` stage, introduce karता hai har baar jab referenced data chahiye, jo sirf tab pay karne layak hai jab referencing kuch badले mein deता hai. Jab related data ek single small object hai jo theek ek parent ka hai, essentially us parent ke har read par load hota hai, aur kabhi isolation mein query nahi hota, ise reference karna un benefits mein se koi nahi deता. Us object ko embed karna poori entity ko ek document mein rakhता hai.',
      },
      {
        wrong: `// modeling in MongoDB as if it were relational -- one collection per "table",
// everything referenced, joined back with $lookup on every query
db.users, db.addresses, db.preferences, db.user_settings, db.user_metadata
// a profile read now $lookups four collections -- you've rebuilt the relational
// model's join cost without its constraints or its optimizer`,
        right: `// embed the parts that are read together and owned:
{ _id: 1, name: "Ravi",
  address: { /* ... */ }, preferences: { /* ... */ }, settings: { /* ... */ } }
// one findOne returns the whole profile`,
        why: 'Carrying a relational modeling instinct into MongoDB, splitting every distinct group of fields into its own collection and joining them back at query time, discards the main advantage of the document model without gaining anything. In a relational database that normalization is backed by foreign keys, a mature query optimizer, and decades of join-execution tuning; in MongoDB the equivalent split just means every read of a logical entity fans out into multiple collection lookups or $lookup stages, which is slower and more complex than a single document read, and MongoDB provides neither foreign-key enforcement nor a join optimizer as sophisticated as a relational engine\'s to compensate. The document model is designed to be used by keeping the data for one logical entity together in one document whenever that data is bounded and read together, and reserving separate collections for the genuinely independent, shared, or unbounded pieces.',
        whyHi: 'Ek relational modeling instinct ko MongoDB mein le jaना, har distinct group of fields ko apni collection mein split karना aur unhe query time par join karना, document model ke main advantage ko discard karता hai bina kuch gain kiye. MongoDB mein equivalent split ka matlab hai ki ek logical entity ka har read multiple collection lookups mein fan out hota hai. Document model ek logical entity ke liye data ko ek document mein saath rakhकар istemal karne ke liye design kiya gaya hai jab bhi wo data bounded aur saath padhа jaता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A `users` collection where address, notification preferences, and UI settings are all embedded** — the profile screen, which needs all of them, is served by one `findOne` with no joins.',
        hi: '**Ek `users` collection jahaan address, notification preferences, aur UI settings sab embedded hain** — profile screen ek `findOne` se serve hota hai.',
      },
      {
        en: '**An `orders` collection referencing `customers` by `custId`** — orders are queried on their own (by date, by status, across all customers for reporting), unbounded per customer, and never need to be inside the customer document.',
        hi: '**Ek `orders` collection jo `customers` ko `custId` se reference karti hai** — orders apne aap query hote hain, prati-customer unbounded.',
      },
      {
        en: '**A `posts` schema that embeds `author: { _id, name, avatarUrl }` and `commentCount`, but references comments** — the post renders with zero extra queries, and the comment list loads only when the user scrolls to it.',
        hi: '**Ek `posts` schema jo `author: { _id, name, avatarUrl }` aur `commentCount` embed karta hai, par comments reference karta hai**.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the core embed-versus-reference decision in MongoDB, and what criteria drive it?',
        qHi: 'MongoDB mein core embed-versus-reference decision kya hai, aur kaunse criteria ise drive karते hain?',
        a: 'The decision is whether a piece of data related to a document should live inside that document as a nested field, which is embedding, or in a separate collection linked by an identifier, which is referencing. Embedding is the default to reach for, because it keeps the data for a logical entity physically together so that reading the whole entity is a single operation with no join, which is the document model\'s central performance advantage. You embed a piece of related data when all of several conditions hold: it is almost always read together with its parent rather than on its own, there is a bounded and non-growing number of instances of it, it is owned by exactly one parent and not shared with other documents, and it changes as part of updating the parent rather than on an independent schedule. You switch to referencing as soon as any of those breaks: if the data is frequently queried independently or across all parents, if its count is unbounded or its size could approach the 16MB document limit, if the same instance is shared by many parent documents, or if it changes frequently on its own schedule such that embedding would force rewriting the larger parent document repeatedly. Most real documents do both, embedding the small hot owned parts and referencing the large cold shared or unbounded parts.',
        aHi: 'Decision ye hai ki ek document se related ek data piece us document ke andar ek nested field ke roop mein rahe (embedding), ya ek alag collection mein ek identifier se linked (referencing). Embedding wo default hai jise reach karna hai, kyunki ye ek logical entity ka data physically saath rakhता hai taaki poori entity ko padhна ek single operation ho koi join ke bina. Aap ek data piece embed karते ho jab ye sab hold karें: ye lगभग hamesha apne parent ke saath padhа jaता hai, iski ek bounded aur non-growing sankhya hai, ye theek ek parent ke dwara owned hai, aur ye parent ke saath badalता hai. Aap referencing par switch karते ho jaise hi in mein se koi break ho.',
      },
      {
        q: 'Why is embedding an unbounded array inside its parent document a problem, and what should you do instead?',
        qHi: 'Ek unbounded array ko iske parent document ke andar embed karna ek problem kyun hai, aur aapको iske bजाy kya karna chahiye?',
        a: 'Embedding is only appropriate for related data with a bounded, non-growing count. An array that accumulates one entry per event over the parent\'s lifetime, such as an activity log, an audit trail, or a message history, is inherently unbounded, and embedding it means the parent document grows every time an event occurs. This has two compounding costs. First, appending to an embedded array rewrites the entire document, and that rewrite gets progressively slower as the document grows, so the operation that should be cheap becomes expensive precisely on the busiest parents. Second, MongoDB enforces a hard 16MB limit on document size, so an unbounded embedded array will eventually cause the document to hit that ceiling, after which further appends fail with an error and the parent can no longer be updated normally. The correct model is to give the unbounded child data its own collection, where each entry is a small independent document that references the parent by id, so adding an entry is a constant-cost insert regardless of how much history exists, and the parent document stays small.',
        aHi: 'Embedding sirf bounded, non-growing count waale related data ke liye appropriate hai. Ek array jo parent ke lifetime par prati-event ek entry accumulate karता hai inherently unbounded hai, aur ise embed karna matlab parent document har baar badhता hai. Iski do compounding costs hain: pehla, ek embedded array mein append karna poore document ko rewrite karता hai; doosra, MongoDB document size par ek hard 16MB limit enforce karता hai. Sahi model unbounded child data ko apni collection deना hai.',
      },
    ],

    exercises: [
      {
        task: 'Insert one `users` document embedding an `address` sub-object and a `prefs` sub-object. Read it with a single `findOne` and confirm the entire nested structure comes back in one operation.',
        taskHi: 'Ek `users` document insert karo jo ek `address` sub-object aur ek `prefs` sub-object embed karta hai. Ise ek single `findOne` se padho aur confirm karo poora nested structure ek operation mein wapas aata hai.',
        hint: 'Embedded data is physically together on disk — one `findOne` returns the whole profile with no join or second query. This is the default you reach for first.',
        hintHi: 'Embedded data disk par physically saath hai — ek `findOne` poora profile lautaता hai koi join ke bina.',
      },
      {
        task: 'Insert one `customers` document and three `orders`, each with a `custId` field (two for customer 1, one for customer 2). Write `find({ custId: 1 })` and confirm exactly the two orders for customer 1 come back — the orders are queried on their own, not through the customer.',
        taskHi: 'Ek `customers` document aur teen `orders` insert karo, har ek ek `custId` field ke saath (do customer 1 ke liye, ek customer 2 ke liye). `find({ custId: 1 })` likho aur confirm karo theek do orders wapas aate hain.',
        hint: 'Orders are unbounded per customer and queried independently (by date, status, across customers), so they reference the customer by id rather than being embedded in it.',
        hintHi: 'Orders prati-customer unbounded aur independently query hote hain, to wo customer ko id se reference karte hain.',
      },
      {
        task: 'Model a blog post that embeds `author: { _id, name }` and `commentCount`, and references its comments in a separate `comments` collection with a `postId`. Insert one post and two comments. Confirm `findOne` on the post returns the embedded parts, and `countDocuments({ postId })` returns 2.',
        taskHi: 'Ek blog post model karo jo `author: { _id, name }` aur `commentCount` embed karta hai, aur apne comments ko ek `postId` ke saath ek alag `comments` collection mein reference karta hai. Ek post aur do comments insert karo.',
        hint: 'Real documents do both: embed the small, hot, owned parts (author display name, comment count) and reference the large, unbounded, separately-paginated part (the comment list).',
        hintHi: 'Real documents dono karte hain: chhote, hot, owned parts embed karo aur large, unbounded part reference karo.',
      },
    ],

    keyTakeaways: [
      'The CENTRAL MongoDB modeling decision: for each piece of related data, EMBED it (nested inside the owner document) or REFERENCE it (separate collection, linked by id)? Relational starts from "split everything, join at query time"; MongoDB starts from the OPPOSITE — "keep data used together in one document" — and splits only when forced.',
      'EMBEDDING is the DEFAULT: the data is physically together on disk, so one `findOne` reads the whole entity with NO join. This is the document model\'s core performance advantage.',
      'EMBED when ALL hold: (1) read together with the parent, (2) BOUNDED (a small, non-growing count), (3) OWNED by exactly one parent (not shared), (4) changes WITH the parent.',
      'REFERENCE when ANY breaks: (1) queried INDEPENDENTLY / by other docs, (2) UNBOUNDED or large (could approach the 16MB cap), (3) SHARED across many parents, (4) changes on its OWN schedule (embedding forces rewriting the larger parent each time).',
      'MOST real documents do BOTH: a blog post EMBEDS the author\'s display name (extended reference — Lesson 3) + a `commentCount` (computed — Lesson 4), but REFERENCES the unbounded comment list. The craft is splitting correctly: embed the small/hot/owned, reference the large/cold/shared.',
      'Do NOT model MongoDB like a relational DB (one collection per "table", everything referenced, `$lookup` on every read) — that rebuilds the join cost WITHOUT foreign keys or a mature join optimizer to compensate.',
    ],
    keyTakeawaysHi: [
      'CENTRAL MongoDB modeling decision: har related data piece ke liye, ise EMBED karो (owner document ke andar nested) ya REFERENCE karो (alag collection, id se linked)? Relational "sab split karो, query time par join karो" se shuru hota hai; MongoDB OPPOSITE se — "jo data saath istemal hota hai use ek document mein rakhो".',
      'EMBEDDING DEFAULT hai: data disk par physically saath hai, to ek `findOne` poori entity ko BINA join ke padhता hai. Ye document model ka core performance advantage hai.',
      'EMBED jab SAB hold karें: (1) parent ke saath padhа jaता hai, (2) BOUNDED, (3) theek ek parent ke dwara OWNED, (4) parent ke SAATH badalता hai.',
      'REFERENCE jab KOI break ho: (1) INDEPENDENTLY query hota hai, (2) UNBOUNDED ya large (16MB cap), (3) kई parents ke across SHARED, (4) apne schedule par badalता hai.',
      'ZYADATAR real documents DONO karते hain: ek blog post author ka display name EMBED karता hai + ek `commentCount`, par unbounded comment list ko REFERENCE karता hai.',
      'MongoDB ko ek relational DB ki tarah model MAT karो — wo join cost ko foreign keys ya ek mature join optimizer ke bina rebuild karता hai.',
    ],
  },

  {
    slug: 'mongo-cardinality-and-the-16mb-limit',
    title: 'Cardinality & the 16MB Limit',
    titleHi: 'Cardinality Aur 16MB Limit',
    description: 'One-to-few, one-to-many, one-to-squillions — how many children a parent has determines whether you embed them, embed references to them, or keep them entirely separate. And the 16MB document cap is the hard wall that makes "just embed everything" fail.',
    descriptionHi: 'One-to-few, one-to-many, one-to-squillions — ek parent ke кितne children hain ye determine karता hai ki aap unhe embed karें, un ke references embed karें, ya poori tarah alag rakhें. Aur 16MB document cap wo hard wall hai jo "bas sab kुछ embed karो" ko fail karता hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**A recipe card, a cookbook, and a library\'s entire catalog — the same "collection of things" at three scales that demand three different bindings.** A recipe\'s handful of ingredients fit right on the card — embed them. A cookbook\'s few hundred recipes are too many to carry on one card but few enough to bind into one book with a table of contents — embed a list of references. A library\'s entire catalog of every book ever is not something you bind at all; you keep the books on shelves and consult a separate index to find them — a fully separate collection. The number of children is what decides the binding, and there is a hard physical limit — a book can only be so thick before it will not close (that is the 16MB document cap) — so "just put everything in one book" stops working well before you notice, and stops working *at all* at the limit.',
      hi: '**Ek recipe card, ek cookbook, aur ek library ka poora catalog — teen scales par wahi "cheezon ka collection" jo teen alag bindings maangता hai.** Ek recipe ki mutthी bhar ingredients card par hi fit hoती hain — unhe embed karो. Ek cookbook ki кुछ sौ recipes ek card par carry karne ke liye bahut zyada hain par ek book mein bind karne ke liye kaafi kam — references ki ek list embed karो. Ek library ka har kabhi bani book ka poora catalog aisा kुछ nahi jo aap bind karते ho; aap books ko shelves par rakhते ho aur unhe dhoondне ke liye ek alag index consult karते ho — ek poori tarah alag collection. Children ki sankhya binding decide karती hai, aur ek hard physical limit hai — ek book itni hi moti ho sakti hai (wo 16MB document cap hai).',
    },

    simple: `**ONE-TO-FEW: embed the children directly (a person's 2-3 addresses)**

\`\`\`js
{ _id: 1, name: "Ravi", addresses: [
  { label: "home", city: "Pune" },
  { label: "work", city: "Mumbai" },
]}
\`\`\`

**ONE-TO-MANY: embed an ARRAY OF REFERENCES, or reference from the child side**

\`\`\`js
// a product with a few dozen part numbers -- embed the ids:
{ _id: 1, name: "Bike", partIds: [10, 11, 12, /* ...50 more... */] }
// or, more commonly, the child points back: parts each store { productId: 1 }
\`\`\`

**ONE-TO-SQUILLIONS: never embed. The child collection references the parent, always.**

\`\`\`js
// a user's log entries: MILLIONS over a lifetime -- separate collection, always
{ _id: 900, userId: 1, action: "login", at: /* ... */ }
\`\`\`

**THE 16MB LIMIT is a HARD wall -- a document that grows past it can't be saved**

\`\`\`js
await db.docs.insertOne({ _id: 1, a: "x".repeat(15 * 1024 * 1024) });   // ~15MB: fine
await db.docs.updateOne({ _id: 1 }, { $set: { b: "x".repeat(2 * 1024 * 1024) } });  // now >16MB
\`\`\`
\`\`\`
[ERROR] Plan executor error during update :: caused by :: Resulting document after update is larger than 16777216
\`\`\`

**THE #1 MongoDB ANTI-PATTERN: an unbounded array embedded in a document. It works in
testing, degrades as it grows (every write rewrites the whole doc), then fails at 16MB.**`,

    simpleHi: `**ONE-TO-FEW: children ko seedhे embed karो (ek vyakti ke 2-3 addresses)**

\`\`\`js
{ _id: 1, name: "Ravi", addresses: [
  { label: "home", city: "Pune" },
  { label: "work", city: "Mumbai" },
]}
\`\`\`

**ONE-TO-MANY: ek ARRAY OF REFERENCES embed karो, ya child side se reference karो**

\`\`\`js
{ _id: 1, name: "Bike", partIds: [10, 11, 12, /* ...50 aur... */] }
// ya, zyada common, child wapas point karता hai: parts har ek { productId: 1 } store karте hain
\`\`\`

**ONE-TO-SQUILLIONS: kabhi embed nahi karो. Child collection parent ko reference karती hai, hamesha.**

\`\`\`js
{ _id: 900, userId: 1, action: "login", at: /* ... */ }
\`\`\`

**16MB LIMIT ek HARD wall hai -- ek document jo isse aage badhता hai save nahi ho sakta**

\`\`\`js
await db.docs.insertOne({ _id: 1, a: "x".repeat(15 * 1024 * 1024) });   // ~15MB: theek
await db.docs.updateOne({ _id: 1 }, { $set: { b: "x".repeat(2 * 1024 * 1024) } });  // ab >16MB
\`\`\`
\`\`\`
[ERROR] Plan executor error during update :: caused by :: Resulting document after update is larger than 16777216
\`\`\`

**#1 MongoDB ANTI-PATTERN: ek document mein embed ek unbounded array. Testing mein kaam karता hai,
badhne par degrade hota hai, phir 16MB par fail hota hai.**`,

    content: `## Cardinality decides the model

"How many children does a parent have?" splits into three cases, and each has a different right answer:

### One-to-few

A parent has a small, bounded number of children — a person's addresses, a product's few variant options, an order's line items (an order has *some* items, not millions). **Embed the children directly** as an array of sub-documents. Reading the parent gets everything; there is no realistic path to the 16MB limit.

\`\`\`js
{ _id: 1, name: "Ravi", addresses: [
  { label: "home", city: "Pune", zip: "411001" },
  { label: "work", city: "Mumbai", zip: "400001" },
]}
\`\`\`

### One-to-many

A parent has many children — tens to a few thousand — but a knowable, roughly bounded number: a product's parts, a playlist's tracks, a course's lessons. Two options:

- **Embed an array of references** (just the child \`_id\`s) in the parent, keeping the children in their own collection. The parent stays small; loading the children is a second query (\`find({ _id: { $in: parent.childIds } })\`).
- **Reference from the child side** — each child stores the parent's id (\`{ productId: 1 }\`) and you query \`find({ productId: 1 })\`. This is usually the better choice, because it has no upper bound problem at all and the child list is naturally queryable and paginatable.

### One-to-squillions

A parent has an effectively unlimited number of children — a user's log entries, a sensor's readings, a popular post's likes. **Never embed.** The children live in their own collection and reference the parent by id. Embedding here is not a judgment call; it is a bug waiting for enough data.

## The 16MB limit

Every MongoDB document has a hard maximum size of **16 megabytes** (16777216 bytes). This is not a soft guideline — a document that would exceed it cannot be inserted or updated to that state:

\`\`\`js
await db.docs.insertOne({ _id: 1, a: "x".repeat(15 * 1024 * 1024) });
await db.docs.updateOne({ _id: 1 }, { $set: { b: "x".repeat(2 * 1024 * 1024) } });
\`\`\`
\`\`\`
[ERROR] Plan executor error during update :: caused by :: Resulting document after update is larger than 16777216
\`\`\`

The insert of a roughly 15MB field succeeds; the update that would push the document over 16MB fails outright, and the document stays at its previous state.

## Why the limit shapes modeling

The 16MB cap is *why* "just embed everything" is not a viable universal strategy, and it is the hard backstop behind the cardinality rules above. But documents run into trouble well before 16MB: a multi-megabyte document is slow to transfer, slow to load into memory, and — critically — **every update rewrites the entire document**, so a 4MB document with a growing embedded array pays a 4MB rewrite on every single append.

## The unbounded-array anti-pattern

This is the single most common MongoDB modeling mistake: **an array embedded in a document that grows without a bound.** \`user.notifications\`, \`post.likes\`, \`device.events\` — anything that accumulates one entry per event, forever. It passes every test with a hundred entries, gets measurably slower at ten thousand, and eventually a heavily-used parent document hits 16MB and stops accepting writes entirely, usually in production, usually for your most active users. The fixes are the subject of the next lessons: a **separate collection** (the child-references-parent model above), the **bucket pattern** (Lesson 4 — group entries into bounded-size documents), or the **subset pattern** (Lesson 4 — embed only the most recent N, reference the rest).`,

    contentHi: `## Cardinality model decide karती hai

"Ek parent ke кितne children hain?" teen cases mein split hota hai:

### One-to-few

Ek parent ke paas ek chhoti, bounded sankhya mein children hain — ek vyakti ke addresses, ek order ke line items. **Children ko seedhे embed karो** sub-documents ke ek array ke roop mein.

\`\`\`js
{ _id: 1, name: "Ravi", addresses: [
  { label: "home", city: "Pune" },
  { label: "work", city: "Mumbai" },
]}
\`\`\`

### One-to-many

Ek parent ke paas bahut children hain — dasों se кुछ hazar — par ek knowable sankhya:

- **Parent mein references ka ek array embed karो** (bas child \`_id\`s).
- **Child side se reference karो** — har child parent ki id store karता hai (\`{ productId: 1 }\`). Ye usually behtar choice hai.

### One-to-squillions

Ek parent ke paas effectively unlimited children hain. **Kabhi embed nahi karो.** Children apni collection mein rehते hain aur parent ko id se reference karते hain.

## 16MB limit

Har MongoDB document ka ek hard maximum size **16 megabytes** hai (16777216 bytes):

\`\`\`js
await db.docs.insertOne({ _id: 1, a: "x".repeat(15 * 1024 * 1024) });
await db.docs.updateOne({ _id: 1 }, { $set: { b: "x".repeat(2 * 1024 * 1024) } });
\`\`\`
\`\`\`
[ERROR] Plan executor error during update :: caused by :: Resulting document after update is larger than 16777216
\`\`\`

## Limit modeling ko kyun shape karता hai

Documents 16MB se bahut pehle trouble mein aate hain: **har update poore document ko rewrite karता hai**, to ek 4MB document ek growing embedded array ke saath har single append par ek 4MB rewrite pay karता hai.

## Unbounded-array anti-pattern

Ye sabse common MongoDB modeling mistake hai: **ek document mein embed ek array jo bina bound ke badhता hai.** Ye sौ entries ke saath har test pass karता hai, das hazar par slower hota hai, aur aakhirkar ek heavily-used parent document 16MB tak pahunchता hai aur writes accept karna band kar deता hai. Fixes agle lessons ka subject hain: ek **alag collection**, **bucket pattern** (Lesson 4), ya **subset pattern** (Lesson 4).`,

    examples: [
      {
        title: 'One-to-few: a person with a bounded array of embedded addresses',
        titleHi: 'One-to-few: ek vyakti ek bounded array of embedded addresses ke saath',
        code: `await db.people.insertOne({
  _id: 1, name: "Ravi",
  addresses: [
    { label: "home", city: "Pune", zip: "411001" },
    { label: "work", city: "Mumbai", zip: "400001" },
  ],
});
print(await db.people.findOne({ _id: 1 }, { projection: { _id: 0, name: 1, "addresses.city": 1 } }));`,
        output: `{"name":"Ravi","addresses":[{"city":"Pune"},{"city":"Mumbai"}]}`,
        explain: 'A person has a small, bounded number of addresses (one-to-few), so they are embedded directly as an array of sub-documents. Reading the person gets all the addresses in one operation, and a projection of `"addresses.city"` reduces each embedded sub-document to just its `city` field.',
        explainHi: 'Ek vyakti ke paas ek chhoti, bounded sankhya mein addresses hote hain (one-to-few), to wo seedhे sub-documents ke ek array ke roop mein embedded hain. Vyakti ko padhna saare addresses ek operation mein deता hai, aur `"addresses.city"` ki ek projection har embedded sub-document ko sirf iske `city` field tak reduce karti hai.',
      },
      {
        title: 'The 16MB limit: a document that grows past it cannot be updated to that state',
        titleHi: '16MB limit: ek document jo isse aage badhta hai us state mein update nahi ho sakta',
        code: `await db.docs.insertOne({ _id: 1, a: "x".repeat(15 * 1024 * 1024) });
await db.docs.updateOne({ _id: 1 }, { $set: { b: "x".repeat(2 * 1024 * 1024) } });`,
        output: `[ERROR] Plan executor error during update :: caused by :: Resulting document after update is larger than 16777216`,
        explain: 'The insert of a ~15MB string field succeeds — it fits under the 16MB (16777216 byte) document limit. The `$set` that would add another ~2MB field pushes the resulting document over 16MB, so MongoDB rejects the update outright with `Resulting document after update is larger than 16777216`, and the document stays at its previous state.',
        explainHi: 'Ek ~15MB string field ka insert succeed hota hai — ye 16MB (16777216 byte) document limit ke neeche fit hota hai. Wo `$set` jo ek aur ~2MB field add karega resulting document ko 16MB se aage push karता hai, to MongoDB update ko `Resulting document after update is larger than 16777216` ke saath poori tarah reject karता hai.',
      },
      {
        title: 'One-to-squillions: the child collection references the parent, never the reverse',
        titleHi: 'One-to-squillions: child collection parent ko reference karti hai, kabhi ulta nahi',
        code: `await db.users.insertOne({ _id: 1, name: "Ravi" });
await db.activity.insertMany([
  { _id: 900, userId: 1, action: "login" },
  { _id: 901, userId: 1, action: "view" },
  { _id: 902, userId: 2, action: "login" },
]);
print(await db.users.findOne({ _id: 1 }, { projection: { _id: 0 } }));
print(await db.activity.countDocuments({ userId: 1 }));`,
        output: `{"name":"Ravi"}
2`,
        explain: "A user's activity is effectively unlimited over a lifetime (one-to-squillions), so it lives in its own `activity` collection where each entry references the user by `userId`. The user document has NO activity array — it stays small forever — and `countDocuments({ userId: 1 })` on `activity` returns the count.",
        explainHi: 'Ek user ki activity ek lifetime par effectively unlimited hai (one-to-squillions), to ye apni `activity` collection mein rehти hai jahaan har entry user ko `userId` se reference karti hai. User document mein KOI activity array NAHI — ye hamesha ke liye chhota rehта hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// embedding a "one-to-many that will become one-to-squillions" array, because
// it's small today
{ _id: 1, name: "Popular Post", likes: [ /* userId per like */ ] }
// fine at 50 likes in testing. At 500,000 likes the document is ~6MB, every
// new like rewrites all 6MB, and the post is one viral moment from hitting 16MB`,
        right: `// likes go in their own collection from the start:
{ _id: 1, name: "Popular Post", likeCount: 0 }   // a computed count (Lesson 4)
// in the "likes" collection:
{ _id: 5000, postId: 1, userId: 42, at: /* ... */ }
// a new like is one small insert + one $inc on likeCount -- constant cost forever`,
        why: 'The distinction between one-to-many and one-to-squillions is not about the count today but about whether the count has a real upper bound. A list of likes, follows, views, or comments on content that could go viral has no meaningful ceiling, so even though it starts small, treating it as an embeddable one-to-many array is modeling for the wrong case. Because every update rewrites the whole document, an embedded array that reaches several megabytes makes every single append expensive in proportion to the array\'s current size, and the hard 16MB limit means a sufficiently popular parent will eventually be unable to accept new entries at all. Modeling it as a separate collection from the start, with the child referencing the parent and a computed count on the parent for display, keeps every operation constant-cost no matter how large the relationship grows, which is the only model that survives a success scenario.',
        whyHi: 'One-to-many aur one-to-squillions ke beech distinction aaj ke count ke baare mein nahi hai balki is baare mein ki kya count ka ek real upper bound hai. Content par likes, follows, ya views ki ek list jo viral ho sakti hai ka koi meaningful ceiling nahi hai. Kyunki har update poore document ko rewrite karता hai, ek embedded array jo кई megabytes tak pahunchता hai har append ko expensive banata hai, aur hard 16MB limit ka matlab hai ek sufficiently popular parent aakhirkar naye entries accept nahi kar payega. Ise shuruaat se ek alag collection ke roop mein model karna har operation ko constant-cost rakhता hai.',
      },
      {
        wrong: `// assuming the 16MB limit is a soft target you'll "deal with later"
// -- a document steadily growing an embedded array in production
// then, with no code change, on a busy day:
// [ERROR] Resulting document after update is larger than 16777216
// -- the document is now un-updatable; writes to that user/post/device fail hard`,
        right: `// treat 16MB as a hard wall you must never approach, and monitor for it:
// - model unbounded relationships as separate collections (above)
// - if an embedded array is intentionally bounded, ENFORCE the bound:
await db.feeds.updateOne(
  { _id: 1 },
  { $push: { recent: { $each: [newItem], $slice: -50 } } }   // keep only the last 50
);`,
        why: 'The 16MB document size limit is enforced by the database, not advisory, so a document that would exceed it simply cannot be written to that state, and the failure surfaces as a hard error on an ordinary update with no warning as the document approached the ceiling. When this happens to a document with a growing embedded array, that document becomes stuck: any update that keeps or grows the array fails, so the entity it represents can no longer be modified through normal operations, and recovering requires a migration to move the oversized data elsewhere. The defense is twofold: model genuinely unbounded relationships as separate collections so no document accumulates them, and where an embedded array is meant to be bounded, actively enforce that bound on every write, for example with the $slice modifier on $push to cap the array at a fixed length, rather than trusting that it will stay small on its own.',
        whyHi: '16MB document size limit database dwara enforce ki jaती hai, advisory nahi, to ek document jo isse exceed karega us state mein simply likha nahi ja sakता, aur failure ek ordinary update par ek hard error ke roop mein surface hota hai bina kisī warning ke. Jab ye ek growing embedded array waale document ke saath hota hai, wo document stuck ho jaता hai. Defense do-guna hai: genuinely unbounded relationships ko alag collections ke roop mein model karो, aur jahaan ek embedded array bounded hona chahiye, har write par us bound ko actively enforce karो (`$slice`).',
      },
      {
        wrong: `// choosing "embed an array of child _ids in the parent" for a one-to-many
// relationship that would be simpler as a child-side reference
{ _id: 1, name: "Playlist", trackIds: [10, 11, 12, /* ...2000 more... */] }
// now: the array itself can grow large, reordering means rewriting the whole
// array, and "which playlists contain track 42" needs a scan of every playlist`,
        right: `// child-side reference: each track-in-playlist is its own small document
{ _id: 5001, playlistId: 1, trackId: 10, position: 0 }
{ _id: 5002, playlistId: 1, trackId: 11, position: 1 }
// no array to grow, position is a field, and "playlists containing track 42"
// is find({ trackId: 42 }) with an index -- both directions are queryable`,
        why: 'Embedding an array of child identifiers in the parent keeps the parent smaller than embedding the full child documents, but it still has an array that grows with the relationship, so it inherits the same rewrite-on-every-change cost and the same eventual size concern for a large enough relationship. It also makes the relationship one-directional: finding the children of a parent is easy, but finding which parents reference a particular child requires scanning every parent document\'s array. Modeling the relationship as a separate collection of small join documents, each referencing both the parent and the child, removes the growing array entirely, makes per-item attributes like ordering position a normal indexed field, and makes the relationship queryable from both directions with an ordinary indexed find. The array-of-ids approach is only preferable when the list is genuinely small, rarely changes, and is only ever traversed parent-to-child.',
        whyHi: 'Parent mein child identifiers ka ek array embed karna parent ko full child documents embed karne se chhota rakhता hai, par isमें abhi bhi ek array hai jo relationship ke saath badhता hai, to ye wahi rewrite-on-every-change cost inherit karता hai. Ye relationship ko one-directional bhi banata hai. Relationship ko small join documents ki ek alag collection ke roop mein model karna growing array ko poori tarah hataता hai aur relationship ko dono directions se queryable banata hai.',
      },
    ],

    realWorld: [
      {
        en: '**An `orders` schema that embeds line items directly** (an order has a bounded handful of items) but references the customer, the products, and the shipment — line items are one-to-few and owned; the rest are shared or unbounded.',
        hi: '**Ek `orders` schema jo line items ko seedhe embed karta hai** par customer, products, aur shipment ko reference karta hai — line items one-to-few aur owned hain.',
      },
      {
        en: '**A `likes` collection with a compound index on `{ postId, userId }`, plus a `likeCount` on the post** — the count is O(1) to read, "did this user like this post" is O(1) to check, and no post document ever grows.',
        hi: '**Ek `likes` collection `{ postId, userId }` par ek compound index ke saath, plus post par ek `likeCount`** — count O(1) read hai, koi post document kabhi nahi badhता.',
      },
      {
        en: '**A production incident: a `conversations` collection embedded every message, and one long-running support thread hit 16MB and could no longer receive replies** — fixed by a migration splitting messages into their own collection.',
        hi: '**Ek production incident: ek `conversations` collection har message embed karti thi, aur ek long-running support thread 16MB par pahunchа** — messages ko unki apni collection mein split karके fix kiya gaya.',
      },
    ],

    interviewQA: [
      {
        q: 'How does the cardinality of a relationship (one-to-few, one-to-many, one-to-squillions) determine how you model it in MongoDB?',
        qHi: 'Ek relationship ki cardinality (one-to-few, one-to-many, one-to-squillions) aap ise MongoDB mein kaise model karте ho ye kaise determine karती hai?',
        a: 'One-to-few means a parent has a small, bounded number of children, such as a person\'s addresses or an order\'s line items, and the right model is to embed the children directly as an array of sub-documents in the parent, since reading the parent then gets everything in one operation and there is no realistic path to the size limit. One-to-many means a parent has many children, from tens to a few thousand, but a knowably bounded number, such as a product\'s parts or a course\'s lessons, and here you either embed an array of just the child identifiers while keeping the children in their own collection, or, more commonly and more robustly, have each child store a reference to the parent so the child list is queried directly with an indexed find; the child-side reference is usually better because it has no array-growth problem and is naturally paginatable. One-to-squillions means a parent has an effectively unlimited number of children, such as a user\'s activity log or a post\'s likes, and embedding is never acceptable here regardless of the current count, because such an array would grow unbounded; the children must live in their own collection and reference the parent by id.',
        aHi: 'One-to-few ka matlab hai ek parent ke paas ek chhoti, bounded sankhya mein children hain, aur sahi model children ko seedhे embed karna hai. One-to-many ka matlab hai ek parent ke paas bahut children hain par ek knowably bounded sankhya, aur yahaan aap ya to bas child identifiers ka ek array embed karते ho, ya, zyada common taur par, har child parent ka ek reference store karता hai. One-to-squillions ka matlab hai ek parent ke paas effectively unlimited children hain, aur embedding yahaan kabhi acceptable nahi hai current count se regardless.',
      },
      {
        q: 'What is the 16MB document limit, and why does it shape data modeling well before a document reaches 16MB?',
        qHi: '16MB document limit kya hai, aur ye ek document ke 16MB tak pahunchне se bahut pehle data modeling ko kyun shape karता hai?',
        a: 'Every MongoDB document has a hard maximum size of 16 megabytes, enforced by the database, so a document that would exceed that size cannot be inserted or updated to that state; the operation fails with an error and the document remains as it was. This is the hard backstop that makes "just embed everything" unworkable as a universal strategy and is the ultimate reason unbounded embedded arrays are an anti-pattern. But documents cause problems well before the limit, for two reasons. First, a multi-megabyte document is expensive to transfer over the network and to hold in memory, so large documents slow down every operation that touches them. Second, and more importantly, MongoDB rewrites the entire document on every update, not just the changed portion, so a document with a growing embedded array pays a rewrite cost proportional to the document\'s full current size on every single append, which means the operation that should be cheap becomes progressively more expensive exactly as the array gets bigger. The practical consequence is that a well-designed model keeps documents small and never lets one accumulate an unbounded amount of data, treating 16MB not as a target to approach but as a wall to stay far away from.',
        aHi: 'Har MongoDB document ka ek hard maximum size 16 megabytes hai, database dwara enforced, to ek document jo us size se exceed karega us state mein insert ya update nahi ho sakता. Ye wo hard backstop hai jo "bas sab kुछ embed karो" ko unworkable banata hai. Par documents limit se bahut pehle problems cause karते hain: pehla, ek multi-megabyte document transfer aur memory mein rakhne mein expensive hai; doosra, MongoDB har update par POORE document ko rewrite karता hai, to ek growing embedded array waala document har append par ek rewrite cost pay karता hai jo document ke full current size ke proportional hai.',
      },
    ],

    exercises: [
      {
        task: 'Model a `people` collection where each person embeds a bounded `addresses` array of 2-3 sub-documents. Insert one person and read back just the cities with a projection of `"addresses.city"`.',
        taskHi: 'Ek `people` collection model karo jahaan har person ek bounded `addresses` array of 2-3 sub-documents embed karta hai. Ek person insert karo aur sirf cities wapas padho `"addresses.city"` projection se.',
        hint: 'One-to-few (a person has a handful of addresses, not millions) → embed directly. A projection of `"addresses.city"` returns each embedded sub-document reduced to just its `city`.',
        hintHi: 'One-to-few → seedhe embed karo. `"addresses.city"` projection har embedded sub-document ko sirf iske `city` tak reduce karta hai.',
      },
      {
        task: 'Insert a document with a ~15MB string field (`"x".repeat(15 * 1024 * 1024)`), confirming it succeeds. Then `$set` a second ~2MB string field on it and confirm the update fails with a "larger than 16777216" error.',
        taskHi: 'Ek ~15MB string field (`"x".repeat(15 * 1024 * 1024)`) waala document insert karo, confirm karo ye succeed hota hai. Phir ispar ek doosra ~2MB string field `$set` karo aur confirm karo update "larger than 16777216" error ke saath fail hota hai.',
        hint: 'The 16MB (16777216 bytes) limit is enforced by the database — the update that would push the document over the cap fails outright, and the document stays at its previous state.',
        hintHi: '16MB limit database dwara enforce ki jaती hai — wo update jo document ko cap se aage push karega poori tarah fail hota hai.',
      },
      {
        task: 'Model a one-to-squillions relationship: a `users` collection and an `activity` collection where each activity document stores a `userId`. Insert one user and three activity docs (two for user 1). Confirm the user document has no activity array, and `countDocuments({ userId: 1 })` on `activity` returns 2.',
        taskHi: 'Ek one-to-squillions relationship model karo: ek `users` collection aur ek `activity` collection jahaan har activity document ek `userId` store karta hai. Ek user aur teen activity docs insert karo.',
        hint: 'A user\'s activity is effectively unlimited over a lifetime — it must live in its own collection referencing the user, never embedded. The user document stays small forever.',
        hintHi: 'Ek user ki activity effectively unlimited hai — ise apni collection mein rehna chahiye jo user ko reference karti hai, kabhi embedded nahi.',
      },
    ],

    keyTakeaways: [
      'CARDINALITY drives the model. ONE-TO-FEW (a person\'s addresses, an order\'s line items): EMBED the children directly as an array of sub-documents. ONE-TO-MANY (tens to a few thousand, knowably bounded): embed an array of just the child `_id`s, OR (usually better) have each CHILD store the parent\'s id and query `find({ parentId })`. ONE-TO-SQUILLIONS (a user\'s log, a post\'s likes): NEVER embed — the child collection references the parent, always.',
      'The 16MB DOCUMENT LIMIT (16777216 bytes) is a HARD, database-enforced wall. An insert/update that would exceed it fails with `Resulting document after update is larger than 16777216`, and the document stays at its previous state — potentially STUCK (any array-growing update fails).',
      'Documents cause trouble well BEFORE 16MB: (1) a multi-MB doc is slow to transfer and hold in memory; (2) EVERY update rewrites the ENTIRE document (not just the change), so a 4MB doc with a growing array pays a 4MB rewrite on every single append.',
      'THE #1 MongoDB ANTI-PATTERN: an UNBOUNDED array embedded in a document (`user.notifications`, `post.likes`, `device.events`). Passes testing at 100 entries, measurably slower at 10,000, then a hot parent hits 16MB and stops accepting writes — in production, for your most active users.',
      'One-to-many vs one-to-squillions is about whether the count has a REAL UPPER BOUND, not the count today. A "small today" list on content that could go viral (likes, follows, comments) is one-to-squillions — model it as a separate collection from the start.',
      'If an embedded array is INTENTIONALLY bounded, ENFORCE the bound on every write: `$push: { recent: { $each: [item], $slice: -50 } }` keeps only the last 50. Don\'t trust it to stay small on its own.',
    ],
    keyTakeawaysHi: [
      'CARDINALITY model drive karती hai. ONE-TO-FEW: children ko seedhe sub-documents ke array ke roop mein EMBED karो. ONE-TO-MANY: bas child `_id`s ka ek array embed karो, YA (usually behtar) har CHILD parent ki id store karे aur `find({ parentId })` query karो. ONE-TO-SQUILLIONS: KABHI embed nahi — child collection parent ko reference karती hai, hamesha.',
      '16MB DOCUMENT LIMIT (16777216 bytes) ek HARD, database-enforced wall hai. Isse exceed karta insert/update `Resulting document after update is larger than 16777216` ke saath fail hota hai.',
      'Documents 16MB se bahut PEHLE trouble cause karते hain: (1) ek multi-MB doc transfer aur memory mein slow; (2) HAR update POORE document ko rewrite karता hai.',
      '#1 MongoDB ANTI-PATTERN: ek document mein embed ek UNBOUNDED array. 100 entries par testing pass karता hai, 10,000 par slower, phir ek hot parent 16MB par pahunचता hai aur writes accept karna band karता hai.',
      'One-to-many vs one-to-squillions is baare mein hai ki count ka ek REAL UPPER BOUND hai ya nahi, aaj ke count ke baare mein nahi. Content par ek "aaj chhoti" list jo viral ho sakti hai one-to-squillions hai.',
      'Agar ek embedded array INTENTIONALLY bounded hai, har write par bound ENFORCE karो: `$push: { recent: { $each: [item], $slice: -50 } }`.',
    ],
  },

  {
    slug: 'mongo-referencing-and-lookup',
    title: 'Referencing & $lookup',
    titleHi: 'Referencing Aur $lookup',
    description: 'When you reference instead of embed, three questions follow: which side stores the reference, how you recombine the data at read time (a second query or $lookup), and whether to duplicate a few fields to avoid the join entirely — the extended reference pattern.',
    descriptionHi: 'Jab aap embed ke bजाy reference karते ho, teen sawaal aate hain: kaunसा side reference store karता hai, aap read time par data kaise recombine karते ho (ek doosरी query ya `$lookup`), aur kya join se poori tarah bachने ke liye кुछ fields duplicate karें — extended reference pattern.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**Filing a project folder: do you write the client\'s ID on the folder, keep a list of folder IDs in the client\'s file, or both — and do you also scribble the client\'s name on the folder tab so you don\'t have to pull the client file every time?** Writing the client ID on each project folder (child points to parent) makes "all of this client\'s projects" easy. Keeping folder IDs in the client file (parent points to children) makes "this client\'s projects" a single lookup but the list grows. Doing both is redundant work to keep in sync. And scribbling the client\'s *name* on the folder tab — a tiny duplicated copy — means you can label and sort folders without ever opening the client file, at the cost of re-scribbling every folder if the client is renamed. That last move is the extended reference pattern, and it is how most real references avoid most joins.',
      hi: '**Ek project folder file karna: kya aap client ki ID folder par likhते ho, client ki file mein folder IDs ki ek list rakhते ho, ya dono — aur kya aap client ka naam bhi folder tab par likhते ho taaki har baar client file na nikालnी paड़े?** Har project folder par client ID likhना (child parent ko point karता hai) "is client ke saare projects" ko aasan banata hai. Client file mein folder IDs rakhना (parent children ko point karता hai) "is client ke projects" ko ek single lookup banata hai par list badhती hai. Dono karna sync mein rakhने ke liye redundant kaam hai. Aur folder tab par client ka *naam* likhना — ek chhoti duplicated copy — matlab aap client file kabhi khोle bina folders ko label aur sort kar sakte ho. Wo aakhri move extended reference pattern hai.',
    },

    simple: `**WHICH SIDE holds the reference?**
\`\`\`
child -> parent   (each order stores custId)     -- "all of X's children" = find({ parentId })
                                                    scales to unbounded children
parent -> child   (playlist stores [trackIds])   -- "this parent's children" = one lookup
                                                    but the array grows; use only if bounded
both              -- redundant; keep in sync; only for very read-heavy both-directions
\`\`\`

**RECOMBINING: a second query, or \`$lookup\` (aggregation's "join")**

\`\`\`js
// $lookup: for each customer, pull matching orders into an "orders" array field
await db.customers.aggregate([
  { $lookup: { from: "orders", localField: "_id", foreignField: "custId", as: "orders" } },
  { $project: { name: 1, orderTotal: { $sum: "$orders.amt" } } },
]).toArray();
\`\`\`

**EXTENDED REFERENCE: copy the FEW fields you need for display, skip the \`$lookup\` entirely**

\`\`\`js
// a post stores a tiny copy of the author, not just the id:
{ _id: 1, title: "...", author: { _id: 7, name: "Ravi", avatarUrl: "..." } }
// rendering the post needs NO author lookup. The cost: if the author is renamed,
// every post's embedded copy must be updated too (Lesson 6).
\`\`\`

**RULE OF THUMB: reference for the source of truth; extended-reference the handful of
fields that appear on every screen the parent shows up on.**`,

    simpleHi: `**KAUNSA SIDE reference rakhता hai?**
\`\`\`
child -> parent   (har order custId store karता hai)  -- "X ke saare children" = find({ parentId })
                                                          unbounded children tak scale
parent -> child   (playlist [trackIds] store karता hai) -- "is parent ke children" = ek lookup
                                                          par array badhता hai; sirf bounded ke liye
dono              -- redundant; sync mein rakhो
\`\`\`

**RECOMBINING: ek doosरी query, ya \`$lookup\` (aggregation ka "join")**

\`\`\`js
await db.customers.aggregate([
  { $lookup: { from: "orders", localField: "_id", foreignField: "custId", as: "orders" } },
  { $project: { name: 1, orderTotal: { $sum: "$orders.amt" } } },
]).toArray();
\`\`\`

**EXTENDED REFERENCE: display ke liye jo кुछ fields chahiye copy karो, \`$lookup\` poori tarah skip karो**

\`\`\`js
{ _id: 1, title: "...", author: { _id: 7, name: "Ravi", avatarUrl: "..." } }
// post render karne ko KOI author lookup nahi chahiye. Cost: agar author rename hota hai,
// har post ki embedded copy bhi update honi chahiye (Lesson 6).
\`\`\`

**RULE OF THUMB: source of truth ke liye reference karो; un кुछ fields ko extended-reference karो
jo har screen par dikhते hain jahaan parent aata hai.**`,

    content: `## Which side holds the reference

When two collections are related, the reference — the stored id linking them — can live on either side, or both:

- **Child references parent**: each child document stores the parent's \`_id\` (an \`order\` stores \`custId\`). Getting a parent's children is \`find({ custId: parentId })\`, which works no matter how many children there are, and each child is independently queryable and paginatable. This is the default for one-to-many and the *only* option for one-to-squillions.
- **Parent references children**: the parent stores an array of child \`_id\`s (a \`playlist\` stores \`[trackId, ...]\`). Getting the children is one lookup by \`{ _id: { $in: parent.trackIds } }\`, and the order is preserved by the array. But the array grows with the relationship, so this is only safe when the child count is genuinely bounded and small. It also makes the reverse query ("which playlists contain this track") a full scan.
- **Both**: redundant, and now two things must be kept in sync on every change. Only justified for a relationship traversed constantly in both directions where the extra read speed outweighs the write complexity.

## Recombining referenced data

Once data is referenced, a read that needs both sides has to recombine them. Two ways:

- **A second query**: fetch the parent, then \`find({ _id: { $in: parent.childIds } })\` or \`find({ parentId: parent._id })\`. Simple, and often fine.
- **\`$lookup\`**: MongoDB's join, as an aggregation stage (Module 15 covers aggregation fully). \`$lookup\` matches documents from another collection into an array field on each input document:

\`\`\`js
await db.customers.aggregate([
  { $lookup: { from: "orders", localField: "_id", foreignField: "custId", as: "orders" } },
  { $project: { _id: 0, name: 1, orderTotal: { $sum: "$orders.amt" } } },
]).toArray();
\`\`\`

For each customer, \`$lookup\` finds every order whose \`custId\` equals the customer's \`_id\`, puts them in an \`orders\` array, and then \`$project\` computes the total. \`$lookup\` is genuinely useful, but it is more expensive than a single-collection query — it runs a lookup per input document — so it is not a free substitute for good modeling. The relational-database advice applies: if you find yourself \`$lookup\`-ing the same two collections on nearly every query, that data probably wants to be embedded (or extended-referenced) instead.

## The extended reference pattern

The most common way to avoid a \`$lookup\` is to **duplicate the few fields you actually need** from the referenced document into the referencing one:

\`\`\`js
{
  _id: 1,
  title: "Modeling in MongoDB",
  author: { _id: 7, name: "Ravi", avatarUrl: "https://..." }
}
\`\`\`

The post still has \`author._id\` as the real reference to the source-of-truth \`authors\` document, but it *also* carries a small copy of the two or three author fields it needs to render a post card: name and avatar. Now displaying a post — or a list of a hundred posts — needs zero author lookups.

The cost is **duplication that must be kept in sync**: if the author changes their name, every post carrying the old copy is now stale until it is updated too (Lesson 6 is entirely about managing this). Extended reference is the right trade when the duplicated fields are few, change rarely, and appear on a screen that would otherwise need a lookup on every render. It is the wrong trade for fields that change constantly or where stale data is genuinely harmful.

## The rule of thumb

**Reference the source of truth. Extended-reference the handful of fields that show up on every screen where the parent appears.** A comment stores \`authorId\` (reference) plus \`authorName\` and \`authorAvatar\` (extended reference); the full author profile, follower count, bio, and settings stay only in the \`authors\` collection.`,

    contentHi: `## Kaunसा side reference rakhता hai

- **Child parent ko reference karता hai**: har child document parent ka \`_id\` store karता hai. Ek parent ke children paana \`find({ custId: parentId })\` hai. Ye one-to-many ke liye default hai aur one-to-squillions ke liye *ekmatra* option.
- **Parent children ko reference karता hai**: parent child \`_id\`s ka ek array store karता hai. Ye sirf tab safe hai jab child count genuinely bounded aur chhota hai.
- **Dono**: redundant, aur ab do cheezen har change par sync mein rakhnी hain.

## Referenced data recombine karna

- **Ek doosरी query**: parent fetch karो, phir \`find({ parentId: parent._id })\`.
- **\`$lookup\`**: MongoDB ka join, ek aggregation stage ke roop mein:

\`\`\`js
await db.customers.aggregate([
  { $lookup: { from: "orders", localField: "_id", foreignField: "custId", as: "orders" } },
  { $project: { _id: 0, name: 1, orderTotal: { $sum: "$orders.amt" } } },
]).toArray();
\`\`\`

\`$lookup\` genuinely useful hai, par ek single-collection query se zyada expensive hai. Agar aap khud ko har query par usी do collections ko \`$lookup\` karते paते ho, wo data shАyad embedded (ya extended-referenced) hona chahiye.

## Extended reference pattern

\`$lookup\` se bachने ka sabse common tarika **jo кुछ fields aapको asal mein chahiye unhe duplicate karna** hai:

\`\`\`js
{ _id: 1, title: "...", author: { _id: 7, name: "Ravi", avatarUrl: "https://..." } }
\`\`\`

Post ke paas abhi bhi \`author._id\` real reference ke roop mein hai, par ye *bhi* jo do-teen author fields ko render karne ke liye chahiye unki ek chhoti copy carry karता hai.

Cost **duplication jo sync mein rakhi jaani hai** hai: agar author apna naam badalता hai, purani copy carry karता har post ab stale hai (Lesson 6).

## Rule of thumb

**Source of truth ko reference karो. Un кुछ fields ko extended-reference karो jo har screen par dikhते hain jahaan parent aata hai.**`,

    examples: [
      {
        title: 'Child-references-parent: query a customer\'s orders directly',
        titleHi: 'Child-references-parent: ek customer ke orders ko seedhe query karo',
        code: `await db.customers.insertOne({ _id: 1, name: "Ravi" });
await db.orders.insertMany([
  { _id: 100, custId: 1, amt: 4999 },
  { _id: 101, custId: 1, amt: 1299 },
  { _id: 102, custId: 2, amt: 500 },
]);
print(await db.orders.find({ custId: 1 }).project({ _id: 1, amt: 1 }).toArray());`,
        output: `[{"_id":100,"amt":4999},{"_id":101,"amt":1299}]`,
        explain: 'Child-references-parent: each order stores `custId`, and "all of customer 1\'s orders" is a plain `find({ custId: 1 })` on the `orders` collection — which returns exactly orders 100 and 101, not order 102 (customer 2). This scales to any number of orders and each order is independently queryable.',
        explainHi: 'Child-references-parent: har order `custId` store karta hai, aur "customer 1 ke saare orders" `orders` collection par ek plain `find({ custId: 1 })` hai — jo theek orders 100 aur 101 lautaता hai, order 102 (customer 2) nahi. Ye kisī bhi sankhya mein orders tak scale karता hai.',
      },
      {
        title: '$lookup joins referenced orders back into each customer and computes a total',
        titleHi: '$lookup referenced orders ko har customer mein wapas join karta hai aur ek total compute karta hai',
        code: `await db.customers.insertMany([{ _id: 1, name: "Ravi" }, { _id: 2, name: "Amit" }]);
await db.orders.insertMany([
  { _id: 10, custId: 1, amt: 99 },
  { _id: 11, custId: 1, amt: 20 },
]);
print(await db.customers.aggregate([
  { $lookup: { from: "orders", localField: "_id", foreignField: "custId", as: "orders" } },
  { $project: { _id: 0, name: 1, orderTotal: { $sum: "$orders.amt" } } },
]).toArray());`,
        output: `[{"name":"Ravi","orderTotal":119},{"name":"Amit","orderTotal":0}]`,
        explain: "`$lookup` matches, for each customer, every order whose `custId` equals the customer's `_id`, into an `orders` array field. `$project` then computes `orderTotal` as the `$sum` of `orders.amt` — 99 + 20 = 119 for Ravi, and 0 for Amit (an empty array sums to 0). `$lookup` runs a per-customer lookup, so it is more expensive than a single-collection read.",
        explainHi: '`$lookup`, har customer ke liye, har order jiska `custId` customer ke `_id` ke barabar hai use ek `orders` array field mein match karता hai. `$project` phir `orderTotal` ko `orders.amt` ke `$sum` ke roop mein compute karता hai — Ravi ke liye 99 + 20 = 119, aur Amit ke liye 0.',
      },
      {
        title: 'Extended reference: a post carries a tiny copy of the author, so rendering needs no $lookup',
        titleHi: 'Extended reference: ek post author ki ek chhoti copy carry karta hai, to rendering ko koi $lookup nahi chahiye',
        code: `await db.authors.insertOne({ _id: 7, name: "Ravi", bio: "long bio", followerCount: 5000 });
await db.posts.insertOne({
  _id: 1, title: "Modeling", author: { _id: 7, name: "Ravi", avatarUrl: "/r.png" },
});
print(await db.posts.findOne({ _id: 1 }, { projection: { _id: 0 } }));`,
        output: `{"title":"Modeling","author":{"_id":7,"name":"Ravi","avatarUrl":"/r.png"}}`,
        explain: 'The post carries `author._id` as the real reference to the source-of-truth `authors` document, but ALSO a small copy of the two author fields it needs to render a post card: `name` and `avatarUrl`. `findOne` on the post returns that embedded copy — so displaying the post needs ZERO author lookups. The cost: a rename must update this copy too (Lesson 6).',
        explainHi: 'Post `author._id` ko source-of-truth `authors` document ke real reference ke roop mein carry karta hai, par SAATH mein un do author fields ki ek chhoti copy bhi jo use ek post card render karne ke liye chahiye: `name` aur `avatarUrl`. Post par `findOne` wo embedded copy lautaता hai — to post display karne ko ZERO author lookups chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `// $lookup-ing the same two collections on nearly every read
// every product-list page, every order summary, every dashboard tile:
db.orders.aggregate([{ $lookup: { from: "products", ... } }, ...])
// $lookup runs a per-document lookup -- doing it on every query, on the hot
// path, is paying a join cost MongoDB's model was meant to let you avoid`,
        right: `// extended-reference the product fields the order actually displays:
{ _id: 100, items: [
  { productId: 10, name: "Widget", priceAtPurchase: 499, qty: 2 }
]}
// the order line already has the name and price -- rendering it needs no lookup.
// (priceAtPurchase is also more correct: it's the price when ordered, not now)`,
        why: 'A $lookup performs a lookup into the foreign collection once for each input document, so using it on a query that runs frequently and returns many documents multiplies that per-document cost across the whole result set, on a code path where latency matters most. The document model exists specifically to let common reads be satisfied from a single collection without a join, so a query pattern that reaches for $lookup on nearly every request is a signal that the data being looked up should instead be present where it is needed. Extended-referencing the specific fields the query displays, copying just those into the referencing document, removes the lookup from the hot path entirely. In the order-line case this also happens to be more correct, because storing the price at the time of purchase captures what the customer actually paid rather than whatever the product\'s current price happens to be.',
        whyHi: 'Ek `$lookup` foreign collection mein ek lookup perform karता hai har input document ke liye ek baar, to ise ek query par istemal karna jo frequently chalती hai aur bahut documents lautaती hai us per-document cost ko poore result set ke across multiply karता hai. Document model specifically common reads ko ek single collection se satisfy hone deने ke liye exist karता hai. Us query ke display kiye specific fields ko extended-reference karna lookup ko hot path se poori tarah hataता hai.',
      },
      {
        wrong: `// extended-referencing a field that changes constantly
{ _id: 1, product: { _id: 10, name: "Widget", stockLevel: 47 } }
// stockLevel changes on every purchase -- now every order document carries a
// snapshot that's wrong within seconds, and there's no way to keep thousands
// of order documents' embedded stockLevel in sync with reality`,
        right: `// extended-reference only slow-changing display fields; keep volatile data
// referenced and looked up when actually needed:
{ _id: 1, product: { _id: 10, name: "Widget" } }   // name rarely changes
// stockLevel lives only on the product, read live when the stock matters`,
        why: 'The extended reference pattern trades a small amount of controlled duplication for the elimination of a lookup, and that trade is only favorable when the duplicated fields change rarely, because every change to a duplicated field requires finding and updating every document that carries a copy. A field like a product name or an author\'s display name changes seldom, so the occasional fan-out update to keep copies current is manageable. A field like a stock level, a price in a volatile market, or a live status changes constantly, so embedding a copy of it means every referencing document immediately holds a stale value and keeping thousands of copies synchronized would require constant writes with no realistic way to keep up. Volatile data should stay referenced and be read from its source of truth at the moment its current value actually matters, not duplicated into documents that cannot track its changes.',
        whyHi: 'Extended reference pattern ek chhoti controlled duplication ko ek lookup ke elimination ke liye trade karता hai, aur wo trade sirf tab favorable hai jab duplicated fields shАyad hi badalते hain, kyunki ek duplicated field ke har change ko har document dhoondна aur update karna paता hai jo ek copy carry karता hai. Ek product name shАyad hi badalता hai. Ek stock level ya price lगातार badalता hai, to iski ek copy embed karna matlab har referencing document turant ek stale value rakhता hai. Volatile data referenced rehना chahiye.',
      },
      {
        wrong: `// storing an array of child _ids in the parent for a relationship that only
// ever needs to go child -> parent
{ _id: 1, name: "Author", postIds: [10, 11, 12, /* ...and growing... */] }
// the app only ever asks "posts by this author" -- which is find({ authorId: 1 })
// on the posts collection anyway. The postIds array is pure overhead:
// it grows unbounded and must be updated on every new post`,
        right: `{ _id: 1, name: "Author" }   // no postIds array
// each post references the author:
{ _id: 10, authorId: 1, title: "..." }
// "posts by this author" = db.posts.find({ authorId: 1 }) with an index on authorId`,
        why: 'Choosing which side of a relationship holds the reference should follow from which direction the application actually queries. If the only access pattern is finding the children of a given parent, then having each child store a reference to the parent fully satisfies that need with a single indexed query on the child collection, and the parent needs to store nothing about the relationship at all. Adding an array of child identifiers to the parent in that situation provides no query capability that the child-side reference does not already provide, while introducing an array that grows without bound as children accumulate and that must be updated every time a child is added or removed. The array-in-parent approach earns its keep only when the parent-to-child direction genuinely needs the ordering or the single-lookup convenience the array provides and the child count is small and stable; for a plain child-to-parent access pattern, the child-side reference alone is both simpler and more scalable.',
        whyHi: 'Kaunसा side relationship ka reference rakhता hai ye is baat se follow hona chahiye ki application asal mein kaunसी direction query karती hai. Agar ekmatra access pattern ek diye gaye parent ke children dhoondна hai, to har child parent ka ek reference store karके wo need poori tarah satisfy hoती hai. Us situation mein parent mein child identifiers ka ek array add karna koi query capability nahi deता jo child-side reference pehle se nahi deता, jabki ek array introduce karता hai jo bina bound ke badhता hai.',
      },
    ],

    realWorld: [
      {
        en: '**Order line items storing `{ productId, name, priceAtPurchase, qty }`** — an extended reference that is both faster (no `$lookup` to render an order) and more correct (the price is frozen at purchase time).',
        hi: '**Order line items `{ productId, name, priceAtPurchase, qty }` store karte hue** — ek extended reference jo dono faster aur zyada correct hai.',
      },
      {
        en: '**Comments storing `authorId` + `authorName` + `authorAvatar`** — a comment thread of 200 comments renders with one query, no per-comment author lookup; a rare author rename triggers a background job to update the copies.',
        hi: '**Comments `authorId` + `authorName` + `authorAvatar` store karte hue** — 200 comments ka ek thread ek query se render hota hai.',
      },
      {
        en: '**A reporting query that genuinely needs `$lookup`** — a monthly revenue-by-customer-segment report joins `orders` and `customers`, run once a day as a batch job where the join cost is irrelevant.',
        hi: '**Ek reporting query jise genuinely `$lookup` chahiye** — ek monthly revenue report `orders` aur `customers` join karti hai, din mein ek baar batch job ke roop mein chalti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'When you reference instead of embed, which side should hold the reference, and how do you recombine the data at read time?',
        qHi: 'Jab aap embed ke bजाy reference karते ho, kaunसा side reference rakhना chahiye, aur aap read time par data kaise recombine karते ho?',
        a: 'Which side holds the reference should follow the direction the application queries. Having each child store the parent\'s id is the default and the only workable choice for a large or unbounded number of children, because getting a parent\'s children is then a single indexed query on the child collection that scales regardless of count, and each child remains independently queryable and paginatable. Having the parent store an array of child ids works only when the child count is genuinely small and bounded, since that array grows with the relationship and must be updated on every add or remove, and it also makes the reverse query a full scan. Storing the reference on both sides is redundant and creates two things to keep synchronized, justified only for a relationship traversed constantly in both directions. To recombine referenced data at read time, you either issue a second query, fetching the parent and then querying the child collection for the related documents, which is simple and often sufficient, or you use $lookup, which is MongoDB\'s join operation as an aggregation stage that pulls matching documents from another collection into an array field on each input document. $lookup is useful but runs a lookup per input document, so it is more expensive than a single-collection read and should not be relied on for every query on a hot path.',
        aHi: 'Kaunसा side reference rakhता hai ye application ki query direction ko follow karना chahiye. Har child parent ki id store karे ye default hai aur ek large ya unbounded sankhya mein children ke liye ekmatra workable choice. Parent child ids ka ek array store karे ye sirf tab kaam karता hai jab child count genuinely chhota aur bounded hai. Read time par recombine karne ke liye, aap ya to ek doosरी query issue karते ho, ya `$lookup` istemal karते ho, jo MongoDB ka join operation hai ek aggregation stage ke roop mein.',
      },
      {
        q: 'What is the extended reference pattern, and what are its costs?',
        qHi: 'Extended reference pattern kya hai, aur iski costs kya hain?',
        a: 'The extended reference pattern is copying a small number of fields from a referenced document into the document that references it, in addition to keeping the real reference id. For example, a post keeps author._id as the true link to the authors collection but also carries a copy of the author\'s name and avatar url, the two or three fields needed to render a post without looking up the author. The benefit is that displaying a post, or a list of a hundred posts, then requires no author lookup at all, removing a join from the most common read path. The cost is that the copied fields are now duplicated data that must be kept in sync: if the author changes their name, every post that carries the old copy holds stale data until it too is updated, which requires a fan-out update across potentially many documents. This trade is favorable when the duplicated fields are few, change rarely, and appear on a screen that would otherwise need a lookup on every render, and it is unfavorable for fields that change constantly or where a stale value would be harmful, which should stay referenced and read live from the source of truth.',
        aHi: 'Extended reference pattern ek referenced document se кुछ fields ko us document mein copy karna hai jo ise reference karता hai, real reference id rakhne ke alावा. Benefit ye hai ki ek post display karna phir koi author lookup require nahi karता. Cost ye hai ki copied fields ab duplicated data hain jo sync mein rakhे jaane chahiye: agar author apna naam badalता hai, purani copy carry karता har post stale data rakhता hai. Ye trade favorable hai jab duplicated fields кुछ hain, shАyad hi badalते hain, aur ek screen par aate hain jise warna har render par ek lookup chahiye.',
      },
    ],

    exercises: [
      {
        task: 'Model child-references-parent: a `customers` collection and an `orders` collection where each order has a `custId`. Insert one customer and three orders (two for customer 1). Confirm `find({ custId: 1 })` on `orders` returns exactly the two.',
        taskHi: 'Child-references-parent model karo: ek `customers` collection aur ek `orders` collection jahaan har order ka ek `custId` hai. Ek customer aur teen orders insert karo.',
        hint: 'Child-references-parent is the default for one-to-many and the only option for one-to-squillions — the parent stores nothing about the relationship, and children are queried directly.',
        hintHi: 'Child-references-parent one-to-many ke liye default hai — parent relationship ke baare mein kuch store nahi karta.',
      },
      {
        task: 'With `customers` and `orders` (orders reference customers by `custId`), write an aggregation that uses `$lookup` to attach each customer\'s orders and then `$project` a computed `orderTotal` (the `$sum` of `orders.amt`). Confirm a customer with no orders gets `orderTotal: 0`.',
        taskHi: '`customers` aur `orders` ke saath, ek aggregation likho jo `$lookup` istemal karke har customer ke orders attach karta hai aur phir ek computed `orderTotal` `$project` karta hai.',
        hint: '`$lookup` puts matching orders in an array field; `$sum: "$orders.amt"` over an empty array is 0. `$lookup` runs a per-customer lookup — fine for a report, expensive on a hot path.',
        hintHi: '`$lookup` matching orders ko ek array field mein rakhta hai; ek empty array par `$sum` 0 hai.',
      },
      {
        task: 'Model an extended reference: an `authors` collection with a full author document, and a `posts` collection where each post stores `author: { _id, name, avatarUrl }` (a tiny copy). Insert one author and one post. Confirm `findOne` on the post returns the embedded author copy with no `$lookup`.',
        taskHi: 'Ek extended reference model karo: ek `authors` collection ek full author document ke saath, aur ek `posts` collection jahaan har post `author: { _id, name, avatarUrl }` store karta hai. Ek author aur ek post insert karo.',
        hint: 'The post keeps `author._id` as the real reference AND a small copy of the display fields. Rendering the post needs zero author lookups — the cost is keeping the copy in sync if the author is renamed (Lesson 6).',
        hintHi: 'Post `author._id` ko real reference ke roop mein AUR display fields ki ek chhoti copy rakhta hai. Cost author rename hone par copy ko sync mein rakhna hai.',
      },
    ],

    keyTakeaways: [
      'WHICH SIDE holds the reference follows the QUERY DIRECTION. CHILD→PARENT (each order stores `custId`): "all of X\'s children" = `find({ parentId })`, scales to unbounded, each child independently queryable — the default for one-to-many, the ONLY option for one-to-squillions. PARENT→CHILD (parent stores `[childIds]`): one lookup + preserves order, but the array GROWS — only for genuinely bounded/small child counts, and the reverse query is a full scan. BOTH: redundant, two things to sync — only for constant both-direction traversal.',
      'RECOMBINING referenced data at read time: (1) a SECOND QUERY (fetch parent, then `find({ parentId })`) — simple, often fine. (2) `$lookup` — aggregation\'s "join": matches another collection\'s docs into an array field per input doc.',
      '`$lookup` runs a lookup PER INPUT DOCUMENT — more expensive than a single-collection read. If you\'re `$lookup`-ing the same two collections on nearly every query, that data wants to be EMBEDDED or EXTENDED-REFERENCED instead. `$lookup` is right for reports/batch jobs where join cost is irrelevant.',
      'EXTENDED REFERENCE pattern: keep the real reference id AND copy the FEW display fields you need (`author: { _id, name, avatarUrl }`). Rendering the parent then needs ZERO lookups. The most common way real references avoid most joins.',
      'The COST of extended reference: duplicated data that must be kept IN SYNC — rename the author → every post\'s embedded copy is stale until updated too (Lesson 6). Favorable when the copied fields are FEW, change RARELY, and appear on a screen that\'d otherwise need a lookup. WRONG for volatile fields (stock level, live price) — those stay referenced and read live.',
      'RULE OF THUMB: reference the source of truth; extended-reference the handful of fields that appear on every screen the parent shows up on. Order lines storing `priceAtPurchase` is also MORE CORRECT — it freezes the price at order time.',
    ],
    keyTakeawaysHi: [
      'KAUNSA SIDE reference rakhता hai ye QUERY DIRECTION ko follow karता hai. CHILD→PARENT: "X ke saare children" = `find({ parentId })`, unbounded tak scale — one-to-many ke liye default, one-to-squillions ke liye ONLY option. PARENT→CHILD: ek lookup + order preserve, par array BADHTA hai — sirf bounded/small counts ke liye. DONO: redundant.',
      'RECOMBINING: (1) ek DOOSRI QUERY — simple. (2) `$lookup` — aggregation ka "join".',
      '`$lookup` PRATI INPUT DOCUMENT ek lookup chalाता hai — ek single-collection read se zyada expensive. Agar aap har query par usी do collections ko `$lookup` kar rahe ho, wo data EMBEDDED ya EXTENDED-REFERENCED hona chahiye.',
      'EXTENDED REFERENCE pattern: real reference id AND jo кुछ display fields chahiye unhe copy karो. Parent render karne ko phir ZERO lookups chahiye.',
      'COST: duplicated data jo SYNC mein rakhा jaana chahiye — author rename → har post ki copy stale (Lesson 6). Favorable jab copied fields KUCH hain, RARELY badalते hain. Volatile fields ke liye GALAT.',
      'RULE OF THUMB: source of truth ko reference karो; un кुछ fields ko extended-reference karो jo har screen par dikhते hain. `priceAtPurchase` store karna zyada CORRECT bhi hai.',
    ],
  },
];
