/**
 * Databases Complete Course — Module 10: Indexes & Query Performance, lessons 1-3.
 *
 * Lesson 1: How a B-tree index works — why an index turns an O(n) scan into an O(log n)
 *           lookup, `CREATE INDEX`, and the write-side cost every index carries.
 * Lesson 2: Reading EXPLAIN plans — `EXPLAIN` vs `EXPLAIN ANALYZE`, the plan tree,
 *           scan node types, and estimated vs actual row counts as a diagnostic signal.
 * Lesson 3: Composite, partial, and expression indexes — the leading-prefix rule for
 *           multi-column indexes, indexing only a subset of rows, and indexing a
 *           computed expression instead of a raw column.
 *
 * Examples use `EXPLAIN (COSTS OFF)` (and `EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF,
 * SUMMARY OFF, BUFFERS OFF)` where actual row counts matter), which strip the
 * non-deterministic cost estimates and timings so the plan shape itself is exactly
 * reproducible. Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 10
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_10: CourseLesson[] = [
  {
    slug: 'sql-how-btree-indexes-work',
    title: 'How a B-Tree Index Works',
    titleHi: 'Ek B-Tree Index Kaise Kaam Karta Hai',
    description: 'Without an index, finding matching rows means reading every row in the table. A B-tree index keeps a sorted, navigable structure of a column\'s values pointing back at the rows that hold them, turning a scan through every row into a small number of comparisons — at the cost of extra work on every write.',
    descriptionHi: 'Bina index ke, matching rows dhoondне ka matlab table ki har row padhна hai. Ek B-tree index ek column ki values ka ek sorted, navigable structure rakhता hai jo un rows ki taraf point karta hai jo unhe rakhती hain, har row ke through ek scan ko comparisons ki ek chhoti sankhya mein badalte hue — har write par extra kaam ki cost par.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A phone book versus a pile of unsorted index cards.** If someone hands you a thousand index cards, one per person, in no particular order, and asks you to find everyone named "Sharma", there is only one way to do it: look at every single card. That is a table scan. A phone book solves the exact same problem differently: names are printed in sorted order, and the book is organized so you can flip to roughly the right section immediately — open near the middle, see you have overshot or undershot "Sharma", and narrow in within a handful of flips, never touching most of the book\'s pages at all. A B-tree index is that phone book, built and maintained by the database itself: a sorted structure over one column\'s values, each entry pointing back to exactly where the full row lives, letting the database jump almost straight to the matching entries instead of reading every row. The catch is that a phone book has to be reprinted, or at least re-paginated, every time a new resident moves in — an index is not free to maintain, it is extra work the database does on every `INSERT`, `UPDATE`, or `DELETE` that touches the indexed column, to keep that sorted structure accurate.',
      hi: '**Ek phone book versus unsorted index cards ka ek dher.** Agar koi aapको ek hazar index cards deता hai, prati vyakti ek, kisī particular order mein nahi, aur poochta hai "Sharma" naam waale sabko dhoondो, ise karne ka sirf ek tarika hai: har single card dekho. Wo ek table scan hai. Ek phone book theek wahi problem alag tarike se solve karta hai: names sorted order mein print hote hain, aur book aise organized hai ki aap turant roughly sahi section tak jaa sakte ho — beech mein khоlो, dekho aap "Sharma" ko overshoot ya undershoot kar chuke ho, aur mुthी bhar flips ke andar narrow in karo, poori book ke zyadатार pages ko chhoे bina. Ek B-tree index wo phone book hai, database khud dwara bana aur maintain kiya gaya: ek column ki values par ek sorted structure, har entry theek us jagah point karте hue jahaan poori row rehти hai, database ko lgभग seedhे matching entries tak jump karने deता hai har row padhne ke bजаय. Catch ye hai ki ek phone book ko har baar ek naya resident aane par reprint, ya kam se kam re-paginate, karna hota hai — ek index maintain karna free nahi hai, ye extra kaam hai jo database har `INSERT`, `UPDATE`, ya `DELETE` par karta hai jo indexed column ko touch karta hai.',
    },

    simple: `**Without an index: finding matching rows means reading the WHOLE table**

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, val int);
-- 1000 rows, no index on val
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Seq Scan on t
  Filter: (val = 5)
-- every one of the 1000 rows is read and checked against "val = 5"
\`\`\`

**\`CREATE INDEX\` builds a sorted structure over a column's values**

\`\`\`sql
CREATE INDEX ON t (val);
ANALYZE t;                          -- refresh the planner's statistics (Lesson 2)
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Bitmap Heap Scan on t
  Recheck Cond: (val = 5)
  ->  Bitmap Index Scan on t_val_idx
        Index Cond: (val = 5)
-- the INDEX finds exactly the matching entries first, then fetches only THOSE rows
\`\`\`

**A primary key lookup is the cleanest case: a plain \`Index Scan\`**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE id = 42;
\`\`\`
\`\`\`
Index Scan using t_pkey on t
  Index Cond: (id = 42)
\`\`\`

**Why it's fast: O(log n) comparisons instead of O(n) rows read**

\`\`\`
1,000 rows      -- a B-tree finds the match in about 10 comparisons (log2 1000 ≈ 10)
1,000,000 rows  -- about 20 comparisons -- the index barely gets "deeper" as data grows
\`\`\`

**The cost: every index is extra work on every write**

\`\`\`
INSERT / UPDATE / DELETE on an indexed column
  -> the table row changes, AND
  -> every index on that column must ALSO be updated to stay accurate
-- more indexes = more write-side work, always -- this is why you don't index everything
\`\`\``,

    simpleHi: `**Bina index ke: matching rows dhoondне ka matlab POORI table padhна hai**

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, val int);
-- 1000 rows, val par koi index nahi
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Seq Scan on t
  Filter: (val = 5)
-- 1000 mein se har ek row padhi jaati hai aur "val = 5" ke against check hoti hai
\`\`\`

**\`CREATE INDEX\` ek column ki values par ek sorted structure banata hai**

\`\`\`sql
CREATE INDEX ON t (val);
ANALYZE t;                          -- planner ke statistics refresh karo (Lesson 2)
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Bitmap Heap Scan on t
  Recheck Cond: (val = 5)
  ->  Bitmap Index Scan on t_val_idx
        Index Cond: (val = 5)
-- INDEX pehle theek matching entries dhoondта hai, phir sirf UN rows ko fetch karta hai
\`\`\`

**Ek primary key lookup sabse saaf case hai: ek plain \`Index Scan\`**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE id = 42;
\`\`\`
\`\`\`
Index Scan using t_pkey on t
  Index Cond: (id = 42)
\`\`\`

**Ye fast kyun hai: O(n) rows padhne ke bajaye O(log n) comparisons**

\`\`\`
1,000 rows      -- ek B-tree lgभग 10 comparisons mein match dhoondता hai (log2 1000 ≈ 10)
1,000,000 rows  -- lgभग 20 comparisons -- data badhne par index shायad hi "gehra" hota hai
\`\`\`

**Cost: har index har write par extra kaam hai**

\`\`\`
Ek indexed column par INSERT / UPDATE / DELETE
  -> table row badalti hai, AUR
  -> us column ke har index ko BHI update hona hoga accurate rehne ke liye
-- zyada indexes = zyada write-side kaam, hamesha -- isliye aap sab kuch index nahi karte
\`\`\``,

    content: `## What a table scan costs

Without an index, the only way for PostgreSQL to find rows matching a condition is to read the table's pages one after another, checking every row against the condition. This is a **sequential scan** (\`Seq Scan\`), and its cost grows in direct proportion to the table's size: twice as many rows means roughly twice as long.

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, val int);
INSERT INTO t SELECT g, g % 100 FROM generate_series(1, 1000) g;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Seq Scan on t
  Filter: (val = 5)
\`\`\`

Every one of the 1,000 rows is read and tested against \`val = 5\`, even though only 10 of them (roughly 1%) actually match.

## What \`CREATE INDEX\` builds

An index is a separate, ordered data structure PostgreSQL maintains alongside the table — by default, a **B-tree** (balanced tree), which keeps the indexed column's values in sorted order along with a pointer back to each value's row.

\`\`\`sql
CREATE INDEX ON t (val);
ANALYZE t;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Bitmap Heap Scan on t
  Recheck Cond: (val = 5)
  ->  Bitmap Index Scan on t_val_idx
        Index Cond: (val = 5)
\`\`\`

Now the query first walks the sorted index to find exactly the entries where \`val = 5\` (the \`Bitmap Index Scan\`), then fetches only those matching rows from the table itself (the \`Bitmap Heap Scan\`) — never touching the other 990 rows at all. (Lesson 2 explains why this shows up as a *bitmap* heap scan here specifically, rather than a plain index scan; both are index-driven, just with different fetch strategies.)

## The cleanest case: a primary key lookup

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE id = 42;
\`\`\`
\`\`\`
Index Scan using t_pkey on t
  Index Cond: (id = 42)
\`\`\`

A primary key is automatically backed by a unique B-tree index (Module 7, Module 8), so an equality lookup on it is the textbook case: walk the index once to the matching entry, fetch that one row.

## Why a B-tree is fast: logarithmic, not linear

A B-tree keeps its entries sorted, and organizes them as a shallow, wide tree rather than one long sorted list — each level narrows the search dramatically, so finding a match takes roughly \`log₂(n)\` comparisons rather than \`n\`. On 1,000 rows that is about 10 comparisons instead of up to 1,000; on 1,000,000 rows it is only about 20 — the tree barely gets "deeper" as the data grows, which is why an index keeps paying off even as a table scales into the millions of rows, long after a sequential scan would become unusably slow.

## The cost: indexes are not free

Every index PostgreSQL maintains has to be kept in sync with the table. An \`INSERT\` that adds a row must also insert an entry into every index covering any of that row's columns; an \`UPDATE\` that changes an indexed column must update that index's entry too; a \`DELETE\` must remove the corresponding index entries. **More indexes mean more work on every write**, regardless of whether that index is ever actually used to speed up a read. This is the fundamental trade-off behind indexing: you are paying write-time cost, continuously, in exchange for read-time speed, and it is only worth it when that column is actually queried often enough, and selectively enough (Lesson 5 covers "when NOT to index" in depth), to be worth that ongoing cost.

## A rule of thumb for this lesson

Index the columns you filter, join, or sort on **often**, especially where the condition matches a **small fraction** of the table's rows — that is exactly the shape of query a B-tree accelerates dramatically. A table you write to constantly but rarely query on a given column, or a column where a query typically matches most of the table anyway, is a poor candidate: the sequential scan a table scan performs is not actually the bottleneck there, and the index would just be pure overhead on every write.`,

    contentHi: `## Ek table scan ki cost kya hai

Bina index ke, PostgreSQL ke liye ek condition se match karti rows dhoondне ka ekmatra tarika table ke pages ko ek-ek karके padhна hai, har row ko condition ke against check karте hue. Ye ek **sequential scan** (\`Seq Scan\`) hai, aur iski cost table ke size ke seedhe proportion mein badhती hai.

\`\`\`sql
CREATE TABLE t (id int PRIMARY KEY, val int);
INSERT INTO t SELECT g, g % 100 FROM generate_series(1, 1000) g;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Seq Scan on t
  Filter: (val = 5)
\`\`\`

1000 mein se har ek row padhi jaati hai aur \`val = 5\` ke against test ki jaती hai, chahe sirf 10 (lgभग 1%) hi asal mein match karte hon.

## \`CREATE INDEX\` kya banata hai

Ek index ek alag, ordered data structure hai jise PostgreSQL table ke saath maintain karta hai — default se, ek **B-tree**, jo indexed column ki values ko sorted order mein rakhता hai har value ke row ki taraf ek pointer ke saath.

\`\`\`sql
CREATE INDEX ON t (val);
ANALYZE t;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Bitmap Heap Scan on t
  Recheck Cond: (val = 5)
  ->  Bitmap Index Scan on t_val_idx
        Index Cond: (val = 5)
\`\`\`

Ab query pehle sorted index chalti hai theek wo entries dhoondне ke liye jahaan \`val = 5\` hai, phir sirf un matching rows ko table se fetch karti hai — baaki 990 rows ko bilkul touch kiye bina.

## Sabse saaf case: ek primary key lookup

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE id = 42;
\`\`\`
\`\`\`
Index Scan using t_pkey on t
  Index Cond: (id = 42)
\`\`\`

Ek primary key automatically ek unique B-tree index se backed hai, to isपार ek equality lookup textbook case hai.

## B-tree fast kyun hai: logarithmic, linear nahi

Ek B-tree apni entries sorted rakhta hai, aur unhe ek shallow, wide tree ke roop mein organize karता hai ek lambी sorted list ke bजाय — har level search ko dramatically narrow karता hai, to ek match dhoondне mein lgभग \`log₂(n)\` comparisons lagते hain \`n\` ke bजаय. 1,000 rows par ye lgभग 10 comparisons hai; 1,000,000 rows par ye sirf lgभग 20 hai.

## Cost: indexes free nahi hain

PostgreSQL jo bhi index maintain karता hai use table ke saath sync mein rakhна paड़ता hai. Ek \`INSERT\` jo ek row add karta hai use har index mein bhi ek entry insert karnі hoगi jo us row ke kisī column ko cover karti hai; ek \`UPDATE\` jo ek indexed column badalta hai use us index ki entry bhi update karnі hoगi. **Zyada indexes matlab har write par zyada kaam**, chahe wo index kabhi asal mein ek read speed up karने ke liye istemal ho ya na ho.

## Is lesson ke liye ek rule of thumb

Un columns ko index karो jinhe aap **aksar** filter, join, ya sort karte ho, khaास kar jahaan condition table ki rows ka ek **chhotа hissa** match karta hai.`,

    examples: [
      {
        title: 'A sequential scan reads every row when no index exists',
        titleHi: 'Koi index na hone par ek sequential scan har row padhta hai',
        code: `CREATE TABLE t (id int PRIMARY KEY, val int);
INSERT INTO t SELECT g, g % 100 FROM generate_series(1, 1000) g;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;`,
        output: ` QUERY PLAN
---------------------
 Seq Scan on t
   Filter: (val = 5)
(2 rows)`,
        explain: 'With no index on `val`, the only plan available is a `Seq Scan on t` with a `Filter: (val = 5)` — every one of the 1000 rows is read and tested against the condition, even though only about 10 of them actually match.',
        explainHi: '`val` par koi index na hone par, ekmatra available plan `Seq Scan on t` hai ek `Filter: (val = 5)` ke saath — 1000 mein se har ek row padhi jaati hai aur condition ke against test ki jaati hai, chahe sirf lgbhag 10 hi asal mein match karti hon.',
      },
      {
        title: 'Creating an index changes the plan to fetch only the matching rows',
        titleHi: 'Ek index create karna plan ko sirf matching rows fetch karne mein badalta hai',
        code: `CREATE TABLE t (id int PRIMARY KEY, val int);
INSERT INTO t SELECT g, g % 100 FROM generate_series(1, 1000) g;
CREATE INDEX ON t (val);
ANALYZE t;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;`,
        output: ` QUERY PLAN
--------------------------------------
 Bitmap Heap Scan on t
   Recheck Cond: (val = 5)
   ->  Bitmap Index Scan on t_val_idx
         Index Cond: (val = 5)
(4 rows)`,
        explain: 'After `CREATE INDEX ON t (val)` and `ANALYZE`, the plan changes to a `Bitmap Heap Scan on t` with a `Bitmap Index Scan on t_val_idx` underneath it — the index is walked first to find exactly which rows match `val = 5`, and only those rows are then fetched from the table, instead of reading all 1000.',
        explainHi: '`CREATE INDEX ON t (val)` aur `ANALYZE` ke baad, plan ek `Bitmap Heap Scan on t` mein badal jaata hai neeche ek `Bitmap Index Scan on t_val_idx` ke saath — index pehle chala ke theek dhoondha jaata hai ki `val = 5` se kaunsi rows match karti hain, aur sirf wo rows table se fetch ki jaati hain, 1000 padhne ke bajaye.',
      },
      {
        title: 'A primary key equality lookup uses a plain Index Scan',
        titleHi: 'Ek primary key equality lookup ek plain Index Scan istemal karta hai',
        code: `CREATE TABLE t (id int PRIMARY KEY, val int);
INSERT INTO t SELECT g, g % 100 FROM generate_series(1, 1000) g;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE id = 42;`,
        output: ` QUERY PLAN
------------------------------
 Index Scan using t_pkey on t
   Index Cond: (id = 42)
(2 rows)`,
        explain: "`id` is the table's primary key, which already has a unique B-tree index maintained automatically (Module 7/8) — no separate `CREATE INDEX` was needed. An equality lookup on it produces the cleanest possible plan: `Index Scan using t_pkey on t` with `Index Cond: (id = 42)`, walking straight to the one matching entry.",
        explainHi: '`id` table ki primary key hai, jiske paas pehle se automatically maintained ek unique B-tree index hai (Module 7/8) — koi alag `CREATE INDEX` zaroorat nahi thi. Ispar ek equality lookup sabse saaf possible plan produce karta hai: `Index Scan using t_pkey on t` `Index Cond: (id = 42)` ke saath, theek us ek matching entry tak seedhे chalte hue.',
      },
    ],

    mistakes: [
      {
        wrong: `-- adding an index and expecting an immediate speed-up with no other change
CREATE INDEX ON t (val);
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
-- on a table the planner has never analyzed, it may still choose a Seq Scan,
-- because it has no up-to-date statistics telling it the index would help`,
        right: `CREATE INDEX ON t (val);
ANALYZE t;   -- refresh the planner's statistics about this table (Lesson 2)
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
-- now the planner has accurate row-count and distribution estimates to decide with`,
        why: 'Creating an index does not by itself guarantee the planner will use it. PostgreSQL decides between a sequential scan and an index-based plan by estimating the cost of each, and that estimate depends on statistics about the table, such as how many rows it has and how the indexed column\'s values are distributed. Those statistics are gathered by ANALYZE, not automatically the instant an index is created, so a newly indexed but never-analyzed table can still produce a plan that ignores the new index simply because the planner is working from stale or absent information. In practice autovacuum eventually analyzes tables automatically, but immediately after a bulk load or a fresh CREATE INDEX, running ANALYZE explicitly is the reliable way to make sure the planner has what it needs.',
        whyHi: 'Ek index create karna apne aap guarantee nahi karta ki planner ise istemal karегa. PostgreSQL ek sequential scan aur ek index-based plan ke beech har ek ki cost estimate karके decide karta hai, aur wo estimate table ke baare mein statistics par depend karta hai. Wo statistics `ANALYZE` dwara gather ki jaati hain, ek index create hote hi automatically nahi, to ek naya indexed par kabhi-analyzed-nahi table phir bhi ek aisा plan produce kar sakta hai jo naye index ko ignore karta hai. Practice mein autovacuum aakhirkar tables ko automatically analyze karta hai, par ek bulk load ke turant baad, explicitly `ANALYZE` chalana reliable tarika hai.',
      },
      {
        wrong: `-- adding an index to every column "just in case a query needs it someday"
CREATE INDEX ON emp (name);
CREATE INDEX ON emp (hired_at);
CREATE INDEX ON emp (department);
CREATE INDEX ON emp (phone);
-- ... on a table that is written to constantly but rarely filtered by most of these`,
        right: `-- index only the columns actual, observed query patterns filter/join/sort on --
-- add the rest LATER, if and when a real slow query calls for it (Lesson 5)
CREATE INDEX ON emp (department);   -- e.g. because reports filter by this constantly`,
        why: 'Every index adds work to every insert, update, and delete that touches its column, regardless of whether the index is ever used to speed up a read. Adding an index to every column speculatively, without evidence that queries actually filter on it often and selectively, pays that ongoing write cost for indexes that may never earn it back. The sound default is to index based on observed query patterns, typically discovered by looking at what a slow query\'s EXPLAIN plan shows (Lesson 2) or what columns appear repeatedly in WHERE, JOIN, and ORDER BY clauses, and to add an index when there is a concrete reason to believe it will help, not preemptively on every column a table happens to have.',
        whyHi: 'Har index apne column ko touch karne waale har insert, update, aur delete mein kaam add karта hai, chahe index kabhi ek read speed up karने ke liye istemal ho ya na ho. Har column ko speculatively index karna, is evidence ke bina ki queries asal mein aksar aur selectively ispar filter karti hain, un indexes ke liye ye ongoing write cost pay karta hai jo shАyad kabhi wapas na kamaएं. Sound default observed query patterns ke aadhaar par index karna hai.',
      },
      {
        wrong: `-- expecting an index to help a query that matches most of the table anyway
CREATE INDEX ON orders (status);
-- 95% of all orders have status = \'completed\'
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE status = \'completed\';
-- the planner correctly chooses a Seq Scan anyway -- reading almost the whole
-- table via the index, one row at a time, would be SLOWER than one sequential pass`,
        right: `-- an index on a low-selectivity condition like this rarely helps that specific
-- query -- it may still help a DIFFERENT, more selective query on the same column:
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE status = \'cancelled\';  -- if rare`,
        why: 'An index only wins over a sequential scan when it lets the database skip the vast majority of rows. If a condition matches 95 percent of a table, using the index would mean following pointers to almost every row anyway, in a scattered order across the table\'s pages, which is typically slower than one straightforward pass reading pages in physical order. The planner accounts for this using its statistics and will correctly prefer a sequential scan for a low-selectivity condition even when an index exists on that column. The same index can still be genuinely useful for a different, rarer value in the same column, which is exactly why selectivity, not merely "is there an index", is what determines whether a given query benefits.',
        whyHi: 'Ek index ek sequential scan par tabhi jeetta hai jab ye database ko zyadатार rows skip karne deta hai. Agar ek condition table ke 95 percent se match karti hai, index istemal karna matlab hoga lgभग har row tak pointers follow karna, table ke pages ke across ek scattered order mein, jo typically ek straightforward pass se slower hai jo pages ko physical order mein padhता hai. Planner apne statistics istemal karके ise account karta hai aur ek low-selectivity condition ke liye sahi se sequential scan prefer karега chahe us column par ek index exist kare.',
      },
    ],

    realWorld: [
      {
        en: '**A "slow query" ticket resolved by adding one `CREATE INDEX` on a `WHERE`-filtered column, turning a multi-second `Seq Scan` on a million-row table into a millisecond `Bitmap Heap Scan`.**',
        hi: '**Ek "slow query" ticket ek `WHERE`-filtered column par ek `CREATE INDEX` add karke resolve kiya gaya, ek million-row table par ek multi-second `Seq Scan` ko ek millisecond `Bitmap Heap Scan` mein badalte hue.**',
      },
      {
        en: '**A migration review rule requiring `ANALYZE table;` immediately after any `CREATE INDEX` on a table populated by a bulk load** — so the planner has accurate statistics from the moment the index goes live.',
        hi: '**Ek migration review rule jo kisi bhi `CREATE INDEX` ke turant baad `ANALYZE table;` require karta hai**.',
      },
      {
        en: '**A schema audit that removed several never-used indexes on a write-heavy table** (found via PostgreSQL\'s index-usage statistics), measurably speeding up bulk inserts.',
        hi: '**Ek schema audit jisne ek write-heavy table par kई kabhi-use-na-hue indexes hataye**, bulk inserts ko measurably speed up karte hue.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does an index speed up a lookup, and why is it not free?',
        qHi: 'Ek index ek lookup ko speed up kyun karта hai, aur ye free kyun nahi hai?',
        a: 'Without an index, finding rows that match a condition requires reading every row in the table and testing each one, a sequential scan whose cost grows in direct proportion to the table\'s size. A B-tree index maintains a separate, sorted structure over the indexed column\'s values, each entry pointing back to its row, organized as a shallow, wide tree rather than one long list. Because the structure is sorted and tree-shaped, finding a matching entry takes roughly a logarithmic number of comparisons relative to the table size rather than a number proportional to the table itself, so the cost barely grows even as the table scales into the millions of rows. The reason it is not free is that this sorted structure has to be kept accurate as the underlying data changes: every insert that adds a row must also add an entry to every index covering that row\'s columns, every update to an indexed column must update the corresponding index entry, and every delete must remove it. That maintenance work happens on every write regardless of whether the index is ever actually used to speed up a read, which is why adding indexes is a genuine trade-off, paying continuous write-time cost in exchange for read-time speed, and is only worth it for columns that are actually queried often enough, and selectively enough, to earn that cost back.',
        aHi: 'Bina index ke, ek condition se match karti rows dhoondне ke liye table ki har row padhнी aur test karnі paड़ती hai, ek sequential scan jiski cost table ke size ke seedhe proportion mein badhती hai. Ek B-tree index indexed column ki values par ek alag, sorted structure maintain karта hai, har entry apni row ki taraf point karte hue. Kyunki structure sorted aur tree-shaped hai, ek matching entry dhoondне mein table ke size ke sapeksh lgभग ek logarithmic sankhya mein comparisons lagते hain. Ye free nahi hai kyunki is sorted structure ko underlying data badalне par accurate rakhна paड़ta hai: har insert ko har index mein ek entry add karnі hoगi.',
      },
      {
        q: 'When should you NOT add an index to a column, even if queries filter on it?',
        qHi: 'Aapko ek column par ek index kab NAHI add karna chahiye, chahe queries ispar filter karti hon?',
        a: 'The main case is when the condition typically matches a large fraction of the table\'s rows, a low-selectivity condition. If a query matches, say, ninety-five percent of a table, using an index would mean following pointers scattered across nearly the whole table anyway, which is usually slower than a single sequential pass that reads pages in physical order, so the planner correctly prefers a sequential scan there even with an index available, and adding one purely for that query gains nothing while still paying its write-time cost. The other main case is a column that is rarely, if ever, actually filtered, joined, or sorted on in real queries, added speculatively on the assumption it might be useful someday; every index adds overhead to every insert, update, and delete touching that column regardless of whether it is ever used, so an index that earns no read-time benefit is pure cost. The sound approach is to add indexes based on observed, specific query patterns, ideally after confirming with an actual EXPLAIN plan that a sequential scan is genuinely the bottleneck, rather than indexing preemptively.',
        aHi: 'Main case tab hai jab condition typically table ki rows ke ek badे hisse se match karti hai, ek low-selectivity condition. Agar ek query, maान lo, ek table ke pachhанave percent se match karti hai, index istemal karna matlab hoga lgभग poori table ke across bikhre pointers follow karna, jo usually ek single sequential pass se slower hai, to planner sahi se wahaan sequential scan prefer karега index available hone par bhi. Doosra main case ek column hai jo real queries mein shАyad hi actually filter, join, ya sort ki jaati hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `t(id int PRIMARY KEY, val int)` with 1000 rows (`val` cycling `0-99`). Run `EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5` before creating any index on `val`, confirm it is a `Seq Scan`. Then create an index on `val`, `ANALYZE t`, and re-run the same `EXPLAIN` — confirm the plan changes.',
        taskHi: 'Table `t(id, val)` 1000 rows ke saath (`val` `0-99` cycle karta hai). `val` par koi index banane se pehle `EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5` chalao, confirm karo ye `Seq Scan` hai. Phir `val` par ek index banao, `ANALYZE t`, aur wahi `EXPLAIN` dobara chalao.',
        hint: 'Before the index: `Seq Scan on t` with a `Filter`. After `CREATE INDEX` + `ANALYZE`: `Bitmap Heap Scan on t` with a `Bitmap Index Scan` underneath it, using the new index.',
        hintHi: 'Index se pehle: `Seq Scan on t` ek `Filter` ke saath. `CREATE INDEX` + `ANALYZE` ke baad: `Bitmap Heap Scan on t` neeche ek `Bitmap Index Scan` ke saath, naye index istemal karte hue.',
      },
      {
        task: 'Table `t(id int PRIMARY KEY, val int)`. Run `EXPLAIN (COSTS OFF) SELECT * FROM t WHERE id = 42`. Confirm this uses `Index Scan using t_pkey on t` WITHOUT you ever having created an index yourself — explain in a comment why a primary key already has one.',
        taskHi: 'Table `t(id, val)`. `EXPLAIN (COSTS OFF) SELECT * FROM t WHERE id = 42` chalao. Confirm karo ye `Index Scan using t_pkey on t` istemal karta hai bina aapke khud koi index banaye.',
        hint: '`PRIMARY KEY` automatically creates a unique B-tree index to enforce uniqueness (Module 7/8) — that same index is available for the planner to use for lookups, with no separate `CREATE INDEX` needed.',
        hintHi: '`PRIMARY KEY` automatically ek unique B-tree index banata hai uniqueness enforce karne ke liye (Module 7/8) — wahi index planner ke liye lookups ke liye available hai, koi alag `CREATE INDEX` chahiye ke bina.',
      },
      {
        task: 'In a comment (no SQL needed), explain why an index on `status` in a table where 95% of rows have `status = \'active\'` would likely NOT be used by `WHERE status = \'active\'`, but might still help `WHERE status = \'archived\'` if that value is rare.',
        taskHi: 'Ek comment mein (koi SQL zaroori nahi), samjhaओ ki ek table mein `status` par ek index jahaan 95% rows ka `status = \'active\'` hai `WHERE status = \'active\'` ke liye likely istemal NAHI hoga, par `WHERE status = \'archived\'` mein abhi bhi madad kar sakta hai agar wo value rare hai.',
        hint: 'A condition matching most of the table (`\'active\'`) has low selectivity — the planner correctly prefers a sequential scan. A rare value (`\'archived\'`) has high selectivity — the same index efficiently skips almost the whole table to find just those few rows.',
        hintHi: 'Table ke zyadатार hisse se match karti ek condition (`\'active\'`) ki low selectivity hai — planner sahi se sequential scan prefer karता hai. Ek rare value (`\'archived\'`) ki high selectivity hai — wahi index efficiently lgभग poori table skip karта hai.',
      },
    ],

    keyTakeaways: [
      'Without an index, finding matching rows means a SEQUENTIAL SCAN (`Seq Scan`) — reading and testing EVERY row, cost proportional to table SIZE.',
      '`CREATE INDEX` builds a separate, SORTED B-tree structure over a column\'s values, each entry pointing back to its row — lets PostgreSQL jump nearly straight to matches instead of reading every row. A primary key ALREADY has one automatically (Module 7/8) — a bare equality lookup on it is `Index Scan using <table>_pkey`.',
      'Why it\'s fast: a B-tree\'s sorted, tree-shaped structure means finding a match takes roughly `log2(n)` comparisons, not `n` — ~10 comparisons at 1,000 rows, ~20 at 1,000,000. The tree barely gets "deeper" as data grows.',
      'The cost: EVERY index must be kept in sync on EVERY write. `INSERT`/`UPDATE`/`DELETE` touching an indexed column updates that index too, regardless of whether the index is EVER used for a read. More indexes = more write-side work, always.',
      'A NEW index needs `ANALYZE` (or eventual autovacuum) before the planner reliably uses it — statistics about row counts/distribution drive the seq-scan-vs-index decision, and they don\'t update automatically the instant an index is created.',
      'RULE OF THUMB: index columns filtered/joined/sorted on OFTEN, where the condition matches a SMALL FRACTION of rows (high selectivity). A condition matching MOST of the table (low selectivity, e.g. 95%) gets a `Seq Scan` correctly chosen over the index — following scattered pointers for nearly every row is slower than one sequential pass.',
      'Don\'t index speculatively ("just in case") — every unused index is pure write-cost with zero read benefit. Add indexes based on OBSERVED query patterns (Lesson 2\'s `EXPLAIN`), not preemptively on every column.',
    ],
    keyTakeawaysHi: [
      'Bina index ke, matching rows dhoondне ka matlab ek SEQUENTIAL SCAN hai — HAR row padhна aur test karна, cost table ke SIZE ke proportion mein.',
      '`CREATE INDEX` ek column ki values par ek alag, SORTED B-tree structure banata hai, har entry apni row ki taraf point karте hue. Ek primary key ke paas pehle se automatically ek hai — ispar ek bare equality lookup `Index Scan using <table>_pkey` hai.',
      'Fast kyun hai: B-tree ka sorted, tree-shaped structure matlab ek match dhoondне mein lgभग `log2(n)` comparisons lagते hain, `n` nahi.',
      'Cost: HAR index ko HAR write par sync mein rakhna paता hai. Zyada indexes = zyada write-side kaam, hamesha.',
      'Ek NAYE index ko `ANALYZE` chahiye planner ke reliably ise istemal karne se pehle — statistics seq-scan-vs-index decision drive karti hain.',
      'RULE OF THUMB: un columns ko index karो jo AKSAR filter/join/sort hote hain, jahaan condition rows ka ek CHHOTA HISSA match karti hai. Table ke ZYADATAR hisse se match karti ek condition (low selectivity) ke liye `Seq Scan` sahi se chuna jaata hai.',
      'Speculatively index mat karो — har unused index sirf write-cost hai zero read benefit ke saath. OBSERVED query patterns ke aadhaar par indexes add karo.',
    ],
  },

  {
    slug: 'sql-reading-explain-plans',
    title: 'Reading EXPLAIN Plans',
    titleHi: 'EXPLAIN Plans Padhna',
    description: '`EXPLAIN` shows what PostgreSQL intends to do to answer a query, without running it. `EXPLAIN ANALYZE` actually runs it and shows what really happened. Learning to read the tree of nodes — and to compare the planner\'s estimates against reality — is how you find out why a query is slow.',
    descriptionHi: '`EXPLAIN` dikhaता hai ki PostgreSQL ek query ka jawab dene ke liye kya karne ka इरादа rakhता hai, use chalaye bina. `EXPLAIN ANALYZE` ise asal mein chalाता hai aur dikhaता hai ki asal mein kya hua. Nodes ke tree ko padhна seekhна — aur planner ke estimates ko reality se compare karна — ye pata karne ka tarika hai ki ek query slow kyun hai.',
    difficulty: 'HARD',
    duration: 26,
    order: 2,

    analogy: {
      en: '**A recipe\'s written instructions versus a kitchen timer log of what actually happened while cooking it.** A recipe card tells you the *plan*: chop the onions, then sauté them, then add the sauce, then simmer for twenty minutes — a sequence of steps, each depending on the one before it finishing. That written recipe is `EXPLAIN`: PostgreSQL\'s stated intention for how it will assemble your answer, worked out in advance from its best guess about how many onions there are and how long sautéing usually takes, without anyone having actually cooked anything yet. `EXPLAIN ANALYZE` is different: it is the same recipe, but this time you actually cook it, with a stopwatch next to each step, writing down how long the onions genuinely took to chop and how many you actually had, not the guessed amount. Most of the time the guess and the reality roughly agree, and the meal comes out on schedule. But sometimes the recipe assumed three onions and there were actually three hundred — the plan itself was reasonable given wrong information, and the mismatch between "the recipe assumed 3" and "there really were 300" is precisely the clue that tells you which step to fix, not by guessing, but by comparing what was planned against what actually happened.',
      hi: '**Ek recipe ke likhे hue instructions versus ek kitchen timer log ki ye ise banate waqt asal mein kya hua.** Ek recipe card aapको *plan* bataता hai: pyaaz kaato, phir unhe sauté karो, phir sauce daalो, phir bees minute simmer karो — steps ka ek sequence, har ek pehle waale ke khatm hone par depend karta hua. Wo likhी recipe `EXPLAIN` hai: PostgreSQL ka stated इरादа ki ye aapका jawab kaise assemble karега, iska best guess use karके ki кितने pyaaz hain aur sauté karne mein aksar кितna samay lagta hai, bina kisī ne asal mein kuch banाye. `EXPLAIN ANALYZE` alag hai: ye wahi recipe hai, par is baar aap ise asal mein banाते ho, har step ke paas ek stopwatch ke saath, likhте hue ki pyaaz kaatने mein asal mein кितna samay laga. Zyadатार baar guess aur reality lgभग agree karte hain. Par kabhi-kabhi recipe ne teen pyaaz maане aur asal mein teen sौ the — plan galat information ke aadhaar par reasonable thа, aur "recipe ne 3 maане" aur "asal mein 300 the" ke beech mismatch theek wo clue hai jo aapको bataता hai kaunसा step fix karna hai.',
    },

    simple: `**\`EXPLAIN\` shows the intended plan — WITHOUT running the query**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Bitmap Heap Scan on t
  Recheck Cond: (val = 5)
  ->  Bitmap Index Scan on t_val_idx
        Index Cond: (val = 5)
\`\`\`

**Read the tree INSIDE-OUT: the most-indented node runs FIRST**

\`\`\`
Bitmap Heap Scan on t              <- runs LAST (fetches the actual rows)
  ->  Bitmap Index Scan on t_val_idx   <- runs FIRST (finds which rows to fetch)
\`\`\`

**\`EXPLAIN ANALYZE\` actually RUNS the query and reports what really happened**

\`\`\`sql
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
  SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Bitmap Heap Scan on t (actual rows=10.00 loops=1)
  Recheck Cond: (val = 5)
  Heap Blocks: exact=5
  ->  Bitmap Index Scan on t_val_idx (actual rows=10.00 loops=1)
        Index Cond: (val = 5)
        Index Searches: 1
\`\`\`

**"actual rows" vs the (hidden here) planner ESTIMATE is the #1 diagnostic signal**

\`\`\`
actual rows close to estimated  -- planner had good information, trust the plan
actual rows WAY OFF from estimated  -- stale/missing statistics (run ANALYZE) --
                                        or a correlation the planner can't see
\`\`\`

**Common plan node types**

\`\`\`
Seq Scan            -- reads every row of the table, filters in memory
Index Scan           -- walks an index, fetches each matching row from the table directly
Bitmap Index Scan +
Bitmap Heap Scan     -- builds a list of matching locations from the index first,
                         then fetches those rows -- efficient for MORE than a
                         handful of matches, fewer than "most of the table"
Nested Loop           -- for each row on one side, probes the other side (Lesson 6)
Hash Join / Merge Join -- other join strategies (Lesson 6)
\`\`\`

**Just \`EXPLAIN\` (no ANALYZE) is safe on a DELETE/UPDATE -- it never runs the statement**

\`\`\`sql
EXPLAIN DELETE FROM big_table WHERE ...;   -- shows the plan, changes NOTHING
EXPLAIN ANALYZE DELETE FROM big_table WHERE ...;   -- ACTUALLY DELETES -- be careful!
\`\`\``,

    simpleHi: `**\`EXPLAIN\` intended plan dikhaता hai — query CHALAYE BINA**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Bitmap Heap Scan on t
  Recheck Cond: (val = 5)
  ->  Bitmap Index Scan on t_val_idx
        Index Cond: (val = 5)
\`\`\`

**Tree ko ANDAR-SE-BAHAR padhो: sabse zyada indented node PEHLE chalta hai**

\`\`\`
Bitmap Heap Scan on t              <- AAKHRI chalta hai (asal rows fetch karta hai)
  ->  Bitmap Index Scan on t_val_idx   <- PEHLE chalta hai (kaunsi rows fetch karni hain dhoondta hai)
\`\`\`

**\`EXPLAIN ANALYZE\` asal mein query CHALAТA hai aur report karta hai ki asal mein kya hua**

\`\`\`sql
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
  SELECT * FROM t WHERE val = 5;
\`\`\`
\`\`\`
Bitmap Heap Scan on t (actual rows=10.00 loops=1)
  Recheck Cond: (val = 5)
  Heap Blocks: exact=5
  ->  Bitmap Index Scan on t_val_idx (actual rows=10.00 loops=1)
        Index Cond: (val = 5)
        Index Searches: 1
\`\`\`

**"actual rows" vs (yahaan hidden) planner ESTIMATE #1 diagnostic signal hai**

\`\`\`
actual rows estimated ke close  -- planner ke paas achhi information thi
actual rows estimated se BAHUT ALAG  -- stale/missing statistics (ANALYZE chalao) --
                                        ya ek correlation jo planner nahi dekh sakta
\`\`\`

**Common plan node types**

\`\`\`
Seq Scan            -- table ki har row padhta hai, memory mein filter karta hai
Index Scan           -- ek index chalता hai, har matching row seedhe table se fetch
Bitmap Index Scan +
Bitmap Heap Scan     -- pehle index se matching locations ki ek list banata hai,
                         phir wo rows fetch karta hai
Nested Loop           -- ek side ki har row ke liye, doosri side probe karta hai (Lesson 6)
Hash Join / Merge Join -- doosri join strategies (Lesson 6)
\`\`\`

**Sirf \`EXPLAIN\` (bina ANALYZE) ek DELETE/UPDATE par safe hai -- ye statement kabhi chalata nahi**

\`\`\`sql
EXPLAIN DELETE FROM big_table WHERE ...;   -- plan dikhata hai, KUCH nahi badalta
EXPLAIN ANALYZE DELETE FROM big_table WHERE ...;   -- ASAL MEIN DELETE KARTA HAI -- saawdhan!
\`\`\``,

    content: `## \`EXPLAIN\` vs \`EXPLAIN ANALYZE\`

\`EXPLAIN\` asks PostgreSQL's planner what it **would** do to execute a query, using its cost estimates and statistics, without actually running anything. This is always safe, even against a \`DELETE\` or \`UPDATE\` — nothing is changed.

\`EXPLAIN ANALYZE\` **actually executes** the query (yes, including a \`DELETE\` or \`UPDATE\` if that is what you asked it to explain), and reports what genuinely happened at each step, alongside the original estimates. This is the tool for finding out whether the planner's guesses matched reality — but be deliberate about running it against anything that writes data.

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
-- shows the INTENDED plan, instantly, no matter how slow the real query would be

EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
  SELECT * FROM t WHERE val = 5;
-- actually RUNS the query and reports the REAL row counts alongside the plan
\`\`\`

## Reading the tree: inside-out, innermost-first

A plan is a tree of **nodes**, each indented under its parent. **The most deeply indented node runs first**; its output feeds the node directly above it, and so on up to the top, which is the very last thing to produce a result:

\`\`\`
Bitmap Heap Scan on t                    <- runs LAST: fetches the rows themselves
  ->  Bitmap Index Scan on t_val_idx     <- runs FIRST: finds WHICH rows to fetch
\`\`\`

For a query joining several tables, the same rule applies at every level: the deepest nodes are scans of individual tables, and the joins above them combine those scans' outputs, from the bottom up (Lesson 6 covers join node types in depth).

## Common scan node types

- **\`Seq Scan\`** — reads every row of the table (or every row surviving a prior filter), testing each against any \`Filter\` condition shown. No index involved.
- **\`Index Scan\`** — walks a B-tree index directly, and for each matching index entry, immediately fetches that one row from the table. Efficient when relatively few rows match.
- **\`Bitmap Index Scan\` + \`Bitmap Heap Scan\`** (a pair, always together) — the index scan first builds an in-memory list ("bitmap") of *which table pages* contain a match, then the heap scan visits exactly those pages once each, fetching every matching row from them in one pass. This is often chosen over a plain \`Index Scan\` when a *moderate* number of rows match — few enough that scanning the whole table would be wasteful, but many enough that jumping to each individual row one at a time (as a plain \`Index Scan\` does) would revisit the same table pages repeatedly. Module 10's own examples in Lesson 1 showed this exact shape.
- **\`Index Only Scan\`** — like an \`Index Scan\`, but the index alone contains every column the query needs, so the table itself is never touched (Lesson 3 covers what this requires).

## Estimated vs actual: the #1 diagnostic signal

Plain \`EXPLAIN\` shows the planner's **estimated** row counts (suppressed here by \`COSTS OFF\` for determinism, but normally visible as \`rows=N\`); \`EXPLAIN ANALYZE\` additionally shows the **actual** row counts genuinely produced by each node. Comparing the two is one of the most useful diagnostic habits in all of query tuning:

- **Close agreement** between estimated and actual rows means the planner had accurate information to work with, and if the query is still slow, the plan shape itself (which indexes, which join strategy) is where to look.
- **A large mismatch** — the planner expected 10 rows and a node actually produced 100,000 — is a strong signal that the planner's statistics are stale or missing (run \`ANALYZE\`, or check whether autovacuum is keeping up), or that it cannot see a correlation between columns that a human would immediately notice. A bad row-count estimate early in a plan often cascades into a badly-chosen join strategy further up the tree, since every decision above that point was made based on the wrong number.

## Reading \`EXPLAIN ANALYZE\`'s per-node detail

\`\`\`
Bitmap Heap Scan on t (actual rows=10.00 loops=1)
  Recheck Cond: (val = 5)
  Heap Blocks: exact=5
  ->  Bitmap Index Scan on t_val_idx (actual rows=10.00 loops=1)
        Index Cond: (val = 5)
        Index Searches: 1
\`\`\`

- **\`actual rows\`** — how many rows this node genuinely produced (averaged, if the node ran more than once).
- **\`loops\`** — how many times this node executed. A node inside a \`Nested Loop\`'s inner side (Lesson 6) can run once *per outer row*, so \`loops=1000\` means it ran a thousand times — multiply \`actual rows\` by \`loops\` to get the true total rows produced.
- **\`Index Cond\` / \`Recheck Cond\` / \`Filter\`** — the condition each node applied. \`Index Cond\` is checked by the index itself (cheap); a plain \`Filter\` is checked row-by-row after fetching (more expensive per row); \`Recheck Cond\` re-verifies a bitmap scan's candidates against the real row.

(This lesson's examples omit \`TIMING\` and \`BUFFERS\` output — real timings vary run to run and machine to machine, and are not something a textbook can show you a "correct" number for; when tuning a real, live query, always include them, since actual elapsed time and physical/cached page reads are frequently the numbers that matter most.)

## The general workflow

1. Run \`EXPLAIN ANALYZE\` on the slow query.
2. Find the node with the biggest gap between estimated and actual rows, or the node consuming the largest share of total time.
3. Diagnose why: missing index, stale statistics, a query shape the planner can't optimize well, or genuinely too much data for the current approach.
4. Make one change (add an index, run \`ANALYZE\`, rewrite the query), and re-run \`EXPLAIN ANALYZE\` to confirm it actually helped.

This loop — measure, hypothesize, change one thing, re-measure — is the whole discipline of query tuning, and Lesson 6 closes the module by walking through it end to end.`,

    contentHi: `## \`EXPLAIN\` vs \`EXPLAIN ANALYZE\`

\`EXPLAIN\` PostgreSQL ke planner se poochta hai ki ye query execute karne ke liye kya **karега**, apne cost estimates aur statistics istemal karके, asal mein kuch bhi chalaye bina. Ye hamesha safe hai, ek \`DELETE\` ya \`UPDATE\` ke against bhi — kuch bhi badalta nahi.

\`EXPLAIN ANALYZE\` query ko **asal mein execute karता hai**, aur har step par jo genuinely hua wo report karta hai, original estimates ke saath. Ye tool hai ye pata karne ke liye ki kya planner ke guesses reality se match karte hain — par isे data likhने waale kisi bhi cheez ke against chalane mein deliberate raho.

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;
-- INTENDED plan dikhata hai, turant, chahe real query кितni bhi slow ho

EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
  SELECT * FROM t WHERE val = 5;
-- query ko asal mein CHALATA hai aur plan ke saath REAL row counts report karta hai
\`\`\`

## Tree padhna: andar-se-bahar, innermost-pehले

Ek plan **nodes** ka ek tree hai, har ek apne parent ke neeche indented. **Sabse gehरा indented node pehle chalता hai**; iska output theek iske upar waale node ko deता hai, aur aise upar tak, jo result produce karne waali aakhri cheez hai.

## Common scan node types

- **\`Seq Scan\`** — table ki har row padhता hai, har ek ko dikhाye gaye kisī \`Filter\` condition ke against test karте hue.
- **\`Index Scan\`** — ek B-tree index seedhe chalta hai, aur har matching index entry ke liye, turant table se wo ek row fetch karta hai.
- **\`Bitmap Index Scan\` + \`Bitmap Heap Scan\`** (ek jodi, hamesha saath) — index scan pehle ek in-memory list banata hai ki *kaunsi table pages* mein ek match hai, phir heap scan theek un pages ko ek-ek baar visit karta hai.
- **\`Index Only Scan\`** — ek \`Index Scan\` jaisा, par index akela har us column ko rakhता hai jo query ko chahiye, to table khud kabhi touch nahi hoती (Lesson 3).

## Estimated vs actual: #1 diagnostic signal

Plain \`EXPLAIN\` planner ke **estimated** row counts dikhaता hai; \`EXPLAIN ANALYZE\` additionally **actual** row counts dikhaता hai jo har node ne genuinely produce ki.

- **Close agreement** matlab planner ke paas kaam karne ke liye accurate information thi.
- **Ek badа mismatch** — planner ne 10 rows expect ki aur ek node ne asal mein 100,000 produce ki — ek strong signal hai ki planner ke statistics stale ya missing hain (\`ANALYZE\` chalao).

## \`EXPLAIN ANALYZE\`'s per-node detail padhna

- **\`actual rows\`** — is node ne genuinely кितni rows produce ki.
- **\`loops\`** — ye node кितni baar execute hua. \`loops=1000\` matlab ye ek hazar baar chala.
- **\`Index Cond\` / \`Recheck Cond\` / \`Filter\`** — har node ne jo condition apply ki.

## General workflow

1. Slow query par \`EXPLAIN ANALYZE\` chalao.
2. Estimated aur actual rows ke beech sabse badे gap waala node dhoondो.
3. Diagnose karo: missing index, stale statistics, ya genuinely bahut zyada data.
4. Ek change karo, dobara \`EXPLAIN ANALYZE\` chalao confirm karne ke liye ki ye actually madad ki.

Ye loop — measure, hypothesize, ek cheez badlो, dobara measure — poori query tuning discipline hai, aur Lesson 6 ise end to end walk karके module band karta hai.`,

    examples: [
      {
        title: 'Plain EXPLAIN shows the intended plan without running the query',
        titleHi: 'Plain EXPLAIN query chalaye bina intended plan dikhata hai',
        code: `CREATE TABLE t (id int PRIMARY KEY, val int);
INSERT INTO t SELECT g, g % 100 FROM generate_series(1, 1000) g;
CREATE INDEX ON t (val);
ANALYZE t;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val = 5;`,
        output: ` QUERY PLAN
--------------------------------------
 Bitmap Heap Scan on t
   Recheck Cond: (val = 5)
   ->  Bitmap Index Scan on t_val_idx
         Index Cond: (val = 5)
(4 rows)`,
        explain: "Plain `EXPLAIN (COSTS OFF)` reports the planner's intended plan — a `Bitmap Heap Scan on t` fed by a `Bitmap Index Scan on t_val_idx` — without ever executing the query, so this output appears instantly no matter how large the table or how slow the real query would be.",
        explainHi: 'Plain `EXPLAIN (COSTS OFF)` planner ka intended plan report karta hai — ek `Bitmap Heap Scan on t` jise ek `Bitmap Index Scan on t_val_idx` feed karta hai — query ko kabhi execute kiye bina, to ye output turant aata hai chahe table кितna bhi bada ho.',
      },
      {
        title: 'EXPLAIN ANALYZE runs the query and reports actual row counts per node',
        titleHi: 'EXPLAIN ANALYZE query chalata hai aur prati node actual row counts report karta hai',
        code: `CREATE TABLE t (id int PRIMARY KEY, val int);
INSERT INTO t SELECT g, g % 100 FROM generate_series(1, 1000) g;
CREATE INDEX ON t (val);
ANALYZE t;
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
  SELECT * FROM t WHERE val = 5;`,
        output: ` QUERY PLAN
------------------------------------------------------------------
 Bitmap Heap Scan on t (actual rows=10.00 loops=1)
   Recheck Cond: (val = 5)
   Heap Blocks: exact=5
   ->  Bitmap Index Scan on t_val_idx (actual rows=10.00 loops=1)
         Index Cond: (val = 5)
         Index Searches: 1
(6 rows)`,
        explain: '`EXPLAIN ANALYZE` genuinely runs the query, and each node now reports `actual rows=10.00 loops=1` alongside its condition — confirming exactly 10 rows were found at each step, plus extra detail like `Heap Blocks: exact=5` and `Index Searches: 1` that plain `EXPLAIN` never shows because it never actually executes anything.',
        explainHi: '`EXPLAIN ANALYZE` genuinely query chalata hai, aur har node ab apni condition ke saath `actual rows=10.00 loops=1` report karta hai — confirm karте hue ki har step par theek 10 rows mili, saath hi `Heap Blocks: exact=5` aur `Index Searches: 1` jaisā extra detail jo plain `EXPLAIN` kabhi nahi dikhaता kyunki ye kabhi kuch execute hi nahi karta.',
      },
      {
        title: 'A range condition over a moderate share of rows still uses the index via a bitmap scan',
        titleHi: 'Rows ke ek moderate hisse par ek range condition abhi bhi ek bitmap scan ke through index istemal karti hai',
        code: `CREATE TABLE t (id int PRIMARY KEY, val int);
INSERT INTO t SELECT g, g % 100 FROM generate_series(1, 1000) g;
CREATE INDEX ON t (val);
ANALYZE t;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val BETWEEN 5 AND 15;`,
        output: ` QUERY PLAN
--------------------------------------------------
 Bitmap Heap Scan on t
   Recheck Cond: ((val >= 5) AND (val <= 15))
   ->  Bitmap Index Scan on t_val_idx
         Index Cond: ((val >= 5) AND (val <= 15))
(4 rows)`,
        explain: '`val BETWEEN 5 AND 15` matches a moderate slice of the table (about 11%), and the planner still finds the index worthwhile: `Bitmap Heap Scan on t` with `Recheck Cond` and `Index Cond` both showing the full range condition `((val >= 5) AND (val <= 15))`, gathered from the index in one pass rather than scanning every row.',
        explainHi: '`val BETWEEN 5 AND 15` table ke ek moderate hisse se match karta hai (lgbhag 11%), aur planner phir bhi index ko worthwhile paата hai: `Bitmap Heap Scan on t` `Recheck Cond` aur `Index Cond` dono poori range condition `((val >= 5) AND (val <= 15))` dikhate hue, index se ek pass mein collect ki gayi har row padhne ke bajaye.',
      },
    ],

    mistakes: [
      {
        wrong: `-- running EXPLAIN ANALYZE against a DELETE/UPDATE "just to see the plan"
EXPLAIN ANALYZE DELETE FROM staging_import WHERE loaded_at < now() - interval '1 day';
-- this ACTUALLY DELETES the matching rows -- there is no dry-run mode here`,
        right: `-- to see the plan WITHOUT side effects, use plain EXPLAIN (no ANALYZE):
EXPLAIN (COSTS OFF) DELETE FROM staging_import WHERE loaded_at < now() - interval '1 day';
-- or wrap the EXPLAIN ANALYZE in a transaction you intend to roll back:
BEGIN;
EXPLAIN ANALYZE DELETE FROM staging_import WHERE loaded_at < now() - interval '1 day';
ROLLBACK;   -- undoes the actual delete, but you still saw the real EXPLAIN ANALYZE numbers`,
        why: 'EXPLAIN ANALYZE genuinely executes the statement it is explaining in order to report real, measured numbers, and that is true regardless of whether the statement is a SELECT or a data-modifying statement like DELETE or UPDATE. There is no built-in dry-run mode; if the statement would delete or change rows, EXPLAIN ANALYZE deletes or changes those rows for real, and the effect is not undone just because you ran it as part of an EXPLAIN command. If you need actual execution statistics for a write statement without keeping its effects, the safe pattern is to run it inside a transaction and roll back afterward, or, if you only need the intended plan rather than real timing and row counts, use plain EXPLAIN, which never executes anything.',
        whyHi: '`EXPLAIN ANALYZE` real, measured numbers report karne ke liye statement ko genuinely execute karta hai, aur ye sach hai chahe statement ek `SELECT` ho ya ek data-modifying statement jaisा `DELETE` ya `UPDATE`. Koi built-in dry-run mode nahi hai; agar statement rows delete ya badалta, `EXPLAIN ANALYZE` un rows ko asal mein delete ya badалta hai. Agar aapko bina effects rakhे ek write statement ke liye actual execution statistics chahiye, safe pattern ise ek transaction ke andar chalана aur baad mein rollback karna hai.',
      },
      {
        wrong: `-- concluding a query is "fixed" just because EXPLAIN (without ANALYZE) shows an index scan
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE customer_id = 42;
-- shows "Index Scan using orders_customer_id_idx" -- looks great!
-- but the actual query still takes 10 seconds in production`,
        right: `-- confirm with EXPLAIN ANALYZE what is REALLY happening, not just the plan SHAPE:
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE customer_id = 42;
-- e.g. reveals actual rows FAR exceeding the estimate, or a huge number of
-- "loops" from an enclosing join, or heavy disk reads (not cache hits) --
-- the plan SHAPE alone does not tell you WHERE the time actually goes`,
        why: 'Plain EXPLAIN shows only the planner\'s intended shape and its cost estimates, not what genuinely happens when the query runs. An index scan in the plan is a good sign, but it does not guarantee the query is fast in practice: the estimated row count feeding that plan could be badly wrong, the same node might be executed many times as the inner side of a join, or the data it needs might not be cached and require slow disk reads. EXPLAIN ANALYZE, ideally with BUFFERS, is what actually reveals these, by executing the query and reporting real row counts, loop counts, and buffer hit-versus-read numbers alongside the plan, which is why comparing estimated to actual, not just admiring the plan shape, is the real diagnostic step.',
        whyHi: 'Plain `EXPLAIN` sirf planner ka intended shape aur iske cost estimates dikhata hai, ye nahi ki query chalne par genuinely kya hota hai. Plan mein ek index scan ek achha sign hai, par ye guarantee nahi karta ki query practice mein fast hai: us plan ko feed karта estimated row count badly galat ho sakta hai, wahi node ek join ke inner side ke roop mein kई baar execute ho sakta hai, ya isे jo data chahiye wo cached na ho aur slow disk reads chahiye. `EXPLAIN ANALYZE`, ideally `BUFFERS` ke saath, asal mein ye reveal karta hai.',
      },
      {
        wrong: `-- ignoring a huge gap between estimated and actual rows
EXPLAIN (ANALYZE, COSTS OFF) SELECT * FROM t WHERE val = 5;
-- planner estimated ~1 row, actual rows=10.00 -- "close enough, moving on"
-- (this specific gap is small, but the HABIT of not checking it is the real mistake)`,
        right: `-- always compare estimated vs actual explicitly, and if they differ by orders
-- of magnitude anywhere in the plan, treat that as the FIRST thing to investigate:
ANALYZE t;   -- refresh statistics -- often closes the gap immediately
-- if the gap persists after ANALYZE, suspect a correlation the planner can't
-- model, or consider whether the query itself needs rewriting`,
        why: 'A large, unexplained gap between the row count the planner expected and the row count a node actually produced is one of the most reliable signals that something upstream of query performance is wrong, typically stale or missing statistics, but sometimes a correlation between columns that the planner\'s single-column statistics cannot capture. Every decision the planner makes above that node, which join strategy to use, whether to build a hash table, how much memory to allocate, is based on its row-count estimate, so a bad estimate early in a plan can cascade into a poorly chosen strategy much further up, even in parts of the plan that look unrelated at first glance. Making a habit of checking this comparison whenever tuning a query, rather than glancing only at which scan type was chosen, catches this class of problem before it is misdiagnosed as something else entirely.',
        whyHi: 'Planner ne jo row count expect ki aur ek node ne asal mein jo produce ki uske beech ek badа, unexplained gap query performance ke upstream mein kuch galat hone ka sabse reliable signal hai, typically stale ya missing statistics. Planner har decision jo us node ke upar leта hai iske row-count estimate par based hai, to ek plan mein pehle ka ek galat estimate bahut aage ek poorly chosen strategy mein cascade ho sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**A "why is this query slow" investigation that starts with `EXPLAIN ANALYZE` before touching any code** — the first, non-negotiable step in any real performance investigation.',
        hi: '**Ek "ye query slow kyun hai" investigation jo kisi bhi code touch karne se pehle `EXPLAIN ANALYZE` se shuru hoti hai** — kisi bhi real performance investigation mein pehla, non-negotiable step.',
      },
      {
        en: '**A monitoring dashboard that flags queries whose `EXPLAIN ANALYZE` estimated-vs-actual row ratio exceeds a threshold**, surfacing candidates for a missing index or a stale-statistics table before anyone files a ticket.',
        hi: '**Ek monitoring dashboard jo un queries ko flag karta hai jinka estimated-vs-actual row ratio ek threshold se zyada hai**.',
      },
      {
        en: '**A code-review rule requiring any performance-sensitive migration to attach an `EXPLAIN (ANALYZE, BUFFERS)` before/after comparison**, not just an assertion that "it should be faster now".',
        hi: '**Ek code-review rule jo kisi bhi performance-sensitive migration ko ek `EXPLAIN (ANALYZE, BUFFERS)` before/after comparison attach karne ki maang karta hai**.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `EXPLAIN` and `EXPLAIN ANALYZE`, and why should you be careful running the latter against a data-modifying statement?',
        qHi: '`EXPLAIN` aur `EXPLAIN ANALYZE` mein kya antar hai, aur aapko ek data-modifying statement ke against baad waala chalाने mein saawdhan kyun rehna chahiye?',
        a: 'Plain EXPLAIN asks the planner what it intends to do to execute a given statement, based on its cost model and the statistics it currently has, and reports that intended plan without running anything, which makes it always safe to use, even on a statement that would otherwise modify data. EXPLAIN ANALYZE goes further: it actually executes the statement, timing each step and counting the real rows each part of the plan produced, and reports those real numbers alongside the original estimates, which is what lets you see whether the planner\'s guesses matched reality. The critical consequence is that EXPLAIN ANALYZE has no dry-run mode: if the statement being explained is an INSERT, UPDATE, or DELETE, running it through EXPLAIN ANALYZE genuinely performs that insert, update, or delete, exactly as if you had run the bare statement, and the changes are not somehow reverted just because the command was wrapped in EXPLAIN. If you need to see the real execution statistics of a write statement without keeping its effects, the safe approach is to run it inside a transaction and roll back afterward, or to fall back to plain EXPLAIN if the intended plan shape alone is enough for your purposes.',
        aHi: 'Plain `EXPLAIN` planner se poochta hai ki ye ek diye gaye statement ko execute karne ke liye kya karне ka इरादा rakhता hai, iske cost model aur abhi ke statistics ke aadhaar par, aur kuch bhi chalaye bina wo intended plan report karta hai, jo ise hamesha safe banata hai. `EXPLAIN ANALYZE` aage jaता hai: ye statement ko asal mein execute karta hai. Critical consequence ye hai ki `EXPLAIN ANALYZE` mein koi dry-run mode nahi hai: agar explain kiya ja raha statement ek `INSERT`, `UPDATE`, ya `DELETE` hai, `EXPLAIN ANALYZE` se ise chalана genuinely wo insert, update, ya delete perform karta hai.',
      },
      {
        q: 'How do you read a plan tree, and what does a large gap between estimated and actual rows tell you?',
        qHi: 'Aap ek plan tree kaise padhте ho, aur estimated aur actual rows ke beech ek badа gap aapko kya bataता hai?',
        a: 'A plan is a tree of nodes shown with indentation, and the rule for reading it is that the most deeply indented node executes first; its output feeds directly into the node immediately above it, and so on up to the topmost node, which is the last thing to run and represents the final result. For a simple single-table query this might just be an index scan feeding a heap fetch, but for a query joining several tables the same rule applies at every level, with the deepest nodes being scans of individual tables and the nodes above them combining those results together. As for the gap between estimated and actual rows, which only EXPLAIN ANALYZE reveals since plain EXPLAIN only shows the estimate, it is one of the most useful diagnostic signals available. When the two are close, the planner had accurate information and, if the query is still slow, the issue likely lies in the plan\'s shape itself, missing indexes or a suboptimal join strategy. When there is a large gap, the planner expecting ten rows where a node actually produced a hundred thousand, that usually points to stale or missing table statistics, fixable by running ANALYZE, or to a correlation between columns the planner\'s statistics cannot represent. Because every decision made higher up in the tree depends on the row count estimate from lower down, a bad estimate early in the plan can cascade into poor choices, like an unsuitable join strategy, much further up, even in parts of the plan that look unrelated to the original problem.',
        aHi: 'Ek plan indentation ke saath dikhाye gaye nodes ka ek tree hai, aur ise padhne ka niyam ye hai ki sabse gehरा indented node pehle execute hota hai; iska output theek iske upar waale node mein jaata hai, aur aise topmost node tak, jo aakhri cheez hai jo chalti hai aur final result represent karti hai. Estimated aur actual rows ke beech gap ke baare mein, jo sirf `EXPLAIN ANALYZE` reveal karta hai, ye sabse useful diagnostic signals mein se ek hai. Jab dono close hain, planner ke paas accurate information thi. Jab ek badа gap hai, ye usually stale ya missing table statistics ki taraf point karta hai (`ANALYZE` chalाकर fixable), ya un columns ke beech ek correlation jise planner ke statistics represent nahi kar sakte.',
      },
    ],

    exercises: [
      {
        task: 'Table `t(id int PRIMARY KEY, val int)` with 1000 rows, an index on `val`, and `ANALYZE t` run. Compare `EXPLAIN (COSTS OFF)` and `EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)` on `SELECT * FROM t WHERE val = 5`. Identify which extra pieces of information the `ANALYZE` version adds.',
        taskHi: 'Table `t(id, val)` 1000 rows ke saath, `val` par ek index, aur `ANALYZE t` chalayi gayi. `SELECT * FROM t WHERE val = 5` par `EXPLAIN (COSTS OFF)` aur `EXPLAIN (ANALYZE, ...)` compare karo.',
        hint: 'Plain `EXPLAIN` shows only the node types and conditions. `EXPLAIN ANALYZE` adds `actual rows=N loops=N` to each node, plus (when not suppressed) `Heap Blocks`, `Index Searches`, timing, and buffer counts.',
        hintHi: 'Plain `EXPLAIN` sirf node types aur conditions dikhata hai. `EXPLAIN ANALYZE` har node mein `actual rows=N loops=N` add karta hai.',
      },
      {
        task: 'Using the same table, run `EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val BETWEEN 5 AND 15` and identify the two node types in the plan. Explain in a comment which one runs first (per the "most indented runs first" rule).',
        taskHi: 'Usi table ka istemal karke, `EXPLAIN (COSTS OFF) SELECT * FROM t WHERE val BETWEEN 5 AND 15` chalao aur plan mein do node types identify karo.',
        hint: '`Bitmap Index Scan` (more indented, child node) runs first, finding which rows match; `Bitmap Heap Scan` (parent node) runs second, fetching those specific rows from the table.',
        hintHi: '`Bitmap Index Scan` (zyada indented, child node) pehle chalta hai, ye dhoondte hue ki kaunsi rows match karti hain; `Bitmap Heap Scan` (parent node) doosra chalta hai.',
      },
      {
        task: 'In a comment (no SQL needed), explain why running `EXPLAIN ANALYZE DELETE FROM t WHERE id = 1` is NOT a safe, side-effect-free way to preview a delete\'s plan, and describe the safer alternative using a transaction.',
        taskHi: 'Ek comment mein (koi SQL zaroori nahi), samjhaओ ki `EXPLAIN ANALYZE DELETE FROM t WHERE id = 1` chalana ek delete ke plan ko preview karne ka ek safe, side-effect-free tarika KYUN NAHI hai.',
        hint: '`EXPLAIN ANALYZE` genuinely executes the statement to gather real timing/row-count data — for a `DELETE`, that means the row really gets deleted. Wrap it in `BEGIN; ... ; ROLLBACK;` to see the real numbers without keeping the effect.',
        hintHi: '`EXPLAIN ANALYZE` real timing/row-count data gather karne ke liye statement ko genuinely execute karta hai — ek `DELETE` ke liye, iska matlab hai row asal mein delete ho jaati hai. Effect rakhe bina real numbers dekhne ke liye ise `BEGIN; ... ; ROLLBACK;` mein wrap karo.',
      },
    ],

    keyTakeaways: [
      '`EXPLAIN` shows the INTENDED plan without running anything — always safe, even on a `DELETE`/`UPDATE`. `EXPLAIN ANALYZE` genuinely EXECUTES the statement and reports real per-node numbers alongside the estimates — NO dry-run mode, so it truly deletes/updates if that\'s what you\'re explaining (wrap in `BEGIN;...;ROLLBACK;` to preview safely).',
      'Read the plan tree INSIDE-OUT: the MOST INDENTED node runs FIRST; its output feeds the node directly above it, up to the topmost node which produces the final result. Same rule at every level, including joins (Lesson 6).',
      'Scan node types: `Seq Scan` (reads every row, tests a `Filter`). `Index Scan` (walks the index, fetches each match directly — good for FEW matches). `Bitmap Index Scan` + `Bitmap Heap Scan` (pair: builds a page-list from the index first, then fetches those pages once each — good for a MODERATE number of matches). `Index Only Scan` (never touches the table at all — Lesson 3).',
      '#1 DIAGNOSTIC SIGNAL: compare ESTIMATED rows (plain `EXPLAIN`) vs ACTUAL rows (`EXPLAIN ANALYZE`). Close agreement = planner had good info, look at plan SHAPE if still slow. Large gap = stale/missing statistics (`ANALYZE`) or an uncapturable correlation — and a bad estimate EARLY in a plan can cascade into a badly-chosen strategy FURTHER UP the tree.',
      'Per-node `EXPLAIN ANALYZE` detail: `actual rows` = real output count; `loops` = how many times the node ran (multiply `rows × loops` for the true total — a node inside a `Nested Loop`\'s inner side can run once per OUTER row). `Index Cond` (checked cheaply by the index) vs plain `Filter` (checked row-by-row after fetch, pricier) vs `Recheck Cond` (bitmap scan re-verifying candidates).',
      'A plan SHAPE that "looks right" (e.g. shows `Index Scan`) does NOT by itself prove the query is fast — always confirm with `EXPLAIN (ANALYZE, BUFFERS)` to see real row counts, loop counts, and cache-hit-vs-disk-read numbers; the shape alone doesn\'t show WHERE the time actually goes.',
      'THE WORKFLOW: run `EXPLAIN ANALYZE` on the slow query -> find the node with the biggest estimate/actual gap or largest time share -> diagnose (missing index / stale stats / unoptimizable shape) -> make ONE change -> re-run `EXPLAIN ANALYZE` to confirm. Measure, hypothesize, change one thing, re-measure (Lesson 6 walks this end to end).',
    ],
    keyTakeawaysHi: [
      '`EXPLAIN` kuch bhi chalaye bina INTENDED plan dikhata hai — `DELETE`/`UPDATE` par bhi hamesha safe. `EXPLAIN ANALYZE` genuinely statement EXECUTE karta hai — koi dry-run mode NAHI, to ye sach mein delete/update karta hai (safely preview karne ke liye `BEGIN;...;ROLLBACK;` mein wrap karo).',
      'Plan tree ko ANDAR-SE-BAHAR padhо: SABSE INDENTED node PEHLE chalta hai; iska output theek iske upar waale node ko deta hai.',
      'Scan node types: `Seq Scan` (har row padhta hai). `Index Scan` (index chalta hai, har match seedhe fetch karta hai — KAM matches ke liye achha). `Bitmap Index Scan` + `Bitmap Heap Scan` (jodi: pehle index se page-list banata hai — MODERATE sankhya matches ke liye achha). `Index Only Scan` (table ko kabhi touch nahi karta — Lesson 3).',
      '#1 DIAGNOSTIC SIGNAL: ESTIMATED rows vs ACTUAL rows compare karo. Close agreement = planner ke paas achhi info thi. Bada gap = stale/missing statistics (`ANALYZE`) ya ek uncapturable correlation.',
      'Prati-node `EXPLAIN ANALYZE` detail: `actual rows` = real output count; `loops` = node кितni baar chala (true total ke liye `rows × loops`). `Index Cond` (index dwara sasta check) vs plain `Filter` (row-by-row check, mehanga) vs `Recheck Cond`.',
      'Ek plan SHAPE jo "theek dikhta hai" apne aap prove NAHI karta ki query fast hai — hamesha `EXPLAIN (ANALYZE, BUFFERS)` se confirm karo.',
      'WORKFLOW: slow query par `EXPLAIN ANALYZE` chalao -> sabse bade gap waala node dhoondo -> diagnose karo -> EK change karo -> `EXPLAIN ANALYZE` dobara chalao confirm karne ke liye (Lesson 6 ise end to end walk karta hai).',
    ],
  },

  {
    slug: 'sql-composite-partial-and-expression-indexes',
    title: 'Composite, Partial & Expression Indexes',
    titleHi: 'Composite, Partial Aur Expression Indexes',
    description: 'A B-tree index does not have to be one plain column: it can span several columns (with a strict rule about which queries that helps), cover only a subset of rows, or index the result of an expression rather than a raw column value.',
    descriptionHi: 'Ek B-tree index ko ek plain column hona zaroori nahi: ye kई columns span kar sakta hai (ek strict rule ke saath ki wo kaunsi queries madad karta hai), sirf rows ke ek subset ko cover kar sakta hai, ya ek raw column value ke bजाय ek expression ke result ko index kar sakta hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A phone book sorted by last name, then first name — versus one sorted only by first name.** A phone book sorted "last name, then first name" lets you find every "Sharma" instantly, and within all the Sharmas, every "Sharma, Ravi" instantly too — because once you have narrowed to the Sharma section, the first names inside it are *also* in order. But if you only know someone\'s first name, "Ravi", that same book is useless for a fast lookup: Ravis are scattered across every last-name section of the book, in no particular order relative to each other, so you would be back to checking almost every page. That is the leading-prefix rule for a composite index: it helps a search on its first column alone, or its first column *plus* more columns after it, but not a search that skips straight to a later column. A **partial** phone book, deliberately printed only for people who moved in this year, is smaller and faster to search *if* that is who you are looking for — but useless for anyone who has lived there for a decade, since they were never printed in it at all. And an index on **`lower(email)`** is like a phone book sorted by a *rule* applied to each name — "ignore capitalization" — rather than by the name\'s raw spelling: it only helps a search that applies that exact same rule to what it is looking for.',
      hi: '**Ek phone book jo last name se, phir first name se sorted hai — us book ke muकаble jo sirf first name se sorted hai.** "last name, phir first name" se sorted ek phone book aapको turant har "Sharma" dhoondне deती hai, aur sabhi Sharmas ke andar, har "Sharma, Ravi" bhi turant — kyunki ek baar aap Sharma section tak narrow ho jaते ho, iske andar first names bhi order mein hain. Par agar aap sirf kisī ka first name jaante ho, "Ravi", wahi book ek fast lookup ke liye bekaar hai: Ravis book ke har last-name section mein bikhre hain. Yahi ek composite index ke liye leading-prefix rule hai: ye iske pehle column akele, ya pehle column *plus* iske baad ke columns, par ek search mein madad karта hai, par ek aisi search mein nahi jo seedhе ek baad ke column tak skip karti hai. Ek **partial** phone book, jaan-boojhkar sirf un logon ke liye print ki gayi jo is saal move hue, chhoti aur faster search karne ke liye hai *agar* aap unhe hi dhoond rahe ho. Aur \`lower(email)\` par ek index ek phone book ki tarah hai jo har naam par ek *rule* apply karके sorted hai.',
    },

    simple: `**Composite index — leading-prefix rule: helps a query on the first column, or the first column + more**

\`\`\`sql
CREATE TABLE t (a int, b int, c int);
CREATE INDEX ON t (a, b);
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE a = 1 AND b = 5;   -- USES the index
\`\`\`
\`\`\`
Bitmap Heap Scan on t
  Recheck Cond: ((a = 1) AND (b = 5))
  ->  Bitmap Index Scan on t_a_b_idx
        Index Cond: ((a = 1) AND (b = 5))
\`\`\`

**But skipping the FIRST column entirely means the index cannot help**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE b = 5;   -- does NOT use (a, b)
\`\`\`
\`\`\`
Seq Scan on t
  Filter: (b = 5)
-- "b" alone is like knowing a first name in a last-name-first phone book --
-- the (a, b) index has no useful order for this search
\`\`\`

**Partial index — indexes only rows matching a condition, smaller and faster for that slice**

\`\`\`sql
CREATE INDEX ON orders (status) WHERE status = 'pending';
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE status = 'pending';
\`\`\`
\`\`\`
Index Scan using orders_status_idx on orders
-- only the (typically rare) pending rows were ever added to this index at all
\`\`\`

**Expression index — indexes the RESULT of a function, not the raw column**

\`\`\`sql
CREATE INDEX ON t (lower(email));
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE lower(email) = 'user5@x.com';
\`\`\`
\`\`\`
Index Scan using t_lower_idx on t
  Index Cond: (lower(email) = 'user5@x.com'::text)
-- the QUERY must use the SAME expression for the index to match --
-- WHERE email = 'User5@X.com' would NOT use this index
\`\`\`

**Covering index (\`INCLUDE\`) — lets a query be answered from the index ALONE (Index Only Scan)**

\`\`\`sql
CREATE INDEX ON t (val) INCLUDE (extra_col);
-- a query selecting only "val" and "extra_col" MAY be answered without ever
-- touching the table -- but this ALSO requires VACUUM to have run recently
-- (the visibility map, not covered by a bare CREATE INDEX + ANALYZE)
\`\`\``,

    simpleHi: `**Composite index — leading-prefix rule: pehle column, ya pehle column + zyada par ek query mein madad**

\`\`\`sql
CREATE TABLE t (a int, b int, c int);
CREATE INDEX ON t (a, b);
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE a = 1 AND b = 5;   -- index ISTEMAL karta hai
\`\`\`
\`\`\`
Bitmap Heap Scan on t
  Recheck Cond: ((a = 1) AND (b = 5))
  ->  Bitmap Index Scan on t_a_b_idx
        Index Cond: ((a = 1) AND (b = 5))
\`\`\`

**Par PEHLE column ko poori tarah skip karna matlab index madad NAHI kar sakta**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE b = 5;   -- (a, b) ISTEMAL NAHI karta
\`\`\`
\`\`\`
Seq Scan on t
  Filter: (b = 5)
-- akela "b" ek last-name-first phone book mein first name jaанне jaisा hai
\`\`\`

**Partial index — sirf condition se match karti rows index karta hai, us slice ke liye chhotа aur fast**

\`\`\`sql
CREATE INDEX ON orders (status) WHERE status = 'pending';
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE status = 'pending';
\`\`\`
\`\`\`
Index Scan using orders_status_idx on orders
-- sirf (typically rare) pending rows kabhi is index mein add hui
\`\`\`

**Expression index — ek function ke RESULT ko index karta hai, raw column nahi**

\`\`\`sql
CREATE INDEX ON t (lower(email));
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE lower(email) = 'user5@x.com';
\`\`\`
\`\`\`
Index Scan using t_lower_idx on t
  Index Cond: (lower(email) = 'user5@x.com'::text)
-- QUERY ko index match karne ke liye SAME expression istemal karna hoga --
-- WHERE email = 'User5@X.com' is index ko ISTEMAL NAHI karегa
\`\`\`

**Covering index (\`INCLUDE\`) — ek query ko sirf index SE answer hone deta hai (Index Only Scan)**

\`\`\`sql
CREATE INDEX ON t (val) INCLUDE (extra_col);
-- ek query jo sirf "val" aur "extra_col" select karti hai table ko kabhi
-- touch kiye bina answer ho sakti hai -- par ise VACUUM recently chalne
-- ki bhi zaroorat hai (visibility map, ek bare CREATE INDEX + ANALYZE se covered nahi)
\`\`\``,

    content: `## Composite indexes and the leading-prefix rule

An index can span more than one column. A B-tree over \`(a, b)\` sorts entries first by \`a\`, and *within* each group of equal \`a\`, sorts by \`b\` — the same idea as a phone book sorted by last name, then first name.

\`\`\`sql
CREATE TABLE t (a int, b int, c int);
CREATE INDEX ON t (a, b);
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE a = 1 AND b = 5;
\`\`\`
\`\`\`
Bitmap Heap Scan on t
  Recheck Cond: ((a = 1) AND (b = 5))
  ->  Bitmap Index Scan on t_a_b_idx
        Index Cond: ((a = 1) AND (b = 5))
\`\`\`

This composite index equally helps a query on **just \`a\`** (\`WHERE a = 1\`) — the leading column alone is still a usable prefix. What it does **not** help is a query that filters on \`b\` **without** also filtering on \`a\`:

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE b = 5;
\`\`\`
\`\`\`
Seq Scan on t
  Filter: (b = 5)
\`\`\`

This is the **leading-prefix rule**: a composite index on \`(a, b, c)\` can serve a query filtering on \`a\`, or \`a AND b\`, or \`a AND b AND c\` — always starting from the leftmost column — but **not** a query that filters on \`b\` alone, or \`c\` alone, or \`b AND c\` without \`a\`, because none of those searches can use the index's sort order (values are sorted by \`a\` first; without constraining \`a\`, the \`b\` values of interest are scattered throughout the whole index). **Column order in a composite index is a design decision**: put the column most often queried alone, or most selective, first.

## Partial indexes

A partial index includes only the rows matching a \`WHERE\` condition specified at creation time — smaller, faster to scan, and cheaper to maintain, at the cost of only being usable for queries matching (or implying) that same condition.

\`\`\`sql
CREATE INDEX ON orders (status) WHERE status = 'pending';
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE status = 'pending';
\`\`\`
\`\`\`
Index Scan using orders_status_idx on orders
\`\`\`

This is ideal when a query repeatedly targets a **small, well-defined slice** of a much larger table — a queue of \`'pending'\` rows in a table where most rows are \`'done'\` — because the index never grows with the (irrelevant, for this query) bulk of the table, and every write to a \`'done'\` row skips updating this index entirely.

## Expression indexes

Instead of indexing a column's raw value, you can index the result of a computed expression:

\`\`\`sql
CREATE INDEX ON t (lower(email));
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE lower(email) = 'user5@x.com';
\`\`\`
\`\`\`
Index Scan using t_lower_idx on t
  Index Cond: (lower(email) = 'user5@x.com'::text)
\`\`\`

This is how you index a **case-insensitive lookup** without storing a separate lowercased column: the index stores \`lower(email)\` values, sorted, and a query is only served by it if the query's own \`WHERE\` clause applies the **identical expression** — \`WHERE lower(email) = ...\` matches; \`WHERE email = ...\` (no \`lower()\`) does **not**, because the raw \`email\` column has no index of its own here. Expression indexes generalize to any deterministic expression: \`(a + b)\`, \`(date_trunc('day', created_at))\`, a JSON field extraction, and so on.

## Covering indexes (\`INCLUDE\`) and \`Index Only Scan\`

If every column a query needs is present in an index — either as an indexed (searchable) column or an \`INCLUDE\`d one — PostgreSQL can, in principle, answer the query from the index alone, without ever visiting the table:

\`\`\`sql
CREATE INDEX ON t (val) INCLUDE (extra_col);
-- a query selecting only val and extra_col, filtering on val, can be served
-- entirely from this index
\`\`\`

\`INCLUDE\`d columns are stored in the index for retrieval but are **not** part of its sort order or search key — they exist purely so a query can read them "for free" once the index has already been walked. **This is only realized as an \`Index Only Scan\` if PostgreSQL's visibility map confirms every relevant page is "all visible"** — a status \`VACUUM\` establishes (Module 9's MVCC lesson explained why: newly written rows have not yet been confirmed visible to everyone, so the table must still be checked). A table that has just been loaded and indexed, with no \`VACUUM\` yet run, typically still shows a \`Bitmap Heap Scan\`/\`Index Scan\` touching the table even for a query that only needs indexed columns — the *plan* becomes an \`Index Only Scan\` only after \`VACUUM\` has run and the visibility map is current.

## Choosing among these

- **Composite**: queries reliably filter on more than one column together, in a consistent leading pattern.
- **Partial**: queries reliably target a small, identifiable slice of a much larger table.
- **Expression**: queries reliably filter using the same computed expression, not the raw column.
- **Covering (\`INCLUDE\`)**: a specific, frequently-run query only needs a handful of columns, and avoiding the table visit entirely (once \`VACUUM\`ed) is worth the extra index size.

All four still carry the same fundamental cost from Lesson 1 — every one of them is extra work on every write to the columns they cover — so the same discipline applies: build them because a specific, observed query pattern calls for exactly that shape, not speculatively.`,

    contentHi: `## Composite indexes aur leading-prefix rule

Ek index ek se zyada column span kar sakta hai. \`(a, b)\` par ek B-tree entries ko pehle \`a\` se sort karta hai, aur equal \`a\` ke har group ke *andar*, \`b\` se sort karta hai.

\`\`\`sql
CREATE TABLE t (a int, b int, c int);
CREATE INDEX ON t (a, b);
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE a = 1 AND b = 5;
\`\`\`
\`\`\`
Bitmap Heap Scan on t
  Recheck Cond: ((a = 1) AND (b = 5))
  ->  Bitmap Index Scan on t_a_b_idx
        Index Cond: ((a = 1) AND (b = 5))
\`\`\`

Ye composite index barабar EK query mein bhi madad karta hai **sirf \`a\`** par (\`WHERE a = 1\`) — leading column akela bhi ek usable prefix hai. Jo ye madad **nahi** karta wo ek query hai jo \`a\` ko **bina** filter kiye \`b\` par filter karти hai:

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE b = 5;
\`\`\`
\`\`\`
Seq Scan on t
  Filter: (b = 5)
\`\`\`

Ye **leading-prefix rule** hai: \`(a, b, c)\` par ek composite index \`a\` par, ya \`a AND b\` par, ya \`a AND b AND c\` par ek query serve kar sakta hai — hamesha leftmost column se shuru — par ek aisī query nahi jo akele \`b\` par filter karti hai. **Composite index mein column order ek design decision hai**: sabse aksar akele query hone waale, ya sabse selective, column ko pehle rakho.

## Partial indexes

Ek partial index sirf wo rows include karta hai jo creation time par specify ki gayi ek \`WHERE\` condition se match karti hain.

\`\`\`sql
CREATE INDEX ON orders (status) WHERE status = 'pending';
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE status = 'pending';
\`\`\`
\`\`\`
Index Scan using orders_status_idx on orders
\`\`\`

Ye tab ideal hai jab ek query baar-baar ek bahut bade table ke ek **chhote, well-defined slice** ko target karti hai.

## Expression indexes

Ek column ki raw value index karne ke bजаय, aap ek computed expression ka result index kar sakte ho:

\`\`\`sql
CREATE INDEX ON t (lower(email));
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE lower(email) = 'user5@x.com';
\`\`\`
\`\`\`
Index Scan using t_lower_idx on t
  Index Cond: (lower(email) = 'user5@x.com'::text)
\`\`\`

Ye ek **case-insensitive lookup** ko ek alag lowercased column store kiye bina index karne ka tarika hai: index \`lower(email)\` values store karta hai, sorted, aur ek query isse sirf tab serve hoती hai jab query ka apna \`WHERE\` clause **wahi expression** apply karta hai.

## Covering indexes (\`INCLUDE\`) aur \`Index Only Scan\`

Agar ek query ko chahiye har column ek index mein maujood hai, PostgreSQL, principle mein, query ko sirf index se answer kar sakta hai, table ko kabhi visit kiye bina:

\`\`\`sql
CREATE INDEX ON t (val) INCLUDE (extra_col);
\`\`\`

\`INCLUDE\`d columns retrieval ke liye index mein store hote hain par iske sort order ya search key ka hissa **nahi** hain. **Ye sirf ek \`Index Only Scan\` ke roop mein realize hota hai agar PostgreSQL ka visibility map confirm karta hai ki har relevant page "all visible" hai** — ek status jo \`VACUUM\` establish karta hai. Ek table jise abhi load aur index kiya gaya, koi \`VACUUM\` chale bina, typically ek \`Bitmap Heap Scan\`/\`Index Scan\` dikhaता hai jo table ko touch karta hai us query ke liye bhi jise sirf indexed columns chahiye.

## Inके beech chunна

- **Composite**: queries reliably ek se zyada column par saath filter karti hain.
- **Partial**: queries reliably ek bahut badे table ke ek chhoटे, identifiable slice ko target karti hain.
- **Expression**: queries reliably usī computed expression istemal karके filter karti hain.
- **Covering (\`INCLUDE\`)**: ek specific, frequently-run query ko sirf кुछ columns chahiye.

Chaаron abhi bhi Lesson 1 wahi fundamental cost le jaते hain — inмें se har ek unhe cover karne waale columns par har write par extra kaam hai — to wahi discipline apply hoती hai: unhe banaओ kyunki ek specific, observed query pattern ko theek wo shape chahiye, speculatively nahi.`,

    examples: [
      {
        title: 'A composite index serves a query filtering on both columns in order',
        titleHi: 'Ek composite index ek query serve karta hai jo dono columns ko order mein filter karti hai',
        code: `CREATE TABLE t (a int, b int, c int);
INSERT INTO t SELECT g % 10, g % 100, g FROM generate_series(1, 2000) g;
CREATE INDEX ON t (a, b);
ANALYZE t;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE a = 1 AND b = 5;`,
        output: ` QUERY PLAN
-------------------------------------------
 Bitmap Heap Scan on t
   Recheck Cond: ((a = 1) AND (b = 5))
   ->  Bitmap Index Scan on t_a_b_idx
         Index Cond: ((a = 1) AND (b = 5))
(4 rows)`,
        explain: 'The composite index on `(a, b)` sorts by `a` first, then `b` within each `a` group — so a query constraining both, `a = 1 AND b = 5`, is a usable leading-and-second-column match, producing `Bitmap Heap Scan on t` fed by `Bitmap Index Scan on t_a_b_idx` with both conditions in `Index Cond`.',
        explainHi: '`(a, b)` par composite index pehle `a` se sort karta hai, phir har `a` group ke andar `b` se — to ek query jo dono constrain karti hai, `a = 1 AND b = 5`, ek usable leading-aur-doosra-column match hai, `Bitmap Heap Scan on t` produce karte hue jise `Bitmap Index Scan on t_a_b_idx` feed karta hai dono conditions `Index Cond` mein.',
      },
      {
        title: 'The same composite index cannot serve a query that skips the leading column',
        titleHi: 'Wahi composite index ek aisi query serve nahi kar sakta jo leading column skip karti hai',
        code: `CREATE TABLE t (a int, b int, c int);
INSERT INTO t SELECT g % 10, g % 100, g FROM generate_series(1, 2000) g;
CREATE INDEX ON t (a, b);
ANALYZE t;
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE b = 5;`,
        output: ` QUERY PLAN
-------------------
 Seq Scan on t
   Filter: (b = 5)
(2 rows)`,
        explain: 'Filtering on `b = 5` alone skips the leading column `a` entirely, so the `(a, b)` index has no usable prefix for this query — matching `b` values are scattered across every `a` group in the index, not grouped together anywhere findable, so the planner correctly falls back to `Seq Scan on t` with `Filter: (b = 5)`.',
        explainHi: 'Sirf `b = 5` par filter karна leading column `a` ko poori tarah skip karta hai, to `(a, b)` index ke paas is query ke liye koi usable prefix nahi hai — matching `b` values index mein har `a` group ke across bikhri hain, kahin bhi ek saath grouped nahi, to planner sahi se `Seq Scan on t` par `Filter: (b = 5)` ke saath fall back karta hai.',
      },
      {
        title: 'A partial index only covers rows matching its own WHERE condition',
        titleHi: 'Ek partial index sirf apni WHERE condition se match karti rows cover karta hai',
        code: `CREATE TABLE orders (id int PRIMARY KEY, status text, amt int);
INSERT INTO orders SELECT g, CASE WHEN g % 20 = 0 THEN 'pending' ELSE 'done' END, g
  FROM generate_series(1, 2000) g;
CREATE INDEX ON orders (status) WHERE status = 'pending';
ANALYZE orders;
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE status = 'pending';`,
        output: ` QUERY PLAN
----------------------------------------------
 Index Scan using orders_status_idx on orders
(1 row)`,
        explain: "The partial index `ON orders (status) WHERE status = 'pending'` was only ever built over the rare `'pending'` rows (5% of the table), so it stays small and cheap to scan — the query's own condition matches exactly what the index was restricted to, producing a clean `Index Scan using orders_status_idx on orders` with no `Filter` or `Recheck` needed at all.",
        explainHi: "Partial index `ON orders (status) WHERE status = 'pending'` sirf kabhi rare `'pending'` rows (table ka 5%) par bani thi, to ye chhoti aur scan karne mein sasti rehти hai — query ki apni condition theek wahi match karti hai jispar index restrict thi, ek saaf `Index Scan using orders_status_idx on orders` produce karte hue bina kisī `Filter` ya `Recheck` ki zaroorat ke.",
      },
    ],

    mistakes: [
      {
        wrong: `-- a composite index built in the wrong column order for the actual queries
CREATE INDEX ON events (event_type, occurred_at);
-- but the application almost always filters by occurred_at ALONE (a time range
-- report), and only occasionally also filters by event_type
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE occurred_at > now() - interval '1 day';
-- Seq Scan -- the leading column is event_type, not occurred_at, so this
-- common query gets no benefit from the index at all`,
        right: `CREATE INDEX ON events (occurred_at, event_type);
-- now the common "filter by time range alone" query uses the index directly,
-- and the occasional "time range AND event_type" query still benefits too`,
        why: 'A composite index only serves a query that constrains its leading column, or its leading column plus more columns after it, in order; it cannot serve a query that constrains a later column without also constraining the columns before it. If the actual, observed query pattern filters mostly by occurred_at alone and only sometimes additionally by event_type, putting event_type first makes the index useless for the common case, because occurred_at alone is not a usable prefix of an (event_type, occurred_at) index. Ordering the columns to match how queries genuinely constrain them, most commonly and independently queried column first, is what makes a composite index actually earn its write-time cost.',
        whyHi: 'Ek composite index sirf ek query serve karta hai jo iske leading column ko constrain karти hai, order mein; ye ek aisi query serve nahi kar sakta jo ek baad ke column ko constrain karti hai bina iske pehle ke columns ko bhi constrain kiye. Agar actual, observed query pattern zyadатार sirf `occurred_at` se filter karta hai, `event_type` ko pehle rakhna common case ke liye index ko bekaar banata hai. Columns ko us tarike se order karna jise queries genuinely constrain karti hain, sabse common, independently query hone waale column pehle, ye hai jo ek composite index ko iski write-time cost genuinely kamаने deta hai.',
      },
      {
        wrong: `-- creating an expression index, but the query doesn't use the matching expression
CREATE INDEX ON t (lower(email));
EXPLAIN (COSTS OFF) SELECT * FROM t WHERE email = 'user5@x.com';   -- no lower()!
-- Seq Scan -- the index on lower(email) has no relationship to a bare "email" filter`,
        right: `EXPLAIN (COSTS OFF) SELECT * FROM t WHERE lower(email) = lower('user5@x.com');
-- (or, if the query is always case-sensitive-exact, index the raw column instead)
-- the WHERE clause must apply the SAME expression the index was built on`,
        why: 'An expression index stores the result of applying a specific expression to each row, sorted by that computed value, not by the raw column\'s own value. PostgreSQL can only use the index when a query\'s condition is written in terms of that identical expression, because that is the only form whose values the index actually contains in sorted order; a plain comparison on the raw column has nothing to do with the separately stored, transformed values. Building an index on lower(email) and then querying with a bare email condition creates an index that simply cannot be matched to that query, and the planner correctly falls back to a sequential scan rather than using an index it cannot logically apply.',
        whyHi: 'Ek expression index har row par ek specific expression apply karne ka result store karta hai, us computed value se sorted, raw column ki apni value se nahi. PostgreSQL index tabhi istemal kar sakta hai jab ek query ki condition usī identical expression ke roop mein likhi ho, kyunki wo ekmatra form hai jiski values index asal mein sorted order mein rakhta hai. `lower(email)` par ek index banакर phir ek bare `email` condition se query karna ek index banata hai jise us query se match hi nahi kiya ja sakta.',
      },
      {
        wrong: `-- expecting a covering index to produce an Index Only Scan immediately after loading data
CREATE TABLE t (id int PRIMARY KEY, val int, extra text);
INSERT INTO t SELECT g, g % 100, 'x' || g FROM generate_series(1, 1000) g;
CREATE INDEX ON t (val) INCLUDE (extra);
ANALYZE t;
EXPLAIN (COSTS OFF) SELECT extra FROM t WHERE val = 5;
-- STILL shows Bitmap Heap Scan / a table visit -- not the expected Index Only Scan`,
        right: `-- VACUUM is what populates the visibility map that Index Only Scan depends on --
-- ANALYZE alone does not establish it:
VACUUM t;   -- (run as its own statement, outside any explicit transaction)
EXPLAIN (COSTS OFF) SELECT extra FROM t WHERE val = 5;
-- NOW an Index Only Scan becomes possible`,
        why: 'Index Only Scan requires more than just having every needed column present in the index; it also requires PostgreSQL to be confident, via the visibility map, that the table pages holding the candidate rows are entirely visible to the current transaction, meaning no row on that page could still be invisible due to a recent, not-yet-vacuumed change. That confirmation is specifically what VACUUM establishes, not ANALYZE, which only refreshes planner statistics about row counts and distributions. A table that has just been bulk-loaded and freshly indexed has not had this visibility confirmed yet, so even a query needing only indexed and included columns still falls back to visiting the table to double-check visibility, until VACUUM has had a chance to run.',
        whyHi: 'Index Only Scan ko sirf ye zaroorat nahi hai ki index mein har zaroori column maujood ho; ise ye bhi zaroorat hai ki PostgreSQL, visibility map ke through, confident ho ki candidate rows rakhने waali table pages current transaction ke liye poori tarah visible hain. Wo confirmation specifically wo hai jo `VACUUM` establish karta hai, `ANALYZE` nahi. Ek table jise abhi bulk-loaded aur freshly indexed kiya gaya iski visibility abhi confirm nahi hui, to ek query jise sirf indexed aur included columns chahiye phir bhi table visit karne par fall back karti hai jab tak `VACUUM` ko chalne ka mौका na mile.',
      },
    ],

    realWorld: [
      {
        en: '**A `(tenant_id, created_at)` composite index in a multi-tenant SaaS schema** — nearly every query already filters by `tenant_id`, so it leads the index and every such query benefits.',
        hi: '**Ek multi-tenant SaaS schema mein ek `(tenant_id, created_at)` composite index** — lgभग har query pehle se `tenant_id` se filter karti hai.',
      },
      {
        en: '**A partial index on `orders (id) WHERE status = \'pending\'`** powering a background worker\'s queue query, staying tiny and fast regardless of how many millions of completed orders accumulate.',
        hi: '**`orders (id) WHERE status = \'pending\'` par ek partial index** ek background worker ki queue query ko power karta hai.',
      },
      {
        en: '**`CREATE INDEX ON users (lower(email))`** to support case-insensitive login lookups without duplicating email storage in a separate normalized column.',
        hi: '**`CREATE INDEX ON users (lower(email))`** case-insensitive login lookups support karne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the leading-prefix rule for composite indexes, and how does it affect column order?',
        qHi: 'Composite indexes ke liye leading-prefix rule kya hai, aur ye column order ko kaise affect karta hai?',
        a: 'A composite index over several columns sorts its entries by the first column, and within each group sharing the same first-column value, sorts by the second column, and so on. Because of this layered sort order, the index can only be used to efficiently narrow a search when the query constrains a prefix of the indexed columns starting from the leftmost one: a condition on just the first column works, as does a condition on the first and second together, and so on, but a condition on the second column alone, without also constraining the first, gains nothing from the index, because values matching that second-column condition are scattered throughout the entire index rather than being grouped together anywhere findable without first narrowing by the first column. This makes column order a genuine design decision rather than an arbitrary choice: the column most frequently queried on its own, or most selective, should generally come first, so that the largest possible number of real queries can use at least a usable prefix of the index, rather than ordering columns in whatever order they happen to appear in the table definition.',
        aHi: 'Kई columns par ek composite index apni entries ko pehle column se sort karta hai, aur usī pehle-column value share karne waale har group ke andar, doosre column se sort karta hai. Is layered sort order ki wajah se, index ko efficiently ek search narrow karne ke liye sirf tab istemal kiya ja sakta hai jab query indexed columns ke ek prefix ko constrain karti hai leftmost se shuru hoते hue: sirf pehle column par ek condition kaam karta hai, jaisा pehle aur doosre par saath ek condition, par akele doosre column par ek condition, pehle ko bhi constrain kiye bina, index se kuch nahi paati.',
      },
      {
        q: 'What is the difference between a partial index and an expression index, and when would you use each?',
        qHi: 'Ek partial index aur ek expression index mein kya antar hai, aur aap har ek kab istemal karоge?',
        a: 'A partial index restricts which rows are included based on a WHERE condition specified when the index is created, so it is a smaller structure covering only a subset of the table\'s rows, and it can only serve queries whose own condition matches or logically implies that same restriction. It is the right choice when a query pattern reliably targets a small, identifiable slice of a much larger table, such as a queue of pending items in a table where the overwhelming majority of rows are already completed; the index stays small and cheap to maintain because rows outside that slice are never added to it at all. An expression index, by contrast, still covers every row, but indexes the result of applying a computed expression to each row\'s data rather than the raw column value itself, for example the lowercased form of an email address. It is the right choice when queries reliably filter using that same computed transformation rather than the raw column, most commonly to support a case-insensitive or otherwise normalized lookup without having to store a separate, duplicated column holding the transformed value. The two solve different problems, restricting which rows are indexed versus changing what value is indexed for every row, and a schema can certainly use both together, for instance a partial expression index.',
        aHi: 'Ek partial index ye restrict karta hai ki kaunsi rows include hain ek `WHERE` condition ke aadhaar par jo index create hote waqt specify ki gayi, to ye ek chhota structure hai jo sirf table ki rows ka ek subset cover karta hai, aur ye sirf un queries ko serve kar sakta hai jinki apni condition wahi restriction match ya logically imply karti hai. Ye sahi choice hai jab ek query pattern reliably ek bahut badे table ke ek chhoटे, identifiable slice ko target karta hai. Ek expression index, iske viparit, phir bhi har row cover karta hai, par har row ke data par ek computed expression apply karne ke result ko index karta hai, raw column value ko nahi.',
      },
    ],

    exercises: [
      {
        task: 'Table `t(a int, b int, c int)` with 2000 rows and a composite index on `(a, b)`. Confirm `WHERE a = 1 AND b = 5` uses the index (a `Bitmap Heap Scan`/`Bitmap Index Scan` pair), then confirm `WHERE b = 5` alone falls back to a `Seq Scan`.',
        taskHi: 'Table `t(a, b, c)` 2000 rows aur `(a, b)` par ek composite index ke saath. Confirm karo `WHERE a = 1 AND b = 5` index istemal karta hai, phir confirm karo akela `WHERE b = 5` `Seq Scan` par fall back karta hai.',
        hint: '`(a, b)` sorts by `a` first. A query on `b` alone cannot use that sort order to narrow anything — matching `b` values are scattered across every `a` group.',
        hintHi: '`(a, b)` pehle `a` se sort karta hai. Akele `b` par ek query us sort order ko kuch narrow karne ke liye istemal nahi kar sakti.',
      },
      {
        task: 'Table `orders(id int PRIMARY KEY, status text, amt int)` with 2000 rows, 5% `\'pending\'` and the rest `\'done\'`. Create a partial index `ON orders (status) WHERE status = \'pending\'`, `ANALYZE`, and confirm `WHERE status = \'pending\'` uses it (`Index Scan`).',
        taskHi: 'Table `orders(id, status, amt)` 2000 rows ke saath, 5% `\'pending\'` aur baaki `\'done\'`. Ek partial index `ON orders (status) WHERE status = \'pending\'` banao, `ANALYZE`, aur confirm karo `WHERE status = \'pending\'` ise istemal karta hai.',
        hint: 'A partial index built specifically for `status = \'pending\'` matches this exact query condition, and since only 5% of rows are ever in it, it is small enough that a plain `Index Scan` (rather than a bitmap one) is efficient here.',
        hintHi: 'Specifically `status = \'pending\'` ke liye bani ek partial index theek is query condition se match karti hai, aur kyunki sirf 5% rows kabhi ismein hain, ye itni chhoti hai ki ek plain `Index Scan` efficient hai.',
      },
      {
        task: 'Table `t(email text)` with 1000 rows. Create `CREATE INDEX ON t (lower(email))`, `ANALYZE`, and confirm `WHERE lower(email) = \'user5@x.com\'` uses `Index Scan using t_lower_idx`. Then explain in a comment why `WHERE email = \'user5@x.com\'` (no `lower()`) would NOT use this same index.',
        taskHi: 'Table `t(email)` 1000 rows ke saath. `CREATE INDEX ON t (lower(email))` banao, `ANALYZE`, aur confirm karo `WHERE lower(email) = \'user5@x.com\'` `Index Scan using t_lower_idx` istemal karta hai.',
        hint: 'The index stores `lower(email)` values, not raw `email` values. A query filtering on the raw `email` column has no relationship to the separately-stored, transformed values the index actually contains.',
        hintHi: 'Index `lower(email)` values store karta hai, raw `email` values nahi. Raw `email` column par filter karti ek query ka un alag-se-stored, transformed values se koi relationship nahi jo index asal mein rakhta hai.',
      },
    ],

    keyTakeaways: [
      'COMPOSITE index `(a, b)`: sorts by `a` first, then `b` WITHIN each `a` group. LEADING-PREFIX RULE: serves a query on `a` alone, or `a AND b`, or `a AND b AND c` (for a 3-column index) — always starting from the LEFTMOST column. Does NOT serve a query on `b` alone (or any later column without the ones before it) — those values are scattered throughout the index.',
      'Column ORDER in a composite index is a DESIGN DECISION: put the column most often queried alone, or most selective, FIRST — so the widest range of real queries gets at least a usable prefix.',
      'PARTIAL index: `CREATE INDEX ... WHERE condition` — only rows matching that condition are indexed. Smaller, faster, cheaper to maintain (writes to non-matching rows skip it entirely) — ideal for a small, well-defined slice of a much larger table (a `\'pending\'` queue in a mostly-`\'done\'` table).',
      'EXPRESSION index: `CREATE INDEX ... (expr)` indexes the RESULT of a computed expression, not the raw column. The query\'s `WHERE` must use the IDENTICAL expression to match (`WHERE lower(email) = ...` uses `INDEX ON (lower(email))`; a bare `WHERE email = ...` does NOT). Common for case-insensitive lookups without a duplicate lowercased column.',
      'COVERING index (`INCLUDE`): stores extra columns for retrieval-only (not part of the sort/search key), so a query needing only indexed + included columns MAY be answered from the index alone — an `Index Only Scan`, never touching the table.',
      '`Index Only Scan` ALSO requires the visibility map (set by `VACUUM`, NOT `ANALYZE`) to confirm the relevant pages are "all visible" (Module 9\'s MVCC connection). A freshly loaded + indexed + analyzed (but not yet vacuumed) table still shows a table-visiting scan even for an index-only-shaped query.',
      'All four (composite/partial/expression/covering) carry the SAME Lesson-1 write-cost trade-off — build them for a specific, OBSERVED query shape, not speculatively.',
    ],
    keyTakeawaysHi: [
      'COMPOSITE index `(a, b)`: pehle `a` se sort, phir har `a` group ke ANDAR `b` se. LEADING-PREFIX RULE: akele `a` par, ya `a AND b` par, ya `a AND b AND c` par ek query serve karta hai — hamesha LEFTMOST column se shuru. Akele `b` par ek query serve NAHI karta.',
      'Composite index mein column ORDER ek DESIGN DECISION hai: sabse aksar akele query hone waale, ya sabse selective, column ko PEHLE rakho.',
      'PARTIAL index: `CREATE INDEX ... WHERE condition` — sirf condition se match karti rows index hoती hain. Chhota, fast, maintain karne mein sasta — ek bahut bade table ke ek chhoटे, well-defined slice ke liye ideal.',
      'EXPRESSION index: `CREATE INDEX ... (expr)` ek computed expression ke RESULT ko index karta hai, raw column nahi. Query ke `WHERE` ko match karne ke liye IDENTICAL expression istemal karna hoga.',
      'COVERING index (`INCLUDE`): retrieval-ke-liye-sirf extra columns store karta hai, to sirf indexed + included columns chahne waali ek query sirf index se answer ho sakti hai — ek `Index Only Scan`, table ko kabhi touch kiye bina.',
      '`Index Only Scan` ko ye bhi chahiye ki visibility map (`VACUUM` se set, `ANALYZE` se NAHI) confirm kare ki relevant pages "all visible" hain. Ek freshly loaded + indexed + analyzed (par abhi tak vacuumed nahi) table abhi bhi ek table-visiting scan dikhaता hai.',
      'Chaаron (composite/partial/expression/covering) SAME Lesson-1 write-cost trade-off le jaते hain — unhe ek specific, OBSERVED query shape ke liye banaओ, speculatively nahi.',
    ],
  },
];
