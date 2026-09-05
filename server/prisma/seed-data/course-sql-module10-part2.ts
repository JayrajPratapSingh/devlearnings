/**
 * Databases Complete Course — Module 10: Indexes & Query Performance, lessons 4-6.
 *
 * Lesson 4: Specialized index types — GIN, GiST, BRIN, and Hash, each built for a
 *           data shape a plain B-tree cannot serve well.
 * Lesson 5: Index maintenance and when NOT to index — dead tuples, physical bloat
 *           after DELETE/UPDATE, VACUUM's role, and selectivity-driven index cost.
 * Lesson 6: Joins, plans, and the tuning workflow — Nested Loop vs Hash Join, how an
 *           index on the join column changes the inner scan, and the closing,
 *           end-to-end EXPLAIN-driven tuning workflow for the whole 10-module SQL arc.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 10
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_10_PART2: CourseLesson[] = [
  {
    slug: 'sql-specialized-index-types',
    title: 'Specialized Index Types: GIN, GiST, BRIN',
    titleHi: 'Specialized Index Types: GIN, GiST, BRIN',
    description: 'A plain B-tree indexes a single, scalar, sortable value. GIN indexes "contains" relationships inside a composite value like an array; GiST indexes spatial and range containment; BRIN indexes huge, naturally-ordered tables using almost no space. Choosing the right index type is choosing the right question the index needs to answer fast.',
    descriptionHi: 'Ek plain B-tree ek single, scalar, sortable value index karta hai. GIN ek array jaisī composite value ke andar "contains" relationships index karta hai; GiST spatial aur range containment index karta hai; BRIN huge, naturally-ordered tables ko lgбхаg koi space istemal kiye bina index karta hai. Sahi index type chunna woh sahi sawaal chunна hai jo index ko fast answer karna hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A library\'s call-number shelves versus its subject-tag card catalog versus its "books that arrived this month" shelf.** The call-number shelving is a B-tree: every book has exactly one sortable code, and books sit in that one sorted order — perfect for "find book number 500-something." But a library also needs to answer "which books are tagged BOTH \'cooking\' AND \'Italian\'?", and a book can carry many tags at once — no single sortable shelf position captures that. So the library keeps a separate card catalog organized by tag, where each card points to every book carrying it, and finding books matching several tags means intersecting several cards\' lists — that is a GIN index, built for "does this collection contain X" rather than "sort by X." A library also needs to answer spatial questions ("which reading rooms overlap this time slot?"), which is what GiST generalizes to: containment and overlap for shapes, ranges, and other non-scalar geometry a strict sort order cannot represent. And finally, a library that receives thousands of books a month, shelved strictly by arrival date, does not need a full detailed index at all to answer "what arrived in March" — it only needs to jot down, once per shelf-section, "this whole section covers Feb 28 to Mar 15," a tiny summary that narrows the search to the right few shelves without ever cataloging every single book. That summary-per-block approach, useful specifically because arrival order and shelf position already correlate, is BRIN.',
      hi: '**Ek library ki call-number shelves versus iski subject-tag card catalog versus iski "is mahine aayi kitaabein" shelf.** Call-number shelving ek B-tree hai: har kitaab ka theek ek sortable code hai, aur kitaabein us ek sorted order mein baiती hain. Par ek library ko ye bhi answer karna hai "kaunsi kitaabein DONO \'cooking\' AUR \'Italian\' tagged hain?", aur ek kitaab ek saath kई tags rakh sakti hai. To library ek alag card catalog rakhti hai tag ke hisaab se organized, jahaan har card us kitaab ki taraf point karta hai jo use rakhti hai — ye ek GIN index hai, "kya ye collection X rakhta hai" ke liye bana, "X se sort karo" ke liye nahi. Ek library ko spatial sawaal bhi answer karne hote hain, jismein GiST generalize karta hai. Aur aakhir mein, ek library jo har mahine hazaron kitaabein paati hai, strictly arrival date se shelved, use "March mein kya aaya" answer karne ke liye ek pura detailed index nahi chahiye — ise sirf har shelf-section ke liye ek baar likhна hai "ye poori section Feb 28 se Mar 15 tak cover karti hai", ek chhoti summary jo search ko sahi kुछ shelves tak narrow kar deती hai. Wo summary-per-block approach BRIN hai.',
    },

    simple: `**GIN — "does this collection CONTAIN X?" (arrays, JSONB, full-text search)**

\`\`\`sql
CREATE TABLE posts (id int PRIMARY KEY, tags text[]);
CREATE INDEX ON posts USING GIN (tags);
EXPLAIN (COSTS OFF) SELECT * FROM posts WHERE tags @> ARRAY['tag3'];
\`\`\`
\`\`\`
Bitmap Heap Scan on posts
  Recheck Cond: (tags @> '{tag3}'::text[])
  ->  Bitmap Index Scan on posts_tags_idx
        Index Cond: (tags @> '{tag3}'::text[])
\`\`\`

**GiST — containment/overlap for ranges, geometric types, and full-text similarity**

\`\`\`sql
CREATE TABLE reservations (id int PRIMARY KEY, span int4range);
CREATE INDEX ON reservations USING GIST (span);
EXPLAIN (COSTS OFF) SELECT * FROM reservations WHERE span @> 505;
\`\`\`
\`\`\`
Index Scan using reservations_span_idx on reservations
  Index Cond: (span @> 505)
\`\`\`

**BRIN — tiny summaries per block of a HUGE, naturally-ordered table**

\`\`\`sql
CREATE TABLE events (id int PRIMARY KEY, occurred_at timestamp);
CREATE INDEX ON events USING BRIN (occurred_at);   -- occurred_at correlates with insertion order
EXPLAIN (COSTS OFF) SELECT * FROM events
  WHERE occurred_at BETWEEN '2026-01-01 00:10:00' AND '2026-01-01 00:11:00';
\`\`\`
\`\`\`
Bitmap Heap Scan on events
  Recheck Cond: (...)
  ->  Bitmap Index Scan on events_occurred_at_idx
        Index Cond: (...)
-- looks like any other index scan in EXPLAIN -- BRIN's advantage is SIZE:
-- megabytes for a B-tree can become kilobytes for a BRIN, on the right data
\`\`\`

**Hash — equality-only, no ordering, rarely the right choice over a B-tree**

\`\`\`sql
CREATE INDEX ON t USING HASH (val);
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;   -- fine for "=", USELESS for <, >, BETWEEN
\`\`\`
\`\`\`
Index Scan using t_val_idx on t
  Index Cond: (val = 5)
-- a B-tree already does equality well AND supports range queries --
-- Hash indexes see little practical use for this reason
\`\`\``,

    simpleHi: `**GIN — "kya ye collection X CONTAIN karti hai?" (arrays, JSONB, full-text search)**

\`\`\`sql
CREATE TABLE posts (id int PRIMARY KEY, tags text[]);
CREATE INDEX ON posts USING GIN (tags);
EXPLAIN (COSTS OFF) SELECT * FROM posts WHERE tags @> ARRAY['tag3'];
\`\`\`
\`\`\`
Bitmap Heap Scan on posts
  Recheck Cond: (tags @> '{tag3}'::text[])
  ->  Bitmap Index Scan on posts_tags_idx
        Index Cond: (tags @> '{tag3}'::text[])
\`\`\`

**GiST — ranges, geometric types, aur full-text similarity ke liye containment/overlap**

\`\`\`sql
CREATE TABLE reservations (id int PRIMARY KEY, span int4range);
CREATE INDEX ON reservations USING GIST (span);
EXPLAIN (COSTS OFF) SELECT * FROM reservations WHERE span @> 505;
\`\`\`
\`\`\`
Index Scan using reservations_span_idx on reservations
  Index Cond: (span @> 505)
\`\`\`

**BRIN — ek HUGE, naturally-ordered table ke prati-block tiny summaries**

\`\`\`sql
CREATE TABLE events (id int PRIMARY KEY, occurred_at timestamp);
CREATE INDEX ON events USING BRIN (occurred_at);
EXPLAIN (COSTS OFF) SELECT * FROM events
  WHERE occurred_at BETWEEN '2026-01-01 00:10:00' AND '2026-01-01 00:11:00';
\`\`\`
\`\`\`
Bitmap Heap Scan on events
  Recheck Cond: (...)
  ->  Bitmap Index Scan on events_occurred_at_idx
        Index Cond: (...)
-- EXPLAIN mein kisi bhi doosre index scan jaisa dikhta hai -- BRIN ka advantage SIZE hai
\`\`\`

**Hash — sirf equality, koi ordering nahi, aksar B-tree se sahi choice nahi**

\`\`\`sql
CREATE INDEX ON t USING HASH (val);
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;   -- "=" ke liye theek, <, >, BETWEEN ke liye BEKAAR
\`\`\`
\`\`\`
Index Scan using t_val_idx on t
  Index Cond: (val = 5)
-- ek B-tree pehle se equality achhi tarah karta hai AUR range queries support karta hai
\`\`\``,

    content: `## Why a plain B-tree isn't always enough

A B-tree indexes one column's value in a strict, total sort order — great for "equals," "less than," "greater than," and "sorted by." But some questions aren't about sorting a scalar value at all: "does this array contain X," "does this range overlap that one," "which rows arrived in roughly this order." PostgreSQL ships dedicated index types for exactly these shapes.

## GIN: inverted index for "contains" queries

A **GIN** (Generalized Inverted Index) index is built for values that are themselves collections — arrays, JSONB documents, \`tsvector\` full-text documents — where the question is "which rows' collection contains this element (or these elements)."

\`\`\`sql
CREATE TABLE posts (id int PRIMARY KEY, tags text[]);
CREATE INDEX ON posts USING GIN (tags);
EXPLAIN (COSTS OFF) SELECT * FROM posts WHERE tags @> ARRAY['tag3'];
\`\`\`
\`\`\`
Bitmap Heap Scan on posts
  Recheck Cond: (tags @> '{tag3}'::text[])
  ->  Bitmap Index Scan on posts_tags_idx
        Index Cond: (tags @> '{tag3}'::text[])
\`\`\`

Internally, GIN maintains an entry for every distinct element that appears in any row's array (or every distinct word in a document), each pointing back to every row containing it — literally "inverted" relative to a normal index, which points from a row to a value. This is exactly the structure that powers PostgreSQL full-text search (\`tsvector @@ tsquery\`) and JSONB containment (\`jsonb_col @> '{"key": "value"}'\`), both being "does this document contain this" questions in disguise.

## GiST: containment and overlap for non-scalar data

A **GiST** (Generalized Search Tree) index is a framework for indexing data where "containment" or "overlap" is the natural question, but the values aren't simply orderable the way numbers or text are — range types, geometric types, and (with the right extension) trigram text similarity.

\`\`\`sql
CREATE TABLE reservations (id int PRIMARY KEY, span int4range);
CREATE INDEX ON reservations USING GIST (span);
EXPLAIN (COSTS OFF) SELECT * FROM reservations WHERE span @> 505;
\`\`\`
\`\`\`
Index Scan using reservations_span_idx on reservations
  Index Cond: (span @> 505)
\`\`\`

This example indexes integer ranges and asks "which reservation spans contain the point 505" — the same structure generalizes to "which meeting rooms' time ranges overlap this one" or "which geographic shapes contain this point," none of which have a single meaningful sort order the way a plain number does.

## BRIN: tiny summaries for huge, naturally-ordered tables

A **BRIN** (Block Range Index) index does not store an entry per row at all. Instead, it divides the table into physical blocks and stores one summary per block — for example, "the minimum and maximum \`occurred_at\` values physically stored in this block." This works beautifully when a column's values correlate with the table's physical storage order, which is exactly the case for an append-only, timestamp-ordered log table:

\`\`\`sql
CREATE TABLE events (id int PRIMARY KEY, occurred_at timestamp);
CREATE INDEX ON events USING BRIN (occurred_at);
EXPLAIN (COSTS OFF) SELECT * FROM events
  WHERE occurred_at BETWEEN '2026-01-01 00:10:00' AND '2026-01-01 00:11:00';
\`\`\`
\`\`\`
Bitmap Heap Scan on events
  Recheck Cond: (...)
  ->  Bitmap Index Scan on events_occurred_at_idx
        Index Cond: (...)
\`\`\`

The \`EXPLAIN\` output looks like any other index-driven plan — BRIN's real advantage never shows up in the plan shape, only in the index's **size**: because it stores one small summary per block rather than one entry per row, a BRIN index on a huge table can be a tiny fraction of the size of an equivalent B-tree, at the cost of being far less precise (it can only rule out whole blocks, not individual rows, which is why the \`Recheck Cond\` step matters here more than for a B-tree-backed bitmap scan). BRIN is a poor fit for a column with no correlation to physical storage order — an index on a randomly-assigned category column, for instance, gains nothing from block summaries, since matching rows would be scattered across every block anyway.

## Hash indexes

A **Hash** index stores a hash of the column's value, supporting equality lookups only — no ordering, no range queries.

\`\`\`sql
CREATE INDEX ON t USING HASH (val);
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Index Scan using t_val_idx on t
  Index Cond: (val = 5)
\`\`\`

In practice, hash indexes see little use in modern PostgreSQL: a B-tree already handles equality efficiently, while *also* supporting range queries, sorting, and prefix matching that a hash index cannot serve at all. A hash index can theoretically be marginally smaller or faster for pure-equality workloads on very large values, but the default choice for an equality-heavy column remains a plain B-tree unless a specific, measured reason says otherwise.

## Choosing among index types

- **B-tree** (the default) — a single sortable value, equality or range conditions, sorting.
- **GIN** — "does this array/JSONB/document contain X" — full-text search, JSONB containment, array membership.
- **GiST** — containment/overlap for ranges, geometric data, or (via extension) fuzzy text similarity.
- **BRIN** — a huge table whose indexed column correlates with physical row order (append-only logs, time-series data) — massive space savings over a B-tree, at reduced precision.
- **Hash** — rarely the right default; a B-tree already does equality well and supports more.

Every specialized type still carries the same fundamental trade-off from Lesson 1: it costs write-time maintenance in exchange for read-time speed on a specific shape of query, so the choice should always follow from the actual shape of the queries a table needs to serve.`,

    contentHi: `## Ek plain B-tree hamesha kaafi kyun nahi hai

Ek B-tree ek column ki value ko ek strict, total sort order mein index karta hai. Par kuch sawaal ek scalar value ko sort karne ke baare mein bilkul nahi hain: "kya ye array X contain karta hai," "kya ye range us doosre se overlap karta hai," "kaunsi rows lgbhag is order mein aayin." PostgreSQL theek in shapes ke liye dedicated index types deta hai.

## GIN: "contains" queries ke liye inverted index

Ek **GIN** (Generalized Inverted Index) index un values ke liye bana hai jo khud collections hain — arrays, JSONB documents, \`tsvector\` full-text documents.

\`\`\`sql
CREATE TABLE posts (id int PRIMARY KEY, tags text[]);
CREATE INDEX ON posts USING GIN (tags);
EXPLAIN (COSTS OFF) SELECT * FROM posts WHERE tags @> ARRAY['tag3'];
\`\`\`
\`\`\`
Bitmap Heap Scan on posts
  Recheck Cond: (tags @> '{tag3}'::text[])
  ->  Bitmap Index Scan on posts_tags_idx
        Index Cond: (tags @> '{tag3}'::text[])
\`\`\`

Internally, GIN har us distinct element ke liye ek entry maintain karta hai jo kisī row ke array mein aata hai, har ek us har row ki taraf point karte hue jismein wo hai — literally "inverted" ek normal index ke sapeksh.

## GiST: non-scalar data ke liye containment aur overlap

Ek **GiST** (Generalized Search Tree) index un data ko index karne ka ek framework hai jahaan "containment" ya "overlap" natural sawaal hai — range types, geometric types.

\`\`\`sql
CREATE TABLE reservations (id int PRIMARY KEY, span int4range);
CREATE INDEX ON reservations USING GIST (span);
EXPLAIN (COSTS OFF) SELECT * FROM reservations WHERE span @> 505;
\`\`\`
\`\`\`
Index Scan using reservations_span_idx on reservations
  Index Cond: (span @> 505)
\`\`\`

## BRIN: huge, naturally-ordered tables ke liye tiny summaries

Ek **BRIN** (Block Range Index) index bilkul prati-row ek entry store nahi karta. Iske bजाय, ye table ko physical blocks mein divide karta hai aur prati-block ek summary store karta hai.

\`\`\`sql
CREATE TABLE events (id int PRIMARY KEY, occurred_at timestamp);
CREATE INDEX ON events USING BRIN (occurred_at);
EXPLAIN (COSTS OFF) SELECT * FROM events
  WHERE occurred_at BETWEEN '2026-01-01 00:10:00' AND '2026-01-01 00:11:00';
\`\`\`
\`\`\`
Bitmap Heap Scan on events
  Recheck Cond: (...)
  ->  Bitmap Index Scan on events_occurred_at_idx
        Index Cond: (...)
\`\`\`

\`EXPLAIN\` output kisi bhi doosre index-driven plan jaisा dikhta hai — BRIN ka real advantage plan shape mein kabhi nahi dikhta, sirf index ke **size** mein.

## Hash indexes

Ek **Hash** index column ki value ka ek hash store karta hai, sirf equality lookups support karte hue.

\`\`\`sql
CREATE INDEX ON t USING HASH (val);
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Index Scan using t_val_idx on t
  Index Cond: (val = 5)
\`\`\`

Practice mein, hash indexes ka kam istemal hota hai: ek B-tree pehle se equality efficiently handle karta hai, saath hi range queries bhi support karta hai jo ek hash index bilkul serve nahi kar sakta.

## In index types mein chunna

- **B-tree** (default) — ek single sortable value, equality ya range conditions, sorting.
- **GIN** — "kya ye array/JSONB/document X contain karta hai" — full-text search, JSONB containment.
- **GiST** — ranges, geometric data ke liye containment/overlap.
- **BRIN** — ek huge table jiska indexed column physical row order se correlate karta hai.
- **Hash** — शायद hi sahi default; ek B-tree pehle se equality achhi tarah karta hai.`,

    examples: [
      {
        title: 'A GIN index serves an array-containment query',
        titleHi: 'Ek GIN index ek array-containment query serve karta hai',
        code: `CREATE TABLE posts (id int PRIMARY KEY, tags text[]);
INSERT INTO posts SELECT g, ARRAY['tag' || (g % 50), 'tag' || ((g+1) % 50)] FROM generate_series(1, 1000) g;
CREATE INDEX ON posts USING GIN (tags);
ANALYZE posts;
EXPLAIN (COSTS OFF) SELECT * FROM posts WHERE tags @> ARRAY['tag3'];`,
        output: ` QUERY PLAN
------------------------------------------------
 Bitmap Heap Scan on posts
   Recheck Cond: (tags @> '{tag3}'::text[])
   ->  Bitmap Index Scan on posts_tags_idx
         Index Cond: (tags @> '{tag3}'::text[])
(4 rows)`,
        explain: 'Each `posts` row\'s `tags` array can hold any of many tags, so a GIN index maintains one entry per distinct tag, each pointing back at every row carrying it. `tags @> ARRAY[\'tag3\']` is exactly a "contains" question, matched via `Bitmap Index Scan on posts_tags_idx` feeding a `Bitmap Heap Scan on posts`.',
        explainHi: 'Har `posts` row ka `tags` array kई tags mein se kई rakh sakta hai, to ek GIN index har distinct tag ke liye ek entry maintain karta hai, har ek us har row ki taraf point karte hue jo ise rakhti hai. `tags @> ARRAY[\'tag3\']` theek ek "contains" sawaal hai, `Bitmap Index Scan on posts_tags_idx` se match hote hue jo ek `Bitmap Heap Scan on posts` ko feed karta hai.',
      },
      {
        title: 'A GiST index serves a range-containment query',
        titleHi: 'Ek GiST index ek range-containment query serve karta hai',
        code: `CREATE TABLE reservations (id int PRIMARY KEY, span int4range);
INSERT INTO reservations SELECT g, int4range(g*10, g*10+5) FROM generate_series(1, 1000) g;
CREATE INDEX ON reservations USING GIST (span);
ANALYZE reservations;
EXPLAIN (COSTS OFF) SELECT * FROM reservations WHERE span @> 505;`,
        output: ` QUERY PLAN
--------------------------------------------------------
 Index Scan using reservations_span_idx on reservations
   Index Cond: (span @> 505)
(2 rows)`,
        explain: 'An `int4range` column has no single meaningful sort order, only containment and overlap relationships — exactly what GiST is built for. `span @> 505` ("which range contains this point") is served directly as `Index Scan using reservations_span_idx on reservations` with `Index Cond: (span @> 505)`.',
        explainHi: 'Ek `int4range` column ka koi single meaningful sort order nahi hai, sirf containment aur overlap relationships — theek jiske liye GiST bana hai. `span @> 505` ("kaunsa range is point ko contain karta hai") seedhe `Index Scan using reservations_span_idx on reservations` ke roop mein serve hota hai `Index Cond: (span @> 505)` ke saath.',
      },
      {
        title: 'A BRIN index serves a range query on a naturally-ordered timestamp column',
        titleHi: 'Ek BRIN index ek naturally-ordered timestamp column par ek range query serve karta hai',
        code: `CREATE TABLE events (id int PRIMARY KEY, occurred_at timestamp);
INSERT INTO events SELECT g, TIMESTAMP '2026-01-01' + (g || ' seconds')::interval FROM generate_series(1, 50000) g;
CREATE INDEX ON events USING BRIN (occurred_at);
ANALYZE events;
SET TIME ZONE 'UTC';
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE occurred_at BETWEEN TIMESTAMP '2026-01-01 00:10:00' AND TIMESTAMP '2026-01-01 00:11:00';`,
        output: ` QUERY PLAN
-------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Bitmap Heap Scan on events
   Recheck Cond: ((occurred_at >= '2026-01-01 00:10:00'::timestamp without time zone) AND (occurred_at <= '2026-01-01 00:11:00'::timestamp without time zone))
   ->  Bitmap Index Scan on events_occurred_at_idx
         Index Cond: ((occurred_at >= '2026-01-01 00:10:00'::timestamp without time zone) AND (occurred_at <= '2026-01-01 00:11:00'::timestamp without time zone))
(4 rows)`,
        explain: "Rows were inserted in strictly increasing `occurred_at` order, so the column correlates with physical storage order — exactly the condition BRIN needs. The narrow `BETWEEN` range is served via `Bitmap Heap Scan on events` fed by `Bitmap Index Scan on events_occurred_at_idx`, indistinguishable in shape from a B-tree-backed plan; BRIN's real advantage here is the index's tiny on-disk size, not anything visible in `EXPLAIN`.",
        explainHi: 'Rows strictly increasing `occurred_at` order mein insert hui thin, to column physical storage order se correlate karta hai — theek wo condition jo BRIN ko chahiye. Narrow `BETWEEN` range `Bitmap Heap Scan on events` ke through serve hota hai jise `Bitmap Index Scan on events_occurred_at_idx` feed karta hai, ek B-tree-backed plan se shape mein indistinguishable; BRIN ka real advantage yahaan index ke tiny on-disk size mein hai, `EXPLAIN` mein kuch bhi visible nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `-- reaching for GIN/GiST/BRIN out of novelty, on data that is just a plain scalar
CREATE TABLE t (id int PRIMARY KEY, status text);
CREATE INDEX ON t USING GIN (status);   -- status is a single plain text value, not a collection
-- works, but is larger and slower to build/maintain than a plain B-tree for
-- absolutely no benefit -- GIN's whole design point (inverted, per-element entries)
-- is wasted on a column that was never a collection in the first place`,
        right: `CREATE INDEX ON t (status);   -- a plain B-tree is the right, boring choice here
-- reserve GIN for actual collection-shaped columns: arrays, JSONB, tsvector`,
        why: 'Each specialized index type is built around a specific shape of question — GIN around "does this collection contain X," GiST around containment and overlap for non-scalar data, BRIN around block-level summaries for physically-correlated huge tables. Applying one of these to a plain scalar column that a B-tree already serves perfectly well gains none of that type\'s actual benefit, since the column being indexed was never the kind of value the specialized structure was designed to exploit, while still paying that index type\'s own construction and maintenance overhead, which for GIN in particular is often higher than a B-tree\'s. The right default for an ordinary scalar column filtered by equality or range remains a plain B-tree; specialized types earn their keep only when the data itself has the shape they are built for.',
        whyHi: 'Har specialized index type ek specific sawaal ke shape ke around bana hai — GIN "kya ye collection X contain karta hai" ke around, GiST non-scalar data ke liye containment aur overlap ke around, BRIN physically-correlated huge tables ke liye block-level summaries ke around. In mein se ek ko ek plain scalar column par apply karna jise ek B-tree pehle se perfectly serve karta hai us type ke actual benefit mein se kuch nahi paता, jabki phir bhi us index type ki apni construction aur maintenance overhead pay karta hai.',
      },
      {
        wrong: `-- using BRIN on a column with no correlation to physical storage order
CREATE TABLE t (id int PRIMARY KEY, random_category int);
-- random_category values are scattered randomly, unrelated to insertion order
CREATE INDEX ON t USING BRIN (random_category);
-- BRIN's per-block min/max summary is nearly useless here -- almost every
-- block's summary range overlaps almost every query value, so almost every
-- block still has to be checked -- little better than a sequential scan`,
        right: `CREATE INDEX ON t (random_category);   -- a plain B-tree works regardless of physical order
-- BRIN specifically needs the column's VALUES to correlate with the table's
-- physical ROW order (e.g. an append-only timestamp or auto-incrementing id) --
-- verify that correlation exists before reaching for BRIN`,
        why: 'A BRIN index only narrows a search by ruling out whole physical blocks whose summarized value range cannot contain a match. That only works well when a column\'s values are not scattered randomly across the table but instead correlate with the physical order rows were stored in, which is naturally true for an append-only log ordered by insertion time, but is not true for a column whose values bear no relationship to insertion order. On an uncorrelated column, nearly every block\'s min/max range ends up overlapping nearly every query\'s target value, so BRIN can rule out very few blocks and the query ends up checking almost the whole table anyway, gaining little over a plain sequential scan while still carrying index maintenance overhead. Confirming that a column\'s values genuinely correlate with physical storage order is a prerequisite for BRIN paying off, not an afterthought.',
        whyHi: 'Ek BRIN index ek search ko sirf un poore physical blocks ko rule out karke narrow karta hai jinka summarized value range ek match contain nahi kar sakta. Ye tabhi achhi tarah kaam karta hai jab ek column ki values table mein randomly bikhri na hon balki physical order se correlate karti hon jismein rows store hui thi. Uncorrelated column par, lgbhag har block ka min/max range lgbhag har query ke target value se overlap karta hai, to BRIN bahut kam blocks rule out kar pata hai.',
      },
      {
        wrong: `-- choosing a Hash index specifically to support a range query
CREATE INDEX ON t USING HASH (val);
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val > 100;
-- a Hash index cannot serve this at all -- it only supports equality --
-- this query falls back to a Seq Scan regardless of the Hash index's presence`,
        right: `CREATE INDEX ON t (val);   -- a plain B-tree supports equality AND range conditions
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val > 100;   -- can use a B-tree, never a Hash index`,
        why: 'A Hash index stores only a hash of each value, which supports checking whether two values are equal but carries no information about their relative order, so it fundamentally cannot answer a less-than, greater-than, or range query; only an exact equality condition can ever use one. A B-tree, by contrast, keeps values in sorted order, which serves equality just as well as a hash index while also supporting range conditions and ordering, which is why a B-tree remains the sound general-purpose default and a Hash index is reserved, if ever, for confirmed equality-only workloads.',
        whyHi: 'Ek Hash index sirf har value ka ek hash store karta hai, jo check karта hai ki do values equal hain ya nahi, par unke relative order ke baare mein koi information nahi rakhta, to ye fundamentally ek less-than, greater-than, ya range query ka jawab nahi de sakta. Ek B-tree, iske viparit, values ko sorted order mein rakhta hai, jo equality ko utni hi achhi tarah serve karta hai jitna ek hash index, saath hi range conditions bhi support karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**A GIN index on a JSONB `metadata` column** (`CREATE INDEX ON events USING GIN (metadata)`) powering fast `metadata @> \'{"type": "click"}\'` containment queries in an event-logging system.',
        hi: '**Ek JSONB `metadata` column par ek GIN index** ek event-logging system mein fast containment queries power karta hai.',
      },
      {
        en: '**A BRIN index on a multi-terabyte, append-only sensor-reading table\'s `recorded_at` column** — occupying kilobytes instead of the gigabytes a B-tree would need, because insertion order and timestamp order are identical by construction.',
        hi: '**Ek multi-terabyte, append-only sensor-reading table ke `recorded_at` column par ek BRIN index** — kilobytes lete hue jahaan ek B-tree ko gigabytes chahiye hote.',
      },
      {
        en: '**PostgreSQL full-text search** (`to_tsvector(...) @@ to_tsquery(...)`) backed by a GIN index on the generated `tsvector` column, standard practice for in-database search without a separate search engine.',
        hi: '**PostgreSQL full-text search** ek generated `tsvector` column par ek GIN index se backed, ek alag search engine ke bina in-database search ke liye standard practice.',
      },
    ],

    interviewQA: [
      {
        q: 'When would you reach for a GIN index instead of a B-tree, and why can\'t a B-tree serve the same query well?',
        qHi: 'Aap ek B-tree ke bजाय ek GIN index kab chunoge, aur ek B-tree wahi query achhi tarah kyun serve nahi kar sakta?',
        a: 'A GIN index is the right choice when the column being indexed holds a composite value, an array, a JSONB document, or a full-text document represented as a tsvector, and the query being asked is whether that composite value contains some element or set of elements, rather than how the composite value as a whole compares or sorts against another. A B-tree fundamentally indexes a single sortable value per row and answers equality, range, and ordering questions about that one value; it has no natural way to represent "this row\'s array contains element X" as a sortable key, because a row could contain any of many elements and there is no single scalar value to sort by that captures that. GIN solves this by inverting the structure: instead of one entry per row pointing at that row\'s whole value, it keeps one entry per distinct element that appears in any row\'s collection, each pointing back to every row containing that element, which is exactly the structure "contains" queries need and exactly what a B-tree\'s single-sortable-key design cannot represent.',
        aHi: 'Ek GIN index sahi choice hai jab index kiya ja raha column ek composite value rakhta hai, ek array, ek JSONB document, ya ek full-text document, aur poochha ja raha sawaal ye hai ki kya wo composite value kisī element ya elements ke set ko contain karta hai. Ek B-tree fundamentally prati-row ek single sortable value index karta hai; iske paas "is row ka array element X contain karta hai" ko ek sortable key ke roop mein represent karne ka koi natural tarika nahi hai. GIN structure ko invert karके ise solve karta hai: prati-row ek entry rakhne ke bजаय, ye har distinct element ke liye ek entry rakhta hai jo kisī row ke collection mein aata hai.',
      },
      {
        q: 'What makes a column a good or bad candidate for a BRIN index?',
        qHi: 'Ek column ko BRIN index ke liye ek achhi ya buri candidate kya banata hai?',
        a: 'A BRIN index works by dividing a table into physical blocks and storing a small summary per block, typically the minimum and maximum value seen in that block, then using those summaries to rule out entire blocks whose range cannot possibly contain a match, without recording any information about individual rows. This makes a column a good candidate precisely when its values correlate strongly with the physical order rows are stored in, the clearest example being a timestamp or auto-incrementing identifier on an append-only table, since rows inserted around the same time end up physically near each other and share a narrow value range per block. A column is a poor candidate when its values are scattered with no relationship to physical storage order, for instance a category assigned essentially at random; in that case nearly every block\'s summarized range ends up overlapping the value being searched for, so BRIN can rule out almost nothing and the query still has to examine nearly the whole table, gaining little over a plain sequential scan while still paying for an index that has to be maintained. Verifying that correlation, rather than assuming it, is the deciding factor before choosing BRIN over a B-tree.',
        aHi: 'Ek BRIN index ek table ko physical blocks mein divide karके aur prati-block ek chhoti summary store karके kaam karta hai, typically us block mein dekhi gayi minimum aur maximum value, phir un summaries ka istemal poore blocks ko rule out karne ke liye karta hai jinka range kisī match ko contain nahi kar sakta. Ye ek column ko theek tab ek achhi candidate banata hai jab iski values physical row order se strongly correlate karti hain. Ek column ek buri candidate hai jab iski values physical storage order se koi relationship ke bina bikhri hoti hain.',
      },
    ],

    exercises: [
      {
        task: 'Table `posts(id int PRIMARY KEY, tags text[])` with 1000 rows, each with two tags. Create a `GIN` index on `tags`, `ANALYZE`, then confirm `WHERE tags @> ARRAY[\'tag3\']` uses `Bitmap Index Scan on posts_tags_idx`.',
        taskHi: 'Table `posts(id, tags)` 1000 rows ke saath, har ek do tags ke saath. `tags` par ek `GIN` index banao, `ANALYZE`, phir confirm karo `WHERE tags @> ARRAY[\'tag3\']` `Bitmap Index Scan on posts_tags_idx` istemal karta hai.',
        hint: 'GIN maintains one entry per distinct tag, each pointing at every row carrying it — a containment query like `@>` is exactly the shape GIN is built to answer quickly.',
        hintHi: 'GIN har distinct tag ke liye ek entry maintain karta hai, har ek us har row ki taraf point karte hue jo ise rakhti hai — `@>` jaisā ek containment query theek wo shape hai jise GIN jaldi answer karne ke liye bana hai.',
      },
      {
        task: 'Table `events(id int PRIMARY KEY, occurred_at timestamp)` with 50,000 sequentially-timestamped rows. Create a `BRIN` index on `occurred_at`, `ANALYZE`, `SET TIME ZONE \'UTC\'`, and confirm a narrow `BETWEEN` range query uses the index via a `Bitmap Heap Scan`/`Bitmap Index Scan` pair.',
        taskHi: 'Table `events(id, occurred_at)` 50,000 sequentially-timestamped rows ke saath. `occurred_at` par ek `BRIN` index banao, `ANALYZE`, `SET TIME ZONE \'UTC\'`, aur confirm karo ek narrow `BETWEEN` range query index istemal karti hai.',
        hint: 'Because rows were inserted in timestamp order, `occurred_at` correlates with physical storage order — exactly the condition BRIN needs to narrow the search to a few blocks.',
        hintHi: 'Kyunki rows timestamp order mein insert hui thin, `occurred_at` physical storage order se correlate karta hai — theek wo condition jo BRIN ko search ko kुछ blocks tak narrow karne ke liye chahiye.',
      },
      {
        task: 'In a comment (no SQL needed), explain why a Hash index built on a column would be useless for a query using `>` or `BETWEEN` on that same column, while a B-tree on the same column supports both equality and range queries.',
        taskHi: 'Ek comment mein (koi SQL zaroori nahi), samjhaओ ki ek column par bana ek Hash index us usी column par `>` ya `BETWEEN` istemal karti ek query ke liye kyun bekaar hoga.',
        hint: 'A hash index stores only a hash of each value — enough to check equality, but with no relationship between a value\'s hash and its relative order, so it carries no information a range comparison could use. A B-tree keeps values in actual sorted order, serving both equality and range queries from the same structure.',
        hintHi: 'Ek hash index sirf har value ka ek hash store karta hai — equality check karne ke liye kaafi, par ek value ke hash aur iske relative order ke beech koi relationship nahi.',
      },
    ],

    keyTakeaways: [
      'A plain B-tree indexes ONE sortable scalar value — great for `=`, `<`, `>`, sorting. Some questions aren\'t about a sortable scalar at all, and PostgreSQL ships dedicated index types for them.',
      'GIN (Generalized Inverted Index): built for COLLECTION-shaped values (arrays, JSONB, `tsvector`) and "CONTAINS" questions (`@>`, full-text `@@`). Stores one entry per distinct ELEMENT, each pointing back to every row containing it — inverted relative to a normal index.',
      'GiST (Generalized Search Tree): built for CONTAINMENT/OVERLAP on non-scalar data — range types, geometric types, (via extension) fuzzy text similarity — where a single total sort order can\'t represent the question.',
      'BRIN (Block Range Index): stores ONE SUMMARY PER PHYSICAL BLOCK (e.g. min/max), not one entry per row. Needs the indexed column\'s values to CORRELATE with physical storage order (append-only, timestamp/id-ordered tables) — massive SPACE savings over a B-tree on huge tables, at reduced precision. Looks like any other index scan in `EXPLAIN` — its advantage is SIZE, not plan shape. USELESS on an uncorrelated column (e.g. random category) — nearly every block still has to be checked.',
      'Hash: equality-ONLY, no ordering, no range support at all. A B-tree already handles equality well AND supports ranges — Hash indexes see little practical use over the default B-tree.',
      'Every specialized type still carries Lesson 1\'s core trade-off (write-time cost for read-time speed) — choose one because the data genuinely has that SHAPE (collection/containment/correlated-huge-table), never out of novelty on a plain scalar column a B-tree already serves well.',
    ],
    keyTakeawaysHi: [
      'Ek plain B-tree EK sortable scalar value index karta hai. Kuch sawaal ek sortable scalar ke baare mein bilkul nahi hote, aur PostgreSQL inके liye dedicated index types deta hai.',
      'GIN: COLLECTION-shaped values (arrays, JSONB, `tsvector`) aur "CONTAINS" sawaalon ke liye bana. Har distinct ELEMENT ke liye ek entry store karta hai, har ek us har row ki taraf point karte hue jo ise rakhti hai.',
      'GiST: non-scalar data par CONTAINMENT/OVERLAP ke liye bana — range types, geometric types.',
      'BRIN: prati-PHYSICAL-BLOCK EK SUMMARY store karta hai, prati-row entry nahi. Indexed column ki values ko physical storage order se CORRELATE karna zaroori hai — huge tables par B-tree se massive SPACE savings, kam precision par. `EXPLAIN` mein kisi bhi doosre index scan jaisa dikhta hai. Uncorrelated column par BEKAAR hai.',
      'Hash: sirf-equality, koi ordering nahi. Ek B-tree pehle se equality achhi tarah karta hai AUR ranges support karta hai.',
      'Har specialized type Lesson 1 ka core trade-off le jaता hai — ek chunो kyunki data genuinely wo SHAPE rakhta hai, novelty ke liye kabhi nahi.',
    ],
  },

  {
    slug: 'sql-index-maintenance-and-when-not-to-index',
    title: 'Index Maintenance and When NOT to Index',
    titleHi: 'Index Maintenance Aur Kab Index NAHI Karna Chahiye',
    description: 'Every UPDATE and DELETE leaves behind a dead tuple — an old row version that still occupies physical space until VACUUM reclaims it. Understanding that lifecycle, and knowing when an index\'s write-time cost outweighs its read-time benefit, is what separates a schema that stays fast from one that quietly degrades.',
    descriptionHi: 'Har `UPDATE` aur `DELETE` ek dead tuple chhoड़ jाता hai — ek purани row version jo tab tak physical space occupy karti hai jab tak `VACUUM` ise reclaim nahi karta. Us lifecycle ko samajhна, aur ye jaanна ki kab ek index ki write-time cost iske read-time benefit se zyada hai, wahi hai jo ek schema ko fast rakhता hai ek se alag jo चुपchap degrade hota hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 5,

    analogy: {
      en: '**Crossing out an old address in a paper ledger versus actually erasing it.** When a row is updated in PostgreSQL, the old version is not overwritten in place — it is left exactly where it was, marked invalid, while a brand new version is written elsewhere. This is the same reason Module 9\'s MVCC lesson gave: other transactions might still legitimately need to see that old version for a moment longer. But that old, crossed-out entry does not vanish from the ledger\'s pages just because everyone has stopped needing it — the page is still exactly as long as it was, still holding both the crossed-out line and the new one, until someone deliberately goes through the ledger and physically removes every crossed-out line, compacting each page back down. That deliberate cleanup pass is `VACUUM`: without it, a ledger that is updated constantly grows and grows, full of crossed-out lines nobody reads anymore, even though the *number of addresses currently valid* never grew at all — the ledger is "bloated," heavier to search through than the genuinely useful information inside it would ever require. And building an index is exactly like keeping a second, cross-referenced ledger pointing back into the first one: helpful when people frequently need to look someone up by that second attribute, but one more book that must be updated, page by page, every single time the first ledger changes — worth keeping only for the cross-references people actually use.',
      hi: '**Ek paper ledger mein ek purани address ko kaat dена versus use asal mein mitа dена.** Jab PostgreSQL mein ek row update hoती hai, purани version jagah par overwrite nahi hoती — ise theek wahin chhoड़ diया jaata hai, invalid maark kiया hua, jabki ek bilkul nayi version kahin aur likhi jaati hai. Ye wahi wajah hai jo Module 9 ke MVCC lesson ne di: doosre transactions ko shАyad abhi bhi legitimately wo purани version ek pal aur dekhne ki zaroorat ho. Par wo purани, kati hui entry ledger ke pages se gayab nahi hoती sirf isliye ki sabne use zaroorat karna band kar diya — page abhi bhi utna hi lamba hai jitna pehle tha. Wo deliberate cleanup pass `VACUUM` hai: iske bina, ek ledger jo lगatar update hoता hai badhta hi jaata hai. Aur ek index banana bilkul ek doosri, cross-referenced ledger rakhने jaisा hai jo pehli ki taraf point karti hai.',
    },

    simple: `**\`UPDATE\` doesn't overwrite in place — it leaves the OLD row and writes a NEW one**

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, val int);
INSERT INTO t VALUES (1, 100);
SELECT ctid, val FROM t WHERE id = 1;
UPDATE t SET val = 200 WHERE id = 1;
SELECT ctid, val FROM t WHERE id = 1;   -- DIFFERENT ctid -- a NEW physical row
\`\`\`
\`\`\`
 ctid  | val
-------+-----
 (0,1) | 100
(1 row)

 ctid  | val
-------+-----
 (0,2) | 200
(1 row)
-- the OLD (0,1) slot is now a "dead tuple" -- still occupying space,
-- invisible to new queries, until VACUUM reclaims it
\`\`\`

**\`DELETE\` doesn't shrink the table's physical size -- that's what VACUUM is for**

\`\`\`sql
-- 2000 rows, delete half:
DELETE FROM t WHERE id % 2 = 0;
SELECT count(*) FROM t;                 -- 1000 -- correctly shows only LIVE rows
SELECT pg_relation_size('t');           -- SAME size as before the delete --
                                          -- the deleted rows' space isn't reclaimed yet
\`\`\`

**Same index, different selectivity: used for a RARE value, ignored for a COMMON one**

\`\`\`sql
CREATE INDEX ON t (is_deleted);   -- 1% true, 99% false
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE is_deleted = true;    -- uses the index
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE is_deleted = false;   -- does NOT
\`\`\`
\`\`\`
Index Scan using t_is_deleted_idx on t
  Index Cond: (is_deleted = true)

Seq Scan on t
  Filter: (NOT is_deleted)
\`\`\`

**\`VACUUM\` reclaims dead-tuple space and updates the visibility map (needed for Index Only Scan)**
**\`autovacuum\` runs this automatically in the background — but a write-heavy table can outpace it**`,

    simpleHi: `**\`UPDATE\` jagah par overwrite nahi karта — ye PURANI row chhoड़ता hai aur ek NAYI likhta hai**

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, val int);
INSERT INTO t VALUES (1, 100);
SELECT ctid, val FROM t WHERE id = 1;
UPDATE t SET val = 200 WHERE id = 1;
SELECT ctid, val FROM t WHERE id = 1;   -- ALAG ctid -- ek NAYI physical row
\`\`\`
\`\`\`
 ctid  | val
-------+-----
 (0,1) | 100
(1 row)

 ctid  | val
-------+-----
 (0,2) | 200
(1 row)
-- PURANA (0,1) slot ab ek "dead tuple" hai -- abhi bhi space occupy karता hai
\`\`\`

**\`DELETE\` table ka physical size nahi ghataता -- iske liye VACUUM hai**

\`\`\`sql
DELETE FROM t WHERE id % 2 = 0;
SELECT count(*) FROM t;                 -- 1000 -- sahi se sirf LIVE rows dikhaता hai
SELECT pg_relation_size('t');           -- delete se PEHLE jitna hi size --
\`\`\`

**Wahi index, alag selectivity: ek RARE value ke liye istemal, ek COMMON ke liye ignore**

\`\`\`sql
CREATE INDEX ON t (is_deleted);   -- 1% true, 99% false
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE is_deleted = true;    -- index istemal karta hai
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE is_deleted = false;   -- NAHI karta
\`\`\`
\`\`\`
Index Scan using t_is_deleted_idx on t
  Index Cond: (is_deleted = true)

Seq Scan on t
  Filter: (NOT is_deleted)
\`\`\`

**\`VACUUM\` dead-tuple space reclaim karta hai aur visibility map update karta hai**
**\`autovacuum\` ise background mein automatically chalाता hai -- par ek write-heavy table ise outpace kar sakta hai**`,

    content: `## What \`UPDATE\` and \`DELETE\` actually leave behind

Module 9's MVCC lesson established that PostgreSQL never overwrites a row in place: an \`UPDATE\` writes an entirely new row version and marks the old one invalid; a \`DELETE\` marks a row invalid without immediately reclaiming its space. Both leave behind a **dead tuple** — physical storage that no current or future transaction can ever see again, but that has not yet been reclaimed.

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, val int);
INSERT INTO t VALUES (1, 100);
SELECT ctid, val FROM t WHERE id = 1;
UPDATE t SET val = 200 WHERE id = 1;
SELECT ctid, val FROM t WHERE id = 1;
\`\`\`
\`\`\`
 ctid  | val
-------+-----
 (0,1) | 100
(1 row)

 ctid  | val
-------+-----
 (0,2) | 200
(1 row)
\`\`\`

The row's \`ctid\` (its physical location) changed from \`(0,1)\` to \`(0,2)\` — the \`UPDATE\` did not modify the original slot at all; it wrote a fresh row elsewhere and left the original behind as a now-dead tuple.

## Bloat: logically gone, physically still there

\`DELETE\` behaves the same way — a deleted row's space is not returned to the table immediately:

\`\`\`sql
-- table with 2000 rows, each holding a decent-sized text value
DELETE FROM t WHERE id % 2 = 0;
SELECT count(*) FROM t;                 -- 1000: correctly counts only live rows
SELECT pg_relation_size('t');           -- unchanged from before the delete
\`\`\`

\`count(*)\` correctly reflects only the rows still visible — MVCC visibility rules (Module 9) mean dead tuples are simply skipped by ordinary queries. But the table's on-disk size does **not** shrink to match: the physical pages that held the deleted rows are still allocated to the table, just now containing dead space. A table that is updated or deleted from constantly, without ever being cleaned up, keeps growing physically even while its logical row count stays flat or shrinks — this is **table bloat**, and it slows down every sequential scan (more pages to read for the same useful data) and wastes disk space indefinitely.

## What \`VACUUM\` does

\`VACUUM\` scans a table, identifies dead tuples no longer visible to any current or future transaction, and marks their space reusable by future \`INSERT\`s and \`UPDATE\`s — this is how the space bloat above eventually gets reclaimed (in place; a plain \`VACUUM\` does not shrink the file on disk, it just makes the space inside it reusable, unlike \`VACUUM FULL\`, which rewrites the whole table more aggressively but takes a much heavier lock). \`VACUUM\` is also what maintains the **visibility map** Lesson 3 introduced — the structure that lets an \`Index Only Scan\` trust that a page's rows are all visible without checking the table itself.

In production PostgreSQL, **\`autovacuum\`** runs this automatically in the background, triggered once a table accumulates enough dead tuples relative to its size. The practical risk is a table whose write rate outpaces autovacuum's default thresholds and scheduling — heavy, bursty write traffic can leave a table meaningfully bloated between autovacuum runs, which is why production tuning sometimes lowers a specific table's autovacuum thresholds (Module 12 covers this configuration directly) rather than relying on the defaults everywhere.

## Selectivity, revisited: the same index, two different outcomes

Lesson 1 introduced the idea that an index only helps a *selective* condition. The same index can be used for one query and ignored for another on the very same column, depending purely on how selective each query's condition is:

\`\`\`sql
CREATE INDEX ON t (is_deleted);   -- 1% of rows true, 99% false
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE is_deleted = true;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE is_deleted = false;
\`\`\`
\`\`\`
Index Scan using t_is_deleted_idx on t
  Index Cond: (is_deleted = true)

Seq Scan on t
  Filter: (NOT is_deleted)
\`\`\`

The **rare** value (\`true\`, 1% of rows) is exactly the shape of query an index accelerates; the **common** value (\`false\`, 99% of rows) gets a sequential scan regardless, because the index would need to follow pointers to almost every row anyway. This is worth internalizing precisely because it means "is this column indexed" is the wrong question — the right question is "is *this specific query's condition* selective enough for that index to help."

## When NOT to index: a checklist

- The condition typically matches a **large fraction** of the table (low selectivity) — the planner will rightly ignore the index anyway.
- The column is **rarely or never** actually filtered, joined, or sorted on by real queries — the index is pure write-time overhead with no offsetting benefit.
- The table is **write-heavy** and the column in question is only occasionally queried — weigh the write cost against how often the read benefit actually gets used.
- An **existing** index already serves the same queries (e.g., a composite index's leading columns already cover what a narrower index would) — a redundant index doubles the write cost for no new read benefit.

Indexing is never free, in either direction: too few indexes leaves real, frequent queries doing full scans; too many indexes silently taxes every write and inflates storage, often for indexes nobody's query plan ever actually chooses. The discipline from Lesson 1 — index based on observed, specific query patterns, not speculation — is the same discipline that tells you when to stop.`,

    contentHi: `## \`UPDATE\` aur \`DELETE\` asal mein kya chhoड़te hain

Module 9 ke MVCC lesson ne establish kiya ki PostgreSQL kabhi ek row ko jagah par overwrite nahi karta: ek \`UPDATE\` ek bilkul nayi row version likhta hai aur purani ko invalid maark karta hai; ek \`DELETE\` ek row ko invalid maark karta hai bina turant iski space reclaim kiye. Dono ek **dead tuple** chhoड़ jaते hain.

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, val int);
INSERT INTO t VALUES (1, 100);
SELECT ctid, val FROM t WHERE id = 1;
UPDATE t SET val = 200 WHERE id = 1;
SELECT ctid, val FROM t WHERE id = 1;
\`\`\`
\`\`\`
 ctid  | val
-------+-----
 (0,1) | 100
(1 row)

 ctid  | val
-------+-----
 (0,2) | 200
(1 row)
\`\`\`

Row ka \`ctid\` (iski physical location) \`(0,1)\` se \`(0,2)\` mein badla — \`UPDATE\` ne original slot ko bilkul modify nahi kiya; isne kahin aur ek taazi row likhi.

## Bloat: logically gaayab, physically abhi bhi wahaan

\`DELETE\` bhi wahi tarike se behave karta hai:

\`\`\`sql
DELETE FROM t WHERE id % 2 = 0;
SELECT count(*) FROM t;                 -- 1000: sahi se sirf live rows count karta hai
SELECT pg_relation_size('t');           -- delete se pehle jaisा hi unchanged
\`\`\`

\`count(*)\` sahi se sirf abhi bhi visible rows reflect karta hai. Par table ka on-disk size **nahi** ghataता: physical pages jo deleted rows rakhते the abhi bhi table ko allocated hain. Ek table jo lgatar update ya delete se guzarta hai, kabhi clean-up hue bina, physically badhta hi jaata hai — ye **table bloat** hai.

## \`VACUUM\` kya karta hai

\`VACUUM\` ek table scan karta hai, dead tuples identify karta hai jo ab kisī current ya future transaction ko visible nahi, aur unki space ko future \`INSERT\`s aur \`UPDATE\`s ke liye reusable maark karta hai. \`VACUUM\` wahi hai jo Lesson 3 ke **visibility map** ko bhi maintain karta hai.

Production PostgreSQL mein, **\`autovacuum\`** ise automatically background mein chalाता hai. Practical risk ek aisa table hai jiski write rate autovacuum ke default thresholds ko outpace kar deती hai.

## Selectivity, dobara: wahi index, do alag outcomes

\`\`\`sql
CREATE INDEX ON t (is_deleted);   -- 1% rows true, 99% false
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE is_deleted = true;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE is_deleted = false;
\`\`\`
\`\`\`
Index Scan using t_is_deleted_idx on t
  Index Cond: (is_deleted = true)

Seq Scan on t
  Filter: (NOT is_deleted)
\`\`\`

**Rare** value (\`true\`) theek wo shape hai jo ek index accelerate karta hai; **common** value (\`false\`) ek sequential scan paata hai chahe bhi.

## Kab index NAHI karna: ek checklist

- Condition typically table ke ek **badे hisse** se match karti hai (low selectivity).
- Column ko real queries dwara **shАyad hi** kabhi filter, join, ya sort kiya jaata hai.
- Table **write-heavy** hai aur column bhi occasionally query hota hai.
- Ek **existing** index pehle se wahi queries serve karta hai.

Indexing kisi bhi disha mein kabhi free nahi hai: bahut kam indexes real, frequent queries ko full scans karne detी hain; bahut zyada indexes chupचap har write ko tax karti hain.`,

    examples: [
      {
        title: 'An UPDATE writes a new row version, leaving the old one as a dead tuple',
        titleHi: 'Ek UPDATE ek nayi row version likhta hai, purani ko ek dead tuple ke roop mein chhoड़ते hue',
        code: `CREATE TABLE t (id int PRIMARY KEY, val int);
INSERT INTO t VALUES (1, 100);
SELECT ctid, val FROM t WHERE id = 1;
UPDATE t SET val = 200 WHERE id = 1;
SELECT ctid, val FROM t WHERE id = 1;`,
        output: ` ctid  | val
-------+-----
 (0,1) | 100
(1 row)

 ctid  | val
-------+-----
 (0,2) | 200
(1 row)`,
        explain: "The row's `ctid` moves from `(0,1)` to `(0,2)` after the `UPDATE` — direct, observable proof that PostgreSQL wrote a brand-new row version at a new physical location rather than modifying the original in place. The original `(0,1)` slot is now a dead tuple: invisible to every future query, but still occupying its page until `VACUUM` reclaims it.",
        explainHi: 'Row ka `ctid` `UPDATE` ke baad `(0,1)` se `(0,2)` mein move hota hai — direct, observable proof ki PostgreSQL ne ek naye physical location par ek bilkul nayi row version likhi, original ko jagah par modify karne ke bajaye. Original `(0,1)` slot ab ek dead tuple hai: har future query ke liye invisible, par abhi bhi apna page occupy karте hue jab tak `VACUUM` ise reclaim nahi karta.',
      },
      {
        title: 'DELETE reduces the live row count but does not shrink the table\'s physical size',
        titleHi: 'DELETE live row count ghataता hai par table ka physical size nahi ghataता',
        code: `CREATE TABLE t (id int PRIMARY KEY, val text);
INSERT INTO t SELECT g, repeat('x', 100) FROM generate_series(1, 2000) g;
SELECT pg_relation_size('t') AS size_before_delete;
DELETE FROM t WHERE id % 2 = 0;
SELECT count(*) AS rows_remaining FROM t;
SELECT pg_relation_size('t') AS size_after_delete;`,
        output: ` size_before_delete
--------------------
 286720
(1 row)

 rows_remaining
----------------
 1000
(1 row)

 size_after_delete
-------------------
 286720
(1 row)`,
        explain: "`pg_relation_size('t')` reports the identical byte count, `286720`, both before and after the `DELETE`, even though `count(*)` correctly drops from 2000 to 1000 live rows — the deleted rows' pages are still allocated to the table as dead tuples, not yet returned for reuse; only `VACUUM` would change the size-relevant picture, and even then by making space reusable rather than necessarily shrinking the file.",
        explainHi: "`pg_relation_size('t')` `DELETE` se pehle aur baad dono mein identical byte count report karta hai, `286720`, chahe `count(*)` sahi se 2000 se 1000 live rows tak gir jaata hai — deleted rows ke pages abhi bhi table ko dead tuples ke roop mein allocated hain, abhi tak reuse ke liye wapas nahi diye gaye; sirf `VACUUM` size-relevant tasveer badalega, aur tab bhi space ko reusable banакर, zaroori nahi ki file ko chhota karके.",
      },
      {
        title: 'The same index on a boolean column is used for the rare value, ignored for the common one',
        titleHi: 'Ek boolean column par wahi index rare value ke liye istemal hota hai, common ke liye ignore',
        code: `CREATE TABLE t (id int PRIMARY KEY, is_deleted boolean);
INSERT INTO t SELECT g, (g % 100 = 0) FROM generate_series(1, 2000) g;
CREATE INDEX ON t (is_deleted);
ANALYZE t;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE is_deleted = true;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE is_deleted = false;`,
        output: ` QUERY PLAN
----------------------------------------
 Index Scan using t_is_deleted_idx on t
   Index Cond: (is_deleted = true)
(2 rows)

 QUERY PLAN
----------------------------
 Seq Scan on t
   Filter: (NOT is_deleted)
(2 rows)`,
        explain: "The exact same `t_is_deleted_idx` index produces two different outcomes on the same column: for the rare `true` value (1% of rows), it's used directly (`Index Scan`); for the common `false` value (99% of rows), the planner correctly ignores it and falls back to `Seq Scan` with `Filter: (NOT is_deleted)`, since following the index for a condition matching almost the whole table would cost more than one direct pass.",
        explainHi: 'Theek wahi `t_is_deleted_idx` index usī column par do alag outcomes produce karta hai: rare `true` value (1% rows) ke liye, ye seedhe istemal hota hai (`Index Scan`); common `false` value (99% rows) ke liye, planner sahi se ise ignore karta hai aur `Seq Scan` par `Filter: (NOT is_deleted)` ke saath fall back karta hai, kyunki lgbhag poori table se match karti ek condition ke liye index follow karna ek direct pass se zyada mehanga hoga.',
      },
    ],

    mistakes: [
      {
        wrong: `-- assuming DELETE (or UPDATE) immediately frees disk space
DELETE FROM logs WHERE created_at < now() - interval '90 days';
-- "great, that should free up a lot of disk space" -- checks disk usage --
-- usage is UNCHANGED -- the deleted rows' pages are now dead space, not free space`,
        right: `-- disk usage is reclaimed (made reusable, not necessarily shrunk) by VACUUM,
-- which normally runs automatically via autovacuum soon after a large delete:
-- (in a genuinely urgent case, VACUUM FULL physically shrinks the file, but
-- takes an exclusive lock on the table for its duration -- use deliberately)
VACUUM logs;   -- (run standalone, outside any transaction block)`,
        why: 'DELETE only marks rows as no longer visible to future transactions; it does not physically remove their data from the table\'s pages, because MVCC (Module 9) may still require an already-in-progress transaction to see the pre-delete state for a while longer. The freed-up pages remain allocated to the table as dead space until VACUUM specifically walks the table, confirms those rows are no longer visible to anyone, and marks that space reusable. This means a large DELETE does not shrink measured disk usage on its own; the disk usage number only comes down (or, more precisely, becomes reusable for new rows without growing the file further) once VACUUM has actually run, whether triggered automatically by autovacuum or manually.',
        whyHi: '`DELETE` sirf rows ko future transactions ke liye ab visible na hone ke roop mein maark karta hai; ye unke data ko table ke pages se physically nahi hataता, kyunki MVCC (Module 9) ko abhi bhi ek pehle-se-chal-rahे transaction ko pre-delete state dikhaने ki zaroorat ho sakti hai. Freed-up pages table ko dead space ke roop mein allocated rehte hain jab tak `VACUUM` specifically table ko walk nahi karta.',
      },
      {
        wrong: `-- checking whether an index "exists" instead of whether THIS query's condition is selective
CREATE INDEX ON orders (status);
-- "status is indexed, so any query filtering on status will be fast"
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE status = 'active';   -- 90% of rows
-- Seq Scan anyway -- "indexed" doesn't mean "every query on it is accelerated"`,
        right: `-- ask about the SPECIFIC query's selectivity, not just "is there an index":
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE status = 'refunded';   -- rare value
-- Index Scan -- the SAME index helps here because THIS condition is selective`,
        why: 'Whether the planner uses an available index is decided per query, based on how selective that specific query\'s condition is against the table\'s actual data distribution, not based on whether an index merely exists on the column being filtered. A single index on a column can be used for one value and ignored for another value on that very same column, if one value is rare and the other is common, because the cost of following an index for a condition matching most of the table exceeds the cost of simply scanning the table directly. Treating "is this column indexed" as the deciding question rather than "is this specific condition selective enough" leads to false confidence that a query will be fast, when in reality the planner may correctly bypass the index for that particular query while still using it for a different, rarer condition on the same column.',
        whyHi: 'Kya planner ek available index istemal karta hai ye prati-query decide hota hai, is aadhaar par ki wo specific query ki condition table ke actual data distribution ke against кितni selective hai, na ki is aadhaar par ki kya index sirf column par exist karta hai. Ek single index ek value ke liye istemal ho sakta hai aur usi column par ek doosri value ke liye ignore ho sakta hai.',
      },
      {
        wrong: `-- adding an index to "help" a table, without checking if a similar index already exists
CREATE INDEX ON orders (customer_id);
-- ... months later, unaware a composite index already covers this:
CREATE INDEX ON orders (customer_id, created_at);   -- already serves customer_id-only queries too!
-- now TWO indexes are maintained on every write, for no additional read benefit`,
        right: `-- check existing indexes before adding a new one -- a composite index's
-- LEADING columns already serve as their own usable prefix (Lesson 3):
-- \\d orders   (in psql, or SELECT * FROM pg_indexes WHERE tablename = 'orders')
-- if (customer_id, created_at) already exists, a separate (customer_id) index
-- is redundant -- it can usually just be dropped`,
        why: 'A composite index already serves any query that constrains a leading prefix of its columns, so a composite index on (customer_id, created_at) already accelerates a query filtering on customer_id alone just as well as a dedicated single-column index on customer_id would. Adding that single-column index anyway, without first checking what already exists, creates a genuinely redundant structure: every insert, update, or delete touching customer_id now maintains two separate index entries instead of one, paying real ongoing write cost, while gaining no read-time benefit the composite index was not already providing. Checking a table\'s existing indexes before adding a new one, and specifically checking whether a new index\'s intended use case is already covered by an existing composite index\'s leading columns, avoids this class of pure waste.',
        whyHi: 'Ek composite index pehle se kisī bhi query ko serve karta hai jo iske columns ke ek leading prefix ko constrain karti hai, to `(customer_id, created_at)` par ek composite index pehle se akele `customer_id` par filter karti ek query ko utni hi achhi tarah accelerate karta hai jitna ek dedicated single-column index karega. Wo single-column index phir bhi add karna, pehle ye check kiye bina ki kya pehle se maujood hai, ek genuinely redundant structure banata hai.',
      },
    ],

    realWorld: [
      {
        en: '**A DBA runbook step "check `pg_stat_user_tables.n_dead_tup` before a big migration"** — a table already carrying heavy bloat is a common, avoidable cause of a migration running far slower than expected.',
        hi: '**Ek DBA runbook step "ek badे migration se pehle `pg_stat_user_tables.n_dead_tup` check karo"** — pehle se bhaari bloat rakhता ek table ek migration ke expected se bahut slow chalne ka ek common, avoidable कारण hai.',
      },
      {
        en: '**A quarterly schema audit querying `pg_stat_user_indexes.idx_scan` to find indexes that have NEVER been used**, then dropping them to reduce write-path overhead — the production analogue of this lesson\'s "check before you add" mistake, run in reverse.',
        hi: '**Ek quarterly schema audit jo `pg_stat_user_indexes.idx_scan` query karta hai un indexes ko dhoondне ke liye jo KABHI istemal nahi hue**, phir write-path overhead kam karne ke liye unhe drop karta hai.',
      },
      {
        en: '**Tuning a specific high-churn table\'s `autovacuum_vacuum_scale_factor` lower than the cluster default** (Module 12) so a queue table that is constantly inserted into and deleted from gets vacuumed far more often than a mostly-static reference table would need.',
        hi: '**Ek specific high-churn table ke `autovacuum_vacuum_scale_factor` ko cluster default se kam tune karna** taaki ek queue table jise lगातार insert aur delete kiya jaata hai bahut zyada aksar vacuum ho.',
      },
    ],

    interviewQA: [
      {
        q: 'Why doesn\'t a DELETE (or an UPDATE) immediately shrink a table\'s disk usage, and what does VACUUM actually do about it?',
        qHi: 'Ek `DELETE` (ya ek `UPDATE`) turant ek table ka disk usage kyun nahi ghataता, aur `VACUUM` iske baare mein asal mein kya karta hai?',
        a: 'PostgreSQL\'s MVCC design, covered in Module 9, means a row is never modified or removed in place while any transaction might still legitimately need to see its prior state: a DELETE marks a row as no longer visible going forward rather than erasing its bytes, and an UPDATE writes an entirely new row version elsewhere while marking the old version invalid rather than overwriting it. Either way, the physical space the old or deleted row occupied remains allocated to the table as what is called a dead tuple, invisible to new queries but still taking up a page. Because of this, deleting or updating a large number of rows does not, by itself, shrink the table\'s measured disk usage; the pages are still there, just holding dead rather than live data. VACUUM is the process that walks through a table, determines which dead tuples are no longer visible to any current or future transaction, and marks their space reusable for future inserts and updates, which is how that space eventually gets reclaimed for reuse; in production this typically happens automatically via autovacuum, triggered once a table\'s dead tuple count crosses a threshold, though a write-heavy table can sometimes accumulate bloat faster than autovacuum keeps up with, which is why specific tables sometimes need their autovacuum settings tuned individually.',
        aHi: 'PostgreSQL ka MVCC design, Module 9 mein cover kiya gaya, matlab hai ek row kabhi jagah par modify ya remove nahi hoती jabki koi bhi transaction abhi bhi legitimately iski prior state dekhne ki zaroorat rakh sakta ho: ek `DELETE` ek row ko aage se ab visible na hone ke roop mein maark karta hai iske bytes erase karne ke bजाय. Isliye, badी sankhya mein rows delete ya update karna, apne aap, table ka measured disk usage nahi ghataता. `VACUUM` wo process hai jo ek table ke through chalta hai, decide karta hai kaunse dead tuples ab kisī current ya future transaction ko visible nahi, aur unki space ko future inserts aur updates ke liye reusable maark karta hai.',
      },
      {
        q: 'A column has an index, but a query filtering on that column still gets a sequential scan. What are the possible explanations, and how would you investigate?',
        qHi: 'Ek column ke paas ek index hai, par us column par filter karти ek query phir bhi ek sequential scan paati hai. Sambhavित explanations kya hain, aur aap kaise investigate karоge?',
        a: 'The most common explanation is selectivity: if the query\'s condition matches a large fraction of the table\'s rows, the planner correctly prefers a sequential scan, because following an index for a condition matching most of the table would mean jumping around the table almost as much as a direct scan would, at extra cost. The way to investigate this is to check what fraction of the table actually matches the condition, and to compare the same index\'s behavior on a rarer value on the same column, which should show the index being used, confirming the index itself is fine and the issue is purely this particular condition\'s selectivity. A second possible explanation is stale or missing statistics: if ANALYZE has never run, or has not run recently enough to reflect the table\'s current data distribution, the planner may be working from inaccurate row-count estimates and choosing badly as a result; running ANALYZE and re-checking the plan rules this in or out directly. A third possibility, specific to composite or expression indexes, is that the query\'s condition does not actually match what the index was built to serve, for instance filtering on a later column of a composite index without constraining the leading column, or filtering on a raw column when the index covers an expression applied to it; reviewing the exact index definition against the exact query condition catches this case.',
        aHi: 'Sabse common explanation selectivity hai: agar query ki condition table ki rows ke ek badे hisse se match karti hai, planner sahi se sequential scan prefer karта hai. Ise investigate karne ka tarika ye check karna hai ki table ka кितna hissa asal mein condition se match karta hai, aur usi column par ek rarer value par usī index ka behavior compare karна, jo index istemal hote dikhaना chahiye. Doosra sambhavित explanation stale ya missing statistics hai. Teesri possibility, composite ya expression indexes ke liye specific, ye hai ki query ki condition asal mein wahi nahi match karti jo index serve karne ke liye bana thа.',
      },
    ],

    exercises: [
      {
        task: 'Table `t(id int PRIMARY KEY, val int)`, insert one row `(1, 100)`. Select `ctid, val`, then `UPDATE t SET val = 200 WHERE id = 1`, then select `ctid, val` again. Confirm the `ctid` changed and explain in a comment why the original slot is now a "dead tuple".',
        taskHi: 'Table `t(id, val)`, ek row `(1, 100)` insert karo. `ctid, val` select karo, phir `UPDATE t SET val = 200 WHERE id = 1`, phir dobara `ctid, val` select karo. Confirm karo `ctid` badla aur ek comment mein samjhaओ ki original slot ab ek "dead tuple" kyun hai.',
        hint: 'PostgreSQL never modifies a row in place — an UPDATE writes a brand new row version at a new physical location and marks the old one invalid, which is why `ctid` changes and the old slot becomes a dead tuple until VACUUM reclaims it.',
        hintHi: 'PostgreSQL kabhi ek row ko jagah par modify nahi karta — ek `UPDATE` ek naye physical location par ek bilkul nayi row version likhta hai aur purani ko invalid maark karta hai.',
      },
      {
        task: 'Table `t(id int PRIMARY KEY, val text)` with 2000 rows of decent-sized text. Check `pg_relation_size(\'t\')`, `DELETE` half the rows, check `count(*)` (should drop) and `pg_relation_size(\'t\')` again (should NOT drop). Explain in a comment what this demonstrates.',
        taskHi: 'Table `t(id, val)` 2000 rows decent-sized text ke saath. `pg_relation_size(\'t\')` check karo, aadhi rows `DELETE` karo, `count(*)` (girna chahiye) aur dobara `pg_relation_size(\'t\')` (NAHI girna chahiye) check karo.',
        hint: 'This demonstrates table bloat: DELETE removes rows logically (count(*) reflects it immediately via MVCC visibility) but not physically (the disk space isn\'t reclaimed until VACUUM runs).',
        hintHi: 'Ye table bloat demonstrate karta hai: `DELETE` rows ko logically hataता hai par physically nahi (disk space `VACUUM` chalne tak reclaim nahi hoती).',
      },
      {
        task: 'Table `t(id int PRIMARY KEY, is_deleted boolean)` with 2000 rows, 1% `true` and 99% `false`. Create an index on `is_deleted`, `ANALYZE`, and compare `EXPLAIN (COSTS OFF)` for `WHERE is_deleted = true` versus `WHERE is_deleted = false`.',
        taskHi: 'Table `t(id, is_deleted)` 2000 rows ke saath, 1% `true` aur 99% `false`. `is_deleted` par ek index banao, `ANALYZE`, aur `WHERE is_deleted = true` versus `WHERE is_deleted = false` ke liye `EXPLAIN (COSTS OFF)` compare karo.',
        hint: 'The rare `true` value (1%) gets an `Index Scan`; the common `false` value (99%) gets a `Seq Scan` — same index, same column, opposite outcomes, purely because of each query\'s selectivity.',
        hintHi: 'Rare `true` value (1%) ko ek `Index Scan` milta hai; common `false` value (99%) ko ek `Seq Scan` milta hai — wahi index, wahi column, opposite outcomes, sirf har query ki selectivity ki wajah se.',
      },
    ],

    keyTakeaways: [
      'PostgreSQL NEVER modifies a row in place: `UPDATE` writes a new row version elsewhere and marks the old one invalid; `DELETE` marks a row invalid without erasing it. Both leave a DEAD TUPLE — confirmed directly by watching `ctid` change after an `UPDATE`.',
      'BLOAT: `DELETE`/`UPDATE` reduce the LOGICAL row count (`count(*)` reflects it immediately via MVCC visibility) but do NOT shrink the table\'s PHYSICAL size — dead tuples keep occupying pages until reclaimed. A table churned constantly without cleanup grows physically even as its live row count stays flat.',
      '`VACUUM` scans the table, confirms which dead tuples are invisible to every current/future transaction, and marks that space REUSABLE (not necessarily shrinking the file — that\'s `VACUUM FULL`, which takes a heavy lock). `VACUUM` (not `ANALYZE`) is also what maintains the VISIBILITY MAP that `Index Only Scan` depends on (Lesson 3).',
      '`autovacuum` runs `VACUUM` automatically in the background once a table crosses a dead-tuple threshold — but a write-heavy, bursty table can outpace the defaults, motivating per-table autovacuum tuning in production (Module 12).',
      'SELECTIVITY IS PER-QUERY, NOT PER-COLUMN: the SAME index on a column can be used for a RARE value (`Index Scan`) and ignored for a COMMON value (`Seq Scan`) on that very same column. "Is this column indexed" is the wrong question — "is THIS query\'s condition selective enough" is the right one.',
      'WHEN NOT TO INDEX: condition matches a large fraction of rows (low selectivity) — column rarely/never filtered/joined/sorted on in practice — table is write-heavy with only occasional reads on that column — an EXISTING index (e.g. a composite index\'s leading columns) already covers the same query shape, making a new one purely redundant write-cost.',
      'Both directions of imbalance are real costs: too few indexes means real frequent queries do full scans; too many silently taxes every write and inflates storage for indexes no query plan ever actually picks. Index based on OBSERVED patterns — the same discipline from Lesson 1 tells you both when to add one and when to stop.',
    ],
    keyTakeawaysHi: [
      'PostgreSQL ek row ko KABHI jagah par modify nahi karta: `UPDATE` kahin aur ek nayi row version likhta hai aur purani ko invalid maark karta hai; `DELETE` ek row ko invalid maark karta hai use erase kiye bina. Dono ek DEAD TUPLE chhoड़te hain — `UPDATE` ke baad `ctid` badalte hue seedhे confirm kiya gaya.',
      'BLOAT: `DELETE`/`UPDATE` LOGICAL row count ghataте hain par table ka PHYSICAL size nahi ghataте — dead tuples reclaim hone tak pages occupy karте rehte hain.',
      '`VACUUM` table scan karta hai, confirm karta hai kaunse dead tuples har current/future transaction ke liye invisible hain, aur us space ko REUSABLE maark karta hai. `VACUUM` (`ANALYZE` nahi) wo bhi hai jo VISIBILITY MAP maintain karta hai jispar `Index Only Scan` depend karta hai (Lesson 3).',
      '`autovacuum` background mein automatically `VACUUM` chalाता hai jab ek table ek dead-tuple threshold cross karta hai — par ek write-heavy, bursty table defaults ko outpace kar sakta hai.',
      'SELECTIVITY PRATI-QUERY HAI, PRATI-COLUMN NAHI: ek column par WAHI index ek RARE value ke liye istemal ho sakta hai aur usi column par ek COMMON value ke liye ignore ho sakta hai. "Kya ye column indexed hai" galat sawaal hai — "kya IS query ki condition kaafi selective hai" sahi sawaal hai.',
      'KAB INDEX NAHI KARNA: condition rows ke ek badे hisse se match karti hai — column practice mein shАyad hi filter/join/sort hota hai — table write-heavy hai — ek EXISTING index pehle se wahi query shape cover karta hai.',
      'Imbalance ki dono directions real costs hain: bahut kam indexes real frequent queries ko full scans karne detी hain; bahut zyada chupचap har write ko tax karti hain. OBSERVED patterns ke aadhaar par index karo.',
    ],
  },

  {
    slug: 'sql-joins-plans-and-the-tuning-workflow',
    title: 'Joins, Plans, and the Tuning Workflow',
    titleHi: 'Joins, Plans, Aur Tuning Workflow',
    description: 'The planner chooses among several join strategies — Nested Loop, Hash Join, Merge Join — based on table sizes, available indexes, and statistics. Reading why it chose one, and knowing the end-to-end workflow for tuning a slow query, closes out everything this module and this SQL-core arc have built toward.',
    descriptionHi: 'Planner kई join strategies mein se chunta hai — Nested Loop, Hash Join, Merge Join — table sizes, available indexes, aur statistics ke aadhaar par. Ye padhна ki isne ek kyun chuna, aur ek slow query ko tune karne ka end-to-end workflow jaanна, is module aur is poore SQL-core arc ko band karta hai.',
    difficulty: 'HARD',
    duration: 28,
    order: 6,

    analogy: {
      en: '**Matching wedding guests to their assigned tables, three different ways.** Imagine a small group of five VIP guests, each needing to be matched to their table from a guest list of two thousand names. If the guest list is roughly sorted or has an index card box, the fastest approach is obvious: for each of the five VIPs, one at a time, flip straight to their card and read off their table — five quick, targeted lookups. That is a **Nested Loop**: for each row on the small side, probe the other side directly, cheap precisely because there are few outer rows and each probe is fast. Now imagine the reverse: matching all two thousand guests against all two thousand tables at once, with no help from any sorted list. Flipping through the whole guest list once *per guest* would be absurd. Instead, a sensible worker builds a quick lookup structure first — an actual hash map from name to table, thrown together on the spot — then walks the guest list exactly once, checking each name against that structure. That is a **Hash Join**: build a fast in-memory structure from the smaller side once, then stream the larger side past it a single time. And now imagine both lists happen to already be sorted alphabetically for some unrelated reason — a printed program, say. Rather than building any new structure at all, two people can walk down both lists together with two fingers, advancing whichever finger is behind, and match names as they align — no lookup structure needed, because the existing order already does the work. That is a **Merge Join**, and it is why the planner is not choosing arbitrarily: it is recognizing which of these three matching tricks is cheapest given the two guest lists it actually has in front of it.',
      hi: '**Shaadi ke guests ko unke assigned tables se match karna, teen alag tarikon se.** Kalpना karo paанch VIP guests ka ek chhota group hai, har ek ko do hazar naamon ki ek guest list se apne table se match karna hai. Agar guest list roughly sorted hai ya iska ek index card box hai, sabse fast approach saaf hai: paанchon VIPs mein se har ek ke liye, ek-ek karके, seedhе unke card tak flip karo aur unka table padhо. Ye ek **Nested Loop** hai. Ab viparit soचो: sabhi do hazar guests ko sabhi do hazar tables se ek saath match karna, kisī sorted list ki madad ke bina. Iske bजаय, ek sensible worker pehle ek jaldi lookup structure banata hai — naam se table tak ek actual hash map, turant banaya gaya — phir guest list ko theek ek baar chalta hai. Ye ek **Hash Join** hai. Aur ab kalpना karo dono lists kisī unrelated wajah se pehle se alphabetically sorted hain. Naya koi structure banane ke bजаय, do log dono lists ko saath do ungliyon se chala sakte hain. Ye ek **Merge Join** hai.',
    },

    simple: `**Nested Loop — for each row on the (small) outer side, probe the inner side directly**

\`\`\`sql
-- ord.cust_id IS indexed:
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id WHERE c.id = 5;
\`\`\`
\`\`\`
Nested Loop
  ->  Seq Scan on cust c
        Filter: (id = 5)
  ->  Bitmap Heap Scan on ord o
        Recheck Cond: (cust_id = 5)
        ->  Bitmap Index Scan on ord_cust_id_idx
              Index Cond: (cust_id = 5)
-- outer side: 1 matching customer. Inner side: probed via its INDEX, once.
\`\`\`

**Same query, but \`ord.cust_id\` has NO index — the join strategy stays Nested Loop, but the inner scan changes**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id WHERE c.id = 5;
\`\`\`
\`\`\`
Nested Loop
  ->  Seq Scan on cust c
        Filter: (id = 5)
  ->  Seq Scan on ord o
        Filter: (cust_id = 5)
-- still ONE outer row, so Nested Loop is still sensible -- but the inner side
-- now has to scan ALL of ord looking for cust_id = 5, since there's no index
\`\`\`

**Hash Join — no selective filter at all: joining EVERY row of both tables**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id;
\`\`\`
\`\`\`
Hash Join
  Hash Cond: (o.cust_id = c.id)
  ->  Seq Scan on ord o
  ->  Hash
        ->  Seq Scan on cust c
-- build a hash table from the SMALLER side (cust) ONCE, then stream the
-- larger side (ord) past it a SINGLE time -- much cheaper than probing
-- cust once per every one of ord's 2000 rows
\`\`\`

**THE TUNING WORKFLOW, end to end**
\`\`\`
1. EXPLAIN ANALYZE the slow query
2. Find the node with the biggest estimate-vs-actual gap, or the largest time share
3. Diagnose: missing index? stale stats (ANALYZE)? wrong join strategy given bad
   estimates? a query shape the planner can't optimize (rewrite it)?
4. Make ONE change
5. Re-run EXPLAIN ANALYZE -- confirm it actually helped -- repeat if not done
\`\`\``,

    simpleHi: `**Nested Loop — (chhotе) outer side ki har row ke liye, seedhe inner side probe karo**

\`\`\`sql
-- ord.cust_id INDEXED hai:
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id WHERE c.id = 5;
\`\`\`
\`\`\`
Nested Loop
  ->  Seq Scan on cust c
        Filter: (id = 5)
  ->  Bitmap Heap Scan on ord o
        Recheck Cond: (cust_id = 5)
        ->  Bitmap Index Scan on ord_cust_id_idx
              Index Cond: (cust_id = 5)
\`\`\`

**Wahi query, par \`ord.cust_id\` par koi index NAHI — join strategy Nested Loop hi rehта hai, par inner scan badalta hai**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id WHERE c.id = 5;
\`\`\`
\`\`\`
Nested Loop
  ->  Seq Scan on cust c
        Filter: (id = 5)
  ->  Seq Scan on ord o
        Filter: (cust_id = 5)
\`\`\`

**Hash Join — koi selective filter bilkul nahi: dono tables ki HAR row join karна**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id;
\`\`\`
\`\`\`
Hash Join
  Hash Cond: (o.cust_id = c.id)
  ->  Seq Scan on ord o
  ->  Hash
        ->  Seq Scan on cust c
\`\`\`

**TUNING WORKFLOW, end to end**
\`\`\`
1. Slow query par EXPLAIN ANALYZE chalao
2. Sabse bade estimate-vs-actual gap, ya sabse bade time share waala node dhoondo
3. Diagnose karo: missing index? stale stats? galat join strategy?
4. EK change karo
5. EXPLAIN ANALYZE dobara chalao -- confirm karo ki madad hui -- agar nahi to dohराओ
\`\`\``,

    content: `## Three join strategies

When joining two tables, PostgreSQL's planner chooses among (primarily) three strategies, based on table sizes, available indexes, and statistics — not arbitrarily, and this lesson closes the module by tying every prior lesson's tools together to understand why.

### Nested Loop: for each outer row, probe the inner side

\`\`\`sql
CREATE TABLE cust (id int PRIMARY KEY, name text);
CREATE TABLE ord (id int PRIMARY KEY, cust_id int, amt int);
CREATE INDEX ON ord (cust_id);
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id WHERE c.id = 5;
\`\`\`
\`\`\`
Nested Loop
  ->  Seq Scan on cust c
        Filter: (id = 5)
  ->  Bitmap Heap Scan on ord o
        Recheck Cond: (cust_id = 5)
        ->  Bitmap Index Scan on ord_cust_id_idx
              Index Cond: (cust_id = 5)
\`\`\`

Reading this tree per Lesson 2's rule (deepest node first): the outer side (\`cust\`, filtered to one matching row) runs first; for **that one row**, the inner side (\`ord\`) is probed — and because \`ord.cust_id\` is indexed, that probe is a fast, targeted index lookup. Nested Loop is cheap precisely when the outer side produces few rows, since the inner side's cost is paid once *per outer row*.

### The same query, without an index on the join column

\`\`\`sql
-- ord.cust_id has NO index this time
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id WHERE c.id = 5;
\`\`\`
\`\`\`
Nested Loop
  ->  Seq Scan on cust c
        Filter: (id = 5)
  ->  Seq Scan on ord o
        Filter: (cust_id = 5)
\`\`\`

The **join strategy itself** (Nested Loop) doesn't change — with only one outer row, probing the inner side once is still the sensible plan shape. What changes is **how** that one probe is carried out: without an index, the inner side has to sequentially scan the whole \`ord\` table looking for \`cust_id = 5\`, rather than jumping straight there via an index. This is the clearest possible illustration of Lesson 2's point that plan *shape* (which join strategy) and a node's *own* scan method are separate questions, each shaped by what indexes exist.

### Hash Join: build once from the smaller side, stream the larger side past it

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id;
\`\`\`
\`\`\`
Hash Join
  Hash Cond: (o.cust_id = c.id)
  ->  Seq Scan on ord o
  ->  Hash
        ->  Seq Scan on cust c
\`\`\`

With no \`WHERE\` filter at all, this join has to match **every** row of \`cust\` against **every** row of \`ord\` — a Nested Loop here would mean scanning all of \`ord\` once *per row of \`cust\`*, which is expensive for anything but tiny tables. A Hash Join instead builds an in-memory hash table from the smaller side (\`cust\`, under the \`Hash\` node) exactly once, then reads through the larger side (\`ord\`) exactly once, probing the hash table for each row — turning what would be a multiplicative cost into a much cheaper additive one. Hash Join is the planner's usual choice for joining two largeish tables with no highly selective filter and no useful sort order to exploit.

### Merge Join (for completeness)

A third strategy, **Merge Join**, applies when both sides of a join are already sorted (or cheaply sortable, often via an index) on the join column: it walks both sorted streams together in one pass, advancing whichever side is currently behind, much like merging two sorted lists — no hash table needed, because the existing order already aligns matching rows. The planner reaches for this when a sort order it needs is already available "for free," typically from an index on the join column on both sides.

## The end-to-end tuning workflow

This closes out the entire ten-lesson arc: every tool from every lesson in this module feeds into one repeatable loop for diagnosing and fixing a slow query.

1. **Run \`EXPLAIN ANALYZE\`** on the slow query (Lesson 2) — never guess from the query's text alone.
2. **Find the worst node**: the one with the largest gap between estimated and actual rows, or the one consuming the largest share of total time.
3. **Diagnose why**:
   - No index on a column a query filters, joins, or sorts on selectively? (Lessons 1, 3 — consider a plain, composite, partial, or expression index, or a specialized type from Lesson 4 if the data shape calls for it.)
   - Statistics stale or missing? Run \`ANALYZE\`.
   - A join choosing a poor strategy because an upstream estimate was wrong? Fixing the upstream estimate (usually via \`ANALYZE\`, or an index that improves selectivity) often fixes the join choice too, since the planner's join decision depends entirely on those row-count estimates.
   - Heavy write-side cost from unused or redundant indexes slowing down the writes feeding this table? (Lesson 5.)
   - A query shape the planner fundamentally can't optimize well as written? Consider rewriting it (Module 5's subquery/CTE/join equivalences are often relevant here).
4. **Make exactly one change.** Changing several things at once makes it impossible to know which change actually helped, or whether one change's benefit was offset by another's cost.
5. **Re-run \`EXPLAIN ANALYZE\`** to confirm the change genuinely helped, not just that the plan "looks different." If the query is still slow, return to step 2.

This loop — measure, diagnose with the right tool for the specific symptom, change one thing, re-measure — is the entire discipline of SQL performance tuning, and every technique from this module's six lessons is simply a specific answer to "what could step 3 be." With this, the ten-module "SQL core" arc is complete: from a single \`SELECT\` (Module 1) through joins, aggregation, subqueries, window functions, data modeling, DDL, transactions, and now indexing and performance — the full toolkit for writing correct, well-designed, and genuinely fast SQL against a real relational database.`,

    contentHi: `## Teen join strategies

Do tables join karte waqt, PostgreSQL ka planner (primarily) teen strategies mein se chunता hai, table sizes, available indexes, aur statistics ke aadhaar par.

### Nested Loop: har outer row ke liye, inner side probe karo

\`\`\`sql
CREATE TABLE cust (id int PRIMARY KEY, name text);
CREATE TABLE ord (id int PRIMARY KEY, cust_id int, amt int);
CREATE INDEX ON ord (cust_id);
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id WHERE c.id = 5;
\`\`\`
\`\`\`
Nested Loop
  ->  Seq Scan on cust c
        Filter: (id = 5)
  ->  Bitmap Heap Scan on ord o
        Recheck Cond: (cust_id = 5)
        ->  Bitmap Index Scan on ord_cust_id_idx
              Index Cond: (cust_id = 5)
\`\`\`

Lesson 2 ke niyam ke hisaab se is tree ko padhते hue (sabse gehरा node pehle): outer side (\`cust\`, ek matching row tak filtered) pehle chalta hai; **us ek row** ke liye, inner side (\`ord\`) probe hota hai.

### Wahi query, join column par ek index ke bina

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id WHERE c.id = 5;
\`\`\`
\`\`\`
Nested Loop
  ->  Seq Scan on cust c
        Filter: (id = 5)
  ->  Seq Scan on ord o
        Filter: (cust_id = 5)
\`\`\`

**Join strategy khud** (Nested Loop) nahi badалती — sirf ek outer row ke saath, inner side ko ek baar probe karна abhi bhi sensible plan shape hai. Jo badalta hai wo hai us ek probe ko **kaise** kiya jaata hai.

### Hash Join: chhoते side se ek baar banao, bade side ko usse ek baar guzaro

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id;
\`\`\`
\`\`\`
Hash Join
  Hash Cond: (o.cust_id = c.id)
  ->  Seq Scan on ord o
  ->  Hash
        ->  Seq Scan on cust c
\`\`\`

Koi \`WHERE\` filter bilkul na hone ke saath, is join ko \`cust\` ki **har** row ko \`ord\` ki **har** row se match karna hai. Ek Hash Join iske bजаय chhoते side (\`cust\`) se ek in-memory hash table theek ek baar banата hai, phir bade side (\`ord\`) ko theek ek baar padhता hai.

### Merge Join (poornatha ke liye)

Ek teesri strategy, **Merge Join**, tab apply hoती hai jab join ke dono sides pehle se sorted hain (ya sasteme sortable, aksar ek index ke through) join column par.

## End-to-end tuning workflow

Ye poore das-lesson arc ko band karta hai:

1. Slow query par **\`EXPLAIN ANALYZE\` chalao** (Lesson 2).
2. **Sabse bura node dhoondo**: sabse bade estimate-vs-actual gap waala, ya sabse zyada time share leта hua.
3. **Diagnose karo kyun**: missing index? stale statistics? galat join strategy? unused/redundant indexes? ek query shape jise planner optimize nahi kar sakta?
4. **Theek EK change karo.**
5. **\`EXPLAIN ANALYZE\` dobara chalao** confirm karne ke liye ki change ne genuinely madad ki. Agar abhi bhi slow hai, step 2 par wapas jaओ.

Ye loop — measure, sahi tool se diagnose, ek cheez badlो, dobara measure — SQL performance tuning ki poori discipline hai. Isके saath, das-module "SQL core" arc poora hota hai: ek single \`SELECT\` (Module 1) se lekar joins, aggregation, subqueries, window functions, data modeling, DDL, transactions, aur ab indexing aur performance tak — ek real relational database ke against correct, well-designed, aur genuinely fast SQL likhne ka poora toolkit.`,

    examples: [
      {
        title: 'Nested Loop with an indexed join column: the inner side is probed via its index',
        titleHi: 'Ek indexed join column ke saath Nested Loop: inner side apne index ke through probe hota hai',
        code: `CREATE TABLE cust (id int PRIMARY KEY, name text);
INSERT INTO cust SELECT g, 'c'||g FROM generate_series(1, 100) g;
CREATE TABLE ord (id int PRIMARY KEY, cust_id int, amt int);
INSERT INTO ord SELECT g, (g % 100) + 1, g FROM generate_series(1, 2000) g;
CREATE INDEX ON ord (cust_id);
ANALYZE cust; ANALYZE ord;
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id WHERE c.id = 5;`,
        output: ` QUERY PLAN
--------------------------------------------------
 Nested Loop
   ->  Seq Scan on cust c
         Filter: (id = 5)
   ->  Bitmap Heap Scan on ord o
         Recheck Cond: (cust_id = 5)
         ->  Bitmap Index Scan on ord_cust_id_idx
               Index Cond: (cust_id = 5)
(7 rows)`,
        explain: "With `c.id = 5` filtering `cust` down to exactly one row, `Nested Loop` is the natural strategy: the outer `Seq Scan on cust c` runs once, and for that single row, the inner side probes `ord`'s index directly — `Bitmap Heap Scan on ord o` fed by `Bitmap Index Scan on ord_cust_id_idx` — a single fast, targeted lookup rather than a scan of all 2000 `ord` rows.",
        explainHi: '`c.id = 5` `cust` ko theek ek row tak filter karte hue, `Nested Loop` natural strategy hai: outer `Seq Scan on cust c` ek baar chalta hai, aur us ek row ke liye, inner side seedhe `ord` ke index ko probe karta hai — `Bitmap Heap Scan on ord o` jise `Bitmap Index Scan on ord_cust_id_idx` feed karta hai — ek fast, targeted lookup, sabhi 2000 `ord` rows ke scan ke bajaye.',
      },
      {
        title: 'The same join keeps its Nested Loop shape without an index, but the inner scan changes',
        titleHi: 'Wahi join bina index ke apna Nested Loop shape rakhta hai, par inner scan badalta hai',
        code: `CREATE TABLE cust (id int PRIMARY KEY, name text);
INSERT INTO cust SELECT g, 'c'||g FROM generate_series(1, 100) g;
CREATE TABLE ord (id int PRIMARY KEY, cust_id int, amt int);
INSERT INTO ord SELECT g, (g % 100) + 1, g FROM generate_series(1, 2000) g;
ANALYZE cust; ANALYZE ord;
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id WHERE c.id = 5;`,
        output: ` QUERY PLAN
-------------------------------
 Nested Loop
   ->  Seq Scan on cust c
         Filter: (id = 5)
   ->  Seq Scan on ord o
         Filter: (cust_id = 5)
(5 rows)`,
        explain: 'With `ord.cust_id` unindexed this time, the `Nested Loop` shape stays exactly the same — one outer row still makes probing the inner side once the sensible plan. What changes is only how that single probe runs: the inner side now has to sequentially scan all of `ord` (`Seq Scan on ord o` with `Filter: (cust_id = 5)`) instead of jumping straight there via an index.',
        explainHi: 'Is baar `ord.cust_id` unindexed hone par, `Nested Loop` shape theek wahi rehti hai — ek outer row abhi bhi inner side ko ek baar probe karna sensible plan banata hai. Jo badalta hai wo sirf ye hai ki wo ek probe kaise chalti hai: inner side ko ab poori `ord` sequentially scan karnі paड़ती hai (`Seq Scan on ord o` `Filter: (cust_id = 5)` ke saath) index ke through seedhe wahaan jump karne ke bajaye.',
      },
      {
        title: 'An unfiltered join of two full tables uses a Hash Join',
        titleHi: 'Do poori tables ka ek bina-filter join ek Hash Join istemal karta hai',
        code: `CREATE TABLE cust (id int PRIMARY KEY, name text);
INSERT INTO cust SELECT g, 'c'||g FROM generate_series(1, 100) g;
CREATE TABLE ord (id int PRIMARY KEY, cust_id int, amt int);
INSERT INTO ord SELECT g, (g % 100) + 1, g FROM generate_series(1, 2000) g;
ANALYZE cust; ANALYZE ord;
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id;`,
        output: ` QUERY PLAN
---------------------------------
 Hash Join
   Hash Cond: (o.cust_id = c.id)
   ->  Seq Scan on ord o
   ->  Hash
         ->  Seq Scan on cust c
(5 rows)`,
        explain: 'With no `WHERE` filter at all, every row of `cust` (100 rows) must match against every row of `ord` (2000 rows) — a Nested Loop here would mean scanning all of `ord` once per row of `cust`. Instead the planner picks `Hash Join`: build an in-memory hash table from the smaller `cust` (the `Hash` node), then stream all of `ord` past it in a single pass.',
        explainHi: 'Koi `WHERE` filter bilkul na hone par, `cust` ki har row (100 rows) ko `ord` ki har row (2000 rows) se match karna hai — yahaan ek Nested Loop ka matlab hoga `cust` ki har row ke liye poori `ord` ek baar scan karna. Iske bajaye planner `Hash Join` chunta hai: chhote `cust` se ek in-memory hash table banao (`Hash` node), phir poori `ord` ko usse ek single pass mein guzaro.',
      },
    ],

    mistakes: [
      {
        wrong: `-- assuming the planner "should" always use the join order written in the FROM clause
SELECT * FROM ord o JOIN cust c ON o.cust_id = c.id;
-- "I wrote ord first, so it should scan ord first" -- but the plan may build
-- the Hash from cust and probe with ord regardless of which table was written first`,
        right: `-- the planner is free to reorder joins and pick either side to build the hash
-- from -- SQL describes WHAT you want, never the physical execution order --
-- trust EXPLAIN to see the ACTUAL chosen order and strategy, not the FROM clause:
EXPLAIN (COSTS OFF) SELECT * FROM ord o JOIN cust c ON o.cust_id = c.id;`,
        why: 'SQL is a declarative language: a query specifies what result is wanted, not the physical steps to compute it, and the planner is entirely free to choose whichever join order and strategy it estimates will be cheapest, regardless of the order tables happen to appear in the FROM clause or which side of the ON condition each column is written on. Assuming execution follows written order is a common misconception carried over from imperative programming, where statement order genuinely determines execution order. The only reliable way to know the actual chosen plan, including which table becomes the Hash Join\'s build side or which side of a Nested Loop is outer, is to read the EXPLAIN output itself, since the SQL text alone does not determine it.',
        whyHi: 'SQL ek declarative language hai: ek query ye specify karti hai ki kya result chahiye, isे compute karne ke physical steps nahi, aur planner poori tarah free hai jo bhi join order aur strategy chunне ke liye jise ye sabse sasta estimate karta hai, chahe tables `FROM` clause mein kisī bhi order mein aayen. Actual chuna gaya plan jaanने ka ekmatra reliable tarika `EXPLAIN` output khud padhна hai.',
      },
      {
        wrong: `-- seeing "Nested Loop" in a plan and assuming it's always the SLOW choice
EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id WHERE c.id = 5;
-- "Nested Loop sounds like a nested loop in code, that's O(n*m), must be bad!"
-- -- but here the OUTER side produces exactly ONE row, so this is the CHEAPEST
-- possible plan, not a slow one`,
        right: `-- judge a join strategy by whether it fits the ACTUAL row counts involved,
-- not by the node name alone:
-- Nested Loop is CHEAP when the outer side is small (few rows to loop over)
-- Hash Join is CHEAP when both sides are largeish with no small side to loop over
-- -- context (via EXPLAIN ANALYZE's actual rows) decides which is "good" here`,
        why: 'A Nested Loop is not inherently slow; it is the cheapest possible strategy precisely when the outer side of the join produces few rows, since its cost is the outer row count multiplied by the cost of one inner probe, and multiplying a small number by a cheap probe cost stays small. It only becomes a genuinely poor choice when the outer side unexpectedly produces many rows, which is usually a symptom of a bad row-count estimate rather than of Nested Loop being a bad strategy in the abstract; a Hash Join with a large build side, similarly, is not automatically "better" in every situation, since building and probing a hash table on a large side costs more than a handful of cheap Nested Loop probes would. Reading actual row counts via EXPLAIN ANALYZE, rather than pattern-matching on which strategy name appears in the plan, is what actually tells you whether the chosen strategy fits the data.',
        whyHi: 'Ek Nested Loop inherently slow nahi hai; ye theek tab sabse sasta possible strategy hai jab join ka outer side kam rows produce karta hai, kyunki iski cost outer row count ko ek inner probe ki cost se multiply karke aati hai. Ye genuinely ek buri choice tabhi banта hai jab outer side unexpectedly bahut zyada rows produce karta hai, jo usually ek galat row-count estimate ka symptom hai. `EXPLAIN ANALYZE` ke through actual row counts padhna hi asal mein bataता hai ki chuni gayi strategy data ke liye theek hai ya nahi.',
      },
      {
        wrong: `-- tuning a slow query by changing several things at once
-- add an index, ALSO rewrite the query, ALSO run ANALYZE, all before re-testing
-- "it's faster now!" -- but WHICH change actually helped? unknown --
-- and if it's not faster, which of the three changes should be reverted? also unknown`,
        right: `-- change exactly ONE thing, then re-measure with EXPLAIN ANALYZE, before
-- deciding on the next change:
-- 1. ANALYZE first (cheapest to try, rules out stale statistics)
-- 2. re-measure -- still slow? try ONE index
-- 3. re-measure -- still slow? consider a query rewrite
-- each step's actual effect is now known, and any step that didn't help can be
-- confidently undone without guessing`,
        why: 'Changing multiple things at once before re-measuring makes it impossible to attribute the resulting change in performance to any specific one of them: if the query got faster, there is no way to know whether the index, the statistics refresh, the rewrite, or some combination was responsible, and if it did not get faster, there is equally no way to know which of the changes to keep and which to revert. Isolating one change per iteration of the tuning loop, and re-running EXPLAIN ANALYZE after each one specifically, keeps a clear causal link between each change and its measured effect, which is what makes the overall process actually converge on a real fix rather than accumulating an unexplainable pile of speculative changes.',
        whyHi: 'Dobara measure karne se pehle ek saath kई cheezen badalna resulting performance change ko unmein se kisī specific ek ko attribute karna asambhav banata hai. Tuning loop ki har iteration mein ek change ko isolate karna, aur har ek ke baad specifically `EXPLAIN ANALYZE` dobara chalана, har change aur iske measured effect ke beech ek saaf causal link rakhता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A production incident where a join\'s plan flipped from Hash Join to a disastrously slow Nested Loop** after a bulk delete skewed table-size statistics without a follow-up `ANALYZE` — resolved by running `ANALYZE` manually rather than waiting for autovacuum.',
        hi: '**Ek production incident jahaan ek join ka plan Hash Join se ek disastrously slow Nested Loop mein flip ho gaya** ek bulk delete ke baad jo table-size statistics ko `ANALYZE` follow-up ke bina skew kar diya.',
      },
      {
        en: '**A performance-review checklist requiring `EXPLAIN ANALYZE` output attached to any PR touching a query against a table over some row-count threshold** — codifying "measure before, measure after" as a team norm rather than an individual habit.',
        hi: '**Ek performance-review checklist jo кितне bhi rows waale table ke against ek query touch karти kisī PR ke saath `EXPLAIN ANALYZE` output attach karne ki maang karti hai**.',
      },
      {
        en: '**A ten-module "SQL fundamentals" onboarding track for new engineers** ending, deliberately, on exactly this lesson\'s workflow — everything from `SELECT` through transactions culminating in "how to actually make a query fast."',
        hi: '**Naye engineers ke liye ek das-module "SQL fundamentals" onboarding track** jaan-boojhkar theek is lesson ke workflow par khatm hoता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain Nested Loop, Hash Join, and Merge Join, and describe the situation each is best suited for.',
        qHi: 'Nested Loop, Hash Join, aur Merge Join samjhaओ, aur har ek kis situation ke liye sabse behtar hai bataओ.',
        a: 'A Nested Loop join processes the outer side of the join first, and for every row it produces, directly probes the inner side for matches, whether via a sequential scan or, ideally, an index lookup; its total cost scales with the outer row count multiplied by the cost of one inner probe, which makes it the cheapest option precisely when the outer side produces relatively few rows, since a small number of even moderately expensive probes stays cheap overall. A Hash Join instead builds an in-memory hash table from one side of the join, ideally the smaller one, exactly once, then streams the other, typically larger, side past that hash table exactly once, probing it for each row; this turns what would otherwise be a per-row repeated cost into a build-once, probe-once-per-row cost, which is generally the better strategy when both sides are largeish and there is no small side to loop over cheaply. A Merge Join requires both sides of the join to already be sorted, or cheaply sortable, on the join column, typically because of an existing index on both sides; it then walks the two sorted streams together in a single coordinated pass, advancing whichever side is currently behind, matching rows as their sort keys align, without needing to build any auxiliary structure at all, which makes it attractive specifically when that sort order is already available essentially for free.',
        aHi: 'Ek Nested Loop join pehle join ke outer side ko process karta hai, aur ye jo bhi row produce karta hai, uske liye seedhе inner side par matches probe karta hai. Iski total cost outer row count ko ek inner probe ki cost se multiply karke scale hoती hai, jo ise theek tab sabse sasta option banata hai jab outer side relatively kam rows produce karta hai. Ek Hash Join iske bजाय join ke ek side se, ideally chhoते waale se, ek in-memory hash table theek ek baar banata hai, phir doosre, typically bade, side ko us hash table se theek ek baar guzarта hai. Ek Merge Join ko join ke dono sides ko pehle se sorted, ya sasteme sortable, hona chahiye join column par.',
      },
      {
        q: 'Walk through the end-to-end workflow for diagnosing and fixing a slow query.',
        qHi: 'Ek slow query ko diagnose aur fix karne ke end-to-end workflow ke through chaलो.',
        a: 'The workflow starts by running EXPLAIN ANALYZE against the actual slow query, since guessing the cause from the query\'s text alone skips the step that reveals what genuinely happened, both the estimated and actual row counts and the real time spent at each node. From that output, the next step is identifying the single worst node in the plan, typically either the one with the largest gap between its estimated and actual row count or the one consuming the largest share of total execution time, since that is where the actual problem is concentrated rather than spread evenly across the whole query. From there, the specific diagnosis depends on what that node reveals: a missing index on a column being filtered, joined, or sorted on selectively calls for creating one of the appropriate shape, stale or absent statistics call for running ANALYZE, a join that chose a poor strategy because an upstream node fed it a bad row-count estimate often gets fixed by correcting that upstream estimate rather than the join itself, and a query shape the planner fundamentally cannot optimize well as written may call for a rewrite instead. Whichever diagnosis applies, the critical discipline is to make exactly one change at a time and then re-run EXPLAIN ANALYZE to confirm that specific change actually helped, rather than changing several things at once and losing the ability to attribute the result to any one of them; if the query is still slow after confirming or ruling out that one change, the loop repeats from identifying the next worst node.',
        aHi: 'Workflow asal slow query ke against `EXPLAIN ANALYZE` chalане se shuru hota hai. Us output se, agla step plan mein sabse bure single node ko identify karna hai, typically ya to wo jiska estimated aur actual row count ke beech sabse bada gap hai ya wo jo total execution time ka sabse bada hissa leта hai. Wahaan se, specific diagnosis is baat par depend karta hai ki wo node kya reveal karta hai. Jo bhi diagnosis apply ho, critical discipline ye hai ki ek baar mein theek ek change karo aur phir confirm karne ke liye `EXPLAIN ANALYZE` dobara chalao ki us specific change ne asal mein madad ki.',
      },
    ],

    exercises: [
      {
        task: 'Tables `cust(id int PRIMARY KEY, name text)` (100 rows) and `ord(id int PRIMARY KEY, cust_id int, amt int)` (2000 rows) with an index on `ord(cust_id)`. Run `EXPLAIN (COSTS OFF)` on `SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id WHERE c.id = 5` and identify the join strategy and both scan node types.',
        taskHi: 'Tables `cust(id, name)` (100 rows) aur `ord(id, cust_id, amt)` (2000 rows) `ord(cust_id)` par ek index ke saath. `SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id WHERE c.id = 5` par `EXPLAIN (COSTS OFF)` chalao aur join strategy aur dono scan node types identify karo.',
        hint: 'The outer side (`cust`, filtered to `id = 5`) produces one row, so a `Nested Loop` is sensible; the inner side (`ord`) is probed via `Bitmap Heap Scan`/`Bitmap Index Scan` because `cust_id` is indexed.',
        hintHi: 'Outer side (`cust`, `id = 5` tak filtered) ek row produce karta hai, to ek `Nested Loop` sensible hai; inner side (`ord`) `Bitmap Heap Scan`/`Bitmap Index Scan` ke through probe hota hai kyunki `cust_id` indexed hai.',
      },
      {
        task: 'Same two tables, but this time WITHOUT the index on `ord(cust_id)`. Re-run the same query\'s `EXPLAIN (COSTS OFF)` and confirm the join strategy (Nested Loop) stays the same while the inner scan type changes to a `Seq Scan`.',
        taskHi: 'Wahi do tables, par is baar `ord(cust_id)` par index ke bina. Wahi query ka `EXPLAIN (COSTS OFF)` dobara chalao aur confirm karo join strategy (Nested Loop) wahi rehti hai jabki inner scan type ek `Seq Scan` mein badal jaata hai.',
        hint: 'With one outer row, Nested Loop is still cheapest — what changes without an index is only how the single inner probe is carried out (a full scan instead of an index lookup).',
        hintHi: 'Ek outer row ke saath, Nested Loop abhi bhi sabse sasta hai — bina index ke sirf ye badalta hai ki wo ek inner probe kaise kiya jaata hai.',
      },
      {
        task: 'Same two tables (no filter this time). Run `EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id` (joining every row of both tables) and identify why a Hash Join, not a Nested Loop, is chosen here.',
        taskHi: 'Wahi do tables (is baar koi filter nahi). `EXPLAIN (COSTS OFF) SELECT * FROM cust c JOIN ord o ON o.cust_id = c.id` chalao aur samjhaओ ki yahaan ek Hash Join, Nested Loop nahi, kyun chuna jaata hai.',
        hint: 'With no filter, both sides are their full size (100 and 2000 rows) — a Nested Loop would mean scanning all of `ord` once per row of `cust`. A Hash Join builds one hash table from `cust` and streams `ord` past it a single time instead.',
        hintHi: 'Bina filter ke, dono sides apne poore size ke hain — ek Nested Loop ka matlab hoga `cust` ki har row ke liye poori `ord` ek baar scan karna. Ek Hash Join `cust` se ek hash table banata hai aur `ord` ko usse ek hi baar guzarta hai.',
      },
    ],

    keyTakeaways: [
      'NESTED LOOP: for each row on the OUTER side, directly probes the INNER side. Cheap when the outer side produces FEW rows — cost scales with outer-row-count × one-probe-cost. The inner probe can be an index lookup (fast) OR a full scan (slower) — the JOIN STRATEGY and the inner node\'s OWN SCAN METHOD are separate questions, each shaped by available indexes.',
      'HASH JOIN: builds an in-memory hash table from the SMALLER side ONCE, then streams the larger side past it a SINGLE time. Turns a per-outer-row repeated cost into build-once-probe-once-per-row — the usual choice for two largeish tables with no selective filter and no small side to loop over.',
      'MERGE JOIN: needs BOTH sides already sorted (or cheaply sortable, often via an index) on the join column — walks both sorted streams together in one pass, no hash table needed, since existing order already does the alignment.',
      'SQL is DECLARATIVE — the planner is free to reorder joins and pick either side to build a hash from, REGARDLESS of `FROM`-clause order. Only `EXPLAIN` reveals the actual chosen plan.',
      'A join strategy\'s "goodness" depends on whether it fits the ACTUAL row counts (via `EXPLAIN ANALYZE`\'s actual rows), not the node name alone — Nested Loop is NOT inherently slow (cheap with a small outer side); Hash Join is NOT automatically better in every case.',
      'THE FULL TUNING WORKFLOW: (1) `EXPLAIN ANALYZE` the slow query. (2) Find the node with the biggest estimate-vs-actual gap or largest time share. (3) Diagnose: missing index (Lessons 1/3/4)? stale stats (`ANALYZE`)? bad estimate cascading into a poor join choice? unused/redundant index write overhead (Lesson 5)? an unoptimizable query shape (rewrite it)? (4) Make EXACTLY ONE change — never several at once, or you can\'t attribute the effect. (5) Re-run `EXPLAIN ANALYZE` to confirm — repeat from step 2 if not resolved.',
      'This closes the ten-module SQL-core arc: `SELECT` (M1) through joins, aggregation, subqueries/CTEs, window functions, data modeling, DDL, transactions, and now indexing/performance — the complete toolkit for correct, well-designed, genuinely fast SQL.',
    ],
    keyTakeawaysHi: [
      'NESTED LOOP: OUTER side ki har row ke liye, seedhe INNER side probe karta hai. Outer side KAM rows produce karne par sasta hai. Inner probe ek index lookup (fast) YA ek full scan (slower) ho sakta hai — JOIN STRATEGY aur inner node ka apna SCAN METHOD alag sawaal hain.',
      'HASH JOIN: CHHOTE side se ek in-memory hash table THEEK EK BAAR banata hai, phir bade side ko usse EK BAAR guzarта hai. Do largeish tables ke liye usual choice jinme koi selective filter nahi.',
      'MERGE JOIN: dono sides ko pehle se sorted (ya sasteme sortable) hona chahiye join column par — dono sorted streams ko ek saath ek pass mein chalta hai, koi hash table nahi chahiye.',
      'SQL DECLARATIVE hai — planner joins reorder karne aur kisī bhi side se hash banane ke liye free hai, `FROM`-clause order se REGARDLESS. Sirf `EXPLAIN` actual chuna gaya plan reveal karta hai.',
      'Ek join strategy ki "achhaai" is baat par depend karti hai ki ye ACTUAL row counts fit karti hai ya nahi, sirf node naam par nahi — Nested Loop inherently slow NAHI hai.',
      'POORA TUNING WORKFLOW: (1) Slow query par `EXPLAIN ANALYZE`. (2) Sabse bade gap/time-share waala node dhoondo. (3) Diagnose karo. (4) THEEK EK change karo. (5) `EXPLAIN ANALYZE` dobara chalao confirm karne ke liye — resolve na ho to step 2 se dohराओ.',
      'Ye das-module SQL-core arc ko band karta hai: `SELECT` (M1) se lekar joins, aggregation, subqueries/CTEs, window functions, data modeling, DDL, transactions, aur ab indexing/performance tak — correct, well-designed, genuinely fast SQL ka poora toolkit.',
    ],
  },
];
