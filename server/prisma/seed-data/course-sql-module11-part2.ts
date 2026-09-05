/**
 * Databases Complete Course — Module 11: PostgreSQL Power Features, lessons 4-6.
 *
 * Lesson 4: Upsert, RETURNING & MERGE — INSERT ... ON CONFLICT, RETURNING, DISTINCT ON,
 *           and the unifying MERGE statement (PG15+).
 * Lesson 5: Full-text search — tsvector/tsquery, to_tsvector, ts_rank, and GIN-indexing
 *           a search column.
 * Lesson 6: Materialized views, extensions & operational tooling — materialized views
 *           and REFRESH [CONCURRENTLY], a survey of common extensions, LISTEN/NOTIFY,
 *           and psql meta-commands — closing out Module 11.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 11
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_11_PART2: CourseLesson[] = [
  {
    slug: 'sql-upsert-returning-and-merge',
    title: 'Upsert, RETURNING & MERGE',
    titleHi: 'Upsert, RETURNING Aur MERGE',
    description: '"Insert this row, or update it if it already exists" is common enough to deserve its own syntax: INSERT ... ON CONFLICT. RETURNING hands back the affected rows from any write without a separate SELECT, DISTINCT ON picks one row per group directly, and MERGE unifies insert/update/delete against a source into a single statement.',
    descriptionHi: '"Ye row insert karo, ya agar pehle se exist karti hai to update karo" itna common hai ki iski apni syntax deserve karta hai: `INSERT ... ON CONFLICT`. `RETURNING` kisī bhi write se affected rows ek alag `SELECT` ke bina wapas deता hai, `DISTINCT ON` seedhe prati-group ek row chunta hai, aur `MERGE` ek source ke against insert/update/delete ko ek single statement mein unify karta hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A hotel front desk handling a returning guest\'s reservation in one motion, instead of two.** The naive way to handle "does this guest already have a booking?" is two separate trips to the counter: first check if a reservation exists, then, depending on the answer, either create a new one or update the existing one — and in between those two trips, another guest could walk up and change the situation entirely. A well-trained front desk clerk instead handles it as one atomic motion: try to create the booking, and if the system says "this guest already has one," update that existing booking right there in the same breath, with no gap in between for anyone else to interfere. `INSERT ... ON CONFLICT` is that one-motion clerk. `RETURNING` is the receipt the clerk hands back immediately, confirming exactly what happened, without you having to walk back to the counter and ask "so what\'s my booking now?" separately. And `MERGE` is the same clerk handling an entire tour group\'s reservations against a master list in one pass — for each name on the list, insert a new booking, update an existing one, or cancel one no longer needed, all as a single coordinated procedure rather than three separate passes through the guest list.',
      hi: '**Ek hotel front desk ek returning guest ki reservation ko ek motion mein handle karta hai, do ke bजाय.** "Kya is guest ke paas pehle se ek booking hai?" ko handle karne ka naive tarika counter tak do alag trips hai: pehle check karo ki ek reservation exist karti hai, phir, answer ke hisaab se, ya to ek nayi banao ya existing ko update karo — aur un do trips ke beech, koi aur guest aakar poori situation badal sakta hai. Ek well-trained front desk clerk iske bजаय ise ek atomic motion ke roop mein handle karta hai: booking banane ki koshish karo, aur agar system kahe "is guest ke paas pehle se ek hai," usī saans mein wo existing booking update kar do. `INSERT ... ON CONFLICT` wo one-motion clerk hai. `RETURNING` wo receipt hai jo clerk turant wapas deта hai. Aur `MERGE` wahi clerk hai jo ek poore tour group ki reservations ko ek master list ke against ek pass mein handle karta hai.',
    },

    simple: `**\`INSERT ... ON CONFLICT ... DO UPDATE\`: insert, or update if it already exists**

\`\`\`sql
CREATE TABLE inv (sku text PRIMARY KEY, qty int);
INSERT INTO inv VALUES ('A1', 10);
INSERT INTO inv (sku, qty) VALUES ('A1', 5)
  ON CONFLICT (sku) DO UPDATE SET qty = inv.qty + EXCLUDED.qty
  RETURNING sku, qty;
\`\`\`
\`\`\`
 sku | qty
-----+-----
 A1  | 15
(1 row)
-- EXCLUDED refers to the row that WOULD have been inserted -- here, the new qty=5 --
-- so "qty = inv.qty + EXCLUDED.qty" adds the new amount to the existing one
\`\`\`

**\`ON CONFLICT ... DO NOTHING\`: insert, or silently skip if it already exists**

\`\`\`sql
INSERT INTO inv (sku, qty) VALUES ('A1', 999) ON CONFLICT (sku) DO NOTHING;
-- no error, no change -- the existing row is left exactly as it was
\`\`\`

**\`RETURNING\`: get the affected rows back from ANY write, no separate SELECT**

\`\`\`sql
-- already shown above -- also works on plain INSERT/UPDATE/DELETE (Module 5)
\`\`\`

**\`DISTINCT ON (col)\`: pick ONE row per group directly, no window function needed**

\`\`\`sql
SELECT DISTINCT ON (cust_id) cust_id, id, amt, placed_at
FROM orders ORDER BY cust_id, placed_at DESC;
-- one row per cust_id -- specifically the one with the LATEST placed_at,
-- because ORDER BY controls which row DISTINCT ON keeps
\`\`\`

**\`MERGE\` (PG15+): insert/update/delete against a source table, unified into one statement**

\`\`\`sql
MERGE INTO target t USING source s ON t.id = s.id
  WHEN MATCHED THEN UPDATE SET val = s.val
  WHEN NOT MATCHED THEN INSERT (id, val) VALUES (s.id, s.val);
\`\`\``,

    simpleHi: `**\`INSERT ... ON CONFLICT ... DO UPDATE\`: insert karo, ya agar pehle se exist karti hai to update karo**

\`\`\`sql
CREATE TABLE inv (sku text PRIMARY KEY, qty int);
INSERT INTO inv VALUES ('A1', 10);
INSERT INTO inv (sku, qty) VALUES ('A1', 5)
  ON CONFLICT (sku) DO UPDATE SET qty = inv.qty + EXCLUDED.qty
  RETURNING sku, qty;
\`\`\`
\`\`\`
 sku | qty
-----+-----
 A1  | 15
(1 row)
-- EXCLUDED us row ko refer karta hai jo insert HOTI agar conflict na hota --
-- yahaan, naya qty=5 -- to "qty = inv.qty + EXCLUDED.qty" naye amount ko existing mein jodta hai
\`\`\`

**\`ON CONFLICT ... DO NOTHING\`: insert karo, ya chupchaap skip karo agar pehle se exist karti hai**

\`\`\`sql
INSERT INTO inv (sku, qty) VALUES ('A1', 999) ON CONFLICT (sku) DO NOTHING;
-- koi error nahi, koi change nahi -- existing row theek waisī chhoड़ी jaati hai
\`\`\`

**\`RETURNING\`: KISĪ BHĪ write se affected rows wapas paओ, koi alag SELECT nahi**

\`\`\`sql
-- upar dikhaya gaya -- plain INSERT/UPDATE/DELETE par bhi kaam karta hai (Module 5)
\`\`\`

**\`DISTINCT ON (col)\`: seedhe prati-group EK row chunो, koi window function zaroori nahi**

\`\`\`sql
SELECT DISTINCT ON (cust_id) cust_id, id, amt, placed_at
FROM orders ORDER BY cust_id, placed_at DESC;
-- prati cust_id ek row -- specifically wo jiska placed_at SABSE LATEST hai
\`\`\`

**\`MERGE\` (PG15+): ek source table ke against insert/update/delete, ek statement mein unified**

\`\`\`sql
MERGE INTO target t USING source s ON t.id = s.id
  WHEN MATCHED THEN UPDATE SET val = s.val
  WHEN NOT MATCHED THEN INSERT (id, val) VALUES (s.id, s.val);
\`\`\``,

    content: `## The upsert problem

"Insert this row, but if a row with the same key already exists, update it instead" is common enough — importing data from an external feed, incrementing a counter that might not exist yet — that doing it as two separate statements (check, then insert-or-update) is both slower and genuinely unsafe: between the check and the write, another transaction could insert the same row, and the naive two-step approach would then either error or silently create a duplicate, a race condition Module 9's concurrency lessons already warned about.

## \`INSERT ... ON CONFLICT\`

\`\`\`sql
CREATE TABLE inv (sku text PRIMARY KEY, qty int);
INSERT INTO inv VALUES ('A1', 10);
INSERT INTO inv (sku, qty) VALUES ('A1', 5)
  ON CONFLICT (sku) DO UPDATE SET qty = inv.qty + EXCLUDED.qty
  RETURNING sku, qty;
\`\`\`

\`ON CONFLICT (sku)\` names the constraint (here, the primary key on \`sku\`) whose violation should be handled specially instead of raising an error. \`DO UPDATE SET ...\` says what to do instead: update the existing row. Inside that \`SET\` clause, \`EXCLUDED\` refers to the row that **would have been** inserted — the new, conflicting values — so \`qty = inv.qty + EXCLUDED.qty\` means "add the new quantity to whatever is already there," turning this into an atomic increment-or-create. Because this all happens as a single statement, PostgreSQL handles the conflict-detection and resolution internally, without the check-then-write race condition a hand-rolled two-step version would have.

\`ON CONFLICT (sku) DO NOTHING\` is the simpler sibling: on a conflict, just skip the insert silently, leaving the existing row untouched, useful for idempotent imports where "already present" simply means "nothing to do."

## \`RETURNING\`: get the affected rows back, no extra query

Module 5 introduced \`RETURNING\` for a data-modifying CTE; it works the same way on a plain \`INSERT\`, \`UPDATE\`, or \`DELETE\` directly: instead of only reporting how many rows were affected, the statement hands back the actual row data — after an \`INSERT\` or \`UPDATE\`, the new values; after a \`DELETE\`, the values just removed. This avoids a wasteful and potentially racy separate \`SELECT\` immediately after the write, which is exactly why it appeared in the upsert example above, confirming the resulting quantity in the very same round trip that updated it.

## \`DISTINCT ON\`: one row per group, PostgreSQL-specific

\`\`\`sql
SELECT DISTINCT ON (cust_id) cust_id, id, amt, placed_at
FROM orders ORDER BY cust_id, placed_at DESC;
\`\`\`

\`DISTINCT ON (col)\` keeps exactly one row per distinct value of \`col\`, and the \`ORDER BY\` clause decides **which** row survives: it must begin with the same column(s) named in \`DISTINCT ON\` (here, \`cust_id\`), followed by whatever tiebreaker decides which row within each group wins (here, \`placed_at DESC\`, keeping the most recent order). This is a direct, often more readable alternative to Module 6's \`ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) = 1\` pattern for the specific "top-1-per-group" case — it is PostgreSQL-specific syntax (not standard SQL, unlike window functions), but frequently reads more naturally for exactly this one job.

## \`MERGE\` (PostgreSQL 15+): a unified insert/update/delete against a source

\`\`\`sql
MERGE INTO target t USING source s ON t.id = s.id
  WHEN MATCHED THEN UPDATE SET val = s.val
  WHEN NOT MATCHED THEN INSERT (id, val) VALUES (s.id, s.val);
\`\`\`

\`MERGE\` compares a \`target\` table against a \`source\` (which can be another table, or an arbitrary query) on a join condition, and for each row, applies whichever \`WHEN\` clause matches its situation: \`WHEN MATCHED\` (the row exists in both, so update or delete it) or \`WHEN NOT MATCHED\` (the row exists only in the source, so insert it) — and, less commonly, \`WHEN NOT MATCHED BY SOURCE\` for target rows with no corresponding source row, typically to delete them. \`ON CONFLICT\` solves specifically the "insert, or update on the exact same conflicting key" case for a single incoming row; \`MERGE\` generalizes this to reconciling a whole target table against a whole source table or query in one statement — the natural tool for syncing a table against an external feed, where some rows are new, some have changed, and some may need to disappear entirely, all in a single pass rather than three separate statements.`,

    contentHi: `## Upsert problem

"Ye row insert karo, par agar usī key waali ek row pehle se exist karti hai, iske bजаय ise update karo" itna common hai ki ise do alag statements ke roop mein karna (check karo, phir insert-ya-update) dono slower aur genuinely unsafe hai: check aur write ke beech, ek doosra transaction wahi row insert kar sakta hai.

## \`INSERT ... ON CONFLICT\`

\`\`\`sql
CREATE TABLE inv (sku text PRIMARY KEY, qty int);
INSERT INTO inv VALUES ('A1', 10);
INSERT INTO inv (sku, qty) VALUES ('A1', 5)
  ON CONFLICT (sku) DO UPDATE SET qty = inv.qty + EXCLUDED.qty
  RETURNING sku, qty;
\`\`\`

\`ON CONFLICT (sku)\` us constraint ka naam leта hai (yahaan, \`sku\` par primary key) jiska violation error raise karne ke bजаय specially handle hona chahiye. \`DO UPDATE SET ...\` bataता hai iske bजаय kya karna hai: existing row update karo. Us \`SET\` clause ke andar, \`EXCLUDED\` us row ko refer karta hai jo **insert HOTI** agar conflict na hota.

\`ON CONFLICT (sku) DO NOTHING\` simpler sibling hai: conflict par, bas insert ko chupchaap skip karo, existing row ko untouched chhoड़te hue.

## \`RETURNING\`: affected rows wapas paओ, koi extra query nahi

Module 5 ne ek data-modifying CTE ke liye \`RETURNING\` introduce kiya thа; ye theek waise hi ek plain \`INSERT\`, \`UPDATE\`, ya \`DELETE\` par kaam karta hai seedhe.

## \`DISTINCT ON\`: prati-group ek row, PostgreSQL-specific

\`\`\`sql
SELECT DISTINCT ON (cust_id) cust_id, id, amt, placed_at
FROM orders ORDER BY cust_id, placed_at DESC;
\`\`\`

\`DISTINCT ON (col)\` theek \`col\` ki har distinct value ke liye ek row rakhta hai, aur \`ORDER BY\` clause decide karta hai **kaunsi** row bachती hai.

## \`MERGE\` (PostgreSQL 15+): ek source ke against ek unified insert/update/delete

\`\`\`sql
MERGE INTO target t USING source s ON t.id = s.id
  WHEN MATCHED THEN UPDATE SET val = s.val
  WHEN NOT MATCHED THEN INSERT (id, val) VALUES (s.id, s.val);
\`\`\`

\`MERGE\` ek \`target\` table ko ek \`source\` ke against compare karta hai ek join condition par, aur har row ke liye, jo bhi \`WHEN\` clause uski situation se match karta hai apply karta hai.`,

    examples: [
      {
        title: 'INSERT ... ON CONFLICT DO UPDATE with EXCLUDED and RETURNING',
        titleHi: 'INSERT ... ON CONFLICT DO UPDATE, EXCLUDED aur RETURNING ke saath',
        code: `CREATE TABLE inv (sku text PRIMARY KEY, qty int);
INSERT INTO inv VALUES ('A1', 10);
INSERT INTO inv (sku, qty) VALUES ('A1', 5)
  ON CONFLICT (sku) DO UPDATE SET qty = inv.qty + EXCLUDED.qty
  RETURNING sku, qty;`,
        output: ` sku | qty
-----+-----
 A1  | 15
(1 row)`,
        explain: "The first `INSERT` creates `('A1', 10)`. The second `INSERT` targets the same `sku`, triggering `ON CONFLICT (sku) DO UPDATE`, where `EXCLUDED.qty` is the new incoming value (`5`) and `inv.qty` is the existing stored value (`10`) — `qty = inv.qty + EXCLUDED.qty` combines them into `15`, which `RETURNING` hands back immediately.",
        explainHi: "Pehla `INSERT` `('A1', 10)` banata hai. Doosra `INSERT` usī `sku` ko target karta hai, `ON CONFLICT (sku) DO UPDATE` trigger karte hue, jahaan `EXCLUDED.qty` naya incoming value (`5`) hai aur `inv.qty` existing stored value (`10`) hai — `qty = inv.qty + EXCLUDED.qty` unhe `15` mein combine karta hai, jise `RETURNING` turant wapas deta hai.",
      },
      {
        title: 'DISTINCT ON picks one row per group, chosen by ORDER BY',
        titleHi: 'DISTINCT ON prati-group ek row chunta hai, ORDER BY se chuni gayi',
        code: `CREATE TABLE orders (id int PRIMARY KEY, cust_id int, amt int, placed_at int);
INSERT INTO orders VALUES (1, 1, 50, 1), (2, 1, 80, 2), (3, 2, 30, 1);
SELECT DISTINCT ON (cust_id) cust_id, id, amt, placed_at FROM orders ORDER BY cust_id, placed_at DESC;`,
        output: ` cust_id | id | amt | placed_at
---------+----+-----+-----------
 1       | 2  | 80  | 2
 2       | 3  | 30  | 1
(2 rows)`,
        explain: '`DISTINCT ON (cust_id)` groups the three orders by customer and keeps exactly one row per group, chosen by `ORDER BY cust_id, placed_at DESC` — for customer 1 (orders at `placed_at=1` and `placed_at=2`), the later one (`placed_at=2`, `id=2`, `amt=80`) wins; customer 2 has only one order, which is kept as-is.',
        explainHi: '`DISTINCT ON (cust_id)` teenon orders ko customer se group karta hai aur prati-group theek ek row rakhta hai, `ORDER BY cust_id, placed_at DESC` se chuni gayi — customer 1 ke liye (`placed_at=1` aur `placed_at=2` par orders), baad waala (`placed_at=2`, `id=2`, `amt=80`) jeetta hai; customer 2 ka sirf ek order hai, jo waisа hi rakha jaata hai.',
      },
      {
        title: 'MERGE updates matched rows and inserts unmatched ones in a single statement',
        titleHi: 'MERGE matched rows update karta hai aur unmatched ko insert karta hai ek single statement mein',
        code: `CREATE TABLE target (id int PRIMARY KEY, val int);
CREATE TABLE source (id int PRIMARY KEY, val int);
INSERT INTO target VALUES (1, 100), (2, 200);
INSERT INTO source VALUES (1, 999), (3, 300);
MERGE INTO target t USING source s ON t.id = s.id
  WHEN MATCHED THEN UPDATE SET val = s.val
  WHEN NOT MATCHED THEN INSERT (id, val) VALUES (s.id, s.val);
SELECT * FROM target ORDER BY id;`,
        output: ` id | val
----+-----
 1  | 999
 2  | 200
 3  | 300
(3 rows)`,
        explain: "`id=1` exists in both `target` and `source`, so `WHEN MATCHED` fires and its `val` updates from `100` to the source's `999`. `id=2` exists only in `target`, so `MERGE` leaves it untouched at `200`. `id=3` exists only in `source`, so `WHEN NOT MATCHED` fires and inserts it into `target` as `(3, 300)`.",
        explainHi: '`id=1` `target` aur `source` dono mein exist karta hai, to `WHEN MATCHED` fire hota hai aur iska `val` `100` se source ke `999` mein update hota hai. `id=2` sirf `target` mein exist karta hai, to `MERGE` ise `200` par untouched chhoड़ता hai. `id=3` sirf `source` mein exist karta hai, to `WHEN NOT MATCHED` fire hota hai aur ise `target` mein `(3, 300)` ke roop mein insert karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- doing the "check, then insert or update" upsert as two separate statements
SELECT * FROM inv WHERE sku = 'A1';
-- (application code checks: no row found)
INSERT INTO inv VALUES ('A1', 10);
-- if ANOTHER transaction inserted 'A1' between the SELECT and this INSERT,
-- this INSERT now fails with a duplicate-key error -- or, without a unique
-- constraint, silently creates a duplicate row`,
        right: `INSERT INTO inv VALUES ('A1', 10) ON CONFLICT (sku) DO UPDATE SET qty = inv.qty + EXCLUDED.qty;
-- one atomic statement -- PostgreSQL handles the conflict internally,
-- no gap for another transaction to interfere in between`,
        why: 'Splitting an upsert into a separate check followed by a separate write creates a window of time between the two statements during which another transaction can act, most commonly by inserting the very row the first transaction just confirmed did not exist, a race condition of exactly the kind Module 9\'s concurrency lessons covered. Depending on the schema, this either surfaces immediately as a duplicate-key error on the second transaction\'s INSERT, or, in the absence of a uniqueness constraint, silently creates two rows that should have been one. INSERT ... ON CONFLICT closes this gap entirely by making the check-and-resolve logic part of a single atomic statement that PostgreSQL evaluates as one unit, so there is no window between checking and acting for a concurrent transaction to exploit.',
        whyHi: 'Ek upsert ko ek alag check aur ek alag write mein split karna do statements ke beech ek waqt ki khiड़ki banata hai jiske dauран ek doosra transaction act kar sakta hai, sabse common taur par theek wahi row insert karके jise pehle transaction ne abhi confirm kiya tha ki exist nahi karti, theek us tarah ka ek race condition jo Module 9 ke concurrency lessons ne cover kiya thа. `INSERT ... ON CONFLICT` is gap ko poori tarah band karta hai check-and-resolve logic ko ek single atomic statement ka hissa banакर.',
      },
      {
        wrong: `-- misremembering EXCLUDED as referring to the EXISTING row already in the table
INSERT INTO inv (sku, qty) VALUES ('A1', 5)
  ON CONFLICT (sku) DO UPDATE SET qty = EXCLUDED.qty + EXCLUDED.qty;
-- doubles the NEW value instead of adding it to what was already there`,
        right: `INSERT INTO inv (sku, qty) VALUES ('A1', 5)
  ON CONFLICT (sku) DO UPDATE SET qty = inv.qty + EXCLUDED.qty;
-- "inv.qty" is the EXISTING row's value; "EXCLUDED.qty" is the NEW, conflicting value`,
        why: 'Inside an ON CONFLICT DO UPDATE clause, the bare table name (here inv) refers to the row already stored in the table, the one that caused the conflict, while EXCLUDED specifically refers to the row that would have been inserted had there been no conflict, holding the new incoming values. Confusing which name refers to which side is an easy mistake precisely because both are visible and nameable inside the same SET clause: writing EXCLUDED.qty + EXCLUDED.qty adds the new value to itself, silently ignoring whatever was already stored, while the correct inv.qty + EXCLUDED.qty explicitly combines the existing stored value with the new incoming one. Getting this backwards does not raise any error, since both expressions are syntactically valid; it simply computes the wrong result, which is why understanding EXCLUDED as specifically "the row that almost got inserted" is worth internalizing precisely rather than guessing.',
        whyHi: 'Ek `ON CONFLICT DO UPDATE` clause ke andar, bare table name (yahaan `inv`) us row ko refer karta hai jo table mein pehle se store hai, jisne conflict ka कारण banaya, jabki `EXCLUDED` specifically us row ko refer karta hai jo insert hoti agar koi conflict na hota, naye incoming values rakhte hue. `EXCLUDED.qty + EXCLUDED.qty` likhna naye value ko khud mein jodta hai, jo bhi pehle se store thа use chupchaap ignore karте hue.',
      },
      {
        wrong: `-- writing ORDER BY in DISTINCT ON without leading with the DISTINCT ON column(s)
SELECT DISTINCT ON (cust_id) cust_id, id, amt, placed_at
FROM orders ORDER BY placed_at DESC;
-- ERROR: SELECT DISTINCT ON expressions must match initial ORDER BY expressions`,
        right: `SELECT DISTINCT ON (cust_id) cust_id, id, amt, placed_at
FROM orders ORDER BY cust_id, placed_at DESC;
-- ORDER BY must START with the same column(s) named in DISTINCT ON, THEN the
-- tiebreaker that decides which row within each group survives`,
        why: 'DISTINCT ON groups rows by the column or columns named in its parentheses and keeps exactly one row per group, but it relies entirely on the accompanying ORDER BY to determine both how rows are grouped and, within each group, which single row is the one that survives. PostgreSQL requires the ORDER BY clause to begin with the exact same expressions given to DISTINCT ON, in the same order, because that leading portion is what defines the grouping the DISTINCT ON operates over; only after that required prefix can additional ORDER BY columns act as a tiebreaker deciding which row within each group is kept. Omitting the DISTINCT ON columns from the start of ORDER BY, as in ordering only by placed_at, leaves PostgreSQL without a well-defined way to know which grouping the sort is supposed to respect, which is why it is rejected outright as an error rather than silently doing something unpredictable.',
        whyHi: '`DISTINCT ON` rows ko apne parentheses mein diye gaye column ya columns se group karta hai aur prati-group theek ek row rakhta hai, par ye poori tarah saath waale `ORDER BY` par depend karta hai ye decide karne ke liye ki rows kaise grouped hain aur har group ke andar kaunsi ek row bachती hai. PostgreSQL ko `ORDER BY` clause ko theek wahi expressions se shuru karna zaroori hai jo `DISTINCT ON` ko diye gaye the, usī order mein.',
      },
    ],

    realWorld: [
      {
        en: '**A webhook ingestion endpoint using `INSERT ... ON CONFLICT (event_id) DO NOTHING`** to make retried, duplicate deliveries from an external provider a no-op instead of a duplicate-row bug.',
        hi: '**Ek webhook ingestion endpoint jo `INSERT ... ON CONFLICT (event_id) DO NOTHING` istemal karta hai** ek external provider se retried, duplicate deliveries ko ek no-op banane ke liye.',
      },
      {
        en: '**A "latest status per device" dashboard query built with `DISTINCT ON (device_id) ... ORDER BY device_id, reported_at DESC`**, simpler to read than the equivalent `ROW_NUMBER()` window-function version for this specific top-1-per-group case.',
        hi: '**Ek "prati-device latest status" dashboard query `DISTINCT ON (device_id) ... ORDER BY device_id, reported_at DESC` se banī**, is specific top-1-per-group case ke liye equivalent `ROW_NUMBER()` version se padhne mein simpler.',
      },
      {
        en: '**A nightly `MERGE` reconciling a `products` table against a supplier\'s daily CSV feed** — new SKUs inserted, changed prices updated, discontinued SKUs deleted, all in one statement instead of three separate passes.',
        hi: '**Ek nightly `MERGE` jo ek `products` table ko ek supplier ke daily CSV feed ke against reconcile karta hai** — naye SKUs insert, badले prices update, discontinued SKUs delete, sab ek statement mein.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is INSERT ... ON CONFLICT preferred over a separate SELECT-then-INSERT-or-UPDATE, and what does EXCLUDED refer to?',
        qHi: 'INSERT ... ON CONFLICT ek alag SELECT-then-INSERT-or-UPDATE par kyun prefer kiya jaata hai, aur EXCLUDED kya refer karta hai?',
        a: 'Splitting the "does this row exist" check from the subsequent insert-or-update decision into two separate statements leaves a window of time in between during which another concurrent transaction can act, most often by inserting the very row the check just confirmed was absent, which then causes the second statement to either fail with a duplicate-key error or, if no uniqueness constraint exists, silently create a duplicate. INSERT ... ON CONFLICT closes this window by making the entire check-and-resolve logic part of a single atomic statement that PostgreSQL evaluates as one indivisible unit, so there is no gap for a concurrent transaction to interfere in. Inside the DO UPDATE clause of that statement, EXCLUDED refers specifically to the row that would have been inserted had the conflict not occurred, meaning it holds the new, incoming values, while a bare reference to the table name inside that same clause refers to the row already present in the table that caused the conflict in the first place; combining the two, such as inv.qty + EXCLUDED.qty, is how an upsert expresses "combine the existing stored value with the new incoming one" rather than simply overwriting one with the other.',
        aHi: '"Kya ye row exist karti hai" check ko baad ke insert-or-update decision se do alag statements mein split karna beech mein ek waqt ki khiड़ki chhoड़ता hai jiske dauран ek doosra concurrent transaction act kar sakta hai. `INSERT ... ON CONFLICT` poore check-and-resolve logic ko ek single atomic statement ka hissa banакर ye window band karta hai. Us statement ke `DO UPDATE` clause ke andar, `EXCLUDED` specifically us row ko refer karta hai jo insert hoti agar conflict na hota, jabki bare table name reference us row ko refer karta hai jo table mein pehle se maujood thi.',
      },
      {
        q: 'What must ORDER BY look like when using DISTINCT ON, and what does DISTINCT ON accomplish that plain DISTINCT does not?',
        qHi: '`DISTINCT ON` istemal karte waqt `ORDER BY` kaisa dikhна chahiye, aur `DISTINCT ON` kya paurа karta hai jo plain `DISTINCT` nahi karta?',
        a: 'DISTINCT ON groups rows by the column or columns listed in its parentheses and keeps exactly one row from each group, and it relies on the ORDER BY clause both to define that grouping and to decide, within each group, which specific row is the one kept. Because of that reliance, PostgreSQL requires ORDER BY to begin with the exact same expressions given to DISTINCT ON, in the same order, before any additional columns that serve as a tiebreaker; leaving those columns out of the start of ORDER BY produces an outright error, since PostgreSQL would otherwise have no well-defined way to know which grouping the requested sort is meant to respect. This is meaningfully different from plain DISTINCT, which only removes fully duplicate rows across every selected column and has no concept of "one row per group chosen by some other criterion"; DISTINCT ON, by contrast, is specifically the tool for a "top one per group" query, such as the most recent order per customer, expressed directly rather than through a window function like ROW_NUMBER() partitioned by the same grouping column.',
        aHi: '`DISTINCT ON` rows ko apne parentheses mein listed column ya columns se group karta hai aur har group se theek ek row rakhta hai, aur ye `ORDER BY` clause par depend karta hai us grouping ko define karne ke liye aur har group ke andar decide karne ke liye ki kaunsi specific row rakhi jaati hai. Us reliance ki wajah se, PostgreSQL ko `ORDER BY` ko theek wahi expressions se shuru karna zaroori hai jo `DISTINCT ON` ko diye gaye the.',
      },
    ],

    exercises: [
      {
        task: 'Table `inv(sku text PRIMARY KEY, qty int)` with one row `(\'A1\', 10)`. Write an `INSERT ... ON CONFLICT (sku) DO UPDATE` that adds 5 to the existing quantity using `EXCLUDED`, with a `RETURNING` clause confirming the new total.',
        taskHi: 'Table `inv(sku, qty)` ek row `(\'A1\', 10)` ke saath. Ek `INSERT ... ON CONFLICT (sku) DO UPDATE` likho jo `EXCLUDED` istemal karke existing quantity mein 5 jodta hai, ek `RETURNING` clause ke saath jo naya total confirm karta hai.',
        hint: '`ON CONFLICT (sku) DO UPDATE SET qty = inv.qty + EXCLUDED.qty RETURNING sku, qty` — `inv.qty` is the existing value, `EXCLUDED.qty` is the new incoming value from this `INSERT`.',
        hintHi: '`ON CONFLICT (sku) DO UPDATE SET qty = inv.qty + EXCLUDED.qty RETURNING sku, qty` — `inv.qty` existing value hai, `EXCLUDED.qty` is `INSERT` se naya incoming value hai.',
      },
      {
        task: 'Table `orders(id int PRIMARY KEY, cust_id int, amt int, placed_at int)` with several orders per customer. Write a `DISTINCT ON` query returning each customer\'s single most recent order (by `placed_at`).',
        taskHi: 'Table `orders(id, cust_id, amt, placed_at)` prati customer kई orders ke saath. Ek `DISTINCT ON` query likho jo har customer ka ekmatra sabse recent order (`placed_at` se) lautaती hai.',
        hint: '`SELECT DISTINCT ON (cust_id) * FROM orders ORDER BY cust_id, placed_at DESC` — `ORDER BY` must start with `cust_id` (matching `DISTINCT ON`), then `placed_at DESC` picks the most recent row within each group.',
        hintHi: '`SELECT DISTINCT ON (cust_id) * FROM orders ORDER BY cust_id, placed_at DESC` — `ORDER BY` ko `cust_id` se shuru hona chahiye, phir `placed_at DESC` har group ke andar sabse recent row chunta hai.',
      },
      {
        task: 'Tables `target(id int PRIMARY KEY, val int)` and `source(id int PRIMARY KEY, val int)` with some overlapping and some new `id` values. Write a `MERGE` that updates `target`\'s `val` where `id` matches, and inserts new rows for `id`s only present in `source`.',
        taskHi: 'Tables `target(id, val)` aur `source(id, val)` kuch overlapping aur kuch naye `id` values ke saath. Ek `MERGE` likho jo `target` ka `val` update karta hai jahaan `id` match karta hai, aur un `id`s ke liye naye rows insert karta hai jo sirf `source` mein hain.',
        hint: '`MERGE INTO target t USING source s ON t.id = s.id WHEN MATCHED THEN UPDATE SET val = s.val WHEN NOT MATCHED THEN INSERT (id, val) VALUES (s.id, s.val)`.',
        hintHi: '`MERGE INTO target t USING source s ON t.id = s.id WHEN MATCHED THEN UPDATE SET val = s.val WHEN NOT MATCHED THEN INSERT (id, val) VALUES (s.id, s.val)`.',
      },
    ],

    keyTakeaways: [
      '`INSERT ... ON CONFLICT (col) DO UPDATE SET ...` solves the upsert problem ATOMICALLY — no check-then-write race condition (Module 9). Inside `DO UPDATE`, `EXCLUDED` = the row that WOULD have been inserted (new values); the bare table name = the EXISTING row already stored. `ON CONFLICT (col) DO NOTHING` silently skips the insert on a conflict instead.',
      '`RETURNING` hands back the actual affected row data from ANY `INSERT`/`UPDATE`/`DELETE` (not just data-modifying CTEs, Module 5) — avoids a wasteful, potentially racy separate `SELECT` right after the write.',
      '`DISTINCT ON (col)` keeps exactly ONE row per distinct value of `col` — `ORDER BY` decides WHICH row survives, and MUST start with the same column(s) as `DISTINCT ON` before any tiebreaker column. A PostgreSQL-specific, often more readable alternative to `ROW_NUMBER() OVER (PARTITION BY ... ) = 1` (Module 6) for the "top-1-per-group" case specifically.',
      '`MERGE` (PG15+) reconciles a WHOLE target table against a WHOLE source (table or query) in ONE statement: `WHEN MATCHED` (update/delete), `WHEN NOT MATCHED` (insert), `WHEN NOT MATCHED BY SOURCE` (target-only rows, typically deleted). Generalizes `ON CONFLICT`\'s single-row insert-or-update to a full insert+update+delete reconciliation pass — the natural tool for syncing against an external feed.',
    ],
    keyTakeawaysHi: [
      '`INSERT ... ON CONFLICT (col) DO UPDATE SET ...` upsert problem ko ATOMICALLY solve karta hai — koi check-then-write race condition nahi (Module 9). `DO UPDATE` ke andar, `EXCLUDED` = wo row jo insert HOTI (naye values); bare table name = wo EXISTING row jo pehle se stored hai.',
      '`RETURNING` KISĪ BHĪ `INSERT`/`UPDATE`/`DELETE` se actual affected row data wapas deta hai — write ke turant baad ek wasteful, potentially racy alag `SELECT` se bachта hai.',
      '`DISTINCT ON (col)` `col` ki har distinct value ke liye theek EK row rakhta hai — `ORDER BY` decide karta hai KAUNSI row bachती hai, aur kisi bhi tiebreaker column se pehle `DISTINCT ON` jaise column(s) se SHURU hona chahiye.',
      '`MERGE` (PG15+) ek POORE target table ko ek POORE source ke against EK statement mein reconcile karta hai: `WHEN MATCHED`, `WHEN NOT MATCHED`, `WHEN NOT MATCHED BY SOURCE`. Ek external feed ke against sync karne ke liye natural tool.',
    ],
  },

  {
    slug: 'sql-full-text-search',
    title: 'Full-Text Search',
    titleHi: 'Full-Text Search',
    description: 'A LIKE pattern only finds exact substrings; genuine text search needs to understand words, ignore case, tolerate word forms, and rank results by relevance. PostgreSQL builds this in: tsvector/tsquery, the @@ match operator, ts_rank, and a GIN index to make it fast at scale.',
    descriptionHi: 'Ek `LIKE` pattern sirf exact substrings dhoondта hai; genuine text search ko words samajhna hai, case ignore karna hai, word forms tolerate karna hai, aur results ko relevance se rank karna hai. PostgreSQL ise built-in deta hai: `tsvector`/`tsquery`, `@@` match operator, `ts_rank`, aur scale par fast banane ke liye ek GIN index.',
    difficulty: 'HARD',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A book\'s back-of-the-book index versus flipping through every page looking for a word.** Searching a long book for every mention of "database" by reading page after page, character by character, is exactly what a LIKE \'%database%\' pattern does — it works, but it is a brute-force scan with no understanding that "Database" and "database" and "databases" are all the same concept. A proper back-of-the-book index is built differently: someone has already gone through, identified every meaningful word (skipping "the," "a," "of"), reduced each to a base form so "running" and "runs" both point to "run," and recorded every page each one appears on — and, crucially, a good index tells you not just where a word appears, but roughly how central it is to that page, so a page whose title is "Database Design" ranks above one that mentions "database" once in passing. That is what \`tsvector\` builds and \`tsquery\` searches: a normalized, pre-processed representation of the meaningful words in a document, matched with \`@@\` and ranked with \`ts_rank\`, and, like the book\'s printed index, it is built once ahead of time (or maintained by a GIN index) rather than re-scanned from scratch on every single search.',
      hi: '**Ek book ke back-of-the-book index versus har page ko flip karके ek word dhoondна.** Ek lambी book mein "database" ke har mention ko page-after-page, character-by-character padhkar dhoondна theek wahi hai jo ek `LIKE \'%database%\'` pattern karta hai — ye kaam karta hai, par ye ek brute-force scan hai jismein koi samajh nahi ki "Database" aur "database" aur "databases" sab ek hi concept hain. Ek proper back-of-the-book index alag tarike se bana hai: kisī ne pehle se har meaningful word identify kiya hai, har ek ko ek base form tak reduce kiya hai to "running" aur "runs" dono "run" ki taraf point karте hain, aur ye record kiya hai ki har ek kaunse page par aata hai — aur, critically, ek achhа index sirf ye nahi bataता ki ek word kahaan aata hai, balki roughly ye bhi ki ye us page ke liye кितna central hai. Yahi hai jo \`tsvector\` banata hai aur \`tsquery\` search karta hai.',
    },

    simple: `**\`to_tsvector\` normalizes a document into searchable "lexemes"; \`@@\` matches against a \`tsquery\`**

\`\`\`sql
CREATE TABLE articles (id int PRIMARY KEY, body text);
INSERT INTO articles VALUES
  (1, 'PostgreSQL is a powerful open source database'),
  (2, 'MySQL is also a popular database');

SELECT id FROM articles
WHERE to_tsvector('english', body) @@ to_tsquery('english', 'postgresql');
\`\`\`
\`\`\`
 id
----
 1
(1 row)
-- matches regardless of case, and would ALSO match "PostgreSQL's" or "Postgresqling" --
-- to_tsvector reduces words to a normalized base form ("stemming")
\`\`\`

**\`ts_rank\` scores how relevant a match is -- for ordering results, not just filtering**

\`\`\`sql
SELECT id, ts_rank(to_tsvector('english', body), to_tsquery('english', 'database')) AS rank
FROM articles ORDER BY rank DESC;
\`\`\`
\`\`\`
 id | rank
----+------------
  1 | 0.06079271
  2 | 0.06079271
(2 rows)
-- both mention "database" once -- equal rank here; a longer/denser match scores higher
\`\`\`

**A GIN index on \`to_tsvector(...)\` makes \`@@\` fast at scale**

\`\`\`sql
CREATE INDEX ON articles USING GIN (to_tsvector('english', body));
\`\`\`
\`\`\`
Bitmap Heap Scan on articles
  Recheck Cond: (to_tsvector('english'::regconfig, body) @@ '''postgresql'''::tsquery)
  ->  Bitmap Index Scan on articles_to_tsvector_idx
        Index Cond: (to_tsvector('english'::regconfig, body) @@ '''postgresql'''::tsquery)
-- an expression index (Module 10, Lesson 3) -- the QUERY must use the SAME
-- to_tsvector('english', body) expression for the index to apply
\`\`\`

**\`plainto_tsquery\`/\`websearch_to_tsquery\` parse ordinary user search text into a \`tsquery\` for you**`,

    simpleHi: `**\`to_tsvector\` ek document ko searchable "lexemes" mein normalize karta hai; \`@@\` ek \`tsquery\` ke against match karta hai**

\`\`\`sql
CREATE TABLE articles (id int PRIMARY KEY, body text);
INSERT INTO articles VALUES
  (1, 'PostgreSQL is a powerful open source database'),
  (2, 'MySQL is also a popular database');

SELECT id FROM articles
WHERE to_tsvector('english', body) @@ to_tsquery('english', 'postgresql');
\`\`\`
\`\`\`
 id
----
 1
(1 row)
-- case se regardless match karta hai, aur "PostgreSQL's" ya "Postgresqling" bhi
-- match karta -- to_tsvector words ko ek normalized base form tak reduce karta hai
\`\`\`

**\`ts_rank\` score karta hai ek match кितna relevant hai -- results ko order karne ke liye**

\`\`\`sql
SELECT id, ts_rank(to_tsvector('english', body), to_tsquery('english', 'database')) AS rank
FROM articles ORDER BY rank DESC;
\`\`\`
\`\`\`
 id | rank
----+------------
  1 | 0.06079271
  2 | 0.06079271
(2 rows)
-- dono "database" ek baar mention karte hain -- yahaan equal rank
\`\`\`

**\`to_tsvector(...)\` par ek GIN index scale par \`@@\` ko fast banata hai**

\`\`\`sql
CREATE INDEX ON articles USING GIN (to_tsvector('english', body));
\`\`\`
\`\`\`
Bitmap Heap Scan on articles
  Recheck Cond: (to_tsvector('english'::regconfig, body) @@ '''postgresql'''::tsquery)
  ->  Bitmap Index Scan on articles_to_tsvector_idx
        Index Cond: (to_tsvector('english'::regconfig, body) @@ '''postgresql'''::tsquery)
-- ek expression index (Module 10, Lesson 3) -- QUERY ko SAME
-- to_tsvector('english', body) expression istemal karna hoga index apply hone ke liye
\`\`\`

**\`plainto_tsquery\`/\`websearch_to_tsquery\` ordinary user search text ko aapke liye ek \`tsquery\` mein parse karte hain**`,

    content: `## Why \`LIKE\` isn't real search

\`LIKE '%database%'\` finds an exact literal substring — it has no concept of word boundaries, no tolerance for "database" versus "databases" versus "Database," and no way to rank one match as more relevant than another. Genuine text search needs a normalized representation of a document's meaningful words, and a way to score how well a document matches a query, not merely whether it does.

## \`tsvector\`: a normalized, searchable representation of a document

\`\`\`sql
SELECT to_tsvector('english', 'PostgreSQL is a powerful open source database');
\`\`\`

\`to_tsvector\` processes a text value into a **tsvector**: it lowercases everything, discards common "stopwords" (\`is\`, \`a\`, \`the\`) that carry no search-relevant meaning, and reduces remaining words to a normalized base form (**stemming**) so that "running," "runs," and "run" all become the same searchable unit. The \`'english'\` argument names the text-search configuration — the specific set of stemming and stopword rules to apply, since what counts as a meaningless stopword or how a word stems differs by language.

## \`tsquery\` and the \`@@\` match operator

\`\`\`sql
SELECT id FROM articles
WHERE to_tsvector('english', body) @@ to_tsquery('english', 'postgresql');
\`\`\`

\`to_tsquery\` parses a search expression the same normalized way, and \`@@\` tests whether a \`tsvector\` matches a \`tsquery\` — a genuine linguistic match, not a substring scan, so this query also matches text containing "PostgreSQL's" or other word forms sharing the same stem. \`to_tsquery\` also supports boolean operators inside the query string itself (\`'postgresql & performance'\`, \`'postgresql | mysql'\`, \`'database & !mysql'\`), for combining search terms.

For ordinary user-typed search text, rather than a hand-built boolean expression, \`plainto_tsquery\` (treats the input as plain words, ANDed together) or \`websearch_to_tsquery\` (understands simple web-search-style syntax like quoted phrases and \`-excluded\` terms) parse a raw search string into a \`tsquery\` without requiring the caller to construct the boolean syntax themselves.

## \`ts_rank\`: scoring relevance

\`\`\`sql
SELECT id, ts_rank(to_tsvector('english', body), to_tsquery('english', 'database')) AS rank
FROM articles ORDER BY rank DESC;
\`\`\`

\`@@\` only tells you whether a document matches; \`ts_rank\` scores **how well** it matches, based on factors like how often the search terms appear and how they are distributed through the document, letting a search feature order results by relevance rather than returning matches in arbitrary order. A short article whose entire content centers on the search term ranks above a long article that mentions it once in passing.

## Indexing full-text search with GIN

\`\`\`sql
CREATE INDEX ON articles USING GIN (to_tsvector('english', body));
EXPLAIN (COSTS OFF) SELECT * FROM articles
  WHERE to_tsvector('english', body) @@ to_tsquery('english', 'postgresql');
\`\`\`
\`\`\`
Bitmap Heap Scan on articles
  Recheck Cond: (to_tsvector('english'::regconfig, body) @@ '''postgresql'''::tsquery)
  ->  Bitmap Index Scan on articles_to_tsvector_idx
        Index Cond: (to_tsvector('english'::regconfig, body) @@ '''postgresql'''::tsquery)
\`\`\`

This is an **expression index** (Module 10, Lesson 3): the index is built over the *result* of \`to_tsvector('english', body)\`, not over \`body\` itself, and a query only uses it when its own \`WHERE\` clause applies that identical expression. A GIN index here works exactly the way it does for arrays and JSONB (Module 10, Lesson 4; this module's Lessons 1-3): a \`tsvector\` is, structurally, a set of lexemes, and \`@@\` is fundamentally a "does this set contain these terms" question — GIN's whole reason for existing.

For a table whose text search needs are heavy and ongoing, many schemas add a **generated \`tsvector\` column** (\`body_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', body)) STORED\`, Module 8's generated columns) with a plain GIN index on that stored column, avoiding recomputing \`to_tsvector\` on every single query.`,

    contentHi: `## \`LIKE\` real search kyun nahi hai

\`LIKE '%database%'\` ek exact literal substring dhoondта hai — iske paas word boundaries ka koi concept nahi, "database" versus "databases" versus "Database" ke liye koi tolerance nahi. Genuine text search ko document ke meaningful words ka ek normalized representation chahiye, aur ye score karne ka ek tarika chahiye ki ek document ek query se кितна achhi tarah match karta hai.

## \`tsvector\`: ek document ka ek normalized, searchable representation

\`\`\`sql
SELECT to_tsvector('english', 'PostgreSQL is a powerful open source database');
\`\`\`

\`to_tsvector\` ek text value ko ek **tsvector** mein process karta hai: ye sab kuch lowercase karta hai, common "stopwords" (\`is\`, \`a\`, \`the\`) discard karta hai, aur baaki words ko ek normalized base form tak reduce karta hai (**stemming**).

## \`tsquery\` aur \`@@\` match operator

\`\`\`sql
SELECT id FROM articles
WHERE to_tsvector('english', body) @@ to_tsquery('english', 'postgresql');
\`\`\`

\`to_tsquery\` ek search expression ko usī normalized tarike se parse karta hai, aur \`@@\` test karta hai ki ek \`tsvector\` ek \`tsquery\` se match karta hai — ek genuine linguistic match, substring scan nahi.

Ordinary user-typed search text ke liye, \`plainto_tsquery\` ya \`websearch_to_tsquery\` ek raw search string ko ek \`tsquery\` mein parse karte hain caller ko boolean syntax khud construct karne ki zaroorat ke bina.

## \`ts_rank\`: relevance score karna

\`\`\`sql
SELECT id, ts_rank(to_tsvector('english', body), to_tsquery('english', 'database')) AS rank
FROM articles ORDER BY rank DESC;
\`\`\`

\`@@\` sirf bataता hai ki ek document match karta hai ya nahi; \`ts_rank\` score karta hai ye **кितna achhi tarah** match karta hai.

## GIN se full-text search index karna

\`\`\`sql
CREATE INDEX ON articles USING GIN (to_tsvector('english', body));
\`\`\`
\`\`\`
Bitmap Heap Scan on articles
  Recheck Cond: (to_tsvector('english'::regconfig, body) @@ '''postgresql'''::tsquery)
  ->  Bitmap Index Scan on articles_to_tsvector_idx
        Index Cond: (to_tsvector('english'::regconfig, body) @@ '''postgresql'''::tsquery)
\`\`\`

Ye ek **expression index** hai (Module 10, Lesson 3): index \`to_tsvector('english', body)\` ke *result* par bana hai, \`body\` khud par nahi.

Ek table ke liye jiski text search zaroorat heavy aur ongoing hai, kई schemas ek **generated \`tsvector\` column** add karте hain us stored column par ek plain GIN index ke saath.`,

    examples: [
      {
        title: 'to_tsvector/to_tsquery match regardless of case, via @@',
        titleHi: 'to_tsvector/to_tsquery case se regardless match karte hain, @@ ke through',
        code: `CREATE TABLE articles (id int PRIMARY KEY, body text);
INSERT INTO articles VALUES (1, 'PostgreSQL is a powerful open source database'), (2, 'MySQL is also a popular database');
SELECT id FROM articles WHERE to_tsvector('english', body) @@ to_tsquery('english', 'postgresql');`,
        output: ` id
----
 1
(1 row)`,
        explain: '`to_tsvector(\'english\', body) @@ to_tsquery(\'english\', \'postgresql\')` finds article 1, whose text mentions "PostgreSQL" — the match is case-insensitive and based on normalized lexemes, not a literal substring scan, so it would equally match "postgresql" in any capitalization or a closely related word form.',
        explainHi: '`to_tsvector(\'english\', body) @@ to_tsquery(\'english\', \'postgresql\')` article 1 dhoondта hai, jiska text "PostgreSQL" mention karta hai — match case-insensitive hai aur normalized lexemes par based hai, ek literal substring scan nahi, to ye kisī bhi capitalization mein "postgresql" ya ek closely related word form ko barабar match karегa.',
      },
      {
        title: 'ts_rank scores relevance for ordering search results',
        titleHi: 'ts_rank search results ko order karne ke liye relevance score karta hai',
        code: `CREATE TABLE articles (id int PRIMARY KEY, body text);
INSERT INTO articles VALUES (1, 'PostgreSQL is a powerful open source database'), (2, 'MySQL is also a popular database');
SELECT id, ts_rank(to_tsvector('english', body), to_tsquery('english', 'database')) AS rank FROM articles ORDER BY rank DESC;`,
        output: ` id | rank
----+------------
 1  | 0.06079271
 2  | 0.06079271
(2 rows)`,
        explain: 'Both articles mention "database" exactly once in a similarly short piece of text, so `ts_rank` assigns them the identical score, `0.06079271` — a longer or denser match (the term appearing more often, or more centrally) would score higher, which is exactly what lets `ts_rank` order results by relevance rather than treating every match as equally good.',
        explainHi: 'Dono articles "database" ko theek ek baar ek similarly short text mein mention karte hain, to `ts_rank` unhe identical score deta hai, `0.06079271` — ek lambа ya denser match (term zyada baar aana, ya zyada centrally) zyada score deта, jo theek wo hai jo `ts_rank` ko results ko relevance se order karne deta hai.',
      },
      {
        title: 'A GIN expression index on to_tsvector(...) serves a full-text search at scale',
        titleHi: 'to_tsvector(...) par ek GIN expression index scale par ek full-text search serve karta hai',
        code: `CREATE TABLE articles (id int PRIMARY KEY, body text);
INSERT INTO articles SELECT g, 'sample article number ' || g || ' about ' || (CASE WHEN g % 500 = 0 THEN 'postgresql' ELSE 'mysql' END) || ' database systems' FROM generate_series(1, 20000) g;
CREATE INDEX ON articles USING GIN (to_tsvector('english', body));
ANALYZE articles;
EXPLAIN (COSTS OFF) SELECT * FROM articles WHERE to_tsvector('english', body) @@ to_tsquery('english', 'postgresql');`,
        output: ` QUERY PLAN
--------------------------------------------------------------------------------------------
 Bitmap Heap Scan on articles
   Recheck Cond: (to_tsvector('english'::regconfig, body) @@ '''postgresql'''::tsquery)
   ->  Bitmap Index Scan on articles_to_tsvector_idx
         Index Cond: (to_tsvector('english'::regconfig, body) @@ '''postgresql'''::tsquery)
(4 rows)`,
        explain: 'With 20,000 articles and only 1 in 500 (40 rows) mentioning "postgresql", that search is selective enough for the GIN expression index over `to_tsvector(\'english\', body)` to help: `Bitmap Index Scan on articles_to_tsvector_idx` finds the matching entries first, then `Bitmap Heap Scan on articles` fetches only those rows.',
        explainHi: '20,000 articles ke saath aur sirf 500 mein se 1 (40 rows) "postgresql" mention karti hain, wo search `to_tsvector(\'english\', body)` par bane GIN expression index ke madad ke liye kaafi selective hai: `Bitmap Index Scan on articles_to_tsvector_idx` pehle matching entries dhoondта hai, phir `Bitmap Heap Scan on articles` sirf un rows ko fetch karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- using LIKE for what is actually a text-search problem
SELECT * FROM articles WHERE body LIKE '%database%';
-- misses "Database" (case) and "databases" (plural) unless you add even MORE
-- pattern variations by hand -- and can never rank results by relevance`,
        right: `SELECT * FROM articles WHERE to_tsvector('english', body) @@ to_tsquery('english', 'database');
-- matches case-insensitively AND across word forms (stemming), and ts_rank
-- can score how relevant each match is`,
        why: 'LIKE performs a literal, case-sensitive substring match with no understanding of language at all, which means it requires the caller to anticipate every capitalization and word-form variation by hand, using ILIKE for case-insensitivity and separate patterns for singular versus plural or other word forms, and even then it has no concept of ranking one match as more relevant than another, since matching is purely binary. Full-text search, through to_tsvector and to_tsquery, normalizes both the document and the query the same way, lowercasing text and reducing words to a common stem, so a single query naturally matches across capitalization and closely related word forms without the caller needing to enumerate variations, and ts_rank provides a genuine relevance score on top of that match, which LIKE has no equivalent for at all. Reaching for LIKE when the actual requirement is "search this text for a concept, ranked by relevance" produces a feature that technically returns some matches but silently misses others and cannot order them meaningfully.',
        whyHi: '`LIKE` ek literal, case-sensitive substring match perform karta hai bhaasha ki koi samajh ke bina, jiska matlab hai caller ko har capitalization aur word-form variation ko haath se anticipate karna paता hai. Full-text search, `to_tsvector` aur `to_tsquery` ke through, document aur query dono ko usī tarike se normalize karta hai, to ek single query naturally capitalization aur closely related word forms ke across match karti hai bina caller ko variations enumerate karne ki zaroorat ke, aur `ts_rank` us match ke upar ek genuine relevance score deता hai.',
      },
      {
        wrong: `-- creating the GIN index on body directly, then querying with to_tsvector(body)
CREATE INDEX ON articles USING GIN (body);   -- ERROR: no GIN operator class for "text"
-- (GIN needs a tsvector, jsonb, or array -- not a plain text column)`,
        right: `CREATE INDEX ON articles USING GIN (to_tsvector('english', body));
-- index the EXPRESSION's result (a tsvector), not the raw text column --
-- and the query must use the SAME expression for the index to apply (Module 10, Lesson 3)`,
        why: 'A plain text column has no default GIN operator class, because GIN is built around collection-shaped values, arrays, JSONB, and tsvectors, none of which a bare text column is; the value has to first be transformed into one of those shapes before GIN has any structure to index. to_tsvector(\'english\', body) performs exactly that transformation, producing a tsvector, which is what a GIN index can actually be built over, which is why the index must be created on the expression\'s result, an expression index in the sense Module 10 covered, rather than on the raw body column directly. A direct consequence of this, following the same rule as any other expression index, is that a query only benefits from this index when its own WHERE clause applies that identical to_tsvector(\'english\', body) expression; querying with a plain body LIKE ... condition, or even a differently configured to_tsvector call, will not match this index at all.',
        whyHi: 'Ek plain text column ka koi default GIN operator class nahi hai, kyunki GIN collection-shaped values ke around bana hai — arrays, JSONB, aur tsvectors, jinme se koi bhi ek bare text column nahi hai. `to_tsvector(\'english\', body)` theek wo transformation perform karta hai, ek `tsvector` produce karte hue, jo hai jispar ek GIN index asal mein bana ja sakta hai.',
      },
      {
        wrong: `-- recomputing to_tsvector(body) fresh on every single search query against a
-- large, heavily-searched table, without ever storing it
SELECT * FROM articles WHERE to_tsvector('english', body) @@ to_tsquery('english', 'postgresql');
-- works, and the GIN expression index still helps -- but to_tsvector still has
-- to run against EVERY MATCHING row's body at query time`,
        right: `-- for heavy, ongoing search traffic, store the tsvector as a generated column
-- (Module 8) and index THAT directly:
ALTER TABLE articles ADD COLUMN body_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', body)) STORED;
CREATE INDEX ON articles USING GIN (body_tsv);
SELECT * FROM articles WHERE body_tsv @@ to_tsquery('english', 'postgresql');`,
        why: 'An expression index on to_tsvector(\'english\', body) does let the GIN index locate matching rows efficiently, but PostgreSQL still has to actually compute to_tsvector against each matching row\'s body text to verify the match and to serve any ranking computation, which is real, repeated work on every query even with the index in place. A generated tsvector column, computed automatically and stored whenever the underlying text column changes (Module 8\'s generated columns), does that normalization work exactly once, at write time, rather than recomputing it on every read; indexing that stored column directly, rather than an expression over the raw text, is the standard pattern for a table with heavy, ongoing search traffic, trading a small amount of extra storage and write-time computation for meaningfully less repeated work on the far more frequent read path.',
        whyHi: '`to_tsvector(\'english\', body)` par ek expression index GIN index ko matching rows efficiently locate karne deता hai, par PostgreSQL ko phir bhi har matching row ke `body` text ke against `to_tsvector` asal mein compute karna paता hai match verify karne ke liye. Ek generated `tsvector` column, jo automatically compute aur store hoती hai jab bhi underlying text column badalता hai, ye normalization kaam theek ek baar karta hai, write time par, har read par recompute karne ke bजаय.',
      },
    ],

    realWorld: [
      {
        en: '**A documentation site\'s search bar built entirely on `to_tsvector`/`to_tsquery`/`ts_rank` against a GIN-indexed generated column**, avoiding the operational cost of a separate search engine like Elasticsearch for a moderate-scale corpus.',
        hi: '**Ek documentation site ka search bar poori tarah `to_tsvector`/`to_tsquery`/`ts_rank` par bana**, ek moderate-scale corpus ke liye Elasticsearch jaisे ek alag search engine ki operational cost se bachte hue.',
      },
      {
        en: '**`websearch_to_tsquery` powering a public-facing search box** so users can type natural queries with quoted phrases and `-excluded` terms without the application hand-parsing that syntax itself.',
        hi: '**`websearch_to_tsquery` ek public-facing search box ko power karta hai** taaki users natural queries type kar sakein.',
      },
      {
        en: '**A support-ticket search feature ranking results by `ts_rank`** so a ticket whose title matches the search term outranks one that only mentions it once deep in a long thread.',
        hi: '**Ek support-ticket search feature jo results ko `ts_rank` se rank karta hai** taaki ek ticket jiska title search term se match karta hai us se aage ho jo ise sirf ek baar mention karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is to_tsvector/to_tsquery/@@ a better tool for text search than LIKE, and what does GIN-indexing it require?',
        qHi: 'Text search ke liye `to_tsvector`/`to_tsquery`/`@@` `LIKE` se behtar tool kyun hai, aur ise GIN-index karne ke liye kya chahiye?',
        a: 'LIKE performs a purely literal, case-sensitive substring match with no linguistic understanding whatsoever, so matching different capitalizations or related word forms like singular versus plural requires the caller to construct multiple patterns by hand, and even then there is no way to express "how relevant" a match is, since a LIKE condition is simply true or false. to_tsvector normalizes a document by lowercasing it, discarding common stopwords that carry no search-relevant meaning, and reducing remaining words to a shared base form through stemming, and to_tsquery normalizes a search expression the same way, so the @@ match operator between them is a genuine linguistic match that naturally handles capitalization and closely related word forms without the caller enumerating variations, and ts_rank on top of that provides an actual relevance score for ordering results. Indexing this with GIN requires building the index over the result of the to_tsvector expression rather than over the raw text column directly, since GIN has no operator class for plain text and needs a tsvector, array, or JSONB value to index against; this makes it an expression index in the same sense Module 10 covered, meaning a query only benefits from the index when it applies that identical to_tsvector expression itself, and for tables with heavy search traffic, storing the tsvector as a generated column and indexing that directly avoids recomputing the normalization on every single query.',
        aHi: '`LIKE` ek purी tarah literal, case-sensitive substring match perform karta hai koi linguistic samajh ke bina, to alag capitalizations ya related word forms match karne ke liye caller ko haath se multiple patterns construct karne paते hain. `to_tsvector` ek document ko lowercase karके, common stopwords discard karके, aur baaki words ko stemming ke through ek shared base form tak reduce karके normalize karta hai. Ise GIN se index karne ke liye `to_tsvector` expression ke result par index banана paता hai, raw text column par seedhe nahi, kyunki GIN ke paas plain text ke liye koi operator class nahi hai.',
      },
      {
        q: 'What is the practical difference between an expression index on to_tsvector(body) and a generated tsvector column with a GIN index on it?',
        qHi: '`to_tsvector(body)` par ek expression index aur ek generated `tsvector` column par ek GIN index ke beech practical antar kya hai?',
        a: 'Both approaches let a GIN index accelerate the same full-text search query, and from a pure query-planning perspective a query correctly using either will benefit from an index, but they differ in when the actual tsvector normalization work happens. An expression index still requires PostgreSQL to compute to_tsvector against a matching row\'s current text at query time in order to verify the match, since the index only helps locate candidate rows, not eliminate that computation entirely, which means every search still pays that normalization cost repeatedly. A generated tsvector column, by contrast, computes and stores that normalized representation exactly once, whenever the underlying text column is written, and the GIN index is then built directly on that already-computed, stored value, so a search reads the precomputed tsvector rather than recomputing it fresh. For a table with light or infrequent search traffic, the expression index is simpler and avoids the extra stored column entirely; for a table under heavy, continuous search load, moving that computation to write time via a generated column is the standard optimization, trading a small amount of extra storage and write-time cost for meaningfully cheaper reads.',
        aHi: 'Dono approaches ek GIN index ko wahi full-text search query accelerate karne deте hain, par ye is baat mein alag hain ki actual `tsvector` normalization kaam kab hota hai. Ek expression index ko phir bhi PostgreSQL ko query time par `to_tsvector` compute karna paता hai match verify karne ke liye. Ek generated `tsvector` column, iske viparit, us normalized representation ko theek ek baar compute aur store karta hai, jab bhi underlying text column likhi jaati hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `articles(id int PRIMARY KEY, body text)` with rows including "PostgreSQL is a powerful open source database" and "MySQL is also a popular database". Write a query using `to_tsvector`/`to_tsquery`/`@@` to find articles mentioning "postgresql".',
        taskHi: 'Table `articles(id, body)` rows ke saath "PostgreSQL is a powerful open source database" aur "MySQL is also a popular database" shamil karте hue. `to_tsvector`/`to_tsquery`/`@@` istemal karте hue ek query likho jo "postgresql" mention karti articles dhoondti hai.',
        hint: '`WHERE to_tsvector(\'english\', body) @@ to_tsquery(\'english\', \'postgresql\')` — matches case-insensitively, unlike a bare `LIKE`.',
        hintHi: '`WHERE to_tsvector(\'english\', body) @@ to_tsquery(\'english\', \'postgresql\')` — case-insensitively match karta hai, ek bare `LIKE` ke uलт.',
      },
      {
        task: 'Same table. Write a query using `ts_rank` to order both articles by how relevant they are to the search term "database".',
        taskHi: 'Wahi table. `ts_rank` istemal karte hue ek query likho jo dono articles ko order karti hai ye ki wo "database" search term se кितне relevant hain.',
        hint: '`SELECT id, ts_rank(to_tsvector(\'english\', body), to_tsquery(\'english\', \'database\')) AS rank FROM articles ORDER BY rank DESC` — `@@` only tells you whether a match exists; `ts_rank` scores how well.',
        hintHi: '`SELECT id, ts_rank(to_tsvector(\'english\', body), to_tsquery(\'english\', \'database\')) AS rank FROM articles ORDER BY rank DESC` — `@@` sirf bataता hai ki match hai ya nahi; `ts_rank` bataता hai кितna achha.',
      },
      {
        task: 'Table `articles(id int PRIMARY KEY, body text)` with 20,000 rows, only 1 in 500 mentioning "postgresql" (the rest mention "mysql"). Create a GIN index on `to_tsvector(\'english\', body)`, `ANALYZE`, and confirm a search for "postgresql" uses `Bitmap Index Scan`.',
        taskHi: 'Table `articles(id, body)` 20,000 rows ke saath, sirf 500 mein se 1 "postgresql" mention karti hai. `to_tsvector(\'english\', body)` par ek GIN index banao, `ANALYZE`, aur confirm karo "postgresql" ke liye ek search `Bitmap Index Scan` istemal karti hai.',
        hint: 'A `tsvector` is structurally a set of lexemes, and `@@` is a "does this set contain these terms" question — exactly what GIN accelerates, the same shape as array and JSONB containment (Module 10, Lesson 4).',
        hintHi: 'Ek `tsvector` structurally lexemes ka ek set hai, aur `@@` ek "kya ye set in terms ko contain karta hai" sawaal hai — theek wo jise GIN accelerate karta hai.',
      },
    ],

    keyTakeaways: [
      '`LIKE` is a literal, case-sensitive substring scan with no linguistic understanding and no relevance ranking. `to_tsvector` normalizes a document into a `tsvector`: lowercased, stopwords (`is`/`a`/`the`) discarded, words reduced to a base form (STEMMING, so "running"/"runs"/"run" are all one searchable unit).',
      '`to_tsquery` normalizes a search expression the same way; `@@` tests a genuine linguistic match between a `tsvector` and a `tsquery` (matches across case AND word form) — NOT a substring scan. `to_tsquery` supports boolean operators (`&`/`|`/`!`) directly in the query string; `plainto_tsquery`/`websearch_to_tsquery` parse ordinary user-typed search text into a `tsquery` without hand-building that syntax.',
      '`ts_rank(tsvector, tsquery)` scores HOW WELL a document matches (for ordering by relevance) — `@@` only tells you WHETHER it matches.',
      'A GIN index on `to_tsvector(\'english\', body)` is an EXPRESSION INDEX (Module 10, Lesson 3) — built over the tsvector RESULT, not the raw text column (GIN has no operator class for plain text). The query must use the SAME expression to benefit. A `tsvector` is structurally a set of lexemes — `@@` is a "contains these terms" question, the exact shape GIN accelerates (same as arrays/JSONB, Module 10 Lesson 4 & this module\'s Lessons 1-3).',
      'For heavy, ongoing search traffic: add a GENERATED `tsvector` COLUMN (Module 8) computed once at write time, and GIN-index THAT directly — avoids recomputing `to_tsvector` against every matching row on every single query.',
    ],
    keyTakeawaysHi: [
      '`LIKE` ek literal, case-sensitive substring scan hai koi linguistic samajh ke bina aur koi relevance ranking ke bina. `to_tsvector` ek document ko ek `tsvector` mein normalize karta hai: lowercased, stopwords discarded, words ek base form tak reduce (STEMMING).',
      '`to_tsquery` ek search expression ko usī tarike se normalize karta hai; `@@` ek `tsvector` aur ek `tsquery` ke beech ek genuine linguistic match test karta hai — substring scan NAHI. `plainto_tsquery`/`websearch_to_tsquery` ordinary user-typed search text ko ek `tsquery` mein parse karte hain.',
      '`ts_rank(tsvector, tsquery)` score karta hai ek document кितna achhi tarah match karta hai — `@@` sirf bataता hai ki match hai KYA NAHI.',
      '`to_tsvector(...)` par ek GIN index ek EXPRESSION INDEX hai — tsvector RESULT par bana, raw text column par nahi. Query ko benefit ke liye SAME expression istemal karna hoga.',
      'Heavy, ongoing search traffic ke liye: ek GENERATED `tsvector` COLUMN add karo (Module 8) write time par ek baar compute hoti hai, aur usе seedhe GIN-index karo — har matching row par har single query par `to_tsvector` recompute karne se bachта hai.',
    ],
  },

  {
    slug: 'sql-materialized-views-extensions-and-tooling',
    title: 'Materialized Views, Extensions & Operational Tooling',
    titleHi: 'Materialized Views, Extensions Aur Operational Tooling',
    description: 'A materialized view caches an expensive query\'s result physically, refreshed on demand rather than recomputed on every read. Extensions add whole feature sets to PostgreSQL beyond core SQL, and a short survey of LISTEN/NOTIFY and psql closes out the module\'s tour of power features.',
    descriptionHi: 'Ek materialized view ek mehange query ke result ko physically cache karta hai, on-demand refresh hote hue har read par recompute hone ke bजаय. Extensions core SQL se pare PostgreSQL mein poore feature sets add karте hain, aur LISTEN/NOTIFY aur psql ka ek chhota survey module ke power features tour ko band karta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 6,

    analogy: {
      en: '**A printed monthly sales report on the wall, versus recalculating it from the ledgers every time someone glances at it.** A regular view (Module 5\'s territory) is like a formula taped to the wall telling you how to compute this month\'s total from the ledgers — accurate to the second, but you re-do the whole calculation from scratch every single time you look. A materialized view is instead an actual printed report pinned to the wall: fast to glance at, since the numbers are already sitting right there, but it only reflects the ledgers as they stood at the moment it was printed — a fresh sale a moment later changes nothing on the wall until someone deliberately reprints the report (\`REFRESH\`). An extension, meanwhile, is like bringing a specialized department\'s toolkit into the same building rather than reinventing it from scratch: a cryptography desk\'s tools (\`pgcrypto\`), a fuzzy-matching librarian\'s techniques (\`pg_trgm\`), each one an optional, self-contained capability the building can install once it actually needs it, rather than something every filing cabinet carries by default.',
      hi: '**Deewaar par ek printed monthly sales report, versus jab bhi koi ise dekhता hai ledgers se ise dobara calculate karна.** Ek regular view (Module 5 ka territory) deewaar par taped ek formula jaisа hai jo aapко bataता hai ki ledgers se is mahine ka total kaise compute karна hai — second-accurate, par aap har baar jab dekhte ho poori calculation scratch se dobara karte ho. Ek materialized view iske bजаय deewaar par pinned ek asal printed report hai: dekhne mein fast, kyunki numbers pehle se wahaan hain, par ye sirf ledgers ko usī roop mein reflect karta hai jaisа wo print hote waqt the — ek fresh sale ek pal baad deewaar par kuch nahi badalti jab tak koi jaan-boojhkar report reprint na kare (\`REFRESH\`). Ek extension, iske beech, ek specialized department ka toolkit usī building mein laane jaisa hai isе scratch se reinvent karne ke bजаय: ek cryptography desk ke tools (\`pgcrypto\`), ek fuzzy-matching librarian ki techniques (\`pg_trgm\`), har ek ek optional, self-contained capability jise building install kar sakti hai jab isе asal mein zaroorat ho.',
    },

    simple: `**A materialized view PHYSICALLY stores a query's result -- it does NOT auto-update**

\`\`\`sql
CREATE TABLE sales (id int PRIMARY KEY, amt int);
INSERT INTO sales VALUES (1, 100), (2, 200);
CREATE MATERIALIZED VIEW sales_summary AS SELECT count(*) AS n, sum(amt) AS total FROM sales;
SELECT * FROM sales_summary;      -- n=2, total=300
INSERT INTO sales VALUES (3, 300);
SELECT * FROM sales_summary;      -- STILL n=2, total=300 -- the underlying table changed, the view didn't
REFRESH MATERIALIZED VIEW sales_summary;
SELECT * FROM sales_summary;      -- NOW n=3, total=600 -- REFRESH recomputes and re-stores it
\`\`\`

**\`REFRESH ... CONCURRENTLY\` (lets reads continue during refresh) needs a UNIQUE index first**

\`\`\`sql
CREATE MATERIALIZED VIEW sales_mv AS SELECT id, amt FROM sales;
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv;
-- ERROR: cannot refresh materialized view "sales_mv" concurrently
--        (no unique index)

CREATE UNIQUE INDEX ON sales_mv (id);
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv;   -- now works
\`\`\`

**Extensions add whole feature sets beyond core SQL** (installed per-database with \`CREATE EXTENSION\`):
\`\`\`
pgcrypto    -- hashing/encryption functions (digest, crypt, pgp_sym_encrypt)
uuid-ossp   -- extra UUID-generation functions (gen_random_uuid() is core since PG13)
pg_trgm     -- trigram-based fuzzy text matching/similarity, + fast ILIKE via GIN/GiST
postgis     -- full geographic/geometric data types, indexes, and functions
pg_stat_statements -- tracks execution stats for EVERY query PostgreSQL has run
\`\`\`

**\`LISTEN\`/\`NOTIFY\`: lightweight pub-sub between database sessions (no message payload persistence)**

**\`psql\` meta-commands for daily operational work:** \`\\d table\` (describe), \`\\timing\` (show query time), \`\\watch N\` (re-run every N seconds)`,

    simpleHi: `**Ek materialized view ek query ka result PHYSICALLY store karta hai -- ye auto-update NAHI hota**

\`\`\`sql
CREATE TABLE sales (id int PRIMARY KEY, amt int);
INSERT INTO sales VALUES (1, 100), (2, 200);
CREATE MATERIALIZED VIEW sales_summary AS SELECT count(*) AS n, sum(amt) AS total FROM sales;
SELECT * FROM sales_summary;      -- n=2, total=300
INSERT INTO sales VALUES (3, 300);
SELECT * FROM sales_summary;      -- ABHI BHI n=2, total=300 -- underlying table badli, view nahi
REFRESH MATERIALIZED VIEW sales_summary;
SELECT * FROM sales_summary;      -- AB n=3, total=600 -- REFRESH recompute aur re-store karta hai
\`\`\`

**\`REFRESH ... CONCURRENTLY\` (refresh ke dauран reads chalte rehne detа hai) ko pehle ek UNIQUE index chahiye**

\`\`\`sql
CREATE MATERIALIZED VIEW sales_mv AS SELECT id, amt FROM sales;
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv;
-- ERROR: cannot refresh materialized view "sales_mv" concurrently
--        (no unique index)

CREATE UNIQUE INDEX ON sales_mv (id);
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv;   -- ab kaam karta hai
\`\`\`

**Extensions core SQL se pare poore feature sets add karте hain** (\`CREATE EXTENSION\` se prati-database install):
\`\`\`
pgcrypto    -- hashing/encryption functions (digest, crypt, pgp_sym_encrypt)
uuid-ossp   -- extra UUID-generation functions (gen_random_uuid() PG13 se core mein hai)
pg_trgm     -- trigram-based fuzzy text matching/similarity, + GIN/GiST se fast ILIKE
postgis     -- pura geographic/geometric data types, indexes, aur functions
pg_stat_statements -- PostgreSQL ne chalaayi HAR query ke liye execution stats track karta hai
\`\`\`

**\`LISTEN\`/\`NOTIFY\`: database sessions ke beech lightweight pub-sub (koi message payload persistence nahi)**

**Daily operational kaam ke liye \`psql\` meta-commands:** \`\\d table\` (describe), \`\\timing\` (query time dikhaो), \`\\watch N\` (har N seconds mein dobara chalao)`,

    content: `## A materialized view: a physically stored snapshot

\`\`\`sql
CREATE TABLE sales (id int PRIMARY KEY, amt int);
INSERT INTO sales VALUES (1, 100), (2, 200);
CREATE MATERIALIZED VIEW sales_summary AS SELECT count(*) AS n, sum(amt) AS total FROM sales;
SELECT * FROM sales_summary;
INSERT INTO sales VALUES (3, 300);
SELECT * FROM sales_summary;
REFRESH MATERIALIZED VIEW sales_summary;
SELECT * FROM sales_summary;
\`\`\`

An ordinary \`VIEW\` (Module 5) is just a saved query — every time you select from it, PostgreSQL re-runs the underlying \`SELECT\` against current data. A \`MATERIALIZED VIEW\` instead **physically stores** the query's result, the way a table does, at the moment it was created or last refreshed. This makes reading from it as fast as reading a plain table — no recomputation on every read — but the trade-off is that it does **not** update automatically: a new row inserted into \`sales\` changes nothing about \`sales_summary\` until someone explicitly runs \`REFRESH MATERIALIZED VIEW\`, which fully recomputes and re-stores the result. This is the right tool for a genuinely expensive query (a heavy aggregation or join over a large table) that is read far more often than the underlying data changes, and where a slightly stale result is acceptable in exchange for speed — a dashboard summary refreshed hourly, for instance, rather than recomputed on every page load.

## \`REFRESH ... CONCURRENTLY\`

A plain \`REFRESH MATERIALIZED VIEW\` takes an exclusive lock on the view for its duration, blocking reads against it until the refresh finishes. \`REFRESH MATERIALIZED VIEW CONCURRENTLY\` avoids that, letting reads continue against the old data while the new result is computed, swapping it in only once ready — but it requires the materialized view to have at least one \`UNIQUE\` index already defined on it, since PostgreSQL needs a way to match up old and new rows to apply the refresh incrementally rather than replacing the whole thing at once:

\`\`\`sql
CREATE MATERIALIZED VIEW sales_mv AS SELECT id, amt FROM sales;
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv;   -- fails: no unique index yet

CREATE UNIQUE INDEX ON sales_mv (id);
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv;   -- now succeeds
\`\`\`

## Extensions: optional feature packages

PostgreSQL's core handles standard SQL plus everything covered so far in this course, but a wide range of additional capability ships as **extensions** — installed per-database with \`CREATE EXTENSION\` — rather than always being loaded by default:

- **\`pgcrypto\`** — hashing and encryption functions (\`digest\`, \`crypt\` for password hashing, \`pgp_sym_encrypt\`/\`pgp_sym_decrypt\` for symmetric encryption).
- **\`uuid-ossp\`** — additional UUID-generation functions (note that \`gen_random_uuid()\` itself has been part of core PostgreSQL since version 13 and needs no extension, as earlier modules confirmed).
- **\`pg_trgm\`** — breaks text into overlapping three-character sequences ("trigrams") to support fuzzy similarity matching and, notably, to make \`ILIKE '%pattern%'\` queries usable with a GIN or GiST index, which a plain B-tree cannot accelerate at all.
- **\`postgis\`** — a full suite of geographic and geometric data types, spatial indexes, and functions, turning PostgreSQL into a complete geographic information system.
- **\`pg_stat_statements\`** — tracks aggregated execution statistics (call counts, total and average time, rows returned) for every distinct query PostgreSQL has run, the standard first stop for finding your database's actual slowest or most frequent queries in production (extending the single-query \`EXPLAIN ANALYZE\` workflow from Module 10 to a whole-database view).

Reaching for an extension rather than reinventing its functionality by hand is almost always the right call once a genuine need for it arises — these are mature, widely used, and often perform work (like \`pgcrypto\`'s cryptography) that is genuinely risky to reimplement casually.

## \`LISTEN\`/\`NOTIFY\`: lightweight pub-sub between sessions

\`LISTEN channel_name\` subscribes the current session to a named channel; \`NOTIFY channel_name, 'payload'\` sends a lightweight notification, with an optional small text payload, to every session currently listening on that channel. This is a genuinely useful, very lightweight signaling mechanism — telling other connected processes "something changed, go check" without polling — but it is not a durable message queue: a notification sent while no one is listening is simply gone, with no persistence or replay, which makes it suitable for cache-invalidation signals or "wake up and re-check" hints, but not for anything that needs guaranteed delivery.

## \`psql\`: the command-line client's operational toolkit

Beyond running plain SQL, \`psql\` supports **meta-commands** (prefixed with a backslash) for everyday operational work: \`\\d table_name\` describes a table's columns, indexes, and constraints; \`\\dt\` lists tables; \`\\timing\` toggles showing how long each query took to run, an immediate, lightweight companion to \`EXPLAIN ANALYZE\`; and \`\\watch N\` re-runs the last query automatically every \`N\` seconds, useful for watching a counter or queue length change live. These are client-side conveniences, not SQL itself, but they are the daily-driver tools for anyone operating a PostgreSQL database directly from the command line.

## Closing out Module 11

This closes out the module's tour of PostgreSQL-specific power features: JSONB and arrays for flexible or irregular data (Lessons 1-3), upsert/\`RETURNING\`/\`MERGE\` for atomic, race-free writes (Lesson 4), full-text search (Lesson 5), and materialized views, extensions, and operational tooling here. Module 12 continues Part II with the operational and scale side of PostgreSQL: roles and row-level security, connection pooling, VACUUM tuning, replication, partitioning, and backups.`,

    contentHi: `## Ek materialized view: ek physically stored snapshot

\`\`\`sql
CREATE TABLE sales (id int PRIMARY KEY, amt int);
INSERT INTO sales VALUES (1, 100), (2, 200);
CREATE MATERIALIZED VIEW sales_summary AS SELECT count(*) AS n, sum(amt) AS total FROM sales;
SELECT * FROM sales_summary;
INSERT INTO sales VALUES (3, 300);
SELECT * FROM sales_summary;
REFRESH MATERIALIZED VIEW sales_summary;
SELECT * FROM sales_summary;
\`\`\`

Ek ordinary \`VIEW\` (Module 5) bas ek saved query hai — jab bhi aap ismein se select karte ho, PostgreSQL underlying \`SELECT\` ko current data ke against dobara chalata hai. Ek \`MATERIALIZED VIEW\` iske bजаय query ke result ko **physically store** karta hai. Ye isе padhne ko utna hi fast banata hai jitna ek plain table padhna, par trade-off ye hai ki ye automatically update **nahi** hota: \`sales\` mein ek nayi row insert hone se \`sales_summary\` mein kuch nahi badalta jab tak koi explicitly \`REFRESH MATERIALIZED VIEW\` na chalाye.

## \`REFRESH ... CONCURRENTLY\`

Ek plain \`REFRESH MATERIALIZED VIEW\` view par ek exclusive lock leta hai. \`REFRESH MATERIALIZED VIEW CONCURRENTLY\` ise avoid karta hai, par ise materialized view par kam se kam ek \`UNIQUE\` index pehle se defined hone ki zaroorat hai.

\`\`\`sql
CREATE MATERIALIZED VIEW sales_mv AS SELECT id, amt FROM sales;
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv;   -- fail: abhi koi unique index nahi

CREATE UNIQUE INDEX ON sales_mv (id);
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv;   -- ab succeed hota hai
\`\`\`

## Extensions: optional feature packages

PostgreSQL ka core standard SQL aur is course mein ab tak cover kiya gaya sab kuch handle karta hai, par kई additional capability **extensions** ke roop mein ship hoती hai — \`CREATE EXTENSION\` se prati-database install:

- **\`pgcrypto\`** — hashing aur encryption functions.
- **\`uuid-ossp\`** — additional UUID-generation functions.
- **\`pg_trgm\`** — text ko overlapping three-character sequences ("trigrams") mein todता hai fuzzy similarity matching support karne ke liye.
- **\`postgis\`** — geographic aur geometric data types, spatial indexes, aur functions ka ek pura suite.
- **\`pg_stat_statements\`** — PostgreSQL ne chalaayi har distinct query ke liye aggregated execution statistics track karta hai.

## \`LISTEN\`/\`NOTIFY\`: sessions ke beech lightweight pub-sub

\`LISTEN channel_name\` current session ko ek named channel se subscribe karta hai; \`NOTIFY channel_name, 'payload'\` ek lightweight notification bhejta hai. Ye ek genuinely useful, bahut lightweight signaling mechanism hai, par ye ek durable message queue nahi hai.

## \`psql\`: command-line client ka operational toolkit

Plain SQL chalाने ke pare, \`psql\` **meta-commands** support karta hai: \`\\d table_name\`, \`\\dt\`, \`\\timing\`, aur \`\\watch N\`.

## Module 11 ko band karna

Ye module ke PostgreSQL-specific power features ke tour ko band karta hai. Module 12 Part II ko PostgreSQL ke operational aur scale side ke saath jaari rakhता hai: roles aur row-level security, connection pooling, VACUUM tuning, replication, partitioning, aur backups.`,

    examples: [
      {
        title: 'A materialized view does not auto-update — REFRESH recomputes and re-stores it',
        titleHi: 'Ek materialized view auto-update nahi hota — REFRESH ise recompute aur re-store karta hai',
        code: `CREATE TABLE sales (id int PRIMARY KEY, amt int);
INSERT INTO sales VALUES (1, 100), (2, 200);
CREATE MATERIALIZED VIEW sales_summary AS SELECT count(*) AS n, sum(amt) AS total FROM sales;
SELECT * FROM sales_summary;
INSERT INTO sales VALUES (3, 300);
SELECT * FROM sales_summary;
REFRESH MATERIALIZED VIEW sales_summary;
SELECT * FROM sales_summary;`,
        output: ` n | total
---+-------
 2 | 300
(1 row)

 n | total
---+-------
 2 | 300
(1 row)

 n | total
---+-------
 3 | 600
(1 row)`,
        explain: 'The view is created with `sales` holding 2 rows totalling 300, so it initially reports `n=2, total=300`. Inserting a third row changes `sales` but NOT the already-computed, physically stored view, so the second `SELECT` still shows the stale `n=2, total=300`. Only after `REFRESH MATERIALIZED VIEW` recomputes the query does the third `SELECT` correctly show `n=3, total=600`.',
        explainHi: 'View `sales` ke 2 rows total 300 ke saath banaya jaata hai, to ye shuru mein `n=2, total=300` report karta hai. Ek teesरी row insert karna `sales` ko badalता hai par pehle-se-computed, physically stored view ko nahi, to doosरा `SELECT` abhi bhi stale `n=2, total=300` dikhaता hai. Sirf `REFRESH MATERIALIZED VIEW` query ko recompute karne ke baad teesрा `SELECT` sahi se `n=3, total=600` dikhaता hai.',
      },
      {
        title: 'REFRESH ... CONCURRENTLY fails without a unique index on the materialized view',
        titleHi: 'REFRESH ... CONCURRENTLY materialized view par ek unique index ke bina fail hota hai',
        code: `CREATE TABLE sales (id int PRIMARY KEY, amt int);
INSERT INTO sales VALUES (1, 100), (2, 200);
CREATE MATERIALIZED VIEW sales_mv AS SELECT id, amt FROM sales;
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv;`,
        output: `[ERROR] cannot refresh materialized view "public.sales_mv" concurrently`,
        explain: '`REFRESH MATERIALIZED VIEW CONCURRENTLY` needs to merge the newly computed result into the existing stored data incrementally, row by row, which requires a reliable way to match old rows against new ones — since `sales_mv` has no unique index at all yet, PostgreSQL has no such matching key to work with and refuses the concurrent refresh outright with this error.',
        explainHi: '`REFRESH MATERIALIZED VIEW CONCURRENTLY` ko naye compute hue result ko existing stored data mein incrementally, row by row, merge karna hota hai, jise purani rows ko nayi se match karne ka ek reliable tarika chahiye — kyunki `sales_mv` ke paas abhi tak koi unique index nahi hai, PostgreSQL ke paas aisa koi matching key nahi hai aur ye is error ke saath concurrent refresh ko poori tarah refuse karta hai.',
      },
      {
        title: 'Adding a unique index lets REFRESH ... CONCURRENTLY succeed',
        titleHi: 'Ek unique index add karna REFRESH ... CONCURRENTLY ko succeed hone deta hai',
        code: `CREATE TABLE sales (id int PRIMARY KEY, amt int);
INSERT INTO sales VALUES (1, 100), (2, 200);
CREATE MATERIALIZED VIEW sales_mv AS SELECT id, amt FROM sales;
CREATE UNIQUE INDEX ON sales_mv (id);
INSERT INTO sales VALUES (3, 300);
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv;
SELECT * FROM sales_mv ORDER BY id;`,
        output: ` id | amt
----+-----
 1  | 100
 2  | 200
 3  | 300
(3 rows)`,
        explain: 'Once `CREATE UNIQUE INDEX ON sales_mv (id)` gives PostgreSQL a way to match rows, `REFRESH MATERIALIZED VIEW CONCURRENTLY` succeeds, incorporating the row inserted into `sales` afterward (`id=3, amt=300`) into `sales_mv` without ever taking an exclusive lock that would have blocked concurrent reads.',
        explainHi: 'Ek baar `CREATE UNIQUE INDEX ON sales_mv (id)` PostgreSQL ko rows match karne ka ek tarika deता hai, `REFRESH MATERIALIZED VIEW CONCURRENTLY` succeed hota hai, baad mein `sales` mein insert hui row (`id=3, amt=300`) ko `sales_mv` mein incorporate karte hue bina kabhi ek exclusive lock liye jo concurrent reads ko block karta.',
      },
    ],

    mistakes: [
      {
        wrong: `-- expecting a materialized view to reflect the underlying table immediately
CREATE MATERIALIZED VIEW sales_summary AS SELECT count(*) AS n FROM sales;
INSERT INTO sales VALUES (999, 1);
SELECT * FROM sales_summary;   -- STILL shows the OLD count -- surprising if you
                                 -- expected it to behave like a plain VIEW`,
        right: `INSERT INTO sales VALUES (999, 1);
REFRESH MATERIALIZED VIEW sales_summary;   -- explicitly recompute and re-store
SELECT * FROM sales_summary;   -- NOW reflects the new row`,
        why: 'A materialized view is fundamentally different from a plain view despite the similar name: a plain view is just a saved query definition, re-executed against current data every time it is selected from, while a materialized view physically stores the result of that query as of the moment it was last computed, exactly like a table\'s contents. This means a materialized view has no built-in mechanism to notice that its underlying tables changed; it simply continues returning the same stored snapshot until something explicitly tells it to recompute, which is exactly what REFRESH MATERIALIZED VIEW does. Anyone coming from plain views naturally expects the "materialized" version to behave the same way, just faster, but the entire point of materializing a view is to trade that automatic freshness for speed, so staleness between refreshes is not a bug to work around but the fundamental trade-off the feature exists to make.',
        whyHi: 'Ek materialized view naam ke similarity ke bawजूद ek plain view se fundamentally alag hai: ek plain view bas ek saved query definition hai, jab bhi ismein se select kiya jaata hai current data ke against dobara execute hoती hai, jabki ek materialized view us query ke result ko physically store karta hai. Iska matlab ye hai ki ek materialized view ke paas ye notice karne ka koi built-in mechanism nahi hai ki iski underlying tables badal gayi hain; ye bas wahi stored snapshot lautaता rehta hai jab tak koi explicitly ise recompute karne ko na kahe.',
      },
      {
        wrong: `-- running REFRESH MATERIALIZED VIEW CONCURRENTLY without a unique index in place
CREATE MATERIALIZED VIEW sales_mv AS SELECT id, amt FROM sales;
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv;
-- ERROR: cannot refresh materialized view "sales_mv" concurrently`,
        right: `CREATE MATERIALIZED VIEW sales_mv AS SELECT id, amt FROM sales;
CREATE UNIQUE INDEX ON sales_mv (id);   -- REQUIRED before CONCURRENTLY will work
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv;`,
        why: 'A plain REFRESH MATERIALIZED VIEW simply recomputes the entire result and replaces the view\'s contents wholesale under an exclusive lock, which requires no way of matching old rows to new ones since everything is thrown away and rebuilt together. REFRESH MATERIALIZED VIEW CONCURRENTLY works differently: it computes the new result separately and then merges it into the existing stored data incrementally, row by row, precisely so that ordinary reads can continue against the old data throughout the process, and doing that incremental merge requires a reliable way to match each new row up against its corresponding old row, which is exactly what a unique index provides. Without at least one unique index already defined on the materialized view, PostgreSQL has no such matching key to work with and refuses the concurrent refresh outright, which is why creating that unique index is a prerequisite step, not an optional optimization, for using CONCURRENTLY at all.',
        whyHi: 'Ek plain `REFRESH MATERIALIZED VIEW` bas poore result ko dobara compute karta hai aur view ke contents ko ek exclusive lock ke under poori tarah replace karta hai. `REFRESH MATERIALIZED VIEW CONCURRENTLY` alag tarike se kaam karta hai: ye naye result ko alag se compute karta hai aur phir ise existing stored data mein incrementally merge karta hai, row by row, aur wo incremental merge karne ke liye har naye row ko iske corresponding purani row se match karne ka ek reliable tarika chahiye, jo theek wo hai jo ek unique index deta hai.',
      },
      {
        wrong: `-- treating LISTEN/NOTIFY as a durable, guaranteed-delivery message queue
LISTEN order_events;
-- (application logic assumes every NOTIFY sent will eventually be received,
-- even across a restart or a brief disconnect)`,
        right: `-- LISTEN/NOTIFY is a lightweight SIGNAL, not a durable queue -- for guaranteed
-- delivery, pair it with a durable table the listener re-checks on reconnect,
-- or use a proper message queue for anything that cannot afford to lose a message:
LISTEN order_events;
-- on reconnect/startup, always re-check the actual current state in a table,
-- rather than assuming no notifications were missed while disconnected`,
        why: 'A NOTIFY sent while no session happens to be listening on that channel is not stored anywhere or queued for later delivery; it is simply lost the moment it is sent, with PostgreSQL providing no retry, persistence, or replay mechanism for it. This makes LISTEN/NOTIFY well suited for lightweight signaling, telling already-connected processes "something changed, go take a look," where an occasionally missed signal is tolerable because the receiving process will check again soon anyway, but fundamentally unsuited for anything that requires a guarantee that every event will eventually be processed exactly once. Systems that genuinely need durable delivery typically pair LISTEN/NOTIFY with a durable table recording the actual state or event log, using the notification purely as a low-latency hint to check that table sooner rather than waiting for the next scheduled poll, or use a dedicated message queue system designed specifically for guaranteed delivery when the cost of losing a message is not acceptable.',
        whyHi: 'Ek `NOTIFY` jo bheja jaata hai jab koi session us channel par listen nahi kar rahi hoti wo kahin store ya baad ki delivery ke liye queue nahi hoती; ye bas bhejte hi lost ho jaati hai, PostgreSQL iske liye koi retry, persistence, ya replay mechanism nahi deta. Ye `LISTEN`/`NOTIFY` ko lightweight signaling ke liye theek banaता hai, par kisī bhi aisī cheez ke liye fundamentally unsuited jise guarantee chahiye ki har event aakhirkar process hoगa.',
      },
    ],

    realWorld: [
      {
        en: '**An hourly-refreshed materialized view backing an analytics dashboard**, trading a small amount of staleness for dramatically faster page loads on a query that would otherwise re-aggregate millions of rows on every visit.',
        hi: '**Ek hourly-refreshed materialized view jo ek analytics dashboard ko backing karta hai**, thoड़ी staleness ke badले dramatically fast page loads paate hue.',
      },
      {
        en: '**`pg_stat_statements` enabled on a production database as a standing operational tool**, letting the team query "our 10 slowest queries by total time" directly, rather than guessing which query to `EXPLAIN ANALYZE` next.',
        hi: '**`pg_stat_statements` production database par ek standing operational tool ke roop mein enable kiya gaya**, team ko "hamारी 10 sabse slow queries" seedhe query karne dete hue.',
      },
      {
        en: '**`LISTEN`/`NOTIFY` triggering an application-level cache invalidation** the instant a row changes, instead of the application polling the database on a fixed timer.',
        hi: '**`LISTEN`/`NOTIFY` ek application-level cache invalidation trigger karta hai** row badalte hi, application ke fixed timer par database poll karne ke bजаय.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a plain VIEW and a MATERIALIZED VIEW, and what does REFRESH ... CONCURRENTLY require?',
        qHi: 'Ek plain `VIEW` aur ek `MATERIALIZED VIEW` mein kya antar hai, aur `REFRESH ... CONCURRENTLY` ko kya chahiye?',
        a: 'A plain view is simply a stored query definition; PostgreSQL re-executes the underlying query against current data every single time anything selects from it, so it always reflects the latest state of the tables it depends on, at the cost of paying that query\'s full execution cost on every read. A materialized view instead physically stores the result of the query, the same way a table stores its rows, as of whenever it was last computed, which makes reading from it as cheap as reading an ordinary table, but means it does not automatically reflect any changes to the underlying data until something explicitly runs REFRESH MATERIALIZED VIEW to recompute and re-store the result. A plain REFRESH takes an exclusive lock and blocks reads for its duration; REFRESH MATERIALIZED VIEW CONCURRENTLY avoids that by computing the new result separately and merging it into the existing data incrementally so reads can continue throughout, but that incremental merge needs a way to match old rows against new ones, which is exactly why it requires at least one unique index to already exist on the materialized view, and fails outright without one.',
        aHi: 'Ek plain view bas ek stored query definition hai; PostgreSQL har baar jab bhi ismein se koi select karta hai underlying query ko current data ke against dobara execute karta hai. Ek materialized view iske bजаय query ke result ko physically store karta hai, ek table apni rows store karta hai jaisा, jab ye aakhri baar compute hui thi tabse. Ek plain `REFRESH` ek exclusive lock leта hai aur apni duration ke liye reads block karta hai; `REFRESH MATERIALIZED VIEW CONCURRENTLY` ise avoid karta hai par ise kam se kam ek unique index chahiye jo pehle se materialized view par exist karti ho.',
      },
      {
        q: 'Why is LISTEN/NOTIFY not a substitute for a durable message queue?',
        qHi: '`LISTEN`/`NOTIFY` ek durable message queue ka substitute kyun nahi hai?',
        a: 'LISTEN/NOTIFY delivers a notification only to sessions that happen to be actively listening on the relevant channel at the exact moment NOTIFY runs; there is no storage of the notification anywhere and no mechanism to redeliver it later to a session that was disconnected, not yet started, or simply not listening at that instant, which means a notification sent while nobody is listening is permanently and silently lost. This makes it an excellent fit for lightweight, best-effort signaling, where the purpose is simply to prompt an already-running process to go check some durable state sooner than it otherwise would, and an occasionally missed signal causes no real harm because the process will eventually check again anyway. It is a poor fit for any use case that requires a guarantee that every event is eventually processed exactly once, such as reliably triggering a billing action or a critical downstream side effect, because there is no retry, acknowledgment, or persistence built into the mechanism at all; systems with that requirement need either a durable table the listener reconciles against on reconnect, treating the notification purely as a latency-reducing hint, or a dedicated message queue system built specifically to guarantee delivery.',
        aHi: '`LISTEN`/`NOTIFY` ek notification sirf un sessions tak deता hai jo `NOTIFY` chalne ke theek us pal relevant channel par actively listen kar rahī hoती hain; notification ko kahin store nahi kiya jaata aur baad mein ek disconnected session ko dobara deliver karne ka koi mechanism nahi hai, jiska matlab hai jab koi listen nahi kar raha hota to ek notification permanently aur silently lost ho jaati hai. Ye lightweight, best-effort signaling ke liye ek excellent fit hai. Ye kisī bhi aisे use case ke liye ek poor fit hai jise guarantee chahiye ki har event aakhirkar exactly ek baar process hoगa.',
      },
    ],

    exercises: [
      {
        task: 'Table `sales(id int PRIMARY KEY, amt int)` with two rows. Create a materialized view `sales_summary` computing `count(*)` and `sum(amt)`. Insert a third row into `sales`, confirm the view still shows the OLD numbers, then `REFRESH` it and confirm it now shows the new totals.',
        taskHi: 'Table `sales(id, amt)` do rows ke saath. Ek materialized view `sales_summary` banao jo `count(*)` aur `sum(amt)` compute karta hai. `sales` mein ek teesरी row insert karo, confirm karo view abhi bhi PURANE numbers dikhata hai, phir ise `REFRESH` karo aur confirm karo ye ab naye totals dikhata hai.',
        hint: 'A materialized view has no automatic mechanism to notice changes to its underlying tables — only `REFRESH MATERIALIZED VIEW` recomputes and re-stores the result.',
        hintHi: 'Ek materialized view ke paas apni underlying tables mein changes notice karne ka koi automatic mechanism nahi hai — sirf `REFRESH MATERIALIZED VIEW` result ko recompute aur re-store karta hai.',
      },
      {
        task: 'Create a materialized view `sales_mv AS SELECT id, amt FROM sales` (no unique index yet). Attempt `REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv` and observe the error. Then create a unique index on `sales_mv(id)` and confirm the same `REFRESH ... CONCURRENTLY` now succeeds.',
        taskHi: 'Ek materialized view `sales_mv AS SELECT id, amt FROM sales` banao (abhi koi unique index nahi). `REFRESH MATERIALIZED VIEW CONCURRENTLY sales_mv` try karo aur error observe karo. Phir `sales_mv(id)` par ek unique index banao aur confirm karo ki wahi `REFRESH ... CONCURRENTLY` ab succeed hota hai.',
        hint: '`REFRESH ... CONCURRENTLY` merges the new result into the existing data incrementally, which needs a unique index to match old rows against new ones — without one, it refuses outright.',
        hintHi: '`REFRESH ... CONCURRENTLY` naye result ko existing data mein incrementally merge karta hai, jise purani rows ko nayi se match karne ke liye ek unique index chahiye — iske bina, ye poori tarah refuse karta hai.',
      },
      {
        task: 'In a comment (no SQL needed), list which of pgcrypto, uuid-ossp, pg_trgm, postgis, and pg_stat_statements you would reach for to: (a) hash a password, (b) support fuzzy/typo-tolerant text search, (c) find your database\'s slowest queries in production.',
        taskHi: 'Ek comment mein (koi SQL zaroori nahi), listcaro ki pgcrypto, uuid-ossp, pg_trgm, postgis, aur pg_stat_statements mein se kaunsa aap istemal karоge: (a) ek password hash karne ke liye, (b) fuzzy/typo-tolerant text search support karne ke liye, (c) production mein apni database ki sabse slow queries dhoondне ke liye.',
        hint: '(a) `pgcrypto` (`crypt`/`digest`). (b) `pg_trgm` (trigram similarity). (c) `pg_stat_statements` (aggregated per-query execution stats).',
        hintHi: '(a) `pgcrypto` (`crypt`/`digest`). (b) `pg_trgm` (trigram similarity). (c) `pg_stat_statements` (aggregated prati-query execution stats).',
      },
    ],

    keyTakeaways: [
      'A `MATERIALIZED VIEW` PHYSICALLY stores a query\'s result (like a table), unlike a plain `VIEW` (Module 5) which re-runs its query fresh on every read. Reading a materialized view is as cheap as reading a table, but it does NOT auto-update — only an explicit `REFRESH MATERIALIZED VIEW` recomputes and re-stores it. Right tool for a genuinely expensive query read far more often than the underlying data changes, where some staleness is acceptable for speed.',
      '`REFRESH MATERIALIZED VIEW` (plain) takes an exclusive lock, blocking reads during the refresh. `REFRESH ... CONCURRENTLY` lets reads continue throughout, but REQUIRES at least one `UNIQUE` index already on the view first — needed to match old rows against new ones for the incremental merge; fails outright without one.',
      'EXTENSIONS (`CREATE EXTENSION`, per-database) add whole feature packages beyond core SQL: `pgcrypto` (hashing/encryption), `uuid-ossp` (extra UUID functions — `gen_random_uuid()` itself is core since PG13), `pg_trgm` (trigram fuzzy matching, makes `ILIKE \'%x%\'` GIN/GiST-indexable), `postgis` (geographic/geometric types), `pg_stat_statements` (aggregated execution stats for EVERY query run — the whole-database extension of `EXPLAIN ANALYZE`, Module 10).',
      '`LISTEN`/`NOTIFY`: lightweight pub-sub signaling between sessions — a `NOTIFY` sent while nobody is listening is PERMANENTLY LOST, no persistence or replay. Good for "something changed, go re-check" hints; NOT a substitute for a durable message queue when guaranteed delivery matters.',
      '`psql` meta-commands (backslash-prefixed) support daily operational work: `\\d table` (describe), `\\dt` (list tables), `\\timing` (show each query\'s elapsed time), `\\watch N` (re-run the last query every N seconds).',
      'This closes Module 11\'s power-features tour (JSONB/arrays, upsert/RETURNING/MERGE, full-text search, materialized views/extensions/tooling). Module 12 continues Part II with PostgreSQL\'s operational/scale side: roles & RLS, connection pooling, VACUUM tuning, replication, partitioning, backups.',
    ],
    keyTakeawaysHi: [
      'Ek `MATERIALIZED VIEW` ek query ke result ko PHYSICALLY store karta hai (table ki tarah), ek plain `VIEW` (Module 5) ke uलт jo har read par apni query fresh dobara chalata hai. Ye AUTO-UPDATE NAHI hota — sirf ek explicit `REFRESH MATERIALIZED VIEW` ise recompute aur re-store karta hai.',
      '`REFRESH MATERIALIZED VIEW` (plain) ek exclusive lock leta hai. `REFRESH ... CONCURRENTLY` reads ko chalte rehne deta hai, par ise pehle se view par kam se kam ek `UNIQUE` index CHAHIYE — iske bina, ye poori tarah refuse karta hai.',
      'EXTENSIONS (`CREATE EXTENSION`, prati-database) core SQL se pare poore feature packages add karte hain: `pgcrypto`, `uuid-ossp`, `pg_trgm`, `postgis`, `pg_stat_statements`.',
      '`LISTEN`/`NOTIFY`: sessions ke beech lightweight pub-sub signaling — ek `NOTIFY` jo koi na sunne par bheja jaata hai PERMANENTLY LOST ho jaati hai. "Kuch badla, dobara check karo" hints ke liye achha; guaranteed delivery ke liye durable message queue ka substitute NAHI.',
      '`psql` meta-commands daily operational kaam support karte hain: `\\d table`, `\\dt`, `\\timing`, `\\watch N`.',
      'Ye Module 11 ke power-features tour ko band karta hai. Module 12 Part II ko PostgreSQL ke operational/scale side ke saath jaari rakhता hai: roles & RLS, connection pooling, VACUUM tuning, replication, partitioning, backups.',
    ],
  },
];
