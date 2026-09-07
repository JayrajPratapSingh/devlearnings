/**
 * Databases Complete Course — Module 15: MongoDB Aggregation & Indexes, lessons 1-3.
 *
 * Lesson 1: The aggregation pipeline — the streaming-stages model, $match/$sort/
 *           $limit/$skip/$project/$count, and why $match belongs first.
 * Lesson 2: $group & accumulators — grouping, the accumulator operators, grand
 *           totals via $group by null, and the $count stage.
 * Lesson 3: $unwind, $lookup & expression operators — flattening arrays, joining
 *           collections, and the $-expression language used inside stages.
 *
 * Verified against a real in-memory MongoDB (mongodb-memory-server).
 * Run: node verify-mongo.mjs 15
 */

import type { CourseLesson } from './course-js-module1';

export const MONGO_MODULE_15: CourseLesson[] = [
  {
    slug: 'mongo-the-aggregation-pipeline',
    title: 'The Aggregation Pipeline',
    titleHi: 'Aggregation Pipeline',
    description: 'find() filters and returns documents mostly as-is. Aggregation is a pipeline of stages, each transforming the stream of documents flowing through it — filter, reshape, sort, group, join — with the output of one stage feeding the next.',
    descriptionHi: '`find()` filter karta hai aur documents ko zyadатार as-is lautaता hai. Aggregation stages ki ek pipeline hai, har ek isse baहती documents ki stream ko transform karता hai — filter, reshape, sort, group, join — ek stage ka output agle ko feed karता hua.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A factory assembly line where each station does one job to whatever comes down the belt.** Raw parts enter at one end. The first station discards the defective ones (that is `$match`). The next reshapes what remains — trims off the fields nobody downstream needs, adds a computed label (`$project`). Another sorts the pieces into order (`$sort`), another takes only the first twenty (`$limit`), another groups identical pieces and counts each kind (`$group`). Every station receives the stream from the one before it and hands a transformed stream to the one after. You do not tell the line *how* to do each job, only the sequence of jobs — and the order matters enormously: discarding defective parts *first* means every later station has less to handle.',
      hi: '**Ek factory assembly line jahaan har station jo bhi belt se aata hai uspar ek kaam karता hai.** Raw parts ek end par enter karते hain. Pehla station defective ones discard karता hai (wo `$match` hai). Agla jo bacha hai use reshape karता hai — un fields ko trim karता hai jinhe downstream kisī ko nahi chahiye, ek computed label add karता hai (`$project`). Ek aur pieces ko order mein sort karता hai (`$sort`), ek aur sirf pehle bees leता hai (`$limit`), ek aur identical pieces group karता hai aur har kind count karता hai (`$group`). Har station apne se pehle waale se stream receive karता hai aur apne baad waale ko ek transformed stream deता hai. Aap line ko *kaise* har kaam karे nahi bताते, sirf kaamon ka sequence — aur order bahut matter karता hai: defective parts *pehle* discard karना matlab har later station ke paas kam handle karne ko hai.',
    },

    simple: `**\`aggregate([ stage, stage, ... ])\` -- an ARRAY of stages; each transforms the doc stream**

\`\`\`js
await db.sales.aggregate([
  { $match: { amt: { $gte: 30 } } },       // 1. keep only docs with amt >= 30
  { $sort:  { amt: -1 } },                  // 2. sort the survivors, highest first
  { $limit: 2 },                            // 3. take the top 2
  { $project: { _id: 0, product: 1, amt: 1 } },  // 4. keep only these fields
]).toArray();
\`\`\`

**Core stages**
\`\`\`
$match    -- filter (same syntax as find()'s filter)
$project  -- reshape: include/exclude fields, add computed fields
$sort     -- order (same syntax as .sort())
$limit    -- keep the first N
$skip     -- drop the first N
$count    -- replace the stream with a single { <name>: <count> } document
$group    -- collapse groups into one doc each (Lesson 2)
$unwind, $lookup -- expand arrays, join collections (Lesson 3)
\`\`\`

**\`$match\` GOES FIRST (or as early as possible)**

\`\`\`js
// GOOD: filter to 100 docs, then do expensive work on 100
[ { $match: { region: "US" } }, { $group: { ... } } ]
// BAD: group ALL million docs, then throw away all but the US group
[ { $group: { ... } }, { $match: { _id: "US" } } ]
\`\`\`

**\`find()\` vs \`aggregate()\`:** \`find()\` is filter + project + sort + limit.
\`aggregate()\` is that PLUS grouping, joining, reshaping, computed fields, multi-stage transforms.`,

    simpleHi: `**\`aggregate([ stage, stage, ... ])\` -- stages ka ek ARRAY; har ek doc stream transform karता hai**

\`\`\`js
await db.sales.aggregate([
  { $match: { amt: { $gte: 30 } } },       // 1. sirf amt >= 30 waale docs rakhो
  { $sort:  { amt: -1 } },                  // 2. survivors ko sort karो, highest first
  { $limit: 2 },                            // 3. top 2 lो
  { $project: { _id: 0, product: 1, amt: 1 } },  // 4. sirf ye fields rakhो
]).toArray();
\`\`\`

**Core stages**
\`\`\`
$match    -- filter (find() ke filter jaisा syntax)
$project  -- reshape: fields include/exclude karो, computed fields add karो
$sort     -- order
$limit    -- pehle N rakhो
$skip     -- pehle N drop karो
$count    -- stream ko ek single { <name>: <count> } document se replace karो
$group    -- groups ko har ek ek doc mein collapse karो (Lesson 2)
$unwind, $lookup -- arrays expand karो, collections join karो (Lesson 3)
\`\`\`

**\`$match\` PEHLE JAATA hai (ya jitna jaldi ho sake)**

\`\`\`js
// ACHHA: 100 docs tak filter karो, phir 100 par expensive kaam karो
[ { $match: { region: "US" } }, { $group: { ... } } ]
// BURA: SAARE million docs group karो, phir US group ke alावा sab phenko
[ { $group: { ... } }, { $match: { _id: "US" } } ]
\`\`\`

**\`find()\` vs \`aggregate()\`:** \`find()\` filter + project + sort + limit hai.
\`aggregate()\` wo PLUS grouping, joining, reshaping, computed fields hai.`,

    content: `## The pipeline model

\`db.collection.aggregate([ ... ])\` takes an **array of stages**. Every document in the collection enters the first stage; that stage transforms the stream (filtering some out, reshaping others, producing entirely new documents) and passes the result to the second stage; and so on. The output of the final stage is the result.

\`\`\`js
await db.sales.aggregate([
  { $match: { amt: { $gte: 30 } } },
  { $sort:  { amt: -1 } },
  { $limit: 2 },
  { $project: { _id: 0, product: 1, amt: 1 } },
]).toArray();
\`\`\`

Each stage is an object with exactly one key: the stage name (\`$match\`, \`$sort\`, ...). The same stage can appear more than once at different points in the pipeline.

## The core stages

- **\`$match\`** — filter documents, using exactly the same filter syntax as \`find()\` (comparison operators, \`$in\`, \`$or\`, dot notation — Module 13 Lesson 3).
- **\`$project\`** — reshape each document: include or exclude fields (like a \`find()\` projection), *and* add fields computed with expressions (Lesson 3). Unlike a \`find()\` projection, \`$project\` can freely mix and rename.
- **\`$sort\`** — order the stream, same syntax as \`.sort()\`.
- **\`$limit\` / \`$skip\`** — keep the first N / drop the first N.
- **\`$count: "name"\`** — discard every document and emit a single document \`{ name: <number of documents that reached this stage> }\`.
- **\`$group\`** (Lesson 2), **\`$unwind\` / \`$lookup\`** (Lesson 3), and the advanced stages (Module 15 Lesson 4).

## \`$match\` placement: filter early

The single most important pipeline-performance rule: **put \`$match\` as early as possible**, ideally first. A \`$match\` early in the pipeline reduces how many documents every later stage has to process, and — critically — a \`$match\` that is the *first* stage can use an **index** (just like a \`find()\` filter), skipping the collection scan entirely. A \`$match\` after a \`$group\` or \`$project\` runs on the already-transformed stream, cannot use an index, and means the expensive stages did work on documents that were about to be thrown away.

\`\`\`js
// filter FIRST -- the $group only sees US documents, and $match can use an index:
[ { $match: { region: "US" } }, { $group: { _id: "$product", total: { $sum: "$amt" } } } ]
\`\`\`

MongoDB's query planner does move a \`$match\` earlier automatically in some cases, but relying on that is fragile — write the pipeline with the filter already in the right place.

## \`find()\` vs \`aggregate()\`

\`find()\` covers the common case: filter, project, sort, paginate. Reach for \`aggregate()\` when you need something \`find()\` cannot express:

- **grouping and aggregate calculations** (sum, average, count per category) — Lesson 2,
- **joining another collection** (\`$lookup\`) — Lesson 3,
- **transforming array fields** (\`$unwind\`) — Lesson 3,
- **computed and derived fields** more complex than a projection allows,
- **multi-step transformations** where the output of one operation feeds the next.

The pipeline is also where MongoDB's analytical power lives — reports, dashboards, rollups — the equivalent of a complex SQL query with \`GROUP BY\`, \`JOIN\`, window functions, and CTEs.`,

    contentHi: `## Pipeline model

\`db.collection.aggregate([ ... ])\` **stages ka ek array** leta hai. Collection ka har document pehle stage mein enter karता hai; wo stage stream ko transform karता hai aur result ko doosre stage ko pass karता hai; aur aise. Final stage ka output result hai.

\`\`\`js
await db.sales.aggregate([
  { $match: { amt: { $gte: 30 } } },
  { $sort:  { amt: -1 } },
  { $limit: 2 },
  { $project: { _id: 0, product: 1, amt: 1 } },
]).toArray();
\`\`\`

## Core stages

- **\`$match\`** — documents filter karो, \`find()\` jaisा hi filter syntax.
- **\`$project\`** — har document reshape karो: fields include/exclude, *aur* expressions se computed fields add karो.
- **\`$sort\`** — stream order karो.
- **\`$limit\` / \`$skip\`** — pehle N rakhो / drop karो.
- **\`$count: "name"\`** — har document discard karो aur ek single document \`{ name: <count> }\` emit karो.

## \`$match\` placement: pehle filter karो

Sabse important pipeline-performance rule: **\`$match\` ko jitna jaldi ho sake rakhो**, ideally pehle. Ek \`$match\` jo *pehla* stage hai ek **index** istemal kar sakta hai (bilkul \`find()\` filter ki tarah). Ek \`$match\` jo \`$group\` ke baad hai already-transformed stream par chalता hai, index istemal nahi kar sakta.

\`\`\`js
[ { $match: { region: "US" } }, { $group: { _id: "$product", total: { $sum: "$amt" } } } ]
\`\`\`

## \`find()\` vs \`aggregate()\`

\`find()\` common case cover karता hai: filter, project, sort, paginate. \`aggregate()\` ke liye reach karो jab aapको kुछ chahiye jo \`find()\` express nahi kar sakta: grouping, joining (\`$lookup\`), array transforms (\`$unwind\`), computed fields, multi-step transformations. Pipeline wahaan hai jahaan MongoDB ki analytical power rehти hai.`,

    examples: [
      {
        title: 'A four-stage pipeline: filter, sort, limit, reshape',
        titleHi: 'Ek four-stage pipeline: filter, sort, limit, reshape',
        code: `await db.sales.insertMany([
  { product: "a", amt: 100 }, { product: "b", amt: 50 },
  { product: "c", amt: 200 }, { product: "d", amt: 20 },
]);
print(await db.sales.aggregate([
  { $match: { amt: { $gte: 30 } } },
  { $sort: { amt: -1 } },
  { $limit: 2 },
  { $project: { _id: 0, product: 1, amt: 1 } },
]).toArray());`,
        output: `[{"product":"c","amt":200},{"product":"a","amt":100}]`,
        explain: 'The stages run in order on the document stream: `$match` drops the amt-20 doc (keeping 100, 50, 200), `$sort` orders the survivors descending (200, 100, 50), `$limit: 2` keeps the top two, and `$project` reshapes each to just `product` and `amt`. Each stage receives the output of the previous one.',
        explainHi: 'Stages document stream par order mein chalte hain: `$match` amt-20 doc drop karta hai (100, 50, 200 rakhte hue), `$sort` survivors ko descending order karta hai (200, 100, 50), `$limit: 2` top do rakhta hai, aur `$project` har ek ko sirf `product` aur `amt` mein reshape karta hai.',
      },
      {
        title: '$skip + $limit for pagination (page 2, page size 2)',
        titleHi: '$skip + $limit pagination ke liye (page 2, page size 2)',
        code: `await db.items.insertMany([
  { _id: 1, n: 10 }, { _id: 2, n: 20 }, { _id: 3, n: 30 }, { _id: 4, n: 40 }, { _id: 5, n: 50 },
]);
print(await db.items.aggregate([
  { $sort: { n: 1 } },
  { $skip: 2 },
  { $limit: 2 },
  { $project: { _id: 0, n: 1 } },
]).toArray());`,
        output: `[{"n":30},{"n":40}]`,
        explain: 'The logical order MongoDB applies is sort, then skip, then limit — regardless of how the stages are written. `$sort: { n: 1 }` orders the five docs (10, 20, 30, 40, 50), `$skip: 2` drops the first two (10, 20), and `$limit: 2` keeps the next two (30, 40) — the second "page" of size 2.',
        explainHi: 'Logical order jo MongoDB apply karta hai: sort, phir skip, phir limit. `$sort: { n: 1 }` paांch docs order karta hai (10, 20, 30, 40, 50), `$skip: 2` pehle do drop karta hai (10, 20), aur `$limit: 2` agle do rakhta hai (30, 40) — page 2, size 2.',
      },
      {
        title: '$count replaces the stream with a single count document',
        titleHi: '$count stream ko ek single count document se replace karta hai',
        code: `await db.orders.insertMany([
  { status: "shipped" }, { status: "shipped" }, { status: "pending" },
  { status: "shipped" }, { status: "cancelled" },
]);
print(await db.orders.aggregate([
  { $match: { status: "shipped" } },
  { $count: "shippedCount" },
]).toArray());`,
        output: `[{"shippedCount":3}]`,
        explain: '`$match { status: "shipped" }` keeps the three shipped docs; `$count: "shippedCount"` then discards every one of those documents and emits a single document `{ shippedCount: 3 }` — the number of documents that reached the `$count` stage. No ticket documents are transferred to the caller.',
        explainHi: '`$match { status: "shipped" }` teen shipped docs rakhta hai; `$count: "shippedCount"` phir un har document ko discard karta hai aur ek single document `{ shippedCount: 3 }` emit karta hai — un documents ki sankhya jo `$count` stage tak pahunche.',
      },
    ],

    mistakes: [
      {
        wrong: `// $match AFTER $group -- grouping the whole collection, then discarding all but one
await db.sales.aggregate([
  { $group: { _id: "$region", total: { $sum: "$amt" } } },   // groups ALL regions
  { $match: { _id: "US" } },                                  // ...then keeps only US
]).toArray();
// the $group did work on every document in the collection for no reason`,
        right: `await db.sales.aggregate([
  { $match: { region: "US" } },                               // filter to US docs FIRST
  { $group: { _id: "$region", total: { $sum: "$amt" } } },    // group only those
]).toArray();
// the $match is now the first stage, so it can use an index on "region" too`,
        why: 'A pipeline stage processes every document handed to it by the previous stage, so a $group placed before a $match must fully process the entire collection, computing group totals for every region, before the $match then throws away all the groups except one. Moving the $match ahead of the $group means the $group only ever sees the documents that survived the filter, which for a selective filter is a tiny fraction of the collection. There is a second, larger benefit: a $match that is the first stage of a pipeline is treated like a find() filter and can use an index to locate the matching documents directly, avoiding a full collection scan entirely, whereas a $match anywhere after a transforming stage operates on a synthetic stream that no index covers. MongoDB will sometimes reorder a $match earlier on its own, but writing the pipeline with the filter already in the right position is both clearer and not dependent on the optimizer noticing.',
        whyHi: 'Ek pipeline stage har document process karता hai jo pichhले stage ne use diya, to ek `$group` jo ek `$match` se pehle hai poori collection ko poori tarah process karता hai, phir `$match` ek ke alावा saare groups phenk deता hai. `$match` ko `$group` se aage move karna matlab `$group` sirf un documents ko dekhता hai jo filter se bache. Ek doosरा, बड़ा benefit: ek `$match` jo pipeline ka pehla stage hai ek index istemal kar sakta hai.',
      },
      {
        wrong: `// expecting a find()-style projection's rules inside $project
await db.users.aggregate([
  { $project: { name: 1, age: 0 } },   // in $project, mixing 1 and 0 IS allowed for
]).toArray();                          // regular fields -- but the RESULT is surprising:
// "name: 1, age: 0" here just means "include name, exclude age" -- fine.
// the trap is thinking $project works like find()'s strict inclusion/exclusion --
// $project has its own richer rules and can DO more (rename, compute, restructure)`,
        right: `// use $project's full power deliberately -- include, exclude, rename, compute:
await db.users.aggregate([
  { $project: {
      _id: 0,
      fullName: { $concat: ["$first", " ", "$last"] },   // computed + renamed
      age: 1,                                             // included as-is
  } },
]).toArray();`,
        why: 'A find() projection is deliberately limited: it operates in a strict inclusion or exclusion mode and cannot rename fields or compute new values, which keeps it simple and fast for the common read path. The aggregation $project stage is a full document-reshaping operation: it can include and exclude fields, rename them, restructure nested documents, and add fields whose values are computed by expressions. Treating $project as merely a more permissive version of a find() projection misses most of what it does, and leads to writing extra stages or post-processing in application code for reshaping that $project could have done in one step. The right mental model is that $project defines the exact shape of the output document, field by field, with each field either carried through, dropped, or set to a computed expression.',
        whyHi: 'Ek `find()` projection deliberately limited hai: ye ek strict inclusion ya exclusion mode mein operate karता hai aur fields rename ya naye values compute nahi kar sakta. Aggregation `$project` stage ek full document-reshaping operation hai: ye fields include/exclude, rename, restructure kar sakta hai, aur expressions se compute kiye values waale fields add kar sakta hai. `$project` ko sirf ek zyada permissive `find()` projection samajhna wo sab miss karता hai jo ye karता hai.',
      },
      {
        wrong: `// reaching for aggregate() when find() would do
await db.users.aggregate([
  { $match: { active: true } },
  { $sort: { createdAt: -1 } },
  { $limit: 10 },
  { $project: { _id: 0, name: 1, email: 1 } },
]).toArray();
// this is exactly a find() -- no grouping, no join, no computed fields`,
        right: `await db.users
  .find({ active: true }, { projection: { _id: 0, name: 1, email: 1 } })
  .sort({ createdAt: -1 })
  .limit(10)
  .toArray();
// simpler, and find() has a lighter code path for this common shape`,
        why: 'A pipeline built only from $match, $sort, $limit, $skip, and a simple $project expresses nothing that find() cannot, since those stages correspond exactly to a filter, a sort, a limit, a skip, and a projection on a find() cursor. Using aggregate() for that shape adds ceremony without capability, and find() has a more direct execution path for the plain filter-sort-paginate-project case. Aggregation earns its place when the operation genuinely needs what find() lacks: grouping and aggregate calculations, joining another collection, unwinding array fields, computed fields more elaborate than a projection allows, or a multi-stage transformation where one step feeds the next. If a pipeline contains none of those, it is a find() written the long way.',
        whyHi: 'Ek pipeline jo sirf `$match`, `$sort`, `$limit`, `$skip`, aur ek simple `$project` se bani hai kuch bhi express nahi karती jo `find()` nahi kar sakta. Us shape ke liye `aggregate()` istemal karna bina capability ke ceremony add karता hai. Aggregation tab apni jagah kamाता hai jab operation ko genuinely wo chahiye jo `find()` mein nahi hai: grouping, joining, unwinding, complex computed fields, ya ek multi-stage transformation.',
      },
    ],

    realWorld: [
      {
        en: '**A "top 10 products by revenue this month" report as a pipeline** — `$match` the month, `$group` by product with `$sum` of revenue, `$sort` descending, `$limit` 10 — one query replacing what would be a `GROUP BY` plus `ORDER BY` plus `LIMIT` in SQL.',
        hi: '**Ek "is mahine revenue se top 10 products" report ek pipeline ke roop mein** — `$match` mahina, `$group` product se, `$sort`, `$limit` 10.',
      },
      {
        en: '**A code-review guideline: every aggregation pipeline must start with `$match` (or `$geoNear`), never `$project` or `$group`** — so the first stage can always use an index.',
        hi: '**Ek code-review guideline: har aggregation pipeline `$match` se shuru honi chahiye** — taaki pehla stage hamesha ek index istemal kar sake.',
      },
      {
        en: '**A dashboard tile using `$count` after a `$match`** to show "1,247 open tickets" without transferring any ticket documents to the application.',
        hi: '**Ek dashboard tile jo ek `$match` ke baad `$count` istemal karta hai** "1,247 open tickets" dikhane ke liye bina koi ticket documents transfer kiye.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the aggregation pipeline, and how does it differ from find()?',
        qHi: 'Aggregation pipeline kya hai, aur ye `find()` se kaise alag hai?',
        a: 'The aggregation pipeline is an ordered array of stages, where every document in the collection enters the first stage, that stage transforms the stream of documents, filtering some out, reshaping others, or producing new ones, and passes its output to the next stage, continuing until the final stage produces the result. Each stage is an object with a single key naming the stage, such as $match, $sort, $group, or $project, and the same stage type can appear multiple times at different positions. find() covers the common read case: it applies a filter, an optional projection, a sort, and a limit or skip, returning documents largely as they are stored. The pipeline is more general: in addition to everything find() does, it can group documents and compute aggregate values like sums and averages per category, join another collection with $lookup, expand array fields into multiple documents with $unwind, add computed and derived fields with expressions richer than a projection allows, and chain multiple transformation steps where each feeds the next. A pipeline built only from $match, $sort, $limit, and a plain projection is just a find() written more verbosely; aggregation is warranted specifically when the operation needs grouping, joining, array transformation, or multi-step computation.',
        aHi: 'Aggregation pipeline stages ka ek ordered array hai, jahaan collection ka har document pehle stage mein enter karता hai, wo stage documents ki stream ko transform karता hai, aur apna output agle stage ko pass karता hai, final stage tak. `find()` common read case cover karता hai: ek filter, ek optional projection, ek sort, aur ek limit/skip. Pipeline zyada general hai: `find()` jo karता hai iske alावा, ye documents group kar sakti hai, `$lookup` se ek doosri collection join kar sakti hai, `$unwind` se array fields expand kar sakti hai.',
      },
      {
        q: 'Why should $match come as early as possible in a pipeline, ideally first?',
        qHi: '`$match` ek pipeline mein jitna jaldi ho sake, ideally pehle, kyun aana chahiye?',
        a: 'Every stage in a pipeline processes each document handed to it by the previous stage, so the number of documents flowing through the pipeline directly determines how much work the later stages do. Placing $match early reduces that document count before the expensive stages, such as $group, $lookup, or $sort, ever see the data, so those stages operate only on the documents that actually matter rather than on the whole collection followed by discarding most of the result. There is a second and often larger benefit specific to $match being the very first stage: in that position it is treated exactly like a find() filter and can use an index to locate the matching documents directly, avoiding a full collection scan. A $match placed after any transforming stage operates on a synthetic stream of documents that no index covers, so it must be evaluated by examining every document the previous stage produced. MongoDB will sometimes move a $match earlier automatically, but writing it in the correct position from the start is clearer and does not depend on the optimizer recognizing the opportunity.',
        aHi: 'Pipeline ka har stage har document process karता hai jo pichhले stage ne use diya, to pipeline se baहते documents ki sankhya seedhे determine karती hai ki later stages кितna kaam karते hain. `$match` ko jaldi rakhना us document count ko kam karता hai expensive stages ke data dekhने se pehle. Ek doosरा benefit specifically `$match` ke bilkul pehla stage hone ka: us position mein ye ek `find()` filter ki tarah treat hota hai aur ek index istemal kar sakta hai, ek full collection scan avoid karता hua.',
      },
    ],

    exercises: [
      {
        task: 'Insert four `sales` documents with `product` and `amt` fields (amounts 100, 50, 200, 20). Write a pipeline: `$match` amt >= 30, `$sort` by amt descending, `$limit` 2, `$project` away `_id`. Confirm the result is the two highest-amount products.',
        taskHi: 'Chaar `sales` documents `product` aur `amt` fields ke saath insert karo (amounts 100, 50, 200, 20). Ek pipeline likho: `$match` amt >= 30, `$sort` amt descending, `$limit` 2, `$project` `_id` away.',
        hint: 'Stages run in order: filter first (drops the amt-20 doc), then sort the survivors, then take the top 2, then reshape. Each stage receives the output of the one before it.',
        hintHi: 'Stages order mein chalते hain: pehle filter, phir survivors ko sort, phir top 2, phir reshape.',
      },
      {
        task: 'Insert five `items` with an `n` field (10, 20, 30, 40, 50). Write a pipeline that sorts by `n` ascending, `$skip`s 2, and `$limit`s 2 — the second "page" of size 2. Confirm the result is `[{ n: 30 }, { n: 40 }]`.',
        taskHi: 'Paांch `items` ek `n` field ke saath insert karo (10, 20, 30, 40, 50). Ek pipeline likho jo `n` ascending sort karti hai, 2 `$skip` karti hai, aur 2 `$limit` karti hai.',
        hint: 'The logical order MongoDB applies is sort, then skip, then limit — `$skip: 2` drops the first two after sorting, `$limit: 2` keeps the next two.',
        hintHi: 'Logical order sort, phir skip, phir limit hai.',
      },
      {
        task: 'Insert five `orders` with a `status` field (three `"shipped"`, one `"pending"`, one `"cancelled"`). Write a pipeline that `$match`es `status: "shipped"` then `$count`s them into a field named `shippedCount`. Confirm the result is `[{ shippedCount: 3 }]`.',
        taskHi: 'Paांch `orders` ek `status` field ke saath insert karo (teen `"shipped"`, ek `"pending"`, ek `"cancelled"`). Ek pipeline likho jo `status: "shipped"` `$match` karti hai phir unhe `shippedCount` field mein `$count` karti hai.',
        hint: '`$count: "shippedCount"` discards every document and emits a single `{ shippedCount: <N> }` — the number of documents that reached the `$count` stage.',
        hintHi: '`$count: "shippedCount"` har document discard karta hai aur ek single `{ shippedCount: <N> }` emit karta hai.',
      },
    ],

    keyTakeaways: [
      '`aggregate([ stage, stage, ... ])` is an ORDERED ARRAY of stages. Every document enters stage 1; each stage TRANSFORMS the stream (filter out, reshape, produce new docs) and feeds its output to the next. Each stage is an object with ONE key (the stage name); the same stage type can appear multiple times.',
      'CORE STAGES: `$match` (filter — same syntax as `find()`), `$project` (reshape: include/exclude/rename/compute), `$sort`, `$limit`, `$skip`, `$count: "name"` (discard the stream, emit one `{ name: <count> }` doc), plus `$group` (L2) and `$unwind`/`$lookup` (L3).',
      '`$match` GOES FIRST (or as early as possible). Two reasons: (1) it shrinks the doc count before expensive stages (`$group`/`$lookup`/`$sort`) process the data; (2) a `$match` that is the FIRST stage can use an INDEX like a `find()` filter — a `$match` after any transforming stage cannot (it runs on a synthetic stream). The planner sometimes reorders it, but don\'t rely on that.',
      '`$project` in aggregation is MORE than a `find()` projection — it can rename fields, restructure nested docs, and add fields computed by expressions (L3). It defines the EXACT output shape field by field.',
      '`find()` = filter + project + sort + limit/skip. `aggregate()` = that PLUS grouping/aggregate calcs, joining (`$lookup`), array transforms (`$unwind`), complex computed fields, and multi-step transforms. A pipeline of ONLY `$match`/`$sort`/`$limit`/`$skip`/plain-`$project` is just a `find()` written the long way — use `find()`.',
    ],
    keyTakeawaysHi: [
      '`aggregate([ stage, ... ])` stages ka ek ORDERED ARRAY hai. Har document stage 1 mein enter karता hai; har stage stream ko TRANSFORM karता hai aur apna output agle ko feed karता hai.',
      'CORE STAGES: `$match` (filter — `find()` jaisा syntax), `$project` (reshape: include/exclude/rename/compute), `$sort`, `$limit`, `$skip`, `$count: "name"`, plus `$group` (L2) aur `$unwind`/`$lookup` (L3).',
      '`$match` PEHLE JAATA hai. Do कारण: (1) ye expensive stages ke pehle doc count kam karता hai; (2) ek `$match` jo PEHLA stage hai ek INDEX istemal kar sakta hai — ek transforming stage ke baad `$match` nahi kar sakta.',
      '`$project` aggregation mein ek `find()` projection se ZYADA hai — ye fields rename, nested docs restructure, aur expressions se computed fields add kar sakta hai.',
      '`find()` = filter + project + sort + limit/skip. `aggregate()` = wo PLUS grouping, joining (`$lookup`), array transforms (`$unwind`), complex computed fields. Ek pipeline jo SIRF `$match`/`$sort`/`$limit`/plain-`$project` hai wo bas ek `find()` hai — `find()` istemal karो.',
    ],
  },

  {
    slug: 'mongo-group-and-accumulators',
    title: '$group & Accumulators',
    titleHi: '$group Aur Accumulators',
    description: '$group collapses documents that share a key into one document per key, and accumulator operators — $sum, $avg, $min, $max, $push, $addToSet, $first, $last — compute a value across all the documents in each group. It is MongoDB\'s GROUP BY.',
    descriptionHi: '`$group` un documents ko jo ek key share karते hain prati-key ek document mein collapse karता hai, aur accumulator operators — `$sum`, `$avg`, `$min`, `$max`, `$push`, `$addToSet`, `$first`, `$last` — har group ke saare documents ke across ek value compute karте hain. Ye MongoDB ka `GROUP BY` hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Sorting a shoebox of receipts into labeled envelopes, then writing one summary line on each envelope.** First you decide the label — "by month," "by category," "by store" — and every receipt goes into the matching envelope; two receipts with the same label land together. Then, for each envelope, you compute one summary: the total spent (that is `$sum`), the average receipt (`$avg`), the biggest single purchase (`$max`), or the list of every store visited (`$push`). The box of hundreds of loose receipts becomes twelve envelopes each with a one-line total. And if you label everything the same — "all of it" — you get exactly one envelope: the grand total.',
      hi: '**Receipts ke ek shoebox ko labeled envelopes mein sort karना, phir har envelope par ek summary line likhना.** Pehle aap label decide karते ho — "mahine se," "category se," "store se" — aur har receipt matching envelope mein jaती hai; do receipts ek hi label ke saath saath land karती hain. Phir, har envelope ke liye, aap ek summary compute karते ho: total spent (wo `$sum`), average receipt (`$avg`), sabse बड़ा single purchase (`$max`), ya har visited store ki list (`$push`). Sौ loose receipts ka box barah envelopes ban jaता hai har ek ek-line total ke saath. Aur agar aap sab kुछ same label karते ho — "sab kुछ" — aapको theek ek envelope milता hai: grand total.',
    },

    simple: `**\`$group\`: \`_id\` is the grouping key; other fields are ACCUMULATORS over each group**

\`\`\`js
await db.sales.aggregate([
  { $group: {
      _id: "$region",                    // group by region
      total:  { $sum: "$amt" },          // sum of amt within each region
      count:  { $sum: 1 },               // count = sum of 1 per doc
      avg:    { $avg: "$amt" },
      biggest:{ $max: "$amt" },
      products:{ $addToSet: "$product" }, // distinct products per region
  } },
]).toArray();
// -> [ { _id: "EU", total: 230, count: 2, avg: 115, biggest: 200, products: [...] }, ... ]
\`\`\`

**ACCUMULATOR operators**
\`\`\`
$sum    -- sum (of a field, or of 1 to count)
$avg    -- average
$min / $max     -- smallest / largest value in the group
$push           -- an array of ALL the values (keeps duplicates + order)
$addToSet       -- an array of the DISTINCT values
$first / $last   -- the value from the first / last doc in the group
                    (meaningful only after a $sort)
\`\`\`

**\`_id: null\` -> ONE group = the whole input = a GRAND TOTAL**

\`\`\`js
{ $group: { _id: null, total: { $sum: "$amt" }, count: { $sum: 1 } } }
// -> [ { _id: null, total: 175, count: 3 } ]
\`\`\`

**The output \`_id\` IS the grouping key.** \`{ _id: "$region" }\` -> \`_id\` holds the region.
Group by multiple fields: \`{ _id: { region: "$region", product: "$product" } }\`.`,

    simpleHi: `**\`$group\`: \`_id\` grouping key hai; doosre fields har group par ACCUMULATORS hain**

\`\`\`js
await db.sales.aggregate([
  { $group: {
      _id: "$region",                    // region se group
      total:  { $sum: "$amt" },          // har region ke andar amt ka sum
      count:  { $sum: 1 },               // count = prati doc 1 ka sum
      avg:    { $avg: "$amt" },
      biggest:{ $max: "$amt" },
      products:{ $addToSet: "$product" }, // prati region distinct products
  } },
]).toArray();
\`\`\`

**ACCUMULATOR operators**
\`\`\`
$sum    -- sum (ek field ka, ya count ke liye 1 ka)
$avg    -- average
$min / $max     -- group mein sabse chhoti / बड़ी value
$push           -- SAARI values ka ek array (duplicates + order rakhता hai)
$addToSet       -- DISTINCT values ka ek array
$first / $last   -- group ke pehle / aakhri doc ki value (sirf ek $sort ke baad meaningful)
\`\`\`

**\`_id: null\` -> EK group = poora input = ek GRAND TOTAL**

\`\`\`js
{ $group: { _id: null, total: { $sum: "$amt" }, count: { $sum: 1 } } }
// -> [ { _id: null, total: 175, count: 3 } ]
\`\`\`

**Output \`_id\` HI grouping key hai.** Multiple fields se group: \`{ _id: { region: "$region", product: "$product" } }\`.`,

    content: `## The \`$group\` stage

\`$group\` takes every document in the stream and collapses documents that produce the same \`_id\` value into a single output document:

\`\`\`js
{ $group: {
    _id: "$region",
    total: { $sum: "$amt" },
    count: { $sum: 1 },
} }
\`\`\`

- **\`_id\`** is mandatory and defines the grouping key. \`"$region"\` (a field reference — the \`$\` prefix means "the value of this field") groups documents by their region. The output document's \`_id\` field then *holds* that region value.
- Every other field in the \`$group\` spec is an **accumulator**: an operator that computes a single value from all the documents in the group.

The result has one document per distinct \`_id\` value. This is exactly SQL's \`GROUP BY region\`, and the accumulators are the aggregate functions.

## The accumulator operators

- **\`$sum: "$field"\`** — the sum of that field's values across the group. **\`$sum: 1\`** — adds 1 per document, i.e. counts the documents.
- **\`$avg: "$field"\`** — the average.
- **\`$min\` / \`$max\`** — the smallest / largest value of the field in the group.
- **\`$push: "$field"\`** — collects *every* value into an array, keeping duplicates and order.
- **\`$addToSet: "$field"\`** — collects the *distinct* values into an array.
- **\`$first\` / \`$last\`** — the field's value from the first / last document in the group. These are only meaningful when the pipeline has a \`$sort\` before the \`$group\`, since otherwise "first" is undefined.

An accumulator's argument can be an expression, not just a field: \`{ $sum: { $multiply: ["$price", "$qty"] } }\` sums a computed line total.

## The grand total: \`_id: null\`

Setting \`_id: null\` (or any constant) makes **every document fall into one group**, so the result is a single document aggregating the entire input:

\`\`\`js
{ $group: { _id: null, total: { $sum: "$amt" }, count: { $sum: 1 } } }
// [ { _id: null, total: 175, count: 3 } ]
\`\`\`

This is how you compute an overall sum, average, or count with the aggregation framework.

## Grouping by multiple fields

The \`_id\` can be a document, grouping by the combination:

\`\`\`js
{ $group: {
    _id: { region: "$region", product: "$product" },
    total: { $sum: "$amt" },
} }
// one output doc per distinct (region, product) pair; _id is { region, product }
\`\`\`

## The \`$count\` stage vs \`$sum: 1\`

\`{ $count: "n" }\` (Lesson 1) is shorthand for \`{ $group: { _id: null, n: { $sum: 1 } } }\` followed by \`{ $project: { _id: 0 } }\` — it only counts, into a flat document. Use \`$count\` when counting is all you need; use \`$group\` with \`$sum: 1\` when you need the count *alongside* other accumulators or *per group*.

## A common shape

\`$match\` (filter) → \`$group\` (aggregate per key) → \`$sort\` (order the groups) → \`$limit\` (top N) is the standard "top N by some metric" report, and covers a large fraction of real aggregation use.`,

    contentHi: `## \`$group\` stage

\`$group\` stream ke har document ko leta hai aur un documents ko jo same \`_id\` value produce karте hain ek single output document mein collapse karता hai:

\`\`\`js
{ $group: { _id: "$region", total: { $sum: "$amt" }, count: { $sum: 1 } } }
\`\`\`

- **\`_id\`** mandatory hai aur grouping key define karता hai. \`"$region"\` (ek field reference — \`$\` prefix matlab "is field ki value") documents ko region se group karता hai. Output document ka \`_id\` field phir wo region value *rakhता hai*.
- \`$group\` spec ka har doosरा field ek **accumulator** hai.

Ye theek SQL ka \`GROUP BY region\` hai.

## Accumulator operators

- **\`$sum: "$field"\`** — group ke across us field ki values ka sum. **\`$sum: 1\`** — prati document 1 add karता hai, matlab documents count karता hai.
- **\`$avg\`** — average.
- **\`$min\` / \`$max\`** — group mein field ki sabse chhoti / बड़ी value.
- **\`$push\`** — *har* value ko ek array mein collect karता hai (duplicates + order).
- **\`$addToSet\`** — *distinct* values ko ek array mein collect karता hai.
- **\`$first\` / \`$last\`** — group ke pehle / aakhri document ki value (sirf ek \`$sort\` ke baad meaningful).

## Grand total: \`_id: null\`

\`_id: null\` set karna **har document ko ek group mein** daalता hai:

\`\`\`js
{ $group: { _id: null, total: { $sum: "$amt" }, count: { $sum: 1 } } }
// [ { _id: null, total: 175, count: 3 } ]
\`\`\`

## Multiple fields se grouping

\`\`\`js
{ $group: { _id: { region: "$region", product: "$product" }, total: { $sum: "$amt" } } }
\`\`\`

## Common shape

\`$match\` → \`$group\` → \`$sort\` → \`$limit\` standard "top N by some metric" report hai.`,

    examples: [
      {
        title: '$group by a field with $sum, $avg, and a count',
        titleHi: 'Ek field se $group $sum, $avg, aur ek count ke saath',
        code: `await db.sales.insertMany([
  { region: "US", amt: 100 }, { region: "US", amt: 50 },
  { region: "EU", amt: 200 }, { region: "EU", amt: 30 },
]);
print(await db.sales.aggregate([
  { $group: { _id: "$region", total: { $sum: "$amt" }, count: { $sum: 1 }, avg: { $avg: "$amt" } } },
  { $sort: { total: -1 } },
]).toArray());`,
        output: `[{"_id":"EU","total":230,"count":2,"avg":115},{"_id":"US","total":150,"count":2,"avg":75}]`,
        explain: '`$group` by `$region` collapses the four docs into one per region. For US (100 + 50): `total: 150`, `count: 2` (via `$sum: 1`), `avg: 75`. For EU (200 + 30): `total: 230`, `count: 2`, `avg: 115`. `$sort: { total: -1 }` then orders EU before US.',
        explainHi: '`$region` se `$group` chaar docs ko prati region ek mein collapse karta hai. US (100 + 50): `total: 150`, `count: 2`, `avg: 75`. EU (200 + 30): `total: 230`, `count: 2`, `avg: 115`. `$sort: { total: -1 }` phir EU ko US se pehle order karta hai.',
      },
      {
        title: '_id: null collapses everything into one group — a grand total',
        titleHi: '_id: null sab kuch ek group mein collapse karta hai — ek grand total',
        code: `await db.sales.insertMany([{ amt: 100 }, { amt: 50 }, { amt: 25 }]);
print(await db.sales.aggregate([
  { $group: { _id: null, total: { $sum: "$amt" }, count: { $sum: 1 }, biggest: { $max: "$amt" } } },
]).toArray());`,
        output: `[{"_id":null,"total":175,"count":3,"biggest":100}]`,
        explain: '`_id: null` places every document into a single group, so the accumulators aggregate the entire three-document input into one output document: `total: 175` (100 + 50 + 25), `count: 3`, `biggest: 100` (the `$max`). This is how you compute a grand total with aggregation.',
        explainHi: '`_id: null` har document ko ek single group mein daalta hai, to accumulators poore teen-document input ko ek output document mein aggregate karte hain: `total: 175`, `count: 3`, `biggest: 100`. Ye aggregation se ek grand total compute karne ka tarika hai.',
      },
      {
        title: '$addToSet collects the distinct values in each group',
        titleHi: '$addToSet har group mein distinct values collect karta hai',
        code: `await db.sales.insertMany([
  { region: "US", product: "a" }, { region: "US", product: "b" }, { region: "US", product: "a" },
  { region: "EU", product: "a" },
]);
print(await db.sales.aggregate([
  { $group: { _id: "$region", products: { $addToSet: "$product" } } },
  { $project: { products: { $sortArray: { input: "$products", sortBy: 1 } } } },
  { $sort: { _id: 1 } },
]).toArray());`,
        output: `[{"_id":"EU","products":["a"]},{"_id":"US","products":["a","b"]}]`,
        explain: '`$addToSet` collects the DISTINCT values in each group. US has product "a" twice and "b" once, so its set is `["a", "b"]` (not `["a", "a", "b"]`); EU has only "a". `$addToSet` does NOT guarantee element order, so the `$sortArray` project stage here just makes the output deterministic for display. `$push` would have kept every occurrence including the duplicate "a".',
        explainHi: '`$addToSet` har group mein DISTINCT values collect karta hai. US ke paas product "a" do baar aur "b" ek baar hai, to iska set `["a", "b"]` hai; EU ke paas sirf "a" hai. `$addToSet` element order guarantee NAHI karta, to yahaan `$sortArray` project stage sirf output ko deterministic banata hai. `$push` har occurrence rakhta, duplicate "a" samet.',
      },
    ],

    mistakes: [
      {
        wrong: `// referencing a field in an accumulator without the $ prefix
{ $group: { _id: "$region", total: { $sum: "amt" } } }
// "amt" (no $) is the literal STRING "amt", not the field's value --
// $sum of a non-numeric string is 0, so every total comes out as 0`,
        right: `{ $group: { _id: "$region", total: { $sum: "$amt" } } }
// "$amt" (with $) is a FIELD REFERENCE -- the value of the amt field in each doc`,
        why: 'Inside an aggregation expression, a string is interpreted literally as that string unless it begins with a dollar sign, in which case the dollar sign marks it as a field reference and the rest names the field whose value should be substituted. Writing amt without the dollar sign passes the literal three-character string as the argument to $sum, and since that string is not a number, $sum contributes nothing for it and every group total evaluates to zero. Writing $amt with the dollar sign makes the expression evaluate to the value of the amt field in each document being accumulated, which is what produces a real sum. This dollar-prefix convention is pervasive in aggregation: any place an expression can appear, a bare string is a literal and a dollar-prefixed string is a field path.',
        whyHi: 'Ek aggregation expression ke andar, ek string literally us string ke roop mein interpret hoती hai jab tak ye ek dollar sign se shuru na ho, jismein wo dollar sign ise ek field reference ke roop mein mark karता hai. `amt` ko dollar sign ke bina likhना `$sum` ko literal three-character string pass karता hai, aur kyunki wo string ek number nahi hai, `$sum` iske liye kुछ contribute nahi karता aur har group total zero evaluate hota hai. `$amt` dollar sign ke saath expression ko har document mein `amt` field ki value evaluate karता hai.',
      },
      {
        wrong: `// expecting $first / $last to be meaningful without a preceding $sort
await db.events.aggregate([
  { $group: { _id: "$userId", firstEvent: { $first: "$type" } } },
]).toArray();
// without a $sort before this $group, "first" is whatever order the docs
// happened to arrive in -- not the chronologically first event`,
        right: `await db.events.aggregate([
  { $sort: { at: 1 } },                          // establish the order FIRST
  { $group: { _id: "$userId", firstEvent: { $first: "$type" } } },
]).toArray();
// now $first is the type of the earliest event per user, because the input
// to $group is sorted by time`,
        why: 'The $first and $last accumulators return a value from, respectively, the first and last document of each group as the documents arrive at the $group stage, which means their result depends entirely on the order of the input stream. If no $sort precedes the $group, that order is not defined in any meaningful sense, so $first and $last effectively return an arbitrary document\'s value rather than a chronologically or otherwise meaningfully first or last one. To get, for example, the earliest event per user, the pipeline must sort by timestamp before the $group so that the first document of each group is genuinely the earliest. This is different from $min and $max, which compare values regardless of order and therefore do not need a preceding sort.',
        whyHi: '`$first` aur `$last` accumulators har group ke pehle aur aakhri document se ek value lautaते hain jaise documents `$group` stage par arrive karते hain, jiska matlab hai unka result poori tarah input stream ke order par depend karता hai. Agar koi `$sort` `$group` se pehle nahi hai, wo order kisī meaningful sense mein defined nahi hai. Ye `$min` aur `$max` se alag hai, jo order se regardless values compare karते hain.',
      },
      {
        wrong: `// using $push on a field that could be huge, building an unbounded array in memory
{ $group: { _id: "$userId", allActivity: { $push: "$$ROOT" } } }
// for a user with a million activity docs, this tries to build a million-element
// array in one output document -- which also can't exceed 16MB`,
        right: `// aggregate what you actually need, not the raw documents:
{ $group: { _id: "$userId", activityCount: { $sum: 1 }, lastAt: { $max: "$at" } } }
// or, if you genuinely need the docs, don't $group them -- $sort + $limit them,
// or paginate the underlying collection directly`,
        why: 'The $push accumulator builds an array containing one entry per document in the group, held in the output document, so applying it to a grouping key that can have a very large number of documents attempts to construct a correspondingly large array in a single result document. This consumes memory proportional to the group size during the aggregation, and the resulting document is still subject to the 16MB limit, so a sufficiently large group produces either an out-of-memory failure or a document-too-large error. When the goal is a summary of each group, accumulators like $sum, $avg, $min, and $max produce a fixed-size result regardless of group size and are the right choice. When the individual documents genuinely are the desired output, grouping and pushing them is the wrong tool; the documents should be sorted and limited, or retrieved through ordinary pagination of the source collection.',
        whyHi: '`$push` accumulator ek array banata hai jismein group ke prati document ek entry hai, output document mein rakhा. Ise ek grouping key par apply karna jiske bahut zyada documents ho sakte hain ek correspondingly large array banane ki koshish karता hai. Ye group size ke proportional memory consume karता hai, aur resulting document abhi bhi 16MB limit ke subject hai. Jab goal har group ka ek summary hai, `$sum`/`$avg`/`$min`/`$max` jaisे accumulators ek fixed-size result produce karते hain.',
      },
    ],

    realWorld: [
      {
        en: '**A monthly revenue report: `$match` the date range, `$group` by `{ year, month }` with `$sum` of revenue and `$sum: 1` for order count, `$sort` chronologically** — one pipeline replacing a SQL `GROUP BY` with two grouping columns.',
        hi: '**Ek monthly revenue report: `$match` date range, `$group` `{ year, month }` se, `$sort`** — ek pipeline.',
      },
      {
        en: '**A "distinct tags used per author" query with `$group: { _id: "$authorId", tags: { $addToSet: "$tag" } }`** after `$unwind`ing a tags array — collecting the unique set per group in one pass.',
        hi: '**Ek "prati author distinct tags" query `$group: { _id: "$authorId", tags: { $addToSet: "$tag" } }` ke saath**.',
      },
      {
        en: '**A dashboard KPI computed with `$group: { _id: null, ... }`** — total users, average session length, and 95th-percentile response time in a single grand-total document.',
        hi: '**Ek dashboard KPI `$group: { _id: null, ... }` se computed** — total users, average session length ek single grand-total document mein.',
      },
    ],

    interviewQA: [
      {
        q: 'How does $group work, what is the role of _id, and what are the accumulator operators?',
        qHi: '`$group` kaise kaam karता hai, `_id` ka role kya hai, aur accumulator operators kya hain?',
        a: 'The $group stage collapses all the documents flowing into it that produce the same _id value into a single output document per distinct _id. The _id field is mandatory and defines the grouping key: it is typically a field reference such as the value of a region field, in which case documents are grouped by region and each output document\'s _id holds the region value, but it can also be a document combining several fields to group by their combination, or the constant null to place every document into one group for a grand total. Every field in the $group specification other than _id is an accumulator, an operator that computes one value across all the documents in each group. The common accumulators are $sum, which sums a field\'s values or, given the literal 1, counts the documents; $avg for the average; $min and $max for the smallest and largest value; $push, which collects every value into an array preserving duplicates and order; $addToSet, which collects the distinct values into an array; and $first and $last, which return a value from the first or last document of each group and are only meaningful when a $sort precedes the $group to establish the order. This is directly analogous to SQL\'s GROUP BY with aggregate functions.',
        aHi: '`$group` stage un sabhi documents ko jo isमें baह rahe hain aur same `_id` value produce karते hain prati distinct `_id` ek single output document mein collapse karता hai. `_id` field mandatory hai aur grouping key define karता hai. `_id` ke alावा `$group` specification ka har field ek accumulator hai. Common accumulators hain `$sum` (ek field ki values sum, ya `1` se documents count), `$avg`, `$min`/`$max`, `$push` (har value ek array mein), `$addToSet` (distinct values), aur `$first`/`$last` (sirf ek `$sort` ke baad meaningful).',
      },
      {
        q: 'How do you compute a grand total across an entire collection with aggregation, and when would you use $count instead?',
        qHi: 'Aap aggregation se ek poori collection ke across ek grand total kaise compute karते ho, aur aap iske bजाy `$count` kab istemal karोge?',
        a: 'To compute a grand total, you use a $group stage with _id set to null, or to any constant value. Setting _id to a constant means every document produces the same grouping key, so they all fall into a single group, and the accumulators in that $group then aggregate the entire input into one output document. For example, $group with _id null and a total field of $sum of amt and a count field of $sum of 1 produces a single document with the sum of all amounts and the total document count. This is the general mechanism for an overall sum, average, minimum, maximum, or count. The $count stage is a specialized shorthand for the specific case where counting is the only thing needed: $count with a field name is equivalent to grouping by null with a $sum of 1 and then projecting away the _id, producing a flat document with just the count. You use $count when you only need the number of documents and nothing else; you use $group with _id null when you need the count alongside other aggregates, or when you need aggregates per group rather than overall.',
        aHi: 'Ek grand total compute karne ke liye, aap `_id` ko `null` set karके ek `$group` stage istemal karते ho. `_id` ko ek constant set karna matlab har document same grouping key produce karता hai, to wo sab ek single group mein aate hain. `$count` stage us specific case ke liye ek specialized shorthand hai jahaan counting hi ekmatra cheez hai jo chahiye. Aap `$count` istemal karते ho jab aapको sirf documents ki sankhya chahiye; aap `$group` `_id: null` ke saath istemal karते ho jab aapको count doosre aggregates ke saath chahiye.',
      },
    ],

    exercises: [
      {
        task: 'Insert four `sales` documents with `region` (`"US"` x2, `"EU"` x2) and `amt` (100, 50, 200, 30). Write a `$group` by `region` computing `total` (`$sum` of amt), `count` (`$sum: 1`), and `avg` (`$avg` of amt), then `$sort` by `total` descending.',
        taskHi: 'Chaar `sales` documents `region` (`"US"` x2, `"EU"` x2) aur `amt` (100, 50, 200, 30) ke saath insert karo. `region` se ek `$group` likho jo `total`, `count`, aur `avg` compute karta hai, phir `total` descending `$sort` karo.',
        hint: 'Accumulator field references need the `$` prefix (`$amt`, not `amt`). `$sum: 1` counts documents; `$sum: "$amt"` sums the field. The output `_id` holds the region.',
        hintHi: 'Accumulator field references ko `$` prefix chahiye (`$amt`, `amt` nahi). `$sum: 1` documents count karta hai.',
      },
      {
        task: 'Insert three `sales` documents with just an `amt` field (100, 50, 25). Write a `$group` with `_id: null` computing `total` (`$sum`), `count` (`$sum: 1`), and `biggest` (`$max`). Confirm the single result is `{ _id: null, total: 175, count: 3, biggest: 100 }`.',
        taskHi: 'Teen `sales` documents sirf ek `amt` field (100, 50, 25) ke saath insert karo. `_id: null` ke saath ek `$group` likho jo `total`, `count`, aur `biggest` compute karta hai.',
        hint: '`_id: null` puts every document into one group, so the accumulators aggregate the entire input into a single grand-total document.',
        hintHi: '`_id: null` har document ko ek group mein daalta hai, to accumulators poore input ko ek single grand-total document mein aggregate karte hain.',
      },
      {
        task: 'Insert four `sales` documents: US/a, US/b, US/a, EU/a (fields `region`, `product`). Write a `$group` by `region` with `products: { $addToSet: "$product" }`, then `$sort` by `_id`. Confirm US has `["a", "b"]` (distinct) and EU has `["a"]`.',
        taskHi: 'Chaar `sales` documents insert karo: US/a, US/b, US/a, EU/a. `region` se ek `$group` likho `products: { $addToSet: "$product" }` ke saath, phir `_id` se `$sort` karo.',
        hint: '`$addToSet` collects the DISTINCT values per group (US has "a" twice but the set has it once). `$push` would keep both copies of "a".',
        hintHi: '`$addToSet` prati group DISTINCT values collect karta hai. `$push` "a" ki dono copies rakhta.',
      },
    ],

    keyTakeaways: [
      '`$group` collapses documents sharing an `_id` value into ONE output document per distinct `_id`. `_id` is MANDATORY and IS the grouping key — `{ _id: "$region" }` groups by region, and the output `_id` HOLDS the region value. It\'s SQL\'s `GROUP BY`.',
      'ACCUMULATORS (every `$group` field except `_id`) compute one value across all docs in the group: `$sum: "$f"` (sum) / `$sum: 1` (COUNT docs), `$avg`, `$min`/`$max`, `$push` (array of ALL values, dups + order), `$addToSet` (array of DISTINCT values), `$first`/`$last` (value from the first/last doc — meaningful ONLY after a `$sort`).',
      'FIELD REFERENCES need the `$` prefix: `$sum: "$amt"` sums the field; `$sum: "amt"` sums the literal string "amt" → 0. This `$`-prefix convention is pervasive in every aggregation expression.',
      '`_id: null` (or any constant) → every doc falls into ONE group → a GRAND TOTAL (one output document aggregating the whole input). This is how you do an overall sum/avg/count.',
      'Group by MULTIPLE fields: `{ _id: { region: "$region", product: "$product" } }` → one output doc per distinct combination, `_id` is the `{ region, product }` object.',
      '`{ $count: "n" }` (L1) = `{ $group: { _id: null, n: { $sum: 1 } } }` + project away `_id`. Use `$count` when counting is ALL you need; use `$group` + `$sum: 1` when you need the count alongside other accumulators or per-group.',
      'THE COMMON SHAPE: `$match` → `$group` → `$sort` → `$limit` = "top N by some metric" — covers a large fraction of real aggregation.',
    ],
    keyTakeawaysHi: [
      '`$group` un documents ko jo ek `_id` value share karते hain prati distinct `_id` EK output document mein collapse karता hai. `_id` MANDATORY hai aur grouping key HI hai. Ye SQL ka `GROUP BY` hai.',
      'ACCUMULATORS: `$sum: "$f"` / `$sum: 1` (docs COUNT), `$avg`, `$min`/`$max`, `$push` (SAARI values ka array), `$addToSet` (DISTINCT values ka array), `$first`/`$last` (SIRF ek `$sort` ke baad meaningful).',
      'FIELD REFERENCES ko `$` prefix chahiye: `$sum: "$amt"` field sum karता hai; `$sum: "amt"` literal string "amt" sum karता hai → 0.',
      '`_id: null` → har doc EK group mein → ek GRAND TOTAL. Ye overall sum/avg/count karne ka tarika hai.',
      'MULTIPLE fields se group: `{ _id: { region: "$region", product: "$product" } }` → prati distinct combination ek output doc.',
      '`{ $count: "n" }` = `{ $group: { _id: null, n: { $sum: 1 } } }` + `_id` project away. `$count` jab counting HI chahiye; `$group` + `$sum: 1` jab count doosre accumulators ke saath ya per-group chahiye.',
      'COMMON SHAPE: `$match` → `$group` → `$sort` → `$limit` = "top N by some metric".',
    ],
  },

  {
    slug: 'mongo-unwind-lookup-and-expressions',
    title: '$unwind, $lookup & Expression Operators',
    titleHi: '$unwind, $lookup Aur Expression Operators',
    description: '$unwind turns one document with an N-element array into N documents. $lookup joins another collection. And inside every stage, the $-expression language — $concat, $cond, $ifNull, $map, arithmetic — computes derived values from each document.',
    descriptionHi: '`$unwind` ek N-element array waale ek document ko N documents mein badalta hai. `$lookup` ek doosri collection join karता hai. Aur har stage ke andar, `$`-expression language — `$concat`, `$cond`, `$ifNull`, `$map`, arithmetic — har document se derived values compute karता hai.',
    difficulty: 'HARD',
    duration: 26,
    order: 3,

    analogy: {
      en: '**A shredder that turns a bundled report into loose pages, a stapler that attaches a related memo to each file, and a calculator that fills in a "total" line from the numbers already on the page.** `$unwind` is the shredder: a document holding a five-element `items` array becomes five documents, each with one item — now you can group, filter, or sum across items as if they were separate records. `$lookup` is the stapler: for each document, it goes to another collection, finds the matching records, and staples them on as a new array field. And the `$`-expression language is the calculator that runs inside any stage: `$concat` to join strings into a full name, `$cond` for an if-then-else, `$ifNull` to supply a default, `$multiply` and `$add` for arithmetic — computing new fields from the fields each document already has.',
      hi: '**Ek shredder jo ek bundled report ko loose pages mein badalta hai, ek stapler jo har file mein ek related memo attach karता hai, aur ek calculator jo page par pehle se maujood numbers se ek "total" line bhar deता hai.** `$unwind` shredder hai: ek document jo ek paांch-element `items` array rakhता hai paांch documents ban jaता hai, har ek ek item ke saath. `$lookup` stapler hai: har document ke liye, ye ek doosri collection mein jaता hai, matching records dhoondता hai, aur unhe ek naye array field ke roop mein staple karता hai. Aur `$`-expression language wo calculator hai jo kisī bhi stage ke andar chalता hai: `$concat` strings join karne ko, `$cond` if-then-else ke liye, `$ifNull` ek default supply karne ko, `$multiply`/`$add` arithmetic ke liye.',
    },

    simple: `**\`$unwind: "$arr"\` -- one doc with an N-element array becomes N docs, one per element**

\`\`\`js
// { _id: 1, tags: ["x", "y"] }  becomes:
//   { _id: 1, tags: "x" }
//   { _id: 1, tags: "y" }
await db.posts.aggregate([
  { $unwind: "$tags" },
  { $group: { _id: "$tags", count: { $sum: 1 } } },   // now countable per tag
]).toArray();
\`\`\`

**\`$lookup\` -- join another collection into an array field on each doc**

\`\`\`js
await db.orders.aggregate([
  { $lookup: { from: "customers", localField: "custId", foreignField: "_id", as: "cust" } },
  { $unwind: "$cust" },                                  // cust is a 1-element array -> flatten
  { $project: { _id: 1, amt: 1, custName: "$cust.name" } },
]).toArray();
\`\`\`

**\`$\`-EXPRESSIONS: compute derived values inside any stage (\`$project\`, \`$group\`, \`$addFields\`)**

\`\`\`js
{ $project: {
    fullName:  { $concat: ["$first", " ", "$last"] },        // string join
    lineTotal: { $multiply: ["$price", "$qty"] },            // arithmetic
    tier:      { $cond: [ { $gte: ["$spend", 1000] }, "gold", "standard" ] },  // if/then/else
    nickname:  { $ifNull: ["$nick", "(none)"] },             // default for missing/null
} }
\`\`\`
\`\`\`
$concat $toUpper $toLower $substr $split    -- strings
$add $subtract $multiply $divide $mod        -- arithmetic
$eq $ne $gt $gte $lt $lte $and $or $not       -- comparison/logic (return true/false)
$cond $switch $ifNull                         -- conditionals
$map $filter $reduce $size $arrayElemAt        -- array transforms
\`\`\``,

    simpleHi: `**\`$unwind: "$arr"\` -- ek N-element array waala ek doc N docs ban jaता hai, prati element ek**

\`\`\`js
// { _id: 1, tags: ["x", "y"] }  ban jaता hai:
//   { _id: 1, tags: "x" }
//   { _id: 1, tags: "y" }
await db.posts.aggregate([
  { $unwind: "$tags" },
  { $group: { _id: "$tags", count: { $sum: 1 } } },
]).toArray();
\`\`\`

**\`$lookup\` -- ek doosri collection ko har doc par ek array field mein join karो**

\`\`\`js
await db.orders.aggregate([
  { $lookup: { from: "customers", localField: "custId", foreignField: "_id", as: "cust" } },
  { $unwind: "$cust" },
  { $project: { _id: 1, amt: 1, custName: "$cust.name" } },
]).toArray();
\`\`\`

**\`$\`-EXPRESSIONS: kisī bhi stage ke andar derived values compute karो**

\`\`\`js
{ $project: {
    fullName:  { $concat: ["$first", " ", "$last"] },
    lineTotal: { $multiply: ["$price", "$qty"] },
    tier:      { $cond: [ { $gte: ["$spend", 1000] }, "gold", "standard" ] },
    nickname:  { $ifNull: ["$nick", "(none)"] },
} }
\`\`\`
\`\`\`
$concat $toUpper $toLower $substr $split    -- strings
$add $subtract $multiply $divide $mod        -- arithmetic
$eq $gt $and $or $not                        -- comparison/logic
$cond $switch $ifNull                        -- conditionals
$map $filter $reduce $size $arrayElemAt      -- array transforms
\`\`\``,

    content: `## \`$unwind\`

\`$unwind: "$arrayField"\` deconstructs an array field: for a document whose \`arrayField\` has N elements, \`$unwind\` emits N copies of the document, each with \`arrayField\` set to one element instead of the array.

\`\`\`js
// input:  { _id: 1, title: "A", tags: ["x", "y"] }
// output: { _id: 1, title: "A", tags: "x" }
//         { _id: 1, title: "A", tags: "y" }
\`\`\`

This is the key to aggregating *across* array elements. To count how often each tag is used, \`$unwind\` the \`tags\` array (turning each tag into its own document), then \`$group\` by \`tags\`:

\`\`\`js
[ { $unwind: "$tags" }, { $group: { _id: "$tags", count: { $sum: 1 } } } ]
\`\`\`

By default, a document whose array is empty or missing is *dropped* by \`$unwind\`. Passing \`{ $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } }\` keeps such documents (with the field unset).

## \`$lookup\`

\`$lookup\` performs a left outer join to another collection:

\`\`\`js
{ $lookup: {
    from: "customers",         // the collection to join
    localField: "custId",      // field on THIS document
    foreignField: "_id",       // field on the FROM collection to match against
    as: "cust",                // put matches in a new array field named this
} }
\`\`\`

For each input document, \`$lookup\` finds every document in \`from\` where \`foreignField\` equals this document's \`localField\`, and sets \`as\` to the array of those matches (an empty array if none match). Because \`as\` is always an array, a lookup that you expect to match exactly one document is usually followed by \`{ $unwind: "$cust" }\` to flatten the one-element array into a plain sub-document, and then a \`$project\` to pull out the fields you want.

\`$lookup\` also has a **pipeline form** (\`{ $lookup: { from, let, pipeline, as } }\`) that runs a full sub-pipeline against the foreign collection with access to values from the current document — used for joins with extra filtering or aggregation on the joined side.

Remember from Module 14 Lesson 3: \`$lookup\` runs a lookup per input document and is more expensive than a single-collection query. Filter with \`$match\` first, and if you find yourself \`$lookup\`-ing the same collections constantly, consider embedding or extended references.

## The \`$\`-expression language

Wherever a stage computes a value — \`$project\`, \`$group\` accumulators, \`$addFields\` (add fields without removing others), \`$match\` with \`$expr\` — you use MongoDB's expression language. Every expression is either a field path (\`"$field"\`), a literal, or an operator object \`{ $operator: [args] }\`:

**Strings**: \`$concat\`, \`$toUpper\`, \`$toLower\`, \`$substr\`, \`$split\`, \`$trim\`, \`$strLenCP\`.
**Arithmetic**: \`$add\`, \`$subtract\`, \`$multiply\`, \`$divide\`, \`$mod\`, \`$round\`, \`$abs\`.
**Comparison / logic** (return a boolean): \`$eq\`, \`$ne\`, \`$gt\`, \`$gte\`, \`$lt\`, \`$lte\`, \`$and\`, \`$or\`, \`$not\`, \`$in\`.
**Conditionals**: \`$cond: [ifExpr, thenValue, elseValue]\` (a ternary), \`$switch\` (multi-branch), \`$ifNull: [value, fallback]\` (use fallback if value is null or missing).
**Array transforms**: \`$map\` (transform each element), \`$filter\` (keep matching elements), \`$reduce\` (fold to a single value), \`$size\`, \`$arrayElemAt\`, \`$slice\`, \`$first\`, \`$last\`.
**Type / misc**: \`$type\`, \`$toString\`, \`$toInt\`, \`$dateToString\`, \`$dateTrunc\`, \`$literal\`.

\`\`\`js
{ $project: {
    _id: 0,
    fullName: { $concat: ["$first", " ", "$last"] },
    isAdult:  { $gte: ["$age", 18] },
    tier:     { $cond: [{ $gte: ["$spend", 1000] }, "gold", "standard"] },
    tags:     { $ifNull: ["$tags", []] },
} }
\`\`\`

Inside a sub-expression like \`$map\` or \`$filter\`, the current element is referred to with \`$$this\` (or a name you bind with \`as\`), and \`$$ROOT\` refers to the whole current document. The double dollar sign marks a *variable* rather than a field path.

## Putting it together

A realistic pipeline chains these: \`$match\` (filter, uses an index) → \`$lookup\` (join) → \`$unwind\` (flatten the join) → \`$group\` (aggregate) → \`$project\` (compute final shape) → \`$sort\` → \`$limit\`. That is a complete analytical query, and it is what replaces a multi-join, grouped, computed SQL \`SELECT\`.`,

    contentHi: `## \`$unwind\`

\`$unwind: "$arrayField"\` ek array field ko deconstruct karता hai: ek document jiske \`arrayField\` ke N elements hain, \`$unwind\` document ki N copies emit karता hai, har ek \`arrayField\` ek element par set.

\`\`\`js
// input:  { _id: 1, tags: ["x", "y"] }
// output: { _id: 1, tags: "x" } aur { _id: 1, tags: "y" }
\`\`\`

Ye array elements ke *across* aggregate karne ki key hai. Default se, ek document jiska array empty ya missing hai \`$unwind\` se *drop* hota hai; \`preserveNullAndEmptyArrays: true\` unhe rakhता hai.

## \`$lookup\`

\`\`\`js
{ $lookup: { from: "customers", localField: "custId", foreignField: "_id", as: "cust" } }
\`\`\`

Har input document ke liye, \`$lookup\` \`from\` mein har document dhoondता hai jahaan \`foreignField\` is document ke \`localField\` ke barabar hai. Kyunki \`as\` hamesha ek array hai, ek lookup jise aap ek document match karne ki ummeed karते ho usually \`{ $unwind: "$cust" }\` se follow hota hai.

\`$lookup\` prati input document ek lookup chalाता hai aur ek single-collection query se zyada expensive hai (Module 14 Lesson 3).

## \`$\`-expression language

Jahaan bhi ek stage ek value compute karता hai, aap MongoDB ki expression language istemal karते ho. Har expression ya to ek field path (\`"$field"\`), ek literal, ya ek operator object \`{ $operator: [args] }\` hai:

- **Strings**: \`$concat\`, \`$toUpper\`, \`$split\`.
- **Arithmetic**: \`$add\`, \`$multiply\`, \`$divide\`, \`$mod\`.
- **Comparison/logic**: \`$eq\`, \`$gt\`, \`$and\`, \`$or\`.
- **Conditionals**: \`$cond: [if, then, else]\`, \`$switch\`, \`$ifNull: [value, fallback]\`.
- **Array transforms**: \`$map\`, \`$filter\`, \`$reduce\`, \`$size\`.

\`\`\`js
{ $project: {
    fullName: { $concat: ["$first", " ", "$last"] },
    isAdult:  { $gte: ["$age", 18] },
    tier:     { $cond: [{ $gte: ["$spend", 1000] }, "gold", "standard"] },
} }
\`\`\`

\`$$this\` sub-expression mein current element, \`$$ROOT\` poora current document — double dollar sign ek *variable* mark karता hai.

## Ise ek saath rakhna

Ek realistic pipeline: \`$match\` → \`$lookup\` → \`$unwind\` → \`$group\` → \`$project\` → \`$sort\` → \`$limit\`.`,

    examples: [
      {
        title: '$unwind an array, then $group to count each element',
        titleHi: 'Ek array $unwind karo, phir har element count karne ko $group',
        code: `await db.posts.insertMany([
  { _id: 1, tags: ["x", "y"] },
  { _id: 2, tags: ["y", "z"] },
  { _id: 3, tags: ["y"] },
]);
print(await db.posts.aggregate([
  { $unwind: "$tags" },
  { $group: { _id: "$tags", count: { $sum: 1 } } },
  { $sort: { _id: 1 } },
]).toArray());`,
        output: `[{"_id":"x","count":1},{"_id":"y","count":3},{"_id":"z","count":1}]`,
        explain: '`$unwind: "$tags"` turns each post into one document per tag — post 1 (`["x","y"]`) becomes two docs. Then `$group` by the now-scalar `tags` field counts occurrences across all of them: "y" appears in all three posts (count 3), "x" and "z" once each.',
        explainHi: '`$unwind: "$tags"` har post ko prati tag ek document mein badalta hai — post 1 (`["x","y"]`) do docs ban jaता hai. Phir ab-scalar `tags` field se `$group` occurrences count karta hai: "y" teenon posts mein hai (count 3), "x" aur "z" ek-ek baar.',
      },
      {
        title: '$lookup + $unwind + $project to flatten a join',
        titleHi: 'Ek join flatten karne ko $lookup + $unwind + $project',
        code: `await db.customers.insertMany([{ _id: 10, name: "Ravi" }]);
await db.orders.insertMany([
  { _id: 1, custId: 10, amt: 99 },
  { _id: 2, custId: 10, amt: 20 },
]);
print(await db.orders.aggregate([
  { $lookup: { from: "customers", localField: "custId", foreignField: "_id", as: "cust" } },
  { $unwind: "$cust" },
  { $project: { _id: 1, amt: 1, custName: "$cust.name" } },
]).toArray());`,
        output: `[{"_id":1,"amt":99,"custName":"Ravi"},{"_id":2,"amt":20,"custName":"Ravi"}]`,
        explain: '`$lookup` puts the matching customer in a `cust` ARRAY field on each order. `$unwind: "$cust"` flattens that one-element array into a plain sub-document, so `"$cust.name"` in `$project` returns the scalar name "Ravi" (not an array). Both orders get `custName: "Ravi"`.',
        explainHi: '`$lookup` matching customer ko har order par ek `cust` ARRAY field mein daalta hai. `$unwind: "$cust"` us one-element array ko ek plain sub-document mein flatten karta hai, to `$project` mein `"$cust.name"` scalar name "Ravi" lautaता hai (ek array nahi).',
      },
      {
        title: '$project with expression operators: $concat, $gte, $cond, $ifNull',
        titleHi: '$project expression operators ke saath: $concat, $gte, $cond, $ifNull',
        code: `await db.users.insertMany([
  { first: "Ravi", last: "Kumar", age: 30, spend: 1500 },
  { first: "Amit", last: "Shah", age: 15, spend: 200 },
]);
print(await db.users.aggregate([
  { $project: {
      _id: 0,
      name: { $concat: ["$first", " ", "$last"] },
      isAdult: { $gte: ["$age", 18] },
      tier: { $cond: [{ $gte: ["$spend", 1000] }, "gold", "standard"] },
      nick: { $ifNull: ["$nick", "(none)"] },
  } },
]).toArray());`,
        output: `[{"name":"Ravi Kumar","isAdult":true,"tier":"gold","nick":"(none)"},{"name":"Amit Shah","isAdult":false,"tier":"standard","nick":"(none)"}]`,
        explain: '`$project` computes four derived fields per document: `name` via `$concat` of first/last, `isAdult` via `$gte` on age (Ravi 30 → true, Amit 15 → false), `tier` via `$cond` (spend >= 1000 → "gold" for Ravi, "standard" for Amit), and `nick` via `$ifNull` supplying "(none)" since neither doc has a `nick` field.',
        explainHi: '`$project` prati document chaar derived fields compute karta hai: `name` `$concat` se, `isAdult` `$gte` se age par (Ravi 30 → true, Amit 15 → false), `tier` `$cond` se (spend >= 1000 → Ravi ke liye "gold"), aur `nick` `$ifNull` se "(none)" supply karte hue.',
      },
    ],

    mistakes: [
      {
        wrong: `// $unwind-ing then forgetting the array field is now a single value, not an array
await db.posts.aggregate([
  { $unwind: "$tags" },
  { $match: { tags: { $in: ["x", "y"] } } },   // after $unwind, "tags" is ONE string
]).toArray();
// this works, but people write { $elemMatch: ... } or expect array semantics
// -- after $unwind, each document's "tags" is a scalar, the array is gone`,
        right: `// be clear about the shape at each stage:
await db.posts.aggregate([
  { $unwind: "$tags" },            // now each doc has tags: <one string>
  { $match: { tags: { $in: ["x", "y"] } } },   // scalar comparison, correct
  { $group: { _id: "$_id", tags: { $push: "$tags" } } },  // rebuild the array if needed
]).toArray();`,
        why: 'After $unwind processes a document, the field it unwound no longer holds an array in the resulting documents; each output document has that field set to a single element value. Any stage after the $unwind therefore sees a scalar there, not an array, so array-specific query operators like $elemMatch or expectations about array containment behavior no longer apply, and ordinary scalar comparisons are what is correct. The array as a structure is gone from that point in the pipeline; if a later stage needs the array back, for example to return documents in their original shape, it must be reconstructed with a $group that pushes the unwound values back into an array keyed by the original document identifier. Keeping track of what shape each field has at each stage of the pipeline is essential to writing correct stages, and $unwind is the stage that most often changes a field\'s shape.',
        whyHi: '`$unwind` ke ek document process karne ke baad, jo field ise unwind kiya wo resulting documents mein ab ek array nahi rakhता; har output document ke us field ki ek single element value hai. `$unwind` ke baad koi bhi stage wahaan ek scalar dekhता hai, ek array nahi. Agar ek later stage array wapas chahता hai, ise ek `$group` se reconstruct karना chahiye jo unwound values ko wapas ek array mein push karता hai.',
      },
      {
        wrong: `// treating $lookup's "as" field as a single document
await db.orders.aggregate([
  { $lookup: { from: "customers", localField: "custId", foreignField: "_id", as: "cust" } },
  { $project: { custName: "$cust.name" } },   // "cust" is an ARRAY -- this gives
]).toArray();                                  // an array of names, or [] if no match`,
        right: `await db.orders.aggregate([
  { $lookup: { from: "customers", localField: "custId", foreignField: "_id", as: "cust" } },
  { $unwind: "$cust" },                        // flatten the 1-element array
  { $project: { custName: "$cust.name" } },    // now "cust" is a document, "$cust.name" is the name
]).toArray();
// (use $unwind with preserveNullAndEmptyArrays if an unmatched order must survive)`,
        why: 'The as field of a $lookup is always populated with an array of the matched foreign documents, even when the join is expected to match exactly one, because $lookup is defined as returning all matches and cannot know that the relationship is one-to-one. Accessing a subfield of that array with dot notation, such as the name field, yields an array of the name values from every matched document rather than a single name, and yields an empty array when nothing matched. When the join is genuinely one-to-one and a plain sub-document is wanted, the standard follow-up is a $unwind on the as field, which turns the one-element array into a single embedded document so that subsequent dot-notation access returns the scalar field directly. If an input document with no match must be preserved rather than dropped, the $unwind is given the preserveNullAndEmptyArrays option.',
        whyHi: 'Ek `$lookup` ka `as` field hamesha matched foreign documents ke ek array se populate hota hai, tab bhi jab join theek ek match karne ki ummeed hai. Us array ke ek subfield ko dot notation se access karna har matched document se name values ka ek array yield karता hai, ek single name nahi. Jab join genuinely one-to-one hai, standard follow-up `as` field par ek `$unwind` hai.',
      },
      {
        wrong: `// forgetting the $ prefix inside an expression, or using $ where $$ is needed
{ $project: { total: { $add: [price, tax] } } }
// "price" and "tax" without $ are literal strings -- $add of strings errors or NaN
{ $project: { doubled: { $map: { input: "$nums", in: { $multiply: ["$this", 2] } } } } }
// inside $map, the current element is $$this (variable), not $this (field path)`,
        right: `{ $project: { total: { $add: ["$price", "$tax"] } } }   // $ = field references
{ $project: { doubled: { $map: { input: "$nums", in: { $multiply: ["$$this", 2] } } } } }
// $$this (double $) = the map's current-element VARIABLE`,
        why: 'MongoDB\'s expression language distinguishes three things by prefix. A bare string is a literal value. A string beginning with a single dollar sign is a field path, referring to the value of that field in the document currently being processed. A string beginning with a double dollar sign is a variable reference, used for values that are not fields of the current document, such as the current element inside a $map or $filter, which is bound to the name this by default and accessed as $$this, or the whole current document, accessed as $$ROOT. Omitting the single dollar sign passes a literal string where a field value was intended, which typically causes a type error or a nonsensical result. Using a single dollar sign where a double is needed, such as writing $this instead of $$this inside a $map, looks for a field literally named this on the document rather than the loop variable, which almost never exists.',
        whyHi: 'MongoDB ki expression language teen cheezon ko prefix se distinguish karती hai. Ek bare string ek literal value hai. Ek single dollar sign se shuru hone waali string ek field path hai. Ek double dollar sign se shuru hone waali string ek variable reference hai, un values ke liye jo current document ke fields nahi hain, jaisा `$map` ya `$filter` ke andar current element, jo default se `this` naam se bound hai aur `$$this` ke roop mein access hota hai.',
      },
    ],

    realWorld: [
      {
        en: '**A "tag cloud" built with `$unwind` on the tags array then `$group` by tag with `$sum: 1`, `$sort` by count** — turning per-post tag arrays into a global tag-frequency list in one pipeline.',
        hi: '**Ek "tag cloud" `$unwind` tags array par phir tag se `$group` se bana** — prati-post tag arrays ko ek global tag-frequency list mein badalte hue.',
      },
      {
        en: '**An order-detail view: `$lookup` the customer, `$lookup` the products for each line item (pipeline form), `$unwind`, and `$project` a flat display document** — one aggregation replacing three round trips.',
        hi: '**Ek order-detail view: customer `$lookup`, line items ke products `$lookup`, `$unwind`, aur ek flat display document `$project`**.',
      },
      {
        en: '**A `$project` computing a `fullName`, a `daysSinceSignup` (date arithmetic), and a `plan` tier (`$switch` on usage)** — derived fields the client would otherwise compute, done once in the database.',
        hi: '**Ek `$project` jo ek `fullName`, ek `daysSinceSignup`, aur ek `plan` tier compute karta hai** — derived fields database mein ek baar.',
      },
    ],

    interviewQA: [
      {
        q: 'What does $unwind do, and why is it needed to aggregate across array elements?',
        qHi: '`$unwind` kya karता hai, aur array elements ke across aggregate karne ke liye ye kyun chahiye?',
        a: 'The $unwind stage deconstructs an array field: for each input document, if its array field has N elements, $unwind emits N copies of that document, each one identical except that the array field is replaced with a single one of the elements. A document with a two-element tags array becomes two documents, one per tag. This is needed for aggregating across array elements because stages like $group operate on documents, grouping by a field\'s value, and a field that holds an array cannot be grouped by its individual elements directly. By first unwinding the array so each element becomes its own document, the subsequent $group can then group by that now-scalar field, which is how you compute, for example, how many times each tag appears across a whole collection: unwind the tags array, then group by the tag with a count. By default $unwind drops documents whose array is empty or missing, which can be changed with the preserveNullAndEmptyArrays option. After the unwind, the field is a scalar in every output document, not an array, which matters for how later stages must be written.',
        aHi: '`$unwind` stage ek array field ko deconstruct karता hai: har input document ke liye, agar iske array field ke N elements hain, `$unwind` us document ki N copies emit karता hai. Ye array elements ke across aggregate karne ke liye chahiye kyunki `$group` jaisे stages documents par operate karते hain, aur ek field jo ek array rakhता hai use iske individual elements se directly group nahi kiya ja sakta. Pehle array unwind karके taaki har element apna document ban jaये, subsequent `$group` phir us ab-scalar field se group kar sakta hai.',
      },
      {
        q: 'In MongoDB\'s aggregation expression language, what is the difference between a bare string, a $-prefixed string, and a $$-prefixed string?',
        qHi: 'MongoDB ki aggregation expression language mein, ek bare string, ek `$`-prefixed string, aur ek `$$`-prefixed string mein kya antar hai?',
        a: 'A bare string with no prefix is a literal value, used exactly as written. A string beginning with a single dollar sign is a field path: it refers to the value of the named field in the document currently being processed by the stage, so $price evaluates to whatever the price field holds in each document. A string beginning with two dollar signs is a variable reference, used for values that are not fields of the current document. The most common variables are $$ROOT, which is the entire current document, and, inside array-processing expressions like $map, $filter, and $reduce, the variable holding the current element being iterated, which defaults to the name this and is written $$this, or a custom name bound with an as clause. Getting these prefixes wrong is a frequent mistake: omitting the single dollar sign passes a literal string where a field value was intended, and writing a single dollar sign where two are needed, such as $this instead of $$this inside a $map, looks for a field literally named this rather than the loop variable.',
        aHi: 'Ek bare string bina prefix ke ek literal value hai. Ek single dollar sign se shuru hone waali string ek field path hai: ye stage dwara currently process kiye ja rahe document mein named field ki value ko refer karती hai. Do dollar signs se shuru hone waali string ek variable reference hai, un values ke liye jo current document ke fields nahi hain. Sabse common variables `$$ROOT` (poora current document) aur, `$map`/`$filter`/`$reduce` jaisे array-processing expressions ke andar, current element rakhने waला variable (`$$this`).',
      },
    ],

    exercises: [
      {
        task: 'Insert three `posts` with a `tags` array (`["x","y"]`, `["y","z"]`, `["y"]`). Write a pipeline: `$unwind` the tags array, `$group` by `tags` with a count, `$sort` by `_id`. Confirm `y` has count 3, `x` and `z` have count 1.',
        taskHi: 'Teen `posts` ek `tags` array ke saath insert karo (`["x","y"]`, `["y","z"]`, `["y"]`). Ek pipeline likho: tags array `$unwind`, `tags` se `$group` ek count ke saath, `_id` se `$sort`.',
        hint: '`$unwind` turns each post into one document per tag, so post 1 becomes two docs. Then `$group` by the now-scalar `tags` field counts occurrences across all of them.',
        hintHi: '`$unwind` har post ko prati tag ek document mein badalta hai. Phir `$group` ab-scalar `tags` field se occurrences count karta hai.',
      },
      {
        task: 'Insert a `customers` doc `{ _id: 10, name: "Ravi" }` and two `orders` with `custId: 10`. Write a pipeline: `$lookup` customers into a `cust` array, `$unwind` `$cust`, `$project` `_id`, `amt`, and `custName: "$cust.name"`. Confirm both orders come back with `custName: "Ravi"`.',
        taskHi: 'Ek `customers` doc `{ _id: 10, name: "Ravi" }` aur do `orders` `custId: 10` ke saath insert karo. Ek pipeline likho: `$lookup` customers ek `cust` array mein, `$unwind` `$cust`, `$project`.',
        hint: '`$lookup`\'s `as` field is always an ARRAY. `$unwind` flattens the one-element array so `"$cust.name"` returns the scalar name, not an array of names.',
        hintHi: '`$lookup` ka `as` field hamesha ek ARRAY hai. `$unwind` one-element array ko flatten karta hai.',
      },
      {
        task: 'Insert two `users`: `{ first: "Ravi", last: "Kumar", age: 30, spend: 1500 }` and `{ first: "Amit", last: "Shah", age: 15, spend: 200 }`. Write a `$project` producing `name` (`$concat`), `isAdult` (`$gte` age 18), `tier` (`$cond`: `"gold"` if spend >= 1000 else `"standard"`), and `nick` (`$ifNull` on a missing field → `"(none)"`).',
        taskHi: 'Do `users` insert karo. Ek `$project` likho jo `name` (`$concat`), `isAdult` (`$gte` age 18), `tier` (`$cond`), aur `nick` (`$ifNull` → `"(none)"`) produce karta hai.',
        hint: '`$concat: ["$first", " ", "$last"]` joins strings; `$cond: [testExpr, thenVal, elseVal]` is a ternary; `$ifNull: ["$nick", "(none)"]` supplies a default when `nick` is missing or null.',
        hintHi: '`$concat` strings join karta hai; `$cond: [test, then, else]` ek ternary hai; `$ifNull: ["$nick", "(none)"]` ek default deta hai.',
      },
    ],

    keyTakeaways: [
      '`$unwind: "$arr"` — a doc whose `arr` has N elements becomes N docs, each with `arr` set to ONE element. The KEY to aggregating ACROSS array elements: `$unwind` the array, then `$group` by the now-scalar field (e.g. tag-frequency counts). By default DROPS docs with an empty/missing array — `preserveNullAndEmptyArrays: true` keeps them. After `$unwind`, the field is a SCALAR in every doc, not an array.',
      '`$lookup: { from, localField, foreignField, as }` — left outer join: for each input doc, finds every `from` doc where `foreignField` == this doc\'s `localField`, sets `as` to the ARRAY of matches (`[]` if none). `as` is ALWAYS an array — a one-to-one join is usually followed by `{ $unwind: "$as" }` to flatten, then `$project`.',
      '`$lookup` runs a lookup PER INPUT DOC — more expensive than a single-collection query (Module 14 L3). `$match` first; if you `$lookup` the same collections constantly, consider embedding / extended references. There\'s also a PIPELINE form (`from, let, pipeline, as`) for joins with extra filtering.',
      'THE `$`-EXPRESSION LANGUAGE (used in `$project`, `$group` accumulators, `$addFields`, `$match` with `$expr`): every expression is a field path (`"$f"`), a literal, or an operator object `{ $op: [args] }`. Strings (`$concat`/`$toUpper`/`$split`), arithmetic (`$add`/`$multiply`/`$mod`), comparison→bool (`$eq`/`$gt`/`$and`), conditionals (`$cond: [if, then, else]` / `$switch` / `$ifNull: [val, fallback]`), array transforms (`$map`/`$filter`/`$reduce`/`$size`).',
      'THREE PREFIXES: a BARE string = a literal. `$field` = a FIELD PATH (value in the current doc). `$$var` = a VARIABLE — `$$ROOT` (whole current doc), `$$this` (current element inside `$map`/`$filter`/`$reduce`). Omitting `$` passes a literal where a field was meant; `$this` vs `$$this` inside `$map` is a classic bug.',
      'A COMPLETE analytical pipeline: `$match` (filter, uses index) → `$lookup` (join) → `$unwind` (flatten) → `$group` (aggregate) → `$project` (final shape) → `$sort` → `$limit` — replaces a multi-join, grouped, computed SQL `SELECT`.',
    ],
    keyTakeawaysHi: [
      '`$unwind: "$arr"` — ek doc jiske `arr` ke N elements hain N docs ban jaता hai. Array elements ke ACROSS aggregate karne ki KEY: `$unwind` array, phir ab-scalar field se `$group`. Default se empty/missing array waale docs DROP karता hai. `$unwind` ke baad field har doc mein ek SCALAR hai.',
      '`$lookup: { from, localField, foreignField, as }` — left outer join: `as` HAMESHA ek array hai (`[]` agar koi match nahi) — one-to-one join usually `{ $unwind: "$as" }` se follow hota hai.',
      '`$lookup` PRATI INPUT DOC ek lookup chalाता hai — ek single-collection query se zyada expensive. `$match` pehle. Ek PIPELINE form bhi hai.',
      '`$`-EXPRESSION LANGUAGE: har expression ek field path (`"$f"`), ek literal, ya ek operator object `{ $op: [args] }` hai. Strings, arithmetic, comparison→bool, conditionals (`$cond`/`$switch`/`$ifNull`), array transforms (`$map`/`$filter`/`$reduce`/`$size`).',
      'TEEN PREFIXES: ek BARE string = ek literal. `$field` = ek FIELD PATH. `$$var` = ek VARIABLE — `$$ROOT`, `$$this` (`$map`/`$filter` ke andar current element).',
      'Ek COMPLETE analytical pipeline: `$match` → `$lookup` → `$unwind` → `$group` → `$project` → `$sort` → `$limit`.',
    ],
  },
];
