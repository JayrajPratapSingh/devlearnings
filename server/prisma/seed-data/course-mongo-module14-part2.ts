/**
 * Databases Complete Course — Module 14: MongoDB Data Modeling, lessons 4-6.
 *
 * Lesson 4: The query-shaped patterns — computed, subset, bucket, and attribute:
 *           shaping the document so the queries it serves are cheap.
 * Lesson 5: The structural patterns — polymorphic, schema versioning, and trees.
 * Lesson 6: Denormalization & keeping copies in sync — the dual-write cost,
 *           eventual consistency, when staleness is acceptable, and the anti-patterns.
 *
 * Verified against a real in-memory MongoDB (mongodb-memory-server).
 * Run: node verify-mongo.mjs 14
 */

import type { CourseLesson } from './course-js-module1';

export const MONGO_MODULE_14_PART2: CourseLesson[] = [
  {
    slug: 'mongo-query-shaped-patterns',
    title: 'The Query-Shaped Patterns',
    titleHi: 'Query-Shaped Patterns',
    description: 'Computed, subset, bucket, and attribute — four patterns that all do the same thing: reshape the document so the read your application performs most is a single cheap lookup, moving work to write time where it happens once.',
    descriptionHi: 'Computed, subset, bucket, aur attribute — chaar patterns jo sab wahi cheez karते hain: document ko reshape karो taaki wo read jo aapका application sabse zyada perform karता hai ek single sasta lookup ho, kaam ko write time par move karते hue jahaan ye ek baar hota hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A shop that keeps a running till total on a sticky note, sells "assorted boxes" pre-packed, groups the day\'s receipts into one envelope per hour, and files oddly-shaped custom orders on a single flexible index card each.** The running total on the note (computed) means answering "how much today?" is a glance, not re-adding every receipt. The pre-packed assorted box (subset) means a customer wanting "a bit of everything" grabs one item, and the full inventory stays in the back. One envelope per hour (bucket) means the shoebox of receipts holds twelve envelopes, not four thousand loose slips. And the flexible index card (attribute) means a custom order with three unusual measurements fits on one card the same filing system already handles, rather than needing a new drawer per measurement type. Every one of these does work *once*, up front, so the common lookup later is trivial.',
      hi: '**Ek shop jo ek sticky note par ek running till total rakhती hai, "assorted boxes" pre-packed bechती hai, din ki receipts ko prati-ghanta ek envelope mein group karती hai, aur oddly-shaped custom orders ko har ek ek single flexible index card par file karती hai.** Note par running total (computed) matlab "aaj kitna?" ka jawab ek glance hai, har receipt dobara add karna nahi. Pre-packed assorted box (subset) matlab "sab kुछ thoда" chाहने waala customer ek item uthाता hai. Prati-ghanta ek envelope (bucket) matlab receipts ka shoebox baarah envelopes rakhता hai, chaar hazar loose slips nahi. Aur flexible index card (attribute) matlab teen unusual measurements waala ek custom order ek card par fit hota hai. In sabme se har ek kaam *ek baar*, up front, karता hai.',
    },

    simple: `**COMPUTED: store the result, not the inputs. Update it on write; read it in O(1).**

\`\`\`js
// don't sum every transaction on every balance read -- keep a running balance:
await db.accounts.updateOne({ _id: 1 }, { $inc: { balance: 100 } });
await db.accounts.updateOne({ _id: 1 }, { $inc: { balance: -30 } });
await db.accounts.findOne({ _id: 1 });   // { balance: 70 } -- one lookup, no aggregation
\`\`\`

**SUBSET: embed the first/recent N, reference the rest**

\`\`\`js
{ _id: 1, name: "Widget",
  recentReviews: [ {u:"a",stars:5}, {u:"b",stars:4} ],   // last 2, embedded
  reviewCount: 87 }                                        // computed
// all 87 reviews live in a "reviews" collection; the product page shows 2 + a count
\`\`\`

**BUCKET: one document holds an ARRAY of many small items + a count (time-series, logs)**

\`\`\`js
// NOT one doc per reading. One doc per (sensor, hour):
{ sensorId: "A", hour: "2026-01-01T00", count: 3,
  readings: [ {t:0,v:20}, {t:20,v:21}, {t:40,v:19} ] }
// 60 readings/hour -> 1 doc/hour instead of 60 docs; bounded, so safe to embed
\`\`\`

**ATTRIBUTE: many optional/sparse fields -> ONE array of \`{ k, v }\`, ONE compound index**

\`\`\`js
{ _id: 1, name: "Laptop", specs: [ {k:"ram",v:"16GB"}, {k:"cpu",v:"i7"} ] }
// createIndex({ "specs.k": 1, "specs.v": 1 }) -- one index serves ANY spec query:
db.products.find({ specs: { $elemMatch: { k: "ram", v: "16GB" } } })
\`\`\``,

    simpleHi: `**COMPUTED: result store karो, inputs nahi. Write par update karो; O(1) mein read karो.**

\`\`\`js
await db.accounts.updateOne({ _id: 1 }, { $inc: { balance: 100 } });
await db.accounts.updateOne({ _id: 1 }, { $inc: { balance: -30 } });
await db.accounts.findOne({ _id: 1 });   // { balance: 70 } -- ek lookup, koi aggregation nahi
\`\`\`

**SUBSET: pehle/recent N embed karो, baaki reference karो**

\`\`\`js
{ _id: 1, name: "Widget",
  recentReviews: [ {u:"a",stars:5}, {u:"b",stars:4} ],   // last 2, embedded
  reviewCount: 87 }                                        // computed
\`\`\`

**BUCKET: ek document кई chhote items ka ARRAY + ek count rakhता hai (time-series, logs)**

\`\`\`js
{ sensorId: "A", hour: "2026-01-01T00", count: 3,
  readings: [ {t:0,v:20}, {t:20,v:21}, {t:40,v:19} ] }
// 60 readings/ghanta -> 1 doc/ghanta 60 docs ke bजाy; bounded, to embed karna safe
\`\`\`

**ATTRIBUTE: кई optional/sparse fields -> EK array of \`{ k, v }\`, EK compound index**

\`\`\`js
{ _id: 1, name: "Laptop", specs: [ {k:"ram",v:"16GB"}, {k:"cpu",v:"i7"} ] }
// createIndex({ "specs.k": 1, "specs.v": 1 }) -- ek index KISI BHI spec query serve karता hai:
db.products.find({ specs: { $elemMatch: { k: "ram", v: "16GB" } } })
\`\`\``,

    content: `## The shared idea

These four patterns are all applications of one principle from the relational world too (Module 7's denormalization lesson): **when a read is common and expensive, do the work once at write time and store the result, so the read is cheap.** Each pattern applies that idea to a different shape of problem.

## Computed

Instead of storing every input and recomputing an aggregate on every read, store the aggregate and maintain it as the inputs change:

\`\`\`js
await db.accounts.updateOne({ _id: 1 }, { $inc: { balance: 100 } });
await db.accounts.updateOne({ _id: 1 }, { $inc: { balance: -30 } });
await db.accounts.findOne({ _id: 1 });   // { balance: 70 }
\`\`\`

Reading the balance is a single field access, not a scan-and-sum of a transaction history. The same applies to a post's \`commentCount\`, a video's \`viewCount\`, an order's \`itemTotal\`, a user's \`unreadCount\`. The transactions/comments/views still exist as their own documents (they are the source of truth and the audit trail); the computed value is a maintained cache of a number the application shows constantly. The cost is that every write that affects the aggregate must also update it — usually a trivial \`$inc\` in the same operation.

## Subset

When a one-to-many relationship is *mostly* accessed as "the parent plus its most recent few children," embed those few and reference the rest:

\`\`\`js
{
  _id: 1,
  name: "Widget",
  recentReviews: [ { u: "a", stars: 5 }, { u: "b", stars: 4 } ],
  reviewCount: 87
}
\`\`\`

The product page needs the product, a couple of recent reviews, and the total count — all served by one \`findOne\`. The full list of 87 reviews lives in a \`reviews\` collection and is fetched only when the user opens the reviews tab. On a new review, you insert into \`reviews\`, \`$inc\` the \`reviewCount\`, and \`$push\` onto \`recentReviews\` with \`$slice: -N\` to keep it bounded. This is the standard fix for "I want to embed the list but the list is unbounded."

## Bucket

For high-volume time-series or log data — sensor readings, metrics, events — one document per data point is wasteful: millions of tiny documents, each with its own \`_id\` and index entries. The bucket pattern groups many data points into one document, keyed by an entity plus a time window:

\`\`\`js
{
  sensorId: "A",
  hour: "2026-01-01T00",
  count: 3,
  readings: [ { t: 0, v: 20 }, { t: 20, v: 21 }, { t: 40, v: 19 } ]
}
\`\`\`

A sensor reporting once a minute produces one document per hour (60 readings) instead of 60 documents. The array is bounded by the time window, so it is safe to embed. Reads for "sensor A's data for this hour" or "this day" touch far fewer documents. (MongoDB also has native **time-series collections** that apply this pattern automatically under the hood — the right choice for genuine time-series workloads on a recent MongoDB version.)

## Attribute

When documents have many optional fields that vary by document — product specs, where a laptop has \`ram\`/\`cpu\`/\`screen\` and a book has \`pages\`/\`isbn\`/\`language\` — modeling each as a top-level field means a sparse, sprawling schema and one index per queryable attribute. The attribute pattern moves them into an array of key-value sub-documents:

\`\`\`js
{ _id: 1, name: "Laptop", specs: [ { k: "ram", v: "16GB" }, { k: "cpu", v: "i7" } ] }
\`\`\`

A single compound index on \`{ "specs.k": 1, "specs.v": 1 }\` then serves a query for *any* attribute:

\`\`\`js
db.products.find({ specs: { $elemMatch: { k: "ram", v: "16GB" } } })
\`\`\`

One index instead of dozens, and adding a new attribute type requires no schema or index change. The \`$elemMatch\` is essential here (Module 13 Lesson 5) — it ensures one \`specs\` element has both the right \`k\` and the right \`v\`.

## When not to reach for these

Every one of these patterns adds write-time work and, for computed and subset, a maintained duplicate that can drift out of sync (Lesson 6). They are worth it when the read they optimize is genuinely hot — run constantly, on the critical path. For a read that happens rarely, a plain aggregation or a second query at read time is simpler and carries no synchronization burden. As always, model for the queries you actually run.`,

    contentHi: `## Shared idea

Ye chaar patterns sab ek principle ke applications hain: **jab ek read common aur expensive hai, kaam ek baar write time par karो aur result store karो, taaki read sasta ho.**

## Computed

Har input store karके har read par ek aggregate recompute karne ke bजाy, aggregate store karो aur ise inputs badalne par maintain karो:

\`\`\`js
await db.accounts.updateOne({ _id: 1 }, { $inc: { balance: 100 } });
await db.accounts.updateOne({ _id: 1 }, { $inc: { balance: -30 } });
await db.accounts.findOne({ _id: 1 });   // { balance: 70 }
\`\`\`

Balance padhना ek single field access hai. Wahi ek post ke \`commentCount\`, ek video ke \`viewCount\` par apply hota hai.

## Subset

Jab ek one-to-many relationship *zyadातार* "parent plus iske recent кुछ children" ke roop mein access hoती hai, un кुछ ko embed karो aur baaki reference karो:

\`\`\`js
{ _id: 1, name: "Widget",
  recentReviews: [ { u: "a", stars: 5 }, { u: "b", stars: 4 } ],
  reviewCount: 87 }
\`\`\`

Ek naye review par, aap \`reviews\` mein insert karते ho, \`reviewCount\` \`$inc\` karते ho, aur \`recentReviews\` par \`$push\` karते ho \`$slice: -N\` ke saath.

## Bucket

High-volume time-series ya log data ke liye, prati data point ek document wasteful hai. Bucket pattern кई data points ko ek document mein group karता hai:

\`\`\`js
{ sensorId: "A", hour: "2026-01-01T00", count: 3,
  readings: [ { t: 0, v: 20 }, { t: 20, v: 21 }, { t: 40, v: 19 } ] }
\`\`\`

Array time window se bounded hai, to embed karna safe hai. (MongoDB ke paas native **time-series collections** bhi hain.)

## Attribute

Jab documents mein кई optional fields hain jo document ke hisaab se vary karते hain, attribute pattern unhe key-value sub-documents ke ek array mein move karता hai:

\`\`\`js
{ _id: 1, name: "Laptop", specs: [ { k: "ram", v: "16GB" }, { k: "cpu", v: "i7" } ] }
\`\`\`

\`{ "specs.k": 1, "specs.v": 1 }\` par ek single compound index phir *kisī bhi* attribute ke liye ek query serve karता hai. \`$elemMatch\` yahaan essential hai.

## Kab in ke liye reach na karें

In sab mein se har ek write-time work add karता hai. Ye tab worth hain jab wo read jise ye optimize karते hain genuinely hot hai. Ek read jo shАyad hi hota hai ke liye, ek plain aggregation simpler hai.`,

    examples: [
      {
        title: 'Computed: a maintained running balance, read in one lookup',
        titleHi: 'Computed: ek maintained running balance, ek lookup mein read',
        code: `await db.accounts.insertOne({ _id: 1, name: "Ravi", balance: 0 });
await db.accounts.updateOne({ _id: 1 }, { $inc: { balance: 100 } });
await db.accounts.updateOne({ _id: 1 }, { $inc: { balance: -30 } });
print(await db.accounts.findOne({ _id: 1 }, { projection: { _id: 0, name: 1, balance: 1 } }));`,
        output: `{"name":"Ravi","balance":70}`,
        explain: 'The account carries a `balance` field maintained with `$inc` on each change (0 + 100 - 30 = 70). Reading the balance is a single field access — O(1) — not a scan-and-sum of a transaction history. The transactions themselves would still be stored as their own documents (the source of truth); `balance` is a maintained cache of a number shown constantly.',
        explainHi: 'Account ek `balance` field carry karta hai jo har change par `$inc` se maintain hoता hai (0 + 100 - 30 = 70). Balance padhna ek single field access hai — O(1) — ek transaction history ka scan-and-sum nahi. Transactions khud apni documents ke roop mein store honge; `balance` ek maintained cache hai.',
      },
      {
        title: 'Subset: embed the recent few + a count, keep the full list separate',
        titleHi: 'Subset: recent кुछ + ek count embed karo, poori list alag rakho',
        code: `await db.products.insertOne({
  _id: 1, name: "Widget",
  recentReviews: [{ u: "a", stars: 5 }, { u: "b", stars: 4 }],
  reviewCount: 87,
});
await db.reviews.insertMany([
  { _id: 100, productId: 1, u: "a", stars: 5 },
  { _id: 101, productId: 1, u: "c", stars: 3 },
]);
print(await db.products.findOne({ _id: 1 }, { projection: { _id: 0, name: 1, reviewCount: 1 } }));
print(await db.reviews.countDocuments({ productId: 1 }));`,
        output: `{"name":"Widget","reviewCount":87}
2`,
        explain: 'The product embeds `recentReviews` (the last 2) and a `reviewCount` of 87 — so the product page\'s `findOne` is small and serves everything it shows. The full list of reviews lives in a separate `reviews` collection (here 2 documents; in reality all 87), fetched only when the user opens the reviews tab. This is the standard fix for "I want to embed the list but it\'s unbounded."',
        explainHi: 'Product `recentReviews` (last 2) aur ek `reviewCount` of 87 embed karta hai — to product page ka `findOne` chhota hai. Reviews ki poori list ek alag `reviews` collection mein rehти hai (yahaan 2 documents), sirf tab fetch hoती jab user reviews tab kholता hai. Ye "list embed karna chाहता hoon par ye unbounded hai" ka standard fix hai.',
      },
      {
        title: 'Attribute: one array of {k,v} plus one compound index serves any attribute query',
        titleHi: 'Attribute: ek {k,v} array plus ek compound index kisi bhi attribute query serve karta hai',
        code: `await db.products.insertMany([
  { _id: 1, name: "Laptop", specs: [{ k: "ram", v: "16GB" }, { k: "cpu", v: "i7" }] },
  { _id: 2, name: "Tablet", specs: [{ k: "ram", v: "8GB" }, { k: "cpu", v: "i5" }] },
]);
await db.products.createIndex({ "specs.k": 1, "specs.v": 1 });
print(await db.products.find({ specs: { $elemMatch: { k: "ram", v: "16GB" } } }).project({ _id: 0, name: 1 }).toArray());`,
        output: `[{"name":"Laptop"}]`,
        explain: 'Both products model their varying specs as a `specs` array of `{ k, v }` sub-documents. A SINGLE compound index on `{ "specs.k": 1, "specs.v": 1 }` then serves a query for ANY attribute. The `$elemMatch` requires one `specs` element to have BOTH `k: "ram"` AND `v: "16GB"` — only the Laptop matches (the Tablet\'s ram is `"8GB"`).',
        explainHi: 'Dono products apne varying specs ko `{ k, v }` sub-documents ke ek `specs` array ke roop mein model karte hain. `{ "specs.k": 1, "specs.v": 1 }` par ek SINGLE compound index phir KISI BHI attribute ke liye ek query serve karta hai. `$elemMatch` ki zaroorat hai ki ek `specs` element ke paas `k: "ram"` AUR `v: "16GB"` DONO hon — sirf Laptop match karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// computing an aggregate on every read instead of maintaining it
async function getBalance(accountId) {
  const txns = await db.transactions.find({ accountId }).toArray();
  return txns.reduce((sum, t) => sum + t.amount, 0);   // scans ALL transactions
}
// on an account with 50,000 transactions, every balance display re-sums 50,000 docs`,
        right: `// maintain a computed balance; update it in the same op that adds a transaction:
async function addTransaction(accountId, amount) {
  await db.transactions.insertOne({ accountId, amount, at: new Date() });
  await db.accounts.updateOne({ _id: accountId }, { $inc: { balance: amount } });
}
async function getBalance(accountId) {
  return (await db.accounts.findOne({ _id: accountId })).balance;   // O(1)
}`,
        why: 'Recomputing an aggregate value from its underlying records on every read makes the cost of that read grow with the number of records, so a value that is displayed constantly, like an account balance or a comment count, becomes progressively more expensive to show as the entity accumulates history. The computed pattern moves that work to write time: the aggregate is stored as a field and updated, usually with a trivial increment, in the same operation that changes one of its inputs, so the write cost stays constant and the read becomes a single field access regardless of how many underlying records exist. The underlying records are still kept as the source of truth and audit trail; the computed field is a maintained cache of a number the application needs on the fast path. This is worthwhile specifically because the read is hot and the maintenance is cheap; for an aggregate that is only needed occasionally, recomputing it on demand is simpler and avoids the synchronization concern.',
        whyHi: 'Har read par ek aggregate value ko iske underlying records se recompute karna us read ki cost ko records ki sankhya ke saath badhाता hai. Computed pattern us kaam ko write time par move karता hai: aggregate ek field ke roop mein store hoता hai aur update hoता hai, usually ek trivial increment ke saath, usi operation mein jo iske ek input ko badalता hai. Ye specifically worthwhile hai kyunki read hot hai aur maintenance sasta hai.',
      },
      {
        wrong: `// applying the bucket pattern to a genuinely unbounded array
{ userId: 1, allNotifications: [ /* every notification this user ever got */ ] }
// "it's a bucket!" -- but there's no time window or size bound, so it's just
// the unbounded-array anti-pattern with a different name`,
        right: `// a bucket must be BOUNDED -- by a time window or an explicit size cap:
{ userId: 1, day: "2026-01-01", count: 12, notifications: [ /* just that day's */ ] }
// each day is a new document; no single document grows without limit`,
        why: 'The bucket pattern works by grouping many small items into one document, and its safety depends entirely on the group being bounded, so that no single bucket document can grow without limit. A bucket keyed by a time window, such as an hour or a day, is bounded because a new bucket document starts when the window rolls over, and a bucket capped at a fixed maximum count is bounded because a new bucket starts once the cap is reached. Calling an array a bucket without either of these bounds does not change what it is: an array that accumulates entries indefinitely is still the unbounded-array anti-pattern, subject to the same slow rewrites and the same eventual collision with the 16MB document limit. The bound is not an optional refinement of the bucket pattern; it is the entire mechanism that makes bucketing safe.',
        whyHi: 'Bucket pattern кई chhote items ko ek document mein group karके kaam karता hai, aur iski safety poori tarah group ke bounded hone par depend karती hai. Ek time window se keyed bucket bounded hai kyunki window roll over hone par ek naya bucket document shuru hota hai. In bounds ke bina ek array ko bucket kehना ye nahi badalता ki ye kya hai: ek array jo indefinitely entries accumulate karता hai abhi bhi unbounded-array anti-pattern hai.',
      },
      {
        wrong: `// forgetting the $elemMatch in an attribute-pattern query
db.products.find({ "specs.k": "ram", "specs.v": "16GB" })
// matches a product that has SOME spec with k "ram" and SOME spec with v "16GB"
// -- e.g. { specs: [{k:"ram",v:"8GB"}, {k:"cpu",v:"16GB"}] } wrongly MATCHES`,
        right: `db.products.find({ specs: { $elemMatch: { k: "ram", v: "16GB" } } })
// requires ONE spec element to have BOTH k "ram" AND v "16GB"`,
        why: 'The attribute pattern stores each attribute as a sub-document with a key field and a value field inside an array, so a query for a specific attribute needs both the key and the value to match within the same array element. Writing the two conditions as separate dot-notation paths on the array evaluates them independently, matching a document where one element has the right key and a different element has the right value, which for the attribute pattern produces false matches like a product whose ram is a different size but which happens to have some other spec with the searched value. The $elemMatch operator is what constrains both conditions to a single array element, and it is required whenever an attribute-pattern query filters on both the key and the value of an attribute, which is nearly always.',
        whyHi: 'Attribute pattern har attribute ko ek key field aur ek value field ke saath ek sub-document ke roop mein ek array ke andar store karता hai, to ek specific attribute ke liye ek query ko dono key aur value ko usī array element ke andar match karна chahiye. Do conditions ko alag dot-notation paths ke roop mein likhना unhe independently evaluate karता hai. `$elemMatch` operator wo hai jo dono conditions ko ek single array element tak constrain karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A social feed where every post carries a maintained `likeCount`, `commentCount`, and `shareCount`** — the feed renders these instantly; the actual likes/comments/shares live in their own collections and `$inc` the counters on write.',
        hi: '**Ek social feed jahaan har post ek maintained `likeCount`, `commentCount`, aur `shareCount` carry karta hai** — feed inhe turant render karta hai.',
      },
      {
        en: '**An e-commerce product document with `recentReviews` (last 3), `reviewCount`, and `avgRating`** — all computed/subset, served in the one `findOne` the product page needs; the reviews tab lazy-loads the full list.',
        hi: '**Ek e-commerce product document `recentReviews` (last 3), `reviewCount`, aur `avgRating` ke saath** — sab computed/subset.',
      },
      {
        en: '**An IoT platform using MongoDB time-series collections (which apply bucketing internally)** for millions of device readings per hour, keeping storage compact and time-range queries fast.',
        hi: '**Ek IoT platform jo MongoDB time-series collections istemal karta hai** millions device readings ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the computed pattern, and what is its cost?',
        qHi: 'Computed pattern kya hai, aur iski cost kya hai?',
        a: 'The computed pattern stores the result of an aggregate calculation as a field on a document and maintains that field as the underlying data changes, rather than recomputing the aggregate from its inputs on every read. For example, instead of summing every transaction to display an account balance, the account document carries a balance field that is incremented in the same operation that records each transaction, so reading the balance is a single field access no matter how many transactions exist. The same approach applies to a post\'s comment count, a video\'s view count, or an order\'s total. The underlying records are still stored as the source of truth and audit trail; the computed field is a maintained cache of a value the application displays constantly. The cost is that every write which changes one of the aggregate\'s inputs must also update the computed field, which is usually a trivial increment issued in the same operation, and there is a small risk of the computed value drifting from the true aggregate if an update path is missed, so it needs the same care as any denormalized copy. The pattern is worthwhile when the read is genuinely hot and the maintenance is cheap; for an aggregate needed only occasionally, computing it on demand is simpler.',
        aHi: 'Computed pattern ek aggregate calculation ke result ko ek document par ek field ke roop mein store karता hai aur us field ko underlying data badalne par maintain karता hai, har read par aggregate recompute karne ke bजाy. Underlying records abhi bhi source of truth ke roop mein store hote hain; computed field ek maintained cache hai. Cost ye hai ki har write jo aggregate ke ek input ko badalता hai use computed field bhi update karना chahiye, aur computed value ke true aggregate se drift hone ka ek chhota risk hai.',
      },
      {
        q: 'What problem does the bucket pattern solve, and what makes a bucket safe to embed?',
        qHi: 'Bucket pattern kaunसी problem solve karता hai, aur ek bucket ko embed karna safe kya banata hai?',
        a: 'The bucket pattern addresses the inefficiency of storing one document per data point for high-volume time-series or log data, where millions of tiny documents each carry their own identifier and index overhead and where reads that span a time range must touch enormous numbers of documents. The pattern groups many data points into a single document keyed by an entity together with a time window, such as one document per sensor per hour holding an array of that hour\'s readings, which dramatically reduces document count and makes time-range reads far cheaper. What makes this safe, unlike embedding an ordinary unbounded array, is that the group is bounded by construction: a time-windowed bucket cannot grow past the number of data points that fit in its window before a new bucket document begins, and a count-capped bucket cannot grow past its cap. This bound is the essential mechanism; an array grouped without any time window or size limit is not a real bucket and remains the unbounded-array anti-pattern. Recent MongoDB versions also provide native time-series collections that apply this bucketing automatically.',
        aHi: 'Bucket pattern high-volume time-series ya log data ke liye prati data point ek document store karne ki inefficiency ko address karता hai. Pattern кई data points ko ek single document mein group karता hai jo ek entity plus ek time window se keyed hai. Jo ise safe banata hai wo ye hai ki group construction se bounded hai: ek time-windowed bucket us number of data points se aage nahi badh sakта jo iske window mein fit hote hain. Ye bound essential mechanism hai.',
      },
    ],

    exercises: [
      {
        task: 'Model the computed pattern: an `accounts` collection with a `balance` field. Insert an account at `balance: 0`, then apply two `$inc` updates (+100, then -30). Confirm one `findOne` returns `balance: 70` with no aggregation.',
        taskHi: 'Computed pattern model karo: ek `accounts` collection ek `balance` field ke saath. Ek account `balance: 0` par insert karo, phir do `$inc` updates apply karo (+100, phir -30).',
        hint: 'The computed pattern stores the result and maintains it on write. Reading the balance is O(1) — a single field access, not a scan-and-sum of a transaction history.',
        hintHi: 'Computed pattern result store karta hai aur ise write par maintain karta hai. Balance padhna O(1) hai.',
      },
      {
        task: 'Model the subset pattern: a `products` doc embedding `recentReviews` (2 sub-docs) and a `reviewCount` of 87, plus a separate `reviews` collection. Insert the product and 2 review documents. Confirm the product `findOne` is small (name + count), and `countDocuments` on `reviews` returns 2.',
        taskHi: 'Subset pattern model karo: ek `products` doc jo `recentReviews` (2 sub-docs) aur ek `reviewCount` of 87 embed karta hai, plus ek alag `reviews` collection.',
        hint: 'The product page needs the product + a couple of recent reviews + a total count — one `findOne`. The full review list lives separately and loads only when the user opens the reviews tab.',
        hintHi: 'Product page ko product + кुछ recent reviews + ek total count chahiye — ek `findOne`. Poori review list alag rehti hai.',
      },
      {
        task: 'Model the attribute pattern: a `products` collection where each doc has a `specs` array of `{ k, v }` sub-documents. Insert two products (a Laptop with ram 16GB, a Tablet with ram 8GB). Create a compound index on `{ "specs.k": 1, "specs.v": 1 }`. Query with `$elemMatch` for `k: "ram", v: "16GB"` and confirm only the Laptop matches.',
        taskHi: 'Attribute pattern model karo: ek `products` collection jahaan har doc ka ek `specs` array of `{ k, v }` sub-documents hai. Do products insert karo. `{ "specs.k": 1, "specs.v": 1 }` par ek compound index banao.',
        hint: 'One compound index serves a query for ANY attribute. The `$elemMatch` is essential — it requires one `specs` element to have both the right `k` AND the right `v` (Module 13 Lesson 5).',
        hintHi: 'Ek compound index KISI BHI attribute ke liye ek query serve karta hai. `$elemMatch` essential hai.',
      },
    ],

    keyTakeaways: [
      'All four patterns apply ONE principle: when a read is common and expensive, do the work ONCE at write time and store the result, so the read is cheap. Each carries write-time work + (for computed/subset) a maintained duplicate that can drift (Lesson 6).',
      'COMPUTED: store the aggregate (`balance`, `commentCount`, `viewCount`), not the inputs. `$inc` it in the same op that changes an input. Read is O(1) — a field access, not a scan-and-sum. The underlying records still exist as the source of truth.',
      'SUBSET: embed the recent/first N children + a `count`, reference the rest in a separate collection. The standard fix for "I want to embed the list but the list is unbounded." On a new child: insert to the collection, `$inc` the count, `$push` with `$slice: -N` to keep the embedded subset bounded.',
      'BUCKET: one document holds an ARRAY of many small items + a count, keyed by entity + a TIME WINDOW (one doc per sensor per hour, not 60 docs). Safe to embed ONLY because the window bounds the array. MongoDB\'s native TIME-SERIES COLLECTIONS apply this automatically. An array grouped WITHOUT a window/size bound is NOT a bucket — it\'s still the unbounded-array anti-pattern.',
      'ATTRIBUTE: many optional/sparse fields that vary by document → ONE array of `{ k, v }` sub-documents + ONE compound index on `{ "field.k": 1, "field.v": 1 }`. That single index serves a query for ANY attribute; adding a new attribute type needs no schema/index change. The query MUST use `$elemMatch` (both `k` and `v` on one element).',
      'These patterns are worth it ONLY when the read they optimize is genuinely HOT (constant, on the critical path). For a rare read, a plain aggregation or second query is simpler and carries no sync burden.',
    ],
    keyTakeawaysHi: [
      'Chaаron patterns EK principle apply karते hain: jab ek read common aur expensive hai, kaam EK BAAR write time par karो aur result store karो. Har ek write-time work + (computed/subset ke liye) ek maintained duplicate carry karता hai.',
      'COMPUTED: aggregate store karो (`balance`, `commentCount`), inputs nahi. Usi op mein `$inc` karो jo ek input badalता hai. Read O(1) hai.',
      'SUBSET: recent/first N children + ek `count` embed karो, baaki ek alag collection mein reference karो. "List embed karna chाहता hoon par list unbounded hai" ka standard fix.',
      'BUCKET: ek document кई chhote items ka ARRAY + ek count rakhता hai, entity + ek TIME WINDOW se keyed. Embed karna safe SIRF isliye kyunki window array ko bound karता hai. MongoDB ke native TIME-SERIES COLLECTIONS ise automatically apply karте hain.',
      'ATTRIBUTE: кई optional/sparse fields → EK array of `{ k, v }` + EK compound index. Wo single index KISI BHI attribute ke liye ek query serve karता hai. Query ko `$elemMatch` istemal karना ZAROORI hai.',
      'Ye patterns SIRF tab worth hain jab wo read jise ye optimize karते hain genuinely HOT hai. Ek rare read ke liye, ek plain aggregation simpler hai.',
    ],
  },

  {
    slug: 'mongo-structural-patterns',
    title: 'The Structural Patterns',
    titleHi: 'Structural Patterns',
    description: 'Polymorphic, schema versioning, and tree patterns handle documents whose shape varies — by kind, by age, or by position in a hierarchy — while keeping them queryable in one collection.',
    descriptionHi: 'Polymorphic, schema versioning, aur tree patterns un documents ko handle karते hain jinki shape vary karती hai — kind se, age se, ya ek hierarchy mein position se — unhe ek collection mein queryable rakhते hue.',
    difficulty: 'HARD',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A single "personnel file" drawer that holds employees, contractors, and interns on one form template with a "type" box — plus a "form version" stamp so old files are still readable, and a "reports to" line so the whole org chart lives in the same drawer.** You do not keep three separate drawers for three kinds of worker; one drawer, one filing system, a type field to tell them apart. When the form changes, you stamp new files "v2" and teach the reader to handle both. And the reporting hierarchy is not a separate wall chart — each file just lists its chain of managers, so "everyone under Priya" is a single search of the drawer.',
      hi: '**Ek single "personnel file" drawer jo employees, contractors, aur interns ko ek form template par ek "type" box ke saath rakhता hai — plus ek "form version" stamp taaki purani files abhi bhi readable hon, aur ek "reports to" line taaki poora org chart usी drawer mein rahe.** Aap teen tarah ke worker ke liye teen alag drawers nahi rakhते; ek drawer, ek filing system, ek type field unhe alag bataने ke liye. Jab form badalता hai, aap nayi files ko "v2" stamp karते ho. Aur reporting hierarchy ek alag wall chart nahi hai — har file bas apni managers ki chain list karती hai.',
    },

    simple: `**POLYMORPHIC: one collection, a \`kind\`/\`type\` field, different shapes per kind**

\`\`\`js
{ _id: 1, kind: "article", title: "T", body: "..." }
{ _id: 2, kind: "video",   title: "V", durationSec: 120, url: "..." }
// query the common fields across all; query kind-specific fields per kind:
db.content.find({ kind: "video" })
\`\`\`

**SCHEMA VERSIONING: a \`schemaVersion\` field; the READ side handles every version**

\`\`\`js
{ _id: 1, schemaVersion: 1, name: "Ravi Kumar" }              // old shape
{ _id: 2, schemaVersion: 2, firstName: "Amit", lastName: "Shah" }  // new shape
// on read: if v1 use .name, if v2 use firstName + lastName.
// migrate lazily (on next write) or in a background job -- no big-bang migration.
\`\`\`

**TREE / HIERARCHY: store an \`ancestors\` array on each node -> whole subtree in one query**

\`\`\`js
{ _id: 4, name: "A1", parentId: 2, ancestors: [1, 2] }   // root=1, parent=2
// everything under node 2 (any depth):
db.categories.find({ ancestors: 2 })
// direct children of node 2 only:
db.categories.find({ parentId: 2 })
\`\`\`

**Other tree encodings:** \`parentId\` alone (simple, but subtree = recursive queries),
materialized \`path: ",1,2,4,"\` string (regex-queryable), or \`$graphLookup\` (aggregation).`,

    simpleHi: `**POLYMORPHIC: ek collection, ek \`kind\`/\`type\` field, prati kind alag shapes**

\`\`\`js
{ _id: 1, kind: "article", title: "T", body: "..." }
{ _id: 2, kind: "video",   title: "V", durationSec: 120, url: "..." }
db.content.find({ kind: "video" })
\`\`\`

**SCHEMA VERSIONING: ek \`schemaVersion\` field; READ side har version handle karта hai**

\`\`\`js
{ _id: 1, schemaVersion: 1, name: "Ravi Kumar" }              // purani shape
{ _id: 2, schemaVersion: 2, firstName: "Amit", lastName: "Shah" }  // nayi shape
// read par: agar v1 .name use karो, agar v2 firstName + lastName.
// lazily migrate karो (agle write par) ya ek background job mein -- koi big-bang migration nahi.
\`\`\`

**TREE / HIERARCHY: har node par ek \`ancestors\` array store karो -> poora subtree ek query mein**

\`\`\`js
{ _id: 4, name: "A1", parentId: 2, ancestors: [1, 2] }   // root=1, parent=2
db.categories.find({ ancestors: 2 })   // node 2 ke neeche sab kुछ (kisī bhi depth)
db.categories.find({ parentId: 2 })    // sirf node 2 ke direct children
\`\`\`

**Doosre tree encodings:** akela \`parentId\`, materialized \`path: ",1,2,4,"\` string, ya \`$graphLookup\`.`,

    content: `## Polymorphic

When a collection holds documents that are variations on a theme — different kinds of content, different types of account, different shapes of event — the polymorphic pattern keeps them in **one collection** with a discriminator field (\`kind\`, \`type\`, \`_t\`) naming the variant:

\`\`\`js
{ _id: 1, kind: "article", title: "The Doc Model", body: "..." }
{ _id: 2, kind: "video",   title: "Modeling 101",  durationSec: 620, url: "..." }
\`\`\`

All documents share a common core (\`title\`, \`_id\`), and each variant adds its own fields. Queries over the common fields work across everything (\`find({ title: /model/i })\`); queries for variant-specific fields filter by \`kind\` first (\`find({ kind: "video", durationSec: { $gt: 600 } })\`). This is the right choice when the variants are genuinely handled together — listed in one feed, searched as one set — which is common. Splitting them into separate collections only makes sense when they are almost never queried together and have very little in common.

## Schema versioning

Documents in a collection are written over months and years, and the intended shape evolves. Rather than a disruptive all-at-once migration of every existing document, the schema versioning pattern tags each document with a \`schemaVersion\` and makes the **application's read path** tolerant of every version it might encounter:

\`\`\`js
{ _id: 1, schemaVersion: 1, name: "Ravi Kumar" }
{ _id: 2, schemaVersion: 2, firstName: "Amit", lastName: "Shah" }
\`\`\`

On read, code checks \`schemaVersion\` and adapts: a v1 document's display name is \`name\`; a v2 document's is \`firstName + " " + lastName\`. Old documents are then upgraded opportunistically — rewritten to the current version the next time they are updated for any reason (lazy migration), or swept through by a low-priority background job — so the mix of versions shrinks over time without a maintenance window. The key discipline is that new writes always use the latest version, and the read path always handles all versions currently in the data.

## Trees and hierarchies

A hierarchy — category tree, org chart, threaded comments, file system — needs each node to know its place. MongoDB has several encodings, trading off which operations are cheap:

- **Parent reference** (\`parentId\`): each node stores only its immediate parent. Simple, and "direct children of X" is \`find({ parentId: X })\`. But "the entire subtree under X" requires walking the tree level by level, or \`$graphLookup\` (an aggregation stage that does the recursion).
- **Array of ancestors** (\`ancestors: [rootId, ..., parentId]\`): each node stores the full list of its ancestors. Now "the entire subtree under X" is a single indexed query, \`find({ ancestors: X })\`, and "the path from root to this node" is already in the document. The cost is that moving a node means updating the \`ancestors\` array of the node *and every node beneath it*.
- **Materialized path** (\`path: ",1,2,4,"\`): each node stores its ancestor chain as a delimited string; subtree queries use an anchored regex (\`{ path: { $regex: "^,1,2," } }\`). Similar trade-offs to the ancestors array, in string form.

The ancestors-array encoding is the common default: subtree reads (the frequent operation for most hierarchies) are a single cheap query, and node moves (rare) are the expensive one, which is usually the right way round.

\`\`\`js
db.categories.find({ ancestors: 2 })   // everything under node 2, any depth
db.categories.find({ parentId: 2 })    // direct children of node 2 only
\`\`\``,

    contentHi: `## Polymorphic

Jab ek collection un documents ko rakhती hai jo ek theme par variations hain, polymorphic pattern unhe **ek collection** mein ek discriminator field (\`kind\`, \`type\`) ke saath rakhता hai jo variant ka naam leता hai:

\`\`\`js
{ _id: 1, kind: "article", title: "...", body: "..." }
{ _id: 2, kind: "video",   title: "...", durationSec: 620, url: "..." }
\`\`\`

Common fields par queries sab kुछ ke across kaam karती hain; variant-specific fields ke liye queries pehle \`kind\` se filter karती hain. Ye tab sahi choice hai jab variants genuinely saath handle kiye jaते hain.

## Schema versioning

Ek disruptive all-at-once migration ke bजाy, schema versioning pattern har document ko ek \`schemaVersion\` se tag karता hai aur **application ke read path** ko har version ke liye tolerant banata hai:

\`\`\`js
{ _id: 1, schemaVersion: 1, name: "Ravi Kumar" }
{ _id: 2, schemaVersion: 2, firstName: "Amit", lastName: "Shah" }
\`\`\`

Read par, code \`schemaVersion\` check karता hai aur adapt karता hai. Purane documents phir opportunistically upgrade hote hain — kisī bhi कारण se agle update par current version mein rewrite (lazy migration), ya ek low-priority background job dwara. Key discipline ye hai ki naye writes hamesha latest version istemal karें.

## Trees aur hierarchies

- **Parent reference** (\`parentId\`): har node sirf apna immediate parent store karता hai. Simple, par "poora subtree under X" ko tree level-by-level walk karना paता hai.
- **Ancestors ka array** (\`ancestors: [rootId, ..., parentId]\`): har node apne ancestors ki poori list store karता hai. Ab "poora subtree under X" ek single indexed query hai. Cost ye hai ki ek node move karna matlab us node *aur iske neeche har node* ka \`ancestors\` array update karना.
- **Materialized path** (\`path: ",1,2,4,"\`): har node apni ancestor chain ek delimited string ke roop mein store karता hai.

Ancestors-array encoding common default hai: subtree reads (frequent operation) ek single sasti query hain, aur node moves (rare) expensive hain.

\`\`\`js
db.categories.find({ ancestors: 2 })   // node 2 ke neeche sab kुछ
db.categories.find({ parentId: 2 })    // sirf node 2 ke direct children
\`\`\``,

    examples: [
      {
        title: 'Polymorphic: one collection, a kind field, query by kind',
        titleHi: 'Polymorphic: ek collection, ek kind field, kind se query',
        code: `await db.content.insertMany([
  { _id: 1, kind: "article", title: "T", body: "B" },
  { _id: 2, kind: "video", title: "V", durationSec: 120, url: "u" },
  { _id: 3, kind: "article", title: "T2", body: "B2" },
]);
print(await db.content.find({ kind: "video" }).project({ _id: 0 }).toArray());`,
        output: `[{"kind":"video","title":"V","durationSec":120,"url":"u"}]`,
        explain: 'All three documents live in one `content` collection, distinguished by a `kind` field. A query on `kind` (`find({ kind: "video" })`) returns just the video, with its variant-specific fields (`durationSec`, `url`) that the articles don\'t have. Common fields like `title` would query across every kind.',
        explainHi: 'Teenon documents ek `content` collection mein rehte hain, ek `kind` field se distinguished. `kind` par ek query (`find({ kind: "video" })`) sirf video lautaता hai, iske variant-specific fields (`durationSec`, `url`) ke saath jo articles ke paas nahi hain. `title` jaisे common fields har kind ke across query honge.',
      },
      {
        title: 'Schema versioning: the read path handles both v1 and v2 documents',
        titleHi: 'Schema versioning: read path v1 aur v2 dono documents handle karta hai',
        code: `await db.users.insertMany([
  { _id: 1, schemaVersion: 1, name: "Ravi Kumar" },
  { _id: 2, schemaVersion: 2, firstName: "Amit", lastName: "Shah" },
]);
const docs = await db.users.find({}).sort({ _id: 1 }).toArray();
const displayNames = docs.map(d => d.schemaVersion === 1 ? d.name : d.firstName + " " + d.lastName);
print(displayNames);`,
        output: `["Ravi Kumar","Amit Shah"]`,
        explain: 'The v1 document has a single `name` field; the v2 document has split `firstName`/`lastName`. The read-side code checks each document\'s `schemaVersion` and adapts — `.name` for v1, `firstName + " " + lastName` for v2 — producing a correct display name for both without any migration having run.',
        explainHi: 'v1 document ka ek single `name` field hai; v2 document ka split `firstName`/`lastName` hai. Read-side code har document ka `schemaVersion` check karता hai aur adapt karता hai — v1 ke liye `.name`, v2 ke liye `firstName + " " + lastName` — dono ke liye ek correct display name produce karता hai bina kisī migration ke.',
      },
      {
        title: 'Tree: an ancestors array makes a whole-subtree query one indexed find',
        titleHi: 'Tree: ek ancestors array poore-subtree query ko ek indexed find banata hai',
        code: `await db.categories.insertMany([
  { _id: 1, name: "Root", parentId: null, ancestors: [] },
  { _id: 2, name: "A", parentId: 1, ancestors: [1] },
  { _id: 3, name: "B", parentId: 1, ancestors: [1] },
  { _id: 4, name: "A1", parentId: 2, ancestors: [1, 2] },
]);
print(await db.categories.find({ ancestors: 2 }).project({ _id: 0, name: 1 }).toArray());
print(await db.categories.find({ parentId: 1 }).project({ _id: 0, name: 1 }).toArray());`,
        output: `[{"name":"A1"}]
[{"name":"A"},{"name":"B"}]`,
        explain: 'Each node stores its full `ancestors` array. `find({ ancestors: 2 })` matches every node that has 2 anywhere in its ancestors — the entire subtree under node 2 at any depth (here just A1). `find({ parentId: 1 })` matches only nodes whose IMMEDIATE parent is 1 — the direct children (A and B). One indexed query for a whole subtree, regardless of tree depth.',
        explainHi: 'Har node apna poora `ancestors` array store karता hai. `find({ ancestors: 2 })` har wo node match karता hai jiske ancestors mein kahin 2 hai — node 2 ke neeche poora subtree kisī bhi depth par (yahaan sirf A1). `find({ parentId: 1 })` sirf un nodes ko match karता hai jinka IMMEDIATE parent 1 hai — direct children (A aur B).',
      },
    ],

    mistakes: [
      {
        wrong: `// splitting genuinely-related polymorphic variants into separate collections
db.articles, db.videos, db.podcasts, db.galleries
// now the home feed (a mix of all four) needs four queries merged and re-sorted
// in application code, and "search all content" hits four collections`,
        right: `// one "content" collection with a kind field:
db.content.insertOne({ kind: "article", title: "...", body: "..." })
db.content.insertOne({ kind: "video", title: "...", durationSec: 620 })
// the home feed is db.content.find({}).sort({ publishedAt: -1 }).limit(20)
// -- one query, correctly ordered across all kinds`,
        why: 'When variant documents are routinely handled as one set, shown together in a feed, searched together, sorted together, keeping them in separate collections forces the application to query each collection individually and then merge and re-sort the combined results in its own code, which is more complex, harder to paginate correctly, and cannot use the database\'s own sorting and limiting efficiently across the whole set. The polymorphic pattern keeps all the variants in one collection distinguished by a discriminator field, so a query over the common fields naturally spans every kind and the database handles ordering and pagination across the whole set in one operation. Separate collections are only the better choice when the variants have almost nothing in common and are essentially never queried together, which is the exception rather than the rule for things that are variations on a shared concept.',
        whyHi: 'Jab variant documents routinely ek set ke roop mein handle kiye jaते hain, unhe alag collections mein rakhना application ko har collection ko individually query karne aur phir combined results ko apne code mein merge aur re-sort karne ke liye force karता hai. Polymorphic pattern saare variants ko ek collection mein ek discriminator field se distinguished rakhता hai. Alag collections sirf tab behtar choice hain jab variants mein lगभग kुछ bhi common nahi hai.',
      },
      {
        wrong: `// a "big bang" migration: rewrite every document to the new schema at once
// a script that reads all 40 million user documents and rewrites each one --
// hours of load, a maintenance window, and if it fails halfway the collection
// is left in a mixed state with no version marker to recover from`,
        right: `// schema versioning: new writes use v2, the read path handles v1 AND v2,
// old docs upgrade lazily (rewritten as v2 on their next update for any reason)
// or via a low-priority background sweep -- no downtime, resumable, and the
// schemaVersion field makes the current state of any document unambiguous`,
        why: 'Rewriting every document in a large collection to a new schema in a single operation requires reading and writing the entire collection at once, which imposes heavy load, often needs a maintenance window during which the application is degraded or offline, and leaves the collection in an inconsistent partial state if it fails partway with no clean way to tell which documents were converted. The schema versioning pattern avoids all of this by making the transition gradual: every document carries a schemaVersion field, new writes always produce the current version, the application read path is written to understand every version present in the data, and existing documents are upgraded opportunistically, either the next time they happen to be written for any reason or by a background job that processes them slowly at low priority. The migration then has no downtime, can be paused and resumed freely, and the schemaVersion field means the shape of any individual document is always unambiguous.',
        whyHi: 'Ek large collection mein har document ko ek single operation mein ek naye schema mein rewrite karना poori collection ko ek saath read aur write karना require karता hai, jo heavy load imposes karता hai aur agar ye partway fail hota hai to collection ko ek inconsistent partial state mein chhoड़ता hai. Schema versioning pattern transition ko gradual banакar is sab ko avoid karता hai: har document ek `schemaVersion` field carry karता hai, naye writes hamesha current version produce karते hain, aur existing documents opportunistically upgrade hote hain.',
      },
      {
        wrong: `// storing only parentId, then needing "the whole subtree" constantly
{ _id: 4, name: "Deep Category", parentId: 2 }
// every "show this category and all its descendants" page now walks the tree
// level by level -- N queries for a tree N levels deep, or a $graphLookup on
// every page load`,
        right: `// add an ancestors array so subtree reads are a single indexed query:
{ _id: 4, name: "Deep Category", parentId: 2, ancestors: [1, 2] }
// db.categories.find({ ancestors: 2 }) returns the entire subtree at any depth,
// with an index on "ancestors" -- one query regardless of tree depth`,
        why: 'The parent-reference encoding stores only each node\'s immediate parent, which makes finding a node\'s direct children a single query but makes finding an entire subtree an operation whose cost grows with the tree\'s depth, since it must be done level by level or with a recursive aggregation stage on every request. When the frequent operation for a hierarchy is reading a whole subtree, which is typical for category trees, org charts, and comment threads, this encoding puts the expensive path on the common case. Storing an array of all of a node\'s ancestors on each node makes a whole-subtree query a single indexed lookup for any node at any depth, moving the cost instead onto node moves, which require updating the ancestors array of the moved node and all its descendants, and are typically rare. Matching the cheap operation to the frequent one is the point of choosing a tree encoding deliberately.',
        whyHi: 'Parent-reference encoding sirf har node ka immediate parent store karता hai, jo ek node ke direct children dhoondна ek single query banata hai par ek poore subtree dhoondна ek operation banata hai jiski cost tree ki depth ke saath badhती hai. Jab ek hierarchy ke liye frequent operation ek poora subtree padhना hai, ye encoding expensive path ko common case par rakhता hai. Har node par ek node ke saare ancestors ka ek array store karna ek whole-subtree query ko kisī bhi depth par kisī bhi node ke liye ek single indexed lookup banata hai.',
      },
    ],

    realWorld: [
      {
        en: '**A `content` collection holding articles, videos, and podcasts with a `type` field** — the home feed, search, and "recently published" all query the one collection; type-specific rendering happens in the frontend based on `type`.',
        hi: '**Ek `content` collection jo articles, videos, aur podcasts ko ek `type` field ke saath rakhti hai** — home feed, search, sab ek collection query karte hain.',
      },
      {
        en: '**A `users` collection carrying `schemaVersion`** through three shape changes over two years — new signups always write the latest version, a nightly job upgrades ~100k old documents, and the read layer still handles all three.',
        hi: '**Ek `users` collection jo `schemaVersion` carry karti hai** teen shape changes ke through — naye signups hamesha latest version likhte hain.',
      },
      {
        en: '**A category tree with an `ancestors` array on every node** — the storefront\'s "browse this department and everything in it" is `find({ ancestors: deptId })`, one indexed query regardless of how deep the tree goes.',
        hi: '**Ek category tree har node par ek `ancestors` array ke saath** — storefront ki "is department aur ismein sab kuch browse karo" ek indexed query hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the polymorphic pattern, and when should you use one collection versus separate collections for variant document types?',
        qHi: 'Polymorphic pattern kya hai, aur aapको variant document types ke liye ek collection versus alag collections kab istemal karna chahiye?',
        a: 'The polymorphic pattern stores documents that are variations on a shared concept in a single collection, with a discriminator field such as kind or type naming which variant each document is. All the variants share a common core of fields, and each adds its own variant-specific fields; queries over the common fields span every variant naturally, and queries for variant-specific fields filter by the discriminator first. You use one collection when the variants are routinely handled together as one set, shown in a shared feed, searched as one, sorted and paginated as one, because a single collection lets the database do that ordering and pagination across the whole set in one query, whereas separate collections would force the application to query each one and merge and re-sort the results itself. You use separate collections only in the less common case where the variants have almost nothing in common and are essentially never queried together, so the shared-collection benefits do not apply and keeping them apart is cleaner.',
        aHi: 'Polymorphic pattern un documents ko jo ek shared concept par variations hain ek single collection mein store karता hai, ek discriminator field ke saath. Saare variants fields ka ek common core share karते hain. Aap ek collection istemal karते ho jab variants routinely ek set ke roop mein saath handle kiye jaते hain, kyunki ek single collection database ko us ordering aur pagination ko poore set ke across ek query mein karne deता hai. Aap alag collections sirf us kam common case mein istemal karते ho jahaan variants mein lगभग kुछ bhi common nahi hai.',
      },
      {
        q: 'Why use schema versioning instead of a one-time migration, and how does it work?',
        qHi: 'Ek one-time migration ke bजाy schema versioning kyun istemal karें, aur ye kaise kaam karता hai?',
        a: 'A one-time migration rewrites every document in a collection to the new schema in a single operation, which for a large collection imposes heavy load, typically requires a maintenance window, and leaves the data in an inconsistent partial state if it fails partway with no reliable way to identify which documents were converted. Schema versioning makes the transition gradual and safe instead. Every document carries a schemaVersion field indicating which shape it uses. New writes always produce the current version. The application read path is written to understand every version currently present in the data, adapting its handling based on each document\'s schemaVersion. Existing documents are then upgraded opportunistically rather than all at once: a document is rewritten to the current version the next time it is updated for any reason, which is lazy migration, and optionally a low-priority background job also sweeps through converting old documents slowly. The result is a migration with no downtime that can be paused and resumed freely, and the schemaVersion field means the exact shape of any individual document is always unambiguous.',
        aHi: 'Ek one-time migration ek collection mein har document ko ek single operation mein naye schema mein rewrite karता hai, jo ek large collection ke liye heavy load imposes karता hai aur agar ye partway fail hota hai to data ko ek inconsistent state mein chhoड़ता hai. Schema versioning transition ko gradual aur safe banata hai: har document ek `schemaVersion` field carry karता hai, naye writes hamesha current version produce karते hain, application read path har version ko samajhne ke liye likha jaता hai, aur existing documents opportunistically upgrade hote hain.',
      },
    ],

    exercises: [
      {
        task: 'Model the polymorphic pattern: a `content` collection with an `article` document (`kind`, `title`, `body`) and a `video` document (`kind`, `title`, `durationSec`, `url`). Insert three (two articles, one video). Query `find({ kind: "video" })` and confirm only the video comes back, with its variant-specific fields.',
        taskHi: 'Polymorphic pattern model karo: ek `content` collection ek `article` document aur ek `video` document ke saath. Teen insert karo. `find({ kind: "video" })` query karo.',
        hint: 'One collection, a `kind` discriminator field. Common fields (`title`) query across all; variant fields filter by `kind` first. Right when the variants are handled together (one feed, one search).',
        hintHi: 'Ek collection, ek `kind` discriminator field. Common fields sab ke across query hote hain; variant fields pehle `kind` se filter hote hain.',
      },
      {
        task: 'Model schema versioning: a `users` collection with a v1 document (`schemaVersion: 1`, `name: "Ravi Kumar"`) and a v2 document (`schemaVersion: 2`, `firstName`, `lastName`). Write read-side code that produces the display name for each — `.name` for v1, `firstName + " " + lastName` for v2.',
        taskHi: 'Schema versioning model karo: ek `users` collection ek v1 document aur ek v2 document ke saath. Read-side code likho jo har ek ke liye display name produce karta hai.',
        hint: 'The read path handles every version present. New writes use the latest; old documents upgrade lazily (on their next write) or via a background job — no big-bang migration.',
        hintHi: 'Read path har maujood version handle karta hai. Naye writes latest use karte hain; purane documents lazily upgrade hote hain.',
      },
      {
        task: 'Model a tree with an `ancestors` array: a `categories` collection with Root (id 1), A (id 2, parent 1), B (id 3, parent 1), A1 (id 4, parent 2). Each node stores `parentId` and `ancestors`. Query `find({ ancestors: 2 })` (whole subtree under A) and `find({ parentId: 1 })` (direct children of Root).',
        taskHi: 'Ek `ancestors` array ke saath ek tree model karo: ek `categories` collection Root, A, B, A1 ke saath. Har node `parentId` aur `ancestors` store karta hai.',
        hint: '`ancestors: [1, 2]` on A1 means `find({ ancestors: 2 })` returns the whole subtree under node 2 at any depth in ONE indexed query. `parentId` gives direct children only.',
        hintHi: 'A1 par `ancestors: [1, 2]` matlab `find({ ancestors: 2 })` node 2 ke neeche poora subtree EK indexed query mein lautaता hai.',
      },
    ],

    keyTakeaways: [
      'POLYMORPHIC: variants of a shared concept in ONE collection with a `kind`/`type` discriminator field. Common fields query across all; variant-specific fields filter by `kind` first. Right when variants are handled TOGETHER (one feed, one search, one sort) — separate collections only when they have almost nothing in common and are never queried together.',
      'SCHEMA VERSIONING: tag each document with a `schemaVersion`; the application READ PATH handles EVERY version present in the data. New writes always use the latest version. Old documents upgrade LAZILY (rewritten on their next update for any reason) or via a low-priority background job — NO big-bang migration (which risks a maintenance window + an unrecoverable partial state on failure).',
      'TREE ENCODINGS, trading which op is cheap: `parentId` alone (simple; "direct children" is easy, but "whole subtree" needs level-by-level walking or `$graphLookup`). ARRAY OF ANCESTORS (`ancestors: [root, ..., parent]` — "whole subtree" = one indexed `find({ ancestors: X })`; cost: moving a node updates it + every descendant). MATERIALIZED PATH (`",1,2,4,"` string, anchored-regex-queryable).',
      'The ANCESTORS-ARRAY encoding is the common default: subtree reads (frequent for most hierarchies) are one cheap indexed query; node moves (rare) are the expensive op — usually the right way round.',
      'All three patterns keep shape-varying documents QUERYABLE IN ONE COLLECTION — by kind (polymorphic), by age (schema versioning), or by hierarchy position (tree). Match the cheap operation to the frequent one.',
    ],
    keyTakeawaysHi: [
      'POLYMORPHIC: ek shared concept ke variants EK collection mein ek `kind`/`type` discriminator field ke saath. Common fields sab ke across query hote hain; variant-specific fields pehle `kind` se filter hote hain. Sahi jab variants SAATH handle kiye jaते hain.',
      'SCHEMA VERSIONING: har document ko ek `schemaVersion` se tag karो; application READ PATH data mein maujood HAR version handle karता hai. Naye writes hamesha latest version istemal karते hain. Purane documents LAZILY upgrade hote hain — KOI big-bang migration nahi.',
      'TREE ENCODINGS: akela `parentId` (simple; "whole subtree" ko level-by-level walk chahiye). ARRAY OF ANCESTORS ("whole subtree" = ek indexed `find({ ancestors: X })`; cost: ek node move karna use + har descendant update karता hai). MATERIALIZED PATH (`",1,2,4,"` string).',
      'ANCESTORS-ARRAY encoding common default hai: subtree reads (frequent) ek sasti indexed query hain; node moves (rare) expensive op hain.',
      'Teenon patterns shape-varying documents ko EK COLLECTION MEIN QUERYABLE rakhте hain — kind se, age se, ya hierarchy position se. Sasti operation ko frequent se match karो.',
    ],
  },

  {
    slug: 'mongo-denormalization-and-sync',
    title: 'Denormalization & Keeping Copies in Sync',
    titleHi: 'Denormalization Aur Copies Sync Mein Rakhna',
    description: 'Embedding and extended references mean the same fact is stored in more than one place. That duplication is the point — it makes reads fast — but every duplicated fact now has to be updated everywhere it lives, and this lesson is about doing that deliberately.',
    descriptionHi: 'Embedding aur extended references matlab wahi fact ek se zyada jagah store hota hai. Wo duplication hi point hai — ye reads fast banata hai — par har duplicated fact ab har jagah update hona chahiye jahaan wo rehта hai, aur ye lesson ise deliberately karne ke baare hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 6,

    analogy: {
      en: '**A restaurant that prints its prices on the menu, on the table tents, on the website, and on the daily specials board — fast for the customer to see, but a price change means updating four places, and if you miss one, a customer is quoted the wrong price.** Denormalization is choosing to print the price in all four spots because customers look at prices constantly and you never want them waiting while someone checks the master price list. The discipline is: when a price changes, you have a checklist of every place it appears and you update all of them, ideally in one coordinated pass. Some places tolerate being briefly out of date (the printed menu gets reprinted weekly); some must never be wrong (the till). Knowing which is which — and having the update checklist — is the whole job.',
      hi: '**Ek restaurant jo apni prices menu par, table tents par, website par, aur daily specials board par print karता hai — customer ke dekhne ke liye fast, par ek price change matlab chaar jagah update karना, aur agar aap ek miss karते ho, ek customer ko galat price quote hoती hai.** Denormalization price ko chaаron spots par print karne ka choice hai kyunki customers prices lगातार dekhते hain. Discipline ye hai: jab ek price badalती hai, aapke paas har jagah ki ek checklist hai jahaan wo aati hai aur aap sabko update karते ho. Kुछ jagahें briefly out of date rehне ko tolerate karती hain; kुछ ko kabhi galat nahi hona chahiye. Kaunसा kaunसा hai jaanना — aur update checklist rakhна — poora kaam hai.',
    },

    simple: `**Denormalization = the same fact stored in multiple places, on purpose, for read speed**

\`\`\`js
db.authors: { _id: 7, name: "Ravi Kumar" }                          // source of truth
db.posts:   { _id: 1, author: { _id: 7, name: "Ravi Kumar" } }      // a copy (extended ref)
db.posts:   { _id: 2, author: { _id: 7, name: "Ravi Kumar" } }      // another copy
\`\`\`

**A change to the fact must update the SOURCE and EVERY copy -- a "fan-out write"**

\`\`\`js
// author renames -- BOTH of these, ideally close together:
await db.authors.updateOne({ _id: 7 }, { $set: { name: "Ravi K. Kumar" } });
await db.posts.updateMany({ "author._id": 7 }, { $set: { "author.name": "Ravi K. Kumar" } });
\`\`\`

**Forget the fan-out -> STALE copies**

\`\`\`js
// only updated the source:
await db.authors.updateOne({ _id: 7 }, { $set: { name: "Ravi K. Kumar" } });
// db.posts still shows "Ravi Kumar" everywhere -- the copies are now WRONG
\`\`\`

**IS staleness OK here? -> a display name: briefly stale is fine. An account balance
shown as authoritative: never. Decide per field.**

**ANTI-PATTERNS this lesson closes on:**
\`\`\`
- unbounded embedded arrays (Lesson 2)
- bloated documents: fields 99% of reads don't need, dragged along on every read
- too many collections: one collection per user/tenant instead of a field + index
\`\`\``,

    simpleHi: `**Denormalization = wahi fact multiple jagah store, jaan-boojhkar, read speed ke liye**

\`\`\`js
db.authors: { _id: 7, name: "Ravi Kumar" }                          // source of truth
db.posts:   { _id: 1, author: { _id: 7, name: "Ravi Kumar" } }      // ek copy (extended ref)
db.posts:   { _id: 2, author: { _id: 7, name: "Ravi Kumar" } }      // ek aur copy
\`\`\`

**Fact ka ek change SOURCE aur HAR copy ko update karना chahiye -- ek "fan-out write"**

\`\`\`js
await db.authors.updateOne({ _id: 7 }, { $set: { name: "Ravi K. Kumar" } });
await db.posts.updateMany({ "author._id": 7 }, { $set: { "author.name": "Ravi K. Kumar" } });
\`\`\`

**Fan-out bhool jaओ -> STALE copies**

\`\`\`js
await db.authors.updateOne({ _id: 7 }, { $set: { name: "Ravi K. Kumar" } });
// db.posts abhi bhi har jagah "Ravi Kumar" dikhाता hai -- copies ab GALAT hain
\`\`\`

**KYA staleness yahaan OK hai? -> ek display name: briefly stale theek. Ek account balance
jo authoritative dikhाya jaता hai: kabhi nahi. Prati-field decide karो.**

**ANTI-PATTERNS jispar ye lesson close karता hai:**
\`\`\`
- unbounded embedded arrays (Lesson 2)
- bloated documents: fields jo 99% reads ko nahi chahiye
- bahut zyada collections: ek collection prati user/tenant ek field + index ke bजाy
\`\`\``,

    content: `## Denormalization is a choice, with a bill

Modules 1-12 taught normalization: each fact in exactly one place. MongoDB modeling deliberately does the opposite — embedding and extended references (Lessons 1, 3) store the same fact in multiple documents *on purpose*, because it makes the common read a single fast lookup. That is denormalization, and it is the right call for read-heavy data. But it comes with a bill: **every duplicated fact now has to be maintained in every place it lives.**

## The fan-out write

When a denormalized fact changes, the update must touch the source of truth *and every copy*:

\`\`\`js
await db.authors.updateOne({ _id: 7 }, { $set: { name: "Ravi K. Kumar" } });
await db.posts.updateMany({ "author._id": 7 }, { $set: { "author.name": "Ravi K. Kumar" } });
\`\`\`

The \`updateMany\` with a filter on \`"author._id"\` finds every post carrying a copy of that author and updates the embedded \`author.name\` in all of them. For a copy that appears in several collections, there is one such statement per collection. This is a **fan-out write**: one logical change becomes several physical writes.

Practical ways to manage it:

- **Do the writes together in application code**, immediately after each other, so the window of inconsistency is milliseconds. (A multi-document transaction — Module 16 — can make them atomic if that matters.)
- **Emit an event** ("author 7 renamed") and let a subscriber perform the fan-out asynchronously — accepting a short delay in exchange for keeping the user-facing rename fast.
- **Run a reconciliation job** periodically that re-syncs copies from their source, as a backstop against missed updates.

## Forgetting the fan-out

If code updates the source but not the copies, the copies go stale:

\`\`\`js
// only the source was updated:
await db.authors.updateOne({ _id: 7 }, { $set: { name: "Ravi K. Kumar" } });
// db.posts still shows "Ravi Kumar" -- every embedded copy is now wrong
\`\`\`

This is the failure mode of denormalization, and it is why every denormalized field needs a documented, tested update path — not an update that happens to be written next to the source update today and gets forgotten when someone adds a second way to rename an author next year.

## Is staleness acceptable here?

The question to ask for each denormalized field: **if this copy is briefly out of date, does it matter?**

- **Usually fine**: a display name, an avatar, a category label, a cached count that is "about right." A post showing the author's slightly-old name for a few seconds after a rename is a non-issue.
- **Never acceptable**: anything presented as authoritative and acted upon — an account balance, an inventory count used to accept an order, a permission or role. These should not be denormalized copies at all; read them live from the source of truth.

Denormalize the fields where "eventually consistent" is genuinely fine, and keep the fields where correctness is critical as single-source references.

## The anti-patterns, collected

This lesson closes Module 14, so here are the modeling mistakes to actively avoid:

1. **Unbounded embedded arrays** (Lesson 2) — the big one. Any array that grows one entry per event, forever, belongs in its own collection.
2. **Bloated documents** — a document carrying large fields that the vast majority of reads do not need (a raw import payload, a full-resolution image blob, a huge audit trail). Every read of that document drags the bloat along. Move rarely-needed bulk to a separate collection keyed by the same \`_id\`, fetched only when actually required.
3. **Too many collections** — creating a collection per user, per tenant, or per category (\`orders_cust1\`, \`orders_cust2\`, ...) instead of one \`orders\` collection with a \`custId\` field and an index. MongoDB is built for large collections with good indexes, not thousands of tiny ones; per-entity collections make cross-entity queries impossible and exhaust internal limits.
4. **Modeling relationally** (Lesson 1) — one collection per "table," everything referenced, \`$lookup\` on every read.

Good MongoDB modeling is: embed what is read together and bounded, reference what is shared or unbounded, extended-reference the few fields that skip a hot \`$lookup\`, compute the aggregates you show constantly, and keep every denormalized copy on a real update path. Module 15 makes all of this fast with aggregation and indexes; Module 16 covers running it in production.`,

    contentHi: `## Denormalization ek choice hai, ek bill ke saath

MongoDB modeling deliberately normalization ke opposite karता hai — embedding aur extended references wahi fact ko multiple documents mein *jaan-boojhkar* store karते hain. Wo denormalization hai. Par ye ek bill ke saath aata hai: **har duplicated fact ab har jagah maintain hona chahiye jahaan wo rehта hai.**

## Fan-out write

Jab ek denormalized fact badalता hai, update ko source of truth *aur har copy* ko touch karना chahiye:

\`\`\`js
await db.authors.updateOne({ _id: 7 }, { $set: { name: "Ravi K. Kumar" } });
await db.posts.updateMany({ "author._id": 7 }, { $set: { "author.name": "Ravi K. Kumar" } });
\`\`\`

Ise manage karne ke practical tarike:

- **Application code mein writes saath karो**, taaki inconsistency window milliseconds ho.
- **Ek event emit karो** ("author 7 renamed") aur ek subscriber ko fan-out asynchronously karne do.
- **Ek reconciliation job chalाओ** jo periodically copies ko unke source se re-sync karता hai.

## Fan-out bhool jाना

Agar code source update karता hai par copies nahi, copies stale ho jaती hain. Ye denormalization ka failure mode hai, aur isिlye har denormalized field ko ek documented, tested update path chahiye.

## Kya staleness yahaan acceptable hai?

Har denormalized field ke liye poochne waला sawaal: **agar ye copy briefly out of date hai, kya matter karता hai?**

- **Usually theek**: ek display name, ek avatar, ek category label.
- **Kabhi acceptable nahi**: kुछ bhi jo authoritative presented aur acted upon hai — ek account balance, ek inventory count. Ye denormalized copies bilkul nahi hone chahiye; unhe source of truth se live padhо.

## Anti-patterns, collected

1. **Unbounded embedded arrays** (Lesson 2) — bada waala.
2. **Bloated documents** — large fields jo zyadातार reads ko nahi chahiye. Rarely-needed bulk ko ek alag collection mein move karो.
3. **Bahut zyada collections** — ek collection prati user/tenant ek \`orders\` collection ke bजाy.
4. **Relationally modeling** (Lesson 1).

Achhा MongoDB modeling: jo saath padhа jaता hai aur bounded hai use embed karो, jo shared ya unbounded hai use reference karो, un кुछ fields ko extended-reference karो jo ek hot \`$lookup\` skip karते hain, aggregates compute karो, aur har denormalized copy ko ek real update path par rakhो.`,

    examples: [
      {
        title: 'The fan-out write: rename an author, update the source AND the embedded copies',
        titleHi: 'Fan-out write: ek author rename karo, source AUR embedded copies update karo',
        code: `await db.authors.insertOne({ _id: 7, name: "Ravi Kumar" });
await db.posts.insertMany([
  { _id: 1, title: "A", author: { _id: 7, name: "Ravi Kumar" } },
  { _id: 2, title: "B", author: { _id: 7, name: "Ravi Kumar" } },
]);
await db.authors.updateOne({ _id: 7 }, { $set: { name: "Ravi K. Kumar" } });
await db.posts.updateMany({ "author._id": 7 }, { $set: { "author.name": "Ravi K. Kumar" } });
print(await db.posts.find({}).project({ _id: 0, title: 1, "author.name": 1 }).sort({ _id: 1 }).toArray());`,
        output: `[{"title":"A","author":{"name":"Ravi K. Kumar"}},{"title":"B","author":{"name":"Ravi K. Kumar"}}]`,
        explain: 'The full fan-out write: `updateOne` changes the source-of-truth `authors` document, and `updateMany({ "author._id": 7 }, ...)` finds every post carrying a copy of that author and updates the embedded `author.name` in all of them. After both, the source and all copies agree — one logical change, several physical writes.',
        explainHi: 'Poora fan-out write: `updateOne` source-of-truth `authors` document badalता hai, aur `updateMany({ "author._id": 7 }, ...)` har post dhoondता hai jo us author ki ek copy carry karta hai aur un sabme embedded `author.name` update karता hai. Dono ke baad, source aur saari copies agree karte hain.',
      },
      {
        title: 'Forgetting the fan-out: the source changes but the copies go stale',
        titleHi: 'Fan-out bhoolna: source badalta hai par copies stale ho jaati hain',
        code: `await db.authors.insertOne({ _id: 7, name: "Ravi Kumar" });
await db.posts.insertMany([
  { _id: 1, author: { _id: 7, name: "Ravi Kumar" } },
  { _id: 2, author: { _id: 7, name: "Ravi Kumar" } },
]);
await db.authors.updateOne({ _id: 7 }, { $set: { name: "Ravi K. Kumar" } });
print((await db.authors.findOne({ _id: 7 })).name);
print((await db.posts.find({}).toArray()).map(p => p.author.name));`,
        output: `Ravi K. Kumar
["Ravi Kumar","Ravi Kumar"]`,
        explain: 'Only the `authors` document was updated — the `updateMany` on `posts` was skipped. The source now reads "Ravi K. Kumar" but both embedded copies still say the stale "Ravi Kumar". This is denormalization\'s failure mode: a missed fan-out leaves the copies wrong, silently, until something re-syncs them.',
        explainHi: 'Sirf `authors` document update hua — `posts` par `updateMany` skip hua. Source ab "Ravi K. Kumar" padhता hai par dono embedded copies abhi bhi stale "Ravi Kumar" kehти hain. Ye denormalization ka failure mode hai: ek missed fan-out copies ko galat chhoड़ता hai, silently.',
      },
      {
        title: 'Bloated-document fix: keep rarely-needed bulk in a separate collection, same _id',
        titleHi: 'Bloated-document fix: rarely-needed bulk ko ek alag collection mein rakho, same _id',
        code: `await db.orders.insertOne({ _id: 1, total: 4999, status: "shipped" });
await db.order_raw.insertOne({ _id: 1, rawImportPayload: "x".repeat(500000) });
print(await db.orders.findOne({ _id: 1 }));
print((await db.order_raw.findOne({ _id: 1 })).rawImportPayload.length);`,
        output: `{"_id":1,"total":4999,"status":"shipped"}
500000`,
        explain: 'The bloated-document fix: the hot fields (`total`, `status`) stay on the small `orders` document that list views and dashboards read constantly, while the large, rarely-needed `rawImportPayload` moves to a sibling `order_raw` collection keyed by the same `_id`. The common read is small and fast; the rare "show the raw payload" read does one extra `findOne` by `_id`.',
        explainHi: 'Bloated-document fix: hot fields (`total`, `status`) chhote `orders` document par rehते hain jise list views aur dashboards lगातार padhते hain, jabki large, rarely-needed `rawImportPayload` wahi `_id` se keyed ek sibling `order_raw` collection mein move hota hai. Common read chhota aur fast hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// denormalizing a value that must always be correct when acted upon
{ _id: 100, customerId: 5, customerCreditLimit: 50000 }   // a copy on the order
// the credit limit is later reduced to 10000 on the customer, but this order
// still says 50000 -- and someone approves a 40000 charge against the stale copy`,
        right: `// never denormalize a value that is authoritative for a decision --
// read it live from the source of truth at decision time:
const customer = await db.customers.findOne({ _id: order.customerId });
if (charge <= customer.creditLimit) { /* approve */ }
// the order can carry a display copy, but the DECISION uses the live value`,
        why: 'Denormalization is only safe for values where a briefly stale copy causes no real harm, because keeping copies perfectly synchronized with their source at all times is not something the pattern guarantees. A value that is authoritative for a decision, such as a credit limit used to approve a charge, an account balance used to permit a withdrawal, or a permission used to allow an action, must reflect the current true state at the moment the decision is made, and a denormalized copy can lag behind the source between the source changing and the fan-out update completing, or indefinitely if a fan-out is missed. Acting on a stale copy of such a value produces a concretely wrong outcome, like approving a charge that should have been declined. Values like these should not be denormalized at all for decision purposes; the decision code should read them live from the source of truth, even if a display-only copy is also kept elsewhere.',
        whyHi: 'Denormalization sirf un values ke liye safe hai jahaan ek briefly stale copy koi real harm nahi karता. Ek value jo ek decision ke liye authoritative hai, jaisा ek credit limit ya ek account balance, ko us moment ki current true state reflect karना chahiye jab decision liya jaता hai, aur ek denormalized copy source ke badalne aur fan-out ke complete hone ke beech lag kar sakती hai. Aisी values decision purposes ke liye bilkul denormalized nahi honi chahiye; decision code ko unhe source of truth se live padhना chahiye.',
      },
      {
        wrong: `// creating a collection per tenant to "keep data separated"
db.orders_acme, db.orders_globex, db.orders_initech, /* ...one per customer... */
// now: "total orders across all tenants" is impossible without iterating every
// collection, adding a tenant means creating a collection, and thousands of
// collections strain MongoDB's internal metadata limits`,
        right: `// one collection, a tenantId field, and an index that leads with tenantId:
db.orders.createIndex({ tenantId: 1, createdAt: -1 })
db.orders.find({ tenantId: "acme" }).sort({ createdAt: -1 })
// per-tenant queries are as fast as separate collections (the index isolates
// them), and cross-tenant queries and analytics are simple`,
        why: 'MongoDB is designed for a modest number of collections each holding many documents, with query performance coming from indexes rather than from physical separation, so creating a separate collection per tenant, user, or category works against the design. It makes any query that spans entities, such as a total across all tenants or a report over the whole dataset, require iterating over every collection in application code, it turns adding a new entity into a schema operation, and a large number of collections consumes internal metadata resources that are not sized for thousands of them. The correct approach is a single collection with a field identifying the tenant and a compound index whose first field is that tenant identifier, which makes per-tenant queries just as efficient as a dedicated collection would be, because the index restricts the scan to that tenant\'s documents, while keeping cross-tenant queries and analytics straightforward.',
        whyHi: 'MongoDB ek modest number of collections ke liye design kiya gaya hai jinme har ek bahut documents hain, query performance indexes se aati hai physical separation se nahi. Prati-tenant ek alag collection banана design ke khilaf kaam karता hai: ye kisī bhi cross-entity query ko har collection par iterate karne ke liye force karता hai, aur ek large number of collections internal metadata resources consume karता hai. Sahi approach ek single collection ek tenantId field aur ek compound index ke saath hai jiska pehla field wo tenant identifier hai.',
      },
      {
        wrong: `// carrying a large, rarely-read field on the main document
{ _id: 1, status: "shipped", total: 4999,
  rawWebhookPayload: { /* 800KB of provider data almost no query ever reads */ } }
// every list of orders, every dashboard tile, every status check loads that
// 800KB along with the fields it actually wants`,
        right: `// split the bulk into a sibling collection keyed by the same _id:
db.orders:     { _id: 1, status: "shipped", total: 4999 }
db.orders_raw: { _id: 1, rawWebhookPayload: { /* 800KB */ } }
// the common reads hit db.orders (small, fast); the rare "show me the raw
// payload" read does one extra findOne on db.orders_raw by _id`,
        why: 'A document is loaded in its entirety whenever it is read, so a field that is large but needed by only a small fraction of queries still imposes its full transfer and memory cost on every other query that touches the document, including list views, dashboard summaries, and status checks that only want a few small fields. Splitting that large, rarely-needed field into a separate collection whose documents share the same _id keeps the main document small and fast for the common reads, and the occasional query that genuinely needs the bulk data performs one additional lookup by _id to retrieve it. This is the same reasoning as choosing not to embed unbounded data, applied to data that is bounded but heavy: keep the hot document lean, and pay the extra lookup only on the cold path that actually needs the weight.',
        whyHi: 'Ek document jab bhi padhа jaता hai poora load hota hai, to ek field jo large hai par sirf queries ke ek chhote hisse ko chahiye phir bhi apni full transfer aur memory cost har doosri query par impose karता hai jo document ko touch karती hai. Us large, rarely-needed field ko ek alag collection mein split karna jiske documents wahi `_id` share karते hain main document ko common reads ke liye chhota aur fast rakhता hai.',
      },
    ],

    realWorld: [
      {
        en: '**An "author renamed" domain event that triggers a background worker to `updateMany` the embedded author copies across `posts`, `comments`, and `activity`** — the rename returns instantly; the copies converge within seconds.',
        hi: '**Ek "author renamed" domain event jo ek background worker ko `posts`, `comments` ke across embedded author copies `updateMany` karne ke liye trigger karta hai**.',
      },
      {
        en: '**A nightly reconciliation job that re-derives every post\'s `commentCount` from the `comments` collection** — a cheap backstop that corrects any drift from a missed `$inc` without anyone noticing.',
        hi: '**Ek nightly reconciliation job jo har post ka `commentCount` `comments` collection se re-derive karta hai** — ek sasta backstop.',
      },
      {
        en: '**An orders schema split into `orders` (small, hot) and `order_documents` (invoices, labels, raw payloads — large, cold), both keyed by the order id** — order lists and dashboards never touch the heavy collection.',
        hi: '**Ek orders schema `orders` (chhota, hot) aur `order_documents` (large, cold) mein split, dono order id se keyed**.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a fan-out write, and what are the strategies for keeping denormalized copies in sync?',
        qHi: 'Ek fan-out write kya hai, aur denormalized copies ko sync mein rakhने ki strategies kya hain?',
        a: 'A fan-out write is when a single logical change to a fact that has been denormalized, meaning copied into multiple documents for read performance, requires several physical write operations: one to update the source of truth, and one per collection to update every copy of that fact. For example, renaming an author requires updating the authors document and then an updateMany against every collection that embeds a copy of the author name, such as posts and comments. There are three main strategies for managing this. The first is to perform all the writes together in application code, immediately after one another, so the window during which copies are inconsistent is only milliseconds, optionally wrapping them in a multi-document transaction if atomicity is required. The second is to emit a domain event describing the change and have a background subscriber perform the fan-out asynchronously, which keeps the user-facing operation fast and accepts a brief propagation delay. The third is to run a periodic reconciliation job that re-derives or re-copies denormalized values from their source, serving as a backstop that corrects any drift caused by a fan-out that was missed or failed. These strategies are often combined: synchronous or event-driven updates for timeliness, plus a reconciliation job for safety.',
        aHi: 'Ek fan-out write tab hai jab ek denormalized fact ka ek single logical change кई physical write operations require karता hai: ek source of truth update karne ke liye, aur ek prati collection us fact ki har copy update karne ke liye. Iske teen main strategies hain: (1) saare writes application code mein saath karो; (2) ek domain event emit karो aur ek background subscriber ko fan-out asynchronously karne do; (3) ek periodic reconciliation job chalाओ jo denormalized values ko unke source se re-derive karता hai.',
      },
      {
        q: 'How do you decide whether a field is safe to denormalize, and what are the main MongoDB modeling anti-patterns?',
        qHi: 'Aap kaise decide karte ho ki ek field denormalize karna safe hai, aur main MongoDB modeling anti-patterns kya hain?',
        a: 'A field is safe to denormalize when a briefly stale copy of it causes no real harm, which is true for display-oriented values like a name, an avatar, a label, or an approximate count, where showing a slightly out-of-date value for a few seconds after a change is a non-issue. A field is not safe to denormalize when it is authoritative for a decision and acted upon, such as an account balance used to permit a withdrawal, a credit limit used to approve a charge, or a permission used to allow an action, because a stale copy of such a value leads to a concretely wrong outcome; these should be read live from the source of truth at decision time. The main modeling anti-patterns are: embedding an unbounded array that grows one entry per event forever, which eventually hits the 16MB limit; bloated documents that carry large fields the vast majority of reads do not need, imposing that weight on every read; creating too many collections, such as one per user or tenant, instead of one collection with an identifying field and an index, which breaks cross-entity queries and strains internal limits; and modeling relationally by splitting every group of fields into its own collection and joining with $lookup on every read, which discards the document model\'s main advantage.',
        aHi: 'Ek field denormalize karna safe hai jab iski ek briefly stale copy koi real harm nahi karती — display-oriented values jaisा ek name ya ek label. Ek field safe nahi hai jab ye ek decision ke liye authoritative hai aur acted upon hai. Main anti-patterns hain: ek unbounded array embed karna; bloated documents; bahut zyada collections banана; aur relationally modeling karना.',
      },
    ],

    exercises: [
      {
        task: 'Set up the extended-reference scenario: an `authors` doc `{ _id: 7, name: "Ravi Kumar" }` and two `posts` each embedding `author: { _id: 7, name: "Ravi Kumar" }`. Perform the full fan-out rename: `updateOne` on `authors` AND `updateMany` on `posts` filtered by `"author._id": 7`. Confirm all three now say "Ravi K. Kumar".',
        taskHi: 'Extended-reference scenario set up karo: ek `authors` doc aur do `posts` jo `author` embed karte hain. Poora fan-out rename perform karo: `authors` par `updateOne` AUR `posts` par `updateMany`.',
        hint: 'The `updateMany` filter `{ "author._id": 7 }` finds every post carrying that author copy; `$set: { "author.name": ... }` updates the embedded field in all of them. One fan-out write = source + one updateMany per collection.',
        hintHi: '`updateMany` filter `{ "author._id": 7 }` har post dhoondता hai jo us author copy ko carry karta hai.',
      },
      {
        task: 'Repeat the setup, but this time update ONLY the `authors` document (skip the `updateMany`). Read back the source name and the embedded copies. Confirm the source is "Ravi K. Kumar" but both copies are still the stale "Ravi Kumar" — the failure mode of a missed fan-out.',
        taskHi: 'Setup dohраओ, par is baar SIRF `authors` document update karo (`updateMany` skip karo). Source name aur embedded copies wapas padho.',
        hint: 'Updating the source without the copies leaves the copies stale. This is why every denormalized field needs a documented, tested update path — not one that happens to sit next to the source update today.',
        hintHi: 'Source ko copies ke bina update karna copies ko stale chhoड़ता hai. Isिlye har denormalized field ko ek documented update path chahiye.',
      },
      {
        task: 'Model the bloated-document fix: an `orders` collection with just `{ _id, total, status }`, and a sibling `order_raw` collection with `{ _id, rawImportPayload }` (a ~500KB string) keyed by the same `_id`. Confirm `findOne` on `orders` is small, and the raw payload is retrievable with one extra `findOne` on `order_raw` by `_id`.',
        taskHi: 'Bloated-document fix model karo: ek `orders` collection sirf `{ _id, total, status }` ke saath, aur ek sibling `order_raw` collection `{ _id, rawImportPayload }` ke saath, wahi `_id`.',
        hint: 'A document loads in full on every read, so a large rarely-needed field taxes every list view and dashboard. Split it to a sibling collection with the same `_id`; the cold path pays one extra `findOne`.',
        hintHi: 'Ek document har read par poora load hota hai. Ek large rarely-needed field ko wahi `_id` waali ek sibling collection mein split karo.',
      },
    ],

    keyTakeaways: [
      'DENORMALIZATION = the same fact stored in multiple places ON PURPOSE, for read speed (embedding, extended references). It\'s the right call for read-heavy data — but every duplicated fact must now be MAINTAINED everywhere it lives.',
      'A FAN-OUT WRITE: one logical change → several physical writes (the source of truth + one `updateMany` per collection holding a copy). E.g. renaming an author = `updateOne` on `authors` + `updateMany({ "author._id": 7 }, ...)` on `posts`, `comments`, etc.',
      'MANAGE the fan-out: (1) do the writes TOGETHER in app code (ms-scale inconsistency window; use a multi-doc transaction — Module 16 — if atomicity matters); (2) emit an EVENT and let a background subscriber fan out async; (3) run a periodic RECONCILIATION job that re-syncs copies from source as a backstop. Often combined.',
      'FORGETTING the fan-out → STALE copies (source updated, copies still wrong). This is denormalization\'s failure mode — every denormalized field needs a DOCUMENTED, TESTED update path, not one that happens to sit next to today\'s source update.',
      'Denormalize ONLY where "briefly stale" is genuinely fine: display names, avatars, labels, approximate counts. NEVER denormalize a value that is AUTHORITATIVE for a decision (account balance, credit limit, permission) — read those LIVE from the source at decision time.',
      'THE MODELING ANTI-PATTERNS: (1) unbounded embedded arrays (→ own collection); (2) BLOATED DOCUMENTS — large fields 99% of reads don\'t need, dragged along every read (→ split to a sibling collection, same `_id`, fetched only when needed); (3) TOO MANY COLLECTIONS — one per user/tenant instead of a field + compound index leading with that identifier; (4) modeling relationally (one collection per "table", `$lookup` on every read).',
    ],
    keyTakeawaysHi: [
      'DENORMALIZATION = wahi fact multiple jagah store JAAN-BOOJHKAR, read speed ke liye. Read-heavy data ke liye sahi call — par har duplicated fact ab har jagah MAINTAIN hona chahiye.',
      'FAN-OUT WRITE: ek logical change → кई physical writes (source of truth + ek `updateMany` prati collection jo ek copy rakhती hai).',
      'Fan-out MANAGE karो: (1) writes app code mein SAATH karो; (2) ek EVENT emit karो aur background subscriber ko async fan out karne do; (3) ek periodic RECONCILIATION job chalाओ. Aksar combined.',
      'Fan-out BHOOLNA → STALE copies. Ye denormalization ka failure mode hai — har denormalized field ko ek DOCUMENTED, TESTED update path chahiye.',
      'SIRF wahaan denormalize karो jahaan "briefly stale" genuinely theek hai. Ek value jo ek decision ke liye AUTHORITATIVE hai use KABHI denormalize nahi karो — use decision time par source se LIVE padhо.',
      'MODELING ANTI-PATTERNS: (1) unbounded embedded arrays; (2) BLOATED DOCUMENTS; (3) BAHUT ZYADA COLLECTIONS — ek prati user/tenant ek field + compound index ke bजाy; (4) relationally modeling.',
    ],
  },
];
