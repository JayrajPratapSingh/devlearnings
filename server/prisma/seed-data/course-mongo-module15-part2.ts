/**
 * Databases Complete Course — Module 15: MongoDB Aggregation & Indexes, lessons 4-6.
 *
 * Lesson 4: Advanced stages — $facet, $bucket, $setWindowFields, $merge/$out.
 * Lesson 5: Indexes — types (single/compound/multikey/text/partial/TTL/...) and the
 *           ESR rule for compound-index field order.
 * Lesson 6: explain(), covered queries & hint() — reading query plans, COLLSCAN vs
 *           IXSCAN, documents examined vs returned, and forcing an index.
 *
 * Verified against a real in-memory MongoDB (mongodb-memory-server).
 * Run: node verify-mongo.mjs 15
 */

import type { CourseLesson } from './course-js-module1';

export const MONGO_MODULE_15_PART2: CourseLesson[] = [
  {
    slug: 'mongo-advanced-aggregation-stages',
    title: 'Advanced Aggregation Stages',
    titleHi: 'Advanced Aggregation Stages',
    description: '$facet runs several sub-pipelines over the same input in one pass. $bucket groups by numeric ranges. $setWindowFields computes running totals and rankings — MongoDB\'s window functions. $merge and $out write a pipeline\'s results into a collection.',
    descriptionHi: '`$facet` usī input par kई sub-pipelines ek pass mein chalाता hai. `$bucket` numeric ranges se group karता hai. `$setWindowFields` running totals aur rankings compute karता hai — MongoDB ke window functions. `$merge` aur `$out` ek pipeline ke results ko ek collection mein likhते hain.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**An analyst who, from one dataset, produces a summary table, a histogram, and a top-10 list — in a single pass — then also computes a running total down one column and files the finished report in a cabinet.** `$facet` is doing three analyses over the same rows at once instead of re-reading the data three times. `$bucket` is the histogram: sort every value into a price band and count each band. `$setWindowFields` is the running total: for each row, a value computed from a *window* of nearby rows — the sum so far, the rank within its group, the moving average. And `$merge` / `$out` is filing the finished report: instead of returning results to the caller, write them into a collection so a dashboard can read them cheaply later.',
      hi: '**Ek analyst jo, ek dataset se, ek summary table, ek histogram, aur ek top-10 list produce karता hai — ek single pass mein — phir ek column ke neeche ek running total bhi compute karता hai aur finished report ko ek cabinet mein file karता hai.** `$facet` usī rows par teen analyses ek saath kar raha hai data ko teen baar re-read karne ke bजाy. `$bucket` histogram hai: har value ko ek price band mein sort karो aur har band count karो. `$setWindowFields` running total hai: har row ke liye, nearby rows ki ek *window* se computed ek value — ab tak ka sum, iske group mein rank. Aur `$merge` / `$out` finished report file karna hai: results ko caller ko lautाne ke bजाy, unhe ek collection mein likhो.',
    },

    simple: `**\`$facet\` -- run multiple named sub-pipelines over the SAME input, in ONE pass**

\`\`\`js
await db.products.aggregate([
  { $facet: {
      byCategory: [ { $group: { _id: "$cat", n: { $sum: 1 } } } ],
      priceStats: [ { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } } ],
  } },
]).toArray();
// -> [ { byCategory: [...], priceStats: [...] } ]   -- one doc, all facets computed together
\`\`\`

**\`$bucket\` -- group documents into numeric RANGES (a histogram)**

\`\`\`js
{ $bucket: {
    groupBy: "$price",
    boundaries: [0, 10, 100, 1000],   // buckets: [0,10) [10,100) [100,1000)
    default: "other",                  // anything outside the boundaries
    output: { count: { $sum: 1 } },
} }
// -> [ { _id: 0, count: 1 }, { _id: 10, count: 2 }, { _id: 100, count: 2 } ]
\`\`\`

**\`$setWindowFields\` -- window functions: running total, rank, moving average**

\`\`\`js
{ $setWindowFields: {
    partitionBy: "$acct",              // like SQL PARTITION BY
    sortBy: { day: 1 },                // like SQL ORDER BY within the window
    output: {
      runningBalance: { $sum: "$amt", window: { documents: ["unbounded", "current"] } },
    },
} }
// each doc gets runningBalance = sum of amt from the start of its partition to itself
\`\`\`

**\`$merge\` / \`$out\` -- write the pipeline's results to a collection**

\`\`\`js
{ $merge: { into: "region_totals" } }   // upsert results into region_totals (keeps other docs)
{ $out: "region_totals" }               // REPLACE region_totals entirely with the results
\`\`\``,

    simpleHi: `**\`$facet\` -- USI input par kई named sub-pipelines EK pass mein chalाओ**

\`\`\`js
await db.products.aggregate([
  { $facet: {
      byCategory: [ { $group: { _id: "$cat", n: { $sum: 1 } } } ],
      priceStats: [ { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } } ],
  } },
]).toArray();
\`\`\`

**\`$bucket\` -- documents ko numeric RANGES mein group karो (ek histogram)**

\`\`\`js
{ $bucket: {
    groupBy: "$price",
    boundaries: [0, 10, 100, 1000],
    default: "other",
    output: { count: { $sum: 1 } },
} }
\`\`\`

**\`$setWindowFields\` -- window functions: running total, rank, moving average**

\`\`\`js
{ $setWindowFields: {
    partitionBy: "$acct",
    sortBy: { day: 1 },
    output: { runningBalance: { $sum: "$amt", window: { documents: ["unbounded", "current"] } } },
} }
\`\`\`

**\`$merge\` / \`$out\` -- pipeline ke results ko ek collection mein likhो**

\`\`\`js
{ $merge: { into: "region_totals" } }   // results ko upsert karो (doosre docs rakhता hai)
{ $out: "region_totals" }               // region_totals ko poori tarah results se REPLACE karो
\`\`\``,

    content: `## \`$facet\`: multiple analyses in one pass

\`$facet\` takes a set of named sub-pipelines and runs *all of them* against the same input documents — the documents that reached the \`$facet\` stage — producing a single output document whose fields are the results of each sub-pipeline:

\`\`\`js
{ $facet: {
    byCategory: [ { $group: { _id: "$cat", n: { $sum: 1 } } }, { $sort: { _id: 1 } } ],
    priceStats: [ { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } } ],
} }
\`\`\`

Without \`$facet\`, computing a category breakdown *and* overall price stats would require two separate aggregations, each scanning the data. \`$facet\` computes both from one scan. The classic use is a search results page that needs, in one request, the current page of results, the total count, and the facet counts ("47 in Electronics, 12 in Books") for the sidebar filters.

## \`$bucket\` and \`$bucketAuto\`

\`$bucket\` groups documents by which numeric range their \`groupBy\` value falls into:

\`\`\`js
{ $bucket: {
    groupBy: "$price",
    boundaries: [0, 10, 100, 1000],
    default: "other",
    output: { count: { $sum: 1 }, avgPrice: { $avg: "$price" } },
} }
\`\`\`

\`boundaries: [0, 10, 100, 1000]\` defines three buckets — \`[0, 10)\`, \`[10, 100)\`, \`[100, 1000)\` — and each output document's \`_id\` is the lower bound of its bucket. Anything outside all the ranges goes to the \`default\` bucket. \`$bucketAuto\` is the sibling that picks the boundaries for you to produce a requested number of roughly-equal-sized buckets. This is the histogram / distribution stage.

## \`$setWindowFields\`: window functions

\`$setWindowFields\` computes, for each document, a value derived from a **window** of related documents — the direct equivalent of SQL window functions (Module 6):

\`\`\`js
{ $setWindowFields: {
    partitionBy: "$acct",
    sortBy: { day: 1 },
    output: {
      runningBalance: { $sum: "$amt", window: { documents: ["unbounded", "current"] } },
      dayRank:        { $rank: {} },
    },
} }
\`\`\`

- **\`partitionBy\`** — split documents into independent groups (like SQL \`PARTITION BY\`); the window never crosses a partition.
- **\`sortBy\`** — order within each partition.
- **\`output\`** — one or more new fields, each an accumulator (\`$sum\`, \`$avg\`, \`$rank\`, \`$denseRank\`, \`$shift\` for lag/lead, ...) applied over a **window** — a range of rows relative to the current one. \`{ documents: ["unbounded", "current"] }\` is "from the first row of the partition through this row" (a running total). \`{ documents: [-2, 0] }\` is "the current row and the two before it" (a 3-row moving window).

Every document keeps all its original fields and gains the computed window fields — unlike \`$group\`, which collapses documents.

## \`$merge\` and \`$out\`: writing results to a collection

By default a pipeline returns its results to the caller. \`$merge\` and \`$out\` instead write them into a collection:

- **\`$out: "coll"\`** — replaces the entire target collection with the pipeline's output. Simple, atomic-ish (writes to a temp collection then renames), but destroys whatever was there.
- **\`$merge: { into: "coll", on: ..., whenMatched: ..., whenNotMatched: ... }\`** — upserts the pipeline's output into the target by a key, leaving non-matching documents in place. More flexible: it can insert new results, update existing ones, keep or discard the rest.

The main use is **materialized rollups**: run an expensive aggregation on a schedule (hourly revenue by region, daily active users) and \`$merge\` the results into a small summary collection that dashboards query directly — MongoDB's version of a materialized view (Module 11). \`$merge\` can even build **on-demand materialized views** that are incrementally updated.`,

    contentHi: `## \`$facet\`: ek pass mein kई analyses

\`$facet\` named sub-pipelines ka ek set leta hai aur *un sabko* usī input documents ke against chalाता hai — jo documents \`$facet\` stage tak pahunche — ek single output document produce karता hai jiske fields har sub-pipeline ke results hain:

\`\`\`js
{ $facet: {
    byCategory: [ { $group: { _id: "$cat", n: { $sum: 1 } } } ],
    priceStats: [ { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } } ],
} }
\`\`\`

Classic use ek search results page hai jise ek request mein current page, total count, aur facet counts chahiye.

## \`$bucket\`

\`$bucket\` documents ko group karता hai ki unki \`groupBy\` value kaunse numeric range mein aati hai:

\`\`\`js
{ $bucket: { groupBy: "$price", boundaries: [0, 10, 100, 1000], default: "other",
    output: { count: { $sum: 1 } } } }
\`\`\`

\`$bucketAuto\` boundaries aapke liye chunता hai. Ye histogram / distribution stage hai.

## \`$setWindowFields\`: window functions

\`$setWindowFields\` har document ke liye, related documents ki ek **window** se derived ek value compute karता hai — SQL window functions (Module 6) ka direct equivalent:

\`\`\`js
{ $setWindowFields: {
    partitionBy: "$acct", sortBy: { day: 1 },
    output: { runningBalance: { $sum: "$amt", window: { documents: ["unbounded", "current"] } } },
} }
\`\`\`

- **\`partitionBy\`** — documents ko independent groups mein split karो.
- **\`sortBy\`** — har partition ke andar order.
- **\`output\`** — ek ya zyada naye fields, har ek ek accumulator ek **window** par. \`{ documents: ["unbounded", "current"] }\` = "partition ki pehli row se is row tak" (running total).

Har document apne saare original fields rakhता hai — \`$group\` ke uлт.

## \`$merge\` aur \`$out\`

- **\`$out: "coll"\`** — poore target collection ko pipeline ke output se replace karता hai.
- **\`$merge: { into, on, whenMatched, whenNotMatched }\`** — pipeline ke output ko target mein ek key se upsert karता hai.

Main use **materialized rollups** hai: ek schedule par ek expensive aggregation chalाओ aur results ko ek chhoti summary collection mein \`$merge\` karो — MongoDB ka materialized view (Module 11) ka version.`,

    examples: [
      {
        title: '$facet computes two independent analyses from one input pass',
        titleHi: '$facet ek input pass se do independent analyses compute karta hai',
        code: `await db.products.insertMany([
  { name: "a", price: 10, cat: "x" }, { name: "b", price: 100, cat: "x" },
  { name: "c", price: 500, cat: "y" }, { name: "d", price: 20, cat: "y" },
]);
print(await db.products.aggregate([
  { $facet: {
      byCat: [{ $group: { _id: "$cat", n: { $sum: 1 } } }, { $sort: { _id: 1 } }],
      priceStats: [{ $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } }],
  } },
]).toArray());`,
        output: `[{"byCat":[{"_id":"x","n":2},{"_id":"y","n":2}],"priceStats":[{"_id":null,"min":10,"max":500}]}]`,
        explain: '`$facet` runs both sub-pipelines against the same four input documents in one pass: `byCat` groups by category (x: 2, y: 2), and `priceStats` computes the overall min (10) and max (500). The result is a single document with a field per facet — replacing what would be two separate aggregations.',
        explainHi: '`$facet` dono sub-pipelines ko usi chaar input documents ke against ek pass mein chalाता hai: `byCat` category se group karta hai (x: 2, y: 2), aur `priceStats` overall min (10) aur max (500) compute karta hai. Result ek single document hai jiska prati facet ek field hai.',
      },
      {
        title: '$setWindowFields computes a running balance per partition',
        titleHi: '$setWindowFields prati partition ek running balance compute karta hai',
        code: `await db.txns.insertMany([
  { _id: 1, acct: "A", day: 1, amt: 100 },
  { _id: 2, acct: "A", day: 2, amt: -30 },
  { _id: 3, acct: "A", day: 3, amt: 50 },
]);
print(await db.txns.aggregate([
  { $setWindowFields: {
      partitionBy: "$acct",
      sortBy: { day: 1 },
      output: { runningBalance: { $sum: "$amt", window: { documents: ["unbounded", "current"] } } },
  } },
  { $project: { _id: 0, day: 1, amt: 1, runningBalance: 1 } },
]).toArray());`,
        output: `[{"day":1,"amt":100,"runningBalance":100},{"day":2,"amt":-30,"runningBalance":70},{"day":3,"amt":50,"runningBalance":120}]`,
        explain: '`$setWindowFields` partitions by `acct` and sorts by `day`, then for each doc computes `runningBalance` as `$sum` of `amt` over the window from the partition start through the current doc: day 1 → 100, day 2 → 100 + (-30) = 70, day 3 → 70 + 50 = 120. Every original doc passes through with the added field — nothing is collapsed.',
        explainHi: '`$setWindowFields` `acct` se partition aur `day` se sort karta hai, phir har doc ke liye `runningBalance` ko partition start se current doc tak window par `amt` ka `$sum` compute karta hai: day 1 → 100, day 2 → 70, day 3 → 120. Har original doc added field ke saath pass hota hai — kuch collapse nahi hota.',
      },
      {
        title: '$merge writes a grouped rollup into a summary collection',
        titleHi: '$merge ek grouped rollup ko ek summary collection mein likhta hai',
        code: `await db.sales.insertMany([
  { region: "US", amt: 100 }, { region: "US", amt: 50 }, { region: "EU", amt: 200 },
]);
await db.sales.aggregate([
  { $group: { _id: "$region", total: { $sum: "$amt" } } },
  { $merge: { into: "region_totals" } },
]).toArray();
print(await db.region_totals.find({}).sort({ _id: 1 }).toArray());`,
        output: `[{"_id":"EU","total":200},{"_id":"US","total":150}]`,
        explain: 'The `$group` rolls up sales by region (US: 100 + 50 = 150, EU: 200), and `$merge: { into: "region_totals" }` upserts those grouped documents into the `region_totals` collection. Reading it back confirms the rollup was persisted — this is MongoDB\'s materialized-view mechanism.',
        explainHi: '`$group` sales ko region se roll up karta hai (US: 150, EU: 200), aur `$merge: { into: "region_totals" }` un grouped documents ko `region_totals` collection mein upsert karta hai. Ise wapas padhna confirm karta hai ki rollup persist hua — ye MongoDB ka materialized-view mechanism hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// running two separate aggregations to get results + a total count
const results = await db.products.aggregate([{ $match: q }, { $sort: s }, { $skip: 40 }, { $limit: 20 }]).toArray();
const total   = await db.products.aggregate([{ $match: q }, { $count: "n" }]).toArray();
// two passes over the same matched documents -- the $match runs twice`,
        right: `const [out] = await db.products.aggregate([
  { $match: q },
  { $facet: {
      results: [{ $sort: s }, { $skip: 40 }, { $limit: 20 }],
      total:   [{ $count: "n" }],
  } },
]).toArray();
// one $match, one pass, both the page and the count`,
        why: 'When a page of results and the total count of matching documents are both needed, computing them with two separate aggregation calls means the filtering work, and any scanning it entails, happens twice against the same data. The $facet stage exists to avoid this: it takes the documents that reached it, here the output of a single shared $match, and runs multiple named sub-pipelines against that same set, producing one output document containing all their results. Placing the $match before the $facet and putting the pagination logic in one sub-pipeline and the count in another means the expensive matching is done once and both derived results come from the same pass. This pattern is standard for any search or list endpoint that returns a page plus a total, and extends naturally to also computing sidebar facet counts in additional sub-pipelines.',
        whyHi: 'Jab results ka ek page aur matching documents ka total count dono chahiye, unhe do alag aggregation calls se compute karna matlab filtering work do baar hota hai usī data ke against. `$facet` stage ise avoid karne ke liye exist karता hai: ye un documents ko leta hai jo iske tak pahunche aur usī set ke against multiple named sub-pipelines chalाता hai. `$match` ko `$facet` se pehle rakhна matlab expensive matching ek baar hota hai.',
      },
      {
        wrong: `// using $out where $merge was needed -- destroying data
await db.events.aggregate([
  { $match: { day: today } },              // only TODAY's events
  { $group: { _id: "$type", n: { $sum: 1 } } },
  { $out: "daily_type_counts" },           // REPLACES the whole collection
]).toArray();
// yesterday's and every prior day's counts are now GONE -- $out replaced everything`,
        right: `await db.events.aggregate([
  { $match: { day: today } },
  { $group: { _id: { day: today, type: "$type" }, n: { $sum: 1 } } },
  { $merge: { into: "daily_type_counts" } },   // upserts today's rows, keeps prior days
]).toArray();`,
        why: '$out and $merge both write a pipeline\'s results to a collection, but they differ fundamentally in what happens to data already in the target. $out replaces the entire target collection with the pipeline\'s output, discarding everything that was there before, which is correct only when the pipeline genuinely produces the complete desired contents of that collection. $merge instead upserts the output into the target by a key, updating documents that match and inserting those that do not, while leaving every other document in the collection untouched. For an incremental rollup, where each run contributes the results for one time period and previous periods must be preserved, $out would erase the accumulated history on every run, whereas $merge adds or updates just the current period\'s entries. Choosing between them comes down to whether the pipeline output is the whole collection or an increment to it.',
        whyHi: '`$out` aur `$merge` dono ek pipeline ke results ek collection mein likhते hain, par wo fundamentally alag hain ki target mein pehle se maujood data ka kya hota hai. `$out` poore target collection ko pipeline ke output se replace karता hai. `$merge` iske bजाy output ko target mein ek key se upsert karता hai, matching documents update karता hai aur na-matching insert karता hai, jabki har doosरा document untouched chhoड़ता hai. Ek incremental rollup ke liye, `$out` accumulated history erase kar deता.',
      },
      {
        wrong: `// expecting $setWindowFields to collapse documents like $group
await db.txns.aggregate([
  { $setWindowFields: { sortBy: { day: 1 }, output: { total: { $sum: "$amt", window: { documents: ["unbounded", "current"] } } } } },
]).toArray();
// this returns EVERY txn doc, each with an added "total" field -- not one summary row.
// if you wanted a single grand total, use { $group: { _id: null, total: { $sum: "$amt" } } }`,
        right: `// $setWindowFields ADDS fields, keeps all documents -- for per-row running values:
await db.txns.aggregate([
  { $setWindowFields: { sortBy: { day: 1 }, output: { runningTotal: { $sum: "$amt", window: { documents: ["unbounded", "current"] } } } } },
]).toArray();
// each txn now has runningTotal. For a collapsed summary, that's $group's job.`,
        why: '$setWindowFields and $group both apply accumulators like $sum, but they produce fundamentally different output shapes. $group collapses all the documents in each group into a single output document, so a collection becomes one row per group. $setWindowFields does not collapse anything: every input document passes through to the output with all its original fields intact, and each one gains the new fields computed by the accumulators over its window of surrounding documents. This is exactly the distinction between a SQL aggregate function used with GROUP BY, which reduces rows, and a SQL window function, which annotates each row without reducing. Choosing $setWindowFields when a single summary was wanted returns the entire input annotated rather than a summary, and choosing $group when per-row running values were wanted loses the individual documents.',
        whyHi: '`$setWindowFields` aur `$group` dono `$sum` jaisे accumulators apply karते hain, par wo fundamentally alag output shapes produce karते hain. `$group` har group ke saare documents ko ek single output document mein collapse karता hai. `$setWindowFields` kुछ collapse nahi karता: har input document apne saare original fields ke saath output tak pass hota hai, aur har ek naye fields gain karता hai jo accumulators ne iski surrounding documents ki window par compute kiye. Ye theek SQL aggregate function (GROUP BY ke saath) aur SQL window function ke beech distinction hai.',
      },
    ],

    realWorld: [
      {
        en: '**A product search endpoint returning, in one request via `$facet`, the current results page, the total match count, and per-category/per-brand facet counts for the sidebar** — one aggregation instead of four.',
        hi: '**Ek product search endpoint jo ek request mein `$facet` ke through current results page, total match count, aur per-category facet counts lautaता hai**.',
      },
      {
        en: '**A ledger view using `$setWindowFields` to add a `runningBalance` to every transaction row** — the same shape as a bank statement, computed in the database without the client accumulating.',
        hi: '**Ek ledger view jo `$setWindowFields` istemal karta hai har transaction row mein ek `runningBalance` add karne ke liye** — ek bank statement jaisा shape.',
      },
      {
        en: '**A scheduled job that `$merge`s hourly revenue-by-region rollups into a `revenue_hourly` collection** — dashboards read the small pre-aggregated collection instantly instead of re-scanning millions of orders.',
        hi: '**Ek scheduled job jo hourly revenue-by-region rollups ko ek `revenue_hourly` collection mein `$merge` karta hai** — dashboards chhoti pre-aggregated collection turant padhते hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What does $facet do, and what is the canonical use case?',
        qHi: '`$facet` kya karता hai, aur canonical use case kya hai?',
        a: 'The $facet stage takes a set of named sub-pipelines and runs every one of them against the same set of input documents, the documents that reached the $facet stage, producing a single output document whose fields hold the results of each sub-pipeline. This means several different analyses of the same data are computed together from one pass rather than requiring a separate aggregation, and separate scan, for each. The canonical use case is a search or listing results page that needs multiple pieces of information about the same filtered result set in a single request: the current page of results, the total count of matching documents, and the facet counts for sidebar filters, such as how many results fall in each category or price range. Placing a shared $match before the $facet and then a sub-pipeline for the paginated results, another for the count, and one per facet dimension computes all of it from a single evaluation of the filter, which is both faster and simpler than issuing several parallel queries.',
        aHi: '`$facet` stage named sub-pipelines ka ek set leta hai aur un sabko usī input documents ke set ke against chalाता hai, ek single output document produce karता hai jiske fields har sub-pipeline ke results rakhते hain. Iska matlab hai usī data ke kई alag analyses ek pass se saath compute hote hain. Canonical use case ek search results page hai jise ek single request mein multiple pieces of information chahiye: current page, total count, aur sidebar filters ke facet counts.',
      },
      {
        q: 'How does $setWindowFields differ from $group, and what is the difference between $out and $merge?',
        qHi: '`$setWindowFields` `$group` se kaise alag hai, aur `$out` aur `$merge` mein kya antar hai?',
        a: 'Both $setWindowFields and $group apply accumulator operators such as $sum and $avg, but they differ in output shape. $group collapses every document in a group into one output document, reducing the collection to one row per distinct grouping key. $setWindowFields collapses nothing: every input document passes through with all its fields, and each gains new fields computed by accumulators applied over a window, meaning a range of documents relative to the current one within an ordered partition. This is exactly the SQL distinction between an aggregate function with GROUP BY, which reduces rows, and a window function, which annotates each row. Common window fields are a running total, a rank within the partition, and a moving average. As for writing results back, $out replaces the entire target collection with the pipeline output, correct only when the pipeline produces the collection\'s complete intended contents, while $merge upserts the output into the target by a key, updating matches and inserting non-matches while leaving all other documents in place, which is what an incremental rollup needs so that each run contributes one period\'s results without erasing prior periods.',
        aHi: 'Dono `$setWindowFields` aur `$group` `$sum` jaisे accumulator operators apply karते hain, par wo output shape mein alag hain. `$group` har group ke har document ko ek output document mein collapse karता hai. `$setWindowFields` kुछ collapse nahi karता: har input document apne saare fields ke saath pass hota hai. Ye theek SQL distinction hai aggregate function (GROUP BY) aur window function ke beech. `$out` poore target collection ko pipeline output se replace karता hai; `$merge` output ko target mein ek key se upsert karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Insert four `products` with `price` and `cat` fields. Write a `$facet` with two sub-pipelines: `byCat` (`$group` by `cat` with a count, `$sort` by `_id`) and `priceStats` (`$group` `_id: null` with `$min` and `$max` of price). Confirm the single result document has both facets.',
        taskHi: 'Chaar `products` `price` aur `cat` fields ke saath insert karo. Do sub-pipelines ke saath ek `$facet` likho: `byCat` aur `priceStats`.',
        hint: '`$facet` runs every named sub-pipeline against the same input and returns one document with a field per facet — replacing what would be two separate aggregations.',
        hintHi: '`$facet` har named sub-pipeline ko usी input ke against chalata hai aur ek document lautaता hai jiska prati facet ek field hai.',
      },
      {
        task: 'Insert three `txns` for account "A" with `day` (1, 2, 3) and `amt` (100, -30, 50). Write a `$setWindowFields` partitioned by `acct`, sorted by `day`, with a `runningBalance` output using `$sum` over the window `["unbounded", "current"]`. Confirm the running balances are 100, 70, 120.',
        taskHi: 'Account "A" ke liye teen `txns` `day` (1, 2, 3) aur `amt` (100, -30, 50) ke saath insert karo. Ek `$setWindowFields` likho jo `acct` se partitioned, `day` se sorted hai, ek `runningBalance` output ke saath.',
        hint: '`window: { documents: ["unbounded", "current"] }` sums from the first doc of the partition through the current one — a running total. `$setWindowFields` keeps every document and adds the field.',
        hintHi: '`window: { documents: ["unbounded", "current"] }` partition ke pehle doc se current tak sum karta hai — ek running total.',
      },
      {
        task: 'Insert three `sales` documents (`region` "US" x2, "EU" x1; amounts 100, 50, 200). Write an aggregation that `$group`s by `region` with a `$sum` total, then `$merge`s into a `region_totals` collection. Read `region_totals` back and confirm US=150, EU=200.',
        taskHi: 'Teen `sales` documents insert karo. Ek aggregation likho jo `region` se `$group` karti hai ek `$sum` total ke saath, phir ek `region_totals` collection mein `$merge` karti hai.',
        hint: '`$merge: { into: "region_totals" }` upserts the grouped results into the collection. Unlike `$out`, it would leave any other documents in `region_totals` in place.',
        hintHi: '`$merge: { into: "region_totals" }` grouped results ko collection mein upsert karta hai. `$out` ke uлт, ye koi doosre documents rakhता.',
      },
    ],

    keyTakeaways: [
      '`$facet` runs several NAMED sub-pipelines against the SAME input (the docs that reached `$facet`) in ONE pass, returning one document with a field per sub-pipeline. Canonical use: a search page needing the results page + total count + sidebar facet counts in one request (put a shared `$match` BEFORE the `$facet`).',
      '`$bucket`: groups docs by which numeric RANGE their `groupBy` value falls in — `boundaries: [0,10,100,1000]` → buckets `[0,10) [10,100) [100,1000)`, each `_id` = the lower bound, `default` catches outliers. `$bucketAuto` picks boundaries for you. The histogram/distribution stage.',
      '`$setWindowFields`: MongoDB\'s WINDOW FUNCTIONS (= SQL Module 6). `partitionBy` (like `PARTITION BY`), `sortBy` (order within), `output` fields each an accumulator over a WINDOW: `{ documents: ["unbounded", "current"] }` = running total; `{ documents: [-2, 0] }` = 3-row moving window. Accumulators: `$sum`, `$avg`, `$rank`, `$denseRank`, `$shift` (lag/lead).',
      'KEY DISTINCTION: `$group` COLLAPSES docs (one row per group). `$setWindowFields` COLLAPSES NOTHING — every doc passes through with all its fields PLUS the computed window fields. Same as SQL aggregate-with-GROUP-BY vs window function.',
      '`$out: "coll"` REPLACES the entire target collection with the pipeline output (destroys what was there). `$merge: { into, on, whenMatched, whenNotMatched }` UPSERTS the output by a key, leaving non-matching docs in place. For INCREMENTAL rollups use `$merge` — `$out` would erase accumulated history every run.',
      'The main use of `$merge`/`$out`: MATERIALIZED ROLLUPS — run an expensive aggregation on a schedule, `$merge` results into a small summary collection that dashboards query directly (MongoDB\'s materialized view, cf. Module 11).',
    ],
    keyTakeawaysHi: [
      '`$facet` kई NAMED sub-pipelines ko USI input ke against EK pass mein chalाता hai, ek document lautaते hue jiska prati sub-pipeline ek field hai. Canonical use: ek search page jise ek request mein results page + total count + facet counts chahiye.',
      '`$bucket`: docs ko group karता hai ki unki `groupBy` value kaunse numeric RANGE mein aati hai. `$bucketAuto` boundaries aapke liye chunता hai. Histogram/distribution stage.',
      '`$setWindowFields`: MongoDB ke WINDOW FUNCTIONS (= SQL Module 6). `partitionBy`, `sortBy`, `output` fields har ek ek accumulator ek WINDOW par: `{ documents: ["unbounded", "current"] }` = running total.',
      'KEY DISTINCTION: `$group` docs ko COLLAPSE karता hai. `$setWindowFields` KUCH COLLAPSE NAHI karता — har doc apne saare fields PLUS computed window fields ke saath pass hota hai.',
      '`$out: "coll"` poore target collection ko REPLACE karता hai. `$merge` output ko ek key se UPSERT karता hai, na-matching docs rakhते hue. INCREMENTAL rollups ke liye `$merge` istemal karो.',
      '`$merge`/`$out` ka main use: MATERIALIZED ROLLUPS — ek expensive aggregation schedule par chalाओ, results ko ek chhoti summary collection mein `$merge` karो.',
    ],
  },

  {
    slug: 'mongo-indexes-types-and-esr',
    title: 'Indexes: Types & the ESR Rule',
    titleHi: 'Indexes: Types Aur ESR Rule',
    description: 'MongoDB indexes are B-trees, like PostgreSQL\'s, but MongoDB adds index kinds for its data model: multikey (arrays), text, partial, TTL, wildcard, hashed. And for a compound index, the field order follows the ESR rule: Equality, then Sort, then Range.',
    descriptionHi: 'MongoDB indexes B-trees hain, PostgreSQL ke jaisे, par MongoDB apne data model ke liye index kinds add karता hai: multikey (arrays), text, partial, TTL, wildcard, hashed. Aur ek compound index ke liye, field order ESR rule follow karता hai: Equality, phir Sort, phir Range.',
    difficulty: 'HARD',
    duration: 24,
    order: 5,

    analogy: {
      en: '**A library that keeps a normal author-then-title card catalog, plus special catalogs: one that lists a book under every subject tag it carries, one that\'s only for the reference room\'s books, one that auto-discards cards for books past their return date, and one keyed by a fuzzy word-search of the blurb.** The plain catalog is a B-tree index. The one filing a book under each of its several tags is a **multikey** index (arrays). The reference-room-only catalog is a **partial** index (fewer entries, smaller, faster). The self-discarding one is a **TTL** index (documents auto-delete after an age). The blurb-search one is a **text** index. And the order of the plain catalog — author first, then title — is the ESR rule: put the field you look up by an exact value first, the field you sort by next, and the field you scan a range of last, because that order lets one walk down the catalog answer the whole question.',
      hi: '**Ek library jo ek normal author-phir-title card catalog rakhती hai, plus special catalogs: ek jo ek book ko iske har subject tag ke under list karता hai, ek jo sirf reference room ki books ke liye hai, ek jo return date past books ke cards auto-discard karता hai, aur ek jo blurb ke fuzzy word-search se keyed hai.** Plain catalog ek B-tree index hai. Ek book ko iske kई tags mein se har ek ke under file karne waला ek **multikey** index hai (arrays). Reference-room-only catalog ek **partial** index hai. Self-discarding waला ek **TTL** index hai. Blurb-search waला ek **text** index hai. Aur plain catalog ka order — author pehle, phir title — ESR rule hai.',
    },

    simple: `**\`createIndex({ field: 1 })\` -- 1 ascending, -1 descending. Compound: \`{ a: 1, b: -1 }\`.**

**INDEX TYPES**
\`\`\`
single field        { email: 1 }
compound            { status: 1, createdAt: -1 }        -- multiple fields, ORDER MATTERS
multikey (auto)     { tags: 1 } on an array field       -- indexes EACH array element
text                { body: "text" }                    -- full-text search via $text
partial             { email: 1 }, { partialFilterExpression: { active: true } }
                                                          -- only indexes docs matching the filter
TTL                 { createdAt: 1 }, { expireAfterSeconds: 3600 }
                                                          -- auto-deletes docs 1h after createdAt
unique              { email: 1 }, { unique: true }       -- rejects duplicates
hashed              { _id: "hashed" }                    -- for hashed sharding
wildcard            { "attrs.$**": 1 }                   -- indexes all subfields of attrs
\`\`\`

**THE ESR RULE for compound-index field order: Equality, Sort, Range**

\`\`\`js
// query:  find({ status: "active", score: { $gt: 10 } }).sort({ created: 1 })
//         equality on status | sort by created | range on score
// index:  { status: 1, created: 1, score: 1 }   <- E, then S, then R
\`\`\`

Get the order wrong (E, R, S -> \`{ status: 1, score: 1, created: 1 }\`) and the query
still uses the index for \`status\`, but must do a separate in-memory SORT for \`created\`.`,

    simpleHi: `**\`createIndex({ field: 1 })\` -- 1 ascending, -1 descending. Compound: \`{ a: 1, b: -1 }\`.**

**INDEX TYPES**
\`\`\`
single field        { email: 1 }
compound            { status: 1, createdAt: -1 }        -- multiple fields, ORDER MATTERS
multikey (auto)     { tags: 1 } ek array field par      -- HAR array element index karता hai
text                { body: "text" }                    -- $text se full-text search
partial             { email: 1 }, { partialFilterExpression: { active: true } }
TTL                 { createdAt: 1 }, { expireAfterSeconds: 3600 }   -- docs auto-delete
unique              { email: 1 }, { unique: true }
hashed              { _id: "hashed" }
wildcard            { "attrs.$**": 1 }
\`\`\`

**ESR RULE compound-index field order ke liye: Equality, Sort, Range**

\`\`\`js
// query:  find({ status: "active", score: { $gt: 10 } }).sort({ created: 1 })
//         status par equality | created se sort | score par range
// index:  { status: 1, created: 1, score: 1 }   <- E, phir S, phir R
\`\`\`

Order galat karो (E, R, S) aur query abhi bhi \`status\` ke liye index istemal karती hai,
par \`created\` ke liye ek alag in-memory SORT karना paता hai.`,

    content: `## Indexes are B-trees, with variations

Every MongoDB index is fundamentally a B-tree (Module 10 covers B-trees in depth): a sorted structure over one or more fields' values, pointing back at the documents that hold them, turning an O(n) collection scan into an O(log n) lookup. The performance model is identical to the relational one, and so is the trade-off: every index speeds up matching reads but adds work to every write of an indexed field.

\`createIndex({ field: 1 })\` builds an ascending index; \`-1\` is descending (matters for sort direction and for compound indexes).

## Index types

- **Single-field** — \`{ email: 1 }\`. The basic case.
- **Compound** — \`{ status: 1, createdAt: -1 }\`. Indexes multiple fields together; **the order of the fields matters** (see ESR below). A compound index can serve a query on a *prefix* of its fields (\`{a,b,c}\` serves queries on \`a\`, or \`a+b\`, or \`a+b+c\` — like PostgreSQL's leading-prefix rule, Module 10).
- **Multikey** — created automatically when you index a field that holds an **array**. \`{ tags: 1 }\` on documents with a \`tags\` array indexes *each element* separately, so \`find({ tags: "x" })\` is an indexed lookup. A compound index can include at most one array field.
- **Text** — \`{ body: "text" }\`. Tokenizes and stems the field's text for full-text search via the \`$text\` operator (\`find({ $text: { $search: "mongodb" } })\`). MongoDB's equivalent of PostgreSQL's \`tsvector\` (Module 11). One text index per collection (it can cover multiple fields).
- **Partial** — \`{ email: 1 }, { partialFilterExpression: { active: true } }\`. Only indexes documents matching the filter expression. Smaller and cheaper to maintain; usable only for queries that include the same condition. Directly analogous to PostgreSQL's partial index (Module 10).
- **TTL** — \`{ createdAt: 1 }, { expireAfterSeconds: 3600 }\`. A single-field index on a date field that additionally causes MongoDB to **automatically delete** documents once their indexed date is older than \`expireAfterSeconds\`. The standard way to expire sessions, tokens, logs, or caches.
- **Unique** — \`{ email: 1 }, { unique: true }\`. Rejects an insert or update that would create a duplicate value (\`E11000\`). Can be combined with partial to enforce uniqueness only among a subset.
- **Hashed** — \`{ field: "hashed" }\`. Indexes a hash of the value rather than the value; used as a shard key for even distribution (Module 16).
- **Wildcard** — \`{ "attrs.$**": 1 }\`. Indexes every subfield under \`attrs\`, for documents where the set of attribute keys is open-ended (the attribute-pattern data, Module 14).

## The ESR rule

For a compound index, **field order determines which queries it serves well**. The rule is **Equality, Sort, Range** — order the index fields so that:

1. **Equality** fields come first — fields the query matches with an exact value (\`status: "active"\`).
2. **Sort** fields come next — fields the query sorts by (\`sort({ createdAt: 1 })\`).
3. **Range** fields come last — fields the query matches with a range (\`score: { $gt: 10 }\`, \`date: { $lte: X }\`).

\`\`\`js
// query: find({ status: "active", score: { $gt: 10 } }).sort({ created: 1 })
// ESR index: { status: 1, created: 1, score: 1 }
\`\`\`

Why this order: an equality match on the leading field narrows the index to one contiguous section. Within that section, the entries are already ordered by the next field, so if that is the sort field, the query gets its results in sorted order *for free* — no separate sort step. The range field goes last because a range match on a field scatters the values after it, breaking the sorted order of any field that comes later in the index.

Get it wrong — put the range field before the sort field (\`{ status: 1, score: 1, created: 1 }\`) — and the index still handles the \`status\` equality, but because \`score\`'s range breaks \`created\`'s ordering within the index, MongoDB must collect all the matches and **sort them in memory** afterward, which is slower and, for a large result, can exceed the sort memory limit and fail. Lesson 6 shows how to *see* this in \`explain()\` output (a \`SORT\` stage appears).

## The practical discipline

Index the fields your real queries filter, sort, and join on — informed by \`explain()\` (Lesson 6), not guessed. Use compound indexes ordered by ESR for your important multi-condition queries. Reach for partial and TTL where they fit. And remember the cost: MongoDB's own guidance is to be deliberate about indexes, because each one taxes every write, and a collection with a dozen rarely-used indexes writes slowly for no benefit.`,

    contentHi: `## Indexes B-trees hain, variations ke saath

Har MongoDB index fundamentally ek B-tree hai (Module 10): ek sorted structure ek ya zyada fields ki values par. Performance model relational se identical hai, aur trade-off bhi: har index matching reads speed up karता hai par ek indexed field ke har write mein kaam add karता hai.

\`createIndex({ field: 1 })\` ek ascending index banata hai; \`-1\` descending hai.

## Index types

- **Single-field** — \`{ email: 1 }\`.
- **Compound** — \`{ status: 1, createdAt: -1 }\`. **Fields ka order matter karता hai** (ESR neeche). Ek compound index apne fields ke ek *prefix* par ek query serve kar sakta hai.
- **Multikey** — automatically banता hai jab aap ek field index karते ho jo ek **array** rakhता hai. \`{ tags: 1 }\` *har element* alag se index karता hai.
- **Text** — \`{ body: "text" }\`. \`$text\` operator se full-text search. MongoDB ka PostgreSQL ke \`tsvector\` (Module 11) ka equivalent.
- **Partial** — \`{ partialFilterExpression: { active: true } }\`. Sirf filter se match karти documents index karता hai.
- **TTL** — \`{ createdAt: 1 }, { expireAfterSeconds: 3600 }\`. MongoDB documents ko **automatically delete** karता hai jab unki indexed date \`expireAfterSeconds\` se purani ho.
- **Unique** — \`{ unique: true }\`. Duplicates reject karता hai (\`E11000\`).
- **Hashed** — \`{ field: "hashed" }\`. Shard key ke liye (Module 16).
- **Wildcard** — \`{ "attrs.$**": 1 }\`. \`attrs\` ke har subfield ko index karता hai.

## ESR rule

Ek compound index ke liye, **field order determine karता hai ki ye kaunसी queries achhi tarah serve karता hai**. Rule **Equality, Sort, Range** hai:

1. **Equality** fields pehle — jo query ek exact value se match karती hai.
2. **Sort** fields agle — jo query sort karती hai.
3. **Range** fields aakhri — jo query ek range se match karती hai.

\`\`\`js
// query: find({ status: "active", score: { $gt: 10 } }).sort({ created: 1 })
// ESR index: { status: 1, created: 1, score: 1 }
\`\`\`

Kyun: leading field par ek equality match index ko ek contiguous section tak narrow karता hai. Us section ke andar, entries pehle se agle field se ordered hain, to agar wo sort field hai, query apne results sorted order mein *free* mein paता hai. Range field aakhri jaता hai kyunki ek field par ek range match iske baad ki values ko scatter karता hai.

Galat karो — range field ko sort field se pehle rakhो — aur MongoDB ko saare matches collect karके **memory mein sort** karना paता hai, jo slower hai. Lesson 6 dikhाता hai ise \`explain()\` mein kaise *dekhें* (ek \`SORT\` stage dikhता hai).`,

    examples: [
      {
        title: 'A multikey index on an array field — indexed lookup by array element',
        titleHi: 'Ek array field par ek multikey index — array element se indexed lookup',
        code: `await db.posts.insertMany([{ _id: 1, tags: ["x", "y"] }, { _id: 2, tags: ["y", "z"] }, { _id: 3, tags: ["z"] }]);
await db.posts.createIndex({ tags: 1 });
const ex = await db.posts.find({ tags: "y" }).explain("executionStats");
print({
  isMultiKey: ex.queryPlanner.winningPlan.inputStage.isMultiKey,
  stage: ex.queryPlanner.winningPlan.inputStage.stage,
  nReturned: ex.executionStats.nReturned,
});`,
        output: `{"isMultiKey":true,"stage":"IXSCAN","nReturned":2}`,
        explain: 'Indexing the `tags` array field automatically creates a MULTIKEY index — `inputStage.isMultiKey` is `true` — with one index entry per array element. So `find({ tags: "y" })` is an `IXSCAN` (not a collection scan), returning the 2 posts whose tags array contains "y".',
        explainHi: '`tags` array field index karna automatically ek MULTIKEY index banata hai — `inputStage.isMultiKey` `true` hai — prati array element ek index entry ke saath. To `find({ tags: "y" })` ek `IXSCAN` hai (ek collection scan nahi), un 2 posts ko lautaते hue jinke tags array mein "y" hai.',
      },
      {
        title: 'Partial and TTL indexes carry their extra options into listIndexes',
        titleHi: 'Partial aur TTL indexes apne extra options listIndexes mein carry karte hain',
        code: `await db.users.insertMany([{ email: "a@x.com", active: true }, { email: "b@x.com", active: false }]);
await db.users.createIndex({ email: 1 }, { partialFilterExpression: { active: true } });
await db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
print((await db.users.listIndexes().toArray()).map(i => ({ name: i.name, partial: i.partialFilterExpression || null })));
print((await db.sessions.listIndexes().toArray()).map(i => ({ name: i.name, ttl: i.expireAfterSeconds ?? null })));`,
        output: `[{"name":"_id_","partial":null},{"name":"email_1","partial":{"active":true}}]
[{"name":"_id_","ttl":null},{"name":"createdAt_1","ttl":3600}]`,
        explain: "Both the `partialFilterExpression` and the `expireAfterSeconds` options are stored on the index definition itself and are visible in `listIndexes()`. The partial index on `email` only indexes docs where `active: true`; the TTL index on `createdAt` causes MongoDB's background monitor to delete session docs 3600 seconds after their `createdAt`.",
        explainHi: 'Dono `partialFilterExpression` aur `expireAfterSeconds` options index definition par store hote hain aur `listIndexes()` mein visible hain. `email` par partial index sirf `active: true` waale docs index karta hai; `createdAt` par TTL index MongoDB ke background monitor ko session docs ko unke `createdAt` ke 3600 seconds baad delete karne ke liye cause karta hai.',
      },
      {
        title: 'ESR: the right field order avoids an in-memory SORT stage; the wrong order forces one',
        titleHi: 'ESR: sahi field order ek in-memory SORT stage avoid karta hai; galat order ek force karta hai',
        code: `await db.t.insertMany(Array.from({ length: 300 }, (_, i) => ({
  status: i % 3 === 0 ? "active" : "other", score: i % 40, created: (i * 7) % 300,
})));
await db.t.createIndex({ status: 1, created: 1, score: 1 }, { name: "ESR" });
await db.t.createIndex({ status: 1, score: 1, created: 1 }, { name: "ERS" });
const walk = (p) => { const s = []; let n = p; while (n) { s.push(n.stage); n = n.inputStage; } return s; };
const q = () => db.t.find({ status: "active", score: { $gt: 10 } }).sort({ created: 1 });
const esr = await q().hint("ESR").explain("executionStats");
const ers = await q().hint("ERS").explain("executionStats");
print({ esr: walk(esr.queryPlanner.winningPlan), ers: walk(ers.queryPlanner.winningPlan) });`,
        output: `{"esr":["FETCH","IXSCAN"],"ers":["FETCH","SORT","IXSCAN"]}`,
        explain: 'The query is `find({ status: "active", score: { $gt: 10 } }).sort({ created: 1 })` — equality on `status`, range on `score`, sort on `created`. The ESR index `{ status: 1, created: 1, score: 1 }` (E, S, R) serves it with just `[FETCH, IXSCAN]` — the sort is free. The ERS index `{ status: 1, score: 1, created: 1 }` (E, R, S) puts the range before the sort, breaking `created`\'s ordering, so an in-memory `SORT` stage is added.',
        explainHi: 'Query hai `find({ status: "active", score: { $gt: 10 } }).sort({ created: 1 })` — `status` par equality, `score` par range, `created` par sort. ESR index `{ status: 1, created: 1, score: 1 }` (E, S, R) ise sirf `[FETCH, IXSCAN]` se serve karta hai — sort free hai. ERS index range ko sort se pehle rakhta hai, `created` ki ordering toड़ते hue, to ek in-memory `SORT` stage add hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// a compound index ordered by how you "think about" the fields, not by ESR
// query: find({ tenantId: X, status: "open" }).sort({ priority: -1 })
db.tickets.createIndex({ priority: -1, tenantId: 1, status: 1 })
// the sort field is first, so the index can't use the equality fields to narrow --
// MongoDB scans the whole index in priority order, filtering tenantId/status per entry`,
        right: `// ESR: equality fields (tenantId, status) first, then the sort field (priority):
db.tickets.createIndex({ tenantId: 1, status: 1, priority: -1 })
// equality narrows to one contiguous section; within it, entries are already in
// priority order, so the sort is free and only matching entries are examined`,
        why: 'A compound index stores entries sorted by its first field, then by its second within each first-field value, and so on. When the query has equality conditions on some fields, placing those equality fields first in the index lets the index jump directly to the single contiguous section of entries matching all of them, so only relevant entries are examined. Within that section, the entries are already ordered by the next index field, so if the query sorts by that field, the results come out sorted with no additional work. Putting the sort field first instead means the index is ordered globally by that field, and the equality conditions cannot be used to narrow the scan to a contiguous range, so the index must be walked in its entirety with the equality conditions checked against each entry, which examines far more of the index than necessary. The ESR ordering, equality fields, then the sort field, then any range fields, is what lets a single pass down the index answer the whole query.',
        whyHi: 'Ek compound index entries ko apne pehle field se sorted store karता hai, phir har pehle-field value ke andar apne doosre se. Jab query ke kुछ fields par equality conditions hain, un equality fields ko index mein pehle rakhना index ko un sabse matching entries ke single contiguous section tak seedhे jump karne deता hai. Sort field ko pehle rakhना matlab index globally us field se ordered hai, aur equality conditions scan ko narrow nahi kar sakti. ESR ordering wo hai jo ek single pass ko poori query answer karne deta hai.',
      },
      {
        wrong: `// creating a text index AND expecting a regular query to use it
db.articles.createIndex({ body: "text" })
db.articles.find({ body: /mongodb/i })   // a regex query -- does NOT use the text index
db.articles.find({ body: "mongodb" })     // exact-match -- also does NOT use it`,
        right: `db.articles.find({ $text: { $search: "mongodb" } })
// the $text operator is the ONLY thing that uses a text index -- it tokenizes,
// stems, and ranks, unlike a regex or an exact string match`,
        why: 'A text index is a specialized structure that tokenizes the indexed field into individual words, applies language-specific stemming so that different forms of a word match, and supports relevance ranking. It is queried exclusively through the $text operator with a $search term; a regular expression query or an exact-string equality query on the same field does not and cannot use the text index, because those queries have entirely different semantics, matching a literal pattern or an exact value rather than searching tokenized words. Creating a text index and then querying the field with a regex or a plain equality means the text index sits unused while the query does a collection scan. When word-based search with stemming and ranking is the goal, $text against a text index is the mechanism; when a literal substring or pattern match is the goal, that is a regex query and benefits from an ordinary index only for anchored prefixes.',
        whyHi: 'Ek text index ek specialized structure hai jo indexed field ko individual words mein tokenize karता hai, language-specific stemming apply karता hai, aur relevance ranking support karता hai. Ise exclusively `$text` operator ke through query kiya jaता hai; ek regular expression query ya ek exact-string equality query text index istemal nahi karती aur nahi kar sakti. Text index banакर phir field ko regex se query karna matlab text index unused baithता hai jabki query ek collection scan karती hai.',
      },
      {
        wrong: `// setting expireAfterSeconds on a compound index, or on a non-date field
db.sessions.createIndex({ userId: 1, createdAt: 1 }, { expireAfterSeconds: 3600 })
// ERROR / ignored: TTL requires a SINGLE-field index on a DATE (or array-of-dates) field
db.sessions.createIndex({ count: 1 }, { expireAfterSeconds: 3600 })
// "count" is a number, not a date -- the TTL monitor has nothing to compare`,
        right: `db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })
// single field, and the field holds a BSON Date -- MongoDB's background TTL
// monitor deletes documents once (now - createdAt) exceeds 3600 seconds`,
        why: 'A TTL index is implemented by a background process that periodically scans a single-field index on a date-typed field and removes any document whose indexed date is older than the configured expireAfterSeconds threshold relative to the current time. This mechanism depends on two structural requirements: the index must be on exactly one field, because the background monitor needs an unambiguous date value per document to compare against the threshold, and that field must contain a BSON Date, or an array of Dates, because expiry is computed as an age from that date. Applying expireAfterSeconds to a compound index or to an index on a numeric or string field does not produce a working TTL: MongoDB either rejects it or the index is created without the expiry behavior, and documents are never automatically removed. The correct form is always a single-field index on the date field that should drive expiration.',
        whyHi: 'Ek TTL index ek background process se implement hota hai jo periodically ek date-typed field par ek single-field index scan karता hai aur koi bhi document hataता hai jiski indexed date current time ke sapeksh configured `expireAfterSeconds` threshold se purani hai. Ye mechanism do structural requirements par depend karता hai: index theek ek field par hona chahiye, aur us field mein ek BSON Date hona chahiye. `expireAfterSeconds` ko ek compound index ya ek numeric field par apply karna ek working TTL produce nahi karता.',
      },
    ],

    realWorld: [
      {
        en: '**A `{ tenantId: 1, status: 1, createdAt: -1 }` compound index (ESR order)** serving "this tenant\'s open tickets, newest first" — equality on tenant and status, sort on createdAt, all from one index walk.',
        hi: '**Ek `{ tenantId: 1, status: 1, createdAt: -1 }` compound index (ESR order)** jo "is tenant ke open tickets, newest first" serve karta hai.',
      },
      {
        en: '**A TTL index on `sessions.expiresAt` with `expireAfterSeconds: 0`** — combined with an explicit `expiresAt` timestamp per document, MongoDB deletes each session exactly when it should expire, no cleanup job needed.',
        hi: '**`sessions.expiresAt` par ek TTL index** — MongoDB har session ko theek tab delete karta hai jab ise expire hona chahiye, koi cleanup job nahi.',
      },
      {
        en: '**A partial unique index — `{ email: 1 }, { unique: true, partialFilterExpression: { deleted: false } }`** — enforcing email uniqueness only among non-deleted users, so a soft-deleted account\'s email can be reused.',
        hi: '**Ek partial unique index** — email uniqueness sirf non-deleted users ke beech enforce karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the ESR rule for compound indexes, and why does field order matter?',
        qHi: 'Compound indexes ke liye ESR rule kya hai, aur field order kyun matter karता hai?',
        a: 'ESR stands for Equality, Sort, Range, and it is the rule for ordering the fields of a compound index so that a query with an equality condition, a sort, and a range condition can be satisfied by a single pass down the index. Equality fields, those the query matches against an exact value, go first, because an equality match on the leading fields narrows the index to one contiguous section of entries, so only relevant entries are examined. The sort field goes next, because within that narrowed section the entries are already ordered by the following index field, so if that is the field the query sorts by, the results emerge in sorted order with no separate sorting step. Range fields, those matched against an interval such as greater-than or less-than, go last, because a range match on a field spreads the matching values across a span of the index and thereby breaks the sorted ordering of any field positioned after it. Getting the order wrong, for instance placing the range field before the sort field, still lets the index handle the equality conditions, but the range breaks the sort ordering, so MongoDB must gather all the matching documents and sort them in memory afterward, which is slower and can fail if the result set exceeds the sort memory limit.',
        aHi: 'ESR ka matlab Equality, Sort, Range hai, aur ye ek compound index ke fields ko order karne ka rule hai taaki ek query jismein ek equality condition, ek sort, aur ek range condition ho ek single pass se satisfy ho sake. Equality fields pehle jaते hain, kyunki leading fields par ek equality match index ko ek contiguous section tak narrow karता hai. Sort field agle jाता hai, kyunki us narrowed section ke andar entries pehle se agle index field se ordered hain. Range fields aakhri jाते hain, kyunki ek field par ek range match iske baad positioned kisī bhi field ki sorted ordering ko toड़ता hai.',
      },
      {
        q: 'What are multikey, text, partial, and TTL indexes, and when do you use each?',
        qHi: 'Multikey, text, partial, aur TTL indexes kya hain, aur aap har ek kab istemal karते ho?',
        a: 'A multikey index is what MongoDB automatically creates when you index a field that holds an array: rather than indexing the array as a single value, it creates a separate index entry for each element, so a query matching any single element uses the index. You use it implicitly whenever you index an array field, such as a tags array. A text index tokenizes and stems the text of one or more fields for language-aware full-text search, queried through the $text operator with a search term; you use it for word-based search with relevance ranking, the MongoDB equivalent of PostgreSQL full-text search. A partial index only includes documents matching a specified filter expression, making it smaller and cheaper to maintain and usable only for queries that also include that condition; you use it when a large fraction of the collection is irrelevant to the queries the index serves, such as indexing only active records. A TTL index is a single-field index on a date field with an expireAfterSeconds option that causes a background process to automatically delete documents once their indexed date is older than that threshold; you use it to expire sessions, tokens, logs, or cached data without writing a cleanup job.',
        aHi: 'Ek multikey index wo hai jo MongoDB automatically banata hai jab aap ek field index karते ho jo ek array rakhता hai: array ke har element ke liye ek alag index entry. Ek text index ek ya zyada fields ke text ko tokenize aur stem karता hai language-aware full-text search ke liye, `$text` operator se query kiya jaता hai. Ek partial index sirf ek specified filter expression se matching documents include karता hai. Ek TTL index ek date field par ek single-field index hai ek `expireAfterSeconds` option ke saath jo ek background process ko documents automatically delete karने ke liye cause karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Insert three `posts` with a `tags` array. Create an index on `tags` and confirm it is automatically a multikey index. Run `find({ tags: "y" }).explain("executionStats")` and check that `inputStage.isMultiKey` is `true` and the stage is `IXSCAN`.',
        taskHi: 'Ek `tags` array ke saath teen `posts` insert karo. `tags` par ek index banao aur confirm karo ye automatically ek multikey index hai. `find({ tags: "y" }).explain("executionStats")` chalao.',
        hint: 'Indexing an array field automatically creates a multikey index — one index entry per array element — so a query matching a single element is an indexed `IXSCAN`, not a scan.',
        hintHi: 'Ek array field index karna automatically ek multikey index banata hai — prati array element ek index entry.',
      },
      {
        task: 'Create a partial index on `users.email` with `partialFilterExpression: { active: true }`, and a TTL index on `sessions.createdAt` with `expireAfterSeconds: 3600`. Read `listIndexes()` for each collection and confirm the `partialFilterExpression` and `expireAfterSeconds` options are recorded on the index metadata.',
        taskHi: '`users.email` par ek partial index banao `partialFilterExpression: { active: true }` ke saath, aur `sessions.createdAt` par ek TTL index `expireAfterSeconds: 3600` ke saath. Har collection ke liye `listIndexes()` padho.',
        hint: 'Both options are stored on the index definition itself, visible in `listIndexes()`. A partial index only indexes matching docs; a TTL index drives automatic document deletion by age.',
        hintHi: 'Dono options index definition par store hote hain, `listIndexes()` mein visible. Partial index sirf matching docs index karta hai; TTL index age se automatic deletion drive karta hai.',
      },
      {
        task: 'Insert 300 docs with `status`, `score`, `created` fields. Create two indexes: `ESR` = `{ status: 1, created: 1, score: 1 }` and `ERS` = `{ status: 1, score: 1, created: 1 }`. Run `find({ status: "active", score: { $gt: 10 } }).sort({ created: 1 })` with `hint("ESR")` and with `hint("ERS")`, and confirm the ESR plan is `[FETCH, IXSCAN]` while the ERS plan adds a `SORT` stage.',
        taskHi: '300 docs `status`, `score`, `created` fields ke saath insert karo. Do indexes banao: `ESR` aur `ERS`. Query ko `hint("ESR")` aur `hint("ERS")` ke saath chalao.',
        hint: 'The ESR index has the sort field (`created`) before the range field (`score`), so the index returns entries already in `created` order — no SORT stage. The ERS index breaks that ordering with the range field, forcing an in-memory SORT.',
        hintHi: 'ESR index mein sort field (`created`) range field (`score`) se pehle hai, to index entries pehle se `created` order mein lautaता hai — koi SORT stage nahi.',
      },
    ],

    keyTakeaways: [
      'Every MongoDB index is a B-TREE (same model + trade-off as PostgreSQL, Module 10): speeds matching reads, taxes every write of an indexed field. `createIndex({ f: 1 })` ascending / `-1` descending.',
      'INDEX TYPES: SINGLE (`{ email: 1 }`); COMPOUND (`{ a: 1, b: -1 }` — order matters; serves a PREFIX of its fields, like PG\'s leading-prefix rule); MULTIKEY (auto, when you index an array field — indexes EACH element; max one array field per compound index); TEXT (`{ body: "text" }` — full-text via `$text` ONLY, not regex/equality); PARTIAL (`partialFilterExpression` — indexes only matching docs); TTL (`{ createdAt: 1 }, { expireAfterSeconds: N }` — SINGLE field on a DATE, auto-deletes aged docs); UNIQUE; HASHED (shard key); WILDCARD (`{ "attrs.$**": 1 }`).',
      'THE ESR RULE for compound-index field order: EQUALITY fields first (exact-value matches → narrow to one contiguous index section), then SORT fields (within that section entries are already in this order → sort is FREE), then RANGE fields last (a range scatters values, breaking the ordering of any field after it).',
      'GET ESR WRONG (range before sort, e.g. `{ status, score, created }` for `find(status=, score>).sort(created)`): the index still handles the equality, but the range breaks `created`\'s ordering, so MongoDB collects all matches and does an in-memory SORT — slower, and can fail past the sort memory limit. Visible in `explain()` as an added `SORT` stage (Lesson 6).',
      'TEXT index = MongoDB\'s `tsvector` (PG Module 11) — queried ONLY via `$text: { $search: ... }`. PARTIAL index = PG\'s partial index (Module 10). Both directly analogous.',
      'DISCIPLINE: index the fields real queries filter/sort/join on, informed by `explain()` (Lesson 6) — NOT guessed. Each index taxes every write; a dozen rarely-used indexes = slow writes for no benefit.',
    ],
    keyTakeawaysHi: [
      'Har MongoDB index ek B-TREE hai (PostgreSQL jaisा model + trade-off). `createIndex({ f: 1 })` ascending / `-1` descending.',
      'INDEX TYPES: SINGLE; COMPOUND (order matters; PREFIX serve karता hai); MULTIKEY (auto, ek array field index karne par — HAR element); TEXT (`$text` SE ONLY); PARTIAL (`partialFilterExpression`); TTL (`{ createdAt: 1 }, { expireAfterSeconds: N }` — SINGLE field on a DATE, aged docs auto-delete); UNIQUE; HASHED; WILDCARD.',
      'ESR RULE compound-index field order ke liye: EQUALITY fields pehle (ek contiguous section tak narrow), phir SORT fields (us section ke andar entries pehle se is order mein → sort FREE), phir RANGE fields aakhri (range values scatter karता hai).',
      'ESR GALAT karो (range sort se pehle): index abhi bhi equality handle karता hai, par range `created` ki ordering toड़ता hai, to MongoDB in-memory SORT karता hai — slower. `explain()` mein ek added `SORT` stage ke roop mein visible.',
      'TEXT index = MongoDB ka `tsvector` (PG Module 11) — SIRF `$text` se query. PARTIAL index = PG ka partial index (Module 10).',
      'DISCIPLINE: real queries jo fields par filter/sort/join karती hain unhe index karो, `explain()` se informed — GUESS nahi. Har index har write ko tax karता hai.',
    ],
  },

  {
    slug: 'mongo-explain-covered-queries-and-hint',
    title: 'explain(), Covered Queries & hint()',
    titleHi: 'explain(), Covered Queries Aur hint()',
    description: 'explain() shows how MongoDB will run a query: which index (if any), how many documents it examines versus returns. A COLLSCAN means no index. A covered query answers entirely from the index without touching a document. hint() forces a specific index.',
    descriptionHi: '`explain()` dikhाता hai ki MongoDB ek query kaise chalाega: kaunसा index (agar koi), ye кितne documents examine karता hai versus lautaता hai. Ek COLLSCAN matlab koi index nahi. Ek covered query poori tarah index se answer hoती hai bina ek document touch kiye. `hint()` ek specific index force karता hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 6,

    analogy: {
      en: '**Asking a librarian "how would you find this?" before they actually go — and hearing either "I\'d walk every shelf" or "I\'d use the catalog, it points me straight to it."** \`explain()\` is that question. "I\'d walk every shelf" is a COLLSCAN — no index, every document examined. "The catalog points me straight there" is an IXSCAN — an index used, only matching documents examined. The tell-tale number is *documents examined versus documents returned*: if the librarian examined 10,000 books to hand you 3, the search is inefficient even if it "worked." A **covered query** is the best case: the catalog card itself has everything you asked for (title and author, say) so the librarian never pulls a single book off the shelf. And \`hint()\` is telling the librarian *which* catalog to use when they would otherwise pick a worse one.',
      hi: '**Ek librarian se poochna "aap ise kaise dhoondेnge?" wo asal mein jaane se pehle — aur ya to "main har shelf walk karता" ya "main catalog istemal karता, ye mujhe seedhे wahaan point karता" sunna.** `explain()` wo sawaal hai. "Main har shelf walk karता" ek COLLSCAN hai — koi index nahi. "Catalog mujhe seedhे wahaan point karता" ek IXSCAN hai. Tell-tale number *documents examined versus documents returned* hai: agar librarian ne aapको 3 dene ke liye 10,000 books examine ki, search inefficient hai. Ek **covered query** best case hai: catalog card mein hi sab kुछ hai jo aapne maanga, to librarian kabhi ek book shelf se nahi nikालta. Aur `hint()` librarian ko bataना hai ki *kaunसा* catalog istemal karे.',
    },

    simple: `**\`.explain("executionStats")\` -- how the query runs, plus what actually happened**

\`\`\`js
const ex = await db.t.find({ n: 50 }).explain("executionStats");
ex.queryPlanner.winningPlan          // the plan: stage tree
ex.executionStats.totalDocsExamined  // documents MongoDB looked at
ex.executionStats.nReturned          // documents the query returned
\`\`\`

**COLLSCAN (no index) vs IXSCAN (index used)**

\`\`\`
no index:   winningPlan.stage = "COLLSCAN",  totalDocsExamined = <collection size>
with index: winningPlan.stage = "FETCH",
            winningPlan.inputStage.stage = "IXSCAN",  totalDocsExamined = <matches only>
\`\`\`

**THE KEY RATIO: \`totalDocsExamined\` vs \`nReturned\`.** Examined ~= returned -> efficient.
Examined >> returned -> the query is doing lots of wasted work (missing/wrong index).

**COVERED QUERY: the index has EVERY field the query needs -> NO document is fetched**

\`\`\`js
db.t.createIndex({ a: 1, b: 1 });
db.t.find({ a: 2 }, { projection: { _id: 0, a: 1, b: 1 } }).explain("executionStats");
// stages: [ "PROJECTION_COVERED", "IXSCAN" ]   -- no FETCH stage
// totalDocsExamined: 0                          -- answered entirely from the index
\`\`\`

**\`hint({ index: 1 })\` -- force MongoDB to use a specific index (overrides the planner)**

\`\`\`js
db.t.find({ a: 5, b: 5 }).hint({ b: 1 })   // use the b index even if the planner prefers a
\`\`\``,

    simpleHi: `**\`.explain("executionStats")\` -- query kaise chalती hai, plus asal mein kya hua**

\`\`\`js
const ex = await db.t.find({ n: 50 }).explain("executionStats");
ex.queryPlanner.winningPlan          // plan: stage tree
ex.executionStats.totalDocsExamined  // MongoDB ne kितne documents dekhे
ex.executionStats.nReturned          // query ne кितne documents lautाye
\`\`\`

**COLLSCAN (koi index nahi) vs IXSCAN (index istemal)**

\`\`\`
koi index nahi:  winningPlan.stage = "COLLSCAN",  totalDocsExamined = <collection size>
index ke saath:  winningPlan.stage = "FETCH",
                 winningPlan.inputStage.stage = "IXSCAN",  totalDocsExamined = <sirf matches>
\`\`\`

**KEY RATIO: \`totalDocsExamined\` vs \`nReturned\`.** Examined ~= returned -> efficient.
Examined >> returned -> query bahut wasted work kar rahi hai.

**COVERED QUERY: index ke paas HAR field hai jo query ko chahiye -> KOI document fetch nahi hota**

\`\`\`js
db.t.createIndex({ a: 1, b: 1 });
db.t.find({ a: 2 }, { projection: { _id: 0, a: 1, b: 1 } }).explain("executionStats");
// stages: [ "PROJECTION_COVERED", "IXSCAN" ]   -- koi FETCH stage nahi
// totalDocsExamined: 0
\`\`\`

**\`hint({ index: 1 })\` -- MongoDB ko ek specific index istemal karne ke liye force karo**

\`\`\`js
db.t.find({ a: 5, b: 5 }).hint({ b: 1 })
\`\`\``,

    content: `## \`explain()\`

Appending \`.explain(verbosity)\` to a query returns, instead of the results, a description of how MongoDB would (or did) execute it. The verbosity levels:

- **\`"queryPlanner"\`** (default) — the chosen plan and the alternatives considered, without running the query.
- **\`"executionStats"\`** — runs the query and adds what actually happened: documents examined, index keys examined, documents returned, time.
- **\`"allPlansExecution"\`** — executionStats for every candidate plan.

Use \`"executionStats"\` for real tuning.

## Reading the plan: COLLSCAN vs IXSCAN

\`explain().queryPlanner.winningPlan\` is a tree of stages, read inside-out (the deepest stage runs first — same as PostgreSQL's plan trees, Module 10):

- **\`COLLSCAN\`** — a collection scan. Every document is examined. This is what happens with no usable index, and on a large collection it is the thing to eliminate.
- **\`IXSCAN\`** — an index scan. MongoDB walks an index to find matching entries. Usually wrapped in a **\`FETCH\`** stage (retrieve the full document for each index entry). \`IXSCAN\` → \`FETCH\` is the normal shape of an indexed query.
- **\`SORT\`** — an in-memory sort. Its presence means the query's sort order was *not* served by an index (see ESR, Lesson 5). A \`SORT\` stage on a large result is a red flag — it is slow and has a memory limit it can exceed.

## The key metric: examined vs returned

\`executionStats\` gives:

- **\`totalDocsExamined\`** — how many full documents MongoDB inspected.
- **\`totalKeysExamined\`** — how many index entries it walked.
- **\`nReturned\`** — how many documents the query produced.

The diagnostic ratio is **\`totalDocsExamined\` / \`nReturned\`**. If they are roughly equal, the query is efficient — it looked at about as many documents as it returned. If \`totalDocsExamined\` is much larger than \`nReturned\` (examining 100,000 to return 10), the query is doing large amounts of wasted work: either there is no index for this query, or the index that exists is not selective enough, or the query shape prevents the index from being used well. This ratio is the single most useful number in \`explain()\` output.

## Covered queries

A query is **covered** when the index contains *every field the query needs* — both the fields it filters on and the fields it returns — so MongoDB can answer entirely from the index without fetching a single document:

\`\`\`js
db.t.createIndex({ a: 1, b: 1 });
db.t.find({ a: 2 }, { projection: { _id: 0, a: 1, b: 1 } }).explain("executionStats");
// winningPlan stages: PROJECTION_COVERED -> IXSCAN   (no FETCH)
// totalDocsExamined: 0
\`\`\`

The filter is on \`a\` (in the index), the projection returns only \`a\` and \`b\` (both in the index), and \`_id\` is explicitly excluded (\`_id\` is not in this index, so returning it would break coverage). The plan has a \`PROJECTION_COVERED\` stage and *no* \`FETCH\`, and \`totalDocsExamined\` is 0 — the documents were never touched. Covered queries are the fastest possible reads; designing an index and projection so a hot query is covered is a real optimization.

## \`hint()\`

\`.hint(indexSpecOrName)\` forces MongoDB to use a specific index for the query, overriding the query planner's choice. Uses:

- **Diagnosing** — compare \`explain()\` output across different \`hint()\`ed indexes to see which is actually better (as in Lesson 5's ESR example).
- **Overriding a bad choice** — occasionally the planner picks a worse index because of stale statistics or an unusual data distribution; \`hint()\` pins the right one.

\`hint()\` should be a considered exception, not a habit. The planner is usually right, and a hardcoded hint can become wrong when the data or the indexes change. Prefer fixing the underlying issue (add the right index, update statistics) over hinting around it.

## The tuning loop

Identical in spirit to PostgreSQL's (Module 10):

1. \`explain("executionStats")\` the slow query.
2. Look at \`totalDocsExamined\` vs \`nReturned\`, and check for \`COLLSCAN\` or an unexpected \`SORT\`.
3. Diagnose: no index, wrong index field order (ESR), a projection that could be covered, a \`$match\` that isn't first in a pipeline.
4. Make one change — usually adding or reordering an index.
5. Re-run \`explain()\` and confirm the examined/returned ratio improved and the \`COLLSCAN\`/\`SORT\` is gone.

This closes Module 15. Module 16 covers running MongoDB in production: replica sets, read/write concerns, transactions, sharding, and schema validation.`,

    contentHi: `## \`explain()\`

Ek query mein \`.explain(verbosity)\` append karna, results ke bजाy, ek description lautaता hai ki MongoDB ise kaise execute karega (ya kiya). Verbosity levels:

- **\`"queryPlanner"\`** (default) — chosen plan, query chalाye bina.
- **\`"executionStats"\`** — query chalाता hai aur add karता hai ki asal mein kya hua.
- **\`"allPlansExecution"\`** — har candidate plan ke liye executionStats.

Real tuning ke liye \`"executionStats"\` istemal karो.

## Plan padhna: COLLSCAN vs IXSCAN

\`winningPlan\` stages ka ek tree hai, andar-se-bahar padhा (sabse gehरा stage pehle chalता hai — PostgreSQL jaisा):

- **\`COLLSCAN\`** — ek collection scan. Har document examine hota hai. Koi usable index na hone par ye hota hai.
- **\`IXSCAN\`** — ek index scan. Usually ek **\`FETCH\`** stage mein wrapped. \`IXSCAN\` → \`FETCH\` ek indexed query ka normal shape hai.
- **\`SORT\`** — ek in-memory sort. Iski presence matlab query ka sort order ek index se serve *nahi* hua (ESR, Lesson 5).

## Key metric: examined vs returned

- **\`totalDocsExamined\`** — kितne full documents MongoDB ne inspect kiye.
- **\`nReturned\`** — kितne documents query ne produce kiye.

Diagnostic ratio **\`totalDocsExamined\` / \`nReturned\`** hai. Agar wo lगभग equal hain, query efficient hai. Agar \`totalDocsExamined\` \`nReturned\` se bahut बड़ा hai, query bahut wasted work kar rahi hai.

## Covered queries

Ek query **covered** hai jab index mein *har field hai jo query ko chahiye* — dono jo fields wo filter karती hai aur jo fields wo lautaती hai:

\`\`\`js
db.t.createIndex({ a: 1, b: 1 });
db.t.find({ a: 2 }, { projection: { _id: 0, a: 1, b: 1 } }).explain("executionStats");
// stages: PROJECTION_COVERED -> IXSCAN   (koi FETCH nahi)
// totalDocsExamined: 0
\`\`\`

\`_id\` explicitly excluded hai (\`_id\` is index mein nahi hai). Covered queries fastest possible reads hain.

## \`hint()\`

\`.hint(indexSpecOrName)\` MongoDB ko ek specific index istemal karne ke liye force karता hai. Uses: diagnosing, ya ek bad choice override karna. \`hint()\` ek considered exception hona chahiye, ek habit nahi.

## Tuning loop

1. Slow query par \`explain("executionStats")\`.
2. \`totalDocsExamined\` vs \`nReturned\` dekhो, \`COLLSCAN\` ya unexpected \`SORT\` check karो.
3. Diagnose: koi index nahi, galat index field order (ESR), ek projection jo covered ho sakti hai.
4. Ek change karो.
5. \`explain()\` dobara chalाओ.

Ye Module 15 band karता hai. Module 16 production mein MongoDB chalाना cover karता hai.`,

    examples: [
      {
        title: 'explain: COLLSCAN before an index, IXSCAN after — documents examined drops to 1',
        titleHi: 'explain: index se pehle COLLSCAN, baad mein IXSCAN — documents examined 1 tak girta hai',
        code: `await db.t.insertMany(Array.from({ length: 200 }, (_, i) => ({ n: i })));
const before = await db.t.find({ n: 50 }).explain("executionStats");
await db.t.createIndex({ n: 1 });
const after = await db.t.find({ n: 50 }).explain("executionStats");
print({
  before: { stage: before.queryPlanner.winningPlan.stage, examined: before.executionStats.totalDocsExamined },
  after: { stage: after.queryPlanner.winningPlan.inputStage.stage, examined: after.executionStats.totalDocsExamined },
});`,
        output: `{"before":{"stage":"COLLSCAN","examined":200},"after":{"stage":"IXSCAN","examined":1}}`,
        explain: 'Before the index, `find({ n: 50 })` is a `COLLSCAN` — every one of the 200 documents is examined to find the one match. After `createIndex({ n: 1 })`, the same query is an `IXSCAN` and `totalDocsExamined` drops to 1 — the index walks straight to the matching entry. `totalDocsExamined` vs `nReturned` is the efficiency ratio.',
        explainHi: 'Index se pehle, `find({ n: 50 })` ek `COLLSCAN` hai — 200 mein se har document examine hota hai ek match dhoondne ke liye. `createIndex({ n: 1 })` ke baad, wahi query ek `IXSCAN` hai aur `totalDocsExamined` 1 tak girta hai — index seedhe matching entry tak chalta hai.',
      },
      {
        title: 'A covered query: PROJECTION_COVERED, no FETCH, zero documents examined',
        titleHi: 'Ek covered query: PROJECTION_COVERED, koi FETCH nahi, zero documents examined',
        code: `await db.t.insertMany(Array.from({ length: 100 }, (_, i) => ({ a: i % 5, b: i })));
await db.t.createIndex({ a: 1, b: 1 });
const walk = (p) => { const s = []; let n = p; while (n) { s.push(n.stage); n = n.inputStage; } return s; };
const ex = await db.t.find({ a: 2 }, { projection: { _id: 0, a: 1, b: 1 } }).explain("executionStats");
print({ stages: walk(ex.queryPlanner.winningPlan), totalDocsExamined: ex.executionStats.totalDocsExamined });`,
        output: `{"stages":["PROJECTION_COVERED","IXSCAN"],"totalDocsExamined":0}`,
        explain: "Every field the query needs — it filters on `a` and returns `a` and `b`, all in the `{ a: 1, b: 1 }` index — is in the index, and `_id: 0` excludes the one field that isn't. So the plan is `PROJECTION_COVERED → IXSCAN` with NO `FETCH` stage, and `totalDocsExamined` is 0: the query is answered entirely from the index, never touching a document. The fastest possible read.",
        explainHi: 'Har field jo query ko chahiye — ye `a` par filter karta hai aur `a` aur `b` lautaता hai, sab `{ a: 1, b: 1 }` index mein — index mein hai, aur `_id: 0` us ek field ko exclude karta hai jo nahi hai. To plan `PROJECTION_COVERED → IXSCAN` hai bina `FETCH` stage ke, aur `totalDocsExamined` 0 hai: query poori tarah index se answer hoti hai.',
      },
      {
        title: 'hint() forces a chosen index over the planner\'s default',
        titleHi: 'hint() planner ke default par ek chosen index force karta hai',
        code: `await db.t.insertMany(Array.from({ length: 50 }, (_, i) => ({ a: i, b: i })));
await db.t.createIndex({ a: 1 });
await db.t.createIndex({ b: 1 });
const ex = await db.t.find({ a: 5, b: 5 }).hint({ b: 1 }).explain("queryPlanner");
print(ex.queryPlanner.winningPlan.inputStage.keyPattern);`,
        output: `{"b":1}`,
        explain: 'With both `{ a: 1 }` and `{ b: 1 }` available, `hint({ b: 1 })` forces the query planner to use the `b` index — `winningPlan.inputStage.keyPattern` is `{ b: 1 }` — even though the planner might otherwise have picked `a`. `hint()` is useful for diagnosis (comparing `explain` across indexes), but a hardcoded hint is a liability.',
        explainHi: 'Dono `{ a: 1 }` aur `{ b: 1 }` available hone par, `hint({ b: 1 })` query planner ko `b` index istemal karne ke liye force karta hai — `winningPlan.inputStage.keyPattern` `{ b: 1 }` hai — chahe planner warna `a` chunta. `hint()` diagnosis ke liye useful hai, par ek hardcoded hint ek liability hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// concluding a query is fine because it "returns fast" in a small test dataset
await db.orders.find({ customerEmail: "x@y.com" }).toArray();   // instant on 500 test docs
// no explain() was run. In production with 5 million orders this is a COLLSCAN
// examining all 5 million to return 3 -- and it's slow only once the data is big`,
        right: `const ex = await db.orders.find({ customerEmail: "x@y.com" }).explain("executionStats");
// if winningPlan.stage is "COLLSCAN", or totalDocsExamined >> nReturned,
// this query needs an index -- BEFORE it reaches production scale:
await db.orders.createIndex({ customerEmail: 1 });`,
        why: 'A query that returns quickly against a small dataset provides no evidence about how it will perform at scale, because a collection scan over a few hundred documents completes almost instantly regardless of whether an index exists. The cost of a missing index only becomes visible once the collection is large, at which point the scan examines every document to answer a query that returns a handful, and the query that was fine in testing is now a production performance problem. Running explain with executionStats reveals the plan and the examined-versus-returned ratio at any dataset size: a COLLSCAN stage or a totalDocsExamined far larger than nReturned identifies a query that will not scale, and the fix, adding an appropriate index, can be applied before the data grows rather than during an incident. Making explain a routine step for any query on a collection expected to grow catches this class of problem early.',
        whyHi: 'Ek query jo ek small dataset ke against jaldi lautaती hai scale par kaise perform karegi iske baare mein koi evidence nahi deती, kyunki кुछ sौ documents par ek collection scan lगभग turant complete hota hai. Ek missing index ki cost sirf tab visible hoती hai jab collection large hai. `explain` ko `executionStats` ke saath chalाना kisī bhi dataset size par plan aur examined-versus-returned ratio reveal karता hai: ek COLLSCAN stage ya ek `totalDocsExamined` jo `nReturned` se bahut बड़ा hai ek query identify karता hai jo scale nahi karegi.',
      },
      {
        wrong: `// expecting a query to be covered when the projection includes _id (not in the index)
db.t.createIndex({ a: 1, b: 1 });
db.t.find({ a: 2 }, { projection: { a: 1, b: 1 } }).explain("executionStats");
// _id is returned by default and is NOT in the { a: 1, b: 1 } index --
// so the plan has a FETCH stage and totalDocsExamined is NOT 0`,
        right: `db.t.find({ a: 2 }, { projection: { _id: 0, a: 1, b: 1 } }).explain("executionStats");
// explicitly exclude _id so EVERY returned field is in the index --
// now: PROJECTION_COVERED, no FETCH, totalDocsExamined: 0`,
        why: 'A query is covered only when every field it needs, both the fields in the filter and every field in the result, is present in the index being used, so that the index alone contains enough information to produce the result without retrieving any document. The _id field is returned by default in any projection unless it is explicitly excluded, and _id is not part of an index like one on a and b, so a projection that includes a and b but does not turn off _id still asks for a field the index does not contain. That forces MongoDB to fetch each matching document to obtain its _id, adding a FETCH stage and making totalDocsExamined nonzero, which means the query is not covered despite the filter and the other projected fields being indexed. Explicitly setting _id to 0 in the projection removes that one out-of-index field and allows the query to be answered entirely from the index.',
        whyHi: 'Ek query covered hai sirf jab har field jo ise chahiye, dono filter ke fields aur result ke har field, istemal kiye ja rahe index mein maujood hai. `_id` field kisī bhi projection mein default se lautाya jaता hai jab tak ise explicitly exclude na kiya jaye, aur `_id` `a` aur `b` par ek index ka hissa nahi hai. Ye MongoDB ko har matching document fetch karne ke liye force karता hai iska `_id` paane ke liye. Projection mein `_id` ko explicitly `0` set karना us ek out-of-index field ko hataता hai.',
      },
      {
        wrong: `// littering the codebase with hint() to "make sure the right index is used"
db.orders.find(q1).hint({ a: 1, b: 1 })
db.orders.find(q2).hint({ c: 1 })
// six months later someone drops the { c: 1 } index (it seemed unused) and every
// hint({ c: 1 }) query now ERRORS -- a hint to a missing index is a hard failure`,
        right: `// let the planner choose; use hint() only to DIAGNOSE (compare explain outputs)
// or as a temporary, documented override for a specific known planner mistake:
db.orders.find(q2)   // no hint -- the planner picks { c: 1 } on its own if it's best
// if the planner is choosing wrong, investigate why (stats? index? query shape?)`,
        why: 'A hint pins a query to a named index and removes the query planner\'s ability to adapt, which is a liability rather than a safeguard in most cases. The planner normally selects among available indexes based on the query and the data, and it will keep making a reasonable choice as indexes are added or the data distribution shifts, whereas a hardcoded hint keeps forcing the same index regardless of whether it remains the best one. Worse, a hint that names an index which is later dropped causes the query to fail outright rather than falling back to another plan, so a routine index cleanup can break queries scattered across the codebase. Hint is appropriate for diagnosis, comparing explain output across candidate indexes to understand their behavior, and as a deliberate, documented, temporary override when the planner is demonstrably choosing a worse index for a specific query, but in that situation the real fix is usually to address why the planner is choosing wrong.',
        whyHi: 'Ek hint ek query ko ek named index par pin karता hai aur query planner ki adapt karne ki ability hataता hai. Planner normally available indexes mein se select karता hai query aur data ke aadhaar par, aur ye ek reasonable choice banaता rahega jaise indexes add hote hain. Ek hardcoded hint usी index ko force karता rahega. Aur bura, ek hint jo ek index name karता hai jo baad mein drop kiya jaता hai query ko poori tarah fail karता hai. Hint diagnosis ke liye appropriate hai.',
      },
    ],

    realWorld: [
      {
        en: '**A pre-deploy check that runs `explain("executionStats")` on every new query in a PR** and fails the build if `totalDocsExamined / nReturned` exceeds a threshold or a `COLLSCAN` appears on a large collection.',
        hi: '**Ek pre-deploy check jo ek PR ki har nayi query par `explain("executionStats")` chalata hai** aur build fail karta hai agar ratio ek threshold se zyada hai.',
      },
      {
        en: '**A hot "user\'s unread notification count" query made a covered query** — an index on `{ userId: 1, read: 1 }` and a projection of just `{ _id: 0, read: 1 }`, so the count comes entirely from the index with zero document fetches.',
        hi: '**Ek hot "user ka unread notification count" query ek covered query banaya gaya** — `{ userId: 1, read: 1 }` par ek index.',
      },
      {
        en: '**A tuning session where `explain()` revealed a `SORT` stage on a 200k-document query** — reordering the compound index per ESR (sort field before range field) eliminated the in-memory sort.',
        hi: '**Ek tuning session jahaan `explain()` ne ek 200k-document query par ek `SORT` stage reveal kiya** — compound index ko ESR ke hisaab se reorder karna in-memory sort hataता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does explain() tell you, and what is the key metric for judging query efficiency?',
        qHi: '`explain()` aapको kya bataता hai, aur query efficiency judge karne ke liye key metric kya hai?',
        a: 'Appending explain to a query returns a description of how MongoDB executes it instead of the results. At the queryPlanner verbosity it shows the chosen plan without running the query; at executionStats it runs the query and adds what actually happened, including documents examined, index keys examined, documents returned, and timing. The plan is a tree of stages read inside-out: a COLLSCAN stage means a full collection scan with no usable index, an IXSCAN wrapped in a FETCH is the normal shape of an indexed query, and a SORT stage means the sort order was not provided by an index and is being done in memory. The key metric is the ratio of totalDocsExamined to nReturned. When these are roughly equal, the query examined about as many documents as it returned and is efficient. When totalDocsExamined is far larger than nReturned, for example examining one hundred thousand documents to return ten, the query is doing large amounts of wasted work, indicating a missing index, an insufficiently selective index, or a query shape that prevents good index use. That ratio, together with the presence of a COLLSCAN or an unexpected SORT, is what identifies a query that needs tuning.',
        aHi: 'Ek query mein `explain` append karna results ke bजाy ek description lautaता hai ki MongoDB ise kaise execute karता hai. `executionStats` par ye query chalाता hai aur add karता hai ki asal mein kya hua. Plan stages ka ek tree hai andar-se-bahar padhа: ek COLLSCAN matlab ek full collection scan, ek IXSCAN ek FETCH mein wrapped ek indexed query ka normal shape, aur ek SORT stage matlab sort order ek index se nahi mila. Key metric `totalDocsExamined` aur `nReturned` ka ratio hai.',
      },
      {
        q: 'What is a covered query, and why is it faster?',
        qHi: 'Ek covered query kya hai, aur ye faster kyun hai?',
        a: 'A covered query is one where the index used contains every field the query needs, meaning both the fields the query filters on and every field the query returns, so MongoDB can produce the complete result by reading only the index and never retrieving any document. In the execution plan this appears as a PROJECTION_COVERED stage over an IXSCAN with no FETCH stage, and totalDocsExamined is zero. It is faster than an ordinary indexed query because an ordinary indexed query walks the index to find matching entries and then, for each entry, fetches the corresponding full document from the collection to obtain the fields not stored in the index, which is a second random access per result. A covered query skips that entirely: the index walk alone yields everything needed. Achieving coverage requires that the projection return only fields present in the index and, critically, that it explicitly exclude _id unless _id is part of the index, since _id is returned by default and would otherwise be an out-of-index field that forces a fetch. Designing an index and a projection together so that a frequently run query is covered is a concrete and worthwhile optimization for a hot read path.',
        aHi: 'Ek covered query wo hai jahaan istemal kiya gaya index har field contain karता hai jo query ko chahiye, matlab dono jo fields query filter karती hai aur jo har field query lautaती hai, to MongoDB poora result sirf index padhkar produce kar sakta hai aur kabhi koi document retrieve nahi karता. Execution plan mein ye ek PROJECTION_COVERED stage ke roop mein dikhता hai ek IXSCAN par bina FETCH stage ke, aur `totalDocsExamined` zero hai. Ye ek ordinary indexed query se faster hai kyunki ek ordinary indexed query har entry ke liye corresponding full document fetch karती hai.',
      },
    ],

    exercises: [
      {
        task: 'Insert 200 docs with an `n` field. Run `find({ n: 50 }).explain("executionStats")` and note the `winningPlan.stage` (`COLLSCAN`) and `totalDocsExamined` (200). Then create an index on `n`, re-run, and confirm the stage becomes `IXSCAN` and `totalDocsExamined` drops to 1.',
        taskHi: '200 docs ek `n` field ke saath insert karo. `find({ n: 50 }).explain("executionStats")` chalao. Phir `n` par ek index banao, dobara chalao.',
        hint: 'No index → COLLSCAN, every doc examined. With an index → IXSCAN, only the matching entries examined. `totalDocsExamined` vs `nReturned` is the efficiency ratio.',
        hintHi: 'Koi index nahi → COLLSCAN. Ek index ke saath → IXSCAN, sirf matching entries examined.',
      },
      {
        task: 'Insert 100 docs with `a` and `b` fields. Create a compound index `{ a: 1, b: 1 }`. Run `find({ a: 2 }, { projection: { _id: 0, a: 1, b: 1 } }).explain("executionStats")` and confirm the plan stages are `["PROJECTION_COVERED", "IXSCAN"]` with `totalDocsExamined: 0`.',
        taskHi: '100 docs `a` aur `b` fields ke saath insert karo. Ek compound index `{ a: 1, b: 1 }` banao. Query chalao aur confirm karo stages `["PROJECTION_COVERED", "IXSCAN"]` hain `totalDocsExamined: 0` ke saath.',
        hint: 'Every field the query needs (filter on `a`, return `a` and `b`) is in the index, and `_id: 0` excludes the one field that isn\'t. So no document is ever fetched — the fastest possible read.',
        hintHi: 'Har field jo query ko chahiye index mein hai, aur `_id: 0` us ek field ko exclude karta hai jo nahi hai. To koi document fetch nahi hota.',
      },
      {
        task: 'Insert 50 docs with `a` and `b` fields. Create separate indexes `{ a: 1 }` and `{ b: 1 }`. Run `find({ a: 5, b: 5 }).hint({ b: 1 }).explain("queryPlanner")` and confirm `winningPlan.inputStage.keyPattern` is `{ b: 1 }` — the hint forced the `b` index even though the planner might have chosen `a`.',
        taskHi: '50 docs `a` aur `b` fields ke saath insert karo. Alag indexes `{ a: 1 }` aur `{ b: 1 }` banao. `find({ a: 5, b: 5 }).hint({ b: 1 }).explain("queryPlanner")` chalao.',
        hint: '`hint()` overrides the planner\'s index choice. Useful for diagnosis (compare `explain` across indexes), but a hardcoded hint becomes a liability — and fails hard if the hinted index is ever dropped.',
        hintHi: '`hint()` planner ki index choice override karta hai. Diagnosis ke liye useful, par ek hardcoded hint ek liability ban jaता hai.',
      },
    ],

    keyTakeaways: [
      '`.explain(verbosity)` returns HOW the query runs instead of results. `"queryPlanner"` = the plan (no run); `"executionStats"` = runs it + adds what happened (docs examined, keys examined, returned, time) — use this for tuning; `"allPlansExecution"` = stats for every candidate.',
      'The plan tree (read INSIDE-OUT, like PG): `COLLSCAN` = full collection scan, NO usable index (eliminate on large collections). `IXSCAN` (usually wrapped in `FETCH`) = normal indexed query. `SORT` = an IN-MEMORY sort — the sort order was NOT served by an index (ESR, L5); a red flag on large results (slow + a memory limit it can exceed).',
      'THE KEY METRIC: `totalDocsExamined` / `nReturned`. Roughly equal → efficient. `totalDocsExamined` >> `nReturned` (examine 100k to return 10) → large wasted work: missing index, non-selective index, or a query shape blocking the index. This ratio + a `COLLSCAN`/unexpected `SORT` is what flags a query needing tuning.',
      'A COVERED QUERY: the index contains EVERY field the query needs — both filtered AND returned fields — so MongoDB answers ENTIRELY from the index, fetching ZERO documents. Plan: `PROJECTION_COVERED` → `IXSCAN`, no `FETCH`, `totalDocsExamined: 0`. MUST explicitly exclude `_id` (`_id: 0`) unless `_id` is in the index — it\'s returned by default and would break coverage. The fastest possible read.',
      '`.hint(indexSpecOrName)` FORCES a specific index, overriding the planner. Legit uses: DIAGNOSIS (compare `explain` across `hint`ed indexes), or a documented temporary override of a demonstrable planner mistake. NOT a habit — a hardcoded hint goes stale when data/indexes change, and a hint to a DROPPED index fails HARD.',
      'THE TUNING LOOP (= PG Module 10): `explain("executionStats")` → check examined-vs-returned + `COLLSCAN`/`SORT` → diagnose (no index / wrong ESR order / uncoverable projection / `$match` not first) → make ONE change (usually add/reorder an index) → re-`explain()` to confirm.',
    ],
    keyTakeawaysHi: [
      '`.explain(verbosity)` results ke bजाy HOW query chalती hai lautaता hai. `"executionStats"` = ise chalाता hai + add karता hai ki kya hua — tuning ke liye ye istemal karो.',
      'Plan tree (ANDAR-SE-BAHAR padhа): `COLLSCAN` = full collection scan, KOI usable index nahi. `IXSCAN` (usually `FETCH` mein wrapped) = normal indexed query. `SORT` = ek IN-MEMORY sort — sort order ek index se NAHI mila (ESR, L5); large results par ek red flag.',
      'KEY METRIC: `totalDocsExamined` / `nReturned`. Lगभग equal → efficient. `totalDocsExamined` >> `nReturned` → bahut wasted work.',
      'COVERED QUERY: index mein HAR field hai jo query ko chahiye — dono filtered AUR returned fields — to MongoDB POORI TARAH index se answer karता hai, ZERO documents fetch karте hue. Plan: `PROJECTION_COVERED` → `IXSCAN`, koi `FETCH` nahi. `_id: 0` explicitly exclude karна ZAROORI hai. Fastest possible read.',
      '`.hint(indexSpecOrName)` ek specific index FORCE karता hai. Legit uses: DIAGNOSIS, ya ek documented temporary override. Ek HABIT nahi — ek dropped index ka hint HARD fail hota hai.',
      'TUNING LOOP (= PG Module 10): `explain("executionStats")` → examined-vs-returned + `COLLSCAN`/`SORT` check → diagnose → EK change karो → dobara `explain()`.',
    ],
  },
];
