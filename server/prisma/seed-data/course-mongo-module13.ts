/**
 * Databases Complete Course — Module 13: MongoDB Fundamentals, lessons 1-3.
 * Part III of the course: the document database model.
 *
 * Lesson 1: The document model — databases, collections, documents, BSON types,
 *           `_id` and ObjectId, and how mongosh differs from a driver.
 * Lesson 2: Inserting & reading — insertOne/insertMany, find/findOne, cursors,
 *           and projection.
 * Lesson 3: Query operators — comparison, membership, existence/type, and the
 *           logical operators, plus dot notation for nested fields.
 *
 * Verified against a real in-memory MongoDB (mongodb-memory-server).
 * Run: node verify-mongo.mjs 13
 *
 * NOTE ON EXAMPLE CODE: examples use driver-style JavaScript (`db.users` is the
 * `users` collection; `await` and `.toArray()` are explicit; `print(x)` shows a
 * value). In `mongosh` you type the same operations without `await`, and a
 * cursor prints its documents automatically without `.toArray()`.
 */

import type { CourseLesson } from './course-js-module1';

export const MONGO_MODULE_13: CourseLesson[] = [
  {
    slug: 'mongo-the-document-model',
    title: 'The Document Model',
    titleHi: 'Document Model',
    description: 'MongoDB stores data as documents — JSON-like objects with nested structure and arrays — grouped into collections, grouped into databases. There is no fixed schema per collection, every document carries a unique `_id`, and the storage format (BSON) adds real types like dates and 64-bit integers on top of JSON.',
    descriptionHi: 'MongoDB data ko documents ke roop mein store karta hai — JSON-jaisе objects nested structure aur arrays ke saath — collections mein grouped, databases mein grouped. Prati-collection koi fixed schema nahi, har document ek unique `_id` carry karta hai, aur storage format (BSON) JSON ke upar dates aur 64-bit integers jaisе real types add karta hai.',
    difficulty: 'EASY',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A filing cabinet of folders, where each folder holds one complete case file — not a spreadsheet where every row must have the same columns.** A relational table is like a spreadsheet: every row has exactly the same columns, and information that does not fit that grid has to go in a separate sheet and be joined back. A MongoDB collection is more like a drawer of case folders: each folder (a document) holds everything about one thing — the client\'s details, the list of meetings, the attached notes — all together, and two folders in the same drawer are not required to be laid out identically, because a folder for a simple case and a folder for a complicated one genuinely need different contents. Every folder has a unique case number stamped on it (`_id`) so it can always be found again, and the folders aren\'t just loose paper — they hold real dated documents and real numbered exhibits, not just text (that is BSON adding types JSON lacks).',
      hi: '**Folders ka ek filing cabinet, jahaan har folder ek complete case file rakhता hai — ek spreadsheet nahi jahaan har row mein same columns hone chahiye.** Ek relational table ek spreadsheet jaisī hai: har row mein theek same columns hote hain. Ek MongoDB collection zyada case folders ke ek drawer jaisī hai: har folder (ek document) ek cheez ke baare mein sab kuch rakhता hai — client ki details, meetings ki list, attached notes — sab saath, aur usī drawer ke do folders ko identically laid out hone ki zaroorat nahi. Har folder par ek unique case number stamp hai (`_id`) taaki ise hamesha dobara dhoondа ja sake, aur folders sirf loose paper nahi hain — wo real dated documents rakhते hain (ye BSON JSON ke missing types add kar raha hai).',
    },

    simple: `**A database holds COLLECTIONS; a collection holds DOCUMENTS (JSON-like objects)**

\`\`\`js
// a document -- nested objects and arrays are natural, not a special case
{
  _id: 1,
  name: "Ravi",
  address: { city: "Pune", zip: "411001" },
  tags: ["vip", "new"]
}
\`\`\`

**Every document has a unique \`_id\` (the primary key) -- auto-generated if you don't supply one**

\`\`\`js
await db.users.insertOne({ _id: 1, name: "Ravi" });
await db.users.insertOne({ _id: 1, name: "Amit" });   // ERROR -- _id 1 already exists
\`\`\`
\`\`\`
[ERROR] E11000 duplicate key error collection: learn.users index: _id_ dup key: { _id: 1 }
\`\`\`

**A collection has NO fixed schema -- two documents can have completely different shapes**

\`\`\`js
await db.things.insertOne({ _id: 1, type: "user", name: "Ravi" });
await db.things.insertOne({ _id: 2, type: "event", ts: 100, payload: { a: 1 } });
// both succeed -- same collection, totally different fields
\`\`\`

**BSON: the storage format -- JSON's types PLUS \`ObjectId\`, \`Date\`, 64-bit \`int\`/\`long\`, \`Decimal128\`, binary**

\`\`\`
JSON has:  string, number, boolean, null, array, object
BSON adds: ObjectId (the default _id), Date (a real timestamp), distinct int32
           vs int64 vs double, Decimal128 (exact decimals), Binary, and more
\`\`\`

**\`mongosh\` (the shell) vs a driver: in mongosh you skip \`await\` and a cursor prints its own results;
a driver (Node, Python, ...) needs \`await\` and \`.toArray()\` -- the operations are otherwise identical**`,

    simpleHi: `**Ek database COLLECTIONS rakhता hai; ek collection DOCUMENTS rakhता hai (JSON-jaisе objects)**

\`\`\`js
{
  _id: 1,
  name: "Ravi",
  address: { city: "Pune", zip: "411001" },
  tags: ["vip", "new"]
}
\`\`\`

**Har document ka ek unique \`_id\` hota hai (primary key) -- auto-generated agar aap ek supply nahi karte**

\`\`\`js
await db.users.insertOne({ _id: 1, name: "Ravi" });
await db.users.insertOne({ _id: 1, name: "Amit" });   // ERROR -- _id 1 pehle se exist karta hai
\`\`\`
\`\`\`
[ERROR] E11000 duplicate key error collection: learn.users index: _id_ dup key: { _id: 1 }
\`\`\`

**Ek collection ka KOI fixed schema NAHI -- do documents ki poori tarah alag shapes ho sakti hain**

\`\`\`js
await db.things.insertOne({ _id: 1, type: "user", name: "Ravi" });
await db.things.insertOne({ _id: 2, type: "event", ts: 100, payload: { a: 1 } });
\`\`\`

**BSON: storage format -- JSON ke types PLUS \`ObjectId\`, \`Date\`, 64-bit \`int\`/\`long\`, \`Decimal128\`, binary**

**\`mongosh\` (shell) vs ek driver: mongosh mein aap \`await\` skip karte ho aur ek cursor apne results print karta hai; ek driver ko \`await\` aur \`.toArray()\` chahiye -- operations warna identical hain**`,

    content: `## Databases, collections, documents

MongoDB's hierarchy has three levels:

- A **document** is a single record: a JSON-like object, where nested objects and arrays are ordinary field values, not something that needs a separate table.
- A **collection** is a group of documents — the rough equivalent of a relational table, except a collection imposes no schema, so its documents need not share the same fields or the same types for a given field.
- A **database** is a group of collections.

\`\`\`js
{
  _id: 1,
  name: "Ravi",
  address: { city: "Pune", zip: "411001" },
  tags: ["vip", "new"]
}
\`\`\`

The defining difference from the relational model (Modules 1-12) is that a document holds *related data together*. A relational design would put \`address\` in its own table and the tags in a junction table, joined back at query time; a document embeds them directly, so reading the whole entity is a single lookup with no join.

## \`_id\`: the mandatory primary key

Every document has an \`_id\` field, and it must be unique within its collection — it is the primary key, always indexed, and cannot be changed after insert. If you do not supply an \`_id\`, MongoDB generates one automatically as an **ObjectId**: a 12-byte value (rendered as 24 hex characters) that embeds a timestamp and is effectively unique without coordination. You can also supply your own \`_id\` — an integer, a string, even a small object — as long as it is unique.

\`\`\`js
await db.users.insertOne({ _id: 1, name: "Ravi" });
await db.users.insertOne({ _id: 1, name: "Amit" });
\`\`\`
\`\`\`
[ERROR] E11000 duplicate key error collection: learn.users index: _id_ dup key: { _id: 1 }
\`\`\`

The \`E11000\` error is MongoDB's duplicate-key error, here on the built-in \`_id_\` index.

## No fixed schema

\`\`\`js
await db.things.insertOne({ _id: 1, type: "user", name: "Ravi" });
await db.things.insertOne({ _id: 2, type: "event", ts: 100, payload: { a: 1 } });
\`\`\`

Both inserts succeed into the same collection despite having entirely different fields. This flexibility is genuinely useful for data whose shape varies or evolves — but it is not a licence to be careless: most production collections are, by convention and often by an explicitly configured validator (Module 16), quite consistent in shape. The flexibility is there for when a field is genuinely optional or a new field is being rolled out gradually, not as an excuse to skip data modeling (Module 14 is entirely about doing that modeling well).

## BSON: the type system

MongoDB stores documents as **BSON** (Binary JSON), a binary format that is a superset of JSON's type system:

- JSON's types: string, number, boolean, null, array, object.
- BSON adds, among others: **ObjectId** (the default \`_id\` type), **Date** (a genuine millisecond timestamp, not a string), a distinction between **32-bit int**, **64-bit long**, and **double**, **Decimal128** for exact decimal arithmetic (money), and **Binary** for raw bytes.

This matters in practice: a date stored as a BSON \`Date\` sorts and compares correctly and supports date operators, whereas a date stored as a string (a common mistake carried over from JSON habits) only compares lexically. Similarly, storing money as a \`double\` reintroduces the floating-point rounding problems Module 8's "choosing column types" lesson warned about; \`Decimal128\` is the right choice.

## \`mongosh\` vs drivers

Examples in this module are written in driver style — \`db.users.insertOne(...)\` with an explicit \`await\`, and \`.toArray()\` to materialize a cursor's results. The **mongosh** shell runs the identical operations but is more forgiving interactively: it awaits automatically, and typing a \`find(...)\` at the prompt prints the first batch of matching documents without \`.toArray()\`. The query and update syntax — the filters, the operators, everything in the rest of this module — is exactly the same in both; only the surrounding JavaScript ceremony differs.`,

    contentHi: `## Databases, collections, documents

MongoDB ki hierarchy ke teen levels hain:

- Ek **document** ek single record hai: ek JSON-jaisा object, jahaan nested objects aur arrays ordinary field values hain.
- Ek **collection** documents ka ek group hai — ek relational table ka rough equivalent, siwaay iske ki ek collection koi schema impose nahi karta.
- Ek **database** collections ka ek group hai.

\`\`\`js
{
  _id: 1,
  name: "Ravi",
  address: { city: "Pune", zip: "411001" },
  tags: ["vip", "new"]
}
\`\`\`

Relational model se defining antar ye hai ki ek document *related data ko saath* rakhता hai.

## \`_id\`: mandatory primary key

Har document ka ek \`_id\` field hai, aur ye apni collection ke andar unique hona chahiye. Agar aap ek \`_id\` supply nahi karte, MongoDB ise automatically ek **ObjectId** ke roop mein generate karta hai: ek 12-byte value.

\`\`\`js
await db.users.insertOne({ _id: 1, name: "Ravi" });
await db.users.insertOne({ _id: 1, name: "Amit" });
\`\`\`
\`\`\`
[ERROR] E11000 duplicate key error collection: learn.users index: _id_ dup key: { _id: 1 }
\`\`\`

## Koi fixed schema nahi

\`\`\`js
await db.things.insertOne({ _id: 1, type: "user", name: "Ravi" });
await db.things.insertOne({ _id: 2, type: "event", ts: 100, payload: { a: 1 } });
\`\`\`

Dono inserts usī collection mein succeed hote hain poori tarah alag fields hone ke bawजूd. Ye flexibility genuinely useful hai — par ye careless hone ka licence nahi hai (Module 14 poori tarah is modeling ke baare mein hai).

## BSON: type system

MongoDB documents ko **BSON** (Binary JSON) ke roop mein store karta hai:

- JSON ke types: string, number, boolean, null, array, object.
- BSON add karta hai: **ObjectId**, **Date** (ek genuine timestamp), **int32** vs **int64** vs **double** ka distinction, **Decimal128** (exact decimals, money ke liye), **Binary**.

Ek string ke roop mein stored ek date sirf lexically compare hoती hai; money ko \`double\` ke roop mein store karna floating-point rounding problems wapas laता hai; \`Decimal128\` sahi choice hai.

## \`mongosh\` vs drivers

Is module ke examples driver style mein likhе hain. **mongosh** shell identical operations chalाता hai par interactively zyada forgiving hai: ye automatically await karta hai, aur prompt par ek \`find(...)\` type karna \`.toArray()\` ke bina matching documents print karta hai. Query aur update syntax dono mein bilkul same hai.`,

    examples: [
      {
        title: 'Every document needs a unique _id — a duplicate raises E11000',
        titleHi: 'Har document ko ek unique _id chahiye — ek duplicate E11000 raise karta hai',
        code: `await db.users.insertOne({ _id: 1, name: "Ravi" });
await db.users.insertOne({ _id: 1, name: "Amit" });`,
        output: `[ERROR] E11000 duplicate key error collection: learn.users index: _id_ dup key: { _id: 1 }`,
        explain: 'The first insert stores `{ _id: 1, name: "Ravi" }`. The second supplies the same `_id: 1`, which already exists in the collection, so MongoDB rejects it with `E11000` — the duplicate-key error, reported against the built-in `_id_` index that enforces `_id` uniqueness on every collection.',
        explainHi: 'Pehla insert `{ _id: 1, name: "Ravi" }` store karta hai. Doosra wahi `_id: 1` supply karta hai, jo collection mein pehle se exist karta hai, to MongoDB ise `E11000` ke saath reject karta hai — duplicate-key error, built-in `_id_` index ke against report kiya gaya jo har collection par `_id` uniqueness enforce karta hai.',
      },
      {
        title: 'A document holds nested objects and arrays directly, and BSON round-trips every type',
        titleHi: 'Ek document nested objects aur arrays seedhe rakhता hai, aur BSON har type round-trip karta hai',
        code: `await db.t.insertOne({ _id: 1, s: "hi", i: 42, d: 3.5, b: true, arr: [1, 2], obj: { x: 1 }, nil: null });
print(await db.t.findOne({ _id: 1 }));`,
        output: `{"_id":1,"s":"hi","i":42,"d":3.5,"b":true,"arr":[1,2],"obj":{"x":1},"nil":null}`,
        explain: "One `insertOne` stores a document containing a string, an int, a double, a boolean, an array, a nested object, and `null`. Reading it back with `findOne` shows every value returned exactly as inserted — BSON is a superset of JSON's types, so nested objects and arrays are ordinary field values, not a special case needing a separate table.",
        explainHi: 'Ek `insertOne` ek document store karta hai jismein ek string, ek int, ek double, ek boolean, ek array, ek nested object, aur `null` hai. Ise `findOne` se wapas padhna har value ko theek waise dikhata hai jaise insert kiya gaya — BSON JSON ke types ka ek superset hai, to nested objects aur arrays ordinary field values hain.',
      },
      {
        title: 'One collection can hold documents of completely different shapes',
        titleHi: 'Ek collection poori tarah alag shapes ke documents rakh sakti hai',
        code: `await db.things.insertOne({ _id: 1, type: "user", name: "Ravi" });
await db.things.insertOne({ _id: 2, type: "event", ts: 100, payload: { a: 1 } });
print(await db.things.find({}).toArray());`,
        output: `[{"_id":1,"type":"user","name":"Ravi"},{"_id":2,"type":"event","ts":100,"payload":{"a":1}}]`,
        explain: 'Both documents insert successfully into the same `things` collection despite having completely different fields — one has `type`/`name`, the other has `type`/`ts`/`payload`. A collection imposes no schema, so `find({})` returns both. (Useful for genuine variation; Module 14 covers doing data modeling properly.)',
        explainHi: 'Dono documents usi `things` collection mein successfully insert hote hain poori tarah alag fields hone ke bawजूd — ek ke paas `type`/`name` hai, doosre ke paas `type`/`ts`/`payload`. Ek collection koi schema impose nahi karti, to `find({})` dono lautaता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// storing a date as a string, out of JSON habit
await db.events.insertOne({ _id: 1, name: "launch", when: "2026-03-15" });
// "when" is now just text -- it sorts lexically, can't be compared with date
// operators, and "2026-3-5" would sort AFTER "2026-03-15" (string comparison)`,
        right: `await db.events.insertOne({ _id: 1, name: "launch", when: new Date("2026-03-15") });
// stored as a BSON Date -- sorts chronologically, works with date operators,
// and round-trips as a real timestamp`,
        why: 'JSON has no date type, so anyone carrying JSON habits into MongoDB tends to store dates as strings, but BSON does have a genuine Date type and MongoDB\'s date operators, sorting, and range queries all depend on it. A date stored as a string is compared lexically, character by character, which happens to work only when every value is written in exactly the same zero-padded format, and breaks silently the moment a value like "2026-3-5" appears, since that sorts differently than "2026-03-05" would. Storing the value as a BSON Date instead makes chronological sorting, date-range filtering, and date-component extraction all work correctly and unambiguously, and is the small habit change that avoids a whole class of subtle date bugs.',
        whyHi: 'JSON ke paas koi date type nahi hai, to JSON habits waale log MongoDB mein dates ko strings ke roop mein store karte hain, par BSON ke paas ek genuine Date type hai aur MongoDB ke date operators, sorting, aur range queries sab ispar depend karте hain. Ek string ke roop mein stored ek date lexically compare hoती hai, jo sirf tab kaam karता hai jab har value theek same zero-padded format mein likhi ho. Value ko ek BSON Date ke roop mein store karna chronological sorting sahi banata hai.',
      },
      {
        wrong: `// treating "no schema" as "no need to think about structure"
await db.users.insertOne({ name: "Ravi", age: 30 });
await db.users.insertOne({ fullName: "Amit", years: 25 });
await db.users.insertOne({ name: "Sara", age: "thirty-five" });
// three "users" with three different field names and a string where a number
// belongs -- every query now has to handle all the variations`,
        right: `// pick a consistent shape and stick to it, even though MongoDB won't enforce it:
await db.users.insertOne({ name: "Ravi", age: 30 });
await db.users.insertOne({ name: "Amit", age: 25 });
await db.users.insertOne({ name: "Sara", age: 35 });
// (Module 16 covers adding a $jsonSchema validator to enforce this at the DB level)`,
        why: 'The absence of an enforced schema is a tool for handling genuine variation and gradual change, not an invitation to let each insert use whatever field names and types happen to be convenient at the moment. When documents in one collection disagree about what a field is called or what type it holds, every query and every piece of application code that reads the collection has to account for all the variants, checking multiple field names and coping with mixed types, which is far more total work than simply agreeing on a shape up front would have been. A consistent structure remains the right default; MongoDB\'s flexibility is valuable precisely because it lets you deviate from that structure deliberately when a specific document genuinely needs to, and a schema validator can enforce the intended shape at the database level once it stabilizes.',
        whyHi: 'Ek enforced schema ki absence genuine variation aur gradual change handle karne ke liye ek tool hai, har insert ko jo bhi field names aur types us pal convenient hon istemal karne ka invitation nahi. Jab ek collection ke documents is baat par disagree karte hain ki ek field kya kehlaता hai ya kaunसा type rakhता hai, har query aur har application code ko sabhi variants account karne hote hain. Ek consistent structure sahi default rehта hai.',
      },
      {
        wrong: `// storing money as a double, reintroducing floating-point rounding errors
await db.invoices.insertOne({ _id: 1, total: 19.99, tax: 1.65 });
// 19.99 and 1.65 are not exactly representable in binary floating point --
// summing many such values across documents accumulates rounding drift`,
        right: `// use Decimal128 for exact decimal arithmetic on money:
// (in the driver: import { Decimal128 } from "mongodb")
await db.invoices.insertOne({ _id: 1, total: Decimal128.fromString("19.99"), tax: Decimal128.fromString("1.65") });
// stored and computed as exact base-10 decimals -- no accumulating drift`,
        why: 'A double is a binary floating-point number, and values like 19.99 or 1.65 cannot be represented exactly in binary, so each one is stored as the nearest representable approximation, and arithmetic over many such approximations accumulates a small but real drift, exactly the problem Module 8 raised about choosing a numeric type for money in a relational schema. BSON\'s Decimal128 type stores numbers as exact base-10 decimals with enough precision for financial work, so amounts are held and summed without the representational error a double introduces. The reasoning is identical to the relational case: money needs a type designed for exact decimal values, and using a floating-point type for it is a bug that stays invisible until totals stop matching by a cent.',
        whyHi: 'Ek `double` ek binary floating-point number hai, aur 19.99 ya 1.65 jaisī values binary mein exactly represent nahi ho sakti, to har ek nearest representable approximation ke roop mein store hoती hai, aur kई aisī approximations par arithmetic ek chhota par real drift accumulate karता hai — theek wo problem jo Module 8 ne money ke liye ek numeric type chunне ke baare mein raise ki. BSON ka `Decimal128` type numbers ko exact base-10 decimals ke roop mein store karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A `users` collection where each document embeds the user\'s address object and notification-preferences object directly** — reading a full user profile is one document lookup, with no joins, exactly the shape a profile screen needs.',
        hi: '**Ek `users` collection jahaan har document user ka address object aur notification-preferences object seedhe embed karta hai** — ek poora user profile padhna ek document lookup hai, koi joins nahi.',
      },
      {
        en: '**An `events` collection storing heterogeneous analytics events**, each with a `type` field and a `type`-specific `payload` object — the schema flexibility genuinely fits data whose shape depends on the event kind.',
        hi: '**Ek `events` collection jo heterogeneous analytics events store karti hai**, har ek ek `type` field aur ek `type`-specific `payload` object ke saath.',
      },
      {
        en: '**A code-review rule rejecting any new document field that stores a date or a monetary amount as a string or a double** — BSON `Date` and `Decimal128` are required for those, enforced later by a `$jsonSchema` validator.',
        hi: '**Ek code-review rule jo kisī bhi naye document field ko reject karta hai jo ek date ya monetary amount ko ek string ya double ke roop mein store karta hai** — un ke liye BSON `Date` aur `Decimal128` zaroori hain.',
      },
    ],

    interviewQA: [
      {
        q: 'How does MongoDB\'s document model differ from the relational model, and what is BSON?',
        qHi: 'MongoDB ka document model relational model se kaise alag hai, aur BSON kya hai?',
        a: 'The relational model organizes data into tables of rows where every row in a table has the same fixed set of columns, and relationships between entities are expressed by storing keys and joining the tables together at query time. MongoDB instead stores data as documents, which are JSON-like objects that can contain nested objects and arrays as ordinary field values, grouped into collections that impose no schema, so two documents in the same collection are not required to have the same fields or the same types. The practical consequence is that a document can hold an entire entity and its closely related data together, an address embedded in a user, the line items embedded in an order, so reading that whole entity is a single lookup with no join, at the cost of the relational model\'s strong per-column typing and its ability to enforce relationships with foreign keys. BSON, meaning Binary JSON, is the format MongoDB actually stores documents in: it is a superset of JSON\'s type system that adds types JSON lacks, including ObjectId for the default identifier, a genuine Date type rather than a date string, a distinction between 32-bit and 64-bit integers and doubles, Decimal128 for exact decimal arithmetic, and a binary type, which matters because operators, sorting, and range queries all depend on values being stored as the right BSON type rather than as strings.',
        aHi: 'Relational model data ko tables of rows mein organize karta hai jahaan ek table ki har row mein same fixed columns hote hain. MongoDB iske bजाy data ko documents ke roop mein store karta hai, jo JSON-jaisе objects hain jo nested objects aur arrays rakh sakte hain, collections mein grouped jo koi schema impose nahi karti. Practical consequence ye hai ki ek document ek poori entity aur iski closely related data ko saath rakh sakta hai, to us poori entity ko padhna ek single lookup hai koi join ke bina. BSON, matlab Binary JSON, wo format hai jismein MongoDB documents ko store karta hai: ye JSON ke type system ka ek superset hai jo ObjectId, ek genuine Date type, int32 vs int64 vs double ka distinction, Decimal128, aur ek binary type add karta hai.',
      },
      {
        q: 'What is the `_id` field, and what happens if you do not provide one?',
        qHi: '`_id` field kya hai, aur agar aap ek provide nahi karte to kya hota hai?',
        a: 'Every MongoDB document has an `_id` field that serves as its primary key: it must be unique within the collection, it is automatically indexed, and it cannot be changed once the document is inserted. If an insert does not include an `_id`, MongoDB generates one automatically as an ObjectId, which is a 12-byte value, usually displayed as 24 hexadecimal characters, that embeds a creation timestamp along with machine and counter components, making it effectively unique across machines without any central coordination. An application can also supply its own `_id` value instead, using an integer, a string, or even a small embedded object, as long as the value is unique within the collection; this is common when there is already a natural identifier for the entity. Attempting to insert a second document with an `_id` that already exists in the collection fails with a duplicate-key error, reported as error code E11000 against the built-in `_id_` index.',
        aHi: 'Har MongoDB document ka ek `_id` field hai jo iski primary key ke roop mein serve karta hai: ye collection ke andar unique hona chahiye, ye automatically indexed hai, aur ise document insert hone ke baad badla nahi ja sakta. Agar ek insert mein `_id` shamil nahi hai, MongoDB ise automatically ek ObjectId ke roop mein generate karta hai, jo ek 12-byte value hai jo ek creation timestamp embed karता hai. Ek application apni `_id` value bhi supply kar sakti hai. Ek aisi `_id` ke saath ek doosra document insert karne ki koshish jo pehle se exist karti hai ek duplicate-key error (E11000) ke saath fail hoती hai.',
      },
    ],

    exercises: [
      {
        task: 'Insert a document `{ _id: 1, name: "Ravi" }` into a `users` collection, then attempt to insert `{ _id: 1, name: "Amit" }`. Confirm the second insert fails with an `E11000` duplicate-key error on the `_id_` index.',
        taskHi: 'Ek `users` collection mein ek document `{ _id: 1, name: "Ravi" }` insert karo, phir `{ _id: 1, name: "Amit" }` insert karne ki koshish karo. Confirm karo doosरा insert `_id_` index par ek `E11000` duplicate-key error ke saath fail hota hai.',
        hint: '`_id` is the primary key — unique within the collection, always indexed. A second document with an existing `_id` value is rejected.',
        hintHi: '`_id` primary key hai — collection ke andar unique, hamesha indexed. Ek existing `_id` value waala doosरा document reject hota hai.',
      },
      {
        task: 'Insert one document containing a string, an integer, a double, a boolean, an array, a nested object, and a `null` field. Read it back with `findOne` and confirm every value round-trips unchanged.',
        taskHi: 'Ek document insert karo jismein ek string, ek integer, ek double, ek boolean, ek array, ek nested object, aur ek `null` field ho. Ise `findOne` se wapas padho aur confirm karo har value unchanged round-trip karти hai.',
        hint: 'BSON is a superset of JSON\'s types, so all of these store and retrieve exactly — nested objects and arrays are ordinary field values, not a special case.',
        hintHi: 'BSON JSON ke types ka ek superset hai, to ye sab exactly store aur retrieve hoते hain — nested objects aur arrays ordinary field values hain.',
      },
      {
        task: 'Into a single `things` collection, insert `{ _id: 1, type: "user", name: "Ravi" }` and `{ _id: 2, type: "event", ts: 100, payload: { a: 1 } }`. Confirm both succeed and `find({})` returns both, despite their completely different fields.',
        taskHi: 'Ek single `things` collection mein, `{ _id: 1, type: "user", name: "Ravi" }` aur `{ _id: 2, type: "event", ts: 100, payload: { a: 1 } }` insert karo. Confirm karo dono succeed hote hain.',
        hint: 'A collection imposes no schema — documents need not share fields or types. (Useful for genuine variation; not an excuse to skip data modeling, which Module 14 covers.)',
        hintHi: 'Ek collection koi schema impose nahi karti — documents ko fields ya types share karne ki zaroorat nahi.',
      },
    ],

    keyTakeaways: [
      'HIERARCHY: a database holds COLLECTIONS, a collection holds DOCUMENTS. A document is a JSON-like object where nested objects and arrays are ordinary field values — so a document holds a whole entity + its related data TOGETHER, read in one lookup with NO join (the opposite of the relational model\'s "split into tables, join at query time").',
      'Every document has an `_id` — the primary key: unique within the collection, always indexed, immutable after insert. Omit it and MongoDB generates an ObjectId (12 bytes / 24 hex chars, embeds a timestamp, unique without coordination). You can supply your own (int/string/small object) if unique. A duplicate `_id` → `E11000 duplicate key error ... index: _id_`.',
      'A collection has NO fixed schema — two documents can have completely different fields and types. This flexibility is for genuine variation / gradual rollout, NOT an excuse to skip modeling (Module 14) — most production collections stay consistent by convention, often enforced by a `$jsonSchema` validator (Module 16).',
      'BSON (Binary JSON) is the storage format: JSON\'s types (string/number/boolean/null/array/object) PLUS `ObjectId`, `Date` (a real timestamp, NOT a string), distinct int32/int64/double, `Decimal128` (exact decimals — use for money), `Binary`, and more.',
      'Common type mistakes carried from JSON habits: storing a DATE as a string (sorts lexically, breaks with `"2026-3-5"`, no date operators) — use `Date`. Storing MONEY as a double (floating-point drift accumulates) — use `Decimal128`. Same reasoning as Module 8\'s "choosing column types".',
      '`mongosh` (the shell) vs a DRIVER (Node/Python/...): mongosh auto-awaits and auto-prints a cursor\'s documents; a driver needs explicit `await` and `.toArray()`. The query/update/operator syntax is IDENTICAL in both — only the surrounding JS ceremony differs.',
    ],
    keyTakeawaysHi: [
      'HIERARCHY: ek database COLLECTIONS rakhता hai, ek collection DOCUMENTS. Ek document ek JSON-jaisा object hai jahaan nested objects aur arrays ordinary field values hain — to ek document ek poori entity + iski related data SAATH rakhता hai, ek lookup mein padhा gaya BINA join ke.',
      'Har document ka ek `_id` hai — primary key: collection ke andar unique, hamesha indexed, insert ke baad immutable. Ise omit karo aur MongoDB ek ObjectId generate karta hai. Ek duplicate `_id` → `E11000 duplicate key error ... index: _id_`.',
      'Ek collection ka KOI fixed schema NAHI — do documents ki poori tarah alag fields aur types ho sakti hain. Ye flexibility genuine variation ke liye hai, modeling skip karne ka excuse NAHI (Module 14).',
      'BSON (Binary JSON) storage format hai: JSON ke types PLUS `ObjectId`, `Date` (ek real timestamp, string NAHI), distinct int32/int64/double, `Decimal128` (exact decimals — money ke liye istemal karo), `Binary`.',
      'JSON habits se aane waali common type mistakes: ek DATE ko string ke roop mein store karna — `Date` istemal karo. MONEY ko double ke roop mein store karna — `Decimal128` istemal karo. Module 8 ke "choosing column types" jaisा hi reasoning.',
      '`mongosh` (shell) vs ek DRIVER: mongosh auto-awaits aur ek cursor ke documents auto-prints; ek driver ko explicit `await` aur `.toArray()` chahiye. Query/update/operator syntax dono mein IDENTICAL hai.',
    ],
  },

  {
    slug: 'mongo-inserting-and-reading',
    title: 'Inserting & Reading Documents',
    titleHi: 'Documents Insert Aur Read Karna',
    description: 'insertOne and insertMany add documents; find returns a cursor over every match while findOne returns a single document; projection controls which fields come back; and cursor methods sort, limit, and skip the results.',
    descriptionHi: '`insertOne` aur `insertMany` documents add karте hain; `find` har match par ek cursor lautaता hai jabki `findOne` ek single document lautaता hai; projection control karता hai kaunse fields wapas aate hain; aur cursor methods results ko sort, limit, aur skip karте hain.',
    difficulty: 'EASY',
    duration: 22,
    order: 2,

    analogy: {
      en: '**A librarian who, asked for "books on databases," hands you a rolling cart to walk through the stacks yourself — versus one who fetches a single specific book.** `find` is the rolling cart: you describe what you want, and you get back a **cursor**, a movable pointer into the matching results that you pull documents from as you go, which is efficient even when the match is enormous because the library never has to pile every book on the desk at once. `findOne` is asking for one specific book: the librarian walks off and returns with exactly that book, or comes back empty-handed. **Projection** is telling the librarian "I only need the title and author, not the full text" — less to carry back. And **sort, limit, and skip** are instructions attached to the cart request: "newest first, just the first ten, and skip the ten I already saw."',
      hi: '**Ek librarian jo, "databases par books" maang par, aapको stacks ke through khud chalne ke liye ek rolling cart deता hai — versus ek jo ek single specific book fetch karta hai.** `find` rolling cart hai: aap describe karte ho kya chahiye, aur aapko ek **cursor** wapas milta hai, matching results mein ek movable pointer jisse aap chalte-chalte documents pull karте ho, jo enormous match par bhi efficient hai. `findOne` ek specific book maangna hai: librarian chala jaता hai aur theek wo book laता hai, ya khaali haath wapas aata hai. **Projection** librarian ko bataना hai "mujhe sirf title aur author chahiye, poora text nahi." Aur **sort, limit, skip** cart request ke saath attached instructions hain.',
    },

    simple: `**\`insertOne\` / \`insertMany\` add documents**

\`\`\`js
await db.users.insertOne({ _id: 1, name: "Ravi", age: 30 });
await db.users.insertMany([
  { _id: 2, name: "Amit", age: 25 },
  { _id: 3, name: "Sara", age: 35 },
]);
\`\`\`

**\`find(filter)\` returns a CURSOR over ALL matches; \`findOne(filter)\` returns ONE document (or \`null\`)**

\`\`\`js
await db.users.find({ age: { $gte: 30 } }).toArray();   // [ {Ravi...}, {Sara...} ]
await db.users.findOne({ name: "Amit" });               // { _id: 2, name: "Amit", age: 25 }
await db.users.findOne({ name: "Nobody" });             // null
await db.users.find({ name: "Nobody" }).toArray();      // []
\`\`\`

**PROJECTION: a second argument (or \`.project()\`) picks which fields come back**

\`\`\`js
await db.users.find({ age: { $gte: 30 } }).project({ _id: 0, name: 1, age: 1 }).toArray();
// [ { name: "Ravi", age: 30 }, { name: "Sara", age: 35 } ]
// { field: 1 } = include it; { field: 0 } = exclude it. _id is included
// by DEFAULT unless you explicitly set _id: 0. Don't mix 1s and 0s (except _id).
\`\`\`

**CURSOR METHODS: \`.sort()\`, \`.limit()\`, \`.skip()\` -- chained before materializing**

\`\`\`js
await db.users.find({}).project({ _id: 0 }).sort({ age: -1 }).limit(2).toArray();
// age -1 = descending; limit 2 = first two; (skip N = drop the first N)
\`\`\``,

    simpleHi: `**\`insertOne\` / \`insertMany\` documents add karте hain**

\`\`\`js
await db.users.insertOne({ _id: 1, name: "Ravi", age: 30 });
await db.users.insertMany([
  { _id: 2, name: "Amit", age: 25 },
  { _id: 3, name: "Sara", age: 35 },
]);
\`\`\`

**\`find(filter)\` SABHI matches par ek CURSOR lautaता hai; \`findOne(filter)\` EK document lautaता hai (ya \`null\`)**

\`\`\`js
await db.users.find({ age: { $gte: 30 } }).toArray();   // [ {Ravi...}, {Sara...} ]
await db.users.findOne({ name: "Amit" });               // { _id: 2, name: "Amit", age: 25 }
await db.users.findOne({ name: "Nobody" });             // null
await db.users.find({ name: "Nobody" }).toArray();      // []
\`\`\`

**PROJECTION: ek doosरा argument (ya \`.project()\`) chunта hai kaunse fields wapas aate hain**

\`\`\`js
await db.users.find({ age: { $gte: 30 } }).project({ _id: 0, name: 1, age: 1 }).toArray();
// { field: 1 } = include; { field: 0 } = exclude. _id DEFAULT se included hai
// jab tak aap explicitly _id: 0 set na karo. 1s aur 0s mix mat karo (_id chhodकर).
\`\`\`

**CURSOR METHODS: \`.sort()\`, \`.limit()\`, \`.skip()\` -- materialize karne se pehle chained**

\`\`\`js
await db.users.find({}).project({ _id: 0 }).sort({ age: -1 }).limit(2).toArray();
// age -1 = descending; limit 2 = pehle do; (skip N = pehle N drop karo)
\`\`\``,

    content: `## Inserting

\`\`\`js
await db.users.insertOne({ _id: 1, name: "Ravi", age: 30 });
await db.users.insertMany([
  { _id: 2, name: "Amit", age: 25 },
  { _id: 3, name: "Sara", age: 35 },
]);
\`\`\`

\`insertOne\` takes a single document; \`insertMany\` takes an array. Both return a result object reporting success — \`insertOne\` reports the \`insertedId\` (the \`_id\` of the new document, generated if you did not supply one), \`insertMany\` reports \`insertedCount\` and a map of inserted ids. If a document omits \`_id\`, MongoDB fills it in with an ObjectId before storing.

## Reading: \`find\` vs \`findOne\`

\`\`\`js
await db.users.find({ age: { $gte: 30 } }).toArray();
await db.users.findOne({ name: "Amit" });
\`\`\`

Both take a **filter document** — an object describing which documents to match (Lesson 3 covers the operator syntax in full; \`{ age: { $gte: 30 } }\` means "age greater than or equal to 30"). An empty filter \`{}\` matches everything.

- **\`find(filter)\`** returns a **cursor**: a lazy, forward-moving pointer over the matching documents. In a driver you call \`.toArray()\` to pull them all into memory as an array, or iterate the cursor to process them one batch at a time (important when the result set is large — a cursor never loads everything at once unless you ask it to). A filter matching nothing yields a cursor that produces an empty array.
- **\`findOne(filter)\`** returns a single document — the first one matching the filter — or \`null\` if nothing matches. It is a convenience for when you expect exactly one result (typically a lookup by \`_id\` or another unique field) and do not want to deal with a cursor.

## Projection: choosing fields

By default a query returns whole documents. A **projection** limits that to specific fields, reducing the data transferred and the memory used:

\`\`\`js
await db.users.find({ age: { $gte: 30 } }).project({ _id: 0, name: 1, age: 1 }).toArray();
\`\`\`

- \`{ field: 1 }\` — **include** this field (an "inclusion projection": only the listed fields, plus \`_id\`, come back).
- \`{ field: 0 }\` — **exclude** this field (an "exclusion projection": everything except the listed fields).
- You cannot mix \`1\` and \`0\` in the same projection, **except** for \`_id\`, which you can always explicitly set to \`0\` to drop it even in an inclusion projection. \`_id\` is the one field included by default.

The projection can also be passed as the second argument to \`find\` / \`findOne\` directly (\`db.users.findOne({ _id: 1 }, { projection: { name: 1 } })\`); \`.project()\` on the cursor is the equivalent fluent form.

## Cursor methods: \`sort\`, \`limit\`, \`skip\`

A cursor can be shaped before it is materialized:

\`\`\`js
await db.users.find({}).project({ _id: 0 }).sort({ age: -1 }).limit(2).toArray();
\`\`\`

- **\`.sort({ field: 1 })\`** orders results ascending; \`-1\` is descending. Multiple fields sort hierarchically, exactly like SQL's \`ORDER BY\`.
- **\`.limit(n)\`** caps the result at \`n\` documents.
- **\`.skip(n)\`** discards the first \`n\` matching documents before returning the rest.

These execute on the server, not after the fact in the client — \`.limit(2)\` genuinely fetches only two documents. The logical order MongoDB applies is filter, then sort, then skip, then limit, regardless of the order you chain the methods. (\`skip\` for pagination has the same performance caveat as SQL's \`OFFSET\` — a large \`skip\` still walks and discards every skipped document; Module 15's indexing lesson and real pagination use keyset-style cursors instead.)`,

    contentHi: `## Inserting

\`\`\`js
await db.users.insertOne({ _id: 1, name: "Ravi", age: 30 });
await db.users.insertMany([
  { _id: 2, name: "Amit", age: 25 },
  { _id: 3, name: "Sara", age: 35 },
]);
\`\`\`

\`insertOne\` ek single document leta hai; \`insertMany\` ek array leta hai. Dono success report karта ek result object lautाते hain. Agar ek document \`_id\` omit karta hai, MongoDB ise store karne se pehle ek ObjectId se bharता hai.

## Reading: \`find\` vs \`findOne\`

\`\`\`js
await db.users.find({ age: { $gte: 30 } }).toArray();
await db.users.findOne({ name: "Amit" });
\`\`\`

Dono ek **filter document** leते hain. Ek empty filter \`{}\` sab kuch match karता hai.

- **\`find(filter)\`** ek **cursor** lautaता hai: matching documents par ek lazy, forward-moving pointer. Ek driver mein aap \`.toArray()\` call karте ho.
- **\`findOne(filter)\`** ek single document lautaता hai — filter se match karti pehli — ya \`null\` agar kuch match nahi karता.

## Projection: fields chunना

\`\`\`js
await db.users.find({ age: { $gte: 30 } }).project({ _id: 0, name: 1, age: 1 }).toArray();
\`\`\`

- \`{ field: 1 }\` — is field ko **include** karo.
- \`{ field: 0 }\` — is field ko **exclude** karo.
- Aap ek hi projection mein \`1\` aur \`0\` mix nahi kar sakte, **siwaay** \`_id\` ke. \`_id\` wo ek field hai jo default se included hai.

## Cursor methods: \`sort\`, \`limit\`, \`skip\`

\`\`\`js
await db.users.find({}).project({ _id: 0 }).sort({ age: -1 }).limit(2).toArray();
\`\`\`

- **\`.sort({ field: 1 })\`** results ascending order karता hai; \`-1\` descending.
- **\`.limit(n)\`** result ko \`n\` documents par cap karता hai.
- **\`.skip(n)\`** pehle \`n\` matching documents discard karता hai.

Ye server par execute hote hain. Logical order: filter, phir sort, phir skip, phir limit. (Ek bada \`skip\` pagination ke liye SQL ke \`OFFSET\` jaisi performance caveat rakhता hai.)`,

    examples: [
      {
        title: 'insertMany, then find with a filter and an exclusion projection',
        titleHi: 'insertMany, phir ek filter aur ek exclusion projection ke saath find',
        code: `await db.users.insertMany([
  { _id: 1, name: "Ravi", age: 30, city: "Pune" },
  { _id: 2, name: "Amit", age: 25, city: "Mumbai" },
  { _id: 3, name: "Sara", age: 35, city: "Pune" },
]);
print(await db.users.find({ age: { $gte: 30 } }).project({ _id: 0, name: 1, age: 1 }).toArray());`,
        output: `[{"name":"Ravi","age":30},{"name":"Sara","age":35}]`,
        explain: '`insertMany` adds three users. The `find` filter `{ age: { $gte: 30 } }` selects Ravi (30) and Sara (35) but not Amit (25). The `.project({ _id: 0, name: 1, age: 1 })` is an inclusion projection with the one allowed `_id: 0`, so each result comes back with exactly `name` and `age` — no `_id`, no `city`.',
        explainHi: '`insertMany` teen users add karta hai. `find` filter `{ age: { $gte: 30 } }` Ravi (30) aur Sara (35) ko select karta hai par Amit (25) ko nahi. `.project({ _id: 0, name: 1, age: 1 })` allowed `_id: 0` ke saath ek inclusion projection hai, to har result theek `name` aur `age` ke saath wapas aata hai.',
      },
      {
        title: 'findOne returns one document; a non-matching find returns an empty array',
        titleHi: 'findOne ek document lautaता hai; ek non-matching find ek empty array lautaता hai',
        code: `await db.users.insertOne({ _id: 1, name: "Ravi", age: 30 });
print(await db.users.findOne({ name: "Nobody" }));
print(await db.users.find({ name: "Nobody" }).toArray());`,
        output: `null
[]`,
        explain: 'A filter matching nothing behaves differently depending on the method: `findOne` returns `null` (it hands back a single document or nothing), while `find(...).toArray()` returns `[]` (a cursor that produced zero documents materializes as an empty array).',
        explainHi: 'Kuch bhi match na karti ek filter method ke hisaab se alag behave karti hai: `findOne` `null` lautaता hai, jabki `find(...).toArray()` `[]` lautaता hai (ek cursor jisne zero documents produce kiye ek empty array ke roop mein materialize hota hai).',
      },
      {
        title: 'Cursor methods: sort descending, then limit',
        titleHi: 'Cursor methods: sort descending, phir limit',
        code: `await db.nums.insertMany([{ _id: 1, n: 3 }, { _id: 2, n: 1 }, { _id: 3, n: 5 }, { _id: 4, n: 2 }]);
print(await db.nums.find({}).project({ _id: 0 }).sort({ n: -1 }).limit(2).toArray());`,
        output: `[{"n":5},{"n":3}]`,
        explain: '`.sort({ n: -1 })` orders the four documents by `n` descending (5, 3, 2, 1), and `.limit(2)` keeps the first two of that ordering — so the result is `[{ n: 5 }, { n: 3 }]`. Both run on the server, so `.limit(2)` genuinely fetches only two documents; the logical order MongoDB applies is filter, then sort, then limit.',
        explainHi: '`.sort({ n: -1 })` chaar documents ko `n` descending order karta hai (5, 3, 2, 1), aur `.limit(2)` us ordering ke pehle do rakhta hai — to result `[{ n: 5 }, { n: 3 }]` hai. Dono server par chalte hain, to `.limit(2)` genuinely sirf do documents fetch karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// mixing inclusion (1) and exclusion (0) in one projection
await db.users.find({}).project({ name: 1, age: 0 }).toArray();
// ERROR: cannot have a mix of inclusion and exclusion (the ONLY exception is
// setting _id: 0 alongside inclusions)`,
        right: `// decide which style you want:
await db.users.find({}).project({ name: 1, age: 1 }).toArray();   // inclusion: only name, age (+ _id)
await db.users.find({}).project({ _id: 0, name: 1 }).toArray();   // inclusion + the one allowed _id:0
await db.users.find({}).project({ password: 0 }).toArray();       // exclusion: everything BUT password`,
        why: 'A MongoDB projection operates in one of two modes: an inclusion projection lists the fields to keep and drops everything else, and an exclusion projection lists the fields to remove and keeps everything else, and these two modes are mutually exclusive because a single projection cannot coherently mean both "only these fields" and "everything except these" at once. The one deliberate exception is `_id`, which is included by default in an inclusion projection and can be explicitly turned off with `_id: 0` without switching the projection into exclusion mode, since dropping the identifier is such a common need. Any other combination of a `1` and a `0` in the same projection document is rejected outright with an error, so the fix is always to commit to one mode: list what you want to keep, or list what you want to remove, but not both.',
        whyHi: 'Ek MongoDB projection do modes mein se ek mein operate karता hai: ek inclusion projection rakhne waale fields list karता hai aur baaki sab drop karता hai, aur ek exclusion projection hataने waale fields list karता hai aur baaki sab rakhता hai, aur ye do modes mutually exclusive hain. Ek deliberate exception `_id` hai, jo ek inclusion projection mein default se included hai aur `_id: 0` se explicitly band kiya ja sakta hai. Ek hi projection mein ek `1` aur ek `0` ka koi doosरा combination ek error ke saath reject hota hai.',
      },
      {
        wrong: `// calling .toArray() on a huge result set when you only need to process each doc
const all = await db.events.find({}).toArray();   // loads MILLIONS of docs into memory
for (const e of all) { process(e); }`,
        right: `// iterate the cursor -- it fetches in batches, holding only a batch at a time:
const cursor = db.events.find({});
for await (const e of cursor) { process(e); }
// or add .limit(n) if you genuinely only need the first n`,
        why: 'A cursor is a lazy pointer that fetches matching documents from the server in batches as they are consumed, which means iterating a cursor to process one document at a time holds only a single batch in memory regardless of how large the full result set is. Calling toArray on that cursor instead forces every matching document to be pulled into memory at once and assembled into a single array, which is fine for a small, bounded result but can exhaust the application\'s memory when the query matches millions of documents. The right approach depends on the need: use toArray when the result is known to be small, add a limit when only the first few matter, and iterate the cursor directly when every document must be processed but there is no reason to hold them all simultaneously.',
        whyHi: 'Ek cursor ek lazy pointer hai jo matching documents ko server se batches mein fetch karता hai jaise wo consume hote hain, jiska matlab hai ek cursor ko iterate karna prati-document process karne ke liye memory mein sirf ek single batch rakhता hai. Us cursor par `toArray` call karna iske bजाy har matching document ko ek saath memory mein pull karता hai. Sahi approach need par depend karti hai: `toArray` jab result chhota ho, `limit` jab sirf pehle кुछ matter karte hain, aur cursor ko directly iterate karo jab har document process hona chahiye.',
      },
      {
        wrong: `// paginating a large collection with a big .skip()
// "page 5000" of a feed:
await db.posts.find({}).sort({ createdAt: -1 }).skip(50000).limit(10).toArray();
// the server still walks and discards all 50,000 skipped documents first --
// pagination gets slower the deeper you go`,
        right: `// keyset ("seek") pagination: remember the last item's sort value and filter past it
const lastSeen = /* createdAt of the last post on the previous page */;
await db.posts.find({ createdAt: { $lt: lastSeen } }).sort({ createdAt: -1 }).limit(10).toArray();
// with an index on createdAt, this jumps straight to the right spot, at any depth`,
        why: 'The skip method discards a number of matching documents before returning the rest, but the server has to actually locate and step past every one of those skipped documents to do so, which means the work grows linearly with the skip value and a request for a deep page becomes progressively slower, exactly the OFFSET pagination problem from the relational side of this course. Keyset pagination avoids this by not skipping at all: instead of asking for "page N," the query remembers the sort-key value of the last document on the previous page and filters for documents beyond that value, so with an appropriate index the database can seek directly to the starting point and read forward, and the cost of fetching a page stays constant no matter how far into the collection it is. The trade-off is that keyset pagination only supports moving forward and backward through pages in order, not jumping to an arbitrary page number, which is usually an acceptable constraint for feeds and infinite-scroll interfaces.',
        whyHi: '`skip` method matching documents ki ek sankhya discard karता hai baaki lautाने se pehle, par server ko un skipped documents mein se har ek ko locate aur step past karна paता hai, jiska matlab hai kaam skip value ke saath linearly badhता hai. Keyset pagination bilkul skip na karके ise avoid karता hai: "page N" maangने ke bजाy, query pichhले page ke aakhri document ki sort-key value yaad rakhती hai aur us value se aage documents ke liye filter karती hai.',
      },
    ],

    realWorld: [
      {
        en: '**A user-lookup helper built entirely on `findOne({ _id: userId })`** — the single most common read in most applications, returning exactly one document or `null`.',
        hi: '**Ek user-lookup helper poori tarah `findOne({ _id: userId })` par bana** — zyadातार applications mein sabse common read.',
      },
      {
        en: '**An export job that iterates `db.records.find(query)` as a cursor rather than `.toArray()`-ing it**, so a 10-million-document export streams through constant memory instead of trying to load it all at once.',
        hi: '**Ek export job jo `db.records.find(query)` ko ek cursor ke roop mein iterate karta hai `.toArray()` karne ke bजाy**, taaki ek 10-million-document export constant memory ke through stream ho.',
      },
      {
        en: '**A feed API using keyset pagination — `find({ createdAt: { $lt: lastCursor } }).sort({ createdAt: -1 }).limit(20)`** — so page-load time stays flat whether the user is on page 2 or page 2000.',
        hi: '**Ek feed API jo keyset pagination istemal karta hai** — taaki page-load time flat rahe chahe user page 2 par ho ya page 2000 par.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between find and findOne, and what does find actually return?',
        qHi: '`find` aur `findOne` mein kya antar hai, aur `find` asal mein kya lautaता hai?',
        a: 'Both find and findOne take a filter document describing which documents to match, but they differ in what they hand back. findOne returns a single document, specifically the first one matching the filter, or null if nothing matches, and it is the natural choice when a query is expected to identify exactly one record, such as a lookup by _id or another unique field. find instead returns a cursor, which is a lazy, forward-moving pointer over all the matching documents rather than the documents themselves. In a driver, that cursor is typically consumed either by calling toArray to pull every match into an in-memory array, appropriate when the result set is known to be small, or by iterating the cursor directly, which fetches documents from the server in batches and holds only one batch at a time, which is what makes it safe to process a query that matches millions of documents without exhausting memory. A find whose filter matches nothing yields a cursor that produces an empty array, whereas the equivalent findOne yields null.',
        aHi: 'Dono `find` aur `findOne` ek filter document leते hain, par wo is baat mein alag hain ki wo kya wapas deте hain. `findOne` ek single document lautaता hai, specifically filter se match karti pehli, ya `null` agar kuch match nahi karता. `find` iske bजाy ek cursor lautaता hai, jo sabhi matching documents par ek lazy, forward-moving pointer hai. Ek driver mein, wo cursor typically ya to `toArray` call karके consume hota hai, ya cursor ko directly iterate karके, jo documents ko server se batches mein fetch karता hai.',
      },
      {
        q: 'How does projection work in MongoDB, and why can you not mix 1 and 0 (except for _id)?',
        qHi: 'MongoDB mein projection kaise kaam karta hai, aur aap `1` aur `0` mix kyun nahi kar sakte (`_id` chhodकर)?',
        a: 'A projection is a specification of which fields a query should return, and it operates in exactly one of two modes. An inclusion projection lists fields with a value of 1, meaning "return only these fields," and everything not listed is dropped. An exclusion projection lists fields with a value of 0, meaning "return everything except these fields." These modes are mutually exclusive because a projection document containing both a 1 and a 0 would be asking for two contradictory things at once, "only the fields I marked with 1" and simultaneously "everything except the fields I marked with 0," which have no coherent combined meaning, so MongoDB rejects such a projection with an error. The single exception is the _id field: it is returned by default even in an inclusion projection, and setting _id to 0 to suppress it is permitted alongside inclusions without flipping the whole projection into exclusion mode, because omitting the identifier while keeping a chosen set of other fields is such a common and unambiguous need.',
        aHi: 'Ek projection ek specification hai ki ek query ko kaunse fields lautाने chahiye, aur ye theek do modes mein se ek mein operate karता hai. Ek inclusion projection fields ko `1` value ke saath list karता hai, matlab "sirf ye fields lautaओ." Ek exclusion projection fields ko `0` value ke saath list karता hai, matlab "in fields ko chhodकर sab kuch lautaओ." Ye modes mutually exclusive hain. Ekmatra exception `_id` field hai: ye ek inclusion projection mein bhi default se lautाया jaता hai, aur `_id` ko `0` set karna inclusions ke saath permitted hai.',
      },
    ],

    exercises: [
      {
        task: 'Insert three `users` with `_id` 1-3, names, ages (25, 30, 35), and cities. Write a `find` for users with `age >= 30`, projecting away `_id` and `city` (keep only `name` and `age`). Confirm two documents come back with exactly two fields each.',
        taskHi: 'Teen `users` `_id` 1-3, names, ages (25, 30, 35), aur cities ke saath insert karo. `age >= 30` waale users ke liye ek `find` likho, `_id` aur `city` project away karte hue. Confirm karo do documents wapas aate hain har ek theek do fields ke saath.',
        hint: '`{ age: { $gte: 30 } }` is the filter; `.project({ _id: 0, name: 1, age: 1 })` is an inclusion projection with the allowed `_id: 0`.',
        hintHi: '`{ age: { $gte: 30 } }` filter hai; `.project({ _id: 0, name: 1, age: 1 })` allowed `_id: 0` ke saath ek inclusion projection hai.',
      },
      {
        task: 'Insert one user. Then call `findOne` with a filter matching nothing, and separately call `find(...).toArray()` with the same non-matching filter. Confirm the first returns `null` and the second returns `[]`.',
        taskHi: 'Ek user insert karo. Phir kुछ bhi match na karti ek filter ke saath `findOne` call karo, aur alag se usī non-matching filter ke saath `find(...).toArray()` call karo. Confirm karo pehla `null` lautaता hai aur doosरा `[]`.',
        hint: '`findOne` returns a single document or `null`; `find` returns a cursor, and `.toArray()` on a cursor with no matches gives an empty array.',
        hintHi: '`findOne` ek single document ya `null` lautaता hai; `find` ek cursor lautaता hai, aur bina matches waale ek cursor par `.toArray()` ek empty array deता hai.',
      },
      {
        task: 'Insert four documents with an `n` field of 3, 1, 5, 2. Write a query that sorts by `n` descending and limits to 2, projecting away `_id`. Confirm the result is `[{ n: 5 }, { n: 3 }]`.',
        taskHi: 'Ek `n` field 3, 1, 5, 2 ke saath chaar documents insert karo. Ek query likho jo `n` descending sort karti hai aur 2 tak limit karti hai, `_id` project away karte hue. Confirm karo result `[{ n: 5 }, { n: 3 }]` hai.',
        hint: '`.sort({ n: -1 })` for descending, `.limit(2)` for the first two. These run on the server — `.limit(2)` genuinely fetches only two documents.',
        hintHi: '`.sort({ n: -1 })` descending ke liye, `.limit(2)` pehle do ke liye. Ye server par chalते hain.',
      },
    ],

    keyTakeaways: [
      '`insertOne(doc)` / `insertMany([docs])` add documents; both return a result object (`insertedId` / `insertedCount`). A missing `_id` is filled with an ObjectId before storing.',
      '`find(filter)` returns a CURSOR — a lazy, forward-moving pointer over ALL matches. In a driver: `.toArray()` pulls them all into memory (fine when small), or iterate the cursor to process one batch at a time (safe for millions of matches). A non-matching `find` → `[]`.',
      '`findOne(filter)` returns a SINGLE document (the first match) or `null` — the convenience form for an expected-unique lookup (by `_id` or another unique field).',
      'PROJECTION picks fields: `{ field: 1 }` = INCLUSION (only listed fields + `_id`); `{ field: 0 }` = EXCLUSION (everything but listed fields). CANNOT mix `1` and `0` in one projection — the ONLY exception is `_id: 0` alongside inclusions. `_id` is the one field returned by default.',
      'CURSOR METHODS chain before materializing: `.sort({ f: 1 })` ascending / `-1` descending (hierarchical on multiple fields, like SQL `ORDER BY`); `.limit(n)` caps the result; `.skip(n)` drops the first n. They run ON THE SERVER — logical order is filter → sort → skip → limit regardless of chaining order.',
      'A large `.skip(n)` has the same problem as SQL `OFFSET` — the server walks and discards every skipped document, so deep pages get slower. Use KEYSET pagination instead: filter past the last-seen sort value (`{ createdAt: { $lt: lastSeen } }`), which seeks directly with an index at any depth.',
    ],
    keyTakeawaysHi: [
      '`insertOne(doc)` / `insertMany([docs])` documents add karте hain; dono ek result object lautाते hain. Ek missing `_id` store hone se pehle ek ObjectId se bhar jaता hai.',
      '`find(filter)` ek CURSOR lautaता hai — SABHI matches par ek lazy, forward-moving pointer. Ek driver mein: `.toArray()` unhe memory mein pull karता hai, ya cursor ko iterate karo prati-batch process karne ke liye. Ek non-matching `find` → `[]`.',
      '`findOne(filter)` ek SINGLE document (pehla match) ya `null` lautaता hai — ek expected-unique lookup ke liye convenience form.',
      'PROJECTION fields chunता hai: `{ field: 1 }` = INCLUSION; `{ field: 0 }` = EXCLUSION. Ek projection mein `1` aur `0` MIX NAHI kar sakte — ekmatra exception `_id: 0` inclusions ke saath.',
      'CURSOR METHODS materialize karne se pehle chain hote hain: `.sort({ f: 1 })` ascending / `-1` descending; `.limit(n)` result cap karता hai; `.skip(n)` pehle n drop karता hai. Ye SERVER PAR chalते hain — logical order filter → sort → skip → limit hai.',
      'Ek bada `.skip(n)` SQL `OFFSET` jaisi problem rakhता hai — server har skipped document walk aur discard karта hai. Iske bजाy KEYSET pagination istemal karo.',
    ],
  },

  {
    slug: 'mongo-query-operators',
    title: 'Query Operators',
    titleHi: 'Query Operators',
    description: 'A filter like `{ age: 30 }` matches an exact value. Query operators — `$gt`, `$in`, `$exists`, `$type`, `$regex`, and the logical `$or` / `$and` / `$not` — express everything more interesting, and dot notation reaches into nested fields.',
    descriptionHi: 'Ek filter jaisा `{ age: 30 }` ek exact value match karता hai. Query operators — `$gt`, `$in`, `$exists`, `$type`, `$regex`, aur logical `$or` / `$and` / `$not` — sab kuch zyada interesting express karте hain, aur dot notation nested fields tak pahunchता hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A search form with different kinds of input boxes, not just one "exact match" field.** The simplest search box takes a value and finds records equal to it — `{ status: "active" }`. But a real search form has a price *range* slider (`$gt`, `$lt`, `$gte`, `$lte`), a multi-select checklist where any selected option counts (`$in`), a "has a photo" toggle that only cares whether a field is present at all (`$exists`), a "text contains" box (`$regex`), and an "advanced" panel where you combine several conditions with AND / OR / NOT. Each operator is one kind of input on that form. And dot notation — `"address.city"` — is how you search inside a sub-form: the record\'s address is itself a little grouped set of fields, and \`"address.city"\` reaches straight into it.',
      hi: '**Ek search form jismein alag-alag tarah ke input boxes hain, sirf ek "exact match" field nahi.** Sabse simple search box ek value leta hai aur uske barабar records dhoondता hai — `{ status: "active" }`. Par ek real search form mein ek price *range* slider hai (`$gt`, `$lt`), ek multi-select checklist jahaan koi bhi selected option counts (`$in`), ek "has a photo" toggle jo sirf is baat ki parwाह karता hai ki ek field maujood hai ya nahi (`$exists`), ek "text contains" box (`$regex`), aur ek "advanced" panel jahaan aap AND / OR / NOT se кई conditions combine karते ho. Har operator us form par ek tarah ka input hai. Aur dot notation — `"address.city"` — ek sub-form ke andar search karne ka tarika hai.',
    },

    simple: `**A bare value is an equality match; an operator object is anything else**

\`\`\`js
{ age: 30 }                    // age EQUALS 30
{ age: { $gt: 30 } }           // age > 30      ($gte, $lt, $lte, $ne all work the same way)
{ age: { $gte: 25, $lt: 40 } } // 25 <= age < 40  (two operators on one field = AND)
\`\`\`

**\`$in\` / \`$nin\`: match any / none of a list**

\`\`\`js
{ status: { $in: ["active", "trial"] } }    // status is "active" OR "trial"
{ status: { $nin: ["banned", "deleted"] } } // status is NEITHER
\`\`\`

**\`$exists\` / \`$type\`: does the field exist at all / what BSON type is it**

\`\`\`js
{ deletedAt: { $exists: false } }   // documents with NO deletedAt field
{ nick: { $type: "string" } }       // nick exists AND is a string (not a number, not missing)
\`\`\`

**\`$regex\`: pattern match on a string field**

\`\`\`js
{ name: { $regex: /^rav/i } }   // name starts with "rav", case-insensitive
\`\`\`

**\`$or\` / \`$and\` / \`$not\`: combine conditions. Dot notation reaches into nested objects**

\`\`\`js
{ $or: [ { "address.city": "Pune" }, { age: { $gt: 35 } } ] }
// city is Pune  OR  age over 35   -- "address.city" reaches into the nested address object
\`\`\``,

    simpleHi: `**Ek bare value ek equality match hai; ek operator object aur kuch bhi hai**

\`\`\`js
{ age: 30 }                    // age 30 ke BARABAR
{ age: { $gt: 30 } }           // age > 30      ($gte, $lt, $lte, $ne sab same tarike se kaam karte hain)
{ age: { $gte: 25, $lt: 40 } } // 25 <= age < 40  (ek field par do operators = AND)
\`\`\`

**\`$in\` / \`$nin\`: ek list mein se koi bhi / koi nahi match karo**

\`\`\`js
{ status: { $in: ["active", "trial"] } }    // status "active" YA "trial" hai
{ status: { $nin: ["banned", "deleted"] } } // status DONO mein se KOI NAHI hai
\`\`\`

**\`$exists\` / \`$type\`: kya field bilkul exist karता hai / iska BSON type kya hai**

\`\`\`js
{ deletedAt: { $exists: false } }   // BINA deletedAt field waale documents
{ nick: { $type: "string" } }       // nick exist karता hai AUR ek string hai
\`\`\`

**\`$regex\`: ek string field par pattern match**

\`\`\`js
{ name: { $regex: /^rav/i } }   // name "rav" se shuru hota hai, case-insensitive
\`\`\`

**\`$or\` / \`$and\` / \`$not\`: conditions combine karo. Dot notation nested objects tak pahunchता hai**

\`\`\`js
{ $or: [ { "address.city": "Pune" }, { age: { $gt: 35 } } ] }
\`\`\``,

    content: `## Equality vs operators

A filter maps field names to conditions. The simplest condition is a **bare value**, which means "equals":

\`\`\`js
{ status: "active" }   // status equals "active"
\`\`\`

Anything more expressive replaces the bare value with an **operator object** — an object whose keys start with \`$\`:

\`\`\`js
{ age: { $gt: 30 } }
\`\`\`

## Comparison operators

- \`$eq\` (equals — the same as a bare value), \`$ne\` (not equal)
- \`$gt\` (greater than), \`$gte\` (greater than or equal), \`$lt\` (less than), \`$lte\` (less than or equal)

Multiple operators on the same field combine with AND: \`{ age: { $gte: 25, $lt: 40 } }\` means \`25 <= age < 40\`.

## Membership: \`$in\` and \`$nin\`

\`\`\`js
{ status: { $in: ["active", "trial"] } }
{ status: { $nin: ["banned", "deleted"] } }
\`\`\`

\`$in\` matches if the field equals **any** value in the array; \`$nin\` matches if it equals **none** of them. \`$in\` is the idiomatic way to express "one of these several values" — far cleaner than a chain of \`$or\` equality conditions.

## \`$exists\` and \`$type\`

Because a collection has no schema, "does this document even have this field" is a real question:

\`\`\`js
{ deletedAt: { $exists: false } }   // documents missing the deletedAt field entirely
{ deletedAt: { $exists: true } }    // documents that have it (regardless of value, including null)
\`\`\`

\`$type\` goes further, matching on the field's actual BSON type — \`{ nick: { $type: "string" } }\` matches documents where \`nick\` is present *and* is a string, excluding both documents missing the field and documents where \`nick\` holds a number. This is genuinely useful in a schema-flexible collection where a field's type might vary and you want only the well-formed ones.

## \`$regex\`

\`\`\`js
{ name: { $regex: /^rav/i } }
\`\`\`

Matches a string field against a regular expression. An anchored prefix pattern like \`/^rav/\` can use an index on that field (Module 15); an unanchored pattern like \`/rav/\` (matching anywhere in the string) generally cannot and scans every document, the same caveat as \`LIKE '%...%'\` in SQL.

## Logical operators and dot notation

Top-level conditions in a filter are implicitly ANDed together. \`$or\`, \`$and\`, and \`$not\` make other combinations explicit:

\`\`\`js
{ $or: [ { "address.city": "Pune" }, { age: { $gt: 35 } } ] }
\`\`\`

\`$or\` takes an array of conditions and matches if **any** holds. \`$and\` (rarely needed explicitly, since top-level fields already AND) takes an array where **all** must hold — its main use is combining two conditions on the *same* field that cannot both fit in one operator object. \`$not\` inverts a single operator expression.

**Dot notation** — a field name like \`"address.city"\` — reaches into a nested object: it matches documents where the \`address\` sub-object has a \`city\` field equal to the value. The same syntax reaches into arrays by position (\`"tags.0"\` is the first tag) and, combined with array query operators (Lesson 5), into arrays of sub-documents. The field name must be quoted because it contains a dot.`,

    contentHi: `## Equality vs operators

Ek filter field names ko conditions se map karता hai. Sabse simple condition ek **bare value** hai, jiska matlab "equals":

\`\`\`js
{ status: "active" }   // status "active" ke barabar
\`\`\`

Kuch bhi zyada expressive bare value ko ek **operator object** se replace karता hai:

\`\`\`js
{ age: { $gt: 30 } }
\`\`\`

## Comparison operators

- \`$eq\` (equals), \`$ne\` (not equal)
- \`$gt\`, \`$gte\`, \`$lt\`, \`$lte\`

Usī field par кई operators AND se combine hote hain: \`{ age: { $gte: 25, $lt: 40 } }\` matlab \`25 <= age < 40\`.

## Membership: \`$in\` aur \`$nin\`

\`\`\`js
{ status: { $in: ["active", "trial"] } }
{ status: { $nin: ["banned", "deleted"] } }
\`\`\`

\`$in\` match karता hai agar field array mein **koi bhi** value ke barabar hai; \`$nin\` match karता hai agar wo **koi nahi** ke barabar hai.

## \`$exists\` aur \`$type\`

\`\`\`js
{ deletedAt: { $exists: false } }   // deletedAt field poori tarah missing waale documents
{ deletedAt: { $exists: true } }    // jinke paas ye hai
\`\`\`

\`$type\` aage jaता hai, field ke actual BSON type par match karता hua — \`{ nick: { $type: "string" } }\` un documents ko match karता hai jahaan \`nick\` maujood hai *aur* ek string hai.

## \`$regex\`

\`\`\`js
{ name: { $regex: /^rav/i } }
\`\`\`

Ek anchored prefix pattern jaisा \`/^rav/\` us field par ek index istemal kar sakta hai (Module 15); ek unanchored pattern jaisा \`/rav/\` generally nahi kar sakta.

## Logical operators aur dot notation

\`\`\`js
{ $or: [ { "address.city": "Pune" }, { age: { $gt: 35 } } ] }
\`\`\`

\`$or\` conditions ka ek array leta hai aur match karता hai agar **koi bhi** hold karता hai. \`$and\` ka main use *usī* field par do conditions combine karна hai. \`$not\` ek single operator expression ko invert karता hai.

**Dot notation** — ek field name jaisा \`"address.city"\` — ek nested object tak pahunchता hai. Field name quoted hona chahiye kyunki ismein ek dot hai.`,

    examples: [
      {
        title: 'Comparison and $in — age at least 30 OR a matching status',
        titleHi: 'Comparison aur $in — age kam se kam 30 YA ek matching status',
        code: `await db.users.insertMany([
  { _id: 1, name: "Ravi", age: 30, status: "active" },
  { _id: 2, name: "Amit", age: 25, status: "trial" },
  { _id: 3, name: "Sara", age: 22, status: "banned" },
]);
print(await db.users.find({ status: { $in: ["active", "trial"] } }).project({ _id: 1 }).toArray());`,
        output: `[{"_id":1},{"_id":2}]`,
        explain: '`{ status: { $in: ["active", "trial"] } }` matches a document if its `status` equals ANY value in the array — Ravi (`active`) and Amit (`trial`) match, Sara (`banned`) does not. `$in` is the idiomatic way to express "one of these several values", far cleaner than a chain of `$or` equality conditions.',
        explainHi: '`{ status: { $in: ["active", "trial"] } }` ek document ko match karta hai agar iska `status` array mein KISI BHI value ke barabar hai — Ravi (`active`) aur Amit (`trial`) match karte hain, Sara (`banned`) nahi. `$in` "in mein se ek value" express karne ka idiomatic tarika hai.',
      },
      {
        title: '$exists and $type — find documents where a field is present and is a string',
        titleHi: '$exists aur $type — un documents ko dhoondो jahaan ek field maujood hai aur ek string hai',
        code: `await db.users.insertMany([
  { _id: 1, name: "a", nick: "x" },
  { _id: 2, name: "b" },
  { _id: 3, name: "c", nick: 5 },
]);
print(await db.users.find({ nick: { $exists: true } }).project({ _id: 1 }).toArray());
print(await db.users.find({ nick: { $type: "string" } }).project({ _id: 1 }).toArray());`,
        output: `[{"_id":1},{"_id":3}]
[{"_id":1}]`,
        explain: '`$exists: true` matches documents that HAVE a `nick` field regardless of its value — ids 1 (`"x"`) and 3 (`5`), but not id 2 (missing). `$type: "string"` is stricter: it requires the field to be present AND hold a value of that BSON type — only id 1 (`"x"`) qualifies; id 3\'s `nick` is a number.',
        explainHi: '`$exists: true` un documents ko match karta hai jinके paas ek `nick` field HAI iski value se regardless — ids 1 (`"x"`) aur 3 (`5`), par id 2 (missing) nahi. `$type: "string"` stricter hai: ye field ko maujood hone AUR us BSON type ki ek value rakhne ki zaroorat karta hai — sirf id 1 qualify karta hai.',
      },
      {
        title: '$or combined with dot notation into a nested object',
        titleHi: '$or ek nested object mein dot notation ke saath combined',
        code: `await db.users.insertMany([
  { _id: 1, addr: { city: "Pune" }, age: 20 },
  { _id: 2, addr: { city: "Mumbai" }, age: 40 },
]);
print(await db.users.find({ $or: [{ "addr.city": "Pune" }, { age: { $gt: 35 } }] }).project({ _id: 1 }).toArray());`,
        output: `[{"_id":1},{"_id":2}]`,
        explain: '`$or` takes an array of conditions and matches a document if ANY holds. Here id 1\'s `addr.city` is `"Pune"` (first condition, via dot notation into the nested `addr` object), and id 2\'s `age` is 40, which is `> 35` (second condition) — so both documents come back.',
        explainHi: '`$or` conditions ka ek array leta hai aur ek document ko match karta hai agar KOI hold karta hai. Yahaan id 1 ka `addr.city` `"Pune"` hai (pehli condition, nested `addr` object mein dot notation ke through), aur id 2 ka `age` 40 hai, jo `> 35` hai (doosri condition) — to dono documents wapas aate hain.',
      },
    ],

    mistakes: [
      {
        wrong: `// expecting { field: { $ne: value } } to also match documents MISSING the field
await db.users.find({ status: { $ne: "banned" } }).toArray();
// this DOES match documents with no "status" field at all -- a missing field
// is "not equal to banned" -- which may or may not be what you wanted`,
        right: `// if you want only documents that HAVE a status and it's not "banned":
await db.users.find({ status: { $exists: true, $ne: "banned" } }).toArray();
// $ne alone: "status is anything other than banned, INCLUDING absent"
// $exists: true + $ne: "status is present AND is not banned"`,
        why: 'MongoDB treats a missing field as having no value, and the comparison operators evaluate a missing field against their argument as if comparing "nothing" to that value, so a $ne condition is satisfied by a document that lacks the field entirely, since "nothing" is indeed not equal to "banned." Whether that is the intended behavior depends on the query: sometimes "everyone who is not explicitly banned, including those with no status set" is exactly right, and sometimes the intent is specifically "documents that have a status field whose value is not banned," which excludes the ones missing the field. The two are distinguished by adding $exists true alongside $ne when the field must be present, and being aware of this distinction avoids a class of bug where a $ne filter silently includes documents that were never meant to be in scope.',
        whyHi: 'MongoDB ek missing field ko koi value na hone ke roop mein treat karता hai, aur comparison operators ek missing field ko unke argument ke against aise evaluate karते hain jaise "kuch nahi" ko us value se compare kar rahe hon, to ek `$ne` condition ek aisе document se satisfy hota hai jismein field bilkul nahi hai. Kya wo intended behavior hai query par depend karता hai. Dono ko `$ne` ke saath `$exists: true` add karके distinguish kiya jaता hai.',
      },
      {
        wrong: `// using $or where the top-level implicit AND was what you wanted
await db.users.find({ $or: [{ age: { $gte: 18 } }, { verified: true }] }).toArray();
// "18-or-older OR verified" -- but you may have meant "18-or-older AND verified"`,
        right: `// top-level fields are ANDed automatically -- no $and needed:
await db.users.find({ age: { $gte: 18 }, verified: true }).toArray();
// "age >= 18 AND verified === true" -- both must hold`,
        why: 'A MongoDB filter document with multiple top-level fields matches only documents that satisfy every one of those conditions, an implicit AND, so writing two conditions as separate keys in the filter object already means "both must hold" without any explicit operator. Reaching for $or wraps those conditions in an explicit OR instead, which is a fundamentally different query that matches a document satisfying just one of the conditions, and using it where a plain multi-field filter was intended silently broadens the result set. $or is needed only when the requirement genuinely is disjunctive, and $and is needed only in the narrower case of combining two conditions that both apply to the same field and cannot be expressed together in a single operator object, since otherwise the implicit top-level AND already covers it.',
        whyHi: 'Ek MongoDB filter document jismein кई top-level fields hain sirf un documents ko match karता hai jo un sabhi conditions ko satisfy karते hain, ek implicit AND. `$or` ke liye reach karna un conditions ko ek explicit OR mein wrap karता hai, jo ek fundamentally alag query hai jo sirf ek condition ko satisfy karti document ko match karती hai. `$or` sirf tab chahiye jab requirement genuinely disjunctive ho.',
      },
      {
        wrong: `// an unanchored $regex on a large collection, expecting it to be fast
await db.products.find({ name: { $regex: /wireless/i } }).toArray();
// matches "wireless" ANYWHERE in the name -- cannot use an index on "name",
// so it scans every document, exactly like SQL's LIKE '%wireless%'`,
        right: `// anchored prefix regex CAN use an index on "name":
await db.products.find({ name: { $regex: /^wireless/i } }).toArray();
// or, for real "search anywhere in text" needs, use a text index (Module 15) --
// MongoDB's equivalent of PostgreSQL full-text search`,
        why: 'A regular expression anchored to the start of the string, like one beginning with a caret, constrains the matching values to a contiguous range in sorted order, which is exactly the shape an index can narrow efficiently, so an anchored prefix regex on an indexed field can use that index. An unanchored regex, one that can match its pattern anywhere within the string, places no such constraint on where matching values fall in sort order, so the database has no way to use an ordinary index to skip non-matching documents and must examine every document in the collection, the same fundamental limitation as a leading-wildcard LIKE pattern in SQL. When the actual requirement is to search for a term appearing anywhere in a text field, the right tool is a dedicated text index, which is MongoDB\'s built-in full-text search facility and is covered in Module 15.',
        whyHi: 'Ek regular expression jo string ki shuruaat se anchored hai matching values ko sorted order mein ek contiguous range tak constrain karता hai, jo theek wo shape hai jise ek index efficiently narrow kar sakta hai. Ek unanchored regex aisा koi constraint nahi rakhता, to database ko har document examine karна paता hai. Jab actual requirement ek text field mein kahin bhi ek term dhoondне ki ho, sahi tool ek dedicated text index hai (Module 15).',
      },
    ],

    realWorld: [
      {
        en: '**A "soft delete" pattern where every read filter includes `{ deletedAt: { $exists: false } }`** — deleted documents keep a `deletedAt` timestamp and are excluded from normal queries without being removed.',
        hi: '**Ek "soft delete" pattern jahaan har read filter mein `{ deletedAt: { $exists: false } }` shamil hai** — deleted documents ek `deletedAt` timestamp rakhते hain aur normal queries se excluded hain.',
      },
      {
        en: '**A dashboard filter built from `$in` arrays** — a multi-select "status" control maps directly to `{ status: { $in: [...selected] } }`, one clause regardless of how many options are checked.',
        hi: '**Ek dashboard filter `$in` arrays se bana** — ek multi-select "status" control seedhे `{ status: { $in: [...selected] } }` par map karता hai.',
      },
      {
        en: '**A data-quality audit using `$type`** to find documents in a legacy collection where a field that should be a number was stored as a string, before a cleanup migration.',
        hi: '**Ek data-quality audit `$type` istemal karके** ek legacy collection mein wo documents dhoondне ke liye jahaan ek field jo number hona chahiye string ke roop mein store hua.',
      },
    ],

    interviewQA: [
      {
        q: 'How are multiple conditions combined in a MongoDB filter, and when do you actually need $and or $or?',
        qHi: 'Ek MongoDB filter mein кई conditions kaise combine hoती hain, aur aapको asal mein `$and` ya `$or` kab chahiye?',
        a: 'When a filter document lists several fields at the top level, MongoDB requires a matching document to satisfy every one of those conditions, so multiple top-level fields are combined with an implicit AND and no explicit operator is needed for the common case of "all of these must hold." The $or operator is needed when the requirement is genuinely disjunctive, meaning a document should match if it satisfies at least one of several alternative conditions; it takes an array of condition objects and matches a document that satisfies any of them. The $and operator is needed only in a narrower situation: when two conditions both apply to the same field and cannot be expressed together within a single operator object, such as combining two separate regular-expression matches on one field, since in every other case the implicit top-level AND already provides the conjunction. Reaching for $or where a plain multi-field filter was intended silently broadens the result set, because it turns a "both" requirement into an "either" one.',
        aHi: 'Jab ek filter document top level par кई fields list karता hai, MongoDB ek matching document ko un sabhi conditions ko satisfy karna zaroori karता hai, to кई top-level fields ek implicit AND se combine hote hain. `$or` operator tab chahiye jab requirement genuinely disjunctive ho. `$and` operator sirf ek narrower situation mein chahiye: jab do conditions dono usī field par apply hoती hain aur ek single operator object mein saath express nahi ho sakti.',
      },
      {
        q: 'Why does { field: { $ne: value } } also match documents that are missing the field, and how do you exclude those?',
        qHi: '`{ field: { $ne: value } }` un documents ko bhi kyun match karता hai jinme field missing hai, aur aap unhe kaise exclude karते ho?',
        a: 'MongoDB treats a document that lacks a field as having no value for it, and when a comparison operator like $ne evaluates such a document, it compares that absence against the operator\'s argument. Since an absent value is not equal to any concrete value, a $ne condition is considered satisfied by a document that is missing the field entirely, so a filter meant to find "documents whose status is not banned" will also return documents that have no status field at all. Whether this is desired depends on the query\'s intent: sometimes including the field-less documents is correct, and sometimes the intent is specifically documents that have the field and whose value is not the excluded one. To restrict the match to documents that actually possess the field, you add an $exists: true condition on that same field alongside the $ne, which requires the field to be present and its value to not equal the excluded value.',
        aHi: 'MongoDB ek aisе document ko jismein ek field nahi hai us field ke liye koi value na hone ke roop mein treat karता hai, aur jab `$ne` jaisा ek comparison operator aisе document ko evaluate karता hai, ye us absence ko operator ke argument ke against compare karता hai. Kyunki ek absent value kisī bhi concrete value ke barabar nahi hai, ek `$ne` condition ek aisе document se satisfy maani jaती hai jismein field bilkul nahi hai. Match ko un documents tak restrict karne ke liye jinke paas field hai, aap usī field par ek `$exists: true` condition add karते ho.',
      },
    ],

    exercises: [
      {
        task: 'Insert three `users` with a `status` field of `"active"`, `"trial"`, `"banned"`. Write a query using `$in` to return the `_id`s of users whose status is `"active"` or `"trial"`. Confirm two ids come back.',
        taskHi: 'Teen `users` ek `status` field `"active"`, `"trial"`, `"banned"` ke saath insert karo. `$in` istemal karके ek query likho jo un users ke `_id`s lautाती hai jinka status `"active"` ya `"trial"` hai.',
        hint: '`{ status: { $in: ["active", "trial"] } }` — cleaner than `$or` of two equality conditions, and it is the idiomatic way to express "one of these values".',
        hintHi: '`{ status: { $in: ["active", "trial"] } }` — do equality conditions ke `$or` se saaf.',
      },
      {
        task: 'Insert three `users`: one with `nick: "x"` (string), one with no `nick` field, one with `nick: 5` (number). Write one query with `$exists: true` (expect ids 1 and 3) and one with `$type: "string"` (expect only id 1).',
        taskHi: 'Teen `users` insert karo: ek `nick: "x"` ke saath, ek bina `nick` field, ek `nick: 5` ke saath. `$exists: true` ke saath ek query likho (ids 1 aur 3 expect karo) aur `$type: "string"` ke saath ek (sirf id 1 expect karo).',
        hint: '`$exists` only cares whether the field is present at all (any type, including null). `$type` additionally requires the field to hold a value of the named BSON type.',
        hintHi: '`$exists` sirf is baat ki parwाह karता hai ki field maujood hai ya nahi. `$type` additionally field ko named BSON type ki ek value rakhne ki zaroorat karता hai.',
      },
      {
        task: 'Insert two `users`: `{ _id: 1, addr: { city: "Pune" }, age: 20 }` and `{ _id: 2, addr: { city: "Mumbai" }, age: 40 }`. Write a `$or` query matching documents where `addr.city` is `"Pune"` OR `age` is over 35. Confirm both ids come back.',
        taskHi: 'Do `users` insert karo: `{ _id: 1, addr: { city: "Pune" }, age: 20 }` aur `{ _id: 2, addr: { city: "Mumbai" }, age: 40 }`. Ek `$or` query likho jo un documents ko match karti hai jahaan `addr.city` `"Pune"` hai YA `age` 35 se zyada hai.',
        hint: 'Dot notation `"addr.city"` reaches into the nested `addr` object — the field name must be quoted because it contains a dot. `$or` takes an array of conditions and matches if any holds.',
        hintHi: 'Dot notation `"addr.city"` nested `addr` object tak pahunchता hai — field name quoted hona chahiye. `$or` conditions ka ek array leta hai.',
      },
    ],

    keyTakeaways: [
      'A BARE VALUE in a filter is an EQUALITY match (`{ age: 30 }`). Anything else is an OPERATOR OBJECT — keys starting with `$`. Multiple operators on ONE field combine with AND (`{ age: { $gte: 25, $lt: 40 } }`).',
      'COMPARISON: `$eq`/`$ne`, `$gt`/`$gte`/`$lt`/`$lte`. MEMBERSHIP: `$in` (equals ANY of a list — the idiomatic "one of these values", cleaner than chained `$or`), `$nin` (equals NONE).',
      '`$exists: true`/`false` — does the field exist AT ALL (any type, including null). `$type: "string"` — field is present AND holds that BSON type. Both matter in a schema-flexible collection.',
      '`$regex`: an ANCHORED prefix pattern (`/^rav/`) CAN use an index; an UNANCHORED pattern (`/rav/`, matches anywhere) canNOT and scans every document — same caveat as SQL `LIKE \'%...%\'`. For real "search anywhere in text", use a text index (Module 15).',
      'Top-level filter fields are ANDed IMPLICITLY — no `$and` needed for "all of these must hold". `$or` takes an array, matches if ANY holds (a genuinely different query — using it where implicit AND was meant silently broadens results). `$and` is only for combining two conditions on the SAME field that don\'t fit one operator object.',
      'GOTCHA: `{ field: { $ne: value } }` ALSO matches documents MISSING the field (absent ≠ value). Add `$exists: true` alongside `$ne` when the field must be present.',
      'DOT NOTATION: `"address.city"` (quoted — contains a dot) reaches into a nested object. `"tags.0"` reaches an array element by position. Combined with array operators (Lesson 5), it reaches into arrays of sub-documents.',
    ],
    keyTakeawaysHi: [
      'Ek filter mein ek BARE VALUE ek EQUALITY match hai (`{ age: 30 }`). Aur kuch bhi ek OPERATOR OBJECT hai — `$` se shuru hoti keys. Ek field par кई operators AND se combine hote hain.',
      'COMPARISON: `$eq`/`$ne`, `$gt`/`$gte`/`$lt`/`$lte`. MEMBERSHIP: `$in` (ek list mein se KISI BHI ke barabar — idiomatic "in mein se ek value"), `$nin` (KOI NAHI ke barabar).',
      '`$exists: true`/`false` — kya field BILKUL exist karता hai. `$type: "string"` — field maujood hai AUR wo BSON type rakhता hai.',
      '`$regex`: ek ANCHORED prefix pattern (`/^rav/`) ek index istemal KAR sakta hai; ek UNANCHORED pattern (`/rav/`) NAHI kar sakta aur har document scan karता hai. Real "text mein kahin bhi search" ke liye, ek text index istemal karo (Module 15).',
      'Top-level filter fields IMPLICITLY AND hote hain. `$or` ek array leta hai, match karता hai agar KOI hold karता hai. `$and` sirf USI field par do conditions combine karne ke liye hai.',
      'GOTCHA: `{ field: { $ne: value } }` un documents ko BHI match karता hai jinme field MISSING hai. `$ne` ke saath `$exists: true` add karo jab field maujood hona chahiye.',
      'DOT NOTATION: `"address.city"` (quoted) ek nested object tak pahunchता hai. `"tags.0"` position se ek array element tak.',
    ],
  },
];
