/**
 * Databases Complete Course — Module 20: The Database Landscape & Choosing, lessons 1-3.
 * Part V, and the final module of the course.
 *
 * Lesson 1: Columnar & analytical stores — OLTP vs OLAP, row vs column storage,
 *           compression + vectorized execution, warehouses/lakehouses, getting data in.
 * Lesson 2: Graph, time-series & search engines — three specialized paradigms and
 *           the access pattern each one is built for.
 * Lesson 3: Wide-column & distributed key-value at scale — partition keys, query-first
 *           modeling, tunable consistency, linear scale, and when you actually need it.
 *
 * NOTE: This module is a conceptual survey. Its examples are illustrative —
 * schema sketches, query comparisons, and config, not machine-verified.
 */

import type { CourseLesson } from './course-js-module1';

export const DB_LANDSCAPE: CourseLesson[] = [
  {
    slug: 'db-columnar-and-analytical-stores',
    title: 'Columnar & Analytical Stores',
    titleHi: 'Columnar Aur Analytical Stores',
    description: 'Transactional databases store rows together and are tuned for reading and writing whole records. Analytical queries scan millions of rows but touch few columns, so analytical databases store each column together, compress it hard, and process it in vectorized batches — often 100x faster for aggregation, and useless for a single-row lookup.',
    descriptionHi: 'Transactional databases rows ko saath store karte hain aur poore records read/write karne ke liye tuned hain. Analytical queries millions of rows scan karte hain par few columns touch karte hain, to analytical databases har column ko saath store karte hain, ise hard compress karte hain, aur ise vectorized batches mein process karte hain — aggregation ke liye aksar 100x faster, aur ek single-row lookup ke liye useless.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A filing cabinet where each folder is one customer (row store) versus a set of ledgers where one ledger lists every customer\'s name, the next every customer\'s balance, the next every customer\'s city (column store).** To pull up one customer\'s full record, the folders win — everything is in one place. To answer "what is the average balance across 10 million customers", the ledgers win overwhelmingly: you read one ledger cover to cover and ignore the rest, instead of opening 10 million folders and copying one number out of each. The two layouts store the same facts and are good at opposite questions.',
      hi: '**Ek filing cabinet jahaan har folder ek customer hai (row store) versus ledgers ka ek set jahaan ek ledger har customer ka naam list karta hai, agla har customer ka balance, agla har customer ka city (column store).** Ek customer ka full record pull karne ke liye, folders jeette hain — sab kuch ek jagah hai. "10 million customers ke across average balance kya hai" answer karne ke liye, ledgers overwhelmingly jeette hain: aap ek ledger cover to cover padhte ho aur baaki ignore karte ho, 10 million folders open karne aur har ek se ek number copy karne ke bजाy. Do layouts wahi facts store karte hain aur opposite questions par achhe hain.',
    },

    simple: `**OLTP (transactional) vs OLAP (analytical) -- two different jobs:**
\`\`\`
OLTP | many small txns: insert an order, read a user, update a balance
     | touches FEW rows, ALL columns of them, needs low latency + ACID
     | -> ROW STORE (Postgres, MySQL, ...): a row's fields are contiguous on disk
OLAP | few huge queries: "revenue by region by month over 3 years"
     | scans MILLIONS of rows, touches FEW columns, tolerates seconds of latency
     | -> COLUMN STORE (ClickHouse, DuckDB, BigQuery, Snowflake, Redshift)
\`\`\`

**Why columnar wins at analytics:**
\`\`\`
1. read only the columns the query needs (skip the other 40)
2. a column = millions of similar values next to each other => COMPRESSES 10-100x
   (dictionary, run-length, delta encoding)
3. VECTORIZED execution: process a column in batches of thousands per CPU instruction
4. less data read from disk + less decompressed + fewer instructions = 10-1000x faster scans
\`\`\`

**Why columnar is bad at OLTP:** a single-row insert/read must touch every column
file; no efficient point lookups or row-level updates; usually append-mostly.

**Getting data in (your OLTP db -> the warehouse):**
\`\`\`
ETL/ELT batch  | nightly / hourly dump + load  (simple, stale by hours)
CDC (change data capture) | stream the OLTP write-ahead log -> warehouse (near real-time)
\`\`\`

**Warehouse vs Lakehouse:** warehouse = managed columnar DB (Snowflake/BigQuery/Redshift).
Lakehouse = columnar file formats (Parquet) on object storage + an engine (DuckDB, Spark,
Trino, Databricks) reading them directly. **DuckDB** = "SQLite for analytics": in-process,
one file, superb on a laptop over Parquet/CSV.`,

    simpleHi: `**OLTP (transactional) vs OLAP (analytical) -- do alag jobs:**
\`\`\`
OLTP | bahut chhoti txns: ek order insert, ek user read, ek balance update
     | KAM rows touch, unke SAARE columns, low latency + ACID chahiye
     | -> ROW STORE (Postgres, MySQL): ek row ke fields disk par contiguous
OLAP | kुछ huge queries: "3 saal over region se month se revenue"
     | MILLIONS of rows scan, KAM columns touch, seconds ki latency tolerate
     | -> COLUMN STORE (ClickHouse, DuckDB, BigQuery, Snowflake, Redshift)
\`\`\`

**Columnar analytics par kyun jeetta hai:**
\`\`\`
1. sirf wo columns padho jo query ko chahiye
2. ek column = millions of similar values saath => 10-100x COMPRESS hota hai
3. VECTORIZED execution: ek column ko thousands ke batches mein process karo
4. kam data read + kam decompressed + kam instructions = 10-1000x faster scans
\`\`\`

**Columnar OLTP par kyun bura hai:** ek single-row insert/read ko har column file touch
karni padti hai; koi efficient point lookups ya row-level updates nahi; usually append-mostly.

**Data andar lana (aapका OLTP db -> warehouse):**
\`\`\`
ETL/ELT batch  | nightly / hourly dump + load  (simple, ghanton se stale)
CDC | OLTP write-ahead log stream karo -> warehouse (near real-time)
\`\`\`

**Warehouse vs Lakehouse:** warehouse = managed columnar DB. Lakehouse = object storage par
columnar file formats (Parquet) + ek engine unhe directly padhta hua. **DuckDB** = "analytics
ke liye SQLite": in-process, ek file, ek laptop par Parquet/CSV par superb.`,

    content: `## Two workloads, two shapes

Every database serves one of two broad workloads well:

- **OLTP — Online Transaction Processing.** The operational database of an application: insert an order, fetch a user, decrement inventory, transfer a balance. Each statement touches a few rows and typically most or all of their columns, must return in milliseconds, and needs transactional guarantees. Postgres, MySQL, SQL Server, Oracle, and the document and key-value stores in this course are all OLTP engines.
- **OLAP — Online Analytical Processing.** Reporting and analytics: "revenue by product category by region by month for the last three years", "the 95th-percentile session length by cohort", "year-over-year growth per store". Each query scans a large fraction of a table — millions to billions of rows — but reads only a handful of columns, aggregates or groups them, and can take seconds. This is what data warehouses and columnar databases do.

Running heavy OLAP queries on the OLTP database is a common mistake: the scans compete with operational traffic for I/O and cache, lock or bloat tables, and are slow anyway because the storage layout is wrong for them.

## Row storage vs column storage

The core difference is **how the bytes are laid out on disk**.

A **row store** keeps all of a row's column values contiguous. Reading or writing one whole record is one localized I/O. This is ideal for OLTP: "get user 1000" or "insert this order" touches one place.

A **column store** keeps all values of one column contiguous, across all rows — the \`amount\` column is one long run of numbers, the \`region\` column another. To read one full row you must visit every column's file and stitch the pieces back together, which is slow. But an analytical query that needs only \`region\`, \`amount\`, and \`month\` reads exactly those three columns and skips the other forty entirely.

## Why columnar is dramatically faster for analytics

Three compounding effects:

1. **Column pruning.** A query reads only the columns it references. A table with 50 columns where the query uses 3 reads roughly 6% of the data.
2. **Compression.** A column is millions of values of the same type and often low cardinality or sorted-ish, so it compresses extraordinarily well — dictionary encoding (store each distinct value once, reference it by a small integer), run-length encoding (store "APAC × 40,000" instead of 40,000 copies), delta encoding (store differences between consecutive values), and general-purpose compression on top. 10× to 100× is normal. Less data on disk means less I/O and less to move into CPU cache.
3. **Vectorized execution.** Because a column is a dense array of one type, the engine processes it in **batches of thousands of values per operation**, using CPU SIMD instructions and tight cache-friendly loops, instead of the row-at-a-time interpreted evaluation a traditional row engine does. This alone is often a 10× speedup on aggregation.

Together these routinely make an analytical scan **10× to 1000×** faster on a columnar engine than on a row store, on the same hardware.

## Why columnar is bad at OLTP

- A single-row **insert** must write into every column's storage — 50 columns, 50 places. Columnar engines batch inserts and are happiest when data arrives in bulk.
- A single-row **update** or **delete** is expensive; many columnar engines don't support true in-place updates at all, only append + periodic compaction, or are append-only.
- A **point lookup** ("row where id = 5") has no efficient path — there's no row to jump to, and secondary-index support is limited or absent.
- **No multi-statement ACID transactions** in the OLTP sense on most of them.

So a columnar database is not a replacement for your operational database — it is a **second** database that the operational data flows into.

## The players

- **ClickHouse** — open-source, extremely fast columnar OLAP, self-hostable, popular for logs/events/product analytics at large scale.
- **DuckDB** — an in-process columnar engine, "SQLite for analytics": no server, one file (or none), reads Parquet/CSV/JSON directly, and crunches tens of millions of rows on a laptop. Ideal for local analysis, notebooks, embedded analytics, and ETL.
- **BigQuery / Snowflake / Redshift / Databricks SQL** — managed cloud data warehouses: you load data and run SQL, they handle storage and scaling; priced by storage plus compute/bytes-scanned.
- **Apache Parquet / ORC** — columnar *file formats*, not databases, stored on object storage (S3, GCS). A **lakehouse** is these files plus a query engine (DuckDB, Trino, Spark, Athena) reading them directly, plus a table format (Iceberg, Delta Lake) adding transactions and schema evolution.

## Getting operational data into the analytical store

- **Batch ETL/ELT.** On a schedule (hourly, nightly), export from the OLTP database and load into the warehouse, often transforming along the way. Simple, robust, and stale by up to the batch interval. Tools: Airflow/Dagster for orchestration, dbt for in-warehouse transformation.
- **Change Data Capture (CDC).** Stream the OLTP database's write-ahead log (Postgres logical replication, MySQL binlog, via Debezium/Kafka or a managed service like Fivetran) into the warehouse continuously, so it lags by seconds. More moving parts, near-real-time freshness.

The rule of thumb from earlier modules holds: when a query looks like "scan a lot of rows to compute an aggregate", it belongs in a columnar store, and the operational database should feed it, not run it.`,

    contentHi: `## Do workloads, do shapes

- **OLTP — Online Transaction Processing.** Ek application ka operational database: ek order insert, ek user fetch, inventory decrement. Har statement kुछ rows touch karta hai aur unke zyaadातर columns, milliseconds mein return hona chahiye, transactional guarantees chahiye.
- **OLAP — Online Analytical Processing.** Reporting aur analytics. Har query ek table ka ek large fraction scan karta hai — millions se billions rows — par sirf kुछ columns padhta hai, aggregate karta hai, aur seconds le sakta hai.

OLTP database par heavy OLAP queries chalana ek common mistake hai.

## Row storage vs column storage

Ek **row store** ek row ke saare column values contiguous rakhta hai. OLTP ke liye ideal.

Ek **column store** ek column ke saare values contiguous rakhta hai, saari rows ke across. Ek full row padhne ke liye aapko har column ki file visit karni padti hai. Par ek analytical query jise sirf \`region\`, \`amount\`, \`month\` chahiye theek wo teen columns padhta hai.

## Columnar analytics ke liye kyun dramatically faster hai

1. **Column pruning.** Ek query sirf wo columns padhta hai jo ye reference karta hai.
2. **Compression.** Ek column ek type ke millions of values hai, to ye extraordinarily well compress hota hai — dictionary, run-length, delta encoding. 10x se 100x normal hai.
3. **Vectorized execution.** Engine ek column ko **thousands of values per operation ke batches** mein process karta hai, CPU SIMD instructions istemal karte hue.

Saath ye ek analytical scan ko ek columnar engine par ek row store se **10x se 1000x** faster banaते hain.

## Columnar OLTP par kyun bura hai

- Ek single-row insert ko har column ki storage mein likhna padta hai.
- Ek single-row update/delete mehnga hai.
- Ek point lookup ka koi efficient path nahi.
- Zyaादातर par OLTP sense mein koi multi-statement ACID transactions nahi.

To ek columnar database aapke operational database ka replacement nahi hai — ye ek **doosra** database hai jismein operational data flow karta hai.

## Players

- **ClickHouse** — open-source, extremely fast columnar OLAP.
- **DuckDB** — ek in-process columnar engine, "analytics ke liye SQLite": koi server nahi, Parquet/CSV directly padhta hai.
- **BigQuery / Snowflake / Redshift** — managed cloud data warehouses.
- **Parquet / ORC** — columnar file formats, databases nahi. Ek **lakehouse** ye files plus ek query engine hai.

## Operational data ko analytical store mein lana

- **Batch ETL/ELT.** Ek schedule par export + load. Simple, batch interval tak stale.
- **Change Data Capture (CDC).** OLTP database ka write-ahead log continuously stream karo. Near-real-time.`,

    examples: [
      {
        title: 'The same query: row store vs column store cost',
        titleHi: 'Wahi query: row store vs column store cost',
        code: `-- table orders(id, user_id, status, region, amount, created_at, + 44 more columns)
-- 200 million rows

SELECT region, date_trunc('month', created_at) AS m, sum(amount)
FROM orders
GROUP BY region, m;

-- ROW STORE (Postgres): must read all 200M rows in full — every one of the 50
--   columns is on disk between the 3 it needs. ~heavy seq scan, minutes, and it
--   competes with live OLTP traffic for buffer cache.
-- COLUMN STORE (ClickHouse/DuckDB/BigQuery): reads only the region, created_at,
--   and amount columns — ~6% of the bytes — each compressed ~20x, scanned
--   vectorized. Often sub-second to a few seconds on the same data.`,
        output: `Row store: full-table scan reading ~50 columns to use 3 -> minutes, contends with OLTP. Column store: reads 3 compressed columns, vectorized -> 10-1000x faster. Same rows, opposite storage layout.`,
        explain: 'A row store places every column of a row together, so a query that aggregates three columns across every row still has to read all fifty columns of all two hundred million rows off disk, because the wanted values are interleaved with the unwanted ones. A column store places each column separately, so the same query reads only the three column files it references, which is a small fraction of the total bytes, and those files compress far better than mixed row data because each holds millions of values of a single type. The columnar engine then evaluates the aggregation over dense typed arrays in batches using vectorized CPU instructions rather than interpreting one row at a time. Column pruning, compression, and vectorization compound to make the analytical scan often hundreds of times faster on identical hardware, while the same layout makes single-row operations slow, which is why the columnar store is a separate system fed by the operational one.',
        explainHi: 'Ek row store ek row ke har column ko saath rakhta hai, to ek query jo teen columns ko har row ke across aggregate karta hai phir bhi saari 200 million rows ke saare 50 columns disk se read karta hai. Ek column store har column ko alag rakhta hai, to wahi query sirf teen column files padhta hai jo ye reference karta hai, jo total bytes ka ek chhota fraction hai, aur wo files behtar compress hoti hain. Columnar engine phir aggregation ko dense typed arrays ke upar batches mein evaluate karta hai vectorized CPU instructions istemal karte hue. Column pruning, compression, aur vectorization compound hote hain analytical scan ko aksar identical hardware par saikड़on guna faster banane ke liye.',
      },
      {
        title: 'DuckDB: analytics with no server, straight over files',
        titleHi: 'DuckDB: koi server nahi, seedhे files ke upar analytics',
        code: `-- no daemon, no load step — query Parquet files on disk / S3 directly:
SELECT region, count(*), avg(amount)
FROM 's3://bucket/orders/year=2026/*.parquet'
WHERE status = 'completed'
GROUP BY region
ORDER BY 2 DESC;

-- DuckDB runs in-process (a library, like SQLite), reads only the columns and
-- row-groups the query needs from the Parquet files, and returns in seconds
-- over tens of millions of rows on a laptop. Great for notebooks, ETL, and
-- embedded analytics inside an app.`,
        output: `DuckDB is an in-process columnar engine - no server, reads Parquet/CSV/JSON directly, column- and predicate-pruned. "SQLite for analytics": laptop-scale OLAP with zero infrastructure.`,
        explain: 'DuckDB applies the SQLite model, an engine linked into the host process with no server, to the analytical workload, using columnar storage and vectorized execution internally. It can query columnar files such as Parquet in place, on local disk or object storage, reading only the columns the query names and skipping row groups whose metadata rules them out by the filter, so a query over tens of millions of rows completes in seconds on a single machine with no data loading step and no infrastructure to run. This makes it the natural tool for interactive analysis in a notebook, for transformation steps in a data pipeline, and for analytics features embedded directly inside an application, in the same way SQLite is the natural embedded transactional store. It is not built for many concurrent users or for continuous ingestion, which is where a server-based warehouse or ClickHouse takes over.',
        explainHi: 'DuckDB SQLite model ko, ek engine jo host process mein linked hai bina server ke, analytical workload par apply karta hai, internally columnar storage aur vectorized execution istemal karte hue. Ye Parquet jaise columnar files ko in place query kar sakta hai, sirf wo columns padhते hue jo query name karta hai, to ek query jo tens of millions of rows ke upar hai ek single machine par seconds mein complete hoti hai bina data loading step ke. Ye ise ek notebook mein interactive analysis ke liye, ek data pipeline mein transformation steps ke liye, aur ek application ke andar embedded analytics features ke liye natural tool banaता hai.',
      },
      {
        title: 'Batch ETL vs CDC: how fresh does the warehouse need to be?',
        titleHi: 'Batch ETL vs CDC: warehouse kitna fresh hona chahiye?',
        code: `// BATCH (nightly): a job dumps orders/users/events from Postgres, loads into
//   the warehouse, dbt models transform them. The warehouse is up to 24h stale.
//   Fine for finance reports, exec dashboards, weekly cohort analysis.

// CDC (continuous): Debezium reads the Postgres WAL, streams every insert/
//   update/delete into Kafka, a sink writes them into the warehouse within
//   seconds. Needed for near-real-time dashboards, operational analytics,
//   reverse-ETL back into product features.
//   More components to run and monitor (connectors, Kafka, schema drift).`,
        output: `Batch ETL/ELT: simple, robust, stale by the interval - most reporting is fine with this. CDC: streams the WAL for seconds-fresh data, at the cost of more moving parts. Choose by required freshness.`,
        explain: 'Analytical data has to be copied from the operational database into the analytical store, and the choice is how continuously. Batch extraction runs on a schedule, exporting tables and loading them into the warehouse where transformation models shape them, which is straightforward to build and operate but leaves the warehouse behind the source by up to the length of the interval, typically hours. That lag is invisible for the majority of reporting, such as financial summaries and dashboards reviewed daily or weekly. Change data capture instead reads the operational database\'s replication log and streams each individual change into the warehouse as it happens, keeping the lag to seconds, which matters for dashboards that must reflect current state and for pushing derived data back into the product. The trade is operational: CDC introduces a pipeline of connectors and a streaming system that must be monitored and that has to handle schema changes in the source. The freshness the business actually needs decides which is appropriate.',
        explainHi: 'Analytical data ko operational database se analytical store mein copy karna hota hai, aur choice ye hai ki kitna continuously. Batch extraction ek schedule par chalti hai, tables export aur unhe warehouse mein load karte hue jahaan transformation models unhe shape karte hain, jo build aur operate karna straightforward hai par warehouse ko source se interval ki lambaai tak peeche chhodta hai, typically ghante. Wo lag zyaादातर reporting ke liye invisible hai. Change data capture iske bजaay operational database ke replication log ko padhta hai aur har individual change ko warehouse mein stream karta hai jaise ye hota hai, lag ko seconds tak rakhte hue. Trade operational hai: CDC connectors ki ek pipeline aur ek streaming system introduce karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- running the company's analytics off read replicas of the OLTP Postgres
-- "the data's already there, a replica is cheap"
SELECT ... FROM orders JOIN users JOIN events   -- 18-way join, full scans,
GROUP BY ... ;                                   -- 40s, every hour, forever
-- the replica's buffer cache is thrashed by analytical scans, replication lag
-- spikes, and the queries are still slow because row storage is wrong for this.`,
        right: `-- feed a columnar store and run analytics there:
--   Postgres (OLTP)  --CDC or nightly ELT-->  ClickHouse / BigQuery / DuckDB+Parquet
--   dashboards and ad-hoc analysis query the columnar store
--   the OLTP replica goes back to serving read traffic for the app
-- Postgres can still do light in-app analytics; heavy reporting moves out.`,
        why: 'A read replica of an OLTP database has the same row-oriented storage as the primary, so an analytical query on it still reads every column of every row it scans, is not vectorized, and runs slowly, while also evicting the operational working set from the replica\'s cache and, on some setups, increasing replication lag. Using replicas this way treats "the data is already there" as the deciding factor when the storage layout, not the data\'s location, is what makes analytical queries slow. The correct architecture moves analytical data into a columnar store designed for scans, either continuously through change data capture or on a schedule through batch loading, and points dashboards and exploratory queries at that store. The columnar engine reads only the referenced columns, in compressed vectorized form, so the same reports run in a fraction of the time, and the operational database and its replicas are left to do the low-latency transactional work they are built for. Light analytics embedded in the application can still run on Postgres; it is sustained heavy reporting that must move.',
        whyHi: 'Ek OLTP database ka ek read replica primary jaisा hi row-oriented storage rakhta hai, to ispar ek analytical query phir bhi har row ke har column ko padhta hai jo ye scan karta hai, vectorized nahi hai, aur slowly chalti hai, jabki replica ke cache se operational working set evict bhi karti hai. Replicas ko is tarah istemal karna "data pehle se wahaan hai" ko deciding factor ke roop mein treat karta hai jab storage layout wo hai jo analytical queries ko slow banaता hai. Sahi architecture analytical data ko scans ke liye design kiye gaye ek columnar store mein move karta hai aur dashboards ko us store par point karta hai.',
      },
      {
        wrong: `-- trying to use a columnar warehouse as the app's operational database
-- BigQuery / ClickHouse as the primary store for a web app:
INSERT INTO users VALUES (...);        -- one row at a time, per signup
UPDATE users SET last_seen = now() WHERE id = ?;   -- per request
SELECT * FROM users WHERE id = ?;       -- point lookup on every page load
-- -- single-row writes are slow/expensive, updates may not be supported,
--    point lookups have no index path, and there's no real transaction.`,
        right: `-- columnar stores are for scans, not for serving an app. Keep OLTP on an
-- OLTP engine:
--   users, orders, sessions          -> Postgres / MySQL / a document store
--   analytics_events (append-only)   -> ClickHouse / BigQuery
-- write events to both, or CDC the OLTP tables into the warehouse.`,
        why: 'Columnar databases store each column separately and are optimized for reading many rows and few columns, which is the opposite of what an application\'s operational access looks like. A single-row insert has to write into every column\'s storage and is far more expensive than appending a row to a row store, so these engines expect data in large batches. Row-level updates are slow and on several columnar engines are not supported as true in-place changes at all. A point lookup by primary key has no fast path because there is no contiguous row to seek to and secondary indexing is limited. And multi-statement transactions with the isolation guarantees an application relies on are generally absent. Using a columnar warehouse to serve an application therefore fails on latency, on update support, and on transactional correctness. The operational data belongs in an OLTP engine, and the columnar store receives a copy, or an append-only event stream, for analysis.',
        whyHi: 'Columnar databases har column ko alag store karte hain aur bahut rows aur kुछ columns padhne ke liye optimized hain, jo ek application ke operational access ka opposite hai. Ek single-row insert ko har column ki storage mein likhna padta hai aur ek row store mein ek row append karne se bahut mehnga hai. Row-level updates slow hain aur kुछ columnar engines par true in-place changes ke roop mein support nahi hain. Ek point lookup ka koi fast path nahi. Aur multi-statement transactions generally absent hain. Ek columnar warehouse ko ek application serve karne ke liye istemal karna isliye latency, update support, aur transactional correctness par fail hota hai.',
      },
    ],

    realWorld: [
      {
        en: '**A SaaS with Postgres for the app and ClickHouse for product analytics** — every user action is written as an append-only event into ClickHouse, and the in-app "analytics" tab and internal dashboards query ClickHouse, never Postgres.',
        hi: '**Ek SaaS app ke liye Postgres aur product analytics ke liye ClickHouse ke saath** — har user action ClickHouse mein ek append-only event ke roop mein likha jata hai.',
      },
      {
        en: '**A data team using dbt on Snowflake, fed nightly by Fivetran from Postgres, Stripe, and Salesforce** — the warehouse is the single place all reporting SQL runs, and it is stale by at most a day, which finance and the exec team are fine with.',
        hi: '**Ek data team Snowflake par dbt istemal karti hai, Fivetran dwara nightly fed** — warehouse ekmatra jagah hai jahaan saari reporting SQL chalti hai.',
      },
      {
        en: '**An analyst exploring a 40 GB Parquet export in a Jupyter notebook with DuckDB** — no cluster, no upload, queries the files on the local SSD in seconds, and only moves to the warehouse if the analysis becomes a recurring pipeline.',
        hi: '**Ek analyst DuckDB ke saath ek Jupyter notebook mein ek 40 GB Parquet export explore karta hai** — koi cluster nahi, local SSD par files seconds mein query karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is a columnar database so much faster for analytical queries, and why is it bad at OLTP?',
        qHi: 'Ek columnar database analytical queries ke liye itna faster kyun hai, aur ye OLTP par kyun bura hai?',
        a: 'A columnar database stores all the values of one column contiguously rather than storing all the columns of one row together. For an analytical query that scans a large fraction of a table but references only a few columns, this produces three compounding advantages. First, column pruning: the query reads only the storage for the columns it names, which on a wide table is a small percentage of the total bytes. Second, compression: a column is a long sequence of values of one type, frequently with low cardinality or near-sorted order, so encodings like dictionary, run-length, and delta compress it by ten to a hundred times, cutting I/O and memory traffic proportionally. Third, vectorized execution: because each column is a dense typed array, the engine evaluates operations over batches of thousands of values using CPU vector instructions and cache-friendly loops, instead of interpreting one row at a time. Together these make analytical scans routinely ten to a thousand times faster than on a row store. The same layout is bad for OLTP because a single-row insert must write into every column\'s storage, row-level updates and deletes are expensive or unsupported as in-place operations, a primary-key point lookup has no fast path since there is no contiguous row, and multi-statement ACID transactions are generally absent. So a columnar store is a second database fed by the operational one, not a replacement for it.',
        aHi: 'Ek columnar database ek column ke saare values contiguously store karta hai ek row ke saare columns saath store karne ke bजaay. Ek analytical query ke liye jo ek table ka ek large fraction scan karta hai par sirf kुछ columns reference karta hai, ye teen compounding advantages produce karta hai. Pehla, column pruning: query sirf wo columns padhta hai jo ye name karta hai. Doosra, compression: ek column ek type ke values ka ek long sequence hai, to ye das se sौ guna compress hota hai. Teesra, vectorized execution: engine operations ko thousands of values ke batches mein evaluate karta hai. Saath ye analytical scans ko das se ek hazar guna faster banaते hain. Wahi layout OLTP ke liye bura hai kyunki ek single-row insert ko har column ki storage mein likhna padta hai, updates mehnge hain, aur point lookups ka koi fast path nahi.',
      },
      {
        q: 'How does data get from the operational database into the analytical store, and what is the trade-off?',
        qHi: 'Data operational database se analytical store mein kaise jata hai, aur trade-off kya hai?',
        a: 'There are two main approaches, and the trade-off is freshness against operational complexity. Batch extraction, sometimes called ETL or ELT, runs on a schedule such as hourly or nightly: a job reads tables from the operational database, loads them into the warehouse, and transformation models restructure them for analysis. It is simple to build and reliable to run, and the tooling around it, orchestrators and in-warehouse transformation frameworks, is mature. Its cost is staleness: the warehouse trails the source by up to the batch interval, so a nightly pipeline can be up to a day behind, which is acceptable for most financial reporting and periodic dashboards. Change data capture instead taps the operational database\'s replication log, the write-ahead log in Postgres or the binlog in MySQL, and streams every insert, update, and delete into the warehouse continuously, so the lag is seconds. This is necessary when dashboards must show current state or when derived data feeds back into product features. Its cost is more moving parts: a capture connector, usually a streaming system like Kafka, a sink into the warehouse, and the need to handle schema changes in the source flowing through the pipeline, all of which must be monitored. The right choice follows from how fresh the analytics genuinely need to be.',
        aHi: 'Do main approaches hain, aur trade-off freshness versus operational complexity hai. Batch extraction ek schedule par chalti hai: ek job operational database se tables padhता hai, unhe warehouse mein load karता hai, aur transformation models unhe restructure karте hain. Ye build karna simple aur run karna reliable hai. Iski cost staleness hai: warehouse source se batch interval tak peeche chalta hai. Change data capture iske bजaay operational database ke replication log ko tap karta hai aur har insert, update, aur delete ko warehouse mein continuously stream karta hai, to lag seconds hai. Iski cost zyada moving parts hai: ek capture connector, usually Kafka jaisा ek streaming system, ek sink.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, classify each as OLTP or OLAP and name the storage layout it wants: (a) "add this item to the user\'s cart", (b) "total GMV by country by week for the last 2 years", (c) "show me order #88213", (d) "distribution of session lengths across 500M sessions".',
        taskHi: 'Ek comment mein, har ek ko OLTP ya OLAP classify karo aur storage layout batao: (a) "is item ko user ke cart mein add karo", (b) "2 saal ke liye country se week se total GMV", (c) "order #88213 dikhao", (d) "500M sessions ke across session lengths ka distribution".',
        hint: '(a) OLTP, row store — one row, all columns, low latency. (b) OLAP, column store — scans years of rows, 3-4 columns, aggregates. (c) OLTP, row store — point lookup by id. (d) OLAP, column store — full scan of one/two columns over 500M rows.',
        hintHi: '(a) OLTP, row store. (b) OLAP, column store. (c) OLTP, row store. (d) OLAP, column store.',
      },
      {
        task: 'A team runs all reporting on a read replica of their production Postgres and it\'s slow and causing replication lag. In a comment, explain why a replica doesn\'t fix this and sketch the architecture that does.',
        taskHi: 'Ek team apni saari reporting ek read replica par chalati hai aur ye slow hai aur replication lag cause kar rahi hai. Ek comment mein, samjhao ki ek replica ise kyun fix nahi karta.',
        hint: 'A replica has the SAME row storage as the primary — analytical queries still read all columns of all scanned rows, unvectorized, and thrash the replica\'s cache. Fix: CDC or nightly ELT from Postgres → a columnar store (ClickHouse/BigQuery/DuckDB+Parquet); point all dashboards and ad-hoc analysis there; the replica goes back to serving app read traffic.',
        hintHi: 'Ek replica primary jaisा hi row storage rakhta hai. Fix: CDC ya nightly ELT Postgres → ek columnar store; saare dashboards wahaan point karo.',
      },
      {
        task: 'In a comment, explain what DuckDB is by analogy to SQLite, and give two situations where you\'d reach for DuckDB instead of standing up a Snowflake/BigQuery warehouse.',
        taskHi: 'Ek comment mein, DuckDB ko SQLite se analogy dwara samjhao, aur do situations do jahaan aap DuckDB ke liye reach karoge.',
        hint: 'DuckDB = "SQLite for analytics": in-process (a library, no server), columnar + vectorized, reads Parquet/CSV directly. Reach for it: (1) interactive analysis of a large file export in a notebook — no upload, no cluster; (2) a transformation step in a pipeline, or analytics embedded inside an app. Move to a warehouse when you need many concurrent users or continuous ingestion.',
        hintHi: 'DuckDB = "analytics ke liye SQLite": in-process, columnar + vectorized, Parquet/CSV directly padhta hai. Iske liye reach karo: (1) ek notebook mein ek large file ka interactive analysis; (2) ek pipeline mein ek transformation step.',
      },
    ],

    keyTakeaways: [
      'TWO WORKLOADS: OLTP (operational — many small txns, touch FEW rows / ALL their columns, ms latency, ACID → ROW STORE: Postgres/MySQL) vs OLAP (analytical — few huge queries, scan MILLIONS of rows / FEW columns, seconds ok → COLUMN STORE: ClickHouse/DuckDB/BigQuery/Snowflake/Redshift). Running heavy OLAP on the OLTP db (or its replica) is the classic mistake — a replica has the same ROW storage, so it doesn\'t help.',
      'COLUMN STORE = all values of one column contiguous (vs a row store: all columns of one row contiguous). Analytics wins via 3 compounding effects: (1) COLUMN PRUNING — read only the referenced columns (~6% of a wide table); (2) COMPRESSION — a column is millions of one-type values → dictionary/run-length/delta encoding, 10-100×; (3) VECTORIZED execution — process dense typed arrays in batches of thousands per CPU instruction. Net: analytical scans 10-1000× faster on the same hardware.',
      'COLUMNAR IS BAD AT OLTP: a single-row insert writes into every column\'s storage; row-level updates/deletes are expensive or unsupported (append + compaction); point lookups have no fast path; no multi-statement ACID. So a columnar store is a SECOND database FED BY the operational one — never a replacement.',
      'PLAYERS: ClickHouse (fast self-hostable OLAP, logs/events at scale). DuckDB ("SQLite for analytics" — in-process, no server, reads Parquet/CSV directly, laptop-scale). BigQuery/Snowflake/Redshift/Databricks (managed cloud warehouses, priced by storage + compute/bytes-scanned). Parquet/ORC = columnar FILE FORMATS on object storage; a LAKEHOUSE = those files + a query engine (DuckDB/Trino/Spark) + a table format (Iceberg/Delta) for transactions.',
      'GETTING DATA IN: BATCH ETL/ELT (scheduled dump+load+transform — simple, robust, stale by the interval; fine for most reporting) vs CDC / change data capture (stream the OLTP WAL/binlog continuously — seconds-fresh, more moving parts: connectors + Kafka + schema drift). Choose by the freshness the business actually needs. Rule of thumb: "scan a lot of rows to compute an aggregate" ⇒ columnar store, fed by (not run on) the operational db.',
    ],
    keyTakeawaysHi: [
      'DO WORKLOADS: OLTP (operational — bahut chhoti txns, KAM rows / unke SAARE columns touch, ms latency, ACID → ROW STORE) vs OLAP (analytical — kुछ huge queries, MILLIONS rows / KAM columns scan, seconds ok → COLUMN STORE). OLTP db (ya iske replica) par heavy OLAP chalana classic mistake hai — ek replica wahi ROW storage rakhta hai.',
      'COLUMN STORE = ek column ke saare values contiguous. Analytics 3 compounding effects se jeetta hai: (1) COLUMN PRUNING; (2) COMPRESSION — 10-100×; (3) VECTORIZED execution — dense typed arrays ko thousands ke batches mein process karo. Net: analytical scans wahi hardware par 10-1000× faster.',
      'COLUMNAR OLTP PAR BURA HAI: ek single-row insert har column ki storage mein likhta hai; row-level updates/deletes mehnge ya unsupported; point lookups ka koi fast path nahi; koi multi-statement ACID nahi. To ek columnar store ek DOOSRA database hai jo operational se FED hai — kabhi replacement nahi.',
      'PLAYERS: ClickHouse (fast self-hostable OLAP). DuckDB ("analytics ke liye SQLite" — in-process, koi server nahi, Parquet/CSV directly padhta hai). BigQuery/Snowflake/Redshift (managed cloud warehouses). Parquet/ORC = columnar FILE FORMATS; ek LAKEHOUSE = wo files + ek query engine + ek table format (Iceberg/Delta).',
      'DATA ANDAR LANA: BATCH ETL/ELT (scheduled dump+load — simple, interval tak stale; zyaादातर reporting ke liye fine) vs CDC (OLTP WAL/binlog continuously stream — seconds-fresh, zyada moving parts). Business ki actual freshness se choose karo. Rule: "ek aggregate compute karne ke liye bahut rows scan karo" ⇒ columnar store.',
    ],
  },

  {
    slug: 'db-graph-time-series-and-search',
    title: 'Graph, Time-Series & Search Engines',
    titleHi: 'Graph, Time-Series Aur Search Engines',
    description: 'Three specialized stores, each built for one access pattern a general database handles badly: graph databases for many-hop relationship traversal, time-series databases for high-rate append and time-window rollups, and search engines for ranked full-text and faceted queries. Each is usually an addition to a relational core, not a replacement.',
    descriptionHi: 'Teen specialized stores, har ek ek access pattern ke liye bana jise ek general database bura handle karta hai: many-hop relationship traversal ke liye graph databases, high-rate append aur time-window rollups ke liye time-series databases, aur ranked full-text aur faceted queries ke liye search engines. Har ek aksar ek relational core ka ek addition hai, ek replacement nahi.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A road atlas, a heart-rate monitor\'s tape, and a library\'s card catalogue — three tools for three questions the same encyclopedia answers badly.** The atlas is a graph: "how do I get from here to there, and what is the shortest route through the network" — following connections is the whole point. The heart-rate tape is time-series: a value every second, forever, and you mostly ask "what was the average over this hour" and "alert me if it spikes". The card catalogue is search: "everything about volcanoes, ranked by relevance, filtered to books after 2010". You could answer all three from the encyclopedia\'s index, slowly and painfully; each specialized tool makes one of them instant.',
      hi: '**Ek road atlas, ek heart-rate monitor ki tape, aur ek library ka card catalogue — teen tools teen sawalon ke liye jo wahi encyclopedia bura answer karti hai.** Atlas ek graph hai: "main yahaan se wahaan kaise pahunchu, aur network ke through shortest route kya hai" — connections follow karna poora point hai. Heart-rate tape time-series hai: har second ek value, hamesha, aur aap zyaादातर poochte ho "is ghante ka average kya tha". Card catalogue search hai: "volcanoes ke baare mein sab kुछ, relevance se ranked". Aap teenों encyclopedia ke index se answer kar sakte ho, slowly; har specialized tool unmein se ek ko instant banaता hai.',
    },

    simple: `**GRAPH DB (Neo4j, Neptune, ArangoDB) -- when RELATIONSHIPS are the data:**
\`\`\`
model | NODES (with labels + properties) + EDGES (typed, directed, with properties)
query | Cypher/Gremlin: (a:Person)-[:FRIEND*1..3]->(b:Person)  -- 1-to-3-hop traversal
win   | "friends of friends who like X", shortest path, fraud rings, recommendations,
        dependency graphs -- queries that are 5+ self-joins in SQL and blow up
\`\`\`

**TIME-SERIES DB (TimescaleDB, InfluxDB, Prometheus) -- append-heavy, time-windowed:**
\`\`\`
shape | (timestamp, series-id/tags, value) -- millions of points/sec, rarely updated
feats | auto-partition by time, retention ("drop data > 90d"), continuous
        aggregates / downsampling (1s raw -> 1m rollup -> 1h rollup), time-bucket queries
use   | metrics, IoT sensors, financial ticks, event rates, observability
\`\`\`

**SEARCH ENGINE (Elasticsearch, OpenSearch, Meilisearch, Typesense) -- ranked text:**
\`\`\`
index | INVERTED INDEX: term -> list of docs containing it, + positions + frequencies
query | full-text with relevance scoring (BM25), fuzzy/typo tolerance, faceting,
        aggregations, geo, autocomplete
NOT   | a system of record: no real transactions, eventually consistent, reindex-prone
        -> keep the source of truth in Postgres, sync INTO the search index
\`\`\`

**All three:** usually ADDED alongside a relational core, kept in sync from it (CDC /
dual-write / periodic reindex), and queried for the one pattern they're great at.`,

    simpleHi: `**GRAPH DB (Neo4j, Neptune) -- jab RELATIONSHIPS data hain:**
\`\`\`
model | NODES (labels + properties) + EDGES (typed, directed, properties ke saath)
query | Cypher: (a:Person)-[:FRIEND*1..3]->(b:Person)  -- 1-se-3-hop traversal
win   | "friends of friends jo X like karte hain", shortest path, fraud rings,
        recommendations -- queries jo SQL mein 5+ self-joins hain aur blow up
\`\`\`

**TIME-SERIES DB (TimescaleDB, InfluxDB, Prometheus) -- append-heavy, time-windowed:**
\`\`\`
shape | (timestamp, series-id/tags, value) -- millions of points/sec, rarely updated
feats | time se auto-partition, retention ("data > 90d drop karo"), continuous
        aggregates / downsampling, time-bucket queries
use   | metrics, IoT sensors, financial ticks, observability
\`\`\`

**SEARCH ENGINE (Elasticsearch, OpenSearch, Meilisearch) -- ranked text:**
\`\`\`
index | INVERTED INDEX: term -> docs ki list jo ise contain karte hain
query | relevance scoring (BM25) ke saath full-text, fuzzy/typo tolerance, faceting
NOT   | ek system of record: koi real transactions nahi, eventually consistent
        -> source of truth Postgres mein rakho, search index MEIN sync karo
\`\`\`

**Teenों:** usually ek relational core ke saath ADDED, ismein se sync mein rakhe (CDC /
dual-write / periodic reindex), aur us ek pattern ke liye queried jismein wo great hain.`,

    content: `## Graph databases

A graph database stores **nodes** (entities, each with a label and properties) and **edges** (relationships, each typed, directed, and optionally carrying properties), and makes **traversal** — following edges from node to node — a first-class, cheap operation.

The case for one is a query where the *relationships* are the substance and the answer requires walking several hops through them:

- "friends of friends of friends who live in Pune and like hiking"
- "the shortest referral chain between these two accounts"
- "all components that transitively depend on this library"
- "rings of accounts that share devices, addresses, or payment methods" (fraud detection)
- "people who bought this also bought…" following purchase edges

In a relational database each hop is a join, so a 4-hop traversal is a 4-way self-join whose intermediate result sets explode combinatorially, and the query planner struggles. A graph database stores each node's edges as direct pointers ("index-free adjacency"), so a hop is a pointer chase regardless of table size, and a variable-length traversal (\`[:FRIEND*1..4]\`) is a natural query.

**Query languages:** Cypher (Neo4j, and the emerging ISO **GQL** standard), Gremlin (Apache TinkerPop, AWS Neptune), SPARQL (RDF triple stores). Cypher\'s ASCII-art pattern syntax — \`(a)-[:KNOWS]->(b)\` — is the most readable.

**Products:** Neo4j (the reference implementation), Amazon Neptune, ArangoDB (multi-model), Memgraph, TigerGraph. Postgres can do recursive graph queries with \`WITH RECURSIVE\` and the \`ltree\`/\`pgRouting\` extensions for modest graphs.

**When *not* to reach for one:** if your "graph" is shallow (one or two hops) and mostly you filter and aggregate, a relational database with good indexes is simpler and faster. The graph database earns its place at genuine multi-hop, variable-depth, path-finding workloads.

## Time-series databases

A time-series database is built for data shaped as **(timestamp, identifying tags, value)**, arriving at high rate, almost never updated, and queried in **time windows**:

- server and application **metrics** (CPU, request rate, p99 latency)
- **IoT / sensor** readings (temperature, vibration, GPS)
- **financial** ticks, ad impressions, game telemetry, energy meters

The workload has a distinctive profile: writes are append-only and enormous in volume; reads are "aggregate this metric over the last hour / day / month", "downsample to one point per minute for this chart", "alert when the 5-minute average crosses a threshold"; and old data loses value, so it should be automatically rolled up and then deleted.

Time-series engines provide, out of the box: **automatic partitioning by time** (so old chunks can be dropped or compressed cheaply), **retention policies** (\`DROP data older than 90 days\`), **continuous aggregates / downsampling** (materialized rollups that refresh incrementally: raw → 1-minute → 1-hour → 1-day), **time-bucketing functions** (\`time_bucket('5 minutes', ts)\`), and storage layouts and compression tuned for timestamp-ordered numeric data.

**Products:** **TimescaleDB** (a Postgres extension — you keep SQL, joins, and the Postgres ecosystem, and add hypertables and time-series features), **InfluxDB** (purpose-built, its own query languages), **Prometheus** (metrics + alerting, pull-based, the Kubernetes-world default; typically paired with **Grafana** and long-term stores like **Thanos**/**Mimir**), **ClickHouse** (also excellent for time-series at scale), **QuestDB**, **VictoriaMetrics**.

**When *not* to reach for one:** a few thousand rows a day of "events with a timestamp" is just a table in Postgres with an index on the timestamp. Time-series engines earn their place at sustained high ingestion and rollup/retention needs.

## Search engines

A search engine is built around the **inverted index**: for every term (word, stemmed token) it stores the list of documents containing it, along with positions and frequencies. This makes "find documents containing these words, ranked by how well they match" fast, which a relational \`LIKE '%term%'\` (a full scan) or even Postgres full-text search cannot match at scale or in features.

What a search engine gives you:

- **Full-text relevance ranking** (BM25 by default) — results ordered by how relevant they are, not just whether they match.
- **Analyzers**: tokenization, lowercasing, stemming (\`running\` → \`run\`), stop-word removal, synonyms, language-specific rules, n-grams for autocomplete.
- **Fuzzy matching / typo tolerance**, phrase and proximity queries, wildcards.
- **Faceted search and aggregations** — "restaurants" filtered by cuisine, price, rating, with live counts per facet.
- **Geo queries, highlighting, "did you mean", autocomplete/suggesters.**

The critical caveat: **a search engine is not a system of record.** Elasticsearch/OpenSearch are distributed and **eventually consistent**, have no cross-document ACID transactions, and their index can need rebuilding after a mapping change. You keep the authoritative data in a transactional database and **feed a copy into the search index** — via CDC, a dual-write, or a periodic reindex job — treating the search cluster as a queryable, disposable projection.

**Products:** Elasticsearch and OpenSearch (the heavyweight, also used for log analytics — the "ELK/OpenSearch stack"), Meilisearch and Typesense (lighter, developer-friendly, great for app search / instant-search UIs), Algolia (hosted, very fast, used for site search), and **Postgres FTS** + the **pg_trgm** and **pgvector** extensions, which cover a surprising amount for smaller apps without a separate cluster.

## The common thread

None of these three replaces a relational or document core. Each is a **specialized projection** of your data, kept in sync from the source of truth, and queried for the one access pattern where a general-purpose database falls down. Adding one is a deliberate decision that also adds a system to operate, secure, and keep consistent — worth it when the access pattern is central, not worth it for an occasional query you can serve another way.`,

    contentHi: `## Graph databases

Ek graph database **nodes** (entities, har ek label aur properties ke saath) aur **edges** (relationships, har ek typed, directed) store karta hai, aur **traversal** — edges ko node se node follow karna — ko ek first-class, cheap operation banaता hai.

Iske liye case ek query hai jahaan *relationships* substance hain aur answer ko unmein se кई hops walk karne ki zaroorat hai: "friends of friends jo Pune mein rehte hain", "in do accounts ke beech shortest referral chain", "fraud rings". Ek relational database mein har hop ek join hai, to ek 4-hop traversal ek 4-way self-join hai jiske intermediate result sets combinatorially explode karte hain. Ek graph database har node ke edges ko direct pointers ke roop mein store karta hai ("index-free adjacency").

**Query languages:** Cypher (Neo4j, GQL standard), Gremlin, SPARQL. **Products:** Neo4j, Amazon Neptune, ArangoDB, Memgraph.

**Kab NAHI:** agar aapका "graph" shallow hai (ek ya do hops) aur zyaादातर aap filter aur aggregate karte ho, achhe indexes ke saath ek relational database simpler hai.

## Time-series databases

Ek time-series database **(timestamp, identifying tags, value)** ke roop mein shaped data ke liye bana hai, high rate par aa raha, lagभag kabhi updated nahi, aur **time windows** mein queried: metrics, IoT sensors, financial ticks.

Workload: writes append-only aur enormous volume mein; reads "is metric ko pichhle ghante over aggregate karo", "downsample karo"; aur purana data value khota hai.

Time-series engines dete hain: **time se automatic partitioning**, **retention policies**, **continuous aggregates / downsampling**, **time-bucketing functions**.

**Products:** **TimescaleDB** (ek Postgres extension), **InfluxDB**, **Prometheus** (metrics + alerting, Kubernetes default, Grafana ke saath paired), **ClickHouse**.

**Kab NAHI:** ek din mein kुछ hazar rows "timestamp ke saath events" bस Postgres mein ek table hai.

## Search engines

Ek search engine **inverted index** ke around bana hai: har term ke liye ye un documents ki list store karta hai jo ise contain karte hain. Ye "in words waale documents dhoondo, ranked by how well they match" ko fast banaता hai.

Ek search engine deta hai: **full-text relevance ranking** (BM25), **analyzers** (stemming, synonyms), **fuzzy matching / typo tolerance**, **faceted search aur aggregations**, **geo queries, autocomplete**.

Critical caveat: **ek search engine ek system of record nahi hai.** Elasticsearch/OpenSearch **eventually consistent** hain, koi cross-document ACID transactions nahi. Aap authoritative data ek transactional database mein rakhte ho aur **ek copy search index mein feed karte ho**.

**Products:** Elasticsearch aur OpenSearch, Meilisearch aur Typesense, Algolia, aur **Postgres FTS** + **pg_trgm** + **pgvector**.

## Common thread

Inmein se koi teen ek relational ya document core replace nahi karta. Har ek aapke data ka ek **specialized projection** hai, source of truth se sync mein rakha.`,

    examples: [
      {
        title: 'A 3-hop question: graph traversal vs SQL self-joins',
        titleHi: 'Ek 3-hop sawal: graph traversal vs SQL self-joins',
        code: `-- "people within 3 friend-hops of Ada who like hiking, and the path to them"

-- Cypher (graph):
MATCH path = (ada:Person {name:'Ada'})-[:FRIEND*1..3]-(p:Person)-[:LIKES]->(:Hobby {name:'Hiking'})
RETURN p.name, length(path)
ORDER BY length(path);

-- SQL (relational): a 3-way self-join on the friendship table, UNION'd for each
-- hop count, with DISTINCT to dedupe the many paths, plus a join to likes.
-- Intermediate rows explode (friends x friends x friends); the planner struggles;
-- and "give me the path" is awkward. WITH RECURSIVE helps but is verbose and slow
-- past a few hops on a large graph.`,
        output: `Graph: index-free adjacency makes each hop a pointer chase; variable-depth traversal (*1..3) and returning the path are native. SQL: each hop is a self-join, intermediates explode combinatorially, paths are awkward. Graph wins when the query IS the traversal.`,
        explain: 'A friendship relationship in a relational schema is rows in a join table, and finding people several hops away means joining that table to itself once per hop, so a three-hop search is a three-way self-join whose intermediate result is the product of the fan-out at each level, which grows combinatorially and defeats the query planner on a large graph, and reconstructing the actual path between two people from that result is cumbersome. A graph database stores each node together with direct references to its edges, so moving from one node to its neighbours is a pointer traversal whose cost does not depend on the total number of nodes, a variable-length pattern such as one-to-three hops is a single expression, and the path taken is a first-class value the query can return. When the essential operation is following connections to a variable depth, the graph model matches the problem and the relational model fights it.',
        explainHi: 'Ek relational schema mein ek friendship relationship ek join table mein rows hain, aur кई hops door log dhoondna matlab us table ko khud se join karna prati hop ek baar, to ek three-hop search ek three-way self-join hai jiska intermediate result har level par fan-out ka product hai, jo combinatorially grow karta hai aur ek large graph par query planner ko defeat karta hai. Ek graph database har node ko iske edges ke direct references ke saath store karta hai, to ek node se iske neighbours par jana ek pointer traversal hai jiski cost total nodes ki sankhya par depend nahi karti. Jab essential operation connections ko ek variable depth tak follow karna hai, graph model problem se match karta hai.',
      },
      {
        title: 'Time-series: raw ingestion, then a continuous rollup for the chart',
        titleHi: 'Time-series: raw ingestion, phir chart ke liye ek continuous rollup',
        code: `-- TimescaleDB (Postgres + hypertables). Sensors write ~50k rows/sec:
CREATE TABLE reading (ts timestamptz, sensor_id int, celsius float);
SELECT create_hypertable('reading', 'ts');   -- auto-partitions by time

-- a continuous aggregate: a rollup that refreshes incrementally, not on read
CREATE MATERIALIZED VIEW reading_1h WITH (timescaledb.continuous) AS
  SELECT time_bucket('1 hour', ts) AS hour, sensor_id,
         avg(celsius), max(celsius), min(celsius)
  FROM reading GROUP BY hour, sensor_id;

-- retention: drop raw data after 7 days, keep the hourly rollup for 2 years
SELECT add_retention_policy('reading', INTERVAL '7 days');

-- the dashboard queries reading_1h (tiny), not reading (billions of rows)`,
        output: `Time-series features: hypertables auto-partition by time; continuous aggregates maintain incremental rollups (raw -> hourly) so charts read the small rollup; retention policies drop aged raw data automatically. The write path is append-only at high rate.`,
        explain: 'Time-series data arrives continuously and in large volume, is essentially never modified after insertion, and is queried as aggregates over time ranges rather than as individual rows, and its value decays with age. A time-series engine is built around these facts. Partitioning the table automatically by time means the storage for a period is a self-contained chunk that can be compressed or dropped as a unit without touching the rest, which makes retention cheap. A continuous aggregate is a materialized rollup that the engine refreshes incrementally as new data lands, so a dashboard reads a small pre-summarized table instead of scanning billions of raw points on every load. A retention policy then deletes the raw data once the rollups capture what matters, bounding storage. TimescaleDB delivers all of this as a Postgres extension, so the same SQL, joins to relational tables, and tooling still apply, which is often preferable to adopting a separate query language and system.',
        explainHi: 'Time-series data continuously aur large volume mein aata hai, insertion ke baad essentially kabhi modified nahi, aur time ranges ke upar aggregates ke roop mein queried, aur iski value age ke saath decay hoti hai. Ek time-series engine in facts ke around bana hai. Table ko time se automatically partition karna matlab ek period ki storage ek self-contained chunk hai jo ek unit ke roop mein compress ya drop ho sakta hai, jo retention ko cheap banaता hai. Ek continuous aggregate ek materialized rollup hai jise engine incrementally refresh karta hai, to ek dashboard ek chhota pre-summarized table padhta hai billions of raw points scan karne ke bजaay. TimescaleDB ye sab ek Postgres extension ke roop mein deta hai.',
      },
      {
        title: 'Search: Postgres is the source of truth, the index is a projection',
        titleHi: 'Search: Postgres source of truth hai, index ek projection hai',
        code: `// products live in Postgres (transactional, authoritative):
await pg.query('INSERT INTO products (id, name, description, price, brand) VALUES ...');

// a CDC pipeline (or an after-commit hook) mirrors each change into the search index:
await search.index('products').addDocuments([{
  id, name, description, price, brand,
}]);

// the app's search box queries the search engine, never Postgres LIKE:
const results = await search.index('products').search('wireles hedphones', {
  filter: 'price < 5000 AND brand IN [Sony, Bose]',
  facets: ['brand', 'price_range'],
});
// -> typo-corrected, relevance-ranked, with per-facet counts, in a few ms

// if the index is lost, rebuild it from Postgres. It holds NO unique truth.`,
        output: `The transactional store (Postgres) is authoritative; the search index is a disposable, queryable projection kept in sync from it (CDC / dual-write / reindex). Search gives relevance ranking, typo tolerance, and facets that LIKE and even Postgres FTS can't match at scale.`,
        explain: 'A search engine\'s strengths, relevance-ranked full-text matching, typo tolerance, stemming and synonyms, and faceted filtering with live counts, come from an inverted index and analysis pipeline that a relational pattern match or even a database\'s built-in full-text feature cannot reproduce at scale or in breadth. But a search engine is distributed and eventually consistent, lacks multi-document transactions, and its index may have to be rebuilt after a schema or analyzer change, so it cannot be trusted as the only copy of the data. The sound architecture keeps the authoritative records in a transactional database and continuously mirrors the searchable fields into the search index, through change data capture, a write that follows the database commit, or a scheduled reindex. The application then directs search queries to the search engine and treats the index as rebuildable at any time from the source of truth, which means losing or corrupting it is an availability event, not a data-loss event.',
        explainHi: 'Ek search engine ki strengths — relevance-ranked full-text matching, typo tolerance, stemming aur synonyms, aur live counts ke saath faceted filtering — ek inverted index aur analysis pipeline se aati hain jo ek relational pattern match ya ek database ka built-in full-text feature scale par reproduce nahi kar sakta. Par ek search engine distributed aur eventually consistent hai, multi-document transactions ki kami hai, aur iska index ek schema change ke baad rebuild karna pad sakta hai, to ise data ki ekmatra copy ke roop mein trust nahi kiya ja sakta. Sound architecture authoritative records ko ek transactional database mein rakhta hai aur searchable fields ko continuously search index mein mirror karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- reaching for a graph database because the schema "has relationships"
-- a normal e-commerce app: users, orders, products, categories, reviews
-- someone models it in Neo4j because "everything is connected"
-- -- but the actual queries are: user's orders, product's reviews, category's
--    products, order total. All one or two hops, all filter-and-aggregate.
--    A relational DB does these better, with transactions the graph DB lacks.`,
        right: `-- use a graph database only when the QUERIES are multi-hop traversals:
--   recommendations ("bought X also bought"), fraud rings, social "reach",
--   dependency/impact analysis, shortest-path / routing
-- for ordinary "get the related rows and aggregate", relational is simpler,
-- faster, transactional, and something everyone already knows.`,
        why: 'Almost every data model has relationships between entities, so the presence of relationships is not what indicates a graph database; what indicates one is a workload of queries that traverse those relationships to a variable and often significant depth, where the path itself or reachability through many hops is the answer. An ordinary application\'s queries, retrieving a user\'s orders, a product\'s reviews, the items in a category, a computed total, are one or two joins and are fundamentally filter-and-aggregate operations, which relational databases execute efficiently with indexes and support with full transactional guarantees that most graph databases do not match. Modeling such an application as a graph adds a specialized system and query language for no benefit on those queries and a cost on the transactional ones. The graph database earns its place specifically at recommendation traversals, fraud-ring detection, social reach, dependency and impact analysis, and shortest-path problems, where the relational equivalent is many self-joins with exploding intermediates.',
        whyHi: 'Lagभag har data model mein entities ke beech relationships hain, to relationships ki presence wo nahi hai jo ek graph database indicate karti hai; jo ise indicate karti hai wo un relationships ko traverse karne wali queries ka ek workload hai ek variable aur aksar significant depth tak, jahaan path khud ya кई hops ke through reachability answer hai. Ek ordinary application ki queries — ek user ke orders, ek product ke reviews — ek ya do joins hain aur fundamentally filter-and-aggregate operations hain, jinhe relational databases indexes ke saath efficiently execute karte hain aur full transactional guarantees ke saath support karte hain. Graph database specifically recommendation traversals, fraud-ring detection, social reach, aur shortest-path problems par apni jagah earn karta hai.',
      },
      {
        wrong: `-- treating Elasticsearch as the primary database
// write user profiles ONLY to Elasticsearch
await es.index({ index: 'users', id, document: profile });
// read them back for the login flow, billing, permissions...
// -- ES is eventually consistent (a read right after a write may not see it),
//    has no transactions, and a mapping change forces a full reindex during
//    which the data is unavailable or inconsistent. You will lose or corrupt data.`,
        right: `// Postgres (or another OLTP db) is the system of record for users.
// Elasticsearch holds a projection for the ONE thing it's great at: search.
await pg.query('INSERT INTO users ...');            // authoritative
await es.index({ index: 'users_search', id, document: searchableFields }); // projection
// login/billing/permissions read Postgres; the "search users" box reads ES.
// lose the ES index -> rebuild it from Postgres, no data lost.`,
        why: 'Elasticsearch and similar search engines are designed as distributed, eventually consistent indexes optimized for query throughput and relevance, and they deliberately omit the guarantees a system of record requires: a read issued immediately after a write is not guaranteed to reflect it, there are no transactions spanning multiple documents, and changing the index mapping generally requires reindexing all the data, during which the index is incomplete. Using such an engine as the only store for data that other parts of the system depend on for correctness, authentication, authorization, billing, means those operations run against a store that can be stale, cannot enforce atomic multi-record changes, and periodically has to be rebuilt. The correct role for a search engine is a secondary index: the authoritative copy lives in a transactional database, and the fields that need to be searchable are projected into the search engine and kept in sync. Reads that require correctness go to the transactional database; search queries go to the search engine; and the search index can be discarded and rebuilt from the source at any time.',
        whyHi: 'Elasticsearch aur similar search engines distributed, eventually consistent indexes ke roop mein design kiye gaye hain jo query throughput aur relevance ke liye optimized hain, aur wo deliberately un guarantees ko omit karte hain jo ek system of record require karta hai: ek write ke turant baad issue kiya gaya ek read ise reflect karne ke liye guaranteed nahi hai, koi transactions nahi hain, aur index mapping badalna generally saara data reindex karna require karta hai. Aise engine ko un data ke ekmatra store ke roop mein istemal karna jinpar system ke doosre parts correctness ke liye depend karte hain matlab wo operations ek store ke against chalti hain jo stale ho sakta hai. Ek search engine ki sahi role ek secondary index hai.',
      },
    ],

    realWorld: [
      {
        en: '**A payments company running Neo4j alongside Postgres purely for fraud detection** — Postgres holds the transactions, a graph of shared devices/cards/addresses/IPs is maintained in Neo4j, and analysts query it for rings ("15 accounts, 3 devices, 1 payout address").',
        hi: '**Ek payments company Postgres ke saath Neo4j chalati hai purely fraud detection ke liye** — Postgres transactions rakhta hai, shared devices/cards ka ek graph Neo4j mein maintained hai.',
      },
      {
        en: '**An infra team on Prometheus + Grafana for metrics and Thanos for long-term storage** — every service exposes a `/metrics` endpoint, Prometheus scrapes and alerts, and nobody stores CPU graphs in Postgres.',
        hi: '**Ek infra team metrics ke liye Prometheus + Grafana par aur long-term storage ke liye Thanos par** — har service ek `/metrics` endpoint expose karti hai.',
      },
      {
        en: '**A marketplace with product data in Postgres and an Elasticsearch index rebuilt nightly + updated via CDC** — the search box, category facets, and "did you mean" all hit Elasticsearch; checkout, inventory, and pricing hit Postgres.',
        hi: '**Ek marketplace Postgres mein product data ke saath aur ek Elasticsearch index nightly rebuilt** — search box, category facets Elasticsearch hit karte hain; checkout, inventory Postgres.',
      },
    ],

    interviewQA: [
      {
        q: 'When does a graph database genuinely beat a relational database, and when is it overkill?',
        qHi: 'Ek graph database genuinely ek relational database se kab jeetta hai, aur kab ye overkill hai?',
        a: 'A graph database genuinely wins when the workload consists of traversals: queries that follow relationships from entity to entity through several hops, often a variable number, and where the answer is the path itself, the set of entities reachable within N hops, or the shortest connection between two entities. Recommendation queries that follow purchase or interaction edges, fraud detection that looks for rings of accounts sharing identifiers, social features that compute reach or degrees of separation, and dependency or impact analysis over a component graph all have this shape. In a relational database each hop is a self-join on a relationship table, so a multi-hop traversal produces intermediate results that grow combinatorially, the planner handles it poorly at depth, and returning the actual path is awkward. A graph database stores each node with direct pointers to its edges, so a hop is a constant-cost pointer traversal and variable-depth patterns are native. It is overkill when the relationships in the model are real but the queries only ever touch one or two hops and are fundamentally filter-and-aggregate: fetch a user\'s orders, a product\'s reviews, a category\'s items. Those are what relational databases do best, with transactional guarantees a graph database often lacks, so introducing a graph database there adds a system and a query language for no gain.',
        aHi: 'Ek graph database genuinely tab jeetta hai jab workload traversals se banta hai: queries jo entities ke beech кई hops ke through relationships follow karti hain, aksar ek variable number, aur jahaan answer path khud hai, N hops ke andar reachable entities ka set, ya do entities ke beech shortest connection. Recommendation queries, fraud detection jo identifiers share karne wale accounts ke rings dhoondti hai, social features jo reach compute karti hain, aur dependency analysis sab ka ye shape hai. Ek relational database mein har hop ek self-join hai, to ek multi-hop traversal intermediate results produce karta hai jo combinatorially grow karte hain. Ye overkill hai jab model mein relationships real hain par queries sirf ek ya do hops touch karti hain aur fundamentally filter-and-aggregate hain.',
      },
      {
        q: 'Why should a search engine like Elasticsearch not be your primary database?',
        qHi: 'Elasticsearch jaisा ek search engine aapका primary database kyun nahi hona chahiye?',
        a: 'A search engine is architected as a distributed, eventually consistent index whose priorities are query throughput, relevance ranking, and rich text and faceting features, and it deliberately does not provide the guarantees an authoritative store needs. A read performed right after a write is not guaranteed to see that write because the change propagates asynchronously. There are no transactions that atomically span multiple documents. Changing the index\'s field mappings or analysis configuration typically requires reindexing the entire dataset, during which the index is incomplete or inconsistent. If the data whose correctness the application depends on for login, authorization, billing, and business rules lives only in the search engine, all of those operations run against a store that can be stale, cannot enforce atomic changes across records, and periodically must be rebuilt. The correct design keeps the authoritative data in a transactional database and projects the searchable fields into the search engine as a secondary index, kept in sync through change data capture, a post-commit write, or a scheduled reindex. Correctness-sensitive reads go to the transactional database, search queries go to the search engine, and the search index is treated as disposable and rebuildable from the source of truth at any time.',
        aHi: 'Ek search engine ek distributed, eventually consistent index ke roop mein architected hai jiski priorities query throughput, relevance ranking, aur rich text features hain, aur ye deliberately un guarantees ko provide nahi karta jo ek authoritative store ko chahiye. Ek write ke turant baad kiya gaya ek read us write ko dekhne ke liye guaranteed nahi hai. Koi transactions nahi hain jo atomically multiple documents span karti hain. Index ke field mappings badalna typically poore dataset ko reindex karna require karta hai. Agar wo data jiski correctness par application login, authorization, billing ke liye depend karti hai sirf search engine mein rehta hai, wo saare operations ek store ke against chalti hain jo stale ho sakta hai. Sahi design authoritative data ko ek transactional database mein rakhta hai.',
      },
    ],

    exercises: [
      {
        task: 'For each, name graph / time-series / search / relational and one line why: (a) "recommend accounts to follow based on who my follows follow", (b) "p99 API latency per endpoint, last 24h, 1-minute resolution", (c) "products matching \'blutooth speker\' under 3000, faceted by brand", (d) "this user\'s last 20 orders".',
        taskHi: 'Har ek ke liye, graph / time-series / search / relational batao: (a) "recommend accounts to follow", (b) "p99 API latency per endpoint, last 24h", (c) "\'blutooth speker\' matching products", (d) "is user ke last 20 orders".',
        hint: '(a) graph — multi-hop traversal of the follow graph. (b) time-series — high-rate append + time-window aggregation + resolution/rollup. (c) search — typo tolerance + relevance + facets. (d) relational — one-hop filter + sort + limit, needs transactions.',
        hintHi: '(a) graph. (b) time-series. (c) search. (d) relational.',
      },
      {
        task: 'In a comment, explain the sync architecture for adding Elasticsearch search to a Postgres-backed app: where the source of truth is, how the index stays current, and what happens when the ES cluster is lost.',
        taskHi: 'Ek comment mein, ek Postgres-backed app mein Elasticsearch search add karne ke liye sync architecture samjhao.',
        hint: 'Source of truth = Postgres. Keep the index current via CDC (stream the WAL), a post-commit write, or a periodic reindex job. Search queries hit ES; correctness reads (auth, checkout) hit Postgres. If ES is lost: rebuild the index from Postgres — it holds no unique data, so it\'s an availability event, not data loss.',
        hintHi: 'Source of truth = Postgres. Index CDC / post-commit write / periodic reindex se current rakho. ES lost: Postgres se rebuild karo — koi data loss nahi.',
      },
      {
        task: 'In a comment, explain why "we have a few thousand events a day with timestamps" does NOT justify a time-series database, and what does.',
        taskHi: 'Ek comment mein, samjhao ki "hamare paas ek din mein kुछ hazar timestamped events hain" ek time-series database ko kyun justify NAHI karta.',
        hint: 'A few thousand rows/day is a tiny table — Postgres with a B-tree index on the timestamp handles the writes and time-range queries trivially. A TSDB earns its place at SUSTAINED HIGH INGESTION (tens of thousands to millions of points/sec) plus a real need for automatic time-partitioning, retention policies, and continuous downsampling/rollups.',
        hintHi: 'Kुछ hazar rows/din ek tiny table hai — Postgres timestamp par ek B-tree index ke saath ise trivially handle karta hai. Ek TSDB SUSTAINED HIGH INGESTION par apni jagah earn karta hai.',
      },
    ],

    keyTakeaways: [
      'THREE SPECIALIZED STORES, each for ONE access pattern a general DB handles badly — and each is usually an ADDITION to a relational/document core, kept in sync from the source of truth (CDC / dual-write / reindex), NOT a replacement.',
      'GRAPH DB (Neo4j, Neptune, ArangoDB): NODES + typed directed EDGES, "index-free adjacency" makes a hop a pointer chase regardless of size. Query in Cypher/Gremlin/GQL. WINS at multi-hop, variable-depth TRAVERSAL where the path or reachability IS the answer — recommendations, fraud rings, social reach, dependency/impact analysis, shortest path (in SQL: N-way self-joins with combinatorially exploding intermediates). OVERKILL when relationships exist but queries are just 1-2 hop filter-and-aggregate — relational is simpler, faster, transactional.',
      'TIME-SERIES DB (TimescaleDB [Postgres extension — keeps SQL/joins], InfluxDB, Prometheus [+Grafana], ClickHouse): data shaped `(timestamp, tags, value)`, append-only at high rate, ~never updated, queried in TIME WINDOWS. Built-in: auto time-partitioning, retention policies (`drop > 90d`), continuous aggregates / downsampling (raw→1m→1h rollups that refresh incrementally), `time_bucket()`. OVERKILL for a few thousand timestamped rows/day — that\'s just a Postgres table with an index.',
      'SEARCH ENGINE (Elasticsearch/OpenSearch [+ log analytics], Meilisearch/Typesense, Algolia; or Postgres FTS + pg_trgm + pgvector): built on an INVERTED INDEX (term → docs). Gives BM25 relevance ranking, analyzers (stemming/synonyms/stop-words), fuzzy/typo tolerance, faceted search + aggregations, geo, autocomplete. **NOT a system of record** — distributed, EVENTUALLY CONSISTENT, no cross-doc transactions, mapping changes force a reindex. Keep truth in Postgres, feed a disposable projection into the index; lose the index → rebuild it, no data lost.',
      'The common thread: each is a SPECIALIZED PROJECTION queried for the one pattern a general DB falls down on. Adding one also adds a system to operate, secure, and keep consistent — worth it only when that access pattern is CENTRAL, not for an occasional query you can serve another way.',
    ],
    keyTakeawaysHi: [
      'TEEN SPECIALIZED STORES, har ek ek access pattern ke liye jise ek general DB bura handle karta hai — aur har ek usually ek relational/document core ka ADDITION hai, source of truth se sync mein rakha, NA ki replacement.',
      'GRAPH DB (Neo4j, Neptune): NODES + typed directed EDGES, "index-free adjacency" ek hop ko size ke bavajood ek pointer chase banaता hai. Cypher/Gremlin mein query. multi-hop, variable-depth TRAVERSAL par JEETTA hai — recommendations, fraud rings, social reach, shortest path. OVERKILL jab relationships hain par queries sirf 1-2 hop filter-and-aggregate hain.',
      'TIME-SERIES DB (TimescaleDB, InfluxDB, Prometheus, ClickHouse): data `(timestamp, tags, value)` shaped, high rate par append-only, ~kabhi updated nahi, TIME WINDOWS mein queried. Built-in: auto time-partitioning, retention policies, continuous aggregates / downsampling, `time_bucket()`. OVERKILL ek din mein kुछ hazar timestamped rows ke liye.',
      'SEARCH ENGINE (Elasticsearch/OpenSearch, Meilisearch/Typesense, Algolia; ya Postgres FTS + pg_trgm + pgvector): INVERTED INDEX par bana. BM25 relevance ranking, analyzers, fuzzy/typo tolerance, faceted search, autocomplete. **Ek system of record NAHI** — distributed, EVENTUALLY CONSISTENT, koi cross-doc transactions nahi. Truth Postgres mein rakho, ek disposable projection index mein feed karo.',
      'Common thread: har ek ek SPECIALIZED PROJECTION hai jo us ek pattern ke liye queried hai jispar ek general DB fall down karta hai. Ek add karna ek system bhi add karta hai jise operate, secure, aur consistent rakhna hai — worth it sirf jab wo access pattern CENTRAL hai.',
    ],
  },

  {
    slug: 'db-wide-column-and-distributed-key-value',
    title: 'Wide-Column & Distributed Key-Value at Scale',
    titleHi: 'Wide-Column Aur Distributed Key-Value At Scale',
    description: 'Cassandra and DynamoDB trade joins, ad-hoc queries, and (by default) strong consistency for one thing: near-linear horizontal scale and predictable low latency at any size. You model the tables around the exact queries in advance, because a query the partition key does not support is either impossible or a full scan.',
    descriptionHi: 'Cassandra aur DynamoDB joins, ad-hoc queries, aur (default se) strong consistency ko ek cheez ke liye trade karte hain: near-linear horizontal scale aur kisi bhi size par predictable low latency. Aap tables ko exact queries ke around pehle se model karte ho, kyunki ek query jise partition key support nahi karti ya to impossible hai ya ek full scan.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A coat-check that scales to a stadium by having a hundred windows, where your ticket number tells you exactly which window — but only if you kept the ticket.** Every item is filed by a key that hashes to one window (partition), so a hundred windows serve a hundred times the crowd with no slowdown and no central desk to bottleneck. Retrieving your coat by ticket is instant at any scale. But "show me all the red coats" means walking every window one by one, and "the coat that goes with this scarf" is not a question the system can answer — there is no cross-referencing. You decide, when you design the coat-check, exactly which lookups the tickets will support.',
      hi: '**Ek coat-check jo ek stadium tak scale karta hai sौ windows rakhkar, jahaan aapka ticket number aapko batata hai exactly kaunsी window — par sirf agar aapne ticket rakha.** Har item ek key se file hai jo ek window (partition) par hash hoti hai, to sौ windows sौ guna bheed serve karti hain bina slowdown ke aur koi central desk bottleneck nahi. Ticket se apna coat retrieve karna kisi bhi scale par instant hai. Par "saare red coats dikhao" matlab har window ek-ek karke walk karna, aur "is scarf ke saath jane wala coat" ek sawal nahi hai jise system answer kar sakta hai. Aap decide karte ho, jab aap coat-check design karte ho, exactly kaunse lookups tickets support karेंge.',
    },

    simple: `**WIDE-COLUMN / DISTRIBUTED KV: Cassandra, ScyllaDB, DynamoDB, Bigtable, HBase.**
Built for: near-LINEAR horizontal scale + predictable low latency at ANY size, and
staying up when nodes / whole datacenters fail.

**THE KEY IS EVERYTHING:**
\`\`\`
PARTITION KEY   -> hashed to decide WHICH node stores the row. Determines scale +
                   distribution. Queries MUST provide it (or you scan every node).
CLUSTERING KEY  -> sorts rows WITHIN a partition. Enables range scans inside one partition.
\`\`\`
=> a partition = all rows with the same partition key, living together, sorted, on
   the same nodes. You size partitions deliberately (not too big, not too hot).

**QUERY-FIRST / SINGLE-TABLE MODELING:**
\`\`\`
1. list every access pattern the app has, up front
2. design a table (or a "view" table) PER access pattern, keyed to serve it in one hit
3. denormalize + duplicate write data into all of them (often in one batch)
\`\`\`
There are NO JOINS. A query the key doesn't support = full scan (Cassandra: often
refused) or a secondary index (limited, with caveats).

**CONSISTENCY IS TUNABLE, per request:**
\`\`\`
Cassandra: consistency level ONE / QUORUM / ALL  (read CL + write CL; R+W > N = strong)
DynamoDB:  eventually consistent (default, cheaper) OR strongly consistent read (opt-in)
\`\`\`

**REACH FOR IT WHEN:** write volume / data size / global-distribution / always-on
needs genuinely exceed what a well-tuned Postgres (+ read replicas + partitioning +
a cache) can do. That bar is HIGH. Most apps never cross it.`,

    simpleHi: `**WIDE-COLUMN / DISTRIBUTED KV: Cassandra, ScyllaDB, DynamoDB, Bigtable, HBase.**
Iske liye bana: near-LINEAR horizontal scale + KISI bhi size par predictable low latency,
aur nodes / poore datacenters fail hone par up rehna.

**KEY SAB KUCH HAI:**
\`\`\`
PARTITION KEY   -> hashed KAUNSA node row store karta hai decide karne ko. Queries ise
                   PROVIDE karni CHAHIYE (ya aap har node scan karte ho).
CLUSTERING KEY  -> ek partition ke ANDAR rows sort karta hai. Ek partition ke andar range scans.
\`\`\`
=> ek partition = same partition key waali saari rows, saath rehti hui, sorted, same nodes par.

**QUERY-FIRST / SINGLE-TABLE MODELING:**
\`\`\`
1. app ke har access pattern ko pehle se list karo
2. PRATI access pattern ek table design karo, ise ek hit mein serve karne ko keyed
3. denormalize + write data ko un sabhi mein duplicate karo (aksar ek batch mein)
\`\`\`
KOI JOINS NAHI. Ek query jise key support nahi karti = full scan ya ek secondary index.

**CONSISTENCY TUNABLE hai, prati request:**
\`\`\`
Cassandra: consistency level ONE / QUORUM / ALL  (R+W > N = strong)
DynamoDB:  eventually consistent (default) YA strongly consistent read (opt-in)
\`\`\`

**ISKE LIYE REACH KARO JAB:** write volume / data size / global-distribution / always-on
needs genuinely wo exceed karti hain jo ek well-tuned Postgres kar sakta hai. Wo bar HIGH hai.`,

    content: `## What this family is

Wide-column and distributed key-value databases — Apache Cassandra, ScyllaDB (a faster C++ reimplementation), Amazon DynamoDB, Google Bigtable, Apache HBase — are built to solve one problem extremely well: **scale out near-linearly across many machines (and datacenters) while keeping read and write latency low and predictable, and stay available when nodes fail.**

They achieve this by giving up things a relational database provides:

- **No joins.** A query hits one table.
- **No ad-hoc queries.** You can efficiently query only by the key structure you designed.
- **Limited or no multi-row transactions** (DynamoDB has bounded transactions; Cassandra has lightweight transactions via Paxos, used sparingly).
- **Eventual consistency by default** (tunable — see below).

In exchange: a well-run Cassandra or DynamoDB cluster serves millions of operations per second, single-digit-millisecond latency at the 99th percentile, petabytes of data, active-active across regions, with no single point of failure and node loss handled transparently.

## The data model: partition key + clustering key

The primary key has two parts:

- **Partition key** — hashed to determine **which nodes** store the row (each partition is replicated to N nodes). All rows sharing a partition key live together, on the same nodes. This is the unit of distribution and the unit of a single-partition query. Choosing it determines whether load spreads evenly or concentrates on a "hot" partition.
- **Clustering key** (Cassandra) / **sort key** (DynamoDB) — orders the rows **within** a partition, enabling efficient range scans inside one partition (\`WHERE partition_key = ? AND clustering_key > ?\`).

A query that supplies the full partition key is fast and touches one set of nodes. A query that does **not** supply the partition key must scan every partition on every node — in Cassandra this is usually refused (\`ALLOW FILTERING\` required, and discouraged); in DynamoDB it is a \`Scan\` (slow, expensive, avoided).

Partitions must be **sized deliberately**: too large (millions of rows / hundreds of MB) and they become slow and unbalanced; too hot (one partition getting most of the traffic — e.g. partitioning by \`country\` when 90% of users are in one) and that node saturates while others idle.

## Query-first modeling

You cannot bolt queries on later. The process is inverted from relational modeling:

1. **Enumerate every access pattern** the application will have. ("Get a user by id." "List a user\'s orders newest-first." "List orders by status for a given day.")
2. **Design a table per access pattern**, with the partition and clustering keys chosen so that pattern is a single-partition query. "List a user\'s orders newest-first" → a table partitioned by \`user_id\`, clustered by \`order_date DESC\`.
3. **Write the same data into every table that needs it**, denormalized, often in one batch. There is no join to reassemble it later, and no \`GROUP BY\` — if you need a count, you maintain a counter.

DynamoDB practitioners often take this further into **single-table design**: one physical table holding many entity types, with generic \`PK\`/\`SK\` attributes overloaded so that different key patterns retrieve different "views", minimizing the number of tables and round trips. It is powerful and notoriously hard to get right.

Secondary indexes exist (Cassandra\'s are local per-node and often a trap at scale; DynamoDB\'s Global Secondary Indexes are effectively separate replicated tables you provision and pay for) but the core discipline is: **model for the queries, up front.**

## Tunable consistency

These systems let you choose, **per operation**, where you sit on the consistency/latency/availability trade:

- **Cassandra** — each read and write specifies a **consistency level**: \`ONE\` (fastest, one replica responds), \`QUORUM\` (a majority of replicas), \`ALL\` (every replica), \`LOCAL_QUORUM\` (majority in the local datacenter), etc. If **write CL + read CL > replication factor**, a read is guaranteed to see the latest acknowledged write (\`QUORUM\` writes + \`QUORUM\` reads with RF 3 gives strong consistency); lower levels give lower latency and higher availability but may return stale data.
- **DynamoDB** — reads are **eventually consistent by default** (cheaper, lower latency) or **strongly consistent** if you ask (higher cost, must read from the leader replica). Writes are always acknowledged by a quorum.

This is the practical face of the CAP/PACELC trade (Lesson 4): you dial it per request rather than choosing once for the whole system.

## When to actually reach for one

The honest answer: **less often than people think.** A single well-provisioned PostgreSQL instance handles tens of thousands of transactions per second and terabytes of data. Add read replicas, connection pooling, a Redis cache, table partitioning, and careful indexing, and it serves the large majority of applications that will ever exist, including many at significant scale.

Reach for Cassandra / DynamoDB when one or more of these is genuinely true and cannot be engineered away:

- **Write throughput** sustained beyond what one primary (which can\'t be sharded natively in vanilla Postgres/MySQL) can absorb.
- **Data volume** that makes a single-node database operationally painful (backups, failover, vacuum) — many tens of terabytes and growing.
- **Global, active-active** writes — users on multiple continents writing to a local replica with automatic conflict handling.
- **Always-on** requirements where node or datacenter loss must be invisible, and the app can accept eventual consistency for most operations.
- **Predictable latency at scale** as a hard product requirement (DynamoDB\'s single-digit-ms promise regardless of table size).

If none of these bites, the operational cost — query-first modeling, no joins, rebalancing, the expertise required — is a poor trade. Distributed SQL databases (**CockroachDB**, **YugabyteDB**, **Spanner**, **TiDB**, **Vitess**) are a middle path: horizontal scale and multi-region with SQL, joins, and strong consistency, at the cost of higher write latency than a single node and their own operational complexity.`,

    contentHi: `## Ye family kya hai

Wide-column aur distributed key-value databases — Apache Cassandra, ScyllaDB, Amazon DynamoDB, Google Bigtable, Apache HBase — ek problem ko extremely well solve karne ke liye bane hain: **kई machines ke across near-linearly scale out karo jab read/write latency ko low aur predictable rakhte hue, aur nodes fail hone par available raho.**

Wo relational database jo cheezen provide karta hai unhe give up karke ye achieve karte hain: **koi joins nahi**, **koi ad-hoc queries nahi**, **limited ya koi multi-row transactions nahi**, **default se eventual consistency**.

Exchange mein: ek well-run cluster millions of operations per second, 99th percentile par single-digit-millisecond latency, petabytes of data, regions ke across active-active serve karta hai.

## Data model: partition key + clustering key

- **Partition key** — hashed KAUNSE nodes row store karte hain determine karne ko. Ek partition key share karne wali saari rows saath rehti hain. Ye distribution ki unit hai. Ise choose karna determine karta hai ki load evenly spread hota hai ya ek "hot" partition par concentrate.
- **Clustering key** / **sort key** — ek partition ke **andar** rows order karta hai, ek partition ke andar efficient range scans enable karta hai.

Ek query jo full partition key supply karti hai fast hai. Ek query jo partition key supply NAHI karti har node par har partition scan karni padti hai — Cassandra mein ye usually refused hai.

Partitions ko **deliberately size** karna chahiye: bahut large aur wo slow ho jate hain; bahut hot aur wo node saturate hota hai.

## Query-first modeling

1. **Har access pattern enumerate karo** jo application ke paas hoga.
2. **Prati access pattern ek table design karo**, partition aur clustering keys chune gaye taaki wo pattern ek single-partition query ho.
3. **Usi data ko har table mein likho** jise iski zaroorat hai, denormalized.

Koi join nahi, koi \`GROUP BY\` nahi — agar count chahiye, ek counter maintain karo.

DynamoDB practitioners aksar ise **single-table design** mein aage le jate hain.

## Tunable consistency

- **Cassandra** — har read aur write ek **consistency level** specify karta hai: \`ONE\`, \`QUORUM\`, \`ALL\`, \`LOCAL_QUORUM\`. Agar **write CL + read CL > replication factor**, ek read latest acknowledged write dekhne ke liye guaranteed hai.
- **DynamoDB** — reads **default se eventually consistent** ya **strongly consistent** agar aap maangte ho.

## Kab actually reach karें

Honest answer: **jitna log sochte hain usse kam.** Ek single well-provisioned PostgreSQL instance tens of thousands of transactions per second handle karta hai. Read replicas, pooling, ek Redis cache, partitioning add karo, aur ye zyaादातर applications serve karta hai.

Cassandra / DynamoDB ke liye reach karo jab: write throughput ek primary se aage; data volume jo ek single-node database ko operationally painful banaता hai; global active-active writes; always-on requirements.

Distributed SQL databases (**CockroachDB**, **YugabyteDB**, **Spanner**, **TiDB**) ek middle path hain: SQL, joins, aur strong consistency ke saath horizontal scale.`,

    examples: [
      {
        title: 'One table per access pattern, keyed to serve it in a single hit',
        titleHi: 'Prati access pattern ek table, ise ek single hit mein serve karne ko keyed',
        code: `-- Cassandra. Access patterns: (1) get order by id, (2) a user's orders newest-first.
-- That's TWO tables holding the same order data, each keyed for its query:

CREATE TABLE orders_by_id (
  order_id uuid PRIMARY KEY,
  user_id uuid, status text, total int, created_at timestamp
);

CREATE TABLE orders_by_user (
  user_id uuid,
  created_at timestamp,
  order_id uuid,
  status text, total int,
  PRIMARY KEY ((user_id), created_at)      -- partition by user, cluster by time
) WITH CLUSTERING ORDER BY (created_at DESC);

-- writing an order = insert into BOTH (often a BATCH):
INSERT INTO orders_by_id  (order_id, user_id, status, total, created_at) VALUES (...);
INSERT INTO orders_by_user (user_id, created_at, order_id, status, total) VALUES (...);

-- query 1: SELECT * FROM orders_by_id WHERE order_id = ?;          -- one partition
-- query 2: SELECT * FROM orders_by_user WHERE user_id = ? LIMIT 20; -- one partition, sorted`,
        output: `No joins, no GROUP BY: you design a table per access pattern, key it so the query is a single-partition lookup, and duplicate the write into every table that serves a pattern. "A user's orders newest-first" is a partition (user_id) clustered by created_at DESC.`,
        explain: 'In a wide-column database a query is efficient only when it supplies the full partition key, because that key is hashed to locate the small set of nodes holding the partition, and the query then reads only that partition. There is no join to combine tables and no way to efficiently filter or sort by a column that is not part of the key, so a single normalized table cannot serve multiple different access patterns. The modeling method is therefore to list the access patterns first and create a table for each one, with the partition key set to the value the query filters on and the clustering key set to the column it sorts or ranges by, so that every intended query is a single-partition read. The same underlying record, an order, is written into every table that needs to answer a query about it, in denormalized form, usually as one batch, because there is no later opportunity to reassemble it. Retrieving an order by its id and listing a user\'s recent orders are two different queries and therefore two tables.',
        explainHi: 'Ek wide-column database mein ek query sirf tab efficient hai jab ye full partition key supply karti hai, kyunki wo key hash hoti hai partition rakhne wale nodes ke chhote set ko locate karne ke liye. Koi join nahi hai tables combine karne ko aur ek column se efficiently filter ya sort karne ka koi tarika nahi jo key ka part nahi hai, to ek single normalized table multiple alag access patterns serve nahi kar sakti. Modeling method isliye access patterns ko pehle list karna aur har ek ke liye ek table banana hai, partition key us value par set jispar query filter karti hai aur clustering key us column par jispar ye sort karti hai. Wahi underlying record har table mein likha jata hai.',
      },
      {
        title: 'Cassandra tunable consistency: QUORUM + QUORUM = strong',
        titleHi: 'Cassandra tunable consistency: QUORUM + QUORUM = strong',
        code: `-- replication factor 3 (each row on 3 nodes)

-- fast, cheap, may read stale: one replica answers each
SELECT balance FROM accounts WHERE id = ?;              -- CONSISTENCY ONE

-- strong: a write to a majority (2 of 3) + a read from a majority (2 of 3)
-- means the read set and write set always overlap on >=1 up-to-date node
INSERT INTO accounts (id, balance) VALUES (?, ?);       -- CONSISTENCY QUORUM (write)
SELECT balance FROM accounts WHERE id = ?;              -- CONSISTENCY QUORUM (read)
-- W(2) + R(2) = 4 > RF(3)  -> guaranteed to see the latest acknowledged write

-- multi-region: LOCAL_QUORUM keeps latency low by only requiring a majority
-- in the caller's own datacenter`,
        output: `Consistency is set per request. CL ONE is fastest and may be stale. When write CL + read CL > replication factor, the read and write quorums overlap on at least one current replica, giving strong consistency (e.g. QUORUM+QUORUM at RF 3). LOCAL_QUORUM bounds latency in multi-region setups.`,
        explain: 'Cassandra replicates each row to a fixed number of nodes and lets every individual read and write state how many of those replicas must respond before the operation is considered successful. A low level such as one replica gives the lowest latency and highest availability, since the operation succeeds as long as any single replica is reachable, but a read at that level can return a value from a replica that has not yet received the most recent write. Strong consistency is obtained by arithmetic: if the number of replicas a write waits for plus the number a read waits for exceeds the total replica count, then the set of replicas that acknowledged the write and the set that answer the read must share at least one replica, and that shared replica has the latest value, so the read sees it. With three replicas, requiring a majority of two for both writes and reads satisfies this. In a multi-region deployment, requiring a majority only within the caller\'s own datacenter keeps latency low while still providing consistency locally, at the cost of cross-region guarantees. The trade between latency, availability, and staleness is thus a per-operation choice rather than a fixed property of the database.',
        explainHi: 'Cassandra har row ko nodes ki ek fixed sankhya par replicate karta hai aur har individual read aur write ko state karne deta hai kitne un replicas ko respond karna chahiye. Ek low level jaise ek replica lowest latency deta hai, par us level par ek read ek replica se ek value return kar sakta hai jise abhi tak sabse recent write nahi mila. Strong consistency arithmetic se milti hai: agar ek write jitne replicas ke liye wait karti hai plus ek read jitne ke liye wait karti hai total replica count exceed karta hai, to jo set write acknowledge karta hai aur jo set read answer karta hai kam se kam ek replica share karne chahiye. Teen replicas ke saath, dono ke liye do ki majority require karna ise satisfy karta hai.',
      },
      {
        title: 'The scaling decision: what a tuned Postgres does before you need Cassandra',
        titleHi: 'Scaling decision: Cassandra ki zaroorat se pehle ek tuned Postgres kya karta hai',
        code: `// before reaching for a distributed KV store, a single Postgres primary + support
// pieces covers a very large range:

//  - one primary                : tens of thousands of write TPS, terabytes
//  - + connection pooling (pgbouncer) : 10k+ app connections -> ~100 db connections
//  - + read replicas            : scale reads horizontally, offload reporting
//  - + Redis cache in front     : absorb the hot read path
//  - + table partitioning       : keep big tables (events, logs) manageable
//  - + careful indexing / query tuning
//  - + TimescaleDB / Citus extension : time-series or sharded Postgres if needed

// reach for Cassandra / DynamoDB when write volume, data size, global active-active,
// or a hard predictable-latency-at-any-scale requirement genuinely exceeds all of that.
// That threshold is high; most systems never hit it.`,
        output: `A single well-tuned Postgres (+ pooling + replicas + cache + partitioning) serves the large majority of applications, including many at real scale. Wide-column stores earn their place only past sustained write throughput, huge data volume, global active-active writes, or a hard latency-at-scale SLA.`,
        explain: 'The capabilities a distributed key-value store provides, horizontal write scaling, very large data volumes handled routinely, multi-region active-active operation, and latency that stays flat as data grows, are real, but a single relational primary supported by standard techniques covers far more ground than is often assumed before any of those capabilities becomes necessary. One PostgreSQL instance handles tens of thousands of writes per second and terabytes of data; a connection pooler lets thousands of application connections share a small pool of database connections; read replicas scale read traffic and isolate analytical load; a cache in front absorbs the hottest reads; partitioning keeps the largest tables operationally manageable; and extensions add sharded or time-series capability within the Postgres ecosystem. Adopting a wide-column store means taking on query-first modeling, the absence of joins, cluster rebalancing, and the specialized expertise all of that requires, which is only a good trade when sustained write throughput, data volume, genuine global write distribution, or a contractual latency guarantee at scale exceeds what the relational path can reach. Most systems never get there, and a distributed SQL database is a middle option that keeps SQL and strong consistency while scaling out.',
        explainHi: 'Jo capabilities ek distributed key-value store provide karta hai — horizontal write scaling, bahut large data volumes, multi-region active-active operation, aur latency jo data badhne par flat rehti hai — real hain, par standard techniques se supported ek single relational primary aksar assume kiye jane se kahin zyada ground cover karta hai. Ek PostgreSQL instance tens of thousands of writes per second aur terabytes handle karta hai; ek connection pooler hazaron application connections ko share karne deta hai; read replicas read traffic scale karte hain; ek cache hottest reads absorb karta hai; partitioning largest tables ko manageable rakhta hai. Ek wide-column store adopt karna query-first modeling, joins ki absence, cluster rebalancing lena hai, jo sirf ek achha trade hai jab sustained write throughput ya data volume relational path se aage jata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- modeling Cassandra like a relational database, then querying flexibly
CREATE TABLE users (id uuid PRIMARY KEY, email text, country text, plan text);
-- later:
SELECT * FROM users WHERE country = 'IN' AND plan = 'pro';
-- -- country and plan aren't the partition key. Cassandra refuses this without
--    ALLOW FILTERING, and with it, the query scans EVERY partition on EVERY node.
--    It gets slower as the cluster grows -- the opposite of the point.`,
        right: `-- model a table for that exact query, keyed to serve it in one partition:
CREATE TABLE users_by_country_plan (
  country text, plan text, user_id uuid, email text,
  PRIMARY KEY ((country, plan), user_id)
);
-- SELECT * FROM users_by_country_plan WHERE country = 'IN' AND plan = 'pro';
-- one partition, one set of nodes, fast at any cluster size.
-- (and watch partition size: if one (country, plan) has millions of users,
--  add a bucket to the partition key to split it.)`,
        why: 'A wide-column database routes and serves a query by hashing its partition key to a specific small set of nodes and reading only the partition stored there. A query that filters on columns which are not the partition key has no partition to target, so the database must examine every partition on every node to find matches, which is a full cluster scan whose cost grows with the size of the cluster, the exact opposite of the horizontal-scaling property the database exists to provide. Cassandra refuses such queries unless explicitly overridden, and the override is a warning sign rather than a solution. The correct approach is to create a table whose partition key is precisely the set of columns that query filters on, so the query becomes a single-partition read that stays fast no matter how large the cluster grows, and to accept that this table duplicates data already held in other tables keyed for other queries. Partition size must also be watched: if the chosen key produces partitions with millions of rows, an additional bucketing component is added to the key to split them.',
        whyHi: 'Ek wide-column database ek query ko route aur serve karta hai iski partition key ko ek specific chhote set of nodes par hash karke aur wahaan stored partition ko padhke. Ek query jo un columns par filter karti hai jo partition key nahi hain iske paas target karne ke liye koi partition nahi, to database ko har node par har partition examine karna padta hai, jo ek full cluster scan hai jiski cost cluster ke size ke saath badhti hai — exactly opposite horizontal-scaling property ka. Sahi approach ek table banana hai jiski partition key precisely un columns ka set hai jispar query filter karti hai, aur accept karna ki ye table data duplicate karti hai.',
      },
      {
        wrong: `-- choosing DynamoDB / Cassandra for a normal app "so it scales later"
-- a B2B SaaS with 200 customers, maybe 50 req/s, needs reports and joins
-- team picks DynamoDB, spends months on single-table design, can't run the
-- ad-hoc queries the business asks for, adds a second database for analytics,
-- and never approaches a scale a single Postgres wouldn't have handled easily.`,
        right: `-- default to PostgreSQL. It gives you joins, ad-hoc queries, transactions,
-- JSONB, full-text, and a huge ecosystem, and it scales further than most
-- teams will ever need with replicas + pooling + a cache + partitioning.
-- if you genuinely outgrow it, migrate the specific hot workload then --
-- with real numbers, not a hypothetical. Or use a distributed SQL DB
-- (CockroachDB, Yugabyte) to keep SQL while scaling out.`,
        why: 'Choosing a distributed key-value store for an application that does not have a scale problem trades away capabilities the application needs now, joins, ad-hoc queries the business will inevitably ask for, multi-row transactions, aggregation, in exchange for a scaling headroom the application may never use. The modeling cost is paid immediately and continuously: every access pattern must be known in advance and given its own table or key structure, changes to query requirements often mean new tables and backfills, and analytical questions cannot be answered without exporting to another system. Meanwhile a single relational database with replicas, pooling, caching, and partitioning handles workloads far larger than a two-hundred-customer business will generate. The disciplined approach is to default to a relational database, which keeps all options open, and to move a specific workload to a specialized store only when concrete measurements show it has outgrown what the relational path can deliver. If horizontal scale does become a real requirement, a distributed SQL database provides it while preserving SQL, joins, and strong consistency, which is usually a better fit than a key-value store for an application that was built around relational assumptions.',
        whyHi: 'Ek application ke liye ek distributed key-value store chunna jiske paas ek scale problem nahi hai un capabilities ko trade away karta hai jo application ko abhi chahiye — joins, ad-hoc queries jo business inevitably poochega, multi-row transactions, aggregation — ek scaling headroom ke exchange mein jo application kabhi istemal nahi kar sakti. Modeling cost turant aur continuously pay hoti hai: har access pattern pehle se pata hona chahiye. Disciplined approach ek relational database ko default karna hai, jo saare options open rakhta hai, aur ek specific workload ko ek specialized store par move karna sirf jab concrete measurements dikhाते hain. Agar horizontal scale ek real requirement ban jata hai, ek distributed SQL database ise provide karta hai jab SQL, joins, aur strong consistency preserve karte hue.',
      },
    ],

    realWorld: [
      {
        en: '**A messaging platform storing messages in Cassandra, partitioned by `conversation_id` and clustered by `sent_at`** — "the last 50 messages in this conversation" is one fast single-partition query, billions of messages, no single point of failure.',
        hi: '**Ek messaging platform Cassandra mein messages store karta hai, `conversation_id` se partitioned aur `sent_at` se clustered** — "is conversation ke last 50 messages" ek fast single-partition query hai.',
      },
      {
        en: '**A shopping cart and session service on DynamoDB with single-table design** — key patterns for "cart by user", "session by token", predictable single-digit-ms latency during traffic spikes, and auto-scaling the team never has to think about.',
        hi: '**DynamoDB par ek shopping cart aur session service single-table design ke saath** — "cart by user", "session by token" ke key patterns, predictable single-digit-ms latency.',
      },
      {
        en: '**A fintech that evaluated Cassandra, then chose CockroachDB** — they needed multi-region and horizontal scale but also joins, foreign keys, and serializable transactions for the ledger, so distributed SQL was the right middle ground.',
        hi: '**Ek fintech jisne Cassandra evaluate kiya, phir CockroachDB chuna** — unhe multi-region aur horizontal scale chahiye tha par joins aur serializable transactions bhi.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain partition key and clustering key in Cassandra/DynamoDB and why query-first modeling is required.',
        qHi: 'Cassandra/DynamoDB mein partition key aur clustering key samjhao aur query-first modeling kyun required hai.',
        a: 'The primary key of a wide-column table has two roles. The partition key is hashed to decide which nodes store a row, and every row sharing a partition key value is stored together on that same set of replica nodes; it is both the unit of data distribution across the cluster and the unit that a single efficient query targets. The clustering key, called the sort key in DynamoDB, orders the rows within a partition, which makes range scans and ordered retrieval within one partition efficient. A query that provides the full partition key is routed to a small set of nodes and reads one partition, so it stays fast regardless of how large the cluster grows. A query that does not provide the partition key has nothing to target and must scan every partition on every node, which Cassandra generally refuses and which defeats the purpose of the system. Because efficient access is possible only through the key structure, and there are no joins and no efficient filtering or grouping on non-key columns, you cannot add new query shapes to an existing table later. Modeling therefore starts from a complete list of the application\'s access patterns, creates a table for each with keys chosen so that pattern is a single-partition query, and writes the same data, denormalized, into every table that serves a pattern.',
        aHi: 'Ek wide-column table ki primary key ke do roles hain. Partition key hash hoti hai decide karne ko kaunse nodes ek row store karte hain, aur ek partition key value share karne wali har row us same set of replica nodes par saath store hoti hai; ye cluster ke across data distribution ki unit hai aur wo unit jise ek single efficient query target karti hai. Clustering key ek partition ke andar rows order karti hai. Ek query jo full partition key provide karti hai ek chhote set of nodes par routed hoti hai. Ek query jo partition key provide nahi karti har node par har partition scan karni padti hai. Kyunki efficient access sirf key structure ke through possible hai, aur koi joins nahi, aap baad mein naye query shapes add nahi kar sakte. Modeling isliye access patterns ki ek complete list se shuru hoti hai.',
      },
      {
        q: 'When is a wide-column store like Cassandra or DynamoDB the right choice, and what is the alternative for most apps?',
        qHi: 'Cassandra ya DynamoDB jaisा ek wide-column store kab sahi choice hai, aur zyaादातर apps ke liye alternative kya hai?',
        a: 'A wide-column store is the right choice when the application genuinely needs one or more of: sustained write throughput beyond what a single relational primary can absorb, since vanilla Postgres and MySQL do not shard writes natively; data volume large enough that operating a single-node database becomes painful, in the many tens of terabytes and growing; globally distributed active-active writes where users on different continents write to a nearby replica with automatic conflict handling; an always-on requirement where the loss of nodes or a whole datacenter must be invisible and the application can tolerate eventual consistency for most operations; or a hard product requirement for latency that stays flat as the dataset grows, which DynamoDB in particular guarantees. In exchange the application gives up joins, ad-hoc queries, most multi-row transactions, and default strong consistency, and takes on query-first modeling and cluster operations. For the large majority of applications none of those conditions applies, and the alternative is a single well-provisioned PostgreSQL instance supported by connection pooling, read replicas, a cache, table partitioning, and careful indexing, which handles workloads far larger than most teams will reach. When horizontal scale does become genuinely necessary but the application still needs SQL, joins, and strong consistency, a distributed SQL database such as CockroachDB, YugabyteDB, or Spanner is the middle path, scaling out at the cost of higher write latency than a single node.',
        aHi: 'Ek wide-column store sahi choice hai jab application ko genuinely inmein se ek ya zyada chahiye: sustained write throughput jo ek single relational primary se aage; data volume itna large ki ek single-node database operate karna painful ho jata hai; globally distributed active-active writes; ek always-on requirement jahaan nodes ya ek poore datacenter ka loss invisible hona chahiye; ya latency ke liye ek hard product requirement jo dataset badhne par flat rehti hai. Exchange mein application joins, ad-hoc queries, zyaादातर multi-row transactions, aur default strong consistency give up karti hai. Zyaादातर applications ke liye inmein se koi condition apply nahi hoti, aur alternative ek single well-provisioned PostgreSQL instance hai. Jab horizontal scale genuinely necessary ho jata hai par application ko abhi bhi SQL chahiye, ek distributed SQL database middle path hai.',
      },
    ],

    exercises: [
      {
        task: 'A Cassandra table `messages` is `PRIMARY KEY ((conversation_id), sent_at)`. In a comment, say which of these are efficient and which are cluster scans: (a) last 50 messages of conversation X, (b) all messages sent by user Y across all conversations, (c) messages in conversation X after timestamp T.',
        taskHi: 'Ek Cassandra table `messages` `PRIMARY KEY ((conversation_id), sent_at)` hai. Ek comment mein, batao inmein se kaunse efficient hain: (a) conversation X ke last 50 messages, (b) user Y ke saare messages saari conversations ke across, (c) timestamp T ke baad conversation X ke messages.',
        hint: '(a) efficient — full partition key + clustering-key limit, one partition. (b) cluster scan — `user` is not the partition key; needs a separate `messages_by_user` table. (c) efficient — partition key + clustering-key range, one partition.',
        hintHi: '(a) efficient — full partition key. (b) cluster scan — `user` partition key nahi hai. (c) efficient — partition key + clustering-key range.',
      },
      {
        task: 'In a comment, list everything a single well-tuned Postgres (+ standard supporting pieces) gives you before Cassandra/DynamoDB becomes necessary, and the specific conditions that finally justify the switch.',
        taskHi: 'Ek comment mein, sab kुछ list karo jo ek single well-tuned Postgres deta hai Cassandra/DynamoDB necessary hone se pehle.',
        hint: 'Postgres path: one primary (tens of k write TPS, TB of data) + pgbouncer pooling + read replicas + Redis cache + table partitioning + indexing/tuning + Citus/Timescale extensions. Switch justified by: sustained write throughput past one primary, tens+ of TB, global active-active writes, node/DC loss must be invisible, or a hard flat-latency-at-scale SLA.',
        hintHi: 'Postgres path: one primary + pgbouncer + read replicas + Redis cache + partitioning + indexing. Switch justified: write throughput past one primary, tens+ of TB, global active-active, hard flat-latency SLA.',
      },
      {
        task: 'A team wants horizontal scale and multi-region but their ledger needs joins, foreign keys, and serializable transactions. In a comment, explain why plain Cassandra is a poor fit and what category of database fits instead.',
        taskHi: 'Ek team ko horizontal scale aur multi-region chahiye par unke ledger ko joins aur serializable transactions chahiye. Ek comment mein, samjhao ki plain Cassandra ek poor fit kyun hai.',
        hint: 'Cassandra has no joins, no foreign keys, and only limited lightweight transactions (Paxos, used sparingly) — a ledger needs all three. The fit is a DISTRIBUTED SQL database (CockroachDB, YugabyteDB, Spanner, TiDB): horizontal scale + multi-region + SQL + joins + serializable transactions, trading higher write latency than a single node.',
        hintHi: 'Cassandra mein koi joins nahi, koi foreign keys nahi, sirf limited lightweight transactions. Fit ek DISTRIBUTED SQL database hai (CockroachDB, YugabyteDB, Spanner): horizontal scale + SQL + joins + serializable transactions.',
      },
    ],

    keyTakeaways: [
      'WIDE-COLUMN / DISTRIBUTED KV (Cassandra, ScyllaDB, DynamoDB, Bigtable, HBase) trade JOINS, ad-hoc queries, most multi-row transactions, and default strong consistency for: near-LINEAR horizontal scale, predictable low latency at ANY size, active-active multi-region, and transparent node-failure handling.',
      'THE KEY IS EVERYTHING. PARTITION KEY → hashed to decide WHICH nodes store the row; all rows with the same partition key live together; it\'s the unit of distribution AND of a single efficient query. CLUSTERING/SORT KEY → orders rows WITHIN a partition (enables range scans there). A query WITH the full partition key = fast, one node-set. A query WITHOUT it = scan every partition on every node (Cassandra usually refuses; DynamoDB `Scan` = slow/expensive). Size partitions deliberately — not too big, not too hot.',
      'QUERY-FIRST MODELING (inverted from relational): (1) enumerate EVERY access pattern up front; (2) design a table PER pattern, keyed so that pattern is a single-partition query; (3) denormalize + write the same data into every table that serves a pattern (often one batch). NO joins, NO `GROUP BY` — maintain counters. DynamoDB takes this further into SINGLE-TABLE DESIGN (one table, overloaded generic PK/SK). You cannot add new query shapes to an existing table later.',
      'CONSISTENCY IS TUNABLE PER REQUEST. Cassandra: consistency level `ONE`/`QUORUM`/`ALL`/`LOCAL_QUORUM` on each read and write — when write CL + read CL > replication factor, the quorums overlap on a current replica ⇒ STRONG (e.g. QUORUM+QUORUM at RF 3); lower = faster + more available + possibly stale. DynamoDB: eventually consistent reads (default, cheaper) OR strongly consistent reads (opt-in, from the leader).',
      'REACH FOR IT ONLY WHEN write throughput / data volume (tens+ of TB) / global active-active writes / always-on / a hard flat-latency-at-scale SLA genuinely exceed a well-tuned Postgres + pooling + read replicas + cache + partitioning — a bar MOST apps never cross. Don\'t pick it "to scale later": you pay the modeling cost now and lose joins/ad-hoc queries the business will ask for. DISTRIBUTED SQL (CockroachDB, YugabyteDB, Spanner, TiDB, Vitess) is the middle path: horizontal scale + multi-region + SQL + joins + strong consistency, at higher write latency.',
    ],
    keyTakeawaysHi: [
      'WIDE-COLUMN / DISTRIBUTED KV (Cassandra, ScyllaDB, DynamoDB, Bigtable) JOINS, ad-hoc queries, zyaादातर multi-row transactions, aur default strong consistency ko trade karte hain: near-LINEAR horizontal scale, KISI bhi size par predictable low latency, active-active multi-region, aur transparent node-failure handling ke liye.',
      'KEY SAB KUCH HAI. PARTITION KEY → hashed KAUNSE nodes row store karte hain decide karne ko; ye distribution ki unit HAI. CLUSTERING/SORT KEY → ek partition ke ANDAR rows order karta hai. Full partition key WALI query = fast. Iske BINA query = har node par har partition scan. Partitions ko deliberately size karo.',
      'QUERY-FIRST MODELING: (1) HAR access pattern pehle se enumerate karo; (2) PRATI pattern ek table design karo, keyed taaki wo pattern ek single-partition query ho; (3) denormalize + usi data ko har table mein likho. KOI joins nahi, KOI `GROUP BY` nahi — counters maintain karo. DynamoDB ise SINGLE-TABLE DESIGN mein aage le jata hai.',
      'CONSISTENCY PRATI REQUEST TUNABLE hai. Cassandra: `ONE`/`QUORUM`/`ALL` — jab write CL + read CL > replication factor, quorums overlap karte hain ⇒ STRONG. DynamoDB: eventually consistent reads (default) YA strongly consistent reads (opt-in).',
      'ISKE LIYE REACH KARO SIRF JAB write throughput / data volume (tens+ of TB) / global active-active / always-on / ek hard flat-latency SLA genuinely ek well-tuned Postgres + pooling + replicas + cache + partitioning ko exceed karti hai — ek bar MOST apps kabhi cross nahi karte. "Scale later" ke liye mat pick karo. DISTRIBUTED SQL (CockroachDB, YugabyteDB, Spanner) middle path hai: horizontal scale + SQL + joins + strong consistency.',
    ],
  },
];
